import React from 'react';

import type { ETabs } from '@/constants/misc';

import { Loader2 } from 'lucide-react';

import { TabsTrigger } from '@/components/ui/tabs';

type TTabTriggerProperties = {
  value: ETabs;
  isLoading: boolean;
};

export default function TabTrigger({ value, isLoading }: TTabTriggerProperties) {
  return (
    <TabsTrigger value={value} className='flex w-1/3 items-center justify-center gap-x-2.5'>
      {isLoading ? <Loader2 className='h-5 w-5 animate-spin' /> : null}
      {value}
    </TabsTrigger>
  );
}
