<!--
 * @Author: sunch
 * @Date: 2020-05-15 11:20:10
 * @LastEditTime: 2020-08-24 10:46:33
 * @LastEditors: Please set LastEditors
 * @Description: 符合财务云样式的Tab标签菜单
 * @FilePath: /src/components/common/ufTab.vue
 -->
<template>
  <div class="tabWrap">
    <div v-if="tabList.length > maxShowTabNum" class="prevTab" :class="{ 'not-allowed': startTab === 0 }" @click="onClickPrevTab">
      <a-icon type="left" />
    </div>
    <ul class="tabs">
      <li v-for="item in tabList.slice(startTab, endTab)" :key="item.current" :class="{ active: tabIndex === item.current }" @click="onClickTabItem(item)">{{ item.text }}</li>
    </ul>
    <div v-if="tabList.length > maxShowTabNum" class="nextTab" :class="{ 'not-allowed': endTab === tabList.length }" @click="onClickNextTab">
      <a-icon type="right" />
    </div>
  </div>
</template>
<script>
export default {
  name: 'ufTab',
  props: ['tabList', 'tabIndex', 'maxShowTabNum'],//maxShowTabNum: 6  最大显示的tab个数
  data() {
    return {
      startTab: 0, //显示范围内起始tab角标
      endTab: 6, //显示范围内结束tab角标
    }
  },
  mounted(){
      this.endTab = this.maxShowTabNum
  },
  methods: {
      /**
     * @description: 切换tab
     */
    onClickTabItem(item) {
      this.$emit('clickTabItem', item)
    },
    /**
     * @description: 点击“上一个tab”按钮
     */
    onClickPrevTab() {
      if (this.startTab > 0) {
        this.startTab--
        this.endTab = this.startTab + this.maxShowTabNum
        // console.log(this.startTab, this.endTab)
      }
    },
    /**
     * @description: 点击“下一个tab”按钮
     */
    onClickNextTab() {
      if (this.endTab < this.tabList.length) {
        this.endTab++
        this.startTab = this.endTab - this.maxShowTabNum
        // console.log(this.startTab, this.endTab)
      }
    },
  },
}
</script>
<style lang="scss" scoped>
@import '@/assets/styles/variable.scss';
.tabWrap {
  display: flex;
  margin-bottom: -6px;
}

.tabs {
  margin: 0;
  display: flex;
  align-items: center;
}

.tabs li {
  height: 34px;
  padding: 6px 16px;
  cursor: pointer;
  box-sizing: border-box;
  font-size: 14px;
  border-radius: 4px 4px 0 0;
  user-select: none;
}

.tabs li.active {
  border: 1px solid #ddd;
  border-bottom-color: #fff;
  color: $uf-primary-color;
}

.tabs li:hover {
  background-color: $uf-primary-color;
  border-color: $uf-primary-color;
  color: #ffffff;
}
.prevTab,
.nextTab {
  height: 33px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  background-color: #fff;
  padding: 0 2px;
  cursor: pointer;
}

.prevTab:hover,
.nextTab:hover {
  background: #ddd;
  color: #fff;
}
.not-allowed {
  cursor: not-allowed;
}
</style>
