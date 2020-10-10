$(function() {
	var menuId = '1948fc80-1ee4-41bc-a448-c06443a2b947';
	var page = function() {
		return {
			agencyCode: '',
			planData: '',
			bgData: {},
			getBudgetHead: function() {
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
						className: 'nowrap BGasscodeClass',
						headalign: 'center'
					}, {
						// CWYXM-18408--指标年结涉及采购合同报销模块占用的指标结转完善
						field: 'bgTypeName',
						name: '指标类型',
						className: 'nowrap BGTenLen',
						headalign: 'center',
						width: 200,
						render: function(rowid, rowdata, data) {
							if (!$.isNull(data)) {
								return '<span title="' + data + '">' + data + '</span>';
							} else {
								return '';
							}
						}
					}, {
						field: 'bgItemSummary',
						name: '摘要',
						className: 'nowrap BGThirtyLen',
						headalign: 'center',
						width: 200,
						render: function(rowid, rowdata, data) {
							if (!$.isNull(data)) {
								return '<span title="' + data + '">' + data + '</span>';
							} else {
								return '';
							}
						}
					}
				];
				if(page.planData.isComeDocNum == "是") {
					column.push({
						field: 'comeDocNum',
						name: '来文文号',
						className: 'nowrap BGThirtyLen',
						width: 200,
						headalign: 'center',
						render: function(rowid, rowdata, data) {
							if (!$.isNull(data)) {
								return '<span title="' + data + '">' + data + '</span>';
							} else {
								return '';
							}
						}
					});
				}
				if(page.planData.isSendDocNum == "是") {
					column.push({
						field: 'sendDocNum',
						name: page.sendCloName,
            className: 'nowrap BGThirtyLen',
            width: 200,
            headalign: 'center',
            render: function(rowid, rowdata, data) {
              if (!$.isNull(data)) {
                return '<span title="' + data + '">' + data + '</span>';
              } else {
                return '';
              }
						}
					});
        }
        //CWYXM-17554 预算方案设置中，增加财政指标ID属性，可选择是否启用，启用时，选择预算方案新增指标时，需要录入指标id，指标id也需要参与指标的要素唯一性校验--zsj
        if (page.planData.isFinancialBudget == "1") {
          column.push({
            field: "bgItemIdMx",
            name: '财政指标ID',
            className: "nowrap print BGThirtyLen",
            width: 200,
            headalign: 'center',
            "render": function (rowid, rowdata, data) {
              if (!$.isNull(data)) {
                return '<span title="' + data + '">' + data + '</span>';
              } else {
                return '';
              }
            }
          });
        } 
				if(!$.isNull(page.planData)) {
					for(var i = 0; i < page.planData.planVo_Items.length; i++) {
						var item = page.planData.planVo_Items[i];
						var cbItem = item.eleCode;
						if(cbItem == "ISUPBUDGET") {
							column.push({
								field: 'isUpBudget',
								name: "是否采购",
                // width: 120,
                headalign: 'center',
                align: 'center',
								className: 'nowrap isprint'
							});
						} else {
              //CWYXM-17554 预算方案设置中，增加财政指标ID属性，可选择是否启用，启用时，选择预算方案新增指标时，需要录入指标id，指标id也需要参与指标的要素唯一性校验--zsj
              if (cbItem != 'sendDocNum' &&  cbItem != 'bgItemIdMx') {
                column.push({
                  field: bg.shortLineToTF(item.eleFieldName)+ 'Name',
                  name: item.eleName,
                  width: 200,
                  headalign: 'center',
                  className: 'nowrap isprint BGThirtyLen',
                  render: function(rowid, rowdata, data) {
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
            var code = bg.shortLineToTF(page.planData.planVo_Txts[k].eleFieldName)
            column.push({
              field: code,
              name: page.planData.planVo_Txts[k].eleName,
              width: 200,
              headalign: 'center',
              className: 'nowrap BGThirtyLen',
              render: function(rowid, rowdata, data) {
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
					field: 'modifyAfterCur',
					name: '调整后金额',
					width: 150,
					headalign: 'center',
          align: 'right',
          className: 'nowrap BGmoneyClass',
					render: function(rowid, rowdata, data) {
						return $.formatMoney(data, 2);
					}
				});
				//bug76244--增加备注列--经侯总确认目前只加“指标调整”与“指标调剂”--zsj
				column.push({
					field: 'remark',
					name: '备注',
					className: 'nowrap BGThirtyLen',
          headalign: 'center',
          // width: 200,
					render: function(rowid, rowdata, data) {
            if (!$.isNull(data)) {
              return '<span title="' + data + '">' + data + '</span>';
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
					render: function(rowid, rowdata, data) {
						if(rowdata.status == "1") {
							return '<button class="btn btn-edit btn-permission bgtooltip bgmintooltip" data-toggle="tooltip" title="编辑"><span class="icon-edit"></span></button>' +
								'<button class="btn btn-audit btn-permission bgtooltip bgmintooltip" data-toggle="tooltip" title="审核"><span class="icon-audit"></span></button>' +
								'<button class="btn btn-delete btn-permission btn-del bgtooltip bgmintooltip" data-toggle="tooltip" title="删除"><span class="icon-trash"></span></button>';
						} else if(rowdata.status == "3") {
							return '<button class="btn btn-un-audit btn-permission bgtooltip bgmintooltip" data-toggle="tooltip" title="销审"><span class="icon-cancel-audit"></span></button>' +
								'<button class="btn btn-watch-detail btn-log btn-permission bgtooltip bgmintooltip" data-toggle="tooltip" title="查看日志"><span class="icon-log"></span></button>';
						} else {
							return '';
						}
					}
				});
				return [column];
			},
			setTable: function() {
				$('#zbtz-data').html('');
				var status = $('#tabStatus .active a').data('status');
				var columns = page.getBudgetHead();
				$('#zbtz-data').ufDatagrid({
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
					mergeColumns: function(rowid, rowdata) {
						var merges = [];
						if(rowdata.pId == 0 && rowdata.status == 1) {
							// 同一行可以合并多列
							merges.push({
								columnIndex: 1,
								colSpan: columns[0].length - 2,
								text: '<a class="viewBill btn-watch common-jump-link"><span class=" mr30">单据编号：' +
									rowdata.billCode +
									'</span><span class=" mr30">单据日期：' +
									ufma.parseNull(rowdata.billDate) +
									'</span><span class="mr30">单据金额：' +
									ufma.parseFloat(rowdata.billCur, 2) +
									'</span></a>'
							});
						}
						if(rowdata.pId == 0 && rowdata.status == 3) {
							// 同一行可以合并多列
							merges.push({
								columnIndex: 1,
								colSpan: columns[0].length - 2,
								text: '<a class="viewBill btn-watch common-jump-link"><span class=" mr30">单据编号：' +
									rowdata.billCode +
									'</span><span class=" mr30">单据日期：' +
									ufma.parseNull(rowdata.billDate) +
									'</span><span class="mr30 ">单据金额：' +
									ufma.parseFloat(rowdata.billCur, 2) +
									'</span><span class=" mr30">审核日期：' +
									ufma.parseNull(rowdata.checkDate).substr(0, 10) +
									'</span></a>'
							});
						}
						if(rowdata.isFooter == '1') {
							merges.push({
								columnIndex: 1,
								colSpan: columns[0].length - 2,
								text: '<a class="fr viewBill common-jump-link">更多</a>'
							});
						}
						return merges
					},
					// 合并行
					mergeRows: function(prevRowdata, rowdata) {
						var merges = [];
						if(prevRowdata['billId'] == rowdata['billId']) {
							merges.push(0);
							merges.push(-1);
						}
						return merges
					},
					toolbar: [{
							type: 'checkbox',
							class: 'check-all btn-permission',
							text: '全选'
						},
						{
							type: 'button',
							class: 'btn-default btn-delete btn-hide btn-permission tab-del',
							text: '删除',
							action: function() {
								var checkData = $('#zbtz-data').getObj().getCheckData();
								if(checkData.length == 0) {
									ufma.showTip('请选择单据！', function() {}, 'warning');
									return false;
								}
								var data = [];
								for(var i = 0; i < checkData.length; i++) {
									data.push({
										'billId': checkData[i].billId,
										"bgItemId": ""
									});
								}
								page.delBills(data);
							}
						},
						{
							type: 'button',
							class: 'btn-default btn-audit btn-hide btn-checked btn-permission tab-audio',
							text: '审核',
							action: function() {
								var checkData = $('#zbtz-data').getObj().getCheckData();
								if(checkData.length == 0) {
									ufma.showTip('请选择单据！',
										function() {}, 'warning');
									return false;
								}
								var data = [];
								for(var i = 0; i < checkData.length; i++) {
									data.push({
										'billId': checkData[i].billId
									});
								}
								page.checkBills(data);
							}
						},
						{
							type: 'button',
							class: 'btn-default btn-un-audit  btn-permission  btn-hide tab-un-audio',
							text: '销审',
							action: function() {
								var checkData = $('#zbtz-data').getObj().getCheckData();
								if(checkData.length == 0) {
									ufma.showTip('请选择单据！',
										function() {}, 'warning');
									return false;
								}
								var data = [];
								for(var i = 0; i < checkData.length; i++) {
									data.push({
										'billId': checkData[i].billId
									});
								}
								page.checkBills(data);
							}
						}
					],
					initComplete: function(options, data) {
						page.adjGridTop();

						$('#zbtz-data tr').off("click", '.btn-del').on('click', '.btn-del', function(e) {
							e.stopPropagation();
							var rowid = $(this).closest('tr').attr('id');
							var rowData = $('#zbtz-data').getObj().getRowByTId(rowid);
							page.delBills([{
								'billId': rowData.billId,
								"bgItemId": ""
							}]);
						});
						$('#zbtz-data tr').off("click", '.btn-audit').on('click', '.btn-audit', function(e) {
							e.stopPropagation();
							var rowid = $(this).closest('tr').attr('id');
							var rowData = $('#zbtz-data').getObj().getRowByTId(rowid);
							page.checkOneBill([
								rowData
							]);
						});
						$('#zbtz-data tr').off("click", '.btn-un-audit').on('click', '.btn-un-audit', function(e) {
							e.stopPropagation();
							var rowid = $(this).closest('tr').attr('id');
							var rowData = $('#zbtz-data').getObj().getRowByTId(rowid);
							page.checkOneBill([
								rowData
							]);
						});
						$('#zbtz-data tr').on('click', '.btn-watch-detail', function(e) {
							e.stopPropagation();
							var rowid = $(this).closest('tr').attr('id');
							var rowData = $('#zbtz-data').getObj().getRowByTId(rowid);
							_bgPub_showLogModal("budgetItemAdjust", {
								"bgBillId": rowData.billId,
								"bgItemCode": "",
								"agencyCode": page.agencyCode
							});
						});
						$('.viewBill').off("click").on('click', function(e) {
							e.stopPropagation();
							var rowId = $(this).closest('tr').attr('id');
							var rowData = $('#zbtz-data').getObj().getRowByTId(rowId);
							page.openEditWin('edit', rowData.billId, rowData.status, rowData.attachNum);
							e.preventDefault();
						});
						$('#zbtz-data tr').off("click", '.btn-edit').on('click', '.btn-edit',
							function(e) {
								e.stopPropagation();
								var rowId = $(this).closest('tr').attr('id');
								var rowData = $('#zbtz-data').getObj().getRowByTId(rowId);
								page.openEditWin('edit', rowData.billId, rowData.status, rowData.attachNum);
								e.preventDefault();
							});
						switch(status) {

							case 1:
								if(data.length > 0) {
									$('#zbtz-data button').removeAttr('disabled');
									$('#zbtz-data .btn-edit').removeClass('hide');
									$('#zbtz-data .btn-checked').removeClass('hide');
									$('#zbtz-data .btn-delete').removeClass('hide');
									$('#zbtz-data .btn-checked').attr('data-status', '3');
								} else {
									$('#zbtz-data button').attr('disabled', 'disabled');

								}

								break;
							case 3:
								if(data.length > 0) {
									$('#zbtz-data .btn-checked').removeAttr('disabled');
									$('#zbtz-data .btn-checked').attr('data-status', '1');
									$('#zbtz-data .btn-un-audit').removeClass('hide');
									$('#zbtz-data .btn-delete').addClass('hide');
									$('#zbtz-data .btn-edit').addClass('hide');
								} else {
									$('#zbtz-data .btn-checked').attr('disabled', 'disabled');
									$('#zbtz-data .btn-edit').removeClass('hide');
									$('#zbtz-data .btn-delete').addClass('hide');
								}
								break;
							default:
								$('#zbtz-data .btn-hide').addClass('hide');
								break;
						}
						//$('button[data-toggle="tooltip"]').tooltip();
						if($('#zbtz-data').find('.zbtz-data-caption').length == 0) {
							var _caption = $('.zbtz-data-caption').clone();
							_caption.removeClass('none');
							$('#zbtz-dataFoot').before(_caption);
						}

						//拖动表头
						/*与雪蕊沟通后注释拖动列--CWYXM-11319 --指标调剂列表查看，预算方案列应为左对齐--zsj
						 * $('#zbtz-dataHead .uf-grid-head-view table').tblcolResizable({
							'bindTable': '#zbtz-dataBody .uf-grid-body-view table'
						});*/
						$.fn.dataTable.ext.errMode = 'none';
						ufma.isShow(reslist);
					}
				});
				//根据上面的tab切换，转变表格下面的按钮
				if(status == 1) {
					$('.tab-un-audio').css("display", "none");
					$('.tab-del').css("display", "inline-block");
					$('.tab-audio').css("display", "inline-block");
				} else if(status == 3) {
					$('.tab-un-audio').css("display", "inline-block");
					$('.tab-del').css("display", "none");
					$('.tab-audio').css("display", "none");
				} else {
					$('.tab-un-audio').css("display", "none");
					$('.tab-del').css("display", "none");
					$('.tab-audio').css("display", "none");
				}

				if($.isNull(page.planData)) {
					return false;
				}
				var url = "/bg/budgetItem/multiPost/getBills" + "?agencyCode=" + page.agencyCode + "&setYear=" + page.setYear;
				var argu = page.getSearchMap(page.planData);
				var data = [];
				var callback = function(result) {
					//需要将树结构转为扁平结构
					var newData = [];
					var billNum = result.data.billWithItemsVo.length;
					var billHJJE = 0.00;
					for(var i = 0; i < result.data.billWithItemsVo.length; i++) {
						var item = result.data.billWithItemsVo[i];
						//billNum = billNum + item.billWithItems.length;
						billHJJE = billHJJE + item.billCur;
						page.bgData[item.billId] = item;
						var tmpItem = $.extend({
							'id': item.billId,
							'pId': '0',
							isFooter: 0
						}, item);
						delete tmpItem['billWithItems'];
						newData.push(tmpItem);
						for(var j = 0; j < item.billWithItems.length; j++) {
							if(j >= 5) break;
							row = item.billWithItems[j];
							var tmpRow = $.extend({}, tmpItem, row);
							tmpRow["id"] = row.bgItemId;
							tmpRow["pId"] = row.billId;
							newData.push(tmpRow);
						};
						var footerData = $.extend({}, tmpItem, {
							'id': item.billId + '-1',
							'pId': item.billId,
							isFooter: 1
						});
						newData.push(footerData);
					}
					$('.billNum').html(billNum);
                    $('.billHJJE').html($.formatMoney(billHJJE, 2));
                    $('#zbtz-data').getObj().load(newData);
                    $('.uf-grid-head .uf-grid-head-view').css({
                        'width':'100% !important'
                      })
					ufma.isShow(reslist);
				}
				ufma.ajaxDef(url,'post', argu, callback);
			},
			initAgency: function() {
				bg.setAgencyCombox($('#cbAgency'), {
					"userCode": page.pfData.svUserCode,
					"userId": page.pfData.svUserId,
					"setYear": page.setYear
				}, function(sender,
					treeNode) {
					page.agencyCode = treeNode.id;
					//page.initSearchPnl();
					page.selectSessionData();
					//80827 【财务云8.0 鄂尔多斯 】20190630所有页面，单位或账套选择变化后，再打开其它页面时，自动显示为最近一次选择的单位或账套。--zsj
					//缓存单位
					var params = {
						selAgecncyCode: treeNode.id,
						selAgecncyName: treeNode.name
					}
					ufma.setSelectedVar(params);
					//CWYXM-12690--根据系统选项判断发文文号是否必填，若必填则将列名“发文文号”改完指标id--zsj
					var bgUrl = '/bg/sysdata/selectSysRgParaValue?rgCode=' + page.pfData.svRgCode + '&setYear=' + page.setYear + '&agencyCode=' + treeNode.id + '&chrCode=BG003';
					ufma.get(bgUrl, {}, function(result) {
						page.needSendDocNum = result.data;
						if(page.needSendDocNum == true) {
							page.sendCloName = "指标id";
						} else {
							page.sendCloName = "发文文号";
						}
					});
				});
			},
			getSearchMap: function(planData) {
				var searchMap = bg.getBgPlanItemMap(planData);
				searchMap['billType'] = 3;
				searchMap['bgReserve'] = 1;
				searchMap['businessDateBegin'] = $('#createDate1').getObj().getValue();
				searchMap['businessDateEnd'] = $('#createDate2').getObj().getValue();
				searchMap['status'] = $('#tabStatus .active a').data('status');
				return searchMap;
			},
			//CWYXM-10166 指标编制、指标控制管理界面记忆预算方案--新增需求记忆预算方案-更新记忆数据--zsj
			updateSessionPlan: function() {
				var argu = {
					acctCode: "*",
					agencyCode: page.agencyCode,
					configKey: page.configKey,
					configValue: page.configValue,
					menuId: menuId
				}
				ufma.post('/pub/user/menu/config/update', argu, function(reslut) {});
			},
			initSearchPnl: function() {
				uf.cacheDataRun({
					element: $('#cbBgPlan'),
					cacheId: page.agencyCode + '_plan_items',
					url: bg.getUrl('bgPlan') + "?ajax=1",
					param: {
						'agencyCode': page.agencyCode,
						'setYear': page.setYear
					},
					callback: function(element, data) {
						element.ufCombox({ // 初始化
							data: data, // 列表数据
							readonly: true, // 可选
							placeholder: "请选择预算方案",
							onChange: function(sender, data) {
								page.planData = data;
								//bugCWYXM-10166--新增需求记忆预算方案--更新记忆数据--zsj
								page.configKey = '';
								page.configValue = '';
								page.configKey = 'cbBgPlan';
								var cbBgPlanId = $('#cbBgPlan').getObj().getValue();
								var cbBgPlanText = $('#cbBgPlan').getObj().getText();
                                page.configValue = cbBgPlanId + ',' + cbBgPlanText;
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
								page.adjGridTop();
								page.setTable();
								page.updateSessionPlan();
							},
							onComplete: function(sender, elData) {
								if(!$.isNull(page.sessionPlanData.cbBgPlan)) {
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
                                    } else {
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
			adjGridTop: function() {
				$.timeOutRun(null, null, function() {
					var gridTop = $('#zbtz-data').offset().top;
					var gridHeight = $(window).height() - gridTop - 56;
					$('#zbtz-data').getObj().setBodyHeight(gridHeight);
				}, 800);
			},
			delBills: function(data) {
				ufma.confirm('您确定要删除所选择单据吗？', function(ac) {
					if(ac) {
						var argu = {
							'agencyCode': page.agencyCode,
							'setYear': page.setYear,
							'bgPlanChrId': page.planData.chrId,
							'billType': 3,
							'items': data
						};
						var url = _bgPub_requestUrlArray_subJs[5] + "?billType=3&agencyCode=" + page.agencyCode;;
						var callback = function(result) {
							if(result.flag == 'success') {
								ufma.showTip('删除成功！', function() {
									page.setTable();
								}, 'success');
							}
						};
						//$.ufajax(url, 'post', argu, callback);
						ufma.post(url, argu, callback);
					}
				}, {
					'type': 'warning'
				});
			},
			checkBills: function(data) {
				var argu = {
					'agencyCode': page.agencyCode,
					'setYear': page.setYear,
					'bgPlanChrId': page.planData.chrId,
					'items': data
				};
				var $selNav = $(".nav.nav-tabs").find("li.active");
				var statusNav = $selNav.find("a").attr("data-status");
				if(statusNav == "1") {
					ufma.confirm('您确定要审核选择的单据吗？', function(ac) {
						if(ac) {
							argu.checkUser = page.pfData.svUserCode;
							argu.status = "3";
							argu.billType = "3";
							argu.checkUserName = page.pfData.svUserName;
							argu.checkDate = page.pfData.svSysDate;
							var url = _bgPub_requestUrlArray_subJs[12] +
								"?billType=3&agencyCode=" +
								page.agencyCode;
							var callback = function(result) {
								ufma.showTip('审核成功！', function() {
									page.setTable();
								}, 'success');
							};
							ufma.post(url, argu, callback);
						}
					}, {
						'type': 'warning'
					});
				} else if(statusNav == "3") {
					ufma.confirm('您确定要销审选择的单据吗？', function(ac) {
						if(ac) {
							argu.status = "1";
							argu.billType = "3";
							argu.checkUser = page.pfData.svUserCode;
							argu.checkUserName = page.pfData.svUserName;
							argu.checkDate = (new Date()).Format('yyyy-MM-dd');
							var url = _bgPub_requestUrlArray_subJs[13] +
								"?billType=3&agencyCode=" +
								page.agencyCode;
							var callback = function(result) {
								ufma.showTip('销审成功！', function() {
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
			//guohx  add  单条行操作审核/销审
			checkOneBill: function(data) {
				var argu = {
					'agencyCode': page.agencyCode,
					'setYear': page.setYear,
					'bgPlanChrId': page.planData.chrId,
					'items': data
				};
				if(data[0].status == "1") {
					ufma.confirm('您确定要审核选择的单据吗？', function(ac) {
						if(ac) {
							argu.checkUser = page.pfData.svUserCode;
							argu.status = "3";
							argu.billType = "3";
							argu.checkUserName = page.pfData.svUserName;
							argu.checkDate = page.pfData.svSysDate;
							var url = _bgPub_requestUrlArray_subJs[12] +
								"?billType=3&agencyCode=" +
								page.agencyCode;
							var callback = function(result) {
								ufma.showTip('审核成功！', function() {
									page.setTable();
								}, 'success');
							};
							ufma.post(url, argu, callback);
						}
					}, {
						'type': 'warning'
					});
				} else if(data[0].status == "3") {
					ufma.confirm('您确定要销审选择的单据吗？', function(ac) {
						if(ac) {
							argu.status = "1";
							argu.billType = "3";
							argu.checkUser = page.pfData.svUserCode;
							argu.checkUserName = page.pfData.svUserName;
							argu.checkDate = (new Date()).Format('yyyy-MM-dd');
							var url = _bgPub_requestUrlArray_subJs[13] +
								"?billType=3&agencyCode=" +
								page.agencyCode;
							var callback = function(result) {
								ufma.showTip('销审成功！', function() {
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
			openEditWin: function(action, billId, status, attachNum) {
				//page.updateSessionPlan();
				var stitle = '新增指标调整';
				if(action == 'edit') {
					stitle = '编辑指标调整';
				}
				var statusLab = $('#tabStatus .active a').data('status');
				ufma.setObjectCache('curBillData', page.bgData[billId]);
				var url = "/bg/budgetItem/multiPost/getBills" + "?agencyCode=" + page.agencyCode + "&setYear=" + page.setYear;
				var argu = {
					"billType": 3,
					"bgReserve": 1
				};
				ufma.open({
					url: 'budgetEditor.html',
					title: stitle,
					width: 1090,
					data: {
						'agencyCode': page.agencyCode,
						'action': action,
						'billId': billId,
						'planId': page.planData.chrId,
						'status': status,
						'attachNum': attachNum,
						'menuId': menuId,
						'pageAction': action,
						'statusLab': statusLab,
						'queryArgu': argu,
						'queryUrl': url,
						'cbBgPlanId': $('#cbBgPlan').getObj().getValue(),
						'cbBgPlanText': $('#cbBgPlan').getObj().getText(),
            'editPlanData': action == 'edit' ? page.planData : '',
            'sendCloName':page.sendCloName
					},

					ondestory: function(result) {
						//CWYXM-11907、CWYXM-11968 指标管理-指标调整,保存后数据没回显,得刷新才行--zsj
						var saveDataList = localStorage.getItem("saveData");
						var saveData = []
						if(!$.isNull(saveDataList)) {
							saveData = eval("(" + saveDataList + ")");
						}
						if(saveData.length > 0) {
							if(saveData[0].saveFlag == true) {
								var planId = saveData[0].cbBgPlanId;
								var planName = saveData[0].cbBgPlanText;
								$('#cbBgPlan').getObj().setValue(planId, planName);
								page.setTable();
							}
						}

						/*if((result.action == 'ok') || (result.action == 'exit')) {
							var planId = result.data.cbBgPlanId;
							var planName = result.data.cbBgPlanText;
							$('#cbBgPlan').getObj().setValue(planId, planName);
							page.setTable();
						}else if($.isNull(result.action)){
							page.setTable();
						}*/
						if(result.action == 'continue') {
							page.openEditWin('add', '', '1');
						}
					}
				});
			},
			//CWYXM-10166 指标编制、指标控制管理界面记忆预算方案--新增需求记忆预算方案--单位加载完后请求预算方案，若有记忆则用已经记忆 的值的数据--zsj
			selectSessionData: function() {
				var argu = {
					agencyCode: page.agencyCode,
					acctCode: '*',
					menuId: menuId
				}
				ufma.get('/pub/user/menu/config/select', argu, function(result) {
					page.sessionPlanData = result.data;
					page.initSearchPnl();
				});
			},
			initPage: function() {
				//$('#createDate1').ufDatepicker('update', page.pfData.svTransDate.substr(0, 8) + "01");
				var mydate = new Date(page.pfData.svTransDate);
				var Year = mydate.getFullYear();
				$('#createDate1').getObj().setValue(Year + '-01-01');
				$('#createDate2').ufDatepicker('update', page.pfData.svTransDate);
				page.initAgency();
				$.timeOutRun(null, null, function() {
					$('#cbAgency').getObj().val(page.agencyCode);
					//	page.initSearchPnl();
					page.selectSessionData();
				}, 1000);
				$("#zbtz-dataHead").ufFixedShow({
					offset: 0
				});
				$("#zbtz-dataFoot").ufFixedShow({
					position: 'bottom',
					zIndex: 1000, // Z轴
					offset: 0
					// 偏移
				});
			},
			onEventListener: function() {
				//搜索框
				ufma.searchHideShow($('#zbtz-data'));
				$('#tabStatus').on('click', 'li', function() {
					page.setTable();
				});
				$('.btn-new').click(function(e) {
					if($.isNull(page.agencyCode)) {
						ufma.showTip('请选择单位！',function(){}, 'warning');
						return false;
					}
					page.openEditWin('add', '', '1');
				});
				$('.btn-more-item').click(function() {
					if($('.label-more div').text() == '更多') {
						$('.label-more div').text('收起')
					} else {
						$('.label-more div').text('更多')
					}
					page.adjGridTop();
				});
				$('#btnQry').click(function() {
					var beginDate = $('#createDate1').getObj().getValue();
					var endDate = $('#createDate2').getObj().getValue();
					if(beginDate > endDate) {
						ufma.showTip("开始日期不得小于结束日期", null, "error");
					} else {
						var tmpChrId = $('#cbBgPlan_value').val();
						if(tmpChrId == "") {
							ufma.showTip("请先选择一个预算方案", null, "warning");
							return;
						}
						page.setTable();
					}

				});
				$('#print').click(function() {
					$("#zbtz-data").ufPrintTable({
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
						title: '指标调整单',
						data: $('#zbtz-data').getObj().getData(),
            columns: [expCols],
            ignoreColumn: "-1" // 不需要导出的L列
					});
				});
				// $('#export').click(function() {
				// 	$("#zbtz-data").ufTableExport({
				// 		fileName: "指标调整单", // 导出表名
				// 		ignoreColumn: "-1" // 不需要导出的LIE
				// 	});
				// });
				$('[data-toggle="tooltip"]').tooltip();
			},
			// 此方法必须保留
			init: function() {
				reslist = ufma.getPermission();
				ufma.isShow(reslist);
				page.pfData = ufma.getCommonData();
				page.setYear = parseInt(page.pfData.svSetYear);
				page.agencyCode = page.pfData.svAgencyCode;
				ufma.parse();
				uf.parse();
				this.initPage();
				this.onEventListener();
			}
		}
	}();
	// ///////////////////
	page.init();
});