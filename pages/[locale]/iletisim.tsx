import React, { useState } from 'react';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { getDb, DatabaseSchema } from '../../lib/db';

interface ContactPageProps {
  db: DatabaseSchema;
  locale: 'tr' | 'en';
}

export default function ContactPage({ db, locale }: ContactPageProps) {
  const { settings, services } = db;
  const isTr = locale === 'tr';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  return (
    <>
      <Head>
        <title>{isTr ? 'İletişim' : 'Contact Us'} - {settings.siteName}</title>
      </Head>

      <Header settings={settings} locale={locale} />

      {/* Header Banner */}
      <section className="py-5 text-center bg-black bg-opacity-40 border-bottom border-secondary border-opacity-25">
        <div className="container py-4">
          <span className="text-warning text-uppercase fw-bold" style={{ letterSpacing: '2px' }}>
            {settings.siteName}
          </span>
          <h1 className="display-4 fw-bold text-white mt-2">
            {isTr ? 'İletişim' : 'Contact Us'}
          </h1>
          <p className="text-secondary lead mt-3">
            {isTr
              ? 'Projeleriniz ve dijital dönüşüm hedefleriniz için bizimle iletişime geçin.'
              : 'Get in touch with us for your projects and digital transformation goals.'}
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-5 my-4">
        <div className="container">
          <div className="row g-5">
            {/* Contact Information */}
            <div className="col-lg-5">
              <div className="card-dark p-4 p-lg-5 h-100">
                <h3 className="text-white fw-bold mb-4">{isTr ? 'İletişim Bilgileri' : 'Contact Info'}</h3>
                
                <div className="d-flex flex-column gap-4 mb-5">
                  <div className="d-flex align-items-start gap-3">
                    <div className="icon bg-warning bg-opacity-10 text-warning p-3 rounded-3 fs-4">
                      <i className="bi bi-geo-alt"></i>
                    </div>
                    <div>
                      <span className="text-secondary d-block small">{isTr ? 'Adres' : 'Address'}</span>
                      <strong className="text-white">{settings.address[locale]}</strong>
                    </div>
                  </div>

                  <div className="d-flex align-items-start gap-3">
                    <div className="icon bg-warning bg-opacity-10 text-warning p-3 rounded-3 fs-4">
                      <i className="bi bi-telephone"></i>
                    </div>
                    <div>
                      <span className="text-secondary d-block small">{isTr ? 'Telefon' : 'Phone'}</span>
                      <a href={`tel:${settings.phone.replace(/\s+/g, '')}`} className="text-white text-decoration-none fw-bold">
                        {settings.phone}
                      </a>
                    </div>
                  </div>

                  <div className="d-flex align-items-start gap-3">
                    <div className="icon bg-warning bg-opacity-10 text-warning p-3 rounded-3 fs-4">
                      <i className="bi bi-envelope"></i>
                    </div>
                    <div>
                      <span className="text-secondary d-block small">{isTr ? 'E-Posta' : 'Email'}</span>
                      <a href={`mailto:${settings.email}`} className="text-white text-decoration-none fw-bold">
                        {settings.email}
                      </a>
                    </div>
                  </div>
                </div>

                <div className="border-top border-secondary pt-4">
                  <span className="text-secondary d-block small mb-3">{isTr ? 'Sosyal Medya' : 'Social Media'}</span>
                  <div className="d-flex gap-3">
                    <a href={settings.socials.facebook} target="_blank" rel="noreferrer" className="btn btn-outline-light rounded-circle p-2" style={{ width: '40px', height: '40px' }}>
                      <i className="bi bi-facebook"></i>
                    </a>
                    <a href={settings.socials.twitter} target="_blank" rel="noreferrer" className="btn btn-outline-light rounded-circle p-2" style={{ width: '40px', height: '40px' }}>
                      <i className="bi bi-twitter-x"></i>
                    </a>
                    <a href={settings.socials.linkedin} target="_blank" rel="noreferrer" className="btn btn-outline-light rounded-circle p-2" style={{ width: '40px', height: '40px' }}>
                      <i className="bi bi-linkedin"></i>
                    </a>
                    <a href={settings.socials.instagram} target="_blank" rel="noreferrer" className="btn btn-outline-light rounded-circle p-2" style={{ width: '40px', height: '40px' }}>
                      <i className="bi bi-instagram"></i>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="col-lg-7">
              <div className="card-dark p-4 p-lg-5 h-100">
                <h3 className="text-white fw-bold mb-4">{isTr ? 'Bize Mesaj Gönderin' : 'Send Us a Message'}</h3>

                {status === 'success' && (
                  <div className="alert alert-success d-flex align-items-center gap-2" role="alert">
                    <i className="bi bi-check-circle-fill"></i>
                    <div>
                      {isTr
                        ? 'Mesajınız başarıyla iletildi. En kısa sürede sizinle iletişime geçeceğiz.'
                        : 'Your message has been sent successfully. We will get back to you soon.'}
                    </div>
                  </div>
                )}

                {status === 'error' && (
                  <div className="alert alert-danger" role="alert">
                    {isTr
                      ? 'Mesaj gönderilirken bir hata oluştu. Lütfen tekrar deneyin.'
                      : 'An error occurred while sending the message. Please try again.'}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label text-secondary small">{isTr ? 'Adınız Soyadınız' : 'Full Name'} *</label>
                      <input
                        type="text"
                        required
                        className="form-control bg-black bg-opacity-50 border-secondary text-white py-2"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder={isTr ? 'Örn: Ahmet Yılmaz' : 'e.g. John Doe'}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label text-secondary small">{isTr ? 'E-Posta Adresiniz' : 'Email Address'} *</label>
                      <input
                        type="email"
                        required
                        className="form-control bg-black bg-opacity-50 border-secondary text-white py-2"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="email@example.com"
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label text-secondary small">{isTr ? 'Telefon Numaranız' : 'Phone Number'}</label>
                      <input
                        type="tel"
                        className="form-control bg-black bg-opacity-50 border-secondary text-white py-2"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+90 ..."
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label text-secondary small">{isTr ? 'Konu' : 'Subject'}</label>
                      <input
                        type="text"
                        className="form-control bg-black bg-opacity-50 border-secondary text-white py-2"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        placeholder={isTr ? 'Örn: Web Sitesi Teklifi' : 'e.g. Website Project'}
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label text-secondary small">{isTr ? 'Mesajınız' : 'Your Message'} *</label>
                      <textarea
                        required
                        rows={5}
                        className="form-control bg-black bg-opacity-50 border-secondary text-white py-2"
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder={isTr ? 'Projeniz hakkında kısaca bilgi verin...' : 'Tell us briefly about your project...'}
                      ></textarea>
                    </div>
                    <div className="col-12 mt-4">
                      <button
                        type="submit"
                        disabled={status === 'loading'}
                        className="primary-btn1 border-0 w-100 py-3 text-center fs-5"
                      >
                        <span>{status === 'loading' ? (isTr ? 'Gönderiliyor...' : 'Sending...') : (isTr ? 'Mesajı Gönder' : 'Send Message')}</span>
                      </button>
                    </div>
                  </div>
                </form>
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
  const db = getDb();
  return { props: { db, locale } };
};
