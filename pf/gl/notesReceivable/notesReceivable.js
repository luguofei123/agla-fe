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
			acctCode = '',
			isParallel = '';
		var oTable;
		return {
			//初始化单位
			initAgencyScc: function() {
				ufma.showloading('正在加载数据，请耐心等待...');
				//取单位数据
				var arguAge = {
					setYear: ptData.svSetYear,
					rgCode: ptData.svRgCode
				}
				dm.doGet("agency", arguAge, function(result) {
					//dm.doGet("agency", "", function(result) {
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
							agencyName = $('#cbAgency').getObj().getValue();
							//缓存单位账套
							var params = {
								selAgecncyCode: agencyCode,
								selAgecncyName: agencyName
							}
							ufma.setSelectedVar(params);
							page.agencyCode = agencyCode;
							setYear = ptData.svSetYear;
							//多区划
							var argu = {
								agencyCode: agencyCode,
								setYear: ptData.svSetYear
							}
							var url = dm.getCtrl('acct'); //+ agencyCode;
							callback = function(result) {
								$("#cbAcct").getObj().load(result.data);
							}
							ufma.get(url, argu, callback);

							//承兑单位
							var argu = {
								agencyCode: agencyCode,
								setYear: ptData.svSetYear,
								rgCode: ptData.svRgCode,
								eleCode: "CURRENT"
							};
							dm.acceptAgency(argu, function(result) {
								$('#acceptAgency').getObj().load(result.data);
								$('#payerAgency').getObj().load(result.data);
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
			//初始化账套
			initAcct: function() {
				$("#cbAcct").ufCombox({
					idField: 'code', //多区划
					textField: 'codeName',
					readonly: false,
					placeholder: '请选择账套',
					icon: 'icon-book',
					theme: 'label',
					onChange: function(sender, data) {
						//票据类型
						var argu = {
							agencyCode: page.agencyCode,
							setYear: ptData.svSetYear,
							rgCode: ptData.svRgCode,
							eleCode: "BILLTYPE"
						};
						dm.acceptAgency(argu, function(result) {
							$('#billType').getObj().load(result.data);
							$('#btnQuery').trigger('click');
						});
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
			},
			//初始化票据类型
			initBillType: function() {
				$('#billType').ufTreecombox({
					idField: 'code',
					textField: 'codeName',
					readonly: false,
					pIdField: 'pCode', //可选
					placeholder: '请选择票据类型',
					leafRequire: true
				});
			},
			//付款单位
			initPayerAgency: function() {
				$('#payerAgency').ufTreecombox({
					idField: 'code',
					textField: 'codeName',
					pIdField: 'pCode', //可选
					readonly: false,
					placeholder: '请选择付款单位',
					leafRequire: true
				});
			},
			//承兑单位
			initAcceptAgency: function() {
				$('#acceptAgency').ufTreecombox({
					idField: 'code',
					textField: 'codeName',
					pIdField: 'pCode', //可选
					readonly: false,
					placeholder: '请选择承兑单位',
					leafRequire: true
				});
			},
			//初始化主表
			initMainTable: function() {
				var columns = [
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
						className: 'nowrap isprint',
						render: function(data, type, rowdata, meta) {
							return(data ? data : "") + '<span class="row-details icon-angle-bottom" data-id="' + rowdata.billbookGuid + '"></span>'
						}
					},
					{
						title: "票据号数",
						data: "billNumber",
						className: 'nowrap isprint'
					},
					{
						title: "出票人",
						data: "billPersonCodeName",
						className: 'nowrap isprint'
					},
					{
						title: "出票日期",
						data: "billDate",
						className: 'nowrap isprint',
						width: 160
					},
					{
						title: "到期日期",
						data: "expiryDate",
						className: 'nowrap isprint',
						width: 160
					},
					{
						title: "票面金额",
						data: "billfaceAmount",
						className: 'nowrap isprint tdNum',
						width: 160,
						render: function(data, type, rowdata, meta) {
							var val = $.formatMoney(data);
							return '<div style="text-align: right">' + (val == '0.00' ? '' : val) + '</div>'

						}
					},
					{
						title: "票面利率(%)",
						data: "billfaceRate",
						className: 'nowrap isprint',
						render: function(data, type, rowdata, meta) {
							return '<div style="text-align: right">' + (data ? data : "") + '</div>'

						}
					},
					{
						title: "交易合同号",
						data: "dealpactNumber",
						className: 'nowrap isprint',
						width: 160
					},
					{
						title: "付款单位",
						data: "payerAgencyCodeName",
						className: 'nowrap isprint'
					},
					{
						title: "承兑单位",
						data: "acceptAgencyCodeName",
						className: 'nowrap isprint'
					},

					{
						title: "状态",
						data: "billStatusName",
						className: 'nowrap isprint',
						width: 80
					},
					{
						title: "操作",
						data: "opt",
						className: 'nowrap',
						width: 200,
						render: function(data, type, rowdata, meta) {
							//如果数据的billStatus不为01，背书、贴现、收款、退票的按钮都不能点
							var dis = false;
							if(rowdata.billStatus != '01') {
								dis = true;
							}
							return '<a ' + (dis ? "disabled" : "") + ' class="btn btn-icon-only btn-sm btn-permission icon-endorsement btn-beishu" rowindex="' + meta.row + '" data-toggle="tooltip" action= "addlower" title="背书">' +
								'<a ' + (dis ? "disabled" : "") + ' class="btn btn-icon-only btn-sm btn-permission icon-discount btn-tiexian" rowindex="' + meta.row + '" data-toggle="tooltip" action= "addlower" title="贴现">' +
								'<a ' + (dis ? "disabled" : "") + ' class="btn btn-icon-only btn-sm btn-permission icon-Receipt btn-shoukuan" rowindex="' + meta.row + '" data-toggle="tooltip" action= "addlower" title="收款">' +
								'<a ' + (dis ? "disabled" : "") + ' class="btn btn-icon-only btn-sm btn-permission icon-refund btn-refund" rowindex="' + meta.row + '" data-toggle="tooltip" action= "addlower" title="退票">';
						}
					}
				];
				var tableId = 'gridNotes';

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
					// "dom": 'rt<"' + tableId + '-paginate"ilp>',
					"dom": '<"datatable-toolbar"B>rt<"' + tableId + '-paginate"ilp>',
					buttons: [{
							extend: 'print',
							text: '<i class="glyphicon icon-print" aria-hidden="true"></i>',
							exportOptions: {
								columns: [0,1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
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
								columns: [0,1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
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
						ufma.isShow(page.reslist);
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
							ufma.expXLSForDatatable($('#gridNotes'), '应收票据备查簿');
						});
						//导出end

					},
					"drawCallback": function(settings) {
						ufma.isShow(page.reslist);
					}/*,
					fnCreatedRow: function(nRow, aData, iDataIndex) {
						$('td:eq(0)', nRow).html(iDataIndex + 1);
					}*/
				});
			},
			//条件查询
			loadMainTable: function() {

				var argu = $('#frmQuery').serializeObject();
				argu = $.extend(argu, {
					agencyCode: $('#cbAgency').getObj().getValue(),
					acctCode: $('#cbAcct').getObj().getValue(),
					setYear: ptData.svSetYear,
					rgCode: ptData.svRgCode,
					billBookType: 1
				});

				dm.loadGridData(argu, function(result) {
					// if(result.msg){
					//     ufma.showTip(result.msg,function () {
					//
					//     },result.flag);
					// }

					oTable.fnClearTable();
					if(result.data) {
						oTable.fnAddData(result.data.list, true);
					}

					//表格模拟滚动条
					$('#gridNotes').closest('.dataTables_wrapper').ufScrollBar({
						hScrollbar: true,
						mousewheel: false
					});
					ufma.setBarPos($(window));
					$("#gridNotes").fixedColumns({
						rightColumns: 1, //锁定右侧一列
						// leftColumns: 1//锁定左侧一列
					});
				});
			},
			//load子表
			getDetails: function(dataId, nTr) {
				var _dt = $("<table>").addClass('ufma-table').css({
					'border-bottom': "1px #ddd solid;"
				});

				//获取子表数据
				var argu = {
					billbookGuid: dataId
				};
				dm.loadGridDataDetail(argu, function(result) {
					var data = result.data;
					var columns = [{
							title: "票据号数",
							data: "billNumber",
							className: 'nowrap'
						},

						{
							title: "备查类型",
							data: "receivableTypeName",
							className: 'nowrap'
						},
						{
							title: "业务日期",
							data: "businessDate",
							className: 'nowrap'
						},
						{
							title: "操作人",
							data: "billOperator",
							className: 'nowrap'
						},
						{
							title: "背书人",
							data: "billEndorsor",
							className: 'nowrap'
						},
						{
							title: "被背书人",
							data: "billEndorsee",
							className: 'nowrap'
						},
						{
							title: "贴现率(%)",
							data: "discountRate",
							className: 'nowrap',
							render: function(data, type, rowdata, meta) {
								return '<div style="text-align: right">' + (data ? data : "") + '</div>'
							}
						},
						{
							title: "金额",
							data: "discountAmount",
							className: 'nowrap',
							render: function(data, type, rowdata, meta) {
								var val = $.formatMoney(data);
								return '<div style="text-align: right">' + (val == '0.00' ? '' : val) + '</div>'
							}
						},
						{
							title: "制证标志",
							data: "signMark",
							className: 'nowrap'
						},

						{
							title: "备注",
							data: "billRemark",
							className: 'nowrap'
						},
						{
							title: "操作",
							data: "opt",
							width: 80,
							className: 'nowrap',
							render: function(data, type, rowdata, meta) {
								var dis = false;
								if(rowdata.receivableType == "01" && result.data.length > 1) {
									dis = true;
								}
								page.formEnable = dis;
								return '<div class="opt-box" billbookAssGuid = ' + rowdata.billbookAssGuid + ' billbookGuid = "' + rowdata.billbookGuid + '" receivableType = "' + rowdata.receivableType + '"> ' +
									'<a data-edit="' + dis + '" class="btn btn-icon-only btn-sm btn-permission btn-edit" data-toggle="tooltip" action= "addlower" rowcode="' + data + '" title="修改">' +
									'<span class="glyphicon icon-edit"></span></a>' +
									'<a ' + (dis ? "disabled" : "") + ' class="btn btn-icon-only btn-sm btn-permission btn-delete" data-toggle="tooltip" action= "del" rowcode="' + data + '" title="删除">' +
									'<span class="glyphicon icon-trash"></span></a>' +
									'</div>';
							}
						}
					];
					var shtml = $(_dt).dataTable({
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
						data: data,

						initComplete: function(settings, json) {
							ufma.isShow(page.reslist)
						},
						"drawCallback": function(settings) {
							ufma.isShow(page.reslist);

						},
						fnCreatedRow: function(nRow, aData, iDataIndex) {
							// $('td:eq(0)', nRow).html(iDataIndex + 1);
						}
					});
					var dtTr = oTable.fnOpen(nTr, shtml, 'details');
					$(nTr).find('td:last-child').attr('rowspan', '2');
					$(dtTr).find('td:eq(0)').attr('colspan', $(nTr).find('td').length - 1);

				});

			},
			onEventListener: function() {
				//CWYXM-8203--应收票据备查薄进行登记时，票据号数输入负数，能保存成功--经赵雪蕊确定合同号允许输入字母 数字--zsj
				$('#billNumber').on('blur',function(){
					$(this).val($(this).val().replace(/[\W]|_/g,''));
				});
				//点击主表行票据号数，展示子表
				$('.ufma-table').on('click', 'tbody td .row-details', function() {

					var nTr = $(this).parents('tr')[0];
					if(oTable.fnIsOpen(nTr)) //判断是否已打开
					{
						$(nTr).find('td:last-child').attr('rowspan', '1');
						oTable.fnClose(nTr);
						$(this).addClass("icon-angle-bottom").removeClass("icon-angle-top");

					} else {
						$(this).addClass("icon-angle-top").removeClass("icon-angle-bottom");
						var shtml = page.getDetails($(this).attr("data-id"), nTr);
					}
					var timeId = setTimeout(function() {
						ufma.setBarPos($(window));
						$('#gridNotes').fixedColumns({
							rightColumns: 1
						});
						clearTimeout(timeId);
					}, 200);
				});
				//点击子表的修改
				$('.ufma-table').on('click', 'tbody td .btn-edit', function() {
					var receivableType = $(this).parents(".opt-box").attr("receivableType");
					var billbookGuid = $(this).parents(".opt-box").attr("billbookGuid");
					var billbookAssGuid = $(this).parents(".opt-box").attr("billbookAssGuid");
					var canEdit = $(this).attr("data-edit");
					var url = '';
					var title = '应收票据背书';

					if(receivableType == "01") {
						var title = '应收票据登记';
						url = 'booking/booking.html';
					} else if(receivableType == "02") {
						var title = '应收票据背书';
						url = 'beishu/beishu.html';
					} else if(receivableType == "03") {
						var title = '应收票据贴现';
						url = 'tiexian/tiexian.html';
					} else if(receivableType == "04") {
						var title = '应收票据收款';
						url = 'shoukuan/shoukuan.html';
					} else if(receivableType == "06") {
						var title = '应收票据退票';
						url = 'tuipiao/tuipiao.html';
					} else {
						return false;
					}

					var argu = {
						billbookAssGuid: billbookAssGuid,
						billbookGuid: billbookGuid
					};
					dm.loadGridDataRowDetail(argu, function(result) {
						console.log("result.data", result);
						var openData = {
							action: "editData",
							billbook: result.data.billbook,
							billBookAss: result.data.billBookAss,
							canEdit: canEdit
						};
						ufma.open({
							url: url,
							title: title,
							width: 920,
							height: 600,
							data: openData,
							ondestory: function(action) {
								if(action) {
									$('#btnQuery').trigger('click');
								}
							}
						});
					});

				});
				//点击子表的删除
				$('.ufma-table').on('click', 'tbody td .btn-delete', function() {
					// var receivableType = $(this).parents(".opt-box").attr("receivableType");
					// var billbookGuid = $(this).parents(".opt-box").attr("billbookGuid");
					var billbookAssGuid = $(this).parents(".opt-box").attr("billbookAssGuid");
					var argu = {
						billbookAssGuid: billbookAssGuid
					};
					ufma.confirm('您确定要删除选中的行数据吗？', function(action) {
						if(action) {
							//点击确定的回调函数
							dm.deleteRowDetail(argu, function() {
								$('#btnQuery').trigger('click');
							});
						} else {
							//点击取消的回调函数
						}
					}, {
						type: 'warning'
					});

				});
				//点击“查询”事件
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
					page.loadMainTable();
				});
				//主表背书、贴现、收款、退票
				$(document).on('click', function(e) {
					var rowIndex = $(e.target).attr('rowindex');

					var url = '';
					var title = '应收票据背书';

					if($(e.target).is('.btn-beishu')) {
						var title = '应收票据背书';
						url = 'beishu/beishu.html';
					} else if($(e.target).is('.btn-tiexian')) {
						var title = '应收票据贴现';
						url = 'tiexian/tiexian.html';
					} else if($(e.target).is('.btn-shoukuan')) {
						var title = '应收票据收款';
						url = 'shoukuan/shoukuan.html';
					} else if($(e.target).is('.btn-refund')) {
						var title = '应收票据退票';
						url = 'tuipiao/tuipiao.html';
					} else {
						return false;
					}

					// var nTr = $(e.target).parents('tr')[0];
					// var rowData = oTable.api(false).row(nTr).data();
					var rowData = oTable.api(false).rows(rowIndex).data()[0];
					var opendata = {
						action: "",
						billbook: rowData,
						billBookAss: rowData
					};
					ufma.open({
						url: url,
						title: title,
						width: 920,
						height: 600,
						data: opendata,
						ondestory: function(action) {
							//if(action) {
							$('#btnQuery').trigger('click');
							//}
						}
					});
				});
				//登记
				$('#btnAdd').click(function() {
					var openData = {
						billbook: {
							agencyCode: $("#cbAgency").getObj().getValue(),
							acctCode: $("#cbAcct").getObj().getValue(),
							setYear: ptData.svSetYear,
							rgCode: ptData.svRgCode,
							formEnable: page.formEnable,
							action: 'add'
						}
					};
					ufma.open({
						url: 'booking/booking.html',
						title: '应收票据登记',
						width: 920,
						height: 600,
						data: openData,
						ondestory: function(data) {
							if(data.action == "save") {
								$('#btnQuery').trigger('click');
							}
						}
					});
				});
				//入账设置保存  
				$('#zhangSet').click(function() {
					if($("#cbAcct").getObj().getValue()) {
						//解决IE11“凭证模板”点击“确定按钮”关闭慢的问题
						page.rzwin = ufma.open({
							//	ufma.open({
							url: 'RZnotice/RZnotice.html',
							title: "入账设置-应收票据",
							width: 600,
							height: 340,
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
				//权限控制
				page.reslist = ufma.getPermission();
				ufma.isShow(page.reslist);

				//初始化票据类型
				page.initBillType();
				//初始化账套
				page.initAcct();
				//初始化付款单位
				page.initPayerAgency();
				//初始化承兑单位
				page.initAcceptAgency();

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
				//$("#billfaceStartAmount，#billfaceEndAmount").amtInput();
				$("#billfaceStartAmount，#billfaceEndAmount").amtInputNull();
				page.initMainTable();

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