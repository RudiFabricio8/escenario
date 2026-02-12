#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    -- Crear el usuario de la aplicación usando variables
    CREATE USER $APP_USER WITH PASSWORD '$APP_PASSWORD';
    
    -- Permisos de conexión
    GRANT CONNECT ON DATABASE $POSTGRES_DB TO $APP_USER;
    GRANT USAGE ON SCHEMA public TO $APP_USER;
    
    -- Permisos explícitos sobre las vistas
    GRANT SELECT ON vw_course_performance TO $APP_USER;
    GRANT SELECT ON vw_teacher_load TO $APP_USER;
    GRANT SELECT ON vw_students_at_risk TO $APP_USER;
    GRANT SELECT ON vw_rank_students TO $APP_USER;
    GRANT SELECT ON vw_attendance_by_group TO $APP_USER;

    -- Asegurar que no tenga acceso a tablas base
    REVOKE ALL ON students, teachers, courses, groups, enrollments, grades, attendance FROM $APP_USER;
EOSQL
