/*
 * @Author: sunch
 * @Date: 2020-03-11 09:26:43
 * @LastEditTime: 2020-07-31 15:25:57
 * @LastEditors: Please set LastEditors
 * @Description: 此表主要用于开发人员使用代码编辑工具搜索到对应vuex中的mutation关键字
 * @FilePath: /ufgov-vue/src/store/types.js
 */
// 设置app容器高度
const SET_CONTAINER_H = 'SET_CONTAINER_H'
//设置权限列表
const SET_BTN_PERMISSION_LIST = 'SET_BTN_PERMISSION_LIST'
//设置pfData
const SET_PF_DATA = 'SET_PF_DATA'
//如果是移动端 设置tokenid
const SET_TOKEN_ID = 'SET_TOKEN_ID'

//调栏handle集合
let setCols = {
  // 设置调栏模态窗口勾选选项
  SET_COLUMNS_NOSEQ: 'SET_COLUMNS_NOSEQ',
  // 设置调栏模态窗口显示项
  SET_SHOW_COLUMNS: 'SET_SHOW_COLUMNS',
  // 保存的调栏设置
  SET_WAGETABLECOLS_PLAN: 'SET_WAGETABLECOLS_PLAN'
}

//选择人员handle集合
let choiceEmp = {
  //替换模态窗内选择人员Uids
  SET_EMPUIDS: 'SET_EMPUIDS',
  //替换模态窗内选择人员names
  SET_EMPNAMES: 'SET_EMPNAMES',
  //清除EMP信息
  CLEAR_EMP: 'CLEAR_EMP',
  //单位代码集合
  SET_ORGCODES: 'SET_ORGCODES'
}

//公式编辑器handle集合
let formulaEditor = {
  //设置公式值
  SET_FORMULA: 'SET_FORMULA',
  //清除公式
  CLEAR_FORMULA: 'CLEAR_FORMULA',
}

//mintApp集合
let mintApp = {
  BROWSER_TYPE: 'BROWSER_TYPE',
  SYSTEM_TYPE: 'SYSTEM_TYPE'
}
//页面之间跳转
const SET_FROM_WHERE = 'SET_FROM_WHERE'

export default {
  SET_CONTAINER_H,
  SET_BTN_PERMISSION_LIST,
  SET_PF_DATA,
  SET_TOKEN_ID,
  setCols,
  choiceEmp,
  formulaEditor,
  mintApp,
  SET_FROM_WHERE
}
