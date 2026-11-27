import { GoogleGenAI } from '@google/genai';

export default function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.status(200).json({ ok: true, genAiAvailable: typeof GoogleGenAI === 'function' });
}
