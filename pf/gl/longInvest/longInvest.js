$(function() {

	var page = function() {
		var ptData = {};
		var agencyCode = '',
			acctCode = '';
		var oTable;
		return {
			initAgencyScc: function() {
				ufma.showloading('正在加载数据，请耐心等待...');
				//取单位数据
				$('#cbAgency').ufTreecombox({
					url: dm.getCtrl('agency') + "?setYear=" + ptData.svSetYear + "&rgCode=" + ptData.svRgCode,
					idField: 'id', //可选
					textField: 'codeName', //可选
					pIdField: 'pId', //可选
					placeholder: '请选择单位',
					icon: 'icon-unit',
					theme: 'label',
					leafRequire: true,
					onChange: function(sender, treeNode) {
						agencyCode = $('#cbAgency').getObj().getValue();
						//缓存单位账套
						var params = {
							selAgecncyCode: treeNode.code,
							selAgecncyName: treeNode.name,
						}
						ufma.setSelectedVar(params);
						//var url = dm.getCtrl('acct') + agencyCode;
						var argu = {
							agencyCode: agencyCode,
							setYear: ptData.svSetYear
						}
						var url = dm.getCtrl('acct');
						callback = function(result) {
							$("#cbAcct").getObj().load(result.data);
						}
			 
						ufma.get(url, argu, callback);
						//被投资类型
						var argu2 = {
							agencyCode: $('#cbAgency').getObj().getValue(),
							setYear: ptData.svSetYear,
							rgCode: ptData.svRgCode,
							eleCode: "CURRENT"
						};
						dm.cbbBillPerson(argu2, function(result) {
							$('#investmentAgency').ufTreecombox({
								idField: 'code',
								textField: 'codeName',
								pIdField: 'pCode', //可选
								leafRequire: true,
								data: result.data,
								onComplete: function(sender) {
									for(var i = 0; i < result.data.length; i++) {
										if(result.data[i].isLeaf == "1") {
											$('#investmentAgency').getObj().val(result.data[i].code);
											break;
										}
									}
								}
							});
						});
					},
					onComplete: function(sender) {
						if(ptData.svAgencyCode) {
							$('#cbAgency').getObj().val(ptData.svAgencyCode);
						} else {
							$('#cbAgency').getObj().val('1');
						}
						ufma.hideloading();
					}
				});
			},
			initGridDPE: function() {
				columns = [{
						title: "序号",
						data: "rowno",
						width: 30,
						className: 'tc'
					},
					{
						title: "被投资单位",
						data: "investmentAgencyName",
						className: "isprint",
						render: function(data, type, rowdata, meta) {
							if(!rowdata.investmentGuid) return '';
							return data + '<span class="row-details icon-angle-bottom fr" dataId="' + rowdata.investmentGuid + '"></span>'
						}
					},{
						title: "社会信用代码",
						data: "investmentCredit",
						className: "isprint"
					},
					{
						title: "投资日期",
						data: "investmentDate",
						className: "isprint"
					},
					{
						title: "投资金额",
						data: "investmentMoney",
						className: 'tr nowrap isprint tdNum',
						render: function(data, type, rowdata, meta) {
							var val = $.formatMoney(data);
							return val == '0.00' ? '' : val;
						}
					},
					{
						title: "持有股份",
						data: "holdShares",
						className: "isprint"
					},
					{
						title: "股份占比",
						data: "shareRatio",
						className: "isprint"

					},
					{
						title: "核算方法",
						data: "accountingMethod",
						className: "isprint"
					},
					{
						title: "备注",
						data: "remark",
						className: "isprint"
					},
					{
						title: "操作",
						data: "opt",
						className: "no-print",
						width: 80,
						render: function(data, type, rowdata, meta) {
							return '<a class="btn btn-icon-only btn-sm btn-permission icon-happen btn-happen " rowindex="' + meta.row + '"data-toggle="tooltip" action= "addlower" title="发生">' +
								'<a class="btn btn-icon-only btn-sm btn-permission icon-compensate btn-makeup" rowindex="' + meta.row + '"data-toggle="tooltip" action= "addlower" title="弥补">';
						}
					}
				];
				var tableId = 'gridDPE';

				oTable = $("#" + tableId).dataTable({
					"language": {
						"url": bootPath + "agla-trd/datatables/datatable.default.js"
					},
					"autoWidth": false,
					"bDestory": true,
					"processing": true, //显示正在加载中
					"pagingType": "full_numbers", //分页样式
					"lengthChange": true, //是否允许用户自定义显示数量p
					"lengthMenu": [
						[10, 20, 50, 100, 200, -1],
						[10, 20, 50, 100, 200, "全部"]
					],
					"pageLength": 100,//默认每页显示100条--zsj--吉林公安需求
					"serverSide": false,
					"ordering": false,
					columns: columns,
					data: [],
					"dom": '<"datatable-toolbar"B>rt<"' + tableId + '-paginate"ilp>',
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
					initComplete: function(settings, json) {
						$("#dtToolbar .buttons-print").css("border-radius", "4px 0 0 4px").addClass("btn-print btn-permission").attr({
							"data-toggle": "tooltip",
							"title": "打印"
						});
						$("#dtToolbar .buttons-excel").css("border-radius", "0 4px 4px 0").addClass("btn-export btn-permission").attr({
							"data-toggle": "tooltip",
							"title": "导出"
						});
						$('.datatable-toolbar').appendTo('#dtToolbar');
						var toolBar = $(this).attr('tool-bar')
						var $info = $(toolBar + ' .info');
						if($info.length == 0) {
							$info = $('<div class="info"></div>').appendTo($(toolBar + ' .tool-bar-body'));
						}
						$info.html('');
						$('.' + tableId + '-paginate').appendTo($info);
						$('[data-toggle="tooltip"]').tooltip();
						ufma.isShow(page.reslist);
						//导出begin
						$("#dtToolbar .buttons-excel").off().on('click', function(evt) {
							evt = evt || window.event;
							evt.preventDefault();
							ufma.expXLSForDatatable($('#gridDPE'), '长期股权投资备查簿');
						});
						//导出end
					},
					"drawCallback": function(settings) {
						$('#gridDPE').find("td.dataTables_empty").text("")
							.append('<img class="no-print" src="' + bootPath + 'images/noData.png"/><br/><i>目前还没有你要查询的数据</i>');
						$(".tableBox").css({
							"overflow-x": "scroll"
						});
						ufma.isShow(page.reslist);
					},
					fnCreatedRow: function(nRow, aData, iDataIndex) {
						$('td:eq(0)', nRow).html(iDataIndex + 1);
					}
				});
			},
			loadGridDPE: function() {

				var argu = $('#frmQuery').serializeObject();
				argu = $.extend(argu, {
					agencyCode: $('#cbAgency').getObj().getValue(),
					acctCode: $('#cbAcct').getObj().getValue(),
					setYear: ptData.svSetYear,
					rgCode: ptData.svRgCode
				});
				dm.loadGridData(argu, function(result) {
					oTable.fnClearTable();
					if(!$.isNull(result.data) && result.data.length > 0) {
						oTable.fnAddData(result.data, true);
					}
					$('#gridDPE').closest('.dataTables_wrapper').ufScrollBar({ //浮动滚动条
						hScrollbar: true,
						mousewheel: false
					});
					ufma.setBarPos($(window));
					$('#gridDPE').fixedColumns({
						rightColumns: 1
					});
				});
			},
			// //下拉明细表格初始化 guohx 
			getDetails: function(dataId) {
				var _dt = $("<table>").addClass('ufma-table').css({
					'border-bottom': "1px #ddd solid;"
				});
				columns = [

					{
						title: "备查类型",
						data: "businessTypeName"
					},
					{
						title: "业务日期",
						data: "investmentDate"
					},
					{
						title: "金额",
						data: "investmentMoney",
						render: function(data, type, rowdata, meta) {
							var val = $.formatMoney(data);
							return val == '0.00' ? '' : val;
						}
					},
					{
						title: "操作",
						data: "opt",
						width: 110,
						render: function(data, type, rowdata, meta) {
							var btns = '<a class="btn btn-icon-only btn-sm btn-permission icon-edit f16 btn-edit" rowindex="' + meta.row + '" data-toggle="tooltip" title="修改">';
							// btns = btns + '<a class="btn btn-icon-only btn-sm btn-permission icon-Certificate f16 btn-makevouc" rowindex="' + meta.row + '" data-toggle="tooltip" title="制证">';
							btns = btns + '<a class="btn btn-icon-only btn-sm btn-permission icon-trash f16 btn-delete" rowindex="' + meta.row + '" data-toggle="tooltip" title="删除">';
							return btns;
						}
					}
				];
				var dtTable = $(_dt).dataTable({
					"language": {
						"url": bootPath + "agla-trd/datatables/datatable.default.js"
					},
					"autoWidth": false,
					"bDestory": true,
					"processing": true, //显示正在加载中
					"paging": false, //分页样式
					searching: false,
					"serverSide": false,
					"ordering": false,
					"bInfo": false,
					columns: columns,
					data: [],

					initComplete: function(settings, json) {},
					"drawCallback": function(settings) {
					$('#gridDPE').find("td.dataTables_empty").text("")
							.append('<img class="no-print" src="' + bootPath + 'images/noData.png"/><br/><i>目前还没有你要查询的数据</i>');
						$(".tableBox").css({
							"overflow-x": "scroll"
						});
						ufma.isShow(page.reslist);
					},
					fnCreatedRow: function(nRow, aData, iDataIndex) {

					}
				});
				$.data(_dt[0], 'otable', dtTable); //绑定子表数据
				ufma.get(dm.getCtrl('detail').replace('{investmentGuid}', dataId), {}, function(result) {
					dtTable.fnClearTable();
					if(!$.isNull(result.data)) {
						dtTable.fnAddData(result.data, true);
					}
				});
				return dtTable;

			},
			onEventListener: function() {
				$('#btnAdd').click(function() {
					ufma.open({
						url: 'bookin.html',
						title: '长期股权投资登记',
						width: 790,
						height: 490,
						data: {
							agencyCode: $("#cbAgency").getObj().getValue(),
							acctCode: $("#cbAcct").getObj().getValue(),
							setYear: ptData.svSetYear,
							rgCode: ptData.svRgCode,
							action: "add",
							dateTime:ptData.svTransDate
						},
						ondestory: function(action) {
							if(action) {
								$('#btnQuery').trigger('click');
							}
						}
					});
				});
				$(document).on('click', function(e) {
					var rowIndex = $(e.target).attr('rowindex');
					if(rowIndex) {
						var nTr = $(e.target).parents('tr')[0];
						var rowData = {},
							detailData = {};
						var url = '';
						var title = '';
						if($(e.target).is('.btn-happen')) {
							rowData = oTable.api(false).rows(rowIndex).data()[0];
							rowData = $.extend(true, rowData, {
								action: "add",
								agencyCode: agencyCode
							});
							var title = '未确认亏损发生';
							url = 'loss.html';
						} else if($(e.target).is('.btn-makeup')) {
							rowData = oTable.api(false).rows(rowIndex).data()[0];
							rowData = $.extend(true, rowData, {
								action: "add",
								agencyCode: agencyCode
							});
							var title = '未确认亏损弥补';
							url = 'makeup.html';
						} else if($(e.target).is('.icon-edit')) {
							var nTr = $(e.target).closest('tr');
							var pTr = nTr.closest('tr.details').prev();
							rowData = oTable.api(false).row(pTr).data();
							rowData = $.extend(true, rowData, {
								agencyCode: agencyCode,
								action: "edit"
							});
							detailData = $.data($(nTr).closest('.dataTable')[0], 'otable').api(true).rows(rowIndex).data()[0];
							var businessType = detailData.businessType;
							if(businessType == '01') {
								url = 'bookin.html';
								title = '长期股权投资登记';
							} else if(businessType == '02') {
								var title = '未确认亏损发生';
								url = 'loss.html';
							} else if(businessType == '03') {
								var title = '未确认亏损弥补';
								url = 'makeup.html';
							} else {
								ufma.showTip('不支持的业务类型是！', {}, function() {});
								return false;
							}
						} else if($(e.target).is('.icon-trash')) { //删除
							rowData = $.data($(nTr).closest('.dataTable')[0], 'otable').api(true).row(nTr).data();
							detailData = $.data($(nTr).closest('.dataTable')[0], 'otable').api(true).rows(rowIndex).data()[0];
							ufma.delete(dm.getCtrl('delete').replace('{detailGuid}', rowData.detailGuid), {}, function(result) {
								ufma.showTip('删除成功', function() {
									$('#btnQuery').trigger('click');
								}, 'success');
								return false;
							});
							return false;
						} else if($(e.target).is('.btn-makevouc')) {
							ufma.showTip('开发中...');
							return false;
						} else {
							return false;
						}
						ufma.open({
							url: url,
							title: title,
							width: 790,
							height: 558,
							data: {
								rowData: rowData,
								detailData: detailData
							},
							ondestory: function(action) {
								if(action) {
									$('#btnQuery').trigger('click');
								}
							}
						});
					}
				});
				$('.ufma-table').on('click', ' tbody td .row-details', function() {
					var nTr = $(this).parents('tr')[0];
					if(oTable.fnIsOpen(nTr)) //判断是否已打开            
					{
						$(nTr).find('td:last-child').attr('rowspan', '1');
						oTable.fnClose(nTr);
						$(this).addClass("icon-angle-bottom").removeClass("icon-angle-top");

					} else {
						$(this).addClass("icon-angle-top").removeClass("icon-angle-bottom");
						var shtml = page.getDetails($(this).attr("dataId"));
						var dtTr = oTable.fnOpen(nTr, shtml, 'details');
						$(nTr).find('td:last-child').attr('rowspan', '2');
						$(dtTr).find('td:eq(0)').attr('colspan', $(nTr).find('td').length - 1);

					}
					var timeId = setTimeout(function() {
						ufma.setBarPos($(window));
						$('#gridDPE').fixedColumns({
							rightColumns: 1
						});
						clearTimeout(timeId);
					}, 300);
				});
				$('#btnQuery').click(function() {
					if($('#minInvestmentDate').getObj().getValue() > $('#maxInvestmentDate').getObj().getValue()) {
						ufma.showTip('开始日期不能大于结束日期！', function() {}, 'error');
						return false;
					}
					var minInvestmentMoney = $('#minInvestmentMoney').val().replace(/,/g, "");
					var maxInvestmentMoney = $('#maxInvestmentMoney').val().replace(/,/g, "");
					if(parseFloat(minInvestmentMoney)> parseFloat(maxInvestmentMoney)) {
						ufma.showTip('开始金额不能大于结束金额！', function() {}, 'error');
						return false;
					}
					page.loadGridDPE();
				});
			},
			//初始化页面
			initPage: function() {
				page.reslist = ufma.getPermission();
				ufma.isShow(page.reslist);
				$("#cbAcct").ufCombox({
					idField: 'code',
					textField: 'codeName',
					placeholder: '请选择账套',
					icon: 'icon-book',
					theme: 'label',
					onChange: function(sender,data) {
						//缓存单位账套
						var params = {
							selAgecncyCode: $('#cbAgency').getObj().getValue(),
							selAgecncyName: $('#cbAgency').getObj().getText(),
							selAcctCode: data.code,
							selAcctName: data.name
						}
						ufma.setSelectedVar(params);
						$('#btnQuery').trigger('click');
					},
					onComplete: function(sender) {
						if(ptData.svAcctCode) {
							$("#cbAcct").getObj().val(ptData.svAcctCode);
						} else {
							$('#cbAcct').getObj().val('1');
						}
						ufma.hideloading();
					}
				});

				this.initAgencyScc();
				/////////////
				$('.uf-datepicker').ufDatepicker({
					format: 'yyyy-mm-dd',
					//viewMode:'month',
					initialDate: new Date(ptData.svTransDate) //bug79087--zsj
				});
				dm.radioLabelDPEType('#apportionType');
				//$('#minInvestmentMoney,#maxInvestmentMoney').amtInput();
				$('#minInvestmentMoney,#maxInvestmentMoney').amtInputNull();
				page.initGridDPE();

			},

			init: function() {
				//获取session
				ptData = ufma.getCommonData();
				this.initPage();
				this.onEventListener();
				ufma.parse();
				ufma.parseScroll();
			}
		}
	}();

	page.init();
});