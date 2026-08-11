# EMALBOT - Asistente Virtual Educativo

**EMALBOT** es la plataforma oficial de asistencia virtual de la **Escuela N° 2702 EMAL** (Escuela Municipal de Alfabetización y Educación de Jóvenes y Adultos). Diseñada específicamente para acompañar a nuestra comunidad educativa, EMALBOT integra inteligencia avanzada con los documentos y normativas oficiales de la institución.

## 🚀 Propósito

El objetivo de EMALBOT es facilitar el acceso a la información institucional y brindar apoyo pedagógico a los estudiantes en sus trayectorias escolares.

- **Área Institucional:** Consultas sobre requisitos de inscripción, trámites de secretaría, horarios de atención y documentación necesaria.
- **Área Educativa:** Acompañamiento en contenidos curriculares (Matemáticas, NTICx, Ciencias Sociales, etc.), explicación de conceptos y generación de ejercicios de práctica.

## 🛠️ Tecnología y Eficiencia (RAG)

Para optimizar recursos y garantizar la veracidad de la información, EMALBOT utiliza una arquitectura de **Generación Aumentada por Recuperación (RAG)**. 

En lugar de depender exclusivamente de una IA externa, el sistema consulta primero la base de conocimientos propia de la escuela y las carpetas de materiales en **Google Drive**. Esto permite:
1.  **Precisión:** Las respuestas se basan en documentos reales de la Escuela 2702.
2.  **Ahorro:** Se reduce drásticamente el uso de tokens al enviar solo la información relevante al modelo.
3.  **Privacidad:** Los datos sensibles permanecen en el ecosistema institucional.

## 💻 Desarrollo Local

**Requisitos:** Node.js (v18+)

1.  Instalar dependencias:
    ```bash
    npm install
    ```
2.  Configurar variables de entorno:
    Crea un archivo `.env` basado en `.env.example` con tu `GEMINI_API_KEY`.
3.  Iniciar en modo desarrollo:
    ```bash
    npm run dev
    ```

## 🌐 Despliegue en Vercel

Este proyecto está preparado para ser desplegado en Vercel. Al conectar el repositorio, asegúrate de:
- Configurar el **Build Command:** `npm run build`
- Configurar el **Output Directory:** `dist`
- Añadir la variable de entorno `GEMINI_API_KEY`.

---
*Gestión Educativa - Escuela N° 2702 EMAL*
