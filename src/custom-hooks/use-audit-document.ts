import { useEffect, useState } from 'react';

import type { TVulnerability } from '@/agents/audit';
import type { TVulnerabilityPromise } from './use-audit-vulnerabilities';

export type TAuditDocument = {
  methodology: string;
  summary: string;
  filesVulnerabilities: Record<string, TVulnerability[]>;
};

export default function useAuditDocument(
  isMethodologyLoading: boolean,
  methodologyData: string | null,
  isSummaryLoading: boolean,
  summaryData: string | null,
  isFilesLoading: boolean,
  vulnerabilitiesPromises: TVulnerabilityPromise[] | null
) {
  const isAuditDocumentLoading = isMethodologyLoading || isSummaryLoading || isFilesLoading;

  const [auditDocument, setAuditDocument] = useState<TAuditDocument | null>(null);

  // eslint-disable-next-line sonarjs/cognitive-complexity
  useEffect(() => {
    const resolvePromises = async () => {
      if (methodologyData && summaryData && vulnerabilitiesPromises) {
        try {
          const filesVulnerabilities: Record<string, TVulnerability[]> = {};

          await Promise.all(
            vulnerabilitiesPromises.map(async (promise) => {
              const entry = Object.entries(promise)[0];

              if (!entry) return null;

              const [filePath, promiseInstance] = entry;
              const response = await promiseInstance;
              const clonedResponse = response.clone();
              const responseBody: unknown = await clonedResponse.json();

              if (
                responseBody &&
                typeof responseBody === 'object' &&
                'data' in responseBody &&
                responseBody.data &&
                Array.isArray(responseBody.data)
              ) {
                filesVulnerabilities[filePath] = responseBody.data as TVulnerability[];
              }
            })
          );

          const result: TAuditDocument = {
            methodology: methodologyData,
            summary: summaryData,
            filesVulnerabilities: filesVulnerabilities
          };

          setAuditDocument(result);
        } catch (error) {
          // Handle errors here, if needed
          console.error('Error fetching vulnerabilities:', error);
          setAuditDocument(null);
        }
      } else {
        setAuditDocument(null);
      }
    };

    resolvePromises();
  }, [methodologyData, summaryData, vulnerabilitiesPromises]);

  return {
    isAuditDocumentLoading: isAuditDocumentLoading || !vulnerabilitiesPromises,
    auditDocument: auditDocument
  };
}
