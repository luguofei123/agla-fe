$(function () {
	var agencyCode = null;
	var page = function () {
		return {
			agencyCode: '',
			planData: '',
			bgData: {},
			tableData: [],
			getBudgetHead: function () {
				var column = [ // 支持多表头
					{
						type: 'checkbox',
						field: '',
						name: '',
						width: 40,
						headalign: 'center',
						align: 'center'
					}, {
						field: 'bgItemCode',
						name: '指标编码',
						width: 100,
						headalign: 'center'
					}, {
						field: 'bgItemSummary',
						name: '摘要',
						width: 200,
						className: 'ellipsis',
						headalign: 'center'
					}];
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
					}
					;
				}
				column.push({
					field: 'bgItemCur',
					name: '金额',
					width: 150,
					headalign: 'center',
					align: 'right',
					render: function (rowid, rowdata, data) {
						return $.formatMoney(data, 2);
					}
				});
				column.push({
					type: 'toolbar',
					field: 'option',
					name: '操作',
					width: 90,
					headalign: 'center',
					render: function (rowid, rowdata, data) {
						if (rowdata.status == "1") {
							return '<button class="btn btn-edit btn-permission bgtooltip bgmintooltip" data-toggle="tooltip" title="编辑"><span class="icon-edit"></span></button>'
								+ '<button class="btn btn-audit  btn-permission bgtooltip bgmintooltip" data-toggle="tooltip" title="审核"><span class="icon-audit"></span></button>'
								+ '<button class="btn btn-delete btn-permission btn-del bgtooltip bgmintooltip" data-toggle="tooltip" title="删除"><span class="icon-trash"></span></button>';
						} else if (rowdata.status == "3") {
							return '<button class="btn btn-un-audit btn-permission bgtooltip bgmintooltip" data-toggle="tooltip" title="销审"><span class="icon-cancel-audit"></span></button>'
								+ '<button class="btn btn-watch-detail btn-permission bgtooltip bgmintooltip" data-toggle="tooltip" title="日志"><span class="icon-log"></span></button>';
						} else {
							return '';
						}
					}
				});
				return [column];
			},
			getSearchMap: function (planData) {
				var searchMap = bg.getBgPlanItemMap(planData);
				searchMap['billType'] = 2;
				searchMap['bgReserve'] = 1;
				searchMap['businessDateBegin'] = $('#createDate1').getObj()
					.getValue();
				searchMap['businessDateEnd'] = $('#createDate2').getObj()
					.getValue();
				searchMap['status'] = $('#tabStatus .active a').data('status');
				return searchMap;
			},
			setTable: function () {
				var status = $('#tabStatus .active a').data('status');
				var columns = page.getBudgetHead();
				$('#zbfj-data').ufDatagrid(
					{
						data: [],
						idField: 'id', // 用于金额汇总
						pId: 'billId', // 用于金额汇总
						disabled: false, // 可选择
						frozenStartColumn: 1, // 冻结开始列,从1开始
						frozenEndColumn: 1, // 冻结结束列
						paginate: true, // 分页
						pagingType: "full_numbers",// 分页样式
						lengthChange: true,// 是否允许用户自定9义显示数量p
						lengthMenu: [
							[10, 20, 50, 100, 200, -1],
							[10, 20, 50, 100, 200, "全部"]],
						pageLength: 20,
						columns: columns,
						// 合并列
						mergeColumns: function (rowid, rowdata) {
							var merges = [];
							if (rowdata.pId == 0
								&& rowdata.status == 1) {
								// 同一行可以合并多列
								merges.push({
									columnIndex: 1,
									colSpan: columns[0].length - 2,
									text: '<a class="viewBill btn-watch btn-permission  btn-permission"><span class="billtop-color mr30">单据编号：'
										+ rowdata.billCode
										+ '</span><span class="billtop-color mr30">单据日期：'
										+ ufma.parseNull(rowdata.billDate)
										+ '</span><span class="mr30 billtop-color">单据金额：'
										+ ufma.parseFloat(rowdata.billCur, 2)
										+ '</span></a>'
								});
							}
							if (rowdata.pId == 0
								&& rowdata.status == 3) {
								// 同一行可以合并多列
								merges.push({
									columnIndex: 1,
									colSpan: columns[0].length - 2,
									text: '<a class="viewBill  btn-watch btn-permission btn-permission"><span class="billtop-color mr30">单据编号：'
										+ rowdata.billCode
										+ '</span><span class="billtop-color mr30">单据日期：'
										+ ufma.parseNull(rowdata.billDate)
										+ '</span><span class="mr30 billtop-color">单据金额：'
										+ ufma.parseFloat(rowdata.billCur, 2)
										+ '</span><span class="billtop-color mr30">审核日期：'
										+ ufma.parseNull(rowdata.checkDate).substr(0, 10)
										+ '</span></a>'
								});
							}
							if (rowdata.isFooter == '1') {
								merges.push({
									columnIndex: 1,
									colSpan: columns[0].length - 2,
									text: '<a class="fr viewBill btn-watch btn-permission">更多</a>'
								});
							}
							return merges
						},
						// 合并行
						mergeRows: function (prevRowdata, rowdata) {
							var merges = [];
							if (prevRowdata['billId'] == rowdata['billId']) {
								merges.push(0);
								merges.push(-1);
							}
							return merges
						},
						toolbar: [
							{
								type: 'checkbox',
								class: 'check-all',
								text: '全选'
							},
							{
								type: 'button',
								class: 'btn-default btn-delete btn-permission btn-hide hide',
								text: '删除',
								action: function () {
									var checkData = $('#zbfj-data').getObj().getCheckData();
									if (checkData.length == 0) {
										ufma.alert('请选择单据！',
											function () { }, 'warning');
										return false;
									}
									var data = [];
									for (var i = 0; i < checkData.length; i++) {
										data.push({
											'billId': checkData[i].billId
										});
									}
									page.delBills(data);
								}
							},
							{
								type: 'button',
								class: 'btn-default btn-audit  btn-permission btn-checked btn-hide hide',
								text: '审核',
								action: function () {
									var checkData = $('#zbfj-data').getObj().getCheckData();
									if (checkData.length == 0) {
										ufma.alert('请选择单据！',
											function () {
											}, 'warning');
										return false;
									}
									var data = [];
									for (var i = 0; i < checkData.length; i++) {
										data.push({
											'billId': checkData[i].billId
										});
									}
									page.checkBills(data);
								}
							},
							{
								type: 'button',
								class: 'btn-default btn-un-audit  btn-permission  btn-hide hide',
								text: '销审',
								action: function () {
									var checkData = $('#zbfj-data').getObj().getCheckData();
									if (checkData.length == 0) {
										ufma.alert('请选择单据！',
											function () {
											}, 'warning');
										return false;
									}
									var data = [];
									for (var i = 0; i < checkData.length; i++) {
										data.push({
											'billId': checkData[i].billId
										});
									}
									page.checkBills(data);
								}
							}],
						initComplete: function (options, data) {
							page.adjGridTop();
							$('#zbfj-data tr').off("click", '.btn-del').on('click', '.btn-del',
								function (e) {
									e.stopPropagation();
									var rowid = $(this).closest('tr').attr('id');
									var rowData = $('#zbfj-data').getObj().getRowByTId(rowid);
									page.delBills([{
										'billId': rowData.billId
									}]);
								});
							$('#zbfj-data tr').off("click", '.btn-audit').on('click', '.btn-audit',
								function (e) {
									e.stopPropagation();
									var rowid = $(this).closest('tr').attr('id');
									var rowData = $('#zbfj-data').getObj().getRowByTId(rowid);
									page.checkBills([{
										'billId': rowData.billId
									}]);
								});

							$('#zbfj-data tr').off("click", '.btn-un-audit').on('click', '.btn-un-audit',
								function (e) {
									e.stopPropagation();
									var rowid = $(this).closest('tr').attr('id');
									var rowData = $('#zbfj-data').getObj().getRowByTId(rowid);
									page.checkBills([{
										'billId': rowData.billId
									}]);
								});
							$('#zbfj-data tr').on('click', '.btn-watch-detail',
								function (e) {
									e.stopPropagation();
									var rowid = $(this).closest('tr').attr('id');
									var rowData = $('#zbfj-data').getObj().getRowByTId(rowid);
									_bgPub_showLogModal(
										"budgetItemDecompose",
										{
											"bgBillId": rowData.billId,
											"bgItemCode": "",
											"agencyCode": page.agencyCode
										});
								});
							$('.viewBill').off("click").on('click',
								function (e) {
									if ($.isNull(page.agencyCode)) {
										ufma.alert('请选择单位！', 'error');
										return false;
									}

									var rowid = $(this).closest('tr').attr('id');
									var rowData = $('#zbfj-data').getObj().getRowByTId(rowid);
									page.openEditWin('edit', rowData.billId);
								});
							$('#zbfj-data tr').off("click", '.btn-edit').on('click', '.btn-edit',
								function (e) {
									if ($.isNull(page.agencyCode)) {
										ufma.alert('请选择单位！', 'error');
										return false;
									}
									var rowid = $(this).closest(
										'tr').attr('id');
									var rowData = $('#zbfj-data').getObj().getRowByTId(rowid);
									page.openEditWin('edit', rowData.billId);
								});
							switch (status) {
								case 1:
									if (data.length > 0) {
										$('#zbfj-data button').removeAttr('disabled');
										$('#zbfj-data .btn-edit').removeClass('hide');
										$('#zbfj-data .btn-checked').removeClass('hide');
										$('#zbfj-data .btn-delete').removeClass('hide');
										$('#zbfj-data .btn-checked').attr('data-status', '3');
									} else {
										$('#zbfj-data button').attr('disabled', 'disabled');

									}

									break;
								case 3:
									if (data.length > 0) {
										$('#zbfj-data .btn-checked').removeAttr('disabled');
										$('#zbfj-data .btn-checked').attr('data-status', '1');
										$('#zbfj-data .btn-un-audit').removeClass('hide');
										$('#zbfj-data .btn-delete').addClass('hide');
										$('#zbfj-data .btn-edit').addClass('hide');
									} else {
										$('#zbfj-data .btn-checked').attr('disabled', 'disabled');
										$('#zbfj-data .btn-edit').removeClass('hide');
										$('#zbfj-data .btn-delete').addClass('hide');
									}
									break;
								default:
									$('#zbfj-data .btn-hide').addClass('hide');
									break;
							}
						}
					});


				if ($.isNull(page.planData)) {
					return false;
				}
				var url = "/bg/budgetItem/multiPost/getBills" + "?agencyCode="
					+ page.agencyCode + "&setYear=" + page.pfData.svSetYear;
				var argu = page.getSearchMap(page.planData);
				var data = [];
				var callback = function (result) {
					//page.bgData = result.data;
					// 需要将树结构转为扁平结构
					var newData = [];
					var billNum = 0;
					var billHJJE = 0.00;
					var billData = result.data.billWithItemsVo;
					for (var i = 0; i < result.data.billWithItemsVo.length; i++) {
						var item = result.data.billWithItemsVo[i];
						billHJJE = billHJJE + item.billCur;
						page.bgData[item.billId] = item;
						var tmpItem = $.extend({
							'id': item.billId,
							'pId': '0',
							isFooter: 0
						}, item);
						delete tmpItem['billWithItems'];
						newData.push(tmpItem);
						for (var j = 0; j < item.billWithItems.length; j++) {
							if (billData[i].billWithItems[j].adjustDir == 2) {
								if (j >= 5)
									break;
								//billHJJE = billHJJE+ item.billWithItems[j].bgItemCur;
								row = item.billWithItems[j];
								var tmpRow = $.extend({}, tmpItem, row);
								tmpRow["id"] = row.bgItemId;
								tmpRow["pId"] = row.billId;
								newData.push(tmpRow);
								billNum = billNum + 1;
							}
						}
						var footerData = $.extend({}, tmpItem, {
							'id': item.billId + '-1',
							'pId': item.billId,
							isFooter: 1
						});
						newData.push(footerData);
					}
					$('#billNum').html(billNum);
					$('#billHJJE').html($.formatMoney(billHJJE, 2));
					$('#zbfj-data').getObj().load(newData);
					page.tableData = newData;
					ufma.isShow(reslist);
				}
				ufma.post(url, argu, callback);

			},
			initAgency: function () {
				bg.setAgencyCombox($('#cbAgency'), { "setYear": page.pfData.svSetYear }, function (sender,
					treeNode) {
					page.agencyCode = treeNode.id;
					page.initSearchPnl();
				});
			},

			initSearchPnl: function () {
				uf.cacheDataRun({
					element: $('#cbBgPlan'),
					cacheId: page.agencyCode + '_plan_items',
					url: bg.getUrl('bgPlan') + "?ajax=1",
					param: {
						'agencyCode': page.agencyCode,
						'setYear': page.pfData.svSetYear
					},
					callback: function (element, data) {
						element
							.ufCombox({// 初始化
								data: data,// 列表数据
								readonly: true,// 可选
								placeholder: "请选择预算方案",
								onChange: function (sender, data) {
									page.planData = data;
									bg.initBgPlanItemPnl(
										$('#searchPlanPnl'), data);
									page.adjGridTop();
									page.setTable();
								}
							});
					}
				});
			},
			adjGridTop: function () {
				$.timeOutRun(null, null, function () {
					var gridTop = $('#zbfj-data').offset().top;
					var gridHeight = $(window).height() - gridTop;
					$('#zbfj-data').getObj().setBodyHeight(gridHeight);
				}, 800);

			},
			delBills: function (data) {
				ufma.confirm('您确定要删除所选择单据吗？', function (ac) {
					if (ac) {
						var argu = {
							'agencyCode': page.agencyCode,
							'setYear': page.pfData.svSetYear,
							'items': data
						};
						var url = _bgPub_requestUrlArray_subJs[5]
							+ "?billType=2&agencyCode=" + page.agencyCode;
						var callback = function (result) {
							page.setTable();
						};
						$.ufajax(url, 'post', argu, callback);
					}
				}, {
						'type': 'warning'
					});
			},
			checkBills: function (data) {
				var argu = {
					'agencyCode': page.agencyCode,
					'items': data
				};
				var $selNav = $(".nav.nav-tabs").find("li.active");
				var statusNav = $selNav.find("a").attr("data-status");
				if (statusNav == "1") {
					ufma.confirm('您确定要审核选择的单据吗？', function (ac) {
						if (ac) {
							argu.checkUser = page.pfData.svUserCode;
							argu.setYear = page.pfData.svSetYear;
							argu.status = "3";
							argu.billType = "2";
							argu.checkUserName = page.pfData.svUserName;
							argu.checkDate = page.pfData.svSysDate;
							var url = _bgPub_requestUrlArray_subJs[12]
								+ "?billType=2&agencyCode="
								+ page.agencyCode;
							var callback = function (result) {
								ufma.showTip('审核成功！', function () {
									page.setTable();
								}, 'success');
							};
							ufma.post(url, argu, callback);
						}
					}, {
							'type': 'warning'
						});

				}
				else if (statusNav == "3") {
					ufma.confirm('您确定要销审选择的单据吗？', function (ac) {
						if (ac) {
							argu.status = "1";
							argu.billType = "2";
							argu.setYear = page.pfData.svSetYear;
							argu.checkUser = page.pfData.svUserCode;
							argu.checkUserName = page.pfData.svUserName;
							argu.checkDate = page.pfData.svSysDate;
							var url = _bgPub_requestUrlArray_subJs[13]
								+ "?billType=2&agencyCode="
								+ page.agencyCode;
							var callback = function (result) {
								ufma.showTip('销审成功！', function () {
									page.setTable();
								}, 'success');
							};
							ufma.post(url, argu, callback);
						}
					}, {
							'type': 'warning'
						});
				}
			},
			openEditWin: function (action, billId) {
				if (action == 'add') {
					var stitle = '新增指标分解';
					ufma.open({
						url: 'indexDecompositionAdd.html',
						title: stitle,
						width: 1090,
						data: {
							'agencyCode': page.agencyCode,
							'action': action,
							'billId': billId,
							'planId': page.planData.chrId,
							'planData': page.planData
						},
						ondestory: function (result) {
							if (result.action == 'ok') {
								page.setTable();
							}
							if (result.action == 'continue') {
								page.openEditWin('add', '');
							}
						}
					});
				}
				else if (action == 'edit') {
					stitle = '编辑指标分解';
					ufma.open({
						url: 'indexDecompositionEdit.html',
						title: stitle,
						width: 1090,
						data: {
							'agencyCode': page.agencyCode,
							'action': action,
							'billId': billId,
							'planId': page.planData.chrId,
							'planData': page.planData
						},
						ondestory: function (result) {
							if (result.action == 'ok') {
								page.setTable();
							}

						}
					});
				}
				ufma.setObjectCache('curBillData', page.bgData[billId]);

			},
			initPage: function () {
				$('#createDate1').ufDatepicker('update', page.pfData.svTransDate.substr(0, 8) + "01");
				$('#createDate2').ufDatepicker('update', page.pfData.svTransDate);
				page.initAgency();
				page.adjGridTop();
				$.timeOutRun(null, null, function () {
					$('#cbAgency').getObj().val(page.agencyCode);
					page.initSearchPnl();
				}, 1000);

			},

			onEventListener: function () {
				$('#tabStatus').on('click', 'li', function () {
					page.setTable();
				});
				$('#print').click(function () {
					$("#zbfj-data").ufPrintTable({
						mode: "rowNumber",
						header: "headerInfo",
						pageNumStyle: "第#p页/共#p页",
						pageNumClass: ".pageNum",
						pageSize: 20
					});
				});
				$('#export').click(function () {
					$("#zbfj-data").ufTableExport({
						fileName: "指标分解单", // 导出表名
						ignoreColumn: "-1" // 不需要导出的LIE
					});
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
					var beginDate = $('#createDate1').getObj().getValue();
					var endDate = $('#createDate2').getObj().getValue();
					if (beginDate > endDate) {
						ufma.showTip("开始日期不得小于结束日期", null, "error");
					} else {
						var tmpChrId = $('#cbBgPlan_value').val();
						if (tmpChrId == "") {
							ufma.showTip("请先选择一个预算方案", null, "warning");
							return;
						}
						page.setTable();
					}

				});


			},
			// 此方法必须保留
			init: function () {
				reslist = ufma.getPermission();
				ufma.isShow(reslist);
				page.pfData = ufma.getCommonData();
				page.agencyCode = page.pfData.svAgencyCode;
				ufma.parse();
				uf.parse();
				this.initPage();
				//this.setTable();   //修改guohx  不选预算方案不展示表头
				this.onEventListener();
				_BgPub_AddListenToToolTip();
			}
		}
	}();
	// ///////////////////
	page.init();
});
