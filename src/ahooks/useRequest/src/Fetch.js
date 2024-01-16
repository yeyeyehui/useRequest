/**
 * Fetch是普通的类，不是一个类组件 React.Component
 */
class Fetch {
  /**
   *
   * @param {*} serviceRef service请求方法
   * @param {*} options
   *  options.manual 默认 false。 即在初始化时自动执行 service
   *  options.defaultParams	首次默认执行时，传递给 service 的参数
   *  options.onBefore	service 执行前触发
   *  options.onSuccess	service resolve 时触发
   *  options.onError	service reject 时触发
   *  options.onFinally	service 执行完成时触发
   * @param {*} subscribe 更新组件方法
   * @param {*} initialState plugin的initStates
   */
  constructor(serviceRef, options, subscribe, initialState = {}) {
    this.serviceRef = serviceRef;

    this.options = options;

    this.subscribe = subscribe;

    this.state = {
      loading: !options.manual, // service 是否正在执行
      data: undefined, // service 返回的数据
      error: undefined, // 	service 抛出的异常
      params: undefined, // 当次执行的 service 的参数数组
      ...initialState, // plugin的initStates
    };

    this.count = 0; //定义一个类的实例属性计数器，默认值是0
  }

  /**
   * 更新state
   * @param {*} s 新的state
   */
  setState(s = {}) {
    this.state = { ...this.state, ...s };

    // 更新组件
    this.subscribe();
  }

  /**
   * 开始跑异步 service
   * @param  {...any} params 传递给 service 的参数
   * @returns
   */
  async runAsync(...params) {
    // 记录次数
    this.count += 1;

    // 当前执行次数
    const currentCount = this.count;

    const { stopNow, returnNow, ...state } = this.runPluginHandler(
      "onBefore",
      params
    );

    if (stopNow) {
      return new Promise(() => {});
    }

    // 准备开始请求了
    this.setState({ loading: true, params, ...state });

    if (returnNow) {
      return Promise.resolve(state.data);
    }

    // 执行请求前的前置函数调用，可以用于修改params
    this.options.onBefore?.(params);

    try {
      // 执行所有插件的onRequest方法
      let { servicePromise } = this.runPluginHandler(
        "onRequest",
        this.serviceRef.current,
        params
      );

      // 如果没有service方法，就拿之前存储的
      if (!servicePromise) {
        servicePromise = this.serviceRef.current(...params);
      }

      // 执行获取结果
      const res = await servicePromise;

      // 有新的请求或者请求取消了
      if (currentCount !== this.count) {
        return new Promise(() => {});
      }

      // 拿到结果修改状态等数据
      this.setState({ loading: false, data: res, error: undefined, params });

      // 请求成功触发
      this.options.onSuccess?.(res, params);

      // 执行所有插件的onSuccess方法
      this.runPluginHandler("onSuccess", res, params);

      // 请求完成触发
      this.options.onFinally?.(res, params);

      // 有新的请求或者请求取消了
      if (currentCount === this.count)
        this.runPluginHandler("onFinally", params, res, undefined);
    } catch (error) {
      if (currentCount !== this.count) {
        return new Promise(() => {});
      }

      // 拿到结果修改状态等数据
      this.setState({ loading: false, data: undefined, error, params });

      // service reject 时触发
      this.options.onError?.(error, params);

      // 执行所有插件的onError方法
      this.runPluginHandler("onError", error, params);

      // service 执行完成时触发
      this.options.onFinally?.(error, params);

      // 执行所有插件的onFinally方法
      if (currentCount === this.count)
        this.runPluginHandler("onFinally", params, undefined, error);

      // 抛异常
      throw error;
    }
  }

  /**
   * 执行 service 方法
   * @param  {...any} params 传递给 service 的参数
   */
  run(...params) {
    this.runAsync(...params).catch((error) => {
      // 请求报错
      if (!this.options.onError) {
        console.error(error);
      }
    });
  }

  // 取消当前正在进行的请求
  cancel() {
    this.count += 1;

    this.setState({ loading: false });

    this.options.onCancel?.();

    // 执行所有插件的onCancel方法
    this.runPluginHandler("onCancel");
  }

  /**
   * 使用上一次的 params，重新调用 run
   */
  refresh() {
    this.run(this.state.params || []);
  }

  /**
   * 使用上一次的 params，重新调用 runAsync
   */
  refreshAsync() {
    this.runAsync(this.state.params || []);
  }

  /**
   * 直接修改 data
   * @param {*} data 新的打他
   */
  mutate(data) {
    // 执行所有插件的onMutate方法
    this.runPluginHandler("onMutate", data);

    this.setState({
      data,
    });
  }

  /**
   * 拿到所有的插件，执行event变量方法
   * @param {*} event 方法名
   * @param  {...any} rest 参数
   * @returns
   */
  runPluginHandler(event, ...rest) {
    const r = this.pluginImpls.map((i) => i[event]?.(...rest)).filter(Boolean);
    return Object.assign({}, ...r);
  }
}

export default Fetch;
