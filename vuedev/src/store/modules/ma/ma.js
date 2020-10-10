/*
 * @Author: liwz
 * @Date: 2020-09-27 16:02:07
 * @LastEditTime: 2020-09-27 16:03:08
 * @LastEditors: Please set LastEditors
 * @Description: 部门应用设置 组件参数传递
 * @FilePath: /agla-fe-8.50/vuedev/src/store/modules/ma/ma.js
 */

import types from './types'

const state = {
  maName: '',
}

let getters = {
  maType(state) {
    return state.maName.replace(/([A-Z])/g, '_$1').toUpperCase()
  },
  maPostfix(state, getters) {
    // console.log('maType: ', getters.maType);
    return '_BY_' + getters.maType
  },
  /**
   * @description: 方案中的单位信息
   */
  getAgencyInfo: (state, getters, rootState) => {
    return [{ acctCode: rootState[state.maName].acctCode, agencyCode: rootState[state.maName].agencyCode }]
  },
}

let mutations = {
  setMaName: (state, payload) => {
    state.maName = payload
  },
}

//组件调用的方法
const actions = {
  /**
   * @description: 设定表格高度
   */
  setTableHMa({ commit, getters }, payload) {
    commit(types.SET_TABLE_HEIGHT + getters.maPostfix, payload)
  },
  /**
   * @description: 设置store内的单位代码
   */
  setAgencyCodeMa({ commit, getters }, payload) {
    commit(types.SET_AGENCY_CODE + getters.maPostfix, payload)
  },
  /**
   * @description: 设置store内的单位名称
   */
  setAgencyNameMa({ commit, getters }, payload) {
    commit(types.SET_AGENCY_NAME + getters.maPostfix, payload)
  },
  /**
   * @description: 设置账套标记  换账套，方案改变，抽屉还没打开，就置为false
   */
  setAcctChangedMa({ commit, getters }, payload) {
    commit(types.SET_ACCT_CHANGED + getters.maPostfix, payload)
  },
}

// 最后统一导出
export default {
  state,
  getters,
  mutations,
  actions,
}
