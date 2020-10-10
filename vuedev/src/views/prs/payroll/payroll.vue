<!-- 工资发放 -->
<template>
  <div>
    <ufHeader :title="title"> </ufHeader>

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
      :toolbar="{ id: 'payroll', resizable: { storage: true } }"
    >
      <vxe-table-column field="prtypeName" min-width="150" title="工资类别" header-align="center" align="left"></vxe-table-column>
      <vxe-table-column field="prtypeCode" min-width="100" title="工资类别代码" header-align="center" align="left"></vxe-table-column>
      <vxe-table-column field="setYear" width="100" title="年度" header-align="center" align="center"></vxe-table-column>
      <vxe-table-column field="mo" width="100" title="月份" header-align="center" align="center"></vxe-table-column>
      <vxe-table-column field="payNoMo" width="100" title="月批次" header-align="center" align="center"></vxe-table-column>
      <vxe-table-column field="payStatus" width="100" title="发放状态" header-align="center" align="center" :formatter="payStatusFilter"></vxe-table-column>
      <vxe-table-column width="200" title="操作" header-align="center" align="center">
        <template v-slot="record">
          <div>
            <div class="label" style="width: 50%;">
              <a v-if="record.row.payStatus === 'N'" class="jump-link" :class="getBtnPer('btn-pay')" href="javascript:;" @click="paySalary(record.row)">发放</a>
            </div>
            <div class="label" style="width: 50%;">
              <a class="jump-link" href="javascript:;" :class="getBtnPer('btn-sendmsg')" @click="sendMsg(record.row)">发消息</a>
            </div>
          </div>
        </template>
      </vxe-table-column>
    </vxe-table>
    <!-- 表格 结束-->

    <!-- 自定义分页器开始 -->
    <ufPager :pager-config="page" @page-change="handlePageChange"></ufPager>
    <!-- 自定义分页器结束 -->

    <sendMsgModal v-model="showSendMsgModal" :prtypeCode="prtypeCode" :mo="mo" :payNoMo="payNoMo" @close="showSendMsgModalClose"></sendMsgModal>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import { getBtnPer } from '@/assets/js/util'
import sendMsgModal from './components/sendMsgModal'

export default {
  name: 'payroll',
  data() {
    return {
      title: '工资发放',
      tableH: 300,
      proData: [],
      tableData: [],
      prtypeCode: '',
      showSendMsgModal: false,
      page: {
        tableName: 'payroll',
        currentPage: 1,
        pageSize: 50,
        pageSizes: [10, 20, 30, 50, 100, '全部'],
        total: 0,
      },
      currentPage: 1,
      pageSize: 50,
      mo: '1',
      payNoMo: '1'
    }
  },
  components: {
    sendMsgModal,
  },
  computed: {
    ...mapState({
      pfData: (state) => state.pfData,
      containerH: (state) => state.containerH,
    }),
  },
  created() {
    this.tableH = this.containerH - 110
    this.getData()
  },
  methods: {
    getBtnPer,
    paySalary(row){
      const that = this
      //弹出提示 是否确认发放
      this.$confirm({
        title: '确定要发放此批次工资吗？',
        content: "",
        okText: "确定",
        cancelText: "取消",
        onOk() {
          that.$showLoading()
          that.$axios.post('/prs/payOff/paySalaryData', {
            agencyCode: row.agencyCode,
            mo: row.mo,
            payNoMo: row.payNoMo,
            prtypeCode: row.prtypeCode,
            rgCode: row.rgCode,
            setYear: row.setYear
          }).then(result => {
            if(result.data.flag === 'success'){
              that.$message.success(result.data.msg)
              that.getData()
            }else{
              throw result.data.msg
            }
          }).catch(that.$showError)
        },
        onCancel() {},
      })
    },
    getData() {
      this.$showLoading()
      this.$axios.get('/prs/payOff/getSummaryList').then(result => {
        this.$hideLoading()
        if(result.data.flag === 'success'){
          this.proData = result.data.data
          this.page.total = this.proData.length
          this.tableData = this.proData.slice(this.pageSize*(this.currentPage-1), this.pageSize*this.currentPage)
        }else{
          throw result.data.msg
        }
      }).catch(this.$showError)
    },
    payStatusFilter({ cellValue }){
      if(cellValue === 'Y'){
        return '已发放'
      }else{
        return '未发放'
      }
    },
    sendMsg(row) {
      this.mo = row.mo
      this.payNoMo = row.payNoMo
      this.prtypeCode = row.prtypeCode
      this.showSendMsgModal = true
    },
    /**
     * @description: 关闭弹窗
     */
    showSendMsgModalClose() {
      this.showSendMsgModal = false
    },
    /**
     * @description: 页数改变
     */
    handlePageChange({ currentPage, pageSize }) {
      if (pageSize === '全部') {
        this.currentPage = 1
        this.pageSize = 999999999
      } else {
        this.currentPage = currentPage
        this.pageSize = pageSize
      }
      this.tableData = this.proData.slice(this.pageSize * (this.currentPage - 1), this.pageSize * this.currentPage)
    },
  },
}
</script>
