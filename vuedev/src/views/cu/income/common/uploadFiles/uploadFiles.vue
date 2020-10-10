<template>
    <div class="uploadFilesContainer">
        <a-collapse :default-active-key="['uploadFiles']" :bordered="false">
            <a-collapse-panel key="uploadFiles" header="附件">
                <div class="uploadFiles">
                    <a-upload-dragger
                            name="file"
                            :multiple="true"
                            :action="uploadConfig.uploadUrl"
                            :data="fileUploadParams"
                            :file-list="fileList"
                            @change="fileChange"
                            :beforeUpload="beforeUpload"
                            :remove="deleteFiles"
                            @preview="downloadFile"
                    >
                       
                        <p class="ant-upload-drag-icon">
                            <a-icon type="inbox"/>
                        </p>
                        <p class="ant-upload-text">
                            单击或拖动文件到此区域以上传
                        </p>
                    </a-upload-dragger>
                </div>
            </a-collapse-panel>
        </a-collapse>
    </div>
</template>

<script>
    import { mapState } from 'vuex'
    export default {
        name: "uploadFiles",
        props: {
            sysId: String, // 系统id
            moduleId: String, // 模块id
            functionId: String, // 功能id
            billGuid: String, // 单据id
            uploadConfig: { // 上传配置
                getUrl: String, // 获取文件接口
                getParams: Object, // 获取参数
                uploadUrl: String, // 上传接口
                deleteParams: Object, // 删除参数
                downloadUrl: String
            }
        },
        components: {},
        computed: {
            ...mapState({
            pfData: (state) => state.pfData
            }),
        },
        data() {
            return {
                fileList: [], // 已经上传的文件
                fileUploadParams: {}, // 文件上传的参数
            }
        },
        created() {
        },
        methods: {
            // 获取上传文件列表
            getFilesList() {
                if (!this.billGuid) {
                    return
                }
                const params = {
                    agencyCode: this.pfData.svAgencyCode,
                    sysId: this.sysId,
                    moduleId: this.moduleId,
                    functionId: this.functionId,
                    billGuid: this.billGuid
                };
                this.$axios.get(this.uploadConfig.getUrl, {params: params})
                    .then(res => {
                        if (res.data.flag == 'success') {
                            const files = res.data.data;
                            this.fileList = [];
                            files.forEach(file => {
                                this.fileList.push({
                                    name: file.fileName,
                                    uid: file.attachGuid,
                                    status:'done',
                                    url:'#',
                                    ...file
                                })
                            });
                        } else {
                            this.$message.warning(res.data.msg);
                        }
                    })
                    .catch(error => {
                        this.$message.error(error)
                    })
            },
            // 上传之前
            beforeUpload(file, fileList) {
                this.fileUploadParams = {
                    agencyCode: this.pfData.svAgencyCode,
                    sysId: this.sysId,
                    moduleId: this.moduleId,
                    functionId: this.functionId,
                    billGuid: this.billGuid
                };
                if (this.billGuid) {
                    return true
                } else {
                    this.$message.warning('请先保存来款后在上传附件！');
                    return false
                }
            },
            // 删除附件
            deleteFiles(file) {
                
                const response = file.response;
                if (!response || response.status === 'success') {
                    const params = {
                        agencyCode: this.pfData.svAgencyCode,
                        sysId: this.sysId,
                        moduleId: this.moduleId,
                        functionId: this.functionId,
                        billGuid: this.billGuid,
                        attachGuids: file.attachGuid
                    };
                    return new Promise( (resolve, reject)=> {
                        this.$axios.post(this.uploadConfig.deleteUrl, params)
                            .then(res => {
                                if (res.data.flag == 'success') {
                                    this.$message.success('附件删除成功！');
                                    resolve(true)
                                } else {
                                    this.$message.warning(res.data.msg);
                                    resolve(false)
                                }
                            })
                            .catch(error => {
                                this.$message.error(error)
                                resolve(false)
                            })
                    })
                } else if (file.status === 'error') {
                    return true
                } else {
                    return false
                }
            },
            // 附件上传
            fileChange(info) {
                const status = info.file.status;
                const response = info.file.response;
                let fileList = [...info.fileList];
                if (status !== 'uploading') {
                    console.log(info.file, info.fileList);
                }
                if (status === 'done') {
                    if (response.flag === 'success') {
                        this.$message.success(`${info.file.name} 上传成功.`);
                        this.getFilesList();

                    } else {
                        this.$message.error(`${info.file.name} 上传失败.`);
                    }
                } else if (status === 'error') {
                    this.$message.error(`${info.file.name} 上传失败.`);
                }
                fileList = fileList.map(file => {
                    if (file.response) {
                        file.url = file.response.url;
                        if (file.response.flag !== 'success') {
                            file.status = 'error';
                        }
                    }
                    return file;
                });
                this.fileList = fileList;
            },
            downloadFile(file) {

                const params = {
                    agencyCode: this.pfData.svAgencyCode,
                    sysId: this.sysId,
                    moduleId: this.moduleId,
                    functionId: this.functionId,
                    billGuid: this.billGuid,
                    attachGuid: file.attachGuid
                };
                /*const downUrl = this.uploadConfig.downloadUrl + '?agencyCode=' + params.agencyCode + '&sysId=' + params.sysId +
                        '&moduleId=' + params.moduleId + '&functionId=' + params.functionId + '&billGuid=' + params.billGuid +
                        '&attachGuid=' + params.attachGuid;*/
                return new Promise( (resolve, reject)=> {
                    this.$axios.get(this.uploadConfig.downloadUrl, {params: params})
                        .then(res => {
                            if (res.status === 200) {
                                window.open(res.request.responseURL);
                                resolve(true)
                            } else {
                                this.$message.warning('文件下载失败！');
                                resolve(false)
                            }
                        })
                        .catch(error => {
                            this.$message.warning('文件下载失败！');
                            // this.$message.error(error);
                            resolve(false)
                        })
                })
            }
        },
        mounted() {
            if (this.billGuid) {
                this.getFilesList();
            }
        },
        watch: {
            billGuid: {
                handler(newV) {
                    this.getFilesList();
                },
            }
        }
    }
</script>

<style lang="less">
    .uploadFilesContainer {
        .ant-collapse-borderless > .ant-collapse-item {
            border-bottom: 0;
        }
        .ant-collapse > .ant-collapse-item > .ant-collapse-header {
            border-bottom: 1px solid #e8e8e8;
            font-size: 13px;
            font-weight: bold;
            padding-left: 10px;
        }
        .ant-collapse > .ant-collapse-item > .ant-collapse-header:before {
            content: '';
            display: block;
            width: 3px;
            height: 20px;
            background-color: #06f;
            position: absolute;
            left: 0;
            top: 12px;
        }
        .ant-collapse > .ant-collapse-item > .ant-collapse-header .anticon-right {
            text-align: right;
            right: 16px;
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
    }

</style>
