<!--
 * @Author: sunch
 * @Date: 2020-08-04 16:50:09
 * @LastEditTime: 2020-08-06 09:43:36
 * @LastEditors: Please set LastEditors
 * @Description: 工资查询
 * @FilePath: /agla-fe-8.50/vuedev/src/views/prs/mySalaryMobile/salaryQuery.vue
-->
<template>
  <div class="main">
    <MintHeader ref="MintHeader" type="detail" :title="title" :backToApp="true"> </MintHeader>
    <div class="inputWrap">
      <MintInput v-model="password" type="password" :placeholder="'请输入工资查询密码'"></MintInput>
    </div>
    <div class="tip">注：工资查询密码初始默认为六个0</div>
    <div class="btnWrap">
      <MintButton type="primary" @click="confirm" :disabled="!!!password || loading">确定</MintButton>
    </div>
    <div class="otherBtns">
      <a href="javascript:;" class="modifyPwd" @click="modifyPwd">修改密码</a>
      <a href="javascript:;" class="forgetPwd" @click="forgetPwd">忘记密码？</a>
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
      title: '工资查询',
      password: '',
      loading: false,
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
      this.$Indicator.open({
        text: '查询中...',
        spinnerType: 'snake',
      })
      this.$axios
        .post('/prs/prspersional/checkQueryPassword', {
          tokenid: this.tokenId,
          password: this.$md5(this.password),
        })
        .then((result) => {
          this.$Indicator.close()
          if (result.data.flag === 'success') {
            if (result.data.data) {
              this.$router.replace({ name: 'mySalaryMobile', query: { tokenid: this.tokenId } })
            } else {
              throw '密码错误！'
            }
          } else {
            throw result.data.msg
          }
        })
        .catch((error) => {
          this.$Toast({
            message: error,
            position: 'middle',
            duration: 3000,
            iconClass: 'icon icon-warning',
          })
        })
    },
    modifyPwd() {
        this.$router.push({ name: 'modifyPwd', query: { tokenid: this.tokenId,fromPath: 'salaryQuery' } })
    },
    forgetPwd() {
        this.$MessageBox({ message: '若忘记工资查询密码，请与系统管理员联系。', confirmButtonClass: 'messageBoxBtn' })
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
.tip {
  padding: 0.2rem 0.3rem 0 0.3rem;
  color: #3596fa;
  font-size: 12px;
}
.otherBtns {
  padding: 0 0.3rem;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
.otherBtns a {
  font-size: 13px;
  color: #3596fa;
}
.modifyPwd {
  margin-right: 0.3rem;
}
</style>
