import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';
import pool from '../db/connection';

export interface User {
  id: string;
  username: string;
  email: string;
  password?: string;
}

export async function createUser(
  username: string,
  email: string,
  password: string
): Promise<User> {
  const hashedPassword = await bcrypt.hash(password, 10);
  const id = uuidv4();

  const [result] = await pool.execute(
    'INSERT INTO users (id, username, email, password) VALUES (?, ?, ?, ?)',
    [id, username, email, hashedPassword]
  );

  return { id, username, email };
}

export async function findUserByUsername(username: string): Promise<User | null> {
  const [rows] = await pool.execute(
    'SELECT * FROM users WHERE username = ?',
    [username]
  );
  return (rows as User[])[0] || null;
}

export async function validatePassword(
  user: User,
  password: string
): Promise<boolean> {
  return bcrypt.compare(password, user.password!);
}