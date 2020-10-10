import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

import state from './state'
import getters from './getters'
import mutations from './mutations'
import actions from './actions'
import setCols from './modules/prs/wagePreparation/setCols'
import choiceEmp from './modules/prs/wagePreparation/choiceEmp'
import formulaEditor from './modules/prs/wagePreparation/formulaEditor'
import mintApp from './modules/prs/mySalaryMobile/mintApp'
import rpt from './modules/gl/rpt/rpt'
import glRptJournal from './modules/gl/rpt/glRptJournal/glRptJournal'
import glRptDepproJournal from './modules/gl/rpt/glRptDepproJournal/glRptDepproJournal'
import glRptBal from './modules/gl/rpt/glRptBal/glRptBal'
import glRptAssetRc from './modules/gl/rpt/glRptAssetRc/glRptAssetRc'
import glRptLedger from './modules/gl/rpt/glRptLedger/glRptLedger'
//部门应用设置
import ma from './modules/ma/ma'
import maDepartApply from './modules/ma/maDepartApply/maDepartApply'
// 导出 store 对象
export default new Vuex.Store({
  state,
  getters,
  mutations,
  actions,
  modules: {
    setCols,
    choiceEmp,
    formulaEditor,
    mintApp,
    rpt,
    glRptJournal,
    glRptDepproJournal,
    glRptBal,
    glRptAssetRc,
    glRptLedger,
    ma,
    maDepartApply
  }
})
