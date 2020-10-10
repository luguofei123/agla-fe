<!--
 * @Author: sunch
 * @Date: 2020-07-15 10:24:27
 * @LastEditTime: 2020-08-27 15:46:48
 * @LastEditors: Please set LastEditors
 * @Description: （未完成）自定义按钮
 * @FilePath: 
-->
<template>
  <a :class="['btn', getTypeStr(type), icon ? 'btn-icon' : '', size, disabled ? 'disabled' : '']" ref="btn" href="javascript:;" @click="onClick">
    <div class="btn-inner">
      <i v-if="showIcon && icon" :class="['icon ' + icon, hasContent ? 'mr-5' : '']"></i>
      <span ref="content" class="text">
        <slot></slot>
      </span>
      <i v-if="type === 'combox'||type === 'comboxlink'" class="combox-allow ml-5 icon icon-angle-bottom" :class="open ? 'transTop' : ''"></i>
    </div>

    <div v-if="type === 'combox'||type === 'comboxlink'" class="optionsPanel" :style="{width: panelWidth+'px', top: panelTop + 'px',height: open?'92px':'0'}">
        <div class="panelItem" v-for="item in options" :key="item.value">{{item.title}}</div>
    </div>
  </a>
</template>
<script>
const types = ['primary', 'default', 'normal', 'combox', 'comboxlink', 'radio', 'link', 'iconlink']
export default {
  name: 'self-button',
  props: {
    type: {
      type: String,
      default: 'default',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    icon: {
      type: String,
      default: '',
    },
    size: {
      type: String,
      default: 'default', //small large
    },
    options: {
      type: Array,
      default: () => {
        return [
          {
            title: '北京',
            value: '1',
          },
          {
            title: '上海',
            value: '2',
          },
          {
            title: '广州',
            value: '3',
          }
        ]
      },
    },
  },
  data() {
    return {
      content: '',
      hasContent: false,
      open: false,
      panelWidth: 0,
      panelTop: 32
    }
  },
  computed: {
    showIcon() {
      return this.type === 'primary' || this.type === 'default' || this.type === 'normal' || this.type === 'iconlink'
    },
  },
  mounted() {
    this.content = this.$refs.content.innerHTML
    setTimeout(()=>{
      this.panelWidth = this.$(this.$refs.btn).outerWidth()
      this.panelTop = this.$(this.$refs.btn).outerHeight() + 2
    }, 20)
  },
  watch: {
    content(val) {
      this.hasContent = !!val
    },
    open(boo) {
      this.$emit('visibleChange', boo)
    },
  },
  methods: {
    getTypeStr(type) {
      let classStr = 'btn-normal'
      if (
        types.some((i) => {
          return i === type
        })
      ) {
        classStr = 'btn-' + type
      }
      return classStr
    },
    onClick(...arg) {
      if (!this.disabled) {
        this.open = !this.open
        this.$emit('click', arg)
      }
    },
  },
}
</script>
<style>
a:hover{
  color: inherit;
}
i {
  display: inline-block;
  vertical-align: middle;
  font-style: normal;
}

/* 按钮类别 开始 */
.btn {
  position: relative;
  display: inline-block;
  vertical-align: middle;
  text-decoration: none;
  text-align: center;
  line-height: 14px;
}
.btn-default,
.btn-primary,
.btn-normal,
.btn-combox {
  display: inline-block;
  box-sizing: border-box;
  padding: 0 16px;
  height: 32px;
  border-radius: 4px;
  font-size: 14px;
  line-height: 28px;
}
.btn-primary {
  background: #0066ff;
  color: #fff;
}
.btn-default {
  background: rgba(255, 255, 255, 1);
  color: #0066ff;
  border: 1px solid #0066ff;
}
.btn-normal {
  background: rgba(255, 255, 255, 1);
  color: #888888;
  border: 1px solid #888888;
}
.btn-combox {
  padding: 0 8px;
  background: rgba(255, 255, 255, 1);
  color: #888888;
  border: 1px solid #888888;
}
.btn-link,
.btn-iconlink {
  font-size: 14px;
  color: #0066ff;
}
/* 按钮类别 结束 */

/* 带图标的按钮 开始 */
.btn-default.btn-icon,
.btn-primary.btn-icon,
.btn-normal.btn-icon,
.btn-combox.btn-icon,
.btn-link.btn-icon,
.btn-iconlink.btn-icon {
  padding: 0 8px;
}
/* 带图标的按钮 结束 */

/* 按钮hover 开始 */
.btn-primary:hover{
  background: #3384ff;
  color: #fff;
}
.btn-default:hover{
  color: #3384ff;
  border: 1px solid #3384ff;
}
.btn-normal:hover {
  color: #3384ff;
}
.btn-link:hover {
  color: #3384ff;
}
.btn-primary.btn-icon:hover{
  background: #3384ff;
}
.btn-default.btn-icon:hover,
.btn-normal.btn-icon:hover,
.btn-combox.btn-icon:hover,
.btn-link.btn-icon:hover,
.btn-iconlink.btn-icon:hover {
  color: #3384ff;
}
/* 按钮hover 结束 */

/* 按钮内部 开始 */
.btn-inner {
  display: inline-block;
  vertical-align: middle;
  line-height: 14px;
}
.btn-inner .text{
  display: inline-block;
  vertical-align: middle;
}
/* 按钮内部 结束 */

/* 大型按钮适配 开始 */
.btn-default.large,
.btn-primary.large,
.btn-normal.large,
.btn-combox.large {
  padding: 0 24px;
  height: 40px;
  line-height: 34px;
  font-size: 16px;
}
.btn-link.large,
.btn-iconlink.large {
  font-size: 16px;
}
.btn-default.large.btn-icon,
.btn-primary.large.btn-icon,
.btn-normal.large.btn-icon,
.btn-combox.large,
.btn-combox.large.btn-icon{
  padding: 0 12px;
}
.btn-default.large .btn-inner,
.btn-primary.large .btn-inner,
.btn-normal.large .btn-inner,
.btn-combox.large .btn-inner {
  line-height: 36px;
}
.btn-link.large .btn-inner,
.btn-iconlink.large .btn-inner,
.btn-link.large .btn-inner .text,
.btn-iconlink.large .btn-inner .text {
  line-height: 16px;
}
.btn.btn-link.large,
.btn.btn-iconlink.large{
  line-height: 16px;
}
/* 大型按钮适配 结束 */

/* 小型按钮适配 开始 */
.btn-default.small,
.btn-primary.small,
.btn-normal.small,
.btn-combox.small {
  padding: 0 8px;
  height: 24px;
  line-height: 18px;
  font-size: 12px;
}
.btn-link.small,
.btn-iconlink.small {
  font-size: 12px;
}
.btn-default.small .btn-inner,
.btn-primary.small .btn-inner,
.btn-normal.small .btn-inner,
.btn-combox.small .btn-inner {
  line-height: 22px;
}
.btn.btn-link.small,
.btn.btn-iconlink.small{
  line-height: 12px;
}
.btn-link.small .btn-inner,
.btn-iconlink.small .btn-inner,
.btn-link.small .btn-inner .text,
.btn-iconlink.small .btn-inner .text {
  line-height: 12px;
}
/* 小型按钮适配 结束 */

/* 按钮禁用 开始 */
.disabled {
  background: #eeeeee;
  color: #aaaaaa;
  border: 1px solid #aaaaaa;
  cursor: not-allowed;
}
/* 按钮禁用 结束*/

/* 下拉按钮 开始 */
.combox-allow {
  transition: all 0.3s ease;
}
.transTop {
  transform: rotate(-180deg);
}
.optionsPanel{
  position: absolute;
  left: 0;
  background: #fff;
  box-sizing: border-box;
  z-index: 2;
  max-height: 200px;
  transition: height .3s ease;
  color: #888888;
  border: 1px solid #888888;
  border-radius: 4px;
  overflow-y: auto;
}
.panelItem{
  height: 30px;
  box-sizing: border-box;
  padding: 0 8px;
}
/* .btn-combox .optionsPanel,
.btn-comboxlink .optionsPanel {
} */
/* 下拉按钮 结束 */
</style>
