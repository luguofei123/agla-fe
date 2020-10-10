<template>
  <div class="assetrc">
    <!-- 头部开始 -->
    <RptHeader :titleName="title"></RptHeader>
    <!-- 头部结束 -->
    <!-- 查询条件开始 -->
    <RptQueryArea @changeQueryData="getQueryData">
      <template v-slot:btns>
        <a-icon type="setting" @click="showModal" style="color:blue;margin-right:80%;" />
        <a-button type="primary"  style="margin-right:10px;" @click="getTableData">对账</a-button>
        <a-button type="primary" @click="save">保存</a-button>
      </template>
    </RptQueryArea>
    <!-- 查询条件结束 -->
   <!-- 设置表格单位/格式 开始 -->
    <setting-bar
      :tableData="tableData"
      :pageId="'GL_RPT_ASSET_RC'"
      :pageName="title"
      @exportData="exportData"
      @printData = "printData"
    ></setting-bar>
    <!-- 设置表格单位/格式 结束 -->
    <!-- 表格部分开始 -->
    <div v-show="tableHeight > 60" class="table-wrap" :class="zoomButtonVisible ? 'tableZoom' : ''">
      <vxe-grid
        border
        stripe
        resizable
        :empty-render="{name: 'NoData'}"
        :loading="loading"
        head-align="center"
        :height="tableHeight"
        show-overflow="title"
        size="mini"
        ref="xTable"
        :auto-resize="true"
        class="mytable-scrollbar"
        :columns="tableColumns"
        :data = 'tableData'
        :highlight-hover-row="true"
        :toolbar="{id:'glRptAssetRcTable', resizable:{storage: true}}"
        :cell-style="cellStyle"
        @resizable-change="onTableResize"
      ></vxe-grid>
    </div>
    <!-- 表格部分结束 -->
    <!-- 条件选择弹框部分开始 -->
    <uf-modal title="条件选择" v-model="ModalVisible" @cancel="ModalCancel" :width="720" bodySyle="modalBody">
      <div class="modal-main">
        <el-table
          border
          stripe
          v-loading="ModalTableLoading"
          :header-cell-style="{background:'#eef1f6',color:'#606266', fontSize:'14px',textAlign:'center',height:'30px'}"
          max-height="400"
          size="mini"
          align="left"
          class="mytable-scrollbar"
          :data="tableDataModal"
          :row-class-name="tableRowClassName"
          @cell-mouse-enter="cellmouseenter"
          @cell-mouse-leave="cellmouseleave"
          @row-click="rowclick">
          <el-table-column  prop="name" label="总账">
           <template v-slot="{ row }">
              <span v-if="row.levelNum ===1 ">{{row.name}}</span>
              <span v-if="row.levelNum ===2 " style="margin-left:5px;">{{row.name}}</span>
              <span v-if="row.levelNum ===3 " style="margin-left:10px;">{{row.name}}</span>
              <span v-if="row.levelNum ===4 " style="margin-left:15px;">{{row.name}}</span>
              <span v-if="row.levelNum ===5 " style="margin-left:20px;">{{row.name}}</span>
              <span v-if="row.levelNum ===6 " style="margin-left:25px;">{{row.name}}</span>
              <span v-if="row.levelNum ===7 " style="margin-left:30px;">{{row.name}}</span>
              <span v-if="row.levelNum ===8 " style="margin-left:35px;">{{row.name}}</span>
              <span v-if="row.levelNum ===9 " style="margin-left:40px;">{{row.name}}</span>
              <span v-if="row.levelNum ===10 " style="margin-left:45px;">{{row.name}}</span>
              <span v-if="row.levelNum ===11" style="margin-left:50px;">{{row.name}}</span>
              <span v-if="row.levelNum ===12 " style="margin-left:55px;">{{row.name}}</span>
           </template>
          </el-table-column>
          <el-table-column prop="assetType" label="资产">
           <template v-slot="{ row }">
          <RptTreeSelect
            :treeData="treeDataModal"
            :clickAllNodeAble="true"
            :hasClearButton="true"
            :value="row.rightId"
            @change="change('',arguments[0],row.fullName)"
            @clear="clearValue(row.fullName)"
            :placeholder="row.setplaceholder"
            :key="row.index"
          ></RptTreeSelect>
          </template>
          </el-table-column>
        </el-table>
      </div>
      <template slot="footer">
        <a-button type="primary" class="mr-10"  @click="ModalSave">
          保存
        </a-button>
        <a-button @click="ModalCancel">关闭</a-button>
      </template>
    </uf-modal>
    <!-- 条件选择弹框部分结束 -->
  </div>
</template>
<script>
import "@/render/filterRender";
import "@/render/cellRender";
import RptHeader from "../components/RptHeader"; // 头部
import RptQueryArea from "../components/RptQueryAreaglRptAssetRc"; //账表查询区域
import SettingBar from "../components/SettingBarglRptAssetRc"; // 设置表头工具
import RptTreeSelect from "../components/RptTreeSelect";
import { mapState, mapActions, mapGetters } from "vuex";
import {
  formatMoney
} from "@/assets/js/util"; //从工具库函数中获取工具函数：{ formatMoney: '金额格式化' }
import {
  tableColumns
} from "./glRptAssetRcColumns";
import {
  multiHeader,
  header,
  merges,
  filterVal
} from "./vendor/Export2ExcelConfig"
import {
  treeDate
} from "./test.js";
import {
  getglRptAssetRcList,
  getglRptAssetRcModalList,
  getglRptAssetRcModalTree,
  getglRptAssetRcModalSave,
  getglRptAssetRcSave
} from "../common/service/service";
export default {
  name: "glRptAssetRc", // 与资产对账
  components: {
    RptHeader, // 自定义账表头部 含单位账套下拉树
    RptQueryArea, // 账表查询区域
    SettingBar,
    RptTreeSelect
  },
  data () {
    return {
      title: '与资产对账',
      // 数据
      zoomButtonVisible: false, // 框架内铺满显示按钮隐藏显示
      tableHeight: 500, // 表格高度
      loading: false,
      tableColumns: tableColumns, // 默认的表格表头
      tableData: [
        {  'assetName': '市场调查',
          "qcZcOriginal": 1.1,
            "qcGlOriginal": 0.12,
            "qcOriginalFlag": true,
            "qcZcDepreciation": 0.1,
            "qcGlDepreciation": 0.10,
            "qcDepreciationFlag": true,
            "bqzjZcOriginal": 3221.00,
            "bqzjGlOriginal": 0,
            "bqzjOriginalFlag": true,
            "bqzjZcDepreciation": 0,
            "bqzjGlDepreciation": 0,
            "bqzjDepreciationFlag": true,
            "bqjsZcOriginal": 0,
            "bqjsGlOriginal": 0,
            "bqjsOriginalFlag": true,
            "bqjsZcDepreciation": 0,
            "bqjsGlDepreciation": 0,
            "bqjsDepreciationFlag": true,
            "qmZcOriginal": 0,
            "qmGlOriginal": 0,
            "qmOriginalFlag": true,
            "qmZcDepreciation": 0,
            "qmGlDepreciation": 0,
            "qmDepreciationFlag": true},
        {  'assetName': '市场调查',
          "qcZcOriginal": 1.1,
            "qcGlOriginal": 0.12,
            "qcOriginalFlag": true,
            "qcZcDepreciation": 0.1,
            "qcGlDepreciation": 0.10,
            "qcDepreciationFlag": true,
            "bqzjZcOriginal": 0,
            "bqzjGlOriginal": 0,
            "bqzjOriginalFlag": true,
            "bqzjZcDepreciation": 0,
            "bqzjGlDepreciation": 0,
            "bqzjDepreciationFlag": true,
            "bqjsZcOriginal": 0,
            "bqjsGlOriginal": 0,
            "bqjsOriginalFlag": true,
            "bqjsZcDepreciation": 0,
            "bqjsGlDepreciation": 0,
            "bqjsDepreciationFlag": true,
            "qmZcOriginal": 0,
            "qmGlOriginal": 0,
            "qmOriginalFlag": true,
            "qmZcDepreciation": 0,
            "qmGlDepreciation": 0,
            "qmDepreciationFlag": true}
        ], // 对账表数据
      selectRow: null, // 鼠标移入的行
      selectColumn: null, // 鼠标移入的列
      // 条件弹出框
      ModalTableLoading: true,
      ModalVisible: false,
      tableDataModal: [], // 条件框的table数据
      treeDataModal: treeDate,
      QueryData: {
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1
      }
    }
  },
  computed: {
    ...mapState({
      pfData: (state) => state.pfData, // 全局的commonData 用户当前登陆公共信息
      containerH: (state) => state.containerH, //容器高度
      agencyCode: (state) => state.glRptAssetRc.agencyCode, // 单位代码
      acctCode: (state) => state.glRptAssetRc.acctCode, // 账套代码
      agencyName: (state) => state.glRptAssetRc.agencyName, // 单位名称
      acctName: (state) => state.glRptAssetRc.acctName, // 账套名称
    }),
    ...mapGetters({
      reportArgument: "getReportArgument",
    }),
  },
  methods: {
     tableRowClassName: function ({row,rowIndex}) {
       row.index = rowIndex
      },
    // 鼠标点击某一行时
    rowclick (row, column, cell, event) {
      // this.tableDataModal[row.index].setplaceholder = '请选择'
      // //console.log(row)
      // this.$set(this.tableDataModal,row.index,row)
    },
    cellmouseenter (row, column, cell, event) {
      this.tableDataModal[row.index].setplaceholder = '请选择'
      //console.log(row)
      this.$set(this.tableDataModal,row.index,row)
    },
    cellmouseleave (row, column, cell, event) {
      this.tableDataModal[row.index].setplaceholder = ''
      //console.log(row)
      this.$set(this.tableDataModal,row.index,row)
    },
    // 选择月份改变后,将改变的数据传递过来
    getQueryData (y, m) {
      this.QueryData.year = y;
      this.QueryData.month = m;
    },
    // 弹出条件框
    showModal () {
      this.ModalVisible = true;
      this.ModalTableLoading = true;
      this.getModalTree(); // 获取弹出框右侧资产树结构
      this.getModalList(); // 获取弹出框数据
    },
    // 获取弹出框右侧资产树结构
    getModalTree () {
      let param = {
        rgCode:this.pfData.svRgCode,  // 区划
        setYear: this.QueryData.year, // 年度
				agencyCode: this.agencyCode,  // 单位
        acctCode: this.acctCode,      // 套账
        fisPerd: this.QueryData.month // 月份
      };
     getglRptAssetRcModalTree(param)
        .then((result) => {
          if (result.data.flag == "fail") {
            // this.treeDataModal = []
            throw result.data.msg;
          } else {
            this.treeDataModal = result.data.data
          }
        })
        .catch((error) => {
          this.$message.error(error);
        });  
    },
    // 获取弹出框数据
    getModalList () {
      let param = {
        rgCode:this.pfData.svRgCode,  // 区划
        setYear: this.QueryData.year, // 年度
				agencyCode: this.agencyCode,  // 单位
        acctCode: this.acctCode,      // 套账
        fisPerd: this.QueryData.month // 月份
      };
     this.tableDataModal = [] // 先清空数据
     getglRptAssetRcModalList(param)
        .then((result) => {
          if (result.data.flag == "fail") {
            this.tableDataModal = []
            throw result.data.msg;
          } else {
            this.tableDataModal = result.data.data
            // this.tableDataModal = [
            //   { assetType: "",eleCode: "ACCO",fullName: "1601 ACCO",isLeaf: 0,levelNum: 1,name: "1601 固定资产" },
            //   { assetType: "1601121 我的银行存款",eleCode: "ACCO",fullName: "1602 ACCO",isLeaf: 0,levelNum: 1,name: "1602 非固定资产" }
            // ]
            this.tableDataModal.forEach((item, index) => {
              item.setplaceholder = ''
              if(item.assetType !== '') {
                item.rightId = item.assetType.split(' ')[0]
              }
            })
            this.ModalTableLoading = false
          }
        })
        .catch((error) => {
          this.$message.error(error);
        });
    },
    // 隐藏条件框
    ModalCancel () {
      this.ModalVisible = false
    },
    // 保存条件框
    ModalSave () {
// 原始数据的结构
// assetType: "1601121 我的银行存款"
// eleCode: "ACCO"
// fullName: "1601 ACCO"
// isLeaf: 0
// levelNum: 1
// name: "1601 固定资产"
// notDetailRow: true

// 发送请求的参数形式
// assetType: "1601121 我的银行存款"
// fullName: "1601 ACCO"
// name: "1601 固定资产"
      let param = {
        rgCode:this.pfData.svRgCode,  // 区划
        setYear: this.QueryData.year, // 年度
				agencyCode: this.agencyCode,  // 单位
        acctCode: this.acctCode,      // 套账
        // fisPerd: this.QueryData.month // 月份
      };
      let opt = this.tableDataModal
      .filter((item, index) => {
        return item.assetType !== ''
      })
      .map((item, index) => {
        if (item.eleCode === 'FATYPE') {
          return {
            assetType: item.assetType,
            // fullName: item.fullName + '&&' + item.name.split(' ')[0] + ' ' + item.eleCode,
            fullName: item.fullName,
            name: item.name
          }
        } else {
          return {
            assetType: item.assetType,
            fullName: item.fullName,
            name: item.name
          }
        }
      })
     getglRptAssetRcModalSave(param,opt)
        .then((result) => {
          if (result.data.flag == "fail") {
            throw result.data.msg;
          } else {
            this.$message.success(result.data.msg);
          }
        })
        .catch((error) => {
          this.$message.error(error);
        });  
    },
    // 条件框改变时,改变table数据
    change (type,obj,name) {
      console.log(obj)
      this.tableDataModal.forEach((item,index)=>{
        if(item.fullName === name ) {
          item.assetType = obj.title
        }
      })
    },
    // 条件框右侧清空时
    clearValue (name) {
      this.tableDataModal.forEach((item,index)=>{
        if(item.fullName === name ) {
          item.assetType = ''
        }
      })
    },
    // 查询 也叫对账
    getTableData () {
      this.loading = true;
      let param = {
        rgCode:this.pfData.svRgCode,  // 区划
        setYear: this.QueryData.year, // 年度
				agencyCode: this.agencyCode,  // 单位
        acctCode: this.acctCode,      // 套账
        fisPerd: this.QueryData.month // 月份
      };
  
     getglRptAssetRcList(param)
        .then((result) => {
          if (result.data.flag == "fail") {
            throw result.data.msg;
          } else {
            this.loading = false
            this.tableData = result.data.data
            console.log('chenggong')
          }
        })
        .catch((error) => {
          this.$message.error(error);
        });
    },
    // 外面的保存按钮，只有数据都一致的情况下才能保存
    save () {
      if(this.tableData.length === 0) {
        this.$message.error('数据为空，无法保存。');
        return;
      }
      console.log(this.checkUniformity())
      if (this.checkUniformity()) {
        // 调用保存接口
        this.AssetRcSave()
      } else {
        this.$message.error('数据不一致，无法保存。');
      }
    },
    AssetRcSave () {
      let param = {
        rgCode:this.pfData.svRgCode,  // 区划
        setYear: this.QueryData.year, // 年度
				agencyCode: this.agencyCode,  // 单位
        acctCode: this.acctCode,      // 套账
        fisPerd: this.QueryData.month // 月份
      };
      let opt = this.tableData;
    getglRptAssetRcSave(param,opt)
        .then((result) => {
          if (result.data.flag == "fail") {
            throw result.data.msg;
          } else {
            this.$message.success(result.data.msg);
          }
        })
        .catch((error) => {
          this.$message.error(error);
        });  
    },
    // 检查一致性 返回true 或 false
    checkUniformity () {
      return this.tableData.some((item, index) => {
        if (item.qcOriginalFlag === false 
        || item.qcDepreciationFlag === false 
        || item.bqzjOriginalFlag === false 
        || item.bqzjDepreciationFlag === false 
        || item.bqjsOriginalFlag === false
        || item.bqjsDepreciationFlag === false
        || item.qmOriginalFlag === false
        || item.qmDepreciationFlag === false) {
          return false
        } else {
          return true
        }
      })
    },
    // 单元格样式
    cellStyle({ $rowIndex, row, column, columnIndex, $columnIndex }) {
      if (
        ($rowIndex === this.selectRow) & ($columnIndex === this.selectColumn) &&
        column.property === "vouNo" &&
        column.title === "凭证字号" &&
        row.vouNo !== null
      ) {
        return {
          color: "#108EE9",
          "text-decoration": "underline",
          cursor: "pointer",
        };
      }
    },
    // 单元格样式
    cellClassName({ row, column }) {
      if (
        this.clickCell.findIndex(
          (it) => (row === it.clickRow) & (column === it.clickColumn)
        ) > -1
      ) {
        return "col-active";
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
    // 导出
    // exportData() {
    //   this.$refs.xTable.exportData({
    //     filename: "与资产对账导出",
    //     sheetName: "Sheet1",
    //     type: "xlsx",
    //   });
    // },
    printData () {
      this.$refs.xTable.print({
        sheetName: "与资产对账导出",
        mode: 'all',
        modes: ['all']
      });
    },
    // 以下是测试excel导出
    exportData() {
      if (this.tableData.length === 0) {
        this.$message.error('没有数据，无法导出');
        return;
      }
      // this.downloadLoading = true
      import('@/views/gl/rpt/glRptAssetRc/vendor/Export2Excel').then(excel => {
        multiHeader[0][0] = this.title
        multiHeader[1][0] = '单位：'+ this.agencyName
        multiHeader[2][0] = '账套：'+ this.acctName
        multiHeader[3][0] = '日期：'+ this.QueryData.year +'-'+this.QueryData.month
        const list = this.tableData
        const data = this.formatJson(filterVal, list)
        excel.export_json_to_excel({
           multiHeader,
           header,
           merges,
          data,
          filename: this.title,
          autoWidth: true,
          bookType: 'xlsx'
        })
        // this.downloadLoading = false
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        // if (j === 'bqzjZcOriginal')
        if (j === 'qcOriginalFlag'
        || j === 'qcDepreciationFlag'
        || j === 'bqzjOriginalFlag'
        || j === 'bqzjDepreciationFlag'
        || j === 'bqjsOriginalFlag'
        || j === 'bqjsDepreciationFlag'
        || j === 'qmOriginalFlag'
        || j === 'qmDepreciationFlag'
        || j === 'assetName'
        )
         {
          return v[j]
        } else {
          return formatMoney(String(v[j]).replace(/,/g, ''))
        }
      }))
    }
    // 以上是测试excel导出
  }
}
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
<style lang="scss">
.assetrc .modal-main .cell{
  overflow: visible!important;
}
.assetrc .modal-main .cell .rptTreeSelectWrap{
  border:none!important;
  background: none!important;
}
.assetrc .modal-main .cell .rptTreeSelectWrap input{
  border:none!important;
  background: none!important;
}
.assetrc .el-table--mini th, .assetrc .el-table--mini td{
  padding: 0px 0 0 0;
}
</style>
