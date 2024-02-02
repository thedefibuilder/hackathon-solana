/* eslint-disable unicorn/no-array-reduce */

'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';

import type { TVulnerability } from '@/agents/audit';

import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import useGetOverflowX from '@/custom-hooks/use-get-overflow-x';
import { cn } from '@/lib/utils';

type TFileRowProperties = {
  promise: Record<string, Promise<Response>>;
};

export default function FileRow({ promise }: TFileRowProperties) {
  const filePathContainerReference = useRef<HTMLSpanElement | null>(null);

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
        const json: unknown = await clonedResponse.json();

        if (
          json &&
          typeof json === 'object' &&
          'data' in json &&
          json.data &&
          Array.isArray(json.data)
        ) {
          const data = json.data as TVulnerability[];
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
    <li className='flex h-auto w-full items-center justify-between gap-x-5 rounded-md border border-border p-2.5 hover:bg-muted/50'>
      <div className='flex w-3/4 max-w-[75%] flex-col gap-y-1.5 overflow-hidden'>
        <span className='text-xs text-muted-foreground'>File path</span>
        <span
          ref={filePathContainerReference}
          className={cn('overflow-x-auto whitespace-nowrap text-sm font-semibold', {
            'pb-3.5 ': isFilePathContainerOverflowingX
          })}
        >
          {filePath}
          {filePath}
        </span>
      </div>

      <Separator orientation='vertical' />

      {isLoading ? (
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
