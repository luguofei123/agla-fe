/*
 * @Author: sunch
 * @Date: 2020-07-10 10:43:44
 * @LastEditTime: 2020-07-21 09:57:51
 * @LastEditors: Please set LastEditors
 * @Description: 期末结账的列配置
 * @FilePath: /agla-fe-8.50/vuedev/src/views/prs/periodEndClosing/periodEndClosing.js
 */ 
export const defaultColumns = [
    { type: 'checkbox', showOverflow: false, showHeaderOverflow: false, headerAlign: 'center', align: 'center', width: 36 },
    { field: 'prtypeName', title: '工资类别', headerAlign: 'center', align: 'center', minWidth: 100 },
    { field: 'setYear', title: '年度', headerAlign: 'center', align: 'center', minWidth: 100 },
    { field: 'mo', title: '月份', headerAlign: 'center', align: 'center', minWidth: 100 },
    { field: 'payNoMo', title: '月批次', headerAlign: 'center', align: 'center', minWidth: 100 },
    { field: 'closeType', title: '结账类型', headerAlign: 'center', align: 'center', 
      editRender: { 
        name: 'select', 
        options: [{label: '结账到下一月', value: '1'},{label: '结账到下一批次', value: '2'}] 
      },
    minWidth: 100 }
]