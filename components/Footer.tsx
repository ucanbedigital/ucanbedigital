import React from 'react';
import Link from 'next/link';
import { SiteSettings, ServiceItem } from '../lib/db';

interface FooterProps {
  settings: SiteSettings;
  services: ServiceItem[];
  locale: 'tr' | 'en';
}

export default function Footer({ settings, services, locale }: FooterProps) {
  const isTr = locale === 'tr';

  return (
    <footer className="footer-section">
      <div className="container">
        <div className="footer-top py-5">
          <div className="row align-items-center justify-content-between gy-4">
            {/* Left: Solutions */}
            <div className="col-lg-4 col-md-6">
              <div className="footer-widget">
                <div className="widget-title mb-3">
                  <h4 className="text-white fw-bold">{isTr ? 'Çözümlerimiz' : 'Our Solutions'}</h4>
                </div>
                <div className="menu-container">
                  <ul className="widget-list list-unstyled d-flex flex-wrap gap-2">
                    {services.slice(0, 8).map((srv) => (
                      <li key={srv.id} className="w-100 mb-1">
                        <Link
                          href={`/${locale}/${isTr ? 'hizmetlerimiz' : 'services'}/${srv.slug[locale]}`}
                          className="text-secondary text-decoration-none hover-white"
                          style={{ transition: 'color 0.2s' }}
                        >
                          {srv.title[locale]}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Center: Logo and Brand */}
            <div className="col-lg-4 col-md-6 d-flex justify-content-center text-center">
              <div className="footer-logo-area position-relative">
                <div className="logo-bg mb-3">
                  <img src={settings.footerLogoBg} alt="Logo Background" className="img-fluid" style={{ maxHeight: '120px' }} />
                </div>
                <div className="logo">
                  <img src={settings.logoLight} alt={settings.siteName} width={160} className="img-fluid" />
                </div>
              </div>
            </div>

            {/* Right: Tagline */}
            <div className="col-lg-4 col-md-8 d-flex flex-column justify-content-end text-lg-end text-sm-start">
              <div className="footer-widget">
                <div className="widget-title two mb-2">
                  <span className="text-warning text-uppercase fw-semibold" style={{ letterSpacing: '2px', fontSize: '13px' }}>
                    ★ U.CAN.BE DIGITAL ★
                  </span>
                  <h3 className="text-white fw-bold mt-1">{settings.tagline[locale]}</h3>
                </div>
                <div className="content">
                  <p className="text-secondary mb-0">{settings.footerText[locale]}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Info Cards in Footer */}
        <div className="contact-area py-4 border-top border-bottom border-secondary border-opacity-25 my-4">
          <div className="row g-4 text-white">
            <div className="col-md-4">
              <div className="hotline-area d-flex align-items-center gap-3">
                <div className="icon fs-2 text-warning">
                  <i className="bi bi-telephone-outbound"></i>
                </div>
                <div className="content">
                  <span className="d-block text-secondary text-uppercase" style={{ fontSize: '12px' }}>
                    {isTr ? 'Bize Ulaşın' : 'Call Us'}
                  </span>
                  <h6 className="mb-0">
                    <a href={`tel:${settings.phone.replace(/\s+/g, '')}`} className="text-white text-decoration-none fw-bold">
                      {settings.phone}
                    </a>
                  </h6>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="hotline-area d-flex align-items-center gap-3">
                <div className="icon fs-2 text-warning">
                  <i className="bi bi-geo-alt"></i>
                </div>
                <div className="content">
                  <span className="d-block text-secondary text-uppercase" style={{ fontSize: '12px' }}>
                    {isTr ? 'Adres' : 'Address'}
                  </span>
                  <h6 className="mb-0">
                    <Link href={isTr ? '/tr/iletisim' : '/en/contact'} className="text-white text-decoration-none fw-bold">
                      {settings.address[locale]}
                    </Link>
                  </h6>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="hotline-area d-flex align-items-center gap-3">
                <div className="icon fs-2 text-warning">
                  <i className="bi bi-envelope-at"></i>
                </div>
                <div className="content">
                  <span className="d-block text-secondary text-uppercase" style={{ fontSize: '12px' }}>
                    Say Hello
                  </span>
                  <h6 className="mb-0">
                    <a href={`mailto:${settings.email}`} className="text-white text-decoration-none fw-bold">
                      {settings.email}
                    </a>
                  </h6>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom text-center py-3 text-secondary" style={{ fontSize: '14px' }}>
          <p className="mb-0">
            Copyright © {new Date().getFullYear()} <strong className="text-white">U.CAN.BE Digital</strong>. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
