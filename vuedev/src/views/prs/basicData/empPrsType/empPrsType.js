/*
 * @Author: sunch
 * @Date: 2020-07-20 18:41:57
 * @LastEditTime: 2020-08-05 14:58:31
 * @LastEditors: Please set LastEditors
 * @Description: 人员工资类别列配置
 * @FilePath: /agla-fe-8.50/vuedev/src/views/prs/basicData/empPrsType/empPrsType.js
 */ 
export const defaultColumns = [
    { type: 'checkbox', showOverflow: false, showHeaderOverflow: false, headerAlign: 'center', align: 'center', width: 36 },
    { field: 'orgName', title: '部门名称', headerAlign: 'center', align: 'left', cellRender: { name: 'searchHighLight' }, minWidth: 100 },
    { field: 'typeCode', title: '人员身份', headerAlign: 'center', align: 'left', cellRender: { name: 'searchHighLight' }, minWidth: 100 },
  ]