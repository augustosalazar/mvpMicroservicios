@echo off
setlocal

:: CONFIGURACIÓN DEL PUERTO
set PORT=3000
set BASE=http://localhost:%PORT%

echo ================================
echo  🔧 PRUEBAS DE LA API DEL COLEGIO
echo ================================

:: Profesores
echo.
echo 🔸 Crear profesor...
curl -s -X POST %BASE%/profesores -H "Content-Type: application/json" -d "{\"nombre\":\"Ana Martínez\", \"email\":\"ana@uninorte.edu.co\"}"
echo.

echo 🔸 Listar profesores...
curl -s %BASE%/profesores
echo.

:: Cursos
echo.
echo 🔸 Crear curso (Programación I con profesor_id=1)...
curl -s -X POST %BASE%/cursos -H "Content-Type: application/json" -d "{\"nombre\":\"Programación I\", \"profesor_id\":1}"
echo.

echo 🔸 Listar cursos...
curl -s %BASE%/cursos
echo.

:: Estudiantes
echo.
echo 🔸 Crear estudiante (Carlos Pérez en curso_id=1)...
curl -s -X POST %BASE%/estudiantes -H "Content-Type: application/json" -d "{\"nombre\":\"Carlos Pérez\", \"email\":\"carlos@uninorte.edu.co\", \"curso_id\":1}"
echo.

echo 🔸 Listar estudiantes...
curl -s %BASE%/estudiantes
echo.

echo 🔸 Estudiantes en curso 1...
curl -s %BASE%/estudiantes/curso/1
echo.

echo 🔸 Cursos del profesor 1...
curl -s %BASE%/profesores/1/cursos
echo.

echo 🟢 PRUEBAS COMPLETADAS.
pause
