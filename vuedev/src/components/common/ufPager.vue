<!--
 * @Author: sunch
 * @Date: 2020-04-14 16:25:44
 * @LastEditTime: 2020-07-13 13:58:42
 * @LastEditors: Please set LastEditors
 * @Description: 自定义分页器
 * @FilePath: /ufgov-vue/src/components/ufPager.vue
 -->
<template>
  <div class="pager flex-between">
    <div class="footerBtns">
      <slot name="footerBtns"></slot>
    </div>
    <div class="pager-inner">
      <div class="total mr-10">
        共<span style="margin: 0 4px;">{{ pagerConfig.total }}</span
        >行
      </div>
      <div class="pageSizes mr-10">
        每页
        <div class="size" ref="size" :class="{ sizeActive: sizeListVisable }" @click="toggleShowSizeList">
          {{ pageSize }}
          <a-icon type="caret-down" class="ml-5 trans" :class="{ transTop: sizeListVisable }" />
          <div v-if="sizeListVisable" class="sizeList">
            <div v-for="item in pagerConfig.pageSizes" :key="item" :class="{ curSize: pageSize === item }" @click="onClickSizeItem(item)">{{ item }}</div>
          </div>
        </div>
        行
      </div>
      <div v-if="pageNum > 6" class="pagesWrap mr-10">
        <div class="jumpPrevBtn" :class="{ btnDisabled: pagerConfig.currentPage === 1 }" @click="onCLickJumpPrevBtn"><a-icon type="vertical-right" /></div>
        <div class="prevBtn" :class="{ btnDisabled: pagerConfig.currentPage === 1, br: pagerConfig.currentPage != 1 }" @click="onCLickPrevBtn"><a-icon type="left" /></div>
        <div v-for="item in maxIndex" :key="item">
          <div v-if="item > maxIndex - max" @click="onClickPageBtn(item)" :class="{ active: item === pagerConfig.currentPage, br0: item + 1 === pagerConfig.currentPage }" class="pageBtns">{{ item }}</div>
        </div>
        <div class="nextBtn" :class="{ btnDisabled: pagerConfig.currentPage === pageNum }" @click="onCLickNextBtn"><a-icon type="right" /></div>
        <div class="jumpNextBtn" :class="{ btnDisabled: pagerConfig.currentPage === pageNum }" @click="onCLickJumpNextBtn"><a-icon type="vertical-left" /></div>
      </div>
      <div v-else class="pagesWrap mr-10">
        <div class="jumpPrevBtn" :class="{ btnDisabled: pagerConfig.currentPage === 1 }" @click="onCLickJumpPrevBtn"><a-icon type="vertical-right" /></div>
        <div class="prevBtn" :class="{ btnDisabled: pagerConfig.currentPage === 1, br: pagerConfig.currentPage != 1 }" @click="onCLickPrevBtn"><a-icon type="left" /></div>
        <div v-for="item in pageNum" :key="item" @click="onClickPageBtn(item)" :class="{ active: item === pagerConfig.currentPage, br0: item + 1 === pagerConfig.currentPage }" class="pageBtns">{{ item }}</div>
        <div class="nextBtn" :class="{ btnDisabled: pagerConfig.currentPage === pageNum }" @click="onCLickNextBtn"><a-icon type="right" /></div>
        <div class="jumpNextBtn" :class="{ btnDisabled: pagerConfig.currentPage === pageNum }" @click="onCLickJumpNextBtn"><a-icon type="vertical-left" /></div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'ufPager',
  props: {
    pagerConfig: {
      type: Object,
      default: () => {
        return {
          tableName: '', //用于localStorage记录分页
          currentPage: 1, //当前第几页
          pageSizes: [20, 50, 100, 200, '全部'], //列表可传全部
          total: 0, //总数
          pageSize: 20 //当前选择的
        }
      }
    }
  },
  data() {
    return {
      max: 5, //分页最大显示的数量
      maxIndex: 5,
      pageSize: 20,
      sizeListVisable: false
    }
  },
  computed: {
    pageNum() {
      // console.log(this.pagerConfig)
      if (!this.pagerConfig.total || !this.pageSize) {
        return 0
      }
      if (this.pageSize != '全部') {
        let num = Math.floor(this.pagerConfig.total / this.pageSize),
          y = this.pagerConfig.total % this.pageSize
        // console.log(num, y)
        if (y === 0) {
          return num
        } else {
          return num + 1
        }
      } else {
        return 1
      }
    }
  },
  mounted() {
    this.pageSize = this.pagerConfig.pageSize
    let pageSize = localStorage.getItem(this.pagerConfig.tableName + 'PageSize')
    // console.log(pageSize)
    if (this.pagerConfig.tableName && pageSize) {
      if (pageSize != '全部') {
        pageSize = parseInt(pageSize)
      }
      this.pageSize = pageSize
      this.$emit('page-change', { currentPage: this.pagerConfig.currentPage, pageSize: pageSize }, true)
    }
    document.addEventListener('click', e => {
      if (this.$refs.size) {
        if (!this.$refs.size.contains(e.target)) {
          this.sizeListVisable = false
        }
      }
    })
  },
  methods: {
    /**
     * @description: 切换pageSizes的隐藏与显示
     */
    toggleShowSizeList() {
      this.sizeListVisable = !this.sizeListVisable
    },
    /**
     * @description: 选择pageSize
     */
    onClickSizeItem(size) {
      localStorage.setItem(this.pagerConfig.tableName + 'PageSize', size)
      this.pageSize = size
      this.$emit('page-change', { currentPage: this.pagerConfig.currentPage, pageSize: this.pageSize })
    },
    /**
     * @description: 点击页码
     */
    onClickPageBtn(page) {
      if (this.pageNum > 6) {
        if (page < this.pageNum - 1) {
          this.maxIndex = page + 2
        }
      }
      this.pagerConfig.currentPage = page
      this.$emit('page-change', { currentPage: page, pageSize: this.pageSize })
    },
    /**
     * @description:
     */
    onCLickJumpPrevBtn() {
      if (this.pagerConfig.currentPage === 1) {
        return
      }
      this.maxIndex = this.max
      this.pagerConfig.currentPage = 1
      this.$emit('page-change', { currentPage: this.pagerConfig.currentPage, pageSize: this.pageSize })
    },
    onCLickPrevBtn() {
      if (this.pagerConfig.currentPage === 1) {
        return
      }
      if (this.pageNum > 6) {
        if( this.pagerConfig.currentPage < this.pageNum - 1){
          if (this.maxIndex > this.max) {
            this.maxIndex--
          }
        }
      } else {
        this.maxIndex = this.max
      }
      this.pagerConfig.currentPage > 1 ? (this.pagerConfig.currentPage = this.pagerConfig.currentPage - 1) : this.pagerConfig.currentPage
      this.$emit('page-change', { currentPage: this.pagerConfig.currentPage, pageSize: this.pageSize })
    },
    onCLickNextBtn() {
      if (this.pagerConfig.currentPage === this.pageNum) {
        return
      }
      if (this.pageNum > 6) {
        if( this.pagerConfig.currentPage > 2){
          if (this.maxIndex < this.pageNum) {
            this.maxIndex++
          }
        }
      } else {
        this.maxIndex = this.max
      }
      if (this.pagerConfig.currentPage < this.pageNum) {
        this.pagerConfig.currentPage = this.pagerConfig.currentPage + 1
      }
      this.$emit('page-change', { currentPage: this.pagerConfig.currentPage, pageSize: this.pageSize })
    },
    onCLickJumpNextBtn() {
      if (this.pagerConfig.currentPage === this.pageNum) {
        return
      }
      if (this.pageNum > 6) {
        this.maxIndex = this.pageNum
      } else {
        this.maxIndex = this.max
      }
      this.pagerConfig.currentPage = this.pageNum
      this.$emit('page-change', { currentPage: this.pagerConfig.currentPage, pageSize: this.pageSize })
    }
  }
}
</script>
<style lang="scss" scoped>
@import '@/assets/styles/variable.scss';
.pager {
  height: 40px;
  box-sizing: border-box;
  padding: 4px 0;
  border: 1px solid #d9d9d9;
  border-top: 0;
  background-color: #f8f8f9;
  font-size: 12px;
  color: #333333;
  user-select: none;
  position: relative;
}
.flex-between{
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.footerBtns{
  padding-left: 10px;
}
.flex-end {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
.pager-inner {
  display: flex;
  align-items: center;
}
.pagesWrap {
  display: flex;
  align-items: center;
  border-left: 1px solid #d9d9d9;
  box-sizing: border-box;
}
.pageSizes {
  display: flex;
  justify-content: center;
  align-items: center;
}
.size {
  position: relative;
  width: 60px;
  height: 24px;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 5px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  cursor: pointer;
}
.sizeList {
  width: 60px;
  position: absolute;
  bottom: 32px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  background-color: #fff;
  color: #666;
  padding-top: 2px;
  cursor: pointer;
}
.sizeList div {
  display: flex;
  justify-content: center;
  align-items: center;
  padding-bottom: 2px;
}
.sizeActive {
  border: 1px solid #ccc;
}
.sizeActive .sizeList {
  border: 1px solid #ccc;
}
.curSize {
  color: $uf-primary-color;
  font-weight: bold;
}
.trans {
  transition: transform 0.3s ease;
}
.transTop {
  transform: rotate(180deg);
}
.jumpPrevBtn,
.prevBtn,
.pageBtns,
.nextBtn,
.jumpNextBtn {
  height: 30px;
  box-sizing: border-box;
  background-color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}
.jumpPrevBtn,
.prevBtn,
.nextBtn,
.jumpNextBtn {
  width: 38px;
  font-size: 14px;
}
.pageBtns {
  width: 32px;
  border-top: 1px solid #d9d9d9;
  border-bottom: 1px solid #d9d9d9;
}
.prevBtn {
  border-top: 1px solid #d9d9d9;
  border-bottom: 1px solid #d9d9d9;
}
.jumpPrevBtn,
.pageBtns,
.nextBtn,
.jumpNextBtn {
  border: 1px solid #d9d9d9;
  border-left: 0;
}
.pageBtns.active {
  background-color: $uf-primary-color;
  color: #fff;
  border: 1px solid $uf-primary-color;
}
.btnDisabled {
  color: #ccc;
  cursor: not-allowed;
}
.br0 {
  border-right: 0;
}
.bl {
  border-left: 1px solid #d9d9d9;
}
.br {
  border-right: 1px solid #d9d9d9;
}
</style>
