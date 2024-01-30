import type { NextRequest } from 'next/server';

import { NextResponse } from 'next/server';
import { Octokit } from 'octokit';

import { db } from '@/server/db';

export type TSummaryRequest = {
  userId: string;
  repoName: string;
};

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as TSummaryRequest;
    const userId = body.userId;

    const account = await db.account.findFirstOrThrow({
      where: {
        userId
      }
    });
    const octokit = new Octokit({
      auth: account.access_token
    });

    const users = await octokit.rest.users.getAuthenticated();
    console.log(users.data.login);

    const response = await octokit.rest.repos.getContent({
      owner: users.data.login,
      repo: body.repoName,
      path: '',
      headers: {
        'X-GitHub-Api-Version': '2022-11-28'
      }
    });

    // TODO: Add logic to parse the response and return the summary

    return NextResponse.json({ output: response }, { status: 200 });
  } catch (error: unknown) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
