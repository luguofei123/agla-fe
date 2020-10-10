<!--
 * @Author: liwz
 * @Date: 2020-09-27 10:00:39
 * @LastEditTime: 2020-09-27 10:51:56
 * @LastEditors: Please set LastEditors
 * @Description: 部门应用设置
 * @FilePath: /ufgov-vue/src/views/ma/departApply/maDepartApply.vue
 -->
<template>
  <div>
    <!-- 头部开始 -->
    <maDepartHeader :titleName="'部门应用设置'" @changeAggency="aggencyChange">
      <template v-slot:maSave>
        <a-button type="primary" @click="maSave" :class="getBtnPer('btn-save')"
          >保存</a-button
        >
      </template>
    </maDepartHeader>
    <!-- 头部结束 -->
    <!-- 选项卡开始 -->
    <div class="card-container">
      <a-tabs type="card" @change="callback">
        <a-tab-pane key="set" tab="设置">
          <!-- 表格开始 -->
          <vxe-table
            resizable
            :height="tableHeight"
            :data="tableData"
            row-id="orgCode"
            @checkbox-all="selectAllEvent"
            @cell-click="cellClickEvent"
            :cell-style="cellStyle"
          >
            <vxe-table-column
              title="部门"
              width="16%"
              field="orgName"
              tree-node
              align="left"
            ></vxe-table-column>
            <vxe-table-column field="pd" title="项目库" align="center">
              <template v-slot="{ row }">
                <vxe-checkbox
                  v-model="row.pd"
                  @change="changeBox(row, 'pd')"
                ></vxe-checkbox>
              </template>
            </vxe-table-column>
            <vxe-table-column field="abp" title="预算编制" align="center">
              <template v-slot="{ row }">
                <vxe-checkbox
                  v-model="row.abp"
                  @change="changeBox(row, 'abp')"
                ></vxe-checkbox>
              </template>
            </vxe-table-column>
            <vxe-table-column field="bg" title="指标管理" align="center">
              <template v-slot="{ row }">
                <vxe-checkbox
                  v-model="row.bg"
                  @change="changeBox(row, 'bg')"
                ></vxe-checkbox>
              </template>
            </vxe-table-column>
            <vxe-table-column field="up" title="采购管理" align="center">
              <template v-slot="{ row }">
                <vxe-checkbox
                  v-model="row.up"
                  @change="changeBox(row, 'up')"
                ></vxe-checkbox>
              </template>
            </vxe-table-column>
            <vxe-table-column field="cm" title="合同管理" align="center">
              <template v-slot="{ row }">
                <vxe-checkbox
                  v-model="row.cm"
                  @change="changeBox(row, 'cm')"
                ></vxe-checkbox>
              </template>
            </vxe-table-column>
            <vxe-table-column field="ar" title="报销管理" align="center">
              <template v-slot="{ row }">
                <vxe-checkbox
                  v-model="row.ar"
                  @change="changeBox(row, 'ar')"
                ></vxe-checkbox>
              </template>
            </vxe-table-column>
            <vxe-table-column field="fa" title="资产管理" align="center">
              <template v-slot="{ row }">
                <vxe-checkbox
                  v-model="row.fa"
                  @change="changeBox(row, 'fa')"
                ></vxe-checkbox>
              </template>
            </vxe-table-column>
            <vxe-table-column field="cw" title="账务处理" align="center">
              <template v-slot="{ row }">
                <vxe-checkbox
                  v-model="row.cw"
                  @change="changeBox(row, 'cw')"
                ></vxe-checkbox>
              </template>
            </vxe-table-column>
          </vxe-table>

          <!-- 表格结束 -->
        </a-tab-pane>
        <a-tab-pane key="preview" tab="预览">
          <div class="preview_wrap">
            <a-tabs type="card" @change="preCallback">
              <a-tab-pane
                v-for="item in tabArr"
                :key="item.key"
                :tab="item.name"
              >
                <ztree
                  :setting="zTreeSetting"
                  :nodes="treeNodes"
                  @onCreated="onZtreeCreated"
                ></ztree>
              </a-tab-pane>
            </a-tabs>
          </div>
        </a-tab-pane>
      </a-tabs>
    </div>
    <!-- 选项卡结束 -->
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from "vuex";
import store from "@/store/index";
import XEUtils from "xe-utils";
import {
  formatMoney,
  revertNumMoney,
  openNewPage,
  getBtnPer,
} from "@/assets/js/util"; //从工具库函数中获取工具函数：{ formatMoney: '金额格式化' }
import maDepartHeader from "./components/maDepartHeader"; // 头部
export default {
  name: "maDepartApply",
  components: {
    maDepartHeader, // 自定义账表头部 含单位账套下拉树
  },
  data() {
    return {
      maType: "MA_DEPART_APPLY",
      tableData: [],
      tableHeight: 600,
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
      treeNodes: [],
      tabArr: [
        { name: "项目库", key: "pd" },
        { name: "预算编制", key: "abp" },
        { name: "指标管理", key: "bg" },
        { name: "采购管理", key: "up" },
        { name: "合同管理", key: "cm" },
        { name: "报销管理", key: "ar" },
        { name: "资产管理", key: "fa" },
        { name: "财务管理", key: "cw" },
      ],
      activeKey: "pd",
    };
  },
  watch: {
    /* acctChanged(newVal,oldVal){
      if(newVal){
        console.log('newVal: ',newVal);

        let params = {
          agencyCode: this.agencyCode,
          roleId: this.pfData.svRoleId,
          setYear: this.pfData.svSetYear,
        };
        this.getOrgTree(params);
      }
    } */
  },
  computed: {
    ...mapState({
      pfData: (state) => state.pfData,
      agencyCode: (state) => state.maDepartApply.agencyCode,
      agencyName: (state) => state.maDepartApply.agencyName,
      acctChanged: (state) => state.maDepartApply.acctChanged, //单位账套改变
    }),
  },
  created() {
    let params = {
      agencyCode: this.pfData.svAgencyCode,
      roleId: this.pfData.svRoleId,
      setYear: this.pfData.svSetYear,
    };
    this.getOrgTree(params);
  },
  mounted() {},
  methods: {
    ...mapActions(["setAgencyCodeMa", "setAgencyNameMa", "setAcctChangedMa"]),
    getBtnPer,
    aggencyChange() {
      let params = {
        agencyCode: this.agencyCode,
        roleId: this.pfData.svRoleId,
        setYear: this.pfData.svSetYear,
      };
      this.getOrgTree(params);
      this.getZtree(this.activeKey);
    },
    callback(key) {
      // console.log("key: ", key);
      if (key === "preview") {
        // this.activeKey = key;
        this.getZtree(this.activeKey);
      }
    },
    /*
     * @Description: 获取部门树
     */
    getOrgTree(params) {
      this.$axios
        .get("/ma/emp/prsOrg/selectPrsOrgSet", { params })
        .then((result) => {
          if (result.data.data.length === 0) {
            this.$message.warning("未查询到数据");
            this.tableData = [];
            return;
          }
          let resultData = result.data.data;
          resultData.forEach((item) => {
            item.pd = item.pd === "1" ? true : false;
            item.abp = item.abp === "1" ? true : false;
            item.bg = item.bg === "1" ? true : false;
            item.up = item.up === "1" ? true : false;
            item.cm = item.cm === "1" ? true : false;
            item.ar = item.ar === "1" ? true : false;
            item.fa = item.fa === "1" ? true : false;
            item.cw = item.cw === "1" ? true : false;
            item.orgName = item.orgCode + " " + item.orgName;
          });
          // 表格数据

          this.tableData = resultData;
          // console.log("this.tableData: ", this.tableData);
        })
        .catch((error) => {
          console.log(error);
          if (error) {
            this.$message.error(error);
          }
        });
    },
    selectAllEvent({ checked, records }) {
      console.log(checked ? "所有勾选事件" : "所有取消事件", records);
    },
    //点击单元格
    cellClickEvent({ row, column }, event) {
      // console.log("row: ", row);
      // console.log("column: ", column);
    },
    // 单元格样式
    cellStyle({ $rowIndex, row, column, columnIndex, $columnIndex }) {
      if (
        column.property === "orgName" &&
        column.title === "部门" &&
        !!row.orgName &&
        row.levelNum === 2
      ) {
        return {
          "text-indent": "25px",
        };
      }
    },
    maSave() {
      console.log("保存：", this.tableData);
      let that = this;
      let params = {};
      let bgAndcwArr = [];
      let bgAndAbpArr = [];
      let saveParams = [];
      //数组深拷贝，使savaArr不影响this.tableData
      let saveArr = JSON.parse(JSON.stringify(this.tableData));
      saveArr.forEach((item) => {
        if (item.bg !== item.cw) {
          bgAndcwArr.push(item.bg);
        }
        if (item.bg !== item.abp) {
          bgAndAbpArr.push(item.bg);
        }

        item.pd = item.pd === true ? "1" : "0";
        item.abp = item.abp === true ? "1" : "0";
        item.bg = item.bg === true ? "1" : "0";
        item.up = item.up === true ? "1" : "0";
        item.cm = item.cm === true ? "1" : "0";
        item.ar = item.ar === true ? "1" : "0";
        item.fa = item.fa === true ? "1" : "0";
        item.cw = item.cw === true ? "1" : "0";
        /* item.chr_id = "";
        item.orgName = "";
        item.levelNum = ""; */
        item.orgName = item.orgName.split(" ")[1];
        saveParams.push(item);
      });
      if (bgAndcwArr.length > 0 || bgAndAbpArr.length > 0) {
        let contentText = "";
        if (bgAndcwArr.length > 0) {
          contentText = "指标管理与账务处理配置的部门不一致，是否继续保存？";
        } else if (bgAndAbpArr.length > 0) {
          contentText = "预算编制与指标管理配置的部门不一致，是否继续保存？";
        } else if (bgAndcwArr.length > 0 && bgAndAbpArr.length > 0) {
          contentText =
            "预算编制与指标管理配置的部门不一致，指标管理与账务处理配置的部门不一致，是否继续保存？";
        }
        this.$confirm({
          content: contentText,
          okText: "确认",
          cancelText: "取消",
          onOk() {
            that.saveConFn(saveParams);
          },
          onCancel() {},
        });
      } else {
        that.saveConFn(saveParams);
      }
    },
    saveConFn(saveParams) {
      // console.log("saveParams: ", saveParams);
      this.$axios
        .post("/ma/emp/prsOrg/savePrsOrgSet", {
          params: JSON.stringify(saveParams),
        })
        .then((result) => {
          if (result.data.flag === "fail") {
            this.$message.error(result.data.msg);
          } else {
            this.$message.success(result.data.msg);
          }
        })
        .catch((error) => {
          console.log(error);
          if (error) {
            this.$message.error(error);
          }
        });
    },
    changeBox(row, item) {
      // console.log("row: ", row);
      // console.log("item: ", item);
      //自底向上，如果下级勾选，则判断下级的orgCode的前几位是否和上级的相等，相等则把上级也勾选
      if (row[item] === true) {
        this.tableData.forEach((element) => {
          if (
            row.orgCode.substring(0, element.orgCode.length) === element.orgCode
          ) {
            // console.log(element.orgCode, row.orgCode);
            element[item] = true;
          }
        });
      } else {
        //自顶向下，如果上级去掉勾选，则判断下级的orgCode的前几位是否和上级相等，相等则把下级的勾选去掉
        this.tableData.forEach((element) => {
          if (
            element.orgCode.substring(0, row.orgCode.length) === row.orgCode
          ) {
            // console.log(element.orgCode, row.orgCode);
            element[item] = false;
          }
        });
      }
    },
    preCallback(key) {
      // console.log("preCallback key:", key);
      this.activeKey = key;
      this.getZtree(key);
    },
    getZtree(key) {
      // console.log("this.agencyCode: ", this.agencyCode);
      let preParams = {
        agencyCode:
          this.agencyCode !== "" ? this.agencyCode : this.pfData.svAgencyCode,
        roleId: this.pfData.svRoleId,
        setYear: this.pfData.svSetYear,
        sysCode: key,
      };
      // console.log("preParams: ", preParams);
      this.$axios
        .get("/ma/emp/prsOrg/viewOrgSetTree", { params: preParams })
        .then((result) => {
          if (result.data.data.length === 0) {
            this.$message.warning("未查询到数据");
            this.treeNodes = [];
            return;
          }
          this.treeNodes = result.data.data;
        })
        .catch((error) => {
          console.log(error);
          if (error) {
            this.$message.error(error);
          }
        });
    },
    // 科目树创建成功
    onZtreeCreated(obj) {
      this.zTreeObj = obj;
    },
  },
};
</script>

<style lang="scss" scoped>
.card-container {
  padding-top: 10px;
}
.preview_wrap {
  padding-top: 3px;
}
</style>
<style>
.card-container .ant-tabs.ant-tabs-card .ant-tabs-card-bar .ant-tabs-tab {
  margin-right: 0;
}
.ant-tabs.ant-tabs-card .ant-tabs-card-bar .ant-tabs-nav-wrap {
  margin-bottom: -1px;
}
.ant-tabs.ant-tabs-card .ant-tabs-card-bar .ant-tabs-tab {
  border: none;
  background: transparent;
}
.ant-tabs.ant-tabs-card .ant-tabs-card-bar .ant-tabs-tab-active {
  background: transparent;
  border: solid 1px #e8e8e8;
  border-bottom: none;
}
</style>