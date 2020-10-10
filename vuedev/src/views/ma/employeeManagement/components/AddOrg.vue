<!--
 * @Author: your name
 * @Date: 2020-06-12 11:22:47
 * @LastEditTime: 2020-08-12 14:29:56
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /agla-fe-8.50/vuedev/src/views/ma/employeeManagement/components/AddOrg.vue
-->
<template>
  <uf-modal title="新增部门" v-model="addOrgModalVisible" @cancel="addOrgModalCancel" :width="720">
    <div class="main">
      <div class="leftCol">
        <div class="row">
          <div class="label">部门编码：</div>
          <a-input class="addOrgInput" v-model="orgCode"></a-input>
        </div>
        <div class="row">
          <div class="label">部门名称：</div>
          <a-input class="addOrgInput" v-model="orgName"></a-input>
        </div>
        <div class="row">
          <div class="label">联系电话：</div>
          <a-input class="addOrgInput" v-model="phoneNum"></a-input>
        </div>
        <div class="row">
          <div class="label">负责人：</div>
          <a-select allowClear v-model="principal" class="select" @change="principalChange">
            <a-select-option v-for="item in principalList" :key="item.valId" :value="item.valId">
              {{ item.val }}
            </a-select-option>
          </a-select>
        </div>
        <div class="row">
          <div class="label">分管负责人：</div>
          <a-select allowClear v-model="subPrincipal" class="select" @change="subPrincipalChange">
            <a-select-option v-for="item in subPrincipalList" :key="item.valId" :value="item.valId">
              {{ item.val }}
            </a-select-option>
          </a-select>
        </div>
        <div class="row">
          <div class="label">状态：</div>
          <a-radio-group v-model="state" button-style="solid" size="small">
            <a-radio-button :value="1">
              是
            </a-radio-button>
            <a-radio-button :value="0">
              否
            </a-radio-button>
          </a-radio-group>
        </div>
      </div>
      <div class="rightCol">
          <div class="infoWrap">
              <div class="infoHead">参考信息</div>
              <div class="info">
                  <p>编码规则：3-3-2</p>
                  <p>请输入部门编码获得参考信息</p>
              </div>
          </div>
      </div>
    </div>
    <template slot="footer">
      <a-button key="saveAdd" type="primary" class="mr-10" :loading="addOrgModalLoading" @click="saveAdd">
        保存并新增
      </a-button>
      <a-button key="save" class="mr-10" :loading="addOrgModalLoading" @click="save">
        保存
      </a-button>
      <a-button key="cancel" @click="addOrgModalCancel">
        取消
      </a-button>
    </template>
  </uf-modal>
</template>
<script>
export default {
  props: ['visible'],
  data() {
    return {
      addOrgModalVisible: false,
      addOrgModalLoading: false,
      orgCode: '',
      orgName: '',
      phoneNum: '',
      state: 1,
      principalList: [],
      subPrincipalList: [],
      principal: '',
      subPrincipal: ''
    }
  },
  watch: {
    visible(val) {
      if (val) {
        this.addOrgModalVisible = true
      }
    },
  },
  methods: {
    /**
     * @description: 保存并新增
     */
    saveAdd() {},
    /**
     * @description: 保存
     */
    save() {},
    /**
     * @description: 取消并关闭窗口 并使所有输入内容重置
     */
    addOrgModalCancel() {
      this.addOrgModalVisible = false
      this.resetModal()
      this.$emit('addOrgModalClose', false)
    },
    /**
     * @description: 所有输入内容重置
     */
    resetModal() {},
    /**
     * @description: 负责人改变
     */
    principalChange(){},
    /**
     * @description: 分管负责人改变
     */
    subPrincipalChange(){}
  },
}
</script>
<style>
.leftCol .ant-input {
  height: 30px;
}
</style>
<style lang="scss" scoped>
.main {
  display: flex;
}
.leftCol,
.rightCol {
  width: 50%;
}
.row {
  display: flex;
  align-items: center;
  padding-bottom: 20px;
}
.label {
  width: 90px;
  text-align: right;
  color: #333;
}
.addOrgInput {
  width: 200px;
}
.select{
    width: 200px;
}
.infoWrap{
    width: 254px;
    border: 1px #d9d9d9 solid;
    border-radius: 4px;
}
.infoHead{
    height: 38px;
    padding-left: 15px;
    line-height: 38px;
    background: #fff;
    border-bottom: 1px solid #d9d9d9;
    color: #333;
    font-size: 14px;
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
}
.info {
    background: #e7f3fc;
    height: 92px;
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
}
.info p{
    padding-top: 15px;
    padding-left: 15px;
    margin: 0;
}
</style>
