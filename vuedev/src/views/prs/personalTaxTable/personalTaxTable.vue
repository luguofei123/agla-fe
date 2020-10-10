<!--
 * @Author: sunch
 * @Date: 2020-05-09 14:35:55
 * @LastEditTime: 2020-08-21 12:36:19
 * @LastEditors: Please set LastEditors
 * @Description: 个人所得税扣缴申报表
 * @FilePath: /ufgov-vue/src/views/prs/personalTaxTable/personalTaxTable.vue
 -->
<template>
  <div>
    <!-- 头部开始 -->
    <ufHeader :title="title">
      <template slot="btns">
        <a-button class="mr-5" :class="getBtnPer('btn-print')" :loading="tempModalLoading" @click="print">打印</a-button>
        <a-button class="mr-5" :class="getBtnPer('btn-export')" @click="exportData">导出</a-button>
        <a-button class="mr-5" :class="getBtnPer('btn-setting')" @click="setting">所得税项目设置</a-button>
      </template>
    </ufHeader>

    <!-- 查询条件开始 -->
    <ufQueryArea class="mt-10">
      <a-row type="flex" justify="space-between" align="middle">
        <a-col :span="22">
          <span>申报月份：</span>
          <a-select v-if="declareMonth" :defaultValue="declareMonth" style="width: 60px" @change="declareMonthChange">
            <a-select-option :value="item" v-for="item in monthList" :key="item">{{ item }}</a-select-option>
          </a-select>
          <span class="ml-5">人员身份：</span>
          <a-tree-select
            v-if="identityList.length > 0"
            :maxTagPlaceholder="
              (v) => {
                return v.length
              }
            "
            :treeData="identityList"
            :treeDefaultExpandedKeys="['*']"
            :defaultValue="identityCodes"
            :maxTagCount="1"
            :dropdownClassName="'myscrollbar'"
            :dropdownStyle="{ 'max-height': '400px' }"
            style="min-width: 150px;max-width: 210px"
            @change="identityChange"
            multiple
            allowClear
            treeCheckable
            searchPlaceholder="请选择人员身份"
          >
          </a-tree-select>
          <span class="ml-5">工资类别：</span>
          <a-tree-select
            v-if="prtypeCodeList.length > 0"
            :maxTagPlaceholder="
              (v) => {
                return v.length
              }
            "
            :treeData="prtypeCodeList"
            :treeDefaultExpandedKeys="['*']"
            :defaultValue="prtypeCodes"
            :maxTagCount="1"
            :dropdownClassName="'myscrollbar'"
            :dropdownStyle="{ 'max-height': '400px' }"
            style="min-width: 100px;max-width: 210px"
            @change="prtypeCodeChange"
            multiple
            allowClear
            treeCheckable
            searchPlaceholder="请选择人员身份"
          >
          </a-tree-select>
          <span class="ml-5">是否居民：</span>
          <a-select :defaultValue="isResident" style="width: 80px" @change="isResidentChange">
            <a-select-option :value="item.value" v-for="item in isResidentList" :key="item.value">{{ item.label }}</a-select-option>
          </a-select>
          <span class="ml-5">部门：</span>
          <a-tree-select
            v-if="orgList.length > 0"
            :maxTagPlaceholder="
              (v) => {
                return v.length
              }
            "
            :treeData="orgList"
            :treeDefaultExpandedKeys="['*']"
            :defaultValue="orgCodes"
            :maxTagCount="1"
            :dropdownClassName="'myscrollbar'"
            :dropdownStyle="{ 'max-height': '400px' }"
            style="min-width: 150px;max-width: 260px"
            @change="orgCodeChange"
            multiple
            allowClear
            treeCheckable
            searchPlaceholder="请选择部门"
          >
          </a-tree-select>
        </a-col>
        <a-col :span="2" class="txt-r">
          <a-button :class="getBtnPer('btn-query')" type="primary" @click="query">查询</a-button>
        </a-col>
      </a-row>
    </ufQueryArea>
    <!-- 查询条件结束 -->

    <div class="toolBar">
      <ufTab :tabList="tabList" :tabIndex="tabIndex" :maxShowTabNum="6" @clickTabItem="onClickTabItem"></ufTab>
      <div class="toolBarBtn">
        <a-input-search style="width: 200px;height: 32px;margin-left: 10px;border-right: 0" allowClear ref="filterText" @change="onSearchChange" @search="onSearch" placeholder="搜索">
          <a-button class="flex-c-c" slot="enterButton" :showSearchLoading="showSearchLoading">
            <a-icon v-if="!showSearchLoading" style="padding-top: 5px;" ref="searchIcon" type="search" />
            <a-icon v-else style="padding-top: 5px;" ref="searchIcon" type="loading" />
          </a-button>
        </a-input-search>
      </div>
    </div>

    <!-- 表格开始 -->
    <vxe-grid
      border
      stripe
      resizable
      head-align="center"
      :height="tableH"
      show-overflow
      size="mini"
      ref="xTable"
      :auto-resize="true"
      class="xtable mytable-scrollbar"
      :columns="defaultColumns"
      :data="filterTableData"
      :highlight-hover-row="true"
      :row-style="rowStyle"
      :toolbar="{ id: 'personalTaxTable', resizable: { storage: true } }"
    >
    </vxe-grid>
    <!-- 表格结束 -->

    <!-- 自定义分页器开始 -->
    <ufPager :pager-config="page" @page-change="handlePageChange"></ufPager>
    <!-- 自定义分页器结束 -->

    <!-- 所得税项目设置弹窗 开始 -->
    <uf-modal title="所得税项目设置" v-model="settingModalVisible" @cancel="settingCancel" :width="900">
      <div class="settingMain">
        <div class="settingTree myscrollbar">
          <!-- :expandedKeys="expandedKeys"  v-model="checkedKeys" -->
          <a-tree v-if="treeData.length" :autoExpandParent="autoExpandParent" :treeData="treeData" @select="treeSelect">
            <template slot="title" slot-scope="{ title }">
              <!-- <span v-if="title.indexOf(searchText) > -1">{{title.substr(0, title.indexOf(searchText))}}<span style="color: #f50">{{searchText}}</span>{{title.substr(title.indexOf(searchText) + searchText.length)}}
              </span> -->
              <span>{{ title }}</span>
            </template>
          </a-tree>
        </div>
        <div class="settingRight">
          <div class="flex-row"><span>代码：</span><a-input style="width: 260px;margin-left: 10px;" v-model="settingCode" disabled /></div>
          <div class="flex-row mt-10"><span>名称：</span><a-input style="width: 260px;margin-left: 10px;" v-model="settingName" disabled /></div>
          <div class="flex-row mt-10">
            <span>关联工资项目：</span>
            <a-select allowClear style="width: 204px;margin-left: 10px;" v-model="settingProject" @change="settingProjectChange">
              <a-select-option v-for="item in prsItemCoList" :key="item.pritemCode" :value="item.pritemCode">
                {{ item.pritemName }}
              </a-select-option>
            </a-select>
          </div>
          <div class="flex-row mt-10"><span>备注：</span><a-input style="width: 260px;margin-left: 10px;" v-model="settingRemark" @change="settingRemarkChange(settingRemark)" placeholder="请输入备注" /></div>
        </div>
      </div>
      <template slot="footer">
        <a-button key="confirm" type="primary" class="mr-10" :loading="settingConfirmLoading" @click="settingConfirm">
          保存
        </a-button>
        <a-button key="close" @click="settingCancel">
          关闭
        </a-button>
      </template>
    </uf-modal>
    <!-- 所得税项目设置弹窗 结束 -->

    <!-- 打印 模板选择model 开始 -->
    <printTempSelectModal v-model="tempModal" :data="printTempls" @cancel="tempModal = false" @printModalConfirm="printModalConfirm"></printTempSelectModal>
    <!-- 打印 模板选择model 结束 -->
  </div>
</template>
<script>
import { mapState } from 'vuex'
import { construct } from '@aximario/json-tree'
import { getBtnPer, getPdf, download } from '@/assets/js/util'
import XEUtils from 'xe-utils'
import moment from 'moment'
import qs from 'qs'
import printTempSelectModal from '@/views/prs/components/printTempSelectModal'
import { defaultColumns } from './personalTaxTable'
import '@/render/filterRender'
import '@/render/cellRender'
const baseSearchProps = ['smo']
let searchProps = [].concat(baseSearchProps)
const allMonth = [
  { label: '1月', value: '1' },
  { label: '2月', value: '2' },
  { label: '3月', value: '3' },
  { label: '4月', value: '4' },
  { label: '5月', value: '5' },
  { label: '6月', value: '6' },
  { label: '7月', value: '7' },
  { label: '8月', value: '8' },
  { label: '9月', value: '9' },
  { label: '10月', value: '10' },
  { label: '11月', value: '11' },
  { label: '12月', value: '12' },
]

export default {
  name: 'personalTaxTable',
  data() {
    return {
      title: '个人所得税扣缴申报表', //页面标题
      /** tab部分  */
      tabList: [], //tab对象数组
      tabIndex: 0, //当前tab角标
      /** 搜索 */
      showSearchLoading: false,
      defaultColumns,
      filterText: '', //全表搜索框输入的内容{String}
      /** 表格以及分页 */
      tableData: [],
      page: {
        tableName: 'personalTaxTable',
        currentPage: 1,
        pageSize: 50,
        pageSizes: [10, 20, 30, 50, 100, '全部'],
        total: 0,
      },
      currentPage: 1,
      pageSize: 50,
      queryYear: '',
      allMonth,
      agencyCode: '',
      /** 所得税项目设置 */
      settingModalVisible: false, //设置弹窗是否显示
      settingConfirmLoading: false, //保存loading
      settingCode: '', //代码
      settingName: '', //名称
      settingRemark: '', //备注
      settingProject: '', //关联工资项目
      prsItemCoList: [], //关联工资项目列表
      /** 设置 树 */
      objCode: '',
      setList: [],
      treeData: [],
      autoExpandParent: true,
      /** 查询条件部分 */
      monthList: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'], //申报月份列表
      identityList: [], //人员身份列表
      prtypeCodeList: [], //工资类别列表
      isResidentList: [
        { label: '全部', value: '' },
        { label: '是', value: 'Y' },
        { label: '否', value: 'N' },
      ], //是否居民列表
      orgList: [], //部门列表
      declareMonth: '', //申报月份
      identityCodes: [], //已选择的人员身份代码
      prtypeCodes: [], //工资类别
      isResident: '', //是否居民
      orgCodes: [], //已选择的部门代码
      //打印部分 
      tempModalLoading: false,//打印按钮loading
      tempModal: false, //模板选择弹窗显示
      printTempls: [] //打印模板数据集合
    }
  },
  computed: {
    ...mapState({
      pfData: state => state.pfData,
      containerH: (state) => state.containerH,
    }),
    /**
     * @description: 筛选后的表格数据
     */
    filterTableData() {
      const filterText = XEUtils.toString(this.filterText)
        .trim()
        .toLowerCase()
      if (filterText) {
        // const filterRE = new RegExp(filterText, 'gi')
        // console.log(searchProps)

        //取所有列的列名
        let rest = this.tableData.filter((item) => {
          let flag = false
          //判断当前列是否可用于全表搜索
          for (let key in item) {
            let flag2 = false
            searchProps.forEach((it) => {
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
        console.log(rest)
        return rest
      } else {
        this.tableData.forEach((item) => {
          item.highlight = ''
        })
        return this.tableData
      }
    },
  },
  created() {
    this.tableH = this.containerH - 210
  },
  mounted() {
    this.declareMonth = String(new Date().getMonth() + 1)
    this.$showLoading()
    let p1 = this.getObjSetTree()
    let p2 = this.findPrsTypeCoIsUsedByPrsCalc()
    let p3 = this.selectEmpType()
    let p4 = this.getPrsOrgTree()
    this.getPrsItemCoList()
    Promise.all([p1, p2, p3, p4])
      .then((result) => {
        this.objCode = this.tabList[0].key
        this.query()
      })
      .catch(this.$showError)
  },
  methods: {
    moment,
    getBtnPer,
    /**
     * @description: 点击 tab
     */
    onClickTabItem(item) {
      // console.log(item)
      this.tabIndex = item.current
      this.objCode = item.key
      this.query()
    },
    /**
     * @description: 设置关闭
     */
    settingCancel() {
      this.settingModalVisible = false
    },
    /**
     * @description: 保存设置
     */
    settingConfirm() {
      // /prs/tax/prspersionalTax/saveDeclareSet
      // POST
      this.$showLoading()
      this.$axios
        .post('/prs/tax/prspersionalTax/saveDeclareSet', { setList: this.setList })
        .then((result) => {
          this.$hideLoading()
          if (result.data.flag === 'fail') {
            throw result.data.msg
          }
          this.$message.success(result.data.msg)
          this.settingCancel()
        })
        .catch(this.$showError)
    },
    /**
     * @description: 获取项目设置树 数据外层也是页面tab内容
     */
    getObjSetTree() {
      return this.$axios
        .get('/prs/tax/prspersionalTax/getObjSetTree?agencyCode=' + this.pfData.svAgencyCode + '&setYear=' + this.pfData.svSetYear + '&rgCode=' + this.pfData.svRgCode)
        .then((result) => {
          // console.log(result)
          if (!result.data.data || result.data.data.legnth === 0) {
            throw '获取项目设置数据为空'
          }
          this.setList = XEUtils.sortBy(result.data.data, 'objCode');
          let newarr = []
          this.setList.forEach(item => {
            newarr.push({
              key: item.objCode,
              pId: item.parentObjCode,
              title: item.objCodeName,
              name: item.objName,
              text: item.objName,
              isUsed: item.isUsed,
              isLeafn: item.isLeaf === '1' ? true : false,
              scopedSlots: { title: 'title' },
              remark: item.remark,
              prPaylistCode: item.prPaylistCode,
            })
          })
          let treeData = construct(newarr, {
            id: 'key',
            pid: 'pId',
            children: 'children',
          })
          this.treeData = treeData
          let copyTreeData = JSON.parse(JSON.stringify(treeData))
          copyTreeData.unshift({key: '', text:'全部'})
          copyTreeData.forEach((item, index) => {
            item.current = index
          })
          this.tabList = copyTreeData
        })
        .catch(this.$showError)
    },
    /**
     * @description: 获取关联工资项目 列表
     */
    getPrsItemCoList() {
      // prs/prsitemco/getPrsItemCoList
      return this.$axios
        .post('/prs/prsitemco/getPrsItemCoList', {
          isUsed: 'Y',
        })
        .then((result) => {
          // console.log(result)
          if (!result.data.data || result.data.data.legnth === 0) {
            throw '关联工资项目数据为空'
          }
          this.prsItemCoList = result.data.data
        })
        .catch(this.$showError)
    },
    /**
     * @description: 获取工资类别
     */
    findPrsTypeCoIsUsedByPrsCalc() {
      return this.$axios
        .post('/prs/prscalcdata/findPrsTypeCoIsUsedByPrsCalc', {
          flag: 'CALCBZ',
        })
        .then((result) => {
          // console.log(result)
          if (result.data.flag === 'success') {
            let allObj = {
              id: '*',
              value: '*',
              pid: '',
              title: '全部',
              name: '全部',
              isLeafn: false,
              children: [],
            }
            if (result.data.data && result.data.data.length > 0) {
              this.prtypeCodes = []
              let newarr = []
              result.data.data.forEach((item) => {
                this.prtypeCodes.push(item.prtypeCode)
                newarr.push({
                  key: item.prtypeCode,
                  value: item.prtypeCode,
                  pId: '*',
                  title: item.prtypeName,
                })
              })
              allObj.children = allObj.children.concat(newarr)
              this.prtypeCodeList = [allObj]
            } else {
              // throw '未获取到工资类别'
              this.prtypeCodeList = [allObj]
            }
          } else {
            throw result.data.msg
          }
        })
        .catch(this.$showError)
    },
    /**
     * @description: 获取人员身份
     */
    selectEmpType() {
      return this.$axios
        .get('/ma/ele/emptype/selectEmpType', { params: { agencyCode: this.pfData.svAgencyCode, roleId: this.pfData.svRoleId } })
        .then((result) => {
          // console.log(result)
          if (result.data.flag != 'fail') {
            let allObj = {
              id: '*',
              value: '*',
              pid: '',
              title: '全部',
              name: '全部',
              isLeafn: false,
              children: [],
            }
            if (result.data.data && result.data.data.length > 0) {
              this.identityCodes = []
              let newarr = []
              result.data.data.forEach((item) => {
                this.identityCodes.push(item.chrCode)
                newarr.push({
                  key: item.chrCode,
                  value: item.chrCode,
                  pId: item.parentCode,
                  title: item.chrName,
                  name: item.chrFullname,
                  isLeafn: item.isLeaf === 'Y' ? true : false,
                })
              })
              let treeData = construct(newarr, {
                id: 'key',
                pid: 'pId',
                children: 'children',
              })
              allObj.children = allObj.children.concat(treeData)
              this.identityList = [allObj]
            } else {
              // throw '未能获取到人员身份'
              this.identityList = [allObj]
            }
          } else {
            throw result.data.msg
          }
        })
        .catch(this.$showError)
    },
    /**
     * @description: 获取部门
     */
    getPrsOrgTree() {
      return this.$axios
        //8.20.14版本 80平台代码
        // .get('/prs/emp/prsOrg/getPrsOrgTree', { params: { roleId: this.pfData.svRoleId } })
        //8.30版本 85平台代码
        .get('/ma/emp/prsOrg/getPrsOrgTree', { params: { roleId: this.pfData.svRoleId } })
        .then((result) => {
          if (result.data.flag != 'fail') {
            let allObj = {
              id: '*',
              value: '*',
              pid: '',
              title: '全部',
              name: '全部',
              isLeafn: false,
              children: [],
            }
            if (result.data.data && result.data.data.length > 0) {
              this.orgCodes = []
              let newarr = []
              result.data.data.forEach((item) => {
                this.orgCodes.push(item.id)
                newarr.push({
                  key: item.id,
                  value: item.id,
                  pId: item.pId,
                  title: item.codeName,
                  name: item.name,
                  isLeafn: item.isLeaf === 'Y' ? true : false,
                })
              })
              let treeData = construct(newarr, {
                id: 'key',
                pid: 'pId',
                children: 'children',
              })
              allObj.children = allObj.children.concat(treeData)
              this.orgList = [allObj]
            }else{
              // throw '部门数据为空'
              this.orgList = [allObj]
            }
          } else {
            throw result.data.msg
          }
        })
        .catch(this.$showError)
    },
    /**
     * @description: 查询表格数据
     */
    query() {
      let argu = {
        objType: this.objCode,
        orgCodeList: this.orgCodes, //部门
        isResident: this.isResident, //是否居民
        prtypeCodeList: this.prtypeCodes, //工资类别
        typeCodeList: this.identityCodes, //人员身份
        startMo: this.declareMonth,
        endMo: this.declareMonth,
      }
      this.currentPage ? (argu.pageNum = this.currentPage) : false
      this.pageSize ? (argu.pageSize = this.pageSize) : false
      this.$showLoading()
      this.$axios
        .post('/prs/tax/prspersionalTax/getPersonalTaxList', argu)
        .then((result) => {
          this.$hideLoading()
          // console.log(result)
          this.tableData = []
          if (result.data.flag != 'fail') {
            if (result.data.data.list && result.data.data.list.length > 0) {
              this.page.total = result.data.data.total
              this.tableData = result.data.data.list
            }else{
              // throw '表格数据为空'
            }
          } else {
            throw result.data.msg
          }
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
      this.query()
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
     * @description: 打印
     */
    print() {
      this.tempModalLoading = true
      let opt = {
          agencyCode: this.pfData.svAgencyCode,
          acctCode:this.pfData.svAcctCode,
          rgCode:this.pfData.svRgCode,
          setYear:this.pfData.svSetYear,
          sys:"121",
          directory:"个人所得税扣缴申报表"
        }
        this.$showLoading()
        this.$axios.post(
          '/pqr/api/templ',
           qs.stringify(opt),
          {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
          }
        ).then(result =>{
          this.$hideLoading()
          // console.log(result)
          this.tempModalLoading = false
          if(result.data.data&&result.data.data.length >0){
            this.tempModal = true
            this.printTempls = result.data.data
          }
        }).catch(error=>{
          console.log(error)
          this.tempModalLoading = false
        })
    },
    printModalConfirm(tempInfo){
      console.log(tempInfo)
      this.$showLoading()
      let argu = {
        objType: this.objCode,
        orgCodeList: this.orgCodes, //部门
        isResident: this.isResident, //是否居民
        prtypeCodeList: this.prtypeCodes, //工资类别
        typeCodeList: this.identityCodes, //人员身份
        startMo: this.declareMonth,
        endMo: this.declareMonth,
      }
      let that = this
      this.$axios
        .post('/prs/tax/prspersionalTax/printPersonalTaxData', argu)
        .then(result => {
          if (result.data.flag === 'success') {
            console.log(result)
            var data = JSON.stringify(result.data.data)
            getPdf(tempInfo.reportCode, tempInfo.templId, data,()=>{
              that.$hideLoading()
              that.tempModal = false
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
    exportData() {
      //后端导出 需要额外的表头信息
      this.$showLoading()
      this.$axios.post('/prs/tax/prspersionalTax/exportPersonalTaxExcel',{
        objType: this.objCode,
        orgCodeList: this.orgCodes,
        isResident: this.isResident,
        prtypeCodeList: this.prtypeCodes,
        typeCodeList: this.identityCodes,
        startMo: this.declareMonth,
        endMo: this.declareMonth,
        fileName: '个人所得税扣缴申报表.xlsx',
        attachGuid: "PERSONTAX",
        projectName: "ma"
      }).then(result =>{
        this.$hideLoading()
        // console.log(result)
        if(result.data.flag === 'fail'){
          throw result.data.msg
        }
        // download(result.data)
        window.location.href = '/pub/file/download?fileName=' + result.data.data.fileName + '&attachGuid=' + result.data.data.attachGuid
      }).catch(this.$showError)
    },
    /**
     * @description: 点击 所得税项目设置
     */
    setting() {
      this.settingModalVisible = true
    },
    /**
     * @description: 关联工资项目 改变
     */
    settingProjectChange(val) {
      console.log(val)
      this.setList.forEach((item, index) => {
        if (item.objCode === this.settingCode) {
          item.prPaylistCode = val
          console.log(item, index)
        }
      })
      console.log(this.setList)
    },
    /**
     * @description: 备注改变
     */
    settingRemarkChange(val) {
      console.log(val)
      console.log(this.settingCode)
      this.setList.forEach((item) => {
        if (item.objCode === this.settingCode) {
          item.remark = val
        }
      })
      console.log(this.setList)
    },
    /**
     * @description: 树选项
     */
    treeSelect(vals, e) {
      console.log(vals[0])
      // console.log(e)
      let settingInfo = null
      this.setList.forEach((item) => {
        if(item.objCode === vals[0]){
          // console.log(item)
          settingInfo  = item
        }
      })
      // let settingInfo = e.node.dataRef
      console.log(settingInfo)
      if(settingInfo){
        this.settingCode = settingInfo.objCode //代码
        this.settingName = settingInfo.objCodeName //名称
        this.settingRemark = settingInfo.remark //备注
        this.settingProject = settingInfo.prPaylistCode //关联工资项目
      }
    },
    /**
     * @description: 搜索
     */
    onSearch(val) {
      if (!val) {
        return
      }
      if (!this.showSearchLoading) {
        console.log(val)
        this.showSearchLoading = true
        setTimeout(() => {
          this.showSearchLoading = false
        }, 1000)
        this.filterText = val
      }
    },
    /**
     * @description: 行样式
     */
    rowStyle({ row }) {
      // console.log(row)
      if (row.isEdit === 'dept') {
        return {
          color: '#333',
          fontWeight: 'bold',
          backgroundColor: '#EEEEEE',
        }
      }
    },
    /**
     * @description: 搜索内容改变
     */
    onSearchChange(e) {
      // console.log(e.target.value)
      if (e.target.value == '') {
        this.filterText = e.target.value
      }
    },
    /**
     * @description: 申报月份改变
     */
    declareMonthChange(val) {
      this.declareMonth = val
    },
    /**
     * @description: 人员身份改变
     */
    identityChange(val) {
      this.identityCodes = val
    },
    /**
     * @description: 工资类别改变
     */
    prtypeCodeChange(val) {
      this.prtypeCodes = val
    },
    /**
     * @description: 是否居民改变
     */
    isResidentChange(val) {
      this.isResident = val
    },
    /**
     * @description: 部门改变
     */
    orgCodeChange(val) {
      this.orgCodes = val
    },
  },
  components: {
    printTempSelectModal
  },
}
</script>
<style lang="scss" scoped>
@import '@/assets/styles/variable.scss';
.toolBar {
  height: 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #ddd;
  border-bottom: 1px solid #ddd;
  margin-top: 4px;
}

.toolBarBtn {
  display: flex;
  justify-content: flex-end;
}
.ant-input-group > .ant-input-affix-wrapper:not(:last-child) .ant-input {
  border-right: 0;
  outline: none;
}
.xtable {
  margin-top: 5px;
}
.settingMain {
  display: flex;
}
.settingTree {
  box-sizing: border-box;
  width: 60%;
  height: 300px;
  border-right: 1px solid #dcdcdc;
  overflow-y: auto;
}
.settingRight {
  box-sizing: border-box;
  width: 40%;
  padding-left: 20px;
}
.flex-row {
  display: flex;
  align-items: center;
}
</style>
