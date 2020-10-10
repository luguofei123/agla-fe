$(function() {
	var pageLength = ufma.dtPageLength('#glRptLedgerTable');
	var page = function() {

		var glRptLedgerDataTable; //全局datatable对象
		var glRptLedgerTable; //全局table的ID
		var glRptLedgerThead; //全局table的头部ID
		var isCrossDomain = false;

		//总账所用接口
		var portList = {
			getReport: "/gl/rpt/getReportData/GL_RPT_LEDGER" //请求表格数据
		};
		var SANLANColsArr = [{
			data: "setYear",
			class: "tc"
		}, //0年
		{
			data: "fisPerd",
			class: "tc"
		}, //1月
		{
			data: "rowType"
		}, //-6行类型 	只有当rowType=1时，才允许联查
		{
			data: "descpt"
		}, //-5摘要
		{
			data: "drAmt",
			className: 'tdNum isprint',
			width: 170
		}, //-4借方金额
		{
			data: "crAmt",
			className: 'tdNum isprint',
			width: 170
		}, //-3贷方金额
		{
			data: "balSign",
			class: "tc"
		}, //-2方向
		{
			data: "balAmt",
			className: 'tdNum isprint',
			width: 170
		} //-1余额
		];
		//外币式
		var WAIBIColsArr = [{
			data: "setYear",
			class: "tc"
		}, //-11年
		{
			data: "fisPerd",
			class: "tc"
		}, //-10月
		{
			data: "rowType"
		}, //-9行类型 	只有当rowType=1时，才允许联查
		{
			data: "descpt"
		}, //-8摘要

		{
			data: "curdrAmt",
			className: 'nowrap isprint tdNum',
			width: 170
		}, //-7借方金额-外币
		{
			data: "drAmt",
			className: 'nowrap tr isprint tdNum',
			width: 170
		}, //-6借方金额-本币
		{
			data: "curcrAmt",
			className: 'nowrap tr isprint tdNum',
			width: 170
		}, //-5贷方金额-外币
		{
			data: "crAmt",
			className: 'nowrap tr isprint tdNum',
			width: 170
		}, //-4贷方金额-本币
		{
			data: "balSign",
			className: 'nowrap tc isprint ',
		}, //-3方向
		{
			data: "curbalAmt",
			className: 'nowrap tr isprint tdNum',
			width: 170
		}, //-2余额-外币
		{
			data: "balAmt",
			className: 'nowrap tr isprint tdNum',
			width: 170
		} //-1余额-本币
		];
		var SANLANhtml1;
		var SANLANhtml2;

		var WAIBIhtml1;
		var WAIBIhtml2;
		return {

			//表格初始化
			newTable: function (columnsArr, dataArr, type) {
				var id = "glRptLedgerTable"; //表格id
				var toolBar = $('#' + id).attr('tool-bar');
				var columnDefsArr = [];
				if (type == "SANLAN") {
					columnDefsArr = [{
						"targets": [-6],
						"visible": false
					},
					{
						"targets": [-5],
						"render": function (data, type, full, meta) {
							if (data != null) {
								if (full.rowType == "1" || full.rowType == "8") {
									return '<span class="turn-vou" data-year="' + full.setYear + '" data-month="' + full.fisPerd + '">' + data + '</span>';
								} else {
									return data;
								}
							} else {
								return "";
							}
						}
					},
					{
						"targets": [0, 1, -5, -2],
						"className": "isprint"
					},
					{
						"targets": [-4, -3, -1],
						"className": "tdNum isprint",
						"render": $.fn.dataTable.render.number(',', '.', 2, '')
					}
					]
				}
				else if (type == "WAIBI") {
					columnDefsArr = [{
						"targets": [-9],
						"visible": false
					},
					{
						"targets": [-8],
						"render": function (data, type, full, meta) {
							if (data != null) {
								if (full.rowType == "1" || full.rowType == "8") {
									return '<span class="turn-vou" data-year="' + full.setYear + '" data-month="' + full.fisPerd + '">' + data + '</span>';
								} else {
									return data;
								}
							} else {
								return "";
							}
						}
					},
					{
						"targets": [0, 1, -8, -3],
						"className": "isprint"
					},
					{
						"targets": [-7, -6, -5, -4, -2, -1],
						"className": "tdNum isprint",
						"render": $.fn.dataTable.render.number(',', '.', 2, '')
					}
					]
				}
				page.glRptLedgerDataTable = page.glRptLedgerTable.DataTable({
					"language": {
						"url": bootPath + "agla-trd/datatables/datatable.default.js"
					},
					"fixedHeader": {
						header: true,
						footer: true
					},
					"data": dataArr,
					"processing": true, //显示正在加载中
					"pagingType": "full_numbers", //分页样式
					"lengthChange": true, //是否允许用户自定义显示数量p
					"lengthMenu": [
						[20, 50, 100, 200, 100000],
						[20, 50, 100, 200, "全部"]
					],
					"pageLength": pageLength,
					"ordering": false,
					"columns": columnsArr,
					"columnDefs": columnDefsArr,
					"dom": '<"printButtons"B>rt<"' + id + '-paginate"ilp>',
					//"dom": '<"printButtons"B>rt<"tableBottom"<"tool-bar-body"<"ufma-tool-btns"><"info"<"' + id + '-paginate"ilp>>>><"tableBottomFix"<"tool-bar-body"<"ufma-tool-btns"><"info"<"' + id + '-paginate"ilp>>>>',
					"buttons": [{
						extend: 'excelHtml5',
						text: '<i class="glyphicon icon-upload" aria-hidden="true"></i>',
						exportOptions: {
							columns: '.isprint',
							format: {
								header: function(data, columnIdx) {
									if($(data).length == 0) {
										return data;
									} else {
										return $(data)[0].innerHTML;
									}
								}
							}
						},
						customize: function(xlsx) {
							var sheet = xlsx.xl.worksheets['sheet1.xml'];
						}
					}],
					"initComplete": function() {
						$("#printTableData").html("");
						$("#printTableData").append($(".printButtons"));

						$("#printTableData .buttons-excel").css("border-radius", "0 4px 4px 0").addClass("btn-export btn-permission").attr({
							"data-toggle": "tooltip",
							"title": "导出"
						});
						//使用该方法导出的数据前后没有空格,但需要导出全部必须将翻页选择到"全部" guohx  20190709
						//导出begin
						$("#printTableData .buttons-excel").off().on('click', function(evt) {
							evt = evt || window.event;
							evt.preventDefault();
							uf.expTable({
								title:'总账',
								topInfo:[
										['单位：'+rpt.nowAgencyCode+' '+rpt.nowAgencyName + ' （账套：'+rpt.nowAcctCode+' '+rpt.nowAcctName + '）'],
										['期间：'+$("#dateStart").getObj().getValue()+'至'+$("#dateEnd").getObj().getValue() + " （单位：元）"],
										['科目：'+$('input[id="ACCO-data-key"]').val()],
										['方案名称：'+$("#nowPrjName").html()]
									],
								exportTable: '#' + id
							});
							//ufma.expXLSForDatatable($('#' + id), '总账');
						});
						// var topInfo = [['科目：' + $('input[id="ACCO-data-key"]').val()]];
						// $("#printTableData .buttons-excel").off().on('click', function (evt) {
						// 	evt = evt || window.event;
						// 	evt.preventDefault();
						// 	ufma.expXLSForDatatable($('#' + id), '总账', topInfo, "Multiple");
						// });
						//导出end							
						$('#printTableData.btn-group').css("position", "inherit");
						$('#printTableData div.dt-buttons').css("position", "inherit");
						$('#printTableData [data-toggle="tooltip"]').tooltip();
						//驻底begin
						var toolBar = $(this).attr('tool-bar')
						var $info = $(toolBar + ' .info');
						if($info.length == 0) {
							$info = $('<div class="info"></div>').appendTo($(toolBar + ' .tool-bar-body'));
						}
						$info.html('');
						$('.' + id + '-paginate').appendTo($info);

						$('#' + id).closest('.dataTables_wrapper').ufScrollBar({
							hScrollbar: true,
							mousewheel: false
						});
						ufma.setBarPos($(window));
						//驻底end
						$('#glRptLedgerTable').tblcolResizable();
						//固定表头
						$("#glRptLedgerTable").fixedTableHead();
						//金额区间-范围筛选
						rpt.twoSearch(page.glRptLedgerTable);
						// 点击表格行高亮
						rpt.tableTrHighlight();
					},
					"drawCallback": function(settings) {
						ufma.dtPageLength($(this));
						page.glRptLedgerTable.find("td.dataTables_empty").text("")
							.append('<img src="' + bootPath + 'images/noData.png"/><br/><i>目前还没有你要查询的数据</i>');

						if($(".rpt-table-sub-tip2 i").text() == "万元" && !$(".tdNum").hasClass("wanyuan")) {
							$("td.tdNum").each(function() {
								if($(this).text() != "") {
									var num = $(this).text().replace(/\,/g, "");
									$(this).text(rpt.comdify(parseFloat(num / 10000).toFixed(6)));
								}
								$(this).addClass("wanyuan");
							})
						}

						//弹出明细账
						$(rpt.namespace).find("td span").on("click", function() {
							page.openJournalShow(this);
						});
						
						$("#glRptLedgerTable").fixedTableHead();
						setTimeout(function() {
							ufma.isShow(page.reslist);
							ufma.setBarPos($(window));
							$(window).scrollTop($(window).scrollTop()+1)
						}, 300);

						//摘要-模糊单项筛选
						rpt.oneSearch(page.glRptLedgerTable);
						//显示/隐藏筛选框
						rpt.isShowFunnelBox();
						//金额区间-范围筛选
						// rpt.twoSearch(page.glRptLedgerTable);
					}
				});

				return page.glRptLedgerDataTable;
			},

			//总账联查明细账
			openJournalShow: function(dom) {
				sessionStorage.removeItem(rpt.journalFormLedger);

				var endYear = (new Date($("#dateEnd").getObj().getValue())).getFullYear(); //截止年度(只有年，如2017)
				var endFisperd = (new Date($("#dateEnd").getObj().getValue())).getMonth() + 1; //截止期间(只有月份，如7)

				var tdd = new Date(endYear, endFisperd, 0);
				var ddDay = tdd.getDate();

				var startDate = $("#dateStart").getObj().getValue() + "-01"; //开始日期
				// var startDate = startYear + "-01-01"; //开始日期
				var endDate = $("#dateEnd").getObj().getValue() + "-" + ddDay; //结束日期

				var accaCode = $(rpt.namespace + " #accaList").find(".btn-primary").data("code"); //会计体系

				var ACCOitems = rpt.qryItemsArr(); // 选中会计科目代码数组

				//var rptOption = rpt.rptOptionArr();//其他查询项

				var IS_INCLUDE_UNPOST = $("#IS_INCLUDE_UNPOST").prop("checked");
				var IS_INCLUDE_JZ = $("#IS_INCLUDE_JZ").prop("checked");
				//				console.info(IS_INCLUDE_UNPOST+","+IS_INCLUDE_JZ);

				// 格式和币种
				var formatType = $("#geshi").find("option:selected").attr('value');
				var formatTypeVal = $("#geshi").find("option:selected").text();
				var currencyType = $("#geshi").find("option:selected").attr('value') === "WAIBI" ? $(".rpt-table-sub-tip-currency").find("option:selected").attr('value') : '';
				var currencyTypeVal = $("#geshi").find("option:selected").attr('value') === "WAIBI" ? $(".rpt-table-sub-tip-currency").find("option:selected").text() : '';

				if(IS_INCLUDE_UNPOST) {
					IS_INCLUDE_UNPOST = "Y"
				} else {
					IS_INCLUDE_UNPOST = "N"
				}

				if(IS_INCLUDE_JZ) {
					IS_INCLUDE_JZ = "Y"
				} else {
					IS_INCLUDE_JZ = "N"
				}
				var arguObj = {
					"acctCode": rpt.nowAcctCode,
					//						"acctName":rpt.nowAcctName,
					"agencyCode": rpt.nowAgencyCode,
					//						"agencyName":rpt.nowAgencyName,
					"prjCode": "",
					"prjName": "",
					"prjScope": "",
					"rptType": "GL_RPT_JOURNAL",
					"setYear": rpt.nowSetYear,
					"userId": rpt.nowUserId,
					"prjContent": {
						"accaCode": accaCode,
						"agencyAcctInfo": [{
							"acctCode": rpt.nowAcctCode,
							"agencyCode": rpt.nowAgencyCode
						}],
						"startDate": startDate,
						"endDate": endDate,
						"startYear": "",
						"startFisperd": "",
						"endYear": "",
						"endFisperd": "",
						"formatType": formatType,
						"formatTypeVal": formatTypeVal,
						"currencyType": currencyType,
						"currencyTypeVal": currencyTypeVal,
						"qryItems": ACCOitems,
						"rptCondItem": [],
						"rptOption": [{
								"defCompoValue": IS_INCLUDE_UNPOST,
								"optCode": "IS_INCLUDE_UNPOST",
								"optName": "含未记账凭证"
							},
							{
								"defCompoValue": IS_INCLUDE_JZ,
								"optCode": "IS_INCLUDE_JZ",
								"optName": "含结转凭证"
							},
							{
								"defCompoValue": "N",
								"optCode": "IS_JUSTSHOW_OCCFISPERD",
								"optName": "只显示有发生期间"
							}
						],
						"curCode": "RMB",
						"rptStyle": "SANLAN",
						"rptTitleName": "明细账"
					}
				};

				$("a[name='period']").each(function() {
					if($(this).hasClass("selected")) {
						arguObj.timeBtn = $(this).attr("id");
					}
				});
				// arguObj.timeBtn = $("a[name='period']").find("button[class='btn btn-primary']").attr("id");
				var arguStr = JSON.stringify(arguObj);
				rpt.journalFormLedger = ufma.sessionKey(rpt.module, rpt.compoCode, rpt.rgCode, rpt.nowSetYear, rpt.nowAgencyCode, rpt.nowAcctCode, "journalFormLedger");
				sessionStorage.setItem("rpt.journalFormLedger", rpt.journalFormLedger);
				sessionStorage.setItem(rpt.journalFormLedger, arguStr);
				rpt.sessionKeyArr.push(rpt.journalFormLedger);
				//				window.location.href = '../glRptJournal/glRptJournal.html?dataFrom=glRptLedger&action=query';
				
				var baseUrl = '/gl/rpt/glRptJournal/glRptJournal.html?menuid=' + rpt.journalMenuId + '&dataFrom=glRptLedger&action=query';
				baseUrl = '/pf' + baseUrl ;
				uf.openNewPage(page.isCrossDomain, $(this), 'openMenu', baseUrl, false, "明细账");
			},

			//初始化页面
			initPage: function() {
				//增加筛选框
				$(rpt.namespace + " #SANLAN  .thTitle.rpt-th-zhaiyao-5").after($(rpt.backOneSearchHtml("摘要内容", "-5")));
				$(rpt.namespace + " #SANLAN  .thTitle.rpt-th-jine-4").after($(rpt.backTwoSearchHtml("rpt-funnelBoxNum", "金额区间", "-4")));
				$(rpt.namespace + " #SANLAN  .thTitle.rpt-th-jine3-3").after($(rpt.backTwoSearchHtml("rpt-funnelBoxNum3", "金额区间", "-3")));
				$(rpt.namespace + " #SANLAN  .thTitle.rpt-th-jine3-1").after($(rpt.backTwoSearchHtml("rpt-funnelBoxNum3", "金额区间", "-1")));

				$(rpt.namespace + " #WAIBI  .thTitle.rpt-th-zhaiyao-8").after($(rpt.backOneSearchHtml("摘要内容", "-8")));
				$(rpt.namespace + " #WAIBI  .thTitle.rpt-th-jine-7").after($(rpt.backTwoSearchHtml("rpt-funnelBoxNum", "金额区间", "-7")));
				$(rpt.namespace + " #WAIBI  .thTitle.rpt-th-jine-6").after($(rpt.backTwoSearchHtml("rpt-funnelBoxNum3", "金额区间", "-6")));
				$(rpt.namespace + " #WAIBI  .thTitle.rpt-th-jine-5").after($(rpt.backTwoSearchHtml("rpt-funnelBoxNum3", "金额区间", "-5")));
				$(rpt.namespace + " #WAIBI  .thTitle.rpt-th-jine-4").after($(rpt.backTwoSearchHtml("rpt-funnelBoxNum", "金额区间", "-4")));
				$(rpt.namespace + " #WAIBI  .thTitle.rpt-th-jine-2").after($(rpt.backTwoSearchHtml("rpt-funnelBoxNum3", "金额区间", "-2")));
				$(rpt.namespace + " #WAIBI  .thTitle.rpt-th-jine-1").after($(rpt.backTwoSearchHtml("rpt-funnelBoxNum3", "金额区间", "-1")));
				page.SANLANhtml1 = $("#SANLAN tr").eq(0).html();
				page.SANLANhtml2 = $("#SANLAN tr").eq(1).html();

				page.WAIBIhtml1 = $("#WAIBI tr").eq(0).html();
				page.WAIBIhtml2 = $("#WAIBI tr").eq(1).html();
				//需要根据自己页面写的ID修改
				page.glRptLedgerTable = $('#glRptLedgerTable'); //当前table的ID
				page.glRptLedgerThead = $('#glRptLedgerThead'); //当前table的头部ID

				$('#glRptLedgerTable tbody').html('');
				page.glRptLedgerThead.html('<tr>' + page.SANLANhtml1 + '</tr><tr>' + page.SANLANhtml2 + '</tr>');
				page.glRptLedgerDataTable = page.newTable(SANLANColsArr, [], "SANLAN");
				//page.glRptLedgerDataTable.ajax.url("glRptLedger.json");

				//初始化单位样式
				rpt.initAgencyList();

				//初始化账套样式
				rpt.initAcctList();

				//请求单位列表
				rpt.reqAgencyList();

				// 账表数据范围选择框记忆上次选择的数据
				rpt.getSysRuleSet();

				//revise
				$("#accList1,#accList2,#accList3,#accList4,#accList5").ufCombox({
					idField: "accItemCode",
					textField: "accItemName",
					placeholder: "请选择",
                    readonly: true,
					onChange: function(sender, data) {
						var raun = true;
						var senderid = sender.attr("id")
						if($("#" + senderid).getObj().getText() != '请选择') {
							for(var i = 1; i < 6; i++) {
								if($("#accList" + i).getObj().getValue() == $("#" + senderid).getObj().getValue() && $("#" + senderid).getObj().getText() != '请选择' && senderid != 'accList' + i) {
									raun = false
									ufma.showTip("请勿选择重复辅助项", function() {}, "warning");
									$("#" + senderid).getObj().setValue("", "请选择")
								}
							}
							if(raun) {
								rpt.accHtml(sender, data)
							}
						} else {
							rpt.accHtml(sender, data)
						}
						dm.showItemCol();
					},
					onComplete: function(sender) {

					}
				});

				//请求会计体系列表
				//rpt.reqAccaList();

				//请求查询条件其他选项列表
				rpt.reqOptList();

			},

			//页面元素事件绑定使用jquery 的 on()方法
			onEventListener: function() {
				$(".label-more").on("click", function () {
					var timeId = setTimeout(function () {
						clearTimeout(timeId);
						//金额区间-范围筛选
						rpt.twoSearch(page.glRptLedgerTable);
						// 修改 CWYXM-19464 bug, 调用了 分页高度自适应函数
						ufma.setBarPos($(window));
					}, 300)

				})
				//方案作用域单选
				rpt.raidoInputGroup("rpt-radio-span");
				//期间单选按钮组
				//rpt.raidoBtnGroup("rpt-query-btn-cont-date");
				$(rpt.namespace).find(".change-rpt-type,.rpt-table-sub-tip-currency").on("click", "i", function () {
					$(this).hide();
					$(this).siblings("select").show();
				});
				$(rpt.namespace).find(".rpt-table-sub-tip-currency").on("change", "select", function () {
					var tableData = [];
					$(this).siblings("i").attr("data-type", $(this).val());
					$(this).hide();
					$(this).siblings("i").text($(this).find("option:checked").text()).show();
					pageLength = ufma.dtPageLength('#glRptLedgerTable');
					$('#glRptLedgerTable_wrapper').ufScrollBar('destroy');
					page.glRptLedgerDataTable.clear().destroy();
					page.glRptLedgerThead.html('<tr>' + page.WAIBIhtml1 + '</tr><tr>' + page.WAIBIhtml2 + '</tr>');
					$('#glRptLedgerTable tbody').html('');
					page.glRptLedgerDataTable = page.newTable(WAIBIColsArr, tableData, "WAIBI");
				});
				$(rpt.namespace).find(".change-rpt-type").on("change", "select", function () {
					pageLength = ufma.dtPageLength('#glRptLedgerTable');
					$('#glRptLedgerTable_wrapper').ufScrollBar('destroy');
					page.glRptLedgerDataTable.clear().destroy();
					var columnsArr = [];
					var tableData = [];
					$(this).siblings("i").attr("data-type", $(this).val());
					if ($(this).val() == "SANLAN") {
						page.glRptLedgerThead.html('<tr>' + page.SANLANhtml1 + '</tr><tr>' + page.SANLANhtml2 + '</tr>');
						$('#glRptLedgerTable tbody').html('');
						columnsArr = SANLANColsArr;
						$(".rpt-table-sub-tip-currency").hide();
					} else if ($(this).val() == "WAIBI") {
						page.glRptLedgerThead.html('<tr>' + page.WAIBIhtml1 + '</tr><tr>' + page.WAIBIhtml2 + '</tr>');
						$('#glRptLedgerTable tbody').html('');
						columnsArr = WAIBIColsArr;
						$(".rpt-table-sub-tip-currency").show();
					}
					page.glRptLedgerDataTable = page.newTable(columnsArr, tableData, $(this).val());
					$(this).hide();
					$(this).siblings("i").text($(this).find("option:checked").text()).show();
				});

				//按钮提示
				rpt.tooltip();

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
				$(" #dateBq").on("click", function() {
					rpt.dateBenQi("dateStart", "dateEnd");
				});
				$(" #dateBn").on("click", function() {
					rpt.dateBenNian("dateStart", "dateEnd");
				});

				//单选会计体系
				$(rpt.namespace + " #accaList").on("click", "button", function() {
					if(!$(this).hasClass("btn-primary")) {
						//sessionStorage.clear();
						if(rpt.sessionKeyArr.length > 0) {
							for(var i = 0; i < rpt.sessionKeyArr.length; i++) {
								sessionStorage.removeItem(rpt.sessionKeyArr[i]);
							}
						}
						//还原查询条件
						rpt.clearTagsTree();
						$(this).addClass("btn-primary").removeClass("btn-default");
						$(this).siblings("button").removeClass("btn-primary").addClass("btn-default");
					}
				})

				//打开-保存查询方案模态框
				rpt.openSaveMethodModal();

				//确认-保存查询方案
				$('#sureSaveMethod,#saveAs').on('click', function(e) {
					if($("#methodName").val().trim() != "") {
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

				//搜索隐藏显示--表格模糊搜索
				// rpt.searchHideShow(page.glRptLedgerTable);
				ufma.searchHideShow(page.glRptLedgerTable);

				//显示更多查询方案
				//rpt.showMoreMethod();



				//查询总表
				$("#glRptLedger-query").on("click", function() {
					if($('#dateStart').getObj().getValue() > $('#dateEnd').getObj().getValue()) {
						ufma.showTip('开始月份不能大于结束月份！', function() {}, 'error');
						return false;
					}

					var domUl = $("#ACCO-data-key").parents(".rpt-tree-view").find(".rpt-tags-list");
					var tabArgu = rpt.backTabArgu();
					// var isTrue = false;
					var qryItems = tabArgu.prjContent.qryItems;
					//总账里辅助项必需有一条确定的项才可以查询
					//判断辅助项，如果没有选择辅助项提示选择，若选择了辅助项，没有选择具体项提示选择具体项，
					/*if(qryItems.length <= 0) {
						ufma.showTip("请选择辅助项！", function() {}, "warning");
						return false;
					} else {
						for(var i = 0; i < qryItems.length; i++) {
							if(qryItems[i].items.length == 0) {
								ufma.showTip("请选择" + qryItems[i].itemTypeName + "！", function() {
									$("#" + qryItems[i].itemType + "-data-key").focus();
								}, "warning");
								return false;
							}
						}
					}*/

					//请求查询
					var tabArgu = rpt.backTabArgu();
					ufma.showloading('正在加载数据，请耐心等待...');

					// 查询时，修改方案的查询次数
					rpt.addQryCount(tabArgu.prjGuid);
					// 重新查询方案列表
					rpt.reqPrjList();

					ufma.ajax(portList.getReport, "post", tabArgu, function(result) {
						ufma.hideloading();
						var tableHead = result.data.tableHead;
						var tableData = result.data.tableData;
						pageLength = ufma.dtPageLength('#glRptLedgerTable');

						$('#glRptLedgerTable_wrapper').ufScrollBar('destroy');
						page.glRptLedgerDataTable.clear().destroy();
						var nowTabType = $(".change-rpt-type i").attr("data-type");
						if (nowTabType == "SANLAN") {
							page.glRptLedgerThead.html('<tr>' + page.SANLANhtml1 + '</tr><tr>' + page.SANLANhtml2 + '</tr>');
							$('#glRptLedgerTable tbody').html('');
							page.glRptLedgerDataTable = page.newTable(SANLANColsArr, tableData, "SANLAN");
						} else if (nowTabType == "WAIBI") {
							page.glRptLedgerThead.html('<tr>' + page.WAIBIhtml1 + '</tr><tr>' + page.WAIBIhtml2 + '</tr>');
							$('#glRptLedgerTable tbody').html('');
							page.glRptLedgerDataTable = page.newTable(WAIBIColsArr, tableData, "WAIBI");
						}
					});
				})

				/*修改bug75982--问题2--zsj
				 * $(".rpt-p-search-key").find("input").on("blur", function() {
					$(this).val("");
				})*/

				//点击推荐操作
				/*				rpt.clickTips();*/

				//打印
//				$(".btn-print").on("click", function() {
//					rpt.rptPrint("glRptLedger", "glRptLedgerTable", "SANLAN");
//				})
				$(".btn-print").off().on('click', function() {
					page.editor = ufma.showModal('tableprint', 450, 350);
					$('#rptStyle').html('')
					var searchFormats = {};
					searchFormats.agencyCode = rpt.nowAgencyCode;
					searchFormats.acctCode = rpt.nowAcctCode;
					searchFormats.componentId = 'GL_RPT_LEDGER';
					ufma.post("/gl/GlRpt/RptFormats",searchFormats,function(result){
						var data = result.data;
						for(var i=0;i<data.length;i++){
							var $op = $('<option value="'+data[i].rptFormat+'">'+data[i].rptFormatName+'</option>');
							$('#rptStyle').append($op);
						}
						$('#rptStyle').val("SANLAN");
						var postSetData = {
							agencyCode: rpt.nowAgencyCode,
							acctCode: rpt.nowAcctCode,
							componentId: $('#rptType option:selected').val(),
							rgCode:pfData.svRgCode,
							setYear:pfData.svSetYear,
							sys:'100',
							directory:'总账'+$('#rptStyle option:selected').text()
						};
//						ufma.post("/pqr/api/report?sys=100",postSetData,function(result){
//							var data = result.data;
//							$('#rptTemplate').html('')
//							for(var i=0;i<data.length;i++){
//								var jData =data[i].reportCode
//								$op = $('<option value="'+jData+'">'+data[i].reportName+'</option>');
//								$('#rptTemplate').append($op);
//							}
//						});
						$.ajax({
							type: "POST",
							url: "/pqr/api/templ",
							dataType: "json",
							data: postSetData,
							success: function(data) {
								var data = data.data;
								$('#rptTemplate').html('')
								for(var i = 0; i < data.length; i++) {
									var jData = data[i].reportCode
									$op = $('<option templId = '+data[i].templId+' valueid="' + data[i].reportCode + '" value="' + jData + '">' + data[i].reportName + '</option>');
									$('#rptTemplate').append($op);
								}
							},
							error: function() {}
						});
					});
				});
				$("#btn-printyun").off().on('click', function() {
					var postSetData = {
						reportCode:'GL_RPT_LEDGER_SANLAN',
						templId:'*'
					}
					if($("#geshi").find("option:selected").attr('value')=="WAIBI"){
						postSetData.reportCode='GL_RPT_LEDGER_WAIBI'
					}
					$.ajax({
						type: "POST",
						url: "/pqr/api/iprint/templbycode",
						dataType: "json",
						data: postSetData,
						success: function(data) {
							var printcode= data.data.printCode
							var medata = JSON.parse(data.data.tempContent)
							var tabArgu = rpt.backTabArgu();
							var runNum = data.data.rowNum
							ufma.ajaxDef('/gl/rpt/getReportPrintCloudData/GL_RPT_LEDGER', "post", tabArgu, function (result) {
								var outTableData = {}
								outTableData.agency= rpt.nowAgencyCode+' '+rpt.nowAgencyName
								outTableData.times = $("#dateStart").getObj().getValue()+'至'+$("#dateEnd").getObj().getValue()
								outTableData.acco = $('input[id="ACCO-data-key"]').val()
								outTableData.printor = rpt.nowUserName
								outTableData.startPage = 1
								outTableData.logo = '/pf/pub/css/logo.png'
								outTableData.date = rpt.today
								outTableData.title = '总账'
								outTableData.showWatermark = true
								var pagelen = result.data.tableData.length
								outTableData.totalPage= Math.ceil(pagelen/runNum)
								result.data.outTableData = outTableData
								result.data.tableHead = {}
								var names = medata.template
								// var  tempdata = YYPrint.register({ names });
								// result.data.tableHead.columns =result.data.tableHead.crcolumns
								var html = YYPrint.engine(medata.template,medata.meta, result.data);
								YYPrint.print(html)
							})
						},
						error: function() {}
					});
				});
				$('#rptStyle').on('change', function() {
					var postSetData = {
						agencyCode: rpt.nowAgencyCode,
						acctCode: rpt.nowAcctCode,
						componentId: $('#rptType option:selected').val(),
						rgCode:pfData.svRgCode,
						setYear:pfData.svSetYear,
						sys:'100',
						directory:'总账'+$('#rptStyle option:selected').text()
					};
//					ufma.post("/pqr/api/report?sys=100",postSetData,function(result){
//						var data = result.data;
//						$('#rptTemplate').html('')
//						for(var i=0;i<data.length;i++){
//							var jData =data[i].reportCode
//							$op = $('<option value="'+jData+'">'+data[i].reportName+'</option>');
//							$('#rptTemplate').append($op);
//						}
//					});
					$.ajax({
						type: "POST",
						url: "/pqr/api/templ",
						dataType: "json",
						data: postSetData,
						success: function(data) {
							var data = data.data;
							$('#rptTemplate').html('')
							for(var i = 0; i < data.length; i++) {
								var jData = data[i].reportCode
								$op = $('<option templId = '+data[i].templId+' valueid="' + data[i].reportCode + '" value="' + jData + '">' + data[i].reportName + '</option>');
								$('#rptTemplate').append($op);
							}
						},
						error: function() {}
					});
				})
				$("#btn-tableprintsave").off().on('click', function() {
					var oTable = $('#glRptLedgerTable').dataTable();
					var tblData = oTable.fnGetData()
					var ztitle ={} 
					for(var i=0;i<$("#showColSet table tbody tr").length;i++){
						if($("#showColSet table tbody tr").eq(i).find('input').is(':checked')){
							var code=tf($("#showColSet table tbody tr").eq(i).find('td').eq(0).attr('data-code'))+'name'
							var name=$("#showColSet table tbody tr").eq(i).find('td').eq(0).attr('data-code')
							ztitle[code] = name
						}
					} 
//					ufma.printForPT({
//						printModal:$('#rptTemplate option:selected').val(),
//						print:'blank',
//						data:{data:[tblData]},
//						headData:[ztitle]
//					})

					ufma.printForPTPdf({
						valueid: $('#rptTemplate option:selected').attr('valueid'),
						templId: $('#rptTemplate option:selected').attr('templId'),
						print: 'blank',
						data: { data: [tblData] },
						headData: [ztitle]
					})
					page.editor.close();
				});
				$("#btn-tableprintqx").off().on('click', function() {
					page.editor.close();
				})
			},
			//重构
			initPageNew: function() {
				$('.rpt-method-tip').tooltip();
				$('#showMethodTip').click(function() {
					if($("#rptPlanList").find('li').length == 0) {
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
			init: function() {
				page.reslist = ufma.getPermission();
				ufma.parse();
				this.initPage();
				this.onEventListener();
				this.initPageNew();
				ufma.parseScroll();
				window.addEventListener('message', function (e) {
					if (e.data.hasOwnProperty('messageType') && e.data.messageType == 'clientWidth') {
						page.isCrossDomain = true;
					} else {
						page.isCrossDomain = false;
					}
				})
			}
		}
	}();

	/////////////////////
	page.init();
});