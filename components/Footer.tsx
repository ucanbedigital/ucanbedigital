import React from 'react';
import Link from 'next/link';
import { SiteSettings } from '../lib/db';

interface FooterProps {
  settings: SiteSettings;
  locale: 'tr' | 'en';
}

export default function Footer({ settings, locale }: FooterProps) {
  const isTr = locale === 'tr';
  const phoneHref = (settings?.phone || '+90 (216) 804 55 52').replace(/\s+/g, '');

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
                  <img src="/assets/img/home1/footer-logo-bg.png" alt="" className="light" />
                </div>
                <div className="logo">
                  <img src="/assets/img/logo.png" width={160} alt="" className="light" />
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
                  <h3>{isTr ? 'Dijitalde Fark Yaratın' : 'Make a Difference in Digital'}</h3>
                </div>
                <div className="content">
                  <p>
                    {isTr
                      ? 'Markanızın dijital dünyadaki tüm ihtiyaçlarına profesyonel çözümler sunuyoruz.'
                      : 'We provide professional solutions for all your brand\'s digital needs.'}
                  </p>
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
                  <path d="M26.0803 20.4417C25.7112 20.0581 25.2661 19.8529 24.7943 19.8529C24.3263 19.8529 23.8774 20.0543 23.4932 20.438L22.2909 21.6347C22.192 21.5815 22.0931 21.5321 21.998 21.4827C21.861 21.4143 21.7317 21.3497 21.6213 21.2813C20.4952 20.5671 19.4718 19.6364 18.4902 18.4321C18.0146 17.8318 17.695 17.3266 17.463 16.8137C17.7749 16.5288 18.0641 16.2324 18.3456 15.9475C18.4521 15.8412 18.5587 15.731 18.6652 15.6246C19.4641 14.8268 19.4641 13.7935 18.6652 12.9957L17.6265 11.9585C17.5086 11.8408 17.3869 11.7192 17.2727 11.5976C17.0445 11.3621 16.8048 11.119 16.5575 10.891C16.1884 10.5263 15.7471 10.3326 15.283 10.3326C14.8188 10.3326 14.3699 10.5263 13.9894 10.891L13.9818 10.8986L12.6882 12.2017C12.2013 12.688 11.9235 13.2806 11.8627 13.9682C11.7713 15.0775 12.0985 16.1109 12.3496 16.7871C12.966 18.4473 13.8867 19.9859 15.2601 21.6347C16.9265 23.6215 18.9315 25.1905 21.2219 26.2961C22.0969 26.7101 23.2649 27.2002 24.5699 27.2838C24.6498 27.2876 24.7335 27.2914 24.8096 27.2914C25.6884 27.2914 26.4265 26.9761 27.0048 26.3492C27.0086 26.3416 27.0162 26.3378 27.02 26.3302C27.2178 26.0909 27.4461 25.8744 27.6858 25.6426C27.8494 25.4869 28.0168 25.3235 28.1804 25.1525C28.557 24.7612 28.7549 24.3054 28.7549 23.8381C28.7549 23.367 28.5532 22.9149 28.169 22.535L26.0803 20.4417Z" fill="currentColor"></path>
                </g>
              </svg>
            </div>
            <div className="content">
              <span>{isTr ? 'Bize Ulaşın' : 'Call Us'}</span>
              <h6><a href={`tel:${phoneHref}`}>{settings?.phone || '+90 (216) 804 55 52'}</a></h6>
            </div>
          </div>

          <div className="hotline-area">
            <div className="icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="33" height="33" viewBox="0 0 33 33">
                <g>
                  <path d="M16.4999 0C9.77802 0 4.30957 5.46845 4.30957 12.1904C4.30957 14.4033 5.30201 16.7832 5.3436 16.8836C5.66413 17.6445 6.2966 18.8262 6.75266 19.5189L15.1109 32.1832C15.453 32.7024 15.9592 33 16.4999 33C17.0406 33 17.5469 32.7024 17.8889 32.184L26.2479 19.5189C26.7047 18.8262 27.3364 17.6445 27.657 16.8836C27.6986 16.784 28.6903 14.404 28.6903 12.1904C28.6903 5.46845 23.2218 0 16.4999 0ZM26.3347 16.3272C26.0486 17.0091 25.4598 18.1084 25.0504 18.7294L16.6914 31.3945C16.5265 31.6447 16.4741 31.6447 16.3092 31.3945L7.95018 18.7294C7.54073 18.1084 6.95201 17.0084 6.66589 16.3265C6.6537 16.2971 5.74373 14.1064 5.74373 12.1904C5.74373 6.25939 10.569 1.43416 16.4999 1.43416C22.4309 1.43416 27.2561 6.25939 27.2561 12.1904C27.2561 14.1093 26.344 16.3057 26.3347 16.3272Z" fill="currentColor"></path>
                  <path d="M16.5001 5.7373C12.9412 5.7373 10.0464 8.63287 10.0464 12.191C10.0464 15.7492 12.9412 18.6447 16.5001 18.6447C20.059 18.6447 22.9538 15.7492 22.9538 12.191C22.9538 8.63287 20.059 5.7373 16.5001 5.7373ZM16.5001 17.2106C13.7329 17.2106 11.4805 14.9589 11.4805 12.191C11.4805 9.42309 13.7329 7.17146 16.5001 7.17146C19.2673 7.17146 21.5197 9.42309 21.5197 12.191C21.5197 14.9589 19.2673 17.2106 16.5001 17.2106Z" fill="currentColor"></path>
                </g>
              </svg>
            </div>
            <div className="content">
              <span>{isTr ? 'Adres' : 'Address'}</span>
              <h6><Link href={isTr ? '/tr/iletisim' : '/en/contact'}>{settings?.address?.[locale] || 'Kadıköy/İstanbul'}</Link></h6>
            </div>
          </div>

          <div className="hotline-area">
            <div className="icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="33" height="33" viewBox="0 0 33 33">
                <g>
                  <path fillRule="evenodd" clipRule="evenodd" d="M32.9891 1.18398C33.0171 0.995671 32.9925 0.803292 32.918 0.628097C32.8435 0.452902 32.722 0.301711 32.567 0.191227C32.4121 0.0808885 32.2296 0.0155543 32.0399 0.00245033C31.8501 -0.0106536 31.6604 0.0289832 31.4918 0.116977L0.554265 16.2732C0.376261 16.3673 0.229594 16.5113 0.132265 16.6876C0.0349358 16.8638 -0.00882138 17.0646 0.00636356 17.2654C0.0215485 17.4662 0.0950149 17.6581 0.217747 17.8177C0.340478 17.9773 0.507135 18.0976 0.697265 18.1639L9.29789 21.1036L27.6143 5.44235L13.4408 22.5185L27.8549 27.4451C27.9979 27.4932 28.1497 27.5094 28.2997 27.4926C28.4496 27.4758 28.5941 27.4265 28.723 27.348C28.8519 27.2696 28.962 27.1639 29.0458 27.0384C29.1296 26.9129 29.1849 26.7706 29.2079 26.6215L32.9891 1.18398ZM28.2196 26.469L32 1.03696L15.1365 22.0413L28.3837 6.08103L26.9644 4.68231L9.08156 19.9729L1.02623 17.2195L31.9544 1.00355L16.011 26.6335L13.0314 25.6152V30.5897L17.6235 26.1279L12.0314 24.2166Z" fill="currentColor"></path>
                </g>
              </svg>
            </div>
            <div className="content">
              <span>Say Hello</span>
              <h6><a href={`mailto:${settings?.email || 'info@ucanbedigital.com'}`}>{settings?.email || 'info@ucanbedigital.com'}</a></h6>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom text-center flex-column">
          <div className="copyright-area">
            <p>Copyright 2026 <strong>U.CAN.BE</strong> All Rights Reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
