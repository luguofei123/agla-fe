<template>
  <div class="mainBox">
    <div class="menuBox myscrollbar">
      <div class="indexItem" @click="ind = 1" :class="ind === 1 ?'active':''"><router-link to="/document/theme">使用说明</router-link></div>
      <div class="indexItem" @click="ind = 2" :class="ind === 2 ?'active':''"><router-link to="/document/theme">Alert 警告弹窗</router-link></div>
      <div class="indexItem" @click="ind = 3" :class="ind === 3 ?'active':''"><router-link to="/document/buttonExp">Button 按钮</router-link></div>
      <div class="indexItem" @click="ind = 4" :class="ind === 4 ?'active':''"><router-link to="/document/theme">Drawer 抽屉(局部组件)</router-link></div>
      <div class="indexItem" @click="ind = 5" :class="ind === 5 ?'active':''"><router-link to="/document/theme">Header 页面头部</router-link></div>
      <div class="indexItem" @click="ind = 6" :class="ind === 6 ?'active':''"><router-link to="/document/theme">Loading 全页面加载中</router-link></div>
      <div class="indexItem" @click="ind = 7" :class="ind === 7 ?'active':''"><router-link to="/document/theme">LocalLoading 局部加载中</router-link></div>
      <div class="indexItem" @click="ind = 8" :class="ind === 8 ?'active':''"><router-link to="/document/theme">Message 弹出信息</router-link></div>
      <div class="indexItem" @click="ind = 9" :class="ind === 9 ?'active':''"><router-link to="/document/theme">Modal 全局弹窗/模态窗口</router-link></div>
      <div class="indexItem" @click="ind = 10" :class="ind === 10 ?'active':''"><router-link to="/document/theme">MoreBtn “更多”按钮</router-link></div>
      <div class="indexItem" @click="ind = 11" :class="ind === 11 ?'active':''"><router-link to="/document/pagerExp">Pager 分页器</router-link></div>
      <div class="indexItem" @click="ind = 12" :class="ind === 12 ?'active':''"><router-link to="/document/theme">QueryArea 查询区域</router-link></div>
      <div class="indexItem" @click="ind = 13" :class="ind === 13 ?'active':''"><router-link to="/document/theme">Search 模糊搜索</router-link></div>
      <div class="indexItem" @click="ind = 14" :class="ind === 14 ?'active':''"><router-link to="/document/theme">Tabs 标签页</router-link></div>
      <div class="indexItem" @click="ind = 14" :class="ind === 14 ?'active':''"><router-link to="/document/theme">Upload 上传</router-link></div>
      <div class="indexItem" @click="ind = 14" :class="ind === 14 ?'active':''"><router-link to="/document/theme">Print/Export 打印/导出</router-link></div>
      <div class="indexItem" @click="ind = 15" :class="ind === 15 ?'active':''"><router-link to="/document/theme">Ztree 树</router-link></div>
      <div class="indexItem" @click="ind = 16" :class="ind === 16 ?'active':''"><router-link to="/document/theme">ZtreeSelect下拉树</router-link></div>
    </div>
    <div class="example myscrollbar">
      <div class="exampleInner myscrollbar">
        <router-view />
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data(){
    return {
      ind: 1
    }
  },
  mounted() {
    console.log(window.innerHeight)
  },
}
</script>
<style>
.mainBox {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  height: 100%;
  box-sizing: border-box;
  overflow: hidden;
}
.menuBox {
  float: left;
  width: 200px;
  height: 100%;
  overflow: auto;
  padding-top: 15px;
  box-sizing: border-box;
}
.menuBox .indexItem {
  margin-bottom: 10px;
  padding: 0 15px;
  font-size: 14px;
  font-weight: 500;
}
.menuBox .indexItem a {
  color: #3384ff;
}
.menuBox .indexItem a:hover{
  color: #0066ff;
}
.menuBox .active a{
  color: #0051cc;
}
.example {
  height: 100%;
  margin-left: 200px;
  width: calc(100% - 200px);
  padding: 0 15px;
  box-sizing: border-box;
  overflow-y: auto;
}
.exampleInner{
  min-width: 1100px;
  overflow-x: auto;
}
h3 {
  margin: 15px 0;
}
h4 {
  margin: 10px 0;
}
.showSrcWrap {
  padding: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.showSrcWrap a {
  text-decoration: none;
}
pre {
  display: block;
  overflow-x: auto;
  padding: 0.5em;
  background: #f0f0f0;
}
</style>
