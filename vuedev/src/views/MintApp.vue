<!--
 * @Author: your name
 * @Date: 2020-06-02 21:02:28
 * @LastEditTime: 2020-08-04 17:38:37
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /agla-fe-8.50/vuedev/src/views/MintApp.vue
--> 
<template>
    <div id="mintapp">
        <router-view/>
    </div>
</template>
<script>
import { mapActions } from 'vuex'
import {is_anroid_ios, is_weixn_qq} from '../assets/js/util'
export default {
  created() {
    let tokenId = this.$route.query.tokenid
    console.log(tokenId)
    if(tokenId) this.setTokenId(tokenId)
    let browserType = is_weixn_qq()
    let systemType = is_anroid_ios()
    console.log(browserType);
    console.log(systemType);
    this.setBrowserType(browserType)
    this.setSystemType(systemType)

    let docEl = document.documentElement,
      resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
      recalc = function() {
        if (!docEl.clientWidth) return
        if (docEl.clientWidth >= 750) {
          docEl.style.fontSize = '100px'
        } else {
          docEl.style.fontSize = 100 * (docEl.clientWidth / 750) + 'px'
        }
        console.log(docEl.style.fontSize)
      }
    window.addEventListener(resizeEvt, recalc, false)
    recalc()
    docEl.addEventListener('DOMContentLoaded', recalc, false)
    /*DOMContentLoaded文档加载完成不包含图片资源 onload包含图片资源*/
  },
  methods: {
    ...mapActions(['setBrowserType','setSystemType','setTokenId'])
  },
}
</script>
<style>
.mint-switch-core{
  width: .72rem;
  height: .4rem;
}
.mint-switch-core::before{
  width: .7rem;
  height: .38rem;
  border-radius: .19rem;
}
.mint-switch-core::after{
  width: .36rem;
  height: .36rem;
  border-radius: .18rem;
}
.mint-switch-input:checked + .mint-switch-core::after {
  transform: translateX(.3rem);
}
</style>
<style lang="scss">
.formRow{
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: .92rem;
  box-sizing: border-box;
  padding: .25rem 0;
}
.linkRow{
  display: flex;
  justify-content: space-between;
  box-sizing: border-box;
  padding: .25rem 0;
}
.formRow .label, .linkRow .label{
  font-size: 15px;
  color: #333;
}
.formInput{
  font-size: 15px;
  color: #333;
  min-width: 70%;
  text-align: right;
  border: 0;
  background: transparent;
  outline: none;
  height: 100%;
}
.bb1 {
  border-bottom: 0.5px solid #eee;
}
.messageBoxBtn{
  color: #3596FA;
}
</style>