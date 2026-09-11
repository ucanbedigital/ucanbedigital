import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { SiteSettings } from '../lib/db';

interface HeaderProps {
  settings: SiteSettings;
  locale: 'tr' | 'en';
}

export default function Header({ settings, locale }: HeaderProps) {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const isTr = locale === 'tr';

  const menu = [
    { name: isTr ? 'Anasayfa' : 'Home', href: isTr ? '/tr' : '/en' },
    { name: isTr ? 'Hakkımızda' : 'About Us', href: isTr ? '/tr/hakkimizda' : '/en/about-us' },
    { name: isTr ? 'Hizmetlerimiz' : 'Services', href: isTr ? '/tr/hizmetlerimiz' : '/en/services' },
    { name: isTr ? 'İşler' : 'Works', href: isTr ? '/tr/isler' : '/en/works' },
    { name: isTr ? 'Blog' : 'Blog', href: isTr ? '/tr/blog' : '/en/blog' },
    { name: isTr ? 'İletişim' : 'Contact', href: isTr ? '/tr/iletisim' : '/en/contact' }
  ];

  const switchLanguage = (newLang: 'tr' | 'en') => {
    if (newLang === locale) return;
    const currentPath = router.asPath;
    let targetPath = `/${newLang}`;
    
    if (currentPath.includes('/hakkimizda') || currentPath.includes('/about-us')) {
      targetPath = newLang === 'tr' ? '/tr/hakkimizda' : '/en/about-us';
    } else if (currentPath.includes('/hizmetlerimiz') || currentPath.includes('/services')) {
      targetPath = newLang === 'tr' ? '/tr/hizmetlerimiz' : '/en/services';
    } else if (currentPath.includes('/isler') || currentPath.includes('/works')) {
      targetPath = newLang === 'tr' ? '/tr/isler' : '/en/works';
    } else if (currentPath.includes('/blog')) {
      targetPath = newLang === 'tr' ? '/tr/blog' : '/en/blog';
    } else if (currentPath.includes('/iletisim') || currentPath.includes('/contact')) {
      targetPath = newLang === 'tr' ? '/tr/iletisim' : '/en/contact';
    }

    router.push(targetPath);
  };

  return (
    <>
      {/* Sidebar Overlay Menu */}
      <div className={`sidebar-menu ${isSidebarOpen ? 'active' : ''}`} style={{ display: isSidebarOpen ? 'block' : 'none' }}>
        <div className="sidebar-menu-top-area">
          <div className="container d-flex align-items-center justify-content-between">
            <div className="sidebar-menu-logo">
              <Link href={isTr ? '/tr' : '/en'}>
                <img src={settings.logoLight} alt={settings.siteName} width={100} className="img-fluid" />
              </Link>
            </div>
            <div className="sidebar-menu-close" style={{ cursor: 'pointer' }} onClick={() => setIsSidebarOpen(false)}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 18 18">
                <path fillRule="evenodd" clipRule="evenodd" d="M18 0L11.1686 8.99601L18 18L9.0041 11.1605L0 18L6.83156 8.99601L0 0L9.0041 6.83156L18 0Z" fill="currentColor"></path>
              </svg>
            </div>
          </div>
        </div>

        <div className="container mt-4">
          <div className="row g-lg-4 gy-5">
            <div className="col-lg-8">
              <div className="sidebar-menu-wrap">
                <ul className="main-menu list-unstyled">
                  {menu.map((item, idx) => (
                    <li key={idx} className="mb-3">
                      <Link href={item.href} className="drop-down fs-3 fw-bold text-decoration-none text-white" onClick={() => setIsSidebarOpen(false)}>
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="col-lg-4 d-lg-flex align-items-center">
              <div className="sidebar-contact text-white">
                <h4 className="mb-4">{isTr ? 'İletişim' : 'Contact'}</h4>
                <ul className="list-unstyled">
                  <li className="mb-3">
                    <span className="text-secondary d-block">{isTr ? 'Telefon' : 'Phone'}</span>
                    <a href={`tel:${settings.phone.replace(/\s+/g, '')}`} className="text-white text-decoration-none fw-semibold">{settings.phone}</a>
                  </li>
                  <li className="mb-3">
                    <span className="text-secondary d-block">{isTr ? 'E-Posta' : 'Email'}</span>
                    <a href={`mailto:${settings.email}`} className="text-white text-decoration-none fw-semibold">{settings.email}</a>
                  </li>
                  <li className="mb-3">
                    <span className="text-secondary d-block">{isTr ? 'Adres' : 'Address'}</span>
                    <span>{settings.address[locale]}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="header-area style-1">
        <div className="container d-flex flex-nowrap align-items-center justify-content-between">
          <div className="company-logo">
            <Link href={isTr ? '/tr' : '/en'}>
              <img src={settings.logoLight} alt={settings.siteName} width={100} className="img-fluid" />
            </Link>
          </div>

          <div className="main-menu d-lg-flex d-none">
            <ul className="menu-list d-flex align-items-center list-unstyled mb-0 gap-4">
              {menu.map((item, idx) => {
                const isActive = router.asPath === item.href || (item.href !== '/tr' && item.href !== '/en' && router.asPath.startsWith(item.href));
                return (
                  <li key={idx}>
                    <Link href={item.href} className={`drop-down text-decoration-none ${isActive ? 'active fw-bold' : ''}`}>
                      {item.name}
                    </Link>
                  </li>
                );
              })}
              <li>
                <button
                  type="button"
                  onClick={() => switchLanguage(isTr ? 'en' : 'tr')}
                  className="btn btn-sm btn-outline-light rounded-pill px-3 py-1 fw-bold"
                  style={{ fontSize: '13px', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.3)' }}
                >
                  {isTr ? 'EN' : 'TR'}
                </button>
              </li>
            </ul>
          </div>

          <div className="nav-right d-flex justify-content-end align-items-center gap-3">
            <div className="hotline-area d-xl-flex d-none align-items-center gap-2">
              <div className="icon">
                <i className="bi bi-telephone-fill fs-5 text-warning"></i>
              </div>
              <div className="content">
                <span className="d-block" style={{ fontSize: '12px', color: '#999' }}>{isTr ? 'Sorularınız İçin' : 'Have Questions?'}</span>
                <a href={`tel:${settings.phone.replace(/\s+/g, '')}`} className="fw-bold text-white text-decoration-none">{settings.phone}</a>
              </div>
            </div>

            <div className="sidebar-btn" style={{ cursor: 'pointer' }} onClick={() => setIsSidebarOpen(true)}>
              <svg className="open" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 20 20" fill="currentColor">
                <g>
                  <path d="M6.79688 9.375H2.57812C1.15652 9.375 0 8.21848 0 6.79688V2.57812C0 1.15652 1.15652 0 2.57812 0H6.79688C8.21848 0 9.375 1.15652 9.375 2.57812V6.79688C9.375 8.21848 8.21848 9.375 6.79688 9.375ZM17.4219 9.375H13.2031C11.7815 9.375 10.625 8.21848 10.625 6.79688V2.57812C10.625 1.15652 11.7815 0 13.2031 0H17.4219C18.8435 0 20 1.15652 20 2.57812V6.79688C20 8.21848 18.8435 9.375 17.4219 9.375ZM15.3125 20C12.7278 20 10.625 17.8972 10.625 15.3125C10.625 12.7278 12.7278 10.625 15.3125 10.625C17.8972 10.625 20 12.7278 20 15.3125C20 17.8972 17.8972 20 15.3125 20ZM6.79688 20H2.57812C1.15652 20 0 18.8435 0 17.4219V13.2031C0 11.7815 1.15652 10.625 2.57812 10.625H6.79688C8.21848 10.625 9.375 11.7815 9.375 13.2031V17.4219C9.375 18.8435 8.21848 20 6.79688 20ZM2.57812 11.875C1.84578 11.875 1.25 12.4708 1.25 13.2031V17.4219C1.25 18.1542 1.84578 18.75 2.57812 18.75H6.79688C7.52922 18.75 8.125 18.1542 8.125 17.4219V13.2031C8.125 12.4708 7.52922 11.875 6.79688 11.875H2.57812Z"></path>
                </g>
              </svg>
            </div>
          </div>
        </div>
      </header>

      {/* Fixed Right Social Icons */}
      <div className="fixed-right-social position-fixed end-0 top-50 translate-middle-y z-2">
        <ul className="social-area list-unstyled d-flex flex-column gap-2 p-2 rounded-start" style={{ background: 'rgba(0,0,0,0.6)' }}>
          <li>
            <a href={settings.socials.facebook} target="_blank" rel="noreferrer" className="text-white">
              <i className="bi bi-facebook fs-5"></i>
            </a>
          </li>
          <li>
            <a href={settings.socials.twitter} target="_blank" rel="noreferrer" className="text-white">
              <i className="bi bi-twitter-x fs-5"></i>
            </a>
          </li>
          <li>
            <a href={settings.socials.linkedin} target="_blank" rel="noreferrer" className="text-white">
              <i className="bi bi-linkedin fs-5"></i>
            </a>
          </li>
          <li>
            <a href={settings.socials.instagram} target="_blank" rel="noreferrer" className="text-white">
              <i className="bi bi-instagram fs-5"></i>
            </a>
          </li>
        </ul>
      </div>
    </>
  );
}
