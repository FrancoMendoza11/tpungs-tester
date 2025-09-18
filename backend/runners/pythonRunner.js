import { spawn } from "child_process";

export async function runPython(filePath, input) {
  return new Promise((resolve) => {
    const process = spawn("python3", [filePath]);
    let output = "";
    let error = "";

    process.stdout.on("data", (data) => (output += data.toString()));
    process.stderr.on("data", (data) => (error += data.toString()));

    process.on("close", (code) => {
      if (code !== 0) return resolve(error || "Error al ejecutar Python");
      resolve(output);
    });

    if (input) {
      process.stdin.write(input + "\n");
      process.stdin.end();
    }
  });
}
