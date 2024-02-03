import React, { useState } from 'react';

import type { TPrompt } from '@/constants/prompts';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';

import { Button } from '../../../components/ui/button';

type TPredefinedPromptsDialogProperties = {
  predefinedPrompts: TPrompt[];
  setUserPrompt: React.Dispatch<React.SetStateAction<string>>;
};

export default function PredefinedPromptsDialog({
  predefinedPrompts,
  setUserPrompt
}: TPredefinedPromptsDialogProperties) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant='secondary' className='w-full md:w-auto'>
          Predefined Prompts
        </Button>
      </DialogTrigger>

      <DialogContent className='max-h-[calc(100%-5rem)] overflow-y-auto'>
        <DialogHeader className='flex gap-y-5'>
          <DialogTitle>Predefined Prompts</DialogTitle>
        </DialogHeader>

        <ul className='flex flex-col gap-y-2.5'>
          {predefinedPrompts.map((prompt, index) => (
            <li key={`${prompt.title}-${index}`} className='w-full'>
              <Button
                variant='secondary'
                className='flex h-min w-full flex-col items-start justify-start gap-y-1 whitespace-normal p-2.5 text-left'
                onClick={() => {
                  setUserPrompt(prompt.description);
                  setIsDialogOpen(false);
                }}
              >
                <span className='font-medium'>{prompt.title}</span>
                <span className='text-muted-foreground'>{prompt.description}</span>
              </Button>
            </li>
          ))}
        </ul>
      </DialogContent>
    </Dialog>
  );
}
