<!--
 * @Author: sunch
 * @Date: 2020-06-02 21:03:00
 * @LastEditTime: 2020-09-21 14:54:53
 * @LastEditors: Please set LastEditors
 * @Description: 用于系统内部的页面框架层
 * @FilePath: /agla-fe-8.50/vuedev/src/views/WebApp.vue
-->
<template>
  <div id="webapp" :class="{ container: inFrameShow }">
    <div :class="{ workspace: inFrameShow }" :style="{ height: containerH + 'px' }">
      <router-view />
    </div>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  data() {
    return {
      // inFrameShow: this.NODE_ENV === "development"?false:true,
      //使用nginx代理到80门户 外层框架需要开启
      inFrameShow: true,
    }
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
<style lang="less">
@import '../assets/css/antd.less';
</style>
<style lang="scss">
@import '../assets/yonyoumoon/style.css'; // 添加字体图标
@import '../assets/yonyouicon/style.css'; // 添加字体图标3.0
@import '../assets/styles/index.scss'; // 全局自定义的css样式

#webapp {
  font-family: '微软雅黑' !important;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
#nav {
  padding: 0 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
  font-size: 16px;
  text-decoration: underline;
}

#nav a.router-link-exact-active {
  color: #42b983;
}

.container {
  width: 100%;
  padding: 0 16px 10px 16px !important;
  color: #333333;
  font-size: 14px;
  /* min-height: 100%; */
  position: relative;
  display: block;
  margin-right: auto;
  margin-left: auto;
  position: relative;
  background-color: #eff3f6;
  box-sizing: border-box;
}
.workspace {
  padding: 0 15px 15px 15px;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
}
</style>
