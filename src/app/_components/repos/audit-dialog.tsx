'use client';

import React, { useCallback, useState } from 'react';

import type { ButtonProperties } from '@/components/ui/button';

import { format } from 'date-fns';
import { Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { fnsDateFormat } from '@/constants/misc';
import useAuditMethodology from '@/custom-hooks/use-audit-methodology';
import useAuditSummary from '@/custom-hooks/use-audit-summary';

const assessmentStartDate = format(new Date('Mon Jan 15 2024'), fnsDateFormat);
const assessmentEndDate = format(new Date(), fnsDateFormat);

enum ETabs {
  methodology = 'Methodology',
  summary = 'Summary',
  vulnerabilities = 'Vulnerabilities'
}
type TAuditDialogProperties = {
  ghUsername: string;
  repoName: string;
  buttonProperties: ButtonProperties;
};

export default function AuditDialog({
  ghUsername,
  repoName,
  buttonProperties
}: TAuditDialogProperties) {
  /*
    TODO
    - Finish UI & Vulnerabilities validation;
    - Handle errors;
    - Refactor methods to cache methods results;
      - Add button inside Dialog to start a new audit;
    - Download Audit PDF Document;
  */

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // prettier-ignore
  const { 
    isMethodologyLoading, 
    isMethodologyError, 
    methodologyData, 
    getMethodology 
  } = useAuditMethodology();

  // prettier-ignore
  const {
    isSummaryLoading,
    isSummaryError,
    summaryData,
    getSummary
  } = useAuditSummary(ghUsername, repoName);

  const [isVulnerabilitiesLoading, setIsVulnerabilitiesLoading] = useState(true);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isVulnerabilitiesError, setIsVulnerabilitiesError] = useState(true);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [vulnerabilitiesData, setVulnerabilitiesData] = useState<string[] | null>(null);

  const getVulnerabilities = useCallback(async () => {
    try {
      setIsVulnerabilitiesLoading(true);

      const response = await fetch('/api/audit/vulnerabilities', {
        method: 'POST',
        body: JSON.stringify({ ghUsername, repoName })
      });

      if (response.ok) {
        const json: unknown = await response.json();

        if (
          json &&
          typeof json === 'object' &&
          'data' in json &&
          json.data &&
          Array.isArray(json.data)
        ) {
          const data = json.data;

          setTimeout(() => {
            setIsVulnerabilitiesLoading(false);
            setIsVulnerabilitiesError(false);
            setVulnerabilitiesData(data);

            console.log('VULNERABILITIES DATA', json.data);
          }, 5000);

          return;
        }
      }

      setIsVulnerabilitiesLoading(false);
      setIsVulnerabilitiesError(true);
      setVulnerabilitiesData(null);
    } catch (error: unknown) {
      setIsVulnerabilitiesLoading(false);
      setIsVulnerabilitiesError(true);
      setVulnerabilitiesData(null);

      console.error('ERROR FETCHING VULNERABILITIES', error);
    }
  }, [ghUsername, repoName]);

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button
          {...buttonProperties}
          onClick={() => {
            getMethodology().catch((error: unknown) =>
              console.error('ERROR FETCHING METHODOLOGY', error)
            );

            getSummary().catch((error: unknown) => console.error('ERROR FETCHING SUMMARY', error));

            getVulnerabilities().catch((error: unknown) =>
              console.error('ERROR FETCHING VULNERABILITIES', error)
            );
          }}
        >
          Audit
        </Button>
      </DialogTrigger>
      <DialogContent className='flex h-[calc(100%-10rem)] w-[calc(100%-10rem)] max-w-[calc(100%-10rem)] flex-col'>
        <DialogHeader>
          <DialogTitle>Solana AI Auditor</DialogTitle>
          <DialogDescription>
            This assessment was conducted between {assessmentStartDate} and {assessmentEndDate}.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue={ETabs.methodology} className='h-full w-full overflow-hidden'>
          <TabsList className='h-10 w-full'>
            <TabsTrigger
              value={ETabs.methodology}
              className='flex w-1/3 items-center justify-center gap-x-2.5'
            >
              {isMethodologyLoading ? <Loader2 className='h-5 w-5 animate-spin' /> : null}
              {ETabs.methodology}
            </TabsTrigger>
            <TabsTrigger
              value={ETabs.summary}
              className='flex w-1/3 items-center justify-center gap-x-2.5'
            >
              {isSummaryLoading ? <Loader2 className='h-5 w-5 animate-spin' /> : null}
              {ETabs.summary}
            </TabsTrigger>
            <TabsTrigger
              value={ETabs.vulnerabilities}
              className='flex w-1/3 items-center justify-center gap-x-2.5'
            >
              {isVulnerabilitiesLoading ? <Loader2 className='h-5 w-5 animate-spin' /> : null}
              {ETabs.vulnerabilities}
            </TabsTrigger>
          </TabsList>

          <TabsContent
            value={ETabs.methodology}
            className='h-[calc(100%-3rem)] w-full overflow-y-auto rounded-md border border-border p-2.5'
          >
            {isMethodologyLoading ? (
              <div className='relative flex h-full w-full items-center justify-center'>
                <Skeleton className='h-full w-full rounded-md' />
                <p className='absolute'>Generating Audit&apos;s {ETabs.methodology}</p>
              </div>
            ) : (
              <p>{methodologyData}</p>
            )}
          </TabsContent>
          <TabsContent
            value={ETabs.summary}
            className='h-[calc(100%-3rem)] w-full overflow-y-auto rounded-md border border-border p-2.5'
          >
            {isSummaryLoading ? (
              <div className='relative flex h-full w-full items-center justify-center'>
                <Skeleton className='h-full w-full rounded-md' />
                <p className='absolute'>Generating Audit&apos;s {ETabs.summary}</p>
              </div>
            ) : (
              <p>{summaryData}</p>
            )}
          </TabsContent>
          <TabsContent
            value={ETabs.vulnerabilities}
            className='h-[calc(100%-3rem)] w-full overflow-y-auto rounded-md border border-border p-2.5'
          >
            {isVulnerabilitiesLoading ? (
              <div className='relative flex h-full w-full items-center justify-center'>
                <Skeleton className='h-full w-full rounded-md' />
                <p className='absolute'>Generating Audit&apos;s {ETabs.vulnerabilities}</p>
              </div>
            ) : (
              <ul className='h-full w-full'>
                {/* DISABLED TO AVOID ESLINT ERRORS - NEEDS VALIDATION
                  {vulnerabilitiesData?.map((vulnerability) => (
                    <li key={vulnerability[0].title.toLowerCase().replaceAll(' ', '-')}>
                      {vulnerability[0].title}
                    </li>
                  ))}
                */}
              </ul>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
