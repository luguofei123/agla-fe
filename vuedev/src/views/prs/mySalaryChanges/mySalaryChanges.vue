<!--
 * @Author: sunch
 * @Date: 2020-09-23 11:00:39
 * @LastEditTime: 2020-10-09 10:55:12
 * @LastEditors: Please set LastEditors
 * @Description: 个人工资变动明细表
 * @FilePath: /ufgov-vue/src/views/prs/mySalaryChanges/mySalaryChanges.vue
 -->
<template>
  <div>
    <!-- 头部开始 -->
    <ufHeader :title="title">
      <template slot="btns">
        <a-button class="mr-5" :class="getBtnPer('btn-print')" @click="print">打印</a-button>
        <a-button class="mr-5" :class="getBtnPer('btn-export')" @click="exportData">导出</a-button>
      </template>
    </ufHeader>

    <!-- 查询条件开始 -->
    <ufQueryArea class="mt-10">
      <a-row type="flex" justify="space-between" align="middle">
        <a-col :span="22">
          <a-row type="flex" justify="space-between" align="middle">
            <a-col :span="12" class="flex-end">
              <span class="label">对比年月：</span>
              <a-month-picker @change="onStartYearMoChange" :value="moment(yearMoStart, 'YYYY-MM')" :disabled-date="getDisabledDateFn" placeholder="选择对比年月" />
              <span class="ml-10 mr-10">和</span>
              <a-month-picker @change="onEndYearMoChange" :value="moment(yearMoEnd, 'YYYY-MM')" :disabled-date="getDisabledDateFn" placeholder="与前面年月比较" />
            </a-col>
            <a-col :span="12" class="flex-end">
              <span>工资类别：</span>
              <a-select v-if="prtypeCode" :defaultValue="prtypeCode" style="width: 156px" :value="prtypeCode" @change="prtypeCodeChange">
                <a-select-option v-for="item in prtypeCodeList" :key="item.prtypeCode" :value="item.prtypeCode" @click="prtypeCodeOnClick(item)">{{ item.prtypeName }}</a-select-option>
              </a-select>
            </a-col>
          </a-row>
        </a-col>
        <a-col :span="2" class="txt-r">
          <a-button :class="getBtnPer('btn-query')" type="primary" @click="getPersonalSalaryData">查询</a-button>
        </a-col>
      </a-row>
    </ufQueryArea>
    <!-- 查询条件结束 -->

    <div class="toolBar">
      <div class="toolBarBtn">
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
      :height="tableH"
      ref="xTable"
      :auto-resize="true"
      class="xtable mytable-scrollbar"
      :columns="columns"
      :data="filterTableData"
      :highlight-hover-row="true"
      :cell-style="cellStyle"
      :toolbar="{ id: 'mySalaryChanges', resizable: { storage: true } }"
    >
    </vxe-grid>
    <!-- 表格结束 -->

    <!-- 自定义分页器开始 -->
    <ufPager :pager-config="page" @page-change="handlePageChange"></ufPager>
    <!-- 自定义分页器结束 -->
  </div>
</template>
<script>
import { mapState } from 'vuex'
import { getBtnPer, getPdf } from '@/assets/js/util'
import XEUtils from 'xe-utils'
import moment from 'moment'
import '@/render/filterRender'
import '@/render/cellRender'
const baseSearchProps = ['smo']
let searchProps = [].concat(baseSearchProps)

const bankAccOtherColumn = {
  field: 'bankAccOther',
  title: '其他银行账号',
  headerAlign: 'center',
  align: 'center',
  width: 180,
  cellRender: { name: 'searchHighLight' },
}

const noHighlightFields = ['empCode', 'empName', 'yearMo', 'prtypeName', 'orgName']

export default {
  name: 'mySalaryChanges',
  data() {
    return {
      title: '个人工资变动明细表', //页面标题
      showSearchLoading: false,
      columns: [],
      filterText: '', //全表搜索框输入的内容{String}
      tableData: [],
      rmwyid: '',
      prtypeCodeList: [],
      prtypeCode: '',
      prtypeName: '',
      monthStart: '1',
      monthEnd: '',
      agencyCode: '',
      //对比年月选择器部分
      comparedYearMoList: [],
      startYear: moment().get('year'),
      startMo: String(moment().get('month') + 1),
      endYear: moment().get('year'),
      endMo: String(moment().get('month') + 1),
      yearMoStart: '',
      yearMoEnd: '',
      //分页部分
      page: {
        tableName: 'mySalaryChanges',
        currentPage: 1,
        pageSize: 24,
        pageSizes: [24, 54, 99, '全部'],
        total: 0,
      },
      currentPage: 1,
      pageSize: 24,
      setYear: '',
      rgCode: ''
    }
  },
  computed: {
    ...mapState({
      pfData: (state) => state.pfData,
      containerH: (state) => state.containerH,
    }),
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
  created() {
    this.tableH = this.containerH - 210
    this.yearMoStart = moment().format('YYYY-MM')
    this.yearMoEnd = moment().format('YYYY-MM')
  },
  mounted() {
    console.log(this.pfData)
    this.monthEnd = String(new Date().getMonth() + 1)
    this.getRmwyid(this.getPersonalSalaryData)
  },
  methods: {
    moment,
    getBtnPer,
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
      this.$refs.xTable.openExport()
    },
    /**
     * @description: 导出
     */
    exportData() {
      // let nameCode = this.getAgencyNameCode()
      if (parseInt(this.monthStart) > parseInt(this.monthEnd)) {
        this.$message.error('起始月份不能大于结束月份')
        return
      }
      let mo = this.monthStart === this.monthEnd ? this.monthStart : this.monthStart + '-' + this.monthEnd
      this.$refs.xTable.exportData({
        filename: this.pfData.svAgencyName + this.pfData.svUserCode + this.pfData.svUserName + this.prtypeName + this.pfData.svSetYear + '年' + mo + '月个人工资变动明细表导出',
        sheetName: '个人工资',
      })
    },
    /**
     * @description: 1.获取当前登录人Rmwyid（GET）
     */
    getRmwyid(callback) {
      this.$axios
        .get('/prs/rpt/PrsRptData/getRmwyid')
        .then((result) => {
          if (result.data.flag != 'success') {
            throw result.data.msg
          } else {
            console.log(result.data)
            this.rmwyid = result.data.data.rmwyid
            this.agencyCode = result.data.data.agencyCode
            this.setYear = result.data.data.setYear
            this.rgCode = result.data.data.rgCode
            // this.getSetYearByEmpUid(this.rmwyid, callback)
            this.getPrsTypeByRmwyid(this.rmwyid, callback)
          }
        })
        .catch(this.$showError)
    },
    /**
     * @description: 3.获取当前登录人分配的工资类别（GET）
     */
    getPrsTypeByRmwyid(id, callback) {
      this.$axios
        .get('/prs/rpt/PrsRptData/getPrsTypeByRmwyid?rmwyid=' + id + '&queryYear=' + this.pfData.svSetYear + '&agencyCode=' + this.agencyCode)
        .then((result) => {
          if (result.data.flag != 'success') {
            throw result.data.msg
          } else {
            // console.log(result.data)
            if (!result.data.data || result.data.data.length === 0) {
              throw '未能查询到工资类别'
            }
            this.prtypeCodeList = result.data.data
            this.prtypeCode = result.data.data[0].prtypeCode
            this.prtypeName = result.data.data[0].prtypeName
            if (typeof callback === 'function') {
              this.getPersonChangesYearAndMoData(callback)
            }
          }
        })
        .catch(this.$showError)
    },
    /**
     * @description: 获取个人的对比月份和年度
     */
    getPersonChangesYearAndMoData(callback) {
      this.$axios
        .get('/prs/rpt/PrsRptData/getPersonChangesYearAndMoData', { params: { prtypeCode: this.prtypeCode, empUid: this.rmwyid, agencyCode: this.agencyCode,
        setYear: this.setYear, rgCode: this.rgCode } })
        .then((result) => {
          if (result.data.flag === 'success') {
            this.comparedYearMoList = result.data.data
            if (this.comparedYearMoList.length > 0) {
              let startYearMo = this.comparedYearMoList[0],
                endYearMo = this.comparedYearMoList[this.comparedYearMoList.length - 1],
                startMo = startYearMo.mo > 9 ? startYearMo.mo : '0' + startYearMo.mo,
                endMo = endYearMo.mo > 9 ? endYearMo.mo : '0' + endYearMo.mo
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
            }
          } else {
            throw result.data.msg
          }
        })
        .catch(this.$showError)
    },
    /**
     * @description: 个人工资查询数据 post
     */
    getPersonalSalaryData() {
      if (!this.rmwyid) {
        this.$message.error('无工资数据')
        return
      }
      if (!this.prtypeCode) {
        this.$message.error('工资类别为空')
        return
      }
      if (parseInt(this.monthStart) > parseInt(this.monthEnd)) {
        this.$message.error('起始月份不能大于结束月份')
        return
      }
      this.$axios
        .post('/prs/rpt/PrsRptData/getSalaryChangesDetailData', {
          comparedStatYear: this.startYear,
          comparedEndYear: this.endYear,
          comparedStatMo: String(this.startMo),
          comparedEndMo: String(this.endMo),
          prtypeCode: this.prtypeCode,
          empUid: this.rmwyid,
          pageNum: this.currentPage,
          pageSize: this.pageSize,
        })
        .then((result) => {
          if (result.data.flag === 'fail') {
            throw result.data.msg
          }
          // console.log('渲染开始时间:', new Date().getTime())
          this.tableData = result.data.data.page.list
          this.page.total = result.data.data.page.total
          this.columns = []
          result.data.data.moveItem.forEach((item) => {
            let key = this._.keys(item)[0]
            if (key === 'smo') {
              this.columns.push({
                field: 'yearMo',
                title: '月份',
                headerAlign: 'center',
                align: 'center',
                width: 80,
                cellRender: { name: 'searchHighLight' },
              })
            }
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
              this.columns.push(colObj)
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
          this.tableData = result.data.data.page.list
        })
        .catch(this.$showError)
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
        setTimeout(() => {
          this.showSearchLoading = false
        }, 1000)
        this.filterText = val
      }
    },
    /**
     * @description: 单元格样式
     */
    cellStyle({ row, column }) {
      let obj = {}
      if (column.own.field && row[column.own.field] && noHighlightFields.indexOf(column.own.field) < 0 && row.flag === 'A') {
        obj.background = '#ff9933'
      }
      return obj
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
     * @description: 查询年改变
     */
    queryYearChange(val) {
      // console.log(val)
      this.queryYear = val
    },
    /**
     * @description: 点击年的项
     */
    queryYearOnClick(year) {
      //重新查询
      this.getPrsTypeByRmwyid(this.rmwyid, year)
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
     * @description: 工资类别改变
     */
    prtypeCodeChange(val) {
      this.prtypeCode = val
      this.prtypeCodeList.forEach((item) => {
        if (val == item.prtypeCode) {
          this.prtypeName = item.prtypeName
        }
      })
    },
    /**
     * @description: 点击工资类别
     */
    prtypeCodeOnClick(item) {
      console.log(item)
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
      this.getPersonalSalaryData()
    },
  },
}
</script>
<style lang="scss" scoped>
.toolBar {
  margin-top: 5px;
}
.toolBarBtn {
  display: flex;
  justify-content: flex-end;
}
.ant-input-group > .ant-input-affix-wrapper:not(:last-child) .ant-input {
  border-right: 0;
  outline: none;
}
.xtable {
  margin-top: 5px;
}
</style>
