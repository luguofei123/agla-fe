$(function () {
	window._close = function () {
		if (window.closeOwner) {
			var data = { action: 'ok', result: {} };
			window.closeOwner(data);
		}
	}
	var page = function () {
		return {
			planData: '',
			bgData: '',
			billId: '',
			billCode: '',
			getBudgetHead: function () {
				var column = [ //支持多表头
					{ type: 'checkbox', field: '', name: '', width: 40, headalign: 'center', align: 'center' },
					{ field: 'bgItemCode', name: '指标编码', width: 100 },
					{ field: 'bgItemSummary', name: '摘要', width: 200, className: 'ellipsis' }]
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
							return $.formatMoney(data, 2);
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
				column.push({ field: 'checkUserName', name: '审核人', width: 100 });
				column.push({ field: 'checkDate', name: '审核日期', width: 100 });
				column.push({
					type: 'toolbar',
					field: 'option',
					name: '操作',
					width: 60,
					headalign: 'center',
					render: function (rowid, rowdata, data) {
						return '<button class="btn btn-log" data-toggle="tooltip" title="日志"><span class="icon-audit"></span></button>';
					}
				});
				return [column];
			},
			setBudgetTable: function () {
				$('#select-data').ufDatagrid({
					data: [],
					idField: 'bgItemCode', //用于金额汇总
					pId: 'pid', //用于金额汇总
					disabled: false, //可选择
					frozenStartColumn: 1, //冻结开始列,从1开始
					frozenEndColumn: 1, //冻结结束列
					paginate: false, //分页
					columns: page.getBudgetHead(),
					initComplete: function (options, data) {
						page.adjGridTop($('#select-data'));
						$('#select-data tr').on('click', '.btn', function (e) {
							e.stopPropagation();
							var rowid = $(this).closest('tr').attr('id');
							var $zbTbl = $('#select-data').getObj();
							if ($zbTbl.isDetailShow(rowid)) {
								$zbTbl.hideDetail();
								return false;
							}
							//初始化日志内容
							page.initLog(rowid);
							$zbTbl.showDetail(rowid, $('#viewlog'));
						});
						$('button[data-toggle="tooltip"]').tooltip();
					}
				});
				if ($.isNull(page.planData)) {
					return false;
				}
				var url = bg.getUrl('budget') + '?agencyCode=' + page.agencyCode + '&setYear=' + ufma.getCommonData().svSetYear + '&bgReserve=2&billType=7';
				var argu = page.getSearchMap(page.planData);
				var data = [];
				var callback = function (result) {
					page.bgData = result.data;
					for (var i = 0; i < result.data.billWithItemsVo.length; i++) {
						var item = result.data.billWithItemsVo[i];
						if (item.createDate != null && item.createDate != "") {
							item.createDate = item.createDate.substr(0, 10);
						}
						if (item.checkDate != null && item.checkDate != "") {
							item.checkDate = item.checkDate.substr(0, 10);
						}
						for (var j = 0; j < item.billWithItems.length; j++) {
							row = item.billWithItems[j];
							var row = $.extend(true, item.billWithItems[j], { checkUserName: item.checkUserName, checkDate: item.checkDate });
							if (row.createDate != null && row.createDate != "") {
								row.createDate = row.createDate.substr(0, 10);
							}
							if (row.checkDate != null && row.checkDate != "") {
								row.checkDate = row.checkDate.substr(0, 10);
							}
							data.push(row);
						};
					}
					$('#select-data').getObj().load(data);
				}
				$.ufajax(url, 'post', argu, callback);
			},
			getAdjustHead: function () {
				var columns = [];
				var column1 = [ //支持多表头
					{ type: 'checkbox', field: '', name: '', rowspan: 2, width: 40, headalign: 'center', align: 'center' },
					{ field: 'bgItemSummary', name: '摘要', rowspan: 2, className: 'ellipsis' }]
					if(page.planData.isComeDocNum=="是"){
						column1.push({
							field: 'comeDocNum',
							name: '来文文号',
							width: 200,
							className: 'ellipsis'
						});
					}
					if(page.planData.isSendDocNum=="是"){
						column1.push({
							field: 'sendDocNum',
							name: '发文文号',
							width: 200,
							className: 'ellipsis'
						});
					}
				column1.push(
					{ field: '', name: '指标分配', colspan: 3, width: 200 },
					{ field: 'bgItemCode', name: '指标编码', rowspan: 2, width: 100 }
				)
				if (!$.isNull(page.planData)) {
					for (var i = 0; i < page.planData.planVo_Items.length; i++) {
						var item = page.planData.planVo_Items[i];
						var cbItem = item.eleCode;
						column1.push({ field: bg.shortLineToTF(item.eleFieldName), name: item.eleName, rowspan: 2, width: 240 });
					};
				}
				column1.push({
					type: 'toolbar',
					field: 'option',
					name: '操作',
					width: 60,
					rowspan: 2,
					headalign: 'center',
					render: function (rowid, rowdata, data) {
						return '<button class="btn btn-del" data-toggle="tooltip" title="删除"><span class="icon-trash"></span></button>';
					}
				});
				var column2 = [{
					field: 'bgItemBalanceCur',
					name: '可分配',
					width: 120,
					align: 'right',
					render: function (rowid, rowdata, data) {
						return $.formatMoney(data, 2);
					}
				},
				{
					type: 'money',
					field: 'bgItemFpedCur',
					name: '分配',
					width: 120,
					align: 'right',
					render: function (rowid, rowdata, data) {

						if (window.ownerData.action == 'add') {
							return '';
						} else {
							return $.formatMoney(data, 2);
						}
					},
					onKeyup: function (e) {
						var $row = $('tr[id="' + e.rowId + '"]');
						var blCur = e.rowData.bgItemBalanceCur;
						var val = e.data;
						if (val == '') val == 0.00;
						var hj = parseFloat(blCur) - val;
						$row.find('td[name="bgItemCurHJ"]').html($.formatMoney(hj));
						if (hj < 0) {
							ufma.showTip('可分配金额不足！', function () { }, 'warning');
							$('#btn-save').attr('disabled', 'disabled');
						} else {
							$('#btn-save').removeAttr('disabled', 'disabled');
						}
					}
				},
				{
					field: 'bgItemCurHJ',
					name: '分配后',
					width: 120,
					align: 'right',
					render: function (rowid, rowdata, data) {
						var data = rowdata.bgItemBalanceCur - rowdata.bgItemFpedCur;
						return $.formatMoney(data, 2);
					}
				}
				];
				columns.push(column1);
				columns.push(column2);
				return columns;
			},
			setAdjustTable: function (data) {
				page.adjGridTop($('#zbtz-data-editor'));
				$('#zbtz-data-editor').ufDatagrid({
					data: data,
					idField: 'bgItemCode', //用于金额汇总
					pId: 'pid', //用于金额汇总
					disabled: false, //可选择
					frozenStartColumn: 1, //冻结开始列,从1开始
					frozenEndColumn: 1, //冻结结束列
					paginate: false, //分页
					columns: page.getAdjustHead(),
					toolbar: [{
						type: 'checkbox',
						class: 'check-all',
						text: '全选'
					},
					{
						type: 'button',
						class: 'btn-default',
						text: '删除',
						action: function () {
							var checkData = $('#zbtz-data-editor').getObj().getCheckData();
							if (checkData.length == 0) {
								ufma.alert('请选择待分配指标！', 'warning');
								return false;
							}
							var data = [];
							for (var i = 0; i < checkData.length; i++) {
								var rowData = checkData[i];
								data.push({ 'billItemId': rowData.bgItemId, 'bgItemCode': rowData.bgItemCode });
							}
							page.delItems(data);
						}
					}
					],
					initComplete: function (options, data) {
						$('#zbtz-data-editor tr').on('click', '.btn-del', function (e) {
							e.stopPropagation();
							var rowid = $(this).closest('tr').attr('id');
							var rowData = $('#zbtz-data-editor').getObj().getRowByTId(rowid);
							page.delItems([{ 'billItemId': rowData.bgItemId, 'bgItemCode': rowData.bgItemCode }]);
						});
						$('button[data-toggle="tooltip"]').tooltip();
					}
				});
			},
			getLogHead: function () {
				var column = [ //支持多表头
					{ field: 'optTime', name: '时间日期', width: 160 },
					{ field: 'optUserName', name: '操作人', width: 120 },
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
					field: 'bgItemCur',
					name: '预算金额',
					width: 120,
					align: 'right',
					render: function (rowid, rowdata, data) {
						return $.formatMoney(data, 2);
					}
				});
				return [column];
			},
			initLog: function (rowid) {
				var rowData = $('#select-data').getObj().getRowByTId(rowid);

				var url = bg.getUrl('unacItemLog');
				var argu = { 'bgItemId': rowData.bgItemId };

				$.ufajax(url, 'get', argu, function (result) {
					var data = result.data.logs;
					$('#zblog-data').ufDatagrid({
						data: data,
						idField: 'id', //用于金额汇总
						pId: 'pid', //用于金额汇总
						disabled: false, //可选择
						frozenStartColumn: 1, //冻结开始列,从1开始
						frozenEndColumn: 0, //冻结结束列
						paginate: false, //分页
						columns: page.getLogHead(),
						initComplete: function (options, data) {

						}
					});
				});
			},
			adjGridTop: function ($table) {
				$.timeOutRun(null, null, function () {
					var gridTop = $table.offset().top;
					var gridHeight = $('.ufma-layout-down').offset().top - gridTop - 15;
					$table.getObj().setBodyHeight(gridHeight);
				}, 800);
			},
			getSearchMap: function (planData) {
				var searchMap = bg.getBgPlanItemMap(planData);
				searchMap['billType'] = 5;
				searchMap['bgReserve'] = 2;
				searchMap['status'] = '3';
				searchMap['createDateBegin'] = $('#createDateBegin').getObj().getValue();
				searchMap['createDateEnd'] = $('#createDateEnd').getObj().getValue();
				return searchMap;
			},
			initSearchPnl: function () {
				function initPnl(data) {
					page.planData = data;
					bg.initBgPlanItemPnl($('#searchPlanPnl'), data);
					page.adjGridTop($('#select-data'));
					page.setBudgetTable();
				}
				var param = { 'agencyCode': page.agencyCode };
				bg.setBgPlanCombox($('#cbBgPlan'), param, function (sender, data) {
					initPnl(data);
				});
				if (!$.isNull(window.ownerData.planId)) {
					$('#cbBgPlan').getObj().val(window.ownerData.planId);
					page.planData = $('#cbBgPlan').getObj().getItem();
					initPnl(page.planData);
				}
			},

			initTimeline: function () {
				$('#tzdTimeline').ufTimeline({
					steps: [
						{ step: '选择待分配指标', target: 'pnl-xzzb' },
						{ step: '分配指标', target: 'pnl-tzzb' },
						{ step: '完成', target: 'pnl-end' }
					]
				});
				page.timeline = $('#tzdTimeline').getObj();
				page.timeline.step(1);
			},
			setEditWindow: function () {
				page.timeline.step(2);
				page.setBillCode();
				page.ctrlToolBar();
				$('#tzdTimeline').addClass('hide');

				var data = [];
				page.curBill = ufma.getObjectCache('curBillData');

				page.billId = page.curBill.billId;
				page.billCode = page.curBill.billCode;
				$('#billCode').val(page.curBill.billCode);
				$('#billDate').getObj().setValue(page.curBill.billDate);

				for (var j = 0; j < page.curBill.billWithItems.length; j++) {
					row = page.curBill.billWithItems[j];
					data.push(row);
				};
				page.setAdjustTable(data);
			},

			ctrlToolBar: function () {
				var step = page.timeline.stepIndex();
				switch (step) {
					case 1:
						$('#btn-prev').addClass('hide');
						$('#btn-continue').addClass('hide');
						$('#btn-save').addClass('hide');
						$('#btn-next').removeClass('hide');
						break;
					case 2:
						$('#btn-prev').removeClass('hide');
						$('#btn-save').removeClass('hide');
						$('#btn-next').addClass('hide');
						$('#btn-continue').addClass('hide');
						break;
					case 3:
						$('#btn-prev').addClass('hide');
						$('#btn-save').addClass('hide');
						$('#btn-next').addClass('hide');
						$('#btn-continue').removeClass('hide');
						break;
					default:
						break;
				}
				if (window.ownerData.action == 'edit') {
					$('#btn-prev').addClass('hide');
				}
			},
			setBillCode: function () {
				if ($.isNull(window.ownerData.billId)) {
					var url = bg.getUrl('newBillId');
					var argu = { 'agencyCode': page.agencyCode };
					argu['billType'] = 7;
					argu['setYear'] = page.pfData.svSetYear;
					var callback = function (result) {
						page.billId = result.data.billId;
						page.billCode = result.data.billCode;
						$('#billCode').val(page.billCode);
					}
					$.ufajax(url, 'get', argu, callback);
				} else {
					page.billId = window.ownerData.billId;
					page.billCode = window.ownerData.billCode;
					$('#billCode').val(window.ownerData.billCode);
				}
			},
			save: function () {
				var persion = page.pfData.svUserCode;
				var itemData = $('#zbtz-data-editor').getObj().getCheckData();
				if (itemData.length == 0) {
					ufma.alert('请选择指标', 'error');
					return false;
				}
				var argu = {
					"billId": page.billId,
					"billCode": page.billCode,
					"setYear": page.pfData.svSetYear,
					"agencyCode": page.agencyCode,
					"createDate": $('#billDate').getObj().getValue(),
					"createUser": page.pfData.svUserCode,
					"latestOpDate": $('#billDate').getObj().getValue(),
					"latestOpUser": page.pfData.svUserCode,
					"summary": null,
					"applicant": persion,
					"billDate": $('#billDate').getObj().getValue(),
					"billType": 7,
					"billCur": null,
					"status": "1",
					"attachment": null,
					"lastVer": null,
					"checkDate": null,
					"checkUser": null,
					"createUserName": page.pfData.svUserName,
					"applicantName": page.pfData.svUserName,
					"checkUserName": page.pfData.svUserName,
					"items": []
				};

				var billCur = 0.00;
				//记录切换parentId
				for (var i = 0; i < itemData.length; i++) {
					var item = itemData[i];
					item.billId = page.billId;
					item.bgReserve = '1';
					item.status = '1';
					item.isNew = window.ownerData.action == 'add' ? '是' : '否';
					item.bgItemParentid = item.bgItemId;
					item.bgItemParentcode = item.bgItemCode;
					item.bgItemId = '';
					item.bgItemCode = '';
					item.bgItemCur = item.bgItemFpedCur;
					billCur = billCur + ufma.parseFloat(item.bgItemFpedCur);
					item["createUserName"] = page.pfData.svUserName,
						item["applicantName"] = page.pfData.svUserName,
						item["checkUserName"] = page.pfData.svUserName,
						argu.items.push(item);
				}
				argu.billCur = billCur;
				var url = bg.getUrl('bgallocateSave');
				var callback = function (result) {
					if (window.ownerData.action == 'add') {
						page.timeline.next();
						page.ctrlToolBar();
					}
				}
				$.ufajax(url, 'post', argu, callback);
			},
			delItems: function (data) {
				function updateTable() {
					for (var i = 0; i < data.length; i++) {
						var item = data[i];
						var trId = 'zbtz-data-editor_row_' + item.bgItemCode;
						$('tr[id="' + trId + '"]').remove();
					}
				}
				ufma.confirm('您确定要删除所选择指标吗？', function (ac) {
					if (ac) {
						if (window.ownerData.action == 'edit') {
							var argu = { 'agencyCode': page.agencyCode, 'setYear': page.pfData.svSetYear, 'items': data };
							var url = bg.getUrl('bgallocateDel');
							var callback = function (result) {
								ufma.showTip('指标已删除！', function () {
									updateTable();
								}, 'success');
							};
							$.ufajax(url, 'post', argu, callback);
						} else {
							updateTable();
						}
					}
				}, { 'type': 'warning' });
			},
			onEventListener: function () {
				$('.btn-search').click(function () {
					page.setBudgetTable();
				});
				$('#btn-next').click(function () {
					var data = [];
					if (page.timeline.stepIndex() == 1) {
						data = $('#select-data').getObj().getCheckData();
						if (data.length == 0) {
							ufma.showTip('请选择需要分配的指标！', function () { }, 'error');
							return false;
						}
					}

					page.timeline.next();
					page.ctrlToolBar();
					page.setBillCode();
					if (page.timeline.stepIndex() == 2) {
						page.setAdjustTable(data); //表格显示后再调用，否则看不到表格
					}

				});
				$('#btn-prev').click(function () {
					page.timeline.prev();
					page.ctrlToolBar();
				});
				$('#btn-save').click(function () {
					$.timeOutRun(null, null, function () {
						page.save();
					}, 300);

				});
				$('#btn-continue').click(function () {
					page.timeline.step(1);
					page.ctrlToolBar();
				});
				$('#btn-close').click(function () {
					_close();
				});
				$('.btn-more-item').click(function () {
					page.adjGridTop($('#select-data'));
				});
				//
				$('#btnUploadFile').on('click', function (e) {
					e.stopPropagation();
					var modal_billAttachment = [];
					var option = {
						"agencyCode": page.agencyCode,
						"billId": page.billId,
						"uploadURL": _bgPub_requestUrlArray_socialSec[8] + "?agencyCode=" + page.agencyCode + "&billId=" + page.billId,
						// "uploadURL" :  _bgPub_requestUrlArray_socialSec[20],
						"delURL": _bgPub_requestUrlArray_socialSec[16] + "?agencyCode=" + page.agencyCode + "&billId=" + page.billId,
						"downloadURL": _bgPub_requestUrlArray_socialSec[15] + "?agencyCode=" + page.agencyCode + "&billId=" + page.billId,
						"onClose": function (fileList) {
							$("#billFJ").val(fileList.length + "");
							modal_billAttachment = cloneObj(fileList);
						}
					};
					_bgPub_ImpAttachment("pnl-tzzb", "指标单据[" + page.billCode + "]附件导入", modal_billAttachment, option);

				});
			},
			initPage: function () {
				page.initTimeline();

				if (window.ownerData.action == 'add') {
					page.setBudgetTable();
					page.initSearchPnl();
				} else {
					this.setEditWindow();
				}
				$('#createDateBegin').ufDatepicker('update', 'getYear().getMonth().1')
			},
			//此方法必须保留
			init: function () {
				page.pfData = ufma.getCommonData();
				ufma.parse();
				uf.parse();
				page.agencyCode = window.ownerData.agencyCode;
				this.initPage();

				this.onEventListener();
			}
		}
	}();
	/////////////////////
	page.init();
});