import axios from 'axios';
import cache from '../cache.js';
import qs from 'querystring';

const BASE_URL = 'https://earthquake.usgs.gov/fdsnws/event/1/query'; // API docs :contentReference[oaicite:0]{index=0}

/**
 * Fetch list of earthquakes, caching by the exact parameter string.
 * @param {object} params  Accepts USGS query params – e.g. { starttime: '2025-05-01', endtime: '2025-05-19', format:'geojson' }
 */
export async function fetchEarthquakes(params) {
  // ensure GeoJSON (easier to consume)
  const p = { format: 'geojson', ...params };
  const cacheKey = `list:${qs.stringify(p)}`;

  const cached = cache.get(cacheKey);
  if (cached) return cached;

  const { data } = await axios.get(BASE_URL, { params: p });
  cache.set(cacheKey, data);
  return data;
}

/**
 * Fetch a single event by USGS eventid.
 * @param {string} id
 */
export async function fetchEarthquakeById(id) {
  const cacheKey = `id:${id}`;

  const cached = cache.get(cacheKey);
  if (cached) return cached;

  const { data } = await axios.get(BASE_URL, {
    params: { format: 'geojson', eventid: id }
  });
  cache.set(cacheKey, data);
  return data;
}
