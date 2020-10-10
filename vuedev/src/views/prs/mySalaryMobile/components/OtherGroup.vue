<!--
 * @Author: your name
 * @Date: 2020-06-04 19:42:06
 * @LastEditTime: 2020-06-11 11:58:56
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /agla-fe-8.50/vuedev/src/views/prs/mySalaryMobile/components/otherGroup.vue
-->
<template>
  <div class="otherGroup">
    <div class="point">
    </div>
    <div class="otherGroupInner">
      <div class="otherGroupRow">
        <div class="leftBox">发放项目: {{group.distItemName}}</div>
        <div class="rightBox">发放日期: {{group.billDate}}</div>
      </div>
      <div class="otherGroupRow">
        <div class="leftBox">发放部门: {{group.deptName}}</div>
        <div class="rightBox">税额: {{group.amtDctax}}</div>
      </div>
      <div class="otherGroupRow">
        <div class="leftBox">应发金额: {{group.amtShouldDist}}</div>
        <div class="rightBox">实发金额: {{group.amtRealDist}}</div>
      </div>
      <div class="otherGroupRow">
        <div>摘要: {{group.declReason}}</div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'OtherGroup',
  props: ['group']
}
</script>
<style>
.otherGroup {
  padding: 0.24rem 0.24rem 0 0.62rem;
  display: flex;
  align-items: flex-start;
  position: relative;
  background: #fff;
  border-radius: .1rem;
  margin-bottom: .2rem;
}
.point {
  position: absolute;
  top: 0.32rem;
  left: 0.24rem;
  width: 0.26rem;
  height: 0.26rem;
  line-height: 0.26rem;
  border-radius: 0.13rem;
  background: #3596fa;
  border: 0.05rem solid #deeeff;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
}
.otherGroupInner{
    width: 100%;
}
.otherGroupRow {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  font-size: 15px;
  line-height: 22px;
  margin-bottom: .10rem;
}
.otherGroupRow .leftBox,.otherGroupRow .rightBox{
  width: 50%;
  text-align: left;
  box-sizing: border-box;
}
.otherGroupRow .leftBox{
  padding-right: .05rem;
}
.otherGroupRow .rightBox{
  padding-left: .05rem;
}
.ml30{
    margin-left: .3rem;
}
</style>
