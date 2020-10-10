$(function () {
	var page = function () {
		var agencyCtrlLevel;
		var agencyCtrlLevelName;
		var acctAlldata;
		//        var agencyCode;
		var usedDataTable; //引用表格对象
		var oTable;
		var isOperate;
		//bug76381--zsj--若从凭证录入界面跳入此界面则此界面的单位默认为凭证录入界面的单位
		var prevAgencyCode = '';
		var sessionData = JSON.parse(window.sessionStorage.getItem("maobjData"))
		if (sessionData != undefined) {
			prevAgencyCode = sessionData.agencyCode;
			ufma.removeCache("maobjData");
		}
		return {
			agencyCode: "*",
			namespace: 'expFunc',
			get: function (tag) {
				return $('#' + this.namespace + ' ' + tag);
			},
			getFJ: function () {

			},
			getInterface: function (action) {
				var urls = {
					del: {
						type: 'delete',
						url: '/ma/sys/expFunc/delete?rgCode=' + ma.rgCode + '&setYear=' + ma.setYear
					},
					active: {
						type: 'put',
						url: '/ma/sys/expFunc/able?rgCode=' + ma.rgCode + '&setYear=' + ma.setYear
					},
					unactive: {
						type: 'put',
						url: '/ma/sys/expFunc/able?rgCode=' + ma.rgCode + '&setYear=' + ma.setYear
					},
					addlower: {
						type: 'post',
						url: '/ma/sys/common/getMaxLowerCode'
					}
				}
				return urls[action];
			},
			getDWUsedInfo: function (data, columnsArr) {
				page.usedDataTable = $('#dw-used').DataTable({
					"data": data,
					"columns": columnsArr,
					"bPaginate": false, //翻页功能
					"bLengthChange": false, //改变每页显示数据数量
					"bFilter": false, //过滤功能
					"bSort": false, //排序功能
					"bInfo": false, //页脚信息
					"bAutoWidth": false, //自动宽度
					"retrieve": true
				});
				ufma.hideloading();
				//ufma.parseScroll();

			},
			initKMTXLabels: function () {
				var url = "/ma/sys/expFunc/queryBgtType";
				var argu = {
					"rgCode": ma.rgCode,
					"setYear": ma.setYear,
					'agencyCode': page.agencyCode,
					'acctCode': page.acctCode
				};
				var $obj = $('#expfuncKMTXLabels');
				$obj.find(':not(.label-radio[value=""])').remove();
				var labelGroup = '';
				var callback = function (result) {
					$.each(result.data, function (idx, item) {
						labelGroup += '<a name="bgttypeCode" value="' + item.code + '" class="label label-radio">' + item.name + '</a>';
					});
					$(labelGroup).appendTo($obj);
				}
				ufma.get(url, argu, callback);
			},
			//CWYXM-4789 为解决表格数据庞大时导致加载出现问题，故将表格初始化 和数据 加载分开，避免界面卡顿问题--zsj
			getExpFunc: function (pageNum, pageLen) {
				ufma.showloading('数据加载中，请耐心等候...');
				var id = "expfunc-data";
				var toolBar = $('#' + id).attr('tool-bar');
				oTable = $('#' + id).dataTable({
					"language": {
						"url": bootPath + "agla-trd/datatables/datatable.default.js"
					},
					"fixedHeader": {
						header: true
					},
					//"data": result.data,
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
						title: '<label class="mt-checkbox mt-checkbox-single mt-checkbox-outline"> <input type="checkbox"' +
							'id="CheckAll" class="datatable-group-checkable CheckAll"/>&nbsp;<span></span> </label>',
						data: "chrCode"
					},
					{
						title: "功能分类编码",
						data: "chrCode",
						width: 300
					},
					{
						title: "功能分类名称",
						data: "chrName"
					},
					{
						title: "状态",
						data: "enabledName",
						width: 60
					},
					{
						title: "预算体系",
						data: "bgttypeName"
					},
					{
						title: "操作",
						data: 'chrCode',
						width: 120
					}
					],
					"columnDefs": [{
						"targets": [0],
						"serchable": false,
						"orderable": false,
						"className": "checktd",
						"render": function (data, type, rowdata, meta) {
							return '<div class="checkdiv"></div>' +
								'<label class="mt-checkbox mt-checkbox-single mt-checkbox-outline"> ' +
								'<input type="checkbox" class="checkboxes" value="' + data + '" /> &nbsp;' +
								'<span></span> </label>';
						}
					},
					{
						"targets": [1, 2, 3, 4],
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
							var active = rowdata.enabled == 1 ? 'hidden' : '';
							var unactive = rowdata.enabled == 0 ? 'hidden' : '';
							var addlower = "";
							if ($('body').attr("data-code")) {
								//上级控制本级的增加下级按钮是否显示，上下级公用下发和上下级公用选用增加下级隐藏
								if (page.agencyCtrlLevel2 != '0101' && page.agencyCtrlLevel2 != '0102') {
									addlower = "";
								} else {
									addlower = 'hidden';
								}
							} else {
								addlower = '';
							}
							if (isOperate == "1") {
								return '<a class="btn btn-icon-only btn-sm btn-permission btn-addlower" data-toggle="tooltip" ' + addlower + '  action= "addlower" rowcode="' + data + '" title="增加下级" disabled>' +
									'<span class="glyphicon icon-add-subordinate"></span></a>' +
									'<a class="btn btn-icon-only btn-sm btn-permission btn-start" data-toggle="tooltip" ' + active + ' action= "active" rowcode="' + data + '" title="启用" disabled>' +
									'<span class="glyphicon icon-play"></span></a>' +
									'<a class="btn btn-icon-only btn-sm btn-permission btn-stop" data-toggle="tooltip" ' + unactive + ' action= "unactive" rowcode="' + data + '" title="停用" disabled>' +
									// '<span class="glyphicon glyphicon icon-ban"></span></a><a class="btn btn-icon-only btn-sm btn-permission btn-delete" data-toggle="tooltip" ' + addlower + ' action= "del" rowcode="' + data + '" title="删除">' +
									'<span class="glyphicon glyphicon icon-ban"></span></a><a class="btn btn-icon-only btn-sm btn-permission btn-delete" data-toggle="tooltip" action= "del" rowcode="' + data + '" title="删除" disabled>' +
									'<span class="glyphicon icon-trash"></span></a>'
							} else {
								return '<a class="btn btn-icon-only btn-sm btn-permission btn-addlower" data-toggle="tooltip" ' + addlower + '  action= "addlower" rowcode="' + data + '" title="增加下级">' +
									'<span class="glyphicon icon-add-subordinate"></span></a>' +
									'<a class="btn btn-icon-only btn-sm btn-permission btn-start" data-toggle="tooltip" ' + active + ' action= "active" rowcode="' + data + '" title="启用">' +
									'<span class="glyphicon icon-play"></span></a>' +
									'<a class="btn btn-icon-only btn-sm btn-permission btn-stop" data-toggle="tooltip" ' + unactive + ' action= "unactive" rowcode="' + data + '" title="停用">' +
									// '<span class="glyphicon glyphicon icon-ban"></span></a><a class="btn btn-icon-only btn-sm btn-permission btn-delete" data-toggle="tooltip" ' + addlower + ' action= "del" rowcode="' + data + '" title="删除">' +
									'<span class="glyphicon glyphicon icon-ban"></span></a><a class="btn btn-icon-only btn-sm btn-permission btn-delete" data-toggle="tooltip" action= "del" rowcode="' + data + '" title="删除">' +
									'<span class="glyphicon icon-trash"></span></a>'
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
						ufma.hideloading();
						if ($('body').attr("data-code")) {

						}
						$("#printTableData").html("");
						$("#printTableData").append($(".printButtons"));

						$("#printTableData .buttons-print").attr({
							"data-toggle": "tooltip",
							"title": "打印"
						});
						$("#printTableData .buttons-excel").attr({
							"data-toggle": "tooltip",
							"title": "导出"
						});
						//导出begin
						$("#printTableData .buttons-excel").off().on('click', function (evt) {
							evt = evt || window.event;
							evt.preventDefault();
							ufma.expXLSForDatatable($('#expfunc-data'), '功能分类');
						});
						//导出end
						//加入权限class
						$("#printTableData .buttons-print").addClass(" btn-permission btn-print");
						$("#printTableData .buttons-excel").addClass(" btn-permission btn-export");

						$('#printTableData.btn-group').css("position", "inherit");
						$('#printTableData div.dt-buttons').css("position", "inherit");
						$('#printTableData [data-toggle="tooltip"]').tooltip();

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

						$(".datatable-group-checkable").prop("checked", false);
						$(".datatable-group-checkable").on('change', function () {
							var t = $(this).is(":checked");
							$('.checkboxes').each(function () {
								t ? $(this).prop("checked", !0) : $(this).prop("checked", !1);
								t ? $(this).closest('tr').addClass('selected') : $(this).closest('tr').removeClass('selected');
							});
							$(".datatable-group-checkable").prop("checked", t);

						});

						//权限控制
						ufma.isShow(page.reslist);
						$("#expfunc-data").tblcolResizable();
						//固定表头
						$("#expfunc-data").fixedTableHead($("#outDiv"));
					},
					"drawCallback": function (settings) {
						// var topHeight = $('.workspace-top').height();
						// var centerHeight = $('.workspace-center').height();
						// var tableHeight = $('#expfunc-data').height();
						// var toolBarHeight = topHeight + centerHeight - 3;
						// $("#expfunc-tool-bar").css({
						// 	"position": "absolute",
						// 	"top": toolBarHeight + "px"
						// });
						/*var scltop = $(window).scrollTop() + $("body").height() - 40
						$("#expfunc-tool-bar").css({
							"position": "absolute",
							"top": scltop + "px"
						})*/
						ufma.dtPageLength($(this));
						//权限控制
						ufma.isShow(page.reslist);

						$('#' + id).find("td.dataTables_empty").text("")
							.append('<img src="' + bootPath + 'images/noData.png"/><br/><i>目前还没有你要查询的数据</i>');

						$('#' + id + ' .btn-addlower[data-toggle="tooltip"]').tooltip();

						$('#' + id + ' .btn').on('click', function () {
							page._self = $(this);
						});
						$('#' + id + ' .btn-delete').ufTooltip({
							content: '您确定删除当前功能分类吗？',
							onYes: function () {
								ufma.showloading('数据删除中，请耐心等待...');
								page.delRowOne($(page._self).attr('action'), [$(page._self).attr('rowcode')], $(page._self).closest('tr'));
							},
							onNo: function () { }
						})
						$('#' + id + ' .btn-start').ufTooltip({
							content: '您确定启用当前功能分类吗？',
							onYes: function () {
								ufma.showloading('数据启用中，请耐心等待...');
								page.delRowOne($(page._self).attr('action'), [$(page._self).attr('rowcode')], $(page._self).closest('tr'));
							},
							onNo: function () { }
						})
						$('#' + id + ' .btn-stop').ufTooltip({
							content: '您确定停用当前功能分类吗？',
							onYes: function () {
								ufma.showloading('数据停用中，请耐心等待...');
								page.delRowOne($(page._self).attr('action'), [$(page._self).attr('rowcode')], $(page._self).closest('tr'));
							},
							onNo: function () { }
						})
						// ufma.setBarPos($(window));
					}
				});
				//翻页取消勾选
				$('#' + id).on('page.dt', function () {
					$(".datatable-group-checkable,.checkboxes").prop("checked", false);
					$('#' + id).find("tbody tr.selected").removeClass("selected");
				});
				//ufma.hideloading();
				//	};
			},
			//queryList: function(argu, callback) {
			//CWYXM-4789 为解决表格数据庞大时导致加载出现问题，故将表格初始化 和数据 加载分开，避免界面卡顿问题--zsj
			queryList: function () {
				if (page.chooseAcctFlag == true) {
					oTable.fnClearTable();
					var data = [];
					if (data.length != 0) {
						oTable.fnAddData(data, true);
					}
					ufma.showTip('请选择账套', function () { }, 'warning');
					return false;
				} else {
					ufma.showloading('正在请求数据，请耐心等待...');
					var argu = $('#query-tj').serializeObject();
					if ($('body').data("code")) {
						ufma.get("/ma/sys/expFunc/queryList?rgCode=" + ma.rgCode + "&setYear=" + ma.setYear + "&agencyCode=" + page.agencyCode + "&acctCode=" + page.acctCode, argu, function (result) {
							oTable.fnClearTable();
							if (result.data.length != 0) {
								oTable.fnAddData(result.data, true);
							}
							ufma.hideloading();
							// ufma.setBarPos($(window));
						});
					} else {
						ufma.get("/ma/sys/expFunc/queryList?rgCode=" + ma.rgCode + "&setYear=" + ma.setYear + "&agencyCode=*" + "&acctCode=*", argu, function (result) {
							oTable.fnClearTable();
							if (result.data.length != 0) {
								oTable.fnAddData(result.data, true);
							}
							ufma.hideloading();
							// ufma.setBarPos($(window));
						});
					}
				}

			},

			//选用页面初始化
			getExpFuncChoose: function () {
				// var argu = $('#query-tj').serializeObject();
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
						//                        "fixedHeader": {
						//    				        header: true
						//    				    },
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
							title: "功能分类编码",
							data: "code"
						},
						{
							title: "功能分类名称",
							data: "name"
						},
						{
							title: "状态",
							data: "enabledName"
						},
						{
							title: "预算体系",
							data: "bgttypeName"
						},
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
									return '<span style="color:#00A854">' + data + '</span>';
								} else {
									return '<span style="color:#F04134">' + data + '</span>';
								}
							}
						}
						],
						//"dom": 'rt<"tableBottom"<"tool-bar-body"<"ufma-tool-btns"><"info"<"' + id + '-paginate"ilp>>>>',
						"dom": 'rt<"' + id + '-paginate"ilp>',
						"initComplete": function (settings, json) {

							/*var $info = $(toolBar + ' .info');
							if ($info.length == 0) {
							    $info = $('<div class="info"></div>').appendTo($(toolBar + ' .tool-bar-body'));
							}
							$info.html('');
							$('.' + id + '-paginate').appendTo($info);*/

							//权限控制
							ufma.isShow(page.reslist);
							var $info = $(toolBar + ' .info');
							if ($info.length == 0) {
								$info = $('<div class="info"></div>').appendTo($(toolBar + ' .tool-bar-body'));
							}
							$info.html('');
							$('[data-toggle="tooltip"]').tooltip();
							$('.' + id + '-paginate').appendTo($info);
							//bugCWYXM-4847-解决复选框选不中问题--zsj
							/*$('#' + id + ' tbody td').on('click', function(e) {
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
							})*/
							/*var heitab = $("#expfunc-choose-content .tab-content").height() + 10
							var scltop = $("#expfunc-choose-content").scrollTop() + $("#expfunc-choose-content").height() - 55
							if(scltop <= heitab) {
								$("#expfunc-choose-tool-bar").css("top", scltop + 'px').css("position", 'absolute')
							} else {
								$("#expfunc-choose-tool-bar").css("top", heitab + 'px').css("position", 'absolute')
							}*/
						},
						"drawCallback": function (settings) {
							var heitab = $("#expfunc-choose-content .tab-content").height() + 10
							var scltop = $("#expfunc-choose-content").scrollTop() + $("#expfunc-choose-content").height() - 55
							if (scltop <= heitab) {
								$("#expfunc-choose-tool-bar").css("top", scltop + 'px').css("position", 'absolute')
							} else {
								$("#expfunc-choose-tool-bar").css("top", heitab + 'px').css("position", 'absolute')
							}
							ufma.dtPageLength($(this));

							//权限控制
							ufma.isShow(page.reslist);
							$('#' + id).find("td.dataTables_empty").text("")
								.append('<img src="' + bootPath + 'images/noData.png"/><br/><i>目前还没有你要查询的数据</i>');

							$(".datatable-choose-checkall").prop("checked", false);
							$(".datatable-choose-checkall").on('change', function () {
								var t = $(this).is(":checked");
								$('#' + id).find('.checkboxes').each(function () {
									t ? $(this).prop("checked", !0) : $(this).prop("checked", !1);
									t ? $(this).closest('tr').addClass('selected') : $(this).closest('tr').removeClass('selected');
								});
								$(".datatable-choose-checkall").prop("checked", t);
							});
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
				// ufma.get("/ma/sys/expFunc/queryList?rgCode=" + ma.rgCode + "&setYear=" + ma.setYear, argu, callback);

				var argu = {
					rgCode: ma.rgCode,
					setYear: ma.setYear,
					agencyCode: page.agencyCode,
					acctCode: page.acctCode,
					eleCode: "EXPFUNC",
					bgttypeCode: $("a[name='bgttypeCode'][class='label label-radio selected']").attr("value")
				};
				ufma.get("/ma/sys/common/getCanIssueEleTree", argu, callback);
			},

			//删除、启用、停用、批量操作  增加下级
			delRow: function (action, idArray, $tr) {
				var options = this.getInterface(action);
				page.pageNum = $('#expfunc-data_paginate').find('span a.paginate_button.current').text();
				page.pageLen = parseInt($('#expfunc-data_length').find('select').val());
				var argu = {
					chrCodes: idArray,
					action: action,
					acctCode: page.acctCode,
					agencyCode: page.agencyCode,
					acctCode: page.acctCode
				};
				var callback = function (result) {
					if (action == 'del') {
						if ($tr)
							$tr.remove();
						else {
							//page.getExpFunc(page.pageNum, page.pageLen);
							page.queryList();
						}
						if (result.flag == 'success') {

							ufma.showTip('删除成功！', function () { }, 'success'); //guohx 增加删除成功提示
						}
					} else {
						/* 此处为批量操作，此段代码导致批量操作成功后没有相应提示，故注释此段代码--zsj
						 * if ($tr) {
						     $tr.find('.btn[action="active"]').attr('disabled', action == "active");
						     $tr.find('.btn[action="unactive"]').attr('disabled', action == "unactive");
						 */
						if (action == 'active') {
							if (result.flag == 'success') {
								ufma.hideloading();
								ufma.showTip('启用成功', function () { }, 'success');
								//page.getExpFunc(page.pageNum, page.pageLen);
								page.queryList();
							}
						} else if (action == 'unactive') {
							if (result.flag == 'success') {
								ufma.hideloading();
								ufma.showTip('停用成功！', function () { }, 'success');
								//page.getExpFunc(page.pageNum, page.pageLen);
								page.queryList();
							}
						}
						/* } else {
						     page.getExpFunc(page.pageNum, page.pageLen);
						 }*/
					}
					page.cancelCheckAll();
				};
				if (action == 'del') {
					ufma.confirm('您确定要删除选中的功能分类吗？', function (action) {
						if (action) {
							ufma.showloading('数据删除中，请耐心等待...');
							//单位级
							argu.agencyCode = page.agencyCode;
							argu.acctCode = page.acctCode;
							if (page.agencyCode != "*") {
								//								options.url = "/ma/agy/expFunc/delete?rgCode=" + ma.rgCode + "&setYear=" + ma.setYear;
								options.url = "/ma/sys/expFunc/delete?rgCode=" + ma.rgCode + "&setYear=" + ma.setYear;
							}

							ufma.ajax(options.url, options.type, argu, callback);
						}
					}, {
							type: 'warning'
						});
				} else if (action == 'addlower') {
					//$('#expFunc-chrCode').trigger('click');
					/*  $('#expFunc-chrCode').trigger('change');
					  $('#expFunc-chrCode').trigger('paste');
					  $('#expFunc-chrCode').trigger('keyup');*/
					var newArgu = {}
					newArgu.chrCode = argu.chrCodes[0];
					newArgu.eleCode = "EXPFUNC";
					newArgu.agencyCode = page.agencyCode;
					newArgu.acctCode = page.acctCode;
					newArgu.rgCode = ma.rgCode
					newArgu.setYear = ma.setYear
					if (page.agencyCode != "*") {
						options.url = "/ma/sys/common/getMaxLowerCode"
					}
					ufma.ajax(options.url, options.type, newArgu, function (result) {
						var data = result.data;
						ma.isRuled = true;
						//CZSB-3051【系统资料管理】【功能分类】进入某个功能分类的编辑页面，关闭编辑页面，点击另一条记录的增加下级图标 guohx 20200826
						$('#form-expfunc')[0].reset();
						$("#expFunc-chrCode").val(data)

						page.action = "addlower";
						page.openEdtWin();
						//$('#expFunc-chrCode').trigger('blur');

					});
				} else if (action == 'active') {
					ufma.confirm('您确定要启用选中的功能分类吗？', function (action) {
						if (action) {
							ufma.showloading('数据启用中，请耐心等待...');
							//单位级
							argu.agencyCode = page.agencyCode;
							argu.acctCode = page.acctCode;
							if (page.agencyCode != "*") {
								options.url = "/ma/sys/expFunc/able?rgCode=" + ma.rgCode + "&setYear=" + ma.setYear;
							}
							ufma.ajax(options.url, options.type, argu, callback);
						}
					}, {
							type: 'warning'
						});
				} else if (action == 'unactive') {
					ufma.confirm('您确定要停用选中的功能分类吗？', function (action) {
						if (action) {
							ufma.showloading('数据停用中，请耐心等待...');
							//单位级
							argu.agencyCode = page.agencyCode;
							argu.acctCode = page.acctCode;
							if (page.agencyCode != "*") {
								options.url = "/ma/sys/expFunc/able?rgCode=" + ma.rgCode + "&setYear=" + ma.setYear;
							}
							ufma.ajax(options.url, options.type, argu, callback);
						}
					}, {
							type: 'warning'
						});
				}
			},
			delRowOne: function (action, idArray, $tr) {
				var options = this.getInterface(action);
				page.pageNum = $('#expfunc-data_paginate').find('span a.paginate_button.current').text();
				page.pageLen = parseInt($('#expfunc-data_length').find('select').val());
				var argu = {
					agencyCode: page.agencyCode,
					acctCode: page.acctCode,
					chrCodes: idArray,
					action: action,
					rgCode: ma.rgCode,
					setYear: ma.setYear
				};
				var callback = function (result) {
					if (action == 'del') {
						/*不重新加载，删除父亲结点
						if ($tr)
						    $tr.remove();
						else
						*/
						//page.getExpFunc(page.pageNum, page.pageLen);
						page.queryList();
						if (result.flag == 'success') {
							ufma.hideloading();
							ufma.showTip('删除成功！', function () { }, 'success'); //guohx 增加删除成功提示
						}
					} else {
						if ($tr) {
							$tr.find('.btn[action="active"]').attr('disabled', action == "active");
							$tr.find('.btn[action="unactive"]').attr('disabled', action == "unactive");
							//page.getExpFunc(page.pageNum, page.pageLen);
							page.queryList();
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
						} else {
							//page.getExpFunc(page.pageNum, page.pageLen);
							page.queryList();
						}
					}
				};
				if (action == 'del') {
					//单位级
					argu.agencyCode = page.agencyCode;
					argu.acctCode = page.acctCode;
					if (page.agencyCode != "*") {
						//						options.url = "/ma/agy/expFunc/delete?rgCode=" + ma.rgCode + "&setYear=" + ma.setYear;
						options.url = "/ma/sys/expFunc/delete?rgCode=" + ma.rgCode + "&setYear=" + ma.setYear;
					}
					ufma.ajax(options.url, options.type, argu, callback);
				} else {
					//单位级
					argu.agencyCode = page.agencyCode;
					argu.acctCode = page.acctCode;
					if (page.agencyCode != "*") {
						//						options.url = "/ma/agy/expFunc/able?rgCode=" + ma.rgCode + "&setYear=" + ma.setYear;
						options.url = "/ma/sys/expFunc/able?rgCode=" + ma.rgCode + "&setYear=" + ma.setYear;
					}
					ufma.ajax(options.url, options.type, argu, callback);
				}
			},
			getCheckedRows: function () {
				var checkedArray = [];
				$('#expfunc-data .checkboxes:checked').each(function () {
					checkedArray.push($(this).val());
				});
				return checkedArray;
			},
			getChooseCheckedRows: function () {
				var checkedArray = [];
				$('#expfunc-choose-datatable .checkboxes:checked').each(function () {
					checkedArray.push($(this).val());
				});
				return checkedArray;
			},
			openEdtWin: function (data) {
				ma.defaultRightInfor("expfunc-help", "支出功能分类")
				if ($('body').attr('data-code') && page.action == 'edit') {
					page.chrId = data.chrId;
				}
				if (page.action == 'edit') {
					//ma.isEdit为true，编辑回显，校验编码不显示错误信息
					ma.isEdit = true;
				}
				if (page.action == 'edit' || page.action == 'addlower') {
					if (page.action == 'addlower') {
						$("#expFunc-chrCode").removeAttr('disabled')
						//$('#expFunc-chrName').val('')
					}
					var thisCode = $("#expFunc-chrCode").val();
					if ($("#expFunc-chrCode") != "" && thisCode != "") {
						var obj = {
							"chrCode": thisCode,
							"tableName": "MA_ELE_EXPFUNC",
							"eleCode": "EXPFUNC",
							"rgCode": ma.rgCode,
							"setYear": ma.setYear,
							"acctCode": page.acctCode,
							"agencyCode": page.agencyCode
						}
						ma.nameTip = "";
						if (data != undefined) {
							ma.nameTip = data.chrFullname;
						}
					}
				}
				if (data != undefined) {
					ufma['expFunc-bgttypeCode'].val(data.bgttypeCode).trigger("change");
				}
				$('.u-msg-footer button').removeAttr('disabled')
				if (page.action == 'add') {
					data.chrId = "";
					data.chrCode = "";
					data.chrName = "";
					data.lastVer = "";
					$("form input[type='hidden']").val("");
					$(".input-help-block").html("");
					$('#form-expfunc')[0].reset();
				}
				page.editor = ufma.showModal('expfunc-edt', 800, 420);
				page.formdata = data;
				if (page.formdata) {
					for (var i = 1; i < 6; i++) {
						if (page.formdata["field" + i] == null) {
							page.formdata["field" + i] = ''
						}
					}
				}
				if ($('.btn-save').prop('display') == 'none') {
					$('#form-expfunc').disable()
				}
				$('#prompt').text('编码规则：' + ma.fjfa);
				//bugCWYXM-4106--要素为无编码规则时,基础数据维护,新增数据,保存时,提示新增无编码规则不符合分级规则--zsj
				//编码验证
				ma.codeValidator('expFunc-chrCode', '功能分类', '/ma/sys/common/findParentList?eleCode=EXPFUNC&acctCode=' + page.acctCode, page.agencyCode, page.acctCode, "expfunc-help");
				//名称验证
				ma.nameValidator('expFunc-chrName', '功能分类');
				//bugCWYXM-4119--公共要素下助记码在新建时会自动带入,且不能删掉--zsj
				if (page.action == 'edit') {
					setTimeout(function () {
						$('#assCode').val(data.assCode);
					}, 500)
				}
			},
			openChooseWin: function () {
				page.choosePage = ufma.showModal('expfunc-choose', 1000, 500);
			},
			bsAndEdt: function (data) {
				page.action = 'edit';
				$('#expFunc-chrCode').attr('disabled', true);
				$("#field1").ufmaTreecombox().setValue("", "");
				$("#field2").ufmaTreecombox().setValue("", "");
				$("#field3").ufmaTreecombox().setValue("", "");
				$("#field4").ufmaTreecombox().setValue("", "");
				$("#field5").ufmaTreecombox().setValue("", "");
				ufma.deferred(function () {
					$('#form-expfunc').setForm(data);
					$("#field1").ufmaTreecombox().val(data.field1);
					$("#field2").ufmaTreecombox().val(data.field2);
					$("#field3").ufmaTreecombox().val(data.field3);
					$("#field4").ufmaTreecombox().val(data.field4);
					$("#field5").ufmaTreecombox().val(data.field5);
				});
				this.openEdtWin(data);
				page.setFormEnabled();
			},
			save: function (goon) {
				//$("button").attr("disabled",true);
				page.pageNum = $('#expfunc-data_paginate').find('span a.paginate_button.current').text();
				page.pageLen = parseInt($('#expfunc-data_length').find('select').val());
				if (!ma.formValidator("expFunc-chrCode", "expFunc-chrName", "功能分类", page.action)) {
					return false;
				}
				ufma.showloading('数据保存中，请耐心等待...');
				var argu = $('#form-expfunc').serializeObject();
				argu.agencyCode = page.agencyCode;
				if ($("#expFunc-chrCode").val().length == parseInt(ma.fjfa.substring(0, 1))) {
					argu["chrFullname"] = $("#expFunc-chrName").val();
				} else {
					argu["chrFullname"] = ma.nameTip + "/" + $("#expFunc-chrName").val();
				}
				var callback = function (result) {
					ufma.hideloading();
					//$("button").attr("disabled", false);
					$("[name='chrId']").val('');
					$("[name='lastVer']").val('');
					$('#expFunc-chrCode').removeAttr('disabled');
					//	page.getExpFunc(page.pageNum, page.pageLen);
					page.queryList();
					if (!goon) {
						ufma.showTip('保存成功！', function () { }, 'success');
						$('#form-expfunc')[0].reset();
						page.editor.close();
						$('.form-group').removeClass('error')
						$('#expFunc-chrCode-help').remove()

					} else {
						ufma.showTip('保存成功,您可以继续添加功能分类！', function () { }, 'success');
						$('#form-expfunc')[0].reset();
						$("#expFunc-chrCode").removeAttr("disabled");
						page.formdata = $('#form-expfunc').serializeObject();

						ma.fillWithBrother($('#expFunc-chrCode'), {
							"chrCode": argu.chrCode,
							"eleCode": "EXPFUNC",
							"agencyCode": page.agencyCode,
							"acctCode": page.acctCode
						});
					}
				}
				var url = "";
				if (page.agencyCode == "*") {
					argu.rgCode = ma.rgCode;
					argu.setYear = ma.setYear;
					argu.acctCode = '*';
					url = '/ma/sys/expFunc/save?rgCode=' + ma.rgCode + '&setYear=' + ma.setYear;
				} else {
					if (page.chrId != undefined) {
						argu.chrId = page.chrId;
					} else {
						argu.chrId = '';
					}
					argu.rgCode = ma.rgCode;
					argu.setYear = ma.setYear;
					argu.acctCode = page.acctCode;
					//					url = '/ma/agy/expFunc/save?rgCode=' + ma.rgCode + '&setYear=' + ma.setYear;
					url = '/ma/sys/expFunc/save?rgCode=' + ma.rgCode + '&setYear=' + ma.setYear;
				}
				ufma.post(url, argu, callback);
			},
			setFormEnabled: function () {
				if (page.action == 'edit') {
					if ($('body').data("code")) {
						if (page.agencyCtrlLevel == "0101" || page.agencyCtrlLevel == "0102") {
							$('#expFunc-chrName').attr('disabled', 'disabled');
							// $('#expfunc-edt label.btn').attr('disabled', 'disabled');
							$("#expfunc-edt .btn-saveadd,#expfunc-edt .btn-save").hide();
							$("#expFunc-bgttypeCode").prop("disabled", true);
						} else {
							$('#expFunc-chrName').removeAttr('disabled');
							// $('#expfunc-edt label.btn').removeAttr('disabled');
							$("#expfunc-edt .btn-saveadd,#expfunc-edt .btn-save").show();
							$("#expFunc-bgttypeCode").prop("disabled", false);
						}
					} else {
						$('#expfunc-chrName').removeAttr('disabled');
						//$('#expfunc-edt label.btn').removeAttr('disabled');
						$("#expfunc-edt .btn-saveadd,#expfunc-edt .btn-save").show();
						$("#expFunc-bgttypeCode").prop("disabled", false);
					}

					$(document).find('.form-group').each(function () {
						$(this).removeClass('error');
						$(this).find(".input-help-block").remove();
					});
					//平台维护不可修改
					if (isOperate == "1") {
						$("#form-expfunc").disable();
						$(".btn-saveadd").addClass("disabled");
						$(".btn-save").addClass("disabled");
					}
				} else if (page.action == 'add') {
					$('#form-expfunc')[0].reset();
					$('#expFunc-chrCode').removeAttr('disabled');
					$('.form-group').removeClass('error');
					$('#expFunc-chrCode-help').remove()

				}
				ma.isRuled = true;

			},
			getCoaAccList: function (pageNum, pageLen) {
				//全部即acceCode为空
				page.acceCode = $('#tabAcce').find("li.active a").attr("value");
				page.acceName = $('#tabAcce').find("li.active a").text();
				var argu = $('#query-tj').serializeObject();
				//判断是否是通过链接打开
				if (page.fromChrCode != null && page.fromChrCode != "") {
					argu.accsCode = page.fromChrCode;
					//第一次加载时使用传送过来的code，以后根据查询条件
					page.fromChrCode = "";
				}
				var argu1 = {}
				argu1["agencyCode"] = page.agencyCode;
				argu1["acctCode"] = page.acctCode;
				argu1["acceCode"] = page.acceCode;
				argu1['accsCode'] = page.accsCode;
				if (page.isLeaf != 1) {
					argu1["acctCode"] = "";
				}
				argu1["rgCode"] = ma.rgCode;
				argu1['setYear'] = ma.setYear;
				ufma.get("/ma/sys/coaAccSys/queryAccoTable", argu1, function (result) {
					//page.renderTable(result, pageNum, pageLen);
				});
			},
			issueTips: function (data, isCallBack) {
				var title = "";
				if (isCallBack) {
					title = "选用结果";
				} else {
					title = "下发结果";
				}
				data.colName = '支出功能分类';
				data.pageType = 'EXPFUNC';
				ufma.open({
					url: '../maCommon/issueTips.html',
					title: title,
					width: 1100,
					data: data,
					ondestory: function (data) {
						//窗口关闭时回传的值;
						if (isCallBack) {
							page.getCoaAccList(page.pageNum, page.pageLen);
							page.queryList();
						}
					}
				});
			},
			onEventListener: function () {
				//列表页面表格行操作绑定
				$('#expfunc-data').on('click', 'tbody td:not(.btnGroup)', function (e) {
					e.preventDefault();
					var $ele = $(e.target);
					if ($ele.is('a')) {
						page.bsAndEdt($ele.data('href'));
						return false;
					}
					var $tr = $ele.closest('tr');
					var $input = $ele.closest('tr').find('input[type="checkbox"]');
					var code = $input.val();
					var t = true
					if ($tr.hasClass("selected")) {
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
					$(".datatable-group-checkable").attr('checked', t).prop('checked', t)
				});
				$('.ufma-shopping-trolley.right').on('click', function (e) {
					ufma.showloading("正在加载数据，请耐心等待...")
					var chrCodes = [];
					$('#expfunc-data').find(".selected").each(function () {
						var code = $(this).find("input.checkboxes").val();
						chrCodes.push(code);
					});
					if (chrCodes.length > 0) {
						var argu = {
							"rgCode": ma.rgCode,
							"setYear": ma.setYear,
							'agencyCode': page.agencyCode,
							"chrCodes": chrCodes,
							'eleCode': 'EXPFUNC'
						}
						ufma.post("/ma/sys/common/countAgencyUse", argu, function (result) {
							var data = result.data;
							var columnsArr = [{
								data: "issuedCount",
								title: "使用",
								width: "50px"
							},
							{
								data: "agencyCode",
								title: "单位代码"
							},
							{
								data: "agencyName",
								title: "单位名称",
								width: "140px"
							}
							];

							var isRight = true;
							if (data != null && data != "null") {
								if (data.length > 0) {
									for (var i = 0; i < data.length; i++) {
										console.info(JSON.stringify(data[i]));
										//										if(!data[i].hasOwnProperty("chrCode")) {
										//											console.info("第" + i + "条数据的chrCode(" + data[i].chrCode + ")字段不存在！");
										//											isRight = false;
										//											return false;
										//										}
										if (!data[i].hasOwnProperty("agencyCode")) {
											console.info("第" + i + "条数据的agencyCode(" + data[i].agencyCode + ")字段不存在！");
											isRight = false;
											return false;
										}
										if (!data[i].hasOwnProperty("agencyName")) {
											console.info("第" + i + "条数据的agencyName(" + data[i].agencyName + ")字段不存在！");
											isRight = false;
											return false;
										}
									}
								}
							} else {
								console.info(data + ":格式不正确！");
								isRight = false;
								return false;
							}

							if (isRight) {
								page.usedDataTable.clear().destroy();
								page.getDWUsedInfo(data, columnsArr);
							} else {
								ufma.alert("后台数据格式不正确！", "error");
								return false;
							}

						});
					} else {
						//购物车表格初始化
						if (page.usedDataTable) {
							page.usedDataTable.clear().destroy();
						}
						page.reqInitRightIssueAgy();
					}

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
				//71560 --【农业部】辅助核算和会计科目目前不能设置“助记码”--当用户输入名称后，助记码应自动填充由名称首字母的大写字母组成的字符串--zsj
				$('#expFunc-chrName').on('blur', function () {
					var chrNameValue = $(this).val();
					ufma.post('/pub/util/String2Alpha', {
						"chinese": chrNameValue
					}, function (result) {
						if (result.data.length > 42) {
							var data = result.data.substring(0, 41);
							$('#assCode').val(data);
						} else {
							$('#assCode').val(result.data);
						}
					});
				});
				//ufma.searchHideShow($('#expfunc-data'));
				ma.searchHideShow('index-search', '#expfunc-data', 'searchHideBtn');
				ma.searchHideShow('choose-search', '#expfunc-choose-datatable', 'searchHideChooseBtn');

				$('.btn-add').on('click', function (e) {
					if (page.chooseAcctFlag == true) {
						ufma.showTip('请选择账套', function () { }, 'warning');
						return false;
					} else {
						e.preventDefault();
						page.action = 'add';
						var data = $('#form-expfunc').serializeObject();
						page.setFormEnabled();
						page.openEdtWin(data);
					}
				});
				$('.btn-close').on('click', function () {
					var tmpFormData = $('#form-expfunc').serializeObject();
					if (!ufma.jsonContained(page.formdata, tmpFormData) && $('.btn-save').prop('display') != 'none') {
						ufma.confirm('您修改了功能分类信息，关闭前是否保存？', function (action) {
							if (action) {
								page.save(false);
							} else {
								page.editor.close();
								$('.form-group').removeClass('error')
								$('#expFunc-chrCode-help').remove()
							}
						}, {
								type: 'warning'
							});
					} else {
						page.editor.close();
						$('.form-group').removeClass('error')
						$('#expFunc-chrCode-help').remove()
					}
				});
				//保存
				$('.btn-saveadd').on('click', function () {
					page.save(true);
				});
				$('.btn-save').on('click', function () {
					page.save(false);
				});
				$(document).on('click', '.label-radio', function (e) {
					e = e || window.event;
					e.stopPropagation();
					if (page.chooseAcctFlag == true) {
						ufma.showTip('请选择账套', function () { }, 'warning');
						return false;
					} else {
						ufma.deferred(function () {
							page.queryList();
							page.cancelCheckAll();
						});
					}

				});
				/*事件放在这里莫明其妙
				$("body").on("click", '.u-msg-footer button', function(e) {
				    if(page.agencyCode != "*") {
				        //编码验证
				        ma.codeValidator('expFunc-chrCode', '功能分类', '/ma/agy/expFunc/findParentList', page.agencyCode, "expfunc-help");

				        //名称验证
				        ma.nameValidator('expFunc-chrName', '功能分类');
				    } else {
				        //编码验证
				        ma.codeValidator('expFunc-chrCode', '功能分类', '/ma/sys/expFunc/findParentList', page.agencyCode, "expfunc-help");

				        //名称验证
				        ma.nameValidator('expFunc-chrName', '功能分类');
				    }
				});
				*/
				$('.btn-delete').on('click', function (e) {
					e.stopPropagation();
					if (page.chooseAcctFlag == true) {
						ufma.showTip('请选择账套', function () { }, 'warning');
						return false;
					} else {
						var checkedRow = page.getCheckedRows();
						if (checkedRow.length == 0) {
							ufma.alert('请选择功能分类！', "warning");
							return false;
						}
						page.delRow('del', checkedRow);
					}
				});
				$('.btn-start').on('click', function (e) {
					e.stopPropagation();
					if (page.chooseAcctFlag == true) {
						ufma.showTip('请选择账套', function () { }, 'warning');
						return false;
					} else {
						var checkedRow = page.getCheckedRows();
						if (checkedRow.length == 0) {
							ufma.alert('请选择功能分类！', "warning");
							return false;
						}
						page.delRow('active', checkedRow);
					}

				});
				$('.btn-stop').on('click', function (e) {
					e.stopPropagation();
					if (page.chooseAcctFlag == true) {
						ufma.showTip('请选择账套', function () { }, 'warning');
						return false;
					} else {
						var checkedRow = page.getCheckedRows();
						if (checkedRow.length == 0) {
							ufma.alert('请选择功能分类！', "warning");
							return false;
						}
						page.delRow('unactive', checkedRow);
					}

				});
				//增加下级
				$('body').on('click', '.btn-addlower', function (e) {
					e.stopPropagation();
					var checkedRow = [];
					checkedRow.push($(this).parents("tr").find("input").val());
					page.chrId = ''
					page.delRow('addlower', checkedRow);

				});
				//下发
				$('.btn-senddown').on('click', function (e) {
					e.stopPropagation();
					var gnflData = page.getCheckedRows();
					if (gnflData.length == 0) {
						ufma.alert('请选择功能分类！', "warning");
						return false;
					}
					page.modal = ufma.selectBaseTree({
						url: '/ma/sys/common/selectIssueAgencyOrAcctTree?rgCode=' + ma.rgCode + '&setYear=' + ma.setYear + '&agencyCode=' + page.agencyCode + '&acctCode=' + page.acctCode + '&eleCode=EXPFUNC',
						rootName: '所有单位',
						title: '选择下发单位或账套',
						bSearch: true, //是否有搜索框
						checkAll: true, //是否有全选
						filter: { //其它过滤条件
							'单位类型': { //标签
								ajax: '/ma/pub/enumerate/AGENCY_TYPE_CODE?rgCode=' + ma.rgCode + '&setYear=' + ma.setYear + '&agencyCode=' + page.agencyCode + '&acctCode=' + page.acctCode, //地址
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
										ufma.alert('请选择单位或账套！', "warning");
										return false;
									}
									acctAlldata = data;
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
									var url = '/ma/sys/expFunc/issue';
									var argu = {
										'chrCodes': gnflData,
										'toAgencyAcctList': dwCode,
										"agencyCode": page.agencyCode,
										"rgCode": ma.rgCode,
										"setYear": ma.setYear,
										"eleCode": 'EXPFUNC'
									};
									//bug76584--zsj--经侯总确定加此类进度条
									ufma.showloading('数据下发中，请耐心等待...');
									var callback = function (result) {
										ufma.hideloading();
										page.modal.close();
										//经海哥确认将所有信息显示在表格中--zsj
										//ufma.showTip(result.msg, function() {}, result.flag);
										page.cancelCheckAll();
										page.issueTips(result);
									};
									ufma.post(url, argu, callback);
									//下发后取消全选
									$(".datatable-group-checkable,.checkboxes").prop("checked", false);
									$("#expfunc-data").find("tbody tr.selected").removeClass("selected");
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

				//"单位级页面监听------------"
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
							height: 500,
							data: {
								getUrl: '/ma/sys/common/getCanIssueEleTree',
								useUrl: "/ma/sys/common/issue",
								pageName: '支出功能分类',
								rgCode: ma.rgCode,
								setYear: ma.setYear,
								agencyCode: page.agencyCode,
								acctCode: page.acctCode,
								eleCode: 'EXPFUNC',
								bgttypeCode: $("a[name='bgttypeCode'][class='label label-radio selected']").attr("value")
							},
							ondestory: function (result) {
								if (result.action) {
									page.issueTips(result, true);
								}
							}
						});
					}

				});

				//选用
				$('.btn-agyChoose').on('click', function (e) {
					var checkRow = page.getChooseCheckedRows();
					if (!$.isNull(checkRow) && checkRow.length == 0) {
						ufma.showTip('请选择支出功能分类', function () {
							return false;
						}, 'warning');
					} else {
						var toAgencyAcctList = [];
						toAgencyAcctList.push({
							toAgencyCode: page.agencyCode,
							toAcctCode: page.acctCode
						});
						var argu = {
							"chrCodes": checkRow,
							"toAgencyAcctList": toAgencyAcctList,
							"agencyCode": page.issueAgecyCode,
							"rgCode": ma.rgCode,
							"setYear": ma.setYear
						};
						var url = "/ma/sys/expFunc/issue";
						var callback = function (result) {
							/*if(result.flag == "success") {
								ufma.showTip("选用成功", function() {
									page.choosePage.close();
									page.initPage();
								}, 'success');
								page.issueTips(result, true);
								//page.getExpFunc(page.pageNum, page.pageLen);
								page.queryList();
							} else {
								ufma.alert(result.msg, "error");
								return false;
							}*/
							page.choosePage.close();
							page.initPage();
							page.issueTips(result, true);
							page.queryList();
						};
						ufma.post(url, argu, callback);
					}

				});

				$('.btn-agyClose').on('click', function (e) {
					e.preventDefault();
					page.choosePage.close();
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
				//guohx 当鼠标悬浮到表头 需要显示表头线 方便拖动
				$("#expfunc-data thead ").on("mouseover", function () {
					$("#expfunc-data thead").find('tr:eq(0) th').each(function () {
						$(this).css("border-right", "1px solid #D9D9D9")
					})
				}).on("mouseout", function () {
					$("#expfunc-data thead").find('tr:eq(0) th').each(function () {
						$(this).css("border-right", "none")
					})
				});
				//当出现固定表头时，悬浮加边框线 guohx 
				$("#outDiv").scroll(function () {
					$("#expfunc-datafixed thead").on("mouseover", function () {
						$("#expfunc-datafixed thead").find('tr:eq(0) th').each(function () {
							$(this).css("border-right", "1px solid #D9D9D9")
						})
					}).on("mouseout", function () {
						$("#expfunc-datafixed thead").find('tr:eq(0) th').each(function () {
							$(this).css("border-right", "none")
						})
					});
				})
			},

			//初始化加载引用单位信息
			reqInitRightIssueAgy: function () {
				var argu = {
					"rgCode": ma.rgCode,
					"setYear": ma.setYear,
					'agencyCode': page.agencyCode,
					'chrCodes': [],
					'eleCode': 'EXPFUNC'
				}
				ufma.post("/ma/sys/common/countAgencyUse", argu, function (result) {
					var data = result.data;
					var columnsArr = [{
						data: "agencyCode",
						title: "单位ID",
						visible: false
					},
					{
						data: "agencyName",
						title: "单位"
					},
					{
						data: "issuedCount",
						title: "已用",
						width: "50px"
					}
					];

					var isRight = true;
					if (data != null && data != "null") {
						if (data.length > 0) {
							for (var i = 0; i < data.length; i++) {
								//    							console.info(JSON.stringify(data[i]));
								if (!data[i].hasOwnProperty("agencyCode")) {
									ufma.alert("第" + i + "条数据的agencyCode(" + data[i].agencyCode + ")字段不存在！", "error");
									isRight = false;
									return false;
								}
								if (!data[i].hasOwnProperty("agencyName")) {
									ufma.alert("第" + i + "条数据的agencyName(" + data[i].agencyName + ")字段不存在！", "error");
									isRight = false;
									return false;
								}
								if (!data[i].hasOwnProperty("issuedCount")) {
									ufma.alert("第" + i + "条数据的issuedCount(" + data[i].issuedCount + ")字段不存在！", "error");
									isRight = false;
									return false;
								}
							}
						}
					} else {
						ufma.alert(data + ":格式不正确！", "error");
						isRight = false;
						return false;
					}

					if (isRight) {
						page.getDWUsedInfo(data, columnsArr);
					} else {
						ufma.alert("后台数据格式不正确！", "error");
						return false;
					}
				})
			},
			//获取要素的详细信息
			getEleDetail: function () {
				ufma.showloading('数据加载中，请耐心等待...');
				page.getExpFunc(page.pageNum, page.pageLen);
				var argu = {
					"eleCode": 'EXPFUNC',
					'agencyCode': page.agencyCode,
					"rgCode": ma.rgCode,
					"setYear": ma.setYear
				};
				ma.initfifa('/ma/sys/element/getEleDetail', argu, callbackFun);

				function callbackFun(data, ctrlName) {
					//本级控制下发按钮显示/隐藏
					page.agencyCtrlLevel = data.agencyCtrllevel;
					var isAcctLevel = data.isAcctLevel;
					if ($('body').data("code")) {
						page.chooseAcctFlag = false;
						if (isAcctLevel != '1' && page.agencyCode != "*") {
							$(".btn-choose").hide();
							$(".btn-add").show();
							page.acctCode = '*';
							page.queryList();
						} else {
							$(".btn-choose").hide();
							$(".btn-add").show();
						}
					}
					if ($('body').data("code")) {
						if (isAcctLevel == '1' && page.acctFlag == true) {
							page.chooseAcctFlag = false;
							$("#cbAcct").show();
							ufma.get('/ma/sys/eleCoacc/getAcctTree/' + page.agencyCode, {
								"setYear": page.setYear,
								"rgCode": page.rgCode
							}, function (result) {
								var acctData = result.data;
								/*if(acctData.length > 0) {
									page.cbAcct = $("#cbAcct").ufmaTreecombox2({
										data: acctData,
									});
								}*/
								if (acctData.length > 0) {
									page.chooseAcctFlag = false;
								} else {
									page.acctCode = '';
									page.acctName = '';
									page.accsCode = '';
									page.accsName = '';
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
										page.queryList();
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
											page.cbAcct.setValue(page.acctCode, page.acctName);
										} else if (acctData.length > 0) {
											page.cbAcct.select(1);
										} else {
											page.cbAcct.val('');
											page.accsCode = '';
											page.acctCode = '';
											page.chooseAcctFlag = true;
											page.queryList();
										}
									}
								});
							});
							//page.initAcctScc();
						} else {
							$("#cbAcct").hide();
							page.acctCode = '*';
							page.chooseAcctFlag = false;
							page.queryList();
						}
					}
					//guohx 20200217 与雪蕊确认，上下级公用显示下发按钮 不区分选用还是下发
					if (page.agencyCtrlLevel == "03") {
						//上下级无关下发隐藏
						$(".btn-senddown").hide();
					} else {
						//上下级公用,下级细化可增加一级,下级细化不可增加一级下发显示
						$(".btn-senddown").show();
					}
					isOperate = data.isOperate;
					if (isOperate == "1") {
						$(".btn-delete").addClass("disabled");
						$(".btn-start").addClass("disabled");
						$(".btn-stop").addClass("disabled");
						$(".btn-senddown").addClass("disabled");
						$(".btn-add").addClass("disabled");
					}
					//请求上级控制信息
					page.parentCtrlBtn(ctrlName);
					ufma.hideloading();
				}
			},
			//根据上级信息控制界面新增、选用、增加下级按钮,显示/隐藏
			parentCtrlBtn: function (ctrlName) {
				//请求上级控制信息
				var argu2 = {
					agencyCode: page.agencyCode,
					acctCode: page.acctCode,
					eleCode: "EXPFUNC",
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
						//广州这边需要选用按钮--zsj
						$(".btn-choose").show();
						$(".btn-addlower").show();
						ctrlName2 = data2.agencyCtrlName;
					} else if (page.agencyCtrlLevel2 == "0202") {
						//下级细化不可增加一级，新增显示，选用不强制，增加下级显示（在表格的complete中做了控制）
						$(".btn-add").show();
						//广州这边需要选用按钮--zsj
						$(".btn-choose").show();
						$(".btn-addlower").hide();
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
					//     newCtrlInfor ='<div>提示：'+ctrlName2+'</div><div>'+ctrlName+'</div>';
					// }
					newCtrlInfor = newCtrlInfor + ctrlName;
					$(".table-sub-info").html(newCtrlInfor);
				});
			},
			//取消全选
			cancelCheckAll: function () {
				$("#CheckAll,.check-all input").prop("checked", false);
			},
			//初始化页面
			initPage: function () {
				//购物车表格初始化
				this.reqInitRightIssueAgy();
				//初始化级次
				this.getFJ();
				$("#expFunc-bgttypeCode").attr('url', '/ma/sys/expFunc/queryBgtType?rgCode=' + ma.rgCode + '&setYear=' + ma.setYear + '&agencyCode=' + page.agencyCode);
				ufma.comboxInit('expFunc-bgttypeCode');
				//获取预算体系
				this.initKMTXLabels();
				//获取要素上级控制信息
			},
			//初始化单位
			initAgencyCode: function () {
				page.cbAgency = $("#cbAgency").ufmaTreecombox2({
					url: "/ma/sys/eleAgency/getAgencyTree?rgCode=" + ma.rgCode + '&setYear=' + ma.setYear,
					leafRequire: false,
					onchange: function (data) {
						page.agencyCode = data.code
						page.agencyName = data.name
						//修改bug77997--zsj--明细级单位不显示“下发”
						if (data.isLeaf == '0') {
							$(".btn-senddown").show();
							//非末级单位不显示账套选择框
							$("#cbAcct").hide();
							page.acctFlag = false;
						} else {
							$(".btn-senddown").hide();
							$("#cbAcct").show();
							page.acctFlag = true;
						}
						page.getEleDetail();
						$("label.mt-checkbox").find('input[type="checkbox"]').prop("checked", false);

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
							if (page.agencyCode != "" && page.agencyName != "" && page.agencyCode != "*" && page.agencyName != "*") {
								page.cbAgency.val(page.agencyCode);
							} else {
								page.cbAgency.val(1);
							}
						}
					}
				});
			},
			//初始化账套
			initAcctScc: function () {
			},
			init: function () {
				//获取session
				var pfData = ufma.getCommonData();
				page.agencyCode = pfData.svAgencyCode;
				page.agencyName = pfData.svAgencyName;
				page.acctCode = pfData.svAcctCode;
				page.acctName = pfData.svAcctName;
				page.chooseAcctFlag = false;
				page.reslist = ufma.getPermission();
				if ($('body').data("code")) {
					page.initAgencyCode();
				} else {
					page.agencyCode = "*";
					page.acctCode = "*";
					page.getEleDetail();
					page.queryList();
				}
				this.initPage();
				setTimeout(function () {
					var centerHeight = $(window).height() - 162 - 30 - 8 - 40;
					$('#outDiv').css("height", centerHeight);
					$('#outDiv').css("width", $(".table-sub").width());
					$('#outDiv').css("overflow", "auto");
				}, 500)
				this.onEventListener();
				ufma.parse(page.namespace);
				// ufma.parseScroll();

				//请求自定义属性
				//				reqFieldList(page.agencyCode, "EXPFUNC");
			}
		}
	}();

	page.init();
});