/*
 * @Author: sunch
 * @Date: 2020-06-15 09:39:07
 * @LastEditTime: 2020-09-02 15:31:53
 * @LastEditors: Please set LastEditors
 * @Description: 与资产对账 组件参数传递
 * @FilePath: /agla-fe-8.50/vuedev/src/store/modules/gl/rpt/glRptJournal/glRptJournal.js
 */

import types from '../types'

const postfix = '_BY_GL_RPT_ASSET_RC'

const state = {
  tableH: 100,//动态表格高度 
  agencyCode: '', //单位代码
  agencyName: '', //单位名称
  acctCode: '', //账套代码
  acctName: '', //账套名称
  acctChanged: false, //账套改变状态
  acctChangedFlag: false, //账套改变状态
  accsCode: '',//会计体系代码
  accsName: '',//会计体系名称
  qryItemData: [
    // {
    //   itemTypeName: '项目', 
    //   itemType: 'PROJECT', 
    //   isShowItem: '0',
    //   items: [{code: '1000', name: '1000 测试项目'},{code: '10001', name: '10001 项目1'},{code: '10002', name: '10002 项目2'}]
    // },
  ],//用户选择的辅助项 相当于查询的辅助项的原始数据  辅助项测试数据
  qrySelectItemData: {
    // PROJECT: ''
  },
  startDate: '',//查询开始时间
  endDate: '',//查询截止时间
  stadAmtFrom: '', // 金额范围 金额起
  stadAmtTo: '', //金额范围 金额止
  prjList: [], //方案列表
  prjCode: '',//当前方案代码
  prjGuid: '',//方案guid
  savePrjCode: '',//保存方案成功后返回的方案代码 用于刷新tab
  nowPrj: '', //当前方案名称
  prjScope: 1, //方案作用域
  prjContent: {
    agencyAcctInfo: [],
    startDate: '',
    endDate: '',
    period: '',
    qryItems: [], //方案中填充的辅助项
    rptCondItem: [],
    rptOption: [],
    vouTypeCode: '', // 查询条件：凭证类型代码（非必传）
    rptStyle: '', // 账表样式
    curCode: '*', //货币代码
  }, //查询方案配置
  fromRmisFlag: false, //报表跳转标记
  frStartDate: '',
  frEndDate: ''
}

//action的操作方法
const mutations = {
  [types.SET_TABLE_HEIGHT + postfix](state, payload) {
    state.tableH = payload
  },
  [types.SET_AGENCY_CODE + postfix](state, payload) {
    state.agencyCode = payload
  },
  [types.SET_AGENCY_NAME + postfix](state, payload) {
    state.agencyName = payload
  },
  [types.SET_ACCT_CODE + postfix](state, payload) {
    state.acctCode = payload
  },
  [types.SET_ACCT_NAME + postfix](state, payload) {
    state.acctName = payload
  },
  [types.SET_ACCS_CODE + postfix](state, payload) {
    state.accsCode = payload
  },
  [types.SET_ACCS_NAME + postfix](state, payload) {
    state.accsName = payload
  },
  [types.SET_QRY_ITEM_DATA + postfix](state, payload) {
    state.qryItemData = payload
  },
  [types.SET_QRY_SELECT_ITEM_DATA + postfix](state, payload) {
    state.qrySelectItemData[payload.itemType] = payload.code
  },
  [types.SET_QRY_SELECT_ITEM + postfix](state, payload) {
    state.qrySelectItemData = payload
  },
  [types.SET_PRJ_CODE + postfix](state, payload) {
    state.prjCode = payload
  },
  [types.SET_NOW_PRJ + postfix](state, payload) {
    state.nowPrj = payload
  },
  [types.SET_PRJ_SCOPE + postfix](state, payload) {
    state.prjScope = payload
  },
  [types.SET_PRJ_CONTENT + postfix](state, payload) {
    state.prjContent = payload
  },
  [types.SET_RPT_STYLE + postfix](state, payload) {
    state.prjContent.rptStyle = payload
  },
  [types.SET_CURCODE + postfix](state, payload) {
    state.prjContent.curCode = payload
  },
  [types.SET_STAD_AMT_FROM + postfix](state, payload) {
    state.stadAmtFrom = payload
  },
  [types.SET_STAD_AMT_TO + postfix](state, payload) {
    state.stadAmtTo = payload
  },
  [types.SET_START_DATE + postfix](state, payload) {
    state.startDate = payload
  },
  [types.SET_END_DATE + postfix](state, payload) {
    state.endDate = payload
  },
  [types.SET_PRJ_LIST + postfix](state, payload) {
    state.prjList = payload
  },
  [types.SET_SAVE_PRJ_CODE + postfix](state, payload) {
    state.savePrjCode = payload
  },
  [types.SET_PRJ_GUID + postfix](state, payload) {
    state.prjGuid = payload
  },
  [types.SET_ACCT_CHANGED + postfix](state, payload) {
    state.acctChanged = payload
  },
  [types.SET_ACCT_CHANGED_FLAG + postfix](state, payload) {
    state.acctChangedFlag = payload
  },
  [types.SET_FROM_RMIS_FLAG + postfix](state, payload) {
    state.fromRmisFlag = payload
  },
  [types.SET_FR_START_DATE + postfix](state, payload){
    state.frStartDate = payload
  },
  [types.SET_FR_END_DATE + postfix](state, payload){
    state.frEndDate = payload
  }
}

// 最后统一导出
export default {
  state,
  mutations
}
