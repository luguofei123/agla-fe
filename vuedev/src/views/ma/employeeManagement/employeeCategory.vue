<!--
 * @Author: sunch
 * @Date: 2020-08-17 09:33:17
 * @LastEditTime: 2020-08-21 12:34:33
 * @LastEditors: Please set LastEditors
 * @Description: 人员属性分类
 * @FilePath: /agla-fe-8.50/vuedev/src/views/ma/employeeManagement/employeeCategory.vue
-->
<template>
  <div>
    <!-- 头部开始 -->
    <ufHeader :title="title">
      <template slot="btns">
        <a-button type="primary" class="mr-5" :class="getBtnPer('btn-add')" @click="onClickShowAddModal">新增</a-button>
      </template>
    </ufHeader>

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

    <vxe-table size="mini" border ref="xTable" :data="showTableData" header-align="center" :height="tableH">
      <vxe-table-column type="checkbox" width="36" align="center"></vxe-table-column>
      <vxe-table-column min-width="100" field="classCode" title="类别代码" align="center" show-overflow></vxe-table-column>
      <vxe-table-column min-width="100" field="className" title="类别名称" show-overflow></vxe-table-column>
      <vxe-table-column width="100" field="ordIndex" title="排序号" align="center" show-overflow></vxe-table-column>
      <vxe-table-column width="100" field="isUsedStr" title="是否启用" align="center" show-overflow></vxe-table-column>
      <vxe-table-column width="100" field="isSysStr" title="系统预置" align="center" show-overflow></vxe-table-column>
      <vxe-table-column min-width="160" field="isLimitStr" title="是否控制编制人数" align="center" show-overflow></vxe-table-column>
      <vxe-table-column min-width="100" align="center" title="操作">
        <template v-slot="{ row, rowIndex }">
          <div style="font-size: 16px;">
            <a-icon type="edit" :class="getBtnPer('btn-edit')" style="cursor: pointer;" @click="editRow(row, rowIndex)" />
            <a-icon type="delete" :class="getBtnPer('btn-delete')" style="cursor: pointer;margin-left: 10px;" @click="delOne(row)" />
          </div>
        </template>
      </vxe-table-column>
    </vxe-table>

    <!-- 自定义分页器开始 -->
    <ufPager :pager-config="page" @page-change="handlePageChange">
      <template v-slot:footerBtns>
        <div>
          <a-button :class="getBtnPer('btn-delete')" @click="del">删除</a-button>
          <a-button :class="getBtnPer('btn-start')" @click="enable" class="ml-10">启用</a-button>
          <a-button :class="getBtnPer('btn-stop')" @click="disable" class="ml-10">停用</a-button>
        </div>
      </template>
    </ufPager>
    <!-- 自定义分页器结束 -->

    <uf-modal title="新增人员属性分类" v-model="showAddModal" @cancel="close" :width="1100">
      <div class="flex-start">
        <div class="flex-start">
          <div class="label">类别代码：</div>
          <a-input class="form-ele" v-model="classCode" :disabled="isEdit"></a-input>
          <div class="requireMark">*</div>
        </div>

        <div class="flex-start ml-10">
          <div class="label">类别名称：</div>
          <a-input class="form-ele" v-model="className"></a-input>
          <div class="requireMark">*</div>
        </div>
      </div>

      <div class="flex-start mt-10">
        <div>
          <div class="label">排序号：</div>
          <a-input class="form-ele" v-model="ordIndex"></a-input>
        </div>

        <div class="flex-start ml-30">
          <div class="label">是否启用：</div>
          <div class="form-ele" style="width: 100px;">
            <a-radio-group v-model="isUsed" button-style="solid" size="small">
              <a-radio-button value="Y">
                是
              </a-radio-button>
              <a-radio-button value="N">
                否
              </a-radio-button>
            </a-radio-group>
          </div>
        </div>
        <div class="flex-start ml-20">
          <div class="label">系统预置：</div>
          <div class="form-ele">
            <a-radio-group v-model="isSys" button-style="solid" size="small" disabled>
              <a-radio-button value="Y">
                是
              </a-radio-button>
              <a-radio-button value="N">
                否
              </a-radio-button>
            </a-radio-group>
          </div>
        </div>
      </div>
      <div class="flex-start mt-10">
        <div class="label">备注：</div>
        <a-input v-model="remark" style="width: 94%;"></a-input>
      </div>
      <div class="flex-start mt-10">
        <div class="flex-start align-items-start ">
          <div class="label">可选属性：</div>
          <div class="couldPropWrap myscrollbar">
            <div class="mb-5" v-for="(item, index) in propDataList" :key="item['PROPERTY_CODE']">
              <!-- :checked="item.checked" @change="onChange(item['PROPERTY_CODE'], item, index, $event)" -->
              <a-checkbox @change="onChange(item['PROPERTY_CODE'], item, index, $event)"
                ><span class="ml-5">{{ item['PROPERTY_NAME'] }}</span></a-checkbox
              >
            </div>
          </div>
        </div>
        <div class="flex-start align-items-start  ml-30">
          <div class="label">已选属性：</div>
          <div class="selectedPropWrap myscrollbar">
            <vuedraggable class="wrapper" v-model="selectPropDataList">
              <transition-group>
                <div class="selectedPropItem" v-for="item in selectPropDataList" :key="item.propertyCode">
                  <div>{{ item.propertyName }}</div>
                </div>
              </transition-group>
            </vuedraggable>
          </div>
        </div>
      </div>

      <template slot="footer">
        <a-button key="save" class="mr-10" type="primary" :loading="saveConfigLoading" @click="save">
          保存
        </a-button>
        <a-button key="cancel" @click="close">
          关闭
        </a-button>
      </template>
    </uf-modal>
  </div>
</template>
<script>
import vuedraggable from 'vuedraggable'
import { mapState } from 'vuex'
import Sortable from 'sortablejs'
import { getBtnPer } from '@/assets/js/util'

function getByteLen(val) {
  var len = 0
  for (var i = 0; i < val.length; i++) {
    var a = val.charAt(i)
    if (a.match(/[^\x00-\xff]/gi) != null) {
      len += 2
    } else {
      len += 1
    }
  }
  return len
}

export default {
  name: 'employeeCategory',
  data() {
    return {
      title: '人员属性分类',
      tableData: [], //表格数据
      showTableData: [], //前端分页的表格数据
      prsValCoList: [], //工资数据来源 数据 来源model内数据
      showAddModal: false, //新增model的显示
      saveConfigLoading: false, //按钮loading
      editData: { row: {} },
      /* 分页配置 */
      page: {
        tableName: 'employeeCategory',
        currentPage: 1,
        pageSize: 50,
        pageSizes: [10, 20, 30, 50, 100, '全部'],
        total: 0,
      },
      /* 分页 */
      currentPage: 1,
      pageSize: 50,
      classCode: '',
      className: '',
      ordIndex: '',
      isUsed: 'Y',
      isSys: 'N',
      remark: '', //备注
      propDataList: [],
      selectPropDataList: [], //已选的属性列表
      checkedAll: false,
      initChecked: true,
      itemChecked: false,
      isEdit: false,
      queryClassCode: '',
    }
  },
  created() {
    this.tableH = this.containerH - 146
    this.getTableData()
  },
  beforeDestroy() {
    if (this.sortable) {
      this.sortable.destroy()
    }
  },
  components: {
    vuedraggable,
  },
  computed: {
    ...mapState({
      pfData: (state) => state.pfData,
      containerH: (state) => state.containerH,
    }),
  },
  methods: {
    getBtnPer,
    /**
     * @description: 打印
     */
    print() {
      this.$refs.xTable.print()
    },
    /**
     * @description: 导出
     */
    exportEvent() {
      this.$refs.xTable.exportData()
    },
    onClickShowAddModal() {
      this.isEdit = false
      this.queryClassCode = ''
      this.classCode = ''
      this.className = ''
      this.ordIndex = ''
      this.isUsed = 'Y'
      this.isSys = 'N'
      this.remark = '' //备注
      this.showAddModal = true
      this.propDataList = []
      this.selectPropDataList = [] //已选的属性列表
      this.getPropDataList()
    },
    /**
     * @description: 可选属性改变
     */
    onChange(prop, item, index, event) {
      this.itemChecked = true
      if (event.target.checked) {
        //选中
        this.propDataList.forEach((it) => {
          if (it['PROPERTY_CODE'] === prop) {
            it.checked = true
          }
        })
        let obj = {
          propertyCode: prop,
          propertyName: item['PROPERTY_NAME'],
          isEmpty: 'N',
          isVisible: 'N',
        }
        this.selectPropDataList.push(obj)
      } else {
        //取消选中
        this.propDataList.forEach((it) => {
          if (it['PROPERTY_CODE'] === prop) {
            it.checked = false
          }
        })
        let cur = 0
        this.selectPropDataList.forEach((it, ind) => {
          if (it.propertyCode === prop) {
            cur = ind
          }
        })
        //从显示的里面删掉一条
        this.selectPropDataList.splice(cur, 1)
      }
      this.checkedAll = this.propDataList.every((it) => {
        return it.checked === true
      })
    },
    /**
     * @description: 关闭弹窗
     */
    close() {
      this.showAddModal = false
    },
    /**
     * @description:
     */
    getPropDataList() {
      this.$axios
        .post('/ma/emp/personType/selectEmpClassProperty?roleId=' + this.pfData.svRoleId, {
          agencyCode: '*',
          classCode: this.queryClassCode,
          rgCode: this.pfData.svRgCode,
        })
        .then((result) => {
          if (result.data.flag === 'success') {
            this.selectPropDataList = result.data.data
            return this.$axios.get('/ma/emp/maEmpProperty/selectMaEmpPropertyNotUseByClass', { params: { roleId: this.pfData.svRoleId, isSys: 'N' } })
          } else {
            throw result.data.msg
          }
        })
        .then((result) => {
          if (result.data.flag === 'success') {
            console.log(result.data.data)
            result.data.data.forEach((item) => {
              if (
                this.selectPropDataList.some((it) => {
                  return it.propertyCode === item['PROPERTY_CODE']
                })
              ) {
                item.checked = true
              }
            })
            this.propDataList = result.data.data
          } else {
            throw result.data.msg
          }
        })
        .catch(this.$showError)
    },
    /**
     * @description: 批量删除
     */
    del() {
      let checkedRows = this.$refs.xTable.getCheckboxRecords()
      if (checkedRows.length === 0) {
        this.$message.warning('请选择要删除的数据！')
        return
      }
      //系统预置数据不可删除
      if (
        checkedRows.some((item) => {
          return item.isSys === 'Y'
        })
      ) {
        this.$message.warning('系统预置数据不可删除！')
        return
      }
      let classCodes = checkedRows.map((item) => {
        return item.classCode
      })
      let argu = {
        classCodes,
        agencyCode: '*',
        rgCode: this.pfData.svRgCode,
      }
      this.$confirm({
        title: '确定删除选中的数据吗？',
        content: '',
        okText: '确定',
        cancelText: '取消',
        onOk: () => {
          this.$axios
            .post('/ma/emp/EmpClass/delEmpClass', argu)
            .then((result) => {
              if (result.data.flag === 'success') {
                this.getTableData()
              } else {
                throw result.data.msg
              }
            })
            .catch(this.$showError)
        },
        onCancel: () => {},
      })
    },
    /**
     * @description: 只删除一个
     */
    delOne(row) {
      if (row.isSys === 'Y') {
        this.$message.warning('系统预置数据不可删除！')
        return
      }
      let classCodes = [row.classCode]
      let argu = {
        classCodes,
        agencyCode: '*',
        rgCode: this.pfData.svRgCode,
      }
      this.$confirm({
        title: '确定删除选中的数据吗？',
        content: '',
        okText: '确定',
        cancelText: '取消',
        onOk: () => {
          this.$axios
            .post('/ma/emp/EmpClass/delEmpClass', argu)
            .then((result) => {
              if (result.data.flag === 'success') {
                this.getTableData()
              } else {
                throw result.data.msg
              }
            })
            .catch(this.$showError)
        },
        onCancel: () => {},
      })
    },
    /**
     * @description: 启用
     */
    enable() {
      this.able('enable')
    },
    /**
     * @description: 停用
     */
    disable() {
      this.able('disable')
    },
    /**
     * @description:
     * @param {String} flag 标记
     */
    able(flag) {
      let tip = ''
      if (flag === 'enable') {
        tip = '启用'
      } else {
        tip = '停用'
      }
      let checkedRows = this.$refs.xTable.getCheckboxRecords()
      if (checkedRows.length === 0) {
        this.$message.warning(`请选择要${tip}的数据！`)
        return
      }
      this.$showLoading()
      let classCodes = checkedRows.map((item) => {
        return item.classCode
      })
      let argu = {
        action: 'active',
        agencyCode: '*',
        classCode: classCodes,
        rgCode: this.pfData.svRgCode,
      }
      if (flag === 'disable') {
        argu.action = 'unactive'
      }
      this.$axios
        .post('/ma/emp/EmpClass/able', argu)
        .then((result) => {
          if (result.data.flag === 'success') {
            this.$hideLoading()
            this.getTableData()
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
        this.currentPage = 1
        this.pageSize = 999999999
      } else {
        this.currentPage = currentPage
        this.pageSize = pageSize
      }
      //前端分页
      this.showTableData = this.tableData.slice(this.pageSize * (this.currentPage - 1), this.pageSize * this.currentPage)
    },
    /**
     * @description: 获取表格数据
     */
    getTableData() {
      this.$showLoading()
      this.$axios
        .post('/ma/emp/EmpClass/selectEmpClass', {
          agencyCode: '*',
          rgCode: this.pfData.svRgCode,
        })
        .then((result) => {
          if (result.data.flag != 'fail') {
            this.$hideLoading()
            result.data.data.forEach((item) => {
              if (item.isUsed === 'Y') {
                item.isUsedStr = '是'
              } else {
                item.isUsedStr = '否'
              }
              if (item.isSys === 'Y') {
                item.isSysStr = '是'
              } else {
                item.isSysStr = '否'
              }
              if (item.isLimit === 'Y') {
                item.isLimitStr = '是'
              } else {
                item.isLimitStr = '否'
              }
            })
            this.page.total = result.data.data.length
            this.tableData = result.data.data
            this.showTableData = this.tableData.slice(0, this.pageSize)
          } else {
            throw result.data.msg
          }
        })
        .catch(this.$showError)
    },
    /**
     * @description:打开编辑弹窗
     */
    editRow(row, rowIndex) {
      console.log(row, rowIndex)
      this.isEdit = true
      this.queryClassCode = row.classCode
      this.classCode = row.classCode
      this.className = row.classCode
      this.ordIndex = row.ordIndex
      this.isUsed = row.isUsed
      this.isSys = row.isSys
      this.remark = row.remark //备注
      this.showAddModal = true
      this.propDataList = []
      this.selectPropDataList = [] //已选的属性列表
      this.getPropDataList()
    },
    /**
     * @description: 保存
     */
    save() {
      if (!this.classCode) {
        this.$message.warning('请填写类别代码')
        return
      }
      if (!this.className) {
        this.$message.warning('请写类别名称')
        return
      }
      if (getByteLen(this.classCode) > 30) {
        this.$message.warning('类别代码不能超过30个字符')
        return
      }
      if (getByteLen(this.className) > 60) {
        this.$message.warning('类别名称不能超过60个字符')
        return
      }
      this.$showLoading()
      let argu = {
        classCode: this.classCode,
        className: this.className,
        ordIndex: this.ordIndex,
        isUsed: this.isUsed,
        isSys: this.isSys,
        remark: this.remark,
      }
      argu.agencyCode = '*'
      argu.rgCode = this.pfData.svRgCode
      this.selectPropDataList.forEach((item, index) => {
        item.ordIndex = index
      })
      argu.empClassProperty = this.selectPropDataList
      if (this.isEdit) {
        argu.op = '1'
      } else {
        argu.op = '0'
      }
      this.$axios
        .post('/ma/emp/EmpClass/saveEmpClass', argu)
        .then((result) => {
          this.$hideLoading()
          if (result.data.flag === 'success') {
            this.$message.success('保存成功！')
            this.close()
            this.getTableData()
          } else {
            throw result.data.msg
          }
        })
        .catch(this.$showError)
    },
  },
}
</script>
<style scoped>
.label {
  width: 80px;
}
.requireMark {
  width: 10px;
  height: 18px;
  line-height: 22px;
  color: red;
  font-size: 18px;
  box-sizing: border-box;
  margin-left: 10px;
}
.form-ele {
  width: 200px;
}
.couldPropWrap,
.selectedPropWrap {
  border-radius: 4px;
  border: 1px solid #d9d9d9;
  width: 400px;
  box-sizing: border-box;
  height: 200px;
  overflow-y: auto;
}
.couldPropWrap {
  padding: 10px;
}
.toolbar {
  padding: 8px 0 5px 0;
  display: flex;
  justify-content: flex-end;
}
.selectedPropItem {
  padding: 5px 10px;
  cursor: move;
}
</style>
