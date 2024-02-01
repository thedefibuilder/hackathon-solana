import { useCallback, useState } from 'react';

export default function useAuditFileVulnerabilities(ghUsername: string, repoName: string) {
  const [isFileVulnerabilitiesLoading, setIsFileVulnerabilitiesLoading] = useState(true);
  const [isFileVulnerabilitiesError, setIsFileVulnerabilitiesError] = useState(false);
  const [fileVulnerabilitiesData, setFileVulnerabilitiesData] = useState<string[] | null>(null);

  const getFileVulnerabilities = useCallback(
    async (filePath: string) => {
      try {
        setIsFileVulnerabilitiesLoading(true);

        const response = await fetch('/api/audit/vulnerabilities', {
          method: 'POST',
          body: JSON.stringify({ ghUsername, repoName, filePath })
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
              setIsFileVulnerabilitiesLoading(false);
              setIsFileVulnerabilitiesError(false);
              setFileVulnerabilitiesData(data);

              console.log('VULNERABILITIES DATA', json.data);
            }, 5000);

            return;
          }
        }

        setIsFileVulnerabilitiesLoading(false);
        setIsFileVulnerabilitiesError(true);
        setFileVulnerabilitiesData(null);
      } catch (error: unknown) {
        setIsFileVulnerabilitiesLoading(false);
        setIsFileVulnerabilitiesError(true);
        setFileVulnerabilitiesData(null);

        console.error('ERROR FETCHING VULNERABILITIES', error);
      }
    },
    [ghUsername, repoName]
  );

  return {
    isFileVulnerabilitiesLoading,
    isFileVulnerabilitiesError,
    fileVulnerabilitiesData,
    getFileVulnerabilities
  };
}
