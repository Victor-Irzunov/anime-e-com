import NodeCache from 'node-cache';
const cache = new NodeCache();

export function setCache(key, value, expirationTimeSeconds) {
  cache.set(key, value, expirationTimeSeconds);
}
export function getCache(key) {
  return cache.get(key);
}
export function clearCache() {
  cache.flushAll();
}



