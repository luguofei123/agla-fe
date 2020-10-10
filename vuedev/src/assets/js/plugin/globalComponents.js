/*
 * @Author: sunch
 * @Date: 2020-08-11 14:41:11
 * @LastEditTime: 2020-08-24 11:17:42
 * @LastEditors: Please set LastEditors
 * @Description: 全局编程式组件和全局组件注册方法
 * @FilePath: /agla-fe-8.50/vuedev/src/assets/js/plugin/globalComponents.js
 */

import ufLoading from '@/components/common/ufLoading'
import ufModalComponents from '@/components/common/ufModal'
import ufLocalLoading from '@/components/common/ufLocalLoading'
import ufMoreBtn from '@/components/common/ufMoreBtn'
import ufPager from '@/components/common/ufPager'
import ufQueryArea from '@/components/common/ufQueryArea'
import ufTab from '@/components/common/ufTab'
import ufTreeSelect from '@/components/common/ufTreeSelect'
import ufAcctSelect from '@/components/common/ufAcctSelect'
import ufAgnencySelect from '@/components/common/ufAgnencySelect'
import ztree from '@/components/common/ztree'
import ufHeader from '@/components/common/ufHeader'

const global = {
  install: function (Vue) {

    /* 公共编程式组件 开始 */

    /* 全局loading的处理 开始 */
    const LoadingConstructor = Vue.extend(ufLoading)
    let instance = new LoadingConstructor()
    instance.$mount(document.createElement('div'))
    document.body.appendChild(instance.$el)

    Vue.prototype.$showLoading = (content) => {
      instance.show = true
      content ? (instance.text = content) : (instance.text = '')
      setTimeout(() => {
        instance.show = false
      }, 10000) //如果页面未响应hideLoading，10秒后自动隐藏loading
    }

    Vue.prototype.$hideLoading = function () {
      instance.show = false
    }
    /* 全局loading的处理 结束 */

    /* 全局报错的处理 开始 */
    Vue.prototype.$showError = (error) => {
      Vue.prototype.$hideLoading()
      //开发模式下查看错误
      console.log(error)
      if (error) Vue.prototype.$message.error(error)
    }
    /* 全局报错的处理 结束 */

    /* 公共编程式组件结束 */

    /* 公共组件 开始 */
    //全局模态窗口
    Vue.component('ufModal', ufModalComponents)
    //组件局部loading
    Vue.component('ufLocalLoading', ufLocalLoading)
    //“更多”展开按钮
    Vue.component('ufMoreBtn', ufMoreBtn)
    //分页器
    Vue.component('ufPager', ufPager)
    //查询区域
    Vue.component('ufQueryArea', ufQueryArea)
    //页签
    Vue.component('ufTab', ufTab)
    //下拉树
    Vue.component('ufTreeSelect', ufTreeSelect)
    //单位账套树
    Vue.component('ufAcctSelect', ufAcctSelect)
    //单位树
    Vue.component('ufAgnencySelect', ufAgnencySelect)
    //ztree
    Vue.component('ztree', ztree)
    //页面头部
    Vue.component('ufHeader', ufHeader)

    /* 公共组件 结束 */
  },
}

export default global
