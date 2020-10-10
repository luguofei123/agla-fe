<!--
 * @Author: sunch
 * @Date: 2020-08-04 17:42:00
 * @LastEditTime: 2020-09-11 10:13:30
 * @LastEditors: Please set LastEditors
 * @Description: 修改工资查询密码
 * @FilePath: /agla-fe-8.50/vuedev/src/views/prs/mySalaryMobile/modifyPwd.vue
-->
<template>
  <div>
    <MintHeader ref="MintHeader" type="detail" :title="title" :backToApp="backToApp" :backType="backType" :pathConfig="pathConfig"> </MintHeader>
    <div class="formWrap">
      <div class="formRow bb1" @click="focus1">
        <div class="label">旧密码</div>
        <input class="formInput" v-model="oldPwd" ref="oldPwd" type="password" placeholder="请输入旧密码" />
      </div>
      <div class="formRow bb1" @click="focus2">
        <div class="label">新密码</div>
        <input class="formInput" v-model="newPwd" ref="newPwd" type="password" placeholder="请输入新密码" />
      </div>
      <div class="formRow bb1" @click="focus3">
        <div class="label">确认密码</div>
        <input class="formInput" v-model="confirmPwd" ref="confirmPwd" type="password" placeholder="请再次输入新密码" />
      </div>
    </div>
    <div class="btnWrap">
      <MintButton type="primary" @click="confirm">确定</MintButton>
    </div>
    <div class="otherBtns">
      <a href="javascript:;" class="forgetPwd" @click="forgetPwd">忘记密码？</a>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import MintHeader from './components/MintHeader'
import MintButton from './components/MintButton'

export default {
  name: 'modifyPwd',
  data() {
    return {
      title: '修改工资查询密码',
      oldPwd: '',
      newPwd: '',
      confirmPwd: '',
      backToApp: true,
      backType: 'replace',
      pathConfig: {
        name: 'salaryQuery',
        query: {}
      },
    }
  },
  components: {
    MintHeader,
    MintButton,
  },
  created() {
    let param = this.$route.query
    if (param.fromPath && param.fromPath === 'salaryQuery') {
      this.backToApp = false
      this.pathConfig.query.tokenid = this.tokenId
    }
  },
  computed: {
    ...mapState({
      tokenId: (state) => state.tokenId,
    }),
  },
  methods: {
    focus1() {
      this.$refs.oldPwd.focus()
    },
    focus2() {
      this.$refs.newPwd.focus()
    },
    focus3() {
      this.$refs.confirmPwd.focus()
    },
    confirm() {
      let reg = /^\w+$/
      if (!reg.test(this.newPwd)||!reg.test(this.confirmPwd)) {
        this.$Toast({
          message: '新密码仅支持输入英文大小写字母、数字和下划线',
          position: 'middle',
          duration: 3000,
        })
        return
      }
      if (this.newPwd != this.confirmPwd) {
        this.$Toast({
          message: '两次新密码输入不一致，请重新确认',
          position: 'middle',
          duration: 3000,
        })
        return
      }
      if (this.newPwd.length < 6 ||this.confirmPwd.length < 6) {
        this.$Toast({
          message: '新密码或确认密码的长度不能小于6，请重新确认',
          position: 'middle',
          duration: 3000,
        })
        return
      }
      this.$axios
        .post('/prs/prspersional/modifyQueryPassword', {
          tokenid: this.tokenId,
          oldPwd: this.$md5(this.oldPwd),
          newPwd: this.$md5(this.newPwd),
        })
        .then((result) => {
          if (result.data.flag === 'success') {
            this.$Toast({
              message: '修改成功！',
              position: 'middle',
              duration: 3000,
              iconClass: 'icon icon-check',
            })
            if (this.backToApp) {
              // 范红亮：目前工资和资产的app都是前端自己单独的包，集成到一起后，正常可以跳转过去，但是返回不回来 我们提供了统一的返回方式，辛苦你们前端调整下返回函数调用
              // http://faq.cwy.com/topic/99
              window.parent.postMessage(
                {
                  // 参数是对象
                  cmd: 'back',
                },
                '*'
              )
            } else {
              this.$router.replace({ name: 'salaryQuery', query: { tokenid: this.tokenId } })
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
    forgetPwd() {
        this.$MessageBox({ message: '若忘记工资查询密码，请与系统管理员联系。', confirmButtonClass: 'messageBoxBtn' })
    },
  },
}
</script>
<style>
.formWrap {
  margin-top: 0.2rem;
  padding: 0 0.3rem;
  background: #fff;
}
.btnWrap {
  padding: 0.2rem 0.3rem;
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
</style>
