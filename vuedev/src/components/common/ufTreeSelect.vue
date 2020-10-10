<!--
 * @Author: sunch
 * @Date: 2020-05-15 11:20:10
 * @LastEditTime: 2020-09-04 10:44:11
 * @LastEditors: Please set LastEditors
 * @Description: 自定义下拉树 样式：有边框
 * @FilePath: /src/components/common/ufTreeSelect.vue
 -->
<template>
  <div ref="ufTree" class="ufTreeSelectWrap">
    <div class="ufTreeSearchWrap">
      <slot name="icon"></slot>
      <div v-if="checkable" style="width: 100%;height: 100%">
        <input
          v-show="treeVisible"
          type="text"
          v-model="searchText"
          @keyup="onSearchKeyUp"
          @focus="searchFocus($event)"
        />
        <div
          v-show="!treeVisible"
          :class="checkedContent ? 'showChecked' : 'placeholder'"
          @click="onClickInput"
        >{{ checkedContent ? checkedContent : placeholder }}</div>
      </div>
      <div v-else style="width: 100%;height: 100%">
        <input type="text" v-model="searchText" @keyup="onSearchKeyUp" @focus="searchFocus($event)" />
      </div>
      <a-icon type="close" v-show="allowClear&&!!searchText" class="clear" @click="searchClear" />
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
          :selectNodeCode="selectNodeCode"
          :searchNodeCode="searchNodeCode"
          @onCheck="onCheck"
          @onClick="onClick"
          @onSelect="onSelect"
          @searchScrollTo="searchScrollTo"
        ></ztree>
      </div>
    </transition>
  </div>
</template>
<script>
export default {
  name: "ufTreeSelect",
  props: {
    value: {
      type: String,
      default: "",
    },
    checkable: {
      //是否允许多选
      type: Boolean,
      default: false,
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
    maxTagCount: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      searchText: "", //搜索的内容
      selectNodeCode: "", //选择了哪个node
      searchNodeCode: "", //使用搜索筛选出的code
      checkedContent: "", //勾选了的label内容
      setting: {
        data: {
          key: {
            name: "codeName",
          },
          simpleData: {
            enable: true,
          },
        },
        check: {
          enable: this.checkable,
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
            let flag = treeNode.isLeaf === 1;
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
  mounted() {
    document.addEventListener("click", (e) => {
      console.log("document");
      if (this.$refs.ufTree) {
        if (!this.$refs.ufTree.contains(e.target)) {
          this.treeVisible = false;
        }
      }
    });
  },
  directives: {
    clickout: {
      // 初始化指令
      bind(el, binding, vnode) {
        function clickHandler(e) {
          console.log("点击了：" + el.contains(e.target));
          // 这里判断点击的元素是否是本身，是本身，则返回
          if (el.contains(e.target)) {
            return false;
          }
          // 判断指令中是否绑定了函数
          if (binding.expression) {
            // 如果绑定了函数 则调用那个函数，此处binding.value就是handleClose方法
            binding.value(e);
          }
        }
        // 给当前元素绑定个私有变量，方便在unbind中可以解除事件监听
        el.__vueClickOutside__ = clickHandler;
        document.addEventListener("click", clickHandler);
      },
      update() {},
      unbind(el, binding) {
        console.log("解除");
        // 解除事件监听
        document.removeEventListener("click", el.__vueClickOutside__);
        delete el.__vueClickOutside__;
      },
    },
  },
  watch: {
    /**
     * @description: 搜索框内容变化
     */
    searchText(val) {
      // console.log(val)
      this.$emit("search", val);
      if (val) {
        // this.searchLoading = true
        let arr1 = this.treeData.filter((item) => {
          return item.code === val && item.isLeaf === 1;
        });
        let arr2 = this.treeData.filter((item) => {
          return item.codeName.indexOf(val) > -1 && item.isLeaf === 1;
        });
        this.searchResult = arr1.concat(arr2);
        if (this.searchResult.length > 0) {
          this.searchNodeCode = this.searchResult[0].code;
        } else {
          this.searchNodeCode = "";
        }
        // this.searchLoading = false
      } else {
        this.searchNodeCode = "";
      }
    },
    /**
     * @description: v-model或value变化
     */
    value(newVal, oldVal) {
      // console.log('value改变: ', newVal, oldVal)
      if (newVal) {
        this.selectNodeCode = newVal;
      } else {
        this.searchText = "";
      }
    },
  },
  methods: {
    onSearchKeyUp(e) {
      if (e.keyCode === 13) {
        //如果按回车键
        ++this.keyCur;
        if (this.searchResult.length === 0) {
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
        this.searchNodeCode = this.searchResult[this.keyCur].code;
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
    searchFocus(event) {
      event.currentTarget.select();
      this.treeVisible = true;
    },
    onClick(...arg) {
      if (this.checkable) {
        var zTree = $.fn.zTree.getZTreeObj(arg[1]);
        zTree.checkNode(arg[2], !arg[2].checked, true, true);
      } else {
        this.treeVisible = false;
        if (arg[2].code) {
          this.searchText = arg[2].codeName;
          this.selectNodeCode = arg[2].code;
          this.$emit("change", {
            title: arg[2].codeName,
            value: arg[2].code
          });
        } else {
          this.searchText = "";
          this.selectNodeCode = "";
          this.$emit("change", {
            title: "",
            value: ""
          });
        }
      }
    },
    onCheck(...arg) {
      console.log(arg);
      let treeObj = $.fn.zTree.getZTreeObj(arg[1]);
      let nodes = treeObj.getCheckedNodes(true);
      console.log(nodes);
      let codes = [],
        names = [];
      nodes.forEach((node) => {
        if (!node.isParent) {
          codes.push(node.code);
          names.push(node.name);
        }
      });
      if (this.maxTagCount) {
        if (names.length > this.maxTagCount) {
          this.checkedContent = names.join("，"); //!!!注意都是以中文逗号做的分隔
        } else {
          // this.searchText = names[0]
          this.checkedContent = names.slice(0, this.maxTagCount).join("，");
        }
      } else {
        this.checkedContent = names.join("，");
      }
      this.$emit("change", codes);
    },
    onSelect(node) {
      this.treeVisible = false;
      if (node) {
        this.searchText = arg[2].codeName;
        this.selectNodeCode = node.code;
        this.$emit("change", {
          title: node.codeName,
          value: node.code
        });
      } else {
        this.searchText = "";
        this.selectNodeCode = "";
        this.$emit("change", {
          title: "",
          value: ""
        });
      }
    },
    searchClear() {
      this.treeVisible = true;
      this.searchText = "";
      this.$emit("clear");
    },
    searchScrollTo(val) {
      let el = this.$refs.treeWrap;
      this.$(el).scrollTop(val);
    },
  },
};
</script>
<style lang="scss" scoped>
.ufTreeSelectWrap {
  max-width: 500px;
  height: 30px;
  position: relative;
  border-radius: 4px;
  border: 1px solid #d9d9d9;
  background: #fff;
  box-sizing: border-box;
  padding-left: 10px;
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
  width: 100%;
  max-height: 200px;
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
