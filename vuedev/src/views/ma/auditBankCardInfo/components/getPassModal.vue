<!--
 * @Author: sunch
 * @Date: 2020-08-04 18:51:24
 * @LastEditTime: 2020-08-12 14:28:22
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /agla-fe-8.50/vuedev/src/views/ma/auditBankCardInfo/components/getPassModal.vue
-->
<template>
  <uf-modal v-model="visible" @cancel="cancel" :width="900" :title="title">
    <div class="topInfo">
      <div class="box">
        <div class="label">单据编号：</div>
        <div class="boxValue">{{ data.billNo }}</div>
      </div>
      <div class="box">
        <div class="label">修改人：</div>
        <div class="boxValue">{{ data.createUser }}</div>
      </div>
      <div class="box">
        <div class="label">修改日期：</div>
        <div class="boxValue">{{ doDate(data.createDate) }}</div>
      </div>
      <div class="box">
        <div class="label">修改类型：</div>
        <div class="boxValue">{{ data.modifyStatusName }}</div>
      </div>
    </div>

    <!-- 表格 开始 -->
    <vxe-table
      border
      resizable
      :data="tableData"
      head-align="center"
      show-header-overflow
      show-overflow
      size="mini"
      ref="xTable"
      :auto-resize="true"
      :cell-style="cellStyle"
      class="xtable myTable mytable-scrollbar mt-10"
      :toolbar="{ id: 'getPassModal', resizable: { storage: true } }"
    >
      <vxe-table-column field="propName" width="150" title="字段" header-align="center" align="center"></vxe-table-column>
      <vxe-table-column field="beforeValue" title="修改前" header-align="center" align="left"></vxe-table-column>
      <vxe-table-column field="afterValue" title="修改后" header-align="center" align="left"></vxe-table-column>
    </vxe-table>
    <!-- 表格 结束-->

    <template v-slot:footer>
      <a-button type="primary" class="mr-10" v-show="showBtns" @click="getPass">通过</a-button>
      <a-button v-show="showBtns" class="mr-10" @click="giveBack">退回</a-button>
      <a-button @click="cancel">关闭</a-button>
    </template>
  </uf-modal>
</template>
<script>
import { mapState } from 'vuex'
function doDate(date) {
  if (date) {
    return date.substring(0, 10)
  } else {
    return ''
  }
}
export default {
  name: 'getPassModal',
  props: ['value', 'data'],
  data() {
    return {
      title: '审核银行卡信息',
      visible: false,
      auditType: '2',
      tableData: [
        { prop: 'accountAttrName', propName: '账户类别', beforeValue: '', afterValue: '' },
        { prop: 'accountNo', propName: '账号', beforeValue: '', afterValue: '' },
        { prop: 'accountName', propName: '户名', beforeValue: '', afterValue: '' },
        { prop: 'bankCategoryName', propName: '银行类别', beforeValue: '', afterValue: '' },
        { prop: 'bankName', propName: '开户银行', beforeValue: '', afterValue: '' },
        { prop: 'accountStatusName', propName: '账户状态', beforeValue: '', afterValue: '' },
        { prop: 'isReimburseCardName', propName: '默认为报销卡', beforeValue: '', afterValue: '' },
        { prop: 'isPrsCardName', propName: '默认为工资卡', beforeValue: '', afterValue: '' },
      ],
      showBtns: true
    }
  },
  watch: {
    value(val) {
      if (val) {
        this.visible = val
        this.getData()
      }
    },
    data(data){
      if(data.auditStatus === '0'){
        this.showBtns = false
      }else{
        this.showBtns = true
      }
    }
  },
  methods: {
    doDate,
    getData() {
      this.$axios
        .post('/ma/emp/account/approval/selectSingleAccountApprovalInfo', {
          billNo: this.data.billNo,
          chrId: this.data.chrId,
        })
        .then((result) => {
          if (result.data.flag === 'success') {
            let beforeData = result.data.data.before,
              afterData = result.data.data.after
            if (!!beforeData) {
              for (let prop in beforeData) {
                this.tableData.forEach((item) => {
                  if (item.prop === prop) {
                    item.beforeValue = beforeData[prop]
                    item.afterValue = afterData[prop]
                  }
                })
              }
            } else {
              for (let prop in afterData) {
                this.tableData.forEach((item) => {
                  if (item.prop === prop) {
                    item.afterValue = afterData[prop]
                  }
                })
              }
            }
          } else {
          }
        })
        .catch(this.$showError)
    },
    cancel() {
      this.tableData = [
        { prop: 'accountAttrName', propName: '账户类别', beforeValue: '', afterValue: '' },
        { prop: 'accountNo', propName: '账号', beforeValue: '', afterValue: '' },
        { prop: 'accountName', propName: '户名', beforeValue: '', afterValue: '' },
        { prop: 'bankCategoryName', propName: '银行类别', beforeValue: '', afterValue: '' },
        { prop: 'bankName', propName: '开户银行', beforeValue: '', afterValue: '' },
        { prop: 'accountStatusName', propName: '账户状态', beforeValue: '', afterValue: '' },
        { prop: 'isReimburseCardName', propName: '默认为报销卡', beforeValue: '', afterValue: '' },
        { prop: 'isPrsCardName', propName: '默认为工资卡', beforeValue: '', afterValue: '' },
      ]
      this.visible = false
      this.$emit('close')
    },
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
      this.$axios
        .post('/ma/emp/account/approval/auditMaEmpAccountApprovals', {
          auditStatus: this.auditType, //0通过，2退回
          auditAccountList: [{ modifyStatus: this.data.modifyStatus, billNo: this.data.billNo }],
        })
        .then((result) => {
          if (result.data.flag === 'success') {
            this.$message.success(tip + '成功！')
            this.cancel()
          } else {
            throw result.data.msg
          }
        })
        .catch(this.$showError)
    },
    cellStyle({ row, column }) {
      let obj = {}
      if (column.own.field === 'afterValue' && !!row.afterValue) {
        obj.color = 'red'
      }
      return obj
    },
  },
}
</script>
<style>
.topInfo {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.box {
  display: flex;
}
</style>
