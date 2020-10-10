$(function () {
	var page = function () {
		var pageData = {
			agencyCode: '',
			bgplanData: '',
			tblDt: '',
			tabData: [],
			bgPlanCode: ''
		}
		var oTableChack, oTableCarrry;
		var pageLengthChack = ufma.dtPageLength('#oTableChack');
		var pageLengthCarrry = ufma.dtPageLength('#oTableCarrry');
		return {
			//初始化单位
			initAgency: function () {
				ufma.showloading('正在加载数据，请耐心等待...');
				var arguAge = {
					setYear: page.setYear,
					rgCode: page.rgCode
				}
				var disableFlag = false;
				if (page.disableFlag == true) {
					disableFlag == true;
				} else if (page.disableFlag == false) {
					disableFlag = false;
				}
				dm.doGet("agency", arguAge, function (result) {
					$('#cbAgency').ufTreecombox({
						idField: 'id', //可选
						textField: 'codeName', //可选
						pIdField: 'pId', //可选
						readonly: false,
						placeholder: '请选择单位',
						icon: 'icon-unit',
						theme: 'label',
						leafRequire: true,
						disabled: disableFlag,
						data: result.data,
						onChange: function (sender, treeNode) {
							pageData.agencyCode = treeNode.code;
							var agencyText = treeNode.codeName;
							page.initAgencyStatus();
							$('#onePage').removeClass('hide');
							$('#agencyText').html('');
							$('#agencyText').html('单位: ' + agencyText);
							//缓存单位账套
							var params = {
								selAgecncyCode: treeNode.code,
								selAgecncyName: treeNode.name,
							}
							ufma.setSelectedVar(params);
						},
						onComplete: function (sender) {
							if (page.pfData.svAgencyCode) {
								$('#cbAgency').getObj().val(page.pfData.svAgencyCode);
							} else {
								$('#cbAgency').getObj().val('1');
							}
							ufma.hideloading();
						}
					});
				})
			},
			//预算方案
			// initSearchPnl: function () {
			// 	ufma.showloading('正在加载数据，请耐心等待...');
			// 	var arguAge = {
			// 		agencyCode: pageData.agencyCode,
			// 		setYear: page.setYear,
			// 		rgCode: page.rgCode
			// 	}
			// 	dm.doGet("bgPlan", arguAge, function (result) {
			// 		$('#cbBgPlan').ufTreecombox({
			// 			idField: 'chrId',
			// 			textField: 'chrName',
			// 			placeholder: '请选择预算方案',
			// 			leafRequire: true,
			// 			data: result.data,
			// 			onChange: function (sender, data) {
			// 				page.planData = data;
			// 				$('.label-more div').text('更多');
			// 				$('#budgetQuery').css('border-spacing', "0px 0px");
			// 				bg.initBgPlanItemPnl1($('#searchPlanPnl'), data);
			// 				$('#searchPlanPnl').css({
			// 					"height": "35px",
			// 					"overflow-y": "hidden"
			// 				});
			// 				page.initCarryTable();
			// 				page.showTblData();
			// 			},
			// 			onComplete: function (sender) {
			// 				if (!$.isNull(pageData.bgPlanCode)) {
			// 					$('#cbBgPlan').getObj().val(pageData.bgPlanCode);
			// 				} else {
			// 					var bgPlan = result.data[0].chrId;
			// 					$('#cbBgPlan').getObj().val(bgPlan);
			// 				}

			// 				ufma.hideloading();
			// 			}
			// 		})
			// 	})
			// },
			//获取单位年结状态
			initAgencyStatus: function () {
				var arguAge = {
					agencyCode: pageData.agencyCode,
					setYear: page.setYear,
					rgCode: page.rgCode
				}
				dm.doGet("agencyStatus", arguAge, function (result) {
					var status = result.data.status;
					if (status == "0") {
						$('#statusText').removeClass('hide');
						$('#arginText').addClass('hide');
						$('#beginEnd').html('开始结转');
					} else {
						$('#arginText').removeClass('hide');
						$('#statusText').addClass('hide');
						$('#beginEnd').html('再次结转');
					}
				});
			},
			clearTimeLine: function () {
				$('#zdzzTimeline').html('');
				page.timeline = $('#zdzzTimeline').ufmaTimeline([{
					step: '数据检查',
					target: 'zdzj'
				}, {
					step: '结转处理',
					target: 'savemb'
				}, {
					step: '完成',
					target: 'setend'
				}]);
				$('#btnPrev').addClass('hide');
			},
			//加载表格
			initCheckTable: function () {
				if (oTableChack) {
					pageLengthCarrry = ufma.dtPageLength('#dataCheck');
					oTableChack.fnDestroy();
				}
				var tblId = 'dataCheck';
				$("#" + tblId).html(''); //清空原有表格
				var columns = [{
					data: "ruleName",
					title: "指标年结校验规则",
					className: "tc nowrap BGTenLen",
					//width: "30px"
				}, {
					data: "checkResult",
					title: "是否通过",
					className: "tc nowrap BGstatusClass",
					//width: "30px",
					"render": function (data, type, rowdata, meta) {
						if (rowdata.checkResult == '已通过') {
							return '<span class="already" style="color:#00A854;">' + rowdata.checkResult + '</span>';
						} else if (rowdata.checkResult == '未通过') {
							return '<span class="needAgain" style="color: #F04134;">' + rowdata.checkResult + '</span>';
						}

					}
				}, {
					data: "detailInfo",
					title: "详细信息",
					className: "nowrap detailInfo",
					//width: "100px",
					"render": function (data, type, rowdata, meta) {
            if (!$.isNull(data)) {
              return '<code title="' + data + '">' + data + '</code>';
            } else {
              return '';
            }
					}
				}, {
					data: "status",
					title: "审核操作",
					className: "tc nowrap",
					//width: "30px",
					"render": function (data, type, rowdata, meta) {
						var multiPost = '';
						var decompose = '';
						var adjust = '';
						var twoSidesAdjust = '';
						var vou = '';
						//CWYXM-7656 --指标年结，指标基础资料的年结，统一放到第一步的检查中--zsj
						if (rowdata.status.length > 1) {
							if (rowdata.ruleCode == 'BG') {
								var dataArray = rowdata.status.split(',');
								multiPost = dataArray[0] == 1 ? 'disabled' : 'disabled:false';
								decompose = dataArray[1] == 1 ? 'disabled' : 'disabled:false';
								adjust = dataArray[2] == 1 ? 'disabled' : 'disabled:false';
								twoSidesAdjust = dataArray[3] == 1 ? 'disabled' : 'disabled:false';
								var rd = '<a class="btn btn-icon-only btn-sm common-jump-link btn-multiPost" data-toggle="tooltip" ' + multiPost + '  rowcode="' + data + '" title="">指标</a>' + " " +
									'<a class="btn btn-icon-only btn-sm common-jump-link btn-decompose" data-toggle="tooltip" ' + decompose + ' rowcode="' + data + '" title="">分解</a>' + " " +
									'<a class="btn btn-icon-only btn-sm common-jump-link btn-adjust" data-toggle="tooltip" ' + adjust + ' rowcode="' + data + '" title="">调整</a>' + " " +
									'<a class="btn btn-icon-only btn-sm common-jump-link btn-twoSidesAdjust" data-toggle="tooltip" ' + twoSidesAdjust + ' rowcode="' + data + '" title=" ">调剂</a>';
								return rd;
							} else if (rowdata.ruleCode == 'AR') { //报销
								var dataArray = rowdata.status.split(',');
								income = dataArray[0] == 1 ? 'disabled' : '';
								commit = dataArray[1] == 1 ? 'disabled' : '';
								pay = dataArray[2] == 1 ? 'disabled' : '';
								loan = dataArray[3] == 1 ? 'disabled' : '';
								var rd = '<a class="btn btn-icon-only btn-sm common-jump-link btn-income" data-toggle="tooltip" ' + income + '  rowcode="' + data + '" title="">请款</a>' + " " +
									'<a class="btn btn-icon-only btn-sm common-jump-link btn-commit" data-toggle="tooltip" ' + commit + ' rowcode="' + data + '" title="">报销</a>' + " " +
									'<a class="btn btn-icon-only btn-sm common-jump-link btn-pay" data-toggle="tooltip" ' + pay + ' rowcode="' + data + '" title="">还款</a>' + " " +
									'<a class="btn btn-icon-only btn-sm common-jump-link btn-loan" data-toggle="tooltip" ' + loan + ' rowcode="' + data + '" title=" ">借款</a>';
								return rd;
								//rd = '<a class="btn btn-icon-only btn-sm common-jump-link btn-arTurn" billId ='+rowdata.billId+' data-toggle="tooltip" ' + nomalStatus + '  rowcode="' + data + '" title="">报销</a>';
							}
						} else if (rowdata.status.length == 1) {
							nomalStatus = rowdata.status == 'Y' ? 'disabled' : 'disabled:false';
							var rd = '';
							if (rowdata.ruleCode == 'BG-MA') { //基础资料
								rd = '<a class="btn btn-icon-only btn-sm common-jump-link btn-maTurn" data-toggle="tooltip" ' + nomalStatus + '  rowcode="' + data + '" title="" style="margin-left:-65px;">基础资料结转</a>';
							} else if (rowdata.ruleCode == 'GL') { //账务
								rd = '<a class="btn btn-icon-only btn-sm common-jump-link btn-vou" data-toggle="tooltip" ' + nomalStatus + '  rowcode="' + data + '" title="">凭证记账</a>';
							} else if (rowdata.ruleCode == 'UP') { //采购
								rd = '<a class="btn btn-icon-only btn-sm common-jump-link btn-upTurn" data-toggle="tooltip" ' + nomalStatus + '  rowcode="' + data + '" title="">采购</a>';
							}
							return rd;
						}

					}
				}];
				var opts = {
					"language": {
						"url": bootPath + "agla-trd/datatables/datatable.default.js"
					},
					"bFilter": true,
					"bAutoWidth": false,
					"bDestory": true,
					"processing": true, //显示正在加载中
					"serverSide": false,
					"ordering": false,
					"pageLength": pageLengthChack,
					"columns": columns,
					//填充表格数据
					data: [],
					"dom": 'rt',
					initComplete: function (settings, json) {
						ufma.isShow(reslist);
					},
					drawCallback: function (settings) {
						$('#dataCheck tr').addClass('hide');
						$('#dataCheck').find("td.dataTables_empty").text("")
							.append('<img src="' + bootPath + 'images/noData.png"/><br/><i>目前还没有你要查询的数据</i>');
						ufma.isShow(reslist);
					}
				}
				oTableChack = $("#" + tblId).dataTable(opts); //用于存储dataTable返回的信息
			},
			//获取指标年结校验规则
			showRull: function () {
				var arguAge = {
					agencyCode: pageData.agencyCode,
					setYear: page.setYear,
					rgCode: page.rgCode
				}
				ufma.showloading('数据加载中，请耐心等待...');
				dm.doGet("dataCheck", arguAge, function (result) {
					ufma.hideloading();
          oTableChack.fnClearTable();
          if ($.isNull(result.data)){
            ufma.showTip(result.msg, function(){
              $('#dataCheckNext').addClass('hide');
            }, 'error');
          }else if (result.data.length != 0) {
						for (var i = 0; i < result.data.length; i++) {
							page.checkTableData = result.data;
              oTableChack.fnAddData(result.data[i], true)
              $('#dataCheckNext').removeClass('hide');
						}
					}
				});
			},
			//初始化结转处理表格
			initCarryTable: function () {
				if (oTableCarrry) {
					pageLengthCarrry = ufma.dtPageLength('#carryOver');
					//				    /$('#carryOver').closest('.dataTables_wrapper').ufScrollBar('destroy');
					oTableCarrry.fnDestroy();
				}
				var tblId = 'carryOver';
				$("#" + tblId).html(''); //清空原有表格
				var columns = [{
					title: '<label class="mt-checkbox mt-checkbox-single mt-checkbox-outline"> ' +
						'<input type="checkbox" class="datatable-group-checkable" id="check_H"/>&nbsp;' +
						'<span></span> ' +
						'</label>',
					data: "code",
					className: 'nowrap tc',
					width: 40
				}, {
					data: "bgItemCode",
					title: "指标编码",
					className: "tc nowrap BGasscodeClass",
				}, {
					data: "bgTypeName",
					title: "指标类型",
					className: "tc nowrap BGTenLen",
				}];
				// if (!$.isNull(page.planData)) {
				// 	for (var i = 0; i < page.planData.planVo_Items.length; i++) {
				// 		var item = page.planData.planVo_Items[i];
				// 		columns.push({
				// 			data: bg.shortLineToTF(item.eleFieldName),
				// 			title: item.eleName,
				// 			className: 'nowrap isprint',
				// 			width: 200,
				// 			"render": function (data) {
				// 				if (!$.isNull(data)) {
				// 					return '<span title="' + data + '">' + data + '</span>';
				// 				} else {
				// 					return '';
				// 				}

				// 			}
				// 		});
				// 	}
        // }
        // CWYXM-18967 财务云 8.50】指标年结界面采购属性列为空,具体见截图--zsj
        if (!$.isNull(page.planData)) {
          for (var i = 0; i < page.planData.planVo_Items.length; i++) {
            var item = page.planData.planVo_Items[i];
            var cbItem = item.eleCode;
            var cbData = '';
            if (cbItem != 'ISUPBUDGET' && cbItem != 'sendDocNum' && cbItem != 'bgItemIdMx') {
              cbData = bg.shortLineToTF(item.eleFieldName);
              columns.push({
                data: cbData,
                title: item.eleName,
                className: cbData + ' ' + 'nowrap BGThirtyLen',
                //width: 220,
                "render": function (data) {
                  //bug75659--【财务云8.0 农业部】需要选项控制，项目、支出功能分类等可以隐藏编码，只显示名称--zsj
                  if (!$.isNull(data)) {
                    var showData = [];
                    if (page.showTrue == false) {
                      showData = data.split(' ');
                      return '<span title="' + showData[1] + '">' + showData[1] + '</span>';
                    } else {
                      return '<span title="' + data + '">' + data + '</span>';
                    }

                  } else {
                    return '';
                  }
                }
              });
            } else if (cbItem == 'ISUPBUDGET') {
              columns.push({
                data: 'isUpBudget',
                title: "是否采购",
                className: 'isUpBudget nowrap tc',
                // width: 140,
                "render": function (data) {
                  //bug75659--【财务云8.0 农业部】需要选项控制，项目、支出功能分类等可以隐藏编码，只显示名称--zsj
                  if (!$.isNull(data)) {
                    var showData = [];
                    if (data == '1') {
                      showData = data.split(' ');
                      return '<span>是</span>';
                    } else if (data == '0'){
                      return '<span>否</span>';
                    } else {
                      return data;
                    }
                  } else {
                    return '';
                  }
                }
              });
            }
          }
          //CWYXM-18080 编制指标时需要增加文本说明项，只录入文本，用于描述指标信息--zsj
          // for (var k = 0; k < page.planData.planVo_Txts.length; k++) {
          //   cbItem != 'ISUPBUDGET'
          //   var textCode = bg.shortLineToTF(page.planData.planVo_Txts[k].eleFieldName)
          //   column.push({
          //     data: textCode,
          //     title: page.planData.planVo_Txts[k].eleName,
          //     className: textCode + ' ' + 'nowrap isprint BGThirtyLen',
          //     headalign: 'center',
          //     align: 'left',
          //     width: 220,
          //     "render": function (data) {
          //       if (!$.isNull(data)) {
          //         return '<span title="' + data + '">' + data + '</span>';
          //       } else {
          //         return '';
          //       }
          //     }
          //   });
          // }
        }
				columns.push({
					data: 'bgItemBalanceCur',
					title: '指标金额',
					className: 'nowrap isprint tr bgItemBalanceCur BGmoneyClass',
					//width: 100,
					render: $.fn.dataTable.render.number(',', '.', 2, '')
				});
				columns.push({
					data: 'isYearInit',
					title: '指标年结状态',
					className: 'nowrap isprint tc BGstatusClass',
					//width: 100,
					"render": function (data) {
						if (!$.isNull(data)) {
							if (data == '0') {
								return '<span>未年结</span>';
							} else if (data == '1') {
								return '<span>已年结</span>';
							}
						} else {
							return '';
						}

					}
				});
				columns.push({
					data: 'mustEndCur',
					title: '新年度已执行',
					className: 'nowrap isprint tr BGmoneyClass mustEndCur',
					//width: 120
				},{
					data: 'carryDownCur',
					title: '结转金额',
					className: 'nowrap isprint tr BGmoneyClass',
					//width: 120
				});
				columns.push({
					data: 'opt',
					title: '操作',
					className: 'nowrap isprint tc',
					width: 40,
					render: function (data, type, rowdata, meta) {
						return '<a class="btn btn-icon-only btn-sm btn-permission icon-trash f16 btn-delete" data-toggle="tooltip" title="删除">';
					}
				});
				oTableCarrry = $("#" + tblId).dataTable({
					"language": {
						"url": bootPath + "agla-trd/datatables/datatable.default.js"
					},
					//"bFilter": true,
					"autoWidth": false,
					"bDestory": true,
					"processing": true, //显示正在加载中
					"ordering": false,
					"scrollY": page.getScrollY(),
					"paging": false,
					columns: columns,
					"columnDefs": [{
							"targets": [0],
							"serchable": false,
							"orderable": false,
							"className": "checktd",
							"render": function (data, type, rowdata, meta) {
								return '<div class="checkdiv">' +
									'</div><label class="mt-checkbox mt-checkbox-single mt-checkbox-outline"> ' +
									'<input type="checkbox" class="checkboxes" data-bgItemId="' + rowdata.bgItemId + '" data-initType="' + rowdata.isYearInit + '" data-bgItemParentid="' + rowdata.bgItemParentid + '"  data-bgItemParentid="' + rowdata.bgItemCode + '" index="' + meta.row + '" />&nbsp; ' +
									'<span></span> ' +
									'</label>';
							}
						},
						{
							"targets": [-2],
							"serchable": false,
							"orderable": false,
							"render": function (data, type, rowdata, meta) {
								//CWYXM-12656 ---项目反馈 指标年结-已年结显示结转金额,未年结显示指标余额--zsj
								if (rowdata.isYearInit == '1') { //已年结显示结转金额
									return '<input class="form-control carryDownCurInput" style="width:100px;text-align:right" type="text" value="' + $.formatMoney(data, 2) + '" >';
								} else if (rowdata.isYearInit == '0') { //未年结显示指标余额
									return '<input class="form-control carryDownCurInput" style="width:100px;text-align:right" type="text" value="' + $.formatMoney(rowdata.bgItemBalanceCur, 2) + '" >';
								}
							}
						}
					],
					//填充表格数据
					data: [],
					"dom": "rt",
					initComplete: function (settings, json) {
						$('.carryDownCurInput').amtInputNull();
						ufma.isShow(reslist);
						//固定表头
						$("#carryOver").fixedTableHead();
					},
					drawCallback: function (settings) {
						$('#carryOver').find("td.dataTables_empty").text("")
							.append('<img src="' + bootPath + 'images/noData.png"/><br/><i>目前还没有你要查询的数据</i>');
						ufma.isShow(reslist);
						ufma.setBarPos($(window));
						var wrapperWidth = $('#carryOver_wrapper').width();
						var tableWidth = $('#carryOver').width();
						if (tableWidth > wrapperWidth) {
							$('#carryOver').closest('.dataTables_wrapper').ufScrollBar({
								hScrollbar: true,
								mousewheel: false
							});
							ufma.setBarPos($(window));
							$('.dataTables_wrapper.no-footer .dataTables_scrollBody').css("border-bottom", "1px solid transparent")
						} else {
							$('#carryOver').closest('.dataTables_wrapper').ufScrollBar('destroy');
							$('.dataTables_wrapper.no-footer .dataTables_scrollBody').css("border-bottom", "1px solid transparent")
						}
					}
				})
				//oTableCarrry = $("#" + tblId).dataTable(opts); //用于存储dataTable返回的信息
			},
      getScrollY: function () {
        var winH = $('.workspace').height();
        var topH = $('.workspace-top').height();
        var planAreaH = $('.planArea').height();
        var barH = $('.btn-bar').height();
        return winH - topH - planAreaH - barH - 50 + 'px'
      },
			//获取更多的辅助项条件
			getPlanItems: function () {
				var items = [];
				$("#budgetQuery tr").find(".bgItemSelectedListDiv").each(function (index, thisDiv) {
					var $div = $(thisDiv);
					var tmpEleCode = $div.attr("eleCode");
					var tmpEleName = $div.attr("eleName");
					var tmpItem = {};
					tmpItem.itemField = tmpEleCode;
					tmpItem.itemName = tmpEleName;
					tmpItem.bgItemCode = $div.attr("bgItemCode");
					tmpItem.itemValue = [];
					$div.find("div.rptCaseDiv").each(function (index, subFlagDiv) {
						var tmpDt = $(subFlagDiv).attr("data");
						tmpItem.itemValue[tmpItem.itemValue.length] = {
							"value": JSON.parse(tmpDt).codeName
						};
					});
					if (tmpItem.itemValue == false) { //修改要素值为空时,传参数需要加上itemNotNull
						tmpItem.itemNotNull = 1;
					}
					items.push(tmpItem);
				});
				return items;
			},
			//获取结转处理表格数据
			showTblData: function () {
				var url = "/bg/api/getBgItms" + "?agencyCode=" + pageData.agencyCode + "&setYear=" + page.setYear;
				ufma.showloading('数据加载中，请耐心等待...');
				var chrId = '';
				// chrId = $('#cbBgPlan').getObj().getValue();
				var argu = {
					"agencyCode": pageData.agencyCode,
					"rgCode": page.rgCode,
					"setYear": page.setYear,
					"items": page.getPlanItems(),
					"chrId": chrId

				}
				ufma.post(url, argu, function (result) {
					ufma.hideloading();
					oTableCarrry.fnClearTable();
					if (!$.isNull(result.data.items) && result.data.items.length > 0) {
						oTableCarrry.fnAddData(result.data.items, true);
					}
				})
			},
			//获取选中的数据
			getCheckedRows: function () {
				var checkedArray = [];
				$("#carryOver .checkboxes:checked").each(function () {
					checkedArray.push($(this).val());
				});
				return checkedArray;
			},
			//选中要处理的指标进行处理--指标年结
			yearInitFun: function () {
				var checkedRow = page.getCheckedRows();
				if (checkedRow.length < 1) {
					ufma.showTip('请选择一条要处理的数据', function () {}, 'warning');
					return false;
				} else {
					var items = [];
					var countNull = 0;
					$('#carryOver_wrapper').find('input.checkboxes:checked').each(function () {
						var rowIndex = $(this).attr('index');
						var bgItemId = '';
						var bgItemParentid = '';
						var bgItemCarryDownCur = '';
						var bgItemCode = '';
						if (rowIndex) {
							bgItemId = oTableCarrry.api(false).row(rowIndex).data().bgItemId;
							bgItemParentid = oTableCarrry.api(false).row(rowIndex).data().bgItemParentid;
							bgItemCode = oTableCarrry.api(false).row(rowIndex).data().bgItemCode;
							bgItemCarryDownCur = $(this).closest('td').siblings().find(".carryDownCurInput").val().replace(/,/g, "");
							if ($.isNull(bgItemCarryDownCur)) {
								countNull = countNull + 1;
							}
						}
						var rowData = {
							"bgItemId": bgItemId,
							"bgItemParentid": bgItemParentid,
							"bgItemCarryDownCur": bgItemCarryDownCur,
							"bgItemCode": bgItemCode
						};
						items.push(rowData);
					});
					if (countNull > 0) {
						ufma.showTip('年结金额不能为空', function () {}, 'warning');
						return false;
					} else {
						var setYear_dest = parseInt(page.setYear) + 1;
						var argu = {
							"agencyCode": pageData.agencyCode,
							"rgCode": page.rgCode,
							"setYear_dest": setYear_dest, //表示结转的年度-默认为当前年的下一年         
							"setYear_src": page.setYear, //当前年度
							"items": items
						}
						dm.doPost('yearInit', argu, function (result) {
							if (result.flag == 'fail') {
								return false;
							} else {
								pageData.tabData = result.data;
								var beforeData = result.data.beforeData;
								//var runData = result.data.runData;
								var afterData = result.data.afterData;
								$('#carryOverArea,#carry-tool-bar').addClass('hide');
								$('#dealArea').removeClass('hide');
								page.initBeforeDeal(beforeData);
								page.progressBar(afterData);
								page.initAfterDeal(afterData);
								page.timeline.next();
								page.clickBtn = 'dataCheckNext';
							}
						});
					}
				}
			},
			//反年结
			yearInitBack: function () {
				var checkedRow = page.getCheckedRows();
				if (checkedRow.length < 1) {
					ufma.showTip('请选择一条要处理的数据', function () {}, 'warning');
					return false;
				} else {
					var items = [];
					var countNull = 0;
					$('#carryOver_wrapper').find('input.checkboxes:checked').each(function () {
						var rowIndex = $(this).attr('index');
						var bgItemId = '';
						var bgItemParentid = '';
						var bgItemCarryDownCur = '';
						var bgItemCode = '';
						var bgInitType = $(this).attr('data-initType');
						if (bgInitType != '0') {
							if (rowIndex) {
								bgItemId = oTableCarrry.api(false).row(rowIndex).data().bgItemId;
								bgItemParentid = oTableCarrry.api(false).row(rowIndex).data().bgItemParentid;
								bgItemCode = oTableCarrry.api(false).row(rowIndex).data().bgItemCode;
								bgItemCarryDownCur = $(this).closest('td').siblings().find(".carryDownCurInput").val().replace(/,/g, "");
								if ($.isNull(bgItemCarryDownCur)) {
									countNull = countNull + 1;
								}
							}
							var rowData = {
								"bgItemId": bgItemId,
								"bgItemParentid": bgItemParentid,
								"bgItemCarryDownCur": bgItemCarryDownCur,
								"bgItemCode": bgItemCode
							};
							items.push(rowData);
							if (items.length == checkedRow.length) {
								page.backFlag = true;
							} else {
								page.backFlag = false;
							}
						} else {
							ufma.showTip('请选择已年结数据进行反年结操作！', function () {}, 'warning');
							page.backFlag = false;
							return false;
						}
					});
					if (page.backFlag == true) {
						if (countNull > 0) {
							ufma.showTip('反年结金额不能为空', function () {}, 'warning');
							return false;
						} else {
							var setYear_dest = parseInt(page.setYear) + 1;
							var argu = {
								"agencyCode": pageData.agencyCode,
								"rgCode": page.rgCode,
								"setyear_dest": setYear_dest, //表示结转的年度-默认为当前年的下一年         
								"setYear": page.setYear, //当前年度
								"items": items
							}
							dm.doPost('yearInitBack', argu, function (result) {
								//反年结成功后不用跳转，只需刷新当前界面即可
								if (result.flag == 'success') {
									ufma.showTip('反年结成功', function () {}, 'success');
									page.initCarryTable();
									page.showTblData();
								} else {
									return false;
								}
							});
						}

					} else {
						ufma.showTip('请选择已年结数据进行反年结操作！', function () {}, 'warning');
						return false;
					}
				}
			},
			initBeforeDeal: function (beforeData) {
				var $curFormBefore = $('#formBefore');
				$curFormBefore.html('');
				for (var i = 0; i < beforeData.length; i++) {
					var $curRowBefore = $('<tr class=""></tr>').appendTo($curFormBefore);
					$curTdBefore = $('<td class="form-group planName">' + beforeData[i][0] + ' : </td><td class="form-group planNum"> ' + beforeData[i][1] + ' 条</td><td class="form-group allMoney">总指标金额  : </td><td class="form-group allMoneyNum"> ' + beforeData[i][2] + '</td><td class="form-group beforeMoney">待结转金额  : </td><td class="form-group beforeMoneyNum"> ' + beforeData[i][3] + '</td>').appendTo($curRowBefore);
				}
			},
			initAfterDeal: function (afterData) {
				var $curForm = $('#formAfter');
				$curForm.html('');
				for (var i = 0; i < afterData.length; i++) {
					var $curRow = $('<tr class="hide trFormAfter"></tr>').appendTo($curForm);
					$curTd = $('<td class="form-group planName">' + afterData[i][0] + ' : </td><td class="form-group planNum"> ' + afterData[i][1] + ' 条</td><td class="form-group allMoney">总指标金额  : </td><td class="form-group allMoneyNum"> ' + afterData[i][2] + '</td><td class="form-group beforeMoney">待结转金额  : </td><td class="form-group beforeMoneyNum"> ' + afterData[i][3] + '</td>').appendTo($curRow);
				}
			},

			progressBar: function (afterData) {
				//初始化js进度条
				$("#bar").css("width", "0px");
				$("#checkbar").css("width", "0px");
				//进度条的速度，越小越快
				var speed = 0.5;
				var i = 0;
				var j = 0;
				var countNum = 0;
				var z = 0;
				var n = 0;
				var m = 0;
				bar = setInterval(function () {
					var nowWidth = 0;
					var barLength = 0;
					var barId = '';

					if (page.clickBtn == 'dataCheckNext') {
						nowWidth = parseInt($("#bar").width());
						barLength = 929;
						barId = 'bar';
						countNum = 9;
					} else if (page.clickBtn == 'beginEnd') {
						nowWidth = parseInt($("#checkbar").width());
						barLength = 600;
						barId = 'checkbar';
						countNum = 6;
					}
					//宽度要不能大于进度条的总宽度
					if (nowWidth <= barLength && i <= 100) {

						setTimeout(j++, 2000)
						if (j == countNum) {
							i++;
							z++;
							j = 0
						}
						if (i > 100) {
							i = 100;
						}

						if (afterData) { //处理数据表格
							barWidth = (nowWidth + 1) + "px";
							$("#" + barId).css("width", barWidth);
							var countTwo = i + 1;
							if (countTwo >= 100) {
								countTwo = 100;
							}

							$('.runContent').html(countTwo + '%');
							if (z == 10) {
								if (n <= afterData.length) {
									$('#formAfter tr.trFormAfter').eq(n).removeClass('hide');
									n++;
									z = 0;
								} else if (n > afterData.length) {
									nowWidth = 929;
								}
							}
						} else if (page.checkTableData) { //数据检查表格
							barWidth = (nowWidth + 2) + "px";
							$("#" + barId).css("width", barWidth);
							var count = (i + 2) * 2;
							if (count >= 100) {
								count = 100;
							}
							$('.content').html(count + '%');
							if (z == 10) {
								if (n <= page.checkTableData.length) {
									m = n;
									if (m < 0) {
										m = 0;
									}
									if (m == 0) {
										setTimeout($('#dataCheck thead tr').eq(m).removeClass('hide'), 5000);
									} else {
										var m = n - 1;
										setTimeout($('#dataCheck tbody tr').eq(m).removeClass('hide'), 5000);
									}
									n++;
									z = 0;

								} else if (n > page.checkTableData.length) {
									nowWidth = 600;
								}
							}

						}
					} else {
						//进度条读满后，停止
						clearInterval(bar);
						if (afterData) {
							if (n < afterData.length) {
								for (var a = n; a < (afterData.length - n); a++) {
									$('#formAfter tr.trFormAfter').eq(a).removeClass('hide');
								}
							}
						}

					}
				}, speed);

			},
			onEventListener: function () {
				//点击开始年结：隐藏onePage
				$('#beginEnd').on('click', function () {
					var arguAge = {
						agencyCode: pageData.agencyCode,
						setYear: page.setYear,
						rgCode: page.rgCode
					}
					// ufma.showloading('数据加载中，请耐心等待...');
					// dm.doGet("dataCheck", arguAge, function (result) {
					// 	ufma.hideloading();
					// 	if (result.flag == 'fail') {
					// 		return false;
					// 	} else {
							$('#onePage').addClass('hide');
							$('#zdzzTimeline').removeClass('hide');
							$('#dataCheckArea').removeClass('hide');
							$('#cbAgency').getObj().setEnabled(false);
							//$('#cbAgency').attr('disabled', true);
							page.clickBtn = 'beginEnd';
							page.progressBar();
							page.initCheckTable();
							page.showRull();
							page.clearTimeLine();
							$('#check-tool-bar').removeClass('hide');
							page.disableFlag = true;
						//}
					// });

				});
				$('#dataCheckAgain').on('click', function () {
					$('#cbAgency').getObj().setEnabled(false);
					page.progressBar();
					page.initCheckTable();
					page.showRull();
				});
				$('#dataCheck').on('click', '.common-jump-link', function (e) { //CWYXM-7656 --指标年结，指标基础资料的年结，统一放到第一步的检查中--zsj
					e.preventDefault();
					var pageTitle = ''; //跳转界面名
					var url = ''; //跳转界面地址
					var bgMenuId = ''; //跳转界面菜单id
					var pageName = "budgetYearAccount"; //当前界面菜单名
					if ($(this).hasClass('btn-multiPost')) {
						pageTitle = '指标编制';
						bgMenuId = '6f7c4687-0463-4d2c-85c1-178e82361811';
						url = '/pf/bg/budgetItemMultiPost/budgetItemMultiPost.html?menuid=' + bgMenuId + '&dataFrom=' + pageName + '&action=query' + '&agencyCode=' + pageData.agencyCode + '&acctCode=*';
					} else if ($(this).hasClass('btn-decompose')) {
						pageTitle = '指标分解';
						bgMenuId = '29051561-5a6a-4872-986e-6c12e5dcc184';
						url = '/pf/bg/budgetItemDecompose/budgetItemDecompose.html?menuid=' + bgMenuId + '&dataFrom=' + pageName + '&action=query' + '&agencyCode=' + pageData.agencyCode + '&acctCode=*';
					} else if ($(this).hasClass('btn-adjust')) {
						pageTitle = '指标调整';
						bgMenuId = '1948fc80-1ee4-41bc-a448-c06443a2b947';
						url = '/pf/bg/budgetItemAdjust/budgetItemAdjust.html?menuid=' + bgMenuId + '&dataFrom=' + pageName + '&action=query' + '&agencyCode=' + pageData.agencyCode + '&acctCode=*';
					} else if ($(this).hasClass('btn-twoSidesAdjust')) {
						pageTitle = '指标调剂';
						bgMenuId = '30ec25c4-e32e-4719-9e9d-fcc17e3f417a';
						url = '/pf/bg/budgetItemTwoSidesAdjust/budgetItemTwoSidesAdjust.html?menuid=' + bgMenuId + '&dataFrom=' + pageName + '&action=query' + '&agencyCode=' + pageData.agencyCode + '&acctCode=*';
					} else if ($(this).hasClass('btn-vou')) {
						pageTitle = '凭证箱';
						bgMenuId = '5444eb79-d926-46f5-ae2b-2daf90ab8bcb';
						url = '/pf/gl/voubox/vouBox.html?menuid=' + bgMenuId + '&dataFrom=' + pageName + '&action=query' + '&agencyCode=' + pageData.agencyCode + '&acctCode=*';
					} else if ($(this).hasClass('btn-maTurn')) {
						pageTitle = '新年度初始化';
						bgMenuId = '51f92863-a38e-4c18-8e2f-aaa3e11c9cd2';
						url = '/pf/ma/annualReview/annualReview.html?menuid=' + bgMenuId + '&dataFrom=' + pageName + '&action=query' + '&agencyCode=' + pageData.agencyCode + '&acctCode=*';
					} else if ($(this).hasClass('btn-income')) { //请款单
						url = '/A/ar/resources/queryBill?type=APPLY_QUERY';
						pageTitle = "请款情况";
						//uf.openNewPage(page.isCrossDomain, $(this), 'openMenu', url, false, pageTitle);
					} else if ($(this).hasClass('btn-commit')) { // 报销单 
						pageTitle = "报销情况";
						url = '/A/ar/resources/queryBill?type=AR_QUERY';
						//uf.openNewPage(page.isCrossDomain, $(this), 'openMenu', url, false, pageTitle);
					} else if ($(this).hasClass('btn-pay')) { //还款单
						pageTitle = "还款情况";
						url = '/A/ar/resources/queryBill?type=REPAY_QUERY';
						//uf.openNewPage(page.isCrossDomain, $(this), 'openMenu', url, false, pageTitle);
					} else if ($(this).hasClass('btn-loan')) { // 借款单
						pageTitle = "借款情况";
						url = '/A/ar/resources/queryBill?type=LOAN_QUERY';
						//uf.openNewPage(page.isCrossDomain, $(this), 'openMenu', url, false, pageTitle);
					}
					/* else if($(this).hasClass('btn-arTurn')) {
											pageTitle = '报销';
											bgMenuId = '';
											url = '/A/ar/resources/myArBillEdit?type=otherModelShow&billId=' + billid;
											window.open(url);
										} */
					else if ($(this).hasClass('btn-upTurn')) {
						pageTitle = '采购';
						bgMenuId = '';
						url = '/pf/pvdf/index.html#/bd/openPage?productCode=UP&type=select&billTabUuid=AC48E39C559542EEA9DD87E802D172CA&billTempletUuid=AEAA449CEF3149FCA033F069EC833C8A&menuid=2511c30a-46aa-4885-808e-5ee0a78bfb45&businessKey=' + id + '&agencyCode=' + pageData.agencyCode + '&acctCode=*';
						window.open(url);
					}
					if (typeof hex_md5 === "function" && ufma.getCommonData().svUserCode != null) {
						if (url.indexOf('?') > 0) {
							url = url + "&rueicode=" + hex_md5(ufma.getCommonData().svUserCode)
						} else {
							url = url + "?rueicode=" + hex_md5(ufma.getCommonData().svUserCode)
						}
					}
					//$(this).attr('data-href', url + '&agencyCode=' + pageData.agencyCode + '&acctCode=*');
					//$(this).attr('data-title', pageTitle);
					//var baseUrl = url 
					//window.parent.openNewMenu($(this));
					uf.openNewPage(page.isCrossDomain, $(this), 'openMenu', url, false, pageTitle);
				});

				//点击检查界面的下一步
				$('#dataCheckNext').on('click', function () {
					$('#cbAgency').getObj().setEnabled(false);
					$('#onePage').addClass('hide');
					if ($('#dataCheck td span').hasClass('needAgain')) {
						ufma.showTip('有未检查通过的数据，请先审核单据', function () {}, 'warning');
						return false;
					} else {
						$('#planData').removeClass('hide');
						$('#dataCheckArea,#check-tool-bar').addClass('hide');
						$('#carryOverArea,#carry-tool-bar').removeClass('hide');
						$('#budgetQuery').css('border-spacing', "0px 0px");
            page.timeline.next();
            page.initCarryTable();
			  				page.showTblData();
						// page.initSearchPnl();
					}

				});
				//点击检查界面的上一步
				$('#dataCheckCancel').on('click', function () {
					$('#onePage').removeClass('hide');
					$('#planData').addClass('hide');
					$('#dataCheckArea,#check-tool-bar').addClass('hide');
					$('#carryOverArea,#carry-tool-bar').addClass('hide');
					$('#dealArea').addClass('hide');
					$('#cbAgency').getObj().setEnabled(true);
					//$('#cbAgency').removeAttr('disabled');
					$('#zdzzTimeline').addClass('hide');
					page.clearTimeLine();
				});
				//点击数据处理界面的年结
				$('#carryOverNext').on('click', function () {
					$('#cbAgency').getObj().setEnabled(false);
					// pageData.bgPlanCode = $('#cbBgPlan').getObj().getValue();
					$('#onePage').addClass('hide');
					//$('#dataCheckArea,#check-tool-bar').addClass('hide');
					page.yearInitFun();
				}); //点击数据处理界面的反年结
				$('#carryOverCancel').on('click', function () {
					$('#cbAgency').getObj().setEnabled(false);
					// pageData.bgPlanCode = $('#cbBgPlan').getObj().getValue();
					$('#onePage').addClass('hide');
					//$('#dataCheckArea,#check-tool-bar').addClass('hide');
					page.yearInitBack();
				});
				//点击数据处理界面的上一步
				$('#carryOverPre').on('click', function () {
					$('#onePage').addClass('hide');
					$('#cbAgency').getObj().setEnabled(false);
					$('#planData').removeClass('hide');
					$('#carryOverArea,#carry-tool-bar').addClass('hide');
					$('#dataCheckArea,#check-tool-bar').removeClass('hide');
					page.timeline.prev();
					page.clickBtn = 'beginEnd';
					page.progressBar();
					page.initCheckTable();
					page.showRull();
					ufma.setBarPos($(window));
				});
				//点击完成
				$('#dealSure').on('click', function () {
					$('#onePage').removeClass('hide');
					$('#planData').addClass('hide');
					$('#dataCheckArea,#check-tool-bar').addClass('hide');
					$('#carryOverArea,#carry-tool-bar').addClass('hide');
					$('#dealArea').addClass('hide');
					$('#cbAgency').getObj().setEnabled(true);
					page.initAgencyStatus();
					//$('#cbAgency').removeAttr('disabled');
					$('#zdzzTimeline').addClass('hide');
					page.disableFlag = false;
					page.clearTimeLine();
				});
				//点击完成界面的取消，跳转到上一界面
				$('#dealCancel').on('click', function () {
					$('#onePage').addClass('hide');
					$('#dealArea').addClass('hide');
					$('#planData').removeClass('hide');
					$('#cbAgency').getObj().setEnabled(false);
					//$('#dataCheckArea,#check-tool-bar').addClass('hide');
					$('#carryOverArea,#carry-tool-bar').removeClass('hide');
					$('#budgetQuery').css('border-spacing', "0px 0px");
					page.timeline.prev();
					// page.initSearchPnl();
				});
				//输入结转金额进行判断：
				$("#carryOver").on('blur', '.carryDownCurInput', function () {
					var minm = $(this).val().replace(/,/g, "");
          var maxm = $(this).closest('td').parent().find('td.bgItemBalanceCur').html().replace(/,/g, "");
          var usem = $(this).closest('td').parent().find('td.mustEndCur').html().replace(/,/g, "");
					//判断起始金额是否大于结束金额
					if (parseFloat(minm) > parseFloat(maxm)) {
						$(this).val('');
						ufma.showTip('结转金额不能大于指标金额！', function (action) {}, 'warning');
						return false;
					} else if (parseFloat(usem) > parseFloat(minm)) {
						$(this).val('');
						ufma.showTip('结转金额不能小于新年度已执行！', function (action) {}, 'warning');
						return false;
					} else if (parseFloat(maxm) < 0) {
						$(this).val('');
						ufma.showTip('不能结转指标余额为负数的指标！', function (action) {}, 'warning');
						return false;
					} else {
						$(this).val($.formatMoneyNull(minm));
					}
				});
				//$("#carryOver").find('.carryDownCurInput').amtInputNull();
				$("#carryOver").on('click', '.btn-delete', function () {
					$(this).parent().closest('tr').remove();
				});
				//展示更多
				$('.btn-more-item').click(function () {
					if ($('.label-more span').text() == '更多') {
						$('.label-more span').text('收起');
						$('#budgetQuery tbody tr.more-item').removeClass('hide');
						$('#searchPlanPnl').css({
							"height": "150px",
							"overflow-y": "scroll"
						});
						$('.btn-bar').css({
							"position": "relative",
							"bottom": "-23px"
						})
						$('#budgetQuery').css('border-spacing', "0px 3px");
					} else {
						$('.label-more span').text('更多');
						$('#searchPlanPnl').css({
							"height": "35px",
							"overflow-y": "hidden"
						});
						$('.btn-bar').css({
							"position": "fixed",
							"bottom": "3px"
						})
						$('#budgetQuery tbody tr.more-item').addClass('hide');
						$('#budgetQuery').css('border-spacing', "0px 0px");
					}
					ufma.setBarPos($(window));
					//bugCWYXM-4357--预算执行情况表，切换更多展开与合并显示时，应不重新加载结果--zsj
					//page.setTable();
				});
				//查询
				$('#btnQry').click(function () {
					page.showTblData();
					ufma.setBarPos($(window));
				});
				//全选			
				$("body").on("click", 'input#check_H', function () {
					var flag = $(this).prop("checked");
					$("#carryOver_wrapper").find('input.checkboxes').prop('checked', flag);
				});
				$("body").on("click", 'input.checkboxes', function () {
					var num = 0;
					var arr = document.querySelectorAll('.checkboxes')
					for (var i = 0; i < arr.length; i++) {
						if (arr[i].checked) {
							num++
						}
					}
					if (num == arr.length) {
						$("#check_H").prop('checked', true)
					} else {
						$("#check_H").prop('checked', false)
					}
				});
				$(".rpt-table-tab").scroll(function () {
					if (!$.isNull($(this).find("thead").offset())) {
						var headTop = $(this).find("thead").offset().top;
						if ($(".rpt-table-tab").scrollTop() >= 0) {
							$(".headFixedDiv").removeClass("hidden");
							$(".headFixedDiv").css({
								"top": "197px"
							}); //,"position": "absolute"
						} else {
							$(".headFixedDiv").addClass("hidden")
						}
					}

				});
			},

			//初始化页面
			initPage: function () {
				this.initAgency();
				$('#agencyText').html('');
				page.timeline = $('#zdzzTimeline').ufmaTimeline([{
					step: '数据检查',
					target: 'zdzj'
				}, {
					step: '结转处理',
					target: 'savemb'
				}, {
					step: '完成',
					target: 'setend'
				}]);

				//page.initQueryTable();
			},
			init: function () {

				//获取session
				reslist = ufma.getPermission();
				ufma.isShow(reslist);
				page.pfData = ufma.getCommonData();
				page.setYear = parseInt(page.pfData.svSetYear);
				page.rgCode = page.pfData.svRgCode;
				page.isCrossDomain = false;
				this.initPage();
				//page.dealJump();
				this.onEventListener();
				ufma.parse();
				ufma.parseScroll();
				window.addEventListener('message', function (e) {
					if (e.data.hasOwnProperty('messageType') && e.data.messageType == 'clientWidth') {
						page.isCrossDomain = true;
					} else {
						page.isCrossDomain = false;
					}
				});
			}
		}
	}();

	page.init();
});