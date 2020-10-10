<!--
表单组件
2019/11/11
@author huanghe
-->
<template>
    <div class="formContainer">
        <a-form class="formMain" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol"
                :form="form" @submit="handleSubmit">
            <ul class="clearfix" :class="className">
                <li v-for="(item, index) in itemsData" :key="index">
                    <a-form-item v-if="item.type=='hidden'" style="display: none">
                        <a-input
                            v-decorator="getDecorator(item)"
                        />
                    </a-form-item>
                    <a-form-item v-else :label='item.label' v-bind='formItemLayout'>
                        <span v-if="item.type==='text'">
                            <a-input
                                v-decorator="getDecorator(item)"
                                :placeholder="'请输入' + item.label"
                                :disabled="item.disabled === '1' ? true : false"
                                :class="item.disabled === '1' ? 'test' : ''"
                                @change="itemChange(item, $event)"
                            />
                        </span>
                        <span v-if="item.type==='int'">
                            <a-input-number
                                :min="item.min"
                                :max="item.max"
                                v-decorator="getDecorator(item)"
                                :placeholder="'请输入' + item.label"
                                :disabled="item.disabled === '1' ? true : false"
                                @change="itemChange(item, $event)"
                            />
                        </span>
                        <span v-if="item.type==='int4'">
                            <a-input-number
                                :min="item.min"
                                :max="item.max"
                                v-decorator="getDecorator(item)"
                                :formatter="value => `${value}`.replace(/^(.*\..{4}).*$/,'$1')"
                                :placeholder="'请输入' + item.label"
                                :disabled="item.disabled === '1' ? true : false"
                                @change="itemChange(item, $event)"
                            />
                        </span>
                        <span v-if="item.type==='money'">
                            <a-input-number
                                :min="item.min"
                                :max="item.max"
                                :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                                :parser="value => value.replace(/\$\s?|(,*)/g, '')"
                                v-decorator="getDecorator(item)"
                                :placeholder="'请输入' + item.label"
                                :disabled="item.disabled === '1' ? true : false"
                                @change="moneyChange($event,item);itemChange(item, $event)"
                            />
                        </span>
                        <span v-if="item.type==='select'">
                            <a-select
                                v-decorator="getDecoratorTwo(item)"
                                :disabled="item.disabled === '1' ? true : false"
                                :placeholder="'请选择'"
                                @change="selectChange($event, item);itemChange(item, $event)"
                                :allowClear="true"
                                :showSearch="item.showSearch?item.showSearch:false">
                                <a-select-option v-for="(option, index) in item.options"
                                                 :label="option.label"
                                                 :value="option.value"
                                                 :key="index">
                                    {{option.label}}
                                </a-select-option>
                            </a-select>
                        </span>
                        <span v-if="item.type==='time'">
                            <a-date-picker
                                v-decorator="getDecoratorTwo(item)"
                                :placeholder="'请选择' + item.label"
                                :disabledDate="disabledStartDate"
                                :disabled="item.disabled === '1' ? true : false"
                                @openChange="openChange($event, item)"
                                @change="(date, dateString) => timeChange(date, dateString, item)"/>
                        </span>
                        <span v-if="item.type === 'cascader'">
                            <a-cascader
                                :options="item.list"
                                v-decorator="getDecoratorTwo(item)"
                                :placeholder="'请选择' + item.label"
                                :disabled="item.disabled === '1' ? true : false"
                            @change="itemChange(item, $event)"/>
                        </span>
                        <span v-if="item.type === 'tree'">
                            <a-input-search
                                v-decorator="getDecorator(item)"
                                :placeholder="'请选择' + item.label"
                                @search="onSearch($event, item)"
                                :disabled="item.disabled === '1' ? true : false"
                                :class="item.disabled === '1' ? 'test' : ''"
                                @change="itemChange(item, $event)"
                            />
                        </span>
                    </a-form-item>
                </li>
            </ul>
            <!--<a-form-item class="buttonWapper">
                <a-button type="primary" html-type="submit">Submit</a-button>
                <a-button @click="reset">Reset</a-button>
            </a-form-item>-->
        </a-form>
    </div>
</template>
<script>
    import formRules from './zForm'
    import AFormItem from "ant-design-vue/es/form/FormItem";
    /*
    * formItem
    * label: 显示字段
    * key：字段key值和后台对应
    * type： item类型（text文本框，select下拉选择，cascader级联选择，int整数，time时间，money金额，tree弹框树，hidden隐藏）
    * isMust：是否必填，1必填
    * value：默认值
    * disabled：是否可编辑
    * options：下拉选项
    * ruleType：校验规则类型（phone：手机，email：邮箱，calculate：自定义规则）
    * ruleString：校验规则
    * */
    export default {
        components: {AFormItem},
        name: "z-form",
        props: {
            formItems: {
                type: Array
            },
            layout: {
                type: String,
                default: 'Horizontal'
            }
        },
        data() {
            return {
                form: this.$form.createForm(this),
                className: 'horizontal',
                formItemLayout: {
                    labelCol: {xs: {span: 24}, sm: {span: 5},},
                    wrapperCol: {xs: {span: 24}, sm: {span: 19},}
                },
                itemsData: this.formItems,
                pickerItem: {}, // 日期组件的item
                formData: []
            }
        },
        methods: {
            // 生成表单装饰器
            getDecorator(item) {
                const decorator = [
                    item.key,
                    {
                        validateTrigger: ['change', 'blur'],
                        initialValue: item.value,
                        validateFirst: true,
                        rules: this.getRules(item)
                    }
                ];
                return decorator;
            },
            getDecoratorTwo(item) { // 没有失去焦点的校验 适用打开窗口的校验，如下拉，日期选择
                const decorator = [
                    item.key,
                    {
                        validateTrigger: ['change'],
                        initialValue: item.value,
                        validateFirst: true,
                        rules: this.getRules(item)
                    }
                ];
                return decorator;
            },
            // 生成表单验证
            getRules(item) {
                let rules = [];
                rules = [
                    {required: item.isMust === '1' ? true : false, message: item.label + '是必填项！'},
                    {validator: this.formValidator}
                ];
                return rules;
            },
            // 自定义表单验证
            formValidator(rule, value, callback) {
                let formKey = rule.field;
                let formItem = this.formItems.find(i => i.key === formKey);
                const form = this.form;
                formRules.formatter(form, formItem, value, callback);
                callback();
            },
            moneyChange(value, item) { // 金钱值变化，根据公式动态变化对应的值
                this.$nextTick(() => {
                    let nowKey = item.key;
                    let rule = item.ruleString.find(i => i.exp.indexOf('=')).exp;
                    let reg = new RegExp(">");
                    if (rule.indexOf('>') !== -1) {
                        reg = new RegExp(">");
                    } else if (rule.indexOf('<') !== -1) {
                        reg = new RegExp("<");
                    }
                    rule = formRules.getArray(rule.replace(reg, ''));
                    let ruleResult = formRules.calculateIng(rule, this.form, item);
                    if (nowKey != rule[rule.length - 1]) {
                        this.form.setFieldsValue({[rule[rule.length - 1]]: ruleResult})
                    }
                    let otherKeys = rule.filter(i => i != nowKey && i.length > 2);
                    this.form.validateFields(otherKeys, {force: true}, (errors, values) => {
                    });
                })

            },
            // 日期组件打开的回调函数
            openChange(open, item) {
                if (open) {
                    this.pickerItem = item;
                } else {
                    this.pickerItem = {};
                }
            },
            timeChange(date, dateString, item) {
                this.$nextTick(() => {
                    if (dateString == '2019-08-05') {
                        // this.form.resetFields([item.name]);
                    }
                })
            },
            // 时间范围 返回false表示可以选择，true表示不可以选择
            disabledStartDate(value) {
                const item = this.pickerItem;
                let startTime;
                let entTime;
                if (item.startKey) {
                    startTime = this.form.getFieldValue(item.startKey);
                }
                if (item.entKey) {
                    entTime = this.form.getFieldValue(item.entKey);
                }
                if (!value) {
                    return false
                }
                if (!entTime) {
                    return startTime > value.valueOf();
                }
                if (!startTime) {
                    return value.valueOf() > entTime;
                }
                return startTime > value.valueOf() || value.valueOf() > entTime;
            },
            // 下拉选择值变化, 获取级联的下级选项
            selectChange(value, item) {
                let childList = [];
                if (item.childKey) {
                    childList = item.list.find(i => i.value === value).children;
                    this.itemsData.forEach(i => {
                        if (i.key === item.childKey) {
                            i['list'] = childList
                        }
                    })
                }
            },
            onSearch(value, item) {
                let parentItem;
                let parentValue;
                if (item.parentKey) {
                    parentItem = this.itemsData.find(i => i.key === item.parentKey);
                    parentValue = this.form.getFieldValue(item.parentKey);
                    if (!parentValue) {
                        this.$message.warning('请先输入' + parentItem.label);
                    }
                }
            },
            // formItem的值发生变化
            itemChange(item, value) {
                this.$emit('itemChange', item, value);
            },
            // 初始化表单初始值
            initFormValue(value) {
                this.itemsData.forEach(i => {
                    if (Object.keys(value).find(j => j == i.key)) {
                        this.form.setFieldsValue({[i.key]: value[i.key]})
                    }
                })
            },
            handleSubmit(e) { // 父组件调用 this.$refs[''].handleSubmit(event);
                e.preventDefault();
                this.$nextTick(() => {
                    this.form.validateFieldsAndScroll((err, values) => {
                        if (!err) {
                            this.formData = values;
                            this.$emit('submit', values);
                            // this.getArrayResult(values);
                        }
                    });
                });

            },
            reset() {
                this.form.resetFields();
            },
            getArrayResult(values) {
                this.formData = this.formItems;
                this.formData.forEach(item => {
                    item.value = values[item.key];
                });
                this.$emit('submit', this.formData);
            },
        },
        mounted() {
            if (this.layout == 'Horizontal') {
                this.className = 'horizontal';
                this.formItemLayout = {
                    labelCol: {xs: {span: 24}, sm: {span: 5},},
                    wrapperCol: {xs: {span: 24}, sm: {span: 19},}
                }
            } else if (this.layout == 'Inline') {
                this.className = 'inline';
                this.formItemLayout = {
                    labelCol: {xs: {span: 24}, sm: {span: 10},},
                    wrapperCol: {xs: {span: 24}, sm: {span: 14},}
                }
            }
        },
        watch: {
            formItems: {
                handler(newV) {
                    this.itemsData = newV
                    // this.$forceUpdate()
                },
                deep: true
            }
        }
    }
</script>

<style scoped>
    .formMain {
        /*padding: 24px;
        background: #fbfbfb;
        border: 1px solid #d9d9d9;
        border-radius: 6px;*/
    }

    .formMain .ant-form-item {
        display: flex;
        margin-bottom: 17px;
    }

    .formMain .ant-form-item-with-help {
        margin-bottom: 17px;
    }

    .formMain .ant-form-item-control-wrapper {
        flex: 1;
    }

    .formContainer ul.inline li {
        width: 50%;
        float: left;
    }

    .formContainer .ant-form {
        max-width: none;
    }

    .formContainer .search-result-list {
        margin-top: 16px;
        border: 1px dashed #e9e9e9;
        border-radius: 6px;
        background-color: #fafafa;
        min-height: 200px;
        text-align: center;
        padding-top: 80px;
    }

    .ant-input-number {
        width: 100%;
    }

    .ant-calendar-picker {
        width: 100%;
    }

    .buttonWapper button {
        margin-right: 10px;
    }
</style>
