/*
 * @Author: your name
 * @Date: 2020-08-12 15:41:24
 * @LastEditTime: 2020-08-14 13:42:38
 * @LastEditors: Please set LastEditors
 * @Description: 列配置
 * @FilePath: /agla-fe-8.50/vuedev/src/views/prs/wageChangesTable/columnsConfig.js
 */

export const defaultColumns = [
  { field: 'empCode', title: '人员代码', headerAlign: 'center', align: 'left', checked: false, sortable: true, cellRender: { name: 'searchHighLight' }, minWidth: 100 },
  { field: 'empName', title: '姓名', headerAlign: 'center', align: 'left', checked: false, sortable: true, cellRender: { name: 'searchHighLight' }, minWidth: 100 },
  { field: 'yearMo', title: '月份', headerAlign: 'center', align: 'left', checked: false, sortable: true, cellRender: { name: 'searchHighLight' }, minWidth: 80 },
  { field: 'prtypeName', title: '工资类别', headerAlign: 'center', align: 'left', checked: false, sortable: true, cellRender: { name: 'searchHighLight' }, minWidth: 100 },
  { field: 'orgName', title: '部门', headerAlign: 'center', align: 'left', checked: false, sortable: true, cellRender: { name: 'searchHighLight' }, minWidth: 100 },
]

export const defaultExportFormat = ['人员编码', '姓名', '月份', '工资类别', '部门']

export const defaultCheckedFields = ['empCode', 'empName', 'yearMo', 'prtypeName', 'orgName']
