import { useRef } from "react";

import depsAreSame from "../utils/depsAreSame";

/**
 * 是 useMemo 或 useRef 的替代品，保持高性能
 * @param {*} factory 依赖项改变需要被执行的函数
 * @param {*} deps 触发更新的依赖项
 * @returns
 */
function useCreation(factory, deps) {
  const { current } = useRef({
    deps,
    obj: undefined, // factory函数执行后返回的结果
    initialized: false, // 是否初始化过
  });

  // 没被初始化过或者依赖项发生变化触发，浅比较
  if (current.initialized === false || !depsAreSame(current.deps, deps)) {
    // 更新依赖项
    current.deps = deps;

    // 存储factory函数返回的结果
    current.obj = factory();

    // 已被初始化过
    current.initialized = true;
  }

  return current.obj;
}

export default useCreation;
