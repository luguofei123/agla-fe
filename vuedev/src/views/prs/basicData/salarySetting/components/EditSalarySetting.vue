<!--
 * @Author: sunch
 * @Date: 2020-06-05 14:18:22
 * @LastEditTime: 2020-08-12 14:10:18
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /agla-fe-8.50/vuedev/src/views/prs/basicData/salarySetting/components/editSalarySetting.vue
--> 
<template>
    <div>
        <uf-modal title="编辑工资项显示设置" v-model="editSettingVisible" @cancel="editSettingClose" :width="450">
            <div class="row">
                <div class="label">工资项目编码：</div>
                <div class="text">{{editData.row.pritemCode}}</div>
            </div>
            <div class="row">
                <div class="label">工资项目名称：</div>
                <div class="text">{{editData.row.pritemName}}</div>
            </div>
            <div class="row">
                <div class="label">工资项目性质：</div>
                <a-select allowClear v-model="editData.row.pritemProp" class="select" @change="pritemPropChange">
                    <a-select-option value="1">
                        应发项
                    </a-select-option>
                    <a-select-option value="2">
                        实发项
                    </a-select-option>
                    <a-select-option value="3">
                        扣发项
                    </a-select-option>
                    <a-select-option value="4">
                        补发项
                    </a-select-option>
                </a-select>
            </div>
            <div class="row">
                <div class="label">工资数据来源：</div>
                <a-select allowClear v-model="editData.row.pritemDataSource" class="select" @change="pritemDataSourceChange">
                    <a-select-option v-for="item in editData.prsValCoList" :key="item.valId" :value="item.valId">
                        {{item.val}}
                    </a-select-option>
                </a-select>
            </div>
            <div class="row">
                <div class="label">金额为0显示给个人：</div>
                <a-radio-group v-model="editData.row.isShowZero" button-style="solid"  size="small">
                    <a-radio-button value="Y">
                    是
                    </a-radio-button>
                    <a-radio-button value="N">
                    否
                    </a-radio-button>
                </a-radio-group>
            </div>
            <div class="row">
                <div class="label">个人端是否显示：</div>
                <a-radio-group v-model="editData.row.personDis" button-style="solid"  size="small">
                    <a-radio-button value="Y">
                    是
                    </a-radio-button>
                    <a-radio-button value="N">
                    否
                    </a-radio-button>
                </a-radio-group>
            </div>
            <div class="row">
                <div class="label">短信是否显示：</div>
                <a-radio-group v-model="editData.row.smsDis" button-style="solid"  size="small">
                    <a-radio-button value="Y">
                    是
                    </a-radio-button>
                    <a-radio-button value="N">
                    否
                    </a-radio-button>
                </a-radio-group>
            </div>

            <template slot="footer">
                <a-button key="save" class="mr-10" type="primary" @click="confirm">
                确定
                </a-button>
                <a-button key="cancel" @click="editSettingClose">
                关闭
                </a-button>
            </template>
        </uf-modal>
    </div>
</template>
<script>
export default {
    name: 'editSalarySetting',
    props: ['visible', 'editData'],
    data(){
        return {
            editSettingVisible: false
        }
    },
    watch: {
        visible(val){
            if(val){
                this.editSettingVisible = val
            }
        }
    },
    methods: {
        pritemPropChange(val, e){
            console.log(val)
            this.editData.row.pritemProp = val?val:''
        },
        pritemDataSourceChange(val, e){
            console.log(val)
            this.editData.row.pritemDataSource = val?val:''
        },
        confirm(){
            console.log(this.editData.row)
            this.$emit('editSettingConfirm', {row: this.editData.row, rowIndex: this.editData.rowIndex})
            this.editSettingVisible = false
        },
        editSettingClose(){
            this.editSettingVisible = false
            this.$emit('editSettingClose')
        }
    },
}
</script>
<style>
.row{
    display: flex;
    align-items: center;
    margin-bottom: 10px;
}
.label{
    width: 138px;
    font-size: 14px;
    color: #333;
}
.text{
    font-size: 14px;
    color: #333;
}
.select{
    width: 220px;
}
.ant-radio-group-small .ant-radio-button-wrapper{
    padding: 0 10px;
}
</style>