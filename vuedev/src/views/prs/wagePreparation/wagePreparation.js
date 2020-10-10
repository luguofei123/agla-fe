export const defaultColumns = [
  { field: 'EMP_NAME', title: '姓名', headerAlign: 'center', align: 'center', checked: false, slots: { default: 'linkToDetail' }, cellRender: { name: 'searchHighLight' }, minWidth: 80 },
  { field: 'SEX', title: '性别', headerAlign: 'center', align: 'center', checked: false, cellRender: { name: 'searchHighLight' }, minWidth: 60 },
  { field: 'ORG_CODE_NAME', title: '部门', headerAlign: 'center', align: 'left', checked: false, cellRender: { name: 'searchHighLight' }, minWidth: 100 },
  { field: 'PRTYPE_CODE_NAME', title: '工资类别', headerAlign: 'center', align: 'center', checked: false, cellRender: { name: 'searchHighLight' }, minWidth: 100 },
  { field: 'LEVEL_GRADE_NAME', title: '岗位等级', headerAlign: 'center', align: 'center', checked: false, cellRender: { name: 'searchHighLight' }, minWidth: 100 },
  { field: 'DUTY_GRADE_NAME', title: '职务等级', headerAlign: 'center', align: 'center', checked: false, cellRender: { name: 'searchHighLight' }, minWidth: 100 },
  { field: 'PAY_EDIT_STAT_NAME', title: '工资状态', headerAlign: 'center', align: 'center', checked: false, cellRender: { name: 'searchHighLight' }, minWidth: 100 },
  { field: 'IS_FUGLE', title: '是否领导', headerAlign: 'center', align: 'center', checked: false, cellRender: { name: 'searchHighLight' }, minWidth: 100 },
  // { field: 'SMO', title: '月份', headerAlign: 'center', align: 'center', checked: false, sortable: true, cellRender: { name: 'searchHighLight' }, minWidth: 80 },
  { field: 'EMP_CODE', title: '人员编码', headerAlign: 'center', align: 'left', checked: false, cellRender: { name: 'searchHighLight' }, minWidth: 100 },
  { field: 'IDENTITY_CARD', title: '证件号码', headerAlign: 'center', align: 'left', checked: false, cellRender: { name: 'searchHighLight' }, minWidth: 160 },
  { field: 'BANK_ACC', title: '默认银行账号', headerAlign: 'center', align: 'left', checked: false, cellRender: { name: 'searchHighLight' }, minWidth: 160 },
  { field: 'BANK_ACC_OTHER', title: '其他银行账号', headerAlign: 'center', align: 'left', checked: false, cellRender: { name: 'searchHighLight' }, minWidth: 160 }
]

export const defaultCheckedFields = ['EMP_NAME', 'ORG_CODE_NAME', 'PRTYPE_CODE_NAME', 'PAY_EDIT_STAT_NAME', 'SMO']

export const defaultExportFormat = ['姓名', '性别', '部门', '工资类别', '岗位等级', '职务等级', '工资状态', '是否领导', '月份', '人员编码', '证件号码', '默认银行账号', '其他银行账号']

export const empDetailColumns = [
  { title: '序号', width: 50, headerAlign: 'center', align: 'center', type: 'seq' },
  { field: 'columnName', title: '工资项目名称', headerAlign: 'center', align: 'center', minWidth: 100 },
  { field: 'value', title: '值', headerAlign: 'center', align: 'right', minWidth: 100, editRender: { name: 'editInput' } }
]
