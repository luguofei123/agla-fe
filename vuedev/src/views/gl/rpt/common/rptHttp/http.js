/**
 * 项目中所有的接口都写在此模块中，外部可以按需import引入。(不要全部引入)
 * import { getAdminList, postAdminUser } from '@/service/service.js'
 */

import axios from '@/assets/js/http'
import qs from 'qs'
import md5 from 'js-md5'
import common from '@/assets/js/common'
import store from '@/store/index'

// HttpType
export const HTTP_TYPE = {
  GET: 0,
  POST: 1,
  GET_POST: 3,
  DELETE: 4
}

/**
 * 网络请求的总方法
 * @param {String} type 
 * @param {String} url 
 * @param {Object} params 
 * @param {Object} opt 
 * @param {String} urlParams 
 * @param {Boolean} tokenBo params是否带上token
 */
export const rptAxios = (type, url, params, opt, urlParams, tokenBo) => { // urlParams直接拼接到url后
  if (urlParams) url += urlParams
  const commonData = store.state.pfData
  params.ajax = 1
  params.roleId = commonData.svRoleId
  params.rueicode = md5(commonData.svUserCode)
  if(tokenBo){
    params.tokenid = commonData.token
  }
  axios.defaults.headers.common['Content-Type'] = 'application/json;charset=UTF-8'
  return new Promise((resolve, reject) => {
    switch (type) {
      case HTTP_TYPE.GET:
        axios.get(spliceApiUrl(url, params), opt)
          .then(result => {
            resolve(result)
          })
          .catch(error => {
            reject(error.response)
          })
        break
      case HTTP_TYPE.POST:
        axios.post(spliceApiUrl(url, params), qs.stringify(opt),{headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}})
          .then(result => {
            resolve(result)
          })
          .catch(error => {
            reject(error.response)
          })
        break
      case HTTP_TYPE.GET_POST:
          axios.post(spliceApiUrl(url, params), opt)
            .then(result => {
              resolve(result)
            })
            .catch(error => {
              reject(error.response)
            })
          break
      case HTTP_TYPE.DELETE:
          axios({
            method: 'delete',
            url: url,
            data: params
          }).then(result=>{
            resolve(result)
          }).catch(error => {
            reject(error.response)
          })
        break
      }
  })
}

// GET方法拼接url参数
const spliceApiUrl = (apiUrl, params) => {
  let url = '?'
  for (const key in params) {
    if (params.hasOwnProperty(key)) {
      url += key + '=' + params[key] + '&'
    }
  }
  url = url.substring(0, url.length - 1)
  return apiUrl + url
}
