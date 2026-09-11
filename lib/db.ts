import fs from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'data', 'db.json');
const TMP_DB_PATH = path.join('/tmp', 'ucanbe_db.json');

export interface LocalizedString {
  tr: string;
  en: string;
}

export interface SiteSettings {
  siteName: string;
  phone: string;
  email: string;
  address: LocalizedString;
  socials: {
    facebook: string;
    twitter: string;
    linkedin: string;
    instagram: string;
  };
  logoDark: string;
  logoLight: string;
  footerLogoBg: string;
  tagline: LocalizedString;
  footerText: LocalizedString;
}

export interface StatItem {
  number: string;
  label: LocalizedString;
  sublabel: LocalizedString;
}

export interface FeatureItem {
  icon: string;
  title: LocalizedString;
  desc: LocalizedString;
}

export interface HomeData {
  hero: {
    title: LocalizedString;
    description: LocalizedString;
    image: string;
    buttonText: LocalizedString;
    buttonLink: LocalizedString;
  };
  about: {
    badge: string;
    title: LocalizedString;
    description: LocalizedString;
    stats: StatItem[];
    features: FeatureItem[];
  };
}

export interface ServiceItem {
  id: string;
  slug: LocalizedString;
  title: LocalizedString;
  shortDesc: LocalizedString;
  content: LocalizedString;
  icon: string;
}

export interface WorkItem {
  id: string;
  slug: LocalizedString;
  title: string | LocalizedString;
  category: LocalizedString;
  image: string;
  client: string;
  year: string;
  description: LocalizedString;
  content: LocalizedString;
}

export interface BlogItem {
  id: string;
  slug: LocalizedString;
  title: LocalizedString;
  excerpt: LocalizedString;
  content: LocalizedString;
  image: string;
  author: string;
  date: string;
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
  settings: SiteSettings;
  home: HomeData;
  services: ServiceItem[];
  works: WorkItem[];
  blogs: BlogItem[];
  messages: ContactMessage[];
}

export function getDb(): DatabaseSchema {
  // Check tmp override first (for Vercel serverless runtime mutations)
  if (fs.existsSync(TMP_DB_PATH)) {
    try {
      const data = fs.readFileSync(TMP_DB_PATH, 'utf-8');
      return JSON.parse(data);
    } catch (e) {
      // Fallback
    }
  }

  if (fs.existsSync(DB_PATH)) {
    const data = fs.readFileSync(DB_PATH, 'utf-8');
    return JSON.parse(data);
  }

  throw new Error('Database file does not exist. Run init_db.py first.');
}

export function saveDb(data: DatabaseSchema): void {
  const jsonStr = JSON.stringify(data, null, 2);

  // Try local first
  try {
    fs.writeFileSync(DB_PATH, jsonStr, 'utf-8');
  } catch (err) {
    // In Vercel serverless environment, local filesystem is read-only, write to /tmp
  }

  try {
    fs.writeFileSync(TMP_DB_PATH, jsonStr, 'utf-8');
  } catch (err) {
    // ignore
  }
}
