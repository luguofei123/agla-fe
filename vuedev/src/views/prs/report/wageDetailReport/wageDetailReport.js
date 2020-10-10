export const defaultColumns = [
  { field: 'empName', title: '姓名', headerAlign: 'center', align: 'center', checked: false, sortable: true, cellRender: { name: 'searchHighLight' }, minWidth: 100 },
  { field: 'sex', title: '性别', headerAlign: 'center', align: 'center', checked: false, sortable: true, cellRender: { name: 'searchHighLight' }, minWidth: 80 },
  { field: 'orgCodeName', title: '部门', headerAlign: 'center', align: 'left', checked: false, sortable: true, cellRender: { name: 'searchHighLight' }, minWidth: 100 },
  { field: 'prtypeCodeName', title: '工资类别', headerAlign: 'center', align: 'center', checked: false, sortable: true, cellRender: { name: 'searchHighLight' }, minWidth: 100 },
  { field: 'levelGradeName', title: '岗位等级', headerAlign: 'center', align: 'center', checked: false, sortable: true, cellRender: { name: 'searchHighLight' }, minWidth: 100 },
  { field: 'dutyGradeName', title: '职务等级', headerAlign: 'center', align: 'center', checked: false, sortable: true, cellRender: { name: 'searchHighLight' }, minWidth: 100 },
  { field: 'payEditStatName', title: '工资状态', headerAlign: 'center', align: 'center', checked: false, cellRender: { name: 'searchHighLight' }, minWidth: 100 },
  { field: 'isFugle', title: '是否领导', headerAlign: 'center', align: 'center', checked: false, sortable: true, cellRender: { name: 'searchHighLight' }, minWidth: 100 },
  { field: 'smo', title: '月份', headerAlign: 'center', align: 'center', checked: false, sortable: true, cellRender: { name: 'searchHighLight' }, minWidth: 80 },
  { field: 'empCode', title: '人员编码', headerAlign: 'center', align: 'left', checked: false, sortable: true, cellRender: { name: 'searchHighLight' }, minWidth: 100 },
  { field: 'identityCard', title: '证件号码', headerAlign: 'center', align: 'left', checked: false, sortable: true, cellRender: { name: 'searchHighLight' }, minWidth: 160 },
  { field: 'bankAcc', title: '默认银行账号', headerAlign: 'center', align: 'left', checked: false, sortable: true, cellRender: { name: 'searchHighLight' }, minWidth: 180 },
  { field: 'bankAccOther', title: '其他银行账号', headerAlign: 'center', align: 'left', checked: false, sortable: true, cellRender: { name: 'searchHighLight' }, minWidth: 180 }
]

export const defaultExportFormat = ['姓名', '性别', '部门', '工资类别', '岗位等级', '职务等级', '工资状态', '是否领导', '月份', '人员编码', '证件号码', '默认银行账号', '其他银行账号']

export const defaultCheckedFields = ['empName', 'orgCodeName', 'prtypeCodeName', 'payEditStatName', 'smo']