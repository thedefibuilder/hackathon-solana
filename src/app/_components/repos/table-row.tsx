import React from 'react';

import { type Octokit } from 'octokit';

import { TableCell, TableRow } from '@/components/ui/table';

import AuditDialog from '../audit/dialog';

type TReposTableRowProperties = {
  octokit: Octokit;
  ghUsername: string;
  name: string;
  visibility: string;
};

export default async function ReposTableRow({
  octokit,
  ghUsername,
  name,
  visibility
}: TReposTableRowProperties) {
  const isRepoAuditable = await isRepoAuditableAction(octokit, ghUsername, name);

  return (
    <TableRow>
      <TableCell className='font-medium'>{name}</TableCell>
      <TableCell>{ghUsername}</TableCell>
      <TableCell>{visibility}</TableCell>
      <TableCell>
        <AuditDialog
          ghUsername={ghUsername}
          repoName={name}
          buttonProperties={{ disabled: !isRepoAuditable }}
        />
      </TableCell>
    </TableRow>
  );
}

async function isRepoAuditableAction(octokit: Octokit, ghUsername: string, repoName: string) {
  'use server';

  try {
    const languages = await octokit.rest.repos.listLanguages({
      owner: ghUsername,
      repo: repoName
    });

    return languages.data.Rust === undefined ? false : true;
  } catch (error: unknown) {
    console.error('ERROR FETCHING LANGUAGES', error);
  }
}
