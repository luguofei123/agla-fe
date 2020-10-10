<!--
 * @Author: sunch
 * @Date: 2020-07-31 13:56:48
 * @LastEditTime: 2020-08-03 14:54:40
 * @LastEditors: Please set LastEditors
 * @Description: form中跳转组件
 * @FilePath: /agla-fe-8.50/vuedev/src/views/prs/mySalaryMobile/components/FormLink.vue
-->
<template>
  <div class="linkWrap" @click="onClick">
    <div class="content">
      <slot></slot>
    </div>
    <img class="arrow_right" src="../../../../assets/imgs/arrow_right.png" alt="" />
  </div>
</template>
<script>
export default {
  name: 'FormLink',
  methods: {
    onClick(e) {
      this.$emit('click', e)
    },
  },
}
</script>
<style>
.linkWrap {
  max-width: 90%;
  display: flex;
  justify-content: flex-end;
  align-items: flex-start;
}
.content {
  color: #333;
  font-size: 15px;
  line-height: 20px;
  margin-right: 0.15rem;
}
.arrow_right {
  width: 0.15rem;
  height: 0.28rem;
  margin-top: 0.06rem;
}
</style>
