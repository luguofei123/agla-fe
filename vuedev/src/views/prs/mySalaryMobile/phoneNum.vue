<!--
 * @Author: sunch
 * @Date: 2020-07-28 17:14:13
 * @LastEditTime: 2020-07-31 15:45:10
 * @LastEditors: Please set LastEditors
 * @Description: 手机号
 * @FilePath: /agla-fe-8.50/vuedev/src/views/prs/mySalaryMobile/phoneNum.vue
-->
<template>
  <div class="main" ref="main">
    <MintHeader ref="MintHeader" type="detail" :title="otherName" :backToApp="true"> </MintHeader>
    <div class="inputWrap">
      <MintInput v-model="phoneNum" type="number" :placeholder="'请输入手机号'"></MintInput>
    </div>
    <div class="btnWrap">
      <MintButton type="primary" @click="confirm" :disabled="!phoneNum||loading">确定</MintButton>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import MintButton from './components/MintButton'
import MintHeader from './components/MintHeader'
import MintInput from './components/MintInput'
export default {
  data() {
    return {
      otherName: '手机号',
      phoneNum: '',
      loading: false
    }
  },
  components: {
    MintButton,
    MintHeader,
    MintInput,
  },
  computed: {
    ...mapState({
      tokenId: (state) => state.tokenId,
    }),
  },
  methods: {
    confirm() {
      this.loading = true
      //校验手机号格式
      this.$axios
        .post('/prs/prspersional/modifyPhone', {
          tokenid: this.tokenId,
          phone: this.phoneNum,
        })
        .then((result) => {
          this.loading = false
          this.$Toast({
            message: '保存成功！',
            position: 'middle',
            duration: 3000,
            iconClass: 'icon icon-check',
          })
          window.parent.postMessage({ // 参数是对象
              cmd: 'back' 
          }, '*') 
        })
        .catch((error) => {
          this.loading = false
          this.$Toast({
            message: error,
            position: 'middle',
            duration: 3000,
            iconClass: 'icon icon-warning',
          })
        })
    },
  },
}
</script>
<style>
.main {
  background: #fff;
}
.inputWrap {
  padding: 0.4rem 0.3rem 0 0.3rem;
}
.btnWrap {
  padding: 0.2rem 0.3rem;
}
</style>
