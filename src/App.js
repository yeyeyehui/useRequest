import React from "react";

import { useRequest, clearCache } from "./ahooks";

let counter = 0;

function getName(suffix = "") {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      //reject(new Error('请求失败'));
      //resolve('yehui' + (suffix));
      resolve({
        data: "yehui" + ++counter,
        time: new Date().toLocaleTimeString(),
      });
    }, 2000);
  });
}

function User() {
  const { data, loading, refresh } = useRequest(getName, {
    cacheKey: "cacheKey",
    // loadingDelay: 1000, // 延迟loading加载
    // pollingInterval: 1000, // 1000毫秒轮询一次
    // pollingWhenHidden: false, // 页面切换后台，进行轮询
    // debounceWait: 1000, // 1000毫秒内再次输入取消上一次请求
    // throttleWait: 1000, // 1000毫秒内只能请求一次
    // retryCount: 3, // 错误重试，最多三次
  });

  if (!data || loading) {
    return <div>加载中....</div>;
  }

  return (
    <>
      <p>后台加载中{loading ? "true" : "false"}</p>
      <button onClick={refresh}>更新</button>
      <p>最后请求的时候{data.time}</p>
      <p>{data.data}</p>
    </>
  );
}

function App() {
  return (
    <>
      <User />
      <hr />
      <User />
    </>
  );
}

export default App;
