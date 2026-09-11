import { GetServerSideProps } from 'next';
import Layout from '../../../components/Layout';
import { getDb, DatabaseSchema } from '../../../lib/db';

export default function BlogDetailPage({
  db,
  locale,
  blogHtml,
  meta,
}: {
  db: DatabaseSchema;
  locale: 'tr' | 'en';
  blogHtml?: string;
  meta?: any;
}) {
  return (
    <Layout
      meta={meta}
      settings={db.site}
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
  const blog = db.blogs.find((b) => b.slug === slug);

  if (!blog) {
    return { notFound: true };
  }

  const blogData = blog[locale]?.html ? blog[locale] : blog.tr;

  return {
    props: {
      db,
      locale,
      blogHtml: blogData?.html || '',
      meta: blogData?.meta || null,
    },
  };
};
