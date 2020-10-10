<!--
 * @Author: sunch
 * @Date: 2020-07-22 11:01:41
 * @LastEditTime: 2020-07-23 00:47:09
 * @LastEditors: Please set LastEditors
 * @Description: 模板下拉
 * @FilePath: /agla-fe-8.50/vuedev/src/views/prs/basicData/empPrsType/components/templates/TplSelect.vue
--> 
<template>
  <a-select class="form-ele" allowClear @change="onChange">
      <a-select-option v-for="item in data.asValList" :key="item.valId" :value="item.valId">
          {{item.val}}
      </a-select-option>
  </a-select>
</template>
<script>
export default {
  name: 'tpl-select',
  props: ['data'],
  data(){
    return {
      value: ''
    }
  },
  methods: {
    onChange(val){
      this.value = val
      this.$emit('change', { value: val, ...this.data })
    }
  }
}
</script>