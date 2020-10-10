// d开头是借方，c开头的是贷方，b开头的是余额
// bExRate-汇率 bQty-数量 bPrice-单价 bStadAmt-本币 bCurrAmt-外币
export const tableColumns = [
  {
    title: "资产分类名称",
    field: "assetName",
    minWidth: "10%",
    headerAlign: "center",
    align: "left",
    cellRender: { name: 'searchHighLight' },
    fixed:"left",
    slots: {
      default: ({ row }, h) => {
        if (row.levelNum &&　parseInt(row.levelNum)) {
          return [h(
            'span',
            {
              style: {
                marginLeft: (parseInt(row.levelNum) -1)*5 + 'px'
              }
            },
            row.assetName
          )]
        } else {
          return [
            <span>{row.assetName}</span>
          ]
        }
      }
    }
  },
  {
    title: "初期",
    align: "center",
    children: [
      {
        title: "原始",
        field: "vouYear",
        align: "center",
        children:[
          {
            title: "资产",
            field: "qcZcOriginal",
            headerAlign: "center",
            align: "right",
            minWidth: "10%",
            // filters: [{ data: { type: 'qcZcOriginal', minAmount: '', maxAmount: ''} }],
            // filterRender: { name: 'filterMoneyInput' },
            cellRender: { name: 'moneyHighLight' },
          },
          {
            title: "账务",
            field: "qcGlOriginal",
            headerAlign: "center",
            align: "right",
            minWidth: "10%",
            filterRender: { name: 'filterMoneyInput' },
            cellRender: { name: 'moneyHighLight' }, 
          }
        ]
      },
      {
        title: "一致",
        field: "qcOriginalFlag",
        align: "center",
        width: 60,
        cellRender: { name: 'searchHighLight' },
        slots: {
          default: ({ row }, h) => {
            if (row.qcOriginalFlag === true) {
              return [
                <span style="color:green">是</span>
              ]
            } else {
              return [
                <span style="color:red">否</span>
              ]
            }
          }
        }
      },
      {
        title: "折旧",
        field: "vouYear",
        align: "center",
        children:[
          {
            title: "资产",
            field: "qcZcDepreciation",
            align: "right",
            headerAlign: "center",
            minWidth: "10%",
            filterRender: { name: 'filterMoneyInput' },
            cellRender: { name: 'moneyHighLight' }, 
          },
          {
            title: "账务",
            field: "qcGlDepreciation",
            align: "right",
            headerAlign: "center",
            minWidth: "10%",
            filterRender: { name: 'filterMoneyInput' },
            cellRender: { name: 'moneyHighLight' }, 
          }
        ]
      },
      {
        title: "一致",
        field: "qcDepreciationFlag",
        align: "center",
        width: 60,
        cellRender: { name: 'searchHighLight' },
        slots: {
          default: ({ row }, h) => {
            if (row.qcDepreciationFlag === true) {
              return [
                <span style="color:green">是</span>
              ]
            } else {
              return [
                <span style="color:red">否</span>
              ]
            }
          }
        }
      },
    ]
  },
  {
    title: "本期增加",
    align: "center",
    children: [
      {
        title: "原始",
        field: "vouYear",
        align: "center",
        children:[
          {
            title: "资产",
            field: "bqzjZcOriginal",
            align: "right",
            headerAlign: "center",
            minWidth: "10%",
            filterRender: { name: 'filterMoneyInput' },
            cellRender: { name: 'moneyHighLight' }, 
          },
          {
            title: "账务",
            field: "bqzjGlOriginal",
            align: "right",
            headerAlign: "center",
            minWidth: "10%",
            filterRender: { name: 'filterMoneyInput' },
            cellRender: { name: 'moneyHighLight' }, 
          }
        ]
      },
      {
        title: "一致",
        field: "bqzjOriginalFlag",
        align: "center",
        width: 60,
        cellRender: { name: 'searchHighLight' },
        slots: {
          default: ({ row }, h) => {
            if (row.bqzjOriginalFlag === true) {
              return [
                <span style="color:green">是</span>
              ]
            } else {
              return [
                <span style="color:red">否</span>
              ]
            }
          }
        }
      },
      {
        title: "折旧",
        field: "vouYear",
        align: "center",
        children:[
          {
            title: "资产",
            field: "bqzjZcDepreciation",
            align: "right",
            headerAlign: "center",
            minWidth: "10%",
            filterRender: { name: 'filterMoneyInput' },
            cellRender: { name: 'moneyHighLight' }, 
          },
          {
            title: "账务",
            field: "bqzjGlDepreciation",
            align: "right",
            headerAlign: "center",
            minWidth: "10%",
            filterRender: { name: 'filterMoneyInput' },
            cellRender: { name: 'moneyHighLight' }, 
          }
        ]
      },
      {
        title: "一致",
        field: "bqzjDepreciationFlag",
        align: "center",
        width: 60,
        cellRender: { name: 'searchHighLight' },
        slots: {
          default: ({ row }, h) => {
            if (row.bqzjDepreciationFlag === true) {
              return [
                <span style="color:green">是</span>
              ]
            } else {
              return [
                <span style="color:red">否</span>
              ]
            }
          }
        }
      },
    ]
  },
  {
    title: "本期减少",
    align: "center",
    children: [
      {
        title: "原始",
        field: "vouYear",
        align: "center",
        children:[
          {
            title: "资产",
            field: "bqjsZcOriginal",
            align: "right",
            headerAlign: "center",
            minWidth: "10%",
            filterRender: { name: 'filterMoneyInput' },
            cellRender: { name: 'moneyHighLight' }, 
          },
          {
            title: "账务",
            field: "bqjsGlOriginal",
            align: "right",
            headerAlign: "center",
            minWidth: "10%",
            filterRender: { name: 'filterMoneyInput' },
            cellRender: { name: 'moneyHighLight' }, 
          }
        ]
      },
      {
        title: "一致",
        field: "bqjsOriginalFlag",
        align: "center",
        width: 60,
        cellRender: { name: 'searchHighLight' },
        slots: {
          default: ({ row }, h) => {
            if (row.bqjsOriginalFlag === true) {
              return [
                <span style="color:green">是</span>
              ]
            } else {
              return [
                <span style="color:red">否</span>
              ]
            }
          }
        }
      },
      {
        title: "折旧",
        field: "vouYear",
        align: "center",
        children:[
          {
            title: "资产",
            field: "bqjsZcDepreciation",
            align: "right",
            headerAlign: "center",
            minWidth: "10%",
            filterRender: { name: 'filterMoneyInput' },
            cellRender: { name: 'moneyHighLight' }, 
          },
          {
            title: "账务",
            field: "bqjsGlDepreciation",
            align: "right",
            headerAlign: "center",
            minWidth: "10%",
            filterRender: { name: 'filterMoneyInput' },
            cellRender: { name: 'moneyHighLight' }, 
          }
        ]
      },
      {
        title: "一致",
        field: "bqjsDepreciationFlag",
        align: "center",
        width: 60,
        cellRender: { name: 'searchHighLight' },
        slots: {
          default: ({ row }, h) => {
            if (row.bqjsDepreciationFlag === true) {
              return [
                <span style="color:green">是</span>
              ]
            } else {
              return [
                <span style="color:red">否</span>
              ]
            }
          }
        }
      },
    ]
  },
  {
    title: "期末余额",
    align: "center",
    children: [
      {
        title: "原始",
        field: "vouYear",
        align: "center",
        children:[
          {
            title: "资产",
            field: "qmZcOriginal",
            align: "right",
            headerAlign: "center",
            minWidth: "10%",
            filterRender: { name: 'filterMoneyInput' },
            cellRender: { name: 'moneyHighLight' }, 
          },
          {
            title: "账务",
            field: "qmGlOriginal",
            align: "right",
            headerAlign: "center",
            minWidth: "10%",
            filterRender: { name: 'filterMoneyInput' },
            cellRender: { name: 'moneyHighLight' }, 
          }
        ]
      },
      {
        title: "一致",
        field: "qmOriginalFlag",
        align: "center",
        width: 60,
        cellRender: { name: 'searchHighLight' },
        slots: {
          default: ({ row }, h) => {
            if (row.qmOriginalFlag === true) {
              return [
                <span style="color:green">是</span>
              ]
            } else {
              return [
                <span style="color:red">否</span>
              ]
            }
          }
        }
      },
      {
        title: "折旧",
        field: "vouYear",
        align: "center",
        children:[
          {
            title: "资产",
            field: "qmZcDepreciation",
            align: "right",
            headerAlign: "center",
            minWidth: "10%",
            filterRender: { name: 'filterMoneyInput' },
            cellRender: { name: 'moneyHighLight' }, 
          },
          {
            title: "账务",
            field: "qmGlDepreciation",
            align: "right",
            headerAlign: "center",
            minWidth: "10%",
            filterRender: { name: 'filterMoneyInput' },
            cellRender: { name: 'moneyHighLight' }, 
          }
        ]
      },
      {
        title: "一致",
        field: "qmDepreciationFlag",
        align: "center",
        width: 60,
        cellRender: { name: 'searchHighLight' },
        slots: {
          default: ({ row }, h) => {
            if (row.qmDepreciationFlag === true) {
              return [
                <span style="color:green">是</span>
              ]
            } else {
              return [
                <span style="color:red">否</span>
              ]
            }
          }
        }
      },
    ]
  },
]
