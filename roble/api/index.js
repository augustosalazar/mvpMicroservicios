const express = require("express");
const app = express();
app.use(express.json());

app.use("/estudiantes", require("./routes/estudiantes"));
app.use("/profesores", require("./routes/profesores"));
app.use("/cursos", require("./routes/cursos"));

app.get("/", (req, res) => res.send("API Roble Fake - Colegio"));

const port = 3000;
app.listen(port, () =>
  console.log(`✅ API escuchando en http://localhost:${port}`)
);
