<template>
  <div class="editable-cell">
    <div class="editable-cell-input-wrapper">
      <a-select style="width: 120px" @change="handleChange">
        <a-select-option v-for="item in selectList" :key="item.accItemCode" :value="item.accItemCode">{{ item.accItemName }}</a-select-option>
      </a-select>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    selectList: { // 页面名
      type: Array,
      default: []
    }
  },
  data() {
    return {
      value: this.text,
    };
  },
  methods: {
    handleChange(e) {
      const value = e.target.value;
      this.value = value;
    }
  },
};
</script>