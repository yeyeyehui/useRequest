import { useRef } from "react";

import * as cache from "../utils/cache";

import useCreation from "../../../useCreation";

import * as cachePromise from "../utils/cachePromise";

import * as cacheSubscribe from "../utils/cacheSubscribe";

function useCachePlugin(
  fetchInstance,
  {
    cacheKey,
    staleTime = 0,
    setCache: customSetCache,
    getCache: customGetCache,
  }
) {
  const currentPromiseRef = useRef();
  const unSubscribeRef = useRef();
  const _setCache = (key, cachedData) => {
    if (customSetCache) {
      customSetCache(cachedData);
    } else {
      cache.setCache(key, cachedData);
    }
    cacheSubscribe.trigger(key, cachedData.data);
  };
  const _getCache = (key) => {
    if (customGetCache) {
      return customGetCache(key);
    } else {
      return cache.getCache(key);
    }
  };
  useCreation(() => {
    if (!cacheKey) return;
    const cachedData = _getCache(cacheKey);
    if (cachedData && Object.hasOwnProperty.call(cachedData, "data")) {
      fetchInstance.state.data = cachedData.data;
      fetchInstance.state.params = cachedData.params;
      if (
        staleTime === -1 ||
        new Date().getTime() - cachedData.time <= staleTime
      ) {
        fetchInstance.state.loading = false;
      }
    }
  });
  if (!cacheKey) {
    return {};
  }
  return {
    onBefore(params) {
      const cachedData = _getCache(cacheKey, params);
      if (!cachedData || !Object.hasOwnProperty.call(cachedData, "data")) {
        return {};
      }
      //如果staleTime=-1表示永不过期，或者当前时间减去缓存时间小于等过保质期的话，说明在保质期内
      if (
        staleTime === -1 ||
        new Date().getTime() - cachedData.time <= staleTime
      ) {
        return {
          loading: false,
          data: cachedData.data,
          returnNow: true,
        };
      } else {
        return {
          data: cachedData.data,
        };
      }
    },
    onRequest(service, args) {
      let servicePromise = cachePromise.getCachePromise(cacheKey);
      if (servicePromise && servicePromise !== currentPromiseRef.current) {
        return {
          //缓存里有，和自己的不一样，用缓存中的
          servicePromise,
        };
      }
      servicePromise = service(...args);
      currentPromiseRef.current = servicePromise;
      cachePromise.setCachePromise(cacheKey, servicePromise);
      return {
        servicePromise,
      };
    },
    onSuccess(data, params) {
      if (cacheKey) {
        _setCache(cacheKey, {
          data, //请求返回的数据
          params, //请求的参数
          time: new Date().getTime(), //请求返回的时间
        });
        unSubscribeRef.current = cacheSubscribe.subscribe(cacheKey, (d) => {
          fetchInstance.setState({ data: d });
        });
      }
    },
  };
}

export default useCachePlugin;
