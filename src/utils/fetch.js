import axios from 'axios'
// // 测试
// let baseApi = process.env.API_ROOT;
// 线上测试
// let baseApi = 'http://spore.zertone2.com/app';

// let baseApi = 'https://app.kouhigh.com/app';//正式接口
// let baseApi = 'http://kh.kouhigh.com/app';//最新正式接口
// let baseApi = 'https://app.kouhigh.com/app';
// let baseApi = 'http://spore.zertone2.com/app';
// let baseApi = 'http://app.myzzz.top/app';//测试接口
let marketBaseApi = 'http://market.kouhigh.top/app';//二手市场测试接口

// let baseApi = 'http://whf.kouhigh.top/app';//冯海威接口
// let baseApi = 'http://www.myzzz.top/app';

export {marketBaseApi};//二手市场


axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
axios.defaults.headers.get['Content-Type'] = 'application/x-www-form-urlencoded';

const trans = params => {
  // Do whatever you want to transform the data
  let ret = ''
  for (let it in params) {
    ret += encodeURIComponent(it) + '=' + encodeURIComponent(params[it]) + '&'
  }
  return ret;
}
// get 请求
export const getReq = (api, params) => {
  params = params || {};
  params.t = '3';
  if (getCookie('token')) {
    params.token = getCookie('token');
  }
  params = trans(params);
  return axios.get(`${baseApi}${api}?${params}`).then(res => res.data);
};
// 二手市场post请求
export const marketPostReq = (api, params) => {
  params = params || {};
  params.t = '4';
  if (getCookie('token')) {
    params.token = getCookie('token');
  }
  params = trans(params);
  // console.log('post', `http://market.kouhigh.top/app${api}?${params}`);
  return axios.post(`${marketBaseApi}${api}`, params).then(res => res.data);
};

