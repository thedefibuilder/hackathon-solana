import { useCallback, useEffect, useState } from 'react';

export type TVulnerabilityPromise = Record<string, Promise<Response>>;

export default function useAuditVulnerabilities(
  filesData: (string | undefined)[] | null,
  ghUsername: string,
  repoName: string
) {
  // prettier-ignore
  const [
    vulnerabilitiesPromise, 
    setVulnerabilitiesPromise
  ] = useState<TVulnerabilityPromise[] | null>(null);

  useEffect(() => {
    if (filesData) {
      const promises: Array<TVulnerabilityPromise | null> = filesData.map((filePath, index) => {
        if (filePath) {
          return {
            [filePath]: new Promise<Response>((resolve, reject) => {
              setTimeout(() => {
                fetch('/api/audit/vulnerabilities', {
                  method: 'POST',
                  body: JSON.stringify({ ghUsername, repoName, filePath })
                })
                  .then((response) => {
                    // eslint-disable-next-line promise/always-return
                    if (!response.ok) {
                      reject('ERROR FETCHING VULNERABILITIES');
                    }

                    resolve(response);
                  })
                  .catch((error) => reject(error));
              }, 1000 * index);
            })
          };
        }

        return null;
      });

      setVulnerabilitiesPromise(promises.filter(Boolean) as TVulnerabilityPromise[]);
    }
  }, [ghUsername, repoName, filesData]);

  const resetVulnerabilitiesPromise = useCallback(() => {
    setVulnerabilitiesPromise(null);
  }, []);

  return {
    vulnerabilitiesPromise,
    resetVulnerabilitiesPromise
  };
}
