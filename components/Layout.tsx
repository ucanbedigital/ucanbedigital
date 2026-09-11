import React, { useEffect } from 'react';
import Head from 'next/head';
import Header from './Header';
import Footer from './Footer';
import { SiteSettings } from '../lib/db';

interface LayoutProps {
  meta?: {
    title?: string;
    description?: string;
  };
  settings: SiteSettings;
  locale: 'tr' | 'en';
  isInner?: boolean;
  children?: React.ReactNode;
  rawHtml?: string;
}

export default function Layout({
  meta,
  settings,
  locale,
  isInner = false,
  children,
  rawHtml
}: LayoutProps) {
  useEffect(() => {
    // Intercept contact forms inside rawHtml to handle submission via API
    const forms = document.querySelectorAll('form');
    const handleSubmit = async (e: Event) => {
      e.preventDefault();
      const form = e.target as HTMLFormElement;
      const formData = new FormData(form);
      const data: Record<string, any> = {};
      formData.forEach((value, key) => {
        data[key] = value;
      });

      try {
        const res = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        if (res.ok) {
          alert(locale === 'tr' ? 'Mesajınız başarıyla gönderildi!' : 'Your message has been sent successfully!');
          form.reset();
        } else {
          alert(locale === 'tr' ? 'Bir hata oluştu, lütfen tekrar deneyin.' : 'An error occurred, please try again.');
        }
      } catch (err) {
        alert(locale === 'tr' ? 'Bir hata oluştu.' : 'An error occurred.');
      }
    };

    forms.forEach((form) => form.addEventListener('submit', handleSubmit));
    return () => {
      forms.forEach((form) => form.removeEventListener('submit', handleSubmit));
    };
  }, [rawHtml, locale]);

  return (
    <>
      <Head>
        <title>{meta?.title || 'U.CAN.BE Whatever You Want! - U.CAN.BE Dijital Ajans'}</title>
        <meta
          name="description"
          content={
            meta?.description ||
            'Markanıza uygun strateji, etkileyici, şık tasarım ve iletişim yaklaşımı ile yanınızdayız.'
          }
        />
      </Head>

      <Header settings={settings} locale={locale} isInner={isInner} />

      {rawHtml ? (
        <main dangerouslySetInnerHTML={{ __html: rawHtml }} />
      ) : (
        <main>{children}</main>
      )}

      <Footer settings={settings} locale={locale} />
    </>
  );
}
