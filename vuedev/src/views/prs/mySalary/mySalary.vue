<!--
 * @Author: sunch
 * @Date: 2020-04-14 11:00:39
 * @LastEditTime: 2020-09-25 10:51:56
 * @LastEditors: Please set LastEditors
 * @Description: 个人工资查询
 * @FilePath: /ufgov-vue/src/views/prs/mySalary/mySalary.vue
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
            <a-col :span="6">
              <span>年份：</span>
              <a-select v-if="queryYear" :defaultValue="queryYear" style="width: 156px" :value="queryYear" @change="queryYearChange">
                <a-select-option v-for="item in queryYearList" :key="item" :value="item" @click="queryYearOnClick(item)">{{ item }}</a-select-option>
              </a-select>
            </a-col>
            <a-col :span="6" class="flex-start">
              <span>月份区间：</span>
              <a-select v-if="monthEnd" :defaultValue="monthStart" style="width: 80px" @change="startMonthOnChange">
                <a-select-option :value="item.value" v-for="item in allMonth" :key="item.value">{{ item.label }}</a-select-option>
              </a-select>
              <span style="margin-left:10px">-</span>
              <a-select v-if="monthEnd" :defaultValue="monthEnd" style="width: 80px;margin-left:10px" @change="endMonthOnChange">
                <a-select-option :value="item.value" v-for="item in allMonth" :key="item.value">{{ item.label }}</a-select-option>
              </a-select>
            </a-col>
            <a-col :span="6" class="flex-end">
              <span>工资类别：</span>
              <a-select v-if="prtypeCode" :defaultValue="prtypeCode" style="width: 156px" :value="prtypeCode" @change="prtypeCodeChange">
                <a-select-option v-for="item in prtypeCodeList" :key="item.prtypeCode" :value="item.prtypeCode" @click="prtypeCodeOnClick(item)">{{ item.prtypeName }}</a-select-option>
              </a-select>
            </a-col>
            <a-col :span="6">
              <span>统计方式：</span>
              <a-select v-if="totalType" :defaultValue="totalType" style="width: 156px" :value="totalType" @change="totalTypeChange">
                <a-select-option v-for="item in totalTypeList" :key="item.value" :value="item.value">{{ item.name }}</a-select-option>
              </a-select>
            </a-col>
          </a-row>
        </a-col>
        <a-col :span="2" class="txt-r">
          <a-button :class="getBtnPer('btn-query')" type="primary" @click="getPersonalSalaryData(prtypeCode)">查询</a-button>
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
        <!-- <a-tooltip placement="bottom">
                    <template slot="title">
                    <span>框架内铺满显示</span>
                    </template>
                    <a-button class="mr-5" @click="zoomTable"><a-icon type="fullscreen" /></a-button>
                </a-tooltip> -->
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
      :toolbar="{ id: 'mySalaryTable', resizable: { storage: true } }"
    >
    </vxe-grid>
    <!-- 表格结束 -->

    <div class="payRemark">发放说明：{{ this.payRemark }}</div>
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
  { label: '12月', value: '12' },
]
const bankAccOtherColumn = {
  field: 'bankAccOther',
  title: '其他银行账号',
  headerAlign: 'center',
  align: 'center',
  width: 180,
  cellRender: { name: 'searchHighLight' },
}

export default {
  name: 'mySalary',
  data() {
    return {
      title: '个人工资查询', //页面标题
      showSearchLoading: false,
      columns: [],
      filterText: '', //全表搜索框输入的内容{String}
      tableData: [],
      rmwyid: '',
      queryYearList: [],
      queryYear: '',
      prtypeCodeList: [],
      prtypeCode: '',
      prtypeName: '',
      allMonth,
      monthStart: '1',
      monthEnd: '',
      agencyCode: '',
      payRemark: '',
      totalType: '1',
      totalTypeList: [
        { name: '合计', value: '1' },
        { name: '明细', value: '0' },
      ],
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
  },
  created() {
    this.tableH = this.containerH - 230
  },
  mounted() {
    console.log(this.pfData)
    this.monthEnd = String(new Date().getMonth() + 1)
    this.getRmwyid(this.getPersonalSalaryData)
  },
  methods: {
    moment,
    getBtnPer,
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
      // this.$refs.xTable.openExport()
      if (!this.rmwyid) {
        this.$message.error('rmwyid不存在')
        return
      }
      if (!this.queryYear) {
        this.$message.error('查询年份为空')
        return
      }
      if (!this.prtypeCode) {
        this.$message.error('工资类别为空')
        return
      }
      let that = this
      this.$showLoading()
      this.$axios
        .post('/prs/rpt/PrsRptData/printPersonSalaryData', {
          agencyCode: this.agencyCode,
          rmwyid: this.rmwyid, //（人员主键）
          setYear: this.queryYear, //（查询年度）
          prtypeCode: this.prtypeCode, //（工资类别）
          monthStart: this.monthStart, //（查询开始月份）
          monthEnd: this.monthEnd, //（查询结束月份）
          totalType: this.totalType
        })
        .then((result) => {
          if (result.data.flag != 'success') {
            throw result.data.msg
          } else {
            console.log(result.data)
            let data = JSON.stringify(result.data.data)
            getPdf(
              'personSalaryInfo',
              '*',
              data,
              () => {
                that.$hideLoading()
              },
              (error) => {
                that.$message.error(error)
                that.$hideLoading()
              }
            )
          }
        })
        .catch(this.$showError)
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
        filename: this.pfData.svAgencyName + this.pfData.svUserCode + this.pfData.svUserName + this.prtypeName + this.pfData.svSetYear + '年' + mo + '月个人工资导出',
        sheetName: '个人工资',
        type: 'xlsx',
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
            this.getSetYearByEmpUid(this.rmwyid, callback)
          }
        })
        .catch(this.$showError)
    },
    /**
     * @description: 2.获取当前登录人所有工资年份（GET）
     */
    getSetYearByEmpUid(id, callback) {
      this.$axios
        .get('/prs/rpt/PrsRptData/getSetYearByEmpUid?rmwyid=' + id + '&agencyCode=' + this.agencyCode)
        .then((result) => {
          if (result.data.flag != 'success') {
            throw result.data.msg
          } else {
            console.log(result.data)
            if (result.data.data && result.data.data.length > 0) {
              this.queryYearList = result.data.data
              this.queryYear = result.data.data[0]
              this.getPrsTypeByRmwyid(id, this.queryYear, callback)
            } else {
              // 没有工资数据不提示
              // throw '获取工资年份失败'
            }
          }
        })
        .catch(this.$showError)
    },
    /**
     * @description: 3.获取当前登录人分配的工资类别（GET）
     */
    getPrsTypeByRmwyid(id, queryYear, callback) {
      this.$axios
        .get('/prs/rpt/PrsRptData/getPrsTypeByRmwyid?rmwyid=' + id + '&queryYear=' + queryYear + '&agencyCode=' + this.agencyCode)
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
            result.data.data[0].payRemark ? (this.payRemark = result.data.data[0].payRemark) : (this.payRemark = '')
            if (typeof callback === 'function') {
              callback()
            }
          }
        })
        .catch(this.$showError)
    },
    /**
     * @description: 个人工资查询数据 post
     */
    getPersonalSalaryData(prtypeCode) {
      console.log(prtypeCode)
      if (!this.rmwyid) {
        this.$message.error('无工资数据')
        return
      }
      if (!this.queryYear) {
        this.$message.error('查询年份为空')
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
        .post('/prs/rpt/PrsRptData/getPersonalSalaryData', {
          agencyCode: this.agencyCode,
          rmwyid: this.rmwyid, //（人员主键）
          setYear: this.queryYear, //（查询年度）
          prtypeCode: this.prtypeCode, //（工资类别）
          monthStart: this.monthStart, //（查询开始月份）
          monthEnd: this.monthEnd, //（查询结束月份）
          totalType: this.totalType
        })
        .then((result) => {
          if (result.data.flag != 'success') {
            throw result.data.msg
          } else {
            console.log(result.data)
            if (!result.data.data.moveItem || result.data.data.moveItem.length === 0) {
              this.$message.error('无工资数据')
              return
            }
            searchProps = [].concat(baseSearchProps)
            this.columns = [
              {
                field: 'smo',
                title: '月份',
                headerAlign: 'center',
                align: 'center',
                width: 50,
                cellRender: { name: 'searchHighLight' },
              },
              {
                field: 'orgCodeName',
                title: '部门',
                headerAlign: 'center',
                align: 'center',
                width: 100,
                cellRender: { name: 'searchHighLight' },
              },
              {
                field: 'bankAcc',
                title: '默认银行账号',
                headerAlign: 'center',
                align: 'center',
                width: 180,
                cellRender: { name: 'searchHighLight' },
              },
            ]
            // CWYXM-20007 begin【应急部】-【个人工资查询】“其他银行账号”列，做成有数据就显示，没有数据不显示。

            // CWYXM-20007 测试用例 begin
            // result.data.data.prsCalcDatas.forEach(item => {
            //   item.bankAccOther = '2333'
            // })
            // CWYXM-20007 测试用例 end

            let flag = result.data.data.prsCalcDatas.some((item) => {
              return !!item.bankAccOther
            })
            if (flag) {
              this.columns.push(bankAccOtherColumn)
            }
            // CWYXM-20007 end
            result.data.data.moveItem.forEach((item) => {
              let key = this._.keys(item)[0]
              let field = 'prPaylistN' + key.slice(12)
              if (key.indexOf('PR_PAYLIST_N') > -1) {
                let colObj = {
                  field: field,
                  title: item[key],
                  headerAlign: 'center',
                  align: 'right',
                  minWidth: 60 + (item[key].length < 8 ? item[key].length * 12 : item[key].length * 14),
                  filters: [{ data: '' }],
                  filterRender: { name: 'filterMoneyInput' },
                  cellRender: { name: 'moneyHighLight' },
                }
                this.columns.push(colObj)
                searchProps.push(field)
              }
            })
            // console.log(this.columns)
            let len = result.data.data.prsCalcDatas.length
            if (len > 0) {
              result.data.data.prsCalcDatas[len - 1].smo = result.data.data.prsCalcDatas[len - 1].empName
            }
            // console.log(result.data.data.prsCalcDatas)
            this.tableData = result.data.data.prsCalcDatas
          }
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
     * @description: 行样式
     */
    rowStyle({ row }) {
      // console.log(row)
      if (row.isEdit === 'dept') {
        return {
          color: '#333',
          fontWeight: 'bold',
          backgroundColor: '#EEEEEE',
        }
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
          this.payRemark = item.payRemark
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
     * @description: 选择统计方式
     */
    totalTypeChange(val){
      console.log(val)
      this.totalType = val
    }
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
.payRemark {
  height: 50px;
  box-sizing: border-box;
  padding: 10px;
  color: #333;
  font-size: 14px;
  border-radius: 4px;
  border: 1px solid #ccc;
  margin-top: 10px;
  line-height: 15px;
  overflow-y: auto;
  overflow-x: hidden;
}
</style>
