$(function() {
	//废弃文件--zsj
	var treeObj;
	var page = function() {
		var ptData = {};
		var agencyCode = '',
			acctCode = '';
		var oTable;
		return { 
			//初始化单位
			initAgencyScc: function() {
				ufma.showloading('正在加载数据，请耐心等待...');
				$('#cbAgency').ufTreecombox({
					url: dm.getCtrl('agency'),
					idField: 'id', //可选
					textField: 'codeName', //可选
					pIdField: 'pId', //可选
					placeholder: '请选择单位',
					icon: 'icon-unit',
					theme: 'label',
					leafRequire: true,
					onChange: function(sender, treeNode) {
						agencyCode = $('#cbAgency').getObj().getValue();
						page.agencyCode = agencyCode;
						//账套
						/*var url = dm.getCtrl('acct') + agencyCode;
						callback = function(result) {
							$("#cbAcct").getObj().load(result.data);
						};
						ufma.get(url, {}, callback);*/
						/*var argu = {
							"agencyCode": agencyCode,
							"userId": ptData.svUserId ,
							"setYear":  ptData.svSetYear
						}*/
						var argu = {
							agencyCode: agencyCode,
							setYear: ptData.svSetYear
						}
						dm.acct(argu, function(result) {
							$("#cbAcct").getObj().load(result.data);
						})

					},
					onComplete: function(sender) {
						if(ptData.svAgencyCode) {
							$('#cbAgency').getObj().val(ptData.svAgencyCode);
						} else {
							$('#cbAgency').getObj().val('1');
						}
					}
				});

				//page.cbAgency.select(1);
			},
			//初始化账套
			initAcct: function() {
				$("#cbAcct").ufCombox({
					/*idField: 'CHR_CODE',
					textField: 'CODE_NAME',*/
					idField: 'code', //多区划
					textField: 'codeName', //多区划
					placeholder: '请选择账套',
					icon: 'icon-book',
					theme: 'label',
					onChange: function(data) {
						//请求会计科目
						var reqData = {
							agencyCode: $('#cbAgency').getObj().getValue(),
							acctCode: $("#cbAcct").getObj().getValue(),
							accoType: "6",
							setYear: ptData.svSetYear,
							userId: ptData.svUserId //修改权限  将svUserCode改为 svUserId  20181012
						};
						dm.getAcco(reqData, page.accoTree);
						//请求票据类型
						page.billType();
						//请求往来单位
						page.payerAgency();

					},
					onComplete: function(sender) {
						if(ptData.svAcctCode) {
							$("#cbAcct").getObj().val(ptData.svAcctCode);
						} else {
							$('#cbAcct').getObj().val('1');
						}

					}
				});
			},
			//初始化票据类型
			initBillType: function() {
				$('#billType').ufTreecombox({
					idField: "id",
					textField: "codeName",
					onChange: function() {}
				});
			},
			//请求票据类型
			billType: function() {
				var reqData = {
					agencyCode: page.agencyCode,
					setYear: ptData.svSetYear,
					rgCode: ptData.svRgCode,
					eleCode: "BILLTYPE"
				}

				dm.commonApi(reqData, function(result) {
					page.billTypeData = result.data;
					$('#billType').ufTreecombox({
						data: result.data,
					});
					$('#billType').getObj().val('001');
				});
			},
			//初始化往来单位
			initPayerAgency: function() {
				$('#payerAgency').ufTreecombox({
					idField: 'id',
					textField: 'codeName',

					placeholder: '请选择往来单位',
					// data: result.data,
					onComplete: function(sender) {}
				});
			},
			//请求往来单位
			payerAgency: function() {
				var reqData = {
					agencyCode: page.agencyCode,
					setYear: ptData.svSetYear,
					rgCode: ptData.svRgCode,
					eleCode: "CURRENT"
				}

				dm.commonApi(reqData, function(result) {
					page.payerAgencyData = result.data;
					$('#payerAgency').ufTreecombox({
						data: result.data,
						onComplete: function(sender) {
							$('#btnQuery').trigger('click');
						}
					});
					$('#payerAgency').getObj().val('001');
				});
			},
			//初始化主表
			initMainTable: function() {
				var columns = [{
						title: "序号",
						data: "rowno",
						width: 30,
						className: 'nowrap tc isprint'
					},
					{
						title: "凭证日期",
						data: "vouDate",
						className: 'nowrap isprint'
					},
					{
						title: "凭证号",
						data: "vouNo",
						className: 'nowrap isprint'
					},
					{
						title: "摘要",
						data: "vouDesc",
						className: 'nowrap isprint'
					},
					{
						title: "会计科目",
						data: "accoName",
						className: 'nowrap isprint',
						width: 160
					},
					{
						title: "往来单位",
						data: "departmentName",
						className: 'nowrap isprint',
						width: 160
					},
					{
						title: "票据类型",
						data: "billTypeName",
						className: 'nowrap isprint',
						width: 160
						/*票据类型不是金额字段，不需要格式化
						 * ,
						render: function(data, type, rowdata, meta) {
							var val = $.formatMoney(data);
							return '<div style="text-align: right">' + (val == '0.00' ? '' : val) + '</div>'

						}*/
					},
					{
						title: "票据号",
						data: "billNo",
						className: 'nowrap isprint'
					},
					{
						title: "应收金额",
						data: "stadAmt",
						className: 'nowrap isprint tdNum',
						render: function(data, type, rowdata, meta) {
							if(!data) {
								return data;
							}
							return '<div style="text-align: right">' + $.formatMoney(data, 3); + '</div>'
						}
					},
					{
						title: "已核销金额",
						data: "cancelMoney",
						className: 'nowrap isprint tdNum',
						render: function(data, type, rowdata, meta) {
							if(!data) {
								return data;
							}
							return '<div style="text-align: right">' + $.formatMoney(data, 3); + '</div>'
						}
					},
					{
						title: "应收余额",
						data: "restMoney",
						className: 'nowrap isprint tdNum',
						render: function(data, type, rowdata, meta) {
							if(!data) {
								return data;
							}
							return '<div style="text-align: right">' + $.formatMoney(data, 3); + '</div>'
						}
					},

					{
						title: "状态",
						data: "cancelStatusName",
						className: 'nowrap isprint',
						width: 80
					},
					{
						title: "坏账原因",
						data: "badReasonName",
						className: 'nowrap isprint'
					},
					{
						title: "坏账金额",
						data: "badMoney",
						className: 'nowrap isprint tdNum',
						render: function(data, type, rowdata, meta) {
							if(!data) {
								return data;
							}
							return '<div style="text-align: right">' + $.formatMoney(data, 3); + '</div>'
						}
					},
					{
						title: "坏账收回金额",
						data: "badCancelMoney",
						className: 'nowrap isprint tdNum',
						render: function(data, type, rowdata, meta) {
							if(!data) {
								return data;
							}
							return '<div style="text-align: right">' + $.formatMoney(data, 3); + '</div>'
						}
					},
					{
						title: "操作",
						data: "opt",
						className: 'nowrap',
						width: 200,
						render: function(data, type, rowdata, meta) {
							//如果数据的billStatus不为01，背书、贴现、收款、退票的按钮都不能点
							var dis = false;
							// if (rowdata.billStatus != '01') {
							//     dis = true;
							// }
							return '<a ' + (dis ? "disabled" : "") + ' class="btn btn-icon-only btn-sm btn-permission icon-writeoff btn-beishu" data-toggle="tooltip" action= "addlower" title="核销" rowindex="' + meta.row + '">' +
								'<a ' + (dis ? "disabled" : "") + ' class="btn btn-icon-only btn-sm btn-permission icon-discount btn-tiexian" data-toggle="tooltip" action= "addlower" title="账龄分析" rowindex="' + meta.row + '">' +
								'<a ' + (dis ? "disabled" : "") + ' class="btn btn-icon-only btn-sm btn-permission icon-bad-debt-confirmation btn-confirmation" data-toggle="tooltip" action= "addlower" title="坏账确认" rowindex="' + meta.row + '">' +
								'<a ' + (dis ? "disabled" : "") + ' class="btn btn-icon-only btn-sm btn-permission icon-discount btn-back" data-toggle="tooltip" action= "addlower" title="坏账收回" rowindex="' + meta.row + '">';
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
					"pageLength": 20,
					"serverSide": false,
					"ordering": false,
					columns: columns,
					data: [],
					"dom": 'rt<"' + tableId + '-paginate"ilp>',
					initComplete: function(settings, json) {
						var toolBar = $(this).attr('tool-bar')
						var $info = $(toolBar + ' .info');
						if($info.length == 0) {
							$info = $('<div class="info"></div>').appendTo($(toolBar + ' .tool-bar-body'));
						}
						$info.html('');
						$('.' + tableId + '-paginate').appendTo($info);
						$('.' + tableId + '-paginate').appendTo($info);
						$("#dtToolbar .buttons-print").css("border-radius", "4px 0 0 4px").addClass("btn-print btn-permission").attr({
							"data-toggle": "tooltip",
							"title": "打印"
						});
						$("#dtToolbar .buttons-excel").css("border-radius", "0 4px 4px 0").addClass("btn-export btn-permission").attr({
							"data-toggle": "tooltip",
							"title": "导出"
						});

					},
					"drawCallback": function(settings) {
						//导出begin
						$("#dtToolbar .buttons-excel").off().on('click', function(evt) {
							evt = evt || window.event;
							evt.preventDefault();
							ufma.expXLSForDatatable($('#gridNotes'), '应收款备查簿');
						});
						//导出end

					},
					fnCreatedRow: function(nRow, aData, iDataIndex) {
						$('td:eq(0)', nRow).html(iDataIndex + 1);
					}
				});
			},
			//条件查询
			loadMainTable: function() {

				// var argu = $('#frmQuery').serializeObject();
				var argu = $.extend(argu, {
					agencyCode: $('#cbAgency').getObj().getValue(),
					acctCode: $('#cbAcct').getObj().getValue(),
					setYear: ptData.svSetYear,
					rgCode: ptData.svRgCode,
					accoType: 0
				});

				dm.loadGridData(argu, function(result) {
					oTable.fnClearTable();
					if(result.data) {
						oTable.fnAddData(result.data, true);
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
			//会计科目树
			accoTree: function(result) {
				var treeData = result.data.treeData;
				var treeSetting = {
					view: {
						showLine: false,
						showIcon: false
					},
					check: {
						enable: false
					},

					data: {
						simpleData: {
							enable: true,
							idKey: "id",
							pIdKey: "pId",
							rootPId: 0
						},

						key: {
							name: "codeName",
						},

						keep: {
							leaf: true
						}
					},
					callback: {
						onClick: function(event, treeId, treeNode) {
							event.stopPropagation();
							if(treeNode.isParent) {
								ufma.showTip("请选择会计科目末级节点", function() {

								}, "warning");
								return false;
							}
							$("#baseTree").hide();
							//$("#searchText").attr("chrCode", treeNode.CHR_CODE).val(treeNode.codeName);
							$("#searchText").attr("chrCode", treeNode.code).val(treeNode.codeName); //多区划

						},
						// onDblClick: function() {
						//     if(!checkbox) {
						//         $('#btnOk').trigger('click');
						//     }
						// },
						onAsyncSuccess: function() {

						}
					}
				};
				//
				if(!$.isNull(treeObj)) {
					treeObj.destroy();
				}
				treeObj = $.fn.zTree.init($('#baseTree'), treeSetting, treeData);
				treeObj.expandAll(true);
				ufma.hideloading();
			},
			onEventListener: function() {
				//点击主表行票据号数，展示子表
				$('.ufma-table').on('click', 'tbody td .row-details', function() {

					var nTr = $(this).parents('tr')[0];
					if(oTable.fnIsOpen(nTr)) //判断是否已打开
					{
						$(nTr).find('td:last-child').attr('rowspan', '1');
						oTable.fnClose(nTr);
						$(this).addClass("icon-angle-top").removeClass("icon-angle-bottom");

					} else {
						$(this).addClass("icon-angle-bottom").removeClass("icon-angle-top");
						var shtml = page.getDetails($(this).attr("data-id"), nTr);
					}
					var timeId = setTimeout(function() {
						ufma.setBarPos($(window));
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
						url = 'beishu/badAccountsComfirm.html';
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
					page.loadMainTable();
				});
				//主表坏账确认、坏账收回
				$(document).on('click', function(e) {
					var rowIndex = $(e.target).attr('rowindex');

					var url = '';
					var title = '应收款坏账确认';

					if($(e.target).is('.btn-confirmation')) {
						var title = '应收款坏账确认';
						url = 'badAccountsComfirm.html';
					} else if($(e.target).is('.btn-back')) {
						var title = '应收款坏账收回';
						url = 'badAccountsBack.html';
					} else {
						return false;
					}

					// var nTr = $(e.target).parents('tr')[0];
					// var rowData = oTable.api(false).row(nTr).data();
					rowData = oTable.api(false).rows(rowIndex).data()[0];
					var opendata = {
						action: "",
						billbook: rowData,
						billTypeData: page.billTypeData,
						payerAgencyData: page.payerAgencyData
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
							rgCode: ptData.svRgCode
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
				//显示隐藏科目树
				$("#searchText").on("focus", function(e) {
					e.stopPropagation();
					$("#baseTree").show();
				})
				//会计科目模糊搜索
				$(document).on("input", "#searchText", function() {
					var _keywords = $(this).val();
					searchNodeLazy(_keywords); //调用延时处理
				})
				//点击空白处会计科目树隐藏
				$(document).on("click", function(e) {
					var div1 = $('#baseTree')[0];
					var div2 = $('#searchText')[0];
					if(e.target != div1 && e.target != div2 && !$.contains(div1, e.target) && !$.contains(div2, e.target)) $("#baseTree").hide();
				})
				//点击空白处会计科目树隐藏
				$(".uf-datepicker").on("focus", "input", function() {
					$("#baseTree").hide();
				})

			},
			//初始化页面
			initPage: function() {
				page.reslist = ufma.getPermission();
				ufma.isShow(page.reslist);
				//初始化票据类型
				page.initBillType();
				//初始化账套
				page.initAcct();
				//初始化往来单位
				page.initPayerAgency();

				this.initAgencyScc();
				/////////////
				var date = new Date(),
					y = date.getFullYear(),
					m = date.getMonth();
				$('#billStartDate').ufDatepicker({
					format: 'yyyy-mm-dd',
					//viewMode:'month',
					initialDate: new Date(y, m, 1)
				});
				$('#billEndDate').ufDatepicker({
					format: 'yyyy-mm-dd',
					//viewMode:'month',
					initialDate: new Date()
				});
				dm.radioLabelDPEType('#apportionType');
				$('#apportionStartMoney').amtInput();
				$('#apportionEndMoney').amtInput();
				$("#billfaceStartAmount").amtInput();
				$("#billfaceEndAmount").amtInput();
				page.initMainTable();
				$("input").attr("autocomplete", "off");

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
	// 有输入后定时执行一次，如果上次的输入还没有被执行，那么就取消上一次的执行
	var timeoutId = null;

	function searchNodeLazy(_keywords) {
		var zTreeObj = $.fn.zTree.getZTreeObj("baseTree");
		if(!zTreeObj) {
			alter("获取树对象失败");
		}
		if(timeoutId) { //如果不为空,结束任务
			clearTimeout(timeoutId);
		}
		timeoutId = setTimeout(function() {
			var nodes = zTreeObj.getNodesByParamFuzzy("codeName", _keywords, null);
			var fitedNode = [];
			for(var i = 0; i < nodes.length; i++) {
				if(nodes[i].codeName.indexOf(_keywords) == 0 && nodes[i].isLeaf == "1") {
					fitedNode.push(nodes[i]);
				}
			}
			if(fitedNode.length > 0) {
				zTreeObj.selectNode(fitedNode[0]);
			}
			$("#searchText").focus(); //输入框重新获取焦点
		}, 300);
	}
});