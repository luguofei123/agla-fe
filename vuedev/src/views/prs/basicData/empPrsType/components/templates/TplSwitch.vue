<!--
 * @Author: sunch
 * @Date: 2020-07-22 11:00:25
 * @LastEditTime: 2020-07-22 21:02:13
 * @LastEditors: Please set LastEditors
 * @Description: 模板开关
 * @FilePath: /agla-fe-8.50/vuedev/src/views/prs/basicData/empPrsType/components/templates/TplSwich.vue
-->
<template>
  <div v-if="data.asValList.length > 1" class="checkbox-wrap">
    <a-checkbox class="mr-30" :defaultChecked="true" :checked="attr1" @change="attr1Change"><span class="checkboxText pl-5">{{data.asValList[0].val}}</span></a-checkbox>
    <a-checkbox :defaultChecked="true" :checked="attr2" @change="attr2Change"><span class="checkboxText pl-5">{{data.asValList[1].val}}</span></a-checkbox>
  </div>
  <div v-else class="checkbox-wrap"></div>
</template>
<script>
export default {
  name: 'tpl-switch',
  props: ['data'],
  data(){
    return {
      attr1: true,
      attr2: true,
    }
  },
  computed: {
    checkedValue(){
      if(this.attr1&&this.attr2){
        return ''
      }else{
        if(this.attr1){
          return data.asValList[0].valId
        }else if(this.attr2){
          return data.asValList[1].valId
        }
      }
    }
  },
  methods: {
    attr1Change(e){
      if(e.target.checked){
        this.attr1 = true
      }else{
        this.attr1 = false
        this.attr2 = true
      }
      this.$emit('change', { value, ...this.data })
    },
    attr2Change(e){
      console.log(e)
      if(e.target.checked){
        this.attr2 = true
      }else{
        this.attr2 = false
        this.attr1 = true
      }
      this.$emit('change', { value, ...this.data })
    }
  },
}
</script>
<style lang="scss" scoped>
.checkbox-wrap {
  display: inline-block;
  width: 200px;
}
</style>
