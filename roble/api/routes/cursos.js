const express = require("express");
const router = express.Router();
const db = require("../db");

// GET todos los cursos
router.get("/", async (req, res) => {
  const result = await db.query(
    `SELECT cursos.*, profesores.nombre AS nombre_profesor 
     FROM cursos 
     LEFT JOIN profesores ON cursos.profesor_id = profesores.id`
  );
  res.json(result.rows);
});

// GET curso por ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const result = await db.query("SELECT * FROM cursos WHERE id = $1", [id]);
  res.json(result.rows[0]);
});

// POST nuevo curso
router.post("/", async (req, res) => {
  const { nombre, profesor_id } = req.body;
  const result = await db.query(
    "INSERT INTO cursos (nombre, profesor_id) VALUES ($1, $2) RETURNING *",
    [nombre, profesor_id]
  );
  res.status(201).json(result.rows[0]);
});

// PUT actualizar curso
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { nombre, profesor_id } = req.body;
  const result = await db.query(
    "UPDATE cursos SET nombre = $1, profesor_id = $2 WHERE id = $3 RETURNING *",
    [nombre, profesor_id, id]
  );
  res.json(result.rows[0]);
});

// DELETE eliminar curso
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  await db.query("DELETE FROM cursos WHERE id = $1", [id]);
  res.sendStatus(204);
});

module.exports = router;
