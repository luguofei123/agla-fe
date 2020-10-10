<!--
查询条件组件
2019/11/07
@author huanghe
-->
<template>
    <a-form layout="inline" :form="form" @submit="handleSubmit" class="search-condition clearfix" 
            v-if="searchList.length">
        <div class="pull-left condition-container" ref="condition">
            <div :class="['pull-left', 'form-item', { hide: !showMoreContent && index >= 3 }]"
                 v-for="(item,index) in searchList" :key="item.id">
                <!-- 输入框 -->
                <a-form-item :label="item.name" v-if="item.type == 'text'">
                    <a-input :placeholder="`请输入${item.name}`" v-decorator="getDecorator(item)"
                             @change="itemChange($event, item.name)"></a-input>
                </a-form-item>
                <!--范围输入框-->
                <a-form-item :label="item.name" v-if="item.type == 'inputRange'">
                    <a-input-group compact>
                        <a-input class="inputRangeStart" placeholder="最小值"
                                 v-decorator="getDecorator(item, 'Start')" @change="itemChange($event, item.name)"/>
                        <a-input class="inputRangeLine" placeholder="~" disabled />
                        <a-input class="inputRangeEnd" placeholder="最大值"
                                 v-decorator="getDecorator(item, 'End')" @change="itemChange($event, item.name)"/>
                    </a-input-group>
                </a-form-item>
                <!-- 日期 -->
                <a-form-item :label="item.name" v-if="item.type == 'date'">
                    <a-date-picker v-decorator="getDecorator(item)" @change="itemChange($event, item.name)"/>
                </a-form-item>
                <!-- 开始——结束日期 -->
                <a-form-item :label="item.name" v-if="item.type == 'rangeDate'">
                    <a-range-picker v-decorator="getDecorator(item)" @change="itemChange($event, item.name)"/>
                </a-form-item>
                <!-- 选择框单选 -->
                <a-form-item :label="item.name" v-if="item.type == 'option'">
                    <a-select @change="itemChange($event, item.name)" v-decorator="getDecorator(item)"
                              :placeholder="`请选择${item.name}`" :allowClear="true">
                        <a-select-option v-for="option in item.options" :key="option.value" :value="option.value">
                            {{option.label}}
                        </a-select-option>
                    </a-select>
                </a-form-item>
                <!-- 选择框多选支持搜索 -->
                <a-form-item :label="item.name" v-if="item.type == 'multiple'">
                    <a-select @change="selectMultipleOption($event, item.name),itemChange($event, item.name)"
                              mode="multiple" :maxTagCount="2"
                              :placeholder="`请选择${item.name}`" v-decorator="getDecorator(item)"
                              optionFilterProp="children">
                        <a-select-option v-for="option in item.options" :key="option.value" :value="option.value">
                            {{option.label}}
                        </a-select-option>
                    </a-select>
                </a-form-item>
                <!--checkbox组类型-->
                <a-form-item :label="item.name" v-if="item.type == 'checkboxGroup'">
                    <a-checkbox-group
                            v-decorator="getDecorator(item)"
                            style="width: 100%; margin-top: 5px"
                    >
                        <a-row>
                            <a-col :span="8" v-for="(i, index) in item.checkbox" :key="index">
                                <a-checkbox :value="i.value">{{i.label}}</a-checkbox>
                            </a-col>
                        </a-row>
                    </a-checkbox-group>
                </a-form-item>
                <!--单选组-->
                <a-form-item :label="item.name" v-if="item.type == 'radioGroup'">
                    <a-radio-group v-decorator="getDecorator(item)" >
                        <template  v-for="(i, index) in item.radio">
                            <a-radio :value="i.value" :key="index">{{i.label}}</a-radio>
                        </template>
                    </a-radio-group>
                </a-form-item>
                <a-form-item :label="item.name" v-if="item.type == 'radioGroupButton'" >
                    <a-radio-group v-decorator="getDecorator(item)" button-style="solid" size="small">
                        <template  v-for="(i, index) in item.radio">
                            <a-radio-button :value="i.value" :key="index">{{i.label}}</a-radio-button>
                        </template>
                    </a-radio-group>
                </a-form-item>
                <a-form-item :label="item.name" v-if="item.type == 'tree'">
                    <a-tree-select
                            v-decorator="getDecorator(item)"
                            style="width: 100%"
                            :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
                            :tree-data="item.treeOptions"
                            :placeholder="`请选择${item.name}`"
                            allow-clear
                    >
                    </a-tree-select>
                </a-form-item>
            </div>
        </div>
        <div :class="[flClass, 'check-btn']">
            <a-form-item>
                <a-button type="primary" html-type="submit">查询</a-button>
            </a-form-item>
            <div class="fold" v-if="searchList.length > 3">
                <div class="span_btn" @click="hideMore" v-if="showMoreContent">
                    <span>收起</span>
                    <a-icon type="up"/>
                </div>
                <div v-else class="span_btn" @click="showMore">
                    <span>展开</span>
                    <a-icon type="down"/>
                </div>
            </div>
        </div>
    </a-form>
 
</template>

<script>
    export default {
        name: "searchContiton",
        data() {
            return {
                form: this.$form.createForm(this),
                rangeConfig: {
                    rules: [{type: 'array', required: true, message: 'Please select time!'}],
                },
                list: [],
                showMoreContent: false,
            }
        },
        props: {
            searchList: {
                type: Array,
                default() {
                    return []
                }
            },
            flClass: {
                type: String,
                default: 'pull-right'
            }
        },
        methods: {
            itemChange(val, name) {
                this.$emit('change', val, name)
            },
            // 切换单选选项
            selectOption(val, name) {
                this.$emit('change', val, name)
            },
            selectMultipleOption(val) {
                this.$emit('multiple', val)
            },
            // 生成表单装饰器
            getDecorator(item, suffix) {
                let formKey = item.key;
                if (suffix) {
                    formKey = item.key + suffix
                }
                const decorator = [
                    formKey,
                    {
                        initialValue: item.value,
                        rules: [{
                            required: item.required,
                            message: item.type == 'option' || item.type == 'multiple' ? `请选择${item.name}` : `请输入${item.name}`
                        }]
                    }
                ];
                return decorator;
            },
            handleSubmit(e) {
                e.preventDefault();
                let formData;
                this.form.validateFields((err, value) => {
                    if (!err) {
                        formData = value;
                        this.searchList.forEach(i => {
                            if (value[i.key]) {
                                if (i.type == 'date') {
                                    formData[i.key] = value[i.key].format('YYYY-MM-DD')
                                }
                                if (i.type == 'rangeDate') {
                                    if (value[i.key].length > 0) {
                                        formData[i.key + 'Start'] = value[i.key][0].format('YYYY-MM-DD');
                                        formData[i.key + 'End'] = value[i.key][1].format('YYYY-MM-DD');
                                    } else {
                                        formData[i.key + 'Start'] = '';
                                        formData[i.key + 'End'] = '';
                                    }
                                    delete formData[i.key];
                                }
                            }
                        });
                        this.$emit('submit', formData)
                    }
                });
            },
            getFormValues(callback) {
                let formData;
                setTimeout(() => {
                    this.form.validateFields((err, value) => {
                        if (!err) {
                            formData = value;
                            this.searchList.forEach(i => {
                                if (value[i.key]) {
                                    if (i.type == 'date') {
                                        formData[i.key] = value[i.key].format('YYYY-MM-DD')
                                    }
                                    if (i.type == 'rangeDate' && value[i.key].length > 0) {
                                        formData[i.key + 'Start'] = value[i.key][0].format('YYYY-MM-DD');
                                        formData[i.key + 'End'] = value[i.key][1].format('YYYY-MM-DD')
                                        delete formData[i.key];
                                    }
                                }
                            });
                            callback(formData)
                        }
                    });
                }, 0)
            },
            reset() {
                this.form.resetFields();
            },
            // 展开
            showMore() {
                this.showMoreContent = true;
                this.$nextTick(() => {
                    let conditionHeight = this.$refs.condition.offsetHeight;
                    this.$emit("myHeight", conditionHeight);
                });
            },
            // 收起
            hideMore() {
                this.showMoreContent = false;
                this.$nextTick(() => {
                    let conditionHeight = this.$refs.condition.offsetHeight;
                    this.$emit("myHeight", conditionHeight);
                });
            },
        },
        created() {

        },
        mounted() {

        },
        watch: {
            searchList:{
                handler(newVal) {
                    this.$forceUpdate()
                },
                deep: true
            }
        }
    };
</script>

<style scoped lang="less">
    .show {
        display: block;
    }

    .hide {
        display: none;
    }

    // 查询条件样式
    .search-condition {
        box-sizing: border-box;
        border-bottom: 1px solid #ccc;
        margin-bottom: 8px;
        display: flex;

        .condition-container {
            flex: 1;

            .form-item {
                width: 33%;
                margin-bottom: 12px;

                .ant-form-item {
                    width: 100%;
                    height: 32px;
                    display: flex;
                    box-sizing: border-box;
                    padding-right: 8px;

                    .ant-form-item-label {
                        width: 120px;
                        height: 32px;
                        line-height: 32px;
                    }

                    .ant-form-item-control-wrapper {
                        flex: 1;

                        .ant-form-item-control {
                            line-height: 32px;
                        }
                    }
                }
                .inputRangeStart {
                    border-right: 0;
                }
                .inputRangeEnd {
                    border-left: 0;
                }
            }
        }

        // 查询按钮
        .check-btn {
            width: 130px;
            height: 32px;
            display: flex;
            justify-content: flex-end;

            .ant-form-item {
                margin-right: 0;

                .ant-form-item-control {
                    line-height: 32px;
                }
            }

            .fold {
                height: 32px;
                line-height: 32px;
                margin-left: 4px;

                .span_btn {
                    color: #06f;
                    cursor: pointer;

                    span {
                        margin: 0 2px;
                    }
                }
            }
        }
    }
</style>
