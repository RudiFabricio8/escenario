-- 1. Promedio por curso y periodo
-- Usé COALESCE para que si no hay nota, salga 0.0
CREATE VIEW vw_course_performance AS
SELECT 
    c.name AS curso,
    g.term AS periodo,
    COALESCE(AVG(gr.final), 0.0) AS promedio_final
FROM groups g
JOIN courses c ON g.course_id = c.id
JOIN enrollments e ON e.group_id = g.id
JOIN grades gr ON gr.enrollment_id = e.id
GROUP BY c.name, g.term;

-- 2. Carga Docente: Docentes con más de 1 grupo
-- Se lista columnas específicas con alias
CREATE VIEW vw_teacher_load AS
SELECT 
    t.name AS nombre_docente,
    COUNT(g.id) AS total_grupos
FROM teachers t
JOIN groups g ON g.teacher_id = t.id
GROUP BY t.name
HAVING COUNT(g.id) > 1;

-- 3. Alumnos en Riesgo: Promedio bajo
CREATE VIEW vw_students_at_risk AS
WITH calculo_promedios AS (
    SELECT 
        student_id,
        AVG((partial1 + partial2 + final) / 3) as promedio_general
    FROM enrollments e
    JOIN grades g ON g.enrollment_id = e.id
    GROUP BY student_id
)
SELECT 
    s.name AS alumno,
    s.email AS correo,
    cp.promedio_general
FROM students s
JOIN calculo_promedios cp ON s.id = cp.student_id
WHERE cp.promedio_general < 6;

-- 4. Asistencia por Grupo
CREATE VIEW vw_attendance_by_group AS
SELECT 
    g.id AS grupo_id,
    g.term AS periodo,
    COALESCE(COUNT(a.id), 0) AS total_asistencias
FROM groups g
LEFT JOIN enrollments e ON e.group_id = g.id
LEFT JOIN attendance a ON a.enrollment_id = e.id
GROUP BY g.id, g.term;

-- 5. Ranking de Alumnos
-- Se lista columnas
CREATE VIEW vw_rank_students AS
SELECT 
    s.name AS alumno,
    s.program AS carrera,
    AVG(gr.final) AS nota_final,
    RANK() OVER (PARTITION BY s.program ORDER BY AVG(gr.final) DESC) AS posicion
FROM students s
JOIN enrollments e ON s.id = e.student_id
JOIN grades gr ON e.id = gr.enrollment_id
GROUP BY s.name, s.program;