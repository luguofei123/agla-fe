import types from './types'

const mutations = {
    [types.SET_CONTAINER_H]: (state) => {
        let containerH = window.innerHeight ? window.innerHeight - 16 : document.body.clientHeight - 16
        // if(process.env.NODE_ENV==="development"){
        //     containerH = containerH - 70
        // }
        state.containerH = containerH
    },
    [types.SET_BTN_PERMISSION_LIST]: (state, payload) => {
        state.btnPerList = payload
    },
    [types.SET_PF_DATA]: (state, payload) => {
        state.pfData = payload
    },
    [types.SET_TOKEN_ID]: (state, payload) => {
        state.tokenId = payload
    },
    setPathName: (state, payload) => {
        state.moduleName = payload.moduleName
        state.menuName = payload.menuName
    },
    setMenuid: (state, payload) => {
        state.menuid = payload
    },
    [types.SET_FROM_WHERE]: (state, payload) => {
        state.fromWhere = payload
    },
}

export default mutations