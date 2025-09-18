import { useState } from "react";
import { FaCode, FaUpload, FaPlayCircle } from "react-icons/fa";
import "./index.css"; // tu CSS normal

export default function App() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setResult(null);
  };

  const handleSubmit = async () => {
    if (!file) return alert("Por favor, selecciona un archivo .py o .java");

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);
    try {
      const res = await fetch("http://localhost:3000/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      setResult(data);
    } catch {
      setResult({ error: "Error al conectar con el servidor" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <h1 className="app-title">
        <FaCode className="icon" /> TPUNGS Tester
      </h1>

      <div className="card">
        <label className="file-label">
          <FaUpload className="upload-icon" />
          {file ? file.name : "Cargar archivo .py o .java"}
          <input type="file" accept=".py,.java" onChange={handleFileChange} />
        </label>

        <button
          className="execute-button"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "⏳ Ejecutando..." : (
            <>
              <FaPlayCircle /> Ejecutar Tests
            </>
          )}
        </button>

        {result && (
          <div className="result-box">
            {result.error && (
              <p className="error-text">❌ Error: {result.error}</p>
            )}

            {result.success && result.results && result.results.map((r, idx) => (
              <div key={idx} className="test-result">
		<p className="case-number"><strong>{r.caseName}</strong></p>
                {r.error ? (
                  <p className="error-text">❌ Error: {r.error}</p>
                ) : (
                  <>
                    <p><strong>Entrada:</strong> {r.input}</p>
                    <p><strong>Esperado:</strong> {r.expected}</p>
                    <p><strong>Obtenido:</strong> {r.output}</p>
                    <p className={r.passed ? "success-text" : "error-text"}>
                      {r.passed ? "✅ Correcto" : "❌ Incorrecto"}
                    </p>
                  </>
                )}
                <hr />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
