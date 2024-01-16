import { useEffect, useRef } from "react";

/**
 * 请求防抖，debounceWait秒内再次输入就不发送请求
 * @param {*} fetchInstance
 * @param {*} param1
 * @returns
 */
function useDebouncePlugin(fetchInstance, { debounceWait }) {
  const debounceRef = useRef();

  useEffect(() => {
    // 有防抖时间
    if (debounceWait) {
      const originRunAsync = fetchInstance.runAsync.bind(fetchInstance);

      // 设置定时器
      debounceRef.current = debounce((callback) => callback(), debounceWait);

      fetchInstance.runAsync = (...args) => {
        return new Promise((resolve, reject) => {
          debounceRef.current?.(() =>
            originRunAsync(...args).then(resolve, reject)
          );
        });
      };
    }
  }, [debounceWait, fetchInstance]);

  return {};
}

function debounce(fn, wait) {
  let timer;
  return function (...args) {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => fn(...args), wait);
  };
}

export default useDebouncePlugin;
