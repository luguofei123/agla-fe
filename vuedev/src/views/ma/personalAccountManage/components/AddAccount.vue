<!--
 * @Author: sunch
 * @Date: 2020-07-10 09:41:51
 * @LastEditTime: 2020-08-21 10:59:01
 * @LastEditors: Please set LastEditors
 * @Description: 新增银行账户弹窗
 * @FilePath: /agla-fe-8.50/vuedev/src/views/ma/personalAccountManage/components/addAccount.vue
-->
<template>
  <uf-modal v-model="visible" @cancel="cancel" :width="1100" :title="title">
    <div class="flex-start">
      <!-- 如果是编辑状态 人员不可选 -->
      <div class="flex-start">
        <div class="label flex-start">
          <span>姓名</span>
          <div class="requireMark">*</div>
          <span>：</span>
        </div>
        <!-- 如果是新增状态 人员可选 -->
        <a-input v-if="editInfo.chrId||empReadonly" class="form-ele" :value="empName" disabled></a-input>
        <div v-else class="form-ele empSelect flex-start" @click="showEmpSelectModal = true">
          <span class="pl-10">{{ empName }}</span>
          <a-icon class="empSearch" type="search" />
        </div>
      </div>

      <div class="ml-20">
        <div class="label">人员编码：</div>
        <a-input class="form-ele" :value="empCode" disabled></a-input>
      </div>

      <div class="ml-20">
        <div class="label">部门：</div>
        <a-input class="form-ele" :value="orgName" disabled></a-input>
      </div>
    </div>

    <div class="flex-start mt-10">
      <div class="flex-start">
        <div class="label">账户类别：</div>
        <div class="form-ele">
          <a-radio-group v-model="accountAttr" button-style="solid"  size="small">
              <a-radio-button value="1">
              储蓄卡
              </a-radio-button>
              <a-radio-button value="2">
              公务卡
              </a-radio-button>
          </a-radio-group>
        </div>
      </div>

      <div class="ml-20 flex-start">
        <div class="label flex-start">
          <span>账号</span>
          <div class="requireMark">*</div>
          <span>：</span>
        </div>
        <a-input class="form-ele" v-model="accountNo"></a-input>
      </div>

      <div class="ml-20 flex-start">
        <div class="label flex-start">
          <span>户名</span>
          <div class="requireMark">*</div>
          <span>：</span>
        </div>
        <a-input class="form-ele" v-model="accountName"></a-input>
      </div>
    </div>

    <div class="flex-start mt-10">
      <div>
        <div class="label">银行类别：</div>
        <a-select class="form-ele" allowClear v-model="bankCategoryCode">
          <a-select-option v-for="item in bankCategoryList" :key="item.code" :value="item.code" @click="bankCategoryChange(item)">
            {{ item.codeName }}
          </a-select-option>
        </a-select>
      </div>

      <div class="ml-20 flex-start">
        <div class="label">开户银行：</div>
        <div class="form-ele empSelect flex-start" @click="openBankTreeModal">
          <a-tooltip>
            <template slot="title">
              {{bankName}}
            </template>
            <div class="pl-10 bankName">{{ bankName.length >= 12 ? '...' + bankName.substring(bankName.length - 12) : bankName }}</div>
          </a-tooltip>
          <a-icon v-if="bankName" class="clearBankName" style="color: #fff;font-size: 8px;" type="close" @click.stop="clearBankName" />
          <a-icon v-else class="empSearch" type="search" />
        </div>
      </div>

      <div class="ml-20">
        <div class="label">省份：</div>
        <a-input class="form-ele" :value="province" disabled></a-input>
      </div>
    </div>

    <div class="flex-start mt-10">
      <div>
        <div class="label">城市：</div>
        <a-input class="form-ele" :value="city" disabled></a-input>
      </div>

      <div class="ml-20">
        <div class="label">人行联行号：</div>
        <a-input class="form-ele" :value="pbcbankno" disabled></a-input>
      </div>

      <div class="ml-20">
        <div class="label">账户性质：</div>
        <a-input class="form-ele" :value="accountTypeName" disabled></a-input>
      </div>
    </div>

    <div class="flex-start mt-10">
      <div class="flex-start">
        <div class="label flex-start">
          <span>账户状态</span>
          <div class="requireMark">*</div>
          <span>：</span>
        </div>
        <a-select class="form-ele" allowClear v-model="accountStatus" @change="accountStatusChange">
          <a-select-option v-for="item in accountStatusList" :key="item['ENU_CODE']" :value="item['ENU_CODE']">
            {{ item['ENU_NAME'] }}
          </a-select-option>
        </a-select>
      </div>

      <div class="flex-start ml-20">
        <div class="label">默认为报销卡：</div>
        <div class="form-ele">
          <a-radio-group v-model="isReimburseCard" button-style="solid"  size="small">
              <a-radio-button value="1">
              是
              </a-radio-button>
              <a-radio-button value="0">
              否
              </a-radio-button>
          </a-radio-group>
        </div>
      </div>

      <div class="flex-start ml-20">
        <div class="label">默认为工资卡：</div>
        <div class="form-ele">
          <a-radio-group v-model="isPrsCard" button-style="solid"  size="small">
              <a-radio-button value="1">
              是
              </a-radio-button>
              <a-radio-button value="0">
              否
              </a-radio-button>
          </a-radio-group>
        </div>
      </div>
    </div>

    <div class="subTitle">已有银行账户信息</div>

    <!-- 表格 开始 -->
    <vxe-grid border stripe resizable head-align="center" height="140" show-header-overflow show-overflow size="mini" ref="xTable" :auto-resize="true" class="xtable mytable-scrollbar mt-10" :columns="defaultColumns" :data="tableData" :highlight-hover-row="true" :toolbar="{ id: 'AddAccountModal', resizable: { storage: true } }"> </vxe-grid>
    <!-- 表格 结束-->

    <empSelectModal v-model="showEmpSelectModal" @close="empSelectModalClose"></empSelectModal>

    <ufLocalLoading :visible="formLoading"></ufLocalLoading>

    <bankTreeModal :value="showBankTreeModal" @close="bankTreeModalClose" :bankCategoryCode="bankCategoryCode"></bankTreeModal>

    <template v-slot:footer>
      <a-button v-show="!editInfo.chrId" class="mr-10" @click="saveAdd">保存并新增</a-button>
      <a-button type="primary" class="mr-10" @click="saveClose">保存</a-button>
      <!-- <a-button @click="clear">清空</a-button> -->
      <a-button @click="cancel">关闭</a-button>
    </template>
  </uf-modal>
</template>
<script>
import { mapState } from 'vuex'
import { defaultColumns } from './defaultColumns'
import empSelectModal from '../../components/empSelectModal'
import bankTreeModal from './bankTreeModal'
export default {
  name: 'AddAccount',
  props: {
    title: {
      type: String,
      default: ''
    },
    value: {
      type: Boolean,
      default: false
    },
    editInfo: {
      type: Object,
      default: ()=>{
        return {}
      }
    },
    selectEmpCode: {
      type: String,
      default: ''
    },
    empReadonly: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      visible: false, //可见标记
      defaultColumns,
      tableData: [],
      showEmpSelectModal: false,
      showBankTreeModal: false,
      empCode: '', //人员代码
      empName: '', //人员名称
      orgName: '', //部门名称
      city: '', //城市
      province: '', //省份
      pbcbankno: '', //人行联行号
      accountType: '', //账户性质编码
      accountTypeName: '', //账户性质名称
      formLoading: false, //表单局部loading
      accountNo: '', //用户输入的账号
      accountName: '', //用户输入的户名
      accountAttr: '1', //账户类别
      isReimburseCard: '0',//默认为报销卡
      isPrsCard: '0',//默认为工资卡
      bankCategoryList: [],//银行类别列表
      bankCategoryCode: '',//银行类别
      bankTreeList: [], //开户银行列表 二级联动于银行类别
      bankCode: '', //开户银行代码
      bankName: '', //开户银行名称
      accountStatusList: [],//账户状态列表
      accountStatus: '',//账户状态值
    }
  },
  components: {
    empSelectModal,
    bankTreeModal
  },
  created() {
    this.getBankCategoryTree()
    this.getAccountStatus()
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
        /**
         * 如果chrId存在 说明是编辑
         * 如果selectEmpCode存在 chrId 不存在 说明是选择了左侧树人员的新增 需要默认带入账户性质和账户状态
         * 如果selectEmpCode不存在 chrId 不存在 说明是直接 新增 需要默认带入账户性质和账户状态
         */
        if(this.editInfo.chrId){
          this.getAccountData(this.editInfo.chrId, this.editInfo.editEmpCode)
        }else if(this.selectEmpCode){
          this.empCode = this.selectEmpCode
          this.getEmpData(this.selectEmpCode)
          this.accountStatus = '1'
          this.accountType = '1'
          this.accountTypeName = '个人'
        }else{
          this.accountStatus = '1'
          this.accountType = '1'
          this.accountTypeName = '个人'
        }
      }
    },
    accountNo(val) {
      this.$nextTick(() => {
          this.accountNo = val.replace(/\D/g,'').replace(/....(?!$)/g,'$& ')
      })
    }
  },
  methods: {
    /**
     * @description: 取消
     */
    cancel() {
      this.clear()
      this.visible = false
      this.$emit('close')
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
      this.save(this.cancel, this.editInfo.chrId)
    },
    /**
     * @description: 清空表单
     */
    clear() {
      this.accountNo = '' //用户输入的账号
      this.accountName = '' //用户输入的户名
      this.accountAttr = '1' //账户类别
      this.isReimburseCard = '0'//默认为报销卡
      this.isPrsCard = '0'//默认为工资卡
      this.bankCategoryCode = ''//银行类别
      this.bankCode = '' //开户银行代码
      this.bankName = '' //开户银行名称
      this.accountStatus = '' //账户状态值
      //清除选中的人信息
      this.city = '' //城市
      this.province = '' //省份
      this.pbcbankno = '' //人行联行号
      this.accountType = ''//账户性质编码
      this.accountTypeName = ''//账户性质名称
      this.tableData = [] //表格内容清空
      if(!this.empReadonly){
        this.empCode = '' //人员代码
        this.empName = '' //人员名称
        this.orgName = ''
      }else{
        this.empCode = this.selectEmpCode
        this.getEmpData(this.selectEmpCode)
      }
    },
    /**
     * @description: 保存
     */
    save(callback, chrId) {
      function getPropName(prop){
        let propNames = {
          empCode: '人员编码',
          orgCode: '部门编码',
          accountType: '账户性质',
          accountAttr: '账户类别',
          accountName: '户名',
          accountNo: '账号',
          accountStatus: '账户状态',
          isPrsCard: '工资卡',
          isReimburseCard: '默认报销卡',
        }
        return propNames[prop]
      }
      let argu = {
        empCode: this.empCode,
        orgCode: this.orgCode,//部门
        accountType: this.accountType, //账户性质
        accountAttr: this.accountAttr, //账户类别
        accountNo: this.accountNo.replace(/\s+/g,''),//账号
        accountName: this.accountName, //户名
        accountStatus: this.accountStatus,//账户状态
        isPrsCard: this.isPrsCard, //是否工资卡
        isReimburseCard: this.isReimburseCard, //是否默认报销卡
      }
      for(let prop in argu){
        if(!argu[prop]){
          this.$message.error(getPropName(prop) + '不能为空')
          return 
        }
      }
      //如果有一条账户数据为默认为报销卡 则该次新增数据不可以再选默认为报销卡
      //获取当前默认为报销卡的数据
      let arr = this.tableData.filter(item => {
        return item.isReimburseCard === '1'
      })
      if(chrId){
        //如果是“编辑”保存 如果chrId不一致 不可保存
        if(arr.length === 1 && arr[0].chrId != chrId && this.isReimburseCard === '1'){
          this.$message.error('已设置过其他账户为默认报销卡，不可再次设置')
          return
        }
      }else{
        //如果是“新增”保存
        if(arr.length > 0 && this.isReimburseCard === '1'){
          this.$message.error('已设置过其他账户为默认报销卡，不可再次设置')
          return
        }
      }
      
      //如果默认为报销卡 则银行类别和开户银行为必填
      if(this.isReimburseCard === '1'){
        if(!this.bankCategoryCode){
          this.$message.error('如果默认为报销卡，银行类别不能为空')
          return
        }
        if(!this.bankCode){
          this.$message.error('如果默认为报销卡，开户银行不能为空')
          return
        }
      }
      argu.bankCategoryCode = this.bankCategoryCode // 银行类别
      argu.bankCode = this.bankCode // 开户银行代码
      //带入的参数 因为不可编辑 不校验
      argu.province = this.province //省份
      argu.city = this.city //城市
      argu.pbcbankno = this.pbcbankno //人行联行号
      //其他常用参数
      argu.agencyCode = this.pfData.svAgencyCode
      argu.rgCode = this.pfData.svRgCode
      argu.setYear = this.pfData.svSetYear
      chrId?argu.chrId = chrId : false
      this.formLoading = true
      this.$axios.post('/ma/emp/account/saveMaEmpAccount', argu).then(result => {
        this.formLoading = false
        if(result.data.flag === 'success'){
          this.$message.success(result.data.msg)
          callback()
        }else{
          throw result.data.msg
        }
      }).catch(this.$showError)
    },
    /**
     * @description: 选择人员弹窗关闭
     */
    empSelectModalClose(info) {
      if (info) {
        this.empCode = info.code
        this.empName = info.name
        this.getEmpData(this.empCode)
      }
      this.showEmpSelectModal = false
    },
    /**
     * @description: 获取当前编辑的那条数据 和 全部数据
     */
    getAccountData(chrId, empCode){
      this.formLoading = true
      let argu = {
        empCode: empCode,
        rgCode: this.pfData.svRgCode,
        setYear: this.pfData.svSetYear,
        agencyCode: this.pfData.svAgencyCode
      }
      this.$axios
        .post('/ma/emp/account/selectMaEmpAccount', argu)
        .then((result) => {
          this.formLoading = false
          if (result.data.flag === 'success') {
            if (result.data.data.list.length > 0) {
              let info = result.data.data.list.filter(item => {
                return item.chrId === chrId
              })[0]
              this.empCode = info.empCode
              this.empName = info.empName
              this.orgCode = info.orgCode
              this.orgName = info.orgName
              this.city = info.city //城市
              this.province = info.province //省份
              this.pbcbankno = info.pbcbankno //人行联行号
              this.accountType = info.accountType//账户性质编码
              this.accountTypeName = info.accountTypeName//账户性质名称
              this.accountNo = info.accountNo //用户输入的账号
              this.accountName = info.accountName //用户输入的户名
              this.accountAttr = info.accountAttr //账户类别
              this.isReimburseCard = info.isReimburseCard //默认为报销卡
              this.isPrsCard = (info.isPrsCard?info.isPrsCard:'0') //默认为工资卡
              this.bankCategoryCode = info.bankCategoryCode//银行类别
              this.bankCode = info.bankCode //开户银行代码
              this.bankName = info.bankName //开户银行代码
              this.accountStatus = info.accountStatus //账户状态值
              this.tableData = result.data.data.list
            }
          } else {
            throw result.data.msg
          }
        })
        .catch(this.$showError)
    },
    /**
     * @description: 获取姓名 人员编码 部门名称
     * @param {string} empCode
     */
    getEmpData(empCode) {
      this.empCode = empCode
      this.formLoading = true
      let argu = {
        rgCode: this.pfData.svRgCode,
        setYear: this.pfData.svSetYear,
        agencyCode: this.pfData.svAgencyCode,
        empCode
      }
      this.$axios.post('/ma/api/selectMaEmp', argu).then(result => {
        if(result.data.flag === 'success'){
          let info = result.data.data[0]
          this.empName = info.empName
          this.orgCode = info.orgCode
          this.orgName = info.orgName
          return this.$axios.post('/ma/emp/account/selectMaEmpAccount', argu)
        }else{
          this.formLoading = false
          throw result.data.msg
        }
      }).then(result => {
        this.formLoading = false
        if(result.data.flag === 'success'){
          this.tableData = result.data.data.list
        }else{
          this.formLoading = false
          throw result.data.msg
        }
      }).catch(this.$showError)
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
    bankCategoryChange(item) {
      console.log(item)
      this.bankCategoryCode = item.code
      //清除开户银行
      this.clearBankName()
    },
    /**
     * @description: 打开银行类别树
     */
    openBankTreeModal(){
      //如果银行类别为空不展示
      if(!this.bankCategoryCode){
        this.$message.warning('请选择银行类别')
        return
      }else{
        this.showBankTreeModal = true
      }
    },
    /**
     * @description: 清除开户银行
     */
    clearBankName(){
      this.bankCode = ''
      this.bankName = ''
    },
    /**
     * @description: 开户银行改变
     */
    bankTreeModalClose(info) {
      if (info) {
        this.bankCode = info.code
        this.bankName = info.name
        //省份 城市
        this.province = info.province //省份
        this.city = info.city //城市
        this.pbcbankno = info.pbcbankno //人行联行号
      }
      this.showBankTreeModal = false
    },
    /**
     * @description: 开户银行改变
     */
    bankCodeChange(item) {
      this.bankCode = item.code
      this.province = item.province
      this.city = item.city
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
      this.accountStatus = val
    },
  },
}
</script>
<style lang="scss" scoped>
@import '@/assets/styles/variable.scss';
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
.empSearch,.clearBankName {
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
.bankName{
  width: 200px;
  overflow: hidden;
  text-overflow:ellipsis;
  white-space: nowrap;
}
</style>
