<!--
 * @Date: 2020-06-28 19:34:37
 * @LastEditTime: 2020-09-30 11:26:15
 * @LastEditors: Please set LastEditors
 * @Description: 方案弹框抽屉
 * @FilePath: /agla-fe-8.50/vuedev/src/views/gl/rpt/components/prjTabs.vue
-->
<template>
  <div>
    <ufDrawer v-model="drawerVisible" :zIndex="99" :width="500" @drawerClose="drawerClose">
      <div class="drawer-content" @click.stop>
        <div class="p-16">
          <a-row class="mb-16">
            <a-col :span="2" class="bold">查询项</a-col>
            <a-col :span="2" :offset="20" class="hover fr" @click="isAllShow = !isAllShow" v-if="accItemTypeList.length > 9">
              <!-- “更多”按钮 -->
              <div class="fr" style="margin-top: 3px;">
                <span v-if="isAllShow" class="icon icon-angle-top"></span>
                <span v-else class="icon icon-angle-bottom"></span>
              </div>
            </a-col>
          </a-row>
          <!-- 辅助项类别名称的checkbox列表 -->
          <a-row class="content-acctype-list" :class="{ all: isAllShow }" v-if="accItemTypeListLoaded">
            <a-col :span="8" class="acctype-item mb-10" v-for="item in accItemTypeList" :key="item.accItemCode">
              <a-checkbox @change="onAccTypeChange($event, item)" :checked="item.isChecked">{{ item.accItemName }}</a-checkbox>
            </a-col>
          </a-row>
        </div>
        <div class="line"></div>
        <div class="content-tabs">
          <div class="tabs-wrap">
            <div
              class="tab-item"
              v-for="item in accItemTypeCheckList"
              :key="item.accItemCode"
              :class="{ active: isTabActive == item.accItemCode }"
              @click="isTabActive = item.accItemCode"
              :title="item.accItemName"
            >
              <span v-if="item.isShowItem === '1'">
                <a-icon type="paper-clip" />
              </span>
              {{ item.accItemName }}
            </div>
          </div>
          <div v-if="accItemTypeCheckListLoaded">
            <div class="tabs-main" v-for="item in accItemTypeCheckList" :key="item.accItemCode" v-show="isTabActive == item.accItemCode">
              <div class="check-wrap">
                <a-checkbox @change="onShowColBtnChange($event, item)" :checked="item.isShowItem === '1'">表内显示</a-checkbox>
                <a-checkbox @change="onZJHZChange($event, item)" :defaultChecked="item.isGradsum === '1'">逐级汇总</a-checkbox>
                <span class="fr hover" @click="showZtreeDrawer(item)">添加</span>
                <span class="fr hover clear-all" @click="clearAll(item)">清空</span>
              </div>
              <div class="tree-wrap myscrollbar">
                <div v-if="item.items && item.items.length > 0">
                  <ztree :setting="zTreeSetting" :nodes="item.items"></ztree>
                </div>
                <div v-else class="iconWrap" @click="showZtreeDrawer(item)">
                  <span class="addfileIcon"></span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="line"></div>
        <div class="clear"></div>

        <!-- 辅助选项表格下方其它表格筛选条件 -->
        <ul class="content-else">
          <li style="margin-bottom: 0;">
            <a-row v-if="optListDataLoaded">
              <a-col :span="12" class="mb-16" v-for="item in optListData" :key="item.optId">
                <span class="opt-list">
                  <a-checkbox @change="onOptChange($event, item)" :defaultChecked="item.defCompoValue === 'Y' ? true : false">{{ item.optName }}</a-checkbox>
                </span>
              </a-col>
            </a-row>
          </li>

          <li>
            <span class="title">金额：</span>
            <a-input v-model="stadAmtFrom" @blur="onStadAmtFromBlur" :maxLength="25" style="width: 118px" />
            <span style="margin: 0 8px;">至</span>
            <a-input v-model="stadAmtTo" @blur="onStadAmtToBlur" :maxLength="25" style="width: 118px" />
          </li>

          <li>
            <span class="title">凭证类型：</span>
            <a-select default-value style="width: 118px" v-model="vouTypeCode" allowClear>
              <a-select-option :value="item.code" v-for="item in VouTypeData" :key="item.code">{{ item.name }}</a-select-option>
            </a-select>
          </li>

          <li>
            <span class="title">方案名称：</span>
            <a-input :maxLength="25" placeholder="请输入方案名称" v-model="nowPrj" style="width: 258px;" />
          </li>

          <!-- 方案作用范围 开始 -->
          <li>
            <a-radio-group v-model="prjScope">
              <a-radio :value="'1'">私有方案</a-radio>
              <a-radio :value="'2'">本单位共享</a-radio>
              <a-radio :value="'3'">全系统共享</a-radio>
            </a-radio-group>
          </li>
          <!-- 方案作用范围 结束 -->
        </ul>
      </div>

      <template v-slot:footer>
        <div class="drawer-footer" @click.stop>
          <a-button class="mr-8" type="primary" @click.stop="queryHandle" :class="getBtnPer('btn-query')">查询</a-button>
          <a-button class="mr-8" @click.stop="savePrj('save')" :class="getBtnPer('btn-save')">保存</a-button>
          <a-button @click.stop="savePrj('saveAdd')" :class="getBtnPer('btn-saveadd')">另存为</a-button>
        </div>
      </template>
    </ufDrawer>

    <!-- 选择辅助项范围抽屉 开始 -->
    <bal-acc-select-drawer
      :accModalShow="accModalShow"
      :selectedAccItem="selectedAccItem"
      :isRemembered="isRememberedGL060"
      :zTreeSelectedData="zTreeSelectedData"
      @accModalChange="accModalChange"
    ></bal-acc-select-drawer>
    <!-- 选择辅助项范围抽屉 结束 -->
  </div>
</template>

<script>
import ufDrawer from '@/components/common/ufDrawer' //抽屉组件
import BalAccSelectDrawer from './BalAccSelectDrawer' // 设置方案
import { mapState, mapGetters, mapActions } from 'vuex'
import { getBtnPer } from '@/assets/js/util'
import { vouTypeList, getOptList, getRptAccItemTypePost, postSavePrj, getAccItemTree, getSysRuleSet } from '../../common/service/service'
import { formatMoney, revertNumMoney } from '@/assets/js/util'
import store from '@/store/index'
let rptName = store.state.rpt.rptName
const checkableList = ['glRptBal']

export default {
  name: 'BalDrawer',
  components: {
    ufDrawer,
    'bal-acc-select-drawer': BalAccSelectDrawer,
  },
  props: {
    drawerVisible: {
      // 抽屉显示
      type: Boolean,
      default: false,
    },
    rptType: {
      // 账表类型 数据查询
      type: String,
      default: '',
    },
  },
  data() {
    return {
      isAllShow: false, // 辅助项列表显示全部
      accItemTypeList: [], // 辅助项列表
      accItemTypeListLoaded: false,
      accItemTypeCheckList: [], // 选择的辅助项
      accItemTypeCheckListLoaded: false,
      isTabActive: 'ACCO', // 高亮项
      optListData: [], // 其他
      optListDataLoaded: false,
      stadAmtFrom: '', // 金额-起
      stadAmtTo: '', // 金额-止
      vouTypeCode: '', // 凭证类型
      VouTypeData: [], // 凭证类型列表
      accModalShow: false, // 科目选择窗口可视
      selectedAccItem: null, // 当前选择的辅助项
      zTreeSelectedData: { ACCO: [] }, // 树数据
      zTreeSetting: {
        // 树配置
        data: {
          key: {
            name: 'codeName',
          },
          simpleData: {
            enable: true,
          },
        },
        view: {
          showLine: false,
          showIcon: false,
          nodeClasses: function(treeId, treeNode) {
            return treeNode.highlight ? { add: ['highlight'] } : { remove: ['highlight'] }
          },
        },
      },
      isRememberedGL060: false,
    }
  },
  mounted() {
    this.optList()
  },
  computed: {
    ...mapState({
      pfData: (state) => state.pfData, // 全局的commonData 用户当前登陆公共信息
      agencyCode: (state) => state[rptName].agencyCode, // 单位代码
      acctCode: (state) => state[rptName].acctCode, // 账套代码
      acctChangedFlag: (state) => state[rptName].acctChangedFlag, // 账套改变
      qryItemData: (state) => state[rptName].qryItemData, // 用户选择的辅助项
      pageType: (state) => state.rpt.rptName,
      rptStyle: (state) => state[rptName].prjContent.rptStyle, // 账表样式
      curCode: (state) => state[rptName].prjContent.curCode, // 币种
      startDate: (state) => state[rptName].startDate, // 开始日期
      endDate: (state) => state[rptName].endDate, // 结束日期
      prjListEmpty: (state) => state[rptName].prjListEmpty, //方案为空标记
      prjContent: (state) => state[rptName].prjContent
    }),
    ...mapGetters({
      reportArgument: 'getReportArgument',
    }),
    prjScope: {
      // 方案作用域类型
      get() {
        return String(this.$store.state[rptName].prjScope)
      },
      set(val) {
        this.setPrjScope(val)
      },
    },
    prjCode: {
      // 方案作用域code
      get() {
        return String(this.$store.state[rptName].prjCode)
      },
      set(val) {
        this.setPrjCode(val)
      },
    },
    nowPrj: {
      // 方案名称
      get() {
        return this.$store.state[rptName].nowPrj
      },
      set(val) {
        this.setNowPrj(val)
      },
    },
    /**
     * @description: 整理辅助项范围，选择对象，默认抽屉内选择范围在页面的查询区域是全选的
     */
    qrySelectItemData(){
      let obj = {}
      this.accItemTypeCheckList.forEach((item) => {
        obj[item.itemType] = []
        if (item.items.length > 0) {
          item.items.forEach((it) => {
            obj[item.itemType].push(it.code)
          })
        }
      })
      return obj
    }
  },
  watch: {
    //账套改变
    acctChangedFlag(newVal, oldVal) {
      if (newVal) {
        this.getRptAccItemTypeList('', true) // 获取辅助项列表
        this.getVouTypeList() // 获取凭证类型列表
        this.setAcctChangedFlag(false)
      }
    },
    //确认方案列表为空
    prjListEmpty(state) {
      if (!state) {
        return
      }
      this.zTreeSelectedData = { ACCO: [] }
      this.getAccItemTreeData('ACCO').then((result) => {
        if (result.data.flag === 'fail') {
          throw result.data.msg
        }
        //初始化页面，默认勾选会计科目
        this.zTreeSelectedData.ACCO = result.data.data
        this.accItemTypeCheckList = [
          {
            // 选择的辅助项
            accItemCode: 'ACCO',
            accItemName: '会计科目',
            itemType: 'ACCO',
            itemTypeName: '会计科目',
            isShowItem: '1',
            isGradsum: '0',
            items: result.data.data,
          },
        ]
        if (!this.nowPrj) {
          this.setSelectedData(this.qrySelectItemData) //设置默认选择的辅助项（抽屉外的查询项）
          this.setQryItemData(this.accItemTypeCheckList) // 选择的查询项
        }
      })
    },
    //方案名称 自动set
    nowPrj(newVal, oldVal) {
      this.setNowPrj(newVal)
    },
    // 方案作用域类型
    prjScope(newVal, oldVal) {
      this.setPrjScope(newVal)
    },
    //抽屉显示时的执行
    drawerVisible(newVal, oldVal) {
      if (newVal) {
        setTimeout(() => {
          // 打开弹框时回写方案内容
          this.getSysRuleVal() // 账表数据范围选择框记忆上次选择的数据
          if (!this.nowPrj) {
            this.accItemTypeListLoaded = true
            this.accItemTypeCheckListLoaded = true
            this.optListDataLoaded = true
            //打开抽屉后调用辅助项列表接口
            this.getRptAccItemTypeList('', false)
            return
          }

          let rptOption = this.reportArgument.prjContent.rptOption // 已选方案的其他选项勾选情况
          // 表格筛选条件回写勾选
          this.optListData.forEach((element) => {
            rptOption.forEach((item) => {
              if (element.optCode === item.optCode) {
                element.defCompoValue = item.defCompoValue
              }
            })
          })
          this.stadAmtFrom = this.reportArgument.stadAmtFrom ? formatMoney(this.reportArgument.stadAmtFrom) : '' // 金额-起
          this.stadAmtTo = this.reportArgument.stadAmtTo ? formatMoney(this.reportArgument.stadAmtTo) : '' // 金额-起
          this.vouTypeCode = this.reportArgument.prjContent.vouTypeCode // 凭证类型

          // 查询项左侧tab
          this.accItemTypeCheckList = []
          this.zTreeSelectedData = {} //已选结构树数据
          this.prjContent.qryItems.forEach((element) => {
            const item = {
              ...element,
            }
            item.accItemCode = element.itemType
            item.accItemName = element.itemTypeName
            this.zTreeSelectedData[element.itemType] = element.items
            // 对比当前单位账套下查询的辅助项列表accItemTypeList是否有该项，如果没有，不显示在此tab页签
            if (this.accItemTypeList.some((it) => it.accItemCode === element.itemType)) {
              this.accItemTypeCheckList.push(item)
            }
          })
          this.setSelectedData(this.qrySelectItemData) //设置默认选择的辅助项（抽屉外的查询项）
          this.setQryItemData(this.accItemTypeCheckList)
          if (this.accItemTypeCheckList.length > 0) {
            this.isTabActive = this.accItemTypeCheckList[0].accItemCode // 高亮项
          }
          this.accItemTypeListLoaded = true
          this.accItemTypeCheckListLoaded = true
          this.optListDataLoaded = true
          //打开抽屉后调用辅助项列表接口
          this.getRptAccItemTypeList('', false)
          
        }, 350)
      }
    },
  },
  methods: {
    getBtnPer,
    ...mapActions([
      'setQryItemData',
      'setSelectedData',
      // 'setPrjQryItems', //这个不能使用
      'setPrjRptOption',
      'setNowPrj',
      'setPrjScope',
      'setStadAmtFrom',
      'setStadAmtTo',
      'setSavePrjCode',
      'getPrjList',
      'setPrjGuid',
      'setAcctChangedFlag',
      'setDEPPROFlag',
      // "setQrySelectItemData", //设置表外查询项的默认值 2020.09.22
    ]),
    // 抽屉-查询项check事件
    onAccTypeChange(e, item) {
      //向下执行标记
      let mark = false
      // 选择框选中
      this.accItemTypeList.forEach((element) => {
        if (element.accItemCode === item.accItemCode) {
          if (e.target.checked) {
            if (element.isChecked) {
              mark = true
            } else {
              element.isChecked = true
            }
          } else {
            if (
              this.accItemTypeCheckList.some((it) => {
                return element.accItemCode != it.accItemCode && it.isShowItem === '1'
              })
            ) {
              element.isChecked = false
            } else {
              mark = true
              element.isChecked = true
              this.$message.warning('至少选择一个显示要素!')
            }
          }
        }
      })
      if (mark) {
        return
      }
      if (e.target.checked) {
        // 选择
        let qryItem = {
          isShowItem: '1',
          isGradsum: '0',
          itemType: item.accItemCode,
          itemTypeName: item.accItemName,
          accItemCode: item.accItemCode,
          accItemName: item.accItemName,
          items: []
        }
        this.accItemTypeCheckList.push(qryItem)
        this.isTabActive = item.accItemCode
        this.zTreeSelectedData[item.accItemCode] = []
      } else {
        // 取消
        this.accItemTypeCheckList.splice(
          this.accItemTypeCheckList.findIndex((it) => it.accItemCode === item.accItemCode),
          1
        )
        if (this.accItemTypeCheckList.length > 0) {
          this.isTabActive = this.accItemTypeCheckList[0].accItemCode
        }
      }
    },
    // 抽屉-表内显示按钮
    onShowColBtnChange(e, item) {
      //返结束运行标记
      let mark = false
      this.accItemTypeCheckList.forEach((element) => {
        if (element.accItemCode === item.accItemCode) {
          if (e.target.checked) {
            if (element.isShowItem === '1') {
              mark = true
            } else {
              element.isShowItem = '1'
            }
          } else {
            let flag = this.accItemTypeCheckList.some((it) => {
              return element.accItemCode != it.accItemCode && it.isShowItem === '1'
            })
            if (flag) {
              element.isShowItem = '0'
            } else {
              element.isShowItem = '1'
              this.$message.warning('至少选择一个显示要素!')
              mark = true
            }
          }
        }
      })
      if (mark) {
        return
      }
      //勾选表内显示按钮时更新vuex中的qryItemData和PrjQryItems modified by liwz at 2020.09.16
      this.setSelectedData(this.qrySelectItemData)
      this.setQryItemData(this.accItemTypeCheckList) // 选择的查询项
      this.$forceUpdate()
    },
    /**
     * @description: 逐级汇总改变
     */
    onZJHZChange(e, item) {
      this.accItemTypeCheckList.forEach((element) => {
        if (element.accItemCode === item.accItemCode) {
          element.isGradsum = e.target.checked ? '1' : '0'
        }
      })

      //勾选表内显示按钮时更新vuex中的qryItemData和PrjQryItems modified by liwz at 2020.09.16
      this.setSelectedData(this.qrySelectItemData)
      this.setQryItemData(this.accItemTypeCheckList) // 选择的查询项
    },
    // 抽屉-其他选项-改变
    onOptChange(e, item) {
      this.optListData.forEach((element) => {
        if (element.optCode === item.optCode) {
          element.defCompoValue = e.target.checked ? 'Y' : 'N'
        }
      })
    },
    // 抽屉-其他选项：获取选项列表
    optList() {
      let params = {
        menuId: this.menuId,
        rptType: this.rptType,
        roleId: this.pfData.svRoleId,
        userId: this.pfData.svUserId,
        setYear: this.pfData.svSetYear,
      }
      getOptList(params)
        .then((result) => {
          if (result.data.flag == 'fail') {
            throw result.data.msg
          } else {
            this.optListData = result.data.data
          }
        })
        .catch(this.$showError)
    },
    onStadAmtFromBlur() {
      // 金额-起
      this.stadAmtFrom = this.stadAmtFrom ? formatMoney(this.stadAmtFrom) : ''
    },
    onStadAmtToBlur() {
      // 金额-止
      this.stadAmtTo = this.stadAmtTo ? formatMoney(this.stadAmtTo) : ''
    },
    // 获取凭证类型列表
    getVouTypeList() {
      let urlParams = '/' + this.agencyCode + '/' + this.pfData.svSetYear + '/' + this.acctCode + '/' + '*'
      vouTypeList({}, {}, urlParams)
        .then((result) => {
          if (result.data.flag == 'fail') {
            throw result.data.msg
          } else {
            this.VouTypeData = result.data.data
          }
        })
        .catch(this.$showError)
    },
    /**
     * @description: 获取辅助项列表
     * @param {String} accItemListStr 要查询列表所挂的辅助项参数，以逗号分隔的字符串
     * @param {Boolean} isInit true初始请求 false勾选查询项请求
     */
    getRptAccItemTypeList(accItemListStr, isInit) {
      let param = {
        agencyCode: this.agencyCode,
        acctCode: this.acctCode,
        setYear: this.pfData.svSetYear,
        userId: this.pfData.svUserId,
        accItemList: accItemListStr,
      }
      let opt = ['0']
      //获取所有辅助项列表
      getRptAccItemTypePost(param, opt)
        .then((result) => {
          if (result.data.flag == 'fail') {
            throw result.data.msg
          } else {
            if (isInit) {
              this.accItemTypeList = result.data.data
              //初始时会计科目默认是选中状态
              this.accItemTypeList.forEach((element, index) => {
                if (element.accItemCode === 'ACCO') {
                  this.$set(element, 'isChecked', true)
                }
              })
            } else {
              this.accItemTypeList.forEach((element) => {
                if (this.accItemTypeCheckList.some((item) => item.accItemCode === element.accItemCode)) {
                  // 已选方案有该项
                  this.$set(element, 'isChecked', true)
                } else {
                  this.$set(element, 'isChecked', false)
                }
              })
            }
          }
        })
        .catch(this.$showError)
    },
    /**
     * @description: 组织整理查询方案参数数据
     * @return {Object} 返回方案内容对象
     */
    qryItemsData() {
      let prjContent = {
        agencyAcctInfo: [
          {
            acctCode: this.acctCode,
            agencyCode: this.agencyCode,
          },
        ],
        qryItems: this.accItemTypeCheckList, //辅助项
        rptCondItem: [
          {
            condCode: 'stadAmtFrom', // 查询条件代码
            condName: '金额起', // 查询条件名称
            condText: this.stadAmtFrom ? revertNumMoney(this.stadAmtFrom) : '', // 查询条件值
            condValue: this.stadAmtFrom ? revertNumMoney(this.stadAmtFrom) : '', // 查询条件值
          },
          {
            condCode: 'stadAmtTo',
            condName: '金额止',
            condText: this.stadAmtTo ? revertNumMoney(this.stadAmtTo) : '',
            condValue: this.stadAmtTo ? revertNumMoney(this.stadAmtTo) : '',
          },
        ],
        rptOption: this.optListData, // 其他
        vouTypeCode: this.vouTypeCode, // 凭证类型
        rptStyle: this.rptStyle, // 账表样式
        curCode: this.curCode, //货币代码
      }
      return prjContent
    },
    // 点击查询按钮事件
    queryHandle() {
      if (revertNumMoney(this.stadAmtFrom) > revertNumMoney(this.stadAmtTo)) {
        this.$message.error('开始金额不能大于结束金额！')
        return
      }
      this.drawerClose()
      //这里判断方案列表是空数组
      if(this.prjListEmpty){
        if (this.nowPrj === '') {
          // 没有方案时点击查询保存为方案
          this.nowPrj = '余额表方案'
          //保存成功之后会自动选择保存后的方案, 然后再查询
          this.savePrj('saveAdd', true)
        }
      }else{
        this.setEmptyAcctTreeToAll(() => {
          this.setSelectedData(this.qrySelectItemData)
          this.setQryItemData(this.accItemTypeCheckList) // 选择的查询项
          this.setPrjRptOption(this.optListData) // 查询项-其他
          this.setStadAmtFrom(revertNumMoney(this.stadAmtFrom)) // 金额-起
          this.setStadAmtTo(revertNumMoney(this.stadAmtTo)) // 金额-止
          this.$emit('queryClick')
        })
      }
    },
    /**
     * @description: 保存方案通用方法
     * @param {Boolean} prjListEmpty 方案列表为空标记
     */
    savePrj(flag, prjListEmpty) {
      if (!this.nowPrj) {
        this.$message.error('方案名称必填！')
        return
      }
      if (revertNumMoney(this.stadAmtFrom) > revertNumMoney(this.stadAmtTo)) {
        this.$message.error('开始金额不能大于结束金额！')
        return
      }

      //如果默认不选辅助核算范围，则全部展示在已选范围，会计科目特殊，显示的是挂在所选辅助核算下的会计科目。
      this.setEmptyAcctTreeToAll(() => {
        this.savePrjFn(flag, prjListEmpty)
      })
    },
    /**
     * @description: this.savePrj 中逻辑抽出
     */
    savePrjFn(flag, prjListEmpty) {
      var param = {}
      var opt = {
        acctCode: this.acctCode,
        agencyCode: this.agencyCode,
        prjCode: flag === 'save' ? this.prjCode : '', // save是保存,保存时，如果当前选中方案则传code修改方案内容，如果没有点击保存，名字不重复就会生成新方案；另存prjCode一定为空，生成新方案
        prjName: this.nowPrj,
        prjScope: this.prjScope, // 私有方案 本单位共享 全系统共享
        rptType: this.rptType,
        setYear: this.pfData.svSetYear,
        userId: this.pfData.svUserId,
        prjContent: this.qryItemsData(), // 整理参数
      }
      //保存方案
      postSavePrj(param, opt)
        .then((result) => {
          if (result.data.flag == 'fail') {
            throw result.data.msg
          } else {
            this.$message.success(result.data.msg)
            this.drawerClose()
            this.getPrjList().then(({ data }) => {
              if (data && data.length > 0) {
                this.setPrjGuid(data[0].prjGuid)
              }
              this.setSavePrjCode(result.data.data.prjCode)
              if(prjListEmpty){
                this.$message.success('已为您生成默认方案')
              }
            })
          }
        })
        .catch(this.$showError)
    },
    // 关闭弹框
    drawerClose() {
      this.$emit('visibleChange', false)
    },
    // 打开科目树弹框
    showZtreeDrawer(item) {
      this.accModalShow = true
      this.selectedAccItem = item
    },
    // 清除科目树选择的内容
    clearAll(item) {
      this.accItemTypeCheckListLoaded = false
      item.items = []
      this.zTreeSelectedData[item.accItemCode] = []
      this.accItemTypeCheckListLoaded = true
    },
    // 科目树弹框关闭
    accModalChange(show, key, flag, data) {
      this.accModalShow = show
      if (flag) {
        // 树弹框点击确认
        this.accItemTypeCheckList.forEach((element) => {
          // 组织查询项
          if (element.accItemCode === key.accItemCode) {
            let treeItems = []
            data.forEach((it) => {
              it.itemType = key.accItemCode
              let treeItem = {}
              treeItem.code = it.code
              treeItem.name = it.name
              treeItem.codeName = it.codeName
              treeItem.pCode = it.pCode
              treeItem.pId = it.pId
              treeItem.isLeaf = it.isLeaf
              treeItem.id = it.id
              treeItems.push(treeItem)
            })
            element.items = treeItems
            this.zTreeSelectedData[key.accItemCode] = treeItems
          }
        })
        this.setSelectedData(this.qrySelectItemData)
        this.setQryItemData(this.accItemTypeCheckList)
      }
    },
    /**
     * @description: 获取会计科目全部选项
     * @return {Promise}
     */
    getAccItemTreeData(eleCode) {
      let param = {
        agencyCode: this.agencyCode, // 单位
        acctCode: this.acctCode, // 账套
        setYear: this.pfData.svSetYear,
        userId: this.pfData.svUserId,
        eleCode: eleCode ? eleCode : 'ACCO',
        vouTypeCode: this.vouTypeCode, // 凭证类型
      }
      return getAccItemTree(param)
    },
    /**
     * @description: 如果某个辅助项勾选了，但是范围为空，在查询和保存执行时会将辅助项内容
     */
    async setEmptyAcctTreeToAll(callback) {
      let pArr = []
      this.accItemTypeCheckList.forEach((element) => {
        if (element.items.length === 0) {
          let arr = new Promise((resolve, reject) => {
            this.getAccItemTreeData(element.accItemCode).then((result) => {
              if (result.data.flag === 'fail') {
                throw result.data.msg
              }
              this.zTreeSelectedData[element.accItemCode] = result.data.data
              element.items = result.data.data
              resolve(this.accItemTypeCheckList)
            })
          })
          pArr.push(arr)
        }
      })
      Promise.all(pArr).then((result) => {
        this.setSelectedData(this.qrySelectItemData)
        this.setQryItemData(this.accItemTypeCheckList) // 选择的查询项
        if (callback && typeof callback === 'function') {
          callback()
        }
      })
    },
    // 账表数据范围选择框记忆上次选择的数据
    getSysRuleVal() {
      let urlParams = '/' + this.agencyCode
      let params = {
        chrCodes: 'GL060',
      }
      getSysRuleSet(params, {}, urlParams)
        .then((result) => {
          if (result.data.flag == 'fail') {
            throw result.data.msg
          } else {
            this.isRememberedGL060 = result.data.data.GL060
          }
        })
        .catch((error) => {})
    },
  },
}
</script>
<style lang="scss" scoped>
.line {
  width: 100%;
  height: 1px;
  background: #d8d8d8;
}
.drawer-btn-wrap {
  position: fixed;
  top: 132px;
  right: 0px;
  z-index: 99;
}
.drawer-btn {
  display: inline;
  background: #fff;
  padding: 8px 12px;
  border-radius: 50% 0 0 50%;
  box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.15);
}
.drawer-footer {
  position: absolute;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 50px;
  left: 0;
  padding: 0 15px;
  border-top: 1px solid #d9d9d9;
  background: #fff;
  box-sizing: border-box;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
.drawer-content {
  user-select: none;
  overflow-x: hidden;
  .bold {
    font-weight: bold;
  }
  .content-acctype-list {
    max-height: 100px;
    overflow: hidden;
    .acctype-item label {
      width: 120px;
      white-space: nowrap; /* 不换行 */
      overflow: hidden; /* 超出隐藏 */
      text-overflow: ellipsis; /* 超出部分显示省略号 */
    }
  }
  .content-acctype-list.all {
    max-height: none;
  }
  .content-tabs {
    padding: 0 16px 0 0;
    overflow: hidden;
    .tabs-wrap {
      width: 120px;
      min-height: 310px;
      float: left;
      border-right: 1px solid #d8d8d8;
      margin-top: -1px;
      margin-bottom: -1px;
      .tab-item {
        box-sizing: border-box;
        max-width: 120px;
        width: 120px;
        white-space: nowrap; /* 不换行 */
        overflow: hidden; /* 超出隐藏 */
        text-overflow: ellipsis; /* 超出部分显示省略号 */
        height: 35px;
        text-align: left;
        line-height: 35px;
        padding: 0 12px;
        &.active {
          border-left: 2px solid #108ee9;
          border-top: 1px solid #d8d8d8;
          border-bottom: 1px solid #d8d8d8;
          border-right: 1px solid #fff;
          color: #108ee9;
        }
      }
    }
    .tabs-main {
      margin-left: 119px;
      padding: 12px 0 0 16px;
      width: calc(100% - 119px);
      .check-wrap {
        padding-bottom: 11px;
        .clear-all {
          padding-right: 6px;
        }
      }
      .tree-wrap {
        width: 100%;
        height: 268px;
        border-top: 1px solid #d8d8d8;
        overflow: auto;
        position: relative;
        .iconWrap {
          width: 50px;
          height: 50px;
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          cursor: pointer;
          .addfileIcon {
            display: inline-block;
            background: #999;
            width: 4px;
            height: 50px;
            border-radius: 5px;
            position: absolute;
            top: 0px;
            left: 23px;
            &:after {
              content: '';
              width: 50px;
              height: 4px;
              background: #999;
              border-radius: 5px;
              position: absolute;
              top: 23px;
              left: -23px;
            }
          }
        }
      }
    }
  }
  .content-else {
    padding: 16px 42px 4px 16px;
    li {
      margin-bottom: 16px;
      .title {
        display: inline-block;
        width: 60px;
        text-align: right;
      }
    }
    li:last-child {
      margin-bottom: 0px;
    }
    .opt-list {
      margin: 0 6px 16px 0;
    }
  }
}
</style>
