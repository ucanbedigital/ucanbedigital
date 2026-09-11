import { GetServerSideProps } from 'next';
import Layout from '../../../../components/Layout';
import { getDb, DatabaseSchema } from '../../../../lib/db';
import fs from 'fs';
import path from 'path';

export default function BlogPaginationPage({
  db,
  locale,
  rawHtml,
  meta,
}: {
  db: DatabaseSchema;
  locale: 'tr' | 'en';
  rawHtml?: string;
  meta?: any;
}) {
  return (
    <Layout
      meta={meta}
      settings={db.site}
      locale={locale}
      isInner={true}
      rawHtml={rawHtml}
    />
  );
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const locale = (params?.locale === 'en' ? 'en' : 'tr') as 'tr' | 'en';
  const pageNum = params?.page as string;
  const db = getDb();

  const fileName = `${locale}__blog__page__${pageNum}.html`;
  const filePath = path.join(process.cwd(), 'crawled_pages', fileName);

  let rawHtml = '';
  let meta = null;

  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const idx_head = content.indexOf('</header>') !== -1 ? content.indexOf('</header>') + 9 : 0;
    const idx_foot = content.indexOf('<footer') !== -1 ? content.indexOf('<footer') : content.length;
    rawHtml = content.substring(idx_head, idx_foot).replace(/<!--\$-->|<!--\/\$-->/g, '').trim();
  } else {
    const pageKey = locale === 'tr' ? 'blog_tr' : 'blog_en';
    rawHtml = db.pages[pageKey]?.html || '';
    meta = db.pages[pageKey]?.meta || null;
  }

  return {
    props: {
      db,
      locale,
      rawHtml,
      meta,
    },
  };
};
