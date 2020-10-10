/*
 * @Author: sunch
 * @Date: 2020-07-15 13:49:30
 * @LastEditTime: 2020-08-11 14:58:58
 * @LastEditors: Please set LastEditors
 * @Description: 显示错误
 * @FilePath: /agla-fe-8.50/vuedev/src/assets/js/plugin/showError.js
 */

export default {
  install: function(Vue) {
    Vue.prototype.$showError = (error) => {
      Vue.prototype.$hideLoading()
      //开发模式下查看错误
      console.log(error)
      if(error) Vue.prototype.$message.error(error) 
    }
  },
}
