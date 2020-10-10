<!--
 * @Date: 2020-06-28 19:34:37
 * @LastEditTime: 2020-09-30 14:26:03
 * @LastEditors: Please set LastEditors
 * @Description: 方案弹框抽屉
 * @FilePath: /agla-fe-8.50/vuedev/src/views/gl/rpt/components/prjTabs.vue
-->
<template>
  <div>
    <ufDrawer
      v-model="drawerVisible"
      :zIndex="99"
      :width="500"
      @drawerClose="drawerClose"
    >
      <div class="drawer-content" @click.stop>
        <div class="p-16">
          <a-row class="mb-16">
            <a-col :span="2" class="bold">查询项</a-col>
            <a-col
              :span="2"
              :offset="20"
              class="hover fr"
              @click="seeMore"
              v-if="accItemTypeList.length > 9"
            >
              <div class="fr" style="margin-top: 3px">
                <span v-if="isAllShow" class="icon icon-angle-top"></span>
                <span v-else class="icon icon-angle-bottom"></span>
              </div>
            </a-col>
          </a-row>
          <!-- 辅助项列表 -->
          <a-row
            class="content-acctype-list"
            :class="{ all: isAllShow }"
            v-if="accItemTypeListLoaded"
          >
            <a-col
              :span="8"
              class="acctype-item mb-10"
              v-for="item in accItemTypeList"
              :key="item.accItemCode"
            >
              <a-checkbox
                @change="onAccTypeChange($event, item)"
                :checked="item.isChecked"
                :disabled="item.disabled"
                >{{ item.accItemName }}</a-checkbox
              >
            </a-col>
          </a-row>
        </div>
        <div class="line"></div>
        <div class="content-tabs">
          <div class="tabs-wrap">
            <div
              class="tab-item"
              v-for="item in accItemTypeCheckList"
              :key="item.accItemCode"
              :class="{ active: isTabActive == item.accItemCode }"
              @click="handleTabItem(item)"
              :title="item.accItemName"
            >
              <span v-if="item.isShowItem === '1'">
                <a-icon type="paper-clip" />
              </span>
              {{ item.accItemName }}
            </div>
          </div>
          <div v-if="accItemTypeCheckListLoaded">
            <div
              class="tabs-main"
              v-for="item in accItemTypeCheckList"
              :key="item.accItemCode"
              v-show="isTabActive == item.accItemCode"
            >
              <div class="check-wrap">
                <a-checkbox
                  @change="onShowColBtnChange($event, item)"
                  :defaultChecked="item.isShowItem === '1'"
                  v-if="rptType !== 'GL_RPT_LEDGER'"
                  >表内显示</a-checkbox
                >
                <span class="fr hover" @click="showZtreeDrawer(item)"
                  >添加</span
                >
                <span class="fr hover clear-all" @click="clearAll(item)"
                  >清空</span
                >
              </div>
              <div class="tree-wrap myscrollbar">
                <div
                  v-if="
                    zTreeSelectedData[item.accItemCode] &&
                    zTreeSelectedData[item.accItemCode].length
                  "
                >
                  <ztree
                    :setting="zTreeSetting"
                    :nodes="zTreeSelectedData[item.accItemCode]"
                    @onCreated="onZtreeCreated"
                  ></ztree>
                </div>
                <div v-else class="iconWrap" @click="showZtreeDrawer(item)">
                  <span class="addfileIcon"></span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="line"></div>
        <div class="clear"></div>
        <!-- 辅助选项表格下方其它查询项 -->
        <ul class="content-else">
          <li style="margin-bottom: 0">
            <a-row v-if="optListDataLoaded">
              <a-col
                :span="12"
                class="mb-16"
                v-for="item in optListData"
                :key="item.optId"
              >
                <span class="opt-list">
                  <a-checkbox
                    @change="onOptChange($event, item)"
                    :defaultChecked="item.defCompoValue === 'Y' ? true : false"
                    >{{ item.optName }}</a-checkbox
                  >
                </span>
              </a-col>
            </a-row>
          </li>
          <li v-if="rptType !== 'GL_RPT_LEDGER'">
            <span class="title">金额：</span>
            <a-input
              v-model="stadAmtFrom"
              @blur="onStadAmtFromBlur"
              :maxLength="25"
              style="width: 118px"
            />
            <span style="margin: 0 8px">至</span>
            <a-input
              v-model="stadAmtTo"
              @blur="onStadAmtToBlur"
              :maxLength="25"
              style="width: 118px"
            />
          </li>
          <li v-if="rptType !== 'GL_RPT_LEDGER'">
            <span class="title">凭证类型：</span>
            <a-select
              default-value
              style="width: 118px"
              v-model="vouTypeCode"
              @change="handleVouTypeChange"
              allowClear
            >
              <a-select-option
                :value="item.code"
                v-for="item in VouTypeData"
                :key="item.code"
                >{{ item.name }}</a-select-option
              >
            </a-select>
          </li>
          <li>
            <span class="title">方案名称：</span>
            <a-input
              :maxLength="25"
              placeholder="请输入方案名称"
              v-model="nowPrj"
              style="width: 258px"
            />
          </li>
          <li>
            <a-radio-group @change="planTypeChange" v-model="prjScope">
              <a-radio :value="'1'">私有方案</a-radio>
              <a-radio :value="'2'">本单位共享</a-radio>
              <a-radio :value="'3'">全系统共享</a-radio>
            </a-radio-group>
          </li>
        </ul>
      </div>
      <template v-slot:footer>
        <div class="drawer-footer" @click.stop>
          <a-button
            class="mr-8"
            type="primary"
            @click.stop="queryHandle"
            :class="getBtnPer('btn-query')"
            >查询</a-button
          >
          <a-button
            class="mr-8"
            @click.stop="saveHandle"
            :class="getBtnPer('btn-save')"
            >保存</a-button
          >
          <a-button @click.stop="saveAsHandle" :class="getBtnPer('btn-saveadd')"
            >另存为</a-button
          >
        </div>
      </template>
    </ufDrawer>
    <acc-select-modal
      :accModalShow="accModalShow"
      :item="accItemSelect"
      :accItemTypeCheckList="accItemTypeCheckList"
      :isRemembered="isRememberedGL060"
      :zTreeSelectedData="zTreeSelectedData"
      @accModalChange="accModalChange"
    ></acc-select-modal>
  </div>
</template>

<script>
import ufDrawer from "@/components/common/ufDrawer"; //抽屉组件
import AccSelectModal from "../components/AccSelectModal"; // 设置方案
import { mapState, mapGetters, mapActions } from "vuex";
import { getBtnPer } from "@/assets/js/util";
import {
  vouTypeList,
  getOptList,
  getRptAccItemTypePost,
  postSavePrj,
  getAccItemTree,
  getSysRuleSet,
} from "../common/service/service";
import { formatMoney, revertNumMoney } from "@/assets/js/util";
import store from "@/store/index";
let rptName = store.state.rpt.rptName;
const checkableList = ["glRptBal"];

export default {
  name: "SettingProjectModal",
  components: {
    ufDrawer,
    "acc-select-modal": AccSelectModal,
  },
  props: {
    drawerVisible: {
      // 抽屉显示
      type: Boolean,
      default: false,
    },
    rptType: {
      // 账表类型 数据查询
      type: String,
      default: "",
    },
  },
  data() {
    return {
      isAllShow: false, // 辅助项列表显示全部
      accItemTypeList: [], // 辅助项列表
      accItemTypeListLoaded: false,
      accItemTypeCheckList: [], // 选择的辅助项
      accItemTypeCheckListLoaded: false,
      isTabActive: "ACCO", // 高亮项
      optListData: [], // 其他
      optListDataLoaded: false,
      stadAmtFrom: "", // 金额-起
      stadAmtTo: "", // 金额-止
      vouTypeCode: "", // 凭证类型
      VouTypeData: [], // 凭证类型列表
      accModalShow: false, // 科目选择窗口可视
      accItemSelect: null, // 当前选择的辅助项
      zTreeSelectedData: { ACCO: [] }, // 树数据
      zTreeObj: null, // 树对象
      zTreeSetting: {
        // 树配置
        data: {
          key: {
            name: "codeName",
          },
          simpleData: {
            enable: true,
          },
        },
        view: {
          showLine: false,
          showIcon: false,
          nodeClasses: function (treeId, treeNode) {
            return treeNode.highlight
              ? { add: ["highlight"] }
              : { remove: ["highlight"] };
          },
        },
      },
      isRememberedGL060: false,
      // componentKey: 0,
    };
  },
  mounted() {
    this.optList();
  },
  watch: {
    //账套改变的watch
    acctChangedFlag(newVal, oldVal) {
      if (newVal) {
        if (this.rptType === "GL_RPT_DEPPRO_JOURNAL") {
          // 财政项目明细账
          this.getRptAccItemTypeList("DEPPRO", true, true); // 获取辅助项列表
        } else {
          this.getRptAccItemTypeList("", true); // 获取辅助项列表
        }
        this.getVouTypeList(); // 获取凭证类型列表
        this.setAcctChangedFlag(false);
      }
    },
    /**
     * @description: 方案列表为空触发
     */
    prjListEmpty(state) {
      if (!state) {
        return;
      }
      this.zTreeSelectedData = { ACCO: [] };
      if (this.rptType === "GL_RPT_DEPPRO_JOURNAL") {
        // 财政项目明细账
        this.getAccItemTreeData("ACCO", (res) => {
          this.zTreeSelectedData.ACCO = res;
          let ACCOData = res;
          this.getAccItemTreeData("DEPPRO", (res1) => {
            this.zTreeSelectedData.DEPPRO = res1;
            this.accItemTypeCheckList = [
              {
                accItemCode: "ACCO",
                accItemName: "会计科目",
                isShowItem: "1",
                items: ACCOData,
              },
              {
                accItemCode: "DEPPRO",
                accItemName: "财政项目",
                isShowItem: "0",
                items: res1,
              },
            ];
            // this.setPrjContent(this.qryItemsData()); // 查询参数
            let qryTreeItems = this.treeItemsData();
            let qrySelectItemData = {},
              initQryItemCode = true;
            qryTreeItems.forEach((item) => {
              let initQryItemCode = true;
              if (item.items.length > 0) {
                item.items.forEach((it) => {
                  if (initQryItemCode && it.isLeaf == 1) {
                    qrySelectItemData[item.itemType] = it.code;
                    initQryItemCode = false;
                  }
                });
              }
            });
            if (!this.nowPrj) {
              this.setQryItemData(qryTreeItems); // 选择的查询项
              this.setSelectedData(qrySelectItemData); //设置默认选择的辅助项
            }
          });
        });
      } else {
        this.getAccItemTreeData("ACCO", (res) => {
          //初始化页面，默认勾选会计科目
          this.zTreeSelectedData.ACCO = res;
          this.accItemTypeCheckList = [
            {
              // 选择的辅助项
              accItemCode: "ACCO",
              accItemName: "会计科目",
              itemType: "ACCO",
              itemTypeName: "会计科目",
              isShowItem: "0",
              items: this.zTreeSelectedData.ACCO,
            },
          ];
          // this.setPrjContent(this.qryItemsData()); // 查询参数
          //获取已勾选辅助项的树结构
          let qryTreeItems = this.treeItemsData();
          let qrySelectItemData = {},
            initQryItemCode = true;
          qryTreeItems.forEach((item) => {
            let initQryItemCode = true;
            if (item.items.length > 0) {
              item.items.forEach((it) => {
                if (initQryItemCode && it.isLeaf == 1) {
                  qrySelectItemData[item.itemType] = it.code;
                  initQryItemCode = false;
                }
              });
            }
          });
          if (!this.nowPrj) {
            this.setQryItemData(qryTreeItems); // 选择的查询项
            this.setSelectedData(qrySelectItemData); //设置默认选择的辅助项（抽屉外的查询项）
          }
        });
      }
    },
    nowPrj(newVal, oldVal) {
      // 方案名称
      this.setNowPrj(newVal);
    },
    prjScope(newVal, oldVal) {
      // 方案作用域类型
      this.setPrjScope(newVal);
    },
    "zTreeSelectedData.ACCO": {
      handler: function (newVal, oldVal) {},
      deep: true,
    },
    /**
     * 抽屉显示时执行
     */
    drawerVisible(newVal, oldVal) {
      if (newVal) {
        setTimeout(() => {
          // 打开弹框时回写方案内容
          this.getSysRuleVal(); // 账表数据范围选择框记忆上次选择的数据
          if (this.nowPrj) {
            let qryItems = this.qryItemData; // 已选方案的辅助项数据
            if (this.rptType === "GL_RPT_DEPPRO_JOURNAL") {
              // 财政项目明细账
              // 选择框选中
              this.accItemTypeList.forEach((element) => {
                if (
                  qryItems.findIndex(
                    (e) => e.itemType === element.accItemCode
                  ) > -1 ||
                  element.accItemCode == "ACCO" ||
                  element.accItemCode == "DEPPRO"
                ) {
                  // 已选方案有该项或会计科目、财政项目
                  //修改成$set方式  modified by liwz at 2020.09.23
                  this.$set(element, "isChecked", true);
                  this.$set(
                    element,
                    "disabled",
                    element.accItemCode == "ACCO" ||
                      element.accItemCode == "DEPPRO"
                      ? true
                      : false
                  );
                } else {
                  this.$set(element, "isChecked", false);
                }
              });
            } else {
              // 除财政项目外的其它明细账页面
              // 选择框选中
              this.accItemTypeList.forEach((element, index) => {
                if (
                  qryItems.findIndex(
                    (e) => e.itemType === element.accItemCode
                  ) > -1
                ) {
                  // 已选方案有该项
                  this.$set(element, "isChecked", true);
                } else {
                  this.$set(element, "isChecked", false);
                }
              });
            }
            if (this.accItemTypeCheckList.length > 0) {
              this.isTabActive = this.accItemTypeCheckList[0].accItemCode; // 高亮项
            }
            // 查询项左侧tab
            this.accItemTypeCheckList = [];
            this.zTreeSelectedData = {}; //已选结构树数据
            qryItems.forEach((element) => {
              const item = {};
              item.isShowItem = element.isShowItem;
              item.accItemCode = element.itemType;
              item.accItemName = element.itemTypeName;
              item.itemIndex = element.itemIndex;
              item.items = element.items;
              // 对比当前单位账套下查询的辅助项列表accItemTypeList是否有该项，如果没有，不显示在此tab页签
              if (
                this.accItemTypeList.findIndex(
                  (it) => it.accItemCode === element.itemType
                ) > -1
              ) {
                this.accItemTypeCheckList.push(item);
              }
              this.zTreeSelectedData[item.accItemCode] = item.items;
            });
            let rptOption = this.reportArgument.prjContent.rptOption; // 已选方案的其他选项勾选情况
            //其它列表数组
            this.optListData.forEach((element) => {
              rptOption.forEach((item) => {
                if (element.optCode === item.optCode) {
                  element.defCompoValue = item.defCompoValue; // 是否勾选
                }
              });
            });
            this.stadAmtFrom = this.reportArgument.stadAmtFrom
              ? formatMoney(this.reportArgument.stadAmtFrom)
              : ""; // 金额-起
            this.stadAmtTo = this.reportArgument.stadAmtTo
              ? formatMoney(this.reportArgument.stadAmtTo)
              : ""; // 金额-起
            this.vouTypeCode = this.reportArgument.prjContent.vouTypeCode; // 凭证类型
            this.accItemTypeListLoaded = true;
            this.accItemTypeCheckListLoaded = true;
            this.optListDataLoaded = true;
          } else {
            this.accItemTypeListLoaded = true;
            this.accItemTypeCheckListLoaded = true;
            this.optListDataLoaded = true;
          }
          //打开抽屉后调用辅助项列表接口，让其辅助项disabled
          this.acctItemDisabledFn();
        }, 350);

        // this.$forceUpdate();
      }
    },
    accItemTypeCheckList(newVal, oldVal) {},
    accItemTypeList(newVal, oldVal) {},
    optListData(newVal, oldVal) {},
  },
  computed: {
    ...mapState({
      pfData: (state) => state.pfData, // 全局的commonData 用户当前登陆公共信息
      agencyCode: (state) => state[rptName].agencyCode, // 单位代码
      acctCode: (state) => state[rptName].acctCode, // 账套代码
      acctChangedFlag: (state) => state[rptName].acctChangedFlag, // 账套改变
      qryItemData: (state) => state[rptName].qryItemData, // 用户选择的辅助项
      pageType: (state) => state.rpt.rptName,
      rptStyle: (state) => state[rptName].prjContent.rptStyle, // 账表样式
      curCode: (state) => state[rptName].prjContent.curCode, // 币种
      startDate: (state) => state[rptName].startDate, // 开始日期
      endDate: (state) => state[rptName].endDate, // 结束日期
      prjListEmpty: (state) => state[rptName].prjListEmpty, //方案为空标记
      prjContent: (state) => state[rptName].prjContent,
    }),
    ...mapGetters({
      reportArgument: "getReportArgument",
    }),
    prjScope: {
      // 方案作用域类型
      get() {
        return String(this.$store.state[rptName].prjScope);
      },
      set(val) {
        this.setPrjScope(val);
      },
    },
    prjCode: {
      // 方案作用域code
      get() {
        return String(this.$store.state[rptName].prjCode);
      },
      set(val) {
        this.setPrjCode(val);
      },
    },
    nowPrj: {
      // 方案名称
      get() {
        return this.$store.state[rptName].nowPrj;
      },
      set(val) {
        this.setNowPrj(val);
      },
    },
  },
  methods: {
    getBtnPer,
    ...mapActions([
      "setQryItemData",
      "setPrjQryItems", //没有方案时，查询时保证参数正确
      "setPrjRptOption",
      "setNowPrj",
      "setPrjContent",
      "setPrjScope",
      "setStadAmtFrom",
      "setStadAmtTo",
      "setSavePrjCode",
      "getPrjList",
      "setSelectedData",
      "setQrySelectItemData",
      "setPrjGuid",
      "setAcctChangedFlag",
      "setDEPPROFlag",
      // "setQrySelectItemData", //设置表外查询项的默认值 2020.09.22
    ]),
    qryChecked(qryItems) {
      // 选择框选中
      this.accItemTypeList.forEach((element) => {
        if (
          this.accItemTypeCheckList.findIndex(
            (e) => e.accItemCode === element.accItemCode
          ) > -1
        ) {
          // 已选方案有该项
          this.$set(element, "isChecked", true);
          // 总账页面会计科目必选，且不可编辑
          if (rptName === "glRptLedger") {
            if (element.accItemCode === "ACCO") {
              this.$set(element, "disabled", true);
            }
          }
        } else {
          this.$set(element, "isChecked", false);
        }
      });
    },
    // 抽屉-辅助项check事件
    onAccTypeChange(e, item) {
      // 选择框选中
      this.accItemTypeList.forEach((element) => {
        if (element.accItemCode === item.accItemCode) {
          element.isChecked = e.target.checked;
        }
      });
      if (e.target.checked) {
        if (item.accItemCode !== "ACCO") {
          this.zTreeSelectedData.ACCO = [];
          //把accItemTypeCheckList中ACCO的items清空
          this.getACCOSelectedTree();
        }
        // 选择
        item.isShowItem = "0"; // 表内显示
        this.accItemTypeCheckList.push(item);
        this.isTabActive = item.accItemCode;
        this.zTreeSelectedData[item.accItemCode] = [];
      } else {
        // 取消
        this.accItemTypeCheckList.splice(
          this.accItemTypeCheckList.findIndex(
            (it) => it.accItemCode === item.accItemCode
          ),
          1
        );
        if (this.accItemTypeCheckList.length > 0) {
          this.isTabActive = this.accItemTypeCheckList[0].accItemCode;
        }
      }
      // 勾选辅助项时再查询辅助项列表，只在当前部门分类下的可以勾选 2020.09.01
      this.acctItemDisabledFn();
    },
    acctItemDisabledFn() {
      let paramList = "";
      this.accItemTypeCheckList.forEach((element) => {
        if (element.accItemCode !== "ACCO") {
          paramList += element.accItemCode + ",";
        }
      });
      // paramList += item.accItemCode;
      paramList.substring(0, paramList.length - 1);
      if (this.rptType === "GL_RPT_DEPPRO_JOURNAL") {
        // 财政项目明细账
        this.getRptAccItemTypeList(paramList, false, true);
      } else {
        this.getRptAccItemTypeList(paramList, false);
      }
    },
    // 抽屉-更多
    seeMore() {
      this.isAllShow = !this.isAllShow;
    },
    // 抽屉-表内显示按钮
    onShowColBtnChange(e, item) {
      this.accItemTypeCheckList.forEach((element) => {
        if (element.accItemCode === item.accItemCode) {
          element.isShowItem = e.target.checked ? "1" : "0";
        }
      });

      //勾选表内显示按钮时更新vuex中的qryItemData和PrjQryItems modified by liwz at 2020.09.16
      this.setQryItemData(this.treeItemsData()); // 选择的查询项
      this.setPrjQryItems(this.treeItemsData()); // 查询项
      this.$forceUpdate();
    },
    // 抽屉-其他选项
    onOptChange(e, item) {
      this.optListData.forEach((element) => {
        if (element.optCode === item.optCode) {
          element.defCompoValue = e.target.checked ? "Y" : "N";
        }
      });
    },
    // 抽屉-其他选项：获取选项列表
    optList() {
      let params = {
        menuId: this.menuId,
        rptType: this.rptType,
        roleId: this.pfData.svRoleId,
        userId: this.pfData.svUserId,
        setYear: this.pfData.svSetYear,
      };
      getOptList(params)
        .then((result) => {
          if (result.data.flag == "fail") {
            throw result.data.msg;
          } else {
            this.optListData = result.data.data;
          }
        })
        .catch((error) => {
          this.$message.error(error);
        });
    },
    handleVouTypeChange(val) {
      // 凭证类型
    },
    onStadAmtFromBlur() {
      // 金额-起
      this.stadAmtFrom = this.stadAmtFrom ? formatMoney(this.stadAmtFrom) : "";
    },
    onStadAmtToBlur() {
      // 金额-止
      this.stadAmtTo = this.stadAmtTo ? formatMoney(this.stadAmtTo) : "";
    },
    planTypeChange(e) {
      // 方案作用域类型
      this.setPrjScope(this.prjScope);
    },
    // 获取凭证类型列表
    getVouTypeList() {
      let urlParams =
        "/" +
        this.agencyCode +
        "/" +
        this.pfData.svSetYear +
        "/" +
        this.acctCode +
        "/" +
        "*";
      vouTypeList({}, {}, urlParams)
        .then((result) => {
          if (result.data.flag == "fail") {
            throw result.data.msg;
          } else {
            this.VouTypeData = result.data.data;
          }
        })
        .catch((error) => {
          this.$message.error(error);
        });
    },
    // 抽屉-切换tab
    handleTabItem(item) {
      this.isTabActive = item.accItemCode;
    },
    // 获取辅助项列表
    getRptAccItemTypeList(paramsList, isInitFlag, isDepproFlag) {
      // 参数：paramsList要查询列表所挂的辅助项参数 isInitFlag-true初始请求/false勾选查询项请求 isDepproFlag是否辅助项明细账
      let param = {
        agencyCode: this.agencyCode,
        acctCode: this.acctCode,
        setYear: this.pfData.svSetYear,
        userId: this.pfData.svUserId,
        accItemList: paramsList,
      };
      let opt = ["0"];
      //获取所有辅助项列表
      getRptAccItemTypePost(param, opt)
        .then((result) => {
          if (result.data.flag == "fail") {
            throw result.data.msg;
          } else {
            if (isInitFlag) {
              this.accItemTypeList = result.data.data;
              let DEPPROFlag =
                result.data.data.findIndex(
                  (it) => it.accItemCode === "DEPPRO"
                ) > -1
                  ? true
                  : false; // 辅助项是否包含财政项目
              if (isDepproFlag) {
                this.setDEPPROFlag(DEPPROFlag);
              }
              //初始时会计科目默认是选中状态
              this.accItemTypeList.forEach((element, index) => {
                //ACCO
                if (isDepproFlag) {
                  // 财政项目明细账：查询项显示挂会计科目和财政项目的项，没有挂的不显示，勾选会计科目和财政项目不可更改
                  if (DEPPROFlag) {
                    this.$set(
                      element,
                      "isChecked",
                      element.accItemCode === "ACCO" ||
                        element.accItemCode === "DEPPRO"
                        ? true
                        : false
                    );
                    this.$set(
                      element,
                      "disabled",
                      element.accItemCode === "ACCO" ||
                        element.accItemCode === "DEPPRO"
                        ? true
                        : false
                    );
                  } else {
                    this.$message.error("当前账套没有财政项目");
                  }
                } else {
                  if (element.accItemCode === "ACCO") {
                    this.$set(element, "isChecked", true);
                    // 总账页面会计科目必选，且不可编辑
                    if (rptName === "glRptLedger") {
                      this.$set(element, "disabled", true);
                    }
                  }
                }
              });
            } else {
              //两次取得的辅助项列表进行对比，没在列表中的即不可点选的
              // let accItemTypeList = this.accItemTypeList;
              //勾选复选框之后的辅助项列表
              let accItemTypeListCheck = result.data.data;

              this.accItemTypeList.forEach((item) => {
                let disabledFlag;
                if (isDepproFlag) {
                  // 财政项目明细账：查询项显示挂会计科目和财政项目的项，没有挂的不显示，勾选会计科目和财政项目不可更改
                  disabledFlag =
                    accItemTypeListCheck.findIndex(
                      (it) => it.accItemCode === item.accItemCode
                    ) > -1 &&
                    item.accItemCode !== "ACCO" &&
                    item.accItemCode !== "DEPPRO";
                } else {
                  disabledFlag =
                    accItemTypeListCheck.findIndex(
                      (it) => it.accItemCode === item.accItemCode
                    ) > -1;
                }
                // item.disabled = disabledFlag ? false : true;
                this.$set(item, "disabled", disabledFlag ? false : true);
              });
              // this.$forceUpdate();
              this.qryChecked(this.qryItemData);
            }
            if (isDepproFlag) {
              // 财政项目明细账
              // 将财政项目放到查询项最前面
              let tempItem;
              for (let m = 0; m < this.accItemTypeList.length; m++) {
                if (this.accItemTypeList[m].accItemCode === "DEPPRO") {
                  tempItem = this.accItemTypeList[m];
                  this.accItemTypeList.splice(m, 1);
                }
              }
              this.accItemTypeList.splice(1, 0, tempItem);
            }
          }
        })
        .catch((error) => {
          this.$message.error(error);
        });
    },
    // 组织整理查询方案参数数据
    qryItemsData() {
      let prjContent = {
        agencyAcctInfo: [
          {
            acctCode: this.acctCode,
            agencyCode: this.agencyCode,
          },
        ],
        qryItems: this.treeItemsData(), //辅助项
        rptCondItem: [
          {
            condCode: "stadAmtFrom", // 查询条件代码
            condName: "金额起", // 查询条件名称
            condText: this.stadAmtFrom ? revertNumMoney(this.stadAmtFrom) : "", // 查询条件值
            condValue: this.stadAmtFrom ? revertNumMoney(this.stadAmtFrom) : "", // 查询条件值
          },
          {
            condCode: "stadAmtTo",
            condName: "金额止",
            condText: this.stadAmtTo ? revertNumMoney(this.stadAmtTo) : "",
            condValue: this.stadAmtTo ? revertNumMoney(this.stadAmtTo) : "",
          },
        ],
        rptOption: this.optListData, // 其他
        vouTypeCode: this.vouTypeCode, // 凭证类型
        // startDate: this.startDate, // 开始日期
        // endDate: this.endDate, // 结束日期
        rptStyle: this.rptStyle, // 账表样式
        curCode: this.curCode, //货币代码
      };
      return prjContent;
    },
    // 组织整理带树结构的数据
    treeItemsData() {
      let treeItems = [];
      let index = 1;
      //遍历已选择的辅助项
      this.accItemTypeCheckList.forEach((element) => {
        const item = {};
        item.isShowItem = element.isShowItem;
        item.itemType = element.accItemCode;
        item.itemTypeName = element.accItemName;
        item.itemIndex = index++;
        item.items =
          element.items && element.items.length > 0 ? element.items : [];
        treeItems.push(item);
      });
      return treeItems;
    },
    // 点击查询按钮事件
    queryHandle() {
      if (revertNumMoney(this.stadAmtFrom) > revertNumMoney(this.stadAmtTo)) {
        this.$message.error("开始金额不能大于结束金额！");
        return;
      }
      this.drawerClose();
      if (this.nowPrj === "") {
        // 没有方案时点击查询保存为方案
        // this.nowPrj = this.pfData.svRoleName + '默认方案';
        this.nowPrj = "科目账";
        //保存成功之后会自动选择保存后的方案, 然后再查询
        this.$emit("queryClick", () => {
          return new Promise((resolve, reject) => {
            this.savePrj(
              "saveAdd",
              () => {
                this.$message.success("已为您生成默认方案");
                resolve();
              },
              (error) => {
                reject(error);
              }
            );
          });
        });
      } else {
        this.getAcctTree(() => {
          let qryItems = this.treeItemsData();
          //点击查询时表外查询项数据为undefined，这里去掉就可以解决，因为promiseAll中已经往vuex中添加数据了 2020.09.28
          /* ,
            qrySelectItemData = {};
          qryItems.forEach((item) => {
            if (item.items.length > 0) {
              qrySelectItemData[item.itemType] = item.items[0].code;
            }
          }); */
          this.setQryItemData(this.treeItemsData()); // 选择的查询项
          // this.setSelectedData(qrySelectItemData); //设置选择的项
          this.setPrjQryItems(this.treeItemsData()); // 查询项
          this.setPrjRptOption(this.optListData); // 查询项-其他
          this.setStadAmtFrom(revertNumMoney(this.stadAmtFrom)); // 金额-起
          this.setStadAmtTo(revertNumMoney(this.stadAmtTo)); // 金额-止
          this.$emit("queryClick");
        });
      }
    },
    saveHandle() {
      // 保存
      this.savePrj("save");
    },
    saveAsHandle() {
      // 另存为
      this.savePrj("saveAdd");
    },
    savePrj(flag, successBack, failBack) {
      if (!this.nowPrj) {
        this.$message.error("方案名称必填！");
        return;
      }
      if (revertNumMoney(this.stadAmtFrom) > revertNumMoney(this.stadAmtTo)) {
        this.$message.error("开始金额不能大于结束金额！");
        return;
      }

      //如果默认不选辅助核算范围，则全部展示在已选范围，会计科目特殊，显示的是挂在所选辅助核算下的会计科目。
      this.getAcctTree(() => {
        this.savePrjFn(flag, successBack, failBack);
      });
    },
    savePrjFn(flag, successBack, failBack) {
      var param = {};
      var opt = {
        acctCode: this.acctCode,
        agencyCode: this.agencyCode,
        prjCode: flag === "save" ? this.prjCode : "", // save是保存,保存时，如果当前选中方案则传code修改方案内容，如果没有点击保存，名字不重复就会生成新方案；另存prjCode一定为空，生成新方案
        prjName: this.nowPrj,
        prjScope: this.prjScope, // 私有方案 本单位共享 全系统共享
        rptType: this.rptType,
        setYear: this.pfData.svSetYear,
        userId: this.pfData.svUserId,
        prjContent: this.qryItemsData(), // 整理参数
      };
      //保存方案
      postSavePrj(param, opt)
        .then((result) => {
          if (result.data.flag == "fail") {
            throw result.data.msg;
          } else {
            this.$message.success(result.data.msg);
            this.drawerClose();
            let qryItems = this.treeItemsData(); /* ,
              qrySelectItemData = {};
            qryItems.forEach((item) => {
              if (item.items.length > 0) {
                qrySelectItemData[item.itemType] = item.items[0].code;
              }
            }); */
            this.setQryItemData(qryItems); // 选择的查询项
            // this.setSelectedData(qrySelectItemData); //设置选择的项
            this.setPrjQryItems(qryItems); // 查询项
            this.setPrjRptOption(this.optListData); // 查询项-其他
            this.setStadAmtFrom(revertNumMoney(this.stadAmtFrom)); // 金额-起
            this.setStadAmtTo(revertNumMoney(this.stadAmtTo)); // 金额-止
            this.getPrjList().then(({ data }) => {
              this.setSavePrjCode(result.data.data.prjCode);
              //执行回调
              if (successBack && typeof successBack === "function") {
                if (data && data.length > 0) {
                  this.setPrjGuid(data[0].prjGuid);
                }
                successBack();
              }
            });
          }
        })
        .catch((error) => {
          if (failBack && typeof failBack === "function") {
            failBack(error);
          }
          this.$message.error(error);
        });
    },
    // 关闭弹框
    drawerClose() {
      this.$emit("visibleChange", false);
    },
    // 打开科目树弹框
    showZtreeDrawer(item) {
      this.accModalShow = true;
      this.accItemSelect = item;
      // this.accItemSelect = this.zTreeSelectedData[item.accItemCode].items;
    },
    // 清除科目树选择的内容
    clearAll(item) {
      this.accItemTypeCheckListLoaded = false;
      item.items = [];
      this.zTreeSelectedData[item.accItemCode] = [];
      this.accItemTypeCheckListLoaded = true;
    },
    // 科目树弹框关闭
    accModalChange(show, key, flag, data) {
      this.accModalShow = show;
      if (flag) {
        // 树弹框点击确认
        this.accItemTypeCheckList.forEach((element) => {
          // 组织查询项
          if (element.accItemCode === key.accItemCode) {
            let treeItems = [];
            data.forEach((it) => {
              it.itemType = key.accItemCode;
              let treeItem = {};
              treeItem.code = it.code;
              if (key.accItemCode === "ACCO") {
                treeItem.acceCode = it.acceCode;
              }
              treeItem.name = it.name;
              treeItem.codeName = it.codeName;
              treeItem.pCode = it.pCode;
              treeItem.pId = it.pId;
              treeItem.isLeaf = it.isLeaf;
              treeItem.id = it.id;
              treeItems.push(treeItem);
            });
            element.items = treeItems;
            this.zTreeSelectedData[key.accItemCode] = treeItems;
          }
        });
      }
    },
    // 科目树创建成功
    onZtreeCreated(obj) {
      this.zTreeObj = obj;
    },
    // 获取会计科目全部选项
    getAccItemTreeData(eleCode, callback) {
      let param = {
        agencyCode: this.agencyCode, // 单位
        acctCode: this.acctCode, // 账套
        setYear: this.pfData.svSetYear,
        userId: this.pfData.svUserId,
        eleCode: eleCode ? eleCode : "ACCO",
        vouTypeCode: this.vouTypeCode, // 凭证类型
      };
      if (this.rptType === "GL_RPT_DEPPRO_JOURNAL") {
        // 财政项目明细账，会计科目树默认选择的数据为挂有财政项目的科目
        param.accItemList = "DEPPRO";
      }
      getAccItemTree(param)
        .then((result) => {
          if (result.data.flag == "fail") {
            throw result.data.msg;
          } else {
            callback(result.data.data);
          }
        })
        .catch((error) => {});
    },
    // 获取挂了所有辅助查询项的会计科目的选择范围（科目树） added by liwz at 2020.09.18 15:00
    getACCOTreeData(eleCode, callback) {
      let accItemList = "";
      this.accItemTypeCheckList.forEach((element) => {
        if (element.accItemCode !== "ACCO") {
          accItemList += element.accItemCode + ",";
        }
      });
      let param = {
        agencyCode: this.agencyCode, // 单位
        acctCode: this.acctCode, // 账套
        setYear: this.pfData.svSetYear,
        userId: this.pfData.svUserId,
        eleCode: eleCode ? eleCode : "ACCO",
        vouTypeCode: this.vouTypeCode, // 凭证类型
        accItemList: eleCode === "ACCO" ? accItemList : [],
      };

      getAccItemTree(param)
        .then((result) => {
          if (result.data.flag == "fail") {
            throw result.data.msg;
          } else {
            callback(result.data.data);
          }
        })
        .catch((error) => {});
    },
    getACCOSelectedTree() {
      this.accItemTypeCheckList.find((element, index, arr) => {
        if (element.accItemCode === "ACCO") {
          element.items = this.zTreeSelectedData.ACCO;
          return arr;
        }
      });
      let qryItems = this.treeItemsData(),
        qrySelectItemData = {};
      qryItems.forEach((item) => {
        if (item.items.length > 0) {
          qrySelectItemData[item.itemType] = item.items[0].code;
        }
      });
      this.setQryItemData(qryItems); // 选择的查询项
      this.setSelectedData(qrySelectItemData); //设置选择的项
      this.setPrjQryItems(qryItems); // 查询项   没有方案时把查询条件获取完全
    },
    async getAcctTree(callback) {
      let that = this;
      let pArr = [];
      this.accItemTypeCheckList.forEach((element, index, checkListarr) => {
        if (this.zTreeSelectedData[element.accItemCode].length === 0) {
          let arr = new Promise((resolve, reject) => {
            this.getACCOTreeData(element.accItemCode, (res) => {
              this.zTreeSelectedData[element.accItemCode] = res;
              element.items = res;
              resolve(this.accItemTypeCheckList);
            });
          });
          pArr.push(arr);
        }
      });
      Promise.all(pArr).then((result) => {
        let qryItems = that.treeItemsData(),
          qrySelectItemData = {};
        qryItems.forEach((item) => {
          if (item.items.length > 0) {
            //如果是会计科目项
            if (item.itemType === "ACCO") {
              let arr = item.items.filter((it) => {
                return !!it.acceCode;
              });
              qrySelectItemData[item.itemType] = arr[0].code;
            } else {
              qrySelectItemData[item.itemType] = item.items[0].code;
            }
          }
        });
        console.log("qryItems: ", qryItems);
        that.setSelectedData(qrySelectItemData); //设置选择的项
        that.setQryItemData(qryItems); // 选择的查询项
        that.setPrjQryItems(qryItems); // 查询项
        if (callback && typeof callback === "function") {
          callback();
        }
      });
    },
    // 账表数据范围选择框记忆上次选择的数据
    getSysRuleVal() {
      let urlParams = "/" + this.agencyCode;
      let params = {
        chrCodes: "GL060",
      };
      getSysRuleSet(params, {}, urlParams)
        .then((result) => {
          if (result.data.flag == "fail") {
            throw result.data.msg;
          } else {
            this.isRememberedGL060 = result.data.data.GL060;
          }
        })
        .catch((error) => {});
    },
  },
};
</script>
<style lang="scss" scoped>
.line {
  width: 100%;
  height: 1px;
  background: #d8d8d8;
}
.drawer-btn-wrap {
  position: fixed;
  top: 132px;
  right: 0px;
  z-index: 99;
}
.drawer-btn {
  display: inline;
  background: #fff;
  padding: 8px 12px;
  border-radius: 50% 0 0 50%;
  box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.15);
}
.drawer-footer {
  position: absolute;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 50px;
  left: 0;
  padding: 0 15px;
  border-top: 1px solid #d9d9d9;
  background: #fff;
  box-sizing: border-box;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
.drawer-content {
  user-select: none;
  overflow-x: hidden;
  .bold {
    font-weight: bold;
  }
  .content-acctype-list {
    max-height: 100px;
    overflow: hidden;
    .acctype-item label {
      width: 120px;
      white-space: nowrap; /* 不换行 */
      overflow: hidden; /* 超出隐藏 */
      text-overflow: ellipsis; /* 超出部分显示省略号 */
    }
  }
  .content-acctype-list.all {
    max-height: none;
  }
  .content-tabs {
    padding: 0 16px 0 0;
    overflow: hidden;
    .tabs-wrap {
      width: 120px;
      min-height: 310px;
      float: left;
      border-right: 1px solid #d8d8d8;
      margin-top: -1px;
      margin-bottom: -1px;
      .tab-item {
        box-sizing: border-box;
        max-width: 120px;
        width: 120px;
        white-space: nowrap; /* 不换行 */
        overflow: hidden; /* 超出隐藏 */
        text-overflow: ellipsis; /* 超出部分显示省略号 */
        height: 35px;
        text-align: left;
        line-height: 35px;
        padding: 0 12px;
        &.active {
          border-left: 2px solid #108ee9;
          border-top: 1px solid #d8d8d8;
          border-bottom: 1px solid #d8d8d8;
          border-right: 1px solid #fff;
          color: #108ee9;
        }
      }
    }
    .tabs-main {
      margin-left: 119px;
      padding: 12px 0 0 16px;
      width: calc(100% - 119px);
      .check-wrap {
        padding-bottom: 11px;
        .clear-all {
          padding-right: 6px;
        }
      }
      .tree-wrap {
        width: 100%;
        height: 268px;
        border-top: 1px solid #d8d8d8;
        overflow: auto;
        position: relative;
        .iconWrap {
          width: 50px;
          height: 50px;
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          cursor: pointer;
          .addfileIcon {
            display: inline-block;
            background: #999;
            width: 4px;
            height: 50px;
            border-radius: 5px;
            position: absolute;
            top: 0px;
            left: 23px;
            &:after {
              content: "";
              width: 50px;
              height: 4px;
              background: #999;
              border-radius: 5px;
              position: absolute;
              top: 23px;
              left: -23px;
            }
          }
        }
      }
    }
  }
  .content-else {
    padding: 16px 42px 4px 16px;
    li {
      margin-bottom: 16px;
      .title {
        display: inline-block;
        width: 60px;
        text-align: right;
      }
    }
    li:last-child {
      margin-bottom: 0px;
    }
    .opt-list {
      margin: 0 6px 16px 0;
    }
  }
}
</style>