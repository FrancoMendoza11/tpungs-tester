import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import { testCases } from "./testCases.js";

// Importar runners
import { runPython } from "./runners/pythonRunner.js";
import { runJava } from "./runners/javaRunner.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

const upload = multer({ dest: path.join(__dirname, "uploads/") });

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.json({ error: "No se recibió archivo" });

    const ext = path.extname(file.originalname).toLowerCase();
    const baseName = path.basename(file.originalname, ext);

    // Asegurar extensión correcta para Java y Python
    let filePath = file.path;
    if (ext === ".java" || ext === ".py") {
      const newPath = path.join(path.dirname(file.path), baseName + ext);
      fs.renameSync(file.path, newPath);
      filePath = newPath;
    }

    const problemLetter = baseName[0].toUpperCase();

    if (!["A", "B", "C", "D", "E"].includes(problemLetter)) {
      return res.json({ error: "Nombre de archivo inválido" });
    }

    const cases = testCases[problemLetter];
    if (!cases) return res.json({ error: "No hay test cases para este problema" });

    const results = [];

    for (let i = 0; i < cases.length; i++) {
      const testCase = cases[i];
      const input = testCase.input;
      let output;

      try {
        if (ext === ".py") {
          output = await runPython(filePath, input);
        } else if (ext === ".java") {
          output = await runJava(filePath, input);
        } else {
          results.push({ error: "Extensión de archivo no soportada" });
          continue;
        }

        results.push({
          caseNumber: i + 1,
          caseName: testCase.name, // <--- agregado
          input,
          expected: testCase.output.trim(),
          output: output.trim(),
          passed:
            output.replace(/\s+$/, "") === testCase.output.replace(/\s+$/, ""),
        });
      } catch (err) {
        results.push({ caseNumber: i + 1, input, error: err.message });
      }
    }

    // Limpiar archivo subido
    fs.unlinkSync(filePath);

    res.json({ success: true, results });
  } catch (err) {
    console.error(err);
    res.json({ error: "Ocurrió un error al ejecutar los tests" });
  }
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
