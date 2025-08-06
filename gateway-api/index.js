import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Inicialización para usar __dirname con ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ruta donde se guardarán los microservicios
const DIRECTORIO_MICROSERVICIOS = path.join(
  __dirname,
  "microservices",
  "ejecutar"
);

// Crear carpeta si no existe
if (!fs.existsSync(DIRECTORIO_MICROSERVICIOS)) {
  fs.mkdirSync(DIRECTORIO_MICROSERVICIOS, { recursive: true });
}

const app = express();
const PORT = 8080;

app.use(express.json());

// Endpoint para registrar un nuevo microservicio
app.post("/microservicios", async (req, res) => {
  const { nombre, codigo } = req.body;

  if (!nombre || !codigo) {
    return res
      .status(400)
      .json({ error: "Faltan parámetros: nombre y codigo" });
  }

  try {
    const filePath = path.join(DIRECTORIO_MICROSERVICIOS, `${nombre}.js`);
    fs.writeFileSync(filePath, codigo);
    res.status(201).json({ mensaje: `Microservicio ${nombre} registrado` });
  } catch (err) {
    console.error("Error al guardar el microservicio:", err);
    res.status(500).json({ error: "Error al registrar microservicio" });
  }
});

// Endpoint para ejecutar un microservicio dinámico
app.all("/ms/:nombre", async (req, res) => {
  const { nombre } = req.params;
  const filePath = path.join(DIRECTORIO_MICROSERVICIOS, `${nombre}.js`);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: "Microservicio no encontrado" });
  }

  try {
    const { default: ejecutar } = await import(
      `file://${filePath}?update=${Date.now()}`
    );
    await ejecutar(req, res);
  } catch (err) {
    console.error("Error ejecutando el microservicio:", err);
    res.status(500).json({ error: "Error ejecutando el microservicio" });
  }
});

// Endpoint para listar microservicios creados
app.get("/microservicios", (req, res) => {
  try {
    const archivos = fs.readdirSync(DIRECTORIO_MICROSERVICIOS);
    const nombres = archivos.map((nombre) => nombre.replace(".js", ""));
    res.json({ microservicios: nombres });
  } catch (err) {
    console.error("Error leyendo microservicios:", err);
    res.status(500).json({ error: "No se pudieron leer los microservicios" });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Gateway API corriendo en http://localhost:${PORT}`);
});
