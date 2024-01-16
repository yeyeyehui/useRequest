import { useRef } from "react";


/**
 * 保证拿到的数据一直是最新的，避免闭包导致数据不是最新的
 * @param {*} value 最新的值
 * @returns 
 */
function useLatest(value) {
  const ref = useRef(value);

  ref.current = value;

  return ref;
}

export default useLatest;
