<!--
 * @Author: sunch
 * @Date: 2020-07-10 17:26:57
 * @LastEditTime: 2020-09-10 17:04:52
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /agla-fe-8.50/vuedev/src/views/prs/periodEndClosing/components/SendMsgModal.vue
-->
<template>
  <uf-modal v-model="visible" @cancel="cancel" :width="900" :title="'发消息'">
    <div style="position: relative;">
      <div class="flex-start align-items-start">
        <div class="label">消息内容：</div>
        <a-textarea v-model="message"></a-textarea>
      </div>

      <div class="flex-between mt-10">
        <!-- <div>
          <div class="label">工资类别：</div>
          <a-select class="form-select" :defaultValue="''" allowClear @change="prtypeCodeChange">
            <a-select-option v-for="item in prtypeList" :key="item.prtypeCode" :value="item.prtypeCode">
              {{ item.prtypeName }}
            </a-select-option>
          </a-select>
        </div> -->
        <!-- 添加 click.stop 阻止allowclear按钮的点击事件穿透 -->
        <div class="flex-start" @click.stop>
          <div class="label">搜索人员：</div>
          <a-input class="searchEmp" v-model="searchText" allowClear placeholder="请输入人员信息关键字" @keyup.enter="onSearch(searchText)">
            <template v-slot:addonAfter>
              <div class="searchButton" @click="onSearch(searchText)">
                <a-icon v-if="showSearchLoading" style="padding-top: 2px;" ref="searchIcon" type="loading" />
                <a-icon v-else style="padding-top: 2px;" ref="searchIcon" type="search" />
              </div>
            </template>
          </a-input>
        </div>
      </div>

      <!-- 表格 开始 -->
      <vxe-grid border stripe resizable head-align="center" height="300" show-header-overflow show-overflow size="mini" ref="xTable" :auto-resize="true" class="xtable mytable-scrollbar mt-10" :columns="defaultColumns" :data="filterTableData" :highlight-hover-row="true" :checkbox-config="{ reserve: true }" :toolbar="{ id: 'SendMsgModal', resizable: { storage: true } }"> </vxe-grid>
      <!-- 表格 结束-->

      <ufLocalLoading :visible="formLoading"></ufLocalLoading>
    </div>
    <template v-slot:footer>
      <div>
        <div class="flex-between">
          <a-button @click="reverseCheck">反选</a-button>
          <div>
            <a-button type="primary" class="mr-10" @click="send">发送</a-button>
            <a-button @click="cancel">取消</a-button>
          </div>
        </div>
      </div>
    </template>
  </uf-modal>
</template>
<script>
import { mapActions } from 'vuex'
import XEUtils from 'xe-utils'
import { defaultColumns } from './defaultColumns'

export default {
  name: 'sendMsgModal',
  props: ['value', 'prtypeCode', 'mo', 'payNoMo'],
  data() {
    return {
      visible: false, //可见标记
      prtypeCodeList: [], //工资类别列表
      tableData: [], //表格数据
      defaultColumns,
      empList: [], //消息接收人
      message: '', //信息为空
      showChoiceEmp: '', //显示选择的人员
      showSearchLoading: false, //搜索loading显示
      formLoading: false, //弹窗内loading
      searchText: '',
      filterTableData: []
    }
  },
  watch: {
    value(val) {
      if (val) {
        this.visible = val
        this.prtypeCodeChange()
      }
    },
    /**
     * @description: 如果清空显示表格原数据
     */
    searchText(val){
      if(!val){
        this.filterTableData = this.tableData
      }
    }
  },
  methods: {
    /**
     * @description: 搜索
     */
    onSearch(val) {
      console.log(val)
      if (val) {
        let filterText = XEUtils.toString(val).trim()
        this.filterTableData = this.tableData.filter((item) => {
          let flag = false
          for(let prop in item){
            if(XEUtils.toString(item[prop]).toLowerCase().indexOf(filterText) > -1){
              flag = true
            }
          }
          return flag
        })
      } else {
        this.filterTableData = this.tableData
      }
    },
    /**
     * @description: 取消
     */
    cancel() {
      this.visible = false
      this.message = ''
      this.searchText = ''
      this.tableData = []
      this.$emit('close')
    },
    /**
     * @description: 发送消息
     */
    send() {
      let checkedEmp = this.$refs.xTable.getCheckboxRecords()
      let ids = checkedEmp.filter(item => {
        return !!item.userId
      }).map(item => {
        return item.userId
      })
      if (checkedEmp.length === 0) {
        this.$message.error('请选择消息接收人')
        return
      }
      if (!this.message) {
        this.$message.error('发送消息不能为空')
        return
      }
      this.formLoading = true
      this.$axios
        .post('/prs/prsclose/sendMsg', {
          param: {
            content: this.message, //消息内容
          },
          receiver: ids, //接收人Id
        })
        .then((result) => {
          this.formLoading = false
          if(result.data.flag === 'success'){
            this.$message.success(result.data.msg)
          }else{
            throw result.data.msg
          }
        })
        .catch(this.$showError)
    },
    /**
     * @description: 工资类别改变
     */
    prtypeCodeChange() {
      console.log(this.prtypeCode)
      this.formLoading = true
      this.$axios
        .post('/ma/emp/maEmp/getMaEmpByPrtypeCodes', { prtypeCode: this.prtypeCode, mo: this.mo, payNoMo: this.payNoMo })
        .then((result) => {
          this.formLoading = false
          if (result.data.flag === 'success') {
            this.tableData = result.data.data
            this.filterTableData = this.tableData
          } else {
            throw result.data.msg
          }
        })
        .catch(this.$showError)
    },
    /**
     * @description: 反选
     */
    reverseCheck() {
      let $table = this.$refs.xTable
      // 获取已选中的行数据
      let checkedData = $table.getCheckboxRecords()
      //全部选择
      $table.setAllCheckboxRow(true)
      //切换某一行的选中状态
      $table.setCheckboxRow(checkedData, false)
    },
  },
}
</script>
<style lang="scss" scoped>
.label {
  min-width: 90px;
}
.form-select {
  width: 220px;
}
.searchEmp {
  width: 220px;
}
.search {
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
  color: #ccc;
}
.searchButton {
  box-sizing: border-box;
  padding-top: 2px;
  cursor: pointer;
}
</style>
