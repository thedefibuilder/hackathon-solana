import React from 'react';

import Image from 'next/image';
import { Octokit } from 'octokit';

import CodigoDialog from '@/app/_components/codigo/dialog';
import solanaLogo from '@/assets/images/solana.png';
import AuthStatus from '@/components/auth-status';
import { getServerAuthSession } from '@/server/auth';
import { db } from '@/server/db';

import ReposTable from './_components/repos/table';

export default async function Home() {
  const session = await getServerAuthSession();

  const account =
    session &&
    (await db.account.findFirst({
      where: {
        userId: session?.user.id
      }
    }));

  const octokit = new Octokit({
    auth: account?.access_token
  });

  return (
    <main className='mx-auto flex h-full max-h-full w-full max-w-7xl flex-col items-center justify-center overflow-hidden p-5'>
      {account ? (
        <div className='mx-auto flex h-full max-h-full w-full max-w-7xl flex-col items-center justify-center overflow-hidden p-5'>
          <div className='flex w-full items-start justify-between pb-5'>
            <div className='flex items-center'>
              <Image src={solanaLogo.src} alt='Solana' width={24} height={24} />
              <h1 className='ml-2 text-3xl'>Solana AI Auditor</h1>
            </div>

            <div className='flex justify-between gap-x-2.5'>
              <div className='flex flex-col'>
                <p>Want to bootstrap a project quickly?</p>
                <p>Use Código!</p>
              </div>

              <CodigoDialog />
            </div>
          </div>
          <ReposTable octokit={octokit} />
        </div>
      ) : (
        <AuthStatus />
      )}
    </main>
  );
}
