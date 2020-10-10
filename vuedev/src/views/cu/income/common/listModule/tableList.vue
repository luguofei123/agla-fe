<!--
通用table列表
2019/11/06
@author huanghe
-->
<template>
  <div class="tableListContainer">
    <!-- tab栏 -->
    <div class="tableTabs" v-if="showTabs">
      <a-tabs :defaultActiveKey="defaultTabKey" @change="changeTab">
        <a-tab-pane
          :tab="tabTitle"
          key="1"
          v-if="!tabConfig.length"
        ></a-tab-pane>
        <template v-else v-for="tab in tabConfig">
          <a-tab-pane :tab="tab.title" :key="tab.key"></a-tab-pane>
        </template>

        <div class="tableButtons" slot="tabBarExtraContent">
          <btn-group
            ref="buttonGroup"
            v-if="buttonsConfig.length >= 1"
            :need-show="needShow"
            :disabledBtn="disabledBtn"
            :is-primary="isPrimary"
            @clickBtn="clickBtn"
          ></btn-group>
        </div>
      </a-tabs>
    </div>
    <!-- 增行 删行 -->
    <btn-group
      v-else
      :need-show="showBtn"
      @clickBtn="clickBtn"
      class="btn-margin"
    ></btn-group>
    <!-- 条件搜索 -->
    <div id="search_area" class="tableSearch" v-if="searchConfig">
      <search-condition
        ref="searchForm"
        :searchList="searchConfig"
        @submit="search"
        @change="searchItemChange"
      >
      </search-condition>
    </div>
    <p v-if="tableTitle">{{ tableTitle }}</p>
    <div class="tableMain" id="tableWapper">
      <fast-table
        ref="fastTable"
        :id="uuid"
        :uuid="uuid"
        :columns="tableColumns"
        :tableData="tableData"
        :showCheckbox="showCheckbox"
        :isSort="true"
        :pagination="true"
        :table-height="tableHeight"
        :total="total"
        :page="pageNum"
        :page-size="pageSize"
        :editBtnList="editBtnList"
        @selectTable="selectRow"
        @handleCurrentChange="onChange"
        @handleSizeChange="onShowSizeChange"
      >
      </fast-table>
    </div>
  </div>
</template>

<script>
import btnGroup from "./btnGroup";
import searchCondition from "./searchCondition";
import fastTable from "../fastTable/fastTable";
import common from "@/views/cu/income/common/common";
/*
 * tableConfig: 表格配置 和（columns, data）互斥
 * columnsUrl: 获取表头的接口，如果不传或没值则用columns
 * columnsParams: 获取表头数据的参数
 * dataUrl: 获取表格数据的接口，如果不传或没值则用data
 * dataParams: 获取表格数据的参数,不包含分页参数
 * total：总页数
 * pageNum: 页码
 * pageSize：每页显示条数
 * editBtnList：操作列中的按钮
 * */
export default {
  name: "table-list",
  props: {
    uuid: { type: String },
    showCheckbox: { type: String, default: "1" },
    tabConfig: {
      type: Array,
      default() {
        return [];
      },
    },
    tabTitle: { type: String },
    defaultTabKey: { type: String },
    buttonsConfig: {
      type: Array,
      default() {
        return [];
      },
    }, // 按钮配置
    disabledBtn: { type: Array },
    searchConfig: {
      type: Array,
      default() {
        return [];
      },
    }, // 搜索配置
    tableConfig: {
      // 表格配置
      type: Object,
      default() {
        return {};
      },
    },
    columns: { type: Array }, // 表头
    data: { type: Array }, // 表格数据
    pagination: { type: Boolean, default: true }, // 是否显示页码
    selectionItems: { type: Array }, // 选中列
    showTabs: {
      type: Boolean,
      default: true,
    },
    editBtnList: {
      // 行内按钮
      type: Array,
      default() {
        return [];
      },
    },
    tableTitle: { type: String }, //表格头2020/8/11
  },
  model: {
    prop: ["selectionItems"],
    event: "change",
  },
  components: { btnGroup, searchCondition, fastTable },
  data() {
    return {
      // 显示的按钮组
      needShow: [],
      isPrimary: [],
      // 搜索参数
      searchParams: {},
      // table数据
      tableColumns: [],
      tableData: [],
      tableHeight: 0,
      // 分页参数
      pageSizeOptions: ["10", "30", "50", "100"], // 没有用
      total: 0,
      pageNum: 1,
      pageSize: 10,
      showBtn: ["addRow", "deleteRow"],
    };
  },
  methods: {
    // 初始化按钮组件配置
    initButtonsConfig() {
      this.needShow = [];
      this.isPrimary = [];

      if (this.buttonsConfig.length) {
        this.buttonsConfig.forEach((button) => {
          this.needShow.push(button);
          if (button.primary == "true") {
            this.isPrimary.push(button.name);
          }
        });
      }
    },
    // 点击按钮返回按钮的name
    clickBtn(event) {
      this.$emit("clickBtn", event);
    },
    // 切换tab标签
    changeTab(key) {
      this.$emit("changeTab", key);
      this.pageNum = 1;
      // this.search(this.searchParams);
    },
    // 点击搜索
    search(val) {
      this.searchParams = val;
      this.setCurrentRow();
      this.clearSelection();
      if (this.tableConfig.dataUrl) {
        this.getData();
      }
      this.$emit("search", val);
    },
    // 搜索模块月份发生变化
    searchItemChange(val, name) {
      this.$refs["searchForm"].getFormValues((res) => {
        this.searchParams = res;
      });
    },
    getTableWidth() {
      let sessionData = window.localStorage.getItem("tableConfig");
      sessionData = sessionData ? JSON.parse(sessionData) : {};
      let sessionTableKey = [];
      if (
        this.columns &&
        this.columns.length &&
        sessionData &&
        sessionData[this.uuid]
      ) {
        if (sessionData[this.uuid].show && sessionData[this.uuid].show.length) {
          sessionTableKey = sessionData[this.uuid].show;
        }
      }
      let x;
      if (this.columns) {
        x = this.columns.reduce((total, item) => {
          let width;
          if (sessionTableKey.indexOf(item.dataIndex) > -1) {
            width = 0;
          } else {
            width = parseInt(item.width);
          }
          total += width;
          return total;
        }, 0);
        if (this.columns.filter((item) => item.title == "序号").length > 0) {
          x = x + 38;
        } else {
          x = x + 88; // 100(checkbox + 序号)
        }
      }
      return x;
    },
    setCurrentRow(row) {
      this.$refs.fastTable.setCurrentRow(row);
    },
    // 勾选的行
    handleSelectionChange(val) {
      this.$emit("change", val);
    },
    // 清空勾选
    clearSelection() {
      this.$refs["fastTable"].clearSelection();
    },
    // 点击单元格
    clickCell(itemData) {
      this.$emit("clickCell", itemData);
    },
    // 编辑单元格
    handleChange(value, index, key) {
      this.$emit("dataChange", value, index, key);
    },
    // pageSize变化
    onShowSizeChange(current, pageSize) {
      this.pageNum = current;
      this.pageSize = pageSize;
      this.$emit("pageSizeChange", current, pageSize);
      if (this.tableConfig.dataUrl) {
        this.getData();
      }
    },
    // page变化
    onChange(pageNumber) {
      this.pageNum = pageNumber;
      this.$emit("pageChange", pageNumber);
      if (this.tableConfig.dataUrl) {
        this.getData();
      }
    },
    // 接口获取表头数据
    getColumns() {},
    // 接口获取表格数据
    getData() {
      let pageParams = {
        currentPage: this.pageNum,
        pageSize: this.pageSize,
      };
      let searchParams = this.searchParams ? this.searchParams : {};
      let tableConfigParams = this.tableConfig.dataParams
        ? this.tableConfig.dataParams
        : {};
      let params = Object.assign(tableConfigParams, pageParams, searchParams);
      this.$axios
        .get(this.tableConfig.dataUrl, { params: params })
        .then((res) => {
          if (res.data.flag == "success") {
            this.tableData = res.data.data.list;
            this.total = res.data.data.total;
            this.setFixTableHeight();
          } else {
            this.$message.warning(res.data.msg);
          }
        })
        .catch((error) => {
          this.$message.error(error);
        });
    },
    // 初始化表格数据
    initTable() {
      if (this.tableConfig) {
        if (this.tableConfig.total) {
          this.total = this.tableConfig.total;
        }
        if (this.tableConfig.pageNum) {
          this.pageNum = this.tableConfig.pageNum;
        }
        if (this.tableConfig.pageSize) {
          this.pageSize = this.tableConfig.pageSize;
        }
      }
      if (this.tableConfig.columnsUrl) {
        this.getColumns();
      } else {
        this.tableColumns = this.customRender();
      }
      if (this.tableConfig.dataUrl) {
        this.getData();
      } else {
        this.tableData = this.data;
      }
    },
    // 重置表格
    reset() {
      this.$refs["searchForm"].reset();
      this.pageNum = 1;
      this.initTable();
      this.clearSelection();
      this.$emit("change", []);
      this.setCurrentRow();
    },
    // 刷新表格
    fresh() {
      this.clearSelection();
      this.$emit("change", []);
      this.initTable();
      this.setCurrentRow();
    },
    customRender() {
      this.tableColumns = JSON.parse(JSON.stringify(this.columns));
      this.tableColumns.forEach((item) => {
        if (item.title != "序号") {
          item.key = item.dataIndex;
          if (item.key !== "operation") {
            if (item.click === "1") {
              // 单元格可点击状态
              item.customRender = ($scope) => {
                return (
                  <span>
                    <a
                      onClick={() => this.billClick($scope.row)}
                      title={$scope.row[item.dataIndex]}
                    >
                      {$scope.row[item.dataIndex]}
                    </a>
                  </span>
                );
              };
            } else if (item.type === "money") {
              item.customRender = ($scope) => {
                return (
                  <span>
                    <span
                      title={common.toThousandFix($scope.row[item.dataIndex])}
                    >
                      {common.toThousandFix($scope.row[item.dataIndex])}
                    </span>
                  </span>
                );
              };
            } else {
              item.customRender = ($scope) => {
                return (
                  <span>
                    <span title={$scope.row[item.dataIndex]}>
                      {$scope.row[item.dataIndex]}
                    </span>
                  </span>
                );
              };
            }
          } else {
            // 操作列渲染
            let buttonList = [];

            if (this.editBtnList && !item.butList) {
              buttonList = this.editBtnList;
            } else {
              buttonList = item.butList;
            }
            let showBtns = [];
            if (process.env.NODE_ENV != "development") {
              if (buttonList.length > 0) {
                buttonList.forEach((btn) => {
                  if (this.btnPermissionList.some((item) => item.code === `btn-${btn.key}`)) {
                    showBtns.push(btn);
                  }
                });
              }
            } else {
              showBtns = buttonList;
            }

            item.customRender = ($scope) => {
              return this.getCustomOperationRender(showBtns, $scope.row);
            };
          }
        }
      });
      let result = this.tableColumns.filter((item) => item.title == "序号");
      if (!result.length) {
        this.tableColumns.unshift({
          title: "序号",
          key: "custome",
          width: "50",
          fixed: "left",
        });
      }
      return this.tableColumns;
    },
    getCustomOperationRender(butList, data) {
      let buts = [];
      butList.forEach((item) => {
        if (item.visibleKey && data[item.visibleKey]) {
          if (item.visibleValue == data[item.visibleKey]) {
            buts.push(item);
          }
        } else {
          buts.push(item);
        }
      });
      let children = (
        <div class="editable-row-operations">
          <div class="editable-row-operations-div">
            {buts.map((item, index) => {
              if (buts.length <= 3) {
                // 小于等于三个按钮
                return (
                  <a-button
                    class={{ "table-opetation-btn-disabled": item.disabled }}
                    disabled={item.disabled}
                    style={{ marginRight: index === 2 ? "0px" : "5px" }}
                    title={item.name}
                    onClick={() => this.btnClick(item, data)}
                    size="small"
                  >
                    {item.name}
                  </a-button>
                );
              } else {
                // 大于三个按钮
                if (index <= 1) {
                  return (
                    <a-button
                      class={{ "table-opetation-btn-disabled": item.disabled }}
                      disabled={item.disabled}
                      style={{ marginRight: index === 2 ? "0px" : "5px" }}
                      title={item.name}
                      onClick={() => this.btnClick(item, data)}
                      size="small"
                    >
                      {item.name}
                    </a-button>
                  );
                } else if (index === 2) {
                  // 从第三个按钮开始
                  return (
                    <a-dropdown>
                      <a-menu
                        slot="overlay"
                        onClick={(e) => this.btnClick(buts[e.key], data)}
                      >
                        {buts.map((itemMore, indexMore) => {
                          if (indexMore >= 2) {
                            return (
                              <a-menu-item
                                class={{
                                  "table-opetation-btn-disabled":
                                    itemMore.disabled,
                                }}
                                disabled={itemMore.disabled}
                                key={indexMore}
                              >
                                {itemMore.name}
                              </a-menu-item>
                            );
                          }
                        })}
                      </a-menu>
                      <a-button
                        style="color:#0066ff;border:none;background:none;"
                        size="small"
                      >
                        {this.$t("lang.more")}
                      </a-button>
                    </a-dropdown>
                  );
                }
              }
            })}
          </div>
        </div>
      );
      return children;
    },
    selectRow(row) {
      this.handleSelectionChange(row);
      this.$emit("selectRow", row);
    },
    // 根据屏幕高度改变表格高度
    chengHeig() {
      const searchAreaHeight = document.getElementById("search_area")
        .clientHeight;
      let hei = document.body.clientHeight;
      let cha = hei - searchAreaHeight - 120;
      this.tableHeight = cha;
    },
    // 行内单元格点击
    billClick(row) {
      this.$emit("billClick", row);
    },
    // 点击操作列中的按钮
    btnClick(item, row) {
      this.$emit("rowBtnClick", item, row);
    },
    // 设置固定列高度
    setFixTableHeight() {
      this.$nextTick(() => {
        let height = this.$refs.fastTable.$el
          .querySelector(".el-table__body-wrapper")
          .querySelector(".el-table__body").offsetHeight;
        this.$refs.fastTable.$el
          .querySelector(".el-table__fixed-body-wrapper")
          .querySelector(".el-table__body").style.height = height + "px";
      });
    },
  },
  mounted() {
    this.tableHeight = 500;
    // this.chengHeig();
    // this.setTableColgroup();
    this.$nextTick(() => {
      this.initButtonsConfig();
      this.initTable();
      window.onresize = () => {
        // this.chengHeig();
      };
      this.setFixTableHeight();
    });
  },
  computed: {
    btnPermissionList() {
      return this.$store.state.btnPerList;
    },
  },
  watch: {
    buttonsConfig: {
      handler() {
        this.initButtonsConfig();
      },
      deep: true,
    },
    tableConfig: {
      handler(newVal) {
        this.tableConfig = newVal;
      },
      deep: true,
    },
    columns: {
      handler() {
        this.tableColumns = JSON.parse(JSON.stringify(this.columns));
        this.initTable();
      },
      deep: true,
    },
    data: {
      handler(newV) {
        this.tableData = newV;
        this.setFixTableHeight();
      },
    },
    btnPermissionList: {
      handler() {
        this.initTable();
      },
      deep: true,
    },
  },
};
</script>
<style lang="less">
.tableListContainer {
  .tableTabs {
    .tableButtons {
      display: flex;
    }
  }
  .btn-margin {
    margin: 20px 0 10px 0;
  }
  .ant-tabs-nav .ant-tabs-tab-active {
    color: #06f;
  }
  .ant-tabs-ink-bar {
    background-color: #06f;
  }
  .el-table__body-wrapper .el-table__body .cell {
    & > s {
      width: calc(100% - 30px);
      display: inline-block;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
  .fast-table .el-table .cell {
    & > div {
      width: 100%;
      height: 37px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
  .fast-table {
    .el-transfer-panel__item.el-checkbox {
      display: block;
    }
    /*table {*/
    /*    width: calc(100% - 1px) !important;*/
    /*}*/
    .el-table td,
    .el-table th.is-leaf {
      border-bottom: 0 !important;
    }
  }
  .fast-table .realtable .el-table__fixed-body-wrapper tr:last-child td div,
  .fast-table .realtable .el-table__fixed-right tr:last-child td div {
    height: 37px;
  }
  .fast-table {
    .ant-btn {
      color: #1890ff;
      border: 0;
      background-color: transparent;
    }
    .ant-btn:hover {
      color: #fff;
      background-color: #06f;
      border-color: #fff;
    }
    .editable-row-operations-div {
      text-align: center;
    }
    .pagination {
      height: 25px;
    }
  }
}
</style>
