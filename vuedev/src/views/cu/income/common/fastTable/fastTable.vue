<template>
  <!--表格-->
  <div class="fast-table" :id="uuid" :class="{'empty-table':!tableData || tableData.length === 0}">
    <el-table
      :show-summary="isShowSumRow"
      :summary-method="getSumRow"
      empty-text=" "
      ref='elTable'
      :data="FTableData"
      class="realtable"
      border
      row-key='cellIndex'
      :maxHeight="maxHeight?maxHeight:500"
      @selection-change="selectTable"
      @row-click="rowClick"
      @sort-change="sortTable"
      row-class-name
      @select-all='selectTableAll'
      :expand-row-keys="expandedRowKeys"
      @header-click="editTableHead"
      :span-method="objectSpanMethod"
      v-loading="loadingTable"
      :class="totalrowshow? '': 'no-sum-row'"
      style="width: 100%">

      <!--选择框--> <!--:reserve-selection='true'加上会影响勾选状态-->
      <el-table-column
        v-if="String(showCheckbox) ==='1'"
        type="selection"
        width="38">
      </el-table-column>
      <!--内容-->
      <template v-for="(head, index) in tableColumns">
        <!--序号列-->
        <el-table-column
          v-if="head.key==='custome' && showNum"
          type="index"
          :key="index"
          :label="head.title"
          :title="head.title"
          align="center"
          :fixed="head.fixed ? head.fixed : false"
          :width="head.width"
        >
        </el-table-column>
        <!--单表头-->
        <el-table-column
          class-name="canDrag"
          v-if="!head.children && head.key!=='custome'&&head.key!=='operation'&&!head.isHide"
          :key="head.dataIndex"
          :sortable="isRemoteSort?'custom':isSort"
          :prop="head.key"
          :sort-method="head.sorter"
          :align="head.align"
          :fixed="head.fixed ? head.fixed : false"
          :width="head.width"
        >
          <template slot="header" slot-scope="scope">
            <s :title="head.title">
              <i v-if="head.isRequired" style="color:red">*</i>
              {{head.title}}
              <a-icon type="edit" v-if="headEditStatus(head)" @click.stop="headEditBtn(head, $event)"/>
            </s>
          </template>
          <template slot-scope="scope">
            <table-slot
            v-if="head.key !== 'custome' && head.key !== 'operation'"
           :row="scope.row"
           :column="head"
           :index="scope.$index"
            ></table-slot>
          </template>
        </el-table-column>
        <!--多表头-->
        <table-head :isRemoteSort="isRemoteSort" :isSort="isSort" v-if="head.children && head.children.length" :coloumnHeader="head" @headEditBtn="headEditBtn"></table-head>
        <!--操作列-->
        <el-table-column
          v-if="head.key==='operation'"
          :key="index"
          :label="head.title"
          :fixed="head.fixed ? head.fixed : false"
          :width="head.width"
        >
          <template slot-scope="scope">
             <table-slot
                v-if="head.key === 'operation'"
                :row="scope.row"
              :column="head"
              :index="scope.$index"
            ></table-slot>
            <!-- <div class='editable-row-operations' v-if="!scope.row.istotalrow">
              <div style="height:100%; display: flex;justify-content: center;align-items: center;">
                <a-button  v-for='(item1,indexid) in editBtnList[scope.$index]' :key="indexid"  :disabled="item1.disabled" :style="{marginRight:indexid === 2?'0px':'5px'}" v-if='editBtnList[scope.$index].length<=3' :title="item1.name"  @click="() => editBtnClick(item1,scope.row)" size="small">{{item1.name}}</a-button>
                <a-button   v-for='(item2,indexid) in editBtnList[scope.$index]' :key="indexid"  :disabled="item2.disabled" :style="{marginRight:indexid === 2?'0px':'5px',border:none}" v-if='editBtnList[scope.$index].length>3&&indexid<=1' :title="item2.name"  @click="() => editBtnClick(item2,scope.row)" size="small">{{item2.name}}</a-button>
                <a-dropdown v-if ='editBtnList[scope.$index].length>3'>
                  <a-menu slot="overlay" @click="editBtnClick(editBtnList[scope.$index][$event.key],scope.row)">
                    <a-menu-item  v-for='(item3,indexMenuId) in editBtnList[scope.$index]' :disabled="item3.disabled" v-if='indexMenuId>=2' :key='indexMenuId'>{{item3.name}}</a-menu-item>
                  </a-menu>
                  <a-button   style='color:#0066ff;border:none;background:none;' size="small">更多</a-button>
                </a-dropdown>
              </div>
            </div> -->
          </template>
        </el-table-column>
      </template>
 </el-table>
    <!--分页-->
    <!--暂无数据-->
    <div class="empty-data" :style="{bottom:pagination?'65px':'25px'}" v-if="tableData.length === 0">
      暂无数据
    </div>
    <!-- <div class="empty-data" v-if="tableData.length === 0">
      暂无数据
    </div> -->
    <div class="pagination" v-if='pagination'>
      <div style="position:relative">
        <div style="float:right">
          <a-pagination :current='page' :itemRender="pageItemRender" :pageSize="pageSize" :pageSizeOptions="pageSizeOptions" @change='handleCurrentChange' @showSizeChange='handleSizeChange' size="small" :total="total" showSizeChanger showQuickJumper> </a-pagination>
        </div>
        <div style="float:right;margin-top:3px;color:rgba(0, 0, 0, 0.65)">
          {{paginationConfig.total}} {{total}} {{paginationConfig.item}}
        </div>
      </div>
    </div>
    <div class='clear'></div>
    <!--表头编辑-->
    <el-dialog
      title="表头设置"
      :visible.sync="showEditHeadModal">
      <div>
        <el-transfer
          v-model="selectedHeaders"
          filterable
          :titles="['已选择列', '可选择列']"
          @change="changeSHowColumn"
          :data="allSelectHeaders">
        </el-transfer>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editHeadModalCancel">取 消</el-button>
        <el-button type="primary" @click="editHeadModalOk">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import TableSlot from './slot'
import tableHead from './tableHead'
import Sortable from 'sortablejs'
export default {
  data () {
    return {
      pageSizeOptions: ['10', '30', '50'],
      currentRow: null,
      tableFlag: true, // 列表初始化开关
      rightBower: 10,
      FTableData: [],
      scrollLeft: 0,
      scrollTop: 0,
      scrollOldTop: 0,
      dataIndex: Math.ceil(window.innerHeight / 38) + 1,
      showEditHeadModal: false,
      selectedHeaders: [], // 已选择的表头
      allSelectHeaders: [], // 所有可选的表头
      tableColumnsData: [], // 用于展示的表头数据
      transferHeadData: [],
      copySessionData: [],
      dropColumns: [],
      flatColumns: {},
      selectAllFalg: false, // checkbox全选标志
      maxHeight: 0// 最大高度
    }
  },
  props: {
    columns: { // 表头数据
      type: Array,
      default: () => []
    },
    tableData: { // 表格内容
      type: Array,
      default: () => {}
    },
    fixed: { // 是否固定表头
      type: Boolean,
      default: true
    },
    loadingTable: { // 表格是否处于加载中状态
      type: Boolean,
      default: false
    },
    tableHeight: { // 表格高度
      type: Number,
      default: window.innerHeight - 280
    },
    editBtnList: { // 操作列按钮
      type: Array,
      default: () => []
    },
    showCheckbox: { // 是否展示checkbox
      default: false
    },
    pagination: {
      type: Boolean,
      default: false
    },
    total: { // 分页展示条数
      type: Number,
      default: 0
    },
    page: { // 当前页数
      type: Number,
      default: 1
    },
    pageSize: {
      type: Number,
      default: 10
    },
    isSort: { // 是否排序
      type: Boolean,
      default: false
    },
    totalrowshow: { // 合计行开关
      type: Boolean,
      default: false
    },
    rowsumlocation: {
      type: String,
      default: '0'
    },
    totaltabledata: {
      type: Array,
      default: () => []
    },
    expandedRowKeys: {// 转开行控制
      type: Array,
      default: () => []
    },
    saveColumnWidth: { // 是否需要存储用户拖拽列宽等数据，如需要，则必须传uuid
      type: Boolean,
      default: true
    },
    uuid: { // 代表表格所在视图id, 唯一值
      type: String,
      default: ''
    },
    tableRowSpanConfig: { // 行合并配置
      type: Array,
      default: () => []
    },
    isRemoteSort: { // 是否需要开启远端排序，如果开启将会关闭表格默认排序, 开启远端排序，则isSort字段必须传true
      type: Boolean,
      default: false
    },
    paginationConfig: {
      type: Object,
      default: () => {
        return {
          total: '共',
          item: '条'
        }
      }
    }
  },
  provide () {
    return {
      tableRoot: this
    }
  },
  mounted () {
    // 初始化表格数据
    this.columnDrop()
    this.maxHeight = this.tableHeight
    // window.addEventListener('scroll', this.sumtableScroll, true)
    this.$refs.elTable.bodyWrapper.addEventListener('scroll', this.scrollTable)
  },
  computed: {
    showNum () {
      return this.columns.some(col => col.key === 'custome')
    },
    tableColumns () {
      // 增加判断，当表格宽度与页面宽度差距过大时，强制给每列赋新值
      // if (!this.columns.length) return
      // const isManyTableHead = this.columns.some(item => item.children && item.children.length)
      // let width = 0
      // this.columns.forEach(item => {
      //   width += item.width
      // })
      // if (window.innerWidth - width > 100) {
      //   let itemWidth
      //   itemWidth = Math.floor(window.innerWidth / (this.columns.length))
      //   this.columns.forEach(item => {
      //     if (item.key !== 'custome' && item.key !== 'operation' && !isManyTableHead) {
      //       item.width = itemWidth
      //     }
      //   })
      // }
      let sessionData = window.localStorage.getItem('tableConfig')
      sessionData = sessionData ? JSON.parse(sessionData) : {}
      if (this.columns && this.columns.length && sessionData && sessionData[this.uuid]) {
        this.setColumnWidth(this.columns, sessionData[this.uuid])
        if (sessionData[this.uuid].show && sessionData[this.uuid].show.length) {
          this.hideColumn(this.columns, sessionData[this.uuid].show, true)
        }
        if (sessionData[this.uuid].sort && sessionData[this.uuid].sort.length) {
          this.setColumnsSort(this.columns, sessionData[this.uuid].sort)
        }
      }
      return this.columns
    },
    isManyTableHead () {
      return this.columns.some(item => item.children && item.children.length)
    },
    headEditStatus () {
      return function (head) {
        let res
        if (String(head.editStatus) === '2') {
          res = false
        } else {
          res = String(head.isHeadAssignment) === '1'
        }
        return res
      }
    },
    isShowSumRow () {
      let res = false
      if (this.tableFlag && this.rowsumlocation !== '0' && this.totalrowshow) {
        res = true
      }
      return res
    }
  },
  watch: {
    tableData: {
      handler (newName, oldName) {
        // 兼容为undefine的情况
        if (newName === undefined) {
          newName = []
          this.tableData = []
        }
        if (this.tableData && this.tableData.length < 20) {
          this.FTableData = this.tableData
          return
        }
        // if (this.tableData.length === this.FTableData.length) {
        //   return
        // }
        if (this.tableData.length - this.FTableData.length === 1) {
          // 说明是新增一条数据
          this.dataIndex = this.tableData.length - 1
        }
        if (this.$refs.elTable && this.$refs.elTable.bodyWrapper) {
          const tableBody = this.$refs.elTable.bodyWrapper
          if (tableBody.scrollTop + tableBody.clientHeight === tableBody.scrollHeight) {
            // 说明在滚动条在底部时，新增了数据
            this.FTableData = this.tableData
            this.dataIndex = this.FTableData.length - 1
            return
          }
        }
        const tempData = this.tableData.slice(0, this.dataIndex + 1)
        if (this.tableData.length - this.FTableData.length === 1) {
          this.FTableData.push(this.tableData[this.dataIndex])
        } else {
          this.FTableData = tempData
        }
      },
      immediate: true,
      deep: true
    },
    tableHeight (newHeight) {
      if (newHeight > 50) {
        // 分页
        let paginationHeight = 20
        if (this.pagination) {
          paginationHeight = 60
        }
        // 合计行
        // let totalHeight = 0
        // if (this.tableFlag && this.totalrowshow) {
        //   totalHeight = 40
        // }
        this.maxHeight = newHeight - paginationHeight
      }
    },
    columns: {
      handler (newName, oldName) {
        if (!this.columns.length) return
        this.allSelectHeaders = this.allEditTableHead()
        this.dropColumns = this.columns
      },
      immediate: true,
      deep: true
    }
  },
  // 事件
  methods: {
    editBtnClick (btn, row) {
      this.$emit('editBtnClick', btn, row)
    },
    /**
     * 复选框
     */
    selectTable (val) {
      // 选择行数据后，返回值为已选择的行数组
      this.$emit('selectTable', val)
    },
    /**
     * 复选框全选复选框
     */
    selectTableAll (val) {
      if (!this.selectAllFalg) {
        // 全选
        this.loopForData(true, this.tableData)
      } else {
        // 全不选
        this.loopForData(false, this.tableData)
      }
      this.selectAllFalg = !this.selectAllFalg
    },
    /**
     * 循环选中表格数据包括树形
     */
    loopForData (type, data) {
      data.forEach(element => {
        this.$refs.elTable.toggleRowSelection(element, type)
        if (element.children) {
          this.loopForData(type, element.children)
        }
      })
    },
    /**
     * 单选功能
     */
    selectRowChange (row) {
      this.$emit('selectRowTable', row)
    },
    setCurrentRow (row) {
      this.$refs.elTable.setCurrentRow(row)
    },
    handleCurrentChange (val) {
      // 修改当前页的回调
      this.$emit('handleCurrentChange', val)
    },
    handleSizeChange (current, pageSize) {
      // 修改当前页的回调
      this.$emit('handleSizeChange', current, pageSize)
    },
    // 清除去复选框选中状态
    clearSelection () {
      // 清空全选状态
      this.selectAllFalg = false
      this.$refs.elTable.clearSelection()
      this.$emit('selectTable', [])
    },
    rowClick (row, column, event) {
      const trs = document.getElementById(this.uuid).querySelectorAll('tr')
      for (let i = 0; i < trs.length; i++) {
        if (trs[i].className.indexOf('highLightRow') !== -1) {
          trs[i].className = trs[i].className.replace('highLightRow', '')
        }
        if (trs[i].className.indexOf('hover-row') !== -1) {
          trs[i].className += ' highLightRow'
        }
      }
      if (event.currentTarget.className.indexOf('highLightRow') === -1) {
        event.currentTarget.className += ' highLightRow'
      }
      let indexId = parseInt(row.indexId)
      this.$emit('rowClick', row, indexId - 1)
      event.stopPropagation()
    },
    selectRow (val) {
      this.currentRow = val
    },
    getnavtype () {
      var ua = navigator.userAgent.toLowerCase()
      if ((/msie/i.test(ua) || ua.indexOf('edge') > -1 || window.ActiveXObject || 'ActiveXObject' in window || ua.match(/rv:([\d.]+)\) like gecko/)) && !/opera/.test(ua)) {
        return 'IE'
      } else if (/firefox/i.test(ua)) {
        return 'Firefox'
      } else if (/chrome/i.test(ua) && /webkit/i.test(ua) && /mozilla/i.test(ua)) {
        return 'Chrome'
      } else if (/opera/i.test(ua)) {
        return 'Opera'
      } else if (/webkit/i.test(ua) && !(/chrome/i.test(ua) && /webkit/i.test(ua) && /mozilla/i.test(ua))) {
        return 'Safari'
      } else {
        return 'unKnow'
      }
    },
    // 递归找columns 修改宽度
    setColumnsWidth (data, columnField, width) {
      for (let index = 0; index < data.length; index++) {
        const element = data[index]
        if (element.key === columnField) {
          element.width = width
        } else {
          if (element.hasOwnProperty('children')) {
            this.setColumnsWidth(element.children, columnField, width)
          }
        }
      }
    },
    // 递归取 columns 宽度
    // getColumnsWidth (data) {
    //   for (let index = 0; index < data.length; index++) {
    //     const element = data[index]
    //     if (element.hasOwnProperty('width')) {
    //       this.totalColumnsWidth += element.width
    //     } else {
    //       if (element.hasOwnProperty('children')) {
    //         this.getColumnsWidth(element.children)
    //       }
    //     }
    //   }
    //   return this.totalColumnsWidth
    // },
    scrollTable (e) {
      if (this.tableData.length < 20) {
        return
      }
      const ele = e.srcElement || e.target
      const { scrollTop, scrollLeft } = ele
      this.scrollLeft = scrollLeft
      this.scrollTop = scrollTop
      if (scrollTop - this.scrollOldTop >= 15) {
        this.scrollOldTop = scrollTop
        this.setTableData()
      }
    },
    setTableData () {
      const index = this.dataIndex + 1
      if (index > this.tableData.length - 1) return
      this.FTableData.push(this.tableData[index])
      this.dataIndex = index
    },
    setColumnWidthToSession (width, column) {
      const tempObj = {
        [column.property]: width
      }
      let sessionData = window.localStorage.getItem('tableConfig')
      sessionData = sessionData ? JSON.parse(sessionData) : {}
      const temp = Object.assign({}, sessionData[this.uuid], tempObj)
      sessionData[this.uuid] = temp
      localStorage.setItem('tableConfig', JSON.stringify(sessionData))
    },
    setColumnWidth (columns, obj) {
      columns.forEach(item => {
        if (item) {
          let temp
          temp = item.dataIndex
          item.width = obj[temp] ? obj[temp] : item.width
          if (item.children && item.children.length) {
            this.setColumnWidth(item.children, obj)
          }
        }
      })
    },
    hideColumn (columns, data, init) {
      columns.forEach((item, index) => {
        let temp = item
        if (data.indexOf(item.dataIndex) !== -1) {
          temp = item
          temp.isHide = true
          if (this.selectedHeaders.indexOf(item.dataIndex) === -1) this.selectedHeaders.push(item.dataIndex)
        } else {
          temp = item
          temp.isHide = false
        }
        this.$set(columns, index, temp)
        if (item.children && item.children.length) {
          this.hideColumn(item.children, data, init)
        }
      })
    },
    editTableHead (column, event) {
      if (column.label && (column.label === '序号' || column.label === 'order')) {
        this.showEditHeadModal = true
      }
    },
    allEditTableHead () {
      const result = []
      this.formatTableHead(this.columns, result)
      return result
    },
    formatTableHead (columns, result) {
      columns.forEach(item => {
        if (item.key !== 'custome' && item.key !== 'operation' && !item.children) {
          item.label = item.title
          result.push(item)
          this.flatColumns[item.key] = item
        }
        if (item.children && item.children.length) {
          this.formatTableHead(item.children, result)
        }
      })
    },
    editHeadModalOk () {
      let sessionData = window.localStorage.getItem('tableConfig')
      if (!sessionData) {
        sessionData = {}
        sessionData[this.uuid] = {}
      } else {
        sessionData = JSON.parse(sessionData)
      }
      sessionData[this.uuid] = sessionData[this.uuid] ? sessionData[this.uuid] : {}
      sessionData[this.uuid]['show'] = this.selectedHeaders
      localStorage.setItem('tableConfig', JSON.stringify(sessionData))
      this.hideColumn(this.columns, this.selectedHeaders, false)
      this.showEditHeadModal = false
    },
    editHeadModalCancel () {
      this.selectedHeaders = []
      this.allSelectHeaders.forEach((item) => {
        this.selectedHeaders.push(item.fieldCode)
      })
      this.showEditHeadModal = false
    },
    changeSHowColumn (current, p, keys) {
      if (p === 'left') {
        // keys.forEach(item => {
        //   this.selectedHeaders.splice(this.selectedHeaders.indexOf(item), 1)
        // })
        // let sessionData = window.localStorage.getItem('tableConfig')
        // if (!sessionData) {
        //   sessionData = {}
        //   sessionData[this.uuid] = {}
        // } else {
        //   sessionData = JSON.parse(sessionData)
        // }
        // this.copySessionData = sessionData[this.uuid]['show']
        // sessionData[this.uuid]['show'] = this.selectedHeaders
        // localStorage.setItem('tableConfig', JSON.stringify(sessionData))

        let sessionData = window.localStorage.getItem('tableConfig')
        if (!sessionData) {
          sessionData = {}
          sessionData[this.uuid] = {}
        } else {
          sessionData = JSON.parse(sessionData)
        }
        this.copySessionData = sessionData[this.uuid]['show']
        keys.forEach(item => {
          this.copySessionData.splice(this.copySessionData.indexOf(item), 1)
        })
        sessionData[this.uuid]['show'] = this.copySessionData
        localStorage.setItem('tableConfig', JSON.stringify(sessionData))
      }
    },
    // 列拖拽
    columnDrop () {
      setTimeout(() => {
        if (!this.isManyTableHead) {
          const wrapperTr = document.querySelectorAll('.el-table__header-wrapper')
          for (let i = 0; i < wrapperTr.length; i++) {
            this.setDragMethod(wrapperTr[i].querySelector('tr'))
          }
        }
      }, 3000)
      // wrapperTr.forEach(item => {
      //   this.setDragMethod(item.querySelector('tr'))
      // })
    },
    setDragMethod (dom) {
      this.sortable = Sortable.create(dom, {
        handle: '.canDrag',
        animation: 180,
        delay: 0,
        onEnd: evt => {
          let oldIndex = evt.oldIndex
          let newIndex = evt.newIndex
          if (String(this.showCheckbox) === '1') {
            oldIndex = oldIndex - 1
            newIndex = newIndex - 1
          }
          if (oldIndex < 0 || newIndex < 0) return
          if (this.columns[oldIndex].key === 'custome' || this.columns[newIndex].key === 'custome') return
          const oldItem = this.columns[oldIndex]
          this.columns.splice(oldIndex, 1)
          this.columns.splice(newIndex, 0, oldItem)
          this.columns[newIndex].dataIndex += 1
          const tempArr = []
          this.columns.forEach(item => {
            if (item.key) tempArr.push(item.key)
          })
          this.setLocation(tempArr)
        }
      })
    },
    setLocation (data) {
      let sessionData = window.localStorage.getItem('tableConfig')
      if (!sessionData) {
        sessionData = {}
        sessionData[this.uuid] = {}
      } else {
        sessionData = JSON.parse(sessionData)
      }
      const tempSession = sessionData[this.uuid] ? sessionData[this.uuid] : {}
      tempSession.sort = data
      sessionData = Object.assign({}, sessionData, {[this.uuid]: tempSession})
      localStorage.setItem('tableConfig', JSON.stringify(sessionData))
      this.$emit('dragColumn', true)
    },
    setColumnsSort (columns, data) {
      columns.forEach((item, index) => {
        const _i = data.indexOf(item.key)
        if (_i > 0 && _i !== index) {
          const tempItem = columns[_i]
          this.$set(columns, _i, item)
          this.$set(columns, index, tempItem)
        }
      })
    },
    objectSpanMethod ({ row, column, rowIndex, columnIndex }) {
      let result = {
        rowspan: 1,
        colspan: 1
      }
      let cellKey = column.property
      if (cellKey) {
        if (this.tableRowSpanConfig && this.tableRowSpanConfig[rowIndex] && this.tableRowSpanConfig[rowIndex].hasOwnProperty(cellKey)) {
          result.rowspan = this.tableRowSpanConfig[rowIndex][cellKey]
        }
      }
      return result
    },
    sortTable ({column, prop, order}) {
      const params = {
        uuid: this.uuid,
        fieldCode: prop,
        sortType: order === 'descending' ? 2 : 1
      }
      if (!order) params.sortType = 0
      if (this.isRemoteSort) this.$emit('sortTable', params)
    },
    headEditBtn (head, event) {
      this.$emit('editDataByHead', head, event)
    },
    pageItemRender (current, type, originalElement) {
      if (type === 'page' && this.paginationConfig.type === 'US') {
        originalElement.context.locale.items_per_page = 'item/page'
      }
      return originalElement
    },
    getSumRow (param) {
      const { columns } = param
      const sums = []
      columns.forEach((column, index) => {
        if (column.type === 'index') {
          sums[index] = '合计'    // 这里就是显示你要写的啥名字,是合计还是汇总什么
          return
        }
        const columnConfig = this.allSelectHeaders.find(item => item.key === column.property)
        if (columnConfig) {
          if (columnConfig.isSum === '1') {
            // 说明列需要合计
            // sums[index] = _.sumBy(data, (item) => {
            //   let temp = item[column.property]
            //   temp = temp === '' ? 0 : Number(temp)
            //   return temp
            // })
            sums[index] = this.totaltabledata[0][column.property]
          } else {
            sums[index] = ''
          }
        }
      })
      return sums
    }
  },
  components: {
    TableSlot,
    tableHead
  }
}
</script>
<style lang="less">
  // 样式重置
  .fast-table {
    height: 100%;
    position: relative;
    overflow: hidden;
    font-family: Chinese Quote,-apple-system,BlinkMacSystemFont,Segoe UI,PingFang SC,Hiragino Sans GB,Microsoft YaHei,Helvetica Neue,Helvetica,Arial,sans-serif;
    table {
      width: 100% !important;
    }
    .el-table--scrollable-x .el-table__fixed-body-wrapper {
      padding-bottom: 10px;
    }
    // .el-table--scrollable-x .el-table__body-wrapper {
    //   z-index: 1;
    // }
    a {
      color: #0066ff;
    }
    table.el-table__body tbody tr.el-table__row.highLightRow {
      background-color: #06f !important;
      td {
        background: none;
        span {
          color: #fff !important;
          border-color: #fff !important;
        }
        input {
          color: #fff !important;
        }
        div {
          color: #fff !important;
        }
        i {
          color: #fff !important;
        }
        a {
          color: #fff !important;
        }
        s {
          color: #fff !important;
        }
      }
    }
    .el-table tr td:first-child, .el-table tr th:first-child {
      border-left: 1px solid #CCCCCC;
    }
    // .el-table tr {
    //   th {
    //     border-top: 1px solid #CCCCCC;
    //   }
    // }
    .current-row>td {
      background: #0066ff !important;
      div {
        color: #fff !important;
      }
      .span {
        color: #fff !important;
      }
      a {
        color: #fff !important;
      }
    }
    .el-table {
      .el-table__header-wrapper,.el-table__fixed-header-wrapper{
        .cell{
          height: 37px;
          line-height: 37px;
          .caret-wrapper{
            height: 100%;
            margin-top: 5px;
          }
        }
      }
      .el-table__fixed-body-wrapper .el-table__body .cell{
        min-height: 36px;
        line-height: 37px;
        visibility: visible;
        &>div {
          height: 100%;
          &>div {
            height: 100%;
            &>div {
              height: 100%;
            }
          }
        }
        &>s {
          width: calc(100% - 30px);
          display: inline-block;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        &>span.caret-wrapper {
          float: right;
          height: 100%;
          align-items: center;
          display: flex;
          justify-content: center;
        }
      }
      .el-table__body-wrapper .el-table__body .cell{
        line-height: 37px;
        min-height: 37px;
        &>.el-table__expand-icon {
          min-height: auto;
        }
        &>div {
          min-height: 36px;
          height: 100%;
          &>div {
            min-height: 36px;
            height: 100%;
            &>div {
              min-height: 36px;
              height: 100%;
            }
          }
        }
        &>s {
          width: calc(100% - 30px);
          display: inline-block;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        &>span.caret-wrapper {
          float: right;
          height: 100%;
          align-items: center;
          display: flex;
          justify-content: center;
        }
      }
    }

    .el-table th {
        height: 34px;
        padding: 0;
        font-size: 14px;
        border-top: 1px solid #CCCCCC;
        font-weight: 400;
        background-color: #eaeaea !important;
        border-right: 1px solid #CCCCCC;
        color: #333;
    }

    .el-table th.is-leaf {
        border-bottom: 1px solid #CCCCCC;
    }

    .el-table th:first-child,
    .el-table td:first-child {
        border-left: 1px solid #CCCCCC;
    }

    .el-table .cell {
        padding-left: 8px;
        padding-right: 8px;
    }

    .el-table th > .cell {
        line-height: 34px;
        padding-left: 8px;
        background-color: #eaeaea !important;
    }

    .el-table td {
        padding: 0;
        height: 36px;
        border-right: 1px solid #CCCCCC!important;
        border-bottom: 1px solid #CCCCCC!important;
    }

    .el-table__body tr:nth-child(even) > td {
        background-color: #F1F6FF;
    }
    .el-table th {
      box-sizing: border-box;
      text-align: center;
      div {
        font-size: 14px;
        color: rgba(0,0,0,.85);
      }
    }
    thead th:hover {
      background: #f2f2f2 !important;
      .cell {
        background: #f2f2f2 !important;
      }
    }
    .el-table td {
      box-sizing: border-box;
      div {
        font-size: 14px;
        color: rgba(0,0,0,.65);
      }
    }
    .el-checkbox__inner {
      position: relative;
      top: 0;
      left: 0;
      display: block;
      width: 16px;
      height: 16px;
      border: 1px solid #d9d9d9;
      border-radius: 2px;
      background-color: #fff;
      transition: all .3s;
      border-collapse: separate;
    }
    .el-checkbox__inner::after {
      transform: rotate(45deg) scale(1);
      position: absolute;
      display: table;
      border: 2px solid #fff;
      border-top: 0;
      border-left: 0;
      content: " ";
      transition: all .2s cubic-bezier(.12,.4,.29,1.46) .1s;
      opacity: 1;
    }
    .is-checked .el-checkbox__inner, .is-indeterminate .el-checkbox__inner{
      background-color: #1890ff;
      border-color: #1890ff;
    }
    .ant-input:focus {
      border: 0;
      box-shadow: none;
    }
    .ant-input-number:focus {
      box-shadow: none;
    }
    .realtable{
      tr.hover-row>td {
        background: #d8efff;
      }
    }
    .no-sum-row {
      & .el-table__body {
        padding-bottom: 0px;
      }
    }
    .realtable .el-table__row:hover td {
      background: #d8efff;
    }
    .ant-select-focused .ant-select-selection, .ant-select-selection:focus, .ant-select-selection:active {
      box-shadow: none;
    }
    .editable-row-operations {
      height: 100%;
    }
    .editable-row-operations div button{
      font-family:'Arial'!important;
      transition: none !important;
      border: none;
      color: #0066ff;
      background: none;
      box-shadow: none;
    }
    .current-row .editable-row-operations div button {
      color: #fff !important;
    }
    .el-table__empty-block {
      min-height: 30px;
      height: 50px !important;
      .el-table__empty-text {
        line-height: 30px;
      }
    }
    .el-table__fixed-right::before, .el-table__fixed::before {
      height: auto;
    }
    .el-table th {
      border-top: none;
    }
    .el-table th:first-child, .el-table td:first-child {
      border-left: none;
    }
    .el-table__body td,
    .el-table__body tr,
    .el-table__body .hover-row,
    .el-table__body input,
    .el-table__body span,
    .el-table__body a,
    .el-table__body div {
      transition: none !important;
    }
    .el-table .sort-caret {
      margin-top: 2px;
      position: static;
      &:last-child {
        margin-top: 3px;
      }
    }
    .ant-pagination.mini .ant-pagination-options-quick-jumper {
      line-height: 22px;
      input {
        height:22px;
        margin-top: -1px;
      }
    }
    .el-table::before {
      background-color: #f7f7f7;
    }
    .el-table::after, .el-table::before {
      height: 0;
    }
    .el-transfer {
      height: 350px;
      .el-transfer-panel {
        width: 250px;
        float: right;
        margin-left: 20px;
        &:last-child{
          float: left;
          margin-right: 20px;
          margin-left: 0;
        }
        .el-transfer-panel__list {
          height: 300px;
        }
      }
      .el-transfer-panel__body {
        height: 300px;
      }
      .el-transfer__buttons {
        padding: 120px 36px;
        button {
          border-radius: 5px;
          width: 45px;
          height: 30px;
          line-height: 30px;
          padding: 0;
          display: block;
          margin: 10px 0px;
          span i{
            transform: rotate(180deg);
          }
        }
      }
      .el-transfer__button {
        i, span {
          font-weight: 700;
        }
      }
      .el-transfer-panel__item:hover {
        color: #0066ff;
      }
      .el-checkbox__input.is-checked+.el-checkbox__label {
        color: #0066ff;
      }
      .el-transfer-panel__filter {
        margin: 6px;
        .el-input__inner {
          border-radius: 5px;
        }
      }
    }
    .el-dialog {
      width: 700px;
    }
    .dialog-footer {
      .el-button--primary {
        background: #0066ff;
        border: none;
      }
      button {
        padding: 8px 15px;
      }
    }
    .el-dialog__body {
      padding: 8px 20px;
    }
  }
  .el-table__fixed-right .el-table__fixed-body-wrapper table tbody tr td:last-child{
     border-left: 1px solid;
  }
  .el-table__fixed-right .el-table__fixed-header-wrapper .el-table__header thead tr th:last-child{
    border-left: 1px solid #CCCCCC!important;
  }
  .empty-table {
    .is-scrolling-left .el-table__body {
      padding-bottom: 0px;
    }
    .empty-data {
      width: 100%;
      text-align: center;
      color: #909399;
      position: absolute;
    }
    .el-table__body-wrapper {
      border-left: 1px solid #CCCCCC;
      border-right: 1px solid #CCCCCC;
      border-bottom: 1px solid #CCCCCC;
    }
  }
  .many-table-head {
    .el-table th {
      height: auto;
      div {
        padding: 1px 8px!important;
        height: 21px!important;
        line-height: 21px !important;
        font-weight: 400;
        .caret-wrapper{
          height: 100%;
          margin-top: -10px!important;
        }
      }
    }
    // .empty-data {
    //   top: 68px !important;
    // }
  }
  .el-table-column--selection div{
    text-align: center
  }
  .pdright-10 .el-table__fixed-right{
    margin-right:10px;
  }
  .pdright-17 .el-table__fixed-right{
    margin-right:17px;
  }
  .el-transfer__button {
    background: #0066ff;
    &:hover {
      background: #0066ff;
    }
  }
  .el-table__footer{
    tbody{
      tr{
        height: 38px;
        td{
          background: #E6F7FF;
          height: 38px;
        }
        td:hover{
          background: #E6F7FF;
        }
      }
    }
  }
  .el-table__body-wrapper{
    z-index: 2;
  }
  .el-table__fixed-footer-wrapper{
    z-index: 0;
  }
</style>
