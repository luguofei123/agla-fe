<!--
 * @Author: sunch
 * @Date: 2020-06-11 16:07:14
 * @LastEditTime: 2020-08-21 12:29:38
 * @LastEditors: Please set LastEditors
 * @Description: 左侧部门树 用于 => 部门人员信息 人员工资类别
 * @FilePath: /agla-fe-8.50/vuedev/src/components/orgTreeLeftBox.vue
-->
<template>
  <div class="orgTreeWrap">
    <div class="orgTreeBoxHeader">
      <div class="headerTitle">部门</div>
      <slot name="orgTreeHeadBtn"></slot>
    </div>

    <div class="searchWrap">
      <a-input-search class="orgTreeSearch" allowClear ref="filterText" v-model="searchText" @search="onSearch" placeholder="请输入部门名称关键词">
        <a-button class="flex-c-c" slot="enterButton">
          <a-icon style="padding-top: 5px;" ref="searchIcon" type="search" />
        </a-button>
      </a-input-search>
    </div>
    <div class="orgTree myscrollbar" ref="treeWrap" :style="{height: !showFooter? 'calc(100% - 90px)' : 'calc(100% - 130px)'}">
      <ztree :setting="setting" :nodes="treeData" :searchNodeCode="searchNodeCode" @onCheck="onCheck" @searchScrollTo="searchScrollTo"></ztree>
      <ufLocalLoading :visible="treeLoading"></ufLocalLoading>
    </div>
    <div class="orgTreeFooter" v-if="showFooter">
      <a class="btn btn-icon-only btn-sm department-delete" :class="getBtnPer('btn-delete')" data-toggle="tooltip" title="删除">
        <span class="glyphicon icon-trash"></span>
      </a>
      <a class="btn btn-icon-only btn-sm department-start" :class="getBtnPer('department-start')" data-toggle="tooltip" title="启用">
        <span class="glyphicon icon-play"></span>
      </a>
      <a class="btn btn-icon-only btn-sm department-stop" :class="getBtnPer('department-stop')" data-toggle="tooltip" title="停用">
        <span class="glyphicon glyphicon icon-ban"></span>
      </a>
    </div>
  </div>
</template>
<script>
import * as $ from "jquery";
import { getBtnPer } from '@/assets/js/util'
import { construct } from '@aximario/json-tree'
export default {
  name: 'OrgTreeLeftBox',
  props: {
    showFooter: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      searchText: '',
      treeData: [],
      treeLoading: false,
      setting: {
        data: {
          key: {
            name: 'codeName',
          },
          simpleData: {
            enable: true,
          },
        },
        check: {
          enable: true,
        },
        view: {
          showLine: false,
          showIcon: false,
          nodeClasses: function(treeId, treeNode) {
            return treeNode.highlight ? { add: ['searchBg'] } : { remove: ['searchBg'] }
          },
        },
        callback: { 
          onClick: (e, treeId, treeNode) => {
            var zTree = $.fn.zTree.getZTreeObj(treeId);
            zTree.checkNode(treeNode, !treeNode.checked, true, true); 
          } 
        },
      },
      searchNodeCode: '', //使用搜索筛选出的code
    }
  },
  created() {
    this.treeLoading = true
    this.$axios
      .get('/ma/emp/prsOrg/getPrsOrgTree')
      .then((result) => {
        if(result.data.flag === 'fail') {
          this.treeLoading = false
          throw result.data.msg
        }
        let allObj = {
          code: '',
          codeName: '全部',
          id: '0',
          isLeaf: '0',
          name: '全部',
          pId: '',
        }
        this.treeData = [allObj].concat(result.data.data)
        this.$nextTick(() => {
          this.treeLoading = false
        })
      })
      .catch((error) => {
        console.log(error)
        if (error) {
          this.$message.error(error)
        }
      })
  },
  methods: {
    getBtnPer,
    onSearch(val) {
      if (val) {
        this.treeLoading = true
        let arr1 = this.treeData.filter((item) => {
          return item.code === val
        })
        let arr2 = this.treeData.filter((item) => {
          return item.codeName.indexOf(val) > -1
        })
        let arr = arr1.concat(arr2)
        if (arr.length > 0) {
          this.searchNodeCode = arr[0].code
        } else {
          this.searchNodeCode = ''
        }
        console.log(this.searchNodeCode)
        this.treeLoading = false
      } else {
        this.searchNodeCode = ''
      }
    },
    /**
     * @description: 点击人员多选框
     */
    onCheck(...arg){
      console.log(arg)
      let treeObj = $.fn.zTree.getZTreeObj(arg[1])
      let nodes = treeObj.getCheckedNodes(true)
      console.log(nodes)
      let orgCodes = []
      nodes.forEach(node => {
        if(!node.isParent){
          orgCodes.push(node.code)
        }
      })
      this.$emit('change', orgCodes)
    },
    searchScrollTo(val) {
      let el = this.$refs.treeWrap
      this.$(el).scrollTop(val - 10)
    },
  },
}
</script>
<style>
.searchBg{
  background-color: #E6F4FD;
}
.orgTreeSearch .ant-input {
  height: 30px;
}
.orgTreeSearch .ant-input::-webkit-input-placeholder {
  font-size: 12px;
  color: #666;
}
.ant-input-search-button {
  height: 30px;
}
</style>
<style lang="scss" scoped>
.orgTreeWrap {
  position: relative;
  border: 1px solid #dfe6ec;
  height: 100%;
  box-sizing: border-box;
}
.orgTreeBoxHeader {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 42px;
  padding: 0 10px;
  border-bottom: 1px solid #dfe6ec;
}
.headerTitle {
  color: #333;
  font-size: 16px;
}
.searchWrap {
  padding: 8px 10px 10px 10px;
  background: #fff;
}

.orgTreeSearch {
  width: 218px;
  height: 30px;
  margin-right: 5px;
  border-right: 0;
  box-sizing: border-box;
}
.orgTree {
  position: relative;
  height: calc(100% - 130px);
  overflow: auto;
  padding-left: 10px;
  box-sizing: border-box;
}
.orgTreeFooter {
  height: 40px;
  border-top: 1px solid #d9d9d9;
  box-sizing: border-box;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  background: #fff;
}
.department-delete,
.department-start,
.department-stop {
  font-size: 20px;
  margin-right: 4px;
  display: flex;
  width: 20px;
  height: 20px;
}
</style>
