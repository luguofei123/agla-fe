<template>
  <div class="pageContainer">
    <div class="leftContainer">
      <bankTree @selectTree="selectTree" />
    </div>
    <div class="rightContainer" style="height: 100%;overflow: auto;">
      <table-list
        ref="tableList"
        :uuid="'paymentClaim'"
        tab-title="来款认领确认"
        :tab-config="tapConfig"
        @changeTab="changeTab"
        :buttons-config="buttonsConfig"
        :search-config="searchConfig"
        :table-config="tableConfig"
        :columns="columns"
        :data="data"
        @clickBtn="clickBtn"
        @billClick="billClick"
        @rowBtnClick="rowBtnClick"
        v-model="selectionItems"
      ></table-list>
      <div v-if="isShowClaimDetail">
        <table-list
          ref="tableListClaim"
          :uuid="'claimDetail'"
          tab-title="认领详情"
          :table-config="claimTableConfig"
          :columns="claimColumns"
          :data="claimData"
          @rowBtnClick="rowBtnClick"
          v-model="claimSelectionItems"
        ></table-list>
      </div>
    </div>
    <!--登记弹框-->
    <div>
      <uf-modal
        class="claimDialog"
        v-model="dengjiVisible"
        title="补充登记"
        on-ok="claimOk"
        @cancel="claimCancel"
        width="900px"
      >
        <template slot="footer">
          <a-button @click="claimOk" class="mr-10" type="primary">登记</a-button>
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
            <label class="label">认领金额：</label>
            <span class="value">
              <a-input-number
                v-model="claimDialogData.claimMoney"
                :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                :parser="value => value.replace(/\$\s?|(,*)/g, '')"
                :placeholder="'请输入认领金额'"
                :min="0"
                :max="9999999999999"
                disabled
              />
            </span>
          </li>
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
                disabled
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
                disabled
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
          
          <li class="formItem"  v-show="claimDialogData.isHaveContract=='1'">
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
              <a-input :placeholder="'请输入说明'" v-model="claimDialogData.remark" :maxLength="100" disabled/>
            </span>
          </li>
        </ul>
      </uf-modal>
    </div>
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
import common from "@/views/cu/income/common/common";
import moment from "moment";
import contractCodeDialog from "./contractCodeDialog";
export default {
  name: "paymentClaimAudit",
  props: {},
  components: { bankTree, tableList,contractCodeDialog},
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
      isShowClaimDetail: false, //是否显示认领详情
      claimTableConfig: [],
      claimColumns: [],
      claimData: [],
      claimSelectionItems: [],
      treeOptions: {
        // 树下拉列表
        dept: [],
        project: [],
      },
      fundSourceOptions: [], // 资金来源
      incomeTypeOptions: [], // 收入类型
      dengjiVisible: false,
      claimDialogData: {}, // 认领弹框数据
      isHaveContractList:[
        {value:"1",title:"有"},
        {value:"0",title:"无"},
      ],//有无合同
      contractCodeVisible:false,
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
        // 认领信息
        this.initClaim();
        this.isShowClaimDetail = false;
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
      ];
      this.tableConfig = {
        dataUrl: "/cu/inComeArriveCash/getIncomeArriveCashList",
        dataParams: {
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
          click: "1",
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
          width: "120",
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
      ];
    },
    initClaim() {
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
        
      ];
      this.tableConfig = {
        dataUrl: "/cu/incomeClaimBusiness/selectByParam",
        dataParams: {
          bankCode: this.selectedTreeNode.chrCode,
          agencyCode: this.pfData.svAgencyCode,
        },
      };
      this.columns = [
        {
          title: "来款单号09090",
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
        // {title: '职工号', dataIndex: 'claimNo', width: '120', align: 'center'},
        {
          title: "部门",
          dataIndex: "departmentCodeName",
          width: "120",
          align: "left",
        },
        {
          title: "项目",
          dataIndex: "projectCodeName",
          width: "180",
          align: "left",
        },
        {
          title: "认领金额",
          dataIndex: "claimMoney",
          width: "120",
          align: "right",
          type: "money",
        },
        {
          title: "借票申请单号",
          dataIndex: "ticketNo",
          width: "150",
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
          title: "审核状态",
          dataIndex: "isAuditName",
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
          width: "150",
          align: "center",
          butList: [
            {
              name: "登记",
              key: "dengji",
              visibleKey: "isSignContract",//0表示尚未登记
              visibleValue: "0",
            },
            {
              name: "取消登记",
              key: "cancelDengji",
              visibleKey: "isSignContract",//1表示已经登记
              visibleValue: "1",
            },
            {
              name: "审核",
              key: "audit",
              visibleKey: "isCanAudit",
              visibleValue: "1",
            },
            {
              name: "撤销审核",
              key: "cancelAudit",
              visibleKey: "isCanCancelAudit",
              visibleValue: "1",
            },
          ],
        },
      ];
    },
    // 点击按钮
    clickBtn(e) {
      switch (e) {
        case "audit":
          this.audit("batch");
          break;
        case "cancelAudit":
          this.cancelAudits("batch");
          break;
      }
    },
    // 点击行内按钮
    rowBtnClick(item, row) {
      switch (item.key) {
        case "audit": // 审核
          this.audit("single", row);
          break;
        case "cancelAudit": // 撤销审核
          this.cancelAudits("single", row);
          break;
        case "dengji": //登记
           this.$axios
            .get("/cu/incomeClaimBusiness/getClaimByClaimGuid/"+row.claimBusinessGuid, {})
            .then((res) => {
                if(res.data.flag == "success"){
                    this.claimDialogData = res.data.data;
                    this.$refs.tableList.getData();
                    if (this.isShowClaimDetail) {
                      this.$refs.tableListClaim.getData(); // 刷新详情
                    }
                    this.dengjiVisible = true;
                }else{
                    this.$message.warning(res.data.msg);
                }
            })
            .catch((error) => {
              this.$message.error(error);
            });
          
          break;
        case "cancelDengji"://取消登记
            this.cancelDengjis(row);
         break;
      }
    },
    // 点击单号, 打开认领详情
    billClick(row) {
      this.claimTableConfig = {
        dataUrl:
          "/cu/incomeClaimBusiness/getListByArriveCashGuid/" +
          row.arriveCashGuid,
        dataParams: {
          agencyCode: this.pfData.svAgencyCode,
        },
      };
      this.claimColumns = [
        {
          title: "认领序号1",
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
          title: "部门",
          dataIndex: "departmentCodeName",
          width: "120",
          align: "left",
        },
        {
          title: "认领人",
          dataIndex: "claimantName",
          width: "120",
          align: "center",
        },
        {
          title: "项目",
          dataIndex: "projectCodeName",
          width: "120",
          align: "center",
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
          width: "150",
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
          title: "审核状态",
          dataIndex: "isAuditName",
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
          width: "150",
          align: "center",
          butList: [
            {
              name: "登记",
              key: "dengji",
              visibleKey: "isSignContract",//0表示尚未登记
              visibleValue: "0",
            },
            {
              name: "取消登记",
              key: "cancelDengji",
              visibleKey: "isSignContract",//1表示已经登记
              visibleValue: "1",
            },
            {
              name: "审核",
              key: "audit",
              visibleKey: "isCanAudit",
              visibleValue: "1",
            },
            {
              name: "撤销审核",
              key: "cancelAudit",
              visibleKey: "isCanCancelAudit",
              visibleValue: "1",
            },
          ],
        },
      ];
      this.$nextTick(() => {
        this.isShowClaimDetail = true;
      });
    },
    // 审核
    audit(type, row) {
      let vm = this;
      let selectedRow = [];
      let ids = [];
      let params = {};
      let title = "您确定审核选中的认领吗?";
      if (type === "batch") {
        // 批量
        if (this.selectionItems.length < 1) {
          this.$message.warning("请至少选择一条数据！");
          return;
        }
        selectedRow = this.selectionItems;
        title = "您确定审核选中的数据吗?";
      } else {
        // 单个
        selectedRow = [row];
        title = "您确定审核该条认领吗?";
      }
      selectedRow.forEach((item) => {
        ids.push(item.claimBusinessGuid);
      });
      this.$confirm({
        title: title,
        okText: "是",
        okType: "danger",
        cancelText: "否",
        onOk() {
          params = {
            claimBusinessGuids: ids,
          };
          vm.$axios
            .post("/cu/incomeClaimBusiness/audits", params)
            .then((res) => {
              if (res.data.flag == "success") {
                vm.$refs.tableList.getData();
                vm.$message.success("审核成功！");
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
    // 撤销审核
    cancelAudits(type, row) {
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
      this.$confirm({
        title: title,
        okText: "是",
        okType: "danger",
        cancelText: "否",
        onOk() {
          params = {
            claimBusinessGuids: ids,
          };
          vm.$axios
            .post("/cu/incomeClaimBusiness/cancelAudits", params)
            .then((res) => {
              if (res.data.flag == "success") {
                vm.$refs.tableList.getData();
                if (vm.isShowClaimDetail) {
                  vm.$refs.tableListClaim.getData(); // 刷新详情
                }
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
    //取消登记
    cancelDengjis(row){
      let params = {
        claimBusinessGuid:row.claimBusinessGuid
      };
          this.$axios.post("/cu/incomeClaimBusiness/cancelSignContract",params).then(res=>{
            if(res.data.flag == "success"){
              this.$message.success("取消登记成功");
              //  this.$refs.tableList.getData();
              this.$refs.tableList.getData();
              if (this.isShowClaimDetail) {
                this.$refs.tableListClaim.getData(); // 刷新详情
              }
            }else{
              this.$message.warning(res.data.msg);
            }
          }).catch(error=>{
            this.$message.error(error);
          })
    },
    // 打开借票单据列表
    searchTicketNo() {
      this.ticketListVisible = true;
    },
    // 选择借票单据确定
    selectTicketOk() {},
    // 认领日期发生变化
    claimDateChange(date, dateString) {
      this.claimDialogData.claimDate = dateString;
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
            this.treeOptions.projec = common.translateDataToTree(
              data.PROJECT,
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
          if (res.data.flag == "success") {
            const data = res.data.data;
            this.incomeTypeOptions = common.translateDataToTree(
              data,
              "parentCode",
              "codeName",
              "chrCode"
            ).treeData;
            this.searchConfig[4].treeOptions = this.incomeTypeOptions;
          } else {
            this.$message.warning(res.data.msg);
          }
        })
        .catch((error) => {
          this.$message.error(error);
        });
    },
    //登记确认
    claimOk(){
       let params = this.claimDialogData;
      this.$axios
        .post("/cu/incomeClaimBusiness/signContract", params)
        .then((res) => {
          if (res.data.flag == "success") {
            this.$message.success("登记成功！");
            // 这里
            this.$refs.tableList.getData();
            this.dengjiVisible = false;
          } else {
            this.$message.warning(res.data.msg);
          }
        })
        .catch((error) => {
          this.$message.error(error);
        });
    },
    claimCancel(){
        this.dengjiVisible = false;
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
  },
  mounted() {
    this.tapConfig = [
      { title: "来款信息", key: "1" },
      { title: "认领信息", key: "2" },
    ];
    this.buttonsConfig = [];
    this.initPaymentInfo();
    this.getTreeList();
    this.getFundSource();
    this.getIncomeType();
  },
  watch: {},
};
</script>

<style scoped>
</style>
