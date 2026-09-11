import React from 'react';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import { getDb, DatabaseSchema } from '../../../lib/db';

interface ServicesPageProps {
  db: DatabaseSchema;
  locale: 'tr' | 'en';
}

export default function ServicesPage({ db, locale }: ServicesPageProps) {
  const { settings, services } = db;
  const isTr = locale === 'tr';

  return (
    <>
      <Head>
        <title>{isTr ? 'Hizmetlerimiz' : 'Our Services'} - {settings.siteName}</title>
      </Head>

      <Header settings={settings} locale={locale} />

      {/* Header Banner */}
      <section className="py-5 text-center bg-black bg-opacity-40 border-bottom border-secondary border-opacity-25">
        <div className="container py-4">
          <span className="text-warning text-uppercase fw-bold" style={{ letterSpacing: '2px' }}>
            {settings.siteName}
          </span>
          <h1 className="display-4 fw-bold text-white mt-2">
            {isTr ? 'Hizmetlerimiz' : 'Our Services'}
          </h1>
          <p className="text-secondary lead mt-3">
            {isTr
              ? 'Markanızı dijital dünyada öne çıkaran 360° ajans çözümleri.'
              : '360° digital agency solutions to elevate your brand.'}
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-5 my-4">
        <div className="container">
          <div className="row g-4">
            {services.map((srv) => (
              <div key={srv.id} className="col-lg-4 col-md-6">
                <div className="card-dark p-4 h-100 d-flex flex-column justify-content-between">
                  <div>
                    <div className="icon text-warning fs-1 mb-3">
                      <i className={`bi ${srv.icon}`}></i>
                    </div>
                    <h3 className="text-white fw-bold h4 mb-3">{srv.title[locale]}</h3>
                    <p className="text-secondary small mb-4" style={{ lineHeight: '1.7' }}>
                      {srv.shortDesc[locale]}
                    </p>
                  </div>
                  <Link
                    href={`/${locale}/${isTr ? 'hizmetlerimiz' : 'services'}/${srv.slug[locale]}`}
                    className="text-warning text-decoration-none fw-bold small d-inline-flex align-items-center gap-2"
                  >
                    {isTr ? 'Detayları İncele' : 'Read More'} <i className="bi bi-arrow-right"></i>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer settings={settings} services={services} locale={locale} />
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const locale = (params?.locale as 'tr' | 'en') || 'tr';
  const db = getDb();
  return { props: { db, locale } };
};
