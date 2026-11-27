import { GoogleGenAI } from '@google/genai';
import { generateLocalRagResponse } from '../src/utils/localRag';

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido. Usar POST.' });
  }

  const startTime = Date.now();
  const body = req.body || {};
  const {
    message = '',
    area = 'institucional',
    subject,
    chatHistory = [],
    simplifyMode = false,
    generateExercise = false
  } = body;

  const rawQuery = message || `${subject || ''} consulta escolar`;

  const apiKey = process.env.GEMINI_API_KEY;
  let ai: GoogleGenAI | null = null;
  if (apiKey) {
    try {
      ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build'
          }
        }
      });
    } catch {
      ai = null;
    }
  }

  // Fallback baseline synthesized response
  const localFallback = generateLocalRagResponse(
    rawQuery,
    area,
    subject,
    [],
    simplifyMode,
    generateExercise
  );

  if (ai) {
    try {
      const systemInstruction = `
Eres EMALBOT, el asistente conversacional oficial con IA de la Escuela N° 2702 EMAL ("Escuela Municipal de Alfabetización y Educación de Jóvenes y Adultos N° 2702").

DATOS INSTITUCIONALES CLAVE:
- Prioridad actual: MATRÍCULA 2027 - INSCRIPCIONES ABIERTAS (cierre de año lectivo).
- Horario oficial de Secretaría: Lunes a Viernes de 19:15 a 22:15 hs en Güemes 710.
- Nómina de Profesores: Nuevas Tecnologías (Prof. Roa Nicolás, Módulos 1 y 2), Matemáticas (Prof. Zaneta Sebastián, Módulos 1 a 4), Lengua (Prof. Evans Erika, Módulos 1 a 4), Inglés, Cs. Sociales, Cs. Naturales (Prof. Mundaca Yamila, Módulos 1 a 4), Ed. Física y Salud, y EDI (Módulos 1 y 2).

PRINCIPIOS:
1. En el Área Institucional, aclara que las decisiones finales administrativas corresponden a Secretaría y Dirección (19:15 a 22:15 hs).
2. En el Área Educativa, explica con paciencia, lenguaje claro y ejemplos de la vida cotidiana.
3. Si el usuario solicita un ejercicio de práctica, incluye enunciado, pista y solución explicada paso a paso.
`;

      let promptText = rawQuery;
      if (simplifyMode) {
        promptText = `Explicame esto con palabras sencillas y ejemplos cotidianos: ${rawQuery}`;
      } else if (generateExercise) {
        promptText = `Proponé un ejercicio práctico relacionado con ${subject || area}, con enunciado, pista y solución paso a paso.`;
      }

      const historyFormatted = (chatHistory || []).slice(-6).map((h: any) => ({
        role: h.role === 'user' ? 'user' : 'model',
        parts: [{ text: h.content || '' }]
      }));

      const contents = [
        ...historyFormatted,
        { role: 'user', parts: [{ text: promptText }] }
      ];

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents,
        config: {
          systemInstruction,
          temperature: 0.4,
          maxOutputTokens: 1200
        }
      });

      const responseText = response.text || localFallback.text;

      return res.status(200).json({
        text: responseText,
        sources: localFallback.sources,
        suggestedFollowUps: localFallback.suggestedFollowUps,
        ragTrace: {
          ...localFallback.ragTrace,
          generationMode: 'gemini-api',
          processingMs: Date.now() - startTime
        },
        timestamp: new Date().toISOString()
      });
    } catch (apiErr: any) {
      console.warn('Gemini API call failed, using local RAG:', apiErr?.message);
    }
  }

  return res.status(200).json({
    text: localFallback.text,
    sources: localFallback.sources,
    suggestedFollowUps: localFallback.suggestedFollowUps,
    ragTrace: localFallback.ragTrace,
    timestamp: new Date().toISOString()
  });
}
