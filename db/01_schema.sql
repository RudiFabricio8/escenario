-- Estudiantes
CREATE TABLE students (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    program TEXT,
    enrollment_year INT
);

-- Docentes
CREATE TABLE teachers (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL
);

-- Cursos
CREATE TABLE courses (
    id SERIAL PRIMARY KEY,
    code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    credits INT NOT NULL
);

-- Grupos
CREATE TABLE groups (
    id SERIAL PRIMARY KEY,
    course_id INT NOT NULL REFERENCES courses(id),
    teacher_id INT NOT NULL REFERENCES teachers(id),
    term TEXT NOT NULL
);

-- Inscripciones
CREATE TABLE enrollments (
    id SERIAL PRIMARY KEY,
    student_id INT NOT NULL REFERENCES students(id),
    group_id INT NOT NULL REFERENCES groups(id),
    enrolled_at DATE DEFAULT CURRENT_DATE
);

-- Calificaciones
CREATE TABLE grades (
    id SERIAL PRIMARY KEY,
    enrollment_id INT NOT NULL REFERENCES enrollments(id),
    partial1 DECIMAL(4,2),
    partial2 DECIMAL(4,2),
    final DECIMAL(4,2)
);

-- Asistencia
CREATE TABLE attendance (
    id SERIAL PRIMARY KEY,
    enrollment_id INT NOT NULL REFERENCES enrollments(id),
    date DATE NOT NULL,
    present BOOLEAN NOT NULL DEFAULT FALSE
);
