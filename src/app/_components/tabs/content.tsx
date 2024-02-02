import React, { useRef } from 'react';

import type { ETabs } from '@/constants/misc';
import type { PropsWithChildren } from 'react';

import { Skeleton } from '@/components/ui/skeleton';
import { TabsContent } from '@/components/ui/tabs';
import useGetOverflowY from '@/custom-hooks/use-get-overflow-y';
import { cn } from '@/lib/utils';

type TTabContentProperties = PropsWithChildren & {
  value: ETabs;
  isLoading: boolean;
  isError: boolean;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function TabContent({ value, isLoading, isError, children }: TTabContentProperties) {
  const tabContentReference = useRef<HTMLDivElement | null>(null);

  // prettier-ignore
  const { 
    isOverflowingY: isTabContentOverflowingY
  } = useGetOverflowY(tabContentReference, children);

  return (
    <TabsContent
      ref={tabContentReference}
      value={value}
      className={cn(
        'h-[calc(100%-3rem)] w-full overflow-y-auto rounded-md border border-border p-2.5',
        { 'pr-4': isTabContentOverflowingY }
      )}
    >
      {isLoading ? (
        <div className='relative flex h-full w-full items-center justify-center'>
          <Skeleton className='h-full w-full rounded-md' />
          <p className='absolute'>Generating Audit&apos;s {value}</p>
        </div>
      ) : (
        children
      )}
    </TabsContent>
  );
}
