import type { NextApiRequest, NextApiResponse } from 'next';
import { getDb, saveDb, ContactMessage } from '../../lib/db';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const db = getDb();
    const newMessage: ContactMessage = {
      id: Date.now().toString(),
      name,
      email,
      phone: phone || '',
      subject: subject || 'Genel İletişim',
      message,
      date: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };

    db.messages = [newMessage, ...(db.messages || [])];
    saveDb(db);

    return res.status(200).json({ success: true, message: 'Message saved successfully' });
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
}
