 import { pool } from './db';
import {
  CoursePerformance,
  TeacherLoad,
  StudentAtRisk,
  RankStudent,
  AttendanceByGroup,
  CoursePerformanceResponse,
  StudentsAtRiskResponse,
  AttendanceResponse,
} from './definitions';
import { APP_CONFIG } from './constants';

const ITEMS_PER_PAGE = APP_CONFIG.PAGINATION.ITEMS_PER_PAGE;

export async function getCoursePerformance(term: string): Promise<CoursePerformanceResponse> {
  // Filtro
  const query = `
    SELECT * FROM vw_course_performance 
    WHERE term = $1
    ORDER BY course ASC
  `;
  const result = await pool.query<CoursePerformance>(query, [term]);
  const rows = result.rows;

  // KPIs
  const totalFailed = rows.reduce((acc, curr) => acc + Number(curr.failed_count), 0);
  const globalAvg = rows.length > 0
    ? (rows.reduce((acc, curr) => acc + Number(curr.avg_grade), 0) / rows.length).toFixed(2)
    : '-';

  return {
    data: rows,
    kpis: { globalAvg, totalFailed }
  };
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

export async function getStudentsAtRisk(search: string = '', page: number = 1): Promise<StudentsAtRiskResponse> {
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

  const [rowsResult, countResult] = await Promise.all([
    pool.query(query, [searchTerm, ITEMS_PER_PAGE, offset]),
    pool.query(countQuery, [searchTerm])
  ]);

  const data: StudentAtRisk[] = rowsResult.rows.map(student => {
    const isGradeRisk = Number(student.avg_score) < APP_CONFIG.THRESHOLDS.GRADE_RISK;
    const isAttendanceRisk = Number(student.attendance_rate) < APP_CONFIG.THRESHOLDS.ATTENDANCE_RISK;
    
    let mainCause = 'Inasistencias';
    if (isGradeRisk && isAttendanceRisk) mainCause = 'Académico y Asistencia';
    else if (isGradeRisk) mainCause = 'Bajo Rendimiento';

    return {
      ...student,
      avg_score: Number(student.avg_score),
      attendance_rate: Number(student.attendance_rate),
      isGradeRisk,
      isAttendanceRisk,
      mainCause
    };
  });

  const totalPages = Math.ceil(Number(countResult.rows[0].count) / ITEMS_PER_PAGE);

  return {
    data,
    metadata: { valid_page: page, total_pages: totalPages }
  };
}

export async function getAttendanceByGroup(term: string): Promise<AttendanceResponse> {
  const query = `
    SELECT * FROM vw_attendance_by_group 
    WHERE term = $1
    ORDER BY attendance_pct ASC
  `;
  const result = await pool.query<AttendanceByGroup>(query, [term]);
  const rows = result.rows;

  // KPIs
  const lowAttendanceGroups = rows.filter(g => Number(g.attendance_pct) < APP_CONFIG.THRESHOLDS.LOW_ATTENDANCE_GROUP).length;
  const bestGroup = rows.length > 0 ? rows[rows.length - 1] : null;

  return {
    data: rows,
    kpis: { lowAttendanceGroups, bestGroup }
  };
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
