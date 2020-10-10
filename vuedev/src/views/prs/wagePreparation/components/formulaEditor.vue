<!--
 * @Author: sunch
 * @Date: 2020-03-14 14:29:59
 * @LastEditTime: 2020-09-18 15:17:28
 * @LastEditors: Please set LastEditors
 * @Description: 公式编辑器
 * @FilePath: /ufgov-vue/src/views/prs/wagePreparation/components/formulaEditor.vue
 -->
<template>
  <div>
    <uf-modal title="公式编辑器" v-model="formulaEditorVisible" @cancel="close" :width="1100">
      <div class="flexBox">
        <div style="width: 590px">
          <textarea class="sqlControl" ref="formulaEditorVal" v-model="formulaStr"></textarea>
          <div class="FormulaEditorBtn">
            <button class="newbtn btn-default" @click="onClickBtn('+')">+</button>
            <button class="newbtn btn-default" @click="onClickBtn('-')">-</button>
            <button class="newbtn btn-default" @click="onClickBtn('*')">*</button>
            <button class="newbtn btn-default" @click="onClickBtn('/')">/</button>
            <button class="newbtn btn-default" @click="onClickBtn('(')">(</button>
            <button class="newbtn btn-default" @click="onClickBtn(')')">)</button>
            <button class="newbtn btn-default" @click="onClickBtn('=')">=</button>
            <button class="newbtn btn-default" @click="onClickBtn('!=')">!=</button>
            <button class="newbtn btn-default" @click="onClickBtn('>')">&gt;</button>
            <button class="newbtn btn-default" @click="onClickBtn('>=')">&gt;=</button>
            <button class="newbtn btn-default" @click="onClickBtn('<')">&lt;&lt;</button>
            <button class="newbtn btn-default" @click="onClickBtn('<=')">&lt;=</button>
            <button class="newbtn btn-default" @click="onClickBtn(',')">,</button>
            <button class="newbtn btn-default" @click="onClickBtn('.')">.</button>
            <button class="newbtn btn-default" @click="onClickBtn('如果')">如果</button>
            <button class="newbtn btn-default" @click="onClickBtn('那么')">那么</button>
            <button class="newbtn btn-default" @click="onClickBtn('并且')">并且</button>
            <button class="newbtn btn-default" @click="onClickBtn('或者')">或者</button>
          </div>
        </div>
        <div class="workspace-center">
          <div class="card-container">
            <div class="toolBar">
              <ufTab :tabList="tabList" :tabIndex="tabIndex" :maxShowTabNum="6" @clickTabItem="onClickTabItem"></ufTab>
            </div>
            <div v-if="tabIndex === 0" class="empInner myscrollbar">
              <ul class="emp">
                <li
                  class="empItem"
                  :class="{ active: target === 'emp' && index === current }"
                  v-for="(item, index) in empList"
                  @click.stop="
                    current = index
                    target = 'emp'
                  "
                  :key="item.name"
                  @dblclick="onClickBtn(item.name)"
                >
                  {{ item.name }}
                  <ul v-if="index === current" class="empDetail">
                    <li
                      v-for="(it, ind) in item.values"
                      @click.stop="
                        cur = ind
                        target = 'detail'
                      "
                      :class="{ active: target === 'detail' && ind === cur }"
                      :key="it"
                      @dblclick.stop="onClickBtn(it)"
                    >
                      {{ it }}
                    </li>
                  </ul>
                </li>
              </ul>
            </div>

            <ul v-if="tabIndex === 1" class="prjWrap myscrollbar">
              <li v-for="(item, index) in prjList" @click.stop="prjIndex = index" @dblclick.stop="onClickBtn(item)" :class="{ active: index === prjIndex }" :key="'p' + index">{{ item }}</li>
            </ul>
          </div>
        </div>
      </div>

      <template slot="footer">
        <a-button key="confirm" type="primary" @click="confirm">
          确定
        </a-button>
        <a-button key="verify" @click="verify">
          校验
        </a-button>
        <a-button key="clear" @click="clear">
          清空
        </a-button>
        <a-button key="close" @click="close">
          关闭
        </a-button>
      </template>
    </uf-modal>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
const baseUrl = process.env.NODE_ENV === 'development' ? '' : ''
export default {
  name: 'formulaEditor',
  props: ['visible', 'prtypeCode'],
  data() {
    return {
      formulaStr: '',
      formulaEditorVisible: false,
      empList: [],
      prjList: [],
      target: '',
      current: 0,
      cur: 0,
      prjIndex: 0,
      //tab
      tabList: [
        { text: '人员信息', current: 0 },
        { text: '工资项目', current: 1 },
      ], //tab对象数组
      tabIndex: 0, //当前tab角标
    }
  },
  watch: {
    visible(val) {
      if (val) {
        console.log(val)
        this.formulaEditorVisible = true
        this.formulaStr = this.formula
        this.query()
      }
    },
  },
  computed: {
    ...mapState({
      pfData: (state) => state.pfData,
      formula: (state) => state.formulaEditor.formula,
    }),
  },
  methods: {
    ...mapActions(['setFormula', 'clearFormula']),
    /**
     * @description: 点击确定
     */
    confirm() {
      //运行校验 当返回为true时
      this.verify((bol) => {
        console.log(bol)
        if (bol) {
          this.setFormula(this.formulaStr)
          this.formulaEditorVisible = false
          this.empList = []
          this.$emit('formulaEditorClose')
        }
      })
    },
    /**
     * @description: 点击校验
     */
    verify(callback) {
      this.$showLoading()
      this.$axios
        .post(baseUrl + '/prs/PrsTypeItemCo/checkFormula', {
          formula: this.formulaStr,
        })
        .then((result) => {
          this.$hideLoading()
          if (result.data.flag === 'success') {
            if (result.data.data === 'success') {
              this.$message.success(result.data.msg)
              if (callback && typeof callback === 'function') {
                callback(true)
              }
            } else {
              throw result.data.msg
            }
          } else {
            throw result.data.msg
          }
        })
        .catch((error) => {
          this.$message.error(error)
          if (callback && typeof callback === 'function') {
            callback(false)
          }
        })
    },
    /**
     * @description: 点击清空
     */
    clear() {
      this.clearFormula()
      this.formulaStr = ''
    },
    /**
     * @description: modal关闭
     */
    close() {
      this.formulaEditorVisible = false
      this.empList = []
      this.$emit('formulaEditorClose')
    },
    /**
     * @description: 切换tab
     */
    onClickTabItem(item) {
      this.tabIndex = item.current
    },
    /**
     * @description: 点击按钮
     */
    onClickBtn(str) {
      this.formulaStr += ' ' + str + ' '
      this.$refs.formulaEditorVal.focus()
    },
    /**
     * @description: 查询人员信息以及工资项列表
     */
    query() {
      if (!this.prtypeCode) {
        this.$message.error('未能获取到prtypeCode')
        this.formulaEditorVisible = false
        this.$emit('formulaEditorClose')
        return
      }
      this.prjList = []
      this.$axios
        .post(baseUrl + '/prs/prscalcdata/findPrsAndEmpCondition', {
          prtypeCode: this.prtypeCode,
        })
        .then((result) => {
          console.log(result)
          result.data.data.empCondition.forEach((item) => {
            let values = []
            item.valsetList.forEach((item) => {
              values.push(item.val)
            })
            this.empList.push({ name: item.caption, values: values })
          })
          result.data.data.prsCondition.forEach((item) => {
            this.prjList.push(item.pritemCodeName)
          })
        })
    },
  },
}
</script>
<style scoped>
textarea {
  resize: none;
}
.flexBox {
  display: flex;
}
.toolBar {
  width: 470px;
  height: 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #ddd;
  margin-top: -6px;
}
.sqlControl {
  width: 100%;
  height: 300px;
  border-radius: 4px;
  box-sizing: border-box;
  padding: 10px;
  outline: none;
  border: 1px solid #e8e8e8;
}
.FormulaEditorBtn {
  width: 100%;
  height: 28px;
  margin: 5px auto;
}
.workspace-center {
  margin-left: 10px;
}

.card-container .ant-tabs-tabpane {
  width: 450px;
  height: 260px;
  box-sizing: border-box;
  border: 1px solid #e8e8e8;
  border-top: 0;
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
}

.newbtn {
  display: block;
  font-weight: normal;
  text-align: center;
  white-space: nowrap;
  cursor: pointer;
  user-select: none;
  background-image: none;
  float: left;
  border: 0px;
  border-radius: 4px;
  border: 1px solid #e8e8e8;
  box-shadow: none !important;
  font-size: 12px;
  line-height: 1.42857143;
  color: #333;
  width: 34px;
  height: 28px;
  margin-right: 8px;
  margin-bottom: 5px;
  outline: none;
  background-color: #fff;
}
.empInner {
  box-sizing: border-box;
  width: 470px;
  height: 100%;
  margin-top: 2px;
  overflow-y: auto;
}
.emp {
  padding: 10px 0;
  position: relative;
  width: 120px;
  border-right: 1px solid #e8e8e8;
  box-sizing: border-box;
}
.empItem {
  width: 120px;
  height: 26px;
  line-height: 26px;
  padding-left: 10px;
  box-sizing: border-box;
  cursor: pointer;
  user-select: none;
}
.empItem.active {
  background: #99ccff;
}
.empDetail {
  position: absolute;
  top: 0;
  right: -150px;
  width: 150px;
  height: 26px;
  line-height: 26px;
  padding: 10px 0;
  box-sizing: border-box;
}
.empDetail li {
  width: 150px;
  height: 26px;
  padding-left: 10px;
  box-sizing: border-box;
  cursor: pointer;
  user-select: none;
}
.empDetail li.active {
  background: #99ccff;
}
.prjWrap {
  width: 50%;
  height: 320px;
  overflow-y: auto;
  padding: 10px 0;
  box-sizing: border-box;
  margin-top: 2px;
  border-right: 1px solid #e8e8e8;
}
.prjWrap li {
  height: 26px;
  line-height: 26px;
  padding-left: 10px;
  user-select: none;
}
.prjWrap .active {
  background: #99ccff;
}
</style>
