# Piper TTS local (solo desarrollo)

Genera los clips de `public/audio/` con voz neuronal 100% offline.
Nada de esto se sube al repo (ver `.gitignore`): el binario y las voces
se descargan una vez por máquina.

## Instalación (una vez)

1. Binario Windows: https://github.com/rhasspy/piper/releases/download/2023.11.14-2/piper_windows_amd64.zip
   Descomprimir en `tools/piper/piper/` (debe quedar `piper.exe` + `espeak-ng.dll` + `espeak-ng-data/`).
2. Voz español (sharvard, femenina): desde https://huggingface.co/rhasspy/piper-voices/tree/v1.0.0
   `es/es_ES/sharvard/medium/` → `es_ES-sharvard-medium.onnx` + `.onnx.json`
   en `tools/piper/`.

## Generar clips

Desde `tools/piper/piper/` (el exe necesita sus DLL al lado):

```bat
cmd /c "echo variable | piper.exe -m ..\es_ES-sharvard-medium.onnx -f ..\..\..\public\audio\es\variable.wav"
```

OJO: usar `cmd`, no PowerShell directo (la tubería de PowerShell
llega vacía al exe y genera WAV de 0 bytes).

## Producción futura

Los WAV de demo son estáticos. Para cursos generados por IA, el camino
es un microservicio Piper (wyoming) o inferencia ONNX en el servidor,
nunca TTS de terceros: filosofía local-first del GDD.
