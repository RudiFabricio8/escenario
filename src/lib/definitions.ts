import { z } from 'zod';

export const TermFilterSchema = z.string().min(1, "El periodo es obligatorio");
export const ProgramFilterSchema = z.enum(["ISC", "IND", "MEC", "ADM"]);
export const SearchSchema = z.string().min(3, "Mínimo 3 caracteres para buscar");
export const PaginationSchema = z.object({
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(50).default(10),
});

export const CoursePerformanceSchema = z.object({
  course: z.string(),
  term: z.string(),
  avg_grade: z.coerce.number(),
  failed_count: z.coerce.number(),
});
export type CoursePerformance = z.infer<typeof CoursePerformanceSchema>;
export interface CoursePerformanceResponse {
  data: CoursePerformance[];
  kpis: {
    globalAvg: string;
    totalFailed: number;
  };
}

export const TeacherLoadSchema = z.object({
  teacher: z.string(),
  term: z.string(),
  group_count: z.coerce.number(),
  total_students: z.coerce.number(),
});
export type TeacherLoad = z.infer<typeof TeacherLoadSchema>;

export const StudentAtRiskSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  avg_score: z.coerce.number(),
  attendance_rate: z.coerce.number(),
});
export type StudentAtRisk = z.infer<typeof StudentAtRiskSchema> & {
  isGradeRisk: boolean;
  isAttendanceRisk: boolean;
  mainCause: string;
};
export interface StudentsAtRiskResponse {
  data: StudentAtRisk[];
  metadata: {
    valid_page: number;
    total_pages: number;
  };
}

export const RankStudentSchema = z.object({
  name: z.string(),
  program: z.string(),
  term: z.string(),
  score: z.coerce.number(),
  ranking: z.coerce.number(),
});
export type RankStudent = z.infer<typeof RankStudentSchema>;

export const AttendanceByGroupSchema = z.object({
  term: z.string(),
  course: z.string(),
  teacher: z.string(),
  attendance_pct: z.coerce.number(),
});
export type AttendanceByGroup = z.infer<typeof AttendanceByGroupSchema>;
export interface AttendanceResponse {
  data: AttendanceByGroup[];
  kpis: {
    lowAttendanceGroups: number;
    bestGroup: AttendanceByGroup | null;
  };
}
