// d开头是借方，c开头的是贷方，b开头的是余额
// bExRate-汇率 bQty-数量 bPrice-单价 bStadAmt-本币 bCurrAmt-外币
//三栏式
export const tableColumnsSANLAN = [
  {
    title: "日期",
    align: "center",
    children: [
      {
        title: "年",
        field: "vouYear",
        align: "center",
        width: 60,
        cellRender: { name: 'searchHighLight' },
      },
      {
        title: "月",
        field: "vouMonth",
        align: "center",
        width: 40,
        cellRender: { name: 'searchHighLight' },
      },
      {
        title: "日",
        field: "vouDay",
        align: "center",
        width: 40,
        cellRender: { name: 'searchHighLight' },
      }
    ]
  },
  {
    title: "凭证字号",
    field: "vouNo",
    minWidth: "10%",
    headerAlign: "center",
    align: "left",
    cellRender: { name: 'searchHighLight' },
  },
  {
    title: "摘要",
    field: "descpt",
    minWidth: "10%",
    headerAlign: "center",
    align: "left",
    filters: [{ data: "" }],
    filterRender: { name: "FilterInput", attrs: { placeholder: "请输入内容" } },
    cellRender: { name: 'searchHighLight' },
  },
  {
    title: "借方金额",
    field: "dStadAmt",
    minWidth: "10%",
    headerAlign: "center",
    align: "right",
    sortable: true,
    filters: [{ data: { type: 'dStadAmt', minAmount: '', maxAmount: ''} }],
    filterRender: { name: 'filterMoneyInput' },
    cellRender: { name: 'moneyHighLight' },
  },
  {
    title: "贷方金额",
    field: "cStadAmt",
    minWidth: "10%",
    headerAlign: "center",
    align: "right",
    sortable: true,
    filters: [{ data: { type: 'cStadAmt', minAmount: '', maxAmount: ''} }],
    filterRender: { name: 'filterMoneyInput' },
    cellRender: { name: 'moneyHighLight' },
  },
  {
    title: "方向",
    width: 80,
    field: "drCr",
    align: "center",
    sortable: true,
    cellRender: { name: 'searchHighLight' },
  },
  {
    title: "余额",
    field: "bStadAmt",
    minWidth: "10%",
    headerAlign: "center",
    align: "right",
    sortable: true,
    filters: [{ data: { type: 'bStadAmt', minAmount: '', maxAmount: ''} }],
    filterRender: { name: 'filterMoneyInput' },
    cellRender: { name: 'moneyHighLight' },
  }
]
//数量式
export const tableColumnsSHULIANG = [
  {
    title: "日期",
    align: "center",
    children: [
      {
        title: "年",
        width: 60,
        align: "center",
        field: "vouYear",
        cellRender: { name: 'searchHighLight' },
      },
      {
        title: "月",
        width: 40,
        align: "center",
        field: "vouMonth",
        cellRender: { name: 'searchHighLight' },
      },
      {
        title: "日",
        width: 40,
        align: "center",
        field: "vouDay",
        cellRender: { name: 'searchHighLight' },
      }
    ]
  },
  {
    title: "凭证字号",
    width: 150,
    align: "left",
    headerAlign: "center",
    field: "vouNo",
    cellRender: { name: 'searchHighLight' },
  },
  {
    title: "摘要",
    width: 150,
    align: "left",
    headerAlign: "center",
    field: "descpt",
    filters: [{ data: "" }],
    filterRender: { name: "FilterInput", attrs: { placeholder: "请输入内容" } },
    cellRender: { name: 'searchHighLight' },
  },
  {
    title: "借方金额",
    align: "center",
    children: [
      {
        title: "单价",
        align: "right",
        width: 150,
        headerAlign: "center",
        field: "dPrice",
        cellRender: { name: 'moneyHighLight' },
      },
      {
        title: "数量",
        align: "right",
        width: 150,
        headerAlign: "center",
        field: "dQty",
        cellRender: { name: 'searchHighLight' },
      },
      {
        title: "本币",
        align: "right",
        width: 150,
        headerAlign: "center",
        field: "dStadAmt",
        filters: [{ data: { type: 'dStadAmt', minAmount: '', maxAmount: ''} }],
        filterRender: { name: 'filterMoneyInput' },
        cellRender: { name: 'moneyHighLight' },
      }
    ]
  },
  {
    title: "贷方金额",
    align: "center",
    children: [
      {
        title: "单价",
        align: "right",
        width: 150,
        headerAlign: "center",
        field: "cPrice",
        cellRender: { name: 'moneyHighLight' },
      },
      {
        title: "数量",
        align: "right",
        width: 150,
        headerAlign: "center",
        field: "cQty",
        cellRender: { name: 'searchHighLight' },
      },
      {
        title: "本币",
        align: "right",
        width: 150,
        headerAlign: "center",
        field: "cStadAmt",
        filters: [{ data: { type: 'cStadAmt', minAmount: '', maxAmount: ''} }],
        filterRender: { name: 'filterMoneyInput' },
        cellRender: { name: 'moneyHighLight' },
      }
    ]
  },
  {
    title: "方向",
    width: 80,
    align: "center",
    field: "drCr",
    sortable: true,
    cellRender: { name: 'searchHighLight' },
  },
  {
    title: "余额",
    align: "center",
    children: [
      {
        title: "单价",
        align: "right",
        width: 150,
        headerAlign: "center",
        field: "bPrice",
        cellRender: { name: 'moneyHighLight' },
      },
      {
        title: "数量",
        align: "right",
        width: 150,
        headerAlign: "center",
        field: "bQty",
        cellRender: { name: 'searchHighLight' },
      },
      {
        title: "本币",
        align: "right",
        width: 150,
        headerAlign: "center",
        field: "bStadAmt",
        filters: [{ data: { type: 'bStadAmt', minAmount: '', maxAmount: ''} }],
        filterRender: { name: 'filterMoneyInput' },
        cellRender: { name: 'moneyHighLight' },
      }
    ]
  }
]
//外币式
export const tableColumnsWAIBI = [
  {
    title: "日期",
    align: "center",
    children: [
      {
        title: "年",
        width: 60,
        align: "center",
        field: "vouYear",
        cellRender: { name: 'searchHighLight' },
      },
      {
        title: "月",
        width: 40,
        align: "center",
        field: "vouMonth",
        cellRender: { name: 'searchHighLight' },
      },
      {
        title: "日",
        width: 40,
        align: "center",
        field: "vouDay",
        cellRender: { name: 'searchHighLight' },
      }
    ]
  },
  {
    title: "凭证字号",
    width: 150,
    align: "left",
    headerAlign: "center",
    field: "vouNo",
    cellRender: { name: 'searchHighLight' },
  },
  {
    title: "摘要",
    align: "left",
    width: 150,
    headerAlign: "center",
    field: "descpt",
    filters: [{ data: "" }],
    filterRender: { name: "FilterInput", attrs: { placeholder: "请输入内容" } },
    cellRender: { name: 'searchHighLight' },
  },
  {
    title: "借方金额",
    align: "center",
    children: [
      {
        title: "汇率",
        align: "right",
        width: 150,
        headerAlign: "center",
        field: "dExRate",
        cellRender: { name: 'searchHighLight' },
      },
      {
        title: "外币",
        align: "right",
        width: 150,
        headerAlign: "center",
        field: "dCurrAmt",
        filters: [{ data: { type: 'dCurrAmt', minAmount: '', maxAmount: ''} }],
        filterRender: { name: 'filterMoneyInput' },
        cellRender: { name: 'moneyHighLight' },
      },
      {
        title: "本币",
        align: "right",
        width: 150,
        headerAlign: "center",
        field: "dStadAmt",
        filters: [{ data: { type: 'dStadAmt', minAmount: '', maxAmount: ''} }],
        filterRender: { name: 'filterMoneyInput' },
        cellRender: { name: 'moneyHighLight' },
      }
    ]
  },
  {
    title: "贷方金额",
    align: "center",
    children: [
      {
        title: "汇率",
        align: "right",
        width: 150,
        headerAlign: "center",
        field: "cExRate",
        cellRender: { name: 'searchHighLight' },
      },
      {
        title: "外币",
        align: "right",
        width: 150,
        headerAlign: "center",
        field: "cCurrAmt",
        filters: [{ data: { type: 'cCurrAmt', minAmount: '', maxAmount: ''} }],
        filterRender: { name: 'filterMoneyInput' },
        cellRender: { name: 'moneyHighLight' },
      },
      {
        title: "本币",
        align: "right",
        width: 150,
        headerAlign: "center",
        field: "cStadAmt",
        filters: [{ data: { type: 'cStadAmt', minAmount: '', maxAmount: ''} }],
        filterRender: { name: 'filterMoneyInput' },
        cellRender: { name: 'moneyHighLight' },
      }
    ]
  },
  {
    title: "方向",
    align: "center",
    width: 80,
    field: "drCr",
    sortable: true,
    cellRender: { name: 'searchHighLight' },
  },
  {
    title: "余额",
    align: "center",
    children: [
      {
        title: "汇率",
        align: "right",
        width: 150,
        headerAlign: "center",
        field: "bExRate",
        cellRender: { name: 'searchHighLight' },
      },
      {
        title: "外币",
        align: "right",
        width: 150,
        headerAlign: "center",
        field: "bCurrAmt",
        filters: [{ data: { type: 'bCurrAmt', minAmount: '', maxAmount: ''} }],
        filterRender: { name: 'filterMoneyInput' },
        cellRender: { name: 'moneyHighLight' },
      },
      {
        title: "本币",
        align: "right",
        width: 150,
        headerAlign: "center",
        field: "bStadAmt",
        filters: [{ data: { type: 'bStadAmt', minAmount: '', maxAmount: ''} }],
        filterRender: { name: 'filterMoneyInput' },
        cellRender: { name: 'moneyHighLight' },
      }
    ]
  }
]
//数量外币式
export const tableColumnsSHULWAIB = [
  {
    title: "日期",
    align: "center",
    children: [
      {
        title: "年",
        width: 60,
        align: "center",
        field: "vouYear",
        cellRender: { name: 'searchHighLight' },
      },
      {
        title: "月",
        width: 40,
        align: "center",
        field: "vouMonth",
        cellRender: { name: 'searchHighLight' },
      },
      {
        title: "日",
        width: 40,
        align: "center",
        field: "vouDay",
        cellRender: { name: 'searchHighLight' },
      }
    ]
  },
  {
    title: "凭证字号",
    width: 150,
    align: "left",
    headerAlign: "center",
    field: "vouNo",
    cellRender: { name: 'searchHighLight' },
  },
  {
    title: "摘要",
    width: 150,
    align: "left",
    headerAlign: "center",
    field: "descpt",
    filters: [{ data: "" }],
    filterRender: { name: "FilterInput", attrs: { placeholder: "请输入内容" } },
    cellRender: { name: 'searchHighLight' },
  },
  {
    title: "借方金额",
    align: "center",
    children: [
      {
        title: "汇率",
        width: 150,
        align: "right",
        headerAlign: "center",
        field: "dExRate",
        cellRender: { name: 'searchHighLight' },
      },
      {
        title: "外币",
        width: 150,
        align: "right",
        headerAlign: "center",
        field: "dCurrAmt",
        filters: [{ data: { type: 'dCurrAmt', minAmount: '', maxAmount: ''} }],
        filterRender: { name: 'filterMoneyInput' },
        cellRender: { name: 'moneyHighLight' },
      },
      {
        title: "单价",
        width: 150,
        align: "right",
        headerAlign: "center",
        field: "dPrice",
        cellRender: { name: 'moneyHighLight' },
      },
      {
        title: "数量",
        width: 150,
        align: "right",
        headerAlign: "center",
        field: "dQty",
        cellRender: { name: 'searchHighLight' },
      },
      {
        title: "本币",
        width: 150,
        align: "right",
        headerAlign: "center",
        field: "dStadAmt",
        filters: [{ data: { type: 'dStadAmt', minAmount: '', maxAmount: ''} }],
        filterRender: { name: 'filterMoneyInput' },
        cellRender: { name: 'moneyHighLight' },
      }
    ]
  },
  {
    title: "贷方金额",
    align: "center",
    children: [
      {
        title: "汇率",
        width: 150,
        align: "right",
        headerAlign: "center",
        field: "cExRate",
        cellRender: { name: 'searchHighLight' },
      },
      {
        title: "外币",
        width: 150,
        align: "right",
        headerAlign: "center",
        field: "cCurrAmt",
        filters: [{ data: { type: 'cCurrAmt', minAmount: '', maxAmount: ''} }],
        filterRender: { name: 'filterMoneyInput' },
        cellRender: { name: 'moneyHighLight' },
      },
      {
        title: "单价",
        width: 150,
        align: "right",
        headerAlign: "center",
        field: "cPrice",
        cellRender: { name: 'moneyHighLight' },
      },
      {
        title: "数量",
        width: 150,
        align: "right",
        headerAlign: "center",
        field: "cQty",
        cellRender: { name: 'searchHighLight' },
      },
      {
        title: "本币",
        width: 150,
        align: "right",
        headerAlign: "center",
        field: "cStadAmt",
        filters: [{ data: { type: 'cStadAmt', minAmount: '', maxAmount: ''} }],
        filterRender: { name: 'filterMoneyInput' },
        cellRender: { name: 'moneyHighLight' },
      }
    ]
  },
  {
    title: "方向",
    align: "center",
    width: 80,
    field: "drCr",
    sortable: true,
    cellRender: { name: 'searchHighLight' },
  },
  {
    title: "余额",
    align: "center",
    children: [
      {
        title: "汇率",
        width: 150,
        align: "right",
        headerAlign: "center",
        field: "bExRate",
        cellRender: { name: 'searchHighLight' },
      },
      {
        title: "外币",
        width: 150,
        align: "right",
        headerAlign: "center",
        field: "bCurrAmt",
        filters: [{ data: { type: 'bCurrAmt', minAmount: '', maxAmount: ''} }],
        filterRender: { name: 'filterMoneyInput' },
        cellRender: { name: 'moneyHighLight' },
      },
      {
        title: "单价",
        width: 150,
        align: "right",
        headerAlign: "center",
        field: "bPrice",
        cellRender: { name: 'moneyHighLight' },
      },
      {
        title: "数量",
        width: 150,
        align: "right",
        headerAlign: "center",
        field: "bQty",
        cellRender: { name: 'searchHighLight' },
      },
      {
        title: "本币",
        width: 150,
        align: "right",
        headerAlign: "center",
        field: "bStadAmt",
        filters: [{ data: { type: 'bStadAmt', minAmount: '', maxAmount: ''} }],
        filterRender: { name: 'filterMoneyInput' },
        cellRender: { name: 'moneyHighLight' },
      }
    ]
  }
]
