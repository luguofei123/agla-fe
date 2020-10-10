<!--
 * @Author: sunch
 * @Date: 2020-07-23 09:42:33
 * @LastEditTime: 2020-08-24 11:35:48
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /agla-fe-8.50/vuedev/src/views/prs/basicData/empPrsType/components/templates/TplTreeSelect.vue
--> 
<template>
  <ufTreeSelect class="form-ele" checkable :treeData="data.asValList" @change="onChange"></ufTreeSelect>
</template>
<script>
export default {
  name: 'tpl-tree-select',
  props: ['data'],
  data() {
    return {
      
    }
  },
  methods: {
      onChange(val){
          console.log(val)
          this.$emit('change', { value: val, ...this.data })
      }
  }
}
</script>