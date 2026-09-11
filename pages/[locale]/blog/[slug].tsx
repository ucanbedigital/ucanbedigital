import React from 'react';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import { getDb, DatabaseSchema, BlogItem } from '../../../lib/db';

interface BlogDetailProps {
  db: DatabaseSchema;
  blog: BlogItem;
  locale: 'tr' | 'en';
}

export default function BlogDetailPage({ db, blog, locale }: BlogDetailProps) {
  const { settings, blogs, services } = db;
  const isTr = locale === 'tr';

  if (!blog) {
    return <div>Blog not found</div>;
  }

  return (
    <>
      <Head>
        <title>{blog.title[locale]} - {settings.siteName}</title>
        <meta name="description" content={blog.excerpt[locale]} />
      </Head>

      <Header settings={settings} locale={locale} />

      {/* Header Banner */}
      <section className="py-5 text-center bg-black bg-opacity-40 border-bottom border-secondary border-opacity-25">
        <div className="container py-4">
          <Link href={`/${locale}/blog`} className="text-warning text-decoration-none small fw-bold">
            ← {isTr ? 'Tüm Yazılar' : 'All Articles'}
          </Link>
          <h1 className="display-5 fw-bold text-white mt-3">{blog.title[locale]}</h1>
          <div className="d-flex justify-content-center align-items-center gap-3 text-secondary mt-3">
            <span><i className="bi bi-person"></i> {blog.author}</span>
            <span>•</span>
            <span><i className="bi bi-calendar3"></i> {blog.date}</span>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-5 my-4">
        <div className="container">
          <div className="row g-5">
            <div className="col-lg-8">
              <div className="card-dark overflow-hidden p-0 mb-5">
                <img src={blog.image} alt={blog.title[locale]} className="w-100 img-fluid rounded-top" style={{ maxHeight: '450px', objectFit: 'cover' }} />
                <div className="p-4 p-lg-5">
                  <p className="lead text-warning fw-semibold mb-4">{blog.excerpt[locale]}</p>
                  <div
                    className="blog-body text-light lead"
                    style={{ lineHeight: '1.9' }}
                    dangerouslySetInnerHTML={{ __html: blog.content[locale] }}
                  />
                </div>
              </div>
            </div>

            {/* Other Blogs Sidebar */}
            <div className="col-lg-4">
              <div className="card-dark p-4 sticky-top" style={{ top: '100px' }}>
                <h5 className="text-white fw-bold mb-4 pb-2 border-bottom border-secondary">
                  {isTr ? 'Önerilen Yazılar' : 'Recommended Articles'}
                </h5>
                <div className="d-flex flex-column gap-3">
                  {blogs.filter(b => b.id !== blog.id).map(other => (
                    <Link
                      key={other.id}
                      href={`/${locale}/blog/${other.slug[locale]}`}
                      className="text-decoration-none d-flex gap-3 align-items-center p-2 rounded hover-white"
                      style={{ background: 'rgba(255,255,255,0.03)' }}
                    >
                      <img src={other.image} alt={other.title[locale]} width={60} height={50} className="rounded object-fit-cover" />
                      <div>
                        <h6 className="text-white mb-0 small fw-bold">{other.title[locale]}</h6>
                        <span className="text-secondary" style={{ fontSize: '11px' }}>{other.date}</span>
                      </div>
                    </Link>
                  ))}
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
  
  const blog = db.blogs.find(b => b.slug.tr === slug || b.slug.en === slug || b.id === slug);
  if (!blog) {
    return { notFound: true };
  }

  return { props: { db, blog, locale } };
};
