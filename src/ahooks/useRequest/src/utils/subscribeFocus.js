import isDocumentVisible from './isDocumentVisible';
const listeners = [];
function subscribe(listener) {
  listeners.push(listener);
  return function () {
    const index = listeners.indexOf(listener);
    listeners.splice(index, 1);
  }
}
function revalidate() {
  if (!isDocumentVisible()) return;
  listeners.forEach(l => l());
}
window.addEventListener('visibilitychange', revalidate);
window.addEventListener('focus', revalidate);
export default subscribe;