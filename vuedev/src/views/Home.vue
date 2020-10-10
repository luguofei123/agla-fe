<template>
  <a-layout id="components-layout-demo-side" style="min-height: 100vh">
    <a-layout-sider collapsible v-model="collapsed" :collapsedWidth="50" :width="150" :trigger="null">
      <!-- <div class="logo" style="background-color: #0066ff; height: 40px;"/> -->
      <div style="display:flex;background-color: #0066ff; height: 40px;">
        <div @click="trigger" style="color: #fff;width: 50px;height: 100%;display: flex;justify-content: center;align-items: center;cursor: pointer;"><a-icon type="bars" style="font-size: 20px;"/></div>
        <!-- <div class="projectName" v-if="!collapsed">财务云</div> -->
      </div>
      <a-menu theme="dark" mode="vertical">
        <a-sub-menu v-for="item in routerLinkData" :key="item.moduleCode">
          <span slot="title">
            <a-icon :type="item.icon" />
            <span>{{item.routes[0].meta.moduleName}}</span>
          </span>
          <a-menu-item v-for="it in item.routes" :key="it.name"><router-link :to="it.path">{{it.meta.menuName}}</router-link></a-menu-item>
        </a-sub-menu>
      </a-menu>
    </a-layout-sider>
    <a-layout>
      <a-layout-header style="display:flex;justify-content: space-between;background-color: #0066ff; padding: 0; height: 40px" >
        <div class="searchWrap">
          <!-- <div class="projectName" v-if="collapsed">财务云</div> -->
          <a-select
            class="menu-search-Select"
            showSearch
            :value="searchValue"
            placeholder="菜单搜索"
            style="width: 400px"
            :defaultActiveFirstOption="false"
            :showArrow="false"
            :filterOption="false"
            @search="onSearch"
            @change="onSearchChange"
            :notFoundContent="null"
          >
            <a-select-option class="select-option" v-for="item in searchList" :key="item.name">
              <div class="select-item">
                <div class="select-item-row"><div class="routeMenuName">{{item.meta.menuName}}</div><div class="subModuleName">{{item.meta.subModuleName}}</div></div>
                <div class="select-item-row"><div class="routePath">{{item.path}}</div><div class="moduleInfo">{{item.meta.moduleName}}[{{item.moduleCode}}]</div></div>
              </div>
            </a-select-option>
          </a-select>
        </div>
        <div class="username">当前代理用户名：{{username}}</div>
      </a-layout-header>
      <a-layout-content v-if="moduleName&&menuName" style="margin: 0 16px">
        <a-breadcrumb style="height: 30px;line-height: 20px;box-sizing: border-box;padding: 5px 0;">
          <a-breadcrumb-item>{{moduleName}}</a-breadcrumb-item>
          <a-breadcrumb-item>{{menuName}}</a-breadcrumb-item>
        </a-breadcrumb>
        <div :style="{ padding: '0 15px 15px 15px', background: '#fff' }">
          <router-view />
        </div>
      </a-layout-content>
      <!-- <a-layout-footer style="text-align: center">
        Ant Design ©2018 Created by Ant UED
      </a-layout-footer> -->
    </a-layout>
  </a-layout>
</template>

<script>
  // @ is an alias to /src
  import { mapState } from 'vuex'
  import { routes, devRoutes, incomeRouter } from '@/assets/js/routes'
  function hasStr(str, ctx) {
    str = str.trim().toLowerCase()
    ctx = ctx.trim().toLowerCase()
    return str.indexOf(ctx)>-1
  }
  export default {
    name: 'home',
    data(){
      return {
        username: localStorage.getItem('username')?localStorage.getItem('username'):'',
        collapsed: true,
        routerLinkData: null,
        searchValue: '',
        searchList: [],
        routeArr: []
      }
    },
    created(){
      let obj = {}
      let routeArr = routes.concat(incomeRouter)
      routeArr = routeArr.concat(devRoutes)
      let current = 0
      routeArr.forEach((item, index) =>{
        if (item.isShow === false) {
          return
        }
        if(item.path === '*'){
          current = index
        }else{
          if(!obj[item.moduleCode]) {
            obj[item.moduleCode] = {
              icon: '',
              routes: []
            }
            switch(item.moduleCode){
              case 'ma':
                obj[item.moduleCode].icon = 'database'
                break;
              case 'gl':
                obj[item.moduleCode].icon = 'account-book'
                break;
              case 'prs':
                obj[item.moduleCode].icon = 'money-collect'
                break;
              case 'pub':
                obj[item.moduleCode].icon = 'appstore'
                break;
              case 'cu':
                obj[item.moduleCode].icon = 'calculator'
                break;
            }
          }
          obj[item.moduleCode].routes.push(item)
        }
      })
      routeArr.splice(current,1)
      this.routeArr = routeArr
      this.searchList = routeArr
      this.routerLinkData = obj
      console.log(this.routerLinkData)
    },
    computed: {
      ...mapState({
        moduleName: state => state.moduleName,
        menuName: state => state.menuName,
      }),
    },
    methods:{
      trigger(){
        this.collapsed = !this.collapsed
      },
      onSearchChange(value){
        // console.log(value)
        this.$router.push({name: value})
      },
      onSearch(value){
        // console.log(value)
        let rest = []
        this.routeArr.forEach(item =>{
          if(item.path!='*'){
            if(hasStr(item.meta.menuName, value)
            ||hasStr(item.meta.subModuleName, value)
            ||hasStr(item.path, value)
            ||hasStr(item.meta.moduleName, value)
            ||hasStr(item.moduleCode, value)){
              rest.push(item)
            }
          }
        })
        this.searchList = rest
      }
    }
  }
</script>

<style>
.router-link-wrap{
  padding: 10px 0;
}
.router-link-wrap a{
  margin-right: 20px;
}
.searchWrap{
  display: flex;
  align-items: center;
}
.select-item{
  border-bottom: 1px solid #d9d9d9;
  box-sizing: border-box;
  padding: 0 0 5px 0;
}
.select-item-row{
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.projectName{
  font-size: 16px;
  color: #fff;
  line-height: 40px;
  padding-left: 10px;
}
.username{
  height: 100%;
  font-size: 16px;
  color: #fff;
  text-align: right;
  line-height: 40px;
  padding-right: 15px;
}
.select-option{
  padding-bottom: 0;
}
.routeMenuName{
  font-weight: bold;
  color: #333;
}
.subModuleName{
  font-size: 12px;
  color: #666;
}
.moduleInfo {
  font-size: 12px;
  color: #999;
}
.routePath{
  font-size: 12px;
  color: #FFCC66;
}
</style>
