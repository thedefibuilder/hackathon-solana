import React from 'react';

import { Heart } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
  const website = 'https://www.defibuilder.com';
  const year = new Date().getFullYear();

  return (
    <footer className='flex h-10 w-full items-center justify-center border-t border-border text-sm'>
      Made with &nbsp;
      <Heart className='h-4 w-4 text-red-500' /> &nbsp; by
      <Link
        href={website}
        className='px-1 transition-colors hover:text-primary focus-visible:text-primary'
      >
        DeFi Builder
      </Link>
      &nbsp; &copy; &nbsp; {year}
    </footer>
  );
}
