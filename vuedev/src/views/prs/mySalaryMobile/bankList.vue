<!--
 * @Author: sunch
 * @Date: 2020-08-04 10:05:10
 * @LastEditTime: 2020-08-06 10:33:01
 * @LastEditors: Please set LastEditors
 * @Description: 获取银行类别或开户银行
 * @FilePath: /agla-fe-8.50/vuedev/src/views/prs/mySalaryMobile/components/BankList.vue
-->
<template>
  <div class="main" ref="main">
    <MintHeader ref="MintHeader" type="detail" :title="title"> </MintHeader>

    <div class="searchWrap" ref="search">
      <div class="inputWrap">
        <div class="searchIcon">
          <img src="../../../assets/imgs/search.png" />
        </div>
        <input type="text" class="searchInput" v-model="searchText" />
        <div class="clearIcon" v-show="!!searchText" @click="clearSearch">
          <img src="../../../assets/imgs/clear.png" />
        </div>
      </div>
    </div>

    <div class="listWrap" :style="{ height: listH + 'px' }">
      <div class="list" v-if="listData.length > 0">
        <div class="listItem" v-for="item in filterData" :key="item.code" @click="selectItem(item)">
          <span>{{ item.name }}</span>
          <img src="../../../assets/imgs/selected.png" class="selected" v-show="curSelected === item.code" />
        </div>
      </div>
      <div v-else class="noData">
        {{noDataTip}}
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import MintHeader from './components/MintHeader'
export default {
  name: 'BankList',
  props: {},
  data() {
    return {
      title: '',
      listH: 0, //需要计算的滚动区域高度
      searchText: '',
      listData: [],
      filterData: [],
      bankCategoryCode: '',
      bankCode: '',
      curSelected: '', //当前选择的code
      type: '', //跳转回编辑银行卡页面的类型参数
      paramData: {},
      noDataTip: ''
    }
  },
  components: {
    MintHeader,
  },
  watch: {
    searchText(val){
      if(val&&this.listData.length > 0){
        let rest = this.listData.filter(item => {
          return item.name.indexOf(val) > -1
        })
        this.filterData = rest
      }else{
        this.filterData = this.listData
      }
    }
  },
  computed: {
    ...mapState({
      tokenId: (state) => state.tokenId,
    }),
  },
  created() {
    let param = this.$route.query
    this.paramData = param
    this.type = param.type
    if (this.type === 'bankCategory') {
      this.title = '选择银行类别'
      this.bankCategoryCode = param.bankCategoryCode
      if (this.bankCategoryCode) this.curSelected = this.bankCategoryCode
      this.selectBankCategoryTree()
    } else if (this.type === 'bankCode') {
      this.title = '选择开户银行'
      this.bankCategoryCode = param.bankCategoryCode
      this.bankCode = param.bankCode
      if (this.bankCode) this.curSelected = this.bankCode
      this.selectBankTree()
    }
  },
  mounted() {
    let mainEl = this.$refs.main,
      headerEl = this.$refs.MintHeader.$el,
      searchEl = this.$refs.search
    this.listH = $(mainEl).outerHeight() - $(headerEl).outerHeight() - $(searchEl).outerHeight()
  },
  methods: {
    selectBankTree() {
      this.$Indicator.open({
        text: '加载中...',
        spinnerType: 'snake'
      })
      this.$axios
        .get('/ma/emp/maEmp/selectAppBankTree?bankCategoryCode=' + this.bankCategoryCode + '&tokenid=' + this.tokenId)
        .then((result) => {
          this.$Indicator.close()
          if (result.data.flag === 'success') {
            this.listData = result.data.data
            this.filterData = this.listData
            if(this.listData.length === 0){
              this.noDataTip = '当前' + this.title + '的列表无数据'
            }
          } else {
            throw result.data.msg
          }
        })
        .catch((error) => {
          this.$Toast({
            message: error,
            position: 'middle',
            duration: 3000,
            iconClass: 'icon icon-warning',
          })
        })
    },
    selectBankCategoryTree() {
      this.$Indicator.open({
        text: '加载中...',
        spinnerType: 'snake'
      })
      this.$axios
        .get('/ma/emp/maEmp/selectAppBankCategoryTree?tokenid=' + this.tokenId)
        .then((result) => {
          this.$Indicator.close()
          if (result.data.flag === 'success') {
            this.listData = result.data.data
            this.filterData = this.listData
            if(this.listData.length === 0){
              this.noDataTip = '当前' + this.title + '的列表无数据'
            }
          } else {
            throw result.data.msg
          }
        })
        .catch((error) => {
          this.$Toast({
            message: error,
            position: 'middle',
            duration: 3000,
            iconClass: 'icon icon-warning',
          })
        })
    },
    selectItem(item) {
      this.curSelected = item.code
      let query = {
        ...this.paramData
      }
      query.tokenid = this.tokenId
      query.type = this.type
      if (this.type === 'bankCategory') {
        query.bankCategoryCode = item.code
        query.bankCategoryName = item.name
      } else if (this.type === 'bankCode') {
        query.bankCode = item.code
        query.bankName = item.name
      }
      this.$router.replace({
        name: 'editBankCardMobile',
        query: query,
      })
    },
    clearSearch() {
      this.searchText = ''
    },
  },
}
</script>
<style>
.main {
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
}
.searchWrap {
  padding: 0.24rem 0.3rem;
  box-sizing: border-box;
  background: #fff;
}
.inputWrap {
  width: 100%;
  height: 0.68rem;
  background-color: #f9f9f9;
  border-radius: 0.06rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
  padding: 0.14rem 0.24rem;
}
.searchInput {
  height: 0.4rem;
  background: transparent;
  border: 0;
  outline: none;
  flex: 1;
  margin-left: 0.1rem;
  color: #333;
  font-size: 14px;
}
.searchIcon img {
  height: 0.34rem;
  width: auto;
}
.clearIcon img {
  width: 0.32rem;
  height: 0.32rem;
}
.listWrap {
  padding: 0.2rem 0;
  box-sizing: border-box;
  overflow-y: auto;
}
.list {
  padding: 0 0.3rem;
  background: #fff;
}
.listItem {
  font-size: 15px;
  color: #333;
  padding: 0.25rem 0;
  border-bottom: 0.5px solid #e8e8e8;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.selected {
  width: 0.36rem;
  height: 0.36rem;
}
.noData{
  padding: .3rem;
  font-size: 16px;
  font-weight: 500;
  text-align: center;
  color: #666;
}
</style>
