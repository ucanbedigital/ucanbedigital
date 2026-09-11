import { GetServerSideProps } from 'next';
import Layout from '../../../components/Layout';
import { getDb, SiteSettings } from '../../../lib/db';

interface DetailProps {
  settings: SiteSettings;
  locale: 'tr' | 'en';
  serviceHtml?: string;
  meta?: any;
}

export default function ServiceDetailPageTr({
  settings,
  locale,
  serviceHtml,
  meta,
}: DetailProps) {
  return (
    <Layout
      meta={meta}
      settings={settings}
      locale={locale}
      isInner={true}
      rawHtml={serviceHtml}
    />
  );
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const locale = (params?.locale === 'en' ? 'en' : 'tr') as 'tr' | 'en';
  const rawSlug = params?.slug as string;
  const slug = decodeURIComponent(rawSlug).toLowerCase();
  const db = getDb();
  const item: any = db.services.find((x: any) => x.slug?.toLowerCase() === slug);

  if (!item) {
    return { notFound: true };
  }

  const itemData: any = (item[locale]?.html ? item[locale] : (item.tr?.html ? item.tr : item.en)) || {};

  return {
    props: {
      settings: db.site,
      locale,
      serviceHtml: itemData?.html || '',
      meta: itemData?.meta || null,
    },
  };
};
