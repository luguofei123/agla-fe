<!--
 * @Author: sunch
 * @Date: 2020-08-24 10:47:31
 * @LastEditTime: 2020-09-18 14:05:11
 * @LastEditors: Please set LastEditors
 * @Description: 页面头部的单位账套下拉树 样式：无边框
 * @FilePath: /src/components/common/ufAcctSelect.vue
 -->
<template>
  <div ref="ufTree" class="ufTreeSelectWrap">
    <div class="ufTreeSearchWrap">
      <slot name="icon"></slot>
      <input
        type="text"
        v-model="searchText"
        @keyup="onSearchKeyUp"
        @focus="searchFocus($event)"
      />
      <a-icon
        type="close"
        v-show="allowClear && !!searchText"
        class="clear"
        @click="searchClear"
      />
    </div>

    <transition name="myfade">
      <div
        class="ufTreeOptionsWrap"
        ref="treeWrap"
        v-show="treeVisible"
        :class="dropdownClassName"
        :style="dropdownStyle"
      >
        <ztree
          :setting="setting"
          :nodes="treeData"
          @onCreated="onZtreeCreated"
          :selectId="selectId"
          :searchId="searchId"
          @onClick="onClick"
          @onSelect="onSelect"
          @searchScrollTo="searchScrollTo"
        ></ztree>
      </div>
    </transition>
  </div>
</template>
<script>
import { mapState, mapActions } from "vuex";

export default {
  name: "ufAcctSelect",
  props: {
    value: {
      type: String,
      default: "",
    },
    content: {
      type: String,
      default: "",
    },
    allowClear: {
      //是否带有清除按钮
      type: Boolean,
      default: false,
    },
    disabled: {
      //是否禁用
      type: Boolean,
      default: false,
    },
    dropdownClassName: {
      //下拉列表的样式名
      type: String,
      default: "",
    },
    dropdownStyle: {
      //下拉菜单的样式
      type: Object,
      default: () => {
        return {};
      },
    },
    placeholder: {
      //选择框默认文字
      type: String,
      default: "",
    },
    treeData: {
      //treeNodes 数据
      type: Array,
      default: () => {
        return [];
      },
    },
    treeDefaultExpandAll: {
      //默认展开所有树节点
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      searchText: "",
      selectId: "", //选择的节点id
      searchNodeCode: "", //使用搜索筛选出的code
      searchId: "", //单位账套的搜索以id为准
      setting: {
        data: {
          key: {
            name: "codeName",
          },
          simpleData: {
            enable: true,
          },
        },
        view: {
          showLine: false,
          showIcon: false,
          nodeClasses: function (treeId, treeNode) {
            return treeNode.highlight
              ? { add: ["searchBg"] }
              : { remove: ["searchBg"] };
          },
        },
        callback: {
          beforeClick: (treeId, treeNode) => {
            let flag = treeNode.isAcct === true;
            if (flag) {
              return true;
            } else {
              return false;
            }
          },
        },
      },
      treeVisible: false, //控制下拉列表的隐藏显示
      searchLoading: false, //搜索的loading
      searchResult: [], //搜索结果
      keyCur: 0, //搜索按回车定位的搜索结果下标
    };
  },
  computed: {
    ...mapState({
      pfData: (state) => state.pfData,
    }),
  },
  created() {
    let that = this;
    // console.log("pfData: ", this.$common.getCommonData());
    // this.$common.getCommonData().then((commonData) => {
    //   console.log("commonData: ", commonData);
    this.searchText =
      this.pfData.svAgencyCode +
      " " +
      this.pfData.svAgencyName +
      " - " +
      this.pfData.svAcctCode +
      " " +
      this.pfData.svAcctName;
    // });
  },
  mounted() {
    document.addEventListener("click", (e) => {
      // console.log("document");
      if (this.$refs.ufTree) {
        if (!this.$refs.ufTree.contains(e.target)) {
          this.treeVisible = false;
        }
      }
    });
  },
  // directives: {
  //   clickout: {
  //     // 初始化指令
  //     bind(el, binding, vnode) {
  //       function clickHandler(e) {
  //         // 这里判断点击的元素是否是本身，是本身，则返回
  //         if (el.contains(e.target)) {
  //           return false;
  //         }
  //         // 判断指令中是否绑定了函数
  //         if (binding.expression) {
  //           // 如果绑定了函数 则调用那个函数，此处binding.value就是handleClose方法
  //           binding.value(e);
  //         }
  //       }
  //       // 给当前元素绑定个私有变量，方便在unbind中可以解除事件监听
  //       el.__vueClickOutside__ = clickHandler;
  //       document.addEventListener("click", clickHandler);
  //     },
  //     update() {},
  //     unbind(el, binding) {
  //       // 解除事件监听
  //       document.removeEventListener("click", el.__vueClickOutside__);
  //       delete el.__vueClickOutside__;
  //     },
  //   },
  // },
  watch: {
    /**
     * @description: 搜索框内容变化
     */
    searchText(val) {
      this.$emit("search", val);
      if (val) {
        this.searchResult = this.treeData.filter((item) => {
          return item.codeName.indexOf(val) > -1 && item.isLeaf === 1;
        });
        if (this.searchResult.length > 0) {
          // this.searchNodeCode = this.searchResult[0].code
          this.searchId = this.searchResult[0].id;
        } else {
          // this.searchNodeCode = ''
          this.searchId = "";
        }
      } else {
        // this.searchNodeCode = ''
        this.searchId = "";
      }
    },
    value(val) {
      if (val) {
        this.selectId = val;
      }
    },
    /**
     * @description: v-model或value变化
     */
    content(newVal, oldVal) {
      if (newVal) {
        this.searchText = this.content;
      } else {
        this.searchText = "";
      }
    },
  },
  methods: {
    /**
     * @description: 点击回车
     */

    onSearchKeyUp(e) {
      if (e.keyCode === 13) {
        //如果按回车键
        ++this.keyCur;
        if (this.searchResult.length === 1) {
          this.keyCur = 0;
          this.$message.info("最后1个");
        } else if (this.keyCur > this.searchResult.length - 1) {
          this.keyCur = 0;
          this.$message.info("第1个");
        } else if (this.keyCur === this.searchResult.length - 1) {
          this.$message.info(`最后1个`);
        } else {
          this.$message.info(`第${this.keyCur + 1}个`);
        }
        // this.searchNodeCode = this.searchResult[this.keyCur].code
        this.searchId = this.searchResult[this.keyCur].id;
      }
    },
    /**
     * @description: 点击了
     */
    onClickInput() {
      this.treeVisible = true;
    },
    /**
     * @description: ztree创建成功的回调
     */
    onZtreeCreated() {
      // console.log('ztree创建成功')
    },
    /**
     * @description: 搜索获取焦点
     */
    searchFocus(event) {
      event.currentTarget.select();
      this.treeVisible = true;
    },
    /**
     * @description: 点击事件
     */
    onClick(...arg) {
      this.treeVisible = false;
      if (arg[2].code) {
        this.searchText = arg[2].agencyCodeName + " - " + arg[2].codeName;
        this.selectId = arg[2].id;
        this.$emit("change", {
          title: arg[2].codeName,
          value: arg[2].code,
          agencyCodeName: arg[2].agencyCodeName,
          agencyCode: arg[2].agencyCode,
        });
      } else {
        this.searchText = "";
        this.selectId = "";
        this.$emit("change", {
          title: "",
          value: "",
          agencyCodeName: "",
          agencyCode: "",
        });
      }
    },
    /**
     * @description: 账套回写事件发送
     */
    onSelect(node) {
      if (node) {
        this.treeVisible = false;
        this.$emit("change", {
          title: node.codeName,
          value: node.code,
          agencyCodeName: node.agencyCodeName,
          agencyCode: node.agencyCode,
        });
      }
    },
    /**
     * @description: 清除搜索内容
     */
    searchClear() {
      this.treeVisible = true;
      this.searchText = "";
      this.$emit("clear");
    },
    /**
     * @description: 滚动到搜索关键字的位置
     */
    searchScrollTo(val) {
      let el = this.$refs.treeWrap;
      this.$(el).scrollTop(val);
    },
  },
};
</script>
<style>
.searchBg {
  background-color: #e6f4fd;
}
</style>
<style lang="scss" scoped>
.ufTreeSelectWrap {
  width: 400px;
  height: 30px;
  position: relative;
}
.ufTreeSearchWrap {
  width: 100%;
  height: 100%;
  padding: 5px 20px 5px 0;
  box-sizing: border-box;
  position: relative;
  display: flex;
  align-items: center;
}
.ufTreeSearchWrap input,
.ufTreeSearchWrap .showChecked,
.ufTreeSearchWrap .placeholder {
  width: 100%;
  height: 100%;
  line-height: 18px;
  border: 0;
  outline: none;
  cursor: pointer;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.placeholder {
  color: #cdcdcd;
}
.ufTreeOptionsWrap {
  position: absolute;
  top: 30px;
  left: 0;
  width: 350px;
  max-height: 350px;
  box-sizing: border-box;
  padding: 5px 10px;
  overflow: auto;
  box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.2);
  border-radius: 4px;
  background: #fff;
  z-index: 9;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}
.clear {
  display: none;
  font-size: 10px;
  font-weight: bold;
  position: absolute;
  right: 5px;
  top: 50%;
  transform: translateY(-5px);
  cursor: pointer;
}
.ufTreeSearchWrap:hover .clear {
  display: inline-block;
}
.searchBg {
  background-color: #e6f4fd;
}
</style>
