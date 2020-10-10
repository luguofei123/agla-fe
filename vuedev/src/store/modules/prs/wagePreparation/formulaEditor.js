/*
 * @Author: sunch
 * @Date: 2020-03-16 22:22:53
 * @LastEditTime: 2020-03-26 10:46:48
 * @LastEditors: Please set LastEditors
 * @Description: 公式编辑器 组件参数传递
 * @FilePath: /ufgov-vue/src/store/modules/prs/wagePreparation/formulaEditor.js
 */
import types from '../../../types'

const state = {
  formula: ''
}

var getters = {}

const actions = {
  setFormula({ commit }, payload) {
    commit(types.formulaEditor.SET_FORMULA, payload)
  },
  clearFormula({ commit }) {
    commit(types.formulaEditor.CLEAR_FORMULA)
  }
}

const mutations = {
  [types.formulaEditor.SET_FORMULA](state, payload) {
    state.formula = payload
  },
  [types.formulaEditor.CLEAR_FORMULA](state) {
    state.formula = ''
  }
}
// 最后统一导出
export default {
  state,
  getters,
  actions,
  mutations
}
