<template>
  <div>
    <h3>按钮 ufButton</h3>

    <h4>按钮类型(size默认)</h4>
    <div>
      <ufButton type="primary">主要按钮</ufButton>
      <ufButton class="ml-20" type="default">次要按钮</ufButton>
      <ufButton class="ml-20" type="normal">辅助按钮</ufButton>
      <ufButton class="ml-20" type="primary" icon="icon-download">图标按钮</ufButton>
      <ufButton class="ml-20" type="primary" icon="icon-download"></ufButton>
      <ufButton class="ml-20" type="default" icon="icon-download"></ufButton>
      <ufButton class="ml-20" type="normal" icon="icon-download"></ufButton>
      <!-- <ufButton class="ml-20" type="default">开关</ufButton> -->
      <ufButton class="ml-20" type="combox">下拉按钮</ufButton>
      <ufButton class="ml-20" type="comboxlink">下拉链接</ufButton>
      <ufButton class="ml-20" type="link">链接</ufButton>
      <ufButton class="ml-20" type="iconlink" icon="icon-trash">图标链接</ufButton>
      <ufButton class="ml-20" type="iconlink" icon="icon-trash"></ufButton>
    </div>

    <h4>按钮大小</h4>

    <h5>&nbsp;&nbsp;1、大按钮 size="large"</h5>
    <div>
      <ufButton type="primary" size="large">主要按钮</ufButton>
      <ufButton class="ml-20" type="default" size="large">次要按钮</ufButton>
      <ufButton class="ml-20" type="normal" size="large">辅助按钮</ufButton>
      <ufButton class="ml-20" type="primary" size="large" icon="icon-download">图标按钮</ufButton>
      <ufButton class="ml-20" type="normal" size="large" icon="icon-download"></ufButton>
      <ufButton class="ml-20" type="default" size="large" icon="icon-download"></ufButton>
      <ufButton class="ml-20" type="normal" size="large" icon="icon-download"></ufButton>
      <!-- <ufButton class="ml-20" type="default" size="large">开关</ufButton> -->
      <!-- <ufButton class="ml-20" type="combox" size="large">下拉按钮</ufButton> -->
      <ufButton class="ml-20" type="link" size="large">链接</ufButton>
      <ufButton class="ml-20" type="iconlink" size="large" icon="icon-trash">图标链接</ufButton>
      <ufButton class="ml-20" type="iconlink" size="large" icon="icon-trash"></ufButton>
    </div>

    <h5 class="mt-10">&nbsp;&nbsp;2、小按钮 size="small"</h5>
    <div>
      <ufButton type="primary" size="small">主要按钮</ufButton>
      <ufButton class="ml-20" type="default" size="small">次要按钮</ufButton>
      <ufButton class="ml-20" type="normal" size="small">辅助按钮</ufButton>
      <ufButton class="ml-20" type="primary" size="small" icon="icon-download">图标按钮</ufButton>
      <ufButton class="ml-20" type="normal" size="small" icon="icon-download"></ufButton>
      <ufButton class="ml-20" type="default" size="small" icon="icon-download"></ufButton>
      <ufButton class="ml-20" type="normal" size="small" icon="icon-download"></ufButton>
      <!-- <ufButton class="ml-20" type="default" size="small">开关</ufButton> -->
      <!-- <ufButton class="ml-20" type="combox" size="small">下拉按钮</ufButton> -->
      <ufButton class="ml-20" type="link" size="small">链接</ufButton>
      <ufButton class="ml-20" type="iconlink" size="small" icon="icon-trash">图标链接</ufButton>
      <ufButton class="ml-20" type="iconlink" size="small" icon="icon-trash"></ufButton>
    </div>

    <h4>点击事件(click)</h4>
    <div>
      <ufButton type="primary" @click="onClick1">按钮1</ufButton>
      <ufButton class="ml-20" type="default" @click="onClick2">按钮2</ufButton>
    </div>

    <h4>开关切换/下拉事件(select)</h4>

    <h4>禁用</h4>

    <ufButton type="primary" disabled>主要按钮</ufButton>
    <ufButton class="ml-20" disabled type="default">次要按钮</ufButton>
    <ufButton class="ml-20" disabled type="normal">辅助按钮</ufButton>

    <h4>主题颜色</h4>

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
import ufButton from '@/components/common/ufButton'
export default {
  name: 'buttonExp',
  data() {
    return {
      showSource: false,
      pagerText: '<ufPager :pager-config="page" @page-change="handlePageChange"></ufPager>',
    }
  },
  methods: {
    onClick1() {
      alert('点击了按钮1')
    },
    onClick2() {
      alert('点击了按钮2')
    },
  },
  components: {
    ufButton,
  },
}
</script>
