/*
 * @Author: your name
 * @Date: 2020-04-13 14:58:50
 * @LastEditTime: 2020-09-24 09:38:15
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /ufgov-vue/src/assets/js/routes.js
 */
export const incomeRouter = [
  {
    path: '/cu/bankPayment/bankPayment',
    moduleCode: 'cu',
    name: 'bankPayment',
    meta: { moduleName: '收入管理', menuName: '银行来款' },
    component: () => import('@/views/cu/income/pages/paymentManage/bankPayment/bankPayment.vue'),
  },
  {
    path: '/cu/bankPayment/bankPaymentBill',
    moduleCode: 'cu',
    name: 'bankPaymentBill',
    meta: { moduleName: '收入管理', menuName: '银行来款详情' },
    component: () => import('@/views/cu/income/pages/paymentManage/bankPayment/bankPaymentBill.vue'),
  },
  {
    path: '/cu/paymentClaim/paymentClaim',
    moduleCode: 'cu',
    name: 'paymentClaim',
    meta: { moduleName: '收入管理', menuName: '来款认领' },
    component: () => import('@/views/cu/income/pages/paymentManage/paymentClaim/paymentClaim.vue'),
  },
  {
    path: '/cu/paymentClaim/paymentClaimAudit',
    moduleCode: 'cu',
    name: 'paymentClaimAudit',
    meta: { moduleName: '收入管理', menuName: '来款认领确认' },
    component: () => import('@/views/cu/income/pages/paymentManage/paymentClaim/paymentClaimAudit.vue'),
  },
  {
    path: '/cu/paymentDetailQuery/paymentDetailQuery',
    moduleCode: 'cu',
    name: 'paymentDetailQuery',
    meta: { moduleName: '收入管理', menuName: '银行来款明细查询' },
    component: () => import('@/views/cu/income/pages/query/paymentDetailQuery/paymentDetailQuery.vue'),
  },
  {
    path: '/cu/paymentSumQuery/paymentSumQuery',
    moduleCode: 'cu',
    name: 'paymentSumQuery',
    meta: { moduleName: '收入管理', menuName: '银行来款汇总查询' },
    component: () => import('@/views/cu/income/pages/query/paymentSumQuery/paymentSumQuery.vue'),
  },
  {
    path: '/cu/loanUnwrittenDetail/loanUnwrittenDetail',
    moduleCode: 'cu',
    name: 'loanUnwrittenDetail',
    meta: { moduleName: '收入管理', menuName: '借票未核销明细表' },
    component: () => import('@/views/cu/income/pages/query/loanUnwrittenDetail/loanUnwrittenDetail.vue'),
  },

  {
    path: '/cu/personalDebitInvoiceQuery/personalDebitInvoiceQuery',
    moduleCode: 'cu',
    name: 'personalDebitInvoiceQuery',
    meta: { moduleName: '收入管理', menuName: '个人借开票查询' },
    component: () => import('@/views/cu/income/pages/query/personalDebitInvoiceQuery/personalDebitInvoiceQuery.vue'),
  },
  {
    path: '/cu/debitInvoiceStatistics/debitInvoiceStatistics',
    moduleCode: 'cu',
    name: 'debitInvoiceStatistics',
    meta: { moduleName: '收入管理', menuName: '对方单位借开票查询' },
    component: () => import('@/views/cu/income/pages/query/debitInvoiceStatistics/debitInvoiceStatistics.vue'),
  },
  {
    path: '/cu/billingStatistics/billingStatistics',
    moduleCode: 'cu',
    name: 'billingStatistics',
    meta: { moduleName: '收入管理', menuName: '开票统计表' },
    component: () => import('@/views/cu/income/pages/query/billingStatistics/billingStatistics.vue'),
  },
  {
    path: '/cu/billingDetails/billingDetails',
    moduleCode: 'cu',
    name: 'billingDetails',
    meta: { moduleName: '收入管理', menuName: '开票明细表' },
    component: () => import('@/views/cu/income/pages/query/billingDetails/billingDetails.vue'),
  },
  {
    path: '/cu/additionalInfo/additionalInfo',
    moduleCode: 'cu',
    name: 'additionalInfo',
    meta: { moduleName: '收入管理', menuName: '开票补充登记来款信息' },
    component: () => import('@/views/cu/income/pages/query/additionalInfo/additionalInfo.vue'),
  },
]

export const routes = [
  //   {
  //     path: '/gl/dpexpenses/dpexpenses',
  //     moduleCode: 'gl',
  //     name: 'dpexpenses',
  //     meta: { moduleName: '账务处理', menuName: '待摊费用备查簿' },
  //     component: () => import('@/views/gl/dpexpenses/dpexpenses.vue')
  //   },
  {
    path: '/gl/rpt/glRptJournal/glRptJournal',
    moduleCode: 'gl',
    name: 'glRptJournal', // 明细账页面
    meta: { moduleName: '账务处理', subModuleName: '账簿查询', menuName: '明细账' },
    component: () => import('@/views/gl/rpt/glRptJournal/glRptJournal.vue'),
  },
  {
    path: '/gl/rpt/glRptLedger/glRptLedger',
    moduleCode: 'gl',
    name: 'glRptLedger', // 总账页面
    meta: { moduleName: '账务处理', subModuleName: '账簿查询', menuName: '总账' },
    component: () => import('@/views/gl/rpt/glRptLedger/glRptLedger.vue')
  },
  {
    path: '/gl/rpt/glRptBal/glRptBal',
    moduleCode: 'gl',
    name: 'glRptBal',
    meta: { moduleName: '账务处理', subModuleName: '账簿查询', menuName: '余额表' },
    component: () => import('@/views/gl/rpt/glRptBal/glRptBal.vue'),
  },
  {
    path: '/gl/rpt/glRptDepproJournal/glRptDepproJournal',
    moduleCode: 'gl',
    name: 'glRptDepproJournal', // 财政项目明细账页面
    meta: { moduleName: '账务处理', subModuleName: '账簿查询', menuName: '财政项目明细账' },
    component: () => import('@/views/gl/rpt/glRptDepproJournal/glRptDepproJournal.vue'),
  },
  {
    path: '/ma/departApply/maDepartApply',
    moduleCode: 'ma',
    name: 'maDepartApply', // 部门应用设置页面
    meta: { moduleName: '基础资料', subModuleName: '人员库', menuName: '部门应用设置' },
    component: () => import('@/views/ma/departApply/maDepartApply.vue'),
  },
  // {
  //   path: '/gl/rpt/glRptLedger/glRptLedger',
  //   moduleCode: 'gl',
  //   name: 'glRptLedger', // 总账页面
  //   meta: { moduleName: '账务处理', subModuleName: '账簿查询', menuName: '总账' },
  //   component: () => import('@/views/gl/rpt/glRptLedger/glRptLedger.vue')
  // },
  {
    path: '/prs/basicData/salarySetting/salarySetting',
    moduleCode: 'prs',
    name: 'salarySetting',
    meta: { moduleName: '薪资管理', subModuleName: '单位级基础资料', menuName: '工资项显示设置' },
    component: () => import('@/views/prs/basicData/salarySetting/salarySetting.vue'),
  },
  {
    path: '/prs/basicData/empPrsType/empPrsType',
    moduleCode: 'prs',
    name: 'empPrsType',
    meta: { moduleName: '薪资管理', subModuleName: '单位级基础资料', menuName: '人员工资类别' },
    component: () => import('@/views/prs/basicData/empPrsType/empPrsType.vue'),
  },
  {
    path: '/prs/wagePreparation/wagePreparation',
    moduleCode: 'prs',
    name: 'wagePreparation',
    meta: { moduleName: '薪资管理', subModuleName: '工资计算', menuName: '工资编制' },
    component: () => import('@/views/prs/wagePreparation/wagePreparation.vue'),
  },
  {
    path: '/prs/wageAudit/wageAudit',
    moduleCode: 'prs',
    name: 'wageAudit',
    meta: { moduleName: '薪资管理', subModuleName: '工资计算', menuName: '工资审核' },
    component: () => import('@/views/prs/wageAudit/wageAudit.vue'),
  },
  {
    path: '/prs/periodEndClosing/periodEndClosing',
    moduleCode: 'prs',
    name: 'periodEndClosing',
    meta: { moduleName: '薪资管理', subModuleName: '结账', menuName: '期末结账' },
    component: () => import('@/views/prs/periodEndClosing/periodEndClosing.vue'),
  },
  {
    path: '/prs/payroll/payroll',
    moduleCode: 'prs',
    name: 'payroll',
    meta: { moduleName: '薪资管理', subModuleName: '结账', menuName: '工资发放' },
    component: () => import('@/views/prs/payroll/payroll.vue'),
  },
  {
    path: '/prs/report/wageDetailReport/wageDetailReport',
    moduleCode: 'prs',
    name: 'wageDetailReport',
    meta: { moduleName: '薪资管理', subModuleName: '工资账表', menuName: '工资明细表' },
    component: () => import('@/views/prs/report/wageDetailReport/wageDetailReport.vue'),
  },
  {
    path: '/prs/report/wageSlipPrint/wageSlipPrint',
    moduleCode: 'prs',
    name: 'wageSlipPrint',
    meta: { moduleName: '薪资管理', subModuleName: '工资账表', menuName: '工资条打印' },
    component: () => import('@/views/prs/report/wageSlipPrint/wageSlipPrint.vue'),
  },
  {
    path: '/prs/report/wageOrgReport/wageOrgReport',
    moduleCode: 'prs',
    name: 'wageOrgReport',
    meta: { moduleName: '薪资管理', subModuleName: '工资账表', menuName: '部门工资汇总表' },
    component: () => import('@/views/prs/report/wageOrgReport/wageOrgReport.vue'),
  },
  {
    path: '/prs/report/wageDutyReport/wageDutyReport',
    moduleCode: 'prs',
    name: 'wageDutyReport',
    meta: { moduleName: '薪资管理', subModuleName: '工资账表', menuName: '职务工资汇总表' },
    component: () => import('@/views/prs/report/wageDutyReport/wageDutyReport.vue'),
  },
  {
    path: '/prs/report/wageTypeReport/wageTypeReport',
    moduleCode: 'prs',
    name: 'wageTypeReport',
    meta: { moduleName: '薪资管理', subModuleName: '工资账表', menuName: '类别工资汇总表' },
    component: () => import('@/views/prs/report/wageTypeReport/wageTypeReport.vue'),
  },
  {
    path: '/prs/mySalary/mySalary',
    moduleCode: 'prs',
    name: 'mySalary',
    meta: { moduleName: '薪资管理', subModuleName: '个人工资', menuName: '个人工资查询' },
    component: () => import('@/views/prs/mySalary/mySalary.vue'),
  },
  {
    path: '/prs/mySalaryChanges/mySalaryChanges',
    moduleCode: 'prs',
    name: 'mySalaryChanges',
    meta: { moduleName: '薪资管理', subModuleName: '个人工资', menuName: '个人工资变动明细表' },
    component: () => import('@/views/prs/mySalaryChanges/mySalaryChanges.vue'),
  },
  {
    path: '/prs/personalTaxTable/personalTaxTable',
    moduleCode: 'prs',
    name: 'personalTaxTable',
    meta: { moduleName: '薪资管理', subModuleName: '个税管理', menuName: '个人所得税扣缴申报表' },
    component: () => import('@/views/prs/personalTaxTable/personalTaxTable.vue'),
  },
  {
    path: '/prs/report/wageChangesTable/wageChangesTable',
    moduleCode: 'prs',
    name: 'wageChangesTable',
    meta: { moduleName: '薪资管理', subModuleName: '工资账表', menuName: '工资变动明细表' },
    component: () => import('@/views/prs/report/wageChangesTable/wageChangesTable.vue'),
  },
  {
    path: '/ma/bankInfo/bankInfo',
    moduleCode: 'ma',
    name: 'bankInfo',
    meta: { moduleName: '基础资料', subModuleName: '公共要素', menuName: '银行信息' },
    component: () => import('@/views/ma/bankInfo/bankInfo.vue'),
  },
  {
    path: '/ma/employeeManagement/depStaffInformation',
    moduleCode: 'ma',
    name: 'depStaffInformation',
    meta: { moduleName: '基础资料', subModuleName: '人员库', menuName: '部门人员信息' },
    component: () => import('@/views/ma/employeeManagement/depStaffInformation.vue'),
  },
  {
    path: '/ma/employeeManagement/employeeCategory',
    moduleCode: 'ma',
    name: 'employeeCategory',
    meta: { moduleName: '基础资料', subModuleName: '人员库', menuName: '人员属性分类' },
    component: () => import('@/views/ma/employeeManagement/employeeCategory.vue'),
  },
  {
    path: '/ma/personalAccountManage/personalAccountManage',
    moduleCode: 'ma',
    name: 'personalAccountManage',
    meta: { moduleName: '基础资料', subModuleName: '人员库', menuName: '个人银行账户' },
    component: () => import('@/views/ma/personalAccountManage/personalAccountManage.vue'),
  },
  {
    path: '/ma/auditBankCardInfo/auditBankCardInfo',
    moduleCode: 'ma',
    name: 'auditBankCardInfo',
    meta: { moduleName: '基础资料', subModuleName: '人员库', menuName: '审核银行卡信息' },
    component: () => import('@/views/ma/auditBankCardInfo/auditBankCardInfo.vue'),
  },
  {
    path: '/cu/income/',
    isShow: false,
    moduleCode: 'cu',
    name: 'income',
    meta: { moduleName: '收入管理', menuName: '收入管理首页' },
    component: () => import('@/views/cu/income/income.vue'),
    children: incomeRouter,
  },
  {
    path: '/ma/initSystemLevelBasicData/',
    isShow: false,
    moduleCode: 'ma',
    name: 'initSystemLevelBasicData',
    meta: { moduleName: '测试按钮', menuName: '测试按钮页面' },
    component: () => import('@/views/ma/initSystemLevelBasicData/initSystemLevelBasicData.vue'),
  },
  {
    path: '/ma/overAllSetting/',
    isShow: false,
    moduleCode: 'ma',
    name: 'overAllSetting',
    meta: { moduleName: '测试按钮', menuName: '初始化平台管控规则' },
    component: () => import('@/views/ma/overAllSetting/overAllSetting.vue'),
  },
  {
    path: '/ma/initPlatFormRule/',
    isShow: false,
    moduleCode: 'ma',
    name: 'initPlatFormRule',
    meta: { moduleName: '全局设置界面', menuName: '全局设置界面' },
    component: () => import('@/views/ma/initPlatFormRule/initPlatFormRule.vue'),
  },
  {
    path: '/gl/rpt/glRptAssetRc/glRptAssetRc',
    moduleCode: 'gl',
    name: 'glRptAssetRc', // 与资产对账
    meta: { moduleName: '账务处理', subModuleName: '资产对账', menuName: '与资产对账' },
    component: () => import('@/views/gl/rpt/glRptAssetRc/glRptAssetRc.vue'),
  },
  {
    path: '/de/importAudit/importAudit',
    moduleCode: 'de',
    name: 'importAudit', // 审计数据导入
    meta: { moduleName: '数据交互', subModuleName: '审计数据管理', menuName: '审计数据导入' },
    component: () => import('@/views/de/importAudit/importAudit.vue'),
  },
]

export const mobileRoutes = [
  {
    path: '/prs/mySalaryMobile/mySalary',
    moduleCode: 'prs',
    name: 'mySalaryMobile',
    meta: { moduleName: '薪资管理', subModuleName: '个人工资', menuName: '个人工资查询移动端' },
    component: () => import('@/views/prs/mySalaryMobile/mySalary.vue'),
  },
  {
    path: '/prs/mySalaryMobile/salaryDetail',
    moduleCode: 'prs',
    name: 'salaryDetailMobile',
    meta: { moduleName: '薪资管理', subModuleName: '个人工资', menuName: '个人工资明细移动端' },
    component: () => import('@/views/prs/mySalaryMobile/salaryDetail.vue'),
  },
  {
    path: '/prs/mySalaryMobile/otherIncome',
    moduleCode: 'prs',
    name: 'otherIncomeMobile',
    meta: { moduleName: '薪资管理', subModuleName: '个人工资', menuName: '个人工资其他收入移动端' },
    component: () => import('@/views/prs/mySalaryMobile/otherIncome.vue'),
  },
  {
    path: '/prs/mySalaryMobile/phoneNum',
    moduleCode: 'prs',
    name: 'phoneNumMobile',
    meta: { moduleName: '薪资管理', subModuleName: '个人工资', menuName: '我的手机号移动端' },
    component: () => import('@/views/prs/mySalaryMobile/phoneNum.vue'),
  },
  {
    path: '/prs/mySalaryMobile/editBankCard',
    moduleCode: 'prs',
    name: 'editBankCardMobile',
    meta: { moduleName: '薪资管理', subModuleName: '个人工资', menuName: '编辑银行卡移动端' },
    component: () => import('@/views/prs/mySalaryMobile/editBankCard.vue'),
  },
  {
    path: '/prs/mySalaryMobile/myCards',
    moduleCode: 'prs',
    name: 'myCards',
    meta: { moduleName: '薪资管理', subModuleName: '个人工资', menuName: '银行卡' },
    component: () => import('@/views/prs/mySalaryMobile/myCards.vue'),
  },
  {
    path: '/prs/mySalaryMobile/bankList',
    moduleCode: 'prs',
    name: 'bankList',
    meta: { moduleName: '薪资管理', subModuleName: '个人工资', menuName: '银行选择' },
    component: () => import('@/views/prs/mySalaryMobile/bankList.vue'),
  },
  {
    path: '/prs/mySalaryMobile/salaryQuery',
    moduleCode: 'prs',
    name: 'salaryQuery',
    meta: { moduleName: '薪资管理', subModuleName: '个人工资', menuName: '工资查询' },
    component: () => import('@/views/prs/mySalaryMobile/salaryQuery.vue'),
  },
  {
    path: '/prs/mySalaryMobile/modifyPwd',
    moduleCode: 'prs',
    name: 'modifyPwd',
    meta: { moduleName: '薪资管理', subModuleName: '个人工资', menuName: '修改工资查询密码' },
    component: () => import('@/views/prs/mySalaryMobile/modifyPwd.vue'),
  },
]

export const devRoutes = [
  {
    path: '/document',
    moduleCode: 'pub',
    meta: { moduleName: '公共组件', subModuleName: '公共组件', menuName: '组件使用手册' },
    component: () => import('@/views/document/index.vue'),
    children: [
      {
        path: '/',
        redirect: 'theme'
      },
      {
        path: 'theme',
        moduleCode: 'pub',
        name: 'theme',
        meta: { moduleName: '公共组件', subModuleName: '公共组件', menuName: '组件说明' },
        component: () => import('@/views/document/manual/theme.vue'),
      },
      {
        path: 'buttonExp',
        moduleCode: 'pub',
        name: 'buttonExp',
        meta: { moduleName: '公共组件', subModuleName: '公共组件', menuName: '按钮例子' },
        component: () => import('@/views/document/manual/buttonExp.vue'),
      },
      {
        path: 'comboxExp',
        moduleCode: 'pub',
        name: 'comboxExp',
        meta: { moduleName: '公共组件', subModuleName: '公共组件', menuName: '下拉框例子' },
        component: () => import('@/views/document/manual/comboxExp.vue'),
      },
      {
        path: 'pagerExp',
        moduleCode: 'pub',
        name: 'pagerExp',
        meta: { moduleName: '公共组件', subModuleName: '公共组件', menuName: '分页器例子' },
        component: () => import('@/views/document/manual/pagerExp.vue'),
      },
      {
        path: 'queryTemp',
        moduleCode: 'pub',
        name: 'queryTemp',
        meta: { moduleName: '公共组件', subModuleName: '公共组件', menuName: '查询模板(旧版)' },
        component: () => import('@/views/document/manual/queryTemp.vue'),
      },
    ]
  },
  {
    path: '/example/vxeTable',
    moduleCode: 'pub',
    name: 'vxeTable',
    meta: { moduleName: '公共组件', subModuleName: '开发实例', menuName: '表格示例' },
    component: () => import('@/views/document/example/vxeTable.vue'),
  },
  {
    path: '/example/interfaceTest',
    moduleCode: 'pub',
    name: 'interfaceTest',
    meta: { moduleName: '公共组件', subModuleName: '开发实例', menuName: '接口测试' },
    component: () => import('@/views/document/example/interfaceTest.vue'),
  }
]

export const modalRoutes = [
  {
    path: '/ma/addEmpModal/addEmpModal',
    moduleCode: 'ma',
    name: 'addEmpModal',
    meta: { moduleName: '基础资料', subModuleName: '报销系统跳转', menuName: '新增人员(报销)' },
    component: () => import('@/views/ma/addEmpModal/addEmpModal.vue'),
  },
]
