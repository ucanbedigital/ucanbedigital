import type { AppProps } from 'next/app';
import Head from 'next/head';

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* Load original complete CSS bundles */}
        <link rel="stylesheet" href="/assets/css/8419bf7e20c871f2.css" />
        <link rel="stylesheet" href="/assets/css/b8c53a32f1e1dba5.css" />
        <link rel="stylesheet" href="/assets/css/23541da8cc5249d8.css" />
        <link rel="stylesheet" href="/assets/css/eaecb328b62e6e17.css" />
        <link rel="stylesheet" href="/assets/css/cd955130e6f8b262.css" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}
