$(function() {
	var page = function() {
		var agencyCtrlLevel;
		var agencyCtrlLevelName;
		//        var agencyCode;
		var usedDataTable; //引用表格对象
		return {
			agencyCode: "*",
			namespace: 'expFunc',
			get: function(tag) {
				return $('#' + this.namespace + ' ' + tag);
			},
			getFJ: function() {

			},
			getInterface: function(action) {
				var urls = {
					del: {
						type: 'delete',
						url: '/ma/sys/expFuncSys/delete?rgCode=' + ma.rgCode + '&setYear=' + ma.setYear
					},
					active: {
						type: 'put',
						url: '/ma/sys/expFuncSys/able?rgCode=' + ma.rgCode + '&setYear=' + ma.setYear
					},
					unactive: {
						type: 'put',
						url: '/ma/sys/expFuncSys/able?rgCode=' + ma.rgCode + '&setYear=' + ma.setYear
					},
					addlower: {
						type: 'post',
						url: '/ma/sys/common/getMaxLowerCode?rgCode=' + ma.rgCode + '&setYear=' + ma.setYear
					}
				}
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
			initKMTXLabels: function() {
				var url = "/ma/sys/expFuncSys/queryBgtType";
				var argu = {
					"rgCode": ma.rgCode,
					"setYear": ma.setYear,
					'agencyCode': page.agencyCode
				};
				var $obj = $('#expfuncKMTXLabels');
				$obj.find(':not(.label-radio[value=""])').remove();
				var labelGroup = '';
				var callback = function(result) {
					$.each(result.data, function(idx, item) {
						labelGroup += '<a name="bgttypeCode" value="' + item.code + '" class="label label-radio">' + item.name + '</a>';
					});
					$(labelGroup).appendTo($obj);
				}
				ufma.get(url, argu, callback);
			},
			getExpFunc: function(pageNum, pageLen) {

				var argu = $('#query-tj').serializeObject();
				ufma.showloading('正在请求数据，请耐心等待...');
				var callback = function(result) {
					var id = "expfunc-data";
					var toolBar = $('#' + id).attr('tool-bar');
					$('#' + id).DataTable({
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
						"columns": [{
								title: '<label class="mt-checkbox mt-checkbox-single mt-checkbox-outline"> <input type="checkbox"' +
									'class="datatable-group-checkable"/>&nbsp;<span></span> </label>',
								data: "chrCode"
							},
							{
								title: "功能分类编码",
								data: "chrCode"
							},
							{
								title: "功能分类名称",
								data: "chrName"
							},
							{
								title: "状态",
								data: "enabledName"
							},
							{
								title: "预算体系",
								data: "bgttypeName"
							},
							{
								title: "操作",
								data: 'chrCode'
							}
						],
						"columnDefs": [{
								"targets": [0],
								"serchable": false,
								"orderable": false,
								"className": "checktd",
								"render": function(data, type, rowdata, meta) {
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
								"targets": [3],
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
									var active = rowdata.enabled == 1 ? 'hidden' : '';
									var unactive = rowdata.enabled == 0 ? 'hidden' : '';
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
                                    
									return '<a class="btn btn-icon-only btn-sm btn-permission btn-addlower" data-toggle="tooltip" ' + addlower + '  action= "addlower" rowcode="' + data + '" title="增加下级">' +
									'<span class="glyphicon icon-add-subordinate"></span></a>' +
									'<a class="btn btn-icon-only btn-sm btn-permission btn-start" data-toggle="tooltip" ' + active + ' action= "active" rowcode="' + data + '" title="启用">' +
									'<span class="glyphicon icon-play"></span></a>' +
									'<a class="btn btn-icon-only btn-sm btn-permission btn-stop" data-toggle="tooltip" ' + unactive + ' action= "unactive" rowcode="' + data + '" title="停用">' +
									'<span class="glyphicon glyphicon icon-ban"></span></a><a class="btn btn-icon-only btn-sm btn-permission btn-delete" data-toggle="tooltip" ' + addlower + ' action= "del" rowcode="' + data + '" title="删除">' +
									'<span class="glyphicon icon-trash"></span></a>'
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

							$("#printTableData .buttons-print").attr({
								"data-toggle": "tooltip",
								"title": "打印"
							});
							$("#printTableData .buttons-excel").attr({
								"data-toggle": "tooltip",
								"title": "导出"
							});
							//导出begin
							$("#printTableData .buttons-excel").off().on('click', function(evt) {
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

							//权限控制
							ufma.isShow(page.reslist);

						},
						"drawCallback": function(settings) {
							ufma.dtPageLength($(this));
							//权限控制
							ufma.isShow(page.reslist);

							$('#' + id).find("td.dataTables_empty").text("")
								.append('<img src="' + bootPath + 'images/noData.png"/><br/><i>目前还没有你要查询的数据</i>');

							$('#' + id + ' .btn-addlower[data-toggle="tooltip"]').tooltip();

							$('#' + id + ' .btn').on('click', function() {
								page._self = $(this);
							});
							$('#' + id + ' .btn-delete').ufTooltip({
								content: '您确定删除当前功能分类吗？',
								onYes: function() {
									ufma.showloading('数据删除中，请耐心等待...');
									page.delRowOne($(page._self).attr('action'), [$(page._self).attr('rowcode')], $(page._self).closest('tr'));
								},
								onNo: function() {}
							})
							$('#' + id + ' .btn-start').ufTooltip({
								content: '您确定启用当前功能分类吗？',
								onYes: function() {
									ufma.showloading('数据启用中，请耐心等待...');
									page.delRowOne($(page._self).attr('action'), [$(page._self).attr('rowcode')], $(page._self).closest('tr'));
								},
								onNo: function() {}
							})
							$('#' + id + ' .btn-stop').ufTooltip({
								content: '您确定停用当前功能分类吗？',
								onYes: function() {
									ufma.showloading('数据停用中，请耐心等待...');
									page.delRowOne($(page._self).attr('action'), [$(page._self).attr('rowcode')], $(page._self).closest('tr'));
								},
								onNo: function() {}
							})
							ufma.setBarPos($(window));
						}
					});
					//翻页取消勾选
					$('#' + id).on('page.dt', function() {
						$(".datatable-group-checkable,.checkboxes").prop("checked", false);
						$('#' + id).find("tbody tr.selected").removeClass("selected");
					});
					ufma.hideloading();
				};
				if(page.rgCode == '*') {
					//ufma.get("/ma/sys/expFuncSys/queryList?rgCode=" + ma.rgCode + "&setYear=" + ma.setYear, argu, callback);
					ufma.get("/ma/sys/expFuncSys/queryList?rgCode=" + ma.rgCode + "&setYear=" + ma.setYear+"&agencyCode="+page.agencyCode, argu, callback);
				} else {
				//	argu.chrId = "";
					ufma.get("/ma/sys/expFuncSys/queryList?rgCode=" + ma.rgCode + "&setYear=" + ma.setYear +"&agencyCode="+page.agencyCode, argu, callback);
//					ufma.get("/ma/agy/expFunc/queryList?rgCode=" + ma.rgCode + "&setYear=" + ma.setYear + "&agencyCode=" + page.agencyCode, argu, callback);
				}
			},

			//选用页面初始化
			getExpFuncChoose: function() {
				var argu = $('#query-tj').serializeObject();
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
								data: "chrCode"
							},
							{
								title: "功能分类编码",
								data: "chrCode"
							},
							{
								title: "功能分类名称",
								data: "chrName"
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

							/*var $info = $(toolBar + ' .info');
                            if ($info.length == 0) {
                                $info = $('<div class="info"></div>').appendTo($(toolBar + ' .tool-bar-body'));
                            }
                            $info.html('');
                            $('.' + id + '-paginate').appendTo($info);*/

							//权限控制
							ufma.isShow(page.reslist);

						},
						"drawCallback": function(settings) {
							ufma.dtPageLength($(this));

							//权限控制
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
				ufma.get("/ma/sys/expFuncSys/queryList?rgCode=" + ma.rgCode + "&setYear=" + ma.setYear, argu, callback);
			},

			//删除、启用、停用、批量操作  增加下级
			delRow: function(action, idArray, $tr) {
				var options = this.getInterface(action);
				page.pageNum = $('#expfunc-data_paginate').find('span a.paginate_button.current').text();
				page.pageLen = parseInt($('#expfunc-data_length').find('select').val());
				var argu = {
					chrCodes: idArray,
					action: action
				};
				var callback = function(result) {
					if(action == 'del') {
						if($tr)
							$tr.remove();
						else {
							page.getExpFunc(page.pageNum, page.pageLen);
						}
						if(result.flag == 'success') {
							ufma.hideloading();
							ufma.showTip('删除成功！', function() {}, 'success'); //guohx 增加删除成功提示
						}
					} else {
						/*if($tr) {
							$tr.find('.btn[action="active"]').attr('disabled', action == "active");
							$tr.find('.btn[action="unactive"]').attr('disabled', action == "unactive");
						*/	
							if(action == 'active') {
								if(result.flag == 'success') {
									ufma.hideloading();
									ufma.showTip('启用成功', function() {}, 'success');
									page.getExpFunc(page.pageNum, page.pageLen);
								}
							} else if(action == 'unactive') {
								if(result.flag == 'success') {
									ufma.hideloading();
									ufma.showTip('停用成功！', function() {}, 'success');
									page.getExpFunc(page.pageNum, page.pageLen);
								}
							}
						/*} else {
							page.getExpFunc(page.pageNum, page.pageLen);
						}*/
					}
				};
				if(action == 'del') {
					ufma.confirm('您确定要删除选中的功能分类吗？', function(action) {
						if(action) {
							ufma.showloading('数据删除中，请耐心等待...');
							//单位级
							argu.agencyCode = page.agencyCode;
							if(page.agencyCode != "*") {
//								options.url = "/ma/agy/expFunc/delete?rgCode=" + ma.rgCode + "&setYear=" + ma.setYear;
								options.url = "/ma/sys/expFuncSys/delete?rgCode=" + ma.rgCode + "&setYear=" + ma.setYear;
							}

							ufma.ajax(options.url, options.type, argu, callback);
						}
					}, {
						type: 'warning'
					});
				} else if(action == 'addlower') {
					$('#expFunc-chrCode').trigger('click');
					/*  $('#expFunc-chrCode').trigger('change');
					  $('#expFunc-chrCode').trigger('paste');
					  $('#expFunc-chrCode').trigger('keyup');*/
					var newArgu = {}
					newArgu.chrCode = argu.chrCodes[0];
					newArgu.eleCode = "EXPFUNC";
					newArgu.agencyCode = page.agencyCode;
					newArgu.rgCode = ma.rgCode
					newArgu.setYear = ma.setYear
					if(page.agencyCode != "*") {
						options.url = "/ma/sys/common/getMaxLowerCode"
					}
					ufma.ajax(options.url, options.type, newArgu, function(result) {
						var data = result.data;
						ma.isRuled = true;
						$("#expFunc-chrCode").val(data)

						page.action = "addlower";
						$('#expFunc-chrCode').trigger('click');
						/* $('#expFunc-chrCode').trigger('change');
						 $('#expFunc-chrCode').trigger('paste');
						 $('#expFunc-chrCode').trigger('keyup');*/
						page.openEdtWin();

					});
				} else if(action == 'active') {
					ufma.confirm('您确定要启用选中的功能分类吗？', function(action) {
						if(action) {
							ufma.showloading('数据启用中，请耐心等待...');
							//单位级
							argu.agencyCode = page.agencyCode;
							if(page.agencyCode != "*") {
								options.url = "/ma/sys/expFuncSys/able?rgCode=" + ma.rgCode + "&setYear=" + ma.setYear;
							}
							ufma.ajax(options.url, options.type, argu, callback);
						}
					}, {
						type: 'warning'
					});
				} else if(action == 'unactive') {
					ufma.confirm('您确定要停用选中的功能分类吗？', function(action) {
						if(action) {
							ufma.showloading('数据停用中，请耐心等待...');
							//单位级
							argu.agencyCode = page.agencyCode;
							if(page.agencyCode != "*") {
								options.url = "/ma/sys/expFuncSys/able?rgCode=" + ma.rgCode + "&setYear=" + ma.setYear;
							}
							ufma.ajax(options.url, options.type, argu, callback);
						}
					}, {
						type: 'warning'
					});
				}
			},
			delRowOne: function(action, idArray, $tr) {
				var options = this.getInterface(action);
				page.pageNum = $('#expfunc-data_paginate').find('span a.paginate_button.current').text();
				page.pageLen = parseInt($('#expfunc-data_length').find('select').val());
				var argu = {
					chrCodes: idArray,
					action: action,
					rgCode: ma.rgCode,
					setYear: ma.setYear
				};
				var callback = function(result) {
					if(action == 'del') {
						/*不重新加载，删除父亲结点
						if ($tr)
						    $tr.remove();
						else
						*/
						ufma.showloading('数据删除中，请耐心等待...');
						page.getExpFunc(page.pageNum, page.pageLen);
						if(result.flag == 'success') {
							ufma.hideloading();
							ufma.showTip('删除成功！', function() {}, 'success'); //guohx 增加删除成功提示
						}
					} else {
						if($tr) {
							$tr.find('.btn[action="active"]').attr('disabled', action == "active");
							$tr.find('.btn[action="unactive"]').attr('disabled', action == "unactive");
							page.getExpFunc(page.pageNum, page.pageLen);
							if(action == 'active') {
								ufma.showloading('数据启用中，请耐心等待...');
								if(result.flag == 'success') {
									ufma.hideloading();
									ufma.showTip('启用成功', function() {}, 'success');
								}
							} else if(action == 'unactive') {
								ufma.showloading('数据停用中，请耐心等待...');
								if(result.flag == 'success') {
									ufma.hideloading();
									ufma.showTip('停用成功！', function() {}, 'success');
								}
							}
						} else {
							page.getExpFunc(page.pageNum, page.pageLen);
						}
					}
				};
				if(action == 'del') {
					//单位级
					argu.agencyCode = page.agencyCode;
					if(page.agencyCode != "*") {
//						options.url = "/ma/agy/expFunc/delete?rgCode=" + ma.rgCode + "&setYear=" + ma.setYear;
						options.url = "/ma/sys/expFuncSys/delete?rgCode=" + ma.rgCode + "&setYear=" + ma.setYear;
					}
					ufma.ajax(options.url, options.type, argu, callback);
				} else {
					//单位级
					argu.agencyCode = page.agencyCode;
					if(page.agencyCode != "*") {
//						options.url = "/ma/agy/expFunc/able?rgCode=" + ma.rgCode + "&setYear=" + ma.setYear;
						options.url = "/ma/sys/expFuncSys/able?rgCode=" + ma.rgCode + "&setYear=" + ma.setYear;
					}
					ufma.ajax(options.url, options.type, argu, callback);
				}
			},
			getCheckedRows: function() {
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
			openEdtWin: function(data) {
				if($('body').attr('data-code') && page.action == 'edit') {
					page.chrId = data.chrId;
				}
                if(page.action == 'edit') {
                	//ma.isEdit为true，编辑回显，校验编码不显示错误信息
                    ma.isEdit = true;
                }
				if(page.action == 'edit' || page.action == 'addlower') {
					if(page.action == 'addlower') {
						$("#expFunc-chrCode").removeAttr('disabled')
						$('#expFunc-chrName').val('')

					}
					var thisCode = $("#expFunc-chrCode").val();
					if($("#expFunc-chrCode") != "" && thisCode != "") {
						var obj = {
							"chrCode": thisCode,
							"tableName": "MA_ELE_EXPFUNC",
							"eleCode": "EXPFUNC",
							"rgCode": ma.rgCode,
							"setYear": ma.setYear,
							"agencyCode": page.agencyCode,
							"accctCode":page.acctCode
						}
						ma.nameTip = "";
						if(data!=undefined){
							ma.nameTip = data.chrFullname;
						}
//						ufma.ajaxDef("/ma/sys/common/getParentChrFullname", "post", obj, function(result) {
//							ma.nameTip = openEdtWin;
//						});
					}
				}
				if(data != undefined) {
					ufma['expFunc-bgttypeCode'].val(data.bgttypeCode).trigger("change");
				}
				$('.u-msg-footer button').removeAttr('disabled')
				if(page.action == 'add') {
					data.chrId = "";
					data.chrCode = "";
					data.chrName = "";
					data.lastVer = "";
					$("form input[type='hidden']").val("");
				}

				page.editor = ufma.showModal('expfunc-edt', 800, 420);
				page.formdata = data;
				for(var i = 1; i < 6; i++) {
					if(page.formdata["field" + i] == null) {
						page.formdata["field" + i] = ''
					}
				}
				if($('.btn-save').prop('display') == 'none') {
					$('#form-expfunc').disable()
				}
				$('#prompt').text('编码规则：' + ma.fjfa)
			},
			openChooseWin: function() {
				page.choosePage = ufma.showModal('expfunc-choose', 1000, 500);
			},
			bsAndEdt: function(data) {
				page.action = 'edit';
				$('#expFunc-chrCode').attr('disabled', true);
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
				if(!ma.formValidator("expFunc-chrCode", "expFunc-chrName", "功能分类", page.action)) {
					return false;
				}
				var argu = $('#form-expfunc').serializeObject();
				argu.agencyCode = page.agencyCode;
				if($("#expFunc-chrCode").val().length == parseInt(ma.fjfa.substring(0, 1))) {
					argu["chrFullname"] = $("#expFunc-chrName").val();
				} else {
					argu["chrFullname"] = ma.nameTip + "/" + $("#expFunc-chrName").val();
				}

				var callback = function(result) {
					$("[name='chrId']").val('');
					$("[name='lastVer']").val('');
					$('#expFunc-chrCode').removeAttr('disabled');
					page.getExpFunc(page.pageNum, page.pageLen);
					if(!goon) {
						ufma.showTip('保存成功！', function() {}, 'success');
						$('#form-expfunc')[0].reset();
						page.editor.close();
						$('.form-group').removeClass('error')
						$('#expFunc-chrCode-help').remove()

					} else {
						ufma.showTip('保存成功,您可以继续添加功能分类！', function() {}, 'success');
						$('#form-expfunc')[0].reset();
						$("#expFunc-chrCode").removeAttr("disabled");
						page.formdata = $('#form-expfunc').serializeObject();

						ma.fillWithBrother($('#expFunc-chrCode'), {
							"chrCode": argu.chrCode,
							"eleCode": "EXPFUNC",
							"agencyCode": page.agencyCode
						});
					}
				}
				var url = "";
				if(page.agencyCode == "*") {
					argu.rgCode = ma.rgCode
					argu.setYear = ma.setYear
					url = '/ma/sys/expFuncSys/save?rgCode=' + ma.rgCode + '&setYear=' + ma.setYear;
				} else {
					if(page.chrId != undefined) {
						argu.chrId = page.chrId
					} else {
						argu.chrId = ''
					}
					argu.rgCode = ma.rgCode
					argu.setYear = ma.setYear
//					url = '/ma/agy/expFunc/save?rgCode=' + ma.rgCode + '&setYear=' + ma.setYear;
					url = '/ma/sys/expFuncSys/save?rgCode=' + ma.rgCode + '&setYear=' + ma.setYear;
				}
				ufma.post(url, argu, callback);
			},
			setFormEnabled: function() {
				if(page.action == 'edit') {

					if($('body').data("code")) {
						if(page.agencyCtrlLevel == "0101" || page.agencyCtrlLevel == "0102") {
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

					$(document).find('.form-group').each(function() {
						$(this).removeClass('error');
						$(this).find(".input-help-block").remove();
					});
				} else if(page.action == 'add') {
					$('#expFunc-chrCode').removeAttr('disabled');
				}
				ma.isRuled = true;
				if(page.action == 'add') {
					$('#form-expfunc')[0].reset();
				}
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
				data.colName = '支出功能分类';
				data.pageType = 'EXPFUNC';
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

					// var chrCodes = [];
					// $('#expfunc-data').find(".selected").each(function(){
					// 	var code = $(this).find("input.checkboxes").val();
					// 	chrCodes.push(code);
					// });
					// console.info(JSON.stringify(chrCodes));
					// if(chrCodes.length>0){
					// 	var argu = {
					// 			"chrCodes":chrCodes,
					// 			"rgCode":ma.rgCode,
					// 			"setYear":ma.setYear
					// 		};
					// 	ufma.post("/ma/sys/expFunc/getRightIssueAgy",argu,function(result){
					// 		var data = result.data;
					// 		var columnsArr = [
					// 			{data:"chrCode",title:"编码",visible:false},
					// 			{data:"agencyCode",title:"单位代码"},
					// 			{data:"agencyName",title:"单位名称"}
					// 		];

					// 		var isRight = true;
					// 		if(data != null  && data != "null"){
					// 			if(data.length>0){
					// 				for(var i=0;i<data.length;i++){
					// 					console.info(JSON.stringify(data[i]));
					// 					if(!data[i].hasOwnProperty("chrCode")){
					// 						console.info("第"+i+"条数据的chrCode("+data[i].chrCode+")字段不存在！");
					// 						isRight = false;
					// 						return false;
					// 					}
					// 					if(!data[i].hasOwnProperty("agencyCode")){
					// 						console.info("第"+i+"条数据的agencyCode("+data[i].agencyCode+")字段不存在！");
					// 						isRight = false;
					// 						return false;
					// 					}
					// 					if(!data[i].hasOwnProperty("agencyName")){
					// 						console.info("第"+i+"条数据的agencyName("+data[i].agencyName+")字段不存在！");
					// 						isRight = false;
					// 						return false;
					// 					}
					// 				}	
					// 			}
					// 		}else{
					// 			console.info(data+":格式不正确！");
					// 			isRight = false;
					// 			return false;
					// 		}

					// 		if(isRight){
					//     		page.usedDataTable.clear().destroy();
					//             page.getDWUsedInfo(data,columnsArr);
					// 		}else{
					// 			ufma.alert("后台数据格式不正确！","error");
					// 			return false;
					// 		}

					// 	});
					// }else{
					// 	//购物车表格初始化
					// 	page.usedDataTable.clear().destroy();
					// 	page.reqInitRightIssueAgy();
					// }

				});
				$('.right').on('click', function(e) {
					var chrCodes = [];
					$('#expfunc-data').find(".selected").each(function() {
						var code = $(this).find("input.checkboxes").val();
						chrCodes.push(code);
					});
					console.info(JSON.stringify(chrCodes));
					if(chrCodes.length > 0) {
						var argu = {
							"rgCode": ma.rgCode,
							"setYear": ma.setYear,
							'agencyCode':page.agencyCode,
							"chrCodes": chrCodes,
							'eleCode':'EXPFUNC'
						}
						ufma.post("/ma/sys/commonRg/countRgUse", argu, function(result) {
							var data = result.data;
							var columnsArr = [{
								data: "issuedCount",
								title: "使用"
							},
							{
								data: "rgCode",
								title: "区划代码"
							},
							{
								data: "agencyName",
								title: "区划名称"
							}
							];

							var isRight = true;
							if(data != null && data != "null") {
								if(data.length > 0) {
									for(var i = 0; i < data.length; i++) {
										console.info(JSON.stringify(data[i]));
//										if(!data[i].hasOwnProperty("chrCode")) {
//											console.info("第" + i + "条数据的chrCode(" + data[i].chrCode + ")字段不存在！");
//											isRight = false;
//											return false;
//										}
										if(!data[i].hasOwnProperty("agencyCode")) {
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

							if(isRight) {
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

				$('.btn-add').on('click', function(e) {
					e.preventDefault();
					page.action = 'add';
					var data = $('#form-expfunc').serializeObject();
					page.setFormEnabled();
					page.openEdtWin(data);
				});
				$('.btn-close').on('click', function() {
					var tmpFormData = $('#form-expfunc').serializeObject();
					//                    console.info(page.formdata);
					//                    console.info(tmpFormData)
					if(!ufma.jsonContained(page.formdata, tmpFormData) && $('.btn-save').prop('display') != 'none') {
						ufma.confirm('您修改了功能分类信息，关闭前是否保存？', function(action) {
							if(action) {
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
				$('.btn-saveadd').on('click', function() {
					page.save(true);
				});
				$('.btn-save').on('click', function() {
					page.save(false);
				});
				$(document).on('click', '.label-radio', function(e) {
					e = e || window.event;
					e.stopPropagation();
					ufma.deferred(function() {
						page.getExpFunc(page.agencyCode);
					});
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
				$('.btn-delete').on('click', function(e) {
					e.stopPropagation();
					var checkedRow = page.getCheckedRows();
					if(checkedRow.length == 0) {
						ufma.alert('请选择功能分类！', "warning");
						return false;
					}
					page.delRow('del', checkedRow);
				});
				$('.btn-start').on('click', function(e) {
					e.stopPropagation();
					var checkedRow = page.getCheckedRows();
					if(checkedRow.length == 0) {
						ufma.alert('请选择功能分类！', "warning");
						return false;
					}
					page.delRow('active', checkedRow);
				});
				$('.btn-stop').on('click', function(e) {
					e.stopPropagation();
					var checkedRow = page.getCheckedRows();
					if(checkedRow.length == 0) {
						ufma.alert('请选择功能分类！', "warning");
						return false;
					}
					page.delRow('unactive', checkedRow);
				});
				//增加下级
				$('body').on('click', '.btn-addlower', function(e) {
					e.stopPropagation();
					var checkedRow = [];
					checkedRow.push($(this).parents("tr").find("input").val());
					page.chrId = ''
					page.delRow('addlower', checkedRow);
					$('#expFunc-chrCode').trigger('keydown');
					$('#expFunc-chrCode').trigger('change');
					$('#expFunc-chrCode').trigger('paste');
					$('#expFunc-chrCode').trigger('keyup');

				});
				//下发
				$('.btn-senddown').on('click', function(e) {
					e.stopPropagation();
					var gnflData = page.getCheckedRows();
					if(gnflData.length == 0) {
						ufma.alert('请选择功能分类！', "warning");
						return false;
					}
					var url ='';
					if($('body').data("code")) {
						url='/ma/sys/expFuncSys/getRgInfo?rgCode=' + ma.rgCode + '&setYear=' + ma.setYear;
					}else{
						url='/ma/sys/expFuncSys/getSysRgInfo?rgCode=' + ma.rgCode + '&setYear=' + ma.setYear;
					}
					page.modal = ufma.selectBaseTree({
						url:url,
						rootName: '所有区划',
						title: '选择下发区划',
						bSearch: true, //是否有搜索框
						filter: { //其它过滤条件
							/*'单位类型': { //标签
								ajax: '/ma/pub/enumerate/AGENCY_TYPE_CODE?rgCode=' + ma.rgCode + '&setYear=' + ma.setYear, //地址
								formControl: 'combox', //表单元素
								data: {},
								idField: 'ENU_CODE',
								textField: 'ENU_NAME',
								filterField: 'agencyType',
							}*/
						},
						buttons: { //底部按钮组
							'确认下发': {
								class: 'btn-primary',
								action: function(data) {
									if(data.length == 0) {
										ufma.alert('请选择区划！', "warning");
										return false;
									}
									var dwCode = [];
									for(var i = 0; i < data.length; i++) {
										//                                      if (data[i].id != '0') {
										//                                          dwCode.push(data[i].id);
										//                                      }
										if(!data[i].isParent) {
											dwCode.push(data[i].CHR_CODE);
										}
									}
									var url = '/ma/sys/expFuncSys/issue';
									var argu = {
										'chrCodes': gnflData,
										'toRgCodes': dwCode,
										"eleCode": page.eleCode,
										"agencyCode" : page.agencyCode,
										"rgCode": ma.rgCode,
										"setYear": ma.setYear
									};
									//bug76584--zsj--经侯总确定加此类进度条
									ufma.showloading('数据下发中，请耐心等待...');
									var callback = function(result) {
										ufma.hideloading(); 
										ufma.showTip(result.msg, function() {}, result.flag);
										page.issueTips(result);
										page.modal.close();
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
					console.info(JSON.stringify(checkRow));
					var argu = {
						"chrCodes": checkRow,
						"toAgencyCodes": [page.agencyCode],
						"rgCode": ma.rgCode,
						"setYear": ma.setYear
					}
					
					var url = "/ma/Sys/expFuncSys/issue";
					var callback = function(result) {
						if(result.flag == "success") {
							ufma.showTip("选用成功", function() {
								page.choosePage.close();
								page.initPage();
							}, 'success');
                            page.issueTips(result,true);
						} else {
							ufma.alert(result.msg, "error");
							return false;
						}
					};
					ufma.post(url, argu, callback);
				});

				$('.btn-agyClose').on('click', function(e) {
					e.preventDefault();
					page.choosePage.close();
				});
			},

			//初始化加载引用单位信息
			reqInitRightIssueAgy: function() {
				var argu = {
					"rgCode": ma.rgCode,
					"setYear": ma.setYear,
					'agencyCode':page.agencyCode,
					'chrCodes':[],
					'eleCode':'EXPFUNC'
				}
				ufma.post("/ma/sys/commonRg/countRgUse", argu, function(result) {
					var data = result.data;
					var columnsArr = [{
							data: "rgCode",
							title: "区划ID",
							visible: false
						},
						{
							data: "agencyName",
							title: "区划名称"
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
								//    							console.info(JSON.stringify(data[i]));
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
								if(!data[i].hasOwnProperty("issuedCount")) {
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

					if(isRight) {
						page.getDWUsedInfo(data, columnsArr);
					} else {
						ufma.alert("后台数据格式不正确！", "error");
						return false;
					}
				})
			},
			//获取要素的详细信息
			getEleDetail:function(){
				var argu = {
					"eleCode": 'EXPFUNC',
					'agencyCode': page.agencyCode,
					"rgCode": ma.rgCode,
					"setYear": ma.setYear
				};
				ma.initfifa('/ma/sys/element/getEleDetail', argu, callbackFun);
				function callbackFun(data,ctrlName) {
					page.agencyCtrlLevel = data.agencyCtrlLevel;
					$(".table-sub-info").text(ctrlName);
					if (page.agencyCtrlLevel == "0101") { //无按钮
						$(".btn-add").hide();
						$(".btn-choose").hide();
					} else if (page.agencyCtrlLevel == "0102") { //右上角：选用
						$(".btn-choose").show();
						$(".btn-add").hide();
					} else if (page.agencyCtrlLevel == "0201") { //右上角：新增  表格：增加下级
						$(".btn-choose").hide();
						$(".btn-add").show();
						//$(".btn-addlower").show();
					} else if (page.agencyCtrlLevel == "0202") { //右上角：新增  表格：增加下级
						$(".btn-choose").hide();
						$(".btn-add").show();
						//$(".btn-addlower").show();
					} else if (page.agencyCtrlLevel == "03") { //右上角：新增
						$(".btn-choose").hide();
						$(".btn-add").show();
					}
				}
				// var argu = {
				// 	"rgCode": ma.rgCode,
				// 	"setYear": ma.setYear,
				// 	'agencyCode': page.agencyCode,
				// 	"eleCode": 'EXPFUNC'
				// };
				// ufma.get("/ma/sys/element/getEleDetail", argu, function (result) {
				// 	var data = result.data;
				// })
			},

			//初始化页面
			initPage: function() {
				//购物车表格初始化
				this.reqInitRightIssueAgy();
				//表格初始化
				this.getExpFunc();
				//初始化级次
				this.getFJ();
				$("#expFunc-bgttypeCode").attr('url','/ma/sys/expFuncSys/queryBgtType?rgCode='+ ma.rgCode +'&setYear='+ ma.setYear +'&agencyCode='+page.agencyCode)
				ufma.comboxInit('expFunc-bgttypeCode');
				//获取预算体系
				this.initKMTXLabels();
				//                if (page.agencyCode != '*') {
				//                    this.getExpFuncChoose();
				//                }
				//				ma.initfifa('/ma/sys/element/getElementCodeRule', {
				//					"tableName": "MA_ELE_EXPFUNC",
				//					"rgCode": ma.rgCode,
				//					"setYear": ma.setYear
				//				});
				

				setTimeout(function () {
					//编码验证
					ma.codeValidator('expFunc-chrCode', '功能分类', '/ma/sys/common/findParentList?eleCode=EXPFUNC&acctCode=' + page.acctCode, page.agencyCode, "expfunc-help");

					//名称验证
					ma.nameValidator('expFunc-chrName', '功能分类');
				}, 300);
			},

			init: function() {
				//获取session
				var pfData = ufma.getCommonData();
				page.agencyCode = '*';
				page.rgCode = pfData.svRgCode;
				page.agencyName = pfData.svAgencyName;
				page.reslist = ufma.getPermission();
				ufma.parseScroll();
				if($('body').data("code")) {
					
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
							//                            $("label.mt-checkbox").find('input[type="checkbox"]').prop("checked", false);
						},
						initComplete: function(sender) {

							if(!$.isNull(page.rgCode)) {
								page.cbAgency.val(page.rgCode);
							} else {
								page.cbAgency.val(1);
							}
							pfData.svRgCode = page.cbAgency.getValue();
							ma.rgCode = page.cbAgency.getValue();
							page.rgCode = page.cbAgency.getValue();
							page.agencyCode = '*';
						}
					});
					//					'ufma.getEleCtrlLevel("/ma/sys/expFunc/queryCtrlLevel", function(result) {
					//						$('.table-sub-info').text(result);
					//					});'

				} else {
					page.agencyCode = '*';
					ma.rgCode = pfData.svRgCode;
					page.rgCode = pfData.svRgCode;
					this.initPage();
					//系统级打开页面请求要素详细信息
					page.getEleDetail();
				}

				this.onEventListener();
				ufma.parse(page.namespace);
				page.eleCode = "EXPFUNC";
				//请求自定义属性
				//reqFieldList(page.agencyCode, "EXPFUNC");
				
			}
		}
	}();

	page.init();
});