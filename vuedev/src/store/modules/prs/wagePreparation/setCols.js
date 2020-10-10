import types from '../../../types'

const state = {
  columnsNoSeq: [],
  showColumns: [],
  planId: '',
  ordIndex: 1,
  planName: ''
}

var getters = {
}

const actions = {
  setColumnsNoSeq({ commit }, payload) {
    commit(types.setCols.SET_COLUMNS_NOSEQ, payload)
  },
  setShowColumns({ commit }, payload) {
    commit(types.setCols.SET_SHOW_COLUMNS, payload)
  },
  setWageTableColsPlan({ commit }, obj) {
    commit(types.setCols.SET_WAGETABLECOLS_PLAN, obj)
  }
}

const mutations = {
  [types.setCols.SET_COLUMNS_NOSEQ](state, payload) {
    state.columnsNoSeq = payload
  },
  [types.setCols.SET_SHOW_COLUMNS](state, payload) {
    state.showColumns = payload
  },
  [types.setCols.SET_WAGETABLECOLS_PLAN](state, obj) {
    state.planId = obj.planId
    state.ordIndex = obj.ordIndex
    state.planName = obj.planName
  }
}
// 最后统一导出
export default {
  state,
  getters,
  actions,
  mutations
}
