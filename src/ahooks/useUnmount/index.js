import useLatest from "../useLatest";

import { useEffect } from "react";

/**
 * 函数卸载的时候执行
 * @param {*} fn
 */
function useUnmount(fn) {
  const fnRef = useLatest(fn);

  useEffect(() => {
    // 组件卸载的时候执行
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      fnRef.current();
    };
  }, [fnRef]);
}

export default useUnmount;
