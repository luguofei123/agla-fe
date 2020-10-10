<!--
 * @Author: sunch
 * @Date: 2020-07-15 10:24:27
 * @LastEditTime: 2020-08-21 10:46:36
 * @LastEditors: Please set LastEditors
 * @Description: （未完成）自定义下拉框
 * @FilePath: /vuedev/src/components/common/ufCombox.vue
-->
<template>
  <div>
    <div class="wrap" @click="toggleList">
      <div class="showBox">{{ showText }}</div>
      <div class="tagWrap">
        <div class="tag"></div>
      </div>
    </div>
    <ul :class="{ list: true, dn: !showList }">
      <li v-for="item in data" :key="item.key" :value="item.value" @click="clickItem(item)">{{ item.key }}</li>
    </ul>
  </div>
</template>
<script>
export default {
  name: 'combox',
  data() {
    return {
      showText: '请选择城市',
      showList: false,
    }
  },
  props: {
    data: Array,
  },
  methods: {
    toggleList() {
      this.showList = !this.showList
    },
    clickItem(item) {
      this.showList = false
      console.log(item)
      this.showText = item.key
    },
  },
}
</script>
<style scoped>
* {
  margin: 0;
  padding: 0;
}
ul,
li {
  list-style: none;
}
.wrap {
  width: 240px;
  height: 32px;
  box-sizing: border-box;
  background: rgba(254, 254, 254, 1);
  border-radius: 4px;
  border: 1px solid rgba(204, 204, 204, 1);
  display: flex;
}
.showBox {
  width: 208px;
  height: 30px;
  font-size: 14px;
  color: rgba(102, 102, 102, 1);
  line-height: 30px;
  padding-left: 15px;
  box-sizing: border-box;
}
.tagWrap {
  width: 32px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  border-left: 1px solid rgba(194, 194, 194, 1);
}
.tag {
  width: 0;
  height: 0;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-top: 5px solid #666666;
}
.dn {
  display: none;
}
.list {
  width: 240px;
  min-height: 32px;
  max-height: 256px;
  background: #ffffff;
  border: 1px solid rgba(204, 204, 204, 1);
  border-top: 0;
}
.list li {
  height: 32px;
  line-height: 32px;
  font-size: 14px;
  color: rgba(102, 102, 102, 1);
  padding-left: 15px;
  box-sizing: border-box;
}
</style>
