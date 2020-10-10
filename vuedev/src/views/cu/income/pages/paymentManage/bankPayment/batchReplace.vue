<template>
    <uf-modal class="batchReplaceDialog" v-model="visible" title="批量替换" on-ok="handleOk" @cancel="handleCancel" width="800px">
        <template slot="footer">
            <a-button key="add" @click="handleOk" class="mr-10" type="primary">
                批量替换
            </a-button>
            <a-button key="save" @click="handleCancel">
                取消
            </a-button>
        </template>
        <div class="fast-table">
            <el-table border class="realtable" :class="{'empty-table':!tableData || tableData.length === 0}"
                    :data="tableData" style="width: 100%">
                <el-table-column prop="documentItem" label="单据项" />
                <el-table-column
                        prop="isReplace"
                        label="是否替换">
                    <template slot-scope="scope">
                        <a-select :placeholder="'请选择是否替换'" v-model="scope.row.isReplace">
                            <a-select-option value="0">不替换</a-select-option>
                            <a-select-option value="1">替换</a-select-option>
                        </a-select>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="oldValue"
                        label="原值">
                    <template slot-scope="scope">
                        <template v-if="scope.row.type=='select'">
                            <a-select :placeholder="'请选择是原值'" v-model="scope.row.oldValue" @change="handleChange(scope)">
                                <template v-for="option in getSelectOptions(scope.row)">
                                    <a-select-option :value="option.ENU_CODE" :key="option.ENU_CODE">{{option.codeName}}</a-select-option>
                                </template>
                            </a-select>
                        </template>
                        <template v-if="scope.row.type=='tree'">
                            <a-tree-select
                                    v-model="scope.row.oldValue"
                                    style="width: 100%"
                                    :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
                                    :tree-data="getTreeOptions(scope.row)"
                                    placeholder="请选择是原值"
                                    allow-clear
                            >
                            </a-tree-select>
                        </template>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="newValue"
                        label="替换为">
                    <template slot-scope="scope">
                        <template v-if="scope.row.type=='select'">
                            <a-select :placeholder="'请选择替换值'" v-model="scope.row.newValue">
                                <template v-for="option in getSelectOptions(scope.row)">
                                    <a-select-option :value="option.ENU_CODE" :key="option.ENU_CODE">{{option.codeName}}</a-select-option>
                                </template>
                            </a-select>
                        </template>
                        <template v-if="scope.row.type=='tree'">
                            <a-tree-select
                                    v-model="scope.row.newValue"
                                    style="width: 100%"
                                    :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
                                    :tree-data="getTreeOptions(scope.row)"
                                    placeholder="请选择替换值"
                                    allow-clear
                            >
                            </a-tree-select>
                        </template>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </uf-modal>
</template>

<script>

    import { mapState } from 'vuex'
    import common from '@/views/cu/income/common/common'
    export default {
        name: "batchReplace",
        props: {
            visible: {
                type: Boolean,
                default: false
            },
            selectionItems: Array
        },
        model: {
            prop: ['visible'],
            event: 'change'
        },
        components: {},
        computed: {
            ...mapState({
            pfData: (state) => state.pfData
            }),
        },
        data() {
            return {
                tableData: [],
                treeOptions: { // 树行下拉集合
                    setMode: [], // 结算方式
                    deppro: [], // 财政项目
                    expfunc: [], // 功能分类
                    exptype: [], // 支出类型
                    expecoTable: [], // 经济分类
                    incomeTypeOptions: [], // 收入类型
                    fundSourceOptions: [], // 资金来源
                    cuIncomeTypeOptions: [] // 来款类型
                },
                selectOptions: { // 下拉选择数据集合
                    cuIncomeBudgetType: [], // 预算类型
                    cuIncomeBudgetAttribute: [] // 预算属性
                }
            }
        },
        created() {

        },
        methods: {
            handleCancel() {
                this.$emit('change', false);
            },
            handleChange(data){
                console.log(data)
            },
            // 批量替换
            handleOk() {
                const ids = [];
                this.selectionItems.forEach(item => {
                    ids.push(item.arriveCashGuid)
                });
                let params = {
                    agencyCode: this.pfData.svAgencyCode,
                    arriveCashGuids: ids,
                    datas: this.tableData
                };
                let vm = this;
                let msgTitle = '您确定替换所有数据吗？';
                if (ids.length == 0) {
                    msgTitle = '您确定替换所有数据吗？';
                } else {
                    msgTitle = '您确定替换选择的数据吗？';
                }
                this.$confirm({
                    title: msgTitle,
                    okText: '是',
                    okType: 'danger',
                    cancelText: '否',
                    onOk() {
                        vm.$axios.post('/cu/inComeArriveCash/batchReplace', params)
                            .then(res => {
                                if (res.data.flag == 'success') {
                                    vm.$message.success('批量替换成功！');
                                    vm.initTable();
                                    vm.$emit('change', false);
                                    vm.$emit('batchReplaceOk')
                                } else {
                                    vm.$message.warning(res.data.msg);
                                }
                            })
                            .catch(error => {
                                vm.$message.error(error)
                            })
                    },
                    onCancel() {
                    },
                });

            },
            // 获取收入类型下拉
            getIncomeType() {
                const params = {
                    agencyCode: this.pfData.svAgencyCode
                }
                this.$axios.get('/cu/inComeType/selectByParam', {params: params})
                    .then(res => {
                        if (res.data.flag == 'success') {
                            const data = res.data.data;
                            const item = { chrCode: "", chrName: "空值", codeName: "空值", parentCode: "", };
                            data.unshift(item);
                            this.treeOptions.incomeTypeOptions = common.translateDataToTree(data, 'parentCode','codeName', 'chrCode').treeData;
                        } else {
                            this.$message.warning(res.data.msg);
                        }
                    })
                    .catch(error => {
                        this.$message.error(error)
                    })
            },
            // 获取资金来源下拉
            getFundSource() {
                const params = {
                    agencyCode: this.pfData.svAgencyCode
                }
                this.$axios.get('/cu/fundSource/selectByParam', {params: params})
                    .then(res => {
                        if (res.data.flag == 'success') {
                            const data = res.data.data;
                            const item = { chrCode: "", chrName: "空值", codeName: "空值", parentCode: "", };
                            data.unshift(item);
                            this.treeOptions.fundSourceOptions = common.translateDataToTree(data, 'parentCode', 'codeName', 'chrCode').treeData
                        } else {
                            this.$message.warning(res.data.msg);
                        }
                    })
                    .catch(error => {
                        this.$message.error(error)
                    })
            },
            // 获取来款类型下拉
            getCuIncomeType() {
                const params = {
                    agencyCode: this.pfData.svAgencyCode
                }
                this.$axios.get('/cu/arriveType/selectByParam', {params: params})
                    .then(res => {
                        if (res.data.flag == 'success') {
                            const data = res.data.data;
                            const item = { chrCode: "", chrName: "空值", codeName: "空值", parentCode: "", };
                            data.unshift(item);
                            this.treeOptions.cuIncomeTypeOptions = common.translateDataToTree(data, 'parentCode', 'codeName', 'chrCode').treeData
                        } else {
                            this.$message.warning(res.data.msg);
                        }
                    })
                    .catch(error => {
                        this.$message.error(error)
                    })
            },
            // 获取树型下拉选项资源
            getTreeList() {
                let params = {
                    rgCode: this.pfData.svRgCode,
                    setYear: this.pfData.svSetYear,
                    agencyCode: this.pfData.svAgencyCode,
                    eleCodes: 'SETMODE,DEPPRO,EXPFUNC,EXPTYPE,EXPECO' /*结算方式 财政项目 功能分类 支出类型 经济分类*/
                };
                this.$axios.get('/cu/incomeCommon/selectEleCodesTreeList', {params: params})
                    .then(res => {
                        if (res.data.flag == 'success') {
                            const data = res.data.data;
                            const item = { code: "", name: "空值", codeName: "空值", pCode: "", };
                            data.SETMODE.unshift(item);
                            data.DEPPRO.unshift(item);
                            data.EXPFUNC.unshift(item);
                            data.EXPTYPE.unshift(item);
                            data.EXPECO.unshift(item);
                            this.treeOptions.setMode = common.translateDataToTree(data.SETMODE, 'pCode','codeName', 'code').treeData;
                            this.treeOptions.deppro = common.translateDataToTree(data.DEPPRO, 'pCode','codeName', 'code').treeData;
                            this.treeOptions.expfunc = common.translateDataToTree(data.EXPFUNC, 'pCode','codeName', 'code').treeData;
                            this.treeOptions.exptype = common.translateDataToTree(data.EXPTYPE, 'pCode','codeName', 'code').treeData;
                            this.treeOptions.expecoTable = common.translateDataToTree(data.EXPECO, 'pCode','codeName', 'code').treeData;
                        } else {
                            this.$message.warning(res.data.msg);
                        }
                    })
                    .catch(error => {
                        this.$message.error(error)
                    })
            },
            // 获取下拉选项数据
            getOptionsList() {
                let params = {
                    agencyCode: this.pfData.svAgencyCode,
                    enumCodes: 'CU_INCOME_BUDGET_TYPE,CU_INCOME_BUDGET_ATTRIBUTE'
                };
                this.$axios.get('/cu/incomeCommon/selectEnumsList', {params: params})
                    .then(res => {
                        if (res.data.flag == 'success') {
                            const data = res.data.data;
                            const item = { ENU_CODE: "", ENU_NAME: "空值", codeName: "空值" };
                            data.CU_INCOME_BUDGET_TYPE.unshift(item);
                            data.CU_INCOME_BUDGET_ATTRIBUTE.unshift(item);
                            this.selectOptions.cuIncomeBudgetType = data.CU_INCOME_BUDGET_TYPE;
                            this.selectOptions.cuIncomeBudgetAttribute = data.CU_INCOME_BUDGET_ATTRIBUTE;
                        } else {
                            this.$message.warning(res.data.msg);
                        }
                    })
                    .catch(error => {
                        this.$message.error(error)
                    })
            },
            // 获取下拉选项
            getSelectOptions(row) {
                let selectOptions = [];
                switch (row.columnName) {
                    case "BUDGET_TYPE":
                        selectOptions = this.selectOptions.cuIncomeBudgetType;
                        break;
                    case "BUDGET_ATTRIBUTE":
                        selectOptions = this.selectOptions.cuIncomeBudgetAttribute;
                        break;
                }
                return selectOptions;
            },
            // 获取tree选项
            getTreeOptions(row) {
                let treeOptions = [];
                switch (row.columnName) {
                    case "INCOME_TYPE_CODE": // 收入类型
                        treeOptions = this.treeOptions.incomeTypeOptions;
                        break;
                    case "FUNDSOURCE_CODE": // 资金来源
                        treeOptions = this.treeOptions.fundSourceOptions;
                        break;
                    case "ARRIVE_TYPE_CODE": // 来款类型
                        treeOptions = this.treeOptions.cuIncomeTypeOptions;
                        break;
                    case "SETMODE_CODE": // 结算方式
                        treeOptions = this.treeOptions.setMode;
                        break;
                    case "EXPFUNC_CODE": // 功能分类
                        treeOptions = this.treeOptions.expfunc;
                        break;
                    case "EXPECO_CODE": // 经济分类
                        treeOptions = this.treeOptions.expecoTable;
                        break;
                    case "DEPPRO_CODE": // 财政项目
                        treeOptions = this.treeOptions.deppro;
                        break;
                    case "EXPTYPE_CODE": // 支出类型
                        treeOptions = this.treeOptions.exptype;
                        break;
                }
                return treeOptions;
            },
            initTable() {
                this.tableData = [
                    {documentItem: '来款类型', columnName: 'ARRIVE_TYPE_CODE',isReplace: '0', oldValue: undefined, newValue: undefined, type: 'tree'},
                    {documentItem: '收入类型', columnName: 'INCOME_TYPE_CODE',isReplace: '0', oldValue: undefined, newValue: undefined, type: 'tree'},
                    {documentItem: '资金来源', columnName: 'FUNDSOURCE_CODE',isReplace: '0', oldValue: undefined, newValue: undefined, type: 'tree'},
                    {documentItem: '结算方式', columnName: 'SETMODE_CODE',isReplace: '0', oldValue: undefined, newValue: undefined, type: 'tree'},
                    {documentItem: '预算类型', columnName: 'BUDGET_TYPE',isReplace: '0', oldValue: undefined, newValue: undefined, type: 'select'},
                    {documentItem: '功能分类', columnName: 'EXPFUNC_CODE',isReplace: '0', oldValue: undefined, newValue: undefined, type: 'tree'},
                    {documentItem: '经济分类', columnName: 'EXPECO_CODE',isReplace: '0', oldValue: undefined, newValue: undefined, type: 'tree'},
                    {documentItem: '财政项目', columnName: 'DEPPRO_CODE',isReplace: '0', oldValue: undefined, newValue: undefined, type: 'tree'},
                    {documentItem: '支出类型', columnName: 'EXPTYPE_CODE',isReplace: '0', oldValue: undefined, newValue: undefined, type: 'tree'},
                    {documentItem: '预算属性', columnName: 'BUDGET_ATTRIBUTE',isReplace: '0', oldValue: undefined, newValue: undefined, type: 'select'}
                ];
            }
        },
        mounted() {
            this.initTable();
            this.getIncomeType();
            this.getFundSource();
            this.getCuIncomeType();
            this.getTreeList();
            this.getOptionsList();
        },
        watch: {}
    }
</script>

<style lang="less">
    .fast-table .el-table td {
        border-top: 0;
    }
    .fast-table .el-table .el-table__body-wrapper .el-table__body .cell {
        text-align: center;
    }
    .fast-table .el-table th {
        border-top: 1px solid #d9d9d9;
    }
    // 解决和单据设计器样式冲突
    .batchReplaceDialog {
        .fast-table .ant-select{
            width: 100%;
            min-height: 30px !important;
            height: 30px !important;
            line-height: 30px !important;
            .ant-select-selection {
                min-height: 30px !important;
                height: 30px !important;
                line-height: 30px !important;
                .ant-select-selection__rendered {
                    min-height: 30px !important;
                    height: 30px !important;
                    line-height: 30px !important;
                }
            }
        }
    }
</style>
