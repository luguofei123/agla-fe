<!--
 * @Author: sunch
 * @Date: 2020-07-09 14:41:19
 * @LastEditTime: 2020-08-21 10:53:59
 * @LastEditors: Please set LastEditors
 * @Description: 全局loading
 * @FilePath: /agla-fe-8.50/vuedev/src/components/common/ufLoading.vue
-->
<template>
  <div id="global-loading" class="loading" v-if="show">
    <div class="imgWrap">
      <img src="../../assets/imgs/Interwind-1.7s-100px.gif" alt />
      <div class="loadingText">{{ text }}</div>
    </div>
  </div>
</template>
<script>
export default {
  name: "ufLoading",
  data() {
    return {
      show: false,
      text: "",
    };
  },
};
</script>
<style scoped>
.loading {
  position: fixed;
  width: 100%;
  height: 100%;
  z-index: 9999999999;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.5);
}
.loading .imgWrap {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.loadingText {
  position: absolute;
  bottom: 5px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 14px;
  color: #666;
}
</style>
