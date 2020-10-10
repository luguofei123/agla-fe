// 解析render使用
export default {
  name: 'table-slot',
  functional: true,
  inject: ['tableRoot'],
  props: {
    row: Object,
    index: Number,
    column: {
      type: Object,
      default: null
    }
  },
  render: (h, ctx) => {
    // if (!ctx.props.column.customRender) return
    // console.log(ctx.props.column, '报错')
    return h('div', ctx.props.column.customRender({
      row: ctx.props.row,
      column: ctx.props.column,
      index: ctx.props.index
    }), [ctx.props.column.customRender({
      row: ctx.props.row,
      column: ctx.props.column,
      index: ctx.props.index
    }).children])
  }
}
