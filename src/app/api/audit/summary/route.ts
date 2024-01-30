import type { NextRequest } from 'next/server';

import { NextResponse } from 'next/server';
import { Octokit } from 'octokit';

import { fileAgent, fileAgentSchema } from '@/agents/file';
import { SUMMARY_SYSTEM_MESSAGE, summaryAgent } from '@/agents/summary';
import { db } from '@/server/db';

export type TSummaryRequest = {
  userId: string;
  repoName: string;
};

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as TSummaryRequest;
    const userId = body.userId;
    const repoName = body.repoName;

    const account = await db.account.findFirstOrThrow({
      where: {
        userId
      }
    });
    const octokit = new Octokit({
      auth: account.access_token
    });
    const user = await octokit.rest.users.getAuthenticated();
    const projectTree = await octokit.rest.git.getTree({
      owner: user.data.login,
      repo: repoName,
      tree_sha: 'main',
      recursive: 'true'
    });

    const allFiles = projectTree.data.tree
      .filter((item) => item.type == 'blob')
      .map((file) => file.path);

    const selectedFilesResponse = await fileAgent().invoke({
      task: SUMMARY_SYSTEM_MESSAGE,
      files: allFiles
    });
    const selectedFiles = fileAgentSchema.parse(selectedFilesResponse).files;

    const selectedFilesContent = await Promise.all(
      selectedFiles.map(async (file) => {
        const fileContentResponse = await octokit.rest.repos.getContent({
          owner: user.data.login,
          repo: repoName,
          path: file
        });
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
        return Buffer.from((fileContentResponse.data as any).content, 'base64').toString('utf8');
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
