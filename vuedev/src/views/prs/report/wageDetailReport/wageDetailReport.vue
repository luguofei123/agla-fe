<!--
 * @Author: sunch
 * @Date: 2020-03-19 11:19:48
 * @LastEditTime: 2020-10-09 14:28:45
 * @LastEditors: Please set LastEditors
 * @Description: 工资明细表视图
 * @FilePath: /ufgov-vue/src/views/prs/wageDetailReport/wageDetailReport.vue
 -->
<template>
  <div>
    <!-- 头部开始 -->
    <ufHeader :title="title">
      <template slot="btns">
        <a-button class="mr-5" :class="getBtnPer('btn-print')" @click="print">打印</a-button>
        <a-button class="mr-5" :class="getBtnPer('btn-export')" @click="exportEvent">导出</a-button>
      </template>
    </ufHeader>

    <!-- 查询条件开始 -->
    <ufQueryArea class="mt-10">
      <div class="flex-between">
        <div class="flex-start">
          <span class="label">部门：</span>
          <a-tree-select
            v-if="orgList.length > 0"
            :maxTagPlaceholder="v =>{return v.length}"
            :treeData="orgList"
            :treeDefaultExpandedKeys="['*']"
            :defaultValue="orgs"
            :maxTagCount="1"
            :dropdownClassName="'myscrollbar'"
            :dropdownStyle="{ 'max-height': '400px' }"
            style="min-width: 250px;max-width: 300px"
            @change="orgChange"
            multiple
            allowClear
            treeCheckable
            searchPlaceholder="请选择部门"
          >
          </a-tree-select>

          <span class="ml-10">数据来源：</span>
          <a-radio-group name="radioGroup" :defaultValue="'RPT_CALC'" @change="onDataFromChange">
            <a-radio :value="'RPT_CALC'">未结账</a-radio>
            <a-radio :value="'RPT_PAYLIST'">已结账</a-radio>
          </a-radio-group>

          <div v-if="dataFrom === 'RPT_PAYLIST'" class="flex-start">
            <a-select v-if="monthEnd" :defaultValue="monthStart" style="width: 80px" @change="startMonthOnChange">
              <a-select-option :value="item.value" v-for="item in allMonth" :key="item.value">{{ item.label }}</a-select-option>
            </a-select>
            <span>-</span>
            <a-select v-if="monthEnd" :defaultValue="monthEnd" style="width: 80px;" @change="endMonthOnChange">
              <a-select-option :value="item.value" v-for="item in allMonth" :key="item.value">{{ item.label }}</a-select-option>
            </a-select>
            <span style="margin-left:5px">批次：</span>
            <a-select :defaultValue="''" :value="payNoMo" style="width: 80px;" @change="payNoMoChange">
              <a-select-option :value="item.value" v-for="item in payNoMoList" :key="item.key">{{ item.label }}</a-select-option>
            </a-select>
          </div>

          <span class="ml-10">统计方式：</span>
          <a-select :defaultValue="'0'" :value="tjType" style="width: 100px;" @change="onTjChange">
            <a-select-option :value="'0'">明细</a-select-option>
            <a-select-option :value="'dept'">部门小计</a-select-option>
            <a-select-option :value="'1'">合计</a-select-option>
          </a-select>
        </div>

        <div class="flex-start">
          <!-- <ufMoreBtn class="mr-10" @change="moreBtnChange"></ufMoreBtn> -->
          <a-button :class="getBtnPer('btn-query')" type="primary" @click="getSalaryByConditionData(prtypeCode === '*' ? prtypeCodes : [prtypeCode])">查询</a-button>
        </div>
      </div>
      <!--  v-if="showMoreQuery" -->
      <div class="flex-start mt-10">
        <div class="flex-start">
          <span class="label">人员编码：</span>
          <a-input v-model="empCode" style="width: 250px;"></a-input>
        </div>
        <div class="flex-start ml-10">
          <span class="label">姓名：</span>
          <a-input v-model="empNames" style="width: 400px;"></a-input>
        </div>
        <a-checkbox style="margin-left: 10px" :checked="isShowZero" @change="onNoShowEmptyChange">金额为0的列不显示</a-checkbox>
      </div>
    </ufQueryArea>
    
    <!-- 查询条件结束 -->

    <div class="toolBar">
      <ufTab :tabList="tabList" :tabIndex="tabIndex" :maxShowTabNum="6" @clickTabItem="onClickTabItem"></ufTab>
      <div class="toolBarBtn">
        <label>表栏目：</label>
        <!--  defaultValue="lucy" -->
        <a-select v-if="settingId" :defaultValue="settingId" style="width: 156px" :value="settingId" @change="tableSetListChange">
          <a-select-option v-for="item in tableSetList" :key="item.planId" :value="item.planId" @click="tableSetListOnClick(item)">{{ item.planName }}</a-select-option>
        </a-select>
        <a-select v-else style="width: 156px" :value="settingId" @change="tableSetListChange">
          <a-select-option v-for="item in tableSetList" :key="item.planId" :value="item.planId" @click="tableSetListOnClick(item)">{{ item.planName }}</a-select-option>
        </a-select>
        <a-icon type="setting" class="ml-5 tableSetListSetting" @click="showSettingModal" />
        <a-input-search style="width: 200px;height: 32px;margin-left: 10px;border-right: 0" allowClear ref="filterText" @change="onSearchChange" @search="onSearch" placeholder="搜索">
          <a-button class="flex-c-c" slot="enterButton" :showSearchLoading="showSearchLoading">
            <a-icon v-if="!showSearchLoading" style="padding-top: 5px;" ref="searchIcon" type="search" />
            <a-icon v-else style="padding-top: 5px;" ref="searchIcon" type="loading" />
          </a-button>
        </a-input-search>
      </div>
    </div>

    <!-- 表格开始 -->
    <vxe-grid
      border
      stripe
      resizable
      head-align="center"
      :height="tableH"
      show-header-overflow
      show-overflow
      size="mini"
      ref="xTable"
      :auto-resize="true"
      class="xtable mytable-scrollbar"
      :columns="columns"
      :data="filterTableData"
      :highlight-hover-row="true"
      :row-style="rowStyle"
      :toolbar="{ id: 'wageDetailReportTable', resizable: { storage: true } }"
    >
      <template v-slot:setCol>
        <div class="setCols" @click="setCols">
          <a-icon type="bars" />
        </div>
      </template>
    </vxe-grid>
    <!-- 表格结束 -->

    <!-- 自定义分页器开始 -->
    <ufPager :pager-config="page" @page-change="handlePageChange"></ufPager>
    <!-- 自定义分页器结束 -->

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
    >
    </vxe-grid>
    <!-- 隐藏的表格 用来导出 end -->

    <!-- 调栏窗口 开始 -->
    <setColsModal :visible="setColsModalVisible" :data="setColsModalData" :prtypeCode="prtypeCode" :pageId="pageId" @cancel="setColsModalCancel" @confirm="setColsModalConfirm"> </setColsModal>
    <!-- 调栏窗口 结束 -->

    <!-- 表栏目设置 开始 -->
    <setColsSettingModal :visible="settingModalVisible" :list="tableSetList" :pageId="pageId" :prtypeCode="prtypeCode" @settingModalClose="settingModalClose"></setColsSettingModal>
    <!-- 表栏目设置 结束 -->

    <!-- 打印 模板选择model 开始 -->
    <printTempSelectModal v-model="tempModal" :data="printTempls" @cancel="tempModal = false" @printModalConfirm="printModalConfirm"></printTempSelectModal>
    <!-- 打印 模板选择model 结束 -->
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import XEUtils from 'xe-utils'
import XLSX from 'xlsx'
import { saveAs } from 'file-saver';
import moment from 'moment'
import qs from 'qs'
import setColsModal from '@/components/setColsModal'
import { getBtnPer, getPdf } from '@/assets/js/util'
import setColsSettingModal from '@/views/prs/components/setColsSettingModal'
import printTempSelectModal from '@/views/prs/components/printTempSelectModal'
import { construct } from '@aximario/json-tree'
import { defaultColumns, defaultCheckedFields, defaultExportFormat } from './wageDetailReport' //固定显示的列
import '@/render/filterRender'
import '@/render/cellRender'
let firstColumn = [{ title: '序号', width: 50, headerAlign: 'center', align: 'center', type: 'seq', fixed: 'left', slots: { header: 'setCol' } }]
const NODE_ENV = process.env.NODE_ENV
const baseUrl = NODE_ENV === 'development' ? '' : '' //薪资模块 开发环境下添加前缀
const baseSearchProps = ['empName', 'sex', 'orgCodeName', 'prtypeCodeName', 'levelGradeName', 'dutyGradeName', 'payEditStatName', 'isFugle']
let searchProps = [].concat(baseSearchProps)
const allMonth = [
  { label: '1月', value: '1' },
  { label: '2月', value: '2' },
  { label: '3月', value: '3' },
  { label: '4月', value: '4' },
  { label: '5月', value: '5' },
  { label: '6月', value: '6' },
  { label: '7月', value: '7' },
  { label: '8月', value: '8' },
  { label: '9月', value: '9' },
  { label: '10月', value: '10' },
  { label: '11月', value: '11' },
  { label: '12月', value: '12' }
]
export default {
  name: 'wageDetailReport',
  data() {
    return {
      title: '工资明细表', //页面标题
      pageId: 'PRS_SALARY_DETAIL',
      defaultColumns, //默认列
      firstColumn,
      tabList: [], //tab对象数组
      tabIndex: 0, //当前tab角标
      prtypeCode: '',
      mo: 1,
      payNoMo: '',
      payNoMoList: [{ key: 'all', label: '全部', value: '' }],
      monthStart: '1',
      monthEnd: '',
      moveColumns: [], //请求到的列
      //查询框内部分
      orgs: [],
      orgList: [],
      dataFrom: 'RPT_CALC', //数据来源
      tjType: '0', //统计方式
      dateFormat: 'MM',
      // showMoreQuery: false, //是否显示更多查询查询内容
      isShowZero: localStorage.getItem('isShowZero')==='true'?true:false,//金额为0的列不显示
      //调栏部分
      setColsModalVisible: false,
      setColsModalData: {
        columnsNoSeq: [],
        showColumns: []
      },
      allMonth,
      tableData: [],
      filterText: '', //全表搜索框输入的内容{String}
      showSearchLoading: false,
      setColumns: [], //用户已勾选的列并且最终用于表格显示 这些列信息将会包含是否锁定状态 默认用户信息一部分加请求到的列数据10列
      //表栏目部分
      tableSetList: [], //表栏目设置列表
      settingId: '', //默认表栏目对应id
      ordIndex: 1, //表栏目序号
      page: {
        tableName: 'wageDetailReport',
        currentPage: 1,
        pageSize: 50,
        pageSizes: [10, 20, 30, 50, 100, '全部'],
        total: 0
      },
      currentPage: 1,
      pageSize: 50,
      //表栏目窗口开始
      settingModalVisible: false,
      //打印部分 
      tempModalLoading: false,//打印按钮loading
      tempModal: false, //模板选择弹窗显示
      printTempls: [], //打印模板数据集合
      openExport: false,
      empCode: '',//人员编码搜索
      empNames: '' //人员姓名搜索
    }
  },
  computed: {
    ...mapState({
      pfData: state => state.pfData,
      containerH: state => state.containerH,
      showColumns: state => state.setCols.showColumns,
      json: state => state.setCols.json,
      planId: state => state.setCols.planId
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
        console.log(rest)
        return rest
      } else {
        this.tableData.forEach(item => {
          item.highlight = ''
        })
        return this.tableData
      }
    }
  },
  watch: {},
  created() {
    this.tableH = this.containerH - 250
    this.setWageTableColsPlan({
      ordIndex: 1,
      planId: '',
      planName: ''
    })
  },
  mounted() {
    this.monthEnd = String(new Date().getMonth() + 1)

    this.findPrsTypeCoIsUsedByPrsCalc(() => {
      this.getPrsOrgTreeIsUsed(() => {
        this.onClickTabItem(this.tabList[0])
      })
    })
  },
  components: {
    setColsModal,
    setColsSettingModal,
    printTempSelectModal
  },
  methods: {
    moment,
    getBtnPer,
    ...mapActions(['setColumnsNoSeq', 'setShowColumns', 'setWageTableColsPlan']),
    /**
     * @description: 更多按钮变化
     */
    // moreBtnChange(val){
    //   this.showMoreQuery = val
    // },
    /**
     * @description: 搜索
     */
    onSearch(val) {
      if (!val) {
        return
      }
      if (!this.showSearchLoading) {
        console.log(val)
        this.showSearchLoading = true
        this.filterText = val
        setTimeout(() => {
          this.showSearchLoading = false
        }, 1000)
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
     * @description: 部门选择
     */
    orgChange(val) {
      // console.log(val)
      this.orgs = val
    },
    /**
     * @description: 获取部门信息并自动全选
     */
    getPrsOrgTreeIsUsed(callback) {
      this.$axios
        //8.20.14版本 80平台代码
        // .get('/prs/emp/prsOrg/getPrsOrgTreeIsUsed?roleId=' + this.pfData.svRoleId)
        //8.30版本 85平台代码
        .get('/ma/emp/prsOrg/getPrsOrgTreeIsUsed?roleId=' + this.pfData.svRoleId)
        .then(result => {
          if (result.data.flag === 'success') {
            if (result.data.data && result.data.data.length > 0) {
              var newarr = []
              this.orgs = []
              result.data.data.forEach(item => {
                this.orgs.push(item.id)
                newarr.push({
                  key: item.id,
                  value: item.id,
                  pId: item.pId,
                  title: item.codeName,
                  name: item.name,
                  isLeafn: item.isLeaf === 'Y' ? true : false
                })
              })
              let treeData = construct(newarr, {
                id: 'key',
                pid: 'pId',
                children: 'children'
              })
              let allObj = {
                id: '*',
                value: '*',
                pid: '',
                title: '全部',
                name: '全部',
                isLeafn: false,
                children: []
              }
              allObj.children = allObj.children.concat(treeData)
              this.orgList = [allObj]
              // console.log(JSON.stringify(this.orgList))
              if (callback && typeof callback === 'function') {
                callback()
              }
            } else {
              throw '未获取到部门信息'
            }
          } else {
            throw result.data.msg
          }
        })
        .catch(this.$showError)
    },
    /**
     * @description: 获取工资类别
     */
    findPrsTypeCoIsUsedByPrsCalc(callback) {
      this.$showLoading()
      this.$axios
        .post('/prs/prscalcdata/findPrsTypeCoIsUsedByPrsCalc', {
          flag: 'CALCBZ'
        })
        .then(result => {
          this.$hideLoading()
          // console.log(result)
          if (result.data.flag === 'success') {
            if (result.data.data && result.data.data.length > 0) {
              this.mo = result.data.data[0].mo
              this.tabList = []
              this.prtypeCodes = []
              this.prtypeCodeList = []
              result.data.data.forEach((item, index) => {
                item.current = index
                item.text = item.prtypeName
                if (parseInt(item.mo) > parseInt(this.mo)) {
                  this.mo = item.mo
                }
                this.tabList.push(item)
                this.prtypeCodes.push(item.prtypeCode)
                this.prtypeCodeList.push(item)
              })
              let cur = this.tabList.length
              this.tabList.push({ current: cur, text: '全部', prtypeCode: '*', mo: this.mo })
              // console.log(this.tabList)
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
    /**
     * @description: 数据来源改变
     */
    onDataFromChange(e) {
      this.dataFrom = e.target.value
    },
    /**
     * @description: 统计方式
     */
    onTjChange(value) {
      console.log(value)
      this.tjType = value
    },
    /**
     * @description: 点击tab的回调
     */
    onClickTabItem(item) {
      // console.log(item)
      this.tabIndex = item.current
      this.prtypeCode = item.prtypeCode
      this.$axios.get('/prs/rpt/PrsRptData/getMaxPayNoMo?prtypeCode='+(item.prtypeCode==='*'?'':item.prtypeCode)).then(result =>{
        console.log(result)
        if(result.data.flag!='success'){
          throw result.data.msg
        }
        this.payNoMoList = [{ key: 'all', label: '全部', value: '' }]
        for(let i = 1;i <= result.data.data;i++){
          this.payNoMoList.push({ key: i, label: String(i), value: String(i) })
        }
        if (this.payNoMo != '' && parseInt(this.payNoMo) > parseInt(result.data.data)) {
          this.payNoMo = ''
        }
      }).catch(error =>{
        this.$message.error(error)
      })
      this.fromPrtypeCode = item.prtypeCode
      this.mo = item.mo
      if (item.prtypeCode === '*') {
        this.getSalaryByConditionData(this.prtypeCodes)
      } else {
        this.getSalaryByConditionData([item.prtypeCode])
      }
    },
    getSalaryByConditionData(prtypeCodes) {
      if (parseInt(this.monthStart) > parseInt(this.monthEnd)) {
        this.$message.error('起始月份不能大于结束月份')
        return
      }
      this.$showLoading()
      this.setWageTableColsPlan({
        planId: '',
        ordIndex: 1,
        planName: ''
      })
      let argu = {
        orgCodes: this.orgs,
        prtypeCodes: prtypeCodes,
        flag: this.dataFrom, //RPT_CALC 未结账当月数据 RPT_PAYLIST 已结账历史数据
        monthStart: this.dataFrom === 'RPT_PAYLIST' ? this.monthStart : '',
        monthEnd: this.dataFrom === 'RPT_PAYLIST' ? this.monthEnd : '',
        payNoMo: this.dataFrom === 'RPT_PAYLIST' ? this.payNoMo : '',
        totalType: this.tjType, //0  dept
        isShowZero: this.isShowZero?'1':'0',
        empCode: this.empCode,
        empNames: this.empNames.split(/\uff0c|\s+/)//中文逗号或空格分隔
      }

      this.currentPage ? argu.pageNum = this.currentPage:false
      this.pageSize ? argu.pageSize = this.pageSize:false
      this.$axios
        .post('/prs/rpt/PrsRptData/getSalaryByConditionData', argu)
        .then(result => {
          if(result.data.flag === 'fail'){
              throw result.data.msg
          }
          // console.log('渲染开始时间:', new Date().getTime())
          let len = result.data.data.prsCalcDatas.length
          // console.log(len)
          // let footerData = result.data.data.prsCalcDatas.splice(len - 1,1)
          if (len > 0) {
            result.data.data.prsCalcDatas[len - 1].lastRow = true
          }
          this.tableData = result.data.data.prsCalcDatas
          // console.log(this.tableData.length)
          this.page.total = result.data.data.page.total
          this.moveColumns = []
          result.data.data.moveItem.forEach(item => {
            let key = this._.keys(item)[0]
            let field = 'prPaylistN' + key.slice(12)
            if (key.indexOf('PR_PAYLIST_N') > -1) {
              let colObj = {
                field: field,
                title: item[key],
                headerAlign: 'center',
                align: 'right',
                minWidth: 80 + (item[key].length < 8 ? item[key].length * 12 : item[key].length * 14),
                filters: [{ data: '' }],
                filterRender: { name: 'filterMoneyInput' },
                sortable: true,
                cellRender: { name: 'moneyHighLight' },
                checked: false
              }
              this.moveColumns.push(colObj)
            }
          })
          // console.log(this.moveColumns)
          //解决由于动态显示隐藏列时候 表格不刷新导致的错乱问题
          this.$nextTick(() => {
            this.$refs.xTable.refreshColumn()
          })
          // 表格数据
          let prsCalcDatas = result.data.data.prsCalcDatas
          this.tableSetList = []
          return this.$axios.get(baseUrl + '/prs/prsqueryplan/getPrsQueryPlan?pageId=' + this.pageId + '&prtypeCode=' + (prtypeCodes.length > 1 ? '*' : prtypeCodes[0])).then(res => {
            // console.log(res)
            return new Promise(resolve => {
              if (res.data.flag === 'success') {
                if (res.data.data && res.data.data.length > 0) {
                  let jObj = null
                  if(!this.settingId){
                    this.settingId = res.data.data[0].planId
                    // if(res.data.data[0].json){
                      jObj = res.data.data[0]
                    // }
                  }else{
                    let flag = false
                    res.data.data.forEach(item =>{
                      if(item.planId===this.settingId){
                        flag = true
                        jObj = item
                      }
                    })
                    if(!flag){//当前planId的调栏不存在
                      this.settingId = res.data.data[0].planId
                      jObj = res.data.data[0]
                    }
                  }
                  this.tableSetList = res.data.data
                  resolve({ res: jObj, prsCalcDatas: prsCalcDatas, prtypeCode: prtypeCodes.length > 1 ? '*' : prtypeCodes[0] })
                } else {
                  this.settingId = ''
                  this.tableSetList = []
                  resolve({ res: null, prsCalcDatas: prsCalcDatas, prtypeCode: prtypeCodes.length > 1 ? '*' : prtypeCodes[0] })
                  console.log({ res: null, prsCalcDatas: prsCalcDatas })
                  console.log('未查询到工资类别为：' + this.tabList[this.tabIndex].text + '(' + (prtypeCodes.length > 1 ? '*' : prtypeCodes[0]) + ') 的调栏设置')
                  // reject('未查询到工资类别为：全部 的调栏设置')
                }
              } else {
                this.$hideLoading()
                this.settingId = ''
                this.tableSetList = []
                // throw '获取用户调栏设置失败，' + res.data.msg
                console.log('获取用户调栏设置失败，' + res.data.msg)
              }
            })
          })
        })
        .then(result => {
          // console.log(result.res)
          if (!result) {
            return
          }
          let json = []
          if (result.res) {
            if(result.res.json){
              json = JSON.parse(result.res.json)
            }
            this.setWageTableColsPlan({
              ordIndex: result.res.ordIndex,
              planId: result.res.planId,
              planName: result.res.planName
            })
          }else{
            this.setWageTableColsPlan({
              ordIndex: 1,
              planId: '',
              planName: ''
            })
          }
          //this.moveColumns 和 this.defaultColumns 合并组合成了 this.columnsNoSeq 这个决定了调栏默认勾选了哪些项
          this.moveColumns.forEach(item => {
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
          //this.showColumns 直接决定显示哪些列
          let showColumns = []
          if (json && json.length > 0) {
            //如果服务器上有保存的调栏信息
            //从json转换的表格列设置不能直接使用 必须校验一下所有的列是否存在 因为列可能会被删除 改名
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
          //this.setColumns与 vuex里的Action: setShowColumns的参数showColumns不能是同一个引用对象
          let arr1 = [], arr2 = []
          showColumns.forEach(item =>{
            if(item.fixed){
              arr1.push(item)
            }else{
              arr2.push(item)
            }
          })
          this.setColumns = arr1.concat(arr2)
          // console.log(showColumns)
          //初始化显示列 默认全部显示
          this.setShowColumns(showColumns)
          this.$set(this.setColsModalData, 'showColumns', showColumns)
          // console.log('渲染结束时间:', new Date().getTime())
          this.$nextTick(() => {
            this.setColumnsNoSeq(JSON.parse(JSON.stringify(this.columnsNoSeq)))
            this.$set(this.setColsModalData, 'columnsNoSeq', JSON.parse(JSON.stringify(this.columnsNoSeq)))
            //解决由于动态显示隐藏列时候 表格不刷新导致的错乱问题
            this.$refs.xTable.refreshColumn()
            this.tableData = result.prsCalcDatas
            this.$hideLoading()
          })
        })
        .catch(this.$showError)
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
     * @description: 打印
     */
    print() {
      this.tempModalLoading = true
      let opt = {
          agencyCode: this.pfData.svAgencyCode,
          acctCode:this.pfData.svAcctCode,
          rgCode:this.pfData.svRgCode,
          setYear:this.pfData.svSetYear,
          sys:"121",
          directory:"工资明细表"
        }
        this.$axios.post(
          '/pqr/api/templ',
           qs.stringify(opt),
          {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
          }
        ).then(result =>{
          // console.log(result)
          this.tempModalLoading = false
          if(result.data.data&&result.data.data.length >0){
            this.tempModal = true
            this.printTempls = result.data.data
          }
        }).catch(error=>{
          console.log(error)
          this.tempModalLoading = false
        })
    },
    printModalConfirm(tempInfo){
      console.log(tempInfo)
      this.$showLoading()
      let prtypeCodes = []
      if (this.prtypeCode === '*') {
        prtypeCodes = this.prtypeCodes
      } else {
        prtypeCodes = [this.prtypeCode]
      }
      let argu = {
        orgCodes: this.orgs,
        prtypeCodes: prtypeCodes,
        flag: this.dataFrom,
        planId: this.settingId,
        monthStart: this.dataFrom === 'RPT_PAYLIST' ? this.monthStart : '',
        monthEnd: this.dataFrom === 'RPT_PAYLIST' ? this.monthEnd : '',
        payNoMo: this.dataFrom === 'RPT_PAYLIST' ? this.payNoMo : '',
        totalType: this.tjType, //0  dept
        isShowZero: this.isShowZero?'1':'0'
      }
      this.currentPage ? argu.pageNum = this.currentPage:false
      this.pageSize ? argu.pageSize = this.pageSize:false
      let that = this
      this.$axios
        .post('/prs/rpt/PrsRptData/printSalaryDetailData', argu)
        .then(result => {
          if (result.data.flag === 'success') {
            console.log(result)
            let data = JSON.stringify(result.data.data)
            getPdf(tempInfo.reportCode, tempInfo.templId, data,()=>{
              that.$hideLoading()
              that.tempModal = false
            }, (error) => {
              that.$message.error(error)
              that.$hideLoading()
            })
          } else {
            throw result.data.msg
          }
        })
        .catch(this.$showError)
    },
    /**
     * @description: 导出工具函数
     */
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
        setTimeout(()=>{
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
          saveAs(blob, nameCode + this.pfData.svSetYear + '年' + this.mo + '月工资明细表导出.xlsx',)
          this.openExport = false
          this.$hideLoading()
        }, 500)
      }, 500)
    },
    /**
     * @description: 调栏窗口取消
     */
    setColsModalCancel() {
      this.setColsModalVisible = false
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
    },
    /**
     * @description: 起始月change
     */
    startMonthOnChange(val) {
      this.monthStart = val
    },
    /**
     * @description: 结束月change
     */
    endMonthOnChange(val) {
      this.monthEnd = val
    },
    /**
     * @description: 月批次改变
     */
    payNoMoChange(val) {
      console.log(val)
      this.payNoMo = val
    },
    /**
     * @description: 点击调栏按钮
     */
    setCols() {
      this.setColsModalVisible = true
    },
    /**
     * @description: 表栏目改变
     */
    tableSetListChange(val) {
      // console.log(val)
      this.settingId = val
    },
    /**
     * @description: 点击表栏目的项
     */
    tableSetListOnClick(item) {
      // console.log(item)
      this.setColumnsNoSeq([])
      this.setShowColumns([])

      this.$showLoading()
      this.ordIndex = item.ordIndex

      searchProps = []
      searchProps = searchProps.concat(baseSearchProps)

      let json = []
      if (item.json) {
        console.log('json存在')
        json = JSON.parse(item.json)
      }
      console.log(json)
      this.setWageTableColsPlan({
        ordIndex: item.ordIndex,
        planId: item.planId,
        planName: item.planName
      })
      //this.moveColumns 和 this.defaultColumns 合并组合成了 this.columnsNoSeq 这个决定了调栏默认勾选了哪些项
      this.moveColumns.forEach(item => {
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
      //this.showColumns 直接决定显示哪些列
      let showColumns = []
      if (json && json.length > 0) {
        //如果服务器上有保存的调栏信息
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
        //如果没有保存的调栏信息
        //调栏内勾选项初始化
        this.columnsNoSeq.forEach(item => {
          if (item.checked) {
            delete item.fixed
            showColumns.push(item)
            searchProps.push(item.field)
          }
        })
      }
      // console.log(JSON.stringify(showColumns))
      //this.setColumns与 vuex里的Action: setShowColumns的参数showColumns不能是同一个引用对象
      let arr1 = [], arr2 = []
      showColumns.forEach(item =>{
        if(item.fixed){
          arr1.push(item)
        }else{
          arr2.push(item)
        }
      })
      this.setColumns = arr1.concat(arr2)
      //初始化显示列 默认全部显示
      this.setShowColumns(showColumns)
      this.$set(this.setColsModalData, 'showColumns', showColumns)
      this.$nextTick(() => {
        this.setColumnsNoSeq(JSON.parse(JSON.stringify(this.columnsNoSeq)))
        console.log(JSON.stringify(this.columnsNoSeq))
        this.$set(this.setColsModalData, 'columnsNoSeq', JSON.parse(JSON.stringify(this.columnsNoSeq)))
        //解决由于动态显示隐藏列时候 表格不刷新导致的错乱问题
        this.$refs.xTable.refreshColumn()
        this.$hideLoading()
      })
    },
    /**
     * @description: 搜索栏获取焦点
     */
    searchInputOnFocus() {},
    /**
     * @description: 页数改变
     */
    handlePageChange({ currentPage, pageSize }) {
      console.log('页数改变')
      if(pageSize==='全部'){
        // this.currentPage = 1
        // this.pageSize = 999999999
        this.currentPage = ''
        this.pageSize = ''
      }else{
        this.currentPage = currentPage
        this.pageSize = pageSize
      }
      if(this.prtypeCode){
        if (this.prtypeCode === '*') {
          this.getSalaryByConditionData(this.prtypeCodes)
        } else {
          this.getSalaryByConditionData([this.prtypeCode])
        }
      }
    },
    /**
     * @description: 点击齿轮设置 显示表栏目设置窗口
     */
    showSettingModal() {
      this.settingModalVisible = true
    },
    /**
     * @description: 表栏目窗口关闭
     */
    settingModalClose() {
      console.log('表栏目窗口关闭')
      this.settingModalVisible = false
      if (this.prtypeCode === '*') {
        this.getSalaryByConditionData(this.prtypeCodes)
      } else {
        this.getSalaryByConditionData([this.prtypeCode])
      }
    },
    /**
     * @description: 行样式
     */
    rowStyle({ row }) {
      // console.log(row)
      if (row.lastRow) {
        return {
          color: '#333',
          fontWeight: 'bold',
          backgroundColor: '#EEEEEE'
        }
      }
      if(row.isEdit === 'dept'){
        return {
          color: '#333',
          backgroundColor: '#99CCFF'
        }
      }
    },
    /**
     * @description: 金额为0的列不显示 勾选变化
     */
    onNoShowEmptyChange(e){
      this.isShowZero = e.target.checked
      localStorage.setItem('isShowZero', this.isShowZero)
    }
  }
}
</script>
<style lang="scss" scoped>
@import '@/assets/styles/variable.scss';
.label{
  min-width: 74px;
  text-align: left;
}
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
.tableSetListSetting {
  font-size: 16px;
  color: $uf-link-color;
  cursor: pointer;
}
.ant-input-group > .ant-input-affix-wrapper:not(:last-child) .ant-input {
  border-right: 0;
  outline: none;
}
</style>
