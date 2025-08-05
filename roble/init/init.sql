CREATE TABLE profesores (
  id SERIAL PRIMARY KEY,
  nombre TEXT NOT NULL,
  email TEXT NOT NULL
);

CREATE TABLE cursos (
  id SERIAL PRIMARY KEY,
  nombre TEXT NOT NULL,
  profesor_id INT REFERENCES profesores(id)
);

CREATE TABLE estudiantes (
  id SERIAL PRIMARY KEY,
  nombre TEXT NOT NULL,
  email TEXT NOT NULL,
  curso_id INT REFERENCES cursos(id)
);

-- Datos iniciales
INSERT INTO profesores (nombre, email) VALUES
  ('María Gómez', 'maria@colegio.edu'),
  ('Luis Pérez', 'luis@colegio.edu');

INSERT INTO cursos (nombre, profesor_id) VALUES
  ('Matemáticas', 1),
  ('Historia', 2);

INSERT INTO estudiantes (nombre, email, curso_id) VALUES
  ('Ana Torres', 'ana@colegio.edu', 1),
  ('Carlos Ruiz', 'carlos@colegio.edu', 2);
