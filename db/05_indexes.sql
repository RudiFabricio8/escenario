-- puente entre comnsultas
CREATE INDEX idx_enrollments_group_id ON enrollments(group_id);
-- Agragación para asistencias
CREATE INDEX idx_attendance_enroll_present ON attendance(enrollment_id, present);
-- Partición por programa
CREATE INDEX idx_students_program ON students(program);