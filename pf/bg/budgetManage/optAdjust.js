$(function() {
	var cacheData = [];
	var modal_billAttachment = [];
	window._close = function(state) {
		if(window.closeOwner) {
			var data = {
				action: state,
				result: {}
			};
			window.closeOwner(data);
		}
	}
	//bug77471--zsj
	var attachNum = 0; //附件前输入框数字
	var pageAttachNum = 0; //后端返回的附件数字
	var fileLeng = 0; //实际上传文件数
	var pageData = window.ownerData;
	var page = function() {
		return {
			planData: '',
			addData: '',
			billId: '',
			billCode: '',
			getBudgetHead: function() { //第一个页面表格
				var column = [ //支持多表头
					{
						type: 'checkbox',
						field: '',
						name: '',
						width: 40,
						headalign: 'center',
						align: 'center'
					},
					{
						field: 'bgPlanName',
						name: '预算方案',
						rowspan: 2,
            width: 150,
            className: 'nowrap BGThirtyLen',
						headalign: 'center'
					},
					{
						field: 'bgItemCode',
						name: '指标编码',
						width: 120,
            headalign: 'center',
            className: 'nowrap BGasscodeClass',
						render: function(rowid, rowdata, data) {
							if(!$.isNull(data)) {
								return '<code title="' + data + '">' + data + '</code>';
							} else {
								return '';
							}
						}
          },
        // CWYXM-18408--指标年结涉及采购合同报销模块占用的指标结转完善--zsj
          {
						field: 'bgTypeName',
						name: '指标类型',
						className: 'nowrap BGTenLen',
						// width: 200,
						headalign: 'center',
						render: function(rowid, rowdata, data) {
							if(!$.isNull(data)) {
								return '<code title="' + data + '">' + data + '</code>';
							} else {
								return '';
							}
						}
					},
					{
						field: 'bgItemSummary',
						name: '摘要',
						className: 'nowrap BGThirtyLen',
						// width: 200,
						headalign: 'center',
						render: function(rowid, rowdata, data) {
							if(!$.isNull(data)) {
								return '<code title="' + data + '">' + data + '</code>';
							} else {
								return '';
							}
						}

					}
        ];
        if(pageData.planData.isComeDocNum == "是") {
					column.push({
						field: 'comeDocNum',
						name: '来文文号',
						className: 'BGThirtyLen nowrap',
            headalign: 'center',
            width: 200,
						render: function(rowid, rowdata, data) {
              if (!$.isNull(data)) {
                return '<code title="' + data + '">' + data + '</code>';
              } else {
                return '';
              }
						}
					});
				}
				if(pageData.planData.isSendDocNum == "是") {
					column.push({
						field: 'sendDocNum',
						name: page.sendCloName,
            className: 'BGThirtyLen nowrap',
            width: 200,
						headalign: 'center',
						render: function(rowid, rowdata, data) {
              if (!$.isNull(data)) {
                return '<code title="' + data + '">' + data + '</code>';
              } else {
                return '';
              }
						}
					});
        }
        //CWYXM-11697  预算方案中要素选择里，增加是否采购属性，启用之后，编制指标时可选是和否，不能输入其他值，采购模块选择指标时，根据这个属性过滤。--zsj
        if (pageData.planData.isFinancialBudget == "1") {
					column.push({
						field: 'bgItemIdMx',
						name: '财政指标ID',
						className: 'nowrap BGThirtyLen',
					  width: 200,
						headalign: 'center',
						"render": function (rowid, rowdata, data, meta) {
							if (!$.isNull(data)) {
								return '<code title="' + data + '">' + data + '</code>';
							} else {
								return '';
							}
						}
					});
				}
				if(!$.isNull(pageData.planData)) {
					for(var i = 0; i < pageData.planData.planVo_Items.length; i++) {
						var item = pageData.planData.planVo_Items[i];
						var cbItem = item.eleCode;
						if(cbItem == 'ISUPBUDGET') {
							column.push({
								field: 'isUpBudget',
								name: '是否采购',
                className: 'nowrap',
                align: 'center',
								// width: 200,
								headalign: 'center'
							});
						} else {
              if(cbItem != 'sendDocNum' &&  cbItem != 'bgItemIdMx'){
                column.push({
                  field: bg.shortLineToTF(item.eleFieldName) + 'Name',
                  name: item.eleName,
                  width: 200,
                  headalign: 'center',
                  className: 'nowrap BGThirtyLen',
                  render: function(rowid, rowdata, data) {
                    if(!$.isNull(data)) {
                      return '<code title="' + data + '">' + data + '</code>';
                    } else {
                      return '';
                    }
                  }
                });
              }
						}

          };
				}
				column.push({
					field: 'realBgItemCur',
					name: '金额',
					width: 150,
					headalign: 'center',
          align: 'right',
          className: 'nowrap BGmoneyClass',
					render: function(rowid, rowdata, data) {
            if (!$.isNull(data)) {
              return '<code title="' + data + '">' + $.formatMoney(data, 2) + '</code>';
            } else {
              return '';
            }
					}
				});
				column.push({
					field: 'bgItemBalanceCur',
					name: '余额',
					width: 150,
					headalign: 'center',
          align: 'right',
          className: 'nowrap BGmoneyClass',
					render: function(rowid, rowdata, data) {
            if (!$.isNull(data)) {
              return '<code title="' + data + '">' + $.formatMoney(data, 2) + '</code>';
            } else {
              return '';
            }
					}
				});
				column.push({
					field: 'createUserName',
					name: '编制人',
					width: 120,
          headalign: 'center',
          className: 'nowrap BGTenLen',
					render: function(rowid, rowdata, data) {
						if(!$.isNull(data)) {
							return '<code title="' + data + '">' + data + '</code>';
						} else {
							return '';
						}
					}

				});
				column.push({
					field: 'createDate',
					name: '编制日期',
					width: 150,
          headalign: 'center',
          align: 'center',
          className: 'nowrap BGdateClass',
					render: function(rowid, rowdata, data) {
						if(!$.isNull(data)) {
							return '<code title="' + data + '">' + data + '</code>';
						} else {
							return '';
						}
					}

				});
				column.push({
					field: 'checkUserName',
					name: '审核人',
					width: 120,
          headalign: 'center',
          className: 'nowrap BGTenLen',
					render: function(rowid, rowdata, data) {
						if(!$.isNull(data)) {
							return '<code title="' + data + '">' + data + '</code>';
						} else {
							return '';
						}
					}

				});
				column.push({
					field: 'checkDate',
					name: '审核日期',
					width: 150,
          headalign: 'center',
          align: 'center',
          className: 'nowrap BGdateClass',
					render: function(rowid, rowdata, data) {
						if(!$.isNull(data)) {
							return '<code title="' + data + '">' + data + '</code>';
						} else {
							return '';
						}
					}

				});
				column.push({
					type: 'toolbar',
					field: 'option',
					name: '操作',
					width: 60,
          headalign: 'center',
          align: 'center',
          className: 'nowrap',
					render: function(rowid, rowdata, data) {
						return '<button class="btn btn-log btn-watch-detail" data-toggle="tooltip" title="查看日志"><span class="icon-log"></span></button>';
					}
				});
				return [column];
			},
			getAdjustHead: function(cloumnData) {
				var columns = [];
				var column1 = [ //支持多表头
					{
						type: 'checkbox',
						field: '',
						name: '',
						rowspan: 2,
						width: 40,
						headalign: 'center',
						align: 'center'
          },
          // CWYXM-18408--指标年结涉及采购合同报销模块占用的指标结转完善--zsj
          {
            field: 'bgTypeName',
            name: '指标类型',
            className: 'nowrap BGTenLen',
            // width: 200,
            headalign: 'center',
            render: function(rowid, rowdata, data) {
              if(!$.isNull(data)) {
                return '<code title="' + data + '">' + data + '</code>';
              } else {
                return '';
              }
            }
          },
					{
						field: 'bgItemSummary',
						name: '摘要',
						width: 200,
						rowspan: 2,
						headalign: 'center',
						className: 'nowrap BGThirtyLen',
						render: function(rowid, rowdata, data) {
							if(!$.isNull(data)) {
								return '<code title="' + data + '">' + data + '</code>';
							} else {
								return '';
							}
						}
					},
				];
				column1.push({
					field: '',
					name: '指标调整',
					colspan: 5,
          // width: 200,
          className: 'nowrap',
					headalign: 'center'
				}, {
					field: 'bgItemCode',
					name: '指标编码',
					headalign: 'center',
          rowspan: 2,
          className: 'nowrap BGasscodeClass',
					width: 100
				})
        if(pageData.planData.isComeDocNum == "是") {
					column1.push({
						field: 'comeDocNum',
						name: '来文文号',
						className: 'BGThirtyLen nowrap',
            headalign: 'center',
            width: 200,
            rowspan: 2,
						render: function(rowid, rowdata, data) {
              if (!$.isNull(data)) {
                return '<code title="' + data + '">' + data + '</code>';
              } else {
                return '';
              }
						}
					});
				}
				if(pageData.planData.isSendDocNum == "是") {
					column1.push({
						field: 'sendDocNum',
						name: pageData.sendCloName,
            className: 'BGThirtyLen nowrap',
            width: 200,
            rowspan: 2,
						headalign: 'center',
						render: function(rowid, rowdata, data) {
              if (!$.isNull(data)) {
                return '<code title="' + data + '">' + data + '</code>';
              } else {
                return '';
              }
						}
					});
        }
        //CWYXM-11697  预算方案中要素选择里，增加是否采购属性，启用之后，编制指标时可选是和否，不能输入其他值，采购模块选择指标时，根据这个属性过滤。--zsj
        if (pageData.planData.isFinancialBudget == "1") {
          column1.push({
						field: 'bgItemIdMx',
						name: '财政指标ID',
						className: 'nowrap BGThirtyLen',
            width: 200,
            rowspan: 2,
						headalign: 'center',
						"render": function (rowid, rowdata, data, meta) {
							if (!$.isNull(data)) {
								return '<code title="' + data + '">' + data + '</code>';
							} else {
								return '';
							}
						}
					});
				}
				if(!$.isNull(pageData.planData)) {
					for(var i = 0; i < pageData.planData.planVo_Items.length; i++) {
						var item = pageData.planData.planVo_Items[i];
						var cbItem = item.eleCode;
						if(cbItem == 'ISUPBUDGET') {
							column1.push({
								field: 'isUpBudget',
								name: '是否采购',
								className: 'nowrap',
                // width: 200,
                rowspan: 2,
                align: 'center',
								headalign: 'center'
							});
						} else {
              if(cbItem != 'sendDocNum' &&  cbItem != 'bgItemIdMx'){
                column1.push({
                  field: bg.shortLineToTF(item.eleFieldName) + 'Name',
                  name: item.eleName,
                  rowspan: 2,
                  headalign: 'center',
                  width: 200,
                  className: 'nowrap BGThirtyLen',
                  render: function(rowid, rowdata, data) {
                    if(!$.isNull(data)) {
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
          for (var k = 0; k < pageData.planData.planVo_Txts.length; k++) {
            var code = bg.shortLineToTF(pageData.planData.planVo_Txts[k].eleFieldName)
            column1.push({
              field: code,
              name: pageData.planData.planVo_Txts[k].eleName,
              width: 200,
              rowspan: 2,
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
				//bug76244--增加备注列--经侯总确认目前只加“指标调整”与“指标调剂”--zsj
				column1.push({
					type: 'input',
					field: 'remark',
					name: '备注',
					width: 200,
					rowspan: 2,
					headalign: 'center',
					className: 'nowrap BGThirtyLen',
					render: function(rowid, rowdata, data) {
						if(!$.isNull(data)) {
							return '<code title="' + data + '">' + data + '</code>';
						} else {
							return '';
						}
					}
				});

				column1.push({
					type: 'toolbar',
					field: 'option',
					name: '操作',
					width: 80,
					rowspan: 2,
          headalign: 'center',
          align: 'center',
          className: 'nowrap',
					render: function(rowid, rowdata, data) {
						return '<button class="btn btn-delete" data-toggle="tooltip" title="删除"><span class="icon-trash"></span></button>' +
							'<button class="btn btn-log btn-watch-detail" data-toggle="tooltip" title="查看日志"><span class="icon-log"></span></button>';
					}
				});
				var column2 = [{
						field: 'parentBalanceCur',
						name: '可调增',
						headalign: 'center',
						width: 150,
            align: 'right',
            className: 'nowrap BGmoneyClass',
						render: function(rowid, rowdata, data) {
							if(rowdata.parentBalanceCur == -1) {
								return '';
							} else {
								return $.formatMoney(data, 2);
							}
						}
					},
					{
						type: 'money',
						field: 'bgAddCur',
						name: '调增',
						headalign: 'center',
						width: 150,
            align: 'right',
            className: 'nowrap BGmoneyClass',
						render: function(rowid, rowdata, data) {
							return '';
						},
						onKeyup: function(e) {
							var $row = $('tr[id="' + e.rowId + '"]');
							var blCur = e.rowData.bgItemBalanceCur;
							var parentBalanceCur = e.rowData.parentBalanceCur;
							var val = e.data;
							var hj = parseFloat(blCur) + parseFloat(val);
							e.rowData.modifyAfterCur = $.formatMoney(hj);
							$row.find('td[name="modifyAfterCur"]').html($.formatMoney(hj));
							if(parentBalanceCur != -1) {
								if(parentBalanceCur < val) {
									ufma.showTip('可调增金额不足！', function() {}, 'warning');
									$('#btn-save').attr('disabled', 'disabled');
								} else {
									$('#btn-save').removeAttr('disabled', 'disabled');
								}
							}

						}
					},
					{
						field: 'bgItemBalanceCur',
						name: '可调减',
						width: 150,
						headalign: 'center',
            align: 'right',
            className: 'nowrap BGmoneyClass',
						render: function(rowid, rowdata, data) {
							return $.formatMoney(data, 2);
						}
					},
					{
						type: 'money',
						field: 'bgCutCur',
						name: '调减',
						width: 150,
						headalign: 'center',
            align: 'right',
            className: 'nowrap BGmoneyClass',
						render: function(rowid, rowdata, data) {
							return '';
						},
						onKeyup: function(e) {
							var $row = $('tr[id="' + e.rowId + '"]');
							var blCur = e.rowData.bgItemBalanceCur;
							var val = e.data;
							if(val == '') val == 0.00;
							var hj = parseFloat(blCur) - val;
							e.rowData.modifyAfterCur = $.formatMoney(hj)
							$row.find('td[name="modifyAfterCur"]').html($.formatMoney(hj));
							if(blCur < val) {
								ufma.showTip('可调减金额不足！', function() {}, 'warning');
								$('#btn-save').attr('disabled', 'disabled');
							} else {
								$('#btn-save').removeAttr('disabled', 'disabled');
							}
						}
					},
					{
						field: 'modifyAfterCur',
						name: '调整后',
						width: 150,
						headalign: 'center',
            align: 'right',
            className: 'nowrap BGmoneyClass',
						render: function(rowid, rowdata, data) {
							return $.formatMoney(data, 2);
						}
					}
				];
				columns.push(column1);
				columns.push(column2);
				return columns;
			},
			setAdjustTable: function(data) {
				cacheData = pageData.subRowData;
				page.adjGridTop($('#zbtz-data-editor'));
				$('#zbtz-data-editor').ufDatagrid({
					data: data,
					idField: 'bgItemCode', //用于金额汇总
					pId: 'pid', //用于金额汇总
					frozenStartColumn: 1, //冻结开始列,从1开始
					frozenEndColumn: 1, //冻结结束列
					paginate: false, //分页
					columns: page.getAdjustHead(pageData.subRowData),
					initComplete: function(options, data) {
						$('#zbtz-data-editor tr').on('click', '.btn-log', function(e) {
							e.stopPropagation();
							var rowid = $(this).closest('tr').attr('id');
							var rowData = $('#zbtz-data-editor').getObj().getRowByTId(rowid);
							_bgPub_showLogModal("budgetEditor", {
								"bgBillId": rowData.billId,
								"bgItemCode": "",
								"agencyCode": page.agencyCode
							});
						});
						ufma.isShow(reslist);
					},
					toolbar: [{
							type: 'checkbox',
							id: 'check-all',
							class: 'check-all',
							text: '全选'
						},
						{
							type: 'button',
							class: 'btn-default btn-delete',
							text: '删除',
							action: function() {

								var checkData = $('#zbtz-data-editor').getObj().getCheckData();
								if(checkData.length == 0) {
									ufma.showTip("请选择要删除的指标！",function(){}, "warning");
									return false;
								} else {
									page.delItems(checkData);
								}

							}
						}
					],
					initComplete: function(options, data) {
						$('#zbtz-data-editor').on('click', '.btn-delete', function(e) {
							e.stopPropagation();
							var rowid = $(this).closest('tr').attr('id');
							var rowData = $('#zbtz-data-editor').getObj().getData();
							if(rowData.length <= 1) {
								ufma.confirm("您确定要删除您选择的记录吗?", function(rst) {
									if(rst) {
										var obj = $('#zbtz-data-editor').getObj(); // 取对象
										obj.del(rowid);
									}
								}, {
									'type': 'warning'
								});
								return false;
							}
							var obj = $('#zbtz-data-editor').getObj(); // 取对象
							obj.del(rowid);
						});
						$('#zbtz-data-editor tr').on('click', '.btn-log', function(e) {
							e.stopPropagation();
							var rowid = $(this).closest('tr').attr('id');
							var rowData = $('#zbtz-data-editor').getObj().getRowByTId(rowid);
							_bgPub_showLogModal("budgetEditor", {
								"bgBillId": rowData.billId,
								"bgItemCode": "",
								"agencyCode": page.agencyCode
							});
						});
						ufma.isShow(reslist);
						$.fn.dataTable.ext.errMode = 'none';
					}
				});
				ufma.isShow(reslist);
				$('#zbtz-data-editormoneybgAddCur').attr("maxlength", "20"); //控制金额列输入不可超出20位
				$('#zbtz-data-editormoneybgCutCur').attr("maxlength", "20");
			},
			adjGridTop: function($table) {
				$.timeOutRun(null, null, function() {
					var gridTop = $table.offset().top;
					var gridHeight = $('.ufma-layout-down').offset().top - gridTop - 15;
					$table.getObj().setBodyHeight(gridHeight);
				}, 800);
			},
			delItems: function(data) {
				for(var i = 0; i < data.length; i++) {
					var row = data[i];
					var trId = 'zbtz-data-editor_row_' + row.bgItemCode;
					$('#zbtz-data-editor').getObj().del(trId);
				}
			},
			initPage: function() {
				page.agencyCode = pageData.agencyCode;
				$('#billCode').val(pageData.billCode);
				var subRowData = [];
				subRowData.push(pageData.subRowData);
				page.setAdjustTable(subRowData);
				$('.bordered').removeClass('top-change-color');
				$("#billDate input").attr("disabled", false);
				$("#billDate span").show();
				$("#billDate").css("background", "#ffffff");
			},
			save: function() {
				var detailItems = $('#zbtz-data-editor').getObj().getData();
				cacheData = detailItems;
				var billHJJE = 0.00;
				for(var i = 0; i < detailItems.length; i++) {
					if((detailItems[i].bgAddCur > 0) && (detailItems[i].bgCutCur == 0)) {
						billHJJE = billHJJE + ufma.parseFloat(detailItems[i].bgAddCur);
						detailItems[i].checkAddCur = detailItems[i].bgAddCur;
						detailItems[i].bgAddCur = detailItems[i].bgAddCur;
						detailItems[i].checkCutCur = 0;
						detailItems[i].bgCutCur = 0;
						detailItems[i].createDate = page.addData.createDate;
						detailItems[i].latestOpDate = page.addData.createDate;
						detailItems[i].latestOpUser = page.addData.createUser;
						detailItems[i].latestOpUserName = page.addData.createUserName;
						detailItems[i].adjustDir = 1;
						detailItems[i].isNew = '是';
					} else if((detailItems[i].bgCutCur > 0) && (detailItems[i].bgAddCur == 0)) {
						billHJJE = billHJJE + ufma.parseFloat(detailItems[i].bgCutCur);
						detailItems[i].checkAddCur = 0;
						detailItems[i].bgAddCur = 0;
						detailItems[i].checkCutCur = detailItems[i].bgCutCur;
						detailItems[i].bgCutCur = detailItems[i].bgCutCur;
						detailItems[i].createDate = page.addData.createDate;
						detailItems[i].latestOpDate = page.addData.createDate;
						detailItems[i].latestOpUser = page.addData.createUser;
						detailItems[i].latestOpUserName = page.addData.createUserName;
						detailItems[i].adjustDir = 2;
						detailItems[i].isNew = '是';
					} else {
						ufma.showTip('不能同时进行调增调减操作！', function() {}, 'error');
						return false;
					}
					if(detailItems[i].isUpBudget == '是') {
						detailItems[i].isUpBudget = '1';
					} else if(detailItems[i].isUpBudget == '否') {
						detailItems[i].isUpBudget = '0';
					}
				}
				var items = [];
				for(var i = 0; i < detailItems.length; i++) {
					items.push(detailItems[i]);
				}
				//bug77471--zsj
				if($("#billFJ").val() < fileLeng) {
					ufma.showTip('输入附件数不能小于已上传附件数！', function() {}, 'warning');
					return false;
				}
				var data = {
					'agencyCode': page.agencyCode,
					'billId': pageData.newbillId,
					'billCode': pageData.billCode,
					'setYear': page.pfData.svSetYear,
					'createDate': window.ownerData.action == 'add' ? page.pfData.svSysDate : '',
					'billDate': page.pfData.svTransDate,
					'createUser': page.addData.createUser,
					'createUser': window.ownerData.action == 'add' ? page.pfData.svUserCode : '',
					'createUserName': window.ownerData.action == 'add' ? page.pfData.svUserName : '',
					'isNew': window.ownerData.action == 'add' ? '是' : '否',
					'status': 1,
					'latestOpDate': page.pfData.svSysDate,
					'latestOpUser': page.pfData.svUserCode,
					'latestOpUserName': page.pfData.svUserName,
					'billType': 3,
					'billCur': billHJJE,
					'items': items,
					'attachNum': $("#billFJ").val() //bug77471--zsj
				};
				var url = _bgPub_requestUrlArray_subJs[4] + "?billType=3&agencyCode=" + page.agencyCode + '&setYear=' + page.pfData.svSetYear;
				var callback = function(result) {
					if(result.flag == "success") {
						cacheData = detailItems;
						//bug77471--zsj
						if(result.data != []) {
							pageAttachNum = result.data.attachNum;
						}
						ufma.showTip("保存成功", null, "success");
					} else {
						ufma.showTip("保存失败!" + result.msg, null, "error");
					}
				}
				ufma.post(url, data, callback);
			},
			closeCheck: function() {
				var result = true;
				if($('#zbtz-data-editor').html() != '') {
					var tblData = $('#zbtz-data-editor').getObj().getData();
					return result = $.equalsArray(cacheData, tblData);
				} else {
					return result;
				}
			},
			onEventListener: function() {
				$('#btn-save').click(function() {
					$.timeOutRun(null, null, function() {
						page.save();
					}, 300);
				});
				$('#btn-close').click(function() {
					if(!page.closeCheck()) {
						ufma.confirm("有未保存的数据，是否确定离开页面?", function(rst) {
							if(rst) {
								_close('ok');
							}
						}, {
							'type': 'warning'
						});
						return false;
					} else {
						_close('ok');
					}
				});
				$('#btnUploadFile').on('click',
					function(e) {
						e.stopPropagation();

						var option = {
							"agencyCode": page.agencyCode,
							"billId": pageData.newbillId,
							"uploadURL": _bgPub_requestUrlArray_subJs[8] + "?agencyCode=" + page.agencyCode + "&setYear=" + page.pfData.svSetYear +
								"&billId=" + pageData.newbillId,
							"delURL": _bgPub_requestUrlArray_subJs[16] +
								"?agencyCode=" + page.agencyCode + "&setYear=" + page.pfData.svSetYear +
								"&billId=" + pageData.newbillId,
							"downloadURL": _bgPub_requestUrlArray_subJs[15] +
								"?agencyCode=" + page.agencyCode + "&setYear=" + page.pfData.svSetYear +
								"&billId=" + pageData.newbillId,
							"onClose": function(fileList) {
								/*$("#billFJ").val(fileList.length + "");
								modal_billAttachment = cloneObj(fileList);*/
								//bug77471--zsj
								fileLeng = fileList.length;
								attachNum = fileList.length < pageAttachNum ? pageAttachNum : fileList.length;
								$("#billFJ").val(attachNum + "");
								modal_billAttachment = cloneObj(fileList);
							}
						};
						//bugCWYXM-4284--已审核单据只能查看附件不可以删除已审核过的附件、且不能上传新的附件--zsj
						if(window.ownerData.action == 'add') {
							_bgPub_ImpAttachment("pnl-tzzb", "指标单据[" +
								pageData.billCode + "]附件导入",
								modal_billAttachment, option, window.ownerData.status);
						}

					});

			},
			//此方法必须保留
			init: function() {
				reslist = ufma.getPermission();
				ufma.isShow(reslist);
				page.pfData = ufma.getCommonData();
				ufma.parse();
				uf.parse();
				this.initPage();
				this.onEventListener();

			}
		}
	}();
	/////////////////////
	window.page = page;

	page.init();
});