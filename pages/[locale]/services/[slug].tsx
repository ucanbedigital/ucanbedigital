import { GetServerSideProps } from 'next';
import Layout from '../../../components/Layout';
import { getDb, DatabaseSchema } from '../../../lib/db';

export default function ServiceDetailPage({
  db,
  locale,
  serviceHtml,
  meta,
}: {
  db: DatabaseSchema;
  locale: 'tr' | 'en';
  serviceHtml?: string;
  meta?: any;
}) {
  return (
    <Layout
      meta={meta}
      settings={db.site}
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
  const service = db.services.find((s) => s.slug === slug);

  if (!service) {
    return { notFound: true };
  }

  const serviceData = service[locale]?.html ? service[locale] : service.tr;

  return {
    props: {
      db,
      locale,
      serviceHtml: serviceData?.html || '',
      meta: serviceData?.meta || null,
    },
  };
};
