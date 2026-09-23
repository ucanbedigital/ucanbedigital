const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://ucanbedigital.com';
const dbPath = path.join(__dirname, '..', 'data', 'db.json');
const sitemapPath = path.join(__dirname, '..', 'public', 'sitemap.xml');
const robotsPath = path.join(__dirname, '..', 'public', 'robots.txt');

const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
const today = new Date().toISOString().split('T')[0];

const urls = [];

// Static Pages
urls.push({
  loc: `${BASE_URL}/`,
  tr: `${BASE_URL}/tr`,
  en: `${BASE_URL}/en`,
  priority: '1.0',
  changefreq: 'daily',
});

urls.push({
  loc: `${BASE_URL}/tr`,
  tr: `${BASE_URL}/tr`,
  en: `${BASE_URL}/en`,
  priority: '1.0',
  changefreq: 'daily',
});

urls.push({
  loc: `${BASE_URL}/en`,
  tr: `${BASE_URL}/tr`,
  en: `${BASE_URL}/en`,
  priority: '1.0',
  changefreq: 'daily',
});

const staticPairs = [
  { tr: 'hakkimizda', en: 'about-us', priority: '0.8', changefreq: 'weekly' },
  { tr: 'hizmetlerimiz', en: 'services', priority: '0.9', changefreq: 'weekly' },
  { tr: 'isler', en: 'works', priority: '0.9', changefreq: 'weekly' },
  { tr: 'blog', en: 'blog', priority: '0.8', changefreq: 'daily' },
  { tr: 'iletisim', en: 'contact', priority: '0.8', changefreq: 'monthly' },
];

for (const pair of staticPairs) {
  urls.push({
    loc: `${BASE_URL}/tr/${pair.tr}`,
    tr: `${BASE_URL}/tr/${pair.tr}`,
    en: `${BASE_URL}/en/${pair.en}`,
    priority: pair.priority,
    changefreq: pair.changefreq,
  });
  urls.push({
    loc: `${BASE_URL}/en/${pair.en}`,
    tr: `${BASE_URL}/tr/${pair.tr}`,
    en: `${BASE_URL}/en/${pair.en}`,
    priority: pair.priority,
    changefreq: pair.changefreq,
  });
}

// Dynamic Works (73 works)
for (const work of (db.works || [])) {
  if (!work.slug) continue;
  const slugTr = encodeURI(work.slug);
  const slugEn = encodeURI(work.slug_en || work.slug);
  urls.push({
    loc: `${BASE_URL}/tr/isler/${slugTr}`,
    tr: `${BASE_URL}/tr/isler/${slugTr}`,
    en: `${BASE_URL}/en/works/${slugEn}`,
    priority: '0.7',
    changefreq: 'weekly',
  });
  urls.push({
    loc: `${BASE_URL}/en/works/${slugEn}`,
    tr: `${BASE_URL}/tr/isler/${slugTr}`,
    en: `${BASE_URL}/en/works/${slugEn}`,
    priority: '0.7',
    changefreq: 'weekly',
  });
}

// Dynamic Services (50 services)
for (const s of (db.services || [])) {
  if (!s.slug) continue;
  const slugTr = encodeURI(s.slug);
  const slugEn = encodeURI(s.slug_en || s.slug);
  urls.push({
    loc: `${BASE_URL}/tr/hizmetlerimiz/${slugTr}`,
    tr: `${BASE_URL}/tr/hizmetlerimiz/${slugTr}`,
    en: `${BASE_URL}/en/services/${slugEn}`,
    priority: '0.7',
    changefreq: 'weekly',
  });
  urls.push({
    loc: `${BASE_URL}/en/services/${slugEn}`,
    tr: `${BASE_URL}/tr/hizmetlerimiz/${slugTr}`,
    en: `${BASE_URL}/en/services/${slugEn}`,
    priority: '0.7',
    changefreq: 'weekly',
  });
}

// Dynamic Blogs (18 blogs)
for (const b of (db.blogs || [])) {
  if (!b.slug) continue;
  const slugTr = encodeURI(b.slug);
  const slugEn = encodeURI(b.slug_en || b.slug);
  urls.push({
    loc: `${BASE_URL}/tr/blog/${slugTr}`,
    tr: `${BASE_URL}/tr/blog/${slugTr}`,
    en: `${BASE_URL}/en/blog/${slugEn}`,
    priority: '0.6',
    changefreq: 'monthly',
  });
  urls.push({
    loc: `${BASE_URL}/en/blog/${slugEn}`,
    tr: `${BASE_URL}/tr/blog/${slugTr}`,
    en: `${BASE_URL}/en/blog/${slugEn}`,
    priority: '0.6',
    changefreq: 'monthly',
  });
}

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls
  .map(
    (u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
    <xhtml:link rel="alternate" hreflang="tr" href="${u.tr}" />
    <xhtml:link rel="alternate" hreflang="en" href="${u.en}" />
  </url>`
  )
  .join('\n')}
</urlset>
`;

fs.writeFileSync(sitemapPath, xml.trim(), 'utf8');
console.log(`Generated sitemap with ${urls.length} URLs at ${sitemapPath}`);

const robots = `User-agent: *
Allow: /

Sitemap: ${BASE_URL}/sitemap.xml
`;

fs.writeFileSync(robotsPath, robots.trim() + '\n', 'utf8');
console.log(`Generated robots.txt at ${robotsPath}`);
