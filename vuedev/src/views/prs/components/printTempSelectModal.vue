<!--
 * @Author: sunch
 * @Date: 2020-04-28 19:53:40
 * @LastEditTime: 2020-04-28 20:50:46
 * @LastEditors: Please set LastEditors
 * @Description: 打印模板选择框
 * @FilePath: /ufgov-vue/src/views/prs/components/printTempSelectModal.vue
 -->
<template>
  <uf-modal title="选择打印模板" v-model="visible" @cancel="onClickCancel">
    <a-select :defaultValue="reportId" style="width: 200px" :value="reportId" @change="templOnChange">
      <a-select-option v-for="item in data" :key="item.reportId" :value="item.reportId" @click="templOnClick(item)">{{ item.templName }}</a-select-option>
    </a-select>

    <template slot="footer">
      <a-button key="confirm" class="mr-10" type="primary" :loading="confirmLoading" @click="confirm">
        确定
      </a-button>
      <a-button key="cancel" @click="onClickCancel">
        取消
      </a-button>
    </template>
  </uf-modal>
</template>
<script>
export default {
    data(){
        return {
           reportId: '',
           confirmLoading: false,
           templInfo: null,
           visible: false
        }
    },
    props: ['value','data'],
    watch: {
        value(val){
            this.visible = val
        },
        data(val){
            console.log(val)
            this.templInfo = this.data[0]
            this.reportId = this.data[0].reportId
        }
    },
    methods: {
        confirm(){
            this.confirmLoading = true
            this.$emit('printModalConfirm', this.templInfo)
            this.confirmLoading = false
        },
        onClickCancel(){
            this.visible = false
            this.$emit('cancel')
        },
        templOnChange(val){
            console.log(val)
            this.reportId = val
        },
        templOnClick(item){
             this.templInfo = item
        }
    }
}
</script>
<style scoped></style>
