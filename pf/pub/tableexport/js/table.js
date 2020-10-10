
//为导出功能设置数据源
function setExportDataAttr() {
    $(".export-csv").attr("data-table","#testInfo");
    $(".export-tsv").attr("data-table","#testInfo");
    $(".export-pdf").attr("data-table","#testInfo");
    $(".export-png").attr("data-table","#testInfo");
    $(".export-excel").attr("data-table","#testInfo");
    $(".export-xlsx").attr("data-table","#testInfo");
	$(".export-xlsx").attr("data-ignoreColumn","3");
    $(".export-doc").attr("data-table","#testInfo");
    $(".export-powerpoint").attr("data-table","#testInfo");
    $(".export-txt").attr("data-table","#testInfo");
    $(".export-xml").attr("data-table","#testInfo");
    $(".export-sql").attr("data-table","#testInfo");
    $(".export-json").attr("data-table","#testInfo");

    $(".export-csv").attr("data-filename","导出测试");
    $(".export-tsv").attr("data-filename","导出测试");
    $(".export-pdf").attr("data-filename","导出测试");
    $(".export-png").attr("data-filename","导出测试");
    $(".export-excel").attr("data-filename","导出测试");
    $(".export-xlsx").attr("data-filename","导出测试");
    $(".export-doc").attr("data-filename","导出测试");
    $(".export-powerpoint").attr("data-filename","导出测试");
    $(".export-txt").attr("data-filename","导出测试");
    $(".export-xml").attr("data-filename","导出测试");
    $(".export-sql").attr("data-filename","导出测试");
    $(".export-json").attr("data-filename","导出测试");
};

setExportDataAttr();
