<!--
 * @Author: sunch
 * @Date: 2020-04-16 15:00:46
 * @LastEditTime: 2020-04-16 17:24:34
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /ufgov-vue/src/views/example/interfaceTest.vue
 -->
<template>
  <div>
    <form id="imgFileFrom" enctype="multipart/form-data">
      <input type="file" name="file" id="file" accept=".jpeg,.jpg,.png,.gif" @change="test" />
      <input type="hidden" name="imagePath" value=""/>
    </form>
    <div>{{ result }}</div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      result: ''
    }
  },
  mounted() {
    // this.test()
  },
  methods: {
    test(e) {
      console.log(e)
      //   let file = new FormData()
      //   file.append()
      setTimeout(()=>{
        this.$axios({
            method: 'post',
            url: '/prs/emp/maEmp/uploadImage',
            data: new FormData(document.getElementById('imgFileFrom'))
        }).then(result => {
            this.result = JSON.stringify(result.data)
        })
      }, 1000)
    }
  }
}
</script>
<style scoped></style>
