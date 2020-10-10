<!--
 * @Author: sunch
 * @Date: 2020-05-14 16:12:08
 * @LastEditTime: 2020-05-14 16:21:52
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /ufgov-vue/src/views/Error404.vue
 -->
<template>
  <div id="box">
    <div id="left-b"><img src="../assets/imgs/images/404.png" /></div>
    <div id="right-b">
      <p class="bigger">404!</p>
      <p class="content">抱歉，该功能出现错误了，页面无法打开，请联系系统管理员！</p>
      <a href="#"><input type="button" id="btn" value="返回我的工作台"/></a>
    </div>
  </div>
</template>
<script>
export default {}
</script>
<style  scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
body {
  font-size: 12px;
  font-family: 'Microsoft YaHei', 'SimSun';
  width: 100%;
  height: 100%;
  background: #eff3f6;
  overflow-x: hidden;
  overflow-y: auto;
}
ul,
ol,
li {
  list-style: none;
}
img {
  border: none;
}
a {
  text-decoration: none;
}
.clearfix {
  clear: both;
  display: block;
  overflow: hidden;
  visibility: hidden;
  width: 0px;
  height: 0px;
}

#box {
  width: 100%;
  min-width: 1114px;
  height: 560px;
  background: #ffffff;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.15);
  margin: 1px 16px 10px 16px;
}
#left-b {
  width: 356px;
  height: 249px;
  float: left;
  margin: 140px 10% 0 9%;
}
#left-b img {
  width: 100%;
}
#right-b {
  width: 556px;
  height: 249px;
  float: left;
  margin: 140px 0 0 0;
}
.bigger {
  font-family: '微软雅黑';
  font-size: 100px;
  color: #333333;
  letter-spacing: 5px;
  width: 100%;
  height: 140px;
}
.content {
  font-family: MicrosoftYaHei;
  font-size: 16px;
  color: #999999;
  letter-spacing: 0;
  width: 100%;
  height: 20px;
  margin-bottom: 50px;
}
#right-b > a > input {
  width: 130px;
  height: 30px;
  background: #108ee9;
  border-radius: 4px;
  border: none;
  color: #ffffff;
  font-family: '微软雅黑';
  font-size: 14px;
  outline: none;
}
</style>
