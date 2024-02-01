'use client';

import React, { useState } from 'react';

import type { ButtonProperties } from '@/components/ui/button';

import { format } from 'date-fns';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Tabs, TabsList } from '@/components/ui/tabs';
import { ETabs, fnsDateFormat } from '@/constants/misc';
import useAuditFileVulnerabilities from '@/custom-hooks/use-audit-file-vulnerabilities';
import useAuditMethodology from '@/custom-hooks/use-audit-methodology';
import useAuditSummary from '@/custom-hooks/use-audit-summary';

import { TabContent } from '../tabs/content';
import TabTrigger from '../tabs/trigger';

const assessmentStartDate = format(new Date('Mon Jan 15 2024'), fnsDateFormat);
const assessmentEndDate = format(new Date(), fnsDateFormat);

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

  // prettier-ignore
  const {
    isFileVulnerabilitiesLoading,
    isFileVulnerabilitiesError,
    fileVulnerabilitiesData,
    getFileVulnerabilities
  } = useAuditFileVulnerabilities(ghUsername, repoName);

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

            getFileVulnerabilities('test').catch((error: unknown) =>
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
            <TabTrigger value={ETabs.methodology} isLoading={isMethodologyLoading} />
            <TabTrigger value={ETabs.summary} isLoading={isSummaryLoading} />
            <TabTrigger value={ETabs.vulnerabilities} isLoading={isFileVulnerabilitiesLoading} />
          </TabsList>

          <TabContent
            value={ETabs.methodology}
            isLoading={isMethodologyLoading}
            isError={isMethodologyError}
          >
            <p>{methodologyData}</p>
          </TabContent>

          <TabContent value={ETabs.summary} isLoading={isSummaryLoading} isError={isSummaryError}>
            <p>{summaryData}</p>
          </TabContent>

          <TabContent
            value={ETabs.vulnerabilities}
            isLoading={isFileVulnerabilitiesLoading}
            isError={isFileVulnerabilitiesError}
          >
            <ul className='h-full w-full'>
              {/* DISABLED TO AVOID ESLINT ERRORS - NEEDS VALIDATION
                  {vulnerabilitiesData?.map((vulnerability) => (
                    <li key={vulnerability[0].title.toLowerCase().replaceAll(' ', '-')}>
                      {vulnerability[0].title}
                    </li>
                  ))}
                */}
            </ul>
          </TabContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
