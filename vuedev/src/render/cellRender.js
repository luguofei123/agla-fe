/*
 * @Author: sunch
 * @Date: 2020-03-05 18:38:33
 * @LastEditTime: 2020-08-28 15:06:49
 * @LastEditors: Please set LastEditors
 * @Description: ！！！重要！！！单元格渲染器的结果将不能直接用于全表搜索，可v-model绑定到表格数据里！！！目前没有可获取到渲染后数据的方法！！！
 * @FilePath: /ufgov-vue/src/render/cellRender.js
 */

import VXETable from 'vxe-table'
import XEUtils from 'xe-utils'
import { formatMoney } from '@/assets/js/util'

VXETable.renderer.add('sex', {
  // 默认显示模板
  renderDefault(h, renderOpts, params) {
    let { row, column } = params
    const cellValue = XEUtils.get(row, column.property)
    // console.log(cellValue)
    let sexName = '未知'
    if (cellValue === '0') {
      sexName = '女'
    } else if (cellValue === '1') {
      sexName = '男'
    } else {
      sexName = '未知'
    }
    return sexName
  }
})
VXETable.renderer.add('searchHighLight', {
  /**
   * @description: 
   * @param {Function} h(a,b,c,d)
   * @param {Object} {name}
   * @param {Object} 
   */
  renderDefault(h, renderOpts, params) {
    let { row, column } = params
    let cellValue = XEUtils.get(row, column.property)
    // console.log(cellValue)
    if(row.highlight&&column.property===row.highlight){
      return [<span style="background-color: #ff0">{cellValue}</span>]
    }else{
      return cellValue
    }
  }
})
VXETable.renderer.add('moneyHighLight', {
  /**
   * @description: 
   * @param {Function} h(a,b,c,d)
   * @param {Object} {name}
   * @param {Object} 
   */
  renderDefault(h, renderOpts, { row, column }) {
    if (row[column.property] == 0) {
      return formatMoney(String(row[column.property]).replace(/,/g, ''))
      // return ''
    }
    if (row.highlight && column.property === row.highlight) {
      if (row[column.property] != '') {
        let cellValue = formatMoney(String(row[column.property]).replace(/,/g, ''))
        return [<span style="background-color: #ff0">{cellValue}</span>]
      }else{
        return ''
      }
    } else {
      if (row[column.property]&&row[column.property] != '') {
        return formatMoney(String(row[column.property]).replace(/,/g, ''))
      }else{
        return ''
      }
    }
  }
})
VXETable.renderer.add('amt', {
  /**
   * @description: 默认显示模板
   * @param {Function} h(a,b,c,d)
   * @param {Object} {name}
   * @param {Object} 
   */
  renderDefault(h, renderOpts, params) {
    // console.log(h, renderOpts, params)
    let { row, column } = params
    // console.log(row, column)
    let cellValue = XEUtils.get(row, column.property)
    // console.log(cellValue)
    function formatMoney(s) {
        var n = 2;
        if (!Number(s)) return '0.00';
        var firstChar = String(s).charAt(0);
        s = String(s).replace(/[^\d.]/g, '');
    
        n = n > 0 && n <= 20 ? n : 2;
        s = parseFloat((s + "").replace(/[^\d.-]/g, "")).toFixed(n) + "";
        var l = s.split(".")[0].split("").reverse(),
          r = s.split(".")[1];
        var t = "";
        for (var i = 0; i < l.length; i++) {
          t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");
        }
        s = t.split("").reverse().join("") + "." + r;
        if (firstChar == '-') {
          s = '-' + s;
        }
        return s;
      }
      cellValue = formatMoney(cellValue);

    return [<span class="cell-vhtml-amt">${ cellValue }</span>]
  }
})

VXETable.renderer.add('yorn', {
  // 默认显示模板
  renderDefault(h, renderOpts, params) {
    let { row, column } = params
    const cellValue = XEUtils.get(row, column.property)
    let str = '否'
    if (cellValue === 'Y') {
      str = '是'
    }
    return str
  }
})
