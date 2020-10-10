<!--
 * @Author: sunch
 * @Date: 2020-07-15 10:24:27
 * @LastEditTime: 2020-08-21 10:55:24
 * @LastEditors: Please set LastEditors
 * @Description: 局部loading 父级元素需为相对定位 position: relative
 * @FilePath: /agla-fe-8.50/vuedev/src/components/ufLocalLoading.vue
-->
<template>
  <div id="local-loading" class="local-loading" v-show="show">
    <div class="imgWrap">
      <img src="../../assets/imgs/Interwind-1.7s-100px.gif" alt="" />
      <div class="loadingText">
        {{ text }}
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'ufLoading',
  props: ['visible', 'text'],
  data(){
    return {
      show: false
    }
  },
  mounted() {
    if(this.visible){
      this.show = true
      setTimeout(() => {
        this.show = false
      }, 10000)
    }
  },
  watch: {
    visible(val){
      this.show = val
      if(val){
        setTimeout(() => {
          this.show = false
        }, 10000)
      }
    }
  }
}
</script>
<style scoped>
.local-loading {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 9999999999;
  background: rgba(255, 255, 255, 0.5);
}
.local-loading .imgWrap {
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
