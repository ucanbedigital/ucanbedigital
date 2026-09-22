import fs from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'data', 'db.json');
const TMP_DB_PATH = path.join('/tmp', 'ucanbe_db.json');

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
  tr: PageContent;
  en: PageContent;
}

export interface SiteSettings {
  phone: string;
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

export function saveDb(data: DatabaseSchema): void {
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
