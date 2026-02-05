import { Pool } from 'pg';

export const pool = new Pool({
  user: 'app_user',
  host: 'localhost',
  database: 'academia_db',
  password: 'app_secure_123',
  port: 5432,
});