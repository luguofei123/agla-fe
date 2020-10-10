<!--
 * @Author: sunch
 * @Date: 2020-07-08 13:53:21
 * @LastEditTime: 2020-08-21 12:29:46
 * @LastEditors: Please set LastEditors
 * @Description: 左侧部门人员树
 * @FilePath: /agla-fe-8.50/vuedev/src/components/EmpTreeByOrgLeftBox.vue
-->
<template>
  <div class="orgTreeWrap">
    <div class="orgTreeBoxHeader">
      <div class="headerTitle">部门人员</div>
      <slot name="orgTreeHeadBtn"></slot>
    </div>

    <div class="searchWrap">
      <a-input-search class="orgTreeSearch" allowClear ref="filterText" v-model="searchText" @search="onSearch(searchText)" placeholder="请输入关键词">
        <a-button class="flex-c-c" slot="enterButton">
          <a-icon style="padding-top: 5px;" ref="searchIcon" type="search" />
        </a-button>
      </a-input-search>
    </div>
    <div class="orgTree myscrollbar" ref="treeWrap">
      <ztree :setting="setting" :nodes="treeData" :searchNodeCode="searchNodeCode" @onClick="onClick" @searchScrollTo="searchScrollTo"></ztree>

      <ufLocalLoading :visible="treeLoading"></ufLocalLoading>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
export default {
  name: 'OrgTreeLeftBox',
  data() {
    return {
      searchText: '',
      searchContent: '',
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
        view: {
          showLine: false,
          showIcon: false,
          nodeClasses: function(treeId, treeNode) {
            return treeNode.highlight ? { add: ['searchBg'] } : { remove: ['searchBg'] }
          },
        }
      },
      searchNodeCode: '', //使用搜索筛选出的code
    }
  },
  computed: {
    ...mapState({
      pfData: (state) => state.pfData,
    }),
  },
  created() {
    this.treeLoading = true
    this.$axios
      .get('/ma/emp/prsOrg/getPrsOrgEmpTree?roleId=' + this.pfData.svRoleId)
      .then((result) => {
        // console.log(result)
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
      .catch(this.$showError)
  },
  methods: {
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
    onClick(...arg) {
      // console.log(arg[2])
      if(arg[2].pId === '0'){
        this.$emit('select', arg[2].code, 'orgCode')
      }else{
        this.$emit('select', arg[2].code, 'empCode')
      }
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
  height: calc(100% - 90px);
  overflow: auto;
  padding-left: 10px;
  box-sizing: border-box;
}
</style>
