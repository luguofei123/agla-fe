<!--
 * @Author: sunch
 * @Date: 2020-07-22 10:58:43
 * @LastEditTime: 2020-07-23 11:20:40
 * @LastEditors: Please set LastEditors
 * @Description: 模板日期范围选择器
 * @FilePath: /agla-fe-8.50/vuedev/src/views/prs/basicData/empPrsType/components/templates/TplDateRanger.vue
-->
<template>
  <a-range-picker class="form-ele" allowClear :locale="zh_CN" :value="dateRange" @change="onDateChange">
    <!-- 日历图标 待更换 -->
    <!-- <template v-slot:suffixIcon>
      <a-icon type="calendar" style="color: #666" />
    </template> -->
    <!-- 头部插槽部分 是由页脚插槽改变样式而来 -->
    <template v-slot:renderExtraFooter>
      <div style="width: 100%;">
        <!-- 放预设范围按钮 -->
        <div class="datePickerBtns">
          <button class="dateBtn" :class="period === 'dateBn' ? 'active' : ''" @click="period = 'dateBn'">本年</button>
          <button class="dateBtn" :class="period === 'dateBq' ? 'active' : ''" @click="period = 'dateBq'">本期</button>
          <button class="dateBtn" :class="period === 'dateBr' ? 'active' : ''" @click="period = 'dateBr'">本日</button>
        </div>
        <!-- 显示选择的时间范围 -->
        <div class="showDateTime">
          <div>开始时间：{{ dateBegin }}</div>
          <div class="ml-40">结束时间：{{ dateEnd }}</div>
        </div>
      </div>
    </template>
  </a-range-picker>
</template>
<script>
import { mapState } from 'vuex'
import zh_CN from 'ant-design-vue/es/date-picker/locale/zh_CN'
import moment from 'moment'
export default {
  name: 'tpl-date-ranger',
  props: ['data'],
  data() {
    return {
      zh_CN,
      moment,
      period: 'dateBn', //期间按钮标记
      setYear: '', //系统年度
      dateBegin: '',//显示的时间起始
      dateEnd: '',//显示的时间终止
      dateObj: null, //当前时间对象
      MM: '', //当前月份
      dateRange: ['', ''],
    }
  },
  computed: {
    ...mapState({
      pfData: (state) => state.pfData, // 全局的commonData 用户当前登陆公共信息
    }),
  },
  created() {
    this.dateObj = new Date()
    let m = this.dateObj.getMonth() + 1
    if(m < 10){
      m = '0' + m
    }
    this.MM = m
    this.setYear = this.pfData.svSetYear
    // this.dateRange = [moment(this.setYear + '-01-01', 'YYYY-MM-DD'), moment(this.setYear + '-12-31', 'YYYY-MM-DD')]
    this.dateRange = ['', '']
    this.dateBegin = this.setYear + '/01/01'
    this.dateEnd = this.setYear + '/12/31'
  },
  watch: {
    period(val) {
      if (this.setYear && this.dateObj) {
        switch (val) {
          case 'dateBn':
            this.dateRange = [moment(this.setYear + '-01-01', 'YYYY-MM-DD'), moment(this.setYear + '-12-31', 'YYYY-MM-DD')]
            this.dateBegin = this.setYear + '/01/01'
            this.dateEnd = this.setYear + '/12/31'
            break
          case 'dateBq':
            let new_date = new Date(this.setYear, this.MM, 1),
              endDay = new Date(new_date.getTime() - 1000 * 60 * 60 * 24).getDate()
            this.dateRange = [moment(`${this.setYear}-${this.MM}-01`, 'YYYY-MM-DD'), moment(`${this.setYear}-${this.MM}-${endDay}`, 'YYYY-MM-DD')]
            this.dateBegin = `${this.setYear}/${this.MM}/01`
            this.dateEnd = `${this.setYear}/${this.MM}/${endDay}`
            break
          case 'dateBr':
            let DD = this.dateObj.getDate()
            this.dateRange = [moment(`${this.setYear}-${this.MM}-${DD}`, 'YYYY-MM-DD'), moment(`${this.setYear}-${this.MM}-${DD}`, 'YYYY-MM-DD')]
            this.dateBegin = `${this.setYear}/${this.MM}/${DD}`
            this.dateEnd = this.dateBegin
            break
        }
      } else {
        this.$message.error('未查询到财务系统年份：setYear')
      }
    }
  },
  methods: {
    onDateChange(date, dateString) {
      this.dateRange = date
      console.log(dateString)
      this.dateBegin = dateString[0].split('-').join('/')
      this.dateEnd = dateString[1].split('-').join('/')
      this.$emit('change', { value: dateString, ...this.data })
    },
  },
}
</script>
<style>
.ant-calendar-panel{
  padding-top: 80px;
}
.ant-calendar-footer {
  padding: 0;
  line-height: 79px;
  border-top: 0;
  border-bottom: 1px solid #e8e8e8;
  position: absolute;
  height: auto;
  top: 0;
  left: 0;
  right: 0;
}
.ant-calendar-range .ant-calendar-input-wrap{
  display: none;
}
/*sunch 2020-06-28 修改range-picker头部样式*/
.ant-calendar-footer-extra{
  width: 100%;
}
.ant-calendar-picker-input{
  padding: 4px;
}
.ant-calendar-picker-icon{
  right: 6px;
}
</style>
<style lang="scss" scoped>
.datePickerBtns {
  display: flex;
  padding: 8px 20px 6px 20px;
  border-bottom: 1px solid #e8e8e8;
}
.dateBtn {
  width: 44px;
  height: 26px;
  background: #ecf6fd;
  border-radius: 4px;
  font-size: 12px;
  color: #108ee9;
  line-height: 26px;
  border: 0;
  margin-right: 8px;
  outline: none;
  cursor: pointer;
}
.active {
  background: #108ee9;
  color: #fff;
}
.showDateTime {
  display: flex;
  justify-content: space-between;
  padding: 8px 20px;
}
.showDateTime div {
  width: 50%;
  display: inline-block;
  line-height: 22px;
  color: #666;
  text-align: left;
}
.ml-40 {
  margin-left: 40px;
}
</style>
