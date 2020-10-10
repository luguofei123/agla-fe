<!--
 * @Author: sunch
 * @Date: 2020-07-28 17:20:45
 * @LastEditTime: 2020-08-04 17:20:33
 * @LastEditors: Please set LastEditors
 * @Description: 自定义输入框
 * @FilePath: /agla-fe-8.50/vuedev/src/views/prs/mySalaryMobile/components/MintButton.vue
-->
<template>
  <div class="selfInputWrap" @click="focus">
    <input v-if="type === 'text' || type === 'number'" v-model="currentValue" class="selfInput" ref="selfInput" type="text" :placeholder="placeholder" />
    <input v-else v-model="currentValue" class="selfInput" ref="selfInput" :type="type" :placeholder="placeholder" />
  </div>
</template>
<script>
export default {
  props: {
    value: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      default: 'text',
    },
    placeholder: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      currentValue: this.value,
    }
  },
  watch: {
    currentValue(val) {
      this.$nextTick(() => {
        if (this.type === 'number') {
          let value = val.replace(/\D/g, '')
          this.$refs.selfInput.value = value
          this.$emit('input', value)
        } else {
          this.$emit('input', val)
        }
      })
    },
  },
  methods: {
    focus() {
      this.$refs.selfInput.focus()
    },
  },
}
</script>
<style>
.main {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}
.selfInputWrap {
  background: #f9f9f9;
  width: 100%;
  height: 0.92rem;
  box-sizing: border-box;
  padding: 0.25rem 0.24rem;
}
.selfInput {
  display: block;
  width: 100%;
  height: 100%;
  border: 0;
  background: transparent;
  outline: none;
}
</style>
