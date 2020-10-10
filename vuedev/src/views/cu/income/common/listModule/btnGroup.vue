<!--
通用按钮组件
2019/11/06
@author huanghe
-->
<template>

  <div class="controlButton"  v-if="needShow.length">
    <span>
      <template v-for="(item, index) in useButtons">
        <!-- 动态按钮 -->
        <a-button
          v-if="item.seen"
          :key="index"
          :class="[item.seen?'inline-block':'hide',
           item.isPrimary?'isPrimary':'',item.commonUse?'commonUse':'',
           item.disabled?'disabled':'',getBtnPer('btn-' + item.name)]"
          @click.stop="clickBtn(item.name,item.text)"
        >{{item.text}}</a-button>
      </template>
    </span>
  </div>
</template>

<script>
// import { getBtnPer } from '@/assets/js/util'
export default {
  name: "btnGroup",
  data() {
    return {
      items: [
        {
          name: "add",
          text: "新增",
          seen: false,
          isPrimary: false,
          commonUse: false,
          isClicked: true,
          disabled: false,
        },
        {
          name: "delete",
          text: "删除",
          seen: false,
          isPrimary: false,
          commonUse: false,
          isClicked: true,
          disabled: false,
        },
        {
          name: "update",
          text: "修改",
          seen: false,
          isPrimary: false,
          commonUse: false,
          isClicked: true,
          disabled: false,
        },
        {
          name: "print",
          text: "打印",
          seen: false,
          isPrimary: false,
          commonUse: false,
          isClicked: true,
          disabled: false,
        },
        {
          name: "import",
          text: "导入",
          seen: false,
          isPrimary: false,
          commonUse: false,
          isClicked: true,
          disabled: false,
        },
        {
          name: "export",
          text: "导出",
          seen: false,
          isPrimary: false,
          commonUse: false,
          isClicked: true,
          disabled: false,
        },
        {
          name: "return",
          text: "退回",
          seen: false,
          isPrimary: false,
          commonUse: false,
          isClicked: true,
          disabled: false,
        },
        {
          name: "paymentAdd",
          text: "来款增加",
          seen: false,
          isPrimary: false,
          commonUse: false,
          isClicked: true,
          disabled: false,
        },
        {
          name: "paymentImport",
          text: "来款导入",
          seen: false,
          isPrimary: false,
          commonUse: false,
          isClicked: true,
          disabled: false,
        },
        {
          name: "batchReplace",
          text: "批量替换",
          seen: false,
          isPrimary: false,
          commonUse: false,
          isClicked: true,
          disabled: false,
        },
        {
          name: "release",
          text: "发布",
          seen: false,
          isPrimary: false,
          commonUse: false,
          isClicked: true,
          disabled: false,
        },
        {
          name: "unRelease",
          text: "不发布",
          seen: false,
          isPrimary: false,
          commonUse: false,
          isClicked: true,
          disabled: false,
        },
        {
          name: "claimPrint",
          text: "认领单打印",
          seen: false,
          isPrimary: false,
          commonUse: false,
          isClicked: true,
          disabled: false,
        },
        {
          name: "claim",
          text: "认领",
          seen: false,
          isPrimary: false,
          commonUse: false,
          isClicked: true,
          disabled: false,
        },
        {
          name: "cancelClaim",
          text: "撤销认领",
          seen: false,
          isPrimary: false,
          commonUse: false,
          isClicked: true,
          disabled: false,
        },
        {
          name: "cancelReleases",
          text: "取消发布",
          seen: false,
          isPrimary: false,
          commonUse: false,
          isClicked: true,
          disabled: false,
        },
        {
          name: "reset",
          text: "还原",
          seen: false,
          isPrimary: false,
          commonUse: false,
          isClicked: true,
          disabled: false,
        },
      ],
      useButtons: [], // 按钮组
    };
  },
  props: {
    needShow: {
      type: Array,
      default() {
        return [];
      },
    },
    isPrimary: {
      type: Array,
      default() {
        return [];
      },
    },
    disabledBtn: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  methods: {
    // getBtnPer,
    clickBtn: function (msg, text) {
      this.$emit("clickBtn", msg, text);
    },
    freshBtn() {
      this.$nextTick(() => {
        if (this.needShow.length) {
          this.useButtons = [];
          this.needShow.forEach((btn) => {
            this.items.filter((item) => {
              if (btn.name == item.name) {
                item.seen = true;
                if (
                  !this.useButtons.filter((button) => {
                    button.name == btn.name;
                  }).length
                ) {
                  const newItem = item;
                  this.useButtons.push(newItem);
                }
              }
            });
          });
          this.useButtons.forEach((item) => {
            if (this.isPrimary.indexOf(item.name) != -1) {
              item.isPrimary = true;
            }
          });
        }
        this.$forceUpdate();
      });
    },
    getBtnPer(className) {
      if (process.env.NODE_ENV != "development") {
        if (this.btnPermissionList && className) {
          let flag = false;
          this.btnPermissionList.forEach((item) => {
            if (item.code == className) {
              flag = true;
            }
          });
          if (flag) {
            return "";
          } else {
            return "btn-permission";
          }
        } else {
          return "";
        }
      } else {
        return "";
      }
    },
  },
  mounted() {
    this.freshBtn();
  },
  computed: {
    btnPermissionList() {
      return this.$store.state.btnPerList;
    },
  },
  watch: {
    disabledBtn(val) {
      this.useButtons.forEach((item) => {
        item.disabled = false;
        if (val.indexOf(item.name) != -1) {
          item.disabled = true;
        }
      });
      this.$forceUpdate();
    },
    needShow: {
      handler() {
        this.freshBtn();
      },
    },
    btnPermissionList: {
      handler() {
        this.$forceUpdate();
      },
      deep: true,
    },
  },
};
</script>

<style scoped lang="less">
// 按钮组件样式
.controlButton {
  box-sizing: border-box;

  .ant-btn {
    margin-right: 5px;

    &.isPrimary {
      color: #fff;
      background: #06f;
      border-color: #1890ff;
      text-shadow: 0 -1px 0 rgba(0, 0, 0, 0.12);
      box-shadow: 0 2px 0 rgba(0, 0, 0, 0.045);
    }

    &.isPrimary:hover {
      border-color: #fff;
    }

    &:last-child {
      margin-right: 0;
    }
  }
}

.ant-btn-primary {
  color: #fff;
  background: #06f;
  border-color: #1890ff;
  text-shadow: 0 -1px 0 rgba(0, 0, 0, 0.12);
  box-shadow: 0 2px 0 rgba(0, 0, 0, 0.045);
}

.ant-btn:focus,
.ant-btn:hover {
  color: #fff;
  background-color: #06f;
  border-color: #fff;
}
</style>
