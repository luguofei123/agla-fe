$(function () {
	var page = function () {

		//检索数据的条件对象
		var searchObj = {
			agencyCode: "*",
			enable: "-1",
			chrName: "",
			contact: ""
		};

		//datatables变量
		var currentDataTable;
		//bug76381--zsj--若从凭证录入界面跳入此界面则此界面的单位默认为凭证录入界面的单位
		var prevAgencyCode = '';
		var sessionData = JSON.parse(window.sessionStorage.getItem("maobjData"))
		if (sessionData != undefined) {
			prevAgencyCode = sessionData.agencyCode;
			ufma.removeCache("maobjData");
		}
		var acctAlldata;
		var isOperate;
		return {
			namespace: 'current',
			//加载dataTables
			getCurrentList: function (url, pageNum, pageLen) {
				var argu = {};
				//由于  目前不适合做整个 界面逻辑的调整，所以先做这样的一个判断，9.30后会调整整个逻辑--zsj
				if (!$.isNull(url)) {
					//datable的id
					var id = "current-data";
					var toolBar = $('#' + id).attr('tool-bar');

					currentDataTable = $("#" + id).DataTable({
						"language": {
							"url": bootPath + "agla-trd/datatables/datatable.default.js"
						},
						"fixedHeader": {
							header: true
						},
						"ajax": url,
						"bFilter": true, //去掉搜索框
						"bLengthChange": true, //去掉每页显示多少条数据
						"processing": true, //显示正在加载中
						"pagingType": "full_numbers", //分页样式
						"lengthChange": true, //是否允许用户自定义显示数量p
						"lengthMenu": [
							[20, 50, 100, 200, -1],
							[20, 50, 100, 200, "全部"]
						],
						"pageLength": ufma.dtPageLength("#" + id),
						"bInfo": true, //页脚信息
						"bSort": false, //排序功能
						"bAutoWidth": false, //表格自定义宽度，和swidth一起用
						"bProcessing": true,
						"bDestroy": true,
						"columns": [{
							title: '<label class="mt-checkbox mt-checkbox-single mt-checkbox-outline">' +
								'<input type="checkbox" class="datatable-group-checkable"/>&nbsp;' +
								'<span></span>' +
								'</label>',
							width : 60,
							data: "chrId"
						},
						{
							title: "单位编码",
							width : 300,
							data: "chrCode"
						},
						{
							title: "单位名称",
							data: "chrName"
						},
						{
							title: "单位性质",
							width : 100,
							data: "companyKind"
						},
						{
							title: "联系人",
							data: "contact"
						},
						{
							title: "状态",
							data: "enabledName",
							width : 60
						},
						{
							title: "单位属性",
							width : 170,
							data: "attributeName"
						},
						{
							title: "操作",
							width : 100,
							data: ""
						}
						],
						"columnDefs": [{
							"defaultContent": "",
							"targets": "_all"
						},

						{
							"targets": [0],
							"serchable": false,
							"orderable": false,
							"className": "nowrap",
							"render": function (data, type, rowdata, meta) {
								return '<label class="mt-checkbox mt-checkbox-single mt-checkbox-outline"> ' +
									'<input type="checkbox" class="checkboxes" value="' + data + '" data-level="' + rowdata.levelNum + '" data-code="' + rowdata.chrCode + '"/>&nbsp; ' +
									'<span></span> ' +
									'</label>';
							}
						},
						{
							"targets": [1, 2, 3, 4, 5, 6],
							"className": "isprint"
						},
						{
							"targets": [2],
							"serchable": false,
							"orderable": false,
							"className": "nowrap",
							"render": function (data, type, rowdata, meta) {
								var textIndent = '0';
								if (rowdata.levelNum) {
									textIndent = (parseInt(rowdata.levelNum) - 1) + 'em';
								}
								var alldata = JSON.stringify(rowdata);
								return '<a class="common-jump-link" style="display:block;text-indent:' + textIndent + '" href="javascript:;" data-href=\'' + alldata + '\'>' + data + '</a>';
							}
						},
						{
							"targets": [3],
							"serchable": false,
							"orderable": false,
							"render": function (data, type, rowdata, meta) {
								switch (rowdata.companyKind) {
									case "1":
										return '行政单位';

									case "2":
										return '事业单位';

									case "3":
										return '企业';

									case "4":
										return '其他';

								}
							}
						},
						{
							"targets": [5],
							"render": function (data, type, rowdata, meta) {
								if (rowdata.enabled == 1) {
									return '<span style="color:#00A854">' + data + '</span>';
								} else {
									return '<span style="color:#F04134">' + data + '</span>';
								}
							}
						},
						{
							"targets": [-1],
							"serchable": false,
							"orderable": false,
							"className": "text-center nowrap btnGroup",
							"render": function (data, type, rowdata, meta) {
								var active = rowdata.enabled == 1 ? 'hidden' : 'hidden:false';
								var unactive = rowdata.enabled == 0 ? 'hidden' : 'hidden:false';
								var addlower = "";
								/*这里没看太明白
									* if ($('body').data("code")) {
									if (page.agencyCtrlLevel == "0201" || page.agencyCtrlLevel == "0202") {
										addlower = "";
									} else {
										addlower = 'hidden';
									}
								} else {
									addlower = 'hidden';
								}*/
								//单位级受控制方式控制，系统级不受约束
								if ($("#cbAgency").get(0)) {
									if (page.agencyCtrlLevel != '0101') {
										addlower = "";
									} else {
										addlower = 'hidden';
									}
								}
								if (isOperate == "1") {
									return '<a class="btn btn-icon-only btn-sm btn-permission btn-addlower" data-toggle="tooltip" ' + addlower + ' action= "addlower" rowid="' + rowdata.chrCode + '" title="增加下级" disabled><span class="glyphicon icon-add-subordinate"></span></a>' +
									'<a class="btn btn-icon-only btn-sm btn-permission btn-start"  data-toggle="tooltip" ' + active + ' action= "active" rowid="' + rowdata.chrCode + '" title="启用" disabled><span class="glyphicon icon-play"></span></a>' +
									'<a class="btn btn-icon-only btn-sm btn-permission btn-stop" data-toggle="tooltip" ' + unactive + ' action= "unactive" rowid="' + rowdata.chrCode + '" title="停用" disabled><span class="glyphicon icon-ban"></span></a>' +
									'<a class="btn btn-icon-only btn-sm btn-permission btn-delete"  title="删除"  rowid="' + rowdata.chrCode + '"  data-toggle="tooltip" ' + addlower + ' action= "delete" disabled ><span class="  glyphicon icon-trash"></span></a>';
								} else {
									return '<a class="btn btn-icon-only btn-sm btn-permission btn-addlower" data-toggle="tooltip" ' + addlower + ' action= "addlower" rowid="' + rowdata.chrCode + '" title="增加下级"><span class="glyphicon icon-add-subordinate"></span></a>' +
									'<a class="btn btn-icon-only btn-sm btn-permission btn-start"  data-toggle="tooltip" ' + active + ' action= "active" rowid="' + rowdata.chrCode + '" title="启用"><span class="glyphicon icon-play"></span></a>' +
									'<a class="btn btn-icon-only btn-sm btn-permission btn-stop" data-toggle="tooltip" ' + unactive + ' action= "unactive" rowid="' + rowdata.chrCode + '" title="停用"><span class="glyphicon icon-ban"></span></a>' +
									'<a class="btn btn-icon-only btn-sm btn-permission btn-delete"  title="删除"  rowid="' + rowdata.chrCode + '"  data-toggle="tooltip" ' + addlower + ' action= "delete" ><span class="  glyphicon icon-trash"></span></a>';
								}
							}
						}
						],
						"dom": '<"printButtons"B>rt<"' + id + '-paginate"ilp>',
						buttons: [{
							extend: 'print',
							text: '<i class="glyphicon icon-print" aria-hidden="true"></i>',
							exportOptions: {
								columns: '.isprint'
							},
							customize: function (win) {
								$(win.document.body).find('h1').css("text-align", "center");
								$(win.document.body).css("height", "auto");
							}
						},
						{
							extend: 'excelHtml5',
							text: '<i class="glyphicon icon-upload" aria-hidden="true"></i>',
							exportOptions: {
								columns: '.isprint'
							},
							customize: function (xlsx) {
								var sheet = xlsx.xl.worksheets['sheet1.xml'];
							}
						}
						],
						"initComplete": function (settings, json) {
							if ($('body').attr("data-code")) {
								if (page.agencyCtrlLevel != '0101') {
									$('#delete').removeClass('hidden')
								} else {
									$('#delete').addClass('hidden')
								}
							}
							$("#printTableData").html("");
							$("#printTableData").append($(".printButtons"));

							$("#printTableData .buttons-print").addClass("btn-print btn-permission").attr({
								"data-toggle": "tooltip",
								"title": "打印"
							});
							$("#printTableData .buttons-excel").addClass("btn-export btn-permission").attr({
								"data-toggle": "tooltip",
								"title": "导出"
							});
							//导出begin
							$("#printTableData .buttons-excel").off().on('click', function (evt) {
								evt = evt || window.event;
								evt.preventDefault();
								ufma.expXLSForDatatable($('#' + id), '往来单位');
							});
							//导出end                        
							$('#printTableData.btn-group').css("position", "inherit");
							$('#printTableData div.dt-buttons').css("position", "inherit");
							$('#printTableData [data-toggle="tooltip"]').tooltip();
							ufma.isShow(page.reslist);
							var $info = $(toolBar + ' .info');
							if ($info.length == 0) {
								$info = $('<div class="info"></div>').appendTo($(toolBar + ' .tool-bar-body'));
							}
							$info.html('');
							$('.' + id + '-paginate').appendTo($info);

							if (pageLen != "" && typeof (pageLen) != "undefined") {
								$('#' + id).DataTable().page.len(pageLen).draw(false);
								if (pageNum != "" && typeof (pageNum) != "undefined") {
									$('#' + id).DataTable().page(parseInt(pageNum) - 1).draw(false);
								}
							}
							//checkbox的全选操作
							$(".datatable-group-checkable").on("change", function () {
								var isCorrect = $(this).is(":checked");
								$("#" + id + " .checkboxes").each(function () {
									isCorrect ? $(this).prop("checked", !0) : $(this).prop("checked", !1);
									isCorrect ? $(this).closest("tr").addClass("selected") : $(this).closest("tr").removeClass("selected");
								})
								$(".datatable-group-checkable").prop("checked", isCorrect);
							});
							// ufma.setBarPos($(window));
							// $('#current-data').closest('.dataTables_wrapper').ufScrollBar({
							// 	hScrollbar: true,
							// 	mousewheel: false
							// });
							//固定表头
							// $("#current-data").fixedTableHead();
							$("#current-data").tblcolResizable();
							//固定表头
							$("#current-data").fixedTableHead($("#outDiv"));
						},
						"drawCallback": function (settings) {
							// var topHeight = $('.workspace-top').height();
							// var centerHeight = $('.workspace-center').height();
							// var tableHeight = $('#current-data').height();
							// var toolBarHeight = topHeight + centerHeight - 3;
							// $("#current-tool-bar").css({
							// 	"position": "absolute",
							// 	"top": toolBarHeight + "px"
							// });
							// ufma.setBarPos($(window));
							ufma.isShow(page.reslist);

							$('#' + id).find("td.dataTables_empty").text("")
								.append('<img src="' + bootPath + 'images/noData.png"/><br/><i>目前还没有你要查询的数据</i>');

							//操作按钮显示tips
							$('#' + id + ' .btn[data-toggle="tooltip"]').tooltip();

							//根据级次进行名称缩进
							$("td input.checkboxes").each(function (n) {
								var level_num = $(this).closest("tr").find("td input.checkboxes").data("level");
								switch (level_num) {
									case 1:
										break;
									case 2:
										$(this).closest("tr").find("td.current-subject").css("padding-left", "18px");
										break;
									case 3:
										$(this).parents("tr").find("td.current-subject").css("padding-left", "34px");
										break;
									case 4:
										$(this).parent("label").parent("td").parent("tr").find("td.current-subject").css("padding-left", "48px");
										break;
									default:
										break;
								}
							});
							$('#' + id + ' .btn').on('click', function () {
								page._self = $(this);

							});
							$('#' + id + ' .btn-delete').ufTooltip({
								content: '您确定删除当前往来单位吗？',
								onYes: function () {
									ufma.showloading('数据删除中，请耐心等待...');
									page.pageNum = $('.current-data-paginate').find('span a.paginate_button.current').text();
									page.pageLen = parseInt($('#current-data_length').find('select').val());
									page.delRowOne($(page._self).attr('action'), [$(page._self).attr('rowid')], $(page._self).closest('tr'));
									page.getCurrentList(url, page.pageNum, page.pageLen);

								},

								onNo: function () { }
								/*   //暂定 以后优化
								           window.location.reload()*/
							});
							$('#' + id + ' .btn-start').ufTooltip({
								content: '您确定启用当前往来单位吗？',
								onYes: function () {
									ufma.showloading('数据启用中，请耐心等待...');
									page.delRowOne($(page._self).attr('action'), [$(page._self).attr('rowid')], $(page._self).closest('tr'));
								},
								onNo: function () { }
							});
							$('#' + id + ' .btn-stop').ufTooltip({
								content: '您确定停用当前往来单位吗？',
								onYes: function () {
									ufma.showloading('数据停用中，请耐心等待...');
									page.delRowOne($(page._self).attr('action'), [$(page._self).attr('rowid')], $(page._self).closest('tr'));
								},
								onNo: function () { }
							})
						}
					});
					//翻页取消勾选
					$('#' + id).on('page.dt', function () {
						$(".datatable-group-checkable,.checkboxes").prop("checked", false);
						$('#' + id).find("tbody tr.selected").removeClass("selected");
					});
				} else {
					//datable的id
					var id = "current-data";
					var toolBar = $('#' + id).attr('tool-bar');
					currentDataTable = $("#" + id).DataTable({
						"language": {
							"url": bootPath + "agla-trd/datatables/datatable.default.js"
						},
						"fixedHeader": {
							header: true
						},
						"data": [],
						"bFilter": true, //去掉搜索框
						"bLengthChange": true, //去掉每页显示多少条数据
						"processing": true, //显示正在加载中
						"pagingType": "full_numbers", //分页样式
						"lengthChange": true, //是否允许用户自定义显示数量p
						"lengthMenu": [
							[20, 50, 100, 200, -1],
							[20, 50, 100, 200, "全部"]
						],
						"pageLength": ufma.dtPageLength("#" + id),
						"bInfo": true, //页脚信息
						"bSort": false, //排序功能
						"bAutoWidth": false, //表格自定义宽度，和swidth一起用
						"bProcessing": true,
						"bDestroy": true,
						"columns": [{
							title: '<label class="mt-checkbox mt-checkbox-single mt-checkbox-outline">' +
								'<input type="checkbox" class="datatable-group-checkable"/>&nbsp;' +
								'<span></span>' +
								'</label>',
							width : 60,
							data: "chrId"
						},
						{
							title: "单位编码",
							width : 300,
							data: "chrCode"
						},
						{
							title: "单位名称",
							data: "chrName"
						},
						{
							title: "单位性质",
							width : 100,
							data: "companyKind"
						},
						{
							title: "联系人",
							data: "contact"
						},
						{
							title: "状态",
							width : 60,
							data: "enabledName"
						},
						{
							title: "单位属性",
							width : 170,
							data: "attributeName"
						},
						{
							title: "操作",
							width : 100,
							data: ""
						}
						],
						"columnDefs": [{
							"defaultContent": "",
							"targets": "_all"
						},

						{
							"targets": [0],
							"serchable": false,
							"orderable": false,
							"className": "nowrap",
							"render": function (data, type, rowdata, meta) {
								return '<label class="mt-checkbox mt-checkbox-single mt-checkbox-outline"> ' +
									'<input type="checkbox" class="checkboxes" value="' + data + '" data-level="' + rowdata.levelNum + '" data-code="' + rowdata.chrCode + '"/>&nbsp; ' +
									'<span></span> ' +
									'</label>';
							}
						},
						{
							"targets": [1, 2, 3, 4, 5, 6],
							"className": "isprint"
						},
						{
							"targets": [2],
							"serchable": false,
							"orderable": false,
							"className": "nowrap",
							"render": function (data, type, rowdata, meta) {
								var textIndent = '0';
								if (rowdata.levelNum) {
									textIndent = (parseInt(rowdata.levelNum) - 1) + 'em';
								}
								var alldata = JSON.stringify(rowdata);
								return '<a class="common-jump-link" style="display:block;text-indent:' + textIndent + '" href="javascript:;" data-href=\'' + alldata + '\'>' + data + '</a>';
							}
						},
						{
							"targets": [3],
							"serchable": false,
							"orderable": false,
							"render": function (data, type, rowdata, meta) {
								switch (rowdata.companyKind) {
									case "1":
										return '行政单位';

									case "2":
										return '事业单位';

									case "3":
										return '企业';

									case "4":
										return '其他';

								}
							}
						},
						{
							"targets": [5],
							"render": function (data, type, rowdata, meta) {
								if (rowdata.enabled == 1) {
									return '<span style="color:#00A854">' + data + '</span>';
								} else {
									return '<span style="color:#F04134">' + data + '</span>';
								}
							}
						},
						{
							"targets": [-1],
							"serchable": false,
							"orderable": false,
							"className": "text-center nowrap btnGroup",
							"render": function (data, type, rowdata, meta) {
								var active = rowdata.enabled == 1 ? 'hidden' : 'hidden:false';
								var unactive = rowdata.enabled == 0 ? 'hidden' : 'hidden:false';
								var addlower = "";
								/*这里没看太明白
									* if ($('body').data("code")) {
									if (page.agencyCtrlLevel == "0201" || page.agencyCtrlLevel == "0202") {
										addlower = "";
									} else {
										addlower = 'hidden';
									}
								} else {
									addlower = 'hidden';
								}*/
								//单位级受控制方式控制，系统级不受约束
								if ($("#cbAgency").get(0)) {
									if (page.agencyCtrlLevel != '0101') {
										addlower = "";
									} else {
										addlower = 'hidden';
									}
								}
								if (isOperate == "1") {
									return '<a class="btn btn-icon-only btn-sm btn-permission btn-addlower" data-toggle="tooltip" ' + addlower + ' action= "addlower" rowid="' + rowdata.chrCode + '" title="增加下级" disabled><span class="glyphicon icon-add-subordinate"></span></a>' +
									'<a class="btn btn-icon-only btn-sm btn-permission btn-start"  data-toggle="tooltip" ' + active + ' action= "active" rowid="' + rowdata.chrCode + '" title="启用" disabled><span class="glyphicon icon-play"></span></a>' +
									'<a class="btn btn-icon-only btn-sm btn-permission btn-stop" data-toggle="tooltip" ' + unactive + ' action= "unactive" rowid="' + rowdata.chrCode + '" title="停用" disabled><span class="glyphicon icon-ban"></span></a>' +
									'<a class="btn btn-icon-only btn-sm btn-permission btn-delete"  title="删除"  rowid="' + rowdata.chrCode + '"  data-toggle="tooltip" ' + addlower + ' action= "delete" disabled ><span class="  glyphicon icon-trash"></span></a>';
								} else {
									return '<a class="btn btn-icon-only btn-sm btn-permission btn-addlower" data-toggle="tooltip" ' + addlower + ' action= "addlower" rowid="' + rowdata.chrCode + '" title="增加下级"><span class="glyphicon icon-add-subordinate"></span></a>' +
									'<a class="btn btn-icon-only btn-sm btn-permission btn-start"  data-toggle="tooltip" ' + active + ' action= "active" rowid="' + rowdata.chrCode + '" title="启用"><span class="glyphicon icon-play"></span></a>' +
									'<a class="btn btn-icon-only btn-sm btn-permission btn-stop" data-toggle="tooltip" ' + unactive + ' action= "unactive" rowid="' + rowdata.chrCode + '" title="停用"><span class="glyphicon icon-ban"></span></a>' +
									'<a class="btn btn-icon-only btn-sm btn-permission btn-delete"  title="删除"  rowid="' + rowdata.chrCode + '"  data-toggle="tooltip" ' + addlower + ' action= "delete" ><span class="  glyphicon icon-trash"></span></a>';
								}
							}
						}
						],
						"dom": '<"printButtons"B>rt<"' + id + '-paginate"ilp>',
						buttons: [{
							extend: 'print',
							text: '<i class="glyphicon icon-print" aria-hidden="true"></i>',
							exportOptions: {
								columns: '.isprint'
							},
							customize: function (win) {
								$(win.document.body).find('h1').css("text-align", "center");
								$(win.document.body).css("height", "auto");
							}
						},
						{
							extend: 'excelHtml5',
							text: '<i class="glyphicon icon-upload" aria-hidden="true"></i>',
							exportOptions: {
								columns: '.isprint'
							},
							customize: function (xlsx) {
								var sheet = xlsx.xl.worksheets['sheet1.xml'];
							}
						}
						],
						"initComplete": function (settings, json) {
							if ($('body').attr("data-code")) {
								if (page.agencyCtrlLevel != '0101') {
									$('#delete').removeClass('hidden')
								} else {
									$('#delete').addClass('hidden')
								}
							}
							$("#printTableData").html("");
							$("#printTableData").append($(".printButtons"));

							$("#printTableData .buttons-print").addClass("btn-print btn-permission").attr({
								"data-toggle": "tooltip",
								"title": "打印"
							});
							$("#printTableData .buttons-excel").addClass("btn-export btn-permission").attr({
								"data-toggle": "tooltip",
								"title": "导出"
							});
							//导出begin
							$("#printTableData .buttons-excel").off().on('click', function (evt) {
								evt = evt || window.event;
								evt.preventDefault();
								ufma.expXLSForDatatable($('#' + id), '往来单位');
							});
							//导出end                        
							$('#printTableData.btn-group').css("position", "inherit");
							$('#printTableData div.dt-buttons').css("position", "inherit");
							$('#printTableData [data-toggle="tooltip"]').tooltip();
							ufma.isShow(page.reslist);
							var $info = $(toolBar + ' .info');
							if ($info.length == 0) {
								$info = $('<div class="info"></div>').appendTo($(toolBar + ' .tool-bar-body'));
							}
							$info.html('');
							$('.' + id + '-paginate').appendTo($info);

							if (pageLen != "" && typeof (pageLen) != "undefined") {
								$('#' + id).DataTable().page.len(pageLen).draw(false);
								if (pageNum != "" && typeof (pageNum) != "undefined") {
									$('#' + id).DataTable().page(parseInt(pageNum) - 1).draw(false);
								}
							}
							//checkbox的全选操作
							$(".datatable-group-checkable").on("change", function () {
								var isCorrect = $(this).is(":checked");
								$("#" + id + " .checkboxes").each(function () {
									isCorrect ? $(this).prop("checked", !0) : $(this).prop("checked", !1);
									isCorrect ? $(this).closest("tr").addClass("selected") : $(this).closest("tr").removeClass("selected");
								})
								$(".datatable-group-checkable").prop("checked", isCorrect);
							});
							// ufma.setBarPos($(window));
							// $('#current-data').closest('.dataTables_wrapper').ufScrollBar({
							// 	hScrollbar: true,
							// 	mousewheel: false
							// });
							$("#current-data").tblcolResizable();
							//固定表头
							$("#current-data").fixedTableHead($("#outDiv"));
						},
						"drawCallback": function (settings) {
							// ufma.setBarPos($(window));
							ufma.isShow(page.reslist);

							$('#' + id).find("td.dataTables_empty").text("")
								.append('<img src="' + bootPath + 'images/noData.png"/><br/><i>目前还没有你要查询的数据</i>');

							//操作按钮显示tips
							$('#' + id + ' .btn[data-toggle="tooltip"]').tooltip();

							//根据级次进行名称缩进
							$("td input.checkboxes").each(function (n) {
								var level_num = $(this).closest("tr").find("td input.checkboxes").data("level");
								switch (level_num) {
									case 1:
										break;
									case 2:
										$(this).closest("tr").find("td.current-subject").css("padding-left", "18px");
										break;
									case 3:
										$(this).parents("tr").find("td.current-subject").css("padding-left", "34px");
										break;
									case 4:
										$(this).parent("label").parent("td").parent("tr").find("td.current-subject").css("padding-left", "48px");
										break;
									default:
										break;
								}
							});
							$('#' + id + ' .btn').on('click', function () {
								page._self = $(this);

							});
							$('#' + id + ' .btn-delete').ufTooltip({
								content: '您确定删除当前往来单位吗？',
								onYes: function () {
									ufma.showloading('数据删除中，请耐心等待...');
									page.pageNum = $('.current-data-paginate').find('span a.paginate_button.current').text();
									page.pageLen = parseInt($('#current-data_length').find('select').val());
									page.delRowOne($(page._self).attr('action'), [$(page._self).attr('rowid')], $(page._self).closest('tr'));
									page.getCurrentList(url, page.pageNum, page.pageLen);

								},

								onNo: function () { }
								/*   //暂定 以后优化
								           window.location.reload()*/
							});
							$('#' + id + ' .btn-start').ufTooltip({
								content: '您确定启用当前往来单位吗？',
								onYes: function () {
									ufma.showloading('数据启用中，请耐心等待...');
									page.delRowOne($(page._self).attr('action'), [$(page._self).attr('rowid')], $(page._self).closest('tr'));
								},
								onNo: function () { }
							});
							$('#' + id + ' .btn-stop').ufTooltip({
								content: '您确定停用当前往来单位吗？',
								onYes: function () {
									ufma.showloading('数据停用中，请耐心等待...');
									page.delRowOne($(page._self).attr('action'), [$(page._self).attr('rowid')], $(page._self).closest('tr'));
								},
								onNo: function () { }
							})
						}
					});
					//翻页取消勾选
					$('#' + id).on('page.dt', function () {
						$(".datatable-group-checkable,.checkboxes").prop("checked", false);
						$('#' + id).find("tbody tr.selected").removeClass("selected");
					});
				}

			},
			getDW: function () {
				ufma.showloading("正在加载数据，请耐心等待...")
				var codes = page.getCheckedRows();
				var url = "/ma/sys/common/countAgencyUse";
				var argu = {
					//bug79047
					//'codes': codes,
					"table": "MA_ELE_CURRENT",
					"rgCode": ma.rgCode,
					"setYear": ma.setYear,
					'agencyCode': $(".currentAgy").length > 0 ? page.agencyCode : '*',
					acctCode: page.acctCode,
					'chrCodes': codes,
					'eleCode': 'CURRENT'
				};
				var callback = function (result) {
					$('#dw-used').DataTable({
						"language": {
							"url": bootPath + "agla-trd/datatables/datatable.default.js"
						},
						"data": result.data,
						"bFilter": false, //去掉搜索框
						"paging": false,
						"bLengthChange": true, //去掉每页显示多少条数据
						"processing": true, //是否显示正在加载
						"pagingType": "first_last_numbers", //分页样式
						"lengthChange": false, //是否允许用户自定显示数量
						"pageLength": ufma.dtPageLength("#dw-used"),
						"bInfo": false, //页脚信息
						"bSort": false, //排序功能
						"bAutoWidth": false, //表格自定义宽度
						"bProcessing": true,
						"bDestroy": true,
						"columns": [{
							title: "单位",
							data: "agencyName"

						},
						{
							title: "已用",
							data: "issuedCount",
							width: "50px"
						}
						]
					});
					ufma.hideloading();
				}
				ufma.post(url, argu, callback);
			},
			//函数操作url
			getInterface: function (opt) {
				var urls;
				//判断系统级单位级
				if ($("#cbAgency").get(0)) {
					//单位级
					urls = {
						delete: {
							type: 'delete',
							//							url: '/ma/agy/current/delete'
							url: '/ma/sys/current/delete'
						},
						active: {
							type: 'put',
							//							url: '/ma/agy/current/able'
							url: '/ma/sys/current/able'
						},
						unactive: {
							type: 'put',
							//							url: '/ma/agy/current/able'
							url: '/ma/sys/current/able'
						}
					}
				} else {
					//系统级
					urls = {
						delete: {
							type: 'delete',
							url: '/ma/sys/current/delete'
						},
						active: {
							type: 'put',
							url: '/ma/sys/current/able'
						},
						unactive: {
							type: 'put',
							url: '/ma/sys/current/able'
						}
					}
				}

				return urls[opt];
			},

			//多选checkbox函数
			getCheckedRows: function () {
				var checkedArray = [];
				$("#current-data .checkboxes:checked").each(function () {
					checkedArray.push(currentDataTable.row($(this).parents("tr")).data().chrCode);
				})
				return checkedArray;
			},

			getCheckedRowIds: function () {
				var checkedArray = [];
				table = currentDataTable;
				activeLine = table.rows('.selected');
				data = activeLine.data();
				for (var i = 0; i < data.length; i++)
					checkedArray.push(data[i].chrId);
				return checkedArray;
			},
			//批量操作（删除、启用、停用）
			actionMore: function (action, idArray, $tr) {
				var options = this.getInterface(action);
				page.pageNum = $('.current-data-paginate').find('span a.paginate_button.current').text();
				page.pageLen = parseInt($('#current-data_length').find('select').val());
				var argu = {
					chrCodes: idArray,
					agencyCode: searchObj.agencyCode,
					acctCode: page.acctCode
				};
				var callback = function (result) {
					if (action == 'delete') {
						if ($tr) {
							$tr.remove();
						} else {
							if ($("#cbAgency").get(0)) {
								//								var url = "/ma/agy/current/select?agencyCode=" + searchObj.agencyCode + "&enable=" + searchObj.enable + "&chrName=" + searchObj.chrName + "&contact=" + searchObj.contact + "&ajax=1";
								var url = "/ma/sys/current/select?agencyCode=" + searchObj.agencyCode + '&acctCode=' + page.acctCode + "&enabled=" + searchObj.enable + "&chrName=" + searchObj.chrName + "&contact=" + searchObj.contact + "&ajax=1&rgCode=" + ma.rgCode + "&setYear=" + ma.setYear;
								page.getCurrentList(url, page.pageNum, page.pageLen);
							} else {
								//系统级
								var url = "/ma/sys/current/select?agencyCode=" + searchObj.agencyCode + '&acctCode=' + page.acctCode + "&enabled=" + searchObj.enable + "&chrName=" + searchObj.chrName + "&contact=" + searchObj.contact + "&ajax=1&rgCode=" + ma.rgCode + "&setYear=" + ma.setYear;
								page.getCurrentList(url, page.pageNum, page.pageLen);
							}
						}
						page.cancelCheckAll();
						if (result.flag == 'success') {
							ufma.hideloading();
							ufma.showTip('删除成功！', function () { }, 'success'); //guohx 增加删除成功提示
						}
					} else {
						/*if ($tr) {
						    $tr.find('.btn[action="active"]').attr('disabled', action == "active");
						    $tr.find('.btn[action="unactive"]').attr('disabled', action == "unactive");
						} else {*/
						//表格重新加载
						//判断系统级单位级
						if ($("#cbAgency").get(0)) {
							//							var url = "/ma/agy/current/select?agencyCode=" + searchObj.agencyCode + "&enable=" + searchObj.enable + "&chrName=" + searchObj.chrName + "&contact=" + searchObj.contact + "&ajax=1";
							var url = "/ma/sys/current/select?agencyCode=" + searchObj.agencyCode + '&acctCode=' + page.acctCode + "&enabled=" + searchObj.enable + "&chrName=" + searchObj.chrName + "&contact=" + searchObj.contact + "&ajax=1&rgCode=" + ma.rgCode + "&setYear=" + ma.setYear;
							page.getCurrentList(url, page.pageNum, page.pageLen);
							if (action == 'active') {
								ufma.hideloading();
								if (result.flag == 'success') {
									ufma.showTip('启用成功', function () { }, 'success');
								}
							} else if (action == 'unactive') {
								ufma.hideloading();
								if (result.flag == 'success') {
									ufma.showTip('停用成功！', function () { }, 'success');
								}
							}
						} else {
							//系统级
							var url = "/ma/sys/current/select?agencyCode=" + searchObj.agencyCode + "&acctCode=" + page.acctCode + "&enabled=" + searchObj.enable + "&chrName=" + searchObj.chrName + "&contact=" + searchObj.contact + "&ajax=1&rgCode=" + ma.rgCode + "&setYear=" + ma.setYear;
							page.getCurrentList(url, page.pageNum, page.pageLen);
							if (action == 'active') {
								ufma.hideloading();
								if (result.flag == 'success') {
									ufma.showTip('启用成功', function () { }, 'success');
								}
							} else if (action == 'unactive') {
								ufma.hideloading();
								if (result.flag == 'success') {
									ufma.showTip('停用成功！', function () { }, 'success');
								}
							}
						}
						page.cancelCheckAll();
						/*}*/
					}
				}
				if (argu.chrCodes.length == 0) {
					ufma.showTip("请选择数据", function () { }, "warning")
					return false
				}
				if (action == "delete") {
					argu.rgCode = ma.rgCode
					argu.setYear = ma.setYear
					ufma.confirm("您确定要删除选中的数据吗？", function (e) {
						if (e) {
							ufma.showloading('数据删除中，请耐心等待...');
							ufma.ajax(options.url, options.type, argu, callback);
						}
					}, {
							type: 'warning'
						});
				} else if (action == "addlower") {
					var argu = {
						chrCode: idArray[0],
						eleCode: 'CURRENT',
						tableName: 'MA_ELE_CURRENT',
						'agencyCode': searchObj.agencyCode,
						acctCode: page.acctCode
					};
					var callback = function (result) {

						var chrCode = result.data;
						var data = {};
						data.chrCode = chrCode;
						ufma.open({
							url: 'currentEdit.html',
							title: '编辑',
							width: 1100,
							data: {
								action: 'edit',
								ts: page.ts,
								agencyCode: searchObj.agencyCode,
								acctCode: page.acctCode,
								flag: true,
								data: data,
								distCodeData: page.distCodeData
							},
							ondestory: function (data) {
								//窗口关闭时回传的值
								if (data.action == 'save') {
									searchObj.isAgency = true;
									var dataUrl = "/ma/sys/current/select?agencyCode=" + searchObj.agencyCode + '&acctCode=' + page.acctCode + "&enabled=-1&chrName=&contact=&ajax=1&rgCode=" + ma.rgCode + "&setYear=" + ma.setYear;
									//初始化表格
									page.getCurrentList(dataUrl);
									$(".datatable-group-checkable").prop("checked", false);
								};
							}
						});
					}
					//					ufma.post('/ma/agy/eleProject/getMaxLowerCode', argu, callback);if($("#cbAgency").get(0)){
					if ($("#cbAgency").get(0)) {
						ufma.post('/ma/sys/common/getMaxLowerCode', argu, callback);
					} else {
						ufma.post('/ma/sys/common/getMaxLowerCode', argu, callback);
					}
				} else {
					argu.action = action;
					if (action == 'active') {
						ufma.confirm('您确定要启用选中的数据吗？', function (e) {
							if (e) {
								ufma.showloading('数据启用中，请耐心等待...');
								ufma.ajax(options.url, options.type, argu, callback);
							}
						}, {
								type: 'warning'
							})
					} else if (action == 'unactive') {
						ufma.confirm('您确定要停用选中的数据吗？', function (e) {
							if (e) {
								ufma.showloading('数据停用中，请耐心等待...');
								ufma.ajax(options.url, options.type, argu, callback);
							}
						}, {
								type: 'warning'
							})
					}
				}
			},
			//取消全选
			cancelCheckAll: function () {
				$('label.mt-checkbox').find('input[type="checkbox"]').prop('checked', false);
			},
			delRowOne: function (action, idArray, $tr) {
				var options = this.getInterface(action);
				page.pageNum = $('.current-data-paginate').find('span a.paginate_button.current').text();
				page.pageLen = parseInt($('#current-data_length').find('select').val());
				var argu = {
					chrCodes: idArray,
					agencyCode: searchObj.agencyCode,
					acctCode: page.acctCode
				};
				var callback = function (result) {
					if (action == 'delete') {
						if ($tr) {
							$tr.remove();
						}
						if (result.flag == 'success') {
							ufma.hideloading();
							ufma.showTip('删除成功！', function () { }, 'success'); //guohx 增加删除成功提示
						}
					} else {
						//表格重新加载
						//判断系统级单位级
						if ($("#cbAgency").get(0)) {
							//单位级
							//								searchObj.agencyCode = page.cbAgency.getValue();
							var url = "/ma/sys/current/select?agencyCode=" + searchObj.agencyCode + "&acctCode=" + page.acctCode + "&enabled=" + searchObj.enable + "&chrName=" + searchObj.chrName + "&contact=" + searchObj.contact + "&ajax=1&rgCode=" + ma.rgCode + "&setYear=" + ma.setYear;
							//							var url = "/ma/agy/current/select?agencyCode=" + searchObj.agencyCode + "&enable=" + searchObj.enable + "&chrName=" + searchObj.chrName + "&contact=" + searchObj.contact + "&ajax=1";
							page.getCurrentList(url, page.pageNum, page.pageLen);
						} else {
							//系统级
							var url = "/ma/sys/current/select?agencyCode=" + searchObj.agencyCode + "&acctCode=" + page.acctCode + "&enabled=" + searchObj.enable + "&chrName=" + searchObj.chrName + "&contact=" + searchObj.contact + "&ajax=1&rgCode=" + ma.rgCode + "&setYear=" + ma.setYear;
							page.getCurrentList(url, page.pageNum, page.pageLen);

						}
						/*}*/
						if (action == 'active') {
							if (result.flag == 'success') {
								ufma.hideloading();
								ufma.showTip('启用成功', function () { }, 'success');
							}
						} else if (action == 'unactive') {
							if (result.flag == 'success') {
								ufma.hideloading();
								ufma.showTip('停用成功！', function () { }, 'success');
							}
						}
						page.cancelCheckAll();
					}
				}
				if (action == "delete") {
					argu.rgCode = ma.rgCode
					argu.setYear = ma.setYear
					ufma.ajax(options.url, options.type, argu, callback);

				} else if (action == "addlower") {
					var argu = {
						chrCode: idArray[0],
						eleCode: 'CURRENT',
						tableName: 'MA_ELE_CURRENT',
						'agencyCode': searchObj.agencyCode,
						acctCode: page.acctCode
					};
					var callback = function (result) {
						var chrCode = result.data;
						var data = {};
						data.chrCode = chrCode;
						ufma.open({
							url: 'currentEdit.html',
							title: '编辑',
							width: 1100,
							data: {
								action: 'edit',
								agencyCode: searchObj.agencyCode,
								acctCode: page.acctCode,
								ts: page.ts,
								flag: true,
								data: data,
								distCodeData: page.distCodeData
							},
							ondestory: function (data) {
								//窗口关闭时回传的值
								//bugCWYXM-4673--只有保存才会刷新--zsj
								if (data.action == 'save') {
									//currentDataTable.ajax.url("/ma/sys/current/select?agencyCode="+searchObj.agencyCode+"&enable="+searchObj.enable+"&chrName="+searchObj.chrName+"&contact="+searchObj.contact).load();
									currentDataTable.ajax.reload();
								};
							}
						});
					}
					//					ufma.post('/ma/agy/eleProject/getMaxLowerCode', argu, callback);
					if ($("#cbAgency").get(0)) {
						ufma.post('/ma/sys/common/getMaxLowerCode', argu, callback);
					} else {
						ufma.post('/ma/sys/common/getMaxLowerCode', argu, callback);
					}
				} else {
					argu.action = action;
					ufma.ajax(options.url, options.type, argu, callback);
				}
			},
			hasNoError: function () {
				$('#')
			},
			//获取行政区划并渲染
			getDistTree: function () {
				var url = "/ma/sys/eleAgency/distTree";
				ufma.get(url, "", function (result) {
					page.distCodeData = result.data;
				})
			},
			//初始化页面
			initPage: function () {
				page.getDistTree();
				//工作区高度
				//ufma.setWorkspaceHeight();

			},
			issueTips: function (data, isCallBack) {
				var title = "";
				if (isCallBack) {
					title = "选用结果";
				} else {
					title = "下发结果";
				}
				data.colName = '往来单位';
				data.pageType = 'CURRENT';
				ufma.open({
					url: '../maCommon/issueTips.html',
					title: title,
					width: 1100,
					data: data,
					ondestory: function (data) {
						//窗口关闭时回传的值;
						if (isCallBack) {
							//page.getCoaAccList(page.pageNum, page.pageLen);
							var dataUrl = "/ma/sys/current/select?agencyCode=" + searchObj.agencyCode + '&acctCode=' + page.acctCode + "&enabled=-1&chrName=&contact=&ajax=1&rgCode=" + ma.rgCode + "&setYear=" + ma.setYear;
							//初始化表格
							page.getCurrentList(dataUrl);
						}
					}
				});
			},
			//选用-begin--zsj--CWYXM-4154
			//获取选用勾选的数据
			getChooseCheckedRows: function () {
				var checkedArray = [];
				$('#expfunc-choose-datatable .checkboxes:checked').each(function () {
					checkedArray.push($(this).val());
				});
				return checkedArray;
			},
			//选用页面初始化
			getExpFuncChoose: function () {
				// var url = "/ma/sys/userData/list";
				ufma.showloading('正在请求数据，请耐心等待...');
				var callback = function (result) {
					if (result.data.length > 0) {
						page.issueAgecyCode = result.data[0].agencyCode;
					}
					var id = "expfunc-choose-datatable";
					var toolBar = $('#' + id).attr('tool-bar');
					$('#' + id).DataTable({
						"language": {
							"url": bootPath + "agla-trd/datatables/datatable.default.js"
						},

						"data": result.data,
						"bFilter": true, //去掉搜索框
						"bLengthChange": true, //去掉每页显示多少条数据
						"processing": true, //显示正在加载中
						"pagingType": "full_numbers", //分页样式
						"lengthChange": true, //是否允许用户自定义显示数量p
						"lengthMenu": [
							[20, 50, 100, 200, -1],
							[20, 50, 100, 200, "全部"]
						],
						"pageLength": ufma.dtPageLength("#" + id),
						"bInfo": true, //页脚信息
						"bSort": false, //排序功能
						"bAutoWidth": false, //表格自定义宽度，和swidth一起用
						"bProcessing": true,
						"bDestroy": true,
						"columns": [{
							title: '<label class="mt-checkbox mt-checkbox-single mt-checkbox-outline"> <input type="checkbox"' +
								'class="datatable-choose-checkall"/> &nbsp; <span></span> </label>',
							data: "code"
						},
						{
							title: "往来单位编码",
							data: "code"
						},
						{
							title: "往来单位名称",
							data: "codeName"
						},
						{
							title: "状态",
							data: "enabledName"
						}
						],
						"columnDefs": [{
							"targets": [0],
							"serchable": false,
							"orderable": false,
							"className": "checktd",
							"render": function (data, type, rowdata, meta) {
								return '<div class="checkdiv">' +
									'</div><label class="mt-checkbox mt-checkbox-single mt-checkbox-outline"> ' +
									'<input type="checkbox" class="checkboxes" value="' + data + '" />&nbsp;' +
									'<span></span> </label>';
							}
						},
						{
							"targets": [3],
							"render": function (data, type, rowdata, meta) {
								if (rowdata.enabled == 1) {
									return '<span style="color:#00A854">启用</span>';
								} else {
									return '<span style="color:#F04134">停用</span>';
								}
							}
						}
						],
						"dom": 'rt<"tableBottom"<"tool-bar-body"<"ufma-tool-btns"><"info"<"' + id + '-paginate"ilp>>>>',
						"initComplete": function (settings, json) {
							var $info = $(toolBar + ' .info');
							if ($info.length == 0) {
								$info = $('<div class="info"></div>').appendTo($(toolBar + ' .tool-bar-body'));
							}
							$info.html('');
							$('[data-toggle="tooltip"]').tooltip();
							$('.' + id + '-paginate').appendTo($info);
							/*							$('#' + id + ' tbody td').on('click', function(e) {
															e.preventDefault();
															var $ele = $(e.target);
															var $tr = $ele.closest('tr');
															if($tr.hasClass('selected')) {
																$tr.removeClass('selected');
																$tr.find('input[type="checkbox"]').prop("checked", false);
															} else {
																$tr.addClass('selected');
																$tr.find('input[type="checkbox"]').prop("checked", true);
															}
														});

														$(".datatable-choose-checkall").prop("checked", false);
														$(".datatable-choose-checkall").on('change', function() {
															var t = $(this).is(":checked");
															$('#' + id + ' .checkboxes').each(function() {
																t ? $(this).prop("checked", !0) : $(this).prop("checked", !1);
																t ? $(this).closest('tr').addClass('selected') : $(this).closest('tr').removeClass('selected');
															});
															$(".datatable-choose-checkall").prop("checked", t);
														});*/
							//权限控制
							ufma.isShow(page.reslist);
							// ufma.setBarPos($(window));
							ma.searchHideShow('choose-search', '#expfunc-choose-datatable', 'searchHideChooseBtn');
							var heitab = $("#expfunc-choose-content .tab-content").height() + 10
							var scltop = $("#expfunc-choose-content").scrollTop() + $("#expfunc-choose-content").height() - 55
							if (scltop <= heitab) {
								$("#expfunc-choose-tool-bar").css("top", scltop + 'px').css("position", 'absolute')
							} else {
								$("#expfunc-choose-tool-bar").css("top", heitab + 'px').css("position", 'absolute')
							}
						},
						"drawCallback": function (settings) {
							$(".datatable-choose-checkall").prop("checked", false);
							$(".datatable-choose-checkall").on('change', function () {
								var t = $(this).is(":checked");
								$('#' + id + ' .checkboxes').each(function () {
									t ? $(this).prop("checked", !0) : $(this).prop("checked", !1);
									t ? $(this).closest('tr').addClass('selected') : $(this).closest('tr').removeClass('selected');
								});
								$(".datatable-choose-checkall").prop("checked", t);
							});

							ufma.isShow(page.reslist);

							$('#' + id).find("td.dataTables_empty").text("")
								.append('<img src="' + bootPath + 'images/noData.png"/><br/><i>目前还没有你要查询的数据</i>');
							var heitab = $("#expfunc-choose-content .tab-content").height() + 10
							var scltop = $("#expfunc-choose-content").scrollTop() + $("#expfunc-choose-content").height() - 55
							if (scltop <= heitab) {
								$("#expfunc-choose-tool-bar").css("top", scltop + 'px').css("position", 'absolute')
							} else {
								$("#expfunc-choose-tool-bar").css("top", heitab + 'px').css("position", 'absolute')
							}
						}
					});
					ufma.hideloading();
				};
				var argu = {
					rgCode: ma.rgCode,
					setYear: ma.setYear,
					agencyCode: page.agencyCode,
					acctCode: page.acctCode,
					eleCode: 'CURRENT',
					bgttypeCode: ""
				};
				ufma.get(ma.commonApi.getCanIssueEleTree, argu, callback);
			},
			//打开选用页面
			openChooseWin: function () {
				page.choosePage = ufma.showModal('expfunc-choose', 1000, 500);
			},
			//选用-end--zsj--CWYXM-4154
			//页面元素事件绑定使用jquery 的 on()方法
			onEventListener: function () {
				//选用-begin--zsj--CWYXM-4154
				//选用
				$('.btn-choose').on('click', function (e) {
					e.preventDefault();
					if (page.chooseAcctFlag == true) {
						ufma.showTip('请选择账套', function () { }, 'warning');
						return false;
					} else {
						/*page.getExpFuncChoose();
						page.openChooseWin();*/
						//由于原始将选用界面问题太多，且维护不便，故统一为公共界面--zsj--CZSB-182
						ufma.open({
							url: '../maCommon/comChooseIssue.html',
							title: '选用',
							width: 1000,
							data: {
								getUrl: '/ma/sys/common/getCanIssueEleTree',
								useUrl: "/ma/sys/common/issue",
								pageName: '往来单位',
								rgCode: ma.rgCode,
								setYear: ma.setYear,
								agencyCode: page.agencyCode,
								acctCode: page.acctCode,
								eleCode: 'CURRENT',
								bgttypeCode: ""
							},
							ondestory: function (result) {
								if (result.action) {
									page.issueTips(result, true);
								}
							}
						});
					}

				});
				//确认选用
				$('.btn-agyChoose').on('click', function (e) {
					var checkRow = page.getChooseCheckedRows();
					if (checkRow.length > 0) {
						ufma.showloading('数据选用中，请耐心等待...');
						var toAgencyAcctList = [{
							toAgencyCode: page.agencyCode,
							toAcctCode: page.acctCode
						}];
						var argu = {
							chrCodes: checkRow,
							toAgencyAcctList: toAgencyAcctList, //选用的单位
							eleCode: 'CURRENT',
							rgCode: ma.rgCode,
							setYear: ma.setYear,
							agencyCode: page.issueAgecyCode //上级单位代码，是从选用列表的数据中赋值得来的
						};
						var callback = function (result) {
							if (result) {
								ufma.hideloading();
								//ufma.showTip("选用成功", function() {
								page.choosePage.close();
								var url = "/ma/sys/current/select?agencyCode=" + searchObj.agencyCode + '&acctCode=' + page.acctCode + "&enabled=" + searchObj.enable + "&chrName=" + searchObj.chrName + "&contact=" + searchObj.contact + "&ajax=1&rgCode=" + ma.rgCode + "&setYear=" + ma.setYear;
								page.getCurrentList(url, page.pageNum, page.pageLen);
								//}, "success");
								page.issueTips(result, true);
							}
						};
						ufma.post(ma.commonApi.confirmIssue, argu, callback);
					} else {
						ufma.alert("请选择要选用的数据！", "warning");
						return false;
					}
				});
				//选用-end--zsj--CWYXM-4154
				$('.btn-agyClose').on('click', function (e) {
					e.preventDefault();
					page.choosePage.close();
				});
				$('#current-data').on('click', '.btn-addlower', function (e) {
					page.delRowOne($(this).attr('action'), [$(this).attr('rowid')], $(this).closest('tr'));
				});
				//行checkbox的单选操作
				$("#current-data").on("click", "tbody td:not(.btnGroup)", function (e) {
					e.preventDefault();
					var $ele = $(e.target);
					//如果是a标签，就进入编辑页
					if ($ele.is('a')) {
						//打开页面
						var data = currentDataTable.row($(this).parents("tr")).data();
						ufma.open({
							url: 'currentEdit.html',
							title: '编辑',
							width: 1100,
							data: {
								action: 'edit',
								agencyCode: searchObj.agencyCode,
								acctCode: page.acctCode,
								data: data,
								ts: page.ts,
								isAgency: searchObj.isAgency,
								distCodeData: page.distCodeData
							},
							ondestory: function (data) {
								page.pageNum = $('.current-data-paginate').find('span a.paginate_button.current').text();
								page.pageLen = parseInt($('#current-data_length').find('select').val());
								//窗口关闭时回传的值
								//bugCWYXM-4673--只有保存才会刷新--zsj
								if (data.action == 'save') {
									var url = "/ma/sys/current/select?agencyCode=" + searchObj.agencyCode + "&acctCode=" + page.acctCode + "&enabled=" + searchObj.enable + "&chrName=" + searchObj.chrName + "&contact=" + searchObj.contact + "&ajax=1&rgCode=" + ma.rgCode + "&setYear=" + ma.setYear;
									page.getCurrentList(url, page.pageNum, page.pageLen);
								};
							}
						});

						return false;
					}
					var $tr = $ele.closest("tr");
					var $input = $ele.closest('tr').find('input[type="checkbox"]');
					var code = $input.data("code").toString();
					var t = true
					if ($tr.hasClass("selected")) {
						$ele.parents("tbody").find("tr").each(function () {
							var thisCode = $(this).find('input[type="checkbox"]').data("code").toString();
							if (thisCode.substring(0, code.length) == code) {
								$(this).removeClass("selected");
								$(this).find('input[type="checkbox"]').prop("checked", false);
							}
							if ($(this).find('input[type="checkbox"]').is(":checked") != true) {
								t = false
							}
						})
					} else {
						$ele.parents("tbody").find("tr").each(function () {
							var thisCode = $(this).find('input[type="checkbox"]').data("code").toString();
							if (thisCode.substring(0, code.length) == code) {
								$(this).addClass("selected");
								$(this).find('input[type="checkbox"]').prop("checked", true);
							}
							if ($(this).find('input[type="checkbox"]').is(":checked") != true) {
								t = false
							}
						})
					}
					$(".datatable-group-checkable").attr('checked', t).prop('checked', t)
				});
				//选用页面表格行操作绑定
				$('#expfunc-choose-datatable').on('click', 'tbody td', function (e) {
					e.preventDefault();
					var $ele = $(e.target);
					var $tr = $ele.closest('tr');
					var $input = $ele.closest('tr').find('input[type="checkbox"]');
					var code = $input.val();
					var t = true
					if ($tr.hasClass("selected")) {
						//$input.prop("checked", false);
						//$tr.removeClass("selected");

						$ele.parents("tbody").find("tr").each(function () {
							var thisCode = $(this).find('input[type="checkbox"]').val();
							if (thisCode.substring(0, code.length) == code) {
								$(this).removeClass("selected");
								$(this).find('input[type="checkbox"]').prop("checked", false);
							}
							if ($(this).find('input[type="checkbox"]').is(":checked") != true) {
								t = false
							}
						})

					} else {
						$ele.parents("tbody").find("tr").each(function () {
							var thisCode = $(this).find('input[type="checkbox"]').val();
							if (thisCode.substring(0, code.length) == code) {
								$(this).addClass("selected");
								$(this).find('input[type="checkbox"]').prop("checked", true);
							}
							if ($(this).find('input[type="checkbox"]').is(":checked") != true) {
								t = false
							}
						})
					}
					$(".datatable-choose-checkall").attr('checked', t).prop('checked', t)
				});

				ufma.searchHideShow($('#current-data'));
				//点击新增弹出新增页面
				$("#current .btn-add").on("click", function () {
					if (page.chooseAcctFlag == true) {
						ufma.showTip('请选择账套', function () { }, 'warning');
						return false;
					} else {
						ufma.open({
							url: 'currentEdit.html',
							title: '新增',
							width: 1100,
							data: {
								action: 'add',
								ts: page.ts,
								agencyCode: searchObj.agencyCode,
								acctCode: page.acctCode,
								isAgency: searchObj.isAgency,
								distCodeData: page.distCodeData
							},
							ondestory: function (data) {
								page.pageNum = $('.current-data-paginate').find('span a.paginate_button.current').text();
								page.pageLen = parseInt($('#current-data_length').find('select').val());
								//窗口关闭时回传的值
								if (data.action == 'save') {
									var url = "/ma/sys/current/select?agencyCode=" + searchObj.agencyCode + "&acctCode=" + page.acctCode + "&enabled=" + searchObj.enable + "&chrName=" + searchObj.chrName + "&contact=" + searchObj.contact + "&ajax=1&rgCode=" + ma.rgCode + "&setYear=" + ma.setYear;
									page.getCurrentList(url, page.pageNum, page.pageLen);
								};
							}
						});
					}

				});
				$('.ufma-shopping-trolley').on('click', function (e) {
					page.getDW();
				});
				//批量删除
				$("#c-delete-more").on("click", function (e) {
					e.stopPropagation();
					if (page.chooseAcctFlag == true) {
						ufma.showTip('请选择账套', function () { }, 'warning');
						return false;
					} else {
						var checkedRow = page.getCheckedRows();
						page.actionMore('delete', checkedRow, "");
					}

				})

				//批量启用
				$('#c-start-more').on('click', function (e) {
					e.stopPropagation();
					if (page.chooseAcctFlag == true) {
						ufma.showTip('请选择账套', function () { }, 'warning');
						return false;
					} else {
						var checkedRow = page.getCheckedRows();
						page.actionMore('active', checkedRow, "");
					}
				});

				//批量停用
				$('#c-stop-more').on('click', function (e) {
					e.stopPropagation();
					if (page.chooseAcctFlag == true) {
						ufma.showTip('请选择账套', function () { }, 'warning');
						return false;
					} else {
						var checkedRow = page.getCheckedRows();
						page.actionMore('unactive', checkedRow, "");
					}

				});

				//状态按钮点击
				$("#current .cEnable").on("click", "a[name='enabled']", function () {
					if (page.chooseAcctFlag == true) {
						ufma.showTip('请选择账套', function () { }, 'warning');
						return false;
					} else {
						if (!$(this).hasClass("selected")) {
							$(this).addClass("selected").siblings().removeClass("selected");
							ufma.showloading('正在加载数据，请耐心等待...');
							searchObj.enable = $(this).attr("value");
							//判断系统级单位级
							if ($("#cbAgency").get(0)) {
								//单位级
								//							searchObj.agencyCode = page.cbAgency.getValue();
								currentDataTable.ajax.url("/ma/sys/current/select?agencyCode=" + searchObj.agencyCode + "&acctCode=" + page.acctCode + "&enabled=" + searchObj.enable + "&chrName=" + searchObj.chrName + "&contact=" + searchObj.contact).load() + "&rgCode=" + ma.rgCode + "&setYear=" + ma.setYear;
								//							currentDataTable.ajax.url("/ma/agy/current/select?agencyCode=" + searchObj.agencyCode + "&enable=" + searchObj.enable + "&chrName=" + searchObj.chrName + "&contact=" + searchObj.contact).load();
								ufma.hideloading();
							} else {
								//系统级
								currentDataTable.ajax.url("/ma/sys/current/select?agencyCode=" + searchObj.agencyCode + "&acctCode=" + page.acctCode + "&enabled=" + searchObj.enable + "&chrName=" + searchObj.chrName + "&contact=" + searchObj.contact).load() + "&rgCode=" + ma.rgCode + "&setYear=" + ma.setYear;
								ufma.hideloading();
							}
						}
						page.cancelCheckAll();
					}

				});

				//单位名称输入框
				$("#current #cAgency").focus(function () {
					$(this).val("");
				}).blur(function () {
					searchObj.chrName = encodeURI(encodeURI($(this).val()));
					//判断系统级单位级
					if ($("#cbAgency").get(0)) {
						//单位级
						//						searchObj.agencyCode = page.cbAgency.getValue();
						currentDataTable.ajax.url("/ma/sys/current/select?agencyCode=" + searchObj.agencyCode + '&acctCode=' + page.acctCode + "&enabled=" + searchObj.enable + "&chrName=" + searchObj.chrName + "&contact=" + searchObj.contact).load() + "&rgCode=" + ma.rgCode + "&setYear=" + ma.setYear;
						//						currentDataTable.ajax.url("/ma/agy/current/select?agencyCode=" + searchObj.agencyCode + "&enable=" + searchObj.enable + "&chrName=" + searchObj.chrName + "&contact=" + searchObj.contact).load();
					} else {
						//系统级
						currentDataTable.ajax.url("/ma/sys/current/select?agencyCode=" + searchObj.agencyCode + '&acctCode=' + page.acctCode + "&enabled=" + searchObj.enable + "&chrName=" + searchObj.chrName + "&contact=" + searchObj.contact).load() + "&rgCode=" + ma.rgCode + "&setYear=" + ma.setYear;
					}
				});

				//联系人输入框
				$("#current #cContact").focus(function () {
					$(this).val("");
				}).blur(function () {
					searchObj.contact = encodeURI(encodeURI($(this).val()));
					//判断系统级单位级
					if ($("#cbAgency").get(0)) {
						//单位级
						//						searchObj.agencyCode = page.cbAgency.getValue();
						currentDataTable.ajax.url("/ma/sys/current/select?agencyCode=" + searchObj.agencyCode + '&acctCode=' + page.acctCode + "&enabled=" + searchObj.enable + "&chrName=" + searchObj.chrName + "&contact=" + searchObj.contact).load() + "&rgCode=" + ma.rgCode + "&setYear=" + ma.setYear;
						//						currentDataTable.ajax.url("/ma/agy/current/select?agencyCode=" + searchObj.agencyCode + "&enable=" + searchObj.enable + "&chrName=" + searchObj.chrName + "&contact=" + searchObj.contact).load();
					} else {
						//系统级
						currentDataTable.ajax.url("/ma/sys/current/select?agencyCode=" + searchObj.agencyCode + '&acctCode=' + page.acctCode + "&enabled=" + searchObj.enable + "&chrName=" + searchObj.chrName + "&contact=" + searchObj.contact).load() + "&rgCode=" + ma.rgCode + "&setYear=" + ma.setYear;
					}
				});

				//下发
				$('#currentBtnDown').on('click', function (e) {
					e.stopPropagation();
					var gnflData = page.getCheckedRows();

					if (gnflData.length == 0) {
						ufma.alert('请选择往来单位！');
						return false;
					};
					page.modal = ufma.selectBaseTree({
						url: '/ma/sys/common/selectIssueAgencyOrAcctTree?rgCode=' + ma.rgCode + '&setYear=' + ma.setYear + '&agencyCode=' + searchObj.agencyCode + '&acctCode=' + page.acctCode + '&eleCode=CURRENT',
						rootName: '所有单位',
						title: '选择下发单位',
						bSearch: true, //是否有搜索框
						checkAll: true, //是否有全选
						filter: { //其它过滤条件
							'单位类型': { //标签
								ajax: '/ma/pub/enumerate/AGENCY_TYPE_CODE', //地址
								formControl: 'combox', //表单元素
								data: {},
								idField: 'ENU_CODE',
								textField: 'ENU_NAME',
								filterField: 'agencyType',
							}
						},
						buttons: { //底部按钮组
							'确认下发': {
								class: 'btn-primary',
								action: function (data) {
									if (data.length == 0) {
										ufma.alert('请选择单位！');
										return false;
									}
									acctAlldata = data;
									/*var dwCode = [];
									for(var i = 0; i < data.length; i++) {
										dwCode.push({
											"toAgencyCode": data[i].id
										});
									}*/
									var isAcctTruedata = [];
									var isAcctFalsedata = [];
									var isAcctLeafdata = [];
									var dwCode = [];
									if (acctAlldata) {
										if (acctAlldata.length > 0) {
											for (var i = 0; i < acctAlldata.length; i++) {
												//if(acctAlldata[i].isAcct == true && acctAlldata[i].agencyCode != '' && acctAlldata[i].isLeaf == '1') {
												//单位账套：校验条件--isAcct = true && isFinal =1;传参：toAgencyCode：传选中的单位，toAcctCode:传选中的账套--zsj
												if (acctAlldata[i].isAcct == true && acctAlldata[i].isFinal == '1') {
													chooseAcct = acctAlldata[i].code;
													chooseAgency = acctAlldata[i].agencyCode;
													isAcctTruedata.push({
														"toAgencyCode": chooseAgency,
														"toAcctCode": chooseAcct
													});
												}
											}
											for (var i = 0; i < acctAlldata.length; i++) {
												//单位：校验条件--isAcct = false && isFinal =1；传参：toAgencyCode：传选中的单位，toAcctCode:"*"--zsj
												if (acctAlldata[i].isAcct == false && acctAlldata[i].isFinal == '1') {
													chooseAgency = acctAlldata[i].code;
													chooseAcct = '*';
													isAcctFalsedata.push({
														"toAgencyCode": chooseAgency,
														"toAcctCode": chooseAcct
													});
												}
											}
										}
									}
									dwCode = isAcctTruedata.concat(isAcctFalsedata);
									var url = '/ma/sys/userData/issue';
									var argu = {
										'chrCodes': gnflData,
										'toAgencyAcctList': dwCode,
										"eleCode": 'CURRENT',
										"agencyCode": searchObj.agencyCode,
										"rgCode": ma.rgCode,
										"setYear": ma.setYear
									};
									//bug76584--zsj--经侯总确定加此类进度条
									ufma.showloading('数据下发中，请耐心等待...');
									var callback = function (result) {
										ufma.hideloading();
										//经海哥确认将所有信息显示在表格中--zsj
										//ufma.showTip(result.msg, function() {}, result.flag);
										page.modal.close();
										page.cancelCheckAll();
										page.issueTips(result);
									};
									ufma.post(url, argu, callback);
								}
							},
							'取消': {
								class: 'btn-default',
								action: function () {
									page.modal.close();
								}
							}
						}
					});
				});

				$('.btn-imp').click(function () {
					if (page.chooseAcctFlag == true) {
						ufma.showTip('请选择账套', function () { }, 'warning');
						return false;
					} else {
						var agencyCode = $(".currentAgy").length > 0 ? page.agencyCode : '*';
						var url = "/ma/general/excel/impEleDatas?eleCode=CURRENT&rgCode=" + ma.rgCode + "&agencyCode=" + agencyCode + "&acctCode=" + page.acctCode + "&setYear=" + ma.setYear;
						//查看pub内impXLS.js文件得知 这data里的参数并无作用 全部使用url后面拼接的参数
						ufma.open({
							title: '往来单位导入',
							url: '../../pub/impXLS/impXLS.html',
							width: 800,
							height: 400,
							data: {
								eleName: '往来单位',
								eleCode: 'CURRENT',
								projectName: 'ma', //这里多加了一个参数，用于区分模板所属模块
								rgCode: pfData.svRgCode,
								// agencyCode:$('body').data('code')=='agy'?pfData.svAgencyCode:'*',
								agencyCode: agencyCode,
								acctCode: page.acctCode,
								setYear: pfData.svSetYear,
								url: url
							},
							ondestory: function (rst) {
								if (rst) {
									var url = "/ma/sys/current/select?agencyCode=" + searchObj.agencyCode + '&acctCode=' + page.acctCode + "&enabled=" + searchObj.enable + "&chrName=" + searchObj.chrName + "&contact=" + searchObj.contact + "&ajax=1&rgCode=" + ma.rgCode + "&setYear=" + ma.setYear;
									page.getCurrentList(url, page.pageNum, page.pageLen);
								}
							}
						});
					}

				});
				//同步
				$('#btn-sync').on('click', function (e) {
					e.stopPropagation();
					if (page.chooseAcctFlag == true) {
						ufma.showTip('请选择账套', function () { }, 'warning');
						return false;
					} else {
						page.modal = ufma.selectBaseTree({
							url: '/ma/sys/eleAgency/getAgencyTree?rgCode=' + ma.rgCode + '&setYear=' + ma.setYear,
							rootName: '所有单位',
							title: '选择同步单位',
							bSearch: true, //是否有搜索框
							checkAll: true, //是否有全选
							filter: { //其它过滤条件
								// '单位类型': { //标签
								// 	ajax: '/ma/pub/enumerate/AGENCY_TYPE_CODE', //地址
								// 	formControl: 'combox', //表单元素
								// 	data: {},
								// 	idField: 'ENU_CODE',
								// 	textField: 'ENU_NAME',
								// 	filterField: 'agencyType',
								// }
							},
							buttons: { //底部按钮组
								'确认': {
									class: 'btn-primary',
									action: function (data) {
										if (data.length == 0) {
											ufma.alert('请选择单位！');
											return false;
										}
										var dwCode = [];
										for (var i = 0; i < data.length; i++) {
											dwCode.push(data[i].id);
										}
										var url = '/ma/sys/current/syncEleCurrentByAgency?agencyCode=' + searchObj.agencyCode + '&acctCode=' + page.acctCode;
										var argu = {
											agencyCodes: dwCode
										};
										ufma.showloading('正在加载数据，请耐心等待...');
										var callback = function (result) {
											ufma.hideloading();
											ufma.showTip(result.msg, function () { }, result.flag);
											page.modal.close();
											var dataUrl = '';
											if ($("#cbAgency").get(0)) {
												dataUrl = "/ma/sys/current/select?agencyCode=" + searchObj.agencyCode + '&acctCode=' + page.acctCode + "&enabled=-1&chrName=&contact=&ajax=1&rgCode=" + ma.rgCode + "&setYear=" + ma.setYear;
											} else {
												dataUrl = "/ma/sys/current/select?agencyCode=*&acctCode=*&enabled=-1&chrName=&contact=&ajax=1&rgCode=" + ma.rgCode + "&setYear=" + ma.setYear;
											}
											//初始化表格
											page.getCurrentList(dataUrl, page.pageNum, page.pageLen);
										};
										ufma.post(url, argu, callback);
									}
								},
								'取消': {
									class: 'btn-default',
									action: function () {
										page.modal.close();
									}
								}
							}
						});
					}

				});
				//同步体制内单位
				$('#btn-syncInner').on('click', function (e) {
					e.stopPropagation();
					if (page.chooseAcctFlag == true) {
						ufma.showTip('请选择账套', function () { }, 'warning');
						return false;
					} else {
						page.modal = ufma.selectBaseTree({
							url: '/ma/sys/currentSyn/getSynData',
							rootName: '所有单位',
							title: '选择同步体制内单位',
							bSearch: true, //是否有搜索框
							checkAll: true, //是否有全选
							filter: { //其它过滤条件
							},
							buttons: { //底部按钮组
								'确认': {
									class: 'btn-primary',
									action: function (data) {
										if (data.length == 0) {
											ufma.alert('请选择单位！');
											return false;
										}
										var url = '/ma/sys/currentSyn/synDatas';
										var argu = {
											agencyCode: searchObj.agencyCode,
											data : data
										};
										ufma.showloading('正在加载数据，请耐心等待...');
										var callback = function (result) {
											ufma.hideloading();
											ufma.showTip(result.msg, function () { }, result.flag);
											page.modal.close();
											var dataUrl = '';
											if ($("#cbAgency").get(0)) {
												dataUrl = "/ma/sys/current/select?agencyCode=" + searchObj.agencyCode + '&acctCode=' + page.acctCode + "&enabled=-1&chrName=&contact=&ajax=1&rgCode=" + ma.rgCode + "&setYear=" + ma.setYear;
											} else {
												dataUrl = "/ma/sys/current/select?agencyCode=*&acctCode=*&enabled=-1&chrName=&contact=&ajax=1&rgCode=" + ma.rgCode + "&setYear=" + ma.setYear;
											}
											//初始化表格
											page.getCurrentList(dataUrl, page.pageNum, page.pageLen);
										};
										ufma.post(url, argu, callback);
									}
								},
								'取消': {
									class: 'btn-default',
									action: function () {
										page.modal.close();
									}
								}
							}
						});
					}

				});
				$("#expfunc-choose-content").scroll(function () {
					var heitab = $("#expfunc-choose-content .tab-content").height() + 10
					var scltop = $("#expfunc-choose-content").scrollTop() + $("#expfunc-choose-content").height() - 55
					if (scltop <= heitab) {
						$("#expfunc-choose-tool-bar").css("top", scltop + 'px').css("position", 'absolute')
					} else {
						$("#expfunc-choose-tool-bar").css("top", heitab + 'px').css("position", 'absolute')
					}
				});
				// $(window).scroll(function () {
				// 	var scltop = $(window).scrollTop() + $("body").height() - 40
				// 	$("#current-tool-bar").css({
				// 		"position": "absolute",
				// 		"top": scltop + "px"
				// 	})
				// 	var heitab = $("#expfunc-choose-content .tab-content").height() + 10
				// 	var scltop = $("#expfunc-choose-content").scrollTop() + $("#expfunc-choose-content").height() - 55
				// 	if (scltop <= heitab) {
				// 		$("#expfunc-choose-tool-bar").css("top", scltop + 'px').css("position", 'absolute')
				// 	} else {
				// 		$("#expfunc-choose-tool-bar").css("top", heitab + 'px').css("position", 'absolute')
				// 	}

				// });
				//guohx 当鼠标悬浮到表头 需要显示表头线 方便拖动
				$("#current-data thead ").on("mouseover", function () {
					$("#current-data thead").find('tr:eq(0) th').each(function () {
						$(this).css("border-right", "1px solid #D9D9D9")
					})
				}).on("mouseout", function () {
					$("#current-data thead").find('tr:eq(0) th').each(function () {
						$(this).css("border-right", "none")
					})
				});
				//当出现固定表头时，悬浮加边框线 guohx 
				$("#outDiv").scroll(function () {
					$("#current-datafixed thead").on("mouseover", function () {
						$("#current-datafixed thead").find('tr:eq(0) th').each(function () {
							$(this).css("border-right", "1px solid #D9D9D9")
						})
					}).on("mouseout", function () {
						$("#current-datafixed thead").find('tr:eq(0) th').each(function () {
							$(this).css("border-right", "none")
						})
					});
				});
			},
			//获取要素的详细信息
			getEleDetail: function () {
				var argu = {
					eleCode: 'CURRENT',
					agencyCode: searchObj.agencyCode,
					rgCode: ma.rgCode,
					setYear: ma.setYear
				};
				ma.initfifa('/ma/sys/element/getEleDetail', argu, callbackFun);

				function callbackFun(data, ctrlName) {
					if (!$.isNull(ma.ruleData)) {
						page.ts = ma.ruleData.codeRule;
					}
					//本级控制下发按钮显示/隐藏
					page.agencyCtrlLevel = data.agencyCtrllevel;
					var isAcctLevel = data.isAcctLevel;
					if (isAcctLevel == '1' && page.acctFlag == true) {
						$("#cbAcct").show();
						ufma.get('/ma/sys/eleCoacc/getAcctTree/' + page.agencyCode, {
							"setYear": page.setYear,
							"rgCode": page.rgCode
						}, function (result) {
							var acctData = result.data;
							if (acctData.length > 0) {
								page.chooseAcctFlag = false;
								/*page.cbAcct = $("#cbAcct").ufmaTreecombox2({
									data: acctData,
								});*/
							} else {
								page.accsCode = '';
								page.acctCode = '';
								page.acctName = '';
								page.chooseAcctFlag = true;
							}
							page.cbAcct = $("#cbAcct").ufmaTreecombox2({
								valueField: 'code',
								textField: 'codeName',
								placeholder: '请选择账套',
								data: acctData,
								icon: 'icon-book',
								onchange: function (data) {
									page.acctCode = data.code;
									page.acctName = data.name;
									page.accsCode = data.accsCode;
									page.accsName = data.accsName;
									$("label.mt-checkbox").find('input[type="checkbox"]').prop("checked", false);
									var dataUrl = "/ma/sys/current/select?agencyCode=" + searchObj.agencyCode + '&acctCode=' + page.acctCode + "&enabled=-1&chrName=&contact=&ajax=1&rgCode=" + ma.rgCode + "&setYear=" + ma.setYear;
									page.getCurrentList(dataUrl, page.pageNum, page.pageLen);
									//缓存单位账套
									var params = {
										selAgecncyCode: page.agencyCode,
										selAgecncyName: page.agencyName,
										selAcctCode: page.acctCode,
										selAcctName: page.acctName
									}
									ufma.setSelectedVar(params);
								},
								initComplete: function (sender) {
									if (!$.isNull(page.acctCode) && page.acctCode != '*' && !$.isNull(page.acctName)) {
										page.cbAcct.val(page.acctCode, page.acctName);
									} else if (acctData.length > 0) {
										page.cbAcct.select(1);
									} else {
										page.cbAcct.val('');
										page.accsCode = '';
										page.acctCode = '';
										page.chooseAcctFlag = true;
										var dataUrl = '';
										page.getCurrentList(dataUrl, page.pageNum, page.pageLen);
										ufma.showTip('请选择账套', function () { }, 'warning');
										return false;
									}
								}
							});
						});
						//page.initAcctScc();
					} else {
						$("#cbAcct").hide();
						page.acctCode = '*';
						var dataUrl = "/ma/sys/current/select?agencyCode=" + searchObj.agencyCode + "&acctCode=*&enabled=-1&chrName=&contact=&ajax=1&rgCode=" + ma.rgCode + "&setYear=" + ma.setYear;
						page.getCurrentList(dataUrl, page.pageNum, page.pageLen);
					}
					if ($("#cbAgency").get(0) && page.isLeaf != 0) {
						//单位为末级单位时不显示下发按钮
						$(".btn-senddown").hide();
					} else {
						//非末级单位需根据控制规则显示/隐藏按钮
						//guohx 20200217 与雪蕊确认，上下级公用显示下发按钮 不区分选用还是下发
						if (page.agencyCtrlLevel == "03") {
							//上下级无关下发隐藏
							$(".btn-senddown").hide();
						} else {
							//上下级公用,下级细化可增加一级,下级细化不可增加一级下发显示
							$(".btn-senddown").show();
						}
					}
					//请求上级控制信息
					page.parentCtrlBtn(ctrlName);
					// if($("#cbAgency").get(0)) {
					// 	//单位级的
					// 	//请求上级控制信息
					// 	page.parentCtrlBtn(ctrlName);
					// } else {
					// 	$(".table-sub-info").text("提示：" + ctrlName);
					// }
					// 按钮权限控制
					isOperate = data.isOperate;
					if (isOperate == "1") {
						// 没有发现这几个按钮，先加上再说
						$(".btn-delete").addClass("disabled");
						$(".btn-start").addClass("disabled");
						$(".btn-stop").addClass("disabled");
						$(".btn-add").addClass("disabled");
						$(".btn-choose").addClass("disabled");
					}
				}
			},
			//根据上级信息控制界面新增、选用、增加下级按钮,显示/隐藏
			parentCtrlBtn: function (ctrlName) {
				//请求上级控制信息
				var argu2 = {
					agencyCode: page.agencyCode,
					eleCode: "CURRENT",
					rgCode: ma.rgCode,
					setYear: ma.setYear
				};
				ma.initfifaParent(argu2, function (data2) {
					page.agencyCtrlLevel2 = data2.agencyCtrllevel;
					var ctrlName2;
					if (page.agencyCtrlLevel2 == "0101") {
						//上下级公用下发,新增，选用，增加下级都隐藏（在表格的complete中做了控制）
						$(".btn-add").hide();
						//$(".btn-choose").hide();
						$(".btn-choose").show(); //经赵雪蕊确认能下发得单位级都能选用--zsj--CWYXM-6746
						ctrlName2 = data2.agencyCtrlName;
					} else if (page.agencyCtrlLevel2 == "0102") {
						//上下级公用选用，新增隐藏，选用显示，增加下级隐藏（在表格的complete中做了控制）
						$(".btn-choose").show();
						$(".btn-add").hide();
						ctrlName2 = data2.agencyCtrlName;
					} else if (page.agencyCtrlLevel2 == "0201") {
						//下级细化可增加一级，选用不强制，新增显示，增加下级显示（在表格的complete中做了控制）
						$(".btn-add").show();
						$(".btn-addlower").show();
						$(".btn-choose").show();
						ctrlName2 = data2.agencyCtrlName;
					} else if (page.agencyCtrlLevel2 == "0202") {
						//下级细化不可增加一级，新增显示，选用不强制，增加下级显示（在表格的complete中做了控制）
						$(".btn-add").show();
						$(".btn-addlower").hide();
						$(".btn-choose").show();
						ctrlName2 = data2.agencyCtrlName;
					} else if (page.agencyCtrlLevel2 == "03") {
						//上下级无关，新增不强制，选用隐藏，增加下级不强制（在表格的complete中做了控制）
						$(".btn-choose").hide();
						$(".btn-add").show();
						ctrlName2 = data2.agencyCtrlName;
					}

					//控制信息提示
					var newCtrlInfor = "提示：";
					// if(ctrlName2 && ctrlName){
					// 	newCtrlInfor ='<div>提示：'+ctrlName2+'</div><div>'+ctrlName+'</div>';
					// }
					newCtrlInfor = newCtrlInfor + ctrlName;
					$(".table-sub-info").html(newCtrlInfor);
				});
			},
			initCtrlLevel: function () {
				page.ts = ma.ruleData.codeRule;
			},
			//初始化单位
			initAgency: function () {
				page.cbAgency = $("#cbAgency").ufmaTreecombox2({
					leafRequire: false,
					url: "/ma/sys/eleAgency/getAgencyTree?rgCode=" + ma.rgCode + '&setYear=' + ma.setYear,
					onchange: function (data) {
						searchObj.agencyCode = data.code;
						searchObj.isAgency = true;
						//var dataUrl = "/ma/sys/current/select?agencyCode=" + searchObj.agencyCode + '&acctCode=' + page.acctCode + "&enabled=-1&chrName=&contact=&ajax=1&rgCode=" + ma.rgCode + "&setYear=" + ma.setYear;
						//初始化表格
						//page.getCurrentList(dataUrl);
						$(".datatable-group-checkable").prop("checked", false);
						page.agencyCode = data.code;
						page.agencyName = data.code;
						page.isLeaf = data.isLeaf;
						if (data.isLeaf == '0') {
							//非末级单位不显示账套选择框
							$("#cbAcct").hide();
							page.acctFlag = false;
						} else {
							$("#cbAcct").show();
							page.acctFlag = true;
						}
						page.getEleDetail();
						//缓存单位账套
						var params = {
							selAgecncyCode: page.agencyCode,
							selAgecncyName: page.agencyName,
							selAcctCode: page.acctCode,
							selAcctName: page.acctName
						}
						ufma.setSelectedVar(params);
					},
					initComplete: function (sender) {
						if (prevAgencyCode != '') {
							page.cbAgency.val(prevAgencyCode);
						} else {
							if (searchObj.agencyCode != "" && page.agencyName != "" && searchObj.agencyCode != "*" && page.agencyName != "*") {
								page.cbAgency.val(searchObj.agencyCode);
							} else {
								page.cbAgency.val(1);
							}
						}
					}
				});
			},
			//初始化账套
			initAcctScc: function () {
				/*				page.cbAcct = $("#cbAcct").ufmaTreecombox2({
									valueField: 'code',
									textField: 'codeName',
									placeholder: '请选择账套',
									icon: 'icon-book',
									onchange: function(data) {
										page.acctCode = data.code;
										page.acctName = data.name;
										page.accsCode = data.accsCode;
										page.accsName = data.accsName;
										$("label.mt-checkbox").find('input[type="checkbox"]').prop("checked", false);
										var dataUrl = "/ma/sys/current/select?agencyCode=" + searchObj.agencyCode + '&acctCode=' + page.acctCode + "&enabled=-1&chrName=&contact=&ajax=1&rgCode=" + ma.rgCode + "&setYear=" + ma.setYear;
										page.getCurrentList(dataUrl);
										//缓存单位账套
										var params = {
											selAgecncyCode: page.agencyCode,
											selAgecncyName: page.agencyName,
											selAcctCode: page.acctCode,
											selAcctName: page.acctName
										}
										ufma.setSelectedVar(params);
									},
									initComplete: function(sender) {
										if(!$.isNull(page.acctCode) && page.acctCode != '*' && !$.isNull(page.acctName)) {
											page.cbAcct.val(page.acctCode, page.acctName);
										} else {
											page.cbAcct.select(1);
										}
									}
								});*/
			},
			//此方法必须保留
			init: function () {
				page.reslist = ufma.getPermission();
				ufma.parse(page.namespace);
				this.initPage();
				// 限制高度，避免出现最外层的y轴滚动条
				setTimeout(function () {
					var centerHeight = $(window).height() - 124 - 30 - 8 - 40;
					$('#outDiv').css("height", centerHeight);
					$('#outDiv').css("width", $(".table-sub").width());
					$('#outDiv').css("overflow", "auto");
					
				}, 500)
				this.onEventListener();
				var pfData = ufma.getCommonData();
				searchObj.agencyCode = pfData.svAgencyCode;
				page.agencyName = pfData.svAgencyName;
				page.acctCode = pfData.svAcctCode;
				page.acctName = pfData.svAcctName;
				page.chooseAcctFlag = false;
				// ufma.parseScroll();
				//后台获取数据并加载
				if ($("#cbAgency").get(0)) {
					//单位级
					page.initAgency();
					//$("#c-senddown-more").hide();
				} else {
					//系统级
					searchObj.agencyCode = '*';
					searchObj.acctCode = "*";
					var dataUrl = "/ma/sys/current/select?agencyCode=*&acctCode=*&enabled=-1&chrName=&contact=&ajax=1&rgCode=" + ma.rgCode + "&setYear=" + ma.setYear;
					//初始化表格
					this.getCurrentList(dataUrl, page.pageNum, page.pageLen);
					page.getEleDetail();
				}
				// page.initCtrlLevel();
			}
		}
	}();
	/////////////////////
	page.init();
});