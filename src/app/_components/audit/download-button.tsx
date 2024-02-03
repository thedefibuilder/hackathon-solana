import React, { useState } from 'react';

import type { TAuditDocument } from '@/custom-hooks/use-audit-document';

import { pdf } from '@react-pdf/renderer';
import { Loader2 } from 'lucide-react';

import DownloadButton from '@/components/download-button';
import downloadContent from '@/lib/download-content';

import AuditPdfRenderer from './pdf-renderer';

type TDownloadAuditButtonProperties = {
  auditDocument: TAuditDocument;
};

export default function DownloadAuditButton({ auditDocument }: TDownloadAuditButtonProperties) {
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  return (
    <DownloadButton
      className='w-full md:w-auto'
      onButtonClick={async () => {
        setIsGeneratingPdf(true);
        const blobPdf = await pdf(<AuditPdfRenderer audit={auditDocument} />).toBlob();
        downloadContent(blobPdf, 'DeFi Builder - Smart contract Audit.pdf');
        setIsGeneratingPdf(false);
      }}
    >
      {isGeneratingPdf ? (
        <div className='flex items-center gap-x-2.5'>
          <Loader2 className='animate-spin' />
          <span>Generating PDF</span>
        </div>
      ) : (
        <span>Download Audit</span>
      )}
    </DownloadButton>
  );
}
