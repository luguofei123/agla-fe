<template>
  <div class="header-wrap">
    <div class="title-wrap">
      <div class="caption">
        <div class="title">{{ titleName }}</div>
      </div>
      <div class="select-wrap">
        <ufAcctSelect
          v-model="acctData"
          :content="acctInfo"
          :allowClear="true"
          :placeholder="'请选择单位账套'"
          :treeData="agencyAcctList"
          @change="acctChange"
          @clear="acctClear"
          class="mr-10"
        >
          <template v-slot:icon>
            <span class="icon icon-unit"></span>
          </template>
        </ufAcctSelect>
      </div>
    </div>
    <div class="ctrl-wrap">
      <div class="prjTabWrap">
        <slot name="prjTab"></slot>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapActions } from "vuex";
import { getAgencyAcctTree } from "../common/service/service";
import { fromRmis } from "@/assets/js/util";
import store from "@/store/index";
import common from '@/assets/js/common'

let rptName = store.state.rpt.rptName;

export default {
  name: "BaseHeader",
  data() {
    return {
      agencyAcctList: [], // 单位账套列表
      acctInfo: "", // 账套
      acctData: "", // 设置跳转单位账套信息 格式 ${单位编码}_${账套编码}
      fromOtherRpt: false, //标记
    };
  },
  props: {
    titleName: {
      // 页面名
      type: String,
      default: "",
    },
  },
  computed: {
    ...mapState({
      pfData: (state) => state.pfData,
      agencyCode: (state) => state[rptName].agencyCode,
      agencyName: (state) => state[rptName].agencyName,
      acctCode: (state) => state[rptName].acctCode,
      acctName: (state) => state[rptName].acctName,
      pageType: (state) => state.rpt.rptName, //页面类型
      acctChanged: (state) => state[rptName].acctChanged, //页面类型
    }),
  },
  created() {
    //获取单位账套
    this.getAgencyAcctList();
  },
  mounted() {
    //如果是从报表跳转来的
    //如果是从其他页面跳转来的
    let param = this.$route.query,
      { dataFrom } = param;
    if (dataFrom) {
      this.fromOtherRpt = true;
      let arguStr = localStorage.getItem(`from_${dataFrom}Params`);
      let argu = JSON.parse(arguStr);
      if (argu.agencyCode && argu.acctCode) {
        this.acctData = `${argu.agencyCode}_${argu.acctCode}`;
      }
    }
  },
  watch: {
    //当单位账套改变时，在acctChange方法中已经给this.acctInfo赋值了，因此这里不用再监控了。而页面初始化时在created中也已给acctInfo赋值了，取的是pfData中的值
    /* agencyName(val) {
      if (val) {
        if (this.acctChanged) {
          this.acctInfo = val + " - " + this.acctName;
        } else {
          console.log("agencyName watch: ", val);
          console.log("agencyName watch: ", this.agencyName);
          this.acctInfo =
            this.agencyCode +
            " " +
            val +
            " - " +
            this.acctCode +
            " " +
            this.acctName;
        }
      }
    },
    acctName(val) {
      if (val) {
        console.log(val);
        console.log(this.acctName);
        if (this.acctChanged) {
          this.acctInfo = this.agencyName + " - " + val;
        } else {
          this.acctInfo =
            this.agencyCode +
            " " +
            this.agencyName +
            " - " +
            this.acctCode +
            " " +
            val;
        }
      }
    }, */
  },
  methods: {
    ...mapActions([
      "setAgencyCode",
      "setAgencyName",
      "setAcctCode",
      "setAcctName",
      "setAccsCode",
      "setAccsName",
      "setAcctChanged",
      "setAcctChangedFlag",
      "setFromRmisArgu",
    ]),
    /**
     * @description: 账套 改变
     */
    acctChange(item) {
      this.acctInfo = item.agencyCodeName + " - " + item.title;
      this.setAgencyCode(item.agencyCode);
      this.setAgencyName(item.agencyCodeName);
      this.setAcctCode(item.value);
      this.setAcctName(item.title);
      // 标记账套改变
      this.setAcctChanged(true);
      this.setAcctChangedFlag(true);
      let params = {
        selAgecncyCode: item.agencyCode,
        selAgecncyName: item.agencyCodeName,
        selAcctCode: item.value,
        selAcctName: item.title
      }
      this.setSelectedVar(params);
    },
    setSelectedVar: function(params) {
      var base = new common.base64OBj()
      var selEnviornmentVar = {
        selAgecncyCode: params.selAgecncyCode ? base.encode(params.selAgecncyCode) : "",
        selAgecncyName: params.selAgecncyName ? base.encode(params.selAgecncyName) : "",
        selAcctCode: params.selAcctCode ? base.encode(params.selAcctCode) : base.encode(common.getCommonData().svAcctCode),
        selAcctName: params.selAcctName ? base.encode(params.selAcctName) : base.encode(common.getCommonData().svAcctName),
        selAccBookCode: params.selAccBookCode ? base.encode(params.selAccBookCode) : "",
        selAccBookName: params.selAccBookName ? base.encode(params.selAccBookName) : "",
      };
      sessionStorage.setItem("selEnviornmentVar", JSON.stringify(selEnviornmentVar))
    },
    /**
     * @description: 查询单位账套树
     */
    getAgencyAcctList() {
      let that = this;
      getAgencyAcctTree({})
        .then((result) => {
          if (result.data.data.length === 0) {
            this.$message.warning("未获取到单位信息");
            this.acctInfo = "";
            this.agencyAcctList = [];
            this.acctClear();
            return;
          }
          // 整理成默认数据格式
          this.agencyAcctList = result.data.data;
          //插入一个判断 如果是从报表跳转来的 store内部记录一个状态 action获取跳转来的参数并处理
          this.rmisFlag = fromRmis();
          if (this.rmisFlag) {
            //将rmis传递过来的参数设置成方案内容
            //包含以下
            this.setFromRmisArgu()
              .then((result) => {
                this.setAgencyCode(result.agencyCode);
                this.setAcctCode(result.acctCode);
                let agencyName = "",
                  acctName = "";
                this.agencyAcctList.forEach((item) => {
                  if (result.agencyCode === item.agencyCode) {
                    agencyName = item.agencyCodeName;
                  }
                  if (result.acctCode === item.code) {
                    acctName = item.codeName;
                  }
                });
                this.setAgencyName(agencyName);
                this.setAcctName(acctName);
              })
              .catch((error) => {
                console.log(error);
                if (error) {
                  this.$message.error(error);
                }
              });
          } else if (this.fromOtherRpt) {
            // this.setAcctCodeFromOtherRpt()
          } else {
            this.setAgencyAndAcct();
          }
        })
        .catch((error) => {
          console.log(error);
          if (error) {
            this.$message.error(error);
          }
        });
    },
    /**
     * @description: 1、如果之前存过单位账套 继续使用这个单位账套初始化 2、如果没有 使用平台登录之后默认的单位账套
     */
    setAgencyAndAcct() {
      let agencyCode = this.pfData.svAgencyCode;
      let agencyName = this.pfData.svAgencyName;
      let acctCode = this.pfData.svAcctCode;
      let acctName = this.pfData.svAcctName;
      if (agencyName.split(" ").length > 1) {
        this.acctInfo = agencyName + " - " + acctName;
      } else {
        this.acctInfo =
          agencyCode + " " + agencyName + " - " + acctCode + " " + acctName;
      }
      this.setAgencyCode(agencyCode);
      this.setAgencyName(agencyName);
      this.setAcctCode(acctCode);
      this.setAcctName(acctName);
      // 标记账套改变
      this.setAcctChanged(true);
      this.setAcctChangedFlag(true);
    },
    /**
     * @description: 清除账套信息
     */
    acctClear() {
      this.setAgencyCode("");
      this.setAgencyName("");
      //清除会计体系信息
      this.setAccsCode("");
      this.setAccsName("");
      //清除账套信息
      this.setAcctCode("");
      this.setAcctName("");
      this.setAcctChanged(true);
      this.setAcctChangedFlag(true);
    },
    /**
     * @description: 搜索账套
     */
    // searchAcct(val){}
  },
};
</script>
<style>
.ant-select-open .ant-select-selection {
  -webkit-box-shadow: none;
  box-shadow: none;
}
.ant-select-focused .ant-select-selection,
.ant-select-selection:focus,
.ant-select-selection:active {
  -webkit-box-shadow: none;
  box-shadow: none;
}
</style>
<style lang="scss" scoped>
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
  .ctrl-wrap {
    margin-left: 582px;
    height: 45px;
    overflow: hidden;
  }
  .prjTabWrap {
    margin-right: 0px;
    height: 100%;
    display: flex;
    align-items: center;
    overflow: hidden;
    box-sizing: border-box;
    padding: 0;
  }
  .ant-select-selection {
    border: none;
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
  .select-wrap {
    margin-left: 24px;
    display: flex;
    align-items: center;
    padding-top: 1px;
    box-sizing: border-box;
    .icon {
      margin-right: 4px;
      color: #fff;
      padding: 3px;
      border-radius: 2px;
      background: #febe2d;
      font-size: 10px;
    }
    .select-item {
      width: 220px;
      margin-right: 50px;
    }
  }
}
</style>