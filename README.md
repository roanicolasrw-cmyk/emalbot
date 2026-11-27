<p align="center">
  <img src="public/assets/aistudio/Logo_educativo_azul_EMALBOT_b5d3d995.png" alt="EMALBOT Logo" width="180"/>
</p>

# PROYECTO: EMALBOT — Asistente Educativo e Institucional con IA y Arquitectura RAG

**INSTITUCIÓN:** Escuela N° 2702 EMAL (Escuela Municipal de Alfabetización y Educación de Jóvenes y Adultos N° 2702)

---

## 📋 Resumen del Sistema para Presentación / Stand

### 1. Objetivo del Proyecto
EMALBOT es un asistente conversacional diseñado para acompañar a estudiantes jóvenes y adultos del turno vespertino/noche (19:15 a 22:15 hs). Se divide en dos grandes áreas:
- **Área Institucional (Secretaría):** Requisitos de inscripción, documentación de legajo, constancias de alumno regular, certificados laborales, vacantes y horarios de atención (18:30 a 21:30 hs). Aclara siempre que las decisiones administrativas finales corresponden a Secretaría y Dirección.
- **Área Educativa (Ciclo de Formación Básica):** Matemáticas, Lengua, Ciencias Sociales, Ciencias Naturales, Educación Física y Salud, Nuevas Tecnologías (NTICx) y EDI Plataformas Digitales. Explica con ejemplos cotidianos, genera ejercicios de práctica y permite la lectura de respuestas en voz alta sin reemplazar al docente.

---

### 🔄 Flujo del Sistema (Paso 1 a Paso 5)

#### **PASO 1 — Carga de datos en Google Drive mediante Formulario de Google:**
- Los docentes de cada materia y el personal de Secretaría completan un Formulario de Google sencillo (seleccionan área/materia, módulo, docente a cargo, título y contenido o novedad).
- La información cargada se almacena y organiza automáticamente en la unidad compartida de Google Drive institucional (`REG - Escuela N° 2702 EMAL`), dentro de las carpetas correspondientes: `SECRETARIA`, `FORMACION BASICA` (Módulos 1 a 4) y cada espacio curricular.

#### **PASO 2 — Consulta del Estudiante:**
- El estudiante accede a EMALBOT desde su celular o computadora (por texto o dictado por voz) y realiza una pregunta puntual, por ejemplo: *¿Quién es el profesor de Nuevas Tecnologías?* o *¿Qué documentos necesito para inscribirme?*.

#### **PASO 3 — Recuperación Inteligente con Motor RAG (Retrieval-Augmented Generation):**
En lugar de responder de memoria o inventar datos, el sistema activa el motor RAG:
1. Normaliza la consulta y extrae las palabras clave relevantes.
2. Escanea las carpetas de Google Drive de la escuela y la Base Institucional buscando coincidencias exactas.
3. Calcula un puntaje de relevancia (priorizando documentos recientes cargados vía Formulario de Google / Drive) y extrae los fragmentos oficiales más pertinentes.

#### **PASO 4 — Generación Aumentada con Inteligencia Artificial:**
- El sistema envía la pregunta junto con los fragmentos recuperados del Google Drive al modelo de lenguaje (Gemini IA) con reglas pedagógicas para educación de adultos (lenguaje claro, empático y estructurado).
- Si no hay conectividad externa con la nube, un sintetizador RAG local construye la respuesta directamente a partir de los documentos recuperados mostrando la traza de fuentes.

#### **PASO 5 — Respuesta Verificada, Fuentes y Accesibilidad:**
- El estudiante recibe la respuesta clara, ve exactamente qué archivo de Google Drive fue consultado como fuente, puede pedir **"Explicar más simple"**, generar un **"Ejercicio de práctica"** o **escuchar la explicación en voz alta**.

---

## 💻 Desarrollo Local

**Requisitos:** Node.js (v18+)

1. Instalar dependencias:
   ```bash
   npm install
   ```
2. Configurar variables de entorno:
   Crea un archivo `.env` basado en `.env.example` con tu `GEMINI_API_KEY`.
3. Iniciar en modo desarrollo:
   ```bash
   npm run dev
   ```

## 🚀 Despliegue en Vercel

Este proyecto está preparado para ser desplegado en Vercel:
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Variable de entorno:** `GEMINI_API_KEY`

---
*Gestión Educativa - Escuela N° 2702 EMAL*
