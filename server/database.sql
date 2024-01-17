CREATE TABLE IF NOT EXISTS "User" (
    id SERIAL PRIMARY KEY,
    email VARCHAR(100) NOT NULL,
    username VARCHAR(50) NOT NULL,
    fullname VARCHAR(100),
    avatar VARCHAR(255),
    completedCourses INTEGER[],
    boughtCourses INTEGER[],
    balance DECIMAL(10, 2)
);

-- Создание таблицы "Courseltem"
CREATE TABLE IF NOT EXISTS "Courseltem" (
    id SERIAL PRIMARY KEY,
    image VARCHAR(255),
    description TEXT
);

-- Создание таблицы "Course"
CREATE TABLE IF NOT EXISTS "Course" (
    id SERIAL PRIMARY KEY,
    price DECIMAL(10, 2),
    courselttemId INTEGER REFERENCES "Courseltem"(id)
);