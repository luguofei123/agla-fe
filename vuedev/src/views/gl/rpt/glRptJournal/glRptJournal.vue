<template>
  <div>
    <!-- 头部开始 -->
    <RptHeader :titleName="pageName">
      <template v-slot:prjTab>
        <PrjTab ref="prjTab" :rptType="rptType"></PrjTab>
      </template>
    </RptHeader>
    <!-- 头部结束 -->

    <!-- 查询条件开始 -->
    <RptQueryArea>
      <template v-slot:btns>
        <a-button type="primary" @click="queryHandle" :class="getBtnPer('btn-query')">查询</a-button>
      </template>
    </RptQueryArea>
    <!-- 查询条件结束 -->

    <!-- 打开抽屉的悬浮按钮 开始 -->
    <div class="drawer-btn-wrap" v-if="!zoomButtonVisible">
      <div class="drawer-btn" @click="showDrawer">
        <a class="icon-setting"></a>
      </div>
    </div>
    <!-- 打开抽屉的悬浮按钮 结束 -->

    <!-- 设置表格单位/格式 开始 -->
    <setting-bar
      :tableData="tableData"
      :pageId="rptType"
      :pageName="pageName"
      @formTypeChange="formTypeChange"
      @filterNameChange="filterNameChange"
      @addColumns="addColumns"
    ></setting-bar>
    <!-- 设置表格单位/格式 结束 -->
    <!-- 表格部分开始 -->
    <div v-show="tableHeight > 60" class="table-wrap" :class="zoomButtonVisible ? 'tableZoom' : ''">
      <vxe-grid
        head-align="center"
        :height="tableHeight"
        :empty-render="{name: 'NoData'}"
        ref="xTable"
        :cell-class-name="cellClassName"
        :auto-resize="true"
        :loading="loading"
        class="mytable-scrollbar"
        :columns="tableColumns"
        :highlight-hover-row="true"
        :toolbar="{id:'glRptJournalTable', resizable:{storage: true}}"
        @cell-mouseenter="cellMouseenter"
        @cell-mouseleave="cellMouseleave"
        :row-style="rowStyle"
        :cell-style="cellStyle"
        @cell-click="cellClickEvent"
        @resizable-change="onTableResize"
        :sort-config="{iconAsc: 'iconfont iconfont-sort-t', iconDesc: 'iconfont iconfont-sort-b'}"
        :filter-config="{iconNone: 'iconfont iconfont-filter', iconMatch: 'iconfont iconfont-filter'}"
      ></vxe-grid>

      <!-- 自定义分页器开始 -->
      <ufPager :pager-config="tablePage" @page-change="handlePageChange">
        <template v-slot:footerBtns>
          <div class="zoomBtn">
            <!-- 铺满全屏按钮 -->
            <a-tooltip placement="bottom">
              <template slot="title">
                <span>{{ zoomTitle }}</span>
              </template>
              <a-button class="zoomTable" @click="zoomTableHandle">
                <a-icon :type="fullscreenIconType" />
              </a-button>
            </a-tooltip>
          </div>
          <div class="calculator">
            <div v-if="selectAmtType" class="calculatorRes">
              选中金额合计：
              <span
                class="total-num"
                ref="copy"
                :data-clipboard-text="totalNum"
                @click="copy"
              >{{ totalNum | filtersMoney }}</span>
            </div>
            <div v-else class="calculatorRes">
              选中数量合计：
              <span
                class="total-num"
                ref="copy"
                :data-clipboard-text="totalNum"
                @click="copy"
              >{{ totalNum }}</span>
            </div>
          </div>
        </template>
      </ufPager>
      <!-- 自定义分页器结束 -->
    </div>
    <!-- 表格部分结束 -->

    <!-- 抽屉业务代码片段 开始 -->
    <setting-project
      :drawerVisible="drawerVisible"
      @visibleChange="drawerVisibleChange"
      ref="projectFn"
      :rptType="rptType"
      @queryClick="queryHandle"
    ></setting-project>
    <!-- 抽屉业务代码片段 结束 -->
  </div>
</template>
<script>
import "@/render/filterRender";
import "@/render/cellRender";
import { mapState, mapGetters, mapActions } from "vuex";
import store from "@/store/index";
import XEUtils from "xe-utils";
import moment from "moment";
import {
  formatMoney,
  revertNumMoney,
  setObjectCache,
  removeCache,
  openNewPage,
  getBtnPer,
} from "@/assets/js/util"; //从工具库函数中获取工具函数：{ formatMoney: '金额格式化' }
import RptHeader from "../components/RptHeader"; // 头部
import PrjTab from "../components/PrjTab";
import RptQueryArea from "../components/RptQueryArea"; //账表查询区域
import SettingBar from "../components/SettingBar"; // 设置表格单位/格式
import SettingProjectModal from "../components/SettingProjectModal"; // 设置方案
import {
  tableColumnsSANLAN,
  tableColumnsSHULIANG,
  tableColumnsWAIBI,
  tableColumnsSHULWAIB,
} from "./glRptJournalColumns";
import {
  getReportDataPage,
  getRptAccas,
  postBatchExport,
  addQryCount,
} from "../common/service/service";
import { menuIdList } from "@/assets/js/const";

const searchProps = [
  "vouYear",
  "vouMonth",
  "vouDay",
  "vouNo",
  "descpt",
  "dStadAmt",
  "bStadAmt",
  "drCr",
  "cStadAmt",
];

//可点击的金额列
const optionalAmtColumns = [
  "dStadAmt",
  "cStadAmt",
  "bStadAmt",
  "dCurrAmt",
  "cCurrAmt",
  "bCurrAmt",
];
//可点击的数量列
const optionalCountColumns = ["dQty", "cQty", "bQty"];

let rest = [];

export default {
  name: "glRptJournal",
  components: {
    RptHeader, // 自定义账表头部 含单位账套下拉树
    PrjTab, // 显示方案列表的按钮组件
    RptQueryArea, // 账表查询区域
    "setting-bar": SettingBar, // 设置表格单位/格式组件
    "setting-project": SettingProjectModal, // 设置方案
  },
  data() {
    return {
      pageName: "明细账",
      pageType: "glRptJournal",
      rptType: "GL_RPT_JOURNAL",
      /* 1、公共信息模块 */
      menuId: "f34f56bd-a122-4f6d-a6b4-28b0068c524b",
      /* 2、查询区域模块 */
      fullscreenIconType: "fullscreen", // 框架内铺满显示 按钮icon
      zoomTitle: "框架内铺满显示", // 框架内铺满显示按钮提示
      zoomButtonVisible: false, // 框架内铺满显示按钮隐藏显示
      tableHeight: 100, // 表格高度
      selectAmtType: true, // 选中的列类型
      totalNum: 0, // 总金额
      clickCell: [], // 点击单元格
      /* 3、从其他页面跳转过来的处理模块 */
      isSession: false, // 是否其他账表页跳转来
      /* 4、从其他页面跳转过来的处理模块 */
      nowaftercol: [], //保存当前已显示的列 主要用于当工具条上的隐藏列显示时保持原有的列显示不变
      /* 5、查询方案模块 */
      filterName: "",
      formType: "SANLAN", // 表格格式默认类型
      addColumnsList: [], // 动态列
      /* 6、表格以及表格数据处理 模块 */
      loading: false, //表格数据loading
      afterColumns: [], // 要添加到表格里的列
      tableColumnsSANLAN,
      tableColumnsSHULIANG,
      tableColumnsWAIBI,
      tableColumnsSHULWAIB,
      tableColumns: tableColumnsSANLAN, // 默认的表格表头
      tableData: [], // 表格数据
      selectRow: null, // 鼠标移入的行
      selectColumn: null, // 鼠标移入的列
      tablePage: {
        tableName: "glRptJournal",
        total: 0,
        currentPage: 1,
        pageSize: 50,
        pageSizes: [10, 20, 50, 100, 200, 500, "全部"],
      }, //前端分页 分页器
      currentPage: 1,
      pageSize: 50,
      /* 7.抽屉 */
      drawerVisible: false, // 抽屉可视
      holdCtrl: false,
    };
  },
  filters: {
    filtersMoney: function (s) {
      var n = 2;
      if (!Number(s)) return "0.00";
      var firstChar = String(s).charAt(0);
      s = String(s).replace(/[^\d.]/g, "");

      n = n > 0 && n <= 20 ? n : 2;
      s = parseFloat((s + "").replace(/[^\d.-]/g, "")).toFixed(n) + "";
      var l = s.split(".")[0].split("").reverse(),
        r = s.split(".")[1];
      var t = "";
      for (var i = 0; i < l.length; i++) {
        t += l[i] + ((i + 1) % 3 == 0 && i + 1 != l.length ? "," : "");
      }
      s = t.split("").reverse().join("") + "." + r;
      if (firstChar == "-") {
        s = "-" + s;
      }
      return s;
    },
  },
  created() {
    this.setTableH(this.containerH - 206);
  },
  mounted() {
    let svTransDate = this.pfData.svTransDate;
    this.minOccurDate = moment(svTransDate).date(1).format("YYYY-MM"); // 期间日期-起始
    this.maxOccurDate = moment(svTransDate).endOf("month").format("YYYY-MM"); // // 期间日期-结束

    document.addEventListener("keydown", (e) => {
      if (!!this.$refs.xTable && (e.keyCode === 17 || e.keyCode === 91)) {
        this.setXTableFocus();
        console.log("按下了ctrl或cmd");
        this.holdCtrl = true;
        return;
      }
      if (this.$refs.xTable && e.keyCode === 27) {
        this.holdCtrl = false;
        this.totalNum = 0;
        this.clickCell = [];
        this.$message.info("已清除选择的单元格合计金额");
      }
    });
    document.addEventListener("keyup", (e) => {
      if (e.keyCode === 17 || e.keyCode === 91) {
        console.log("抬起了ctrl或cmd");
        this.holdCtrl = false;
      }
    });
    setTimeout(() => {
      this.fromOtherRpt();
    }, 1000);
  },
  watch: {
    rptStyle(val) {
      if (val) {
        this.formTypeChange(val);
      } else {
        this.setRptStyle("SANLAN"); // 如果方案中没有格式，置为默认“三栏式”
        this.formTypeChange("SANLAN");
      }
    },
    tableH(height) {
      //表格高度改变
      this.tableHeight = height;
    },
    afterColumns(val) {
      this.addColumns(val);
    },
    addColumnsList(val) {},
    /**
     * @description: 表格显示数据 结合筛选 过滤后的表格数据
     */
    filterName(searchText) {
      const filterName = XEUtils.toString(this.filterName).trim().toLowerCase();
      if (filterName) {
        //取所有列的列名
        rest = this.tableData.filter((item) => {
          let flag = false;
          //判断当前列是否可用于全表搜索
          for (let key in item) {
            let flag2 = searchProps.some((it) => {
                return it === key;
              }),
              flag3 =
                XEUtils.toString(item[key]).toLowerCase().indexOf(filterName) >
                -1;
            if (flag2 && flag3) {
              item.highlight = key;
              item.filterText = filterName;
              flag = true;
            }
          }
          return flag;
        });
      } else {
        this.tableData.forEach((item) => {
          item.highlight = "";
        });
        rest = this.tableData;
      }
      // console.log(rest)
      this.$refs.xTable.reloadData(rest).then(() => {
        this.$hideLoading();
      });
    },
  },
  computed: {
    ...mapState({
      pfData: (state) => state.pfData, // 全局的commonData 用户当前登陆公共信息
      containerH: (state) => state.containerH, //容器高度
      tableH: (state) => state.glRptJournal.tableH, //表格高度
      agencyCode: (state) => state.glRptJournal.agencyCode, // 单位代码
      agencyName: (state) => state.glRptJournal.agencyName, // 单位名称
      acctCode: (state) => state.glRptJournal.acctCode, // 账套代码
      acctName: (state) => state.glRptJournal.acctName, // 账套名称
      prjGuid: (state) => state.glRptJournal.prjGuid, //方案guid
      nowPrj: (state) => state.glRptJournal.nowPrj, //方案名称
      rptStyle: (state) => state.glRptJournal.prjContent.rptStyle, // 账表样式
      fromWhere: (state) => state.fromWhere, //从哪里跳转
    }),
    ...mapGetters({
      reportArgument: "getReportArgument",
    }),
  },
  methods: {
    ...mapActions([
      "setRptStyle",
      "setTableH",
      "setAgencyCode",
      "setAgencyName",
      "setAcctCode",
      "setAcctName",
      "getPrjList",
      "setQryItemData",
    ]),
    getBtnPer,
    // 切换单位
    agencyChangedListener(agencyInfo) {
      this.setAgencyCode(agencyInfo.code);
      this.setAgencyName(agencyInfo.name);
      this.isSession = false;
    },
    // 切换账套
    acctChangedListener(acctInfo) {
      this.setAcctCode(acctInfo.acctCode);
      this.setAcctName(acctInfo.acctName);
      this.accsCode = acctInfo.accsCode;
      this.accsName = acctInfo.accsName;
      this.getRptAccas(); // 获取科目体系
    },
    /**
     * @description: 使焦点定位在表格上
     */
    setXTableFocus() {
      this.$(this.$refs.xTable).click();
    },
    // 放大table区域
    zoomTableHandle() {
      this.zoomButtonVisible = !this.zoomButtonVisible;
      this.fullscreenIconType = this.zoomButtonVisible
        ? "fullscreen-exit"
        : "fullscreen";
      this.zoomTitle = this.zoomButtonVisible
        ? "收回到页面显示"
        : "框架内铺满显示";
      if (this.zoomButtonVisible) {
        this.tableHeight = document.documentElement.clientHeight - 78;
      } else {
        this.tableHeight = this.tableH;
      }
    },
    copy: function () {
      let clipboard = new this.Clipboard(this.$refs.copy);
      let that = this;
      clipboard.on("success", function () {
        that.$message.success("复制成功！");
      });
      clipboard.on("error", function () {
        that.$message.error("复制失败，请手动选择复制！");
      });
    },
    // 抽屉-辅助项check事件
    onAccTypeChange(e, item) {
      if (e.target.checked) {
        // 选择
        this.accItemTypeCheckList.push(item);
      } else {
        // 取消
        this.accItemTypeCheckList.splice(
          this.accItemTypeCheckList.findIndex(
            (it) => it.accItemCode === item.accItemCode
          ),
          1
        );
        this.isTabActive = this.accItemTypeCheckList[0].accItemCode;
      }
    },
    // 获取科目体系
    getRptAccas() {
      let param = {};
      getRptAccas(param)
        .then((result) => {
          if (result.data.flag == "fail") {
            throw result.data.msg;
          } else {
            this.rptAccas = result.data.data;
          }
        })
        .catch((error) => {
          this.$message.error("error: ", error);
        });
    },
    // 切换表格格式
    formTypeChange(val) {
      this.formType = val;
      //判断当前选择的是那种表格格式
      switch (this.formType) {
        case "SANLAN":
          this.tableColumns = this.tableColumnsSANLAN;
          break;
        case "SHULIANG":
          this.tableColumns = this.tableColumnsSHULIANG;
          break;
        case "WAIBI":
          this.tableColumns = this.tableColumnsWAIBI;
          break;
        case "SHULWAIB":
          this.tableColumns = this.tableColumnsSHULWAIB;
          break;
      }
    },
    /**
     * @description: 添加列方法
     * @param {Array} val 要添加的列对象数组
     * @param {Boolean} nowal 是否是表格工具条添加的列 处理逻辑不同
     */
    addColumns(val, nowal) {
      let columnsArr1 = JSON.parse(JSON.stringify(tableColumnsSANLAN));
      let columnsArr2 = JSON.parse(JSON.stringify(tableColumnsSHULIANG));
      let columnsArr3 = JSON.parse(JSON.stringify(tableColumnsWAIBI));
      let columnsArr4 = JSON.parse(JSON.stringify(tableColumnsSHULWAIB));
      if (nowal === true) {
        this.addColumnsList = val;
        //获取保存的表格内显示列先插入 然后再插入工具条显示的列
        let nowcolumnsarr = this.nowaftercol;
        columnsArr1.splice(3, 0, ...nowcolumnsarr);
        columnsArr2.splice(3, 0, ...nowcolumnsarr);
        columnsArr3.splice(3, 0, ...nowcolumnsarr);
        columnsArr4.splice(3, 0, ...nowcolumnsarr);
        columnsArr1.splice(3, 0, ...val);
        columnsArr2.splice(3, 0, ...val);
        columnsArr3.splice(3, 0, ...val);
        columnsArr4.splice(3, 0, ...val);
      } else {
        columnsArr1.splice(3, 0, ...val);
        columnsArr2.splice(3, 0, ...val);
        columnsArr3.splice(3, 0, ...val);
        columnsArr4.splice(3, 0, ...val);
      }
      this.tableColumnsSANLAN = columnsArr1; // 表格表头-三栏式
      this.tableColumnsSHULIANG = columnsArr2; // 表格表头-数量式
      this.tableColumnsWAIBI = columnsArr3; // 表格表头-外币
      this.tableColumnsSHULWAIB = columnsArr4; // 表格表头-数量外币

      //判断当前选择的是那种表格格式
      switch (this.formType) {
        case "SANLAN":
          this.tableColumns = this.tableColumnsSANLAN;
          break;
        case "SHULIANG":
          this.tableColumns = this.tableColumnsSHULIANG;
          break;
        case "WAIBI":
          this.tableColumns = this.tableColumnsWAIBI;
          break;
        case "SHULWAIB":
          this.tableColumns = this.tableColumnsSHULWAIB;
          break;
      }
      this.$refs.xTable.loadColumn(this.tableColumns);
      this.setResizeColumnsWidth();
      this.$nextTick(() => {
        this.$refs.xTable.refreshColumn();
      });
    },
    /**
     * @description: 记忆列宽补丁
     */
    setResizeColumnsWidth() {
      let tableWidthObj = localStorage.getItem("VXE_TABLE_CUSTOM_COLUMN_WIDTH"),
        obj = null;
      if (tableWidthObj) {
        obj = JSON.parse(tableWidthObj).glRptJournalTable;
        if (!obj) {
          return;
        }
      } else {
        return;
      }
      for (let field in obj) {
        this.tableColumns.forEach((item) => {
          if (item.field === field) {
            item.width = obj[field];
          }
        });
      }
    },
    // 修改搜索框内容
    filterNameChange(val) {
      this.filterName = val;
    },
    // 点击查询按钮事件
    queryHandle(callback) {
      this.$showLoading();
      let that = this;
      function queryAndAddCount() {
        that.getTableData(true);

        //查询后，掉一个方案计数接口，计数成功重新查询列表
        if (!that.prjGuid) {
          return;
        }
        //方案计数接口
        addQryCount({ prjId: that.prjGuid })
          .then((result) => {
            that.getPrjList();
            /* that.getPrjList().then(()=>{
              if(this.prjCode){
                //   glRptJournal页面没有prjCode
              }
            }); */
          })
          .catch((error) => {
            console.log(error);
          });
      }

      if (callback && typeof callback === "function") {
        //callback运行会返回promise对象
        callback()
          .then(() => {
            //如果保存方案成功 查询从方案回写的store值
            queryAndAddCount();
          })
          .catch((error) => {
            //如果保存方案失败直接回写store的值
            queryAndAddCount();
          });
      } else {
        if (this.nowPrj === "") {
          this.$refs.projectFn.queryHandle();
        } else {
          queryAndAddCount();
        }
      }
    },
    // 查询-获取表格数据
    getTableData(flag, opt) {
      // this.tableLoading = true;
      // this.loading = true;
      if (flag) {
        opt = this.reportArgument;
        //加上年度 用户userId信息
        opt.setYear = this.pfData.svSetYear;
        opt.userId = this.pfData.svUserId;
        //加上分页信息
        opt.prjContent.currPage = this.currentPage;
        opt.prjContent.rowNumber = this.pageSize;
      }
      getReportDataPage(this.rptType, {}, opt) // params拼接到url后面的参数
        .then((result) => {
          if (result.data.flag == "fail") {
            throw result.data.msg;
          } else {
            // 根据this.qryItems对表头进行处理
            // 如果里面的isShowItem为"1" 所有栏式的表头要加上 列对应属性为该辅助项码转小写加上name
            this.afterColumns = [];
            this.nowaftercol = [];
            opt.prjContent.qryItems.forEach((item) => {
              let columnObj = {
                title: "",
                field: "",
                width: "10%",
                minWidth: "5%",
                headerAlign: "center",
                align: "left",
                type: "html",
              };
              if (item.isShowItem === "1") {
                let columnName = item.itemType.toLowerCase() + "Name";
                columnObj.field = columnName;
                columnObj.title = item.itemTypeName;
                this.nowaftercol.push(columnObj);
              }
            });
            this.afterColumns.push(...this.addColumnsList);
            this.afterColumns.push(...this.nowaftercol);
            result.data.data.tablePageInfo.list.forEach((item) => {
              if (!item.vouYear) {
                item.vouYear = item.rq;
              }
            });
            this.tableData = result.data.data.tablePageInfo.list;
            this.tablePage.total = result.data.data.tablePageInfo.total;
            this.loading = false;
            this.$refs.xTable.reloadData(this.tableData).then(() => {
              this.setXTableFocus();
              this.$hideLoading();
            });
          }
        })
        .catch(this.$showError);
    },
    // 分页改变
    handlePageChange({ currentPage, pageSize }, flag) {
      // console.log(currentPage, pageSize)
      if (pageSize === "全部") {
        this.currentPage = 1;
        this.pageSize = 999999999;
      } else {
        this.currentPage = currentPage;
        this.pageSize = pageSize;
      }
      if (!flag) {
        //重新请求数据
        this.getTableData(true);
      }
    },
    /**
     * @description: 行样式
     */
    rowStyle({ row }) {
      if (row.rowType === 4 || row.rowType === 5 || row.rowType === 7) {
        return {
          backgroundColor: "#f0f0f0",
        };
      }
    },
    // 单元格样式
    cellStyle({ $rowIndex, row, column, columnIndex, $columnIndex }) {
      if (
        ($rowIndex === this.selectRow) & ($columnIndex === this.selectColumn) &&
        column.property === "vouNo" &&
        !!row.vouNo
      ) {
        return {
          color: "#108EE9",
          "text-decoration": "underline",
          cursor: "pointer",
        };
      }
    },
    // 鼠标移入单元格事件
    cellMouseenter({ row, $rowIndex, column, $columnIndex, $event }) {
      this.selectRow = $rowIndex;
      this.selectColumn = $columnIndex;
    },
    // 鼠标移出单元格事件
    cellMouseleave() {
      this.selectRow = null;
      this.selectColumn = null;
    },
    // 单元格样式
    cellClassName({ row, column }) {
      //去除单元格样式类jump-link
      /* if (column.property === "vouNo" && !!row.vouNo) {
        return "jump-link";
      } */
      if (
        this.clickCell.findIndex(
          (it) => (row === it.clickRow) & (column === it.clickColumn)
        ) > -1
      ) {
        return "col-active";
      }
    },
    // 点击单元格
    cellClickEvent({ row, column }, event) {
      if (this.holdCtrl) {
        let doFn = () => {
          let len = this.clickCell.length;
          if (len > 0) {
            //判断已选中单元格所在的列与点击的列是不是一列
            if (this.clickCell[0].property != column.property) {
              this.totalNum = 0;
              this.clickCell = [];
            }
            let index = this.clickCell.findIndex(
              (it) => it.rowIndex === row._XID && it.columnIndex === column.id
            );
            if (index > -1) {
              // 如果已选取消选中效果
              this.clickCell.splice(index, 1);
              this.totalNum = XEUtils.subtract(
                this.totalNum,
                row[column.property]
              );
            } else {
              let obj = {};
              obj.rowIndex = row._XID;
              obj.columnIndex = column.id;
              obj.clickRow = row;
              obj.clickColumn = column;
              obj.property = column.property;
              this.clickCell.push(obj);
              this.totalNum = XEUtils.add(this.totalNum, row[column.property]);
            }
          } else {
            let obj = {};
            obj.rowIndex = row._XID;
            obj.columnIndex = column.id;
            obj.clickRow = row;
            obj.clickColumn = column;
            obj.property = column.property;
            this.clickCell.push(obj);
            this.totalNum = XEUtils.add(this.totalNum, row[column.property]);
          }
        };
        if (
          optionalAmtColumns.some((item) => {
            return item === column.property;
          })
        ) {
          this.selectAmtType = true;
          doFn();
        } else if (
          optionalCountColumns.some((item) => {
            return item === column.property;
          })
        ) {
          this.selectAmtType = false;
          doFn();
        }
      }
      if (column.property === "vouNo" && !!row.vouNo) {
        // 凭证字号列跳转到凭证录入
        this.openVouShow(row.vouGuid, this.$(event.target));
      }
    },
    /**
     * @description: 跳转凭证录入
     */
    openVouShow(vouGuid, $el) {
      if (vouGuid) {
        removeCache("cacheData");
        //缓存数据
        let cacheData = {
          agencyCode: this.agencyCode,
          acctCode: this.acctCode,
          startVouDate: this.startDate,
          endVouDate: this.endDate,
        };
        setObjectCache("cacheData", cacheData);
        this.$axios.get("/gl/vou/getVou/" + vouGuid).then((result) => {
          if (!!result.data.data) {
            if (result.data.data[0].isBigVou != "1") {
              var baseUrl =
                "/pf/gl/vou/index.html?menuid=" +
                menuIdList.vouMenuId +
                "&dataFrom=" +
                this.pageType +
                "&action=query&vouGuid=" +
                vouGuid +
                "&vouAccaCode=*";
              openNewPage(false, $el, "openMenu", baseUrl, false, "凭证录入");
            } else {
              var baseUrl =
                "/pf/gl/voubig/voubig.html?menuid=" +
                menuIdList.voubigMenuId +
                "&dataFrom=" +
                this.pageType +
                "&action=query&vouGuid=" +
                vouGuid +
                "&vouAccaCode=*";
              openNewPage(false, $el, "openMenu", baseUrl, false, "凭证查看");
            }
          } else {
            this.$message.warning("该凭证已在其他页面删除，请刷新页面");
          }
        });
      }
    },
    // table列宽拖动改变
    onTableResize(obj) {},
    showDrawer() {
      this.drawerVisible = true;
    },
    drawerVisibleChange(val) {
      this.drawerVisible = val;
    },
    fromOtherRpt() {
      if (this.$route.query.dataFrom) {
        // let dataFrom = this.$route.query.dataFrom;
        // let opt = JSON.parse(localStorage.getItem(`from_${dataFrom}Params`));
        let opt = this.reportArgument;
        opt.rptType = this.rptType;
        opt.setYear = this.pfData.svSetYear;
        opt.userId = this.pfData.svUserId;
        this.getTableData(false, opt);
      }
    },
  },
};
</script>
<style lang="scss" scoped>
@import "@/assets/styles/variable.scss";
.mr8 {
  margin-right: 8px;
}
.zoomBtn {
  position: absolute;
  left: 10px;
  top: 3px;
}
.calculator {
  position: absolute;
  left: 70px;
  top: 10px;
  .calculatorRes {
    display: inline-block;
    .total-num {
      cursor: pointer;
    }
  }
}
.tableZoom {
  top: 6px;
  position: fixed;
  z-index: 999;
}
// 抽屉相关
.drawer-btn-wrap {
  position: fixed;
  top: 52px;
  right: 0px;
  z-index: 99;
}
.drawer-btn {
  display: inline;
  background: #fff;
  padding: 8px 12px;
  border-radius: 50% 0 0 50%;
  box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.15);
  color: #108ee9;
}
.drawer-footer {
  position: fixed;
  right: 0;
  bottom: 0;
  width: 400px;
  height: 50px;
  padding: 0 15px;
  border-top: 1px solid #d9d9d9;
  background: #fff;
  box-sizing: border-box;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
.drawer-content {
  padding: 22px 16px;
  .content-acctype-list {
    height: 70px;
    overflow: hidden;
    .acctype-item label {
      width: 120px;
      white-space: nowrap; /* 不换行 */
      overflow: hidden; /* 超出隐藏 */
      text-overflow: ellipsis; /* 超出部分显示省略号 */
    }
  }
  .content-acctype-list.all {
    height: auto;
  }
  .hover {
    color: #108ee9;
  }
  .content-tabs {
    margin-top: 10px;
    .tabs-wrap {
      position: relative;
      &::before {
        content: "";
        position: absolute;
        left: 0;
        right: 0;
        bottom: 5px;
        border-bottom: 1px solid #dfe6ec;
        z-index: -1;
      }
      .tab-item {
        display: inline-block;
        max-width: 138px;
        white-space: nowrap; /* 不换行 */
        overflow: hidden; /* 超出隐藏 */
        text-overflow: ellipsis; /* 超出部分显示省略号 */
        height: 30px;
        text-align: center;
        font-size: 12px;
        color: #666;
        line-height: 30px;
        padding: 0 20px;
      }
      .tab-item.active {
        border-radius: 4px 4px 0px 0px;
        border: 1px solid rgba(223, 230, 236, 1);
        border-bottom: 1px solid #fff;
        color: #108ee9;
      }
    }
    .tabs-main {
      .check-wrap {
        padding: 12px 0 11px;
      }
      .tree-wrap {
        width: 100%;
        height: 276px;
        border-radius: 4px;
        border: 1px solid rgba(223, 230, 236, 1);
        padding: 8px 16px;
        overflow: auto;
      }
    }
  }
  .content-else {
    li {
      margin-top: 8px;
    }
    .opt-list {
      margin: 0 6px 6px 0;
    }
    .amt-input {
      width: 80px;
      height: 30px;
    }
    .name-input {
      width: 280px;
      height: 30px;
    }
  }
}
</style>
