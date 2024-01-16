import { useRef, useMemo } from "react";

/**
 * 是持久化 function 的 Hook，理论上，可以使用 useMemoizedFn 完全代替 useCallback
 * @param {*} fn 需要被持久化的函数
 * @returns
 */
function useMemoizedFn(fn) {
  const fnRef = useRef(fn);

  // 当fn变化的时候执行useMemo
  fnRef.current = useMemo(() => fn, [fn]);
  
  const memoizedFn = useRef();
  
  if (!memoizedFn.current) {
    // 把fnRef.current给memoizedFn.current
    memoizedFn.current = function (...args) {
      return fnRef.current.apply(this, args);
    };
  }

  // memoizedFn.current永远不会变，所以永远不会更新
  return memoizedFn.current;
}

export default useMemoizedFn;
