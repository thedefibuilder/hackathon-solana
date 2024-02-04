import type { TMockedFileKey } from '@/constants/__mocked-responses__';
import type { NextRequest } from 'next/server';

import { NextResponse } from 'next/server';
import { Octokit } from 'octokit';

import { auditJsonSchema, auditorAgent } from '@/agents/audit';
import { mockedFileVulnerabilities } from '@/constants/__mocked-responses__';
import { env } from '@/env';
import { getServerAuthSession } from '@/server/auth';
import { db } from '@/server/db';

export const dynamic = 'force-dynamic';

export type TVulnerabilityRequest = {
  repoName: string;
  ghUsername: string;
  filePath: string;
};

export async function POST(request: NextRequest) {
  if (env.NODE_ENV === 'production') {
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

      const fileContentResponse = await octokit.rest.repos.getContent({
        owner: ghUsername,
        repo: repoName,
        path: filePath
      });

      if (
        fileContentResponse.status === 200 &&
        typeof fileContentResponse.data === 'object' &&
        'content' in fileContentResponse.data &&
        typeof fileContentResponse.data.content === 'string'
      ) {
        const fileContent = Buffer.from(fileContentResponse.data.content, 'base64').toString(
          'utf8'
        );
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

  const { filePath } = (await request.json()) as TVulnerabilityRequest;

  return NextResponse.json(
    { data: mockedFileVulnerabilities[filePath as TMockedFileKey] },
    { status: 200 }
  );
}
