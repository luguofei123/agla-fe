<!--
 * @Author: sunch
 * @Date: 2020-06-28 19:34:37
 * @LastEditTime: 2020-09-29 19:04:29
 * @LastEditors: Please set LastEditors
 * @Description: 方案tab列表
 * @FilePath: /agla-fe-8.50/vuedev/src/views/gl/rpt/components/prjTabs.vue
-->
<template>
  <div class="tabWrap" v-show="prjList.length > 0">
    <div v-if="prjListV.length > 0" class="nextTab" ref="nextTabWrap" @click="togglePrjClick">
      <i class="glyphicon icon-angle-bottom" type="down"></i>
      <!-- 方案列表下拉框 开始 -->
      <div v-if="dropMenuVisable">
        <div v-if="prjListV.length > 0">
          <ul class="dropMenu myscrollbar">
            <li class="dropMenuItemWrap" v-for="item in prjListV" :key="item.prjCode">
              <div class="dropMenuItem" @click="onClickPrjMenuItem(item)">
                <span class="prjName" :title="item.prjName">{{ item.prjName }}</span>
                <span class="qryCount">{{ item.qryCount }}</span>
              </div>
              <div class="prjDel" @click="onClickDelPrj(item)" :class="getBtnPer('btn-delete')">
                <span class="glyphicon icon-close"></span>
              </div>
              <div class="clear"></div>
            </li>
          </ul>
        </div>
        <ul v-else class="dropMenu">
          <li style="padding: 5px 10px;">当前没有方案可选择</li>
        </ul>
      </div>
      <!-- 方案列表下拉框 结束 -->
    </div>
    <!-- 方案标签tab 开始 -->
    <div class="tabInner" :class="prjListV.length == 0?'tabInnerNoBtns':''" ref="showTab">
      <ul class="tab" :class="prjListV.length == 0?'tabNoBtns':''" ref="tab">
        <li
          v-for="item in prjListH"
          :key="item.prjCode"
          :class="{ active: tabCode === item.prjCode }"
          @click="onClickPrjMenuItem(item)"
        >
          <span :title="item.prjName">{{ item.prjName }}</span>
          <span class="qryCount">{{ item.qryCount }}</span>
          <a
            class="glyphicon icon-cross-circle del-prj-icon"
            @click.stop="onClickDelPrj(item)"
            :class="getBtnPer('btn-delete')"
          ></a>
        </li>
      </ul>
    </div>
    <!-- 方案标签tab 结束 -->
  </div>
</template>
<script>
import { mapState, mapActions } from "vuex";
import { delPrjList, getPrjContent } from "../common/service/service";
import { getBtnPer } from "@/assets/js/util";
import { getAccItemTree } from "../common/service/service";
import store from "@/store/index";
let rptName = store.state.rpt.rptName;
const checkableList = ["glRptBal"];

export default {
  name: "PrjTab",
  props: {
    rptType: {
      type: String,
    },
  },
  data() {
    return {
      showTabWidth: 0, //tab的显示区域宽度
      tabWidth: 0, //tab总体宽度 包括未显示的
      tabCode: "", //激活的tab位的prjCode
      dropMenuVisable: false, //查询方案 方案列表显示
      prjListH: [], // 方案横向内容
      prjListV: [], // 方案纵向内容
      prjListN: 0, // 方案横向存放数量
    };
  },
  mounted() {
    this.showTabWidth = this.$(this.$refs.showTab).outerWidth(); //tab的显示区域宽度
    this.tabWidth = this.$(this.$refs.tab).outerWidth(); //tab总体宽度 包括未显示的
    document.addEventListener("click", (e) => {
      if (
        this.$refs.nextTabWrap &&
        !this.$refs.nextTabWrap.contains(e.target)
      ) {
        this.dropMenuVisable = false;
      }
    });
  },
  computed: {
    ...mapState({
      pfData: (state) => state.pfData, // 全局的commonData 用户当前登陆公共信息
      agencyCode: (state) => state[rptName].agencyCode, // 单位代码
      agencyName: (state) => state[rptName].agencyName, // 单位名称
      acctCode: (state) => state[rptName].acctCode, // 账套代码
      acctName: (state) => state[rptName].acctName, // 账套名称
      acctChanged: (state) => state[rptName].acctChanged, // 账套改变状态
      prjList: (state) => state[rptName].prjList, // 方案列表
      savePrjCode: (state) => state[rptName].savePrjCode, //如果执行了保存 需要高亮的方案代码
      prjCode: (state) => state[rptName].prjCode, //store方案代码
      fromRmisFlag: (state) => state[rptName].fromRmisFlag, //报表跳转标记
      pageType: (state) => state.rpt.rptName,
    }),
  },
  watch: {
    /**
     * @description: 通过一个标记来判断，如果账套有过改变，则查询方案列表数据
     */
    acctChanged(state) {
      if (state && this.acctCode) {
        if (this.fromRmisFlag) {
          this.$showLoading();
          this.setPrjCode("");
          this.setNowPrj("");
          this.tabCode = "";
          this.getPrjList().then(() => {
            this.$hideLoading();
          });
        } else if (this.$route.query.dataFrom) {
          // dataFrom 的值 glRptLedger 和 glRptBal
          this.initPrjTab()
            .then((result) => {
              this.$hideLoading();
              //从其它页面跳转过来把查询参数也带过来
              this.initPrjMenuItem(this.$route.query.dataFrom);
            })
            .catch(this.$showError);
        } else {
          this.reloadPrjTab();
        }
      }
      this.setAcctChanged(false);
    },
    /**
     * @description: 方案列表数据变化 tab的内外宽度要重新计算
     */
    prjList(list) {
      this.$nextTick(() => {
        this.showTabWidth = this.$(this.$refs.showTab).outerWidth(); //tab的显示区域宽度
        this.tabWidth = this.$(this.$refs.tab).outerWidth(); //tab总体宽度 包括未显示的
        // 单个方案最大宽度200+8
        this.prjListN = Math.floor(this.showTabWidth / 208);
        if (this.prjCode) {
          this.changePrjList(this.prjCode);
        } else {
          this.prjListH = list.slice(0, this.prjListN);
          this.prjListV = list.slice(this.prjListN);
        }
      });
    },
    prjListH(newVal) {},
    prjListV(newVal) {},
    prjListN(newVal) {},
    /**
     * @description: 如果执行过保存
     */
    savePrjCode(prjCode) {
      if (prjCode) {
        if (this.prjList && this.prjList.length > 0) {
          let prjItem = null;
          this.prjList.forEach((item) => {
            if (item.prjCode === prjCode) {
              prjItem = item;
            }
          });
          this.setPrjCode("");
          this.setNowPrj("");
          this.tabCode = "";
          this.onClickPrjMenuItem(prjItem, true);
          //成功之后重置为空
          this.setSavePrjCode("");
        }
      }
    },
  },
  methods: {
    getBtnPer,
    ...mapActions([
      "setAgencyCode",
      "setAcctCode",
      "setSelectedData",
      "setQryItemData",
      "getPrjList",
      "setNowPrj",
      "setPrjCode",
      "setPrjContent",
      "setPrjScope",
      "setStadAmtFrom",
      "setStadAmtTo",
      "setSavePrjCode",
      "setPrjGuid",
      "setAcctChanged",
      "setChoicePrjSuccessAfterSave"
    ]),
    /**
     * @description: 重新加载方案，清除选中的方案,如果有方案默认选择第一个方案
     */
    reloadPrjTab() {
      this.$showLoading();
      this.setPrjCode("");
      this.setNowPrj("");
      this.tabCode = "";
      this.getPrjList().then((result) => {
        this.$hideLoading();
        //如果有方案，选中第一个方案
        if (this.prjList && this.prjList.length > 0) {
          this.onClickPrjMenuItem(this.prjList[0]);
        }
      });
    },
    /**
     * @description: 从其它页面跳转到明细账页面的方案查询方法
     */
    initPrjTab() {
      this.$showLoading();
      this.setPrjCode("");
      this.setNowPrj("");
      this.tabCode = "";
      return this.getPrjList().then((result) => {
        this.$hideLoading();
      });
    },
    /**
     * @description: 修改方案列表显示顺序
     */
    changePrjList(prjCode) {
      let arr = JSON.parse(JSON.stringify(this.prjList));
      let obj = arr.splice(
        arr.findIndex((e) => e.prjCode === prjCode),
        1
      );
      arr = obj.concat(arr);
      this.prjListH = arr.slice(0, this.prjListN);
      this.prjListV = arr.slice(this.prjListN);
    },
    /**
     * @description: 点击方案列表中的一个方案，在这里做数据回写，更新查询方案中的选中复选框
     * @param {Object} item 方案参数对象
     * @param {Boolean} afterSave 是否是在保存之后才自动点击的方案
     */
    onClickPrjMenuItem(item, afterSave) {
      //方案列表显示顺序
      this.changePrjList(item.prjCode);
      this.tabCode = item.prjCode;
      this.setPrjCode(item.prjCode);
      this.setNowPrj(item.prjName);
      let param = {
        prjCode: item.prjCode,
        rptType: item.rptType,
        setYear: item.setYear,
        acctCode: this.acctCode,
        agencyCode: this.agencyCode,
        userId: this.pfData.svUserId,
      };
      this.$showLoading();
      getPrjContent(param)
        .then((result) => {
          this.$hideLoading();
          if (result.data.flag == "fail") {
            throw result.data.msg;
          } else {
            let res = result.data.data;
            //方案为空的处理
            if (!res) {
              this.setPrjCode("");
              this.setPrjGuid("");
              throw "方案内容为空";
            }
            //方案的相关code和id
            this.setPrjCode(res.prjCode);
            this.setPrjGuid(item.prjGuid);
            //重置选中的数据
            this.setSelectedData({});
            //单位名称 账套名称 会计体系 也要跟着改变
            //初始化查询方案的查询条件  由于双向绑定会显示到页面上
            let queryConfig = res.prjContent;
            const queryConfigObj = JSON.parse(queryConfig);
            //设置查询方案
            this.setPrjContent(queryConfigObj);
            /**
             * @rptCondItem {Array} 方案中的内容，主要包含金额起 金额止
             * @qryItems {Array} 方案中的辅助项查询条件
             * @qryItemData {Array}  用于回写的辅助项查询条件
             * @qrySelectItemData {Object} 如果是明细账页面。辅助项查询条件中，构造的
             * {辅助项代码}-{String 第一个可选辅助项的值} 键值对形式，用来初始化页面辅助项下拉框
             * 如果是余额表页面，{辅助项代码}-{Array 多个选辅助项的值}
             * @stadAmtFrom {String} 金额起
             * @stadAmtTo  {String} 金额止
             */
            let rptCondItem = queryConfigObj.rptCondItem,
              // rptOption = queryConfigObj.rptOption,
              qryItems = queryConfigObj.qryItems,
              qrySelectItemData = {},
              stadAmtFrom = "",
              stadAmtTo = "";
            if (
              checkableList.some((type) => {
                return this.pageType === type;
              })
            ) {
              qryItems.forEach((item) => {
                if (item.items.length > 0) {
                  qrySelectItemData[item.itemType] = [];
                  item.items.forEach((it) => {
                    qrySelectItemData[item.itemType].push(it.code);
                  });
                }
              });
            } else {
              qryItems.forEach((item) => {
                if (item.items.length > 0) {
                  qrySelectItemData[item.itemType] = item.items[0].code;
                }
              });
            }
            this.setQryItemData(qryItems);
            this.setSelectedData(qrySelectItemData);
            if (rptCondItem.length > 0) {
              rptCondItem.forEach((item) => {
                if (item.condCode === "stadAmtFrom") {
                  stadAmtFrom = item.condValue;
                }
                if (item.condCode === "stadAmtTo") {
                  stadAmtTo = item.condValue;
                }
              });
              this.setStadAmtFrom(stadAmtFrom);
              this.setStadAmtTo(stadAmtTo);
            }
            //设置方案作用域
            this.setPrjScope(Number(item.prjScope));
            if(afterSave){
              this.setChoicePrjSuccessAfterSave(true)
              // console.log('已在保存方案成功之后自动选择了该方案！')
            }
          }
        })
        .catch(this.$showError);
    },
    /**
     * @description: 从其它页面跳转到明细账页面，在这里做数据回写，更新查询方案中的选中复选框
     */
    initPrjMenuItem(dataFrom) {
      this.$showLoading()
      let arguName = `from_${dataFrom}Params`;
      let opt = JSON.parse(localStorage.getItem(arguName));

      //方案列表显示顺序
      this.tabCode = "";
      this.setPrjCode("");
      this.setNowPrj("");
      let param = {
        prjCode: "",
        rptType: this.rptType,
        setYear: opt.setYear,
        acctCode: opt.acctCode,
        agencyCode: opt.agencyCode,
        userId: opt.userId,
      };
      //方案的相关code和id
      this.setPrjCode("");
      this.setPrjGuid("");
      //重置选中的数据
      this.setSelectedData({});
      //单位名称 账套名称 会计体系 也要跟着改变
      //初始化查询方案的查询条件  由于双向绑定会显示到页面上
      let queryConfig = opt.prjContent;
      const queryConfigObj = queryConfig;
      let copy = JSON.parse(JSON.stringify(queryConfig));
      //设置查询方案
      this.setPrjContent(copy);
      /**
       * @rptCondItem {Array} 方案中的内容，主要包含金额起 金额止
       * @qryItems {Array} 方案中的辅助项查询条件
       * @qryItemData {Array}  用于回写的辅助项查询条件
       * @qrySelectItemData {Object} 如果是明细账页面。辅助项查询条件中，构造的
       * {辅助项代码}-{String 第一个可选辅助项的值} 键值对形式，用来初始化页面辅助项下拉框
       * 如果是余额表页面，{辅助项代码}-{Array 多个选辅助项的值}
       * @stadAmtFrom {String} 金额起
       * @stadAmtTo  {String} 金额止
       */
      let rptCondItem = queryConfigObj.rptCondItem,
        // rptOption = queryConfigObj.rptOption,
        qryItems = queryConfigObj.qryItems,
        qrySelectItemData = {},
        stadAmtFrom = "",
        stadAmtTo = "";
      if (rptCondItem.length > 0) {
        rptCondItem.forEach((item) => {
          if (item.condCode === "stadAmtFrom") {
            stadAmtFrom = item.condValue;
          }
          if (item.condCode === "stadAmtTo") {
            stadAmtTo = item.condValue;
          }
        });
        this.setStadAmtFrom(stadAmtFrom);
        this.setStadAmtTo(stadAmtTo);
      }
      //设置方案作用域
      this.setPrjScope(opt.prjScope);
      if (
        checkableList.some((type) => {
          return this.pageType === type;
        })
      ) {
        qryItems.forEach((item) => {
          if (item.items.length > 0) {
            qrySelectItemData[item.itemType] = [];
            item.items.forEach((it) => {
              qrySelectItemData[item.itemType].push(it.code);
            });
          }
        });
      } else {
        qryItems.forEach((item) => {
          if (item.items.length > 0) {
            qrySelectItemData[item.itemType] = item.items[0].code;
          }
        });
      }
      getAccItemTree({
        agencyCode: this.agencyCode, // 单位
        acctCode: this.acctCode, // 账套
        setYear: this.pfData.svSetYear,
        userId: this.pfData.svUserId,
        eleCode: "ACCO",
        vouTypeCode: queryConfig.vouTypeCode, // 凭证类型
      })
      .then((result) => {
        if (result.data.flag === "fail") {
          throw result.data.msg;
        }
        this.setSelectedData(qrySelectItemData);
        //打印点击方案时的用户选中的查询项 2020.08.27
        qryItems[0].items = result.data.data
        this.setQryItemData(qryItems);
        this.$hideLoading()
      })
      .catch(this.$showError);
    },
    /**
     * @description: 删除方案
     */
    onClickDelPrj(item) {
      let that = this;
      let title = "您确定要删除方案吗?",
        reloadFn = this.getPrjList;
      //如果当前方案正在被查询
      if (item.prjCode === this.prjCode) {
        title =
          "当前方案正被用于查询，删除会刷新方案列表并重新选择方案，确定要删除方案吗?";
        reloadFn = this.reloadPrjTab;
      }
      //弹出提示 是否确认删除
      this.$confirm({
        title: title,
        content: "",
        okText: "确定",
        cancelText: "取消",
        onOk() {
          let param = {
            agencyCode: that.agencyCode,
            prjCode: item.prjCode,
            rptType: "GL_RPT_JOURNAL",
            setYear: that.pfData.svSetYear,
            userId: that.pfData.svUserId,
          };
          delPrjList(param).then((result) => {
            if (result.data.flag === "fail") {
              that.$message.error(result.data.msg);
            } else {
              that.$message.success(result.data.msg);
            }
            reloadFn(); // 查询方案列表
          });
        },
        onCancel() {},
      });
    },
    /**
     * @description: 点击查询方案按钮 控制方案列表的隐藏与显示
     */
    togglePrjClick() {
      this.dropMenuVisable = !this.dropMenuVisable;
    },
  },
};
</script>
<style lang="scss" scoped>
@import "@/assets/styles/variable.scss";
// 方案列表相关
.dropMenu {
  padding: 4px;
  width: 200px;
  max-width: 200px;
  position: fixed;
  top: 40px;
  right: 28px;
  margin-top: 4px;
  margin-right: 2px;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  z-index: 999;
  color: #333;
  max-height: 200px;
  overflow-y: auto;
  font-size: 12px;
  line-height: 16px;
  .dropMenuItemWrap {
    line-height: 30px;
    text-align: left;
    padding-right: 3px;
    .dropMenuItem {
      width: 160px;
      height: 30px;
      padding: 0 5px;
      box-sizing: border-box;
      align-items: center;
      float: left;
      .prjName {
        display: inline-block;
        max-width: 120px;
        white-space: nowrap; /* 不换行 */
        overflow: hidden; /* 超出隐藏 */
        text-overflow: ellipsis; /* 超出部分显示省略号 */
      }
      .qryCount {
        float: right;
        color: #ccc;
      }
    }
    &:hover {
      background-color: #eee;
      .prjDel {
        display: inline-block;
      }
    }
    .prjDel {
      display: none;
      float: right;
      margin-left: 2px;
    }
  }
}
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
  position: relative;
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
.tabInnerNoBtns {
  right: 0;
  left: 0;
}
.tab {
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  width: auto;
  height: 26px;
  overflow: hidden;
  transition: all 0.3s ease;
}
.tabNoBtns {
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
.tab {
  .qryCount {
    margin-left: 5px;
    color: #ccc;
  }
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
