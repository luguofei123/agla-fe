import Vue from 'vue'
import VXETable from 'vxe-table'
import XEUtils from 'xe-utils'

import filterInput from '../components/filterInput.vue'
import filterMoney from '../components/filterMoney.vue'

Vue.component(filterInput.name, filterInput)
Vue.component(filterMoney.name, filterMoney)

// 创建一个支持输入的筛选器（仅用于简单示例，实际开发中应该封装成一个组件，不应该把复杂的渲染逻辑写在渲染器中）
VXETable.renderer.add('filterInput', {
  // 筛选模板
  renderFilter (h, renderOpts, params) {
    return [
      <filter-input params={ params }></filter-input>
    ]
  },
  // 筛选方法
  filterMethod ({ option, row, column }) {
    const { data } = option
    const cellValue = XEUtils.get(row, column.property)
    /* eslint-disable eqeqeq */
    if (cellValue.indexOf(data) >= 0) {
      return cellValue
    }
  }
})

VXETable.renderer.add('filterMoney', {
  // 不显示底部按钮，使用自定义的按钮
  isFooter: false,
  // 筛选模板
  renderFilter (h, renderOpts, params) {
    return [
      <filter-money params={ params } type={ params.column.filters[0].data.type }></filter-money>
    ]
  },
  // 筛选方法
  filterMethod ({ option, row, column }) {
    let { data } = option
    let { minAmount, maxAmount } = data
    let cellValue = XEUtils.get(row, column.property)
    cellValue = Number(String(cellValue).replace(',', ''))
    minAmount?minAmount = Number(String(minAmount).replace(',', '')): minAmount=0
    maxAmount = Number(String(maxAmount).replace(',', ''))
    return cellValue >= minAmount && cellValue <= maxAmount
  },
  //筛选重置函数
  filterResetMethod({ options}){
    // console.log(options)
    options.forEach(option => {
      option.data = { minAmount: '', maxAmount: '' }
    })
  }
})
