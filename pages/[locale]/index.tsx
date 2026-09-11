import React from 'react';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { getDb, DatabaseSchema } from '../../lib/db';

interface HomePageProps {
  db: DatabaseSchema;
  locale: 'tr' | 'en';
}

export default function HomePage({ db, locale }: HomePageProps) {
  const { settings, home, services, works, blogs } = db;
  const isTr = locale === 'tr';

  return (
    <>
      <Head>
        <title>{settings.siteName} - {settings.tagline[locale]}</title>
        <meta name="description" content={settings.footerText[locale]} />
      </Head>

      <Header settings={settings} locale={locale} />

      {/* Hero Banner Section */}
      <section className="home1-banner-section py-5 mb-5 position-relative">
        <div className="container py-lg-4">
          <div className="row align-items-center gy-5">
            <div className="col-lg-6 order-2 order-lg-1">
              <div className="banner-content pe-lg-4">
                <span className="badge bg-warning text-dark px-3 py-2 rounded-pill fw-bold mb-3">
                  DIGITAL AGENCY
                </span>
                <h1 className="display-4 fw-bold text-white mb-4" style={{ lineHeight: '1.2' }}>
                  {home.hero.title[locale]}
                </h1>
                <p className="lead text-secondary mb-4" style={{ whiteSpace: 'pre-line', fontSize: '1.1rem', lineHeight: '1.8' }}>
                  {home.hero.description[locale]}
                </p>
                <div className="banner-content-bottom d-flex gap-3">
                  <Link href={home.hero.buttonLink[locale]} className="primary-btn1">
                    <span>{home.hero.buttonText[locale]}</span>
                  </Link>
                  <Link href={`/${locale}/${isTr ? 'hizmetlerimiz' : 'services'}`} className="btn btn-outline-light rounded-pill px-4 py-3 fw-semibold">
                    {isTr ? 'Hizmetlerimiz' : 'Our Services'}
                  </Link>
                </div>
              </div>
            </div>

            <div className="col-lg-6 order-1 order-lg-2 text-center position-relative">
              <div className="banner-img-wrap position-relative d-inline-block">
                <img
                  src={home.hero.image}
                  alt="Banner"
                  className="img-fluid rounded-4 shadow-lg"
                  style={{ maxHeight: '520px', border: '1px solid rgba(255,255,255,0.1)' }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About & Stats Section */}
      <section className="home1-about-section py-5 mb-5">
        <div className="container">
          <div className="row align-items-center gy-4 mb-5">
            <div className="col-lg-8">
              <div className="about-content pe-lg-4">
                <div className="about-section-title mb-3">
                  <span className="text-warning fw-bold text-uppercase" style={{ letterSpacing: '1px' }}>
                    ★ {home.about.badge}
                  </span>
                  <h2 className="text-white fw-bold display-6 mt-2">
                    {home.about.title[locale]}
                  </h2>
                </div>
                <p className="text-secondary" style={{ fontSize: '1.05rem', lineHeight: '1.8' }}>
                  {home.about.description[locale]}
                </p>
              </div>
            </div>

            <div className="col-lg-4">
              <div className="about-countdown-area d-flex flex-column gap-3">
                {home.about.stats.map((stat, idx) => (
                  <div key={idx} className="card-dark p-3 d-flex align-items-center gap-3">
                    <div className="icon bg-warning bg-opacity-10 text-warning rounded-3 p-3 fs-3">
                      <i className="bi bi-trophy"></i>
                    </div>
                    <div className="content">
                      <h3 className="text-white fw-bold mb-0">{stat.number}</h3>
                      <p className="text-secondary mb-0 small">{stat.sublabel[locale]}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Feature Cards Grid */}
          <div className="row g-4 mt-2">
            {home.about.features.map((feat, idx) => (
              <div key={idx} className="col-lg-3 col-md-6">
                <div className="card-dark p-4 h-100 text-center">
                  <div className="mb-3">
                    <img src={feat.icon} alt="Icon" width={48} height={48} className="img-fluid" />
                  </div>
                  <h5 className="text-white fw-bold mb-2">{feat.title[locale]}</h5>
                  <p className="text-secondary small mb-0">{feat.desc[locale]}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="services-section py-5 mb-5 bg-black bg-opacity-25">
        <div className="container py-4">
          <div className="d-flex justify-content-between align-items-end mb-5 flex-wrap gap-3">
            <div>
              <span className="text-warning fw-bold text-uppercase">{isTr ? 'Uzmanlık Alanlarımız' : 'What We Do'}</span>
              <h2 className="text-white fw-bold display-6 mt-1">{isTr ? 'Dijital Hizmetlerimiz' : 'Our Services'}</h2>
            </div>
            <Link href={`/${locale}/${isTr ? 'hizmetlerimiz' : 'services'}`} className="text-warning text-decoration-none fw-semibold">
              {isTr ? 'Tüm Hizmetleri Gör' : 'View All Services'} <i className="bi bi-arrow-right"></i>
            </Link>
          </div>

          <div className="row g-4">
            {services.slice(0, 6).map((srv) => (
              <div key={srv.id} className="col-lg-4 col-md-6">
                <div className="card-dark p-4 h-100 d-flex flex-column justify-content-between">
                  <div>
                    <div className="icon text-warning fs-1 mb-3">
                      <i className={`bi ${srv.icon}`}></i>
                    </div>
                    <h4 className="text-white fw-bold mb-2">{srv.title[locale]}</h4>
                    <p className="text-secondary small mb-4">{srv.shortDesc[locale]}</p>
                  </div>
                  <Link
                    href={`/${locale}/${isTr ? 'hizmetlerimiz' : 'services'}/${srv.slug[locale]}`}
                    className="text-white text-decoration-none fw-semibold small d-inline-flex align-items-center gap-2 hover-white"
                  >
                    {isTr ? 'Detayları İncele' : 'Read More'} <i className="bi bi-arrow-up-right text-warning"></i>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Works / Portfolio Section */}
      <section className="works-section py-5 mb-5">
        <div className="container">
          <div className="d-flex justify-content-between align-items-end mb-5 flex-wrap gap-3">
            <div>
              <span className="text-warning fw-bold text-uppercase">{isTr ? 'Portfolyo' : 'Portfolio'}</span>
              <h2 className="text-white fw-bold display-6 mt-1">{isTr ? 'Seçilmiş İşlerimiz' : 'Featured Works'}</h2>
            </div>
            <Link href={`/${locale}/${isTr ? 'isler' : 'works'}`} className="text-warning text-decoration-none fw-semibold">
              {isTr ? 'Tüm Projeleri İncele' : 'View All Projects'} <i className="bi bi-arrow-right"></i>
            </Link>
          </div>

          <div className="row g-4">
            {works.slice(0, 4).map((work) => {
              const workTitle = typeof work.title === 'string' ? work.title : work.title[locale];
              return (
                <div key={work.id} className="col-lg-6">
                  <div className="card-dark overflow-hidden h-100">
                    <div className="position-relative overflow-hidden" style={{ height: '320px', background: '#222' }}>
                      <img
                        src={work.image}
                        alt={workTitle}
                        className="w-100 h-100 object-fit-cover"
                        style={{ transition: 'transform 0.5s' }}
                      />
                    </div>
                    <div className="p-4">
                      <span className="badge bg-secondary bg-opacity-25 text-warning mb-2">
                        {work.category[locale]}
                      </span>
                      <h4 className="text-white fw-bold mb-2">{workTitle}</h4>
                      <p className="text-secondary small mb-3">{work.description[locale]}</p>
                      <Link
                        href={`/${locale}/${isTr ? 'isler' : 'works'}/${work.slug[locale]}`}
                        className="text-white text-decoration-none fw-semibold small d-inline-flex align-items-center gap-1"
                      >
                        {isTr ? 'Projeyi Gör' : 'View Project'} <i className="bi bi-arrow-right text-warning"></i>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Latest Blog Posts Section */}
      <section className="blog-section py-5 mb-5 bg-black bg-opacity-25">
        <div className="container py-4">
          <div className="d-flex justify-content-between align-items-end mb-5 flex-wrap gap-3">
            <div>
              <span className="text-warning fw-bold text-uppercase">{isTr ? 'Güncel Makaleler' : 'Latest Articles'}</span>
              <h2 className="text-white fw-bold display-6 mt-1">{isTr ? 'Blog Yazılarımız' : 'From the Blog'}</h2>
            </div>
            <Link href={`/${locale}/blog`} className="text-warning text-decoration-none fw-semibold">
              {isTr ? 'Tüm Yazılar' : 'All Articles'} <i className="bi bi-arrow-right"></i>
            </Link>
          </div>

          <div className="row g-4">
            {blogs.slice(0, 3).map((blog) => (
              <div key={blog.id} className="col-lg-4 col-md-6">
                <div className="card-dark overflow-hidden h-100 d-flex flex-column justify-content-between">
                  <div>
                    <div style={{ height: '220px', background: '#222' }}>
                      <img src={blog.image} alt={blog.title[locale]} className="w-100 h-100 object-fit-cover" />
                    </div>
                    <div className="p-4">
                      <div className="d-flex align-items-center gap-3 text-secondary small mb-2">
                        <span><i className="bi bi-calendar3"></i> {blog.date}</span>
                        <span>•</span>
                        <span>{blog.author}</span>
                      </div>
                      <h5 className="text-white fw-bold mb-3">{blog.title[locale]}</h5>
                      <p className="text-secondary small">{blog.excerpt[locale]}</p>
                    </div>
                  </div>
                  <div className="p-4 pt-0">
                    <Link
                      href={`/${locale}/blog/${blog.slug[locale]}`}
                      className="text-warning text-decoration-none fw-semibold small d-inline-flex align-items-center gap-1"
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

      {/* CTA Section */}
      <section className="cta-section py-5 my-5 text-center">
        <div className="container py-5 card-dark p-5 position-relative overflow-hidden">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <span className="text-warning fw-bold text-uppercase">
                {isTr ? 'Birlikte Başaralım' : 'Let’s Create Together'}
              </span>
              <h2 className="text-white fw-bold display-5 my-3">
                {isTr ? 'Markanızı Dijitalde Büyütmeye Hazır mısınız?' : 'Ready to Grow Your Brand Digitally?'}
              </h2>
              <p className="lead text-secondary mb-4">
                {isTr
                  ? 'Yaratıcı stratejiler ve ileri teknoloji çözümlerimizle hedeflerinize birlikte ulaşalım.'
                  : 'Let’s reach your goals together with creative strategies and cutting-edge solutions.'}
              </p>
              <Link href={isTr ? '/tr/iletisim' : '/en/contact'} className="primary-btn1 px-5 py-3 fs-5">
                <span>{isTr ? 'Hemen İletişime Geçin' : 'Contact Us Now'}</span>
              </Link>
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
  const db = getDb();
  return { props: { db, locale } };
};
