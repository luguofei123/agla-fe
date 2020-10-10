$(function() {
	dm.moreMsgSetting = {};
	var oTable = null;

	var page = function() {
		var ptData = {};
		return {
			agencyCode: '',
			changeClols: [],

			getPlanItems: function() {
				var items = [];
				$("#_reportFindMore_findTable_bgMoreMsgPnl-bgPerformanceReport tr").find(".bgItemSelectedListDiv").each(function(index, thisDiv) {
					var $div = $(thisDiv);
					var tmpEleCode = $div.attr("eleCode");
					var tmpEleName = $div.attr("eleName");
					var tmpItem = {};
					tmpItem.itemField = tmpEleCode;
					tmpItem.itemName = tmpEleName;
					tmpItem.bgItemCode = $div.attr("bgItemCode");
					tmpItem.itemValue = [];
					$div.find("div.rptCaseDiv").each(function(index, subFlagDiv) {
						var tmpDt = $(subFlagDiv).attr("data");
						tmpItem.itemValue[tmpItem.itemValue.length] = {
							"value": JSON.parse(tmpDt).codeName
						};
					});
					if(tmpItem.itemValue == false) { //修改要素值为空时,传参数需要加上itemNotNull
						tmpItem.itemNotNull = 1;
					}
					items.push(tmpItem);
				});
				if(items.length > 0) {
					$('.fzxName').removeClass('hide');
				} else {
					$('.fzxName').addClass('hide');
				}
				if($('#showTrue').attr('checked') == true) {
					page.showTrue = true;
				} else if($('#showFalse').attr('checked') == true) {
					page.showTrue = false;
				}
				return items;
			},
			initGrid: function() {
				if(oTable) {
					$('#reportTable_wrapper').ufScrollBar('destroy');
					oTable.fnDestroy();
					$('#reportTable').html('');
				}
				var tblCols = [{
					data: "rowno",
					title: "序号",
					className: "bgPubTableRowNumCol no-print nowrap",
					width: "50px",
					"render": function(data) {
						return '<span title="' + data + '">' + data + '</span>'
					}
				}];
				var planItems = page.getPlanItems();
				//循环添加预算方案的要素信息
				for(var index = 0; index < planItems.length; index++) {
					var tmpItem = planItems[index];
					if(tmpItem.itemName == "是否采购") {
						tblCols.push({
							data: "isUpBudget",
							title: "是否采购",
							className: "isprint nowrap tc",
							// width: '120px'
						});
					} else {
						tblCols.push({
							data: _BgPub_getEleDataFieldNameByCode(tmpItem.itemField, tmpItem.bgItemCode),
							title: tmpItem.itemName,
							className: "isprint BGThirtyLen nowrap",
							//width: '200px',
							"render": function(data, type, rowdata, meta) {
								if((rowdata.dataSource == "rptCountRow") && (meta.col == "1")) { //合计列
									return '<span title="合计">合计</span>'
								} else {
									//bug75659--需要选项控制，项目、支出功能分类等可以隐藏编码，只显示名称--zsj
									if(!$.isNull(data)) {
										var showData = [];
										if(page.showTrue == false) {
											showData = data.split(' ');
											return '<code title="' + showData[1] + '">' + showData[1] + '</code>';
										} else {
											return '<code title="' + data + '">' + data + '</code>';
										}
									} else {
										return '';
									}
								}
							}
						});
					}

				}
				if($('#isShowYuSuan').is(':checked') && (page.changeClols.length > 0)) {
					for(var num = 0; num < page.changeClols.length; num++) {
						if(page.changeClols[num].eleName != "是否采购") {
							tblCols.push({
								data: _BgPub_getEleDataFieldNameByCode(page.changeClols[num].eleCode, page.changeClols[num].bgItemCode),
								title: page.changeClols[num].eleName,
								className: "isprint BGThirtyLen nowrap",
								//width: '200px',
								"render": function(data) {
									//bug75659--需要选项控制，项目、支出功能分类等可以隐藏编码，只显示名称--zsj
									if(!$.isNull(data)) {
										var showData = [];
										if(page.showTrue == false) {
											showData = data.split(' ');
											return '<code title="' + showData[1] + '">' + showData[1] + '</code>';
										} else {
											return '';
										}
									} else {
										return '';
									}
								}
							});
						} else {
							tblCols.push({
								data: "isUpBudget",
								title: "是否采购",
								className: "isprint nowrap tc",
								// width: '120px'
							});
						}

					}
				}

				tblCols.push({
					data: "realBgItemCurShow",
					title: "金额",
					className: "isprint tdNum nowrap tr BGmoneyClass",
					//width: "270px",
					render: $.fn.dataTable.render.number(',', '.', 2, '')
				});
				tblCols.push({
					data: "inTransitCurShow",
					title: "在途金额",
					className: "isprint tdNum nowrap tr BGmoneyClass",
					//width: "240px",
					render: $.fn.dataTable.render.number(',', '.', 2, '')
				});
				tblCols.push({
					data: "bgUseCurShow",
					title: "执行金额",
					className: "isprint tdNum nowrap tr BGmoneyClass",
					//width: "240px",
					render: $.fn.dataTable.render.number(',', '.', 2, '')
				});
				tblCols.push({
					data: "bgItemBalanceShow",
					title: "指标余额",
					className: "isprint tdNum nowrap tr BGmoneyClass",
					//width: "240px",
					render: $.fn.dataTable.render.number(',', '.', 2, '')
				});
				tblCols.push({
					data: "perC",
					title: "执行比例",
					className: "isprint nowrap tr",
					//width: "240px"
				});
				var colDefs = [],
					tblId = 'reportTable';

				oTable = $("#reportTable").dataTable({
					"language": {
						"url": bootPath + "agla-trd/datatables/datatable.default.js"
					},
					"bFilter": true,
					"bAutoWidth": false,
					"bDestory": true,
					"processing": true, //显示正在加载中
					"pagingType": "full_numbers", //分页样式
					"lengthChange": true, //是否允许用户自定义显示数量p
					"lengthMenu": [
						[10, 20, 50, 100, 200, -1],
						[10, 20, 50, 100, 200, "全部"]
					],
					"pageLength": 100,
					"serverSide": false,
					"ordering": false,
					columns: tblCols,
					data: [],
					"dom": '<"datatable-toolbar"B>rt<"' + tblId + '-paginate"ilp>',
					buttons: [{
							extend: 'print',
							text: '<i class="glyphicon icon-print" aria-hidden="true"></i>',
							exportOptions: {
								columns: '.isprint'
							},
							customize: function(win) {
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
							customize: function(xlsx) {
								var sheet = xlsx.xl.worksheets['sheet1.xml'];
							}
						}
					],
					initComplete: function(settings, json, options, data) {

						$('.datatable-toolbar').appendTo('#dtToolbar');
						var toolBar = $(this).attr('tool-bar')
						var $info = $(toolBar + ' .info');
						if($info.length == 0) {
							//$('#tableTotalShow').appendTo($(toolBar + ' .tool-bar-body'));
							$info = $('<div class="info"></div>').appendTo($(toolBar + ' .tool-bar-body'));
						}
						$info.html('');
						$('.' + tblId + '-paginate').appendTo($info);
						////////////////
						$("#dtToolbar .buttons-print").css("border-radius", "4px 0 0 4px").addClass("btn-print btn-permission").attr({
							"data-toggle": "tooltip",
							"title": "打印"
						});
						$("#dtToolbar .buttons-excel").css("border-radius", "0 4px 4px 0").addClass("btn-export btn-permission").attr({
							"data-toggle": "tooltip",
							"title": "导出"
						});
						//导出begin
						$("#dtToolbar .buttons-excel").off().on('click', function(evt) {
							evt = evt || window.event;
							evt.preventDefault();
							uf.expTable({
								title: '汇总分析表',
								exportTable: '#reportTable'
							});
						});
						//导出end	
						$('#dtToolbar [data-toggle="tooltip"]').tooltip();
						//
						ufma.setBarPos($(window));
						ufma.isShow(reslist);
					},
					drawCallback: function() {
						ufma.isShow(reslist);
						// $('#reportTable_wrapper').ufScrollBar({
						// 	hScrollbar: true,
						// 	mousewheel: false
            // });
            //ZJGA820-1579 指标账表每列的宽度增加可拖拽调整宽度的功能--zsj
            var widthTab = 0;
            $('#reportTable').tblcolResizable({},function(){
              for(var i=0;i< $("#reportTable thead").find('th').length;i++){
                widthTab += $("#reportTable thead").find('th').eq(i).css('width')
              }
            });   
            $("#reportTable").css('width',widthTab)                            
            ufma.setBarPos($(window));
            setTimeout(function(){
              $('#tool-bar').css('top',$('.workspace-top').height()+$('.workspace-center').height() + 2 + 'px')
            },100)
					},
					fnCreatedRow: function(nRow, aData, iDataIndex) {
						$('td:eq(0)', nRow).html(iDataIndex + 1);
						if(!$.isNull(aData)) {
							if(aData.dataSource == "rptCountRow") {
								$(nRow).css({
									"background-color": "#f0f0f0"
								})
							}
						}
					}
				});

			},

			loadData: function() {
				var queryItem = $('#_reportFindMore_findTable_bgMoreMsgPnl-bgPerformanceReport tr').length;
				if(queryItem <= 1) {
					ufma.showTip("请先设置查询方案", null, "warning");
					return false;
				}
				var showType;
				$('#isShowYuSuan').is(':checked') ? showType = 1 : showType = 0;
				//CWYXM-11697 预算方案中要素选择里，增加是否采购属性，启用之后，编制指标时可选是和否，不能输入其他值，采购模块选择指标时，根据这个属性过滤--zsj
				var items = [];
				var pFindCdtn = {
					"agencyCode": page.agencyCode,
					"beginDate": $("#starData").getObj().getValue(),
					"lastDate": $("#endData").getObj().getValue(),
					"showType": showType,
          "includePermission": 1, //个人版按权限过滤指标
          'bgRuleDeportFrom': page.treeDepType, //CWYXM-18102 指标权限设置需要支持按人员库中的部门人员设置指标权限--zsj
				};

				var itemArr = page.getPlanItems();
        var itemCodeArr = [];
        //CWYXM-19293 汇总分析表，目前实是只按第一个要素汇总，期望逐级汇总--zsj--给后端标识"是否采购"的位置
        var isUpBudgetOrder = '';
				for(var m = 0; m < itemArr.length; m++) {
					itemCodeArr.push(itemArr[m].itemField);
				}
				if($.inArray("ISUPBUDGET", itemCodeArr) > -1) {
					pFindCdtn.isUpBudget = $('#isUpBudget').getObj().getValue();
				}
				for(var m = 0; m < itemArr.length; m++) {
					if(itemArr[m].itemField != "ISUPBUDGET" && itemArr[m].bgItemCode != "ISUPBUDGET" && itemArr[m].bgItemCode != "ISUPBUDGET") {
						items.push(itemArr[m]);
					} else {
            //CWYXM-19293 汇总分析表，目前实是只按第一个要素汇总，期望逐级汇总--zsj--给后端标识"是否采购"的位置
            isUpBudgetOrder = m + 1;
						if(!$.isNull(pFindCdtn.isUpBudget)) {
							itemArr[m].itemField = "ISUPBUDGET";
							itemArr[m].bgItemCode = "ISUPBUDGET";
							itemArr[m].itemName = "是否采购"
							items.push(itemArr[m]);
						}
					}
				}

				pFindCdtn.items = items;
				var tmpCbbSelect = '金额';
				var minCur = "";
				var maxCur = "";
				if(!$.isNull(tmpCbbSelect) && tmpCbbSelect != "") {
					if(tmpCbbSelect == "金额") {
						minCur = $("#_reportFindMore_inputFrom_bgMoreMsgPnl-bgPerformanceReport").val();
						maxCur = $("#_reportFindMore_inputTo_bgMoreMsgPnl-bgPerformanceReport").val();
					}
					if(parseFloat(maxCur) < parseFloat(minCur)) {
						ufma.showTip("金额查找上限不能小于下限", null, "error");
						return false;
					}
				}

				pFindCdtn.minCur = minCur;
        pFindCdtn.maxCur = maxCur;
        //CWYXM-19293 汇总分析表，目前实是只按第一个要素汇总，期望逐级汇总--zsj--给后端标识"是否采购"的位置
        pFindCdtn.isUpBudgetOrder = isUpBudgetOrder;
				ufma.post(dm.getCtrl('queryExec'), pFindCdtn, function(result) {
					var mainTableData = result.data;

					result.data.length > 0 && (page.changeClols = result.data[0].planVos); //动态表头
					totalMoney = 0.00;

					for(var i = 0; i < mainTableData.length; i++) {
						var SN = 1;
						mainTableData[i].SN = i + 1;
						mainTableData[i].bgItemCurShow = mainTableData[i].bgItemCur;
						if(mainTableData[i].composeCur == 0) {
							mainTableData[i].composeCurShow = " ";
						} else if(mainTableData[i].composeCur < 0) {
							mainTableData[i].composeCurShow = (mainTableData[i].composeCur).toString().substr(1);
						} else {
							mainTableData[i].composeCurShow = mainTableData[i].composeCur;
						}
						if(mainTableData[i].adjCur == 0) {
							mainTableData[i].adjCurShow = " ";
						} else {
							mainTableData[i].adjCurShow = mainTableData[i].adjCur;
						}
						if(mainTableData[i].dispenseCur == 0) {
							mainTableData[i].dispenseCurShow = " ";
						} else {
							mainTableData[i].dispenseCurShow = mainTableData[i].dispenseCur;
						}
						if(mainTableData[i].bgUseCur == 0) {
							mainTableData[i].bgUseCurShow = " ";
						} else {
							mainTableData[i].bgUseCurShow = mainTableData[i].bgUseCur;
						}
						if(mainTableData[i].inTransitCur == 0) {
							mainTableData[i].inTransitCurShow = " ";
						} else {
							mainTableData[i].inTransitCurShow = mainTableData[i].inTransitCur;
						}
						if(mainTableData[i].bgItemBalanceCur == 0) {
							mainTableData[i].bgItemBalanceShow = " ";
						} else {
							mainTableData[i].bgItemBalanceShow = mainTableData[i].bgItemBalanceCur;
						}

						mainTableData[i].bgItemBalanceCurShow = mainTableData[i].bgItemBalanceCur;
						mainTableData[i].realBgItemCurShow = mainTableData[i].realBgItemCur;
						if((mainTableData[i].bgUseCur + mainTableData[i].inTransitCur) / mainTableData[i].realBgItemCurShow == 0 || mainTableData[i].realBgItemCurShow == 0) {
							mainTableData[i].perC = "";
						} else {
							mainTableData[i].perC = !$.isNull(mainTableData[i].bgUseCur) && !$.isNull(mainTableData[i].inTransitCur) ? (((mainTableData[i].bgUseCur + mainTableData[i].inTransitCur) / mainTableData[i].realBgItemCurShow) * 100).toFixed(2) + "%" : '';
						}
					}

					page.initGrid();
					if(result.data.length > 0) {
						oTable.fnAddData(mainTableData, true);
					}
				});
			},
			getModalSelectedResult: function() {
				var sSelectedType = "";
				var sSelectedCtrlPlanId = "";
				var aSelectedItems = [];

				var $checkedInput = $("#_reportFindMore_setCaseModalId_bgMoreMsgPnl-bgPerformanceReport input:radio:checked");
				var tmpIndex = $checkedInput.attr("pageindex");

				if(tmpIndex == "1") {
					sSelectedType = "1"; //按要素选择
					$("#_reportFindMore_choisedBgItemList_bgMoreMsgPnl-bgPerformanceReport").find(".unselectBgItem").each(function(index, obj) {
						var tmpItem = {
							chrId: '',
							eleCode: $(this).attr("eleCode"),
							eleName: $(this).attr("eleName"),
							bgItemCode: $(this).attr("bgItemCode")
						};
						aSelectedItems[aSelectedItems.length] = tmpItem;
					});
				}
				return {
					"selectedType": sSelectedType,
					"selectedCtrlPlanId": sSelectedCtrlPlanId,
					"selectedItems": aSelectedItems
				};
      },
      //CWYXM-18102 指标权限设置需要支持按人员库中的部门人员设置指标权限--zsj
      getSysFlag: function(){
        var bgUrl = '/bg/sysdata/selectSysRgParaValue?rgCode=' + ptData.svRgCode + '&setYear=' + page.setYear + '&agencyCode=' + page.agencyCode + '&chrCode=BG005';
        ufma.ajaxDef(bgUrl,'get',{},function(result){
          page.treeDepType = result.data
        })
      },
			onEventListener: function() {
				//更多
				$('.label-more').click(function() {
					if($('.label-more span').text() == '更多') {
						$('.label-more span').text('收起')
					} else {
						$('.label-more span').text('更多')
          }
          setTimeout(function(){
            $('#tool-bar').css('top',$('.workspace-top').height()+$('.workspace-center').height() + 2 + 'px')
          },100)
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
				//bug75659--【财务云8.0 农业部】需要选项控制，项目、支出功能分类等可以隐藏编码，只显示名称--zsj
				$('#showTrue').on('click', function() {
					$('#showTrue').attr('checked', true);
					$('#showFalse').removeAttr('checked');
					page.showTrue = true;
					page.loadData();
				});
				//bug75659--【财务云8.0 农业部】需要选项控制，项目、支出功能分类等可以隐藏编码，只显示名称--zsj
				$('#showFalse').on('click', function() {
					$('#showFalse').attr('checked', true);
					$('#showTrue').removeAttr('checked');
					page.showTrue = false;
					page.loadData();
				});
				$('#showMethodTip').click(function() {
					if($("#rptPlanList").find('li').length == 0) {
						$("#rptPlanList ul").append('<li class="tc">无可用方案</li>');
					};
				});
				//重构时，方案保存在其它文件中，不好添加新方案，在按钮点击时重新加载，不是最好方案
				$(document).on('click', '.btn-save[id^="selfInputModal"]', function() {
					setTimeout(function() {
						dm.showPlan({
							agencyCode: page.agencyCode,
							userId: ptData.svUserId, //修改权限  将svUserCode改为 svUserId  20181012
							userName: ptData.svUserName,
							rptType: 'bgReportOfBudgetPersion'
						});
					}, 600);

				});

				$('#showMethodTip').ufTooltip({
					className: 'p0',
					trigger: 'click', //click|hover
					opacity: 1,
					confirm: false,
					gravity: 'north', //north|south|west|east
					content: "#rptPlanList"
				});

				$('#btnSetQueryPlan').click(function() {
					//CWYXM-9939 指标-汇总分析表，设置结果应保留上次选择结果--zsj
					var bgCodeArr = page.getPlanItems();
					var bgAttrStr = [];
					for(var i = 0; i < bgCodeArr.length; i++) {
						bgAttrStr.push(bgCodeArr[i]);
					}
					dm.moreMsgSetting.bgAttrStr = bgAttrStr;
					/*dm.moreMsgSetting.modalObj = ufma.showModal('_reportFindMore_setCaseModalId_bgMoreMsgPnl-bgPerformanceReport', 800, 500, function() {
						dm.showMore();
					});*/
					//CWYXM-11986 指标管理-汇总分析表,已查询出的数据再次点击设置不管是是关闭还是确认后,数据都没了--zsj-经赵雪蕊确认只在弹窗点确认 时清空原来的数据
					dm.moreMsgSetting.modalObj = ufma.showModal('_reportFindMore_setCaseModalId_bgMoreMsgPnl-bgPerformanceReport', 800, 500);
					_bgPub_PNL_ReportFind("bgMoreMsgPnl-bgPerformanceReport", dm.moreMsgSetting);
				});
				//CWYXM-11986 指标管理-汇总分析表,已查询出的数据再次点击设置不管是是关闭还是确认后,数据都没了--zsj-经赵雪蕊确认只在弹窗点确认 时清空原来的数据
				$("#btnOk").off("click").on("click", function() {
					var rst = page.getModalSelectedResult();
					dm.moreMsgSetting.modalObj.close();
					if($.isNull(rst.selectedItems)) {
						dm.moreMsgSetting.contentObj = null;
					} else {
						dm.moreMsgSetting.contentObj = $.extend({}, rst);
					}
					dm.moreMsgSetting.id = {
						findTable: "_reportFindMore_findTable_bgMoreMsgPnl-bgPerformanceReport"
					}
					_bgPub_PNL_ReportFind_ShowCase(dm.moreMsgSetting, rst);
					dm.showMore();
				});
				$('#btnQuery').click(function() {
					page.loadData();
				});
				$('#btnCancel').click(function() {
					dm.moreMsgSetting.modalObj.close();
				});
				$('.u-msg-dialog .u-msg-close').on('click', 'span', function() {
					dm.moreMsgSetting.modalObj.close();
				});
				$(".bgPerformanceReport #searchHideBtn").off("click");
				$(".bgPerformanceReport #iframeBtnsSearch").off("mouseleave");
				ufma.searchHideShow($('#reportTable'));
				//$('#_reportFindMore_inputTo_bgMoreMsgPnl-bgPerformanceReport,#_reportFindMore_inputFrom_bgMoreMsgPnl-bgPerformanceReport').amtInputNull();
			},
			initPage: function() {
				dm.showMore = function() {
					var timeId = setTimeout(function() {
						var queryItem = $('#_reportFindMore_findTable_bgMoreMsgPnl-bgPerformanceReport tr').length;
						$('.label-more')[queryItem > 1 ? 'removeClass' : 'addClass']('hidden');
						if((queryItem > 1 && $('.label-more i').hasClass('icon-angle-bottom')) || (queryItem == 1 && !$('.label-more i').hasClass('icon-angle-bottom'))) {
							$('.label-more').trigger('click');
						}
						clearTimeout(timeId);
						page.initGrid();
						if($('#showTrue').attr('checked') == true) {
							page.showTrue = true;
						} else if($('#showFalse').attr('checked') == true) {
							page.showTrue = false;
						}
					}, 30);
				}

				$('#cbAgency').ufTreecombox({
					url: dm.getCtrl('agency'),
					idField: 'id', //可选
					textField: 'codeName', //可选
					pIdField: 'pId', //可选
					placeholder: '请选择单位',
					icon: 'icon-unit',
					theme: 'label',
					leafRequire: true,
					onChange: function(sender, treeNode) {
						page.agencyCode = treeNode.id;
						//80827---20190630所有页面，单位或账套选择变化后，再打开其它页面时，自动显示为最近一次选择的单位或账套。--zsj
						//缓存单位
						var params = {
							selAgecncyCode: treeNode.id,
							selAgecncyName: treeNode.name
						}
						ufma.setSelectedVar(params);
						//page.initSearchPnl();
						// page.getBgItems();
						///////////////
						dm.showPlan({
							agencyCode: page.agencyCode,
							userId: ptData.svUserId, //修改权限  将svUserCode改为 svUserId  20181012
							userName: ptData.svUserName,
							rptType: 'bgReportOfBudgetPersion'
						});
						/////////////////
						dm.moreMsgSetting.agencyCode = page.agencyCode;
            _bgPub_PNL_ReportFind("bgMoreMsgPnl-bgPerformanceReport", dm.moreMsgSetting);
            page.getSysFlag();//CWYXM-18102 指标权限设置需要支持按人员库中的部门人员设置指标权限--zsj
					},
					onComplete: function(sender) {
						if(ptData.svAgencyCode) {
							$('#cbAgency').getObj().val(ptData.svAgencyCode);
						} else {
							$('#cbAgency').getObj().val('1');
						}
					}
				});
				//CWYXM-9938 切换到2020年度，查询汇总分析表，默认起始日期应为2020年，目前为2019--zsj
				$('#starData').ufDatepicker({
					format: 'yyyy-mm-dd',
					//initialDate: new Date(new Date().getFullYear(), 0, 1)
					initialDate: new Date(new Date(ptData.svTransDate).getFullYear(), 0, 1)
				});
				$('#endData').ufDatepicker({
					format: 'yyyy-mm-dd',
					//initialDate: new Date()
					initialDate: ptData.svTransDate
				});
				$('.amt-from,.amt-to').amtInput();
			},
			init: function() {
				//获取session
        ptData = ufma.getCommonData();
        page.setYear = parseInt(ptData.svSetYear);
				reslist = ufma.getPermission();
				ufma.isShow(reslist);
				page.showTrue = true;
				dm.moreMsgSetting = {
					"agencyCode": ptData.svAgencyCode,
					"userId": ptData.svUserId, //  将svUserCode改为 svUserId  20181012
					"userName": ptData.svUserName,
					"rptType": 'bgReportOfBudgetPersion',
					'rebuild': true
				};

				this.initPage();
				this.onEventListener();
				page.initGrid();
				ufma.parse();
				ufma.parseScroll();
			}
		}
	}();

	page.init();
});