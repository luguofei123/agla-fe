<!--
 * @Author: sunch
 * @Date: 2020-07-18 16:26:08
 * @LastEditTime: 2020-08-26 17:01:15
 * @LastEditors: Please set LastEditors
 * @Description: 人员工资类别
 * @FilePath: /agla-fe-8.50/vuedev/src/views/prs/empPrsType/empPrsType.vue
-->
<template>
  <div class="page">
    <!-- 头部开始 -->
    <ufHeader :title="title">
      <template slot="btns">
        <a-button type="primary" class="mr-5" :class="getBtnPer('btn-add')" @click="showDepartBudgetModal">批量设置</a-button>
      </template>
    </ufHeader>

    <div class="container-page">
      <div class="leftWrap">
        <OrgTreeLeftBox class="mt-8" :showFooter="false" @change="orgCodesChange"></OrgTreeLeftBox>
      </div>
      <div class="mainWrap">
        <!-- 查询条件开始 -->
        <ufQueryArea class="mt-8">
          <div class="qryRow">
            <div style="margin-right: 144px;">
              <div class="flex-start" v-if="frmQueryList.length > 0">
                <div v-if="frmQueryList[0]" class="flex-start">
                  <div class="label" :title="frmQueryList[0].propertyName">{{ frmQueryList[0].propertyName + '：' }}</div>
                  <dynamic-link :data="frmQueryList[0]" :type="frmQueryList[0].dataType" @change="dynamicTplValChange"></dynamic-link>
                </div>
                <div v-if="frmQueryList[1]" class="flex-start ml-50">
                  <div class="label" :title="frmQueryList[1].propertyName">{{ frmQueryList[1].propertyName + '：' }}</div>
                  <dynamic-link :data="frmQueryList[1]" :type="frmQueryList[1].dataType" @change="dynamicTplValChange"></dynamic-link>
                </div>
              </div>
              <div v-else style="height: 30px;"></div>
            </div>

            <div class="qryBtns flex-start">
              <ufMoreBtn class="mr-10" @change="moreBtnChange"></ufMoreBtn>
              <a-button :class="getBtnPer('btn-query')" type="primary" @click="getTableData">查询</a-button>
            </div>
          </div>
          <div v-if="showMoreQuery && queryMoreList.length > 0">
            <div class="qryMoreRow flex-start mt-10" v-for="index in queryMoreRowLen" :key="index">
              <div v-for="(item, ind) in moreQryItems(index)" :key="item.propertyCode" class="flex-start" :class="ind > 0 ? 'ml-50' : ''">
                <div class="label" :title="item.propertyName">{{ item.propertyName + '：' }}</div>
                <dynamic-link :data="item" :type="item.dataType" @change="dynamicTplValChange"></dynamic-link>
              </div>
            </div>
          </div>
        </ufQueryArea>
        <!-- 查询条件结束 -->

        <div class="toolbar">
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

        <!-- 表格开始 :data="tableData" -->
        <vxe-grid
          border
          stripe
          resizable
          head-align="center"
          :height="tableH"
          show-header-overflow
          show-overflow
          size="mini"
          ref="xTable"
          :auto-resize="true"
          class="xtable mytable-scrollbar"
          :columns="columns"
          :highlight-hover-row="true"
          :toolbar="{ id: 'empPrsType', resizable: { storage: true } }"
        >
          <template v-slot:editEmpName="record">
            <div class="jump-link" @click="linkToEdit(record.row)">
              {{ record.row.empName }}
            </div>
          </template>
        </vxe-grid>
        <!-- 表格结束 -->

        <!-- 隐藏的表格 用来导出 :data="tableData" begin -->
        <vxe-grid
          v-if="openExport"
          style="width: 9999px;"
          height="99999"
          show-overflow
          show-header-overflow
          ref="xTableHide"
          class="tableHide"
          :columns="columns"
        >
        </vxe-grid>
        <!-- 隐藏的表格 用来导出 end -->

        <!-- 自定义分页器开始 -->
        <ufPager :pager-config="page" @page-change="handlePageChange"></ufPager>
        <!-- 自定义分页器结束 -->
      </div>
    </div>
    <addPrsType :value="showAddPrsType" :empCode="selectEmpCode" :rmwyid="selectRmwyid" @close="addPrsTypeClose"></addPrsType>
    <departBudget :value="showDepartBudget" :rmwyidList="rmwyidList" @close="departBudgetClose"></departBudget>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import XLSX from 'xlsx'
import { saveAs } from 'file-saver';
import OrgTreeLeftBox from '@/components/OrgTreeLeftBox'
import addPrsType from './components/addPrsType'
import departBudget from './components/departBudget'
import dynamicLink from './components/dynamicLink'
import { getBtnPer, getPdf, download } from '@/assets/js/util'
import { defaultColumns } from './empPrsType'

export default {
  name: 'empPrsType',
  data() {
    return {
      tableH: 300,
      title: '人员工资类别',
      showMoreQuery: false, //是否显示更多查询查询内容
      showAddPrsType: false,
      showDepartBudget: false,
      defaultColumns,
      moveColumns: [], //动态列
      tableData: [], //表格数据
      /* 分页配置 */
      page: {
        tableName: 'empPrsType',
        currentPage: 1,
        pageSize: 50,
        pageSizes: [10, 20, 30, 50, 100, '全部'],
        total: 0,
      },
      /* 分页 */
      currentPage: 1,
      pageSize: 50,
      orgCodes: [],
      selectEmpCode: '',
      selectRmwyid: '',
      rmwyidList: [],
      frmQueryList: [],
      queryMoreList: [],
      queryForm: {},
      dataConfig: {},
      typeCodeList: [], //人员身份列表
      openExport: false
    }
  },
  components: {
    OrgTreeLeftBox,
    addPrsType,
    departBudget,
    'dynamic-link': dynamicLink,
  },
  watch: {
    /**
     * @description: 选择的部门改变 刷新表格数据
     */
    orgCodes(orgCodes) {
      this.getData()
    },
  },
  created() {
    this.tableH = this.containerH - 210
    this.getData()
  },
  computed: {
    ...mapState({
      pfData: (state) => state.pfData,
      containerH: (state) => state.containerH,
    }),
    columns() {
      return this.defaultColumns.concat(this.moveColumns)
    },
    queryMoreRowLen() {
      if (this.queryMoreList.length > 0) {
        if (this.queryMoreList.length < 3) {
          return 1
        } else {
          return Math.ceil(this.queryMoreList.length / 2)
        }
      } else {
        return 0
      }
    },
  },
  methods: {
    getBtnPer,
    moreQryItems(index) {
      let ind1 = index * 2 - 2,
        ind2 = index * 2,
        moreQryItems = this.queryMoreList.slice(ind1, ind2)
      return moreQryItems
    },
    /**
     * @description: 打印
     */
    print() {},
    /**
     * @description: 导出工具 
     */
    toBuffer (wbout) {
      let buf = new ArrayBuffer(wbout.length)
      let view = new Uint8Array(buf)
      for (let index = 0; index !== wbout.length; ++index) view[index] = wbout.charCodeAt(index) & 0xFF
      return buf
    },
    /**
     * @description: 导出
     */
    exportEvent () {
      if(this.openExport === true){
        return
      }
      this.$showLoading()
      this.openExport = true
      setTimeout(()=>{
        this.$nextTick(() => {
          this.$refs.xTableHide.reloadData(this.tableData)
        })
        setTimeout(() => {
          let table = this.$refs.xTableHide.$el.querySelector('.vxe-table--main-wrapper')
          let book = XLSX.utils.book_new()
          let sheet = XLSX.utils.table_to_sheet(table, { raw: true })
          XLSX.utils.book_append_sheet(book, sheet)
          let wbout = XLSX.write(book, { bookType: 'xlsx', bookSST: false, type: 'binary' })
          let blob = new Blob([this.toBuffer(wbout)], { type: 'application/octet-stream' })
          // 保存导出
          saveAs(blob, '人员工资类别导出.xlsx',)
          this.openExport = false
          this.$hideLoading()
        }, 500)
      }, 500)
    },
    /**
     * @description: 编辑
     */
    linkToEdit(row) {
      this.showAddPrsType = true
      this.selectEmpCode = row.empCode
      this.selectRmwyid = row.rmwyid
    },
    /**
     * @description: 更多按钮改变
     */
    moreBtnChange(val) {
      this.showMoreQuery = val
    },
    /**
     * @description: 获取列
     */
    getColumns() {
      return this.$axios.get('/ma/emp/maEmpProperty/getPropertyInList', { params: { roleId: this.pfData.svRoleId } })
    },
    /**
     * @description: 获取表体数据
     */
    getTableData(hideLoading) {
      if (!hideLoading) this.$showLoading()
      let argu = {
        agencyCode: this.pfData.svAgencyCode,
        orgCodeList: this.orgCodes,
        rgCode: this.pfData.svRgCode,
        setYear: this.pfData.svSetYear,
      }
      this.currentPage ? (argu.pageNum = this.currentPage) : false
      this.pageSize ? (argu.pageSize = this.pageSize) : false
      for (let prop in this.queryForm) {
        // console.log(prop)
        argu[prop] = this.queryForm[prop]
      }
      return this.$axios
        .post('/ma/emp/maEmp/getMaEmpByOrgCodes?roleId=' + this.pfData.svRoleId, argu)
        .then((result) => {
          if (!hideLoading) this.$hideLoading()
          if (result.data.flag === 'success') {
            this.page.total = result.data.data.page.total
            let data = result.data.data.page.list
            data.forEach(item => {
              for(let prop in item){
                //重组数据属性
                let arr = this.dataConfig[prop]
                if(arr&&arr.length>0){
                  let valArr = arr.filter(it => {
                    return it.valId === String(item[prop])
                  })
                  if(valArr&&valArr.length > 0){
                    item[prop] = valArr[0].val
                  }
                }
                //重组人员身份
                if(this.typeCodeList.length > 0&&prop==='typeCode'){
                  let valArr = this.typeCodeList.filter(it => {
                    return it.code === item.typeCode
                  })
                  if(valArr&&valArr.length > 0){
                    item.typeCode = valArr[0].name
                  }
                }
              }
            })
            this.tableData = data
            this.$refs.xTable.reloadData(this.tableData)
          } else {
            throw result.data.msg
          }
        })
        .catch(this.$showError)
    },
    /**
     * @description: 获取表格列和数据
     */
    getData() {
      this.$showLoading()
      this.getColumns()
        .then((result) => {
          if (result.data.flag === 'success') {
            this.moveColumns = []
            result.data.data.forEach((item) => {
              let len = item.PROPERTY_NAME.length
              let col = {
                field: item.PROPERTY_CODE,
                title: item.PROPERTY_NAME,
                minWidth: 60 + (len < 8 ? len * 14 : len * 16),
                headerAlign: 'center',
                align: 'left',
              }
              if (item.PROPERTY_CODE === 'empName') {
                col.slots = { default: 'editEmpName' }
              }
              this.moveColumns.push(col)
            })
            //查询表体数据
            // this.getTableData(true)
            //继续向下进行 初始化查询条件
            return new Promise((resolve, reject) => {
              this.$axios.get('/ma/emp/maEmp/selectMaEmpAndPrsCalcData?roleId=' + this.pfData.svRoleId).then((res1) => {
                if (res1.data.flag === 'fail') {
                  reject(res1.data.msg)
                }
                resolve({ propertyInList: result.data.data, maEmpAndPrsCalcData: res1.data.data })
              })
            })
          } else {
            throw result.data.msg
          }
        })
        .then(({ propertyInList, maEmpAndPrsCalcData }) => {
          //获取人员身份
          return new Promise((resolve, reject) => {
            this.$axios.get('/ma/ele/emptype/selectEmpType', { params: { roleId: this.pfData.svRoleId, agencyCode: this.pfData.svAgencyCode }})
            .then(result => {
              if(result.data.flag === 'success'){
                let typeCodeList = result.data.data.map(item => {
                  return {id: item.chrCode, pId: item.parentCode, code: item.chrCode, codeName: item.chrName, name: item.chrName, isLeaf: item.isLeaf }
                })
                this.typeCodeList = typeCodeList
                console.log(typeCodeList)
                resolve({ propertyInList, maEmpAndPrsCalcData, typeCodeList })
              }else{
                reject(result.data.msg)
              }
            })
          })
        }).then(({propertyInList, maEmpAndPrsCalcData, typeCodeList}) => {
          propertyInList.unshift({
            PROPERTY_CODE: 'typeCode',
            IS_CONDITION: 'y',
            PROPERTY_NAME: '人员身份',
          })
          let queryCondition = [
            {
              dataType: 'E',
              isEmpty: 'N',
              isEdit: 'Y',
              ordIndex: '0',
              propertyCode: 'typeCode',
              propertyName: '人员身份',
              asValList: typeCodeList,
            },
          ]
          propertyInList.forEach((item) => {
            if (item['IS_CONDITION'] === 'y') {
              if (item['PROPERTY_CODE'] === 'birthday') {
                this.queryForm['birthdayStart'] = ''
                this.queryForm['birthdayEnd'] = ''
              } else if(item['PROPERTY_CODE'] === 'typeCode'){
                this.queryForm['typeCode'] = []
              }else {
                this.queryForm[item['PROPERTY_CODE']] = ''
              }
              maEmpAndPrsCalcData[0].data.forEach((it) => {
                if (it.propertyCode === item['PROPERTY_CODE']) {
                  queryCondition.push(it)
                }
              })
            }
          })
          this.frmQueryList = queryCondition.slice(0, 2)
          this.queryMoreList = queryCondition.slice(2)
          let obj = {}
          maEmpAndPrsCalcData[0].data.forEach(item => {
            if(item.asValList&&item.asValList.length > 0){
              obj[item['propertyCode']] = item.asValList
            }
          })
          this.dataConfig = obj
          this.getTableData()
        })
        .catch(this.$showError)
    },
    /**
     * @description: 页数改变
     */
    handlePageChange({ currentPage, pageSize }) {
      if (pageSize === '全部') {
        // this.currentPage = 1
        // this.pageSize = 999999999
        this.currentPage = ''
        this.pageSize = ''
      } else {
        this.currentPage = currentPage
        this.pageSize = pageSize
      }
      this.getTableData()
    },
    /**
     * @description: 部门编码改变
     */
    orgCodesChange(orgCodes) {
      // console.log(orgCodes)
      this.orgCodes = orgCodes
    },
    /**
     * @description: 添加工资类别窗口关闭
     */
    addPrsTypeClose() {
      this.showAddPrsType = false
      this.getTableData()
    },
    /**
     * @description: 显示批量设置窗口
     */
    showDepartBudgetModal() {
      //获取勾选项
      let checkedRows = this.$refs.xTable.getCheckboxRecords()
      if (checkedRows.length === 0) {
        this.$message.warning('请选择人员数据')
        return
      }
      this.rmwyidList = checkedRows.map((item) => {
        return item.rmwyid
      })
      this.showDepartBudget = true
    },
    /**
     * @description: 关闭批量设置窗口
     */
    departBudgetClose() {
      this.showDepartBudget = false
      //刷新列表
      this.getTableData()
    },
    /**
     * @description: 
     */
    empTypeChange(val){
      console.log(val)
    },
    /**
     * @description: 动态模板组件的值改变
     */
    dynamicTplValChange(obj) {
      console.log(obj)
      if (obj.propertyCode === 'birthday') {
        this.queryForm['birthdayStart'] = obj.value[0]
        this.queryForm['birthdayEnd'] = obj.value[1]
      }else if(obj.propertyCode === 'typeCode'){
        this.queryForm['typeCode'] = obj.value
      } else {
        this.queryForm[obj.propertyCode] = obj.value
      }
    },
  },
}
</script>
<style lang="scss" scoped>
@import '@/assets/styles/variable.scss';
.mt-8 {
  margin-top: 8px;
}
.page {
  height: 100%;
}
.moreBtn {
  color: $uf-link-color;
}
.container-page {
  height: calc(100% - 56px);
  box-sizing: border-box;
}
.leftWrap {
  width: 240px;
  height: 100%;
  float: left;
}
.mainWrap {
  margin-left: 248px;
  overflow: hidden;
}
.flex-between {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.flex-start {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.flex-end {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
.addOrgBtn {
  color: #108ee9;
  font-size: 15px;
  display: flex;
  align-items: center;
  cursor: pointer;
}
.toolbar {
  padding: 8px 0 5px 0;
  display: flex;
  justify-content: flex-end;
}
.qryMoreRow {
  overflow: hidden;
  margin-right: 144px;
}
.qryRow {
  position: relative;
}
.qryBtns {
  position: absolute;
  top: 0;
  right: 0;
  min-width: 114px;
}
.label {
  width: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.ml-50 {
  margin-left: 50px;
}
</style>
