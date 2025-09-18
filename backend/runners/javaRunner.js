import { exec } from "child_process";
import path from "path";

/**
 * Ejecuta un archivo Java dado y devuelve stdout
 * Compila el archivo y luego lo ejecuta
 * @param {string} filePath - ruta al archivo .java
 * @param {string} input - texto que se pasa por stdin
 * @returns {Promise<string>} - salida del programa
 */
export async function runJava(filePath, input) {
  return new Promise((resolve, reject) => {
    const dir = path.dirname(filePath);
    const fileName = path.basename(filePath, ".java"); // Nombre de la clase

    // Compilar
    exec(`javac ${filePath}`, { cwd: dir }, (err, stdout, stderr) => {
      if (err) return resolve(stderr || err.message);

      // Ejecutar
      const run = exec(`java -cp ${dir} ${fileName}`, { cwd: dir }, (err2, stdout2, stderr2) => {
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
