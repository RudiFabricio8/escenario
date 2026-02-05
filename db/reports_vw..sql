-- 1 fila por curso+periodo. Promedios y reprobados.
CREATE VIEW vw_course_performance AS
SELECT c.name as course, g.term, AVG(gr.final) as avg_grade,
       COUNT(CASE WHEN gr.final < 6 THEN 1 END) as failed_count
FROM groups g 
JOIN courses c ON g.course_id = c.id
JOIN enrollments e ON e.group_id = g.id
JOIN grades gr ON gr.enrollment_id = e.id
GROUP BY c.name, g.term;

-- Uso de HAVING.
CREATE VIEW vw_teacher_load AS
SELECT t.name as teacher, g.term, COUNT(DISTINCT g.id) as group_count, COUNT(e.id) as total_students
FROM teachers t
JOIN groups g ON g.teacher_id = t.id
JOIN enrollments e ON e.group_id = g.id
GROUP BY t.name, g.term
HAVING COUNT(g.id) >= 1;

-- Uso de CTE (WITH).
CREATE VIEW vw_students_at_risk AS
WITH metrics AS (
    SELECT enrollment_id, AVG(final) as avg_score, 
           (COUNT(CASE WHEN present THEN 1 END)::float / COUNT(*)) * 100 as attendance_rate
    FROM grades g JOIN attendance a USING (enrollment_id) GROUP BY enrollment_id
)
SELECT s.name, s.email, m.avg_score, m.attendance_rate
FROM students s JOIN enrollments e ON s.id = e.student_id JOIN metrics m ON e.id = m.enrollment_id
WHERE m.avg_score < 6 OR m.attendance_rate < 80;

-- Uso de Window Function.
CREATE VIEW vw_rank_students AS
SELECT s.name, s.program, g.term, AVG(gr.final) as score,
       RANK() OVER (PARTITION BY s.program, g.term ORDER BY AVG(gr.final) DESC) as ranking
FROM students s JOIN enrollments e ON s.id = e.student_id JOIN groups g ON e.group_id = g.id JOIN grades gr ON gr.enrollment_id = e.id
GROUP BY s.name, s.program, g.term;