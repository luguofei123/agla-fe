$(function() {
	var ptData,
		oTable,
		columns,
		openDue = false,
		arguData,
		sendObj = {}; //post数据
	var curType = 1; //点击提取坏账准备按钮时，传入参数增加atype区分往来类型
	var page = function() {
		return {
			initSelect: function(id, str, border) {
				if(border) {
					$(id).ufTreecombox({
						valueField: "chrName",
						textField: "chrName",
						readonly: false,
						placeholder: "请选择" + str,
						data: [],
						theme: '',
					});
				} else {
					$(id).ufTreecombox({
						valueField: "chrName",
						textField: "chrName",
						readonly: false,
						placeholder: "请选择" + str,
						data: [],
						theme: 'label',
					});
				}

			},
			select: function() {
				//取单位数据
                 var arguAge = {
					setYear:ptData.svSetYear,
					rgCode:ptData.svRgCode
				}
				//根据选择单位改变账套
				ufma.get("/gl/eleAgency/getAgencyTree",arguAge, function(result) {
				//ufma.get("/gl/eleAgency/getAgencyTree", {}, function(result) {
					page.cbAgency = $("#cbAgency").ufTreecombox({
						idField: 'id', //可选
						textField: 'codeName', //可选
						pIdField: 'pId', //可选
						readonly: false,
						placeholder: "请选择单位",
						icon: 'icon-unit',
						theme: 'label',
						leafRequire: true,
						data: result.data,
						onChange: function(sender, data) {
							//切换往来类型 S
							$("#colAction .text").text("单位");
							$("#colAction").attr("data-type", "01");
							//切换往来类型 E
							//sendObj.agencyCode = data.CHR_CODE;
							sendObj.agencyCode = data.code;
							//缓存单位账套
							var params = {
								selAgecncyCode: data.code,
								selAgecncyName: data.name,
							}
							ufma.setSelectedVar(params);
							var agencyCode = data.code;
							var arguAcct = {
								agencyCode: agencyCode,
								setYear: ptData.svSetYear
							}
							//改变单位,账套选择内容改变
							//修改权限  将svUserCode改为 svUserId  20181012
							var acctUrl = '/gl/eleCoacc/getRptAccts';
							ufma.get(acctUrl, arguAcct, function(result) {
								page.cbAcct = $("#cbAcct").ufCombox({
									data: result.data,
									onChange: function(sender, data) {
										sendObj.acctCode = data.code;
										//缓存单位账套
										var params = {
											selAgecncyCode: $('#cbAgency').getObj().getValue(),
											selAgecncyName: $('#cbAgency').getObj().getText(),
											selAcctCode: data.code,
											selAcctName: data.name
										}
										ufma.setSelectedVar(params);
										//改变账套  选择会计科目
										//修改权限  将svUserCode改为 svUserId  20181012
										ufma.get('/gl/sys/coaAcc/getRptAccoTree?acctCode=' + sendObj.acctCode + '&agencyCode=' + data.agencyCode + '&setYear=' + ptData.svSetYear + '&userId=' + ptData.svUserId + '&accoType=' + sendObj.accoType, {}, function(result) {	
											if(result.data.treeData) {
												page.cbAcco = $("#cbAcco").ufTreecombox({
													valueField: "code",
													textField: "codeName",
													readonly: false,
													placeholder: "请选择会计科目",
													leafRequire: false,
													data: result.data.treeData,
													onChange: function(sender, data) {
														//sendObj.accoCode = data.CHR_CODE
														sendObj.accoCode = data.code;
													},
													onComplete: function() {
														//跳转后赋值
														if(openDue) {
															$("#cbAcco").getObj().val(arguData.accoCode);
															var timeId = setTimeout(function() {
																$("#query_table").trigger("click");
																clearTimeout(timeId);
															}, 200);
														} else {
															// 正常进入页面赋值
															for(var i = 0; i < result.data.treeData.length; i++) {
																if(result.data.treeData[i].isLeaf == "1") {
																	//$('#cbAcco').getObj().val(result.data.treeData[i].CHR_CODE);
																	$('#cbAcco').getObj().val(result.data.treeData[i].code);
																	break;
																}
															}
														}

													}
												});
											}
										});
									},
									onComplete: function(sender) {
										//跳转后负值
									   if(openDue) {
											$("#cbAcct").getObj().val(arguData.acctCode);
											 return false;
										}
										//正常进入页面赋值
										if (ptData.svAcctCode) {
										    $("#cbAcct").getObj().val(ptData.svAcctCode);
										} else {
										    $('#cbAcct').getObj().val('1');
										}
										//  if(ptData.svAgencyCode) {
										// 	$('#cbAgency').getObj().val(ptData.svAgencyCode);
										// } else {
										// 	$('#cbAgency').getObj().val('1');
										// }
									}
								});
							});

							if(openDue && arguData.colActionType == "02") {
								//切换往来类型 S
								$("#colAction .text").text("个人");
								$("#colAction").attr("data-type", "02");
								//切换往来类型 E

								//跳转到此页面时，往来方是往来个人（人员），则请求人员列表并赋值
								var reqData = {
									agencyCode: $("#cbAgency").getObj().getValue(),
									setYear: ptData.svSetYear,
									rgCode: ptData.svRgCode,
									eleCode: "EMPLOYEE"
								};

								ufma.get('/gl/elecommon/getEleCommonTree', reqData, function(result) {
									page.payerAgencyData = result.data;
									$('#cbCurrent').getObj().load(result.data);
									//跳转赋值
									$("#cbCurrent").getObj().val(arguData.currentCode);
								});
							} else {
								//切换往来类型 S
								$("#colAction .text").text("单位");
								$("#colAction").attr("data-type", "01");
								//切换往来类型 E

								//改变单位  选择往来单位
								var reqData = {
									//agencyCode: data.CHR_CODE,
									agencyCode: data.code,
									setYear: ptData.svSetYear,
									rgCode: ptData.svRgCode,
									eleCode: "CURRENT"
								};

								ufma.get("/gl/current/aging/getEleCommonTree", reqData, function(result) {
									$('#cbCurrent').getObj().load(result.data);
									if(openDue) {
										$("#cbCurrent").getObj().val(arguData.currentCode);
										return false;
									}
									// 正常进入页面赋值
									for(var i = 0; i < result.data.length; i++) {
										if(result.data[i].isLeaf == "1") {
											$('#cbCurrent').getObj().val(result.data[i].code);
											break;
										}
									}
								});
							}
							page.initSelect('#cbAcco', "会计科目", true)
						},
						onComplete: function(sender) {
							var myDataFrom = $.getUrlParam("dataFrom");
							if(myDataFrom != null && myDataFrom.toString().length > 1) {
								//应收款备查簿跳转到账龄分析
								openDue = true;
								//应收款参数缓存
								var key = ufma.sessionKey("gl", "notesAccounts", ptData.svRgCode, ptData.svSetYear, ptData.svAgencyCode, ptData.svAcctCode, "notesAccounts");
								var arguStr = sessionStorage.getItem(key);
								arguData = JSON.parse(arguStr);
								$("#cbAgency").getObj().val(arguData.agencyCode);
							} else if(ptData.svAgencyCode) {
								var agency = $.inArrayJson(result.data, 'id', ptData.svAgencyCode);
								if(agency != undefined) {
									$('#cbAgency').getObj().val(ptData.svAgencyCode);
								} else {
									for(var i = 0; i < result.data.length; i++) {
										if(result.data[i].isLeaf == 1) {
											//$('#cbAgency').getObj().val(result.data[i].CHR_CODE);
											$('#cbAgency').getObj().val(result.data[i].code);
											break;
										}
									}
								}

							} else {
								for(var i = 0; i < result.data.length; i++) {
									if(result.data[i].isLeaf == 1) {
										//$('#cbAgency').getObj().val(result.data[i].CHR_CODE);
										$('#cbAgency').getObj().val(result.data[i].code);
										break;
									}
								}
							}
						}
					});
				});

			},
			//定义表头（动态表头）汇总分析和时间的选择
			gridHeader: function(hz) {
				//默认的表头
				columns = [{
						title: "发生日期",
						data: "bussDate",
						width: 100,
						className: 'nowrap isprint'
					},
					{
						title: "凭证号",
						data: "vouNo",
						className: 'nowrap isprint'
					},
					{
						title: "摘要",
						data: 'vouDesc',
						className: 'nowrap isprint'
					},
					{
						title: "会计科目",
						data: 'accoCodeName',
						className: 'nowrap isprint'
					},
					{
						title: "往来方",
						data: 'currentCodeName',
						className: 'nowrap isprint'
					},
					{
						title: "票据类型",
						data: 'billType',
						className: 'nowrap isprint'
					},
					{
						title: "票据日期",
						data: 'billDate',
						className: 'nowrap isprint'
					},
					{
						title: "票据号",
						data: 'billNo',
						className: 'nowrap isprint'
					},
					{
						title: "应收金额",
						data: 'stadAmt',
						className: 'tr nowrap isprint tdNum',
						render: $.fn.dataTable.render.number(',', '.', 2, '')
					}
				];
				//汇总分析表头
				columnHZ = [{
						title: "往来单位",
						data: 'currentCodeName',
						className: 'nowrap isprint'
					},
					{
						title: "应收金额",
						data: 'stadAmt',
						className: 'tr nowrap isprint tdNum',
						render: $.fn.dataTable.render.number(',', '.', 2, '')
					},
					{
						title: "核销金额",
						data: 'cancelAmt',
						className: 'tr nowrap isprint tdNum',
						render: $.fn.dataTable.render.number(',', '.', 2, '')
					},
					{
						title: "应收余额",
						data: 'balAmt',
						className: 'tr nowrap isprint tdNum',
						render: $.fn.dataTable.render.number(',', '.', 2, '')
					}
				];

				//动态添加时间列表
				$.each(getAllData(), function(index, value) {
					var obj = {
						className: 'tr nowrap isprint',
						title: value+"天",//bug75110---账龄的数字列标题数要带单位（天）--zsj
						data: "anysPeriod" + (++index),
						render: $.fn.dataTable.render.number(',', '.', 2, '')
					}
					columns.push(obj)
					columnHZ.push(obj)
				});

				if(hz == 1) {
					page.initGrid(columnHZ);
				} else {
					page.initGrid(columns);
				}

			},
			//初始化table
			initGrid: function(columns) {
				if(oTable) {
					$('#gridGOV').closest('.dataTables_wrapper').ufScrollBar('destroy');
					oTable.fnDestroy();
					$("#gridGOV").html('');
				}
				oTable = $("#gridGOV").dataTable({
					"language": {
						"url": bootPath + "agla-trd/datatables/datatable.default.js"
					},
					"autoWidth": false,
					"bDestory": true,
					"processing": true, //显示正在加载中
					"pagingType": "full_numbers", //分页样式
					"lengthChange": true, //是否允许用户自定义显示数量p
					"lengthMenu": [
						[10, 20, 50, 100, 200, -1],
						[10, 20, 50, 100, 200, "全部"]
					],
					"pageLength": 100,//默认每页显示100条--zsj--吉林公安需求
					"serverSide": false,
					"ordering": false,
					columns: columns,
					//填充表格数据
					data: [],
					"dom": '<"datatable-toolbar"B>rt<"gridGOV-paginate"ilp>',
					buttons: [{
							extend: 'print',
							text: '<i class="glyphicon icon-print" aria-hidden="true"></i>',
							exportOptions: {
								modifier: {
									page: 'current'
								}
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
					"initComplete": function(settings, json) {
						 $('.datatable-toolbar').appendTo('#dtToolbar');
						  var toolBar = $(this).attr('tool-bar')
						var $info = $(toolBar + ' .info');
						if($info.length == 0) {
							$info = $('<div class="info" style="top:-3px;"></div>').appendTo($(toolBar + ' .tool-bar-body'));
						}
						$info.html('');
						$('.gridGOV-paginate').appendTo($info);
 
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
							ufma.expXLSForDatatable($('#gridGOV'), '应收账龄分析');
						});
						//导出end
						$('#dtToolbar [data-toggle="tooltip"]').tooltip();
						ufma.isShow(page.reslist);
						$('#gridGOV').closest('.dataTables_wrapper').ufScrollBar({
							hScrollbar: true,
							mousewheel: false
						});
						ufma.setBarPos($(window));
					},
					"drawCallback": function() {
						$('#gridGOV').find("td.dataTables_empty").text("")
							.append('<img class="no-print" src="' + bootPath + 'images/noData.png"/><br/><i>目前还没有你要查询的数据</i>');
						ufma.isShow(page.reslist);
					}

				});
			},

			onEventListener: function() {
				//搜索
				ufma.searchHideShow($('#gridGOV'));
				//查询
				$('#query_table').on('click', function() {
					if(sendObj.agencyCode) {
						if(sendObj.acctCode) {
							ufma.showloading()
							page.loadGrid();
							/*if(sendObj.currentCode) {
								if(sendObj.accoCode) {
									page.loadGrid()
								} else {
									ufma.showTip('请选择会计科目！', function() {}, 'warning');
								}
							} else {
								ufma.showTip('请选择往来单位！', function() {}, 'warning');
							}*/
						} else {
							ufma.showTip('请选择账套！', function() {}, 'warning');
						}
					} else {
						ufma.showTip('请选择单位！', function() {}, 'warning');
					}
					ufma.setBarPos($(window));
				})

				$('#hidden').on('click', function() {
					if($(this).attr('data-item') == 1) {
						$(this).html('<a>收起</a><span class="icon icon-angle-top"></span>');
						$(this).attr('data-item', '0');
						$('#hidden-box').show();
						ufma.setBarPos($(window));
					} else {
						$(this).html('<a>展开</a><span class="icon icon-angle-bottom"></span>');
						$(this).attr('data-item', '1');
						$('#hidden-box').hide();
						ufma.setBarPos($(window));
					}
				});
				$('#badZhangType').click(function() {
					ufma.get('/gl/enumerate/getSysRgparaValueByChrCode/GL024', {}, function(result) {
						if(result.data == '1') {
							page.secondPage('bookin.html', '计提坏账准备', 560, 600, 'YE', '余额百分比法')
						} else if(result.data == '2') {
							page.secondPage('bookin2.html', '计提坏账准备', 510, 900, 'ZL', '账龄分析法')
						} else if(result.data == '3') {
							page.secondPage('bookin2.html', '计提坏账准备', 510, 900, 'GB', '个别认定法')
						}
					});
				});
				//显示/隐藏列隐藏框
				$(document).on("click", "#colAction", function(evt) {
					evt.stopPropagation();
					// $("#colList input").each(function(i) {
					//     $(this).prop("checked", page.changeCol[i].visible);
					// });

					$("div.rpt-funnelBox").hide();
					$(this).next("div.rpt-funnelBox").show();
				});
				//选择往来类型
				$("#colList").on("click", "span", function() {
					if($("#colAction .text").text() != $(this).text()) {
						$("#colAction .text").text($(this).text());
						$("#colAction").attr("data-type", $(this).attr("data-type"));
						if($(this).text() == "单位") {
							curType = 1; //点击提取坏账准备按钮时，传入参数增加atype区分往来类型
							page.payerAgency();
						} else if($(this).text() == "个人") {
							curType = 2; //点击提取坏账准备按钮时，传入参数增加atype区分往来类型
							page.payerEmployee();
						}
					}
					$(this).closest(".rpt-funnelBox").hide();
				});
			},
			//请求往来单位
			payerAgency: function() {
				var reqData = {
					agencyCode: $("#cbAgency").getObj().getValue(),
					setYear: ptData.svSetYear,
					rgCode: ptData.svRgCode,
					eleCode: "CURRENT"
				};

				ufma.get("/gl/elecommon/getEleCommonTree", reqData, function(result) {
					$('#cbCurrent').getObj().load(result.data);
				});
			},
			//请求个人往来（人员列表）
			payerEmployee: function() {
				var reqData = {
					agencyCode: $("#cbAgency").getObj().getValue(),
					setYear: ptData.svSetYear,
					rgCode: ptData.svRgCode,
					eleCode: "EMPLOYEE"
				};

				ufma.get('/gl/elecommon/getEleCommonTree', reqData, function(result) {
					page.payerAgencyData = result.data;
					$('#cbCurrent').getObj().load(result.data);
					// $('#btnQuery').trigger('click');
				});
			},
			secondPage: function(url, title, height, width, analyFlag, ageName) {
				ufma.open({
					url: url,
					title: title,
					width: width,
					height: height,
					data: {
						agencyCode: sendObj.agencyCode,
						acctCode: sendObj.acctCode,
						anysDate: $(" input[ name='anysDate' ] ").val(),
						agingSet: getActData(),
						analyFlag: analyFlag,
						ageName: ageName,
						atype: curType //点击提取坏账准备按钮时，传入参数增加atype区分往来类型
					},
					ondestory: function() {

					}
				});
			},
			//获取
			loadGrid: function() {
				var anysDate = $(" input[ name='anysDate' ] ").val();
				var isSum = $('input:checkbox[name="isSum"]:checked').val();
				if(isSum == "on") {
					isSum = 1;
					page.gridHeader(1)
				} else {
					isSum = 0;
					page.gridHeader(0)
				}
				var agingSet = getActData()

				var currentType = "1";
				if($("#colAction").attr("data-type") == "02") {
					currentType = "2";
				}
				ufma.get('/gl/current/aging/getAgingData/' + sendObj.agencyCode + '/' + sendObj.acctCode +
					'/' + sendObj.accoCode + '/' + currentType + '/' + sendObj.currentCode + '/' + anysDate + '/' + isSum + '/' + agingSet, {},
					function(result) {
						ufma.hideloading()
						openDue = false;
						argu = result.data
						oTable.fnClearTable();
						if(argu.length != 0) {
							oTable.fnAddData(argu, true);
							$('#gridGOV').closest('.dataTables_wrapper').ufScrollBar({
								hScrollbar: true,
								mousewheel: false
							});
							ufma.setBarPos($(window));
						} else {
							//ufma.showTip('数据不存在！', function () {}, 'warning');---------王哥要求查不到数据，我们统一这样描述：“没有符合条件的数据！”
							ufma.showTip('没有符合条件的数据！', function() {}, 'warning');
						}
					});
			},
			//此方法必须保留
			init: function() {
				ptData = ufma.getCommonData();
				page.reslist = ufma.getPermission();
				ufma.isShow(page.reslist);
				ufma.parseScroll();
				ufma.parse();
				sendObj = {
					agencyCode: '', //单位
					acctCode: '', //账套
					accoCode: '', //会计科目
					currentCode: '', //往来单位
					accoType: 6 //应收
				}
				$('.uf-datepicker').ufDatepicker({
					format: 'yyyy-mm-dd',
					//viewMode:'month',
					initialDate: new Date()
				});
				page.select();
				page.gridHeader(0)
				page.onEventListener();
				//初始化账套
				$("#cbAcct").ufCombox({
					idField: 'code',
					textField: 'codeName',
					readonly: false,
					placeholder: '请选择账套',
					icon: 'icon-book',
					theme: 'label',
				});
				//初始化往来单位
				// page.initSelect('#cbCurrent',"往来单位",true)
				$('#cbCurrent').ufTreecombox({
					idField: 'id',
					textField: 'codeName',
					pIdField: 'pId', //可选
					readonly: false,
					placeholder: '请选择往来方',
					leafRequire: false,
					onChange: function(sender, data) {
						sendObj.currentCode = data.code;
					}
				});
				// //初始化会计科目
				page.initSelect('#cbAcco', "会计科目", true)

			}
		}
	}();
	/////////////////////
	page.init();

});