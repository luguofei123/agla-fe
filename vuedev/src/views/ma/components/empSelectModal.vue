<!--
 * @Author: sunch
 * @Date: 2020-07-15 16:35:47
 * @LastEditTime: 2020-08-21 12:28:24
 * @LastEditors: Please set LastEditors
 * @Description: 人员选择
 * @FilePath: /agla-fe-8.50/vuedev/src/views/prs/components/empSelectModal.vue
-->
<template>
  <uf-modal title="选择人员" v-model="visible" @cancel="cancel" :width="900">
    <div class="searchWrap">
      <a-input placeholder="请输入姓名或编码" style="width: 300px;" v-model="searchText" allowClear />
    </div>
    <div class="treeWrap myscrollbar" ref="treeWrap">
      <ztree :setting="setting" :nodes="treeData" :searchNodeCode="searchNodeCode" @onClick="onClick" @searchScrollTo="searchScrollTo"></ztree>
    </div>

    <ufLocalLoading :visible="treeLoading"></ufLocalLoading>

    <template slot="footer">
      <a-button key="confirm" type="primary" class="mr-10" @click="confirm" :disabled="!empCode">
        确定
      </a-button>
      <a-button key="cancel" @click="cancel">
        取消
      </a-button>
    </template>
  </uf-modal>
</template>
<script>
import { mapState } from 'vuex'

export default {
  name: 'choiceEmpModal',
  props: ['value'],
  data() {
    return {
      visible: false,
      treeLoading: false,
      treeData: [],
      simpleData: [], //排序之后的扁平化数据
      searchText: '',
      searchContent: '',
      empObj: null, //
      empCode: '', //选择的人员编码
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
        },
        callback: {
          /**
           * @description: 判断是否能点击
           */
          beforeClick: (treeId, treeNode) => {
            if (treeNode.isLeaf === '1') {
              return true
            } else {
              return false
            }
          }
        },
      },
      searchNodeCode: '', //使用搜索筛选出的code
    }
  },
  computed: {
    ...mapState({
      pfData: (state) => state.pfData,
    }),
  },
  watch: {
    value(val) {
      if (val) {
        // console.log(val)
        this.visible = true
        //如果显示 调用获取人员接口
        this.getPrsOrgEmpTree()
      }
    },
    /**
     * @description: 搜索框内容变化
     */
    searchText(val) {
      if (val) {
        this.treeLoading = true
        let arr1 = this.treeData.filter((item) => {
          return item.code === val && item.isLeaf === '1'
        })
        let arr2 = this.treeData.filter((item) => {
          return item.codeName.indexOf(val) > -1 && item.isLeaf === '1'
        })
        let arr = arr1.concat(arr2)
        if (arr.length > 0) {
          this.searchNodeCode = arr[0].code
        } else {
          this.searchNodeCode = ''
        }
        this.treeLoading = false
      } else {
        this.searchNodeCode = ''
      }
    },
  },
  methods: {
    /**
     * @description: 获取人员信息
     */
    getPrsOrgEmpTree() {
      this.treeLoading = true
      this.$axios
        .get('/ma/emp/prsOrg/getPrsOrgEmpTree?roleId=' + this.pfData.svRoleId)
        .then((result) => {
            this.treeLoading = false
          if (result.data.flag === 'success') {
            this.treeData = result.data.data
          } else {
            throw result.data.msg
          }
        })
        .catch(this.$showError)
    },
    clear() {
      this.searchText = ''
      this.treeData = []
    },
    /**
     * @description: 点击取消
     */
    cancel() {
      this.clear()
      this.$emit('close')
      this.visible = false
    },
    /**
     * @description: 点击确定
     */
    confirm() {
      if (this.empCode) {
        this.$emit('close', this.empObj)
        this.visible = false
      }
    },
    onClick(...arg) {
      this.empObj = { code: arg[2].code, name: arg[2].name }
      this.empCode = arg[2].code
    },
    searchClear() {
      this.searchText = ''
    },
    searchScrollTo(val) {
      let el = this.$refs.treeWrap
      this.$(el).scrollTop(val - 10)
    },
  },
}
</script>
<style>
.searchBg {
  background-color: #e6f4fd;
}
</style>
<style scoped>
.searchWrap {
  padding-bottom: 10px;
}
.treeWrap {
  height: 250px;
  overflow-y: auto;
}
</style>
