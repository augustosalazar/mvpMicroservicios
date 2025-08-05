const express = require("express");
const router = express.Router();
const db = require("../db");

// GET todos los profesores
router.get("/", async (req, res) => {
  const result = await db.query("SELECT * FROM profesores");
  res.json(result.rows);
});

// GET profesor por ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const result = await db.query("SELECT * FROM profesores WHERE id = $1", [id]);
  res.json(result.rows[0]);
});

// POST nuevo profesor
router.post("/", async (req, res) => {
  const { nombre, email } = req.body;
  const result = await db.query(
    "INSERT INTO profesores (nombre, email) VALUES ($1, $2) RETURNING *",
    [nombre, email]
  );
  res.status(201).json(result.rows[0]);
});

// PUT actualizar profesor
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { nombre, email } = req.body;
  const result = await db.query(
    "UPDATE profesores SET nombre = $1, email = $2 WHERE id = $3 RETURNING *",
    [nombre, email, id]
  );
  res.json(result.rows[0]);
});

// DELETE eliminar profesor
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  await db.query("DELETE FROM profesores WHERE id = $1", [id]);
  res.sendStatus(204);
});

// GET cursos por profesor
router.get("/:id/cursos", async (req, res) => {
  const { id } = req.params;
  const result = await db.query("SELECT * FROM cursos WHERE profesor_id = $1", [
    id,
  ]);
  res.json(result.rows);
});

module.exports = router;
