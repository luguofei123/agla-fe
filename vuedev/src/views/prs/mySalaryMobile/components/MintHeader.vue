<!--
 * @Author: sunch
 * @Date: 2020-06-03 13:39:02
 * @LastEditTime: 2020-08-04 15:02:18
 * @LastEditors: Please set LastEditors
 * @Description: 头部组件 包含返回按钮
 * @FilePath: /agla-fe-8.50/vuedev/src/views/prs/components/mint/MintHeader.vue
-->
<template>
  <div class="header" :class="{ bgBlue: type === 'list', bgWhite: type != 'list' }">
    <div class="header-inner">
      <a v-if="type === 'list'" class="back" href="javascript:;" @click="goBack"><img src="../../../../assets/imgs/back_white.png" alt=""/></a>
      <a v-else class="back" href="javascript:;" @click="goBack"><img src="../../../../assets/imgs/back_gray.png" alt=""/></a>
      <div class="btn">
        <slot name="btn"></slot>
      </div>
      <div class="title" :class="{ cb: type != 'list' }">
        <slot name="title">
          {{ title ? title : '' }}
        </slot>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'MintHeader',
  props: {
    title: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      default: 'detail',
    },
    backToApp: {
      type: Boolean,
      default: false,
    },
    backType: {
      type: String,
      default: 'push',
    },
    pathConfig: {
      type: Object,
      default: () => {
        return null
      },
    },
  },
  methods: {
    goBack() {
      if (this.backToApp) {
        // 范红亮：目前工资和资产的app都是前端自己单独的包，集成到一起后，正常可以跳转过去，但是返回不回来 我们提供了统一的返回方式，辛苦你们前端调整下返回函数调用
        // http://faq.cwy.com/topic/99
        window.parent.postMessage(
          {
            // 参数是对象
            cmd: 'back',
          },
          '*'
        )
      } else {
        if (this.pathConfig) {
          if (this.backType === 'replace') {
              console.log(this.pathConfig)
            this.$router.replace(this.pathConfig)
          } else {
            this.$router.push(this.pathConfig)
          }
        } else {
          //路由回退
          this.$router.go(-1)
        }
      }
    },
  },
}
</script>
<style>
.header {
  width: 100%;
  height: calc(0.88rem + 25px);
  box-sizing: border-box;
  padding: 25px 0.32rem 0 0.32rem;
}
.header-inner {
  position: relative;
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.bgBlue {
  background: linear-gradient(135deg, rgba(88, 163, 252, 1) 0%, rgba(83, 160, 253, 1) 48%, rgba(114, 176, 249, 1) 100%);
}
.bgWhite {
  background-color: #fff;
}
.back {
  display: block;
  width: 0.2rem;
  height: 0.4rem;
}
.back img {
  width: 100%;
  height: 100%;
}
.title {
  font-size: 18px;
  font-weight: 400;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #fff;
}
.cb {
  color: #333;
}
</style>
