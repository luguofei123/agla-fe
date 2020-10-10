$(function () {
	window.close = function (state) {
		if (window.closeOwner) {
			var data = {
				action: state,
				result: {}
			};
			window.closeOwner(data);
		}
	}
	var page = function () {
		var addData = [];
		return {
			planData: '',
			billId: '',
			billCode: '',
			composePlanId: '',
			composePlanName: '',
			getBudgetHead: function () { // 第一个页面表格
				var column = [ // 支持多表头
					{
						type: 'radio',
						field: '',
						name: '',
						width: 40,
						headalign: 'center',
						align: 'center'
					}, {
						field: 'bgPlanName',
						name: '预算方案',
						rowspan: 2,
						width: 220,
						headalign: 'center'
					}, {
						field: 'bgItemCode',
						name: '指标编码',
						width: 100,
						headalign: 'center'
					}, {
						field: 'bgItemSummary',
						name: '摘要',
						className: 'ellipsis',
						width: 200,
						headalign: 'center'
					}
				];
				if (!$.isNull(page.planData)) {
					for (var i = 0; i < page.planData.planVo_Items.length; i++) {
						var item = page.planData.planVo_Items[i];
						var cbItem = item.eleCode;
						column.push({
							field: bg.shortLineToTF(item.eleFieldName),
							name: item.eleName,
							width: 240,
							headalign: 'center'
						});
					};
				}
				column.push({
					field: 'realBgItemCur',
					name: '金额',
					width: 150,
					headalign: 'center',
					align: 'right',
					render: function (rowid, rowdata, data) {
						return $.formatMoney(data, 2);
					}
				});
				column.push({
					field: 'bgItemBalanceCur',
					name: '余额',
					width: 150,
					headalign: 'center',
					align: 'right',
					render: function (rowid, rowdata, data) {
						return $.formatMoney(data, 2);;
					}
				});
				column.push({
					field: 'createUserName',
					name: '编制人',
					width: 120,
					headalign: 'center'
				});
				column.push({
					field: 'createDate',
					name: '编制日期',
					width: 100,
					headalign: 'center'
				});
				column.push({
					field: 'checkUserName',
					name: '审核人',
					width: 120,
					headalign: 'center'
				});
				column.push({
					field: 'checkDate',
					name: '审核日期',
					width: 100,
					headalign: 'center'
				});
				column.push({
					type: 'toolbar',
					field: 'option',
					name: '操作',
					width: 60,
					headalign: 'center',
					render: function (rowid, rowdata, data, meta) {
						return '<button class="btn btn-log btn-watch-detail btn-permission" data-toggle="tooltip"  title="日志"><span class="icon-log"></span></button>';
					}
				});
				return [column];
			},
			getChildBudgetHead: function () { // 分解子指标表格
				var column = [ // 支持多表头
					{
						type: 'checkbox',
						field: '',
						name: '',
						width: 40,
						headalign: 'center',
						align: 'center'
					},
					{
						field: 'bgItemCode',
						name: '指标编码',
						width: 100,
						headalign: 'center'
					}, {
						type: 'input',
						field: 'bgItemSummary',
						name: '摘要',
						className: 'ellipsis',
						width: 200,
						headalign: 'center'
					}
				];
				if (!$.isNull(page.planData)) {
					for (var i = 0; i < page.planData.planVo_Items.length; i++) {
						var item = page.planData.planVo_Items[i];
						var cbItem = item.eleCode;
						var url = bg.getUrl('bgPlanItem');
						var type = 'get';
						var param = {};
						param['agencyCode'] = page.agencyCode;
						param['setYear'] = page.pfData.svSetYear;
						param['eleCode'] = item.eleCode;
						param['eleLevel'] = item.eleLevel;
						var idField = bg.shortLineToTF(item.eleFieldName);
						var textField = bg.shortLineToTF(item.eleCode + '_NAME');
						var argu = param;
						var callback = function (result) {
							for (var j = 0; j < result.data.length; j++) {
								var item1 = result.data[j];
								item1[idField] = item1.CHR_CODE;
								item1[textField] = item1.codeName;
							}
							column.push({
								type: 'treecombox',
								// field:bg.shortLineToTF(item.eleFieldName),
								field: idField,
								idField: idField,
								textField: textField,
								name: item.eleName,
								width: 240,
								headalign: 'center',
								data: result.data
							}

							);
						}
						ufma.ajaxDef(url, type, argu, callback);
					};
				}
				column.push({
					type: 'money',
					field: 'bgItemCur',
					name: '金额',
					width: 150,
					align: 'right',
					headalign: 'center',
					render: function (rowid, rowdata, data) {
						return $.formatMoney(data, 2);
					},
					onKeyup: function (e) {
						$('#billHJJE').html($.formatMoney(page.getRowsSum()));
					}
				});
				column.push({
					type: 'toolbar',
					field: 'option',
					name: '操作',
					width: 150,
					headalign: 'center',
					render: function (rowid, rowdata, data, meta) {
						return '<button class="btn btn-del btn-delete btn-permission" data-toggle="tooltip" title="删除"><span class="icon-trash"></span></button>';

					}
				});
				return [column];
			},
			setBudgetTable: function () { // 第一页显示所有指标表格
				$('#select-data').ufDatagrid({
					data: [],
					idField: 'bgItemCode', // 用于金额汇总
					pId: 'pid', // 用于金额汇总
					disabled: false, // 可选择
					frozenStartColumn: 1, // 冻结开始列,从1开始
					frozenEndColumn: 1, // 冻结结束列
					paginate: false, // 分页
					columns: page.getBudgetHead(),
					initComplete: function (options, data) {
						page.adjGridTop($('#select-data'));

						$('#select-data tr').on('click', '.btn-log', function (e) {
							e.stopPropagation();
							var rowid = $(this).closest('tr').attr('id');
							var rowData = $('#select-data').getObj().getRowByTId(rowid);
							_bgPub_showLogModal("budgetItemDecomposeAdd", {
								"bgBillId": rowData.billId,
								"bgItemCode": "",
								"agencyCode": page.agencyCode
							});
						});
					},
				});
				if ($.isNull(page.planData)) {
					return false;
				}
				var url = "/bg/budgetItem/multiPost/getBudgetItems" +
					'?agencyCode=' + page.agencyCode + "&setYear=" + page.pfData.svSetYear;
				var argu = page.setSearchMap(page.planData);
				var data = [];
				var callback = function (result) {
					for (var i = 0; i < result.data.billWithItemsVo.length; i++) {
						page.composePlanId = result.data.billWithItemsVo[0].billWithItems[0].bgPlanId;
						page.composePlanName = result.data.billWithItemsVo[0].billWithItems[0].bgPlanName;
						var item = result.data.billWithItemsVo[i];
						for (var j = 0; j < item.billWithItems.length; j++) {
							//var row = item.billWithItems[j];
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
				ufma.post(url, argu, callback);
				ufma.isShow(reslist);
			},
			setChildTable: function () {
				var columns = page.getChildBudgetHead();
				$('#decompose-data').ufDatagrid({
					data: [],
					idField: 'bgItemCode', // 用于金额汇总
					pId: 'billId', // 用于金额汇总
					disabled: false, // 可选择
					frozenStartColumn: 1, // 冻结开始列,从1开始
					frozenEndColumn: 1, // 冻结结束列
					paginate: true, // 分页
					columns: columns,
					toolbar: [{
						type: 'checkbox',
						class: 'check-all',
						text: '全选'
					},
					{
						type: 'button',
						class: 'btn-default btn-delete',
						text: '删除',
						action: function () {
							var checkData = $('#decompose-data').getObj().getCheckData();
							if (checkData.length == 0) {
								ufma.alert('请先选择您要删除的指标！', 'warning');
								return false;
							}
							var data = [];
							for (var i = 0; i < checkData.length; i++) {
								var rowData = checkData[i];
								data.push({ 'bgItemId': rowData.bgItemId });
							}
							page.delItems(data);
						}
					}
					],
					initComplete: function (options, data) {
						//$('button[data-toggle="tooltip"]').tooltip();
						$('#decompose-data').off("click", '.btn-delete').on('click', '.btn-delete', function (e) {
							e.stopPropagation();
							var rowid = $(this).closest('tr').attr('id');
							var rowData = $('#decompose-data').getObj().getRowByTId(rowid);
							page.delItems([rowData]);
						});
					}
				});
				if ($.isNull(page.planData)) {
					return false;
				}
				var newData = [];
				var billHJJE = 0.00;
				$('#decompose-data').getObj().load([]); // 新增传空
				$('#billHJJE').html($.formatMoney(billHJJE, 2));
				page.tableData = newData;
				$('#btn-newRow-decompose').removeClass('hide');
				//$('#btn-newRow-decompose').trigger("click");
				ufma.isShow(reslist);
				$('#decompose-datamoneybgItemCur').attr("maxlength", "20"); //控制金额列输入不可超出20位
			},
			getAdjustHead: function () { // 2页面上面待分解指标表
				var columns = [];
				var column1 = [ // 支持多表头
					{
						field: 'bgItemCode',
						name: '指标编码',
						rowspan: 2,
						width: 100,
						headalign: 'center'
					}, {
						field: 'bgPlanName',
						name: '预算方案',
						rowspan: 2,
						width: 150,
						headalign: 'center'
					}, {
						field: 'bgItemSummary',
						name: '摘要',
						rowspan: 2,
						className: 'ellipsis',
						width: 200,
						headalign: 'center'
					}
				];
				if (!$.isNull(page.planData)) {
					for (var i = 0; i < page.planData.planVo_Items.length; i++) {
						var item = page.planData.planVo_Items[i];
						var cbItem = item.eleCode;
						column1.push({
							field: bg.shortLineToTF(item.eleFieldName),
							name: item.eleName,
							rowspan: 2,
							width: 240,
							headalign: 'center'
						});
					};
				}
				column1.push({
					field: 'bgItemCur',
					name: '金额',
					width: 150,
					headalign: 'center',
					align: 'right',
					render: function (rowid, rowdata, data) {
						return $.formatMoney(data, 2);
					}
				});
				column1.push({
					field: 'bgItemBalanceCur',
					name: '余额',
					width: 150,
					headalign: 'center',
					align: 'right',
					render: function (rowid, rowdata, data) {
						return $.formatMoney(data, 2);;
					}
				});
				column1
					.push({
						type: 'toolbar',
						field: 'option',
						name: '操作',
						width: 60,
						rowspan: 2,
						headalign: 'center',
						render: function (rowid, rowdata, data) {
							return '<button class="btn btn-log btn-watch-detail btn-permission" data-toggle="tooltip" title="日志"><span class="icon-log"></span></button>';

						}
					});
				columns.push(column1);
				return columns;
			},
			setAdjustTable: function (data) {
				// page.adjGridTop($('#zbtz-data-editor'));
				$('#zbtz-data-editor').ufDatagrid({
					data: data,
					idField: 'bgItemCode', // 用于金额汇总
					pId: 'pid', // 用于金额汇总
					disabled: false, // 可选择
					// frozenStartColumn:1,//冻结开始列,从1开始
					// frozenEndColumn:1, //冻结结束列
					paginate: false, // 分页
					columns: page.getAdjustHead(),
					initComplete: function (options, data) {
						//$('button[data-toggle="tooltip"]').tooltip();
						$('#zbtz-data-editor tr').on('click', '.btn-log', function (e) {
							//e.stopPropagation();
							var rowid = $(this).closest('tr').attr('id');
							var rowData = $('#zbtz-data-editor').getObj().getRowByTId(rowid);
							_bgPub_showLogModal("budgetItemDecomposeAdd", {
								"bgBillId": rowData.billId,
								"bgItemCode": "",
								"agencyCode": page.agencyCode
							});
						});
					}
				});
				ufma.isShow(reslist);
			},

			adjGridTop: function ($table) {
				$.timeOutRun(null, null, function () {
					var gridTop = $table.offset().top;
					var gridHeight = $('.ufma-layout-down').offset().top -
						gridTop - 15;
					$table.getObj().setBodyHeight(gridHeight);
				}, 800);
			},
			setSearchMap: function (planData) {
				var searchMap = {
					'agencyCode': page.agencyCode
				};
				searchMap['bgItemType'] = '2';
				searchMap['bgReserve'] = 1;
				searchMap['status'] = 3;
				searchMap['businessDateBegin'] = $('#createDate1').getObj()
					.getValue();
				searchMap['businessDateEnd'] = $('#createDate2').getObj()
					.getValue();
				searchMap['setYear'] = planData.setYear;
				searchMap['chrId'] = planData.chrId;
				if (!$.isNull(planData)) {
					searchMap['chrId'] = planData.chrId;
					for (var i = 0; i < planData.planVo_Items.length; i++) {
						var item = planData.planVo_Items[i];
						var cbItem = item.eleCode;
						var field = item.eleFieldName;
						var combox = $('#cb' + cbItem).getObj();
						searchMap[bg.shortLineToTF(field)] = combox.getValue();
					};
				}
				return searchMap;
			},
			getRowsSum: function () {
				var rowsSum = $('#decompose-data').getObj().getData();
				var sum = 0;
				for (var i = 0; i < rowsSum.length; i++) {
					sum = sum + parseFloat(rowsSum[i].bgItemCur);
				}
				return sum;
			},
			initSearchPnl: function () {
				uf.cacheDataRun({
					element: $('#cbBgPlan'),
					cacheId: page.agencyCode + '_plan_items',
					url: bg.getUrl('bgPlan') + "?ajax=1" + "&isEnabled=1",
					param: {
						'agencyCode': page.agencyCode,
						'setYear': page.pfData.svSetYear
					},
					callback: function (element, data) {
						element.ufCombox({ // 初始化
							data: data, // 列表数据
							readonly: true, // 可选
							placeholder: "请选择预算方案",
							onChange: function (sender, data) {
								page.planData = data;
								bg.initBgPlanItemPnl(
									$('#searchPlanPnl'), data);
								page.adjGridTop($('#select-data'));
								page.setBudgetTable();
								page.setChildTable();
							}
						});
					}
				});
			},
			initTimeline: function () {
				$('#tzdTimeline').ufTimeline({
					steps: [{
						step: '选择待分解指标',
						target: 'pnl-xzzb'
					}, {
						step: '分解指标',
						target: 'pnl-tzzb'
					}, {
						step: '完成',
						target: 'pnl-end'
					}]
				});
				page.timeline = $('#tzdTimeline').getObj();
				page.timeline.step(1);
			},
			initPage: function () {
				$('#createDate1').ufDatepicker('update', page.pfData.svTransDate.substr(0, 8) + "01");
				$('#createDate2').ufDatepicker('update', page.pfData.svTransDate); //dai  .substr(0, 10);
				page.initTimeline();
				page.initSearchPnl();
				//page.initSearchPnl1();
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
			},
			setBillCode: function () {
				if ($.isNull(window.ownerData.billId)) {
					var url = _bgPub_requestUrlArray_subJs[14];
					var argu = {
						'agencyCode': page.agencyCode,
						'setYear': page.pfData.svSetYear
					};
					argu['billType'] = 2;
					// argu['setYear'] = page.pfData.svSetYear;
					var callback = function (result) {
						page.billId = result.data.billId;
						page.billCode = result.data.billCode;
						$('#billCode').val(page.billCode);
					}
					ufma.get(url, argu, callback);
				} else {
					page.billId = window.ownerData.billId;
					page.billCode = window.ownerData.billCode;
					$('#billCode').val(window.ownerData.billCode);
				}
			},
			save: function () {
				var detailItems = $('#decompose-data').getObj().getData();
				var selectedItems = $('#zbtz-data-editor').getObj().getData();
				selectedItems[0].adjustDir = 2;
				selectedItems[0].isNew = '是';
				var billHJJE = 0.00;
				for (var i = 0; i < detailItems.length; i++) {
					billHJJE = billHJJE +
						ufma.parseFloat(detailItems[i].bgItemCur);
					detailItems[i].isNew = '是';
					detailItems[i].adjustDir = 1;
					detailItems[i].bgItemId = addData[i].bgItemId;
					detailItems[i].setYear = addData[i].setYear;
					detailItems[i].agencyCode = addData[i].agencyCode;
					detailItems[i].bgPlanId = page.planData.chrId;
					detailItems[i].bgPlanCode = page.planData.chrCode;
					detailItems[i].createDate = addData[i].createDate;
					detailItems[i].createUser = addData[i].createUser;
					detailItems[i].createUserName = addData[i].createUserName;
					detailItems[i].latestOpDate = addData[i].latestOpDate;
					detailItems[i].bgCtrlRatio = addData[i].bgCtrlRatio;
					detailItems[i].bgWarnRatio = addData[i].bgWarnRatio;
					detailItems[i].status = addData[i].status;
					detailItems[i].dataSource = addData[i].dataSource;
					detailItems[i].createSource = addData[i].createSource;
					detailItems[i].bgReserve = 1;
					detailItems[i].bgItemCanFpCur = addData[i].bgItemCanFpCur;
					detailItems[i].bgItemFpedCur = addData[i].bgItemFpedCur;
					detailItems[i].bgUseCur = addData[i].bgUseCur;
					detailItems[i].bgItemParentid = selectedItems[0].bgItemId;
					detailItems[i].bgItemParentcode = selectedItems[0].bgItemCode;

				}
				selectedItems[0].bgCutCur = billHJJE;
				selectedItems[0].checkCutCur = billHJJE;
				var items = [];
				items.push(selectedItems[0]);
				for (var i = 0; i < detailItems.length; i++) {
					items.push(detailItems[i]);
				}
				if (ufma.parseFloat(selectedItems[0].bgItemBalanceCur) >= billHJJE) {
					var data = {
						'agencyCode': page.agencyCode,
						'billId': page.billId,
						'billCur': billHJJE,
						'billCode': page.billCode,
						'setYear': page.pfData.svSetYear,
						'createDate': page.pfData.svSysDate,
						'billDate': page.pfData.svTransDate,
						'createUser': page.pfData.svUserCode,
						'createUserName': page.pfData.svUserName,
						'isNew': '是',
						'status': 1,  //新增保存状态就为1
						'latestOpDate': page.pfData.svSysDate,
						'billType': 2,
						'items': items
					};
					var url = _bgPub_requestUrlArray_subJs[4] +
						"?billType=2&agencyCode=" + page.agencyCode + '&setYear=' + page.pfData.svSetYear;
					var callback = function (result) {
						if (result.flag == "success") {
							ufma.showTip("保存成功", null, "success");
							page.timeline.next();
							page.ctrlToolBar();
						} else {
							ufma.showTip("保存失败!" + result.msg, null, "error");
						}

					}
					ufma.post(url, data, callback);
				} else {

					ufma.showTip("分解指标金额之和不可大于待分解指标余额,请修改!", "warning");
				}
			},

			del: function (data) {
				var data = {
					'items': data
				};
				var url = _bgPub_requestUrlArray_subJs[5] + "?agencyCode=" +
					page.agencyCode + "billType=2";
				var callback = function (result) { }
				ufma.post(url, data, callback);
			},
			delItems: function (data) {
				function updateTable() {
					for (var i = 0; i < data.length; i++) {
						var item = data[i];
						var trId = 'decompose-data_row_' + item.bgItemCode;
						$('tr[id="' + trId + '"]').remove();
						//item.shouldSave = "1";
					}
				}
				ufma.confirm('您确定要删除所选择指标吗？', function (ac) {
					if (ac) {
						var argu = {
							'agencyCode': page.agencyCode,
							'setYear': page.pfData.svSetYear,
							'latestOpUser': page.pfData.svUserCode,
							'latestOpUserName': page.pfData.svUserName,
							'items': data
						};
						var url = _bgPub_requestUrlArray_subJs[5] + "?billType=2&agencyCode=" + page.agencyCode;
						var callback = function (result) {
							ufma.showTip('指标已删除！', function () {
								bCanLeave = false;
								updateTable();
								$('#billHJJE').html($.formatMoney(page.getRowsSum()));
							}, 'success');
						};
						$.ufajax(url, 'post', argu, callback);
					}
				}, { 'type': 'warning' });
			},
			onEventListener: function () {
				$('#btn-next').click(function () {
					var data = [];
					if (page.timeline.stepIndex() == 1) {
						data = $('#select-data').getObj().getCheckData();
						if (data.length == 0) {
							ufma.showTip('请选择需要分解的指标！', function () { }, 'error');
							return false;
						}
						if (data[0].bgItemBalanceCur <= 0) {
							ufma.showTip('该指标可用余额为0,请重新选择一条指标！', function () { }, 'error');
							return false;
						}
					}
					page.timeline.next();
					page.ctrlToolBar();
					page.setBillCode();
					if (page.timeline.stepIndex() == 2) {
						page.setAdjustTable(data); // 表格显示后再调用，否则看不到表格
					}
					$('#btn-newRow-decompose').trigger("click");
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
					close('continue');
				});
				$('#btn-close').click(function () {
					close('ok');
				});
				$('.btn-more-item').click(function () {
					page.adjGridTop($('#select-data'));
				});
				$('#btnQry').click(function () {
					page.setBudgetTable();
				});
				$('#zbtz-data-editor').on(
					'keyup',
					'input[name="bgItemFpedCur"]',
					function (e) {
						e.stopPropagation();
						e.preventDefault();
						var $row = $(this).closest('tr');
						var blCur = $row.find(
							'td[name="bgItemBalanceCur"] .cell-label')
							.text();
						blCur = blCur.replaceAll(',', '');
						var val = $(this).val();
						if (val == '')
							val == 0.00;
						var hj = parseFloat(blCur) - val;
						$row.find('td[name="bgItemCurHJ"] .cell-label')
							.html($.formatMoney(hj));
						if (hj < 0) {
							ufma.showTip('可分配金额不足！', function () { }, 'warning');
							$('#btn-save').attr('disabled', 'disabled');
						} else {
							$('#btn-save').removeAttr('disabled',
								'disabled');
						}
					});

				/**
				 * 上传附件
				 */
				$('#btnUploadFile').on('click',
					function (e) {
						e.stopPropagation();
						var modal_billAttachment = [];
						var option = {
							"agencyCode": page.agencyCode,
							"billId": page.billId,
							"uploadURL": _bgPub_requestUrlArray_subJs[8] + "?agencyCode=" + page.agencyCode +
								"&billId=" + page.billId,
							"delURL": _bgPub_requestUrlArray_subJs[16] +
								"?agencyCode=" + page.agencyCode +
								"&billId=" + page.billId,
							"downloadURL": _bgPub_requestUrlArray_subJs[15] +
								"?agencyCode=" + page.agencyCode +
								"&billId=" + page.billId,
							"onClose": function (fileList) {
								$("#billFJ").val(fileList.length + "");
								modal_billAttachment = cloneObj(fileList);
							}
						};
						_bgPub_ImpAttachment("pnl-tzzb", "指标单据[" +
							page.billCode + "]附件导入",
							modal_billAttachment, option);

					});
				/**
				 * 模态框表格-新增一行[本质就是获得一条指标] 特点：手工录入 + 新增未审核 + 可执行指标
				 */
				$('#btn-newRow-decompose').click(
					function () {
						var tmpChrId = $('#cbBgPlan_value').val();
						if (tmpChrId == "") {
							ufma.showTip("请先选择一个预算方案", null,
								"warning");
							return;
						}
						ufma.get(
							_bgPub_requestUrlArray_subJs[3] + "?agencyCode=" + page.agencyCode + "&setYear=" + page.pfData.svSetYear, // 3
							// 新增一条指标
							{
								"bgPlanChrId": page.planData.chrId,
								"bgPlanChrCode": page.planData.chrCode,
								"agencyCode": page.agencyCode,
								"billType": '2',
								"bgReserve": '2'
							},
							function (result) {
								if (result.flag == "success") {
									addData.push(result.data);
									var newRow = page.getChildBudgetHead();
									var newdata = {};
									for (var i = 0; i < newRow[0].length; i++) {
										if (i == 1) {
											newdata[newRow[0][i].field] = result.data.bgItemCode;
										} else {
											newdata[newRow[0][i].field] = "";
										}
									}
									//newdata.bgItemId = addData.bgItemId;
									var obj = $('#decompose-data').getObj(); // 取对象
									var newId = obj.add(newdata);
								}
							});
					});
				$(document).on('mousedown', '#decompose-data .btn-del', function (e) {
					e.stopPropagation();
					var rowid = $(this).closest('tr').attr('id');
					var obj = $('#decompose-data').getObj(); // 取对象
					obj.del(rowid);
					$('#billHJJE').html($.formatMoney(page.getRowsSum()));
				});
			},
			// 此方法必须保留
			init: function () {
				reslist = ufma.getPermission();
				ufma.isShow(reslist);
				page.pfData = ufma.getCommonData();
				ufma.parse();
				uf.parse();
				page.agencyCode = window.ownerData.agencyCode;
				this.initPage();
				this.onEventListener();
				$("#createDate1 input").attr("disabled", false);
				$("#createDate1 span").show();
				$("#createDate1").css("background", "#ffffff");
			}
		}
	}();
	// ///////////////////
	page.init();
});
