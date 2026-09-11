import { GetServerSideProps } from 'next';
import Layout from '../../../components/Layout';
import { getDb, SiteSettings } from '../../../lib/db';

interface PageData {
  html?: string;
  meta?: {
    title?: string;
    description?: string;
  };
}

interface PageProps {
  settings: SiteSettings;
  page: PageData | null;
  locale: 'tr' | 'en';
}

export default function ServicesIndexEn({ settings, page, locale }: PageProps) {
  return (
    <Layout
      meta={page?.meta}
      settings={settings}
      locale={locale}
      isInner={true}
      rawHtml={page?.html}
    />
  );
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const locale = (params?.locale === 'en' ? 'en' : 'tr') as 'tr' | 'en';
  const db = getDb();
  const pageKey = 'services_' + locale;
  const page = db.pages[pageKey] || null;

  return {
    props: {
      settings: db.site,
      page,
      locale,
    },
  };
};
