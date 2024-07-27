'use client'
import { AppProps } from 'next/app';
import '../src/app/globals.css';
import Navbar from '@/components/Navbar';

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <div className="container mx-auto p-4">
      <Navbar />
      <Component {...pageProps} />
    </div>
  );
};

export default MyApp;
