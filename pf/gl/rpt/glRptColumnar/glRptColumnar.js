$(function () {
	var pageLength = ufma.dtPageLength('#glRptJournalTable');
	var isFirst = true; // 是否第一次进页面
	var hasTable = false; // 是否有表格
	var firstAccoCode = ""; // 第一个会计科目
	//var hideColArray = [];
	var page = function () {

		var glRptJournalDataTable; //全局datatable对象
		var glRptJournalTable; //全局table的ID
		var ptData;
		var firstAccoData; //第一个非明细科目数据
		//多栏账所用接口
		var portList = {
			accItemTypeList: "/gl/EleAccItem/getAccItemType", //辅助项类别列表接口 不包括科目
			getReport: "/gl/rpt/getReportData/GL_RPT_COLUMNAR", //请求表格数据
			getFirstAcco: "/gl/common/glAccItemData/getFistAccoCode" //获取第一个非明细科目
		};
		//用于存储表头信息
		var headArr;
		//三种表格样式的初始化列数组
		//三栏式
		var SANLANColsArr = [
		// { //日期-年
		// 	data: "SET_YEAR",
		// 	className: 'nowrap isprint',
		// 	width: 60,
		// 	render: function (data, type, rowdata, meta) {
		// 		if (data == '' || data == null) {
		// 			data = ''
		// 		}
		// 		return ''
		// 	}
		// },
		{ //日期-月
			data: "VOU_MONTH",
			className: 'nowrap isprint tc',
			width: 60
		},
		{ //日期-日
			data: "VOU_DAY",
			className: 'nowrap isprint tc',
			width: 60
		},
		{ //凭证字号
			data: "VOU_NO",
			className: 'nowrap isprint',
			width: 100
		},
		{ //摘要
			data: "DESCPT",
			className: 'ellipsis isprint',
			width: 200,
			render: function (data, type, rowdata, meta) {
				if (data == '' || data == null) {
					data = ''
				}
				return '<span  title="' + data + '">' + data + '</span>'
			}
		},
		{
			data: "DR_AMT",
			className: 'nowrap tr isprint tdNum',
			width: 100
		}, //-4借方金额
		{
			data: "CR_AMT",
			className: 'nowrap tr isprint tdNum',
			width: 100
		}, //-3贷方金额

		{
			data: "DR_CR",
			class: "tc"
		}, //-2方向
		{
			data: "STAD_AMT",
			className: 'nowrap tr isprint tdNum',
			width: 100
		} //-1余额

		];
		var SANLANhtml1;
		var SANLANhtml2;
		return {
			//初始化单位选择样式及change事件
			initAgencyScc: function () {
				ufma.showloading('正在加载数据，请耐心等待...');
				page.cbAgency = $('#cbAgency').ufmaTreecombox2({
					valueField: 'id', //可选
					textField: 'codeName', //可选
					pIdField: 'pId', //可选
					placeholder: '请选择单位',
					icon: 'icon-unit',
					theme: 'label',
					leafRequire: true,
					readonly: false,
					onchange: function (data) {
						rpt.nowAgencyCode = page.cbAgency.getValue();
						var url = "/gl/eleCoacc/getRptAccts/";
						callback = function (result) {
							page.reqAcctList(result);
						}
						ufma.get(url, {
							agencyCode: rpt.nowAgencyCode
						}, callback);
						//缓存单位账套
						var params = {
							selAgecncyCode: rpt.nowAgencyCode,
							selAgecncyName: rpt.nowAgencyName,
							selAcctCode: rpt.nowAcctCode,
							selAcctName: rpt.nowAcctName
						}
						ufma.setSelectedVar(params);
					}
				});
				ufma.ajaxDef("/gl/eleAgency/getAgencyTree" + "?setYear=" + ptData.svSetYear + "&rgCode=" + ptData.svRgCode, "get", "", function (result) {
					page.cbAgency = $("#cbAgency").ufmaTreecombox2({
						data: result.data
					});
					// rpt.nowAgencyCode = page.cbAgency.getValue();
					if(result.data.length > 0){
						var code = result.data[0].id;
						var name = result.data[0].name;
						if (rpt.nowAgencyCode != "" && rpt.nowAgencyName != "") {
							var agency = $.inArrayJson(result.data, 'id', rpt.nowAgencyCode);
							if (agency != undefined) {
								page.cbAgency.val(rpt.nowAgencyCode);//财务云项目CWYXM-8681--修改单位赋值--zsj
							} else {
								rpt.nowAgencyCode = code;
								rpt.nowAgencyName = name;
								page.cbAgency.val(code);//财务云项目CWYXM-8681--修改单位赋值--zsj
							}
						} else {
							rpt.nowAgencyCode = page.cbAgency.getValue();
							rpt.nowAgencyName = page.cbAgency.getText();
							page.cbAgency.val(code);//财务云项目CWYXM-8681--修改单位赋值--zsj
						}
					}
					ufma.hideloading();
				});
			},
			//请求账套列表
			reqAcctList: function (result) {
				$("#cbAcct").ufCombox({
					idField: 'code',
					textField: 'codeName',
					placeholder: '请选择账套',
					data: result.data,
					icon: 'icon-book',
					theme: 'label',
					onChange: function (sender, data) {
						isFirst = true; // 切换单位/账套时修改isFirst，目的初始化借方展开项目时去掉非末级科目
						$("#style").getObj().clear(); // 清空格式
						rpt.nowAcctCode = $('#cbAcct').getObj().getValue();
						rpt.nowAccsCode = data.accsCode;
						rpt.reqAccList();
						page.getFirstAcco();
						//请求查询方案列表
						//rpt.reqPrjList();
						// //请求共享方案列表
						// rpt.reqSharePrjList();
						// dm.showPlan({
						// 	"agencyCode": rpt.nowAgencyCode,
						// 	"acctCode": rpt.nowAcctCode,
						// 	"rptType": rpt.rptType,
						// 	"userId": rpt.nowUserId,
						// 	"setYear": rpt.nowSetYear
						// });
						// page.initTable([], SANLANColsArr, []);
						rpt.getStyleList($('#ACCO-data-key').attr('code'));
						$("#handleStyle").removeClass("hidden");

						//缓存单位账套
						var params = {
							selAgecncyCode: rpt.nowAgencyCode,
							selAgecncyName: rpt.nowAgencyName,
							selAcctCode: rpt.nowAcctCode,
							selAcctName: rpt.nowAcctName
						}
						ufma.setSelectedVar(params);
						$("#glRptColumnar-query").trigger("click");

					},
					onComplete: function (sender) {
						var data = result.data;
						if (data.length > 0) {
							var code = data[0].code;
							var name = data[0].name;
							if (rpt.nowAcctCode != "" && rpt.nowAcctName != "") {
								var flag = $("#cbAcct").getObj().val(rpt.nowAcctCode);
								if (flag == "undefined") {
									$("#cbAcct").getObj().val(rpt.nowAcctCode);
								} else if (flag == false) {
									$("#cbAcct").getObj().val(code);
									rpt.nowAcctCode = code;
									rpt.nowAcctName = name;
								}
							} else {
								//rpt.cbAcct.setValue(code, name);
								$("#cbAcct").getObj().val(code);
								rpt.nowAcctCode = code;
								rpt.nowAcctName = name;
							}
						} else {
							ufma.showTip("该单位下面没有账套，请重新选择单位！", function () { }, "warning");
						}
						ufma.hideloading();
					}
				});
			},

			//初始化表格
			initTable: function (tableData, SANLANColsArr, ItemsData) {
				rpt.nowAcctCode = $("#cbAcct").getObj().getValue();
				page.SANLANhtml1 = $("#SANLAN tr").eq(0).html();
				page.SANLANhtml2 = $("#SANLAN tr").eq(1).html();
				//需要根据自己页面写的ID修改
				page.glRptJournalTable = $('#glRptJournalTable'); //当前table的ID
				page.glRptJournalThead = $('#glRptJournalThead'); //当前table的头部ID
				$('#glRptJournalTable tbody').html('');
				page.glRptJournalThead.html('<tr>' + page.SANLANhtml1 + '</tr><tr>' + page.SANLANhtml2 + '</tr>');
				var styleData = $("#style").getObj().getValue();
				// if ($.isNull(styleData)) {
				// 	page.glRptJournalDataTable = page.newTable(tableData, SANLANColsArr, firstAccoData);
				// } else {
					page.glRptJournalDataTable = page.newTable(tableData, SANLANColsArr, ItemsData);
				// }

			},
			//表格初始化
			newTable: function (tableData, columnsArr, tempData) {
				var columnDefsArr = [];
				columnDefsArr = [{
					"targets": [2], //凭证字号
					"className": "isprint",
					"render": function(data, type, full, meta) {
						if(data != null) {
							if(full.VOU_GUID != null) {
								return '<span class="turn-vou" title="'+ data +'" data-vouguid="' + full.VOU_GUID + '">' + data + '</span>';
							} else { 
								return data;
							}
						} else {
							return "";
						}
					}
				}];
				var id = "glRptJournalTable"; //表格id
				var theadhtml = ''
				theadhtml += '<thead id="glRptJournalThead">'
				theadhtml += '<tr>'
				theadhtml += '<th colspan="2" style="width:120px">期间</th>'
				theadhtml += '<th rowspan="2">凭证号</th>'
				theadhtml += '<th rowspan="2" class="zhaiyaoCol"><span class="thTitle rpt-th-zhaiyao-5">摘要</span></th>'
				if (!$.isNull(tempData.lDrItemCodes)) {
					theadhtml += '<th colspan="' + (tempData.lDrItemCodes.length + 1) + '" width="'+ 130 * (tempData.lDrItemCodes.length + 1) +'"><span class="thTitle rpt-th-jine-4">借方</span></th>'
				} else {
					theadhtml += '<th width="130"><span class="thTitle rpt-th-jine-4">借方</span></th>'
				}
				if (!$.isNull(tempData.lCrItemCodes)) {
					theadhtml += '<th colspan="' + (tempData.lCrItemCodes.length + 1) + '" width="'+ 130 * (tempData.lCrItemCodes.length + 1) +'"><span class="thTitle rpt-th-jine-4">贷方</span></th>'
				} else {
					theadhtml += '<th width="130"><span class="thTitle rpt-th-jine-4">贷方</span></th>'
				}
				theadhtml += '<th rowspan="2" width="45">方向</th>'
				theadhtml += '<th rowspan="2" width="45"><span class="thTitle rpt-th-jine3-1">余额</span></th>'
				theadhtml += '</tr>'
				theadhtml += '<tr>'
				// theadhtml += '<th parent-title="2017-" class="editYear">年</th>'
				theadhtml += '<th parent-title="2017-" class="editYear">月</th>'
				theadhtml += '<th parent-title="2017-" class="editYear">日</th>'
				theadhtml += '<th>合计</th>'
				if (!$.isNull(tempData.lDrItemCodes)) {
					for (var i = 0; i < tempData.lDrItemCodes.length; i++) {
						theadhtml += '<th class="nowrap isprint" title="'+ tempData.lDrItemCodes[i].codeName +'">' + tempData.lDrItemCodes[i].codeName + '</th>'
					}
				}
				theadhtml += '<th>合计</th>'
				if (!$.isNull(tempData.lDrItemCodes)) {
					for (var i = 0; i < tempData.lCrItemCodes.length; i++) {
						theadhtml += '<th class="nowrap isprint" title="'+ tempData.lCrItemCodes[i].codeName +'">' + tempData.lCrItemCodes[i].codeName + '</th>'
					}
				}
				theadhtml += '</tr>'
				theadhtml += '</thead>'
				// $('#' + id).dataTable().fnDestroy();
				$('#' + id).html(theadhtml);
				var toolBar = $('#' + id).attr('tool-bar');
				page.glRptJournalDataTable = page.glRptJournalTable.DataTable({
					"language": {
						"url": bootPath + "agla-trd/datatables/datatable.default.js"
					},
					"autoWidth": false,
					"bDestory": true,
					"data": tableData,
					"processing": true, //显示正在加载中
					"pagingType": "full_numbers", //分页样式
					"lengthChange": true, //是否允许用户自定义显示数量p
					"lengthMenu": [
						[20, 50, 100, 200, 100000],
						[20, 50, 100, 200, "全部"]
					],
					"pageLength": pageLength,
					"serverSide": false,
					"ordering": false,
					"columns": columnsArr,
					"columnDefs": columnDefsArr,
					"dom": '<"printButtons"B>rt<"' + id + '-paginate"ilp>',
					//"dom":'r<"tableBox"t><"'+id+'-paginate"ilp>',
					//"dom": '<"printButtons"B>rt<"tableBox"><"tableBottom"<"tool-bar-body"<"ufma-tool-btns"><"info"<"' + id + '-paginate"ilp>>>><"tableBottomFix"<"tool-bar-body"<"ufma-tool-btns"><"info"<"' + id + '-paginate"ilp>>>>',
					"buttons": [{
						extend: 'excelHtml5',
						text: '<i class="glyphicon icon-upload" aria-hidden="true"></i>',
						exportOptions: {
							columns: '.isprint',
							format: {
								header: function (data, columnIdx) {
									console.log(page.printHead)
									var thisHead = $.inArrayJson(page.printHead, 'index', columnIdx);
									if ($(data).length == 0) {
										return thisHead.pTitle + data;
									} else {
										return thisHead.pTitle + $(data)[0].innerHTML;
									}
								}
							}
						},
						customize: function (xlsx) {
							var sheet = xlsx.xl.worksheets['sheet1.xml'];
						}
					}],
					"initComplete": function () {
						//批量操作toolbar与分页
						$("#printTableData").html("");
						$("#printTableData").append($(".printButtons"));

						$("#printTableData .buttons-excel").css("border-radius", "0 4px 4px 0").addClass("btn-export btn-permission").attr({
							"data-toggle": "tooltip",
							"title": "导出"
						});
						//使用该方法导出的数据前后没有空格,但需要导出全部必须将翻页选择到"全部" guohx  20190709
						//导出begin
						$("#printTableData .buttons-excel").off().on('click', function (evt) {
							evt = evt || window.event;
							evt.preventDefault();
							uf.expTable({
								title: '多栏账',
								topInfo:[
									['单位：'+rpt.nowAgencyCode+' '+rpt.nowAgencyName],
									['账套：'+rpt.nowAcctCode+' '+rpt.nowAcctName],
									['期间：'+$("#dateStart").getObj().getValue()+'至'+$("#dateEnd").getObj().getValue()],
									['科目：'+$('input[id="ACCO-data-key"]').val()+' '+'格式：'+$("#glRptColumnar" + " #style_text").val()],
									['方案名称：'+$("#nowPrjName").html()]
								],
								exportTable: '#' + id
							});
							//ufma.expXLSForDatatable($('#' + id), '多栏账');
						});
						// $("#printTableData .buttons-excel").off().on('click', function (evt) {
						// 	evt = evt || window.event;
						// 	evt.preventDefault();
						// 	ufma.expXLSForDatatable($('#' + id), '多栏账', "", "Multiple");
						// });
						//导出end						
						$('#printTableData.btn-group').css("position", "inherit");
						$('#printTableData div.dt-buttons').css("position", "inherit");
						$('#printTableData [data-toggle="tooltip"]').tooltip();
						page.printHead = rpt.tableHeader(id);
						//驻底begin
						var toolBar = $(this).attr('tool-bar')
						var $info = $(toolBar + ' .info');
						if ($info.length == 0) {
							$info = $('<div class="info"></div>').appendTo($(toolBar + ' .tool-bar-body'));
						}
						$info.html('');
						$('.' + id + '-paginate').appendTo($info);
						ufma.isShow(page.reslist);
						$('#glRptJournalTable_wrapper').ufScrollBar({
							hScrollbar: true,
							mousewheel: false
						});
						// 列宽变动
						$("#glRptJournalTable").colResizable({
							last:1,
							liveDrag:true, 
							// gripInnerHtml:"<div class='grip'></div>", 
							draggingClass:"dragging", 
							resizeMode:'overflow', 
							postbackSafe:true,
							partialRefresh:true,
							onResize: function (e) {
								var isshows = true
								if ($(".headFixedDiv").hasClass('hidden')) {
									isshows = false
								}
								if ($(".headFixedDiv").length > 0) {
									$(".headFixedInnerDiv").html("");
									var t = $("#glRptJournalTable")
									var textAlign = t.find("thead").find("th").eq(1).css("text-align")
									var cloneTable = t.clone();
									cloneTable.appendTo($(".headFixedInnerDiv"))
									$(".headFixedInnerDiv").find("table").addClass("fixedTable")
									var id = $(".headFixedInnerDiv").find("table").attr("id");
									$(".headFixedInnerDiv").find("table").attr("id", id + "fixed")
									// $(".fixedTable").append($(cloneTable).html())
									$(".fixedTable").find("tbody").css("visibility", "hidden")
									$(".headFixedInnerDiv").find("th").find("input[type=checkbox]").closest("label").addClass("hidden")
									$(".headFixedDiv th").css("text-align", textAlign)
								}
								$('#glRptJournalTable_wrapper').ufScrollBar('uploadw');
								$(document).trigger('scroll')
							}
							
						}); 
						//驻底end
						//固定表头
						$("#glRptJournalTable").fixedTableHead();
						// 点击表格行高亮
						rpt.tableTrHighlight();
						$.fn.dataTable.ext.errMode = 'none';
					},
					"drawCallback": function (settings) {
						ufma.dtPageLength($(this));
						$("#" + id).find("tbody tr").each(function () {
							var rowData = page.glRptJournalDataTable.row($(this)).data();
							if (!$.isNull(rowData)) {
								if (rowData.ROW_TYPE == "1" || rowData.ROW_TYPE == "5" || rowData.ROW_TYPE == "7") {
									$(this).css({
										"background-color": "#f0f0f0"
									})
								}
							}
						})
						page.headArr = rpt.tableHeader(id);
						page.glRptJournalTable.find("td.dataTables_empty").text("")
							.append('<img src="' + bootPath + 'images/noData.png"/><br/><i>目前还没有你要查询的数据</i>');
						$(".tableBox").css({
							"overflow-x": "auto"
						});
						if ($(".rpt-table-sub-tip2 i").text() == "万元" && !$(".tdNum").hasClass("wanyuan")) {
							$("td.tdNum").each(function () {
								if ($(this).text() != "") {
									var num = $(this).text().replace(/\,/g, "");
									$(this).text(rpt.comdify(parseFloat(num / 10000).toFixed(6)));
								}
								$(this).addClass("wanyuan");
							})
						}
						//摘要-模糊单项筛选
						rpt.oneSearch(page.glRptJournalTable);

						//搜索隐藏显示--表格模糊搜索
						// rpt.searchHideShow(page.glRptJournalTable);
						ufma.searchHideShow(page.glRptJournalTable);

						//金额区间-范围筛选
						rpt.twoSearch(page.glRptJournalTable);

						//显示/隐藏筛选框
						rpt.isShowFunnelBox();

						//弹出详细凭证
						$(rpt.namespace).find("td span.turn-vou").on("click", function () {
							rpt.openVouShow(this, "glRptJournal");
						})
						$('#glRptJournalTable_wrapper').ufScrollBar({
							hScrollbar: true,
							mousewheel: false
						});
						ufma.setBarPos($(window));
						$('#glRptJournalTable').tblcolResizable();
						setTimeout(function () {
							ufma.isShow(page.reslist);
						}, 300);
						$.fn.dataTable.ext.errMode = 'none';
					}
				});
				return page.glRptJournalDataTable;
			},

			initPageNew: function () {
				$('.rpt-method-tip').tooltip();
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
				// #4422 去掉设置辅助和科目是否显示的按钮 注释以下代码
				// $('#btnShowCol').ufTooltip({
				// 	className: 'p0',
				// 	trigger: 'click', //click|hover
				// 	opacity: 1,
				// 	confirm: false,
				// 	gravity: 'north', //north|south|west|east
				// 	content: "#showColSet",
				// 	onShow: function () {
				// 		dm.showItemCol();
				// 	}
				// });
				//格式
				$('#saveStyle').click(function () {
					$('#styleList').removeClass('hide');
				});
				$('#saveStyle').ufTooltip({
					className: 'p0',
					trigger: 'click', //click|hover
					opacity: 1,
					confirm: false,
					gravity: 'north', //north|south|west|east
					content: "#styleList"
				});

				//打开格式弹窗
				$('#handleStyle').click(function () {
					var accListArr = [];
					for (var i = 1; i < 6; i++) {
						if ($("#accList" + i).getObj().getValue()) {
							accListArr.push($("#accList" + i).getObj().getValue());
						}
					}
					var formCode = $("#style").getObj().getValue();
					if (formCode) {
						if ($.isNull(formCode)) {
							ufma.showTip("请先在格式下拉列表选择你想编辑的格式", function () { }, "warning");
							return false;
						} else {
							var action = 'edit';
							page.openwindow(formCode, accListArr, action);
						}
					} else {
						var action = 'add';
						page.openwindow('', accListArr, action);	
					}
				});
			},

			openwindow: function (formCode, accListArr, action) {
				ufma.open({
					url: 'styleModel.html',
					title: '保存格式',
					width: 740,
					data: {
						"action": action,
						"accsCode": rpt.nowAccsCode,
						"acctCode": rpt.nowAcctCode,
						"accoCode": $('#ACCO-data-key').attr('code'),
						"agencyCode": rpt.nowAgencyCode,
						"setYear": rpt.nowSetYear,
						"userId": rpt.nowUserId,
						"formCode": formCode,
						"rgCode" : rpt.rgCode,
						"accListArr": accListArr,
						"accItemTypeList": rpt.nowAccItemTypeList
					},
					ondestory: function (data) {
						if (data) { // data：格式弹框保存/另存为成功
							rpt.getStyleList($('#ACCO-data-key').attr('code')); // 刷新格式列表
						}
					}
				})
			},

			//初始化页面
			initPage: function () {
				//初始化单位样式
				page.initAgencyScc();
				$("#accList1,#accList2,#accList3,#accList4,#accList5").ufCombox({
					idField: "accItemCode",
					textField: "accItemName",
					placeholder: "请选择",
					onChange: function (sender, data) {
						var raun = true;
						var senderid = sender.attr("id")
						if ($("#" + senderid).getObj().getText() != '请选择') {
							for (var i = 1; i < 6; i++) {
								if ($("#accList" + i).getObj().getValue() == $("#" + senderid).getObj().getValue() && $("#" + senderid).getObj().getText() != '请选择' && senderid != 'accList' + i) {
									raun = false
									ufma.showTip("请勿选择重复辅助项", function () { }, "warning");
									$("#" + senderid).getObj().setValue("", "请选择")
								}
							}
							if (raun) {
								rpt.accHtml(sender, data)
							}
						} else {
							rpt.accHtml(sender, data)
						}
						dm.showItemCol();
					},
					onComplete: function (sender) { }
				});

				var isLoaded = setInterval(function () {
					if (rpt.journalLoaded) {
						clearInterval(isLoaded);
						var myDataFrom = rpt.GetQueryString("dataFrom");
						if (myDataFrom != null && myDataFrom.toString().length > 1) {
							myDataFrom = rpt.GetQueryString("dataFrom");
						}
					}
				}, 100);
				//请求查询条件其他选项列表
				rpt.reqOptList();
			},
			getFirstAcco: function () {
				var argu = {
					"acctCode": rpt.nowAcctCode,
					"agencyCode": rpt.nowAgencyCode,
					"setYear": rpt.nowSetYear,
					"userId": rpt.nowUserId
				};
				ufma.ajaxDef(portList.getFirstAcco, "get", argu, function (result) {
					firstAccoData = result.data;
					if (firstAccoData.lCrItemCodes.length != 0) {
						var _ipt = $('input[id="ACCO-data-key"]');
						_ipt.val(firstAccoData.lCrItemCodes[0].codeName);
						_ipt.attr('code', firstAccoData.lCrItemCodes[0].CHR_CODE);
						$.data(_ipt[0], 'data', [firstAccoData.lCrItemCodes[0]]);
						rpt.nowAccoCode = firstAccoData.lCrItemCodes[0].CHR_CODE;
						rpt.getStyleList(rpt.nowAccoCode);
					} else if (firstAccoData.lDrItemCodes.length != 0) {
						var _ipt = $('input[id="ACCO-data-key"]');
						_ipt.val(firstAccoData.lDrItemCodes[0].codeName);
						_ipt.attr('code', firstAccoData.lDrItemCodes[0].CHR_CODE);
						$.data(_ipt[0], 'data', [firstAccoData.lDrItemCodes[0]]);
						rpt.nowAccoCode = firstAccoData.lDrItemCodes[0].CHR_CODE;
						rpt.reqAccList(); // 重新获取辅助项列表
						rpt.getStyleList(rpt.nowAccoCode);
					}
					firstAccoCode = rpt.nowAccoCode;
					// $("#glRptColumnar-query").trigger("click");
				});
			},

			queryTable: function () {
				if ($('#dateStart').getObj().getValue() > $('#dateEnd').getObj().getValue()) {
					ufma.showTip('开始日期不能大于结束日期！', function () { }, 'error');
					return false;
				}
				pageLength = ufma.dtPageLength('#glRptJournalTable');
					if (!isFirst && hasTable) {
						$('#glRptJournalTable_wrapper').ufScrollBar('destroy');
						page.glRptJournalDataTable.clear().destroy();
					}
				$("#glRptJournalTable").html('')
				
				var arr = [];
				for (var i = 1; i < 6; i++) {
					var name = $("#accList" + i).getObj().getText();
					if (name != "请选择" && !$.isNull(name)) {
						arr.push(name);
					}
				}
				var nary = arr.sort();
				for (var i = 0; i < nary.length; i++) {
					if (nary[i] == nary[i + 1]) {
						ufma.showTip(nary[i] + "重复了!", function () { }, "warning");
						return false;
					}
				}
				var tabArgu = rpt.backTabArgu();

				// 查询时，修改方案的查询次数
				rpt.addQryCount(tabArgu.prjGuid);
				// // 重新查询方案列表
				// rpt.reqPrjList();
				dm.showPlan({
					"agencyCode": rpt.nowAgencyCode,
					"acctCode": rpt.nowAcctCode,
					"rptType": rpt.rptType,
					"userId": rpt.nowUserId,
					"setYear": rpt.nowSetYear
				});
				
				if ($.isNull(tabArgu.prjContent.formCode)) { // 格式代码为空
					if (isFirst || firstAccoCode === $('#ACCO-data-key').attr('code')) {
						if (firstAccoData && firstAccoData.lDrItemCodes) {
							if (isFirst) firstAccoData.lDrItemCodes.shift(); // #4422 没有格式时借方展开，不显示非末级科目
							tabArgu.prjContent.lDrItemCodes = firstAccoData.lDrItemCodes; // 格式的借方展开项
						}
						isFirst = false;
					} else {
						if (isFirst === false && firstAccoCode !== $('#ACCO-data-key').attr('code')) firstAccoCode = '';
						tabArgu.prjContent.lDrItemCodes = []; // 格式的借方展开项
						hasTable = false; // 没有表格
					}
					tabArgu.prjContent.lCrItemCodes = []; // 格式的贷方展开项
				} else {
					if (firstAccoData && firstAccoData.lDrItemCodes) tabArgu.prjContent.lDrItemCodes = firstAccoData.lDrItemCodes; // 格式的借方展开项
					if (firstAccoData && firstAccoData.lCrItemCodes) tabArgu.prjContent.lCrItemCodes = firstAccoData.lCrItemCodes; // 格式的贷方展开项
				}
				ufma.showloading('正在加载数据，请耐心等待...');

				ufma.ajaxDef(portList.getReport, "post", tabArgu, function (result) {
					ufma.hideloading();
					if (result.flag === 'fail') {
						hasTable = false;
					} else {
						var tableData = result.data.tableData;
						page.tablePrintData = result.data.tablePrintData
						page.tablePrintHead = result.data.tablePrintHead
						var ItemsData = {};
						var crData = [];
						var drData = [];
	
						var lCrCodename = result.data.tableHead.crColumns.split(",");
						if ((!$.isNull(lCrCodename)) && (lCrCodename != "")) {
							for (var i = 0; i < lCrCodename.length; i++) {
								var crAcco = lCrCodename[i].split(":")[0];
								var crCols = lCrCodename[i].split(":")[1];
								var lCrItemCodes = {};
								lCrItemCodes['codeName'] = lCrCodename[i].split(":")[0];
								lCrItemCodes['extendField'] = lCrCodename[i].split(":")[1];
								crData.push(lCrItemCodes);
							}
						}
						var lDrCodename = result.data.tableHead.drColumns.split(",");
						if ((!$.isNull(lDrCodename)) && (lDrCodename != "")) {
							for (var i = 0; i < lDrCodename.length; i++) {
								var drAcco = lDrCodename[i].split(":")[0];
								var drCols = lDrCodename[i].split(":")[1];
								var lDrItemCodes = {};
								lDrItemCodes['codeName'] = lDrCodename[i].split(":")[0];
								lDrItemCodes['extendField'] = lDrCodename[i].split(":")[1];
								drData.push(lDrItemCodes);
							}
						}
						ItemsData.lCrItemCodes = crData;
						ItemsData.lDrItemCodes = drData;
						page.getFixedColumns(ItemsData);
						page.initTable(tableData, SANLANColsArr, ItemsData);
						hasTable = true;
					}
				});
			},
			getFixedColumns: function (tableHead) {
				SANLANColsArr = [
				// { //日期-年
				// 	data: "SET_YEAR",
				// 	className: 'nowrap isprint',
				// 	width: 60,
				// 	render: function (data, type, rowdata, meta) {
				// 		if (data == '' || data == null) {
				// 			data = ''
				// 		}
				// 		return ''
				// 	}
				// },
				{ //日期-月
					data: "VOU_MONTH",
					className: 'nowrap isprint tc',
					width: 60
				},
				{ //日期-日
					data: "VOU_DAY",
					className: 'nowrap isprint tc',
					width: 60
				},
				{ //凭证字号
					data: "VOU_NO",
					className: 'nowrap isprint',
					width: 200
				},
				{ //摘要
					data: "DESCPT",
					className: 'ellipsis isprint',
					width: 200,
					render: function (data, type, rowdata, meta) {
						if (data == '' || data == null) {
							data = ''
						}
						return '<span  title="' + data + '">' + data + '</span>'
					}
				},
				{
					data: "DR_AMT",
					className: 'nowrap tr isprint tdNum',
					width: 100,
					render: $.fn.dataTable.render.number(',', '.', 2, '')
				}
				]; //-4借方金额
				for (var i = 0; i < tableHead.lDrItemCodes.length; i++) {
					var title = tableHead.lDrItemCodes[i].codeName;
					var field = tableHead.lDrItemCodes[i].extendField;
					if (title != null && title != "" && field != null && field != "") {
						var obj = {
							data: field,
							width: "60px",
							className: 'nowrap tr isprint tdNum',
							render: $.fn.dataTable.render.number(',', '.', 2, '')
						}
						SANLANColsArr.push(obj);
					}
				}
				SANLANColsArr.push({ //-3贷方金额
					data: "CR_AMT",
					className: 'nowrap tr isprint tdNum',
					width: 100,
					render: $.fn.dataTable.render.number(',', '.', 2, '')
				});
				for (var i = 0; i < tableHead.lCrItemCodes.length; i++) {
					var title = tableHead.lCrItemCodes[i].codeName;
					var field = tableHead.lCrItemCodes[i].extendField;
					if (title != null && title != "" && field != null && field != "") {
						var obj = {
							data: field,
							width: "60px",
							className: 'nowrap tr isprint tdNum',
							render: $.fn.dataTable.render.number(',', '.', 2, '')
						}
						SANLANColsArr.push(obj);
					}
				}
				SANLANColsArr.push({
					data: "DR_CR"
				});
				SANLANColsArr.push({
					data: "STAD_AMT",
					className: 'nowrap tr isprint tdNum',
					width: 100,
					render: $.fn.dataTable.render.number(',', '.', 2, '')
				}); //-1余额
			},
			onEventListener: function () {
				// 修改 CWYXM-19464 bug, 增加了更多点击事件时调用了 分页高度自适应函数
				$(".label-more").on("click", function () {
					var timeId = setTimeout(function () {
						clearTimeout(timeId);
						//金额区间-范围筛选
						// rpt.twoSearch(page.glRptLedgerTable);
						ufma.setBarPos($(window));
					}, 300)

				})
				// #4422 去掉设置辅助和科目是否显示的按钮 注释以下代码
				//zsj---修改bug77802
				// $('#showColSet').mouseout(function () {
				// 	dm.curColA = [];
				// 	$('#showColSet td').each(function (e) {
				// 		var itemType = $(this).attr('data-code');
				// 		var itemName = $(this).attr('data-name');
				// 		if ($('#showColSet tr td[data-code="' + itemType + '"] .isShowCol').is(':checked') && $('#showColSet tr td[data-code="' + itemType + '"] .isSumCol').is(':checked')) {
				// 			dm.curColA.push({
				// 				itemType: itemType,
				// 				isShow: '1',
				// 				isSum: '1'
				// 			});
				// 		} else if ($('#showColSet tr td[data-code="' + itemType + '"] .isShowCol').is(':checked') && !$('#showColSet tr td[data-code="' + itemType + '"] .isSumCol').is(':checked')) {
				// 			dm.curColA.push({
				// 				itemType: itemType,
				// 				isShow: '1',
				// 				isSum: '0'
				// 			});
				// 		} else if (!$('#showColSet tr td[data-code="' + itemType + '"] .isShowCol').is(':checked') && $('#showColSet tr td[data-code="' + itemType + '"] .isSumCol').is(':checked')) {
				// 			dm.curColA.push({
				// 				itemType: itemType,
				// 				isShow: '0',
				// 				isSum: '1'
				// 			});
				// 		} else if (!$('#showColSet tr td[data-code="' + itemType + '"] .isShowCol').is(':checked') && !$('#showColSet tr td[data-code="' + itemType + '"] .isSumCol').is(':checked')) {
				// 			dm.curColA.push({
				// 				itemType: itemType,
				// 				isShow: '0',
				// 				isSum: '0'
				// 			});
				// 		}
				// 	});
				// });
				//方案作用域单选
				rpt.raidoInputGroup("rpt-radio-span");
				//期间单选按钮组
				rpt.raidoBtnGroup("rpt-query-btn-cont-date");
				//按钮提示
				rpt.tooltip();
				//展开更多查询
				rpt.queryBoxMore();
				//绑定日历控件
				var glRptLedgerDate = {
					format: 'yyyy-mm',
					viewMode: 'month',
					initialDate: new Date(),
					onChange: function (fmtDate) {
						rpt.checkDate(fmtDate, "#dateStart")
					}
				};
				var glRptLedgerEndDate = {
					format: 'yyyy-mm',
					viewMode: 'month',
					initialDate: new Date(),
					onChange: function (fmtDate) {
						rpt.checkDate(fmtDate, "#dateEnd")
					}
				};
				$("#dateStart").ufDatepicker(glRptLedgerDate);
				$("#dateEnd").ufDatepicker(glRptLedgerEndDate);
				rpt.dateBenQi("dateStart", "dateEnd");

				//选择期间，改变日历控件的值
				$(rpt.namespace + " #dateBq").on("click", function () {
					rpt.dateBenQi("dateStart", "dateEnd");
				});
				$(rpt.namespace + " #dateBn").on("click", function () {
					rpt.dateBenNian("dateStart", "dateEnd");
				});
				// $(rpt.namespace + " #dateJr").on("click", function () {
				// 	rpt.dateToday("dateStart", "dateEnd");
				// });

				//打开-保存查询方案模态框
				rpt.openSaveMethodModal()

				//确认-保存查询方案
				$('#sureSaveMethod,#saveAs').on('click', function (e) {
					if ($("#methodName").val().trim() != "") {
						rpt.reqSavePrj($(e.target).is('#saveAs'));
					} else {
						ufma.showInputHelp('methodName', '<span class="error">方案名称不能为空</span>');
						$('#methodName').closest('.form-group').addClass('error');
					}
				});
				//输入方案名的提示
				rpt.methodNameTips();
				//编辑表格名称
				rpt.editTableTitle();
				//编辑金额单位
				rpt.changeMonetaryUnit();
				//展开隐藏共享查询方案
				//rpt.showHideShareMethod();

				//查询多栏账
				$("#glRptColumnar-query").on("click", function () {
					//控制查询日期--zsj
					if ($('#dateStart').getObj().getValue() > $('#dateEnd').getObj().getValue()) {
						ufma.showTip('开始日期不能大于结束日期！', function () { }, 'error');
						return false;
					}
					/*pageLength = ufma.dtPageLength('#glRptJournalTable');
					if (!isFirst && hasTable) {
						$('#glRptJournalTable_wrapper').ufScrollBar('destroy');
						page.glRptJournalDataTable.clear().destroy();
					}*/
					page.queryTable();
				})
				//打印
				// $(".btn-print").on("click", function () {
					// var postSetData = {
					// 	reportCode:'GL_RPT_PRINT2',
					// 	templId:'*'
					// }
					// $.ajax({
					// 	type: "POST",
					// 	url: "/pqr/api/iprint/templbycode",
					// 	dataType: "json",
					// 	data: postSetData,
					// 	success: function(data) {
					// 		if(data.status!='error'){
					// 			var printcode= data.data.printCode
					// 			var medata = JSON.parse(data.data.tempContent) 
					// 			var tabArgu = rpt.backTabArgu();
					// 			if ($.isNull(tabArgu.prjContent.formCode)) { // 格式代码为空
					// 				if (isFirst || firstAccoCode === $('#ACCO-data-key').attr('code')) {
					// 					if (firstAccoData && firstAccoData.lDrItemCodes) {
					// 						if (isFirst) firstAccoData.lDrItemCodes.shift(); // #4422 没有格式时借方展开，不显示非末级科目
					// 						tabArgu.prjContent.lDrItemCodes = firstAccoData.lDrItemCodes; // 格式的借方展开项
					// 					}
					// 					isFirst = false;
					// 				} else {
					// 					if (isFirst === false && firstAccoCode !== $('#ACCO-data-key').attr('code')) firstAccoCode = '';
					// 					tabArgu.prjContent.lDrItemCodes = []; // 格式的借方展开项
					// 					hasTable = false; // 没有表格
					// 				}
					// 				tabArgu.prjContent.lCrItemCodes = []; // 格式的贷方展开项
					// 			} else {
					// 				if (firstAccoData && firstAccoData.lDrItemCodes) tabArgu.prjContent.lDrItemCodes = firstAccoData.lDrItemCodes; // 格式的借方展开项
					// 				if (firstAccoData && firstAccoData.lCrItemCodes) tabArgu.prjContent.lCrItemCodes = firstAccoData.lCrItemCodes; // 格式的贷方展开项
					// 			}
					// 			tabArgu.prjContent.pageLength =data.data.rowNum
					// 			var runNum = data.data.rowNum
					// 			ufma.ajaxDef('/gl/rpt/getReportPrintCloudData/GL_RPT_COLUMNAR', "post", tabArgu, function (result) {
					// 				var outTableData = {}
					// 				outTableData.agency=page.cbAgency.getText()
					// 				outTableData.times = $("#dateStart").getObj().getValue()+'至'+$("#dateEnd").getObj().getValue()
					// 				outTableData.acco = $('input[id="ACCO-data-key"]').val()
					// 				outTableData.printor = rpt.nowUserName
					// 				outTableData.startPage = 1
					// 				outTableData.logo = '/pf/pub/css/logo.png'
					// 				outTableData.date = rpt.today
					// 				outTableData.title = '多栏账'
					// 				outTableData.showWatermark = true
					// 				var pagelen = result.data.tableData.length
					// 				outTableData.totalPage= Math.ceil(pagelen/runNum)
					// 				result.data.outTableData = outTableData
					// 				if(result.data.tableHead.crColumns == undefined){
					// 					result.data.tableHead.crColumns=[]
					// 				}
					// 				if(result.data.tableHead.drColumns == undefined){
					// 					result.data.tableHead.drColumns=[]
					// 				}
					// 				for(var i=0;i<result.data.tableData.length;i++){
					// 					for(var z in result.data.tableData[i]){
					// 						if(result.data.tableData[i][z]!='' && !isNaN(result.data.tableData[i][z])){
					// 							if(z.substring(0,6) == 'DR_AMT' || z.substring(0,6) == 'CR_AMT' || z=='STAD_AMT'){
					// 								result.data.tableData[i][z] = parseFloat(result.data.tableData[i][z]).toFixed(2)
					// 							}
					// 						}
					// 					}
					// 				}
					// 				var names = medata.template
					// 				// var  tempdata = YYPrint.register({ names });
					// 				// result.data.tableHead.columns =result.data.tableHead.crcolumns
					// 				var html = YYPrint.engine(medata.template,medata.meta, result.data);
					// 				YYPrint.print(html)
					// 			})
					// 		}else{
					// 			ufma.showTip("云服务未启用", function () { }, "warning")
					// 		}
					// 	},
					// 	error: function() {}
					// });
				// })
				$(".btn-print").on("click", function () {
					page.editor = ufma.showModal('tableprint', 450, 350);
					var postSetData = {
						agencyCode: rpt.nowAgencyCode,
						acctCode: rpt.nowAcctCode,
						componentId: $('#rptType option:selected').val(),
						rgCode: pfData.svRgCode,
						setYear: pfData.svSetYear,
						sys: '100',
						directory: '多栏账'
					};
					$.ajax({
						type: "POST",
						url: "/pqr/api/templ",
						dataType: "json",
						data: postSetData,
						success: function (data) {
							var data = data.data;
							$('#rptTemplate').html('')
							for (var i = 0; i < data.length; i++) {
								var jData = data[i].reportCode
								$op = $('<option templId = ' + data[0].templId + ' valueid="' + data[i].reportCode + '" value="' + jData + '">' + data[i].reportName + '</option>');
								$('#rptTemplate').append($op);
							}
						},
						error: function () { }
					});
				})
				$(".btn-prints").off().on("click", function () {
					var postSetData = {
						reportCode:'GL_RPT_PRINT2',
						templId:'*'
					}
					$.ajax({
						type: "POST",
						url: "/pqr/api/iprint/templbycode",
						dataType: "json",
						data: postSetData,
						success: function(data) {
							if(data.status!='error'){
								var printcode= data.data.printCode
								var medata = JSON.parse(data.data.tempContent) 
								var tabArgu = rpt.backTabArgu();
								if ($.isNull(tabArgu.prjContent.formCode)) { // 格式代码为空
									if (isFirst || firstAccoCode === $('#ACCO-data-key').attr('code')) {
										if (firstAccoData && firstAccoData.lDrItemCodes) {
											if (isFirst) firstAccoData.lDrItemCodes.shift(); // #4422 没有格式时借方展开，不显示非末级科目
											tabArgu.prjContent.lDrItemCodes = firstAccoData.lDrItemCodes; // 格式的借方展开项
										}
										isFirst = false;
									} else {
										if (isFirst === false && firstAccoCode !== $('#ACCO-data-key').attr('code')) firstAccoCode = '';
										tabArgu.prjContent.lDrItemCodes = []; // 格式的借方展开项
										hasTable = false; // 没有表格
									}
									tabArgu.prjContent.lCrItemCodes = []; // 格式的贷方展开项
								} else {
									if (firstAccoData && firstAccoData.lDrItemCodes) tabArgu.prjContent.lDrItemCodes = firstAccoData.lDrItemCodes; // 格式的借方展开项
									if (firstAccoData && firstAccoData.lCrItemCodes) tabArgu.prjContent.lCrItemCodes = firstAccoData.lCrItemCodes; // 格式的贷方展开项
								}
								tabArgu.prjContent.pageLength =data.data.rowNum
								var runNum = data.data.rowNum
								ufma.ajaxDef('/gl/rpt/getReportPrintCloudData/GL_RPT_COLUMNAR', "post", tabArgu, function (result) {
									var rseulttabledata = JSON.parse(JSON.stringify(result.data.tableData))
									var tableheads = JSON.parse(JSON.stringify(result.data.tableHead))
									var onestartpage = 1
									function printsss(rseulttabledata){
										var rseulttabledatas = rseulttabledata
										var isedit= false;
										if(rseulttabledata.length>2000){
											isedit = true;
											rseulttabledatas = rseulttabledata.splice(0, 2000)
										}
										var bdata={
											tableHead:tableheads,
											tableData:rseulttabledatas
										}
										if(bdata.tableHead.crColumns == undefined){
											bdata.tableHead.crColumns=[]
										}
										if(bdata.tableHead.drColumns == undefined){
											bdata.tableHead.drColumns=[]
										}
										var outTableData = {}
										outTableData.agency=page.cbAgency.getText()
										outTableData.times = $("#dateStart").getObj().getValue()+'至'+$("#dateEnd").getObj().getValue()
										outTableData.acco = $('input[id="ACCO-data-key"]').val()
										outTableData.printor = rpt.nowUserName
										outTableData.startPage = onestartpage
										outTableData.logo = '/pf/pub/css/logo.png'
										outTableData.date = rpt.today
										outTableData.title = '多栏账'
										outTableData.showWatermark = true
										var pagelen = result.data.tableData.length
										outTableData.totalPage= Math.ceil(pagelen/runNum)
										onestartpage = onestartpage +outTableData.totalPage
										bdata.outTableData = outTableData
										var chaj={
											sendType:'art',
											appType:1,
											printDomain:'https:' == document.location.protocol ? "https://" + window.location.host : "http://" + window.location.host,
											data:{
												template:medata.template,
												meta:medata.meta,
												bdata: bdata
											}
										}
										$.ajax({
											url: 'http://127.0.0.1:9641/directprint',
											type: 'POST', //GET
											async: false, //或false,是否异步
											data:JSON.stringify(chaj),
											dataType: 'json', //返回的数据格式：json/xml/html/script/jsonp/text
											contentType: 'application/json; charset=utf-8',
											success: function(data) {
												if(data.status==0){
													if(isedit){
														printsss(rseulttabledata)
													}
												}else{
													ufma.showTip('打印失败，批打插件未接受数据')
												}
											},
											error: function(jqXHR, textStatus) {
											}
										});
									}
									printsss(rseulttabledata)
								})
							}else{
								ufma.showTip("云服务未启用", function () { }, "warning")
							}
						},
						error: function() {}
					});
				})
				$("#btn-tableprintsave").off().on('click', function () {
					var xhr = new XMLHttpRequest()
					var formData = new FormData()
					formData.append('reportCode', $('#rptTemplate option:selected').attr('valueid'))
					formData.append('templId',$('#rptTemplate option:selected').attr('templId'))
					var datas = [{
						"GL_RPT_PRINT": page.tablePrintData,
						'GL_RPT_HEAD_EXT': [page.tablePrintHead]
					}]
					formData.append('groupDef', JSON.stringify(datas))
					xhr.open('POST', '/pqr/api/printpdfbydata', true)
					xhr.setRequestHeader('context-type', 'text/xml;charset=utf-8')
					xhr.responseType = 'blob'

					//保存文件
					xhr.onload = function(e) {
						if(xhr.status === 200) {
							if(xhr.status === 200) {
								var content = decodeURIComponent(xhr.getResponseHeader('Content-Disposition'))
								window.open(content, '_blank', 'titlebar=no,location=no,toolbar=no,menubar=no;top=100')
							}
						}
					}

					//状态改变时处理返回值
					xhr.onreadystatechange = function() {
						if(xhr.readyState === 4) {
							//通信成功时
							if(xhr.status === 200) {
								//交易成功时
								ufma.hideloading();
							} else {
								var content = decodeURIComponent(xhr.getResponseHeader('Content-Disposition'))
								//提示框，各系统自行选择插件
								alert(content)
								ufma.hideloading();
							}
						}
					}
					xhr.send(formData)
					page.editor.close();
				});
				$("#btn-tableprintqx").off().on('click', function () {
					page.editor.close();
				})
			},

			//此方法必须保留
			init: function () {
				page.reslist = ufma.getPermission();
				ptData = ufma.getCommonData();
				this.initPage();
				this.onEventListener();
				this.initPageNew();
				ufma.parseScroll();
				ufma.parse();
			}
		}
	}();

	/////////////////////
	page.init();
});