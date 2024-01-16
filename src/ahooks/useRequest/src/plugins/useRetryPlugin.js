
import { useRef } from 'react';
function useRetryPlugin(fetchInstance,
  { retryCount, retryInterval }) {
  const timerRef = useRef();///定时器，什么时候重试
  const countRef = useRef();//计数器，重试的次数
  const triggerByRetry = useRef(false);//布尔值，表示此请求是否是重新请求
  if (!retryCount) {
    return {};
  }
  return {
    onBefore() {
      if (!triggerByRetry.current) {
        countRef.current = 0;
      }
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    },
    onSuccess() {
      countRef.current = 0;
    },
    onError() {
      countRef.current += 1;
      //如果没有到达最大的重试次数retryCount=-1重试无数次 
      if (retryCount === -1 || countRef.current <= retryCount) {
        //1s 2s 4s 8s 16s 32s
        const timeout = retryInterval || Math.min(30000, 1000 * 2 ** countRef.current)
        timerRef.current = setTimeout(() => {
          triggerByRetry.current = true;
          fetchInstance.refresh();
        }, timeout);
      } else {
        countRef.current = 0;
      }
    },
    onCancel() {
      countRef.current = 0;
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    }
  }
}
export default useRetryPlugin;