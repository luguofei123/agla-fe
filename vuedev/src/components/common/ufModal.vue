<!--
 * @Author: sunch
 * @Date: 2020-08-10 17:01:06
 * @LastEditTime: 2020-08-19 10:50:34
 * @LastEditors: Please set LastEditors
 * @Description: 可拖拽的弹出窗口公共组件
 * @FilePath: /agla-fe-8.50/vuedev/src/components/ufModal.vue
-->
<template>
  <div class="modal-warp" @click.self="onClickMask" v-show="visible" :style="{ background: mask ? 'rgba(0, 0, 0, 0.5)' : 'transparent', 'z-index': zIndex }">
    <ufModalFrame v-if="visible" :id="modalId" :title="title" :width="width" :height="height" @cancel="cancel">
      <slot></slot>
      <template v-slot:footer>
        <slot name="footer">
          <div class="footer-btns">
            <slot name="footerBtns">
              <a-button type="primary" @click="confirm">确 定</a-button>
              <a-button class="ml-10" @click="close">取 消</a-button>
            </slot>
          </div>
        </slot>
      </template>
    </ufModalFrame>
  </div>
</template>

<script>
import ufModalFrame from './ufModalFrame'

export default {
  name: 'ufModal',
  props: {
    value: {
      //是否显示
      type: Boolean,
      default: false,
    },
    title: {
      //标题
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
    mask: {
      //是否显示遮罩
      type: Boolean,
      default: true,
    },
    maskClosable: {
      //点击蒙层是否允许关闭
      type: Boolean,
      default: true,
    },
    afterClose: {
      //Modal 完全关闭后的回调
      type: Function,
      default: () => {},
    },
    closeAfterConfirm: {
      //确认后关闭
      type: Boolean,
      default: true,
    },
    zIndex: {
      //内部高度
      type: Number,
      default: 10,
    }
  },
  components: {
    ufModalFrame,
  },
  data() {
    return {
      modalId: 'ufModal',
      visible: false,
    }
  },
  watch: {
    value(val) {
      if (val) {
        this.modalId = 'ufModal_' + parseInt(Math.random() * 1e10)
      }
      this.visible = val
    },
  },
  methods: {
    /**
     * @description: 关闭 并发送cancel事件
     */
    close() {
      this.visible = false
      this.$emit('cancel')
      this.afterClose()
    },
    /**
     * @description:
     */
    confirm() {
      if (this.closeAfterConfirm) {
        this.$emit("ok");
        this.close()
      }
    },
    onClickMask() {
      if (this.maskClosable) {
        this.close()
      }
    },
    cancel() {
      this.close()
    },
  },
}
</script>

<style scoped>
.modal-warp {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 10;
}
</style>
