import express from "express";
import bodyParser from "body-parser";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { exec } from "child_process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = process.env.PORT || 8080;

const microservicesDir = path.join(__dirname, "microservices");
if (!fs.existsSync(microservicesDir)) fs.mkdirSync(microservicesDir);

app.use(bodyParser.json());

// Registro de microservicio dinámico
app.post("/microservicios", (req, res) => {
  const { name, code, endpoint } = req.body;
  if (!name || !code || !endpoint) {
    return res.status(400).json({ error: "Faltan parámetros requeridos." });
  }

  const filePath = path.join(microservicesDir, `${endpoint}.js`);
  fs.writeFileSync(filePath, code);
  res
    .status(201)
    .json({ message: "Microservicio registrado con éxito.", endpoint });
});

// Ejecutar microservicio
app.get("/ejecutar/:endpoint", async (req, res) => {
  const endpoint = req.params.endpoint;
  const filePath = path.join(microservicesDir, `${endpoint}.js`);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: "Microservicio no encontrado." });
  }

  try {
    const mod = await import(
      `./microservices/${endpoint}.js?update=${Date.now()}`
    );
    if (typeof mod.default === "function") {
      const result = await mod.default(req.query);
      res.json({ result });
    } else {
      res
        .status(500)
        .json({
          error: "El microservicio no exporta una función por defecto.",
        });
    }
  } catch (err) {
    res
      .status(500)
      .json({
        error: "Error al ejecutar el microservicio.",
        detail: err.message,
      });
  }
});

// Listar microservicios
app.get("/microservicios", (req, res) => {
  const files = fs
    .readdirSync(microservicesDir)
    .filter((f) => f.endsWith(".js"));
  res.json({ endpoints: files.map((f) => f.replace(".js", "")) });
});

app.listen(PORT, () => {
  console.log(`🚀 Gateway API corriendo en http://localhost:${PORT}`);
});
