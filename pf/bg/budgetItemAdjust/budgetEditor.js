$(function() {
	var cacheData = [];
	var modal_billAttachment = [];
    var codeList = [];
	window._close = function(state, data) {
		if(window.closeOwner) {
			var data = {
				action: state,
				data: data
			};
			window.closeOwner(data);
		}
	}
	//bug77471--zsj
	var attachNum = 0; //附件前输入框数字
	var pageAttachNum = 0; //后端返回的附件数字
	var fileLeng = 0; //实际上传文件数
	var dateBegin;
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
            // rowspan: 2,
						align: 'center'
					},
					{
						field: 'bgPlanName',
						name: '预算方案',
						width: 150,
            headalign: 'center',
            // rowspan: 2,
            className: "nowrap BGThirtyLen",
						render: function(rowid, rowdata, data) {
							if(!$.isNull(data)) {
								return '<code title="' + data + '">' + data + '</code>';
							} else {
								return '';
							}
						}
					},
					{
						field: 'bgItemCode',
						name: '指标编码',
						width: 100,
            headalign: 'center',
            // rowspan: 2,
            className: "nowrap BGasscodeClass",
						render: function(rowid, rowdata, data) {
							if(!$.isNull(data)) {
								return '<code title="' + data + '">' + data + '</code>';
							} else {
								return '';
							}
						}
					},
					{
						// CWYXM-18408--指标年结涉及采购合同报销模块占用的指标结转完善
						field: 'bgTypeName',
						name: '指标类型',
						className: 'BGTenLen nowrap',
						width: 200,
            headalign: 'center',
            // rowspan: 2,
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
						className: 'BGThirtyLen nowrap',
						width: 200,
            headalign: 'center',
            // rowspan: 2,
						render: function(rowid, rowdata, data) {
							if(!$.isNull(data)) {
								return '<code title="' + data + '">' + data + '</code>';
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
						className: 'BGThirtyLen nowrap',
            headalign: 'center',
            width: 200,
            // rowspan: 2,
						render: function(rowid, rowdata, data) {
              if (!$.isNull(data)) {
                return '<code title="' + data + '">' + data + '</code>';
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
            className: 'BGThirtyLen nowrap',
            width: 200,
            // rowspan: 2,
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
        //CWYXM-17554 预算方案设置中，增加财政指标ID属性，可选择是否启用，启用时，选择预算方案新增指标时，需要录入指标id，指标id也需要参与指标的要素唯一性校验--zsj
        if (page.planData.isFinancialBudget == "1") {
          column.push({
            field: "bgItemIdMx",
            name: '财政指标ID',
            className: "nowrap BGThirtyLen",
            width:200,
            // rowspan: 2,
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
				if(!$.isNull(page.planData)) {
					for(var i = 0; i < page.planData.planVo_Items.length; i++) {
						var item = page.planData.planVo_Items[i];
						if(item.eleName != '摘要') { //CWYXM-11693--nbsh---指标分 解、调整、调剂选择指标时，增加按摘要查询的条件--zsj
							var cbItem = item.eleCode;
							if(cbItem == 'ISUPBUDGET') {
								column.push({
									field: 'isUpBudget',
									name: '是否采购',
									className: 'nowrap',
                  // width: 200,
                  align: 'center',
                  // rowspan: 2,
									headalign: 'center'
								});
							} else {
                //CWYXM-17554 预算方案设置中，增加财政指标ID属性，可选择是否启用，启用时，选择预算方案新增指标时，需要录入指标id，指标id也需要参与指标的要素唯一性校验--zsj
                if (cbItem != 'sendDocNum' &&  cbItem != 'bgItemIdMx') { 
                  column.push({
                    field: bg.shortLineToTF(item.eleFieldName),
                    name: item.eleName,
                    width: 200,
                    headalign: 'center',
                    // rowspan: 2,
                    className: "nowrap BGThirtyLen",
                    render: function(rowid, rowdata, data) {
                      if(!$.isNull(data)) {
                        return '<span title="' + data + '">' + data + '</span>';
                      } else {
                        return '';
                      }
                    }
                  });
                }
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
              // rowspan: 2,
              className: 'nowrap BGThirtyLen',
              render: function (rowid, rowdata, data) {
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
					field: 'realBgItemCur', //经确认还原为原来的金额-CWYXM-10727
					//field: 'bgItemCur',//CWYXM-10727 指标分解新增页面，金额应显示最初指标编制金额--zsj
					name: '金额',
					width: 150,
					headalign: 'center',
          align: 'right',
          // rowspan: 2,
          className: "nowrap BGmoneyClass",
					render: function(rowid, rowdata, data) {
						if(!$.isNull(data)) {
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
          // rowspan: 2,
          className: "nowrap BGmoneyClass",
					render: function(rowid, rowdata, data) {
						if(!$.isNull(data)) {
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
          // rowspan: 2,
          headalign: 'center',
          className: "nowrap BGTenLen",
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
          width: 110,
          // rowspan: 2,
          headalign: 'center',
          align: 'center',
          className: "nowrap BGdateClass",
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
          className: "nowrap BGTenLen",
          // rowspan: 2,
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
					width: 110,
          headalign: 'center',
          align: 'center',
          // rowspan: 2,
          className: "nowrap BGdateClass",
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
          // rowspan: 2,
					width: 60,
          headalign: 'center',
          className: "nowrap",
					render: function(rowid, rowdata, data) {
						return '<button class="btn btn-log btn-watch-detail btn-permission" data-toggle="tooltip" title="查看日志"><span class="icon-log"></span></button>';
					}
				});
				return [column];
			},
			setBudgetTable: function() { //第一页显示所有指标表格
				$('#select-data').ufDatagrid({
					data: [],
					idField: 'bgItemCode', //用于金额汇总
					pId: 'pid', //用于金额汇总
					disabled: false, //可选择
					frozenStartColumn: 1, //冻结开始列,从1开始
					frozenEndColumn: 1, //冻结结束列
					paginate: false, //分页
					columns: page.getBudgetHead(),
					initComplete: function(options, data) {
						page.adjGridTop($('#select-data'));
						$('#select-data tr').on('click', '.btn-log', function(e) {
							e.stopPropagation();
							var rowid = $(this).closest('tr').attr('id');
							var rowData = $('#select-data').getObj().getRowByTId(rowid);
							_bgPub_showLogModal("budgetEditor", {
								"bgBillId": rowData.billId,
								"bgItemCode": "",
								"agencyCode": page.agencyCode
							});
						});
						ufma.isShow(reslist);
					},
				});
				if($.isNull(page.planData)) {
					return false;
				}
				var url = "/bg/budgetItem/multiPost/getBudgetItems" + '?agencyCode=' + page.agencyCode + "&setYear=" + page.pfData.svSetYear;
				var argu = page.setSearchMap(page.planData);
				var data = [];
				var callback = function(result) {
					for(var i = 0; i < result.data.billWithItemsVo.length; i++) {
						page.composePlanId = result.data.billWithItemsVo[0].billWithItems[0].bgPlanId;
						page.composePlanName = result.data.billWithItemsVo[0].billWithItems[0].bgPlanName;
						var item = result.data.billWithItemsVo[i];

						for(var j = 0; j < item.billWithItems.length; j++) {
							var row = $.extend(true, item.billWithItems[j], {
								checkUserName: item.checkUserName,
								checkDate: item.checkDate
							});
							if(row.createDate != null && row.createDate != "") {
								row.createDate = row.createDate.substr(0, 10);
							}
							if(row.checkDate != null && row.checkDate != "") {
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
            className: "nowrap",
						align: 'center'
					},
					{
						// CWYXM-18408--指标年结涉及采购合同报销模块占用的指标结转完善
						//type: 'input',
						field: 'bgTypeName',
						name: '指标类型',
						width: 200,
            rowspan: 2,
						headalign: 'center',
						className: 'nowrap BGTenLen',
						render: function(rowid, rowdata, data) {
							if(!$.isNull(data)) {
								return '<code title="' + data + '">' + data + '</code>';
							} else {
								return '';
							}
						}
					},
					{
						//type: 'input',
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
				if(page.planData.isComeDocNum == "是") {
					column1.push({
						field: 'comeDocNum',
						name: '来文文号',
						className: "nowrap BGThirtyLen",
            headalign: 'center',
            rowspan: 2,
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
				if(page.planData.isSendDocNum == "是") {
					column1.push({
						field: 'sendDocNum',
						name: page.sendCloName,
						className: "nowrap BGThirtyLen",
            headalign: 'center',
            rowspan: 2,
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
        //CWYXM-17554 预算方案设置中，增加财政指标ID属性，可选择是否启用，启用时，选择预算方案新增指标时，需要录入指标id，指标id也需要参与指标的要素唯一性校验--zsj
        if (page.planData.isFinancialBudget == "1") {
          column1.push({
            field: "bgItemIdMx",
            name: '财政指标ID',
            className: "nowrap BGThirtyLen",
            width: 200,
            rowspan: 2,
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
				if(!$.isNull(page.planData)) {
					for(var i = 0; i < page.planData.planVo_Items.length; i++) {
						var item = page.planData.planVo_Items[i];
						var cbItem = item.eleCode;
						if(item.eleName != '摘要') {
							if(cbItem == 'ISUPBUDGET') {
								column1.push({
									field: 'isUpBudget',
									name: '是否采购',
									className: "nowrap",
									// width: 200,
                  headalign: 'center',
                  align: 'center',
                  rowspan: 2,
								});
							} else {
                //CWYXM-17554 预算方案设置中，增加财政指标ID属性，可选择是否启用，启用时，选择预算方案新增指标时，需要录入指标id，指标id也需要参与指标的要素唯一性校验--zsj
                if (cbItem != 'sendDocNum' &&  cbItem != 'bgItemIdMx') {                                
                  column1.push({
                    field: bg.shortLineToTF(item.eleFieldName)+ 'Name',
                    name: item.eleName,
                    rowspan: 2,
                    headalign: 'center',
                    width: 200,
                    className: "nowrap BGThirtyLen",
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

						}
          };
          //CWYXM-18080 编制指标时需要增加文本说明项，只录入文本，用于描述指标信息--zsj--查询条件区域
          for (var k = 0; k < page.planData.planVo_Txts.length; k++) {
            var code = bg.shortLineToTF(page.planData.planVo_Txts[k].eleFieldName)
            column1.push({
              field: code,
              name: page.planData.planVo_Txts[k].eleName,
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
					className: "nowrap BGThirtyLen",
					onKeyup: function(e) {
						//CWYXM-10737 --指标编制-摘要列，指标调整、调剂-备注列前台应限制长度，目前未限制保存报错--zsj
						if(e.data.length > 100) {
							//CWYXM-10737 --指标编制-摘要列，指标调整、调剂-备注列前台应限制长度，目前未限制保存报错--zsj
							var $row = $('tr[id="' + e.rowId + '"]');
							var val = e.data;
							$row.find('td[name="remark"]').attr('title', val);
							$('#zbtz-data-editorinputremark').attr('maxlength', 100);
						}
					},
					render: function(rowid, rowdata, data) {
						if(!$.isNull(data)) { //如果为已审核单子，不可编辑
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
          className: "nowrap",
					render: function(rowid, rowdata, data) {
						if(page.statusLab == '3') { //如果为已审核单子，不可编辑
							return '<button class="btn btn-delete btn-permission disabled" data-toggle="tooltip" title="删除"><span class="icon-trash"></span></button>' +
								'<button class="btn btn-log btn-watch-detail btn-permission " data-toggle="tooltip" title="查看日志"><span class="icon-log"></span></button>';
						} else {
							return '<button class="btn btn-delete btn-permission " data-toggle="tooltip" title="删除"><span class="icon-trash"></span></button>' +
								'<button class="btn btn-log btn-watch-detail btn-permission " data-toggle="tooltip" title="查看日志"><span class="icon-log"></span></button>';

						}
					}
				});
				var column2 = [{
						field: 'parentBalanceCur',
						name: '可调增',
						headalign: 'center',
						width: 150,
            align: 'right',
            className: "nowrap BGmoneyClass",
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
            className: "nowrap BGmoneyClass",
						render: function(rowid, rowdata, data) {
							if(page.pageAction == 'add') {
								return '';
							} else {
								if(!$.isNull(data)) {
									return $.formatMoney(data, 2);
								} else {
									return '';
								}
							}
						},
						onKeyup: function(e) {
              //ZJGA820-1549--指标调整当调增和调减都赋值，计算后调整后金额不正确--zsj
							var $row = $('tr[id="' + e.rowId + '"]');
              var blCur = e.rowData.bgItemBalanceCur;
              var bgCutCur = e.rowData.bgCutCur
              if(!$.isNull(bgCutCur)){
                if(parseFloat(bgCutCur) != 0){
                  e.rowData.bgAddCur = '';
                  ufma.showTip('不能同时进行调增、调减操作！',function(){},'warning')
                  $('#zbtz-data-editormoneybgAddCur').val('')
                }else{
                  e.rowData.bgCutCur = '';
                  $row.find('td[name="bgCutCur"]').html('');
                  $('#zbtz-data-editormoneybgCutCur').val('')
                }
              }else {
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
						}
					},
					{
						field: 'bgItemBalanceCur',
						name: '可调减',
						width: 150,
						headalign: 'center',
            align: 'right',
            className: "nowrap BGmoneyClass",
						render: function(rowid, rowdata, data) {
							//return $.formatMoney(data,2);
							if(page.statusLab == '3') {
								if(rowdata.bgAddCur > 0 && rowdata.bgCutCur == 0) {
									//var data = rowdata.bgItemBalanceCur - rowdata.bgAddCur;
									var data = rowdata.bgItemBalanceCur;
								} else if(rowdata.bgCutCur > 0 && rowdata.bgAddCur == 0) {
									//	var data = rowdata.bgItemCur;
									var data = rowdata.bgItemBalanceCur + rowdata.bgCutCur; //CWYXM-11959 指标调整-调整的指标审核后,查看指标余额变成了指标编制金额-zsj
								} else {
									var data = 0;
								}
								return $.formatMoney(data, 2);
							} else if(page.statusLab == '1') {
								if(rowdata.bgCutCur > 0 && rowdata.bgAddCur == 0) {
									var data = $.parseFloat(rowdata.bgItemBalanceCur + rowdata.bgCutCur);
								}
								return $.formatMoney(data, 2);
							}
						}
					},
					{
						type: 'money',
						field: 'bgCutCur',
						name: '调减',
						width: 150,
						headalign: 'center',
            align: 'right',
            className: "nowrap BGmoneyClass",
						render: function(rowid, rowdata, data) {
							if(page.pageAction == 'add') {
								return '';
							} else {
								return $.formatMoney(data, 2);
							}
						},
						onKeyup: function(e) {
              //ZJGA820-1549--指标调整当调增和调减都赋值，计算后调整后金额不正确--zsj
							var $row = $('tr[id="' + e.rowId + '"]');
							var blCur = e.rowData.bgItemBalanceCur;
              var val = e.data;
              var bgAddCur = e.rowData.bgAddCur
              if(!$.isNull(bgAddCur)){
                if(parseFloat(bgAddCur) != 0){
                  e.rowData.bgCutCur = '';
                  ufma.showTip('不能同时进行调增、调减操作！',function(){},'warning')
                  $('#zbtz-data-editormoneybgCutCur').val('')
                }else{
                  e.rowData.bgAddCur = '';
                  $row.find('td[name="bgAddCur"]').html('');
                  $('#zbtz-data-editormoneybgAddCur').val('')
                }
              }else {
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
						}
					},
					{
						field: 'modifyAfterCur',
						name: '调整后',
						width: 150,
						headalign: 'center',
            align: 'right',
            className: "nowrap BGmoneyClass",
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
				$('#zbtz-data-editor').html('');
				cacheData = data;
				page.adjGridTop($('#zbtz-data-editor'));
				var sDisabled = false;
				//已审核的单据不可编辑
				//if(page.statusLab == '3') { //如果为已审核单子，不可编辑
				if(page.statusLab == '3') { //如果为已审核单子，不可编辑
					sDisabled = true;
				} else if(page.statusLab == '1') {
					sDisabled = false;
				}
				$('#zbtz-data-editor').ufDatagrid({
					data: data,
					idField: 'bgItemCode', //用于金额汇总
					pId: 'pid', //用于金额汇总
					disabled: sDisabled, //可选择
					frozenStartColumn: 1, //冻结开始列,从1开始
					frozenEndColumn: 1, //冻结结束列
					paginate: false, //分页
					columns: page.getAdjustHead(data),
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
								var tableData = $('#zbtz-data-editor').getObj().getData();
								if(checkData.length == 0) {
									ufma.showTip('请先选择您要删除的指标！', function() {}, 'warning');
									return false;
								} else if(tableData.length == 1) { //CWYXM-8431指标调整，新增时，删除行，应至少保留一条记录，目前可都删除且保存成功--zsj
									ufma.showTip('请至少保留一条指标！', function() {}, 'warning');
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
							if(rowData.length > 1) {
								ufma.confirm("您确定要删除您选择的记录吗?", function(rst) {
									if(rst) {
										var obj = $('#zbtz-data-editor').getObj(); // 取对象
										obj.del(rowid);
									}
								}, {
									'type': 'warning'
								});
							} else if(rowData.length == 1) { //CWYXM-8431指标调整，新增时，删除行，应至少保留一条记录，目前可都删除且保存成功--zsj
								ufma.showTip('请至少保留一条数据', function() {}, 'warning');
								return false;
							}
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
			//CWYXM-10584 ---指标调整调剂查看界面增加审核、销审按钮，可以直接审核调整和调剂单--zsj
			checkBills: function(data) {
				var argu = {
					'agencyCode': page.agencyCode,
					'setYear': page.pfData.svSetYear,
					'bgPlanChrId': page.planData.chrId,
					'items': data
				};
				if(page.statusLab == "1") {
					ufma.confirm('您确定要审核当前单据吗？', function(ac) {
						if(ac) {
							ufma.showloading('数据审核中，请耐心等待...');
							argu.checkUser = page.pfData.svUserCode;
							argu.status = "3";
							argu.billType = "3";
							argu.checkUserName = page.pfData.svUserName;
							argu.checkDate = page.pfData.svSysDate;
							var url = _bgPub_requestUrlArray_subJs[12] +
								"?billType=3&agencyCode=" +
								page.agencyCode;
							var callback = function(result) {
								ufma.hideloading();
								ufma.showTip('审核成功！', function() {
									//CWYXM-11907、CWYXM-11968 指标管理-指标调整,保存后数据没回显,得刷新才行--zsj
									var saveData = [];
									var closeArgu = {
										cbBgPlanId: page.cbBgPlanId,
										cbBgPlanText: page.cbBgPlanText,
										saveFlag: page.saveTrue
									}
									saveData.push(closeArgu);
									localStorage.removeItem("saveData");
									localStorage.setItem("saveData", JSON.stringify(saveData));
									page.saveTrue = false;
									page.statusLab = '3';
									page.pageAction = 'edit';
									if(page.pageAction != 'edit') {
										$('#btn-continue').removeClass('hide');
									}
									$('#btnCancleAudit').removeClass('hide');
									$('#btnAudit').addClass('hide');
									/*page.timeline.next();
									page.ctrlToolBar();*/
									$("#btn-save").addClass("hide");
									$("#btn-prev").addClass("hide");
									$("#btn-newRow-decompose").addClass("hide");
									$('#decompose-data .btn-delete').attr('disabled', 'disabled');
									$('#decompose-data .check-all').attr('disabled', 'disabled');
									$('#zbtz-data-editor .btn').attr('disabled', 'disabled');
									//已审核的单子不允许修改附件数或者上传附件
									$('#billFJ').attr('disabled', 'disabled');
									page.afertCheck(argu.items);
								}, 'success');
							};
							ufma.post(url, argu, callback);
						}
					}, {
						'type': 'warning'
					});
				} else if(page.statusLab == "3") {
					ufma.confirm('您确定要销审当前单据吗？', function(ac) {
						if(ac) {
							ufma.showloading('数据销审中，请耐心等待...');
							argu.status = "1";
							argu.billType = "3";
							argu.checkUser = page.pfData.svUserCode;
							argu.checkUserName = page.pfData.svUserName;
							argu.checkDate = (new Date()).Format('yyyy-MM-dd');
							var url = _bgPub_requestUrlArray_subJs[13] +
								"?billType=3&agencyCode=" +
								page.agencyCode;
							var callback = function(result) {
								ufma.hideloading();
								ufma.showTip('销审成功！', function() {
									//CWYXM-11907、CWYXM-11968 指标管理-指标调整,保存后数据没回显,得刷新才行--zsj
									var saveData = [];
									var closeArgu = {
										cbBgPlanId: page.cbBgPlanId,
										cbBgPlanText: page.cbBgPlanText,
										saveFlag: page.saveTrue
									}
									saveData.push(closeArgu);
									localStorage.removeItem("saveData");
									localStorage.setItem("saveData", JSON.stringify(saveData));
									page.saveTrue = false;
									page.statusLab = '1';
									page.pageAction = 'edit';
									$('#btnCancleAudit').addClass('hide');
									if(page.pageAction != 'edit') {
										$('#btn-continue').removeClass('hide');
									}
									$("#btn-save,#btnAudit").removeClass("hide");
									$("#btn-prev").addClass("hide");
									$('#zbtz-data-editor .btn').removeClass('disabled');
									//$("#btn-continue").addClass("hide");
									//未审核的单子允许修改附件数或者上传附件
									$('#billFJ').removeAttr('disabled');
									page.afertCheck(argu.items);
									/*page.timeline.next();
						            page.ctrlToolBar();*/
								}, 'success');
							};
							ufma.post(url, argu, callback);
						}
					}, {
						'type': 'warning'
					});
				}

			},
			//CWYXM-10166 指标编制、指标控制管理界面记忆预算方案--新增需求记忆预算方案--单位加载完后请求预算方案，若有记忆则用已经记忆 的值的数据--zsj
			selectSessionData: function() {
				var argu = {
					agencyCode: page.agencyCode,
					acctCode: '*',
					menuId: window.ownerData.menuId
				}
				ufma.get('/pub/user/menu/config/select', argu, function(result) {
					page.sessionPlanData = result.data;
					page.initSearchPnl();
				});
			},
			setSearchMap: function(planData) {
				var searchMap = {
					'agencyCode': page.agencyCode
				};
				searchMap['bgItemType'] = '5';
				searchMap['bgReserve'] = "1";
				searchMap['status'] = "3";
				searchMap['businessDateBegin'] = $('#createDate1').getObj().getValue();
				searchMap['businessDateEnd'] = $('#createDate2').getObj().getValue();
				searchMap['setYear'] = planData.setYear;
				searchMap['chrId'] = planData.chrId;
				searchMap['bgItemSummary'] = $('#cbbgItemSummary').val();
				if(!$.isNull(planData)) {
					searchMap['chrId'] = planData.chrId;
					for(var i = 0; i < planData.planVo_Items.length; i++) {
						var item = planData.planVo_Items[i];
						if(item.eleName != '摘要') {
							var cbItem = item.eleCode;
							var field = item.eleFieldName;
              //ZJGA820-1548 --指标调整与指标调剂点击新增页面中查询条件无效--zsj
              if($.inArray('ISUPBUDGET', codeList) > -1 && cbItem == 'ISUPBUDGET') {
								searchMap['isUpBudget'] = $('#isUpBudget').getObj().getValue();
							} else if(cbItem == 'sendDocNum'){
                searchMap['sendDocNum'] = $('#cbsendDocNum').val();
              } else if(cbItem == 'bgItemIdMx'){
                searchMap['bgItemIdMx'] = $('#cbbgItemIdMx').val();
              } else {
								var combox = $('#cb' + cbItem).getObj();
								searchMap[bg.shortLineToTF(field)] = combox.getValue();
							}
						}
					};
				}
				return searchMap;
			},
			delItems: function(data) {
				for(var i = 0; i < data.length; i++) {
					var row = data[i];
					var trId = 'zbtz-data-editor_row_' + row.bgItemCode;
					$('#zbtz-data-editor').getObj().del(trId);
				}
			},
			initSearchPnl: function() {
				uf.cacheDataRun({
					element: $('#cbBgPlan'),
					cacheId: page.agencyCode + '_plan_items',
					url: bg.getUrl('bgPlan') + "?ajax=1" + "&isEnabled=1",
					param: {
						'agencyCode': page.agencyCode,
						'setYear': page.pfData.svSetYear
					},
					callback: function(element, data) {
						element.ufCombox({ //初始化
							data: data, //列表数据
							readonly: true, //可选
							placeholder: "请选择预算方案",
							onChange: function(sender, data) {
                var codeArr = []
                for (var z = 0; z < data.planVo_Items.length; z++) {
                  var code = data.planVo_Items[z].eleCode;
                  codeList.push(data.planVo_Items[z].eleCode);
                  if (code != 'sendDocNum' && code != 'bgItemIdMx'){
                    codeArr.push(data.planVo_Items[z]);
                  }
								} 
								//CWYXM-11693--nbsh---指标分 解、调整、调剂选择指标时，增加按摘要查询的条件--zsj
								var summeryArgu = {
                                    eleName: "摘要",
                                    eleCode:'bgItemSummary',
									nameCode: "bgItemSummary"
								}
								codeArr.splice(0, 0, summeryArgu);
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
                                page.planData = data;
                                page.planData.planVo_Items = codeArr;
								//bugCWYXM-10166--新增需求记忆预算方案--更新记忆数据--zsj
								bg.initBgPlanItemPnl($('#searchPlanPnl'), page.planData);
								page.adjGridTop($('#select-data'));
								page.setBudgetTable();
							},
							onComplete: function() {
                //CWYXM-17038 指标管理模块--所有涉及到预算方案记忆的界面均需判断已记忆方案是否被删除--zsj
                var planIdArr = [];
                for(var a = 0; a < data.length; a++) {
									planIdArr.push(data[a].chrId);
								}
								if(!$.isNull(page.sessionPlanData.cbBgPlan) && page.pageAction == 'add') {
									var planData = page.sessionPlanData.cbBgPlan.split(",");
									var planId = planData[0];
                  var planName = planData[1];
                  if($.inArray(planId,planIdArr) > -1){
                    $('#cbBgPlan').getObj().setValue(planId, planName);
                  }else {
                    $('#cbBgPlan').getObj().val($.isNull(window.ownerData.planId) ? 'null' : window.ownerData.planId);
                  }
								} else {
									$(element).getObj().val($.isNull(window.ownerData.planId) ? 'null' : window.ownerData.planId);
								}
							}
						});
					}
				});
			},
			initTimeline: function() {
				$('#tzdTimeline').ufTimeline({
					steps: [{
							step: '选择待调整指标',
							target: 'pnl-xzzb'
						},
						{
							step: '调整指标',
							target: 'pnl-tzzb'
						},
						{
							step: '完成',
							target: 'pnl-tzzb'
						}
					]
				});
				page.timeline = $('#tzdTimeline').getObj();
				page.timeline.step(1);
			},
			initPage: function() {
				//$('#createDate1').ufDatepicker('update', page.pfData.svTransDate.substr(0, 8) + "01");
				var mydate = new Date(page.pfData.svTransDate);
				var Year = mydate.getFullYear();
				$('#createDate1').getObj().setValue(Year + '-01-01');
        $('#createDate2').ufDatepicker('update', page.pfData.svTransDate);
        //ZJGA820-1670---指标编制点击新增单据日期默认是2020年1月1日，需要改为登陆日期。经雪蕊、侯总确定改为当前登录日期--zsj
        $('#billDate').ufDatepicker('update', page.pfData.svTransDate);
				page.initTimeline();
				if(page.pageAction == 'add') {
					$('.bordered').removeClass('top-change-color');
					//	page.initSearchPnl();
					page.selectSessionData();
					$("#billDate input").attr("disabled", false);
					$("#billDate span").show();
					$("#billDate").css("background", "#ffffff");
				} else {
					this.setEditWindow();
					$('.bordered').addClass('top-change-color');
					//修改  编辑界面不可修改单据日期  guohx
					$("#billDate input").attr("disabled", "disabled");
					$("#billDate span").hide();
					$("#billDate").css("background", "#eee");
				}
			},
			//审核/销审后需要刷新一下界面
			afertCheck: function(checkBillId) {
				var url = window.ownerData.queryUrl;
				var argu = window.ownerData.queryArgu;
				argu.businessDateBegin = dateBegin;
				argu.businessDateEnd = $('#billDate').getObj().getValue();
				argu.agencyCode = window.ownerData.agencyCode;
				argu.setYear = page.pfData.svSetYear;
				argu.status = page.statusLab;
				argu.chrId = page.cbBgPlanId;
				argu = $.extend(argu, bg.getBgPlanItemMap(page.planData));
				var useBillId = checkBillId[0].billId;
				ufma.post(url, argu, function(result) {
					var data = {};
					for(var i = 0; i < result.data.billWithItemsVo.length; i++) {
						var item = result.data.billWithItemsVo[i];
						if(item.billId == useBillId) {
							data[useBillId] = item;
						}
					}
					page.setEditWindow(data, checkBillId);
				});
			},
			setEditWindow: function(checkData, checkBillId) {
				var useBillId = '';
				if(checkBillId) {
					useBillId = checkBillId[0].billId;
				}
				page.timeline.step(2);
				page.ctrlToolBar();
				var data = [];
				$('#tzdTimeline').addClass('hide');
				if(checkData) {
					page.curBill = checkData[useBillId];
				} else {
					page.setBillCode();
					page.curBill = ufma.getObjectCache('curBillData');
				}
				page.billId = page.curBill.billId;
				page.billCode = page.curBill.billCode;
				page.statusLab = page.curBill.status;
				$('#billCode').val(page.curBill.billCode);
				$('#billDate').getObj().setValue(page.curBill.billDate);
				for(var j = 0; j < page.curBill.billWithItems.length; j++) {
					row = page.curBill.billWithItems[j];
					data.push(row);
				};
				page.setAdjustTable(data);
				if(page.statusLab == "1") {
					$("#btn-save,#btnAudit").removeClass("hide");
					$("#btn-prev,#btnCancleAudit").addClass("hide");
					$('#zbtz-data-editor .btn').removeClass('disabled');
					//$("#btn-continue").addClass("hide");
					//未审核的单子允许修改附件数或者上传附件
					$('#billFJ').removeAttr('disabled');
					$('#zbtz-data-editor').removeClass('uf-datagrid-disabled'); //CWYXM-11016-- 查看指标调整审核单据，在页面进行销审，页面自动刷新后应可编辑，目前不可编辑--zsj
				} else {
					$("#btn-save,#btnAudit").addClass("hide");
					$("#btn-prev").addClass("hide");
					if(page.pageAction != 'edit') {
						$('#btn-continue').removeClass('hide');
					}
					$("#btnCancleAudit").removeClass("hide");
					$("#btn-newRow-decompose").addClass("hide");
					$('#decompose-data .btn-delete').attr('disabled', 'disabled');
					$('#decompose-data .check-all').attr('disabled', 'disabled');
					$('#zbtz-data-editor .btn').attr('disabled', 'disabled');
					//已审核的单子不允许修改附件数或者上传附件
					$('#billFJ').attr('disabled', 'disabled');
					$('#zbtz-data-editor').addClass('uf-datagrid-disabled'); //CWYXM-11016-- 查看指标调整审核单据，在页面进行销审，页面自动刷新后应可编辑，目前不可编辑--zsj
				}
				var tmpRst = _bgPub_GetAttachment({
					"billId": page.billId,
					"agencyCode": page.agencyCode
				});
				if(!$.isNull(tmpRst.data.bgAttach)) {
					for(var m = 0; m < tmpRst.data.bgAttach.length; m++) {
						modal_billAttachment[modal_billAttachment.length] = {
							"filename": tmpRst.data.bgAttach[m].fileName,
							"filesize": 0,
							"fileid": tmpRst.data.bgAttach[m].attachId
						};
					}
				}
				//	$("#billFJ").val(window.ownerData.attachNum + ""); //bug77471--zsj
				$("#billFJ").val(page.curBill.attachNum + ""); //CWYXM-11624 --指标调整，在上传为附件后，再次编辑附件数量还是为0--zsj
			},
			ctrlToolBar: function() {
				var step = page.timeline.stepIndex();
				switch(step) {
					case 1:
						$('#btn-prev').addClass('hide');
						$('#btn-continue').addClass('hide');
						$("#btn-save,#btnAudit,#btnCancleAudit").addClass('hide');
						$('#btn-next').removeClass('hide');
						break;
					case 2:
						$('#btn-prev').removeClass('hide');
						$('#btn-save').removeClass('hide');
						//$('#btn-import').removeClass('hide');
						$('#btn-next').addClass('hide');
						$('#btn-continue').addClass('hide');
						break;
					case 3:
						/*$('#btn-prev').addClass('hide');
						$('#btn-save,#btnAudit,#btnCancleAudit').addClass('hide');
						$('#btn-next').addClass('hide');*/
						//$('#btn-continue').removeClass('hide');
						break;
					default:
						break;
				}
			},
			//CWYXM-10166 指标编制、指标控制管理界面记忆预算方案--新增需求记忆预算方案-更新记忆数据--zsj
			updateSessionPlan: function() {
				var argu = {
					acctCode: "*",
					agencyCode: page.agencyCode,
					configKey: page.configKey,
					configValue: page.configValue,
					menuId: window.ownerData.menuId
				}
				ufma.post('/pub/user/menu/config/update', argu, function(reslut) {});
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
					} else if($.isNull(detailItems[i].bgCutCur) && $.isNull(detailItems[i].bgAddCur) && (detailItems[i].bgCutCur == 0) && (detailItems[i].bgAddCur == 0)) { //CWYXM-4873 指标调整，调增调减都为空时，提示信息修改为：“调整金额不能为空”-zsj；CWYXM-11029指标调剂，未录入调入调出金额直接保存，目前提示‘至少保留一条调整记录！’--zsj
						ufma.showTip('调整金额不能为空！', function() {}, 'error');
						return false;
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
					'billId': page.billId,
					'billCode': page.billCode,
					'setYear': page.pfData.svSetYear,
					'createDate': page.pageAction == 'add' ? page.pfData.svSysDate : '',
					'billDate': page.pfData.svTransDate,
					'createUser': page.addData.createUser,
					'createUser': page.pageAction == 'add' ? page.pfData.svUserCode : '',
					'createUserName': page.pageAction == 'add' ? page.pfData.svUserName : '',
					'isNew': page.pageAction == 'add' ? '是' : '否',
					'status': '1',
					'latestOpDate': page.pfData.svSysDate,
					'latestOpUser': page.pfData.svUserCode,
					'latestOpUserName': page.pfData.svUserName,
					'billType': "3",
					'billCur': billHJJE,
					'items': items,
					'attachNum': $("#billFJ").val() //bug77471--zsj
				};
				var url = _bgPub_requestUrlArray_subJs[4] + "?billType=3&agencyCode=" + page.agencyCode + '&setYear=' + page.pfData.svSetYear;
				var callback = function(result) {
					if(result.flag == "success") {
						//bugCWYXM-10166--新增需求记忆预算方案--取出已经记忆的数据--zsj
						//page.updateSessionPlan();
						cacheData = detailItems;
						//bug77471--zsj
						if(result.data != []) {
							pageAttachNum = result.data.attachNum;
						}
						page.billId = result.data.billId;
						ufma.showTip("保存成功", null, "success");
						//CWYXM-11907、CWYXM-11968 指标管理-指标调整,保存后数据没回显,得刷新才行--zsj
						var saveData = [];
						var closeArgu = {
							cbBgPlanId: page.cbBgPlanId,
							cbBgPlanText: page.cbBgPlanText,
							saveFlag: true
						}
						saveData.push(closeArgu);
						localStorage.removeItem("saveData");
						localStorage.setItem("saveData", JSON.stringify(saveData));
						page.saveTrue = false;
						//CWYXM-10584 ---指标调整调剂查看界面增加审核、销审按钮，可以直接审核调整和调剂单--zsj
						if(page.timeline.stepIndex() == 2 && page.pageAction != 'edit') {
							page.timeline.next();
						}
						if(page.pageAction != 'edit') {
							$('#btn-continue').removeClass('hide');
						}
						$("#btnAudit").removeClass("hide");
						//page.ctrlToolBar();
					} else {
						ufma.showTip("保存失败!" + result.msg, null, "error");
					}
				}
				ufma.post(url, data, callback);
			},
			setBillCode: function() {
				if($.isNull(window.ownerData.billId)) {
					var url = _bgPub_requestUrlArray_subJs[14];
					var argu = {
						'agencyCode': page.agencyCode
					};
					argu['billType'] = 3;
					var callback = function(result) {
						page.addData = result.data;
						page.billId = result.data.billId;
						page.billCode = result.data.billCode;
						$('#billCode').val(page.billCode);
					}
					ufma.get(url, argu, callback);
				} else {
					if(page.checkFlag != true) {
						page.billId = window.ownerData.billId;
						page.billCode = window.ownerData.billCode;
						$('#billCode').val(window.ownerData.billCode);
					}
				}
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
				$('.btn-search').click(function() {
					page.setBudgetTable();
				});
				$('#btn-next').click(function() {
					var data = [];
					if(page.timeline.stepIndex() == 1) {
						data = $('#select-data').getObj().getCheckData();
						if(data.length == 0) {
							ufma.showTip('请选择需要调整的指标！', function() {}, 'warning');
							return false;
						} else {
							for(var i = 0; i < data.length; i++) {}
						}
					}
					page.cbBgPlanId = $('#cbBgPlan').getObj().getValue();
					page.cbBgPlanText = $('#cbBgPlan').getObj().getText();
					dateBegin = $('#createDate1').getObj().getValue();
					page.timeline.next();
					page.ctrlToolBar();
					if(page.timeline.stepIndex() == 2) {
						page.statusLab = "1";
						page.setAdjustTable(data); //表格显示后再调用，否则看不到表格
					}
					page.setBillCode();
				});
				$('#btn-prev').click(function() {
					page.timeline.prev();
					page.ctrlToolBar();
				});
				$('#btn-save').click(function() {
					$.timeOutRun(null, null, function() {
						page.save();
					}, 300);
				});
				//CWYXM-10584 ---指标调整调剂查看界面增加审核、销审按钮，可以直接审核调整和调剂单--zsj
				//销审
				$("#btnCancleAudit").on('click', function() {
					var checkData = $('#zbtz-data-editor').getObj().getCheckData();
					var data = [];
					data.push({
						'billId': page.billId
					});
					page.checkBills(data);
				});
				//审核
				$("#btnAudit").on('click', function() {
					var checkData = $('#zbtz-data-editor').getObj().getCheckData();
					var data = [];
					page.checkFlag = true;
					data.push({
						'billId': page.billId
					});
					page.checkBills(data);
				});
				$('#btn-continue').click(function() {
					page.statusLab = "1";
					page.pageAction = 'add';
					_close('continue');
				});
				$('#btn-close').click(function() {
					if(!page.closeCheck()) {
						ufma.confirm("有未保存的数据，是否确定离开页面?", function(rst) {
							if(rst) {
								var data = {
									cbBgPlanId: page.cbBgPlanId,
									cbBgPlanText: page.cbBgPlanText
								}
								_close('ok', data);
							}
						}, {
							'type': 'warning'
						});
						return false;
					} else {
						var data = {
							cbBgPlanId: page.cbBgPlanId,
							cbBgPlanText: page.cbBgPlanText
						}
						_close('ok', data);
					}
				});
				$('.btn-more-item').click(function() {
					page.adjGridTop($('#select-data'));
				});
				$('#btnUploadFile').on('click',
					function(e) {
						e.stopPropagation();

						var option = {
							"agencyCode": page.agencyCode,
							"billId": page.billId,
							"uploadURL": _bgPub_requestUrlArray_subJs[8] + "?agencyCode=" + page.agencyCode + "&setYear=" + page.pfData.svSetYear +
								"&billId=" + page.billId,
							"delURL": _bgPub_requestUrlArray_subJs[16] +
								"?agencyCode=" + page.agencyCode + "&setYear=" + page.pfData.svSetYear +
								"&billId=" + page.billId,
							"downloadURL": _bgPub_requestUrlArray_subJs[15] +
								"?agencyCode=" + page.agencyCode + "&setYear=" + page.pfData.svSetYear +
								"&billId=" + page.billId,
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
						if(page.pageAction == 'add') {
							_bgPub_ImpAttachment("pnl-tzzb", "指标单据[" +
								page.billCode + "]附件导入",
								modal_billAttachment, option, page.statusLab);
						} else {
							_bgPub_ImpAttachment("pnl-tzzb", "指标单据[" +
								page.billCode + "]附件导入",
								modal_billAttachment, option, page.statusLab);
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
				localStorage.removeItem("saveData"); //CWYXM-11907、CWYXM-11968 指标管理-指标调整,保存后数据没回显,得刷新才行--zsj
				page.agencyCode = window.ownerData.agencyCode;
				page.pageAction = window.ownerData.pageAction;
				page.cbBgPlanId = window.ownerData.cbBgPlanId;
				page.cbBgPlanText = window.ownerData.cbBgPlanText;
				page.statusLab = window.ownerData.statusLab;
        page.pageAction = window.ownerData.action;
        page.sendCloName = window.ownerData.sendCloName;
				if(page.pageAction == 'edit') {
					page.planData = window.ownerData.editPlanData;
				} else {
					page.planData = {};
				}
				page.checkFlag = false;
				page.saveTrue = false;
				this.initPage();
				this.onEventListener();

			}
		}
	}();
	window.page = page;

	page.init();
});