import React from 'react';
import type { AppProps } from 'next/app';

// Global MeeBot animations/styles — NEXT.js requires global CSS to be imported only here
import '../styles/meeBotAnimations.css';

export default function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
