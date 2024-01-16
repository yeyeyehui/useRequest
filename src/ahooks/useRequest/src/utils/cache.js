const cache = new Map();
const setCache = (key, cachedData) => {
  cache.set(key, { ...cachedData });
}
const getCache = (key) => {
  return cache.get(key);
}
const clearCache = (key) => {
  if (key) {
    if (Array.isArray(key)) {
      key.forEach(item => cache.delete(item));
    } else {
      cache.delete(key);
    }
  } else {
    cache.clear();
  }
}
export {
  setCache,
  getCache,
  clearCache
}
//key='cacheKey' key=['key1','key2']