<!--
 * @Author: your name
 * @Date: 2020-06-03 16:11:40
 * @LastEditTime: 2020-06-05 19:39:30
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /agla-fe-8.50/vuedev/src/views/prs/components/mint/MintTab.vue
-->
<template>
  <div class="tabWrap">
    <div class="tab">
      <div class="tab-inner">
        <div class="year" v-for="(item,index) in tabList" :key="item" @click="onClickItem({item: item, index: index})">{{item}}</div>
      </div>
      <div class="tab-bar">
        <div class="tab-bar-inner" :style="{'transform': 'translate(' + (parseInt(current)*2.5) +'rem)'}">
          <div class="tab-bar-inner-active"></div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'MintTab',
  props: ['tabList'],
  data(){
    return {
      current: 0
    }
  },
  methods: {
      onClickItem(it){
          this.current = it.index
          this.$emit('clickTab', it)
      }
  }
}
</script>
<style scoped>
.tabWrap {
  width: 100%;
  height: 0.86rem;
  background: #fff;
  overflow-x: scroll;
}

.tabWrap::-webkit-scrollbar {
  display: none;
}

.tab {
  height: 100%;
}

.tab:after {
  border-bottom: 1px solid #ccc;
  transform: scaleY(0.5);
}

.tab-inner {
  display: flex;
  display: -webkit-box;
}

.tab-bar {
  height: 0.08rem;
}

.year {
  width: 2.5rem;
  height: 0.78rem;
  line-height: 0.86rem;
  text-align: center;
  font-size: 16px;
  color: #333;
}

.year-active {
  color: #0099ff;
}

.tab-bar-inner {
  width: 33.3333%;
  height: 100%;
  transition: all 0.3s ease;
  transform: translateX(0);
  display: flex;
  justify-content: center;
  align-items: center;
}

.tab-bar-inner-active {
  width: 1.16rem;
  height: 100%;
  background: rgba(53, 150, 250, 1);
  border-radius: 0.06rem;
}
</style>
