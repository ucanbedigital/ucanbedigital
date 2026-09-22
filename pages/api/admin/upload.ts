import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '15mb',
    },
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, data } = req.body;
    if (!name || !data) {
      return res.status(400).json({ error: 'Missing name or data' });
    }

    // Parse base64 string
    const matches = data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    let buffer: Buffer;
    let extension = 'jpg';

    if (matches && matches.length === 3) {
      const mimeType = matches[1];
      buffer = Buffer.from(matches[2], 'base64');
      if (mimeType.includes('png')) extension = 'png';
      else if (mimeType.includes('webp')) extension = 'webp';
      else if (mimeType.includes('svg')) extension = 'svg';
      else if (mimeType.includes('gif')) extension = 'gif';
    } else {
      // Raw base64
      buffer = Buffer.from(data, 'base64');
      const ext = path.extname(name).replace('.', '');
      if (ext) extension = ext.toLowerCase();
    }

    // Clean filename
    const cleanName = path
      .basename(name, path.extname(name))
      .replace(/[^a-zA-Z0-9_-]/g, '_')
      .slice(0, 50);

    const filename = `${Date.now()}_${cleanName}.${extension}`;
    const targetDir = path.join(process.cwd(), 'public', 'storage', 'uploads');
    const tmpDir = path.join('/tmp', 'storage', 'uploads');

    // Create directories
    try {
      fs.mkdirSync(targetDir, { recursive: true });
    } catch (e) {}

    try {
      fs.mkdirSync(tmpDir, { recursive: true });
    } catch (e) {}

    const localFilePath = path.join(targetDir, filename);
    const tmpFilePath = path.join(tmpDir, filename);

    try {
      fs.writeFileSync(localFilePath, buffer);
    } catch (err) {
      // Read-only filesystem in Vercel
    }

    try {
      fs.writeFileSync(tmpFilePath, buffer);
    } catch (err) {}

    // If GitHub token is present, commit file directly to GitHub
    const githubToken = process.env.GITHUB_TOKEN;
    const githubRepo = process.env.GITHUB_REPO || 'ucanbedigital/ucanbedigital';
    if (githubToken) {
      try {
        const ghPath = `public/storage/uploads/${filename}`;
        const b64Content = buffer.toString('base64');
        const ghUrl = `https://api.github.com/repos/${githubRepo}/contents/${ghPath}`;

        await fetch(ghUrl, {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${githubToken}`,
            'Content-Type': 'application/json',
            'User-Agent': 'UCANBE-CMS',
          },
          body: JSON.stringify({
            message: `upload: ${filename}`,
            content: b64Content,
            branch: 'main',
          }),
        });
      } catch (ghErr) {
        console.error('GitHub upload sync error:', ghErr);
      }
    }

    const publicUrl = `/storage/uploads/${filename}`;
    return res.status(200).json({ success: true, url: publicUrl, filename });
  } catch (error: any) {
    console.error('Upload handler error:', error);
    return res.status(500).json({ error: error.message || 'Upload failed' });
  }
}
