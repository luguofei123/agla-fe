<!--
 * @Author: sunch
 * @Date: 2020-06-28 19:34:37
 * @LastEditTime: 2020-07-06 19:29:49
 * @LastEditors: Please set LastEditors
 * @Description: 方案tab列表
 * @FilePath: /agla-fe-8.50/vuedev/src/views/gl/rpt/components/prjTabs.vue
-->
<template>
  <div class="tabWrap" v-show="prjList.length > 0">
    <div v-if="tabWidth > showTabWidth && showTabWidth > 0" class="prevTab" :class="{ 'not-allowed': tabLeft >= 0 }" @click="onClickPrevTab">
      <a-icon class="tab-btn-icon" type="left" />
    </div>
    <div v-if="tabWidth > showTabWidth && showTabWidth > 0" class="nextTab" :class="{ 'not-allowed': showTabWidth - tabLeft  >= tabWidth }" @click="onClickNextTab">
      <a-icon class="tab-btn-icon" type="right" />
    </div>
    <div class="tabInner" :class="tabWidth <= showTabWidth?'tabInnerNoBtns':''" ref="showTab">
      <ul class="tab" :class="tabWidth <= showTabWidth?'tabNoBtns':''" ref="tab" :style="{ left: tabLeft + 'px' }">
        <li v-for="item in prjList" :key="item.prjCode" :class="{ active: tabCode === item.prjCode }" @click="onClickPrjMenuItem(item)">
          <span :title="item.prjName">{{ item.prjName }}</span>
          <span class="qryCount">{{ item.qryCount }}</span>
          <a-icon class="del-prj-icon" type="close-circle" theme="filled" @click.stop="onClickDelPrj(item)" />
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import { delPrjList, getPrjContent } from '../common/service/service'
export default {
  name: 'PrjTab',
  data() {
    return {
      // f: [
      //   { prjName: '啊', qryCount: 0 },
      //   { prjName: '方案名称', qryCount: 1 },
      //   { prjName: '方案', qryCount: 2 },
      //   { prjName: '方案名称', qryCount: 3 },
      //   { prjName: '方案名称', qryCount: 4 },
      //   { prjName: '方案名称', qryCount: 5 },
      //   { prjName: '方案名称名称', qryCount: 6 },
      // ], //点击查询方案按钮显示方案列表
      showTabWidth: 0, //tab的显示区域宽度
      tabWidth: 0, //tab总体宽度 包括未显示的
      tabLeft: 0, //tab向左移动的距离
      tabCode: '', //激活的tab位的prjCode
      focusIndex: 0, //tab显示的第一个li的下标
    }
  },
  mounted() {
    //.outerWidth
    this.showTabWidth = this.$(this.$refs.showTab).outerWidth() //tab的显示区域宽度
    this.tabWidth = this.$(this.$refs.tab).outerWidth() //tab总体宽度 包括未显示的
    // console.log(this.showTabWidth, this.tabWidth)
    //首次加载，如果进入页面有方案列表，默认查询第一个方案并显示结果
  },
  computed: {
    ...mapState({
      pfData: (state) => state.pfData, // 全局的commonData 用户当前登陆公共信息
      agencyCode: (state) => state.glRptJournal.agencyCode, // 单位代码
      agencyName: (state) => state.glRptJournal.agencyName, // 单位名称
      acctCode: (state) => state.glRptJournal.acctCode, // 账套代码
      acctName: (state) => state.glRptJournal.acctName, // 账套名称
      acctChanged: (state) => state.glRptJournal.acctChanged, // 账套改变状态
      prjList:  (state) => state.glRptJournal.prjList, // 方案列表
      savePrjCode: (state) => state.glRptJournal.savePrjCode, //如果执行了保存 需要高亮的方案代码
      prjCode: (state) => state.glRptJournal.prjCode //store方案代码
    }),
  },
  watch: {
    /**
     * @description: 通过一个标记来判断，如果账套有过改变，则查询方案列表数据
     */
    acctChanged(state){
      console.log(state)
      if(state && this.acctCode){
        this.reloadPrjTab()
      }
      this.setAcctChanged(false)
    },
    /**
     * @description: 方案列表数据变化 tab的内外宽度要重新计算
     */
    prjList(list){
      // console.log(list)
      this.$nextTick(() => {
        this.focusIndex = 0
        this.tabLeft = 0
        this.showTabWidth = this.$(this.$refs.showTab).outerWidth() //tab的显示区域宽度
        this.tabWidth = this.$(this.$refs.tab).outerWidth() //tab总体宽度 包括未显示的
        // console.log(this.tabWidth, this.showTabWidth)
      })
    },
    /**
     * @description: 如果执行过保存
     */
    savePrjCode(prjCode){
      if(prjCode){
        if(this.prjList && this.prjList.length > 0){
          let prjItem = null
          this.prjList.forEach(item => {
            if(item.prjCode === prjCode){
              prjItem = item
            }
          })
          this.setPrjCode('')
          this.setNowPrj('')
          this.tabLeft = 0
          this.tabCode = ''
          this.focusIndex = 0
          this.onClickPrjMenuItem(prjItem)
          //成功之后重置为空
          this.setSavePrjCode('')
        }
      }
    }
  },
  methods: {
    ...mapActions(['setAgencyCode', 'setAcctCode', 'setSelectedData', 'setQryItemData', 'getPrjList', 'setNowPrj', 'setPrjCode', 'setPrjContent', 'setPrjScope', 'setStadAmtFrom', 'setStadAmtTo', 'setSavePrjCode', 'setPrjGuid', 'setAcctChanged']),
    /**
     * @description: 点击“上一个tab”按钮
     */
    onClickPrevTab() {
      if (this.focusIndex > 0) {
        --this.focusIndex
        let moveDis =
          this.$('.tab li')
            .eq(this.focusIndex)
            .outerWidth() + 8
        this.tabLeft += moveDis
      }
    },
    /**
     * @description: 点击“下一个tab”按钮
     */
    onClickNextTab() {
      if (this.focusIndex < this.prjList.length - 1) {
        //获取tab已经向左移动的距离
        let dis = Math.abs(this.$('.tab').css('left').replace('px', ''))
        if (dis < this.tabWidth - this.showTabWidth) {
          //获取当前焦点标签的宽度
          let moveDis =this.$('.tab li').eq(this.focusIndex).outerWidth() + 8
          ++this.focusIndex
          this.tabLeft -= moveDis
          setTimeout(()=>{
            dis = Math.abs(this.$('.tab').css('left').replace('px', ''))
            console.log(dis, this.tabWidth - this.showTabWidth)
          }, 500)
        }
      }
    },
    /**
     * @description: 重新加载方案，清除选中的方案,如果有方案默认选择第一个方案
     */
    reloadPrjTab(){
      this.setPrjCode('')
      this.setNowPrj('')
      this.tabLeft = 0
      this.tabCode = ''
      this.focusIndex = 0
      this.getPrjData(() => {
          //如果有方案，选中第一个方案
          if(this.prjList && this.prjList.length > 0){
            this.onClickPrjMenuItem(this.prjList[0])
          }
      })
    },
    /**
     * @description: 获取方案列表，保持当前选中的方案
     */
    getPrjData(callback) {
      this.getPrjList(callback)
    },
    /**
     * @description: 点击方案列表中的一个方案
     */
    onClickPrjMenuItem(item) {
      this.tabCode = item.prjCode
      this.setPrjCode(item.prjCode)
      this.setNowPrj(item.prjName)
      let param = {
        prjCode: item.prjCode,
        rptType: item.rptType,
        setYear: item.setYear,
        acctCode: this.acctCode,
        agencyCode: this.agencyCode,
        userId: this.pfData.svUserId,
      }
      getPrjContent(param)
        .then((result) => {
          if (result.data.flag == 'fail') {
            throw result.data.msg
          } else {
            let res = result.data.data
            // console.log(res)
            //方案为空的处理
            if(!res){
              this.setPrjCode('')
              this.setPrjGuid('')
              throw '方案内容为空'
            }
            //回写单位账套会有问题 先不回写
            // this.setAgencyCode(res.agencyCode)
            // this.setAcctCode(res.acctCode)
            this.setPrjCode(res.prjCode)
            this.setPrjGuid(item.prjGuid)
            this.setSelectedData({})
            //单位名称 账套名称 会计体系 也要跟着改变
            //初始化查询方案的查询条件  由于双向绑定会显示到页面上
            let queryConfig = res.prjContent
            const queryConfigObj = JSON.parse(queryConfig)
            let copy = JSON.parse(queryConfig)
            this.setPrjContent(copy)
            let rptCondItem = queryConfigObj.rptCondItem,
              rptOption = queryConfigObj.rptOption,
              qryItems = queryConfigObj.qryItems,
              qryItemData = [],
              qrySelectItemData = {},
              stadAmtFrom = '',
              stadAmtTo = '';
            qryItems.forEach((item) => {
              let initQryItemCode = true
              if(item.items.length > 0){
                item.items.forEach(it => {
                  if(initQryItemCode && it.isLeaf == 1){
                    qrySelectItemData[item.itemType] = it.code
                    initQryItemCode = false
                  }
                })
              }
              qryItemData.push(item)
            })
            this.setQryItemData(qryItemData)
            this.setSelectedData(qrySelectItemData)
            if (rptCondItem.length > 0) {
              rptCondItem.forEach((item) => {
                if (item.condCode === 'stadAmtFrom') {
                  stadAmtFrom = item.condValue
                }
                if (item.condCode === 'stadAmtTo') {
                  stadAmtTo = item.condValue
                }
              })
              this.setStadAmtFrom(stadAmtFrom)
              this.setStadAmtTo(stadAmtTo)
            }
            //设置方案作用域
            this.setPrjScope(Number(item.prjScope))
            this.$emit('prjChange')
          }
        })
        .catch((error) => {
          console.log(error)
          this.$message.error(error)
        })
    },
    /**
     * @description: 删除方案
     */
    onClickDelPrj(item) {
      let that = this
      let title = '您确定要删除方案吗?',
      reloadFn = this.getPrjData
      //如果当前方案正在被查询 
      if(item.prjCode === this.prjCode){
        title = '当前方案正被用于查询，删除会刷新方案列表并重新选择方案，确定要删除方案吗?'
        reloadFn = this.reloadPrjTab
      }
      //弹出提示 是否确认删除
      this.$confirm({
        title: title,
        content: '',
        okText: '确定',
        cancelText: '取消',
        onOk() {
          let param = {
            agencyCode: that.agencyCode,
            prjCode: item.prjCode,
            rptType: 'GL_RPT_JOURNAL',
            setYear: that.pfData.svSetYear,
            userId: that.pfData.svUserId,
          }
          console.log(delPrjList)
          delPrjList(param).then((result) => {
            if (result.data.flag === 'fail') {
              that.$message.error(result.data.msg)
            } else {
              that.$message.success(result.data.msg)
            }
            reloadFn() // 查询方案列表
          })
        },
        onCancel() {},
      })
    },
  },
}
</script>
<style lang="scss" scoped>
@import '@/assets/styles/variable.scss';
.tabWrap {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  padding: 10px 0 9px 0;
  box-sizing: border-box;
  user-select: none;
}
.prevTab,
.nextTab {
  width: 26px;
  height: 26px;
  background: #ecf6fd;
  border-radius: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  cursor: pointer;
}
.prevTab {
  float: left;
}
.nextTab {
  float: right;
}
.not-allowed {
  cursor: not-allowed;
}
.tab-btn-icon {
  color: #108ee9;
  font-size: 12px;
}
.tabInner {
  overflow: hidden;
  position: absolute;
  left: 34px;
  right: 34px;
  top: 10px;
  bottom: 9px;
  white-space: nowrap;
}
.tabInnerNoBtns{
  right: 0;
  left: 0;
}
.tab {
  position: absolute;
  top: 0;
  bottom: 0;
  width: auto;
  height: 26px;
  overflow: hidden;
  transition: all 0.3s ease;
}
.tabNoBtns{
  position: relative;
  float: right;
}
.tab li {
  display: inline-block;
  position: relative;
  min-width: 60px;
  height: 100%;
  box-sizing: border-box;
  padding: 4px 24px 4px 10px;
  color: #666;
  font-size: 12px;
  background: #f3f3f3;
  border-radius: 4px;
  font-weight: 400;
  margin-right: 8px;
  cursor: pointer;
  overflow: hidden;
  span {
    float: left;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    display: inline-block;
    max-width: 132px;
  }
}
.tab .active {
  color: #108ee9;
  font-weight: 500;
  background: #ecf6fd;
}
.qryCount {
  margin-left: 5px;
  color: #ccc;
}
.del-prj-icon {
  display: none;
  position: absolute;
  right: 6px;
  top: 50%;
  margin-top: -7px;
  color: #666;
  font-size: 14px;
}
.tab li:hover .del-prj-icon {
  display: inline-block;
}
.tab .active:hover .del-prj-icon {
  display: inline-block;
  color: #108ee9;
}
</style>
