import Vue from 'vue'
import VXETable from 'vxe-table'
import XEUtils from 'xe-utils'

import filterMoneyInput from '../components/tableRender/filterMoneyInput.vue'
import FilterInput from '../components/tableRender/FilterInput.vue'

Vue.component(filterMoneyInput.name, filterMoneyInput)
Vue.component(FilterInput.name, FilterInput)

VXETable.renderer.add('filterMoneyInput', {
  // 筛选模板
  renderFilter (h, renderOpts, params) {
    return [
      <filter-money-input params={ params }></filter-money-input>
    ]
  },
  // 筛选方法
  filterMethod ({ option, row, column }) {
    // console.log(option, row, column)
    let { minAmount, maxAmount } = option
    // console.log(minAmount, maxAmount)
    let cellValue = XEUtils.get(row, column.property)
    cellValue = Number(String(cellValue).replace(/,/g, ''))
    minAmount = Number(String(minAmount).replace(/,/g, ''))
    maxAmount = Number(String(maxAmount).replace(/,/g, ''))
    // console.log(cellValue,minAmount,maxAmount);
    return cellValue >= minAmount && cellValue <= maxAmount
  }
})

VXETable.renderer.add('FilterInput', {
  // 筛选模板
  renderFilter (h, renderOpts, params) {
    return [
      <filter-input params={ params } opts={ renderOpts } ></filter-input>
    ]
  },
  // 筛选方法
  filterMethod ({ option, row, column }) {
    const { data } = option
    const cellValue = XEUtils.get(row, column.property)
    return XEUtils.toString(cellValue).indexOf(data) > -1
  }
})
