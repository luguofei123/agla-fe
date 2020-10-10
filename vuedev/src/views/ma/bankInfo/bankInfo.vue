<template>
  <div class="pageContent">
    <!-- 头部开始 -->
    <ufHeader :title="title">
      <template slot="btns">
        <a-button class="mr-5" type="primary" :class="getBtnPer('btn-add-network')" @click="addNetworkInfo">新增网点</a-button>
        <a-button class="mr-5" :class="getBtnPer('btn-del-network')" @click="networkInfoDeletes">删除网点</a-button>
      </template>
    </ufHeader>
    <div class="bankInfoMain">
      <div class="bankInfo">
        <div class="titleContainer">
          <span class="title">银行</span>
          <div class="buts">
            <a-button type="link" icon="plus" :class="getBtnPer('btn-add-bank')" style="padding: 0;font-size: 14px;" @click="addBankInfo">新增银行</a-button>
          </div>
        </div>
        <div class="bankInfoSearch">
          <a-input-search placeholder="请输入银行或者关键词" v-model="searchValue" @change="bankInfoSearch" @search="bankInfoSearch" enterButton />
          <br /><br />
        </div>
        <div class="treeContainer">
          <a-tree
            checkable
            @expand="onExpand"
            :expandedKeys="expandedKeys"
            :autoExpandParent="autoExpandParent"
            v-model="checkedKeys"
            :selectedKeys="selectedKeys"
            :treeData="treeData"
            @check="onCheck"
            @select="onSelect"
          >
            <template slot="node" slot-scope="{ node }">
              <span class="treeTitle">
                <span v-if="node.title.indexOf(searchValue) > -1">
                  {{ node.title.substr(0, node.title.indexOf(searchValue)) }}
                  <span style="color: #f50">{{ searchValue }}</span>
                  {{ node.title.substr(node.title.indexOf(searchValue) + searchValue.length) }}
                </span>
                <span v-else>{{ node.title }}</span>
                <a-icon class="treeIcon" type="edit" @click.stop="bankInfoEdit(node)" />
              </span>
            </template>
          </a-tree>
        </div>
        <div class="footerContainer">
          <a-checkbox @change="selectAll"><span class="pl-5">全选</span></a-checkbox>
          <span>
            <a-button shape="circle" type="link" style="font-size: 14px;" icon="delete" @click="bankInfoDelete" />
          </span>
        </div>
      </div>
      <div class="networkInfo">
        <div class="flex-end" style="padding-bottom: 10px;line-height: 30px;">
          <a-input-search style="width: 200px;height: 32px;margin-left: 10px;border-right: 0" allowClear ref="filterText" @change="onSearchChange" @search="onSearch" placeholder="搜索">
            <a-button class="flex-c-c" slot="enterButton">
              <a-icon style="padding-top: 5px;" ref="searchIcon" type="search" />
            </a-button>
          </a-input-search>
        </div>
        <!-- 表格开始 -->
        <vxe-grid
          border
          stripe
          resizable
          head-align="center"
          show-header-overflow
          show-overflow
          :height="tableH"
          size="mini"
          ref="xGrid"
          :auto-resize="true"
          class="xtable mytable-scrollbar"
          :columns="columns"
          :data="filterTableData"
          :highlight-hover-row="true"
          :toolbar="{ id: 'wageDetailReportTable', resizable: { storage: true } }"
          @checkbox-change="checkboxChangeEvent"
          @checkbox-all="checkboxChangeEvent"
        >
          <template v-slot:name="{ row }">
            <a class="jump-link" @click="networkInfoEdit(row)">{{ row.name }}</a>
          </template>
          <template v-slot:button="{ row }">
            <span>
              <a-popconfirm title="您确定删除该条信息吗？" @confirm="networkInfoDelete(row)" okText="是" cancelText="否">
                <a-icon type="delete" style="font-size: 14px;" />
              </a-popconfirm>
            </span>
          </template>
        </vxe-grid>
        <!-- 表格结束 -->

        <!-- 自定义分页器开始 -->
        <ufPager :pager-config="page" @page-change="handlePageChange"></ufPager>
        <!-- 自定义分页器结束 -->
      </div>
    </div>
    <!--新增银行-->
    <uf-modal v-model="bankInfoVisible" :title="bankInfoTitle" @cancel="bankInfoVisible = false">
      <ul class="form">
        <li>
          <label class="label"><i class="must">*</i>银行编码:</label>
          <span class="value">
            <a-input v-model="bankInfoData.code" :disabled="isEdit" placeholder="请输入银行编码" @blur="formCheck(bankInfoData.code, 'bankCode')" />
            <span class="errorText" v-if="bankCodeIsMust">银行编码为必填项</span>
          </span>
        </li>
        <li>
          <label class="label"><i class="must">*</i>银行名称:</label>
          <span class="value">
            <a-input v-model="bankInfoData.name" placeholder="请输入银行名称" @blur="bankNameGetAssCode(bankInfoData.name), formCheck(bankInfoData.name, 'bankName')" />
            <span class="errorText" v-if="bankNameIsMust">银行名称为必填项</span>
          </span>
        </li>
        <li>
          <label class="label">银行简称:</label>
          <span class="value"><a-input v-model="bankInfoData.chrFullname" placeholder="请输入银行简称"/></span>
        </li>
        <li>
          <label class="label">助记码:</label>
          <span class="value"><a-input v-model="bankInfoData.assCode" placeholder="请输入助记码"/></span>
        </li>
      </ul>
      <template slot="footer">
        <a-button type="primary" class="mr-10" @click="bankInfoSaveAndAdd">
          保存并新增
        </a-button>
        <a-button type="primary" class="mr-10" @click="bankInfoSave">
          保存
        </a-button>
        <a-button @click="bankInfoCancel">取消</a-button>
      </template>
    </uf-modal>
    <!--新增银行网点-->
    <uf-modal v-model="networkInfoVisible" :title="networkInfoTitleD" @cancel="networkInfoVisible = false">
      <ul class="form">
        <li>
          <label class="label"><i class="must">*</i>网点行号:</label>
          <span class="value">
            <a-input v-model="networkInfoData.code" :disabled="isEdit" placeholder="请输入网点行号" @blur="formCheck(networkInfoData.code, 'networkNo')" />
            <span class="errorText" v-if="networkNoIsMust">网点行号为必填项</span>
          </span>
        </li>
        <li>
          <label class="label"><i class="must">*</i>网点名称:</label>
          <span class="value">
            <a-input v-model="networkInfoData.name" @blur="networkNameGetAssCode(networkInfoData.name), formCheck(networkInfoData.name, 'networkName')" placeholder="请输入网点名称" />
            <span class="errorText" v-if="networkNameIsMust">网点名称为必填项</span>
          </span>
        </li>
        <li>
          <label class="label"><i class="must">*</i>银行名称:</label>
          <span class="value">
            <a-select
              style="width: 100%"
              v-model="networkInfoData.bankCategoryCode"
              placeholder="请输选择银行"
              @change="bankChange(networkInfoData.bankCategoryCode), formCheck(networkInfoData.bankCategoryCode, 'networkBankName')"
            >
              <a-select-option v-for="option in treeData" :key="option.id" :value="option.code" :label="option.name">
                {{ option.name }}
              </a-select-option>
            </a-select>
            <span class="errorText" v-if="networkBankNameIsMust">银行名称为必填项</span>
          </span>
        </li>
        <li>
          <label class="label">网点地址:</label>
          <span class="value"><a-input v-model="networkInfoData.address" placeholder="请输入网点地址"/></span>
        </li>
        <li>
          <label class="label">省份:</label>
          <span class="value"><a-input v-model="networkInfoData.province" placeholder="请输入省份"/></span>
        </li>
        <li>
          <label class="label">城市:</label>
          <span class="value"><a-input v-model="networkInfoData.city" placeholder="请输入城市"/></span>
        </li>
        <li>
          <label class="label">人行联行号:</label>
          <span class="value"><a-input v-model="networkInfoData.pbcInterBankNo" placeholder="请输入人行联行号"/></span>
        </li>
        <li>
          <label class="label">助记码:</label>
          <span class="value"><a-input v-model="networkInfoData.assCode" placeholder="请输入助记码"/></span>
        </li>
      </ul>
      <template slot="footer">
        <a-button type="primary" class="mr-10" @click="networkInfoSaveAndAdd">
          保存并新增
        </a-button>
        <a-button type="primary" class="mr-10" @click="networkInfoSave">
          保存
        </a-button>
        <a-button @click="networkInfoCancel">取消</a-button>
      </template>
    </uf-modal>
  </div>
</template>

<script>
import XEUtils from 'xe-utils'
import { mapState } from 'vuex'
import { getBtnPer } from '@/assets/js/util'
import '@/render/cellRender'
let searchProps = []

export default {
  name: 'bankInfo',
  props: {},
  data() {
    return {
      rgCode: '',
      setYear: '',
      title: '银行信息管理', //页面标题
      // 左侧树参数
      searchValue: '',
      expandedKeys: [],
      autoExpandParent: true,
      checkedKeys: [],
      checkedNodes: [],
      selectedKeys: [],
      selectedNodes: [],
      treeData: [], // 左侧树数据
      treeDateList: [],
      // 右侧列表参数
      tableH: '',
      columns: [],
      tableData: [],
      page: {
        tableName: 'bankInfo',
        currentPage: 1,
        pageSize: 50,
        pageSizes: [10, 20, 30, 50, 100, '全部'],
        total: 0,
      },
      currentPage: 1,
      pageSize: 50,
      selectRow: null,
      isAllChecked: false,
      isIndeterminate: false,
      selectRecords: [],
      // 新增银行弹框
      bankInfoVisible: false,
      bankInfoTitle: '新增银行信息',
      bankInfoData: {},
      bankCodeIsMust: false, // 银行编码必填校验
      bankNameIsMust: false, // 银行名称必填校验
      // 新增银行网点信息
      networkInfoVisible: false,
      networkInfoTitleD: '新增网点信息',
      networkInfoData: {},
      networkNoIsMust: false,
      networkNameIsMust: false,
      networkBankNameIsMust: false,
      isEdit: false, // 修改时编码不可修改
      filterText: '',
    }
  },
  computed: {
    ...mapState({
      pfData: (state) => state.pfData,
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
        //取所有列的列名
        let rest = this.tableData.filter(item => {
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
        console.log(rest)
        return rest
      } else {
        this.tableData.forEach(item => {
          item.highlight = ''
        })
        return this.tableData
      }
    }
  },
  created() {
    this.tableH = this.containerH - 145
  },
  methods: {
    getBtnPer,
    /**
     * @description: 搜索
     */
    onSearch(val) {
      if (!val) {
        return
      }
      this.filterText = val
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
    // 添加插槽属性, 过滤数据
    setTreeData(data) {
      const tns = []
      let item = {}
      for (let i = 0; i < data.length; i++) {
        item = {
          id: data[i].id,
          key: data[i].code,
          name: data[i].name,
          code: data[i].code,
          scopedSlots: { title: 'node' },
          node: {
            ...data[i],
            title: '[' + data[i].code + ']' + data[i].name,
          },
        }
        tns.push(item)
        if (item.children) {
          tns[i].children = this.setTreeData(data[i].children)
        }
      }
      return tns
    },
    // 提取父级数据和孩子数据到一个数组里
    generateList(data) {
      for (let i = 0; i < data.length; i++) {
        const node = data[i]
        const key = node.key
        this.treeDateList.push({ key, title: key })
        if (node.children) {
          this.generateList(node.children)
        }
      }
    },
    // 筛选查询数据
    getParentKey(key, tree) {
      let parentKey
      for (let i = 0; i < tree.length; i++) {
        const node = tree[i]
        if (node.children) {
          if (node.children.some((item) => item.key === key)) {
            parentKey = node.key
          } else if (this.getParentKey(key, node.children)) {
            parentKey = this.getParentKey(key, node.children)
          }
        }
      }
      return parentKey
    },
    // 左侧搜索
    bankInfoSearch() {
      const value = this.searchValue
      const expandedKeys = this.treeDateList
        .map((item) => {
          if (item.key.indexOf(value) > -1) {
            return this.getParentKey(item.key, this.treeData)
          }
          return null
        })
        .filter((item, i, self) => item && self.indexOf(item) === i)
      console.log(expandedKeys)
      this.expandedKeys = expandedKeys
    },
    // 左侧树 展开/收起节点
    onExpand(expandedKeys) {
      this.expandedKeys = expandedKeys
      this.autoExpandParent = false
    },
    // 左侧树 点击复选框触发
    onCheck(checkedKeys) {
      this.checkedKeys = checkedKeys
      this.checkedNodes = []
      this.treeData.forEach((item) => {
        if (checkedKeys.indexOf(item.key) > -1) {
          this.checkedNodes.push(item.node)
        }
      })
    },
    onSelect(selectedKeys) {
      this.selectedKeys = selectedKeys
      this.selectedNodes = []
      this.treeData.forEach((item) => {
        if (selectedKeys.indexOf(item.key) > -1) {
          this.selectedNodes.push(item.node)
        }
      })
      this.getNetworkInfo()
    },
    // 全选/取消全选
    selectAll(e) {
      const checked = e.target.checked
      if (checked) {
        this.checkedKeys = []
        this.treeDateList.forEach((i) => {
          this.checkedKeys.push(i.key)
        })
      } else {
        this.checkedKeys = []
      }
      this.checkedNodes = []
      this.treeData.forEach((item) => {
        if (this.checkedKeys.indexOf(item.key) > -1) {
          this.checkedNodes.push(item.node)
        }
      })
    },
    // 新增银行
    addBankInfo() {
      this.bankInfoData = {}
      this.bankInfoVisible = true
      this.bankInfoTitle = '新增银行信息'
      this.isEdit = false
    },
    // 银行信息修改
    bankInfoEdit(node) {
      this.bankInfoData = node
      this.bankInfoVisible = true
      this.bankInfoTitle = '修改银行信息'
      this.isEdit = true
    },
    // 删除银行信息
    bankInfoDelete() {
      const chrIds = []
      this.checkedNodes.forEach((node) => {
        chrIds.push(node.chrId)
      })
      if (chrIds.length < 1) {
        this.$message.warn('请选择至少一条数据！')
        return
      }
      const params = {
        chrIds: chrIds,
        bankCategoryCodes: this.checkedKeys,
        rgCode: this.rgCode,
        setYear: this.setYear,
      }
      const vm = this
      this.$confirm({
        title: '您确定删除选中的数据吗？',
        okText: '是',
        okType: 'danger',
        cancelText: '否',
        onOk() {
          vm.$showLoading()
          vm.$axios
            .post('/ma/sys/bank/deleteBankCategory', params)
            .then((result) => {
              if (result.data.flag == 'success') {
                vm.checkedKeys = []
                vm.$message.success('删除成功！')
                vm.getBankInfo()
              } else {
                vm.$message.error(result.data.msg)
              }
              vm.$hideLoading()
            })
            .catch((error) => {
              vm.$message.error(error)
              vm.$hideLoading()
            })
        },
        onCancel() {
          console.log('Cancel')
        },
      })
    },
    // 银行名称失去焦点获取助记码
    bankNameGetAssCode(val) {
      this.getAssCode(val).then((res) => {
        this.bankInfoData.assCode = res
        this.$forceUpdate()
      })
    },
    // 保存并新增
    bankInfoSaveAndAdd() {
      this.bankInfoSaveAndUpdate('saveAndAdd')
    },
    // 保存
    bankInfoSave() {
      this.bankInfoSaveAndUpdate('save')
    },
    // 取消
    bankInfoCancel() {
      this.bankInfoData = {}
      this.bankInfoVisible = false
    },
    // 银行信息 新增和修改
    bankInfoSaveAndUpdate(type) {
      const params = this.bankInfoData
      params.rgCode = params.rgCode ? params.rgCode : this.rgCode
      params.setYear = params.setYear ? params.setYear : this.setYear
      delete params.title
      if (!params.code) {
        this.$message.warn('请输入银行编码')
        return
      }
      if (!params.name) {
        this.$message.warn('请输入银行名称')
        return
      }
      this.$showLoading()
      this.$axios
        .post('/ma/sys/bank/saveBankCategory', params)
        .then((result) => {
          if (result.data.flag == 'success') {
            if (type == 'save') {
              this.bankInfoVisible = false
            }
            if (type == 'saveAndAdd') {
              this.bankInfoData = {}
              this.bankInfoVisible = true
              this.bankInfoTitle = '新增银行信息'
            }
            this.getBankInfo()
          } else {
            this.$message.error(result.data.msg)
          }
          this.$hideLoading()
        })
        .catch((error) => {
          this.$message.error(error)
          this.$hideLoading()
        })
    },
    // 左侧树查询
    getBankInfo() {
      const params = {
        rgCode: this.rgCode,
        setYear: this.setYear,
      }
      this.$showLoading()
      this.$axios
        .get('/ma/sys/bank/selectMaEleBankCategoryTree', { params: params })
        .then((result) => {
          if (result.data.flag == 'success') {
            this.treeData = this.setTreeData(result.data.data)
            this.generateList(this.treeData)
            this.selectedKeys = []
            this.selectedKeys.push(this.treeData[0].code)
            this.selectedNodes = []
            this.selectedNodes.push(this.treeData[0])
            this.getNetworkInfo()
          } else {
            this.$message.error(result.data.msg)
          }
          this.$hideLoading()
        })
        .catch((error) => {
          this.$message.error(error)
          this.$hideLoading()
        })
    },

    // 新增银行网点
    addNetworkInfo() {
      this.networkInfoData = {}
      this.networkInfoData.bankCategoryCode = this.selectedNodes[0].code
      this.networkInfoData.bankCategoryName = this.selectedNodes[0].name
      this.networkInfoVisible = true
      this.networkInfoTitleD = '新增网点信息'
      this.isEdit = false
    },
    // 银行网点信息修改
    networkInfoEdit(row) {
      this.networkInfoData = JSON.parse(JSON.stringify(row))
      this.networkInfoVisible = true
      this.networkInfoTitleD = '修改网点信息'
      this.isEdit = true
    },
    // 银行网点名称失去焦点获取助记码
    networkNameGetAssCode(val) {
      this.getAssCode(val).then((res) => {
        this.networkInfoData.assCode = res
      })
    },
    // 网点信息，银行变化
    bankChange(value) {
      const selectedBank = this.treeData.find((i) => i.code == value)
      this.networkInfoData.bankCategoryCode = selectedBank.code
      this.networkInfoData.bankCategoryName = selectedBank.name
      this.networkInfoData.bankCategoryCodeName = selectedBank.code + ' ' + selectedBank.name
    },
    // 银行网点信息 删除- 单个删除
    networkInfoDelete(row) {
      let chrIds = []
      chrIds.push(row.chrId)
      const params = chrIds
      this.$showLoading()
      this.$axios
        .post('/ma/sys/bank/deleteBank', params)
        .then((result) => {
          if (result.data.flag == 'success') {
            this.getNetworkInfo()
            this.$message.success('删除成功！')
          } else {
            this.$message.error(result.data.msg)
          }
          this.$hideLoading()
        })
        .catch((error) => {
          this.$message.error(error)
          this.$hideLoading()
        })
    },
    // 银行网点信息 删除- 批量删除
    networkInfoDeletes() {
      let chrIds = this.selectRecords.map((item) => {
        return item.chrId
      })
      if (chrIds.length < 1) {
        this.$message.warn('请选择至少一条数据！')
        return
      }
      const params = chrIds
      const vm = this
      this.$confirm({
        title: '您确定删除选中的数据吗？',
        okText: '是',
        okType: 'danger',
        cancelText: '否',
        onOk() {
          vm.$showLoading()
          vm.$axios
            .post('/ma/sys/bank/deleteBank', params)
            .then((result) => {
              if (result.data.flag == 'success') {
                vm.selectRecords = []
                vm.getNetworkInfo()
                vm.$message.success('删除成功！')
              } else {
                vm.$message.error(result.data.msg)
              }
              vm.$hideLoading()
            })
            .catch((error) => {
              vm.$message.error(error)
              vm.$hideLoading()
            })
        },
        onCancel() {
          console.log('Cancel')
        },
      })
    },
    // 保存并新增
    networkInfoSaveAndAdd() {
      this.networkInfoSaveAndUpdate('saveAndAdd')
    },
    // 保存
    networkInfoSave() {
      this.networkInfoSaveAndUpdate('save')
    },
    // 取消
    networkInfoCancel() {
      this.networkInfoData = {}
      this.networkInfoVisible = false
    },
    // 银行网点信息 新增和修改
    networkInfoSaveAndUpdate(type) {
      const params = this.networkInfoData
      params.rgCode = params.rgCode ? params.rgCode : this.rgCode
      params.setYear = params.setYear ? params.setYear : this.setYear
      delete params._XID
      if (!params.code) {
        this.$message.warn('请输入网点行号')
        return
      }
      if (!params.name) {
        this.$message.warn('请输入网点名称')
        return
      }
      if (!params.bankCategoryCode) {
        this.$message.warn('请选择银行名称')
        return
      }
      params.bankNo = params.code
      this.$hideLoading()
      this.$axios
        .post('/ma/sys/bank/saveBank', params)
        .then((result) => {
          if (result.data.flag == 'success') {
            if (result.data.flag == 'success') {
              if (type == 'save') {
                this.networkInfoVisible = false
              }
              if (type == 'saveAndAdd') {
                this.networkInfoData = {}
                this.networkInfoVisible = true
                this.networkInfoTitleD = '新增网点信息'
              }
              this.getNetworkInfo()
            }
            this.$message.success('保存成功 ！')
          } else {
            this.$message.error(result.data.msg)
          }
          this.$hideLoading()
        })
        .catch((error) => {
          this.$message.error(error)
          this.$hideLoading()
        })
    },
    // 打印
    print() {
      let prtypeCodes = []
      if (this.prtypeCode === '*') {
        prtypeCodes = this.prtypeCodes
      } else {
        prtypeCodes = [this.prtypeCode]
      }
      let argu = {
        pageNum: this.page.currentPage,
        pageSize: this.page.pageSize,
        orgCodes: this.orgs,
        prtypeCodes: prtypeCodes,
        flag: this.dataFrom,
        monthStart: this.dataFrom === 'RPT_PAYLIST' ? this.monthStart : '',
        monthEnd: this.dataFrom === 'RPT_PAYLIST' ? this.monthEnd : '',
        payNoMo: this.dataFrom === 'RPT_PAYLIST' ? this.payNoMo : '',
      }
      let that = this
      this.$axios
        .post('/prs/rpt/PrsRptData/printSalaryDetailData', argu)
        .then((result) => {
          if (result.data.flag === 'success') {
            console.log(result)
            var data = JSON.stringify(result.data.data)
            getPdf('salaryDetailForm', '*', data)
          } else {
            throw '连接pqr打印失败'
          }
        })
        .catch(this.doError)

      function getPdf(reportCode, templId, groupDef) {
        var xhr = new XMLHttpRequest()
        var formData = new FormData()
        formData.append('reportCode', reportCode)
        formData.append('templId', templId)
        formData.append('groupDef', groupDef)
        xhr.open('POST', '/pqr/api/printpdfbydata', true)
        xhr.setRequestHeader('context-type', 'text/xml;charset=utf-8')
        xhr.responseType = 'blob'

        //保存文件
        xhr.onload = function(e) {
          console.log(e)
          if (xhr.status === 200) {
            if (xhr.status === 200) {
              const content = decodeURIComponent(xhr.getResponseHeader('Content-Disposition'))
              window.open(content, '_blank', 'titlebar=no,location=no,toolbar=no,menubar=no;top=100')
            }
          }
        }

        //状态改变时处理返回值
        xhr.onreadystatechange = function() {
          if (xhr.readyState === 4) {
            //通信成功时
            if (xhr.status === 200) {
              //交易成功时
              that.$hideLoading()
            } else {
              const content = decodeURIComponent(xhr.getResponseHeader('Content-Disposition'))
              that.$message.error(content)
              that.$hideLoading()
            }
          }
        }
        xhr.send(formData)
      }
    },
    // 导出
    exportData() {
      let nameCode = this.getAgencyNameCode()
      this.$refs.xTable.exportData({
        filename: nameCode + this.pfData.svSetYear + '年' + this.mo + '月工资编制导出',
        sheetName: 'Sheet1',
        type: 'xlsx',
      })
    },
    // 获取右侧网点信息
    getNetworkInfo() {
      let params = {
        rgCode: this.rgCode,
        setYear: this.setYear,
        pageIndex: this.currentPage,
        pageSize: this.pageSize,
        bankCategoryCode: this.selectedKeys[0],
      }
      this.$showLoading()
      this.$axios
        .get('/ma/sys/bank/selectBanks', { params: params })
        .then((result) => {
          if (result.data.flag == 'success') {
            this.tableData = result.data.data.list
            this.page.total = result.data.data.total
          }
          this.$hideLoading()
        })
        .catch((error) => {
          this.$message.error(error)
          this.$hideLoading()
        })
    },
    // 页数改变
    handlePageChange({ currentPage, pageSize }) {
      if (pageSize === '全部') {
        this.currentPage = 1
        this.pageSize = 999999999
        // this.currentPage = ''
        // this.pageSize = ''
      } else {
        this.currentPage = currentPage
        this.pageSize = pageSize
      }
      this.getNetworkInfo()
    },
    // 表格选中
    checkboxChangeEvent(e) {
      this.selectRecords = e.selection
    },
    // 获取cookie的值
    getCookie(cookieName) {
      const strCookie = document.cookie
      const arrCookie = strCookie.split('; ')
      for (let i = 0; i < arrCookie.length; i++) {
        let arr = arrCookie[i].split('=')
        if (cookieName === arr[0]) {
          return arr[1]
        }
      }
      return ''
    },
    // 获取助记号
    getAssCode(val) {
      const params = {
        chinese: val,
      }
      return new Promise((resolve) => {
        this.$axios
          .post('/pub/util/String2Alpha', params)
          .then((result) => {
            if (result.data.flag == 'success') {
              resolve(result.data.data)
            }
          })
          .catch((error) => {
            this.$message.error(error)
          })
      })
    },
    // 表单校验
    formCheck(val, key) {
      switch (key) {
        case 'bankCode':
          if (val) {
            this.bankCodeIsMust = false
          } else {
            this.bankCodeIsMust = true
          }
          break
        case 'bankName':
          if (val) {
            this.bankNameIsMust = false
          } else {
            this.bankNameIsMust = true
          }
          break
        case 'networkNo':
          if (val) {
            this.networkNoIsMust = false
          } else {
            this.networkNoIsMust = true
          }
          break
        case 'networkName':
          if (val) {
            this.networkNameIsMust = false
          } else {
            this.networkNameIsMust = true
          }
          break
        case 'networkBankName':
          if (val) {
            this.networkBankNameIsMust = false
          } else {
            this.networkBankNameIsMust = true
          }
          break
      }
    },
  },
  mounted() {
    this.rgCode = this.pfData.svRgCode
    this.setYear = this.pfData.svSetYear
    this.columns = [
      { type: 'checkbox', width: 60, minWidth: 60, headerAlign: 'center', align: 'center' },
      {
        field: 'code',
        title: '网点行号',
        headerAlign: 'center',
        align: 'center',
        checked: false,
        cellRender: { name: 'searchHighLight' },
        minWidth: 150,
      },
      {
        field: 'name',
        title: '网点名称',
        headerAlign: 'center',
        align: 'left',
        checked: false,
        cellRender: { name: 'searchHighLight' },
        minWidth: 300,
        slots: { default: 'name' },
      },
      {
        field: 'address',
        title: '网点地址',
        headerAlign: 'center',
        align: 'left',
        checked: false,
        cellRender: { name: 'searchHighLight' },
        minWidth: 250,
      },
      {
        field: 'province',
        title: '省份',
        headerAlign: 'center',
        align: 'center',
        checked: false,
        cellRender: { name: 'searchHighLight' },
        minWidth: 80,
      },
      {
        field: 'city',
        title: '城市',
        headerAlign: 'center',
        align: 'center',
        checked: false,
        cellRender: { name: 'searchHighLight' },
        minWidth: 80,
      },
      {
        field: 'button',
        title: '操作',
        headerAlign: 'center',
        align: 'center',
        checked: false,
        cellRender: { name: 'searchHighLight' },
        minWidth: 50,
        slots: { default: 'button' },
      },
    ]
    searchProps = this.columns.map(item => {
        if(item.type!='checkbox'&&item.field!='button'){
            return item.field
        }
    })
    this.getBankInfo()
  },
  watch: {},
}
</script>
<style>
.ant-btn > .anticon + span,
.ant-btn > span + .anticon {
  margin-left: 4px;
}
</style>
<style scoped>
.pageContent {
  width: 100%;
  /*height: calc(100vh - 95px);*/
  height: 100%;
}

.bankInfoMain {
  width: 100%;
  height: calc(100% - 50px);
  display: flex;
  margin-top: 8px;
}

.bankInfo {
  width: 240px;
  border: 1px solid #dfe6ec;
}

.networkInfo {
  flex: 1;
  width: calc(100% - 240px);
  padding-left: 10px;
}

.titleContainer {
  width: 100%;
  display: flex;
  justify-content: space-between;
  height: 42px;
  padding: 0 10px;
  line-height: 42px;
}

.titleContainer .buts .ant-btn-link {
  color: #40a9ff;
}

.bankInfoSearch {
  padding: 10px;
  height: 53px;
}

.treeContainer {
  width: 240px;
  height: calc(100% - 42px - 53px - 40px);
  overflow: auto;
}

.treeTitle {
  display: flex;
}
.treeIcon {
  margin: 5px;
}
.treeTitle:hover .treeIcon {
  display: block;
}

.treeIcon {
  display: none;
}

.footerContainer {
  border-top: 1px solid #dfe6ec;
  display: flex;
  justify-content: space-between;
  line-height: 40px;
  padding-left: 10px;
}

.bankInfo .titleContainer {
  border-bottom: 1px solid #dfe6ec;
}

.ant-btn-link {
  border: 0;
  box-shadow: 0 2px 0 rgba(0, 0, 0, 0);
}

.form {
  width: 100%;
}

.form li {
  display: flex;
  padding-bottom: 18px;
}

.form li .label {
  width: 105px;
  line-height: 32px;
  text-align: right;
  padding-right: 5px;
}

.form li .label .must {
  color: red;
}

.form li .value {
  flex: 1;
  position: relative;
}
.errorText {
  position: absolute;
  width: 100%;
  top: 32px;
  left: 0;
  font-size: 12px;
  color: red;
}
.editRow {
  color: #606266;
}
.editRow:hover {
  cursor: pointer;
  text-decoration: underline;
  color: #108ee9;
}
.loadingWrap {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  text-align: center;
  background: rgba(0, 0, 0, 0.2);
  z-index: 999999;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
