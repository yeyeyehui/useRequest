import { useRef } from "react";

/**
 * 可以延迟 loading 变成 true 的时间，有效防止闪烁
 * @param {*} fetchInstance
 * @param {*} param1
 * @returns
 */
function useLoadingDelayPlugin(fetchInstance, { loadingDelay }) {
  // 存储定时器对象
  const timerRef = useRef();

  // 如果没有延迟，就不需要走了
  if (!loadingDelay) {
    return {};
  }

  // 失败直接清空定时器
  const cancelTimeout = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  return {
    onBefore() {
      //在请求前设置一个定计器,在loadingDelay时间后变成true,当前的loading先设置为true
      timerRef.current = setTimeout(() => {
        fetchInstance.setState({ loading: true });
      }, loadingDelay);

      return { loading: false };
    },

    onFinally() {
      cancelTimeout();
    },

    onCancel() {
      cancelTimeout();
    },
  };
}

export default useLoadingDelayPlugin;
