const imgsrc = require("../assets/imgs/images/emptyTable.png")
export const setEmptyRender = (VXETable) => { 
  VXETable.renderer.add('NoData', {
    // 空内容模板
    renderEmpty (h, renderOpts) {
      return [
        <span>
          <img src={imgsrc} style="width: 30%;" />
        </span>
      ]
    }
  })
}