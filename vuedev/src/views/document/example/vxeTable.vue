<template>
    <div class="main">
        <h2>表格示例(vxeTable)</h2>
        <h3>基础表格</h3>
        <h4>常用功能：设定表格行多选，斑马线、列宽以及前端分页</h4>
        <h4>数据来源：测试库-明细账（201912）会计科目：10020201部分字段</h4>
        <vxe-table
          border
          stripe
          ref="xTable"
          height="200"
          row-id="id"
          size="mini"
          align="center"
          :loading="loading"
          class="mytable-scrollbar"
          :seq-config="{startIndex: (tablePage.currentPage - 1) * tablePage.pageSize}"
          :checkbox-config="{reserve: true}"
          :data="tableData3">
          <vxe-table-column type="checkbox" width="60"></vxe-table-column>
          <vxe-table-column field="vouNo" title="凭证字号"></vxe-table-column>
          <vxe-table-column field="descpt" title="摘要"></vxe-table-column>
          <vxe-table-column field="dStadAmt" title="借方金额"></vxe-table-column>
          <vxe-table-column field="cStadAmt" title="贷方金额"></vxe-table-column>
          <vxe-table-column field="drCr" title="方向"></vxe-table-column>
          <vxe-table-column field="bStadAmt" title="余额"></vxe-table-column>
        </vxe-table>
        <vxe-pager
          perfect
          size="mini"
          :loading="loading"
          :current-page="tablePage.currentPage"
          :page-size="tablePage.pageSize"
          :total="tablePage.totalResult"
          :layouts="['PrevPage', 'JumpNumber', 'NextPage', 'FullJump', 'Sizes', 'Total']"
          @page-change="handlePageChange">
        </vxe-pager>
        <h3>可拖动列宽</h3>
        <h4>文档位置：基础功能 => 列宽拖动 <a target="blank" href="https://xuliangzhan.com/vxe-table/index.html#/table/base/resizable">https://xuliangzhan.com/vxe-table/index.html#/table/base/resizable</a></h4>
        <vxe-table
          border
          stripe
          resizable
          align="center"
          size="mini"
          :data="tableData2">
          <vxe-table-column field="vouNo" title="凭证字号"></vxe-table-column>
          <vxe-table-column field="descpt" title="摘要"></vxe-table-column>
          <vxe-table-column field="dStadAmt" title="借方金额"></vxe-table-column>
          <vxe-table-column field="cStadAmt" title="贷方金额"></vxe-table-column>
          <vxe-table-column field="drCr" title="方向"></vxe-table-column>
          <vxe-table-column field="bStadAmt" title="余额"></vxe-table-column>
        </vxe-table>
        <h3>记忆列宽</h3>
        <h4>文档位置：更多功能 => 显示/隐藏列和列宽 <a target="blank" href="https://xuliangzhan.com/vxe-table/index.html#/table/advanced/customlWidthStorage">https://xuliangzhan.com/vxe-table/index.html#/table/advanced/customlWidthStorage</a></h4>
        <vxe-toolbar id="toolbar" :resizable="{storage: true}" style="display: none;"></vxe-toolbar>
        <vxe-table
          border
          stripe
          resizable
          align="center"
          size="mini"
          :data="tableData2">
          <vxe-table-column field="vouNo" title="凭证字号"></vxe-table-column>
          <vxe-table-column field="descpt" title="摘要"></vxe-table-column>
          <vxe-table-column field="dStadAmt" title="借方金额"></vxe-table-column>
          <vxe-table-column field="cStadAmt" title="贷方金额"></vxe-table-column>
          <vxe-table-column field="drCr" title="方向"></vxe-table-column>
          <vxe-table-column field="bStadAmt" title="余额"></vxe-table-column>
        </vxe-table>
        <h3>表头分组</h3>
        <h4>文档位置：基础功能 => 表头分组 <a target="blank" href="https://xuliangzhan.com/vxe-table/index.html#/table/base/group">https://xuliangzhan.com/vxe-table/index.html#/table/base/group</a></h4>
        <vxe-table
          border
          stripe
          resizable
          align="center"
          size="mini"
          :data="tableData2">
          <vxe-table-column title="日期">
            <vxe-table-column field="vouYear" title="年"></vxe-table-column>
            <vxe-table-column field="vouMonth" title="月"></vxe-table-column>
            <vxe-table-column field="vouDay" title="日"></vxe-table-column>
          </vxe-table-column>
          <vxe-table-column field="vouNo" title="凭证字号"></vxe-table-column>
          <vxe-table-column field="descpt" title="摘要"></vxe-table-column>
          <vxe-table-column field="dStadAmt" title="借方金额"></vxe-table-column>
          <vxe-table-column field="cStadAmt" title="贷方金额"></vxe-table-column>
          <vxe-table-column field="drCr" title="方向"></vxe-table-column>
          <vxe-table-column field="bStadAmt" title="余额"></vxe-table-column>
        </vxe-table>
        <h3>固定列</h3>
        <h4>文档位置：基础功能 => 固定列 <a target="blank" href="https://xuliangzhan_admin.gitee.io/vxe-table/#/table/base/fixed">https://xuliangzhan_admin.gitee.io/vxe-table/#/table/base/fixed</a></h4>
        <vxe-table
          border
          stripe
          resizable
          class="mytable-scrollbar"
          align="center"
          size="mini"
          :data="tableData2">
          <vxe-table-column title="日期">
            <vxe-table-column field="vouYear" title="年" width="100"></vxe-table-column>
            <vxe-table-column field="vouMonth" title="月" width="100"></vxe-table-column>
            <vxe-table-column field="vouDay" title="日" width="100"></vxe-table-column>
          </vxe-table-column>
          <vxe-table-column field="vouNo" title="凭证字号" width="400"></vxe-table-column>
          <vxe-table-column field="descpt" title="摘要" width="300"></vxe-table-column>
          <vxe-table-column field="dStadAmt" title="借方金额" width="300"></vxe-table-column>
          <vxe-table-column field="cStadAmt" title="贷方金额" width="300"></vxe-table-column>
          <vxe-table-column field="drCr" title="方向" width="100"></vxe-table-column>
          <vxe-table-column field="bStadAmt" width="300" fixed="right" title="余额"></vxe-table-column>
        </vxe-table>
        <h3>可编辑表格</h3>
        <h4>文档位置：可编辑表格 => 点击触发 <a target="blank" href="https://xuliangzhan.com/vxe-table/index.html#/table/edit/click">https://xuliangzhan.com/vxe-table/index.html#/table/edit/click</a></h4>
        <vxe-grid
          border
          stripe
          resizable
          size="mini"
          keep-source
          ref="xGrid"
          :loading="loading"
          :columns="tableColumn"
          :data="tableData2"
          :edit-config="{trigger: 'click', mode: 'row', showStatus: true, icon: 'fa fa-file-text-o'}"></vxe-grid>
        <h3>表头悬浮(吸顶)效果</h3>
        <h4>文档位置：基础功能 => 固定表头 <a target="blank" href="https://xuliangzhan.com/vxe-table/index.html#/table/base/height">https://xuliangzhan.com/vxe-table/index.html#/table/base/height</a></h4>
        <vxe-table
          border
          stripe
          class="mytable-scrollbar"
          align="center"
          height="400"
          size="mini"
          :data="tableData">
          <vxe-table-column field="vouNo" title="凭证字号" width="300"></vxe-table-column>
          <vxe-table-column field="descpt" title="摘要" width="300"></vxe-table-column>
          <vxe-table-column field="dStadAmt" title="借方金额" width="300"></vxe-table-column>
          <vxe-table-column field="cStadAmt" title="贷方金额" width="300"></vxe-table-column>
          <vxe-table-column field="drCr" title="方向" width="400"></vxe-table-column>
          <vxe-table-column field="bStadAmt" title="余额" width="300" fixed="right"></vxe-table-column>
        </vxe-table>
    </div>
</template>
<script>
export default {
    data(){
        return {
            loading: false,
            tableData: [],
            tableData2: [],
            tableData3: [],
            tablePage: {
              currentPage: 1,
              pageSize: 10,
              totalResult: 0
            },
            tableColumn: [
              { type: 'checkbox', width: 50 },
              { field: 'vouNo', title: '凭证字号', editRender: { name: 'input' } },
              { field: 'descpt', title: '摘要', showOverflow: true, editRender: { name: 'input' } },
              { field: 'dStadAmt', title: '借方金额', editRender: { name: 'input' } },
              { field: 'cStadAmt', title: '贷方金额', editRender: { name: 'input' } },
              { field: 'drCr', title: '方向', editRender: { name: 'select', options: [{label:'平',value:'0'},{label:'借',value:'1'},{label:'贷',value:'2'}] }  },
              { field: 'bStadAmt', title: '余额', editRender: { name: 'input' } }
            ],
        }
    },
    created(){
        this.findList();
        this.findList2();
    },
    methods: {
            findList (){
                this.loading = true
                this.$axios.get('/mock/rptJournal2019.json').then(res=>{
                    this.tableData = res.data;
                    this.tablePage.totalResult = res.data.length;
                    this.tableData3 = res.data.slice(0,this.tablePage.pageSize);
                    this.loading = false
                })
            },
            findList2 (){
                this.$axios.get('/mock/rptJournal201912.json').then(res=>{
                    this.tableData2 = res.data;
                })
            },
            handlePageChange ({ currentPage, pageSize }) {
              console.log(currentPage, pageSize);
              this.tablePage.currentPage = currentPage;
              this.tablePage.pageSize = pageSize;
              this.tableData3 = this.tableData.slice(pageSize*currentPage - pageSize,pageSize*currentPage);
            }
          }
}
</script>
<style scoped>

a{
  color: #40a9ff;
  text-decoration: underline;
}
a:active{
  color: #40a9ff;
}
h2,h3,h4{
    padding: 5px 0;
    margin: 0;
    font-weight: bold;
    color: #333;
}
h3{
  padding: 0;
  margin-top: 15px;
  border-left: 4px solid #409eff;
  padding-left: 8px;
}
h4{
  padding-left: 10px;
  color: #666;
}
.main{
  padding: 0 15px;
}
/*滚动条整体部分*/
.mytable-scrollbar div::-webkit-scrollbar {
    width: 10px;
    height: 10px;
}

/*滚动条的轨道*/
.mytable-scrollbar div::-webkit-scrollbar-track {
    background-color: #FFFFFF;
}

/*滚动条里面的小方块，能向上向下移动*/
.mytable-scrollbar div::-webkit-scrollbar-thumb {
    background-color: #bfbfbf;
    border-radius: 5px;
    border: 1px solid #F1F1F1;
    box-shadow: inset 0 0 6px rgba(0, 0, 0, .3);
}

.mytable-scrollbar div::-webkit-scrollbar-thumb:hover {
    background-color: #A8A8A8;
}

.mytable-scrollbar div::-webkit-scrollbar-thumb:active {
    background-color: #787878;
}

/*边角，即两个滚动条的交汇处*/
.mytable-scrollbar div::-webkit-scrollbar-corner {
    background-color: #FFFFFF;
}
</style>