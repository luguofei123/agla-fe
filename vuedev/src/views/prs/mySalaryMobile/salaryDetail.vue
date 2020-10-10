<!--
 * @Author: your name
 * @Date: 2020-06-02 11:30:49
 * @LastEditTime: 2020-09-11 09:50:06
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /agla-fe-8.50/vuedev/src/views/prs/mySalaryMobile/salaryDetail.vue
-->
<template>
  <div class="main" ref="main">
    <MintHeader ref="MintHeader" type="detail">
      <template v-slot:title>
        <div class="dateWrap" @click="popupVisible = true">
          <div class="date">{{ yearMonthStr }}</div>
          <a-icon type="caret-down" style="color:#333;font-size: 12px;margin-left: 0.12rem" />
        </div>
      </template>
    </MintHeader>

    <div ref="sum" class="detailSumWrap">
      <div class="detailSum">
        <div class="sumAmount">{{sfSum}}</div>
        <div class="sumType">实发合计</div>
      </div>
    </div>

    <div ref="detail" class="detail" :style="{ height: detailH + 'px' }">
      <div v-if="groupList.length > 0" class="groupList">
        <SalaryDetailGroup v-for="(item, index) in groupList" :group="item" :key="index"></SalaryDetailGroup>
      </div>

      <div class="detailList" v-if="otherList.length > 0">
        <div class="detailItem" v-for="(item,index) in otherList" :key="index" @click="linkToOthers(item)">
          <div class="itemLabel">{{item.title}}</div>
          <div class="itemValue">{{item.value}}<a-icon type="right" style="font-size: 14px;color: #c2c2c2;margin-left: .12rem;" /></div>
        </div>
      </div>

      <div class="detailList">
        <SalaryDetailItem :class="{ bb1: index < detailList.length - 1 }" v-for="(item, index) in detailList" :item="item" :key="index"></SalaryDetailItem>
      </div>
    </div>

    <mt-popup v-model="popupVisible" position="bottom" pop-transition="popup-fade" style="width: 100%">
      <div class="pickerHeader">
        <div class="pickerHeaderTitle">选择日期</div>
        <div class="btns">
          <div class="cancelBtn" @click="pickerCancel"><img src="../../../assets/imgs/cancel.png" alt="" /></div>
          <div class="confirmBtn" @click="pickerConfirm"><img src="../../../assets/imgs/confirm.png" alt="" /></div>
        </div>
      </div>
      <mt-picker :slots="slots" valueKey="label" :itemHeight="40" @change="onValuesChange"></mt-picker>
    </mt-popup>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import MintHeader from './components/MintHeader'
import SalaryDetailGroup from './components/SalaryDetailGroup'
import SalaryDetailItem from './components/SalaryDetailItem'
import { formatMoney } from '@/assets/js/util' //金额格式化
const baseUrl = 'http://10.16.21.57:9200'

export default {
  data() {
    return {
      detailH: 0,
      popupVisible: false,//控制显示picker
      yearMonthStr: '',//picker选中的年月
      slots: [
        {
          flex: 1,
          values: [
          ],
          className: 'slot1',
          textAlign: 'center',
        },
        {
          flex: 1,
          values: [
            { label: '1月', value: '1' },
            { label: '2月', value: '2' },
            { label: '3月', value: '3' },
            { label: '4月', value: '4' },
            { label: '5月', value: '5' },
            { label: '6月', value: '6' },
            { label: '7月', value: '7' },
            { label: '8月', value: '8' },
            { label: '9月', value: '9' },
            { label: '10月', value: '10' },
            { label: '11月', value: '11' },
            { label: '12月', value: '12' },
          ],
          textAlign: 'center',
        },
      ],//控制picker内显示内容
      groupList: [],//分组的数据集合
      detailList: [],//不分组的数据集合
      otherList: [],
      year: '',
      mo: '',
      //以下picker的暂存
      zyear: '',
      zmo: '',
      zyears: '',
      zmos: '',
      sfSum: 0
    }
  },
  computed: {
    ...mapState({
      tokenId: (state) => state.tokenId,
    }),
  },
  created() {
    //处理参数
    let param = this.$route.query
    this.year = param.year
    this.mo = param.mo
    this.yearMonthStr = this.year + '年' + this.mo + '月'
    //处理picker的年
    let curYear = new Date().getFullYear()
    for (let i = curYear; i > curYear - 5; i--) {
      this.slots[0].values.push({label: i + '年', value: String(i)})
    }
    //设置picker默认显示的年月
    this.slots[0].values.forEach((item, index) => {
      if (item.value === this.year) {
        this.slots[0].defaultIndex = index
      }
    })
    this.slots[1].values.forEach((item, index) => {
      if (item.value === this.mo) {
        this.slots[1].defaultIndex = index
      }
    })
    this.getSalaryDetailData()
  },
  mounted() {
    let mainEl = this.$refs.main,
      headerEl = this.$refs.MintHeader.$el,
      sumEl = this.$refs.sum
    this.detailH = $(mainEl).outerHeight() - $(headerEl).outerHeight() - $(sumEl).outerHeight()
  },
  methods: {
    /**
     * @description: 获取数据
     */
    getSalaryDetailData() {
      if (this.tokenId) {
        this.$axios
          .post('/prs/prspersional/selectSalaryDetailData', { tokenid: this.tokenId, setYear: this.year, mo: this.mo })
          .then((result) => {
            if (result.data.flag != 'fail') {
              // console.log(result.data.data)
              if(!result.data.data||_.isEmpty(result.data.data)){
                // console.log(this.mo+'月无工资数据')
                this.groupList = []
                this.detailList = []
                this.otherList = []
                //汇总也重置为空
                this.sfSum = 0
                return
              }
              let res = result.data.data,
                arr = [],
                list = []
              this.sfSum = res.netCombined.value==0?0:formatMoney(res.netCombined.value)
              res.detailList.forEach((item) => {
                if(item.value!=0){
                  item.value = formatMoney(item.value)
                }
                if (item.isGroup) {
                  item.list.forEach(it => {
                    if(it.value!=0){
                      it.value = formatMoney(it.value)
                    }
                  })
                  arr.push(item)
                } else {
                  list.push(item)
                }
              })
              this.groupList = arr
              this.detailList = list
              if(res.opaItemList&&res.opaItemList.length > 0){
                res.opaItemList.forEach(item => {
                  if(item.value!=0){
                    item.value = formatMoney(item.value)
                  }
                })
                this.otherList = res.opaItemList
              }
            } else {
              throw result.data.msg
            }
          })
          .catch((error) => {
            console.log(error)
            if (error) {
              this.$MessageBox({ title: '提示', message: error, confirmButtonClass: 'messageBoxBtn' })
            }
          })
      } else {
        this.$MessageBox({ title: '提示', message: '未获取到tokenid', confirmButtonClass: 'messageBoxBtn' })
      }
    },
    /**
     * @description: picker的选择改变
     */
    onValuesChange(picker, values) {
      console.log(values)
      this.zyear = values[0].value
      this.zmo = values[1].value
      this.zyears = values[0].label
      this.zmos = values[1].label
    },
    /**
     * @description: 跳转到其他
     */
    linkToOthers(item) {
      // let value = item.value.replace(',','')
      this.$router.push({ name: 'otherIncomeMobile', query: { tokenid: this.tokenId, year: this.year, mo: this.mo, prsItemCode: item.prsItemCode, value: item.value, name: item.title } })
    },
    /**
     * @description: picker关闭
     */
    pickerCancel() {
      this.popupVisible = false
    },
    /**
     * @description: picker确认选中的年月
     */
    pickerConfirm() {
      this.yearMonthStr = this.zyears + this.zmos
      this.year = this.zyear
      this.mo = this.zmo
      //查询数据
      this.getSalaryDetailData()
      this.popupVisible = false
    },
  },
  components: {
    MintHeader,
    SalaryDetailGroup,
    SalaryDetailItem,
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
.dateWrap {
  display: flex;
  align-items: center;
}
.date {
  color: #333;
  font-size: 18px;
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
.detail {
  overflow-y: auto;
  padding-top: 0.2rem;
  box-sizing: border-box;
}
.detailList {
  margin-bottom: 0.2rem;
  padding: 0 0.3rem;
  background-color: #fff;
}
.detailItem {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.25rem 0;
  box-sizing: border-box;
}
.itemLabel {
  color: #333;
  font-size: 15px;
  line-height: 0.3rem;
}
.itemValue {
  color: #333;
  font-size: 15px;
  line-height: 0.3rem;
}
.pickerHeader {
  background: #3596fa;
  padding: 0.2rem 0.3rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.pickerHeaderTitle {
  font-size: 15px;
  color: #fff;
}
.btns {
  display: flex;
  align-items: center;
}
.cancelBtn,
.confirmBtn {
  width: 0.36rem;
  height: 0.36rem;
  display: flex;
  justify-items: center;
  align-items: center;
  cursor: pointer;
}
.cancelBtn img,
.confirmBtn img {
  width: 100%;
  height: 100%;
}
.confirmBtn {
  margin-left: 0.4rem;
}
</style>
