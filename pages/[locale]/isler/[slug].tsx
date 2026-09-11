import React from 'react';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import { getDb, DatabaseSchema, WorkItem } from '../../../lib/db';

interface WorkDetailProps {
  db: DatabaseSchema;
  work: WorkItem;
  locale: 'tr' | 'en';
}

export default function WorkDetailPage({ db, work, locale }: WorkDetailProps) {
  const { settings, services, works } = db;
  const isTr = locale === 'tr';

  if (!work) {
    return <div>Work not found</div>;
  }

  const workTitle = typeof work.title === 'string' ? work.title : work.title[locale];

  return (
    <>
      <Head>
        <title>{workTitle} - {settings.siteName}</title>
        <meta name="description" content={work.description[locale]} />
      </Head>

      <Header settings={settings} locale={locale} />

      {/* Header Banner */}
      <section className="py-5 text-center bg-black bg-opacity-40 border-bottom border-secondary border-opacity-25">
        <div className="container py-4">
          <Link href={`/${locale}/${isTr ? 'isler' : 'works'}`} className="text-warning text-decoration-none small fw-bold">
            ← {isTr ? 'Tüm Projeler' : 'All Works'}
          </Link>
          <h1 className="display-4 fw-bold text-white mt-3">{workTitle}</h1>
          <p className="text-secondary lead mt-2">{work.category[locale]}</p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-5 my-4">
        <div className="container">
          <div className="row g-5">
            <div className="col-lg-8">
              <div className="card-dark overflow-hidden p-0 mb-5">
                <img src={work.image} alt={workTitle} className="w-100 img-fluid rounded-top" style={{ maxHeight: '500px', objectFit: 'cover' }} />
                <div className="p-4 p-lg-5">
                  <h3 className="text-white fw-bold mb-4">{isTr ? 'Proje Özeti' : 'Project Overview'}</h3>
                  <div
                    className="lead text-secondary"
                    style={{ lineHeight: '1.9' }}
                    dangerouslySetInnerHTML={{ __html: work.content[locale] }}
                  />
                </div>
              </div>
            </div>

            {/* Meta Info Sidebar */}
            <div className="col-lg-4">
              <div className="card-dark p-4 mb-4">
                <h5 className="text-white fw-bold mb-4 pb-2 border-bottom border-secondary">
                  {isTr ? 'Proje Detayları' : 'Project Info'}
                </h5>
                <ul className="list-unstyled d-flex flex-column gap-3 mb-0">
                  <li>
                    <span className="text-secondary d-block small">{isTr ? 'Müşteri' : 'Client'}</span>
                    <strong className="text-white">{work.client}</strong>
                  </li>
                  <li>
                    <span className="text-secondary d-block small">{isTr ? 'Kategori' : 'Category'}</span>
                    <strong className="text-white">{work.category[locale]}</strong>
                  </li>
                  <li>
                    <span className="text-secondary d-block small">{isTr ? 'Yıl' : 'Year'}</span>
                    <strong className="text-white">{work.year}</strong>
                  </li>
                </ul>
              </div>

              {/* Other Works */}
              <div className="card-dark p-4">
                <h5 className="text-white fw-bold mb-3">{isTr ? 'Diğer İşler' : 'Other Works'}</h5>
                <div className="d-flex flex-column gap-3">
                  {works.filter(w => w.id !== work.id).slice(0, 3).map(other => {
                    const otherTitle = typeof other.title === 'string' ? other.title : other.title[locale];
                    return (
                      <Link
                        key={other.id}
                        href={`/${locale}/${isTr ? 'isler' : 'works'}/${other.slug[locale]}`}
                        className="text-decoration-none d-flex gap-3 align-items-center p-2 rounded hover-white"
                        style={{ background: 'rgba(255,255,255,0.03)' }}
                      >
                        <img src={other.image} alt={otherTitle} width={60} height={50} className="rounded object-fit-cover" />
                        <div>
                          <h6 className="text-white mb-0 small fw-bold">{otherTitle}</h6>
                          <span className="text-secondary" style={{ fontSize: '11px' }}>{other.category[locale]}</span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
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
  
  const work = db.works.find(w => w.slug.tr === slug || w.slug.en === slug || w.id === slug);
  if (!work) {
    return { notFound: true };
  }

  return { props: { db, work, locale } };
};
