import { GetServerSideProps } from 'next';
import Layout from '../../../components/Layout';
import { getDb, SiteSettings } from '../../../lib/db';

interface DetailProps {
  settings: SiteSettings;
  locale: 'tr' | 'en';
  serviceHtml?: string;
  meta?: any;
}

export default function ServiceDetailPageEn({
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
  const slug = params?.slug as string;
  const db = getDb();
  const item = db.services.find((x: any) => x.slug === slug);

  if (!item) {
    return { notFound: true };
  }

  const itemData = item[locale]?.html ? item[locale] : item.tr;

  return {
    props: {
      settings: db.site,
      locale,
      serviceHtml: itemData?.html || '',
      meta: itemData?.meta || null,
    },
  };
};
