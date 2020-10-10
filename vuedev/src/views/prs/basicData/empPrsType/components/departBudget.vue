<!--
 * @Author: sunch
 * @Date: 2020-07-18 16:33:18
 * @LastEditTime: 2020-08-12 14:06:46
 * @LastEditors: Please set LastEditors
 * @Description: 批量设置
 * @FilePath: /agla-fe-8.50/vuedev/src/views/prs/empPrsType/components/departBudget.vue
-->
<template>
  <uf-modal v-model="visible" @cancel="cancel" :width="500" :title="title">
    <div class="main">
      <div class="flex-start">
        <div class="label">工资类别：</div>
        <a-select class="form-select" v-model="prsType" allowClear>
          <a-select-option v-for="item in prsTypeCo" :key="item.prtypeCode" :value="item.prtypeCode" @click="prsTypeCoChange(item)">
            {{ item.prtypeName }}
          </a-select-option>
        </a-select>
        <div class="requireMark">*</div>
      </div>
      <div class="flex-start mt-10">
        <div class="label">银行代发文件格式：</div>
        <a-select class="form-select" allowClear v-model="bankAcc" @change="bankfileStyleChange">
          <a-select-option v-for="item in bankfileStyle" :key="item.prstylCode" :value="item.prstylCode">
            {{ item.prstylName }}
          </a-select-option>
        </a-select>
        <div class="requireMark">*</div>
      </div>
      <div class="flex-start mt-10">
        <div class="label">其他银行代发文件格式：</div>
        <a-select class="form-select" allowClear v-model="bankAccOther" @change="otherBankfileStyleChange">
          <a-select-option v-for="item in bankfileStyle" :key="item.prstylCode" :value="item.prstylCode">
            {{ item.prstylName }}
          </a-select-option>
        </a-select>
      </div>
    </div>
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
export default {
  props: ['value', 'rmwyidList'],
  data() {
    return {
      visible: false,
      title: '批量设置',
      prsTypeCo: [],
      bankfileStyle: [],
      mo: '',
      bankAcc: '',
      bankAccOther: '',
      prsType: '',
    }
  },
  created() {
    this.$axios.get('/prs/emp/prsType/selectMaEmpPrsTypeList?roleId=' + this.pfData.svRoleId).then((result) => {
      if (result.data.flag === 'success') {
        this.prsTypeCo = result.data.data[0].data.prsTypeCo
        this.bankfileStyle = result.data.data[0].data.bankfileStyle
      } else {
        throw result.data.msg
      }
    }).catch(this.$showError)
  },
  computed: {
    ...mapState({
      pfData: (state) => state.pfData,
    }),
  },
  watch: {
    value(val) {
      if (val) {
        this.visible = true
      }
    },
  },
  methods: {
    clear() {
      this.bankAcc = ''
      this.bankAccOther = ''
      this.mo = ''
      this.prsType = ''
    },
    saveClose() {
      if (!this.prsType) {
        this.$message.error('工资类别不能为空')
        return
      }
      if (!this.bankAcc) {
        this.$message.error('银行代发文件格式不能为空')
        return
      }
      this.$axios
        .post('/prs/emp/prsType/batchSetting?roleId=' + this.pfData.svRoleId, {
          bankAcc: this.bankAcc,
          bankAccOther: this.bankAccOther,
          mo: this.mo,
          prsType: this.prsType,
          rmwyidList: this.rmwyidList,
        })
        .then((result) => {
          if (result.data.flag === 'fail') {
            throw result.data.msg
          }
          this.cancel()
        })
        .catch((error) => {})
    },
    cancel() {
      this.clear()
      this.visible = false
      this.$emit('close')
    },
    prsTypeCoChange(item) {
      this.prsType = item.prtypeCode
      this.mo = item.mo
      // console.log(this.prsType, this.mo)
    },
    bankfileStyleChange(val) {
      this.bankAcc = val
    },
    otherBankfileStyleChange(val) {
      this.bankAccOther = val
    },
  },
}
</script>
<style lang="scss" scoped>
.main {
  height: 300px;
}
.label {
  width: 165px;
}
.form-select {
  width: 200px;
}
.requireMark {
  height: 18px;
  line-height: 22px;
  color: red;
  font-size: 18px;
  box-sizing: border-box;
  margin-left: 10px;
}
</style>
