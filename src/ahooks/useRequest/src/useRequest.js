import useRequestImplement from "./useRequestImplement";

import useLoadingDelayPlugin from "./plugins/useLoadingDelayPlugin";

import usePollingPlugin from "./plugins/usePollingPlugin";

import useDebouncePlugin from "./plugins/useDebouncePlugin";

import useThrottlePlugin from "./plugins/useThrottlePlugin";

import useRetryPlugin from "./plugins/useRetryPlugin";

import useCachePlugin from "./plugins/useCachePlugin";

// import useLoggerPlugin from './plugins/useLoggerPlugin';

function useRequest(service, options, plugins = []) {
  return useRequestImplement(service, options, [
    ...plugins,
    useLoadingDelayPlugin, // 延迟loading加载
    usePollingPlugin, // 请求轮询
    useDebouncePlugin, // 防抖
    useThrottlePlugin, // 节流
    useRetryPlugin, // 错误重试
    useCachePlugin, // 请求缓存
    // useLoggerPlugin, // 日志插件
  ]);
}

export default useRequest;
