'use server'
import { pool } from '@/lib/db';
import { z } from 'zod';

const programWhitelist = ['Sistemas', 'Derecho', 'Medicina'];

export async function getRankings(program: string) {
  const schema = z.string().refine(val => programWhitelist.includes(val));
  const validatedProgram = schema.parse(program);

  const res = await pool.query(
    'SELECT * FROM vw_rank_students WHERE program = $1', 
    [validatedProgram]
  );
  return res.rows;
}