import { v4 as uuidv4 } from 'uuid';
import pool from '../db/connection';

export interface Organization {
  id: string;
  userId: string;
  logoUrl: string | null;
  primaryColor: string;
  secondaryColor: string;
  font: string;
  cvTemplateUrl: string | null;
}

export async function getOrganization(userId: string): Promise<Organization | null> {
  const [rows] = await pool.execute(
    'SELECT * FROM organizations WHERE user_id = ?',
    [userId]
  );
  return (rows as Organization[])[0] || null;
}

export async function createOrganization(userId: string): Promise<Organization> {
  const id = uuidv4();

  await pool.execute(
    'INSERT INTO organizations (id, user_id) VALUES (?, ?)',
    [id, userId]
  );

  return {
    id,
    userId,
    logoUrl: null,
    primaryColor: '#2563eb',
    secondaryColor: '#1e40af',
    font: 'Inter',
    cvTemplateUrl: null,
  };
}

export async function updateOrganization(
  userId: string,
  data: Partial<Organization>
): Promise<void> {
  const fields = Object.keys(data)
    .map((key) => `${key} = ?`)
    .join(', ');
  const values = [...Object.values(data), userId];

  await pool.execute(
    `UPDATE organizations SET ${fields} WHERE user_id = ?`,
    values
  );
}