CREATE USER app_user WITH PASSWORD 'app_secure_123';
GRANT CONNECT ON DATABASE academia_db TO app_user;
GRANT USAGE ON SCHEMA public TO app_user;
-- Permisos explícitos SOLO sobre las vistas (Seguridad estricta)
GRANT SELECT ON vw_course_performance TO app_user;
GRANT SELECT ON vw_teacher_load TO app_user;
GRANT SELECT ON vw_students_at_risk TO app_user;
GRANT SELECT ON vw_rank_students TO app_user;
GRANT SELECT ON vw_attendance_by_group TO app_user;

-- Asegurar que NO tenga acceso a tablas base
REVOKE ALL ON students, teachers, courses, groups, enrollments, grades, attendance FROM app_user;