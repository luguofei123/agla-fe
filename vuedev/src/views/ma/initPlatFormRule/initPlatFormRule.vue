<template>
<div>
  <div class="header-wrap">
    <div class="title-wrap">
      <div class="caption">
        <div class="title">初始化平台管控规则</div>
      </div>
    </div>
  </div>
  <div class="buttonBox">
    <a-button type="primary" class="btn-initbasesys" @click="initSysBasicData">初始化平台管控规则</a-button>
  </div>
</div>
</template>
<script>
export default {
  data () {
    return {
    }
  },
  computed: {
  },
  created () {
  },
  methods: {
    initSysBasicData () {
      this.$axios
        .post('/ma/sys/element/init85ManageRules',{id:'wswswsww'})
        .then((result) => {
          if (result.data.flag === 'success') {
            this.$message.success('发送请求成功')
            console.log(result)
          } else {
            throw result.data.msg
          }
        })
        .catch(this.$showError)
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
</style>