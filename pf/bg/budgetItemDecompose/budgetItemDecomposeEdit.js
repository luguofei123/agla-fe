$(function () {
	var cacheData = [];
	var modal_billAttachment = [];
	//bug77471--zsj
	var attachNum = 0; //附件前输入框数字
	var pageAttachNum = 0; //后端返回的附件数字
	var fileLeng = 0; //实际上传文件数
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
	}];
	window._close = function (state) {
		if (window.closeOwner) {
			var data = {
				action: state,
				result: {}
			};
			window.closeOwner(data);
		}
	}
	var page = function () {
		return {
			addData: [],
			planData: window.ownerData.planData,
			tableData: window.ownerData.tableData,
			curBgPlanDataChrId: '',
			curBgPlanDataChrCode: '',
			curBgPlanDataChrIdOld: '',
			curBgPlanDataChrCodeOld: '',
			planData1: '',
			billId: '',
			billCode: '',
			billData: '',
			composePlanId: '',
			composePlanName: '',
			bCanLeave: true,
			tblObj: $('#decompose-data').getObj(),
			getSearchMap: function (planData) {
				var searchMap = bg.getBgPlanItemMap(planData);
				searchMap['agencyCode'] = page.agencyCode;
				searchMap['billType'] = 2;
				searchMap['status'] = 1;
				searchMap['billId'] = window.ownerData.billId;
				return searchMap;
			},
			setChildTable: function (billData, allColArr) {
				if (window.ownerData.status == '3') { //如果为已审核单子，不可编辑
					sDisabled = true;
				} else {
					sDisabled = false;
				}
				cacheData = billData;
				var columns = allColArr;
				$('#decompose-data').ufDatagrid({
					data: billData,
					idField: 'bgItemCode', //用于金额汇总
					pId: 'billId', //用于金额汇总
					disabled: sDisabled, //可选择
					frozenStartColumn: 1, //冻结开始列,从1开始
					frozenEndColumn: 1, //冻结结束列
					paginate: true, //分页
					columns: [columns],
					toolbar: [{
							type: 'checkbox',
							class: 'check-all disabled',
							text: '全选'
						},
						{
							type: 'button',
							class: 'btn-default btn-delete disabled',
							text: '删除',
							action: function () {
								//bug78362--zsj
								var checkData = $('#decompose-data').getObj().getCheckData();
								var tableData = $('#decompose-data').getObj().getData();
								if (checkData.length == 0) {
                  ufma.showTip("请选择要删除的指标！",function(){}, "warning");
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
								delDecomposeRows(checkData);
							}
						}
					],
					initComplete: function (options, data) {
						//decomposeInitCmp();
					}
				});
				//$('#decompose-data').getObj().load(data);
				if ($.isNull(page.planData1)) {
					return false;
				}

				ufma.isShow(reslist);
				$('#decompose-datamoneybgItemCur').attr("maxlength", "20"); //控制金额列输入不可超出20位
			},
			//当前预算方案的column
			getAdjustHead: function () { //页面上面待分解指标表
				var columns = [];
				var column1 = [ //支持多表头
					{
						field: 'bgItemCode',
						name: '指标编码',
						rowspan: 2,
						width: 100,
            headalign: 'center',
            className: 'nowrap BGasscodeClass',
						"render": function (rowid, rowdata, data, meta) {
							if (!$.isNull(data)) {
								return '<code title="' + data + '">' + data + '</code>';
							} else {
								return '';
							}
						}
					},
					{
						field: 'bgPlanName',
						name: '预算方案',
						rowspan: 2,
            width: 150,
            className: 'nowrap BGThirtyLen',
						headalign: 'center',
						"render": function (rowid, rowdata, data, meta) {
							if (!$.isNull(data)) {
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
						rowspan: 2,
						className: 'nowrap BGTenLen',
						width: 200,
						headalign: 'center',
						"render": function (rowid, rowdata, data, meta) {
							if (!$.isNull(data)) {
								return '<code title="' + data + '">' + data + '</code>';
							} else {
								return '';
							}
						}
					},
					{
						field: 'bgItemSummary',
						name: '摘要',
						rowspan: 2,
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
					}
				];
				if (page.planDataOld.isComeDocNum == "是") {
					column1.push({
						field: 'comeDocNum',
						name: '来文文号',
						rowspan: 2,
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
				if (page.planDataOld.isSendDocNum == "是") {
					column1.push({
						field: 'sendDocNum',
						name: page.sendCloName,
						rowspan: 2,
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
        if (page.planDataOld.isFinancialBudget == "1") {
					column1.push({
						field: 'bgItemIdMx',
						name: '财政指标ID',
						rowspan: 2,
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
				//CWYXM-11697 --：预算方案中要素选择里，增加是否采购属性，启用之后，编制指标时可选是和否，不能输入其他值，采购模块选择指标时，根据这个属性过滤--zsj
				//bugCWYXM-4348--新增指标分解保存成功后查看，待分解指标页辅助项应与原方案保持一致，目前与分解后一致，导致部分空值-zsj
				if (!$.isNull(page.planDataOld)) {
					for (var i = 0; i < page.planDataOld.planVo_Items.length; i++) {
						var item = page.planDataOld.planVo_Items[i];
						var cbItem = item.eleCode;
						if (cbItem != "ISUPBUDGET") {
							column1.push({
								field: bg.shortLineToTF(item.eleFieldName) + 'Name',
								name: item.eleName,
								rowspan: 2,
								width: 200,
                headalign: 'center',
                className: 'nowrap BGThirtyLen',
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
								rowspan: 2,
								// width: 200,
                headalign: 'center',
                className: 'nowrap',
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

          };
          //CWYXM-18080 编制指标时需要增加文本说明项，只录入文本，用于描述指标信息--zsj
          for (var k = 0; k < page.planDataOld.planVo_Txts.length; k++) {
            var textCode =  bg.shortLineToTF(page.planDataOld.planVo_Txts[k].eleFieldName)
            column1.push({
              field: textCode,
              name: page.planDataOld.planVo_Txts[k].eleName,
              rowspan: 2,
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
				}
				column1.push({
					///	field: 'bgItemCur',//CWYXM-10727 指标分解新增页面，金额应显示最初指标编制金额--zsj
					field: 'realBgItemCur', //CWYXM-10727 指标分解新增页面，经赵雪蕊确认后金额取值应为指标编制的最初金额，加上调整、调剂的调增，减去调整、调剂、分解的减少后的值--zsj
					name: '金额',
					width: 150,
					headalign: 'center',
					align: 'right',
					className: 'realBgItemCur BGmoneyClass',
					"render": function (rowid, rowdata, data, meta) {
						if (!$.isNull(data)) {
							return '<code title="' + data + '">' + $.formatMoney(data, 2) + '</code>';
						} else {
							return '';
						}
					}
				});
				column1.push({
					//					field: 'realBgItemCur',
					field: 'bgItemBalanceCur',
					name: '余额',
					width: 150,
					headalign: 'center',
					align: 'right',
					className: 'modifyAfterCur BGmoneyClass',
					/*render: function(rowid, rowdata, data) {
						return $.formatMoney(data, 2);
					}*/
					"render": function (rowid, rowdata, data, meta) {
						if (!$.isNull(data)) {
							return '<code title="' + data + '">' + $.formatMoney(data, 2) + '</code>';
						} else {
							return '';
						}
					}
				});
				column1.push({
					type: 'toolbar',
					field: 'option',
					name: '操作',
					width: 60,
					rowspan: 2,
					headalign: 'center',
					render: function (rowid, rowdata, data) {
						//return '<button class="btn btn-watch-detail btn-permission btn-log disabled" data-toggle="tooltip" title="日志"><span class="icon-log"></span></button>';
						//bugCWYXM-4542--zsj--编辑已保存后的指标分解单据，待分解指标行的操作列无按钮，应显示“日志”按钮，或隐藏该列
						return '<button class="btn btn-log btn-watch-detail btn-permission" data-toggle="tooltip" title="日志"><span class="icon-log"></span></button>';
					}
				});
				columns.push(column1);
				page.columnAll = columns;
				return columns;
			},
			setAdjustTable: function (data) {
				$('#zbtz-data-editor').ufDatagrid({
					data: data,
					idField: 'bgItemCode', //用于金额汇总
					pId: 'pid', //用于金额汇总
					disabled: false, //可选择
					paginate: false, //分页
					columns: page.getAdjustHead(),
					initComplete: function (options, data) {
						ufma.isShow(reslist); //CWYXM-11977 指标管理模块，指标分解编辑页面，指标分解列表中没有操作日志按钮，资源权限已经设置此按钮，但是分解编辑页面没有显示--zsj
						$('#zbtz-data-editor tr').on('click', '.btn-log', function (e) {
							//e.stopPropagation();
							var rowid = $(this).closest('tr').attr('id');
							var rowData = $('#zbtz-data-editor').getObj().getRowByTId(rowid);
							_bgPub_showLogModal("budgetItemDecomposeEdit", {
								"bgBillId": rowData.billId,
								"bgItemCode": "",
								"agencyCode": page.agencyCode
							});
						});
						$('#zbtz-data-editor').getObj().setBodyHeight(85);
						//$('#decomposableAmt').html($.formatMoney($('#zbtz-data-editor').getObj().getData()[0].bgItemBalanceCur - page.getRowsSum(billData[0].billCur)));
						//CWYXM-10601、CWYXM-10630 --查看指标分解单据，可分解金额计算错误--zsj
						$('#decomposableAmt').html($.formatMoney($('#zbtz-data-editor').getObj().getData()[0].bgItemBalanceCur));
						page.totalBalanceCur = $('#zbtz-data-editor').getObj().getData()[0].bgItemBalanceCur + parseFloat($('#billHJJE').html().replace(/,/g, ''));
					}
				});

			},
			adjGridTop: function ($table) {
				$.timeOutRun(null, null, function () {
					var gridTop = $table.offset().top;
					var gridHeight = $('.ufma-layout-down').offset().top - gridTop - 15;
					$table.getObj().setBodyHeight(gridHeight);
				}, 800);
			},
			setSearchMap: function () {
				var searchMap = {
					'agencyCode': page.agencyCode
				};
				searchMap['billType'] = 2;
				searchMap['setYear'] = page.setYear;
				searchMap['billId'] = window.ownerData.billId;
				return searchMap;
			},
			getBudgetPlan: function (tempData2, columns) {
				var url = _bgPub_requestUrlArray[1] + "?agencyCode=" + page.agencyCode + "&setYear=" + page.setYear + "&bgPlanChrId=" + page.curBgPlanDataChrId + "&bgPlanChrCode=" + page.curBgPlanDataChrCode;
				var argu = "";
				var callback = function (result) {
					page.planData1 = result.data[0];
					//page.setChildTable(tempData2);
					page.loadTableData(columns, tempData2);
					if (billData[0].status == "1") {
						$("#btn-save").removeClass("hide");
						$("#btn-newRow-decompose").removeClass("hide");
						$('#decompose-data .btn-delete').removeClass('disabled');
						$('#decompose-data .check-all').removeClass('disabled');
						//$('#zbtz-data-editor .btn-watch-detail').removeClass('disabled');
						//未审核的单子允许修改附件数或者上传附件
						$('#billFJ').removeClass('disabled');
					} else {
						$("#btn-save").addClass("hide");
						$("#btn-newRow-decompose").addClass("hide");
						$('#decompose-data .btn-delete').attr('disabled', 'disabled');
						$('#decompose-data .check-all').attr('disabled', 'disabled');
						//$('#zbtz-data-editor .btn-watch-detail').attr('disabled', 'disabled');
						//已审核的单子不允许修改附件数或者上传附件
						$('#billFJ').attr('disabled', 'disabled');
					}
				}
				ufma.get(url, argu, callback);
			},
			//bugCWYXM-4348--新增指标分解保存成功后查看，待分解指标页辅助项应与原方案保持一致，目前与分解后一致，导致部分空值-zsj
			getBudgetPlanOld: function (tempData1) {
				var url = _bgPub_requestUrlArray[1] + "?agencyCode=" + page.agencyCode + "&setYear=" + page.setYear + "&bgPlanChrId=" + page.curBgPlanDataChrIdOld + "&bgPlanChrCode=" + page.curBgPlanDataChrCodeOld;
				var argu = "";
				var callback = function (result) {
					page.planDataOld = result.data[0];
					page.setAdjustTable(tempData1)
					//ZJGA820-1307【指标管理】--1.指标分解时，带入的指标要素信息不允许修改--zsj
					page.parentAssiArr = [];
					for (var i = 0; i < page.planDataOld.planVo_Items.length; i++) {
						var item = page.planDataOld.planVo_Items[i];
						var cbItem = item.eleCode;
						page.parentAssiArr.push(cbItem)
					};
				}
				ufma.get(url, argu, callback);
			},
			initPage: function () {
				page.setBillCode();
				page.editData = true;
				page.noForSetData = false;
				page.getDecomposedData();
				page.curBill = ufma.getObjectCache('curBillData');
				page.billCode = page.curBill.billCode;
				$('#billCode').val(page.curBill.billCode);
			},

			getDecomposedData: function () {
				var url = "/bg/budgetItem/multiPost/getBills" + "?agencyCode=" + page.agencyCode + "&setYear=" + page.setYear;
				var argu = page.setSearchMap();
				var callback = function (result) {
					var extArr = result.data.eleValueList;
					billData = result.data.billWithItemsVo;
					for (var j = 0; j < extArr.length; j++) {
						var fName = extArr[j].eleName;
						var field = bg.shortLineToTF(extArr[j].eleFieldName);
						var treeData = extArr[j].data;
						var eleCode = extArr[j].eleCode;
						var newData = [];
						for (var i = 0; i < treeData.length; i++) {
							var obj = {};
							var name = field + "Name";
							var code = field + "Code";
							var codeName = field + "CodeName";
							obj[field] = treeData[i].id;
							obj[code] = treeData[i].id;
							obj[codeName] = treeData[i].codeName;
							obj[name] = treeData[i].codeName;
							obj["pId"] = treeData[i].pId;
							newData.push(obj);
						}
						var treeName = field + "Tree";
						page[treeName] = newData;

					}
					//$('#billHJJE').html($.formatMoney(page.getRowsSum(billData[0].billCur, false)));
					$('#billHJJE').html($.formatMoney(billData[0].billCur));
					//$('#decomposableAmt').html($.formatMoney(page.totalBalanceCur - page.getRowsSum()));
					page.statusType = billData[0].status;
					//bug77471--zsj
					if (billData[0].attachNum == '') {
						billData[0].attachNum = 0;
					}
					$("#billFJ").val(billData[0].attachNum + "");
					pageAttachNum = billData[0].attachNum;
					$('#createDate1').getObj().setValue(billData[0].billDate);
					var tempData1 = [];
					var tempData2 = [];
					//bugCWYXM-4348--新增指标分解保存成功后查看，待分解指标页辅助项应与原方案保持一致，目前与分解后一致，导致部分空值-zsj
					for (var i = 0; i < billData[0].billWithItems.length; i++) {
						if (billData[0].billWithItems[i].adjustDir == 2) {
							tempData1.push(billData[0].billWithItems[i]);
							page.curBgPlanDataChrIdOld = tempData1[0].bgPlanId;
							page.curBgPlanDataChrCodeOld = tempData1[0].bgPlanCode;
							page.getBudgetPlanOld(tempData1);
						} else {
							tempData2.push(billData[0].billWithItems[i]);
							page.curBgPlanDataChrId = tempData2[0].bgPlanId;
							page.curBgPlanDataChrCode = tempData2[0].bgPlanCode;
              // page.getBudgetPlan(tempData2, extArr);
              page.getBudgetPlan(tempData2, result.data.eleValueList);
						}
						if (tempData2.length == 0) {
							page.curBgPlanDataChrId = tempData1[0].bgPlanId;
							page.curBgPlanDataChrCode = tempData1[0].bgPlanCode;
						}
					}

				}
				ufma.post(url, argu, callback);

				var tmpRst = _bgPub_GetAttachment({
					"billId": page.billId,
					"agencyCode": page.agencyCode
				});
				if (!$.isNull(tmpRst.data.bgAttach)) {
					for (var m = 0; m < tmpRst.data.bgAttach.length; m++) {
						modal_billAttachment[modal_billAttachment.length] = {
							"filename": tmpRst.data.bgAttach[m].fileName,
							"filesize": 0,
							"fileid": tmpRst.data.bgAttach[m].attachId
						};
					}
				}
			},
			expandData: function (eleCode, fName, field, eleLevel) {
				var ele = field;
				var fText = ele + "Name";
				var fId = ele;
				var eleTree = ele + "Tree";
				var dataTree = page[eleTree];
				var colObj = {
					type: 'treecombox',
					field: fId,
					name: fName,
					idField: fId,
					textField: fText,
					data: dataTree,
					width: 200,
					headalign: 'center',
          leafRequire: false,
          className: 'nowrap BGThirtyLen',
					onChange: function (e) {},
					//ZJGA820-1307【指标管理】--1.指标分解时，带入的指标要素信息不允许修改--zsj
					//分解的时候，分解指标的要素，如果和被分解指标相同，而且级次是明细级，就限制不能编辑，是否采购，始终是明细级，因为它只有是否
					beforeExpand: function (sender, data) {
						//-1是不限制 0是明细级
						if (eleLevel == '0') {
							if ($.inArray(eleCode, page.parentAssiArr) > -1) {
								$('#decompose-datatreecombox' + fId).addClass('uf-combox-disabled');
								$('#decompose-datatreecombox' + fId + '_input').attr('readonly', true);
								$('#decompose-datatreecombox' + fId + '_popup').addClass('hide');
							} else {
								$(sender.sender).removeClass('uf-combox-disabled');
								$('#decompose-datatreecombox' + fId + '_input').removeAttr('readonly');
								$('#decompose-datatreecombox' + fId + '_popup').removeClass('hide');
							}

						} else {
							$(sender.sender).removeClass('uf-combox-disabled');
							$('#decompose-datatreecombox' + fId + '_input').removeAttr('readonly');
							$('#decompose-datatreecombox' + fId + '_popup').removeClass('hide');
						}
					},
					render: function (rowid, rowdata, data) {
						return rowdata[fText];
					}
				}
				return colObj;
			},
			//加载表格数据
			loadTableData: function (extArr, tableData) {
				var extCol = [];
				//page.column = getDmpCols();
				page.column = [ // 支持多表头
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
            className: 'nowrap BGasscodeClass',
						"render": function (rowid, rowdata, data, meta) {
							if (!$.isNull(data)) {
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
						className: 'BGTenLen nowrap',
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
						type: 'input',
						field: 'bgItemSummary',
						name: '摘要',
						className: 'BGThirtyLen nowrap',
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
				if (page.planData1.isComeDocNum == "是") {
					page.column.push({
						type: 'input',
						field: 'comeDocNum',
						name: '来文文号',
						className: 'BGThirtyLen nowrap',
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
				if (page.planData1.isSendDocNum == "是") {
					page.column.push({
						//ZJGA820-1380【指标管理】--[财政指标]在单位指标部分点击新增之后，“发文文号”和“是否采购”不会自动带下来，需要能够带下来，并且不能够修改--zsj
						type: 'input',
						field: 'sendDocNum',
						name: page.sendCloName,
						className: 'BGThirtyLen nowrap',
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
        if (page.planData1.isFinancialBudget == "1") {
					page.column.push({
						//ZJGA820-1380【指标管理】--[财政指标]在单位指标部分点击新增之后，“发文文号”和“是否采购”不会自动带下来，需要能够带下来，并且不能够修改--zsj
						type: 'input',
						field: 'bgItemIdMx',
						name: '财政指标ID',
						className: 'BGThirtyLen nowrap',
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
				var codeArr = [];
				for (var z = 0; z < page.planData1.planVo_Items.length; z++) {
					codeArr.push(page.planData1.planVo_Items[z].eleCode);
				}

				if ($.inArray('ISUPBUDGET', codeArr) > -1) {
					if ($.inArray('ISUPBUDGET', page.parentAssiArr) > -1) {
						page.column.push({
							field: 'isUpBudget',
							name: "是否采购",
							// width: 200,
              headalign: 'center',
              className: 'nowrap',
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
						page.column.push({
							type: 'treecombox',
							field: 'isUpBudget',
							idField: "code",
							textField: 'codeName',
							name: "是否采购",
							//width: 100,
              headalign: 'center',
              align: 'center',
              data: isUpBudgetData,
              className: 'nowrap',
							render: function (rowid, rowdata, data) {
								return rowdata.isUpBudget;
							},

						});
					}

				}
				var fzcolumn = [];
				// for (var i = 0; i < extArr.length; i++) {
				// 	var eleCode = extArr[i].eleCode;
				// 	var fName = extArr[i].eleName;
				// 	var field = bg.shortLineToTF(extArr[i].eleFieldName);
				// 	var eleLevel = extArr[i].eleLevel;
				// 	fzcolumn.push(page.expandData(eleCode, fName, field, eleLevel));
        // }
        if (extArr) {
          for (var j = 0; j < extArr.length; j++) {
            var item = extArr[j];
						var cbItem = item.eleCode;
						if (cbItem != "ISUPBUDGET"  && cbItem != 'sendDocNum' && cbItem != 'bgItemIdMx') {
							var idField = bg.shortLineToTF(item.eleFieldName);
							var textField = bg.shortLineToTF(item.eleFieldName + '_NAME');
              fzcolumn.push({
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
                    return '<code title="' + rowdata[colFieldName] + '">' + rowdata[colFieldName] + '</code>';
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
						}
           }
        }
				//新增时子指标带出的金额是父指标的bgItemBalanceCur，既实际可以分解的金额；编辑时用后端返回的bgItemCur即可
				if (page.action == 'add') {
					page.moneyReal = 'bgItemBalanceCur';
				} else {
					page.moneyReal = 'bgItemCur';
        }
        //CWYXM-18080 编制指标时需要增加文本说明项，只录入文本，用于描述指标信息--zsj
        page.lastcolumn = []
        for (var k = 0; k < page.planData1.planVo_Txts.length; k++) {
          var textCode =  bg.shortLineToTF(page.planData1.planVo_Txts[k].eleFieldName)
          page.lastcolumn.push({
            type: 'input',
            field: textCode,
            name: page.planData1.planVo_Txts[k].eleName,
            rowspan: 2,
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
				page.lastcolumn.push({
					type: 'money',
					//bgCWYXM-4518--指标分解自动生成的分解金额应等于待分解金额，目前未包含调剂金额--zsj
					//field: 'bgItemCur',
					//field: 'bgItemBalanceCur',
					field: 'bgItemCur', //CWYXM-10727 指标分解新增页面，金额应显示最初指标编制金额--zsj
					name: '金额',
					width: 150,
					align: 'right',
          headalign: 'center',
          className: 'nowrap BGmoneyClass',
					"render": function (rowid, rowdata, data, meta) {
						return '<code title="' + data + '">' + $.formatMoney(data, 2) + '</code>'
					},
					onKeyup: function (e) {
						//CWYXM-10759 修改指标分解单据-金额字段时，‘可分解金额’计算有误--zsj
						$('#billHJJE').html($.formatMoney(page.getRowsSum()));
						$('#decomposableAmt').html($.formatMoney(page.totalBalanceCur - page.getRowsSum()));
					}
				}, {
					type: 'toolbar',
					field: 'option',
					name: '操作',
					width: 150,
          headalign: 'center',
          className: 'nowrap',
					render: function (rowid, rowdata, data, meta) {
						if (window.ownerData.status == '3') { //如果为已审核单子，不可编辑CWYXM-4872
							return '<button class="btn btn-del btn-delete icon-trash disabled" data-toggle="tooltip" title="删除"></button>';
						} else {
							return '<button class="btn btn-del btn-delete icon-trash" data-toggle="tooltip" title="删除"></button>';
						}
					}
				});

				page.tableColumns = page.column.concat(fzcolumn).concat(page.lastcolumn);
				page.setChildTable(tableData, page.tableColumns);
			},
			setBillCode: function () {
				if ($.isNull(window.ownerData.billId)) {
					var url = _bgPub_requestUrlArray_subJs[14];
					var argu = {
						'agencyCode': page.agencyCode,
						"setYear": page.setYear
					};
					argu['billType'] = 2;
					var callback = function (result) {
						page.billId = result.data.billId;
						//page.billCode = result.data.billCode;
						//$('#billCode').val(page.billCode);
					}
					ufma.get(url, argu, callback);
				} else {
					page.billId = window.ownerData.billId;

				}
			},
			getRowsSum: function (data, flag) {
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
			save: function () {
				var detailItems = $.extend(true, [], $('#decompose-data').getObj().getData());
				cacheData = detailItems;
				var selectedItems = $('#zbtz-data-editor').getObj().getData();
				selectedItems[0].adjustDir = 2;
				selectedItems[0].isNew = '是';
				//CWYXM-11697 --：预算方案中要素选择里，增加是否采购属性，启用之后，编制指标时可选是和否，不能输入其他值，采购模块选择指标时，根据这个属性过滤--zsj
				if (selectedItems[0].isUpBudget == '是') {
					selectedItems[0].isUpBudget = '1';
				} else if (selectedItems[0].isUpBudget == '否') {
					selectedItems[0].isUpBudget = '0';
				}
				var billHJJE = 0.00;
				var sendCount = 0; //根据系统选项判断发文文号是否必填
				var x = detailItems.length - page.addData.length;
				for (var i = x; i < detailItems.length; i++) {
					if (detailItems[i].adjustDir != 1) {
						var newData = $.extend(true, page.addData[i - x], {
							adjustDir: 1,
							bgReserve: 1,
							bgItemParentid: selectedItems[0].bgItemId,
							bgItemParentcode: selectedItems[0].bgItemCode
						});
						detailItems[i] = $.extend(true, newData, detailItems[i]);

					} else { //缺少如果被改变  isnew给为是
						detailItems[i].isNew = '是'
					}
				}
				//CWYXM-12743--与雪蕊姐沟通后确认：是否采购预算项为必填 --zsj
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
					billHJJE = billHJJE + ufma.parseFloat(detailItems[i].bgItemCur);
				}
				selectedItems[0].billCur = billHJJE;
				selectedItems[0].bgCutCur = billHJJE;
				selectedItems[0].checkCutCur = billHJJE;
				var items = [];
				items.push(selectedItems[0]);
				for (var i = 0; i < detailItems.length; i++) {
					items.push(detailItems[i]);
				}
				//if(ufma.parseFloat(selectedItems[0].modifyAfterCur) >= billHJJE) {
				if (ufma.parseFloat(selectedItems[0].bgCutCur) + ufma.parseFloat(selectedItems[0].modifyAfterCur) >= ufma.parseFloat(billHJJE)) {
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
					//CWYXM-12743--与雪蕊姐沟通后确认：是否采购预算项为必填 --zsj
					if (isUpBudgetCount > 0) {
						ufma.showTip('请选择是否采购预算！', function () {}, 'warning');
						return false;
          }
          //CWYXM-17554 预算方案设置中，增加财政指标ID属性，可选择是否启用，启用时，选择预算方案新增指标时，需要录入指标id，指标id也需要参与指标的要素唯一性校验--zsj
          if(page.planData1.isFinancialBudget == "1" && bgItemIdMxCount > 0) {
            ufma.showTip('请输入财政指标ID！', function () {}, 'warning');
            return false;    
          }
					var data = {
						'agencyCode': page.agencyCode,
						'billId': page.billId,
						//'billCur': ufma.parseFloat(selectedItems[0].realBgItemCur),
						'billCur': ufma.parseFloat(selectedItems[0].billCur), //修改单据金额应该为分解子指标总金额 guohx
						'billCode': page.billCode,
						'setYear': page.setYear,
						'createDate': page.pfData.svSysDate,
						'billDate': page.pfData.svTransDate,
						'createUser': page.pfData.svUserCode,
						'createUserName': page.pfData.svUserName,
						'isNew': '否',
						'status': 1,
						'latestOpDate': page.pfData.svSysDate,
						'billType': 2,
						'items': items,
						'attachNum': $("#billFJ").val() //bug77471--zsj
					};
					ufma.showloading('数据保存中，请耐心等待...');
					var url = _bgPub_requestUrlArray_subJs[4] + "?billType=2&agencyCode=" + page.agencyCode + '&setYear=' + page.setYear;
					var callback = function (result) {
						ufma.hideloading();
						if (result.flag == "success") {
							cacheData = detailItems;
							ufma.showTip("保存成功", null, "success");
							bCanLeave = true;
							page.noForSetData = true;
							page.getDecomposedData();
						} else {
							ufma.showTip("保存失败!" + result.msg, null, "error");
						}
					}
					ufma.post(url, data, callback);
				} else {
					ufma.showTip("分解指标金额之和不可大于待分解指标金额,请修改!", "warning");
				}
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
			onEventListener: function () {

				$('#btn-save').click(function () {
					$.timeOutRun(null, null, function () {
						page.save();
					}, 300);
				});
				$('#btn-close').click(function () {
					if (!page.closeCheck() && page.status) {
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
				$(document).find('.u-msg-close span').click(function () {
					if (!page.closeCheck() && page.status) {
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
				$('#zbtz-data-editor').on('keyup', 'input[name="bgItemFpedCur"]', function (e) {
					e.stopPropagation();
					e.preventDefault();
					var $row = $(this).closest('tr');
					var blCur = $row.find('td[name="bgItemCur"] .cell-label').text();
					blCur = blCur.replaceAll(',', '');
					var val = $(this).val();
					if (val == '') val == 0.00;
					var hj = parseFloat(blCur) - val;
					$row.find('td[name="bgItemCurHJ"] .cell-label').html($.formatMoney(hj));
					if (hj < 0) {
						ufma.showTip('可分配金额不足！', function () {}, 'warning');
						$('#btn-save').attr('disabled', 'disabled');
					} else {
						$('#btn-save').removeAttr('disabled', 'disabled');
					}
				});

				//行删除---bug78362--zsj
				$(document).on('mousedown', '#decompose-data .btn-del', function (e) {
					var trId = '';
					//if($(e.target).is('.btn-delete')) {
					trId = $(e.target).closest('tr').attr('id');
					if ($('#decompose-data').getObj().getData().length == 1) {
						ufma.showTip('至少需要保留一条分解指标', function () {}, 'warning');
						return false;
					}
					var row = $('#decompose-data').getObj().getRowByTId(trId);
					var bgItemId = [];
					bgItemId.push(row);
					var url = '/bg/budgetItem/multiPost/delComposeItems';
					var argu = {
						"agencyCode": page.agencyCode,
						"setYear": page.setYear,
						"billType": 2,
						"billId": page.billId,
						"bgPlanChrId": page.curBgPlanDataChrId,
						"items": bgItemId
					}
					ufma.confirm('您确定要删除这条数据吗？', function (action) {
						if (action) {
							$('#decompose-data').getObj().del(trId);
							//CWYXM-8616 修改指标分解，删除行，未点击保存，直接关闭，应未删除成功，目前删除成功--修改为已保存数据删除时动态修改金额、余额、合计，未保存的数据删除时金额、余额不变，只有合计改变--zsj
							var realCur = parseFloat($('#zbtz-data-editorBody .realBgItemCur').text().replace(/,/g, ''));
							var modifyCur = parseFloat($('#zbtz-data-editorBody .modifyAfterCur').text().replace(/,/g, ''));
							var billMoney = parseFloat($('#billHJJE').html().replace(/,/g, ''));
							if (row.isNew != "是") {
								$('#zbtz-data-editorBody .realBgItemCur').text($.formatMoney((realCur + row.bgItemCur), 2));
								$('#zbtz-data-editorBody .modifyAfterCur').text($.formatMoney((modifyCur + row.bgItemCur), 2));
							}
							//CWYXM-10759 修改指标分解单据-金额字段时，‘可分解金额’计算有误--zsj
							$('#billHJJE').html($.formatMoney((billMoney - row.bgItemCur), 2));
							$('#decomposableAmt').html($.formatMoney(page.totalBalanceCur - page.getRowsSum()));
						} else {
							//点击取消的回调函数
						}
					}, {
						type: 'warning'
					});
				});
				//解决金额输入不能为负数
				$('#decompose-data').on('keyup', 'input[name="bgItemCur"]', function (e) {
					e.stopPropagation();
					e.preventDefault();
					var val = $(this).val();
					if (val < 0) {
						$(this).val('');
					}
				});
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
        $("#decompose-data").on("focus", "input[name='sendDocNum']", function () {
					if (page.planData.isFinancialBudget == "1") {
						$('#decompose-datainputbgItemIdMx').attr('readOnly', true);
						$(this).attr('disabled', true);
					} else {
						$('#decompose-datainputbgItemIdMx').removeAttr('readOnly');
						$(this).removeAttr('disabled');
					}
				})
				$(document).on("blur", "#decompose-data tbody td[name='bgItemCur']", function () {
					//CWYXM-10759 修改指标分解单据-金额字段时，‘可分解金额’计算有误--zsj
					$('#billHJJE').html($.formatMoney(page.getRowsSum()));
					$('#decomposableAmt').html($.formatMoney(page.totalBalanceCur - page.getRowsSum()));
				})
				/**
				 * 上传附件
				 */
				$('#btnUploadFile').on('click', function (e) {
					e.stopPropagation();
					var option = {
						"agencyCode": page.agencyCode,
						"billId": page.billId,
						"uploadURL": _bgPub_requestUrlArray_subJs[8] + "?agencyCode=" + page.agencyCode + "&billId=" + page.billId + "&setYear=" + page.setYear,
						"delURL": _bgPub_requestUrlArray_subJs[16] + "?agencyCode=" + page.agencyCode + "&billId=" + page.billId + "&setYear=" + page.setYear,
						"downloadURL": _bgPub_requestUrlArray_subJs[15] + "?agencyCode=" + page.agencyCode + "&billId=" + page.billId + "&setYear=" + page.setYear,
						"onClose": function (fileList) {
							//bug77471--zsj
							page.getDecomposedData();
							fileLeng = fileList.length;
							attachNum = fileList.length < pageAttachNum ? pageAttachNum : fileList.length;
							//$("#billFJ").val(fileList.length + "");
							$("#billFJ").val(attachNum + "");
							modal_billAttachment = cloneObj(fileList);
						}
					};
					_bgPub_ImpAttachment("pnl-tzzb", "指标单据[" + page.billCode + "]附件导入", modal_billAttachment, option, billData[0].status);

				});
				/**
				 * 模态框表格-新增一行[本质就是获得一条指标]
				 * 特点：手工录入 + 新增未审核 + 可执行指标
				 */
				$('#btn-newRow-decompose').click(function () {

					var argu = {
						"bgPlanChrId": page.curBgPlanDataChrId,
						"bgPlanChrCode": page.curBgPlanDataChrCode,
						"agencyCode": page.agencyCode,
						"setYear": page.setYear,
						"billType": '2',
						"bgReserve": '2'
					}
					//外交部财务云项目WJBCWY-1601【财务云8.20.14 IE11】指标分解界面分解指标无分解数据具体见截图--zsj
					ufma.ajaxDef(_bgPub_requestUrlArray_subJs[3] + "?agencyCode=" + page.agencyCode + "&setYear=" + page.setYear, //3  新增一条指标
						'get',
						argu,
						function (result) {
							if (result.flag == "success") {
								page.addData = [];
								page.addData.push(result.data);
								page.isNewFlag = result.data.isNew;
								var newRow = [page.tableColumns]; //getDmpCols();
                var newdata = {};
                var n = $('#decompose-data').getObj().getData().length - 1;
                var tmpData = $('#decompose-data').getObj().getData()[n];
								for (var i = 0; i < newRow[0].length; i++) {
									if (i == 1) {
                    // newdata[newRow[0][i].field] = result.data.bgItemCode;
                    newdata[newRow[0][i].field] = result.data.bgItemCode;
									}else if (i == 0) {
                    // newdata[newRow[0][i].field] = result.data.bgItemCode;
                    newdata[newRow[0][i].field] = "";
									} else {
										newdata[newRow[0][i].field] = tmpData[newRow[0][i].field];
									}
                }
                newdata =  $.extend(true, newdata, tmpData);
							  newData = $.extend(true, newdata, {
									bgItemId: page.addData.bgItemId
								});
								newdata.bgItemId = result.data.bgItemId;
                newData.isNew = page.isNewFlag;
                newdata.bgItemCode = result.data.bgItemCode;
								var obj = $('#decompose-data').getObj(); //取对象
								var newId = obj.add(newData);
							}
						});

				});

			},
			//此方法必须保留
			init: function () {
				reslist = ufma.getPermission();
				ufma.isShow(reslist);
				page.pfData = ufma.getCommonData();
				ufma.parse();
				uf.parse();
				page.agencyCode = window.ownerData.agencyCode;
				//CWYXM-12690--根据系统选项判断发文文号是否必填，若必填则将列名“发文文号”改完指标id--zsj
				page.needSendDocNum = window.ownerData.needSendDocNum;
				if (page.needSendDocNum == true) {
					page.sendCloName = "指标id";
				} else {
					page.sendCloName = "发文文号";
				}
				page.setYear = parseInt(page.pfData.svSetYear);
				page.totalBalanceCur = 0;
				this.initPage();
				this.onEventListener();
				//修改  编辑界面不可修改单据日期  guohx
				$("#createDate1 input").attr("disabled", "disabled");
				$("#createDate1 span").hide();
				$("#createDate1").css("background", "#eee");
			}
		}
	}();
	window.page = page;

	/////////////////////
	page.init();
});