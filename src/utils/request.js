// 1、引入axios以及相关文件
import axios from 'axios'
import Base64 from 'base-64';
import Vue from 'vue';
import { initRouter } from '@/router'
import store from '@/store'
var currentRouter = initRouter();
// 2、创建axios实例
let boeService = axios.create({
  baseURL: process.env.VUE_APP_API_BASE_URL,
  timeout: 90000
})

// 3、axios的请求拦截--request
boeService.interceptors.request.use(config => {
  const token_type = sessionStorage.getItem('token_type');
  const token = sessionStorage.getItem('access_token');
  const routerCode = sessionStorage.getItem('routerCode');
  // 将routerCode存放到header中
  if (routerCode) {
    config.headers.routerCode = routerCode;
  }
  // 请求成功处理
  if (sessionStorage.getItem('token')) {//判断浏览器中的cookie中是否存在项目的token
    config.headers.token = sessionStorage.getItem('token')
  }
  let clientId = process.env.VUE_APP_API_CLIENTID;
  let clientSecret = process.env.VUE_APP_CLIENT_SECRET;
  let headerLogin = clientId + ':' + clientSecret;
  if (config.url.indexOf('oauth/token') > 0 || config.url.indexOf('getToken') > 0) {
    config.headers.Authorization = 'Basic ' + Base64.encode(headerLogin); // 增加客户端认证
  } else if (token_type && token) {
    config.headers.Authorization = token_type + ' ' + token;
  }
  return config;
}, err => {
  Promise.reject(err);// 请求错误处理
})

//4、axios的返回拦截--response
boeService.interceptors.response.use(response => Promise.resolve(response), err => {
  if (err && err.response && err.response.status) {
    switch (err.response.status) {
      case 401:
        if (process.env.NODE_ENV === "production") {
          sessionStorage.clear();
          // currentRouter.push("/login");
          window.location.href = process.env.VUE_APP_LOGIN_URL + 'client_id=' + process.env.VUE_APP_CLIENTID + '&response_type=' + process.env.VUE_APP_RESPONSE_TYPE + '&redirect_uri=' + process.env.VUE_APP_REDIRECT_URI;
        } else {
          sessionStorage.clear();
          setTimeout(() => {
            currentRouter.replace({
              path: '/login'
            });
          }, 1000);
        }
        break;
      case 500:
        if (err.response.config.url.indexOf('check_token') > -1) {
          sessionStorage.clear();
          currentRouter.push("/login");
          // window.location.href = process.env.VUE_APP_LOGIN_URL + 'client_id=' + process.env.VUE_APP_CLIENTID + '&response_type=' + process.env.VUE_APP_RESPONSE_TYPE + '&redirect_uri=' + process.env.VUE_APP_REDIRECT_URI;
        } else {
          // Vue.prototype.$antMessage.warn('请求方法：' + err.response.data.path + '失败，' + (err.response.data.msg || err.response.data.message) + '，请联系管理员');
          return
        }
        break;
      case 404:
        // Vue.prototype.$antMessage.warn('请求方法：' + err.response.data.path + '失败，' + (err.response.data.msg || err.response.data.message) + '，请联系管理员')
        break;
      case 400:
        // Vue.prototype.$antMessage.warn('请求方法：' + err.response.data.path + '失败，' + (err.response.data.msg || err.response.data.message) + '，请联系管理员')
        break;
    }
  }
  return Promise.reject(err);
})

//5、get请求的封装
export function get(url, params = {}) {
  return new Promise((resolve, reject) => {
    boeService({
      url: url,
      method: 'get',
      params: params
    }).then(res => {
      if(res) {
        if (res.data.code != 20000) {
          // 20020  用于激活优惠券-不需要message提醒
          if (res.data.code != 20017 && res.data.code != 20020) {
            Vue.prototype.$antMessage.warn(res.data.message)
          }
          reject(res.data);
        } else {
          resolve(res.data);
        }
      } else {
        resolve(res);
      }
    }).catch(err => {
      // 只做状态码为200的报错提示
      if (err.response.status == 200) {
        Vue.prototype.$antMessage.warn(err.response.data.msg || err.response.data.message)
        // 返回回调，方便后续各种操作
        reject(err);
      } else if (err.response.status != 200) {
        reject(err);
      }
    })
  })
}

//6、post请求封装  默认json格式:'Content-Type':'application/json',如果是文件上传，可以修改headers为 headers: { 'Content-Type': 'multipart/form-data' }
export function post(url, params = {}, headers = { 'Content-Type': 'application/json' }) {
  return new Promise((resolve, reject) => {
    boeService({
      url: url,
      method: 'post',
      data: params,
      headers: headers
    }).then(res => {
      if(res) {
        if (res.data.code != 20000) {
          // 20020  用于激活优惠券-不需要message提醒
          if (res.data.code != 20020) {
            Vue.prototype.$antMessage.warn(res.data.message);
          }
          reject(res.data);
        } else {
          resolve(res.data);
        }
      } else {
        resolve(res);
      }
    }).catch(err => {
      // 只做状态码为200的报错提示
      if (err.response.status == 200) {
        Vue.prototype.$antMessage.warn(err.response.data.msg || err.response.data.message)
        // 返回回调，方便后续各种操作
        reject(err);
      } else if (err.response.status != 200) {
        reject(err);
      }
    })
  })
}
//7、post请求封装---下载excel文件流专用
export function postExcel(url, params = {}, headers = { 'Content-Type': 'application/json' }) {
  return new Promise((resolve, reject) => {
    boeService({
      url: url,
      method: 'post',
      data: params,
      headers: headers,
      responseType: 'arraybuffer'
    }).then(res => {
      let errData = undefined
      try {
        let enc = new TextDecoder('utf-8')
        errData = JSON.parse(enc.decode(new Uint8Array(res.data)))
      } catch (err) { }
      if (errData) {
        Vue.prototype.$antMessage.warn(errData.message);
        reject(errData);
      } else {
        resolve(res.data);
      }
      resolve()
    }).catch(err => {
      reject(err);
    })
  })
}

//7、baseURL 供图片预览使用
export const baseUrlUseForImg = boeService.defaults.baseURL

//8、将模块暴露
export default {
  get,
  post,
  baseUrlUseForImg
}
