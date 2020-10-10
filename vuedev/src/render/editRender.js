import VXETable from 'vxe-table'
import { formatMoney } from '@/assets/js/util'
// 创建一个简单输入框渲染器
VXETable.renderer.add('editInput', {
  autofocus: '.my-cell',
  // 可编辑激活模板
  renderEdit(h, renderOpts, { row, column }) {
    // console.log(row[column.property])
    if(row[column.property]==0){
      row[column.property] = ''
    }
    return [<input class="my-cell" type="number" v-model={row[column.property]} onMousewheel={ (e) => {
      e.preventDefault()
    } } />]
  },
  // 可编辑显示模板
  renderCell(h, renderOpts, { row, column }) {
    if (row[column.property] == 0) {
      return ''
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
