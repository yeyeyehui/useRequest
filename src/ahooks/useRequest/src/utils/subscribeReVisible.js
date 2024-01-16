import isDocumentVisible from "./isDocumentVisible";

const listeners = [];

/**
 * 当页面重新显示的时候，进行轮询时间的订阅
 * @param {*} listener
 * @returns
 */
function subscribe(listener) {
  // 订阅事件
  listeners.push(listener);

  return function () {
    // 删除订阅事件
    const index = listeners.indexOf(listener);

    listeners.splice(index, 1);
  };
}

function revalidate() {
  // 页面不可见
  if (!isDocumentVisible()) return;

  // 发布事件
  listeners.forEach((l) => l());
}

// 当页面可见的事件执行
window.addEventListener("visibilitychange", revalidate);

export default subscribe;
