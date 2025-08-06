// cursos-estudiante.js
export default async function ejecutar(req, res) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: "Falta el parámetro id" });
  }

  try {
    const response = await fetch(
      `http://roble-api:3000/estudiantes/${id}/cursos`
    );
    if (!response.ok) {
      throw new Error(`Error en respuesta del API: ${response.statusText}`);
    }

    const cursos = await response.json();
    res.json(cursos);
  } catch (error) {
    console.error("Error al obtener cursos:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
}
