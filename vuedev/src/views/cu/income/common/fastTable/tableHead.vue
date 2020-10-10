<template>
  <el-table-column
    v-if="coloumnHeader.title!=='序号'&&coloumnHeader.key!=='operation'&&!coloumnHeader.isHide"
    class-name="canDrag"
    :key="coloumnHeader.dataIndex"
    :prop="coloumnHeader.key"
    :align="coloumnHeader.align"
    :fixed="coloumnHeader.fixed ? coloumnHeader.fixed : false"
    :width="coloumnHeader.width"
  >
    <template slot="header" slot-scope="scope">
      <s :title="coloumnHeader.title">
        <i v-if="coloumnHeader.isRequired" style="color:red">*</i>
        {{coloumnHeader.title}}
        <a-icon type="edit" v-if="headEditStatus(coloumnHeader)" @click.stop="headEditBtn(coloumnHeader, $event)"/>
      </s>
    </template>
    <template slot-scope="scope">
      <table-slot
        v-if="coloumnHeader.title !== '序号' && coloumnHeader.key !== 'operation'&&!coloumnHeader.isHide"
        :row="scope.row"
        :column="coloumnHeader"
        :index="scope.$index"
      ></table-slot>
    </template>
    <template v-if="coloumnHeader.children && coloumnHeader.children.length" v-for="(child, indexChild) in coloumnHeader.children">
      <table-head v-if="child.children" :isSort="isSort" :isRemoteSort="isRemoteSort" :coloumnHeader="child"></table-head>
      <el-table-column
        v-if="!child.children&&child.title!=='序号'&&child.key!=='operation'&&!child.isHide"
        class-name="canDrag"
        :key="child.dataIndex"
        :sortable="isRemoteSort?'custom':isSort"
        :prop="child.key"
        :sort-method="child.sorter"
        :align="child.align"
        :fixed="child.fixed ? child.fixed : false"
        :width="child.width"
      >
        <template slot="header" slot-scope="scope">
          <s :title="child.title">
            <i v-if="child.isRequired" style="color:red">*</i>
            {{child.title}}
            <a-icon type="edit" v-if="headEditStatus(child)" @click.stop="headEditBtn(child, $event)"/>
          </s>
        </template>
        <template slot-scope="scope">
          <table-slot
            v-if="child.title !== '序号' && child.key !== 'operation'&&!child.isHide"
            :row="scope.row"
            :column="child"
            :index="scope.$index"
          ></table-slot>
        </template>
      </el-table-column>
    </template>
  </el-table-column>
</template>
<script>
  import tableSlot from './slot'
  export default {
    name: 'tableHead',
    props: {
      coloumnHeader: {
        type: Object,
        default: {}
      },
      isSort: { // 是否排序
        type: Boolean,
        default: false
      },
      isRemoteSort: {
        type: Boolean,
        default: false
      }
    },
    components: {
      tableSlot
    },
    computed: {
      headEditStatus () {
        return function (head) {
          let res
          if (String(head.editStatus) !== '2') {
            res = false
          } else {
            res = String(head.isHeadAssignment) === '1'
          }
          return res
        }
      }
    },
    methods: {
      headEditBtn (head, event) {
        this.$emit('headEditBtn', head, event)
      }
    }
  }
</script>
