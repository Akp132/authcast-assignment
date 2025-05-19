import NodeCache from 'node-cache';
import dotenv from 'dotenv';
dotenv.config();

const cacheTTL = parseInt(process.env.CACHE_TTL || '300', 10);   // 5 min default
const cache = new NodeCache({ stdTTL: cacheTTL, checkperiod: cacheTTL / 2 });

export default cache;
