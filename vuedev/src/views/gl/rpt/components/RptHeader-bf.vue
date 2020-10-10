<template>
  <div class="header-wrap">
    <div class="title-wrap">
      <div class="caption">
        <div class="title">{{ titleName }}</div>
      </div>
      <div class="select-wrap">
        <ufTreeSelect
          v-model="agencyInfo"
          :allowClear="true"
          :placeholder="'请选择单位'"
          :treeData="agencyList"
          @change="agencyChange"
          @search="searchAgency"
          @clear="agencyClear"
          class="mr-10"
        >
          <template v-slot:icon>
            <span class="icon icon-unit"></span>
          </template>
        </ufTreeSelect>

        <ufTreeSelect
          v-model="acctInfo"
          :allowClear="true"
          :placeholder="'请选择账套'"
          :treeData="acctList"
          @change="acctChange"
          @search="searchAcct"
          @clear="acctClear"
        >
          <template v-slot:icon>
            <span class="icon icon-book"></span>
          </template>
        </ufTreeSelect>
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
import { getAgencyTree, getRptAccts } from "../common/service/service";

export default {
  name: "BaseHeader",
  data() {
    return {
      agencyList: [], //单位列表
      acctList: [], // 账套列表
      agencyInfo: "",
      acctInfo: "",
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
      agencyCode: (state) => state.glRptJournal.agencyCode,
      agencyName: (state) => state.glRptJournal.agencyName,
      acctCode: (state) => state.glRptJournal.acctCode,
      acctName: (state) => state.glRptJournal.acctName,
    }),
  },
  created() {},
  mounted() {
    //获取单位账套
    this.getAgencyTreeData();
  },
  watch: {
    agencyCode(val) {
      if (val) {
        this.agencyInfo = val;
      }
    },
    acctCode(val) {
      if (val) {
        this.acctInfo = val;
      }
    },
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
    ]),
    // 2级联动 单位账套
    agencyChange({ title, value }) {
      // console.log('单位改变')
      localStorage.agencyCode = value;
      localStorage.agencyName = title;
      this.setAgencyCode(value);
      this.setAgencyName(title);
      this.getRptAcctsData(value);
    },
    acctChange({ title, value }) {
      console.log({ title, value });
      let accsCode = "",
        accsName = "";
      //查找会计体系
      this.acctList.forEach((item) => {
        if (item.code === value) {
          accsCode = item.accsCode;
          accsName = item.accsName;
        }
      });
      //会计体系存到Storage
      localStorage.accsCode = accsCode;
      localStorage.accsName = accsName;
      this.setAccsCode(accsCode);
      this.setAccsName(accsName);
      //账套存到Storage
      localStorage.acctCode = value;
      localStorage.acctName = title;
      this.setAcctCode(value);
      this.setAcctName(title);
      this.setAcctChanged(true);
      this.setAcctChangedFlag(true);
    },
    // 获取单位
    getAgencyTreeData() {
      let that = this;
      const params = {};
      getAgencyTree(params)
        .then((result) => {
          if (result.data.data.length === 0) {
            this.$message.warning("未获取到单位信息");
            this.agencyInfo = "";
            this.acctInfo = "";
            this.agencyList = [];
            this.acctList = [];
            this.agencyClear();
            this.acctClear();
            return;
          }
          // 整理成默认数据格式
          this.agencyList = result.data.data;
          let firstItem = {}; // 获取列表第一个子级单位
          for (let i = 0; i < this.agencyList.length; i++) {
            if (this.agencyList[i].isLeaf == 1) {
              firstItem.agencyCode = this.agencyList[i].code;
              firstItem.agencyName = this.agencyList[i].codeName;
              break;
            }
          }
          let agencyCode = localStorage.agencyCode
            ? localStorage.agencyCode
            : firstItem.agencyCode;
          let agencyName = localStorage.agencyName
            ? localStorage.agencyName
            : firstItem.agencyName;
          //设置初始单位
          // this.setAgencyCode(agencyCode)
          // this.setAgencyName(agencyName)
          this.agencyInfo = agencyCode;
          console.log("agencyInfo: ", agencyCode);
        })
        .catch((error) => {
          console.log(error);
          if (error) {
            this.$message.error(error);
          }
        });
    },
    // 查询单位下账套
    getRptAcctsData(agencyCode) {
      if (!agencyCode) {
        return;
      }
      const params = {};
      params.setYear = this.pfData.svSetYear;
      params.rgCode = this.pfData.svRgCode;
      params.agencyCode = agencyCode;
      getRptAccts(params)
        .then((result) => {
          if (result.data.data.length === 0) {
            this.$message.warning("该单位下面没有账套，请重新选择单位！");
            this.acctInfo = "";
            this.acctClear();
            this.acctList = [];
            return;
          }
          this.acctList = result.data.data;
          // let firstItem = {}
          let acctCode = "";
          for (let i = 0; i < this.acctList.length; i++) {
            if (this.acctList[i].isLeaf == 1) {
              acctCode = this.acctList[i].code;
              // firstItem.acctName = this.acctList[i].codeName;
              // firstItem.accsCode = this.acctList[i].accsCode;
              // firstItem.accsName = this.acctList[i].accsName;
              break;
            }
          }
          //如果storage中存在会计体系 从storage中取
          // let accsCode = localStorage.accsCode ? localStorage.accsCode: firstItem.accsCode;
          // let accsName = localStorage.accsName ? localStorage.accsName : firstItem.accsName;
          // this.setAccsCode(accsCode)
          // this.setAccsName(accsName)
          //如果storage中存在账套信息 从storage中取
          // let acctCode = localStorage.acctCode ? localStorage.acctCode: firstItem.acctCode;
          // let acctName = localStorage.acctName ? localStorage.acctName : firstItem.acctName;
          //设置初始账套
          // this.setAcctCode(acctCode)
          // this.setAcctName(acctName)
          this.acctInfo = acctCode;
          console.log(acctCode);
        })
        .catch((error) => {
          console.log(error);
          if (error) {
            this.$message.error(error);
          }
        });
    },
    /**
     * @description: 清除单位信息
     */
    agencyClear() {
      this.setAgencyCode("");
      this.setAgencyName("");
    },
    /**
     * @description: 清除账套信息
     */
    acctClear() {
      //清除会计体系信息
      this.setAccsCode("");
      this.setAccsName("");
      //清除账套信息
      this.setAcctCode("");
      this.setAcctName("");
    },
    /**
     * @description: 搜索单位
     */
    searchAgency(val) {},
    /**
     * @description: 搜索账套
     */
    searchAcct(val) {},
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