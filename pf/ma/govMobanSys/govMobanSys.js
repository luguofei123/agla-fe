$(function() {
	var page = function() {
		var agencyCtrlLevel;
		var govExpecoTable;
		var agencyCode;
		var pageTitle;
		var eleCode;
		var tableParam;
		var baseUrl;
		var usedDataTable; //引用表格对象
		return {
			namespace: 'govMoban',
			get: function(tag) {
				return $('#' + this.namespace + ' ' + tag);
			},
			getInterface: function(action) {
				var urls = {
					del: {
						type: 'delete',
						url: page.baseUrl + 'commonRg/deleteSys?rgCode='+ ma.rgCode + '&setYear=' + ma.setYear
					},
					active: {
						type: 'put',
						url: page.baseUrl + 'commonRg/ableSys?rgCode='+ ma.rgCode + '&setYear=' + ma.setYear
					},
					unactive: {
						type: 'put',
						url: page.baseUrl + 'commonRg/ableSys?rgCode='+ ma.rgCode + '&setYear=' + ma.setYear
					},
					addlower: {
						type: 'post',
						url: page.baseUrl + 'common/getMaxLowerCode?rgCode='+ ma.rgCode + '&setYear=' + ma.setYear
					}
				};
				return urls[action];
			},
			getDWUsedInfo: function(data, columnsArr) {
				page.usedDataTable = $('#dw-used').DataTable({
					"data": data,
					"columns": columnsArr,
					"bPaginate": false, //翻页功能
					"bLengthChange": false, //改变每页显示数据数量
					"bFilter": false, //过滤功能
					"bSort": false, //排序功能
					"bInfo": false, //页脚信息
					"bAutoWidth": false //自动宽度
				});
			},
			getPageName: function(tableParam) {
				var pageName = {
					MA_ELE_GOVEXPECO: {
						title: '政府经济分类',
						eleCode: "GOVEXPECO"
					},
					MA_ELE_EXPECO: {
						title: '部门经济分类',
						eleCode: "EXPECO"
					},
					MA_ELE_PROTYPE: {
						title: '项目类别',
						eleCode: "PROTYPE"
					},
					MA_ELE_FUNDTYPE: {
						title: '资金性质',
						eleCode: "FUNDTYPE"
					},
					MA_ELE_BGTSOURCE: {
						title: '预算来源',
						eleCode: "BGTSOURCE"
					},
					MA_ELE_FUNDSOURCE: {
						title: '经费来源',
						eleCode: "FUNDSOURCE"
					},
					MA_ELE_PAYTYPE: {
						title: '支付方式',
						eleCode: "PAYTYPE"
					},
					MA_ELE_EXPTYPE: {
						title: '支出类型',
						eleCode: "EXPTYPE"
					},
					MA_ELE_SETMODE: {
						title: '结算方式',
						eleCode: "SETMODE"
					},
					MA_ELE_FATYPE: {
						title: '资产类型',
						eleCode: "FATYPE"
					},
					MA_ELE_DEPPRO: {
						title: '财政项目',
						eleCode: "DEPPRO"
					},
					MA_ELE_BILLTYPE: {
						title: '票据类型',
						eleCode: 'BILLTYPE'
					},
					//财政社保新增要素
					SSSFM_ELE_INPIRDSTYPE: {
						title: '缴费期',
						eleCode: 'INPIRDSTYPE'
					},
					SSSFM_ELE_SUBSIDYLEVERLS: {
						title: '财政补贴级次',
						eleCode: 'SUBSIDYLEVERLS'
					},
					SSSFM_ELE_OPERITEM: {
						title: '资金运作项目',
						eleCode: 'OPERITEM'
					},
					SSSFM_ELE_INSUREDPLACE: {
						title: '参保地',
						eleCode: 'INSUREDPLACE'
					},
					SSSFM_ELE_MEDICALPLACE: {
						title: '就医地',
						eleCode: 'MEDICALPLACE'
					}
				}
				return pageName[tableParam];
			},

			getCommonData: function(pageNum, pageLen) {
				var url = page.baseUrl + "commonRg/select";
				if(page.tableParam == 'MA_ELE_EXPECO') {
					url = "/ma/sys/expecoSys/select";
				} else if(page.tableParam == 'MA_ELE_SETMODE') {
					url = "/ma/ele/setmode/select";
				} else if (page.tableParam == 'MA_ELE_BILLTYPE') {
					url = "/ma/ele/billtype/select";
				}else if (page.tableParam == 'MA_ELE_FATYPE') {
					url = "/ma/ele/fatype/select";
				}
				var argu = $('#query-tj').serializeObject();

				var columns = [{
						title: '<label class="mt-checkbox mt-checkbox-single mt-checkbox-outline"> <input type="checkbox"' +
							'class="datatable-group-checkable"/> &nbsp;<span></span> </label>',
						data: "chrId",
						width: 30
					},
					{
						title: page.pageTitle + "编码",
						data: "chrCode",
						width: 200
					},
					{
						title: page.pageTitle + "名称",
						data: "chrName",
						width: 260
					},
					{
						title: "状态",
						data: "enabledName",
						width: 60,
						"render": function(data, type, rowdata, meta) {
							if(rowdata.enabled == 1) {
								return '<span style="color:#00A854">' + data + '</span>';
							} else {
								return '<span style="color:#F04134">' + data + '</span>';
							}

						}
					},
					{
						title: "操作",
						data: 'chrId',
						width: 100
					}
				];
				if(page.tableParam == 'MA_ELE_SETMODE') {
					columns.splice(3, 0, {
						title: "是否公务卡",
						data: "isOfficialCard",
						width: 60,
						render: function(data, type, rowdata, meta) {
							return data == 1 ? "是" : "否"
						}
					});
					columns.splice(3, 0, {
						title: "是否现金",
						data: "isCash",
						width: 60,
						render: function(data, type, rowdata, meta) {
							return data == 1 ? "是" : "否"
						}
					});
				}
                if(page.tableParam == 'MA_ELE_BILLTYPE') {
                    columns.splice(3, 0, {
                        title: "票据类别",
                        data: "billCategoryName",
                        width: 60,
                        render: function(data, type, rowdata, meta) {
                            return data;
                        }
                    });
				}

				argu["agencyCode"] = page.agencyCode;
//				argu["table"] = page.tableParam;
				argu["eleCode"] = page.getPageName(page.tableParam).eleCode
				argu["rgCode"] = ma.rgCode;
				argu["setYear"] = ma.setYear;
				ufma.showloading('正在请求数据，请耐心等待...');
				var callback = function(result) {
					var id = "expfunc-data";
					var toolBar = $('#' + id).attr('tool-bar');
					page.govExpecoTable = $('#' + id).DataTable({
						"language": {
							"url": bootPath + "agla-trd/datatables/datatable.default.js"
						},
						"fixedHeader": {
							header: true
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
						"columns": columns,
						"columnDefs": [{
								"targets": [0],
								"serchable": false,
								"orderable": false,
								"className": "nowrap",
								"render": function(data, type, rowdata, meta) {
									return '<label class="mt-checkbox mt-checkbox-single mt-checkbox-outline"> <input type="checkbox" class="checkboxes" value="' + data + '" data-code="' + rowdata.chrCode + '"/> &nbsp;<span></span> </label>';
								}
							},
							{
								"targets": (page.tableParam == 'MA_ELE_EXPECO') ? [1, 2, 3, 4] : [1, 2, 3], ////部门预算经济分类增加"单位类型"列 guohx 20180608
								"className": "isprint"
							},
							{
								"targets": [2],
								"serchable": false,
								"orderable": false,
								"className": "nowrap",
								"render": function(data, type, rowdata, meta) {
									var textIndent = '0';
									if(rowdata.levelNum) {
										textIndent = (parseInt(rowdata.levelNum) - 1) + 'em';
									}
									var alldata = JSON.stringify(rowdata);
									return '<a style="display:block;text-indent:' + textIndent + '" href="javascript:;" data-href=\'' + alldata + '\'>' + data + '</a>';
								}
							},

							{
								"targets": (page.tableParam == 'MA_ELE_EXPECO') ? [4] : [3],
								"render": function(data, type, rowdata, meta) {
									if(rowdata.enabled == 1) {
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
								"render": function(data, type, rowdata, meta) {
									var active = rowdata.enabled == 1 ? 'hidden' : 'hidden:false';
									var unactive = rowdata.enabled == 0 ? 'hidden' : 'hidden:false';
									var chrCode = rowdata.chrCode;
									var agencyCode = rowdata.agencyCode;

									var addlower = "";
									if($('body').attr("data-code")) {
										if(page.agencyCtrlLevel != '0101') {
											addlower = "";
										} else {
											addlower = 'hidden';
										}
									} else {
										addlower = '';
									}
									return '<a class="btn btn-icon-only btn-sm btn-addlower btn-permission" data-toggle="tooltip" ' + addlower + '  action= "addlower" rowid="' + data + '" chrCode="' + chrCode + '" agencyCode="' + agencyCode + '" title="增加下级">' +
										'<span class="glyphicon icon-add-subordinate"></span></a>' +
										'<a class="btn btn-icon-only btn-sm btn-start btn-permission" data-toggle="tooltip" ' + active + ' action= "active" rowid="' + data + '" chrCode="' + chrCode + '" agencyCode="' + agencyCode + '" title="启用">' +
										'<span class="glyphicon icon-play"></span></a>' +
										'<a class="btn btn-icon-only btn-sm btn-stop btn-permission" data-toggle="tooltip" ' + unactive + ' action= "unactive" rowid="' + data + '" chrCode="' + chrCode + '" agencyCode="' + agencyCode + '" title="停用">' +
										'<span class="glyphicon glyphicon icon-ban"></span></a><a class="btn btn-icon-only btn-sm project-single-delete btn-delete" data-toggle="tooltip" ' + addlower + ' action= "del" rowid="' + data + '" chrCode="' + chrCode + '" agencyCode="' + agencyCode + '" title="删除">' +
										'<span class="glyphicon icon-trash"></span></a>';
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
								customize: function(win) {
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
								customize: function(xlsx) {
									var sheet = xlsx.xl.worksheets['sheet1.xml'];
								}
							}
						],
						"initComplete": function(settings, json) {
							if($('body').attr("data-code")) {
								if(page.agencyCtrlLevel != '0101') {
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
							$("#printTableData .buttons-excel").off().on('click', function(evt) {
								evt = evt || window.event;
								evt.preventDefault();
								ufma.expXLSForDatatable($('#' + id), page.pageTitle);
							});
							//导出end							
							$('#printTableData.btn-group').css("position", "inherit");
							$('#printTableData div.dt-buttons').css("position", "inherit");
							$('#printTableData [data-toggle="tooltip"]').tooltip();
							ufma.isShow(page.reslist);
							//全选按钮与分页工具条
							var $info = $(toolBar + ' .info');
							if($info.length == 0) {
								$info = $('<div class="info"></div>').appendTo($(toolBar + ' .tool-bar-body'));
							}
							$info.html('');
							$('.' + id + '-paginate').appendTo($info);

							if(pageLen != "" && typeof(pageLen) != "undefined") {
								$('#' + id).DataTable().page.len(pageLen).draw(false);
								if(pageNum != "" && typeof(pageNum) != "undefined") {
									$('#' + id).DataTable().page(parseInt(pageNum) - 1).draw(false);
								}
							}

							$(".datatable-group-checkable").prop("checked", false);
							$(".datatable-group-checkable").on('change', function() {
								var t = $(this).is(":checked");
								$('.checkboxes').each(function() {
									t ? $(this).prop("checked", !0) : $(this).prop("checked", !1);
									t ? $(this).closest('tr').addClass('selected') : $(this).closest('tr').removeClass('selected');
								});
								$(".datatable-group-checkable").prop("checked", t);
							});

						},
						"headerCallback": function() {

						},
						"drawCallback": function(settings) {
							ufma.dtPageLength($(this));
							ufma.isShow(page.reslist);

							ufma.setBarPos($(window));
							$('#' + id).find("td.dataTables_empty").text("")
								.append('<img src="' + bootPath + 'images/noData.png"/><br/><i>目前还没有你要查询的数据</i>');

							$('#' + id + ' .btn-addlower[data-toggle="tooltip"]').tooltip();
							$('#' + id + ' .btn').on('click', function() {
								//page.delRow($(this).attr('action'), [$(this).attr('chrCode')], $(this).closest('tr'));
								page._self = $(this);
								//                        		var action = $(this).attr('action');
								//                        		if(action == "del"){
								//                        			page.ufTooltipAction = "删除";
								//                        		}else if(action == "active"){
								//                        			page.ufTooltipAction = "停用";
								//                        		}else if(action == "unactive"){
								//                        			page.ufTooltipAction = "启用";
								//                        		}
							});
							$('#' + id + ' .btn-delete').ufTooltip({
								content: '您确定删除当前' + page.pageTitle + '吗？',
								onYes: function() {
									ufma.showloading('数据删除中，请耐心等待...');
									page.delRowOne($(page._self).attr('action'), [$(page._self).attr('chrCode')], $(page._self).closest('tr'));
								},
								onNo: function() {}
							})
							$('#' + id + ' .btn-start').ufTooltip({
								content: '您确定启用当前' + page.pageTitle + '吗？',
								onYes: function() {
									ufma.showloading('数据启用中，请耐心等待...');
									page.delRowOne($(page._self).attr('action'), [$(page._self).attr('chrCode')], $(page._self).closest('tr'));
								},
								onNo: function() {}
							})
							$('#' + id + ' .btn-stop').ufTooltip({
								content: '您确定停用当前' + page.pageTitle + '吗？',
								onYes: function() {
									ufma.showloading('数据停用中，请耐心等待...');
									page.delRowOne($(page._self).attr('action'), [$(page._self).attr('chrCode')], $(page._self).closest('tr'));
								},
								onNo: function() {}
							})
						}
					});
					//翻页取消勾选
					$('#' + id).on('page.dt', function() {
						$(".datatable-group-checkable,.checkboxes").prop("checked", false);
						$('#' + id).find("tbody tr.selected").removeClass("selected");
					});
					ufma.hideloading();
				};
				ufma.get(url, argu, callback);
			},

			//选用页面初始化
			getExpFuncChoose: function() {
				var url = "/ma/sys/commonRg/select";

				var argu = $('#query-tj').serializeObject();
				argu["agencyCode"] = "*";
//				argu["table"] = page.tableParam;
				argu["eleCode"] = page.getPageName(page.tableParam).eleCode
				argu["rgCode"] = ma.rgCode;
				argu["setYear"] = ma.setYear;
				ufma.showloading('正在请求数据，请耐心等待...');
				var callback = function(result) {
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
								data: "chrCode",
								width: 30
							},
							{
								title: page.pageTitle + "编码",
								data: "chrCode"
							},
							{
								title: page.pageTitle + "名称",
								data: "chrName"
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
								"render": function(data, type, rowdata, meta) {
									return '<div class="checkdiv">' +
										'</div><label class="mt-checkbox mt-checkbox-single mt-checkbox-outline"> ' +
										'<input type="checkbox" class="checkboxes" value="' + data + '" />&nbsp;' +
										'<span></span> </label>';
								}
							},
							{
								"targets": [3],
								"render": function(data, type, rowdata, meta) {
									if(rowdata.enabled == 1) {
										return '<span style="color:#00A854">' + data + '</span>';
									} else {
										return '<span style="color:#F04134">' + data + '</span>';
									}
								}
							}
						],
						"dom": 'rt<"tableBottom"<"tool-bar-body"<"ufma-tool-btns"><"info"<"' + id + '-paginate"ilp>>>>',
						"initComplete": function(settings, json) {

							var $info = $(toolBar + ' .info');
							if($info.length == 0) {
								$info = $('<div class="info"></div>').appendTo($(toolBar + ' .tool-bar-body'));
							}
							$info.html('');
							$('.' + id + '-paginate').appendTo($info);

						},
						"drawCallback": function(settings) {
							ufma.dtPageLength($(this));
							ufma.isShow(page.reslist);

							$('#' + id).find("td.dataTables_empty").text("")
								.append('<img src="' + bootPath + 'images/noData.png"/><br/><i>目前还没有你要查询的数据</i>');

							$(".datatable-choose-checkall").prop("checked", false);
							$(".datatable-choose-checkall").on('change', function() {
								var t = $(this).is(":checked");
								$('#' + id).find('.checkboxes').each(function() {
									t ? $(this).prop("checked", !0) : $(this).prop("checked", !1);
									t ? $(this).closest('tr').addClass('selected') : $(this).closest('tr').removeClass('selected');
								});
								$(".datatable-choose-checkall").prop("checked", t);
							});
						}
					});
					ufma.hideloading();
				};
				ufma.get(url, argu, callback);
			},

			getCheckedRows: function() {
				var checkedArray = [];
				table = page.govExpecoTable;
				activeLine = table.rows('.selected');
				data = activeLine.data();
				for(var i = 0; i < data.length; i++)
					checkedArray.push(data[i].chrCode);
				return checkedArray;
			},
			getCheckedRowIds: function() {
				var checkedArray = [];
				$('#expfunc-data .checkboxes:checked').each(function() {
					checkedArray.push($(this).val());
				});
				return checkedArray;
			},
			getChooseCheckedRows: function() {
				var checkedArray = [];
				$('#expfunc-choose-datatable .checkboxes:checked').each(function() {
					checkedArray.push($(this).val());
				});
				return checkedArray;
			},
			getDW: function() {
				/*var codes = page.getCheckedRows();
				var url = page.baseUrl + "common/countAgencyUse";
				var argu = {
				    'codes': codes,
				    "table": page.tableParam
				};
				var callback = function(result) {
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
				        "pageLength": 10,
				        "bInfo": false, //页脚信息
				        "bSort": false, //排序功能
				        "bAutoWidth": false, //表格自定义宽度
				        "bProcessing": true,
				        "bDestroy": true,
				        "columns": [{
				                title: "单位",
				                data: "CHR_NAME"

				            },
				            {
				                title: "已用",
				                data: "NUM"
				            }
				        ]
				    });
				    ufma.hideloading();
				}
				ufma.post(url, argu, callback);*/
			},
			//批量删除、停用、启用
			delRow: function(action, idArray, $tr) {
				var options = this.getInterface(action);
				page.pageNum = $('#expfunc-data_paginate').find('span a.paginate_button.current').text();
				page.pageLen = parseInt($('#expfunc-data_length').find('select').val());
				var argu = {
					chrCodes: idArray,
					"agencyCode": page.agencyCode,
					"tableName": page.tableParam,
					"eleCode": page.eleCode,
					"action": action,
					"rgCode": ma.rgCode,
					"setYear": ma.setYear
				};
				var callback = function(result) {
					if(action == 'del') {
						if($tr) $tr.remove();
						if(result.flag == 'success') {
							ufma.showTip('删除成功！', function() {}, 'success'); //guohx 增加删除成功提示
						}
					} else if(action == 'active') {
						if(result.flag == 'success') {
							ufma.showTip('启用成功', function() {}, 'success');
						}
					} else if(action == 'unactive') {
						if(result.flag == 'success') {
							ufma.showTip('停用成功！', function() {}, 'success');
						}
					} else {
						if($tr) {
							$tr.find('.btn[action="active"]').attr('disabled', action == "active");
							$tr.find('.btn[action="unactive"]').attr('disabled', action == "unactive");
						}
					}
					page.getCommonData(page.pageNum, page.pageLen);
				}
				if(action == 'del') {
					ufma.confirm('您确定要删除选中的' + page.getPageName(page.tableParam).title + '吗？', function(action) {
						if(action) {
							delete argu.action;
							ufma.ajax(options.url, options.type, argu, callback);
						}
					}, {
						type: 'warning'
					});
				} else if(action == 'addlower') {
					$('#expFunc-chrCode').trigger('click');
					var newArgu = {}
					newArgu.chrCode = argu.chrCodes[0];
					newArgu.agencyCode = page.agencyCode;
					newArgu.eleCode = page.eleCode;
					newArgu.tableName = page.tableParam;
					newArgu.rgCode = ma.rgCode;
					newArgu.setYear = ma.setYear;

					ufma.ajax(options.url, options.type, newArgu, function(result) {
						var data = result.data;
						ma.isRuled = true;
						$("#expFunc-chrCode").val(data)
						page.action = 'addlower';
						$('#expFunc-chrCode').trigger('click');
						page.openEdtWin(data);
						$('#expFunc-chrCode').trigger('click');

					});
				} else if(action == 'active') {
					ufma.confirm('您确定要启用选中的' + page.getPageName(page.tableParam).title + '吗？', function(action) {
						if(action) {
							ufma.ajax(options.url, options.type, argu, callback);
						}
					}, {
						type: 'warning'
					});
				} else if(action == 'unactive') {
					ufma.confirm('您确定要停用选中的' + page.getPageName(page.tableParam).title + '吗？', function(action) {
						if(action) {
							ufma.ajax(options.url, options.type, argu, callback);
						}
					}, {
						type: 'warning'
					});
				}
			},
			//单一删除、停用、启用
			delRowOne: function(action, idArray, $tr) {
				var options = this.getInterface(action);
				page.pageNum = $('#expfunc-data_paginate').find('span a.paginate_button.current').text();
				page.pageLen = parseInt($('#expfunc-data_length').find('select').val());
				var argu = {
					chrCodes: idArray,
					"agencyCode": page.agencyCode,
					"tableName": page.tableParam,
					"eleCode": page.eleCode,
					"action": action,
					"rgCode": ma.rgCode,
					"setYear": ma.setYear
				};
				var callback = function(result) {
					if(action == 'del') {
						if($tr) $tr.remove();
							ufma.hideloading();
						if(result.flag == 'success') {
							ufma.showTip('删除成功！', function() {}, 'success'); //guohx 增加删除成功提示
						}
					} else if(action == 'active') {
						ufma.hideloading();
						if(result.flag == 'success') {
							ufma.showTip('启用成功', function() {}, 'success');
						}
					} else if(action == 'unactive') {
							ufma.hideloading();
						if(result.flag == 'success') {
							ufma.showTip('停用成功！', function() {}, 'success');
						}
					} else {
						if($tr) {
							$tr.find('.btn[action="active"]').attr('disabled', action == "active");
							$tr.find('.btn[action="unactive"]').attr('disabled', action == "unactive");
						}
					}
					page.getCommonData(page.pageNum, page.pageLen);
				}
				if(action == 'del') {
					delete argu.action;
					ufma.ajax(options.url, options.type, argu, callback);
				} else {
					ufma.ajax(options.url, options.type, argu, callback);
				}
			},
			openEdtWin: function(data) {
                page.getBillTypesList();
				$('#prompt').text('编码规则：' + ma.fjfa)
				if(page.action == 'edit' || page.action == 'addlower') {

					$("[name='chrId'],[name='lastVer'],[name='chrName']").val("");
					if(page.action == 'addlower') {
						$("#expFunc-chrCode").attr('disabled', false)
					} else {
						$("#expFunc-chrCode").attr('disabled', true)
					}

					var thisCode = $("#expFunc-chrCode").val();
					if($("#expFunc-chrCode") != "" && thisCode != "") {
						var obj = {
							"chrCode": thisCode,
							"tableName": page.tableParam,
							"eleCode": page.tableParam.substring(7),
							"rgCode": ma.rgCode,
							"setYear": ma.setYear,
							"agencyCode": page.agencyCode,
							"acctCode":page.acctCode
						}
						ma.nameTip = "";
						ufma.ajaxDef("/ma/sys/common/getParentChrFullname", "post", obj, function(result) {
							ma.nameTip = result.data;
						});
					} else {
						if(!$.isNull(data)) {
							ma.nameTip = data.chrFullname.replace('/' + data.chrName, ''); //去掉本级，得到上级代码	
						} else {
							ma.nameTip = ''
						}
					}

				}
				$('input').blur(function() {
					if(page.action != 'edit') {
						if($(this).attr('name') == 'chrName' || $(this).attr('name') == 'chrCode') {
							//编码验证
							ma.codeValidator('expFunc-chrCode', page.getPageName(page.tableParam).title, page.baseUrl + 'common/findParentList?eleCode=' + page.getPageName(page.tableParam).eleCode+'&acctCode='+page.acctCode, page.agencyCode, "expfunc-help");
							//名称验证
							ma.nameValidator('expFunc-chrName', page.getPageName(page.tableParam).title);
						}
					}
				})

				var url = "/ma/sys/element/getEleDetail" ;
				var argu = {
					eleCode: page.eleCode,
					agencyCode: page.agencyCode,
					rgCode: ma.rgCode,
					setYear: ma.setYear
				};
				var callback = function(result) {
					gRule = result.gRule;
					if(result.gRule != "")
						page.fifa = gRule;
				}
				ufma.get(url, argu, callback);
				$('#expfunc-edt').find('.form-group').each(function() {
					$(this).removeClass('error');
					$(this).find(".input-help-block").remove();
				});

				if(page.action == 'add') {
					data.chrId = "";
					data.chrCode = "";
					data.chrName = "";
					data.lastVer = "";
					$("form input[type='hidden']").val("");
				}

				var h = 370;
				if(page.eleCode == "SETMODE"){
					h = 460;
				}else if(page.eleCode == "SETMODE"){
					h = 390;
				}
				page.editor = ufma.showModal('expfunc-edt', 800,  h);
				setTimeout(function () {
					$('.form-group').removeClass('error')
					$('#expFunc-chrCode-help').remove()
				}, 500)
				page.formdata = data;
			},
			openChooseWin: function() {
				page.choosePage = ufma.showModal('expfunc-choose', 1000, 500);
			},
			bsAndEdt: function(data) {
				page.action = 'edit';
				$("#field1").ufmaTreecombox().setValue("", "");
				$("#field2").ufmaTreecombox().setValue("", "");
				$("#field3").ufmaTreecombox().setValue("", "");
				$("#field4").ufmaTreecombox().setValue("", "");
				$("#field5").ufmaTreecombox().setValue("", "");
				ufma.deferred(function() {
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
			save: function(goon) {
				page.pageNum = $('#expfunc-data_paginate').find('span a.paginate_button.current').text();
				page.pageLen = parseInt($('#expfunc-data_length').find('select').val());
				ma.isRuled = true
				if(!ma.formValidator("expFunc-chrCode", "expFunc-chrName", page.getPageName(page.tableParam).title, page.action)) {
					return false;
				}
				ufma.showloading('数据保存中，请耐心等待...');
				var url = page.baseUrl + 'commonRg/saveSys';
                var argu = $('#form-expfunc').serializeObject();
				if(page.tableParam == 'MA_ELE_EXPECO') {
					url = "/ma/sys/expecoSys/saveSys";
				} else if(page.tableParam == 'MA_ELE_SETMODE') {
					url = "/ma/ele/setmode/save";
				} else if (page.tableParam == 'MA_ELE_BILLTYPE') {
					url = "/ma/ele/billtype/save";
					delete argu.isOfficialCard;
				}else if (page.tableParam == 'MA_ELE_FATYPE') {
					url = "/ma/ele/fatype/save";
				}

				if($("#expFunc-chrCode").val().length == parseInt(ma.fjfa.substring(0, 1))) {
					argu["chrFullname"] = $("#expFunc-chrName").val();
				} else {
					argu["chrFullname"] = ma.nameTip + "/" + $("#expFunc-chrName").val();
				}

				argu["agencyCode"] = page.agencyCode;
//				argu["table"] = page.tableParam;
				argu["eleCode"] = page.getPageName(page.tableParam).eleCode
				argu.rgCode = ma.rgCode;
				argu.setYear = ma.setYear;
				var callback = function(result) {
					$("[name='chrId']").val('');
					$("[name='lastVer']").val('');
					$('#expFunc-chrCode').removeAttr('disabled');
					page.getCommonData(page.pageNum, page.pageLen);
					ma.nameTip = null;
					if(!goon) {
						ufma.hideloading();
						ufma.showTip(result.msg, function() {}, result.flag);
						$('#form-expfunc')[0].reset();
						page.editor.close();
						$('.form-group').removeClass('error')
						$('#expFunc-chrCode-help').remove()
					} else {
						ufma.hideloading();
						ufma.showTip('保存成功,您可以继续添加' + page.getPageName(page.tableParam).title + '！', function() {}, result.flag);
						$('#form-expfunc')[0].reset();
						$("#billCategory").getObj().val("");
						$("#expFunc-chrCode").removeAttr("disabled");
						page.formdata = $('#form-expfunc').serializeObject();

						ma.fillWithBrother($('#expFunc-chrCode'), {
							"chrCode": argu.chrCode,
							"eleCode": page.eleCode,
							"agencyCode": page.agencyCode
						});
					}
				}
				ufma.post(url, argu, callback);
			},
			setFormEnabled: function() {
				if(page.action == 'edit') {
					ma.isRuled = true;

					if($('body').data("code")) {

						$("#expFunc-chrCode").attr("disabled", "disabled");
						if(page.agencyCtrlLevel == "0101" || page.agencyCtrlLevel == "0102") {

							$('#expFunc-chrName').attr('disabled', 'disabled');
							$('#expfunc-edt label.btn').attr('disabled', 'disabled');
							$("#expfunc-edt .btn-save-add,#expfunc-edt .btn-save").hide();
						} else {
							$('#expFunc-chrName').removeAttr('disabled');
							$('#expfunc-edt label.btn').removeAttr('disabled');
							$("#expfunc-edt .btn-save-add,#expfunc-edt .btn-save").show();
						}
					} else {
						$('#expfunc-chrName').removeAttr('disabled');
						$('#expfunc-edt label.btn').removeAttr('disabled');
						$("#expfunc-edt .btn-save-add,#expfunc-edt .btn-save").show();
					}

				} else if(page.action == 'add') {

					$('#expFunc-chrCode').removeAttr('disabled');
					$('#form-expfunc')[0].reset();

					$('#form-expfunc input[name="chrId"]').val('');
					$('#form-expfunc input[name="lastVer"]').val('');
				}
			},
			//获取并渲染票据类型下拉列表
			getBillTypesList:function(){
				var url = "/ma/pub/enumerate/MA_ELE_BILLTYPE_BILL_CATEGORY";
				var argu = {
                    "rgCode": ma.rgCode,
                    "setYear": ma.setYear
				};
				ufma.get(url,argu,function (result) {
                    $("#billCategory").ufCombox({
                        idField: "ENU_CODE",
                        textField: "ENU_NAME",
                        data:result.data, //json 数据
                        placeholder: "请选择票据类别",
                        onChange: function (sender, data) {
                        },
                        onComplete: function (sender) {
                        }
                    });
                })
			},
			 getCoaAccList: function(pageNum, pageLen) {
				//全部即acceCode为空
				page.acceCode = $('#tabAcce').find("li.active a").attr("value");
				page.acceName = $('#tabAcce').find("li.active a").text();
				var argu = $('#query-tj').serializeObject();
				//判断是否是通过链接打开
				if(page.fromChrCode != null && page.fromChrCode != "") {
					argu.accsCode = page.fromChrCode;
					//第一次加载时使用传送过来的code，以后根据查询条件
					page.fromChrCode = "";
				}
				var argu1 = {}
				argu1["agencyCode"] = page.agencyCode;
				argu1["acctCode"] = page.acctCode;
				argu1["acceCode"] = page.acceCode;
				argu1['accsCode'] = page.accsCode;
				if(page.isLeaf != 1) {
					argu1["acctCode"] = "";
				}
				argu1["rgCode"] = ma.rgCode;
				argu1['setYear'] = ma.setYear;
				ufma.get("/ma/sys/coaAccSys/queryAccoTable", argu1, function(result) {
					page.renderTable(result, pageNum, pageLen);
				});
			},
            issueTips: function(data, isCallBack) {
				var title = "";
				if(isCallBack) {
					title = "选用结果";
				} else {
					title = "下发结果";
				}
				data.colName = page.pageTitle;
				data.pageType = page.eleCode;
				ufma.open({
					url: '../maCommon/issueTips.html',
					title: title,
					width: 1100,
					data: data,
					ondestory: function(data) {
						//窗口关闭时回传的值;
						if(isCallBack) {
							page.getCoaAccList(page.pageNum, page.pageLen);
						}
					}
				});
			},
			onEventListener: function() {
				//列表页面表格行操作绑定
				$('#expfunc-data').on('click', 'tbody td:not(.btnGroup)', function(e) {
					e.preventDefault();
					var $ele = $(e.target);
					if($ele.is('a')) {
						page.bsAndEdt($ele.data('href'));
						return false;
					}
					var $tr = $ele.closest('tr');
					var $input = $ele.closest('tr').find('input[type="checkbox"]');
					var code = $input.data("code").toString();
					if($tr.hasClass("selected")) {
						//$input.prop("checked", false);
						//$tr.removeClass("selected");

						$ele.parents("tbody").find("tr").each(function() {
							var thisCode = $(this).find('input[type="checkbox"]').data("code").toString();
							if(thisCode.substring(0, code.length) == code) {
								$(this).removeClass("selected");
								$(this).find('input[type="checkbox"]').prop("checked", false);
							}
						})

					} else {
						//$input.prop("checked", true);
						//$tr.addClass("selected");

						$ele.parents("tbody").find("tr").each(function() {
							var thisCode = $(this).find('input[type="checkbox"]').data("code").toString();
							if(thisCode.substring(0, code.length) == code) {
								$(this).addClass("selected");
								$(this).find('input[type="checkbox"]').prop("checked", true);
							}
						})
					}

					var chrCodes = [];
					chrCodes = page.getCheckedRows();
					if(chrCodes.length > 0) {
						var argu = {
							"rgCode": ma.rgCode,
							"setYear": ma.setYear,
							'agencyCode':page.agencyCode,
							"chrCodes": chrCodes,
							'eleCode': page.eleCode
						};
						ufma.post("/ma/sys/commonRg/countRgUse", argu, function (result) {
							var data = result.data;
							var columnsArr = [{
								data: "issuedCount",
								title: "编码",
								visible: false
							},
							{
								data: "rgCode",
								title: "单位代码"
							},
							{
								data: "agencyName",
								title: "单位名称"
							}
							];

							var isRight = true;
							if(data != null && data != "null") {
								if(data.length > 0) {
									for(var i = 0; i < data.length; i++) {
										console.info(JSON.stringify(data[i]));
//										if (!data[i].hasOwnProperty("chrCode")) {
//											console.info("第" + i + "条数据的chrCode(" + data[i].chrCode + ")字段不存在！");
//											isRight = false;
//											return false;
//										}
										if (!data[i].hasOwnProperty("agencyCode")) {
											console.info("第" + i + "条数据的agencyCode(" + data[i].agencyCode + ")字段不存在！");
											isRight = false;
											return false;
										}
										if(!data[i].hasOwnProperty("agencyName")) {
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
						page.usedDataTable.clear().destroy();
						page.reqInitRightIssueAgy();
					}

				});

				//选用页面表格行操作绑定
				$('#expfunc-choose-datatable').on('click', 'tbody td', function(e) {
					e.preventDefault();
					var $ele = $(e.target);
					var $tr = $ele.closest('tr');
					var $input = $ele.closest('tr').find('input[type="checkbox"]');
					var code = $input.val();
					if($tr.hasClass("selected")) {
						//$input.prop("checked", false);
						//$tr.removeClass("selected");

						$ele.parents("tbody").find("tr").each(function() {
							var thisCode = $(this).find('input[type="checkbox"]').val();
							if(thisCode.substring(0, code.length) == code) {
								$(this).removeClass("selected");
								$(this).find('input[type="checkbox"]').prop("checked", false);
							}
						})

					} else {
						//$input.prop("checked", true);
						//$tr.addClass("selected");

						$ele.parents("tbody").find("tr").each(function() {
							var thisCode = $(this).find('input[type="checkbox"]').val();
							if(thisCode.substring(0, code.length) == code) {
								$(this).addClass("selected");
								$(this).find('input[type="checkbox"]').prop("checked", true);
							}
						})
					}
				});

				//ufma.searchHideShow($('#expfunc-data'));
				ma.searchHideShow('index-search', '#expfunc-data');
				ma.searchHideShow('choose-search', '#expfunc-choose-datatable');

				this.get('.ufma-shopping-trolley').on('click', function(e) {
					page.getDW();
				});

				this.get('.btn-add').on('click', function(e) {
					e.preventDefault();
					page.action = 'add';
					page.setFormEnabled();
					var data = $('#form-expfunc').serializeObject();
					page.openEdtWin(data);
					$('#prompt').text('编码规则：' + ma.fjfa)
				});

				this.get('.btn-close').on('click', function() {
					var tmpFormData = $('#form-expfunc').serializeObject();
					if(page.agencyCtrlLevel == '0101' || page.agencyCtrlLevel == '0102') {
						ma.nameTip = null;
						page.editor.close();
					} else if(!ufma.jsonContained(page.formdata, tmpFormData) && $('.btn-save').prop('display') != 'none') {
						ufma.confirm('您修改了' + page.getPageName(page.tableParam).title + '，关闭前是否保存？', function(action) {
							if(action) {
								page.save(false);
							} else {
								ma.nameTip = null;
								page.editor.close();

								$('.form-group').removeClass('error')
								$('#expFunc-chrCode-help').remove()
							}
						}, {
							type: 'warning'
						});
					} else {
						ma.nameTip = null;
						page.editor.close();

						$('.form-group').removeClass('error')
						$('#expFunc-chrCode-help').remove()
					}
				});
				//保存
				this.get('.btn-save-add').on('click', function() {
					page.save(true);
				});
				this.get('.btn-save').on('click', function() {
					page.save(false);
				});
				$(document).on('click', '.label-radio', function(e) {
					e = e || window.event;
					e.stopPropagation();
					ufma.deferred(function() {
						page.getCommonData();
					});
				});
				// $("body").on("click",'.u-msg-footer button',function () {
				// 	if(page.action=='add'){
				// 		//编码验证
				// 		ma.codeValidator('expFunc-chrCode', page.getPageName(page.tableParam).title, page.baseUrl + 'common/findParentList?tableName=' + page.tableParam, page.agencyCode, "expfunc-help");
				// 		//名称验证
				// 		ma.nameValidator('expFunc-chrName', page.getPageName(page.tableParam).title);
				// 	}else{
				// 	//编码验证
				//         ma.codeValidator('expFunc-chrCode', page.getPageName(page.tableParam).title, page.baseUrl + 'common/findParentList?tableName=' + page.tableParam, page.agencyCode, "expfunc-help");
				//         //名称验证
				//         ma.nameValidator('expFunc-chrName', page.getPageName(page.tableParam).title);
				//         ma.nameValidator('expFunc-chrName', page.getPageName(page.tableParam).title);
				// 	}

				// })

				this.get('.btn-del').on('click', function(e) {
					e.stopPropagation();
					var checkedRow = page.getCheckedRows();
					if(checkedRow.length == 0) {
						ufma.alert('请选择' + page.pageTitle + '!', "warning");
						return false;
					};
					page.delRow('del', checkedRow);
				});
				this.get('.btn-active').on('click', function(e) {
					e.stopPropagation();
					var checkedRow = page.getCheckedRows();
					if(checkedRow.length == 0) {
						ufma.alert('请选择' + page.pageTitle + '!', "warning");
						return false;
					}
					page.delRow('active', checkedRow);
				});
				this.get('.btn-unactive').on('click', function(e) {
					e.stopPropagation();
					var checkedRow = page.getCheckedRows();
					if(checkedRow.length == 0) {
						ufma.alert('请选择' + page.pageTitle + '!', 'warning');
						return false;
					}
					page.delRow('unactive', checkedRow);
				});
				//增加下级
				$("body").on('click', '.btn-addlower', function(e) {
					e.stopPropagation();
					var checkedRow = [];
					checkedRow.push($(this).parents("tr").find("input").data("code"));
					page.delRow('addlower', checkedRow);
					$('#expFunc-chrCode').trigger('keydown');
					$('#expFunc-chrCode').trigger('change');
					$('#expFunc-chrCode').trigger('paste');
					$('#expFunc-chrCode').trigger('keyup');

				});
				//下发
				$('#expFuncBtnDown,#expFuncBtnDownAgy').on('click', function(e) {
					e.stopPropagation();
					var gnflData = page.getCheckedRows();
					if(gnflData.length == 0) {
						ufma.alert('请选择' + page.pageTitle + '！', 'warning');
						return false;
					}
					var url ='';
					if($('body').data("code")) {
						url='/ma/sys/expFuncSys/getRgInfo?rgCode=' + ma.rgCode + '&setYear=' + ma.setYear;
					}else{
						url='/ma/sys/expFuncSys/getSysRgInfo?rgCode=' + ma.rgCode + '&setYear=' + ma.setYear;
					}
					page.modal = ufma.selectBaseTree({
						url: url,
						rootName: '所有区划',
						title: '选择下发区划',
						bSearch: true, //是否有搜索框
						buttons: { //底部按钮组
							'确认下发': {
								class: 'btn-primary',
								action: function(data) {
									if(data.length == 0) {
										ufma.alert('请选择区划！', 'warning');
										return false;
									}
									var dwCode = [];
									for (var i = 0; i < data.length; i++) {
										//dwCode.push({
											dwCode.push(data[i].CHR_CODE);
										//});
									}
									ufma.showloading('数据下发中，请耐心等待...');
									var url = '/ma/sys/commonRg/issueSys';
									var argu = {
										'chrCodes': gnflData,
										'toRgCodes': dwCode,
										"eleCode": page.eleCode,
										"agencyCode" : page.agencyCode,
										"rgCode": ma.rgCode,
										"setYear": ma.setYear
									};
									var callback = function(result) {
										ufma.hideloading();
										ufma.showTip(result.msg, function() {}, result.flag);
										page.modal.close();
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
								action: function() {
									page.modal.close();
								}
							}
						}
					});
				});

				//"单位级页面监听------------"
				$('.btn-choose').on('click', function(e) {
					e.preventDefault();
					page.getExpFuncChoose();
					page.openChooseWin();
				});
				//选用
				$('.btn-agyChoose').on('click', function(e) {
					var checkRow = page.getChooseCheckedRows();
					ufma.showloading('数据下发中，请耐心等待...');
					var argu = {
						chrCodes: checkRow,
						toAgencyCodes: [page.agencyCode],
						tableName: page.tableParam,
						rgCode: ma.rgCode,
						setYear: ma.setYear
					}
					
					var url = "/ma/sys/commonRg/issueSys";
					var callback = function(result) {
						if(result) {
							ufma.hideloading();
							ufma.showTip("选用成功！", function() {
								page.choosePage.close();
								page.initPage();
							}, "success");
							page.issueTips(result,true);
						}
					};
					ufma.post(url, argu, callback);
				});

				$('.btn-agyClose').on('click', function(e) {
					e.preventDefault();
					page.choosePage.close();
				});

			},

			getQueryString: function(url) {
				var tableParam;
				if(url.indexOf("?") != -1) {
					var str = url.substr(1);
					var strs = str.split("&");
					for(var i = 0; i < strs.length; i++) {
						tableParam = unescape(strs[i].split("=")[1]);
						break;
					}
				}
				return tableParam;
			},

			//初始化表单名称
			initFormPage: function() {
				$('#expfunc-choose .u-msg-title h4').text("选用" + page.pageTitle);
				$('#expfunc-edt .u-msg-title h4').text(page.pageTitle + "编辑");
				$('#form-expfunc .form-group .tab-paramcode').text(page.pageTitle + "编码：");
				$('#form-expfunc .form-group .tab-paramname').text(page.pageTitle + "名称：");

			},

			//初始化加载引用单位信息
			reqInitRightIssueAgy: function() {
				var argu = {
					"rgCode": ma.rgCode,
					"setYear": ma.setYear,
					'agencyCode':page.agencyCode,
					"chrCodes": [],
					'eleCode': page.eleCode
				};
				ufma.post("/ma/sys/commonRg/countRgUse", argu, function (result) {
					var data = result.data;
					var columnsArr = [{
							data: "rgCode",
							title: "单位ID",
							visible: false
						},
						{
							data: "agencyName",
							title: "单位"
						},
						{
						data: "issuedCount",
							title: "已用"
						}
					];

					var isRight = true;
					if(data != null && data != "null") {
						if(data.length > 0) {
							for(var i = 0; i < data.length; i++) {
								//console.info(JSON.stringify(data[i]));
								if(!data[i].hasOwnProperty("agencyCode")) {
									ufma.alert("第" + i + "条数据的agencyCode(" + data[i].agencyCode + ")字段不存在！", "error");
									isRight = false;
									return false;
								}
								if(!data[i].hasOwnProperty("agencyName")) {
									ufma.alert("第" + i + "条数据的agencyName(" + data[i].agencyName + ")字段不存在！", "error");
									isRight = false;
									return false;
								}
								if (!data[i].hasOwnProperty("issuedCount")) {
									ufma.alert("第" + i + "条数据的count(" + data[i].count + ")字段不存在！", "error");
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

					if(isRight) {
						page.getDWUsedInfo(data, columnsArr);
					} else {
						ufma.alert("后台数据格式不正确！", "error");
						return false;
					}
				})
			},
			//当页面为部门预算经济分类,添加单位类型列 by guohx 20180608
			drawAgencyType: function(data) {
				$('#agencyType1').html("");
				var $table = $('#agencyType1');
				var $dl = $('<label class="control-label em10">单位类型：</label>').appendTo($table);
				var $dl4 = $('<div class="control-element w180">').appendTo($table);
				var $dl3 = $('<select class="form-control"  name="agencyType1">').appendTo($dl4);
				for(var i = 0; i < data.length; i++) {
					var $dl1 = $('<option value="' + data[i].ENU_CODE + '">' + data[i].ENU_NAME + '</option>').appendTo($dl3);
				}
				var $dl2 = $('</select>' +
					'<label for="agencyType1" class="control-label hide"></label>' +
					'</div> ').appendTo($dl4);
			},
			initPage: function() {
				//初始化标题头
				$('.caption-subject').text(page.pageTitle);
				this.initFormPage();
				this.getCommonData();
			},

			//此方法必须保留
			init: function() {
				page.reslist = ufma.getPermission();
				var pfData = ufma.getCommonData();
				page.agencyCode = pfData.svAgencyCode;
				page.rgCode = pfData.svRgCode;
				page.agencyName = pfData.svAgencyName;
				page.rgCode = pfData.svRgCode;
				page.tableParam = this.getQueryString(window.location.search);
				if(page.tableParam == 'MA_ELE_EXPECO') { //部门预算经济分类增加"单位类型"列 guohx 20180608 获取单位类型
					$("#agencyType1").removeClass('hide');
					var url = "/ma/pub/enumerate/AGENCY_TYPE_CODE";
					var argu = {
						"agencyCode": page.agencyCode,
						"rgcode": page.rgCode
					};
					var callback = function(result) {
						page.drawAgencyType(result.data);
					}
					ufma.get(url, argu, callback);
				} else {
					$("#agencyType1").addClass('hide');
				}
				page.pageTitle = this.getPageName(page.tableParam).title;
				page.eleCode = this.getPageName(page.tableParam).eleCode;
				$('[data-for="' + page.eleCode + '"]').removeClass('none');
				$('div[data-for]:not([data-for="' + page.eleCode + '"])').remove();

				$('#expfunc-help li').eq(0).text('请输入' + page.pageTitle + '编码获得参考信息')
				//初始化title
				if($('body').data("code")) {
					$(document).attr("title", page.pageTitle + "（单位级）");
					page.cbAgency = $("#cbAgency").ufmaTreecombox2({
						url:"/ma/sys/commonRg/getAllRgInfo?rgCode=" + ma.rgCode + '&setYear=' + ma.setYear,
						leafRequire: false,
						onchange: function(data) {
							//page.agencyCode = page.cbAgency.getValue();
							pfData.svRgCode = page.cbAgency.getValue();
							ma.rgCode = page.cbAgency.getValue();
							page.rgCode = page.cbAgency.getValue();
							page.agencyCode = '*';
							page.initPage();
							$("label.mt-checkbox").find('input[type="checkbox"]').prop("checked", false);
							ma.initfifa('/ma/sys/element/getEleDetail', {
								eleCode: page.eleCode,
								agencyCode: page.agencyCode,
								rgCode: ma.rgCode,
								setYear: ma.setYear
							});
							$('.table-sub-info').text(ma.ctrlName);
							if (!$.isNull(ma.ruleData)) {
								page.agencyCtrlLevel = ma.ruleData.agencyCtrllevel;
								if (page.agencyCtrlLevel == "0101") { //无按钮
									$(".btn-choose,.btn-add").hide();
								} else if (page.agencyCtrlLevel == "0102") { //右上角：选用  
									$(".btn-choose").show();
									$(".btn-add").hide();
								} else if (page.agencyCtrlLevel == "0201") { //右上角：新增  表格：增加下级
									$(".btn-choose").hide();
									$(".btn-add").show();
								} else if (page.agencyCtrlLevel == "0202") { //右上角：新增 表格：增加下级
									$(".btn-choose").hide();
									$(".btn-add").show();
								} else if (page.agencyCtrlLevel == "03") { //右上角：新增  
									$(".btn-choose").hide();
									$(".btn-add").show();
								}
							}

						},
						initComplete: function (sender) {
							if(!$.isNull(page.rgCode)) {
								page.cbAgency.val(page.rgCode);
							} else {
								page.cbAgency.val(1);
							}
							//page.agencyCode = page.cbAgency.getValue();
							ma.rgCode = pfData.svRgCode;
							page.rgCode = pfData.svRgCode;
							page.agencyCode = '*';
						}
					});
					//					page.baseUrl = '/ma/agy/';
					page.baseUrl = '/ma/sys/';
 
				} else {
					$(document).attr("title", page.pageTitle);
					page.baseUrl = '/ma/sys/';
					page.agencyCode = "*";
					ma.rgCode = pfData.svRgCode;
					page.rgCode = pfData.svRgCode;
					page.initPage();
					//购物车表格初始化
					this.reqInitRightIssueAgy();
				}
				ufma.parse(page.namespace);
				ufma.parseScroll();
 
				ma.initfifa('/ma/sys/element/getEleDetail', {
					eleCode: page.eleCode,
					agencyCode: page.agencyCode,
					rgCode: ma.rgCode,
					setYear: ma.setYear
				});
				$('.table-sub-info').text(ma.ctrlName);
				this.onEventListener();

				//请求自定义属性
				//reqFieldList(page.agencyCode, page.eleCode);
			}
		}
	}();

	page.init();
});