import React from 'react';

import Image from 'next/image';

import logo from '@/assets/images/logo.png';

import Account from './account';
import CodigoDialog from './codigo-dialog';

export default function Navbar() {
  return (
    <header className='flex h-20 w-full items-center justify-between border-b border-border px-5'>
      <Image src={logo} alt="DeFi Builder's logo" width={190} height={30} />
      <h1 className='text-2xl'> Solana AI Auditor</h1>

      <div className='flex items-center'>
        <CodigoDialog />
        <Account />
      </div>
    </header>
  );
}
