<template>
    <div class="wrap">
        <div class="content">
            <img v-if="size === 100" src="../assets/imgs/Interwind-1.7s-100px.gif" alt="">
            <img v-else-if="size === 400" src="../assets/imgs/Interwind-1.5s-400px.gif" alt="">
            <img v-else src="../assets/imgs/Interwind-1.7s-100px.gif" alt="">
        </div>
    </div>
</template>
<script>
export default {
    name: 'loading',
    data(){
        return{
        }
    },
    props: {
        size: {
            type: Number,
            default: 100
        }
    },
    methods:{
    }
}
</script>
<style lang="scss" scoped>
.wrap {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: 99;
    // background-color: rgba(0, 0, 0, 0.2);
    text-align: center;
    .content {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        img {
            width: 100px;
            height: 100px;
        }
    }
}
</style>