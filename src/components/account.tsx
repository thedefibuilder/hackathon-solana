'use client';

import React from 'react';

import { format } from 'date-fns';
import { Github } from 'lucide-react';
import { signIn, signOut, useSession } from 'next-auth/react';

import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from './ui/dropdown-menu';
import { Skeleton } from './ui/skeleton';

// eslint-disable-next-line quotes
const dateFormat = "MMM d ''yy ~ h:mm a";

export default function Account() {
  const { data: session, status } = useSession();

  const sessionExpires = session?.expires ? new Date(session?.expires).toString() : new Date();
  const formattedSessionExpires = format(sessionExpires, dateFormat);

  if (status === 'loading') {
    return <Skeleton className='h-10 w-24' />;
  }

  if (status === 'unauthenticated') {
    return (
      <Button className='flex gap-x-1' onClick={() => signIn('github')}>
        <Github className='h-4 w-4' />
        <span>Log in</span>
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' className='relative h-10 w-10 rounded-full'>
          <Avatar className='h-10 w-10'>
            <AvatarImage src={session?.user.image ?? ''} alt='GitHub avatar' />
            <AvatarFallback>GH</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='mx-2 w-56'>
        <DropdownMenuLabel>
          <div className='flex flex-col space-y-1.5'>
            <p className='text-sm font-medium leading-none'>{session?.user.name}</p>
            <p className='text-xs leading-none text-muted-foreground'>{session?.user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>
          <div className='flex flex-col space-y-1.5'>
            <p className='text-sm font-medium leading-none'>Session expires</p>
            <p className='text-xs leading-none text-muted-foreground'>{formattedSessionExpires}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className='hover:!bg-destructive/50' onClick={() => signOut()}>
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
