'use client';

import React, { ComponentProps, PropsWithChildren, ReactNode } from 'react';

import { Github, Loader2, ShieldAlert } from 'lucide-react';
import { signIn, useSession } from 'next-auth/react';

import { cn } from '@/lib/utils';

import { Button } from './ui/button';

type TAuthStatusContainerProperties = {
  title: string;
  subTitle: string;
  icon: ReactNode;
} & PropsWithChildren &
  ComponentProps<'div'>;

function AuthStatusContainer({
  title,
  subTitle,
  icon,
  className,
  children,
  ...otherProperties
}: TAuthStatusContainerProperties) {
  return (
    <div
      className={cn('flex h-full w-full flex-col items-center justify-center', className)}
      {...otherProperties}
    >
      {icon}

      <h1 className='text-2xl font-bold'>{title}</h1>
      <h2 className='mb-5 text-lg text-muted-foreground'>{subTitle}</h2>

      {children}
    </div>
  );
}

export default function AuthStatus() {
  const { status } = useSession();
  const [isLoading, setIsLoading] = React.useState(false);

  function signInWithGithub() {
    setIsLoading(true);
    signIn('github');
  }

  if (isLoading) {
    return (
      <AuthStatusContainer
        title='Loading...'
        subTitle='Please wait while we authenticate you with Github'
        icon={<Loader2 className='mb-2.5 h-16 w-16 animate-spin text-gray-400' />}
      />
    );
  }
  return (
    <AuthStatusContainer
      title='Connect your Github'
      subTitle='Connect your Github in order to use our application'
      icon={<ShieldAlert className='mb-2.5 h-16 w-16 text-yellow-400' />}
    >
      <Button className='flex gap-x-1' onClick={signInWithGithub}>
        <Github className='h-4 w-4' />
        <span>Log in</span>
      </Button>
    </AuthStatusContainer>
  );
}
