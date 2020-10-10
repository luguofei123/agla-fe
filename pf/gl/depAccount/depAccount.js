$(function() {
	//入账设置--凭证模板
	window.openAgy = function(html) {
		var comData = ufma.getCommonData()
		var openData = {
			agencyCode: $("#cbAgency").getObj().getValue(),
			acctCode: $("#cbAcct").getObj().getValue(),
			setYear: comData.svSetYear,
			rgCode: comData.svRgCode,
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
	window.isupdate = 0
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
								selAgecncyCode: treeNode.code,
								selAgecncyName: treeNode.name,
							}
							ufma.setSelectedVar(params);
							var url = '/gl/eleCoacc/getRptAccts';
							callback = function(result) {
								$("#cbAcct").getObj().load(result.data);
							}
							ufma.get(url, {
								'userId': ptData.svUserId,
								'setYear': ptData.svSetYear,
								'agencyCode': agencyCode
							}, callback);
							//票据类型
							var argu = {
								agencyCode: agencyCode,
								setYear: ptData.svSetYear,
								rgCode: ptData.svRgCode,
								eleCode: "BILLTYPE"
							};
							dm.cbbBillType(argu, function(result) {
								$('#billtypeCode').ufTreecombox({
									idField: 'code',
									textField: 'codeName',
									pIdField: 'pCode', //可选
									readonly: false,
									placeholder: '请选择票据类型',
									leafRequire: true,
									data: result.data,
									onComplete: function(sender) {
										/*var timeId = setTimeout(function() {
											$('#btnQuery').trigger('click');
											clearTimeout(timeId);
										}, 300);*/
									},
									onChange: function(data) {
										$('#btnQuery').trigger('click');
									},
								});
								//$('#billtypeCode').getObj().val('001');
							});
							//往来单位
							var argu2 = {
								agencyCode: agencyCode,
								setYear: ptData.svSetYear,
								rgCode: ptData.svRgCode,
								eleCode: "CURRENT"
							};
							dm.cbbCurrent(argu2, function(result) {
								$('#currentCode').ufTreecombox({
									idField: 'code',
									textField: 'codeName',
									pIdField: 'pCode', //可选
									readonly: false,
									placeholder: '请选择往来单位',
									leafRequire: true,
									data: result.data,
									onComplete: function(sender) {
										/*var timeId = setTimeout(function() {
											$('#btnQuery').trigger('click');
											clearTimeout(timeId);
										}, 300);*/
									},
									onChange: function(data) {
										$('#btnQuery').trigger('click');
									},
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
				})

				//page.cbAgency.select(1);
			},
			initGridDPE: function() {
				var tableId = 'gridDPE';
				var columns = [
					/*{
										title: "序号",
										data: "rowno",
										width: 30,
										className: 'tc nowrap'
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
						title: "发生日期",
						data: "occurDate",
						className: 'nowrap isprint'
					},
					{
						title: "往来单位",
						data: "currentName",
						className: 'nowrap isprint',
						render: function(data, type, rowdata, meta) {
							if(!rowdata.guid) return '';
							return data + '<span class="row-details icon-angle-bottom fr" dataId="' + rowdata.guid + '"></span>'
						}
					},
					{
						title: "票据类型",
						data: "billtypeName",
						className: 'nowrap isprint'
					},
					{
						title: "票据号",
						data: "billNo",
						className: 'nowrap isprint'
					},
					{
						title: "预收金额",
						data: "depositMoney",
						className: 'tr nowrap isprint tdNum',
						render: function(data, type, rowdata, meta) {
							var val = $.formatMoney(data);
							return val == '0.00' ? '' : val;
						}
					},
					{
						title: "核销金额",
						data: "cancelMoney",
						className: 'tr nowrap isprint tdNum',
						render: function(data, type, rowdata, meta) {
							var val = $.formatMoney(data);
							return val == '0.00' ? '' : val;
						}
					},
					{
						title: "状态",
						data: "statusName",
						className: 'nowrap isprint'
					},
					{
						title: "操作",
						data: "opt nowrap",
						width: 60,
						className: 'tc nowrap ',
						render: function(data, type, rowdata, meta) {
							if(rowdata.status == '02') {
								return '<a class="btn btn-icon-only btn-sm btn-permission btn-hx icon-write-off btn-cancel" rowindex="' + meta.row + '" data-toggle="tooltip" action= "addlower" title="核销" disabled>';
							}
							return '<a class="btn btn-icon-only btn-sm btn-permission btn-hx icon-write-off btn-cancel" rowindex="' + meta.row + '" data-toggle="tooltip" action= "addlower" title="核销">';
						}
					}
				];

				var opts = {
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
								columns: [0, 1, 2, 3, 4, 5, 6, 7, 8]
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
								columns: [0, 1, 2, 3, 4, 5, 6, 7, 8]
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
						$('.' + tableId + '-paginate').appendTo($info);
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
							ufma.expXLSForDatatable($('#gridDPE'), '预收账款备查簿');
						});
						//导出end
						$('[data-toggle="tooltip"]').tooltip();
						ufma.isShow(page.reslist);
					},
					"drawCallback": function(settings) {
						ufma.isShow(page.reslist);

					},
					//bug78303--zsj
					fnCreatedRow: function(nRow, aData, iDataIndex) {
						$('td:eq(0)', nRow).html(iDataIndex + 1);
					}
				}
				oTable = $("#" + tableId).dataTable(opts);
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
					if(result.data.length > 0) {
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
			//下拉明细表格初始化 guohx 
			getDetails: function(dataId) {
				var _dt = $("<table>").addClass('ufma-table').css({
					'border-bottom': "1px #ddd solid;"
				});
				columns = [

					{
						title: "备查类型",
						data: "cbTypeName",
						className: 'tr isprint'
					},
					{
						title: "业务日期",
						data: "occurDate",
						className: 'tr isprint'
					},
					{
						title: "操作人",
						data: "latestOpUser",
						className: 'tr isprint'
					},
					{
						title: "金额",
						data: "money",
						className: 'tr isprint tdNum',
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
						title: "备注",
						data: "remark",
						className: 'tr isprint',
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

					},
					"drawCallback": function(settings) {
						ufma.isShow(page.reslist);

					},
					fnCreatedRow: function(nRow, aData, iDataIndex) {

					}
				});
				$.data(_dt[0], 'otable', dtTable); //绑定子表数据
				var argu = {};
				argu.agencyCode = $("#cbAgency").getObj().getValue();
				argu.acctCode = $("#cbAcct").getObj().getValue();
				argu.setYear = ptData.svSetYear;
				argu.rgCode = ptData.svRgCode;
				argu.depositGuid = dataId;
				ufma.get(dm.getCtrl('detail'), argu, function(result) {
					dtTable.fnClearTable();
					if(!$.isNull(result.data)) {
						var tempData = result.data;
						for(var i = 0; i < tempData.length; i++) {
							if(!$.isNull(tempData[i].createDate)) {
								tempData[i].createDate = tempData[i].createDate.substring(0, 10);
							}
						}
						dtTable.fnAddData(tempData, true);
					}
				});
				return dtTable;

			},
			onEventListener: function() {
				$('#btnAdd').click(function() {
					ufma.open({
						url: 'bookin.html',
						title: '预收账款登记',
						width: 726,
						height: 370,
						data: {
							agencyCode: $("#cbAgency").getObj().getValue(),
							acctCode: $("#cbAcct").getObj().getValue(),
							setYear: ptData.svSetYear,
							rgCode: ptData.svRgCode,
							action: "add"
						},
						ondestory: function(result) {
							if(result.action == 'ok' || window.isupdate == 1) {
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
						var width = '';
						var height = '';
						if($(e.target).is('.btn-cancel')) {
							rowData = oTable.api(false).rows(rowIndex).data()[0];
							rowData = $.extend(true, rowData, {
								action: "add",
								agencyCode: agencyCode
							});
							var title = '预收账款核销';
							url = 'cancel.html';
							width = '900';
							height = '508';
						} else if($(e.target).is('.btn-edit')) {
							var nTr = $(e.target).closest('tr');
							var pTr = nTr.closest('tr.details').prev();
							rowData = oTable.api(false).row(pTr).data();
							rowData = $.extend(true, rowData, {
								agencyCode: agencyCode
							});
							detailData = $.data($(nTr).closest('.dataTable')[0], 'otable').api(true).rows(rowIndex).data()[0];
							var cbType = detailData.cbType;
							if(cbType == '01') {
								url = 'bookin.html';
								title = '预收账款登记';
								width = '726';
								height = '370';
							} else if(cbType == '02') {
								var title = '预收账款核销';
								url = 'cancel.html';
								width = '900';
								height = '508';
							}
						} else if($(e.target).is('.btn-delete')) { //删除
							var nTr = $(e.target).closest('tr');
							var pTr = nTr.closest('tr.details').prev();
							rowData = oTable.api(false).row(pTr).data();
							detailData = $.data($(nTr).closest('.dataTable')[0], 'otable').api(true).rows(rowIndex).data()[0];
							dm.doPost('delete', {
								depositGuid: rowData.guid,
								guid: detailData.guid,
								cbType: detailData.cbType
							}, function(result) {
								ufma.showTip('删除成功', function() {
									$('#btnQuery').trigger('click');
								}, 'success');
								return false;
							});
							return false;
						} else if($(e.target).is('.btn-makevouc')) {
							ufma.showTip('开发中...', function() {}, 'warning');
							return false;
						} else {
							return false;
						}
						ufma.open({
							url: url,
							title: title,
							width: width,
							height: height,
							data: {
								rowData: rowData,
								detailData: detailData
							},
							ondestory: function(action) {
								$('#btnQuery').trigger('click');
							}
						});
					}
				});
				///////////////
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
					if($('#startOccurDate').getObj().getValue() > $('#endOccurDate').getObj().getValue()) {
						ufma.showTip('开始日期不能大于结束日期！', function() {}, 'error');
						return false;
					}
					var minDepositMoney = $('#minDepositMoney').val().replace(/,/g, "");
					var maxDepositMoney = $('#maxDepositMoney').val().replace(/,/g, "");
					if(parseFloat(minDepositMoney) > parseFloat(maxDepositMoney)) {
						ufma.showTip('开始金额不能大于结束金额！', function() {}, 'error');
						return false;
					}
					page.loadGridDPE();
				});
				//入账设置保存  
				$('#zhangSet').click(function() {
					if($("#cbAcct").getObj().getValue()) {
						//解决IE11“凭证模板”点击“确定按钮”关闭慢的问题
						page.rzwin = ufma.open({
							//ufma.open({
							url: 'preNotice/preNotice.html',
							title: "入账设置-预收账款",
							width: 600,
							height: 210,
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
			},
			//初始化页面
			initPage: function() {
				page.reslist = ufma.getPermission();
				ufma.isShow(page.reslist);
				$("#cbAcct").ufCombox({
					idField: 'code',
					textField: 'codeName',
					readonly: false,
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
				var signInDate = new Date(ptData.svTransDate),
					y = signInDate.getFullYear(),
					m = signInDate.getMonth();
				$('#startOccurDate').ufDatepicker({
					format: 'yyyy-mm-dd',
					//viewMode:'month',
					initialDate: new Date(y, m, 1)
				});
				$('#endOccurDate').ufDatepicker({
					format: 'yyyy-mm-dd',
					//viewMode:'month',
					initialDate: signInDate
				});
				dm.radioLabelDPEType('#apportionType');
				//$('#minDepositMoney,#maxDepositMoney').amtInput();
				$('#minDepositMoney,#maxDepositMoney').amtInputNull();
				$('#billNo').intInput();
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