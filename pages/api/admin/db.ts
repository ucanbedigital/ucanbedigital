import type { NextApiRequest, NextApiResponse } from 'next';
import { getDb, saveDb, DatabaseSchema } from '../../../lib/db';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '20mb',
    },
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'GET') {
      const db = getDb();
      return res.status(200).json(db);
    } else if (req.method === 'POST') {
      const updatedData: DatabaseSchema = req.body;
      if (!updatedData.site || !updatedData.pages) {
        return res.status(400).json({ message: 'Geçersiz veri yapısı' });
      }

      // Always save locally and sync grids
      saveDb(updatedData);

      let githubSynced = false;
      const githubToken = process.env.GITHUB_TOKEN;
      const githubRepo = process.env.GITHUB_REPO || 'ucanbedigital/ucanbedigital';

      if (githubToken) {
        try {
          const path = 'data/db.json';
          const apiUrl = `https://api.github.com/repos/${githubRepo}/contents/${path}`;

          // Get file SHA
          const getRes = await fetch(apiUrl, {
            headers: {
              Authorization: `Bearer ${githubToken}`,
              'User-Agent': 'UCANBE-CMS',
            },
          });

          let sha: string | undefined;
          if (getRes.ok) {
            const fileData = await getRes.json();
            sha = fileData.sha;
          }

          const content = Buffer.from(JSON.stringify(updatedData, null, 2)).toString('base64');
          const putRes = await fetch(apiUrl, {
            method: 'PUT',
            headers: {
              Authorization: `Bearer ${githubToken}`,
              'Content-Type': 'application/json',
              'User-Agent': 'UCANBE-CMS',
            },
            body: JSON.stringify({
              message: 'cms: update website database content',
              content,
              sha,
              branch: 'main',
            }),
          });

          if (putRes.ok) {
            githubSynced = true;
          } else {
            const err = await putRes.text();
            console.error('GitHub API error:', err);
          }
        } catch (ghErr) {
          console.error('GitHub commit exception:', ghErr);
        }
      }

      return res.status(200).json({
        success: true,
        message: 'İçerikler başarıyla kaydedildi!',
        githubSynced,
      });
    } else {
      return res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (err: any) {
    console.error('API /api/admin/db error:', err);
    return res.status(500).json({ message: err.message || 'Sunucu hatası' });
  }
}
