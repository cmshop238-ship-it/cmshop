import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { paymentRouter } from './server/payment/routes';
import { apiRouter } from './server/routes/api';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // API Health Check
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      service: 'CM Luxury Real E-Commerce Engine',
      version: '2.0.0',
      timestamp: new Date().toISOString(),
    });
  });

  // REST API Router (Products, Orders, Auth, Coupons, Reviews, Inventory, Settings)
  app.use('/api', apiRouter);

  // Dedicated Payment Gateway Router
  app.use('/api/payments', paymentRouter);

  // Vite middleware for development vs static build serving for production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`CM Luxury Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start CM Luxury Server:', err);
  process.exit(1);
});
