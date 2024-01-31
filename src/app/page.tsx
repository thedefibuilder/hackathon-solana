import React from 'react';

import { Octokit } from 'octokit';

import { getServerAuthSession } from '@/server/auth';
import { db } from '@/server/db';

import ReposTable from './_components/repos/table';

export default async function Home() {
  const session = await getServerAuthSession();

  const account = await db.account.findFirst({
    where: {
      userId: session?.user.id
    }
  });

  const octokit = new Octokit({
    auth: account?.access_token
  });

  const ghUser = await octokit.rest.users.getAuthenticated();

  return (
    <main className='flex h-full w-full flex-col items-center justify-center overflow-hidden p-5'>
      <ReposTable octokit={octokit} ghUsername={ghUser.data.login} />
    </main>
  );
}
