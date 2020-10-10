$(function () {
	var sendObj = {};
	var balance;
	var agencyCode = '',
		agencyName = '',
		accBook = '',
		accbookCode = '',
		accbookName = '';
	var zwData;
	var dgColumns;
	var dgData;
	var isModifyLink;
	var linkGuidsArr = [];
	var needShowAcc;
	var queryItems = [];
	var items;
	var previewData;
	var generateID;
	var sessionAccbook = ufma.getSelectedVar();
	var flagId = 1;
	var rowTableData = {};
	var period = "jr";
	var tableData;
	var columnData;
	var fisPerdData = [{
		"code": "01",
		"codeName": "01"
	  }, {
		"code": "02",
		"codeName": "02"
	  }, {
		"code": "03",
		"codeName": "03"
	  }, {
		"code": "04",
		"codeName": "04"
	  }, {
		"code": "05",
		"codeName": "05"
	  }, {
		"code": "06",
		"codeName": "06"
	  }, {
		"code": "07",
		"codeName": "07"
	  }, {
		"code": "08",
		"codeName": "08"
	  }, {
		"code": "09",
		"codeName": "09"
	  }, {
		"code": "10",
		"codeName": "10"
	  }, {
		"code": "11",
		"codeName": "11"
	  }, {
		"code": "12",
		"codeName": "12"
	  }];
	var serachData = { // 修改为后端分页
		currentPage: 1,
		pageSize: 20,
	};
	var pageLength = ufma.dtPageLength('#gridGOV');
	var page = function () {
		var ptData = {};
		return {
			initSelect: function (id) {
				$(id).ufTreecombox({
					idField: 'accountbookCode',
					textField: 'accountbookName',
					readonly: false, //修改下拉框不支持删除选入内容问题--zsj--bug74261
					placeholder: '',
					leafRequire: true,
					data: []
				})
			},
			//获取单位下拉树
			initAgencyScc: function () {
				//ufma.showloading('正在加载数据，请耐心等待...');

				ufma.ajaxDef(dm.getCtrl('agency') + "?setYear=" + page.setYear + "&rgCode=" + ptData.svRgCode, "get", "", function (result) {
					page.cbAgency = $("#cbAgency").ufmaTreecombox2({
						data: result.data
					});
					var agyCode = $.inArrayJson(result.data, "id", ptData.svAgencyCode);
					if (agyCode != undefined) {
						page.cbAgency.val(ptData.svAgencyCode);
					} else {
						page.cbAgency.val(result.data[0].id);
					}
				});
			},
			//转换为驼峰
			shortLineToTF: function (str) {
				var arr = str.split("_");
				for (var i = 0; i < arr.length; i++) {
					arr[i] = arr[i].toLowerCase()
				}
				for (var i = 1; i < arr.length; i++) {
					arr[i] = arr[i].toLowerCase()
					arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].substring(1);
				}
				return arr.join("");
			},
			//初始化页面
			initPage: function () {
				page.reslist = ufma.getPermission();
				ufma.isShow(page.reslist);
				page.nowDate = ptData.svTransDate; //当前年月日
				page.setYear = ptData.svSetYear; //本年 年度
				page.month = ptData.svFiscalPeriod; //本期 月份
				page.today = ptData.svTransDate; //今日 年月日
				//page.reqBillType();
				//账簿初始化
				$("#AccBook").ufTreecombox({
					idField: 'ID', //可选
					textField: 'accountbookName', //可选
					readonly: false,
					pIdField: 'PID', //可选
					placeholder: '请选择账簿',
					icon: 'icon-book',
					theme: 'label',
					leafRequire: false,
					onChange: function (sender, data) {

						if ($("#AccBook_input").hasClass("uf-red")) {
							$("#btnDaliy").attr("disabled", true);
							$("#showMethodTip").attr("disabled", true);
							$("#delete").attr("disabled", true);
							$("#createVou").attr("disabled", true);
							$("#mergeCreateVou").attr("disabled", true);
							$("#cancleVou").attr("disabled", true);
							$("#btnGetData").attr("disabled", true);
						} else {
							$("#btnDaliy").attr("disabled", false);
							$("#showMethodTip").attr("disabled", false);
							$("#delete").attr("disabled", false);
							$("#createVou").attr("disabled", false);
							$("#mergeCreateVou").attr("disabled", false);
							$("#cancleVou").attr("disabled", false);
							$("#btnGetData").attr("disabled", false);
						}
						sendObj.accountbookGuid = data.ID;
						// sendObj.agencyCode = $('#cbAgency').getObj().getValue(); //data.agencyCode;
						sendObj.acctCode = data.ACCT_CODE;
						sendObj.accoCode = data.ACCO_CODE;
						sendObj.accountBookType = data.ACCOUNTBOOK_TYPE; //1 现金 2 银行 3 零余额
						sendObj.isLeaf = data.isLeaf;
						sendObj.isVouSign = data.IS_VOU_SIGN; //出纳签章
						sendObj.needShowAcc = data.NEED_SHOW_ACCITEM; //辅助核算项
						sendObj.isPreview = data.IS_PREVIEW; //生成前预览
						sendObj.isTicResource = data.IS_TICRESOURCE; //是否显示单据来源
						sendObj.isMutinum = data.IS_MUTINUM; //显示跨账簿单据编号
						sendObj.isCanEditByOthers = data.IS_CAN_EDIT_BY_OTHERS; //不允许修改他人登记的出纳账
						//80827 【财务云8.0 鄂尔多斯 】20190630所有页面，单位或账套选择变化后，再打开其它页面时，自动显示为最近一次选择的单位或账套。--zsj
						//缓存账簿
						accbookCode = data.ID;
						accbookName = data.accountbookName;
						var params = {
							selAgecncyCode: agencyCode,
							selAgecncyName: agencyName,
							selAccBookCode: accbookCode,
							selAccBookName: accbookName
						}
						ufma.setSelectedVar(params);
						if (!$.isNull(sendObj.needShowAcc)) {
							needShowAcc = (sendObj.needShowAcc).split(',');
						}
						//bug76282--zsj--如果选择是不需要生成凭证，则在登记出纳账时，生成凭证、汇总生成凭证两个功能按钮应隐藏。
						if (data.IS_CREATEVOUCHER == '0') {
							$('#createVou').addClass("hide");
							$('#mergeCreateVou').addClass("hide");
							$('#cancleVou').addClass("hide");
						} else {
							$('#createVou').removeClass("hide");
							$('#mergeCreateVou').removeClass("hide");
							$('#cancleVou').removeClass("hide");
						}
						if (data.IS_PICKDATA == '1') {
							$('#btnGetData').removeClass("hide");
						} else {
							$('#btnGetData').addClass("hide");
						}
						$("#AccBook").css("width", page.getWidth() + "px");
						var divLen = page.getWidth() - 80;
						$("#AccBook_input").css("width", divLen + "px");
						$("#AccBook_input").css("font-size", page.getLength(data.accountbookName.length, divLen) + "px");
						if (sendObj.isLeaf == "0") {
							// ufma.showTip('不支持的业务类型！', {}, function() {});
							return false;
						} else {
							//动态辅助核算项--begin
							var argu = {
								"acctCode": sendObj.acctCode,
								"accoCode": sendObj.accoCode,
								"agencyCode": agencyCode,
								"setYear": ptData.svSetYear,
								"rgCode": ptData.svRgCode
							}
							dm.getAccoFZ(argu, function (result) {
								var itemElecode = [];
								if (result.data != null) {
									items = result.data;
									page.items = items;
									if (sendObj.needShowAcc) {
										var needShowAcc = (sendObj.needShowAcc).split(',');
										for (var i = 0; i < needShowAcc.length; i++) {
											for (var j = 0; j < items.length; j++) {
												if (needShowAcc[i] == items[j].accitemCode) {
													itemElecode.push(items[j])
												}
											}
										}
									}
								}
								// var $curRow = $('#planItemMore');
								// $curRow.html('');
								var $curRowNew = $('#planItemMoreNew');
								$curRowNew.html('');
								columnData = itemElecode;
								for (var i = 0; i < itemElecode.length; i++) {
									var item = itemElecode[i];
									var itemEle = page.shortLineToTF(item.accitemCode) + 'Code'
									if (!$.isNull(itemEle)) {
										if (i % 3 == 0) {
											$curgroup = $('<div class="form-group" style="margin-left: 0px;margin-bottom :10px;"></div>').appendTo($curRowNew);
											$('<lable class="control-label auto" data-toggle= "tooltip" title="' + item.eleName + '" style="display:inline-block;width:70px;text-align: right;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">' + item.eleName + '：</lable>').appendTo($curgroup);
											var formCtrl = $('<div id="' + itemEle + '" name="' + itemEle + '" class="uf-treecombox" style=" width:190px;margin-left:5px;margin-top:-8px;"></div>').appendTo($curgroup);
										} else {
											$curgroup = $('<div class="form-group" style="margin-bottom :10px;"></div>').appendTo($curRowNew);
											$('<lable class="control-label auto" data-toggle= "tooltip" title="' + item.eleName + '" style="display:inline-block;width:70px;text-align: right;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">' + item.eleName + '：</lable>').appendTo($curgroup);
											var formCtrl = $('<div id="' + itemEle + '" name="' + itemEle + '" class="uf-treecombox" style=" width:190px;margin-left:5px;margin-top:-8px;"></div>').appendTo($curgroup);
										}
										var param = {};
										param['agencyCode'] = agencyCode;
										param['setYear'] = ptData.svSetYear;
										param['eleCode'] = item.eleCode;
										treecombox = $('#' + itemEle);
										page.cacheDataRun({
											element: treecombox,
											cacheId: param['agencyCode'] + param['eleCode'],
											url: dm.getCtrl('fzhxs'),
											param: param,
											eleName: item.eleName,
											callback: function (ele, data, tmpEleName) {
												$(ele).ufTreecombox({ //初始化
													data: data, //列表数据
													idField: 'code',
													textField: 'codeName',
													pIdField: 'pCode',
													readonly: false,
													placeholder: "请选择" + tmpEleName,
													onComplete: function (sender) { }
												});
											}
										});
										var sId = itemEle;
										$('#' + sId).off("keyup").on("keyup", function (e) {
											if (e.keyCode == 8) { //退格键，支持删除
												e.stopPropagation();
												var subId = $(e.target).attr("id").replace("_input_show", "");
												subId = subId.replace("_input", "");
												$('#' + subId + '_value').val('');
												$('#' + subId + '_input').val('');
												$('#' + subId + '_input_show').val('');
												$('#' + subId + '_text').val('');
											}
										});
									}
								}
							});
							//动态辅助核算项--end
						}
						// $('#queryAll').trigger('click');
						//凭证类型
						var argu = {
							rgCode: ptData.svRgCode
						};
						ufma.get('/cu/eleVouType/getVouType/' + agencyCode + '/' + page.setYear + '/' + sendObj.acctCode + '/*', {}, function (result) {
							var data = result.data;
							vouTypeArray = {};
							//循环把option填入select
							var $vouTypeOp = '<option value=""></option>';
							for (var i = 0; i < data.length; i++) {
								//创建凭证类型option节点
								vouTypeArray[data[i].code] = data[i].name;
								$vouTypeOp += '<option value="' + data[i].code + '">' + data[i].name + '</option>';
							}
							// $vouTypeOp = '<option value=""></option>' + $vouTypeOp;
							$('#vouType').html($vouTypeOp);
						});
						page.loadGrid();
						page.initGrid();
						page.getRememberData(page.setRememberData);
						//从报表跳转过来的 处理 guohx 
						if (page.getUrlParam("action") == "cashDayAccount") {
							page.dealJump();
						}
					},
					onComplete: function (sender) {
						if ($("#AccBook_input").hasClass("uf-red")) {
							$("#btnDaliy").attr("disabled", true);
						} else {
							$("#btnDaliy").attr("disabled", false);
						}
						//先走跳转过来的账套 guohx 20200317
						if (!$.isNull(page.getUrlParam("accountbookGuid"))) {
							$('#AccBook').getObj().val(page.getUrlParam("accountbookGuid"));
						} else if (sessionAccbook && !$.isNull(sessionAccbook.selAccBookCode) && (sessionAccbook.selAcctCode == sendObj.acctCode)) {
							$('#AccBook').getObj().val(sessionAccbook.selAccBookCode);
						} else {
							$('#AccBook').getObj().val(flagId);
						}
						// if (sessionAccbook && !$.isNull(sessionAccbook.selAccBookCode) && (sessionAccbook.selAcctCode == sendObj.acctCode)) {
						// 	// if (sessionAccbook && !$.isNull(sessionAccbook.selAccBookCode)) {
						// 	$('#AccBook').getObj().val(sessionAccbook.selAccBookCode);
						// } else {
						// 	$('#AccBook').getObj().val(flagId);
						// }
					}
				});
				$('#startJouDate').ufDatepicker({
					format: 'yyyy-mm-dd',
					initialDate: ptData.svTransDate
				});
				$('#endJouDate').ufDatepicker({
					format: 'yyyy-mm-dd',
					initialDate: ptData.svTransDate
				});
				$("#minMoney,#maxMoney").amtInputMinus();
				// 勾选借方/贷方/辅助核算合并任意一个时，摘要累加可以勾选，如果这三个选项都没有勾选，摘要累加取消勾选且不可用；
				if ($("#switchStyle").find("input[name='isMergerCr']").prop("checked") || $("#switchStyle").find("input[name='isMergerDr']").prop("checked") || $("#switchStyle").find("input[name='isMergerAcc']").prop("checked")) {
					if ($("#switchStyle").find("input[name='onlyDescpt']").prop("checked")) {
						$("#DescptAppend").find("input[name='isDescptAppend']").attr("disabled", true);
					} else {
						$("#DescptAppend").find("input[name='isDescptAppend']").attr("disabled", false);
					}
				} else {
					$("#DescptAppend").find("input[name='isDescptAppend']").removeAttr("checked");
					$("#DescptAppend").find("input[name='isDescptAppend']").attr("disabled", true);
				}
				page.getVouFisPerd();
			},
			getColumns: function () {
				rowTableData = {};
				var columns = [];
				columns = [{
					title: '<label class="mt-checkbox mt-checkbox-single mt-checkbox-outline"> <input type="checkbox"' + 'class="datatable-group-checkable" id="check-head"/>&nbsp;<span></span> </label>',
					width: 36,
					className: 'nowrap no-print text-center',
					render: function (data, type, rowdata, meta) {
						return "<label class='mt-checkbox mt-checkbox-single mt-checkbox-outline'> <input type='checkbox' class='check-all' index=" + meta.row + " value='0' /> &nbsp;<span></span> </label>";
					}
				},
				{
					title: "序号",
					width: 44,
					className: 'nowrap tc isprint',
					"render": function (data, type, rowdata, meta) {
						var index = meta.row + 1
						return "<span>" + index + "</span>";
					}
				},
				{
					title: "账簿名称",
					width: 180,
					data: "accountbookName",
					className: 'nowrap isprint'
				},
				{
					title: "账簿类别",
					width: 60,
					data: "accountbookTypeName",
					className: 'nowrap isprint'
				},
				{
					title: "登账日期",
					data: "jouDate",
					className: 'nowrap tc isprint',
					width: 100
				}
				];
				if (sendObj.isMutinum == "1") {
					columns.push({
						title: "跨账簿单据编号",
						width: 100,
						data: 'mainJouNo',
						className: 'nowrap tc isprint',
						width: 40
					});
				}
				columns.push({
					title: "编号",
					width: 80,
					data: 'jouNo',
					className: 'nowrap tc isprint',
					width: 44,
					"render": function (data, type, rowdata, meta) {
						var index = meta.row + 1;
						if ($.isNull(rowTableData[rowdata.jouGuid])) {
							rowTableData[rowdata.jouGuid] = rowdata;
						}
						return "<a class='viewData under-line common-jump-link' data-index='" + rowdata.jouGuid + "'>" + rowdata.jouNo + "</a>";
					}
				});
				columns.push({
					title: "摘要",
					width: 200,
					data: "summary",
					className: 'nowrap isprint',
					"render": function (data, type, rowdata, meta) {
						return "<span class='descptLong' title='" + rowdata.summary + "'>" + rowdata.summary + "</span>";
					}
				});
				if (!$.isNull(sendObj.needShowAcc) && !$.isNull(page.items)) {
					for (var i = 0; i < needShowAcc.length; i++) {
						for (var j = 0; j < page.items.length; j++) {
							if (needShowAcc[i] == page.items[j].accitemCode) {
								var item = page.items[j];
								var cbName = item.eleName;
								var cbItem = item.eleCode;
								var cbCode = item.accitemCode;
								if (!$.isNull(cbItem)) {
									columns.push({
										title: cbName,
										width: 150,
										data: page.shortLineToTF(cbCode) + 'CodeName', //转为accitemCodeCodeName
										className: 'nowrap',
										width: 240
									});
								}
							}
						}
					}
				}
				columns.push({
					title: "票据类型",
					width: 100,
					data: 'billtypeCodeName',
					className: 'nowrap tr isprint'
				});
				columns.push({
					title: "票据号",
					width: 60,
					data: 'billNo',
					className: 'nowrap tr isprint'
				});
				columns.push({
					title: "借方金额",
					width: 100,
					data: "drMoney",
					className: 'nowrap tr isprint tdNum',
					render: $.fn.dataTable.render.number(',', '.', 2, ''),
					render: function (data, type, rowdata, meta) {
						var val = $.formatMoney(data);
						return val == 0 ? '' : val;
					}
				});
				columns.push({
					title: "贷方金额",
					width: 100,
					data: 'crMoney',
					className: 'nowrap tr isprint tdNum',
					render: $.fn.dataTable.render.number(',', '.', 2, ''),
					render: function (data, type, rowdata, meta) {
						var val = $.formatMoney(data);
						return val == 0 ? '' : val;
					}
				});
				columns.push({
					title: "凭证字号",
					width: 100,
					data: 'vouTypeNameNo',
					className: 'nowrap tr isprint'
				});
				columns.push({
					title: "支出类型",
					width: 60,
					data: 'typeName',
					className: 'nowrap isprint'
				});
				columns.push({
					title: "经办人",
					width: 90,
					data: 'dealWith',
					className: 'nowrap isprint'
				});
				columns.push({
					title: "记录类型",
					width: 60,
					data: 'recordType',
					className: 'nowrap isprint',
					render: function (data, type, rowdata, meta) {
						var val = rowdata.recordType;
						return rowdata.recordType == '1' ? "日常" : "期初";
					}
				});
				columns.push({
					title: "录入人",
					width: 100,
					data: 'createUser',
					className: 'nowrap isprint'
				});
				columns.push({
					title: "资金类型",
					width: 60,
					data: 'cashTypeName',
					className: 'nowrap isprint'
				});
				columns.push({
					title: "对方单位",
					width: 120,
					data: 'oppositeUnit',
					className: 'nowrap  isprint',
					"render": function (data, type, rowdata, meta) {
						return "<span class='descptLong' title='" + rowdata.oppositeUnit + "'>" + rowdata.oppositeUnit + "</span>";
					}
				});
				columns.push({
					title: "备注",
					width: 90,
					data: 'remark',
					className: 'nowrap isprint',
					"render": function (data, type, rowdata, meta) {
						return "<span class='descptLong' title='" + rowdata.remark + "'>" + rowdata.remark + "</span>";
					}
				});
				columns.push({
					title: "是否回单",
					width: 50,
					data: 'isReceipt',
					className: 'nowrap tc isprint',
					render: function (data, type, rowdata, meta) {
						var val = rowdata.isReceipt;
						return val == '1' ? "是" : "否";
					}
				});
				if (sendObj.isTicResource == "1") {
					columns.push({
						title: "单据来源",
						data: 'linkModule',
						className: 'nowrap tc isprint',
						width: 50,
						render: function (data, type, rowdata, meta) {
							var val = rowdata.linkModule;
							if (val == 'GL') {
								return "账务取数";
							} else if (val == 'EXCEL') {
								return "导入";
							} else if (val == 'LP') { //bug78808--zsj--若单据为“从国库生成”的，则单据来源显示“国库生成”
								return "国库生成";
							} else {
								return "手工录入";
							}
						}
					});
				}

				return columns;
			},
			//初始化table
			initGrid: function (data) {
				dgColumns = page.getColumns();
				dgData = data;
				var columns = page.getColumns();
				oTable = $("#gridGOV").dataTable({
					"language": {
						"url": bootPath + "agla-trd/datatables/datatable.default.js"
					},
					"autoWidth": false,
					"bDestory": true,
					"processing": true, //显示正在加载中
					// "pagingType": "full_numbers", //分页样式
					// "lengthChange": true, //是否允许用户自定义显示数量p
					// "lengthMenu": [
					// 	[10, 20, 50, 100, 200, -1],
					// 	[10, 20, 50, 100, 200, "全部"]
					// ],
					"paging": false,
					// "pageLength": ufma.dtPageLength("#gridGOV"),
					"serverSide": false,
					"ordering": false,
					"columns": columns,
					//填充表格数据
					data: data,
					"dom": '<"datatable-toolbar"B>rt<"gridGOV-paginate"ilp>',
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
					initComplete: function (settings, json) {
						$('.datatable-toolbar').appendTo('#dtToolbar');
						var toolBar = $(this).attr('tool-bar')
						var $info = $(toolBar + ' .info');
						if ($info.length == 0) {
							$info = $('<div class="info"></div>').appendTo($(toolBar + ' .tool-bar-body'));
						}
						$info.html('');
						$('.gridGOV-paginate').appendTo($info);
						$('#gridGOV').closest('.dataTables_wrapper').ufScrollBar({
							hScrollbar: true,
							mousewheel: false
						});
						ufma.setBarPos($(window));
						$("#dtToolbar .buttons-print").css("border-radius", "4px 0 0 4px").addClass("btn-print btn-permission").attr({
							"data-toggle": "tooltip",
							"title": "打印"
						});
						$("#dtToolbar .buttons-excel").css("border-radius", "0 4px 4px 0").addClass("btn-export btn-permission").attr({
							"data-toggle": "tooltip",
							"title": "导出"
						});
						//导出begin
						$("#dtToolbar .buttons-excel").off().on('click', function (evt) {
							evt = evt || window.event;
							evt.preventDefault();
							if (isNeedAcct) {
								var topInfo = [
									['单位：' + agencyCode + ' ' + agencyName],
									['账套：' + acctName],
									['日期：' + $("#startJouDate").getObj().getValue() + '至' + $("#endJouDate").getObj().getValue()]
								]
							} else {
								var topInfo = [
									['单位：' + agencyCode + ' ' + agencyName],
									['日期：' + $("#startJouDate").getObj().getValue() + '至' + $("#endJouDate").getObj().getValue()]
								]
							}
							uf.expTable({
								title: $('#AccBook').getObj().getText(),
								exportTable: '#gridGOV',
								topInfo: topInfo,
								bottomInfo: [
									['账簿余额：'+$('#balance').text()],
									['当前余额：'+$('#currentBal').text()],
									['借：'+$('#drBal').text()],
									['贷：'+$('#crBal').text()]
								]
							});
						});
						//导出end
						$('.btn-print').removeAttr('href');
						$(".btn-print").off().on('click', function () {
							page.pdfData();
						})
						$('#dtToolbar [data-toggle="tooltip"]').tooltip();
						ufma.isShow(page.reslist);
						$("#gridGOV").fixedTableHead();
					},
					"drawCallback": function () {
						$('#gridGOV').find("td.dataTables_empty").text("")
							.append('<img src="' + bootPath + 'images/noData.png"/><br/><i>目前还没有你要查询的数据</i>');
						ufma.setBarPos($(window));
						$("#check-head").prop('checked', false)
						$("#all").prop('checked', false);
						//登记出纳账页面表头可以拉动宽度
						$('#gridGOV').tblcolResizable();
						ufma.isShow(page.reslist);
						// 修改为后端分页
						if(!$.isNull(page.tableData)){
							var paging = page.tableData.page;
							uf.backendPaging(paging,"cuAccBookin",serachData);
						}
					}
				});
			},
			//获取表格数据
			loadGrid: function () {
				var argu = $('#frmQuery').serializeObject();
				var arguMore = $('#queryMore').serializeObject();
				argu = $.extend(argu, arguMore);
				if (!$.isNull(sendObj.needShowAcc) && !$.isNull(page.items)) {
					for (var i = 0; i < needShowAcc.length; i++) {
						for (var j = 0; j < page.items.length; j++) {
							if (needShowAcc[i] == page.items[j].accitemCode) {
								var item = page.items[j];
								var cbName = item.eleName;
								var id = page.shortLineToTF(item.accitemCode) + 'Code';
								var accitemCode = item.accitemCode;
								var stringJson = '{"' + accitemCode + '": ""}';
								var json = JSON.parse(stringJson);
								if ($.isNull($('#' + id).getObj())) {
									json[accitemCode] = $('#' + id).getObj().getValue(); //chrCode;
								}
								if (!$.isNull(json)) {
									queryItems[i] = json
								}
							}
						}
					}
				} else {
					queryItems = [];
				}

				var vouType = $('#vouType option:selected').val();
				argu.vouType = vouType;
				argu = $.extend(argu, {
					agencyCode: agencyCode,
					acctCode: sendObj.acctCode,
					setYear: ptData.svSetYear,
					rgCode: ptData.svRgCode,
					accountbookGuid: sendObj.accountbookGuid,
					queryItems: queryItems
				});
				if (isNeedAcct) {
					argu.acctCode = acctCode;
				}
				// 修改为后端分页
				pageLength = ufma.dtPageLength('#gridGOV');
				argu.currentPage = parseInt(serachData.currentPage);
				argu.pageSize = parseInt(serachData.pageSize) ? parseInt(serachData.pageSize) : 99999999; // 没有值时查全部
				//查询后记录当前选择的行数信息到缓存
				localStorage.removeItem("cuAccBookinPageSize");
				localStorage.setItem("cuAccBookinPageSize", argu.pageSize);
				dm.loadGridData(argu, function (result) {
					page.tableData = result.data;
					$('#gridGOV_wrapper').ufScrollBar('destroy'); //动态销毁表格前要先销毁滚动条,否则滚动条无效
					$("#gridGOV").dataTable().fnDestroy();
					$("#gridGOV").html(''); //guohx 先清空动态加载列     此处代码后面必须重新初始化表头 直接addData不生效
					page.initGrid(result.data.page.list);
					$('#currentBal').text($.formatMoney(result.data.nowRestMoney));
					$('#drBal').text($.formatMoney(result.data.nowDrMoney));
					$('#crBal').text($.formatMoney(result.data.nowCrMoney));
					$('#balance').text($.formatMoney(result.data.acountBookRestMoney));

				});
			},
			cacheDataRun: function (setting) {
				setting.callback = setting.callback || function (data) { };
				setting.cached = setting.cached || false;
				var callback = setting.callback;
				var data;
				if (setting.cached) {
					if ($.isNull(setting.cacheId)) {
						callback();
						return false;
					}
					data = uf.getObjectCache(setting.cacheId);
				}
				if (!$.isNull(data)) {
					if (setting.hasOwnProperty('element')) {
						callback(setting.element, data, setting.eleName);
					} else {
						callback(data);
					}
				} else {
					setting.param = setting.param || {};
					if ($.isNull(setting.url)) return false;
					$.ufajax(setting.url, 'get', setting.param, function (result) {
						if (result.hasOwnProperty('data')) {
							uf.setObjectCache(setting.cacheId, result.data);
							if (setting.hasOwnProperty('element')) {
								callback(setting.element, result.data, setting.eleName);
							} else {
								callback(result.data);
							}

						} else {
							alert('错误的数据格式!');
						}
					});
				}
			},
			//返回本期时间
			dateBenQi: function (startId, endId) {
				var ddYear = page.setYear;
				var ddMonth = page.month - 1;
				var tdd = new Date(ddYear, ddMonth + 1, 0)
				var ddDay = tdd.getDate();
				$("#" + startId).getObj().setValue(new Date(ddYear, ddMonth, 1));
				$("#" + endId).getObj().setValue(new Date(ddYear, ddMonth, ddDay));
			},
			//返回本年时间
			dateBenNian: function (startId, endId) {
				var ddYear = page.setYear;
				$("#" + startId).getObj().setValue(new Date(ddYear, 0, 1));
				$("#" + endId).getObj().setValue(new Date(ddYear, 11, 31));
			},
			//返回今日时间
			dateToday: function (startId, endId) {
				var mydate = new Date(ptData.svTransDate);
				Year = mydate.getFullYear();
				Month = (mydate.getMonth() + 1);
				Month = Month < 10 ? ('0' + Month) : Month;
				Day = mydate.getDate();
				Day = Day < 10 ? ('0' + Day) : Day;
				$('#startJouDate').getObj().setValue(Year + '-' + Month + '-' + Day);
				$('#endJouDate').getObj().setValue(Year + '-' + Month + '-' + Day);
			},
			//打开凭证弹窗前，将数据中的vouGuid字段删除
			deleVouGuid: function (data) {
				if (data) {
					for (var i = 0; i < data.length; i++) {
						delete data[i].vouGuid;
					}
					return data;
				}
			},
			changeTitle: function (type) {
				if (type == "1") {
					$(".u-msg-dialog").find('h4').html('现金日记账')
				} else if (type == "2") {
					$(".u-msg-dialog").find('h4').html('银行存款日记账')
				} else {
					$(".u-msg-dialog").find('h4').html('零余额日记账')
				}
			},
			openWin: function (title, bookinType) {
				if (bookinType == "1") {
					ufma.open({
						url: 'cuAccBookinDaily.html',
						title: title,
						width: 710,
						data: {
							"agencyCode": agencyCode,
							"acctCode": sendObj.acctCode,
							"setYear": ptData.svSetYear,
							"rgCode": ptData.svRgCode,
							"accountbookGuid": sendObj.accountbookGuid,
							"bookinType": 1,
							"action": "add",
							"jouDate": ptData.svTransDate,
							"changeTitle": page.changeTitle,
							"fisPerdData" : fisPerdData
						},
						ondestory: function () {
							$('#queryAll').trigger('click');
						}
					})
				} else if (bookinType == "0") {
					ufma.open({
						url: 'cuAccBookinDaily.html',
						title: title,
						width: 710,
						data: {
							"agencyCode": agencyCode,
							"acctCode": sendObj.acctCode,
							"setYear": ptData.svSetYear,
							"rgCode": ptData.svRgCode,
							"accountbookGuid": sendObj.accountbookGuid,
							"bookinType": 0,
							"action": "add",
							//"jouDate": ptData.svTransDate,经侯总确认将 期初登账日期固定在每年的一月一日
							"type": 0,
							"changeTitle": page.changeTitle,
							"fisPerdData" : fisPerdData
						},
						ondestory: function () {
							$('#queryAll').trigger('click');
						}
					})
				}

			},
			//打开编辑界面窗口
			openEditWin: function (title, oneData, jouGuid) {
				var canEdit = 1;
				//已对账 已生成凭证 
				if ((oneData.isCheck == 1) || ((!$.isNull(oneData.linkVouGuid)) && oneData.linkModule != 'GL') || (sendObj.isCanEditByOthers == '1') && (oneData.createUser != ptData.svUserName)) {
					canEdit = 0;
				} else if (!$.isNull(oneData.linkGuid) || (oneData.linkModule == 'GL') || (oneData.linkModule == 'LP')) {
					//出纳从账务取数和国库生成允许修改摘要和经办人
					canEdit = 1;
				} else {
					canEdit = 2;
				}
				ufma.open({
					url: 'cuAccBookinDaily.html',
					title: title,
					width: 710,
					data: {
						"agencyCode": agencyCode,
						"acctCode": sendObj.acctCode,
						"setYear": ptData.svSetYear,
						"rgCode": ptData.svRgCode,
						"accountbookGuid": sendObj.accountbookGuid,
						"bookinType": oneData.recordType,
						"balance": balance,
						"oneData": oneData,
						"action": "edit",
						"jouDate": ptData.svTransDate,
						"changeTitle": page.changeTitle,
						"canEdit": canEdit,
						/* bug81248--出纳登记出纳账登账之后改日期凭证号会变--编辑修改保存时增加参数jouGuid--zsj*/
						"jouGuid": jouGuid,
						"fisPerdData" : fisPerdData
					},
					ondestory: function () {
						$('#queryAll').trigger('click');
					}
				})
			},
			//预览打开弹窗SummaryGenerate=="1"是汇总生成
			openPreviewWindow: function (previewData) {
				var urlPath = "";
				ufma.open({
					url: urlPath + '/pf/gl/vou/index.html?menuid=f24c3333-9799-439a-94c9-f0cdf120305d&action=preview&preview=1&dataFrom=vouBox',
					title: '凭证生成',
					width: 1300,
					data: page.deleVouGuid(previewData),
					ondestory: function (data) {
						var delDt = [];
						//窗口关闭时回传的值
						if (data.action && data.action.action == "save") {
							var argu = {
								"agencyCode": agencyCode,
								"acctCode": sendObj.acctCode,
								"setYear": ptData.svSetYear,
								"rgCode": ptData.svRgCode,
								"userId": ptData.svUserId,
								"userCode": ptData.svUserCode,
								"roleId": ptData.svRoleId,
								"roleCode": ptData.svRoleCode,
								"sysId": "CU",
								"vouHeadList": data.action.data,
								"isMain": false,

							}
							$("#gridGOV tbody tr").each(function (index, row) {
								var $chk = $(this).find("input[type='checkbox']");
								if ($chk.is(":checked") == true) {
									var jouGuid = $(this).find('.viewData').attr('data-index');
									delDt[delDt.length] = jouGuid;
								}
							});
							argu.jouGuids = delDt;
							if (generateID == 'mergeCreateVou') {
								argu.generate = "1"; //汇总生成
							} else if (generateID == 'createVou') {
								argu.generate = "0"; //单条生成
							}
							dm.prebulidVou(argu, function (result) {
								ufma.showTip(result.msg, function () {
									$('#queryAll').trigger('click');
								}, 'success');
							});
						}
					}
				});
			},
			//票据类型
			reqBillType: function () {
				var argu = {
					agencyCode: agencyCode,
					setYear: ptData.svSetYear,
					rgCode: ptData.svRgCode,
					eleCode: "BILLTYPE"
				};
				dm.cbbAccItem(argu, function (result) {
					$('#billTypeCode').ufTreecombox({
						idField: 'code',
						textField: 'codeName',
						pIdField: 'pCode', //可选
						//placeholder: '请选择票据类型',
						leafRequire: true,
						readonly: false,
						data: result.data,
						onComplete: function (sender) {

						}
					});
				});
			},
			//组织打印数据
			pdfData: function () {
				var isReceipt;
				if ($('input:radio[name="isReceipt"]:checked').val() == '1') {
					isReceipt = '是';
				} else if ($('input:radio[name="isReceipt"]:checked').val() == '0') {
					isReceipt = '否';
				} else {
					isReceipt = '全部';
				}
				var accitemObj = {};
				console.log(columnData);
				for (var i = 0; i < columnData.length; i++) {
					var accItemName = "accItemExt" + (i + 1);
					var extName = "ext" + (i + 1) + "Name";
					accitemObj[accItemName] = page.shortLineToTF(columnData[i].accitemCode) + "CodeName";
					accitemObj[extName] = columnData[i].eleName;
				}
				var accitemArr = [];
				accitemArr.push(accitemObj);
				var printsdataall = {
					'data': page.tableData.page.list,
					'startJouDate': $('#startJouDate').getObj().getValue(),
					'endJouDate': $('#endJouDate').getObj().getValue(),
					'isReceipt': isReceipt,
					'agencyCode': agencyCode,
					'agencyName': agencyName,
					'acountBookRestMoney': page.tableData.acountBookRestMoney,
					'nowCrMoney': page.tableData.nowCrMoney,
					'nowDrMoney': page.tableData.nowDrMoney,
					'nowRestMoney': page.tableData.nowRestMoney,
					'columnData': accitemArr
				}
				if (isNeedAcct) {
					printsdataall.acctCode = acctCode;
					printsdataall.acctName = '账套 ： ' + acctName;
				}
				ufma.post('/cu/print/getPrintDataForBase', printsdataall, function (result) {
					var now = [{}]
					now[0].CU_JOURNAL_DATA = result.data[0].CU_JOURNAL_DATA;
					now[0].CU_JOURNAL_HEAD = result.data[1].CU_JOURNAL_HEAD;
					now[0].CU_JOURNAL_COLUMN = result.data[2].CU_JOURNAL_COLUMN;
					var coster = JSON.stringify(now)
					page.getPdf('CU_ACC_BOOK', '*', coster)
				})
			},
			getPdf: function (reportCode, templId, groupDef) {
				var xhr = new XMLHttpRequest()
				var formData = new FormData()
				formData.append('reportCode', reportCode)
				formData.append('templId', templId)
				formData.append('groupDef', groupDef)
				xhr.open('POST', '/pqr/api/printpdfbydata', true)
				xhr.setRequestHeader('context-type', 'text/xml;charset=utf-8')
				xhr.responseType = 'blob'

				//保存文件
				xhr.onload = function (e) {
					if (xhr.status === 200) {
						if (xhr.status === 200) {
							var content = decodeURIComponent(xhr.getResponseHeader('Content-Disposition'))
							window.open(content, '_blank', 'titlebar=no,location=no,toolbar=no,menubar=no;top=100')
						}
					}
				}

				//状态改变时处理返回值
				xhr.onreadystatechange = function () {
					if (xhr.readyState === 4) {
						//通信成功时
						if (xhr.status === 200) {
							//交易成功时
							ufma.hideloading();
						} else {
							var content = decodeURIComponent(xhr.getResponseHeader('Content-Disposition'))
							//提示框，各系统自行选择插件
							alert(content)
							ufma.hideloading();
						}
					}
				}
				xhr.send(formData)
			},
			//获取系统选项-各界面需选择账套
			checkNeedAcct: function () {
				//ufma.get("/cu/sysRgpara/getBooleanByChrCode/CU002", {}, function(result) {
				ufma.get("/cu/sysRgpara/getBooleanByChrCode/CU002" + "/" + agencyCode, {}, function (result) { //CWYXM-11399 --系统管理-系统选项，出纳是否显示账套，设置为单位级控制，但仍然是由系统级控制--zsj
					isNeedAcct = result.data;
					if (isNeedAcct) {
						$("#acct").removeClass("hide");
						$("#cbAcct").ufCombox({
							idField: 'code',
							textField: 'codeName',
							readonly: false,
							placeholder: '请选择账套',
							icon: 'icon-book',
							theme: 'label',
							onChange: function (sender, data) {
								acctCode = $('#cbAcct').getObj().getValue();
								acctName = $('#cbAcct').getObj().getText();
								var url = dm.getCtrl('accBook');
								callback = function (result) {
									$("#AccBook").getObj().load(result.data);
									for (var i = 0; i < result.data.length; i++) {
										if (result.data[i].isLeaf == "1") {
											if (sessionAccbook && !$.isNull(sessionAccbook.selAccBookCode) && (sessionAccbook.selAcctCode == acctCode)) {
												$('#AccBook').getObj().val(sessionAccbook.selAccBookCode);
												break;
											} else {
												$('#AccBook').getObj().val(result.data[i].ID);
												flagId = result.data[i].ID
												break;
											}
										}
									}
								}
								var argu = {
									agencyCode: agencyCode,
									acctCode: acctCode
								}
								ufma.get(url, argu, callback);
								var params = {
									selAgecncyCode: agencyCode,
									selAgecncyName: agencyName,
									selAccBookCode: accbookCode,
									selAccBookName: accbookName,
									selAcctCode: acctCode,
									selAcctName: acctName
								}
								ufma.setSelectedVar(params);
							},
							onComplete: function (sender) {
								if (ptData.svAcctCode) {
									$("#cbAcct").getObj().val(ptData.svAcctCode);
								} else {
									$('#cbAcct').getObj().val('1');
								}
								ufma.hideloading();
							}
						});
						var argu = {
							agencyCode: agencyCode,
							setYear: ptData.svSetYear
						}
						callback = function (result) {
							$("#cbAcct").getObj().load(result.data);
						}
						ufma.get("/cu/common/eleCoacc/getCoCoaccs/" + agencyCode, argu, callback);

					} else {
						$("#acct").addClass("hide");
						//获取账簿信息
						var url = dm.getCtrl('accBook');
						callback = function (result) {
							$("#AccBook").getObj().load(result.data);
							for (var i = 0; i < result.data.length; i++) {
								if (result.data[i].isLeaf == "1") {
									if (sessionAccbook && !$.isNull(sessionAccbook.selAccBookCode)) {
										$('#AccBook').getObj().val(sessionAccbook.selAccBookCode);
										break;
									} else {
										$('#AccBook').getObj().val(result.data[i].ID);
										flagId = result.data[i].ID
										break;
									}
								}
							}
						}
						ufma.get(url, {
							agencyCode: agencyCode
						}, callback);
					}

				});
			},
			// 记录/修改合并方式数据
			configupdate: function (value) {
				var data = {
					"agencyCode": agencyCode,
					// "acctCode": value.acctCode,
					// "accBook": $('#AccBook').getObj().getValue(),
					"acctCode": $('#AccBook').getObj().getValue(),
					"menuId": "4c4f64f8-e810-46f6-9757-1591c50188f5",
					"configKey": "switchStyleData",
					"configValue": JSON.stringify(value.mParam)
				}
				ufma.ajaxDef('/pub/user/menu/config/update', "post", data, function (data) { })
			},
			// 获取记忆的合并方式数据
			getRememberData: function (callback) {
				ptData.rememberData = {};
				var argu = {
					agencyCode: agencyCode,
					// acctCode: isNeedAcct ? acctCode : sendObj.acctCode,
					// accBook: $('#AccBook').getObj().getValue(),
					acctCode: $('#AccBook').getObj().getValue(),
					menuId: "4c4f64f8-e810-46f6-9757-1591c50188f51"
				};
				ufma.get("/pub/user/menu/config/select", argu, function (result) {
					ptData.rememberData = result.data;
					callback(result.data)
				})
			},
			//set remember的值
			setRememberData: function (data) {
				var switchStyleData = (!data.switchStyleData || data.switchStyleData === {}) ? false : JSON.parse(data.switchStyleData);
				if (switchStyleData) {
					for (var key in switchStyleData) {
						if (switchStyleData[key]) {
							$("input[name='" + key + "']").prop("checked", true);
						} else {
							$("input[name='" + key + "']").prop("checked", false);
						}
					}
				} else {
					$("input[name='isMergerDr']").prop("checked", false);
					$("input[name='isMergerCr']").prop("checked", false);
					$("input[name='isMergerAcc']").prop("checked", false);
					$("input[name='onlyDescpt']").prop("checked", false);
					$("input[name='isDescptAppend']").prop("checked", false);
				}
			},
			//获取账簿字数长度以及账簿宽度，动态控制字体大小 guohx  20200213
			getLength: function (namelen, divLen) {
				var autoSize = 14;
				if (namelen * 14 > divLen) { //有字溢出字体缩小
					autoSize = 12;
				}
				return autoSize;
			},
			//动态计算单位账套账簿的宽度
			getWidth: function () {
				var width = $(".portlet-title").width() - $(".caption").width() - $(".actions").width() - 10 - 20;
				return width / 3;
			},
			//解析跳转过来url参数
			getUrlParam: function (name) {
				var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象 
				var r = window.location.search.substr(1).match(reg); //匹配目标参数 
				if (r != null)
					return unescape(r[2]);
				return null; //返回参数值 
			},
			//处理跳转过来的打开弹窗页面 guohx 20200317
			dealJump: function () {
				var argu = {
					agencyCode: agencyCode,
					setYear: ptData.svSetYear,
					rgCode: ptData.svRgCode,
					acctCode: sendObj.acctCode,
					accountbookGuid: sendObj.accountbookGuid,
					jouGuid: page.getUrlParam("jouGuid")
				};
				dm.cbbGetone(argu, function (result) {
					var oneData = result.data.page.list[0];
					if (sendObj.accountBookType == '1') {
						var title = '现金日记账';
						page.openEditWin(title, oneData, page.getUrlParam("jouGuid"));
					} else if (sendObj.accountBookType == '2') {
						var title = '银行存款日记账';
						page.openEditWin(title, oneData, page.getUrlParam("jouGuid"));
					} else if (sendObj.accountBookType == '3') {
						var title = '零余额日记账';
						page.openEditWin(title, oneData, page.getUrlParam("jouGuid"));
					} else {
						ufma.showTip('请选择末级账簿！', {}, function () { });
						return false;
					}
				});
			},
			getVouFisPerd: function () {
				vouFisPerdArray = {};
				//循环把option填入select
				var $vouFisPerdOp = '<option value="">  </option>';
				for (var i = 0; i < fisPerdData.length; i++) {
				  //创建凭证类型option节点
				  vouFisPerdArray[fisPerdData[i].code] = fisPerdData[i].codeName;
				  $vouFisPerdOp += '<option value="' + fisPerdData[i].code + '">' + fisPerdData[i].codeName + '</option>';
				}
				$('#vouFisPerd').html($vouFisPerdOp);
			  },
			onEventListener: function () {
				ufma.searchHideShow($('#gridGOV'));
				// 编辑按钮切换样式
				$('#btnSwitch').ufTooltip({
					trigger: 'click', //click|hover
					opacity: 1,
					confirm: false,
					gravity: 'north', //north|south|west|east
					content: "#switchStyle"
				});
				// 合并方式change事件（借方 贷方 辅助核算合并 摘要累加 摘要相同时合并）
				$("#switchStyle").on("change", "input[type='checkbox']", function () {
					if ($(this).attr("name") == "onlyDescpt") { // 点击摘要相同时合并
						if ($(this).prop("checked")) { // 勾选摘要相同时合并
							$(this).parents("#switchStyle").find("input[name='isMergerDr']").prop("checked", true);
							$(this).parents("#switchStyle").find("input[name='isMergerCr']").prop("checked", true);
							$(this).parents("#switchStyle").find("input[name='isMergerAcc']").prop("checked", true);
							// 借方 贷方 辅助核算合并 摘要相同时合并 全部勾选时  摘要累加取消勾选且不可用
							$("#DescptAppend").find("input[name='isDescptAppend']").removeAttr("checked");
							$("#DescptAppend").find("input[name='isDescptAppend']").attr("disabled", true);
						} else { // 取消勾选摘要相同时合并
							$("#DescptAppend").find("input[name='isDescptAppend']").attr("disabled", false);
						}
					} else if ($(this).attr("name") == "isMergerAcc") { // 点击辅助核算合并
						if ($(this).parents("#switchStyle").find("input[name='onlyDescpt']").prop("checked") == true) {
							$(this).prop("checked", true); // 摘要相同时合并勾选状态时，辅助核算合并不可取消勾选
						} else if ($(this).prop("checked")) { // 摘要相同时合并未勾选状态时，勾选借方/贷方
							$(this).parents("#switchStyle").find("input[name='isMergerDr']").prop("checked", true);
							$(this).parents("#switchStyle").find("input[name='isMergerCr']").prop("checked", true);
						}
					} else if ($(this).attr("name") == "isMergerCr" || $(this).attr("name") == "isMergerDr") { // 点击借方/贷方
						if ($(this).parents("#switchStyle").find("input[name='isMergerAcc']").prop("checked") == true) {
							$(this).prop("checked", true); // 辅助核算合并勾选状态时，借方/贷方不可取消勾选
						}
					}
					// 勾选借方/贷方/辅助核算合并任意一个时，摘要累加可以勾选，如果这三个选项都没有勾选，摘要累加取消勾选且不可用；
					if ($(this).parents("#switchStyle").find("input[name='isMergerCr']").prop("checked") || $(this).parents("#switchStyle").find("input[name='isMergerDr']").prop("checked") || $(this).parents("#switchStyle").find("input[name='isMergerAcc']").prop("checked")) {
						if ($(this).parents("#switchStyle").find("input[name='onlyDescpt']").prop("checked")) {
							$("#DescptAppend").find("input[name='isDescptAppend']").attr("disabled", true);
						} else {
							$("#DescptAppend").find("input[name='isDescptAppend']").attr("disabled", false);
						}
					} else {
						$("#DescptAppend").find("input[name='isDescptAppend']").removeAttr("checked");
						$("#DescptAppend").find("input[name='isDescptAppend']").attr("disabled", true);
					}
				});

				$('#btnDaliy').on('click', function () {
					if (sendObj.isLeaf == "0") {
						ufma.showTip('请选择末级账簿！', {}, function () { });
						return false;
					} else {
						var bookinType = "1";
						if (sendObj.accountBookType == '1') {
							var title = '现金日记账';
							page.openWin(title, bookinType);
						} else if (sendObj.accountBookType == '2') {
							var title = '银行存款日记账';
							page.openWin(title, bookinType);
						} else if (sendObj.accountBookType == '3') {
							var title = '零余额日记账';
							page.openWin(title, bookinType);
						} else {
							ufma.showTip('请选择末级账簿！', {}, function () { });
							return false;
						}
					}
				})
				//期初登账
				$('#btnBegin').on('click', function () {
					if (sendObj.isLeaf == "0") {
						ufma.showTip('请选择末级账簿！', {}, function () { });
						return false;
					} else {
						var bookinType = "0";
						if (sendObj.accountBookType == '1') {
							var title = '现金日记账';
							page.openWin(title, bookinType);
						} else if (sendObj.accountBookType == '2') {
							var title = '银行存款日记账';
							page.openWin(title, bookinType);
						} else if (sendObj.accountBookType == '3') {
							var title = '零余额日记账';
							page.openWin(title, bookinType);
						} else {
							ufma.showTip('请选择末级账簿！', {}, function () { });
							return false;
						}
					}
				})
				//从账务取数
				$('#btnGetData').on('click', function () {
					if (sendObj.isLeaf != "1") {
						ufma.showTip('请选择末级账簿！', {}, function () { });
						return false;
					}
					var colItem = [];
					if (!$.isNull(sendObj.needShowAcc)) {
						colItem = (sendObj.needShowAcc).split(',')
					}
					ufma.open({
						url: 'accountNum.html',
						title: '从账务取数',
						width: 1090,
						data: {
							"agencyCode": agencyCode,
							"setYear": ptData.svSetYear,
							"rgCode": ptData.svRgCode,
							"acctCode": sendObj.acctCode,
							"accountbookGuid": sendObj.accountbookGuid,
							"accoCode": sendObj.accoCode,
							"zwData": zwData,
							"accountBookType": sendObj.accountBookType,
							"fisPerd": ptData.svFiscalPeriod,
							"startDate": $('#startJouDate').getObj().getValue(),
							"endDate": $('#endJouDate').getObj().getValue(),
							"isVouSign": sendObj.isVouSign,
							"colItem": colItem,
							"period": period
						},
						ondestory: function () {
							$('#queryAll').trigger('click');
						}
					})
				})
				//主界面 查询
				$('#queryAll').on('click', function () {
					/*bug81043 【20190610 财务云8.0 广东省财政厅】登记出纳账页面的时间选择可以选择例如“2019-06-01”至“2019-03-01”这种错误时间区间而且系统不会提示，该区间查询出来不会显示任何结果--zsj*/
					if ($('#startJouDate').getObj().getValue() > $('#endJouDate').getObj().getValue()) {
						ufma.showTip('开始日期不能大于结束日期！', function () { }, 'warning');
						return false;
					}
					if (!$.isNull($('input[name="minMoney"]').val()) && !$.isNull($('input[name="maxMoney"]').val())) {
						var moneyfrom = $('input[name="minMoney"]').val().replace(/,/g, "");
						var moneyto = $('input[name="maxMoney"]').val().replace(/,/g, "");
						if (parseFloat(moneyfrom) > parseFloat(moneyto)) {
							ufma.showTip('开始金额不能大于结束金额！', function () { }, 'error');
							return false;
						}
					}
					page.loadGrid();
					page.initGrid();
				})
				//表头全选
				$("body").on("click", 'input#check-head', function () {
					var flag = $(this).prop("checked");
					if (flag) {
						$("#gridGOV").find("tbody tr").addClass("selected").nextUntil("tr").addClass("selected");
					} else {
						$("#gridGOV").find("tbody tr").removeClass("selected").nextUntil("tr").removeClass("selected");
					}
					$("#gridGOV_wrapper").find('input.check-all').prop('checked', flag);
					$("#all").prop('checked', flag)
				});
				//全选
				$("#all").on("click", function () {
					var flag = $(this).prop("checked");
					$("#gridGOV_wrapper").find('input.check-all').prop('checked', flag);
					$("#check-head").prop('checked', flag)
					if (flag) {
						$("#gridGOV").find("tbody tr").addClass("selected").nextUntil("tr").addClass("selected");
					} else {
						$("#gridGOV").find("tbody tr").removeClass("selected").nextUntil("tr").removeClass("selected");
					}
				});
				//单选
				$("body").on("click", 'input.check-all', function () {
					var num = 0;
					var arr = document.querySelectorAll('.check-all')
					for (var i = 0; i < arr.length; i++) {
						if (arr[i].checked) {
							num++
						}
					}
					if (num == arr.length) {
						$("#all").prop('checked', true)
						$("#check-head").prop('checked', true)
					} else {
						$("#all").prop('checked', false)
						$("#check-head").prop('checked', false)
					}
					var $tr = $(this).parents("tr");
					$tr.toggleClass("selected");
				});
				//删除
				// isCheck = 1 ：已对账数据（不可修改不可删除可生成凭证取消凭证）
				// linkVouGuid不为空： 已生成凭证（不可修改不可删除不可生成凭证可取消凭证）
				// linkGuid 不为空 （不可修改不可生成凭证不可取消凭证可删除）；
				// linkJouGuid 不为空 ： 提现存现数据：是否关联修改删除提示（可修改可生成凭证可取消凭证可删除）。
				$('#delete').on('click', function () {
					var delDt = [];
					linkGuidsArr = [];
					var state;
					ufma.showloading('正在删除出纳账，请耐心等待...');
					$("#gridGOV tbody tr").each(function (index, row) {
						var $chk = $(this).find("input[type='checkbox']");
						if ($chk.is(":checked") == true) {
							var tempIndex = $(this).find('.viewData').attr('data-index');
							var tempData = rowTableData[tempIndex];
							var jouGuid = tempData.jouGuid;
							var linkJouGuid = tempData.linkJouGuid;
							var linkVouGuid = tempData.linkVouGuid;
							var linkModule = tempData.linkModule;
							var num = tempData.jouNo;
							var isCheck = tempData.isCheck;
							if (!$.isNull(linkVouGuid) && (isCheck == 1)) {
								state = 1;
								return false;
							} else if ((!$.isNull(linkVouGuid)) && (linkModule != 'GL')) {
								state = 2;
								return false;
							} else if (isCheck == 1) {
								state = 3;
								return false;
							} else if (!$.isNull(linkJouGuid)) {
								state = 4;
								linkGuidsArr.push({
									"seq": num,
									"linkJouGuid": linkJouGuid
								});
								modifyLink = 1;
								delDt[delDt.length] = jouGuid;
							} else {
								//可删除
								delDt[delDt.length] = jouGuid;
							}
						}
					});
					if (state == 1) {
						ufma.showTip('该条日记账已生成了凭证且已对账，请先取消生成凭证且在银行对账中取消对账！', function () {
							ufma.hideloading();
						}, 'warning');
						return false;
					} else if (state == 2) {
						ufma.showTip('该条日记账已生成了凭证，请先取消生成凭证！', function () {
							ufma.hideloading();
						}, 'warning');
						return false;
					} else if (state == 3) {
						ufma.showTip('该条日记账已对账，请先在银行对账中取消对账！', function () {
							ufma.hideloading();
						}, 'warning');
						return false;
					} else if (state == 4) {
						ufma.confirm('您确定要删除选中的数据吗？', function (action) {
							if (action) {
								var argu = {
									linkGuids: linkGuidsArr
								}
								dm.getlinkMessage(argu, function (result) {
									var msg = result.msg;
									ufma.confirm("是否同时删除以下关联日记账：<br/>" + msg, function (action) {
										if (action) {
											var argu = {
												agencyCode: agencyCode,
												setYear: ptData.svSetYear,
												rgCode: ptData.svRgCode,
												accountbookGuid: sendObj.accountbookGuid,
												jouGuids: delDt,
												isModifyLink: 1
											};
											//点击确定的回调函数
											dm.delete(argu, function (result) {
												if (result.flag == 'success') {
													ufma.showTip('删除成功！', function () {
														ufma.hideloading();
														$('#queryAll').trigger('click');
													}, 'success');
												}
											});
										} else {
											var argu = {
												agencyCode: agencyCode,
												setYear: ptData.svSetYear,
												rgCode: ptData.svRgCode,
												accountbookGuid: sendObj.accountbookGuid,
												jouGuids: delDt,
												isModifyLink: 0
											};
											//点击确定的回调函数
											dm.delete(argu, function (result) {
												if (result.flag == 'success') {
													ufma.showTip('删除成功！', function () {
														ufma.hideloading();
														$('#queryAll').trigger('click');
													}, 'success');
												}
											});
										}
									}, {
										type: 'warning'
									});
								});
							} else {
								//点击取消的回调函数
								ufma.hideloading();
							}
						}, {
							type: 'warning'
						});
					} else {
						if (delDt.length == 0) {
							ufma.showTip('请选择要删除的数据！', function () {
								ufma.hideloading();
							}, 'warning');
							return false;
						} else {
							ufma.confirm('您确定要删除选中的数据吗？', function (action) {
								if (action) {
									var argu = {
										agencyCode: agencyCode,
										setYear: ptData.svSetYear,
										rgCode: ptData.svRgCode,
										accountbookGuid: sendObj.accountbookGuid,
										jouGuids: delDt,
										isModifyLink: 0
									};
									//点击确定的回调函数
									dm.delete(argu, function (result) {
										if (result.flag == 'success') {
											ufma.showTip('删除成功！', function () {
												ufma.hideloading();
												$('#queryAll').trigger('click');
											}, 'success');
										}
									});
								} else {
									//点击取消的回调函数
									ufma.hideloading();
								}
							}, {
								type: 'warning'
							});
						}

					}
				});

				//隐藏菜单
				$('#hide').on('click', function () {
					$('#show').removeClass('hidden');
					$(this).addClass('hidden');
					$('#queryMore').addClass('hidden');
					ufma.setBarPos($(window));
				})
				//显示菜单
				$('#show').on('click', function () {
					$('#hide').removeClass('hidden')
					$(this).addClass('hidden')
					$('#queryMore').removeClass('hidden')
					ufma.setBarPos($(window));
				})
				//选择期间，改变日历控件的值
				$("#dateBq").on("click", function () {
					page.dateBenQi("startJouDate", "endJouDate");
					period = "bq";
				});
				$("#dateBn").on("click", function () {
					page.dateBenNian("startJouDate", "endJouDate");
					period = "bn";
				});
				$("#dateJr").on("click", function () {
					page.dateToday("startJouDate", "endJouDate");
					period = "jr";
				});
				//打开编辑界面
				$(document).on('click', '.viewData', function (e) {
					var tempIndex = $(this).attr('data-index');
					var tempData = rowTableData[tempIndex];
					var jouGuid = tempData.jouGuid;
					var cashTypeChoose = tempData.cashType;
					var cashType;
					var num = tempData.jouNo;
					var argu = {
						agencyCode: agencyCode,
						setYear: ptData.svSetYear,
						rgCode: ptData.svRgCode,
						acctCode: sendObj.acctCode,
						accountbookGuid: sendObj.accountbookGuid,
						jouGuid: jouGuid
					};
					dm.cbbGetone(argu, function (result) {
						var oneData = result.data.page.list[0];
						//bug75012--zsj--从账务取数，取到的数据资金类型为空，但是修改数据时资金类型默认为本年预算
						if (!$.isNull(cashTypeChoose)) {
							oneData.cashType = cashTypeChoose;
						} else {
							oneData.cashType = '2';
						}
						if (sendObj.accountBookType == '1') {
							var title = '现金日记账';
							/* bug81248--出纳登记出纳账登账之后改日期凭证号会变--编辑修改保存时增加参数jouGuid--zsj*/
							page.openEditWin(title, oneData, jouGuid);
						} else if (sendObj.accountBookType == '2') {
							var title = '银行存款日记账';
							page.openEditWin(title, oneData, jouGuid);
						} else if (sendObj.accountBookType == '3') {
							var title = '零余额日记账';
							page.openEditWin(title, oneData, jouGuid);
						} else {
							ufma.showTip('请选择末级账簿！', {}, function () { });
							return false;
						}
					});
				});
				//国库生成
				$('#gksc').on('click', function () {
					if (sendObj.isLeaf == "0") {
						ufma.showTip('请选择末级账簿！', {}, function () { });
						return false;
					} else {
						ufma.open({
							url: './vouGkdj/vouGkdj.html',
							title: '国库单据',
							width: 900,
							data: {
								"agencyCode": agencyCode,
								"setYear": ptData.svSetYear,
								"rgCode": ptData.svRgCode,
								"acctCode": sendObj.acctCode,
								"accountbookGuid": sendObj.accountbookGuid,
								"accountBookType": sendObj.accountBookType,
								"accoCode": sendObj.accoCode,
								"userId": ptData.svUserId, //修改权限  将svUserCode改为 svUserId  20181012
								"userName": ptData.svUserName,
								"startDate": $('#startJouDate').getObj().getValue(),
								"endDate": $('#endJouDate').getObj().getValue()
							},
							ondestory: function () {
								$('#queryAll').trigger('click');
							}
						});

					}
				});
				//提现
				$('#tixian').on('click', function () {
					if (sendObj.isLeaf == "0") {
						ufma.showTip('请选择末级账簿！', {}, function () { });
						return false;
					} else {
						ufma.open({
							url: './depositCash/depositCash.html',
							title: '提现',
							width: 750,
							data: {
								"agencyCode": agencyCode,
								"setYear": ptData.svSetYear,
								"rgCode": ptData.svRgCode,
								"acctCode": sendObj.acctCode,
								"accountbookGuid": sendObj.accountbookGuid,
								"accountBookType": sendObj.accountBookType,
								"accoCode": sendObj.accoCode,
								"userId": ptData.svUserId, //修改权限  将svUserCode改为 svUserId  20181012
								"flag": "tixian",
								"isNeedAcct": isNeedAcct,
								"fisPerdData" : fisPerdData
							},
							ondestory: function () {
								$('#queryAll').trigger('click');
							}
						})
					}
				})
				//存现
				$('#cunxian').on('click', function () {
					if (sendObj.isLeaf == "0") {
						ufma.showTip('请选择末级账簿！', {}, function () { });
						return false;
					} else {
						ufma.open({
							url: './depositCash/depositCash.html',
							title: '存现',
							width: 750,
							data: {
								"agencyCode": agencyCode,
								"setYear": ptData.svSetYear,
								"rgCode": ptData.svRgCode,
								"acctCode": sendObj.acctCode,
								"accountbookGuid": sendObj.accountbookGuid,
								"accountBookType": sendObj.accountBookType,
								"accoCode": sendObj.accoCode,
								"userId": ptData.svUserId, //修改权限  将svUserCode改为 svUserId  20181012
								"flag": "cunxian",
								"isNeedAcct": isNeedAcct,
								"fisPerdData" : fisPerdData
							},
							ondestory: function () {
								$('#queryAll').trigger('click');
							}
						});

					}
				});
				//编号重排序
				$('#sortNo').on('click', function () {
					if (sendObj.isLeaf == "0") {
						ufma.showTip('请选择末级账簿！', {}, function () { });
						return false;
					} else {
						ufma.open({
							url: 'sortVoucher.html',
							title: '出纳账重排',
							width: 1050,
							data: {
								"agencyCode": agencyCode,
								"setYear": ptData.svSetYear,
								"rgCode": ptData.svRgCode,
								"acctCode": sendObj.acctCode,
								"accountbookGuid": sendObj.accountbookGuid,
								"accountBookType": sendObj.accountBookType,
								"accoCode": sendObj.accoCode,
								"userId": ptData.svUserId, //修改权限  将svUserCode改为 svUserId  20181012
								"flag": "cunxian",
								"fisPerd" : ptData.svFiscalPeriod,
								"nowDate":page.nowDate
							},
							ondestory: function () {
								$('#queryAll').trigger('click');
							}
						});

					}
				});
				
				//生成凭证--新需求---------merge:是否合并生成（1是、0否）
				$('#createVou').on('click', function () {
					generateID = 'createVou';
					var delDt = [];
					var tempData = [];
					var vouTypeNameNo = '';
					var useAlert = []; //zsj--CWYXM-11208 --出纳管理-生成凭证，已经生成凭证的出纳账，再次点击生成凭证，第一次给的弹窗可以省略，直接提示已经生成凭证，重新选择
					$("#gridGOV tbody tr").each(function (index, row) {
						var $chk = $(this).find("input[type='checkbox']");
						if ($chk.is(":checked") == true) {
							var tempIndex = $(this).find('.viewData').attr('data-index');
							//var tempData = rowTableData[tempIndex];
							tempData = rowTableData[tempIndex];
							useAlert.push(rowTableData[tempIndex]); //zsj--CWYXM-11208 --出纳管理-生成凭证，已经生成凭证的出纳账，再次点击生成凭证，第一次给的弹窗可以省略，直接提示已经生成凭证，重新选择
							var jouGuid = tempData.jouGuid;
							vouTypeNameNo = tempData.vouTypeNameNo;
							if (!$.isNull(vouTypeNameNo)) { //当选中多行数据时，凭证字号是否为空用标志表示
								page.vouTypecan = '1';
							} else {
								page.vouTypecant = '2';
							}
							delDt[delDt.length] = jouGuid;
						}
					});
					//账簿是否为生成前预览
					if (sendObj.isPreview == 1) {
						if (delDt.length == 0) {
							ufma.showTip('请选择要生成凭证的数据！', function () { }, 'warning');
							return false;
						} else if (delDt.length > 1) {
							if (page.vouTypecant == '2') {
								ufma.showTip('只能选择一条数据预览！', function () { }, 'warning');
								return false;
							}
						} else {
							var arguVou = {
								"agencyCode": agencyCode,
								"acctCode": sendObj.acctCode,
								"setYear": ptData.svSetYear,
								"rgCode": ptData.svRgCode,
								"userId": ptData.svUserId,
								"userCode": ptData.svUserCode,
								"roleId": ptData.svRoleId,
								"roleCode": ptData.svRoleCode,
								"jouGuids": delDt,
								"sysId": "CU",
								"generate": "0",
								"isMain": false
							}
							var inputs = $("#switchStyle ").find("input");
							var len = inputs.length;
							arguVou.mParam = {};
							for (var i = 0; i < len; i++) {
								if ($("#switchStyle ").find("input").eq(i).is(':checked')) {
									arguVou.mParam[$("#switchStyle ").find("input").eq(i).attr("name")] = true;
								} else {
									arguVou.mParam[$("#switchStyle ").find("input").eq(i).attr("name")] = false;
								}
							}
							//凭证类型--zsj--bug80697 【20190605 广东省财政厅】手工登账的日记账界面的凭证号无法手工录入
							if (page.vouTypecan == '1' && $.isNull(tempData.linkVouGuid) && (tempData.linkModule != 'GL')) { //CWYXM-11208 出纳管理-生成凭证，已经生成凭证的出纳账，再次点击生成凭证，第一次给的弹窗可以省略，直接提示已经生成凭证，重新选择--zsj
								ufma.confirm('已存在凭证号，是否还需要生成凭证，生成凭证后覆盖原凭证号？', function (action) {
									if (action) {
										ufma.showloading('生成凭证中，请耐心等待...');
										dm.previewVou(arguVou, function (result) {
											ufma.hideloading();
											if (!$.isNull(result.data)) {
												previewData = result.data;
											}
											if (result.flag == "success") { // 返回成功 记忆合并方式
												page.configupdate(arguVou);
											}
											page.openPreviewWindow(previewData);
										});
									} else {
										//点击取消的回调函数
									}
									page.vouTypecan = '';
									page.vouTypecant = '';
								}, {
									type: 'warning'
								});
							} else {
								ufma.showloading('生成凭证中，请耐心等待...');
								dm.previewVou(arguVou, function (result) {
									ufma.hideloading();
									if (!$.isNull(result.data)) {
										previewData = result.data;
									}
									if (result.flag == "success") { // 返回成功 记忆合并方式
										page.configupdate(arguVou);
									}
									page.openPreviewWindow(previewData);
								});
							}

						}
					} else {
						if (delDt.length == 0) {
							ufma.showTip('请选择要生成凭证的数据！', function () { }, 'warning');
							return false;
						} else {
							var argu = {
								"agencyCode": agencyCode,
								"acctCode": sendObj.acctCode,
								"setYear": ptData.svSetYear,
								"rgCode": ptData.svRgCode,
								"userId": ptData.svUserId,
								"userCode": ptData.svUserCode,
								"roleId": ptData.svRoleId,
								"roleCode": ptData.svRoleCode,
								"jouGuids": delDt,
								"sysId": "CU",
								"generate": "0",
								"isMain": false,
							}
							var inputs = $("#switchStyle ").find("input");
							var len = inputs.length;
							argu.mParam = {};
							for (var i = 0; i < len; i++) {
								if ($("#switchStyle ").find("input").eq(i).is(':checked')) {
									argu.mParam[$("#switchStyle ").find("input").eq(i).attr("name")] = true;
								} else {
									argu.mParam[$("#switchStyle ").find("input").eq(i).attr("name")] = false;
								}
							}
							var countNum = 0;
							var overNum = 0;
							for (var i = 0; i < useAlert.length; i++) {
								if ($.isNull(useAlert[i].linkVouGuid) && (useAlert[i].linkModule != 'GL')) {
									countNum++;
								} else {
									overNum++;
								}
							}
							//凭证类型--zsj--bug80697 【20190605 广东省财政厅】手工登账的日记账界面的凭证号无法手工录入
							if (page.vouTypecan == '1' && countNum > 0 && overNum == 0) { //CWYXM-11208 出纳管理-生成凭证，已经生成凭证的出纳账，再次点击生成凭证，第一次给的弹窗可以省略，直接提示已经生成凭证，重新选择--zsj
								ufma.confirm('已存在凭证号，是否还需要生成凭证，生成凭证后覆盖原凭证号？', function (action) {
									if (action) {
										dm.createVou(argu, function (result) {
											if (result.flag == "success") {
												ufma.showTip(result.msg, function () { }, 'success');
												page.loadGrid();
												page.configupdate(argu); // 返回成功 记忆合并方式
											} else {
												ufma.showTip(result.msg, function () { }, 'warning');
											}
										});
									} else {
										//点击取消的回调函数
									}
									page.vouTypecan = '';
									page.vouTypecant = '';
								}, {
									type: 'warning'
								});
							} else if (page.vouTypecan == '1' && (countNum > 0 || countNum == 0) && overNum > 0) { //CWYXM-11208 出纳管理-生成凭证，已经生成凭证的出纳账，再次点击生成凭证，第一次给的弹窗可以省略，直接提示已经生成凭证，重新选择--zsj else {
								ufma.showTip('含有已经生成凭证的数据，请重新选择', function () { }, 'warning');
								return false;
							} else {
								ufma.showloading('生成凭证中，请耐心等待...');
								dm.createVou(argu, function (result) {
									ufma.hideloading();
									if (result.flag == "success") {
										ufma.showTip(result.msg, function () { }, 'success');
										page.loadGrid();
										page.configupdate(argu); // 返回成功 记忆合并方式
									} else {
										ufma.showTip(result.msg, function () { }, 'warning');
									}
								});
							}
						}
					}
				});
				//合并生成凭证--新需求---------merge:是否合并生成（1是、0否）
				$('#mergeCreateVou').on('click', function () {
					generateID = 'mergeCreateVou';
					var delDt = [];
					var vouTypeNameNo = '';
					var recordTypeArr = [];
					var temp = ["1", "2"];
					var useAlert = []; //zsj--CWYXM-11208 --出纳管理-生成凭证，已经生成凭证的出纳账，再次点击生成凭证，第一次给的弹窗可以省略，直接提示已经生成凭证，重新选择
					$("#gridGOV tbody tr").each(function (index, row) {
						var $chk = $(this).find("input[type='checkbox']");
						if ($chk.is(":checked") == true) {
							var tempIndex = $(this).find('.viewData').attr('data-index');
							var tempData = rowTableData[tempIndex];
							var jouGuid = tempData.jouGuid;
							useAlert.push(rowTableData[tempIndex]); //zsj--CWYXM-11208 --出纳管理-生成凭证，已经生成凭证的出纳账，再次点击生成凭证，第一次给的弹窗可以省略，直接提示已经生成凭证，重新选择
							vouTypeNameNo = tempData.vouTypeNameNo;
							if (!$.isNull(vouTypeNameNo)) { //当选中多行数据时，凭证字号是否为空用标志表示
								page.vouTypecan = '1';
							} else {
								page.vouTypecant = '2';
							}
							var recordType = tempData.recordType;
							recordTypeArr.push(recordType);
							if (ufma.arrayContained(recordTypeArr, temp)) {
								delDt[0] = 0;
							}
							delDt[delDt.length] = jouGuid;
						}
					});
					if (delDt[0] == 0) {
						ufma.showTip('请选择日常或期初日记账中的一种生成凭证!', function () { }, 'warning');
						return false;
					} else {
						//账簿是否为生成前预览
						if (sendObj.isPreview == 1) {
							if (delDt.length == 0) {
								ufma.showTip('请选择要生成凭证的数据！', function () { }, 'warning');
								return false;
							} else {
								// var arguVou = {
								// 	"agencyCode": agencyCode,
								// 	"setYear": ptData.svSetYear,
								// 	"rgCode": ptData.svRgCode,
								// 	"accountBookGuid": $('#AccBook').getObj().getValue(),
								// 	jouGuids: delDt,
								// 	"generate": "1",
								// }
								var arguVou = {
									"agencyCode": agencyCode,
									"acctCode": sendObj.acctCode,
									"setYear": ptData.svSetYear,
									"rgCode": ptData.svRgCode,
									"userId": ptData.svUserId,
									"userCode": ptData.svUserCode,
									"roleId": ptData.svRoleId,
									"roleCode": ptData.svRoleCode,
									"jouGuids": delDt,
									"sysId": "CU",
									"generate": "1",
									"isMain": false,
									// "mParam": {
									// 	"isMergerDr": false, // 借方合并
									// 	"isMergerCr": false, // 贷方合并
									// 	"isMergerAcc": false, // 辅助核算合并
									// 	"onlyDescpt": false, // 摘要相同时合并
									// 	"isDescptAppend": false // 摘要累加
									// } //待定
								}
								var inputs = $("#switchStyle ").find("input");
								var len = inputs.length;
								arguVou.mParam = {};
								for (var i = 0; i < len; i++) {
									if ($("#switchStyle ").find("input").eq(i).is(':checked')) {
										arguVou.mParam[$("#switchStyle ").find("input").eq(i).attr("name")] = true;
									} else {
										arguVou.mParam[$("#switchStyle ").find("input").eq(i).attr("name")] = false;
									}
								}
								//zsj--CWYXM-11208 --出纳管理-生成凭证，已经生成凭证的出纳账，再次点击生成凭证，第一次给的弹窗可以省略，直接提示已经生成凭证，重新选择
								var countNumMearge = 0;
								var overNumMearge = 0;
								for (var i = 0; i < useAlert.length; i++) {
									if ($.isNull(useAlert[i].linkVouGuid) && (useAlert[i].linkModule != 'GL')) {
										countNumMearge++;
									} else {
										overNumMearge++;
									}
								}
								//凭证类型--zsj--bug80697 【20190605 广东省财政厅】手工登账的日记账界面的凭证号无法手工录入
								if (page.vouTypecan == '1' && countNumMearge > 0 && overNumMearge == 0) {
									ufma.confirm('已存在凭证号，是否还需要生成凭证，生成凭证后覆盖原凭证号？', function (action) {
										if (action) {
											dm.previewVou(arguVou, function (result) {
												if (!$.isNull(result.data)) {
													previewData = result.data;
												}
												if (result.flag == "success") { // 返回成功 记忆合并方式
													page.configupdate(arguVou);
												}
												page.openPreviewWindow(previewData);
											});
										} else {
											//点击取消的回调函数
										}
										page.vouTypecan = '';
										page.vouTypecant = '';
									}, {
										type: 'warning'
									});
								} else if (page.vouTypecan == '1' && (countNumMearge > 0 || countNumMearge == 0) && overNumMearge > 0) { //CWYXM-11208 出纳管理-生成凭证，已经生成凭证的出纳账，再次点击生成凭证，第一次给的弹窗可以省略，直接提示已经生成凭证，重新选择--zsj else {
									ufma.showTip('含有已经生成凭证的数据，请重新选择', function () { }, 'warning');
									return false;
								} else {
									ufma.showloading('生成凭证中，请耐心等待...');
									dm.previewVou(arguVou, function (result) {
										ufma.hideloading();
										if (!$.isNull(result.data)) {
											previewData = result.data;
										}
										if (result.flag == "success") { // 返回成功 记忆合并方式
											page.configupdate(arguVou);
										}
										page.openPreviewWindow(previewData);
									});
								}

							}
						} else {
							if (delDt.length == 0) {
								ufma.showTip('请选择要合并生成凭证的数据！', function () { }, 'warning');
								return false;
							} else {
								// var argu = {
								// 	"agencyCode": agencyCode,
								// 	"setYear": ptData.svSetYear,
								// 	"rgCode": ptData.svRgCode,
								// 	"accountBookGuid": $('#AccBook').getObj().getValue(),
								// 	jouGuids: delDt,
								// 	merge: 1
								// }
								var argu = {
									"agencyCode": agencyCode,
									"acctCode": sendObj.acctCode,
									"setYear": ptData.svSetYear,
									"rgCode": ptData.svRgCode,
									"userId": ptData.svUserId,
									"userCode": ptData.svUserCode,
									"roleId": ptData.svRoleId,
									"roleCode": ptData.svRoleCode,
									"jouGuids": delDt,
									"sysId": "CU",
									"generate": "1",
									"isMain": false,
									// "mParam": {
									// 	"isMergerDr": false, // 借方合并
									// 	"isMergerCr": false, // 贷方合并
									// 	"isMergerAcc": false, // 辅助核算合并
									// 	"onlyDescpt": false, // 摘要相同时合并
									// 	"isDescptAppend": false // 摘要累加
									// } //待定
								}
								var inputs = $("#switchStyle ").find("input");
								var len = inputs.length;
								argu.mParam = {};
								for (var i = 0; i < len; i++) {
									if ($("#switchStyle ").find("input").eq(i).is(':checked')) {
										argu.mParam[$("#switchStyle ").find("input").eq(i).attr("name")] = true;
									} else {
										argu.mParam[$("#switchStyle ").find("input").eq(i).attr("name")] = false;
									}
								}
								//zsj--CWYXM-11208 --出纳管理-生成凭证，已经生成凭证的出纳账，再次点击生成凭证，第一次给的弹窗可以省略，直接提示已经生成凭证，重新选择
								var countNumMearge = 0;
								var overNumMearge = 0;
								for (var i = 0; i < useAlert.length; i++) {
									if ($.isNull(useAlert[i].linkVouGuid) && (useAlert[i].linkModule != 'GL')) {
										countNumMearge++;
									} else {
										overNumMearge++;
									}

								}
								//凭证类型--zsj--bug80697 【20190605 广东省财政厅】手工登账的日记账界面的凭证号无法手工录入
								if (page.vouTypecan == '1' && countNumMearge > 0 && overNumMearge == 0) {
									ufma.confirm('已存在凭证号，是否还需要生成凭证，生成凭证后覆盖原凭证号？', function (action) {
										if (action) {
											dm.createVou(argu, function (result) {
												if (result.flag == "success") {
													ufma.showTip(result.msg, function () { }, 'success');
													page.loadGrid();
													page.configupdate(argu); // 返回成功 记忆合并方式
												} else {
													ufma.showTip(result.msg, function () { }, 'warning');
												}
											});
										} else {
											//点击取消的回调函数
										}
										page.vouTypecan = '';
										page.vouTypecant = '';
									}, {
										type: 'warning'
									});
								} else if (page.vouTypecan == '1' && (countNumMearge > 0 || countNumMearge == 0) && overNumMearge > 0) { //CWYXM-11208 出纳管理-生成凭证，已经生成凭证的出纳账，再次点击生成凭证，第一次给的弹窗可以省略，直接提示已经生成凭证，重新选择--zsj else {
									ufma.showTip('含有已经生成凭证的数据，请重新选择', function () { }, 'warning');
									return false;
								} else {
									ufma.showloading('生成凭证中，请耐心等待...');
									dm.createVou(argu, function (result) {
										if (result.flag == "success") {
											ufma.hideloading();
											ufma.showTip(result.msg, function () { }, 'success');
											page.loadGrid();
											page.configupdate(argu); // 返回成功 记忆合并方式
										} else {
											ufma.showTip(result.msg, function () { }, 'warning');
										}
									});
								}
							}
						}
					}

				});
				//取消生成---新需求
				$('#cancleVou').on('click', function () {
					var delDt = [];
					$("#gridGOV tbody tr").each(function (index, row) {
						var $chk = $(this).find("input[type='checkbox']");
						if ($chk.is(":checked") == true) {
							var tempIndex = $(this).find('.viewData').attr('data-index');
							var tempData = rowTableData[tempIndex];
							var jouGuid = tempData.jouGuid;
							if (!$.isNull(jouGuid)) {
								delDt[delDt.length] = jouGuid;
							}
						}
					});
					if (delDt.length == 0) {
						ufma.showTip('请选择要取消生成凭证的数据！', function () { }, 'warning');
						return false;
					} else {
						var argu = {
							"jouGuids": delDt,
							"agencyCode": agencyCode,
							"acctCode": sendObj.acctCode,
							"setYear": ptData.svSetYear,
							"rgCode": ptData.svRgCode,
							"userId": ptData.svUserId,
							"userCode": ptData.svUserCode,
							"roleId": ptData.svRoleId,
							"roleCode": ptData.svRoleCode,
						}
						ufma.showloading('取消凭证中，请耐心等待...');
						dm.cancelVou(argu, function (result) {
							ufma.hideloading();
							if (result.flag == "success") {
								ufma.showTip(result.msg, function () { }, 'success');
								page.loadGrid();
							} else {
								ufma.showTip(result.msg, function () { }, 'warning');
							}
						})
					}
				});

				//EXCEL导入出纳日记账--新需求
				$('#importRJZ').click(function () {
					if (sendObj.isLeaf == "0") {
						ufma.showTip('请选择末级账簿！', {}, function () { });
						return false;
					} else {
						ufma.open({
							title: '日记账导入',
							url: 'impExcel/impExcel.html',
							width: 800,
							data: {
								rgCode: ptData.svRgCode,
								agencyCode: agencyCode,
								setYear: ptData.svSetYear,
								accountBookGuid: $('#AccBook').getObj().getValue()
							},
							ondestory: function (rst) {
								$('#queryAll').trigger('click');
							}
						});
					}
				});
				//自定义导入
				$("#importZDY").on("click", function () {
					if (!$.isNull($("#AccBook_input").val())) {
						var param = {};
						param["action"] = "add";
						param["agencyCode"] = page.cbAgency.getValue();
						param["setYear"] = ptData.svSetYear;
						param["rgCode"] = ptData.svRgCode;
						param["acctCode"] = sendObj.acctCode;
						param["accoCode"] = sendObj.accoCode;
						param["accountBookGuid"] = $('#AccBook').getObj().getValue();
						param["items"] = page.items;
						// param["curDate"] = ptData.svTransDate;
						ufma.open({
							url: "impExcel/importExcel.html",
							title: "导入出纳账",
							width: 790,
							data: param,
							ondestory: function (data) {
								if (data.action == "import") {
									$('#queryAll').trigger('click');
								}
							}
						});
					} else {
						ufma.showTip("请先选择一个账簿！", function () { }, "warning");
						return false;
					}
				});
				// 修改为后端分页
				//分页尺寸下拉发生改变
				$(".ufma-table-paginate").on("change", ".vbPageSize", function () {
					pageLength = ufma.dtPageLength('#gridGOV', $(".ufma-table-paginate").find(".vbPageSize").val());
					serachData.pageSize = $(".ufma-table-paginate").find(".vbPageSize").val();
					$(".vbDataSum").html("");
					$("#gridGOV tbody").html('');
					$("#tool-bar .slider").remove();
					$(".ufma-table-paginate").html("");
					page.loadGrid();
				});

				//点击页数按钮
				$(".ufma-table-paginate").on("click", ".vbNumPage", function () {
					if ($(this).find("a").length != 0) {
						serachData.currentPage = $(this).find("a").attr("data-gopage");
						serachData.pageSize = $(".ufma-table-paginate").find(".vbPageSize").val();
						$(".vbDataSum").html("");
						$("#gridGOV tbody").html('');
						$("#tool-bar .slider").remove();
						$(".ufma-table-paginate").html("");
						page.loadGrid();
					}
				});

				//点击上一页
				$(".ufma-table-paginate").on("click", ".vbPrevPage", function () {
					if (!$(".ufma-table-paginate .vbPrevPage").hasClass("disabled")) {
						serachData.currentPage = $(this).find("a").attr("data-prevpage");
						serachData.pageSize = $(".ufma-table-paginate").find(".vbPageSize").val();
						$(".vbDataSum").html("");
						$("#gridGOV tbody").html('');
						$("#tool-bar .slider").remove();
						$(".ufma-table-paginate").html("");
						page.loadGrid();
					}
				});

				//点击下一页
				$(".ufma-table-paginate").on("click", ".vbNextPage", function () {
					if (!$(".ufma-table-paginate .vbNextPage").hasClass("disabled")) {
						serachData.currentPage = $(this).find("a").attr("data-nextpage");
						serachData.pageSize = $(".ufma-table-paginate").find(".vbPageSize").val();
						$(".vbDataSum").html("");
						$("#gridGOV tbody").html('');
						$(".ufma-tool-btns").html('');
						$(".ufma-table-paginate").html("");
						page.loadGrid();
					}
				});
			},
			//重构
			initPageNew: function () {
				$('#showMethodTip').click(function () {
					$('#rptPlanList').removeClass('hide');
					if (sendObj.accountBookType == '3') { //零余额	
						$('#gksc').removeClass('hide');
						$('#gksc').css({
							'border-bottom': '1px solid #D9D9D9'
						});
						$('#importRJZ').removeClass('hide');
						$('#importZDY').removeClass('hide');
						$('#importRJZ').css({
							//'margin-top': '30px',
							'margin-top': '67px',
							'height': '22px',
							'float': 'left',
							'margin-left': '-95px',
							'border-top': '1px solid #D9D9D9',
							'width': '82px',
							'text-align': 'center'
						});
						$('#importZDY').css({
							'margin-top': '88px',
							'height': '22px',
							'float': 'left',
							'margin-left': '-95px',
							'border-top': '1px solid #D9D9D9'
						});
						$('#btnBegin').css({
							'margin-top': '4px',
							'height': '22px',
							'float': 'left',
							'width': '82px',
							'border-bottom': '1px solid #D9D9D9',
							'text-align': 'center',
							'margin-left': '0px',
							'width': '82px'
						});
						$('#sortNo').css({
							'margin-top': '46px',
							'margin-left': '-95px',
							'text-align': 'center'
						});
						$('#tixian').addClass('hide');
						$('#cunxian').addClass('hide');
						$('#zanwu').addClass('hide');
					} else if (sendObj.accountBookType == '1') { //现金
						$('#gksc').addClass('hide');
						$('#importRJZ').removeClass('hide');
						$('#importZDY').removeClass('hide');
						$('#importRJZ').css({
							'margin-top': '85px',
							'height': '22px',
							'float': 'left',
							'margin-left': '-86px',
							'border-top': '1px solid #D9D9D9',
							'width': '78px',
							'text-align': 'center'
						});
						$('#importZDY').css({
							'margin-top': '105px',
							'height': '22px',
							'float': 'left',
							'margin-left': '-87px',
							'border-top': '1px solid #D9D9D9',
							'width': '78px',
							'text-align': 'center'
						});
						$('#tixian').css({
							'margin-left': '-85px',
							'text-align': 'center'
						});
						$('#cunxian').css({
							'margin-left': '-85px',
							'width': '78px',
							'text-align': 'center'
						});
						$('#btnBegin').css({
							'margin-top': '4px',
							'height': '22px',
							'float': 'left',
							'margin-left': '0px',
							'border-bottom': '1px solid #D9D9D9',
							'width': '78px',
							'text-align': 'center'
						});
						$('#sortNo').css({
							'margin-top': '65px',
							'margin-left': '-85px',
							'text-align': 'center',
							'border-bottom': 'none',
							'border-top': '1px solid #D9D9D9'
						});
						$('#tixian').removeClass('hide');
						$('#cunxian').removeClass('hide');
						$('#zanwu').addClass('hide');
					} else if (sendObj.accountBookType == '2') { //银行
						$('#gksc').addClass('hide');
						$('#tixian').addClass('hide');
						$('#cunxian').addClass('hide');
						$('#zanwu').addClass('hide');
						$('#importRJZ').removeClass('hide');
						$('#importZDY').removeClass('hide');
						$('#importRJZ').css({
							'margin-top': '48px',
							'height': '22px',
							'float': 'left',
							'margin-left': '-85px',
							'border-top': 'none',
							'width': '78px',
							'text-align': 'center'
						});
						$('#importZDY').css({
							'margin-top': '70px',
							'height': '22px',
							'float': 'left',
							'margin-left': '-87px',
							'border-top': '1px solid #D9D9D9',
							'width': '78px',
							'text-align': 'center'
						});
						$('#btnBegin').css({
							'margin-top': '4px',
							'height': '22px',
							'float': 'left',
							'border-bottom': '1px solid #D9D9D9',
							'width': '78px',
							'text-align': 'center',
							'margin-left': '0px',
						});
						$('#sortNo').css({
							'margin-top': '26px',
							'margin-left': '-85px',
							'text-align': 'center',
							'border-top': 'none',
							'border-bottom': '1px solid #D9D9D9'
						});
					} else {
						$('#gksc').addClass('hide');
						$('#tixian').addClass('hide');
						$('#cunxian').addClass('hide');
						$('#zanwu').removeClass('hide');
						$('#importRJZ').addClass('hide');
						$('#importZDY').addClass('hide');
					}
				});
				$('#showMethodTip').ufTooltip({
					className: 'p0',
					trigger: 'click', //click|hover
					opacity: 1,
					confirm: false,
					gravity: 'north', //north|south|west|east
					content: "#rptPlanList"
				});
			},

			//此方法必须保留
			init: function () {
				ptData = ufma.getCommonData();
				this.initPage();
				page.cbAgency = $('#cbAgency').ufmaTreecombox2({
					// url: dm.getCtrl('agency') + "?setYear=" + page.setYear + "&rgCode=" + ptData.svRgCode,
					valueField: 'id', //可选
					textField: 'codeName', //可选
					readonly: false,
					pIdField: 'pId', //可选
					placeholder: '请选择单位',
					icon: 'icon-unit',
					theme: 'label',
					leafRequire: true,
					onchange: function (data) {
						agencyCode = data.id;
						agencyName = data.name;
						//80827 【财务云8.0 鄂尔多斯 】20190630所有页面，单位或账套选择变化后，再打开其它页面时，自动显示为最近一次选择的单位或账套。--zsj
						//缓存单位
						var params = {
							selAgecncyCode: agencyCode,
							selAgecncyName: agencyName
						}
						ufma.setSelectedVar(params);
						page.checkNeedAcct();
						page.reqBillType();
					}
				});
				page.initAgencyScc();
				page.initGrid();
				// 初始化时取缓存中记录的行数信息
				serachData.pageSize = parseInt(localStorage.getItem("cuAccBookinPageSize")) ? parseInt(localStorage.getItem("cuAccBookinPageSize")) : 20;
				page.initPageNew();
				this.onEventListener();
				ufma.parseScroll();
				ufma.parse();
				var timeId = setTimeout(function () {
					for (var i = 0; i < $('input').length; i++) {
						$('input:not([autocomplete]),textarea:not([autocomplete]),select:not([autocomplete])').attr('autocomplete', 'off');
					}
					clearTimeout(timeId);
				}, 500);

			}
		}
	}();

	/////////////////////
	page.init();
});