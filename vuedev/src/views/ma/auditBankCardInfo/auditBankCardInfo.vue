<!--
 * @Author: your name
 * @Date: 2020-08-03 15:14:36
 * @LastEditTime: 2020-08-21 12:40:03
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /agla-fe-8.50/vuedev/src/views/ma/auditBankCardInfo/auditBankCardInfo.vue
-->
<template>
  <div>
    <!-- 头部开始 -->
    <ufHeader :title="title">
      <template slot="btns">
        <a-button class="mr-5" type="primary" :class="getBtnPer('btn-getpass')" @click="getPass">通过</a-button>
        <a-button class="mr-5" :class="getBtnPer('btn-giveBack')" @click="giveBack">退回</a-button>
      </template>
    </ufHeader>

    <!-- 查询条件开始 -->
    <ufQueryArea class="mt-10">
      <div class="flex-between">
        <div class="flex-start">
          <div class="label">修改人：</div>
          <a-input class="form-ele" v-model="createUser"></a-input>
        </div>
        <div class="flex-start">
          <div class="label">修改日期：</div>
          <a-range-picker class="form-ele" allowClear :locale="zh_CN" :value="dateRange" @change="onDateChange">
            <!-- 头部插槽部分 是由页脚插槽改变样式而来 -->
            <template v-slot:renderExtraFooter>
              <div style="width: 100%;">
                <!-- 放预设范围按钮 -->
                <div class="datePickerBtns">
                  <button class="dateBtn" :class="period === 'dateBn' ? 'active' : ''" @click="period = 'dateBn'">本年</button>
                  <button class="dateBtn" :class="period === 'dateBq' ? 'active' : ''" @click="period = 'dateBq'">本期</button>
                  <button class="dateBtn" :class="period === 'dateBr' ? 'active' : ''" @click="period = 'dateBr'">本日</button>
                </div>
                <!-- 显示选择的时间范围 -->
                <div class="showDateTime">
                  <div>开始时间：{{ dateBegin }}</div>
                  <div class="ml-40">结束时间：{{ dateEnd }}</div>
                </div>
              </div>
            </template>
          </a-range-picker>
        </div>

        <a-button :class="getBtnPer('btn-query')" type="primary" @click="getData">查询</a-button>
      </div>
    </ufQueryArea>
    <!-- 查询条件结束 -->

    <div class="toolBar">
      <ufTab :tabList="tabList" :tabIndex="tabIndex" :maxShowTabNum="6" @clickTabItem="onClickTabItem"></ufTab>
      <div class="toolBarBtn"></div>
    </div>

    <!-- 表格 开始 -->
    <vxe-table
      border
      resizable
      :data="tableData"
      head-align="center"
      :height="tableH"
      show-header-overflow
      show-overflow
      size="mini"
      ref="xTable"
      :auto-resize="true"
      class="xtable myTable mytable-scrollbar mt-10"
      :toolbar="{ id: 'auditBankCardInfo', resizable: { storage: true } }"
    >
      <vxe-table-column type="checkbox" width="36" align="center"></vxe-table-column>
      <vxe-table-column field="billNo" width="150" title="单据编号" header-align="center" align="left">
        <template v-slot="record">
          <a href="javascript:;" class="jump-link" @click="onClickBillNo(record.row)">
            {{ record.row.billNo }}
          </a>
        </template>
      </vxe-table-column>
      <vxe-table-column field="createUser" title="修改人" header-align="center" align="left"></vxe-table-column>
      <vxe-table-column field="orgName" title="部门" header-align="center" align="left"></vxe-table-column>
      <vxe-table-column field="createDate" title="修改日期" header-align="center" align="left"></vxe-table-column>
      <vxe-table-column field="modifyStatusName" title="修改类型" header-align="center" align="center"></vxe-table-column>
      <vxe-table-column field="accountAttr" title="账户类别" header-align="center" align="center"></vxe-table-column>
      <vxe-table-column field="accountNo" width="150" title="账号" header-align="center" align="left"></vxe-table-column>
      <vxe-table-column field="isReimburseCard" title="默认为报销卡" header-align="center" align="center"></vxe-table-column>
      <vxe-table-column field="isPrsCard" title="默认为工资卡" header-align="center" align="center"></vxe-table-column>
    </vxe-table>
    <!-- 表格 结束-->

    <!-- 自定义分页器开始 -->
    <ufPager :pager-config="page" @page-change="handlePageChange"></ufPager>
    <!-- 自定义分页器结束 -->

    <getPassModal v-model="showModal" @close="modalClose" :data="modalData"></getPassModal>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import { getBtnPer, getPdf } from '@/assets/js/util'
import getPassModal from './components/getPassModal'
import moment from 'moment'
import zh_CN from 'ant-design-vue/es/date-picker/locale/zh_CN'

export default {
  name: 'auditBankCardInfo',
  data() {
    return {
      zh_CN,
      moment,
      title: '审核银行卡信息', //页面标题
      tableH: 300,
      createUser: '', //修改人
      tabList: [
        { text: '待审核', current: 0, status: '1' },
        { text: '已审核', current: 1, status: '0' },
      ],
      tabIndex: 0,
      tableData: [],
      page: {
        tableName: 'auditBankCardInfo',
        currentPage: 1,
        pageSize: 50,
        pageSizes: [10, 20, 30, 50, 100, '全部'],
        total: 0,
      },
      currentPage: 1,
      pageSize: 50,
      auditStatus: '1',
      period: 'dateBn', //期间按钮标记
      setYear: '', //系统年度
      dateObj: null, //当前时间对象
      dateRange: ['', ''],
      dateBegin: '',
      dateEnd: '',
      createDateStart: '', //修改日期开始
      createDateEnd: '', //修改日期结束
      auditType: '2',
      showModal: false,
      modalData: {},
    }
  },
  components: {
    getPassModal,
  },
  created() {
    this.tableH = this.containerH - 210
    this.dateObj = new Date()
    let m = this.dateObj.getMonth() + 1
    if (m < 10) {
      m = '0' + m
    }
    this.MM = m
    this.setYear = this.pfData.svSetYear
    this.dateRange = [moment(this.setYear + '-01-01', 'YYYY-MM-DD'), moment(this.setYear + '-12-31', 'YYYY-MM-DD')]
    this.dateBegin = this.setYear + '/01/01'
    this.dateEnd = this.setYear + '/12/31'
    this.createDateStart = this.setYear + '-01-01'
    this.createDateEnd = this.setYear + '-12-31'
    this.getData()
  },
  computed: {
    ...mapState({
      pfData: (state) => state.pfData,
      containerH: (state) => state.containerH,
    }),
  },
  watch: {
    period(val) {
      if (this.setYear && this.dateObj) {
        switch (val) {
          case 'dateBn':
            this.dateRange = [moment(this.setYear + '-01-01', 'YYYY-MM-DD'), moment(this.setYear + '-12-31', 'YYYY-MM-DD')]
            this.dateBegin = this.setYear + '/01/01'
            this.dateEnd = this.setYear + '/12/31'
            this.createDateStart = this.setYear + '-01-01'
            this.createDateEnd = this.setYear + '-12-31'
            break
          case 'dateBq':
            let new_date = new Date(this.setYear, this.MM, 1),
              endDay = new Date(new_date.getTime() - 1000 * 60 * 60 * 24).getDate()
            this.dateRange = [moment(`${this.setYear}-${this.MM}-01`, 'YYYY-MM-DD'), moment(`${this.setYear}-${this.MM}-${endDay}`, 'YYYY-MM-DD')]
            this.dateBegin = `${this.setYear}/${this.MM}/01`
            this.dateEnd = `${this.setYear}/${this.MM}/${endDay}`
            this.createDateStart = `${this.setYear}-${this.MM}-01`
            this.createDateEnd = `${this.setYear}-${this.MM}-${endDay}`
            break
          case 'dateBr':
            let DD = this.dateObj.getDate()
            this.dateRange = [moment(`${this.setYear}-${this.MM}-${DD}`, 'YYYY-MM-DD'), moment(`${this.setYear}-${this.MM}-${DD}`, 'YYYY-MM-DD')]
            this.dateBegin = `${this.setYear}/${this.MM}/${DD}`
            this.dateEnd = this.dateBegin
            this.createDateStart = `${this.setYear}-${this.MM}-${DD}`
            this.createDateEnd = this.createDateStart
            break
        }
      } else {
        this.$message.error('未查询到财务系统年份：setYear')
      }
    },
  },
  methods: {
    getBtnPer,
    getPass() {
      this.auditType = '0'
      this.handle()
    },
    giveBack() {
      this.auditType = '2'
      this.handle()
    },
    handle() {
      let tip = ''
      this.auditType === '0' ? (tip = '审核') : (tip = '退回')
      if (this.auditStatus === '0') {
        if (this.auditType === '0') {
          this.$message.warning('已审核的单据，不可再' + tip)
          return
        } else {
          this.$message.warning('已审核的单据，不可' + tip)
          return
        }
      }
      let checkedRows = this.$refs.xTable.getCheckboxRecords()
      if (checkedRows.length === 0) {
        this.$message.warning('请选择要' + tip + '的数据！')
        return
      }
      let auditAccountList = checkedRows.map((item) => {
        return { modifyStatus: item.modifyStatus, billNo: item.billNo }
      })
      this.$axios
        .post('/ma/emp/account/approval/auditMaEmpAccountApprovals', {
          auditStatus: this.auditType, //0通过，2退回
          auditAccountList: auditAccountList,
        })
        .then((result) => {
          if (result.data.flag === 'success') {
            this.$message.success(tip + '成功！')
            this.getData()
          } else {
            throw result.data.msg
          }
        })
        .catch(this.$showError)
    },
    /**
     * @description: 查询表格数据
     */
    getData() {
      this.$showLoading()
      this.$axios
        .post('/ma/emp/account/approval/selectMaEmpAccountApprovalInfo', {
          auditStatus: this.auditStatus, //1待审核，0已审核
          createUser: this.createUser, //修改人
          createDateStart: this.createDateStart, //修改日期开始
          createDateEnd: this.createDateEnd, //修改日期结束
          pageSize: this.pageSize,
          pageNum: this.currentPage,
        })
        .then((result) => {
          this.$hideLoading()
          if (result.data.flag === 'success') {
            result.data.data.list.forEach((item) => {
              if (item.createDate) item.createDate = item.createDate.substring(0, 10)
            })
            this.tableData = result.data.data.list
            this.page.total = result.data.data.total
          } else {
            throw result.data.msg
          }
        })
        .catch(this.$showError)
    },
    /**
     * @description: 页数改变
     */
    handlePageChange({ currentPage, pageSize }) {
      if (pageSize === '全部') {
        // this.currentPage = 1
        // this.pageSize = 999999999
        this.currentPage = ''
        this.pageSize = ''
      } else {
        this.currentPage = currentPage
        this.pageSize = pageSize
      }
      this.getData()
    },
    onClickTabItem(item) {
      this.auditStatus = item.status
      this.tabIndex = item.current
      console.log(this.auditStatus)
      this.getData()
    },
    onDateChange(date, dateString) {
      this.dateRange = date
      console.log(date)
      console.log(dateString)
      this.createDateStart = dateString[0]
      this.createDateEnd = dateString[1]
      this.dateBegin = dateString[0].split('-').join('/')
      this.dateEnd = dateString[1].split('-').join('/')
    },
    onClickBillNo(row) {
      console.log(row)
      this.showModal = true
      this.modalData = row
    },
    modalClose() {
      this.showModal = false
      this.getData()
    },
  },
}
</script>
<style>
.ant-calendar-panel {
  padding-top: 80px;
}
.ant-calendar-footer {
  padding: 0;
  line-height: 79px;
  border-top: 0;
  border-bottom: 1px solid #e8e8e8;
  position: absolute;
  height: auto;
  top: 0;
  left: 0;
  right: 0;
}
.ant-calendar-range .ant-calendar-input-wrap {
  display: none;
}
/*sunch 2020-06-28 修改range-picker头部样式*/
.ant-calendar-footer-extra {
  width: 100%;
}
.ant-calendar-picker-input {
  padding: 4px;
}
.ant-calendar-picker-icon {
  right: 6px;
}
</style>
<style scoped>
.label {
  width: 120px;
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
.datePickerBtns {
  display: flex;
  padding: 8px 20px 6px 20px;
  border-bottom: 1px solid #e8e8e8;
}
.dateBtn {
  width: 44px;
  height: 26px;
  background: #ecf6fd;
  border-radius: 4px;
  font-size: 12px;
  color: #108ee9;
  line-height: 26px;
  border: 0;
  margin-right: 8px;
  outline: none;
  cursor: pointer;
}
.active {
  background: #108ee9;
  color: #fff;
}
.showDateTime {
  display: flex;
  justify-content: space-between;
  padding: 8px 20px;
}
.showDateTime div {
  width: 50%;
  display: inline-block;
  line-height: 22px;
  color: #666;
  text-align: left;
}
.ml-40 {
  margin-left: 40px;
}
</style>
