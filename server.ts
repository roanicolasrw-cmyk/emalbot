import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import express from 'express';
import app from './api/index';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3000;

if (!process.env.VERCEL) {
  if (process.env.NODE_ENV !== 'production') {
    createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    }).then(vite => {
      app.use(vite.middlewares);
      app.listen(PORT, '0.0.0.0', () => {
        console.log(`EMALBOT Server running on http://localhost:${PORT}`);
      });
    }).catch(err => {
      console.error('Error starting Vite dev server:', err);
    });
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      if (!req.path.startsWith('/api')) {
        res.sendFile(path.join(distPath, 'index.html'));
      }
    });
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`EMALBOT Server running on http://localhost:${PORT}`);
    });
  }
}

export default app;
