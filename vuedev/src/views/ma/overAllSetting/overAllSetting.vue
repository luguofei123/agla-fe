<template>
<div>
  <div class="header-wrap">
    <div class="title-wrap">
      <div class="caption">
        <div class="title">全局设置</div>
      </div>
    </div>
  </div>
  <div class="buttonBox">
    <a-button type="primary" class="btn-initbasesys" @click="showAllsetting">全局设置</a-button>
  </div>
  <div>
    <!-- 条件选择弹框部分开始 -->
    <uf-modal title="全局设置" v-model="ModalVisible" @cancel="cancelDialog"  :width="520" bodySyle="modalBody">
      <div class="modal-main allSetting">
          <div class="wrapDiv clear_fix">
            <div class="lebal">日期:</div>
            <div class="item">
            <a-date-picker
            :value="selectDate" 
            :locale="zh_CN"
            :allowClear="false"
            placeholder="选择日期"
              @change="onChange" 
              style="width:220px;font-size:14px;"
              />
            </div>
          </div>
          <div class="wrapDiv clear_fix">
            <div class="lebal">角色:</div>
            <div class="item">
              <a-select placeholder="选择角色" v-model="form.role"   @change="handleSelectChangeRole" style="width:220px;font-size:14px;">
               <a-select-option v-for="(item, index) in roleArr" :key="index" :value="item.value">{{item.label}}</a-select-option>
              </a-select>
              </div>
          </div>
          <div class="wrapDiv clear_fix">
            <div class="lebal">单位:</div>
            <div class="item">
          <RptTreeSelect
            :treeData="unittreeData"
            :clickAllNodeAble="true"
            :value="form.unit"
            @change="changeunitTree('',arguments[0],'')"
          ></RptTreeSelect>
          </div>
          </div>
          <div class="wrapDiv clear_fix">
            <div class="lebal">账套:</div>
            <div class="item">
              <a-select placeholder="选择账套" v-model="form.account"   @change="handleSelectChange" style="width:220px;font-size:14px;">
               <a-select-option v-for="(item, index) in accounttreeData" :key="index" :value="item.CHR_CODE">{{item.CHR_NAME}}</a-select-option>
              </a-select>
          <!-- <RptTreeSelect
            :treeData="accounttreeData"
            :clickAllNodeAble="true"
            :value="form.account"
            @change="changeaccountTree('',arguments[0],'')"
          ></RptTreeSelect> -->
          </div>
          </div>
      </div>
      <hr style="margin-left:-15px;margin-right:-15px;border:1px solid #dedede;">
      <template slot="footer">
        <a-button type="primary" class="mr-200" @click="applyFormDateDefault">设为默认应用</a-button>
        <a-button type="primary" class="mr-10" @click="applyFormDate" >应用</a-button>
        <a-button @click="cancelDialog">取消</a-button>
      </template>
    </uf-modal>
    <!-- 条件选择弹框部分结束 -->
  </div>
</div>
</template>
<script>
import zh_CN from "ant-design-vue/es/date-picker/locale/zh_CN";
import moment from "moment";
import RptTreeSelect from "../../gl/rpt/components/RptTreeSelect";
import { mapState } from "vuex";
export default {
  name: "overAllSetting", // 全局设置
  components: {
    RptTreeSelect
  },
  data () {
    return {
      ModalVisible: false,
      formLayout: 'horizontal',
      zh_CN,
      moment,
      selectDate: moment(new Date(),"YYYY-MM-DD"), // 时间默认值
      form: {
        dateString: '',
        role: '',
        unit: '',
        account: ''
      },
      unittreeData: [],  //单位树
      accounttreeData: [],  // 账套树
      roleArr:[{value:'1',label:"角色1"},{value:'2',label:"角色2"}],     // 角色
    }
  },
  computed: {
    ...mapState({
      pfData: (state) => state.pfData, // 全局的commonData 用户当前登陆公共信息
    })
  },
  created () {
    this.selectDate = moment(new Date(this.pfData.svTransDate),"YYYY-MM-DD")
    this.form.unit  = this.pfData.svAgencyCode  // 单位code
    this.form.account  = this.pfData.svAcctCode  // 账套code
    this.getUnit()
  },
  mounted () {
     setTimeout(()=> {
       this.openDialog()
     },500)
  },
  methods: {
    openDialog () {
      this.ModalVisible = true
      this.getUnit()
    },
    cancelDialog () {
      this.ModalVisible = false
    },
    showAllsetting () {
      this.ModalVisible = true
      this.getUnit()
    },
    handleSelectChange () {
      // 
    },
    handleSelectChangeRole () {
      //
    },
    onChange (date, dateString) {
      this.selectDate = moment(date)
      this.form.dateString = moment(date).format("YYYY-MM-DD")
    },
    // 设置成应用
    applyFormDate () {
      this.form.dateString = moment(this.selectDate).format("YYYY-MM-DD")
      console.log(this.form)
      let t = moment('2012-8-9',"YYYY-MM-DD")
      // console.log(t)
      // console.log(t.year()+'-'+t.month()+'-'+t.date())
      // console.log(t.format('YYYY-MM-DD'))
      // console.log(t.format('YYYY'))
      // console.log(t.format('YYYY-MM'))
      // console.log(t.format('DD'))
    },
    // 设置成默认应用
    applyFormDateDefault () {
      this.form.dateString = moment(this.selectDate).format("YYYY-MM-DD")
      console.log(this.form)
    },
    // 账套树改变时
    changeaccountTree (type, obj) {
      this.form.account = obj.value
    },
    // 单位树改变时
    changeunitTree (type,obj) {
      this.getAccount(obj.value)
      this.form.unit = obj.value
    },
    // 获取角色
    getRole () {
      //
    },
    // 获取单位
    getUnit () {
      let param = {
          rgCode: this.pfData.svRgCode,  // 区划
          setYear: this.pfData.svSetYear, // 年度
      }
      this.$axios.get('/ma/sys/eleAgency/getAgencyTree',{
          params: param
      })
        .then((result) => {
          if (result.data.flag === 'success') {
            this.unittreeData = result.data.data
            this.getAccount(this.pfData.svAgencyCode)
          } else {
            this.unittreeData = []
            throw result.data.msg
          }
        })
        .catch(this.$showError)
    },
    // 获取账套 /ma/sys/common/getEleTree
    getAccount (agencyCode) {
      let param = {
          // rgCode: this.pfData.svRgCode,           // 区划
          // setYear: this.pfData.svSetYear,         // 年度
          // agencyCode: agencyCode,                 // 根据单位去查询账套
          // eleCode:'ACCS'                          // 辅助项编码
          userId: this.pfData.svUserId,
          agencyCode: agencyCode,
          roleId: this.pfData.svRoleId,
          rgCode: this.pfData.svRgCode,
          nd:this.pfData.svSetYear
      }
      this.$axios.get('/pf/portal/getAccountDataByRight.do',{
          params: param
      })
        .then((result) => {
          if (result.data.length==0) {
            this.form.account = ''
            this.$message.warning('该单位下账套为空');
            return
          }
          this.accounttreeData = result.data || []
          this.accounttreeData.forEach((item,index) => {
            item.CHR_NAME =  item.CHR_CODE +' '+ item.CHR_NAME
          })
          // if (result.data.flag === 'success') {
          //   this.accounttreeData = result.data
            if(this.form.account == '*' || this.form.account == '') {
              if(result.data[0].CHR_CODE) {
                this.form.account = result.data[0].CHR_CODE
              } else {
                this.form.account = ''
              }
            }
          // } else {
          //   this.accounttreeData = []
          //   throw result.data.msg
          // }
        })
        .catch(this.$showError)
    }
  }
}
</script>
<style lang="scss" scoped>
.mr-200{
  margin-right:224px;
}
.buttonBox{
    margin-top:10px;
    margin-bottom:10px;
}
.header-wrap {
  position: relative;
  border-bottom: 1px solid #dfe6ec;
  height: 46px;
  .title-wrap {
    float: left;
    width: 582px;
    display: flex;
    align-items: center;
  }
  .caption {
    display: inline-block;
    font-size: 18px;
    line-height: 18px;
    padding: 13px 0 11px 0;
    border-bottom: 3px solid #108ee9;
    .title {
      font-size: 16px;
      color: #2f353b;
      font-weight: 400;
    }
  }
}
.initDataTable .initButton:active, .initDataTable .initButton:hover {
    text-decoration: none;
    outline: 0;
    color: #69c0ff;
}
.initDataTable .initButton{
    text-decoration: underline;
    color: #333;
}
.allSetting{
  width:400px;
  margin:25px auto;
  margin-left:100px;
}
.allSetting .lebal,.allSetting .item{
  float: left;
}
.wrapDiv{
  margin-top:20px;
}
.allSetting .lebal{
  width: 50px;
  height: 30px;
  line-height: 30px;
}
.clear_fix::after{ content: ''; display: block; clear: both;height:0; }
</style>
<style lang="scss">
.allSetting .ant-input, .allSetting .ant-select{
  font-size:14px;
}
.allSetting .rptTreeSearchWrap{
  padding: 5px 20px 5px 7px;
}
</style>