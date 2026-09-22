export interface SiteMeta {
  title: string;
  description: string;
}

export interface PageContent {
  slug?: string;
  html: string;
  meta: SiteMeta;
}

export interface LocalizedItem {
  slug: string;
  title?: {
    tr: string;
    en: string;
  };
  thumbnail?: string;
  category?: string;
  tags?: string[];
  client?: string;
  date?: string;
  order?: number;
  excerpt?: {
    tr: string;
    en: string;
  };
  gallery?: string[];
  website?: string;
  tr: PageContent;
  en: PageContent;
}

export interface SiteSettings {
  phone: string;
  phone_en?: string;
  email: string;
  address: {
    tr: string;
    en: string;
  };
  facebook: string;
  twitter: string;
  linkedin: string;
  instagram: string;
  tagline?: {
    tr: string;
    en: string;
  };
  footerText?: {
    tr: string;
    en: string;
  };
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  date: string;
}

export interface DatabaseSchema {
  site: SiteSettings;
  works: LocalizedItem[];
  services: LocalizedItem[];
  blogs: LocalizedItem[];
  pages: Record<string, PageContent>;
  inbox: ContactMessage[];
}

/**
 * Generate pixel-perfect HTML for work details page
 */
export function generateWorkDetailHtml(work: Partial<LocalizedItem>, locale: 'tr' | 'en'): string {
  const isTr = locale === 'tr';
  const title = (isTr ? work.title?.tr : work.title?.en) || work.title?.tr || work.slug || '';
  const desc = (isTr ? work.excerpt?.tr : work.excerpt?.en) || work.excerpt?.tr || '';
  const homeLabel = isTr ? 'Anasayfa' : 'Home';
  const worksLabel = isTr ? 'İşler' : 'Works';
  const worksUrl = isTr ? '/tr/isler' : '/en/works';
  const homeUrl = isTr ? '/tr' : '/en';
  const donesLabel = isTr ? 'YAPILANLAR' : 'SERVICES';
  const clientLabel = isTr ? 'MÜŞTERİ' : 'CLIENT';
  const visitLabel = isTr ? 'Siteyi Ziyaret Et' : 'Visit Website';

  const tagsList = (work.tags || [])
    .map((t) => `<li><span>${t}</span></li>`)
    .join('');

  const galleryHtml = (work.gallery || [])
    .map(
      (img) => `
    <div class="col-lg-12 mb-30">
      <div class="portfolio-details-img">
        <img src="${img}" alt="${title}" style="width:100%; border-radius:12px; margin-bottom:20px;" />
      </div>
    </div>`
    )
    .join('');

  return `
<div class="breadcrumb-section" style="background-image:url(/assets/img/innerpage/breadcrumb-bg1.webp), linear-gradient(180deg, #121212 0%, #121212 100%)">
  <div class="container">
    <div class="row">
      <div class="col-lg-12">
        <div class="banner-wrapper">
          <div class="banner-content">
            <ul class="breadcrumb-list">
              <li><a href="${homeUrl}">${homeLabel}</a></li>
              <li><a href="${worksUrl}">${worksLabel}</a></li>
              <li>${title}</li>
            </ul>
            <h1>${title}</h1>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<div class="portfolio-details-page scroll-margin pt-120 mb-120" id="portfolio-details-section">
  <div class="container">
    <div class="row g-lg-4 gy-5 mb-80">
      <div class="col-lg-8">
        <div class="portfolio-details-content">
          <h3>${title}</h3>
          <div>
            ${desc.split('\n').map((p) => (p.trim() ? `<p>${p}</p>` : '')).join('')}
          </div>
          ${
            work.thumbnail
              ? `<div style="margin-top:30px; margin-bottom:30px;"><img src="${work.thumbnail}" alt="${title}" style="width:100%; border-radius:12px; object-fit:cover;" /></div>`
              : ''
          }
          <div class="row mt-4">
            ${galleryHtml}
          </div>
        </div>
      </div>
      <div class="col-lg-4">
        <div class="sidebar-area">
          ${
            tagsList
              ? `
          <div class="single-widget mb-30">
            <h5 class="widget-title">${donesLabel}</h5>
            <ul class="tag-list">
              ${tagsList}
            </ul>
          </div>`
              : ''
          }
          ${
            work.client
              ? `
          <div class="single-widget mb-30">
            <h5 class="widget-title">${clientLabel}</h5>
            <p style="color:#fff; font-weight:600;">${work.client}</p>
          </div>`
              : ''
          }
          ${
            work.website
              ? `
          <div class="single-widget mb-30">
            <a href="${work.website}" target="_blank" class="primary-btn2" style="width:100%; text-align:center; padding:12px;">
              <span>${visitLabel} ↗</span>
            </a>
          </div>`
              : ''
          }
        </div>
      </div>
    </div>
  </div>
</div>
`.trim();
}

/**
 * Generate pixel-perfect HTML for blog details page
 */
export function generateBlogDetailHtml(blog: Partial<LocalizedItem>, locale: 'tr' | 'en'): string {
  const isTr = locale === 'tr';
  const title = (isTr ? blog.title?.tr : blog.title?.en) || blog.title?.tr || blog.slug || '';
  const desc = (isTr ? blog.excerpt?.tr : blog.excerpt?.en) || blog.excerpt?.tr || '';
  const content = (isTr ? blog.tr?.html : blog.en?.html) || desc;
  const homeLabel = isTr ? 'Anasayfa' : 'Home';
  const blogLabel = 'Blog';
  const homeUrl = isTr ? '/tr' : '/en';
  const blogUrl = isTr ? '/tr/blog' : '/en/blog';
  const date = blog.date || '15/05/2024';

  return `
<div class="breadcrumb-section" style="background-image:url(/assets/img/innerpage/breadcrumb-bg1.webp), linear-gradient(180deg, #121212 0%, #121212 100%)">
  <div class="container">
    <div class="row">
      <div class="col-lg-12">
        <div class="banner-wrapper">
          <div class="banner-content">
            <ul class="breadcrumb-list">
              <li><a href="${homeUrl}">${homeLabel}</a></li>
              <li><a href="${blogUrl}">${blogLabel}</a></li>
              <li>${title}</li>
            </ul>
            <h1>${title}</h1>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<div class="blog-details scroll-margin pt-120 mb-120 style-6" id="blog-details">
  <div class="container">
    <div class="row">
      <div class="col-12">
        ${
          blog.thumbnail
            ? `
        <div class="blog-details-thumb text-center" style="margin-bottom:40px;">
          <img src="${blog.thumbnail}" alt="${title}" style="max-height:550px; width:auto; border-radius:16px; object-fit:cover;" />
        </div>`
            : ''
        }
        <div class="blog-details-author-meta" style="margin-bottom:30px; text-align:center; color:#9ca3af;">
          <span>📅 ${date}</span>
        </div>
      </div>
    </div>
    <div class="blog-details-content">
      <div class="row justify-content-center g-4">
        <div class="col-lg-8">
          <div class="blog-article-body" style="color:#e5e7eb; line-height:1.8; font-size:17px;">
            ${content}
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
`.trim();
}
