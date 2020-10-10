<template>
  <div class="my-filter-input">
    <input class="my-input" type="text" v-model="option.data" @keyup="keyupEvent($event)" :placeholder="opts.attrs.placeholder" @input="changeOptionEvent" />
  </div>
</template>

<script>
export default {
  name: 'FilterInput',
  props: {
    params: Object,
    opts: Object
  },
  data () {
    return {
      column: null,
      option: null
    }
  },
  watch: {
    params () {
      this.load()
    }
  },
  created () {
    this.load()
  },
  methods: {
    load () {
      // filters 可以配置多个，实际只用一个就可以满足需求了
      const { column } = this.params
      const option = column.filters[0]
      this.column = column
      this.option = option
    },
    changeOptionEvent () {
      const { params, option } = this
      const { $panel } = params
      const checked = !!option.data
      option.data = option.data.toString().trim()
      $panel.changeOption(null, checked, option)
    },
    keyupEvent (event) {
      const { params } = this
      const { $panel } = params
      if (event.keyCode === 13) {
        $panel.confirmFilter()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.my-filter-input {
  .my-input{
    box-sizing: border-box;
    padding: 0 5px;
    border-radius: 4px;
    border: 1px solid #dcdfe6;
    outline: none;
  }
}
</style>