import { useEffect } from "react";

/**
 * 初始化执行一遍
 * @param {*} fn
 */
function useMount(fn) {
  useEffect(() => {
    fn();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

export default useMount;
