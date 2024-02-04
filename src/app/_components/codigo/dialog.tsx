'use client';

import React, { useEffect, useState } from 'react';

import { Loader2 } from 'lucide-react';
import Image from 'next/image';

import codigoLogo from '@/assets/images/codigo.png';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { predefinedPrompts } from '@/constants/prompts';
import { copyToClipboard } from '@/lib/clipboard';

import CopyButton from '../../../components/copy-button';
import { Textarea } from '../../../components/ui/textarea';
import { useToast } from '../../../components/ui/toast/use-toast';
import PredefinedPromptsDialog from './prompts-dialog';

export default function CodigoDialog() {
  const [isClipboardApiSupported, setIsClipboardApiSupported] = useState(false);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isGenerationLoading, setIsGenerationLoading] = useState(false);
  const [userPrompt, setUserPrompt] = useState('');
  const [codigoYaml, setCodigoYaml] = useState<string | null>(null);

  const { toast } = useToast();

  useEffect(() => {
    const isClipboardApiSupported = !!navigator.clipboard?.writeText;
    setIsClipboardApiSupported(isClipboardApiSupported);
  }, []);

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
    if (isGenerationLoading) {
      return;
    }

    setUserPrompt('');
    setCodigoYaml(null);
    setIsDialogOpen(isOpen);
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={onDialogOpenChange}>
      <DialogTrigger asChild>
        <Button variant='secondary'>
          <Image src={codigoLogo.src} alt='Codigo AI' width={24} height={24} className='h-6 w-6' />
        </Button>
      </DialogTrigger>
      <DialogContent className='flex max-h-[calc(100%-5rem)] w-[500px] flex-col'>
        <DialogHeader className='flex flex-row items-center justify-between pr-5'>
          <DialogTitle>Codigo YAML Generator</DialogTitle>

          <PredefinedPromptsDialog
            setUserPrompt={setUserPrompt}
            predefinedPrompts={predefinedPrompts}
          />
        </DialogHeader>

        <Textarea
          value={userPrompt}
          placeholder='Type the customisations for your CIDL file here.'
          className='h-60 w-full resize-none rounded-md p-2.5 placeholder:italic'
          onChange={(event) => setUserPrompt(event.target.value)}
        />

        <Button disabled={isGenerationLoading} onClick={initGeneration}>
          {isGenerationLoading ? (
            <div className='flex items-center gap-x-2.5'>
              <Loader2 className='animate-spin' />
              <span>Generating CIDL</span>
            </div>
          ) : (
            <span>Generate CIDL</span>
          )}
        </Button>

        {!isGenerationLoading && codigoYaml ? (
          <div className='relative'>
            <Textarea
              value={codigoYaml}
              placeholder={'CIDL file will be generated here.'}
              className='h-96 w-full resize-none rounded-md p-2.5 placeholder:italic focus-visible:ring-0'
              readOnly
            />

            {isClipboardApiSupported && (
              <CopyButton
                onClick={async () => copyToClipboard(codigoYaml)}
                buttonClassName='absolute right-2.5 top-2.5'
              />
            )}
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
