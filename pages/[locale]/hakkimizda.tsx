import React from 'react';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { getDb, DatabaseSchema } from '../../lib/db';

interface AboutPageProps {
  db: DatabaseSchema;
  locale: 'tr' | 'en';
}

export default function AboutPage({ db, locale }: AboutPageProps) {
  const { settings, home, services } = db;
  const isTr = locale === 'tr';

  return (
    <>
      <Head>
        <title>{isTr ? 'Hakkımızda' : 'About Us'} - {settings.siteName}</title>
      </Head>

      <Header settings={settings} locale={locale} />

      {/* Breadcrumb Header */}
      <section className="py-5 text-center bg-black bg-opacity-40 border-bottom border-secondary border-opacity-25">
        <div className="container py-4">
          <span className="text-warning text-uppercase fw-bold" style={{ letterSpacing: '2px' }}>
            {settings.siteName}
          </span>
          <h1 className="display-4 fw-bold text-white mt-2">
            {isTr ? 'Hakkımızda' : 'About Us'}
          </h1>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-5 my-4">
        <div className="container">
          <div className="row gy-5 align-items-center mb-5">
            <div className="col-lg-6">
              <span className="text-warning fw-bold text-uppercase">
                ★ {home.about.badge}
              </span>
              <h2 className="text-white fw-bold display-6 mt-2 mb-4">
                {home.about.title[locale]}
              </h2>
              <p className="text-secondary lead mb-4" style={{ lineHeight: '1.8' }}>
                {home.about.description[locale]}
              </p>
              <div className="d-flex gap-4">
                {home.about.stats.map((st, i) => (
                  <div key={i} className="border-start border-warning ps-3">
                    <h3 className="text-white fw-bold mb-0">{st.number}</h3>
                    <span className="text-secondary small">{st.sublabel[locale]}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="col-lg-6 text-center">
              <img
                src={home.hero.image}
                alt="About Us"
                className="img-fluid rounded-4 shadow-lg"
                style={{ maxHeight: '460px', border: '1px solid rgba(255,255,255,0.1)' }}
              />
            </div>
          </div>

          {/* Core Values / Features */}
          <div className="row g-4 mt-4">
            {home.about.features.map((feat, idx) => (
              <div key={idx} className="col-lg-3 col-md-6">
                <div className="card-dark p-4 h-100 text-center">
                  <div className="mb-3">
                    <img src={feat.icon} alt="Feature" width={54} height={54} className="img-fluid" />
                  </div>
                  <h5 className="text-white fw-bold mb-2">{feat.title[locale]}</h5>
                  <p className="text-secondary small mb-0">{feat.desc[locale]}</p>
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
