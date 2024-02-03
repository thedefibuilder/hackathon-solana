import React from 'react';

import { type Octokit } from 'octokit';

import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';

import ReposTableRow from './table-row';

const tableHeader = ['Name', 'Owner', 'Visibility', 'Action'];

type TReposTableProperties = {
  octokit: Octokit;
};

export default async function ReposTable({ octokit }: TReposTableProperties) {
  const userRepos = await getUserReposAction(octokit);

  return (
    <section className='mx-auto max-h-full w-full max-w-7xl overflow-y-auto rounded-md border-2'>
      <Table className='relative overflow-y-auto'>
        <TableHeader className='sticky top-0 z-[1] bg-background'>
          <TableRow>
            {tableHeader.map((header, index) => (
              <TableHead key={`${header}-${index}`} className='w-[100px]'>
                {header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {userRepos?.data.map((repo) => (
            <ReposTableRow
              key={repo.id}
              octokit={octokit}
              ghUsername={repo.owner.login}
              name={repo.name}
              visibility={repo.visibility ?? ''}
            />
          ))}
        </TableBody>
      </Table>
    </section>
  );
}

async function getUserReposAction(octokit: Octokit) {
  'use server';

  let userRepos = null;

  try {
    userRepos = await octokit.request('GET /user/repos', {
      headers: {
        'X-GitHub-Api-Version': '2022-11-28'
      }
    });
  } catch (error: unknown) {
    console.error('ERROR FETCHING REPOS', error);
  }

  return userRepos;
}
