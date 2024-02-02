import { useCallback, useState } from 'react';

export default function useAuditSummary(ghUsername: string, repoName: string) {
  const [isSummaryLoading, setIsSummaryLoading] = useState(true);
  const [isSummaryError, setIsSummaryError] = useState(false);
  const [summaryData, setSummaryData] = useState<string | null>(null);

  const getSummary = useCallback(async () => {
    try {
      setIsSummaryLoading(true);

      const response = await fetch('/api/audit/summary', {
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
          typeof json.data === 'string'
        ) {
          const data = json.data;

          setTimeout(() => {
            setIsSummaryLoading(false);
            setIsSummaryError(false);
            setSummaryData(data);

            console.log('SUMMARY DATA', json.data);
          }, 7000);

          return;
        }
      }

      setIsSummaryLoading(false);
      setIsSummaryError(true);
      setSummaryData(null);
    } catch (error: unknown) {
      setIsSummaryLoading(false);
      setIsSummaryError(true);
      setSummaryData(null);

      console.error('ERROR FETCHING SUMMARY', error);
    }
  }, [ghUsername, repoName]);

  const resetSummary = useCallback(() => {
    setIsSummaryLoading(true);
    setIsSummaryError(false);
    setSummaryData(null);
  }, []);

  return {
    isSummaryLoading,
    isSummaryError,
    summaryData,
    getSummary,
    resetSummary
  };
}
