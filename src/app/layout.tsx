import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Header from '@/components/header';
import Provider from './provider';

import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'NFT Marketplace',
  description: 'NFT Marketplace',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <body className={inter.className}>
        <Provider>
          <Header />
          <div className='px-5'>{children}</div>
        </Provider>
      </body>
    </html>
  );
}
