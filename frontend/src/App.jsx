import { useState, useEffect } from "react";
import { FaCode, FaUpload, FaPlayCircle, FaCheck, FaTimes } from "react-icons/fa";
import "./index.css";

export default function App() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  // Incremento de barra mientras loading está activo
  useEffect(() => {
    let interval;
    if (loading) {
      setProgress(0);
      interval = setInterval(() => {
        setProgress(prev => (prev < 99 ? prev + 1 : prev)); // nunca llega al 100% hasta finalizar
      }, 130); // cada 100ms avanza 1%
    } else {
      setProgress(100); // cuando termina, va al 100%
      setTimeout(() => setProgress(0), 500); // reset para la próxima ejecución
    }
    return () => clearInterval(interval);
  }, [loading]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setResult(null);
    setProgress(0);
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

        {/* Barra de progreso */}
        {loading && (
          <div className="progress-bar-container">
            <div
              className="progress-bar"
              style={{ width: `${progress}%` }}
            ></div>
            <p>{progress}%</p>
          </div>
        )}

        {result && (
          <div className="result-box">
            {result.error && (
              <p className="error-text">❌ Error: {result.error}</p>
            )}

            {result.success && (
              <>
                <div className="summary">
                  <p>
                    ✅ {result.results.filter(r => r.passed).length} correctos
                    &nbsp; | ❌ {result.results.filter(r => !r.passed).length} incorrectos
                  </p>
                </div>

                {result.results.map((r, idx) => (
                  <div key={idx} className={`test-result ${r.passed ? "passed" : "failed"}`}>
                    <p className="case-number"><strong>{r.caseName}</strong></p>
                    {r.error ? (
                      <p className="error-text">❌ Error: {r.error}</p>
                    ) : (
                      <>
                        <div className="input-box">
                          <strong>Entrada:</strong>
                          <div className="input-params">
                            {r.input
                              .split("\n")
                              .map(line => line.trim())
                              .filter(line => line !== "")
                              .map((line, i) => (
                                <span key={i} className="param-pill">{line}</span>
                              ))}
                          </div>
                        </div>
                        <p><strong>Esperado:</strong> {r.expected}</p>
                        <p><strong>Obtenido:</strong> {r.output}</p>
                        <p className={r.passed ? "success-text" : "error-text"}>
                          {r.passed ? <><FaCheck /> Correcto</> : <><FaTimes /> Incorrecto</>}
                        </p>
                      </>
                    )}
                  </div>
                ))}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
