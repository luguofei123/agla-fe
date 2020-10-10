<template>
  <div class="filter-money-input">
    <input class="filter-input" type="number" v-model="option.minAmount" @input="changeMinAmountEvent" @blur="changeMinAmountBlur" />
    <span> 至 </span>
    <input class="filter-input" type="number" v-model="option.maxAmount" @input="changeMaxAmountEvent" @blur="changeMaxAmountBlur" />
  </div>
</template>

<script>
import { formatMoney } from '@/assets/js/util'
export default {
  name: 'filterMoneyInput',
  props: {
    params: Object
  },
  data() {
    return {
      column: null,
      option: null
    }
  },
  created() {
    // filters 可以配置多个，实际只用一个就可以满足需求了
    const { column } = this.params
    const option = column.filters[0]
    this.column = column
    this.option = option
  },
  methods: {
    changeMinAmountEvent() {
      if (this.option.minAmount&&this.option.maxAmount) {
        const { params, option } = this
        const { $panel } = params
        $panel.changeOption(null, true, option)
      }
    },
    changeMaxAmountEvent() {
      if (this.option.minAmount&&this.option.maxAmount) {
        const { params, option } = this
        const { $panel } = params
        $panel.changeOption(null, true, option)
      }
    },
    changeMinAmountBlur() {
      this.option.minAmount = this.option.minAmount ? formatMoney(this.option.minAmount) : this.option.minAmount;
    },
    changeMaxAmountBlur() {
      this.option.maxAmount = this.option.maxAmount ? formatMoney(this.option.maxAmount) : this.option.maxAmount;
    },
  }
}
</script>
<style lang="scss" scoped>
.filter-money-input {
  .filter-input {
    width: 80px;
    box-sizing: border-box;
    padding: 0 5px;
    border-radius: 4px;
    border: 1px solid #dcdfe6;
    outline: none;
  }
}
</style>
