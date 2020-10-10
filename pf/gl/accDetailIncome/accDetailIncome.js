$(function() {
	var page = function() { 
		var ptData,
			argu, //表格数据
			oTable;
		var incomeTable; //全局table的ID
		var portList = {
			accItemTypeList: "/gl/EleAccItem/getAccItemType", //辅助项类别列表接口 不包括科目
			getReport: "/gl/rpt/getReportData/GL_RPT_JOURNAL" //请求表格数据
		};
		//用于存储表头信息
		var headArr;
		var pageLength = ufma.dtPageLength('#incomeTable'); //分页
		console.log(pageLength)
		var vouTypeArray = {};
		var columnsArr = [{
				data: "rq",
				width: "40px",
				className: "isprint"
			}, //-10日期-月
			{
				data: "vouMonth",
				width: "40px",
				className: "isprint"
			}, //-10日期-月
			{
				data: "vouDay",
				width: "40px",
				className: "isprint"
			}, //-9日期-日
			{
				data: "vouNo",
				className: "isprint",
				render: function(data, type, full, meta) {
					if(data != null) {
						if(full.vouGuid != null) {
							return '<span data-vouguid="' + full.vouGuid + '">' + data + '</span>';
						} else {
							return data;
						}
					} else {
						return "";
					}
				}
			}, //-11凭证号
			{
				data: "descpt",
				className: "isprint"
			}, //-10摘要
			{
				data: "accoName",
				width: "100px",
				className: "isprint"
			}, //-8会计科目
			{
				data: "billType",
				className: "isprint"
			}, //-7票据类型
			{
				data: "billNo",
				className: "isprint"
			}, //-6票据号
			{
				//data: "currentCode",
				data: "currentName", //需要显示编号+名称
				className: "isprint"
			}, //-5往来单位
			{
				data: "dStadAmt",
				className: "tr isprint tdNum",
				render: $.fn.dataTable.render.number(',', '.', 2, '')
			}, //-4借方金额
			{
				data: "cStadAmt",
				className: "tr isprint tdNum",
				render: $.fn.dataTable.render.number(',', '.', 2, '')
			}, //-3贷方金额
			{
				data: "drCr",
				className: "isprint tc"
			}, //-2方向
			{
				data: "bStadAmt",
				className: "tr isprint tdNum",
				render: $.fn.dataTable.render.number(',', '.', 2, '')
			} //-1余额

		];
		var incomehtml1;
		var incomehtml2;
		return {
			setTable: function(liArr, tableData, colArrBase, type) {
				var colArr = [].concat(colArrBase);
				var descpt = $.inArrayJson(colArr, 'data', 'descpt');
				var ipos = $.inArray(descpt, colArr);
				page.oTable.clear().destroy();
				var columnList = [];
				if(type == "SANLAN") {
					page.incomeTableThead.html('<tr>' + page.incomehtml1 + '</tr><tr>' + page.incomehtml2 + '</tr>');
				}
				var newColumnList = columnList.concat(colArr);
				page.oTable = page.newTable(tableData, newColumnList, type);
				page.newTable(tableData, colArr, type);
				//ufma.setBarPos($(window));
			},
			//表格初始化
			newTable: function(tableData, columnsArr, type) {
				var id = "incomeTable"; //表格id
				var toolBar = $('#' + id).attr('tool-bar');
				page.oTable = page.incomeTable.DataTable({
					"language": {
						"url": bootPath + "agla-trd/datatables/datatable.default.js"
					},
					"autoWidth": false,
					"bDestory": true,
					"data": tableData,
					"processing": true, //显示正在加载中
					"pagingType": "full_numbers",
					"pageLength": pageLength,
					"pagingType": "full_numbers", //分页样式
					"lengthChange": true, //是否允许用户自定义显示数量p
					"lengthMenu": [
						[20, 50, 100, 200, 100000],
						[20, 50, 100, 200, "全部"]
					],
					"serverSide": false,
					"ordering": false,
					"columns": columnsArr,
					"dom": '<"datatable-toolbar"B>rt<"' + id + '-paginate"ilp>',
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
							$info = $('<div class="info"></div>').appendTo($(toolBar + ' .tool-bar-body'));
						}
						$info.html('');

						$('.' + id + '-paginate').appendTo($info);
						$('#dtToolbar [data-toggle="tooltip"]').tooltip();
						//表格模拟滚动条
						$("#dtToolbar .buttons-print").css("border-radius", "4px 0 0 4px").addClass("btn-print btn-permission").attr({
							"data-toggle": "tooltip",
							"title": "打印"
						});
						$("#dtToolbar .buttons-excel").css("border-radius", "0 4px 4px 0").addClass("btn-export btn-permission").attr({
							"data-toggle": "tooltip",
							"title": "导出"
						});
						ufma.isShow(page.reslist);
						$("#dtToolbar .buttons-excel").off().on('click', function(evt) {
							evt = evt || window.event;
							evt.preventDefault();
							uf.expTable({
								title: '应收款明细账',
								exportTable: '#' + id
							});
							//ufma.expXLSForDatatable($('#incomeTable'), '应收款明细账');
						});
						//导出end	
						//ufma.setBarPos($(window));
					},
					"drawCallback": function(settings) {
						ufma.isShow(page.reslist);
						ufma.dtPageLength($(this))
						$("#" + id).find("tbody tr").each(function() {
							var rowData = page.oTable.row($(this)).data();
						})
						page.headArr = rpt.tableHeader(id);

						page.incomeTable.find("td.dataTables_empty").text("")
							.append('<img class="no-print" src="' + bootPath + 'images/noData.png"/><br/><i>目前还没有你要查询的数据</i>');

						$(".tableBox").css({
							"overflow-x": "auto"
						});
						//弹出详细凭证
						$(rpt.namespace).find("td span").on("click", function() {
							//	rpt.openVouShow(this, "accDetailIncome");
							var vouGuid = $(this).attr("data-vouguid"); //凭证id
							var vouMenuId = 'f24c3333-9799-439a-94c9-f0cdf120305d';
							if(vouGuid) {
								var baseUrl = '/pf/gl/vou/index.html?menuid=' + vouMenuId + '&dataFrom=accDetailIncome&action=query&vouGuid=' + vouGuid + '&agencyCode=' + rpt.nowAgencyCode + '&acctCode=' + rpt.nowAcctCode;
								//window.parent.openNewMenu($(this));
								uf.openNewPage(page.isCrossDomain, $(this), 'openMenu', baseUrl, false, "凭证录入");
							}
							ufma.setBarPos($(window));
						});

						$('#incomeTable').closest('.dataTables_wrapper').ufScrollBar({
							hScrollbar: true,
							mousewheel: false
						});
						ufma.setBarPos($(window));
					}
				});
				return page.oTable;
			},
			//请求个人往来（人员列表）
			payerEmployee: function() {
				var reqData = {
					agencyCode: rpt.cbAgency.getValue(),
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
			//初始化页面
			initPage: function() {
				page.incomehtml1 = $("#SANLAN tr").eq(0).html();
				page.incomehtml2 = $("#SANLAN tr").eq(1).html();
				//需要根据自己页面写的ID修改
				page.incomeTable = $('#incomeTable'); //当前table的ID
				page.incomeTableThead = $('#incomeTableThead'); //当前table的头部ID
				//默认三栏式表格
				var tableData = [];
				page.incomeTableThead.html('<tr>' + page.incomehtml1 + '</tr><tr>' + page.incomehtml2 + '</tr>');
				page.oTable = page.newTable(tableData, columnsArr, "SANLAN");

				//初始化单位样式
				rpt.initAgencyList();
				//初始化账套样式
				rpt.initAcctList();
				//初始化票据类型
				rpt.initBillType();
				//请求单位列表
				rpt.reqAgencyList();
				//往来单位请求列表
				rpt.initCbCurrent();
				//初始化会计科目
				//rpt.initQueryAcco();
			},
			onEventListener: function() {
				$('.uf-datepicker').ufDatepicker({
					format: 'yyyy-mm-dd',
					initialDate: new Date()
				});
				/*与bug75982问题2相同，故一并修改--zsj
				 * $(".rpt-p-search-key").find("input").on("blur", function() {
					$(this).val("");
				})*/
				//方案作用域单选
				rpt.raidoInputGroup("rpt-radio-span");
				//获取表样式
				$(rpt.namespace).find(".rpt-table-sub-tip-currency").on("change", "select", function() {
					var tableData = [];
					$(this).siblings("i").attr("data-type", $(this).val());
					$(this).hide();
					$(this).siblings("i").text($(this).find("option:checked").text()).show();
					page.oTable.clear().destroy();
				});
				$(rpt.namespace).find(".change-rpt-type").on("change", "select", function() {
					for(var i = 0; i < fixedArr.length; i++) {
						fixedArr[i].checked = false;
					}
					page.oTable.clear().destroy();
					var columnsArr = [];
					var tableData = [];
					$(this).siblings("i").attr("data-type", $(this).val());
					if($(this).val() == "SANLAN") {
						page.incomeTableThead.html('<tr>' + page.incomehtml1 + '</tr><tr>' + page.incomehtml2 + '</tr>');
						columnsArr = columnsArr;
						$(".rpt-table-sub-tip-currency").hide();
					}
					ufma.setBarPos($(window));
					page.oTable = page.newTable(tableData, columnsArr, $(this).val());
					$(this).hide();
					$(this).siblings("i").text($(this).find("option:checked").text()).show();
				});
				//期间单选按钮组
				rpt.raidoBtnGroup("rpt-query-btn-cont-date");
				//搜索
				ufma.searchHideShow($('#incomeTable'));
				//绑定日历控件
				var glRptLedgerDate = {
					format: 'yyyy-mm-dd',
					initialDate: new Date()
				};
				$("#dateStart,#dateEnd").ufDatepicker(glRptLedgerDate);
				rpt.dateBenNian("dateStart", "dateEnd");
				//选择期间，改变日历控件的值
				$(rpt.namespace + " #dateBq").on("click", function() {
					rpt.dateBenQi("dateStart", "dateEnd");
					ufma.setBarPos($(window));
				});
				$(rpt.namespace + " #dateBn").on("click", function() {
					rpt.dateBenNian("dateStart", "dateEnd");
					ufma.setBarPos($(window));
				});
				$(rpt.namespace + " #dateJr").on("click", function() {
					rpt.dateToday("dateStart", "dateEnd");
					ufma.setBarPos($(window));
				});
				//打开-保存查询方案模态框
				rpt.openSaveMethodModal()
				//确认-保存查询方案
				$('#sureSaveMethod,#saveAs').on('click', function(e) {
					if($("#methodName").val().trim() != "") {
						rpt.reqSavePrj($(e.target).is('#saveAs'));
					} else {
						ufma.showInputHelp('methodName', '<span class="error">方案名称不能为空</span>');
						$('#methodName').closest('.form-group').addClass('error');
					}
					pageLength = ufma.dtPageLength('#incomeTable');
					ufma.setBarPos($(window));
				});

				//输入方案名的提示
				rpt.methodNameTips();
				//凭证类型、字号change相互影响
				$(rpt.namespace).find("#vouTypeCode").on("change", function() {
					$(rpt.namespace).find("#vouTypeCode").val($(this).val());
				})
				$(rpt.namespace).find("#vouTypeCode").on("change", function() {
					$(rpt.namespace).find("#vouTypeCode").val($(this).val());
				})
				//查询
				$("#btnQuery").on("click", function() {
					if($('#dateStart').getObj().getValue() > $('#dateEnd').getObj().getValue()) {
						ufma.showTip('开始日期不能大于结束日期！', function() {}, 'error');
						return false;
					}
					ufma.showloading()
					page.queryTable(true);
					//ufma.setBarPos($(window));
					pageLength = ufma.dtPageLength('#incomeTable');

				});
				//显示/隐藏列隐藏框
				$(document).on("click", "#colAction", function(evt) {
					evt.stopPropagation();
					$("div.rpt-funnelBox").hide();
					$(this).next("div.rpt-funnelBox").show();
				});
				//选择往来类型
				$("#colList").on("click", "span", function() {
					if($("#colAction .text").text() != $(this).text()) {
						$("#colAction .text").text($(this).text());
						$("#colAction").attr("data-type", $(this).attr("data-type"));
						if($(this).text() == "单位") {
							rpt.reqAgencyList();
						} else if($(this).text() == "个人") {
							page.payerEmployee();
						}
					}

					$(this).closest(".rpt-funnelBox").hide();
				})
			},
			queryTable: function(checkCond) {
				$("#incomeTable").html('')
				var nowTabType = $(".change-rpt-type i").attr("data-type");
				var tabArgu = rpt.backTabArgu();
				if($("#colAction").attr("data-type") == "02") {
					tabArgu.prjContent.qryItems[1].itemType = "EMPLOYEE";
					tabArgu.prjContent.qryItems[1].itemTypeName = "人员";
				}
				ufma.ajaxDef(portList.getReport, "post", tabArgu, function(result) {
					var tableData = result.data.tableData;
					var showLiArr = rpt.tableColArr();
					//需要显示的辅助核算项
					if(nowTabType == "SANLAN") {
						page.setTable(showLiArr, tableData, columnsArr, "SANLAN");
						if(showLiArr.length > 1) {
							var twid = 100 + (showLiArr.length - 1) * 5;
							page.oTable.columns.adjust().draw();
						}
					}
					ufma.hideloading()
					var year = (new Date($("#dateStart").getObj().getValue())).getFullYear();
					page.setTheadYear(year);

				});
				//ufma.setBarPos($(window));
				pageLength = ufma.dtPageLength('#incomeTable');
			},

			//修改表头年份
			setTheadYear: function(year) {
				$(".tabDateCol").text(year);
				$(".editYear").attr("parent-title", year + "-");
			},
			//重构
			initPageNew: function() {
				// $('#showMethodTip').ufTooltip({
				// 	className: 'p0',
				// 	trigger: 'click', //click|hover
				// 	opacity: 1,
				// 	confirm: false,
				// 	gravity: 'north', //north|south|west|east
				// 	content: "#rptPlanList"
				// });
				pageLength = ufma.dtPageLength('#incomeTable');
				$('#showMethodTip').click(function() {
					if($("#rptPlanList").hasClass('hide')){
						$("#rptPlanList").removeClass('hide')
					}else{
						$("#rptPlanList").addClass('hide')
					}
					//重构begin
					dm.showPlan({
						"agencyCode": rpt.nowAgencyCode,
						"acctCode": rpt.nowAcctCode,
						"rptType": rpt.rptType,
						"userId": dm.svUserId, //修改权限  将svUserCode改为 svUserId  20181012
						"setYear": dm.svSetYear
					});
					//重构end
				});
				$(document).on('click', function(e){
					if (!$(".rpt-method-tip")[0].contains(e.target)) {
						$("#rptPlanList").addClass('hide')
					}
				})
			},

			//此方法必须保留
			init: function() {
				page.setTheadYear(pfData.svSetYear);
				page.reslist = ufma.getPermission();
				ufma.isShow(page.reslist);
				ptData = ufma.getCommonData();
				this.initPage();
				this.onEventListener();
				this.initPageNew();
				ufma.parseScroll();
				ufma.parse();
				window.addEventListener('message', function(e) {
					if(e.data.hasOwnProperty('messageType') && e.data.messageType == 'clientWidth') {
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