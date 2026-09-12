@echo off
title artop - servidor de desarrollo
cd /d "%~dp0"

where bun >nul 2>nul
if errorlevel 1 (
  echo [artop] No se encontro Bun. Instalalo desde https://bun.sh
  echo [artop] Luego vuelve a abrir este archivo.
  pause
  exit /b 1
)

if not exist "node_modules" (
  echo [artop] Instalando dependencias con Bun (solo la primera vez)...
  call bun install
  if errorlevel 1 (
    echo [artop] Fallo la instalacion. Revisa tu conexion e intentalo de nuevo.
    pause
    exit /b 1
  )
)

echo [artop] Abriendo http://localhost:3000 en tu navegador...
start "" cmd /c "timeout /t 12 /nobreak >nul & start """" http://localhost:3000"

where node >nul 2>nul
if errorlevel 1 (
  echo [artop] Sin Node, corriendo Next con Bun (arranque mas lento)...
  call bun run dev
) else (
  echo [artop] Iniciando servidor (Ctrl+C para detener)...
  call npm run dev
)

echo.
echo [artop] Servidor detenido.
pause
