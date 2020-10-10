<!--
 * @Author: sunch
 * @Date: 2020-03-24 01:03:00
 * @LastEditTime: 2020-10-09 14:20:39
 * @LastEditors: Please set LastEditors
 * @Description: 调栏列表设置
 * @FilePath: /ufgov-vue/src/views/prs/wageDetailReport/components/setColsSettingModal.vue
 -->
<template>
  <div>
    <!-- 表栏目设置窗口 开始 -->
    <uf-modal title="调栏" v-model="settingModalVisible" @cancel="close" :width="500">
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
            <vuedraggable v-model="settingList">
              <transition-group>
                <div class="colsCtrlRow" v-for="(item, index) in settingList" :key="item.planId">
                  <div class="colSeq">{{ index + 1 }}</div>
                  <div class="colSetName">
                    <input class="setNameInput" type="text" v-model="item.planName" maxlength="8" onfocus="this.select()" />
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
              <a-icon :type="addSettingLoading ? 'loading' : 'plus'" style="font-size: 16px;" />
            </div>
          </div>
        </div>
      </div>

      <template slot="footer">
        <a-button key="save" type="primary" class="mr-10" :loading="saveLoading" @click="save">
          保存
        </a-button>
        <a-button key="cancel" @click="close">
          关闭
        </a-button>
      </template>
    </uf-modal>
    <!-- 表栏目设置窗口 结束 -->
  </div>
</template>
<script>
import vuedraggable from 'vuedraggable'
import { mapState, mapActions } from 'vuex'
export default {
  name: 'setColsSettingModal',
  data() {
    return {
      settingModalVisible: false,
      saveLoading: false,
      settingList: [],
      addSettingLoading: false
    }
  },
  components: {
    vuedraggable
  },
  props: ['visible', 'list', 'pageId', 'prtypeCode'],
  watch: {
    visible(val) {
      if (val) {
        this.settingModalVisible = true
        if (this.list.length > 0) {
          this.settingList = JSON.parse(JSON.stringify(this.list))
          console.log(this.settingList)
        } else {
          this.addSetting()
        }
      }
    }
  },
  computed: {
    ...mapState({
      json: state => state.setCols.json,
      planId: state => state.setCols.planId
    })
  },
  methods: {
    ...mapActions(['setColumnsNoSeq','setWageTableColsPlan']),
    /**
     * @description: 保存按钮
     */
    save() {
      this.saveLoading = true
      let argu = {
        prsQueryPlanList: []
      }
      this.settingList.forEach((item, index) => {
        argu.prsQueryPlanList.push({ planId: item.planId, planName: item.planName, ordIndex: index + 1 })
      })
      this.$axios
        .post('/prs/prsqueryplan/updateBatchPrsQueryPlan', argu)
        .then(result => {
          console.log(result)
          if (result.data.flag === 'success') {
            this.saveLoading = false
            this.close()
          } else {
            throw result.data.msg
          }
        })
        .catch(error => {
          console.log(error)
          this.saveLoading = false
          this.$message.error(error)
        })
    },
    /**
     * @description: 窗口关闭
     */
    close() {
      this.settingModalVisible = false
      this.$emit('settingModalClose')
      this.settingList = []
    },
    /**
     * @description: 删除
     */
    delSettingItem(item, index) {
      console.log(item, index)
      if (!item.planId) {
        this.$message.error('未能找到该条设置的planId')
        return
      }
      if (this.settingList.length === 1) {
        this.$message.warning('保留至少一条表栏目')
        return
      }
      this.$confirm({
        title: '确定要删除该表栏目吗?',
        content: '',
        okText: '确定',
        cancelText: '取消',
        onOk: () => {
          this.$showLoading()
          let argu = {
            prsQueryPlanList: [{ planId: item.planId }]
          }
          this.$axios
            .post('/prs/prsqueryplan/deleteBatchPrsQueryPlan', argu)
            .then(result => {
              console.log(result)
              if (result.data.flag === 'success') {
                this.settingList.splice(index, 1)
                this.$hideLoading()
              } else {
                throw result.data.msg
              }
            })
            .catch(this.showError)
        },
        onCancel: () => {}
      })
    },
    /**
     * @description: 点击添加一行
     */
    addSetting() {
      if (this.addSettingLoading) {
        return
      }
      if (this.settingList.length > 9) {
        this.$message.warning('目前最多可以新建10条表栏目')
        return
      }
      this.addSettingLoading = true
      let ordIndex = this.settingList.length + 1
      //新增查询方案
      this.$axios
        .post('/prs/prsqueryplan/savePrsQueryPlan', {
          prtypeCode: this.prtypeCode,
          json: '', //需要保存的JSON数据
          isUpdate: '0', //保存状态：1 更新，0 新增
          planId: '',
          ordIndex: ordIndex,
          planName: '表栏目-' + String(ordIndex),
          pageId: this.pageId
        })
        .then(result => {
          console.log(result)
          if (result.data.flag === 'success') {
            this.settingList.push({
              planId: result.data.data.planId,
              prtypeCode: this.prtypeCode,
              pageId: 'PRS_SALARY_DETAIL',
              ordIndex: ordIndex,
              planName: '表栏目-' + String(ordIndex)
            })
            console.log(this.planId)
            this.addSettingLoading = false
          } else {
            throw result.data.msg
          }
        })
        .catch(error => {
          console.log(error)
          this.$message.error(error)
          this.addSettingLoading = false
        })
    }
  }
}
</script>
<style scoped>
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
</style>
