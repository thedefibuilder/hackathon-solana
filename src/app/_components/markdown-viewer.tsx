import React from 'react';

import MDEditor from '@uiw/react-md-editor';

import { cn } from '@/lib/utils';

type TMarkdownViewer = {
  source: string;
  className?: string;
};

export default function MarkdownViewer({ source, className }: TMarkdownViewer) {
  return (
    <MDEditor.Markdown
      source={source}
      className={cn(
        'h-full w-full overflow-auto rounded-md !bg-background !p-2 !text-sm [&>.wmde-markdown_a.anchor]:hidden',
        className
      )}
      skipHtml={true}
    />
  );
}
