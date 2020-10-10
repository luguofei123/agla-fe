<template>
    <a-locale-provider :locale="locale">
        <div class="incomeContainer" :style="{height: containerH - 10 + 'px'}">
            <router-view />
        </div>
    </a-locale-provider>
</template>

<script>
    import './styles/global.less'
    import 'element-ui/lib/theme-chalk/index.css'
    import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN'
    import {mapState} from 'vuex'
    export default {
        name: "income",
        props: {},
        components: {},
        computed: {
            ...mapState({
                containerH: state => state.containerH
            }),
        },
        data() {
            return {
                locale: zhCN
            }
        },
        created() {
        },
        methods: {},
        mounted() {
            console.log(this.containerH)
        },
        watch: {}
    }
</script>

<style scoped>

</style>
