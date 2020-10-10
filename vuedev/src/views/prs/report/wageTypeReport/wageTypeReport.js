/*
 * @Author: sunch
 * @Date: 2020-04-13 18:28:43
 * @LastEditTime: 2020-06-06 13:27:19
 * @LastEditors: Please set LastEditors
 * @Description: 类别工资汇总表 固定显示列
 * @FilePath: /ufgov-vue/src/views/prs/report/wageTypeReport/wageTypeReport.js
 */
export const defaultColumns = [
    { field: 'prtypeCodeName', title: '类别', headerAlign: 'center', align: 'center', checked: false, sortable: true, cellRender: { name: 'searchHighLight' }, minWidth: 100 },
    { field: 'smo', title: '月份', headerAlign: 'center', align: 'center', checked: false, sortable: true, cellRender: { name: 'searchHighLight' }, minWidth: 80 }
  ]
  export const defaultExportFormat = ['姓名', '性别', '部门', '工资类别', '岗位等级', '职务等级', '工资状态', '是否领导', '月份', '人员编码', '证件号码', '默认银行账号', '其他银行账号']
  
  export const defaultCheckedFields = ['prtypeCodeName', 'smo']