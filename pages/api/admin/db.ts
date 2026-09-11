import type { NextApiRequest, NextApiResponse } from 'next';
import { getDb, saveDb, DatabaseSchema } from '../../../lib/db';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'GET') {
      const db = getDb();
      return res.status(200).json(db);
    } else if (req.method === 'POST') {
      const updatedData: DatabaseSchema = req.body;
      if (!updatedData.settings || !updatedData.home) {
        return res.status(400).json({ message: 'Invalid database payload' });
      }
      saveDb(updatedData);
      return res.status(200).json({ success: true, message: 'Database updated successfully' });
    } else {
      return res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
}
