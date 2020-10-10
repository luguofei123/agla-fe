/*
 * @Author: sunch
 * @Date: 2020-07-15 15:43:21
 * @LastEditTime: 2020-07-21 10:26:15
 * @LastEditors: Please set LastEditors
 * @Description: 新增账户信息 表格列
 * @FilePath: /agla-fe-8.50/vuedev/src/views/ma/personalAccountManage/components/AddAccount.js
 */ 
export const defaultColumns = [
    { title: '序号', width: 50, headerAlign: 'center', align: 'center', type: 'seq' },
    { field: 'accountAttrName', title: '账户类别', headerAlign: 'center', align: 'left', cellRender: { name: 'searchHighLight' }, minWidth: 100 },
    { field: 'accountNo', title: '账号', headerAlign: 'center', align: 'left', cellRender: { name: 'searchHighLight' }, minWidth: 200 },
    { field: 'accountName', title: '户名', headerAlign: 'center', align: 'left', cellRender: { name: 'searchHighLight' }, minWidth: 100   },
    { field: 'bankCategoryName', title: '银行类别', headerAlign: 'center', align: 'left', cellRender: { name: 'searchHighLight' }, width: 100 },
    { field: 'bankName', title: '开户银行', headerAlign: 'center', align: 'left', cellRender: { name: 'searchHighLight' }, minWidth: 100 },
    { field: 'province', title: '省份', headerAlign: 'center', align: 'left', cellRender: { name: 'searchHighLight' }, minWidth: 100 },
    { field: 'city', title: '城市', headerAlign: 'center', align: 'left', cellRender: { name: 'searchHighLight' }, minWidth: 100 },
    { field: 'pbcbankno', title: '人行联行号', headerAlign: 'center', align: 'left', cellRender: { name: 'searchHighLight' }, minWidth: 100 },
    { field: 'accountTypeName', title: '账户性质', headerAlign: 'center', align: 'center', cellRender: { name: 'searchHighLight' }, minWidth: 100 },
    { field: 'accountStatusName', title: '账户状态', headerAlign: 'center', align: 'center', cellRender: { name: 'searchHighLight' }, minWidth: 100 },
    { field: 'isReimburseCardName', title: '默认为报销卡', headerAlign: 'center', align: 'center', cellRender: { name: 'searchHighLight' }, minWidth: 100 },
    { field: 'isPrsCardName', title: '默认为工资卡', headerAlign: 'center', align: 'center', cellRender: { name: 'searchHighLight' }, minWidth: 100 }
]