<!--
 * @Author: 期末结账
 * @Date: 2020-07-10 10:34:06
 * @LastEditTime: 2020-08-27 14:39:36
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /agla-fe-8.50/vuedev/src/views/prs/periodEndClosing/periodEndClosing.vue
-->
<template>
  <div>
    <!-- 头部开始 -->
    <ufHeader :title="title">
      <template slot="btns">
        <a-button type="primary" class="mr-5" :class="getBtnPer('btn-close-account')" @click="closeAccount">结账</a-button>
        <a-button class="mr-5" :class="getBtnPer('btn-anti-settlement')" @click="antiSettlement">反结账</a-button>
        <!-- <a-button class="mr-5" :class="getBtnPer('btn-sendmsg')" @click="sendMsg">发消息</a-button> -->
      </template>
    </ufHeader>

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
    class="xtable myTable mytable-scrollbar mt-10" 
    :columns="defaultColumns" 
    :data="tableData"
    :edit-config="{ trigger: 'click', mode: 'cell', showIcon: false }" 
    :toolbar="{ id: 'periodEndClosing', resizable: { storage: true } }"> 
    </vxe-grid>
    <!-- 表格结束 -->

    <!-- <SendMsgModal v-model="showSendMsgModal" :prtypeList="prtypeList" @close="showSendMsgModalClose"></SendMsgModal> -->
  </div>
</template>
<script>
import { mapState } from 'vuex'
import { getBtnPer, getPdf, download } from '@/assets/js/util'
import { defaultColumns } from './periodEndClosing'
// import SendMsgModal from './components/SendMsgModal.vue'
export default {
  name: 'periodEndClosing',
  data() {
    return {
      title: '期末结账',
      tableH: 300,
      defaultColumns,
      // showSendMsgModal: false,
      tableData: [],
      prtypeList: [] //工资类别代码
    }
  },
  created() {
    this.tableH = this.containerH - 66
    this.getData()
  },
  computed: {
    ...mapState({
      pfData: (state) => state.pfData,
      containerH: (state) => state.containerH,
    }),
  },
  methods: {
    getBtnPer,
    getData() {
      this.$showLoading()
      this.$axios
        .post('/prs/prsclose/getPrtypes?roleId=' + this.pfData.svRoleId, {})
        .then((result) => {
          this.$hideLoading()
          result.data.data.forEach((item) => {
            if (item.closeType === '1') {
              item.closeTypeName = '结账到下一月'
            } else if (item.closeType === '2') {
              item.closeTypeName = '结账到下一批次'
            }
          })
          this.prtypeList = result.data.data.map(item => {
              return {
                  prtypeCode: item.prtypeCode,
                  prtypeName: item.prtypeName
              }
          })
          this.tableData = result.data.data
        })
        .catch(this.$showError)
    },
    /**
     * @description: 获取结账参数Promise对象
     * @param {Object} 表格某行数据集合
     * @return {Promise} 结账参数Promise对象
     */
    getCloseArgu(item) {
      return new Promise((resolve, reject) => {
        if (item.mo === 12 && item.closeType === '1') {
          const h = this.$createElement
          this.$confirm({
            title: '请注意',
            content: h('div', {}, [h('p', '当前选择的工资类别 [' + item.prtypeName + '] 已发放到 12 月份，结账后为下年 1 月份，'), h('p', '若选择[是]，会到直接结账到下年并可自动结转单位基础数据;'), h('p', '若选择[否]，不进行任何操作。')]),
            okText: '是',
            cancelText: '否',
            onOk: (c) => {
              if (item.nextYearDataNum > 0) {
                this.$confirm({
                  title: '当前选择的工资类别 [' + item.prtypeName + '] 已存在下一年度的数据,是否覆盖? ',
                  content: '',
                  okText: '确定',
                  cancelText: '取消',
                  onOk: (c) => {
                    resolve({
                      prtypeCode: item.prtypeCode,
                      closeType: item.closeType,
                      isBaseCarryNextYear: 'Y',
                      isBaseCoverNextYear: 'Y',
                      mo: item.mo,
                    })
                    c()
                  },
                  onCancel: (c) => {
                    c()
                  },
                })
              } else {
                resolve({
                  prtypeCode: item.prtypeCode,
                  closeType: item.closeType,
                  isBaseCarryNextYear: 'Y',
                  mo: item.mo,
                })
              }
              c()
            },
            onCancel: (c) => {
              c()
            },
          })
        } else {
          resolve({
            prtypeCode: item.prtypeCode,
            closeType: item.closeType,
            mo: item.mo,
          })
        }
      })
    },
    /**
     * @description: 结账
     */
    closeAccount() {
      //校验是否有勾选
      let checkedRows = this.$refs.xTable.getCheckboxRecords()
      if (checkedRows.length === 0) {
        this.$message.warning('请选择要结账的数据！')
        return
      }
      let prtypeCodes = checkedRows.map((item) => {
        return item.prtypeCode
      })
      this.$confirm({
        title: '您确定对选择的工资类别月结账吗？',
        content: '',
        okText: '确定',
        cancelText: '取消',
        onOk: () => {
          this.$showLoading()
          // 结账前检查类别信息
          this.$axios
            .post('/prs/prsclose/closeCheck?roleId=' + this.pfData.svRoleId, prtypeCodes)
            .then((result) => {
              if (result.data.flag === 'success') {
                return new Promise((resolve, reject) => {
                  let pList = []
                  checkedRows.forEach((item) => {
                    console.log(item)
                    let p = this.getCloseArgu(item)
                    pList.push(p)
                  })
                  Promise.all(pList)
                    .then((res) => {
                      resolve(res)
                    })
                    .catch(this.$showError)
                })
              } else {
                this.$hideLoading()
                throw result.data.msg
              }
            })
            .then((res) => {
              console.log(res)
              return this.$axios.post('/prs/prsclose/close?roleId=' + this.pfData.svRoleId, res)
            })
            .then((result) => {
              this.$hideLoading()
              if (result.data.flag === 'success') {
                //刷新数据
                this.getData()
                this.$message.success(result.data.msg)
              } else {
                this.$message.error(result.data.msg)
              }
              if (result.data.data) {
                this.$confirm({
                  title: '提示',
                  content: '存在下列类别结转到下一年度: ' + result.data.data + '请修改 [系统环境]-[业务日期] 到下一年度, 再进行工资编辑!',
                  okText: '确定',
                  cancelText: '取消',
                  onOk: (c) => {
                    c()
                  },
                  onCancel: (c) => {
                    c()
                  },
                })
              }
            })
            .catch(this.$showError)
        },
        onCancel: () => {},
      })
    },
    /**
     * @description: 反结账
     */
    antiSettlement() {
      //校验是否有勾选
      let checkedRows = this.$refs.xTable.getCheckboxRecords()
      if (checkedRows.length === 0) {
        this.$message.warning('请选择要反结账的数据！')
        return
      }
      let prtypeCodes = checkedRows.map((item) => {
        return item.prtypeCode
      })
      this.$confirm({
        title: '您确定对选择的工资类别反结账吗？',
        content: '',
        okText: '确定',
        cancelText: '取消',
        onOk: () => {
          this.$showLoading()
          // 结账前检查类别信息
          this.$axios
            .post('/prs/prsclose/unCloseCheck?roleId=' + this.pfData.svRoleId, prtypeCodes)
            .then((result) => {
              console.log(result)
              if (result.data.flag === 'success') {
                return this.$axios.post('/prs/prsclose/unClose?roleId=' + this.pfData.svRoleId, prtypeCodes)
              } else {
                throw result.data.msg
              }
            })
            .then(result => {
              this.$hideLoading()
              if (result.data.flag === 'success') {
                //刷新数据
                this.getData()
                this.$message.success(result.data.msg)
              } else {
                throw result.data.msg
              }
            })
            .catch(this.$showError)
        },
        onCancel: () => {},
      })
    },
    /**
     * @description: 发送消息
     */
    // sendMsg() {
    //   this.showSendMsgModal = true
    // },
    /**
     * @description: 关闭弹窗
     */
    // showSendMsgModalClose() {
    //   this.showSendMsgModal = false
    // },
  },
}
</script>
<style>
.myTable .vxe-cell{
  padding: 0 !important;
}
.myTable .vxe-table .vxe-cell--checkbox{
  margin-left: .7em;
}
</style>
<style lang="scss" scoped></style>
