<template>
  <div>
    <!-- 头部开始 -->
    <ufHeader :title="title">
      <template slot="btns">
        <a-button type="primary" :class="getBtnPer('btn-calc')" class="mr-5" @click="onClickSave(onClickCalc, true)">计算</a-button>
        <a-button class="mr-5" :class="getBtnPer('btn-save')" @click="onClickSave(queryTableData)">保存</a-button>
        <a-button class="mr-5" :class="getBtnPer('btn-wf-commit')" @click="onClickCommit">提交</a-button>
        <a-button class="mr-5" :class="getBtnPer('btn-import')" :loading="importLoading" @click="showImportModal">导入</a-button>
        <a-button class="mr-5" :class="getBtnPer('btn-replace')" :loading="showReplaceBtnLoading" @click="showReplaceModal">替换</a-button>
        <a-button class="" :class="getBtnPer('btn-extsys')" @click="showGetOutsideDataModal">外部系统取数</a-button>
      </template>
    </ufHeader>
    <!-- 头部结束 -->

    <!-- 工具条开始 -->
    <div class="toolBar">
      <ufTab :tabList="tabList" :tabIndex="tabIndex" :maxShowTabNum="6" @clickTabItem="onClickTabItem"></ufTab>
      <div class="toolBarBtn">
        <div class="showMo mr-10"><span v-if="mo">当前编制月份：{{ mo }}月份{{ payNoMo === 1 ? '' : '第' + payNoMo + '批次' }}</span></div>
        <a-input class="searchInput" v-model="searchText" allowClear placeholder="搜索" >
          <template v-slot:addonAfter>
            <div class="searchButton" @click="onSearch(searchText)">
              <a-icon v-if="showSearchLoading" ref="searchIcon" type="loading" />
              <a-icon v-else ref="searchIcon" type="search" />
            </div>
          </template>
        </a-input>
        <a-radio-group style="display: flex;">
          <a-tooltip placement="bottom">
            <template slot="title">
              <span>打印</span>
            </template>
            <a-radio-button :class="getBtnPer('btn-print')" value="print" @click="print">
              <a-icon type="printer" />
            </a-radio-button>
          </a-tooltip>
          <a-tooltip placement="bottom">
            <template slot="title">
              <span>导出Excel文件</span>
            </template>
            <a-radio-button :class="getBtnPer('btn-export')" value="exportData" @click="exportEvent">
              <a-icon type="upload" />
            </a-radio-button>
          </a-tooltip>
        </a-radio-group>
      </div>
    </div>
    <!-- 工具条结束 -->

    <!-- :data="filterTableData" 不使用双向数据绑定，解决表格输入卡顿 -->
    <!-- 表格开始 -->
    <vxe-grid
      keep-source
      head-align="center"
      :height="tableH"
      ref="xTable"
      :auto-resize="true"
      class="xtable mytable-scrollbar"
      :columns="columns"
      :row-style="rowStyle"
      :cell-style="cellStyle"
      :highlight-hover-row="true"
      :toolbar="{ id: 'wageBianZhiTable', resizable: { storage: true } }"
      :highlight-cell="true"
      :mouse-config="{selected: true}"
      :keyboard-config="{ isArrow: true, isEnter: true, isEdit: true, isTab: true, editMethod}"
      :edit-config="{ trigger: 'click', mode: 'cell', showStatus: true, showIcon: false, activeMethod: activeCellMethod }" 
      @resizable-change="onTableResize"
    >
      <template v-slot:linkToDetail="record">
        <div v-if="record.row.LASTROW" class="blod">{{ record.row.EMP_NAME }}</div>
        <div v-else class="jump-link" @click="showEmpDetail(record, 'open')">
          {{ record.row.EMP_NAME }}
        </div>
      </template>
      <template v-slot:setCol>
        <div class="setCols" @click="setCols">
          <a-icon type="bars" />
        </div>
      </template>
    </vxe-grid>
    <!-- 表格结束 -->

    <!-- 隐藏的表格 用来导出 begin -->
    <vxe-grid
      v-if="openExport"
      style="width: 999999px;"
      height="999999"
      ref="xTableHide"
      class="tableHide"
      :columns="setColumns"
    >
    </vxe-grid>
    <!-- 隐藏的表格 用来导出 end -->

    <!-- 点姓名弹出的记录明细 开始 -->
    <uf-modal title="记录明细" :keyboard="false" v-model="empDetailModalVisible" @cancel="empDetailModalCancel" :width="900">
      <a-row type="flex" justify="space-between" align="middle">
        <a-col :span="6">人员编码：{{ empDetailObj.EMP_CODE }}</a-col>
        <a-col :span="6">人员姓名：{{ empDetailObj.EMP_NAME }}</a-col>
        <a-col :span="6">工资类别：{{ empDetailObj.PRTYPE_CODE_NAME + '(' + empDetailObj.SMO + '月' + (empDetailObj.PAY_NO_MO==1?'':('第'+empDetailObj.PAY_NO_MO+'批次'))+ ')' }}</a-col>
        <a-col :span="6">
          <a-row>
            <a-button :disabled="rowIndex === 0" @click="showEmpDetail({ row: tableData[0], rowIndex: 0 }, 'jump')">
              <a-icon type="fast-backward" />
            </a-button>
            <a-button
              :disabled="rowIndex === 0"
              @click="
                rowIndex === 0 ? (rowIndex = 0) : --rowIndex
                showEmpDetail({ row: tableData[rowIndex], rowIndex: rowIndex }, 'jump')
              "
              style="margin-left: 5px;"
            >
              <a-icon type="step-backward" />
            </a-button>
            <a-button
              :disabled="rowIndex === tableData.length - 1"
              @click="
                rowIndex === tableData.length - 1 ? rowIndex : ++rowIndex
                showEmpDetail({ row: tableData[rowIndex], rowIndex: rowIndex }, 'jump')
              "
              style="margin-left: 5px;"
            >
              <a-icon type="step-forward" />
            </a-button>
            <a-button :disabled="rowIndex === tableData.length - 1" @click="showEmpDetail({ row: tableData[tableData.length - 1], rowIndex: tableData.length - 1 }, 'jump')" style="margin-left: 5px;">
              <a-icon type="fast-forward" />
            </a-button>
          </a-row>
        </a-col>
      </a-row>
      <!-- 可编辑表 开始 -->

      <vxe-grid
        keep-source
        head-align="center"
        height="300"
        size="mini"
        ref="empDetailGrid"
        class="xtable mytable-scrollbar"
        :columns="empDetailColumns"
        :data="empDetailData"
        :auto-resize="true"
        :highlight-hover-row="true"
        :highlight-cell="true"
        :mouse-config="{selected: true}"
        :keyboard-config="{ isArrow: true, isEnter: true, isEdit: true, isTab: true, editMethod: empEditMethod}" 
        :edit-config="{ trigger: 'click', mode: 'cell', showStatus: true, showIcon: false, activeMethod: empDetailActiveCellMethod }"
        style="margin-top: 10px;"
      ></vxe-grid>
      <!-- 可编辑表 结束 -->

      <template slot="footer">
        <a-button key="save" class="mr-10" type="primary" :loading="empDetailModalSaveLoading" @click="onClickEmpDetailSave(queryTableData)">
          保存
        </a-button>
        <a-button key="close" @click="empDetailModalVisible = false">
          关闭
        </a-button>
      </template>
    </uf-modal>
    <!-- 点姓名弹出的记录明细 结束 -->

    <!-- 外部系统取数弹窗 开始 -->
    <uf-modal title="请选择数据提取的时间范围" v-model="getOursideModalVisible" @cancel="getOursideModalCancel" :width="500">
      <a-date-picker style="margin-left: 10px;" :defaultValue="moment(minOccurDate, dateFormat)" @change="onChangeStartDate" placeholder="起始日期" />
      -
      <a-date-picker :defaultValue="moment(maxOccurDate, dateFormat)" @change="onChangeEndDate" placeholder="结束日期" />
      <template slot="footer">
        <a-button key="confirm" class="mr-10" type="primary" :loading="getOursideModalLoading" @click="getOutsideData">
          确定
        </a-button>
        <a-button key="close" @click="getOursideModalVisible = false">
          关闭
        </a-button>
      </template>
    </uf-modal>
    <!-- 外部系统取数弹窗 结束 -->

    <!-- 替换弹窗 开始 -->
    <uf-modal title="工资数据替换" v-model="replaceModalVisible" @cancel="replaceModalCancel" :width="900">
      <h2 class="modalTitle">目标项</h2>
      <a-row type="flex" align="middle" class="a-row mt-10">
        <a-col :span="4">工资信息：</a-col>
        <a-col :span="20">{{ tabList[tabIndex] ? tabList[tabIndex].text : '' }}({{ mo }})</a-col>
      </a-row>
      <a-row type="flex" align="middle" class="a-row mt-10">
        <a-col :span="4">工资项目：</a-col>
        <a-col :span="20">
          <ufTreeSelect allowClear style="width: 100%" placeholder="请选择目标工资项目" checkable :treeData="replaceProjectTreeData" @change="salaryProjectTargetChange"></ufTreeSelect>
        </a-col>
      </a-row>
      <a-row type="flex" align="middle" class="a-row mt-10">
        <a-col :span="4">导入人员：</a-col>
        <a-col :span="20">
          <div class="empInputWrap" @click="choiceEmpModalVisble = true">
            <div class="empInput">{{ empNames && empNames.length > 0 ? empNames.join(',') : '全部' }}</div>
            <div class="empInputClear" @click.stop="onClearEmpInputClear" v-if="empNames && empNames.length > 0">
              <a-icon style="color: #fff;font-size: 8px;" type="close" />
            </div>
          </div>
        </a-col>
      </a-row>
      <h2 class="modalTitle mt-10">来源项</h2>
      <a-row type="flex" align="middle" class="a-row mt-5">
        <a-col :span="4">工资类别：</a-col>
        <a-col :span="6">
          <a-select :defaultValue="fromPrtypeCode" style="width: 120px" :value="fromPrtypeCode" @change="fromPrtypeCodeOnChange">
            <a-select-option v-for="item in prtypeCodeList" :key="item.prtypeCode" :value="item.prtypeCode">{{ item.text }}</a-select-option>
          </a-select>
        </a-col>
        <a-col :span="4">历史年：</a-col>
        <a-col :span="6">
          <a-select :defaultValue="historyYear" style="width: 120px" :value="historyYear" @change="historyYearOnChange">
            <a-select-option v-for="item in historyYears" :key="item" :value="item">{{ item }}</a-select-option>
          </a-select>
        </a-col>
        <a-col :span="4">
        </a-col>
      </a-row>
      <a-row type="flex" align="middle" class="a-row mt-10">
        <a-col :span="4">历史月：</a-col>
        <a-col :span="6">
          <a-select :defaultValue="historyMo" style="width: 120px" :value="historyMo" @change="historyMoOnChange">
            <a-select-option v-for="item in historyMos" :key="item" :value="item">{{ item }}</a-select-option>
          </a-select></a-col
        >
        <a-col :span="4">历史月批次：</a-col>
        <a-col :span="6">
          <a-select :defaultValue="historyPayNoMo" style="width: 120px" :value="historyPayNoMo" @change="historyPayNoMoOnChange">
            <a-select-option v-for="item in historyPayNoMos[historyMo] ? historyPayNoMos[historyMo] : []" :key="item" :value="item">{{ item }}</a-select-option>
          </a-select>
        </a-col>
      </a-row>

      <a-radio-group style="margin-left: 10px;margin-top: 10px" name="radioGroup" :defaultValue="1" @change="onReplaceRadioChange">
        <a-radio :value="1">历史工资项目</a-radio>
        <a-radio :value="2" style="margin-left: 14px;">公式定义</a-radio>
      </a-radio-group>
      <div style="margin-top: 5px" v-if="replaceRadioValue===1">
        <a-row type="flex" align="middle" class="a-row mt-10">
          <a-col :span="4">工资项目：</a-col>
          <a-col :span="20">
            <ufTreeSelect allowClear placeholder="请选择来源工资项目" style="width: 100%" checkable :treeData="replaceProjectTreeData" @change="salaryProjectFromChange"></ufTreeSelect>
          </a-col>
        </a-row>
        
      </div>
      <div style="margin-top: 5px" v-else>
        <a-row type="flex" align="top" class="a-row mt-10">
          <a-col :span="4">
            <a-button key="formulaDefinition" @click="formulaEditorVisible = true">
              公式定义
            </a-button>
          </a-col>
          <a-col :span="20">
            <div class="formulaTextarea">{{formula}}</div>
          </a-col>
        </a-row>
      </div>
      <template slot="footer">
        <a-button key="confirm" class="mr-10" type="primary" :loading="replaceModalLoading" @click="onClickReplaceModalConfirm">
          确定
        </a-button>
        <a-button key="close" @click="replaceModalCancel">
          关闭
        </a-button>
      </template>
    </uf-modal>
    <!-- 替换弹窗 结束 -->

    <!-- 选择人员 开始 -->
    <choiceEmpModal v-if="tabList.length > 0" v-model="choiceEmpModalVisble" :prtypeCodeList="tabList[tabIndex].prtypeCode === '*'?prtypeCodes:[tabList[tabIndex].prtypeCode]" @close="choiceEmpModalVisble = false"></choiceEmpModal>
    <!-- 选择人员 结束 -->

    <!-- 公式编辑器 开始 -->
    <formulaEditor :visible="formulaEditorVisible" :prtypeCode="fromPrtypeCode" @formulaEditorClose="formulaEditorClose"></formulaEditor>
    <!-- 公式编辑器 结束 -->

    <!-- 调栏窗口 开始 -->
    <setColsModal :visible="setColsModalVisible" :data="setColsModalData" :prtypeCode="prtypeCode" :pageId="pageId" @cancel="setColsModalCancel" @confirm="setColsModalConfirm"> </setColsModal>
    <!-- 调栏窗口 结束 -->

    <!-- 导入 开始 -->
    <uf-modal title="选择工资数据导入格式" v-model="importModalVisible" @cancel="importModalCancel" :width="960">
      <a-row type="flex" align="middle" class="mt-10">
        <a-col :span="4">请选择要导入的文件：</a-col>
        <a-col :span="14">
          <a-input-search v-model="importFileName" placeholder="点击按钮选择导入文件，文件大小请控制在2M之内">
            <a-button type="primary" slot="enterButton">选择文件</a-button>
          </a-input-search>

          <form ref="excelFileFrom" id="excelFileFrom" enctype="multipart/form-data">
            <input id="excelFile" ref="excelFile" accept=".xlsx,.xls" name="filePath" type="file" class="file-upload-input" @change="onClickSelectFile" />
            <input :value="prtypeCode" id="typeCode" name="typeCode" type="hidden" />
            <input :value="selectFormatRow ? selectFormatRow.id : ''" id="id" name="id" type="hidden" />
            <input :value="selectFormatRow ? selectFormatRow.sheetid : ''" id="sheetid" name="sheetid" type="hidden" />
            <input :value="selectFormatRow ? selectFormatRow.isNeedCalc : ''" id="isNeedCalc" name="isNeedCalc" type="hidden" />
          </form>
        </a-col>
        <a-col :span="6" style="padding-left: 15px;color: #777">
          <span>仅支持导入.xlsx和.xls格式的文件</span>
        </a-col>
      </a-row>
      <div>请选择导入格式：</div>

      <vxe-table style="margin-top: 10px;" border highlight-hover-row ref="importGrid" :data="importFormatData" size="mini" height="240" @radio-change="radioChangeEvent" :radio-config="{ trigger: 'row' }">
        <vxe-table-column align="center" type="radio" width="36"></vxe-table-column>
        <vxe-table-column align="center" field="name" title="格式名称"></vxe-table-column>
        <vxe-table-column align="center" field="matchitemStr" title="匹配类型"></vxe-table-column>
        <vxe-table-column align="center" field="matchcolumnindex" title="对应列序号"></vxe-table-column>
        <vxe-table-column align="center" field="datarowindex" title="导入开始行"></vxe-table-column>
        <vxe-table-column align="center" field="sheetid" title="导入页签号"></vxe-table-column>
        <vxe-table-column align="center" field="isNeedCalcStr" title="是否计算"></vxe-table-column>
        <vxe-table-column align="center" field="doublematchitem" title="二级匹配要素"></vxe-table-column>
        <vxe-table-column align="center" field="doublematchcolumnindex" title="匹配列序号"></vxe-table-column>
      </vxe-table>
      <template slot="footer">
        <a-button key="import" class="mr-10" type="primary" :loading="importModalLoading" @click="onClickImport">
          导入
        </a-button>
        <a-button key="cancel" @click="importModalCancel">
          取消
        </a-button>
      </template>
    </uf-modal>
    <!-- 导入 结束 -->

    <!-- 导入进度条 开始 -->
    <!-- <PrograssModal :visible="prograssModalVisible" :percent="importPercent" :status="importStatus" :msg="importMsg" @prograssModalClose="prograssModalClose"></PrograssModal> -->
    <!-- 导入进度条 结束 -->

    <!-- 切换tab时的确认框 开始 -->
     <uf-modal title="请注意" v-model="confirm3Visible" @cancel="confirm3HandleCancel">
       <template slot="footer">
        <a-button key="ok" class="mr-10" type="primary" :loading="confirm3Loading" @click="confirm3HandleOk">
          是
        </a-button>
        <a-button key="no" class="mr-10" @click="confirm3HandleNo">否</a-button>
        <a-button key="cancel" @click="confirm3HandleCancel">取消</a-button>
      </template>
      <p style="display: flex;align-items: center;"><a-icon type="info-circle" theme="filled" style="margin-right: 5px;color: #ffbf00;font-size: 20px;"/>您有未保存的内容是否保存？</p>
    </uf-modal>
    <!-- 切换tab时的确认框 结束 -->
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import XEUtils from 'xe-utils'
import XLSX from 'xlsx'
import { saveAs } from 'file-saver';
import moment from 'moment'
import setColsModal from '@/components/setColsModal'
import formulaEditor from '../wagePreparation/components/formulaEditor'
import choiceEmpModal from '../components/choiceEmpModal'
// import PrograssModal from '@/components/PrograssModal'
import { defaultColumns, empDetailColumns, defaultCheckedFields, defaultExportFormat } from './wagePreparation' //固定显示的列
import { getBtnPer, getPdf } from '@/assets/js/util'
import '@/render/filterRender'
import '@/render/cellRender'
import '@/render/editRender'
let firstColumn = [{ title: '序号', width: 50, headerAlign: 'center', align: 'center', type: 'seq', fixed: 'left', slots: { header: 'setCol' } }]
const baseUrl = process.env.NODE_ENV === 'development' ? '' : '' //薪资模块 开发环境下添加前缀
const baseSearchProps = ['empName', 'sex', 'orgCodeName', 'prtypeCodeName', 'levelGradeName', 'dutyGradeName', 'payEditStatName', 'isFugle']
let searchProps = [].concat(baseSearchProps)
export default {
  name: 'wagePreparation',
  data() {
    return {
      title: '工资编制', //页面标题
      pageId: 'PRS_CALC_DATA',
      tableH: 600, //表格高度
      tabList: [], //tab对象数组
      tabIndex: 0, //当前tab角标
      showSearchLoading: false,
      searchText: '', //全表搜索框输入的内容
      defaultColumns, //固定显示的列
      firstColumn,
      moveColumns: [], //请求到的列
      replaceProjectTreeData: [],//替换工资项目下拉框树形数据
      tableData: [], //表格数据
      filterTableData: [], //经过筛选后的表格数据
      pagelist: [],
      mo: 1, //当前编制月份
      payNoMo: 1, //当前编制月份批次
      getOursideModalVisible: false, // 外部系统取数弹窗显示
      getOursideModalLoading: false, // 外部系统取数按钮oading
      minOccurDate: moment()
        .date(1)
        .format('YYYY-MM-DD'), // 期间日期-起始
      maxOccurDate: moment()
        .endOf('month')
        .format('YYYY-MM-DD'), // // 期间日期-结束
      dateFormat: 'YYYY-MM-DD', //日期格式
      prtypeCode: '', //tab类别值
      prtypeCodes: [],
      prtypeCodeList: [],
      showReplaceBtnLoading: false, //显示替换窗口按钮 loading
      replaceModalVisible: false, //替换窗口显示
      replaceModalLoading: false, //替换按钮loading
      importModalVisible: false, // 导入窗口 显示
      importModalLoading: false, // 导入loading
      tableRecords: [], //原始数据
      setColsModalVisible: false, //调栏窗口显示
      setColsModalLoading: false, //调栏窗口 确定按钮loading
      defaultCheckedColsNum: 10, //不存在 默认勾选的列数量
      setColumns: [], //用户已勾选的列并且最终用于表格显示 这些列信息将会包含是否锁定状态 默认用户信息一部分加请求到的列数据10列
      // haslock: false, //包含锁定列的状态 （暂时废弃）
      saveFlag: false, //提示保存的显示标记
      setColsModalData: {
        columnsNoSeq: [],
        showColumns: []
      },
      //记录明细部分 开始
      empDetailModalVisible: false,
      empDetailColumns,
      empDetailData: [],
      empDetailObj: {},
      empDetailModalSaveLoading: false,
      rowIndex: 0,
      saveState: false,//记录保存的状态  默认状态 未保存
      //导入部分开始
      importLoading: false,
      importFormatData: [],
      selectFormatRow: null,
      importFileName: '',
      suffix: '',//导入的文件名后缀 用于判断
      //替换部分
      targetPrtypeList: [], //目标工资项列表
      fromPrtypeList: [], //来源工资项列表
      fromPrtypeCode: '', //来源项的工资类别
      historyYear: '',
      historyMo: '',
      historyPayNoMo: '',
      //替换中的历史年历史月历史批次列表
      historyYears: [],
      historyMos: [],
      historyPayNoMos: {},
      choiceEmpModalVisble: false, //显示选择人员的弹窗
      formulaEditorVisible: false, //公式编辑器显示
      replaceRadioValue: 1,
      //导入进度条部分
      // prograssModalVisible: false, //导入进度条显示
      // importPercent: 0,
      // importStatus: 'active',
      // importMsg: '',
      //如果修改了表格内容 再点击tab 切换时候
      confirm3Visible: false,
      confirm3Loading: false,
      clickedTabItem: {},
      openExport: false //导出标记
    }
  },
  components: {
    setColsModal,
    choiceEmpModal,
    formulaEditor
    // PrograssModal
  },
  mounted() {
    let svTransDate = this.pfData.svTransDate
    this.minOccurDate = moment(svTransDate)
      .date(1)
      .format(this.dateFormat) // 期间日期-起始
    this.maxOccurDate = moment(svTransDate)
      .endOf('month')
      .format(this.dateFormat) // // 期间日期-结束
    this.findPrsTypeCoIsUsedByPrsCalc(() => {
      this.onClickTabItem(this.tabList[0])
    })
  },
  // watch: {
  //   searchText(val){
  //     if(!val){
  //       this.doFilterTableData('')
  //     }
  //   }
  // },
  computed: {
    ...mapState({
      pfData: state => state.pfData,
      containerH: state => state.containerH,
      //需要带上setCols模块名
      showColumns: state => state.setCols.showColumns,
      json: state => state.setCols.json,
      planId: state => state.setCols.planId,
      empuids: state => state.choiceEmp.empuids,
      empNames: state => state.choiceEmp.empNames,
      formula: state => state.formulaEditor.formula
    }),
    /**
     * @description: 不包含序号的所有列 用于调栏checkboxs展示
     */
    columnsNoSeq() {
      let columnsNoSeq = this.defaultColumns.concat(this.moveColumns)
      this.setColumnsNoSeq(columnsNoSeq)
      this.$set(this.setColsModalData, 'columnsNoSeq', columnsNoSeq)
      return columnsNoSeq
    },
    /**
     * @description: 包括“序号”在内 基础列数据和请求到的列数据合并组成的所有的列
     */
    columns() {
      let columns = this.firstColumn
      columns = columns.concat(this.setColumns)
      return columns
    },
  },
  created() {
    this.tableH = this.containerH - 110
  },
  methods: {
    moment,
    getBtnPer,
    ...mapActions(['setColumnsNoSeq', 'setShowColumns', 'setWageTableColsPlan', 'setEmpuids', 'clearEmp', 'clearFormula']),
    /**
     * @description: 搜索
     */
    onSearch(val){
      if(!this.showSearchLoading){
        this.showSearchLoading = true
        this.getNoSaveState(res =>{
          if(res){
            this.onClickSave(this.queryTableData)
            setTimeout(() =>{
              this.showSearchLoading = false
            },2000)
          }else{
            setTimeout(() =>{
              this.showSearchLoading = false
            },1000)
          }
          this.doFilterTableData(val)
        })
      }
    },
    /**
     * @description: 列配置 点击确定时的监听
     */
    setColsModalConfirm() {
      searchProps = []
      searchProps = searchProps.concat(baseSearchProps)
      this.setColsModalVisible = false
      this.setColumns = JSON.parse(JSON.stringify(this.showColumns))
      this.$set(this.setColsModalData, 'columnsNoSeq', JSON.parse(JSON.stringify(this.columnsNoSeq)))
      this.$set(this.setColsModalData, 'showColumns', JSON.parse(JSON.stringify(this.showColumns)))
      this.showColumns.forEach(item => {
        searchProps.push(item.field)
      })
      //解决由于动态显示隐藏列时候 表格不刷新导致的错乱问题
      this.$nextTick(()=>{
        this.$refs.xTable.refreshColumn()
      })
    },
    /**
     * @description: 表格列宽被改变
     */
    onTableResize() {},
    /**
     * @description: 获取部门
     */
    getPrsOrgTreeIsUsed() {
      this.$axios
        //8.20.14版本 80平台代码
        // .get(baseUrl + '/prs/emp/prsOrg/getPrsOrgTreeIsUsed', {
        //8.30版本 85平台代码
        .get(baseUrl + '/ma/emp/prsOrg/getPrsOrgTreeIsUsed', {
          params:{
            roleId: 9607,
            ajax: 1
          }
        })
        .then(result => {
        })
    },
    /**
     * @description: 获取工资类别
     */
    findPrsTypeCoIsUsedByPrsCalc(callback){
      this.$showLoading()
      this.$axios
        .post(baseUrl + '/prs/prscalcdata/findPrsTypeCoIsUsedByPrsCalc?roleId=' + this.pfData.svRoleId + '&ajax=1', {
          flag: 'CALCBZ'
        }).then(result =>{
          if (result.data.flag === 'success') {
            if(result.data.data&&result.data.data.length > 0){
              this.mo = result.data.data[0].mo
              this.payNoMo = result.data.data[0].payNoMo
              this.tabList = []
              this.prtypeCodes = []
              this.prtypeCodeList = []
              result.data.data.forEach((item,index) =>{
                item.current = index
                item.text = item.prtypeName
                this.tabList.push(item)
                this.prtypeCodes.push(item.prtypeCode)
                this.prtypeCodeList.push(item)
              })
              let cur = this.tabList.length
              this.tabList.push({ current: cur, text: '全部', prtypeCode: '*', mo: this.mo, payNoMo: this.payNoMo })
              if (callback && typeof callback === 'function') {
                callback()
              }
            }else{
              throw '未获取到工资类别'
            }
          }else{
            throw result.data.msg
          }
        }).catch(this.$showError)
    },
    /**
     * @description: 循环请求工资编制数据 for 压力测试
     * @param {string} 工资类别代码
     * @return {object['Promise']} 返回promise对象，获取完全部数据之后的处理
     */
    findCalcDatas(prtypeCodes){
      return new Promise((resolve, reject)=>{
        let that = this, list = []
        /**
         * @description: 请求工资编制数据单一功能函数
         * @param {number} 页码
         */
        function getData(pageNum){
          that.$axios
            .post(baseUrl + '/prs/prscalcdata/findCalcDatas?roleId=' + that.pfData.svRoleId + '&ajax=1', {
              payEditStat: '',
              prtypeCodes: prtypeCodes,
              empNames: '',
              flag: 'CALCBZ',
              pageNum: pageNum,
              pageSize: 1000
            })
            .then(result => {
              list = list.concat(result.data.data.page.list)
              if(!result.data.data.page.isLastPage){
                getData(++pageNum)
              }else{
                resolve({list: list, moveItem: result.data.data.moveItem})
              }
            }).catch(that.$showError)
        }
        getData(1)
      })
    },
    /**
     * @description: watch和getTableData里为了复用抽出的方法
     * @param {string} 搜索框内的值
     */
    doFilterTableData(filterText){
      let rest = null
      if (filterText) {
        filterText = XEUtils.toString(filterText).trim()
        //取所有列的列名
        rest = this.tableData.filter(item => {
          let flag = false
          //判断当前列是否可用于全表搜索
          for (let key in item) {
            let flag2 = false
            searchProps.forEach(it => {
              if (it === key) {
                flag2 = true
              }
            })
            if (flag2) {
              if (
                XEUtils.toString(item[key])
                  .toLowerCase()
                  .indexOf(filterText) > -1
              ) {
                item.highlight = key
                item.filterText = filterText
                flag = true
              }
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
      let xTable = this.$refs.xTable,
      xTableHide = this.$refs.xTableHide
      if (xTable) {
        xTable.reloadData(rest).then(() => {
          this.$hideLoading()
        })
      }
      if(xTableHide){
        xTableHide.reloadData(rest).then(() => {
          this.$hideLoading()
        })
      }
    },
    /**
     * @description: 查询薪资编制数据
     * @param {Array} prtypeCodes
     */
    getTableData(prtypeCodes, hideLoading) {
      // let t1 = new Date().getTime(), t2 = 0 , t3 = 0
      if(!hideLoading){ this.$showLoading() }
      this.setWageTableColsPlan({
        planId: '',
        ordIndex: 1,
        planName: ''
      })
      this.tableData = []
      this.findCalcDatas(prtypeCodes).then(result =>{
        this.$nextTick(()=>{
          // 表格头部数据 列名
          this.moveColumns = []
          this.replaceProjectTreeData = [{
            id: '0',
            pId: '',
            isLeaf: 0,
            code: '0',
            name: '全部',
            codeName: '全部',
          }]
          result.moveItem.forEach(item => {
            let len = item.itemName.length
            if(item.itemCode === 'SMO'){
              this.moveColumns.push({
                field: item.itemCode,
                title: item.itemName,
                minWidth: 80,
                headerAlign: 'center',
                align: 'center',
                cellRender: { name: 'searchHighLight' },
                checked: false,
                sortable: true,
              })
            }else{
              this.moveColumns.push({
                field: item.itemCode,
                title: item.itemName,
                minWidth: 60 + (len < 8 ? (len * 14) : (len * 16)),
                headerAlign: 'center',
                align: 'right',
                filters: [{ data: '' }],
                filterRender: { name: 'filterMoneyInput' },
                editRender: { name: 'editInput' },
                isDifferentColor: item.isDifferentColor,
                isHighLight: item.isHighLight,
                isEditable: item.isEditable,
                checked: false
              })
              this.replaceProjectTreeData.push({
                id: item.itemCode,
                pId:'0',
                isLeaf: 1,
                code: item.itemCode,
                name: item.itemName,
                codeName: item.itemName
              })
            }
            searchProps.push(item.itemCode)
          })
          console.log(this.replaceProjectTreeData)
          //解决由于动态显示隐藏列时候 表格不刷新导致的错乱问题
          this.$refs.xTable.refreshColumn()
          this.tableData = result.list
          //这里与watch方法一致
          this.doFilterTableData(this.searchText)
          //保存表格数据的原始记录记录到一个新的内存地址
          this.tableRecords = JSON.parse(JSON.stringify(result.list))
        })
        return this.$axios.get(baseUrl+'/prs/prsqueryplan/getPrsQueryPlan?pageId='+this.pageId+'&prtypeCode='+(prtypeCodes.length>1?'*':prtypeCodes[0])).then(res =>{
            return new Promise(resolve => {
              if (res.data.flag === 'success') {
                // this.$message.success('获取用户调栏设置成功')
                if (res.data.data && res.data.data.length > 0) {
                  resolve({res: res.data.data[0], prtypeCode: (prtypeCodes.length>1?'*':prtypeCodes[0])})
                }else{
                  resolve({res: null, prtypeCode: (prtypeCodes.length>1?'*':prtypeCodes[0])})
                  console.log('未查询到工资类别为：'+ this.tabList[this.tabIndex].text +'('+(prtypeCodes.length>1?'*':prtypeCodes[0])+') 的调栏设置')
                  // reject('未查询到工资类别为：全部 的调栏设置')
                }
              } else {
                // throw '获取用户调栏设置失败，' + res.data.msg
                resolve({res: null, prtypeCode: (prtypeCodes.length>1?'*':prtypeCodes[0])})
                console.log('获取用户调栏设置失败，' + res.data.msg)
                this.$showError()
              }
            })
        })
      }).then(result=>{
        if(!result){
          return 
        }
        let json, noChecked = false; //全不选标记
        if(result.res){
          if(result.res.json){
            json = JSON.parse(result.res.json)
            if(json.length === 0) {
              noChecked = true
            }
            this.setWageTableColsPlan({
              ordIndex: result.res.ordIndex,
              planId: result.res.planId,
              planName: result.res.planName
            })
          }else{
            this.setWageTableColsPlan({
              ordIndex: 1,
              planId: '',
              planName: '表栏目-1'
            })
          }
        }
        this.moveColumns.forEach(item =>{
          if(noChecked){
            item.checked = false
          }else{
            if (json && json.length > 0) {
              //如果服务器上有保存的调栏信息
              json.forEach(it => {
                if (it.field === item.field) {
                  item.checked = true
                }
              })
            } else {
              item.checked = true
            }
          }
        })
        this.defaultColumns.forEach(item => {
          item.checked = false
          delete item.fixed
          if (json && json.length > 0) {
            //如果服务器上有保存的调栏信息
            json.forEach(it => {
              if (it.field === item.field) {
                item.checked = true
              }
            })
          } else {
            if(!noChecked){
              defaultCheckedFields.forEach(field =>{
                if(field === item.field){
                  item.checked = true
                }
              })
            }
          }
        })
        //this.moveColumns 和 this.defaultColumns 合并组合成了 this.columnsNoSeq 这个决定了调栏默认勾选了哪些项
        let showColumns = []
        if (json && json.length > 0) {
          //如果服务器上有保存的调栏信息
          //从json转换的表格列设置不能直接使用 必须校验一下所有的列是否存在 因为列可能会被删除 改名
          //！！！这里保持json先遍历再遍历所有列 否则用户基础信息列的顺序改变将不会生效！！！
          json.forEach(it => {
            this.columnsNoSeq.forEach(item => {
              if (it.field === item.field) {
                if (item.checked) {
                  if (it.fixed) {
                    item.fixed = it.fixed
                  }
                  searchProps.push(item.field)
                  showColumns.push(item)
                }
              }
            })
          })
        } else {
          //如果没有包存的调栏信息
          //调栏内勾选项初始化
          this.columnsNoSeq.forEach(item => {
            if (item.checked) {
              delete item.fixed
              showColumns.push(item)
              searchProps.push(item.field)
            }
          })
        }
        //重新排列顺序 有固定列属性的放前边
        let arr1 = [], arr2 = []
        showColumns.forEach(item =>{
          if(item.fixed){
            arr1.push(item)
          }else{
            arr2.push(item)
          }
        })
        showColumns = arr1.concat(arr2)
        this.setColumns = showColumns
        this.$nextTick(() => {
          //this.setColumns与 vuex里的Action: setShowColumns的参数showColumns不能是同一个引用对象
          this.setColumnsNoSeq(JSON.parse(JSON.stringify(this.columnsNoSeq)))
          //初始化显示列 默认全部显示
          this.setShowColumns(showColumns)
          this.$set(this.setColsModalData, 'columnsNoSeq', JSON.parse(JSON.stringify(this.columnsNoSeq)))
          this.$set(this.setColsModalData, 'showColumns', showColumns)
          //解决由于动态显示隐藏列时候 表格不刷新导致的错乱问题
          this.$refs.xTable.refreshColumn()
          // let t4 = new Date().getTime()
          // this.$message.success('请求时间：'+(t2 - t1)/1000+'s  表格渲染时间：'+(t4 - t2)/1000+'s  全部完成时间：'+(t4 - t1)/1000+'s')
        })
      })
      .catch(this.$showError)
    },
    /**
     * @description: 切换tab
     */
    onClickTabItem(item) {
      this.$showLoading()
      this.clickedTabItem = item
      let tabIndex = this.tabIndex,
      prtypeCode = this.prtypeCode,
      fromPrtypeCode = this.fromPrtypeCode,
      mo = this.mo,
      payNoMo = this.payNoMo

      this.tabIndex = item.current
      this.prtypeCode = item.prtypeCode
      this.fromPrtypeCode = item.prtypeCode
      this.mo = item.mo
      this.payNoMo = item.payNoMo
      //检查表格内容是否改变
      this.getNoSaveState(res =>{
        if(res){
          //还原
          this.tabIndex = tabIndex
          this.prtypeCode = prtypeCode
          this.fromPrtypeCode = fromPrtypeCode
          this.mo = mo
          this.payNoMo = payNoMo

          this.$hideLoading()
          this.confirm3Visible = true
        }else{
          if (item.prtypeCode === '*') {
            this.getTableData(this.prtypeCodes)
          } else {
            this.getTableData([item.prtypeCode])
          }
        }
      })
    },
    /**
     * @description: 表格全屏 缩放 放大
     */
    zoomTable() {},
    /**
     * @description: 打印
     */
    print() {
      let prtypeCodes = []
      if (this.prtypeCode === '*') {
        prtypeCodes = this.prtypeCodes
      } else {
        prtypeCodes = [this.prtypeCode]
      }
      let argu = {
        orgCodes: this.orgs,
        prtypeCodes: prtypeCodes
      }
      this.currentPage ? argu.pageNum = this.currentPage:false
      this.pageSize ? argu.pageSize = this.pageSize:false
      let that = this
      this.$showLoading()
      this.$axios
        .post('/prs/rpt/PrsRptData/printSalaryRollFormData', argu)
        .then(result => {
          if (result.data.flag === 'success') {
            let data = JSON.stringify(result.data.data)
            getPdf('salaryDetailForm', '*', data, ()=>{
              that.$hideLoading()
            }, (error) => {
              that.$message.error(error)
              that.$hideLoading()
            })
          } else {
            throw result.data.msg
          }
        })
        .catch(this.$showError)
    },
    /**
     * @description: 导出
     */
    toBuffer (wbout) {
      let buf = new ArrayBuffer(wbout.length)
      let view = new Uint8Array(buf)
      for (let index = 0; index !== wbout.length; ++index) view[index] = wbout.charCodeAt(index) & 0xFF
      return buf
    },
    exportEvent () {
      if(this.openExport === true){
        return
      }
      this.$showLoading()
      this.openExport = true
      setTimeout(()=>{
        this.$nextTick(()=>{
          this.$refs.xTableHide.reloadData(this.tableData)
        })
        setTimeout(() => {
          let table = this.$refs.xTableHide.$el.querySelector('.vxe-table--main-wrapper')
          let book = XLSX.utils.book_new()
          let sheet = XLSX.utils.table_to_sheet(table, { raw: true })
          let headList = []
          for(let prop in sheet){
            let head = prop.replace(/[0-9]/ig,'')
            if(sheet[prop].t== 's'&&(defaultExportFormat.indexOf(sheet[prop].v)>-1)){
              headList.push(head)
            }
            let flag = true
            headList.forEach(item => {
              if(head === item){
                sheet[prop].t = "s"
                sheet[prop].z = "0"
                flag = false
              }
            })
            if(flag){
              if(sheet[prop].t== "n"){
                sheet[prop].z = "#,##0.00"
              }
            }
          }
          XLSX.utils.book_append_sheet(book, sheet)
          let wbout = XLSX.write(book, { bookType: 'xlsx', bookSST: false, type: 'binary' })
          let blob = new Blob([this.toBuffer(wbout)], { type: 'application/octet-stream' })
          let nameCode = this.getAgencyNameCode()
          // 保存导出
          saveAs(blob, nameCode + this.pfData.svSetYear + '年' + this.mo + '月工资编制导出.xlsx',)
          this.openExport = false
          this.$hideLoading()
        }, 500)
      }, 500)
    },
    /**
     * @description: 获取单位代码
     */
    getAgencyCode() {
      let localCode = localStorage.getItem('agencyCode')
      localCode ? localCode : (localCode = '')
      let agencyCode = this.pfData.svAgencyCode ? this.pfData.svAgencyCode : localCode
      return agencyCode
    },
    /**
     * @description: 获取单位名称和代码组成的字符串
     */
    getAgencyNameCode() {
      let localName = localStorage.getItem('agencyName')
      localName ? localName : (localName = '')
      let agencyName = this.pfData.svAgencyName ? this.pfData.svAgencyName : localName
      let agencyCode = this.getAgencyCode()
      return agencyName + '(' + agencyCode + ')'
    },
    /**
     * @description: 外部系统取数
     */
    getOutsideData() {
      //判断是否有“上报”和“审核”状态中的数据 【CWYXM-15785】【工资编制】当编制状态为“上报”或“审核”时，点击“外部系统取数”按钮时，要提示：有未经计算或不可编辑状态的数据，不可取数！
      if (this.getPostStateData().length > 0) {
        this.$message.warning('有“上报”和“审核”状态的数据，不可取数')
        return
      }
      let doFn = () => {
        this.getOursideModalLoading = true
        //处理外部系统取数参数
        let empUid = {}
        if (this.prtypeCode === '*') {
          this.tabList.forEach(item => {
            if (item.prtypeCode != '*') {
              let str = []
              this.tableData.forEach(it => {
                if (item.prtypeCode === it.PRTYPE_CODE) {
                  str.push(it.EMP_UID)
                }
              })
              empUid[item.prtypeCode] = str.join(',')
            }
          })
        } else {
          let str = []
          this.tableData.forEach(item => {
            if (this.prtypeCode === item.PRTYPE_CODE) {
              str.push(item.EMP_UID)
            }
          })
          empUid[this.prtypeCode] = str.join(',')
        }
        var argu = {
          searchStart: this.minOccurDate,
          searchEnd: this.maxOccurDate,
          empUid: empUid
        }
        this.$axios
          .post(baseUrl+ '/prs/prscalcdata/externalSystemData', argu)
          .then(result => {
            this.getOursideModalLoading = false
            if (result.data.flag != 'success') {
              throw result.data.msg
            } else {
              this.getOursideModalVisible = false
              this.$message.success(result.data.msg)
              //取数成功后要刷新表格
              this.queryTableData()
            }
          })
          .catch(this.$showError)
      }

      //【CWYXM-18081】在列表中修改数据，未点击保存，直接点外部系统取数。取数完成后导致之前修改的数据没有保存上
      this.getNoSaveState(res =>{
        if(res){
          this.onClickSave(() => {
            this.queryTableData()
            doFn()
          })
        }else{
          doFn()
        }
      })
    },
    /**
     * @description: 外部系统取数弹窗取消
     */
    getOursideModalCancel() {
      this.getOursideModalVisible = false
    },
    /**
     * @description: 改变起始时间
     */
    onChangeStartDate(date, dateString) {
      this.minOccurDate = dateString
    },
    /**
     * @description: 改变结束日期
     */
    onChangeEndDate(date, dateString) {
      this.maxOccurDate = dateString
    },
    /**
     * @description: 点击外部系统取数按钮
     */
    showGetOutsideDataModal() {
      this.getOursideModalVisible = true
    },
    /**
     * @description: 显示替换窗口
     */
    showReplaceModal() {
      if (this.prtypeCode === '*') {
        this.$message.warning('请切换到详细工资类别')
        return
      }
      this.showReplaceBtnLoading = true
      //查询当前类别是否可编辑
      this.$axios
        .post(baseUrl+ '/prs/prscalcdata/checkPayEditState', {
          flag: 'CALCBZ',
          prtypeCodes: [this.prtypeCode]
        })
        .then(result => {
          this.showReplaceBtnLoading = false
          if (result.data.flag != 'fail') {
            //查询历史年历史月、历史月批次
            this.getHistoryYearAndMonth()
          } else {
            throw result.data.msg
          }
        })
        .catch(this.$showError)
    },
    /**
     * @description: 获取历史年月
     */
    getHistoryYearAndMonth(prtypeCode){
      return this.$axios.post(baseUrl+ '/prs/prscalcdata/getHistoryYearAndMonth', {
        prsType: prtypeCode?prtypeCode:this.prtypeCode
      }).then(result => {
          if (result.data.flag != 'fail') {
            if (result.data) {
              this.historyYears = result.data.data.years
              this.historyYear = this.historyYears[0]
              let obj = {}
              let hasMO =  false
              result.data.data.payListSummary.forEach(item => {
                if(item.MO){
                  if (obj[item.MO]) {
                    obj[item.MO].push(item.PAY_NO_MO)
                  } else {
                    obj[item.MO] = [item.PAY_NO_MO]
                  }
                  hasMO = true
                }
              })
              if(!hasMO){
                this.$message.error('未查询到当前工资项的历史或当前月份批次')
                this.replaceModalVisible = false
                return 
              }
              this.replaceModalVisible = true
              let historyMos = []
              for (let prop in obj) {
                historyMos.push(prop)
              }
              this.historyMos = historyMos.reverse()
              this.historyMo = this.historyMos[0]
              this.historyPayNoMos = obj
              this.historyPayNoMo = String(this.historyPayNoMos[this.historyMo][0])
            }
          } else {
            throw result.data.msg
          }
        })
        .catch(this.$showError)
    },
    /**
     * @description: 替换 来源工资类别改变
     */
    fromPrtypeCodeOnChange(val){
      this.fromPrtypeCode = val
      this.getHistoryYearAndMonth(val)
    },
    /**
     * @description: 历史年改变
     */
    historyYearOnChange(val){
      this.historyYear = val
    },
    /**
     * @description: 历史月改变
     */
    historyMoOnChange(val){
      this.historyMo = val
    },
    /**
     * @description: 历史月批次改变
     */
    historyPayNoMoOnChange(val){
      this.historyPayNoMo = val
    },
    /**
     * @description: 替换 人员选择框清除
     */
    onClearEmpInputClear() {
      this.clearEmp()
    },
    /**
     * @description: 替换 确认
     */
    onClickReplaceModalConfirm() {
      let argu = {}
      if (this.targetPrtypeList.length === 0) {
        this.$message.warning('目标项工资项目不能为空')
        return
      }
      if (!this.fromPrtypeCode) {
        this.$message.warning('请选择来源项的工资类别')
        return
      }
      if (!this.historyYear) {
        this.$message.warning('历史年不能为空')
        return
      }
      if (!this.historyMo) {
        this.$message.warning('历史月不能为空')
        return
      }
      if (!this.historyPayNoMo) {
        this.$message.warning('历史月批次不能为空')
        return
      }
      if(this.replaceRadioValue === 1){
        if (this.fromPrtypeList.length === 0) {
          this.$message.warning('来源项工资项目不能为空')
          return
        }
        if (this.targetPrtypeList.length != this.fromPrtypeList.length) {
          this.$message.warning('来源项与目标项数目不匹配')
          return
        }
        argu = {
          prtypeCodeTarget: this.prtypeCode,
          prtypeCodeCome: this.fromPrtypeCode,
          pritem1: this.targetPrtypeList,
          pritem2: this.fromPrtypeList,
          setYear: this.historyYear,
          payNoMo: this.historyPayNoMo,
          mo: this.historyMo,
          agencyCode: this.getAgencyCode()
        }
        if (this.empuids.length > 0) {
          argu.empuids = this.empuids
        }
      }else{
        if(!this.formula){
          this.$message.warning('公式不能为空')
          return
        }
        argu = {
          prtypeCodeTarget: this.prtypeCode,
          prtypeCodeCome: this.fromPrtypeCode,
          pritem1: this.targetPrtypeList,
          formula: this.formula,
          setYear: this.historyYear,
          payNoMo: this.historyPayNoMo,
          mo: this.historyMo,
          agencyCode: this.getAgencyCode()
        }
        if (this.empuids.length > 0) {
          argu.empuids = this.empuids
        }
      }
      this.replaceModalLoading = true
      this.$axios
        .post(baseUrl+ '/prs/prscalcdata/changePrsCalcData', argu)
        .then(result => {
          this.replaceModalLoading = false
          if (result.data.flag != 'fail') {
            //清空公式
            this.clearFormula()
            this.replaceModalVisible = false
            this.targetPrtypeList = []
            this.fromPrtypeList = []
            this.clearEmp()
            this.$message.success('替换数据成功！')
            this.queryTableData()
          } else {
            throw result.data.msg
          }
        })
        .catch(this.$showError)
    },
    /**
     * @description: 替换 取消
     */
    replaceModalCancel() {
      this.replaceModalVisible = false
      //清空公式
      this.clearFormula()
    },
    /**
     * @description: 替换功能radio改变
     */
    onReplaceRadioChange(e){
      this.replaceRadioValue = e.target.value
    },
    /**
     * @description: 目标工资项change
     */
    salaryProjectTargetChange(value) {
      // console.log(value)
      this.targetPrtypeList = value
    },
    /**
     * @description: 来源工资项change
     */
    salaryProjectFromChange(value) {
      this.fromPrtypeList = value
    },
    /**
     * @description: 显示导入弹窗
     */
    showImportModal() {
      if (this.prtypeCode === '*') {
        this.$message.warning('请切换到详细工资类别')
        return
      }
      this.importLoading = true
      //检查当前工资类别是否是编辑状态
      this.$axios
        .post(baseUrl+ '/prs/prscalcdata/checkPayEditState', {
          flag: 'CALCBZ',
          prtypeCodes: [this.prtypeCode]
        })
        .then(result => {
          if (result.data.flag != 'fail') {
            //获取导入格式数据
            return this.$axios.post(baseUrl+ '/prs/base/prsExcelStyleCo/searchPrsExcelStyleCo', {
              rgCode: this.pfData.svRgCode,
              setYear: this.pfData.svSetYear,
              agencyCode: this.getAgencyCode()
            })
          } else {
            throw result.data.msg
          }
        })
        .then(result => {
          if (result.data.flag != 'fail') {
            if(!result.data.data||result.data.data.length === 0){
              throw '请设置工资导入格式'
            }
            result.data.data.forEach(item => {
              if (item.matchitem === '1') {
                item.matchitemStr = '姓名'
              }else if(item.matchitem === '2'){
                item.matchitemStr = '人员编号'
              }else if(item.matchitem === '3') {
                item.matchitemStr = '身份证'
              }
              if (item.isNeedCalc === 'Y') {
                item.isNeedCalcStr = '是'
              } else {
                item.isNeedCalcStr = '否'
              }
            })
            this.importLoading = false
            this.importFormatData = result.data.data
            this.importModalVisible = true
          } else {
            throw result.data.msg
          }
        })
        .catch(error=>{
          this.importLoading = false
          this.importModalVisible = false
          this.$message.error(error)
        })
    },
    /**
     * @description: 导入模态窗口 点击选择文件
     */
    onClickSelectFile(e) {
      this.importFileName = e.target.files[0].name
      this.importFileName.split('.').forEach((item,index,arr) =>{
        if(index === arr.length-1){
          this.suffix = '.'+item
        }
      })
      if(this.suffix!='.xls'&&this.suffix!='.xlsx'){
        this.$message.warning('仅支持导入.xls和.xlsx格式的文件')
      }
    },
    /**
     * @description: 单选按钮事件
     */
    radioChangeEvent({ row }) {
      this.selectFormatRow = row
    },
    /**
     * @description: 导入
     */
    onClickImport() {
      if (!this.selectFormatRow) {
        this.$message.warning('请选择导入格式')
        return
      }
      if (!this.importFileName) {
        this.$message.warning('请选择要导入的文件')
        return
      }
      if(this.suffix!='.xls'&&this.suffix!='.xlsx'){
        this.$message.warning('仅支持导入.xls和.xlsx格式的文件')
        return
      }
      this.importModalLoading = true
      this.$showLoading()
      let that = this
      this.$axios({
        url: baseUrl+ '/prs/prscalcdata/uploadExcel',
        method: 'post',
        data: new FormData(this.$refs.excelFileFrom)
      })
        .then(result => {
          this.importModalLoading = false
          this.$hideLoading()
          if (result.data.flag === 'success') {
            if (result.data.msg === '格式错误') {
              // this.$message.error(result.data.msg)
              throw result.data.msg
            } else {
              let res = result.data.data
              if(res.isErrImport){
                const h = this.$createElement;
                //弹出窗口提示是否下载错误数据
                this.$confirm({
                  title: res.successMsg,
                  content: h('div', {}, [
                    h('p', res.sameMsg),
                    h('p', res.notInMsg),
                    h('p', '是否将错误数据导出？'),
                  ]),
                  okText: '确定',
                  cancelText: '取消',
                  onOk: c => { 
                    //导出
                    window.location.href = '/pub/file/download?fileName=' + res.fileName + '&attachGuid=' + res.attachGuid;
                    that.queryTableData()
                    that.importModalCancel()
                    c()
                  },
                  onCancel: c =>{ 
                    //点击取消 要将上一层的窗口也关闭
                    that.queryTableData()
                    that.importModalCancel()
                    c()
                  }
                })
              }else{
                this.$message.success(result.data.msg)
                this.queryTableData()
                this.importModalCancel()
              }
            }
          } else {
            throw result.data.msg
          }
        })
        .catch(error =>{
          console.log(error)
          this.importModalLoading = false
          this.$hideLoading()
          // this.$message.error(error)
          this.$error({
            title: '导入失败',
            content: error,
            okText: '确定'
          })
        })
        // this.uploadExcelCollect()
    },
    /**
     * @description: 导入取消
     */
    importModalCancel() {
      this.importModalVisible = false
      this.importFileName = ''
      this.selectFormatRow = null
      this.$refs.excelFile.value = ''
    },
    /**
     * @description: 点击计算
     */
    onClickCalc() {
      let param = {}
      let obj = {}
      let { fullData } = this.$refs.xTable.getTableData()
      fullData.forEach(item => {
        if(!item.LASTROW){
          param[item.PRTYPE_CODE] = ''
          if(obj[item.PRTYPE_CODE]&& (obj[item.PRTYPE_CODE] instanceof Array)){
            obj[item.PRTYPE_CODE].push(item.EMP_UID)
          }else{
            obj[item.PRTYPE_CODE] = []
          }
        }
      })
      for (let prop in param) {
        param[prop] = obj[prop].join(',')
      }
      this.$axios
        .post(baseUrl+ '/prs/prscalcdata/calcPrsCalcData', param)
        .then(result => {
          if (result.data.flag != 'success') {
            this.queryTableData()
            throw result.data.msg
          } else {
            if(result.data.msg==='计算成功！'||result.data.msg==='计算成功!'){
              this.$message.success(result.data.msg)
            }else{
              this.$success({content: result.data.msg, okText: '确定'})
            }
            this.queryTableData()
          }
        })
        .catch(this.$showError)
    },
    /**
     * @description: 点击保存
     */
    onClickSave(callBack, hideTip) {
      this.$showLoading()
      //组织编辑参数数据
      let prsCalcDatas = this.getNoSaveData()
      // if(prsCalcDatas.length===0){
      //   this.$hideLoading()
      //   this.$message.warning('没有改变的数据');
      //   return false;
      // }
      let param = {
        prsCalcDatas: prsCalcDatas
      }
      this.$axios
        .post(baseUrl+ '/prs/prscalcdata/updateCalcDatasItem', param)
        .then(result => {
          this.saveFlag = true
          if (result.data.flag != 'success') {
            throw result.data.msg
          } else {
            if(!hideTip){
              this.$message.success(result.data.msg)
            }
            callBack()
          }
        })
        .catch(this.$showError)
    },
    /**
     * @description: 点击记录明细的保存
     */
    onClickEmpDetailSave(callBack, hideLoading) {
      if(!hideLoading){ this.$showLoading() }
      //组织编辑参数数据
      let prsCalcDatas = this.getEmpDetailNoSaveData()
      let param = {
        prsCalcDatas: prsCalcDatas
      }
      this.$axios
        .post(baseUrl+ '/prs/prscalcdata/updateCalcDatasItem', param)
        .then(result => {
          if (result.data.flag != 'success') {
            throw result.data.msg
          } else {
            this.saveState = true
            this.$message.success(result.data.msg) 
            if(callBack&&typeof(callBack)==='function'){
              callBack(hideLoading)
              if(!hideLoading){
                this.empDetailModalVisible = false
              }
            }else{
              this.$hideLoading()
            }
          }
        })
        .catch(this.$showError)
    },
    /**
     * @description: 获取未保存的状态
     */
    getNoSaveState(callBack){
      setTimeout(()=>{
        if(!this.$refs.xTable){
          callBack(false)
        }else{
          let flag = false
          let { fullData } = this.$refs.xTable.getTableData()
          fullData.forEach((item) => {
            this.tableRecords.forEach((it) => {
              if (item.EMP_UID === it.EMP_UID && item.PRTYPE_CODE === it.PRTYPE_CODE&&!item.LASTROW&&!it.LASTROW) {
                for (let prop in item) {
                  if (prop.indexOf('PR_PAYLIST_N') > -1) {
                    if (item[prop] != it[prop]) {
                      flag = true
                    }
                  }
                }
              }
            })
          })
          callBack(flag)
        }
      }, 0)
    },
    /**
     * @description: 获取上报和审核状态的数据
     */
    getPostStateData(){
      let prsCalcDatas = []
      this.tableData.forEach(item => {
        //如果item的属性值为上报和审核
        if(item.PAY_EDIT_STAT != '1' && !item.LASTROW){
          prsCalcDatas.push(item)
        }
      })
      return prsCalcDatas
    },
    /**
     * @description: 获取未保存的数据
     */
    getNoSaveData() {
      let prsCalcDatas = []
      let { fullData } = this.$refs.xTable.getTableData()
      fullData.forEach(item => {
        let obj = {
          prtypeCode: item.PRTYPE_CODE,
          empUid: item.EMP_UID,
          calcStat: 'N'
        }
        let flag = false
        //与保存记录的数据对照
        this.tableRecords.forEach(it => {
          if (item.EMP_UID === it.EMP_UID && item.PRTYPE_CODE === it.PRTYPE_CODE&&!item.LASTROW&&!it.LASTROW) {
            for (let prop in item) {
              if (prop.indexOf('PR_PAYLIST_N') > -1 && item[prop] != it[prop]) {
                flag = true
                obj[prop] = Number(item[prop]).toFixed(2)
              }
            }
          }
        })
        if(flag){
          prsCalcDatas.push(obj)
        }
      })
      return prsCalcDatas
    },
    /**
     * @description: 获取记录明细编辑表格是否编辑过的状态
     * @return Boolean
     */
    getEmpDetailNoSaveState(){
      if(!this.$refs.empDetailGrid){
        return false
      }else{
        if(this.saveState){
          return false
        }else{
          let flag = false
          this.empDetailData.forEach((item) => {
            this.tableRecords.forEach((it) => {
              if (item.empUid === it.EMP_UID && item.prtypeCode === it.PRTYPE_CODE) {
                if(item.field.indexOf('PR_PAYLIST_N') > -1){
                  if (item.value != it[item.field]) {
                    flag = true
                  }
                }
              }
            })
          })
          return flag
        }
      }
    },
    /**
     * @description: 获取记录明细编辑表格未保存的数据
     */
    getEmpDetailNoSaveData() {
      let prsCalcDatas = []
      let updateRecords = this.$refs.empDetailGrid.getRecordset().updateRecords
      //对比两个表格内容数据 empUid一致的情况下（同一行）找到哪个数据发生了变化
      updateRecords.forEach(item => {
        let obj = {
          prtypeCode: item.prtypeCode,
          empUid: item.empUid,
          calcStat: 'N'
        }
        this.tableRecords.forEach(it => {
          if (item.empUid === it.EMP_UID && item.prtypeCode === it.PRTYPE_CODE) {
            for (let prop in item) {
              if (item.field.indexOf('PR_PAYLIST_N') > -1) {
                if (item.value != it[item.field]) {
                  obj[item.field] = Number(item.value).toFixed(2)
                }
              }
            }
          }
        })
        prsCalcDatas.push(obj)
      })
      return prsCalcDatas
    },
    /**
     * @description: 根据选择的tab查询表格数据
     */
    queryTableData(hideLoading) {
      if (this.prtypeCode === '*') {
        //显示全部工资编制
        this.getTableData(this.prtypeCodes, hideLoading)
      } else {
        this.getTableData([this.prtypeCode], hideLoading)
      }
    },
    /**
     * @description: 点击提交
     */
    onClickCommit() {
      let that = this
      this.$confirm({
        title: '您确定要提交吗?提交之后的数据将无法编辑',
        content: '',
        okText: '确定',
        cancelText: '取消',
        onOk() {
          //判断是否有编辑状态中的数据
          if (that.getNoSaveData().length > 0) {
            that.$message.warning('有未经计算的数据，请计算后再提交')
            return
          }
          //判断请求回来的表格数据是否有未经计算的
          let flag = false
          //提交由于传输的是工资类别 也就是会提交该工资类别下所有数据 所以需要在全部数据中计算
          that.tableData.forEach(item => {
            if (!item.LASTROW&&(item.CALC_STAT != 'Y' || item.PAY_EDIT_STAT != '1')) {
              flag = true
            }
          })
          if (flag) {
            that.$message.warning('有未经计算或不可编辑状态的数据，不可提交')
            return
          }

          let prtypeCodes = []
          if (that.prtypeCode != '*') {
            prtypeCodes = [that.prtypeCode]
          }
          let param = {
            payEditStat: '2',
            prtypeCodes: prtypeCodes,
            flag: 'CALCBZ'
          }
          that.$axios
            .post(baseUrl+ '/prs/prscalcdata/updateCalcDatas', param)
            .then(result => {
              if (result.data.flag != 'success') {
                throw result.data.msg
              } else {
                that.$message.success(result.data.msg)
                that.queryTableData()
              }
            })
            .catch(that.$showError)
        },
        onCancel() {}
      })
    },
    /**
     * @description: 点击调栏按钮
     */
    setCols() {
      this.setColsModalVisible = true
    },
    /**
     * @description: 调栏窗口取消
     */
    setColsModalCancel() {
      this.setColsModalVisible = false
    },
    /**
     * @description: 单元格激活事件 禁用某些单元格
     */
    activeCellMethod({ row, column }) {
      if(row.LASTROW){
        return false
      }
      if(column.own.isEditable === 'Y' && row.PAY_EDIT_STAT === '1'){
        return true
      }else{
        return false
      }
    },
    /**
     * @description: 显示选择人员弹窗
     */
    showEmpDetail({ row, rowIndex }, type) {
      let that = this
      if(type === 'open'){
        todo()
      }else{
        if(this.getEmpDetailNoSaveState()){
          //切换的情况
          this.onClickEmpDetailSave(this.queryTableData, true)
          this.$nextTick(()=>{
            todo()
          })
        }else{
          todo()
        }
      }
      function todo(){
        that.saveState = false
        that.rowIndex = rowIndex
        let empDetailData = []
        // row需要根据showColumns重新排列
        that.setColumns.forEach(item =>{
          for (let prop in row) {
            if (prop.indexOf('PR_PAYLIST_N') > -1) {
              if(item.field == prop){
                let obj = {}
                obj.columnName = item.title
                obj.field = prop
                obj.value = row[prop]
                obj.payEditStat = row.PAY_EDIT_STAT
                // row.prsCalcItems?obj.prsCalcItems = row.prsCalcItems : false
                obj.empUid = row.EMP_UID
                obj.prtypeCode = row.PRTYPE_CODE
                //列属性
                obj.isDifferentColor = item.isDifferentColor
                obj.isHighLight = item.isHighLight
                obj.isEditable = item.isEditable
                empDetailData.push(obj)
              }
            }
            that.$set(that.empDetailObj, prop, row[prop])
          }
        })
        that.empDetailData = empDetailData
        that.empDetailModalVisible = true
      }
    },
    empDetailActiveCellMethod({ row }) {
      if( row.isEditable === 'Y' && row.payEditStat === '1'){
        return true
      }else{
        return false
      }
    },
    /**
     * @description: 记录明细取消
     */
    empDetailModalCancel() {
      this.empDetailModalVisible = false
    },
    /**
     * @description: 行样式
     */
    rowStyle({ row }){
      if(row.LASTROW){
        return {
          color: '#333',
          fontWeight: 'bold',
          backgroundColor: '#EEEEEE'
        }
      }
    },
    /**
     * @description: 单元格样式
     */
    cellStyle({ row, column }) {
      let key = column.property+'_TAG', obj = {}
      if(column.own.isDifferentColor == 'Y'&&row[key]){
        obj.color = 'red'
      }
      if(column.own.isHighLight === 'Y'){
        obj.backgroundColor = '#99CCFF'
      }
      return obj
    },
    /**
     * @description: 公式编辑器关闭监听
     */
    formulaEditorClose(){
      this.formulaEditorVisible = false
    },
    /**
     * @description: 进度条窗口关闭
     */
    // prograssModalClose(res){
    //   this.prograssModalVisible = false
    //   if(res==='success'){
    //     this.importModalVisible = false
    //   }
    //   setTimeout(()=>{
    //     this.importPercent = 0
    //     this.importStatus = 'active'
    //     this.importMsg = ''
    //   },300)
    // },
    /**
     * @description: 轮询 获取导入进度
     */
    // uploadExcelCollect(){
    //   this.prograssModalVisible = true
    //   let timer = setInterval(()=>{
    //     this.$axios.get('prs/prscalcdata/uploadExcelCollect/'+ this.getAgencyCode()).then(result =>{
    //       if(result.data.flag==='success'){
    //         let flag = result.data.data.flag, msg = result.data.data.msg
    //         this.importPercent = result.data.data.rateVal
    //         if(flag === 'CONDUCT'){
    //           this.importMsg = msg
    //           this.importStatus = 'active'
    //           //继续查询
    //         }else if(flag === 'FINISH'){
    //           //停止查询
    //           this.importMsg = msg
    //           this.importStatus = 'success'
    //           setTimeout(()=>{
    //             this.prograssModalVisible = false
    //             this.queryTableData()
    //             clearInterval(timer)
    //           },1000)
    //         }else if(flag === 'FAIL'){
    //           // 返回错误原因
    //           throw msg
    //         }else{
    //           //处理同fail
    //           throw msg
    //         }
    //       }else{
    //         throw result.data.msg
    //       }
    //     }).catch(error=>{
    //       if(!error) { error = '服务器错误'}
    //       //停止查询
    //       this.importMsg = error
    //       this.importStatus = 'exception'
    //       clearInterval(timer)
    //     })
    //   },5000)
    // },
    /**
     * @description: 点击确定 保存后切换tab
     */
    confirm3HandleOk(){
      this.confirm3Loading = true
      this.$axios
        .post(baseUrl+ '/prs/prscalcdata/checkPayEditState', {
          flag: 'CALCBZ',
          prtypeCodes: [this.prtypeCode]
        })
        .then(result => {
          if (result.data.flag != 'fail') {
            this.onClickSave(()=>{
              this.tabIndex = this.clickedTabItem.current
              this.prtypeCode = this.clickedTabItem.prtypeCode
              this.fromPrtypeCode = this.clickedTabItem.prtypeCode
              this.mo = this.clickedTabItem.mo
              this.payNoMo = this.clickedTabItem.payNoMo
              if (this.clickedTabItem.prtypeCode === '*') {
                this.getTableData(this.prtypeCodes)
              } else {
                this.getTableData([this.clickedTabItem.prtypeCode])
              }
              this.confirm3Loading = false
              this.confirm3Visible = false
            })
          } else {
            this.confirm3Loading = false
            this.confirm3Visible = false
            this.$message.error('存在非编辑状态数据，无法进行保存')
          }
        })
        .catch(this.$showError)
    },
    /**
     * @description: 点击否No 不保存继续切换tab
     */
    confirm3HandleNo(){
      this.confirm3Loading = true
      this.tabIndex = this.clickedTabItem.current
      this.prtypeCode = this.clickedTabItem.prtypeCode
      this.fromPrtypeCode = this.clickedTabItem.prtypeCode
      this.mo = this.clickedTabItem.mo
      this.payNoMo = this.clickedTabItem.payNoMo
      if (this.clickedTabItem.prtypeCode === '*') {
        this.getTableData(this.prtypeCodes)
      } else {
        this.getTableData([this.clickedTabItem.prtypeCode])
      }
      this.confirm3Loading = false
      this.confirm3Visible = false
    },
    /**
     * @description: 点击取消 不保存 不切换tab 点击右上角关闭 同取消处理
     */
    confirm3HandleCancel(){
      this.confirm3Visible = false
      this.confirm3Loading = false
    },
    /**
     * @description: 键盘导航 对按键监听过滤
     */
    editMethod ({ row, column }) {
      if(row.LASTROW){
        return false
      }
      if(column.own.isEditable === 'Y' && row.PAY_EDIT_STAT === '1'){
        return true
      }else{
        return false
      }
    },
    /**
     * @description: 键盘导航 对按键监听过滤
     */
    empEditMethod({ row, column }){
      this.$refs.empDetailGrid.setSelectCell(row, column.property)
      if(row.isEditable === 'Y' && row.payEditStat === '1'){
        return true
      }else{
        return false
      }
    }
  }
}
</script>
<style>
.ufTreeSelectWrap{
    max-width: 100% !important;
}
</style>
<style lang="scss" scoped>
@import '@/assets/styles/variable.scss';
.toolBar {
  height: 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #ddd;
  margin-top: 4px;
}
.searchInput{
  width: 200px;
  height: 30px;
  margin-right: 5px;
  border-right: 0
}
.searchButton{
  box-sizing: border-box;
  padding-top: 5px;
  cursor: pointer;
}
.toolBarBtn {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.showMo {
  color: #999;
}

.xtable {
  margin-top: 5px;
}
.modalTitle {
  font-size: 14px;
  font-weight: bold;
  border-left: 4px solid $uf-primary-color;
  line-height: 14px;
  padding-left: 4px;
}
.a-row {
  padding: 0 10px;
}
.file-upload-input {
  width: 100%;
  height: 100%;
  background: transparent;
  z-index: 999;
  opacity: 0;
  cursor: pointer;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
}
.empInputWrap {
  width: 100%;
  padding: 0 10px;
  box-sizing: border-box;
  height: 32px;
  border-radius: $pf-border-radius;
  border: 1px solid #d9d9d9;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.empInput {
  width: 640px;
  height: 32px;
  line-height: 32px;
  text-align: left;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  background: transparent;
  outline: none;
  border: none;
  user-select: none;
}
.empInputClear {
  width: 14px;
  height: 14px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 7px;
  cursor: pointer;
}
.formulaTextarea{
  padding: 10px;
  height: 76px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  user-select: none;
  box-sizing: border-box;
}
.blod{
  font-weight: bold;
}
.ant-input-group > .ant-input-affix-wrapper:not(:last-child) .ant-input {
    border-right: 0;
    outline: none;
}
</style>
