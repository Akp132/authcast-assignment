import express from 'express';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import earthquakeRoutes from './routes/earthquakes.js';

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

// Correct Static File Serving Configuration
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicPath = path.join(__dirname, '../public');

app.use(express.static(publicPath)); // Serve static files first
app.use(morgan('dev'));
app.use('/earthquakes', earthquakeRoutes);

// Default Route to Landing Page
app.get('/', (req, res) => {
  res.sendFile(path.join(publicPath, 'index.html'));
});

// 404 Handler
app.use((req, res) => res.status(404).json({ error: 'Not found' }));

// Error Handler
app.use((err, req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(port, () => console.log(`⚡ Server running at http://localhost:${port}`));
