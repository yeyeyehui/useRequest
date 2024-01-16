import { useRef } from "react";

import useUpdateEffect from "../../../useUpdateEffect";

import isDocumentVisible from "../utils/isDocumentVisible";

import subscribeReVisible from "../utils/subscribeReVisible";

/**
 * 请求轮询
 * @param {*} fetchInstance
 * @param {*} pollingInterval // 轮询时间
 * @param {*} pollingWhenHidden // 页面切换后台，进行轮询
 * @returns
 */
function usePollingPlugin(
  fetchInstance,
  { pollingInterval, pollingWhenHidden }
) {
  // 存储轮询定时器
  const timeRef = useRef();

  // 用户切换后台，是否需要继续轮询
  const unsubscribeRef = useRef();

  /**
   * 关闭轮训定时器
   */
  const stopPolling = () => {
    if (timeRef.current) clearTimeout(timeRef.current);

    // 删除订阅事件
    unsubscribeRef.current?.();
  };

  useUpdateEffect(() => {
    // 没有值，取消轮询
    if (!pollingInterval) {
      stopPolling();
    }
    return () => console.log("stopPolling");
  }, [pollingInterval]);

  // 没有轮询参数，直接结束
  if (!pollingInterval) {
    return {};
  }

  return {
    onBefore() {
      // 请求前关闭定时器
      stopPolling();
    },

    // 执行完成时触发
    onFinally() {
      // pollingWhenHidden：如果设置为页面不可见的不轮询
      // isDocumentVisible：当前页面是否切到后台
      if (!pollingWhenHidden && !isDocumentVisible()) {
        //在此做一个订阅，订阅页面可见的事件，页面可见之后继续轮询
        unsubscribeRef.current = subscribeReVisible(() =>
          fetchInstance.refresh()
        );
        return;
      }

      // 创建定时器
      timeRef.current = setTimeout(() => {
        // 使用上一次的参数发送请求
        fetchInstance.refresh();
      }, pollingInterval);
    },

    onCancel() {
      // 请求失败关闭定时器
      stopPolling();
    },
  };
}
export default usePollingPlugin;
