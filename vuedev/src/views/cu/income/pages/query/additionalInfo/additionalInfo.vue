<!--
 * @Author: yzt
 * @Description: 开票补充登记来款信息
 * @Date: 2020/8/27
 -->
<template>
  <div class="pageContainer addition-info">
    <div class="rightContainer" style="height:100%;padding:24px 0">
      <search-condition
        ref="searchForm"
        :searchList="searchConfig"
        @submit="search"
        @myHeight="getConditionsHeight"
      ></search-condition>
      <div ref="wrap" class="wrap">
        <div class="table-box">
          <div class="left-title">
            <p class="title">开票信息</p>
          </div>
          <div class="first">
            <vxe-grid
              height="100%"
              border
              resizable
              auto-resize
              showOverflow
              showHeaderOverflow
              :radio-config="{trigger: 'row'}"
              :columns="kpColumns"
              :data="kpData"
              :loading="kpLoading"
              @radio-change="radioChangeEvent"
            ></vxe-grid>
          </div>
        </div>
        <div class="page-box">
          <a-pagination
            :total="kpPages.total"
            show-size-changer
            @showSizeChange="onKpSizeChange"
            @change="onKpChange"
          />
        </div>

        <div class="table-box">
          <div class="left-title">
            <p class="title">来款信息</p>
          </div>
          <div class="first">
            <vxe-grid
              height="100%"
              border
              resizable
              auto-resize
              showOverflow
              showHeaderOverflow
              :checkbox-config="{trigger: 'row',}"
              :columns="lkColumns"
              :data="lkData"
              :loading="lkLoading"
              @checkbox-change="checkBoxChangeEvent"
            ></vxe-grid>
          </div>
        </div>
        <div class="page-box">
          <a-pagination
            :total="lkPages.total"
            show-size-changer
            @showSizeChange="onLkSizeChange"
            @change="onLkChange"
          />
        </div>
      </div>
      <div class="btn-box">
        <a-button @click="goudui" v-show="isShowGd" style="margin-right:8px;">勾兑</a-button>
        <a-button @click="cancelGoudui" v-show="isShowCancelGd">取消勾兑</a-button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import XEUtils from "xe-utils";
import common from "@/views/cu/income/common/common";
import searchCondition from "@/views/cu/income/common/listModule/searchCondition";
export default {
  components: {searchCondition},
  props: {},
  data() {
    return {
      lkLoading: false,
      kpLoading: false,
      tableColumns: [],
      kpColumns: [
        {
          type: "radio",
          width: "60",
          align: "center",
        },
        {
          title: "开票日期",
          field: "openTicketDate",
          width: "130",
          align: "center",
        },
        {
          title: "票据类型",
          field: "billType",
          width: "130",
          align: "center",
        },
        {
          title: "票据号",
          field: "billNo",
          width: "130",
          align: "center",
        },
        {
          title: "付款单位",
          field: "otherUnit",
          width: "130",
          align: "center",
        },
        {
          title: "票据金额",
          field: "openTicketMoney",
          width: "130",
          align: "right",
          formatter: this.formatAmount,
        },
        {
          title: "已到账金额",
          field: "groupMoney",
          width: "130",
          align: "right",
          formatter: this.formatAmount,
        },
        {
          title: "未到账金额",
          field: "unGroupMoney",
          width: "130",
          align: "right",
          formatter: this.formatAmount,
        },
        {
          title: "开票项目",
          field: "projectCode",
          width: "130",
          align: "center",
        },
        {
          title: "有无合同",
          field: "isHaveContract",
          width: "130",
          align: "center",
          formatter: this.formatIsHaveContract,
        },
        {
          title: "合同编号",
          field: "contractCode",
          width: "130",
          align: "center",
        },
        {
          title: "开票类型",
          field: "type",
          width: "130",
          align: "center",
          formatter: this.formatType,
        },
      ], //开票信息表格头
      lkColumns: [
        {
          type: "checkbox",
          width: "60",
          align: "center",
        },
        {
          title: "来款单号",
          field: "arriveCashCode",
          width: "120",
          align: "center",
        },
        {
          title: "来款金额",
          field: "arriveCashMoney",
          width: "120",
          align: "right",
          formatter: this.formatAmount,
        },
        {
          title: "认领日期",
          field: "claimDate",
          width: "120",
          align: "center",
        },
        {
          title: "部门",
          field: "departmentCodeName",
          width: "120",
          align: "center",
        },
        {
          title: "认领人",
          field: "claimantName",
          width: "120",
          align: "center",
        },
        {
          title: "项目",
          field: "projectCode",
          width: "120",
          align: "center",
        },
        {
          title: "认领金额",
          field: "claimMoney",
          width: "120",
          align: "right",
          formatter: this.formatAmount,
        },
        {
          title: "凭证编号",
          field: "vouNo",
          width: "120",
          align: "center",
        },
        {
          title: "来往号",
          field: "contactCode",
          width: "120",
          align: "center",
        },
        {
          title: "借票申请单号",
          field: "ticketNo",
          width: "120",
          align: "center",
        },
        {
          title: "有无合同",
          field: "isHaveContract",
          width: "120",
          align: "center",
          formatter: this.formatIsHaveContract,
        },
        {
          title: "合同编号",
          field: "contractCode",
          width: "120",
          align: "center",
        },
      ], //来款信息表格头
      kpData: [], //开票表格数据信息
      lkData: [],
      kpSelectRow: {},
      lkSelectList: [],
      lkPages: {
        total: 0, //总条数
        pageNum: 1, //当前页数
        pageSize: 10, //每页的条数
      },
      kpPages: {
        total: 0, //总条数
        pageNum: 1, //当前页数
        pageSize: 10, //每页的条数
      },

      editBtnList: [],
      searchParams: {},
      isShowCancelGd: false,
      isShowGd: false,
      searchConfig: [],
      treeOptions: {
        // 树行下拉集合
        billType: [], // 票据类型
        project: [], // 开票项目
      },
    };
  },
  watch: {},
  computed: {
      ...mapState({
      pfData: (state) => state.pfData
      }),
  },
  methods: {
    initPaymentInfo() {
      this.searchConfig = [
        {
          name: "期间",
          type: "rangeDate",
          key: "ticketDate",
        },
        {
          name: "票据类型",
          type: "tree",
          key: "billType",
          treeOptions: this.treeOptions.billType,
        },
        {
          name: "开票项目",
          type: "tree",
          key: "projectCode",
          treeOptions: this.treeOptions.project,
        },
        {
          name: "金额",
          type: "inputRange",
          key: "ticketMoney",
        },
        {
          name: "开票类型",
          type: "radioGroupButton",
          key: "types",
          radio: [
            { label: "全部", value: "1,2" },
            { label: "借票开票", value: "1" },
            { label: "直接开票", value: "2" },
          ],
        },
        {
          name: "状态",
          type: "radioGroupButton",
          key: "isGroups",
          value:"0,1,2",
          radio: [
            { label: "全部", value: "0,1,2" },
            { label: "已勾兑", value: "1,2" },
            { label: "未勾兑", value: "0" },
            { label: "部分勾兑", value: "2" },
          ],
        },
      ];
    },
    getTreeList() {
      let params = {
        rgCode: this.pfData.svRgCode,
        setYear: this.pfData.svSetYear,
        agencyCode: this.pfData.svAgencyCode,
        eleCodes: "BILLTYPE,PROJECT",
      };
      this.$axios
        .get("/cu/incomeCommon/selectEleCodesTreeList", { params: params })
        .then((res) => {
          if (res.data.flag == "success") {
            const data = res.data.data;
            this.treeOptions.billType = common.translateDataToTree(
              data.BILLTYPE,
              "pCode",
              "codeName",
              "code"
            ).treeData;
            this.treeOptions.project = common.translateDataToTree(
              data.PROJECT,
              "pCode",
              "codeName",
              "code",
            ).treeData;
      
            this.searchConfig[1].treeOptions = this.treeOptions.billType;
            this.searchConfig[2].treeOptions = this.treeOptions.project;
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    //查询
    search(val) {
      if (val.isGroups == "0,1,2") {
        this.isShowGd = true;
        this.isShowCancelGd = true;
        // 俩
      } else if (val.isGroups == "2" || val.isGroups == "0") {
        this.isShowGd = true;
        this.isShowCancelGd = false;
        // 勾对
      } else if (val.isGroups == "1,2") {
        this.isShowGd = false;
        this.isShowCancelGd = true;
        //取消
      }
      this.searchParams = val;
      this.queryKpInfo();
      this.queryLkInfo();
    },
    //查询开票信息
    queryKpInfo() {
      let kpPageParams = {
        rgCode: this.pfData.svRgCode,
        setYear: this.pfData.svSetYear,
        agencyCode: this.pfData.svAgencyCode,
        currentPage: this.kpPages.pageNum,
        pageSize: this.kpPages.pageSize,
        isOpenTicketAudit: "1",
      };
      let kpParams = Object.assign(kpPageParams, this.searchParams);
      this.kpLoading = true;
      this.$axios
        .get("/cu/inComeTicket/selectByParam", { params: kpParams })
        .then((res) => {
          if (res.data.flag == "success") {
            this.kpLoading = false;
            this.kpData = res.data.data.list;
            this.kpPages.total = res.data.data.total;
          } else {
            this.kpLoading = false;
            this.$message.error(res.data.msg);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    //查询来款信息
    queryLkInfo() {
      let lkGroup = "";
      if (this.searchParams.isGroups == "1,2") {
        lkGroup = "1";
      } else if (
        this.searchParams.isGroups == "2" ||
        this.searchParams.isGroups == "0"
      ) {
        lkGroup = "0";
      } else {
        lkGroup = "";
      }
      let lkParams = {
        rgCode: this.pfData.svRgCode,
        setYear: this.pfData.svSetYear,
        agencyCode: this.pfData.svAgencyCode,
        currentPage: this.lkPages.pageNum,
        pageSize: this.lkPages.pageSize,
        isAudit: "1",
        ticketDateEnd: this.searchParams.ticketDateEnd,
        ticketDateStart: this.searchParams.ticketDateStart,
        projectCode: this.searchParams.projectCode,
        isGroups: lkGroup,
    
      };
      this.lkLoading = true;
      this.$axios
        .get("/cu/incomeClaimBusiness/selectByParam", { params: lkParams })
        .then((res) => {
          if (res.data.flag === "success") {
            this.lkLoading = false;
            this.lkData = res.data.data.list;
            this.lkPages.total = res.data.data.total;
          } else {
            this.lkLoading = false;
            this.$message.error(res.data.msg);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },

    // pageSize变化
    onKpSizeChange(current, pageSize) {
      this.kpPages.pageNum = current;
      this.kpPages.pageSize = pageSize;
      this.queryKpInfo();
    },
    onLkSizeChange(current, pageSize) {
      this.lkPages.pageNum = current;
      this.lkPages.pageSize = pageSize;
      this.queryLkInfo();
    },
    // page变化
    onKpChange(pageNumber) {
      this.kpPages.pageNum = pageNumber;
      this.queryKpInfo();
    },
    onLkChange(pageNumber) {
      this.lkPages.pageNum = pageNumber;
      this.queryLkInfo();
    },
    formatAmount({ cellValue }) {
      return cellValue
        ? XEUtils.commafy(XEUtils.toNumber(cellValue), { digits: 2 })
        : "";
    },
    formatType({cellValue}){
      return cellValue ? (cellValue === '1' ? '借票开票' : '直接开票') : ''
    },
    formatIsHaveContract({cellValue}){
        return cellValue ? (cellValue === '1' ? '有' : '无') : ''
    },
    radioChangeEvent({ row }) {
      this.kpSelectRow = row;
    },
    checkBoxChangeEvent({ selection }) {
      this.lkSelectList = selection;
    },
    goudui() {
      let lk = [];
      for (let item of this.lkSelectList) {
        lk.push(item.claimBusinessGuid);
      }
      let kp = [];
      kp.push(this.kpSelectRow.ticketGuid);
      let params = { claimBusinessGuids: lk, ticketGuids: kp };
      this.$axios
        .post("/cu/incomeTicketClaim/group", params)
        .then((res) => {
          if (res.data.flag === "success") {
            this.$message.success("勾兑成功");
            this.search(this.searchParams);
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    cancelGoudui() {
      let lk = [];
      for (let item of this.lkSelectList) {
        lk.push(item.claimBusinessGuid);
      }
      let kp = [];
      kp.push(this.kpSelectRow.ticketGuid);
      let params = { claimBusinessGuids: lk, ticketGuids: kp };
      this.$axios
        .post("/cu/incomeTicketClaim/cancelGroup", params)
        .then((res) => {
          if (res.data.flag == "success") {
            this.$message.success("取消勾兑成功");
            this.search(this.searchParams);
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    getConditionsHeight(val) {
      val = val + 24 + "px";
      this.$refs.wrap.style.height = `calc(100% - ${val})`;
    },
  },
  created() {},
  mounted() {
    this.initPaymentInfo();
    this.getTreeList();
    this.search({ isGroups: "0,1,2" });
  },
};

</script>
<style scoped>
.wrap {
  height: calc(100% - 68px);
  /* border:1px solid red; */
}
.table-box {
  width: 100%;
  float: left;
  height: calc(50% - 38px);
}
.page-box {
  text-align: right;
  clear:both;
  padding:4px 0 ;
}
.first {
  height: 100%;
  /* border:1px solid green;  */
  width: calc(100% - 30px);
  position: relative;
  right: 0;
  float: left;
}
.left-title {
  position: relative;
  float: left;
  height: 100%;
  width: 30px;
  border: 1px solid #ccc;
  border-right: none;
  border-top-left-radius: 4px;
  border-bottom-left-radius:4px;
}
.title {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 24px;
  text-align: center;
}
.btn-box {
  padding: 8px;
  text-align: right;
}
</style>
