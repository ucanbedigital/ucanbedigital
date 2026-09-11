import type { AppProps } from 'next/app';
import 'bootstrap-icons/font/bootstrap-icons.css';
import Head from 'next/head';

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        {/* Load original CSS bundles */}
        <link rel="stylesheet" href="/assets/css/8419bf7e20c871f2.css" />
        <link rel="stylesheet" href="/assets/css/b8c53a32f1e1dba5.css" />
        <link rel="stylesheet" href="/assets/css/23541da8cc5249d8.css" />
        <link rel="stylesheet" href="/assets/css/eaecb328b62e6e17.css" />
        <link rel="stylesheet" href="/assets/css/cd955130e6f8b262.css" />
        {/* Bootstrap 5 for fast responsive layout support */}
        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
          rel="stylesheet"
          integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH"
          crossOrigin="anonymous"
        />
        {/* Custom styling matching original ucanbedigital */}
        <style>{`
          body {
            background-color: #0f1013;
            color: #d1d5db;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            overflow-x: hidden;
          }
          .header-area {
            background: rgba(15, 16, 19, 0.95);
            backdrop-filter: blur(10px);
            padding: 20px 0;
            position: sticky;
            top: 0;
            z-index: 1000;
            border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          }
          .main-menu .menu-list a {
            color: #f3f4f6;
            font-size: 15px;
            font-weight: 500;
            transition: color 0.2s;
          }
          .main-menu .menu-list a:hover,
          .main-menu .menu-list a.active {
            color: #ff9800 !important;
          }
          .primary-btn1 {
            display: inline-block;
            background: linear-gradient(135deg, #ff9800 0%, #ff5722 100%);
            color: #ffffff !important;
            padding: 14px 36px;
            border-radius: 50px;
            font-weight: 600;
            text-decoration: none;
            transition: transform 0.2s, box-shadow 0.2s;
            box-shadow: 0 4px 15px rgba(255, 152, 0, 0.3);
          }
          .primary-btn1:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(255, 152, 0, 0.4);
          }
          .card-dark {
            background: #181a20;
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-radius: 16px;
            transition: all 0.3s ease;
          }
          .card-dark:hover {
            transform: translateY(-5px);
            border-color: rgba(255, 152, 0, 0.4);
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
          }
          .footer-section {
            background: #090a0c;
            border-top: 1px solid rgba(255, 255, 255, 0.08);
          }
          .hover-white:hover {
            color: #ffffff !important;
          }
          .admin-sidebar {
            width: 260px;
            background: #13151b;
            min-height: 100vh;
            border-right: 1px solid rgba(255, 255, 255, 0.08);
          }
          .admin-nav-link {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 12px 18px;
            border-radius: 10px;
            color: #9ca3af;
            text-decoration: none;
            transition: all 0.2s;
            font-weight: 500;
          }
          .admin-nav-link:hover,
          .admin-nav-link.active {
            background: rgba(255, 152, 0, 0.15);
            color: #ff9800;
          }
        `}</style>
      </Head>
      <Component {...pageProps} />
    </>
  );
}
