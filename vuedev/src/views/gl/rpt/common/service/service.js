import { HTTP_TYPE, rptAxios } from '../rptHttp/http.js'
import {
  Get_ReportData,
  Get_ReportDataPage,
  Get_AgencyTree,
  Get_RptAccts,
  Get_AgencyAcctTree,
  Get_PrjList,
  Get_VouType,
  Get_OptList,
  Get_SharePrjList,
  Post_SavePrj,
  Del_deletePrj,
  Get_PrjContent,
  Get_AddQryCount,
  Get_RptAccItemTypePost,
  Get_RptAccas,
  Get_AccItemTree,
  Post_BatchExport,
  Post_printModal,
  Post_printPqr,
  Post_printPqrPdf,
  Get_SysRuleSet,
  Post_fromRmisArgu,
  Get_glRptAssetRcList,
  Get_glRptAssetRcModalList,
  Get_glRptAssetRcModalTree,
  Post_glRptAssetRcModalSave,
  Post_glRptAssetRcSave,
} from '../api/api'

// 获取单位树
export const getAgencyTree = (params) => rptAxios(HTTP_TYPE.GET, Get_AgencyTree, params, {}, '', true)

// 获取账套树
export const getRptAccts = (params) => rptAxios(HTTP_TYPE.GET, Get_RptAccts, params, {}, '', true)

// 获取单位账套树
export const getAgencyAcctTree = (params) => rptAxios(HTTP_TYPE.GET, Get_AgencyAcctTree, params, {}, '', true)

// 明细账-获取查询方案
export const getPrjData = (params) => rptAxios(HTTP_TYPE.GET, Get_PrjList, params, {}, '', false)

// 明细账-删除方案
export const delPrjList = (params) => rptAxios(HTTP_TYPE.DELETE, Del_deletePrj, params, {}, '', true)

// 获取share查询方案
export const getSharePrjList = (params) => rptAxios(HTTP_TYPE.GET, Get_SharePrjList, params, {}, '', false)

// 获取table列表 不分页或只前端分页
export const GetReportData = (type, params, opt) => rptAxios(HTTP_TYPE.GET_POST, Get_ReportData + '/' + type, params, opt, '', true)

// 获取table列表 分页版接口
export const getReportDataPage = (type, params, opt) => rptAxios(HTTP_TYPE.GET_POST, Get_ReportDataPage + '/' + type, params, opt, '', true)

// 明细账-获取凭证类型列表
export const vouTypeList = (params, opt, urlParams) => rptAxios(HTTP_TYPE.GET, Get_VouType, params, opt, urlParams, '', true)

// 明细账-获取查询方案选项列表
export const getOptList = (params, opt, urlParams) => rptAxios(HTTP_TYPE.GET, Get_OptList, params, opt, urlParams, '', true)

// 保存方案
export const postSavePrj = (params, opt) => rptAxios(HTTP_TYPE.GET_POST, Post_SavePrj, params, opt, '', false)

// 查询方案详情
export const getPrjContent = (params) => rptAxios(HTTP_TYPE.GET, Get_PrjContent, params, {}, '', false)

//方案计数
export const addQryCount = (params) => rptAxios(HTTP_TYPE.GET, Get_AddQryCount, params, {}, '', false)

//查询辅助核算项类别数据
export const getRptAccItemTypePost = (params, opt) => rptAxios(HTTP_TYPE.GET_POST, Get_RptAccItemTypePost, params, opt, '', true)

// 查询科目体系数据
export const getRptAccas = (params) => rptAxios(HTTP_TYPE.GET, Get_RptAccas, params, {}, '', true)

// 获取会计科目
export const getAccItemTree = (params) => rptAxios(HTTP_TYPE.GET, Get_AccItemTree, params, {}, '', true)

// 后端导出
export const postBatchExport = (params, opt) => rptAxios(HTTP_TYPE.GET_POST, Post_BatchExport, params, opt, '', false)

// 查询打印模板
export const postprintModal = (params, opt) => rptAxios(HTTP_TYPE.GET_POST, Post_printModal, params, opt, '', false)

//查询打印方案
export const postprintPqr = (params, opt) => rptAxios(HTTP_TYPE.POST, Post_printPqr, params, opt, '', false)

//查询pdf打印
export const postprintPqrPdf = (params, opt) => rptAxios(HTTP_TYPE.POST, Post_printPqrPdf, params, opt, '', false)

//账表数据范围选择框记忆上次选择的数据
export const getSysRuleSet = (params, opt, urlParams) => rptAxios(HTTP_TYPE.GET, Get_SysRuleSet, params, opt, urlParams, '', false)

//获取rmis参数
export const getFromRmisArgu = (params, opt) => rptAxios(HTTP_TYPE.POST, Post_fromRmisArgu, params, opt, '', false)

// 获取与资产对账列表数据
export const getglRptAssetRcList = (params) => rptAxios(HTTP_TYPE.GET, Get_glRptAssetRcList, params, {}, '', false)

// 获取与资产对账页面账的条件 弹出列表数据
export const getglRptAssetRcModalList = (params) => rptAxios(HTTP_TYPE.GET, Get_glRptAssetRcModalList, params, {}, '', false)

// 获取与资产对账页面账的条件 弹出条件的右侧树结构数据
export const getglRptAssetRcModalTree = (params) => rptAxios(HTTP_TYPE.GET, Get_glRptAssetRcModalTree, params, {}, '', false)

// 获取与资产对账页面账的条件 弹出条件选择框后进行保存
export const getglRptAssetRcModalSave = (params, opt) => rptAxios(HTTP_TYPE.GET_POST, Post_glRptAssetRcModalSave, params, opt, '', false)

// 获取与资产对账页面 数据一致的情况下进行保存
export const getglRptAssetRcSave = (params, opt) => rptAxios(HTTP_TYPE.GET_POST, Post_glRptAssetRcSave, params, opt, '', false)
