<!--
 * @Author: your name
 * @Date: 2020-06-02 11:29:47
 * @LastEditTime: 2020-08-04 17:38:58
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /agla-fe-8.50/vuedev/src/views/prs/mySalaryMobile/mySalaryMobile.vue
-->
<template>
  <div class="main" ref="main">
    <MintHeader ref="MintHeader" type="list" :title="'我的工资'" :backToApp="true">
      <template v-slot:btn>
        <a class="export" href="javascript:;" @click="exportSalary"><img src="../../../assets/imgs/download.png" alt=""/></a>
      </template>
    </MintHeader>
    <MintTab ref="MintTab" :tabList="years" @clickTab="onTabClick"></MintTab>
    <div class="sumWrap" ref="sumWrap">
      <div class="sumbg">
        <div class="sumLeft" :class="{ pl60: !sumOverflow }">
          <div class="sum">{{yfSum}}</div>
          <div class="stype">应发合计</div>
        </div>
        <div class="sumRight">
          <div class="sum">{{sfSum}}</div>
          <div class="stype">实发合计</div>
        </div>
      </div>
    </div>
    <div class="salarylist" ref="salarylist" :style="{ height: salaryH + 'px' }">
      <SalaryItem v-for="(item, index) in salaryList" :year="setYear" :key="index" :item="item" @clickSalaryItem="linkToSalaryDetail(item.mo)"></SalaryItem>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import MintHeader from './components/MintHeader'
import MintTab from './components/MintTab'
import SalaryItem from './components/SalaryItem'
import { formatMoney } from '@/assets/js/util' //金额格式化
const baseUrl = 'http://10.16.21.57:9200'

export default {
  data() {
    return {
      sumOverflow: false, //超过99万相当于总数溢出
      years: [],//年列表
      setYear: '',//当前年度
      salaryH: 0,
      salaryList: [],//数据列表
      sfSum: 0,//实发合计
      yfSum: 0,//应发合计
      agencyCode: '',
      empName: '',
      rgCode: '',
    }
  },
  computed: {
    ...mapState({
      tokenId: (state) => state.tokenId,
    }),
  },
  created() {
    //处理年的tab 当前年前推5年
    let curYear = new Date().getFullYear()
    this.setYear = String(curYear)
    for (let i = curYear; i > curYear - 5; i--) {
      this.years.push(String(i))
    }
    this.getSalaryData()
  },
  mounted() {
    let mainEl = this.$refs.main,
      headerEl = this.$refs.MintHeader.$el,
      tabEl = this.$refs.MintTab.$el,
      sumWrapEl = this.$refs.sumWrap
    //计算列表容器高度
    this.salaryH = $(mainEl).outerHeight() - $(headerEl).outerHeight() - $(tabEl).outerHeight() - $(sumWrapEl).outerHeight()
  },
  components: {
    MintHeader,
    MintTab,
    SalaryItem,
  },
  methods: {
    /**
     * @description: 获取工资数据
     */
    getSalaryData() {
      if (this.tokenId) {
        this.$axios
          .post('/prs/prspersional/mySalaryData', {
            tokenid: this.tokenId,
            setYear: this.setYear,
          })
          .then((result) => {
            if (result.data.flag != 'fail') {
              let res = result.data.data
              this.rmwyid = res.rmwyid
              this.agencyCode = res.agencyCode
              this.empName = res.name
              this.rgCode = res.rgCode
              this.yfSum = res.shoudCombined==0?0:formatMoney(res.shoudCombined)
              this.sfSum = res.netCombined==0?0:formatMoney(res.netCombined)
              res.salaryList.forEach(item =>{
                if(item.shoudCombined!=0){
                  item.shoudCombined = formatMoney(item.shoudCombined)
                }
                if(item.netCombined!=0){
                  item.netCombined = formatMoney(item.netCombined)
                }
              })
              this.salaryList = res.salaryList
            } else {
              throw result.data.msg
            }
          })
          .catch((error) => {
            console.log(error)
            if (error) {
              this.$MessageBox({title: '提示', message: error, confirmButtonClass: 'messageBoxBtn'});
            }
          })
      }else{
        this.$MessageBox({title: '提示', message: '未获取到tokenid', confirmButtonClass: 'messageBoxBtn'});
      }
    },
    /**
     * @description: 点击tab的年
     */
    onTabClick(item) {
      console.log(item.item)
      this.setYear = item.item
      this.getSalaryData()
    },
    /**
     * @description: 跳转到详情
     */
    linkToSalaryDetail(mo) {
      this.$router.push({ name: 'salaryDetailMobile', query: { tokenid: this.tokenId, rmwyid: this.rmwyid, mo: mo, year: this.setYear } })
    },
    /**
     * @description: 导出并下载excel
     */
    exportSalary(){
      this.$axios.post('/prs/prspersional/exportSalaryData',{
        tokenid: this.tokenId,
        setYear: this.setYear,
      }).then(result => {
        console.log(result)
        if(result.data.flag!='fail'){
          window.location.href = '/pub/file/download?fileName=' + result.data.data.fileName + '&attachGuid=' + result.data.data.attachGuid
        }else{
          this.$MessageBox({title: '提示', message: result.data.msg, confirmButtonClass: 'messageBoxBtn'});
        }
      })
    }
  },
}
</script>
<style lang="scss">
.main {
  position: absolute;
  width: 100%;
  height: 100%;
  background: #f1f3f6;
}
.export {
  display: block;
  width: 0.36rem;
  height: 0.36rem;
  margin-bottom: 0.04rem;
}
.export img {
  width: 100%;
  height: 100%;
}
.sumWrap {
  padding: 0.2rem;
}
.sumbg {
  width: 100%;
  height: 1.64rem;
  background: url(../../../assets/imgs/sumbg.png) no-repeat;
  background-size: 100% 100%;
  display: flex;
  justify-content: space-between;
}
.sumLeft,
.sumRight {
  width: 50%;
  height: 100%;
  box-sizing: border-box;
  padding: 0.24rem 0 0.3rem 0.3rem;
}
.sum {
  line-height: 0.48rem;
  font-size: 20px;
  font-weight: 500;
  color: #0099ff;
}
.stype {
  line-height: 0.4rem;
  margin-top: 0.16rem;
  font-size: 14px;
  font-weight: 500;
  color: #666;
}
.pl60 {
  padding-left: 0.6rem;
}
.salarylist {
  padding: 0 0.2rem;
  overflow-y: auto;
}
</style>
