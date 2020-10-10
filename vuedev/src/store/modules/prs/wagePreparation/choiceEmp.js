import types from '../../../types'

const state = {
    empuids: [],
    empNames: [],
    orgcodes: []
}

var getters = {
}

const actions = {
  setEmpuids({ commit }, payload) {
    commit(types.choiceEmp.SET_EMPUIDS, payload)
  },
  setEmpNames({ commit }, payload) {
    commit(types.choiceEmp.SET_EMPNAMES, payload)
  },
  setOrgcodes({ commit }, payload) {
    commit(types.choiceEmp.SET_ORGCODES, payload)
  },
  clearEmp({ commit }){
    commit(types.choiceEmp.CLEAR_EMP)
  }
}

const mutations = {
  [types.choiceEmp.SET_EMPUIDS](state, payload) {
    state.empuids = payload
  },
  [types.choiceEmp.SET_EMPNAMES](state, payload) {
    state.empNames = payload
  },
  [types.choiceEmp.SET_ORGCODES](state, payload) {
    state.orgcodes = payload
  },
  [types.choiceEmp.CLEAR_EMP](state) {
    state.empuids = []
    state.empNames = []
    state.orgcodes = []
  }
}
// 最后统一导出
export default {
  state,
  getters,
  actions,
  mutations
}
