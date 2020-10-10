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
						width: "40px",
						headalign: 'center',
						className: 'no-print',
						align: 'center'
					}, {
						field: 'bgItemCode',
						name: '指标编码',
						width: 120,
						headalign: 'center',
						className: 'nowrap BGasscodeClass',
						"render": function (rowid, rowdata, data) {
							if (!$.isNull(data)) {
								return '<code title="' + data + '">' + data + '</code>';
							} else {
								return '';
							}
						}
					},{
						field: 'bgTypeName',
						name: '指标类型',
						width: 200,
						className: 'BGThirtyLen nowrap',
						headalign: 'center',
						"render": function (rowid, rowdata, data) {
							if (!$.isNull(data)) {
								return '<code title="' + data + '">' + data + '</code>';
							} else {
								return '';
							}
						}
					}, {
						field: 'bgItemSummary',
						name: '摘要',
						width: 200,
						className: 'BGThirtyLen nowrap',
						headalign: 'center',
						"render": function (rowid, rowdata, data) {
							if (!$.isNull(data)) {
								return '<code title="' + data + '">' + data + '</code>';
							} else {
								return '';
							}
						}
					}
				];
				if (page.planData.isComeDocNum == "是") {
					column.push({
						field: 'comeDocNum',
						name: '来文文号',
						className: 'BGThirtyLen nowrap',
						width: 200,
						headalign: 'center',
						"render": function (rowid, rowdata, data) {
							if (!$.isNull(data)) {
								return '<code title="' + data + '">' + data + '</code>';
							} else {
								return '';
							}
						}
					});
				}
				if (page.planData.isSendDocNum == "是") {
					column.push({
						field: 'sendDocNum',
						name: page.sendCloName,
						className: 'BGThirtyLen nowrap',
						width: 200,
						headalign: 'center',
						"render": function (rowid, rowdata, data) {
							if (!$.isNull(data)) {
								return '<code title="' + data + '">' + data + '</code>';
							} else {
								return '';
							}
						}
					});
         }
          //CWYXM-17554 预算方案设置中，增加财政指标ID属性，可选择是否启用，启用时，选择预算方案新增指标时，需要录入指标id，指标id也需要参与指标的要素唯一性校验--zsj
         // CWYXM-18202 指标分解界面无财政指标id,具体见截图,方案启用了财政指标id--zsj
          if (page.planData.isFinancialBudget == "1") {
            column.push({
              field: "bgItemIdMx",
              name: '财政指标ID',
              className: "nowrap BGThirtyLen",
              width: 200,
              headalign: 'center',
              "render": function (rowid, rowdata, data) {
                if (!$.isNull(data)) {
                  return '<code title="' + data + '">' + data + '</code>';
                } else {
                  return '';
                }
              }
            });
          } 
				if (!$.isNull(page.planData)) {
					for (var i = 0; i < page.planData.planVo_Items.length; i++) {
						var item = page.planData.planVo_Items[i];
						var cbItem = item.eleCode;
						if (cbItem == "ISUPBUDGET") {
              column.push({
								field: 'isUpBudget',
								name: '是否采购',
								className: 'nowrap',
								// width: 150,
                headalign: 'center',
                align: 'center',
								"render": function (rowid, rowdata, data) {
                  if (!$.isNull(data)) {
                    return '<code title="' + data + '">' + data + '</code>';
                  } else {
                    return '';
                  }
								}
							});
						} else {
              //CWYXM-17554 预算方案设置中，增加财政指标ID属性，可选择是否启用，启用时，选择预算方案新增指标时，需要录入指标id，指标id也需要参与指标的要素唯一性校验--zsj
              if (cbItem != 'sendDocNum' &&  cbItem != 'bgItemIdMx') {
                var fieldNew = bg.shortLineToTF(item.eleFieldName) + 'Name';
                column.push({
                  field: fieldNew,
                  name: item.eleName,
                  width: 200,
                  headalign: 'center',
                  className: 'BGThirtyLen nowrap',
                  "render": function (rowid, rowdata, data) {
                    if (!$.isNull(data)) {
                      return '<code title="' + data + '">' + data + '</code>';
                    } else {
                      return '';
                    }
                  }
                });
              }
						}
          };
          //CWYXM-18080 编制指标时需要增加文本说明项，只录入文本，用于描述指标信息--zsj--查询条件区域
          for (var k = 0; k < page.planData.planVo_Txts.length; k++) {
            var fieldNew = bg.shortLineToTF(page.planData.planVo_Txts[k].eleFieldName);
            column.push({
              field: fieldNew,
              name: page.planData.planVo_Txts[k].eleName,
              width: 200,
              headalign: 'center',
              className: 'BGThirtyLen nowrap',
              "render": function (rowid, rowdata, data) {
                if (!$.isNull(data)) {
                  return '<code title="' + data + '">' + data + '</code>';
                } else {
                  return '';
                }
              }
            });
          }
				}
				column.push({
					field: 'bgItemCur', //CWYXM-10727 指标分解新增页面，金额应显示最初指标编制金额--zsj
					name: '金额',
					width: 150,
					headalign: 'center',
          align: 'right',
          className: 'BGThirtyLen nowrap',
					"render": function (rowid, rowdata, data) {
            if (!$.isNull(data)) {
              return '<code title="' + data + '">' + $.formatMoney(data, 2) + '</code>'
            } else {
              return '';
            }
					}
				});
				column.push({
					type: 'toolbar',
					field: 'option',
					name: '操作',
					width: 90,
          headalign: 'center',
          className: 'nowrap no-print',
					render: function (rowid, rowdata, data) {
						if (rowdata.status == "1") {
							return '<button class="btn btn-edit btn-permission bgtooltip bgmintooltip" data-toggle="tooltip" title="编辑"><span class="icon-edit"></span></button>' +
								'<button class="btn btn-audit  btn-permission bgtooltip bgmintooltip" data-toggle="tooltip" title="审核"><span class="icon-audit"></span></button>' +
								'<button class="btn btn-delete btn-permission btn-del bgtooltip bgmintooltip" data-toggle="tooltip" title="删除"><span class="icon-trash"></span></button>';
						} else if (rowdata.status == "3") {
							return '<button class="btn btn-un-audit btn-permission bgtooltip bgmintooltip" data-toggle="tooltip" title="销审"><span class="icon-cancel-audit"></span></button>' +
								'<button class="btn btn-watch-detail btn-permission bgtooltip bgmintooltip" data-toggle="tooltip" title="日志"><span class="icon-log"></span></button>';
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
				$('#zbfj-data').ufDatagrid({
					data: [],
					idField: 'id', // 用于金额汇总
					pId: 'billId', // 用于金额汇总
					disabled: false, // 可选择
					frozenStartColumn: 0, // 冻结开始列,从1开始
					frozenEndColumn: 0, // 冻结结束列
					paginate: true, // 分页
					pagingType: "full_numbers", // 分页样式
					lengthChange: true, // 是否允许用户自定9义显示数量p
					lengthMenu: [
						[10, 20, 50, 100, 200, -1],
						[10, 20, 50, 100, 200, "全部"]
					],
					pageLength: 20,
					columns: columns,
					// 合并列
					mergeColumns: function (rowid, rowdata) {
						var merges = [];
						if (rowdata.pId == 0 &&
							rowdata.status == 1) {
							// 同一行可以合并多列
							merges.push({
								columnIndex: 1,
								colSpan: columns[0].length - 2,
								text: '<a class="viewBill btn-watch common-jump-link"><span class=" mr30">单据编号：' +
									rowdata.billCode +
									'</span><span class=" mr30">单据日期：' +
									ufma.parseNull(rowdata.billDate) +
									'</span><span class="mr30 ">单据金额：' +
									//ufma.parseFloat(rowdata.billCur, 2) +
									$.formatMoney(rowdata.billCur, 2) +
									'</span></a>'
							});
						}
						if (rowdata.pId == 0 &&
							rowdata.status == 3) {
							// 同一行可以合并多列
							merges.push({
								columnIndex: 1,
								colSpan: columns[0].length - 2,
								text: '<a class="viewBill  btn-watch common-jump-link"><span class=" mr30">单据编号：' +
									rowdata.billCode +
									'</span><span class=" mr30">单据日期：' +
									ufma.parseNull(rowdata.billDate) +
									'</span><span class="mr30 ">单据金额：' +
									$.formatMoney(rowdata.billCur, 2) +
									'</span><span class=" mr30">审核日期：' +
									ufma.parseNull(rowdata.checkDate).substr(0, 10) +
									'</span></a>'
							});
						}
						if (rowdata.isFooter == '1') {
							merges.push({
								columnIndex: 1,
								colSpan: columns[0].length - 2,
								text: '<a class="fr viewBill btn-watch btn-permission common-jump-link">更多</a>'
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
					toolbar: [{
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
									ufma.showTip('请选择单据！',
										function () {}, 'warning');
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
									ufma.showTip('请选择单据！',
										function () {}, 'warning');
									return false;
								}
								var data = [];
								for (var i = 0; i < checkData.length; i++) {
									data.push({
										'billId': checkData[i].billId
									});
								}
								page.checkBills(data, 1);
							}
						},
						{
							type: 'button',
							class: 'btn-default btn-un-audit  btn-permission  btn-hide hide',
							text: '销审',
							action: function () {
								var checkData = $('#zbfj-data').getObj().getCheckData();
								if (checkData.length == 0) {
									ufma.showTip('请选择单据！',
										function () {}, 'warning');
									return false;
								}
								var data = [];
								for (var i = 0; i < checkData.length; i++) {
									data.push({
										'billId': checkData[i].billId
									});
								}
								page.checkBills(data, 3);
							}
						}
					],
					initComplete: function (options, data) {

						$('#zbfj-data tr').off("click", '.btn-del').on('click', '.btn-del',
							function (e) {
								e.stopPropagation();
								var rowid = $(this).closest('tr').attr('id');
								var rowData = $('#zbfj-data').getObj().getRowByTId(rowid);
								//bugCWYXM-5940--主界面行删除不应该做这个判断--zsj 
								/*if($('#zbfj-data').getObj().getData().length == 1) {
										ufma.showTip('至少需要一条分解指标', function() {}, 'warning');
										return false;
									}*/
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
								}], 1);
							});

						$('#zbfj-data tr').off("click", '.btn-un-audit').on('click', '.btn-un-audit',
							function (e) {
								e.stopPropagation();
								var rowid = $(this).closest('tr').attr('id');
								var rowData = $('#zbfj-data').getObj().getRowByTId(rowid);
								page.checkBills([{
									'billId': rowData.billId
								}], 3);
							});
						$('#zbfj-data tr').on('click', '.btn-watch-detail',
							function (e) {
								e.stopPropagation();
								var rowid = $(this).closest('tr').attr('id');
								var rowData = $('#zbfj-data').getObj().getRowByTId(rowid);
								_bgPub_showLogModal(
									"budgetItemDecompose", {
										"bgBillId": rowData.billId,
										"bgItemCode": "",
										"agencyCode": page.agencyCode
									});
							});
						$('.viewBill').off("click").on('click',
							function (e) {
								if ($.isNull(page.agencyCode)) {
									ufma.showTip('请选择单位！',function(){}, 'warning');
									return false;
								}

								var rowid = $(this).closest('tr').attr('id');
								var rowData = $('#zbfj-data').getObj().getRowByTId(rowid);
								page.openEditWin('edit', rowData.billId, rowData.status);
							});
						$('#zbfj-data tr').off("click", '.btn-edit').on('click', '.btn-edit',
							function (e) {
								if ($.isNull(page.agencyCode)) {
									ufma.showTip('请选择单位！',function(){}, 'warning');
									return false;
								}
								var rowid = $(this).closest(
									'tr').attr('id');
								var rowData = $('#zbfj-data').getObj().getRowByTId(rowid);
								page.openEditWin('edit', rowData.billId, rowData.status);
							});

						if ($('#zbfj-data').find('.zbtz-data-caption').length == 0) {
							var _caption = $('.zbtz-data-caption').clone();
							_caption.removeClass('none');
							$('#zbfj-dataFoot').before(_caption);
						}
						page.adjGridTop();
						//拖动表头
						/*与雪蕊沟通后注释拖动列--CWYXM-11319 --指标调剂列表查看，预算方案列应为左对齐--zsj
						 * $('#zbfj-dataHead .uf-grid-head-view table').tblcolResizable({
							'bindTable': '#zbfj-dataBody .uf-grid-body-view table'
						});*/
						ufma.isShow(reslist);
					}
				});

				switch (status) {
					case 1:
						$('#zbfj-data button').removeAttr('disabled');
						$('#zbfj-data .btn-edit').removeClass('hide');
						$('#zbfj-data .btn-checked').removeClass('hide');
						$('#zbfj-data .btn-delete').removeClass('hide');
						$('#zbfj-data .btn-checked').attr('data-status', '3');
						break;
					case 3:
						$('#zbfj-data .btn-checked').removeAttr('disabled');
						$('#zbfj-data .btn-checked').attr('data-status', '1');
						$('#zbfj-data .btn-un-audit').removeClass('hide');
						$('#zbfj-data .btn-delete').addClass('hide');
						$('#zbfj-data .btn-edit').addClass('hide');
						break;
					default:
						$('#zbfj-data .btn-hide').addClass('hide');
						break;
				}

				if ($.isNull(page.planData)) {
					return false;
				}
				var url = "/bg/budgetItem/multiPost/getBills" + "?agencyCode=" +
					page.agencyCode + "&setYear=" + page.useYear;
				var argu = page.getSearchMap(page.planData);
				var data = [];
				ufma.showloading('数据加载中，请耐心等待...');
				var callback = function (result) {
					ufma.hideloading();
					//page.bgData = result.data;
					// 需要将树结构转为扁平结构
					var newData = [];
					var billNum = result.data.billWithItemsVo.length;
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
							//if (billData[i].billWithItems[j].adjustDir == 1) {  //主界面显示子指标
							if (j >= 5)
								break;
							//billHJJE = billHJJE+ item.billWithItems[j].bgItemCur;
							row = item.billWithItems[j];
							var tmpRow = $.extend({}, tmpItem, row);
							tmpRow["id"] = row.bgItemId;
							tmpRow["pId"] = row.billId;
							newData.push(tmpRow);
							//billNum = billNum + 1;
							//}
						}
						var footerData = $.extend({}, tmpItem, {
							'id': item.billId + '-1',
							'pId': item.billId,
							isFooter: 1
						});
						newData.push(footerData);

					}
					$('.billNum').html(billNum);
					$('.billHJJE').html($.formatMoney(billHJJE, 2));
					$('#zbfj-data').getObj().load(newData);
					page.tableData = newData;
					ufma.isShow(reslist);
				}
				ufma.post(url, argu, callback);
			},
			initAgency: function () {
				bg.setAgencyCombox($('#cbAgency'), {
					"userCode": page.pfData.svUserCode,
					"userId": page.pfData.svUserId,
					"setYear": page.useYear
				}, function (sender,
					treeNode) {
					page.agencyCode = treeNode.id;
					page.selectSessionData(); //bugCWYXM-3951--新增需求记忆预算方案
					//page.initSearchPnl();
					//80827 【财务云8.0 鄂尔多斯 】20190630所有页面，单位或账套选择变化后，再打开其它页面时，自动显示为最近一次选择的单位或账套。--zsj
					//缓存单位
					var params = {
						selAgecncyCode: treeNode.id,
						selAgecncyName: treeNode.name
					}
					ufma.setSelectedVar(params);
					//根据系统选项判断发文文号是否必填
					var bgUrl = '/bg/sysdata/selectSysRgParaValue?rgCode=' + page.pfData.svRgCode + '&setYear=' + page.useYear + '&agencyCode=' + treeNode.id + '&chrCode=BG003'
					ufma.get(bgUrl, {}, function (result) {
						page.needSendDocNum = result.data;
						if (page.needSendDocNum == true) {
							page.sendCloName = "指标id";
						} else {
							page.sendCloName = "发文文号";
						}
					});
				});
			},
			//bugCWYXM-3951--新增需求记忆预算方案--取出已经记忆的数据--zsj
			selectSessionData: function () {
				var argu = {
					agencyCode: page.agencyCode,
					acctCode: '*',
					menuId: '29051561-5a6a-4872-986e-6c12e5dcc184'
				}
				ufma.get('/pub/user/menu/config/select', argu, function (result) {
					page.sessionPlanData = result.data;
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
						'setYear': page.useYear
					},
					callback: function (element, data) {
						element
							.ufCombox({ // 初始化
								data: data, // 列表数据
								readonly: true, // 可选
								placeholder: "请选择预算方案",
								onChange: function (sender, data) {
                  page.planData = data;
                  var codeArr = []
                  for (var z = 0; z < data.planVo_Items.length; z++) {
                      var code = data.planVo_Items[z].eleCode;
                      if (code != 'sendDocNum' && code != 'bgItemIdMx'){
                          codeArr.push(data.planVo_Items[z]);
                      }
                  }
                  if (data.isFinancialBudget == '1') {
                      var bgItemIdMxArgu = {
                          eleName: "财政指标ID",
                          eleCode:'bgItemIdMx',
                          nameCode: "bgItemIdMx"
                      }
                      codeArr.splice(0, 0, bgItemIdMxArgu);
                  }
                  data.needSendDocNum = page.sendCloName
                  if (data.isSendDocNum == '是') {
                      var sendDocNumArgu = {
                          eleName:  page.sendCloName,
                          eleCode:'sendDocNum',
                          nameCode: "sendDocNum"
                      }
                      codeArr.splice(0, 0, sendDocNumArgu);
                  }
                  page.planData.planVo_Items = codeArr;
									bg.initBgPlanItemPnl(
										$('#searchPlanPnl'), page.planData);
									//page.adjGridTop();
									page.setTable();
								},
								onComplete: function (sender, elData) {
									if (!$.isNull(page.sessionPlanData.cbBgPlan)) {
										var planData = page.sessionPlanData.cbBgPlan.split(",");
										var planId = planData[0];
                    var planName = planData[1];
                    //CWYXM-17038 指标管理模块--所有涉及到预算方案记忆的界面均需判断已记忆方案是否被删除--zsj
                    var planIdArr = [];
                    for(var a = 0; a < data.length; a++) {
                        planIdArr.push(data[a].chrId);
                    } 
                    if($.inArray(planId,planIdArr) > -1){                                       
                        $('#cbBgPlan').getObj().setValue(planId, planName);
                    }else{
                        $('#cbBgPlan').getObj().val('111');  
                    }
									} else {
										bg.selectBgPlan($(element), elData);
									}
								}
							});
					}
				});
			},
			adjGridTop: function () {
				$.timeOutRun(null, null, function () {
					var gridTop = $('#zbfj-data').offset().top;
					var gridHeight = $(window).height() - gridTop - 65;
					$('#zbfj-data').getObj().setBodyHeight(gridHeight);

				}, 800);

			},
			delBills: function (data) {
				ufma.confirm('您确定要删除所选择单据吗？', function (ac) {
					if (ac) {
						var argu = {
							'agencyCode': page.agencyCode,
							'setYear': page.useYear,
							'bgPlanChrId': page.planData.chrId,
							'items': data
						};
						var url = _bgPub_requestUrlArray_subJs[5] +
							"?billType=2&agencyCode=" + page.agencyCode;
						var callback = function (result) {
							ufma.showTip('删除成功！', function () {
								page.setTable();
							}, 'success');
						};
						ufma.post(url, argu, callback);
					}
				}, {
					'type': 'warning'
				});
			},
			checkBills: function (data, statusNav) {
				var argu = {
					'agencyCode': page.agencyCode,
					'setYear': page.useYear,
					'bgPlanChrId': page.planData.chrId,
					'items': data
				};

				if (statusNav == "1") {
					ufma.confirm('您确定要审核选择的单据吗？', function (ac) {
						if (ac) {
							argu.checkUser = page.pfData.svUserCode;
							argu.setYear = page.useYear;
							argu.status = "3";
							argu.billType = "2";
							argu.checkUserName = page.pfData.svUserName;
							argu.checkDate = page.pfData.svSysDate;
							var url = _bgPub_requestUrlArray_subJs[12] +
								"?billType=2&agencyCode=" +
								page.agencyCode;
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

				} else if (statusNav == "3") {
					ufma.confirm('您确定要销审选择的单据吗？', function (ac) {
						if (ac) {
							argu.status = "1";
							argu.billType = "2";
							argu.setYear = page.useYear;
							argu.checkUser = page.pfData.svUserCode;
							argu.checkUserName = page.pfData.svUserName;
							argu.checkDate = page.pfData.svSysDate;
							var url = _bgPub_requestUrlArray_subJs[13] +
								"?billType=2&agencyCode=" +
								page.agencyCode;
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
			openEditWin: function (action, billId, status) {
				if (action == 'add') {
					page.selectSessionData(); //bugCWYXM-3951--新增需求记忆预算方案
					var stitle = '新增指标分解';
					ufma.open({
						url: 'budgetItemDecomposeAdd.html',
						title: stitle,
						width: 1200,
						data: {
							'agencyCode': page.agencyCode,
							'action': action,
							'billId': billId,
							//'planId': page.planData.chrId,
							'planId': $('#cbBgPlan').getObj().getValue(), //CWYXM-11974 达梦库和oracle库有此问题：指标管理模块，指标分解，点击新增时没有选择预算方案前，页面样式错误--zsj
							'planData': page.planData,
							'sessionPlanData': page.sessionPlanData,
							'status': status,
							'needSendDocNum': page.needSendDocNum //判断发文文号是否必填
						},
						ondestory: function (result) {
							if (result.action == 'ok') {
								page.setTable();
							}
							if (result.action == 'continue') {
								page.openEditWin('add', '', '1');
							}
							//bugCWYXM-3951--zsj--关闭分解 界面 后主页的预算方案默认为 分解时用到的方案
							page.selectSessionData();
						}
					});
				} else if (action == 'edit') {
					stitle = '编辑指标分解';
					ufma.open({
						url: 'budgetItemDecomposeEdit.html',
						title: stitle,
						width: 1200,
						data: {
							'agencyCode': page.agencyCode,
							'action': action,
							'billId': billId,
							'planId': page.planData.chrId,
							'planData': page.planData,
							'status': status,
							'needSendDocNum': page.needSendDocNum //判断发文文号是否必填
						},
						ondestory: function (result) {
							if ((result.action == 'ok') || (result.action == 'exit')) {
								page.setTable();
							}
						}
					});
				}
				ufma.setObjectCache('curBillData', page.bgData[billId]);

			},
			initPage: function () {
				//$('#createDate1').ufDatepicker('update', page.pfData.svTransDate.substr(0, 8) + "01");
				var mydate = new Date(page.pfData.svTransDate);
				var Year = mydate.getFullYear();
				$('#createDate1').getObj().setValue(Year + '-01-01');
				$('#createDate2').ufDatepicker('update', page.pfData.svTransDate);
				page.initAgency();
				$.timeOutRun(null, null, function () {
					$('#cbAgency').getObj().val(page.agencyCode);
					//page.initSearchPnl();
				}, 1000);

			},

			onEventListener: function () {
				//搜索框
				ufma.searchHideShow($('#zbfj-data'));
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
        $("#export").on('click', function (evt) {
          var clo = page.getBudgetHead()[0];
					var expCols = clo.select(function (el, i, res, param) {
						return $.isNull(el.className) || el.className.indexOf('no-print') == -1;
					});
					uf.expTable({
						title: '指标分解单',
						data: $('#zbfj-data').getObj().getData(),
            columns: [expCols],
            ignoreColumn: "-1" // 不需要导出的L列
					});
				});
				// $('#export').click(function () {
				// 	$("#zbfj-data").ufTableExport({
				// 		fileName: "指标分解单", // 导出表名
				// 		ignoreColumn: "-1" // 不需要导出的LIE
				// 	});
				// });

				$('.btn-new').click(function (e) {
					if ($.isNull(page.agencyCode)) {
						ufma.showTip('请选择单位！',function(){}, 'warning');
						return false;
					}
					page.openEditWin('add', '', '1');
				});

				$('.btn-more-item').click(function () {
					if ($('.label-more div').text() == '更多') {
						$('.label-more div').text('收起')
					} else {
						$('.label-more div').text('更多')
					}
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
				$('[data-toggle="tooltip"]').tooltip();

			},
			// 此方法必须保留
			init: function () {
				reslist = ufma.getPermission();
				ufma.isShow(reslist);
				page.pfData = ufma.getCommonData();
				page.agencyCode = page.pfData.svAgencyCode;
				page.useYear = parseInt(page.pfData.svSetYear);
				ufma.parse();
				uf.parse();
				this.initPage();
				page.setTable(); //修改guohx  不选预算方案不展示表头
				this.onEventListener();
			}
		}
	}();
	// ///////////////////
	page.init();
});