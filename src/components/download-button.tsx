import React, { useEffect, useRef, useState } from 'react';

import type { PropsWithChildren } from 'react';
import type { ButtonProperties } from './ui/button';

import { Check, FileDown } from 'lucide-react';

import { cn } from '@/lib/utils';

import { Button } from './ui/button';

type TDownloadButtonProperties = PropsWithChildren &
  ButtonProperties & {
    onButtonClick: () => void;
  };

export default function DownloadButton({
  children,
  onButtonClick,
  ...otherProperties
}: TDownloadButtonProperties) {
  const iconTimeoutReference = useRef<NodeJS.Timeout | null>(null);
  const [isContentDownloaded, setIsContentDownloaded] = useState(false);

  useEffect(() => {
    return () => {
      if (iconTimeoutReference.current) {
        clearTimeout(iconTimeoutReference.current);
      }
    };
  }, []);

  function onClick() {
    if (!children) {
      onButtonClick();

      return;
    }

    setIsContentDownloaded(true);
    onButtonClick();

    iconTimeoutReference.current = setTimeout(() => {
      setIsContentDownloaded(false);
    }, 2000);
  }

  return (
    <Button onClick={onClick} {...otherProperties}>
      {children ?? (
        <>
          {isContentDownloaded ? (
            <Check className={cn('h-5 w-5')} />
          ) : (
            <FileDown className={cn('h-5 w-5')} />
          )}
        </>
      )}
    </Button>
  );
}
