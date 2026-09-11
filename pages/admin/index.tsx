import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { DatabaseSchema, ServiceItem, WorkItem, BlogItem, ContactMessage } from '../../lib/db';

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'dashboard' | 'settings' | 'home' | 'services' | 'works' | 'blogs' | 'messages'>('dashboard');
  const [db, setDb] = useState<DatabaseSchema | null>(null);
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  // Edit states
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);
  const [editingWork, setEditingWork] = useState<WorkItem | null>(null);
  const [editingBlog, setEditingBlog] = useState<BlogItem | null>(null);

  useEffect(() => {
    const auth = sessionStorage.getItem('ucanbe_admin_auth');
    if (auth === 'true') {
      setIsAuthenticated(true);
    }
    fetchDb();
  }, []);

  const fetchDb = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/db');
      const data = await res.json();
      setDb(data);
    } catch (err) {
      console.error('Error fetching db:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin123' || password === 'admin') {
      setIsAuthenticated(true);
      sessionStorage.setItem('ucanbe_admin_auth', 'true');
    } else {
      alert('Hatalı şifre! (Varsayılan şifre: admin123)');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('ucanbe_admin_auth');
    setIsAuthenticated(false);
  };

  const saveChanges = async (updatedDb?: DatabaseSchema) => {
    const payload = updatedDb || db;
    if (!payload) return;

    setSaveStatus('Kaydediliyor...');
    try {
      const res = await fetch('/api/admin/db', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setSaveStatus('✅ Başarıyla Kaydedildi!');
        setDb({ ...payload });
        setTimeout(() => setSaveStatus(null), 3000);
      } else {
        setSaveStatus('❌ Hata oluştu!');
      }
    } catch {
      setSaveStatus('❌ Bağlantı hatası!');
    }
  };

  const deleteService = (id: string) => {
    if (!db || !confirm('Bu hizmeti silmek istediğinize emin misiniz?')) return;
    const newServices = db.services.filter(s => s.id !== id);
    const newDb = { ...db, services: newServices };
    saveChanges(newDb);
  };

  const deleteWork = (id: string) => {
    if (!db || !confirm('Bu projeyi silmek istediğinize emin misiniz?')) return;
    const newWorks = db.works.filter(w => w.id !== id);
    const newDb = { ...db, works: newWorks };
    saveChanges(newDb);
  };

  const deleteBlog = (id: string) => {
    if (!db || !confirm('Bu blog yazısını silmek istediğinize emin misiniz?')) return;
    const newBlogs = db.blogs.filter(b => b.id !== id);
    const newDb = { ...db, blogs: newBlogs };
    saveChanges(newDb);
  };

  const deleteMessage = (id: string) => {
    if (!db || !confirm('Bu mesajı silmek istediğinize emin misiniz?')) return;
    const newMessages = db.messages.filter(m => m.id !== id);
    const newDb = { ...db, messages: newMessages };
    saveChanges(newDb);
  };

  if (!isAuthenticated) {
    return (
      <div style={{ minHeight: '100vh', background: '#0f1013', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Head><title>Admin Girişi - U.CAN.BE Digital</title></Head>
        <div className="card-dark p-5" style={{ maxWidth: '420px', width: '100%' }}>
          <div className="text-center mb-4">
            <img src="/assets/img/logo.png" alt="Logo" width={140} className="mb-3" />
            <h4 className="text-white fw-bold">Yönetim Paneli Girişi</h4>
            <p className="text-secondary small">Lütfen yönetici şifrenizi girin</p>
          </div>
          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <label className="form-label text-secondary small">Şifre (Varsayılan: admin123)</label>
              <input
                type="password"
                className="form-control bg-black border-secondary text-white py-2"
                placeholder="Şifrenizi girin"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="primary-btn1 w-100 border-0 py-2 mt-2">
              <span>Giriş Yap</span>
            </button>
          </form>
          <div className="text-center mt-4">
            <Link href="/tr" className="text-secondary small text-decoration-none">
              ← Siteye Geri Dön
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (loading || !db) {
    return (
      <div style={{ minHeight: '100vh', background: '#0f1013', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="spinner-border text-warning" role="status"></div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0f1013', display: 'flex' }}>
      <Head>
        <title>Yönetim Paneli - {db.settings.siteName}</title>
      </Head>

      {/* Admin Sidebar */}
      <div className="admin-sidebar p-3 d-flex flex-column justify-content-between">
        <div>
          <div className="d-flex align-items-center gap-2 px-3 py-3 mb-4 border-bottom border-secondary border-opacity-25">
            <img src={db.settings.logoLight} alt="Logo" width={100} />
            <span className="badge bg-warning text-dark ms-auto" style={{ fontSize: '10px' }}>PANEL</span>
          </div>

          <nav className="d-flex flex-column gap-1">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`admin-nav-link border-0 bg-transparent text-start w-100 ${activeTab === 'dashboard' ? 'active' : ''}`}
            >
              <i className="bi bi-speedometer2"></i> Dashboard
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`admin-nav-link border-0 bg-transparent text-start w-100 ${activeTab === 'settings' ? 'active' : ''}`}
            >
              <i className="bi bi-gear"></i> Site & İletişim Ayarları
            </button>
            <button
              onClick={() => setActiveTab('home')}
              className={`admin-nav-link border-0 bg-transparent text-start w-100 ${activeTab === 'home' ? 'active' : ''}`}
            >
              <i className="bi bi-house-door"></i> Anasayfa İçerikleri
            </button>
            <button
              onClick={() => setActiveTab('services')}
              className={`admin-nav-link border-0 bg-transparent text-start w-100 ${activeTab === 'services' ? 'active' : ''}`}
            >
              <i className="bi bi-grid"></i> Hizmetler ({db.services.length})
            </button>
            <button
              onClick={() => setActiveTab('works')}
              className={`admin-nav-link border-0 bg-transparent text-start w-100 ${activeTab === 'works' ? 'active' : ''}`}
            >
              <i className="bi bi-briefcase"></i> Projeler / İşler ({db.works.length})
            </button>
            <button
              onClick={() => setActiveTab('blogs')}
              className={`admin-nav-link border-0 bg-transparent text-start w-100 ${activeTab === 'blogs' ? 'active' : ''}`}
            >
              <i className="bi bi-journal-text"></i> Blog Makaleleri ({db.blogs.length})
            </button>
            <button
              onClick={() => setActiveTab('messages')}
              className={`admin-nav-link border-0 bg-transparent text-start w-100 ${activeTab === 'messages' ? 'active' : ''}`}
            >
              <i className="bi bi-envelope"></i> Gelen Mesajlar ({db.messages.length})
            </button>
          </nav>
        </div>

        <div className="border-top border-secondary border-opacity-25 pt-3">
          <Link href="/tr" target="_blank" className="admin-nav-link mb-2 text-warning">
            <i className="bi bi-box-arrow-up-right"></i> Siteyi Canlı Gör
          </Link>
          <button onClick={handleLogout} className="admin-nav-link text-danger border-0 bg-transparent w-100 text-start">
            <i className="bi bi-box-arrow-right"></i> Çıkış Yap
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-grow-1 p-4 p-lg-5 overflow-auto" style={{ maxHeight: '100vh' }}>
        {/* Top Header */}
        <div className="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom border-secondary border-opacity-25">
          <div>
            <h3 className="text-white fw-bold mb-1 text-capitalize">
              {activeTab === 'dashboard' && 'Genel Bakış (Dashboard)'}
              {activeTab === 'settings' && 'Site & İletişim Ayarları'}
              {activeTab === 'home' && 'Anasayfa İçerik Yönetimi'}
              {activeTab === 'services' && 'Hizmetler Yönetimi'}
              {activeTab === 'works' && 'Projeler / İşler Yönetimi'}
              {activeTab === 'blogs' && 'Blog Makaleleri Yönetimi'}
              {activeTab === 'messages' && 'Gelen İletişim Mesajları'}
            </h3>
            <p className="text-secondary small mb-0">ucanbedigital.com içerik ve dil yönetim arayüzü</p>
          </div>

          <div className="d-flex align-items-center gap-3">
            {saveStatus && <span className="badge bg-dark p-2 text-warning border border-warning">{saveStatus}</span>}
            <button onClick={() => saveChanges()} className="primary-btn1 py-2 px-4 border-0">
              <span>💾 Değişiklikleri Kaydet</span>
            </button>
          </div>
        </div>

        {/* TAB 1: DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div>
            <div className="row g-4 mb-5">
              <div className="col-md-3">
                <div className="card-dark p-4">
                  <span className="text-secondary small">Toplam Hizmet</span>
                  <h2 className="text-white fw-bold mt-2">{db.services.length}</h2>
                  <span className="text-warning small">Aktif Yayında</span>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card-dark p-4">
                  <span className="text-secondary small">Tamamlanan İşler</span>
                  <h2 className="text-white fw-bold mt-2">{db.works.length}</h2>
                  <span className="text-warning small">Portfolyo Projeleri</span>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card-dark p-4">
                  <span className="text-secondary small">Blog Makaleleri</span>
                  <h2 className="text-white fw-bold mt-2">{db.blogs.length}</h2>
                  <span className="text-warning small">İçerik Yazıları</span>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card-dark p-4">
                  <span className="text-secondary small">Gelen Mesajlar</span>
                  <h2 className="text-white fw-bold mt-2">{db.messages.length}</h2>
                  <span className="text-warning small">İletişim Talebi</span>
                </div>
              </div>
            </div>

            <div className="card-dark p-4">
              <h5 className="text-white fw-bold mb-3">Hızlı İşlemler</h5>
              <div className="d-flex gap-3 flex-wrap">
                <button onClick={() => setActiveTab('settings')} className="btn btn-outline-light rounded-pill px-3 py-2">
                  <i className="bi bi-gear me-2"></i> İletişim Bilgilerini Düzenle
                </button>
                <button onClick={() => setActiveTab('home')} className="btn btn-outline-light rounded-pill px-3 py-2">
                  <i className="bi bi-pencil me-2"></i> Anasayfa Metinlerini Güncelle
                </button>
                <button onClick={() => setActiveTab('services')} className="btn btn-outline-light rounded-pill px-3 py-2">
                  <i className="bi bi-plus-circle me-2"></i> Yeni Hizmet Ekle
                </button>
                <button onClick={() => setActiveTab('works')} className="btn btn-outline-light rounded-pill px-3 py-2">
                  <i className="bi bi-plus-circle me-2"></i> Yeni Proje Ekle
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: SETTINGS */}
        {activeTab === 'settings' && (
          <div className="card-dark p-4">
            <h5 className="text-white fw-bold mb-4">Genel İletişim ve Firma Bilgileri</h5>
            <div className="row g-4">
              <div className="col-md-6">
                <label className="form-label text-secondary small">Firma / Site Adı</label>
                <input
                  type="text"
                  className="form-control bg-black border-secondary text-white"
                  value={db.settings.siteName}
                  onChange={(e) => setDb({ ...db, settings: { ...db.settings, siteName: e.target.value } })}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label text-secondary small">Telefon Numarası</label>
                <input
                  type="text"
                  className="form-control bg-black border-secondary text-white"
                  value={db.settings.phone}
                  onChange={(e) => setDb({ ...db, settings: { ...db.settings, phone: e.target.value } })}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label text-secondary small">E-Posta Adresi</label>
                <input
                  type="email"
                  className="form-control bg-black border-secondary text-white"
                  value={db.settings.email}
                  onChange={(e) => setDb({ ...db, settings: { ...db.settings, email: e.target.value } })}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label text-secondary small">Slogan (Tagline - TR)</label>
                <input
                  type="text"
                  className="form-control bg-black border-secondary text-white"
                  value={db.settings.tagline.tr}
                  onChange={(e) => setDb({ ...db, settings: { ...db.settings, tagline: { ...db.settings.tagline, tr: e.target.value } } })}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label text-secondary small">Adres (Türkçe)</label>
                <textarea
                  rows={2}
                  className="form-control bg-black border-secondary text-white"
                  value={db.settings.address.tr}
                  onChange={(e) => setDb({ ...db, settings: { ...db.settings, address: { ...db.settings.address, tr: e.target.value } } })}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label text-secondary small">Adres (İngilizce - EN)</label>
                <textarea
                  rows={2}
                  className="form-control bg-black border-secondary text-white"
                  value={db.settings.address.en}
                  onChange={(e) => setDb({ ...db, settings: { ...db.settings, address: { ...db.settings.address, en: e.target.value } } })}
                />
              </div>
              <div className="col-12 mt-4">
                <h6 className="text-warning fw-bold mb-3">Sosyal Medya Linkleri</h6>
                <div className="row g-3">
                  <div className="col-md-3">
                    <label className="form-label text-secondary small">Facebook URL</label>
                    <input
                      type="text"
                      className="form-control bg-black border-secondary text-white"
                      value={db.settings.socials.facebook}
                      onChange={(e) => setDb({ ...db, settings: { ...db.settings, socials: { ...db.settings.socials, facebook: e.target.value } } })}
                    />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label text-secondary small">X (Twitter) URL</label>
                    <input
                      type="text"
                      className="form-control bg-black border-secondary text-white"
                      value={db.settings.socials.twitter}
                      onChange={(e) => setDb({ ...db, settings: { ...db.settings, socials: { ...db.settings.socials, twitter: e.target.value } } })}
                    />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label text-secondary small">LinkedIn URL</label>
                    <input
                      type="text"
                      className="form-control bg-black border-secondary text-white"
                      value={db.settings.socials.linkedin}
                      onChange={(e) => setDb({ ...db, settings: { ...db.settings, socials: { ...db.settings.socials, linkedin: e.target.value } } })}
                    />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label text-secondary small">Instagram URL</label>
                    <input
                      type="text"
                      className="form-control bg-black border-secondary text-white"
                      value={db.settings.socials.instagram}
                      onChange={(e) => setDb({ ...db, settings: { ...db.settings, socials: { ...db.settings.socials, instagram: e.target.value } } })}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: HOME CONTENT */}
        {activeTab === 'home' && (
          <div className="d-flex flex-column gap-4">
            <div className="card-dark p-4">
              <h5 className="text-white fw-bold mb-3">Banner / Hero Bölümü</h5>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label text-secondary small">Banner Başlığı (TR)</label>
                  <input
                    type="text"
                    className="form-control bg-black border-secondary text-white"
                    value={db.home.hero.title.tr}
                    onChange={(e) => setDb({ ...db, home: { ...db.home, hero: { ...db.home.hero, title: { ...db.home.hero.title, tr: e.target.value } } } })}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label text-secondary small">Banner Title (EN)</label>
                  <input
                    type="text"
                    className="form-control bg-black border-secondary text-white"
                    value={db.home.hero.title.en}
                    onChange={(e) => setDb({ ...db, home: { ...db.home, hero: { ...db.home.hero, title: { ...db.home.hero.title, en: e.target.value } } } })}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label text-secondary small">Banner Açıklaması (TR)</label>
                  <textarea
                    rows={4}
                    className="form-control bg-black border-secondary text-white"
                    value={db.home.hero.description.tr}
                    onChange={(e) => setDb({ ...db, home: { ...db.home, hero: { ...db.home.hero, description: { ...db.home.hero.description, tr: e.target.value } } } })}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label text-secondary small">Banner Description (EN)</label>
                  <textarea
                    rows={4}
                    className="form-control bg-black border-secondary text-white"
                    value={db.home.hero.description.en}
                    onChange={(e) => setDb({ ...db, home: { ...db.home, hero: { ...db.home.hero, description: { ...db.home.hero.description, en: e.target.value } } } })}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label text-secondary small">Görsel URL</label>
                  <input
                    type="text"
                    className="form-control bg-black border-secondary text-white"
                    value={db.home.hero.image}
                    onChange={(e) => setDb({ ...db, home: { ...db.home, hero: { ...db.home.hero, image: e.target.value } } })}
                  />
                </div>
              </div>
            </div>

            <div className="card-dark p-4">
              <h5 className="text-white fw-bold mb-3">Hakkımızda & İstatistik Sayaçları</h5>
              <div className="row g-3 mb-4">
                <div className="col-md-6">
                  <label className="form-label text-secondary small">Başlık (TR)</label>
                  <textarea
                    rows={2}
                    className="form-control bg-black border-secondary text-white"
                    value={db.home.about.title.tr}
                    onChange={(e) => setDb({ ...db, home: { ...db.home, about: { ...db.home.about, title: { ...db.home.about.title, tr: e.target.value } } } })}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label text-secondary small">Title (EN)</label>
                  <textarea
                    rows={2}
                    className="form-control bg-black border-secondary text-white"
                    value={db.home.about.title.en}
                    onChange={(e) => setDb({ ...db, home: { ...db.home, about: { ...db.home.about, title: { ...db.home.about.title, en: e.target.value } } } })}
                  />
                </div>
              </div>

              <h6 className="text-warning fw-bold mb-2">Sayaçlar</h6>
              <div className="row g-3">
                {db.home.about.stats.map((st, i) => (
                  <div key={i} className="col-md-4">
                    <div className="p-3 bg-black bg-opacity-40 rounded-3 border border-secondary border-opacity-25">
                      <label className="form-label text-secondary small">Sayı Değeri (Örn: 1,500+)</label>
                      <input
                        type="text"
                        className="form-control bg-black border-secondary text-white mb-2"
                        value={st.number}
                        onChange={(e) => {
                          const newStats = [...db.home.about.stats];
                          newStats[i].number = e.target.value;
                          setDb({ ...db, home: { ...db.home, about: { ...db.home.about, stats: newStats } } });
                        }}
                      />
                      <label className="form-label text-secondary small">Etiket (TR)</label>
                      <input
                        type="text"
                        className="form-control bg-black border-secondary text-white mb-2"
                        value={st.sublabel.tr}
                        onChange={(e) => {
                          const newStats = [...db.home.about.stats];
                          newStats[i].sublabel.tr = e.target.value;
                          setDb({ ...db, home: { ...db.home, about: { ...db.home.about, stats: newStats } } });
                        }}
                      />
                      <label className="form-label text-secondary small">Label (EN)</label>
                      <input
                        type="text"
                        className="form-control bg-black border-secondary text-white"
                        value={st.sublabel.en}
                        onChange={(e) => {
                          const newStats = [...db.home.about.stats];
                          newStats[i].sublabel.en = e.target.value;
                          setDb({ ...db, home: { ...db.home, about: { ...db.home.about, stats: newStats } } });
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: SERVICES MANAGEMENT */}
        {activeTab === 'services' && (
          <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 className="text-white fw-bold mb-0">Hizmet Listesi</h5>
              <button
                onClick={() => {
                  const newId = 'service-' + Date.now();
                  setEditingService({
                    id: newId,
                    slug: { tr: newId, en: newId },
                    title: { tr: 'Yeni Hizmet', en: 'New Service' },
                    shortDesc: { tr: 'Kısa açıklama', en: 'Short description' },
                    content: { tr: '<p>Detaylı açıklama</p>', en: '<p>Detailed content</p>' },
                    icon: 'bi-stars'
                  });
                }}
                className="btn btn-warning rounded-pill px-4 fw-bold"
              >
                + Yeni Hizmet Ekle
              </button>
            </div>

            <div className="table-responsive card-dark p-3">
              <table className="table table-dark table-hover align-middle mb-0">
                <thead>
                  <tr>
                    <th>İkon</th>
                    <th>Başlık (TR)</th>
                    <th>Title (EN)</th>
                    <th>Slug</th>
                    <th className="text-end">İşlemler</th>
                  </tr>
                </thead>
                <tbody>
                  {db.services.map((srv) => (
                    <tr key={srv.id}>
                      <td className="text-warning fs-4"><i className={`bi ${srv.icon}`}></i></td>
                      <td className="fw-bold">{srv.title.tr}</td>
                      <td>{srv.title.en}</td>
                      <td><code>{srv.slug.tr}</code></td>
                      <td className="text-end">
                        <button
                          onClick={() => setEditingService({ ...srv })}
                          className="btn btn-sm btn-outline-light me-2 rounded-pill px-3"
                        >
                          Düzenle
                        </button>
                        <button
                          onClick={() => deleteService(srv.id)}
                          className="btn btn-sm btn-outline-danger rounded-pill px-3"
                        >
                          Sil
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Service Modal */}
            {editingService && (
              <div className="modal show d-block" style={{ background: 'rgba(0,0,0,0.85)' }}>
                <div className="modal-dialog modal-lg modal-dialog-centered">
                  <div className="modal-content bg-dark border-secondary text-white p-4">
                    <div className="modal-header border-secondary">
                      <h5 className="modal-title fw-bold">Hizmet Düzenle / Ekle</h5>
                      <button type="button" className="btn-close btn-close-white" onClick={() => setEditingService(null)}></button>
                    </div>
                    <div className="modal-body">
                      <div className="row g-3">
                        <div className="col-md-6">
                          <label className="form-label text-secondary small">Başlık (TR)</label>
                          <input
                            type="text"
                            className="form-control bg-black border-secondary text-white"
                            value={editingService.title.tr}
                            onChange={(e) => setEditingService({ ...editingService, title: { ...editingService.title, tr: e.target.value } })}
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label text-secondary small">Title (EN)</label>
                          <input
                            type="text"
                            className="form-control bg-black border-secondary text-white"
                            value={editingService.title.en}
                            onChange={(e) => setEditingService({ ...editingService, title: { ...editingService.title, en: e.target.value } })}
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label text-secondary small">Kısa Açıklama (TR)</label>
                          <input
                            type="text"
                            className="form-control bg-black border-secondary text-white"
                            value={editingService.shortDesc.tr}
                            onChange={(e) => setEditingService({ ...editingService, shortDesc: { ...editingService.shortDesc, tr: e.target.value } })}
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label text-secondary small">Short Description (EN)</label>
                          <input
                            type="text"
                            className="form-control bg-black border-secondary text-white"
                            value={editingService.shortDesc.en}
                            onChange={(e) => setEditingService({ ...editingService, shortDesc: { ...editingService.shortDesc, en: e.target.value } })}
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label text-secondary small">Bootstrap Icon Sınıfı (Örn: bi-code-slash)</label>
                          <input
                            type="text"
                            className="form-control bg-black border-secondary text-white"
                            value={editingService.icon}
                            onChange={(e) => setEditingService({ ...editingService, icon: e.target.value })}
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label text-secondary small">URL Slug (TR)</label>
                          <input
                            type="text"
                            className="form-control bg-black border-secondary text-white"
                            value={editingService.slug.tr}
                            onChange={(e) => setEditingService({ ...editingService, slug: { ...editingService.slug, tr: e.target.value } })}
                          />
                        </div>
                        <div className="col-12">
                          <label className="form-label text-secondary small">Detaylı İçerik HTML (TR)</label>
                          <textarea
                            rows={4}
                            className="form-control bg-black border-secondary text-white font-monospace small"
                            value={editingService.content.tr}
                            onChange={(e) => setEditingService({ ...editingService, content: { ...editingService.content, tr: e.target.value } })}
                          />
                        </div>
                        <div className="col-12">
                          <label className="form-label text-secondary small">Detailed Content HTML (EN)</label>
                          <textarea
                            rows={4}
                            className="form-control bg-black border-secondary text-white font-monospace small"
                            value={editingService.content.en}
                            onChange={(e) => setEditingService({ ...editingService, content: { ...editingService.content, en: e.target.value } })}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="modal-footer border-secondary">
                      <button type="button" className="btn btn-secondary rounded-pill" onClick={() => setEditingService(null)}>İptal</button>
                      <button
                        type="button"
                        className="primary-btn1 border-0 py-2 px-4"
                        onClick={() => {
                          const exists = db.services.some(s => s.id === editingService.id);
                          let newServices;
                          if (exists) {
                            newServices = db.services.map(s => s.id === editingService.id ? editingService : s);
                          } else {
                            newServices = [editingService, ...db.services];
                          }
                          const newDb = { ...db, services: newServices };
                          saveChanges(newDb);
                          setEditingService(null);
                        }}
                      >
                        <span>Kaydet</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 5: WORKS MANAGEMENT */}
        {activeTab === 'works' && (
          <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 className="text-white fw-bold mb-0">Projeler / Portfolyo</h5>
              <button
                onClick={() => {
                  const newId = 'work-' + Date.now();
                  setEditingWork({
                    id: newId,
                    slug: { tr: newId, en: newId },
                    title: 'Yeni Proje',
                    category: { tr: 'Web Geliştirme', en: 'Web Development' },
                    image: 'https://cdn.ucanbedigital.com/storage/works/April2020/namet1.jpg',
                    client: 'Müşteri Adı',
                    year: '2024',
                    description: { tr: 'Proje kısa özeti', en: 'Project summary' },
                    content: { tr: '<p>Proje detaylı anlatımı</p>', en: '<p>Project details</p>' }
                  });
                }}
                className="btn btn-warning rounded-pill px-4 fw-bold"
              >
                + Yeni Proje Ekle
              </button>
            </div>

            <div className="row g-4">
              {db.works.map((work) => {
                const workTitle = typeof work.title === 'string' ? work.title : work.title.tr;
                return (
                  <div key={work.id} className="col-md-6 col-lg-4">
                    <div className="card-dark overflow-hidden h-100 d-flex flex-column justify-content-between">
                      <div>
                        <img src={work.image} alt={workTitle} className="w-100 object-fit-cover" style={{ height: '180px' }} />
                        <div className="p-3">
                          <span className="badge bg-secondary bg-opacity-25 text-warning mb-1">{work.category.tr}</span>
                          <h5 className="text-white fw-bold mb-1">{workTitle}</h5>
                          <span className="text-secondary small d-block mb-2">{work.client} • {work.year}</span>
                          <p className="text-secondary small mb-0">{work.description.tr}</p>
                        </div>
                      </div>
                      <div className="p-3 border-top border-secondary border-opacity-25 d-flex justify-content-end gap-2">
                        <button onClick={() => setEditingWork({ ...work })} className="btn btn-sm btn-outline-light rounded-pill px-3">Düzenle</button>
                        <button onClick={() => deleteWork(work.id)} className="btn btn-sm btn-outline-danger rounded-pill px-3">Sil</button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Work Modal */}
            {editingWork && (
              <div className="modal show d-block" style={{ background: 'rgba(0,0,0,0.85)' }}>
                <div className="modal-dialog modal-lg modal-dialog-centered">
                  <div className="modal-content bg-dark border-secondary text-white p-4">
                    <div className="modal-header border-secondary">
                      <h5 className="modal-title fw-bold">Proje Düzenle / Ekle</h5>
                      <button type="button" className="btn-close btn-close-white" onClick={() => setEditingWork(null)}></button>
                    </div>
                    <div className="modal-body">
                      <div className="row g-3">
                        <div className="col-md-6">
                          <label className="form-label text-secondary small">Proje Başlığı</label>
                          <input
                            type="text"
                            className="form-control bg-black border-secondary text-white"
                            value={typeof editingWork.title === 'string' ? editingWork.title : editingWork.title.tr}
                            onChange={(e) => setEditingWork({ ...editingWork, title: e.target.value })}
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label text-secondary small">Görsel URL</label>
                          <input
                            type="text"
                            className="form-control bg-black border-secondary text-white"
                            value={editingWork.image}
                            onChange={(e) => setEditingWork({ ...editingWork, image: e.target.value })}
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label text-secondary small">Kategori (TR)</label>
                          <input
                            type="text"
                            className="form-control bg-black border-secondary text-white"
                            value={editingWork.category.tr}
                            onChange={(e) => setEditingWork({ ...editingWork, category: { ...editingWork.category, tr: e.target.value } })}
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label text-secondary small">Category (EN)</label>
                          <input
                            type="text"
                            className="form-control bg-black border-secondary text-white"
                            value={editingWork.category.en}
                            onChange={(e) => setEditingWork({ ...editingWork, category: { ...editingWork.category, en: e.target.value } })}
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label text-secondary small">Müşteri</label>
                          <input
                            type="text"
                            className="form-control bg-black border-secondary text-white"
                            value={editingWork.client}
                            onChange={(e) => setEditingWork({ ...editingWork, client: e.target.value })}
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label text-secondary small">Yıl</label>
                          <input
                            type="text"
                            className="form-control bg-black border-secondary text-white"
                            value={editingWork.year}
                            onChange={(e) => setEditingWork({ ...editingWork, year: e.target.value })}
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label text-secondary small">Kısa Açıklama (TR)</label>
                          <textarea
                            rows={2}
                            className="form-control bg-black border-secondary text-white"
                            value={editingWork.description.tr}
                            onChange={(e) => setEditingWork({ ...editingWork, description: { ...editingWork.description, tr: e.target.value } })}
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label text-secondary small">Description (EN)</label>
                          <textarea
                            rows={2}
                            className="form-control bg-black border-secondary text-white"
                            value={editingWork.description.en}
                            onChange={(e) => setEditingWork({ ...editingWork, description: { ...editingWork.description, en: e.target.value } })}
                          />
                        </div>
                        <div className="col-12">
                          <label className="form-label text-secondary small">Detaylı İçerik (TR)</label>
                          <textarea
                            rows={3}
                            className="form-control bg-black border-secondary text-white font-monospace small"
                            value={editingWork.content.tr}
                            onChange={(e) => setEditingWork({ ...editingWork, content: { ...editingWork.content, tr: e.target.value } })}
                          />
                        </div>
                        <div className="col-12">
                          <label className="form-label text-secondary small">Detailed Content (EN)</label>
                          <textarea
                            rows={3}
                            className="form-control bg-black border-secondary text-white font-monospace small"
                            value={editingWork.content.en}
                            onChange={(e) => setEditingWork({ ...editingWork, content: { ...editingWork.content, en: e.target.value } })}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="modal-footer border-secondary">
                      <button type="button" className="btn btn-secondary rounded-pill" onClick={() => setEditingWork(null)}>İptal</button>
                      <button
                        type="button"
                        className="primary-btn1 border-0 py-2 px-4"
                        onClick={() => {
                          const exists = db.works.some(w => w.id === editingWork.id);
                          let newWorks;
                          if (exists) {
                            newWorks = db.works.map(w => w.id === editingWork.id ? editingWork : w);
                          } else {
                            newWorks = [editingWork, ...db.works];
                          }
                          const newDb = { ...db, works: newWorks };
                          saveChanges(newDb);
                          setEditingWork(null);
                        }}
                      >
                        <span>Kaydet</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 6: BLOGS MANAGEMENT */}
        {activeTab === 'blogs' && (
          <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 className="text-white fw-bold mb-0">Blog Makaleleri</h5>
              <button
                onClick={() => {
                  const newId = 'blog-' + Date.now();
                  setEditingBlog({
                    id: newId,
                    slug: { tr: newId, en: newId },
                    title: { tr: 'Yeni Makale Başlığı', en: 'New Article Title' },
                    excerpt: { tr: 'Makale özeti...', en: 'Article excerpt...' },
                    content: { tr: '<p>Makale tam metni...</p>', en: '<p>Full article content...</p>' },
                    image: 'https://cdn.ucanbedigital.com/storage/makalelers/May2024/chatgpt-thumb.webp',
                    author: 'U.CAN.BE Ekibi',
                    date: new Date().toISOString().substring(0, 10)
                  });
                }}
                className="btn btn-warning rounded-pill px-4 fw-bold"
              >
                + Yeni Makale Ekle
              </button>
            </div>

            <div className="row g-4">
              {db.blogs.map((blog) => (
                <div key={blog.id} className="col-md-6 col-lg-4">
                  <div className="card-dark overflow-hidden h-100 d-flex flex-column justify-content-between">
                    <div>
                      <img src={blog.image} alt={blog.title.tr} className="w-100 object-fit-cover" style={{ height: '160px' }} />
                      <div className="p-3">
                        <span className="text-secondary small d-block mb-1">{blog.date} • {blog.author}</span>
                        <h6 className="text-white fw-bold mb-2">{blog.title.tr}</h6>
                        <p className="text-secondary small mb-0">{blog.excerpt.tr}</p>
                      </div>
                    </div>
                    <div className="p-3 border-top border-secondary border-opacity-25 d-flex justify-content-end gap-2">
                      <button onClick={() => setEditingBlog({ ...blog })} className="btn btn-sm btn-outline-light rounded-pill px-3">Düzenle</button>
                      <button onClick={() => deleteBlog(blog.id)} className="btn btn-sm btn-outline-danger rounded-pill px-3">Sil</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Blog Modal */}
            {editingBlog && (
              <div className="modal show d-block" style={{ background: 'rgba(0,0,0,0.85)' }}>
                <div className="modal-dialog modal-lg modal-dialog-centered">
                  <div className="modal-content bg-dark border-secondary text-white p-4">
                    <div className="modal-header border-secondary">
                      <h5 className="modal-title fw-bold">Blog Makalesi Düzenle</h5>
                      <button type="button" className="btn-close btn-close-white" onClick={() => setEditingBlog(null)}></button>
                    </div>
                    <div className="modal-body">
                      <div className="row g-3">
                        <div className="col-md-6">
                          <label className="form-label text-secondary small">Başlık (TR)</label>
                          <input
                            type="text"
                            className="form-control bg-black border-secondary text-white"
                            value={editingBlog.title.tr}
                            onChange={(e) => setEditingBlog({ ...editingBlog, title: { ...editingBlog.title, tr: e.target.value } })}
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label text-secondary small">Title (EN)</label>
                          <input
                            type="text"
                            className="form-control bg-black border-secondary text-white"
                            value={editingBlog.title.en}
                            onChange={(e) => setEditingBlog({ ...editingBlog, title: { ...editingBlog.title, en: e.target.value } })}
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label text-secondary small">Görsel URL</label>
                          <input
                            type="text"
                            className="form-control bg-black border-secondary text-white"
                            value={editingBlog.image}
                            onChange={(e) => setEditingBlog({ ...editingBlog, image: e.target.value })}
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label text-secondary small">Yazar</label>
                          <input
                            type="text"
                            className="form-control bg-black border-secondary text-white"
                            value={editingBlog.author}
                            onChange={(e) => setEditingBlog({ ...editingBlog, author: e.target.value })}
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label text-secondary small">Özet (TR)</label>
                          <textarea
                            rows={2}
                            className="form-control bg-black border-secondary text-white"
                            value={editingBlog.excerpt.tr}
                            onChange={(e) => setEditingBlog({ ...editingBlog, excerpt: { ...editingBlog.excerpt, tr: e.target.value } })}
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label text-secondary small">Excerpt (EN)</label>
                          <textarea
                            rows={2}
                            className="form-control bg-black border-secondary text-white"
                            value={editingBlog.excerpt.en}
                            onChange={(e) => setEditingBlog({ ...editingBlog, excerpt: { ...editingBlog.excerpt, en: e.target.value } })}
                          />
                        </div>
                        <div className="col-12">
                          <label className="form-label text-secondary small">Makale Tam Metni HTML (TR)</label>
                          <textarea
                            rows={4}
                            className="form-control bg-black border-secondary text-white font-monospace small"
                            value={editingBlog.content.tr}
                            onChange={(e) => setEditingBlog({ ...editingBlog, content: { ...editingBlog.content, tr: e.target.value } })}
                          />
                        </div>
                        <div className="col-12">
                          <label className="form-label text-secondary small">Full Article Content HTML (EN)</label>
                          <textarea
                            rows={4}
                            className="form-control bg-black border-secondary text-white font-monospace small"
                            value={editingBlog.content.en}
                            onChange={(e) => setEditingBlog({ ...editingBlog, content: { ...editingBlog.content, en: e.target.value } })}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="modal-footer border-secondary">
                      <button type="button" className="btn btn-secondary rounded-pill" onClick={() => setEditingBlog(null)}>İptal</button>
                      <button
                        type="button"
                        className="primary-btn1 border-0 py-2 px-4"
                        onClick={() => {
                          const exists = db.blogs.some(b => b.id === editingBlog.id);
                          let newBlogs;
                          if (exists) {
                            newBlogs = db.blogs.map(b => b.id === editingBlog.id ? editingBlog : b);
                          } else {
                            newBlogs = [editingBlog, ...db.blogs];
                          }
                          const newDb = { ...db, blogs: newBlogs };
                          saveChanges(newDb);
                          setEditingBlog(null);
                        }}
                      >
                        <span>Kaydet</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 7: MESSAGES */}
        {activeTab === 'messages' && (
          <div>
            <h5 className="text-white fw-bold mb-4">Gelen İletişim Formu Mesajları</h5>
            {db.messages.length === 0 ? (
              <div className="card-dark p-5 text-center">
                <i className="bi bi-inbox fs-1 text-secondary mb-3 d-block"></i>
                <p className="text-secondary mb-0">Henüz gelen bir iletişim formu mesajı yok.</p>
              </div>
            ) : (
              <div className="d-flex flex-column gap-3">
                {db.messages.map((msg) => (
                  <div key={msg.id} className="card-dark p-4">
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <div>
                        <h5 className="text-white fw-bold mb-1">{msg.name}</h5>
                        <div className="d-flex gap-3 text-secondary small">
                          <span><i className="bi bi-envelope"></i> {msg.email}</span>
                          {msg.phone && <span><i className="bi bi-telephone"></i> {msg.phone}</span>}
                          <span><i className="bi bi-clock"></i> {msg.date}</span>
                        </div>
                      </div>
                      <button onClick={() => deleteMessage(msg.id)} className="btn btn-sm btn-outline-danger rounded-pill px-3">
                        <i className="bi bi-trash"></i> Sil
                      </button>
                    </div>
                    <div className="bg-black bg-opacity-40 p-3 rounded-3 border border-secondary border-opacity-25">
                      <strong className="text-warning d-block small mb-1">Konu: {msg.subject}</strong>
                      <p className="text-light mb-0" style={{ whiteSpace: 'pre-line' }}>{msg.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
