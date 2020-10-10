<template>
  <uf-modal v-model="setColsModalVisible" title="调栏" @cancel="setColsModalCancel" :width="900">
    <div class="setColsMain">
      <div class="setColsLeft">
        <div class="scTitle">可选择列：</div>
        <div class="scSearch">
          <a-input-search placeholder="请输入关键字搜索" style="width: 100%" v-model="searchText" @change="onSearchColCheckbox" />
        </div>
        <div class="colCheckboxs">
          <div v-if="searchText" class="colCheckboxsInner myscrollbar">
            <div class="checkboxsCol ml-10">
              <div class="mt-5" style="white-space: nowrap;" v-for="(item, index) in searchResult" :key="index">
                <a-checkbox :checked="getChecked(item.checked)" @change="onColsChange(item.field, index, $event)" :field="item.field">{{ item.title }}</a-checkbox>
              </div>
            </div>
          </div>
          <div v-else class="colCheckboxsInner myscrollbar">
            <div class="checkboxsCol ml-10">
              <div class="mt-5" style="white-space: nowrap;" v-for="(item, index) in columnsNoSeq" :key="index">
                <a-checkbox :checked="getChecked(item.checked)" @change="onColsChange(item.field, index, $event)" :field="item.field" v-if="index % 2 === 0">{{ item.title }}</a-checkbox>
              </div>
            </div>
            <div class="checkboxsCol ml-10">
              <div class="mt-5" style="white-space: nowrap;" v-for="(item, index) in columnsNoSeq" :key="index">
                <a-checkbox :checked="getChecked(item.checked)" @change="onColsChange(item.field, index, $event)" :field="item.field" v-if="index % 2 === 1">{{ item.title }}</a-checkbox>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="setColsRight">
        <div class="scTitle">已选择列：</div>
        <div class="colsCtrl">
          <div class="colsCtrlHeader">
            <div class="colsCtrlLabel">列名</div>
            <div class="colsCtrlBtns">操作</div>
          </div>
          <div class="colsCtrlInner myscrollbar">
            <vuedraggable class="wrapper" v-model="setColumns">
              <transition-group>
                <div class="colsCtrlRow" v-for="(item, index) in setColumns" :key="item.field">
                  <div class="colsCtrlLabel">{{ item.title }}</div>
                  <div class="colsCtrlBtns">
                    <a-icon style="cursor: pointer;font-size: 16px;" :type="item.fixed ? 'lock' : 'unlock'" @click="toggleLock(item, index)" />
                    <a-icon type="drag" style="margin-left: 8px;cursor: pointer;font-size: 16px;" />
                    <a-icon type="delete" @click="delSetColsItem(item, index)" style="margin-left: 8px;cursor: pointer;font-size: 16px;" />
                  </div>
                </div>
              </transition-group>
            </vuedraggable>
          </div>
        </div>
        <div class="clear"></div>
      </div>
    </div>
    <template slot="footer">
      <div class="footerInner">
        <div class="flex-start">
          <a-checkbox class="ml-10" :defaultChecked="true" @change="onSaveSettingChange">保存设置</a-checkbox>
          <a-checkbox class="ml-10" :checked="checkedAll" @change="checkedAllChange">全选</a-checkbox>
        </div>
        <div class="footerBtnWrap">
          <a-button key="reset" @click="resetModalData">
            重置
          </a-button>
          <a-button key="confirm" class="ml-10" type="primary" :loading="setColsModalLoading" @click="onClicksetColsModalConfirm">
            确定
          </a-button>
          <a-button key="cancel" class="ml-10" @click="setColsModalCancel">
            取消
          </a-button>
        </div>
      </div>
    </template>
  </uf-modal>
</template>
<script>
import vuedraggable from 'vuedraggable'
import { mapState, mapActions } from 'vuex'
export default {
  name: 'setColsModal',
  data() {
    return {
      setColsModalVisible: false, //显示
      setColsModalLoading: false, //保存的loading
      protoShowColumns: [], //显示的列 用于清空时候比较哪些发生了变化 该数组只在初始化和保存后发生变化
      protoColumnsNoSeq: [],//所有的列包含是否选中状态 用于清空时候比较哪些发生了变化 该数组只在初始化和保存后发生变化
      searchText: '', //搜索内容
      searchResult: [], //搜索结果
      setColumns: [],//显示的列
      fixedState: ['', '', '', '', '', ''], //设定最多锁定6列
      checkedAll: false,
      initChecked: true,
      itemChecked: false,
      saveSetting: true //多选框默认值 是否保存设置
    }
  },
  components: {
    vuedraggable
  },
  props: ['visible','prtypeCode', 'data', 'pageId'],
  watch: {
    visible(val) {
      if (val) {
        //没次显示 重新设定锁定记录
        this.fixedState = ['', '', '', '', '', '']
        this.setColsModalVisible = true
        this.setColumns = JSON.parse(JSON.stringify(this.showColumns))
        let count = 0
        this.checkedAll = this.columnsNoSeq.every(item => {
          return item.checked === true
        })
        //初始化 锁定限制列表fixedState 使其有值
        this.setColumns.forEach(item => {
          if(item.fixed){
            if(count<this.fixedState.length){
              this.fixedState[count] = item.field + ':' + item.fixed
              count++
            }
          }
        })
        //对传进来的所有状态列 和 显示列进行保存 用于清空
        this.protoShowColumns = this.data.showColumns
        this.protoColumnsNoSeq = this.data.columnsNoSeq
      }
    }
  },
  computed: {
    ...mapState({
      columnsNoSeq: state => state.setCols.columnsNoSeq,//所有状态列
      showColumns: state => state.setCols.showColumns,//vuex显示列
      planId: state => state.setCols.planId,
      planName: state => state.setCols.planName,
      ordIndex: state => state.setCols.ordIndex
    })
  },
  methods: {
    ...mapActions(['setColumnsNoSeq', 'setShowColumns', 'setWageTableColsPlan']),
    getChecked(checkedStatus){
      if(this.initChecked){
        return checkedStatus
      }else{
        if(this.itemChecked){
          return checkedStatus
        }else{
          if(this.checkedAll){
            return true
          }else{
            return false
          }
        }
      }
    },
    /**
     * @description: 调栏点击关闭或取消
     */
    setColsModalCancel() {
      this.setColsModalVisible = false
      this.resetModalData()
      this.$emit('cancel')
    },
    /**
     * @description: 重置modal数据
     */
    resetModalData() {
      this.checkedAll = false
      this.initChecked = true
      this.itemChecked = false
      this.searchText = ''
      this.searchResult = []
      this.setColumns = JSON.parse(JSON.stringify(this.protoShowColumns))
      let count = 0
      this.setColumns.forEach(item => {
        if(item.fixed){
          if(count<this.fixedState.length){
            this.fixedState[count] = item.field + ':' + item.fixed
            count++
          }
        }
      })
      this.setColumnsNoSeq(JSON.parse(JSON.stringify(this.protoColumnsNoSeq)))
      this.setShowColumns(JSON.parse(JSON.stringify(this.protoShowColumns)))
    },
    /**
     * @description: 调栏弹窗内 查询关于列的checkbox
     */
    onSearchColCheckbox() {
      let searchResult = []
      this.columnsNoSeq.forEach(item => {
        if (item.title.indexOf(this.searchText) > -1) {
          searchResult.push(item)
        }
      })
      this.searchResult = searchResult
    },
    /**
     * @description: 切换列是否锁定的状态
     * @param item 要锁定的列 setColumns的item
     */
    toggleLock(item) {
      let flag = false //是否改变了锁定状态
      this.setColumns.forEach((it, ind) => {
        if (item.field === it.field) {
          //分为设置锁定 和 取消锁定两种情况
          //如果item项不包含fixed 说明是设置锁定 如果fixed属性有值 说明是取消锁定
          if(item.fixed){//取消锁定
            //fixedState记录中这一项的内容置空
            for (let i = 0; i < this.fixedState.length; i++) {
              let field = this.fixedState[i].split(':')[0]
              if(field!=''&&item.field === field){
                flag = true
                this.fixedState[i] = ''
                break
              }
            }
            //删除fixed属性
            delete it.fixed
            this.$set(this.setColumns, ind, it)
          }else{//设置锁定
            //检查当前fixedState记录中是否还有空的项
            for (let i = 0; i < this.fixedState.length; i++) {
              if(this.fixedState[i] === ''){
                flag = true
                this.fixedState[i] = item.field + ':left'
                it.fixed = 'left'
                this.$set(this.setColumns, ind, it)
                break
              }
            }
          }
        }
      })
      if (!flag) {
        this.$message.warning('最多锁定' + this.fixedState.length + '列')
      }
    },
    /**
     * @description: 调栏 删除已选列的项
     */
    delSetColsItem(item, index) {
      this.setColumns.splice(index, 1)
      this.columnsNoSeq.forEach(it => {
        if (item.field === it.field) {
          it.checked = false
        }
      })
    },
    /**
     * @description: 调栏 多选框选中
     */
    onColsChange(field, index, event) {
      console.log('onColsChange')
      this.itemChecked = true
      console.log(this.itemChecked)
      if (event.target.checked) {//选中
        let colObj = {}
        this.columnsNoSeq.forEach(item => {
          if (item.field === field) {
            item.checked = true
            colObj = item
          }
        })
        //添加该列到最下方
        this.setColumns.push(colObj)
      } else {//取消选中
        this.columnsNoSeq.forEach(item => {
          if (item.field === field) {
            item.checked = false
          }
        })
        let cur = 0
        this.setColumns.forEach((item, ind) => {
          if (item.field === field) {
            item.checked = false
            cur = ind
          }
        })
        //从显示的里面删掉一条
        this.setColumns.splice(cur, 1)
      }
      this.checkedAll = this.columnsNoSeq.every(item => {
        return item.checked === true
      })
    },
    /**
     * @description: 确定
     */
    onClicksetColsModalConfirm() {
      //如果勾选了保存到服务器上
      if(this.saveSetting){
        this.setColsModalLoading = true
        let json = JSON.stringify(this.setColumns)
        this.$axios.post('/prs/prsqueryplan/savePrsQueryPlan',{
          prtypeCode: this.prtypeCode,
          json: json,   //需要保存的JSON数据
          isUpdate: this.planId?'1':'0',    //保存状态：1 更新，0 新增
          planId: this.planId?this.planId:'',
          ordIndex: this.pageId==='PRS_CALC_DATA'?1:this.ordIndex,//工资编制只对一条表栏目进行修改
          planName: this.planId?this.planName:'表栏目-1',
          pageId: this.pageId
        }).then(result =>{
          this.setColsModalLoading = false
          if(result.data.flag==='success'){
            this.setWageTableColsPlan({
              planId: result.data.data.planId,
              ordIndex: result.data.data.ordIndex,
              planName: result.data.data.planName
            })
            let arr1 = [], arr2 = []
            this.setColumns.forEach(item =>{
              if(item.fixed){
                arr1.push(item)
              }else{
                arr2.push(item)
              }
            })
            this.setColumns = arr1.concat(arr2)
            this.setColumnsNoSeq(this.columnsNoSeq)
            this.setShowColumns(this.setColumns)
            this.setColsModalVisible = false
            this.$emit('confirm')
          }else{
            throw result.data.msg
          }
        }).catch(error => {
          this.$message.error(error)
        })
      }else{//如果没勾选
        this.setWageTableColsPlan({
          planId: this.planId?this.planId:'',
          ordIndex: this.pageId==='PRS_CALC_DATA'?1:this.ordIndex,
          planName: this.planId?this.planName:'表栏目-1'
        })
        let arr1 = [], arr2 = []
        this.setColumns.forEach(item =>{
          if(item.fixed){
            arr1.push(item)
          }else{
            arr2.push(item)
          }
        })
        this.setColumns = arr1.concat(arr2)
        this.setColumnsNoSeq(this.columnsNoSeq)
        this.setShowColumns(this.setColumns)
        this.setColsModalVisible = false
        this.resetModalData()
        this.$emit('confirm')
      }
    },
    /**
     * @description: 保存设置改变
     */
    onSaveSettingChange(e) {
      this.saveSetting = e.target.checked
    },
    /**
     * @description: 全选
     */
    checkedAllChange(e){
      this.initChecked = false
      this.checkedAll = e.target.checked
      if(this.checkedAll){
        this.setColumns = []
        this.columnsNoSeq.forEach(item => {
          item.checked = true
          this.setColumns.push(item)
        })
      }else{
        if(!this.itemChecked){
          this.setColumns = []
          this.columnsNoSeq.forEach(item => {
            item.checked = false
          })
        }
      }
      this.itemChecked = false //点击某一项的勾选框重置为否
    },
  }
}
</script>
<style scoped>
.setColsMain {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}
.setColsLeft {
  width: 60%;
  box-sizing: border-box;
  padding-right: 15px;
}
.setColsRight {
  width: 40%;
  box-sizing: border-box;
}
.scSearch {
  margin-top: 10px;
}
.colCheckboxs {
  width: 100%;
  height: 300px;
  margin-top: 10px;
}
.colCheckboxsInner {
  width: 100%;
  height: 100%;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  box-sizing: border-box;
  overflow: auto;
  display: flex;
}
.checkboxsCol {
  min-width: 45%;
}
.colsCtrl {
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-top: 10px;
  height: 340px;
  box-sizing: border-box;
  overflow: hidden;
}
.colsCtrlInner {
  width: 100%;
  height: 310px;
  overflow: auto;
  box-sizing: border-box;
  padding-bottom: 10px;
}
.colsCtrlHeader,
.colsCtrlRow {
  display: flex;
}
.colsCtrlHeader {
  padding: 5px 0;
  border-bottom: 1px solid #ddd;
  padding-right: 10px;
}
.colsCtrlRow {
  margin-top: 5px;
}
.colsCtrlLabel {
  width: 70%;
  text-align: center;
}
.colsCtrlBtns {
  width: 30%;
  text-align: center;
}
/* .colSetWidth {
  width: 20%;
  text-align: center;
} */
.setWidthInput {
  display: inline-block;
  width: 40px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  text-align: left;
}
.footerInner {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.footerBtnWrap{
  display: flex;
}
</style>
