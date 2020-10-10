$(function(){
	$.extend($.fn.dataTable.defaults, {
		language: {
			"decimal": "",
			"emptyTable": "表格数据为空",
			"info": "共 _TOTAL_ 行",
			"infoEmpty": "共 0 行",
			"infoFiltered": "(由 _MAX_ 项结果过滤)",
			"infoPostFix": "",
			"thousands": ",",
			"lengthMenu": "每页 _MENU_ 行",
			"loadingRecords": "载入中...",
			"processing": "正在获取数据，请稍候...",
			"search": "搜索:",
			"zeroRecords": "没有匹配结果",
			"paginate": {
				"first": "<i class='glyphicon icon-fast-backward'></i>",
				"previous": "<i class='glyphicon icon-angle-left'></i>",
				"next": "<i class='glyphicon icon-angle-right'></i>",
				"last": "<i class='glyphicon icon-fast-forward'></i>"
			},
			"aria": {
				"sortAscending": ": 以升序排列此列",
				"sortDescending": ": 以降序排列此列"
			}
		}
	});
});
