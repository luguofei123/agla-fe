
// 获取账表数据 不分页或前端分页 后接${'账表类型'}
export const Get_ReportData = '/gl/rpt/getReportData'

// 获取账表数据  后端分页版接口 后接${'账表类型'}
export const Get_ReportDataPage = '/gl/rpt/getReportDataPage'

// 获取单位树
export const Get_AgencyTree = '/gl/eleAgency/getAgencyTree'

// 获取账套树
export const Get_RptAccts = '/gl/eleCoacc/getRptAccts'

// 获取单位账套树
export const Get_AgencyAcctTree = '/ma/sys/common/getAgencyAcctTree'

// 明细账-获取查询方案
export const Get_PrjList = '/gl/rpt/prj/getPrjList'

// 明细账-获取凭证类型列表
export const Get_VouType = '/gl/eleVouType/getVouType'

// 明细账-获取查询方案选项列表
export const Get_OptList = '/gl/rpt/prj/getOptList'

//获取share查询方案
export const Get_SharePrjList = '/gl/rpt/prj/getSharePrjList'

//保存方案
export const Post_SavePrj = '/gl/rpt/prj/savePrj'

//删除方案
export const Del_deletePrj = '/gl/rpt/prj/deletePrj'

//查询方案详情
export const Get_PrjContent = '/gl/rpt/prj/getPrjcontent'

//方案计数
export const Get_AddQryCount = '/gl/rpt/prj/addQryCount'

//查询辅助核算项类别数据
export const Get_RptAccItemTypePost = '/gl/EleAccItem/getRptAccItemTypePost'

//查询科目体系数据
export const Get_RptAccas = '/gl/eleAcca/getRptAccas'

//获取会计科目
export const Get_AccItemTree = '/gl/common/glAccItemData/getAccItemTree'

//后端导出
export const Post_BatchExport= '/pub/file/batchExport'

//查询打印模板接口
export const Post_printModal = '/gl/GlRpt/RptFormats'

//查询打印方案接口
export const Post_printPqr = '/pqr/api/templ'

//查询pqr打印
export const Post_printPqrPdf = '/pqr/api/printpdfbydata'

// 账表数据范围选择框记忆上次选择的数据
export const Get_SysRuleSet = '/gl/vou/getSysRuleSet'

//获取rmis报表跳转参数
export const Post_fromRmisArgu = '/gl/api/getLinkJournalFromRedis'

//获取与资产对账列表数据
export const Get_glRptAssetRcList = '/gl/asset/dataCheck'

//获取与资产对账页面账的条件 弹出列表数据
export const Get_glRptAssetRcModalList = '/gl/glAssetRc/getAccoAndAccItemTree'

//获取与资产对账页面账的条件 弹出条件框右侧树列表数据
export const Get_glRptAssetRcModalTree = '/gl/glAssetRc/getAssetTypeTree'

//获取与资产对账页面账的条件 弹出条件框 保存按钮
export const Post_glRptAssetRcModalSave = '/gl/glAssetRc/saveCondition'

//获取与资产对账页面 数据一致的情况下进行保存
export const Post_glRptAssetRcSave = '/gl/asset/dataSave'

