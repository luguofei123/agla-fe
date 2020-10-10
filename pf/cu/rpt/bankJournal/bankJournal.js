$(function () {

	var page = function () {
		var sendObj = {};
		var ptData = ufma.getCommonData();
		var sessionAccbook = ufma.getSelectedVar();
		var agencyCode = '',
			agencyName = '',
			accBook = '',
			accbookCode = '',
			accbookName = '';
		var oTable;
		var arrayPush = {};
		var items;
		var bennian = ptData.svSetYear; //本年 年度
		var benqi = ptData.svFiscalPeriod; //本期  月份
		var today = ptData.svTransDate; //今日 年月日
		var pageLength = ufma.dtPageLength('#bankTable'); //分页
		var tableId = 'bankTable';
		var val;
		//var needShowAcc;
		var queryItems = {};
		var items;
		var accobookData

		function getPdf(reportCode, templId, groupDef) {
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
		}
		return {
			initSelect: function (id) {
				$(id).ufTreecombox({
					idField: 'accountbookCode',
					textField: 'accountbookName',
					readonly: false,
					placeholder: '',
					leafRequire: true,
					data: []
				})
			},
			//获取单位下拉树
			initAgencyScc: function () {

				page.cbAgency = $('#cbAgency').ufmaTreecombox2({
					valueField: 'id', //可选
					textField: 'codeName', //可选
					pIdField: 'pId', //可选
					readonly: false,
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
				ufma.ajaxDef(dm.getCtrl('agency') + "?setYear=" + ptData.svSetYear + "&rgCode=" + ptData.svRgCode, "get", "", function (result) {
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

			//获取账簿
			initAccBook: function () {
				//账簿初始化
				$("#accBook").ufTreecombox({
					idField: 'ID', //可选
					textField: 'accountbookName', //可选
					pIdField: 'PID', //可选
					readonly: false,
					placeholder: '请选择账簿',
					icon: 'icon-book',
					theme: 'label',
					leafRequire: false, //将非叶子节点变为可选
					onChange: function (sender, data) {
						accobookData = data
						sendObj.accountbookGuid = data.ID;
						sendObj.accountbookCode = data.ACCOUNTBOOK_CODE;
						sendObj.accountbookName = data.accountbookName;
						sendObj.agencyCode = data.agencyCode;
						sendObj.acctCode = data.ACCT_CODE;
						sendObj.accoCode = data.ACCO_CODE;
						sendObj.accountbookType = data.ACCOUNTBOOK_TYPE;
						sendObj.isMutinum = data.IS_MUTINUM; //显示跨账簿单据编号
						//80827 【财务云8.0 鄂尔多斯 】20190630所有页面，单位或账套选择变化后，再打开其它页面时，自动显示为最近一次选择的单位或账套。--zsj
						page.reqVouType();
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
						//动态辅助核算项--begin
						var argu = {
							"agencyCode": agencyCode,
							"setYear": ptData.svSetYear,
							"rgCode": ptData.svRgCode,
							accountbookGuid: sendObj.accountbookGuid,
							isNeedShowAccitem: true,
							isRequiredAccitem: true,
							isMustNeedRequired: true
						}
						dm.getAccoFZ(argu, function (result) {
							if (result.data != null) {
								items = result.data;
								page.items = '';
								page.items = items;
							}
							var $curRow = $('#planItemMore');
							$curRow.html('');
							var $curRowNew = $('#planItemMoreNew');
							$curRowNew.html('');
							for (var i = 0; i < page.items.length; i++) {
								var item = page.items[i];
								var itemEle = page.shortLineToTF(item.accitemCode) + 'Code';
								if (!$.isNull(itemEle)) {
									if (i == 0) {
										$curgroup = $('<div class="form-group" style="margin-left: 9px;width: 296px;"></div>').appendTo($curRow);
										$('<lable class="control-label auto" data-toggle= "tooltip" title="' + item.eleName + '" style="display:inline-block;width:70px;text-align: right;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">' + item.eleName + '：</lable>').appendTo($curgroup);
										var formCtrl = $('<div id="' + itemEle + '" name="' + itemEle + '" class="uf-treecombox" style=" width:215px;margin-left:5px;margin-top:-8px;"></div>').appendTo($curgroup);
									} else if (i == 1) {
										$curgroup = $('<div class="form-group" style="margin-left: 4px;"></div>').appendTo($curRow);
										$('<lable class="control-label auto" data-toggle= "tooltip" title="' + item.eleName + '" style="display:inline-block;width:70px;text-align: right;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">' + item.eleName + '：</lable>').appendTo($curgroup);
										var formCtrl = $('<div id="' + itemEle + '" name="' + itemEle + '" class="uf-treecombox" style=" width:262px;margin-left:5px;margin-top:-8px;"></div>').appendTo($curgroup);
									} else {
										if ((i - 2) % 3 == 0) {
											$curgroup = $('<div class="form-group"  style="margin-left: 0px;margin-bottom :10px;"></div>').appendTo($curRowNew);
											$('<lable class="control-label" data-toggle= "tooltip" title="' + item.eleName + '" style="display:inline-block;width:70px;text-align: right;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">' + item.eleName + '：</lable>').appendTo($curgroup);
											$curElement = $('<div class="control-element"></div>').appendTo($curgroup);
										} else {
											$curgroup = $('<div class="form-group" style="margin-bottom :10px;"></div>').appendTo($curRowNew);
											$('<lable class="control-label" data-toggle= "tooltip" title="' + item.eleName + '" style="display:inline-block;width:70px;text-align: right;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">' + item.eleName + '：</lable>').appendTo($curgroup);
											$curElement = $('<div class="control-element"></div>').appendTo($curgroup);
										}
									}
									var formCtrl = $('<div id="' + itemEle + '" name="' + itemEle + '" class="uf-treecombox" style=" width:200px;margin-left:5px;margin-top:-8px;"></div>').appendTo($curgroup);
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
												onComplete: function (sender) {
													//ufma.hideloading();
												}
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
							page.loadGridDPE();
						});
						//动态辅助核算项--end
					},
					onComplete: function (sender) {
						if (sessionAccbook && !$.isNull(sessionAccbook.selAccBookCode)) {
							$('#accBook').getObj().val(sessionAccbook.selAccBookCode);
						} else {
							$('#accBook').getObj().val('1');
						}
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

			initGridDPE: function () {
				var tableId = "bankTable"; //表格id
				var toolBar = $('#' + tableId).attr('tool-bar');
				var columns = [{
					title: "序号",
					data: "rowno",
					className: 'tc nowrap isprint',
					width: 44,
					"render": function (data, type, rowdata, meta) {
						var index = meta.row + 1
						return "<span>" + index + "</span>";
					}
				}, {
					title: "年",
					data: "jouDateYear",
					className: 'tc nowrap isprint',
					visible: true
				},
				{
					title: "月",
					data: "jouDateMonth",
					className: 'tc nowrap isprint',
					visible: true
				},
				{
					title: "日",
					data: "jouDateDay",
					className: 'tc nowrap isprint',
					visible: true
				}
				];
				if (sendObj.isMutinum == "1") {
					columns.push({
						title: "跨账簿单据编号",
						data: "mainJouNo",
						className: 'nowrap isprint',
						visible: true
					})
				}
				columns.push({
					title: "单据编号",
					data: "jouNo",
					className: 'nowrap isprint',
					visible: true,
					"render": function (data, type, rowdata, meta) {
						return '<span><a class="viewData common-jump-link" data-jouGuid="' + rowdata.jouGuid + '" data-accountbookGuid="' + rowdata.accountbookGuid + '">' + rowdata.jouNo + '</a></span>';
					}
				})
				columns.push({
					title: "凭证字号",
					data: 'vouTypeNameNo',
					className: 'nowrap isprint',
					visible: true
				})
				columns.push({
					title: "摘要",
					data: 'summary',
					className: 'nowrap isprint',
					visible: true
				})
				if (!$.isNull(page.items)) {
					for (var j = 0; j < page.items.length; j++) {
						var item = page.items[j];
						var cbName = item.eleName;
						var cbItem = item.eleCode;
						var cbCode = item.accitemCode;
						if (!$.isNull(cbItem)) {
							columns.push({
								title: cbName,
								data: page.shortLineToTF(cbCode) + 'CodeName', //转为accitemCodeCodeName
								className: 'nowrap',
								width: 240
							});
						}
					}
				}
				columns.push({
					title: "票据类型",
					data: "billtypeCodeName",
					className: 'nowrap isprint',
					visible: true
				})
				columns.push({
					title: "票据号",
					data: "billNo",
					className: 'nowrap isprint',
					visible: true
				})
				columns.push({
					title: "支出类型",
					width: 60,
					data: 'typeName',
					className: 'nowrap isprint'
				});
				columns.push({
					title: "对账类型",
					width: 60,
					data: 'isCheckName',
					className: 'nowrap isprint'
				});
				columns.push({
					title: "经办人",
					data: "dealWith",
					className: 'nowrap isprint',
					visible: true
				});
				columns.push({
					title: "资金类型",
					width: 60,
					data: 'cashTypeName',
					className: 'nowrap isprint'
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
				columns.push({
					title: "借方",
					data: "drMoney",
					className: 'nowrap tr isprint tdNum',
					render: $.fn.dataTable.render.number(',', '.', 2, ''),
					visible: true,
					render: function (data, type, rowdata, meta) {
						var val = $.formatMoney(data);
						return val == 0 ? '' : val;
					}
				})
				columns.push({
					title: "贷方",
					data: 'crMoney',
					className: 'nowrap tr isprint tdNum',
					render: $.fn.dataTable.render.number(',', '.', 2, ''),
					visible: true,
					render: function (data, type, rowdata, meta) {
						var val = $.formatMoney(data);
						return val == 0 ? '' : val;
					}
				})
				columns.push({
					title: "方向",
					data: "drCrName",
					width: 44,
					className: 'tc nowrap isprint',
					visible: true
				})
				columns.push({
					title: "余额",
					data: "accBal",
					className: 'tr nowrap isprint tdNum',
					render: $.fn.dataTable.render.number(',', '.', 2, ''),
					visible: true,
					render: function (data, type, rowdata, meta) {
						var val = $.formatMoney(data);
						return val == 0 ? '' : val;
					}
				})
				var opts = {
					"language": {
						"url": bootPath + "agla-trd/datatables/datatable.default.js"
					},
					"autoWidth": false,
					"bDestory": true,
					"data": [],
					"processing": true, //显示正在加载中
					"pagingType": "full_numbers",
					"pageLength": pageLength,
					"pagingType": "full_numbers", //分页样式
					"lengthChange": true, //是否允许用户自定义显示数量p
					"lengthMenu": [
						[20, 50, 100, 200, 100000],
						[20, 50, 100, 200, "全部"]
					],
					"serverSide": false,
					"ordering": false,
					"columns": columns,
					"dom": '<"datatable-toolbar"B>rt<"' + tableId + '-paginate"ilp>',
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
						$('.datatable-toolbar').appendTo('#dtToolbar');
						var toolBar = $(this).attr('tool-bar')
						var $info = $(toolBar + ' .info');
						if ($info.length == 0) {
							$info = $('<div class="info"></div>').appendTo($(toolBar + ' .tool-bar-body'));
						}
						$info.html('');
						//
						$("#dtToolbar .buttons-print").css("border-radius", "4px 0 0 4px").addClass("btn-print btn-permission").attr({
							"data-toggle": "tooltip",
							"title": "打印"
						});
						//
						$('.btn-print').removeAttr('href')
						$("#dtToolbar .buttons-excel").css("border-radius", "0 4px 4px 0").addClass("btn-export btn-permission").attr({
							"data-toggle": "tooltip",
							"title": "导出"
						});
						$(".btn-print").off().on('click', function () {
							page.pdfData()
						})
						//导出begin
						$("#dtToolbar .buttons-excel").off().on('click', function (evt) {
							evt = evt || window.event;
							evt.preventDefault();
							if (isNeedAcct) {
								var topInfo = [
									['单位：' + agencyCode + ' ' + agencyName],
									['账套：' + acctName],
									['账簿：' + sendObj.accountbookName],
									['日期：' + $("#dateStart").getObj().getValue() + '至' + $("#dateEnd").getObj().getValue()]
								]
							} else {
								var topInfo = [
									['单位：' + agencyCode + ' ' + agencyName],
									['账簿：' + sendObj.accountbookName],
									['日期：' + $("#dateStart").getObj().getValue() + '至' + $("#dateEnd").getObj().getValue()]
								]
							}
							uf.expTable({
								title: '银行日记账',
								exportTable: '#bankTable',
								topInfo: topInfo
							});
						});
						//导出end	
						$('.' + tableId + '-paginate').appendTo($info);
						$('#dtToolbar [data-toggle="tooltip"]').tooltip();
						ufma.setBarPos($(window));
						ufma.isShow(page.reslist);
					},
					fnCreatedRow: function (nRow, aData, iDataIndex) {
						if (!$.isNull(aData)) {
							if (aData.rowType != "0") {
								$(nRow).css({
									"background-color": "#f0f0f0"
								})
							}
						}
					},
					"drawCallback": function (settings) {
						$("#bankTable").find("td.dataTables_empty").text("")
							.append('<img src="' + bootPath + 'images/noData.png"/><br/><i>目前还没有你要查询的数据</i>');

						$(".tableBox").css({
							"overflow-x": "auto"
						});
						ufma.isShow(page.reslist);
						ufma.setBarPos($(window));
					}
				}
				oTable = $("#" + tableId).dataTable(opts);
			},
			loadGridDPE: function () {
				if (oTable) {
					$('#bankTable').closest('.dataTables_wrapper').ufScrollBar('destroy');
					oTable.fnDestroy();
					trd = ''
					trd += '<thead id="bankTableThead">'
					trd += '<tr>'
					trd += '<th rowspan="2">序号</th>'
					trd += '<th colspan="3" rowspan="1" style="width:94px;">日期</th>'
					if (sendObj.isMutinum == "1") {
						trd += '<th rowspan="2">跨账簿单据编号</th>'
					}
					trd += '<th rowspan="2">单据编号 </th>'
					trd += '<th rowspan="2">凭证编号</th>'
					trd += '<th rowspan="2">摘要</th>'
					if (!$.isNull(page.items)) {
						for (var j = 0; j < page.items.length; j++) {
							var item = page.items[j];
							var cbName = item.eleName;
							trd += '<th rowspan="2">' + page.items[j].eleName + '</th>'
						}
					}
					trd += '<th rowspan="2">票据类型</th>'
					trd += '<th rowspan="2">票据号</th>'
					trd += '<th rowspan="2">支出类型</th>'
					trd += '<th rowspan="2">对账类型</th>'
					trd += '<th rowspan="2">经办人</th>'
					trd += '<th rowspan="2">资金类型</th>'
					trd += '<th rowspan="2">是否回单</th>'
					trd += '<th rowspan="2">借方</th>'
					trd += '<th rowspan="2">贷方</th>'
					trd += '<th rowspan="2">方向</th>'
					trd += '<th rowspan="2">余额</th>'
					trd += '</tr>'
					trd += '<tr>'
					trd += '<th colspan="3" class="hidden no-print">序号</th>'
					trd += '<th width="40">年</th>'
					trd += '<th width="40">月</th>'
					trd += '<th width="40">日</th>'
					trd += '</tr>'
					trd += '</thead>'
					if (!$.isNull(page.items)) {
						for (var i = 0; i < page.items.length; i++) {
							page.headtrd += page.items[i].eleName
						}
					}
					$('#bankTable').html('');
					$("#bankTable").html(trd);
					pageLength = ufma.dtPageLength('#bankTable');
				}
				var argu = $('#frmQuery').serializeObject();
				var arguMore = $('#queryMore').serializeObject();
				argu = $.extend(argu, arguMore);
				var isReceipt = $('input:radio[name="isReceipt"]:checked').val();
				var queryItems = {};
				var resultObj = {};
				//bug79453--zsj
				if (!$.isNull(page.items)) {
					for (var j = 0; j < page.items.length; j++) {
						var item = page.items[j];
						var cbName = item.eleName;
						var id = page.shortLineToTF(item.accitemCode) + 'Code';
						var accitemCode = item.accitemCode;
						var stringJson = accitemCode;
						resultObj[accitemCode] = $('#' + id).getObj().getValue();
						queryItems = resultObj;
					}

				} else {
					queryItems = {};
				}
				var vouType = $('#vouType option:selected').val();
				argu.vouType = vouType;
				argu = $.extend(argu, {
					agencyCode: agencyCode,
					accountbookGuid: $('#accBook').getObj().getValue(),
					setYear: ptData.svSetYear,
					rgCode: ptData.svRgCode,
					isReceipt: isReceipt, //是否回单
					startJouDate: $('#dateStart').getObj().getValue(),
					endJouDate: $('#dateEnd').getObj().getValue(),
					queryItems: queryItems
				});
				if (isNeedAcct) {
					argu.acctCode = $('#cbAcct').getObj().getValue();
				}
				ufma.post('/cu/journalDaily/getJournal/', argu, function (result) {
					oTable.fnClearTable();
					if (!$.isNull(result.data) && result.data.length > 0) { //返回数据为数组时判断长度是否为大于0 ，且不为空
						oTable.fnAddData(result.data, true);
					}
					$('#bankTable').closest('.dataTables_wrapper').ufScrollBar({
						hScrollbar: true,
						mousewheel: false
					});
					ufma.setBarPos($(window));
				});
				page.initGridDPE();
			},
			//返回本期时间
			dateBenQi: function (startId, endId) {
				var ddYear = bennian;
				var ddMonth = benqi - 1;
				var tdd = new Date(ddYear, ddMonth + 1, 0)
				var ddDay = tdd.getDate();
				$("#" + startId).getObj().setValue(new Date(ddYear, ddMonth, 1));
				$("#" + endId).getObj().setValue(new Date(ddYear, ddMonth, ddDay));
			},
			//返回本年时间
			dateBenNian: function (startId, endId) {
				var ddYear = bennian;
				$("#" + startId).getObj().setValue(new Date(ddYear, 0, 1));
				$("#" + endId).getObj().setValue(new Date(ddYear, 11, 31));
			},
			//返回今日时间
			dateToday: function (startId, endId) {
				$("#" + startId + ",#" + endId).getObj().setValue(new Date(today));
			},
			onEventListener: function () {
				//搜索
				ufma.searchHideShow($('#bankTable'));
				$("#btnQuery").on('click', function (result) {
					/*bug81043 【20190610 财务云8.0 广东省财政厅】登记出纳账页面的时间选择可以选择例如“2019-06-01”至“2019-03-01”这种错误时间区间而且系统不会提示，该区间查询出来不会显示任何结果--zsj*/
					if ($('#dateStart').getObj().getValue() > $('#dateEnd').getObj().getValue()) {
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
					var accountbookGuid = $('#accBook').getObj().getValue();
					if (!$.isNull(accountbookGuid)) {
						page.loadGridDPE();
					} else {
						ufma.confirm("请选择账簿", function (action) { }, {
							type: 'warning'
						});
					}
					ufma.setBarPos($(window));
				});
				//绑定日历控件
				var bankDate = {
					format: 'yyyy-mm-dd',
					initialDate: new Date()
				};
				$("#dateStart,#dateEnd").ufDatepicker(bankDate);
				page.dateBenNian("dateStart", "dateEnd");
				//选择期间，改变日历控件的值
				$("#dateBq").on("click", function () {
					page.dateBenQi("dateStart", "dateEnd");
				});
				$("#dateBn").on("click", function () {
					page.dateBenNian("dateStart", "dateEnd");
				});
				$(" #dateJr").on("click", function () {
					page.dateToday("dateStart", "dateEnd");
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
				//点击单据编号 跳转登记出纳账界面 guohx 
				$(document).on('click', '.viewData', function (e) {
					var _this = $(this);
					var jouGuid = $(this).attr('data-jouguid');
					var accountbookGuid = $(this).attr('data-accountbookGuid');
					var baseUrl = page.saveruieId('/pf/cu/cuAccBookin/cuAccBookin.html?action=cashDayAccount&menuid=4c4f64f8-e810-46f6-9757-1591c50188f5&jouGuid=' + jouGuid + '&accountbookGuid=' + accountbookGuid);
					uf.openNewPage(page.isCrossDomain, _this, 'openMenu', baseUrl, false, "登记出纳账");
				})
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
			//获取系统选项-各界面需选择账套
			checkNeedAcct: function () {
				//ufma.get("/cu/sysRgpara/getBooleanByChrCode/CU002", {}, function (result) {
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
									$("#accBook").getObj().load(result.data);
									var accountArr = [];
									for (var i = 0; i < result.data.length; i++) {
										accountArr.push(result.data[i].ID);
									}
									for (var i = 0; i < result.data.length; i++) {
										if (sessionAccbook && !$.isNull(sessionAccbook.selAccBookCode) && ($.inArray(sessionAccbook.selAccBookCode, accountArr) > -1)) {
											$('#accBook').getObj().val(sessionAccbook.selAccBookCode);
											break;
										} else {
											$('#accBook').getObj().val(result.data[i].ID);
											flagId = result.data[i].ID
											break;
										}
									}
								}
								ufma.get(url, {
									agencyCode: agencyCode,
									acctCode: acctCode
								}, callback);
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
							$("#accBook").getObj().load(result.data);
							var accountArr = [];
							for (var i = 0; i < result.data.length; i++) {
								accountArr.push(result.data[i].ID);
							}
							for (var i = 0; i < result.data.length; i++) {
								if (sessionAccbook && !$.isNull(sessionAccbook.selAccBookCode) && ($.inArray(sessionAccbook.selAccBookCode, accountArr) > -1)) {
									$('#accBook').getObj().val(sessionAccbook.selAccBookCode);
									break;
								} else {
									$('#accBook').getObj().val(result.data[i].ID);
									flagId = result.data[i].ID
									break;
								}
							}
						}
						ufma.get(url, {
							agencyCode: agencyCode
						}, callback);
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
			reqVouType: function () {
				//凭证类型
				var argu = {
					rgCode: ptData.svRgCode
				};
				ufma.get('/cu/eleVouType/getVouType/' + agencyCode + '/' + ptData.svSetYear + '/' + sendObj.acctCode + '/*', {}, function (result) {
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
			},
			saveruieId: function (url) {
				if (typeof hex_md5 === "function" && ufma.getCommonData().svUserCode != null) {
					if (url.indexOf('?') > 0) {
						url = url + "&rueicode=" + hex_md5(ufma.getCommonData().svUserCode)
					} else {
						url = url + "?rueicode=" + hex_md5(ufma.getCommonData().svUserCode)
					}
				}
				return url
			},
			pdfData: function () {
				var isReceipt = $('input:radio[name="isReceipt"]:checked').val();
				var argu = $('#frmQuery').serializeObject();
				var arguMore = $('#queryMore').serializeObject();
				argu = $.extend(argu, arguMore);
				argu = $.extend(argu, {
					agencyCode: agencyCode,
					accountbookGuid: $('#accBook').getObj().getValue(),
					setYear: ptData.svSetYear,
					rgCode: ptData.svRgCode,
					isReceipt: isReceipt, //是否回单
					startJouDate: $('#dateStart').getObj().getValue(),
					endJouDate: $('#dateEnd').getObj().getValue(),
					recordType: '',
					queryItems: queryItems
				});
				if (isNeedAcct) {
					argu.acctCode = $('#cbAcct').getObj().getValue();
				}
				ufma.ajaxDef('/cu/journalDaily/getJournal/', 'post', argu, function (result) {
					page.printdata = result.data
				});
				var printsdataall = {
					"accitems": page.items,
					"bookData": {
						"ID": accobookData.ID,
						"PID": accobookData.PID,
						"ACCOUNTBOOK_TYPE": accobookData.ACCOUNTBOOK_TYPE,
						'accountbookName': accobookData.accountbookName
					},
					'data': page.printdata
				}
				ufma.post('/cu/journalDaily/getPrintData', printsdataall, function (result) {
					var now = [{}]
					now[0].CU_JOURNAL_DAILY_DATA = result.data[0].CU_JOURNAL_DAILY_DATA
					now[0].CU_JOURNAL_DAILY_HEAD = result.data[1].CU_JOURNAL_DAILY_HEAD
					now[0].CU_BOOK_HEAD = result.data[2].CU_BOOK_HEAD
					now[0].CU_BOOK_HEAD[0].agencyName = agencyName
					now[0].CU_BOOK_HEAD[0].agencyCode = agencyCode
					now[0].CU_BOOK_HEAD[0].conDate = $('#dateStart').getObj().getValue() + ' - ' + $('#dateEnd').getObj().getValue()
					var coster = JSON.stringify(now)
					getPdf('CU_RPT_BANK_DAILYJOURNAL', '*', coster)
				})

			},
			//初始化页面
			initPage: function () {
				page.reslist = ufma.getPermission();
				ufma.isShow(page.reslist);
				page.initAccBook();
				page.initGridDPE();
				page.initAgencyScc();
				$("#minMoney,#maxMoney").amtInputMinus();
			},
			init: function () {
				//获取session
				ptData = ufma.getCommonData();
				this.initPage();
				this.onEventListener();
				ufma.parse();
				ufma.parseScroll();
				window.addEventListener('message', function (e) {
					if (e.data.hasOwnProperty('messageType') && e.data.messageType == 'clientWidth') {
						page.isCrossDomain = true;
					} else {
						page.isCrossDomain = false;
					}
				})
			}
		}
	}();
	page.init();
});