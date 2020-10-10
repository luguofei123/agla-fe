<template>
    <div>
        <uf-modal class="paymentImportDialog" v-model="visible" title="来款导入" on-ok="handleOk" @cancel="handleCancel" width="900px"
                 style="top: 20px;">
            <template slot="footer">
                <a-button @click="importData" class="mr-10" type="primary">
                    导入
                </a-button>
                <a-button @click="handleCancel">
                    取消
                </a-button>
            </template>
            <div class="importFormContainer">
                <div class="importSetting">
                    <div class="importMain">
                        <ul class="formItemContainer">
                            <li class="formItem" style="width: 200px">
                                <a-radio-group name="radioGroup" v-model="importType">
<!--                                    <a-radio :value="'text'">文本文件</a-radio>-->
                                    <a-radio :value="'excel'">Excel</a-radio>
                                </a-radio-group>
                            </li>
                            <li class="formItem fileName">
                                <input id="importFile" style="display: none" type="file"
                                       accept=""
                                       @change="uploadFile($event.target.files, 'fileChange')"/>
                                <template v-if="importFile.name">
                                    <span>{{importFile.name}}</span>
                                    <a-icon class="deleteIcon" type="close" @click="removeFile"/>
                                </template>

                            </li>
                            <li class="formItem " style="width: 87px">
                                <a-button type="primary" @click="chooseFile">
                                    选择文件
                                </a-button>
                            </li>
                        </ul>
                    </div>
                    <div class="importMain" v-if="importType === 'text'">
                        <ul class="formItemContainer">
                            <li class="formItem">
                                <label class="label">导入方案：</label>
                                <span class="value">
                                    <a-select style="width: 100%" :placeholder="'请选择导入方案'" @change="importPlanChange"
                                              allowClear v-model="importPlanId">
                                        <template v-for="option in importTypeList">
                                            <a-select-option :value="option.impScheGuid" :key="option.impScheGuid">{{option.impScheName}}</a-select-option>
                                        </template>
                                    </a-select>
                                </span>
                            </li>
                            <li class="formItem">
                                <span class="value">
                                    <span style="margin-left: 10px">
                                    <a-button type="primary" @click="settingImport('text')">设置</a-button>
                                </span>
                                </span>
                            </li>
                            <li class="formItem">
                                <label class="label">起始行：</label>
                                <span class="value">
                                    <a-input :placeholder="'请输入起始行'"/>
                                </span>
                            </li>
                        </ul>
                    </div>
                    <div class="importMain" v-if="importType === 'excel'">
                        <ul class="formItemContainer">
                            <li class="formItem">
                                <label class="label">工作表：</label>
                                <span class="value">
                                    <a-select style="width: 100%" :placeholder="'请选择工作表'" @change="sheetChange" v-model="importPaymentData.sheetCode">
                                        <template v-for="option in fileBaseInfo">
                                            <a-select-option :value="option.sheetCode" :key="option.sheetCode">{{option.sheetName}}</a-select-option>
                                        </template>
                                    </a-select>
                                </span>
                            </li>
                            <li class="formItem">
                                <label class="label">起始行：</label>
                                <span class="value">
                                    <a-select style="width: 100%" :placeholder="'请选择起始行'" @change="rowChange" v-model="importPaymentData.startLine">
                                        <template v-for="option in rowOptions">
                                            <a-select-option :value="option.value" :key="option.value">{{option.label}}</a-select-option>
                                        </template>
                                    </a-select>
                                </span>
                            </li>
                            <li class="formItem">
                                <label class="label">结束行：</label>
                                <span class="value">
                                    <a-select style="width: 100%" :placeholder="'请选择结束行'" @change="rowChange" v-model="importPaymentData.endLine">
                                        <template v-for="option in rowOptions">
                                            <a-select-option :value="option.value" :key="option.value">{{option.label}}</a-select-option>
                                        </template>
                                    </a-select>
                                </span>
                            </li>
                            <li class="formItem">
                                <label class="label">导入方案：</label>
                                <span class="value">
                                    <a-select style="width: 100%" :placeholder="'请选择导入方案'" @change="importPlanChange"
                                              allowClear v-model="importPlanId">
                                        <template v-for="option in importTypeList">
                                            <a-select-option :value="option.impScheGuid" :key="option.impScheGuid">{{option.impScheName}}</a-select-option>
                                        </template>
                                    </a-select>
                                </span>
                            </li>
                            <li class="formItem">
                                <span class="value">
                                    <span style="margin-left: 10px">
                                    <a-button type="primary" @click="settingImport('excel')">设置</a-button>
                                </span>
                                </span>
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="fast-table">
                    <el-table border class="importRealtable" :class="{'empty-table':!importTableData || importTableData.length === 0}"
                              :data="importTableData" style="width: 100%">
                        <el-table-column prop="arriveCashCode" label="来款单号" width="120"/>
                        <el-table-column prop="arriveCashDate" label="来款日期" width="120"/>
                        <el-table-column prop="arriveCashMoney" label="来款金额" width="120"/>
                        <el-table-column prop="bankCode" label="银行账号" width="120"/>
                        <el-table-column prop="payAgencyCode" label="付款单位" width="120"/>
                        <el-table-column prop="incomeTypeCodeName" label="收入类型" width="120"/>
                        <el-table-column prop="fundsourceCodeName" label="资金来源" width="120"/>
                        <el-table-column prop="settleBillCode" label="结算单号" width="120"/>
                        <el-table-column prop="setBillCodeName" label="结算方式" width="120"/>
                        <el-table-column prop="isFinanceName" label="是否财政" width="120"/>
                        <el-table-column prop="descpt" label="摘要" width="120"/>
                        <el-table-column prop="remark" label="备注" width="120"/>
                    </el-table>
                </div>
            </div>
        </uf-modal>
        <uf-modal class="paymentImportDialog" :visible="settingImportVisible" title="设置导入模板" @cancel="settingHandleCancel" width="900px"
                 style="top: 20px;">
            <template slot="footer">
                <a-button @click="saveImportType" type="primary">
                    保存
                </a-button>
                <a-button @click="saveAsImportType">
                    另存为
                </a-button>
                <a-button @click="deleteImportType" v-if="importPlanId">
                    删除
                </a-button>
                <a-button @click="settingHandleCancel">
                    取消
                </a-button>
            </template>
            <div class="importFormContainer">
                <div class="importMain">
                    <ul class="formItemContainer">
                        <li class="formItem">
                            <label class="label">方案名称：</label>
                            <span class="value">
                                <a-input :placeholder="'请输入方案名称'" v-model="importTypeData.impScheName" :maxLength="30"/>
                            </span>
                        </li>
                    </ul>
                </div>
                <div class="importContent" v-if="importType === 'text'">
                    <div class="importMain">
                        <ul class="formItemContainer">
                            <li class="formItem">
                                <a-radio-group name="radioGroup" :default-value="1">
                                    <a-radio :value="1">按位置导入</a-radio>
                                    <a-radio :value="2">按分隔符导入</a-radio>
                                </a-radio-group>
                            </li>
                            <li class="formItem">
                                <label class="label">分隔符：</label>
                                <span class="value">
                                <a-input :placeholder="'请输入分隔符'"/>
                            </span>
                            </li>
                        </ul>
                    </div>
                    <div class="importMain">
                        <ul class="formItemContainer">
                            <li class="formItem">
                                <label class="label">汇款序号：</label>
                                <span class="value">
                                <a-input-group compact class="inputGroup">
                                    <a-input class="startValue"/>
                                    <span class="centerLine">至</span>
                                    <a-input class="endValue"/>
                                </a-input-group>
                            </span>
                            </li>
                            <li class="formItem">
                                <label class="label">来款日期：</label>
                                <span class="value">
                                <a-input-group compact class="inputGroup">
                                    <a-input class="startValue"/>
                                    <span class="centerLine">至</span>
                                    <a-input class="endValue"/>
                                </a-input-group>
                            </span>
                            </li>
                            <li class="formItem">
                                <label class="label">付款单位：</label>
                                <span class="value">
                                <a-input-group compact class="inputGroup">
                                    <a-input class="startValue"/>
                                    <span class="centerLine">至</span>
                                    <a-input class="endValue"/>
                                </a-input-group>
                            </span>
                            </li>
                            <li class="formItem">
                                <label class="label">摘要：</label>
                                <span class="value">
                                <a-input-group compact class="inputGroup">
                                    <a-input class="startValue"/>
                                    <span class="centerLine">至</span>
                                    <a-input class="endValue"/>
                                </a-input-group>
                            </span>
                            </li>
                            <li class="formItem">
                                <label class="label">类型编号：</label>
                                <span class="value">
                                <a-input-group compact class="inputGroup">
                                    <a-input class="startValue"/>
                                    <span class="centerLine">至</span>
                                    <a-input class="endValue"/>
                                </a-input-group>
                            </span>
                            </li>
                            <li class="formItem">
                                <label class="label">收入类型：</label>
                                <span class="value">
                                <a-input-group compact class="inputGroup">
                                    <a-input class="startValue"/>
                                    <span class="centerLine">至</span>
                                    <a-input class="endValue"/>
                                </a-input-group>
                            </span>
                            </li>
                            <li class="formItem">
                                <label class="label">资金来源：</label>
                                <span class="value">
                                <a-input-group compact class="inputGroup">
                                    <a-input class="startValue"/>
                                    <span class="centerLine">至</span>
                                    <a-input class="endValue"/>
                                </a-input-group>
                            </span>
                            </li>
                        </ul>
                    </div>
                    <div class="importMain">
                        <ul class="formItemContainer">
                            <li class="formItem">
                                <label class="label">结算方式：</label>
                                <span class="value">
                                <a-input-group compact class="inputGroup">
                                    <a-input class="startValue"/>
                                    <span class="centerLine">至</span>
                                    <a-input class="endValue"/>
                                </a-input-group>
                            </span>
                            </li>
                            <li class="formItem">
                                <label class="label">结算单号：</label>
                                <span class="value">
                                <a-input-group compact class="inputGroup">
                                    <a-input class="startValue"/>
                                    <span class="centerLine">至</span>
                                    <a-input class="endValue"/>
                                </a-input-group>
                            </span>
                            </li>
                            <li class="formItem">
                                <label class="label">备注：</label>
                                <span class="value">
                                <a-input-group compact class="inputGroup">
                                    <a-input class="startValue"/>
                                    <span class="centerLine">至</span>
                                    <a-input class="endValue"/>
                                </a-input-group>
                            </span>
                            </li>
                            <li class="formItem">
                                <label class="label">操作说明：</label>
                                <span class="value">
                                <a-input-group compact class="inputGroup">
                                    <a-input class="startValue"/>
                                    <span class="centerLine">至</span>
                                    <a-input class="endValue"/>
                                </a-input-group>
                            </span>
                            </li>
                            <li class="formItem">
                                <label class="label">操作员：</label>
                                <span class="value">
                                <a-input-group compact class="inputGroup">
                                    <a-input class="startValue"/>
                                    <span class="centerLine">至</span>
                                    <a-input class="endValue"/>
                                </a-input-group>
                            </span>
                            </li>
                        </ul>
                    </div>
                    <div class="importMain">
                        <ul class="formItemContainer">
                            <li class="formItem">
                                <label class="label">预算类型：</label>
                                <span class="value">
                                <a-input-group compact class="inputGroup">
                                    <a-input class="startValue"/>
                                    <span class="centerLine">至</span>
                                    <a-input class="endValue"/>
                                </a-input-group>
                            </span>
                            </li>
                            <li class="formItem">
                                <label class="label">类款项：</label>
                                <span class="value">
                                <a-input-group compact class="inputGroup">
                                    <a-input class="startValue"/>
                                    <span class="centerLine">至</span>
                                    <a-input class="endValue"/>
                                </a-input-group>
                            </span>
                            </li>
                            <li class="formItem">
                                <label class="label">关联号：</label>
                                <span class="value">
                                <a-input-group compact class="inputGroup">
                                    <a-input class="startValue"/>
                                    <span class="centerLine">至</span>
                                    <a-input class="endValue"/>
                                </a-input-group>
                            </span>
                            </li>
                            <li class="formItem">
                                <label class="label">财政项目：</label>
                                <span class="value">
                                <a-input-group compact class="inputGroup">
                                    <a-input class="startValue"/>
                                    <span class="centerLine">至</span>
                                    <a-input class="endValue"/>
                                </a-input-group>
                            </span>
                            </li>
                            <li class="formItem">
                                <label class="label">支出类型：</label>
                                <span class="value">
                                <a-input-group compact class="inputGroup">
                                    <a-input class="startValue"/>
                                    <span class="centerLine">至</span>
                                    <a-input class="endValue"/>
                                </a-input-group>
                            </span>
                            </li>
                            <li class="formItem">
                                <label class="label">经济分类：</label>
                                <span class="value">
                                <a-input-group compact class="inputGroup">
                                    <a-input class="startValue"/>
                                    <span class="centerLine">至</span>
                                    <a-input class="endValue"/>
                                </a-input-group>
                            </span>
                            </li>
                            <li class="formItem">
                                <label class="label">备注：</label>
                                <span class="value">
                                <a-input-group compact class="inputGroup">
                                    <a-input class="startValue"/>
                                    <span class="centerLine">至</span>
                                    <a-input class="endValue"/>
                                </a-input-group>
                            </span>
                            </li>
                            <li class="formItem">
                                <label class="label">说明：</label>
                                <span class="value">
                                <a-input-group compact class="inputGroup">
                                    <a-input class="startValue"/>
                                    <span class="centerLine">至</span>
                                    <a-input class="endValue"/>
                                </a-input-group>
                            </span>
                            </li>
                            <li class="formItem">
                                <label class="label">操作员：</label>
                                <span class="value">
                                <a-input-group compact class="inputGroup">
                                    <a-input class="startValue"/>
                                    <span class="centerLine">至</span>
                                    <a-input class="endValue"/>
                                </a-input-group>
                            </span>
                            </li>
                        </ul>
                    </div>
                    <div class="importMain">
                        <ul class="formItemContainer">
                            <li class="formItem" style="width: 100%">
                                <a-radio-group name="radioGroup" v-model="loanType">
                                    <a-radio :value="'loanDirection'">按借贷方向</a-radio>
                                    <a-radio :value="'money'">按金额</a-radio>
                                </a-radio-group>
                            </li>
                            <template v-if="loanType==='loanDirection'">
                                <li class="formItem">
                                    <label class="label">借贷方向：</label>
                                    <span class="value">
                                <a-input-group compact class="inputGroup">
                                    <a-input class="startValue"/>
                                    <span class="centerLine">至</span>
                                    <a-input class="endValue"/>
                                </a-input-group>
                            </span>
                                </li>
                                <li class="formItem">
                                    <label class="label">按金额：</label>
                                    <span class="value">
                                <a-input-group compact class="inputGroup">
                                    <a-input class="startValue"/>
                                    <span class="centerLine">至</span>
                                    <a-input class="endValue"/>
                                </a-input-group>
                            </span>
                                </li>
                            </template>
                            <template v-if="loanType==='money'">
                                <li class="formItem">
                                    <label class="label">借方金额：</label>
                                    <span class="value">
                                <a-input-group compact class="inputGroup">
                                    <a-input class="startValue"/>
                                    <span class="centerLine">至</span>
                                    <a-input class="endValue"/>
                                </a-input-group>
                            </span>
                                </li>
                                <li class="formItem">
                                    <label class="label">贷方金额：</label>
                                    <span class="value">
                                <a-input-group compact class="inputGroup">
                                    <a-input class="startValue"/>
                                    <span class="centerLine">至</span>
                                    <a-input class="endValue"/>
                                </a-input-group>
                            </span>
                                </li>
                            </template>

                        </ul>
                    </div>
                </div>
                <div class="importContent" v-if="importType === 'excel'">
                    <div class="fast-table">
                        <el-table border class="realtable" :class="{'empty-table':!tableData || tableData.length === 0}"
                                  :data="tableData" style="width: 100%">
                            <el-table-column type="index" label="序号" width="50" />
                            <el-table-column prop="documentItem" label="单据项" >
                                <!--<template slot-scope="scope">
                                    <a-select :placeholder="'请选择单据项'" v-model="scope.row.documentItem">
                                        <template v-for="option in documentItemOptions">
                                            <a-select-option  :key="option" :value="option">{{option}}</a-select-option>
                                        </template>
                                    </a-select>
                                </template>-->
                            </el-table-column>
                            <el-table-column
                                    prop="originalValue"
                                    label="Excel列">
                                <template slot-scope="scope">
                                    <a-select :placeholder="'请选择Excel列'" v-model="scope.row.excelCol" allowClear>
                                        <template v-for="option in excelOptions">
                                            <a-select-option  :key="option.value" :value="option.value">{{option.label}}</a-select-option>
                                        </template>
                                    </a-select>
                                </template>
                            </el-table-column>
                            <!--<el-table-column label="操作" width="100">
                                <template slot-scope="scope">
                                    <a-icon class="tableBut" type="plus-circle" @click="addRow(scope.$index, scope.row)"/>
                                    <a-icon class="tableBut" type="minus-circle" @click="deleteRow(scope.$index, scope.row)"/>
                                </template>
                            </el-table-column>-->
                        </el-table>
                    </div>
                    <div>
                        <!--<a-button type="primary" icon="plus-circle" @click="addRow('', '')">
                            增行
                        </a-button>-->
                    </div>
                    <!--<div class="importMain">
                        <ul class="formItemContainer">
                            <li class="formItem" style="width: 100%">
                                <a-radio-group name="radioGroup" v-model="loanType">
                                    <a-radio :value="'loanDirection'">按借贷方向</a-radio>
                                    <a-radio :value="'money'">按金额</a-radio>
                                </a-radio-group>
                            </li>
                            <template v-if="loanType==='loanDirection'">
                                <li class="formItem">
                                    <label class="label">借贷方向：</label>
                                    <span class="value">
                                    <a-input :placeholder="'请输入借贷方向'"/>
                                </span>
                                </li>
                                <li class="formItem">
                                    <label class="label">金额：</label>
                                    <span class="value">
                                    <a-input :placeholder="'请输入按金额'"/>
                                </span>
                                </li>
                            </template>
                            <template v-if="loanType==='money'">
                                <li class="formItem">
                                    <label class="label">借方金额：</label>
                                    <span class="value">
                                    <a-input :placeholder="'请输入借方金额'"/>
                                </span>
                                </li>
                                <li class="formItem">
                                    <label class="label">贷方金额：</label>
                                    <span class="value">
                                    <a-input :placeholder="'请输入贷方金额'"/>
                                </span>
                                </li>
                            </template>

                        </ul>
                    </div>-->
                </div>
            </div>
        </uf-modal>
    </div>
</template>

<script>
    import { mapState } from 'vuex'
    export default {
        name: "paymentImport",
        props: {
            visible: {
                type: Boolean,
                default: false
            },
            selectedTreeNode: Object // 左侧树节点
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
                importPaymentData: {}, // 来款导入弹框数据
                importType: 'excel', // 导入文件类型
                importFile: {}, // 选择的文件
                fileBaseInfo: [], // 文件sheet信息
                rowOptions: [], // 数据行下拉
                importTypeList: [], // 导入方案列表
                importPlanId: undefined, // 选择的导入方案
                importTypeData: {}, // 方案数据
                importTableData: [], // 导入数据预览
                settingImportVisible: false, // 设置导入模板
                loanType: 'loanDirection',
                tableData: [],
                documentItemOptions: [], // 单据项选择
                excelOptions: [] // excel列数组选择
            }
        },
        created() {
        },
        methods: {
            initDialogData() { // 每次打开弹框初始化数据
                this.importFile = {};
                this.importPaymentData = {
                    endLine: undefined,
                    sheetCode: undefined,
                    startLine: undefined,
                };
                // 初始化下拉
                this.rowOptions = [];
                if (this.importTypeList.length > 0) {
                    this.importPlanId = this.importTypeList[0].impScheGuid
                }
                this.importTableData = [];
            },
            handleCancel() {
                this.$emit('change', false);
            },
            // 选择文件
            chooseFile() {
                document.getElementById('importFile').click();
            },
            // 删除文件
            removeFile() {
                this.importFile = {}
            },
            // 上传文件,获取文件信息
            uploadFile(val, type) {
                let formData = new FormData();
                this.importFile = val[0];
                if (!this.importFile.name) {
                    return
                }
                document.getElementById('importFile').value = null;
                if (type !== 'fileChange') { // 文件变化不用选择的数据
                    if (this.importPaymentData.sheetCode) {
                        const selectedSheet = this.fileBaseInfo.find(i=>i.sheetCode === this.importPaymentData.sheetCode);
                        formData.append("sheetCode", this.importPaymentData.sheetCode);
                        formData.append("sheetName", selectedSheet.sheetName);
                    }
                    if (this.importPaymentData.startLine) {
                        formData.append("startLine", this.importPaymentData.startLine);
                    }
                    if (this.importPaymentData.endLine) {
                        formData.append("endLine", this.importPaymentData.endLine);
                    }
                }
                if (this.importPlanId) {
                    formData.append("impScheGuid", this.importPlanId);
                }
                formData.append("agencyCode", this.pfData.svAgencyCode);
                formData.append("file_data", this.importFile);

                let config = {
                    headers:{'Content-Type':'multipart/form-data'}
                }; //添加请求头
                this.$axios.post('/cu/inComeArriveCash/showIncomeArriveCashExcel', formData, config)
                    .then(res => {
                        if (res.data.flag == 'success') {
                            this.fileBaseInfo = res.data.data.fileBaseMsg;
                            this.importTableData = res.data.data.incomeArriveCash;
                            if (type === 'fileChange') { // 文件变化，初始化默认值
                                this.importPaymentData = {
                                    endLine: res.data.data.endLine,
                                    sheetCode: res.data.data.sheetCode,
                                    startLine: res.data.data.startLine,
                                };
                                // 初始化下拉
                                this.rowOptions = [];
                                for (let i = this.fileBaseInfo[0].minRow; i <= this.fileBaseInfo[0].maxRow; i++) {
                                    this.rowOptions.push({
                                        label: i, value: i
                                    })
                                }
                            }
                        } else {
                            this.$message.warning(res.data.msg);
                        }
                    })
                    .catch(error => {
                        this.$message.error(error)
                    })
            },
            // 工作表发生变化
            sheetChange(val) {
                const selectedSheet = this.fileBaseInfo.find(i=>i.sheetCode === this.importPaymentData.sheetCode);
                this.rowOptions = [];
                for (let i = selectedSheet.minRow; i <= selectedSheet.maxRow; i++) {
                    this.rowOptions.push({
                        label: i, value: i
                    })
                }
                this.uploadFile([this.importFile])
            },
            // 开始结束行发生变化
            rowChange() {
                this.uploadFile([this.importFile])
            },
            // 方案发生变化
            importPlanChange() {
                this.uploadFile([this.importFile])
            },
            // 导入
            importData() {
                let formData = new FormData();
                if (!this.importFile.name) {
                    return
                }
                if (this.importPaymentData.sheetCode) {
                    const selectedSheet = this.fileBaseInfo.find(i=>i.sheetCode === this.importPaymentData.sheetCode);
                    formData.append("sheetCode", this.importPaymentData.sheetCode);
                    formData.append("sheetName", selectedSheet.sheetName);
                }
                if (this.importPaymentData.startLine) {
                    formData.append("startLine", this.importPaymentData.startLine);
                }
                if (this.importPaymentData.endLine) {
                    formData.append("endLine", this.importPaymentData.endLine);
                }
                if (this.importPlanId) {
                    formData.append("impScheGuid", this.importPlanId);
                }
                formData.append("agencyCode", this.pfData.svAgencyCode);
                formData.append("file_data", this.importFile);

                let config = {
                    headers:{'Content-Type':'multipart/form-data'}
                }; //添加请求头
                this.$axios.post('/cu/inComeArriveCash/impIncomeArriveCashExcel', formData, config)
                    .then(res => {
                        if (res.data.flag == 'success') {
                            this.$message.success('导入数据成功！');
                        } else {
                            let msg = res.data.msg;
                            msg = msg.split('</br>');
                            const newMsg = []
                            const h = this.$createElement
                            for (const i in msg) {
                              newMsg.push(h('p', null, msg[i]))
                            }
                            // NHWHCWGXZX-377
                            this.$message.warning(newMsg);
                        }
                    })
                    .catch(error => {
                     
                        this.$message.error(error)
                    })
            },
            // 设置导入模板
            settingImport(type) {
                this.settingImportVisible = true;
                if (this.importPlanId) { // 选择了导入方案，修改，否则是保存
                    this.getImportTypeDetail();
                } else {
                    this.importTypeData = {};
                    this.tableData = [
                        {documentItem: '来款单号', excelCol: undefined, key: 'arriveCashCode'},
                        {documentItem: '来款日期', excelCol: undefined, key: 'arriveCashDate'},
                        {documentItem: '来款金额', excelCol: undefined, key: 'arriveCashMoney'},
                        {documentItem: '银行账号', excelCol: undefined, key: 'bankCode'},
                        {documentItem: '付款单位', excelCol: undefined, key: 'payAgencyCode'},
                        {documentItem: '来款类型', excelCol: undefined, key: 'arriveTypeCode'},
                        {documentItem: '收入类型', excelCol: undefined, key: 'incomeTypeCode'},
                        {documentItem: '资金来源', excelCol: undefined, key: 'fundsourceCode'},
                        {documentItem: '结算单号', excelCol: undefined, key: 'settleBillCode'},
                        {documentItem: '结算方式', excelCol: undefined, key: 'setmodeCode'},
                        {documentItem: '是否财政', excelCol: undefined, key: 'isFinance'},
                        {documentItem: '发布状态', excelCol: undefined, key: 'isReleased'},
                        {documentItem: '摘要', excelCol: undefined, key: 'descpt'},
                        {documentItem: '备注', excelCol: undefined, key: 'remark'},
                    ];
                }
            },
            // 关闭导入模板设置
            settingHandleCancel() {
                this.settingImportVisible = false;
            },
            // 增行
            addRow(index, row) {
                if (index.toString()) { // 行内增加
                    this.tableData.splice(index + 1, 0, {documentItem: '', excelCol: ''})
                } else { // 底部按钮增加
                    this.tableData.push({documentItem: '', excelCol: ''})
                }
            },
            // 删行
            deleteRow(index, row) {
                this.tableData.splice(index, 1)
            },
            // 获取导入方案列表
            getImportTypeList() {
                let impType = 1;
                if (this.importType === 'text') {
                    impType = 1;
                } else if (this.importType === 'excel') {
                    impType = 2;
                }
                let params = {
                    impType: impType,
                    agencyCode: this.pfData.svAgencyCode
                };
                this.$axios.get('/cu/inComeArriveCashImpSche/getImpSche', {params: params})
                    .then(res => {
                        if (res.data.flag == 'success') {
                            this.importTypeList = res.data.data;
                            if (this.importTypeList.length > 0) {
                                this.importPlanId = this.importTypeList[0].impScheGuid
                            }
                        } else {
                            this.$message.warning(res.data.msg);
                        }
                    })
                    .catch(error => {
                        this.$message.error(error)
                    })
            },
            // 获取导入模板详情
            getImportTypeDetail() {
                let params = {
                    impScheGuid: this.importPlanId,
                    agencyCode: this.pfData.svAgencyCode
                };
                this.$axios.get('/cu/inComeArriveCashImpSche/getImpScheByGuid', {params: params})
                    .then(res => {
                        if (res.data.flag == 'success') {
                            this.importTypeData = res.data.data;
                            this.tableData.forEach(item => {
                                item.excelCol = res.data.data[item.key]
                            })
                        } else {
                            this.$message.warning(res.data.msg);
                        }
                    })
                    .catch(error => {
                        this.$message.error(error)
                    })
            },
            // 保存模板
            saveImportType() {
                let params = this.importTypeData;
                if (!params.impScheName || params.impScheName === '') {
                    this.$message.warning('请填写方案名称！');
                }
                let impType = 1;
                if (this.importType === 'text') {
                    impType = 1;
                } else if (this.importType === 'excel') {
                    impType = 2;
                }
                params.bankCode = this.selectedTreeNode ? this.selectedTreeNode.chrCode : '';
                params.agencyCode = this.pfData.svAgencyCode;
                params.impType = impType;
                this.tableData.forEach(item => {
                    if (item.excelCol == undefined || item.excelCol == null) {
                        params[item.key] = ''
                    } else {
                        params[item.key] = item.excelCol
                    }
                });
                this.$axios.post('/cu/inComeArriveCashImpSche/saveImpSche', params)
                    .then(res => {
                        if (res.data.flag == 'success') {
                            this.$message.success('保存成功！');
                            this.getImportTypeList();
                            this.settingImportVisible = false;
                        } else {
                            this.$message.warning(res.data.msg);
                        }
                    })
                    .catch(error => {
                        this.$message.error(error)
                    })
            },
            // 另存为
            saveAsImportType() {
                delete this.importTypeData.impScheGuid;
                this.saveImportType();
            },
            // 删除模板
            deleteImportType() {
                let params = {
                    impScheGuid: this.importTypeData.impScheGuid
                };
                this.$axios.post('/cu/inComeArriveCashImpSche/saveImpSche', params)
                    .then(res => {
                        if (res.data.flag == 'success') {
                            this.$message.success('删除成功！');
                            this.getImportTypeList();
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
            this.tableData = [
                {documentItem: '来款单号', excelCol: undefined, key: 'arriveCashCode'},
                {documentItem: '来款日期', excelCol: undefined, key: 'arriveCashDate'},
                {documentItem: '来款金额', excelCol: undefined, key: 'arriveCashMoney'},
                {documentItem: '银行账号', excelCol: undefined, key: 'bankCode'},
                {documentItem: '付款单位', excelCol: undefined, key: 'payAgencyCode'},
                {documentItem: '来款类型', excelCol: undefined, key: 'arriveTypeCode'},
                {documentItem: '收入类型', excelCol: undefined, key: 'incomeTypeCode'},
                {documentItem: '资金来源', excelCol: undefined, key: 'fundsourceCode'},
                {documentItem: '结算单号', excelCol: undefined, key: 'settleBillCode'},
                {documentItem: '结算方式', excelCol: undefined, key: 'setmodeCode'},
                {documentItem: '是否财政', excelCol: undefined, key: 'isFinance'},
                {documentItem: '发布状态', excelCol: undefined, key: 'isReleased'},
                {documentItem: '摘要', excelCol: undefined, key: 'descpt'},
                {documentItem: '备注', excelCol: undefined, key: 'remark'},
            ];
            this.documentItemOptions = [
                {label: '来款单号', value: 'arriveCashCode'},
                {label: '来款日期', value: 'arriveCashDate'},
                {label: '来款金额', value: 'arriveCashMoney'},
                {label: '银行账号', value: 'bankCode'},
                {label: '付款单位', value: 'payAgencyCode'},
                {label: '来款类型', value: 'arriveTypeCode'},
                {label: '收入类型', value: 'incomeTypeCode'},
                {label: '资金来源', value: 'fundsourceCode'},
                {label: '结算单号', value: 'settleBillCode'},
                {label: '结算方式', value: 'setmodeCode'},
                {label: '是否财政', value: 'isFinance'},
                {label: '发布状态', value: 'isReleased'},
                {label: '摘要', value: 'descpt'},
                {label: '备注', value: 'remark'},
            ];
            this.excelOptions = [
                {label: 'A', value: 'A'},
                {label: 'B', value: 'B'},
                {label: 'C', value: 'C'},
                {label: 'D', value: 'D'},
                {label: 'E', value: 'E'},
                {label: 'F', value: 'F'},
                {label: 'G', value: 'G'},
                {label: 'H', value: 'H'},
                {label: 'I', value: 'I'},
                {label: 'J', value: 'J'},
                {label: 'K', value: 'K'},
                {label: 'L', value: 'L'},
                {label: 'M', value: 'M'},
                {label: 'N', value: 'N'},
                {label: 'O', value: 'O'},
                {label: 'P', value: 'P'},
                {label: 'Q', value: 'Q'},
                {label: 'R', value: 'R'},
                {label: 'S', value: 'S'},
                {label: 'T', value: 'T'},
                {label: 'U', value: 'U'},
                {label: 'V', value: 'V'},
                {label: 'W', value: 'W'},
                {label: 'X', value: 'X'},
                {label: 'Y', value: 'Y'},
                {label: 'Z', value: 'Z'}
            ];
            this.getImportTypeList();
        },
        watch: {
            visible(val) {
                if (val) {
                    this.initDialogData();
                }
            }
        }
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
    .importContent {
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
    .importFormContainer {
        .importSetting {
            /*padding-bottom: 10px;
            border-bottom: 1px solid #e8e8e8;*/
        }
        .importMain {
            border-bottom: 1px solid #e8e8e8;
            .inputGroup {
                display: flex;
                .startValue, .endValue  {
                    flex: 1;
                    .ant-input {
                        border-radius: 4px;
                    }
                }
                .centerLine {
                    width: 30px;
                    text-align: center;
                    line-height: 32px;
                }
            }
        }
    }
    .tableBut {
        cursor: pointer;
        margin-right: 10px;
        color: #1890ff;
    }
    .tableBut:hover {
        color: #096dd9;
    }
    .fileName {
        flex: 1;
        display: flex;
        justify-content : flex-end;
        padding-right: 20px;
        line-height: 32px;
        .deleteIcon {
            margin-left: 20px;
            line-height: 37px;
            &:hover {
                color: #096dd9;
                cursor: pointer;
            }
        }
    }
</style>
