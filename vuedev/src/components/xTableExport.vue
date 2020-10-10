<template>
  <div>
    <vxe-grid v-if="openExport" style="width: 9999px;" height="99999" show-overflow show-header-overflow ref="xTableHide" class="tableHide" id="xTableHide" :columns="columns"> </vxe-grid>
  </div>
</template>
<script>
import { constructTableExport } from '@/assets/js/plugin/xTableExportConstruct'
export default {
  data() {
    return {
      title: '',
      tableData: '',
      topInfo: [],
      columns: [],
      openExport: false
    }
  },
  watch: {
    openExport(state) {
      if (state) {
        this.$showLoading()
        this.$nextTick(() => {
          this.$refs.xTableHide.reloadData(this.tableData)
        })
        setTimeout(() => {
          constructTableExport({
            title: this.title,
            topInfo: this.topInfo,
            exportTable: '#xTableHide'
          })
            .then((res) => {
              this.openExport = false
              this.$hideLoading()
            })
            .catch((error) => {
              this.openExport = false
              this.$hideLoading()
              if (error) this.$message.error(error)
            })
        }, 500)
      }
    }
  },
}
</script>
<style></style>
