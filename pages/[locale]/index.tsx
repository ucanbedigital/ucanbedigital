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

      {/* 1. HERO BANNER SECTION (Original ucanbedigital DOM) */}
      <div className="home1-banner-section mb-110">
        <div className="container">
          <div className="row">
            <div className="col-lg-6 order-1 order-lg-0 d-flex align-items-xxl-start align-items-center">
              <div className="banner-content">
                <h1>{home.hero.title[locale]}</h1>
                <p>
                  <b>{isTr ? 'Hızlı Yanıt Süreleri:' : 'Fast Response Times:'}</b> {isTr ? 'Markanızı her zaman rekabetin önünde tutun.' : 'Keep your brand ahead of the competition.'}<br />
                  <b>{isTr ? 'Yaratıcı Dijital Çözümler:' : 'Creative Digital Solutions:'}</b> {isTr ? 'Unutulmaz dijital deneyimler tasarlayın.' : 'Design unforgettable digital experiences.'}<br />
                  <b>{isTr ? 'Marka Değeri ve Gücü:' : 'Brand Value & Power:'}</b> {isTr ? 'Dijital varlığınızı güçlendirerek markanızı yükseltin.' : 'Elevate your brand by strengthening your digital presence.'}<br />
                  <b>{isTr ? 'Üstün Kalite ve Farklılık:' : 'Superior Quality & Distinction:'}</b> {isTr ? 'Dijital dünyada öne çıkın, sıradanlığın ötesine geçin.' : 'Stand out in the digital world, go beyond the ordinary.'}<br />
                  {isTr ? 'Eğer bu tür bir dijital dönüşüm arıyorsanız, birlikte olağanüstü bir başarıya imza atalım' : "If you are looking for such a transformation, let's achieve extraordinary success together."}
                </p>
                <div className="banner-content-bottom">
                  <Link className="primary-btn1" data-text={home.hero.buttonText[locale]} href={isTr ? '/tr/iletisim' : '/en/contact'}>
                    <span>{home.hero.buttonText[locale]}</span>
                  </Link>
                </div>
              </div>
            </div>

            <div className="col-lg-6 order-0 order-lg-1 mb-4 mb-lg-0 position-relative">
              <div className="banner-img-wrap">
                <img src="/assets/img/home1/banner-img-1.webp" alt="Banner Image" width="636" height="494" className="img-fluid" />
              </div>
              <div className="video-area">
                <div className="badge">
                  <span className="badge__char">D</span>
                  <span className="badge__char">E</span>
                  <span className="badge__char">V</span>
                  <span className="badge__char">E</span>
                  <span className="badge__char">L</span>
                  <span className="badge__char">O</span>
                  <span className="badge__char">P</span>
                  <span className="badge__char">M</span>
                  <span className="badge__char">E</span>
                  <span className="badge__char">N</span>
                  <span className="badge__char">T</span>
                  <span className="badge__char">.</span>
                  <span className="badge__char">D</span>
                  <span className="badge__char">E</span>
                  <span className="badge__char">S</span>
                  <span className="badge__char">I</span>
                  <span className="badge__char">G</span>
                  <span className="badge__char">N</span>
                  <span className="badge__char">.</span>
                  <span className="badge__char">S</span>
                  <span className="badge__char">E</span>
                  <span className="badge__char">O</span>
                  <span className="badge__char">.</span>
                  <div className="play">
                    <span style={{ cursor: 'pointer' }} className="play-icon video1">
                      <i className="bi bi-play-fill"></i>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. ABOUT & COUNTDOWN SECTION (Original ucanbedigital DOM) */}
      <div className="home1-about-section mb-110">
        <div className="container">
          <div className="row mb-90">
            <div className="col-lg-9 wow animate fadeInUp" data-wow-delay="200ms" data-wow-duration="2000ms">
              <div className="about-content">
                <div className="about-section-title">
                  <span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14">
                      <g>
                        <path d="M6.6304 0.338424C6.67018 -0.112811 7.32982 -0.112807 7.3696 0.338428L7.72654 4.38625C7.75291 4.68505 8.10454 4.83069 8.33443 4.63804L11.4491 2.02821C11.7963 1.73728 12.2627 2.20368 11.9718 2.55089L9.36197 5.66556C9.1693 5.89546 9.31496 6.24709 9.61374 6.27346L13.6615 6.6304C14.1128 6.67018 14.1128 7.32982 13.6615 7.3696L9.61374 7.72654C9.31496 7.75291 9.1693 8.10454 9.36197 8.33443L11.9718 11.4491C12.2627 11.7963 11.7963 12.2627 11.4491 11.9718L8.33443 9.36197C8.10454 9.1693 7.75291 9.31496 7.72654 9.61374L7.3696 13.6615C7.32982 14.1128 6.67018 14.1128 6.6304 13.6615L6.27346 9.61374C6.24709 9.31496 5.89546 9.1693 5.66556 9.36197L2.55089 11.9718C2.20368 12.2627 1.73729 11.7963 2.02822 11.4491L4.63804 8.33443C4.83069 8.10454 4.68504 7.75291 4.38625 7.72654L0.338424 7.3696C-0.112811 7.32982 -0.112807 6.67018 0.338428 6.6304L4.38625 6.27346C4.68505 6.24709 4.83069 5.89546 4.63804 5.66556L2.02821 2.55089C1.73728 2.20368 2.20368 1.73729 2.55089 2.02822L5.66556 4.63804C5.89546 4.83069 6.24709 4.68504 6.27346 4.38625L6.6304 0.338424Z"></path>
                      </g>
                    </svg>
                    <span><strong>U.CAN.BE</strong> Whatever You Want!</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14">
                      <g>
                        <path d="M6.6304 0.338424C6.67018 -0.112811 7.32982 -0.112807 7.3696 0.338428L7.72654 4.38625C7.75291 4.68505 8.10454 4.83069 8.33443 4.63804L11.4491 2.02821C11.7963 1.73728 12.2627 2.20368 11.9718 2.55089L9.36197 5.66556C9.1693 5.89546 9.31496 6.24709 9.61374 6.27346L13.6615 6.6304C14.1128 6.67018 14.1128 7.32982 13.6615 7.3696L9.61374 7.72654C9.31496 7.75291 9.1693 8.10454 9.36197 8.33443L11.9718 11.4491C12.2627 11.7963 11.7963 12.2627 11.4491 11.9718L8.33443 9.36197C8.10454 9.1693 7.75291 9.31496 7.72654 9.61374L7.3696 13.6615C7.32982 14.1128 6.67018 14.1128 6.6304 13.6615L6.27346 9.61374C6.24709 9.31496 5.89546 9.1693 5.66556 9.36197L2.55089 11.9718C2.20368 12.2627 1.73729 11.7963 2.02822 11.4491L4.63804 8.33443C4.83069 8.10454 4.68504 7.75291 4.38625 7.72654L0.338424 7.3696C-0.112811 7.32982 -0.112807 6.67018 0.338428 6.6304L4.38625 6.27346C4.68505 6.24709 4.83069 5.89546 4.63804 5.66556L2.02821 2.55089C1.73728 2.20368 2.20368 1.73729 2.55089 2.02822L5.66556 4.63804C5.89546 4.83069 6.24709 4.68504 6.27346 4.38625L6.6304 0.338424Z"></path>
                      </g>
                    </svg>
                  </span>
                  <h2>{home.about.title[locale]}</h2>
                  <p>{home.about.description[locale]}</p>
                </div>
              </div>
            </div>

            <div className="col-lg-3 d-flex justify-content-lg-end wow animate fadeInRight" data-wow-delay="200ms" data-wow-duration="2000ms">
              <div className="about-countdown-area">
                <ul>
                  <li className="single-countdown">
                    <div className="icon">
                      <i className="bi bi-briefcase text-warning fs-1"></i>
                    </div>
                    <div className="content">
                      <div className="number">
                        <h5 className="counter"><span>{home.about.stats[0]?.number || '1,500+'}</span></h5>
                        <span>{isTr ? 'Proje' : 'Projects'}</span>
                      </div>
                      <p>{home.about.stats[0]?.sublabel[locale] || (isTr ? 'Tamamladığımız Projeler' : 'Completed Projects')}</p>
                    </div>
                  </li>
                  <li className="single-countdown">
                    <div className="icon">
                      <i className="bi bi-heart text-warning fs-1"></i>
                    </div>
                    <div className="content">
                      <div className="number">
                        <h5 className="counter"><span>{home.about.stats[1]?.number || '90%'}</span></h5>
                      </div>
                      <p>{home.about.stats[1]?.sublabel[locale] || (isTr ? 'Müşteri Memnuniyeti' : 'Customer Satisfaction')}</p>
                    </div>
                  </li>
                  <li className="single-countdown">
                    <div className="icon">
                      <i className="bi bi-award text-warning fs-1"></i>
                    </div>
                    <div className="content">
                      <div className="number">
                        <h5 className="counter"><span>{home.about.stats[2]?.number || '10+'}</span></h5>
                        <span>{isTr ? 'Yıl' : 'Years'}</span>
                      </div>
                      <p>{home.about.stats[2]?.sublabel[locale] || (isTr ? 'Sektör Tecrübesi' : 'Industry Experience')}</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Feature Area */}
          <div className="about-feature-area">
            <div className="row g-4 justify-content-center">
              {home.about.features.map((feat, idx) => (
                <div key={idx} className="col-lg-3 col-sm-6">
                  <div className="about-feature-card">
                    <div className="icon">
                      <img src={feat.icon} alt={feat.title[locale]} />
                    </div>
                    <div className="content">
                      <h4>{feat.title[locale]}</h4>
                      <p>{feat.desc[locale]}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 3. SOLUTIONS / SERVICES SECTION (Original ucanbedigital DOM) */}
      <div className="home1-solution-section mb-110">
        <div className="container">
          <div className="row mb-60">
            <div className="col-lg-12">
              <div className="section-title wow animate fadeInLeft" data-wow-delay="200ms" data-wow-duration="1500ms">
                <span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14">
                    <path d="M6.6304 0.338424C6.67018 -0.112811 7.32982 -0.112807 7.3696 0.338428L7.72654 4.38625C7.75291 4.68505 8.10454 4.83069 8.33443 4.63804L11.4491 2.02821C11.7963 1.73728 12.2627 2.20368 11.9718 2.55089L9.36197 5.66556C9.1693 5.89546 9.31496 6.24709 9.61374 6.27346L13.6615 6.6304C14.1128 6.67018 14.1128 7.32982 13.6615 7.3696L9.61374 7.72654C9.31496 7.75291 9.1693 8.10454 9.36197 8.33443L11.9718 11.4491C12.2627 11.7963 11.7963 12.2627 11.4491 11.9718L8.33443 9.36197C8.10454 9.1693 7.75291 9.31496 7.72654 9.61374L7.3696 13.6615C7.32982 14.1128 6.67018 14.1128 6.6304 13.6615L6.27346 9.61374C6.24709 9.31496 5.89546 9.1693 5.66556 9.36197L2.55089 11.9718C2.20368 12.2627 1.73729 11.7963 2.02822 11.4491L4.63804 8.33443C4.83069 8.10454 4.68504 7.75291 4.38625 7.72654L0.338424 7.3696C-0.112811 7.32982 -0.112807 6.67018 0.338428 6.6304L4.38625 6.27346C4.68505 6.24709 4.83069 5.89546 4.63804 5.66556L2.02821 2.55089C1.73728 2.20368 2.20368 1.73729 2.55089 2.02822L5.66556 4.63804C5.89546 4.83069 6.24709 4.68504 6.27346 4.38625L6.6304 0.338424Z" fill="currentColor"></path>
                  </svg>
                  {isTr ? 'Çözümlerimiz' : 'Our Solutions'}
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14">
                    <path d="M6.6304 0.338424C6.67018 -0.112811 7.32982 -0.112807 7.3696 0.338428L7.72654 4.38625C7.75291 4.68505 8.10454 4.83069 8.33443 4.63804L11.4491 2.02821C11.7963 1.73728 12.2627 2.20368 11.9718 2.55089L9.36197 5.66556C9.1693 5.89546 9.31496 6.24709 9.61374 6.27346L13.6615 6.6304C14.1128 6.67018 14.1128 7.32982 13.6615 7.3696L9.61374 7.72654C9.31496 7.75291 9.1693 8.10454 9.36197 8.33443L11.9718 11.4491C12.2627 11.7963 11.7963 12.2627 11.4491 11.9718L8.33443 9.36197C8.10454 9.1693 7.75291 9.31496 7.72654 9.61374L7.3696 13.6615C7.32982 14.1128 6.67018 14.1128 6.6304 13.6615L6.27346 9.61374C6.24709 9.31496 5.89546 9.1693 5.66556 9.36197L2.55089 11.9718C2.20368 12.2627 1.73729 11.7963 2.02822 11.4491L4.63804 8.33443C4.83069 8.10454 4.68504 7.75291 4.38625 7.72654L0.338424 7.3696C-0.112811 7.32982 -0.112807 6.67018 0.338428 6.6304L4.38625 6.27346C4.68505 6.24709 4.83069 5.89546 4.63804 5.66556L2.02821 2.55089C1.73728 2.20368 2.20368 1.73729 2.55089 2.02822L5.66556 4.63804C5.89546 4.83069 6.24709 4.68504 6.27346 4.38625L6.6304 0.338424Z" fill="currentColor"></path>
                  </svg>
                </span>
                <h2>{isTr ? 'Dijitalde Sınırları Zorlayan Çözümlerimiz' : 'Pushing Limits with Digital Solutions'}</h2>
              </div>
            </div>
          </div>

          <div className="row g-4">
            {services.slice(0, 6).map((srv) => (
              <div key={srv.id} className="col-lg-4 col-md-6">
                <div className="solution-card">
                  <div className="icon">
                    <i className={`bi ${srv.icon} text-warning fs-2`}></i>
                  </div>
                  <div className="content">
                    <h4>
                      <Link href={`/${locale}/${isTr ? 'hizmetlerimiz' : 'services'}/${srv.slug[locale]}`}>
                        {srv.title[locale]}
                      </Link>
                    </h4>
                    <p>{srv.shortDesc[locale]}</p>
                    <Link className="read-more-btn" href={`/${locale}/${isTr ? 'hizmetlerimiz' : 'services'}/${srv.slug[locale]}`}>
                      <span>{isTr ? 'İncele' : 'Explore'}</span>
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12">
                        <path d="M10.0035 3.40804L1.41153 12L0 10.5885L8.59097 1.99651H1.01922V0H12V10.9808H10.0035V3.40804Z"></path>
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. PORTFOLIO / WORKS SECTION (Original ucanbedigital DOM) */}
      <div className="portfolio-section mb-110">
        <div className="container">
          <div className="row mb-60">
            <div className="col-lg-12">
              <div className="section-title wow animate fadeInLeft" data-wow-delay="200ms" data-wow-duration="1500ms">
                <span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14">
                    <path d="M6.6304 0.338424C6.67018 -0.112811 7.32982 -0.112807 7.3696 0.338428L7.72654 4.38625C7.75291 4.68505 8.10454 4.83069 8.33443 4.63804L11.4491 2.02821C11.7963 1.73728 12.2627 2.20368 11.9718 2.55089L9.36197 5.66556C9.1693 5.89546 9.31496 6.24709 9.61374 6.27346L13.6615 6.6304C14.1128 6.67018 14.1128 7.32982 13.6615 7.3696L9.61374 7.72654C9.31496 7.75291 9.1693 8.10454 9.36197 8.33443L11.9718 11.4491C12.2627 11.7963 11.7963 12.2627 11.4491 11.9718L8.33443 9.36197C8.10454 9.1693 7.75291 9.31496 7.72654 9.61374L7.3696 13.6615C7.32982 14.1128 6.67018 14.1128 6.6304 13.6615L6.27346 9.61374C6.24709 9.31496 5.89546 9.1693 5.66556 9.36197L2.55089 11.9718C2.20368 12.2627 1.73729 11.7963 2.02822 11.4491L4.63804 8.33443C4.83069 8.10454 4.68504 7.75291 4.38625 7.72654L0.338424 7.3696C-0.112811 7.32982 -0.112807 6.67018 0.338428 6.6304L4.38625 6.27346C4.68505 6.24709 4.83069 5.89546 4.63804 5.66556L2.02821 2.55089C1.73728 2.20368 2.20368 1.73729 2.55089 2.02822L5.66556 4.63804C5.89546 4.83069 6.24709 4.68504 6.27346 4.38625L6.6304 0.338424Z" fill="currentColor"></path>
                  </svg>
                  {isTr ? 'İşlerimiz' : 'Our Works'}
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14">
                    <path d="M6.6304 0.338424C6.67018 -0.112811 7.32982 -0.112807 7.3696 0.338428L7.72654 4.38625C7.75291 4.68505 8.10454 4.83069 8.33443 4.63804L11.4491 2.02821C11.7963 1.73728 12.2627 2.20368 11.9718 2.55089L9.36197 5.66556C9.1693 5.89546 9.31496 6.24709 9.61374 6.27346L13.6615 6.6304C14.1128 6.67018 14.1128 7.32982 13.6615 7.3696L9.61374 7.72654C9.31496 7.75291 9.1693 8.10454 9.36197 8.33443L11.9718 11.4491C12.2627 11.7963 11.7963 12.2627 11.4491 11.9718L8.33443 9.36197C8.10454 9.1693 7.75291 9.31496 7.72654 9.61374L7.3696 13.6615C7.32982 14.1128 6.67018 14.1128 6.6304 13.6615L6.27346 9.61374C6.24709 9.31496 5.89546 9.1693 5.66556 9.36197L2.55089 11.9718C2.20368 12.2627 1.73729 11.7963 2.02822 11.4491L4.63804 8.33443C4.83069 8.10454 4.68504 7.75291 4.38625 7.72654L0.338424 7.3696C-0.112811 7.32982 -0.112807 6.67018 0.338428 6.6304L4.38625 6.27346C4.68505 6.24709 4.83069 5.89546 4.63804 5.66556L2.02821 2.55089C1.73728 2.20368 2.20368 1.73729 2.55089 2.02822L5.66556 4.63804C5.89546 4.83069 6.24709 4.68504 6.27346 4.38625L6.6304 0.338424Z" fill="currentColor"></path>
                  </svg>
                </span>
                <h2>{isTr ? 'Başarı Hikayelerimiz' : 'Our Success Stories'}</h2>
              </div>
            </div>
          </div>

          <div className="row g-4">
            {works.slice(0, 4).map((work) => {
              const workTitle = typeof work.title === 'string' ? work.title : work.title[locale];
              return (
                <div key={work.id} className="col-lg-6">
                  <div className="portfolio-card">
                    <div className="image">
                      <img src={work.image} alt={workTitle} className="img-fluid" />
                    </div>
                    <div className="content">
                      <span>{work.category[locale]}</span>
                      <h4>
                        <Link href={`/${locale}/${isTr ? 'isler' : 'works'}/${work.slug[locale]}`}>
                          {workTitle}
                        </Link>
                      </h4>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 5. PROCESS SECTION (Original ucanbedigital DOM) */}
      <div className="home1-process-section mb-110">
        <div className="container">
          <div className="row mb-60">
            <div className="col-lg-12">
              <div className="section-title text-center">
                <span>{isTr ? 'Çalışma Sürecimiz' : 'Our Process'}</span>
                <h2>{isTr ? 'Adım Adım Başarıya Ulaşın' : 'Step by Step to Success'}</h2>
              </div>
            </div>
          </div>
          <div className="row g-4 justify-content-center">
            <div className="col-lg-3 col-sm-6">
              <div className="process-card">
                <div className="number">01</div>
                <h4>{isTr ? 'Keşif & Strateji' : 'Discovery & Strategy'}</h4>
                <p>{isTr ? 'Markanızın hedeflerini ve pazar dinamiklerini analiz ediyoruz.' : 'We analyze your brand goals and market dynamics.'}</p>
              </div>
            </div>
            <div className="col-lg-3 col-sm-6">
              <div className="process-card">
                <div className="number">02</div>
                <h4>{isTr ? 'Yaratıcı Tasarım' : 'Creative Design'}</h4>
                <p>{isTr ? 'Modern ve etkileyici arayüzler ve marka kimliği tasarlıyoruz.' : 'We design modern, engaging interfaces and brand identity.'}</p>
              </div>
            </div>
            <div className="col-lg-3 col-sm-6">
              <div className="process-card">
                <div className="number">03</div>
                <h4>{isTr ? 'Geliştirme' : 'Development'}</h4>
                <p>{isTr ? 'En güncel teknolojilerle yüksek performanslı kodlama yapıyoruz.' : 'We code high-performance solutions with latest tech.'}</p>
              </div>
            </div>
            <div className="col-lg-3 col-sm-6">
              <div className="process-card">
                <div className="number">04</div>
                <h4>{isTr ? 'Yayın & Büyüme' : 'Launch & Growth'}</h4>
                <p>{isTr ? 'Testleri tamamlayıp yayına alıyor, sürekli destek sağlıyoruz.' : 'We test, launch, and provide continuous growth support.'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 6. BLOG SECTION (Original ucanbedigital DOM) */}
      <div className="home1-blog-section mb-110">
        <div className="container">
          <div className="row mb-60">
            <div className="col-lg-12">
              <div className="section-title text-center">
                <span>{isTr ? 'Blog & Makaleler' : 'From Our Blog'}</span>
                <h2>{isTr ? 'En Son Dijital Trendler' : 'Latest Digital Insights'}</h2>
              </div>
            </div>
          </div>
          <div className="row g-4">
            {blogs.slice(0, 3).map((blog) => (
              <div key={blog.id} className="col-lg-4 col-md-6">
                <div className="blog-card">
                  <div className="blog-img">
                    <img src={blog.image} alt={blog.title[locale]} className="img-fluid" />
                  </div>
                  <div className="blog-content">
                    <div className="meta">
                      <span>{blog.date}</span> • <span>{blog.author}</span>
                    </div>
                    <h4>
                      <Link href={`/${locale}/blog/${blog.slug[locale]}`}>
                        {blog.title[locale]}
                      </Link>
                    </h4>
                    <p>{blog.excerpt[locale]}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 7. CONTACT CTA SECTION (Original ucanbedigital DOM) */}
      <div className="contact-section">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-8">
              <div className="section-title white">
                <span>{isTr ? 'Bizimle İletişime Geçin' : 'Get In Touch'}</span>
                <h2>{isTr ? 'Harika Bir Projeniz mi Var? Birlikte Başaralım.' : 'Have a Great Project? Let’s Build Together.'}</h2>
              </div>
            </div>
            <div className="col-lg-4 text-lg-end mt-4 mt-lg-0">
              <Link className="primary-btn1" href={isTr ? '/tr/iletisim' : '/en/contact'}>
                <span>{isTr ? 'İletişime Geç' : 'Contact Us'}</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer settings={settings} services={services} locale={locale} />
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const locale = (params?.locale as 'tr' | 'en') || 'tr';
  const db = getDb();
  return { props: { db, locale } };
};
