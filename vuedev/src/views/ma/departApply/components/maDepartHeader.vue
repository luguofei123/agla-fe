<!--
 * @Author: liwz
 * @Date: 2020-09-27 10:00:39
 * @LastEditTime: 2020-09-27 10:51:56
 * @LastEditors: Please set LastEditors
 * @Description: 部门应用设置头部
 * @FilePath: /ufgov-vue/src/views/ma/departApply/maDepartApply.vue
 -->
<template>
  <div class="header-wrap">
    <div class="title-wrap">
      <div class="caption">
        <div class="title">{{ titleName }}</div>
      </div>
      <div class="select-wrap">
        <ufAgnencySelect
          v-model="acctData"
          :content="acctInfo"
          :allowClear="true"
          :placeholder="'请选择单位'"
          :treeData="agencyAcctList"
          @change="acctChange"
          @clear="acctClear"
          class="mr-10"
        >
          <template v-slot:icon>
            <span class="icon icon-unit"></span>
          </template>
        </ufAgnencySelect>
      </div>
    </div>
    <div class="ctrl-wrap">
      <div class="prjTabWrap">
        <slot name="maSave"></slot>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapActions } from "vuex";
import { getAgencyTree } from "@/views/gl/rpt/common/service/service";
import { fromRmis } from "@/assets/js/util";
import store from "@/store/index";
import common from "@/assets/js/common";

let maName = store.state.ma.maName;

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
  watch: {
    acctChanged(newValue, oldValue) {
      console.log("acctChanged newVal: ", newValue);
    },
  },
  computed: {
    ...mapState({
      pfData: (state) => state.pfData,
      agencyCode: (state) => state[maName].agencyCode,
      agencyName: (state) => state[maName].agencyName,
      // pageType: (state) => state.ma.maName, //页面类型
      acctChanged: (state) => state[maName].acctChanged, //单位账套改变
    }),
  },
  created() {
    //获取单位
    this.getAgencyAcctList();
    console.log("this.pfData： ", this.pfData);
  },
  mounted() {},
  watch: {},
  methods: {
    ...mapActions(["setAgencyCodeMa", "setAgencyNameMa", "setAcctChangedMa"]),
    /**
     * @description: 账套 改变
     */
    acctChange(item) {
      // console.log("acctChange: ", item);
      // this.acctInfo = item.agencyCodeName + " - " + item.title;
      this.acctInfo = item.title;
      this.setAgencyCodeMa(item.agencyCode);
      this.setAgencyNameMa(item.agencyCodeName);
      // 标记账套改变
      this.setAcctChangedMa(true);
      let params = {
        selAgecncyCode: item.agencyCode,
        selAgecncyName: item.agencyCodeName,
      };
      this.setSelectedVar(params);
      this.$emit("changeAggency");
    },
    setSelectedVar: function (params) {
      var base = new common.base64OBj();
      var selEnviornmentVar = {
        selAgecncyCode: params.selAgecncyCode
          ? base.encode(params.selAgecncyCode)
          : "",
        selAgecncyName: params.selAgecncyName
          ? base.encode(params.selAgecncyName)
          : "",
        selAccBookCode: params.selAccBookCode
          ? base.encode(params.selAccBookCode)
          : "",
        selAccBookName: params.selAccBookName
          ? base.encode(params.selAccBookName)
          : "",
      };
      sessionStorage.setItem(
        "selEnviornmentVar",
        JSON.stringify(selEnviornmentVar)
      );
    },
    /**
     * @description: 查询单位账套树
     */
    getAgencyAcctList() {
      let that = this;
      this.$axios({
        method: "get",
        url: "/ma/sys/eleAgency/getAgencyTree",
        params: {
          roleId: this.pfData.svRoleId,
          setYear: this.pfData.svSetYear,
          rgCode: this.pfData.svRgCode,
        },
      })
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
          this.rmisFlag = fromRmis();
          if (this.rmisFlag) {
            //将rmis传递过来的参数设置成方案内容
            //包含以下
            /* this.setFromRmisArgu()
              .then((result) => {
                this.setAgencyCodeMa(result.agencyCode);
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
                this.setAgencyNameMa(agencyName);
                this.setAcctName(acctName);
              })
              .catch((error) => {
                console.log(error);
                if (error) {
                  this.$message.error(error);
                }
              }); */
          } else if (this.fromOtherRpt) {
            // this.setAcctCodeFromOtherRpt()
          } else {
            this.setAgencyAndAcct();
          }

          // this.setAgencyAndAcct();
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
      let agencyCode = localStorage.agencyCode
        ? localStorage.agencyCode
        : this.pfData.svAgencyCode;
      let agencyName = localStorage.agencyName
        ? localStorage.agencyName
        : this.pfData.svAgencyName;

      if (agencyName.split(" ").length > 1) {
        this.acctInfo = agencyName;
      } else {
        this.acctInfo = agencyCode + " " + agencyName;
      }
      this.setAgencyCodeMa(agencyCode);
      this.setAgencyNameMa(agencyName);
      // 标记账套改变
      this.setAcctChangedMa(true);
    },
    /**
     * @description: 清除账套信息
     */
    acctClear() {
      this.setAgencyCodeMa("");
      this.setAgencyNameMa("");
      //清除会计体系信息
      // this.setAccsCode("");
      // this.setAccsName("");
      this.setAcctChangedMa(true);
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
    float: right;
    margin-left: 58px;
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