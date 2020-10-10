<template>
  <uf-modal
    class="contractDialog"
    v-model="visible"
    title="合同编码"
    @ok="handleOk"
    @cancel="handleCancel"
    width="1000px"
  >
    <div class="pageContainer" v-if="visible">
      <table-list
        ref="tableList"
        :uuid="'contractDialog'"
        :showTabs="false"
        :tab-config="tapConfig"
        :buttons-config="buttonsConfig"
        :search-config="searchConfig"
        :table-config="tableConfig"
        :columns="columns"
        :data="data"
        @clickBtn="clickBtn"
        v-model="selectionItems"
      ></table-list>
    </div>
  </uf-modal>
</template>

<script>
import { mapState } from 'vuex'
import tableList from "@/views/cu/income/common/listModule/tableList";
import common from "@/views/cu/income/common/common";
export default {
  name: "contractDialog",
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    arriveCashGuid: String,
    claimMoney: [Number, String],
  },
  model: {
    prop: ["visible"],
    event: "change",
  },
  components: { tableList },
  computed: {
      ...mapState({
      pfData: (state) => state.pfData
      }),
  },
  data() {
    return {
      // tableList
      tapConfig: [],
      buttonsConfig: [],
      searchConfig: [],
      tableConfig: {},
      columns: [],
      data: [],
      selectionItems: [],
      treeOptions: {
        // 树行下拉集合
        billType: [], // 票据类型
        project: [], // 项目
      },
      fundSourceOptions: [], // 资金来源
    };
  },
  created() {},
  methods: {
    handleCancel() {
      this.$emit("change", false);
    },
    handleOk() {
      if (this.selectionItems.length > 1) {
        this.$message.warning("最多选择一条数据！");
        return;
      }
    //   console.log(this.selectionItems[0].unOpenTicketMoney);
    //   console.log(this.claimMoney);
    //   if (this.selectionItems.unOpenTicketMoney < this.claimMoney) {
    //     this.$message.warning("开票可使用金额必须大于认领金额");
    //     return;
    //   }
      this.$emit("handleOk", this.selectionItems);
      this.$emit("change", false);
    },
    // 点击按钮
    clickBtn(e) {
      switch (e) {
        case "":
          break;
      }
    },
    // // 获取树型下拉选项资源
    // getTreeList() {
    //     let params = {
    //         rgCode: this.pfData.svRgCode,
    //         setYear: this.pfData.svSetYear,
    //         agencyCode: this.pfData.svAgencyCode,
    //         eleCodes: 'PROJECT,BILLTYPE' /*项目 票据类型*/
    //     };
    //     this.$axios.get('/cu/incomeCommon/selectEleCodesTreeList', {params: params})
    //         .then(res => {
    //             if (res.data.flag == 'success') {
    //                 const data = res.data.data;
    //                 this.treeOptions.project = common.translateDataToTree(data.PROJECT, 'pCode','codeName', 'code').treeData;
    //                 this.treeOptions.billType = common.translateDataToTree(data.BILLTYPE, 'pCode','codeName', 'code').treeData;
    //                 this.searchConfig[3].treeOptions = this.treeOptions.project;
    //                 this.searchConfig[2].treeOptions = this.treeOptions.billType;
    //             } else {
    //                 this.$message.warning(res.data.msg);
    //             }
    //         })
    //         .catch(error => {
    //             this.$message.error(error)
    //         })
    // }
  },
  mounted() {
    this.tapConfig = [];
    this.buttonsConfig = [];
    this.searchConfig = [
      {
        name: "日期",
        type: "rangeDate",
        key: "signDate",
      },
      {
        name: "合同编码",
        type: "text",
        key: "contractCode",
      },
      {
        name: "合同名称",
        type: "text",
        key: "contractName",
      },
      {
        name: "合同金额",
        type: "inputRange",
        key: "contractAmount",
      },
    ];
    this.tableConfig = {
      dataUrl: "/cu/incomeContract/selectByParamForFy",
      dataParams: {
        agencyCode: this.pfData.svAgencyCode,
      },
    };
    this.columns = [
      {
        title: "合同日期",
        dataIndex: "signDate",
        width: "120",
        align: "center",
      },
      {
        title: "合同类型",
        dataIndex: "contractTypeCode",
        width: "120",
        align: "center",
      },
      {
        title: "合同编码",
        dataIndex: "contractCode",
        width: "130",
        align: "left",
      },
      {
        title: "合同名称",
        dataIndex: "contractName",
        width: "120",
        align: "center",
      },
      {
        title: "合同金额",
        dataIndex: "contractAmount",
        width: "100",
        align: "right",
        type: "money",
      },
      {
        title: "单据状态名称",
        dataIndex: "billStatusName",
        width: "100",
        align: "right",
      },
      {
        title: "开票已使用金额",
        dataIndex: "openTicketMoney",
        width: "100",
        align: "right",
        type: "money",
      },
      {
        title: "开票可使用金额",
        dataIndex: "unOpenTicketMoney",
        width: "100",
        align: "right",
        type: "money",
      },
      
    ];
    // this.getTreeList();
  },
  watch: {
    // arriveCashGuid() {
    //     this.tableConfig.dataParams.arriveCashGuid = this.arriveCashGuid
    // },
    // claimMoney() {
    //     this.tableConfig.dataParams.claimMoney = this.claimMoney
    // }
  },
};
</script>

<style lang="less">
.contractDialog
  .search-condition
  .condition-container
  .form-item
  .ant-form-item
  .ant-form-item-label {
  width: 100px;
}
</style>
