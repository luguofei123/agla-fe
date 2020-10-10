/*
 * @Author: sunch
 * @Date: 2020-07-22 12:56:38
 * @LastEditTime: 2020-07-22 19:41:03
 * @LastEditors: Please set LastEditors
 * @Description: 添加工资类别表格列
 * @FilePath: /agla-fe-8.50/vuedev/src/views/prs/basicData/empPrsType/components/addPrsTypeColumns.js
 */

export const defaultColumns = [
  { type: 'checkbox', showOverflow: false, showHeaderOverflow: false, headerAlign: 'center', align: 'center', width: 36 },
  { title: '序号', width: 50, headerAlign: 'center', align: 'center', type: 'seq' },
  {
    field: 'prtypeCode',
    title: '工资类别',
    headerAlign: 'center',
    align: 'center',
    minWidth: 100,
    editRender: {
      name: 'select',
      optionProps: { value: 'value', label: 'label', attrItems: 'attrItems' },
      options: []
    },
  },
  {
    field: 'bankAcc',
    title: '默认银行账号',
    headerAlign: 'center',
    align: 'center',
    minWidth: 200,
    editRender: {
      name: 'select',
      optionProps: { value: 'value', label: 'label', attrItems: 'attrItems' },
      options: []
    },
  },
  {
    field: 'bankAccName',
    title: '默认银行类别',
    headerAlign: 'center',
    align: 'center',
    minWidth: 120
  },
  {
    field: 'bankAccOther',
    title: '其他银行账号',
    headerAlign: 'center',
    align: 'center',
    minWidth: 200,
    editRender: {
      name: 'select',
      optionProps: { value: 'value', label: 'label', attrItems: 'attrItems' },
      options: [],
    },
  },
  {
    field: 'bankAccOtherName',
    title: '其他银行类别',
    headerAlign: 'center',
    align: 'center',
    minWidth: 120
  },
  {
    field: 'isStop',
    title: '是否停发',
    headerAlign: 'center',
    align: 'center',
    minWidth: 100,
    editRender: {
      name: 'select',
      options: [{label: '', value: ''},{label: '否', value: 'N'},{label: '是', value: 'Y'}],
    },
  },
  {
    field: 'bankfileStyle',
    title: '银行代发文件格式',
    headerAlign: 'center',
    align: 'center',
    minWidth: 140,
    editRender: {
      name: 'select',
      optionProps: { value: 'value', label: 'label', attrItems: 'attrItems' },
      options: [],
    },
  },
  {
    field: 'bankfileStyleOther',
    title: '其他银行代发文件格式',
    headerAlign: 'center',
    align: 'center',
    minWidth: 180,
    editRender: {
      name: 'select',
      optionProps: { value: 'value', label: 'label', attrItems: 'attrItems' },
      options: [],
    },
  },
]
