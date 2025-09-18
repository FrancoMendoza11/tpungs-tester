import { exec } from "child_process";
import path from "path";

export async function runJava(filePath, input) {
  return new Promise((resolve, reject) => {
    const dir = path.dirname(filePath);
    const fileName = path.basename(filePath, ".java");

    // Compilar usando solo el nombre del archivo
    exec(`javac ${fileName}.java`, { cwd: dir }, (err, stdout, stderr) => {
      if (err) return resolve(stderr || err.message);

      // Ejecutar la clase compilada
      const run = exec(`java -cp ${dir} ${fileName}`, { cwd: dir }, (err2, stdout2, stderr2) => {
        if (err2) return resolve(stderr2 || err2.message);
        resolve(stdout2);
      });

      if (input) {
        run.stdin.write(input + "\n");
        run.stdin.end();
      }
    });
  });
}
