$(function () {
	var page = function () {
		var pageLength = ufma.dtPageLength('#glRptCfDetailListTable');

		var glRptCfDetailListDataTable;//全局datatable对象
		var glRptCfDetailListTable;//全局table的ID

		//现金流量统计表所用接口
		var portList = {
			GL_RPT_CASHFLOW_JOURNAL: '/gl/rpt/getReportData/GL_RPT_CASHFLOW_JOURNAL'
		};

		return {

			//表格初始化
			newTable: function (tableData) {
				pageLength = ufma.dtPageLength('#glRptCfDetailListTable');
				var id = 'glRptCfDetailListTable';
				page.glRptCfDetailListDataTable = page.glRptCfDetailListTable.DataTable({
					"language": {
						"url": bootPath + "agla-trd/datatables/datatable.default.js"
					},
					"data": tableData,
					"autoWidth": false, //表格自定义宽度
					"bDestroy": true,
					"info":false,
					// "paging":false,//不分页
					"processing": true, //显示正在加载中
					"pagingType": "full_numbers", //分页样式
					"lengthChange": true, //是否允许用户自定义显示数量p
					"lengthMenu": [
						[10, 20, 50, 100, 200, -1],
						[10, 20, 50, 100, 200, "全部"]
					],
					"pageLength": pageLength,
					"serverSide": false,
					"ordering":false,
					"columns": page.cloumns(),
					"columnDefs": [
						{
							"targets": [0,1,2],
							"className": "isprint center"
						},
						{
                            "targets": [3], //凭证号
                            "render": function(data, type, full, meta) {
                                if(data != null) {
                                    if(full.vouGuid != null) {
                                        return '<span class="turn-vou" title="'+ data +'" data-vouguid="' + full.vouGuid + '">' + data + '</span>';
                                    } else {
                                        return data;
                                    }
                                } else {
                                    return "";
                                }
                            }
                    	},
						{
							"targets": [-1,-3,-4],
							"className": "tdNum isprint",
							"render": $.fn.dataTable.render.number(',', '.', 2, '')
						}
					],
					"dom": '<"printButtons"B>rt<"' + id + '-paginate"ilp>',
					buttons: [
						{
							extend: 'print',
							text: '<i class="glyphicon icon-print" aria-hidden="true"></i>',
							customize: function (win) {
								$(win.document.body).find('h1').css("text-align", "center");
								$(win.document.body).css("height", "auto");
							}
						},
						{
							extend: 'excelHtml5',
							text: '<i class="glyphicon icon-upload" aria-hidden="true"></i>',
							customize: function (xlsx) {
								var sheet = xlsx.xl.worksheets['sheet1.xml'];
							}
						}
					],
					"initComplete": function () {
						$("#printTableData").html("");
						$("#printTableData").append($(".printButtons"));

						$("#printTableData .buttons-print").addClass("btn-print btn-permission").attr({ "data-toggle": "tooltip", "title": "打印" }).removeAttr("href");
						$("#printTableData .buttons-excel").addClass("btn-export btn-permission").attr({ "data-toggle": "tooltip", "title": "导出" });
						$('#printTableData.btn-group').css("position", "inherit");
						$('#printTableData div.dt-buttons').css("position", "inherit");
						$('#printTableData [data-toggle="tooltip"]').tooltip();

						page.reslist = ufma.getPermission();
						ufma.isShow(page.reslist);
						// $(".btn-print").off().on("click", function () {
						// 	var postSetData = {
						// 		reportCode:'GL_RPT_CASHFLOW_JOURNAL',
						// 		templId:'*'
						// 	}
						// 	$.ajax({
						// 		type: "POST",
						// 		url: "/pqr/api/iprint/templbycode",
						// 		dataType: "json",
						// 		data: postSetData,
						// 		success: function(data) {
						// 			var printcode= data.data.printCode
						// 			var medata = JSON.parse(data.data.tempContent)
						// 			var tabArgu = rpt.backTabArgu();
						// 			var runNum = data.data.rowNum
						// 			ufma.ajaxDef('/gl/rpt/getReportPrintCloudData/GL_RPT_CASHFLOW_JOURNAL', "post", tabArgu, function (result) {
						// 				var outTableData = {}
						// 				outTableData.agency= rpt.nowAgencyCode+' '+rpt.nowAgencyName
						// 				outTableData.times = $("#dateStart").getObj().getValue()+'至'+$("#dateEnd").getObj().getValue()
						// 				outTableData.acco = $('input[id="queryAcco_input"]').val()
						// 				outTableData.printor = rpt.nowUserName
						// 				outTableData.startPage = 1
						// 				outTableData.logo = '/pf/pub/css/logo.png'
						// 				outTableData.date = rpt.today
						// 				outTableData.title = '现金流量明细账'
						// 				outTableData.showWatermark = true
						// 				var pagelen = result.data.tableData.length
						// 				outTableData.totalPage= Math.ceil(pagelen/runNum)
						// 				result.data.outTableData = outTableData
						// 				result.data.tableHead = {}
						// 				var names = medata.template
						// 				var html = YYPrint.engine(medata.template,medata.meta, result.data);
						// 				YYPrint.print(html)
						// 			})
						// 		},
						// 		error: function() {}
						// 	});
						// })
						//驻底begin
						var toolBar = $(this).attr('tool-bar')
						var $info = $(toolBar + ' .info');
						if ($info.length == 0) {
							$info = $('<div class="info"></div>').appendTo($(toolBar + ' .tool-bar-body'));
						}
						$info.html('');
						$('.' + id + '-paginate').appendTo($info);
						//驻底end

						//固定表头
						$("#glRptCfDetailListTable").fixedTableHead();
					},
					"drawCallback": function (settings) {
						ufma.dtPageLength($(this));

						page.glRptCfDetailListTable.find("td.dataTables_empty").text("")
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

						//弹出详细凭证
                        $('#glRptCfDetailListTable').find("td span.turn-vou").on("click", function() {
                            rpt.openVouShow(this, "glRptCfDetailList");
                        })
	
						// ufma.isShow(page.reslist);
						setTimeout(function () {
							ufma.setBarPos($(window));
						}, 30);
					}
				});

				return page.glRptCfDetailListDataTable;
			},
			cloumns: function () {
				var cloumns = [{
					// title: '年',
					data: 'vouYear',
					className: 'center isprint tc',
					render: function(data, type, rowdata, meta) {
						return rowdata.vouYear||rowdata.rq;
					}
				}, {
					// title: '月',
					data: 'vouMonth',
					className: 'center isprint tc'
				}, {
					// title: '日',
					data: 'vouDay',
					className: 'center isprint tc'
				}, {
					// title: '凭证编号',
					data: 'vouNo',
					className: 'center isprint'
				}, {
					// title: '摘要',
					data: 'descpt',
					className: 'isprint nowrap ellipsis'
				}, {
					// title: '借方金额',
					data: 'dStadAmt',
					className: 'isprint tdNum'
				}, {
					// title: '贷方金额',
					data: 'cStadAmt',
					className: 'isprint tdNum'
				}, {
					// title: '方向',
					data: 'drCr',
					className: 'center isprint tc'
				}, {
					// title: '余额',
					data: 'bStadAmt',
					className: 'isprint tdNum'
				}];
				return cloumns
			},
			getGlRptCashFlowJurnal: function (param) {
				if (!param instanceof Object) {
					param = {}
				}
				ufma.showloading('正在加载数据，请耐心等待...');
				ufma.post(portList.GL_RPT_CASHFLOW_JOURNAL, param, function (result) {
					ufma.hideloading();
					console.log(result);
					page.newTable(result.data.tableData);
					// page.newTable(result.data)
				})
			},

			//初始化页面
			initPage: function () {
				page.glRptCfDetailListTable = $('#glRptCfDetailListTable');//当前table的ID
				page.glRptCfDetailListTableHead = $('#glRptCfDetailListThead');

				var tableData = [];
				$('#glRptJournalTable tbody').html('');

				var theadStr = '<tr><th colspan="3" style="width:100px">日期</th>';
				theadStr += '<th rowspan="2">凭证编号</th>';
				theadStr += '<th rowspan="2">摘要</th>';
				theadStr += '<th rowspan="2">借方金额</th>';
				theadStr += '<th rowspan="2">贷方金额</th>';
				theadStr += '<th rowspan="2">方向</th>';
				theadStr += '<th rowspan="2">余额</th>';
				theadStr += '</tr>';
				theadStr += '<tr><th parent-title="2017-" class="editYear" style="width:40px">年</th>';
				theadStr += '<th parent-title="2017-" class="editYear" style="width:30px">月</th>';
				theadStr += '<th parent-title="2017-" class="editYear" style="width:30px">日</th>';
				theadStr += '</tr>';
				page.glRptCfDetailListTableHead.html(theadStr);

				page.glRptCfDetailListDataTable = page.newTable(tableData);

				//初始化单位样式
				rpt.initAgencyList();

				//初始化账套样式
				rpt.initAcctList();

				//请求单位列表
				rpt.reqAgencyList();

				//请求查询条件其他选项列表
				rpt.reqOptList();

				//初始化会计科目
				rpt.initIsCashflowAccoList();

				//查询会计科目
				rpt.queryIsCashflowAccoList();

				//查询项目
				rpt.queryCashflowByAcco();


			},

			//页面元素事件绑定使用jquery 的 on()方法
			onEventListener: function () {
				//期间单选按钮组
				rpt.raidoBtnGroup("rpt-query-btn-cont-date");
				//按钮提示
				rpt.tooltip();

				//绑定日历控件
				var glRptLedgerDate = {
					format: 'yyyy-mm-dd',
					initialDate: new Date(),
					onChange: function (fmtDate) {
						rpt.checkDate(fmtDate, "#dateStart")
					}
				};
				var glRptLedgerEndDate = {
					format: 'yyyy-mm-dd',
					initialDate: new Date(),
					onChange: function (fmtDate) {
						rpt.checkDate(fmtDate, "#dateEnd")
					}
				};
				$("#dateStart").ufDatepicker(glRptLedgerDate);
				$("#dateEnd").ufDatepicker(glRptLedgerEndDate);
				rpt.dateBenQi("dateStart", "dateEnd");

				//选择期间，改变日历控件的值
				$("#dateBq").on("click", function () {
					rpt.dateBenQi("dateStart", "dateEnd");
				});
				$("#dateBn").on("click", function () {
					rpt.dateBenNian("dateStart", "dateEnd");
				});

				//切换表格上方年度信息
				$(rpt.namespace).find("#dateStart").on("change", function () {
					$(".rpt-table-sub-year").text($(this).val().substring(0, 4) + "年");
				})

				//编辑金额单位
				rpt.changeMonetaryUnit();

				//搜索隐藏显示--表格模糊搜索
				// rpt.searchHideShow(page.glRptCfDetailListTable);
				ufma.searchHideShow(page.glRptCfDetailListTable);

				//查询现金流量统计表
				$("#glRptCfStatement-query").on("click", function () {
					if ($('#dateStart').getObj().getValue() > $('#dateEnd').getObj().getValue()) {
						ufma.showTip('开始月份不能大于结束月份！', function () { }, 'error');
						return false;
					}
					var tabArgu = rpt.backTabArgu();
					console.log(tabArgu);
					page.getGlRptCashFlowJurnal(tabArgu);
				})
				$(document).on('mouseup','#queryAcco .uf-combox-clear',function(){
					rpt.queryCashflowByAcco();
				})

			},
			//此方法必须保留
			init: function () {
				page.reslist = ufma.getPermission();
				ufma.parse();
				this.initPage();
				this.onEventListener();
				ufma.parseScroll();
			}
		}
	}();

	/////////////////////
	page.init();
});