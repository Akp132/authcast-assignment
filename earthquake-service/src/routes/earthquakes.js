import express from 'express';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { fetchEarthquakes, fetchEarthquakeById } from '../services/usgs.js';

dotenv.config();

const router = express.Router();

const limiter = rateLimit({
  windowMs: (process.env.RATE_LIMIT_WINDOW || 60) * 1000,
  max: process.env.RATE_LIMIT_MAX || 30,
  standardHeaders: true,
  legacyHeaders: false
});

// Utility to render earthquake list as HTML
function renderEarthquakeList(data) {
  const features = data.features || [];
  const listItems = features.map(f => `
    <li>
      <strong>Magnitude:</strong> ${f.properties.mag} <br/>
      <strong>Place:</strong> ${f.properties.place} <br/>
      <strong>Time:</strong> ${new Date(f.properties.time).toLocaleString()} <br/>
      <a href="/earthquakes/${f.id}">View Details</a>
    </li>
  `).join('<hr/>');

  return `
    <html>
    <head>
      <title>Earthquake Data</title>
      <style>
        body { font-family: Arial; padding: 20px; background: #f4f4f4; }
        h1 { color: #222; }
        li { margin-bottom: 20px; }
        a { text-decoration: none; color: #0066cc; }
      </style>
    </head>
    <body>
      <h1>🌍 Earthquake Data</h1>
      <ul>${listItems}</ul>
      <a href="/">⬅ Back to Home</a>
    </body>
    </html>
  `;
}

// Utility to render earthquake details as HTML
function renderEarthquakeDetails(data) {
  const props = data.properties || {};
  return `
    <html>
    <head>
      <title>Earthquake Details</title>
      <style>
        body { font-family: Arial; padding: 20px; background: #f4f4f4; }
        h1 { color: #222; }
        p { line-height: 1.6; }
        a { text-decoration: none; color: #0066cc; }
      </style>
    </head>
    <body>
      <h1>📌 Earthquake Details</h1>
      <p><strong>Magnitude:</strong> ${props.mag}</p>
      <p><strong>Place:</strong> ${props.place}</p>
      <p><strong>Time:</strong> ${new Date(props.time).toLocaleString()}</p>
      <p><strong>Status:</strong> ${props.status}</p>
      <p><strong>Tsunami:</strong> ${props.tsunami}</p>
      <p><strong>Alert Level:</strong> ${props.alert || 'N/A'}</p>
      <p><a href="${props.url}" target="_blank">🌐 View on USGS Site</a></p>
      <br/>
      <a href="/earthquakes">⬅ Back to Earthquake List</a>
    </body>
    </html>
  `;
}

// GET /earthquakes (HTML List View)
router.get('/', limiter, async (req, res, next) => {
  try {
    const data = await fetchEarthquakes(req.query);
    res.send(renderEarthquakeList(data));
  } catch (err) {
    next(err);
  }
});

// GET /earthquakes/:id (HTML Detail View)
router.get('/:id', limiter, async (req, res, next) => {
  try {
    const data = await fetchEarthquakeById(req.params.id);
    res.send(renderEarthquakeDetails(data));
  } catch (err) {
    next(err);
  }
});

export default router;
