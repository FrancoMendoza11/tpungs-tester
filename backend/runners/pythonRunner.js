import { exec } from "child_process";

/**
 * Ejecuta un archivo Python con input dado y devuelve stdout
 * @param {string} filePath - ruta al archivo Python
 * @param {string} input - texto que se pasa por stdin
 * @returns {Promise<string>} - salida del programa
 */
export function runPython(filePath, input) {
  return new Promise((resolve, reject) => {
    const command = `python3 ${filePath}`;
    const process = exec(command, (err, stdout, stderr) => {
      if (err) return resolve(stderr || err.message);
      resolve(stdout);
    });

    if (input) {
      process.stdin.write(input);
      process.stdin.end();
    }
  });
}
