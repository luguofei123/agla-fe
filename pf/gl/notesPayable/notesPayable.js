$(function() {
	//入账设置--凭证模板
	window.openAgy = function(html) {
		var comData = ufma.getCommonData()
		var openData = {
			agencyCode: $("#cbAgency").getObj().getValue(),
			acctCode: $("#cbAcct").getObj().getValue(),
			setYear: comData.svSetYear,
			rgCode: comData.svRgCode,
			//isParallel: $("#cbAcct").getObj().getItem().IS_PARALLEL,
			isParallel: $("#cbAcct").getObj().getItem().isParallel, //多区划
			searchStr: "",
			isChange: true
		};
		ufma.open({
			url: '../vou/vouModelAgy.html',
			title: "凭证模板",
			width: 1090,
			data: openData,
			ondestory: function(result) {
				if(result.action == "ok") {
					page.rzwin.setEditorData(html, result.voutempSendList, result.voutempText); //解决IE11“凭证模板”点击“确定按钮”关闭慢的问题
					//wxframe.window.setEditorData(html, result.voutempSendList, result.voutempText);
				}
			}

		});
	}

	var page = function() {
		var ptData = {};
		var agencyCode = '',
			acctCode = '';
		var oTable;
		return {
			initAgencyScc: function() {
				ufma.showloading('正在加载数据，请耐心等待...');
				//取单位数据
				var arguAge = {
					setYear: ptData.svSetYear,
					rgCode: ptData.svRgCode
				}
				dm.doGet("agency", arguAge, function(result) {
					//dm.doGet("agency","",function (result) {
					$('#cbAgency').ufTreecombox({
						// url: dm.getCtrl('agency'),
						idField: 'id', //可选
						textField: 'codeName', //可选
						pIdField: 'pId', //可选
						readonly: false,
						placeholder: '请选择单位',
						icon: 'icon-unit',
						theme: 'label',
						leafRequire: true,
						data: result.data,
						onChange: function(sender, treeNode) {
							agencyCode = $('#cbAgency').getObj().getValue();
							//缓存单位账套
							var params = {
								selAgecncyCode: agencyCode,
								selAgecncyName: $('#cbAgency').getObj().getText()
							}
							ufma.setSelectedVar(params);
							/*var url = dm.getCtrl('acct') + agencyCode;
							callback = function (result) {
							    $("#cbAcct").getObj().load(result.data);
							}
							ufma.get(url, {}, callback);*/
							var argu = {
								agencyCode: agencyCode,
								setYear: ptData.svSetYear
							}
							var url = dm.getCtrl('acct'); //+ agencyCode;
							callback = function(result) {
								$("#cbAcct").getObj().load(result.data);
							}
							ufma.get(url, argu, callback);
							//票据类型
							var argu = {
								agencyCode: agencyCode,
								setYear: ptData.svSetYear,
								rgCode: ptData.svRgCode,
								eleCode: "BILLTYPE"
							};
							dm.cbbBillType(argu, function(result) {
								$('#billType').ufTreecombox({
									idField: 'code',
									textField: 'codeName',
									pIdField: 'pCode', //可选
									readonly: false,
									placeholder: '请选择票据类型',
									leafRequire: true,
									data: result.data,
									onComplete: function(sender) {
										/*for(var i = 0; i < result.data.length; i++) {
											if(result.data[i].isLeaf == "1") {
												$('#billType').getObj().val(result.data[i].code);
												break;
											}
										}*/

										var timeId = setTimeout(function() {
											$('#btnQuery').trigger('click');
											clearTimeout(timeId);
										}, 300);
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
				});

				//page.cbAgency.select(1);
			},
			initGridDPE: function() {
				columns = [/*{
						title: "序号",
						data: "rowno",
						width: 30,
						className: 'tc isprint'
					},*/
					//bug78303--zsj
					{
						title: "序号",
						data: "rowno",
						className: 'tc nowrap isprint',
						width: 44,
						"render": function(data, type, rowdata, meta) {
							var index = meta.row + 1
							return "<span>" + index + "</span>";
						}
					},
					{
						title: "票据类型",
						data: "billTypeCodeName",
						className: 'tc isprint'
					},
					{
						title: "票据号数",
						data: "billNumber",
						className: 'tc isprint',
						render: function(data, type, rowdata, meta) {
							if(!rowdata.billbookGuid) return '';
							return data + '<span class="row-details icon-angle-bottom fr" dataId="' + rowdata.billbookGuid + '"></span>'
						}
					},
					{
						title: "出票日期",
						data: "billDate",
						className: 'tc isprint'
					},
					{
						title: "到期日",
						data: "expiryDate",
						className: 'tc isprint'
					},
					{
						title: "票面金额",
						data: "billfaceAmount",
						className: 'tc isprint tdNum',
						render: function(data, type, rowdata, meta) {
							var val = $.formatMoney(data);
							return val == '0.00' ? '' : val;
						}
					},
					{
						title: "票面利率(%)",
						data: "billfaceRate",
						className: 'tc isprint'
					},
					{
						title: "交易合同号",
						data: "dealpactNumber",
						className: 'tc isprint'
					},
					{
						title: "收款人",
						data: "acceptAgencyCodeName",
						className: 'tc isprint'
					},
					{
						title: "状态",
						data: "billStatusName",
						className: 'tc isprint'
					},
					{
						title: "操作",
						data: "opt",
						width: 80,
						render: function(data, type, rowdata, meta) {
							if(rowdata.billStatus != '01') {
								return '<a class="btn btn-icon-only btn-sm btn-permission icon-write-off btn-pay" rowindex="' + meta.row + '"data-toggle="tooltip" action= "addlower" title="付款" disabled>' +
									'<a class="btn btn-icon-only btn-sm btn-permission icon-exit btn-refund" rowindex="' + meta.row + '" data-toggle="tooltip" action= "addlower" title="退票" disabled>';
							} else {
								return '<a class="btn btn-icon-only btn-sm btn-permission icon-write-off btn-pay" rowindex="' + meta.row + '"data-toggle="tooltip" action= "addlower" title="付款">' +
									'<a class="btn btn-icon-only btn-sm btn-permission icon-exit btn-refund" rowindex="' + meta.row + '"data-toggle="tooltip" action= "addlower" title="退票">';
							}

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
					"pageLength": 100, //默认每页显示100条--zsj--吉林公安需求
					"serverSide": false,
					"ordering": false,
					columns: columns,
					data: [],
					"dom": '<"datatable-toolbar"B>rt<"' + tableId + '-paginate"ilp>',
					buttons: [{
							extend: 'print',
							text: '<i class="glyphicon icon-print" aria-hidden="true"></i>',
							exportOptions: {
								columns: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
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
								columns: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
							},
							customize: function(xlsx) {
								var sheet = xlsx.xl.worksheets['sheet1.xml'];
							}
						}
					],
					initComplete: function(settings, json) {
						$('.datatable-toolbar').appendTo('#dtToolbar');
						var toolBar = $(this).attr('tool-bar')
						var $info = $(toolBar + ' .info');
						if($info.length == 0) {
							$info = $('<div class="info"></div>').appendTo($(toolBar + ' .tool-bar-body'));
						}
						$info.html('');
						$("#dtToolbar .buttons-print").css("border-radius", "4px 0 0 4px").addClass("btn-print btn-permission").attr({
							"data-toggle": "tooltip",
							"title": "打印"
						});
						$("#dtToolbar .buttons-excel").css("border-radius", "0 4px 4px 0").addClass("btn-export btn-permission").attr({
							"data-toggle": "tooltip",
							"title": "导出"
						});
						//导出begin
						$("#dtToolbar .buttons-excel").off().on('click', function(evt) {
							evt = evt || window.event;
							evt.preventDefault();
							ufma.expXLSForDatatable($('#gridDPE'), '应付票据备查簿');
						});
						//导出end
						$('.' + tableId + '-paginate').appendTo($info);
						ufma.isShow(page.reslist);
					},
					"drawCallback": function(settings) {
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
					rgCode: ptData.svRgCode,
					billBookType: "2"
				});

				dm.loadGridData(argu, function(result) {
					oTable.fnClearTable();
					if(!$.isNull(result.data)) {
						oTable.fnAddData(result.data.list, true);
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
			//下拉明细表格初始化 guohx 
			getDetails: function(dataId) {
				var _dt = $("<table>").addClass('ufma-table').css({
					'border-bottom': "1px #ddd solid;"
				});
				columns = [

					{
						title: "备查类型",
						data: "receivableTypeName"
					},
					{
						title: "业务日期",
						data: "businessDate"
					},
					{
						title: "付款金额",
						data: "payAmount",
						render: function(data, type, rowdata, meta) {
							var val = $.formatMoney(data);
							return val == '0.00' ? '' : val;
						}
					},
					// {
					// 	title: "制证标志",
					// 	data: "signMark"
					// },
					{
						title: "操作人",
						data: "billOperator"
					},
					{
						title: "备注",
						data: "billRemark"
					},
					{
						title: "操作",
						data: "opt",
						width: 110,
						render: function(data, type, rowdata, meta) {
							var btns = '<a class="btn btn-icon-only btn-sm btn-permission icon-edit f16 btn-edit" rowindex="' + meta.row + '" data-toggle="tooltip" title="修改">';
							btns = btns + '<a class="btn btn-icon-only btn-sm btn-permission icon-Certificate f16 btn-makevouc" rowindex="' + meta.row + '" data-toggle="tooltip" title="制证">';
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

					initComplete: function(settings, json) {
						ufma.isShow(page.reslist);
					},
					"drawCallback": function(settings) {
						ufma.isShow(page.reslist);

					},
					fnCreatedRow: function(nRow, aData, iDataIndex) {

					}
				});
				$.data(_dt[0], 'otable', dtTable); //绑定子表数据
				ufma.get(dm.getCtrl('detail'), {
					"billbookGuid": dataId
				}, function(result) {
					dtTable.fnClearTable();
					if(!$.isNull(result.data)) {
						dtTable.fnAddData(result.data, true);
					}
				});
				return dtTable;

			},
			onEventListener: function() {
				//CWYXM-8203--应收票据备查薄进行登记时，票据号数输入负数，能保存成功--经赵雪蕊确定合同号允许输入字母 数字--zsj
				$('#billNumber').on('blur',function(){
					$(this).val($(this).val().replace(/[\W]|_/g,''));
				});
				//入账设置弹框 
				$('#zhangSet').click(function() {
					if($("#cbAcct").getObj().getValue()) {
						//解决IE11“凭证模板”点击“确定按钮”关闭慢的问题
						page.rzwin = ufma.open({
							//ufma.open({
							url: 'payRZnotice/payRZnotice.html',
							title: "入账设置-应付票据",
							width: 600,
							height: 240,
							data: {
								'agencyCode': $("#cbAgency").getObj().getValue(),
								'acctCode': $("#cbAcct").getObj().getValue()
							},
							ondestory: function() {

							}
						});
					} else {
						ufma.showTip('请选择账套！', function() {}, 'warning');
					}
				});
				//登记弹框
				$('#btnAdd').click(function() {
					ufma.open({
						url: 'bookin.html',
						title: '应付票据登记',
						width: 940,
						height: 475,
						data: {
							agencyCode: $("#cbAgency").getObj().getValue(),
							acctCode: $("#cbAcct").getObj().getValue(),
							setYear: ptData.svSetYear,
							rgCode: ptData.svRgCode,
							action: "add"
						},
						ondestory: function(result) {
							if(result.action == 'ok') {
								$('#btnQuery').trigger('click');
							}
						}
					});
				});
				$(document).on('click', function(e) {
					var rowIndex = $(e.target).attr('rowindex');
					if(rowIndex) {
						var rowData = {},
							detailData = {};
						var url = '';
						var title = '';
						if($(e.target).is('.btn-pay')) {
							rowData = oTable.api(false).rows(rowIndex).data()[0];
							rowData = $.extend(true, rowData, {
								action: "add",
								agencyCode: agencyCode
							});
							var title = '应付票据付款';
							url = 'pay.html';
						} else if($(e.target).is('.btn-refund')) {
							rowData = oTable.api(false).rows(rowIndex).data()[0];
							rowData = $.extend(true, rowData, {
								action: "add",
								agencyCode: agencyCode
							});
							var title = '应付票据退票';
							url = 'refund.html';
						} else if($(e.target).is('.btn-edit')) {
							var nTr = $(e.target).closest('tr');
							var pTr = nTr.closest('tr.details').prev();
							rowData = oTable.api(false).row(pTr).data();
							rowData = $.extend(true, rowData, {
								agencyCode: agencyCode
							});
							detailData = $.data($(nTr).closest('.dataTable')[0], 'otable').api(true).rows(rowIndex).data()[0];

							var receivableType = detailData.receivableType;
							if(receivableType == '01') {
								url = 'bookin.html';
								title = '应付票据登记';
							} else if(receivableType == '05') {
								var title = '应付票据付款';
								url = 'pay.html';
							} else if(receivableType == '06') {
								var title = '应付票据退票';
								url = 'refund.html';
							} else {
								ufma.showTip('不支持的业务类型是！', {}, function() {});
								return false;
							}
						} else if($(e.target).is('.btn-delete')) { //删除
							var nTr = $(e.target).closest('tr');
							var pTr = nTr.closest('tr.details').prev();
							rowData = oTable.api(false).row(pTr).data();
							detailData = $.data($(nTr).closest('.dataTable')[0], 'otable').api(true).rows(rowIndex).data()[0];
							ufma.get(dm.getCtrl('delete').replace('{billBookAssId}', detailData.billbookAssGuid), {}, function(result) {
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
							width: 940,
							height: 508,
							data: {
								rowData: rowData,
								detailData: detailData
							},
							ondestory: function(result) {
								if(result.action == 'ok') {
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
					if($('#billStartDate').getObj().getValue() > $('#billEndDate').getObj().getValue()) {
						ufma.showTip('开始日期不能大于结束日期！', function() {}, 'error');
						return false;
					}
					var billfaceStartAmount = $('#billfaceStartAmount').val().replace(/,/g, "");
					var billfaceEndAmount = $('#billfaceEndAmount').val().replace(/,/g, "");
					if(parseFloat(billfaceStartAmount) > parseFloat(billfaceEndAmount)) {
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
					/*idField: 'CHR_CODE',
					textField: 'CODE_NAME',*/
					idField: 'code',
					textField: 'codeName',
					readonly: false,
					placeholder: '请选择账套',
					icon: 'icon-book',
					theme: 'label',
					onChange: function (sender,data) {
						//缓存单位账套
						var params = {
							selAgecncyCode: $('#cbAgency').getObj().getValue(),
							selAgecncyName: $('#cbAgency').getObj().getText(),
							selAcctCode: data.code,
							selAcctName: data.name
						}
						ufma.setSelectedVar(params);

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
				var signInDate = new Date(ptData.svTransDate),
					y = signInDate.getFullYear(),
					m = signInDate.getMonth();
				$('#billStartDate').ufDatepicker({
					format: 'yyyy-mm-dd',
					//viewMode:'month',
					initialDate: new Date(y, m, 1)
				});
				$('#billEndDate').ufDatepicker({
					format: 'yyyy-mm-dd',
					//viewMode:'month',
					initialDate: signInDate
				});
				dm.radioLabelDPEType('#apportionType');
				//$('#billfaceStartAmount,#billfaceEndAmount').amtInput();
				$('#billfaceStartAmount,#billfaceEndAmount').amtInputNull();
				page.initGridDPE();
				//bug79760--zsj--修改将收款人改为和登记界面相同的展示方式
				var argu2 = {
					agencyCode: page.agencyCode,
					setYear: ptData.svSetYear,
					rgCode: ptData.svRgCode,
					eleCode: "CURRENT"
				};
				dm.cbbBillPerson(argu2, function(result) {
					//收款人
					$('#acceptAgency').ufTreecombox({
						idField: 'code',
						textField: 'codeName',
						pIdField: 'pCode', //可选
						readonly: false,
						placeholder: '请选择收款人',
						leafRequire: true,
						data: result.data
					});
				});
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