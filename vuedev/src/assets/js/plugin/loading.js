import ufLoading from '@/components/common/ufLoading'

export default {
  install(Vue) {
    const LoadingConstructor = Vue.extend(ufLoading)
    let instance = new LoadingConstructor()
    instance.$mount(document.createElement('div'))
    document.body.appendChild(instance.$el)

    Vue.prototype.$showLoading = (content) => {
      instance.show = true
      content ? instance.text = content : instance.text = ''
      setTimeout(() => {
        instance.show = false
      }, 10000) //如果页面未响应hideLoading，10秒后自动隐藏loading
    }

    Vue.prototype.$hideLoading = function () {
      instance.show = false
    }
  },
}
