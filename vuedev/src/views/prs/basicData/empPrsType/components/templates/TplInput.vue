<!--
 * @Author: sunch
 * @Date: 2020-07-22 10:47:34
 * @LastEditTime: 2020-07-22 12:37:16
 * @LastEditors: Please set LastEditors
 * @Description: 输入框
 * @FilePath: /agla-fe-8.50/vuedev/src/views/prs/basicData/empPrsType/components/templates/TplInput.vue
-->
<template>
  <a-input v-model="content" allowClear class="form-ele"></a-input>
</template>
<script>
export default {
  name: 'tpl-input',
  props: ['data'],
  data() {
    return {
      content: '',
    }
  },
  watch: {
    content(value) {
      this.$emit('change', { value, ...this.data })
    },
  },
}
</script>
