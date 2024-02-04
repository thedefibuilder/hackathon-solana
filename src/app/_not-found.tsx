import React from 'react';

import { NextPage } from 'next';
import Link from 'next/link';

const NotFoundPage: NextPage = () => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        textAlign: 'center'
      }}
    >
      <h1>404 - Page Not Found</h1>
      <p>
        The page you are looking for might have been removed, had its name changed, or is
        temporarily unavailable.
      </p>
    </div>
  );
};

export default NotFoundPage;
