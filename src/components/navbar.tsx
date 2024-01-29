import React from 'react';

import Image from 'next/image';

import logo from '@/assets/images/logo.png';

export default function Navbar() {
  return (
    <header className='flex h-20 w-full items-center justify-between border-b border-border px-5'>
      <Image src={logo} alt="DeFi Builder's logo" width={190} height={30} />
    </header>
  );
}
