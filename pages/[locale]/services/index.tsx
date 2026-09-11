import { GetServerSideProps } from 'next';
import Layout from '../../../components/Layout';
import { getDb, DatabaseSchema } from '../../../lib/db';

export default function ServicesIndex({ db, locale }: { db: DatabaseSchema; locale: 'tr' | 'en' }) {
  const pageKey = locale === 'tr' ? 'services_tr' : 'services_en';
  const page = db.pages[pageKey];

  return (
    <Layout
      meta={page?.meta}
      settings={db.site}
      locale={locale}
      isInner={true}
      rawHtml={page?.html}
    />
  );
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const locale = (params?.locale === 'en' ? 'en' : 'tr') as 'tr' | 'en';
  const db = getDb();
  return {
    props: {
      db,
      locale,
    },
  };
};
