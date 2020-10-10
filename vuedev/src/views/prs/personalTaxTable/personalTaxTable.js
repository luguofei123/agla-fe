/*
 * @Author: sunch
 * @Date: 2020-05-09 14:36:00
 * @LastEditTime: 2020-05-21 10:17:37
 * @LastEditors: Please set LastEditors
 * @Description: 多表头
 * @FilePath: /ufgov-vue/src/views/prs/personalTaxTable/personalTaxTable.js
 */
export const defaultColumns = [
  { field: 'empName', fixed: 'left', title: '姓名', headerAlign: 'center', align: 'center', sortable: true, cellRender: { name: 'searchHighLight' }, minWidth: 80 },
  { field: 'identityType', title: '身份证类型', headerAlign: 'center', align: 'center', sortable: true, cellRender: { name: 'searchHighLight' }, minWidth: 100 },
  { field: 'identityCode', title: '身份证号码', headerAlign: 'center', align: 'center', sortable: true, cellRender: { name: 'searchHighLight' }, minWidth: 180 },
  { field: 'taxpayerIdentity', title: '纳税人识别号', headerAlign: 'center', align: 'center', sortable: true, cellRender: { name: 'searchHighLight' }, minWidth: 180 },
  { field: 'isResident', title: '是否为非居民个人', headerAlign: 'center', align: 'center', sortable: true, cellRender: { name: 'searchHighLight' }, minWidth: 80 },
  { field: 'projectName', title: '所得项目', headerAlign: 'center', align: 'center', sortable: true, cellRender: { name: 'searchHighLight' }, minWidth: 100 },
  {
    title: '本月（次）情况',
    headerAlign: 'center',
    align: 'center',
    children: [
      {
        title: '收入额计算',
        headerAlign: 'center',
        align: 'center',
        children: [
          { field: 'income', title: '收入', headerAlign: 'center', align: 'center', sortable: true, minWidth: 100, filters: [{ data: '' }], filterRender: { name: 'filterMoneyInput' }, cellRender: { name: 'moneyHighLight' } },
          { field: 'cost', title: '费用', headerAlign: 'center', align: 'center', sortable: true, minWidth: 100, filters: [{ data: '' }], filterRender: { name: 'filterMoneyInput' }, cellRender: { name: 'moneyHighLight' } },
          { field: 'exemptedIncome', title: '免税收入', headerAlign: 'center', align: 'center', sortable: true, minWidth: 100, filters: [{ data: '' }], filterRender: { name: 'filterMoneyInput' }, cellRender: { name: 'moneyHighLight' } },
        ],
      },
      { field: 'reliefCost', title: '减除费用', headerAlign: 'center', align: 'center', sortable: true, minWidth: 100, filters: [{ data: '' }], filterRender: { name: 'filterMoneyInput' }, cellRender: { name: 'moneyHighLight' } },
      {
        title: '专项扣除',
        headerAlign: 'center',
        align: 'center',
        children: [
          { field: 'basicPension', title: '基本养老保险费', headerAlign: 'center', align: 'center', sortable: true, minWidth: 100, filters: [{ data: '' }], filterRender: { name: 'filterMoneyInput' }, cellRender: { name: 'moneyHighLight' } },
          { field: 'basicMedicalIns', title: '基本医疗保险费', headerAlign: 'center', align: 'center', sortable: true, minWidth: 100, filters: [{ data: '' }], filterRender: { name: 'filterMoneyInput' }, cellRender: { name: 'moneyHighLight' } },
          { field: 'unemploymentIns', title: '失业保险费', headerAlign: 'center', align: 'center', sortable: true, minWidth: 100, filters: [{ data: '' }], filterRender: { name: 'filterMoneyInput' }, cellRender: { name: 'moneyHighLight' } },
          { field: 'housingFund', title: '住房公积金', headerAlign: 'center', align: 'center', sortable: true, minWidth: 100, filters: [{ data: '' }], filterRender: { name: 'filterMoneyInput' }, cellRender: { name: 'moneyHighLight' } },
        ],
      },
      {
        title: '其他扣除',
        headerAlign: 'center',
        align: 'center',
        children: [
          { field: 'annuity', title: '年金', headerAlign: 'center', align: 'center', sortable: true, minWidth: 100, filters: [{ data: '' }], filterRender: { name: 'filterMoneyInput' }, cellRender: { name: 'moneyHighLight' } },
          { field: 'commercialHealthIns', title: '商业健康保险', headerAlign: 'center', align: 'center', sortable: true, minWidth: 100, filters: [{ data: '' }], filterRender: { name: 'filterMoneyInput' }, cellRender: { name: 'moneyHighLight' } },
          { field: 'taxDelayPension', title: '税延养老保险', headerAlign: 'center', align: 'center', sortable: true, minWidth: 100, filters: [{ data: '' }], filterRender: { name: 'filterMoneyInput' }, cellRender: { name: 'moneyHighLight' } },
          { field: 'property', title: '财产原值', headerAlign: 'center', align: 'center', sortable: true, minWidth: 100, filters: [{ data: '' }], filterRender: { name: 'filterMoneyInput' }, cellRender: { name: 'moneyHighLight' } },
          { field: 'allowDeductOtherTax', title: '允许扣除的税费', headerAlign: 'center', align: 'center', sortable: true, minWidth: 100, filters: [{ data: '' }], filterRender: { name: 'filterMoneyInput' }, cellRender: { name: 'moneyHighLight' } },
          { field: 'other', title: '其他', headerAlign: 'center', align: 'center', sortable: true, minWidth: 100, filters: [{ data: '' }], filterRender: { name: 'filterMoneyInput' }, cellRender: { name: 'moneyHighLight' } },
        ],
      },
    ],
  },
  {
    title: '累计情况',
    headerAlign: 'center',
    align: 'center',
    children: [
      { field: 'accumulatedIncome', title: '累计收入额', headerAlign: 'center', align: 'center', sortable: true, minWidth: 100, filters: [{ data: '' }], filterRender: { name: 'filterMoneyInput' }, cellRender: { name: 'moneyHighLight' } },
      { field: 'addDeduct', title: '累计减除费用', headerAlign: 'center', align: 'center', sortable: true, minWidth: 100, filters: [{ data: '' }], filterRender: { name: 'filterMoneyInput' }, cellRender: { name: 'moneyHighLight' } },
      { field: 'addProjectDeduct', title: '累计专项扣除', headerAlign: 'center', align: 'center', sortable: true, minWidth: 100, filters: [{ data: '' }], filterRender: { name: 'filterMoneyInput' }, cellRender: { name: 'moneyHighLight' } },
      {
        field: 'rate',
        title: '累计专项附加扣除',
        headerAlign: 'center',
        align: 'center',
        children: [
          { field: 'addChildEdu', title: '子女教育', headerAlign: 'center', align: 'center', sortable: true, minWidth: 100, filters: [{ data: '' }], filterRender: { name: 'filterMoneyInput' }, cellRender: { name: 'moneyHighLight' } },
          { field: 'addSupOld', title: '赡养老人', headerAlign: 'center', align: 'center', sortable: true, minWidth: 100, filters: [{ data: '' }], filterRender: { name: 'filterMoneyInput' }, cellRender: { name: 'moneyHighLight' } },
          { field: 'addHousingLoanInt', title: '住房贷款利息', headerAlign: 'center', align: 'center', sortable: true, minWidth: 100, filters: [{ data: '' }], filterRender: { name: 'filterMoneyInput' }, cellRender: { name: 'moneyHighLight' } },
          { field: 'addHousingRents', title: '住房租金', headerAlign: 'center', align: 'center', sortable: true, minWidth: 100, filters: [{ data: '' }], filterRender: { name: 'filterMoneyInput' }, cellRender: { name: 'moneyHighLight' } },
          { field: 'addContEdu', title: '继续教育', headerAlign: 'center', align: 'center', sortable: true, minWidth: 100, filters: [{ data: '' }], filterRender: { name: 'filterMoneyInput' }, cellRender: { name: 'moneyHighLight' } },
        ],
      },
      { field: 'addOtherDeduct', title: '累计其他扣除', headerAlign: 'center', align: 'center', minWidth: 100, filters: [{ data: '' }], filterRender: { name: 'filterMoneyInput' }, cellRender: { name: 'moneyHighLight' } },
    ],
  },
  { field: 'taxRate', title: '减按计税比例', headerAlign: 'center', align: 'center', sortable: true, cellRender: { name: 'searchHighLight' }, minWidth: 100, filters: [{ data: '' }], filterRender: { name: 'filterMoneyInput' }, cellRender: { name: 'moneyHighLight' } },
  { field: 'allowDeductDonations', title: '准予扣除的捐赠款', headerAlign: 'center', align: 'center', sortable: true, cellRender: { name: 'searchHighLight' }, minWidth: 100, filters: [{ data: '' }], filterRender: { name: 'filterMoneyInput' }, cellRender: { name: 'moneyHighLight' } },
  {
    title: '税款计算',
    headerAlign: 'center',
    align: 'center',
    children: [
      { field: 'taxableIncome', title: '应纳税所得额', headerAlign: 'center', align: 'center', sortable: true, minWidth: 100, filters: [{ data: '' }], filterRender: { name: 'filterMoneyInput' }, cellRender: { name: 'moneyHighLight' } },
      { field: 'deductRate', title: '税率/预扣率', headerAlign: 'center', align: 'center', sortable: true, minWidth: 100, filters: [{ data: '' }], filterRender: { name: 'filterMoneyInput' }, cellRender: { name: 'moneyHighLight' } },
      { field: 'quickDeduction', title: '速算扣除数', headerAlign: 'center', align: 'center', sortable: true, minWidth: 100, filters: [{ data: '' }], filterRender: { name: 'filterMoneyInput' }, cellRender: { name: 'moneyHighLight' } },
      { field: 'taxAmountPayable', title: '应纳税额', headerAlign: 'center', align: 'center', sortable: true, minWidth: 100, filters: [{ data: '' }], filterRender: { name: 'filterMoneyInput' }, cellRender: { name: 'moneyHighLight' } },
      { field: 'taxeduction', title: '减免税额', headerAlign: 'center', align: 'center', sortable: true, minWidth: 100, filters: [{ data: '' }], filterRender: { name: 'filterMoneyInput' }, cellRender: { name: 'moneyHighLight' } },
      { field: 'taxPaid', title: '已缴税额', headerAlign: 'center', align: 'center', sortable: true, minWidth: 100, filters: [{ data: '' }], filterRender: { name: 'filterMoneyInput' }, cellRender: { name: 'moneyHighLight' } },
      { field: 'taxRebate', title: '应补/退税额', headerAlign: 'center', align: 'center', sortable: true, minWidth: 100, filters: [{ data: '' }], filterRender: { name: 'filterMoneyInput' }, cellRender: { name: 'moneyHighLight' } },
    ],
  },
  { field: 'remark', title: '备注', headerAlign: 'center', align: 'center', sortable: true, cellRender: { name: 'searchHighLight' }, minWidth: 100, filters: [{ data: '' }], filterRender: { name: 'filterMoneyInput' }, cellRender: { name: 'searchHighLight' } },
]
