<template>
    <div v-if="isShow">
        <table-list ref="tableList" :uuid="'paymentSumQuery'" tab-title="银行来款汇总查询"
                    :buttons-config="buttonsConfig" :autoRequest="false"
                    :search-config="searchConfig" :table-config="tableConfig"
                    :columns="columns" :data="data" @clickBtn="clickBtn"
                    v-model="selectionItems" @search="search"></table-list>
    </div>
</template>

<script>
    import { mapState } from 'vuex'
    import tableList from '@/views/cu/income/common/listModule/tableList'
    import { getPdf } from '@/assets/js/util'
    export default {
        name: "paymentSumQuery",
        props: {},
        components: { tableList },
        computed: {
            ...mapState({
            pfData: (state) => state.pfData
            }),
        },
        data() {
            return {
                // tableList
                buttonsConfig: [],
                searchConfig: [],
                selectTypeItem: [],
                tableConfig: {},
                columns: [],
                data: [],
                selectionItems: [],
                selectOptions: { // 下拉选择数据集合
                    cuIncomeSummaryType: [], // 汇总查询类型
                },
                isShow: false // 是否加载表格
            }
        },
        created() {
        },
        methods: {
            // 点击按钮
            clickBtn(e) {
                switch (e) {
                    case 'print':
                        this.print();
                        break;
                    case 'export':
                        this.export();
                        break;
                }
            },
            // 点击搜索按钮
            search(searchParams) {
                const searchKey = searchParams.summaryType;
                const selectItem = this.selectOptions.cuIncomeSummaryType.find(item => item.value === searchKey);
                this.columns[0].title = selectItem.name;
            },
            // 获取下拉选项数据
            getOptionsList() {
                let params = {
                    enumCodes: 'CU_INCOME_SUMMARY_TYPE',
                    agencyCode: this.pfData.svAgencyCode
                };
                this.$axios.get('/cu/incomeCommon/selectEnumsList', {params: params})
                    .then(res => {
                        if (res.data.flag == 'success') {
                            const data = res.data.data;
                            this.selectOptions.cuIncomeSummaryType = [];
                            data.CU_INCOME_SUMMARY_TYPE.forEach(item => {
                                this.selectOptions.cuIncomeSummaryType.push({
                                    label: item.codeName,
                                    value: item.ENU_CODE,
                                    name: item.ENU_NAME
                                })
                            });
                            this.searchConfig[0].options = this.selectOptions.cuIncomeSummaryType;
                            this.tableConfig.dataParams.summaryType = this.searchConfig[0].options[0].value;
                            this.selectTypeItem = this.selectOptions.cuIncomeSummaryType[0]
                            this.isShow = true;
                        } else {
                            this.$message.warning(res.data.msg);
                        }
                    })
                    .catch(error => {
                        this.$message.error(error)
                    })
            },
            // 打印
            print() {
                let params = {
                    printDataType: "ARRIVE_SUMMARY",
                    agencyCode: this.pfData.svAgencyCode,
                    agencyName: this.pfData.svAgencyName,
                    userName: this.pfData.svUserName,
                };
                const searchParams = this.$refs.tableList.searchParams;
                searchParams['startDate'] = searchParams['arriveCashDateStart'];
                searchParams['endDate'] = searchParams['arriveCashDateEnd'];
                delete searchParams['arriveCashDate'];
                let selectItem
                if (searchParams.summaryType) {
                    selectItem = this.selectOptions.cuIncomeSummaryType.find(item => item.value === searchParams.summaryType);
                } else {
                    searchParams.summaryType = 'BANK';
                    selectItem = this.selectOptions.cuIncomeSummaryType[0];
                }
                searchParams.searchTypeName = selectItem.name;
                searchParams.columnName = selectItem.name;
                params = Object.assign(params, searchParams);
                this.$axios.post('/cu/incomePrint/getPrintDataForBase', params)
                    .then(res => {
                        if (res.data.flag === 'success') {
                            let data = [{}];
                            res.data.data.forEach(item => {
                                Object.assign(data[0], item);
                            });
                            getPdf('CU_INCOME_ARRIVE_CASH_SUMMARY', '*', JSON.stringify(data));
                        } else {
                            this.$message.warning(res.data.msg);
                        }
                    })
                    .catch(error => {
                        this.$message.error(error)
                    })
            },
            // 导出
            export() {
                let params = {
                    exportType: "ARRIVE_SUMMARY",
                    agencyCode: this.pfData.svAgencyCode,
                    agencyName: this.pfData.svAgencyName,
                    userName: this.pfData.svUserName,
                };
                const searchParams = this.$refs.tableList.searchParams;
                searchParams['startDate'] = searchParams['arriveCashDateStart'];
                searchParams['endDate'] = searchParams['arriveCashDateEnd'];
                delete searchParams['arriveCashDate'];
                let selectItem
                if (searchParams.summaryType) {
                    selectItem = this.selectOptions.cuIncomeSummaryType.find(item => item.value === searchParams.summaryType);
                } else {
                    searchParams.summaryType = 'BANK';
                    selectItem = this.selectOptions.cuIncomeSummaryType[0];
                }
                searchParams.searchTypeName = selectItem.name;
                searchParams.columnName = selectItem.name;
                params = Object.assign(params, searchParams);
                this.$axios.get('/cu/dataExport/exportExcelForBase', {params: params})
                    .then(res => {
                        if (res.status === 200) {
                            window.open(res.request.responseURL);
                        } else {
                            this.$message.warning(res.data.msg);
                        }
                    })
                    .catch(error => {
                        this.$message.error(error)
                    })
            },
        },
        mounted() {
            this.buttonsConfig = [
                {name: 'print', primary: 'true'},
                {name: 'export'}
            ];
            this.searchConfig = [
                {
                    name: '汇总查询类型',
                    type: 'option',
                    key: 'summaryType',
                    value: 'BANK',
                    options: this.selectOptions.cuIncomeSummaryType
                },
                {
                    name: '期间',
                    type: 'rangeDate',
                    key: 'arriveCashDate'
                }
            ];
            this.tableConfig = {
                dataUrl: '/cu/incomeReport/selectArriveCashSummaryReport',
                dataParams: {
                    summaryType: 'BANK',
                    agencyCode: this.pfData.svAgencyCode
                }
            };
            this.columns = [
                {title: '银行', dataIndex: 'name', align: 'left'},
                {title: '来款笔数', dataIndex: 'dataCount', align: 'center'},
                {title: '来款金额', dataIndex: 'arriveCashMoney', align: 'right', type: 'money'},
                {title: '未认领金额', dataIndex: 'unclaimedMoney', align: 'right', type: 'money'},
                {title: '已认领金额', dataIndex: 'claimedMoney', align: 'right', type: 'money'}
            ];
            this.getOptionsList();
        },
        watch: {}
    }
</script>

<style>
.el-table__body-wrapper {
    border-bottom: 1px solid #e8e8e8;
}
</style>
