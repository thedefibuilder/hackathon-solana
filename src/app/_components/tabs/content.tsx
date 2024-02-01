import React from 'react';

import type { ETabs } from '@/constants/misc';
import type { PropsWithChildren } from 'react';

import { Skeleton } from '@/components/ui/skeleton';
import { TabsContent } from '@/components/ui/tabs';

type TTabContentProperties = PropsWithChildren & {
  value: ETabs;
  isLoading: boolean;
  isError: boolean;
};

export function TabContent({ value, isLoading, isError, children }: TTabContentProperties) {
  return (
    <TabsContent
      value={value}
      className='h-[calc(100%-3rem)] w-full overflow-y-auto rounded-md border border-border p-2.5'
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
