<template>
  <div class="header">
    <div class="caption">
      <div class="title">待摊费用备查簿</div>
    </div>
    <div class="selectWrap">
      <!--  简易模式 :treeDataSimpleMode="true" -->
      <a-tree-select style="width: 200px" :dropdownStyle="{maxWidth:'300px', maxHeight: '300px', overflow: 'auto' }"
        placeholder='请选择单位' treeDefaultExpandAll :treeData="agencyList" v-model="agencyValue"
        @change="handleAgencyChange">
      </a-tree-select>
      <a-select placeholder="请选择账套" style="width: 200px;margin-left: 20px;" v-model="acctValue">
        <a-select-option v-for="item in acctList" :title="item.codeName" :value="item.code" :key="item.id">
          {{item.codeName}}</a-select-option>
      </a-select>
    </div>
    <slot name="btns"></slot>
    <!-- <div class="btnsWrap">
        <a-button class="mr5">入账设置</a-button>
        <a-button type="primary" @click="showModal">登记</a-button>
      </div> -->
  </div>
</template>
<script>
  export default {
    name: 'frameheader',
    data() {
      return {
        agencyList: [],
        agencyValue: '', //单位值
        acctList: [],
        acctValue: '', //账套值
      }
    },
    created() {
      //获取单位账套
      this.getAgencyTree();
    },
    watch: {
      // agencyValue(value) {
      //   this.agencyValue = value;
      // },
      acctValue(value) {
        // this.acctValue = value;
        this.$emit('acctChanged', value)
      }
    },
    methods: {
      //2级联动 单位账套
      handleAgencyChange(value) {
        console.log(value)
        localStorage.agencyCode = value;
        this.getRptAccts(value);
        // this.getAccItemTree(value);
        this.$emit('agencyChanged', value)
      },
      /**
       * 获取单位
       */
      getAgencyTree() {
        let self = this;
        this.$axios({
          method: 'get',
          url: 'gl/eleAgency/getAgencyTree',
          params: {
            roleId: 9091,
            setYear: 2019,
            rgCode: 87
          }
        }).then(function (res) {
          // 整理成默认数据格式
          let agencyList = [];
          res.data.data.forEach(function (item) {
            if (item.pId && item.pId !== '*') {
              for (let it of agencyList) {
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
              agencyList.push({
                title: item.codeName,
                value: item.code,
                key: item.id,
                children: []
              });
            }
          });
          self.agencyList = agencyList;
          console.log('self.agencyList: ', self.agencyList);
          self.agencyValue = localStorage.agencyCode ? localStorage.agencyCode : agencyList[0].value;

          //==============================================
          //使用treeDataSimpleMode模式构造 渲染变得更慢了
          // res.data.data.forEach(function(item,index){
          //   if(item.pId==='*'){
          //     item.pId = ''
          //   }
          //   item.isLeaf = item.isLeaf?true:false;
          //   item.value = item.code;
          //   item.title = item.codeName;
          //   item.label = item.codeName;
          // });
          // self.agencyList = res.data.data;
          // console.log('self.agencyList: ',self.agencyList);
          // self.agencyValue = localStorage.agencyCode?localStorage.agencyCode:self.agencyList[0].value;
          //==============================================

          //查询单位下账套
          self.getRptAccts(self.agencyValue)
          //查询费用类型
          self.$emit('agencyChanged', self.agencyValue)
        })
      },
      //查询单位下账套
      getRptAccts(agencyCode) {
        if (!agencyCode) {
          return;
        }
        this.$axios({
          method: 'get',
          url: 'gl/eleCoacc/getRptAccts',
          params: {
            roleId: 9091,
            setYear: 2019,
            rgCode: 87,
            agencyCode: agencyCode
          }
        }).then(res => {
          this.acctList = res.data.data;
          this.acctValue = res.data.data.length > 0 ? res.data.data[0].code : '';
          console.log(this.acctList);
          console.log(this.acctValue);
        })
      }
    },
  }
</script>
<style scoped>
  .header {
    border-bottom: 1px solid #DFE6EC;
    margin-bottom: 10px;
    min-height: 46px;
  }

  .caption {
    display: inline-block;
    font-size: 18px;
    line-height: 18px;
    padding: 12px 0;
    border-bottom: 3px solid #108EE9;
  }

  .btnsWrap {
    float: right;
    padding: 8px 0;
  }

  .title {
    font-size: 16px;
    color: #2f353b;
  }

  .selectWrap {
    display: inline-block;
    margin-left: 20px;
  }
</style>