import xTableExport from '@/components/xTableExport'

export default {
  install(Vue) {
    const ExportConstructor = Vue.extend(xTableExport)
    let instance = new ExportConstructor()
    instance.$mount(document.createElement('div'))
    document.body.appendChild(instance.$el)

    Vue.prototype.$xTableExport = (opt) => {
      if(opt.title) instance.title = opt.title
      if(opt.data) instance.tableData = opt.data
      if(opt.topInfo) instance.topInfo = opt.topInfo
      if(opt.columns) instance.columns = opt.columns
      instance.openExport = true
    }
  },
}
