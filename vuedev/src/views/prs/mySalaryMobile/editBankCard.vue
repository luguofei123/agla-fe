<!--
 * @Author: sunch
 * @Date: 2020-07-31 10:34:50
 * @LastEditTime: 2020-09-08 11:42:42
 * @LastEditors: Please set LastEditors
 * @Description: 编辑银行卡
 * @FilePath: /agla-fe-8.50/vuedev/src/views/prs/mySalaryMobile/editBankCard.vue
-->
<template>
  <div class="main" ref="main">
    <MintHeader ref="MintHeader" type="detail" :title="title" :backType="backType" :pathConfig="pathConfig"> </MintHeader>

    <div class="formWrap">
      <div class="formRow bb1" @click="focus1">
        <div class="label">银行卡号</div>
        <input class="formInput" v-model="accountNo" ref="accountNoInput" type="text" :disabled="view" />
      </div>
      <div class="formRow bb1" @click="focus2">
        <div class="label">户名</div>
        <input class="formInput" v-model="accountName" ref="accountNameInput" type="text" :disabled="view" />
      </div>
      <div class="linkRow bb1" @click="linkToBankCategory">
        <div class="label">银行类别</div>
        <FormLink>{{ bankCategoryName }}</FormLink>
      </div>
      <div class="linkRow bb1" @click="linkToBankName">
        <div class="label">开户银行</div>
        <FormLink>{{ bankName }}</FormLink>
      </div>
      <div class="formRow bb1" v-if="showGw">
        <div class="label">公务卡</div>
        <mt-switch v-model="accountAttr" :disabled="view"></mt-switch>
      </div>
      <div class="formRow bb1" v-if="showBx">
        <div class="label">默认报销卡</div>
        <mt-switch v-model="isReimburseCard" :disabled="view"></mt-switch>
      </div>
      <div class="formRow" v-if="showGz">
        <div class="label">默认工资卡</div>
        <mt-switch v-model="isPrsCard" :disabled="view"></mt-switch>
      </div>
    </div>
    <div class="btnWrap" v-if="view">
      <div class="tip">当前信息正在审核中，不可编辑</div>
    </div>
    <div class="btnWrap" v-else>
      <MintButton type="primary" @click="confirm">确定</MintButton>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import MintHeader from './components/MintHeader'
import MintButton from './components/MintButton'
import FormLink from './components/FormLink'
import moment from 'moment'

export default {
  name: 'editBankCard',
  data() {
    return {
      title: '编辑银行卡',
      accountNo: '',
      accountName: '',
      bankCategoryCode: '',
      bankCategoryName: '',
      bankCode: '',
      bankName: '',
      accountAttr: false,
      isReimburseCard: false,
      isPrsCard: false,
      view: false, //是否仅仅为预览模式
      chrId: '',
      billNo: '',
      backType: 'replace',
      pathConfig: {
        name: 'myCards',
        query: {},
      },
      auditStatus: '',
      setYear: moment().year(),
      showGw: false,
      showBx: false,
      showGz: false
    }
  },
  computed: {
    ...mapState({
      tokenId: (state) => state.tokenId,
    }),
  },
  created() {
    console.log(this.tokenId)
    this.getConfig()
    this.pathConfig.query.tokenid = this.tokenId
    let param = this.$route.query
    if (param.type === 'add') {
      this.title = '添加银行卡'
    } else if (param.type === 'edit' || param.type === 'view') {
      if (param.type === 'edit') {
        this.title = '编辑银行卡'
      } else if (param.type === 'view') {
        this.title = '查看银行卡'
      }
      param.type === 'view' ? (this.view = true) : (this.view = false)
      this.chrId = param.chrId
      this.billNo = param.billNo
      this.auditStatus = param.auditStatus
      this.getData()
    } else if (param.type === 'bankCategory') {
      this.auditStatus = param.auditStatus
      this.billNo = param.billNo
      this.bankCategoryCode = param.bankCategoryCode
      this.bankCategoryName = param.bankCategoryName
      //将保存的用户输入填入 如果有chrId将其赋值
      if (param.chrId) this.chrId = param.chrId
      if (param.accountNo) this.accountNo = param.accountNo
      this.accountName = param.accountName
      if (typeof param.accountAttr === 'boolean') {
        this.accountAttr = param.accountAttr
        this.isReimburseCard = param.isReimburseCard
        this.isPrsCard = param.isPrsCard
      } else {
        param.accountAttr === 'true' ? (this.accountAttr = true) : (this.accountAttr = false)
        param.isReimburseCard === 'true' ? (this.isReimburseCard = true) : (this.isReimburseCard = false)
        param.isPrsCard === 'true' ? (this.isPrsCard = true) : (this.isPrsCard = false)
      }
      //开户银行重置为空
      this.bankCode = ''
      this.bankName = ''
    } else if (param.type === 'bankCode') {
      this.auditStatus = param.auditStatus
      this.billNo = param.billNo
      this.bankCode = param.bankCode
      this.bankName = param.bankName
      //将保存的用户输入填入 如果有chrId将其赋值
      if (param.chrId) this.chrId = param.chrId
      if (param.accountNo) this.accountNo = param.accountNo
      this.accountName = param.accountName
      this.bankCategoryCode = param.bankCategoryCode
      this.bankCategoryName = param.bankCategoryName
      if (typeof param.accountAttr === 'boolean') {
        this.accountAttr = param.accountAttr
        this.isReimburseCard = param.isReimburseCard
        this.isPrsCard = param.isPrsCard
      } else {
        param.accountAttr === 'true' ? (this.accountAttr = true) : (this.accountAttr = false)
        param.isReimburseCard === 'true' ? (this.isReimburseCard = true) : (this.isReimburseCard = false)
        param.isPrsCard === 'true' ? (this.isPrsCard = true) : (this.isPrsCard = false)
      }
    }
  },
  components: {
    MintHeader,
    MintButton,
    FormLink,
  },
  watch: {
    accountNo(val) {
      this.$nextTick(() => {
        let value = val.replace(/\D/g, '').replace(/....(?!$)/g, '$& ')
        this.accountNo = value
      })
    },
  },
  methods: {
    getConfig(){
      this.$axios.get('/ma/api/sysRgPara/getSysRuleSetByChrCodesApi?',{
        params:{
          chrCodes: 'MA004,MA005,MA006',
          rgCode: '87',
          setYear: this.setYear,
          agencyCode: '*',
          acctCode: '*'
       }
      }).then(result => {
        let res = result.data
        this.showGw = res.MA006
        this.showBx = res.MA004
        this.showGz = res.MA005
      }).catch(this.$showError)
    },
    getData() {
      let argu = {
        tokenid: this.tokenId,
        chrId: this.chrId,
      }
      !!this.billNo ? (argu.billNo = this.billNo) : false
      this.$axios
        .post('/ma/emp/account/approval/selectSingleAccountInfo', argu)
        .then((result) => {
          if (result.data.flag === 'success') {
            if (result.data.data.length > 0) {
              let data = result.data.data[0]
              this.accountNo = data.accountNo
              this.accountName = data.accountName
              this.bankCategoryCode = data.bankCategoryCode
              this.bankCategoryName = data.bankCategoryName
              this.bankCode = data.bankCode
              this.bankName = data.bankName
              this.accountAttr = data.accountAttr === '2'
              this.isPrsCard = data.isPrsCard === '1'
              this.isReimburseCard = data.isReimburseCard === '1'
            } else {
              return
            }
          } else {
            throw result.data.msg
          }
        })
        .catch((error) => {
          this.$Toast({
            message: error,
            position: 'middle',
            duration: 3000,
            iconClass: 'icon icon-warning',
          })
        })
    },
    focus1() {
      this.$refs.accountNoInput.focus()
    },
    focus2() {
      this.$refs.accountNameInput.focus()
    },
    confirm() {
      if (!this.bankCategoryCode) {
        this.$Toast({
          message: '银行类别为必填',
          position: 'middle',
          duration: 3000,
        })
        return
      }
      if (this.isReimburseCard) {
        if (!this.bankCode) {
          this.$Toast({
            message: '如果设置为报销卡，则开户银行必填',
            position: 'middle',
            duration: 3000,
          })
          return
        }
      }
      let argu = {
        tokenid: this.tokenId,
        maEmpAccountApproval: {
          accountNo: this.accountNo.replace(/\s+/g, ''), //账号
          accountName: this.accountName, //户名
          bankCategoryCode: this.bankCategoryCode, //银行类别代码
          bankCode: this.bankCode, //开户银行代码
          accountType: '1', //默认传1就可以
          accountAttr: this.accountAttr ? '2' : '1', //是否公务卡，1代表普通用户，2代表公务卡
          isReimburseCard: this.isReimburseCard ? '1' : '0', //是否默认报销卡
          isPrsCard: this.isPrsCard ? '1' : '0', //是否默认工资卡
        },
      }
      if (this.chrId) {
        argu.maEmpAccountApproval.chrId = this.chrId
        argu.maEmpAccountApproval.modifyStatus = '1'
      } else {
        argu.maEmpAccountApproval.modifyStatus = '0'
      }
      if(this.auditStatus){
        argu.maEmpAccountApproval.auditStatus = this.auditStatus
      }
      if(this.billNo){
        argu.maEmpAccountApproval.billNo = this.billNo
      }
      console.log(argu)
      this.$axios
        .post('/ma/emp/account/approval/submitApprovalProcess', argu)
        .then((result) => {
          if (result.data.flag === 'success') {
            let type = this.$route.query.type,
              tip = ''
            if (type === 'edit') {
              tip = '修改'
            } else if (type === 'add') {
              tip = '保存'
            }
            this.$Toast({
              message: tip + '成功！',
              position: 'middle',
              duration: 3000,
              iconClass: 'icon icon-check',
            })
            this.$router.replace({ name: 'myCards', query: { tokenid: this.tokenId } })
          } else {
            throw result.data.msg
          }
        })
        .catch((error) => {
          this.$Toast({
            message: error,
            position: 'middle',
            duration: 3000,
            iconClass: 'icon icon-warning',
          })
        })
    },
    linkToBankCategory() {
      if (this.view) {
        return
      }
      let query = {
        tokenid: this.tokenId,
        type: 'bankCategory',
        bankCategoryCode: this.bankCategoryCode,
        accountNo: this.accountNo,
        accountName: this.accountName,
        accountAttr: this.accountAttr,
        isReimburseCard: this.isReimburseCard,
        isPrsCard: this.isPrsCard,
        auditStatus: this.auditStatus,
        billNo: this.billNo
      }
      if(this.chrId){
        query.chrId = this.chrId
      }
      this.$router.push({
        name: 'bankList',
        query
      })
    },
    linkToBankName() {
      if (this.view) {
        return
      }
      if (!this.bankCategoryCode) {
        this.$Toast({
          message: '请先设置银行类别',
          position: 'middle',
          duration: 3000,
        })
        return
      }
      let query = {
        tokenid: this.tokenId,
        type: 'bankCode',
        bankCategoryCode: this.bankCategoryCode,
        bankCategoryName: this.bankCategoryName,
        bankCode: this.bankCode,
        accountNo: this.accountNo,
        accountName: this.accountName,
        accountAttr: this.accountAttr,
        isReimburseCard: this.isReimburseCard,
        isPrsCard: this.isPrsCard,
        auditStatus: this.auditStatus,
        billNo: this.billNo
      }
      if(this.chrId){
        query.chrId = this.chrId
      }
      this.$router.push({
        name: 'bankList',
        query
      })
    },
  },
}
</script>
<style>
.formWrap {
  margin-top: 0.2rem;
  padding: 0 0.3rem;
  background: #fff;
}
.btnWrap {
  padding: 0.2rem 0.3rem;
}
.tip {
  text-align: center;
  color: #999;
}
</style>
