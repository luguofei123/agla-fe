<!--
 * @Author: sunch
 * @Date: 2020-07-28 17:20:45
 * @LastEditTime: 2020-07-28 18:55:33
 * @LastEditors: Please set LastEditors
 * @Description: 自定义按钮
 * @FilePath: /agla-fe-8.50/vuedev/src/views/prs/mySalaryMobile/components/MintButton.vue
-->
<template>
  <button class="selfButton" :class="getClassName(type)" @click="onClick">
    <slot></slot>
  </button>
</template>
<script>
export default {
  props: {
    type: {
      type: String,
      default: 'default',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    onClick(e) {
      if (!this.disabled) this.$emit('click', e)
    },
    getClassName(type) {
      if (this.disabled) {
        return 'grayBg'
      } else {
        let className = ''
        switch (type) {
          case 'default':
            className = 'grayBg'
            break
          case 'primary':
            className = 'blueBg'
            break
          default:
            className = 'grayBg'
        }
        return className
      }
    },
  },
}
</script>
<style>
.selfButton {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 0.88rem;
  border-radius: 0.1rem;
  outline: none;
  font-size: 16px;
  border: 0;
}
.grayBg {
  background: #eeeeee;
  color: #666;
}
.blueBg {
  background: #3596fa;
  color: #fff;
}
</style>
