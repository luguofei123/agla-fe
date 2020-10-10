<!--
 * @Author: your name
 * @Date: 2020-03-26 14:04:47
 * @LastEditTime: 2020-04-23 14:47:17
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /ufgov-vue/src/components/PrograssModal.vue
 -->
<template>
  <uf-modal title="导入进度" v-model="prograssModalVisible" @cancel="prograssModalCancel" :width="500">
    <div v-if="msg">
      <div v-if="status === 'exception'" class="error" v-html="msg"></div>
      <div v-else-if="status === 'success'" class="success" v-html="msg"></div>
      <div v-else class="normal" v-html="msg"></div>
    </div>
    <a-progress :percent="percent" :status="status" />
    <template slot="footer">
      <a-button key="close" @click="prograssModalCancel">
        关闭
      </a-button>
    </template>
  </uf-modal>
</template>
<script>
export default {
  name: 'PrograssModal',
  data() {
    return {
      prograssModalVisible: false
    }
  },
  props: ['visible', 'percent', 'status', 'msg'],
  watch: {
    visible(val) {
      if (val) {
        this.prograssModalVisible = true
      }
    }
  },
  methods: {
    /**
     * @description: 点击关闭
     */
    prograssModalCancel() {
      this.prograssModalVisible = false
      this.$emit('prograssModalClose', this.status)
    }
  }
}
</script>
<style scoped>
.normal,
.error,
.success {
  text-align: center;
  padding: 10px 5px;
  font-size: 14px;
  color: #666;
}
.error {
  color: red;
}
.success {
  color: green;
}
</style>
