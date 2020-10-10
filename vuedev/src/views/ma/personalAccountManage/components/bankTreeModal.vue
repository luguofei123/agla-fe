<!--
 * @Author: sunch
 * @Date: 2020-07-20 14:30:05
 * @LastEditTime: 2020-08-21 12:28:00
 * @LastEditors: Please set LastEditors
 * @Description: 开户银行选择树
 * @FilePath: /agla-fe-8.50/vuedev/src/views/ma/personalAccountManage/components/bankTreeModal.vue
-->
<template>
  <uf-modal title="选择开户银行" v-model="visible" @cancel="cancel" :width="600">
    <div class="searchWrap">
      <a-input-search placeholder="请输入网点名称或编码" class="searchInput" allowClear ref="filterText" @change="onSearchChange" @search="onSearch">
        <a-button class="searchButton" slot="enterButton">
          <a-icon style="padding-bottom: 4px;" ref="searchIcon" type="search" />
        </a-button>
      </a-input-search>
    </div>
    <div class="treeWrap myscrollbar" ref="treeWrap">
      <ztree :setting="setting" :nodes="treeData" :searchNodeCode="searchNodeCode" @onClick="onClick" @searchScrollTo="searchScrollTo"></ztree>
    </div>

    <ufLocalLoading :visible="treeLoading"></ufLocalLoading>

    <template slot="footer">
      <a-button key="confirm" type="primary" class="mr-10" @click="confirm" :disabled="!bankCode">
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
  name: 'bankTreeModal',
  props: ['value', 'bankCategoryCode'],
  data() {
    return {
      visible: false,
      treeLoading: false,
      treeData: [],
      searchText: '',
      bankObj: {},
      bankCode: '',
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
    bankCategoryCode(val) {
      console.log(val)
    },
    value(val) {
      if (val) {
        this.visible = val
        this.getBankTree()
      }
    },
  },
  methods: {
    onSearch(val) {
      if (!val) {
        this.treeLoading = true
        setTimeout(() => {
          this.searchNodeCode = ''
          this.treeLoading = false
        }, 0)
        return
      }
      this.treeLoading = true
      setTimeout(() => {
        this.searchText = val
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
      }, 0)
    },
    /**
     * @description: 搜索内容改变
     */
    onSearchChange(e) {
      if (e.target.value == '') {
        this.treeLoading = true
        setTimeout(() => {
          this.searchText = ''
          this.searchNodeCode = ''
          this.treeLoading = false
        }, 0)
      }
    },
    clear() {
      this.searchText = ''
      this.treeData = []
    },
    cancel() {
      this.clear()
      this.$emit('close')
      this.visible = false
    },
    confirm() {
      if (this.bankCode) {
        this.clear()
        this.$emit('close', this.bankObj)
        this.visible = false
      }
    },
    /**
     * @description: 开户银行列表
     */
    getBankTree() {
      this.treeLoading = true
      this.$axios
        .get('/ma/emp/maEmp/selectBankTree', {
          params: {
            bankCategoryCode: this.bankCategoryCode,
            roleId: this.pfData.svRoleId,
            rgCode: this.pfData.svRgCode,
            setYear: this.pfData.svSetYear,
          },
        })
        .then((result) => {
          if (result.data.flag === 'success') {
            this.treeData = result.data.data
            this.treeLoading = false
          } else {
            this.treeLoading = false
            throw result.data.msg
          }
        })
        .catch(this.$showError)
    },
    onClick(...arg) {
      // console.log(arg[2])
      this.bankObj = { code: arg[2].code, name: arg[2].name, province: arg[2].province, city: arg[2].city, pbcbankno: arg[2].pbcInterBankNo }
      // console.log(this.bankObj)
      this.bankCode = arg[2].code
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
<style lang="scss" scoped>
.searchWrap {
  padding-bottom: 10px;
}
.treeWrap {
  height: 200px;
  overflow-y: auto;
}
.searchInput{
  width: 300px;
  height: 30px;
  margin-right: 5px;
  border-right: 0
}
.searchButton{
  box-sizing: border-box;
  padding-top: 5px;
  cursor: pointer;
}
</style>
