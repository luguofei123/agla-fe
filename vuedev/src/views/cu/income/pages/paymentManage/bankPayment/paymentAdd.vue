<template>
    <div>
        <uf-modal class="paymentAddDialog" :visible="visible" title="来款增加" on-ok="handleOk" @cancel="handleCancel" width="900px"
                 style="top: 20px;">
            <template slot="footer">
                <a-button key="add" class="mr-10" @click="handleCancel">
                    增加
                </a-button>
                <a-button key="save" class="mr-10" @click="handleOk">
                    保存
                </a-button>
                <a-button key="back" class="mr-10" @click="handleOk">
                    取消
                </a-button>
                <a-button key="release" class="mr-10" >
                    发布
                </a-button>
                <a-button key="unRelease" class="mr-10" >
                    不发布
                </a-button>
                <a-button key="delete" >
                    删除
                </a-button>
            </template>
            <div class="formContainer">
                <div class="formTitle">来款信息</div>
                <ul class="formItemContainer">
                    <li class="formItem">
                        <label class="label">来款单号：</label>
                        <span class="value">
                            <a-input :placeholder="'请输入来款单号'"/>
                        </span>
                    </li>
                    <li class="formItem">
                        <label class="label">来款日期：</label>
                        <span class="value">
                            <a-date-picker />
                        </span>
                    </li>
                    <li class="formItem">
                        <label class="label">是否财政：</label>
                        <span class="value">
                            <a-select style="width: 100%" :placeholder="'请选择是否财政'">
                                <a-select-option value="1">是</a-select-option>
                                <a-select-option value="0">否</a-select-option>
                            </a-select>
                        </span>
                    </li>
                    <li class="formItem">
                        <label class="label">银行名称：</label>
                        <span class="value">
                            <a-input :placeholder="'请输入银行名称'"/>
                        </span>
                    </li>
                    <li class="formItem">
                        <label class="label">付款单位：</label>
                        <span class="value">
                            <a-input :placeholder="'请输入付款单位'"/>
                        </span>
                    </li>
                    <li class="formItem">
                        <label class="label">类型编号：</label>
                        <span class="value">
                            <a-input :placeholder="'请输入类型编号'"/>
                        </span>
                    </li>
                    <li class="formItem">
                        <label class="label">收入类型：</label>
                        <span class="value">
                            <a-select style="width: 100%" :placeholder="'请选择收入类型'">
                                <a-select-option value="1">是</a-select-option>
                                <a-select-option value="0">否</a-select-option>
                            </a-select>
                        </span>
                    </li>
                    <li class="formItem">
                        <label class="label">资金来源：</label>
                        <span class="value">
                            <a-select style="width: 100%" :placeholder="'请选择资金来源'">
                                <a-select-option value="1">是</a-select-option>
                                <a-select-option value="0">否</a-select-option>
                            </a-select>
                        </span>
                    </li>
                    <li class="formItem">
                        <label class="label">来款金额：</label>
                        <span class="value">
                            <a-input :placeholder="'请输入来款金额'"/>
                        </span>
                    </li>
                    <li class="formItem">
                        <label class="label">已认领金额：</label>
                        <span class="value">
                            <a-input :placeholder="'请输入已认领金额'"/>
                        </span>
                    </li>
                </ul>
                <div class="formTitle">银行信息</div>
                <ul class="formItemContainer">
                    <li class="formItem">
                        <label class="label">结算方式：</label>
                        <span class="value">
                            <a-select style="width: 100%" :placeholder="'请选择结算方式'">
                                <a-select-option value="1">是</a-select-option>
                                <a-select-option value="0">否</a-select-option>
                            </a-select>
                        </span>
                    </li>
                    <li class="formItem">
                        <label class="label">结算单号：</label>
                        <span class="value">
                            <a-input :placeholder="'请输入结算单号'"/>
                        </span>
                    </li>
                    <li class="formItem">
                        <label class="label">操作说明：</label>
                        <span class="value">
                            <a-input :placeholder="'请输入操作说明'"/>
                        </span>
                    </li>
                    <li class="formItem">
                        <label class="label">操作员：</label>
                        <span class="value">
                            <a-input :placeholder="'请输入操作员'"/>
                        </span>
                    </li>
                    <li class="formItem" style="width: 100%">
                        <label class="label">备注：</label>
                        <span class="value">
                            <a-input :placeholder="'请输入备注'"/>
                        </span>
                    </li>
                </ul>
                <div class="formTitle">国库信息</div>
                <ul class="formItemContainer">
                    <li class="formItem">
                        <label class="label">预算类型：</label>
                        <span class="value">
                            <a-select style="width: 100%" :placeholder="'请选择预算类型'">
                                <a-select-option value="1">是</a-select-option>
                                <a-select-option value="0">否</a-select-option>
                            </a-select>
                        </span>
                    </li>
                    <li class="formItem">
                        <label class="label">功能分类：</label>
                        <span class="value">
                            <a-select style="width: 100%" :placeholder="'请选择功能分类'">
                                <a-select-option value="1">是</a-select-option>
                                <a-select-option value="0">否</a-select-option>
                            </a-select>
                        </span>
                    </li>
                    <li class="formItem">
                        <label class="label">关联号：</label>
                        <span class="value">
                            <a-input :placeholder="'请输入关联号'"/>
                        </span>
                    </li>
                    <li class="formItem">
                        <label class="label">财政项目：</label>
                        <span class="value">
                            <a-select style="width: 100%" :placeholder="'请选择财政项目'">
                                <a-select-option value="1">是</a-select-option>
                                <a-select-option value="0">否</a-select-option>
                            </a-select>
                        </span>
                    </li>
                    <li class="formItem">
                        <label class="label">支出类型：</label>
                        <span class="value">
                            <a-select style="width: 100%" :placeholder="'请选择支出类型'">
                                <a-select-option value="1">是</a-select-option>
                                <a-select-option value="0">否</a-select-option>
                            </a-select>
                        </span>
                    </li>
                    <li class="formItem">
                        <label class="label">经济分类：</label>
                        <span class="value">
                            <a-select style="width: 100%" :placeholder="'请选择经济分类'">
                                <a-select-option value="1">是</a-select-option>
                                <a-select-option value="0">否</a-select-option>
                            </a-select>
                        </span>
                    </li>
                    <li class="formItem">
                        <label class="label">预算属性：</label>
                        <span class="value">
                            <a-input :placeholder="'请输入预算属性'"/>
                        </span>
                    </li>
                </ul>
                <div class="formTitle">凭证信息</div>
                <ul class="formItemContainer">
                    <li class="formItem">
                        <label class="label">凭证字号：</label>
                        <span class="value">
                            <a-input :placeholder="'请输入凭证字号'"/>
                        </span>
                    </li>
                    <li class="formItem">
                        <label class="label">往来号：</label>
                        <span class="value">
                            <a-input :placeholder="'请输入往来号'"/>
                        </span>
                    </li>
                </ul>
                <div class="formTitle">默认信息</div>
                <ul class="formItemContainer">
                    <li class="formItem">
                        <label class="label">来款状态 ：</label>
                        <span class="value">
                            未处理
                        </span>
                    </li>
                    <li class="formItem">
                        <label class="label">录入日期：</label>
                        <span class="value">
                            2020-4-1
                        </span>
                    </li>
                    <li class="formItem">
                        <label class="label">录入人：</label>
                        <span class="value">
                            张三
                        </span>
                    </li>
                </ul>
                <div class="formTitle">附件</div>
                <div class="uploadFiles">
                    <a-upload-dragger
                            name="file"
                            :multiple="true"
                            action=""
                            @change="handleChange"
                    >
                        <p class="ant-upload-drag-icon">
                            <a-icon type="inbox" />
                        </p>
                        <p class="ant-upload-text">
                            单击或拖动文件到此区域以上传
                        </p>
                    </a-upload-dragger>
                </div>
                <!--<ul class="formItemContainer uploadFiles">
                    <li class="formItem" style="width: 100%">
                        <label class="label">附件 ：</label>
                        <span class="value">

                        </span>
                    </li>
                </ul>-->
            </div>
        </uf-modal>
    </div>
</template>

<script>
    export default {
        name: "paymentAdd",
        props: {
            visible: {
                type: Boolean,
                default: false
            }
        },
        model: {
            prop: ['visible'],
            event: 'change'
        },
        components: {},
        data() {
            return {
                formItems: [],
                formData: {},
                fileList: [
                    {
                        uid: '-1',
                        name: 'xxx.png',
                        status: 'done',
                        url: 'http://www.baidu.com/xxx.png',
                    },
                ],
            }
        },
        created() {
        },
        methods: {
            handleCancel() {
                this.$emit('change', false);
            },
            handleOk() {

            },
            handleChange(info) {
                const status = info.file.status;
                if (status !== 'uploading') {
                    console.log(info.file, info.fileList);
                }
                if (status === 'done') {
                    this.$message.success(`${info.file.name} file uploaded successfully.`);
                } else if (status === 'error') {
                    this.$message.error(`${info.file.name} file upload failed.`);
                }
            },
        },
        mounted() {
            this.formItems = [
                [
                    {title: '来款单号', type: 'text', key: ''},
                ]
            ]
        },
        watch: {}
    }
</script>

<style lang="less">
    .paymentAddDialog .ant-modal-body {
        padding: 0;
    }
    .formContainer {
        height: 600px;
        overflow: auto;
        .formTitle {
            font-size: 15px;
            position: relative;
            margin: 0 10px;
            padding: 10px 15px;
            border-bottom: 1px solid #e8e8e8;
        }
        .formTitle:before {
            content: '';
            display: block;
            width: 3px;
            height: 20px;
            background-color: #06f;
            position: absolute;
            left: 0;
            top: 10px;
        }
        .line {
            border-bottom: 1px solid #e8e8e8;
        }
    }
    .formItemContainer {
        display: flex;
        flex-wrap: wrap;
        padding: 10px 10px 0 10px;
        .formItem {
            width: 33.33%;
            display: flex;
            margin-bottom: 10px;
            .label {
                width: 100px;
                text-align: right;
                line-height: 32px;
            }
            .value {
                flex: 1;
                line-height: 32px;
            }
        }
    }
    .uploadFiles {
        padding: 10px;
        .ant-upload.ant-upload-drag p.ant-upload-drag-icon {
            margin-bottom: 5px;
        }
        .ant-upload.ant-upload-drag p.ant-upload-drag-icon .anticon {
            font-size: 40px;
        }
    }
</style>
