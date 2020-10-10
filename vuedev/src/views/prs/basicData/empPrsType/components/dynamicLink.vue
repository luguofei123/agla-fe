<!--
 * @Author: sunch
 * @Date: 2020-07-22 10:32:37
 * @LastEditTime: 2020-07-23 09:43:36
 * @LastEditors: Please set LastEditors
 * @Description: 动态组件
 * @FilePath: /agla-fe-8.50/vuedev/src/views/prs/basicData/empPrsType/components/dynamic.vue
-->
<template>
  <component :is="component" :data="data" v-if="component" @change="tplValChange" />
</template>
<script>
export default {
  name: 'dynamic-link',
  props: ['data', 'type'],
  data() {
    return {
      component: null,
    }
  },
  computed: {
    loader() {
      let tempName = ''
      if (this.type) {
        if(this.data.propertyCode === 'typeCode'){
          tempName = 'TplTreeSelect'
        }else{
          tempName = this.getTempName(this.type)
        }
      } else {
        return () => import(`./templates/TplDefault`)
      }
      return () => import(`./templates/${tempName}`)
    },
  },
  mounted() {
    this.loader()
      .then(() => {
        this.component = () => this.loader()
      })
      .catch(() => {
        this.component = () => import('./templates/TplInput')
      })
  },
  methods: {
    tplValChange(val) {
      this.$emit('change', val)
    },
    getTempName(type) {
      let name = 'TplDefault'
      switch (type) {
        case 'E' || 'R' || 'X':
          //少于等于两个是开关 其他是下拉
          if (this.data.asValList) {
            if(this.data.asValList.length === 2){
              name = 'TplSwitch'
            } else{
              name = 'TplSelect'
            }
          }else{
            this.data.asValList = []
            name = 'TplSelect'
          }
          break
        case 'N':
          //数字类型输入框
          name = 'TplInputNumber'
          break
        case 'D':
          //日期类型输入框
          name = 'TplDateRanger'
          break
        default:
          name = 'TplInput'
      }
      return name
    },
  },
}
</script>
<style>
.form-ele {
  width: 200px;
}
</style>
