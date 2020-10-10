<template>
    <div>
        <table-list ref="tableList" :uuid="'debitInvoiceStatistics'" tab-title="对方单位借开票统计表"
                    :buttons-config="buttonsConfig"
                    :search-config="searchConfig" :table-config="tableConfig"
                    :columns="columns" :data="data" @clickBtn="clickBtn"
                    v-model="selectionItems"></table-list>
    </div>
</template>

<script>
    import { mapState } from 'vuex'
    import tableList from '@/views/cu/income/common/listModule/tableList'
    import common from '@/views/cu/income/common/common';
    import { getPdf } from '@/assets/js/util'
    export default {
        name: "debitInvoiceStatistics",
        props: {},
        components: { tableList },
        data() {
            return {
                // tableList
                buttonsConfig: [],
                searchConfig: [],
                tableConfig: {},
                columns: [],
                data: [],
                selectionItems: [],
                treeOptions: { // 树行下拉集合
                    setMode: [], // 结算方式
                    billType: [], // 票据类型
                }
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
            // 获取树型下拉选项资源
            getTreeList() {
                let params = {
                    rgCode: this.pfData.svRgCode,
                    setYear: this.pfData.svSetYear,
                    agencyCode: this.pfData.svAgencyCode,
                    eleCodes: 'BILLTYPE' /*结算方式，票据类型*/
                };
                this.$axios.get('/cu/incomeCommon/selectEleCodesTreeList', {params: params})
                    .then(res => {
                        if (res.data.flag == 'success') {
                            const data = res.data.data;
                            // this.treeOptions.setMode = common.translateDataToTree(data.SETMODE, 'pCode','codeName', 'code').treeData;
                            this.treeOptions.billType = common.translateDataToTree(data.BILLTYPE, 'pCode','codeName', 'code').treeData;
                            // this.searchConfig[2].treeOptions = this.treeOptions.setMode;
                            this.searchConfig[2].treeOptions = this.treeOptions.billType;
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
                    printDataType: "TICKET_OTHER_UNIT",
                    agencyCode: this.pfData.svAgencyCode,
                    agencyName: this.pfData.svAgencyName,
                    userName: this.pfData.svUserName,
                };
                const searchParams = this.$refs.tableList.searchParams;
                searchParams['startDate'] = searchParams['openTicketDateStart'];
                searchParams['endDate'] = searchParams['openTicketDateEnd'];
                delete searchParams['openTicketDate'];
                params = Object.assign(params, searchParams);
                this.$axios.post('/cu/incomePrint/getPrintDataForBase', params)
                    .then(res => {
                        if (res.data.flag === 'success') {
                            let data = [{}];
                            res.data.data.forEach(item => {
                                Object.assign(data[0], item);
                            });
                            getPdf('CU_TICKET_OTHER_UNT', '*', JSON.stringify(data));
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
                    exportType: "TICKET_OTHER_UNIT",
                    agencyCode: this.pfData.svAgencyCode,
                    agencyName: this.pfData.svAgencyName,
                    userName: this.pfData.svUserName,
                };
                const searchParams = this.$refs.tableList.searchParams;
                searchParams['startDate'] = searchParams['openTicketDateStart'];
                searchParams['endDate'] = searchParams['openTicketDateEnd'];
                delete searchParams['openTicketDate'];
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
                    name: '开票日期',
                    type: 'rangeDate',
                    key: 'openTicketDate'
                },
                {
                    name: '对方单位',
                    type: 'text',
                    key: 'otherUnit'
                },
                /*{
                    name: '结算方式',
                    type: 'tree',
                    key: 'setModCode',
                    treeOptions: this.treeOptions.setMode
                },*/
                {
                    name: '票据类型',
                    type: 'tree',
                    key: 'billType',
                    treeOptions: this.treeOptions.billType
                }
            ];
            this.tableConfig = {
                dataUrl: '/cu/incomeReport/selectTicketOtherUnitReport',
                dataParams: {
                    agencyCode: this.pfData.svAgencyCode
                }
            };
            this.columns = [
                {title: '对方单位', dataIndex: 'OTHER_UNIT', align: 'left'},
                {title: '开票日期', dataIndex: 'TICKET_DATE', align: 'center'},
                {title: '开票金额', dataIndex: 'TICKET_MONEY', align: 'right', type: 'money'},
                {title: '票据号', dataIndex: 'BILL_NO', align: 'left'},
                {title: '票据类型', dataIndex: 'BILL_TYPE', align: 'left'},
                {title: '已核销次数', dataIndex: 'CLAIM_COUNT', align: 'center'},
                {title: '到款金额', dataIndex: 'CLAIM_MONEY', align: 'right', type: 'money'},
                {title: '未到金额', dataIndex: 'UN_CLAIM_MONEY', align: 'right', type: 'money'},
            ];
            this.getTreeList();
        },
        watch: {}
    }
</script>

<style scoped>

</style>
