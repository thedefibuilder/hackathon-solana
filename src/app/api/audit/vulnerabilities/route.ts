import type { NextRequest } from 'next/server';

import { NextResponse } from 'next/server';
import { Octokit } from 'octokit';

import { auditJsonSchema, auditorAgent } from '@/agents/audit';
import { getServerAuthSession } from '@/server/auth';
import { db } from '@/server/db';

export type TVulnerabilityRequest = {
  repoName: string;
  ghUsername: string;
  filePath: string;
};

export async function POST(request: NextRequest) {
  try {
    const { repoName, ghUsername, filePath } = (await request.json()) as TVulnerabilityRequest;
    const session = await getServerAuthSession();

    const account = await db.account.findFirstOrThrow({
      where: {
        userId: session?.user.id
      }
    });
    const octokit = new Octokit({
      auth: account.access_token
    });

    // Get the content of the selected files
    const fileContentResponse = await octokit.rest.repos.getContent({
      owner: ghUsername,
      repo: repoName,
      path: filePath
    });

    if (
      fileContentResponse.status === 200 &&
      typeof fileContentResponse.data === 'object' &&
      'content' in fileContentResponse.data &&
      typeof fileContentResponse.data.content === 'string' &&
      'path' in fileContentResponse.data &&
      typeof fileContentResponse.data.path === 'string'
    ) {
      const fileContent = Buffer.from(fileContentResponse.data.content, 'base64').toString('utf8');
      const auditResponse = await auditorAgent().invoke({
        code: 'FILENAME: ' + filePath + '\nCODE:' + fileContent
      });

      return NextResponse.json(
        { data: [...auditJsonSchema.parse(auditResponse).issues] },
        { status: 200 }
      );
    }

    // If status is not 200
    return NextResponse.json(
      { data: fileContentResponse.data },
      { status: fileContentResponse.status }
    );
  } catch (error: unknown) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
