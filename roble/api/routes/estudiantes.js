const express = require("express");
const router = express.Router();
const db = require("../db");

// GET todos los estudiantes
router.get("/", async (req, res) => {
  try {
    const result = await db.query(
      `SELECT estudiantes.*, cursos.nombre AS nombre_curso
       FROM estudiantes
       LEFT JOIN cursos ON estudiantes.curso_id = cursos.id`
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener estudiantes" });
  }
});

// GET estudiante por ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const result = await db.query("SELECT * FROM estudiantes WHERE id = $1", [
    id,
  ]);
  res.json(result.rows[0]);
});

// POST nuevo estudiante
router.post("/", async (req, res) => {
  const { nombre, email, curso_id } = req.body;
  const result = await db.query(
    "INSERT INTO estudiantes (nombre, email, curso_id) VALUES ($1, $2, $3) RETURNING *",
    [nombre, email, curso_id]
  );
  res.status(201).json(result.rows[0]);
});

// PUT actualizar estudiante
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { nombre, email, curso_id } = req.body;
  const result = await db.query(
    "UPDATE estudiantes SET nombre = $1, email = $2, curso_id = $3 WHERE id = $4 RETURNING *",
    [nombre, email, curso_id, id]
  );
  res.json(result.rows[0]);
});

// DELETE eliminar estudiante
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  await db.query("DELETE FROM estudiantes WHERE id = $1", [id]);
  res.sendStatus(204);
});

// GET estudiantes por curso
router.get("/curso/:curso_id", async (req, res) => {
  const { curso_id } = req.params;
  const result = await db.query(
    `SELECT * FROM estudiantes WHERE curso_id = $1`,
    [curso_id]
  );
  res.json(result.rows);
});

module.exports = router;
