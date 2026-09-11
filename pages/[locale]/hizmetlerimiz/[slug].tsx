import React from 'react';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import { getDb, DatabaseSchema, ServiceItem } from '../../../lib/db';

interface ServiceDetailProps {
  db: DatabaseSchema;
  service: ServiceItem;
  locale: 'tr' | 'en';
}

export default function ServiceDetailPage({ db, service, locale }: ServiceDetailProps) {
  const { settings, services } = db;
  const isTr = locale === 'tr';

  if (!service) {
    return <div>Service not found</div>;
  }

  return (
    <>
      <Head>
        <title>{service.title[locale]} - {settings.siteName}</title>
        <meta name="description" content={service.shortDesc[locale]} />
      </Head>

      <Header settings={settings} locale={locale} />

      {/* Header Banner */}
      <section className="py-5 text-center bg-black bg-opacity-40 border-bottom border-secondary border-opacity-25">
        <div className="container py-4">
          <Link href={`/${locale}/${isTr ? 'hizmetlerimiz' : 'services'}`} className="text-warning text-decoration-none small fw-bold">
            ← {isTr ? 'Tüm Hizmetler' : 'All Services'}
          </Link>
          <h1 className="display-4 fw-bold text-white mt-3">
            {service.title[locale]}
          </h1>
          <p className="text-secondary lead mt-2">{service.shortDesc[locale]}</p>
        </div>
      </section>

      {/* Detail Content */}
      <section className="py-5 my-4">
        <div className="container">
          <div className="row g-5">
            <div className="col-lg-8">
              <div className="card-dark p-4 p-lg-5">
                <div className="icon text-warning fs-1 mb-4">
                  <i className={`bi ${service.icon}`}></i>
                </div>
                <div
                  className="service-body text-light lead"
                  style={{ lineHeight: '1.9' }}
                  dangerouslySetInnerHTML={{ __html: service.content[locale] }}
                />

                <hr className="border-secondary my-5" />

                <div className="bg-black bg-opacity-30 p-4 rounded-4 d-flex justify-content-between align-items-center flex-wrap gap-3">
                  <div>
                    <h5 className="text-white fw-bold mb-1">
                      {isTr ? 'Bu Hizmet İçin Teklif Alın' : 'Get a Quote for This Service'}
                    </h5>
                    <p className="text-secondary small mb-0">
                      {isTr ? 'Projenizi uzman ekibimizle hayata geçirelim.' : 'Let’s bring your project to life with our expert team.'}
                    </p>
                  </div>
                  <Link href={isTr ? '/tr/iletisim' : '/en/contact'} className="primary-btn1 py-2 px-4">
                    <span>{isTr ? 'İletişime Geçin' : 'Contact Us'}</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Sidebar with Other Services */}
            <div className="col-lg-4">
              <div className="card-dark p-4 sticky-top" style={{ top: '100px' }}>
                <h5 className="text-white fw-bold mb-4 pb-2 border-bottom border-secondary">
                  {isTr ? 'Diğer Hizmetlerimiz' : 'Other Services'}
                </h5>
                <ul className="list-unstyled d-flex flex-column gap-3 mb-0">
                  {services.filter(s => s.id !== service.id).map(other => (
                    <li key={other.id}>
                      <Link
                        href={`/${locale}/${isTr ? 'hizmetlerimiz' : 'services'}/${other.slug[locale]}`}
                        className="text-secondary text-decoration-none d-flex align-items-center justify-content-between p-2 rounded hover-white"
                        style={{ background: 'rgba(255,255,255,0.03)' }}
                      >
                        <span className="small fw-semibold">{other.title[locale]}</span>
                        <i className="bi bi-chevron-right text-warning small"></i>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer settings={settings} services={services} locale={locale} />
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const locale = (params?.locale as 'tr' | 'en') || 'tr';
  const slug = params?.slug as string;
  const db = getDb();
  
  const service = db.services.find(s => s.slug.tr === slug || s.slug.en === slug || s.id === slug);
  if (!service) {
    return { notFound: true };
  }

  return { props: { db, service, locale } };
};
