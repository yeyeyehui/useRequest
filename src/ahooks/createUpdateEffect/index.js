import { useRef } from "react";

/**
 * 法等同于 useEffect，但是会忽略首次执行，只在依赖更新时执行
 * @param {*} hook effect
 * @returns
 */
export function createUpdateEffect(hook) {
  /**
   * @param {*} hook effect 回调
   * @param {*} hook deps 依赖项
   */
  return function (effect, deps) {
    const isMounted = useRef(false);

    // 组件卸载，清空isMounted
    hook(() => {
      return () => (isMounted.current = false);
    });

    hook(() => {
      // 第一次执行，不触发回调并且记录，下次可以执行
      if (!isMounted.current) {
        isMounted.current = true;
      } else {
        // 第二次，可以执行
        let destroy = effect();
        return destroy;
      }
    }, deps);
  };
}

/**
 * 为什么要写二次
 * hook isMounted.current = false 这属于内部逻辑
 * return effect();返回用户自定义的销毁函数，也需要执行
 */
