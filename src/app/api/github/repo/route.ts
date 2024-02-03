import type { NextRequest } from 'next/server';

import { NextResponse } from 'next/server';
import { Octokit } from 'octokit';

import { getServerAuthSession } from '@/server/auth';
import { db } from '@/server/db';

export type TGithubRepoRequest = {
  repoName: string;
  ghUsername: string;
  cidlYaml: string;
};

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as TGithubRepoRequest;
    const { repoName, ghUsername, cidlYaml } = body;
    const session = await getServerAuthSession();
    const account = await db.account.findFirstOrThrow({
      where: {
        userId: session?.user.id
      }
    });
    const octokit = new Octokit({
      auth: account.access_token
    });

    const repoResponse = await octokit.rest.repos.createForAuthenticatedUser({
      name: repoName,
      description: 'This repo was created by the Codigo app'
    });

    if (repoResponse.status !== 201) {
      throw new Error('Failed to create repo');
    }

    const contentResponse = await octokit.rest.repos.createOrUpdateFileContents({
      owner: ghUsername,
      repo: repoName,
      path: 'cidl.yaml',
      message: 'chore: add codigo.yaml',
      content: Buffer.from(cidlYaml).toString('base64')
    });

    return NextResponse.json(
      { data: contentResponse.data.commit.html_url },
      { status: contentResponse.status }
    );
  } catch (error: unknown) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
