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
import useAuditFiles from '@/custom-hooks/use-audit-files';
import useAuditMethodology from '@/custom-hooks/use-audit-methodology';
import useAuditSummary from '@/custom-hooks/use-audit-summary';
import useAuditVulnerabilities from '@/custom-hooks/use-audit-vulnerabilities';

import { TabContent } from '../tabs/content';
import FileRow from '../tabs/file/row';
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
    - Handle errors;
    - Download Audit PDF Document;
  */

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const {
    isMethodologyLoading,
    isMethodologyError,
    methodologyData,
    getMethodology,
    resetMethodology
  } = useAuditMethodology();

  // prettier-ignore
  const {
    isSummaryLoading,
    isSummaryError,
    summaryData,
    getSummary,
    resetSummary
  } = useAuditSummary(ghUsername, repoName);

  // prettier-ignore
  const { 
    isFilesLoading,
    isFilesError,
    filesData,
    getFiles,
    resetFiles
  } = useAuditFiles(ghUsername, repoName);

  // prettier-ignore
  const {
    vulnerabilitiesPromise,
    resetVulnerabilitiesPromise
  } = useAuditVulnerabilities(filesData, ghUsername, repoName);

  function onDialogOpenChange(isOpen: boolean) {
    if (!isOpen) {
      resetMethodology();
      resetSummary();
      resetFiles();
      resetVulnerabilitiesPromise();
    }

    setIsDialogOpen(isOpen);
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={onDialogOpenChange}>
      <DialogTrigger asChild>
        <Button
          {...buttonProperties}
          onClick={() => {
            getMethodology();
            getSummary();
            getFiles();
          }}
        >
          Audit
        </Button>
      </DialogTrigger>
      <DialogContent className='flex h-[calc(100%-5rem)] max-h-[calc(100%-5rem)] w-[calc(100%-5rem)] max-w-[calc(100%-5rem)] flex-col'>
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
            <TabTrigger value={ETabs.vulnerabilities} isLoading={isFilesLoading} />
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
            isLoading={isFilesLoading}
            isError={isFilesError}
          >
            <ul className='flex h-full w-full flex-col gap-y-5'>
              {vulnerabilitiesPromise?.map((promise, index) => (
                <FileRow
                  key={index}
                  ghUsername={ghUsername}
                  repoName={repoName}
                  promise={promise}
                />
              ))}
            </ul>
          </TabContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
