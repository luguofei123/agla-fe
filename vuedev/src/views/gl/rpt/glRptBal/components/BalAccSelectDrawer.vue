<template>
  <ufDrawer
    v-model="accModalShow"
    :zIndex="999"
    :width="400"
    :scrollable="false"
    @drawerClose="cancelHandle"
  >
    <div v-if="showInner" class="drawer-content" @click.stop>
      <ul class="content-setting">
        <li v-if="accItem && accItem.accItemCode && accItem.accItemCode === 'ACCO'">
          <span class="title">会计体系：</span>
          <a-radio-group
            name="radioGroup"
            :default-value="'*'"
            v-model="accsCode"
            @change="accsCodeChange"
          >
            <a-radio
              :value="item.accaCode"
              v-for="item in rptAccasData"
              :key="item.accaCode"
            >{{item.accaName}}</a-radio>
          </a-radio-group>
        </li>
        <li>
          <span class="title">代码级次：</span>
          <a-radio-group
            name="radioGroup"
            v-model="rptLevelValue"
            :default-value="1"
            @change="levelChange"
          >
            <a-radio :value="0">全部</a-radio>
            <a-radio :value="1">一级代码</a-radio>
            <a-radio :value="2">明细代码</a-radio>
          </a-radio-group>
        </li>
        <li v-if="rptLevelValue===0" class="mt-6">
          <span class="title">从：</span>
          <a-select
            style="width: 120px;"
            v-model="levelStartVal"
            @change="levelStartValChange"
            allowClear
          >
            <a-select-option
              v-for="item in levelListStart"
              :key="item.level"
              :value="item.level"
            >{{item.text}}</a-select-option>
          </a-select>
          <span style="padding: 0 9px;">到</span>
          <a-select
            style="width: 120px;"
            v-model="levelEndVal"
            @change="levelEndValChange"
            allowClear
          >
            <a-select-option
              v-for="item in levelListEnd"
              :key="item.level"
              :value="item.level"
            >{{item.text}}</a-select-option>
          </a-select>
        </li>
        <li class="mt-6" v-if="accItem && accItem.accItemCode && accItem.accItemCode === 'ACCO'">
          <span class="title">凭证类型：</span>
          <a-select
            default-value
            style="width: 120px"
            v-model="vouTypeCode"
            @change="handleVouTypeChange"
            allowClear
          >
            <a-select-option
              :value="item.code"
              v-for="item in VouTypeData"
              :key="item.code"
            >{{item.name}}</a-select-option>
          </a-select>
        </li>
      </ul>
      <div class="check-wrap mt-6" style="line-height: 32px">
        <a-checkbox @click="checkAllChange" :checked="checkAll">全选</a-checkbox>
        <a-checkbox
          @click="checkRelationChange"
          :defaultChecked="true"
          :checked="checkRelation"
        >级联选择</a-checkbox>
        <a-input-search placeholder="搜索" class="fr" style="width: 120px" @search="onTreeSearch" />
      </div>
      <div class="tree-wrap mt-6 myscrollbar" :style="{'height': treeWrapH + 'px'}">
        <div v-if="accItemTreeData && accItemTreeData.length > 0">
          <loading :size="100" v-if="loading"></loading>
          <ztree
            :setting="zTreeSetting"
            :nodes="accItemTreeData"
            :searchNodeCode="searchNodeCode"
            :checkedCodes="checkedCodes"
            @onCreated="onZtreeCreated"
            @search="onTreeSearch"
          ></ztree>
        </div>
        <div v-else class="no-data"><img src="../../../../../assets/imgs/images/emptyTable.png" style="width: 100%;" /></div>
      </div>
    </div>
    <template v-slot:footer>
      <div class="drawer-footer" @click.stop>
        <a-button class="mr-8" type="primary" @click="confirmHandle">确认</a-button>
        <a-button @click="cancelHandle">返回</a-button>
      </div>
    </template>
  </ufDrawer>
</template>

<script>
import ufDrawer from "@/components/common/ufDrawer"; // 抽屉组件
import tableLoading from "@/components/tableLoading"; // loading
import { mapState } from "vuex";
import {
  vouTypeList,
  getRptAccas,
  getAccItemTree,
} from "../../common/service/service";
import store from "@/store/index";
let rptName = store.state.rpt.rptName;

export default {
  name: "BalAccSelectDrawer",
  components: {
    ufDrawer,
    loading: tableLoading,
  },
  props: {
    accModalShow: {
      // 页面名
      type: Boolean,
      default: false,
    },
    selectedAccItem: {
      // 当前选择的辅助项信息
      type: Object,
    },
    // accItemTypeCheckList: {
    //   type: Array,
    // },
    isRemembered: {
      // 打开此页面时，是否勾选上一个弹框中的数据
      type: Boolean,
      default: false,
    },
    zTreeSelectedData: {
      type: Object,
    },
  },
  filters: {},
  data() {
    return {
      showInner: false, //显示内部
      loading: false,
      accItem: null, // 当前选择的辅助项信息
      vouTypeCode: "", // 凭证类型
      VouTypeData: [], // 凭证类型列表
      accsCode: "*", // 会计体系
      rptAccasData: [], // 会计体系列表
      rptLevelValue: 0, // 代码级次radio
      checkAll: false, // 全选
      checkRelation: true, // 级联
      //代码级次筛选
      levelListStart: [
        { level: 1, text: "一级" },
        { level: 2, text: "二级" },
        { level: 3, text: "三级" },
        { level: 4, text: "四级" },
        { level: 5, text: "五级" },
        { level: 6, text: "六级" },
        { level: 7, text: "七级" },
        { level: 8, text: "八级" },
        { level: 9, text: "九级" },
        { level: 10, text: "十级" },
      ],
      levelListEnd: [
        { level: 1, text: "一级" },
        { level: 2, text: "二级" },
        { level: 3, text: "三级" },
        { level: 4, text: "四级" },
        { level: 5, text: "五级" },
        { level: 6, text: "六级" },
        { level: 7, text: "七级" },
        { level: 8, text: "八级" },
        { level: 9, text: "九级" },
        { level: 10, text: "十级" },
      ],
      levelStartVal: null, // 从几级
      levelEndVal: null, // 到几级
      treeWrapH: 300, // 科目树框高度
      accItemTreeData: [], // 科目树
      protoAccItemTree: [], // 科目树原始数据
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
        check: {
          enable: true,
          autoCheckTrigger: true,
          chkboxType: { Y: "ps", N: "ps" },
        },
      },
      checkedCodes: [], // 树默认选中的数据
      searchNodeCode: "", // 使用搜索筛选出的code
    };
  },
  created() {},
  mounted() {
    this.treeWrapH = this.containerH - 266;
  },
  watch: {
    accModalShow(val) {
      if (val) {
        setTimeout(() => {
          this.showInner = val;
          if (this.isRemembered) {
            console.log(this.zTreeSelectedData)
            if (this.zTreeSelectedData === {}) {
              this.checkedCodes = [];
            } else {
              this.checkedCodes = this.zTreeSelectedData[
                this.accItem.accItemCode
              ].map(item => {
                return item.code
              });
            }
          }
        }, 300);
      } else {
        this.showInner = val;
      }
    },
    agencyCode(newVal, oldVal) {},
    acctCode(newVal, oldVal) {
      this.getRptAccasData(); // 会计体系
      this.getVouTypeList(); // 获取凭证类型列表
    },
    selectedAccItem(newVal, oldVal) {
      this.accItem = newVal;
      this.getAccItemTreeData(this.accItem); // 获取科目树
      if (!(newVal.accItemCode && newVal.accItemCode === "ACCO")) {
        // 会计科目
        this.treeWrapH = this.containerH - 206;
      } else {
        this.treeWrapH = this.containerH - 266;
      }
      if (this.isRemembered) {
        this.checkedCodes = this.accItem.items.map(item => { return item.code });
      }
    },
    checkAll(newVal, oldVal) {},
    checkRelation(newVal, oldVal) {},
    treeWrapH(newVal, oldVal) {},
  },
  computed: {
    ...mapState({
      pfData: (state) => state.pfData, // 全局的commonData 用户当前登陆公共信息
      containerH: (state) => state.containerH, //容器高度
      agencyCode: (state) => state[rptName].agencyCode, // 单位代码
      acctCode: (state) => state[rptName].acctCode, // 账套代码
    }),
  },
  methods: {
    // 点击确认
    confirmHandle() {
      var nodes = this.zTreeObj ? this.zTreeObj.getCheckedNodes(true) : [];
      var nodeList = [];
      for (var i = 0; i < nodes.length; i++) {
        var node = nodes[i];
        if (this.checkRelation) {
          // 如果勾选级联
          if (
            node.checked == true &&
            (node.check_Child_State == -1 || node.check_Child_State == 2)
          ) {
            nodeList.push(node);
          }
        } else {
          // 不勾选级联
          if (node.checked == true) {
            nodeList.push(node);
          }
        }
      }
      this.$emit("accModalChange", false, this.accItem, true, nodeList);
      if (nodeList.length > 0) {
        this.checkedCodes = nodeList.map(item => { return item.code });
      }
      // console.log("nodeList: ", nodeList);
      // console.log("this.accItem: ", this.accItem);
    },
    // 返回
    cancelHandle() {
      this.$emit("accModalChange", false, this.accItem);
    },
    // 会计体系
    accsCodeChange(e) {
      this.levelStartVal = "";
      this.levelEndVal = "";
      this.doLevelFilter(e.target.value, this.rptLevelValue);
    },
    // 代码级次
    levelChange(e) {
      if (e.target.value === 0) {
        this.levelStartVal = "";
        this.levelEndVal = "";
      }
      this.doLevelFilter(this.accsCode, e.target.value);
    },
    // 代码级次-从
    levelStartValChange(val) {
      if (!val) {
        val = 1;
        this.levelStartVal = "";
        this.levelEndVal = "";
        this.levelListEnd = this.levelListStart.slice(val - 1);
        this.doLevelFilter(this.accsCode, this.rptLevelValue);
      } else {
        this.levelEndVal = "";
        this.levelListEnd = this.levelListStart.slice(val - 1);
        this.doLevelFilter(this.accsCode, this.rptLevelValue, "", true);
      }
    },
    // 代码级次-到
    levelEndValChange() {
      this.doLevelFilter(this.accsCode, this.rptLevelValue, "", true);
    },
    // 代码筛选
    doLevelFilter(accsCode, level, txt, levelChange) {
      let tempArr = [];
      let filterArr = [];
      let start, end;
      if (accsCode && accsCode != "*") {
        // 会计体系不是全部
        this.protoAccItemTree.forEach((item) => {
          if (item.accaCode === accsCode) {
            let obj = JSON.parse(JSON.stringify(item));
            tempArr.push(obj);
          }
        });
      } else {
        // 会计体系是全部
        tempArr = this.protoAccItemTree;
      }
      if (level === 2) {
        // 明细代码
        tempArr.forEach((item) => {
          if (item.isLeaf === 1) {
            let obj = JSON.parse(JSON.stringify(item));
            obj.children = [];
            filterArr.push(obj);
          }
        });
      } else {
        if (level === 1) {
          // 一级代码
          if (item.levelNum === 1) {
            let obj = JSON.parse(JSON.stringify(item));
            filterArr.push(obj);
          }
        } else {
          start = this.levelStartVal;
          end = this.levelEndVal
            ? this.levelEndVal
            : this.levelListEnd[this.levelListEnd.length - 1].level;
          tempArr.forEach((item) => {
            // 级次筛选逻辑: 显示所有第maxValue级，和第minValue级到第maxValue级中没子节点的
            if (levelChange) {
              // 如果修改了从几级到几级
              if (item.levelNum >= start && item.levelNum <= end) {
                if (item.levelNum === end) {
                  let obj = JSON.parse(JSON.stringify(item));
                  filterArr.push(obj);
                } else {
                  if (item.isLeaf == "1" || item.isLeaf != "0") {
                    let obj = JSON.parse(JSON.stringify(item));
                    filterArr.push(obj);
                  }
                }
              }
            } else {
              let obj = JSON.parse(JSON.stringify(item));
              filterArr.push(obj);
            }
          });
        }
      }
      this.accItemTreeData = filterArr;
      if (txt) {
        let finalArr = [];
        filterArr.forEach((item) => {
          if (item.codeName.indexOf(txt) > -1) {
            let obj = JSON.parse(JSON.stringify(item));
            obj.children = [];
            finalArr.push(obj);
          }
        });
        this.accItemTreeData = finalArr;
      }
    },

    // 凭证类型
    handleVouTypeChange() {
      this.levelStartVal = "";
      this.levelEndVal = "";
      this.getAccItemTreeData(this.accItem); // 获取科目树
    },
    // 全选
    checkAllChange(e) {
      this.checkAll = e.target.checked;
      if (e.target.checked) {
        this.zTreeObj.checkAllNodes(true);
      } else {
        this.zTreeObj.checkAllNodes(false);
      }
    },
    // 级联选择
    checkRelationChange(e) {
      this.checkRelation = e.target.checked;
      if (e.target.checked) {
        this.zTreeSetting.check.autoCheckTrigger = true;
        this.zTreeSetting.check.chkboxType = { Y: "ps", N: "ps" };
      } else {
        this.zTreeSetting.check.autoCheckTrigger = false;
        this.zTreeSetting.check.chkboxType = { Y: "p", N: "p" };
      }
      this.getAccItemTreeData(this.accItem); // 获取科目树
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
    // 会计体系列表
    getRptAccasData() {
      let param = {
        agencyCode: this.agencyCode,
        acctCode: this.acctCode,
        setYear: this.pfData.svSetYear,
        rgCode: this.pfData.svRgCode,
      };
      getRptAccas(param)
        .then((result) => {
          if (result.data.flag == "fail") {
            throw result.data.msg;
          } else {
            this.rptAccasData = result.data.data;
            const allItem = {
              accaCode: "*",
              accaName: "全部",
            };
            this.rptAccasData.unshift(allItem);
          }
        })
        .catch((error) => {
          this.$message.error(error);
        });
    },
    // 会计科目列表
    getAccItemTreeData(item) {
      this.loading = true;
      // console.log("科目树：accItemTypeCheckList: ", this.accItemTypeCheckList);
      let paramList = "";
      // this.accItemTypeCheckList.forEach((element) => {
      //   if (element.accItemCode !== "ACCO") {
      //     paramList += element.accItemCode + ",";
      //   }
      // });
      console.log("paramsList: ", paramList);
      let param = {
        agencyCode: this.agencyCode, // 单位
        acctCode: this.acctCode, // 账套
        setYear: this.pfData.svSetYear,
        userId: this.pfData.svUserId,
        eleCode: item.accItemCode,
        vouTypeCode: this.vouTypeCode, // 凭证类型
        accItemList: paramList,
      };
      getAccItemTree(param)
        .then((result) => {
          if (result.data.flag == "fail") {
            throw result.data.msg;
          } else {
            this.loading = false;
            this.accItemTreeData = result.data.data;
            this.protoAccItemTree = JSON.parse(
              JSON.stringify(result.data.data)
            );
            this.levelListMethod(result.data.data);
            this.doLevelFilter(this.accsCode, this.rptLevelValue);
          }
        })
        .catch((error) => {
          // this.$message.error(error);
        });
    },
    // 根据返回的科目树级次，定义从几级到几级选项
    levelListMethod(newarr) {
      let maxLevelNum = Math.max.apply(
        Math,
        newarr.map((item) => {
          return item.levelNum;
        })
      );
      this.levelListStart = this.levelListStart.slice(0, maxLevelNum);
      this.levelListEnd = this.levelListStart.slice(0, maxLevelNum);
    },
    onTreeSearch(val) {
      this.doLevelFilter(this.accsCode, this.rptLevelValue, val);
    },
    onZtreeCreated(obj) {
      this.zTreeObj = obj;
      if (this.isRemembered) {
        this.checkAll =
          this.accItemTreeData &&
          this.accItem.items &&
          this.accItem.items.length === this.accItemTreeData.length
            ? true
            : false;
      } else {
        this.checkAll = false;
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.mr-8 {
  margin-right: 8px;
}
.mt-6 {
  margin-top: 6px;
}
.mb-16 {
  margin-bottom: 16px;
}
.hover {
  color: #108ee9;
}
.drawer-content {
  user-select: none;
  padding: 16px 30px 16px 32px;
  .content-setting {
    li {
      .title {
        display: inline-block;
        width: 60px;
        text-align: right;
        margin-right: 8px;
      }
      margin-bottom: 2px;
    }
  }
  .tree-wrap {
    width: 100%;
    position: relative;
    border-radius: 4px;
    border: 1px solid rgba(223, 230, 236, 1);
    padding: 8px 16px;
    overflow: auto;
    .no-data {
      color: #606266;
      text-align: center;
      line-height: 339px;
    }
  }
}
.drawer-footer {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 50px;
  padding: 0 15px;
  border-top: 1px solid #d9d9d9;
  background: #fff;
  box-sizing: border-box;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
</style>