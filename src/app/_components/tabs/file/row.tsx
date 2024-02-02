/* eslint-disable unicorn/no-array-reduce */

'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';

import type { TVulnerability } from '@/agents/audit';

import { ChevronDown } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import useGetOverflowX from '@/custom-hooks/use-get-overflow-x';
import { cn } from '@/lib/utils';

import FileVulnerabilities from './vulnerabilities';

type TFileRowProperties = {
  ghUsername: string;
  repoName: string;
  promise: Record<string, Promise<Response>>;
};

export default function FileRow({ ghUsername, repoName, promise }: TFileRowProperties) {
  const filePathContainerReference = useRef<HTMLSpanElement | null>(null);

  const [isRowExpanded, setIsRowExpanded] = useState(false);

  const [filePath, setFilePath] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isError, setIsError] = useState(false);
  const [fileVulnerabilities, setFileVulnerabilities] = useState<TVulnerability[] | null>(null);

  // prettier-ignore
  const { 
    isOverflowingX: isFilePathContainerOverflowingX 
  } = useGetOverflowX(filePathContainerReference, filePath);

  useEffect(() => {
    async function resolvePromise() {
      const entry = Object.entries(promise)[0];

      if (!entry) return;

      const [filePath, promiseInstance] = entry;
      setFilePath(filePath);

      const response = await promiseInstance;

      // eslint-disable-next-line unicorn/consistent-function-scoping
      async function handleResponse(clonedResponse: Response) {
        const responseBody: unknown = await clonedResponse.json();

        if (
          responseBody &&
          typeof responseBody === 'object' &&
          'data' in responseBody &&
          responseBody.data &&
          Array.isArray(responseBody.data)
        ) {
          const data = responseBody.data as TVulnerability[];
          setIsLoading(false);
          setIsError(false);
          setFileVulnerabilities(data);
        } else {
          setIsLoading(false);
          setIsError(true);
          setFileVulnerabilities(null);
        }
      }

      if (!response.bodyUsed) {
        setIsLoading(true);

        if (response.ok) {
          const clonedResponse = response.clone();
          await handleResponse(clonedResponse);
          return;
        }
      }

      const clonedResponse = response.clone();
      await handleResponse(clonedResponse);
    }

    resolvePromise();
  }, [promise]);

  const lowSeverityCount = useMemo(() => {
    if (fileVulnerabilities) {
      return fileVulnerabilities?.reduce((accumulator, currentAudit) => {
        return currentAudit.severity === 'Low' ? accumulator + 1 : accumulator;
      }, 0);
    }

    return 0;
  }, [fileVulnerabilities]);

  const mediumSeverityCount = useMemo(() => {
    if (fileVulnerabilities) {
      return fileVulnerabilities?.reduce((accumulator, currentAudit) => {
        return currentAudit.severity === 'Medium' ? accumulator + 1 : accumulator;
      }, 0);
    }

    return 0;
  }, [fileVulnerabilities]);

  const highSeverityCount = useMemo(() => {
    if (fileVulnerabilities) {
      return fileVulnerabilities?.reduce((accumulator, currentAudit) => {
        return currentAudit.severity === 'High' ? accumulator + 1 : accumulator;
      }, 0);
    }

    return 0;
  }, [fileVulnerabilities]);

  return (
    <li
      className={cn('flex h-auto w-full flex-col gap-y-5 rounded-md border border-border p-2.5', {
        'bg-muted/25': isRowExpanded,
        'hover:bg-muted/25': !isRowExpanded
      })}
    >
      <div className='flex h-full w-full items-center justify-between gap-x-5'>
        <div className='flex w-2/3 max-w-[66.666667%] flex-col gap-y-1.5 overflow-hidden'>
          <span className='text-xs text-muted-foreground'>File path</span>
          <span
            ref={filePathContainerReference}
            className={cn('overflow-x-auto whitespace-nowrap text-sm font-medium', {
              'pb-3.5 ': isFilePathContainerOverflowingX
            })}
          >
            {filePath}
          </span>
        </div>

        <Separator orientation='vertical' />

        {isLoading ? (
          <Skeleton className='h-10 w-1/3 max-w-[33.333333%]' />
        ) : (
          <div className='flex w-1/3 max-w-[33.333333%] items-center justify-between gap-x-5'>
            <div className='flex w-full flex-col gap-y-1.5'>
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

            <Button
              variant='ghost'
              className='h-7 w-7'
              onClick={() => setIsRowExpanded((previousState) => !previousState)}
            >
              <ChevronDown
                className={cn('h-5 w-5 shrink-0 transition-transform', {
                  'rotate-180': isRowExpanded
                })}
              />
            </Button>
          </div>
        )}
      </div>

      {isRowExpanded ? (
        <>
          <Separator />

          <FileVulnerabilities
            ghUsername={ghUsername}
            repoName={repoName}
            fileVulnerabilities={fileVulnerabilities}
          />
        </>
      ) : null}
    </li>
  );
}
