<template>
    <uf-modal class="ticketListDialog" v-model="visible" title="借票单号选择" @ok="handleOk" @cancel="handleCancel" width="1000px">
        <div class="pageContainer" v-if="visible">
            <table-list ref="tableList" :uuid="'ticketListDialog'" :showTabs="false"
                        :tab-config="tapConfig"
                        :buttons-config="buttonsConfig"
                        :search-config="searchConfig" :table-config="tableConfig"
                        :columns="columns" :data="data" @clickBtn="clickBtn"
                        v-model="selectionItems"></table-list>
        </div>
    </uf-modal>
</template>

<script>
    import { mapState } from 'vuex'
    import tableList from '@/views/cu/income/common/listModule/tableList'
    import common from '@/views/cu/income/common/common';
    export default {
        name: "ticketListDialog",
        props: {
            visible: {
                type: Boolean,
                default: false
            },
            arriveCashGuid: String,
            claimMoney: [Number, String]
        },
        model: {
            prop: ['visible'],
            event: 'change'
        },
        components: { tableList },
        computed: {
            ...mapState({
            pfData: (state) => state.pfData
            }),
        },
        data() {
            return {
                // tableList
                tapConfig: [],
                buttonsConfig: [],
                searchConfig: [],
                tableConfig: {},
                columns: [],
                data: [],
                selectionItems: [],
                treeOptions: { // 树行下拉集合
                    billType: [], // 票据类型
                    project: [], // 项目
                },
                fundSourceOptions: [] // 资金来源
            }
        },
        created() {
        },
        methods: {
            handleCancel() {
                this.$emit('change', false);
            },
            handleOk() {
                if (this.selectionItems.length > 1) {
                    this.$message.warning('最多选择一条数据！');
                    return
                }
                this.$emit('handleOk', this.selectionItems)
                this.$emit('change', false);
            },
            // 点击按钮
            clickBtn(e) {
                switch (e) {
                    case '':
                        break;
                }
            },
            // 获取树型下拉选项资源
            getTreeList() {
                let params = {
                    rgCode: this.pfData.svRgCode,
                    setYear: this.pfData.svSetYear,
                    agencyCode: this.pfData.svAgencyCode,
                    eleCodes: 'PROJECT,BILLTYPE' /*项目 票据类型*/
                };
                this.$axios.get('/cu/incomeCommon/selectEleCodesTreeList', {params: params})
                    .then(res => {
                        if (res.data.flag == 'success') {
                            const data = res.data.data;
                            this.treeOptions.project = common.translateDataToTree(data.PROJECT, 'pCode','codeName', 'code').treeData;
                            this.treeOptions.billType = common.translateDataToTree(data.BILLTYPE, 'pCode','codeName', 'code').treeData;
                            this.searchConfig[3].treeOptions = this.treeOptions.project;
                            this.searchConfig[2].treeOptions = this.treeOptions.billType;
                        } else {
                            this.$message.warning(res.data.msg);
                        }
                    })
                    .catch(error => {
                        this.$message.error(error)
                    })
            }
        },
        mounted() {
            this.tapConfig = [
            ];
            this.buttonsConfig = [
            ];
            this.searchConfig = [
                {
                    name: '日期',
                    type: 'rangeDate',
                    key: 'ticketDate'
                },
                {
                    name: '借票申请单号',
                    type: 'text',
                    key: 'applicationNo'
                },
                {
                    name: '票据类型',
                    type: 'tree',
                    key: 'billType',
                    treeOptions: []
                },
                {
                    name: '项目',
                    type: 'tree',
                    key: 'projectCode',
                    treeOptions: []
                },
                {
                    name: '对方单位',
                    type: 'text',
                    key: 'otherUnit'
                },
                {
                    name: '票据金额',
                    type: 'inputRange',
                    key: 'ticketMoney'
                }
            ];
            this.tableConfig = {
                dataUrl: '/cu/inComeTicket/selectByParam',
                dataParams: {
                    agencyCode: this.pfData.svAgencyCode,
                    types: '1,2',
                    enable: '4',
                    // notInClaimBusiness: '1',
                    arriveCashGuid: this.arriveCashGuid,
                    claimMoney: this.claimMoney
                }
            };
            this.columns = [
                {title: '借票日期', dataIndex: 'ticketDate', width: '120', align: 'center'},
                {title: '借票申请单号', dataIndex: 'applicationNo', width: '120', align: 'center'},
                {title: '票据类型', dataIndex: 'billTypeName', width: '130', align: 'left'},
                {title: '预计到款日期', dataIndex: 'expectPaymentDate', width: '120', align: 'center'},
                {title: '开票金额', dataIndex: 'openTicketMoney', width: '100', align: 'right', type: 'money'},
                {title: '对方单位', dataIndex: 'otherUnit', width: '100', align: 'left'},
                {title: '项目', dataIndex: 'projectCodeName', width: '100', align: 'left'},
                {title: '经办人', dataIndex: 'manager', width: '100', align: 'center'},
            ];
            this.getTreeList();
        },
        watch: {
            arriveCashGuid() {
                this.tableConfig.dataParams.arriveCashGuid = this.arriveCashGuid
            },
            claimMoney() {
                this.tableConfig.dataParams.claimMoney = this.claimMoney
            }
        }
    }
</script>

<style lang="less">
    .ticketListDialog .search-condition .condition-container .form-item .ant-form-item .ant-form-item-label {
        width: 100px;
    }
</style>
