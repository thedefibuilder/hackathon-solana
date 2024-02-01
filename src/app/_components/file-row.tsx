/* eslint-disable unicorn/no-array-reduce */

import React, { useEffect, useRef, useState } from 'react';

import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import useAuditFileVulnerabilities from '@/custom-hooks/use-audit-file-vulnerabilities';
import { cn } from '@/lib/utils';

type TFileRowProperties = {
  ghUsername: string;
  repoName: string;
  filePath: string;
};

export default function FileRow({ ghUsername, repoName, filePath }: TFileRowProperties) {
  const filePathContainerReference = useRef<HTMLSpanElement | null>(null);

  const [isXOverflowing, setIsXOverflowing] = useState(false);

  const {
    isFileVulnerabilitiesLoading,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isFileVulnerabilitiesError,
    fileVulnerabilitiesData,
    getFileVulnerabilities
  } = useAuditFileVulnerabilities(ghUsername, repoName);

  useEffect(() => {
    const container = filePathContainerReference.current;

    if (container) {
      const isOverflowing = container.scrollWidth > container.clientWidth;
      setIsXOverflowing(isOverflowing);
    }
  }, []);

  useEffect(() => {
    getFileVulnerabilities(filePath);
  }, [filePath, getFileVulnerabilities]);

  const lowSeverityCount = fileVulnerabilitiesData?.reduce((accumulator, currentAudit) => {
    return currentAudit.severity === 'Low' ? accumulator + 1 : accumulator;
  }, 0);

  const mediumSeverityCount = fileVulnerabilitiesData?.reduce((accumulator, currentAudit) => {
    return currentAudit.severity === 'Medium' ? accumulator + 1 : accumulator;
  }, 0);
  const highSeverityCount = fileVulnerabilitiesData?.reduce((accumulator, currentAudit) => {
    return currentAudit.severity === 'High' ? accumulator + 1 : accumulator;
  }, 0);

  return (
    <li className='flex h-auto w-full items-center justify-between gap-x-5 rounded-md border border-border p-2.5 hover:bg-muted/50'>
      <div className='flex w-3/4 max-w-[75%] flex-col gap-y-1.5 overflow-hidden'>
        <span className='text-xs text-muted-foreground'>File path</span>
        <span
          ref={filePathContainerReference}
          className={cn('overflow-x-auto whitespace-nowrap text-sm font-semibold', {
            'pb-3.5 ': isXOverflowing
          })}
        >
          {filePath}
        </span>
      </div>

      <Separator orientation='vertical' />

      {isFileVulnerabilitiesLoading ? (
        <Skeleton className='h-10 w-1/4 max-w-[25%]' />
      ) : (
        <div className='flex w-1/4 max-w-[25%] flex-col gap-y-1.5'>
          <span className='text-xs text-muted-foreground'>Vulnerabilities</span>

          <div className='flex gap-x-2.5'>
            <span className='w-1/3 text-left text-sm font-semibold text-green-400'>
              {lowSeverityCount} Low
            </span>
            <span className='w-1/3 text-center text-sm font-semibold text-yellow-400'>
              {mediumSeverityCount} Medium
            </span>
            <span className='w-1/3 text-right text-sm font-semibold text-red-400'>
              {highSeverityCount} High
            </span>
          </div>
        </div>
      )}
    </li>
  );
}
