<!--
 * @Author: sunch
 * @Date: 2020-08-11 13:53:18
 * @LastEditTime: 2020-08-19 10:50:24
 * @LastEditors: Please set LastEditors
 * @Description: 弹窗
 * @FilePath: /agla-fe-8.50/vuedev/src/components/common/ufModalFrame.vue
-->
<template>
  <div class="modal" :style="{ width: typeof(width)=='number'?width + 'px':width }" :id="id">
    <div class="header" @mousedown="mousedown">
      <h2 class="title">{{ title }}</h2>
      <i class="icon icon-close close" @click.stop="close"></i>
    </div>
    <div class="main" :style="{ height: height === 0 ? 'auto' : height + 'px' }">
      <slot></slot>
    </div>
    <div class="footer">
      <slot name="footer"> </slot>
    </div>
  </div>
</template>
<script>
export default {
  name: 'ufModalFrame',
  props: {
    title: {
      //标题
      type: String,
      default: '',
    },
    id: {
      //id
      type: String,
      default: '',
    },
    width: {
      //宽度
      type: [String, Number],
      default: 500,
    },
    height: {
      //内部高度
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      modalEl: '', //保存的modal元素实例
    }
  },
  methods: {
    close() {
      this.$emit('cancel')
    },
    mousedown(event) {
      this.modalEl = document.getElementById(this.id)
      // console.log(this.id)
      let div1 = this.modalEl
      this.modalEl.style.cursor = 'move'
      this.isDowm = true
      let distanceX = event.clientX - this.modalEl.offsetLeft
      let distanceY = event.clientY - this.modalEl.offsetTop
      //   console.log(distanceX)
      //   console.log(distanceY)
      document.onmousemove = function(ev) {
        let oevent = ev || event
        div1.style.left = oevent.clientX - distanceX + 'px'
        div1.style.top = oevent.clientY - distanceY + 'px'
      }
      document.onmouseup = function() {
        document.onmousemove = null
        document.onmouseup = null
        div1.style.cursor = 'default'
      }
    },
  },
}
</script>
<style scoped>
.modal {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #fff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border: 0;
  border-radius: 4px;
}
.header {
  background-color: white;
  color: #333;
  padding: 10px 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f3f3f3;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
}
.header:hover {
  cursor: move;
}
.close {
  font-size: 16px;
}
.close:hover {
  cursor: pointer;
}
.title {
  font-size: 16px;
  color: #333;
}
.main {
  padding: 10px 15px 0 15px;
}
.footer {
  padding: 10px 15px;
  text-align: right;
}
.footer-btns {
  text-align: right;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
</style>
