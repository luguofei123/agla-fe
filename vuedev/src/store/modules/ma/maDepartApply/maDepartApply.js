/*
 * @Author: liwz
 * @Date: 2020-06-15 14:06:36
 * @LastEditTime: 2020-09-02 18:17:37
 * @LastEditors: liwz
 * @Description: In User Settings Edit
 * @FilePath: /agla-fe-8.50/vuedev/src/store/modules/gl/rpt/glRptLedger/glRptLedger.js
 */

import types from '../types'

const postfix = '_BY_MA_DEPART_APPLY'

const state = {
  tableH: 100,//动态表格高度
  agencyCode: '', //单位代码
  agencyName: '', //单位名称
  acctCode: '', //账套代码
  acctName: '', //账套名称
  acctChanged: false, //账套改变状态
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
  [types.SET_ACCT_CHANGED + postfix](state, payload) {
    state.acctChanged = payload
  },
}

// 最后统一导出
export default {
  state,
  mutations
}