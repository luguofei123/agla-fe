/*
 * @Author: sunch
 * @Date: 2020-07-08 15:53:02
 * @LastEditTime: 2020-07-26 21:43:59
 * @LastEditors: Please set LastEditors
 * @Description: 个人银行账户列配置
 * @FilePath: /agla-fe-8.50/vuedev/src/views/ma/personalAccountManage/personalAccountManage.js
 */ 
export const defaultColumns = [
    { type: 'checkbox', showOverflow: false, showHeaderOverflow: false, headerAlign: 'center', align: 'center', width: 36 },
    { field: 'orgName', title: '部门', headerAlign: 'center', align: 'left', cellRender: { name: 'searchHighLight' }, minWidth: 100 },
    { field: 'empCode', title: '人员编码', headerAlign: 'center', align: 'left', cellRender: { name: 'searchHighLight' }, minWidth: 100 },
    { field: 'empName', title: '人员姓名', headerAlign: 'center', align: 'left', cellRender: { name: 'searchHighLight' }, minWidth: 100 },
    { field: 'accountAttrName', title: '账户类别', headerAlign: 'center', align: 'center', cellRender: { name: 'searchHighLight' }, minWidth: 100 },
    { field: 'accountNo', title: '账号', headerAlign: 'center', align: 'left', slots: { default: 'editEmpAccount' }, cellRender: { name: 'searchHighLight' }, minWidth: 200 },
    { field: 'accountName', title: '户名', headerAlign: 'center', align: 'left', cellRender: { name: 'searchHighLight' }, minWidth: 100 },
    { field: 'bankCategoryName', title: '银行类别', headerAlign: 'center', align: 'center', cellRender: { name: 'searchHighLight' }, minWidth: 100 },
    { field: 'bankName', title: '开户银行', headerAlign: 'center', align: 'left', cellRender: { name: 'searchHighLight' }, minWidth: 100 },
    { field: 'province', title: '省份', headerAlign: 'center', align: 'center', cellRender: { name: 'searchHighLight' }, minWidth: 100 },
    { field: 'city', title: '城市', headerAlign: 'center', align: 'center', cellRender: { name: 'searchHighLight' }, minWidth: 100 },
    { field: 'pbcbankno', title: '人行联行号', headerAlign: 'center', align: 'left', cellRender: { name: 'searchHighLight' }, minWidth: 100 },
    { field: 'accountTypeName', title: '账户性质', headerAlign: 'center', align: 'center', cellRender: { name: 'searchHighLight' }, minWidth: 100 },
    { field: 'accountStatusName', title: '账户状态', headerAlign: 'center', align: 'center', cellRender: { name: 'searchHighLight' }, minWidth: 100 },
    { field: 'isReimburseCardName', title: '默认为报销卡', headerAlign: 'center', align: 'center', cellRender: { name: 'searchHighLight' }, minWidth: 120 },
    { field: 'isPrsCardName', title: '默认为工资卡', headerAlign: 'center', align: 'center', cellRender: { name: 'searchHighLight' }, minWidth: 120 }
  ]

  export const defaultExportFormat = ['部门', '人员编码', '人员姓名', '账户类别', '账号', '户名', '银行类别', '开户银行', '省份', '城市', '人行联行号', '账户性质', '账户状态', '默认为报销卡', '默认为工资卡']