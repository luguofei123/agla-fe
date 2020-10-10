<!--
 * @Author: sunch
 * @Date: 2020-07-08 11:13:04
 * @LastEditTime: 2020-08-26 17:28:06
 * @LastEditors: Please set LastEditors
 * @Description: 个人银行账户
 * @FilePath: /agla-fe-8.50/vuedev/src/views/ma/personalAccountManage/personalAccountManage.vue
-->
<template>
  <div class="page">
    <!-- 头部开始 -->
    <ufHeader :title="title">
      <template slot="btns">
        <a-button type="primary" class="mr-5" :class="getBtnPer('btn-add')" @click="addEmpAccount">新增</a-button>
        <a-button class="mr-5" :class="getBtnPer('btn-import')" @click="showImportAccount = true">导入</a-button>
      </template>
    </ufHeader>

    <div class="container-page">
      <div class="leftWrap">
        <empOrgTreeLeftBox class="mt-8" @select="onSelectEmp"> </empOrgTreeLeftBox>
      </div>
      <div class="mainWrap">
        <!-- 查询条件开始 -->
        <ufQueryArea class="mt-8">
          <div class="flex-between">
            <div class="flex-start">
              <div class="input-wrap">
                <span class="label">人员编码：</span>
                <a-input class="form-input" v-model="empCodeLike" allowClear />
              </div>
              <div class="input-wrap">
                <span class="label">人员姓名：</span>
                <a-input class="form-input" v-model="empName" allowClear />
              </div>
            </div>

            <div class="flex-start">
              <ufMoreBtn class="mr-10" @change="moreBtnChange"></ufMoreBtn>
              <a-button :class="getBtnPer('btn-query')" type="primary" @click="getTableData()">查询</a-button>
            </div>
          </div>
          <div class="mt-10" v-if="showMoreQuery">
            <div class="flex-start">
              <div class="input-wrap">
                <span class="label">账户类别：</span>
                <div class="checkbox-wrap">
                  <a-checkbox class="mr-30" :defaultChecked="true" :checked="accountAttr1" @change="accountAttr1Change"><span class="checkboxText pl-5">储蓄卡</span></a-checkbox>
                  <a-checkbox :defaultChecked="true" :checked="accountAttr2" @change="accountAttr2Change"><span class="checkboxText pl-5">公务卡</span></a-checkbox>
                </div>
              </div>
              <div class="input-wrap">
                <span class="label">账号：</span>
                <a-input class="form-input" v-model="accountNo" allowClear />
              </div>
            </div>

            <div class="flex-start mt-10">
              <div class="input-wrap">
                <span class="label">银行类别：</span>
                <a-select class="form-select" allowClear @change="bankCategoryChange">
                  <a-select-option v-for="item in bankCategoryList" :key="item.code" :value="item.code">
                    {{ item.codeName }}
                  </a-select-option>
                </a-select>
              </div>
              <div class="input-wrap flex-start">
                <span class="label">开户银行：</span>
                <div class="form-select empSelect flex-start" @click="openBankTreeModal">
                  <div class="pl-10 bankName">{{ bankName.length >= 12 ? '...' + bankName.substring(bankName.length - 12) : bankName }}</div>
                  <a-icon v-if="bankName" class="clearBankName" style="color: #fff;font-size: 8px;" type="close" @click.stop="clearBankName" />
                  <a-icon v-else class="empSearch" type="search" />
                </div>
              </div>
            </div>

            <div class="flex-start mt-10">
              <div class="input-wrap">
                <span class="label">账户状态：</span>
                <a-select class="form-select" allowClear @change="accountStatusChange">
                  <a-select-option v-for="item in accountStatusList" :key="item['ENU_CODE']" :value="item['ENU_CODE']">
                    {{ item.codeName }}
                  </a-select-option>
                </a-select>
              </div>
              <div class="input-wrap">
                <span class="label">默认为报销卡：</span>
                <div class="checkbox-wrap">
                  <a-checkbox class="mr-30" :defaultChecked="true" :checked="isReimburseCard1" @change="isReimburseCard1Change"><span class="checkboxText pl-5">是</span></a-checkbox>
                  <a-checkbox :defaultChecked="true" :checked="isReimburseCard2" @change="isReimburseCard2Change"><span class="checkboxText pl-5">否</span></a-checkbox>
                </div>
              </div>
            </div>

            <div class="flex-start mt-10">
              <div class="input-wrap">
                <span class="label">默认为工资卡：</span>
                <div class="checkbox-wrap">
                  <a-checkbox class="mr-30" :defaultChecked="true" :checked="isPrsCard1" @change="isPrsCard1Change"><span class="checkboxText pl-5">是</span></a-checkbox>
                  <a-checkbox :defaultChecked="true" :checked="isPrsCard2" @change="isPrsCard2Change"><span class="checkboxText pl-5">否</span></a-checkbox>
                </div>
              </div>
            </div>
          </div>
        </ufQueryArea>
        <!-- 查询条件结束 -->

        <div class="toolbar">
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
          :columns="defaultColumns"
          :data="tableData"
          :highlight-hover-row="true"
          :toolbar="{ id: 'personalAccountManage', resizable: { storage: true } }"
        >
          <template v-slot:editEmpAccount="record">
            <div class="jump-link" @click="linkToEdit(record.row)">
              {{ record.row.accountNo }}
            </div>
          </template>
        </vxe-grid>
        <!-- 表格结束 -->

        <!-- 隐藏的表格 用来导出 begin -->
        <vxe-grid
          v-if="openExport"
          style="width: 9999px;"
          height="9999"
          show-overflow
          show-header-overflow
          ref="xTableHide"
          class="tableHide"
          :columns="defaultColumns"
        >
        </vxe-grid>
        <!-- 隐藏的表格 用来导出 end -->

        <!-- 自定义分页器开始 -->
        <ufPager :pager-config="page" @page-change="handlePageChange">
          <template v-slot:footerBtns>
            <div>
              <a-button :class="getBtnPer('btn-del')" @click="delMaEmpAccount">删除</a-button>
            </div>
          </template>
        </ufPager>
        <!-- 自定义分页器结束 -->
      </div>
    </div>
    <bankTreeModal :value="showBankTreeModal" @close="bankTreeModalClose" :bankCategoryCode="bankCategoryCode"></bankTreeModal>
    <AddAccount v-model="showAddAccount" @close="addAccountModalClose" :title="addAccountModalTitle" :selectEmpCode="selectEmpCode" :editInfo="{ chrId, editEmpCode }"></AddAccount>
    <ImportAccount v-model="showImportAccount" @close="importAccountClose"></ImportAccount>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import XLSX from 'xlsx'
import { saveAs } from 'file-saver'
import empOrgTreeLeftBox from '@/components/EmpOrgTreeLeftBox'
import { getBtnPer, getPdf, download } from '@/assets/js/util'
import { defaultColumns, defaultExportFormat } from './personalAccountManage'
import ImportAccount from './components/ImportAccount'
import AddAccount from './components/AddAccount'
import bankTreeModal from './components/bankTreeModal'
export default {
  data() {
    return {
      tableH: 300,
      title: '个人银行账户',
      showMoreQuery: false, //是否显示更多查询查询内容
      defaultColumns,
      tableData: [],
      showAddAccount: false,
      showImportAccount: false,
      showBankTreeModal: false, //显示查询开户银行输的弹窗
      /* 查询区域参数 */
      empCodeLike: '', //模糊查询的用户编码
      empName: '',
      accountNo: '', //银行账号
      bankName: '',
      accountAttr1: true,
      accountAttr2: true,
      isReimburseCard1: true,
      isReimburseCard2: true,
      isPrsCard1: true,
      isPrsCard2: true,
      // empCode: '', //精确查询的用户编码 已用this.selectCode代替
      /* 分页配置 */
      page: {
        tableName: 'personalAccountManage',
        currentPage: 1,
        pageSize: 50,
        pageSizes: [10, 20, 30, 50, 100, '全部'],
        total: 0,
      },
      /* 分页 */
      currentPage: 1,
      pageSize: 50,
      bankCategoryList: [], //银行类别列表
      bankCategoryCode: '', //银行类别
      bankTreeList: [], //开户银行列表 二级联动于银行类别
      bankCode: '', //开户银行代码
      accountStatusList: [], //账户状态列表
      accountStatus: '', //账户状态值
      addAccountModalTitle: '新增银行账户', //编辑某人的银行账户的弹出窗口名称
      chrId: '', //编辑的账户id
      editEmpCode: '', //点击编辑的人员id
      selectEmpCode: '', //左侧树选择的empCode
      selectCode: {}, //左侧树选择的代码 有可能是人员编码 有可能是部门编码
      openExport: false
    }
  },
  components: {
    empOrgTreeLeftBox, //部门人员
    ImportAccount, //导入弹窗
    AddAccount, //添加账户弹窗
    bankTreeModal
  },
  created() {
    this.tableH = this.containerH - 210
    this.getBankCategoryTree()
    this.getAccountStatus()
    this.getTableData()
  },
  watch: {
    showMoreQuery(flag) {
      if (flag) {
        this.tableH = this.containerH - 361
      } else {
        this.tableH = this.containerH - 210
      }
    },
    accountNo(val) {
      this.$nextTick(() => {
        this.accountNo = val.replace(/\D/g, '').replace(/....(?!$)/g, '$& ')
      })
    },
  },
  computed: {
    ...mapState({
      pfData: (state) => state.pfData,
      containerH: (state) => state.containerH,
    }),
    /**
     * @description: 账户类别
     */
    accountAttr() {
      if (this.accountAttr1 && this.accountAttr2) {
        return ''
      } else {
        let attr = ''
        if (this.accountAttr1) {
          attr = '1'
        } else {
          attr = '2'
        }
        return attr
      }
    },
    /**
     * @description: 默认为报销卡标记
     */
    isReimburseCard() {
      if (this.isReimburseCard1 && this.isReimburseCard2) {
        return ''
      } else {
        let attr = ''
        if (this.isReimburseCard1) {
          attr = '1'
        } else {
          attr = '0'
        }
        return attr
      }
    },
    /**
     * @description: 默认为工资卡标记
     */
    isPrsCard() {
      if (this.isPrsCard1 && this.isPrsCard2) {
        return ''
      } else {
        let attr = ''
        if (this.isPrsCard1) {
          attr = '1'
        } else {
          attr = '0'
        }
        return attr
      }
    },
  },
  methods: {
    getBtnPer,
    /**
     * @description: 打印
     */
    print() {
      this.$refs.xTable.openExport()
    },
    /**
     * @description: 导出
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
          let nameCode = this.pfData.svAgencyName
          // 保存导出
          saveAs(blob, nameCode + this.pfData.svSetYear + '年个人银行账户导出.xlsx',)
          this.openExport = false
          this.$hideLoading()
        }, 500)
      }, 500)
    },
    /**
     * @description: 更多按钮变化
     */
    moreBtnChange(val) {
      this.showMoreQuery = val
    },
    /**
     * @description: 新增银行账户
     */
    addEmpAccount() {
      this.addAccountModalTitle = '新增银行账户'
      this.chrId = ''
      this.showAddAccount = true
    },
    /**
     * @description: 弹出编辑窗口
     */
    linkToEdit(row) {
      this.addAccountModalTitle = '编辑银行账户'
      this.chrId = row.chrId
      this.editEmpCode = row.empCode
      this.$nextTick(() => {
        this.showAddAccount = true
      })
    },
    /**
     * @description: 获取银行类别
     */
    getBankCategoryTree() {
      this.$axios
        .get('/ma/emp/maEmp/selectBankCategoryTree', {
          params: {
            roleId: this.pfData.svRoleId,
            rgCode: this.pfData.svRgCode,
            setYear: this.pfData.svSetYear,
          },
        })
        .then((result) => {
          if (result.data.flag === 'success') {
            this.bankCategoryList = result.data.data
          } else {
            throw result.data.msg
          }
        })
        .catch(this.$showError)
    },
    /**
     * @description: 银行类别改变
     */
    bankCategoryChange(val) {
      this.bankCategoryCode = val
    },
    /**
     * @description: 打开银行类别树
     */
    openBankTreeModal() {
      //如果银行类别为空不展示
      if (!this.bankCategoryCode) {
        this.$message.warning('请选择银行类别')
        return
      } else {
        this.showBankTreeModal = true
      }
    },
    /**
     * @description: 开户银行改变
     */
    bankTreeModalClose(info) {
      if (info) {
        this.bankCode = info.code
        this.bankName = info.name
      }
      this.showBankTreeModal = false
    },
    /**
     * @description: 清除开户银行
     */
    clearBankName() {
      this.bankCode = ''
      this.bankName = ''
    },
    /**
     * @description: 获取账户状态
     */
    getAccountStatus() {
      this.$axios
        .get('/ma/pub/enumerate/MA_EMP_ACCOUNT_ACCOUNT_STATUS', {
          params: {
            roleId: this.pfData.svRoleId,
            rgCode: this.pfData.svRgCode,
            setYear: this.pfData.svSetYear,
          },
        })
        .then((result) => {
          if (result.data.flag === 'success') {
            this.accountStatusList = result.data.data
          } else {
            throw result.data.msg
          }
        })
        .catch(this.$showError)
    },
    /**
     * @description: 账户状态变更
     */
    accountStatusChange(val) {
      console.log(val)
      this.accountStatus = val
    },
    /**
     * @description: 账户类别多选框的两个处理函数
     */
    accountAttr1Change(e) {
      console.log(e)
      if (e.target.checked) {
        this.accountAttr1 = true
      } else {
        this.accountAttr1 = false
        this.accountAttr2 = true
      }
    },
    accountAttr2Change(e) {
      console.log(e)
      if (e.target.checked) {
        this.accountAttr2 = true
      } else {
        this.accountAttr2 = false
        this.accountAttr1 = true
      }
    },
    /**
     * @description: 默认为报销卡 两个处理函数
     */
    isReimburseCard1Change(e) {
      if (e.target.checked) {
        this.isReimburseCard1 = true
      } else {
        this.isReimburseCard1 = false
        this.isReimburseCard2 = true
      }
    },
    isReimburseCard2Change(e) {
      if (e.target.checked) {
        this.isReimburseCard2 = true
      } else {
        this.isReimburseCard2 = false
        this.isReimburseCard1 = true
      }
    },
    /**
     * @description: 默认为工资卡 两个处理函数
     */
    isPrsCard1Change(e) {
      if (e.target.checked) {
        this.isPrsCard1 = true
      } else {
        this.isPrsCard1 = false
        this.isPrsCard2 = true
      }
    },
    isPrsCard2Change(e) {
      if (e.target.checked) {
        this.isPrsCard2 = true
      } else {
        this.isPrsCard2 = false
        this.isPrsCard1 = true
      }
    },
    /**
     * @description: 获取表格数据
     */
    getTableData() {
      let { orgCode, empCode } = this.selectCode
      this.$showLoading()
      let argu = {
        rgCode: this.pfData.svRgCode,
        setYear: this.pfData.svSetYear,
        agencyCode: this.pfData.svAgencyCode,
      }
      if (empCode) {
        argu.empCode = empCode
      } else if (this.empCodeLike) {
        argu.empCode = this.empCodeLike
      } else {
        argu.empCode = ''
      }
      //如果有部门编码 查询该部门下的人的账户信息
      orgCode ? (argu.orgCode = orgCode) : ''
      this.empName ? (argu.empName = this.empName) : false
      this.accountNo ? (argu.accountNo = this.accountNo.replace(/\s+/g, '')) : false
      this.currentPage ? (argu.pageNum = this.currentPage) : false
      this.pageSize ? (argu.pageSize = this.pageSize) : false
      this.accountAttr ? (argu.accountAttr = this.accountAttr) : false
      this.isPrsCard ? (argu.isPrsCard = this.isPrsCard) : false
      this.isReimburseCard ? (argu.isReimburseCard = this.isReimburseCard) : false
      this.bankCategoryCode ? (argu.bankCategoryCode = this.bankCategoryCode) : false
      this.bankCode ? (argu.bankCode = this.bankCode) : false
      this.accountStatus ? (argu.accountStatus = this.accountStatus) : false
      this.$axios
        .post('/ma/emp/account/selectMaEmpAccount', argu)
        .then((result) => {
          this.$hideLoading()
          if (result.data.flag === 'success') {
            this.page.total = result.data.data.total
            this.tableData = result.data.data.list
          } else {
            throw result.data.msg
          }
        })
        .catch(this.$showError)
    },
    /**
     * @description: 选择或取消选择左侧树人员
     */
    onSelectEmp(code, type) {
      if (type === 'empCode') {
        this.selectEmpCode = code
        this.selectCode = { empCode: code }
      } else {
        this.selectEmpCode = ''
        this.selectCode = { orgCode: code }
      }
      this.getTableData()
    },
    /**
     * @description: 删除账户信息
     */
    delMaEmpAccount() {
      //获取勾选项
      let checkedRows = this.$refs.xTable.getCheckboxRecords()
      if (checkedRows.length === 0) {
        this.$message.warning('请选择要删除的数据！')
        return
      }
      let chrIds = checkedRows.map((item) => {
        return item.chrId
      })
      this.$confirm({
        title: '确定删除选中的数据吗？',
        content: '',
        okText: '确定',
        cancelText: '取消',
        onOk: () => {
          this.$axios
            .post('/ma/emp/account/delMaEmpAccount', {
              rgCode: this.pfData.svRgCode,
              setYear: this.pfData.svSetYear,
              agencyCode: this.pfData.svAgencyCode,
              chrIds: chrIds,
            })
            .then((result) => {
              if (result.data.flag === 'success') {
                this.getTableData()
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
      this.getTableData()
    },
    /**
     * @description: 添加账户窗口关闭
     */
    addAccountModalClose() {
      this.chrId = ''
      this.editEmpCode = ''
      this.showAddAccount = false
      //刷新表格数据
      this.getTableData()
    },
    /**
     * @description: 导入窗口关闭
     */
    importAccountClose() {
      this.showImportAccount = false
    },
  },
}
</script>
<style lang="scss" scoped>
@import '@/assets/styles/variable.scss';
.mt-8 {
  margin-top: 8px;
}
.page {
  height: 100%;
}
.container-page {
  height: calc(100% - 56px);
  box-sizing: border-box;
}
.leftWrap {
  width: 240px;
  height: 100%;
  float: left;
}
.mainWrap {
  margin-left: 248px;
  overflow: hidden;
}
.toolbar {
  padding: 8px 0 5px 0;
  display: flex;
  justify-content: flex-end;
}
.label {
  width: 100px;
}
.input-wrap {
  margin-right: 40px;
}
.form-input {
  width: 226px;
}
.checkbox-wrap {
  display: inline-block;
  width: 226px;
}
.checkboxText {
  font-size: 14px;
}
.form-select {
  width: 226px;
}
.empSelect {
  display: flex;
  height: 30px;
  border: 1px solid #d9d9d9;
  border-radius: $pf-border-radius;
  position: relative;
  background-color: #fff;
  cursor: pointer;
}
.empSearch,
.clearBankName {
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
  color: #999;
}
.clearBankName {
  width: 14px;
  height: 14px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 7px;
  cursor: pointer;
}
.bankName {
  width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
