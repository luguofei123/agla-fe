$(function() {
	var pageLength = ufma.dtPageLength('#glRptVouSumTable');
	var page = function() {

		var glRptVouSumDataTable; //全局datatable对象
		var glRptVouSumTable; //全局table的ID

		//凭证汇总表所用接口
		var portList = {
			getReport: "/gl/rpt/getReportData/GL_RPT_VOUSUMMARY" //请求表格数据
		};
		var headdata ={} 
		return {

			//表格初始化
			newTable: function(dataArr) {
				var id = "glRptVouSumTable"; //表格id
				var toolBar = $('#' + id).attr('tool-bar');
				page.glRptVouSumDataTable = page.glRptVouSumTable.DataTable({
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
					"columns": [{
							data: "accoCode"
						},
						{
							data: "accoName"
						},
						{
							data: "drAmt"
						},
						{
							data: "crAmt"
						}
					],
					"columnDefs": [{
						"targets": [-2, -1],
						"className": "isprint tdNum",
						"render": $.fn.dataTable.render.number(',', '.', 2, '')
					}],
					"dom": '<"printButtons"B>rt<"' + id + '-paginate"ilp>',
					buttons: [{
							extend: 'print',
							text: '<i class="glyphicon icon-print" aria-hidden="true"></i>',
							customize: function(win) {
								$(win.document.body).find('h1').css("text-align", "center");
								$(win.document.body).css("height", "auto");
							}
						},
						{
							extend: 'excelHtml5',
							text: '<i class="glyphicon icon-upload" aria-hidden="true"></i>',
							customize: function(xlsx) {
								var sheet = xlsx.xl.worksheets['sheet1.xml'];
							}
						}
					],
					"initComplete": function() {

						$("#printTableData").html("");
						$("#printTableData").append($(".printButtons"));

						$("#printTableData .buttons-print").addClass("btn-print btn-permission").attr({
							"data-toggle": "tooltip",
							"title": "打印"
						});
						$(".btn-print").removeClass('buttons-print').removeAttr('href')
						$("#printTableData .buttons-excel").addClass("btn-export btn-permission").attr({
							"data-toggle": "tooltip",
							"title": "导出"
						});
						//导出begin
						$("#printTableData .buttons-excel").off().on('click', function(evt) {
							evt = evt || window.event;
							evt.preventDefault();
							ufma.expXLSForDatatable($('#' + id), '凭证汇总表', [
								[$('#rpt-tab-time').text(),$('.rpt-tab-pzzh').text(),$('.rpt-tab-pzzs').text(),$('.rpt-tab-pzfj').text()]
							]);
						});
						
						$(".btn-print").off().on('click', function(evt) {
							page.editor = ufma.showModal('tableprint', 450, 350);
							var postSetData = {
								agencyCode: rpt.nowAgencyCode,
								acctCode: rpt.nowAcctCode,
								componentId: 'GL_RPT_VOUSUMMARY',
								rgCode: pfData.svRgCode,
								setYear: pfData.svSetYear,
								sys: '100',
								directory: '凭证汇总表'
							};
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
						$("#btn-printyun").off().on("click", function () {
							var postSetData = {
								reportCode:'GL_RPT_VOUSUMMARY',
								templId:'*'
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
									tabArgu.isParallel = rpt.isParallelsum
									tabArgu.isDoubleVou = rpt.isDoubleVousum
									tabArgu.prjContent.startDate = $("#dateStart").getObj().getValue()
									tabArgu.prjContent.endDate = $("#dateEnd").getObj().getValue()
									if(rpt.isParallelsum == '1' && rpt.isDoubleVousum == '0') {
										if($('#accaList .btn-primary').text() == '全部') {
											tabArgu.prjContent.accaCode = '*'
										} else {
											tabArgu.prjContent.accaCode = $('#accaList .btn-primary').attr('data-code')
										}
									} else if(rpt.isParallelsum == '1' && rpt.isDoubleVousum == '1') {
										if($('#accaList .btn-primary').text() == '全部') {
											tabArgu.prjContent.accaCode = "1,2"
										} else {
											tabArgu.prjContent.accaCode = $('#accaList .btn-primary').attr('data-code')
										}
									} else {
										tabArgu.prjContent.accaCode = '*'
									}
									var runNum = data.data.rowNum
									ufma.ajaxDef('/gl/rpt/getReportPrintCloudData/GL_RPT_VOUSUMMARY', "post", tabArgu, function (result) {
										var outTableData = {}
										outTableData.agency= rpt.nowAgencyCode+' '+rpt.nowAgencyName
										outTableData.times = $("#dateStart").getObj().getValue()+'至'+$("#dateEnd").getObj().getValue()
										outTableData.acco = $('.rpt-table-sub-tip').text()
										outTableData.printor = rpt.nowUserName
										outTableData.startPage = 1
										outTableData.logo = '/pf/pub/css/logo.png'
										outTableData.date = rpt.today
										outTableData.title = '凭证汇总表'
										outTableData.showWatermark = true
										var pagelen = result.data.tableData.length
										outTableData.totalPage= Math.ceil(pagelen/runNum)
										result.data.outTableData = outTableData
										result.data.tableHead = {}
										var names = medata.template
										var html = YYPrint.engine(medata.template,medata.meta, result.data);
										YYPrint.print(html)
									})
								},
								error: function() {}
							});
						})
						//导出end
						// $('#printTableData.btn-group').css("position", "inherit");
						$('#printTableData div.dt-buttons').css("position", "inherit");
						$('#printTableData [data-toggle="tooltip"]').tooltip();

						page.reslist = ufma.getPermission();
						ufma.isShow(page.reslist);
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
					},
					"drawCallback": function(settings) {

						page.glRptVouSumTable.find("td.dataTables_empty").text("")
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
						ufma.setBarPos($(window));
						/*
												//设置底部工具栏的显隐
												rpt.showHide("glRptVouSumTable");*/
					}
				});

				return page.glRptVouSumDataTable;
			},

			//初始化页面
			initPage: function() {

				//初始化单位样式
				rpt.initAgencyList();
				//初始化账套样式
				rpt.initAcctList();

				//请求单位列表
				rpt.reqAgencyList();

				//需要根据自己页面写的ID修改
				page.glRptVouSumTable = $('#glRptVouSumTable'); //当前table的ID

				page.glRptVouSumDataTable = page.newTable();
				//page.glRptVouSumDataTable.ajax.url("glRptVouSum.json");

				//请求会计体系列表
				rpt.reqAccaList();

				//凭证来源
				rpt.getVOU_SOURCE();

				//获取5个check的值
				rpt.reqOptList();

				$('#accaList').on('click', 'button', function() {

					if(rpt.isParallelsum == '1' && rpt.isDoubleVousum == '1') {
						var a;
						if($(this).attr('data-code') == '' || $(this).attr('data-code') == '*') {
							a = "1,2"
						} else {
							a = $(this).attr('data-code')
						}
						var reqUrl = rpt.portList.getVoutype + rpt.nowAgencyCode + "/" + rpt.nowSetYear + "/" + rpt.nowAcctCode + "/" + a;
						ufma.ajax(reqUrl, "get", "", function(result) {
							var data = result.data;
							var selectHtml = "";
							for(var i = 0; i < data.length; i++) {
								var sHtml = ufma.htmFormat('<option value="<%=code%>"><%=name%></option>', {
									code: data[i].code,
									name: data[i].name
								});
								selectHtml += sHtml;
							}

							selectHtml = '<option value=""></option>' + selectHtml;
							$(rpt.namespace + " #rpt-pzzh-select").html(selectHtml);
						});
					} else if(rpt.isParallelsum == '1' && rpt.isDoubleVousum == '0') {
						var reqUrl = rpt.portList.getVoutype + rpt.nowAgencyCode + "/" + rpt.nowSetYear + "/" + rpt.nowAcctCode + "/*";
						ufma.ajax(reqUrl, "get", "", function(result) {
							var data = result.data;
							var selectHtml = "";
							for(var i = 0; i < data.length; i++) {
								var sHtml = ufma.htmFormat('<option value="<%=code%>"><%=name%></option>', {
									code: data[i].code,
									name: data[i].name
								});
								selectHtml += sHtml;
							}

							selectHtml = '<option value=""></option>' + selectHtml;
							$(rpt.namespace + " #rpt-pzzh-select").html(selectHtml);
						});
					} else if(rpt.isParallelsum == '0') {
						var reqUrl = rpt.portList.getVoutype + rpt.nowAgencyCode + "/" + rpt.nowSetYear + "/" + rpt.nowAcctCode + "/*";
						ufma.ajax(reqUrl, "get", "", function(result) {
							var data = result.data;
							var selectHtml = "";
							for(var i = 0; i < data.length; i++) {
								var sHtml = ufma.htmFormat('<option value="<%=code%>"><%=name%></option>', {
									code: data[i].code,
									name: data[i].name
								});
								selectHtml += sHtml;
							}

							selectHtml = '<option value=""></option>' + selectHtml;
							$(rpt.namespace + " #rpt-pzzh-select").html(selectHtml);
						});
					}
				})
				$("#btn-tableprintsave").off().on('click', function() {
					var oTable = $('#glRptVouSumTable').dataTable();
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
						headData: headdata
					})
					page.editor.close();
				});
				$("#btn-tableprintqx").off().on('click', function() {
					page.editor.close();
				})
			},
			//页面元素事件绑定使用jquery 的 on()方法
			onEventListener: function() {
				//方案作用域单选
				rpt.raidoInputGroup("rpt-radio-span");
				//期间单选按钮组
				rpt.raidoBtnGroup("rpt-query-btn-cont-date");
				//按钮提示
				rpt.tooltip();
				$(document).find('.rpt-tip-more').on('click', function() {
					if($(this).find("i").text() == "更多") {
						$(this).find("i").text("收起");
						$(this).find("span").removeClass("icon-angle-bottom").addClass("icon-angle-top");
						$('.rpt-query-box-top li').css({
							"display": "block"
						})
						$('.rpt-query-box-top li').eq(0).css({
							"display": "block"
						})
					} else {
						$(this).find("i").text("更多");
						$(this).find("span").removeClass("icon-angle-top").addClass("icon-angle-bottom");
						$('.rpt-query-box-top li').css({
							"display": "none"
						})
						$('.rpt-query-box-top li').eq(0).css({
							"display": "block"
						})
					}
				});

				$("#dateStart").ufDatepicker({
					format: 'yyyy-mm-dd',
					initialDate: '',
				}).on('change', function() {})
				$("#dateEnd").ufDatepicker({
					format: 'yyyy-mm-dd',
					initialDate: '',
				}).on('change', function() {})
				var mydate = new Date(pfData.svTransDate);
				Year = mydate.getFullYear();
				Month = (mydate.getMonth() + 1);
				Month = Month < 10 ? ('0' + Month) : Month;
				Day = mydate.getDate();
				$('#dateStart').getObj().setValue(Year + '-' + Month + '-01');
				$('#dateEnd').getObj().setValue(Year + '-' + Month + '-' + page.getLastDay(Year, Month));
				//				$(rpt.namespace).find("#dateStart,#dateEnd").datetimepicker(glRptVouSumDate);
				//				rpt.dateBenQi("dateStart", "dateEnd");
				$("#rpt-tab-time").find("span").eq(0).text($("#dateStart").getObj().getValue());
				$("#rpt-tab-time").find("span").eq(1).text($("#dateEnd").getObj().getValue());

				//选择期间，改变日历控件的值
				$(rpt.namespace + " #dateBq").on("click", function() {
					var mydate = new Date(pfData.svTransDate);
					Year = mydate.getFullYear();
					Month = (mydate.getMonth() + 1);
					Month = Month < 10 ? ('0' + Month) : Month;
					Day = mydate.getDate();
					$('#dateStart').getObj().setValue(Year + '-' + Month + '-01');
					$('#dateEnd').getObj().setValue(Year + '-' + Month + '-' + page.getLastDay(Year, Month));
					//					rpt.dateBenQi("dateStart", "dateEnd");
				});
				$(rpt.namespace + " #dateBn").on("click", function() {
					var mydate = new Date(pfData.svTransDate);
					Year = mydate.getFullYear();
					$('#dateStart').getObj().setValue(Year + '-01-01');
					$('#dateEnd').getObj().setValue(Year + '-12-31');
					//					rpt.dateBenNian("dateStart", "dateEnd");
				});
				$(rpt.namespace + " #dateJr").on("click", function() {
					var mydate = new Date(pfData.svTransDate);
					Year = mydate.getFullYear();
					Month = (mydate.getMonth() + 1);
					Month = Month < 10 ? ('0' + Month) : Month;
					Day = mydate.getDate();
					Day = Day < 10 ? ('0' + Day) : Day;
					$('#dateStart').getObj().setValue(Year + '-' + Month + '-' + Day);
					$('#dateEnd').getObj().setValue(Year + '-' + Month + '-' + Day);
					//					rpt.dateToday("dateStart", "dateEnd");
				});

				//单选会计体系
				$(rpt.namespace + " #accaList").on("click", "button", function() {
					if(!$(this).hasClass("btn-primary")) {
						$(this).addClass("btn-primary").removeClass("btn-default");
						$(this).siblings("button").removeClass("btn-primary").addClass("btn-default");
					}
				})

				/*				//查选方案列表的触摸效果
								rpt.methodPointer();

								//点击查询方案
								rpt.clickMethod();

								//使用共享方案
								rpt.useShareMethod();

								//删除查询方案
								rpt.deleteMethod();
				*/
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
				/*
								//展开隐藏共享查询方案
								rpt.showHideShareMethod();
				*/
				//搜索隐藏显示--表格模糊搜索
				rpt.searchHideShow(page.glRptVouSumTable);
				/*
								//显示更多查询方案
								rpt.showMoreMethod();*/

				//查询凭证汇总表
				$("#glRptVouSum-query").on("click", function() {
					if($('#dateStart').getObj().getValue() > $('#dateEnd').getObj().getValue()) {
						ufma.showTip('开始日期不能大于结束日期！', function() {}, 'error');
						return false;
					}
					var tabArgu = rpt.backTabArgu();
					tabArgu.isParallel = rpt.isParallelsum
					tabArgu.isDoubleVou = rpt.isDoubleVousum
					tabArgu.prjContent.startDate = $("#dateStart").getObj().getValue()
					tabArgu.prjContent.endDate = $("#dateEnd").getObj().getValue()
					if(rpt.isParallelsum == '1' && rpt.isDoubleVousum == '0') {
						if($('#accaList .btn-primary').text() == '全部') {
							tabArgu.prjContent.accaCode = '*'
						} else {
							tabArgu.prjContent.accaCode = $('#accaList .btn-primary').attr('data-code')
						}
					} else if(rpt.isParallelsum == '1' && rpt.isDoubleVousum == '1') {
						if($('#accaList .btn-primary').text() == '全部') {
							tabArgu.prjContent.accaCode = "1,2"
						} else {
							tabArgu.prjContent.accaCode = $('#accaList .btn-primary').attr('data-code')
						}
					} else {
						tabArgu.prjContent.accaCode = '*'
					}

					$("#rpt-tab-time").find("span").eq(0).text(tabArgu.prjContent.startDate);
					$("#rpt-tab-time").find("span").eq(1).text(tabArgu.prjContent.endDate);

					//var rptId = "GL_RPT_VOUSUMMARY";
					//portList.getReport+"{"+rptId+"}"
					// 查询时，修改方案的查询次数
					rpt.addQryCount(tabArgu.prjGuid);
					// 重新查询方案列表
					rpt.reqPrjList();
					ufma.ajax(portList.getReport, "post", tabArgu, function(result) {
						$('.rpt-table-sub-tip').html('');
						if(result.data.tableHead.vouSummaryReportData) {
							var tableHead = JSON.parse(result.data.tableHead.vouSummaryReportData);
							headdata = []
							var tableData = result.data.tableData;
							var arr = [];
							if($('#rpt-pzzh-select option').eq(i).text() == ''){
								for(var j = 0; j < tableHead.length; j++) {
									arr.push(tableHead[j])
								}
							}else{
								for(var j = 0; j < tableHead.length; j++) {
									for(var i = 0; i < $('#rpt-pzzh-select option').length; i++) {
										if(tableHead[j].CHR_NAME == $('#rpt-pzzh-select option').eq(i).text()) {
											arr.push(tableHead[j])
										}
									}
								}
							}
							var uls = '';
							for(var i = 0; i < arr.length; i++) {
								var title = '凭证字号：'+ arr[i].CHR_NAME + ' ' + arr[i].VOU_FROM + '至' + arr[i].VOU_TO + ' 凭证张数：' + arr[i].VOU_NUM + ' 凭证附件数：'+arr[i].VOU_ATT_CNT
								var lens ={}
								lens['title']=title
								lens.dates =$("#rpt-tab-time").find('span').eq(0).html()+' 至 '+$("#rpt-tab-time").find('span').eq(1).html()
								headdata.push(lens)
								if(i % 2 == 0) {
									uls += '<ul style="float:left;">'
								} else {
									uls += '<ul style="margin-left:-30px;float:left;">'
								}
								uls += '<li class="rpt-tab-pzzh">凭证字号：<span>' + arr[i].CHR_NAME + ' ' + arr[i].VOU_FROM + '</span><span>至' + arr[i].VOU_TO + '</span></li>'
								uls += '<li class="rpt-tab-pzzs">凭证张数：<span>' + arr[i].VOU_NUM + '</span></li>'
								uls += '<li class="rpt-tab-pzfj">凭证附件数：<span>' + arr[i].VOU_ATT_CNT + '</span></li>'
								uls += '</ul>'
							}
							$('.rpt-table-sub-tip').html(uls)
							if(arr.length % 2 == 0 && arr.length > 0) {
								$('.rpt-table-sub-tip').css('height', arr.length * 15 + 'px')
							} else if(arr.length % 2 != 0 && arr.length > 0) {
								$('.rpt-table-sub-tip').css('height', (arr.length + 1) * 15 + 'px')
							}
							// $('.rpt-table-sub-action').css('margin-top', -30 + 'px');
							// $("#rpt-tab-time").find("span").eq(0).text(arr[0].VOU_DATE_FROM);
							// $("#rpt-tab-time").find("span").eq(1).text(arr[0].VOU_DATE_TO);
							pageLength = ufma.dtPageLength('#glRptVouSumTable');
							page.glRptVouSumDataTable.clear().destroy();
							if(tableData.length > 0) {
								page.glRptVouSumDataTable = page.newTable(tableData);
							} else {
								page.newTable([]);
							}
						} else {
							//ufma.showTip('数据不存在!', function() {}, 'warning');
							pageLength = ufma.dtPageLength('#glRptVouSumTable');
							page.glRptVouSumDataTable.clear().destroy();
							page.newTable([]);
						}

					});
				})

			},
			getLastDay: function(year, month) {
				var new_year = year; //取当前的年份          
				var new_month = month++; //取下一个月的第一天，方便计算（最后一天不固定）          
				if(month > 12) {
					new_month -= 12; //月份减          
					new_year++; //年份增          
				}
				var new_date = new Date(new_year, new_month, 1); //取当年当月中的第一天          
				return(new Date(new_date.getTime() - 1000 * 60 * 60 * 24)).getDate(); //获取当月最后一天日期 

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
				ufma.parse();
				this.initPage();
				this.onEventListener();
				this.initPageNew();
				ufma.parseScroll();
			}
		}
	}();

	/////////////////////
	page.init();
});