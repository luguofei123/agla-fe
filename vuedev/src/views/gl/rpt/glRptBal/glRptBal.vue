<template>
  <div>
    <!-- 头部开始 -->
    <RptHeader :titleName="'余额表'">
      <template v-slot:prjTab>
        <PrjTab ref="prjTab"></PrjTab>
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
        <a-icon type="setting" />
      </div>
    </div>
    <!-- 打开抽屉的悬浮按钮 结束 -->

    <!-- 设置表格单位/格式 开始 -->
    <setting-bar
      :tableData="completeData"
      :pageId="rptType"
      :pageName="pageName"
      @formTypeChange="formTypeChange"
      @filterNameChange="filterNameChange"
      @addColumns="addColumns"
      @exportData="exportData"
    ></setting-bar>
    <!-- 设置表格单位/格式 结束 -->
    <!-- 表格部分开始 -->
    <div v-show="tableHeight > 60" class="table-wrap" :class="zoomButtonVisible ? 'tableZoom' : ''">
      <vxe-grid
        head-align="center"
        :height="tableHeight"
        :empty-render="{name: 'NoData'}"
        ref="xTable"
        :auto-resize="true"
        :loading="loading"
        class="mytable-scrollbar"
        :columns="tableColumns"
        :highlight-hover-row="true"
        id="glRptBalTable"
        :toolbar="{id:'glRptBalTable', resizable:{storage: true}}"
        :cell-class-name="cellClassName"
        @cell-click="cellClickEvent"
        @resizable-change="onTableResize"
      >
      </vxe-grid>

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
    <bal-drawer
      :drawerVisible="drawerVisible"
      @visibleChange="drawerVisibleChange"
      ref="projectFn"
      :rptType="rptType"
      @queryClick="queryHandle"
    ></bal-drawer>
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
import { formatMoney, revertNumMoney, setObjectCache, removeCache, openNewPage, getBtnPer, constructTableExport } from "@/assets/js/util"; //从工具库函数中获取工具函数：{ formatMoney: '金额格式化' }
import RptHeader from "../components/RptHeader"; // 头部
import PrjTab from "../components/PrjTab";
import RptQueryArea from "../components/RptQueryArea"; //账表查询区域
import SettingBar from './components/SettingBar'; // 设置表格单位/格式
import BalDrawer from "./components/BalDrawer"; // 设置方案
import {
  tableColumnsSANLAN,
  tableColumnsSHULIANG,
  tableColumnsWAIBI,
  tableColumnsSHULWAIB,
} from "./glRptBalColumns";
import {
  GetReportData,
  getRptAccas,
  postBatchExport,
  addQryCount,
} from "../common/service/service";
import { menuIdList } from '@/assets/js/const'

const accoColumns = {
  title: "会计科目",
  align: "center",
  children: [
    {
      title: "会计科目编码",
      field: "accoCode",
      headerAlign: "center",
      align: "left",
      minWidth: 120,
      cellRender: { name: 'searchHighLight' },
    },
    {
      title: "会计科目名称",
      field: "accoName",
      headerAlign: "center",
      align: "left",
      minWidth: 120,
      cellRender: { name: 'searchHighLight' },
    }
  ]
}

const accaCol = {
  title: "会计体系",
  field: "accaCodeStr",
  width: 100,
  headerAlign: "center",
  align: "left",
  cellRender: { name: 'searchHighLight' }
};

//可点击的金额列
const optionalAmtColumns = ['begDrAmt','begCrAmt','cDrAmt','cCrAmt','totalDrAmt','totalCrAmt',
'endDrAmt','endCrAmt','begCurBalAmt','begBalAmt','cCurDrAmt','cDrAmt','cCurCrAmt'
,'cCrAmt','totalCurDrAmt','totalDrAmt','totalCurCrAmt','totalCrAmt','endCurBalAmt','endBalAmt']
//可点击的数量列
const optionalCountColumns = ['begQtyBalAmt','cQtyDrAmt','cQtyCrAmt','totalQtyDrAmt','totalQtyCrAmt','endQtyBalAmt']

let rest = []

export default {
  name: "glRptBal",
  components: {
    RptHeader, // 自定义账表头部 含单位账套下拉树
    PrjTab, // 显示方案列表的按钮组件
    RptQueryArea, // 账表查询区域
    "setting-bar": SettingBar, // 设置表格单位/格式组件
    "bal-drawer": BalDrawer, // 设置方案
  },
  data() {
    return {
      pageName: '余额表',
      rptType: 'GL_RPT_BAL',
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
      completeData: [], // 表格全部数据
      tableData: [], // 表格数据
      tablePage: {
        tableName: "glRptBal",
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
      firstAcco: false //是否含有会计科目的标记
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
      console.log(e.keyCode)
      if(this.$refs.xTable && (e.keyCode === 17 || e.keyCode === 91)){
        this.setXTableFocus()
        this.holdCtrl = true
        return
      }
      if(this.$refs.xTable && e.keyCode === 27) {
        this.holdCtrl = false
        this.totalNum = 0
        this.clickCell = []
        this.$message.info('已清除选择的单元格合计金额')
      }
    });
    document.addEventListener("keyup", (e) => {
      if(e.keyCode === 17 || e.keyCode === 91){
        this.holdCtrl = false
      }
    });
  },
  watch: {
    tableH(height) {
      //表格高度改变
      this.tableHeight = height;
    },
    afterColumns(val) {
      this.addColumns(val);
    },
    /**
     * @description: 没有方案时点击查询会自动保存一个方案，监听成功保存方案后执行的代码，并且将状态重置为false
     */
    successAfterSave(val){
      if(val){
        this.queryHandle()
        this.setChoicePrjSuccessAfterSave(false)
      }
    },
    /**
     * @description: 表格显示数据 结合筛选 过滤后的表格数据
     */
    filterName(searchText){
      const filterName = XEUtils.toString(this.filterName).trim().toLowerCase();
      if (filterName) {
        //取所有列的列名
        rest = this.tableData.filter(item => {
          let flag = false
          //判断当前列是否可用于全表搜索
          for (let key in item) {
            let flag2 = XEUtils.toString(item[key]).toLowerCase().indexOf(filterName) > -1
            if ( flag2) {
              item.highlight = key
              item.filterText = filterName
              flag = true
            }
          }
          return flag
        })
      } else {
        this.tableData.forEach(item => {
          item.highlight = ''
        })
        rest = this.tableData
      }
      let xTable = this.$refs.xTable
      if(xTable){
        xTable.reloadData(rest).then(() => {
          this.$hideLoading()
        })
      }
    }
  },
  computed: {
    ...mapState({
      pfData: (state) => state.pfData, // 全局的commonData 用户当前登陆公共信息
      containerH: (state) => state.containerH, //容器高度
      tableH: (state) => state.glRptBal.tableH, //表格高度
      agencyCode: (state) => state.glRptBal.agencyCode, // 单位代码
      agencyName: (state) => state.glRptBal.agencyName, // 单位名称
      acctCode: (state) => state.glRptBal.acctCode, // 账套代码
      acctName: (state) => state.glRptBal.acctName, // 账套名称
      startDate: (state) => state.glRptBal.prjContent.startDate,
      endDate: (state) => state.glRptBal.prjContent.endDate,
      prjGuid: (state) => state.glRptBal.prjGuid, //方案guid
      nowPrj: (state) => state.glRptBal.nowPrj, //方案名称
      pageType: (state) => state.rpt.rptName, //页面类型
      successAfterSave: (state) => state.glRptBal.successAfterSave,
      qryItemData: (state) => { 
        return state.glRptBal.qryItemData.filter((item) => {
          return item.isShowItem === "1";
        })
      },
    }),
    ...mapGetters({
      reportArgument: "getReportArgument",
    })
  },
  methods: {
    ...mapActions([
      "setTableH",
      "setAgencyCode",
      "setAgencyName",
      "setAcctCode",
      "setAcctName",
      "getPrjList",
      "setChoicePrjSuccessAfterSave"
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
    setXTableFocus(){
      this.$(this.$refs.xTable).click()
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
          this.$message.error(error);
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
      let insertStart = 2
      if(this.formType === 'WAIBI' || this.formType === 'SHULWAIB'){
        insertStart = 3
      }
      if (nowal === true) {
        this.addColumnsList = val;
        //插入工具条显示的列
        columnsArr1.splice(insertStart, 0, ...val);
        columnsArr2.splice(insertStart, 0, ...val);
        columnsArr3.splice(insertStart, 0, ...val);
        columnsArr4.splice(insertStart, 0, ...val);
        //获取保存的表格内显示列插入
        let nowcolumnsarr = this.nowaftercol;
        columnsArr1.splice(0, 0, ...nowcolumnsarr);
        columnsArr2.splice(0, 0, ...nowcolumnsarr);
        columnsArr3.splice(0, 0, ...nowcolumnsarr);
        columnsArr4.splice(0, 0, ...nowcolumnsarr);
      } else {
        let arr1 = val.filter(item => {
          return item.accItem
        }),
        arr2 = val.filter(item => {
          return !item.accItem
        })
        columnsArr1.splice(insertStart, 0, ...arr2);
        columnsArr2.splice(insertStart, 0, ...arr2);
        columnsArr3.splice(insertStart, 0, ...arr2);
        columnsArr4.splice(insertStart, 0, ...arr2);
        columnsArr1.splice(0, 0, ...arr1);
        columnsArr2.splice(0, 0, ...arr1);
        columnsArr3.splice(0, 0, ...arr1);
        columnsArr4.splice(0, 0, ...arr1);
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
      if(!this.firstAcco){
        this.tableColumns.unshift(accaCol);
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
        obj = JSON.parse(tableWidthObj).glRptBalTable;
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
    queryHandle() {
      this.$showLoading()
      if (this.nowPrj === "") {
        this.$refs.projectFn.queryHandle();
      } else {
        this.getTableData();

        //查询后，掉一个方案计数接口，计数成功重新查询列表
        if (!this.prjGuid) {
          return;
        }
        addQryCount({ prjId: this.prjGuid })
        .then((result) => {
          this.getPrjList();
        })
        .catch((error) => {
          console.log(error);
        });
      }
    },
    getRptBalArgu(){
      const opt = this.reportArgument;
      // console.log("opt.params: ", opt);
      //加上年度 用户userId信息
      opt.setYear = this.pfData.svSetYear;
      opt.userId = this.pfData.svUserId;
      //余额表暂不做后端分页
      // opt.prjContent.currPage = this.currentPage;
      // opt.prjContent.rowNumber = this.pageSize;
      opt.prjContent.startDate = opt.prjContent.startDate.substr(0, 7)
      opt.prjContent.endDate = opt.prjContent.endDate.substr(0, 7)
      opt.accaCode = ''
      return opt
    },
    // 查询-获取表格数据
    getTableData() {
      this.$showLoading()
      let opt = this.getRptBalArgu()
      GetReportData(this.rptType, {}, opt) // params拼接到url后面的参数
        .then((result) => {
          if (result.data.flag == "fail") {
            throw result.data.msg;
          } else {
            // 根据this.qryItems对表头进行处理
            // 如果里面的isShowItem为"1" 所有栏式的表头要加上 列对应属性为该辅助项码转小写加上name
            this.afterColumns = [];
            this.nowaftercol = [];
            this.firstAcco = false
            if(opt.prjContent.qryItems[0].itemType === 'ACCO'){
              this.firstAcco = true
            }
            opt.prjContent.qryItems.forEach((item) => {
              if (item.isShowItem === "1") {
                if(item.itemType === 'ACCO'){
                  accoColumns.accItem = true
                  this.nowaftercol.push(accoColumns);
                }else{
                  let columnObj = {
                    title: "",
                    field: "",
                    width: "10%",
                    minWidth: "5%",
                    headerAlign: "center",
                    align: "left",
                    cellRender: { name: 'searchHighLight' }
                  };
                    let columnName = item.itemType.toLowerCase() + "Name";
                    columnObj.field = columnName;
                    columnObj.title = item.itemTypeName;
                    columnObj.accItem = true;
                    this.nowaftercol.push(columnObj);
                }
              }
            });
            this.afterColumns.push(...this.nowaftercol);
            this.afterColumns.push(...this.addColumnsList);
            result.data.data.tableData.forEach((item) => {
              if (!item.vouYear) {
                item.vouYear = item.rq;
              }
              if(!this.firstAcco){
                item.accaCodeStr = (item.accaCode === '1'?'财':'预' )
              }
            });
            this.completeData = result.data.data.tableData;
            this.tablePage.total = result.data.data.tableData.length;
            this.tableData = this.completeData.slice(this.pageSize*(this.currentPage-1), this.pageSize*this.currentPage);
            // this.tablePage.total = result.data.data.tablePageInfo.total;
            this.loading = false;
            this.$refs.xTable.reloadData(this.tableData).then(() => {
              this.setXTableFocus()
              this.$hideLoading()
            })
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
      this.tableData = this.completeData.slice(this.pageSize*(this.currentPage-1), this.pageSize*this.currentPage);
      this.$refs.xTable.reloadData(this.tableData).then(() => {
        this.setXTableFocus()
      })
    },
    // 单元格样式
    cellClassName({ row, column }) {
      let flag = this.qryItemData.some(item => {
        let columnField = ''
        if(item.itemType === 'ACCO'){
            columnField = item.itemType.toLowerCase() + "Code"
          }else{
            columnField = item.itemType.toLowerCase() + "Name"
        }
        return columnField === column.property 
      })
      //只有会计科目列的条件
      // column.property === "accoCode" && !!row.accoCode
      if(flag){
        return 'jump-link'
      }
      if (
        this.clickCell.findIndex(
          (it) => (row === it.clickRow) & (column === it.clickColumn)
        ) > -1
      ) {
        return 'col-active'
      }
    },
    // 点击单元格
    cellClickEvent({ row, column }, event) {
      if(this.holdCtrl){
        let doFn = () => {
          let len = this.clickCell.length
          if(len > 0){
            //判断已选中单元格所在的列与点击的列是不是一列
            if(this.clickCell[0].property != column.property) {
              this.totalNum = 0
              this.clickCell = []
            }
            let index = this.clickCell.findIndex(
              (it) => it.rowIndex === row._XID && it.columnIndex === column.id
            );
            if (index > -1) {
              // 如果已选取消选中效果
              this.clickCell.splice(index, 1);
              this.totalNum = XEUtils.subtract(this.totalNum, row[column.property])
            } else {
              let obj = {};
              obj.rowIndex = row._XID;
              obj.columnIndex = column.id;
              obj.clickRow = row;
              obj.clickColumn = column;
              obj.property = column.property;
              this.clickCell.push(obj);
              this.totalNum = XEUtils.add(this.totalNum, row[column.property])
            }
          } else {
            let obj = {};
            obj.rowIndex = row._XID;
            obj.columnIndex = column.id;
            obj.clickRow = row;
            obj.clickColumn = column;
            obj.property = column.property;
            this.clickCell.push(obj);
            this.totalNum = XEUtils.add(this.totalNum, row[column.property])
          }
        }
        if ( optionalAmtColumns.some(item => { return item === column.property }) ) {
          this.selectAmtType = true
          doFn()
        }else if( optionalCountColumns.some(item => { return item === column.property }) ){
          this.selectAmtType = false
          doFn()
        }
      }
      let flag = this.qryItemData.some(item => { 
        let columnField = ''
        if(item.itemType === 'ACCO'){
          columnField = item.itemType.toLowerCase() + "Code"
          }else{
          columnField = item.itemType.toLowerCase() + "Name"
        }
        return columnField === column.property 
      })
      // column.property === "accoCode" && !!row.accoCode
      if (flag) {
        // 凭证字号列跳转到凭证录入
        this.openVouShow(row, this.$(event.target));
      }
    },
    /**
     * @description: 跳转明细账
     */
    openVouShow(row, $el){
      let param = this.getRptBalArgu()
      let qryItems = []
      this.qryItemData.forEach(item => {
        let code = ''
        let columnField = item.itemType.toLowerCase() + "Code"
        if(item.itemType === 'ACCO'){
          code = row.accoCode
        }else{
          code = row[columnField]
        }
        if(code){
          qryItems.push({
            isShowItem: item.isShowItem,
            itemIndex: item.itemIndex,
            itemType: item.itemType,
            itemTypeName: item.itemTypeName,
            items: [{code: code, name: ""}]
          })
        }
      })
      param.prjContent.qryItems = qryItems
      localStorage.setItem("from_glRptBalParams", JSON.stringify(param));
      let baseUrl = '/pf/vue/gl/rpt/glRptJournal/glRptJournal?menuid=' + menuIdList.journalMenuId + '&dataFrom=glRptBal&action=query';
			openNewPage(false, $el, 'openMenu', baseUrl, false, "明细账");
    },
    // table列宽拖动改变
    onTableResize(obj) {},
    showDrawer() {
      this.drawerVisible = true;
    },
    drawerVisibleChange(val) {
      this.drawerVisible = val;
    },
    // 导出
    exportData() {
      this.$xTableExport({
        title: '余额表',
        data: this.tableData,
        topInfo:[
          ['单位：'+ this.agencyCode+' ' + this.agencyName + '（账套：'+ this.acctCode + ' ' + this.acctName + '）'],
          ['期间：'+ this.startDate + '至' + this.endDate + " （单位：元）"],
          ['方案名称：'+ this.nowPrj]
        ],
        columns: this.tableColumns
      })
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
