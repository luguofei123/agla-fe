<!--
 * @Author: sunch
 * @Date: 2020-04-08 17:49:45
 * @LastEditTime: 2020-10-09 14:32:05
 * @LastEditors: Please set LastEditors
 * @Description: 工资审核
 * @FilePath: /ufgov-vue/src/views/prs/wageAudit/wageAudit.vue
 -->
<template>
  <div>
    <!-- 头部开始 -->
    <ufHeader :title="title">
      <template slot="btns">
        <a-button class="mr-5" :class="getBtnPer('btn-back')" @click="onClickCalcBack(queryTableData)">退回</a-button>
        <a-button type="primary" :class="getBtnPer('btn-audit')" class="mr-5" @click="onClickCalc(queryTableData)">审核</a-button>
      </template>
    </ufHeader>
    <!-- 头部结束 -->

    <!-- 工具条开始 -->
    <div class="toolBar">
      <ufTab :tabList="tabList" :tabIndex="tabIndex" :maxShowTabNum="6" @clickTabItem="onClickTabItem"></ufTab>
      <div class="toolBarBtn">
        <div class="showMo mr-10">当前编制月份：{{ mo }}月份{{ payNoMo === 1 ? '' : '第' + payNoMo + '批次' }}</div>
        <a-input-search style="width: 200px;margin-right: 5px;border-right: 0" allowClear ref="filterText" @change="onSearchChange" @search="onSearch" placeholder="搜索">
          <a-button class="flex-c-c" slot="enterButton" :showSearchLoading="showSearchLoading">
            <a-icon v-if="!showSearchLoading" style="padding-top: 5px;" ref="searchIcon" type="search" />
            <a-icon v-else style="padding-top: 5px;" ref="searchIcon" type="loading" />
          </a-button>
        </a-input-search>
        <!-- <a-tooltip placement="bottom">
                    <template slot="title">
                    <span>框架内铺满显示</span>
                    </template>
                    <a-button class="mr-5" @click="zoomTable"><a-icon type="fullscreen" /></a-button>
                </a-tooltip> -->
        <a-radio-group style="display: flex;">
          <a-tooltip placement="bottom">
            <template slot="title">
              <span>打印</span>
            </template>
            <a-radio-button :class="getBtnPer('btn-print')" value="print" @click="print">
              <a-icon type="printer" />
            </a-radio-button>
          </a-tooltip>
          <a-tooltip placement="bottom">
            <template slot="title">
              <span>导出Excel文件</span>
            </template>
            <a-radio-button :class="getBtnPer('btn-export')" value="exportData" @click="exportEvent">
              <a-icon type="upload" />
            </a-radio-button>
          </a-tooltip>
        </a-radio-group>
      </div>
    </div>
    <!-- 工具条结束 -->

    <!-- 表格开始 -->
    <vxe-grid
      border
      stripe
      resizable
      head-align="center"
      :height="tableH"
      show-overflow
      show-header-overflow
      size="mini"
      ref="xTable"
      :auto-resize="true"
      class="xtable mytable-scrollbar"
      :columns="columns"
      :data="filterTableData"
      :cell-style="cellStyle"
      :highlight-hover-row="true"
      :toolbar="{ id: 'wageAuditTable', resizable: { storage: true } }"
    >
      <template v-slot:linkToDetail="record">
        <div v-if="record.row.LASTROW" class="blod">{{ record.row.EMP_NAME }}</div>
        <div v-else class="jump-link" @click="showEmpDetail(record)">
          {{ record.row.EMP_NAME }}
        </div>
      </template>
      <template v-slot:setCol>
        <div class="setCols" @click="setCols">
          <a-icon type="bars" />
        </div>
      </template>
    </vxe-grid>
    <!-- 表格结束 -->

    <!-- 隐藏的表格 用来导出 begin -->
    <vxe-grid
      v-if="openExport"
      style="width: 999999px;"
      height="999999"
      show-overflow
      show-header-overflow
      ref="xTableHide"
      class="tableHide"
      :columns="setColumns"
      :data="filterTableData"
    >
    </vxe-grid>
    <!-- 隐藏的表格 用来导出 end -->

    <!-- 点姓名弹出的记录明细 开始 -->
    <uf-modal title="记录明细" v-model="empDetailModalVisible" @cancel="empDetailModalCancel" style="top: 20px;" :width="900">
      <a-row type="flex" justify="space-between" align="middle">
        <a-col :span="6">人员编码：{{ empDetailObj.EMP_CODE }}</a-col>
        <a-col :span="6">人员姓名：{{ empDetailObj.EMP_NAME }}</a-col>
        <a-col :span="6">工资类别：{{ empDetailObj.PRTYPE_CODE_NAME + '(' + empDetailObj.SMO + '月' + (empDetailObj.PAY_NO_MO == 1 ? '' : '第' + empDetailObj.PAY_NO_MO + '批次') + ')' }}</a-col>
        <a-col :span="6">
          <a-row>
            <a-button :disabled="rowIndex === 0" @click="showEmpDetail({ row: tableData[0], rowIndex: 0 })">
              <a-icon type="fast-backward" />
            </a-button>
            <a-button
              :disabled="rowIndex === 0"
              @click="
                rowIndex === 0 ? (rowIndex = 0) : --rowIndex
                showEmpDetail({ row: tableData[rowIndex], rowIndex: rowIndex })
              "
              style="margin-left: 5px;"
            >
              <a-icon type="step-backward" />
            </a-button>
            <a-button
              :disabled="rowIndex === tableData.length - 1"
              @click="
                rowIndex === tableData.length - 1 ? rowIndex : ++rowIndex
                showEmpDetail({ row: tableData[rowIndex], rowIndex: rowIndex })
              "
              style="margin-left: 5px;"
            >
              <a-icon type="step-forward" />
            </a-button>
            <a-button :disabled="rowIndex === tableData.length - 1" @click="showEmpDetail({ row: tableData[tableData.length - 1], rowIndex: tableData.length - 1 })" style="margin-left: 5px;">
              <a-icon type="fast-forward" />
            </a-button>
          </a-row>
        </a-col>
      </a-row>
      <!-- 可编辑表 开始 -->

      <vxe-grid
        border
        stripe
        resizable
        keep-source
        head-align="center"
        height="300"
        show-overflow
        size="mini"
        ref="empDetailGrid"
        class="xtable mytable-scrollbar"
        :columns="empDetailColumns"
        :data="empDetailData"
        :auto-resize="true"
        :highlight-hover-row="true"
        :highlight-cell="true"
        style="margin-top: 10px;"
      ></vxe-grid>
      <!-- 可编辑表 结束 -->

      <template slot="footer">
        <a-button key="close" @click="empDetailModalVisible = false">
          关闭
        </a-button>
      </template>
    </uf-modal>
    <!-- 点姓名弹出的记录明细 结束 -->

    <!-- 调栏窗口 开始 -->
    <setColsModal :visible="setColsModalVisible" :data="setColsModalData" :prtypeCode="prtypeCode" :pageId="pageId" @cancel="setColsModalCancel" @confirm="setColsModalConfirm"> </setColsModal>
    <!-- 调栏窗口 结束 -->
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import XEUtils from 'xe-utils'
import XLSX from 'xlsx'
import { saveAs } from 'file-saver';
import moment from 'moment'
import setColsModal from '@/components/setColsModal'
import { defaultColumns, empDetailColumns, defaultCheckedFields, defaultExportFormat } from './wageAudit' //固定显示的列
import { getBtnPer } from '@/assets/js/util' //获取按钮权限方法
import '@/render/filterRender'
import '@/render/cellRender'
import '@/render/editRender'
let firstColumn = [{ title: '序号', width: 50, headerAlign: 'center', align: 'center', type: 'seq', fixed: 'left', slots: { header: 'setCol' } }]
const baseUrl = process.env.NODE_ENV === 'development' ? '' : '' //薪资模块 开发环境下添加前缀
const baseSearchProps = ['empName', 'sex', 'orgCodeName', 'prtypeCodeName', 'levelGradeName', 'dutyGradeName', 'payEditStatName', 'isFugle']
let searchProps = [].concat(baseSearchProps)
export default {
  name: 'wageAudit',
  data() {
    return {
      title: '工资审核', //页面标题
      pageId: 'PRS_CALC_DATA_AUDIT',
      tableH: 600, //表格高度
      tabList: [], //tab对象数组
      tabIndex: 0, //当前tab角标
      showSearchLoading: false,
      filterText: '', //全表搜索框输入的内容{String}
      defaultColumns, //固定显示的列
      firstColumn,
      moveColumns: [], //请求到的列
      tableData: [], //表格数据
      mo: 1, //当前编制月份
      payNoMo: 1, //当前编制月份批次
      minOccurDate: moment()
        .date(1)
        .format('YYYY-MM-DD'), // 期间日期-起始
      maxOccurDate: moment()
        .endOf('month')
        .format('YYYY-MM-DD'), // // 期间日期-结束
      dateFormat: 'YYYY-MM-DD', //日期格式
      prtypeCode: '', //tab类别值
      prtypeCodes: [],
      prtypeCodeList: [],
      tableRecords: [], //原始数据
      setColsModalVisible: false, //调栏窗口显示
      setColsModalLoading: false, //调栏窗口 确定按钮loading
      defaultCheckedColsNum: 10, //不存在 默认勾选的列数量
      setColumns: [], //用户已勾选的列并且最终用于表格显示 这些列信息将会包含是否锁定状态 默认用户信息一部分加请求到的列数据10列
      // haslock: false, //包含锁定列的状态 （暂时废弃）
      saveFlag: false, //提示保存的显示标记
      setColsModalData: {
        columnsNoSeq: [],
        showColumns: []
      },
      //记录明细部分 开始
      empDetailModalVisible: false,
      empDetailColumns,
      empDetailData: [],
      empDetailObj: {},
      empDetailModalSaveLoading: false,
      rowIndex: 0,
      openExport: false
    }
  },
  mounted() {
    let svTransDate = this.pfData.svTransDate
    this.minOccurDate = moment(svTransDate)
      .date(1)
      .format(this.dateFormat) // 期间日期-起始
    this.maxOccurDate = moment(svTransDate)
      .endOf('month')
      .format(this.dateFormat) // // 期间日期-结束
    this.findPrsTypeCoIsUsedByPrsCalc(() => {
      this.onClickTabItem(this.tabList[0])
    })
  },
  watch: {},
  computed: {
    ...mapState({
      pfData: state => state.pfData,
      containerH: state => state.containerH,
      //需要带上setCols模块名
      showColumns: state => state.setCols.showColumns,
      json: state => state.setCols.json,
      planId: state => state.setCols.planId,
      empuids: state => state.choiceEmp.empuids,
      empNames: state => state.choiceEmp.empNames,
      orgcodes: state => state.choiceEmp.orgcodes
    }),
    /**
     * @description: 不包含序号的所有列 用于调栏checkboxs展示
     */
    columnsNoSeq() {
      let columnsNoSeq = this.defaultColumns.concat(this.moveColumns)
      this.setColumnsNoSeq(columnsNoSeq)
      this.$set(this.setColsModalData, 'columnsNoSeq', columnsNoSeq)
      return columnsNoSeq
    },
    /**
     * @description: 包括“序号”在内 基础列数据和请求到的列数据合并组成的所有的列
     */
    columns() {
      let columns = this.firstColumn
      columns = columns.concat(this.setColumns)
      // console.log(columns)
      return columns
    },
    /**
     * @description: 筛选后的表格数据
     */
    filterTableData() {
      const filterText = XEUtils.toString(this.filterText)
        .trim()
        .toLowerCase()
      if (filterText) {
        // const filterRE = new RegExp(filterText, 'gi')
        // console.log(searchProps)

        //取所有列的列名
        let rest = this.tableData.filter(item => {
          let flag = false
          //判断当前列是否可用于全表搜索
          for (let key in item) {
            let flag2 = false
            searchProps.forEach(it => {
              if (it === key) {
                flag2 = true
              }
            })
            if (flag2) {
              if (
                XEUtils.toString(item[key])
                  .toLowerCase()
                  .indexOf(filterText) > -1
              ) {
                item.highlight = key
                item.filterText = filterText
                flag = true
              }
            }
          }
          return flag
        })
        // console.log(rest)
        return rest
      } else {
        this.tableData.forEach(item => {
          item.highlight = ''
        })
        return this.tableData
      }
    }
  },
  created() {
    this.tableH = this.containerH - 110
  },
  methods: {
    moment,
    getBtnPer,
    ...mapActions(['setColumnsNoSeq', 'setShowColumns', 'setWageTableColsPlan', 'setEmpuids', 'clearEmp', 'clearFormula']),
    /**
     * @description: 搜索
     */
    onSearch(val) {
      if (!val) {
        return
      }
      if (!this.showSearchLoading) {
        this.showSearchLoading = true
        setTimeout(() => {
          this.showSearchLoading = false
        }, 1000)
        this.filterText = val
      }
    },
    /**
     * @description: 搜索内容改变
     */
    onSearchChange(e) {
      // console.log(e.target.value)
      if (e.target.value == '') {
        this.filterText = e.target.value
      }
    },
    /**
     * @description: 列配置 点击确定时的监听
     */
    setColsModalConfirm() {
      // console.log(this.showColumns)
      searchProps = []
      searchProps = searchProps.concat(baseSearchProps)
      // console.log(searchProps)
      this.setColsModalVisible = false
      this.setColumns = JSON.parse(JSON.stringify(this.showColumns))
      this.$set(this.setColsModalData, 'columnsNoSeq', JSON.parse(JSON.stringify(this.columnsNoSeq)))
      this.$set(this.setColsModalData, 'showColumns', JSON.parse(JSON.stringify(this.showColumns)))
      this.showColumns.forEach(item => {
        searchProps.push(item.field)
      })
      //解决由于动态显示隐藏列时候 表格不刷新导致的错乱问题
      this.$nextTick(() => {
        this.$refs.xTable.refreshColumn()
      })
      // console.log(this.columns)
    },
    /**
     * @description: 获取部门
     */
    getPrsOrgTreeIsUsed() {
      this.$axios
      //8.20.14版本 80平台代码
        // .get(baseUrl + '/prs/emp/prsOrg/getPrsOrgTreeIsUsed', {
        //8.30版本 85平台代码
        .get(baseUrl + '/ma/emp/prsOrg/getPrsOrgTreeIsUsed', {
          params: {
            roleId: 9607,
            ajax: 1
          }
        })
        .then(result => {
          console.log(result)
        })
    },
    /**
     * @description: 获取工资类别
     */
    findPrsTypeCoIsUsedByPrsCalc(callback) {
      this.$showLoading()
      this.$axios
        .post(baseUrl + '/prs/prscalcdata/findPrsTypeCoIsUsedByPrsCalc?roleId=' + this.pfData.svRoleId + '&ajax=1', {
          flag: 'CALCBZ'
        })
        .then(result => {
          console.log(result)
          if (result.data.flag === 'success') {
            if (result.data.data && result.data.data.length > 0) {
              this.mo = result.data.data[0].mo
              this.payNoMo = result.data.data[0].payNoMo
              this.tabList = [{ current: cur, text: '全部', prtypeCode: '*', mo: this.mo, payNoMo: this.payNoMo }]
              this.prtypeCodes = []
              this.prtypeCodeList = []
              result.data.data.forEach((item, index) => {
                item.current = index
                item.text = item.prtypeName
                this.tabList.push(item)
                this.prtypeCodes.push(item.prtypeCode)
                this.prtypeCodeList.push(item)
              })
              let cur = this.tabList.length
              console.log(this.tabList)
              if (callback && typeof callback === 'function') {
                callback()
              }
            } else {
              throw '未获取到工资类别'
            }
          } else {
            throw result.data.msg
          }
        })
        .catch(this.$showError)
    },
    findCalcDatas(prtypeCodes){
      return new Promise((resolve, reject)=>{
        let that = this, list = []
        function getData(pageNum){
          that.$axios
            .post(baseUrl + '/prs/prscalcdata/findCalcDatas?roleId=' + that.pfData.svRoleId + '&ajax=1', {
              payEditStat: '',
              // orgCodes: [],
              prtypeCodes: prtypeCodes,
              empNames: '',
              flag: 'CALCSH',
              pageNum: pageNum,
              pageSize: 100
            })
            .then(result => {
              list = list.concat(result.data.data.page.list)
              if(!result.data.data.page.isLastPage){
                getData(++pageNum)
              }else{
                resolve({list: list, moveItem: result.data.data.moveItem})
              }
            }).catch(that.$showError)
        }
        getData(1)
      })
    },
    getTableData(prtypeCodes, hideLoading) {
      // console.log('获取数据开始：',new Date().getTime())
      // let t1 = new Date().getTime(), t2 = 0 , t3 = 0
      if(!hideLoading){ this.$showLoading() }
      this.setWageTableColsPlan({
        planId: '',
        ordIndex: 1,
        planName: ''
      })
      this.tableData = []
      this.findCalcDatas(prtypeCodes).then(result =>{
        console.log(result.list)
        console.log(result.moveItem)
        this.$nextTick(()=>{
          // 表格头部数据 列名
          this.moveColumns = []
          result.moveItem.forEach(item => {
            let len = item.itemName.length
            if(item.itemCode === 'SMO'){
              this.moveColumns.push({
                field: item.itemCode,
                title: item.itemName,
                minWidth: 80,
                headerAlign: 'center',
                align: 'center',
                cellRender: { name: 'searchHighLight' },
                checked: false,
                sortable: true,
              })
            }else{
              this.moveColumns.push({
                field: item.itemCode,
                title: item.itemName,
                minWidth: 60 + (len < 8 ? (len * 12) : (len * 14)),
                headerAlign: 'center',
                align: 'right',
                filters: [{ data: '' }],
                filterRender: { name: 'filterMoneyInput' },
                editRender: { name: 'editInput' },
                isDifferentColor: item.isDifferentColor,
                isHighLight: item.isHighLight,
                isEditable: item.isEditable,
                checked: false
              })
            }
            searchProps.push(item.itemCode)
          })
          // console.log(this.moveColumns)
          //解决由于动态显示隐藏列时候 表格不刷新导致的错乱问题
          this.$refs.xTable.refreshColumn()
          // console.log(prsCalcDatas)
          this.tableData = result.list
          //保存表格数据的原始记录记录到一个新的内存地址
          this.tableRecords = JSON.parse(JSON.stringify(result.list))
        })
          return this.$axios.get(baseUrl+'/prs/prsqueryplan/getPrsQueryPlan?pageId='+this.pageId+'&prtypeCode='+(prtypeCodes.length>1?'*':prtypeCodes[0])).then(res =>{
            // console.log(res)
              return new Promise(resolve => {
                if (res.data.flag === 'success') {
                  // this.$message.success('获取用户调栏设置成功')
                  if (res.data.data && res.data.data.length > 0 && res.data.data[0].json) {
                    resolve({res: res.data.data[0], prtypeCode: (prtypeCodes.length>1?'*':prtypeCodes[0])})
                  }else{
                    resolve({res: null, prtypeCode: (prtypeCodes.length>1?'*':prtypeCodes[0])})
                    console.log('未查询到工资类别为：'+ this.tabList[this.tabIndex].text +'('+(prtypeCodes.length>1?'*':prtypeCodes[0])+') 的调栏设置')
                    // reject('未查询到工资类别为：全部 的调栏设置')
                  }
                } else {
                  // throw '获取用户调栏设置失败，' + res.data.msg
                  resolve({res: null, prtypeCode: (prtypeCodes.length>1?'*':prtypeCodes[0])})
                  console.log('获取用户调栏设置失败，' + res.data.msg)
                }
              })
          })
        }).then(result=>{
          // console.log('获取调栏信息结束：', new Date().getTime())
          // console.log(result)
          if(!result){
            return 
          }
          let json;
          if(result.res){
            if(result.res.json){
              json = JSON.parse(result.res.json)
              this.setWageTableColsPlan({
                ordIndex: result.res.ordIndex,
                planId: result.res.planId,
                planName: result.res.planName
              })
            }else{
              this.setWageTableColsPlan({
                ordIndex: 1,
                planId: '',
                planName: '表栏目-1'
              })
            }
          }
          this.moveColumns.forEach(item =>{
            if (json && json.length > 0) {
              //如果服务器上有保存的调栏信息
              json.forEach(it => {
                if (it.field === item.field) {
                  item.checked = true
                }
              })
            } else {
              item.checked = true
            }
          })
          this.defaultColumns.forEach(item => {
            item.checked = false
            delete item.fixed
            if (json && json.length > 0) {
              //如果服务器上有保存的调栏信息
              json.forEach(it => {
                if (it.field === item.field) {
                  item.checked = true
                }
              })
            } else {
              defaultCheckedFields.forEach(field =>{
                if(field === item.field){
                  item.checked = true
                }
              })
            }
          })
          //this.moveColumns 和 this.defaultColumns 合并组合成了 this.columnsNoSeq 这个决定了调栏默认勾选了哪些项
          let showColumns = []
          if (json && json.length > 0) {
            //如果服务器上有保存的调栏信息
            //从json转换的表格列设置不能直接使用 必须校验一下所有的列是否存在 因为列可能会被删除 改名
            //！！！这里保持json先遍历再遍历所有列 否则用户基础信息列的顺序改变将不会生效！！！
            json.forEach(it => {
              this.columnsNoSeq.forEach(item => {
                if (it.field === item.field) {
                  if (item.checked) {
                    if (it.fixed) {
                      item.fixed = it.fixed
                    }
                    searchProps.push(item.field)
                    showColumns.push(item)
                  }
                }
              })
            })
          } else {
            //如果没有包存的调栏信息
            //调栏内勾选项初始化
            this.columnsNoSeq.forEach(item => {
              if (item.checked) {
                delete item.fixed
                showColumns.push(item)
                searchProps.push(item.field)
              }
            })
          }
          //重新排列顺序 有固定列属性的放前边
          let arr1 = [], arr2 = []
          showColumns.forEach(item =>{
            if(item.fixed){
              arr1.push(item)
            }else{
              arr2.push(item)
            }
          })
          showColumns = arr1.concat(arr2)
          this.setColumns = showColumns
          // console.log('第二次构建列结束：',new Date().getTime())
          // console.log(showColumns)
          this.$nextTick(() => {
            //this.setColumns与 vuex里的Action: setShowColumns的参数showColumns不能是同一个引用对象
            this.setColumnsNoSeq(JSON.parse(JSON.stringify(this.columnsNoSeq)))
            //初始化显示列 默认全部显示
            this.setShowColumns(showColumns)
            this.$set(this.setColsModalData, 'columnsNoSeq', JSON.parse(JSON.stringify(this.columnsNoSeq)))
            this.$set(this.setColsModalData, 'showColumns', showColumns)
            //解决由于动态显示隐藏列时候 表格不刷新导致的错乱问题
            this.$refs.xTable.refreshColumn()
            this.$hideLoading()
            // let t4 = new Date().getTime()
            // console.log('刷新列结束：',t4)
            // this.$message.success('请求时间：'+(t2 - t1)/1000+'s  表格渲染时间：'+(t4 - t2)/1000+'s  全部完成时间：'+(t4 - t1)/1000+'s')
          })
        })
        .catch(this.$showError)
    },
    /**
     * @description: 切换tab
     */
    onClickTabItem(item) {
      console.log(item)
      this.clickedTabItem = item
      //检查表格内容是否改变
      this.tabIndex = item.current
      this.prtypeCode = item.prtypeCode
      this.fromPrtypeCode = item.prtypeCode
      this.mo = item.mo
      this.payNoMo = item.payNoMo
      if (item.prtypeCode === '*') {
        this.getTableData(this.prtypeCodes)
      } else {
        this.getTableData([item.prtypeCode])
      }
    },
    /**
     * @description: 表格全屏 缩放 放大
     */
    zoomTable() {},
    /**
     * @description: 打印
     */
    print() {
      let nameCode = this.getAgencyNameCode()
      this.$refs.xTable.print({
        filename: nameCode + this.pfData.svSetYear + '年' + this.mo + '月工资编制',
        sheetName: nameCode + this.pfData.svSetYear + '年' + this.mo + '月工资编制',
        type: 'xlsx'
      })
    },
    toBuffer (wbout) {
      let buf = new ArrayBuffer(wbout.length)
      let view = new Uint8Array(buf)
      for (let index = 0; index !== wbout.length; ++index) view[index] = wbout.charCodeAt(index) & 0xFF
      return buf
    },
    /**
     * @description: 导出
     */
    exportEvent () {
      if(this.openExport === true){
        return
      }
      this.$showLoading()
      this.openExport = true
      setTimeout(()=>{
        this.$nextTick(()=>{
          this.$refs.xTableHide.reloadData(this.tableData)
        })
        setTimeout(() => {
          let table = this.$refs.xTableHide.$el.querySelector('.vxe-table--main-wrapper')
          let book = XLSX.utils.book_new()
          let sheet = XLSX.utils.table_to_sheet(table, { raw: true })
          let headList = []
          for(let prop in sheet){
            let head = prop.replace(/[0-9]/ig,'')
            if(sheet[prop].t== 's'&&(defaultExportFormat.indexOf(sheet[prop].v)>-1)){
              headList.push(head)
            }
            let flag = true
            headList.forEach(item => {
              if(head === item){
                sheet[prop].t = "s"
                sheet[prop].z = "0"
                flag = false
              }
            })
            if(flag){
              if(sheet[prop].t== "n"){
                sheet[prop].z = "#,##0.00"
              }
            }
          }
          XLSX.utils.book_append_sheet(book, sheet)
          let wbout = XLSX.write(book, { bookType: 'xlsx', bookSST: false, type: 'binary' })
          let blob = new Blob([this.toBuffer(wbout)], { type: 'application/octet-stream' })
          let nameCode = this.getAgencyNameCode()
          // 保存导出
          saveAs(blob, nameCode + this.pfData.svSetYear + '年' + this.mo + '月工资审核导出.xlsx',)
          this.openExport = false
          this.$hideLoading()
        }, 500)
      }, 500)
    },
    /**
     * @description: 获取单位代码
     */
    getAgencyCode() {
      let localCode = localStorage.getItem('agencyCode')
      localCode ? localCode : (localCode = '')
      let agencyCode = this.pfData.svAgencyCode ? this.pfData.svAgencyCode : localCode
      return agencyCode
    },
    /**
     * @description: 获取单位名称和代码组成的字符串
     */
    getAgencyNameCode() {
      let localName = localStorage.getItem('agencyName')
      localName ? localName : (localName = '')
      let agencyName = this.pfData.svAgencyName ? this.pfData.svAgencyName : localName
      let agencyCode = this.getAgencyCode()
      return agencyName + '(' + agencyCode + ')'
    },
    /**
     * @description: 根据选择的tab查询表格数据
     */
    queryTableData(hideLoading) {
      if (this.prtypeCode === '*') {
        //显示全部工资编制
        this.getTableData(this.prtypeCodes, hideLoading)
      } else {
        this.getTableData([this.prtypeCode], hideLoading)
      }
    },
    /**
     * @description: 点击调栏按钮
     */
    setCols() {
      this.setColsModalVisible = true
    },
    /**
     * @description: 调栏窗口取消
     */
    setColsModalCancel() {
      this.setColsModalVisible = false
    },
    /**
     * @description: 显示选择人员弹窗
     */
    showEmpDetail({ row, rowIndex }) {
      console.log(row, rowIndex)
      this.rowIndex = rowIndex
      let empDetailData = []
      // row需要根据showColumns重新排列
      this.setColumns.forEach(item => {
        for (let prop in row) {
          if (prop.indexOf('PR_PAYLIST_N') > -1) {
            if (item.field == prop) {
              let obj = {}
              obj.columnName = item.title
              obj.field = prop
              obj.value = row[prop]
              obj.payEditStat = row.PAY_EDIT_STAT
              // row.prsCalcItems?obj.prsCalcItems = row.prsCalcItems : false
              obj.empUid = row.EMP_UID
              obj.prtypeCode = row.PRTYPE_CODE
              //列属性
              obj.isDifferentColor = item.isDifferentColor
              obj.isHighLight = item.isHighLight
              obj.isEditable = item.isEditable
              empDetailData.push(obj)
            }
          }
          this.$set(this.empDetailObj, prop, row[prop])
        }
      })
      this.empDetailData = empDetailData
      this.empDetailModalVisible = true
    },
    /**
     * @description: 记录明细取消
     */
    empDetailModalCancel() {
      this.empDetailModalVisible = false
    },
    /**
     * @description: 单元格样式
     */
    cellStyle({ row, column }) {
      // console.log(row,column)
      let key = column.property+'_TAG', obj = {}
      if(column.own.isDifferentColor == 'Y'&&row[key]){
        obj.color = 'red'
      }
      if(column.own.isHighLight === 'Y'){
        obj.backgroundColor = '#99CCFF'
      }
      return obj
    },
    updateCalcDatas(status, callBack) {
      let prtypeCodes = []
      if (this.prtypeCode === '*') {
        let obj = {}
        this.tableData.forEach(item => {
          obj[item.PRTYPE_CODE] = 1
        })
        for (let p in obj) {
          prtypeCodes.push(p)
        }
      } else {
        prtypeCodes = [this.prtypeCode]
      }
      this.$axios
        .post(baseUrl + '/prs/prscalcdata/updateCalcDatas?roleId=' + this.pfData.svRoleId, {
          payEditStat: status,
          prtypeCodes: prtypeCodes,
          flag: 'CALCBACK'
        })
        .then(result => {
          if (result.data.flag != 'success') {
            throw result.data.msg
          } else {
            if (status === '1') {
              this.$message.success('退回成功')
            } else {
              this.$message.success('审核成功')
            }
            if (typeof callBack === 'function') {
              callBack()
            }
          }
        })
        .catch(error => {
          this.$message.error(error)
        })
    },
    /**
     * @description: 点击退回按钮
     */
    onClickCalcBack(callBack) {
      if (this.tableData.length > 0) {
        this.$confirm({
          title: '您确定要退回吗?',
          content: '',
          okText: '确定',
          cancelText: '取消',
          onOk: () => {
            this.updateCalcDatas('1', callBack)
          },
          onCancel: () => {}
        })
      }
    },
    /**
     * @description: 点击审核按钮
     */
    onClickCalc(callBack) {
      if (this.tableData.length > 0) {
        this.$confirm({
          title: '您确定要审核吗?',
          content: '',
          okText: '确定',
          cancelText: '取消',
          onOk: () => {
            this.updateCalcDatas('3', callBack)
          },
          onCancel: () => {}
        })
      }
    }
  },
  components: {
    setColsModal
  }
}
</script>
<style lang="css">
.ant-btn{
  height: 30px;
}
.ant-radio-button-wrapper{
  height: 30px;
  line-height: 30px;
}
</style>
<style lang="scss" scoped>
@import '@/assets/styles/variable.scss';
.toolBar {
  height: 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #ddd;
  border-bottom: 1px solid #ddd;
  margin-top: 4px;
}
.toolBarBtn {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
.showMo {
  color: #999;
}
.xtable {
  margin-top: 5px;
}
.modalTitle {
  font-size: 14px;
  font-weight: bold;
  border-left: 4px solid $uf-link-color;
  line-height: 14px;
  padding-left: 4px;
}
.a-row {
  padding: 0 10px;
}
.file-upload-input {
  width: 100%;
  height: 100%;
  background: transparent;
  z-index: 999;
  opacity: 0;
  cursor: pointer;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
}
.empInputWrap {
  width: 100%;
  padding: 0 10px;
  box-sizing: border-box;
  height: 32px;
  border-radius: 4px;
  border: 1px solid #d9d9d9;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.empInput {
  width: 640px;
  height: 32px;
  line-height: 32px;
  text-align: left;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  background: transparent;
  outline: none;
  border: none;
  user-select: none;
}
.empInputClear {
  width: 16px;
  height: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 8px;
  cursor: pointer;
}
.formulaTextarea {
  padding: 10px;
  height: 76px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  user-select: none;
  box-sizing: border-box;
}
.blod {
  font-weight: bold;
}
.ant-input-group > .ant-input-affix-wrapper:not(:last-child) .ant-input {
  border-right: 0;
  outline: none;
}
</style>
