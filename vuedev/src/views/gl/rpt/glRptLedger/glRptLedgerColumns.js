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
        field: "fisPerd",
        align: "center",
        width: 60,
        cellRender: { name: 'searchHighLight' },
      }
    ]
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
    field: "drAmt",
    minWidth: "10%",
    headerAlign: "center",
    align: "right",
    sortable: true,
    filters: [{ data: { type: 'drAmt', minAmount: '', maxAmount: '' } }],
    filterRender: { name: 'filterMoneyInput' },
    cellRender: { name: 'moneyHighLight' },
  },
  {
    title: "贷方金额",
    field: "crAmt",
    minWidth: "10%",
    headerAlign: "center",
    align: "right",
    sortable: true,
    filters: [{ data: { type: 'crAmt', minAmount: '', maxAmount: '' } }],
    filterRender: { name: 'filterMoneyInput' },
    cellRender: { name: 'moneyHighLight' },
  },
  {
    title: "方向",
    width: 70,
    field: "balSign",
    align: "center",
    sortable: true,
    cellRender: { name: 'searchHighLight' },
  },
  {
    title: "余额",
    field: "balAmt",
    minWidth: "10%",
    headerAlign: "center",
    align: "right",
    sortable: true,
    filters: [{ data: { type: 'bStadAmt', minAmount: '', maxAmount: '' } }],
    filterRender: { name: 'filterMoneyInput' },
    cellRender: { name: 'moneyHighLight' },
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
        width: 60,
        align: "center",
        field: "fisPerd",
        cellRender: { name: 'searchHighLight' },
      }
    ]
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
      // {
      //   title: "汇率",
      //   align: "right",
      //   width: 150,
      //   headerAlign: "center",
      //   field: "dExRate",
      //   cellRender: { name: 'searchHighLight' },
      // },
      {
        title: "外币",
        align: "right",
        width: 150,
        headerAlign: "center",
        field: "curdrAmt",
        filters: [{ data: { type: 'curdrAmt', minAmount: '', maxAmount: '' } }],
        filterRender: { name: 'filterMoneyInput' },
        cellRender: { name: 'moneyHighLight' },
      },
      {
        title: "本币",
        align: "right",
        width: 150,
        headerAlign: "center",
        field: "drAmt",
        filters: [{ data: { type: 'drAmt', minAmount: '', maxAmount: '' } }],
        filterRender: { name: 'filterMoneyInput' },
        cellRender: { name: 'moneyHighLight' },
      }
    ]
  },
  {
    title: "贷方金额",
    align: "center",
    children: [
      // {
      //   title: "汇率",
      //   align: "right",
      //   width: 150,
      //   headerAlign: "center",
      //   field: "cExRate",
      //   cellRender: { name: 'searchHighLight' },
      // },
      {
        title: "外币",
        align: "right",
        width: 150,
        headerAlign: "center",
        field: "curcrAmt",
        filters: [{ data: { type: 'curcrAmt', minAmount: '', maxAmount: '' } }],
        filterRender: { name: 'filterMoneyInput' },
        cellRender: { name: 'moneyHighLight' },
      },
      {
        title: "本币",
        align: "right",
        width: 150,
        headerAlign: "center",
        field: "crAmt",
        filters: [{ data: { type: 'crAmt', minAmount: '', maxAmount: '' } }],
        filterRender: { name: 'filterMoneyInput' },
        cellRender: { name: 'moneyHighLight' },
      }
    ]
  },
  {
    title: "方向",
    align: "center",
    width: 70,
    field: "balSign",
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
        field: "curbalAmt",
        filters: [{ data: { type: 'curbalAmt', minAmount: '', maxAmount: '' } }],
        filterRender: { name: 'filterMoneyInput' },
        cellRender: { name: 'moneyHighLight' },
      },
      {
        title: "本币",
        align: "right",
        width: 150,
        headerAlign: "center",
        field: "balAmt",
        filters: [{ data: { type: 'balAmt', minAmount: '', maxAmount: '' } }],
        filterRender: { name: 'filterMoneyInput' },
        cellRender: { name: 'moneyHighLight' },
      }
    ]
  }
]
