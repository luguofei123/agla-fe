window._close = function() {
	if(window.closeOwner) {
		var data = {
			action: 'ok'
		};
		window.closeOwner(data);
	}
}

var bExport = false;
$(function() {
	$('.export-tools li').attr("data-filename", window.ownerData.fileName);
	$('.export-tools li').attr("data-ignorecolumn", window.ownerData.ignoreColumn);
	var exportTable = window.ownerData.exportTable;
	//自定义
	var columns = window.ownerData.columns || [];
	var data = window.ownerData.data || [];
	if(columns.length > 0) {
		exportTable = uf.createTable({
			columns: columns,
			data: data
		});
		exportTable.find('td').css({'border': '1px solid #000'});
		exportTable.addClass('table-export').appendTo('body');
	}

	function showOverLay(msg) {
		$('.loading').html(msg);
		$('.uf-overlay,.loading').css('display', 'block');
	}

	function hideOverLay() {
		$('.uf-overlay,.loading').css('display', 'none');
	}

	$(".export-pdf").on("click", function(e) {
		e.preventDefault();
		if(bExport) return false;
		bExport = true;
		showOverLay('正在导出文件...');
		//var exportTable = $(this).data("table");
		var filename = $(this).data("filename");
		var ignoreColumn = $(this).data("ignorecolumn");
		$(exportTable).tableExport({
			fileName: filename,
			type: 'pdf',
			pdfmake: {
				enabled: true
			},
			callback: function() {
				_close();
			}
		});
	});
	$(".export-png").on("click", function(e) {
		e.preventDefault();
		if(bExport) return false;
		bExport = true;
		showOverLay('正在导出文件...');
		//var exportTable = $(this).data("table");
		var filename = $(this).data("filename");
		var ignoreColumn = $(this).data("ignorecolumn");
		$(exportTable).tableExport({
			fileName: filename,
			type: 'png',
			callback: function() {
				_close();
			}
			// escape: 'false',
			// ignoreColumn: '[' + ignoreColumn + ']'
		});
	});
	$(".export-excel").on("click", function(e) {
		e.preventDefault();
		if(bExport) return false;
		bExport = true;
		showOverLay('正在导出文件...');
		//var exportTable = $(this).data("table");
		var filename = $(this).data("filename");
		var ignoreColumn = $(this).data("ignorecolumn");
		$(exportTable).tableExport({
			fileName: filename,
			type: 'excel',
			escape: 'false',
			excelstyles: ['border-bottom', 'border-top', 'border-left', 'border-right'],
			ignoreColumn: '[' + ignoreColumn + ']'
		});
	});
	$(".export-xlsx").on("click", function(e) {
		e.preventDefault();
		if(bExport) return false;
		bExport = true;
		showOverLay('正在导出文件...');
		//var exportTable = $(this).data("table");
		var filename = $(this).data("filename");
		var ignoreColumn = $(this).data("ignorecolumn");
		$(exportTable).tableExport({
			fileName: filename,
			type: 'xlsx',
			escape: 'false',
			ignoreColumn: '[' + ignoreColumn + ']',
			callback: function() {
				_close();
			}
		});
	});
	$(".export-doc").on("click", function(e) {
		e.preventDefault();
		if(bExport) return false;
		bExport = true;
		showOverLay('正在导出文件...');
		//var exportTable = $(this).data("table");
		var filename = $(this).data("filename");
		var ignoreColumn = $(this).data("ignorecolumn");
		$(exportTable).tableExport({
			fileName: filename,
			type: 'doc',
			escape: 'false',
			ignoreColumn: '[' + ignoreColumn + ']',
			callback: function() {
				_close();
			}
		});
	});
	$(".export-powerpoint").on("click", function(e) {
		e.preventDefault();
		if(bExport) return false;
		bExport = true;
		showOverLay('正在导出文件...');
		//var exportTable = $(this).data("table");
		var filename = $(this).data("filename");
		var ignoreColumn = $(this).data("ignorecolumn");
		$(exportTable).tableExport({
			fileName: filename,
			type: 'powerpoint',
			escape: 'false',
			ignoreColumn: '[' + ignoreColumn + ']',
			callback: function() {
				_close();
			}
		});
	});
	$(".export-csv").on("click", function(e) {
		e.preventDefault();
		if(bExport) return false;
		bExport = true;
		showOverLay('正在导出文件...');
		//var exportTable = $(this).data("table");
		var filename = $(this).data("filename");
		var ignoreColumn = $(this).data("ignorecolumn");
		$(exportTable).tableExport({
			fileName: filename,
			type: 'csv',
			escape: 'false',
			ignoreColumn: '[' + ignoreColumn + ']',
			callback: function() {
				_close();
			}
		});
	});
	$(".export-tsv").on("click", function(e) {
		e.preventDefault();
		if(bExport) return false;
		bExport = true;
		showOverLay('正在导出文件...');
		//var exportTable = $(this).data("table");
		var filename = $(this).data("filename");
		var ignoreColumn = $(this).data("ignorecolumn");
		$(exportTable).tableExport({
			fileName: filename,
			type: 'tsv',
			escape: 'false',
			ignoreColumn: '[' + ignoreColumn + ']',
			callback: function() {
				_close();
			}
		});
	});
	$(".export-txt").on("click", function(e) {
		e.preventDefault();
		if(bExport) return false;
		bExport = true;
		showOverLay('正在导出文件...');
		//var exportTable = $(this).data("table");
		var filename = $(this).data("filename");
		var ignoreColumn = $(this).data("ignorecolumn");
		$(exportTable).tableExport({
			fileName: filename,
			type: 'txt',
			escape: 'false',
			ignoreColumn: '[' + ignoreColumn + ']',
			callback: function() {
				_close();
			}
		});
	});
	$(".export-xml").on("click", function(e) {
		e.preventDefault();
		if(bExport) return false;
		bExport = true;
		showOverLay('正在导出文件...');
		//var exportTable = $(this).data("table");
		var filename = $(this).data("filename");
		var ignoreColumn = $(this).data("ignorecolumn");
		$(exportTable).tableExport({
			fileName: filename,
			type: 'xml',
			escape: 'false',
			ignoreColumn: '[' + ignoreColumn + ']',
			callback: function() {
				_close();
			}
		});
	});
	$(".export-sql").on("click", function(e) {
		e.preventDefault();
		if(bExport) return false;
		bExport = true;
		showOverLay('正在导出文件...');
		//var exportTable = $(this).data("table");
		var filename = $(this).data("filename");
		var ignoreColumn = $(this).data("ignorecolumn");
		$(exportTable).tableExport({
			fileName: filename,
			type: 'sql',
			escape: 'false',
			ignoreColumn: '[' + ignoreColumn + ']',
			callback: function() {
				_close();
			}
		});
	});
	$(".export-json").on("click", function(e) {
		e.preventDefault();
		if(bExport) return false;
		bExport = true;
		showOverLay('正在导出文件...');
		//var exportTable = $(this).data("table");
		var filename = $(this).data("filename");
		var ignoreColumn = $(this).data("ignorecolumn");
		$(exportTable).tableExport({
			fileName: filename,
			type: 'json',
			escape: 'false',
			ignoreColumn: '[' + ignoreColumn + ']',
			callback: function() {
				_close();
			}
		});
	});
	$(window).load(function() {
		hideOverLay();
	});
});