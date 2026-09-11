import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { DatabaseSchema, LocalizedItem, PageContent, ContactMessage } from '../../lib/db';

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState<'site' | 'pages' | 'works' | 'services' | 'blogs' | 'inbox'>('site');
  const [db, setDb] = useState<DatabaseSchema | null>(null);
  const [loading, setLoading] = useState(false);
  const [savedMsg, setSavedMsg] = useState('');

  // Selected item for editing
  const [editingItem, setEditingItem] = useState<{ type: 'works' | 'services' | 'blogs'; index: number } | null>(null);
  const [editingPageKey, setEditingPageKey] = useState<string | null>(null);

  useEffect(() => {
    const auth = sessionStorage.getItem('admin_auth');
    if (auth === 'true') {
      setIsAuthenticated(true);
      fetchDb();
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin123') {
      sessionStorage.setItem('admin_auth', 'true');
      setIsAuthenticated(true);
      setLoginError('');
      fetchDb();
    } else {
      setLoginError('Hatalı şifre! (Varsayılan: admin123)');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('admin_auth');
    setIsAuthenticated(false);
  };

  const fetchDb = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/db');
      const data = await res.json();
      setDb(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const saveDb = async () => {
    if (!db) return;
    setLoading(true);
    try {
      const res = await fetch('/api/admin/db', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(db),
      });
      if (res.ok) {
        setSavedMsg('Değişiklikler başarıyla kaydedildi!');
        setTimeout(() => setSavedMsg(''), 3000);
      } else {
        alert('Kaydetme hatası!');
      }
    } catch (err) {
      alert('Kaydetme sırasında bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div style={{ minHeight: '100vh', background: '#0a0a0c', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
        <Head>
          <title>U.CAN.BE Admin Girişi</title>
        </Head>
        <div style={{ background: '#16171a', border: '1px solid #282a30', borderRadius: '12px', padding: '40px', width: '100%', maxWidth: '400px' }}>
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <img src="/assets/img/logo.png" alt="Logo" width={120} />
            <h4 style={{ marginTop: '16px', color: '#fff' }}>Yönetim Paneli</h4>
            <p style={{ color: '#8c909a', fontSize: '13px' }}>U.CAN.BE Web İçerik Yönetimi</p>
          </div>
          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', color: '#b5b8c0' }}>Yönetici Şifresi</label>
              <input
                type="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Şifrenizi girin..."
                style={{ background: '#0e0f12', border: '1px solid #33363f', color: '#fff', padding: '12px', borderRadius: '8px' }}
                required
              />
            </div>
            {loginError && <div style={{ color: '#ff5c5c', fontSize: '13px', marginBottom: '16px' }}>{loginError}</div>}
            <button
              type="submit"
              style={{ width: '100%', padding: '12px', background: '#ff3b30', border: 'none', borderRadius: '8px', color: '#fff', fontWeight: 'bold' }}
            >
              Giriş Yap
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (!db) {
    return (
      <div style={{ minHeight: '100vh', background: '#0a0a0c', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        Yükleniyor...
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0d0e12', color: '#e1e3e8', display: 'flex', flexDirection: 'column' }}>
      <Head>
        <title>U.CAN.BE Admin Dashboard</title>
      </Head>

      {/* Top Navbar */}
      <header style={{ background: '#15161b', borderBottom: '1px solid #22242a', padding: '14px 30px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <img src="/assets/img/logo.png" alt="Logo" width={100} />
          <span style={{ fontSize: '14px', background: '#ff3b30', color: '#fff', padding: '3px 8px', borderRadius: '4px', fontWeight: 'bold' }}>CMS</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          {savedMsg && <span style={{ color: '#4ade80', fontSize: '13px', fontWeight: 'bold' }}>{savedMsg}</span>}
          <button
            onClick={saveDb}
            disabled={loading}
            style={{ background: '#22c55e', color: '#fff', border: 'none', padding: '8px 18px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}
          >
            {loading ? 'Kaydediliyor...' : 'Tüm Değişiklikleri Kaydet'}
          </button>
          <Link href="/tr" target="_blank" style={{ color: '#9ca3af', textDecoration: 'none', fontSize: '13px', padding: '8px 12px', border: '1px solid #374151', borderRadius: '6px' }}>
            Siteyi Gör ↗
          </Link>
          <button
            onClick={handleLogout}
            style={{ background: 'transparent', color: '#ef4444', border: '1px solid #ef4444', padding: '8px 14px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}
          >
            Çıkış
          </button>
        </div>
      </header>

      {/* Main Container */}
      <div style={{ display: 'flex', flex: 1 }}>
        {/* Sidebar Nav */}
        <aside style={{ width: '240px', background: '#121318', borderRight: '1px solid #22242a', padding: '24px 12px' }}>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {[
              { key: 'site', label: '⚙️ Site & İletişim', count: null },
              { key: 'pages', label: '📄 Ana Sayfalar (12)', count: Object.keys(db.pages).length },
              { key: 'works', label: '💼 İşler / Portfolyo', count: db.works.length },
              { key: 'services', label: '🛠️ Hizmetler', count: db.services.length },
              { key: 'blogs', label: '✍️ Blog Makaleleri', count: db.blogs.length },
              { key: 'inbox', label: '📬 Gelen Mesajlar', count: db.inbox.length },
            ].map((tab) => (
              <li key={tab.key}>
                <button
                  onClick={() => {
                    setActiveTab(tab.key as any);
                    setEditingItem(null);
                    setEditingPageKey(null);
                  }}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    border: 'none',
                    background: activeTab === tab.key ? '#ff3b30' : 'transparent',
                    color: activeTab === tab.key ? '#fff' : '#9ca3af',
                    fontWeight: activeTab === tab.key ? 'bold' : 'normal',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: '14px',
                  }}
                >
                  <span>{tab.label}</span>
                  {tab.count !== null && (
                    <span style={{ fontSize: '11px', background: activeTab === tab.key ? '#b91c1c' : '#1f2937', color: '#fff', padding: '2px 6px', borderRadius: '10px' }}>
                      {tab.count}
                    </span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </aside>

        {/* Content Area */}
        <main style={{ flex: 1, padding: '30px', overflowY: 'auto' }}>
          {/* 1. SITE SETTINGS */}
          {activeTab === 'site' && (
            <div>
              <h3 style={{ marginBottom: '20px', color: '#fff' }}>Site Genel Ayarları & İletişim Bilgileri</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div style={{ background: '#16171e', border: '1px solid #23252e', borderRadius: '8px', padding: '20px' }}>
                  <h5 style={{ color: '#ff3b30', marginBottom: '16px' }}>İletişim Bilgileri</h5>
                  <div style={{ marginBottom: '12px' }}>
                    <label style={{ display: 'block', fontSize: '13px', color: '#9ca3af', marginBottom: '4px' }}>Telefon</label>
                    <input
                      type="text"
                      className="form-control"
                      value={db.site.phone}
                      onChange={(e) => setDb({ ...db, site: { ...db.site, phone: e.target.value } })}
                      style={{ background: '#0e0f14', border: '1px solid #2d303b', color: '#fff', padding: '8px 12px', width: '100%', borderRadius: '6px' }}
                    />
                  </div>
                  <div style={{ marginBottom: '12px' }}>
                    <label style={{ display: 'block', fontSize: '13px', color: '#9ca3af', marginBottom: '4px' }}>E-Posta</label>
                    <input
                      type="email"
                      className="form-control"
                      value={db.site.email}
                      onChange={(e) => setDb({ ...db, site: { ...db.site, email: e.target.value } })}
                      style={{ background: '#0e0f14', border: '1px solid #2d303b', color: '#fff', padding: '8px 12px', width: '100%', borderRadius: '6px' }}
                    />
                  </div>
                  <div style={{ marginBottom: '12px' }}>
                    <label style={{ display: 'block', fontSize: '13px', color: '#9ca3af', marginBottom: '4px' }}>Adres (TR)</label>
                    <input
                      type="text"
                      className="form-control"
                      value={db.site.address.tr}
                      onChange={(e) => setDb({ ...db, site: { ...db.site, address: { ...db.site.address, tr: e.target.value } } })}
                      style={{ background: '#0e0f14', border: '1px solid #2d303b', color: '#fff', padding: '8px 12px', width: '100%', borderRadius: '6px' }}
                    />
                  </div>
                  <div style={{ marginBottom: '12px' }}>
                    <label style={{ display: 'block', fontSize: '13px', color: '#9ca3af', marginBottom: '4px' }}>Adres (EN)</label>
                    <input
                      type="text"
                      className="form-control"
                      value={db.site.address.en}
                      onChange={(e) => setDb({ ...db, site: { ...db.site, address: { ...db.site.address, en: e.target.value } } })}
                      style={{ background: '#0e0f14', border: '1px solid #2d303b', color: '#fff', padding: '8px 12px', width: '100%', borderRadius: '6px' }}
                    />
                  </div>
                </div>

                <div style={{ background: '#16171e', border: '1px solid #23252e', borderRadius: '8px', padding: '20px' }}>
                  <h5 style={{ color: '#ff3b30', marginBottom: '16px' }}>Sosyal Medya Linkleri</h5>
                  {['facebook', 'twitter', 'linkedin', 'instagram'].map((soc) => (
                    <div key={soc} style={{ marginBottom: '12px' }}>
                      <label style={{ display: 'block', fontSize: '13px', color: '#9ca3af', marginBottom: '4px', textTransform: 'capitalize' }}>{soc}</label>
                      <input
                        type="text"
                        className="form-control"
                        value={(db.site as any)[soc] || ''}
                        onChange={(e) => setDb({ ...db, site: { ...db.site, [soc]: e.target.value } })}
                        style={{ background: '#0e0f14', border: '1px solid #2d303b', color: '#fff', padding: '8px 12px', width: '100%', borderRadius: '6px' }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 2. CORE PAGES */}
          {activeTab === 'pages' && (
            <div>
              <h3 style={{ marginBottom: '20px', color: '#fff' }}>Ana Sayfa ve Bölüm Sayfaları Düzenleyicisi</h3>
              {editingPageKey ? (
                <div style={{ background: '#16171e', border: '1px solid #23252e', borderRadius: '8px', padding: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h5 style={{ color: '#ff3b30', margin: 0 }}>Düzenleniyor: {editingPageKey}</h5>
                    <button
                      onClick={() => setEditingPageKey(null)}
                      style={{ background: '#374151', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}
                    >
                      ← Sayfa Listesine Dön
                    </button>
                  </div>
                  <div style={{ marginBottom: '12px' }}>
                    <label style={{ display: 'block', fontSize: '13px', color: '#9ca3af', marginBottom: '4px' }}>Meta Başlık (SEO Title)</label>
                    <input
                      type="text"
                      className="form-control"
                      value={db.pages[editingPageKey]?.meta?.title || ''}
                      onChange={(e) => {
                        const updated = { ...db.pages };
                        updated[editingPageKey].meta.title = e.target.value;
                        setDb({ ...db, pages: updated });
                      }}
                      style={{ background: '#0e0f14', border: '1px solid #2d303b', color: '#fff', padding: '8px 12px', width: '100%', borderRadius: '6px' }}
                    />
                  </div>
                  <div style={{ marginBottom: '12px' }}>
                    <label style={{ display: 'block', fontSize: '13px', color: '#9ca3af', marginBottom: '4px' }}>Meta Açıklama (SEO Description)</label>
                    <input
                      type="text"
                      className="form-control"
                      value={db.pages[editingPageKey]?.meta?.description || ''}
                      onChange={(e) => {
                        const updated = { ...db.pages };
                        updated[editingPageKey].meta.description = e.target.value;
                        setDb({ ...db, pages: updated });
                      }}
                      style={{ background: '#0e0f14', border: '1px solid #2d303b', color: '#fff', padding: '8px 12px', width: '100%', borderRadius: '6px' }}
                    />
                  </div>
                  <div style={{ marginBottom: '12px' }}>
                    <label style={{ display: 'block', fontSize: '13px', color: '#9ca3af', marginBottom: '4px' }}>Sayfa HTML İçeriği (Pixel-Perfect DOM)</label>
                    <textarea
                      rows={16}
                      className="form-control"
                      value={db.pages[editingPageKey]?.html || ''}
                      onChange={(e) => {
                        const updated = { ...db.pages };
                        updated[editingPageKey].html = e.target.value;
                        setDb({ ...db, pages: updated });
                      }}
                      style={{ background: '#0e0f14', border: '1px solid #2d303b', color: '#38bdf8', fontFamily: 'monospace', fontSize: '12px', padding: '12px', width: '100%', borderRadius: '6px' }}
                    />
                  </div>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
                  {Object.keys(db.pages).map((pageKey) => (
                    <div key={pageKey} style={{ background: '#16171e', border: '1px solid #23252e', borderRadius: '8px', padding: '16px' }}>
                      <h5 style={{ color: '#fff', fontSize: '15px', marginBottom: '8px' }}>{pageKey}</h5>
                      <p style={{ color: '#9ca3af', fontSize: '12px', height: '36px', overflow: 'hidden', marginBottom: '12px' }}>
                        {db.pages[pageKey]?.meta?.title || 'Başlık yok'}
                      </p>
                      <button
                        onClick={() => setEditingPageKey(pageKey)}
                        style={{ background: '#ff3b30', color: '#fff', border: 'none', padding: '6px 14px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}
                      >
                        Düzenle
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 3. WORKS / PORTFOLIO */}
          {activeTab === 'works' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ color: '#fff', margin: 0 }}>İşler / Projeler ({db.works.length} Adet)</h3>
              </div>
              {editingItem?.type === 'works' ? (
                <div style={{ background: '#16171e', border: '1px solid #23252e', borderRadius: '8px', padding: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                    <h5 style={{ color: '#ff3b30' }}>Proje Düzenle: {db.works[editingItem.index]?.slug}</h5>
                    <button onClick={() => setEditingItem(null)} style={{ background: '#374151', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}>
                      ← Listeye Dön
                    </button>
                  </div>
                  <div style={{ marginBottom: '12px' }}>
                    <label style={{ display: 'block', fontSize: '13px', color: '#9ca3af', marginBottom: '4px' }}>Slug</label>
                    <input
                      type="text"
                      className="form-control"
                      value={db.works[editingItem.index].slug}
                      onChange={(e) => {
                        const updated = [...db.works];
                        updated[editingItem.index].slug = e.target.value;
                        setDb({ ...db, works: updated });
                      }}
                      style={{ background: '#0e0f14', border: '1px solid #2d303b', color: '#fff', padding: '8px 12px', width: '100%', borderRadius: '6px' }}
                    />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div>
                      <h6 style={{ color: '#38bdf8', marginBottom: '8px' }}>Türkçe Detay Sayfa HTML</h6>
                      <textarea
                        rows={14}
                        className="form-control"
                        value={db.works[editingItem.index]?.tr?.html || ''}
                        onChange={(e) => {
                          const updated = [...db.works];
                          if (!updated[editingItem.index].tr) updated[editingItem.index].tr = { html: '', meta: { title: '', description: '' } };
                          updated[editingItem.index].tr.html = e.target.value;
                          setDb({ ...db, works: updated });
                        }}
                        style={{ background: '#0e0f14', border: '1px solid #2d303b', color: '#fff', fontFamily: 'monospace', fontSize: '12px', padding: '10px', width: '100%', borderRadius: '6px' }}
                      />
                    </div>
                    <div>
                      <h6 style={{ color: '#38bdf8', marginBottom: '8px' }}>İngilizce Detay Sayfa HTML</h6>
                      <textarea
                        rows={14}
                        className="form-control"
                        value={db.works[editingItem.index]?.en?.html || ''}
                        onChange={(e) => {
                          const updated = [...db.works];
                          if (!updated[editingItem.index].en) updated[editingItem.index].en = { html: '', meta: { title: '', description: '' } };
                          updated[editingItem.index].en.html = e.target.value;
                          setDb({ ...db, works: updated });
                        }}
                        style={{ background: '#0e0f14', border: '1px solid #2d303b', color: '#fff', fontFamily: 'monospace', fontSize: '12px', padding: '10px', width: '100%', borderRadius: '6px' }}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
                  {db.works.map((work, idx) => (
                    <div key={work.slug + idx} style={{ background: '#16171e', border: '1px solid #23252e', borderRadius: '8px', padding: '16px' }}>
                      <h5 style={{ color: '#fff', fontSize: '15px', marginBottom: '4px' }}>{work.slug}</h5>
                      <p style={{ color: '#9ca3af', fontSize: '12px', height: '36px', overflow: 'hidden', marginBottom: '12px' }}>
                        {work.tr?.meta?.title || work.en?.meta?.title || 'Başlık yok'}
                      </p>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => setEditingItem({ type: 'works', index: idx })}
                          style={{ background: '#ff3b30', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}
                        >
                          Düzenle
                        </button>
                        <Link
                          href={`/tr/isler/${work.slug}`}
                          target="_blank"
                          style={{ background: '#1f2937', color: '#9ca3af', textDecoration: 'none', padding: '6px 10px', borderRadius: '4px', fontSize: '12px' }}
                        >
                          Gör ↗
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 4. SERVICES */}
          {activeTab === 'services' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ color: '#fff', margin: 0 }}>Hizmetler ({db.services.length} Adet)</h3>
              </div>
              {editingItem?.type === 'services' ? (
                <div style={{ background: '#16171e', border: '1px solid #23252e', borderRadius: '8px', padding: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                    <h5 style={{ color: '#ff3b30' }}>Hizmet Düzenle: {db.services[editingItem.index]?.slug}</h5>
                    <button onClick={() => setEditingItem(null)} style={{ background: '#374151', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}>
                      ← Listeye Dön
                    </button>
                  </div>
                  <div style={{ marginBottom: '12px' }}>
                    <label style={{ display: 'block', fontSize: '13px', color: '#9ca3af', marginBottom: '4px' }}>Slug</label>
                    <input
                      type="text"
                      className="form-control"
                      value={db.services[editingItem.index].slug}
                      onChange={(e) => {
                        const updated = [...db.services];
                        updated[editingItem.index].slug = e.target.value;
                        setDb({ ...db, services: updated });
                      }}
                      style={{ background: '#0e0f14', border: '1px solid #2d303b', color: '#fff', padding: '8px 12px', width: '100%', borderRadius: '6px' }}
                    />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div>
                      <h6 style={{ color: '#38bdf8', marginBottom: '8px' }}>Türkçe Detay Sayfa HTML</h6>
                      <textarea
                        rows={14}
                        className="form-control"
                        value={db.services[editingItem.index]?.tr?.html || ''}
                        onChange={(e) => {
                          const updated = [...db.services];
                          if (!updated[editingItem.index].tr) updated[editingItem.index].tr = { html: '', meta: { title: '', description: '' } };
                          updated[editingItem.index].tr.html = e.target.value;
                          setDb({ ...db, services: updated });
                        }}
                        style={{ background: '#0e0f14', border: '1px solid #2d303b', color: '#fff', fontFamily: 'monospace', fontSize: '12px', padding: '10px', width: '100%', borderRadius: '6px' }}
                      />
                    </div>
                    <div>
                      <h6 style={{ color: '#38bdf8', marginBottom: '8px' }}>İngilizce Detay Sayfa HTML</h6>
                      <textarea
                        rows={14}
                        className="form-control"
                        value={db.services[editingItem.index]?.en?.html || ''}
                        onChange={(e) => {
                          const updated = [...db.services];
                          if (!updated[editingItem.index].en) updated[editingItem.index].en = { html: '', meta: { title: '', description: '' } };
                          updated[editingItem.index].en.html = e.target.value;
                          setDb({ ...db, services: updated });
                        }}
                        style={{ background: '#0e0f14', border: '1px solid #2d303b', color: '#fff', fontFamily: 'monospace', fontSize: '12px', padding: '10px', width: '100%', borderRadius: '6px' }}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
                  {db.services.map((service, idx) => (
                    <div key={service.slug + idx} style={{ background: '#16171e', border: '1px solid #23252e', borderRadius: '8px', padding: '16px' }}>
                      <h5 style={{ color: '#fff', fontSize: '15px', marginBottom: '4px' }}>{service.slug}</h5>
                      <p style={{ color: '#9ca3af', fontSize: '12px', height: '36px', overflow: 'hidden', marginBottom: '12px' }}>
                        {service.tr?.meta?.title || service.en?.meta?.title || 'Başlık yok'}
                      </p>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => setEditingItem({ type: 'services', index: idx })}
                          style={{ background: '#ff3b30', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}
                        >
                          Düzenle
                        </button>
                        <Link
                          href={`/tr/hizmetlerimiz/${service.slug}`}
                          target="_blank"
                          style={{ background: '#1f2937', color: '#9ca3af', textDecoration: 'none', padding: '6px 10px', borderRadius: '4px', fontSize: '12px' }}
                        >
                          Gör ↗
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 5. BLOGS */}
          {activeTab === 'blogs' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ color: '#fff', margin: 0 }}>Blog Makaleleri ({db.blogs.length} Adet)</h3>
              </div>
              {editingItem?.type === 'blogs' ? (
                <div style={{ background: '#16171e', border: '1px solid #23252e', borderRadius: '8px', padding: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                    <h5 style={{ color: '#ff3b30' }}>Makale Düzenle: {db.blogs[editingItem.index]?.slug}</h5>
                    <button onClick={() => setEditingItem(null)} style={{ background: '#374151', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}>
                      ← Listeye Dön
                    </button>
                  </div>
                  <div style={{ marginBottom: '12px' }}>
                    <label style={{ display: 'block', fontSize: '13px', color: '#9ca3af', marginBottom: '4px' }}>Slug</label>
                    <input
                      type="text"
                      className="form-control"
                      value={db.blogs[editingItem.index].slug}
                      onChange={(e) => {
                        const updated = [...db.blogs];
                        updated[editingItem.index].slug = e.target.value;
                        setDb({ ...db, blogs: updated });
                      }}
                      style={{ background: '#0e0f14', border: '1px solid #2d303b', color: '#fff', padding: '8px 12px', width: '100%', borderRadius: '6px' }}
                    />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div>
                      <h6 style={{ color: '#38bdf8', marginBottom: '8px' }}>Türkçe Detay Sayfa HTML</h6>
                      <textarea
                        rows={14}
                        className="form-control"
                        value={db.blogs[editingItem.index]?.tr?.html || ''}
                        onChange={(e) => {
                          const updated = [...db.blogs];
                          if (!updated[editingItem.index].tr) updated[editingItem.index].tr = { html: '', meta: { title: '', description: '' } };
                          updated[editingItem.index].tr.html = e.target.value;
                          setDb({ ...db, blogs: updated });
                        }}
                        style={{ background: '#0e0f14', border: '1px solid #2d303b', color: '#fff', fontFamily: 'monospace', fontSize: '12px', padding: '10px', width: '100%', borderRadius: '6px' }}
                      />
                    </div>
                    <div>
                      <h6 style={{ color: '#38bdf8', marginBottom: '8px' }}>İngilizce Detay Sayfa HTML</h6>
                      <textarea
                        rows={14}
                        className="form-control"
                        value={db.blogs[editingItem.index]?.en?.html || ''}
                        onChange={(e) => {
                          const updated = [...db.blogs];
                          if (!updated[editingItem.index].en) updated[editingItem.index].en = { html: '', meta: { title: '', description: '' } };
                          updated[editingItem.index].en.html = e.target.value;
                          setDb({ ...db, blogs: updated });
                        }}
                        style={{ background: '#0e0f14', border: '1px solid #2d303b', color: '#fff', fontFamily: 'monospace', fontSize: '12px', padding: '10px', width: '100%', borderRadius: '6px' }}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
                  {db.blogs.map((blog, idx) => (
                    <div key={blog.slug + idx} style={{ background: '#16171e', border: '1px solid #23252e', borderRadius: '8px', padding: '16px' }}>
                      <h5 style={{ color: '#fff', fontSize: '15px', marginBottom: '4px' }}>{blog.slug}</h5>
                      <p style={{ color: '#9ca3af', fontSize: '12px', height: '36px', overflow: 'hidden', marginBottom: '12px' }}>
                        {blog.tr?.meta?.title || blog.en?.meta?.title || 'Başlık yok'}
                      </p>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => setEditingItem({ type: 'blogs', index: idx })}
                          style={{ background: '#ff3b30', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}
                        >
                          Düzenle
                        </button>
                        <Link
                          href={`/tr/blog/${blog.slug}`}
                          target="_blank"
                          style={{ background: '#1f2937', color: '#9ca3af', textDecoration: 'none', padding: '6px 10px', borderRadius: '4px', fontSize: '12px' }}
                        >
                          Gör ↗
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 6. INBOX */}
          {activeTab === 'inbox' && (
            <div>
              <h3 style={{ marginBottom: '20px', color: '#fff' }}>Gelen İletişim Mesajları ({db.inbox.length} Mesaj)</h3>
              {db.inbox.length === 0 ? (
                <div style={{ background: '#16171e', padding: '30px', borderRadius: '8px', textAlign: 'center', color: '#6b7280' }}>
                  Henüz gelen mesaj yok.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {db.inbox.map((msg, idx) => (
                    <div key={msg.id || idx} style={{ background: '#16171e', border: '1px solid #23252e', borderRadius: '8px', padding: '18px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <h5 style={{ color: '#fff', margin: 0 }}>{msg.name} ({msg.email})</h5>
                        <span style={{ fontSize: '12px', color: '#9ca3af' }}>{msg.date}</span>
                      </div>
                      <div style={{ fontSize: '13px', color: '#ff3b30', marginBottom: '6px' }}>Tel: {msg.phone} | Konu: {msg.subject}</div>
                      <p style={{ color: '#d1d5db', fontSize: '14px', margin: 0 }}>{msg.message}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
