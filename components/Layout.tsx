import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Header from './Header';
import Footer from './Footer';
import { SiteSettings } from '../lib/db';
import Swiper from 'swiper';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface LayoutProps {
  meta?: {
    title?: string;
    description?: string;
  };
  settings: SiteSettings;
  locale: 'tr' | 'en';
  isInner?: boolean;
  children?: React.ReactNode;
  rawHtml?: string;
}

export default function Layout({
  meta,
  settings,
  locale,
  isInner = false,
  children,
  rawHtml
}: LayoutProps) {
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const videoId = locale === 'en' ? 'OqmkVkmqsN4' : 'wrj4CcKRQFg';

  useEffect(() => {
    // 0. Handle video modal click on homepage hero play button
    const handlePlayClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest('.play-icon.video1, .video-area .play');
      if (target) {
        e.preventDefault();
        setIsVideoOpen(true);
      }
    };
    document.addEventListener('click', handlePlayClick);

    // 1. Rotate badge letters around the play button (DEVELOPMENT.DESIGN.SEO.)
    const chars = document.querySelectorAll<HTMLElement>('.badge__char');
    if (chars.length > 0) {
      const angle = 360 / chars.length;
      chars.forEach((c, i) => {
        c.style.transform = `rotate(${i * angle}deg)`;
        c.style.position = 'absolute';
        c.style.left = '50%';
        c.style.top = '0';
        c.style.transformOrigin = '0 65px';
      });
    }

    // 2. Initialize Swiper for Portfolio Slider
    const portfolioEl = document.querySelector('.portfolio-slider') as HTMLElement;
    let portfolioSwiper: Swiper | null = null;
    if (portfolioEl) {
      portfolioSwiper = new Swiper(portfolioEl, {
        modules: [Autoplay, Pagination],
        slidesPerView: 1,
        spaceBetween: 30,
        loop: true,
        speed: 1000,
        autoplay: {
          delay: 3500,
          disableOnInteraction: false,
        },
        pagination: {
          el: '.portfolio-section .swiper-pagination, .pagination1',
          clickable: true,
        },
        breakpoints: {
          576: { slidesPerView: 1, slidesPerGroup: 1 },
          768: { slidesPerView: 2, slidesPerGroup: 1 },
          1200: { slidesPerView: 3, slidesPerGroup: 1 },
        },
      });
    }

    // 3. Initialize Swiper for Process Slider (Operasyonel Planımız)
    const processEl = document.querySelector('.process-slider') as HTMLElement;
    let processSwiper: Swiper | null = null;
    if (processEl) {
      processSwiper = new Swiper(processEl, {
        modules: [Navigation, Autoplay],
        slidesPerView: 1,
        spaceBetween: 30,
        loop: true,
        speed: 800,
        autoplay: {
          delay: 4000,
          disableOnInteraction: false,
        },
        navigation: {
          prevEl: '.process-slider-prev',
          nextEl: '.process-slider-next',
        },
        breakpoints: {
          576: { slidesPerView: 1 },
          768: { slidesPerView: 2 },
          992: { slidesPerView: 3 },
          1200: { slidesPerView: 4 },
        },
      });
    }

    // 4. Intercept contact forms inside rawHtml to handle submission via API
    const forms = document.querySelectorAll('form');
    const handleSubmit = async (e: Event) => {
      e.preventDefault();
      const form = e.target as HTMLFormElement;
      const formData = new FormData(form);
      const data: Record<string, any> = {};
      formData.forEach((value, key) => {
        data[key] = value;
      });

      try {
        const res = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        if (res.ok) {
          alert(locale === 'tr' ? 'Mesajınız başarıyla gönderildi!' : 'Your message has been sent successfully!');
          form.reset();
        } else {
          alert(locale === 'tr' ? 'Bir hata oluştu, lütfen tekrar deneyin.' : 'An error occurred, please try again.');
        }
      } catch (err) {
        alert(locale === 'tr' ? 'Bir hata oluştu.' : 'An error occurred.');
      }
    };

    forms.forEach((form) => form.addEventListener('submit', handleSubmit));

    return () => {
      document.removeEventListener('click', handlePlayClick);
      if (portfolioSwiper) portfolioSwiper.destroy(true, true);
      if (processSwiper) processSwiper.destroy(true, true);
      forms.forEach((form) => form.removeEventListener('submit', handleSubmit));
    };
  }, [rawHtml, locale]);

  useEffect(() => {
    if (!isVideoOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsVideoOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [isVideoOpen]);

  return (
    <>
      <Head>
        <title>{meta?.title || 'U.CAN.BE Whatever You Want! - U.CAN.BE Dijital Ajans'}</title>
        <meta
          name="description"
          content={
            meta?.description ||
            'Markanıza uygun strateji, etkileyici, şık tasarım ve iletişim yaklaşımı ile yanınızdayız.'
          }
        />
      </Head>

      <Header settings={settings} locale={locale} isInner={isInner} />

      {rawHtml ? (
        <main suppressHydrationWarning dangerouslySetInnerHTML={{ __html: rawHtml }} />
      ) : (
        <main suppressHydrationWarning>{children}</main>
      )}

      <Footer settings={settings} locale={locale} />

      {isVideoOpen && (
        <div
          className="modal-video"
          tabIndex={-1}
          role="dialog"
          aria-label="Video Modal"
          onClick={() => setIsVideoOpen(false)}
        >
          <div className="modal-video-body">
            <div
              className="modal-video-inner"
              style={{ cursor: 'auto' }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-video-movie-wrap">
                <button
                  type="button"
                  className="modal-video-close-btn"
                  aria-label="Close"
                  style={{ cursor: 'pointer' }}
                  onClick={() => setIsVideoOpen(false)}
                />
                <iframe
                  width="460"
                  height="230"
                  src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  tabIndex={-1}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
