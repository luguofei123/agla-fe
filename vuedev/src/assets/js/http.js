/**
 * http配置
 */

import axios from 'axios'
import store from '@/store/index.js'
import router from '../../router'

// axios 配置
axios.defaults.timeout = 60000;//60秒超时
//history模式baseURL有变化
const HOST = window.location.protocol + '//' + window.location.host
// 继承85平台 不在使用vue-cli服务的代理 所以不需要指定代理替换的url
// axios.defaults.baseURL = (process.env.NODE_ENV === 'development'? HOST + '/' + process.env.VUE_APP_BASEAPIADDR : HOST)
axios.defaults.baseURL = HOST
//如果使用hash模式
// axios.defaults.baseURL = process.env.VUE_APP_BASEAPIADDR;

// http request 拦截器
axios.interceptors.request.use(
    config => {
        // !!!请求头在单独请求中处理 这里处理会覆盖所有请求
        // config.headers['Content-Type'] = 'application/json;charset=UTF-8';
        config.headers['x-function-id'] = store.state.menuid;
        return config;
    },
    err => {
        return Promise.reject(err);
    });

// http response 拦截器
axios.interceptors.response.use(
    response => {
        // console.log(response);
        if(typeof(response.data)==="string"){
            //development模式下请求账表接口token失效情况
            if(process.env.NODE_ENV==="development"&&response.data.indexOf('msgtimeout，用户信息为空，请求tokenid为')>-1){
                router.replace({
                    path: '/loginProxy'
                });
            }
        }
        if(process.env.NODE_ENV==="development"&&response.headers['content-type']==='text/html'){
            router.replace({
                path: '/loginProxy'
            });
        }else{
            return response;
        }
        /****************************/
        // let result = response.data;
        // if (result.errorCode == '999000') {
        //     //   console.log(result);
        //     console.log(result.errorCode);
        //     store.commit(types.LOGOUT);
        //     router.replace({
        //         path: 'login',
        //         query: {
        //             redirect: router.currentRoute.fullPath
        //         }
        //     });
        // } else {
        //     return response;
        // }

    },
    error => {
        console.log("---------------");
        console.log(error);
        console.log(error.response)
        // if (error.response) {
        //     switch (error.response.status) {
        //         case 404:
        //             console.log('response.status: 404');
        //             // 401 清除token信息并跳转到登录页面
        //             store.commit(types.LOGOUT);
        //             router.replace({
        //                 path: 'login',
        //                 query: {
        //                     redirect: router.currentRoute.fullPath
        //                 }
        //             });
        //     }
        // }
        return Promise.reject(error.response.status+' '+error.response.statusText);
    });

export default axios;
