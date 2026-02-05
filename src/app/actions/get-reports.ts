'use server'
import { pool } from '@/lib/db';

export async function getRiskStudents(page: number = 1) {
  const limit = 5;
  const offset = (page - 1) * limit;
  
  // Consulta para evitar inyecciones SQL
  const res = await pool.query(
    'SELECT * FROM vw_students_at_risk LIMIT $1 OFFSET $2', 
    [limit, offset]
  );
  return res.rows;
}