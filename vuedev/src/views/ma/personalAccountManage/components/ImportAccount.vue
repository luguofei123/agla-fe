<!--
 * @Author: sunch
 * @Date: 2020-07-10 09:41:27
 * @LastEditTime: 2020-08-12 14:31:14
 * @LastEditors: Please set LastEditors
 * @Description: 导入弹窗
 * @FilePath: /agla-fe-8.50/vuedev/src/views/ma/personalAccountManage/components/importAccount.vue
-->
<template>
  <uf-modal v-model="visible" @cancel="cancel" :width="600" :title="'导入'">
    <div style="height: 200px;">
      <div class="row flex-start">
        <span>请选择要导入的文件：</span>
        <div class="inputWrap">
          <a-input-search v-model="importFileName" placeholder="点击按钮选择导入文件，文件大小请控制在2M之内">
            <a-button type="primary" slot="enterButton">选择文件</a-button>
          </a-input-search>
          <form ref="excelFileFrom" id="excelFileFrom" enctype="multipart/form-data">
            <input id="excelFile" ref="excelFile" accept=".xlsx,.xls" name="filePath" type="file" class="file-upload-input" @change="onClickSelectFile" />
          </form>
        </div>
      </div>
    </div>

    <template v-slot:footer>
      <a-button class="mr-10" @click="downLoadTpl">下载模板</a-button>
      <a-button class="mr-10" type="primary" @click="importAccount">导入</a-button>
      <a-button @click="cancel">关闭</a-button>
    </template>
  </uf-modal>
</template>
<script>
export default {
  name: 'ImportAccount',
  props: ['value'],
  data() {
    return {
      visible: false, //可见标记
      importFileName: '',
      suffix: '', //导入的文件名后缀 用于判断
    }
  },
  watch: {
    value(val) {
      if (val) {
        this.visible = val
      }
    },
  },
  methods: {
    /**
     * @description: 取消
     */
    cancel() {
      this.visible = false
      this.$emit('close')
    },
    /**
     * @description: 下载模板
     */
    downLoadTpl() {
      window.location.href = '/pub/file/downloadModel?fileName=人员账户信息导入模板.xlsx&attachGuid=EMPACCOUNT&projectName=ma'
      this.cancel()
    },
    /**
     * @description: 导入账户
     */
    importAccount() {
      if (!this.importFileName) {
        this.$message.warning('请选择要导入的文件')
        return
      }
      if (this.suffix != '.xls' && this.suffix != '.xlsx') {
        this.$message.warning('仅支持导入.xls和.xlsx格式的文件')
        return
      }
      this.$showLoading()
      this.$axios
        .post('/ma/emp/maEmp/impBankAccountInfoExcel', new FormData(this.$refs.excelFileFrom))
        .then((result) => {
          this.$hideLoading()
          if (result.data.flag === 'success') {
            this.cancel()
          } else {
            throw result.data.msg
          }
        })
        .catch(this.$showError)
    },
    /**
     * @description: 导入模态窗口 点击选择文件
     */
    onClickSelectFile(e) {
      this.importFileName = e.target.files[0].name
      this.importFileName.split('.').forEach((item, index, arr) => {
        if (index === arr.length - 1) {
          this.suffix = '.' + item
        }
      })
      if (this.suffix != '.xls' && this.suffix != '.xlsx') {
        this.$message.warning('仅支持导入.xls和.xlsx格式的文件')
      }
    },
  },
}
</script>
<style lang="scss" scoped>
.inputWrap {
  width: 400px;
  height: 30px;
  position: relative;
}
.file-upload-input {
  width: 100%;
  height: 100%;
  background: transparent;
  z-index: 999;
  opacity: 0;
  cursor: pointer;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
}
</style>
