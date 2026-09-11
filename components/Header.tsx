import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { SiteSettings } from '../lib/db';

interface HeaderProps {
  settings: SiteSettings;
  locale: 'tr' | 'en';
}

export default function Header({ settings, locale }: HeaderProps) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  const isTr = locale === 'tr';

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = (window.scrollY / totalHeight) * 100;
        setScrollProgress(progress);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const switchLocale = (targetLocale: 'tr' | 'en') => {
    if (targetLocale === locale) return;
    const current = router.asPath;
    let newPath = `/${targetLocale}`;
    if (current.includes('/hakkimizda') || current.includes('/about-us')) {
      newPath = targetLocale === 'tr' ? '/tr/hakkimizda' : '/en/about-us';
    } else if (current.includes('/hizmetlerimiz') || current.includes('/services')) {
      newPath = targetLocale === 'tr' ? '/tr/hizmetlerimiz' : '/en/services';
    } else if (current.includes('/isler') || current.includes('/works')) {
      newPath = targetLocale === 'tr' ? '/tr/isler' : '/en/works';
    } else if (current.includes('/blog')) {
      newPath = targetLocale === 'tr' ? '/tr/blog' : '/en/blog';
    } else if (current.includes('/iletisim') || current.includes('/contact')) {
      newPath = targetLocale === 'tr' ? '/tr/iletisim' : '/en/contact';
    }
    router.push(newPath);
  };

  return (
    <>
      {/* Circle Progress Scroll Indicator */}
      <div className="circle-container active">
        <svg className="circle-progress svg-content" width="100%" height="100%" viewBox="-1 -1 102 102">
          <path
            d="M50,1 a49,49 0 0,1 0,98 a49,49 0 0,1 0,-98"
            style={{
              strokeDasharray: '307.919, 307.919',
              strokeDashoffset: `${307.919 - (307.919 * scrollProgress) / 100}`
            }}
          />
        </svg>
      </div>

      {/* Sidebar Overlay Menu */}
      <div className={`sidebar-menu ${sidebarOpen ? 'active' : ''}`} style={{ transition: 'all 0.4s ease' }}>
        <div className="sidebar-menu-top-area">
          <div className="container d-flex align-items-center justify-content-between">
            <div className="sidebar-menu-logo">
              <Link className="logo-dark" href={`/${locale}`}>
                <img alt="logo" className="img-fluid" width="100" src="/assets/img/logo.png" />
              </Link>
              <Link className="logo-light" href={`/${locale}`}>
                <img alt="logo" className="img-fluid" width="100" src="/assets/img/logo.png" />
              </Link>
            </div>
            <div className="sidebar-menu-close" style={{ cursor: 'pointer' }} onClick={() => setSidebarOpen(false)}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 18 18">
                <path fillRule="evenodd" clipRule="evenodd" d="M18 0L11.1686 8.99601L18 18L9.0041 11.1605L0 18L6.83156 8.99601L0 0L9.0041 6.83156L18 0Z"></path>
              </svg>
            </div>
          </div>
        </div>

        <div className="container">
          <div className="row g-lg-4 gy-5">
            <div className="col-lg-8">
              <div className="sidebar-menu-wrap">
                <ul className="main-menu">
                  <li>
                    <Link className="drop-down" href={`/${locale}`} onClick={() => setSidebarOpen(false)}>
                      {isTr ? 'Anasayfa' : 'Home'}
                    </Link>
                  </li>
                  <li>
                    <Link className="drop-down" href={isTr ? '/tr/hakkimizda' : '/en/about-us'} onClick={() => setSidebarOpen(false)}>
                      {isTr ? 'Hakkımızda' : 'About Us'}
                    </Link>
                  </li>
                  <li>
                    <Link className="drop-down" href={isTr ? '/tr/hizmetlerimiz' : '/en/services'} onClick={() => setSidebarOpen(false)}>
                      {isTr ? 'Hizmetlerimiz' : 'Services'}
                    </Link>
                  </li>
                  <li>
                    <Link className="drop-down" href={isTr ? '/tr/isler' : '/en/works'} onClick={() => setSidebarOpen(false)}>
                      {isTr ? 'İşler' : 'Works'}
                    </Link>
                  </li>
                  <li>
                    <Link className="drop-down" href={isTr ? '/tr/blog' : '/en/blog'} onClick={() => setSidebarOpen(false)}>
                      {isTr ? 'Blog' : 'Blog'}
                    </Link>
                  </li>
                  <li>
                    <Link className="drop-down" href={isTr ? '/tr/iletisim' : '/en/contact'} onClick={() => setSidebarOpen(false)}>
                      {isTr ? 'İletişim' : 'Contact'}
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            <div className="col-lg-4 d-lg-flex align-items-center d-none">
              <div className="sidebar-contact">
                <div className="getin-touch-area mb-60">
                  <h4>
                    {isTr ? 'İletişim' : 'Contact'}
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12">
                      <path d="M10.0035 3.40804L1.41153 12L0 10.5885L8.59097 1.99651H1.01922V0H12V10.9808H10.0035V3.40804Z"></path>
                    </svg>
                  </h4>
                  <ul>
                    <li className="single-contact">
                      <div className="icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18">
                          <path d="M14.2333 11.1504C13.8642 10.7667 13.4191 10.5615 12.9473 10.5615C12.4794 10.5615 12.0304 10.7629 11.6462 11.1466L10.4439 12.3433C10.345 12.2901 10.2461 12.2407 10.151 12.1913C10.014 12.1229 9.88467 12.0583 9.77433 11.9899C8.64819 11.2757 7.62476 10.345 6.64319 9.14067C6.16762 8.54043 5.84804 8.03516 5.61596 7.52229C5.92793 7.23736 6.21708 6.94104 6.49861 6.65611C6.60514 6.54974 6.71167 6.43957 6.8182 6.33319C7.61715 5.5354 7.61715 4.50207 6.8182 3.70427L5.77955 2.66714C5.66161 2.54937 5.53987 2.4278 5.42573 2.30623C5.19746 2.07069 4.95777 1.82755 4.71047 1.59961C4.34143 1.2349 3.9001 1.04115 3.43595 1.04115C2.97179 1.04115 2.52286 1.2349 2.1424 1.59961L2.13479 1.60721L0.841243 2.91027C0.35426 3.39655 0.076528 3.9892 0.0156552 4.67682C-0.0756541 5.78614 0.251537 6.81947 0.502638 7.4957C1.11898 9.15587 2.03968 10.6945 3.41312 12.3433C5.07952 14.3301 7.08452 15.8991 9.37486 17.0047C10.2499 17.4187 11.4179 17.9088 12.7229 17.9924C12.8028 17.9962 12.8865 18 12.9626 18C13.8414 18 14.5795 17.6847 15.1578 17.0578C15.1616 17.0502 15.1692 17.0464 15.173 17.0388C15.3708 16.7995 15.5991 16.583 15.8388 16.3512C16.0024 16.1955 16.1698 16.0321 16.3334 15.8611C16.71 15.4698 16.9079 15.014 16.9079 14.5467C16.9079 14.0756 16.7062 13.6235 16.322 13.2436L14.2333 11.1504Z"></path>
                        </svg>
                      </div>
                      <div className="contact">
                        <span>{isTr ? 'Telefon' : 'Phone'}</span>
                        <h6><a href={`tel:${settings.phone.replace(/\s+/g, '')}`}>{settings.phone}</a></h6>
                      </div>
                    </li>
                    <li className="single-contact">
                      <div className="icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18">
                          <path d="M0 4.5C0 3.90326 0.237053 3.33097 0.65901 2.90901C1.08097 2.48705 1.65326 2.25 2.25 2.25H15.75C16.3467 2.25 16.919 2.48705 17.341 2.90901C17.7629 3.33097 18 3.90326 18 4.5V13.5C18 14.0967 17.7629 14.669 17.341 15.091C16.919 15.5129 16.3467 15.75 15.75 15.75H2.25C1.65326 15.75 1.08097 15.5129 0.65901 15.091C0.237053 14.669 0 14.0967 0 13.5V4.5ZM2.25 3.375C1.95163 3.375 1.66548 3.49353 1.4545 3.7045C1.24353 3.91548 1.125 4.20163 1.125 4.5V4.74413L9 9.46912L16.875 4.74413V4.5C16.875 4.20163 16.7565 3.91548 16.5455 3.7045C16.3345 3.49353 16.0484 3.375 15.75 3.375H2.25ZM16.875 6.05587L11.5785 9.234L16.875 12.4931V6.05587ZM16.8367 13.7914L10.4918 9.8865L9 10.7809L7.50825 9.8865L1.16325 13.7903C1.22718 14.0296 1.36836 14.2412 1.56486 14.3922C1.76137 14.5431 2.00221 14.625 2.25 14.625H15.75C15.9976 14.625 16.2384 14.5434 16.4349 14.3926C16.6313 14.2419 16.7726 14.0306 16.8367 13.7914ZM1.125 12.4931L6.4215 9.234L1.125 6.05587V12.4931Z"></path>
                        </svg>
                      </div>
                      <div className="contact">
                        <span>{isTr ? 'E-Posta' : 'Email'}</span>
                        <h6><a href={`mailto:${settings.email}`}>{settings.email}</a></h6>
                      </div>
                    </li>
                    <li className="single-contact">
                      <div className="icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="18" viewBox="0 0 14 18">
                          <path d="M11.8603 10.0575C11.249 11.2522 10.4207 12.4425 9.57367 13.5113C8.77018 14.5188 7.91105 15.484 7 16.4025C6.08893 15.484 5.2298 14.5188 4.42633 13.5113C3.57933 12.4425 2.751 11.2522 2.13967 10.0575C1.52133 8.85037 1.16667 7.71975 1.16667 6.75C1.16667 5.25816 1.78125 3.82742 2.87521 2.77252C3.96917 1.71763 5.4529 1.125 7 1.125C8.5471 1.125 10.0308 1.71763 11.1248 2.77252C12.2188 3.82742 12.8333 5.25816 12.8333 6.75C12.8333 7.71975 12.4775 8.85037 11.8603 10.0575ZM7 18C7 18 14 11.6033 14 6.75C14 4.95979 13.2625 3.2429 11.9497 1.97703C10.637 0.711159 8.85652 0 7 0C5.14348 0 3.36301 0.711159 2.05025 1.97703C0.737498 3.2429 2.76642e-08 4.95979 0 6.75C0 11.6033 7 18 7 18Z"></path>
                        </svg>
                      </div>
                      <div className="contact">
                        <h6>{settings.address[locale]}</h6>
                      </div>
                    </li>
                  </ul>
                </div>

                <div className="social-link-area">
                  <h6>
                    {isTr ? 'Sosyal Medya Hesaplarımız' : 'Follow Us'}
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12">
                      <path d="M10.0035 3.40804L1.41153 12L0 10.5885L8.59097 1.99651H1.01922V0H12V10.9808H10.0035V3.40804Z"></path>
                    </svg>
                  </h6>
                  <ul className="social-area">
                    <li><a href={settings.socials.facebook} target="_blank" rel="noreferrer"><i className="bi bi-facebook"></i> Facebook</a></li>
                    <li><a href={settings.socials.twitter} target="_blank" rel="noreferrer"><i className="bi bi-twitter-x"></i> Twitter</a></li>
                    <li><a href={settings.socials.linkedin} target="_blank" rel="noreferrer"><i className="bi bi-linkedin"></i> Linkedin</a></li>
                    <li><a href={settings.socials.instagram} target="_blank" rel="noreferrer"><i className="bi bi-instagram"></i> Instagram</a></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header Area */}
      <header className="header-area style-1 ">
        <div className="container d-flex flex-nowrap align-items-center justify-content-between">
          <div className="company-logo">
            <Link className="logo-dark" href={`/${locale}`}>
              <img alt="logo" className="img-fluid" src="/assets/img/logo.png" width="100" />
            </Link>
            <Link className="logo-light" href={`/${locale}`}>
              <img alt="logo" className="img-fluid" src="/assets/img/logo.png" width="100" />
            </Link>
          </div>

          <div className="main-menu d-lg-flex d-none">
            <ul className="menu-list">
              <li>
                <Link className="drop-down" href={`/${locale}`}>
                  {isTr ? 'Anasayfa' : 'Home'}
                </Link>
              </li>
              <li>
                <Link className="drop-down" href={isTr ? '/tr/hakkimizda' : '/en/about-us'}>
                  {isTr ? 'Hakkımızda' : 'About Us'}
                </Link>
              </li>
              <li>
                <Link className="drop-down" href={isTr ? '/tr/hizmetlerimiz' : '/en/services'}>
                  {isTr ? 'Hizmetlerimiz' : 'Services'}
                </Link>
              </li>
              <li>
                <Link className="drop-down" href={isTr ? '/tr/isler' : '/en/works'}>
                  {isTr ? 'İşler' : 'Works'}
                </Link>
              </li>
              <li>
                <Link className="drop-down" href={isTr ? '/tr/blog' : '/en/blog'}>
                  {isTr ? 'Blog' : 'Blog'}
                </Link>
              </li>
              <li>
                <Link className="drop-down" href={isTr ? '/tr/iletisim' : '/en/contact'}>
                  {isTr ? 'İletişim' : 'Contact'}
                </Link>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => switchLocale(isTr ? 'en' : 'tr')}
                  className="btn btn-link text-white text-decoration-none fw-bold p-0 ms-2"
                  style={{ fontSize: '15px' }}
                >
                  {isTr ? 'EN' : 'TR'}
                </button>
              </li>
            </ul>
          </div>

          <div className="nav-right d-flex justify-content-end align-items-center">
            <div className="right-sidebar-and-hotline-area">
              <div className="hotline-area d-xl-flex d-none">
                <div className="icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22">
                    <path d="M21.4233 16.9723L16.9701 14.0025C16.4049 13.6286 15.6474 13.7516 15.2296 14.2851L13.9324 15.953C13.8518 16.0593 13.7355 16.133 13.6049 16.1605C13.4743 16.1879 13.3382 16.1674 13.2215 16.1026L12.9748 15.9666C12.1568 15.5207 11.139 14.9656 9.08843 12.9143C7.03782 10.863 6.48163 9.84441 6.03578 9.02794L5.90048 8.78119C5.8348 8.66457 5.81347 8.52814 5.84042 8.39704C5.86736 8.26593 5.94077 8.14897 6.04712 8.06771L7.71384 6.77093C8.24713 6.35309 8.37031 5.59578 7.9969 5.03048L5.02713 0.577286C4.64443 0.00163523 3.87664 -0.171172 3.28419 0.184969L1.42202 1.30357C0.836918 1.64754 0.407665 2.20464 0.224235 2.85811C-0.446327 5.30138 0.0581298 9.51809 6.26973 15.7304C11.2109 20.6712 14.8894 21.9999 17.4178 21.9999C17.9997 22.0024 18.5792 21.9267 19.141 21.7748C19.7946 21.5916 20.3517 21.1623 20.6955 20.5771L21.8152 18.716C22.1719 18.1234 21.9992 17.3552 21.4233 16.9723Z" fill="currentColor"></path>
                  </svg>
                </div>
                <div className="content">
                  <span>{isTr ? 'Sorularınız İçin' : 'Have Questions?'}</span>
                  <h6><a href={`tel:${settings.phone.replace(/\s+/g, '')}`}>{settings.phone}</a></h6>
                </div>
              </div>

              <div className="sidebar-btn" style={{ cursor: 'pointer' }} onClick={() => setSidebarOpen(true)}>
                <svg className="open" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20">
                  <g>
                    <path d="M6.79688 9.375H2.57812C1.15652 9.375 0 8.21848 0 6.79688V2.57812C0 1.15652 1.15652 0 2.57812 0H6.79688C8.21848 0 9.375 1.15652 9.375 2.57812V6.79688C9.375 8.21848 8.21848 9.375 6.79688 9.375ZM17.4219 9.375H13.2031C11.7815 9.375 10.625 8.21848 10.625 6.79688V2.57812C10.625 1.15652 11.7815 0 13.2031 0H17.4219C18.8435 0 20 1.15652 20 2.57812V6.79688C20 8.21848 18.8435 9.375 17.4219 9.375ZM15.3125 20C12.7278 20 10.625 17.8972 10.625 15.3125C10.625 12.7278 12.7278 10.625 15.3125 10.625C17.8972 10.625 20 12.7278 20 15.3125C20 17.8972 17.8972 20 15.3125 20ZM6.79688 20H2.57812C1.15652 20 0 18.8435 0 17.4219V13.2031C0 11.7815 1.15652 10.625 2.57812 10.625H6.79688C8.21848 10.625 9.375 11.7815 9.375 13.2031V17.4219C9.375 18.8435 8.21848 20 6.79688 20Z" fill="currentColor"></path>
                  </g>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Fixed Right Social */}
      <div className="fixed-right-social position-fixed end-0 top-50 translate-middle-y z-2">
        <ul className="social-area">
          <li><a href={settings.socials.facebook} className="facebook" target="_blank" rel="noreferrer"><i className="bi bi-facebook"></i></a></li>
          <li><a href={settings.socials.twitter} className="twitter" target="_blank" rel="noreferrer"><i className="bi bi-twitter-x"></i></a></li>
          <li><a href={settings.socials.linkedin} className="linkedin" target="_blank" rel="noreferrer"><i className="bi bi-linkedin"></i></a></li>
          <li><a href={settings.socials.instagram} className="instagram" target="_blank" rel="noreferrer"><i className="bi bi-instagram"></i></a></li>
        </ul>
      </div>
    </>
  );
}
