<!--
 * @Author: sunch
 * @Date: 2020-06-22 10:46:30
 * @LastEditTime: 2020-09-30 10:50:52
 * @LastEditors: Please set LastEditors
 * @Description: 查询区域 处理日期以及辅助项的取值与回写
 * @FilePath: /agla-fe-8.50/vuedev/src/views/gl/rpt/components/RptQueryArea.vue
-->
<template>
  <ufQueryArea class="mt-10">
    <div class="queryWrap" ref="queryWrap">
      <div class="queryRow">
        <div class="qryItemsWrap">
          <div class="qryLabel" :class="showMoreQryItems ? 'qryLabelMore' : ''">日期：</div>
          <a-range-picker
            :allowClear="false"
            :locale="zh_CN"
            :value="dateRange"
            @change="onDateChange"
            :open="isOpen"
            @openChange="onOpenChange"
            style="width: 220px;"
          >
            <!-- 日历图标 待更换 -->
            <template v-slot:suffixIcon>
              <!-- <a-icon type="calendar" style="color: #666" /> -->
              <span class="icon-calendar"></span>
            </template>
            <!-- 头部插槽部分 是由页脚插槽改变样式而来 -->
            <template v-slot:renderExtraFooter>
              <div style="width: 100%;">
                <!-- 放预设范围按钮 -->
                <div class="datePickerBtns">
                  <button
                    class="dateBtn"
                    :class="curDatePeriod === 'dateBn' ? 'active' : ''"
                    @click="period('dateBn')"
                  >本年</button>
                  <button
                    class="dateBtn"
                    :class="curDatePeriod === 'dateBq' ? 'active' : ''"
                    @click="period('dateBq')"
                  >本期</button>
                  <button
                    class="dateBtn"
                    :class="curDatePeriod === 'dateBr' ? 'active' : ''"
                    @click="period('dateBr')"
                  >本日</button>
                </div>
                <!-- 显示选择的时间范围 -->
                <div class="showDateTime">
                  <div>开始时间：{{dateBegin}}</div>
                  <div class="ml-40">结束时间：{{dateEnd}}</div>
                </div>
              </div>
            </template>
          </a-range-picker>
        </div>
        <div v-for="i in firstLineNum" :key="i">
          <div class="qryItemsWrap ml-10" v-if="qryItemData && qryItemData.length > i - 1">
            <div
              class="qryLabel"
              :class="showMoreQryItems ? 'qryLabelMore' : ''"
              :title="qryItemData[i - 1].itemTypeName"
            >{{ qryItemData[i - 1].itemTypeName + '：' }}</div>
            <RptTreeSelect
              :treeData="qryItemData[i - 1].items"
              :itemType="qryItemData[i - 1].itemType"
              :value="qrySelectItemData[qryItemData[i - 1].itemType]"
              @change="change(qryItemData[i - 1].itemType, arguments[0])"
              :treeCheckable="checkable"
            ></RptTreeSelect>
          </div>
        </div>
      </div>
      <div v-if="showMore" class="mr-10 moreBtn" @click="onClickMore">
        更多
        <!-- <a-icon class="moreDown" /> -->
        <i class="glyphicon icon-angle-bottom" :class="{ moreTop: showMoreQryItems }" type="down"></i>
      </div>
      <div class="btnsWrap">
        <slot name="btns"></slot>
      </div>
    </div>
    <div v-show="showMoreQryItems" class="queryMore">
      <div class="queryMoreRow mt-10" v-for="index in moreQryItemsLength" :key="index">
        <div
          class="qryItemsWrap"
          :class="ind > 0 ? 'ml-10' : ''"
          v-for="(item, ind) in moreQryItems(index)"
          :key="item.itemType"
        >
          <div
            class="qryLabel qryLabelMore"
            :title="item.itemTypeName"
          >{{ item.itemTypeName + '：' }}</div>
          <RptTreeSelect
            :treeData="item.items"
            :itemType="item.itemType"
            :value="qrySelectItemData[item.itemType]"
            @change="change(item.itemType, arguments[0])"
            :treeCheckable="checkable"
          ></RptTreeSelect>
        </div>
      </div>
    </div>
  </ufQueryArea>
</template>
<script>
import zh_CN from "ant-design-vue/es/date-picker/locale/zh_CN";
import moment from "moment";
import { mapState, mapActions } from "vuex";
import RptTreeSelect from "./RptTreeSelect";
import store from "@/store/index";
let rptName = store.state.rpt.rptName;
const checkableList = ["glRptBal"];

export default {
  name: "RptQueryArea", // 明细账
  data() {
    return {
      zh_CN,
      moment,
      showMore: false, //是否显示更多按钮
      showMoreQryItems: false, //是否展开“更多”按钮
      setYear: "", //系统年度
      dateBegin: "", //显示的时间起始
      dateEnd: "", //显示的时间终止
      dateObj: null, //当前时间对象
      MM: "", //当前月份
      dateRange: [
        moment("2020-06-06", "YYYY-MM-DD"),
        moment("2020-06-06", "YYYY-MM-DD"),
      ],
      curDatePeriod: "dateBn", //期间按钮标记
      isOpen: false,
      checkYear: "",
      selectDate: null,
      firstLineNum: 2, // 查询区域项目列数
    };
  },
  components: {
    RptTreeSelect,
  },
  computed: {
    ...mapState({
      pfData: (state) => state.pfData, // 全局的commonData 用户当前登陆公共信息
      containerH: (state) => state.containerH, //容器高度
      qryItemData: (state) => { 
        return state[rptName].qryItemData.filter((item) => {
          return item.isShowItem === "0";
        })
      },
      qrySelectItemData: (state) => { 
        console.log(state[rptName].qrySelectItemData)
        return state[rptName].qrySelectItemData 
      },
      prjContent: (state) => state[rptName].prjContent,
      fromRmisFlag: (state) => state[rptName].fromRmisFlag,
      frStartDate: (state) => state[rptName].frStartDate,
      frEndDate: (state) => state[rptName].frEndDate,
      pageType: (state) => state.rpt.rptName,
    }),
    moreQryItemsLength() {
      if (this.qryItemData && this.qryItemData.length > this.firstLineNum) {
        if (this.qryItemData.length < (this.firstLineNum + 1) * 2) {
          return 1;
        } else {
          return Math.ceil(
            (this.qryItemData.length - 2) / (this.firstLineNum + 1)
          );
        }
      } else {
        return 0;
      }
    },
    checkable() {
      if (this.pageType) {
        return checkableList.some((item) => {
          return this.pageType === item;
        });
      } else {
        return false;
      }
    },
  },
  created() {
    this.dateObj = new Date();
    let m = this.dateObj.getMonth() + 1;
    if (m < 10) {
      m = "0" + m;
    }
    this.MM = m;
    if (this.$route.query.dataFrom) {
      let dataFrom = this.$route.query.dataFrom;
      let optParams = JSON.parse(
        localStorage.getItem(`from_${dataFrom}Params`)
      );
      let optPrjContent = optParams.prjContent;
      this.setStartDate(optPrjContent.startDate + "-01");
      this.setEndDate(
        moment(optPrjContent.endDate, "YYYY-MM-DD")
          .endOf("month")
          .format("YYYY-MM-DD")
      );
      this.setStartYear(optPrjContent.startYear);
      this.setEndYear(optPrjContent.endYear);
      this.setStartFisperd(optPrjContent.startFisperd);
      this.setEndFisperd(optPrjContent.endFisperd);
      this.dateRange = [
        moment(optPrjContent.startDate + "-01", "YYYY-MM-DD"),
        moment(optPrjContent.endDate, "YYYY-MM-DD").endOf("month"),
      ];
      this.dateBegin = optPrjContent.startDate.split("-").join("/");
      this.dateEnd = optPrjContent.endDate.split("-").join("/");
    } else {
      this.setYear = this.pfData.svSetYear;
      this.dateRange = [
        moment(this.setYear + "-01-01", "YYYY-MM-DD"),
        moment(this.setYear + "-12-31", "YYYY-MM-DD"),
      ];
      this.dateBegin = this.setYear + "/01/01";
      this.dateEnd = this.setYear + "/12/31";
      this.setStartDate(this.setYear + "-01-01");
      this.setEndDate(this.setYear + "-12-31");
      this.setStartYear(this.setYear);
      this.setEndYear(this.setYear);
      this.setStartFisperd(1);
      this.setEndFisperd(12);
    }
  },
  mounted() {
    let offsetWidth = this.$refs.queryWrap.offsetWidth - 60;
    let num = Math.ceil(offsetWidth / 330) - 1;
    this.firstLineNum = num - 1; // 根据div宽度动态设置查询区域项目列数

    if (this.qryItemData && this.qryItemData.length > 2) {
      this.showMore = true;
    }
  },
  watch: {
    fromRmisFlag(flag) {
      if (flag) {
        this.dateRange = [
          moment(this.frStartDate, "YYYY-MM-DD"),
          moment(this.frEndDate, "YYYY-MM-DD"),
        ];
      }
    },
    qryItemData(items) {
      if (items && items.length > 2) {
        this.showMore = true;
        if (this.showMoreQryItems) {
          let h = this.containerH - 206 - this.moreQryItemsLength * 40;
          h <= 0 ? (h = 0) : h;
          this.setTableH(h);
        } else {
          this.setTableH(this.containerH - 206);
        }
      }
    },
    dateRange(arr) {
      if (arr !== null) {
        let startDate = arr[0].format("YYYY-MM-DD"),
          endDate = arr[1].format("YYYY-MM-DD");
        this.setStartDate(startDate);
        this.setEndDate(endDate);
        this.setStartYear(arr[0].year());
        this.setEndYear(arr[1].year());
        this.setStartFisperd(arr[0].month() + 1);
        this.setEndFisperd(arr[1].month() + 1);
      }
    },
  },
  methods: {
    ...mapActions([
      "setTableH",
      "setQrySelectItemData",
      "setStartDate",
      "setEndDate",
      "setStartYear",
      "setEndYear",
      "setStartFisperd",
      "setEndFisperd",
      "setSelectedAccoNames",
      // "setSelectedData", //设置回写的辅助查询项的文本框的默认值
    ]),
    /**
     * @description: 本年、本期、本日点击事件
     */
    period(val) {
      if (this.setYear && this.dateObj) {
        let fisperd = this.dateObj.getMonth() + 1;
        // let fisperd = this.MM.substring(1, this.MM.length);
        switch (val) {
          case "dateBn":
            this.dateRange = [
              moment(this.setYear + "-01-01", "YYYY-MM-DD"),
              moment(this.setYear + "-12-31", "YYYY-MM-DD"),
            ];
            this.dateBegin = this.setYear + "/01/01";
            this.dateEnd = this.setYear + "/12/31";
            this.curDatePeriod = "dateBn";
            this.setStartDate(this.setYear + "-01-01");
            this.setEndDate(this.setYear + "-12-31");
            // this.setStartYear(this.setYear);
            // this.setEndYear(this.setYear);
            // this.setStartFisperd(1);
            // this.setEndFisperd(12);
            break;
          case "dateBq":
            let new_date = new Date(this.setYear, this.MM, 1),
              endDay = new Date(
                new_date.getTime() - 1000 * 60 * 60 * 24
              ).getDate();
            this.dateRange = [
              moment(`${this.setYear}-${this.MM}-01`, "YYYY-MM-DD"),
              moment(`${this.setYear}-${this.MM}-${endDay}`, "YYYY-MM-DD"),
            ];
            this.dateBegin = `${this.setYear}/${this.MM}/01`;
            this.dateEnd = `${this.setYear}/${this.MM}/${endDay}`;
            this.curDatePeriod = "dateBq";
            this.setStartDate(`${this.setYear}-${this.MM}-01`);
            this.setEndDate(`${this.setYear}-${this.MM}-${endDay}`);
            break;
          case "dateBr":
            let DD = this.dateObj.getDate();
            this.dateRange = [
              moment(`${this.setYear}-${this.MM}-${DD}`, "YYYY-MM-DD"),
              moment(`${this.setYear}-${this.MM}-${DD}`, "YYYY-MM-DD"),
            ];
            this.dateBegin = `${this.setYear}/${this.MM}/${DD}`;
            this.dateEnd = this.dateBegin;
            this.curDatePeriod = "dateBr";
            this.setStartDate(`${this.setYear}-${this.MM}-${DD}`);
            this.setEndDate(this.dateBegin);
            break;
        }
      } else {
        this.$message.error("未查询到财务系统年份：setYear");
      }
    },
    /**
     * @description: 日期
     */
    onDateChange(date, dateString) {
      if (date[0].year() !== date[1].year()) {
        date[1] = null;
        this.dateRange = null;
        this.onOpenChange(true);
        this.$message.error("请选择一个年度内的日期查询");
      } else {
        this.dateRange = date;
        this.setStartDate(dateString[0]);
        this.setEndDate(dateString[1]);
        this.setStartYear(date[0].year());
        this.setEndYear(date[1].year());
        this.setStartFisperd(date[0].month() + 1);
        this.setEndFisperd(date[1].month() + 1);
        this.dateBegin = dateString[0].split("-").join("/");
        this.dateEnd = dateString[1].split("-").join("/");
      }
    },
    onOpenChange(status) {
      this.isOpen = status;
    },
    /**
     * @description: 可选日期范围,不允许跨年
     */
    disabledDate(current) {
      if (this.selectDate) {
        return this.selectDate.year() !== current.year();
      }
      return false;
    },
    /**
     * @description: 待选日期发生变化时的回调   暂时改成了提示用户不能选择跨年查询
     */
    onCalendarChange(date, dateString) {
      this.selectDate = date[0] && !date[1] ? date[0] : null;
    },
    /**
     * @description: 点击更多 如果没有超过两个的辅助项不显示更多按钮
     */
    onClickMore() {
      this.showMoreQryItems = !this.showMoreQryItems;
      if (this.showMoreQryItems) {
        let h = this.containerH - 206 - this.moreQryItemsLength * 40;
        h <= 0 ? (h = 0) : h;
        this.setTableH(h);
      } else {
        this.setTableH(this.containerH - 206);
      }
    },
    moreQryItems(index) {
      let ind1 = index * (this.firstLineNum + 1) - 1,
        ind2 = index * (this.firstLineNum + 1) + this.firstLineNum,
        moreQryItems = this.qryItemData.slice(ind1, ind2);
      return moreQryItems;
    },
    qryItemsChange(type, val) {
      this.setQrySelectItemData({ itemType: type, code: val });
    },
    /**
     * @description: 点击辅助项中的某一项
     */
    change(type, obj) {
      if (type === "ACCO") {
        this.setSelectedAccoNames(obj.title);
      }
      this.setQrySelectItemData({ itemType: type, code: obj.value });
    },
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
  width: 98px;
  text-align: right;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.qryLabelMore {
  width: 98px;
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
  width: 60px;
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
/* /deep/ .ant-calendar-picker-container {
  top: 45px !important;
} */
</style>
