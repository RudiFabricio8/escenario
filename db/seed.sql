-- ==========================================
-- SEED DATA FOR UNIVERSITY SYSTEM
-- ==========================================

-- 1. Estudiantes (Suficientes para paginación y diferentes programas)
INSERT INTO students (name, email, program, enrollment_year) VALUES
('Alice Johnson', 'alice@example.com', 'Computer Science', 2023),
('Bob Smith', 'bob@example.com', 'Computer Science', 2023),
('Charlie Davis', 'charlie@example.com', 'Computer Science', 2023),
('Diana Prince', 'diana@example.com', 'Mathematics', 2023),
('Edward Elric', 'edward@example.com', 'Mathematics', 2023),
('Fiona Gallagher', 'fiona@example.com', 'Engineering', 2022),
('George Miller', 'george@example.com', 'Engineering', 2022),
('Hannah Abbott', 'hannah@example.com', 'Computer Science', 2023),
('Ian Wright', 'ian@example.com', 'Mathematics', 2023),
('Jenny Slate', 'jenny@example.com', 'Engineering', 2022);

-- 2. Docentes
INSERT INTO teachers (name, email) VALUES
('Dr. Alan Turing', 'turing@university.edu'),
('Dra. Ada Lovelace', 'ada@university.edu'),
('Prof. Isaac Newton', 'newton@university.edu');

-- 3. Cursos
INSERT INTO courses (code, name, credits) VALUES
('CS101', 'Introduction to Programming', 8),
('MATH201', 'Calculus II', 10),
('ENG301', 'Structural Analysis', 6);

-- 4. Grupos (Varios grupos para demostrar vw_teacher_load)
INSERT INTO groups (course_id, teacher_id, term) VALUES
(1, 1, '2023-A'), -- Turing - CS101
(1, 1, '2023-B'), -- Turing - CS101 (Segunda carga)
(2, 2, '2023-A'), -- Lovelace - Math
(3, 3, '2023-A'); -- Newton - Eng

-- 5. Inscripciones
-- Alice, Bob, Charlie en CS101 (2023-A)
INSERT INTO enrollments (student_id, group_id, enrolled_at) VALUES
(1, 1, '2023-01-15'), (2, 1, '2023-01-15'), (3, 1, '2023-01-15'),
-- Diana y Edward en MATH201
(4, 3, '2023-01-15'), (5, 3, '2023-01-15'),
-- Fiona y George en ENG301
(6, 4, '2023-01-15'), (7, 4, '2023-01-15'),
-- Hannah en CS101 (2023-B)
(8, 2, '2023-07-15');

-- 6. Calificaciones (Demostración de filtros y promedios)
-- Enrollment IDs: Alice=1, Bob=2, Charlie=3, Diana=4, Edward=5, Fiona=6, George=7
INSERT INTO grades (enrollment_id, partial1, partial2, final) VALUES
(1, 9.0, 8.5, 9.0),  -- Alice: Excelente
(2, 5.0, 4.0, 4.5),  -- Bob: Reprobado (Afecta vw_course_performance y vw_students_at_risk)
(3, 7.0, 7.0, 7.0),  -- Charlie: Regular
(4, 10.0, 9.5, 9.8), -- Diana: Top Ranking
(5, 6.0, 5.5, 5.8),  -- Edward: Reprobado por poco
(6, 8.0, 8.0, 8.0),  -- Fiona: Bien
(7, 4.0, 3.0, 3.5),  -- George: Muy bajo
(8, 9.0, 9.0, 9.0);  -- Hannah

-- 7. Asistencia (Crítico para vw_students_at_risk)
-- Generamos 5 días de asistencia para varios alumnos
-- Alice (1): 100% asistencia
INSERT INTO attendance (enrollment_id, date, present) VALUES 
(1, '2023-02-01', TRUE), (1, '2023-02-02', TRUE), (1, '2023-02-03', TRUE), (1, '2023-02-04', TRUE), (1, '2023-02-05', TRUE);

-- Bob (2): 80% asistencia (Pero reprobó por nota)
INSERT INTO attendance (enrollment_id, date, present) VALUES 
(2, '2023-02-01', TRUE), (2, '2023-02-02', TRUE), (2, '2023-02-03', TRUE), (2, '2023-02-04', TRUE), (2, '2023-02-05', FALSE);

-- Charlie (3): 40% asistencia (En riesgo por inasistencia aunque su nota es 7)
INSERT INTO attendance (enrollment_id, date, present) VALUES 
(3, '2023-02-01', TRUE), (3, '2023-02-02', FALSE), (3, '2023-02-03', FALSE), (3, '2023-02-04', TRUE), (3, '2023-02-05', FALSE);

-- Diana (4): 100% asistencia
INSERT INTO attendance (enrollment_id, date, present) VALUES 
(4, '2023-02-01', TRUE), (4, '2023-02-02', TRUE), (4, '2023-02-03', TRUE), (4, '2023-02-04', TRUE), (4, '2023-02-05', TRUE);

-- George (7): 20% asistencia y nota baja (Doble riesgo)
INSERT INTO attendance (enrollment_id, date, present) VALUES 
(7, '2023-02-01', FALSE), (7, '2023-02-02', FALSE), (7, '2023-02-03', FALSE), (7, '2023-02-04', TRUE), (7, '2023-02-05', FALSE);