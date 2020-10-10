<!--
 * @Author: sunch
 * @Date: 2020-06-02 10:05:54
 * @LastEditTime: 2020-08-21 12:35:22
 * @LastEditors: Please set LastEditors
 * @Description: 工资项显示设置
 * @FilePath: /agla-fe-8.50/vuedev/src/views/prs/salarySetting/salarySetting.vue
-->
<template>
  <div>
    <!-- 头部开始 -->
    <ufHeader :title="title">
      <template slot="btns">
        <a-button class="mr-5" :class="getBtnPer('btn-config')" @click="config">设置工资数据来源</a-button>
        <a-button type="primary" class="mr-5" :class="getBtnPer('btn-save')" @click="save">保存</a-button>
      </template>
    </ufHeader>

    <vxe-table size="mini" border row-key ref="xTable1" class="xTable" :data="tableData" header-align="center" :height="tableH">
      <vxe-table-column min-width="100" field="pritemCode" title="工资项代码" align="center" show-overflow></vxe-table-column>
      <vxe-table-column min-width="100" field="pritemName" title="工资项目" show-overflow></vxe-table-column>
      <vxe-table-column width="120" field="pritemPropStr" title="工资项目性质" align="center" show-overflow></vxe-table-column>
      <vxe-table-column min-width="80" field="pritemDataSourceStr" title="工资数据来源" align="center" show-overflow></vxe-table-column>
      <vxe-table-column width="160" field="isShowZeroStr" title="金额为0显示给个人" align="center" show-overflow></vxe-table-column>
      <vxe-table-column width="100" type="seq" title="显示顺序" align="center" show-overflow></vxe-table-column>
      <vxe-table-column width="120" field="personDisStr" title="个人端是否显示" align="center" show-overflow></vxe-table-column>
      <vxe-table-column width="120" field="smsDisStr" title="短信是否显示" align="center" show-overflow></vxe-table-column>
      <vxe-table-column width="100" align="center" title="操作">
        <template v-slot="{ row,rowIndex }">
          <div style="font-size: 16px;">
            <a-icon type="edit" :class="getBtnPer('btn-edit')" style="cursor: pointer;" @click="editRow(row,rowIndex)"/>
            <a-icon type="drag" class="drag-btn" />
          </div>
        </template>
      </vxe-table-column>
    </vxe-table>

    <uf-modal title="设置工资数据来源" v-model="configVisible" @cancel="configClose" :width="500">
      <div class="listWrap myscrollbar">
        <div class="wrapper">
          <div class="colsCtrlRow colsCtrlHeader">
            <div class="colSeq">序号</div>
            <div class="colSetName">
              名称
            </div>
            <div class="colsCtrlBtns">
              操作
            </div>
          </div>
          <div class="dragWrap myscrollbar">
            <vuedraggable v-model="prsValCoList">
              <transition-group>
                <div class="colsCtrlRow" v-for="(item, index) in prsValCoList" :key="item.valId">
                  <div class="colSeq">{{ index + 1 }}</div>
                  <div class="colSetName">
                    <input class="setNameInput" type="text" v-model="item.val" maxlength="8" :ref="'setInp'+index" />
                  </div>
                  <div class="colsCtrlBtns">
                    <a-icon type="drag" style="margin-left: 8px;cursor: pointer;font-size: 16px;" />
                    <a-icon type="delete" @click="delSettingItem(item, index)" style="margin-left: 8px;cursor: pointer;font-size: 16px;" />
                  </div>
                </div>
              </transition-group>
            </vuedraggable>
          </div>
          <div class="addColWrap">
            <div class="addCol" @click="addSetting">
              <a-icon type="plus" style="font-size: 16px;" />
            </div>
          </div>
        </div>
      </div>

      <template slot="footer">
        <a-button key="save" class="mr-10" type="primary" :loading="saveConfigLoading" @click="saveConfig(false)">
          保存
        </a-button>
        <a-button key="cancel" @click="configClose">
          关闭
        </a-button>
      </template>
    </uf-modal>

    <EditSalarySetting :visible="editSettingVisible" :editData="editData" @editSettingClose="editSettingVisible=false" @editSettingConfirm="editSettingConfirm"></EditSalarySetting>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import Sortable from 'sortablejs'
import EditSalarySetting from './components/EditSalarySetting'
import vuedraggable from 'vuedraggable'
import { getBtnPer } from '@/assets/js/util'
const PRITEM_PROPS = [
  { label: '应发项', value: '1' },
  { label: '实发项', value: '2' },
  { label: '扣发项', value: '3' },
  { label: '补发项', value: '4' },
]
const PERSON_DIS = [
  { label: '是', value: 'Y' },
  { label: '否', value: 'N' },
]
const SMS_DIS = [
  { label: '是', value: 'Y' },
  { label: '否', value: 'N' },
]
const IS_SHOW_ZERO = [
  { label: '是', value: 'Y' },
  { label: '否', value: 'N' },
]
export default {
  name: 'salarySetting',
  data() {
    return {
      title: '工资项显示设置',
      tableData: [],//表格数据
      prsValCoList: [], //工资数据来源 数据 来源model内数据
      configVisible: false, //来源model的显示
      saveConfigLoading: false, //按钮loading
      editSettingVisible: false,
      editData: { row: {} }
    }
  },
  created() {
    this.tableH = this.containerH - 86
    this.getTableData()
  },
  beforeDestroy() {
    if (this.sortable) {
      this.sortable.destroy()
    }
  },
  components: {
    vuedraggable,
    EditSalarySetting
  },
  computed: {
    ...mapState({
      containerH: (state) => state.containerH,
    }),
  },
  methods: {
    getBtnPer,
    /**
     * @description: 获取表格数据
     */
    getTableData() {
      this.$showLoading()
      this.$axios
        .get('/prs/PrsValCo/getPrsValCoByValsetId?valsetId=VS_ITEM_DATASOURCE')
        .then((result) => {
          if (result.data.flag != 'fail') {
            console.log(result.data.data)
            this.prsValCoList = result.data.data
            this.$set(this.editData,'prsValCoList', this.prsValCoList)
          } else {
            this.$message.error(result.data.msg)
          }
          return this.$axios.post('/prs/prsitemco/getPrsItemSettingList', { pritemCode: '', pritemName: '' })
        })
        .then((result) => {
          this.$hideLoading()
          if (result.data.flag != 'fail') {
            result.data.data.forEach((item) => {
              PRITEM_PROPS.forEach((it) => {
                if (it.value === item.pritemProp) {
                  item.pritemPropStr = it.label
                }
              })
              PERSON_DIS.forEach((it) => {
                if (it.value === item.personDis) {
                  item.personDisStr = it.label
                }
              })
              SMS_DIS.forEach((it) => {
                if (it.value === item.smsDis) {
                  item.smsDisStr = it.label
                }
              })
              IS_SHOW_ZERO.forEach((it) => {
                if (it.value === item.isShowZero) {
                  item.isShowZeroStr = it.label
                }
              })
              this.prsValCoList.forEach((it) => {
                if (it.valId === item.pritemDataSource) {
                  item.pritemDataSourceStr = it.val
                }
              })
            })
            this.tableData = result.data.data
            this.rowDrop()
          } else {
            throw result.data.msg
          }
        })
        .catch(this.$showError)
    },
    /**
     * @description: 设置表格拖拽
     */
    rowDrop() {
      this.$nextTick(() => {
        let xTable = this.$refs.xTable1
        this.sortable = Sortable.create(xTable.$el.querySelector('.body--wrapper>.vxe-table--body tbody'), {
          handle: '.drag-btn',
          onEnd: ({ newIndex, oldIndex }) => {
            let currRow = this.tableData.splice(oldIndex, 1)[0]
            this.tableData.splice(newIndex, 0, currRow)
          },
        })
      })
    },
    /**
     * @description: 
     */
    editRow(row,rowIndex){
      this.$set(this.editData, 'row', row)
      this.$set(this.editData, 'rowIndex', rowIndex)
      this.editSettingVisible = true
    },
    editSettingConfirm(res){
      this.editSettingVisible = false
      for(let prop in this.tableData[res.rowIndex]){
        if(prop==='pritemProp'||prop==='pritemDataSource'||prop==='personDis'||prop==='smsDis'){
          this.tableData[res.rowIndex][prop] = res.row[prop]
          // this.$set(this.tableData[res.rowIndex],prop,res.row[prop])
        }
      }
      this.tableData.forEach(item =>{
        if(!item.pritemProp){
          item.pritemPropStr = ''
        }else{
          PRITEM_PROPS.forEach((it) => {
              if (it.value === item.pritemProp) {
                item.pritemPropStr = it.label
              }
          })
        }
        PERSON_DIS.forEach((it) => {
          if (it.value === item.personDis) {
            item.personDisStr = it.label
          }
        })
        SMS_DIS.forEach((it) => {
          if (it.value === item.smsDis) {
            item.smsDisStr = it.label
          }
        })
        IS_SHOW_ZERO.forEach((it) => {
          if (it.value === item.isShowZero) {
            item.isShowZeroStr = it.label
          }
        })
        if(!item.pritemDataSource){
          item.pritemDataSourceStr = ''
        }else{
          this.prsValCoList.forEach((it) => {
            if (it.valId === item.pritemDataSource) {
              item.pritemDataSourceStr = it.val
            }
          })
        }
      })
      this.$refs.xTable1.updateData()
      console.log(this.tableData)
    },
    /**
     * @description: 打开设置modal
     */
    config() {
      this.configVisible = true
    },
    /**
     * @description: 点击添加一行
     */
    addSetting() {
      let len = this.prsValCoList.length,
      ordIndex = len + 1
      //随机数函数
      function getRandomNum() {
          return String(Math.floor(Math.random() * 10));
      }
      //文件夹需要一个随机数
      let num1 = getRandomNum(), num2 = getRandomNum();
      let randomStr = String(new Date().getTime()) + num1 + num2;

      this.prsValCoList.push({
        valId: randomStr,
        val: '',
        ordIndex: ordIndex
      })
      this.$nextTick(()=>{
        let $el = this.$refs['setInp' + len]
        $el[0].focus()
      })
    },
    /**
     * @description: 保存设置
     * @param {Boolean} 是否显示按钮loading和成功后关闭窗口
     */
    saveConfig(noloading){
      let flag = false
      this.prsValCoList.forEach((item,index) => {
        if(!item.val){
          flag = true
        }
      })
      if(flag){
        this.$message.error('有工资数据来源的名称为空，请检查')
        return 
      }
      if(!noloading){
        this.saveConfigLoading = true
      }
      let argu = {
        valsetId: 'VS_ITEM_DATASOURCE'
      }
      let list = []
      this.prsValCoList.forEach((item,index) => {
        let obj = {
          valId: item.valId,
          val: item.val,
          ordIndex: index + 1
        }
        list.push(obj)
      })
      argu.prsValCoList = list
      this.$showLoading()
      this.$axios.post('/prs/PrsValCo/savePrsValCo',argu).then(result =>{
        this.$hideLoading()
        if(result.data.flag != 'fail'){
          this.$message.success('保存成功！')
          if(!noloading){
              this.saveConfigLoading = false
              this.configClose()
          }
        }else{
          throw result.data.msg
        }
      }).catch(this.$showError)
    },
    /**
     * @description: 设置modal关闭
     */
    configClose(){
      this.configVisible = false
    },
    /**
     * @description: 删除
     */
    delSettingItem(item, index) {
      console.log(item, index)
      this.$confirm({
        title: '确定要删除该条数据来源吗?',
        content: '',
        okText: '确定',
        cancelText: '取消',
        onOk: () => {
          this.prsValCoList.splice(index,1)
          this.saveConfig(true)
        },
        onCancel: () => {}
      })
    },
    /**
     * @description: 保存
     */
    save() {
      this.tableData.forEach((item, index) =>{
        item.showIndex = index + 1
      })
      this.$showLoading()
      this.$axios
        .post('/prs/prsitemco/updatePrsItemSettingList', { settingList: this.tableData })
        .then((result) => {
          this.$hideLoading()
          if (result.data.flag != 'fail') {
            this.$message.success(result.data.msg)
            //刷新表格数据
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
.xTable {
  margin-top: 20px;
}
.drag-btn {
  margin-left: 20px;
  cursor: pointer;
}
/* 设置 modal的样式 */
.listWrap {
  width: 100%;
}
.wrapper {
  border-bottom: 1px solid #ddd;
  border-radius: 4px;
  border: 1px solid #ddd;
}
.dragWrap {
  max-height: 200px;
  overflow-y: scroll;
}
.colsCtrlRow {
  display: flex;
  border-bottom: 1px solid #ddd;
}
.colsCtrlRow:last-child {
  border: 0;
}
.colsCtrlHeader {
  border-bottom: 1px solid #ddd;
}
.colSeq {
  width: 10%;
  text-align: center;
  border-right: 1px solid #ddd;
  line-height: 34px;
  box-sizing: border-box;
}
.colSetName {
  width: 70%;
  text-align: center;
  box-sizing: border-box;
  padding: 5px 20px;
  border-right: 1px solid #ddd;
  height: 36px;
  line-height: 26px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.colsCtrlBtns {
  width: 20%;
  text-align: center;
  box-sizing: border-box;
  line-height: 36px;
  border-right: 1px solid #ddd;
}
.colsCtrlHeader {
  padding-right: 10px;
}
.colsCtrlHeader .colSeq,
.colsCtrlHeader .colsCtrlBtns {
  height: 30px;
  line-height: 30px;
}
.colsCtrlHeader .colSetName {
  height: 30px;
  line-height: 20px;
}
.setNameInput {
  display: inline-block;
  width: 100%;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  text-align: center;
  outline: none;
}
.addColWrap {
  padding: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-top: 1px solid #ddd;
}
.addCol {
  width: 50%;
  height: 30px;
  border: 1px dashed #ddd;
  display: flex;
  align-items: center;
  justify-content: center;
}
/* 设置 modal的样式 end */
</style>
