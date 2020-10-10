$(function () {
	var agencyCode = null;
	var pageLength = ufma.dtPageLength('#zbye-data');
	var oTable;
	var menuId = 'b27a9c3a-5477-43ff-b6a4-5a26ba1de10f';
	var iValue = 0;
  dm.moreMsgSetting = {};
  //CWYXM-18080 编制指标时需要增加文本说明项，只录入文本，用于描述指标信息--zsj
  var textCodeArr = []; //存放文本说明项code，方便记忆方案存值
  //ZJGA820-1788--指标登记簿的财政下达指标方案中发文文号没有变为财政指标id，其他模块在执行过脚本后变了--zsj
  var compireMember = []; // 存放记忆列数据
  // CWYXM-18216 已经有记忆列的预算方案重新修改辅助项时(在预算方案里增减辅助项)，界面显示不同步--zsj
  var assiArr = [];
  var compireArr = [];
  var assiEleCode = [];
  //CWYXM-18080 编制指标时需要增加文本说明项，只录入文本，用于描述指标信息--zsj
  var textArr = [];
  var compireTextArr = [];
	var page = function () {
		return {
			agencyCode: '',
			setYear: '',
      planData: '',
      // 用于预算方案对应辅助项、文本项数据处理
      formatPlanData:function(){
        // 此处需要将方案里的要素添加至记忆列里
				if (page.planData && page.planData.planVo_Items.length > 0) {
          for (var i = 0; i < page.setMenberData.length; i++) {
            compireArr.push(page.setMenberData[i].data)
          }
          assiEleCode = [];
					for (var m = 0; m < page.planData.planVo_Items.length; m++) {
            /**ZJGA820-1550 因为指标ID是唯一的，所以指标编制模块需增加一指标ID查询条件。
            * 预算方案中启用了发文文号，指标的所有界面，需要有按发文文号查询的条件框；
            涉及到所有菜单的主界面，分解、调整、调剂的新增弹框类界面；
            指标的所有账表界面；
            */
            if(page.planData.planVo_Items[m].eleCode != 'ISUPBUDGET' && page.planData.planVo_Items[m].eleCode != 'sendDocNum' && page.planData.planVo_Items[m].eleCode != 'bgItemIdMx'){
                var oneAssi = bg.shortLineToTF(page.planData.planVo_Items[m].eleFieldName);
                if ($.inArray(oneAssi,compireArr) == -1  && compireArr.length > 0) {
                  var objAss = {
                    'title': page.planData.planVo_Items[m].eleName,
                    'data': oneAssi,
                    'visible':true,
                    'seq':parseInt(page.setMenberData.length + 1) 
                  }
                  page.setMenberData.push(objAss)
                }
                assiArr.push(oneAssi);
                assiEleCode.push(page.planData.planVo_Items[m].eleCode)
            }
					}
        }
        // 此处需要将方案里的要素添加至记忆列里
        if (page.planData && page.planData.planVo_Txts.length > 0) {
          for (var l = 0; l < page.setMenberData.length; l++) {
            compireTextArr.push(page.setMenberData[l].data)
          }
          textCodeArr = [];
          for (var n = 0; n < page.planData.planVo_Txts.length; n++) {
              var oneText = bg.shortLineToTF(page.planData.planVo_Txts[n].eleFieldName);
              textCodeArr.push(page.planData.planVo_Txts[n].eleFieldName);
              if ($.inArray(oneText,compireTextArr) == -1  && compireTextArr.length > 0) {
                var objAss = {
                  'title': page.planData.planVo_Txts[n].eleName,
                  'data': oneText,
                  'visible':true,
                  'seq':parseInt(page.setMenberData.length + 1) 
                }
                page.setMenberData.push(objAss)
              }
              textArr.push(oneText);
          }
        }
        //ZJGA820-1788--指标登记簿的财政下达指标方案中发文文号没有变为财政指标id，其他模块在执行过脚本后变了--zsj
				if (page.setMenberData && page.setMenberData.length > 0) {
					for (var i = 0; i < page.setMenberData.length; i++) {
            compireMember.push(page.setMenberData[i].data)
            if(page.planData.isSendDocNum != "是" && page.setMenberData[i].data == 'sendDocNum') {
              page.setMenberData.splice(i,1)
            }
            if(page.planData.isFinancialBudget != "1" && page.setMenberData[i].data == 'bgItemIdMx') {
              page.setMenberData.splice(i,1)
            }
          }
        }
        dm.moreMsgSetting.assiEleCode = assiEleCode;
        dm.moreMsgSetting.textCodeArr = textCodeArr;
      },
			getBudgetHead: function (showDetailBg) {
				//ZWCW01036143 、ZWCW01036129：预算执行情况表、指标台账增加记忆列功能--zsj
				var column = [];
				var moneyArr = ['realBgItemCurSelf', 'inTransitCur', 'inTransitCurSelf', 'bgUseCur', 'bgUseCurSelf', 'bgItemCurBudget', 'composeCur', 'adjAndDispenseCur', 'realBgItemCur', 'bgItemBalanceCur', 'bgItemBalanceCurSelf', 'usePercent'];
				if (page.setMenberData && page.setMenberData.length > 0) {
					for (var i = 0; i < page.setMenberData.length; i++) {
						var setData = page.setMenberData[i].data;
						if ($.inArray(setData, moneyArr) > -1) {
							column.push({
								data: setData,
								title: page.setMenberData[i].title,
								// width: 150,
								className: setData + " " + "isprint nowrap tr BGmoneyClass",
								render: $.fn.dataTable.render.number(',', '.', 2, '')
							})
						} else if (setData == "ISUPBUDGET") {
							column.push({
								data: "IS_UP_BUDGET",
								title: "是否采购",
								className: "isprint nowrap tc",
								// width: "120px"
							});
						} else if ($.inArray(setData, assiArr) > -1 && setData != "ISUPBUDGET" && setData != "bgItemIdMx" && setData != "sendDocNum") {
							column.push({
								data: setData,
								title: page.setMenberData[i].title,
								// width: 200,
								className: setData + " " + "isprint nowrap BGThirtyLen",
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
							})
            } else if ($.inArray(setData, textArr) > -1) {
							column.push({
								data: setData,
								title: page.setMenberData[i].title,
								// width: 200,
								className: setData + " " + "isprint nowrap BGThirtyLen",
								"render": function (data) {
                  if (!$.isNull(data)) {
                    return '<span title="' + data + '">' + data + '</span>';
                  } else {
                    return '';
                  }
								}
							})
            } else if ((page.setMenberData[i].data == "sendDocNum" || $.inArray('sendDocNum',compireMember) == -1) && page.planData.isSendDocNum == "是") {//ZJGA820-1788--指标登记簿的财政下达指标方案中发文文号没有变为财政指标id，其他模块在执行过脚本后变了--zsj
              column.push({
                data: "sendDocNum",
                title: page.sendCloName,
                // width: 200,
                className: "sendDocNum isprint nowrap BGThirtyLen",
                "render": function (data) {
                  if (!$.isNull(data)) {
                    return '<span title="' + data + '">' + data + '</span>';
                  } else {
                    return '';
                  }
                }
              })
            } else if ((page.setMenberData[i].data == "bgItemIdMx" || $.inArray('bgItemIdMx',compireMember) == -1) && page.planData.isFinancialBudget == "1") {//ZJGA820-1788--指标登记簿的财政下达指标方案中发文文号没有变为财政指标id，其他模块在执行过脚本后变了--zsj
              column.push({
                data: 'bgItemIdMx',
                title: '财政指标ID',
                className: 'bgItemIdMx isprint nowrap BGThirtyLen',
                // width: 220,
                "render": function (data) {
                  if (!$.isNull(data)) {
                    return '<span title="' + data + '">' + data + '</span>';
                  } else {
                    return '';
                  }
                }
              });
						} else if (page.setMenberData[i].data != "bgItemIdMx" && page.setMenberData[i].data != "sendDocNum"){  //ZJGA820-1788--指标登记簿的财政下达指标方案中发文文号没有变为财政指标id，其他模块在执行过脚本后变了--zsj
							column.push({
								data: setData,
								title: page.setMenberData[i].title,
								// width: 200,
								className: setData + " " + "isprint nowrap BGThirtyLen",
                "render": function (data) {
                  if (!$.isNull(data)) {
                    return '<span title="' + data + '">' + data + '</span>';
                  } else {
                    return '';
                  }
                }
							})
						}
					}
				} else {
					column.push({
						data: 'bgItemCode',
						title: '指标编码',
						headalign: 'center',
						align: 'left',
						className: 'bgItemCode isprint nowrap BGasscodeClass',
						// width: 100,
						"render": function (data, type, rowdata, meta) {
              if (data != "合计") {
							  //CWYXM-10755 --指标预算执行情况表，编码联查到指标台账，应按所选指标带出预算方案--zsj
							  return '<a class="common-jump-link turnData" style="display:block;" href="javascript:;" data-planId="' + rowdata.bgPlanId + '" title="' + data + '">' + data + '</a>';
              } else {
                //CWYXM-10755 --指标预算执行情况表，编码联查到指标台账，应按所选指标带出预算方案--zsj
                return  data;
              }
						}
          },
          // CWYXM-18408--指标年结涉及采购合同报销模块占用的指标结转完善--zsj
          {
           data: 'bgTypeName',
           title: '指标类型',
           className: 'bgTypeName isprint BGTenLen nowrap',
           // width: 220,
           "render": function (data) {
             if (!$.isNull(data)) {
               return '<span title="' + data + '">' + data + '</span>';
             } else {
               return '';
             }
           }
         }, {
						data: 'bgItemSummary',
						title: '摘要',
						headalign: 'center',
						align: 'left',
						className: 'bgItemSummary isprint BGThirtyLen nowrap',
						// width: 200,
						"render": function (data) {
							if (!$.isNull(data)) {
								return '<span title="' + data + '">' + data + '</span>';
							} else {
								return '';
							}
						}
					});
					if (page.planData.isComeDocNum == "是") {
						column.push({
							data: 'comeDocNum',
							title: '来文文号',
							headalign: 'center',
							align: 'left',
							className: 'comeDocNum isprint nowrap BGThirtyLen',
							// width: 200,
							"render": function (data) {
								if (!$.isNull(data)) {
									return '<span title="' + data + '">' + data + '</span>';
								} else {
									return '';
								}
							}
						});
					}
					if (page.planData.isSendDocNum == "是") {
						column.push({
							data: 'sendDocNum',
							title: page.sendCloName,
							headalign: 'center',
							align: 'left',
							className: 'sendDocNum isprint nowrap BGThirtyLen',
							// width: 200,
							"render": function (data) {
								if (!$.isNull(data)) {
									return '<span title="' + data + '">' + data + '</span>';
								} else {
									return '';
								}
							}
						});
					}
				 if (page.planData.isFinancialBudget == "1") {
						column.push({
							data: 'bgItemIdMx',
							title: '财政指标ID',
							headalign: 'center',
							align: 'left',
							className: 'bgItemIdMx isprint nowrap BGThirtyLen',
							// width: 200,
							"render": function (data) {
								if (!$.isNull(data)) {
									return '<span title="' + data + '">' + data + '</span>';
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
							var cbData = '';
							//CWYXM-11697  预算方案中要素选择里，增加是否采购属性，启用之后，编制指标时可选是和否，不能输入其他值，采购模块选择指标时，根据这个属性过滤。--zsj
              /**ZJGA820-1550 因为指标ID是唯一的，所以指标编制模块需增加一指标ID查询条件。
              * 预算方案中启用了发文文号，指标的所有界面，需要有按发文文号查询的条件框；
              涉及到所有菜单的主界面，分解、调整、调剂的新增弹框类界面；
              指标的所有账表界面；
              */  
              if (cbItem != 'ISUPBUDGET' && cbItem != 'sendDocNum' && cbItem != 'bgItemIdMx') {
                cbData = bg.shortLineToTF(item.eleFieldName);
								column.push({
									data: cbData,
									title: item.eleName,
									className: cbData + ' ' + 'nowrap isprint BGThirtyLen',
									// width: 200,
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
							} else if (cbItem == 'ISUPBUDGET'){ //CWYXM-18216 已经有记忆列的预算方案重新修改辅助项时(在预算方案里增减辅助项)，界面显示不同步--解决是否采购重复显示--zsj
								column.push({
									data: 'isUpBudget',
									title: "是否采购",
									className: 'isUpBudget nowrap isprint tc',
									// width: 120
								});
							}
            }
            //CWYXM-18080 编制指标时需要增加文本说明项，只录入文本，用于描述指标信息--zsj
            for (var k = 0; k < page.planData.planVo_Txts.length; k++) {
              var textCode = bg.shortLineToTF(page.planData.planVo_Txts[k].eleFieldName)
              column.push({
                data: textCode,
                title: page.planData.planVo_Txts[k].eleName,
                className: textCode + ' ' + 'nowrap isprint BGThirtyLen',
                "render": function (data) {
                  if (!$.isNull(data)) {
                    return '<span title="' + data + '">' + data + '</span>';
                  } else {
                    return '';
                  }
                }
              });
            }
					}
					/*bugCWYXM-4532--雪蕊姐暂定隐藏预拨金额列--zsj
					 * column.push({
						data: 'bgItemAdvcur',
						title: '预拨金额',
						width: 150,
						className: 'tr nowrap isprint tdNum',
						render: $.fn.dataTable.render.number(',', '.', 2, '')
					});*/
					column.push({
						data: 'bgItemCurBudget',
						title: '预算批复金额',
						// width: 150,
						className: 'bgItemCurBudget tr nowrap isprint tdNum BGmoneyClass',
						render: $.fn.dataTable.render.number(',', '.', 2, '')
					});

					column.push({
						data: 'composeCur',
						title: '分解金额',
						// width: 150,
						className: 'composeCur tr nowrap isprint tdNum BGmoneyClass',
						render: $.fn.dataTable.render.number(',', '.', 2, '')
					});
					column.push({
						data: 'adjAndDispenseCur',
						title: '调整金额',
						// width: 150,
						className: 'adjAndDispenseCur tr nowrap isprint tdNum BGmoneyClass',
						render: $.fn.dataTable.render.number(',', '.', 2, '')
					});
					if (showDetailBg == 1) {
						column.push({
							data: 'realBgItemCur',
							title: '指标金额',
							// width: 150,
							className: 'realBgItemCur tr nowrap isprint tdNum BGmoneyClass',
							render: $.fn.dataTable.render.number(',', '.', 2, '')
						});
					} else {
						column.push({
							data: 'realBgItemCurSelf',
							title: '指标金额',
							// width: 150,
							className: 'realBgItemCurSelf tr nowrap isprint tdNum BGmoneyClass',
							render: $.fn.dataTable.render.number(',', '.', 2, '')
						});
					}
					//ss:增加在途金额金额
					if (showDetailBg == 1) {
						column.push({
							data: 'inTransitCur',
							title: '在途金额',
							// width: 150,
							className: 'inTransitCur tr nowrap isprint BGmoneyClass',
							render: $.fn.dataTable.render.number(',', '.', 2, '')
						});
					} else {
						column.push({
							data: 'inTransitCurSelf',
							title: '在途金额',
							// width: 150,
							className: 'inTransitCurSelf tr nowrap isprint BGmoneyClass',
							render: $.fn.dataTable.render.number(',', '.', 2, '')
						});
					}
					//zsj
					if (showDetailBg == 1) {
						column.push({
							data: 'bgUseCur',
							title: '执行金额',
							// width: 150,
							className: 'bgUseCur tr nowrap isprint BGmoneyClass',
							render: $.fn.dataTable.render.number(',', '.', 2, '')
						});
					} else {
						column.push({
							data: 'bgUseCurSelf',
							title: '执行金额',
							// width: 150,
							className: 'bgUseCurSelf tr nowrap isprint BGmoneyClass',
							render: $.fn.dataTable.render.number(',', '.', 2, '')
						});
					}
					if (showDetailBg == 1) {
						column.push({
							data: 'bgItemBalanceCur',
							title: '指标余额',
							// width: 150,
							className: 'bgItemBalanceCur tr nowrap isprint tdNum BGmoneyClass',
							render: $.fn.dataTable.render.number(',', '.', 2, '')
						});
					} else {
						column.push({
							data: 'bgItemBalanceCurSelf',
							title: '指标余额',
							// width: 150,
							className: 'bgItemBalanceCurSelf tr nowrap isprint tdNum BGmoneyClass',
							render: $.fn.dataTable.render.number(',', '.', 2, '')
						});
					}
					column.push({
						data: 'usePercent',
						title: '执行比例',
						// width: 100,
						className: 'usePercent tr nowrap isprint BGmoneyClass'
					});
					column.push({
						data: 'ctrlDepartment',
						title: '归口部门',
						className: 'ctrlDepartment nowrap isprint BGThirtyLen',
						// width: 200,
						"render": function (data) {
							if (!$.isNull(data)) {
								return '<span title="' + data + '">' + data + '</span>';
							} else {
								return '';
							}
						}
					});
				}

				return column;
			},
			getSearchMap: function (planData) {
				var searchMap = page.getPlanItems();
				searchMap['billType'] = 1;
				searchMap['agencyCode'] = planData.agencyCode;
				searchMap['bgReserve'] = "";
				searchMap['createDateEnd'] = $('#dateStart').getObj().getValue();
				searchMap['setYear'] = planData.setYear;
				searchMap['chrId'] = planData.chrId;
				return searchMap;
			},
			setTable: function () {
				if (oTable) {
					pageLength = ufma.dtPageLength('#zbye-data');
					$('#zbye-data').closest('.dataTables_wrapper').ufScrollBar('destroy');
					oTable.fnDestroy();
				}
				var showDetailBg = 0;
				if ($('#isShowYuSuan').is(':checked')) {
					showDetailBg = 1;
				} else {
					showDetailBg = 0;
				}
				var column = page.getBudgetHead(showDetailBg);
				var tableId = 'zbye-data';
				$("#" + tableId).html(''); //清空原有表格
				oTable = $("#" + tableId).dataTable({
					"language": {
						"url": bootPath + "agla-trd/datatables/datatable.default.js"
					},
					"autoWidth": false,
					"bDestory": true,
					"processing": true, //显示正在加载中
					"pagingType": "full_numbers", //分页样式
					"lengthChange": true, //是否允许用户自定义显示数量p
					"fixedHeader": {
						header: true,
						footer: true
					},
					"lengthMenu": [
						[20, 50, 100, 200, 100000],
						[20, 50, 100, 200, "全部"]
					],
					"pageLength": pageLength,
					"serverSide": false,
					"ordering": false,
					"columns": column,
					//填充表格数据
					data: [],
					"dom": '<"datatable-toolbar"B>rt<"' + tableId + '-paginate"ilp>',
					buttons: [{
							extend: 'print',
							text: '<i class="glyphicon icon-print" aria-hidden="true"></i>',
							exportOptions: {
								modifier: {
									page: 'current'
								}
							},
							customize: function (win) {
								$(win.document.body).find('h1').css("text-align", "center");
								$(win.document.body).css("height", "auto");
							}
						},
						{
							extend: 'excelHtml5',
							text: '<i class="glyphicon icon-upload" aria-hidden="true"></i>',
							exportOptions: {
								modifier: {
									page: 'current'
								}
							},
							customize: function (xlsx) {
								var sheet = xlsx.xl.worksheets['sheet1.xml'];
							}
						}
					],
					initComplete: function (settings, json) {
						$('.datatable-toolbar').appendTo('#dtToolbar');
						var toolBar = $(this).attr('tool-bar')
						var $info = $(toolBar + ' .info');
						if ($info.length == 0) {
							//$('#tableTotalShow').appendTo($(toolBar + ' .tool-bar-body'));
							$info = $('<div class="info"></div>').appendTo($(toolBar + ' .tool-bar-body'));
						}
						$info.html('');
						$('.' + tableId + '-paginate').appendTo($info);
						$("#dtToolbar .buttons-print").css("border-radius", "4px 0 0 4px").addClass("btn-print btn-permission").attr({
							"data-toggle": "tooltip",
							"title": "打印"
						});
						$("#dtToolbar .buttons-excel").css("border-radius", "0 4px 4px 0").addClass("btn-export btn-permission").attr({
							"data-toggle": "tooltip",
							"title": "导出"
						});
						//导出begin
						$("#dtToolbar .buttons-excel").off().on('click', function (evt) {
							evt = evt || window.event;
							evt.preventDefault();
							uf.expTable({
								title: '预算执行情况表',
								exportTable: '#zbye-data'
							});
						});
						//导出end
						$('#dtToolbar [data-toggle="tooltip"]').tooltip();
						/*page.headArr = page.tableHeader('zbye-data');
						page.setVisibleCol();*/
						//ZWCW01036143 、ZWCW01036129：预算执行情况表、指标台账增加记忆列功能--zsj
						page.headArr = [];
						if (page.setShow == true && page.chooseFlag == true) {
							oTable.fnClearTable();
							if (page.tableAllData.length > 0) {
								oTable.fnAddData(page.tableAllData, true);
							}
						} else {
							page.setShowColumn();
						}
						if (page.setMenberData && page.setMenberData.length > 0) {
							page.headArr = page.setMenberData;
							iValue = 0;
						} else {
							page.headArr = page.tableHeader('zbye-data');
							iValue = 0;
						}
						page.setVisibleCol();
            $('#zbye-data').closest('.dataTables_wrapper').ufScrollBar({
              hScrollbar: true,
              mousewheel: false
            });
            ufma.setBarPos($(window));
						ufma.isShow(reslist);
					},
					"drawCallback": function () {
						$('#zbye-data').find("td.dataTables_empty").text("")
							.append('<img src="' + bootPath + 'images/noData.png"/><br/><i>目前还没有你要查询的数据</i>');
						var wrapperWidth = $('#zbye-data_wrapper').width();
						var tableWidth = $('#zbye-data').width();
						if (tableWidth > wrapperWidth) {
							$('.dataTables_wrapper.no-footer .dataTables_scrollBody').css("border-bottom", "1px solid transparent")
						} else {
							$('.dataTables_wrapper.no-footer .dataTables_scrollBody').css("border-bottom", "1px solid transparent")
            }
            //ZJGA820-1579 指标账表每列的宽度增加可拖拽调整宽度的功能--zsj 
            var widthTab = 0;
            $('#zbye-data').tblcolResizable({},function(){
              for(var i=0;i< $("#zbye-data thead").find('th').length;i++){
                widthTab += $("#zbye-data thead").find('th').eq(i).css('width')
              }
            });   
            $("#zbye-data").css('width',widthTab)   
            ufma.isShow(reslist);
            setTimeout(function(){
              $('#tool-bar').css('top',$('.workspace-top').height()+$('.workspace-center').height() + 2 + 'px')
            },100)
					},
					fnCreatedRow: function (nRow, aData, iDataIndex) {
						if (!$.isNull(aData)) {
							if (aData.dataSource == "rptCountRow") {
								$(nRow).css({
									"background-color": "#f0f0f0"
								})
							}
						}
					}
				});
			},
			getTableData: function () {
				if ($.isNull(page.planData)) {
					return false;
				}
				var url = "/bg/report/getBalanceReport" + "?agencyCode=" + page.agencyCode + "&setYear=" + page.setYear;
				//var argu = page.getSearchMap(page.planData);
				var showDetailBg = 0;
				if ($('#isShowYuSuan').is(':checked')) {
					showDetailBg = 1;
				} else {
					showDetailBg = 0;
				}
				var minCur = $(".amt-from").val().replace(/,/g, "");
				var maxCur = $(".amt-to").val().replace(/,/g, "");
				var argu = {
					"agencyCode": page.agencyCode,
					"beginDate": $("#dateStart").getObj().getValue(),
					"lastDate": $("#endData").getObj().getValue(),
					"minCur": minCur,
					"maxCur": maxCur,
					"items": page.getPlanItems(),
					"showType": "1",
					"bgPlanChrId": page.planData.chrId,
					"showDetailBg": showDetailBg,
          "includePermission": 1, //个人版按权限过滤指标
          'bgRuleDeportFrom': page.treeDepType, //CWYXM-18102 指标权限设置需要支持按人员库中的部门人员设置指标权限--zsj
          "isUpBudget": $('#isUpBudget').getObj().getValue() //CWYXM-11697  预算方案中要素选择里，增加是否采购属性，启用之后，编制指标时可选是和否，不能输入其他值，采购模块选择指标时，根据这个属性过滤。--zsj
        };
        //CWYXM-18080 编制指标时需要增加文本说明项，只录入文本，用于描述指标信息--zsj
        for (var k = 0; k < textCodeArr.length; k++) {
          var textCode =  textCodeArr[k]
          argu[textCode] = $('#'+textCode).val()
        }
        /**ZJGA820-1550 因为指标ID是唯一的，所以指标编制模块需增加一指标ID查询条件。
        * 预算方案中启用了发文文号，指标的所有界面，需要有按发文文号查询的条件框；
          涉及到所有菜单的主界面，分解、调整、调剂的新增弹框类界面；
          指标的所有账表界面；
        */                
        if(page.planData.isSendDocNum == "是"){
          argu.sendDocNum = $('#sendDocNum').val()
        }
        if (page.planData.isFinancialBudget == "1") {
          argu.bgItemIdMx = $('#bgItemIdMx').val();
        }
				var data = [];
				//	$.ufajax(url, 'post', argu, callback);
				ufma.post(url, argu, function (result) {
					var newData = [],
						totalMoney = 0.00;
					if (!$.isNull(result.data)) {
						for (var i = 0; i < result.data.items.length; i++) {
							totalMoney += result.data.items[i].bgItemBalanceCur;
							var item = result.data.items[i];
							item.bgItemCurBudget = item.bgReplyCur;
						}
						for (var i = 0; i < result.data.items.length; i++) {
							if (result.data.items[i].status == "3" || result.data.items[i].dataSource == "rptCountRow") { //只显示status == "3"的数据
								var item = result.data.items[i];
								var tmpItem = $.extend({
									'id': item.bgItemId,
									'pId': '0',
									isFooter: 0
								}, item);
								if (parseFloat(tmpItem.usePercent) == 0) {
									tmpItem.usePercent = '';
								}
								newData.push(tmpItem);
							}
						}
					}
					oTable.fnClearTable(); //清空a数据
					if (newData.length != 0) {
            page.setTable()
						oTable.fnAddData(newData);
						page.tableAllData = newData; //ZWCW01036143 、ZWCW01036129：预算执行情况表、指标台账增加记忆列功能--zsj
					}
					//表格模拟滚动条
					$('#zbye-data').closest('.dataTables_wrapper').ufScrollBar({
						hScrollbar: true,
						mousewheel: false
					});
					ufma.setBarPos($(window));
				})
			},
			getModalSelectedResult: function () {
				var sSelectedType = "";
				var sSelectedCtrlPlanId = "";
				var aSelectedItems = [];
				var planData = page.getPlanItems();
				for (var i = 0; i < planData.length; i++) {
					var tmpItem = {
						chrId: '',
						eleCode: planData[i].itemField,
						eleName: planData[i].itemName,
						bgItemCode: planData[i].bgItemCode
					};
					aSelectedItems[aSelectedItems.length] = tmpItem;
				}
				return {
					"selectedType": "1",
					"selectedCtrlPlanId": "",
					"selectedItems": aSelectedItems
				};
			},
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
          if (tmpEleCode == 'sendDocNum' || tmpEleCode == 'bgItemIdMx'  || $.inArray(tmpEleCode,textCodeArr) > -1) {
            tmpItem.itemValue = $('#'+tmpEleCode).val()
          } else if (tmpEleCode == 'ISUPBUDGET') {
            tmpItem.itemValue = $('#'+tmpEleCode).getObj().getValue();
          } else {
					$div.find("div.rptCaseDiv").each(function (index, subFlagDiv) {
						var tmpDt = $(subFlagDiv).attr("data");
						tmpItem.itemValue[tmpItem.itemValue.length] = {
							"value": JSON.parse(tmpDt).codeName
						};
					});
        }
					if (tmpItem.itemValue == false) { //修改要素值为空时,传参数需要加上itemNotNull
						tmpItem.itemNotNull = 1;
					}
					items.push(tmpItem);
				});
				return items;
			},
			initAgency: function () {
				bg.setAgencyCombox($('#cbAgency'), {
					"userCode": page.pfData.svUserCode,
					"userId": page.pfData.svUserId,
					"setYear": page.setYear
				}, function (sender, treeNode) {
					page.agencyCode = treeNode.id;
					dm.showPlan({
						agencyCode: page.agencyCode,
						userId: page.pfData.svUserId, //修改权限  将svUserCode改为 svUserId  20181012
						userName: page.pfData.svUserName,
						rptType: 'budgetItemBalancePersion'
					});
					dm.moreMsgSetting.agencyCode = page.agencyCode;
					//CWYXM-12690--根据系统选项判断发文文号是否必填，若必填则将列名“发文文号”改完指标id--zsj
					var bgUrl = '/bg/sysdata/selectSysRgParaValue?rgCode=' + page.pfData.svRgCode + '&setYear=' + page.setYear + '&agencyCode=' + treeNode.id + '&chrCode=BG003';
					ufma.get(bgUrl, {}, function (result) {
						page.needSendDocNum = result.data;
						if (page.needSendDocNum == true) {
							page.sendCloName = "指标id";
						} else {
							page.sendCloName = "发文文号";
						}
					});
					//page.initSearchPnl();
					//ZWCW01036143 、ZWCW01036129：预算执行情况表、指标台账增加记忆列功能--zsj
					page.reqPnl = true;
					page.selectSessionPlan();
          page.selectSessionData(); //ZWCW01036143 、ZWCW01036129：预算执行情况表、指标台账增加记忆列功能--zsj
          page.getSysFlag();//CWYXM-18102 指标权限设置需要支持按人员库中的部门人员设置指标权限--zsj
					//80827 【财务云8.0 鄂尔多斯 】20190630所有页面，单位或账套选择变化后，再打开其它页面时，自动显示为最近一次选择的单位或账套。--zsj
					//缓存单位
					var params = {
						selAgecncyCode: treeNode.id,
						selAgecncyName: treeNode.name
					}
					ufma.setSelectedVar(params);
				});
      },
      //CWYXM-18102 指标权限设置需要支持按人员库中的部门人员设置指标权限--zsj
      getSysFlag: function(){
        var bgUrl = '/bg/sysdata/selectSysRgParaValue?rgCode=' + page.pfData.svRgCode + '&setYear=' + page.setYear + '&agencyCode=' + page.agencyCode + '&chrCode=BG005';
        ufma.ajaxDef(bgUrl,'get',{},function(result){
          page.treeDepType = result.data
        })
      },
			//ZWCW01036143 、ZWCW01036129：预算执行情况表、指标台账增加记忆列功能--zsj
			//用于请求记忆列
			selectSessionData: function () {
				var argu = {
					agencyCode: page.agencyCode,
					acctCode: '*',
					menuId: menuId
				}
				ufma.get('/bg/pub/menuConfig/select', argu, function (result) {
					page.sessionPlanData = result.data;
					if (page.reqPnl == true) {
						page.initSearchPnl();
					} else {
						var cbBgPlanId = $('#cbBgPlan').getObj().getValue();
						var cbBgPlanText = $('#cbBgPlan').getObj().getText();
						var figValue = cbBgPlanId + ',' + cbBgPlanText;
						if (!$.isEmptyObject(page.sessionPlanData) && !$.isNull(page.sessionPlanData[figValue])) {
							var useData = page.sessionPlanData[figValue]
							page.setMenberData = eval("(" + useData + ")");
						} else {
							page.setMenberData = [];
						}
						page.setShowColumn();
					}
				});
			},
			//ZWCW01036143 、ZWCW01036129：预算执行情况表、指标台账增加记忆列功能--zsj
			//用于请求记忆列
			updateSessionTable: function () {
				var argu = {
					acctCode: "*",
					agencyCode: page.agencyCode,
					configKey: page.configKey,
					configValue: page.configValue,
					menuId: menuId
				}

				ufma.post('/bg/pub/menuConfig/update', argu, function (reslut) {
					page.reqPnl = false;
					page.selectSessionData();
				});
			},
			//ZWCW01036143 、ZWCW01036129：预算执行情况表、指标台账增加记忆列功能--zsj
			setShowColumn: function () {
				if (page.setMenberData && page.setMenberData.length > 0) {
					if (page.chooseFlag == true) {
						page.setShow = true;
						page.setTable();
						oTable.fnClearTable();
						if (page.tableAllData.length > 0) {
							oTable.fnAddData(page.tableAllData, true);
						}
					}
					setTimeout(function () {
						for (var i = 0; i < page.changeCol.length; i++) {
							if (page.changeCol[i].title == page.setMenberData[i].title) {
								page.changeCol[i].visible = page.setMenberData[i].visible;
								var seq = page.setMenberData[i].seq;
								if (page.setMenberData[i].visible == true) {
									oTable.api(true).column(i).visible(true);
								} else {
									oTable.api(true).column(i).visible(false);
								}
							}
						}
						ufma.hideloading();
					}, 100)
				}
			},
			//ZWCW01036143 、ZWCW01036129：预算执行情况表、指标台账增加记忆列功能--zsj
			//用于请求记忆方案
			selectSessionPlan: function () {
				var argu = {
					agencyCode: page.agencyCode,
					acctCode: '*',
					menuId: menuId
				}
				ufma.get('/pub/user/menu/config/select', argu, function (result) {
					page.sessionPlan = result.data;
					if (page.reqPnl == true) {
						page.initSearchPnl();
					}
					//page.initSearchPnl(); 
				});
			},
			//ZWCW01036143 、ZWCW01036129：预算执行情况表、指标台账增加记忆列功能--zsj
			//用于请求记忆方案
			updateSessionPlan: function () {
				var argu = {
					acctCode: "*",
					agencyCode: page.agencyCode,
					configKey: page.configKeyPlan,
					configValue: page.configValuePlan,
					menuId: menuId
				}

				ufma.post('/pub/user/menu/config/update', argu, function (reslut) {
					/*page.reqPnl = false;
					page.selectSessionPlan();*/
				});
			},

			initSearchPnl: function () {
				var showDetailBg = 0;
				if ($('#isShowYuSuan').is(':checked')) {
					showDetailBg = 1;
				} else {
					showDetailBg = 0;
				}
				uf.cacheDataRun({
					element: $('#cbBgPlan'),
					cacheId: page.agencyCode + '_plan_items',
					url: bg.getUrl('bgPlan') + "?ajax=1",
					param: {
						'agencyCode': page.agencyCode,
						'setYear': page.setYear,
						"fromMenu": "balReport",
						"showDetailBg": showDetailBg
					},
					callback: function (element, data) {
						element.ufCombox({ //初始化
							data: data, //列表数据
							readonly: true, //可选
							placeholder: "请选择预算方案",
							onChange: function (sender, data) {
								page.planData = data;
								page.setMenberData = [];
								if (data.planVo_Items.length > 0) {
									$('.fzxName').removeClass('hide');
								} else {
									$('.fzxName').addClass('hide');
								}
                var codeList = [];
                var codeArr = [];
                // CWYXM-18216 已经有记忆列的预算方案重新修改辅助项时(在预算方案里增减辅助项)，界面显示不同步--zsj
                // 方案要素去重
                var obj = {};
                for(var i =0; i < data.planVo_Items.length; i++){
                  var code = data.planVo_Items[i].eleCode;
                  if (code != 'sendDocNum' && code != 'bgItemIdMx'){
                    if(!obj[code]){
                      codeArr.push(data.planVo_Items[i]);
                      obj[code] = true;
                      codeList.push(code);
                    }
                  }
                }
								// for (var z = 0; z < data.planVo_Items.length; z++) {
								// 	var code = data.planVo_Items[z].eleCode;
                //   if (code != 'sendDocNum' && code != 'bgItemIdMx'){
                //       codeArr.push(data.planVo_Items[z]);
                //   }
                //   codeList.push(code);
								// }
								if ($.inArray('ISUPBUDGET', codeList) > -1) {
									$('.isUpBudgetClass').removeClass('hide');
								} else {
									$('.isUpBudgetClass').addClass('hide');
                }
                /**ZJGA820-1550 因为指标ID是唯一的，所以指标编制模块需增加一指标ID查询条件。
                 * 预算方案中启用了发文文号，指标的所有界面，需要有按发文文号查询的条件框；
                   涉及到所有菜单的主界面，分解、调整、调剂的新增弹框类界面；
                    指标的所有账表界面；
                  */
                if(page.planData.isSendDocNum == "是"){
                    var isSendDocNumObj = {
                        eleCode:"sendDocNum",
                        eleName:page.sendCloName,
                        bgItemCode:"sendDocNum"
                    }
                    codeArr.splice(0, 0, isSendDocNumObj);
                    dm.moreMsgSetting.sendDocNum = '';
                }
                //ZJGA820-1550 因为指标ID是唯一的，所以指标编制模块需增加一指标ID查询条件--zsj
                if(page.planData.isFinancialBudget == "1"){
                    var isSendDocNumObj = {
                      eleCode:"bgItemIdMx",
                      eleName:'财政指标ID',
                      bgItemCode:"bgItemIdMx"
                    }
                  codeArr.splice(0, 0, isSendDocNumObj);
                  dm.moreMsgSetting.bgItemIdMx = '';
                }
                page.planData.planVo_Items = codeArr;
                page.formatPlanData();
								bg.initBgPlanItemPnl1($('#searchPlanPnl'), page.planData);
								dm.moreMsgSetting.needSetPlan = page.getPlanItems();
								var rst = page.getModalSelectedResult();
								dm.moreMsgSetting.contentObj = $.extend({}, rst);
								_bgPub_PNL_ReportFind("budgetItemBalancePersion", dm.moreMsgSetting);
								if ($('#showTrue').attr('checked') == true) {
									page.showTrue = true;
								} else if ($('#showFalse').attr('checked') == true) {
									page.showTrue = false;
								}
								//bugCWYXM-10166--新增需求记忆预算方案--更新记忆数据--zsj
								page.configKeyPlan = '';
								page.configValuePlan = '';
								page.configKeyPlan = 'cbBgPlan';
								var cbBgPlanId = $('#cbBgPlan').getObj().getValue();
								var cbBgPlanText = $('#cbBgPlan').getObj().getText();
								page.configValuePlan = cbBgPlanId + ',' + cbBgPlanText;
								//CWYXM-10166--指标编制、指标控制管理界面记忆预算方案--修改为切换预算方案就记忆，弹窗不记忆
								//请求记忆方案
								page.updateSessionPlan();
								var figValue = cbBgPlanId + ',' + cbBgPlanText;
								//CWYXM-10625 --指标管理，查询不同预算方案，重新保存格式后，列表数据显示错误--zsj
								page.chooseFlag = false;
								page.tableAllData = [];
								//CWYXM-10173--zsj--指标控制管理界面，可以设置表格区哪些列可以展示，哪些列不展示，同时实现列排序和记忆功能
								if (!$.isEmptyObject(page.sessionPlanData) && !$.isNull(page.sessionPlanData[figValue])) {
									var useData = page.sessionPlanData[figValue]
									page.setMenberData = eval("(" + useData + ")");
								} else {
									page.setMenberData = [];
								}
								page.setTable();
								page.getTableData();
								// ufma.showloading("正在加载报表数据, 请稍后...");
							},
							onComplete: function () {
								// ufma.hideloading();
								if (!$.isEmptyObject(page.sessionPlan) && !$.isNull(page.sessionPlan.cbBgPlan)) {
									var planData = page.sessionPlan.cbBgPlan.split(",");
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
									element.getObj().val('111');
								}
							}
						});
					}
				});
			},
			//ZWCW01036143 、ZWCW01036129：预算执行情况表、指标台账增加记忆列功能--zsj
			setAssistGroupControl: function () {
				if ($('#colListTable thead tr th.btnGroup').length == 0) {
					$('#colListTable thead tr').append('<th class="nowrap btnGroup hide" style="width:50px;min-width:50px;text-align:center;">操作</th>');
				}
				$('#colListTable tbody tr').each(function () {
					var $tr = $(this);
					if ($tr.find('td.btnGroup').length == 0) {
						$tr.append('<td class="nowrap btnGroup">' +
							'<a class="btn btn-icon-only btn-sm btnDrag" data-toggle="tooltip" title="拖动排序"><span class="glyphicon icon-drag"></span></a>' +
							'</td>');
						$tr.find('td.btnGroup .btn[data-toggle="tooltip"]').tooltip();
					}
				});
			},
			//ZWCW01036143 、ZWCW01036129：预算执行情况表、指标台账增加记忆列功能--zsj
			adjAssitNo: function () {
				var idx = 0;
				$('#colListTable tbody tr').each(function () {
					idx = idx + 1;
					$(this).find('.recNoTd').html(idx);
					$(this).find('.recNoTd').attr('title', idx);
				});
			},
			//ZWCW01036143 、ZWCW01036129：预算执行情况表、指标台账增加记忆列功能--zsj
			tableHeader: function (tblId) {
				var columns = oTable.fnSettings().aoColumns;
				var visible = oTable.api(true).columns().visible(); //每列元素的隐藏/显示属性组
				var arr = []; //存储当前表格的表头信息
				for (var i = 0; i < visible.length; i++) {
					var obj = {};
					obj.title = columns[i].sTitle; //列名
					obj.index = i; //列的索引
					obj.data = columns[i].sClass.split(' ')[0];
					obj.visible = visible[i]; //列的隐藏/显示属性
					arr.push(obj);
				}
				return arr;
			},
			//ZWCW01036143 、ZWCW01036129：预算执行情况表、指标台账增加记忆列功能--zsj
			setVisibleCol: function () {
				$('#colListTable').html('');
				var nowHead = page.headArr;
				var changeHead = [];
				var html = "";
				var $table = $('#colListTable');
				var recNo = 0;
        var head = '<thead><tr>'+
        '<th style="width: 30px;min-width: 30px;" class="hide">序号</th>'+
        '<th style="width: 30px;min-width: 30px;" class="hide">'+
          '<label class="mt-checkbox mt-checkbox-outline margin-right-8">'+
            '<input class="checkAll" type="checkbox" name="" id="">'+
            '<span></span>'+
          '</label>'+
        '</th>'+
        '<th style="width: 50px;min-width: 50px;" class="hide">列名</th>'+
        '</tr></thead><tbody>';
        $(head).appendTo($table);
				for (var i = iValue; i < nowHead.length; i++) {
					changeHead.push(nowHead[i]);
					//新增时，自动往后加
					recNo = i;
					var row = '<tr>' +
						'<td class="recNoTd hide" title="' + recNo + '">' + recNo +
						'</td>' +
						'<td class="checkLab">' +
						'<label class="mt-checkbox mt-checkbox-outline margin-right-8">' +
						' <input type="checkbox"> ' +
						' <span style="margin-top: 6px;"></span>' +
						' </label>' +
						'</td>' +
						'<td class="treeClick commonShowPan" columnData="' + nowHead[i].data + '" title="' + nowHead[i].title + '">' + nowHead[i].title +
						'</td>' +
						'</tr>';
           $(row).appendTo($table);
					page.setAssistGroupControl();
        }
        var body = '</tbody>';
        $(body).appendTo($table);
				$("#colList").html($table);
				page.changeCol = changeHead;
			},

			initPage: function () {
				//$('#dateStart').ufDatepicker('update', page.pfData.svTransDate.substr(0, 8) + "01");
				var mydate = new Date(page.pfData.svTransDate);
				var Year = mydate.getFullYear();
				$('#dateStart').getObj().setValue(Year + '-01-01');
				$('#endData').ufDatepicker('update', page.pfData.svTransDate);
				$('.amt-from,.amt-to').amtInputNull();
				page.initAgency();
				$.fn.dataTable.ext.errMode = 'none';
			},
			onEventListener: function () {
				ufma.searchHideShow($('#zbye-data'));
				$('#btnQry').click(function () {
					//CWYXM-4532--增加金额比较--zsj
					var minm = $('.amt-from').val().replace(/,/g, "");
					var maxm = $('.amt-to').val().replace(/,/g, "");
					//判断起始金额是否大于结束金额
					if (minm !== '' || minm !== null) {
						if (maxm !== '' || maxm !== null) {
							if (parseFloat(minm) > parseFloat(maxm)) {
								ufma.showTip('起始金额大于结束金额！', function (action) {}, 'warning');
								$('.amt-from').val("");
								$('.amt-to').val("");
								return false;
							}
						}
					}
					//page.setTable();
					page.getTableData();
				});
				//显示/隐藏列隐藏框--CWYXM-10173---可以设置表格区哪些列可以展示，哪些列不展示，同时实现列排序和记忆功能--zsj
				$("#colAction").on("click", function () {
					//if(page.chooseFlag == false) {
					page.setVisibleCol();
					var trLeng = $("#colListTable tbody tr").find('td.checkLab input').length;
					$("#colListTable tbody tr").find('td.checkLab input').each(function (i) {
						if (i < trLeng) {
							$(this).prop("checked", page.changeCol[i].visible);
						}
					});
					$("div.rpt-funnelBox").hide();
					$(this).next("div.rpt-funnelBox").show();
				});

				//确认添加列--CWYXM-10173---可以设置表格区哪些列可以展示，哪些列不展示，同时实现列排序和记忆功能--zsj
				$("#addCol").on("click", function () {
					page.chooseFlag = true;
					page.configKey = '';
					page.configValue = '';
					var conValue = [];
					var cbBgPlanId = $('#cbBgPlan').getObj().getValue();
					var cbBgPlanText = $('#cbBgPlan').getObj().getText();
					page.configKey = cbBgPlanId + ',' + cbBgPlanText;
					$("#colListTable tbody tr").each(function (i) {
						var tdSort = {};
						tdSort.title = $(this).closest('tr').find("td.treeClick").attr('title');
						tdSort.data = $(this).closest('tr').find("td.treeClick").attr('columnData');
						tdSort.seq = $(this).closest('tr').find("td.recNoTd").attr('title');
						if ($(this).find("td.checkLab input").is(":checked")) {
							tdSort.visible = true;
						} else {
							tdSort.visible = false;
						}
						conValue.push(tdSort);
					});
					var str = JSON.stringify(conValue);
					var newStr = str.replace(/\"/g, "'");
					page.configValue = newStr;
					ufma.showloading('数据加载中 ，请耐心等待...');
					page.updateSessionTable();
				});
				//鼠标移入移除时显示及隐藏--CWYXM-10173---可以设置表格区哪些列可以展示，哪些列不展示，同时实现列排序和记忆功能--zsj
				$(document).on("mouseenter", "div.rpt-funnelBox", function () {
					$(this).show();
					$("#colListTable tr").find('td.btnGroup .btnDrag').on('mousedown', function (e) {
						$(this).closest('tr').addClass('selectTr').siblings().removeClass('selectTr');
						//拖动时选中当前数据，并且拖动操作时滚动条跟随
						var callBack = function () {
							page.adjAssitNo();
						}
						$('#colListTable').mangerTableSort(callBack);
					});
				}).on("mouseleave", "div.rpt-funnelBox", function () {
					$(this).hide();
				});

				//鼠标移入移除时显示及隐藏
				$(document).on("mouseenter", "div.rpt-funnelBox", function () {
					$(this).show();
				}).on("mouseleave", "div.rpt-funnelBox", function () {
					$(this).hide();
				});

				$('.btn-more-item').click(function () {
					if ($('.label-more div').text() == '更多') {
						$('.label-more div').text('收起');
						$('.showYs').css('width', "251px");
						if ($('.isUpBudgetClass').hasClass('hide')) {
							$('.showYsCheck').css("right", "0px");
						} else {
							$('.showYsCheck').css("right", "64px");
						}
					} else {
						$('.label-more div').text('更多');
						$('.showYs').css('width', "184px");
						if ($('.isUpBudgetClass').hasClass('hide')) {
							$('.showYsCheck').css("right", "2px");
						} else {
							$('.showYsCheck').css("right", "-1px");
						}
					}
					ufma.setBarPos($(window));
					//bugCWYXM-4357--预算执行情况表，切换更多展开与合并显示时，应不重新加载结果--zsj
					//page.setTable();
				});
				//bug75659--【财务云8.0 农业部】需要选项控制，项目、支出功能分类等可以隐藏编码，只显示名称--zsj
				$('#showTrue').on('click', function () {
					page.showTrue = true;
					//page.setTable();
					page.getTableData();
				});
				//bug75659--【财务云8.0 农业部】需要选项控制，项目、支出功能分类等可以隐藏编码，只显示名称--zsj
				$('#showFalse').on('click', function () {
					page.showTrue = false;
					//page.setTable();
					page.getTableData();
				});
				//切换样式
				$('#btnSwitch').ufTooltip({
					className: 'p0',
					trigger: 'click', //click|hover
					opacity: 1,
					confirm: false,
					gravity: 'north', //north|south|west|east
					content: "#rptTableList"
				});
				$('#zbye-data').on('click', '.common-jump-link', function (e) {
					e.preventDefault();
					page.bgItemCode = [];
					page.bgItemCode = $(e.target).attr('title');
					page.useTurnArgu = {
						"agencyCode": page.agencyCode,
						"beginDate": $("#dateStart").getObj().getValue(),
						"lastDate": $("#endData").getObj().getValue(),
						"items": page.getPlanItems(),
						"bgPlanChrId": $(e.target).attr('data-planId'), //CWYXM-10755 --指标预算执行情况表，编码联查到指标台账，应按所选指标带出预算方案--zsj
						//"bgPlanChrName": $('#cbBgPlan').getObj().getText(),
						"bgItemCode": page.bgItemCode
					}
					/*动态增加缓存
					 * ufma.removeCache("Dataname");//删除缓存
            ufma.setObjectCache("Dataname", cacheData);//增加缓存
            Dataname：名称
            cacheData：要缓存的数据
            获取可以直接用JSON.parse(window.sessionStorage.getItem("dataname"));
					 */
					ufma.removeCache("balanceTurnDetailQueryPersion"); //删除缓存
					ufma.setObjectCache("balanceTurnDetailQueryPersion", page.useTurnArgu);
					var bgMenuId = '0750bcb9-6845-4777-9221-80137052683e'; //台账个人版id
					var pageTile = "budgetItemBalancePersion";
					if (page.bgItemCode) {
						var url = '/pf/bg/budgetItemDetailQueryPersion/budgetItemDetailQueryPersion.html?menuid=' + bgMenuId + '&dataFrom=' + pageTile + '&action=query';
						if (typeof hex_md5 === "function" && ufma.getCommonData().svUserCode != null) {
							if (url.indexOf('?') > 0) {
								url = url + "&rueicode=" + hex_md5(ufma.getCommonData().svUserCode)
							} else {
								url = url + "?rueicode=" + hex_md5(ufma.getCommonData().svUserCode)
							}
						}
						var baseUrl = url + '&bgItemCode=' + page.bgItemCode + '&agencyCode=' + page.agencyCode + '&acctCode=*';
						//window.parent.openNewMenu($(this));
						uf.openNewPage(page.isCrossDomain, $(this), 'openMenu', baseUrl, false, "指标台账个人版");//CWYXM-18838 ---指标预算执行情况表个人版点击指标编码跳转到了指标台账而不是指标台账个人版,具体见截图--zsj
					}

				});
				$('#showMethodTip').click(function () {
					if ($("#rptPlanList").find('li').length == 0) {
						$("#rptPlanList ul").append('<li class="tc">无可用方案</li>');
					};
				});
				$('#showMethodTip').ufTooltip({
					className: 'p0',
					trigger: 'click', //click|hover
					opacity: 1,
					confirm: false,
					gravity: 'north', //north|south|west|east
					content: "#rptPlanList"
				});
			},
			//此方法必须保留
			init: function () {
				reslist = ufma.getPermission();
				ufma.isShow(reslist);
				page.pfData = ufma.getCommonData();
				page.agencyCode = page.pfData.svAgencyCode;
				page.setYear = parseInt(page.pfData.svSetYear);
				page.chooseFlag = false;
				page.setShow = false;
				page.isCrossDomain = false;
				ufma.parse();
				uf.parse();
				ufma.parseScroll();
				this.initPage();
				this.setTable();
				this.onEventListener();
				window.addEventListener('message', function (e) {
					if (e.data.hasOwnProperty('messageType') && e.data.messageType == 'clientWidth') {
						page.isCrossDomain = true;
					} else {
						page.isCrossDomain = false;
					}
				});
				dm.moreMsgSetting = {
					"agencyCode": page.pfData.svAgencyCode,
					"userId": page.pfData.svUserId, //  将svUserCode改为 svUserId  20181012
					"userName": page.pfData.svUserName,
					"rptType": 'budgetItemBalancePersion',
					'rebuild': true,
          "needSetPlan": [],
          'textCodeArr': [],
          'assiEleCode': [],
          'bgItemIdMx': '',
          'sendDocNum': ''
				};
			}
		}
	}();
	page.init();
});
