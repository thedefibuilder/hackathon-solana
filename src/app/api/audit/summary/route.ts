/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
import type { NextRequest } from 'next/server';

import { NextResponse } from 'next/server';
import { Octokit } from 'octokit';

import { summaryAgent } from '@/agents/summary';
import { mockedSummary } from '@/constants/__mocked-responses__';
import { env } from '@/env';
import { getServerAuthSession } from '@/server/auth';
import { db } from '@/server/db';

export const maxDuration = 300;
export const dynamic = 'force-dynamic';

export type TSummaryRequest = {
  repoName: string;
  ghUsername: string;
};

export async function POST(request: NextRequest) {
  const session = await getServerAuthSession();

  if (!session) {
    return NextResponse.json(
      { data: 'You must be logged in to access this route!' },
      { status: 401 }
    );
  }

  if (env.NODE_ENV === 'production') {
    try {
      const { repoName, ghUsername } = (await request.json()) as TSummaryRequest;
      const account = await db.account.findFirstOrThrow({
        where: {
          userId: session?.user.id
        }
      });
      const octokit = new Octokit({
        auth: account.access_token
      });
      const repoDetails = await octokit.rest.repos.get({
        owner: ghUsername,
        repo: repoName
      });
      const projectTree = await octokit.rest.git.getTree({
        owner: ghUsername,
        repo: repoName,
        tree_sha: repoDetails.data.default_branch,
        recursive: 'true'
      });

      const selectedFiles = projectTree.data.tree
        .filter(
          (item) =>
            item.type == 'blob' &&
            (item.path?.endsWith('.rs') ||
              item.path?.endsWith('.md') ||
              item.path?.endsWith('.toml') ||
              item.path?.endsWith('.yaml') ||
              item.path?.endsWith('.yml'))
        )
        .map((file) => file.path) as string[];

      const selectedFilesContent = await Promise.all(
        selectedFiles.map(async (file) => {
          const fileContentResponse = await octokit.rest.repos.getContent({
            owner: ghUsername,
            repo: repoName,
            path: file
          });

          if (
            fileContentResponse.status === 200 &&
            typeof fileContentResponse.data === 'object' &&
            'content' in fileContentResponse.data &&
            typeof fileContentResponse.data.content === 'string'
          ) {
            return Buffer.from(fileContentResponse.data.content, 'base64').toString('utf8');
          }
          return '';
        })
      );
      const summary = await summaryAgent().invoke({
        info: selectedFilesContent.join('\n')
      });

      return NextResponse.json({ data: summary }, { status: 200 });
    } catch (error: unknown) {
      return NextResponse.json({ error }, { status: 500 });
    }
  }

  return NextResponse.json(
    {
      data: mockedSummary
    },
    { status: 200 }
  );
}
