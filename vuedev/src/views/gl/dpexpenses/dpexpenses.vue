<template>
  <div class="workspace">
    <frameheader @agencyChanged="agencyChangedListener" @acctChanged="acctChangedListener">
      <template slot="btns">
        <div class="btnsWrap">
          <a-button class="mr5">入账设置</a-button>
          <a-button type="primary" @click="showModal">登记</a-button>
        </div>
      </template>
    </frameheader>
    <div class="queryWrap">
      <a-row>
        <a-col :span="5">
          <a-form-item label="费用类型" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }" style="margin-bottom: 0;">
            <a-tree-select style="width: 200px" :dropdownStyle="{ maxHeight: '300px', overflow: 'auto' }"
              :treeData="accItemTree" placeholder='请选择费用类型' treeDefaultExpandAll v-model="accItemValue"
              @change="handleAccItemTreeChange">
            </a-tree-select>
          </a-form-item>
        </a-col>
        <a-col :span="5">
          <a-form-item label="发生日期" :label-col="{ span: 5 }" :wrapper-col="{ span: 17 }" style="margin-bottom: 0;">
            <a-range-picker :defaultValue="[moment(minOccurDate, dateFormat), moment(maxOccurDate, dateFormat)]"
              @change="onHappenDateChange" :placeholder="['开始日期', '结束日期']" />
          </a-form-item>
        </a-col>
        <a-col :span="2" :offset="12" style="text-align: right;">
          <a-button type="primary" style="margin-top:5px;" @click="getTableData">查询</a-button>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="5">
          <a-form-item label="摊销类型" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }" style="margin-bottom: 0;">
            <a-radio-group buttonStyle="solid" v-model="apportionType">
              <a-radio-button :value="item.ENU_CODE" v-for="item in apportionTypeList" :key="item.ENU_CODE">
                {{item.ENU_NAME}}</a-radio-button>
            </a-radio-group>
          </a-form-item>
        </a-col>
        <a-col :span="5">
          <a-form-item label="摊销金额" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }" style="margin-bottom: 0;">
            <a-input v-model="minApportionMoney" style="width:100px;" /> -
            <a-input v-model="maxApportionMoney" style="width:100px;" />
          </a-form-item>
        </a-col>
      </a-row>
    </div>
    <tableToolsBar @toolsBarBtnsCallBack="toolsBarBtnsCallBack"></tableToolsBar>
    <div class="tableWrap">
      <a-table :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}" :columns="columns"
        :dataSource="tableData" @expandedRowsChange="expandedRowsChange">
        <a-table slot="expandedRowRender" slot-scope="record" :columns="innerColumns" :dataSource="record.innerData" :pagination="false">
          <span slot="action">
            <a href="javascript:;">修改</a>
            <a href="javascript:;" style="margin-left:10px;">删除</a>
            <a href="javascript:;" style="margin-left:10px;">制证</a>
          </span>
        </a-table>
        <span slot="action">
          <a href="javascript:;">摊销</a>
          <a href="javascript:;" style="margin-left:10px;">转出</a>
        </span>
      </a-table>
    </div>
    <uf-modal title="待摊费用登记" v-model="loginModalVisible" :width="720">
      <template slot="footer">
        <a-button key="saveAdd" class="mr-10" type="primary" :loading="loginModalLoading" @click="handleSaveAdd">
          保存并新增
        </a-button>
        <a-button key="save" class="mr-10" :loading="loginModalLoading" @click="handleSave">保存</a-button>
        <a-button key="close" @click="handleCancel">关闭</a-button>
      </template>
      <a-row>
        <a-col :span="12">
          <a-form-item label="摊销类型" :label-col="{ span: 5 }" :wrapper-col="{ span: 14 }" style="margin-bottom: 0;">
            <a-radio-group buttonStyle="solid" v-model="modalApportionType">
              <a-radio-button :value="item.ENU_CODE" v-for="item in apportionTypeList" :key="item.ENU_CODE">
                {{item.ENU_NAME}}</a-radio-button>
            </a-radio-group>
          </a-form-item>
        </a-col>
      </a-row>
      <div class="loginModalMain">
        <div class="loginModalTitle">
          摊销信息
        </div>
        <div style="padding:10px;">
          <a-row>
            <a-col :span="12">
              <a-form-item label="费用类型" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }" style="margin-bottom: 0;">
                <a-tree-select style="width: 200px" :dropdownStyle="{ maxHeight: '300px', overflow: 'auto' }"
                  :treeData="accItemTree" placeholder='请选择费用类型' treeDefaultExpandAll v-model="modalAccItemValue"
                  @change="handleModalAccItemTreeChange">
                </a-tree-select>
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="发生日期" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }" style="margin-bottom: 0;">
                <a-date-picker @change="onOccurDateChange" style="width:200px" placeholder="发生日期"
                  :defaultValue="moment(occurDate)" />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="12">
              <a-form-item label="开始日期" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }" style="margin-bottom: 0;">
                <a-date-picker @change="onStartDateChange" style="width:200px" placeholder="开始日期"
                  :defaultValue="moment(startDate)" />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="到期日期" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }" style="margin-bottom: 0;">
                <a-date-picker @change="onEndDateChange" style="width:200px" placeholder="到期日期"
                  :defaultValue="moment(endDate)" />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="12">
              <a-form-item label="摊销金额" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }" style="margin-bottom: 0;">
                <a-input placeholder="请输入摊销金额" v-model="apportionMoney" style="width:200px" />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="摊销期" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }" style="margin-bottom: 0;">
                <a-input placeholder="请输入摊销期" v-model="apportionPeriod" style="width:200px" />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="12">
              <a-form-item label="票据号" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }" style="margin-bottom: 0;">
                <a-input placeholder="请输入票据号" v-model="billNo" style="width:200px" />
              </a-form-item>
            </a-col>
          </a-row>
        </div>
      </div>
      <div>
        <a-row style="margin-top:10px">
          <a-col :span="24">
            <a-form-item label="备注" :label-col="{ span: 3 }" :wrapper-col="{ span: 21 }" style="margin-bottom: 0;">
              <a-textarea v-model="remark" placeholder="请输入备注" :autosize="{ minRows: 2, maxRows: 6 }" />
            </a-form-item>
          </a-col>
        </a-row>
      </div>
    </uf-modal>
  </div>
</template>

<script>
  import moment from 'moment';
  import frameheader from '../../../components/frameheader'
  import tableToolsBar from '../../../components/tableToolsBar'
  const columns = [{
    title: '序号',
    align: 'center',
    dataIndex: 'rowno',
  }, {
    title: '费用类型',
    dataIndex: 'fylxName',
  }, {
    title: '发生日期',
    align: 'center',
    dataIndex: 'occurDate',
  }, {
    title: '摊销类型',
    align: 'center',
    dataIndex: 'apportionTypeName',
  }, {
    title: '开始日期',
    align: 'center',
    dataIndex: 'startDate',
  }, {
    title: '到期日期',
    align: 'center',
    dataIndex: 'endDate',
  }, {
    title: '摊销金额',
    align: 'right',
    dataIndex: 'apportionMoney',
  }, {
    title: '摊销期',
    dataIndex: 'apportionPeriod',
  }, {
    title: '已摊销金额',
    align: 'right',
    dataIndex: 'apportionedMoney',
  }, {
    title: '已摊销期',
    dataIndex: 'apportionedPeriod',
  }, {
    title: '未摊销金额',
    align: 'right',
    dataIndex: 'noapportionedMoney',
  }, {
    title: '未摊销期',
    dataIndex: 'noapportionedPeriod',
  }, {
    title: '状态',
    align: 'center',
    dataIndex: 'statusName',
  }, {
    title: '操作',
    align: 'center',
    key: 'action',
    scopedSlots: {
      customRender: 'action'
    },
  }];
  const innerColumns = [{
    title: '序号',
    align: 'center',
    dataIndex: 'rowno',
  }, {
    title: '备查类型',
    dataIndex: 'businessTypeName',
  }, {
    title: '摊销期',
    dataIndex: 'apportionPeriod',
  }, {
    title: '摊销日期',
    dataIndex: 'apportionDate',
  }, {
    title: '当期摊销金额',
    dataIndex: 'apportionMoney',
  }, {
    title: '转出金额',
    dataIndex: 'outMoney',
  }, {
    title: '操作人',
    dataIndex: 'createUserName',
  }, {
    title: '操作',
    align: 'center',
    key: 'action',
    scopedSlots: {
      customRender: 'action'
    },
  }];
  const today = moment().startOf('day').format('YYYY-MM-DD');
  export default {
    name: 'dpexpenses',
    data() {
      return {
        agencyValue: '', //单位值
        acctValue: '', //账套值
        accItemTree: [],
        accItemValue: '', //费用类型
        modalAccItemValue: '', //登记modal 费用类型
        apportionTypeList: [],
        apportionType: '', //摊销类型
        modalApportionType: '', //登记modal 摊销类型
        tableData: [],
        selectedRowKeys: [],
        dateFormat: 'YYYY-MM-DD',
        minOccurDate: moment().date(1).format('YYYY-MM-DD'),
        maxOccurDate: today,
        minApportionMoney: '',
        maxApportionMoney: '',
        columns,
        innerColumns,
        innerData:[],//这是个二维数组 数组里面是各个子表格的数据数组
        subTableIndex: 0,//子表格下标
        expandedRows:[],//展开的子表格对应了父表格的哪一行
        loginModalVisible: false,
        loginModalLoading: false,
        occurDate: '', //登记modal 发生日期
        startDate: '', //登记modal 开始日期
        endDate: '', //登记modal 结束日期
        apportionMoney: '', //登记modal 摊销金额
        apportionPeriod: '', //登记modal 摊销期
        billNo: '', //登记modal 票据号
        remark: '' //登记modal 备注
      }
    },
    components: {
      frameheader,
      tableToolsBar
    },
    methods: {
      moment,
      expandedRowsChange(expandedRows){
        console.log(expandedRows);
        //对比两个数组 挑出新增的一个 并取出其中的id 找出两个数组中不一样的 形成数组
        var arr = this.expandedRows.concat(expandedRows),rel = {},narr = [],cur = 0;
        if(expandedRows.length!=1){
          for(var i = 0;i < arr.length; i ++){
            arr[i] in rel ? rel[arr[i]] ++ : rel[arr[i]] = 1;
          }
          for(let x in rel){
            if(rel[x] == 1){
              narr.push(x);
            }
          }
          cur = narr[0];//角标
        }
        console.log(cur);
        this.subTableIndex = cur;
        //bookGuid
        let id = this.tableData[cur].bookGuid;
        this.getApportionBookDetail(id);
        this.expandedRows = expandedRows;
        console.log(this.expandedRows);
      },
      getApportionBookDetail(id){
        console.log(id);
        this.$axios({
          method: 'GET',
          url: 'gl/ApportionBook/getDetail/'+id+'?roleId=9091',
        }).then(res => {
          console.log(res);
          if(res.data.flag==='success'){
            // this.innerData.push(res.data.data);
            let i = 0;
            while (res.data.data.length > i) {
              res.data.data[i].rowno = i + 1;
              i++;
            }
            this.$set(this.tableData[this.subTableIndex],'innerData',res.data.data)
          }
        })
      },
      toolsBarBtnsCallBack(type) {
        if (type === 'print') {
          console.log('打印逻辑');
        } else if (type === 'exportData') {
          console.log('导出数据逻辑');
        } else {
          return;
        }
      },
      agencyChangedListener(res) {
        console.log('agencyChangedListener');
        this.agencyValue = res;
        this.getAccItemTree(res);
      },
      acctChangedListener(res) {
        console.log('acctChangedListener');
        this.acctValue = res;
        this.getTableData();
      },
      showModal() {
        this.occurDate = today; //登记modal 发生日期
        this.startDate = today; //登记modal 开始日期
        this.endDate = today; //登记modal 结束日期
        this.loginModalVisible = true;
        this.modalApportionType = this.apportionTypeList[0].ENU_CODE;
        this.modalAccItemValue = this.checkAccNodeChildren(this.accItemTree[0]);
        this.apportionMoney = '';
        this.apportionPeriod = '';
        this.billNo = '';
        this.remark = ''
      },
      //重置modal数据
      resetModalData() {
        this.apportionMoney = '';
        this.apportionPeriod = '';
        this.billNo = '';
        this.remark = ''
      },
      //重置modal部分数据
      resetSomeModalData() {
        this.apportionMoney = '';
        this.apportionPeriod = '';
        this.billNo = '';
      },
      insert(cb) {
        this.loginModalLoading = true;
        this.$axios({
          method: 'POST',
          url: 'gl/ApportionBook/insert?roleId=9091',
          data: {
            acctCode: this.acctValue,
            agencyCode: this.agencyValue,
            setYear: '2019',
            rgCode: '87',
            bookGuid: '',
            fylxCode: this.modalAccItemValue,
            apportionType: this.modalApportionType,
            occurDate: this.occurDate,
            startDate: this.startDate,
            endDate: this.endDate,
            apportionMoney: Number(this.apportionMoney).toFixed(2),
            apportionPeriod: this.apportionPeriod,
            billNo: this.billNo,
            remark: this.remark,
          }
        }).then(res => {
          this.loginModalLoading = false;
          console.log(res.data);
          if (res.data.flag === 'success') {
            this.$message.success(res.data.msg);
            this.getTableData();
            if (typeof (cb) === 'function') {
              cb();
            }
          } else {
            this.$message.error(res.data.msg);
          }
        }).catch(err => {
          this.loginModalLoading = false;
          console.log(err);
          this.$message.error(err);
        })
      },
      handleSaveAdd() {
        this.insert(() => {
          this.resetModalData();
        })
      },
      handleSave() {
        this.insert(() => {
          // setTimeout(()=>{
          this.handleCancel()
          // },2000);
        });
      },
      handleCancel() {
        this.loginModalVisible = false;
        this.resetSomeModalData();
      },
      onSelectChange(selectedRowKeys) {
        console.log('selectedRowKeys changed: ', selectedRowKeys);
        this.selectedRowKeys = selectedRowKeys
      },
      handleAccItemTreeChange(value) {
        console.log(value)
        this.modalAccItemValue = value;
      },
      handleModalAccItemTreeChange(value) {
        console.log(value)
        this.accItemValue = value;
      },
      //date: moment, dateString: string
      onHappenDateChange(date, dateString) {
        // console.log(date,dateString);
        this.minOccurDate = dateString[0];
        this.maxOccurDate = dateString[1];
        console.log(this.minOccurDate, this.maxOccurDate);
      },
      /**
       * modal methods
       */
      onOccurDateChange(date, dateString) {
        console.log(date, dateString);
        this.occurDate = dateString;
      },
      onStartDateChange(date, dateString) {
        console.log(date, dateString);
        this.startDate = dateString;
      },
      onEndDateChange(date, dateString) {
        console.log(date, dateString);
        this.endDate = dateString;
      },
      /**
       * 检查树的孩子结点返回最深的结点值
       * @param [object] 结点对象
       * return 第一个叶子结点的value
       */
      checkAccNodeChildren(node) {
        if (node.children.length > 0) {
          return this.checkAccNodeChildren(node.children[0])
        } else {
          return node.value
        }
      },

      //费用类型
      getAccItemTree(agencyCode) {
        this.$axios({
          method: 'get',
          url: 'gl/common/glAccItemData/getAccItemTree',
          params: {
            roleId: 9091,
            setYear: 2019,
            rgCode: 87,
            agencyCode: agencyCode,
            eleCode: 'FYLX'
          }
        }).then(res => {
          console.log(res.data.data);
          let accItemTree = [];
          res.data.data.forEach(function (item) {
            if (item.pId && item.pId !== '*') {
              for (let it of accItemTree) {
                if (it.key === item.pId) {
                  it.children.push({
                    title: item.codeName,
                    value: item.code,
                    key: item.id,
                    children: []
                  })
                }
              }
            } else {
              accItemTree.push({
                title: item.codeName,
                value: item.code,
                key: item.id,
                children: []
              });
            }
          });
          this.accItemTree = accItemTree;
          console.log(this.accItemTree);
          if (accItemTree.length > 0) {
            this.accItemValue = this.checkAccNodeChildren(accItemTree[0]);
            this.modalAccItemValue = this.accItemValue;
          }
        })
      },
      //APPORTION_TYPE
      getApportionType() {
        this.$axios.get('gl/enumerate/APPORTION_TYPE?roleId=9091').then(res => {
          console.log(res.data.data)
          this.apportionTypeList = res.data.data;
          this.apportionType = this.apportionTypeList.length > 0 ? this.apportionTypeList[0].ENU_CODE : '';
        })
      },
      getTableData() {
        this.$axios({
          method: "POST",
          url: "gl/ApportionBook/select",
          data: {
            acctCode: this.acctValue,
            agencyCode: this.agencyValue,
            apportionType: this.apportionType,
            fylxCode: this.accItemValue,
            maxApportionMoney: this.maxApportionMoney,
            maxOccurDate: this.maxOccurDate,
            minApportionMoney: this.minApportionMoney,
            minOccurDate: this.minOccurDate,
            rgCode: "87", //from const
            setYear: "2019" //from const
          }
        }).then(res => {
          console.log(res.data.data)
          var i = 0;
          while (res.data.data.length > i) {
            res.data.data[i].rowno = i + 1;
            i++;
          }
          this.tableData = res.data.data;
        });
      }
    },
    created() {
      this.getApportionType();
    }
  }
</script>

<style scoped>
  .workspace {
    padding: 0 15px;
  }

  .mr5 {
    margin-right: 5px;
  }

  .queryWrap {
    background-color: #ECF6FD;
    padding: 15px;
    clear: both;
    border: 1px solid #D2EAFB;
  }

  .loginModalMain {
    margin-top: 10px;
    border: 1px #d9d9d9 solid;
    border-radius: 5px;
  }

  .loginModalTitle {
    padding: 10px;
    border-bottom: 1px #d9d9d9 solid;
  }
</style>