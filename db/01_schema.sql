CREATE TABLE students (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    program VARCHAR(50),
    enrollment_year INT
);

CREATE TABLE teachers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
);

CREATE TABLE courses (
    id SERIAL PRIMARY KEY,
    code VARCHAR(10) UNIQUE,
    name VARCHAR(100) NOT NULL,
    credits INT
);

CREATE TABLE groups (
    id SERIAL PRIMARY KEY,
    course_id INT REFERENCES courses(id),
    teacher_id INT REFERENCES teachers(id),
    term VARCHAR(10) NOT NULL
);

CREATE TABLE enrollments (
    id SERIAL PRIMARY KEY,
    student_id INT REFERENCES students(id),
    group_id INT REFERENCES groups(id),
    enrolled_at DATE DEFAULT CURRENT_DATE
);

CREATE TABLE grades (
    id SERIAL PRIMARY KEY,
    enrollment_id INT REFERENCES enrollments(id),
    partial1 DECIMAL(4,2),
    partial2 DECIMAL(4,2),
    final DECIMAL(4,2)
);

CREATE TABLE attendance (
    id SERIAL PRIMARY KEY,
    enrollment_id INT REFERENCES enrollments(id),
    date DATE,
    present BOOLEAN
);

