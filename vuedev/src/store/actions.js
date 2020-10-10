import types from './types'

const actions = {
    //{ commit, state }
    setContainerH({ commit }) {
        commit(types.SET_CONTAINER_H)
    },
    setBtnPermissionList({ commit }, payload) {
        commit(types.SET_BTN_PERMISSION_LIST, payload.list)
    },
    setPfData({ commit }, payload) {
        commit(types.SET_PF_DATA, payload)
    },
    setTokenId({ commit }, payload) {
        commit(types.SET_TOKEN_ID, payload)
    },
    setFromWhere({ commit }, payload) {
        commit(types.SET_FROM_WHERE, payload)
    },
}

export default actions