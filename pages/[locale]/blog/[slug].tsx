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
  const slug = params?.slug as string;
  const db = getDb();
  const item = db.blogs.find((x: any) => x.slug === slug);

  if (!item) {
    return { notFound: true };
  }

  const itemData = item[locale]?.html ? item[locale] : item.tr;

  return {
    props: {
      settings: db.site,
      locale,
      blogHtml: itemData?.html || '',
      meta: itemData?.meta || null,
    },
  };
};
