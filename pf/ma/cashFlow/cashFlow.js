$(function () {
	var page = function () {
		var govcashFlowTable;
		var cashFlowTable;
		var agencyCode;
		var baseUrl;
		var fjfa;
		var aParentCode;
		var subTable;
		var cashTreedata;
		var acctAlldata;
		var pfdata;
		var allAccsCode, allAccsName;
		var pageNum = '';
		var pageLen = '';
		return {
			namespace: 'cashFlow',
			get: function (tag) {
				return $('#' + this.namespace + ' ' + tag);
			},

			aParentCode: [],
			jCodeName: {},
			aInputParentCode: [],
			inputParentName: '',
			isRuled: false,
			accsCode: '',
			getInterface: function (action) {
				var urls = {
					del: {
						type: 'delete',
						url: page.baseUrl + 'cashFlow/delete'
					},
					active: {
						type: 'put',
						url: page.baseUrl + 'cashFlow/able'
					},
					unactive: {
						type: 'put',
						url: page.baseUrl + 'cashFlow/able'
					}
				}

				return urls[action];
			},
			getErrMsg: function (errcode) {
				var error = {
					0: '现金流量编码不能为空',
					1: '现金流量名称不能为空',
					2: '现金流量编码不符合分级规则:',
					3: '上级编码不存在',
					4: '现金流量编码已存在',
					5: '只能输入0-9的数字',
					6: '请输入数字或者字母编码'
				}
				return error[errcode];
			},
			initTable: function (result) {
				var id = "expfunc-data";
				var toolBar = $('#' + id).attr('tool-bar');
				page.cashFlowTable = $('#expfunc-data');
				page.govcashFlowTable = page.cashFlowTable.DataTable({
					language: {
						"url": bootPath + "agla-trd/datatables/datatable.default.js"
					},
					data: result,
					"fixedHeader": {
						header: true
					},
					"bLengthChange": true, //去掉每页显示多少条数据
					"processing": true, //显示正在加载中
					"pagingType": "full_numbers", //分页样式
					"lengthChange": true, //是否允许用户自定义显示数量p
					"lengthMenu": [
						[20, 50, 100, 200, -1],
						[20, 50, 100, 200, "全部"]
					],

					"pageLength": ufma.dtPageLength('#' + id),
					"bInfo": true, //页脚信息
					"bSort": false, //排序功能
					"bAutoWidth": false, //表格自定义宽度，和swidth一起用
					"bProcessing": true,
					"bDestroy": true,
					"columns": [{
						title: '<label class="mt-checkbox mt-checkbox-single mt-checkbox-outline"> <input type="checkbox"' +
							'class="datatable-group-checkable"/>&nbsp;<span></span> </label>',
						data: "chrId"
					},
					{
						title: "现金流量编码",
						data: "chrCode",
						width : 300
					},
					{
						title: "现金流量名称",
						data: "chrName"
					},
					{
						title: "状态",
						data: "enabledName",
						width : 60
					},
					{
						title: "流向",
						data: "inoutTypeName",
						width : 60
					},
					{
						title: "操作",
						data: 'chrId',
						width : 100
					}
					],
					"columnDefs": [{
						"targets": [0],
						"serchable": false,
						"orderable": false,
						"className": "nowrap",
						"render": function (data, type, rowdata, meta) {
							return '<label class="mt-checkbox mt-checkbox-single mt-checkbox-outline"> <input type="checkbox" class="checkboxes" value="' + data + '" data-code="' + rowdata.chrCode + '"/>&nbsp; <span></span> </label>';
						}
					},
					{
						"targets": [1, 4],
						"className": "isprint"
					},
					{
						"targets": [2],
						"serchable": false,
						"orderable": false,
						"className": "nowrap isprint",
						"render": function (data, type, rowdata, meta) {
							var textIndent = '0';
							if (rowdata.levelNum) {
								textIndent = (parseInt(rowdata.levelNum) - 1) + 'em';
							}

							var alldata = JSON.stringify(rowdata);
							return '<a class="common-jump-link" style="display:block;text-indent:' + textIndent + '" href="javascript:;" title="' + data + '" data-href=\'' + alldata + '\'>' + data + '</a>';
						}
					},
					{
						"targets": [3],
						"className": "isprint",
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
							var chrCode = rowdata.chrCode;
							var agencyCode = rowdata.agencyCode;
							return '<a class="btn btn-icon-only btn-sm btn-permission cashFlow-single-start btn-start" data-toggle="tooltip" ' + active + ' action= "active" rowid="' + data + '" chrCode="' + chrCode + '" agencyCode="' + agencyCode + '" title="启用">' +
								'<span class="glyphicon icon-play"></span></a>' +
								'<a class="btn btn-icon-only btn-sm btn-permission cashFlow-single-stop btn-stop" data-toggle="tooltip" ' + unactive + ' action= "unactive" rowid="' + data + '" chrCode="' + chrCode + '" agencyCode="' + agencyCode + '" title="停用">' +
								'<span class="glyphicon glyphicon icon-ban"></span></a><a class="btn btn-icon-only btn-sm btn-permission cashFlow-single-delete btn-delete" data-toggle="tooltip" action= "del" rowid="' + data + '" chrCode="' + chrCode + '" agencyCode="' + agencyCode + '" title="删除">' +
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
						$("#printTableData").html("");
						$("#printTableData").append($(".printButtons"));
						$('#' + id + ' .btn[data-toggle="tooltip"]').tooltip();

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
							ufma.expXLSForDatatable($('#' + id), '现金流量');
						});
						//导出end							
						$('#printTableData.btn-group').css("position", "inherit");
						$('#printTableData div.dt-buttons').css("position", "inherit");
						$('#printTableData [data-toggle="tooltip"]').tooltip();
						page.reslist = ufma.getPermission();
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

						$(".datatable-group-checkable").prop("checked", false);
						$(".datatable-group-checkable").on('change', function () {
							var t = $(this).is(":checked");
							$('#' + id + ' .checkboxes').each(function () {
								t ? $(this).prop("checked", !0) : $(this).prop("checked", !1);
								t ? $(this).closest('tr').addClass('selected') : $(this).closest('tr').removeClass('selected');
							});
							$(".datatable-group-checkable").prop("checked", t);
						});
						// ufma.setBarPos($(window));
						// $('#expfunc-data').closest('.dataTables_wrapper').ufScrollBar({
						// 	hScrollbar: true,
						// 	mousewheel: false
						// });
						//固定表头
						$("#expfunc-data").tblcolResizable();
						//固定表头
						$("#expfunc-data").fixedTableHead($("#expfunc-main"));
					},
					"drawCallback": function (settings) {
						ufma.isShow(page.reslist);
						// ufma.setBarPos($(window));
						$('#' + id).find("td.dataTables_empty").text("")
							.append('<img src="' + bootPath + 'images/noData.png"/><br/><i>目前还没有你要查询的数据</i>');

						$('#' + id + ' .btn').on('click', function () {
							//page.delRow($(this).attr('action'), [$(this).attr('chrCode')], $(this).closest('tr'));
							page._self = $(this);

						});
						$('#' + id + ' .cashFlow-single-delete').ufTooltip({
							content: '您确定删除当前现金流量吗？',
							onYes: function () {
								ufma.showloading('数据删除中，请耐心等待...');
								page.delRowOne($(page._self).attr('action'), [$(page._self).attr('chrCode')], $(page._self).closest('tr'));
							},
							onNo: function () { }
						});
						$('#' + id + ' .cashFlow-single-start').ufTooltip({
							content: '您确定启用当前现金流量吗？',
							onYes: function () {
								ufma.showloading('数据启用中，请耐心等待...');
								page.delRowOne($(page._self).attr('action'), [$(page._self).attr('chrCode')], $(page._self).closest('tr'));
							},
							onNo: function () { }
						});
						$('#' + id + ' .cashFlow-single-stop').ufTooltip({
							content: '您确定停用当前现金流量吗？',
							onYes: function () {
								ufma.showloading('数据停用中，请耐心等待...');
								page.delRowOne($(page._self).attr('action'), [$(page._self).attr('chrCode')], $(page._self).closest('tr'));
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
			},
			getExpFunc: function () {
				page.aParentCode = [];
				var argu = $('#query-tj').serializeObject();
				ufma.showloading('正在请求数据，请耐心等待...');
				var callback = function (result) {
					page.initTable(result.data)
					ufma.hideloading();
				};
				if (page.acctCode == '*') {
					if ($("body").data("code")) {
						argu.accsCode = page.useAccsCode; //$('#eleAccs').getObj().getValue();
						//allAccsCode = //$('#eleAccs').getObj().getValue();
					} else {
						$('#query-tj').find('a[name="accsCode"]').each(function () {
							if ($(this).hasClass("selected")) { //解决账套的科目体系一直默认为主管单位下选择的科目体系--bug77843
								argu.accsCode = $(this).attr('value');
								page.useAccsCode = $(this).attr('value');
							}
						});
					}
				} else {
					argu.accsCode = page.accsCode;
					//page.accsCode = allAccsCode; //bug78588--zsj
				}
				var url = page.baseUrl + "cashFlow/select?enabled=" + argu.enabled + "&inoutType=" + argu.inoutType + "&agencyCode=" + page.agencyCode + '&accsCode=' + argu.accsCode;
				if (page.agencyCode != '*') {
					if (page.isLeaf != 1) {
						page.acctCode = "*"
					}
					url = page.baseUrl + "cashFlow/select?enabled=" + argu.enabled + "&inoutType=" + argu.inoutType + "&agencyCode=" + page.agencyCode + '&accsCode=' + argu.accsCode + '&acctCode=' + page.acctCode;
				}
				ufma.get(url, "", callback);
			},
			getDW: function () {
				var codes = page.getCheckedRows();
				var url1 = '/ma/sys/cashFlow/initRightIssueAgy?ajax=1&rgCode=87&setYear=2017'
				var url = page.baseUrl + "common/countAgencyUse";
				var argu = {
					chrCodes: codes,
					accsCode: $("#kmtx-tj").find("a.selected").attr("value"),
					agencyCode: page.agencyCode,
					eleCode: "CASHFLOW",
					rgCode: ma.rgCode,
					setYear: ma.setYear
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
						"pageLength": ufma.dtPageLength('#dw-used'),
						"bInfo": false, //页脚信息
						"bSort": false, //排序功能
						"bAutoWidth": false, //表格自定义宽度
						"bProcessing": true,
						"bDestroy": true,
						"columns": [{
							title: "单位",
							data: "agencyName",
							className: 'nowrap'

						},
						{
							title: "账套",
							data: "acctName",
							className: 'nowrap'

						},
						{
							title: "已用",
							data: "issuedCount",
							className: 'nowrap',
							width: 40,
						}
						],
						initComplete: function () {
							var w = $('#dw-used').width() + 40 + "px";
							$("#dw-shopp").animate({
								width: w
							});
							$("#dw-shopp .ufma-shopp-inner").animate({
								width: w
							});

						}
					});
					ufma.hideloading();
				}
				ufma.post(url, argu, callback);
			},
			getCheckedRows: function () {
				var checkedArray = [];
				table = page.govcashFlowTable;
				activeLine = table.rows('.selected');
				data = activeLine.data();
				for (var i = 0; i < data.length; i++)
					checkedArray.push(data[i].chrCode);
				return checkedArray;
			},
			getCheckedRowIds: function () {
				var checkedArray = [];
				$('#expfunc-data .checkboxes:checked').each(function () {
					checkedArray.push($(this).attr("data-code"));
				});
				return checkedArray;
			},
			//删除
			delRow: function (action, idArray, $tr) {
				pageNum = $('#expfunc-data_paginate').find('span a.paginate_button.current').text();
				pageLen = parseInt($('#expfunc-data_length').find('select').val());
				var options = this.getInterface(action);
				var argu = {
					chrCodes: idArray,
					action: action,
					agencyCode: page.agencyCode,
					acctCode: page.acctCode,
					accsCode: page.useAccsCode, //bug79039--zsj
					setYear: page.setYear,
					rgCode: page.rgCode
				};
				argu.agencyCode = page.agencyCode;
				var callback = function (result) {
					if (action == 'del') {
						ufma.hideloading();
						if ($tr)
							$tr.remove();
						if (result.flag == 'success') {
							ufma.showTip('删除成功！', function () { }, 'success'); //guohx 增加删除成功提示
						}
					} else if (action == 'active') {
						ufma.hideloading();
						if (result.flag == 'success') {
							ufma.showTip('启用成功', function () { }, 'success');
						}
					} else if (action == 'unactive') {
						ufma.hideloading();
						if (result.flag == 'success') {
							ufma.showTip('停用成功！', function () { }, 'success');
						}
					} else {
						if ($tr) {
							$tr.find('.btn[action="active"]').attr('disabled', action == "active");
							$tr.find('.btn[action="unactive"]').attr('disabled', action == "unactive");
						}
					}
					page.getExpFunc();
				}

				if (action == 'del' && !$tr) {
					ufma.confirm('您确定要删除选中的数据吗？', function (action) {
						if (action) {
							ufma.showloading('数据删除中，请耐心等待...');
							delete argu.action;
							ufma.ajax(options.url, options.type, argu, callback);
						}
					}, {
							type: 'warning'
						});
				} else {
					if (action == 'active' && !$tr) {
						ufma.confirm('您确定启用选中的数据吗？', function (e) {
							if (e) {
								ufma.showloading('数据启用中，请耐心等待...');
								ufma.ajax(options.url, options.type, argu, callback);
							}
						}, {
								type: 'warning'
							})
					} else if (action == 'unactive' && !$tr) {
						ufma.confirm('您确定停用选中的数据吗？', function (e) {
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
			delRowOne: function (action, idArray, $tr) {
				pageNum = $('#expfunc-data_paginate').find('span a.paginate_button.current').text();
				pageLen = parseInt($('#expfunc-data_length').find('select').val());
				var options = this.getInterface(action);
				var argu = {
					chrCodes: idArray,
					action: action,
					agencyCode: page.agencyCode,
					acctCode: page.acctCode,
					accsCode: page.useAccsCode, //bug79039--zsj
					setYear: page.setYear,
					rgCode: page.rgCode
				};
				argu.agencyCode = page.agencyCode;
				var callback = function (result) {
					if (action == 'del') {
						ufma.hideloading();
						if ($tr)
							$tr.remove();
						if (result.flag == 'success') {
							ufma.showTip('删除成功！', function () { }, 'success'); //guohx 增加删除成功提示
						}
					} else if (action == 'active') {
						ufma.hideloading();
						if (result.flag == 'success') {
							ufma.showTip('启用成功', function () { }, 'success');
						}
					} else if (action == 'unactive') {
						ufma.hideloading();
						if (result.flag == 'success') {
							ufma.showTip('停用成功！', function () { }, 'success');
						}
					} else {
						if ($tr) {
							$tr.find('.btn[action="active"]').attr('disabled', action == "active");
							$tr.find('.btn[action="unactive"]').attr('disabled', action == "unactive");
						}
					}
					page.getExpFunc();
				}

				if (action == 'del') {

					delete argu.action;
					ufma.ajax(options.url, options.type, argu, callback);

				} else {
					ufma.ajax(options.url, options.type, argu, callback);
				}

			},
			setBaseFormEdit: function (enabled) {
				if (enabled) {
					$('#btnAccSysBaseEdit').addClass('hide');
					$('#form-expfunc .control-element .control-label').addClass('hide');
					$('#form-expfunc .control-element .form-control').removeClass('hide');
					$('#form-expfunc .control-element .btn-group').removeClass("hide");
					var assCode = $('label[for="assCode"]').text();
					$('#assCode').val(assCode);
				} else {
					$('#btnAccSysBaseEdit').removeClass('hide');
					$('#form-expfunc .control-element .control-label').removeClass('hide');
					$('#form-expfunc .control-element .form-control').addClass('hide');
					$('#form-expfunc .control-element .btn-group').addClass("hide");

					//将input框上的数据赋值到label上
					$('label[for="chrCode"]').text($("#cashFlow-chrCode").val());
					$('label[for="chrName"]').text($("#chrName").val());
					$('label[for=assCode]').attr('title', $("#assCode").val());
					//将toggle上的值赋值到label上
					$('label[for="inoutType"]').text($('label[for="inoutType"]').parent().find('label.active').text());
					$('label[for="allowAddsub"]').text($('label[for="allowAddsub"]').parent().find('label.active').text());
					$('label[for="enabled"]').text($('label[for="enabled"]').parent().find('label.active').text());
				}
			},
			clearError: function () {
				$('#form-expfunc').find('.form-group').each(function () {
					$(this).removeClass('error');
					$(this).find(".input-help-block").remove();
				});
			},
			openEdtWin: function (editData, enabled) {
				ma.defaultRightInfor("cashFlow-help", "现金流量");
				page.clearError();
				$('#accSysKJYS tbody').html('');
				var callback = function (result) {
					var gRule = result.data.codeRule;
					page.fjfa = gRule;
					$('#prompt').text('编码规则：' + page.fjfa)
				};
				var argu = {
					agencyCode: page.agencyCode,
					eleCode: "CASHFLOW",
					setYear: page.setYear,
					rgCode: page.rgCode
				};
				ufma.ajax("/ma/sys/element/getEleDetail", "get", argu, callback);
				page.editor = ufma.showModal('expfunc-edt', 1050);
				page.formdata = editData;
				var subdata = editData.cashFlowAccoList;
				//if(subdata != null && subdata != undefined) {
				if (!$.isNull(subdata)) { //bug79504--zsj--不能为空、null、undefined
					$.each(subdata, function (idx, rowData) {
						rowData.index = idx + 1;
						page.initSubTable(rowData);
					})
				}
				this.setGsxxFormEdit(enabled);
				page.setBaseFormEdit(enabled);
				//bugCWYXM-4119--公共要素下助记码在新建时会自动带入,且不能删掉--zsj
				setTimeout(function () {
					$('#assCode').val(editData.assCode);
					//$('label[for="assCode"]').text(editData.assCode);
					$('label[for=assCode]').attr('title', editData.assCode);
				}, 200)
			},
			setFormEnabled: function () {
				if (page.action == 'edit') {
					// console.log('编辑')
					$("#expfunc-edt>.u-msg-title>h4").text("现金流量编辑")
					$('#cashFlow-chrCode').attr('disabled', 'disabled');
				} else if (page.action == 'add') {
					$('#cashFlow-chrCode').removeAttr('disabled');
					$('#form-expfunc')[0].reset();
					$('#chrId').val('');
					// console.log($("#expfunc-edt>.u-msg-title>h4"))
					$("#expfunc-edt>.u-msg-title>h4").text("现金流量新增")
				}
			},
			bsAndEdt: function (data) {
				page.action = 'edit';
				var editData;
				//修改bug79631--点击行修改时需要请求专门的接口为获取分配公式--zsj
				if (page.action == 'edit') {
					var chrCode = data.chrCode;
					ufma.get('/ma/sys/common/showEleCommonByCode/CASHFLOW' + '/' + page.agencyCode + '/' + page.acctCode + '/' + page.useAccsCode + '/' + chrCode, {}, function (result) {
						editData = result.data;
						if (!$.isNull(editData)) {
							ufma.deferred(function () {
								$('#form-expfunc').setForm(editData);
							});
							page.openEdtWin(editData, false);
							page.setFormEnabled();
						}
					});
				}

			},
			//获取要素的详细信息
			getEleDetail: function () {
				var argu = {
					eleCode: 'CASHFLOW',
					agencyCode: page.agencyCode,
					rgCode: ma.rgCode,
					setYear: page.setYear
				};
				ma.initfifa('/ma/sys/element/getEleDetail', argu, callbackFun);

				function callbackFun(data, ctrlName) {
					//本级控制下发按钮显示/隐藏
					page.agencyCtrlLevel = data.agencyCtrllevel;
					var isAcctLevel = data.isAcctLevel;
					var issueType = data.issueType; //逐级下发：2；一发到底：1；一发到底不显示账套、科目体系切换按钮--zsj
					if (issueType == '1') {
						$('#showCheckBox').hide();
					} else if (issueType == '2') {
						$('#showCheckBox').show();
					}
				}
			},
			save: function (goon) {
				pageNum = $('#expfunc-data_paginate').find('span a.paginate_button.current').text();
				pageLen = parseInt($('#expfunc-data_length').find('select').val());
				if (!this.formValidator()) {
					return false;
				}
				var url = page.baseUrl + 'cashFlow/save';
				var argu = $('#form-expfunc').serializeObject();
				var accsCode = $('#kmtx').find('li').attr('value');
				argu.acctCode = page.acctCode;
				argu.setYear = ma.setYear;
				argu.rgCode = ma.rgCode;
				argu.accsCode = page.useAccsCode;
				argu.saveType = "1";
				//财务云项目CWYXM-8379 ---修改保存并新增问题---zsj
				if (page.saveAdd == true) {
					argu.lastVer = parseInt($('#lastVer').attr('value')) + 1;
					argu.chrId = '';//CWYXM-8444--修改保存并新增的 数据没有查询出来的问题--zsj
				}
				var chrFullname = "";
				if (ma.nameCashFlowTip != null && ma.nameCashFlowTip != undefined) {
					chrFullname = ma.nameCashFlowTip + '/' + argu.chrName;
				} else {
					chrFullname = argu.chrName;
				}
				argu.chrFullname = chrFullname;
				argu.cashFlowAccoList = page.serializeGsxx();
				/*bug78009--zsj
				 * 1、分配公式处如果一条数据都没有，允许保存；
				 * 2、若分配公式处有数据，且该数据的科目不为空，则允许保存；否则，提示对应序号科目不允许为空，若想保存则可重新选择或者将科目为空的数据删除后再保存
				 **/
				for (var i = 0; i < argu.cashFlowAccoList.length; i++) {
					if (argu.cashFlowAccoList[i].accoCode == '') {
						ufma.showTip('序号' + (i + 1) + '  科目不允许为空且必须为合法科目，请重新选择!', function () { }, 'warning');
						return false;
					}
				}
				ufma.showloading('正在保存数据，请耐心等待...');
				var callback = function (result) {
					if (!goon) {
						ufma.hideloading();
						ufma.showTip(result.msg, function () {
							$('#form-expfunc')[0].reset();
							page.editor.close();
							page.getExpFunc();
							//财务云项目CWYXM-8379 ---修改保存并新增问题---zsj
							page.saveAdd = false;
						}, result.flag);
					} else {
						ufma.hideloading();
						ufma.showTip('保存成功,您可以继续添加现金流量！', function () {
							//财务云项目CWYXM-8379 ---修改保存并新增问题---zsj
							$('#form-expfunc')[0].reset();
							page.getExpFunc();
							$('#btnAccSysBaseEdit,#btnAccSysKJYSEdit').trigger('click');
							page.action = 'add';
							$('#assCode').val('');
							$('#addSonY,#startY,#inoutY').addClass('active');
							$('#addSonN,#startN,#inoutN').removeClass('active');
							$('#accSysKJYS tbody').html('');
							$('#cashFlow-chrCode').removeAttr('disabled');
							page.saveAdd = true;
						}, result.flag);
					}
				}
				argu.agencyCode = page.agencyCode;

				ufma.post(url, argu, callback);
			},
			formValidator: function () {
				var msgCode = '';
				if ($('#expFunc-chrCode').val() == '') {
					msgCode = '0';
					ufma.showInputHelp('expFunc-chrCode', '<span class="error">' + page.getErrMsg(msgCode) + '</span>');
					$('#expFunc-chrCode').closest('.form-group').addClass('error');
				} else if (page.action == 'add' && $.inArray($('#expFunc-chrCode').val(), page.aParentCode) > -1) {
					msgCode = '4';
					ufma.showInputHelp('expFunc-chrCode', '<span class="error">' + page.getErrMsg(msgCode) + '</span>');
					$('#expFunc-chrCode').closest('.form-group').addClass('error');
				} else if ($('#chrName').val() == '') {
					msgCode = '1';
					ufma.showInputHelp('chrName', '<span class="error">' + page.getErrMsg(msgCode) + '</span>');
					$('#chrName').closest('.form-group').addClass('error');
				} else if (page.action == 'add' && !page.isRuled) {
					msgCode = '2';
					ufma.showInputHelp('expFunc-chrCode', '<span class="error">' + page.getErrMsg(msgCode) + '</span>');
					$('#expFunc-chrCode').closest('.form-group').addClass('error');
				} else if (page.action == 'add' && !ufma.arrayContained(page.aParentCode, page.aInputParentCode)) {
					msgCode = '3';
					ufma.showInputHelp('expFunc-chrCode', '<span class="error">' + page.getErrMsg(msgCode) + '</span>');
					$('#expFunc-chrCode').closest('.form-group').addClass('error');
				}
				return msgCode == '';
			},
			showParentHelp: function (parentCodes) {
				//bug78052--zsj---修改增加下级的问题
				//请求参数增加科目体系代码--bug79545--zsj
				var url = '/ma/sys/common/findParentList?chrCode=' + parentCodes + '&agencyCode=' + page.agencyCode + '&acctCode=' + page.acctCode + '&accsCode=' + page.useAccsCode + '&eleCode=CASHFLOW' + '&rgCode=' + ma.rgCode + '&setYear=' + ma.setYear;
				var callback = function (result) {
					var htm = '';
					// if(result.data.length > 0) {
					// 	page.aParentCode = [];
					// 	page.aParentName = [];
					// }
					page.aParentCode = [];
					page.aParentName = [];
					$.each(result.data, function (idx, row) {
						if (idx == 0) {
							htm += ufma.htmFormat('<li style="padding-left:0px;"><%=CHR_CODE%> <%=CHR_NAME%></li>', {
								'CHR_CODE': row.code,
								'CHR_NAME': row.name
							});
						} else {
							htm += ufma.htmFormat('<li style="padding-left:16px;"><%=CHR_CODE%> <%=CHR_NAME%></li>', {
								'CHR_CODE': row.code,
								'CHR_NAME': row.name
							});
						}
						page.aParentCode.push(row.code);
						page.jCodeName[row.code] = row.name;
					});
					$('#cashFlow-help').html(htm);
					page.showErrors(parentCodes)
				};
				ufma.get(url, '', callback);
			},
			setParentMC: function () {
				var parentName = [];
				for (var i = 0; i < page.aInputParentCode.length; i++) {
					parentName.push(page.jCodeName[page.aInputParentCode[i]]);
				}
				page.inputParentName = parentName.join('/');
			},
			initKMTX: function (url) {
				var argu = {
					"agencyCode": page.agencyCode,
					"setYear": page.setYear,
					"rgCode": page.rgCode,
					"eleCode": "ACCS"
				}
				//bugCWYXM-4321--新增需求：账套和科目体系可切换使用--zsj
				var callback = function (result) {
					var data = result.data;
					if ($("body").data("code")) {
						$('#eleAccs').ufTreecombox({
							idField: 'code',
							textField: 'codeName',
							placeholder: '请选择科目体系',
							leafRequire: true,
							data: result.data,
							onChange: function (sender, data) {
								//ufma.deferred(function() {
								page.diffAgencyType = data.diffAgencyType;
								page.accaCount = data.accaCount;
								//page.accsCode = data.code;
								page.accsName = '';
								page.accsName = data.name;
								allAccsCode = data.code;
								page.useAccsCode = data.code;
								page.useAccsName = data.name;
								page.getExpFunc();
							},
							onComplete: function (sender) {
								var accsCode = $.getUrlParam('chrCode');
								accsCode = accsCode || result.data[0].code;
								$('#eleAccs').getObj().val(accsCode);
								page.useAccsCode = accsCode;
							}
						})

					} else {
						var htm = '';
						for (var i = 0; i < data.length; i++) {
							htm += '<a name="accsCode" value="' + data[i].code + '" class="label label-radio">' + data[i].codeName + '</a>';
						}
						$('#kmtx-tj').html(htm);
						$('#kmtx-tj a:first').addClass('selected');
						page.useAccsCode = $("#kmtx-tj").find("a.selected").attr("value");
						page.useAccsName = $("#kmtx-tj").find("a.selected").html();
						page.getExpFunc();
					}
				};
				ufma.get(url, argu, callback);

			},
			setIllegalGroupControl: function () {
				if ($('#accSysKJYS thead tr th.btnGroup').length == 0) {
					$('#accSysKJYS thead tr').append('<th class="nowrap btnGroup">操作</th>');
				}
				$('#accSysKJYS tbody tr').each(function () {
					var $tr = $(this);
					if ($tr.find('td.btnGroup').length == 0) {
						$tr.append('<td class="nowrap btnGroup">' +
							'<a class="btn btn-icon-only btn-sm btnDel" data-toggle="tooltip" title="删除">' +
							'<span class="glyphicon icon-trash"></span>' +
							'</a>' +
							'</td>');
						$tr.find('td.btnGroup .btn[data-toggle="tooltip"]').tooltip();
						$tr.find('td.btnGroup .btnDel').on('click', function (e) {
							e.stopPropagation();
							$tr.remove();
							//$tr.addClass('hide');//主干不存在isDelete的参数需求，所以当点击行删除操作时就代表删除改行，而不会根据是否有内容来判断隐藏或者删除
							page.adjIlacNo();
						});
						$tr.find('td.btnGroup .btnDrag').on('mousedown', function (e) {
							var callback = function () {
								page.adjIlacNo();
							};
							$('#accSysKJYS').tableSort(callback);
						});
					}
				});
			},
			adjIlacNo: function () {
				var idx = 0;
				$('#accSysKJYS tbody tr').each(function () {
					if (!$(this).hasClass('hide')) {
						idx = idx + 1;
						$(this).find('span.recno').html(idx);
					}
				});
			},

			setGsxxFormEdit: function (enabled) {
				if (enabled) {
					//新增、编辑页显示
					$('#btnAccSysKJYSEdit').addClass("hide");
					$('#accSysKJYS .control-element .form-combox').removeClass("hide");
					$('#accSysKJYS .control-element .form-control').removeClass("hide");
					$('#accSysKJYS .control-element .control-label').addClass("hide");
					$('#accSysAddKJYS').removeClass("hide");

					this.setIllegalGroupControl();
				} else {
					//详情页展示
					$('#btnAccSysKJYSEdit').removeClass("hide");
					$('#accSysKJYS .control-element .form-combox').addClass("hide");
					$('#accSysKJYS .control-element .form-control').addClass("hide");
					$('#accSysKJYS .control-element .control-label').removeClass("hide");
					$('#accSysAddKJYS').addClass("hide");
					//移除新增按钮和操作列
					$('#accSysKJYS thead tr th.btnGroup').remove();
					$('#accSysKJYS tbody tr td.btnGroup').remove();
				}
			},
			//初始化子表
			initSubTable: function (rowData) {
				var $table = $('#accSysKJYS');
				var recNo = $table.find('tr:not(.hide)').length;
				if (rowData) {
					recNo = rowData.index;
				}
				var row =
					'<tr>' +
					'<td class="text-center">' +
					'<input type="hidden" class="' + recNo + '_accoId" value="">' +
					'<span class="recno">' + recNo + '</span> ' +
					'</td>' +
					'<td>' +
					'<div class="control-element">' +
					'<div  class="ufma-combox form-combox ' + recNo + '_accoCode"></div>' +
					'<label for="accoCode" class="control-label hide"></label>' +
					'</div>' +
					'</td>' +
					'<td>' +
					'<div class="control-element">' +
					'<select class="form-control"  name="drCr">' +
					'<option value="1">流入</option>' +
					'<option value="-1">流出</option>' +
					'</select>' +
					'<label for="drCr" class="control-label hide"></label>' +
					'</div>' +
					'</td>' +
					'</tr>';
				var $row = $(row).appendTo($table);
				var callback = function (result) {
					$('.' + recNo + '_accoCode').each(function () {
						$(this).ufmaTreecombox({
							valueField: 'id',
							textField: 'codeName',
							readOnly: false,
							name: 'accoCode',
							data: result.data,
							onchange: function (node) {
								$('.' + recNo + '_accoId').val(node.chrId);
								$('.' + recNo + '_accoId ufma-combox-inputLi').val(node.codeName);
							}
						});
					});

					if (rowData) {
						var drCrName;
						if (rowData.drCr == 1) {
							drCrName = '流入';
						} else if (rowData.drCr == -1) {
							drCrName = '流出';
						}
						$row.find('label[for="drCr"]').html(drCrName);
						$row.find('label[for="accoCode"]').html(rowData.accoCodeName); //bugCWYXM-4315--科目显示编码+名称--zsj
						$row.find('.' + recNo + '_accoId').val(rowData.accoId);
						$row.find('select[name="drCr"]').val(rowData.drCr);
						$row.find('.' + recNo + '_accoCode').ufmaTreecombox().setValue(rowData.accoCode, rowData.accoCodeName); //bugCWYXM-4315--科目显示编码+名称--zsj
					} else {
						page.setIllegalGroupControl();
					}
				}
				ufma.get("/ma/sys/common/getEleTree", {
					"setYear": ma.setYear,
					"agencyCode": page.agencyCode,
					"rgCode": ma.rgCode,
					"acctCode": page.acctCode,
					"accsCode": page.useAccsCode, //bug78588--zsj
					"eleCode": 'ACCO',
					"isCashFlow": '1' //bug77343
				}, callback);

			},

			serializeGsxx: function () {
				var cashFlowSubData = [];
				$('#cashFlow-gsxx tbody tr').each(function (idx) {
					var tmpGsxx = {};

					tmpGsxx.accoId = $(this).find('.' + (idx + 1) + '_accoId').val();
					tmpGsxx.drCr = $(this).find('[name="drCr"]').children('option:selected').val();
					tmpGsxx.accoCode = $(this).find('[name="accoCode"]').val();
					tmpGsxx.acctCode = page.acctCode;
					tmpGsxx.agencyCode = page.agencyCode;
					tmpGsxx.accsCode = page.useAccsCode;
					cashFlowSubData.push(tmpGsxx);
				});
				return cashFlowSubData;
			},
			//请求科目体系并请求表格数据
			getEleTreeData: function () {
				var url = '/ma/sys/common/getEleTree';
				page.initKMTX(url);
			},
			//通过单位编码获取账套信息
			getAcctByUnitCode: function (code) {
				ufma.get('/ma/sys/eleCoacc/getAcctTree/' + code, {
					"setYear": page.setYear,
					"rgCode": page.rgCode
				}, function (result) {
					var acctData = result.data;
					if (!$.isNull(result.data)) {
						acctAlldata = result.data;
					} else {
						page.acctCode = '*';
						allAccsCode = $('#eleAccs').getObj().getValue(); //$("#kmtx-tj").find("a.selected").attr("value");
					}
					if (acctData.length == 0) {
						page.acctCode = '';
						page.acctName = '';
						page.accsCode = '';
						page.accsName = '';
						page.chooseAcctFlag = true;
					} else {
						page.chooseAcctFlag = false;
					}
					page.acctCombox = $("#cbAcct").ufmaTreecombox2({
						valueField: 'code',
						textField: 'codeName',
						placeholder: '请选择账套',
						icon: 'icon-book',
						data: acctData,
						onchange: function (result) {
							page.acctCode = result.code;
							page.acctName = result.name;
							page.useAccsName = result.accsName;
							page.accsCode = result.accsCode; //解决账套的科目体系一直默认为主管单位下选择的科目体系--bug77843
							page.useAccsCode = result.accsCode;
							//page.getEleTreeData();
							//缓存单位账套
							var params = {
								selAgecncyCode: page.agencyCode,
								selAgecncyName: page.agencyName,
								selAcctCode: page.acctCode,
								selAcctName: page.acctName
							}
							ufma.setSelectedVar(params);
							page.getExpFunc();
						},
						initComplete: function (sender) {
							var jumpAcctCode = page.getUrlParam("jumpAcctCode");
							if (!$.isNull(jumpAcctCode)) {
								page.acctCombox.setValue(jumpAcctCode, jumpAcctCode);
							} else {
								if (!$.isNull(page.acctCode) && !$.isNull(page.acctName) && page.acctCode != "*" && page.acctName != "*") {
									page.acctCombox.setValue(page.acctCode, page.acctName);
								} else if (!$.isNull(pfData.svAcctCode)) {
									page.acctCombox.setValue(pfData.svAcctCode, pfData.svAcctName);
									pfData.svAcctCode = '';
									pfData.svAcctName = '';
								} else if (page.chooseAcctFlag == false) {
									page.acctCombox.select(1);
								} else {
									page.acctCode = '';
									page.acctName = '';
									page.acctCombox.setValue(page.acctCode, page.acctName);
									//page.acctCombox.val('');
									var data = [];
									page.initTable(data);
									ufma.showTip('请选择账套', function () { }, 'warning');
									return false;
								}
							}
						}
					});
					/*if(acctData.length == 0) {
						page.acctCode = "*";
					}*/
				});
			},
			//初始化单位选项框
			initAgency: function () {
				var pfData = ufma.getCommonData();
				page.agencyCode = pfData.svAgencyCode;
				page.agencyName = pfData.svAgencyName;
				page.year = pfData.svSetYear;
				page.setYear = parseInt(pfData.svSetYear);
				page.rgCode = pfData.svRgCode;

				if ($("body").data("code")) {
					page.cbAgency = $("#agencyCode").ufmaTreecombox2({
						url: "/ma/sys/eleAgency/getAgencyTree?rgCode=" + ma.rgCode + '&setYear=' + ma.setYear,
						leafRequire: false,
						onchange: function (data) {
							page.agencyCode = data.code;
							page.agencyName = data.name;
							page.isLeaf = data.isLeaf;
							if (data.isLeaf != 1) {
								page.getEleTreeData();
							}
							if (data.isLeaf != 0) {
								page.getEleDetail();
								$("#cbAcct").show();
								//$('#showCheckBox').show();
								//$('.kmtx-tj,#kmtx-tj').hide();
								$('#dw-kmtx').hide();
								page.showFlag = true;
								//末级单位不显示下发按钮
								$(".btn-senddown").hide();
								page.getAcctByUnitCode(page.agencyCode);
								$("#cashflowChoose").show();
							} else {
								//非末级单位不显示账套选择框和选用科目按钮
								$("#cbAcct").hide();
								$('#showCheckBox').hide();
								page.acctCode = '*';
								page.showFlag = false;
								$(".btn-senddown").show();
								//$('.kmtx-tj,#kmtx-tj').show();
								$('#dw-kmtx').show();
								$("#cashflowChoose").hide();
								allAccsCode = $('#eleAccs').getObj().getValue();
							}
							page.initfifa();
							//缓存单位账套
							var params = {
								selAgecncyCode: page.agencyCode,
								selAgecncyName: page.agencyName,
							}
							ufma.setSelectedVar(params);

						},
						initComplete: function (sender) {
							if (page.agencyCode != "" && page.agencyName != "" && page.agencyCode != "*" && page.agencyName != "*") {
								page.cbAgency.val(page.agencyCode);
							} else {
								page.cbAgency.val(1);
							}

						}
					});
					//page.baseUrl = "/ma/agy/";
					//薛捷星说后台统一用一套接口。先统一用系统级的接口
					page.baseUrl = "/ma/sys/";
				} else {
					page.agencyCode = '*';
					page.acctCode = '*';
					page.baseUrl = "/ma/sys/";
					page.initKMTX('/ma/sys/common/getEleTree');
					$('.kmtx-tj,#kmtx-tj').show();
					allAccsCode = $("#kmtx-tj").find("a.selected").attr("value");
				}
			},
			initfifa: function () {
				page.fjfa = '3-2-2-2';
				var callback = function (result) {
					var cRule = result.data.codeRule;
					if (cRule != null && cRule != "") {
						page.fjfa = cRule;
						$('.table-sub-info').text("提示：" + result.data.agencyCtrlName);
					}
				};
				var argu = {
					eleCode: 'CASHFLOW',
					agencyCode: page.agencyCode,
					rgCode: ma.rgCode,
					setYear: ma.setYear
				}
				//				var url = '/ma/sys/element/getElementCodeRule?tableName=MA_ELE_CASHFLOW';
				var url = '/ma/sys/element/getEleDetail';
				ufma.get(url, argu, callback);
			},
			//初始化页面
			initPage: function () {
				//page.getSelUnitAcct();
				page.chooseAcctFlag = false;
				page.initAgency();
				var data = [];
				page.initTable(data);
				$('#eleAccs').ufTreecombox({
					idField: 'accountbookCode',
					textField: 'accountbookName',
					placeholder: '请选择科目体系',
					leafRequire: true,
					data: []
				})
				if (!$('body').data("code")) {
					page.initfifa();
				}
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
				argu1['accsCode'] = page.useAccsCode;
				if (page.isLeaf != 1) {
					argu1["acctCode"] = "";
				}
				ufma.get("/ma/sys/coaAcc/queryAccoTable", argu1, function (result) {
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
				data.colName = '现金流量';
				data.pageType = 'CASHFLOW';
				ufma.open({
					url: '../maCommon/issueTips.html',
					title: title,
					width: 1100,
					data: data,
					ondestory: function (data) {
						//窗口关闭时回传的值;
						if (isCallBack) {
							page.getCoaAccList();
						}
					}
				});
			},
			showErrors: function (value) {
				if (page.action != 'edit') {
					if (value == '') {
						ufma.showInputHelp('cashFlow-chrCode', '<span class="error">' + page.getErrMsg(0) + '</span>');
						$('#cashFlow-chrCode').closest('.form-group').addClass('error');
					} else if (!ufma.isNumOrChar(value)) {
						ufma.showInputHelp('cashFlow-chrCode', '<span class="error">' + page.getErrMsg(6) + '</span>');
						$('#cashFlow-chrCode').closest('.form-group').addClass('error');
						$('#cashFlow-chrCode').val('');
					} else if ($.inArray(value, page.aParentCode) != -1) {
						ufma.showInputHelp('cashFlow-chrCode', '<span class="error">' + page.getErrMsg(4) + '</span>');
						$('#cashFlow-chrCode').closest('.form-group').addClass('error');
					} else if (!page.isRuled) {
						ufma.showInputHelp('cashFlow-chrCode', '<span class="error">' + page.getErrMsg(2) + '' + page.fjfa + '</span>');
						$('#cashFlow-chrCode').closest('.form-group').addClass('error');
					} else if (!ufma.arrayContained(page.aParentCode, page.aInputParentCode)) {
						ufma.showInputHelp('cashFlow-chrCode', '<span class="error">' + page.getErrMsg(3) + '</span>');
						$('#cashFlow-chrCode').closest('.form-group').addClass('error');
					} else {
						ufma.hideInputHelp('cashFlow-chrCode');
						$('#cashFlow-chrCode').closest('.form-group').removeClass('error');
						var obj = {
							"chrCode": value,
							"tableName": 'MA_ELE_CASHFLOW',
							"eleCode": 'CASHFLOW',
							"rgCode": ma.rgCode,
							"setYear": ma.setYear,
							"agencyCode": page.agencyCode,
							"accsCode": page.useAccsCode
						}
						ma.nameCashFlowTip = "";
						ufma.ajaxDef("/ma/sys/common/getParentChrFullname", "post", obj, function (result) {
							ma.nameCashFlowTip = result.data;
						});
					}
					page.setParentMC();
				}
			},
			getUrlParam: function (name) {
				var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象 
				var r = window.location.search.substr(1).match(reg); //匹配目标参数 
				if (r != null)
					return unescape(r[2]);
				return null; //返回参数值 
			},
			onEventListener: function () {
				//选用--bug76325--zsj
				$('#cashflowChoose').on('click', function (e) {
					if (page.chooseAcctFlag == true) {
						ufma.showTip('请选择账套', function () { }, 'warning');
						return false;
					} else {
						var data = {
							accsCode: page.useAccsCode,
							eleCode: 'CASHFLOW',
							"acctCode": page.acctCode,
							"agencyCode": page.agencyCode,
							"setYear": page.setYear
						}
						var rgCode = $(this).attr('rgCode');
						var code = $(this).attr('code');
						var issueAgecyCode = $(this).attr('issueAgecyCode');
						ufma.open({
							url: bootPath + '/pub/baseTreeSelect/baseTreeSelect.html',
							title: '选择现金流量',
							width: 580,
							height: 545,
							data: {
								'flag': 'ACCSMA',
								'rootName': '现金流量',
								'checkbox': false,
								'leafRequire': true,
								'data': data,
								checkbox: true
							},
							ondestory: function (result) {
								if (result.action) {
									ufma.showloading('数据选用中，请耐心等待...');
									var tcode = [];
									for (var i = 0; i < result.data.length; i++) {
										tcode.push(result.data[i].code);
									}
									var tagencyCode = result.data[0].agencyCode;
									var toAgencyAcct = [{
										toAgencyCode: page.agencyCode,
										toAcctCode: page.acctCode
									}];
									var argu = {
										chrCodes: tcode,
										toAgencyAcctList: toAgencyAcct, //选用的单位
										rgCode: page.rgCode,
										eleCode: 'CASHFLOW',
										setYear: page.setYear,
										accsCode: page.useAccsCode,
										agencyCode: tagencyCode, //上级单位代码，是从选用列表的数据中赋值得来的
										acctCode: "*"
									};
									ufma.put('/ma/sys/cashFlow/issued', argu, function (rst) {
										ufma.hideloading();
										//ufma.showTip('选用成功', function() {}, 'success');
										page.issueTips(rst, true);
										//var chooseData = rst.data[0];
										page.getExpFunc();
									});
								};
							}
						});

					}
				});
				//表格行内操作
				$('#expfunc-data').on('click', '.btn', function () {
					page.delRow($(this).attr('action'), [$(this).attr('chrCode')], $(this).closest('tr'));
				});
				$('#showAcctOrAccs').on('click', function () {
					if (page.chooseAcctFlag == true) {
						ufma.showTip('请选择账套', function () { }, 'warning');
						return false;
					} else {
						//bug77311--zsj--当选择主管单位时，科目体系显示在单位的旁边--复选框 
						if (page.showFlag == true) {
							$("#cbAcct").hide();
							$("#dw-kmtx").show();
							$('#showText').html('显示账套');
							page.showFlag = false;
							$('#showAcctOrAccs').attr('checked', false);
							page.acctCode = '*'; //科目体系下账套传*，科目体系为选中的值
							page.getEleTreeData();
							page.useAccsCode = allAccsCode;
						} else if (page.showFlag == false) {
							page.getAcctByUnitCode(page.agencyCode);
							$("#cbAcct").show();
							$("#dw-kmtx").hide();
							$('#showText').html('显示科目体系');
							page.showFlag = true;
							page.useAccsCode = page.useAccsCode;
							$('#showAcctOrAccs').attr('checked', false);
						}
					}

				});

				$('#expfunc-data').on('click', 'tbody td:not(.btnGroup)', function (e) {
					e.preventDefault();
					var $ele = $(e.target);
					if ($ele.is('a')) {
						page.bsAndEdt($ele.data('href'));
						return false;
					}
					var $tr = $ele.closest('tr');
					var $input = $ele.closest('tr').find('input[type="checkbox"]');
					var code = '';
					//code = $input.data("code").toString();
					if (!$.isNull($input.data("code"))) {
						code = $input.data("code").toString();
					}
					//修改选择上级现金流量时勾选其他非下级现金流量的问题---zsj
					if (!$.isNull(code)) {
						if ($tr.hasClass('selected')) {
							$ele.parents("tbody").find("tr").each(function () {
								var thisCode = $(this).find('input[type="checkbox"]').data("code").toString();

								if (thisCode.substring(0, code.length) == code) {
									$(this).removeClass("selected");
									$(this).find('input[type="checkbox"]').prop("checked", false);
								}
							})
						} else {
							$ele.parents("tbody").find("tr").each(function () {
								var thisCode = $(this).find('input[type="checkbox"]').data("code").toString();

								if (thisCode.substring(0, code.length) == code) {
									$(this).addClass("selected");
									$(this).find('input[type="checkbox"]').prop("checked", true);
								}
							})
						}
					}

				});
				this.get('.ufma-shopping-trolley').on('click', function (e) {
					page.getDW();
				});
				ufma.searchHideShow($('#expfunc-data'));
				this.get('.btn-add').on('click', function (e) {
					e.preventDefault();
					if (page.chooseAcctFlag == true) {
						ufma.showTip('请选择账套', function () { }, 'warning');
						return false;
					} else {
						page.action = 'add';
						page.setFormEnabled();
						var data = $('#form-expfunc').serializeObject();
						if ($("body").data("code")) {
							$('#kmtx').find('li').text(page.useAccsName);
							$('#kmtx').find('li').attr('value', page.useAccsCode);
						} else {
							var $kmtx = $('#query-tj').find('a[name="accsCode"]').each(function () {
								if ($(this).hasClass("selected")) {
									$('#kmtx').find('li').text($(this).text())
									$('#kmtx').find('li').attr('value', $(this).attr('value'));
								}
							});
						}
						page.openEdtWin(data, true);
					}

				});
				this.get('.btn-close').on('click', function () {
					var tmpFormData = $('#form-expfunc').serializeObject();
					if (!ufma.jsonContained(page.formdata, tmpFormData) && $('.btn-save').prop('display') == 'block') {
						ufma.confirm('您修改了现金流量信息，关闭前是否保存？', function (action) {
							if (action) {
								if (ufma.hasNoError('#form-expfunc')) {
									page.save(false);
								}
							} else {
								page.editor.close();
							}
						}, {
								okText: '是',
								cancelText: '否'
							});
					} else {
						page.editor.close();
					}
				});
				//保存
				this.get('.btn-saveadd').on('click', function () {
					if (ufma.hasNoError('#form-expfunc')) {
						page.save(true);
					}
				});
				//保存分配公式
				this.get('#accSysBaseBtnGroup .btn-save').on('click', function () {

				});
				this.get('.btn-save').on('click', function () {
					if (ufma.hasNoError('#form-expfunc')) {
						page.save(false);
					}
				});
				$(document).on('click', '.label-radio', function (e) {
					e = e || window.event;
					e.stopPropagation();
					if (page.chooseAcctFlag == true) {
						ufma.showTip('请选择账套', function () { }, 'warning');
						return false;
					} else {
						ufma.deferred(function () {
							page.getExpFunc();
						});
					}

				});
				$('#btnAccSysBaseEdit').on('click', function () {
					page.setBaseFormEdit(true);
				});
				$('#accSysAddKJYS').on('click', function () {
					page.initSubTable();
				});
				$('#btnAccSysKJYSEdit').on('click', function () {
					page.setGsxxFormEdit(true);
				});
				//输入
				$('#cashFlow-chrCode').on('focus keydown paste keyup change', function (e) {
					e.stopepropagation;
					$('#cashFlow-chrCode').closest('.form-group').removeClass('error');
					$(this).val($(this).val().replace(/[^\d]/g, ''));
					var textValue = $(this).val();
					if (!ufma.keyPressInteger(e)) {
						ufma.showInputHelp('expFunc-chrCode', '<span class="error">' + page.getErrMsg(5) + '</span>');
					}
					var dmJson = ufma.splitDMByFA(page.fjfa, textValue);
					page.isRuled = dmJson.isRuled;
					page.aInputParentCode = dmJson.parentDM.split(',');
					page.aInputParentCode.pop();
					if ((page.aInputParentCode.length > 0)) {
						page.aInputParentCode = [page.aInputParentCode.pop()];
					} else {
						page.aInputParentCode = [];
					}
					/*if(textValue.length > 0) {
						page.showParentHelp(textValue);
					}*/
				}).on('blur', function () {
					//修改输入时不停请求/ma/sys/common/findParentList接口问题--性能优化--zsj
					if ($(this).val().length > 0) {
						page.showParentHelp($(this).val());
					}

				});
				$('#chrName').on('focus paste keyup', function (e) {
					e.stopepropagation;
					$('#chrName').closest('.form-group').removeClass('error');
					var textValue = $(this).val();
					textValue = page.inputParentName == "" ? textValue : page.inputParentName + '/' + textValue;
					//ufma.showInputHelp('chrName', textValue);
					ufma.showInputHelp_Name('chrName', textValue); //zsj--xss漏洞
				}).on('blur', function () {
					$(this).val($(this).val().replaceAll(/\s+/g, '')) //去除名称中的所有空格
					if ($(this).val() == '') {
						ufma.showInputHelp('chrName', '<span class="error">' + page.getErrMsg(1) + '</span>');
						$('#chrName').closest('.form-group').addClass('error');
					} else {
						ufma.hideInputHelp('chrName');
						$(this).val(ufma.transformQj($(this).val())); //特殊字符半角转全角
						$('#chrName').closest('.form-group').removeClass('error');
					}
					//71560 --【农业部】辅助核算和会计科目目前不能设置“助记码”--当用户输入名称后，助记码应自动填充由名称首字母的大写字母组成的字符串--zsj
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

				this.get('.btn-del').on('click', function (e) {
					e.stopPropagation();
					if (page.chooseAcctFlag == true) {
						ufma.showTip('请选择账套', function () { }, 'warning');
						return false;
					} else {
						var checkedRow = page.getCheckedRows();
						if (checkedRow.length == 0) {
							ufma.alert('请选择现金流量！');
							return false;
						};
						page.delRow('del', checkedRow);
					}
				});
				this.get('.btn-active').on('click', function (e) {
					e.stopPropagation();
					if (page.chooseAcctFlag == true) {
						ufma.showTip('请选择账套', function () { }, 'warning');
						return false;
					} else {
						var checkedRow = page.getCheckedRows();
						if (checkedRow.length == 0) {
							ufma.alert('请选择现金流量！');
							return false;
						};
						page.delRow('active', checkedRow);
					}
				});
				this.get('.btn-unactive').on('click', function (e) {
					e.stopPropagation();
					if (page.chooseAcctFlag == true) {
						ufma.showTip('请选择账套', function () { }, 'warning');
						return false;
					} else {
						var checkedRow = page.getCheckedRows();
						if (checkedRow.length == 0) {
							ufma.alert('请选择现金流量！');
							return false;
						};
						page.delRow('unactive', checkedRow);
					}

				});
				//下发
				$('#expFuncBtnDown').on('click', function (e) {
					e.stopPropagation();
					if (page.chooseAcctFlag == true) {
						ufma.showTip('请选择账套', function () { }, 'warning');
						return false;
					} else {
						var gnflData = page.getCheckedRowIds();
						if (gnflData.length == 0) {
							ufma.showTip('请选择现金流量！', function () { }, 'warning');
							return false;
						};
						var downAccsCode = $("#kmtx-tj").find("a.selected").attr("value");
						page.modal = ufma.selectBaseTree({
							url: '/ma/sys/common/selectIssueAgencyOrAcctTree?rgCode=' + ma.rgCode + '&setYear=' + ma.setYear + '&agencyCode=' + page.agencyCode + '&accsCode=' + downAccsCode + '&eleCode=CASHFLOW',
							rootName: '所有单位',
							title: '选择下发单位',
							bSearch: true, //是否有搜索框
							checkAll: true, //是否有全选
							buttons: { //底部按钮组
								'确认下发': {
									class: 'btn-primary',
									action: function (data) {
										if (data.length == 0) {
											ufma.alert('请选择单位账套！');
											return false;
										}
										var ids = gnflData;
										var acctAlldata;
										acctAlldata = data;
										var isAcctTruedata = [];
										var isAcctFalsedata = [];
										var dwCode = [];
										if (acctAlldata) {
											if (acctAlldata.length > 0) {
												for (var i = 0; i < acctAlldata.length; i++) {
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

										var url = '/ma/sys/cashFlow/issued';
										var argu = {
											'chrCodes': ids,
											'toAgencyAcctList': dwCode,
											"rgCode": ma.rgCode,
											"accsCode": page.useAccsCode, //bug79039--zsj
											"setYear": ma.setYear,
											"agencyCode": page.agencyCode
										};
										//bug76584--zsj--经侯总确定加此类进度条
										ufma.showloading('数据下发中，请耐心等待...');
										var callback = function (result) {
											ufma.hideloading();
											//经海哥确认将所有信息显示在表格中--zsj
											//ufma.showTip(result.msg, function() {}, result.flag);
											page.issueTips(result);
											page.modal.close();
										}
										ufma.put(url, argu, callback);
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
				});
			},
			//此方法必须保留
			init: function () {
				ufma.parse(page.namespace);
				pfdata = ptData = ufma.getCommonData();
				this.initPage();
				// 限制高度，避免出现最外层的y轴滚动条
				setTimeout(function () {
					if($('#expfunc-main.agy').length>0){
						var centerHeight = $(window).height() - 124 - 30 - 8 - 40;
					} else {
						var centerHeight = $(window).height() - 124 - 30 - 8 - 40-120;
					}
					// var centerHeight = $(window).height() - 124 - 30 - 8 - 40-120;
					$('#expfunc-main').css("height", centerHeight);
					$('#expfunc-main').css("width", $(".table-sub").width());
					$('#expfunc-main').css("overflow", "auto");
					
				}, 500)
				this.onEventListener();
				ufma.parse();
				//ufma.parseScroll();

			}
		}
	}();

	page.init();
});