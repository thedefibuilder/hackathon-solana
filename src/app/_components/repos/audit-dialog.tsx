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

import { TabContent } from '../tabs/content';
import FileRow from '../tabs/file-row';
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
    isFilesLoading, 
    isFilesError, 
    filesData, 
    getFiles 
  } = useAuditFiles(ghUsername, repoName);

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
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
            <ul className='flex h-full w-full flex-col gap-y-2.5'>
              {filesData?.map((filePath) =>
                filePath ? (
                  <FileRow
                    key={filePath}
                    ghUsername={ghUsername}
                    repoName={repoName}
                    filePath={filePath}
                  />
                ) : null
              )}
            </ul>
          </TabContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
