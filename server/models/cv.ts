import { v4 as uuidv4 } from 'uuid';
import pool from '../db/connection';

export interface CV {
  id: string;
  userId: string;
  originalFilename: string;
  fileUrl: string;
  status: 'Processing' | 'Branded';
  createdAt: Date;
}

export async function createCV(
  userId: string,
  originalFilename: string,
  fileUrl: string
): Promise<CV> {
  const id = uuidv4();

  await pool.execute(
    'INSERT INTO cvs (id, user_id, original_filename, file_url) VALUES (?, ?, ?, ?)',
    [id, userId, originalFilename, fileUrl]
  );

  return {
    id,
    userId,
    originalFilename,
    fileUrl,
    status: 'Processing',
    createdAt: new Date(),
  };
}

export async function getCVsByUserId(userId: string): Promise<CV[]> {
  const [rows] = await pool.execute(
    'SELECT * FROM cvs WHERE user_id = ? ORDER BY created_at DESC',
    [userId]
  );
  return rows as CV[];
}

export async function updateCVStatus(
  id: string,
  status: 'Processing' | 'Branded'
): Promise<void> {
  await pool.execute('UPDATE cvs SET status = ? WHERE id = ?', [status, id]);
}