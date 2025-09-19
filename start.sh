#!/bin/bash

# Script para iniciar frontend y backend automáticamente

# Guardamos el directorio actual
BASE_DIR=$(pwd)

# Abrir el frontend
echo "Iniciando frontend..."
cd "$BASE_DIR/frontend" || exit
# Abrimos el navegador con el puerto por defecto de Vite (3000 o 5173)
# Ajusta si tu npm run dev usa otro puerto
npm run dev &
FRONT_PID=$!

# Esperamos un poco a que el frontend levante
sleep 5

# Intentamos abrir el navegador (Linux)
xdg-open http://localhost:5173 2>/dev/null || echo "Abre tu navegador en http://localhost:5173"

# Iniciar backend
echo "Iniciando backend..."
cd "$BASE_DIR/backend" || exit
npm start &
BACK_PID=$!

echo "Frontend PID: $FRONT_PID"
echo "Backend PID: $BACK_PID"

# Esperamos a que terminen ambos procesos
wait $FRONT_PID $BACK_PID
