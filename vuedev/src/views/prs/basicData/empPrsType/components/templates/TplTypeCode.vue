<!--
 * @Author: sunch
 * @Date: 2020-07-22 22:50:53
 * @LastEditTime: 2020-08-24 11:16:26
 * @LastEditors: Please set LastEditors
 * @Description: 人员身份 单独下拉树
 * @FilePath: /agla-fe-8.50/vuedev/src/views/prs/basicData/empPrsType/components/templates/TplTypeCode.vue
-->
<template>
  <a-tree-select
    v-if="treeData.length > 0"
    :maxTagPlaceholder="
      (v) => {
        return ''
      }
    "
    :treeData="treeData"
    :maxTagCount="1"
    :dropdownClassName="'myscrollbar'"
    :dropdownStyle="{ 'max-height': '400px' }"
    style="width: 200px;"
    @change="onChange"
    multiple
    allowClear
    treeCheckable
  >
  </a-tree-select>
</template>
<style>
.ant-select-selection--multiple {
  padding-bottom: 0;
  min-height: 30px;
}
</style>
<script>
import { construct } from '@aximario/json-tree'
export default {
  name: 'tpl-typecode',
  props: ['data'],
  data() {
    return {
      value: '',
    }
  },
  computed: {
    treeData() {
      var newarr = []
      this.data.asValList.forEach((item) => {
        newarr.push({
          key: item.id,
          pId: item.pId,
          code: item.code,
          value: item.code,
          title: item.codeName,
          name: item.name,
          codeName: item.codeName,
          isLeafn: !!item.isLeaf ? true : false,
        })
      })
      let treeData = construct(newarr, {
        id: 'key',
        pid: 'pId',
        children: 'children',
      })
      console.log(treeData)
      return treeData
    },
  },
  methods: {
    onChange(val) {
      console.log(val)
      this.value = val
      this.$emit('change', { value: val, ...this.data })
    },
  },
}
</script>
