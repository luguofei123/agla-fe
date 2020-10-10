/*
 * @Author: sunch
 * @Date: 2020-04-13 16:15:15
 * @LastEditTime: 2020-06-06 13:43:52
 * @LastEditors: Please set LastEditors
 * @Description: 部门工资汇总表 固定显示的列
 * @FilePath: /ufgov-vue/src/views/prs/report/wageOrgReport/wageOrgReport.js
 */
export const defaultColumns = [
    { field: 'orgCodeName', title: '部门', headerAlign: 'center', align: 'left', checked: false, sortable: true, cellRender: { name: 'searchHighLight' }, minWidth: 100 },
    { field: 'smo', title: '月份', headerAlign: 'center', align: 'center', checked: false, sortable: true, cellRender: { name: 'searchHighLight' }, minWidth: 80 }
  ]

export const defaultExportFormat = ['姓名', '性别', '部门', '工资类别', '岗位等级', '职务等级', '工资状态', '是否领导', '月份', '人员编码', '证件号码', '默认银行账号', '其他银行账号']

export const defaultCheckedFields = ['orgCodeName', 'smo']
