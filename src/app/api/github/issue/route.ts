import type { TVulnerability } from '@/agents/audit';
import type { NextRequest } from 'next/server';

import { NextResponse } from 'next/server';
import { Octokit } from 'octokit';

import { getServerAuthSession } from '@/server/auth';
import { db } from '@/server/db';

export type TGithubIssueRequest = {
  repoName: string;
  ghUsername: string;
  issue: TVulnerability;
};

export async function POST(request: NextRequest) {
  const session = await getServerAuthSession();

  if (!session) {
    return NextResponse.json(
      { data: 'You must be logged in to access this route!' },
      { status: 401 }
    );
  }

  try {
    const body = (await request.json()) as TGithubIssueRequest;
    const { repoName, ghUsername, issue } = body;

    const account = await db.account.findFirstOrThrow({
      where: {
        userId: session?.user.id
      }
    });
    const octokit = new Octokit({
      auth: account.access_token
    });
    const baseRepoUrl = `https://github.com/${ghUsername}/${repoName}/blob/main/${issue.location.file}`;
    const codeReference = `${baseRepoUrl}#L${issue.location.start_line}-L${issue.location.end_line}`;
    const issueContent = `## Description\n${issue.description}\n\n## Location\n[View issue in code](${codeReference})\n\n## Recommendation\n${issue.recommendation ?? 'No recommendation provided'}`;

    const issueResponse = await octokit.rest.issues.create({
      owner: ghUsername,
      repo: repoName,
      title: issue.title,
      body: issueContent,
      labels: [`audit-${issue.severity.toLowerCase()}`]
    });
    if (issueResponse.status !== 201) {
      throw new Error('Failed to create issue');
    }

    return NextResponse.json({ data: issueResponse.data.html_url }, { status: 201 });
  } catch (error: unknown) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
