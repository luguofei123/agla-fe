$(function () {
	var pageLength = ufma.dtPageLength('#glRptWSTable');
	var page = function () {

		var glRptWSDataTable;//全局datatable对象
		var glRptWSTable;//全局table的ID
		var glRptWSThead;//全局table的头部ID

		//余额表所用接口
		// rpt.urlPath = "http://127.0.0.1:8083";//本地调试
		rpt.urlPath = "";//服务器
		var portList = {

			prjContent: rpt.urlPath + "/gl/rpt/prj/getPrjcontent",//查询方案内容接口
			getReport: "/bida/rpt/getReportData/BIDA_RPT_WORKLOAD"//请求表格数据

		};

		// januaryCount 1月 februaryCount 2月 marchCount 3月 aprilCount 4月 mayCount 5月 juneCount 6月
		// julyCount 7月 augustCount 8月 septemberCount 9月 octoberCount 10月 novemberCount 11月 decemberCount 12月
		var monthsArr = ['januaryCount', 'februaryCount', 'marchCount', 'aprilCount', 'mayCount', 'juneCount', 'julyCount', 'augustCount', 'septemberCount', 'octoberCount', 'novemberCount', 'decemberCount'];
		
		var dataArr = [
			{
				// data: "agencyCode", // agencyName
				width: "160",
				className: 'isprint',
				"data": function (data) {
					return "<div style='display:inline-block;'>" + data.agencyCode + " " + data.agencyName + "</div>";
				}
			}, //单位
			{
				// data: "acctCode", // acctName
				width: "160",
				className: 'isprint nowrap',
				"data": function (data) {
					var str = data.acctCode ? data.acctCode + " " : "";
					if (data.acctName) str += data.acctName;
					return str;
				}
			}, //账套
			{
				// data: "creator", // creatorName
				width: "160",
				className: 'isprint nowrap',
				"data": function (data) {
					var str = data.creator ? data.creator + " " : "";
					if (data.creatorName) str += data.creatorName;
					return str;
				}
			}, //制单人
			{
				data: "allCount",
				width: "160",
				className: 'isprint nowrap tr'
			}, //制单总数
		];

		return {
			//根据其他项勾选结果形成对应的表格
			changTable: function (tabArgu, tableData) {
				pageLength = ufma.dtPageLength('#glRptWSTable');
				// 清除月份列
				$("#glRptWSThead tr").eq(0).find('th[data=mounth]').remove();
				for (var i = 0; i < dataArr.length; i++) {
					if (dataArr[i].className.indexOf('mounth') > 0) {
						dataArr.splice(i, 1);
						i--;
					}
				}
				// 添加月份列
				var startFisperd = tabArgu.prjContent.startFisperd; // 起始月
				var endFisperd = tabArgu.prjContent.endFisperd; // 结束月
				var addTh = "";
				for (var j = startFisperd; j < endFisperd + 1; j++) {
					var th = "<th data='mounth'>" + j + "月</th>"
					$("#glRptWSThead tr").eq(0).append(th);
					addTh += th;
					dataArr.push({
						data: monthsArr[j - 1],
						width: "160",
						className: 'isprint nowrap tr mounth'
					});
				};

				rpt.isSetAcc = true;
				if ($("#isByCreator").prop("checked")) { // 显示制单人
					var theadHtml = "<th>单位</th><th>账套</th><th>制单人</th><th>制单总数</th>" + addTh;
				} else {
					var theadHtml = "<th>单位</th><th>账套</th><th>制单总数</th>" + addTh;
				}
				var thisDataArr = dataArr;
				$('#glRptWSTable_wrapper').ufScrollBar('destroy');
				page.glRptWSDataTable.clear().destroy();
				page.glRptWSThead.html(theadHtml);
				page.newTable(thisDataArr, tableData);
			},

			//表格初始化
			newTable: function (columnsArr, tableData) {
				var id = "glRptWSTable";//表格id
				var toolBar = $('#' + id).attr('tool-bar');
				page.glRptWSDataTable = page.glRptWSTable.DataTable({
					"language": {
						"url": bootPath + "agla-trd/datatables/datatable.default.js"
					},
					"data": tableData,
					"processing": true,//显示正在加载中
					"pagingType": "full_numbers",//分页样式
					"lengthChange": true,//是否允许用户自定义显示数量p
					"lengthMenu": [
						[10, 20, 50, 100, 200, -1],
						[10, 20, 50, 100, 200, "全部"]
					],
					"pageLength": pageLength,//默认每页显示100条--zsj--吉林公安需求
					"ordering": false,
					"bAutoWidth": false,
					"columns": columnsArr,
					"columnDefs": [
						{
							"targets": [2], // 制单人/制单人姓名列
							"className": "tdNum isprint",
							"visible": $("#isByCreator").prop("checked") // 按制单人统计是否勾选
						}
					],
					"dom": '<"printButtons"B>rt<"' + id + '-paginate"ilp>',
					buttons: [
						// {
						// 	extend: 'print',
						// 	text: '<i class="glyphicon icon-print btn-print btn-permission" aria-hidden="true"></i>',
						// 	exportOptions: {
						// 		columns: '.isprint',
						// 		format: {
						// 			header: function (data, columnIdx) {
						// 				var thisHead = $.inArrayJson(page.headerArr, 'index', columnIdx);
						// 				if ($(data).length == 0) {
						// 					return thisHead.pTitle + data;
						// 				} else {
						// 					return thisHead.pTitle + $(data)[0].innerHTML;
						// 				}
						// 			}
						// 		}
						// 	},
						// 	customize: function (win) {
						// 		$(win.document.body).find('h1').css("text-align", "center");
						// 		$(win.document.body).css("height", "auto");
						// 	}
						// },
						{
							extend: 'excelHtml5',
							text: '<i class="glyphicon icon-upload btn-permission btn-export" aria-hidden="true"></i>',
							exportOptions: {
								columns: '.isprint',
								format: {
									header: function (data, columnIdx) {
										var thisHead = $.inArrayJson(page.headerArr, 'index', columnIdx);
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
						}
					],
					"initComplete": function () {

						$("#printTableData").html("");
						$("#printTableData").append($(".printButtons"));

						$("#printTableData .buttons-print").addClass("btn-print btn-permission").attr({
							"data-toggle": "tooltip",
							"title": "打印"
						});
						$(".buttons-print").off().on('click', function () {
							page.editor = ufma.showModal('tableprint', 450, 350);
							$('#rptStyle').html('')
							var searchFormats = {};
							searchFormats.agencyCode = rpt.nowAgencyCode;
							searchFormats.acctCode = rpt.nowAcctCode;
							searchFormats.componentId = 'GL_RPT_LEDGER';
							var postSetData = {
								agencyCode: "*",
								acctCode: "*",
								componentId: $('#rptType option:selected').val(),
								rgCode: pfData.svRgCode,
								setYear: pfData.svSetYear,
								sys: '100',
								directory: '余额表'
							};
							ufma.post("/pqr/api/report?sys=666", postSetData, function (result) {
								var data = result.data;
								$('#rptTemplate').html('')
								for (var i = 0; i < data.length; i++) {
									var jData = data[i].reportCode
									$op = $('<option value="' + jData + '">' + data[i].reportName + '</option>');
									$('#rptTemplate').append($op);
								}
							});
						});
						$("#printTableData .buttons-excel").addClass("btn-export btn-permission").attr({
							"data-toggle": "tooltip",
							"title": "导出"
						});
						//导出begin
						$("#printTableData .buttons-excel").off().on('click', function (evt) {
							evt = evt || window.event;
							evt.preventDefault();
							uf.expTable({
								title:'工作量统计表',
								topInfo:[
									['方案名称：'+$("#nowPrjName").html()]
								],
								exportTable: '#' + id
							});
						});
						//导出end
						$('#printTableData.btn-group').css("position", "inherit");
						$('#printTableData div.dt-buttons').css("position", "inherit");
						$('#printTableData [data-toggle="tooltip"]').tooltip();
						//驻底begin
						var toolBar = $(this).attr('tool-bar')
						var $info = $(toolBar + ' .info');
						if ($info.length == 0) {
							$info = $('<div class="info"></div>').appendTo($(toolBar + ' .tool-bar-body'));
						}
						$info.html('');
						$('.' + id + '-paginate').appendTo($info);

						$('#' + id).closest('.dataTables_wrapper').ufScrollBar({
							hScrollbar: true,
							mousewheel: false
						});
						ufma.setBarPos($(window));
						$("#tool-bar").width($(".rpt-workspace").width() - 224);
						//驻底end
						ufma.isShow(page.reslist);
						page.headerArr = rpt.tableHeader(id);

						var timeId = setTimeout(function () {
							//左侧树高度
							var h = $(window).height() - 88;
							$(".rpt-acc-box-left").height(h);
							var H = $(".rpt-acc-box-right").height();
							if (H > h) {
								$(".rpt-acc-box-left").height(h + 48);
								if ($("#tool-bar .slider").length > 0) {
									$(".rpt-acc-box-left").height(h + 52);
								}
							}
							$(".rpt-atree-box-body").height($(".rpt-acc-box-left").height() - 96);
							clearTimeout(timeId);
						}, 200);

						//固定表头
						$("#glRptWSTable").fixedTableHead();
						//金额区间-范围筛选
						rpt.twoSearch(page.glRptWSTable);
						// 点击表格行高亮
						rpt.tableTrHighlight();
					},
					"drawCallback": function (settings) {
						ufma.isShow(page.reslist);
						page.glRptWSTable.find("td.dataTables_empty").text("")
							.append('<img src="' + bootPath + 'images/noData.png"/><br/><i>目前还没有你要查询的数据</i>');

						if ($(".rpt-table-sub-tip2 i").text() == "万元" && !$(".tdNum").hasClass("wanyuan")) {
							$("td.tdNum").each(function () {
								if ($(this).text() != "") {
									var num = $(this).text().replace(/\,/g, "");
									$(this).text(rpt.comdify(parseFloat(num / 10000).toFixed(6)));
								}
								$(this).addClass("wanyuan");
							})
						}

						//搜索隐藏显示--表格模糊搜索
						ufma.searchHideShow(page.glRptWSTable);

						//金额区间-范围筛选
						rpt.twoSearch(page.glRptWSTable);

						//显示/隐藏筛选框
						rpt.isShowFunnelBox();

						$(".tableBox").on("scroll", function (e) {
							var $Head = $(".fixedHeader-floating") || $(".fixedHeader-locked");
							var len = $Head.length;
							var tableBoxLeft = parseInt($(this).scrollLeft());
							if (len == 1) {
								var HeadLeft = parseInt($Head.css("left").substring(0, $Head.css("left").length - 2));
								var newLeft = parseInt(HeadLeft - tableBoxLeft);
								$Head.css("left", newLeft + "px");
							}
						});

						ufma.setBarPos($(window));
					}
				});
				return page.glRptWSDataTable;
			},

			//******初始化页面******************************************************
			initPage: function () {

				page.glRptWSTable = $('#glRptWSTable');//当前table的ID
				page.glRptWSThead = $('#glRptWSThead');//当前table的头部ID

				// 初始化月份列
				var th = $("<th data='mounth'>" + (new Date().getMonth() + 1) + "月</th>")
				$("#glRptWSThead tr").eq(0).append(th);
				dataArr.push({
					data: monthsArr[new Date().getMonth()],
					width: "160",
					className: 'isprint nowrap tr mounth'
				});

				var initDataArr = dataArr;
				var tableData = [];
				page.glRptWSDataTable = page.newTable(initDataArr, tableData);
				ufma.isShow(page.reslist);
				//清空查询方案，并查询
				rpt.showPlan();
				//初始化查询方案
				rpt.initPageNew();

				//请求科目体系
				rpt2.reqAccsList();

				//请求查询条件其他选项列表
				rpt.reqOptList();
				$(window).resize(function () {
					$("#tool-bar").find(".slider").width($(".rpt-workspace").width() - 252);
					$("#tool-bar").width($(".rpt-workspace").width() - 224);
				})
				ufma.parseScroll();
			},


			onEventListener: function () {
				$(".label-more").on("click", function () {
					var timeId = setTimeout(function () {
						clearTimeout(timeId);
						ufma.setBarPos($(window));
						//金额区间-范围筛选
						rpt.twoSearch(page.glRptWSTable);
					}, 300)

				})
				//方案作用域单选
				rpt.raidoInputGroup("rpt-radio-span");

				//期间单选按钮组
				rpt.raidoBtnGroup("rpt-query-btn-cont-date");

				//选择树形展示的radio组
				rpt.raidoTreeShow();

				//按钮提示
				rpt.tooltip();

				//绑定日历控件
				var glRptLedgerDate = {
					format: 'yyyy-mm',
					viewMode: 'month',
					initialDate: new Date()
				};
				$("#dateStart,#dateEnd").ufDatepicker(glRptLedgerDate);
				rpt.dateBenQi("dateStart", "dateEnd");

				//选择期间，改变日历控件的值
				$(" #dateBq").on("click", function () {
					rpt.dateBenQi("dateStart", "dateEnd");
				});
				$(" #dateBn").on("click", function () {
					rpt.dateBenNian("dateStart", "dateEnd");
				});

				//单选会计体系
				$(rpt.namespace + " #accaList").on("click", "button", function () {
					if (!$(this).hasClass("btn-primary")) {
						if (rpt.sessionKeyArr.length > 0) {
							for (var i = 0; i < rpt.sessionKeyArr.length; i++) {
								sessionStorage.removeItem(rpt.sessionKeyArr[i]);
							}
						}
						//还原查询条件
						$(rpt.namespace).find('.rpt-method-list li').css({
							"border": "1px solid #D9D9D9"
						}).removeClass("isUsed");
						rpt.resBackQuery();

						$(this).addClass("btn-primary").removeClass("btn-default");
						$(this).siblings("button").removeClass("btn-primary").addClass("btn-default");
					}
				})

				//查选方案列表的触摸效果
				rpt.methodPointer();

				//点击查询方案
				$(rpt.namespace).find('.rpt-method-list').on('click', 'li span', function () {
					if ($(this).parent("li").hasClass("isUsed")) {
						$(this).parent("li").css({
							"border": "1px solid rgba(16,142,233,0.30)",
							"background": "rgba(16,142,233,0.20)"
						}).removeClass("isUsed").find("span,b").css("color", "#108EE9");
						//取消选中的查询方案后还原会计体系
						rpt.backToOrigin();
					} else {
						$(this).parent("li").css({
							"border": "1px solid #108EE9",
							"background": "#108EE9"
						}).addClass("isUsed").find("span,b").css("color", "#fff");
						$(this).parent("li").siblings().css({
							"border": "1px solid rgba(16,142,233,0.30)",
							"background": "rgba(16,142,233,0.20)"
						}).removeClass("isUsed").find("span,b").css("color", "#108EE9");
						$(rpt.namespace).find('.rpt-share-method-box-body .btn').remove("isUsed");

						//请求方案内容
						var prjCode = $(this).attr("data-code");
						rpt.reqPrjCont(prjCode);
					}
				});

				//使用共享方案
				$(rpt.namespace).find('.rpt-share-method-box-body').on('click', '.btn', function () {
					$(this).addClass("isUsed");
					$(rpt.namespace).find('.rpt-method-list li').css({
						"border": "1px solid rgba(16,142,233,0.30)",
						"background": "rgba(16,142,233,0.20)"
					}).removeClass("isUsed").find("span,b").css("color", "#108EE9");
					//请求方案内容
					var prjCode = $(this).data("code");
					rpt.reqPrjCont(prjCode);
				});

				//删除查询方案
				rpt.deleteMethod();

				//打开-保存查询方案模态框
				rpt.openSaveMethodModal();

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

				//下拉选择展开隐藏ztree盒子
				rpt.showSelectTree();
				$("#oneAcco").parent().on("click", function (e) {
					var radioType = $(this).parents(".rpt-query-li-cont").find(".rpt-query-li-action input[type='hidden']").val();
					rpt.showHideTree(this, "ACCO", radioType);
				});


				$(rpt.namespace).on("click", ".isShowCol", function () {
					if (!$(this).prop("checked")) {
						$(this).parent("label").siblings().find(".isSumCol").removeAttr("checked");
					}
				});
				$(rpt.namespace).on("click", ".isSumCol", function () {
					if ($(this).prop("checked")) {
						$(this).parent("label").siblings().find(".isShowCol").prop("checked", true);
					}
				})

				//展开隐藏共享查询方案
				rpt.showHideShareMethod();

				//显示更多查询方案
				rpt.showMoreMethod();

				//点击查询按钮，改变表格信息
				function changeTableDate() {
					if ($('#dateStart').getObj().getValue() > $('#dateEnd').getObj().getValue()) {
						ufma.showTip('开始月份不能大于结束月份！', function () { }, 'error');
						return false;
					}
					var tabArgu = rpt2.backTabArgu();

					if (tabArgu.acctCode === "") {
						ufma.showTip("请选择至少一个账套", function () {
						}, "warning");
						return false;
					}
					ufma.showloading('正在请求数据，请耐心等待...');
					// 查询时，修改方案的查询次数
					rpt.addQryCount(tabArgu.prjGuid);
					// 重新查询方案列表
					rpt.reqPrjList();

					ufma.ajax(portList.getReport, "post", tabArgu, function (result) {
						ufma.hideloading();
						var tableData = result.data.tableData;
						page.changTable(tabArgu, tableData);
					});
				}

				$(rpt.namespace).find("#searchTableData").on("click", function () {
					changeTableDate();
				});
				$(".menuBtn").on("click", function () {
					rpt2.openTabMenu(this);
				});
				//按单位显示/按账套显示
				$("#isByCreator").on("click", function (e) {
					var isByCreator = $("#isByCreator").prop("checked");
					rpt2.isByCreator = isByCreator ? true : false;
				});
				$("#isIncludeYj").on("click", function (e) {
					var isIncludeYj = $("#isIncludeYj").prop("checked");
					rpt2.isIncludeYj = isIncludeYj ? true : false;
				});
				$("#isIncludeNj").on("click", function (e) {
					var isIncludeNj = $("#isIncludeNj").prop("checked");
					rpt2.isIncludeNj = isIncludeNj ? true : false;
				});
				$("#btn-tableprintsave").off().on('click', function () {
					var oTable = $('#glRptWSTable').dataTable();
					var tblData = oTable.fnGetData()
					var ztitle = {}
					for (var i = 0; i < $("#showColSet table tbody tr").length; i++) {
						if ($("#showColSet table tbody tr").eq(i).find('input').is(':checked')) {
							var code = $("#showColSet table tbody tr").eq(i).find('td').eq(0).attr('data-code').toLowerCase() + 'name'
							var name = $("#showColSet table tbody tr").eq(i).find('td').eq(0).attr('data-code')
							ztitle[code] = name
						}
					}
					ufma.printForPT({
						printModal: $('#rptTemplate option:selected').val(),
						print: 'blank',
						data: { data: [tblData] },
						headData: [ztitle]
					})
					page.editor.close();
				});
				$("#btn-tableprintqx").off().on('click', function () {
					page.editor.close();
				})

			},

			//此方法必须保留
			init: function () {
				page.reslist = ufma.getPermission();
				ufma.isShow(page.reslist);
				ufma.parse();
				this.initPage();
				this.onEventListener();
			}
		}
	}();

	/////////////////////
	page.init();
	$(window).scroll(function () {
		if ($(this).scrollTop() > 30) {
			$(".rpt-acc-box-left").css("top", "12px");
		} else {
			$(".rpt-acc-box-left").css("top", "58px");
		}
	})
});