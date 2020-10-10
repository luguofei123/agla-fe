/*
 * @Author: sunch
 * @Date: 2020-07-15 13:41:46
 * @LastEditTime: 2020-07-17 13:37:22
 * @LastEditors: Please set LastEditors
 * @Description: 列设置
 * @FilePath: /agla-fe-8.50/vuedev/src/views/prs/periodEndClosing/components/SendMsgModal.js
 */ 
export const defaultColumns = [
    { type: 'checkbox', headerAlign: 'center', align: 'center', width: 36 },
    { field: 'orgName', title: '部门', headerAlign: 'center', align: 'left', cellRender: { name: 'searchHighLight' }, minWidth: 100 },
    { field: 'empCode', title: '人员编码', headerAlign: 'center', align: 'left', cellRender: { name: 'searchHighLight' }, minWidth: 100 },
    { field: 'empName', title: '姓名', headerAlign: 'center', align: 'left', cellRender: { name: 'searchHighLight' }, minWidth: 80   },
    { field: 'sex', title: '性别', headerAlign: 'center', align: 'center', cellRender: { name: 'searchHighLight' }, width: 80 },
    { field: 'identityCode', title: '证件号码', headerAlign: 'center', align: 'left', cellRender: { name: 'searchHighLight' }, minWidth: 140 }
]