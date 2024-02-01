import { useCallback, useState } from 'react';

export default function useAuditMethodology() {
  const [isMethodologyLoading, setIsMethodologyLoading] = useState(true);
  const [isMethodologyError, setIsMethodologyError] = useState(false);
  const [methodologyData, setMethodologyData] = useState<string | null>(null);

  const getMethodology = useCallback(async () => {
    try {
      setIsMethodologyLoading(true);

      const response = await fetch('/api/audit/methodology');

      if (response.ok) {
        const json: unknown = await response.json();

        if (
          json &&
          typeof json === 'object' &&
          'data' in json &&
          json.data &&
          typeof json.data === 'string'
        ) {
          setIsMethodologyLoading(false);
          setIsMethodologyError(false);
          setMethodologyData(json.data);

          console.log('METHODOLOGY DATA', json.data);

          return;
        }
      }

      setIsMethodologyLoading(false);
      setIsMethodologyError(true);
      setMethodologyData(null);
    } catch (error: unknown) {
      setIsMethodologyLoading(false);
      setIsMethodologyError(true);
      setMethodologyData(null);

      console.error('ERROR FETCHING METHODOLOGY', error);
    }
  }, []);

  return {
    isMethodologyLoading,
    isMethodologyError,
    methodologyData,
    getMethodology
  };
}
