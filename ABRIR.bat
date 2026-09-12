@echo off
title artop - servidor de desarrollo
cd /d "%~dp0"

where bun >nul 2>nul
if errorlevel 1 (
  echo [artop] No se encontro Bun. Instalalo desde https://bun.sh
  pause
  exit /b 1
)

if not exist "node_modules" (
  echo [artop] Instalando dependencias con Bun. Solo la primera vez...
  call bun install
  if errorlevel 1 (
    echo [artop] Fallo la instalacion. Revisa tu conexion e intentalo de nuevo.
    pause
    exit /b 1
  )
)

echo [artop] Abriendo http://localhost:3000 ...
start "" "http://localhost:3000"
echo [artop] Si el navegador dice que no conecta, espera unos segundos y recarga una vez.
echo [artop] Para detener el servidor: Ctrl+C

where node >nul 2>nul
if errorlevel 1 (
  call bun run dev
) else (
  call npm run dev
)

echo.
echo [artop] Servidor detenido.
pause
