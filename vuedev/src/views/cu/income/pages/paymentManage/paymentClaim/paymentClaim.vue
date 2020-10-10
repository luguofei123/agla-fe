<template>
  <div class="pageContainer">
    <div class="leftContainer">
      <bankTree @selectTree="selectTree" />
    </div>
    <div class="rightContainer">
      <table-list
        ref="tableList"
        :uuid="'paymentClaim'"
        tab-title="来款认领"
        :tab-config="tapConfig"
        @changeTab="changeTab"
        :buttons-config="buttonsConfig"
        :search-config="searchConfig"
        :table-config="tableConfig"
        :columns="columns"
        :data="data"
        @clickBtn="clickBtn"
        @rowBtnClick="rowBtnClick"
        v-model="selectionItems"
      >
      </table-list>
    </div>
    <!--认领弹框-->
    <div>
      <uf-modal
        class="claimDialog"
        v-model="claimVisible"
        title="认领"
        on-ok="claimOk"
        @cancel="claimCancel"
        width="900px"
      >
        <template slot="footer">
          <a-button @click="claimOk" class="mr-10" type="primary">认领</a-button>
          <a-button @click="claimCancel">取消</a-button>
        </template>
        <ul class="formItemContainer">
          <li class="formItem">
            <label class="label">认领序号：</label>
            <span class="value">
              <a-input :placeholder="'请输入认领序号'" v-model="claimDialogData.claimNo" disabled />
            </span>
          </li>
          <li class="formItem">
            <label class="label">认领日期：</label>
            <span class="value">
              <a-date-picker
                :default-value="moment(claimDialogData.claimDate, 'YYYY-MM-DD')"
                @change="claimDateChange"
                disabled
              />
            </span>
          </li>
          <li class="formItem">
            <label class="label" >认领金额：</label>
            <span class="value">
              <a-input-number
                v-model="claimDialogData.claimMoney"
                :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                :parser="value => value.replace(/\$\s?|(,*)/g, '')"
                :placeholder="'请输入认领金额'"
                :min="0"
                :max="9999999999999"
                :disabled="!isCanClaimDc"
              />
            </span>
          </li>
          <!--<li class="formItem">
                        <label class="label">职工号：</label>
                        <span class="value">
                            <a-input :placeholder="'请输入职工号'" v-model="claimDialogData.employeeNo"/>
                        </span>
          </li>-->
          <!--<li class="formItem">
                        <label class="label"></label>
                        <span class="value">
                            <a-checkbox v-model="claimDialogData">已借票据</a-checkbox>
                        </span>
          </li>-->
          <li class="formItem">
            <label class="label">部门：</label>
            <span class="value">
              <a-tree-select
                v-model="claimDialogData.departmentCode"
                style="width: 100%"
                :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
                :tree-data="treeOptions.dept"
                placeholder="请选择部门"
                allow-clear
                disabled
              ></a-tree-select>
            </span>
          </li>
          <li class="formItem">
            <label class="label">认领人：</label>
            <span class="value">
              <a-input :placeholder="'请输入认领人'" v-model="claimDialogData.claimantName" disabled />
            </span>
          </li>
          <li class="formItem">
            <label class="label">项目：</label>
            <span class="value" style="width: 177.3px">
              <a-tree-select
                v-model="claimDialogData.projectCode"
                style="width: 100%"
                :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
                :tree-data="treeOptions.project"
                placeholder="请选择项目"
                allow-clear
              ></a-tree-select>
            </span>
          </li>
          <li class="formItem">
            <label class="label">借票申请单号：</label>
            <span class="value">
              <a-input-search
                placeholder="请输入借票申请单号"
                v-model="claimDialogData.ticketNo"
                @search="searchTicketNo"
                @click="searchTicketNo"
              />
            </span>
          </li>

          <li class="formItem">
            <label class="label">有无合同：</label>
            <span class="value" style="width: 177.3px">
              <a-radio-group  v-model="claimDialogData.isHaveContract" @change="isHaveContractChange"  button-style="solid" size="small">
                <a-radio-button value="1">有</a-radio-button>
                <a-radio-button value="0">无</a-radio-button>
              </a-radio-group>
            </span>
          </li>

          <li class="formItem" v-show="claimDialogData.isHaveContract=='1'">
            <label class="label">合同编号：</label>
            <span class="value">
              <a-input-search
                placeholder="请输入合同编号"
                v-model="claimDialogData.contractCode"
                @search="searchContractCode"
                @click="searchContractCode"
              />
            </span>
          </li>
          <li class="formItem" style="width: 100%">
            <label class="label">说明：</label>
            <span class="value">
              <a-input :placeholder="'请输入说明'" v-model="claimDialogData.remark" :maxLength="100" />
            </span>
          </li>
        </ul>
      </uf-modal>
    </div>
    <!--借票单据列表弹框-->
    <ticket-list-dialog
      v-model="ticketListVisible"
      @handleOk="selectTicketOk"
      :arriveCashGuid="arriveCashGuid"
      :claimMoney="claimMoney"
    ></ticket-list-dialog>
      <!--合同编号列表弹框-->
    <contract-code-dialog
      v-model="contractCodeVisible"
      @handleOk="selectContractCodeOk"
    ></contract-code-dialog>
  </div>

  
</template>

<script>
import { mapState } from 'vuex'
import bankTree from "@/views/cu/income/common/leftTree/bankTree";
import tableList from "@/views/cu/income/common/listModule/tableList";
import ticketListDialog from "./ticketListDialog";
import contractCodeDialog from "./contractCodeDialog";
import common from "@/views/cu/income/common/common";
import moment from "moment";
import { getPdf } from "@/assets/js/util";
export default {
  name: "paymentClaim",
  props: {},
  components: { bankTree, tableList, ticketListDialog,contractCodeDialog },
  data() {
    return {
      selectedTreeNode: {}, // 选中的树节点
      tapConfig: [],
      buttonsConfig: [],
      searchConfig: [],
      tableConfig: {},
      columns: [],
      data: [],
      selectionItems: [],
      rowData: {}, // 点击按钮的当前行数据
      cardStatus: "1", // 页签状态
      claimVisible: false, // 认领弹框
      claimDialogData: {}, // 认领弹框数据
      maxClaimMoney: "", // 可认领最大值
      ticketListVisible: false, // 借票列表
      contractCodeVisible:false,//合同编号列表
      arriveCashGuid: "", // 单据主键
      claimMoney: "", // 认领金额
      contractCode:"",//合同编号 2020、8、5
      treeOptions: {
        // 树下拉列表
        dept: [],
        project: [],
      },
      fundSourceOptions: [], // 资金来源
      incomeTypeOptions: [], // 收入类型
      isHaveContractList:[
        {value:"1",title:"有"},
        {value:"0",title:"无"},
      ],//有无合同
      isCanClaimDc:false,//金额是否可以编辑
    };
  },
  created() {},
  computed: {
      ...mapState({
      pfData: (state) => state.pfData
      }),
  },
  methods: {
    moment,
    // 点击左侧树
    selectTree(node) {
      this.selectedTreeNode = node[0];
      if (this.selectedTreeNode) {
        this.tableConfig.dataParams.bankCode = this.selectedTreeNode.chrCode;
      } else {
        this.tableConfig.dataParams.bankCode = "";
      }
      this.tableConfig.dataParams.bankCode = this.selectedTreeNode.chrCode;
      this.$nextTick(() => {
        this.$refs.tableList.getData();
      });
    },
    // 切换页签
    changeTab(key) {
      this.cardStatus = key;
      if (key === "1") {
        // 来款信息
        this.initPaymentInfo();
      } else if (key === "2") {
        // 我的认领
        this.initMyClaim();
      }
      this.$nextTick(() => {
        this.$refs.tableList.initTable(); // columns发生变化，需要初始化
      });
    },
    initPaymentInfo() {
      // 初始化来款信息
      this.searchConfig = [
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
        {
          name: "金额",
          type: "inputRange",
          key: "arriveCashMoney",
        },
      ];
      this.buttonsConfig = [
        // {name: 'claimPrint', primary: 'true'}
      ];
      this.tableConfig = {
        dataUrl: "/cu/inComeArriveCash/getIncomeArriveCashList",
        dataParams: {
          bankCode: this.selectedTreeNode.chrCode,
          agencyCode: this.pfData.svAgencyCode,
          isReleased: "1",
        },
      };
      this.columns = [
        {
          title: "来款单号",
          dataIndex: "arriveCashCode",
          width: "120",
          align: "center",
        },
        {
          title: "来款日期",
          dataIndex: "arriveCashDate",
          width: "130",
          align: "center",
        },
        {
          title: "银行",
          dataIndex: "bankCodeName",
          width: "120",
          align: "left",
        },
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
          title: "已认领金额",
          dataIndex: "claimedMoney",
          width: "120",
          align: "right",
          type: "money",
        },
        {
          title: "可认领金额",
          dataIndex: "unClaimedMoney",
          width: "120",
          align: "right",
          type: "money",
        },
        {
          title: "结算单号",
          dataIndex: "settleBillCode",
          width: "150",
          align: "left",
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
          title: "来款状态",
          dataIndex: "arriveCashStatusName",
          width: "120",
          align: "center",
        },
        // {
        //   title: "有无合同",
        //   dataIndex: "isHaveContractName",
        //   width: "120",
        //   align: "center",
        // },
        // {
        //   title: "合同编号",
        //   dataIndex: "contractCode",
        //   width: "120",
        //   align: "center",
        // },
        {
          title: "操作",
          dataIndex: "operation",
          width: "100",
          align: "center",
          butList: [
            {
              name: "认领",
              key: "claim",
              visibleKey: "isCanClaim",
              visibleValue: "1",
            },
          ],
        },
      ];
    },
    initMyClaim() {
      // 初始化我的认领
      this.searchConfig = [
        {
          name: "来款单号",
          type: "text",
          key: "arriveCashCode",
        },
        {
          name: "认领序号",
          type: "text",
          key: "claimNo",
        },
        {
          name: "认领日期",
          type: "rangeDate",
          key: "claimDate",
        },
        {
          name: "项目",
          type: "tree",
          key: "projectCode",
          treeOptions: this.treeOptions.project,
        },
        {
          name: "认领金额",
          type: "inputRange",
          key: "claimMoney",
        },
        {
          name: "借票申请单号",
          type: "text",
          key: "ticketNo",
        },
        {
          name: "有无合同",
          type: "tree",
          key: "isHaveContract ",
          treeOptions: this.isHaveContractList,
        },
        {
          name: "合同编号",
          type: "text",
          key: "contractCode",
        },
        {
          title: "审核状态",
          dataIndex: "isAuditName",
          width: "120",
          align: "center",
        },
    
      ];
      this.buttonsConfig = [
        { name: "claimPrint", primary: "true" },
        { name: "cancelClaim" },
      ];
      this.tableConfig = {
        dataUrl: "/cu/incomeClaimBusiness/selectByParam",
        dataParams: {
          claimant: this.pfData.svUserCode,
          bankCode: this.selectedTreeNode.chrCode,
          agencyCode: this.pfData.svAgencyCode,
        },
      };
      this.columns = [
        {
          title: "来款单号",
          dataIndex: "arriveCashCode",
          width: "120",
          align: "center",
        },
        {
          title: "认领序号",
          dataIndex: "claimNo",
          width: "120",
          align: "center",
        },
        {
          title: "认领日期",
          dataIndex: "claimDate",
          width: "120",
          align: "center",
        },
        {
          title: "认领人",
          dataIndex: "claimantName",
          width: "120",
          align: "center",
        },
        {
          title: "部门",
          dataIndex: "departmentCodeName",
          width: "120",
          align: "left",
        },
        {
          title: "项目",
          dataIndex: "projectCodeName",
          width: "200",
          align: "left",
        },
        {
          title: "认领金额",
          dataIndex: "claimMoney",
          width: "120",
          align: "center",
        },
        {
          title: "借票申请单号",
          dataIndex: "ticketNo",
          width: "120",
          align: "center",
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
          title: "有无合同",
          dataIndex: "isHaveContractName",
          width: "120",
          align: "center",
        },
        {
          title: "合同编号",
          dataIndex: "contractCode",
          width: "120",
          align: "center",
        },
       
        {
          title: "操作",
          dataIndex: "operation",
          width: "100",
          align: "center",
          butList: [
            {
              name: "撤销认领",
              key: "cancelClaim",
              visibleKey: "isCanCancelclaim",
              visibleValue: "1",
            },
          ],
        },
      ];
    },
    // 点击按钮
    clickBtn(e) {
      switch (e) {
        case "cancelClaim":
          this.revokeClaim("batch");
          break;
        case "claimPrint":
          this.print();
          break;
      }
    },
    // 点击行内按钮
    rowBtnClick(item, row) {
      this.rowData = row;
      switch (item.key) {
        case "claim": // 认领
          this.claimPayment(row);
          break;
        case "cancelClaim": // 撤销认领
          this.revokeClaim("single", row);
          break;
      }
    },
    // 认领
    claimPayment(row) {
      if (row.unClaimedMoney == "0") {
        this.$message.warning("该条来款已全部认领完！");
        return;
      }
      this.arriveCashGuid = row.arriveCashGuid;
      let params = {
        arriveCashGuid: row.arriveCashGuid,
      };
      this.$axios
        .get("/cu/incomeClaimBusiness/getInitParam", { params: params })
        .then((res) => {
          if (res.data.flag == "success") {
            this.claimVisible = true;
            this.claimDialogData = res.data.data.claimBusiness;
            this.maxClaimMoney = this.claimDialogData.claimMoney;
            this.isCanClaimDc = res.data.data.isCanClaimDc;
          } else {
            this.$message.warning(res.data.msg);
          }
        })
        .catch((error) => {
          this.$message.error(error);
        });
    },
    // 认领取消
    claimCancel() {
      this.claimVisible = false;
    },
    // 认领确认
    claimOk() {
      let params = this.claimDialogData;
      params.arriveCashGuid = this.rowData.arriveCashGuid;
      if (params.claimMoney > this.maxClaimMoney) {
        this.$message.warning(
          "认领金额不能大于可认领金额！可认领金额是：" + this.maxClaimMoney
        );
        return;
      }
      this.$axios
        .post("/cu/incomeClaimBusiness/claimBusiness", params)
        .then((res) => {
          if (res.data.flag == "success") {
            this.$message.success("认领成功！");
            this.claimVisible = false;
            this.$refs.tableList.getData();
          } else {
            this.$message.warning(res.data.msg);
          }
        })
        .catch((error) => {
          this.$message.error(error);
        });
    },
    // 撤销认领
    revokeClaim(type, row) {
      let vm = this;
      let selectedRow = [];
      let ids = [];
      let params = {};
      let title = "您确定撤销选中的认领吗?";
      if (type === "batch") {
        // 批量删除
        if (this.selectionItems.length < 1) {
          this.$message.warning("请至少选择一条数据！");
          return;
        }
        selectedRow = this.selectionItems;
        title = "您确定撤销选中的数据吗?";
      } else {
        // 单个删除
        selectedRow = [row];
        title = "您确定撤销该条认领吗?";
      }
      selectedRow.forEach((item) => {
        ids.push(item.claimBusinessGuid);
      });
      params = {
        claimBusinessGuids: ids,
      };
      this.$confirm({
        title: title,
        okText: "是",
        okType: "danger",
        cancelText: "否",
        onOk() {
          vm.$axios
            .post("/cu/incomeClaimBusiness/cancelClaimBusinesss", params)
            .then((res) => {
              if (res.data.flag == "success") {
                vm.$refs.tableList.getData();
                vm.$message.success("撤销成功！");
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
    //有无合同选择
    isHaveContractChange(e){
        this.claimDialogData.isHaveContract = e.target.value;
    },
    // 打开合同编码列表
    searchContractCode() {
      this.contractCode = this.claimDialogData.contractCode;
      this.contractCodeVisible = true;
    },
    // 选择合同确定
    selectContractCodeOk(data){
      if(data&&data.length>=1){
        this.claimDialogData.contractCode = data[0].contractCode
        this.claimDialogData.contractGuid = data[0].charId;
      }
    },

    // 打开借票单据列表
    searchTicketNo() {
      if (!this.claimDialogData.claimMoney) {
        this.$message.warning("请输入认领金额");
        return;
      }
      this.claimMoney = this.claimDialogData.claimMoney;
      this.ticketListVisible = true;
    },

    // 选择借票单据确定
    selectTicketOk(data) {
      if (data) {
        this.claimDialogData.ticketNo = data[0].applicationNo;
        this.claimDialogData.ticketGuid = data[0].ticketGuid;
      }
    },
    // 认领日期发生变化
    claimDateChange(date, dateString) {
      this.claimDialogData.claimDate = dateString;
    },
    // 打印
    print() {
      if (this.selectionItems.length !== 1) {
        this.$message.warning("请选择一条认领信息！");
        return;
      }
      let params = {
        claimBusinessGuid: this.selectionItems[0].claimBusinessGuid,
        agencyCode: this.pfData.svAgencyCode,
      };
      this.$axios
        .post("/cu/incomeClaimPrint/getPrintDataSignle", params)
        .then((res) => {
          if (res.data.flag === "success") {
            let data = [{}];
            res.data.data.forEach((item) => {
              Object.assign(data[0], item);
            });
            getPdf("CU_INOME_CLAIM", "*", JSON.stringify(data));
          } else {
            this.$message.warning(res.data.msg);
          }
        })
        .catch((error) => {
          this.$message.error(error);
        });
    },
    // 获取树型下拉选项资源
    getTreeList() {
      let params = {
        rgCode: this.pfData.svRgCode,
        setYear: this.pfData.svSetYear,
        agencyCode: this.pfData.svAgencyCode,
        eleCodes: "DEPARTMENT,PROJECT" /*部门，项目*/,
      };
      this.$axios
        .get("/cu/incomeCommon/selectEleCodesTreeList", { params: params })
        .then((res) => {
          if (res.data.flag == "success") {
            const data = res.data.data;
            this.treeOptions.dept = common.translateDataToTree(
              data.DEPARTMENT,
              "pCode",
              "codeName",
              "code"
            ).treeData;
            this.treeOptions.project = common.translateDataToTree(
              data.PROJECT,
              "pCode",
              "codeName",
              "code"
            ).treeData;
            console.log("dddd",this.treeOptions.project);
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
            this.searchConfig[5].treeOptions = this.fundSourceOptions;
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
          if (res.data.flag === "success") {
            const data = res.data.data;
            this.incomeTypeOptions = common.translateDataToTree(
              data,
              "parentCode",
              "codeName",
              "chrCode"
            ).treeData;
            console.log("ttttttt",this.incomeTypeOptions);
            this.searchConfig[4].treeOptions = this.incomeTypeOptions;
          } else {
            this.$message.warning(res.data.msg);
          }
        })
        .catch((error) => {
          this.$message.error(error);
        });
    },
  },
  mounted() {
    this.tapConfig = [
      { title: "来款信息", key: "1" },
      { title: "我的认领", key: "2" },
    ];
    this.buttonsConfig = [{ name: "claimPrint", primary: "true" }];
    this.getTreeList();
    this.getFundSource();
    this.getIncomeType();
    this.initPaymentInfo();
  },
  watch: {},
};
</script>

<style scoped>
</style>
