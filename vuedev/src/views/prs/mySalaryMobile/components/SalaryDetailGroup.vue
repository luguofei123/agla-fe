<!--
 * @Author: your name
 * @Date: 2020-06-04 15:04:01
 * @LastEditTime: 2020-09-11 09:57:01
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /agla-fe-8.50/vuedev/src/views/prs/mySalaryMobile/components/SalaryDetailtem.vue
-->
<template>
  <div class="group">
    <div class="groupTitleWrap" :class="{ 'bb1': group.list.length > 0 && open }" @click.stop="open = !open">
      <div class="openWrap">
        <div class="groupTitle">
          <i class="icon trans mr-5 icon-angle-bottom" :class="open?'':'transTop'" :style="{color:'#3596fa'}"></i>
          <!-- <span class="titleMark"></span> -->
          {{ group.title }}
        </div>
      </div>
      <div class="titleAmount">{{ group.value }}</div>
    </div>
    <div class="groupList trans" v-if="group.list.length > 0" :style="'height:'+(open? ((0.8 + dW) * group.list.length) +'rem':'0')">
      <div class="groupListItem" v-for="(item,index) in group.list" :key="index" :class="{'bb1': index < group.list.length - 1}">
        <div class="groupItemTitle">{{ item.title }}</div>
        <div class="groupItemAmount">{{ item.value }}</div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'SalaryDetailGroup',
  props: ['group'],
  data(){
    return {
      dW: 7.5 / document.documentElement.clientWidth,
      open: true
    }
  }
}
</script>
<style>
.group {
  padding: 0 0.3rem;
  background-color: #fff;
  margin-bottom: 0.2rem;
}
.groupTitleWrap {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.2rem 0;
}
.openWrap{
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.groupTitle {
  height: 0.3rem;
  line-height: 0.3rem;
  font-size: 15px;
  font-weight: 500;
  color: #333;
  display: flex;
  align-items: center;
}
.titleMark{
  display: inline-block;
  width: 0.06rem;
  height: 0.3rem;
  background: #3596fa;
  margin-right: 0.12rem;
  border-radius: 0.03rem;
}
.titleAmount{
  font-weight: 500;
  color: #333;
  font-size: 15px;
  line-height: 0.3rem;
}
.groupList{
  overflow: hidden;
}
.groupListItem{
  padding: .25rem 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
}
.groupItemTitle{
  color: #333;
  font-size: 15px;
  line-height: 0.3rem;
}
.groupItemAmount{
  color: #333;
  font-size: 15px;
  line-height: 0.3rem;
}
.trans{
  transition: all .3s ease;
}
.transTop{
  transform: rotate(-180deg)
}
.height0{
  height: 0;
}
</style>
