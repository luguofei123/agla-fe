$(function () {
	var cacheData = [];
	window._close = function (state) {
		if (window.closeOwner) {
			var data = {
				action: state,
				result: {}
			};
			window.closeOwner(data);
		}
	}
	var modal_billAttachment = [];
	var fileLeng = 0; //实际上传文件数
	var page = function () {
		return {
			addData: [],
			planData: '',
			planData1: '',
			billId: '',
			billCode: '',
			composePlanId: '',
			composePlanName: '',
      cacheData: [],
      // 点下一步获取新行
      getNewRow: function () {
        if ($.isNull(page.planData1)) {
					return false;
				}
				$('#btn-newRow-decompose').addClass('hide');
				var url = "/bg/Plan/budgetPlan/checkBudgetPlan" +
					"?agencyCode=" + page.agencyCode + "&setYear=" + page.setYear;
				var argu = {
					'agencyCode': page.agencyCode,
					'setYear': page.setYear,
					'items': [{
						"toCompose": '1',
						"bgPlanChrId": page.composePlanId,
						"bgPlanChrName": page.composePlanName
					}, {
						"compose": '0',
						"bgPlanChrId": page.planData1.chrId,
						"bgPlanChrName": page.planData1.chrName
					}]
				};
				var callbacks = function (result) {
					if (result.flag == "success") {
            $('#btn-newRow-decompose').removeClass('hide');
            $('#decompose-data').html('')
						$('#btn-newRow-decompose').trigger("click");
					}
				};
				//外交部财务云项目WJBCWY-1601【财务云8.20.14 IE11】指标分解界面分解指标无分解数据具体见截图--zsj
				ufma.ajaxDef(url, 'post', argu, callbacks);
      },
			getBudgetHead: function () { // 第一个页面表格
				var column = [ // 支持多表头
					{
						type: 'radio',
						field: '',
						name: '',
            width: 40,
            // rowspan: 2,
						headalign: 'center',
						align: 'center'
					}, {
						field: 'bgPlanName',
						name: '预算方案',
						// rowspan: 2,
						width: 150,
            headalign: 'center',
            className: "nowrap BGThirtyLen",
						"render": function (rowid, rowdata, data, meta) {
							if (!$.isNull(data)) {
								return '<code title="' + data + '">' + data + '</code>';
							} else {
								return '';
							}
						}
					}, {
						field: 'bgItemCode',
						name: '指标编码',
						width: 120,
						headalign: 'center',
						className: "nowrap BGasscodeClass",
						"render": function (rowid, rowdata, data, meta) {
							if (!$.isNull(data)) {
								return '<code title="' + data + '">' + data + '</code>';
							} else {
								return '';
							}
						}
					}, {
						// CWYXM-18408--指标年结涉及采购合同报销模块占用的指标结转完善
						field: 'bgTypeName',
						name: '指标类型',
						className: "nowrap BGTenLen",
						width: 200,
						headalign: 'center',
						"render": function (rowid, rowdata, data, meta) {
							if (!$.isNull(data)) {
								return '<code title="' + data + '">' + data + '</code>';
							} else {
								return '';
							}
						}
					}, {
						field: 'bgItemSummary',
						name: '摘要',
						className: "nowrap BGThirtyLen",
						width: 200,
						headalign: 'center',
						"render": function (rowid, rowdata, data, meta) {
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
						// rowspan: 2,
						className: "nowrap BGThirtyLen",
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
				if (page.planData.isSendDocNum == "是") {
					column.push({
						field: 'sendDocNum',
						name: page.sendCloName,
						// rowspan: 2,
						className: "nowrap BGThirtyLen",
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
        //CWYXM-17554 预算方案设置中，增加财政指标ID属性，可选择是否启用，启用时，选择预算方案新增指标时，需要录入指标id，指标id也需要参与指标的要素唯一性校验--zsj
        if (page.planData.isFinancialBudget == "1") {
					column.push({
						field: 'bgItemIdMx',
						name: '财政指标ID',
						// rowspan: 2,
						className: "nowrap BGThirtyLen",
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
				//CWYXM-11697 --：预算方案中要素选择里，增加是否采购属性，启用之后，编制指标时可选是和否，不能输入其他值，采购模块选择指标时，根据这个属性过滤--zsj
				if (!$.isNull(page.planData)) {
					for (var i = 0; i < page.planData.planVo_Items.length; i++) {
						var item = page.planData.planVo_Items[i];
						var cbItem = item.eleCode;
						if (item.eleName != '摘要' && cbItem != 'sendDocNum' && cbItem != 'bgItemIdMx') { //CWYXM-11693--nbsh---指标分 解、调整、调剂选择指标时，增加按摘要查询的条件--zsj
							if (cbItem == "ISUPBUDGET") { //CWYXM-12517 指标分解，新增指标分解新增页面一直处在加载中--zsj
								column.push({
									field: 'isUpBudget',
									name: '是否采购',
									// rowspan: 2,
									className: "nowrap",
									// width: 200,
                  headalign: 'center',
                  align: 'center',
									"render": function (rowid, rowdata, data, meta) {
										if (!$.isNull(data)) {
											return '<code title="' + data + '">' + data + '</code>';
										} else {
											return '';
										}
									}
								});
							} else {
								column.push({
									field: bg.shortLineToTF(item.eleFieldName) + 'Name',
									name: item.eleName,
									width: 240,
                  headalign: 'center',
                  className: "nowrap BGThirtyLen",
									"render": function (rowid, rowdata, data, meta) {
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
                width: 240,
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
					//field: 'bgItemCur',//CWYXM-10727 指标分解新增页面，金额应显示最初指标编制金额--zsj
					field: 'realBgItemCur', //CWYXM-10727 指标分解新增页面，经赵雪蕊确认后金额取值应为指标编制的最初金额，加上调整、调剂的调增，减去调整、调剂、分解的减少后的值--zsj
					name: '金额',
					width: 150,
					headalign: 'center',
          align: 'right',
          className: "nowrap BGmoneyClass",
					"render": function (rowid, rowdata, data, meta) {
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
          className: "nowrap BGmoneyClass",
					"render": function (rowid, rowdata, data, meta) {
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
          className: "nowrap BGTenLen",
          headalign: 'center',
          align: 'center',
					"render": function (rowid, rowdata, data, meta) {
						if (!$.isNull(data)) {
							return '<code title="' + data + '">' + data + '</code>';
						} else {
							return '';
						}
					}
				});
				column.push({
					field: 'createDate',
					name: '编制日期',
          width: 101,
          className: "nowrap BGdateClass",
          headalign: 'center',
          align: 'center',
					"render": function (rowid, rowdata, data, meta) {
						if (!$.isNull(data)) {
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
          className: "nowrap BGTenLen",
					headalign: 'center',
					"render": function (rowid, rowdata, data, meta) {
						if (!$.isNull(data)) {
							return '<code title="' + data + '">' + data + '</code>';
						} else {
							return '';
						}
					}
				});
				column.push({
					field: 'checkDate',
					name: '审核日期',
          width: 101,
          className: "nowrap BGdateClass",
          headalign: 'center',
          align: 'center',
					"render": function (rowid, rowdata, data, meta) {
						if (!$.isNull(data)) {
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
          className: "nowrap",
					render: function (rowid, rowdata, data, meta) {
						return '<button class="btn btn-log btn-watch-detail btn-permission" data-toggle="tooltip"  title="日志"><span class="icon-log"></span></button>';
					}
				});
				return [column];
			},
			setBudgetTable: function () { // 第一页显示所有指标表格
				ufma.showloading('数据加载中，请耐心等待...');
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
						ufma.isShow(reslist);
					},
				});
				if ($.isNull(page.planData)) {
					return false;
				}
				var url = "/bg/budgetItem/multiPost/getBudgetItems" +
					'?agencyCode=' + page.agencyCode + "&setYear=" + page.setYear + "&fromMenu=itemCompose";
				var argu = page.setSearchMap(page.planData);
				var data = [];
				var callback = function (result) {
					ufma.hideloading();
					for (var i = 0; i < result.data.billWithItemsVo.length; i++) {
						page.composePlanId = result.data.billWithItemsVo[0].billWithItems[0].bgPlanId;
						page.composePlanName = result.data.billWithItemsVo[0].billWithItems[0].bgPlanName;
						var item = result.data.billWithItemsVo[i];
						for (var j = 0; j < item.billWithItems.length; j++) {
							//var row = item.billWithItems[j];
							var row = $.extend(true, item.billWithItems[j], {
								checkUserName: item.checkUserName,
								checkDate: item.checkDate
							});
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
			//外交部财务云项目WJBCWY-1601【财务云8.20.14 IE11】指标分解界面分解指标无分解数据具体见截图--zsj
			getDmpCols: function (data) {
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
						width: 120,
            headalign: 'center',
            className: "nowrap BGasscodeClass",
						"render": function (rowid, rowdata, data, meta) {
							if (!$.isNull(data)) {
								return '<span title="' + data + '">' + data + '</span>';
							} else {
								return '';
							}
						}
					}, {
						// CWYXM-18408--指标年结涉及采购合同报销模块占用的指标结转完善
						field: 'bgTypeName',
						name: '指标类型',
						className: "nowrap BGTenLen",
						width: 200,
						headalign: 'center',
						"render": function (rowid, rowdata, data, meta) {
							if (!$.isNull(data)) {
								return '<span title="' + data + '">' + data + '</span>';
							} else {
								return '';
							}
						}
					}, {
						type: 'input',
						field: 'bgItemSummary',
						name: '摘要',
						className: "nowrap BGThirtyLen",
						width: 200,
						headalign: 'center',
						"render": function (rowid, rowdata, data, meta) {
							if (!$.isNull(data)) {
								return '<span title="' + data + '">' + data + '</span>';
							} else {
								return '';
							}
						}
					}
				];
				if (page.planData1.isComeDocNum == "是") {
					column.push({
						type: 'input',
						field: 'comeDocNum',
						name: '来文文号',
						className: "nowrap BGThirtyLen",
						width: 200,
						headalign: 'center',
						"render": function (rowid, rowdata, data, meta) {
							if (!$.isNull(data)) {
								return '<span title="' + data + '">' + data + '</span>';
							} else {
								return '';
							}
						}
					});
				}
				if (page.planData1.isSendDocNum == "是") {
					column.push({
						//ZJGA820-1380【指标管理】--[财政指标]在单位指标部分点击新增之后，“发文文号”和“是否采购”不会自动带下来，需要能够带下来，并且不能够修改--zsj
						type: 'input',
						field: 'sendDocNum',
						name: page.sendCloName,
						className: "nowrap BGThirtyLen",
						width: 200,
						headalign: 'center',
						"render": function (rowid, rowdata, data, meta) {
							if (!$.isNull(data)) {
								return '<span title="' + data + '">' + data + '</span>';
							} else {
								return '';
							}
						}
					});
        }
        if (page.planData1.isFinancialBudget == "1") {
					column.push({
						//ZJGA820-1380【指标管理】--[财政指标]在单位指标部分点击新增之后，“发文文号”和“是否采购”不会自动带下来，需要能够带下来，并且不能够修改--zsj
						type: 'input',
						field: 'bgItemIdMx',
						name: '财政指标ID',
						className: "nowrap BGThirtyLen",
						width: 200,
						headalign: 'center',
						"render": function (rowid, rowdata, data, meta) {
							if (!$.isNull(data)) {
								return '<span title="' + data + '">' + data + '</span>';
							} else {
								return '';
							}
						}
					});
				}
				//CWYXM-11697 --：预算方案中要素选择里，增加是否采购属性，启用之后，编制指标时可选是和否，不能输入其他值，采购模块选择指标时，根据这个属性过滤--zsj
				var isUpBudgetData = [{
					code: "1",
					pId: "*",
					isLeaf: 1,
					parentId: "",
					levelNum: 1,
					pCode: "",
					codeName: "是",
					name: "是",
					chrFullname: "是",
					eleCode: "",
					id: "1",
					isFinal: "",
					lastVer: "",
				}, {
					code: "0",
					pId: "*",
					isLeaf: 1,
					parentId: "",
					levelNum: 1,
					pCode: "",
					codeName: "否",
					name: "否",
					chrFullname: "否",
					eleCode: "",
					id: "0",
					isFinal: "",
					lastVer: "",
				}]
        if (data && data.eleValueList) {
          for (var j = 0; j < data.eleValueList.length; j++) {
            var item = data.eleValueList[j];
						var cbItem = item.eleCode;
						if (cbItem != "ISUPBUDGET"  && cbItem != 'sendDocNum' && cbItem != 'bgItemIdMx') {
							// var url = bg.getUrl('bgPlanItem');
							// var type = 'get';
							// var param = {};
							// param['agencyCode'] = page.agencyCode;
							// param['setYear'] = parseInt(page.pfData.svSetYear);
							// param['eleCode'] = item.eleCode;
							// param['eleLevel'] = item.eleLevel;
							// param['isNew'] = '1';
							var idField = bg.shortLineToTF(item.eleFieldName);
							var textField = bg.shortLineToTF(item.eleFieldName + '_NAME');
							// var argu = param;
							// var callback = function (result) {
							// 	for (var j = 0; j < result.data.length; j++) {
							// 		var item1 = result.data[j];
							// 		item1[idField] = item1.code;
							// 		item1[textField] = item1.codeName;
							// 	}
							// 	column.push({
							// 		type: 'treecombox',
							// 		field: idField,
							// 		idField: idField,
							// 		textField: textField,
							// 		name: item.eleName,
							// 		width: 240,
              //     headalign: 'center',
              //     className: "nowrap BGThirtyLen",
							// 		data: result.data,
							// 		"render": function (rowid, rowdata, data, meta) {
							// 			//BUGCWYXM-4727--指标分解树组件清空问题--zsj
							// 			if (!$.isNull(data)) {
							// 				return '<span title="' + rowdata[textField] + '">' + rowdata[textField] + '</span>';
							// 			} else {
							// 				return '';
							// 			}
							// 		},
							// 		beforeExpand: function (sender, data) { //ZJGA820-1307【指标管理】--1.指标分解时，带入的指标要素信息不允许修改--zsj
							// 			//-1是不限制 0是明细级
							// 			if (item.eleLevel == '0') {
							// 				if ($.inArray(item.eleCode, page.parentAssiArr) > -1) {
							// 					$('#decompose-datatreecombox' + idField).addClass('uf-combox-disabled');
							// 					$('#decompose-datatreecombox' + idField + '_input').attr('readonly', true);
							// 					$('#decompose-datatreecombox' + idField + '_popup').addClass('hide');
							// 				} else {
							// 					$(sender.sender).removeClass('uf-combox-disabled');
							// 					$('#decompose-datatreecombox' + idField + '_input').removeAttr('readonly');
							// 					$('#decompose-datatreecombox' + idField + '_popup').removeClass('hide');
							// 				}

							// 			} else {
							// 				$(sender.sender).removeClass('uf-combox-disabled');
							// 				$('#decompose-datatreecombox' + idField + '_input').removeAttr('readonly');
							// 				$('#decompose-datatreecombox' + idField + '_popup').removeClass('hide');
							// 			}
							// 		}
							// 	});
							// }
							// //外交部财务云项目WJBCWY-1601【财务云8.20.14 IE11】指标分解界面分解指标无分解数据具体见截图--zsj
              // ufma.ajaxDef(url, type, argu, callback);

									// var item1 = data.eleValueList[j];
									// item1[idField] = item1.code;
                  // item1[textField] = item1.codeName;
                  column.push({
                    type: 'treecombox',
                    field: idField,
                    idField: 'code',
                    textField: 'codeName',
                    name: item.eleName,
                    width: 200,
                    headalign: 'center',
                    className: 'nowrap BGThirtyLen ' + idField,
                    data: item.data,
                    "render": function (rowid, rowdata, data, colField) {
                      var colFieldName = colField + 'Name'
                      //BUGCWYXM-4727--指标分解树组件清空问题--zsj
                      if (!$.isNull(data)) {
                        return '<span title="' + rowdata[colFieldName] + '">' + rowdata[colFieldName] + '</span>';
                      } else {
                        return '';
                      }
                    },
                    beforeExpand: function (sender, data) { //ZJGA820-1307【指标管理】--1.指标分解时，带入的指标要素信息不允许修改--zsj
                      //-1是不限制 0是明细级
                      if (item.eleLevel == '0') {
                        if ($.inArray(item.eleCode, page.parentAssiArr) > -1) {
                          $('#decompose-datatreecombox' + idField).addClass('uf-combox-disabled');
                          $('#decompose-datatreecombox' + idField + '_input').attr('readonly', true);
                          $('#decompose-datatreecombox' + idField + '_popup').addClass('hide');
                        } else {
                          $(sender.sender).removeClass('uf-combox-disabled');
                          $('#decompose-datatreecombox' + idField + '_input').removeAttr('readonly');
                          $('#decompose-datatreecombox' + idField + '_popup').removeClass('hide');
                        }
  
                      } else {
                        $(sender.sender).removeClass('uf-combox-disabled');
                        $('#decompose-datatreecombox' + idField + '_input').removeAttr('readonly');
                        $('#decompose-datatreecombox' + idField + '_popup').removeClass('hide');
                      }
                    }
                  });
						} else if (item.eleName != '摘要' && cbItem != 'sendDocNum' && cbItem != 'bgItemIdMx'){
							if ($.inArray(item.eleCode, page.parentAssiArr) > -1) {
								column.push({
									field: 'isUpBudget',
									name: "是否采购",
									// width: 200,
                  headalign: 'center',
                  className: "nowrap",
                  align: 'center',
									"render": function (rowid, rowdata, data, meta) {
										if (!$.isNull(data)) {
											return data;
										} else {
											return '';
										}
									}
								});
							} else {
								column.push({
									type: 'treecombox',
									field: 'isUpBudget',
									idField: "code",
									textField: 'codeName',
									name: "是否采购",
                  // width: 100,
                  className: "nowrap",
                  headalign: 'center',
                  align: 'center',
									data: isUpBudgetData,
									"render": function (rowid, rowdata, data, meta) {
										return rowdata.isUpBudget;
									}
								});
							}
						}
           }
        }
        if (page.planData1){
          //CWYXM-18080 编制指标时需要增加文本说明项，只录入文本，用于描述指标信息--zsj--查询条件区域
          for (var k = 0; k < page.planData1.planVo_Txts.length; k++) {
            var fieldNew = bg.shortLineToTF(page.planData1.planVo_Txts[k].eleFieldName);
            column.push({
              type: 'input',
              field: fieldNew,
              name:  page.planData1.planVo_Txts[k].eleName,
              className: "nowrap BGThirtyLen",
              width: 200,
              headalign: 'center',
              "render": function (rowid, rowdata, data, meta) {
                if (!$.isNull(data)) {
                  return '<span title="' + data + '">' + data + '</span>';
                } else {
                  return '';
                }
              }
            });
          }
				}
				column.push({
					type: 'money',
					field: 'bgItemCur', //CWYXM-10727 指标分解新增页面，金额应显示最初指标编制金额--zsj
					name: '金额',
					width: 150,
					align: 'right',
          headalign: 'center',
          className: "nowrap",
					"render": function (rowid, rowdata, data, meta) {
						if (!$.isNull(data)) {
							return '<span title="' + rowdata.bgItemBalanceCur + '">' + $.formatMoney(rowdata.bgItemBalanceCur, 2) + '</span>';
						} else {
							return '';
						}
					},
					onKeyup: function (e) {
						$('#billHJJE').html($.formatMoney(page.getRowsSum()));
						$('#decomposableAmt').html($.formatMoney($('#zbtz-data-editor').getObj().getData()[0].bgItemBalanceCur - page.getRowsSum()));
					}
				});
				column.push({
					type: 'toolbar',
					field: 'option',
					name: '操作',
          width: 150,
          className: "nowrap",
					headalign: 'center',
					render: function (rowid, rowdata, data, meta) {
						if (window.ownerData.status == '3') { //如果为已审核单子，不可编辑CWYXM-4872
							return '<button class="btn btn-del btn-delete icon-trash disabled" data-toggle="tooltip" title="删除"></button>';
						} else {
							return '<button class="btn btn-del btn-delete icon-trash" data-toggle="tooltip" title="删除"></button>';
						}
					}
				});
				return [column];
			},
			// setChildTable: function (chrCode) {
      // 	cacheData = chrCode;
      setChildTable: function (data) {
				var columns = page.getDmpCols(data);
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
								//bug78362--zsj
								var checkData = $('#decompose-data').getObj().getCheckData();
								var tableData = $('#decompose-data').getObj().getData();
								if (checkData.length == 0) {
									ufma.showTip('请先选择您要删除的指标！',function () {}, 'warning');
									return false;
								}
								if (tableData.length == 1) {
									ufma.showTip('至少需要保留一条分解指标', function () {}, 'warning');
									return false;
								}
								if (checkData.length == tableData.length) {
									ufma.showTip('至少需要保留一条分解指标', function () {}, 'warning');
									return false;
								}
								//bugCWYXM-4308--新增指标分解，选择预算方案再删除时，行删除控制应与列表删除控制逻辑一致“至少需要保留一条分解指标”--zsj
								ufma.confirm('您确定要删除选中的行数据吗？', function (action) {
									if (action) {
										for (var i = 0; i < checkData.length; i++) {
											var trdId = 'decompose-data_row_' + checkData[i].bgItemCode
											$('#decompose-data').getObj().del(trdId);
										}
										//bugCWYXM-4347-新增指标分解，分解指标页面，新增行再删除，合计金额未重新计算--zsj
										$('#billHJJE').html($.formatMoney(page.getRowsSum()));
										$('#decomposableAmt').html($.formatMoney($('#zbtz-data-editor').getObj().getData()[0].bgItemBalanceCur - page.getRowsSum()));
									} else {
										//点击取消的回调函数
									}
								}, {
									type: 'warning'
								});
							}
						}
					],
					initComplete: function (options, data) {
						//decomposeInitCmp();
						ufma.isShow(reslist);
					}
				});
				ufma.isShow(reslist);
				$('#decompose-datamoneybgItemCur').attr("maxlength", "20"); //控制金额列输入不可超出20位
			},
			getAdjustHead: function () { // 2页面上面待分解指标表
				var columns = [];
				var column1 = [ // 支持多表头
					{
						field: 'bgItemCode',
						name: '指标编码',
						// rowspan: 2,
						width: 100,
            headalign: 'center',
            className: "nowrap BGasscodeClass",
						"render": function (rowid, rowdata, data, meta) {
							if (!$.isNull(data)) {
								return '<code title="' + data + '">' + data + '</code>';
							} else {
								return '';
							}
						}
					}, {
						field: 'bgPlanName',
						name: '预算方案',
						// rowspan: 2,
						width: 150,
            headalign: 'center',
            className: "nowrap BGThirtyLen",
						"render": function (rowid, rowdata, data, meta) {
							if (!$.isNull(data)) {
								return '<code title="' + data + '">' + data + '</code>';
							} else {
								return '';
							}
						}
					}, {
						// CWYXM-18408--指标年结涉及采购合同报销模块占用的指标结转完善
						field: 'bgTypeName',
						name: '指标类型',
						// rowspan: 2,
						className: "nowrap BGTenLen",
						width: 200,
						headalign: 'center',
						"render": function (rowid, rowdata, data, meta) {
							if (!$.isNull(data)) {
								return '<code title="' + data + '">' + data + '</code>';
							} else {
								return '';
							}
						}
					}, {
						field: 'bgItemSummary',
						name: '摘要',
						// rowspan: 2,
						className: "nowrap BGThirtyLen",
						width: 200,
						headalign: 'center',
						"render": function (rowid, rowdata, data, meta) {
							if (!$.isNull(data)) {
								return '<code title="' + data + '">' + data + '</code>';
							} else {
								return '';
							}
						}
					}
				];
				if (page.planData.isComeDocNum == "是") {
					column1.push({
						field: 'comeDocNum',
						name: '来文文号',
						// rowspan: 2,
						className: "nowrap BGThirtyLen",
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
				if (page.planData.isSendDocNum == "是") {
					column1.push({
						field: 'sendDocNum',
						name: page.sendCloName,
						// rowspan: 2,
						className: "nowrap BGThirtyLen",
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
        //CWYXM-17554 预算方案设置中，增加财政指标ID属性，可选择是否启用，启用时，选择预算方案新增指标时，需要录入指标id，指标id也需要参与指标的要素唯一性校验--zsj
        if (page.planData.isFinancialBudget == "1") {
					column1.push({
						field: 'bgItemIdMx',
						name: '财政指标ID',
						// rowspan: 2,
						className: "nowrap BGThirtyLen",
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
				//CWYXM-11697 --：预算方案中要素选择里，增加是否采购属性，启用之后，编制指标时可选是和否，不能输入其他值，采购模块选择指标时，根据这个属性过滤--zsj
				if (!$.isNull(page.planData)) {
					for (var i = 0; i < page.planData.planVo_Items.length; i++) {
						var item = page.planData.planVo_Items[i];
						var cbItem = item.eleCode;
						if (item.eleName != '摘要' && cbItem != 'sendDocNum' && cbItem != 'bgItemIdMx') {
							if (cbItem != "ISUPBUDGET") {
								column1.push({
									field: bg.shortLineToTF(item.eleFieldName) + 'Name',
									name: item.eleName,
									// rowspan: 2,
                  width: 200,
                  className: "nowrap BGThirtyLen",
									headalign: 'center',
									"render": function (rowid, rowdata, data, meta) {
										if (!$.isNull(data)) {
											return '<code title="' + data + '">' + data + '</code>';
										} else {
											return '';
										}
									}
								});
							} else {
								column1.push({
									field: 'isUpBudget',
									name: '是否采购',
									// rowspan: 2,
									className: "nowrap",
									// width: 200,
                  headalign: 'center',
                  align: 'center',
									"render": function (rowid, rowdata, data, meta) {
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
            column1.push({
              field: fieldNew,
              name: page.planData.planVo_Txts[k].eleName,
              className: "nowrap BGThirtyLen",
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
				}
				column1.push({
					field: 'bgItemCur', //CWYXM-10727 指标分解新增页面，金额应显示最初指标编制金额--zsj
					name: '金额',
					width: 150,
					headalign: 'center',
          align: 'right',
          className: "nowrap BGmoneyClass",
					"render": function (rowid, rowdata, data, meta) {
						if (!$.isNull(data)) {
							return '<code title="' + data + '">' + $.formatMoney(data, 2) + '</code>';
						} else {
							return '';
						}
					}
				});
				column1.push({
					field: 'bgItemBalanceCur',
					name: '余额',
					width: 150,
					headalign: 'center',
          align: 'right',
          className: "nowrap BGmoneyClass",
					"render": function (rowid, rowdata, data, meta) {
						if (!$.isNull(data)) {
							return '<code title="' + data + '">' + $.formatMoney(data, 2) + '</code>';
						} else {
							return '';
						}
					}
				});
				column1
					.push({
						type: 'toolbar',
						field: 'option',
						name: '操作',
						width: 60,
            // rowspan: 2,
            className: "nowrap",
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
						$('#zbtz-data-editor').getObj().setBodyHeight(85);
						ufma.isShow(reslist);
					}
				});
				ufma.isShow(reslist);
			},

			adjGridTop: function ($table) {
				$.timeOutRun(null, null, function () {
					var gridTop = $table.offset().top;
					var gridHeight = $('.ufma-layout-down').offset().top -
						gridTop - 15 + 50;
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
				searchMap['setYear'] = parseInt(planData.setYear);
				searchMap['chrId'] = planData.chrId;
				searchMap['bgItemSummary'] = $('#cbbgItemSummary').val();
				//bugCWYXM-4432--指标分解时金额没有的客户想要默认不查询，即默认选中--zsj
				if ($('#notShowZero').is(':checked')) {
					var notShowZero = 1;
					searchMap['notShowZero'] = notShowZero;
				} else {
					var notShowZero = 0;
					searchMap['notShowZero'] = notShowZero;
				}
				if (!$.isNull(planData)) {
					searchMap['chrId'] = planData.chrId;
					for (var i = 0; i < planData.planVo_Items.length; i++) {
						var item = planData.planVo_Items[i];
            var cbItem = item.eleCode;
            //CWYXM-17554 预算方案设置中，增加财政指标ID属性，可选择是否启用，启用时，选择预算方案新增指标时，需要录入指标id，指标id也需要参与指标的要素唯一性校验--zsj
            if (item.eleName != '摘要' && cbItem != 'sendDocNum' && cbItem != 'bgItemIdMx') {
							var field = item.eleFieldName;
							if (cbItem != 'ISUPBUDGET') {
								var combox = $('#cb' + cbItem).getObj();
								searchMap[bg.shortLineToTF(field)] = combox.getValue();
							} else {
								var combox = $('#isUpBudget').getObj();
								searchMap["isUpBudget"] = combox.getValue();
							}
						} else {
              if (cbItem == 'sendDocNum') {
                  searchMap['sendDocNum'] = $('#cbsendDocNum').val();
              } else if (cbItem == 'bgItemIdMx') {
                  searchMap['bgItemIdMx'] = $('#cbbgItemIdMx').val();
              }
            }
          };
          //CWYXM-18080 编制指标时需要增加文本说明项，只录入文本，用于描述指标信息--zsj--查询条件区域
          for (var k = 0; k < planData.planVo_Txts.length; k++) {
            var textCode = bg.shortLineToTF(planData.planVo_Txts[k].eleFieldName);
            searchMap[textCode] = $('#cb'+ planData.planVo_Txts[k].eleFieldName).val();
          }
				}
				return searchMap;
			},
			getRowsSum: function () {
				/*var rowsSum = $('#decompose-data').getObj().getData();
				var sum = 0.00;
				for(var i = 0; i < rowsSum.length; i++) {
					sum = sum + parseFloat(rowsSum[i].bgItemCur);
				}
				return sum;*/
				var bgItemCurArr = [];
				$('#decompose-data #decompose-dataBody').find('td[name="bgItemCur"]').each(function () {
					var cellBgItemCur = 0;
					cellBgItemCur = parseFloat($(this).text().replace(/,/g, ''));
					bgItemCurArr.push(cellBgItemCur)
				})
				var sum = 0.00;
				for (var i = 0; i < bgItemCurArr.length; i++) {
					sum = sum + parseFloat(bgItemCurArr[i]);
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
						'setYear': page.setYear
					},
					callback: function (element, data) {
						element.ufCombox({ // 初始化
							data: data, // 列表数据
							readonly: true, // 可选
							placeholder: "请选择预算方案",
							onChange: function (sender, data) {
								page.planData = data;
								//ZJGA820-1307【指标管理】--1.指标分解时，带入的指标要素信息不允许修改--zsj
                page.parentAssiArr = [];
                var codeArr = []
								for (var i = 0; i < page.planData.planVo_Items.length; i++) {
									var item = page.planData.planVo_Items[i];
                  var cbItem = item.eleCode;
                  if (cbItem != 'sendDocNum' && cbItem != 'bgItemIdMx'){
                    codeArr.push(data.planVo_Items[i]);
                    page.parentAssiArr.push(cbItem)
                  }
                };
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
								var summeryArgu = {
                  eleName: "摘要",
                  eleCode:'bgItemSummary',
									nameCode: "bgItemSummary"
                }
                codeArr.splice(0, 0, summeryArgu);
                page.planData.planVo_Items = codeArr
								bg.initBgPlanItemPnl(
									$('#searchPlanPnl'), page.planData);
								page.adjGridTop($('#select-data'));
								page.setBudgetTable();
								//bugCWYXM-3951--新增需求记忆预算方案--取出已经记忆的数据--zsj
								page.configKey = '';
								page.configValue = '';
								page.configKey = 'cbBgPlan';
								var cbBgPlanId = $('#cbBgPlan').getObj().getValue();
								var cbBgPlanText = $('#cbBgPlan').getObj().getText();
								page.configValue = cbBgPlanId + ',' + cbBgPlanText;
							},
							onComplete: function () {
								$(element).getObj().val($.isNull(window.ownerData.planId) ? 'null' : window.ownerData.planId); //CWYXM-11974 达梦库和oracle库有此问题：指标管理模块，指标分解，点击新增时没有选择预算方案前，页面样式错误--zsj
							}
						});
					}
				});
			},
			initSearchPnl1: function () {
				uf.cacheDataRun({
					element: $('#cbBgPlan1'),
					cacheId: page.agencyCode + '_plan_items',
					url: bg.getUrl('bgPlan') + "?ajax=1" + "&isEnabled=1",
					param: {
						'agencyCode': page.agencyCode,
						'setYear': page.setYear
					},
					callback: function (element, data) {
						element.ufCombox({ // 初始化
							//data: data, // 列表数据
							data: page.filterPlanData, //bugCWYXM-3951--新增需求过滤不能分解的预算方案--zsj
							readonly: true, // 可选
							placeholder: "请选择预算方案",
							onChange: function (sender, data) {
                page.planData1 = data;
                var codeArr = []
								for (var i = 0; i < page.planData1.planVo_Items.length; i++) {
									var item = page.planData1.planVo_Items[i];
                  var cbItem = item.eleCode;
                  if (cbItem != 'sendDocNum' && cbItem != 'bgItemIdMx'){
                    codeArr.push(data.planVo_Items[i]);
                  }
                };
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
                page.planData1.planVo_Items = codeArr;
                page.getNewRow();
								// bg.initBgPlanItemPnl(
								// 	$('#searchPlanPnl'), page.planData1);
                page.adjGridTop($('#decompose-data'));
                
								// page.setChildTable(data.chrCode);
								//bugCWYXM-3951--新增需求记忆预算方案--取出已经记忆的数据--zsj
								page.configKey = '';
								page.configValue = '';
								page.configKey = 'cbBgPlan1';
								var cbBgPlan1Id = $('#cbBgPlan1').getObj().getValue();
								var cbBgPlan1Text = $('#cbBgPlan1').getObj().getText();
								page.configValue = cbBgPlan1Id + ',' + cbBgPlan1Text;
							},
							onComplete: function (sender, elData) {
								bg.selectBgPlan($(element), elData);
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
				//$('#createDate1').ufDatepicker('update', page.pfData.svTransDate.substr(0, 8) + "01");
				var mydate = new Date(page.pfData.svTransDate);
				var Year = mydate.getFullYear();
				$('#createDate1').getObj().setValue(Year + '-01-01');
        $('#createDate2').ufDatepicker('update', page.pfData.svTransDate); //dai  .substr(0, 10);
        //ZJGA820-1670---指标编制点击新增单据日期默认是2020年1月1日，需要改为登陆日期。经雪蕊、侯总确定改为当前登录日期--zsj
        $('#createDate3').ufDatepicker('update', page.pfData.svTransDate);
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
						'setYear': page.setYear
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
				cacheData = detailItems;
				var selectedItems = $('#zbtz-data-editor').getObj().getData();
				var sendCount = 0; //根据系统选项判断发文文号是否必填
				selectedItems[0].adjustDir = 2;
				selectedItems[0].isNew = '是';
				var billHJJE = 0.00;
				//CWYXM-12743--与雪蕊姐沟通后确认：是否采购项为必填 --zsj
        var isUpBudgetCount = 0;
        var bgItemIdMxCount = 0; //CWYXM-17554 预算方案设置中，增加财政指标ID属性，可选择是否启用，启用时，选择预算方案新增指标时，需要录入指标id，指标id也需要参与指标的要素唯一性校验--zsj 
        var compireArr = [];
				for (var k = 0; k < page.planData1.planVo_Items.length; k++) {
					compireArr.push(page.planData1.planVo_Items[k].eleCode);
				}
				var hasIsUpBudget = false;
				if ($.inArray("ISUPBUDGET", compireArr) > -1) {
					hasIsUpBudget = true;
				}
				for (var i = 0; i < detailItems.length; i++) {
					//billHJJE = billHJJE + ufma.parseFloat(detailItems[i].bgItemBalanceCur);
					//	billHJJE = billHJJE + ufma.parseFloat(detailItems[i].bgItemCur);
					detailItems[i].isNew = '是';
					detailItems[i].adjustDir = 1;
					detailItems[i].bgItemId = page.addData[i].bgItemId;
					detailItems[i].setYear = parseInt(page.addData[i].setYear);
					detailItems[i].agencyCode = page.addData[i].agencyCode;
					detailItems[i].bgPlanId = page.planData1.chrId;
					detailItems[i].bgPlanCode = page.planData1.chrCode;
					detailItems[i].createDate = page.addData[i].createDate;
					detailItems[i].createUser = page.addData[i].createUser;
					detailItems[i].createUserName = page.addData[i].createUserName;
					detailItems[i].latestOpDate = page.addData[i].latestOpDate;
					detailItems[i].bgCtrlRatio = page.addData[i].bgCtrlRatio;
					detailItems[i].bgWarnRatio = page.addData[i].bgWarnRatio;
					detailItems[i].status = page.addData[i].status;
					detailItems[i].dataSource = page.addData[i].dataSource;
					detailItems[i].createSource = page.addData[i].createSource;
					detailItems[i].bgReserve = 1;
					detailItems[i].bgItemCanFpCur = page.addData[i].bgItemCanFpCur;
					detailItems[i].bgItemFpedCur = page.addData[i].bgItemFpedCur;
					detailItems[i].bgUseCur = page.addData[i].bgUseCur;
					detailItems[i].bgItemParentid = selectedItems[0].bgItemId;
					detailItems[i].bgItemParentcode = selectedItems[0].bgItemCode;
					//	detailItems[i].bgItemCur = detailItems[i].bgItemBalanceCur; //防止父指标的原始金额影响
					detailItems[i].bgItemCur = detailItems[i].bgItemCur;
					//CWYXM-11697 --：预算方案中要素选择里，增加是否采购属性，启用之后，编制指标时可选是和否，不能输入其他值，采购模块选择指标时，根据这个属性过滤--zsj
					if ($.isNull(detailItems[i].isUpBudget) && hasIsUpBudget == true) {
						isUpBudgetCount++;
					} else {
						if (detailItems[i].isUpBudget == '是') {
							detailItems[i].isUpBudget = '1';
						} else if (detailItems[i].isUpBudget == '否') {
							detailItems[i].isUpBudget = '0';
						}
					}
					//根据系统选项判断发文文号是否必填
					if ($.isNull(detailItems[i].sendDocNum)) {
						sendCount++;
          }
          //CWYXM-17554 预算方案设置中，增加财政指标ID属性，可选择是否启用，启用时，选择预算方案新增指标时，需要录入指标id，指标id也需要参与指标的要素唯一性校验--zsj
          if ($.isNull(detailItems[i].bgItemIdMx)) {
              bgItemIdMxCount++;
          }
				}
				billHJJE = parseFloat($('#billHJJE').html().replace(/,/g, ''));
				selectedItems[0].bgCutCur = billHJJE;
				selectedItems[0].checkCutCur = billHJJE;
				//CWYXM-11697 --：预算方案中要素选择里，增加是否采购属性，启用之后，编制指标时可选是和否，不能输入其他值，采购模块选择指标时，根据这个属性过滤--zsj
				if (selectedItems[0].isUpBudget == '是') {
					selectedItems[0].isUpBudget = '1';
				} else if (selectedItems[0].isUpBudget == '否') {
					selectedItems[0].isUpBudget = '0';
				}
				var items = [];
				items.push(selectedItems[0]);
				for (var i = 0; i < detailItems.length; i++) {
					items.push(detailItems[i]);
				}
				//if(ufma.parseFloat(selectedItems[0].realBgItemCur) >= billHJJE) {
				//CWYXM-10599 --指标分解，录入分解金额等于余额（余额>金额），保存校验提示超了--zsj
				if (ufma.parseFloat(selectedItems[0].bgItemBalanceCur) >= billHJJE) {
					//bug77471--zsj
					if ($("#billFJ").val() < fileLeng) {
						ufma.showTip('输入附件数不能小于已上传附件数！', function () {}, 'warning');
						return false;
					}
					//根据系统选项判断发文文号是否必填
					if (page.planData1.isSendDocNum == "是" && sendCount > 0 && page.needSendDocNum == true) {
						ufma.showTip('请输入' + page.sendCloName, function () {}, 'warning');
						return false;
          }
          if (page.planData1.isFinancialBudget == "1" && bgItemIdMxCount > 0 ) {
            ufma.showTip('请输入财政指标ID', function () {}, 'warning');
            return false;
          }
					//CWYXM-12743--与雪蕊姐沟通后确认：是否采购项为必填 --zsj
					if (isUpBudgetCount > 0) {
						ufma.showTip('请选择是否采购！', function () {}, 'warning');
						return false;
					}
					var data = {
						'agencyCode': page.agencyCode,
						'billId': page.billId,
						'billCur': billHJJE,
						'billCode': page.billCode,
						'setYear': page.setYear,
						'createDate': page.pfData.svSysDate,
						'billDate': page.pfData.svTransDate,
						'createUser': page.pfData.svUserCode,
						'createUserName': page.pfData.svUserName,
						'isNew': '是',
						'status': 1, //新增保存状态就为1
						'latestOpDate': page.pfData.svSysDate,
						'billType': 2,
						'items': items,
						'attachNum': $("#billFJ").val() //bug77471--zsj
					};
					ufma.showloading('数据保存中，请耐心等待...');
					var url = _bgPub_requestUrlArray_subJs[4] +
						"?billType=2&agencyCode=" + page.agencyCode + '&setYear=' + page.setYear;
					var callback = function (result) {
						ufma.hideloading();
						if (result.flag == "success") {
							cacheData = detailItems;
							ufma.showTip("保存成功", null, "success");
							page.timeline.next();
							page.ctrlToolBar();
							//bugCWYXM-3951--新增需求记忆预算方案--取出已经记忆的数据--zsj
							page.updateSessionPlan();
						} else {
							ufma.showTip("保存失败!" + result.msg, null, "error");
						}

					}
					ufma.post(url, data, callback);
				} else {
					ufma.showTip("分解指标金额之和不可大于待分解指标余额,请修改!", function () {}, "warning");
				}
			},

			del: function (data) {
				var data = {
					'items': data
				};
				var url = _bgPub_requestUrlArray_subJs[5] + "?agencyCode=" +
					page.agencyCode + "billType=2";
				var callback = function (result) {}
				ufma.post(url, data, callback);
			},
			closeCheck: function () {
				var result = true;
				if ($('#decompose-data').html() != '') {
					var tblData = $('#decompose-data').getObj().getData();
					return result = $.equalsArray(cacheData, tblData);
				} else {
					return result;
				}
			},
			//bugCWYXM-3951--新增需求记忆预算方案--取出已经记忆的数据--zsj
			updateSessionPlan: function () {
				var argu = {
					acctCode: "*",
					agencyCode: page.agencyCode,
					configKey: page.configKey,
					configValue: page.configValue,
					menuId: "29051561-5a6a-4872-986e-6c12e5dcc184"
				}
				ufma.post('/pub/user/menu/config/update', argu, function (reslut) {});
			},
			//bugCWYXM-3951--新增需求过滤不能分解的预算方案--zsj
			selectFilterData: function () {
				var argu = {
					agencyCode: page.agencyCode,
					bgPlanChrId: $('#cbBgPlan').getObj().getValue(),
					setYear: page.setYear
				}
				//外交部财务云项目WJBCWY-1601【财务云8.20.14 IE11】指标分解界面分解指标无分解数据具体见截图--zsj
				ufma.ajaxDef('/bg/budgetItem/multiPost/getComposeblePlans', 'post', argu, function (result) {
					page.filterPlanData = result.data;
					page.initSearchPnl1();
				})
			},
			onEventListener: function () {
				$('#btn-next').click(function () {
					var data = [];
					if (page.timeline.stepIndex() == 1) {
						data = $('#select-data').getObj().getCheckData();
						if (data.length == 0) {
							ufma.showTip('请选择需要分解的指标！', function () {}, 'error');
							return false;
						}
						//if (data[0].bgItemCur <= 0) {
						//CWYXM-10618--指标管理模块中的指标分解，点击下一步时，余额判断应该用bgItemBalanceCur,因为 bgItemCur为指标编制的金额，通过调整或调剂等操作后bgItemCur不变，所以真正用的是bgItemBalanceCur--zsj
						if (data[0].bgItemBalanceCur <= 0) {
							ufma.showTip('该指标可用余额为0,请重新选择一条指标！', function () {}, 'error');
							return false;
						}
					}
					page.timeline.next();
					page.ctrlToolBar();
					page.setBillCode();
					if (page.timeline.stepIndex() == 2) {
						page.setAdjustTable(data); // 表格显示后再调用，否则看不到表格
						page.updateSessionPlan(); //bugCWYXM-3951--新增需求记忆预算方案--取出已经记忆的数据--zsj
						//page.initSearchPnl1();
						page.selectFilterData();
						//page.adjGridTop($('#zbtz-data-editor'));
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
					_close('continue');
				});
				$('#btn-close').click(function () {
					if (!page.closeCheck()) {
						ufma.confirm("有未保存的数据，是否确定离开页面?", function (rst) {
							if (rst) {
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
				$('.btn-more-item').click(function () {
					page.adjGridTop($('#select-data'));
				});
				$('#btnQry').click(function () {
					page.setBudgetTable();
				});
				$('#zbtz-data-editor').on('keyup', 'input[name="bgItemFpedCur"]', function (e) {
					e.stopPropagation();
					e.preventDefault();
					var $row = $(this).closest('tr');
					var blCur = $row.find(
							'td[name="bgItemCur"] .cell-label')
						.text();
					blCur = blCur.replaceAll(',', '');
					var val = $(this).val();
					if (val == '')
						val == 0.00;
					var hj = parseFloat(blCur) - val;
					$row.find('td[name="bgItemCurHJ"] .cell-label')
						.html($.formatMoney(hj));
					if (hj < 0) {
						ufma.showTip('可分配金额不足！', function () {}, 'warning');
						$('#btn-save').attr('disabled', 'disabled');
					} else {
						$('#btn-save').removeAttr('disabled', 'disabled');
					}
				});
				//解决金额输入不能为负数
				$('#decompose-data').on('keyup', 'input[name="bgItemCur"]', function (e) {
					e.stopPropagation();
					e.preventDefault();
					var val = $(this).val();
					if (val < 0)
						$(this).val('');
				});
				/**
				 * 上传附件
				 */
				$('#btnUploadFile').on('click', function (e) {
					e.stopPropagation();
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
							/*$("#billFJ").val(fileList.length + "");
							modal_billAttachment = cloneObj(fileList);*/
							//bug77471--zsj
							var attachNum = 0;
							fileLeng = fileList.length;
							attachNum = fileList.length < $("#billFJ").val() ? $("#billFJ").val() : fileList.length;
							$("#billFJ").val(attachNum + "");
							modal_billAttachment = cloneObj(fileList);
						}
					};
					_bgPub_ImpAttachment("pnl-tzzb", "指标单据[" +
						page.billCode + "]附件导入",
						modal_billAttachment, option);

				});
				//金额失去鼠标焦点
				$(document).on("blur", "#decompose-data tbody td[name='bgItemCur']", function () {
					$('#billHJJE').html($.formatMoney(page.getRowsSum()));
					$('#decomposableAmt').html($.formatMoney($('#zbtz-data-editor').getObj().getData()[0].bgItemBalanceCur - page.getRowsSum()));
				})
				//指标分解 金额列要全选中,方便用户编辑 guohx 20191209
				$("#decompose-data").on("focus", "input[name='bgItemBalanceCur']", function () {
					$(this).select();
				})
				$("#decompose-data").on("focus", "input[name='sendDocNum']", function () {
					if (page.planData.isSendDocNum == "是") {
						$('#decompose-datainputsendDocNum').attr('readOnly', true);
						$(this).attr('disabled', true);
					} else {
						$('#decompose-datainputsendDocNum').removeAttr('readOnly');
						$(this).removeAttr('disabled');
					}
        })
        $("#decompose-data").on("focus", "input[name='bgItemIdMx']", function () {
					if (page.planData.isFinancialBudget == "1") {
						$('#decompose-datainputbgItemIdMx').attr('readOnly', true);
						$(this).attr('disabled', true);
					} else {
						$('#decompose-datainputbgItemIdMx').removeAttr('readOnly');
						$(this).removeAttr('disabled');
					}
				})
				/**
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
						//外交部财务云项目WJBCWY-1601【财务云8.20.14 IE11】指标分解界面分解指标无分解数据具体见截图--zsj
						ufma.ajaxDef(
							_bgPub_requestUrlArray_subJs[3] + "?agencyCode=" + page.agencyCode + "&setYear=" + page.setYear, // 3
							'get', {
								"bgPlanChrId": page.planData1.chrId,
								"bgPlanChrCode": page.planData1.chrCode,
								"agencyCode": page.agencyCode,
								"billType": '2',
								"bgReserve": '2'
							},
							function (result) {
								if (result.flag == "success") {
                  page.addData.push(result.data);
                  if ($('#decompose-data').find('tbody tr').length == 0) {
                    page.setChildTable(result.data);
                  }
                  // var newRow = page.getDmpCols(page.sendCloName);
                  var tmpData = $('#select-data').getObj().getCheckData();
                  var decomData = $('#decompose-data').find('tbody tr').length > 0 ? $('#decompose-data').getObj().getData()[0] : {};
									var data = $.extend(true, [], decomData);
									data = $.extend(true, data, tmpData);
									data[0].bgItemCode = result.data.bgItemCode;
									data[0].isNew = '是';
									$('#decompose-data').getObj().add(data[0]); // 取对象
									$('#billHJJE').html($.formatMoney(page.getRowsSum()));
									$('#decomposableAmt').html($.formatMoney($('#zbtz-data-editor').getObj().getData()[0].bgItemBalanceCur - page.getRowsSum()));
								}
							});
					});
				$(document).on('mousedown', '#decompose-data .btn-del', function (e) {
					e.stopPropagation();
					var rowid = $(this).closest('tr').attr('id');
					var obj = $('#decompose-data').getObj(); // 取对象
					if ($('#decompose-data').getObj().getData().length == 1) {
						ufma.showTip('至少需要保留一条分解指标', function () {}, 'warning');
						return false;
					}
					//bugCWYXM-4308--新增指标分解，选择预算方案再删除时，行删除控制应与列表删除控制逻辑一致“至少需要保留一条分解指标”--zsj
					ufma.confirm('您确定要删除选中的行数据吗？', function (action) {
						if (action) {
							obj.del(rowid);
							//bugCWYXM-4347-新增指标分解，分解指标页面，新增行再删除，合计金额未重新计算--zsj
							$('#billHJJE').html($.formatMoney(page.getRowsSum()));
							$('#decomposableAmt').html($.formatMoney($('#zbtz-data-editor').getObj().getData()[0].bgItemBalanceCur - page.getRowsSum()));
						} else {
							//点击取消的回调函数
						}
					}, {
						type: 'warning'
					});

				});
			},
			// 此方法必须保留
			init: function () {
				reslist = ufma.getPermission();
				ufma.isShow(reslist);
				page.pfData = ufma.getCommonData();
				page.setYear = parseInt(page.pfData.svSetYear);
				ufma.parse();
				uf.parse();
				page.agencyCode = window.ownerData.agencyCode;
				page.needSendDocNum = window.ownerData.needSendDocNum; //根据系统选项判断发文文号是否必填
				//CWYXM-12690--根据系统选项判断发文文号是否必填，若必填则将列名“发文文号”改完指标id--zsj
				if (page.needSendDocNum == true) {
					page.sendCloName = "指标id";
				} else {
					page.sendCloName = "发文文号";
				}
				this.initPage();
				this.onEventListener();
				$("#createDate1 input").attr("disabled", false);
				$("#createDate1 span").show();
				$("#createDate1").css("background", "#ffffff");
			}
		}
	}();
	window.page = page;
	// ///////////////////
	page.init();
});