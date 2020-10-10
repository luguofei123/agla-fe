<!--
 * @Author: sunch
 * @Date: 2020-03-13 09:33:21
 * @LastEditTime: 2020-08-21 12:27:52
 * @LastEditors: Please set LastEditors
 * @Description: 工资编制 工资数据替换导入人员模态窗口
 * @FilePath: /ufgov-vue/src/views/prs/wagePreparation/components/choiceEmpModal.vue
 -->
<template>
  <uf-modal title="导入人员" v-model="visible" @cancel="cancel" :width="900">
    <div class="searchWrap">
      <a-input placeholder="请输入姓名或编码" style="width: 300px;" v-model="searchText" allowClear />
    </div>
    <div class="treeWrap myscrollbar" ref="treeWrap">
      <ztree :setting="setting" :nodes="treeData" :searchNodeCode="searchNodeCode" @onCheck="onCheck" @searchScrollTo="searchScrollTo"></ztree>
    </div>

    <ufLocalLoading :visible="treeLoading"></ufLocalLoading>

    <template slot="footer">
      <a-button key="confirm" class="mr-10" type="primary" @click="confirm">
        确定
      </a-button>
      <a-button key="cancel" @click="cancel">
        取消
      </a-button>
    </template>
  </uf-modal>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import EmpOrgTreeLeftBoxVue from '../../../components/EmpOrgTreeLeftBox.vue'

export default {
  name: 'choiceEmpModal',
  props: ['value', 'prtypeCodeList'],
  data() {
    return {
      visible: false,
      treeLoading: false,
      treeData: [],
      searchText: '',
      setting: {
        data: {
          key: {
            name: 'empName',
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
            var zTree = $.fn.zTree.getZTreeObj(treeId)
            zTree.checkNode(treeNode, !treeNode.checked, true, true)
          },
        },
      },
      checkedNodes: [],
      searchNodeCode: '',
    }
  },
  computed: {
    ...mapState({
      empuids: (state) => state.choiceEmp.empuids,
      pfData: (state) => state.pfData,
    }),
  },
  watch: {
    value(val) {
      if (val) {
        console.log(val)
        this.visible = true
        // this.checkedKeys = this.empuids
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
          return item.code === val && item.isLeaf === 1
        })
        let arr2 = this.treeData.filter((item) => {
          return item.codeName.indexOf(val) > -1 && item.isLeaf === 1
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
    ...mapActions(['setEmpuids', 'setEmpNames']),
    /**
     * @description: 点击人员多选框
     */
    onCheck(...arg) {
      // console.log(arg)
      let treeObj = $.fn.zTree.getZTreeObj(arg[1])
      this.checkedNodes = treeObj.getCheckedNodes(true)
      console.log(this.checkedNodes)
    },
    /**
     * @description: 获取人员信息
     */
    getPrsOrgEmpTree() {
      this.treeLoading = EmpOrgTreeLeftBoxVue
      this.$axios
        .post('/ma/emp/maEmp/getMaEmpByPrtypeCodes?roleId=' + this.pfData.svRoleId, {
          prtypeCodeList: this.prtypeCodeList,
        })
        .then((result) => {
          result.data.data.forEach((item) => {
            item.id = item.rmwyid
            item.pId = '0'
            item.isLeaf = 1
          })
          let allArr = [
            {
              id: '0',
              pId: '',
              isLeaf: 0,
              empName: '全部',
              empCode: '',
              identityCode: '',
              orgName: '',
              rmwyid: '',
              sex: '',
              userId: '',
            },
          ]
          let treeData = allArr.concat(result.data.data)
          this.treeData = treeData
          this.$nextTick(() => {
            this.treeLoading = false
          })
        })
        .catch((error) => {
          // console.log(error)
          this.treeLoading = false
          if (error) this.$message.error(error)
        })
    },
    /**
     * @description: 点击取消
     */
    cancel() {
      this.searchText = ''
      this.$emit('close')
      this.visible = false
    },
    /**
     * @description: 点击确定
     */
    confirm() {
      let arr = this.checkedNodes.filter((node) => {
        return !node.isParent
      })

      let empuids = arr.map((item) => {
        return item.rmwyid
      })

      let empNames = arr.map((item) => {
        return item.empName
      })

      this.setEmpuids(empuids)
      this.setEmpNames(empNames)
      this.visible = false
      this.$emit('close')
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
.searchWrap .ant-input {
  height: 30px;
}
.searchWrap .ant-input::-webkit-input-placeholder {
  font-size: 12px;
  color: #666;
}
.ant-input-search-button {
  height: 30px;
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
