<!--
 * @Author: sunch
 * @Date: 2020-06-22 10:46:30
 * @LastEditTime: 2020-08-21 11:23:35
 * @LastEditors: Please set LastEditors
 * @Description: 月份选择
 * @FilePath: /agla-fe-8.50/vuedev/src/views/gl/rpt/components/RptQueryArea.vue
-->
<template>
  <ufQueryArea class="mt-10">
    <div class="queryWrap">
      <div class="queryRow">
        <div class="qryItemsWrap">
          <div class="qryLabel">对账期间：</div>
            <a-month-picker 
            :value="dateMonth" 
            :defaultValue="defaultValue" 
            :locale="zh_CN"
            :allowClear="false"
            @change="onDateChange"
            placeholder="选择月份"></a-month-picker>
          </div>
      </div>
      <div class="btnsWrap">
        <slot name="btns"></slot>
      </div>
    </div>
  </ufQueryArea>
</template>
<script>
import zh_CN from "ant-design-vue/es/date-picker/locale/zh_CN";
import moment from "moment";
import { mapState, mapActions } from "vuex";
export default {
  name: "RptQueryAreaglRptAssetRc", // 与资产对账
  data() {
    return {
      zh_CN,
      moment,
      defaultValue: moment(new Date(),"YYYY-MM"), // 时间默认值
      dateMonth: '',
      selectMonth: ''
    };
  },
  computed: {
    ...mapState({
      pfData: (state) => state.pfData, // 全局的commonData 用户当前登陆公共信息
      prjContent: (state) => state.glRptJournal.prjContent,
    }),
  },
  created() {
    // this.defaultValue = moment().format("YYYY-MM")
  },
  mounted() {
  },
  watch: {
  },
  methods: {
    /**
     * @description: 选择月份
     */
    onDateChange(date, dateString) {
      let year = new Date(dateString).getFullYear()
      let month = new Date(dateString).getMonth() + 1
      this.dateMonth = moment(dateString,"YYYY-MM");
    //  this.selectMonth = moment(dateString).format("YYYY/MM");
     // console.log(new Date(dateString).getMonth())
     this.$emit("changeQueryData", year, month)
    }
  },
};
</script>
<style lang="scss" scoped>
@import "@/assets/styles/variable.scss";
.queryRow,
.queryMoreRow {
  display: flex;
  align-items: center;
}
.queryWrap {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.qryItemsWrap {
  display: flex;
  align-items: center;
}
.qryLabel {
  color: #333;
  width: 75px;
  text-align: right;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.qryLabelMore {
  width: 75px;
  // text-align: right;
}
.moreBtn {
  display: flex;
  align-items: center;
  color: $uf-link-color;
  cursor: pointer;
  margin-left: auto;
}
.btnsWrap {
  float: right;
  width: 80%;
  height: 100%;
  display: flex;
  align-items: center;
}
.moreDown {
  transition: all 0.3s ease;
  margin-left: 2px;
}
.moreTop {
  transform: rotate(180deg);
}
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
