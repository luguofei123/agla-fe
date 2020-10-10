<!--
 * @Author: sunch
 * @Date: 2020-06-11 13:47:20
 * @LastEditTime: 2020-08-21 12:34:18
 * @LastEditors: Please set LastEditors
 * @Description: 部门人员信息
 * @FilePath: /agla-fe-8.50/vuedev/src/views/ma/employeeManagement/depStaffInformation.vue
-->
<template>
  <div class="page">
    <!-- 头部开始 -->
    <ufHeader :title="title">
      <template slot="btns">
        <a-button type="primary" class="mr-5" :class="getBtnPer('btn-add')">新增</a-button>
        <a-button type="primary" class="mr-5" :class="getBtnPer('btn-print')">批量调级</a-button>
        <a-button class="mr-5" :class="getBtnPer('btn-import')">导入</a-button>
        <a-button class="mr-5" :class="getBtnPer('btn-bank-import')">导入账户</a-button>
        <a-button class="mr-5" :class="getBtnPer('btn-synchronous')">同步警综用户</a-button>
      </template>
    </ufHeader>

    <div class="container-page">
      <div class="leftWrap">
        <OrgTreeLeftBox class="mt-8" :showFooter="true">
          <template v-slot:orgTreeHeadBtn>
            <div class="addOrgBtn" :class="getBtnPer('btn-add-department')" @click="showAddOrg">
              <span class="icon icon-plus"></span>
              <span>新增部门</span>
            </div>
          </template>
        </OrgTreeLeftBox>
      </div>
      <div class="mainWrap">
        <!-- 查询条件开始 -->
        <ufQueryArea class="mt-8">
          <div class="flex-between">
            <div class="flex-start"></div>

            <div class="flex-start">
              <div class="mr-10 flex-start moreBtn" @click="showMoreQuery = !showMoreQuery">更多<a-icon class="moreDown" :class="{ moreTop: showMoreQuery }" type="down" /></div>
              <a-button :class="getBtnPer('btn-query')" type="primary">查询</a-button>
            </div>
          </div>
          <div class="mt-10" v-if="showMoreQuery"></div>
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

        <!-- 表格开始 -->
        <!-- <vxe-grid
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
          :data="filterTableData"
          :highlight-hover-row="true"
          :row-style="rowStyle"
          :toolbar="{ id: 'wageDetailReportTable', resizable: { storage: true } }"
        >
          <template v-slot:setCol>
            <div @click="setCols">
              <a-icon type="bars" />
            </div>
          </template>
        </vxe-grid> -->
        <!-- 表格结束 -->
      </div>
    </div>

    <AddOrg :visible="addOrgModalVisible" @addOrgModalClose="addOrgModalClose"></AddOrg>
  </div>
</template>
<script>
import OrgTreeLeftBox from '@/components/OrgTreeLeftBox'
import { getBtnPer, getPdf, download } from '@/assets/js/util'
import AddOrg from './components/AddOrg'
export default {
  data() {
    return {
      title: '部门人员信息',
      addOrgModalVisible: false,
      showMoreQuery: false, //是否显示更多查询查询内容
    }
  },
  created() {
    this.tableH = this.containerH - 210
  },
  computed: {
      columns(){
          return []
      }
  },
  methods: {
    getBtnPer,
    showAddOrg() {
      this.addOrgModalVisible = true
    },
    addOrgModalClose() {
      this.addOrgModalVisible = false
    },
    /**
     * @description: 打印
     */
    print() {},
    /**
     * @description: 导出
     */
    exportEvent() {},
  },
  components: {
    AddOrg,
    OrgTreeLeftBox
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
</style>
