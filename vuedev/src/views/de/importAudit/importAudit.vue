<!--
 * @Author: luguofei
 * @Date: 2020-09-27 10:00:39
 * @LastEditTime: 2020-09-27 10:51:56
 * @LastEditors: Please set LastEditors
 * @Description: 国标数据导入
 * @FilePath: 
 -->
<template>
<div class="uploadDataBox">
  <div class="header-wrap">
    <div class="title-wrap">
      <div class="caption">
        <div class="title">{{ titleName }}</div>
      </div>
    </div>
  </div>
  <div class="buttonBox">
    <!-- <a-button type="primary" class="btn-initbasesys" @click="selectZTdata" style="margin-right:20px;">取中台基础数据</a-button>
    <a-button type="primary" class="btn-initbasesys" @click="initSelect">初始化财务基础数据</a-button> -->
    <!-- <a-checkbox :checked="isShow" @change="onChange">是否显示账套 </a-checkbox> -->
<a-select placeholder="选择科目表代码" v-model="accsCode"   @change="handleSelectChange" style="width:220px;font-size:14px;">
<a-select-option v-for="(item, index) in selectList" :key="index" :value="item.chrCode">{{item.chrName}}</a-select-option>
</a-select>
  </div>
<div class="uploadDataTable" style="margin-top:10px;" >
  <!-- <div class="uploadDataTable" style="margin-top:10px;" :key="changgeindex"> -->
    <el-table
    height="300"
    size='mini'
    v-loading="loadingTable"
    ref="tableData"
    :data="tableData"
    style="width: 100%;"
    :header-cell-style="{background:'#eef1f6',color:'#606266', fontSize:'14px',textAlign:'center',height:'40px'}"
    >
    <!-- :row-class-name="tableRowClassName" -->
    <el-table-column prop="codeName" label="单位" width="400" align="left">
        <template slot-scope="scope">
              <span v-if="scope.row.levelNum ===1 ">{{scope.row.codeName}}</span>
              <span v-if="scope.row.levelNum ===2 " style="margin-left:20px;">{{scope.row.codeName}}</span>
              <span v-if="scope.row.levelNum ===3 " style="margin-left:40px;">{{scope.row.codeName}}</span>
              <span v-if="scope.row.levelNum ===4 " style="margin-left:60px;">{{scope.row.codeName}}</span>
        </template>
    </el-table-column>
    <el-table-column prop="vouFisPerd" label="状态" width="250" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.isLeaf ==1 && scope.row.vouFisPerd==='未导入'" style="color:red;">{{scope.row.vouFisPerd}}</span>
          <span v-else style="color:blue;">{{scope.row.vouFisPerd}}</span>
        </template>
    </el-table-column>
    <el-table-column prop="flag" label="" align="center">
        <template slot-scope="scope">
            <!-- 账套显示 -->
            <div class="uploadClass" v-if="scope.row.isLeaf ==1">
                <span v-if="scope.row.fileName" class="text">{{scope.row.fileName}}</span>
                <span v-else class="text" style="color:rgb(160 153 153);">选择导入文件，zip格式</span>
                <input :ref="'uploadInput'+scope.$index"  type="file" class="filess"  @change="transDataTo($event,scope.$index)" style="opacity: 0;width:0"/>
                <a-button  @click="trickUpload('uploadInput'+scope.$index)"><a-icon type="upload" />上传文件</a-button>
            </div>
            <!-- 账套隐藏 -->
            <!-- <div class="uploadClass" v-if="scope.row.count <= 1 && !isShow">
                <span v-if="scope.row.fileName" class="text">{{scope.row.fileName}}</span>
                <span v-else class="text" style="color:rgb(160 153 153);">选择导入文件，zip格式</span>
                <input :ref="'uploadInput'+scope.$index" type="file" class="filess"  @change="transDataTo($event,scope.$index)" style="opacity: 0;width:0"/>
                <a-button class="btn-upload" @click="trickUpload('uploadInput'+scope.$index)"><a-icon type="upload" />上传文件</a-button>
            </div> -->
        </template>  
    </el-table-column>
  </el-table>
  <div style="text-align:center;margin:5px 0;">
      <!-- <a-button type="primary"  :class="getBtnPer('btn-upload')"  :loading="loadingButton"  @click="startUpload">开始导入</a-button> -->
      <a-button type="primary"    :loading="loadingButton"  @click="startUpload">{{uploadButtonText}}</a-button>
  </div>
  <div class="uploadLog">
     <div class="uploadLogText" :style="{height:logHeight+'px'}"  v-loading="loadingLog">
       <p v-for="(result,index) in textLog" :key="index">
         {{result}}
       </p>
       <p v-if="uploadStatusrRateVal!=1000 && loadingButton == true">国标数据正在导入<span id="dot"></span></p>
     </div>
  </div>
</div>
</div>
</template>
<script>
import { mapState } from "vuex";
import store from '@/store/index.js'
import { filter } from 'xe-utils/methods';
import md5 from 'js-md5'
import {
  getBtnPer,
} from "@/assets/js/util";
import {
  treeDate
} from "./test.js";
export default {
  data () {
    return {
      SHOWACCCODE: false,
      loadingTable: false,
      loadingButton: false,
      loadingLog:false,
      titleName: '国标数据导入',
      dataType: 'QCBAL,VOU,BASE',  // 期初余额 会计凭证 公共档案  默认都选择上
      tableData: [],
      dataList:[],   // 此处计划是用来不显示子节点的备份数据，暂时不用
      selectList:[],  // 科目类可选择项目的数据集合
      accsCode: '',  // 科目类的默认选项
      textLog:[],
      logHeight: 200,
      changgeindex:1,   // 用来重新渲染整棵树的标志，暂时不用。
      uploadButtonText: '开始导入',
      importUuid: '', // 随机数
      uploadStatusrRateVal: 0
    }
  },
  computed: {
    ...mapState({
      pfData: (state) => state.pfData, // 全局的commonData 用户当前登陆公共信息
    })
  },
  created () {
     this.getSystemForIsShowAcccode()
  },
  mounted () {
    const that = this
    window.onresize = () => {
        return (() => {
            // let windowHeight = window.innerHeight
            // let tableHeight =  that.$refs.tableData.offsetHeight
            // that.logHeight = windowHeight - 500
            // console.log(windowHeight)
            // console.log(tableHeight)
            // console.log(that.logHeight)
        })()
    }

  },
  methods: {
    getBtnPer,
    // 获取系统数据的接口，判断是否显示账套
    getSystemForIsShowAcccode () {
      // console.log(this.pfData)
      // console.log(store.state)
      let param = {
          rgCode: this.pfData.svRgCode,  // 区划
          setYear: this.pfData.svSetYear, // 年度
          acctCode:'*',
          agencyCode:this.pfData.svAgencyCode,
          chrCode: 'DE001'
      }
      // http://10.16.21.57:9200/ma/sysrgpara/getSysRgparaValueByChrCode/DE001
      // "msg":"成功","flag":"success","data":"0"}
      // console.log(this.pfData)
       this.$axios.get("ma/sysrgpara/getSysRgparaValueByChrCode/DE001",{
      //this.$axios.get('/ma/api/sysRgPara/selectChrValueByChrCodeApi',{
         //params: param,
          // headers:{ 'x-function-id': this.pfData.svMenuId }

      })
        .then((result) => {
          if (result.data.flag === 'success') {
            let b = result.data.data
            if (b!=0){
              this.SHOWACCCODE = true
            } else {
              this.SHOWACCCODE = false
            }
            this.initKumu()
          } else {
            throw result.data.msg
          }
        })
        .catch(this.$showError)

    },
    // 初始化科目
    initKumu () {
      let param = {
          rgCode: this.pfData.svRgCode,  // 区划
          setYear: this.pfData.svSetYear, // 年度
          menuId:  store.state.menuid,
          roleId: this.pfData.svRoleId,
          rueicode: md5(this.pfData.svUserCode),
          ajax:1
      }
      this.$axios.get('/ma/sys/accs/selectByAcct',{
          params: param,
          // headers:{ 'x-function-id': this.pfData.svMenuId }

      })
        .then((result) => {
          if (result.data.flag === 'success') {
            this.loadingTable = false
            this.selectList = result.data.data
            if (result.data.data.length>0&&result.data.data[0].chrName){
              this.accsCode = result.data.data[0].chrCode
              this.getTableList()
            } else {
              this.accsCode = '';
              // this.$message.warning('科目体系不能为空！')
            }
          } else {
            this.selectList = []
            this.loadingTable = false
            throw result.data.msg
          }
        })
        .catch(this.$showError)
    },
    handleSelectChange () {
      this.getTableList()
    },
    isShowChild (boolean) {
      if (!boolean) {
         console.log('账套不显示')
         for(let i = 0;i<this.tableData.length;i++){
             if (this.tableData[i]['isLeaf'] == 1) {
               // {"id":"001001_001","code":"001","name":"ces","codeName":"001 ces","chrFullname":"ces","agencyCode":"001001","agencyName":"wsy测试","agencyCodeName":"001001 wsy测试"}
                  // console.log(this.tableData[i-1]['name'])
                 this.tableData[i-1]['name'] = this.tableData[i]['name']
                 this.tableData[i-1]['code'] = this.tableData[i]['code']
                 this.tableData[i-1]['agencyCode'] = this.tableData[i]['agencyCode']
                 this.tableData[i-1]['agencyName'] = this.tableData[i]['agencyName']
                 this.tableData[i-1]['vouFisPerd'] = this.tableData[i]['vouFisPerd']
                  // console.log(this.tableData[i-1]['name'])
             }
         }
         this.tableData = this.tableData.filter((item,index) => {
             return item.isLeaf !=1
         })
         this.tableData = this.remakeData(this.tableData)
      } 
    },
    trickUpload (ref) {
      this.$refs[ref].dispatchEvent(new MouseEvent('click')) 
    },
    transDataTo (e,index) {
      if (e.target.files[0].name) {
         var filePath = e.target.files[0].name
         var pos = filePath.lastIndexOf(".")
         var lastname = filePath.substring(pos, filePath.length)
         if((lastname.toLowerCase() != '.zip') && (lastname.toLowerCase() != '.xml')) {
            this.tableData[index].fileName = ''
            this.tableData[index].uploadData = undefined
            this.$set(this.tableData,index,this.tableData[index])  // 强制更新一行数据
            this.$message.warning('请选择zip格式或xml格式文件！')
            return false
         } else {
            this.tableData[index].fileName = e.target.files[0].name
            this.tableData[index].uploadData = e.target.files[0]
            this.$set(this.tableData,index,this.tableData[index])  // 强制更新一行数据
         }
         // 处理完后要把input file的值清空 否则再次上传不会触发change事件
         this.$refs['uploadInput'+index].value = ''
       }
    },
    // 开始上传按钮
    // {"id":"001001_001","code":"001","name":"ces","codeName":"001 ces","chrFullname":"ces","agencyCode":"001001","agencyName":"wsy测试","agencyCodeName":"001001 wsy测试"}
    startUpload () {
        this.textLog = []
        let arr = this.tableData.map((item, index) => {
            if (item.uploadData !== undefined) {
            return {
                file: item.uploadData,
                agencyCode:item.agencyCode,
                agencyName:item.agencyName,
                acctCode:item.code,
                acctName:item.name
            }
            } else {
            return {
                file: undefined,
                agencyCode:item.agencyCode,
                agencyName:item.agencyName,
                acctCode:item.code,
                acctName:item.name
            }
            }
        })
        // console.log(arr)
        if (!arr.some((value) => {
            return value['file'] !=undefined
        })) {
        this.$message.warning('请至少选择一个文件进行上传！');
        return
        }
        this.upLoadData(arr)
        this.getUploadResult()
    },
    // 获取表格列表数据
    getTableList () {
      this.loadingTable = true
      // console.log(this.pfData)
      let param = {
          rgCode:  this.pfData.svRgCode,  // 区划
          setYear: this.pfData.svSetYear, // 年度
          menuId:  store.state.menuid,
          roleId:  this.pfData.svRoleId,
          rueicode: md5(this.pfData.svUserCode),
          accsCode:this.accsCode,
          ajax:1
      }
      this.$axios.get('/de/xmlParser/getAgencyAcctTree',{
          params: param
          // headers:{ 'x-function-id': this.pfData.svMenuId }

      })
        .then((result) => {
          if (result.data.flag === 'success') {
            this.loadingTable = false
            if(this.SHOWACCCODE) {
              this.tableData = this.remakeData(result.data.data)
              // this.tableData = this.remakeData(treeDate)
            } else {
              this.tableData = this.remakeData(result.data.data)
              // this.tableData = this.remakeData(treeDate)
              this.isShowChild(false)
            }
            // this.changgeindex +=1
  
          } else {
            this.tableData = []
            this.loadingTable = false
            throw result.data.msg
          }
        })
        .catch(this.$showError)
    },
    // 获取一个随机数，并将importUuid设为全局的随机数，以便于循环请求的时候用。
    getRandomNumber() {
      this.importUuid = Math.floor(Math.random()*100000000)
      return this.importUuid
    },
    // 上传文件函数 多文件发送时一次性请求
    upLoadData (arr) {
        var formData = new FormData()
        let list = []
        for(let i = 0; i< arr.length; i++) {
          if (arr[i]['file'] === undefined || arr[i]['file'] === '') {
              continue
          }
        formData.append('file', arr[i]['file'])
        let obj={
            agencyCode: arr[i]['agencyCode'],
            agencyName: arr[i]['agencyName'],
            acctCode: arr[i]['acctCode'],
            acctName: arr[i]['acctName'],
            fileName: arr[i]['file'].name
        }
        list.push(obj)
        // formData.append('fileDetail', JSON.stringify(obj))

        }
        formData.append('fileDetail', JSON.stringify(list))
        formData.append('rgCode', this.pfData.svRgCode);
        formData.append('impFileHidden', '');
        formData.append('dataType', 'QCBAL,VOU,BASE');
        formData.append('importUuid', this.getRandomNumber());
        // console.log(this.importUuid)

        this.$axios
            .post('/de/xmlParser/importXmlFile',formData,{
              timeout: 1000 * 60 * 2,
                // `onUploadProgress` 允许为上传处理进度事件
  onUploadProgress: function (progress) {
    // 对原生进度事件的处理
    console.log(progress)
    console.log(Math.round(progress.loaded / progress.total * 100) + '%');
  },
              })
            // .then((result) => {
            // if (result.data.flag === 'success') {
            //     // this.uploadButtonText = '正在导入...'
            //     // this.getUploadResult()
            // } else {
            //     // throw result.data.msg
            // }
            // })
            // //.catch(this.$showError)
    },
    // 查询上传结果的接口
    getUploadResult () {
        this.loadingButton = true
        // this.loadingLog = true
        this.uploadButtonText = '正在导入...'
        this.$axios
            .get('/de/xmlParser/importXml/'+this.importUuid)
            .then((result) => {
            if (result.data.flag === 'success') {
              // "msg":"账簿打印生成中","flag":"CONDUCT","rateVal":0
              if (result.data.data.rateVal == 1000 ) {
                this.$message.success('导入数据成功')
                // this.loadingLog = false
                this.loadingButton = false
                this.getTableList()   // 导入完成后再次请求列表数据
                if (result.data.data.msg && result.data.data.msg.split('！')[0]) {
                  this.textLog.push(result.data.data.msg.split('！')[0]+'！')
                }
                this.textLog.push('国标数据导入全部完成！')
                this.uploadButtonText = '开始导入'
                this.uploadStatusrRateVal = 0
              } else {
                // 增加一个判断，判断是哪个单位账套上传完毕rateVal这个值会变化，变化的时候就是上传完了一个；所以需要存储变化前的值，每次用存储的这个值
                // 和请求来的新rateVal去比较，不一样说明上传完了，需要更新上传状态；一样说明没有上传完，继续维持现状；
                // 直到rateVal为100或1000的时候说明都完成了。
                if (result.data.data.rateVal !=this.uploadStatusrRateVal) {
                  this.uploadStatusrRateVal = result.data.data.rateVal
                  this.textLog.push(result.data.data.msg)
                }
                setTimeout(() => {
                  this.getUploadResult()
                },1000)
              }
            } else {
                throw result.data.msg
            }
            })
            .catch(this.$showError)
       //
    },
    // // 上传文件函数  多文件发送时循环请求
//     upLoadData (arr) {
//       for(let i = 0; i< arr.length; i++) {
//           this.loadingButton = true
//           this.loadingLog = true
//           if (arr[i] === undefined || arr[i] === '') {
//               continue
//           }
//         // let initIndex = this.tableData.findIndex((item,index) => {
//         //       return item.chrId === arr[i]['chrId']
//         // })
//         // // 这样做主要是为了让用户知道哪几个正在更新
//         // arr[i].flag = ''              // 改变状态
//         // arr[i].data = ''              // 改变数量
//         // this.$set(this.tableData,initIndex,arr[i])  // 强制更新
//         var formData = new FormData()
//         formData.append('file', this.tableData[i]['uploadData'])
//         formData.append('rgCode', this.pfData.svRgCode);
//         formData.append('impFileHidden', '');
//         formData.append('dataType', this.dataType)
// //          agencyCode:单位代码
// //  agencyName:单位名称  
// //  acctCode：账套代码
// //  acctName：账套名称 
//         this.$axios
//             .post('/de/xmlParser/importXmlFile',formData)
//             .then((result) => {
//             if (result.data.flag === 'success') {
//                 this.loadingButton = false
//                 this.loadingLog = false
//                 this.$message.success('导入数据成功')
//                 this.textLog = 'ccccdcdcdcccccccccccccccc'
//                 console.log(result)
//             } else {
//                 throw result.data.msg
//             }
//             })
//             .catch(this.$showError)

//        }
//     },
    tableRowClassName ({ row, rowIndex }) {
      if ((rowIndex + 1) % 2 === 0) {
        return 'success-row'
      }
      return ''
    },
    // 树形结构数据排序  此方法遍历了2次数据，因为后台返回的数据的顺序不符合前端展示，需要重新排序
    remakeData (items) {
      let newDataItems = []   //存放结果数据
      let pidItemsDic = {}  //结构 pid:子集的数组  字典查询速度快
    
      //将数据筛选 装入字典  
     for(let i = 0; i < items.length; i++){
       let item = items[i]
       if(!pidItemsDic[item.pId])
         pidItemsDic[item.pId] = [item]
       else
        pidItemsDic[item.pId].push(item)
     }

     getSonArrByPid('*', 0)  // 传入pid和级数
    
    //类似二叉树前序遍历 循环菜单查找子菜单，因为线性执行，所以一条分支找完才会去查找下一条分支
     function getSonArrByPid(pId, levelNum){
       let itemsTemp = pidItemsDic[pId] || []  //pid对应子集  缺省值[]
       for (let i = 0; i < itemsTemp.length; i++) {
         let item = itemsTemp[i]
         item["levelNum"] = levelNum + 1  // 添加级数，便于缩进
         item["isLeaf"] = 0    // 添加子节点是否是叶子节点，便于判断表格中是否显示上传框
         newDataItems.push(item)
        
         //存在子集递归
         if(pidItemsDic[item.id]){
             getSonArrByPid(item.id, item.levelNum)
         } else{
            newDataItems[newDataItems.length-1].isLeaf = 1
         }
         }
       }
      return newDataItems
    }
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
.uploadDataTable .initButton:active, .uploadDataTable .initButton:hover {
    text-decoration: none;
    outline: 0;
    color: #69c0ff;
}
.uploadDataTable .initButton{
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
.uploadClass{
  border:1px solid #dedede;
  min-width:400px;
  text-align: right;
  line-height: 30px;
  height: 30px;
  vertical-align: middle;
  position: relative;
  .text{
      float: left;
      vertical-align: middle;
      height: 30px;
      padding-left: 10px;
  }
  button{
     height: 24px;
     position: absolute;
     top:2px;
     right:0px;
  }
}
.uploadLogText{
  border:1px solid #dedede;
  overflow:auto;
  padding:10px 50px;
}
</style>
<style lang="scss">
.uploadDataTable .el-table--mini th, .uploadDataTable .el-table--mini td{
  padding: 2px 0 2px 0;
  font-size: 14px;
}
.uploadDataTable .el-table .success-row {
    background: #F3F3F3;
}
.uploadDataTable .el-table--enable-row-hover .el-table__body tr:hover>td{
background-color: #ecf6fd !important;
}
.uploadDataTable .el-table--border:after,
.uploadDataTable .el-table--group:after,
.uploadDataTable .el-table:before {
    background-color: #C0C4CC;
}

.uploadDataTable .el-table--border,
.uploadDataTable .el-table--group {
    border-color: #C0C4CC;
}

.uploadDataTable .el-table td,
.uploadDataTable .el-table th.is-leaf {
    border-bottom: 1px solid #C0C4CC;
}

.uploadDataTable .el-table--border th,
.uploadDataTable .el-table--border th.gutter:last-of-type {
    border-bottom: 1px solid #C0C4CC;
}

.uploadDataTable .el-table--border td,
.uploadDataTable .el-table--border th {
    border-right: 1px solid #C0C4CC;
}
/*定义滚动条高宽及背景 高宽分别对应横竖滚动条的尺寸*/
.el-table__body-wrapper::-webkit-scrollbar
{
    width: 15px;
    height: 10px;
    background-color: #F5F5F5;
}

/*定义滚动条轨道 内阴影+圆角*/
.el-table__body-wrapper::-webkit-scrollbar-track
{
    -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
    border-radius: 10px;
    background-color: #F5F5F5;
}

/*定义滑块 内阴影+圆角*/
.el-table__body-wrapper::-webkit-scrollbar-thumb
{
    border-radius: 10px;
    -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3);
    background-color: #ccc;
}
</style>