import { useCallback, useState } from "react";

/**
 * 返回一个函数，调用该函数会强制组件重新渲染
 * @returns
 */
function useUpdate() {
  const [, setState] = useState({});

  // 避免生成新的函数
  return useCallback(() => setState({}), []);
}

export default useUpdate;
