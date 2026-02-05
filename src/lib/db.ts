import { Pool } from 'pg';

export const pool = new Pool({
  user: 'app_escenario',
  host: 'localhost',
  database: 'academia_db',
  password: 'app_pass_123',
  port: 5432,
});