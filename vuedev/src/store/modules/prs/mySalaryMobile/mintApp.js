/*
 * @Author: your name
 * @Date: 2020-06-08 12:29:29
 * @LastEditTime: 2020-06-08 12:34:40
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /agla-fe-8.50/vuedev/src/store/modules/prs/mySalaryMobile/mintApp.js
 */ 
import types from '../../../types'

const state = {
    browserType: '',
    systemType: ''
}

var getters = {
}

const actions = {
    setBrowserType({ commit }, payload){
        commit(types.mintApp.BROWSER_TYPE, payload)
    },
    setSystemType({ commit }, payload){
        commit(types.mintApp.SYSTEM_TYPE, payload)
    }
}

const mutations = {
  [types.mintApp.BROWSER_TYPE](state, payload) {
    state.browserType = payload
  },
  [types.mintApp.SYSTEM_TYPE](state, payload) {
    state.systemType = payload
  },
}
// 最后统一导出
export default {
  state,
  getters,
  actions,
  mutations
}