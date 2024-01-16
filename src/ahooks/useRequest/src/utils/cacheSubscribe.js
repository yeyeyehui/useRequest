const listeners = {};
function subscribe(key, listener) {
  if (!listeners[key]) {
    listeners[key] = []
  }
  listeners[key].push(listener);
  return function () {
    const index = listeners[key].indexOf(listener);
    listeners[key].splice(index, 1);
  }
}
function trigger(key, data) {
  if (listeners[key])
    listeners[key].forEach(listener => listener(data));
}
export {
  subscribe,
  trigger
};