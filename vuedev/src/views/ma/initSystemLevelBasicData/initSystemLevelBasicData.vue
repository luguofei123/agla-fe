<template>
<div>
  <div class="header-wrap">
    <div class="title-wrap">
      <div class="caption">
        <div class="title">{{ titleName }}</div>
      </div>
    </div>
  </div>
  <div class="buttonBox">
    <a-button type="primary" class="btn-initbasesys" @click="selectZTdata" style="margin-right:20px;">取中台基础数据</a-button>
    <a-button type="primary" class="btn-initbasesys" @click="initSelect">初始化财务基础数据</a-button>
  </div>
<div class="initDataTable">
    <el-table
    border
    height="500"
    size='mini'
    v-loading="loadingButton"
    ref="multipleTable"
    :data="tableData"
    style="width: 100%;"
    @selection-change="handleSelectionChange"
    :header-cell-style="{background:'#eef1f6',color:'#606266', fontSize:'14px',textAlign:'center',height:'40px'}"
    :row-class-name="tableRowClassName">
    <el-table-column type="selection" width="55" align="center"></el-table-column>
    <el-table-column prop="chrId" label="操作" width="95" align="center">
        <template slot-scope="scope">
          <el-button class="initButton" size="mini"  @click="initOne(scope.row)" type="text">初始化</el-button>
        </template>
    </el-table-column>
    <el-table-column prop="eleName" label="基础数据类别" align="left"></el-table-column>
    <el-table-column prop="flag" label="同步结果" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.flag==='success'">{{scope.row.data}}</span>
          <span v-if="scope.row.flag==='fail'">0</span>
          <span v-if="scope.row.flag===undefined"></span>
          <div v-if="scope.row.flag===''" >正在初始化<span id="dot"></span></div>
        </template>    
    </el-table-column>
  </el-table>
</div>
</div>
</template>
<script>
import { mapState } from "vuex";
import { filter } from 'xe-utils/methods';
export default {
  data () {
    return {
      loadingButton: false,
      titleName: '初始化系统级基础数据',
      multipleSelection: [],
      tableData: [
        // {"chrId":"01","rgCode":"440000000","setYear":"2020","eleCode":"AGENCY","eleName":"单位","linkCode":"Agency","linkName":"单位"},
        // {"chrId":"02","rgCode":"440000000","setYear":"2020","eleCode":"BGTSOURCE","eleName":"预算来源","linkCode":"SourceType","linkName":"预算来源"},
        // {"chrId":"03","rgCode":"440000000","setYear":"2020","eleCode":"EXPECO","eleName":"部门经济分类","linkCode":"DepBgtEco","linkName":"部门经济分类"},
        // {"chrId":"04","rgCode":"440000000","setYear":"2020","eleCode":"DEPARTMENT","eleName":"部门","linkCode":"Supdep","linkName":"部门"},
        // {"chrId":"05","rgCode":"440000000","setYear":"2020","eleCode":"FUNDTYPE","eleName":"资金性质","linkCode":"FundType","linkName":"资金性质"},
        // {"chrId":"06","rgCode":"440000000","setYear":"2020","eleCode":"FATYPE","eleName":"资产类型","linkCode":"FixedAssetType","linkName":"资产类型"},
        // {"chrId":"07","rgCode":"440000000","setYear":"2020","eleCode":"SETMODE","eleName":"结算方式","linkCode":"SetMode","linkName":"结算方式"},
        // {"chrId":"08","rgCode":"440000000","setYear":"2020","eleCode":"FUNDSOURCE","eleName":"经费来源","linkCode":"FoundType","linkName":"经费来源"},
        // {"chrId":"09","rgCode":"440000000","setYear":"2020","eleCode":"REGION","eleName":"财政区划","linkCode":"MofDiv","linkName":"财政区划"},
        // {"chrId":"10","rgCode":"440000000","setYear":"2020","eleCode":"GOVEXPECO","eleName":"政府经济分类","linkCode":"GovBgtEco","linkName":"政府经济分类"},
        // {"chrId":"11","rgCode":"440000000","setYear":"2020","eleCode":"EXPTYPE","eleName":"支出类型","linkCode":"PayBizType","linkName":"支出类型"},
        // {"chrId":"12","rgCode":"440000000","setYear":"2020","eleCode":"EXPFUNC","eleName":"支出功能分类","linkCode":"ExpFunc","linkName":"支出功能分类"},
        // {"chrId":"13","rgCode":"440000000","setYear":"2020","eleCode":"PAYTYPE","eleName":"支付方式","linkCode":"PayType","linkName":"支付方式"},
        // {"chrId":"14","rgCode":"440000000","setYear":"2020","eleCode":"CURRENCY","eleName":"币种","linkCode":"Currency","linkName":"币种"}
      ],
    }
  },
  computed: {
    ...mapState({
      pfData: (state) => state.pfData, // 全局的commonData 用户当前登陆公共信息
    })
  },
  created () {
     this.getTableList()
     console.log(this.pfData)
  },
  methods: {
    getTableList () {
      // this.loadingButton = true
      let param = {
          rgCode: this.pfData.svRgCode,  // 区划
          setYear: this.pfData.svSetYear, // 年度
      }
      this.$axios.get('/agal-adapter/syn/base/getSyncRelationList',{
          params: param,
          headers:{ 'x-function-id': this.pfData.svMenuId }

      })
        .then((result) => {
          if (result.data.flag === 'success') {
            this.loadingButton = false
            this.tableData = result.data.data
          } else {
            this.tableData = []
            this.loadingButton = false
            throw result.data.msg
          }
        })
        .catch(this.$showError)
    },
    // 单个更新
    initOne (row) {
      let arr = [row]
      this.initSysBasicData(arr)
    },
    // 批量更新
    initSelect () {
      if (this.multipleSelection.length === 0) {
          this.$message.warning('请至少选择一项进行初始化');
          return
      }
      this.initSysBasicData(this.multipleSelection)

    },
    // 更新函数 传递一个数组
    initSysBasicData (arr) {
      for(let i = 0; i< arr.length; i++) {
        let initIndex = this.tableData.findIndex((item,index) => {
              return item.chrId === arr[i]['chrId']
        })
        // 这样做主要是为了让用户知道哪几个正在更新
        arr[i].flag = ''              // 改变状态
        arr[i].data = ''              // 改变数量
        this.$set(this.tableData,initIndex,arr[i])  // 强制更新
        let req = this.$axios.get('/ma/dataSyncByEleCode',{
            params:{
              rgCode: this.pfData.svRgCode,   // 区划
              setYear: this.pfData.svSetYear, // 年度
              eleCode: arr[i]['eleCode']      // 要素编码
            },
            headers:{ 'x-function-id': this.pfData.svMenuId }
        })
        .then((result) => {
          if (result.data.flag === 'success') {
            arr[i].flag = result.data.flag              // 改变状态
            arr[i].data = result.data.data              // 改变数量
            this.$set(this.tableData,initIndex,arr[i])  // 强制更新
          } else {
            arr[i].flag = result.data.flag              // 改变状态
            arr[i].data = result.data.data              // 改变数量
            this.$set(this.tableData,initIndex,arr[i])  // 强制更新
            throw result.data.msg
          }
        })
        .catch(this.$showError)

       }
    },
    // 取中台基础数据
    selectZTdata () {
      let param = {
          rgCode: this.pfData.svRgCode,  // 区划
          setYear: this.pfData.svSetYear, // 年度
      }
      this.$axios.get('/agal-adapter/syn/base/dataSync',{
          params: param,
          headers:{ 'x-function-id': this.pfData.svMenuId }
      })
        .then((result) => {
          if (result.data.flag === 'success') {
             this.$message.success(result.data.msg)
          } else {
             this.$message.success(result.data.msg)
          }
        })
        .catch(this.$showError)     
    },
    // initSysBasicData () {
    //   this.$axios
    //     .post('/ma/sys/element/init85ManageRules',{id:'wswswsww'})
    //     .then((result) => {
    //       if (result.data.flag === 'success') {
    //         this.$message.success('发送请求成功')
    //         console.log(result)
    //       } else {
    //         throw result.data.msg
    //       }
    //     })
    //     .catch(this.$showError)
    // },
    tableRowClassName ({ row, rowIndex }) {
      if ((rowIndex + 1) % 2 === 0) {
        return 'success-row'
      }
      return ''
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
      console.log(this.multipleSelection)
    },
  }
}
</script>
<style lang="scss" scoped>
.buttonBox{
    margin-top:10px;
    margin-bottom:10px;
}
.header-wrap {
  position: relative;
  border-bottom: 1px solid #dfe6ec;
  height: 46px;
  .title-wrap {
    float: left;
    width: 582px;
    display: flex;
    align-items: center;
  }
  .caption {
    display: inline-block;
    font-size: 18px;
    line-height: 18px;
    padding: 13px 0 11px 0;
    border-bottom: 3px solid #108ee9;
    .title {
      font-size: 16px;
      color: #2f353b;
      font-weight: 400;
    }
  }
}
.initDataTable .initButton:active, .initDataTable .initButton:hover {
    text-decoration: none;
    outline: 0;
    color: #69c0ff;
}
.initDataTable .initButton{
    text-decoration: underline;
    color: #333;
}
#dot{
    height: 2px;
    width: 2px;
    display: inline-block;
    border-radius: 1px;
    animation: dotting 2.4s  infinite step-start;
}
@keyframes dotting {
    25%{
        box-shadow: 2px 0 0 #606266;
    }
    50%{
        box-shadow: 2px 0 0 #606266 ,7px 0 0 #606266;
    }
    75%{
        box-shadow: 2px 0 0 #606266 ,7px 0 0 #606266, 12px 0 0 #606266;
    }
}
</style>
<style lang="scss">
.initDataTable .el-table--mini th, .initDataTable .el-table--mini td{
  padding: 2px 0 2px 0;
  font-size: 14px;
}
.initDataTable .el-table .success-row {
    background: #F3F3F3;
}
.initDataTable .el-table--enable-row-hover .el-table__body tr:hover>td{
background-color: #ecf6fd !important;
}
.initDataTable .el-table--border:after,
.initDataTable .el-table--group:after,
.initDataTable .el-table:before {
    background-color: #C0C4CC;
}

.initDataTable .el-table--border,
.initDataTable .el-table--group {
    border-color: #C0C4CC;
}

.initDataTable .el-table td,
.initDataTable .el-table th.is-leaf {
    border-bottom: 1px solid #C0C4CC;
}

.initDataTable .el-table--border th,
.initDataTable .el-table--border th.gutter:last-of-type {
    border-bottom: 1px solid #C0C4CC;
}

.initDataTable .el-table--border td,
.initDataTable .el-table--border th {
    border-right: 1px solid #C0C4CC;
}
</style>