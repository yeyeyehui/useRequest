/**
 * document.visibilityState !== "hidden"
 * @returns false === 切换后台
 */
function isDocumentVisible() {
  return document.visibilityState !== "hidden";
}

export default isDocumentVisible;
