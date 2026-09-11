import { GetServerSideProps } from 'next';
import Layout from '../../../components/Layout';
import { getDb, SiteSettings } from '../../../lib/db';

interface DetailProps {
  settings: SiteSettings;
  locale: 'tr' | 'en';
  blogHtml?: string;
  meta?: any;
}

export default function BlogDetailPage({
  settings,
  locale,
  blogHtml,
  meta,
}: DetailProps) {
  return (
    <Layout
      meta={meta}
      settings={settings}
      locale={locale}
      isInner={true}
      rawHtml={blogHtml}
    />
  );
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const locale = (params?.locale === 'en' ? 'en' : 'tr') as 'tr' | 'en';
  const rawSlug = params?.slug as string;
  const slug = decodeURIComponent(rawSlug).toLowerCase();
  const db = getDb();
  const item: any = db.blogs.find((x: any) => x.slug?.toLowerCase() === slug);

  if (!item) {
    return { notFound: true };
  }

  const itemData: any = (item[locale]?.html ? item[locale] : (item.tr?.html ? item.tr : item.en)) || {};

  return {
    props: {
      settings: db.site,
      locale,
      blogHtml: itemData?.html || '',
      meta: itemData?.meta || null,
    },
  };
};
