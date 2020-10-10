<!--
 * @Author: sunch
 * @Date: 2020-06-18 11:03:42
 * @LastEditTime: 2020-06-28 19:41:51
 * @LastEditors: Please set LastEditors
 * @Description: !!!废弃!!! 第一版做的方案下拉列表，根据需求已改为该目录下PrjTabs组件，此组件不再更新，仅仅作为备用参考
 * @FilePath: /agla-fe-8.50/vuedev/src/views/gl/rpt/components/PrjButton.vue
-->
<template>
  <div>
    <!-- 方案列表按钮 -->
    <a-button class="ant-dropdown-link" ref="dropMenu" type="primary" @click="togglePrjClick">
      <a-icon type="file-text" />
      <div v-if="dropMenuVisable">
        <div v-if="prjList.length > 0">
          <ul class="dropMenu myscrollbar">
            <li class="dropMenuItemWrap" v-for="item in prjList" :key="item.prjCode">
              <div class="dropMenuItem" @click="onClickPrjMenuItem(item, item.prjName, item.prjScope)">{{ item.prjName }}</div>
              <div class="prjDel" @click="onClickDelPrj(item)">
                <a-icon type="close" />
              </div>
            </li>
          </ul>
        </div>
        <ul v-else class="dropMenu">
          <li style="padding: 5px 10px;">当前没有方案可选择</li>
        </ul>
      </div>
    </a-button>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import { getPrjList, delPrjList, getPrjContent } from '../common/service/service'
export default {
  name: 'PrjButton',
  data() {
    return {
      //查询方案
      dropMenuVisable: false, //查询方案 方案列表显示
      prjList: [], //点击查询方案按钮显示方案列表
      prjCode: '', //用户选择的方案编号 用于保存方案和保存后的回写
      qryItemsSave: [], //用于方案回写赋值
    }
  },
  created() {
      // console.log(this.acctCode)
  },
  mounted() {
      // console.log(this.acctCode)
  },
  computed: {
      ...mapState({
        pfData: state => state.pfData,// 全局的commonData 用户当前登陆公共信息
        agencyCode: state => state.glRptJournal.agencyCode, // 单位代码
        agencyName: state => state.glRptJournal.agencyName, // 单位名称
        acctCode: state => state.glRptJournal.acctCode, // 账套代码
        acctName: state => state.glRptJournal.acctName, // 账套名称
      }),
  },
  watch: {
      agencyCode(val){
          this.getPrjData()
      }
  },
  methods: {
    ...mapActions(['setAgencyCode', 'setAcctCode', 'setCheckedData', 'setQryItemData', 'setNowPrj', 'setPrjContent', 'setPrjScope', 'setStadAmtFrom', 'setStadAmtTo']),
    /**
     * @description: 点击查询方案按钮 控制方案列表的隐藏与显示
     */
    togglePrjClick() {
      this.dropMenuVisable = !this.dropMenuVisable
    },
    /**
     * @description: 获取查询方案
     */
    getPrjData() {
      this.setNowPrj('') // 刷新方案列表，清除选中的方案
      const params = {
        rptType: 'GL_RPT_JOURNAL',
        agencyCode: this.agencyCode,
        acctCode: this.acctCode,
        setYear: this.pfData.svSetYear,
      }
        //   params.menuId = this.menuId // 明细账
        //   params._ = new Date().getTime() // 时间戳
      getPrjList(params)
        .then((result) => {
          if (result.data.flag == 'fail') {
            throw result.data.msg
          } else {
            this.prjList = result.data.data
          }
        })
        .catch((error) => {
          this.$message.error(error)
        })
    },
    /**
     * @description: 点击方案列表中的一个方案
     */
    onClickPrjMenuItem(item, prjName, prjScope) {
      this.setNowPrj(prjName)
      //设置方案作用域
      this.setPrjScope(Number(prjScope))
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
            if (!result.data.data) {
              throw '方案内容为空'
            }
            let res = result.data.data
            console.log(res)
            this.setAgencyCode(res.agencyCode)
            this.setAcctCode(res.acctCode)
            //单位名称 账套名称 会计体系 也要跟着改变
            //初始化查询方案的查询条件  由于双向绑定会显示到页面上
            let queryConfig = res.prjContent
            const queryConfigObj = JSON.parse(queryConfig)
            console.log(queryConfigObj)
            this.setPrjContent(queryConfigObj)
            let rptCondItem = queryConfigObj.rptCondItem,
            rptOption = queryConfigObj.rptOption,
            qryItems = queryConfigObj.qryItems,
            qryItemData = [],
            qryItemCheckedData = {},
            stadAmtFrom = '',
            stadAmtTo = ''
            //把会计科目放在第一个
            // qryItems.forEach(item => {
            //   if(item.itemType === 'ACCO'){
            //     qryItemData[0] = item
            //     let checkedCodes = []
            //     item.items.forEach(obj => {
            //       checkedCodes.push(obj.code)
            //     })
            //     qryItemCheckedData[item.itemType] = checkedCodes
            //   }
            // })
            qryItems.forEach(item => {
              qryItemData.push(item)
              let checkedCodes = []
              item.items.forEach(obj => {
                checkedCodes.push(obj.code)
              })
              qryItemCheckedData[item.itemType] = checkedCodes
            })
            this.setQryItemData(qryItemData)
            this.setCheckedData(qryItemCheckedData)
            if(rptCondItem.length > 0){
                rptCondItem.forEach(item =>{
                    if(item.condCode === 'stadAmtFrom'){
                        stadAmtFrom = item.condValue
                    }
                    if(item.condCode === 'stadAmtTo'){
                        stadAmtTo = item.condValue
                    }
                })
                this.setStadAmtFrom(stadAmtFrom)
                this.setStadAmtTo(stadAmtTo)
            }
            if(rptOption.length > 0){
                this.setRptOption(rptOption)
            }
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
      //弹出提示 是否确认删除
      this.$confirm({
        title: '您确定要删除方案吗?',
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
          delPrjList(param).then((result) => {
            if (result.data.flag === 'fail') {
              that.$message.error(result.data.msg)
            } else {
              that.$message.success(result.data.msg)
            }
            that.getPrjData() // 查询方案列表
          })
        },
        onCancel() {},
      })
    },
  },
}
</script>
<style lang="scss" scoped>
// 方案列表相关
.dropMenu {
  max-width: 200px;
  position: absolute;
  top: 32px;
  right: 0;
  margin-top: 4px;
  margin-right: 2px;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  z-index: 999;
  color: #333;
  max-height: 200px;
  overflow-y: auto;
}
.dropMenuItemWrap {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.dropMenuItem {
  width: 100%;
  height: 30px;
  padding: 4px 5px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
}
.dropMenuItem:hover {
  background-color: #eee;
}
.prjDel {
  padding: 8px 8px;
  margin-left: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.prjDel:hover {
  background-color: #eee;
}
</style>
