<!--
 * @Author: your name
 * @Date: 2020-06-03 18:48:54
 * @LastEditTime: 2020-06-07 11:40:14
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /agla-fe-8.50/vuedev/src/views/prs/mySalaryMobile/components/SalaryItem.vue
-->
<template>
  <div class="item" @click="clickSalaryItem">
    <div class="itemHeader">
      <div class="itemTitle">{{ year + '年' + item.mo + '月' }}</div>
      <a href="javascript:;" class="itemLink">
        <img src="../../../../assets/imgs/arrow_right.png" alt="" />
      </a>
    </div>
    <div class="itemInner">
      <div class="itemLeft pl30">
        <div class="item-amount">{{ item.shoudCombined }}</div>
        <div class="item-type">应发工资</div>
      </div>
      <div class="itemRight pl30">
        <div class="item-amount">{{ item.netCombined }}</div>
        <div class="item-type">实发工资</div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'SalaryItem',
  props: ['item','year'],
  methods: {
    clickSalaryItem(){
      this.$emit('clickSalaryItem')
    }
  },
}
</script>
<style>
.item {
  padding: 0 0.3rem 0.3rem 0.3rem;
  border-radius: 0.1rem;
  background-color: #fff;
  margin-bottom: .2rem;
}
.itemHeader {
  padding: 0.24rem 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.itemTitle {
  font-size: 15px;
}
.itemLink {
  display: flex;
  align-items: center;
  width: 0.15rem;
  height: 0.28rem;
}
.itemLink img {
  width: 100%;
  height: 100%;
}
.itemInner {
  display: flex;
  justify-content: space-between;
}
.itemLeft,
.itemRight {
  width: 50%;
  box-sizing: border-box;
}
.pl30 {
  padding-left: 0.3rem;
}
.item-amount{
    font-size: 18px;
    color: #333;
    line-height: 18px;
}
.item-type{
    margin-top: .16rem;
    color: #666;
    font-size: 14px;
    line-height: 14px;
}
</style>
