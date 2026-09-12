# artop
## Product Design Document — Alpha

**Nombre:** artop  
**Tipo:** Plataforma de aprendizaje generativa  
**Plataforma inicial:** Desktop/Web app  
**Tecnología objetivo:** HTML + TypeScript + Electron  
**IA:** Groq API, usando la API key proporcionada por el usuario  
**Modelo de negocio actual:** Gratis, sin anuncios, sin planes de pago  
**Concepto central:** Aprende prácticamente cualquier cosa que pueda enseñarse virtualmente.  
**Inspiración UX:** Duolingo y otras apps de aprendizaje de sesiones cortas  
**Identidad:** Cyber-pop, digital, creativa, emocional, moderna

---

# 1. VISIÓN

artop es una plataforma capaz de crear cursos completos y personalizados mediante inteligencia artificial.

El usuario no elige simplemente una lección generada por IA. Le proporciona a artop algunos datos básicos:

- Qué quiere aprender.
- Qué experiencia tiene.
- Cuánto quiere que dure el curso.
- Cuántas etapas/unidades desea.
- Preferencias opcionales sobre dificultad, ritmo y profundidad.

A partir de eso, artop construye un curso completo.

La IA primero diseña la arquitectura pedagógica del curso, define su formato y establece las reglas que deberán seguir todas las futuras generaciones. Después genera grandes bloques de contenido: etapas, lecciones, explicaciones, ejercicios, respuestas y evaluaciones.

La meta es que el resultado se sienta como un curso diseñado deliberadamente para esa persona, no como una secuencia de respuestas de chatbot.

---

# 2. PRINCIPIO FUNDAMENTAL

## "La IA genera. artop recuerda."

Los modelos de lenguaje no serán considerados la memoria permanente del curso.

El curso tendrá un estado estructurado propio llamado **Course State**.

Esto permite cambiar de modelo sin romper:

- estilo;
- terminología;
- dificultad;
- progresión;
- objetivos;
- conceptos aprendidos;
- conceptos pendientes;
- errores frecuentes;
- estructura de las siguientes lecciones.

Qwen puede generar una parte del curso.

GPT-OSS puede validar otra.

Otro modelo puede producir audio.

La experiencia seguirá sintiéndose como una sola IA.

---

# 3. POSICIONAMIENTO

artop quiere transmitir:

> "Dime qué quieres aprender. Yo construyo el camino."

No busca competir solamente como una app de idiomas.

Puede utilizarse para contenidos virtualmente enseñables como:

- idiomas;
- programación;
- escritura;
- guionismo;
- diseño;
- historia;
- matemáticas;
- ciencias;
- teoría musical;
- edición;
- fotografía;
- conceptos académicos;
- preparación teórica;
- habilidades creativas;
- conocimientos profesionales;
- cultura general.

### Fuera del alcance

artop no debe presentarse como una plataforma capaz de enseñar correctamente cualquier habilidad práctica que requiera supervisión física o equipamiento especializado.

Ejemplos:

- escalar montañas;
- instrumentos físicos;
- deportes de contacto;
- actividades peligrosas;
- procedimientos médicos;
- habilidades donde una explicación textual no sustituya una supervisión presencial.

Cuando un tema sea demasiado práctico o peligroso, artop deberá reconocer las limitaciones del formato.

---

# 4. MODELO DE PRODUCTO

El objeto principal de artop es el **Curso**.

La jerarquía:

```text
Curso
│
├── Etapas / Unidades
│   │
│   ├── Lección
│   │   │
│   │   ├── Explicación
│   │   ├── Ejercicio 1
│   │   ├── Ejercicio 2
│   │   ├── Ejercicio 3
│   │   ├── Ejercicio 4
│   │   └── Ejercicio 5
│   │
│   ├── Lección
│   ├── Lección
│   └── ...
│
└── Evaluaciones / Revisión / Progreso
```

Una **lección** funciona como una ronda de aprendizaje rápida.

Por defecto:

**1 lección = 5 ejercicios.**

La explicación puede aparecer antes, durante o entre los ejercicios dependiendo del tipo de contenido.

---

# 5. ESCALA DEL CURSO

El usuario puede determinar la longitud.

Configuración mínima aproximada:

**3 etapas**

Configuración extensa:

**50+ etapas**

Una etapa puede contener aproximadamente:

**25 lecciones**

Una etapa completa podría contener por tanto aproximadamente:

**125 ejercicios**

Un curso largo puede llegar a miles de ejercicios.

La arquitectura debe soportar cursos pequeños y enormes sin depender de mantener todo el contenido completo dentro del contexto de cada request.

---

# 6. CREACIÓN DEL CURSO

## Paso 1 — Datos iniciales

El usuario proporciona:

```text
¿Qué quieres aprender?
Nivel / experiencia
Longitud del curso
Número de etapas
Preferencia de dificultad
Preferencia de profundidad
```

Opcionalmente puede proporcionar:

```text
Objetivo concreto
Conocimientos previos
Preferencias de explicación
Tiempo disponible
Idioma
Estilo de aprendizaje
```

No se debe convertir esto en un formulario enorme.

El onboarding debe sentirse rápido.

---

# 7. COURSE ARCHITECT

El primer modelo importante del proceso será **Qwen 3.8**.

Su función no es crear inmediatamente todas las lecciones.

Su función principal es diseñar el curso completo.

Debe producir:

### Course Blueprint

Define:

- propósito del curso;
- nivel;
- objetivos;
- etapas;
- orden conceptual;
- prerequisitos;
- dificultad progresiva;
- conceptos;
- dependencia entre conceptos;
- estrategia de revisión;
- distribución de contenido;
- estructura de evaluaciones.

### Course Format / Contract

Este es uno de los elementos más importantes de artop.

Define cómo debe sentirse el curso.

Incluye:

```text
estilo de explicación
tono
longitud aproximada
estructura de las lecciones
tipo de ejercicios
dificultad
cantidad de información nueva
uso de ejemplos
tipo de feedback
terminología
reglas de progresión
reglas de revisión
reglas de evaluación
```

El Course Contract es la identidad pedagógica del curso.

---

# 8. COURSE CONTRACT

Todos los modelos posteriores deben obedecerlo.

Ejemplo conceptual:

```toon
course:
  title: "Python desde cero"
  level: beginner

format:
  explanation_style: practical
  exercise_style: interactive
  difficulty_curve: gradual
  feedback_style: concise
  lesson_structure: explanation_then_practice

progression:
  introduce_new_concepts_gradually: true
  require_prerequisites: true
  periodic_review: true
  cumulative_exams: true

terminology:
  prefer_simple_terms: true
  preserve_consistent_names: true
```

La estructura real puede variar según el curso.

---

# 9. GENERACIÓN MASIVA

Después de crear el blueprint, artop comienza a generar contenido en bloques.

Por ejemplo:

```text
Qwen 3.8
    ↓
Course Blueprint
    ↓
Stage 1 Contract
    ↓
Qwen 3.6
    ↓
12–13 lecciones
    ↓
validación
    ↓
siguiente batch
```

El usuario puede ver un estado como:

```text
Creando tu curso...

✓ Arquitectura del curso
✓ Etapas
✓ Progresión
✓ Formato de aprendizaje

Generando Etapa 1
██████████████░░░░ 78%

12 de 15 lecciones
```

El proceso puede tardar varios minutos.

Esto es aceptable porque el resultado es un contenido persistente y reutilizable.

---

# 10. GENERACIÓN POR BATCH

No se debe generar un curso gigantesco en una única request.

El generador trabajará mediante batches.

Ejemplo:

```text
Stage 1
├── Batch A
│   ├── Lesson 1
│   ├── Lesson 2
│   ├── ...
│   └── Lesson 12
│
└── Batch B
    ├── Lesson 13
    ├── ...
    └── Lesson 25
```

Cada batch recibe el estado necesario para continuar.

No recibe obligatoriamente las lecciones completas anteriores.

En su lugar recibe un resumen estructurado.

---

# 11. LESSON CONTRACT

Cada lección tiene su propio contrato.

Ejemplo:

```toon
lesson:
  id: L04
  objective: "Understand Python variables"

must_know:
  - variable
  - assignment

prerequisites:
  - basic_syntax

difficulty: 2

lesson_format:
  explanation: true
  exercises: 5
```

El generador debe cumplir el contrato exactamente.

---

# 12. ESTRUCTURA DE UNA LECCIÓN

Una lección típica:

```text
┌────────────────────────────┐
│      OBJETIVO              │
│      Variables             │
└────────────────────────────┘

Explicación corta

Ejemplo

┌────────────────────────────┐
│ Pregunta 1                 │
└────────────────────────────┘

Respuesta

┌────────────────────────────┐
│ Pregunta 2                 │
└────────────────────────────┘

...

5 ejercicios

Resultado
↓
Progreso actualizado
```

Una lección no tiene necesariamente que explicar conceptos durante largos párrafos.

La prioridad es:

**explicación → interacción → feedback → progreso.**

---

# 13. COURSE STATE

Cada curso mantiene un estado persistente.

Debe incluir información como:

```toon
course_state:
  current_stage: 2
  current_lesson: 14

progress:
  completed_lessons: 13
  completed_exercises: 65

mastery:
  concept_a: 0.91
  concept_b: 0.74
  concept_c: 0.42

review:
  concept_c: high_priority

recent_errors:
  - concept_c
```

Este objeto es la memoria real del curso.

---

# 14. LEARNER STATE

El curso también mantiene un modelo del estudiante.

Debe representar:

- conocimientos;
- progreso;
- dificultad;
- fortalezas;
- debilidades;
- errores;
- conceptos que necesitan repaso;
- velocidad;
- rendimiento reciente.

No debe intentar diagnosticar atributos médicos o psicológicos.

El objetivo es únicamente adaptar el contenido.

---

# 15. MEMORIA DE LECCIONES

artop debe mantener información compacta de las lecciones recientes.

Puede almacenar:

```toon
lesson_memory:
  lesson: 14
  concepts_introduced:
    - loops

  concepts_reinforced:
    - variables

  learner_performance:
    loops: 0.61
    variables: 0.94
```

La aplicación puede conservar las últimas 10 lecciones relevantes en el contexto dinámico cuando sea necesario.

Las lecciones antiguas se representan principalmente mediante resúmenes estructurados.

---

# 16. CONTEXT ENGINEERING

Esta es una parte fundamental del producto.

El modelo no debe recibir:

> "Aquí tienes toda la historia de este curso."

Debe recibir exactamente lo que necesita.

El contexto se divide conceptualmente en:

```text
STATIC SYSTEM
    ↓
ARTOP RULES

COURSE CONTRACT
    ↓
COURSE STATE
    ↓
LEARNER STATE
    ↓
RECENT RELEVANT MEMORY
    ↓
CURRENT TASK
```

La prioridad es minimizar tokens sin perder continuidad.

---

# 17. SYSTEM PROMPT

El System Prompt debe contener las reglas permanentes del motor.

Incluye:

- identidad del sistema;
- reglas de artop;
- reglas pedagógicas;
- reglas de coherencia;
- especificación TOON;
- reglas de serialización;
- reglas de validación;
- reglas de Tool Calling;
- restricciones de generación;
- formato de output;
- manejo de errores;
- reglas del Course Contract.

El system prompt puede ser relativamente largo, pero debe mantenerse estable.

Un objetivo razonable es mantener el sistema alrededor de:

**1K–2K tokens**, cuando sea posible.

No debe convertirse en un documento gigantesco imposible de reutilizar.

---

# 18. TOON

artop utilizará **Token Oriented Object Notation (TOON)** para representar los datos estructurados enviados entre la aplicación y los modelos cuando sea apropiado.

TOON se utilizará especialmente para:

- Course State;
- Learner State;
- Course Blueprint;
- Lesson Contract;
- memorias;
- progreso;
- resultados;
- metadata;
- estructuras repetitivas.

El system prompt debe explicar:

1. qué es TOON;
2. cuándo utilizarlo;
3. cómo interpretarlo;
4. cómo generarlo;
5. reglas de sintaxis;
6. restricciones;
7. ejemplos válidos;
8. errores que deben evitarse.

TOON no reemplaza las instrucciones normales del System Prompt.

Las instrucciones permanentes pueden seguir escritas en lenguaje natural.

---

# 19. TOOL CALLING

Groq Tool Calling se utilizará cuando la aplicación necesite operaciones estructuradas.

Ejemplos:

```text
get_course_state
get_lesson
get_recent_memory
save_lesson_result
update_mastery
create_review_task
generate_audio
request_web_information
validate_lesson
```

Los modelos no deberían modificar directamente almacenamiento arbitrario.

Las acciones deben pasar por herramientas controladas por artop.

---

# 20. MODEL ROUTER

artop utiliza múltiples modelos.

El usuario solamente proporciona:

**su API key de Groq.**

Artop decide qué modelo usar.

El router considera:

- dificultad de la tarea;
- calidad necesaria;
- longitud del contexto;
- latencia;
- rate limit;
- tokens restantes;
- disponibilidad;
- posibilidad de aprovechar caching;
- tipo de output;
- importancia de la tarea.

---

# 21. ROLES DE LOS MODELOS

### Qwen 3.8

Modelo de alta inteligencia.

Uso preferente:

- arquitectura del curso;
- Course Blueprint;
- Course Contract;
- decisiones pedagógicas complejas;
- reparaciones difíciles;
- tareas donde la coherencia global sea extremadamente importante.

### Qwen 3.6

Modelo principal de generación masiva.

Uso preferente:

- lecciones;
- ejercicios;
- explicaciones;
- batches de contenido;
- variaciones;
- contenido normal de una etapa.

### GPT-OSS 120B

Modelo de alta capacidad con especial interés para contextos reutilizables y escenarios donde prompt caching sea útil.

Uso preferente:

- tareas complejas;
- generación con contexto largo y estable;
- revisión;
- reparación;
- transformaciones complejas.

### GPT-OSS 20B

Modelo rápido.

Uso preferente:

- extracción;
- clasificación;
- validación;
- operaciones relativamente sencillas;
- transformaciones pequeñas;
- procesamiento auxiliar.

### Otros modelos

Pueden añadirse según disponibilidad de Groq.

La arquitectura debe ser extensible.

---

# 22. CACHE STRATEGY

Los modelos con prompt caching deben aprovechar un prefijo estable.

Conceptualmente:

```text
[SYSTEM PROMPT ESTÁTICO]
[REGLAS ARTOP]
[ESPECIFICACIÓN TOON]
[SCHEMAS]
────────────────────
[COURSE CONTRACT]
[COURSE STATE]
[CURRENT TASK]
```

La parte estable debe cambiar lo menos posible.

Los datos dinámicos van al final.

Para modelos sin caching, artop debe minimizar todavía más el contexto.

---

# 23. RATE LIMIT MANAGER

El cliente mantiene un gestor local de recursos por modelo.

Debe conocer:

```text
requests/minute
requests/day
tokens/minute
tokens/day
```

Y, cuando sea posible, leer los headers devueltos por Groq para conocer el presupuesto restante.

No debe esperar sistemáticamente a un error `429`.

Antes de enviar una request, el scheduler debería decidir:

```text
¿Hay presupuesto?
      ↓
sí → ejecutar
no → buscar otro modelo apropiado
```

Si ningún modelo adecuado está disponible, debe pausar la generación de manera controlada y explicar el estado al usuario.

---

# 24. OBJETIVO DE TOKENS

Dado que los modelos relevantes del free tier pueden tener límites de aproximadamente:

**8K tokens/minuto**

la aplicación debe ser extremadamente eficiente con contexto.

El objetivo no es utilizar siempre 2K tokens.

El objetivo es:

**usar el mínimo contexto que preserve la coherencia.**

Ejemplo ideal:

```text
System:             ~1.5K
Course context:     ~700
Learner state:      ~300
Recent memory:      ~700
Task:               ~200
────────────────────────
Input:              ~3.4K

Output:             ~1.5–3K
```

El sistema debe tratar estas cantidades como objetivos flexibles, no límites rígidos.

---

# 25. VALIDACIÓN

Toda generación importante debe poder validarse.

La validación puede comprobar:

- formato;
- estructura;
- campos obligatorios;
- coherencia con el contrato;
- conceptos inexistentes;
- conceptos adelantados;
- dificultad;
- duplicación;
- respuestas incorrectas;
- ejercicios sin solución;
- inconsistencias terminológicas.

Ejemplo:

```text
GENERATE
   ↓
PARSE
   ↓
SCHEMA VALIDATION
   ↓
COURSE CONTRACT VALIDATION
   ↓
SEMANTIC VALIDATION
   ↓
SAVE
```

Si falla:

```text
repair
```

El sistema no debería guardar contenido inválido como definitivo.

---

# 26. ADAPTACIÓN DURANTE EL APRENDIZAJE

La generación inicial es masiva.

La adaptación posterior es personalizada.

Esto significa:

```text
CURSO GENERADO
      ↓
USUARIO APRENDE
      ↓
RESULTADOS
      ↓
LEARNER STATE
      ↓
REVIEW / ADAPTATION
```

El curso no necesariamente se mantiene completamente estático.

artop puede insertar:

- repasos;
- ejercicios adicionales;
- refuerzos;
- explicaciones alternativas;
- mini evaluaciones;
- lecciones de recuperación.

Sin destruir la estructura original.

---

# 27. AUDIO

Algunos cursos pueden utilizar audio.

Ejemplos:

- idiomas;
- pronunciación;
- escucha;
- comunicación;
- narración;
- contenido donde hablar sea útil.

Se pueden utilizar modelos especializados de Speech-to-Text y Text-to-Speech disponibles mediante Groq.

El sistema de curso decide cuándo el audio tiene sentido.

No todos los cursos deben mostrar controles de voz.

---

# 28. TIPOS DE EJERCICIO

Los ejercicios deben depender del tema.

Posibles formatos:

- selección múltiple;
- completar;
- ordenar;
- relacionar;
- escribir respuesta;
- detectar error;
- traducir;
- corregir código;
- predecir resultado;
- explicar;
- clasificar;
- verdadero/falso;
- escuchar;
- hablar;
- respuesta abierta.

No debe existir un único formato universal.

---

# 29. RESPUESTAS Y FEEDBACK

Cada ejercicio debe tener una respuesta evaluable.

El contenido generado puede incluir:

```toon
exercise:
  question: ...
  expected_answer: ...
  acceptable_answers: [...]
  explanation: ...
  feedback_correct: ...
  feedback_incorrect: ...
```

El feedback debe respetar el estilo definido por el Course Contract.

La respuesta no debe convertirse automáticamente en una explicación enorme.

El producto favorece feedback inmediato y claro.

---

# 30. PROGRESIÓN

La progresión debe sentirse visible.

El usuario debe entender:

```text
Dónde estoy
Qué terminé
Qué estoy aprendiendo
Qué viene después
Qué estoy dominando
```

Elementos posibles:

- mapa de etapas;
- progreso;
- racha;
- dominio;
- coronas/medallas;
- niveles;
- porcentaje;
- estados completado/en progreso/bloqueado.

---

# 31. UX PRINCIPAL

La interfaz estará fuertemente inspirada en el modelo UX de Duolingo:

- sesiones cortas;
- navegación directa;
- progreso visible;
- unidades organizadas;
- grandes acciones;
- tarjetas;
- feedback inmediato;
- estados visuales claros;
- animaciones rápidas;
- interacción centrada en una acción por pantalla.

artop no debe copiar literalmente assets, personajes o elementos propietarios de Duolingo.

La inspiración es estructural y de experiencia de usuario.

---

# 32. HOME

La pantalla principal muestra el curso actual.

Elementos:

```text
LOGO artop

Curso actual
"Python desde cero"

Etapa actual
[==================----]

Próxima lección
[ CONTINUAR ]

Repasar
Explorar cursos
Perfil
Configuración
```

La pantalla debe responder inmediatamente a:

> "¿Qué hago ahora?"

---

# 33. MAPA DEL CURSO

Vista vertical de etapas.

Conceptualmente:

```text
          ● Lección 15
          │
          ● Lección 14
          │
          ● Lección 13 ✓
          │
      ┌───────────┐
      │ ETAPA 2   │
      └───────────┘
          │
          ● Lección 12 ✓
          │
          ● Lección 11 ✓
```

Puede incorporar nodos especiales:

- revisión;
- checkpoint;
- examen;
- desafío;
- etapa completada.

---

# 34. PANTALLA DE LECCIÓN

Debe ser extremadamente enfocada.

Una interacción primaria por momento.

```text
┌──────────────────────────────┐
│ ←              4 / 5         │
│                              │
│  ¿Cuál de estas opciones...? │
│                              │
│  ┌────────────────────────┐  │
│  │ A                      │  │
│  └────────────────────────┘  │
│                              │
│  ┌────────────────────────┐  │
│  │ B                      │  │
│  └────────────────────────┘  │
│                              │
│  ┌────────────────────────┐  │
│  │ C                      │  │
│  └────────────────────────┘  │
└──────────────────────────────┘
```

---

# 35. RESULTADO DE LECCIÓN

Al terminar:

```text
¡Lección completada!

★★★★★

5 / 5 ejercicios
+ XP

Dominaste:
✓ Concepto A
✓ Concepto B

Para repasar:
• Concepto C

[ CONTINUAR ]
```

El resultado actualiza Learner State.

---

# 36. VISUAL IDENTITY

La identidad de artop gira alrededor de:

- energía digital;
- cyber-pop;
- creatividad;
- tecnología;
- color;
- emoción;
- diseño limpio.

El wordmark utiliza `artop` en minúsculas.

El concepto visual central es el corazón integrado en la identidad.

La marca debe poder existir tanto en light como dark mode.

---

# 37. COLOR SYSTEM

### Artop Gradient

Paleta principal:

```text
Magenta
#FF007F

Violeta
#7000FF

Cobalto / Cian
#00A6FF
```

Los gradientes son parte esencial de la identidad.

Debe existir una versión controlada para UI donde el gradiente no perjudique la legibilidad.

---

# 38. LIGHT MODE

Inspiración estructural:

```text
Background:
#FFFFFF / #F8F9FA

Text:
#111116

Cards:
#FFFFFF

Borders:
muy sutiles

Accent:
Artop Gradient
```

El fondo general debe sentirse limpio y luminoso.

---

# 39. DARK MODE

```text
Background:
#000000 / #0D0D12

Text:
#F4F4F8

Cards:
#181820

Borders:
sutiles

Accent:
Artop Gradient
```

El gradiente debe destacar fuertemente sobre el negro.

---

# 40. TYPOGRAPHY

Wordmark:

tipografía custom / modificada.

Display:

```text
Plus Jakarta Sans
Outfit
```

UI:

```text
Inter
Outfit
SF Pro Display cuando esté disponible
```

La aplicación debe priorizar legibilidad.

No se deben utilizar demasiadas familias simultáneamente.

---

# 41. SPACING

Sistema base:

**10px**

Valores frecuentes:

```text
10
20
30
40
50
```

Los layouts deben mantenerse consistentes.

---

# 42. RADIUS

Base aproximada:

**12px**

Componentes grandes pueden utilizar radios superiores cuando visualmente sea apropiado.

El lenguaje general debe sentirse redondeado, amigable y moderno.

---

# 43. MOTION

Las animaciones deben ser cortas y funcionales.

Objetivo aproximado:

**300ms**

Usos:

- completar ejercicio;
- cambiar de pregunta;
- progreso;
- botones;
- mostrar feedback;
- desbloquear contenido.

No usar movimiento decorativo excesivo durante el aprendizaje.

La animación nunca debe ser la única forma de comunicar un estado.

---

# 44. ACCESIBILIDAD

Requisitos:

- teclado completamente funcional;
- focus visible;
- targets táctiles de al menos ~44×44px;
- texto legible;
- no depender solamente del color;
- estados de error/success acompañados por iconos o texto;
- soporte de zoom;
- opción de aumentar texto;
- movimiento reducido cuando sea posible;
- contraste suficiente en contenido e interfaz.

El gradiente de marca no debe utilizarse indiscriminadamente detrás de texto pequeño.

---

# 45. ANUNCIOS Y MONETIZACIÓN

Actualmente:

**sin anuncios.**

**sin suscripciones.**

**sin planes de pago.**

La aplicación depende de la API key proporcionada por el usuario.

El usuario paga a Groq según su propia cuenta/plan y artop no cobra por el uso de la IA durante esta fase.

El producto debe comunicar esto claramente.

---

# 46. API KEY

El onboarding debe explicar:

```text
Necesitas una API key de Groq.

artop usa tu clave directamente
para generar y procesar tu contenido.
```

La clave:

- no debe aparecer en la UI innecesariamente;
- debe almacenarse de forma segura dentro de lo posible en el entorno de escritorio;
- jamás debe incluirse en logs;
- jamás debe enviarse a servidores propios de artop si no es necesario.

La arquitectura debe asumir que la clave pertenece al usuario.

---

# 47. PRIVACIDAD

La filosofía inicial:

**local-first.**

Cuando sea posible:

- Course State local;
- progreso local;
- memoria local;
- configuración local;
- historial local.

Las requests de IA se envían directamente al proveedor correspondiente utilizando las credenciales del usuario.

---

# 48. OFFLINE

La aplicación puede abrir y consultar cursos ya generados sin conexión.

La generación de nuevo contenido requiere conexión con los proveedores de IA.

Objetivo:

```text
Curso generado
      ↓
guardado localmente
      ↓
aprendizaje offline posible
```

Especialmente importante para no depender continuamente de llamadas a la IA durante cada ejercicio.

---

# 49. STORAGE

El almacenamiento debe estar organizado alrededor de entidades:

```text
courses
course_state
course_blueprint
course_contract
stages
lessons
lesson_results
learner_state
lesson_memory
settings
api_config
```

El formato exacto puede cambiar durante implementación.

---

# 50. ARQUITECTURA DEL MOTOR

```text
                 USER
                  │
                  ▼
             ARTOP UI
                  │
                  ▼
          ARTOP ORCHESTRATOR
                  │
      ┌───────────┼────────────┐
      │           │            │
      ▼           ▼            ▼
 Course State  Scheduler   Model Router
      │                         │
      │             ┌───────────┼───────────┐
      │             ▼           ▼           ▼
      │          Qwen 3.8   Qwen 3.6    GPT-OSS
      │
      ▼
 Context Builder
      │
      ▼
   TOON Context
      │
      ▼
      AI
      │
      ▼
 Parser / Validator
      │
      ▼
 Course State Update
```

---

# 51. COURSE GENERATION PIPELINE

```text
User input
   ↓
Normalize request
   ↓
Qwen 3.8
   ↓
Course Blueprint
   ↓
Course Contract
   ↓
Validate
   ↓
Stage planning
   ↓
Qwen 3.6 batch
   ↓
Lessons
   ↓
Validate
   ↓
Store
   ↓
Next batch
```

---

# 52. LEARNING PIPELINE

```text
Open lesson
      ↓
Load Lesson
      ↓
Load minimal context
      ↓
User answers
      ↓
Evaluate
      ↓
Update learner state
      ↓
Update concept mastery
      ↓
Store result
      ↓
Next exercise
```

La IA no necesariamente debe intervenir en cada interacción.

El objetivo es evitar llamadas innecesarias.

---

# 53. REGENERACIÓN

Una lección no debe requerir regenerar todo el curso.

Puede regenerarse:

- un ejercicio;
- una explicación;
- una sección;
- una lección;
- un batch;
- una etapa.

Siempre utilizando el Course Contract.

---

# 54. COHERENCIA

La coherencia se considera una característica del sistema, no una propiedad accidental del modelo.

artop debe mantener:

### Coherencia terminológica

El mismo concepto debe llamarse igual salvo que el curso defina explícitamente sinónimos.

### Coherencia pedagógica

No debe enseñar A después de exigir conocimiento de B si B todavía no fue introducido.

### Coherencia de dificultad

La dificultad aumenta de forma controlada.

### Coherencia de estilo

Explicaciones y feedback deben mantener la personalidad del curso.

### Coherencia estructural

Las lecciones deben respetar el formato definido.

---

# 55. ERROR RECOVERY

Si una generación falla:

```text
Request
 ↓
Failure
 ↓
Classify error
 ↓
Retry / Repair
 ↓
Alternative model
 ↓
Validate
 ↓
Save
```

El usuario no debería ver errores internos de prompts, schemas o herramientas.

Debe ver algo como:

> "Estamos ajustando esta parte del curso."

---

# 56. RATE-LIMIT RECOVERY

Si un modelo alcanza su límite:

```text
Qwen 3.8
      ↓
limit reached
      ↓
¿Puede otra tarea ejecutarse con Qwen 3.6?
      ↓
sí
      ↓
fallback
```

No se debe intercambiar modelo si hacerlo rompería un requisito crítico.

Para tareas de arquitectura importante, es preferible esperar/reprogramar que generar un resultado mucho peor solamente para continuar.

---

# 57. PRINCIPIO DE CALIDAD

La app no debe perseguir:

> "usar la IA más inteligente siempre."

Debe perseguir:

> "usar el modelo adecuado para la tarea adecuada."

La calidad final surge de la combinación de:

```text
modelo
+
context engineering
+
Course Contract
+
memoria
+
validación
+
routing
```

---

# 58. DIFERENCIADOR PRINCIPAL

El principal diferenciador de artop es:

**generación masiva + coherencia persistente + personalización.**

No solamente:

> "La IA puede crear ejercicios."

Sino:

> "La IA puede diseñar y construir un curso completo y mantener su identidad mientras lo desarrolla."

---

# 59. MÉTRICAS DE ÉXITO

Durante Alpha:

### Calidad de generación

- porcentaje de batches válidos;
- cantidad de reparaciones;
- errores de formato;
- inconsistencias detectadas.

### Coherencia

- consistencia terminológica;
- cumplimiento del Course Contract;
- errores de prerrequisitos.

### Experiencia

- tiempo de generación inicial;
- tiempo hasta comenzar la primera lección;
- sesiones completadas;
- abandono;
- tasa de finalización.

### Eficiencia

- tokens promedio por generación;
- tokens reutilizados;
- errores 429;
- latencia;
- utilización por modelo.

---

# 60. ALPHA MVP

La primera versión funcional debe centrarse en:

```text
✓ Crear curso
✓ Definir longitud
✓ Definir nivel
✓ Qwen 3.8 crea blueprint
✓ Qwen 3.6 crea batches
✓ Course Contract
✓ TOON
✓ Course State
✓ Learner State básico
✓ Lecciones de 5 ejercicios
✓ Progreso
✓ UI estilo aprendizaje móvil
✓ Light/Dark
✓ API key de Groq
✓ Sin anuncios
✓ Sin pagos
✓ Persistencia local
```

No es necesario incluir inicialmente:

```text
✗ todos los tipos de ejercicios
✗ voz avanzada
✗ rankings
✗ social
✗ perfiles complejos
✗ marketplace
✗ colaboración
✗ sincronización cloud
```

---

# 61. ALPHA 0.1 — FIRST VERTICAL SLICE

El objetivo de Alpha 0.1 debe ser:

> Crear un curso corto de principio a fin y completar una lección de forma convincente.

Flujo:

```text
Nuevo curso
   ↓
¿Qué quieres aprender?
   ↓
Nivel
   ↓
Longitud
   ↓
Crear
   ↓
Qwen 3.8
   ↓
Blueprint
   ↓
Qwen 3.6
   ↓
Primer batch
   ↓
Curso listo
   ↓
Abrir etapa
   ↓
Lección
   ↓
5 ejercicios
   ↓
Resultado
```

Si este flujo funciona bien, la arquitectura base de artop está validada.

---

# 62. PRINCIPIOS DE DISEÑO DEL PRODUCTO

### 1. Una app, no un chatbot

El usuario debe sentir que está utilizando una plataforma educativa.

### 2. La IA trabaja detrás de escena

No mostrar innecesariamente prompts, modelos o decisiones internas.

### 3. La estructura importa más que la conversación

El curso tiene una arquitectura propia.

### 4. Generar una vez, reutilizar muchas veces

No solicitar a la IA algo que ya existe.

### 5. Contexto mínimo, continuidad máxima

Enviar solamente información relevante.

### 6. La coherencia es una feature

No una consecuencia accidental.

### 7. El usuario controla la API

artop orquesta el proveedor en nombre del usuario.

### 8. La UI debe ser divertida sin convertirse en ruido

Aprender debe sentirse ligero.

---

# 63. CORE LOOP

El loop principal:

```text
DESCUBRIR
   ↓
CREAR CURSO
   ↓
APRENDER
   ↓
PRACTICAR
   ↓
RECIBIR FEEDBACK
   ↓
MEJORAR DOMINIO
   ↓
DESBLOQUEAR
   ↓
APRENDER
```

La experiencia ideal debería hacer que el usuario piense:

> "Una lección más."

---

# 64. VISIÓN FUTURA

Eventualmente artop puede evolucionar hacia un sistema donde una persona pueda decir:

> "Quiero aprender a escribir guiones para televisión desde cero."

Y obtener:

```text
Curso personalizado
50 etapas
+1000 lecciones
múltiples tipos de ejercicios
revisiones
exámenes
feedback
audio donde tenga sentido
adaptación continua
```

Todo generado específicamente para su objetivo.

La visión final no es tener una biblioteca infinita de cursos preescritos.

Es tener una máquina capaz de construirlos.

---

# 65. FRASE DEL PRODUCTO

**artop**

> **Aprende cualquier cosa. La IA construye el camino.**

---

# 66. DEFINICIÓN FINAL

artop es una plataforma de aprendizaje generativa que utiliza múltiples modelos de IA para **diseñar, compilar, validar y mantener cursos completos**, utilizando un estado estructurado persistente como fuente de verdad y una interfaz de aprendizaje rápida, visual y accesible.

Su arquitectura se basa en una idea sencilla:

**los modelos pueden cambiar; el curso no debería perderse a sí mismo.**