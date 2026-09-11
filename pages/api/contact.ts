import type { NextApiRequest, NextApiResponse } from 'next';
import { getDb, saveDb } from '../../lib/db';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { name, email, phone, subject, message } = req.body;

    const db = getDb();
    const newMessage = {
      id: Date.now().toString(),
      name: name || 'Anonim',
      email: email || '',
      phone: phone || '',
      subject: subject || 'Genel İletişim',
      message: message || '',
      date: new Date().toLocaleString('tr-TR', { timeZone: 'Europe/Istanbul' }),
    };

    if (!db.inbox) db.inbox = [];
    db.inbox.unshift(newMessage);
    saveDb(db);

    return res.status(200).json({ success: true, message: 'Mesajınız başarıyla iletildi.' });
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
}
