import { pool } from './db';
import {
  CoursePerformance,
  TeacherLoad,
  StudentAtRisk,
  RankStudent,
  AttendanceByGroup,
} from './definitions';

const ITEMS_PER_PAGE = 10;

export async function getCoursePerformance(term: string) {
  // Filtro
  const query = `
    SELECT * FROM vw_course_performance 
    WHERE term = $1
    ORDER BY course ASC
  `;
  const result = await pool.query<CoursePerformance>(query, [term]);
  return result.rows;
}

export async function getTeacherLoad(term: string, page: number = 1) {
  const offset = (page - 1) * ITEMS_PER_PAGE;
  
  // Paginación
  const query = `
    SELECT * FROM vw_teacher_load 
    WHERE term = $1
    ORDER BY teacher ASC
    LIMIT $2 OFFSET $3
  `;
  
  // Query para total de páginas
  const countQuery = `
    SELECT COUNT(*) FROM vw_teacher_load WHERE term = $1
  `;

  const [rows, countResult] = await Promise.all([
    pool.query<TeacherLoad>(query, [term, ITEMS_PER_PAGE, offset]),
    pool.query(countQuery, [term])
  ]);

  const totalPages = Math.ceil(Number(countResult.rows[0].count) / ITEMS_PER_PAGE);

  return {
    data: rows.rows,
    metadata: { valid_page: page, total_pages: totalPages }
  };
}

export async function getStudentsAtRisk(search: string = '', page: number = 1) {
  const offset = (page - 1) * ITEMS_PER_PAGE;
  
  // Búsqueda por nombre o email
  const query = `
    SELECT * FROM vw_students_at_risk 
    WHERE name ILIKE $1 OR email ILIKE $1
    ORDER BY avg_score ASC 
    LIMIT $2 OFFSET $3
  `;
  
  const countQuery = `
    SELECT COUNT(*) FROM vw_students_at_risk 
    WHERE name ILIKE $1 OR email ILIKE $1
  `;

  const searchTerm = `%${search}%`;

  const [rows, countResult] = await Promise.all([
    pool.query<StudentAtRisk>(query, [searchTerm, ITEMS_PER_PAGE, offset]),
    pool.query(countQuery, [searchTerm])
  ]);

  const totalPages = Math.ceil(Number(countResult.rows[0].count) / ITEMS_PER_PAGE);

  return {
    data: rows.rows,
    metadata: { valid_page: page, total_pages: totalPages }
  };
}

export async function getAttendanceByGroup(term: string) {
  const query = `
    SELECT * FROM vw_attendance_by_group 
    WHERE term = $1
    ORDER BY attendance_pct ASC
  `;
  const result = await pool.query<AttendanceByGroup>(query, [term]);
  return result.rows;
}

export async function getRankStudents(term: string, program: string) {
  // Filtros
  const query = `
    SELECT * FROM vw_rank_students 
    WHERE term = $1 AND program = $2
    ORDER BY ranking ASC
  `;
  const result = await pool.query<RankStudent>(query, [term, program]);
  return result.rows;
}
