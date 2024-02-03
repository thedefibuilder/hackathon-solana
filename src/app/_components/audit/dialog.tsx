'use client';

import React, { useState } from 'react';

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
import { Tabs, TabsList } from '@/components/ui/tabs';
import { ETabs, fnsDateFormat } from '@/constants/misc';
import useAuditDocument from '@/custom-hooks/use-audit-document';
import useAuditFiles from '@/custom-hooks/use-audit-files';
import useAuditMethodology from '@/custom-hooks/use-audit-methodology';
import useAuditSummary from '@/custom-hooks/use-audit-summary';
import useAuditVulnerabilities from '@/custom-hooks/use-audit-vulnerabilities';

import MarkdownViewer from '../markdown-viewer';
import { TabContent } from '../tabs/content';
import FileRow from '../tabs/file/row';
import TabTrigger from '../tabs/trigger';
import DownloadAuditButton from './download-button';

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
    vulnerabilitiesPromises,
    resetVulnerabilitiesPromises
  } = useAuditVulnerabilities(filesData, ghUsername, repoName);

  const { isAuditDocumentLoading, auditDocument } = useAuditDocument(
    isMethodologyLoading,
    methodologyData,
    isSummaryLoading,
    summaryData,
    isFilesLoading,
    vulnerabilitiesPromises
  );

  function onDialogOpenChange(isOpen: boolean) {
    if (!isOpen) {
      resetMethodology();
      resetSummary();
      resetFiles();
      resetVulnerabilitiesPromises();
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
        <DialogHeader className='relative'>
          <DialogTitle>Solana AI Auditor</DialogTitle>
          <DialogDescription>
            This assessment was conducted between {assessmentStartDate} and {assessmentEndDate}.
          </DialogDescription>

          <div className='absolute -top-1 right-5'>
            {isAuditDocumentLoading || !auditDocument ? (
              <Button disabled>
                <Loader2 className='h-5 w-5 animate-spin' />
                Generating Audit
              </Button>
            ) : auditDocument ? (
              <DownloadAuditButton auditDocument={auditDocument} />
            ) : null}
          </div>
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
            <MarkdownViewer source={methodologyData ?? ''} />
          </TabContent>

          <TabContent value={ETabs.summary} isLoading={isSummaryLoading} isError={isSummaryError}>
            <MarkdownViewer source={summaryData ?? ''} />
          </TabContent>

          <TabContent
            value={ETabs.vulnerabilities}
            isLoading={isFilesLoading}
            isError={isFilesError}
          >
            <ul className='flex h-full w-full flex-col gap-y-5'>
              {vulnerabilitiesPromises?.map((vulnerabilitiesPromise, index) => (
                <FileRow
                  key={index}
                  ghUsername={ghUsername}
                  repoName={repoName}
                  vulnerabilitiesPromise={vulnerabilitiesPromise}
                />
              ))}
            </ul>
          </TabContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
