<template>
    <div class="treeContainer">
        <div class="searchContainer">
            <a-input-search placeholder="请输入关键字" v-model="searchValue" @change="onChange"
                            @search="onChange"
                            enterButton/>
        </div>
        <div class="treeContent">
            <a-tree
                    @expand="onExpand"
                    :expandedKeys="expandedKeys"
                    :autoExpandParent="autoExpandParent"
                    v-model="checkedKeys"
                    :selectedKeys="selectedKeys"
                    :treeData="treeData"
                    @check="onCheck"
                    @select="onSelect"
            >
                <template slot="node" slot-scope="{ node }">
                            <span class="treeTitle">
                                <span v-if="node.title.indexOf(searchValue) > -1">
                                  {{ node.title.substr(0, node.title.indexOf(searchValue)) }}
                                  <span style="color: #f50">{{ searchValue }}</span>
                                  {{ node.title.substr(node.title.indexOf(searchValue) + searchValue.length) }}
                                </span>
                                <span v-else>{{ node.title }}</span>
                            </span>
                </template>
            </a-tree>
        </div>
    </div>
</template>

<script>
    import { mapState } from 'vuex'
    import common from '../common'
    export default {
        name: "bankTree",
        props: {
            defaultSelectedKeys: Array // 默认选中的节点
        },
        components: {},
        computed: {
            ...mapState({
                pfData: (state) => state.pfData,
                formula: (state) => state.formulaEditor.formula,
            }),
        },
        data() {
            return {
                treeData: [], // 树结构数据
                treeDataList: [], // 数组数据
                searchValue: '',
                expandedKeys: [],
                autoExpandParent: true,
                checkedKeys: [],
                checkedNodes: [],
                selectedKeys: [],
                selectedNodes: []
            }
        },
        created() {
        },
        methods: {
            // 获取银行信息数据
            getTreeData() {
                const vm = this;
                let params = {
                    agencyCode: this.pfData.svAgencyCode
                };
                this.$axios.get('/cu/bank/selectByParam', {params: params})
                    .then(res => {
                        if (res.data.flag == 'success') {
                            const data = res.data.data;
                            this.treeDataList = common.translateDataToTree(data, 'parentCode', 'chrName', 'chrCode').data;
                            this.treeData = common.translateDataToTree(data, 'parentCode','chrName', 'chrCode').treeData;
                        }
                    })
                    .catch(error => {
                        this.$message.error(error)
                    })
            },
            // 筛选查询数据
            getParentKey(key, tree) {
                let parentKey;
                for (let i = 0; i < tree.length; i++) {
                    const node = tree[i];
                    if (node.children) {
                        if (node.children.some(item => item.key === key)) {
                            parentKey = node.key;
                        } else if (this.getParentKey(key, node.children)) {
                            parentKey = this.getParentKey(key, node.children);
                        }
                    }
                }
                return parentKey;
            },
            // 左侧搜索
            onChange() {
                const value = this.searchValue;
                const expandedKeys = this.treeDataList
                    .map(item => {
                        if (item.title.indexOf(value) > -1) {
                            return this.getParentKey(item.key, this.treeData);
                        }
                        return null;
                    })
                    .filter((item, i, self) => item && self.indexOf(item) === i);
                this.expandedKeys = expandedKeys;
                console.log(this.expandedKeys)
            },
            // 左侧树 展开/收起节点
            onExpand(expandedKeys) {
                this.expandedKeys = expandedKeys;
                this.autoExpandParent = false;
            },
            // 左侧树 点击复选框触发
            onCheck(checkedKeys) {
                this.checkedKeys = checkedKeys;
                this.checkedNodes = [];
                this.treeDataList.forEach(item => {
                    if (checkedKeys.indexOf(item.key) > -1) {
                        this.checkedNodes.push(item.node)
                    }
                })
                this.$emit('checkTree', this.selectedNodes);
            },
            // 点击树节点
            onSelect(selectedKeys) {
                this.selectedKeys = selectedKeys;
                this.selectedNodes = [];
                this.treeDataList.forEach(item => {
                    if (selectedKeys.indexOf(item.key) > -1) {
                        this.selectedNodes.push(item.node)
                    }
                });
                this.$emit('selectTree', this.selectedNodes);
            },
        },
        mounted() {
            this.getTreeData();
        },
        watch: {
            defaultSelectedKeys: {
                handler(newVal) {
                    this.selectedKeys = newVal;
                },
                deep: true
            }
        }
    }
</script>

<style scoped lang="less">
    .treeContainer {
        width: 240px;
        height: 100%;
        border: 1px solid #DFE6EC;
    }
    .searchContainer {
        padding: 10px;
        height: 53px;
    }

    .treeContent {
        width: 240px;
        height: calc(100% - 53px);
        overflow: auto;
    }
</style>
