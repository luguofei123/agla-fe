import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/index'
import axios from './assets/js/http'
import $ from 'jquery'
import moment from 'moment'
import 'moment/locale/zh-cn'
import common from './assets/js/common'
import md5 from 'js-md5'
//全局引入vxe-table
import 'xe-utils';
import _ from 'lodash'
import VXETablePluginExportXLSX from 'vxe-table-plugin-export-xlsx'
import VXETable from 'vxe-table'
import FastClick from 'fastclick'
import Clipboard from 'clipboard'
import { setEmptyRender } from './render/emptyRender'

moment.locale('zh-cn');
FastClick.attach(document.body)
VXETable.use(VXETablePluginExportXLSX)
Vue.use(VXETable)
setEmptyRender(VXETable)
VXETable.setup({
  size: 'mini',
  showOverflow: true,
  showHeaderOverflow: true,
  resizable: true,
  stripe: true,
  border: true,
  grid: {
    size: 'mini',
  },
  customConfig: {
    storage: true
  }
})//绑定到Vue的实例方法上
Vue.prototype.$axios = axios;
Vue.prototype.$ = $;
Vue.prototype.$common = common;
Vue.prototype.$md5 = md5;
Vue.prototype.$lodash = _;
Vue.prototype._ = _;
Vue.prototype.Clipboard = Clipboard
Vue.prototype.NODE_ENV = process.env.NODE_ENV

/* antd部分 开始 */
import './assets/css/antd.less'
// css重写样式部分
import './assets/globalStyle/index.js'
import {
  Button, Icon, Col, Row, Dropdown, Menu, Checkbox, DatePicker,
  Form, Input, InputNumber, Radio, Select, TimePicker, TreeSelect, Tabs, Tooltip, Tree,
  Message, Modal, Progress, Popconfirm, Pagination, LocaleProvider, Upload, Collapse, Popover
} from 'ant-design-vue'
Vue.use(Button)
Vue.use(Icon)
Vue.use(Col)
Vue.use(Row)
Vue.use(Dropdown)
Vue.use(Menu)
Vue.use(Checkbox)
Vue.use(DatePicker)
Vue.use(Form)
Vue.use(Input)
Vue.use(InputNumber)
Vue.use(Radio)
Vue.use(Select)
Vue.use(TimePicker)
Vue.use(TreeSelect)
Vue.use(Tabs)
Vue.use(Tooltip)
Vue.use(Tree)
Vue.use(Progress)
Vue.use(Popconfirm)
Vue.use(Pagination)
Vue.use(LocaleProvider)
Vue.use(Upload)
Vue.use(Collapse)
Vue.use(Popover)
//home页面已不使用这些组件将不加载
// Vue.use(Layout)
// Vue.use(Breadcrumb)
Vue.prototype.$message = Message;
Vue.prototype.$info = Modal.info;
Vue.prototype.$success = Modal.success;
Vue.prototype.$error = Modal.error;
Vue.prototype.$warning = Modal.warning;
Vue.prototype.$confirm = Modal.confirm;
Vue.prototype.$destroyAll = Modal.destroyAll;
/* antd部分 结束 */

/* element-ui部分 开始 */
import { Table, TableColumn, Dialog, Button as elButton, Transfer, Loading as elLoading } from 'element-ui'
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Dialog)
Vue.use(elButton)
Vue.use(Transfer)
Vue.use(elLoading)
/* element-ui部分 结束 */

/* mint-ui部分 开始 */
import { Popup, Picker, Switch, Toast, MessageBox, Indicator } from 'mint-ui'
Vue.component(Popup.name, Popup)
Vue.component(Picker.name, Picker)
Vue.component(Switch.name, Switch)
Vue.prototype.$Toast = Toast
Vue.prototype.$MessageBox = MessageBox
Vue.prototype.$Indicator = Indicator
/* mint-ui部分 结束 */

//自定义公共组件
import globalComponents from './assets/js/plugin/globalComponents'
Vue.use(globalComponents)
import xTableExport from '@/assets/js/plugin/xTableExport'
Vue.use(xTableExport)


Vue.config.productionTip = false

// 开发环境模拟登陆效果
// if (process.env.NODE_ENV === 'development') {
//   let jsessionid = localStorage.getItem('JSESSIONID'),
//   tokenid = localStorage.getItem('tokenid'),
//   username = localStorage.getItem('username')
//   document.cookie = 'JSESSIONID='+ jsessionid
//   document.cookie = 'tokenid='+ tokenid
//   document.cookie = 'username='+ username
// }

common.getCommonData().then(commonData => {
  console.log('vueApp created')
  store.dispatch('setPfData', commonData)
  new Vue({
    router,
    store,
    created: function () {

    },
    render: h => h(App)
  }).$mount('#app')
})