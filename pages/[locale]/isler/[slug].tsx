import { GetServerSideProps } from 'next';
import Layout from '../../../components/Layout';
import { getDb, DatabaseSchema } from '../../../lib/db';

export default function WorkDetailPage({
  db,
  locale,
  workHtml,
  meta,
}: {
  db: DatabaseSchema;
  locale: 'tr' | 'en';
  workHtml?: string;
  meta?: any;
}) {
  return (
    <Layout
      meta={meta}
      settings={db.site}
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
  const work = db.works.find((w) => w.slug === slug);

  if (!work) {
    return { notFound: true };
  }

  const workData = work[locale]?.html ? work[locale] : work.tr;

  return {
    props: {
      db,
      locale,
      workHtml: workData?.html || '',
      meta: workData?.meta || null,
    },
  };
};
