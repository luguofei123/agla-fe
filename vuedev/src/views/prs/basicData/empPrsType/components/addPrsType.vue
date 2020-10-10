<!--
 * @Author: sunch
 * @Date: 2020-07-18 16:30:19
 * @LastEditTime: 2020-08-19 17:48:36
 * @LastEditors: Please set LastEditors
 * @Description: 添加工资类别
 * @FilePath: /agla-fe-8.50/vuedev/src/views/prs/empPrsType/components/addPrsType.vue
-->
<template>
  <uf-modal v-model="visible" @cancel="cancel" :width="1100" :title="title">
    <div style="min-height: 300px;">
      <div class="flex-start">
        <a-button class="" @click="insertEvent(-1)">增加</a-button>
        <a-button class="ml-10" @click="delRow">删除</a-button>
        <a-button class="ml-10" @click="showAddAccount = true">增加个人银行账户</a-button>
      </div>

      <vxe-grid
        border
        stripe
        resizable
        head-align="center"
        show-header-overflow
        show-overflow
        size="mini"
        ref="xTable"
        :auto-resize="true"
        class="xtable mytable-scrollbar addPrsType mt-10"
        :columns="defaultColumns"
        :data="tableData"
        :edit-config="{ trigger: 'click', mode: 'cell', showIcon: false }"
        :toolbar="{ id: 'addPrsType', resizable: { storage: true } }"
      >
      </vxe-grid>
    </div>

    <AddAccount v-model="showAddAccount" @close="addAccountModalClose" :title="'增加个人银行账户'" :empReadonly="true" :selectEmpCode="empCode" :editInfo="{ chrId: '', editEmpCode: '' }"></AddAccount>

    <template v-slot:footer>
      <div class="flex-end">
        <a-button type="primary" class="mr-10" @click="saveClose">保存</a-button>
        <a-button @click="cancel">关闭</a-button>
      </div>
    </template>
  </uf-modal>
</template>
<script>
import { mapState } from 'vuex'
import AddAccount from '@/views/ma/personalAccountManage/components/AddAccount'
import { defaultColumns } from './addPrsTypeColumns'

export default {
  name: 'addPrsType',
  props: ['value', 'empCode', 'rmwyid'],
  data() {
    return {
      visible: false,
      title: '添加工资类别',
      defaultColumns,
      tableData: [],
      prsTypeCo: [],
      bankfileStyle: [],
      showAddAccount: false, //显示增加个人银行账户
      isPrsCardData: {
        prtypeCode: '',
        bankAcc: '',
        bankAccName: '',
        bankAccOther: '',
        bankAccOtherName: '',
        isStop: '',
        bankfileStyle: '',
        bankfileStyleOther: '',
      }, //默认为工资卡的表格行数据
    }
  },
  components: {
    AddAccount,
  },
  computed: {
    ...mapState({
      pfData: (state) => state.pfData,
    }),
  },
  watch: {
    value(val) {
      if (val) {
        this.visible = val
        this.getData()
      }
    },
  },
  methods: {
    clear() {
      this.isPrsCardData = {
        prtypeCode: '',
        bankAcc: '',
        bankAccName: '',
        bankAccOther: '',
        bankAccOtherName: '',
        isStop: '',
        bankfileStyle: '',
        bankfileStyleOther: '',
      }
    },
    cancel() {
      this.clear()
      this.visible = false
      this.$emit('close')
    },
    saveClose() {
      this.save()
    },
    save() {
      let addTypeCodeList = this.$refs.xTable.getInsertRecords(),
        delproTypeCodeList = this.$refs.xTable.getRemoveRecords()
      let  { tableData } = this.$refs.xTable.getTableData()//获取全量表体数据
      let flag1 = addTypeCodeList.some((item) => {
        return !item.prtypeCode
      })
      let flag2 = addTypeCodeList.some((item) => {
        return !item.isStop
      })
      if (flag1) {
        this.$message.warning('工资类别不能为空')
        return
      }
      if (flag2) {
        this.$message.warning('是否停发不能为空')
        return
      }
      let obj = {}
      tableData.forEach(item => {
        obj[item.prtypeCode] = 1
      })
      if(Object.getOwnPropertyNames(obj).length < tableData.length){
        this.$message.warning('工资类别重复，请重新选择')
        return
      }
      this.$showLoading()
      this.$axios
        .post('/prs/emp/prsType/saveMaEmp?roleId=' + this.pfData.svRoleId, {
          addTypeCodeList: addTypeCodeList,
          delproTypeCodeList: delproTypeCodeList,
          proTypeCodeList: this.tableData,
          rmwyid: this.rmwyid,
          agencyCode: this.pfData.svAgencyCode,
          rgCode: this.pfData.svRgCode,
          setYear: this.pfData.svSetYear,
        })
        .then((result) => {
          this.$hideLoading()
          if (result.data.flag === 'success') {
            this.$message.success('保存成功')
            this.cancel()
          } else {
            throw result.data.msg
          }
        })
        .catch(this.$showError)
    },
    getTableData(hideLoading) {
      if (!hideLoading) this.$showLoading()
      return this.$axios.post('/prs/emp/prsType/selectMaEmp?roleId=' + this.pfData.svRoleId, {
        agencyCode: this.pfData.svAgencyCode,
        rgCode: this.pfData.svRgCode,
        rmwyid: this.rmwyid,
        setYear: this.pfData.svSetYear,
      })
    },
    getData() {
      this.$showLoading()
      this.$axios
        .get('/prs/emp/prsType/selectMaEmpPrsTypeList?roleId=' + this.pfData.svRoleId)
        .then((result) => {
          if (result.data.flag === 'success') {
            this.prsTypeCo = result.data.data[0].data.prsTypeCo
            this.bankfileStyle = result.data.data[0].data.bankfileStyle
            let options1 = [],
              options2 = []
            this.prsTypeCo.forEach((item) => {
              options1.push({ label: item.prtypeName, value: item.prtypeCode, attrItems: item })
            })
            this.bankfileStyle.forEach((item) => {
              options2.push({ label: item.prstylName, value: item.prstylCode, attrItems: item })
            })
            options1.unshift({ label: '', value: '', attrItems: { bankCategoryName: '' } })
            options2.unshift({ label: '', value: '', attrItems: { bankCategoryName: '' } })
            this.defaultColumns[2].editRender.options = options1
            this.defaultColumns[2].editRender.events = { change: this.prsTypeCoChangeEvent }
            this.defaultColumns[8].editRender.options = options2
            this.defaultColumns[9].editRender.options = options2
            return this.getTableData(true)
          } else {
            throw result.data.msg
          }
        })
        .then(this.doTableData)
        .catch(this.$showError)
    },
    doTableData(result) {
      this.$hideLoading()
      if (result.data.flag === 'success') {
        this.maEmpAccountList = result.data.data.maEmpAccountList
        let options = []
        this.maEmpAccountList.forEach((item) => {
          if (item.isPrsCard === '1') {
            this.isPrsCardData = {
              prtypeCode: '',
              bankAcc: item.accountNo,
              bankAccName: item.bankCategoryName,
              bankAccOther: '',
              bankAccOtherName: '',
              isStop: '',
              bankfileStyle: '',
              bankfileStyleOther: '',
            }
          }
          options.push({
            label: item.accountNo,
            value: item.accountNo,
            attrItems: item,
          })
        })
        options.unshift({ label: '', value: '', attrItems: { bankCategoryName: '' } })
        if (this.maEmpAccountList.length > 0 && !this.isPrsCardData.bankAcc) {
          this.isPrsCardData = {
            prtypeCode: '',
            bankAcc: this.maEmpAccountList[0].accountNo,
            bankAccName: this.maEmpAccountList[0].bankCategoryName,
            bankAccOther: '',
            bankAccOtherName: '',
            isStop: '',
            bankfileStyle: '',
            bankfileStyleOther: '',
          }
        }
        this.defaultColumns[3].editRender.options = options
        this.defaultColumns[3].editRender.events = { change: this.bankAccChangeEvent }
        this.defaultColumns[5].editRender.options = options
        this.defaultColumns[5].editRender.events = { change: this.bankAccOtherChangeEvent }
        this.tableData = result.data.data.proTypeCodeList
      } else {
        throw result.data.msg
      }
    },
    prsTypeCoChangeEvent({ column, row }, e){
      let options = column.editRender.options
      let arr = options.filter((item) => {
        return item.value === e.target.value && item.attrItems.mo
      })
      console.log(arr)
      row.mo = ''
      if (arr.length > 0) {
        row.mo = arr[0].attrItems.mo
        console.log(row.mo)
      }
    },
    bankAccChangeEvent({ column, row }, e) {
      // console.log(column)
      let options = column.editRender.options
      let arr = options.filter((item) => {
        return item.value === e.target.value && item.attrItems.bankCategoryName
      })
      console.log(arr)
      row.bankAccName = ''
      if (arr.length > 0) {
        row.bankAccName = arr[0].attrItems.bankCategoryName
      }
    },
    bankAccOtherChangeEvent({ column, row }, e) {
      // console.log(e)
      let options = column.editRender.options
      let arr = options.filter((item) => {
        return item.value === e.target.value && item.attrItems.bankCategoryName
      })
      console.log(arr)
      row.bankAccOtherName = ''
      if (arr.length > 0) {
        row.bankAccOtherName = arr[0].attrItems.bankCategoryName
      }
    },
    /**
     * @description: 增加个人银行账户关闭
     */
    addAccountModalClose() {
      this.showAddAccount = false
      this.getTableData()
        .then(this.doTableData)
        .catch(this.$showError)
    },
    /**
     * @description: 增加
     */
    insertEvent(row) {
      this.$refs.xTable.insertAt(
        {
          id: this.rmwyid,
          bankAcc: this.isPrsCardData.bankAcc,
          bankAccName: this.isPrsCardData.bankAccName,
          isStop: 'N',
        },
        row
      )
    },
    /**
     * @description: 删除
     */
    delRow() {
      //获取勾选项
      let checkedRows = this.$refs.xTable.getCheckboxRecords()
      if (checkedRows.length === 0) {
        this.$message.warning('请选择工资类别数据')
        return
      }
      this.$axios
        .post('/prs/emp/prsType/checkDelData?roleId=' + this.pfData.svRoleId, {
          addTypeCodeList: this.$refs.xTable.getInsertRecords(),
          delproTypeCodeList: this.$refs.xTable.getRemoveRecords(),
          proTypeCodeList: this.tableData,
          rmwyid: this.rmwyid,
          agencyCode: this.pfData.svAgencyCode,
          rgCode: this.pfData.svRgCode,
          setYear: this.pfData.svSetYear,
        })
        .then((result) => {
          if (result.data.flag === 'success') {
            console.log(this.$refs.xTable)
            this.$refs.xTable.removeCheckboxRow()
          } else {
            throw result.data.msg
          }
        })
        .catch(this.$showError)
    },
  },
}
</script>
<style>
.addPrsType .vxe-cell {
  padding: 0 !important;
}
.addPrsType .vxe-table .vxe-cell--checkbox {
  margin-left: 0.7em;
}
</style>
<style lang="scss" scoped></style>
