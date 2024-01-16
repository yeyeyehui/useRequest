import useLatest from "../../useLatest";

import useUpdate from "../../useUpdate";

import useCreation from "../../useCreation";

import useMount from "../../useMount";

import useMemoizedFn from "../../useMemoizedFn";

import Fetch from "./Fetch";

import useUnmount from "../../useUnmount";

/**
 *
 * @param {*} service // service请求方法
 * @param {*} options 参数
 *  options.manual 默认 false。 即在初始化时自动执行 service
 *  options.defaultParams	首次默认执行时，传递给 service 的参数
 *  options.onBefore	service 执行前触发
 *  options.onSuccess	service resolve 时触发
 *  options.onError	service reject 时触发
 *  options.onFinally	service 执行完成时触发
 * @param {*} plugins 插件
 * @returns
 */
function useRequestImplement(service, options, plugins) {
  const { manual, ...rest } = options;

  const fetchOptions = { manual, ...rest };

  const serviceRef = useLatest(service);

  const update = useUpdate();

  // 使用useCreation为new Fetch做缓存
  // fetchInstance是new Fetch实例
  const fetchInstance = useCreation(() => {
    // 循环调用plugin的onInit方法获取插件的initStates
    const initStates = plugins
      .map((p) => p?.onInit?.(fetchOptions))
      .filter(Boolean);

    //把每个插件返回的初始状态进行累加成一个最终的初始状态
    return new Fetch(
      serviceRef,
      fetchOptions,
      update,
      Object.assign({}, ...initStates)
    );
  }, []);

  fetchInstance.options = fetchOptions;

  fetchInstance.pluginImpls = plugins.map((p) =>
    p(fetchInstance, fetchOptions)
  );

  useMount(() => {
    // 如果没被初始化过并且manual === false，就执行一次初始化请求
    if (!manual) {
      // 获取请求参数
      const params = fetchInstance.state.params || options.defaultParams || [];

      // 发起请求
      fetchInstance.run(...params);
    }
  });

  // 卸载的时候取消当前正在进行的请求
  useUnmount(() => fetchInstance.cancel());

  return {
    loading: fetchInstance.state.loading, // service 是否正在执行
    data: fetchInstance.state.data, // service 返回的数据
    error: fetchInstance.state.error, // service 抛出的异常
    run: useMemoizedFn(fetchInstance.run.bind(fetchInstance)), // 手动触发 service 执行
    runAsync: useMemoizedFn(fetchInstance.runAsync.bind(fetchInstance)), // 与 run 用法一致，但返回的是 Promise，需要自行处理异常
    refresh: useMemoizedFn(fetchInstance.refresh.bind(fetchInstance)), // 使用上一次的 params，重新调用 run
    refreshAsync: useMemoizedFn(fetchInstance.refreshAsync.bind(fetchInstance)), // 使用上一次的 params，重新调用 runAsync
    mutate: useMemoizedFn(fetchInstance.mutate.bind(fetchInstance)), // 直接修改 data
    cancel: useMemoizedFn(fetchInstance.cancel.bind(fetchInstance)), // 取消当前正在进行的请求
    params: fetchInstance.state.params || [], // 当次执行的 service 的参数数组
  };
}

export default useRequestImplement;
