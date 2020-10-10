<!--
 * @Author: sunch
 * @Date: 2020-03-19 11:19:48
 * @LastEditTime: 2020-10-09 14:31:19
 * @LastEditors: Please set LastEditors
 * @Description: 工资变动明细表
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
          <div class="flex-start">
            <span class="label">部门：</span>
            <a-tree-select
              v-if="orgList.length > 0"
              :maxTagPlaceholder="
                (v) => {
                  return v.length
                }
              "
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
          </div>

          <div class="ml-10 flex-start">
            <span class="label">对比年月：</span>
            <a-month-picker @change="onStartYearMoChange" :value="moment(yearMoStart, 'YYYY-MM')" :disabled-date="getDisabledDateFn" placeholder="选择对比年月" />
            <span class="ml-10 mr-10">和</span>
            <a-month-picker @change="onEndYearMoChange" :value="moment(yearMoEnd, 'YYYY-MM')" :disabled-date="getDisabledDateFn" placeholder="与前面年月比较" />
          </div>
          
          <a-checkbox style="margin-left: 10px" :checked="isShowNoChange" @change="onNoShowChange">无差额不显示</a-checkbox>
        </div>

        <div class="flex-start">
          <a-button :class="getBtnPer('btn-query')" type="primary" @click="getData">查询</a-button>
        </div>
      </div>

      <div class="flex-start mt-10">
        <div class="flex-start">
          <span class="label">人员编码：</span>
          <a-input v-model="empCode" style="width: 250px;"></a-input>
        </div>
        <div class="flex-start ml-10">
          <span class="label">姓名：</span>
          <a-input v-model="empNames" style="width: 338px;"></a-input>
        </div>
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
        <a-icon type="setting" class="ml-5 tableSetListSetting" @click="settingModalVisible = true" />
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
      :cell-style="cellStyle"
      :toolbar="{ id: 'wageChangesTable', resizable: { storage: true } }"
    >
      <template v-slot:setCol>
        <div class="setCols" @click="setColsModalVisible = true">
          <a-icon type="bars" />
        </div>
      </template>
    </vxe-grid>
    <!-- 表格结束 -->

    <!-- 自定义分页器开始 -->
    <ufPager :pager-config="page" @page-change="handlePageChange"></ufPager>
    <!-- 自定义分页器结束 -->

    <!-- 隐藏的表格 用来导出 begin -->
    <vxe-grid v-if="openExport" style="width: 999999px;" height="999999" show-overflow show-header-overflow ref="xTableHide" class="tableHide" :columns="setColumns"> </vxe-grid>
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
import { saveAs } from 'file-saver'
import moment from 'moment'
import qs from 'qs'
import setColsModal from '@/components/setColsModal'
import { getBtnPer, getPdf } from '@/assets/js/util'
import setColsSettingModal from '@/views/prs/components/setColsSettingModal'
import printTempSelectModal from '@/views/prs/components/printTempSelectModal'
import { construct } from '@aximario/json-tree'
import { defaultColumns, defaultCheckedFields, defaultExportFormat } from './columnsConfig' //固定显示的列
import '@/render/filterRender'
import '@/render/cellRender'
let firstColumn = [{ title: '序号', width: 50, headerAlign: 'center', align: 'center', type: 'seq', fixed: 'left', slots: { header: 'setCol' } }]
const NODE_ENV = process.env.NODE_ENV
const baseUrl = NODE_ENV === 'development' ? '' : '' //薪资模块 开发环境下添加前缀
const baseSearchProps = ['empName', 'sex', 'orgCodeName', 'prtypeCodeName', 'levelGradeName', 'dutyGradeName', 'payEditStatName', 'isFugle']
let searchProps = [].concat(baseSearchProps)

export default {
  name: 'wageChangesTable',
  data() {
    return {
      title: '工资变动明细表', //页面标题
      pageId: 'PRS_SALARY_CHANGE_DATA',
      tableH: 300,
      defaultColumns, //默认列
      firstColumn,
      tabList: [], //tab对象数组
      tabIndex: 0, //当前tab角标
      prtypeCode: '',
      mo: 1,
      monthStart: '1',
      monthEnd: '',
      moveColumns: [], //请求到的列
      //查询框内部分
      orgs: [],
      orgList: [],
      //调栏部分
      setColsModalVisible: false,
      setColsModalData: {
        columnsNoSeq: [],
        showColumns: [],
      },
      tableData: [],
      filterText: '', //全表搜索框输入的内容{String}
      showSearchLoading: false,
      setColumns: [], //用户已勾选的列并且最终用于表格显示 这些列信息将会包含是否锁定状态 默认用户信息一部分加请求到的列数据10列
      //表栏目部分
      tableSetList: [], //表栏目设置列表
      settingId: '', //默认表栏目对应id
      ordIndex: 1, //表栏目序号
      //分页部分
      page: {
        tableName: 'wageChangesTable',
        currentPage: 1,
        pageSize: 24,
        pageSizes: [24, 54, 99, '全部'],
        total: 0,
      },
      currentPage: 1,
      pageSize: 24,
      //表栏目窗口开始
      settingModalVisible: false,
      //打印部分
      tempModalLoading: false, //打印按钮loading
      tempModal: false, //模板选择弹窗显示
      printTempls: [], //打印模板数据集合
      //对比年月选择器部分
      comparedYearMoList: [],
      startYear: moment().get('year'),
      startMo: String(moment().get('month') + 1),
      endYear: moment().get('year'),
      endMo: String(moment().get('month') + 1),
      yearMoStart: '',
      yearMoEnd: '',
      openExport: false,
      empCode: '',//人员编码搜索
      empNames: '', //人员姓名搜索
      isShowNoChange: false
    }
  },
  computed: {
    ...mapState({
      pfData: (state) => state.pfData,
      containerH: (state) => state.containerH,
      showColumns: (state) => state.setCols.showColumns,
      json: (state) => state.setCols.json,
      planId: (state) => state.setCols.planId,
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
        let rest = this.tableData.filter((item) => {
          let flag = false
          //判断当前列是否可用于全表搜索
          for (let key in item) {
            let flag2 = false
            searchProps.forEach((it) => {
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
        this.tableData.forEach((item) => {
          item.highlight = ''
        })
        return this.tableData
      }
    },
    /**
     * @description: 返回一个 用来处理disabledDate的 使用的函数
     */
    getDisabledDateFn() {
      return (current) => {
        return !this.comparedYearMoList.some((item) => {
          return current.isSame(moment().set({ year: item.setYear, month: parseInt(item.mo) - 1 }), 'month')
        })
      }
    },
  },
  watch: {},
  created() {
    this.tableH = this.containerH - 250
    this.setWageTableColsPlan({
      ordIndex: 1,
      planId: '',
      planName: '',
    })
    this.yearMoStart = moment().format('YYYY-MM')
    this.yearMoEnd = moment().format('YYYY-MM')
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
    printTempSelectModal,
  },
  methods: {
    moment,
    getBtnPer,
    ...mapActions(['setColumnsNoSeq', 'setShowColumns', 'setWageTableColsPlan']),
    onStartYearMoChange(date, dateString) {
      this.startYear = date.get('year')
      this.startMo = String(date.get('month') + 1)
      this.yearMoStart = dateString
    },
    onEndYearMoChange(date, dateString) {
      this.endYear = date.get('year')
      this.endMo = String(date.get('month') + 1)
      this.yearMoEnd = dateString
    },
    /**
     * @description: 点击tab的回调
     */
    onClickTabItem(item) {
      this.tabIndex = item.current
      this.prtypeCode = item.prtypeCode
      this.mo = item.mo
      this.getBeforeData(this.getData)
    },
    /**
     * @description: 获取部门信息并自动全选
     */
    getPrsOrgTreeIsUsed(callback) {
      this.$axios
        //8.30版本 85平台代码
        .get('/ma/emp/prsOrg/getPrsOrgTreeIsUsed?roleId=' + this.pfData.svRoleId)
        .then((result) => {
          if (result.data.flag === 'success') {
            if (result.data.data && result.data.data.length > 0) {
              var newarr = []
              this.orgs = []
              result.data.data.forEach((item) => {
                this.orgs.push(item.id)
                newarr.push({
                  key: item.id,
                  value: item.id,
                  pId: item.pId,
                  title: item.codeName,
                  name: item.name,
                  isLeafn: item.isLeaf === 'Y' ? true : false,
                })
              })
              let treeData = construct(newarr, {
                id: 'key',
                pid: 'pId',
                children: 'children',
              })
              let allObj = {
                id: '*',
                value: '*',
                pid: '',
                title: '全部',
                name: '全部',
                isLeafn: false,
                children: [],
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
          flag: 'CALCBZ',
        })
        .then((result) => {
          this.$hideLoading()
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
     * @description: 查询工资变动对比年度及月份数据
     */
    getBeforeData(callback) {
      this.$axios
        .get('/prs/rpt/PrsRptData/getSalaryChangesYearAndMoData', {
          params: {
            prtypeCode: this.prtypeCode,
          },
        })
        .then((result) => {
          if (result.data.flag === 'success') {
            this.comparedYearMoList = result.data.data
            if (this.comparedYearMoList.length > 0) {
              let startYearMo = this.comparedYearMoList[0],
                endYearMo = this.comparedYearMoList[this.comparedYearMoList.length - 1],
                startMo = (startYearMo.mo > 9 ? startYearMo.mo : '0' + startYearMo.mo),
                endMo = (endYearMo.mo > 9 ? endYearMo.mo : '0' + endYearMo.mo)
              this.startYear = startYearMo.setYear
              this.startMo = startYearMo.mo
              this.endYear = endYearMo.setYear
              this.endMo = endYearMo.mo
              this.yearMoStart = startYearMo.setYear + '-' + startMo
              this.yearMoEnd = endYearMo.setYear + '-' + endMo
              if (callback && typeof callback === 'function') {
                callback()
              }
            } else {
              this.tableData = []
              this.page.total = 0
              this.moveColumns = []
              this.tableSetList = []
              this.$hideLoading()
              let now = moment()
              this.yearMoStart = now.format('YYYY-MM')
              this.yearMoEnd = now.format('YYYY-MM')
              this.startYear = now.get('year')
              this.startMo = String(now.get('month') + 1)
              this.endYear = now.get('year')
              this.endMo = String(now.get('month') + 1)
              this.$message.warning('当前工资类别无有数据的对比年月')
            }
          } else {
            throw result.data.msg
          }
        })
        .catch(this.$showError)
    },
    /**
     * @description: 获取数据
     */
    getData() {
      if (parseInt(this.monthStart) > parseInt(this.monthEnd)) {
        this.$message.error('起始月份不能大于结束月份')
        return
      }
      this.$showLoading()
      this.setWageTableColsPlan({
        planId: '',
        ordIndex: 1,
        planName: '',
      })
      this.tableSetList = []
      this.$axios.get(baseUrl + '/prs/prsqueryplan/getPrsQueryPlan?pageId=' + this.pageId + '&prtypeCode=' + this.prtypeCode)
      .then((res) => {
          return new Promise((resolve, reject) => {
            if (res.data.flag === 'success') {
              if (res.data.data && res.data.data.length > 0) {
                let jObj = null
                if (!this.settingId) {
                  this.settingId = res.data.data[0].planId
                  // if(res.data.data[0].json){
                  jObj = res.data.data[0]
                  // }
                } else {
                  let flag = false
                  res.data.data.forEach((item) => {
                    if (item.planId === this.settingId) {
                      flag = true
                      jObj = item
                    }
                  })
                  if (!flag) {
                    //当前planId的调栏不存在
                    this.settingId = res.data.data[0].planId
                    jObj = res.data.data[0]
                  }
                }
                this.tableSetList = res.data.data
                resolve(jObj)
              } else {
                this.settingId = ''
                console.log('未查询到工资类别为：' + this.tabList[this.tabIndex].text + '(' + this.prtypeCode + ') 的调栏设置')
                // reject('未查询到工资类别为：' + this.tabList[this.tabIndex].text + '(' + this.prtypeCode + ') 的调栏设置')
                resolve({planId: ''})
              }
            } else {
              this.$hideLoading()
              this.settingId = ''
              console.log('获取用户调栏设置失败，' + res.data.msg)
              // throw '获取用户调栏设置失败，' + res.data.msg
              resolve({planId: ''})
            }
          })
        }).then((plan) => {
          // console.log(res)
          return new Promise(resolve => {
            this.$axios.post('/prs/rpt/PrsRptData/getSalaryChangesDetailData', {
              comparedStatYear: this.startYear,
              comparedEndYear: this.endYear,
              comparedStatMo: String(this.startMo),
              comparedEndMo: String(this.endMo),
              orgCodes: this.orgs,
              prtypeCode: this.prtypeCode,
              pageNum: this.currentPage,
              pageSize: this.pageSize,
              empCode: this.empCode,
              empNames: this.empNames.split(/\uff0c|\s+/),//中文逗号或空格分隔
              showImbalance: this.isShowNoChange?'1':'0',
              planId: plan.planId
            }).then((result) => {
                resolve({ plan, data: result })
            })
          })
        })
        .then((res) => {
          let result = res.data, plan = res.plan
          if (result.data.flag === 'fail') {
            throw result.data.msg
          }
          // console.log('渲染开始时间:', new Date().getTime())
          this.tableData = result.data.data.page.list
          this.page.total = result.data.data.page.total
          this.moveColumns = []
          result.data.data.moveItem.forEach((item) => {
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
                checked: false,
              }
              this.moveColumns.push(colObj)
            }
          })
          result.data.data.page.list.forEach((item) => {
            if (item.flag === 'A') {
              item.yearMo = '差额'
              item.empCode = ''
              item.empName = ''
              item.prtypeName = ''
              item.orgName = ''
            }
          })
          // 表格数据
          let prsCalcDatas = result.data.data.page.list
          return new Promise(resolve => {
            resolve({ res: plan, prsCalcDatas: prsCalcDatas, prtypeCode: this.prtypeCode })
          })
        })
        .then((result) => {
          // console.log(result.res)
          if (!result) {
            return
          }
          let json = []
          if (result.res) {
            if (result.res.json) {
              json = JSON.parse(result.res.json)
            }
            this.setWageTableColsPlan({
              ordIndex: result.res.ordIndex,
              planId: result.res.planId,
              planName: result.res.planName,
            })
          } else {
            this.setWageTableColsPlan({
              ordIndex: 1,
              planId: '',
              planName: '',
            })
          }
          //this.moveColumns 和 this.defaultColumns 合并组合成了 this.columnsNoSeq 这个决定了调栏默认勾选了哪些项
          this.moveColumns.forEach((item) => {
            if (json && json.length > 0) {
              //如果服务器上有保存的调栏信息
              json.forEach((it) => {
                if (it.field === item.field) {
                  item.checked = true
                }
              })
            } else {
              item.checked = true
            }
          })
          this.defaultColumns.forEach((item) => {
            item.checked = false
            delete item.fixed
            if (json && json.length > 0) {
              //如果服务器上有保存的调栏信息
              json.forEach((it) => {
                if (it.field === item.field) {
                  item.checked = true
                }
              })
            } else {
              defaultCheckedFields.forEach((field) => {
                if (field === item.field) {
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
            json.forEach((it) => {
              this.columnsNoSeq.forEach((item) => {
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
            this.columnsNoSeq.forEach((item) => {
              if (item.checked) {
                delete item.fixed
                showColumns.push(item)
                searchProps.push(item.field)
              }
            })
          }
          //this.setColumns与 vuex里的Action: setShowColumns的参数showColumns不能是同一个引用对象
          let arr1 = [],
            arr2 = []
          showColumns.forEach((item) => {
            if (item.fixed) {
              arr1.push(item)
            } else {
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
     * @description: 部门选择
     */
    orgChange(val) {
      // console.log(val)
      this.orgs = val
    },
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
        acctCode: this.pfData.svAcctCode,
        rgCode: this.pfData.svRgCode,
        setYear: this.pfData.svSetYear,
        sys: '121',
        directory: '工资变动明细表',
      }
      this.$axios
        .post('/pqr/api/templ', qs.stringify(opt), {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
        })
        .then((result) => {
          // console.log(result)
          this.tempModalLoading = false
          if (result.data.data && result.data.data.length > 0) {
            this.tempModal = true
            this.printTempls = result.data.data
          }
        })
        .catch((error) => {
          console.log(error)
          this.tempModalLoading = false
        })
    },
    /**
     * @description: 选择打印模板确认
     */
    printModalConfirm(tempInfo) {
      console.log(tempInfo)
      this.$showLoading()
      let prtypeCodes = []
      if (this.prtypeCode === '*') {
        prtypeCodes = this.prtypeCodes
      } else {
        prtypeCodes = [this.prtypeCode]
      }
      let argu = {
        comparedStatYear: this.startYear,
        comparedEndYear: this.endYear,
        comparedStatMo: String(this.startMo),
        comparedEndMo: String(this.endMo),
        orgCodes: this.orgs,
        prtypeCode: this.prtypeCode,
        pageNum: this.currentPage,
        pageSize: this.pageSize,
      }
      this.currentPage ? (argu.pageNum = this.currentPage) : false
      this.pageSize ? (argu.pageSize = this.pageSize) : false
      let that = this
      this.$axios
        .post('/prs/rpt/PrsRptData/printSalaryChangeDetailData', argu)
        .then((result) => {
          if (result.data.flag === 'success') {
            console.log(result)
            let data = JSON.stringify(result.data.data)
            getPdf(
              tempInfo.reportCode,
              tempInfo.templId,
              data,
              () => {
                that.$hideLoading()
                that.tempModal = false
              },
              (error) => {
                that.$message.error(error)
                that.$hideLoading()
              }
            )
          } else {
            throw result.data.msg
          }
        })
        .catch(this.$showError)
    },
    /**
     * @description: 导出工具函数
     */
    toBuffer(wbout) {
      let buf = new ArrayBuffer(wbout.length)
      let view = new Uint8Array(buf)
      for (let index = 0; index !== wbout.length; ++index) view[index] = wbout.charCodeAt(index) & 0xff
      return buf
    },
    /**
     * @description: 导出
     */
    exportEvent() {
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
          for (let prop in sheet) {
            let head = prop.replace(/[0-9]/gi, '')
            if (sheet[prop].t == 's' && defaultExportFormat.indexOf(sheet[prop].v) > -1) {
              headList.push(head)
            }
            let flag = true
            headList.forEach((item) => {
              if (head === item) {
                sheet[prop].t = 's'
                sheet[prop].z = '0'
                flag = false
              }
            })
            if (flag) {
              if (sheet[prop].t == 'n') {
                sheet[prop].z = '#,##0.00'
              }
            }
          }
          XLSX.utils.book_append_sheet(book, sheet)
          let wbout = XLSX.write(book, { bookType: 'xlsx', bookSST: false, type: 'binary' })
          let blob = new Blob([this.toBuffer(wbout)], { type: 'application/octet-stream' })
          let nameCode = this.getAgencyNameCode()
          // 保存导出
          saveAs(blob, `${nameCode}${this.startYear}年${this.startMo}月与${this.endYear}年${this.endMo}月工资变动明细表导出.xlsx`)
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
      this.showColumns.forEach((item) => {
        searchProps.push(item.field)
      })
      //解决由于动态显示隐藏列时候 表格不刷新导致的错乱问题
      this.$nextTick(() => {
        this.$refs.xTable.refreshColumn()
      })
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
        planName: item.planName,
      })
      //this.moveColumns 和 this.defaultColumns 合并组合成了 this.columnsNoSeq 这个决定了调栏默认勾选了哪些项
      this.moveColumns.forEach((item) => {
        item.checked = false
        delete item.fixed
        if (json && json.length > 0) {
          //如果服务器上有保存的调栏信息
          json.forEach((it) => {
            if (it.field === item.field) {
              item.checked = true
            }
          })
        } else {
          item.checked = true
        }
      })
      this.defaultColumns.forEach((item) => {
        item.checked = false
        delete item.fixed
        if (json && json.length > 0) {
          //如果服务器上有保存的调栏信息
          json.forEach((it) => {
            if (it.field === item.field) {
              item.checked = true
            }
          })
        } else {
          defaultCheckedFields.forEach((field) => {
            if (field === item.field) {
              item.checked = true
            }
          })
        }
      })
      //this.showColumns 直接决定显示哪些列
      let showColumns = []
      if (json && json.length > 0) {
        //如果服务器上有保存的调栏信息
        json.forEach((it) => {
          this.columnsNoSeq.forEach((item) => {
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
        this.columnsNoSeq.forEach((item) => {
          if (item.checked) {
            delete item.fixed
            showColumns.push(item)
            searchProps.push(item.field)
          }
        })
      }
      // console.log(JSON.stringify(showColumns))
      //this.setColumns与 vuex里的Action: setShowColumns的参数showColumns不能是同一个引用对象
      let arr1 = [],
        arr2 = []
      showColumns.forEach((item) => {
        if (item.fixed) {
          arr1.push(item)
        } else {
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
     * @description: 页数改变
     */
    handlePageChange({ currentPage, pageSize }) {
      if (pageSize === '全部') {
        this.currentPage = 1
        this.pageSize = 999999
      } else {
        this.currentPage = currentPage
        this.pageSize = pageSize
      }
      this.getData()
    },
    /**
     * @description: 表栏目窗口关闭
     */
    settingModalClose() {
      console.log('表栏目窗口关闭')
      this.settingModalVisible = false
      this.getData()
    },
    /**
     * @description: 单元格样式
     */
    cellStyle({ row, column }) {
      let obj = {}
      if (column.own.field && row[column.own.field] && defaultCheckedFields.indexOf(column.own.field) < 0 && row.flag === 'A') {
        obj.background = '#ff9933'
      }
      return obj
    },
    /**
     * @description: 无差额不显示多选框的勾选变化
     */
    onNoShowChange(e){
      this.isShowNoChange = e.target.checked
    }
  },
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
