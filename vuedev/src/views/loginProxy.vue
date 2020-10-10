<template>
    <div>
        <h2 style="padding-top: 10px">当前开发环境请求模式为代理模式</h2>
        <h3>当前可代理位置：</h3>
        <h3>域名：“{{proxyAddress}}”&nbsp;&nbsp;对应前缀：(无需填写，全局已默认添加前缀“/dev”)</h3>
        <h3>域名：“http://dev0.cwy.com/”&nbsp;&nbsp;对应前缀：“/dev0”</h3>
        <h3 style="color: red;">登陆超时，请重新配置代理设置</h3>
        <div class="mt-10">
            <label>username: </label><a-input class="a-input" type="text" v-model="username"/>
        </div>
        <div class="mt-10">
            <label>JSESSIONID: </label><a-input class="a-input" type="text" v-model="jsessionid"/>
        </div>
        <div class="mt-10">
            <label>tokenid: </label><a-input class="a-input" type="text" v-model="tokenid"/>
        </div>
        <div class="flexRow mt-10">
            <label style="line-height: 50px;">commonData: </label>
            <a-textarea v-model="commonData" placeholder="commonData" :autoSize="{ minRows: 3, maxRows: 5 }" style="width: 300px"/>
            <a-button type="primary" @click="confirm">确定</a-button>
        </div>
        <h4 class="mt-10" style="color:#555">可登陆想请求的web应用后，打开浏览器开发工具-&gt;Application 中查看cookie信息</h4>
    </div>
</template>
<script>
export default {
    data(){
        return {
            proxyAddress: this.NODE_ENV === "development"?process.env.VUE_APP_PROXY_ADDRESS:'非开发模式',
            username: localStorage.getItem('username')?localStorage.getItem('username'):'',
            jsessionid: localStorage.getItem('JSESSIONID')?localStorage.getItem('JSESSIONID'):'',
            tokenid: localStorage.getItem('tokenid')?localStorage.getItem('tokenid'):'',
            commonData: localStorage.getItem('commonData')?localStorage.getItem('commonData'):''
        }
    },
    methods:{
        confirm(){
            if (this.NODE_ENV === 'development') {
                document.cookie = 'username=' + this.username
                document.cookie = 'JSESSIONID=' + this.jsessionid
                document.cookie = 'tokenid=' + this.tokenid
                localStorage.setItem('username',this.username)
                localStorage.setItem('JSESSIONID',this.jsessionid)
                localStorage.setItem('tokenid',this.tokenid)
                localStorage.setItem('commonData',this.commonData)
            }
            // this.$router.go(-1)
            this.$router.replace('/')
        }
    }
}
</script>
<style scoped>
label{display: inline-block;width: 100px;font-size: 14px;font-weight: bold;color:#333;}
.a-input{width: 300px;}
button{margin-left: 20px;}
</style>