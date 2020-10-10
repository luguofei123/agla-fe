/*
 * @Author: sunch
 * @Date: 2020-06-15 09:39:07
 * @LastEditTime: 2020-09-29 19:02:21
 * @LastEditors: Please set LastEditors
 * @Description: 明细账 组件参数传递
 * @FilePath: /agla-fe-8.50/vuedev/src/store/modules/gl/rpt/glRptJournal/glRptJournal.js
 */

import types from './types'
import { getPrjData, getFromRmisArgu } from '@/views/gl/rpt/common/service/service'

const state = {
  rptName: '',
}

let getters = {
  DEPPROFlag(state) {
    return state.rptName.DEPPROFlag
  },
  rptType(state) {
    return state.rptName.replace(/([A-Z])/g, '_$1').toUpperCase()
  },
  rptPostfix(state, getters) {
    return '_BY_' + getters.rptType
  },
  getQryItems: (state, getters, rootState) => {
    //过滤出表内显示项
    // let tableInnerQryItems = rootState[state.rptName].prjContent.qryItems.filter((item) => {
    //   return item.isShowItem == '1'
    // }),
    // tableOuterQryItems = rootState[state.rptName].prjContent.qryItems.filter((item) => {
    //   return item.isShowItem == '0'
    // })
    // //表外显示的最终结果从 qrySelectItemData 中取
    // let selectedData = rootState[state.rptName].qrySelectItemData
    // // console.log(selectedData)
    // tableOuterQryItems.forEach((item) => {
    //   item.items = []
    //   for (var prop in selectedData) {
    //     if (prop === item.itemType) {
    //       if (selectedData[prop] instanceof Array) {
    //         selectedData[prop].forEach(it => {
    //           item.items.push({ code: it, name: '' })
    //         })
    //       } else {
    //         item.items.push({ code: selectedData[prop], name: '' })
    //       }
    //     }
    //   }
    // })
    // return tableInnerQryItems.concat(tableOuterQryItems)

    //表外显示的最终结果从 qrySelectItemData 中取，这里取的qryItemData即prjContent中的qryItems即prjContent.qryItems
    let selectedData = rootState[state.rptName].qrySelectItemData
    //不能直接操作rootState[state.rptName].qryItemData，因为查询区域那块是用qryItemData进行渲染页面的（带树结构）
    let qryItemData = JSON.parse(JSON.stringify(rootState[state.rptName].qryItemData))
    qryItemData.forEach((item) => {
      item.items = []
      for (var prop in selectedData) {
        if (prop === item.itemType) {
          if (selectedData[prop] instanceof Array) {
            selectedData[prop].forEach(it => {
              item.items.push({ code: it, name: '' })
            })
          } else {
            item.items.push({ code: selectedData[prop], name: '' })
          }
        }
      }
    })
    return qryItemData
  },
  /**
   * @description: 方案中的单位账套信息
   */
  getAgencyAcctInfo: (state, getters, rootState) => {
    return [{ acctCode: rootState[state.rptName].acctCode, agencyCode: rootState[state.rptName].agencyCode }]
  },
  /**
   * @description: 方案查询条件：金额范围
   */
  getRptCondItem: (state, getters, rootState) => {
    let rptCondItem = [
      {
        condCode: 'stadAmtFrom', // 查询条件代码
        condName: '金额起', // 查询条件名称
        condText: rootState[state.rptName].stadAmtFrom, // 查询条件值
        condValue: rootState[state.rptName].stadAmtFrom, // 查询条件值
      },
      {
        condCode: 'stadAmtTo',
        condName: '金额止',
        condText: rootState[state.rptName].stadAmtTo,
        condValue: rootState[state.rptName].stadAmtTo,
      },
    ]
    return rptCondItem
  },
  /**
   * @description: 拼接方案参数
   */
  getPrjContent: (state, getters, rootState) => {
    let prjContent = JSON.parse(JSON.stringify(rootState[state.rptName].prjContent)) //除下面内容的方案其他内容
    prjContent.agencyAcctInfo = getters.getAgencyAcctInfo
    prjContent.startDate = rootState[state.rptName].startDate
    prjContent.endDate = rootState[state.rptName].endDate
    //余额表 起始年
    prjContent.startYear = rootState[state.rptName].startYear
    prjContent.endYear = rootState[state.rptName].endYear
    //余额表 起始期间
    prjContent.startFisperd = rootState[state.rptName].startFisperd
    prjContent.endFisperd = rootState[state.rptName].endFisperd
    //金额范围
    prjContent.rptCondItem = getters.getRptCondItem
    prjContent.rptStyle = rootState[state.rptName].rptStyle
    return prjContent
  },
  /**
   * @description: 拼接查询参数
   */
  getReportArgument: (state, getters, rootState) => {
    let prjContent = getters.getPrjContent
    prjContent.qryItems = getters.getQryItems //辅助核算项  调接口所用的数据是不带树结构的
    return {
      //明细账查询参数
      agencyCode: rootState[state.rptName].agencyCode,
      agencyName: rootState[state.rptName].agencyName,
      acctCode: rootState[state.rptName].acctCode,
      acctName: rootState[state.rptName].acctName,
      rptType: getters.rptType, // 账表类型
      prjCode: rootState[state.rptName].prjCode,
      prjName: rootState[state.rptName].nowPrj,
      prjScope: String(rootState[state.rptName].prjScope),
      prjGuid: rootState[state.rptName].prjGuid,
      prjContent: prjContent,
    }
  },
  /**
   * @description: 总账表格列表拼接查询参数
   */
  getLedgerArgument: (state, getters, rootState) => {
    let prjContent = getters.getPrjContent
    prjContent.qryItems = getters.getQryItems //辅助核算项
    return {
      //总账查询参数
      agencyCode: rootState[state.rptName].agencyCode,
      agencyName: rootState[state.rptName].agencyName,
      acctCode: rootState[state.rptName].acctCode,
      acctName: rootState[state.rptName].acctName,
      rptType: getters.rptType, // 账表类型
      // stadAmtFrom: rootState[state.rptName].stadAmtFrom,
      // stadAmtTo: rootState[state.rptName].stadAmtTo,
      prjCode: rootState[state.rptName].prjCode,
      prjName: rootState[state.rptName].nowPrj,
      prjScope: String(rootState[state.rptName].prjScope),
      prjGuid: rootState[state.rptName].prjGuid,
      prjContent: prjContent,
    }
  },
}

let mutations = {
  setRptName: (state, payload) => {
    state.rptName = payload
  },
}

//组件调用的方法
const actions = {
  /**
   * @description: 设定表格高度
   */
  setTableH({ commit, getters }, payload) {
    commit(types.SET_TABLE_HEIGHT + getters.rptPostfix, payload)
  },
  /**
   * @description: 财政项目明细账 辅助项是否包含财政项目
   */
  setDEPPROFlag({ commit, getters }, payload) {
    commit(types.SET_DEPPRO_FLAG + getters.rptPostfix, payload)
  },
  /**
   * @description: 设置store内的单位代码
   */
  setAgencyCode({ commit, getters }, payload) {
    commit(types.SET_AGENCY_CODE + getters.rptPostfix, payload)
  },
  /**
   * @description: 设置store内的单位名称
   */
  setAgencyName({ commit, getters }, payload) {
    commit(types.SET_AGENCY_NAME + getters.rptPostfix, payload)
  },
  /**
   * @description: 设置store内的账套代码
   */
  setAcctCode({ commit, getters }, payload) {
    commit(types.SET_ACCT_CODE + getters.rptPostfix, payload)
  },
  /**
   * @description: 设置store内的账套名称
   */
  setAcctName({ commit, getters }, payload) {
    commit(types.SET_ACCT_NAME + getters.rptPostfix, payload)
  },
  /**
   * @description: 设置账套标记  换账套，方案改变，抽屉还没打开，就置为false
   */
  setAcctChanged({ commit, getters }, payload) {
    commit(types.SET_ACCT_CHANGED + getters.rptPostfix, payload)
  },
  //单位账套换了账套，抽屉中的数据不更新   打开抽屉判断账套的值有没有变化，根据新的单位账套来触发会计科目列表
  setAcctChangedFlag({ commit, getters }, payload) {
    commit(types.SET_ACCT_CHANGED_FLAG + getters.rptPostfix, payload)
  },
  /**
   * @description: 设置会计体系代码
   */
  setAccsCode({ commit, getters }, payload) {
    commit(types.SET_ACCS_CODE + getters.rptPostfix, payload)
  },
  /**
   * @description: 设置会计体系名称
   */
  setAccsName({ commit, getters }, payload) {
    commit(types.SET_ACCS_NAME + getters.rptPostfix, payload)
  },
  /**
   * @description: 设置要回写的辅助项
   */
  setQryItemData({ commit, getters }, payload) {
    commit(types.SET_QRY_ITEM_DATA + getters.rptPostfix, payload)
  },
  /**
   * @description: 部分设置查询区域内辅助项的选择项（只修改属性）
   * @param {Object} payload format { itemType: itemType, code: '' }
   */
  setQrySelectItemData({ commit, getters }, payload) {
    commit(types.SET_QRY_SELECT_ITEM_DATA + getters.rptPostfix, payload)
  },
  /**
   * @description: 完全设置查询区域内辅助项的选择项
   * @param {Object} payload  format { ACCO: '' }
   */
  setSelectedData({ commit, getters }, payload) {
    commit(types.SET_QRY_SELECT_ITEM + getters.rptPostfix, payload)
  },
  /**
   * @description: 设置方案code
   */
  setPrjCode({ commit, getters }, payload) {
    commit(types.SET_PRJ_CODE + getters.rptPostfix, payload)
  },
  /**
   * @description: 设置方案名称
   */
  setNowPrj({ commit, getters }, payload) {
    commit(types.SET_NOW_PRJ + getters.rptPostfix, payload)
  },
  /**
   * @description: 设置方案作用域
   */
  setPrjScope({ commit, getters }, payload) {
    commit(types.SET_PRJ_SCOPE + getters.rptPostfix, payload)
  },
  /**
   * @description: 设置方案 直接将方案内容替换
   */
  setPrjContent({ commit, getters }, payload) {
    commit(types.SET_PRJ_CONTENT + getters.rptPostfix, payload)
  },
  /**
   * @description: !!!此方法不要使用!!! 即将去掉！！！ 设置方案 查询内容
   */
  setPrjQryItems({ commit, getters }, payload) {
    commit(types.SET_RPT_QRYITEMS + getters.rptPostfix, payload)
  },
  /**
   * @description: 设置方案 查询内容-其他
   */
  setPrjRptOption({ commit, getters }, payload) {
    commit(types.SET_RPT_RPTOPTION + getters.rptPostfix, payload)
  },
  /**
   * @description: 设置账表样式
   */
  setRptStyle({ commit, getters }, payload) {
    commit(types.SET_RPT_STYLE + getters.rptPostfix, payload)
  },
  /**
   * @description: 设置货币代码
   */
  setCurCode({ commit, getters }, payload) {
    commit(types.SET_CURCODE + getters.rptPostfix, payload)
  },
  /**
   * @description: 设置金额起
   */
  setStadAmtFrom({ commit, getters }, payload) {
    commit(types.SET_STAD_AMT_FROM + getters.rptPostfix, payload)
  },
  /**
   * @description: 设置金额止
   */
  setStadAmtTo({ commit, getters }, payload) {
    commit(types.SET_STAD_AMT_TO + getters.rptPostfix, payload)
  },
  /**
   * @description: 设置查询开始时间
   */
  setStartDate({ commit, getters }, payload) {
    commit(types.SET_START_DATE + getters.rptPostfix, payload)
  },
  /**
   * @description: 设置查询截止时间
   */
  setEndDate({ commit, getters }, payload) {
    commit(types.SET_END_DATE + getters.rptPostfix, payload)
  },
  /**
   * @description: 获取包含异步操作
   */
  getPrjList({ state, commit, getters, rootState }) {
    //getPrjData 获取查询方案的接口
    return getPrjData({
      rptType: getters.rptType,
      agencyCode: rootState[state.rptName].agencyCode,
      acctCode: rootState[state.rptName].acctCode,
      setYear: rootState.pfData.svSetYear,
    })
      .then((result) => {
        // console.log('getPrjList result: ', result);
        if (result.data.data && result.data.data.length > 0) {
          commit(types.SET_PRJ_LIST + getters.rptPostfix, result.data.data)
          commit(types.SET_PRJLIST_EMPTY + getters.rptPostfix, false)
        } else {
          commit(types.SET_PRJ_LIST + getters.rptPostfix, [])
          commit(types.SET_PRJLIST_EMPTY + getters.rptPostfix, true)
        }
        return new Promise((resolve) => {
          resolve({ data: result.data.data, flag: result.data.flag, msg: result.data.msg })
        })
      })
      .catch((error) => {
        console.log(error)
      })
  },
  /**
   * @description: 设置
   */
  setChoicePrjSuccessAfterSave({ commit, getters }, payload) {
    commit(types.SET_CHOICE_PRJ_SUCCESS_AFTER_SAVE + getters.rptPostfix, payload)
  },
  /**
   * @description: 设置保存时返回的prjCode用于标记
   */
  setSavePrjCode({ commit, getters }, payload) {
    commit(types.SET_SAVE_PRJ_CODE + getters.rptPostfix, payload)
  },
  /**
   * @description: 设置方案guid
   */
  setPrjGuid({ commit, getters }, payload) {
    commit(types.SET_PRJ_GUID + getters.rptPostfix, payload)
  },
  /**
   * @description: 将rmis传递过来的参数设置成方案内容
   */
  setFromRmisArgu({ commit, getters }) {
    return new Promise((resolve, reject) => {
      getFromRmisArgu({})
        .then((result) => {
          console.log(result)
          let fromRmisArgu = result.data.data
          // 标记账套改变
          commit(types.SET_ACCT_CHANGED + getters.rptPostfix, true)
          commit(types.SET_ACCT_CHANGED_FLAG + getters.rptPostfix, true)
          //会计科目
          console.log(fromRmisArgu.accoCode) // [{val: '', code: ''}]
          console.log(fromRmisArgu.accItem) // [{val: '', code: ''}]
          let vPrj = {
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
          }
          this.setPrjContent(vPrj)
          //将会计科目和其他辅助项合并成一个数组 qryItems
          let items1 = fromRmisArgu.accoCode.map((item) => {
            return { code: item.code, name: '' }
          })
          let arr1 = [
            {
              itemType: 'ACCO',
              items: items1,
            },
          ]
          var accFilterObj = {}
          fromRmisArgu.accItem.forEach((item) => {
            if (item.subField != 'ATTRIBUTE') {
              if (accFilterObj[item.code] instanceof Array) {
                var flag = accFilterObj[item.code].some((it) => {
                  return it == item.val
                })
                if (!flag) {
                  accFilterObj[item.code].push(item.val)
                }
              } else {
                accFilterObj[item.code] = [item.val]
              }
            }
          })
          var arr2 = []
          for (var p in accFilterObj) {
            arr2.push({ itemType: p, items: [{ code: accFilterObj[p], name: '' }] })
          }
          let qryItems = arr1.concat(arr2)
          let qryItemData = [],
            qrySelectItemData = {}
          qryItems.forEach((item) => {
            let initQryItemCode = true
            if (item.items.length > 0) {
              item.items.forEach((it) => {
                if (initQryItemCode && it.isLeaf == 1) {
                  qrySelectItemData[item.itemType] = it.code
                  initQryItemCode = false
                }
              })
            }
            qryItemData.push(item)
          })
          commit(types.SET_QRY_ITEM_DATA + getters.rptPostfix, qryItemData)
          commit(types.SET_QRY_SELECT_ITEM + getters.rptPostfix, qrySelectItemData)
          //设置起止时间
          commit(types.SET_FR_START_DATE + getters.rptPostfix, fromRmisArgu.svSetYear + '-' + fromRmisArgu.startFisperd + '-01')
          commit(types.SET_FR_END_DATE + getters.rptPostfix, fromRmisArgu.svSetYear + '-' + fromRmisArgu.endFisperd + '-31')
          //默认私有方案
          commit(types.SET_PRJ_SCOPE + getters.rptPostfix, 1)
          // 设置标记
          commit(types.SET_FROM_RMIS_FLAG + getters.rptPostfix, true)
          resolve(fromRmisArgu)
        })
        .catch((error) => {
          console.log(error)
          reject(error)
        })
    })
  },
  setStartYear({ commit, getters }, payload) {
    commit(types.SET_START_YEAR + getters.rptPostfix, payload)
  },
  setEndYear({ commit, getters }, payload) {
    commit(types.SET_END_YEAR + getters.rptPostfix, payload)
  },
  setStartFisperd({ commit, getters }, payload) {
    commit(types.SET_START_FISPERD + getters.rptPostfix, payload)
  },
  setEndFisperd({ commit, getters }, payload) {
    commit(types.SET_END_FISPERD + getters.rptPostfix, payload)
  },
  setSelectedAccoNames({ commit, getters }, payload) {
    commit(types.SET_SELECTED_ACCO_NAMES + getters.rptPostfix, payload)
  },
}

// 最后统一导出
export default {
  state,
  getters,
  mutations,
  actions,
}
