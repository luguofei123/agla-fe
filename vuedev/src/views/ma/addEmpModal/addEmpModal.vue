<!--
 * @Author: sunch
 * @Date: 2020-07-29 10:19:21
 * @LastEditTime: 2020-09-08 13:53:59
 * @LastEditors: Please set LastEditors
 * @Description: 报销系统调用 => 新增人员
 * @FilePath: /agla-fe-8.50/vuedev/src/views/ma/addEmpModal/addEmpModal.vue
-->
<template>
  <div class="mainWrap">
    <div class="flex-start">
      <div class="flex-start">
        <div class="label flex-start">
          <span>部门</span>
          <div class="requireMark">*</div>
          <span>：</span>
        </div>
        <a-input class="form-ele" :value="orgName" disabled></a-input>
      </div>

      <div class="flex-start ml-20">
        <div class="label flex-start">
          <span>人员身份</span>
          <div class="requireMark">*</div>
          <span>：</span>
        </div>
        <ufTreeSelect class="form-ele" v-model="typeCode" :treeData="empTypeData" @change="empTypeChange"></ufTreeSelect>
      </div>

      <div class="flex-start ml-20">
        <div class="label flex-start">
          <span>姓名</span>
          <div class="requireMark">*</div>
          <span>：</span>
        </div>
        <a-input v-model="empName" class="form-ele"></a-input>
      </div>
    </div>

    <div class="flex-start mt-10">
      <div class="flex-start">
        <div class="label">证件类型：</div>
        <a-select class="form-ele" allowClear v-model="identityType">
          <a-select-option v-for="item in identityTypeList" :key="item.valId" :value="item.valId" @click="identityTypeChange(item)">
            {{ item.val }}
          </a-select-option>
        </a-select>
      </div>

      <div class="ml-20 flex-start">
        <div class="label">证件号码：</div>
        <a-input class="form-ele" type="text" v-model="identityCode"></a-input>
      </div>

      <div class="ml-20 flex-start">
        <div class="label">性别：</div>
        <a-select class="form-ele" allowClear v-model="sex">
          <a-select-option v-for="item in sexList" :key="item.valId" :value="item.valId" @click="sexChange(item)">
            {{ item.val }}
          </a-select-option>
        </a-select>
      </div>
    </div>

    <div class="flex-start mt-10">
      <div>
        <div class="label">外部人员单位：</div>
        <a-input class="form-ele" v-model="company"></a-input>
      </div>

      <div class="ml-20 flex-start">
        <div class="label">职称：</div>
        <a-select class="form-ele" allowClear>
          <a-select-option v-for="item in titleTechList" :key="item.valId" :value="item.valId" @click="titleTechChange(item)">
            {{ item.val }}
          </a-select-option>
        </a-select>
      </div>

      <div class="ml-20">
        <div class="label">职业：</div>
        <a-input class="form-ele" v-model="career"></a-input>
      </div>
    </div>

    <div class="flex-start mt-10">
      <div>
        <div class="label">手机号：</div>
        <a-input class="form-ele" type="number" v-model="phone"></a-input>
      </div>
    </div>

    <div class="flex-start mt-10">
      <div class="label">备注：</div>
      <a-textarea style="width: 922px;" v-model="remark"></a-textarea>
    </div>

    <div class="subTitle">账户信息</div>

    <div class="flex-start mt-10">
      <a-button class="" @click="insertEvent(-1)">增加</a-button>
      <a-button class="ml-10" @click="delRow">删除</a-button>
    </div>

    <!-- 表格 开始 -->
    <vxe-table
      border
      resizable
      :data="tableData"
      head-align="center"
      height="140"
      show-header-overflow
      show-overflow
      size="mini"
      ref="xTable"
      :auto-resize="true"
      @cell-click="cellClickEvent"
      class="xtable myTable mytable-scrollbar mt-10"
      :toolbar="{ id: 'addEmpModal', resizable: { storage: true } }"
      :edit-config="{ trigger: 'click', mode: 'cell', showIcon: false }"
    >
      <vxe-table-column type="checkbox" width="36" align="center"></vxe-table-column>
      <vxe-table-column type="seq" title="序号" width="60" align="center"></vxe-table-column>
      <vxe-table-column field="accountNo" title="账号" header-align="center" align="left" :edit-render="{ name: 'input', immediate: true, attrs: { type: 'text' } }"></vxe-table-column>
      <vxe-table-column field="accountName" width="150" title="户名" header-align="center" align="left" :edit-render="{ name: 'input', immediate: true, attrs: { type: 'text' } }"></vxe-table-column>
      <vxe-table-column
        field="bankCategoryName"
        title="银行类别"
        header-align="center"
        align="left"
        width="200"
        :edit-render="{ name: '$select', options: bankCategoryList, optionProps: { value: 'code', label: 'codeName' }, events: { change: this.bankCategoryEvent } }"
      ></vxe-table-column>
      <vxe-table-column field="bankName" width="300" title="开户银行" header-align="center" align="left"></vxe-table-column>
    </vxe-table>
    <!-- 表格 结束-->

    <bankTreeModal :value="showBankTreeModal" @close="bankTreeModalClose" :bankCategoryCode="bankCategoryCode"></bankTreeModal>

    <div class="classFooter">
      <div class="flex-end">
        <!-- <a-button class="mr-10" @click="saveAdd">保存并新增</a-button> -->
        <a-button class="mr-10" type="primary" @click="saveAdd">保存并新增</a-button>
        <!-- <a-button @click="clear">清空</a-button> -->
        <!-- <a-button @click="cancel">关闭</a-button> -->
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import bankTreeModal from '../personalAccountManage/components/bankTreeModal'

//open弹窗的关闭方法
window._close = function(action, msg) {
  if (window.closeOwner) {
    var data = {
      action: action,
      msg: msg,
    }
    window.closeOwner(data)
  }
}
var ownerData = window.ownerData

export default {
  name: 'addEmpModal',
  data() {
    return {
      fromSys: '', //从哪个系统跳转来的系统标识 AR 报销 OPA
      tableData: [],
      showBankTreeModal: false,
      bankCategoryCode: '',
      bankCategoryObj: {},
      /** 页面的属性 */
      orgName: '外单位人员部门',
      empTypeData: [], //人员身份树
      typeCode: '', //人员身份编码
      empName: '', //姓名
      identityTypeList: [], //证件类型列表
      identityType: '01', //证件类型编码 默认'01' 默认为居民身份证
      identityCode: '', //证件号码
      sexList: [], //性别列表
      sex: '', //性别
      company: '', //工作单位
      titleTechList: [], //职称列表
      titleTech: '', //职称
      career: '', //职业
      phone: '', //手机号
      remark: '', //备注
      /**可编辑表的默认 */
      bankCategoryList: [], //银行类别列表
      curRowIndex: 0, //点击单元格所在行的下标
    }
  },
  components: {
    bankTreeModal,
  },
  created() {
    this.fromSys = this.$route.query.fromSys ? this.$route.query.fromSys : ''
    console.log('from Sys : ' + this.fromSys)
    this.$showLoading()
    //人员身份
    this.getEmpType()
    //获取证件类别和性别
    this.getEmpPropList()
    //银行类别
    this.getBankCategoryTree()
    //账户状态
    // this.getAccountStatus()
  },
  computed: {
    ...mapState({
      pfData: (state) => state.pfData,
    }),
  },
  watch: {
    accountNo(val) {
      this.$nextTick(() => {
        this.accountNo = val.replace(/\D/g, '').replace(/....(?!$)/g, '$& ')
      })
    },
    identityCode(val) {
      this.$nextTick(() => {
        this.identityCode = val.replace(/[^a-zA-Z0-9]/,'') //匹配除了字母和数字以外字符，并替换为空
      })
    }
  },
  methods: {
    /**
     * @description: 获取人员身份 并且只要是劳务人员的isLwWork='1'
     */
    getEmpType() {
      this.$axios
        .get('/ma/ele/emptype/selectEmpType', { params: { roleId: this.pfData.svRoleId, agencyCode: this.pfData.svAgencyCode, isLwWork: '1' } })
        .then((result) => {
          if (result.data.flag === 'success') {
            let treeData = result.data.data
            treeData.forEach((item) => {
              item.id = item.chrCode
              item.pId = item.parentCode
              item.code = item.chrCode
              item.codeName = item.chrName
            })
            this.empTypeData = treeData
          } else {
            throw result.data.msg
          }
        })
        .catch(this.$showError)
    },
    /**
     * @description: 选择人员身份
     */
    empTypeChange(res) {
      this.typeCode = res.value
    },
    /**
     * @description: 获取证件类别和性别
     */
    getEmpPropList() {
      this.$axios
        .get('/ma/emp/maEmp/selectMaEmpAndPrsCalcData?roleId=' + this.pfData.svRoleId)
        .then((result) => {
          this.$hideLoading()
          if (result.data.flag === 'success') {
            result.data.data[0].data.forEach((item) => {
              if (item.propertyCode === 'identityType') {
                this.identityTypeList = item.asValList
              }
              if (item.propertyCode === 'sex') {
                this.sexList = item.asValList
              }
              if (item.propertyCode === 'titleTech') {
                this.titleTechList = item.asValList
              }
            })
          } else {
            throw result.data.msg
          }
        })
        .catch(this.$showError)
    },
    /**
     * @description: 证件类型改变
     */
    identityTypeChange(item) {
      this.identityType = item.valId
    },
    /**
     * @description: 性别改变
     */
    sexChange(item) {
      this.sex = item.valId
    },
    /**
     * @description: 职称改变
     */
    titleTechChange(item) {
      this.titleTech = item.valId
    },
    /**
     * @description: 增加
     */
    insertEvent(row) {
      this.$refs.xTable.insertAt(
        {
          accountAttr: '1', //账户类别
          accountNo: '', //用户输入的账号
          accountName: '', //用户输入的户名
          bankCategoryCode: '', //银行类别
          bankCode: '', //开户银行代码
          bankName: '', //开户银行名称
          pbcbankno: '', //人行联行号
          city: '', //城市
          province: '', //省份
          accountStatus: '1', //账户状态 默认'1' 正常
          accountType: '1', //账户性质编码 默认是'1' 个人
          isReimburseCard: '0', //默认为报销卡
          isPrsCard: '0', //默认为工资卡
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
        this.$message.warning('请选择账户数据')
        return
      }
      this.$refs.xTable.removeCheckboxRow()
    },
    /**
     * @description: 点击单元格事件
     */
    cellClickEvent({ $rowIndex, column }) {
      if (column.property === 'bankName') {
        if (!!!this.bankCategoryObj[$rowIndex]) {
          this.$message.warning('请先选择银行类别')
          return
        }
        this.bankCategoryCode = this.bankCategoryObj[$rowIndex]
        this.curRowIndex = $rowIndex
        this.showBankTreeModal = true
      }
    },
    /**
     * @description: 切换银行类别
     */
    bankCategoryEvent({ column, row, $rowIndex }, e) {
      row.bankCode = ''
      row.bankName = ''
      row.province = '' //省份
      row.city = '' //城市
      row.pbcbankno = '' //人行联行号
      this.bankCategoryObj[$rowIndex] = e.value
    },
    /**
     * @description: 取消
     */
    cancel() {
      _close()
    },
    /**
     * @description: 清空表单内容
     */
    clear() {
      this.tableData = []
      this.showBankTreeModal = false
      this.bankCategoryCode = ''
      this.bankCategoryObj = {}
      this.typeCode = '' //人员身份编码
      this.empName = '' //姓名
      this.identityType = '01' //证件类型编码 默认'01' 默认为居民身份证
      this.identityCode = '' //证件号码
      this.sex = '' //性别
      this.company = '' //工作单位
      this.titleTech = '' //职称
      this.career = '' //职业
      this.phone = '' //手机号
      this.remark = '' //备注
      this.curRowIndex = 0 //点击单元格所在行的下标
    },
    /**
     * @description: 保存并新增
     */
    saveAdd() {
      //清空表单
      this.save(this.clear)
    },
    /**
     * @description: 保存并关闭窗口
     */
    saveClose() {
      this.save(this.cancel)
    },
    /**
     * @description: 保存
     */
    save(callback) {
      let addTypeCodeList = this.$refs.xTable.getInsertRecords()
      let cur1 = 0,
        cur2 = 0
      addTypeCodeList.forEach((item, index) => {
        if (!!!item.accountNo && cur1 === 0) {
          cur1 = index + 1
        }
        if (!!!item.accountName && cur2 === 0) {
          cur2 = index + 1
        }
      })
      if (!!cur1) {
        this.$message.warning('账户信息第' + cur1 + '行，账号不能为空')
        return
      }
      if (!!cur2) {
        this.$message.warning('账户信息第' + cur2 + '行，户名不能为空')
        return
      }
      if (!!!this.typeCode) {
        this.$message.warning('请选择人员身份')
        return
      }
      if (!!!this.empName) {
        this.$message.warning('请输入人员姓名')
        return
      }
      let argu = {
        rgCode: this.pfData.svRgCode,
        setYear: this.pfData.svSetYear,
        agencyCode: this.pfData.svAgencyCode, //单位
        empName: this.empName, //人员姓名
        orgName: this.orgName, //部门名称
        typeCode: this.typeCode, //人员身份
        identityType: this.identityType, //证件类型
        identityCode: this.identityCode, //证件号
        sex: this.sex, //性别
        phone: this.phone, //手机号
        remark: this.remark, //备注
        company: this.company, //外部人员单位
        titleTech: this.titleTech, //职称
        career: this.career, //职业
        maEmpAccountList: addTypeCodeList,
      }
      this.$axios
        .post('/ma/api/saveMaEmpBx', argu)
        .then((result) => {
          if (result.data.flag === 'success') {
            this.$message.success('保存成功')
            callback()
          } else {
            throw result.data.msg
          }
        })
        .catch(this.$showError)
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
     * @description: 开户银行改变
     */
    bankTreeModalClose(info) {
      if (info) {
        let addTypeCodeList = this.$refs.xTable.getInsertRecords()
        let row = addTypeCodeList[this.curRowIndex]
        row.bankCode = info.code
        row.bankName = info.name
        row.province = info.province //省份
        row.city = info.city //城市
        row.pbcbankno = info.pbcbankno //人行联行号
      }
      this.showBankTreeModal = false
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
  },
}
</script>
<style lang="scss" scoped>
@import '@/assets/styles/variable.scss';
.mainWrap {
  min-width: 1080px;
  min-height: 410px;
  position: relative;
  padding: 15px 15px 20px 15px;
  box-sizing: border-box;
  overflow: auto;
}
.label {
  width: 110px;
}
.requireMark {
  height: 18px;
  line-height: 22px;
  color: red;
  font-size: 18px;
  box-sizing: border-box;
}
.form-ele {
  width: 220px;
}
.subTitle {
  border-left: 4px solid #108ee9;
  padding-left: 10px;
  font-size: 16px;
  font-weight: bold;
  line-height: 18px;
  color: #108ee9;
  margin-top: 20px;
}
.empSelect {
  display: flex;
  height: 30px;
  border: 1px solid #d9d9d9;
  border-radius: $pf-border-radius;
  position: relative;
  cursor: pointer;
}
.empSearch {
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
  color: #999;
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
.bankName {
  width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.classFooter {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #fff;
  padding: 10px;
  box-sizing: border-box;
  border-top: 1px solid #d9d9d9;
  z-index: 99;
}
.xtable {
  max-width: 1080px;
}
</style>
