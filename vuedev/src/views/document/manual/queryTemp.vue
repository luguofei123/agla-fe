<template>
  <div>
    <h3>旧版表格查询条件</h3>
    <!-- 查询条件开始 -->
    <div class="query-wrap">
      <a-row>
        <a-col :span="18">
          <a-form-item style="margin-bottom: 0;">
            <span style="color:#333;">期间：</span>
            <span class="font-btn" :class="index === currentIndex ? 'btn-active' : ''" @click="dateHandle(index, item.id)" v-for="(item, index) in dateList" :key="item.id">
              {{ item.period }}
            </span>
            <a-month-picker style="margin-left: 10px;" :value="moment(minOccurDate, dateFormat)" @change="onChangeStartMonth" placeholder="开始月份" />
            -
            <a-month-picker :value="moment(maxOccurDate, dateFormat)" @change="onChangeEndMonth" placeholder="结束月份" />
          </a-form-item>
        </a-col>
        <a-col :span="6" class="txt-r">
          <a-button class="mr-5 mt-5">查询方案设置</a-button>
          <a-button type="primary" class="mt-5">查询</a-button>
        </a-col>
      </a-row>
    </div>
    <!-- 查询条件结束 -->
    <div class="showSrcWrap">
      <a href="javascript:;" @click="showSource = !showSource">显示代码</a>
    </div>

    <pre v-if="showSource">
        <code>{{pagerText}}</code>
        <code>
        export default {
        }
        </code>
      </pre>
  </div>
</template>
<script>
import moment from 'moment'
export default {
  name: 'queryTemp',
  data() {
    return {
      currentIndex: 0,
      dateList: [
        {
          id: 'dateBq',
          period: '本期',
        },
        {
          id: 'dateBn',
          period: '本年',
        },
      ],
      dateFormat: 'YYYY-MM', // 日期格式
      minOccurDate: moment()
        .date(1)
        .format('YYYY-MM'), // 期间日期-起始
      maxOccurDate: moment()
        .endOf('month')
        .format('YYYY-MM'), // // 期间日期-结束
      showSource: false,
      pagerText: '<ufPager :pager-config="page" @page-change="handlePageChange"></ufPager>',
    }
  },
  methods: {
    moment,
    onChangeStartMonth(date, dateString) {
      this.minOccurDate = dateString
    },
    onChangeEndMonth(date, dateString) {
      this.maxOccurDate = dateString
    },
  },
}
</script>
<style scoped>
.query-wrap {
  background-color: #ecf6fd;
  padding: 15px;
  clear: both;
  border: 1px solid #d2eafb;
}
</style>
