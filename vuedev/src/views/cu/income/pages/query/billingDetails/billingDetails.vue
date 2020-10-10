<template>
    <div>
        <table-list ref="tableList" :uuid="'billingDetails'" tab-title="开票明细表"
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
        name: "billingDetails",
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
                tableConfig: {},
                columns: [],
                data: [],
                selectionItems: [],
                treeOptions: { // 树行下拉集合
                    department: [], // 部门
                    project: [], // 项目
                    setMode: [], // 结算方式
                    billType: [], // 票据类型
                    taxEntryType: [], // 税务帐
                }
            }
        },
        created() {
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
                    eleCodes: 'DEPARTMENT,PROJECT,SETMODE,BILLTYPE'
                };
                this.$axios.get('/cu/incomeCommon/selectEleCodesTreeList', {params: params})
                    .then(res => {
                        if (res.data.flag == 'success') {
                            const data = res.data.data;
                            this.treeOptions.department = common.translateDataToTree(data.DEPARTMENT, 'pCode','codeName', 'code').treeData
                            this.treeOptions.pproject = common.translateDataToTree(data.PROJECT, 'pCode','codeName', 'code').treeData
                            // this.treeOptions.setMode = common.translateDataToTree(data.SETMODE, 'pCode','codeName', 'code').treeData
                            this.treeOptions.billType = common.translateDataToTree(data.BILLTYPE, 'pCode','codeName', 'code').treeData
                            this.searchConfig[1].treeOptions = this.treeOptions.department;
                            this.searchConfig[2].treeOptions = this.treeOptions.pproject;
                            // this.searchConfig[3].treeOptions = this.treeOptions.setMode;
                            this.searchConfig[3].treeOptions = this.treeOptions.billType;
                        } else {
                            this.$message.warning(res.data.msg);
                        }
                    })
                    .catch(error => {
                        this.$message.error(error)
                    })
            },
            // 获取税务入账下拉
            getTaxEntryType() {
                const params = {
                    agencyCode: this.pfData.svAgencyCode
                }
                this.$axios.get('/cu/incomeTaxEntryType/selectByParam', {params: params})
                    .then(res => {
                        if (res.data.flag == 'success') {
                            const data = res.data.data;
                            this.treeOptions.taxEntryType = common.translateDataToTree(data, 'parentCode', 'codeName', 'chrCode').treeData;
                            this.searchConfig[4].treeOptions = this.treeOptions.taxEntryType;
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
                    printDataType: "TICKET_DETAIL",
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
                            getPdf('CU_TICKET_DETAIL', '*', JSON.stringify(data));
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
                    exportType: "TICKET_DETAIL",
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
                    name: '部门',
                    type: 'tree',
                    key: 'departmentCode',
                    treeOptions: this.treeOptions.department
                },
                {
                    name: '项目',
                    type: 'tree',
                    key: 'projectCode',
                    treeOptions: this.treeOptions.project
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
                },
                {
                    name: '税务入账类型',
                    type: 'tree',
                    key: 'taxEntryTypeCode',
                    treeOptions: this.treeOptions.taxEntryType
                }
            ];
            this.tableConfig = {
                dataUrl: '/cu/incomeReport/selectTicketDetailReport',
                dataParams: {
                    agencyCode: this.pfData.svAgencyCode
                }
            };
            this.columns = [
                {title: '凭证日期', dataIndex: 'VOU_DATE', width: '150', align: 'center'},
                {title: '凭证字号', dataIndex: 'VOU_NO_NAME', width: '150', align: 'center'},
                {title: '部门', dataIndex: 'DEPARTMENT_CODE', width: '150', align: 'left'},
                {title: '开票日期', dataIndex: 'TICKET_DATE', width: '130', align: 'center'},
                {title: '开票金额', dataIndex: 'TICKET_MONEY', width: '130', align: 'right', type: 'money'},
                {title: '票据号', dataIndex: 'BILL_NO', width: '130', align: 'left'},
                {title: '票据类型', dataIndex: 'BILL_TYPE', width: '150', align: 'left'},
                {title: '开票人', dataIndex: 'OPEN_TICKET_USER', width: '130', align: 'center'},
                {title: '税务入账类型', dataIndex: 'TAX_ENTRY_TYPE_CODE', width: '150', align: 'left'},

                {title: '税额', dataIndex: 'TAX_NUM', width: '100', align: 'right', type: 'money'}
            ];
            this.getTreeList();
            this.getTaxEntryType();
        },
        watch: {}
    }
</script>

<style scoped>

</style>
