import fs from 'fs';
import path from 'path';
import { DatabaseSchema } from './types';

export * from './types';

const DB_PATH = path.join(process.cwd(), 'data', 'db.json');
const TMP_DB_PATH = path.join('/tmp', 'ucanbe_db.json');

export function getDb(): DatabaseSchema {
  if (fs.existsSync(TMP_DB_PATH)) {
    try {
      const data = fs.readFileSync(TMP_DB_PATH, 'utf-8');
      return JSON.parse(data);
    } catch (e) {
      // fallback
    }
  }

  if (fs.existsSync(DB_PATH)) {
    const data = fs.readFileSync(DB_PATH, 'utf-8');
    return JSON.parse(data);
  }

  return {
    site: {
      phone: '+90 (216) 804 55 52',
      email: 'info@ucanbedigital.com',
      address: {
        tr: 'Caferağa Mah. Şifa Sokak No:19 Kadıköy/İstanbul',
        en: 'Caferağa Mah. Şifa Sokak No:19 Kadıköy/İstanbul'
      },
      facebook: 'https://www.facebook.com/ucanbedigital',
      twitter: 'https://x.com/ucanbedigital',
      linkedin: 'https://www.linkedin.com/company/u-can-be-digital/',
      instagram: 'https://www.instagram.com/ucanbedigital/'
    },
    works: [],
    services: [],
    blogs: [],
    pages: {},
    inbox: []
  };
}

/**
 * Regenerate portfolio grid HTML for works_tr and works_en
 */
export function syncWorksGrid(db: DatabaseSchema): void {
  const sortedWorks = [...(db.works || [])].sort((a, b) => (a.order ?? 999) - (b.order ?? 999));

  (['tr', 'en'] as const).forEach((loc) => {
    const pageKey = 'works_' + loc;
    const isTr = loc === 'tr';
    const basePath = isTr ? '/tr/isler' : '/en/works';
    const currentPage = db.pages[pageKey];
    if (!currentPage) return;

    const cardsHtml = sortedWorks
      .map((w, idx) => {
        const title = (isTr ? w.title?.tr : w.title?.en) || w.title?.tr || w.slug;
        const thumb = w.thumbnail || '/assets/img/innerpage/breadcrumb-bg1.webp';
        const tags = (w.tags || [])
          .map((t) => `<li><span>${t}</span></li>`)
          .join('');
        const delay = ((idx % 3) + 1) * 200;

        return `
<div class="col-xl-4 col-md-6 wow animate fadeInDown" data-wow-delay="${delay}ms" data-wow-duration="1500ms">
  <a href="${basePath}/${w.slug}">
    <div class="eg-card2">
      <div class="card-img">
        <img src="${thumb}" alt="${title}"/>
      </div>
      <div class="card-content">
        <h5>${title}</h5>
        <ul class="tag-list">
          ${tags}
        </ul>
      </div>
    </div>
  </a>
</div>`.trim();
      })
      .join('\n');

    // Replace inside <div class="row g-4 mb-50"> ... </div>
    const gridStart = currentPage.html.indexOf('<div class="row g-4 mb-50">');
    if (gridStart !== -1) {
      const endMarker = '</div></div></div>'; // end of row and container
      const gridEnd = currentPage.html.indexOf(endMarker, gridStart);
      if (gridEnd !== -1) {
        currentPage.html =
          currentPage.html.substring(0, gridStart + '<div class="row g-4 mb-50">'.length) +
          '\n' +
          cardsHtml +
          '\n' +
          currentPage.html.substring(gridEnd);
      }
    }
  });
}

/**
 * Regenerate blog grid HTML for blog_tr and blog_en
 */
export function syncBlogsGrid(db: DatabaseSchema): void {
  const sortedBlogs = [...(db.blogs || [])].sort((a, b) => (a.order ?? 999) - (b.order ?? 999));

  (['tr', 'en'] as const).forEach((loc) => {
    const pageKey = 'blog_' + loc;
    const isTr = loc === 'tr';
    const basePath = isTr ? '/tr/blog' : '/en/blog';
    const currentPage = db.pages[pageKey];
    if (!currentPage) return;

    const cardsHtml = sortedBlogs
      .map((b, idx) => {
        const title = (isTr ? b.title?.tr : b.title?.en) || b.title?.tr || b.slug;
        const thumb = b.thumbnail || '/assets/img/innerpage/breadcrumb-bg1.webp';
        const date = b.date || '15/05/2024';
        const delay = ((idx % 2) + 1) * 200;

        return `
<div class="col-lg-6 col-md-6 wow animate fadeInDown" data-wow-delay="${delay}ms" data-wow-duration="1500ms">
  <div class="eg-card1">
    <div class="card-img-wrap">
      <a title="${title}" class="card-img" href="${basePath}/${b.slug}">
        <img src="${thumb}" alt="${title}"/>
      </a>
      <div class="date"><span>${date}</span></div>
    </div>
    <div class="card-content">
      <h4><a title="${title}" href="${basePath}/${b.slug}">${title}</a></h4>
    </div>
  </div>
</div>`.trim();
      })
      .join('\n');

    const gridStart = currentPage.html.indexOf('<div class="row g-4 mb-50">');
    if (gridStart !== -1) {
      const endMarker = '</div></div></div>';
      const gridEnd = currentPage.html.indexOf(endMarker, gridStart);
      if (gridEnd !== -1) {
        currentPage.html =
          currentPage.html.substring(0, gridStart + '<div class="row g-4 mb-50">'.length) +
          '\n' +
          cardsHtml +
          '\n' +
          currentPage.html.substring(gridEnd);
      }
    }
  });
}

export function saveDb(data: DatabaseSchema): void {
  // Sync grids so listing pages always match works/blogs
  try {
    syncWorksGrid(data);
    syncBlogsGrid(data);
  } catch (e) {
    console.error('Grid sync error:', e);
  }

  const jsonStr = JSON.stringify(data, null, 2);

  try {
    fs.writeFileSync(DB_PATH, jsonStr, 'utf-8');
  } catch (err) {
    // In Vercel serverless environment, local filesystem is read-only
  }

  try {
    fs.writeFileSync(TMP_DB_PATH, jsonStr, 'utf-8');
  } catch (err) {
    // ignore
  }
}
