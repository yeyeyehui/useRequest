import { useEffect, useRef } from "react";

function useDebouncePlugin(fetchInstance, { throttleWait }) {
  const throttleRef = useRef();
  useEffect(() => {
    if (throttleWait) {
      const originRunAsync = fetchInstance.runAsync.bind(fetchInstance);
      throttleRef.current = throttle((callback) => callback(), throttleWait);
      fetchInstance.runAsync = (...args) => {
        return new Promise((resolve, reject) => {
          throttleRef.current?.(() =>
            originRunAsync(...args).then(resolve, reject)
          );
        });
      };
    }
  }, [throttleWait, fetchInstance]);
  return {};
}

function throttle(fn, interval) {
  let lastTime = 0;
  return function (...args) {
    const currentTime = Date.now();
    const nextTime = lastTime + interval;
    if (currentTime >= nextTime) {
      fn.apply(this, args);
      lastTime = currentTime;
    }
  };
}
export default useDebouncePlugin;
