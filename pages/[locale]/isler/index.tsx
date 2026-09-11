import React from 'react';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import { getDb, DatabaseSchema } from '../../../lib/db';

interface WorksPageProps {
  db: DatabaseSchema;
  locale: 'tr' | 'en';
}

export default function WorksPage({ db, locale }: WorksPageProps) {
  const { settings, works, services } = db;
  const isTr = locale === 'tr';

  return (
    <>
      <Head>
        <title>{isTr ? 'İşler / Portfolyo' : 'Our Works'} - {settings.siteName}</title>
      </Head>

      <Header settings={settings} locale={locale} />

      {/* Header Banner */}
      <section className="py-5 text-center bg-black bg-opacity-40 border-bottom border-secondary border-opacity-25">
        <div className="container py-4">
          <span className="text-warning text-uppercase fw-bold" style={{ letterSpacing: '2px' }}>
            {settings.siteName}
          </span>
          <h1 className="display-4 fw-bold text-white mt-2">
            {isTr ? 'Projelerimiz & İşlerimiz' : 'Our Portfolio & Works'}
          </h1>
          <p className="text-secondary lead mt-3">
            {isTr
              ? 'Lider markalar için hayata geçirdiğimiz gurur duyduğumuz başarı hikayeleri.'
              : 'Success stories we proudly crafted for leading brands.'}
          </p>
        </div>
      </section>

      {/* Works Grid */}
      <section className="py-5 my-4">
        <div className="container">
          <div className="row g-4">
            {works.map((work) => {
              const workTitle = typeof work.title === 'string' ? work.title : work.title[locale];
              return (
                <div key={work.id} className="col-lg-6">
                  <div className="card-dark overflow-hidden h-100">
                    <div className="position-relative" style={{ height: '340px', background: '#222' }}>
                      <img
                        src={work.image}
                        alt={workTitle}
                        className="w-100 h-100 object-fit-cover"
                      />
                    </div>
                    <div className="p-4">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <span className="badge bg-secondary bg-opacity-25 text-warning">
                          {work.category[locale]}
                        </span>
                        <span className="text-secondary small">{work.year}</span>
                      </div>
                      <h3 className="text-white fw-bold h4 mb-2">{workTitle}</h3>
                      <p className="text-secondary small mb-3">{work.description[locale]}</p>
                      <Link
                        href={`/${locale}/${isTr ? 'isler' : 'works'}/${work.slug[locale]}`}
                        className="text-warning text-decoration-none fw-bold small d-inline-flex align-items-center gap-1"
                      >
                        {isTr ? 'Detayları İncele' : 'View Project'} <i className="bi bi-arrow-right"></i>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
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
