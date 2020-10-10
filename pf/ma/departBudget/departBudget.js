$(function() {
	var page = function() {
		var agencyCtrlLevel;
		var govExpecoTable;
		var agencyCode;
		var eleCode = "EXPECO";
		var tableParam = 'MA_ELE_EXPECO';
		var baseUrl;
		var usedDataTable; //引用表格对象
		var agencyType;
		var pageNum = '';
		var pageLen = '';
		//bug76381--zsj--若从凭证录入界面跳入此界面则此界面的单位默认为凭证录入界面的单位
		var prevAgencyCode = '';
		var sessionData = JSON.parse(window.sessionStorage.getItem("maobjData"));
		if(sessionData != undefined) {
			prevAgencyCode = sessionData.agencyCode;
			ufma.removeCache("maobjData");
		}
		var acctAlldata;
		return {
			namespace: 'govMoban',
			get: function(tag) {
				return $('#' + this.namespace + ' ' + tag);
			},
			getInterface: function(action) {
				var urls = {
					del: {
						type: 'delete',
						url: page.baseUrl + 'common/delete'
					},
					active: {
						type: 'put',
						url: page.baseUrl + 'common/able'
					},
					unactive: {
						type: 'put',
						url: page.baseUrl + 'common/able'
					},
					addlower: {
						type: 'post',
						url: page.baseUrl + 'common/getMaxLowerCode'
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
				ufma.hideloading();
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
			initTable: function() {
				var columns = [{
						title: '<label class="mt-checkbox mt-checkbox-single mt-checkbox-outline"> <input type="checkbox"' +
							'id="CheckAll" class="datatable-group-checkable"/> &nbsp;<span></span> </label>',
						data: "chrId",
						width: 50
					},
					{
						title: "部门经济分类编码",
						data: "chrCode",
						className: 'tl',
						width: 300
					},
					{
						title: "部门经济分类名称",
						data: "chrName",
						className: 'tl',
					},
					{
						title: "政府经济分类",
						data: "govexpecoName",
						render: function(rowid, rowdata, data) {
							return data.govexpecoCode + ' ' + data.govexpecoName
						}
					},
					{
						title: "状态",
						data: "enabledName",
						width: 60
					},
					{
						title: "操作",
						data: 'chrId',
						width: 120
					}
				];
				var id = "expfunc-data";
				var toolBar = $('#' + id).attr('tool-bar');
				page.govExpecoTable = $('#' + id).dataTable({
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
							"targets": [1, 2, 3, 4], ////部门预算经济分类增加"政府预算"列 guohx 20180620
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
								return '<a class="common-jump-link" style="display:block;text-indent:' + textIndent + '" href="javascript:;" data-href=\'' + alldata + '\'>' + data + '</a>';
							}
						},

						{
							"targets": [4],
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
								if (isOperate == "1") {
									return '<a class="btn btn-icon-only btn-sm btn-addlower" data-toggle="tooltip" ' + addlower + '  action= "addlower" rowid="' + data + '" chrCode="' + chrCode + '" agencyCode="' + agencyCode + '" title="增加下级" disabled>' +
									'<span class="glyphicon icon-add-subordinate"></span></a>' +
									'<a class="btn btn-icon-only btn-sm btn-start" data-toggle="tooltip" ' + active + ' action= "active" rowid="' + data + '" chrCode="' + chrCode + '" agencyCode="' + agencyCode + '" title="启用" disabled>' +
									'<span class="glyphicon icon-play"></span></a>' +
									'<a class="btn btn-icon-only btn-sm btn-stop" data-toggle="tooltip" ' + unactive + ' action= "unactive" rowid="' + data + '" chrCode="' + chrCode + '" agencyCode="' + agencyCode + '" title="停用" disabled>' +
									'<span class="glyphicon glyphicon icon-ban"></span></a><a class="btn btn-icon-only btn-sm project-single-delete btn-delete" data-toggle="tooltip" ' + addlower + ' action= "del" rowid="' + data + '" chrCode="' + chrCode + '" agencyCode="' + agencyCode + '" title="删除" disabled>' +
									'<span class="glyphicon icon-trash"></span></a>';
								} else {
									return '<a class="btn btn-icon-only btn-sm btn-addlower" data-toggle="tooltip" ' + addlower + '  action= "addlower" rowid="' + data + '" chrCode="' + chrCode + '" agencyCode="' + agencyCode + '" title="增加下级">' +
									'<span class="glyphicon icon-add-subordinate"></span></a>' +
									'<a class="btn btn-icon-only btn-sm btn-start" data-toggle="tooltip" ' + active + ' action= "active" rowid="' + data + '" chrCode="' + chrCode + '" agencyCode="' + agencyCode + '" title="启用">' +
									'<span class="glyphicon icon-play"></span></a>' +
									'<a class="btn btn-icon-only btn-sm btn-stop" data-toggle="tooltip" ' + unactive + ' action= "unactive" rowid="' + data + '" chrCode="' + chrCode + '" agencyCode="' + agencyCode + '" title="停用">' +
									'<span class="glyphicon glyphicon icon-ban"></span></a><a class="btn btn-icon-only btn-sm project-single-delete btn-delete" data-toggle="tooltip" ' + addlower + ' action= "del" rowid="' + data + '" chrCode="' + chrCode + '" agencyCode="' + agencyCode + '" title="删除">' +
									'<span class="glyphicon icon-trash"></span></a>';
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
						//底部工具条浮动
						// ufma.parseScroll(); //修改驻底不跟随 guohx add 20190703  bug81853 
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
							ufma.expXLSForDatatable($('#' + id), '部门经济分类');
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
						$("#expfunc-data").tblcolResizable();
						//固定表头
						$("#expfunc-data").fixedTableHead($("#expfunc-main"));
					},
					"headerCallback": function() {

					},
					"drawCallback": function(settings) {
						ufma.dtPageLength($(this));
						ufma.isShow(page.reslist);
						$('#' + id).find("td.dataTables_empty").text("")
							.append('<img src="' + bootPath + 'images/noData.png"/><br/><i>目前还没有你要查询的数据</i>');

						$('#' + id + ' .btn-addlower[data-toggle="tooltip"]').tooltip();
						$('#' + id + ' .btn').on('click', function() {
							page._self = $(this);
						});
						$('#' + id + ' .btn-delete').ufTooltip({
							content: '您确定删除当前部门预算经济分类吗？',
							onYes: function() {
								ufma.showloading('数据删除中，请耐心等待...');
								page.delRowOne($(page._self).attr('action'), [$(page._self).attr('chrCode')], $(page._self).closest('tr'));
							},
							onNo: function() {}
						})
						$('#' + id + ' .btn-start').ufTooltip({
							content: '您确定启用当前部门预算经济分类吗？',
							onYes: function() {
								ufma.showloading('数据启用中，请耐心等待...');
								page.delRowOne($(page._self).attr('action'), [$(page._self).attr('chrCode')], $(page._self).closest('tr'));
							},
							onNo: function() {}
						})
						$('#' + id + ' .btn-stop').ufTooltip({
							content: '您确定停用当前部门预算经济分类吗？',
							onYes: function() {
								ufma.showloading('数据停用中，请耐心等待...');
								page.delRowOne($(page._self).attr('action'), [$(page._self).attr('chrCode')], $(page._self).closest('tr'));
							},
							onNo: function() {}
						});

						// ufma.setBarPos($(window));
					}
				});
				//翻页取消勾选
				$('#' + id).on('page.dt', function() {
					$(".datatable-group-checkable,.checkboxes").prop("checked", false);
					$('#' + id).find("tbody tr.selected").removeClass("selected");
				});
			},
			getCommonData: function() {
				var url = "/ma/sys/expeco/select";
				var argu = $('#enabled').serializeObject();
				if(!$('body').data("code")) { //系统级
					argu["govAgencyType"] = $('#query-tj').find('a[name="divkind"].selected').attr("value");
				} else {
					argu["govAgencyType"] = page.divKind;
				}
				argu["agencyCode"] = page.agencyCode;
				argu["acctCode"] = page.acctCode;
				argu["table"] = 'MA_ELE_EXPECO';
				argu["rgCode"] = ma.rgCode;
				argu["setYear"] = ma.setYear;
				argu["setYear"] = ma.setYear;
				if(page.chooseAcctFlag == true) {
					ufma.showTip('请选择账套', function() {}, 'warning');
					return false;
				} else {
					ufma.showloading('正在请求数据，请耐心等待...');
					ufma.get(url, argu, function(result) {
						page.data = result.data;
						page.govExpecoTable.fnClearTable();
						if(result.data.length != 0) {
							page.govExpecoTable.fnAddData(result.data, true);
						}
						ufma.hideloading();
						// ufma.setBarPos($(window));
					});
				}

			},

			//选用页面初始化
			getExpFuncChoose: function() {
				// var url = "/ma/sys/common/select";
				ufma.showloading('正在请求数据，请耐心等待...');
				var callback = function(result) {
					var id = "expfunc-choose-datatable";
					var toolBar = $('#' + id).attr('tool-bar');
					if(result.data.length > 0) {
						page.issueAgecyCode = result.data[0].agencyCode;
					}
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
								title: "部门经济分类编码",
								data: "code"
							},
							{
								title: "部门经济分类名称",
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
										return '<span style="color:#00A854">启用</span>';
									} else {
										return '<span style="color:#F04134">停用</span>';
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
				var argu = {
					rgCode: ma.rgCode,
					setYear: ma.setYear,
					agencyCode: page.agencyCode,
					acctCode: page.acctCode,
					eleCode: "EXPECO",
					bgttypeCode: ""
				};
				ufma.get(ma.commonApi.getCanIssueEleTree, argu, callback);
			},

			getCheckedRows: function() {
				/*var checkedArray = [];
				table = page.govExpecoTable;
				activeLine = table.rows('.selected');
				data = activeLine.data();
				for(var i = 0; i < data.length; i++)
					checkedArray.push(data[i].chrCode);
				return checkedArray;*/
				var checkedArray = [];
				$('#expfunc-data .checkboxes:checked').each(function() {
					checkedArray.push($(this).attr('data-code'));
				});
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

			},
			//批量删除、停用、启用
			delRow: function(action, idArray, $tr, data) {
				var options = this.getInterface(action);
				pageNum = $('#expfunc-data_paginate').find('span a.paginate_button.current').text();
				pageLen = parseInt($('#expfunc-data_length').find('select').val());
				var argu = {
					chrCodes: idArray,
					"agencyCode": page.agencyCode,
					"acctCode": page.acctCode,
					"tableName": 'MA_ELE_EXPECO',
					"eleCode": "EXPECO",
					"action": action,
					"rgCode": ma.rgCode,
					"setYear": ma.setYear
				};
				var callback = function(result) {
					if(action == 'del') {
						if($tr) $tr.remove();
						if(result.flag == 'success') {
							ufma.hideloading();
							ufma.showTip('删除成功！', function() {}, 'success'); //guohx 增加删除成功提示
						}
					} else if(action == 'active') {
						if(result.flag == 'success') {
							ufma.hideloading();
							ufma.showTip('启用成功', function() {}, 'success');
						}
					} else if(action == 'unactive') {
						if(result.flag == 'success') {
							ufma.hideloading();
							ufma.showTip('停用成功！', function() {}, 'success');
						}
					} else {
						if($tr) {
							$tr.find('.btn[action="active"]').attr('disabled', action == "active");
							$tr.find('.btn[action="unactive"]').attr('disabled', action == "unactive");
						}
					}
					page.getCommonData();
					page.cancelCheckAll();
				}
				if(action == 'del') {
					ufma.confirm('您确定要删除选中的部门预算经济分类吗？', function(action) {
						if(action) {
							ufma.showloading('数据删除中，请耐心等待...');
							delete argu.action;
							ufma.ajax(options.url, options.type, argu, callback);
						}
					}, {
						type: 'warning'
					});
				} else if(action == 'addlower') {
					$('#expFunc-chrName').removeAttr('disabled')
					$('#govInput').removeAttr('disabled')
					$('.btn-group label').removeClass('disabled')
					$('.u-msg-footer .btn').removeClass('hidden')
					$('#expFunc-chrCode').trigger('click');
					var newArgu = {}
					newArgu.chrCode = argu.chrCodes[0];
					newArgu.agencyCode = page.agencyCode;
					newArgu.acctCode = page.acctCode;
					newArgu.eleCode = "EXPECO";
					newArgu.tableName = 'MA_ELE_EXPECO';
					newArgu.rgCode = ma.rgCode;
					newArgu.setYear = ma.setYear;
					if($('body').attr('data-code')) {
						$('#govBudgetLabel').addClass('none')
						$('#govBudget').removeClass('none')
						var url = "/ma/sys/common/getEleTree";
						var argu = {
							"agencyCode": page.agencyCode,
							"rgcode": ma.rgCode,
							"setYear": ma.setYear,
							"eleCode": 'GOVEXPECO'
						};
						ufma.get(url, argu, function(result) {
							$('#govBudget').ufTreecombox({
								valueField: 'id',
								textField: 'codeName',
								//leafRequire: true,
								name: 'name',
								readOnly: false,
								data: result.data,
								onComplete: function(sender) {
									if(!$.isNull(data.govexpecoCode)) {
										$('#govBudget').getObj().val(data.govexpecoCode);
									}
								}
							});
						})
					} else {
						for(var i = 0; i < data.eleExpecoGovexpecoList.length; i++) {
							if(data.eleExpecoGovexpecoList[i].govAgencyType == 1) {
								$('#govBudgetXZ').getObj().setValue(data.eleExpecoGovexpecoList[i].govexpecoId, data.eleExpecoGovexpecoList[i].govexpecoName)
							} else {
								$('#govBudgetSY').getObj().setValue(data.eleExpecoGovexpecoList[i].govexpecoId, data.eleExpecoGovexpecoList[i].govexpecoName)
							}
						}
						//                      $('#govBudgetXZ').getObj().setEnabled(false)
						//                      $('#govBudgetSY').getObj().setEnabled(false)
					}

					ufma.ajax(options.url, options.type, newArgu, function(result) {
						var data = result.data;
						ma.isRuled = true;
						$("#expFunc-chrCode").val(data)
						page.action = 'addlower';
						$('#expFunc-chrCode').trigger('click');
						page.openEdtWin();
						$('#expFunc-chrCode').trigger('click');
					});

				} else if(action == 'active') {
					ufma.confirm('您确定要启用选中的部门预算经济分类吗？', function(action) {
						if(action) {
							ufma.showloading('数据启用中，请耐心等待...');
							ufma.ajax(options.url, options.type, argu, callback);
						}
					}, {
						type: 'warning'
					});
				} else if(action == 'unactive') {
					ufma.confirm('您确定要停用选中的部门预算经济分类吗？', function(action) {
						if(action) {
							ufma.showloading('数据停用中，请耐心等待...');
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
				pageNum = $('#expfunc-data_paginate').find('span a.paginate_button.current').text();
				pageLen = parseInt($('#expfunc-data_length').find('select').val());
				var argu = {
					chrCodes: idArray,
					"agencyCode": page.agencyCode,
					"acctCode": page.acctCode,
					"tableName": 'MA_ELE_EXPECO',
					"eleCode": "EXPECO",
					"action": action,
					"rgCode": ma.rgCode,
					"setYear": ma.setYear
				};
				var callback = function(result) {
					if(action == 'del') {
						ufma.hideloading();
						if($tr) $tr.remove();
						if(result.flag == 'success') {
							ufma.showTip('删除成功！', function() {}, 'success'); //guohx 增加删除成功提示
						}
					} else if(action == 'active') {
						if(result.flag == 'success') {
							ufma.hideloading();
							ufma.showTip('启用成功', function() {}, 'success');
						}
					} else if(action == 'unactive') {
						if(result.flag == 'success') {
							ufma.hideloading();
							ufma.showTip('停用成功！', function() {}, 'success');
						}
					} else {
						if($tr) {
							$tr.find('.btn[action="active"]').attr('disabled', action == "active");
							$tr.find('.btn[action="unactive"]').attr('disabled', action == "unactive");
						}
					}
					page.getCommonData();
				}
				if(action == 'del') {
					delete argu.action;
					ufma.ajax(options.url, options.type, argu, callback);
				} else {
					ufma.ajax(options.url, options.type, argu, callback);
				}
			},
			openEdtWin: function(data) {
				if($('body').attr('data-code') && page.action == 'edit') {
					page.chrId = data.chrId;
				}
				if(page.action == 'edit' || page.action == 'addlower') {
					$('#expFunc-chrCode').attr('disabled', false)
					$("[name='chrId'],[name='lastVer'],[name='chrName']").val("");
					var thisCode = $("#expFunc-chrCode").val();
					if($("#expFunc-chrCode") != "" && thisCode != "") {
						var obj = {
							"chrCode": thisCode,
							"tableName": 'MA_ELE_EXPECO',
							"eleCode": page.tableParam.substring(7),
							"rgCode": ma.rgCode,
							"setYear": ma.setYear,
							"agencyCode": page.agencyCode
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

					$('#prompt').text('编码规则：' + ma.fjfa)

				}
				var callback = function(result) {
					var cRule = result.data.codeRule;
					if(cRule != null && cRule != "") {
						page.fjfa = cRule;
						$('.table-sub-info').text(result.data.agencyCtrlName);
					}
				};
				var argu = {
					eleCode: 'EXPECO',
					agencyCode: page.agencyCode,
					rgCode: ma.rgCode,
					setYear: ma.setYear
				}
				//				var url = '/ma/sys/element/getElementCodeRule?tableName=MA_ELE_CASHFLOW';
				var url = '/ma/sys/element/getEleDetail';
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
				if($('body').attr('data-code')) {
					page.editor = ufma.showModal('expfunc-edt', 800, 350);
				} else {
					page.editor = ufma.showModal('expfunc-edt', 800, 460);
				}

				page.formdata = data;
				if(page.action == 'add') {
					ufma.get('/ma/sys/common/getEleTree?agencyCode=' + page.agencyCode + '&acctCode=' + page.acctCode + '&rgcode=' + ma.rgCode + '&setYear=' + ma.setYear + '&eleCode=GOVEXPECO', {}, function(result) {
						$('#govBudget').ufTreecombox({
							valueField: 'id',
							textField: 'codeName',
							//leafRequire: true,
							name: 'name',
							readOnly: false,
							data: result.data
						});
					})
					$("#expFunc-chrCode").attr('disabled', false)
					$("#expFunc-chrName").attr('disabled', false)
					$('.btn-group label').removeClass('disabled')
					$('.u-msg-footer .btn-permission').removeClass('hidden')
					$('#govBudgetXZ').removeClass('none');
					$('#govBudgetSY').removeClass('none');
					$('#govBudgetXZLabel').addClass('none');
					$('#govBudgetSYLabel').addClass('none');
					$('#govInput').addClass('none')
					$('#govBudget').removeClass('none')
					$('#govBudgetHide').addClass('w180');
					$('#govBudgetXZHide').addClass('w180');
					$('#govBudgetSYHide').addClass('w180');

				}
				//右侧的参考信息还原
				ma.defaultRightInfor("expfunc-help", "部门经济分类");

				//自动触发charCode的blur事件，为了展示右侧参考信息
				if(page.action != 'edit') {
					ma.isEdit = false
				} else {
					ma.isEdit = true
				}
				$('#expFunc-chrCode').trigger('blur');
				// CZSB-3056 【系统资料管理】【部门经济分类】打开菜单进入新增页面，输入3位编码和名称后，点击保存或保存并新增按钮，编码校验不通过 guohx 20200828
				//编码验证
				ma.codeValidator('expFunc-chrCode', page.getPageName(page.tableParam).title, page.baseUrl + 'common/findParentList?eleCode=EXPECO&acctCode=' + page.acctCode, page.agencyCode, page.acctCode, "expfunc-help");

			},
			openChooseWin: function() {
				page.choosePage = ufma.showModal('expfunc-choose', 1000, 500);
			},
			bsAndEdt: function(data) { //编辑
				page.action = 'edit';
				$('#expFunc-chrCode').val(data.chrCode)
				this.openEdtWin(data);
				if($('#govBudgetXZ').getObj() && $('#govBudgetXZ').getObj().val) {
					$('#govBudgetXZ').getObj().val("");
				}
				if($('#govBudgetSY').getObj() && $('#govBudgetSY').getObj().val) {
					$('#govBudgetSY').getObj().val("");
				}
				if($("#govBudget").getObj() && $("#govBudget").getObj().val) {
					$('#govBudget').getObj().val("");
				}
				$('#govBudgetLabel').removeClass('none');
				$('#govBudget').addClass('none');
				$("#expFunc-chrCode").attr('disabled', true);
				$("#expFunc-chrName").attr('disabled', true);
				$('#assCode').val(data.assCode);
				$('.btn-group label').addClass('disabled');
				$('.u-msg-footer .btn-permission').eq(0).addClass('hidden');
				$('.u-msg-footer .btn-permission').eq(1).addClass('hidden');

				$('#expFunc-chrName').val(data.chrName)
				$('#chrId').val(data.chrId);
				$('#lastVer').val(data.lastVer);
				//add guohx
				if(!$('body').data("code")) { //系统级
					$('.btn-group label').removeClass('disabled')
					if(data.enabled == 1) {
						$('#expfunc-edt .btn').eq(2).trigger('click')
					} else {
						$('#expfunc-edt .btn').eq(3).trigger('click')
					}
					if(data.allowAddsub == 1) {
						$('#expfunc-edt .btn').eq(0).trigger('click')
					} else {
						$('#expfunc-edt .btn').eq(1).trigger('click')
					}
					var argu = {
						rgCode: ma.rgCode,
						setYear: ma.setYear,
						chrCode: data.chrCode,
						agencyCode: page.agencyCode
					}
					var argu = {
						rgCode: ma.rgCode,
						setYear: ma.setYear,
						chrCode: data.chrCode,
						agencyCode: page.agencyCode
					}
					var _thisdata = data
					ufma.ajaxDef('/ma/sys/expeco/selectEleExpecoGovexpeco', 'post', argu, function(data) {
						_thisdata.eleExpecoGovexpecoList = data.data
					})
					for(var i = 0; i < data.eleExpecoGovexpecoList.length; i++) {
						if(data.eleExpecoGovexpecoList[i].govAgencyType == '1') {
							$('#govBudgetXZ').removeClass('none');
							$('#govBudgetXZ').getObj().val(data.eleExpecoGovexpecoList[i].govexpecoCode)
							$('#govBudgetXZHide').removeClass('w180');
							if(!data.eleExpecoGovexpecoList[i].govexpecoName) {
								data.eleExpecoGovexpecoList[i].govexpecoName = "";
							}
							$('#govBudgetXZLabel').addClass('none');

						} else if(data.eleExpecoGovexpecoList[i].govAgencyType == '2') {
							$('#govBudgetSY').removeClass('none');
							$('#govBudgetSYHide').removeClass('w180');
							$('#govBudgetSY').getObj().val(data.eleExpecoGovexpecoList[i].govexpecoCode)
							if(!data.eleExpecoGovexpecoList[i].govexpecoName) {
								data.eleExpecoGovexpecoList[i].govexpecoName = "";
							}
							$('#govBudgetSYLabel').addClass('none');
						}
					}
				} else { //单位级
					var argu = {
						rgCode: ma.rgCode,
						setYear: ma.setYear,
						chrCode: data.chrCode,
						agencyCode: page.agencyCode
					}
					var _thisdata = data
					ufma.ajaxDef('/ma/sys/expeco/selectEleExpecoGovexpeco', 'post', argu, function(data) {
						_thisdata.eleExpecoGovexpecoList = data.data
					})
					if(!$.isNull(data.eleExpecoGovexpecoList)) {
						ufma.get('/ma/sys/common/getEleTree?agencyCode=*&rgcode=' + ma.rgCode + '&setYear=' + ma.setYear + '&eleCode=GOVEXPECO', {}, function(result) {
							$('#govBudget').ufTreecombox({
								valueField: 'id',
								textField: 'codeName',
								//leafRequire: true,
								name: 'name',
								readOnly: false,
								data: result.data
							});
							$('#govBudget').removeClass('none')
							for(var i = 0; i < data.eleExpecoGovexpecoList.length; i++) {
								$('#govBudget').getObj().val(data.eleExpecoGovexpecoList[i].govexpecoCode)
								$('#govBudget').removeClass('none')
							}
						})

					}

					if($('.btn-save').hasClass('hidden')) {
						$('#govInput').attr('disabled', 'disabled')
					} else {
						$('#govInput').attr('disabled', false)
					}

				}
				//                  $('#govBudgetXZ').getObj().setEnabled(false)
				//                  $('#govBudgetSY').getObj().setEnabled(false)
				if(page.action == 'edit') {
					if($('.btn-save').hasClass('hidden')) {
						$("#expFunc-chrCode").attr('disabled', true)
						$("#expFunc-chrName").attr('disabled', true)
						$('.btn-group label').addClass('disabled')

					} else {
						$("#expFunc-chrCode").attr('disabled', true)
						$("#expFunc-chrName").attr('disabled', true)
						$('.btn-group label').removeClass('disabled')
					}
				}
				// });

				page.setFormEnabled();

			},
			save: function(goon) {
				pageNum = $('#expfunc-data_paginate').find('span a.paginate_button.current').text();
				pageLen = parseInt($('#expfunc-data_length').find('select').val());
				if(page.action == 'add') {
					if(!ma.formValidator("expFunc-chrCode", "expFunc-chrName", page.getPageName(page.tableParam).title, "add")) {
						return false;
					}
				}
				ufma.showloading('数据保存中，请耐心等待...');
				var url = "/ma/sys/expeco/save";
				var argu = $('#form-expfunc').serializeObject();
				if($("#expFunc-chrCode").val().length == parseInt(ma.fjfa.substring(0, 1))) {
					argu["chrFullname"] = $("#expFunc-chrName").val();
				} else {
					argu["chrFullname"] = ma.nameTip + "/" + $("#expFunc-chrName").val();
				}

				argu["agencyCode"] = page.agencyCode;
				argu["acctCode"] = page.acctCode;
				argu["table"] = 'MA_ELE_EXPECO';
				if($('body').attr('data-code')) { //单位级
					if($('#govBudget').hasClass('uf-combox-combox')) {
						var eleExpecoGovexpecoList = [];
						var xzIems = $('#govBudget').getObj().getItem();
						if(!$.isNull(xzIems)) {
							var xzGovList = {};
							xzGovList.govexpecoCode = xzIems.code;
							xzGovList.govexpecoName = xzIems.codeName;
							xzGovList.govexpecoId = xzIems.id;
							xzGovList.expecoCode = $('#expFunc-chrCode').val();
							xzGovList.govAgencyType = page.agencyType;
							xzGovList.agencyCode = page.agencyCode
							xzGovList.rgCode = xzIems.RG_CODE
							xzGovList.setYear = xzIems.SET_YEAR
							eleExpecoGovexpecoList.push(xzGovList);
						}
						argu["eleExpecoGovexpecoList"] = eleExpecoGovexpecoList;
					}

				} else { //系统级
					var eleExpecoGovexpecoList = [];
					var xzIems = $('#govBudgetXZ').getObj().getItem();
					if(!$.isNull(xzIems)) {
						var xzGovList = {};
						xzGovList.govexpecoCode = xzIems.code;
						xzGovList.govexpecoName = xzIems.codeName;
						xzGovList.govexpecoId = xzIems.id;
						xzGovList.expecoCode = $('#expFunc-chrCode').val();
						xzGovList.govAgencyType = "1";
						xzGovList.agencyCode = xzIems.AGENCY_CODE
						xzGovList.rgCode = xzIems.RG_CODE
						xzGovList.setYear = xzIems.SET_YEAR
						eleExpecoGovexpecoList.push(xzGovList);
					}
					var syIems = $('#govBudgetSY').getObj().getItem();
					if(!$.isNull(syIems)) {
						var syGovList = {};
						syGovList.govexpecoCode = syIems.code;
						syGovList.govexpecoName = syIems.codeName;
						syGovList.govexpecoId = syIems.id;
						syGovList.expecoCode = $('#expFunc-chrCode').val();
						syGovList.govAgencyType = "2";
						syGovList.agencyCode = syIems.AGENCY_CODE
						syGovList.rgCode = syIems.RG_CODE
						syGovList.setYear = syIems.SET_YEAR
						eleExpecoGovexpecoList.push(syGovList);
					}
					argu["eleExpecoGovexpecoList"] = eleExpecoGovexpecoList;
				}

				argu.rgCode = ma.rgCode;
				argu.setYear = ma.setYear;

				var callback = function(result) {
					$("[name='chrId']").val('');
					$("[name='lastVer']").val('');
					$('#expFunc-chrCode').removeAttr('disabled');
					page.getCommonData();
					ma.nameTip = null;
					if(!goon) {
						ufma.hideloading();
						ufma.showTip(result.msg, function() {}, result.flag);
						$('#form-expfunc')[0].reset();
						page.clearGovBudget();
						page.editor.close();
					} else {
						ufma.hideloading();
						ufma.showTip('保存成功,您可以继续添加部门预算经济分类！', function() {}, result.flag);
						$('#form-expfunc')[0].reset();
						page.clearGovBudget();
						$("#expFunc-chrCode").removeAttr("disabled");
						page.formdata = $('#form-expfunc').serializeObject();

						ma.fillWithBrother($('#expFunc-chrCode'), {
							"chrCode": argu.chrCode,
							"eleCode": "EXPECO",
							"agencyCode": page.agencyCode
						});
					}
				}
				if(page.chrId != undefined && page.action == 'edit') {
					argu.chrId = page.chrId
				}
				ufma.post(url, argu, callback);
			},
			clearGovBudget: function() {
				if($("#govBudget").getObj() && $("#govBudget").getObj().clear) {
					$("#govBudget").getObj().clear();
				}
				if($("#govBudgetXZ").getObj() && $("#govBudgetXZ").getObj().clear) {
					$("#govBudgetXZ").getObj().clear();
				}
				if($("#govBudgetSY").getObj() && $("#govBudgetSY").getObj().clear) {
					$("#govBudgetSY").getObj().clear();
				}
			},
			setFormEnabled: function() {
				if(page.action == 'edit') {
					ma.isRuled = true;

					if($('body').data("code")) {
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
						$('#expFunc-chrName').removeAttr('disabled');
						$('#expfunc-edt label.btn').removeAttr('disabled');
						$("#expfunc-edt .btn-save-add,#expfunc-edt .btn-save").show().removeClass('hidden');
					}
					//平台维护不可修改
					if (isOperate == "1") {
						$("#form-expfunc").disable();
						$(".btn-saveadd").addClass("disabled");
						$(".btn-save").addClass("disabled");
					}
				} else if(page.action == 'add') {
					$('#expFunc-chrCode').removeAttr('disabled');
					$('#form-expfunc')[0].reset();

					$('#form-expfunc input[name="chrId"]').val('');
					$('#form-expfunc input[name="lastVer"]').val('');
				}
			},
			getCoaAccList: function() {
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
				data.colName = '部门经济分类';
				data.pageType = 'EXPECO';
				ufma.open({
					url: '../maCommon/issueTips.html',
					title: title,
					width: 1100,
					data: data,
					ondestory: function(data) {
						//窗口关闭时回传的值;
						if(isCallBack) {
							//page.getCoaAccList(pageNum, pageLen);
							page.getCommonData(); //CWYXM-10290--- 基础资料-部门经济分类，选用内容后，在页面无法搜索刚选用成功的内容，需退出页面再次进入才可搜索出刚选用的内容--zsj
						}
					}
				});
			},
			//取消全选
			cancelCheckAll: function () {
				$("#CheckAll,.check-all input").prop("checked", false);
			},
			onEventListener: function() {
				$(".ufma-shopping-trolley.right").on("click", function() {
					ufma.showloading("正在加载数据，请耐心等待...")
					var chrCodes = [];
					chrCodes = page.getCheckedRows();
					if(chrCodes.length > 0) {
						var argu = {
							"rgCode": ma.rgCode,
							"setYear": ma.setYear,
							'agencyCode': page.agencyCode,
							'chrCodes': chrCodes,
							'eleCode': 'EXPECO'
						}
						ufma.post("/ma/sys/common/countAgencyUse", argu, function(result) {
							var data = result.data;
							var columnsArr = [{
									data: "issuedCount",
									title: "编码",
									visible: false
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
							if(data != null && data != "null") {
								if(data.length > 0) {
									for(var i = 0; i < data.length; i++) {
										//                                      if (!data[i].hasOwnProperty("chrCode")) {
										//                                          console.info("第" + i + "条数据的chrCode(" + data[i].chrCode + ")字段不存在！");
										//                                          isRight = false;
										//                                          return false;
										//                                      }
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
					var t = true
					if($tr.hasClass("selected")) {
						$ele.parents("tbody").find("tr").each(function() {
							var thisCode = $(this).find('input[type="checkbox"]').data("code").toString();
							if(thisCode.substring(0, code.length) == code) {
								$(this).removeClass("selected");
								$(this).find('input[type="checkbox"]').prop("checked", false);
							}
							if($(this).find('input[type="checkbox"]').is(":checked") != true) {
								t = false
							}
						})
					} else {
						$ele.parents("tbody").find("tr").each(function() {
							var thisCode = $(this).find('input[type="checkbox"]').data("code").toString();
							if(thisCode.substring(0, code.length) == code) {
								$(this).addClass("selected");
								$(this).find('input[type="checkbox"]').prop("checked", true);
							}
							if($(this).find('input[type="checkbox"]').is(":checked") != true) {
								t = false
							}
						})
					}
					$(".datatable-group-checkable").attr('checked', t).prop('checked', t)
				});

				//选用页面表格行操作绑定
				$('#expfunc-choose-datatable').on('click', 'tbody td', function(e) {
					e.preventDefault();
					var $ele = $(e.target);
					var $tr = $ele.closest('tr');
					var $input = $ele.closest('tr').find('input[type="checkbox"]');
					var code = $input.val();
					var t = true
					if($tr.hasClass("selected")) {
						$ele.parents("tbody").find("tr").each(function() {
							var thisCode = $(this).find('input[type="checkbox"]').val();
							if(thisCode.substring(0, code.length) == code) {
								$(this).removeClass("selected");
								$(this).find('input[type="checkbox"]').prop("checked", false);
							}
							if($(this).find('input[type="checkbox"]').is(":checked") != true) {
								t = false
							}
						})
					} else {
						$ele.parents("tbody").find("tr").each(function() {
							var thisCode = $(this).find('input[type="checkbox"]').val();
							if(thisCode.substring(0, code.length) == code) {
								$(this).addClass("selected");
								$(this).find('input[type="checkbox"]').prop("checked", true);
							}
							if($(this).find('input[type="checkbox"]').is(":checked") != true) {
								t = false
							}
						})
					}
					$(".datatable-choose-checkall").attr('checked', t).prop('checked', t)
				});

				//ufma.searchHideShow($('#expfunc-data'));
				ma.searchHideShow('index-search', '#expfunc-data', 'searchHideBtn');
				ma.searchHideShow('choose-search', '#expfunc-choose-datatable', 'searchHideChooseBtn');
				this.get('.ufma-shopping-trolley').on('click', function(e) {
					page.getDW();
				});

				this.get('.btn-add').on('click', function(e) {
					e.preventDefault();
					if(page.chooseAcctFlag == true) {
						ufma.showTip('请选择账套', function() {}, 'warning');
						return false;
					} else {
						page.action = 'add';
						page.setFormEnabled();
						var data = $('#form-expfunc').serializeObject();
						page.openEdtWin(data);
						$('#prompt').text('编码规则：' + ma.fjfa);
					}

				});

				this.get('.btn-close').on('click', function() {
					var tmpFormData = $('#form-expfunc').serializeObject();
					if(page.agencyCtrlLevel == '0101' || page.agencyCtrlLevel == '0102') {
						ma.nameTip = null;
						if(!$.isNull($('#govBudgetXZ').getObj())) {
							$('#govBudgetXZ').getObj().clear();
							$('#govBudgetSY').getObj().clear();
						}
						page.editor.close();
					} else if(!ufma.jsonContained(page.formdata, tmpFormData) && $('.btn-save').prop('display') == 'block') {
						ufma.confirm('您修改了部门预算经济分类，关闭前是否保存？', function(action) {
							if(action) {
								page.save(false);
							} else {
								ma.nameTip = null;
								if($('#govBudgetXZ').length != 0) {
									$('#govBudgetXZ').getObj().clear();
									$('#govBudgetSY').getObj().clear();
								}
								page.editor.close();
							}
						}, {
							type: 'warning'
						});
					} else {
						ma.nameTip = null;
						if($('#govBudgetXZ').length != 0) {
							$('#govBudgetXZ').getObj().clear();
							$('#govBudgetSY').getObj().clear();
						}
						page.editor.close();
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
					if(page.chooseAcctFlag == true) {
						ufma.showTip('请选择账套', function() {}, 'warning');
						return false;
					} else {
						ufma.deferred(function() {
							page.getCommonData();
							page.cancelCheckAll();
						});
					}
				});

				this.get('.btn-del').on('click', function(e) {
					e.stopPropagation();
					if(page.chooseAcctFlag == true) {
						ufma.showTip('请选择账套', function() {}, 'warning');
						return false;
					} else {
						var checkedRow = page.getCheckedRows();
						if(checkedRow.length == 0) {
							ufma.alert('请选择部门预算经济分类!', "warning");
							return false;
						};
						page.delRow('del', checkedRow);
					}

				});
				this.get('.btn-active').on('click', function(e) {
					e.stopPropagation();
					if(page.chooseAcctFlag == true) {
						ufma.showTip('请选择账套', function() {}, 'warning');
						return false;
					} else {
						var checkedRow = page.getCheckedRows();
						if(checkedRow.length == 0) {
							ufma.alert('请选择部门预算经济分类!', "warning");
							return false;
						}
						page.delRow('active', checkedRow);
					}

				});
				this.get('.btn-unactive').on('click', function(e) {
					e.stopPropagation();
					if(page.chooseAcctFlag == true) {
						ufma.showTip('请选择账套', function() {}, 'warning');
						return false;
					} else {
						var checkedRow = page.getCheckedRows();
						if(checkedRow.length == 0) {
							ufma.alert('请选择部门预算经济分类!', 'warning');
							return false;
						}
						page.delRow('unactive', checkedRow);
					}
				});
				//增加下级
				$("body").on('click', '.btn-addlower', function(e) {
					var obj;
					for(var i = 0; i < page.data.length; i++) {
						if(page.data[i].chrId == $(this).attr('rowid')) {
							obj = $.extend(true, {}, page.data[i]);
						}
					}

					page.action = 'add'
					e.stopPropagation();
					var checkedRow = [];
					checkedRow.push($(this).parents("tr").find("input").data("code"));
					page.delRow('addlower', checkedRow, $(this), obj);
				});
				//下发
				$('#expFuncBtnDown').on('click', function(e) {
					e.stopPropagation();
					var gnflData = page.getCheckedRows();
					if(gnflData.length == 0) {
						ufma.alert('请选择部门预算经济分类！', 'warning');
						return false;
					}
					page.modal = ufma.selectBaseTree({
						url: '/ma/sys/common/selectIssueAgencyOrAcctTree?rgCode=' + ma.rgCode + '&setYear=' + ma.setYear + '&agencyCode=' + page.agencyCode + '&eleCode=EXPECO',
						rootName: '所有单位',
						title: '选择下发单位',
						bSearch: true, //是否有搜索框
						checkAll: true, //是否有全选
						filter: { //其它过滤条件
							'单位性质': { //标签
								ajax: '/ma/pub/enumerate/AGENCY_TYPE_CODE', //地址
								formControl: 'combox', //表单元素
								data: {
									rgCode: ma.rgCode,
									setYear: ma.setYear
								},
								idField: 'ENU_CODE',
								textField: 'ENU_NAME',
								filterField: 'agencyType',
							}
						},
						buttons: { //底部按钮组
							'确认下发': {
								class: 'btn-primary',
								action: function(data) {
									if(data.length == 0) {
										ufma.alert('请选择单位！', 'warning');
										return false;
									}
									acctAlldata = data;
									/*var dwCode = [];
                                    for (var i = 0; i < data.length; i++) {
                                        if (!data[i].isParent) {
                                            dwCode.push({
												"toAgencyCode": data[i].id
											});
                                        }
                                    }*/
									var isAcctTruedata = [];
									var isAcctFalsedata = [];
									var isAcctLeafdata = [];
									var dwCode = [];
									if(acctAlldata) {
										if(acctAlldata.length > 0) {
											for(var i = 0; i < acctAlldata.length; i++) {
												//if(acctAlldata[i].isAcct == true && acctAlldata[i].agencyCode != '' && acctAlldata[i].isLeaf == '1') {
												//单位账套：校验条件--isAcct = true && isFinal =1;传参：toAgencyCode：传选中的单位，toAcctCode:传选中的账套--zsj
												if(acctAlldata[i].isAcct == true && acctAlldata[i].isFinal == '1') {
													chooseAcct = acctAlldata[i].code;
													chooseAgency = acctAlldata[i].agencyCode;
													isAcctTruedata.push({
														"toAgencyCode": chooseAgency,
														"toAcctCode": chooseAcct
													});
												}
											}
											for(var i = 0; i < acctAlldata.length; i++) {
												//单位：校验条件--isAcct = false && isFinal =1；传参：toAgencyCode：传选中的单位，toAcctCode:"*"--zsj
												if(acctAlldata[i].isAcct == false && acctAlldata[i].isFinal == '1') {
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
									var url = '/ma/sys/expeco/issue';
									var argu = {
										'chrCodes': gnflData,
										'toAgencyAcctList': dwCode,
										"agencyCode": page.agencyCode,
										"rgCode": ma.rgCode,
										"setYear": ma.setYear,
										"eleCode": 'EXPECO'
									};
									//bug76584--zsj--经侯总确定加此类进度条
									ufma.showloading('数据下发中，请耐心等待...');
									var callback = function(result) {
										ufma.hideloading();
										//经海哥确认将所有信息显示在表格中--zsj
										//ufma.showTip(result.msg, function() {}, result.flag);
										page.modal.close();
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
					if(page.chooseAcctFlag == true) {
						ufma.showTip('请选择账套', function() {}, 'warning');
						return false;
					} else {
						/*
						 * page.getExpFuncChoose();
						 * page.openChooseWin();
						 */
						//由于原始将选用界面问题太多，且维护不便，故统一为公共界面--zsj
						ufma.open({
							url: '../maCommon/comChooseIssue.html',
							title: '选用',
							width: 1000,
							height: 500,
							data: {
								getUrl: '/ma/sys/common/getCanIssueEleTree',
								useUrl: "/ma/sys/common/issue",
								pageName: '部门经济分类',
								rgCode: ma.rgCode,
								setYear: ma.setYear,
								agencyCode: page.agencyCode,
								acctCode: page.acctCode,
								eleCode: 'EXPECO',
								bgttypeCode: ""
							},
							ondestory: function(result) {
								if(result.action) {
									page.issueTips(result, true);
								}
							}
						});
					}
				});
				//选用
				$('.btn-agyChoose').on('click', function(e) {
					var checkRow = page.getChooseCheckedRows();
					var toAgencyAcctList = [{
						toAgencyCode: page.agencyCode,
						toAcctCode: page.acctCode
					}];
					var argu = {
						chrCodes: checkRow,
						toAgencyAcctList: toAgencyAcctList, //选用的单位
						eleCode: "EXPECO",
						rgCode: ma.rgCode,
						setYear: ma.setYear,
						agencyCode: page.issueAgecyCode //上级单位代码，是从选用列表的数据中赋值得来的
					};
					//bugCWYXM-4856--选用时没有选择数据时不能直接发送请求--zsj
					if(checkRow.length == 0) {
						ufma.showTip('请选择要选用的数据', function() {
							return false;
						}, 'warning')
					} else {
						ufma.showloading('数据选用中，请耐心等待...');
						var callback = function(result) {
							if(result) {
								ufma.hideloading();
								//ufma.showTip("选用成功！", function() {
								page.choosePage.close();
								page.initPage();
								//}, "success");
								page.issueTips(result, true);
							}
						};
						ufma.post(ma.commonApi.confirmIssue, argu, callback);
					}

				});

				$('.btn-agyClose').on('click', function(e) {
					e.preventDefault();
					page.choosePage.close();
				});

				//编码失去焦点绑定事件 guohx
				$('#expFunc-chrCode').blur(function() {
					//$("input").css("background-color","#D6D6FF");
					if((!$('body').data("code"))) {
						var chrCode = $('#expFunc-chrCode').val();
						if($.isNull(chrCode)) {
							return false;
						} else {
							page.getGovexpecoByParent(chrCode);
						}

					} else {
						var chrCode = $('#expFunc-chrCode').val();
						page.getGovexpecoByParent(chrCode);
					}
					
				});
				$('#expFunc-chrName').blur(function() {
					//71560 --【农业部】辅助核算和会计科目目前不能设置“助记码”--当用户输入名称后，助记码应自动填充由名称首字母的大写字母组成的字符串--zsj
					var chrNameValue = $(this).val();
					ufma.post('/pub/util/String2Alpha', {
						"chinese": chrNameValue
					}, function(result) {
						if(result.data.length > 42) {
							var data = result.data.substring(0, 41);
							$('#assCode').val(data);
						} else {
							$('#assCode').val(result.data);
						}
					});
					//名称验证
					ma.nameValidator('expFunc-chrName', page.getPageName(page.tableParam).title);
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
				$("#expfunc-main").scroll(function () {
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
				$('#expfunc-choose .u-msg-title h4').text("选用部门经济分类");
				$('#expfunc-edt .u-msg-title h4').text("部门经济分类编辑");
				$('#form-expfunc .form-group .tab-paramcode').text("部门经济分类编码：");
				$('#form-expfunc .form-group .tab-paramname').text("部门经济分类名称：");
			},

			//初始化加载引用单位信息
			reqInitRightIssueAgy: function() {
				var argu = {
					"rgCode": ma.rgCode,
					"setYear": ma.setYear,
					'agencyCode': page.agencyCode,
					'chrCodes': [],
					'eleCode': 'EXPECO'
				}
				ufma.post("/ma/sys/common/countAgencyUse", argu, function(result) {
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
					if(data != null && data != "null") {
						if(data.length > 0) {
							for(var i = 0; i < data.length; i++) {
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
									ufma.alert("第" + i + "条数据的count(" + data[i].issuedCount + ")字段不存在！", "error");
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

			//获取部门预算经济分类父级对应的政府预算经济分类 guohx
			getGovexpecoByParent: function(chrCode) {
				ufma.get(page.baseUrl + 'common/findParentList', {
					"eleCode": 'GOVEXPECO',
					"rgCode": ma.rgCode,
					"setYear": ma.setYear,
					"agencyCode": ma.agencyCode,
					"acctCode": page.acctCode,
					"chrCode": chrCode
				}, function(result) {
					if(result.flag == "success" && (result.data.length != 0)) {
						var argu = {
							chrCode: data[0].chrCode,
							rgCode: ma.rgCode,
							setYear: ma.setYear,
							agencyCode: page.agencyCode
						};
						var url = "/ma/sys/expeco/getParentGovexpeco";
						var callback = function(result) {
							if(!$('body').data("code")) { //系统级 新增
								if(result.data == "") { //没有父级对应的政府预算
									page.getGovData();
								} else {
									page.buildComboxXZ(result.data.agencyType1);
									page.buildComboxSY(result.data.agencyType2);
								}
							} else { //单位级
								if(!$.isNull(result.data.agencyType1)) { //行政
									for(var i = 0; i < result.data.agencyType1.length; i++) {
										$('#govBudgetXZ-hide').html("");
										$('#govBudgetXZ-hide').addClass('hide');
										var $title = $('#govBudgetXZ-title');
										$('<label  class="control-label"  name="for-del">' + result.data.agencyType1[i].codeName + '</label>').appendTo($title);
									}
									$('#govBudget').ufTreecombox({
										valueField: 'id',
										textField: 'codeName',
										//leafRequire: true,
										name: 'name',
										readOnly: false,
										data: result.data.agencyType1
									});
								} else if(!$.isNull(result.data.agencyType2)) {
									for(var i = 0; i < result.data.agencyType2.length; i++) {
										$('#govBudgetSY-hide').html("");
										$('#govBudgetSY-hide').addClass('hide');
										var $title = $('#govBudgetSY-title');
										$('<label  class="control-label"  name="for-del">' + result.data.agencyType1[i].codeName + '</label>').appendTo($title);
									}
									$('#govBudget').ufTreecombox({
										valueField: 'id',
										textField: 'codeName',
										//leafRequire: true,
										name: 'name',
										readOnly: false,
										data: result.data.agencyType2
									});
								} else {
									$('#govBudgetXZ-hide').removeClass('hide');
									$('#govBudgetSY-hide').removeClass('hide');
									ufma.get('/ma/sys/common/getEleTree?agencyCode=*&rgcode=' + ma.rgCode + '&setYear=' + ma.setYear + '&eleCode=GOVEXPECO', {}, function(result) {
										$('#govBudget').ufTreecombox({
											valueField: 'id',
											textField: 'codeName',
											//leafRequire: true,
											name: 'name',
											readOnly: false,
											data: result.data
										});
									})
								}
							}

						}
						ufma.get(url, argu, callback);
					}
				})

			},
			getGovData: function() {
				var url = "/ma/sys/common/getEleTree";
				var argu = {
					"agencyCode": page.agencyCode,
					"rgcode": ma.rgCode,
					"setYear": ma.setYear,
					"eleCode": 'GOVEXPECO'
				};
				var callback = function(result) {
					page.buildComboxXZ(result.data);
					page.buildComboxSY(result.data);
				}
				ufma.get(url, argu, callback);
			},
			buildComboxXZ: function(XZData) {
				$('#govBudgetXZ').ufTreecombox({
					idField: 'id',
					textField: 'codeName',
					//leafRequire: true,
					name: 'name',
					readOnly: false,
					data: XZData,
					onchange: function(node) {

					}
					// onComplete: function (sender) {
					//     $('#govBudgetXZ').getObj().val('1');
					// }
				});
			},
			buildComboxSY: function(SYData) {
				page.accoOut = $('#govBudgetSY').ufTreecombox({
					valueField: 'id',
					textField: 'codeName',
					//leafRequire: true,
					name: 'name',
					readOnly: false,
					data: SYData,
					onchange: function(node) {}
					// onComplete: function (sender) {
					//     $('#govBudgetSY').getObj().val('1');
					// }
				});
			},
			initPage: function() {
				//初始化标题头
				$('.caption-subject').text("部门经济分类");
				this.initFormPage();
				this.getCommonData();
			},
			//获取要素的详细信息
			getEleDetail: function() {
				var argu = {
					eleCode: 'EXPECO',
					agencyCode: page.agencyCode,
					rgCode: ma.rgCode,
					setYear: ma.setYear
				};
				ma.initfifa('/ma/sys/element/getEleDetail', argu, callbackFun);

				function callbackFun(data, ctrlName) {
					//本级控制下发按钮显示/隐藏
					page.agencyCtrlLevel = data.agencyCtrllevel;
					var isAcctLevel = data.isAcctLevel;
					if(isAcctLevel == '1' && page.acctFlag == true) {
						$("#cbAcct").show();
						ufma.get('/ma/sys/eleCoacc/getAcctTree/' + page.agencyCode, {
							"setYear": page.setYear,
							"rgCode": page.rgCode
						}, function(result) {
							var acctData = result.data;
							if(acctData.length > 0) {
								page.chooseAcctFlag = false;
								/*page.cbAcct = $("#cbAcct").ufmaTreecombox2({
									data: acctData,
								});*/
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
								icon: 'icon-book',
								data: acctData,
								onchange: function(data) {
									page.acctCode = data.code;
									page.acctName = data.name;
									page.accsCode = data.accsCode;
									page.accsName = data.accsName;
									$("label.mt-checkbox").find('input[type="checkbox"]').prop("checked", false);
									page.baseUrl = '/ma/sys/';
									page.getCommonData();
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
										page.cbAcct.setValue(page.acctCode, page.acctName);
									} else if(acctData.length > 0) {
										page.cbAcct.select(1);
									} else {
										page.cbAcct.val('');
										page.accsCode = '';
										page.acctCode = '';
										page.chooseAcctFlag = true;
										page.initTable();
									}
								}
							});
						});
						//page.initAcctScc();
					} else {
						$("#cbAcct").hide();
						page.acctCode = '*';
						page.baseUrl = '/ma/sys/';
						page.getCommonData();
					}
					if($('body').data("code") && page.isLeaf != 0) {
						//单位为末级单位时不显示下发按钮
						$(".btn-senddown").hide();
					} else {
						//非末级单位需根据控制规则显示/隐藏按钮
						//guohx 20200217 与雪蕊确认，上下级公用显示下发按钮 不区分选用还是下发
						if(page.agencyCtrlLevel == "03") {
							//上下级无关下发按钮隐藏
							$(".btn-senddown").hide();
						} else {
							//上下级公用,下级细化可增加一级,下级细化不可增加一级下发显示
							$(".btn-senddown").show();
						}
					}
					//请求上级控制信息
					page.parentCtrlBtn(ctrlName);
					isOperate = data.isOperate;
					if (isOperate == "1") {
						$(".btn-delete").addClass("disabled");
						$(".btn-start").addClass("disabled");
						$(".btn-stop").addClass("disabled");
						$(".btn-senddown").addClass("disabled");
						$(".btn-add").addClass("disabled");
					}
				}
			},
			//根据上级信息控制界面新增、选用、增加下级按钮,显示/隐藏
			parentCtrlBtn: function(ctrlName) {
				//请求上级控制信息
				var argu2 = {
					agencyCode: page.agencyCode,
					eleCode: "EXPECO",
					rgCode: ma.rgCode,
					setYear: ma.setYear
				};
				ma.initfifaParent(argu2, function(data2) {
					page.agencyCtrlLevel2 = data2.agencyCtrllevel;
					var ctrlName2;
					if(page.agencyCtrlLevel2 == "0101") {
						//上下级公用下发,新增，选用，增加下级都隐藏（在表格的complete中做了控制）
						$(".btn-add").hide();
						//$(".btn-choose").hide();
						$(".btn-choose").show(); //经赵雪蕊确认能下发得单位级都能选用--zsj--CWYXM-6746
						ctrlName2 = data2.agencyCtrlName;
					} else if(page.agencyCtrlLevel2 == "0102") {
						//上下级公用选用，新增隐藏，选用显示，增加下级隐藏（在表格的complete中做了控制）
						$(".btn-choose").show();
						$(".btn-add").hide();
						ctrlName2 = data2.agencyCtrlName;
					} else if(page.agencyCtrlLevel2 == "0201") {
						//下级细化可增加一级，选用不强制，新增显示，增加下级显示（在表格的complete中做了控制）
						$(".btn-add").show();
						$(".btn-addlower").show();
						$(".btn-choose").show();
						ctrlName2 = data2.agencyCtrlName;
					} else if(page.agencyCtrlLevel2 == "0202") {
						//下级细化不可增加一级，新增显示，选用不强制，增加下级显示（在表格的complete中做了控制）
						$(".btn-add").show();
						$(".btn-addlower").hide();
						$(".btn-choose").show();
						ctrlName2 = data2.agencyCtrlName;
					} else if(page.agencyCtrlLevel2 == "03") {
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
			//初始化单位
			initAgency: function() {
				page.cbAgency = $("#cbAgency").ufmaTreecombox2({
					url: "/ma/sys/eleAgency/getAgencyTree?rgCode=" + ma.rgCode + '&setYear=' + ma.setYear,
					leafRequire: false,
					onchange: function(data) {
						page.isLeaf = data.isLeaf;
						if(data.isLeaf == '0') {
							//非末级单位不显示账套选择框
							$("#cbAcct").hide();
							page.acctFlag = false;
						} else {
							$("#cbAcct").show();
							page.acctFlag = true;
						}
						page.divKind = data.divKind
						page.agencyCode = data.code;
						page.agencyName = data.name;
						page.agencyType = data.agencyType
						//page.initPage();
						$("label.mt-checkbox").find('input[type="checkbox"]').prop("checked", false);
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
					initComplete: function(sender) {
						//bug76381--zsj--若从凭证录入界面跳入此界面则此界面的单位默认为凭证录入界面的单位
						if(prevAgencyCode != '') {
							page.cbAgency.val(prevAgencyCode);
						} else {
							if(page.agencyCode != "" && page.agencyName != "" && page.agencyCode != "*" && page.agencyName != "*") {
								page.cbAgency.val(page.agencyCode);
							} else {
								page.cbAgency.val(1);
							}
						}
					}
				});
			},
			//初始化账套
			initAcctScc: function() {
			},
			//此方法必须保留
			init: function() {
				page.reslist = ufma.getPermission();
				var pfData = ufma.getCommonData();
				page.agencyCode = pfData.svAgencyCode;
				page.agencyName = pfData.svAgencyName;
				page.acctCode = pfData.svAcctCode;
				page.acctName = pfData.svAcctName;
				page.rgCode = pfData.svRgCode;
				page.tableParam = 'MA_ELE_EXPECO';
				page.chooseAcctFlag = false;
				if(!$('body').data("code")) { //系统级
					$('#query-all').html('');
					var $dl = $('#query-all');
					var $dl0 = $('<div id="query-tj" class="form-body">').appendTo($dl);
					var $dl2 = $('<div>').addClass('form-row').appendTo($dl0);
					var $dl3 = $(' <div class="form-group label-group" style="float: left;">').appendTo($dl2);
					$('<div class="control-label">单位类型：</div>').appendTo($dl3);
					var $dl4 = $('<div class="control-element id="agencyType">').appendTo($dl3);
					$('<a name="divkind" value="1" class="label label-radio selected">行政</a>').appendTo($dl4);
					$('<a name="divkind" value="2" class="label label-radio ">事业</a>').appendTo($dl4);
					//$('</div>').appendTo($dl3);
					//$('</div>').appendTo($dl2);
					var $dl5 = $('<div class="form-group label-group" id="enabled"  style="float: left;margin-left:25px">').appendTo($dl2);
					$('<div class="control-label">启用状态：</div>').appendTo($dl5);
					var $dl6 = $('<div class="control-element">').appendTo($dl5);
					$('<a name="enabled" value="-1" class="label label-radio selected">全部</a>').appendTo($dl6);
					$('<a name="enabled" value="1" class="label label-radio ">启用</a>').appendTo($dl6);
					$('<a name="enabled" value="0" class="label label-radio">停用</a>').appendTo($dl6);
					//$('</div>').appendTo($dl5);
					//$('</div>').appendTo($dl2);
					//$('</div>').appendTo($dl);
					$('<div class="clearfix"></div>').appendTo($dl2);
				};
				page.initTable();
				//初始化title
				if($('body').data("code")) {
					$(document).attr("title", "部门经济分类（单位级）");
					page.initAgency();
					//page.baseUrl = '/ma/sys/';
				} else {
					$(document).attr("title", "部门经济分类");
					page.baseUrl = '/ma/sys/';
					page.agencyCode = "*";
					page.acctCode = '*';
					page.initPage();
					//购物车表格初始化
					this.reqInitRightIssueAgy();
					page.getGovData();
					page.getEleDetail();
				}
				setTimeout(function () {
					var centerHeight = $(window).height() - 162 - 30 - 8 - 40;
					$('#expfunc-main').css("height", centerHeight);
					$('#expfunc-main').css("width", $(".table-sub").width());
					$('#expfunc-main').css("overflow", "auto");
				}, 500)
				ufma.parse(page.namespace);
				this.onEventListener();

				//请求自定义属性
				//              reqFieldList(page.agencyCode, "EXPECO");
				// ufma.parseScroll();

			}

		}
	}();

	page.init();
});