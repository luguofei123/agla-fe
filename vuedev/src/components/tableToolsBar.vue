<template>
  <div>
    <a-row>
      <a-col :span="2" :offset="22">
        <a-radio-group style="padding:10px 0;">
          <a-radio-button value="print" @click="print">打印</a-radio-button>
          <a-radio-button value="exportData" @click="exportData">导出</a-radio-button>
        </a-radio-group>
      </a-col>
    </a-row>
  </div>
</template>
<script>
  export default {
      methods: {
          print(e){
              console.log(e.target.value);
              this.$emit('toolsBarBtnsCallBack',e.target.value);
          },
          exportData(e){
              console.log(e.target.value);
              this.$emit('toolsBarBtnsCallBack',e.target.value);
          }
      },
  }
</script>
<style scoped>
</style>