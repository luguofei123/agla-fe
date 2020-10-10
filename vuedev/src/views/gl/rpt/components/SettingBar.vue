<template>
  <div>
    <a-row type="flex" justify="space-around" align="middle" style="width: 100%;">
      <a-col :span="16" style="padding: 6px 0;">
        <span class="sub-tip" style="margin-left: 0px;">金额单位：元</span>
        <span class="sub-tip" style="margin-left: 20px;">格式：</span>
        <a-select
          style="width: 120px;height: 30px;color:#999"
          v-model="formType"
          @change="formTypeChange"
        >
          <a-select-option
            v-for="item in formTypeList"
            :key="item.key"
            :value="item.key"
          >{{ item.value }}</a-select-option>
        </a-select>
        <template v-if="formType === 'WAIBI' || formType === 'SHULWAIB'">
          <span class="sub-tip" style="margin-left: 20px;">币种：</span>
          <a-select
            style="width: 120px;height: 30px;color:#999"
            v-model="currencyType"
            @change="currencyTypeChange"
          >
            <a-select-option
              v-for="item in currencyTypeList"
              :key="item.key"
              :value="item.key"
            >{{ item.value }}</a-select-option>
          </a-select>
        </template>
        <!-- <div class="now-prj">当前查询方案：<span>{{ nowPrj ? nowPrj : '无' }} </span></div> -->
      </a-col>
      <a-col
        :span="8"
        style="display: flex;justify-content:flex-end;align-items: center;padding: 6px 0;"
      >
        <!-- 搜索/打印/导出 开始 -->
        <vxe-input
          v-model="filterName"
          @input="filterNameChange"
          type="search"
          placeholder="搜索"
          style="height: 32px;margin-right: 10px;"
          :class="getBtnPer('btn-search')"
        ></vxe-input>
        <a-radio-group style="display: flex;" ref="toolBtnGroup" :value="toolBtnGroupValue">
          <a-tooltip placement="bottom">
            <template slot="title">
              <span>打印</span>
            </template>
            <a-radio-button value="print" @click="print" :class="getBtnPer('btn-print')">
              <span class="glyphicon icon-print"></span>
            </a-radio-button>
          </a-tooltip>
          <a-popover trigger="click" v-model="exportPopVisible" placement="bottomRight">
            <template slot="content">
              <ul class="exportList" style="margin-bottom: 0;">
                <li style="line-height: 24px; cursor: pointer;" @click="exportCurrent">导出本页</li>
                <li style="line-height: 24px; cursor: pointer;" @click="exportAll">导出全部</li>
              </ul>
            </template>
            <a-tooltip placement="bottom">
              <template slot="title">
                <span>导出Excel文件</span>
              </template>
              <a-radio-button
                value="export"
                @click="toolBtnGroupValue = 'export'"
                :class="getBtnPer('btn-export')"
              >
                <span class="glyphicon icon-upload"></span>
              </a-radio-button>
            </a-tooltip>
          </a-popover>
        </a-radio-group>
        <!-- 搜索/打印/导出 结束 -->
        <a-popover trigger="click" v-model="popoverVisible" placement="bottomRight">
          <template slot="content">
            <a-checkbox-group
              style="display: flex;flex-direction: column; line-height: 2.2;"
              :options="popoverOptions"
              v-model="popoverValue"
              @change="onPopoverChange"
            />
            <a-button style="margin-top: 10px;" type="primary" @click="popoverConfirm">确定</a-button>
          </template>
          <a-button class="ml-10">
            <span class="glyphicon icon-list-all"></span>
            <span class="glyphicon icon-angle-bottom"></span>
          </a-button>
        </a-popover>
      </a-col>
    </a-row>
    <!-- 打印模态框 开始 -->
    <uf-modal
      title="选择打印模板"
      v-model="printModalVisible"
      @cancel="printModalCancel"
      :width="720"
      bodySyle="modalBody"
    >
      <div class="modal-main">
        <a-select style="width: 120px" v-model="printformType" @change="printformTypeChange">
          <a-select-option
            v-for="item in printoption"
            :key="item.rptFormatName"
            :value="item.rptFormatName"
          >{{ item.rptFormatName }}</a-select-option>
        </a-select>
        <a-select style="width: 120px" class="ml-10" v-model="printproname">
          <a-select-option
            v-for="item in printpro"
            :key="item.reportName"
            :value="item.reportName"
            @click="selectprintpro(item)"
          >{{ item.reportName }}</a-select-option>
        </a-select>
      </div>
      <template slot="footer">
        <a-button type="primary" class="mr-10" :loading="printModalLoading" @click="printsave">确定</a-button>
        <a-button @click="printModalCancel">取消</a-button>
      </template>
    </uf-modal>
    <!-- 打印模态框 结束 -->
  </div>
</template>
<script>
import moment from "moment";
import { mapState, mapActions } from "vuex";
import {
  postprintModal,
  postprintPqr,
  postprintPqrPdf,
  postBatchExport,
} from "../common/service/service";
import { getBtnPer } from "@/assets/js/util";
import store from "@/store/index";
let rptName = store.state.rpt.rptName;

export default {
  name: "SettingBar",
  data() {
    return {
      formType: "SANLAN", // 表格格式默认类型
      formTypeList: [
        // 表格格式
        {
          key: "SANLAN",
          value: "三栏式",
        },
        {
          key: "SHULIANG",
          value: "数量式",
        },
        {
          key: "WAIBI",
          value: "外币式",
        },
        {
          key: "SHULWAIB",
          value: "数量外币式",
        },
      ],
      currencyType: "*", //币种代码 默认全部
      currencyTypeList: [],
      filterName: "", //全表搜索框搜索内容
      exportPopVisible: false, // 导出下拉
      printpro: [],
      printoption: [], // 打印option
      printproname: "", // 打印表格名称
      printprovalueid: "", // 打印表格id
      printprotempid: "", // 打印模板id
      printformType: "SANLAN", // 打印表格格式类型
      printModalVisible: false, // 打印方案设置弹窗
      printModalLoading: false, // 打印方案设置弹窗loading
      popoverVisible: false, //隐藏列下拉列表的隐藏显示
      popoverOptions: [
        { label: "票据号", value: "billNo" },
        { label: "对方科目", value: "dAccoName" },
      ], //隐藏列下拉列表内容
      popoverValue: [], //显示的隐藏列
      moreColumns: [], //工具条上隐藏的两个列
      toolBtnGroupValue: "",
      exportData: [], //要导出的数据
    };
  },
  props: {
    pageName: {
      // 当前页面名称
      type: String,
      default: "",
    },
    pageId: {
      // 当前页面Id
      type: String,
      default: "",
    },
    tableData: {
      // 表格数据
      type: Array,
      default: "",
    },
  },
  created() {},
  computed: {
    ...mapState({
      pfData: (state) => state.pfData, // 全局的commonData 用户当前登陆公共信息
      agencyCode: (state) => state[rptName].agencyCode, // 单位代码
      agencyName: (state) => state[rptName].agencyName, // 单位名称
      acctCode: (state) => state[rptName].acctCode, // 账套代码
      acctName: (state) => state[rptName].acctName, // 账套名称
      nowPrj: (state) => state[rptName].nowPrj,
      prjContent: (state) => state[rptName].prjContent,
      qryItemData: (state) => state[rptName].qryItemData,
      qrySelectItemData: (state) => state[rptName].qrySelectItemData,
      rptStyle: (state) => state[rptName].prjContent.rptStyle, // 账表样式
      curCode: (state) => state[rptName].prjContent.curCode, // 币种
      startDate: (state) => state[rptName].prjContent.startDate,
      endDate: (state) => state[rptName].prjContent.endDate,
      startYear: (state) => state[rptName].prjContent.startYear,
      startFisperd: (state) => state[rptName].prjContent.startFisperd,
      endFisperd: (state) => state[rptName].prjContent.endFisperd,
      selectedAccoNames: (state) => state[rptName].selectedAccoNames,
    }),
  },
  watch: {
    agencyCode(val) {
      if (val) {
        this.getCurrType();
      }
    },
    rptStyle(val) {
      if (val) {
        this.formType = this.rptStyle;
      }
    },
    curCode(val) {
      if (val) {
        this.currencyType = this.curCode;
      }
    },
    /**
     * @description: 监听方案 主要用来回写表格格式和币种(废弃)
     */
    // prjContent(val){
    // console.log('prjContent：', val)
    // 表格格式和币种 不回写
    // this.formType = val.rptStyle
    // this.curCode = val.curCode === ''?'*' : val.curCode
    // }
  },
  methods: {
    getBtnPer,
    ...mapActions(["setRptStyle", "setCurCode", "getCompleteData"]),
    // 切换表格格式
    formTypeChange(val) {
      this.setRptStyle(val);
      if (val === "SANLAN" || val === "SHULIANG") {
        this.setCurCode("*");
      } else {
        if (!this.curCode) {
          this.setCurCode("*");
        }
      }
      this.$emit("formTypeChange", val);
    },
    getCurrType() {
      this.$axios
        .get("/gl/eleCurrRate/getCurrType", {
          params: {
            agencyCode: this.agencyCode,
            roleId: this.pfData.svRoleId,
          },
        })
        .then((result) => {
          // console.log(result)
          this.currencyTypeList = [{ key: "*", value: "全部" }];
          result.data.data.forEach((item) => {
            this.currencyTypeList.push({
              key: item.chrCode,
              value: item.chrName,
            });
          });
        });
    },
    // 币种切换
    currencyTypeChange(val) {
      this.setCurCode(val);
    },
    // 修改搜索框内容
    filterNameChange(val) {
      this.$emit("filterNameChange", val);
    },
    // 添加列-确定
    popoverConfirm() {
      this.popoverVisible = false;
      // 所有列添加上这两列
      let moreColumns = [];
      if (this.popoverValue && this.popoverValue.length > 0) {
        this.popoverValue.forEach((item) => {
          let title = "";
          if (item === "billNo") {
            title = "票据号";
          } else if (item === "dAccoName") {
            title = "对方科目";
          }
          let columnObj = {
            title,
            field: item,
            width: "10%",
            minWidth: "5%",
            headerAlign: "center",
            align: "left",
          };
          moreColumns.push(columnObj);
        });
      }
      this.moreColumns = moreColumns;
      this.$emit("addColumns", moreColumns, true);
    },
    // 添加列-勾选
    onPopoverChange(checkedValues) {
      this.popoverValue = checkedValues;
    },
    print() {
      this.toolBtnGroupValue = "print";
      this.printModalVisible = true;
      let opt = {
        agencyCode: this.agencyCode,
        acctCode: this.acctCode,
        componentId: this.pageId,
      };
      const that = this;
      postprintModal({}, opt).then((result) => {
        that.printoption = result.data.data;
        for (let i = 0; i < result.data.data.length; i++) {
          if (result.data.data[i].rptFormat == this.formType) {
            that.printformTypeChange(result.data.data[i].rptFormatName);
          }
        }
      });
    },
    printformTypeChange(e) {
      const that = this;
      that.printformType = e;
      let opt = {
        agencyCode: that.agencyCode,
        acctCode: that.acctCode,
        rgCode: that.pfData.svRgCode,
        setYear: that.pfData.svSetYear,
        sys: "100",
        directory: that.pageName + that.printformType,
      };
      postprintPqr({}, opt).then((result) => {
        that.printpro = result.data.data;
        that.printproname = result.data.data[0].reportName;
        that.printprovalueid = result.data.data[0].reportCode;
        that.printprotempid = result.data.data[0].templId;
      });
    },
    printModalCancel() {
      this.printModalVisible = false;
    },
    tf(str) {
      var newStr = str.toLowerCase();
      var endStr = "";
      if (newStr.indexOf("_") != "-1") {
        var arr = newStr.split("_");
        for (var i = 1; i < arr.length; i++) {
          arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].substring(1);
        }
        endStr = arr.join("");
      } else {
        endStr = newStr;
      }
      return endStr;
    },
    // 打印-确定
    printsave() {
      const tblData = this.tableData;
      let acconame = "";
      let ztitle = {};
      for (let i = 0; i < this.qryItemData.length; i++) {
        if (this.qryItemData[i].isShowItem === "1") {
          let code = this.tf(this.qryItemData[i].itemType) + "Name";
          let name = this.qryItemData[i].itemTypeName;
          ztitle[code] = name;
        } else {
          const selectedCode = this.qrySelectItemData[
            this.qryItemData[i].itemType
          ];
          this.qryItemData[i].items.forEach((item) => {
            if (item.code === selectedCode) {
              // acconame即选中的会计科目
              acconame = item.codeName;
            }
          });
        }
      }
      for (let i = 0; i < tblData.length; i++) {
        if (
          tblData[i].km == "*" ||
          tblData[i].km == "全部" ||
          tblData[i].km == ""
        ) {
          tblData[i].km = acconame;
        }
      }
      let j = 1;
      let ntitle = {};
      for (let z in ztitle) {
        ntitle["ext" + j + "Name"] = ztitle[z];
        for (let i = 0; i < tblData.length; i++) {
          tblData[i]["accItemExt" + j] = tblData[i][z];
        }
        j++;
      }
      this.printForPTPdf({
        valueid: this.printprovalueid,
        templId: this.printprotempid,
        print: "blank",
        data: { data: [tblData] },
        headData: [ztitle],
      });
    },
    printForPTPdf(settings) {
      let opts = settings;
      let datas = [
        {
          GL_RPT_PRINT: opts.data.data[0],
          GL_RPT_HEAD_EXT: opts.headData,
        },
      ];
      let opt = {
        reportCode: opts.valueid,
        templId: opts.templId,
        groupDef: JSON.stringify(datas),
      };
      postprintPqrPdf({}, opt).then((result) => {
        const content = decodeURIComponent(
          result.headers["content-disposition"]
        );
        window.open(
          content,
          "_blank",
          "titlebar=no,location=no,toolbar=no,menubar=no;top=100"
        );
      });
    },
    // 导出本页
    exportCurrent() {
      this.$showLoading();
      this.exportData = JSON.parse(JSON.stringify(this.tableData));
      this.exportEvent();
    },
    // 导出全部
    exportAll() {
      this.$showLoading();
      this.getCompleteData().then((result) => {
        this.exportData = result.data.data.tablePageInfo.list;
        this.exportEvent();
      });
    },
    exportEvent() {
      this.exportPopVisible = false;
      if (this.exportData.length == 0) {
        this.$hideLoading();
        this.$message.warning("没有数据需要导出");
        return;
      } else {
        //只有当包含会计科目时才显示
        this.exportData[0].accoInfo = "科目：" + this.selectedAccoNames;
        this.exportData[0].dw =
          "单位：" +
          this.agencyCode +
          " " +
          this.agencyName +
          " （账套：" +
          this.acctCode +
          " " +
          this.acctName +
          "）";
        this.exportData[0].dwzt = this.agencyName + " " + this.acctName;
        this.exportData[0].dwztControl = this.agencyName;
        this.exportData[0].dyr = this.pfData.svRoleName;
        this.exportData[0].dyrq = moment().format("YYYY-MM-DD");
        this.exportData[0].printReportConDate = `${this.startYear}年${this.startFisperd}月至${this.endFisperd}月`;
        this.exportData[0].prjName = "方案名称：" + this.nowPrj;
        this.exportData[0].qj =
          "期间：" + this.startDate + "至" + this.endDate + " （单位：元）";
        this.exportData[0].qjfw = `${this.startYear}年${this.startFisperd}月至${this.endFisperd}月`;
        this.exportData[0].rq = this.startYear;
      }
      let datas = [
        {
          GL_RPT_PRINT: this.exportData,
        },
      ];
      const params = {};
      const opt = {};
      opt.qryItems = this.qryItemData;
      opt.exportData = datas;
      opt.rptTypeName = "明细账";
      opt.rptType = "glRptJournal";
      postBatchExport(params, opt)
        .then((result) => {
          this.$hideLoading();
          if (result.data.flag == "success") {
            // 此域名正式部署需去掉
            window.location.href =
              "/pub/file/download?attachGuid=" +
              result.data.data.attachGuid +
              "&fileName=" +
              decodeURI(result.data.data.fileName);
          }
        })
        .catch(this.$showError);
    },
  },
};
</script>
<style>
.ant-calendar-panel {
  padding-top: 80px;
}
.ant-calendar-footer {
  padding: 0;
  line-height: 79px;
  border-top: 0;
  border-bottom: 1px solid #e8e8e8;
  position: absolute;
  height: auto;
  top: 0;
  left: 0;
  right: 0;
}
.ant-calendar-range .ant-calendar-input-wrap {
  display: none;
}
/*sunch 2020-06-28 修改range-picker头部样式*/
.ant-calendar-footer-extra {
  width: 100%;
}
.ant-calendar-picker-input {
  padding: 4px;
}
.ant-calendar-picker-icon {
  right: 6px;
}
.ant-checkbox + span {
  padding-right: 0px;
  padding-left: 5px;
}
</style>
<style lang="scss" scoped>
.now-prj {
  display: inline;
  padding: 0 10px;
  color: #999;
}
</style>
