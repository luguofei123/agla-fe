<!--
 * @Author: your name
 * @Date: 2020-06-04 16:51:37
 * @LastEditTime: 2020-06-05 19:55:07
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /agla-fe-8.50/vuedev/src/views/prs/mySalaryMobile/components/SalaryDetailItem.vue
-->
<template>
  <div class="detailItem">
    <div class="itemLabel">{{item.title}}</div>
    <div class="itemValue">{{item.value}}</div>
  </div>
</template>
<script>
export default {
  name: 'SalaryDetailGroup',
  props: [ 'item']
}
</script>
<style>
</style>
