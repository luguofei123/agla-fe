<!--
 * @Author: your name
 * @Date: 2020-06-02 11:31:24
 * @LastEditTime: 2020-07-31 15:49:42
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /agla-fe-8.50/vuedev/src/views/prs/mySalaryMobile/otherIncome.vue
-->
<template>
  <div class="main" ref="main">
    <MintHeader ref="MintHeader" type="detail" :title="otherName"> </MintHeader>
    <div ref="sum" class="detailSumWrap">
      <div class="detailSum">
        <div class="sumAmount">{{otherValue}}</div>
        <div class="sumType">实发合计</div>
      </div>
    </div>
    <div ref="others" class="others" :style="{ height: otherH + 'px' }">
      <OtherGroup v-for="(item, index) in otherList" :key="index" :group="item"></OtherGroup>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import MintHeader from './components/MintHeader'
import OtherGroup from './components/OtherGroup'
import { formatMoney } from '@/assets/js/util' //金额格式化
export default {
  data() {
    return {
      otherList: [],
      otherH: 0,
      otherValue: '',
      otherName: ''
    }
  },
  created(){
    let param = this.$route.query
    this.year = param.year
    this.mo = param.mo
    this.prsItemCode = param.prsItemCode
    this.otherName = param.name
    this.otherValue = param.value
    this.$axios.post('/prs/prspersional/opaSalaryDetailData', {tokenid: this.tokenId, setYear: this.year, mo: this.mo, prsItemCode: this.prsItemCode}).then(result => {
      result.data.data.forEach(item => {
        if(item.amtDctax!=0){
          item.amtDctax = formatMoney(item.amtDctax)
        }
        if(item.amtShouldDist!=0){
          item.amtShouldDist = formatMoney(item.amtShouldDist)
        }
        if(item.amtRealDist!=0){
          item.amtRealDist = formatMoney(item.amtRealDist)
        }
      })
      this.otherList = result.data.data
    }).catch(error=>{
      this.$MessageBox({ title: '提示', message: error, confirmButtonClass: 'messageBoxBtn' })
    })
  },
  computed: {
    ...mapState({
      tokenId: (state) => state.tokenId,
    }),
  },
  mounted() {
    let mainEl = this.$refs.main,
      headerEl = this.$refs.MintHeader.$el,
      sumEl = this.$refs.sum
    this.otherH = $(mainEl).outerHeight() - $(headerEl).outerHeight() - $(sumEl).outerHeight()
  },
  components: {
    MintHeader,
    OtherGroup,
  },
}
</script>
<style>
.main {
  position: absolute;
  width: 100%;
  height: 100%;
  background: #f1f3f6;
}

.detailSumWrap {
  padding: 0.2rem;
  background-color: #fff;
}
.detailSum {
  height: 1.74rem;
  box-sizing: border-box;
  padding: 0.3rem;
  border-radius: 0.1rem;
  background-color: #dbebff;
}
.sumAmount {
  font-size: 24px;
  font-weight: 500;
  color: #0099ff;
  line-height: 29px;
  text-align: center;
}
.sumType {
  font-size: 14px;
  font-weight: 500;
  color: #666666;
  line-height: 20px;
  margin-top: 0.16rem;
  text-align: center;
}
.others {
  padding: 0.2rem 0.2rem 0 0.2rem;
  overflow-y: auto;
  box-sizing: border-box;
}
</style>
