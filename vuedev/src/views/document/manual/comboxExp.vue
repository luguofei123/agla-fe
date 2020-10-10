<template>
  <div>
    <h3>下拉菜单</h3>
    <div>
      <ufCombox :data="comboxDataList"></ufCombox>
    </div>
    <div class="showSrcWrap">
      <a href="javascript:;" @click="showSource = !showSource">显示代码</a>
    </div>

    <pre v-if="showSource">
        <code>{{pagerText}}</code>
        <code>
        export default {
        }
        </code>
      </pre>
  </div>
</template>
<script>
import ufCombox from '@/components/common/ufCombox'
export default {
  name: 'comboxExp',
  data() {
    return {
      comboxDataList: [
        {
          key: '北京',
          value: 1,
        },
        {
          key: '天津',
          value: 2,
        },
        {
          key: '杭州',
          value: 3,
        },
      ],
      showSource: false,
      pagerText: '<ufPager :pager-config="page" @page-change="handlePageChange"></ufPager>',
    }
  },
  methods: {},
  components: {
    ufCombox,
  },
}
</script>
