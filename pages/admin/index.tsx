import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import {
  DatabaseSchema,
  LocalizedItem,
  SiteSettings,
  ContactMessage,
  generateWorkDetailHtml,
  generateBlogDetailHtml,
} from '../../lib/types';

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const [activeTab, setActiveTab] = useState<'works' | 'blogs' | 'site' | 'inbox'>('works');
  const [db, setDb] = useState<DatabaseSchema | null>(null);
  const [loading, setLoading] = useState(false);
  const [savedMsg, setSavedMsg] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [isWorkModalOpen, setIsWorkModalOpen] = useState(false);
  const [editingWorkIndex, setEditingWorkIndex] = useState<number | null>(null);
  const [workForm, setWorkForm] = useState<any>({
    slug: '',
    title_tr: '',
    title_en: '',
    thumbnail: '',
    category: '',
    tags: '',
    client: '',
    website: '',
    desc_tr: '',
    desc_en: '',
    gallery: [] as string[],
    meta_title_tr: '',
    meta_desc_tr: '',
    meta_title_en: '',
    meta_desc_en: '',
    raw_html_tr: '',
    raw_html_en: '',
    useRawHtml: false,
  });

  const [isBlogModalOpen, setIsBlogModalOpen] = useState(false);
  const [editingBlogIndex, setEditingBlogIndex] = useState<number | null>(null);
  const [blogForm, setBlogForm] = useState<any>({
    slug: '',
    title_tr: '',
    title_en: '',
    thumbnail: '',
    category: '',
    date: '',
    desc_tr: '',
    desc_en: '',
    content_tr: '',
    content_en: '',
    meta_title_tr: '',
    meta_desc_tr: '',
    meta_title_en: '',
    meta_desc_en: '',
  });

  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const auth = sessionStorage.getItem('admin_auth');
    if (auth === 'true') {
      setIsAuthenticated(true);
      fetchDb();
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin123' || password === 'ucanbe2026') {
      sessionStorage.setItem('admin_auth', 'true');
      setIsAuthenticated(true);
      setLoginError('');
      fetchDb();
    } else {
      setLoginError('Hatalı şifre!');
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

  const saveDbToBackend = async (dataToSave?: DatabaseSchema) => {
    const payload = dataToSave || db;
    if (!payload) return;
    setLoading(true);
    try {
      const res = await fetch('/api/admin/db', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const result = await res.json();
      if (res.ok) {
        setSavedMsg(
          result.githubSynced
            ? '✅ Değişiklikler GitHub ve Vercel ile senkronize edildi!'
            : '✅ Değişiklikler başarıyla kaydedildi!'
        );
        setTimeout(() => setSavedMsg(''), 4000);
      } else {
        alert('Kaydetme hatası: ' + (result.message || 'Bilinmeyen hata'));
      }
    } catch (err) {
      alert('Kaydetme sırasında bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  // Upload helper
  const handleFileUpload = async (file: File): Promise<string | null> => {
    setUploading(true);
    try {
      const reader = new FileReader();
      const b64Promise = new Promise<string>((resolve, reject) => {
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      const dataUrl = await b64Promise;

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: file.name,
          data: dataUrl,
        }),
      });
      const data = await res.json();
      if (res.ok && data.url) {
        return data.url;
      } else {
        alert('Görsel yüklenemedi: ' + (data.error || 'Hata'));
        return null;
      }
    } catch (err) {
      alert('Yükleme hatası oluştu.');
      return null;
    } finally {
      setUploading(false);
    }
  };

  const toSlug = (text: string) => {
    const trMap: Record<string, string> = {
      ç: 'c',
      Ç: 'c',
      ğ: 'g',
      Ğ: 'g',
      ı: 'i',
      İ: 'i',
      ö: 'o',
      Ö: 'o',
      ş: 's',
      Ş: 's',
      ü: 'u',
      Ü: 'u',
    };
    return text
      .split('')
      .map((c) => trMap[c] || c)
      .join('')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  // --- WORKS LOGIC ---
  const openNewWorkModal = () => {
    setEditingWorkIndex(null);
    setWorkForm({
      slug: '',
      title_tr: '',
      title_en: '',
      thumbnail: '',
      category: 'Web Tasarım',
      tags: 'Web Tasarım, Dijital Pazarlama',
      client: '',
      website: '',
      desc_tr: '',
      desc_en: '',
      gallery: [],
      meta_title_tr: '',
      meta_desc_tr: '',
      meta_title_en: '',
      meta_desc_en: '',
      raw_html_tr: '',
      raw_html_en: '',
      useRawHtml: false,
    });
    setIsWorkModalOpen(true);
  };

  const openEditWorkModal = (index: number) => {
    if (!db || !db.works[index]) return;
    const w = db.works[index];
    setEditingWorkIndex(index);
    setWorkForm({
      slug: w.slug || '',
      title_tr: w.title?.tr || '',
      title_en: w.title?.en || '',
      thumbnail: w.thumbnail || '',
      category: w.category || (w.tags && w.tags[0]) || '',
      tags: (w.tags || []).join(', '),
      client: w.client || '',
      website: w.website || '',
      desc_tr: w.excerpt?.tr || '',
      desc_en: w.excerpt?.en || '',
      gallery: w.gallery || [],
      meta_title_tr: w.tr?.meta?.title || '',
      meta_desc_tr: w.tr?.meta?.description || '',
      meta_title_en: w.en?.meta?.title || '',
      meta_desc_en: w.en?.meta?.description || '',
      raw_html_tr: w.tr?.html || '',
      raw_html_en: w.en?.html || '',
      useRawHtml: false,
    });
    setIsWorkModalOpen(true);
  };

  const handleSaveWorkModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!db) return;

    const slug = workForm.slug || toSlug(workForm.title_tr) || 'proje-' + Date.now();
    const tagsArr = workForm.tags
      .split(',')
      .map((t: string) => t.trim())
      .filter(Boolean);

    const workData: Partial<LocalizedItem> = {
      slug,
      title: {
        tr: workForm.title_tr || slug,
        en: workForm.title_en || workForm.title_tr || slug,
      },
      thumbnail: workForm.thumbnail || '/assets/img/innerpage/breadcrumb-bg1.webp',
      category: workForm.category || (tagsArr[0] || 'Digital'),
      tags: tagsArr,
      client: workForm.client,
      website: workForm.website,
      excerpt: {
        tr: workForm.desc_tr,
        en: workForm.desc_en || workForm.desc_tr,
      },
      gallery: workForm.gallery,
    };

    // Generate or preserve HTML
    let trHtml = workForm.raw_html_tr;
    let enHtml = workForm.raw_html_en;

    if (!workForm.useRawHtml || !trHtml) {
      trHtml = generateWorkDetailHtml(workData, 'tr');
      enHtml = generateWorkDetailHtml(workData, 'en');
    }

    const newItem: LocalizedItem = {
      slug,
      title: workData.title!,
      thumbnail: workData.thumbnail!,
      category: workData.category,
      tags: workData.tags,
      client: workData.client,
      website: workData.website,
      excerpt: workData.excerpt,
      gallery: workData.gallery,
      order: editingWorkIndex !== null ? db.works[editingWorkIndex].order : 1,
      tr: {
        slug,
        html: trHtml,
        meta: {
          title: workForm.meta_title_tr || `${workData.title?.tr} | U.CAN.BE Digital`,
          description: workForm.meta_desc_tr || workForm.desc_tr.slice(0, 160),
        },
      },
      en: {
        slug,
        html: enHtml,
        meta: {
          title: workForm.meta_title_en || `${workData.title?.en} | U.CAN.BE Digital`,
          description: workForm.meta_desc_en || (workForm.desc_en || workForm.desc_tr).slice(0, 160),
        },
      },
    };

    const updatedWorks = [...db.works];
    if (editingWorkIndex !== null) {
      updatedWorks[editingWorkIndex] = newItem;
    } else {
      // Add to beginning as latest work
      updatedWorks.unshift(newItem);
      // Re-number orders
      updatedWorks.forEach((w, idx) => (w.order = idx + 1));
    }

    const updatedDb = { ...db, works: updatedWorks };
    setDb(updatedDb);
    setIsWorkModalOpen(false);
    saveDbToBackend(updatedDb);
  };

  const handleDeleteWork = (index: number) => {
    if (!db) return;
    const w = db.works[index];
    if (!confirm(`"${w.title?.tr || w.slug}" projesini silmek istediğinize emin misiniz?`)) return;

    const updatedWorks = db.works.filter((_, idx) => idx !== index);
    updatedWorks.forEach((item, idx) => (item.order = idx + 1));
    const updatedDb = { ...db, works: updatedWorks };
    setDb(updatedDb);
    saveDbToBackend(updatedDb);
  };

  const handleMoveWork = (index: number, direction: 'up' | 'down') => {
    if (!db) return;
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= db.works.length) return;

    const updatedWorks = [...db.works];
    const temp = updatedWorks[index];
    updatedWorks[index] = updatedWorks[targetIndex];
    updatedWorks[targetIndex] = temp;

    updatedWorks.forEach((item, idx) => (item.order = idx + 1));
    const updatedDb = { ...db, works: updatedWorks };
    setDb(updatedDb);
    saveDbToBackend(updatedDb);
  };

  const handleMoveWorkToTop = (index: number) => {
    if (!db || index === 0) return;
    const updatedWorks = [...db.works];
    const [item] = updatedWorks.splice(index, 1);
    updatedWorks.unshift(item);
    updatedWorks.forEach((w, idx) => (w.order = idx + 1));
    const updatedDb = { ...db, works: updatedWorks };
    setDb(updatedDb);
    saveDbToBackend(updatedDb);
  };

  // --- BLOGS LOGIC ---
  const openNewBlogModal = () => {
    setEditingBlogIndex(null);
    setBlogForm({
      slug: '',
      title_tr: '',
      title_en: '',
      thumbnail: '',
      category: 'Teknoloji & Yapay Zeka',
      date: new Date().toLocaleDateString('tr-TR'),
      desc_tr: '',
      desc_en: '',
      content_tr: '',
      content_en: '',
      meta_title_tr: '',
      meta_desc_tr: '',
      meta_title_en: '',
      meta_desc_en: '',
    });
    setIsBlogModalOpen(true);
  };

  const openEditBlogModal = (index: number) => {
    if (!db || !db.blogs[index]) return;
    const b = db.blogs[index];
    setEditingBlogIndex(index);
    setBlogForm({
      slug: b.slug || '',
      title_tr: b.title?.tr || '',
      title_en: b.title?.en || '',
      thumbnail: b.thumbnail || '',
      category: b.category || '',
      date: b.date || '',
      desc_tr: b.excerpt?.tr || '',
      desc_en: b.excerpt?.en || '',
      content_tr: b.tr?.html || '',
      content_en: b.en?.html || '',
      meta_title_tr: b.tr?.meta?.title || '',
      meta_desc_tr: b.tr?.meta?.description || '',
      meta_title_en: b.en?.meta?.title || '',
      meta_desc_en: b.en?.meta?.description || '',
    });
    setIsBlogModalOpen(true);
  };

  const handleSaveBlogModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!db) return;

    const slug = blogForm.slug || toSlug(blogForm.title_tr) || 'blog-' + Date.now();

    const blogData: Partial<LocalizedItem> = {
      slug,
      title: {
        tr: blogForm.title_tr || slug,
        en: blogForm.title_en || blogForm.title_tr || slug,
      },
      thumbnail: blogForm.thumbnail || '/assets/img/innerpage/breadcrumb-bg1.webp',
      category: blogForm.category,
      date: blogForm.date || new Date().toLocaleDateString('tr-TR'),
      excerpt: {
        tr: blogForm.desc_tr,
        en: blogForm.desc_en || blogForm.desc_tr,
      },
      tr: {
        html: blogForm.content_tr,
        meta: { title: '', description: '' },
      },
      en: {
        html: blogForm.content_en || blogForm.content_tr,
        meta: { title: '', description: '' },
      },
    };

    const trHtml = generateBlogDetailHtml(blogData, 'tr');
    const enHtml = generateBlogDetailHtml(blogData, 'en');

    const newItem: LocalizedItem = {
      slug,
      title: blogData.title!,
      thumbnail: blogData.thumbnail!,
      category: blogData.category,
      date: blogData.date,
      excerpt: blogData.excerpt,
      order: editingBlogIndex !== null ? db.blogs[editingBlogIndex].order : 1,
      tr: {
        slug,
        html: trHtml,
        meta: {
          title: blogForm.meta_title_tr || `${blogData.title?.tr} | U.CAN.BE Blog`,
          description: blogForm.meta_desc_tr || blogForm.desc_tr.slice(0, 160),
        },
      },
      en: {
        slug,
        html: enHtml,
        meta: {
          title: blogForm.meta_title_en || `${blogData.title?.en} | U.CAN.BE Blog`,
          description: blogForm.meta_desc_en || (blogForm.desc_en || blogForm.desc_tr).slice(0, 160),
        },
      },
    };

    const updatedBlogs = [...db.blogs];
    if (editingBlogIndex !== null) {
      updatedBlogs[editingBlogIndex] = newItem;
    } else {
      updatedBlogs.unshift(newItem);
      updatedBlogs.forEach((b, idx) => (b.order = idx + 1));
    }

    const updatedDb = { ...db, blogs: updatedBlogs };
    setDb(updatedDb);
    setIsBlogModalOpen(false);
    saveDbToBackend(updatedDb);
  };

  const handleDeleteBlog = (index: number) => {
    if (!db) return;
    const b = db.blogs[index];
    if (!confirm(`"${b.title?.tr || b.slug}" yazısını silmek istediğinize emin misiniz?`)) return;

    const updatedBlogs = db.blogs.filter((_, idx) => idx !== index);
    updatedBlogs.forEach((item, idx) => (item.order = idx + 1));
    const updatedDb = { ...db, blogs: updatedBlogs };
    setDb(updatedDb);
    saveDbToBackend(updatedDb);
  };

  // --- INBOX LOGIC ---
  const handleDeleteMessage = (id: string) => {
    if (!db) return;
    if (!confirm('Bu mesajı silmek istediğinize emin misiniz?')) return;
    const updatedInbox = db.inbox.filter((m) => m.id !== id);
    const updatedDb = { ...db, inbox: updatedInbox };
    setDb(updatedDb);
    saveDbToBackend(updatedDb);
  };

  if (!isAuthenticated) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: '#090a0d',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        <Head>
          <title>U.CAN.BE Digital - Yönetici Girişi</title>
        </Head>
        <div
          style={{
            background: '#13141a',
            border: '1px solid #242633',
            borderRadius: '16px',
            padding: '40px',
            width: '100%',
            maxWidth: '420px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <img src="/assets/img/logo.png" alt="U.CAN.BE" width={130} style={{ marginBottom: '16px' }} />
            <h4 style={{ color: '#fff', margin: '0 0 6px 0', fontSize: '20px' }}>Yönetim Paneli</h4>
            <p style={{ color: '#8e93a0', fontSize: '13px', margin: 0 }}>U.CAN.BE Web İçerik Yönetim Sistemi</p>
          </div>
          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', color: '#c4c8d4' }}>
                Yönetici Şifresi
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Şifrenizi girin..."
                style={{
                  background: '#0c0d12',
                  border: '1px solid #2d3142',
                  color: '#fff',
                  padding: '12px 14px',
                  borderRadius: '8px',
                  width: '100%',
                  fontSize: '14px',
                  outline: 'none',
                }}
                required
              />
            </div>
            {loginError && (
              <div
                style={{
                  color: '#ff4d4f',
                  fontSize: '13px',
                  marginBottom: '16px',
                  background: 'rgba(255,77,79,0.1)',
                  padding: '8px 12px',
                  borderRadius: '6px',
                }}
              >
                {loginError}
              </div>
            )}
            <button
              type="submit"
              style={{
                width: '100%',
                padding: '13px',
                background: '#ff3b30',
                border: 'none',
                borderRadius: '8px',
                color: '#fff',
                fontWeight: 600,
                fontSize: '15px',
                cursor: 'pointer',
                transition: 'background 0.2s',
              }}
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
      <div
        style={{
          minHeight: '100vh',
          background: '#090a0d',
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
        }}
      >
        Yükleniyor...
      </div>
    );
  }

  // Filtered lists
  const filteredWorks = db.works.filter((w) => {
    const q = searchQuery.toLowerCase();
    return (
      (w.title?.tr || '').toLowerCase().includes(q) ||
      (w.title?.en || '').toLowerCase().includes(q) ||
      (w.slug || '').toLowerCase().includes(q) ||
      (w.category || '').toLowerCase().includes(q) ||
      (w.tags || []).some((t) => t.toLowerCase().includes(q))
    );
  });

  const filteredBlogs = db.blogs.filter((b) => {
    const q = searchQuery.toLowerCase();
    return (
      (b.title?.tr || '').toLowerCase().includes(q) ||
      (b.title?.en || '').toLowerCase().includes(q) ||
      (b.slug || '').toLowerCase().includes(q)
    );
  });

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#090a0d',
        color: '#e2e4ea',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      <Head>
        <title>U.CAN.BE Digital - CMS Dashboard</title>
      </Head>

      {/* Top Navbar */}
      <header
        style={{
          background: '#121319',
          borderBottom: '1px solid #1f212a',
          padding: '14px 28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          zIndex: 100,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <img src="/assets/img/logo.png" alt="Logo" width={110} />
          <span
            style={{
              fontSize: '11px',
              letterSpacing: '1px',
              background: 'rgba(255,59,48,0.15)',
              color: '#ff4d4f',
              border: '1px solid rgba(255,59,48,0.3)',
              padding: '3px 8px',
              borderRadius: '4px',
              fontWeight: 700,
            }}
          >
            CMS ADMIN
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {savedMsg && <span style={{ color: '#4ade80', fontSize: '13px', fontWeight: 600 }}>{savedMsg}</span>}
          <button
            onClick={() => saveDbToBackend()}
            disabled={loading}
            style={{
              background: '#22c55e',
              color: '#fff',
              border: 'none',
              padding: '8px 18px',
              borderRadius: '8px',
              fontWeight: 600,
              fontSize: '13px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            {loading ? 'Kaydediliyor...' : '💾 Değişiklikleri Yayınla'}
          </button>
          <Link
            href="/tr"
            target="_blank"
            style={{
              color: '#9ca3af',
              textDecoration: 'none',
              fontSize: '13px',
              padding: '8px 14px',
              border: '1px solid #282a36',
              borderRadius: '8px',
            }}
          >
            Siteyi Gör ↗
          </Link>
          <button
            onClick={handleLogout}
            style={{
              background: 'transparent',
              color: '#9ca3af',
              border: '1px solid #282a36',
              padding: '8px 14px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '13px',
            }}
          >
            Çıkış
          </button>
        </div>
      </header>

      {/* Main Container */}
      <div style={{ display: 'flex', flex: 1 }}>
        {/* Sidebar Nav */}
        <aside
          style={{
            width: '260px',
            background: '#0e0f14',
            borderRight: '1px solid #1d1f28',
            padding: '24px 14px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}
        >
          {[
            { key: 'works', label: '💼 İşler / Portfolyo', count: db.works.length },
            { key: 'blogs', label: '✍️ Blog Makaleleri', count: db.blogs.length },
            { key: 'site', label: '⚙️ Site & İletişim', count: null },
            { key: 'inbox', label: '📬 Gelen Mesajlar', count: db.inbox.length },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => {
                setActiveTab(tab.key as any);
                setSearchQuery('');
              }}
              style={{
                width: '100%',
                textAlign: 'left',
                padding: '12px 16px',
                borderRadius: '10px',
                border: 'none',
                background: activeTab === tab.key ? '#ff3b30' : 'transparent',
                color: activeTab === tab.key ? '#fff' : '#8e93a0',
                fontWeight: activeTab === tab.key ? 600 : 500,
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '14px',
                transition: 'all 0.15s ease',
              }}
            >
              <span>{tab.label}</span>
              {tab.count !== null && (
                <span
                  style={{
                    fontSize: '11px',
                    background: activeTab === tab.key ? 'rgba(0,0,0,0.3)' : '#1b1d26',
                    color: '#fff',
                    padding: '2px 8px',
                    borderRadius: '12px',
                  }}
                >
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </aside>

        {/* Content Area */}
        <main style={{ flex: 1, padding: '32px', overflowY: 'auto' }}>
          {/* TAB 1: WORKS */}
          {activeTab === 'works' && (
            <div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '24px',
                  flexWrap: 'wrap',
                  gap: '16px',
                }}
              >
                <div>
                  <h2 style={{ color: '#fff', margin: '0 0 6px 0', fontSize: '24px' }}>
                    İşler & Portfolyo Yönetimi
                  </h2>
                  <p style={{ color: '#8e93a0', margin: 0, fontSize: '14px' }}>
                    Toplam {db.works.length} proje yayında. Sıralamayı oklarla değiştirebilir veya yeni iş
                    ekleyebilirsiniz.
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <input
                    type="text"
                    placeholder="İşlerde ara..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                      background: '#13141a',
                      border: '1px solid #242633',
                      color: '#fff',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      fontSize: '13px',
                      width: '220px',
                    }}
                  />
                  <button
                    onClick={openNewWorkModal}
                    style={{
                      background: '#ff3b30',
                      color: '#fff',
                      border: 'none',
                      padding: '10px 20px',
                      borderRadius: '8px',
                      fontWeight: 600,
                      fontSize: '14px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <span>+</span> Yeni İş Ekle
                  </button>
                </div>
              </div>

              {/* Works List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {filteredWorks.map((work, idx) => {
                  const realIndex = db.works.findIndex((w) => w.slug === work.slug);
                  return (
                    <div
                      key={work.slug}
                      style={{
                        background: '#13141a',
                        border: '1px solid #1f212a',
                        borderRadius: '12px',
                        padding: '14px 20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '16px',
                      }}
                    >
                      {/* Left: Thumbnail & Info */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1 }}>
                        <span
                          style={{
                            fontSize: '12px',
                            fontWeight: 700,
                            color: '#6b7280',
                            width: '28px',
                            textAlign: 'center',
                          }}
                        >
                          #{work.order || realIndex + 1}
                        </span>

                        <img
                          src={work.thumbnail || '/assets/img/innerpage/breadcrumb-bg1.webp'}
                          alt={work.slug}
                          style={{
                            width: '56px',
                            height: '56px',
                            borderRadius: '8px',
                            objectFit: 'cover',
                            background: '#1b1d26',
                          }}
                        />

                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                            <h4 style={{ color: '#fff', margin: 0, fontSize: '15px' }}>
                              {work.title?.tr || work.slug}
                            </h4>
                            <span style={{ fontSize: '11px', color: '#ff4d4f', fontWeight: 500 }}>
                              /{work.slug}
                            </span>
                          </div>
                          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                            {(work.tags || []).slice(0, 3).map((tag, tIdx) => (
                              <span
                                key={tIdx}
                                style={{
                                  fontSize: '11px',
                                  background: '#1c1e27',
                                  color: '#9ca3af',
                                  padding: '2px 8px',
                                  borderRadius: '6px',
                                }}
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Right: Actions & Reorder */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {/* Move controls */}
                        <div style={{ display: 'flex', gap: '4px', marginRight: '8px' }}>
                          <button
                            onClick={() => handleMoveWorkToTop(realIndex)}
                            title="En Üste Taşı"
                            style={{
                              background: '#1c1e27',
                              color: '#9ca3af',
                              border: 'none',
                              padding: '6px 10px',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              fontSize: '12px',
                            }}
                          >
                            🔝
                          </button>
                          <button
                            onClick={() => handleMoveWork(realIndex, 'up')}
                            disabled={realIndex === 0}
                            title="Yukarı Taşı"
                            style={{
                              background: '#1c1e27',
                              color: realIndex === 0 ? '#4b5563' : '#fff',
                              border: 'none',
                              padding: '6px 10px',
                              borderRadius: '6px',
                              cursor: realIndex === 0 ? 'not-allowed' : 'pointer',
                              fontSize: '12px',
                            }}
                          >
                            ▲
                          </button>
                          <button
                            onClick={() => handleMoveWork(realIndex, 'down')}
                            disabled={realIndex === db.works.length - 1}
                            title="Aşağı Taşı"
                            style={{
                              background: '#1c1e27',
                              color: realIndex === db.works.length - 1 ? '#4b5563' : '#fff',
                              border: 'none',
                              padding: '6px 10px',
                              borderRadius: '6px',
                              cursor: realIndex === db.works.length - 1 ? 'not-allowed' : 'pointer',
                              fontSize: '12px',
                            }}
                          >
                            ▼
                          </button>
                        </div>

                        {/* Edit & View */}
                        <button
                          onClick={() => openEditWorkModal(realIndex)}
                          style={{
                            background: '#2563eb',
                            color: '#fff',
                            border: 'none',
                            padding: '6px 12px',
                            borderRadius: '6px',
                            fontSize: '12px',
                            fontWeight: 600,
                            cursor: 'pointer',
                          }}
                        >
                          Düzenle
                        </button>
                        <Link
                          href={`/tr/isler/${work.slug}`}
                          target="_blank"
                          style={{
                            background: '#1c1e27',
                            color: '#9ca3af',
                            textDecoration: 'none',
                            padding: '6px 10px',
                            borderRadius: '6px',
                            fontSize: '12px',
                          }}
                        >
                          Gör ↗
                        </Link>
                        <button
                          onClick={() => handleDeleteWork(realIndex)}
                          style={{
                            background: 'rgba(239,68,68,0.1)',
                            color: '#ef4444',
                            border: '1px solid rgba(239,68,68,0.2)',
                            padding: '6px 10px',
                            borderRadius: '6px',
                            fontSize: '12px',
                            cursor: 'pointer',
                          }}
                        >
                          Sil
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: BLOGS */}
          {activeTab === 'blogs' && (
            <div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '24px',
                  flexWrap: 'wrap',
                  gap: '16px',
                }}
              >
                <div>
                  <h2 style={{ color: '#fff', margin: '0 0 6px 0', fontSize: '24px' }}>Blog Makaleleri</h2>
                  <p style={{ color: '#8e93a0', margin: 0, fontSize: '14px' }}>
                    Toplam {db.blogs.length} makale yayında.
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <input
                    type="text"
                    placeholder="Bloglarda ara..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                      background: '#13141a',
                      border: '1px solid #242633',
                      color: '#fff',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      fontSize: '13px',
                      width: '220px',
                    }}
                  />
                  <button
                    onClick={openNewBlogModal}
                    style={{
                      background: '#ff3b30',
                      color: '#fff',
                      border: 'none',
                      padding: '10px 20px',
                      borderRadius: '8px',
                      fontWeight: 600,
                      fontSize: '14px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <span>+</span> Yeni Yazı Ekle
                  </button>
                </div>
              </div>

              {/* Blogs List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {filteredBlogs.map((blog, idx) => {
                  const realIndex = db.blogs.findIndex((b) => b.slug === blog.slug);
                  return (
                    <div
                      key={blog.slug}
                      style={{
                        background: '#13141a',
                        border: '1px solid #1f212a',
                        borderRadius: '12px',
                        padding: '14px 20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '16px',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1 }}>
                        <img
                          src={blog.thumbnail || '/assets/img/innerpage/breadcrumb-bg1.webp'}
                          alt={blog.slug}
                          style={{
                            width: '64px',
                            height: '50px',
                            borderRadius: '8px',
                            objectFit: 'cover',
                            background: '#1b1d26',
                          }}
                        />
                        <div>
                          <h4 style={{ color: '#fff', margin: '0 0 4px 0', fontSize: '15px' }}>
                            {blog.title?.tr || blog.slug}
                          </h4>
                          <span style={{ fontSize: '12px', color: '#9ca3af' }}>📅 {blog.date}</span>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <button
                          onClick={() => openEditBlogModal(realIndex)}
                          style={{
                            background: '#2563eb',
                            color: '#fff',
                            border: 'none',
                            padding: '6px 12px',
                            borderRadius: '6px',
                            fontSize: '12px',
                            fontWeight: 600,
                            cursor: 'pointer',
                          }}
                        >
                          Düzenle
                        </button>
                        <Link
                          href={`/tr/blog/${blog.slug}`}
                          target="_blank"
                          style={{
                            background: '#1c1e27',
                            color: '#9ca3af',
                            textDecoration: 'none',
                            padding: '6px 10px',
                            borderRadius: '6px',
                            fontSize: '12px',
                          }}
                        >
                          Gör ↗
                        </Link>
                        <button
                          onClick={() => handleDeleteBlog(realIndex)}
                          style={{
                            background: 'rgba(239,68,68,0.1)',
                            color: '#ef4444',
                            border: '1px solid rgba(239,68,68,0.2)',
                            padding: '6px 10px',
                            borderRadius: '6px',
                            fontSize: '12px',
                            cursor: 'pointer',
                          }}
                        >
                          Sil
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: SITE & CONTACT SETTINGS */}
          {activeTab === 'site' && (
            <div>
              <h2 style={{ color: '#fff', margin: '0 0 6px 0', fontSize: '24px' }}>Site Genel Ayarları</h2>
              <p style={{ color: '#8e93a0', margin: '0 0 24px 0', fontSize: '14px' }}>
                İletişim numaraları, Türkçe ve İngilizce ofis adresleri ve sosyal medya bağlantıları.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div
                  style={{
                    background: '#13141a',
                    border: '1px solid #1f212a',
                    borderRadius: '12px',
                    padding: '24px',
                  }}
                >
                  <h4 style={{ color: '#ff3b30', marginTop: 0, marginBottom: '20px' }}>İletişim Bilgileri</h4>
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', fontSize: '13px', color: '#9ca3af', marginBottom: '6px' }}>
                      Telefon (TR Sitede Gösterilen)
                    </label>
                    <input
                      type="text"
                      value={db.site.phone}
                      onChange={(e) => setDb({ ...db, site: { ...db.site, phone: e.target.value } })}
                      style={{
                        background: '#0c0d12',
                        border: '1px solid #2d3142',
                        color: '#fff',
                        padding: '10px 14px',
                        width: '100%',
                        borderRadius: '8px',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', fontSize: '13px', color: '#9ca3af', marginBottom: '6px' }}>
                      E-Posta Adresi
                    </label>
                    <input
                      type="email"
                      value={db.site.email}
                      onChange={(e) => setDb({ ...db, site: { ...db.site, email: e.target.value } })}
                      style={{
                        background: '#0c0d12',
                        border: '1px solid #2d3142',
                        color: '#fff',
                        padding: '10px 14px',
                        width: '100%',
                        borderRadius: '8px',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', fontSize: '13px', color: '#9ca3af', marginBottom: '6px' }}>
                      Adres (Türkçe Sitede Gösterilen - İstanbul)
                    </label>
                    <input
                      type="text"
                      value={db.site.address.tr}
                      onChange={(e) =>
                        setDb({ ...db, site: { ...db.site, address: { ...db.site.address, tr: e.target.value } } })
                      }
                      style={{
                        background: '#0c0d12',
                        border: '1px solid #2d3142',
                        color: '#fff',
                        padding: '10px 14px',
                        width: '100%',
                        borderRadius: '8px',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', fontSize: '13px', color: '#9ca3af', marginBottom: '6px' }}>
                      Adres (İngilizce Sitede Gösterilen - Newark DE, ABD)
                    </label>
                    <input
                      type="text"
                      value={db.site.address.en}
                      onChange={(e) =>
                        setDb({ ...db, site: { ...db.site, address: { ...db.site.address, en: e.target.value } } })
                      }
                      style={{
                        background: '#0c0d12',
                        border: '1px solid #2d3142',
                        color: '#fff',
                        padding: '10px 14px',
                        width: '100%',
                        borderRadius: '8px',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>
                </div>

                <div
                  style={{
                    background: '#13141a',
                    border: '1px solid #1f212a',
                    borderRadius: '12px',
                    padding: '24px',
                  }}
                >
                  <h4 style={{ color: '#ff3b30', marginTop: 0, marginBottom: '20px' }}>Sosyal Medya Linkleri</h4>
                  {['instagram', 'linkedin', 'twitter', 'facebook'].map((soc) => (
                    <div key={soc} style={{ marginBottom: '16px' }}>
                      <label
                        style={{
                          display: 'block',
                          fontSize: '13px',
                          color: '#9ca3af',
                          marginBottom: '6px',
                          textTransform: 'capitalize',
                        }}
                      >
                        {soc}
                      </label>
                      <input
                        type="text"
                        value={(db.site as any)[soc] || ''}
                        onChange={(e) => setDb({ ...db, site: { ...db.site, [soc]: e.target.value } })}
                        style={{
                          background: '#0c0d12',
                          border: '1px solid #2d3142',
                          color: '#fff',
                          padding: '10px 14px',
                          width: '100%',
                          borderRadius: '8px',
                          boxSizing: 'border-box',
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: INBOX */}
          {activeTab === 'inbox' && (
            <div>
              <h2 style={{ color: '#fff', margin: '0 0 6px 0', fontSize: '24px' }}>Gelen İletişim Mesajları</h2>
              <p style={{ color: '#8e93a0', margin: '0 0 24px 0', fontSize: '14px' }}>
                Sitenin iletişim formundan iletilen talepler.
              </p>

              {db.inbox.length === 0 ? (
                <div
                  style={{
                    background: '#13141a',
                    border: '1px solid #1f212a',
                    borderRadius: '12px',
                    padding: '40px',
                    textAlign: 'center',
                    color: '#9ca3af',
                  }}
                >
                  Henüz gelen bir mesaj bulunmuyor.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {db.inbox.map((msg) => (
                    <div
                      key={msg.id}
                      style={{
                        background: '#13141a',
                        border: '1px solid #1f212a',
                        borderRadius: '12px',
                        padding: '20px',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginBottom: '12px',
                        }}
                      >
                        <div>
                          <strong style={{ color: '#fff', fontSize: '16px' }}>{msg.name}</strong>
                          <span style={{ color: '#9ca3af', fontSize: '13px', marginLeft: '12px' }}>
                            {msg.email} | {msg.phone}
                          </span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <span style={{ color: '#6b7280', fontSize: '12px' }}>{msg.date}</span>
                          <button
                            onClick={() => handleDeleteMessage(msg.id)}
                            style={{
                              background: 'transparent',
                              border: '1px solid #374151',
                              color: '#ef4444',
                              padding: '4px 10px',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              fontSize: '12px',
                            }}
                          >
                            Sil
                          </button>
                        </div>
                      </div>
                      <div style={{ color: '#38bdf8', fontSize: '14px', marginBottom: '8px', fontWeight: 600 }}>
                        {msg.subject}
                      </div>
                      <p style={{ color: '#d1d5db', fontSize: '14px', margin: 0, whiteSpace: 'pre-wrap' }}>
                        {msg.message}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* WORK EDIT/ADD MODAL */}
      {isWorkModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.75)',
            backdropFilter: 'blur(5px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px',
          }}
        >
          <div
            style={{
              background: '#14151c',
              border: '1px solid #292c3d',
              borderRadius: '16px',
              width: '100%',
              maxWidth: '850px',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 25px 50px rgba(0,0,0,0.6)',
            }}
          >
            <div
              style={{
                padding: '20px 28px',
                borderBottom: '1px solid #232635',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <h3 style={{ color: '#fff', margin: 0 }}>
                {editingWorkIndex !== null ? 'İşi Düzenle' : 'Yeni İş Ekle'}
              </h3>
              <button
                onClick={() => setIsWorkModalOpen(false)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#9ca3af',
                  fontSize: '20px',
                  cursor: 'pointer',
                }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveWorkModal} style={{ padding: '28px' }}>
              {/* Titles */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', color: '#9ca3af', marginBottom: '6px' }}>
                    Proje Başlığı (TR) *
                  </label>
                  <input
                    type="text"
                    required
                    value={workForm.title_tr}
                    onChange={(e) => {
                      const val = e.target.value;
                      setWorkForm({
                        ...workForm,
                        title_tr: val,
                        slug: editingWorkIndex === null ? toSlug(val) : workForm.slug,
                      });
                    }}
                    placeholder="Örn: Happy Mind"
                    style={{
                      background: '#0c0d12',
                      border: '1px solid #2d3142',
                      color: '#fff',
                      padding: '10px 14px',
                      width: '100%',
                      borderRadius: '8px',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', color: '#9ca3af', marginBottom: '6px' }}>
                    Project Title (EN)
                  </label>
                  <input
                    type="text"
                    value={workForm.title_en}
                    onChange={(e) => setWorkForm({ ...workForm, title_en: e.target.value })}
                    placeholder="e.g. Happy Mind"
                    style={{
                      background: '#0c0d12',
                      border: '1px solid #2d3142',
                      color: '#fff',
                      padding: '10px 14px',
                      width: '100%',
                      borderRadius: '8px',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
              </div>

              {/* Slug & Client */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', color: '#9ca3af', marginBottom: '6px' }}>
                    URL Slug (Kalıcı Bağlantı) *
                  </label>
                  <input
                    type="text"
                    required
                    value={workForm.slug}
                    onChange={(e) => setWorkForm({ ...workForm, slug: toSlug(e.target.value) })}
                    placeholder="orn: happy-mind"
                    style={{
                      background: '#0c0d12',
                      border: '1px solid #2d3142',
                      color: '#ff4d4f',
                      padding: '10px 14px',
                      width: '100%',
                      borderRadius: '8px',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', color: '#9ca3af', marginBottom: '6px' }}>
                    Müşteri / Marka Adı
                  </label>
                  <input
                    type="text"
                    value={workForm.client}
                    onChange={(e) => setWorkForm({ ...workForm, client: e.target.value })}
                    placeholder="Örn: Happy Mind Inc."
                    style={{
                      background: '#0c0d12',
                      border: '1px solid #2d3142',
                      color: '#fff',
                      padding: '10px 14px',
                      width: '100%',
                      borderRadius: '8px',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
              </div>

              {/* Tags & Website */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', color: '#9ca3af', marginBottom: '6px' }}>
                    Etiketler / Yapılanlar (Virgülle ayırın)
                  </label>
                  <input
                    type="text"
                    value={workForm.tags}
                    onChange={(e) => setWorkForm({ ...workForm, tags: e.target.value })}
                    placeholder="Web Tasarım, Sosyal Medya, SEO"
                    style={{
                      background: '#0c0d12',
                      border: '1px solid #2d3142',
                      color: '#fff',
                      padding: '10px 14px',
                      width: '100%',
                      borderRadius: '8px',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', color: '#9ca3af', marginBottom: '6px' }}>
                    Canlı Site Linki (Opsiyonel)
                  </label>
                  <input
                    type="url"
                    value={workForm.website}
                    onChange={(e) => setWorkForm({ ...workForm, website: e.target.value })}
                    placeholder="https://example.com"
                    style={{
                      background: '#0c0d12',
                      border: '1px solid #2d3142',
                      color: '#fff',
                      padding: '10px 14px',
                      width: '100%',
                      borderRadius: '8px',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
              </div>

              {/* Thumbnail with Upload */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', color: '#9ca3af', marginBottom: '6px' }}>
                  Kapak Görseli
                </label>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <input
                    type="text"
                    value={workForm.thumbnail}
                    onChange={(e) => setWorkForm({ ...workForm, thumbnail: e.target.value })}
                    placeholder="/storage/works/..."
                    style={{
                      background: '#0c0d12',
                      border: '1px solid #2d3142',
                      color: '#fff',
                      padding: '10px 14px',
                      flex: 1,
                      borderRadius: '8px',
                      boxSizing: 'border-box',
                    }}
                  />
                  <label
                    style={{
                      background: '#374151',
                      color: '#fff',
                      padding: '10px 16px',
                      borderRadius: '8px',
                      fontSize: '13px',
                      fontWeight: 600,
                      cursor: uploading ? 'not-allowed' : 'pointer',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {uploading ? 'Yükleniyor...' : '📁 Dosya Seç & Yükle'}
                    <input
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      disabled={uploading}
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const url = await handleFileUpload(file);
                          if (url) setWorkForm({ ...workForm, thumbnail: url });
                        }
                      }}
                    />
                  </label>
                </div>
                {workForm.thumbnail && (
                  <div style={{ marginTop: '10px' }}>
                    <img
                      src={workForm.thumbnail}
                      alt="Önizleme"
                      style={{ maxHeight: '100px', borderRadius: '8px', objectFit: 'cover' }}
                    />
                  </div>
                )}
              </div>

              {/* Description TR & EN */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', color: '#9ca3af', marginBottom: '6px' }}>
                    Proje Açıklaması (TR)
                  </label>
                  <textarea
                    rows={6}
                    value={workForm.desc_tr}
                    onChange={(e) => setWorkForm({ ...workForm, desc_tr: e.target.value })}
                    placeholder="Bu proje kapsamında neler yapıldı, marka hedefleri nelerdi..."
                    style={{
                      background: '#0c0d12',
                      border: '1px solid #2d3142',
                      color: '#fff',
                      padding: '12px',
                      width: '100%',
                      borderRadius: '8px',
                      boxSizing: 'border-box',
                      fontSize: '13px',
                      lineHeight: '1.6',
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', color: '#9ca3af', marginBottom: '6px' }}>
                    Project Description (EN)
                  </label>
                  <textarea
                    rows={6}
                    value={workForm.desc_en}
                    onChange={(e) => setWorkForm({ ...workForm, desc_en: e.target.value })}
                    placeholder="What was done in this project..."
                    style={{
                      background: '#0c0d12',
                      border: '1px solid #2d3142',
                      color: '#fff',
                      padding: '12px',
                      width: '100%',
                      borderRadius: '8px',
                      boxSizing: 'border-box',
                      fontSize: '13px',
                      lineHeight: '1.6',
                    }}
                  />
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button
                  type="button"
                  onClick={() => setIsWorkModalOpen(false)}
                  style={{
                    background: 'transparent',
                    border: '1px solid #374151',
                    color: '#9ca3af',
                    padding: '10px 18px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                  }}
                >
                  İptal
                </button>
                <button
                  type="submit"
                  style={{
                    background: '#ff3b30',
                    border: 'none',
                    color: '#fff',
                    padding: '10px 24px',
                    borderRadius: '8px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Kaydet & Uygula
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* BLOG EDIT/ADD MODAL */}
      {isBlogModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.75)',
            backdropFilter: 'blur(5px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px',
          }}
        >
          <div
            style={{
              background: '#14151c',
              border: '1px solid #292c3d',
              borderRadius: '16px',
              width: '100%',
              maxWidth: '850px',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 25px 50px rgba(0,0,0,0.6)',
            }}
          >
            <div
              style={{
                padding: '20px 28px',
                borderBottom: '1px solid #232635',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <h3 style={{ color: '#fff', margin: 0 }}>
                {editingBlogIndex !== null ? 'Yazıyı Düzenle' : 'Yeni Blog Yazısı'}
              </h3>
              <button
                onClick={() => setIsBlogModalOpen(false)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#9ca3af',
                  fontSize: '20px',
                  cursor: 'pointer',
                }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveBlogModal} style={{ padding: '28px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', color: '#9ca3af', marginBottom: '6px' }}>
                    Yazı Başlığı (TR) *
                  </label>
                  <input
                    type="text"
                    required
                    value={blogForm.title_tr}
                    onChange={(e) => {
                      const val = e.target.value;
                      setBlogForm({
                        ...blogForm,
                        title_tr: val,
                        slug: editingBlogIndex === null ? toSlug(val) : blogForm.slug,
                      });
                    }}
                    placeholder="Örn: 2026 Dijital Pazarlama Trendleri"
                    style={{
                      background: '#0c0d12',
                      border: '1px solid #2d3142',
                      color: '#fff',
                      padding: '10px 14px',
                      width: '100%',
                      borderRadius: '8px',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', color: '#9ca3af', marginBottom: '6px' }}>
                    Article Title (EN)
                  </label>
                  <input
                    type="text"
                    value={blogForm.title_en}
                    onChange={(e) => setBlogForm({ ...blogForm, title_en: e.target.value })}
                    placeholder="e.g. 2026 Digital Marketing Trends"
                    style={{
                      background: '#0c0d12',
                      border: '1px solid #2d3142',
                      color: '#fff',
                      padding: '10px 14px',
                      width: '100%',
                      borderRadius: '8px',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', color: '#9ca3af', marginBottom: '6px' }}>
                    URL Slug *
                  </label>
                  <input
                    type="text"
                    required
                    value={blogForm.slug}
                    onChange={(e) => setBlogForm({ ...blogForm, slug: toSlug(e.target.value) })}
                    style={{
                      background: '#0c0d12',
                      border: '1px solid #2d3142',
                      color: '#ff4d4f',
                      padding: '10px 14px',
                      width: '100%',
                      borderRadius: '8px',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', color: '#9ca3af', marginBottom: '6px' }}>
                    Yayın Tarihi
                  </label>
                  <input
                    type="text"
                    value={blogForm.date}
                    onChange={(e) => setBlogForm({ ...blogForm, date: e.target.value })}
                    placeholder="DD/MM/YYYY"
                    style={{
                      background: '#0c0d12',
                      border: '1px solid #2d3142',
                      color: '#fff',
                      padding: '10px 14px',
                      width: '100%',
                      borderRadius: '8px',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', color: '#9ca3af', marginBottom: '6px' }}>
                  Kapak Görseli
                </label>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <input
                    type="text"
                    value={blogForm.thumbnail}
                    onChange={(e) => setBlogForm({ ...blogForm, thumbnail: e.target.value })}
                    placeholder="/storage/makalelers/..."
                    style={{
                      background: '#0c0d12',
                      border: '1px solid #2d3142',
                      color: '#fff',
                      padding: '10px 14px',
                      flex: 1,
                      borderRadius: '8px',
                      boxSizing: 'border-box',
                    }}
                  />
                  <label
                    style={{
                      background: '#374151',
                      color: '#fff',
                      padding: '10px 16px',
                      borderRadius: '8px',
                      fontSize: '13px',
                      fontWeight: 600,
                      cursor: uploading ? 'not-allowed' : 'pointer',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {uploading ? 'Yükleniyor...' : '📁 Dosya Seç & Yükle'}
                    <input
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      disabled={uploading}
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const url = await handleFileUpload(file);
                          if (url) setBlogForm({ ...blogForm, thumbnail: url });
                        }
                      }}
                    />
                  </label>
                </div>
                {blogForm.thumbnail && (
                  <div style={{ marginTop: '10px' }}>
                    <img
                      src={blogForm.thumbnail}
                      alt="Önizleme"
                      style={{ maxHeight: '100px', borderRadius: '8px', objectFit: 'cover' }}
                    />
                  </div>
                )}
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', color: '#9ca3af', marginBottom: '6px' }}>
                  Özet / Açıklama (TR)
                </label>
                <input
                  type="text"
                  value={blogForm.desc_tr}
                  onChange={(e) => setBlogForm({ ...blogForm, desc_tr: e.target.value })}
                  placeholder="Makalenin kısa özeti..."
                  style={{
                    background: '#0c0d12',
                    border: '1px solid #2d3142',
                    color: '#fff',
                    padding: '10px 14px',
                    width: '100%',
                    borderRadius: '8px',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '13px', color: '#9ca3af', marginBottom: '6px' }}>
                  Makale İçeriği (TR HTML / Paragraflar)
                </label>
                <textarea
                  rows={8}
                  value={blogForm.content_tr}
                  onChange={(e) => setBlogForm({ ...blogForm, content_tr: e.target.value })}
                  placeholder="Makale metninizi buraya yazın veya yapıştırın..."
                  style={{
                    background: '#0c0d12',
                    border: '1px solid #2d3142',
                    color: '#fff',
                    padding: '12px',
                    width: '100%',
                    borderRadius: '8px',
                    boxSizing: 'border-box',
                    fontSize: '13px',
                    lineHeight: '1.6',
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button
                  type="button"
                  onClick={() => setIsBlogModalOpen(false)}
                  style={{
                    background: 'transparent',
                    border: '1px solid #374151',
                    color: '#9ca3af',
                    padding: '10px 18px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                  }}
                >
                  İptal
                </button>
                <button
                  type="submit"
                  style={{
                    background: '#ff3b30',
                    border: 'none',
                    color: '#fff',
                    padding: '10px 24px',
                    borderRadius: '8px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Kaydet & Uygula
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
