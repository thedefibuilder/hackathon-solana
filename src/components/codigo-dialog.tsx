'use client';

import React, { useState } from 'react';

import { Loader2 } from 'lucide-react';

import codigoLogo from '@/assets/images/codigo-ai.png';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { copyToClipboard, isClipboardApiSupported } from '@/lib/clipboard';

import CopyButton from './copy-button';
import { Textarea } from './ui/textarea';
import { useToast } from './ui/toast/use-toast';

export default function CodigoDialog() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isGenerationLoading, setIsGenerationLoading] = useState(false);
  const [userPrompt, setUserPrompt] = useState('');
  const [codigoYaml, setCodigoYaml] = useState('');

  const { toast } = useToast();

  async function initGeneration() {
    if (userPrompt.trim() === '') {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Please type the customisations for your CIDL file.'
      });
      return;
    }
    setIsGenerationLoading(true);

    // Call the API to generate the CIDL file
    const codigoResponse = await fetch('/api/codigo', {
      method: 'POST',
      body: JSON.stringify({ prompt: userPrompt })
    });

    if (codigoResponse.ok) {
      const json: unknown = await codigoResponse.json();
      if (
        json &&
        typeof json === 'object' &&
        'data' in json &&
        json.data &&
        typeof json.data === 'string'
      ) {
        setCodigoYaml(json.data);
      }
    } else {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to generate the CIDL file.'
      });
    }

    setIsGenerationLoading(false);
  }

  function onDialogOpenChange(isOpen: boolean) {
    setUserPrompt('');
    setCodigoYaml('');
    setIsDialogOpen(isOpen);
  }

  return (
    <div className='mr-4'>
      <Dialog open={isDialogOpen} onOpenChange={onDialogOpenChange}>
        <DialogTrigger asChild>
          <Button variant='secondary'>
            {/* TODO: use next/image */}
            <img src={codigoLogo.src} alt='Codigo AI' className='h-6 w-6' />
          </Button>
        </DialogTrigger>
        <DialogContent className='flex h-[calc(100%-5rem)] max-h-[calc(100%-5rem)] w-[calc(100%-5rem)] max-w-[calc(100%-5rem)] flex-col'>
          <DialogHeader>
            <DialogTitle>Codigo YAML Generator</DialogTitle>
          </DialogHeader>

          <Textarea
            value={userPrompt}
            placeholder={'Type the customisations for your CIDL file here.'}
            className='mt-5 h-60 w-full resize-none rounded-3xl p-5 placeholder:italic'
            onChange={(event) => setUserPrompt(event.target.value)}
          />

          <Button disabled={isGenerationLoading} onClick={() => initGeneration()}>
            {isGenerationLoading ? (
              <div className='flex items-center gap-x-2.5'>
                <Loader2 className='animate-spin' />
                <span>Generating CIDL</span>
              </div>
            ) : (
              <span>Generate CIDL</span>
            )}
          </Button>

          <div className='relative'>
            <Textarea
              value={codigoYaml}
              placeholder={'CIDL file will be generated here.'}
              className='mt-5 h-96 w-full resize-none rounded-3xl p-5 placeholder:italic'
              readOnly
            />

            {isClipboardApiSupported && (
              <CopyButton
                onClick={async () => copyToClipboard(codigoYaml)}
                buttonClassName='absolute right-5 top-10'
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
