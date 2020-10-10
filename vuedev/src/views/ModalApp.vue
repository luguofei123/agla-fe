<!--
 * @Author: sunch
 * @Date: 2020-07-29 10:59:42
 * @LastEditTime: 2020-07-29 16:16:49
 * @LastEditors: Please set LastEditors
 * @Description: 用于外部引用的modal层
 * @FilePath: /agla-fe-8.50/vuedev/src/views/ModalApp.vue
-->
<template>
  <div id="modalApp">
    <div class="modalWrap myscrollbar" :style="{ height: containerH - 36 + 'px' }">
      <router-view />
    </div>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  data() {
    return {}
  },
  computed: {
    ...mapGetters(['containerH']),
  },
  methods: {
    ...mapActions(['setContainerH', 'setPfData']),
  },
  created() {
    //在mutation中计算了可视区域高度
    this.setContainerH()
  },
}
</script>
<style lang="scss">
@import '../assets/yonyoumoon/style.css'; // 添加字体图标
@import '../assets/styles/index.scss'; // 全局自定义的css样式
* {
  margin: 0;
  padding: 0;
}
#modalApp {
  font-family: '微软雅黑' !important;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
.modalWrap {
  background: #fff;
  position: relative;
  overflow: auto;
}
</style>
