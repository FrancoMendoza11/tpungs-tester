import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { exec } from "child_process";
import { testCases } from "./testCases.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

// Carpeta para subir archivos temporalmente
const upload = multer({ dest: path.join(__dirname, "uploads/") });

// Middleware CORS
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

// Ruta para subir archivo
app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.json({ error: "No se recibió archivo" });

    const ext = path.extname(file.originalname).toLowerCase(); // .py o .java
    const baseName = path.basename(file.originalname, ext);
    const problemLetter = baseName[0].toUpperCase();

    if (!["A", "B", "C", "D", "E"].includes(problemLetter)) {
      return res.json({ error: "Nombre de archivo inválido" });
    }

    const cases = testCases[problemLetter];
    if (!cases) return res.json({ error: "No hay test cases para este problema" });

    const results = [];

    for (const testCase of cases) {
      const input = testCase.input;
      let output;

      try {
        if (ext === ".py") {
          output = await runPython(file.path, input);
        } else if (ext === ".java") {
          output = await runJava(file.path, input);
        } else {
          results.push({ error: "Extensión de archivo no soportada" });
          continue;
        }

        results.push({
          input,
          expected: testCase.output.trim(),
          output: output.trim(),
          passed: output.trim() === testCase.output.trim(),
        });
      } catch (err) {
        results.push({ input, error: err.message });
      }
    }

    res.json({ success: true, results });
  } catch (err) {
    console.error(err);
    res.json({ error: "Ocurrió un error al ejecutar los tests" });
  }
});

// Runners
function runPython(filePath, input) {
  return new Promise((resolve) => {
    const process = exec(`python3 "${filePath}"`, (err, stdout, stderr) => {
      if (err) return resolve(stderr || err.message);
      resolve(stdout);
    });
    if (input) {
      process.stdin.write(input);
      process.stdin.end();
    }
  });
}

function runJava(filePath, input) {
  return new Promise((resolve) => {
    const dir = path.dirname(filePath);
    const className = path.basename(filePath, ".java");

    // Compilar
    exec(`javac "${filePath}"`, { cwd: dir }, (err, stdout, stderr) => {
      if (err) return resolve(stderr || err.message);

      // Ejecutar clase
      const run = exec(`java -cp "${dir}" ${className}`, { cwd: dir }, (err2, stdout2, stderr2) => {
        if (err2) return resolve(stderr2 || err2.message);
        resolve(stdout2);
      });

      if (input) {
        run.stdin.write(input);
        run.stdin.end();
      }
    });
  });
}

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
