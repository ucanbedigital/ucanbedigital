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
        <div className="footer-top">
          <div className="row align-items-center justify-content-center">
            {/* Left Column: Solutions List */}
            <div className="col-lg-4 col-md-6">
              <div className="footer-widget">
                <div className="widget-title">
                  <h4>{isTr ? 'Çözümlerimiz' : 'Our Solutions'}</h4>
                </div>
                <div className="menu-container">
                  <ul className="widget-list">
                    <li><Link href={isTr ? '/tr/hizmetlerimiz/frontend-gelistirme' : '/en/services/frontend-development'}>{isTr ? 'Frontend Geliştirme' : 'Frontend Development'}</Link></li>
                    <li><Link href={isTr ? '/tr/hizmetlerimiz/backend-gelistirme' : '/en/services/backend-development'}>{isTr ? 'Backend Geliştirme' : 'Backend Development'}</Link></li>
                    <li><Link href={isTr ? '/tr/hizmetlerimiz/baski-tasarimlari' : '/en/services/print-designs'}>{isTr ? 'Baskı Tasarımları' : 'Print Designs'}</Link></li>
                    <li><Link href={isTr ? '/tr/hizmetlerimiz/3-parti-i-sbirligi-yonetimi' : '/en/services/3rd-party-collaboration-management'}>{isTr ? '3. Parti İşbirliği Yönetimi' : '3rd Party Collaboration'}</Link></li>
                  </ul>
                  <ul className="widget-list">
                    <li><Link href={isTr ? '/tr/hizmetlerimiz/kurumsal-kimlik-tasarimi' : '/en/services/corporate-identity-design'}>{isTr ? 'Kurumsal Kimlik Tasarımı' : 'Corporate Identity'}</Link></li>
                    <li><Link href={isTr ? '/tr/hizmetlerimiz/strateji-ve-konsept-gelistirme' : '/en/services/strategy-and-concept-development'}>{isTr ? 'Strateji ve Konsept Geliştirme' : 'Strategy & Concept'}</Link></li>
                    <li><Link href={isTr ? '/tr/hizmetlerimiz/cm-raporlama-i-zleme' : '/en/services/cm-reporting-monitoring'}>{isTr ? 'CM / Raporlama / İzleme' : 'Reporting & Monitoring'}</Link></li>
                    <li><Link href={isTr ? '/tr/hizmetlerimiz/marka-olusturma' : '/en/services/brand-building'}>{isTr ? 'Marka Oluşturma' : 'Brand Building'}</Link></li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Middle Column: Footer Logo */}
            <div className="col-lg-4 col-md-6 d-flex justify-content-lg-center justify-content-md-end justify-content-sm-start">
              <div className="footer-logo-area">
                <div className="logo-bg">
                  <img src="/assets/img/home1/footer-logo-bg.png" alt="Footer Logo Background" className="light" />
                </div>
                <div className="logo">
                  <img src="/assets/img/logo.png" width={160} alt="Logo" className="light" />
                </div>
              </div>
            </div>

            {/* Right Column: Slogan & Text */}
            <div className="col-lg-4 col-md-8 d-flex justify-content-lg-end justify-content-sm-end">
              <div className="footer-widget">
                <div className="widget-title two">
                  <span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14">
                      <g>
                        <path d="M6.6304 0.338424C6.67018 -0.112811 7.32982 -0.112807 7.3696 0.338428L7.72654 4.38625C7.75291 4.68505 8.10454 4.83069 8.33443 4.63804L11.4491 2.02821C11.7963 1.73728 12.2627 2.20368 11.9718 2.55089L9.36197 5.66556C9.1693 5.89546 9.31496 6.24709 9.61374 6.27346L13.6615 6.6304C14.1128 6.67018 14.1128 7.32982 13.6615 7.3696L9.61374 7.72654C9.31496 7.75291 9.1693 8.10454 9.36197 8.33443L11.9718 11.4491C12.2627 11.7963 11.7963 12.2627 11.4491 11.9718L8.33443 9.36197C8.10454 9.1693 7.75291 9.31496 7.72654 9.61374L7.3696 13.6615C7.32982 14.1128 6.67018 14.1128 6.6304 13.6615L6.27346 9.61374C6.24709 9.31496 5.89546 9.1693 5.66556 9.36197L2.55089 11.9718C2.20368 12.2627 1.73729 11.7963 2.02822 11.4491L4.63804 8.33443C4.83069 8.10454 4.68504 7.75291 4.38625 7.72654L0.338424 7.3696C-0.112811 7.32982 -0.112807 6.67018 0.338428 6.6304L4.38625 6.27346C4.68505 6.24709 4.83069 5.89546 4.63804 5.66556L2.02821 2.55089C1.73728 2.20368 2.20368 1.73729 2.55089 2.02822L5.66556 4.63804C5.89546 4.83069 6.24709 4.68504 6.27346 4.38625L6.6304 0.338424Z"></path>
                      </g>
                    </svg>
                    U.CAN.BE DIGITAL
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14">
                      <g>
                        <path d="M6.6304 0.338424C6.67018 -0.112811 7.32982 -0.112807 7.3696 0.338428L7.72654 4.38625C7.75291 4.68505 8.10454 4.83069 8.33443 4.63804L11.4491 2.02821C11.7963 1.73728 12.2627 2.20368 11.9718 2.55089L9.36197 5.66556C9.1693 5.89546 9.31496 6.24709 9.61374 6.27346L13.6615 6.6304C14.1128 6.67018 14.1128 7.32982 13.6615 7.3696L9.61374 7.72654C9.31496 7.75291 9.1693 8.10454 9.36197 8.33443L11.9718 11.4491C12.2627 11.7963 11.7963 12.2627 11.4491 11.9718L8.33443 9.36197C8.10454 9.1693 7.75291 9.31496 7.72654 9.61374L7.3696 13.6615C7.32982 14.1128 6.67018 14.1128 6.6304 13.6615L6.27346 9.61374C6.24709 9.31496 5.89546 9.1693 5.66556 9.36197L2.55089 11.9718C2.20368 12.2627 1.73729 11.7963 2.02822 11.4491L4.63804 8.33443C4.83069 8.10454 4.68504 7.75291 4.38625 7.72654L0.338424 7.3696C-0.112811 7.32982 -0.112807 6.67018 0.338428 6.6304L4.38625 6.27346C4.68505 6.24709 4.83069 5.89546 4.63804 5.66556L2.02821 2.55089C1.73728 2.20368 2.20368 1.73729 2.55089 2.02822L5.66556 4.63804C5.89546 4.83069 6.24709 4.68504 6.27346 4.38625L6.6304 0.338424Z"></path>
                      </g>
                    </svg>
                  </span>
                  <h3>{settings.tagline[locale]}</h3>
                </div>
                <div className="content">
                  <p>{settings.footerText[locale]}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Info Row */}
        <div className="contact-area">
          <div className="hotline-area">
            <div className="icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="33" height="33" viewBox="0 0 33 33">
                <g>
                  <path d="M21.4233 16.9723L16.9701 14.0025C16.4049 13.6286 15.6474 13.7516 15.2296 14.2851L13.9324 15.953C13.8518 16.0593 13.7355 16.133 13.6049 16.1605C13.4743 16.1879 13.3382 16.1674 13.2215 16.1026L12.9748 15.9666C12.1568 15.5207 11.139 14.9656 9.08843 12.9143C7.03782 10.863 6.48163 9.84441 6.03578 9.02794L5.90048 8.78119C5.8348 8.66457 5.81347 8.52814 5.84042 8.39704C5.86736 8.26593 5.94077 8.14897 6.04712 8.06771L7.71384 6.77093C8.24713 6.35309 8.37031 5.59578 7.9969 5.03048L5.02713 0.577286C4.64443 0.00163523 3.87664 -0.171172 3.28419 0.184969L1.42202 1.30357C0.836918 1.64754 0.407665 2.20464 0.224235 2.85811C-0.446327 5.30138 0.0581298 9.51809 6.26973 15.7304C11.2109 20.6712 14.8894 21.9999 17.4178 21.9999C17.9997 22.0024 18.5792 21.9267 19.141 21.7748C19.7946 21.5916 20.3517 21.1623 20.6955 20.5771L21.8152 18.716C22.1719 18.1234 21.9992 17.3552 21.4233 16.9723Z" fill="currentColor"></path>
                </g>
              </svg>
            </div>
            <div className="content">
              <span>{isTr ? 'Bize Ulaşın' : 'Call Us'}</span>
              <h6><a href={`tel:${settings.phone.replace(/\s+/g, '')}`}>{settings.phone}</a></h6>
            </div>
          </div>

          <div className="hotline-area">
            <div className="icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="33" height="33" viewBox="0 0 33 33">
                <g>
                  <path d="M16.4999 0C9.77802 0 4.30957 5.46845 4.30957 12.1904C4.30957 14.4033 5.30201 16.7832 5.3436 16.8836C5.66413 17.6445 6.2966 18.8262 6.75266 19.5189L15.1109 32.1832C15.453 32.7024 15.9592 33 16.4999 33C17.0406 33 17.5469 32.7024 17.8889 32.184L26.2479 19.5189C26.7047 18.8262 27.3364 17.6445 27.657 16.8836C27.6986 16.784 28.6903 14.404 28.6903 12.1904C28.6903 5.46845 23.2218 0 16.4999 0Z" fill="currentColor"></path>
                </g>
              </svg>
            </div>
            <div className="content">
              <span>{isTr ? 'Adres' : 'Address'}</span>
              <h6><Link href={isTr ? '/tr/iletisim' : '/en/contact'}>{settings.address[locale]}</Link></h6>
            </div>
          </div>

          <div className="hotline-area">
            <div className="icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="33" height="33" viewBox="0 0 33 33">
                <g>
                  <path fillRule="evenodd" clipRule="evenodd" d="M0 8.25C0 7.14543 0.895431 6.25 2 6.25H30C31.1046 6.25 32 7.14543 32 8.25V24.75C32 25.8546 31.1046 26.75 30 26.75H2C0.895431 26.75 0 25.8546 0 24.75V8.25ZM3.284 8.75L16 16.927L28.716 8.75H3.284ZM29.5 10.457L16.628 18.736C16.248 18.98 15.752 18.98 15.372 18.736L2.5 10.457V24.25H29.5V10.457Z" fill="currentColor"></path>
                </g>
              </svg>
            </div>
            <div className="content">
              <span>Say Hello</span>
              <h6><a href={`mailto:${settings.email}`}>{settings.email}</a></h6>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom text-center flex-column">
          <div className="copyright-area">
            <p>Copyright 2024 <strong>U.CAN.BE</strong> All Rights Reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
