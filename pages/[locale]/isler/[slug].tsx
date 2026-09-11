import { GetServerSideProps } from 'next';
import Layout from '../../../components/Layout';
import { getDb, SiteSettings } from '../../../lib/db';

interface DetailProps {
  settings: SiteSettings;
  locale: 'tr' | 'en';
  workHtml?: string;
  meta?: any;
}

export default function WorkDetailPageTr({
  settings,
  locale,
  workHtml,
  meta,
}: DetailProps) {
  return (
    <Layout
      meta={meta}
      settings={settings}
      locale={locale}
      isInner={true}
      rawHtml={workHtml}
    />
  );
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const locale = (params?.locale === 'en' ? 'en' : 'tr') as 'tr' | 'en';
  const slug = params?.slug as string;
  const db = getDb();
  const item = db.works.find((x: any) => x.slug === slug);

  if (!item) {
    return { notFound: true };
  }

  const itemData = item[locale]?.html ? item[locale] : item.tr;

  return {
    props: {
      settings: db.site,
      locale,
      workHtml: itemData?.html || '',
      meta: itemData?.meta || null,
    },
  };
};
