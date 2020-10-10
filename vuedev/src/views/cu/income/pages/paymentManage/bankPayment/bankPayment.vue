<template>
  <div class="pageContainer">
    <div class="leftContainer">
      <bankTree @selectTree="selectTree" />
    </div>
    <div class="rightContainer">
      <table-list
        ref="tableList"
        :uuid="'bankPayment'"
        tab-title="银行来款"
        :tab-config="tapConfig"
        @changeTab="changeTab"
        :editBtnList="editBtnList"
        :buttons-config="buttonsConfig"
        :defaultTabKey="cardStatus"
        :search-config="searchConfig"
        :table-config="tableConfig"
        :columns="columns"
        :data="data"
        @clickBtn="clickBtn"
        @billClick="billClick"
        @rowBtnClick="rowBtnClick"
        v-model="selectionItems"
      ></table-list>
    </div>
    <!--来款导入-->
    <payment-import v-model="paymentImportVisible" />
    <!--批量替换-->
    <batch-replace
      v-model="batchReplaceVisible"
      :selectionItems="selectionItems"
      @batchReplaceOk="batchReplaceOk"
      :selectedTreeNode="selectedTreeNode"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import bankTree from "@/views/cu/income/common/leftTree/bankTree";
import tableList from "@/views/cu/income/common/listModule/tableList";
import paymentImport from "./paymentImport";
import batchReplace from "./batchReplace";
import common from "@/views/cu/income/common/common";
export default {
  name: "bankPayment",
  props: {},
  components: { bankTree, tableList, paymentImport, batchReplace },
  data() {
    return {
      selectedTreeNode: {}, // 选中的树节点
      tapConfig: [],
      buttonsConfig: [],
      // searchConfig: [],
      tableConfig: {},
      columns: [],
      editBtnList: [
        { name: "删除", key: "delete" },
        { name: "发布", key: "release" },
        { name: "不发布", key: "unRelease" },
      ],
      data: [],
      selectionItems: [],
      cardStatus: "0", // 页签状态
      isShowBill: false,
      paymentAddVisible: false, // 来款增加可见性
      paymentImportVisible: false, // 来款导入可见性
      batchReplaceVisible: false, // 批量替换可见性
      incomeTypeOptions: [], // 收入类型
      fundSourceOptions: [], // 资金来源
      treeOptions: {
        // 下拉树集合
        bgtsource: [],
      },
    };
  },
  created() {},

  methods: {
    // 点击左侧树
    selectTree(node) {
      this.selectedTreeNode = node[0];
      if (this.selectedTreeNode) {
        this.tableConfig.dataParams.bankCode = this.selectedTreeNode.chrCode;
      } else {
        this.tableConfig.dataParams.bankCode = "";
      }
      this.$nextTick(() => {
        this.$refs.tableList.getData();
      });
    },
    // 切换页签
    changeTab(key) {
      this.cardStatus = key;
      this.tableConfig.dataParams.isReleased = key;
      this.initTable(key);
      this.$nextTick(() => {
        this.$refs.tableList.initTable();
      });
    },
    // 切换页签，初始化table
    initTable(key) {
      if (key !== "9") {
        if (this.columns[this.columns.length - 1].dataIndex !== "operation") {
          this.columns.push({
            title: "操作",
            dataIndex: "operation",
            width: "200",
            align: "center",
          });
        }
      } else {
        this.columns.splice(this.columns.length - 1, 1);
      }
      switch (key) {
        case "0": // 未发布
          this.editBtnList = [
            {
              name: "删除",
              key: "delete",
              visibleKey: "isCanDelete",
              visibleValue: "1",
            },
            { name: "发布", key: "release" },
            { name: "不发布", key: "unRelease" },
          ];
          this.buttonsConfig = [
            { name: "paymentAdd", primary: "true" },
            { name: "paymentImport" },
            { name: "batchReplace" },
            { name: "release" },
            { name: "unRelease" },
            { name: "delete" },
          ];
          break;
        case "1": // 已发布
          this.editBtnList = [{ name: "取消发布", key: "cancelReleases" }];
          this.buttonsConfig = [
            { name: "paymentAdd", primary: "true" },
            { name: "paymentImport" },
            { name: "batchReplace" },
            { name: "cancelReleases" },
          ];
          break;
        case "2": // 不发布
          this.editBtnList = [
            {
              name: "删除",
              key: "delete",
              visibleKey: "isCanDelete",
              visibleValue: "1",
            },
            { name: "还原", key: "reset" },
          ];
          this.buttonsConfig = [
            { name: "paymentAdd", primary: "true" },
            { name: "paymentImport" },
            { name: "batchReplace" },
            { name: "delete" },
            { name: "reset" },
          ];
          break;
        case "9": // 全部
          this.editBtnList = [];
          this.buttonsConfig = [
            { name: "paymentAdd", primary: "true" },
            { name: "paymentImport" },
            { name: "batchReplace" },
          ];
          break;
      }
    },
    // 点击按钮
    clickBtn(e) {
      switch (e) {
        case "paymentAdd": // 来款增加
          this.paymentAdd();
          break;
        case "paymentImport": // 来款导入
          this.paymentImport();
          break;
        case "batchReplace": // 批量替换
          this.batchReplace();
          break;
        case "release": // 批量发布
          this.release("batch");
          break;
        case "unRelease": // 批量不发布
          this.unRelease("batch");
          break;
        case "delete": // 批量删除
          this.delete("batch");
          break;
        case "cancelReleases": // 取消发布
          this.cancelReleases("batch", "", "取消成功！");
          break;
        case "reset":
          this.cancelReleases("batch", "", "还原成功！");
          break;
      }
    },
    // 点击行内按钮
    rowBtnClick(item, row) {
      switch (item.key) {
        case "delete": // 删除
          this.delete("single", row);
          break;
        case "release": // 发布
          this.release("single", row);
          break;
        case "unRelease": // 不发布
          this.unRelease("single", row);
          break;
        case "cancelReleases": // 取消发布
          this.cancelReleases("single", row, "取消成功！");
          break;
        case "reset":
          this.cancelReleases("single", row, "还原成功！");
          break;
      }
    },
    // 点击单号, 跳转详情
    billClick(row) {
      this.$router.push({
        path: "/cu/bankPayment/bankPaymentBill",
        query: {
          id: row.arriveCashGuid,
          status: "update",
          cardStatus: this.cardStatus,
        },
      });
    },
    // 来款增加
    paymentAdd() {
      this.$router.push({
        path: "/cu/bankPayment/bankPaymentBill",
        query: {
          status: "add",
          bankCode: this.selectedTreeNode.chrCode,
        },
      });
    },
    // 来款导入
    paymentImport() {
      this.paymentImportVisible = true;
    },
    // 批量替换
    batchReplace() {
      this.batchReplaceVisible = true;
    },
    batchReplaceOk() {
      this.$nextTick(() => {
        this.$refs.tableList.getData();
      });
    },
    // 发布
    release(type, row) {
      let selectedRow = [];
      let ids = [];
      let params = {};
      if (type === "batch") {
        // 批量
        if (this.selectionItems.length < 1) {
          this.$message.warning("请至少选择一条数据！");
          return;
        }
        selectedRow = this.selectionItems;
      } else {
        // 单个
        selectedRow = [row];
      }
      selectedRow.forEach((item) => {
        ids.push(item.arriveCashGuid);
      });
      params = {
        arriveCashGuids: ids,
      };
      this.$axios
        .post("/cu/inComeArriveCash/releases", params)
        .then((res) => {
          if (res.data.flag == "success") {
            this.$refs.tableList.getData();
            this.selectionItems = [];
            this.$message.success("发布成功！");
          } else {
            this.$message.warning(res.data.msg);
          }
        })
        .catch((error) => {
          this.$message.error(error);
        });
    },
    // 不发布
    unRelease(type, row) {
      let selectedRow = [];
      let ids = [];
      let params = {};
      if (type === "batch") {
        // 批量
        if (this.selectionItems.length < 1) {
          this.$message.warning("请至少选择一条数据！");
          return;
        }
        selectedRow = this.selectionItems;
      } else {
        // 单个
        selectedRow = [row];
      }
      selectedRow.forEach((item) => {
        ids.push(item.arriveCashGuid);
      });
      params = {
        arriveCashGuids: ids,
      };
      this.$axios
        .post("/cu/inComeArriveCash/noReleases", params)
        .then((res) => {
          if (res.data.flag == "success") {
            this.$refs.tableList.getData();
            this.selectionItems = [];
            this.$message.success("不发布成功！");
          } else {
            this.$message.warning(res.data.msg);
          }
        })
        .catch((error) => {
          this.$message.error(error);
        });
    },
    // 撤销发布
    cancelReleases(type, row, msg) {
      let selectedRow = [];
      let ids = [];
      let params = {};
      if (type === "batch") {
        // 批量
        if (this.selectionItems.length < 1) {
          this.$message.warning("请至少选择一条数据！");
          return;
        }
        selectedRow = this.selectionItems;
      } else {
        // 单个
        selectedRow = [row];
      }
      selectedRow.forEach((item) => {
        ids.push(item.arriveCashGuid);
      });
      params = {
        arriveCashGuids: ids,
      };
      this.$axios
        .post("/cu/inComeArriveCash/cancelReleases", params)
        .then((res) => {
          if (res.data.flag == "success") {
            this.$refs.tableList.getData();
            this.selectionItems = [];
            this.$message.success(msg);
          } else {
            this.$message.warning(res.data.msg);
          }
        })
        .catch((error) => {
          this.$message.error(error);
        });
    },
    // 删除
    delete(type, row) {
      let vm = this;
      let selectedRow = [];
      let ids = [];
      let params = {};
      let title = "您确定删除选中的数据吗?";
      if (type === "batch") {
        // 批量删除
        if (this.selectionItems.length < 1) {
          this.$message.warning("请至少选择一条数据！");
          return;
        }
        selectedRow = this.selectionItems;
        title = "您确定删除选中的数据吗?";
      } else {
        // 单个删除
        selectedRow = [row];
        title = "您确定删除该条数据吗?";
      }
      this.$confirm({
        title: title,
        okText: "是",
        okType: "danger",
        cancelText: "否",
        onOk() {
          selectedRow.forEach((item) => {
            ids.push(item.arriveCashGuid);
          });
          params = {
            arriveCashGuids: ids,
          };
          vm.$axios
            .post("/cu/inComeArriveCash/deleteByArriveCashGuids", params)
            .then((res) => {
              if (res.data.flag == "success") {
                vm.$refs.tableList.getData();
                vm.selectionItems = [];
                vm.$message.success("删除成功！");
              } else {
                vm.$message.warning(res.data.msg);
              }
            })
            .catch((error) => {
              vm.$message.error(error);
            });
        },
        onCancel() {},
      });
    },
    // 获取树型下拉选项资源
    getTreeList() {
      let params = {
        rgCode: this.pfData.svRgCode,
        setYear: this.pfData.svSetYear,
        agencyCode: this.pfData.svAgencyCode,
        eleCodes: "BGTSOURCE" /*预算类型,*/,
      };
      this.$axios
        .get("/cu/incomeCommon/selectEleCodesTreeList", { params: params })
        .then((res) => {
          if (res.data.flag == "success") {
            const data = res.data.data;
            this.treeOptions.bgtsource = common.translateDataToTree(
              data.BGTSOURCE,
              "pCode",
              "codeName",
              "code"
            ).treeData;
          } else {
            this.$message.warning(res.data.msg);
          }
        })
        .catch((error) => {
          this.$message.error(error);
        });
    },
    // 获取资金来源下拉
    getFundSource() {
      const params = {
        agencyCode: this.pfData.svAgencyCode,
      };
      this.$axios
        .get("/cu/fundSource/selectByParam", { params: params })
        .then((res) => {
          if (res.data.flag == "success") {
            const data = res.data.data;
            this.fundSourceOptions = common.translateDataToTree(
              data,
              "parentCode",
              "codeName",
              "chrCode"
            ).treeData;
          } else {
            this.$message.warning(res.data.msg);
          }
        })
        .catch((error) => {
          this.$message.error(error);
        });
    },
    // 获取收入类型下拉
    getIncomeType() {
      const params = {
        agencyCode: this.pfData.svAgencyCode,
      };
      this.$axios
        .get("/cu/inComeType/selectByParam", { params: params })
        .then((res) => {
          if (res.data.flag == "success") {
            const data = res.data.data;
            this.incomeTypeOptions = common.translateDataToTree(
              data,
              "parentCode",
              "codeName",
              "chrCode"
            ).treeData;
          } else {
            this.$message.warning(res.data.msg);
          }
        })
        .catch((error) => {
          this.$message.error(error);
        });
    },
  },
  computed: {
    ...mapState({
    pfData: (state) => state.pfData
    }),
    searchConfig: {
      get: function () {
        let valArray = [
          {
            name: "来款单号",
            type: "text",
            key: "arriveCashCode",
          },
          {
            name: "来款日期",
            type: "rangeDate",
            key: "arriveCashDate",
          },
          {
            name: "付款单位",
            type: "text",
            key: "payAgencyCode",
          },
          {
            name: "来款金额",
            type: "inputRange",
            key: "arriveCashMoney",
          },
          {
            name: "结算单号",
            type: "text",
            key: "settleBillCode",
          },
          {
            name: "收入类型",
            type: "tree",
            key: "incomeTypeCode",
            treeOptions: this.incomeTypeOptions,
          },
          {
            name: "资金来源",
            type: "tree",
            key: "fundsourceCode",
            treeOptions: this.fundSourceOptions,
          },
        ];
        return valArray;
      },
      set: function (value) {
        // this.value = value.join(',')
      },
    },
  },
  mounted() {
    this.tapConfig = [
      { title: "未发布", key: "0" },
      { title: "已发布", key: "1" },
      { title: "不发布", key: "2" },
      { title: "全部", key: "9" },
    ];
    this.buttonsConfig = [
      { name: "paymentAdd", primary: "true" },
      { name: "paymentImport" },
      { name: "batchReplace" },
      { name: "release" },
      { name: "unRelease" },
      { name: "delete" },
    ];
    this.tableConfig = {
      dataUrl: "/cu/inComeArriveCash/getIncomeArriveCashList",
      dataParams: {
        isReleased: this.cardStatus,
        agencyCode: this.pfData.svAgencyCode,
        bankCode: this.selectedTreeNode.chrCode,
      },
    };
    this.columns = [
      {
        title: "来款单号",
        dataIndex: "arriveCashCode",
        width: "120",
        align: "center",
        click: "1",
      },
      {
        title: "来款日期",
        dataIndex: "arriveCashDate",
        width: "130",
        align: "center",
      },
      { title: "银行", dataIndex: "bankCodeName", width: "120", align: "left" },
      {
        title: "付款单位",
        dataIndex: "payAgencyCode",
        width: "120",
        align: "left",
      },
      {
        title: "来款金额",
        dataIndex: "arriveCashMoney",
        width: "120",
        align: "right",
        type: "money",
      },
      {
        title: "结算单号",
        dataIndex: "settleBillCode",
        width: "120",
        align: "center",
      },
      {
        title: "收入类型",
        dataIndex: "incomeTypeCodeName",
        width: "150",
        align: "left",
      },
      {
        title: "资金来源",
        dataIndex: "fundsourceCodeName",
        width: "150",
        align: "left",
      },
      {
        title: "凭证字号",
        dataIndex: "vouNoName",
        width: "120",
        align: "center",
      },
      {
        title: "凭证日期",
        dataIndex: "vouDate",
        width: "120",
        align: "center",
      },
      {
        title: "是否财政",
        dataIndex: "isFinanceName",
        width: "120",
        align: "center",
      },
      {
        title: "发布状态",
        dataIndex: "isReleasedName",
        width: "120",
        align: "center",
      },
      {
        title: "来款状态",
        dataIndex: "arriveCashStatusName",
        width: "120",
        align: "center",
      },
      { title: "操作", dataIndex: "operation", width: "200", align: "center" },
    ];
    this.editBtnList = [
      { name: "删除", key: "delete" },
      { name: "发布", key: "release" },
      { name: "不发布", key: "unRelease" },
    ];
    // this.getTreeList();
    this.getFundSource();
    this.getIncomeType();
  },
};
</script>

<style scoped>
</style>
