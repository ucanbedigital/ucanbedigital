import React from 'react';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import { getDb, DatabaseSchema } from '../../../lib/db';

interface BlogIndexProps {
  db: DatabaseSchema;
  locale: 'tr' | 'en';
}

export default function BlogIndexPage({ db, locale }: BlogIndexProps) {
  const { settings, blogs, services } = db;
  const isTr = locale === 'tr';

  return (
    <>
      <Head>
        <title>{isTr ? 'Blog' : 'Blog'} - {settings.siteName}</title>
      </Head>

      <Header settings={settings} locale={locale} />

      {/* Header Banner */}
      <section className="py-5 text-center bg-black bg-opacity-40 border-bottom border-secondary border-opacity-25">
        <div className="container py-4">
          <span className="text-warning text-uppercase fw-bold" style={{ letterSpacing: '2px' }}>
            {settings.siteName}
          </span>
          <h1 className="display-4 fw-bold text-white mt-2">
            {isTr ? 'Blog & Makaleler' : 'Blog & Articles'}
          </h1>
          <p className="text-secondary lead mt-3">
            {isTr
              ? 'Dijital dünya, teknoloji, yapay zeka ve pazarlama trendlerine dair en güncel yazılar.'
              : 'Latest insights on digital marketing, technology, AI, and industry trends.'}
          </p>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="py-5 my-4">
        <div className="container">
          <div className="row g-4">
            {blogs.map((blog) => (
              <div key={blog.id} className="col-lg-4 col-md-6">
                <div className="card-dark overflow-hidden h-100 d-flex flex-column justify-content-between">
                  <div>
                    <div style={{ height: '240px', background: '#222' }}>
                      <img src={blog.image} alt={blog.title[locale]} className="w-100 h-100 object-fit-cover" />
                    </div>
                    <div className="p-4">
                      <div className="d-flex align-items-center gap-3 text-secondary small mb-2">
                        <span><i className="bi bi-calendar3"></i> {blog.date}</span>
                        <span>•</span>
                        <span>{blog.author}</span>
                      </div>
                      <h3 className="text-white fw-bold h5 mb-3">{blog.title[locale]}</h3>
                      <p className="text-secondary small">{blog.excerpt[locale]}</p>
                    </div>
                  </div>
                  <div className="p-4 pt-0">
                    <Link
                      href={`/${locale}/blog/${blog.slug[locale]}`}
                      className="text-warning text-decoration-none fw-bold small d-inline-flex align-items-center gap-1"
                    >
                      {isTr ? 'Devamını Oku' : 'Read More'} <i className="bi bi-arrow-right"></i>
                    </Link>
                  </div>
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
