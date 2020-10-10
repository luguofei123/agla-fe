<template>
    <div class="pageBillContainer">
        <div class="pageBillTitle">
            <a-button type="primary" @click="save">保存</a-button>
            <a-button @click="saveAndAdd">保存并新增</a-button>
            <template v-if="status=='update'">
                <template v-if="cardStatus == '0'">
                    <a-button @click="release">发布</a-button>
                    <a-button @click="unRelease">不发布</a-button>
                    <a-button @click="deleteBill">删除</a-button>
                </template>
                <template v-if="cardStatus == '1'">
                    <a-button @click="cancelReleases('取消成功！')">取消发布</a-button>
                </template>
                <template v-if="cardStatus == '2'">
                    <a-button @click="deleteBill">删除</a-button>
                    <a-button @click="cancelReleases('还原成功！')">还原</a-button>
                </template>
                <template v-if="cardStatus == '9'">

                </template>
            </template>
            <a-button @click="cancel">取消</a-button>
        </div>
        <div class="pageBillContent">
            <a-collapse :default-active-key="['1','2','3','4','5','6']" :bordered="false">
                <a-collapse-panel key="1" header="来款信息">
                    <ul class="formItemContainer">
                        <li class="formItem">
                            <label class="label"><i class="isMust">*</i>来款单号：</label>
                            <span class="value">
                                <a-input :placeholder="'请输入来款单号'" v-model="billData.arriveCashCode" :maxLength="20"/>
                                <span v-if="isShowError && !billData.arriveCashCode" class="errorText">来款单号不能为空</span>
                            </span>
                        </li>
                        <li class="formItem">
                            <label class="label"><i class="isMust">*</i>来款日期：</label>
                            <span class="value">
                                <a-date-picker :value="defaultDate(billData.arriveCashDate)" @change="(date, dateString) => {dateChange(date, dateString, 'arriveCashDate')}"/>
                                <span v-if="isShowError && !billData.arriveCashDate" class="errorText">来款日期不能为空</span>
                            </span>
                        </li>
                        <li class="formItem">
                            <label class="label"><i class="isMust">*</i>是否财政：</label>
                            <span class="value">
                                <a-select style="width: 100%" :placeholder="'请选择是否财政'" v-model="billData.isFinance">
                                    <a-select-option value="1">是</a-select-option>
                                    <a-select-option value="0">否</a-select-option>
                                </a-select>
                                <span v-if="isShowError && !billData.isFinance" class="errorText">是否财政不能为空</span>
                            </span>
                        </li>
                        <li class="formItem">
                            <label class="label"><i class="isMust">*</i>银行名称：</label>
                            <span class="value">
                                <a-tree-select
                                        v-model="billData.bankCode"
                                        style="width: 100%"
                                        :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
                                        :tree-data="treeOptions.bankOption.rootNode"
                                        placeholder="请选择银行名称"
                                        allow-clear
                                        @change="itemChange($event,'bankCode')"
                                        tree-data-simple-mode
                                        :load-data="onLoadData"
                                >
                                </a-tree-select>
                                <span v-if="isShowError && !billData.bankCode" class="errorText">银行名称不能为空</span>
                                <span v-if="!bankCodeIsLeaf" class="errorText">银行名称必须是叶子节点</span>
                            </span>
                        </li>
                        <li class="formItem">
                            <label class="label"><i class="isMust">*</i>付款单位：</label>
                            <span class="value">
                                <a-input :placeholder="'请输入付款单位'" v-model="billData.payAgencyCode" :maxLength="20"/>
                                <span v-if="isShowError && !billData.payAgencyCode" class="errorText">付款单位不能为空</span>
                            </span>
                        </li>
                        <li class="formItem">
                            <label class="label"><i class="isMust">*</i>来款类型：</label>
                            <span class="value">
                                <a-tree-select
                                        v-model="billData.arriveTypeCode"
                                        style="width: 100%"
                                        :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
                                        :tree-data="treeOptions.cuIncomeTypeOptions.rootNode"
                                        placeholder="请选择来款类型"
                                        allow-clear
                                        tree-data-simple-mode
                                        :load-data="onLoadData"
                                >
                                </a-tree-select>
                                <span v-if="isShowError && !billData.arriveTypeCode" class="errorText">来款类型不能为空</span>
                            </span>
                        </li>
                        <li class="formItem">
                            <label class="label"><i class="isMust">*</i>收入类型：</label>
                            <span class="value">
                                <a-tree-select
                                        v-model="billData.incomeTypeCode"
                                        style="width: 100%"
                                        :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
                                        :tree-data="treeOptions.incomeTypeOptions.rootNode"
                                        placeholder="请选择收入类型"
                                        allow-clear
                                        tree-data-simple-mode
                                        :load-data="onLoadData"
                                >
                                </a-tree-select>
                                <span v-if="isShowError && !billData.incomeTypeCode" class="errorText">收入类型不能为空</span>
                            </span>
                        </li>
                        <li class="formItem">
                            <label class="label"><i class="isMust">*</i>资金来源：</label>
                            <span class="value">
                                <a-tree-select
                                        v-model="billData.fundsourceCode"
                                        style="width: 100%"
                                        :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
                                        :tree-data="treeOptions.fundSourceOptions.rootNode"
                                        placeholder="请选择资金来源"
                                        allow-clear
                                        tree-data-simple-mode
                                        :load-data="onLoadData"
                                >
                                </a-tree-select>
                                <span v-if="isShowError && !billData.fundsourceCode" class="errorText">资金来源不能为空</span>
                            </span>
                        </li>
                        <li class="formItem">
                            <label class="label"><i class="isMust">*</i>来款金额：</label>
                            <span class="value">
                                <a-input-number
                                        v-model="billData.arriveCashMoney"
                                        :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                                        :parser="value => value.replace(/\$\s?|(,*)/g, '')"
                                        :placeholder="'请输入来款金额'"
                                        :min="0"
                                        :max="9999999999999"
                                />
                                <span v-if="isShowError && !billData.arriveCashMoney" class="errorText">来款金额不能为空</span>
                            </span>
                        </li>
                        <li class="formItem" style="width: 100%">
                            <label class="label">摘要：</label>
                            <span class="value">
                                <a-input :placeholder="'请输入摘要'" v-model="billData.descpt" :maxLength="100"/>
                            </span>
                        </li>
                        <!--<li class="formItem">
                            <label class="label">已认领金额：</label>
                            <span class="value">
                                <a-input-number
                                        v-model="billData.claimedMoney"
                                        :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                                        :parser="value => value.replace(/\$\s?|(,*)/g, '')"
                                        :placeholder="'请输入已认领金额'"
                                />
                            </span>
                        </li>-->
                    </ul>
                </a-collapse-panel>
                <a-collapse-panel key="2" header="银行信息">
                    <ul class="formItemContainer">
                        <li class="formItem">
                            <label class="label">结算方式：</label>
                            <span class="value">
                                <a-tree-select
                                        v-model="billData.setmodeCode"
                                        tree-data-simple-mode
                                        style="width: 100%"
                                        :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
                                        :tree-data="treeOptions.setMode.rootNode"
                                        placeholder="请选择结算方式"
                                        allow-clear
                                        :load-data="onLoadData"
                                >
                                </a-tree-select>
                            </span>
                        </li>
                        <li class="formItem">
                            <label class="label">结算单号：</label>
                            <span class="value">
                                <a-input :placeholder="'请输入结算单号'" v-model="billData.settleBillCode" :maxLength="40"/>
                            </span>
                        </li>
                        <li class="formItem">
                            <label class="label">操作说明：</label>
                            <span class="value">
                                <a-input :placeholder="'请输入操作说明'" v-model="billData.instructions" :maxLength="150"/>
                            </span>
                        </li>
                        <li class="formItem">
                            <label class="label">操作员：</label>
                            <span class="value">
                                <a-input :placeholder="'请输入操作员'" v-model="billData.operator" :maxLength="20"/>
                            </span>
                        </li>
                        <li class="formItem" style="width: 100%">
                            <label class="label">备注：</label>
                            <span class="value">
                                <a-input :placeholder="'请输入备注'" v-model="billData.remark" :maxLength="150"/>
                            </span>
                        </li>
                    </ul>
                </a-collapse-panel>
                <a-collapse-panel key="3" header="国库信息">
                    <ul class="formItemContainer">
                        <li class="formItem">
                            <label class="label">预算类型：</label>
                            <span class="value">
                                <a-select style="width: 100%" :placeholder="'请选择预算类型'" v-model="billData.budgetTypeCode">
                                    <template v-for="option in selectOptions.cuIncomeBudgetType">
                                        <a-select-option :value="option.ENU_CODE" :key="option.ENU_CODE">{{option.codeName}}</a-select-option>
                                    </template>
                                </a-select>
                            </span>
                        </li>
                        <li class="formItem">
                            <label class="label">财政项目：</label>
                            <span class="value">
                                <a-tree-select
                                        v-model="billData.depproCode"
                                        tree-data-simple-mode
                                        style="width: 100%"
                                        :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
                                        :tree-data="treeOptions.deppro.rootNode"
                                        placeholder="请选择财政项目"
                                        allow-clear
                                        @change="getRelation(billData.depproCode)"
                                        :load-data="onLoadData"
                                >
                                </a-tree-select>
                            </span>
                        </li>
                        <li class="formItem">
                            <label class="label">关联号：</label>
                            <span class="value">
                                <a-input :placeholder="'请输入关联号'" v-model="billData.relation" :maxLength="10"/>
                            </span>
                        </li>
                        <li class="formItem">
                            <label class="label">功能分类：</label>
                            <span class="value">
                                <a-tree-select
                                        v-model="billData.expfuncCode"
                                        tree-data-simple-mode
                                        style="width: 100%"
                                        :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
                                        :tree-data="treeOptions.expfunc.rootNode"
                                        placeholder="请选择功能分类"
                                        allow-clear
                                        :load-data="onLoadData"
                                >
                                </a-tree-select>
                            </span>
                        </li>
                        <li class="formItem">
                            <label class="label">支出类型：</label>
                            <span class="value">
                                <a-tree-select
                                        v-model="billData.exptypeCode"
                                        tree-data-simple-mode
                                        style="width: 100%"
                                        :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
                                        :tree-data="treeOptions.exptype.rootNode"
                                        placeholder="请选择支出类型"
                                        allow-clear
                                        :load-data="onLoadData"
                                >
                                </a-tree-select>
                            </span>
                        </li>
                        <li class="formItem">
                            <label class="label">经济分类：</label>
                            <span class="value">
                                <a-tree-select
                                        v-model="billData.expecoCode"
                                        tree-data-simple-mode
                                        style="width: 100%"
                                        :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
                                        :tree-data="treeOptions.expecoTable.rootNode"
                                        placeholder="请选择经济分类"
                                        allow-clear
                                        :load-data="onLoadData"
                                >
                                </a-tree-select>
                            </span>
                        </li>
                        <li class="formItem">
                            <label class="label">预算属性：</label>
                            <span class="value">
                                <a-select style="width: 100%" :placeholder="'请输入预算属性'" v-model="billData.budgetAttribute">
                                    <template v-for="option in selectOptions.cuIncomeBudgetAttribute">
                                        <a-select-option :value="option.ENU_CODE" :key="option.ENU_CODE">{{option.codeName}}</a-select-option>
                                    </template>
                                </a-select>
                            </span>
                        </li>
                    </ul>
                </a-collapse-panel>
                <a-collapse-panel key="4" header="凭证信息" v-if="status=='update'">
                    <ul class="formItemContainer">
                        <li class="formItem">
                            <label class="label">凭证字号：</label>
                            <span class="value">
                                <a-input :placeholder="'请输入凭证字号'" v-model="billData.vouNoName" disabled/>
                            </span>
                        </li>
                        <li class="formItem">
                            <label class="label">往来号：</label>
                            <span class="value">
                                <a-input :placeholder="'请输入往来号'" v-model="billData.contactCode" disabled/>
                            </span>
                        </li>
                    </ul>
                </a-collapse-panel>
                <a-collapse-panel key="5" header="默认信息">
                    <ul class="formItemContainer">
                        <li class="formItem">
                            <label class="label">来款状态 ：</label>
                            <span class="value">
                                {{billData.arriveCashStatusName}}
                            </span>
                        </li>
                        <li class="formItem">
                            <label class="label">录入日期：</label>
                            <span class="value">
                                {{billData.inputDate}}
                            </span>
                        </li>
                        <li class="formItem">
                            <label class="label">录入人：</label>
                            <span class="value">
                                {{billData.inputUser}}
                            </span>
                        </li>
                    </ul>
                </a-collapse-panel>
            </a-collapse>
            <uploadFiles :sysId="'CU_INCOME'" :moduleId="'INCOME'" :functionId="'ARRIVE_CASH'"
                         :billGuid="billGuid" :uploadConfig="uploadConfig"/>
        </div>
    </div>
</template>

<script>
    import { mapState } from 'vuex'
    import common from '@/views/cu/income/common/common'
    import uploadFiles from "@/views/cu/income/common/uploadFiles/uploadFiles";
    import moment from 'moment';
    export default {
        name: "bankPaymentBill",
        props: {},
        components: { uploadFiles },
        computed: {
            ...mapState({
            pfData: (state) => state.pfData
            }),
        },
        data() {
            return {
                billGuid: '', // 详情单据的id
                bankCode: '', // 列表页面选择的银行
                billData: {}, // 详情数据
                status: 'add', // 页面状态
                cardStatus: '', // 页签状态

                bankOptionList: [], // 银行信息列表
                treeOptions: { // 树行下拉集合
                    setMode: { childNode:[], rootNode:[] }, // 结算方式
                    deppro: { childNode:[], rootNode:[] }, // 财政项目
                    expfunc: { childNode:[], rootNode:[] }, // 功能分类
                    exptype: { childNode:[], rootNode:[] }, // 支出类型
                    expecoTable: { childNode:[], rootNode:[] }, // 经济分类
                    bankOption: { childNode:[], rootNode:[] }, // 银行下拉
                    incomeTypeOptions: { childNode:[], rootNode:[] }, // 收入类型下拉
                    fundSourceOptions: { childNode:[], rootNode:[] }, // 资金来源下拉
                    cuIncomeTypeOptions: { childNode:[], rootNode:[] }, // 来款类型下拉
                },
                selectOptions: { // 下拉选择数据集合
                    cuIncomeType: [], // 来款类型
                    cuIncomeBudgetType: [], // 预算类型
                    cuIncomeBudgetAttribute: [] // 预算属性
                },
                uploadConfig: {
                    getUrl: '/pub/fileRef/getFileByParam', // 获取文件接口
                    uploadUrl: '/pub/fileRef/upload', // 上传接口
                    deleteUrl: '/pub/fileRef/deleteByParam', // 删除接口
                    downloadUrl: '/pub/fileRef/downloadByAttachGuid' // 下载
                },
                isShowError: false, // 是否显示错误提示
                bankCodeIsLeaf: true, // 银行信息是否是叶子节点
                treeData: [
                    { id: 1, pId: 0, value: '1', title: 'Expand to load' },
                    { id: 2, pId: 0, value: '2', title: 'Expand to load' },
                    { id: 3, pId: 0, value: '3', title: 'Tree Node', isLeaf: true },
                ],
            }
        },
        created() {
        },
        methods: {
            moment,
            // 新增初始化
            addInit() {
                this.billData = {
                    rgCode: this.pfData.svRgCode,
                    setYear: this.pfData.svSetYear,
                    arriveCashStatus: '0',
                    arriveCashStatusName: '未处理',
                    inputDate: this.pfData.svTransDate,
                    inputUser: this.pfData.svUserName,
                    bankCode: this.bankCode
                }
            },
            // 修改初始化, 获取详情
            updateInit() {
                this.$axios.get('/cu/inComeArriveCash/getIncomeArriveCashByGuid/' + this.billGuid)
                    .then(res => {
                        if (res.data.flag == 'success') {
                            this.billData = res.data.data;
                        } else {
                            this.$message.warning(res.data.msg);
                        }
                    })
                    .catch(error => {
                        this.$message.error(error)
                    })
            },
            // 保存
            save() {
                this.addOrUpdate();
            },
            // 保存并新增
            saveAndAdd() {
                this.addOrUpdate().then(res => {
                    if (res === 'success') {
                        this.status = 'add';
                        this.addInit();
                        this.isShowError = false;
                    }
                })
            },
            // 保存或者更新接口
            addOrUpdate() {
                this.isShowError = true;
                // this.$forceUpdate();
                const selectBank = this.treeOptions.bankOption.rootNode.find(i => i.value == this.billData.bankCode);

                if (this.billData.bankCode) {
                    // NHWHCWGXZX-378
                    if (selectBank&&selectBank.node.isLeaf != '1') {
                        this.bankCodeIsLeaf = false
                        return
                    } else {
                        this.bankCodeIsLeaf = true
                    }
                } else {
                    this.bankCodeIsLeaf = true
                }
                if (!this.billData.arriveCashCode || !this.billData.arriveCashDate || !this.billData.isFinance ||
                !this.billData.bankCode || !this.billData.payAgencyCode || !this.billData.arriveTypeCode ||
                !this.billData.incomeTypeCode || !this.billData.fundsourceCode || !this.billData.arriveCashMoney) {
                    return
                }
                return new Promise((resolve, reject)=>{
                    this.$axios.post('/cu/inComeArriveCash/saveIncomeArriveCash', this.billData)
                        .then(res => {
                            if (res.data.flag == 'success') {
                                this.billData = res.data.data;
                                this.status = 'update';
                                this.billGuid = this.billData.arriveCashGuid;
                                this.cardStatus = '0';
                                this.bankCode = this.billData.bankCode;
                                this.$message.success('保存成功！');
                                resolve('success');
                            } else {
                                this.$message.warning(res.data.msg);
                            }
                        })
                        .catch(error => {
                            this.$message.error(error)
                        })
                })
            },
             // 取消，返回列表页面
            cancel() {
               this.$router.go(-1);
                // this.$router.push({
                //     path:'/cu/bankPayment/bankPayment',  
                //     query: {
                //         menuid: "d4e5b4a8-5316-48ba-bce3-8d773974d8d0",
                //     }
                // })
            },
            // 发布
            release() {
                let params = {
                    arriveCashGuids: [this.billData.arriveCashGuid]
                };
                this.$axios.post('/cu/inComeArriveCash/releases', params)
                    .then(res => {
                        if (res.data.flag == 'success') {
                            this.$message.success('发布成功！');
                            this.cancel();
                        } else {
                            this.$message.warning(res.data.msg);
                        }
                    })
                    .catch(error => {
                        this.$message.error(error)
                    })
            },
            // 不发布
            unRelease() {
                let params = {
                    arriveCashGuids: [this.billData.arriveCashGuid]
                };
                this.$axios.post('/cu/inComeArriveCash/noReleases', params)
                    .then(res => {
                        if (res.data.flag == 'success') {
                            this.$message.success('不发布成功！');
                            this.cancel();
                        } else {
                            this.$message.warning(res.data.msg);
                        }
                    })
                    .catch(error => {
                        this.$message.error(error)
                    })
            },
            // 取消发布
            cancelReleases(msg) {
                let params = {
                    arriveCashGuids: [this.billData.arriveCashGuid]
                };
                this.$axios.post('/cu/inComeArriveCash/cancelReleases', params)
                    .then(res => {
                        if (res.data.flag == 'success') {
                            this.$message.success(msg);
                            this.cancel();
                        } else {
                            this.$message.warning(res.data.msg);
                        }
                    })
                    .catch(error => {
                        this.$message.error(error)
                    })
            },
            // 删除
            deleteBill() {
                let vm = this;
                this.$confirm({
                    title: '您确定删除该条数据吗?',
                    okText: '是',
                    okType: 'danger',
                    cancelText: '否',
                    onOk() {
                        let params = {
                            arriveCashGuids: [this.billData.arriveCashGuid]
                        };
                        vm.$axios.post('/cu/inComeArriveCash/deleteByArriveCashGuids', params)
                            .then(res => {
                                if (res.data.flag == 'success') {
                                    vm.cancel();
                                    vm.$message.success('删除成功！');
                                } else {
                                    this.$message.warning(res.data.msg);
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
            // 日期变化
            dateChange(date, dateString, key) {
                this.billData[key] = dateString;
                this.$forceUpdate();
            },
            // 单项发生变化
            itemChange(event, key) {
                if (key === 'bankCode') {
                    const selectBank = this.treeOptions.bankOption.rootNode.find(i => i.value == this.billData.bankCode);
                    if (this.billData.bankCode) {
                        if (selectBank.node.isLeaf != '1') {
                            this.bankCodeIsLeaf = false
                        } else {
                            this.bankCodeIsLeaf = true
                        }
                    } else {
                        this.bankCodeIsLeaf = true
                    }
                }
                // this.$forceUpdate();
            },
            // 日期默认值
            defaultDate(val) {
                let value;
                const dateFormat = 'YYYY-MM-DD';
                if (val) {
                    value = moment(val, dateFormat)
                } else {
                    value = null
                }
                return value
            },
            // 获取关联号
            getRelation(val) {
                const params = {
                    depproCode: val
                }
                this.$axios.get('/cu/commonUtil/getRelationByBudgetCode', {params: params})
                    .then(res => {
                        if (res.data.flag == 'success') {
                            this.billData.relation = res.data.data
                            this.$forceUpdate()
                        } else {
                            this.$message.warning(res.data.msg);
                        }
                    })
                    .catch(error => {
                        this.$message.error(error)
                    })
            },
            // 树懒加载
            onLoadData(treeNode) {
                return new Promise(resolve => {
                    const pId = treeNode.dataRef.id;
                    const dataKey = treeNode.dataRef.dataKey;
                    this.treeOptions[dataKey].rootNode = this.treeOptions[dataKey].rootNode.concat(common.getTreeNode(this.treeOptions[dataKey].childNode, pId));
                    resolve();
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
                            this.treeOptions.incomeTypeOptions = common.formatTreeData(data, 'parentCode','codeName', 'chrCode', 'incomeTypeOptions');
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
                            this.treeOptions.fundSourceOptions = common.formatTreeData(data, 'parentCode', 'codeName', 'chrCode', 'fundSourceOptions')
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
                            this.treeOptions.cuIncomeTypeOptions = common.formatTreeData(data, 'parentCode', 'codeName', 'chrCode', 'cuIncomeTypeOptions')
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
                            this.treeOptions.setMode = common.formatTreeData(data.SETMODE, 'pCode','codeName', 'code', 'setMode');
                            this.treeOptions.deppro = common.formatTreeData(data.DEPPRO, 'pCode','codeName', 'code', 'deppro');
                            this.treeOptions.expfunc = common.formatTreeData(data.EXPFUNC, 'pCode','codeName', 'code', 'expfunc');
                            this.treeOptions.exptype = common.formatTreeData(data.EXPTYPE, 'pCode','codeName', 'code', 'exptype');
                            this.treeOptions.expecoTable = common.formatTreeData(data.EXPECO, 'pCode','codeName', 'code', 'expecoTable');
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
                    enumCodes: 'CU_INCOME_BUDGET_TYPE,CU_INCOME_BUDGET_ATTRIBUTE',
                    agencyCode: this.pfData.svAgencyCode,
                };
                this.$axios.get('/cu/incomeCommon/selectEnumsList', {params: params})
                    .then(res => {
                        if (res.data.flag == 'success') {
                            const data = res.data.data;
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
            // 获取银行信息
            getBankOption() {
                const params = {
                    agencyCode: this.pfData.svAgencyCode
                }
                this.$axios.get('/cu/bank/selectByParam', {params: params})
                    .then(res => {
                        if (res.data.flag == 'success') {
                            const data = res.data.data;
                            this.treeOptions.bankOption = common.formatTreeData(data, 'parentCode','codeName', 'chrCode', 'bankOption');
                        }
                    })
                    .catch(error => {
                        this.$message.error(error)
                    })
            }
        },
        mounted() {
            this.status = this.$route.query.status;
            this.billGuid = this.$route.query.id;
            this.cardStatus = this.$route.query.cardStatus;
            this.bankCode = this.$route.query.bankCode;
            if (this.status === 'add') { // 新增
                this.addInit();
            } else if (this.status === 'update') { // 修改
                this.updateInit();
            }
            this.getIncomeType();
            this.getFundSource();
            this.getCuIncomeType();
            this.getTreeList();
            this.getOptionsList();
            this.getBankOption();
        },
        watch: {}
    }
</script>

<style scoped>

</style>
