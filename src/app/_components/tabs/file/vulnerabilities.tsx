import React from 'react';

import type { TVulnerability } from '@/agents/audit';

import FileVulnerability from './vulnerability';

type TFileVulnerabilitiesProperties = {
  ghUsername: string;
  repoName: string;
  fileVulnerabilities: TVulnerability[] | null;
};

export default function FileVulnerabilities({
  ghUsername,
  repoName,
  fileVulnerabilities
}: TFileVulnerabilitiesProperties) {
  return (
    <div className='flex h-full w-full flex-col gap-y-2.5 px-3'>
      <p className='font-semibold'>Vulnerabilities</p>

      <ul className='flex h-full w-full flex-col gap-y-5'>
        {fileVulnerabilities?.map((vulnerability, index) => (
          <FileVulnerability
            key={index}
            ghUsername={ghUsername}
            repoName={repoName}
            vulnerability={vulnerability}
          />
        ))}
      </ul>
    </div>
  );
}
