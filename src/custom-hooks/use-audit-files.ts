import { useCallback, useState } from 'react';

export default function useAuditFiles(ghUsername: string, repoName: string) {
  const [isFilesLoading, setIsFilesLoading] = useState(true);
  const [isFilesError, setIsFilesError] = useState(false);
  const [filesData, setFilesData] = useState<(string | undefined)[] | null>(null);

  const getFiles = useCallback(async () => {
    try {
      setIsFilesLoading(true);

      const response = await fetch('/api/audit/files', {
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
            setIsFilesLoading(false);
            setIsFilesError(false);
            setFilesData(data);

            // console.log('FILES DATA', json.data);
          }, 5000);

          return;
        }
      }

      setIsFilesLoading(false);
      setIsFilesError(true);
      setFilesData(null);
    } catch (error: unknown) {
      setIsFilesLoading(false);
      setIsFilesError(true);
      setFilesData(null);

      console.error('ERROR FETCHING FILES', error);
    }
  }, [ghUsername, repoName]);

  return {
    isFilesLoading,
    isFilesError,
    filesData,
    getFiles
  };
}
