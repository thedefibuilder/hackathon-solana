import type { NextRequest } from 'next/server';

import { NextResponse } from 'next/server';
import { Octokit } from 'octokit';

import { AUDITOR_SYSTEM_MESSAGE } from '@/agents/audit';
import { fileAgent, fileAgentSchema } from '@/agents/file';
import { db } from '@/server/db';

export type TVulnerabilityRequest = {
  userId: string;
  repoName: string;
};

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as TVulnerabilityRequest;
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
      task: AUDITOR_SYSTEM_MESSAGE,
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

        if (
          fileContentResponse.status === 200 &&
          typeof fileContentResponse.data === 'object' &&
          'content' in fileContentResponse.data &&
          typeof fileContentResponse.data.content === 'string' &&
          'path' in fileContentResponse.data &&
          typeof fileContentResponse.data.path === 'string'
        ) {
          return {
            content: Buffer.from(fileContentResponse.data.content, 'base64').toString('utf8'),
            path: fileContentResponse.data.path
          };
        }
        return {
          content: '',
          path: ''
        };
      })
    );

    // give the contents to auditor agent and get the result
    console.log(selectedFilesContent);

    return NextResponse.json({ output: 'Hello Brat!' }, { status: 200 });
  } catch (error: unknown) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
