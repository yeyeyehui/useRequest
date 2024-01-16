const cachePromise = new Map();
const setCachePromise = (key, promise) => {
  cachePromise.set(key, promise);
  promise.finally(() => {
    cachePromise.delete(key);
  });
}
const getCachePromise = (key) => {
  return cachePromise.get(key);
}
export {
  setCachePromise,
  getCachePromise
}
//key='cacheKey' key=['key1','key2']