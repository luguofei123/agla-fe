<template>
    <div class="pageContainer">
        <div class="leftContainer">
            <bankTree @selectTree="selectTree" />
        </div>
        <div class="rightContainer">
            <table-list ref="tableList" :uuid="'paymentDetailQuery'" tab-title="银行来款明细查询"
                        :buttons-config="buttonsConfig"
                        :search-config="searchConfig" :table-config="tableConfig"
                        :columns="columns" :data="data" @clickBtn="clickBtn"
                        v-model="selectionItems"></table-list>
        </div>

    </div>
</template>

<script>
    import { mapState } from 'vuex'
    import bankTree from "@/views/cu/income/common/leftTree/bankTree";
    import tableList from '@/views/cu/income/common/listModule/tableList';
    import common from '@/views/cu/income/common/common';
    import { getPdf } from '@/assets/js/util'
    export default {
        name: "paymentDetailQuery",
        props: {},
        components: { bankTree, tableList },
        data() {
            return {
                selectedTreeNode: {}, // 选中的树节点
                buttonsConfig: [],
                searchConfig: [],
                tableConfig: {},
                columns: [],
                data: [],
                selectionItems: [],
                incomeTypeOptions: [], // 收入类型
                fundSourceOptions: [], // 资金来源
            }
        },
        created() {
        },
        computed: {
            ...mapState({
            pfData: (state) => state.pfData
            }),
        },
        methods: {
            // 点击左侧树
            selectTree(node) {
                this.selectedTreeNode = node[0];
                this.tableConfig.dataParams.bankCode = this.selectedTreeNode.chrCode;
                this.$nextTick(()=> {
                    this.$refs.tableList.getData();
                })
            },
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
            // 获取资金来源下拉
            getFundSource() {
                const params = {
                    agencyCode: this.pfData.svAgencyCode
                }
                this.$axios.get('/cu/fundSource/selectByParam', {params: params})
                    .then(res => {
                        if (res.data.flag == 'success') {
                            const data = res.data.data;
                            this.fundSourceOptions = common.translateDataToTree(data, 'parentCode', 'codeName', 'chrCode').treeData;
                            this.searchConfig[5].treeOptions = this.fundSourceOptions;
                        } else {
                            this.$message.warning(res.data.msg);
                        }
                    })
                    .catch(error => {
                        this.$message.error(error)
                    })
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
                            this.incomeTypeOptions = common.translateDataToTree(data, 'parentCode','codeName', 'chrCode').treeData;
                            this.searchConfig[6].treeOptions = this.incomeTypeOptions;
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
                    printDataType: "ARRIVE_DETAIL",
                    agencyCode: this.pfData.svAgencyCode,
                    agencyName: this.pfData.svAgencyName,
                    userName: this.pfData.svUserName,
                };
                const searchParams = this.$refs.tableList.searchParams;
                searchParams['startDate'] = searchParams['arriveCashDateStart'];
                searchParams['endDate'] = searchParams['arriveCashDateEnd'];
                delete searchParams['arriveCashDate'];
                params = Object.assign(params, searchParams);
                this.$axios.post('/cu/incomePrint/getPrintDataForBase', params)
                    .then(res => {
                        if (res.data.flag === 'success') {
                            let data = [{}];
                            res.data.data.forEach(item => {
                                Object.assign(data[0], item);
                            });
                            getPdf('CU_INCOME_ARRIVE_CASH_DETAIL', '*', JSON.stringify(data));
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
                    exportType: "ARRIVE_DETAIL",
                    agencyCode: this.pfData.svAgencyCode,
                    agencyName: this.pfData.svAgencyName,
                    userName: this.pfData.svUserName,
                };
                const searchParams = this.$refs.tableList.searchParams;
                searchParams['startDate'] = searchParams['arriveCashDateStart'];
                searchParams['endDate'] = searchParams['arriveCashDateEnd'];
                delete searchParams['arriveCashDate'];
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
                    name: '来款单号',
                    type: 'text',
                    key: 'arriveCashCode'
                },
                {
                    name: '来款日期',
                    type: 'rangeDate',
                    key: 'arriveCashDate'
                },
                {
                    name: '付款单位',
                    type: 'text',
                    key: 'payAgencyCodeName'
                },
                {
                    name: '结算单号',
                    type: 'text',
                    key: 'settleBillCode'
                },
                {
                    name: '来款金额',
                    type: 'inputRange',
                    key: 'arriveCashMoney'
                },
                /*{
                    name: '凭证字号',
                    type: 'text',
                    key: 'vouNoName'
                },*/
                /*{
                    name: '往来号',
                    type: 'text',
                    key: 'contactCode'
                },*/
                {
                    name: '资金来源',
                    type: 'tree',
                    key: 'fundsourceCode',
                    treeOptions: this.fundSourceOptions
                },
                {
                    name: '收入类型',
                    type: 'tree',
                    key: 'incomeTypeCode',
                    treeOptions: this.incomeTypeOptions
                },
                {
                    name: '备注',
                    type: 'text',
                    key: 'remark'
                },
                {
                    name: '来款状态',
                    type: 'option',
                    key: 'arriveCashStatus',
                    options: [
                        { label:'未处理', value:'0' },
                        { label:'已认领', value:'1' },
                        { label:'部分认领', value:'2' }
                    ]
                },
                {
                    name: '是否财政',
                    type: 'radioGroup',
                    key: 'isFinance',
                    radio: [
                        {label:'是', value:'1'},
                        {label:'否', value:'0'}
                    ]

                },
                {
                    name: '已发布',
                    type: 'radioGroup',
                    key: 'isReleased',
                    radio: [
                        {label:'是', value:'1'},
                        {label:'否', value:'0'}
                    ]
                },


            ];
            this.tableConfig = {
                dataUrl: '/cu/incomeReport/selectArriveCashDetailReport',
                dataParams: {
                    bankCode: this.selectedTreeNode.chrCode,
                    agencyCode: this.pfData.svAgencyCode
                }
            };
            this.columns = [
                {title: '来款单号', dataIndex: 'arriveCashCode', width: '120', align: 'center'},
                {title: '来款日期', dataIndex: 'arriveCashDate', width: '130', align: 'center'},
                {title: '银行', dataIndex: 'bankCodeName', width: '120', align: 'left'},
                {title: '付款单位', dataIndex: 'payAgencyCode', width: '120', align: 'left'},
                {title: '来款金额', dataIndex: 'arriveCashMoney', width: '120', align: 'right', type: 'money'},
                {title: '结算单号', dataIndex: 'settleBillCode', width: '120', align: 'left'},
                {title: '收入类型', dataIndex: 'incomeTypeCodeName', width: '150', align: 'left'},
                {title: '资金来源', dataIndex: 'fundsourceCodeName', width: '150', align: 'left'},
                {title: '凭证字号', dataIndex: 'vouNoName', width: '130', align: 'center'},
                {title: '往来号', dataIndex: 'contactCode', width: '150', align: 'center'},
                {title: '是否财政', dataIndex: 'isFinanceName', width: '120', align: 'center'},
                {title: '发布状态', dataIndex: 'isReleasedName', width: '120', align: 'center'},
                {title: '来款状态', dataIndex: 'arriveCashStatusName', width: '120', align: 'center'},
                {title: '备注', dataIndex: 'remark', width: '120', align: 'center'}
            ];
            this.getFundSource();
            this.getIncomeType();
        },
        watch: {}
    }
</script>

<style lang="less">

</style>
