$(function () {

	var page = function () {
		return {
			agencyCode: '',
			planData: '',
			bgData: {},
			getBudgetHead: function () {
				var column = [ //支持多表头
					{ type: 'checkbox', field: '', name: '', width: 40, headalign: 'center', align: 'center' },
					{ field: 'bgItemCode', name: '指标编码', width: 100 },
					{ field: 'bgItemSummary', name: '摘要', className: 'ellipsis' }]
					if(page.planData.isComeDocNum=="是"){
						column.push({
							field: 'comeDocNum',
							name: '来文文号',
							width: 200,
							className: 'ellipsis'
						});
					}
					if(page.planData.isSendDocNum=="是"){
						column.push({
							field: 'sendDocNum',
							name: '发文文号',
							width: 200,
							className: 'ellipsis'
						});
					}
					column.push(
					{
						field: 'bgItemCur',
						name: '金额',
						width: 120,
						align: 'right',
						render: function (rowid, rowdata, data) {
							return $.formatMoney(data, 2);
						}
					},
					{
						field: 'bgItemBalanceCur',
						name: '余额',
						width: 120,
						align: 'right',
						render: function (rowid, rowdata, data) {
							return $.formatMoney(data, 2);;
						}
					})
				
				if (!$.isNull(page.planData)) {
					for (var i = 0; i < page.planData.planVo_Items.length; i++) {
						var item = page.planData.planVo_Items[i];
						var cbItem = item.eleCode;
						column.push({ field: bg.shortLineToTF(item.eleFieldName), name: item.eleName, width: 240 });
					};
				}
				column.push({ field: 'createUserName', name: '编制人', width: 120 });
				column.push({ field: 'createDate', name: '编制日期', width: 100 });
				column.push({ field: 'checkUserName', name: '审核人', width: 120 });
				column.push({ field: 'checkDate', name: '审核日期', width: 100 });
				column.push({
					type: 'toolbar',
					field: 'option',
					name: '操作',
					width: 150,
					headalign: 'center',
					render: function (rowid, rowdata, data) {
						return '<button class="btn btn-del" data-toggle="tooltip" title="删除"><span class="icon-trash"></span></button>' +
							'<button class="btn btn-fj" data-toggle="tooltip" title="附件"><span class="icon-paperclip"></span></button>' +
							'<button class="btn btn-log" data-toggle="tooltip" title="日志"><span class="icon-audit"></span></button>';
					}
				});
				return [column];
			},
			getSearchMap: function (planData) {
				var searchMap = bg.getBgPlanItemMap(planData);
				searchMap['billType'] = 7;
				searchMap['bgReserve'] = 1;
				searchMap['status'] = 1;
				searchMap['createDateBegin'] = $('#createDateBegin').getObj().getValue();
				searchMap['createDateEnd'] = $('#createDateEnd').getObj().getValue();
				searchMap['status'] = $('#tabStatus .active a').data('status');
				return searchMap;
			},
			setTable: function () {
				var status = $('#tabStatus .active a').data('status');
				var columns = page.getBudgetHead();
				$('#zbtz-data').ufDatagrid({
					data: [],
					idField: 'id', //用于金额汇总
					pId: 'billId', //用于金额汇总
					disabled: false, //可选择
					frozenStartColumn: 1, //冻结开始列,从1开始
					frozenEndColumn: 1, //冻结结束列
					paginate: true, //分页
					columns: columns,
					//合并列
					mergeColumns: function (rowid, rowdata) {
						var merges = [];
						if (rowdata.pId == 0) {
							//同一行可以合并多列
							merges.push({ columnIndex: 1, colSpan: columns[0].length - 2, className: 'bgf5', text: '<a class="viewBill"><span class="mr30">单据编号：' + rowdata.billCode + '</span><span class="mr30">单据日期：' + ufma.parseNull(rowdata.billDate) + '</span><span class="mr30">单据金额：' + $.formatMoney(rowdata.billCur, 2) + '</span>审核日期：' + ufma.parseNull(rowdata.checkDate) + '</span></a>' });
						}
						if (rowdata.isFooter == '1') {
							merges.push({ columnIndex: 1, colSpan: columns[0].length - 2, text: '<a class="fr viewBill">更多</a>' });
						}
						return merges
					},
					//合并行
					mergeRows: function (prevRowdata, rowdata) {
						var merges = [];
						if (prevRowdata['billId'] == rowdata['billId']) {
							merges.push(0);
							merges.push(-1);
						}
						return merges
					},
					toolbar: [{
						type: 'checkbox',
						class: 'check-all',
						text: '全选'
					},
					{
						type: 'button',
						class: 'btn-default btn-del',
						text: '删除',
						action: function () {
							var checkData = $('#zbtz-data').getObj().getCheckData();
							if (checkData.length == 0) {
								ufma.alert('请选择单据！', function () { }, 'warning');
								return false;
							}
							var data = [];
							for (var i = 0; i < checkData.length; i++) {
								data.push({ 'billId': checkData[i].billId });
							}
							page.delBills(data);
						}
					},
					{
						type: 'button',
						class: 'btn-default  btn-checked',
						text: '审核',
						action: function () {
							var checkData = $('#zbtz-data').getObj().getCheckData();
							if (checkData.length == 0) {
								ufma.alert('请选择单据！', function () { }, 'warning');
								return false;
							}
							var data = [];

							for (var i = 0; i < checkData.length; i++) {
								data.push({ 'billId': checkData[i].billId, 'status': $('#zbtz-data .btn-checked').data('status') });
							}
							page.checkBills(data, $('#zbtz-data .btn-checked').data('status'));
						}
					}
					],
					initComplete: function (options, data) {
						page.adjGridTop();
						$('#zbtz-data tr').on('click', '.btn-del', function (e) {
							e.stopPropagation();
							var rowid = $(this).closest('tr').attr('id');
							var rowData = $('#zbtz-data').getObj().getRowByTId(rowid);
							page.delBills([{ 'billId': rowData.billId }]);
						});
						$('#zbtz-data tr').on('click', '.btn-log', function (e) {
							e.stopPropagation();
							var rowid = $(this).closest('tr').attr('id');
							var $zbTbl = $('#zbtz-data').getObj();
							if ($zbTbl.isDetailShow(rowid)) {
								$zbTbl.hideDetail();
								return false;
							}
							//初始化日志内容
							page.initLog(rowid);
							$zbTbl.showDetail(rowid, $('#viewlog'));
						});
						$('.viewBill').on('click', function (e) {
							e.stopPropagation();
							var rowId = $(this).closest('tr').attr('id');
							var rowData = $('#zbtz-data').getObj().getRowByTId(rowId);
							page.openEditWin('edit', rowData.billId);
							e.preventDefault();
						});
						switch (status) {
							case 1:
								if (data.length > 0) {
									$('.btn-checked,.btn-del').removeAttr('disabled');
								} else {
									$('.btn-checked,.btn-del').attr('disabled', 'disabled');
								}
								$('.btn-del').removeClass('hide');
								$('#zbtz-data .btn-checked').text('审核');
								$('#zbtz-data .btn-checked').attr('data-status', '3');
								break;
							case 3:
								$('.btn-del').addClass('hide');
								$('#zbtz-data .btn-checked').text('销审');
								$('#zbtz-data .btn-checked').attr('data-status', '1');
								if (data.length > 0) {
									$('#zbtz-data .btn-checked').removeAttr('disabled');
								} else {
									$('#zbtz-data .btn-checked').attr('disabled', 'disabled');
								}
								break;
							default:
								$('.btn-checked,.btn-del').attr('disabled', 'disabled');
								break;
						}
						$('button[data-toggle="tooltip"]').tooltip();
					}
				});
				if ($.isNull(page.planData)) {
					return false;
				}
				var url = bg.getUrl('bills') + '?agencyCode=' + page.agencyCode + '&bgReserve=1&billType=7';
				var argu = page.getSearchMap(page.planData);
				var data = [];
				var callback = function (result) {
					//需要将树结构转为扁平结构
					var newData = [];
					var billNum = 0;
					var billHJJE = 0.00;
					for (var i = 0; i < result.data.billWithItemsVo.length; i++) {
						var item = result.data.billWithItemsVo[i];
						if (item.createDate != null && item.createDate != "") {
							item.createDate = item.createDate.substr(0, 10);
						}
						if (item.checkDate != null && item.checkDate != "") {
							item.checkDate = item.checkDate.substr(0, 10);
						}
						billNum = billNum + item.billWithItems.length;
						billHJJE = billHJJE + item.billCur;
						page.bgData[item.billId] = item;
						var tmpItem = $.extend({ 'id': item.billId, 'pId': '0', isFooter: 0 }, item);
						delete tmpItem['billWithItems'];
						newData.push(tmpItem);
						for (var j = 0; j < item.billWithItems.length; j++) {
							if (j >= 5) break;
							row = item.billWithItems[j];
							var tmpRow = $.extend({}, tmpItem, row);
							tmpRow["id"] = row.bgItemId;
							tmpRow["pId"] = row.billId;
							tmpRow["checkUserName"] = item.checkUserName;
							tmpRow["checkDate"] = item.checkDate;
							if (tmpRow.createDate != null && tmpRow.createDate != "") {
								tmpRow.createDate = tmpRow.createDate.substr(0, 10);
							}
							if (tmpRow.checkDate != null && tmpRow.checkDate != "") {
								tmpRow.checkDate = tmpRow.checkDate.substr(0, 10);
							}
							newData.push(tmpRow);
						};
						var footerData = $.extend({}, tmpItem, { 'id': item.billId + '-1', 'pId': item.billId, isFooter: 1 });
						newData.push(footerData);
					}
					$('#billNum').html(billNum);
					$('#billHJJE').html($.formatMoney(billHJJE, 2));
					$('#zbtz-data').getObj().load(newData);
				}
				$.ufajax(url, 'post', argu, callback);
			},
			getLogHead: function () {
				var column = [        //支持多表头
					{ field: 'optTime', name: '时间日期', width: 160 },
					{ field: 'optUser', name: '操作人', width: 120 },
					{ field: 'optType', name: '操作', width: 80 },
					{ field: 'bgItemSummary', name: '摘要', className: 'ellipsis' }
				];
				if(page.planData.isComeDocNum=="是"){
					column.push({
						field: 'comeDocNum',
						name: '来文文号',
						width: 200,
						className: 'ellipsis'
					});
				}
				if(page.planData.isSendDocNum=="是"){
					column.push({
						field: 'sendDocNum',
						name: '发文文号',
						width: 200,
						className: 'ellipsis'
					});
				}
				if (!$.isNull(page.planData)) {
					for (var i = 0; i < page.planData.planVo_Items.length; i++) {
						var item = page.planData.planVo_Items[i];
						var cbItem = item.eleCode;
						column.push({ field: bg.shortLineToTF(item.eleFieldName), name: item.eleName, width: 240 });
					};
				}
				column.push({
					field: 'bgItemCur', name: '预算金额', width: 120, align: 'right', render: function (rowid, rowdata, data) {
						return $.formatMoney(data, 2);
					}
				});
				return [column];
			},
			initLog: function (rowid) {
				var rowData = $('#zbtz-data').getObj().getRowByTId(rowid);
				var url = bg.getUrl('unacBillLog');
				var argu = { 'bgItemId': rowData.bgItemId };
			},

			initAgency: function () {
				bg.setAgencyCombox($('#cbAgency'), {}, function (sender, treeNode) {
					page.agencyCode = treeNode.id;
					//80827 【财务云8.0 鄂尔多斯 】20190630所有页面，单位或账套选择变化后，再打开其它页面时，自动显示为最近一次选择的单位或账套。--zsj
						//缓存单位
						var params = {
							selAgecncyCode: treeNode.id,
							selAgecncyName: treeNode.name
						}
						ufma.setSelectedVar(params);
					page.initSearchPnl();
				});
			},
			initSearchPnl: function () {
				var param = { 'agencyCode': page.agencyCode };
				bg.setBgPlanCombox($('#cbBgPlan'), param, function (sender, data) {
					page.planData = data;
					bg.initBgPlanItemPnl($('#searchPlanPnl'), data);
					page.adjGridTop();
					page.setTable();
				});
			},
			adjGridTop: function () {
				$.timeOutRun(null, null, function () {
					var gridTop = $('#zbtz-data').offset().top;
					var gridHeight = $(window).height() - gridTop;
					$('#zbtz-data').getObj().setBodyHeight(gridHeight);
				}, 800);
			},
			initPage: function () {
				page.initAgency();
				$("#zbtz-dataHead").ufFixedShow({ offset: 0 });
				$("#zbtz-dataFoot").ufFixedShow({
					position: 'bottom',
					zIndex: 1000, //Z轴
					offset: 0 //偏移
				});
				page.adjGridTop();
				$.timeOutRun(null, null, function () {
					$('#cbAgency').getObj().val(page.pfData.svAgencyCode);
					page.initSearchPnl();
				}, 1000);
				$('#createDateBegin').ufDatepicker('update', 'getYear().getMonth().1');
				setTimeout(function() {   //guohx   解决左侧出现树问题 模拟点击
					$('.ufma-combox-popup').css({
						'display': 'none'
					});
				}, 600);
			},
			delBills: function (data) {
				ufma.confirm('您确定要删除所选择单据吗？', function (ac) {
					if (ac) {
						var argu = { 'agencyCode': page.agencyCode, 'setYear': page.pfData.svSetYear, 'items': data };
						var url = bg.getUrl('bgallocateDel');
						var callback = function (result) {
							page.setTable();
						};

						$.ufajax(url, 'post', argu, callback);
					}
				}, { 'type': 'warning' });
			},
			checkBills: function (data, status) {
				var argu = { 'agencyCode': page.agencyCode, 'setYear': page.pfData.svSetYear, 'items': data, 'status': status };
				argu.checkUser = page.pfData.svUserCode;
				argu.checkUserName = page.pfData.svUserName;
				argu.checkDate = (new Date()).Format('yyyy-MM-dd');
				var url = bg.getUrl('unacCheck');
				if (status == 1) {
					url = bg.getUrl('unacCancelAudit');
				}
				var callback = function (result) {
					ufma.showTip('操作成功能，单据已处理！', function () {
						page.setTable();
					}, 'success');
				};
				$.ufajax(url, 'post', argu, callback);
			},
			openEditWin: function (action, billId) {
				var stitle = '新增待分配指标分配';
				if (action == 'edit') {
					stitle = '编辑待分配指标分配';
				}
				ufma.setObjectCache('curBillData', page.bgData[billId]);
				ufma.open({
					url: 'budgetAllocate.html',
					title: stitle,
					width: 1090,
					data: { 'agencyCode': page.agencyCode, 'action': action, 'billId': billId, 'planId': page.planData.chrId },
					ondestory: function (result) {
						if (result.action == 'ok') {
							page.setTable();
						}
					}
				});
			},
			onEventListener: function () {
				$('#tabStatus').on('click', 'li', function () {
					page.setTable();
				});
				$('.btn-new').click(function (e) {
					if ($.isNull(page.agencyCode)) {
						ufma.alert('请选择单位！', 'error');
						return false;
					}
					page.openEditWin('add', '');
				});
				$('.btn-more-item').click(function () {
					page.adjGridTop();
				});
				$('#btnQry').click(function () {
					page.setTable();
				});
			},
			//此方法必须保留
			init: function () {
				page.pfData = ufma.getCommonData();
				page.agencyCode = page.pfData.svAgencyCode;
				ufma.parse();
				uf.parse();
				this.initPage();
				this.setTable();
				this.onEventListener();
			}
		}
	}();
	/////////////////////
	page.init();
});