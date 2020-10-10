$(function () {
	var pageLength = ufma.dtPageLength('#glRptDlyJounalTable');
	var page = function () {

		var glRptDlyJounalDataTable; //全局datatable对象
		var glRptDlyJounalTable; //全局table的ID
		var glRptDlyJounalThead; //全局table的头部ID

		//日记账所用接口
		var portList = {
			getReport: "/gl/rpt/getReportData/GL_RPT_DAILYJOURNAL" //请求表格数据
		};

		var SANLANColsArr = [{
			data: "vouDate",
			className: "isprint tc nowrap",
			width: 92
		}, //0日期
		{
			data: "vouNo",
			className: "isprint",
			width: 154
		}, //1凭证字号
		{
			data: "billDate",
		}, //2票据日期
		{
			data: "billNo",
		}, //3票据号
		{
			data: "dAccoName"
		}, //4对方科目
		{
			data: "vouGuid"
		}, //5凭证
		{
			data: "descpt",
			className: "isprint length-overflow-tr",
			"render": function (data, type, full, meta) {
				if (data != null) {
					if (full.vouGuid != null) {
						return '<span  title="'+data+'">' + data + '</span>';
					} else {
						return data;
					}
				} else {
					return "";
				}
			}
		}, //-5摘要
		{
			data: "dStadAmt",
			className: "isprint tdNum right",
			width: 170
		}, //-4借方金额
		{
			data: "cStadAmt",
			className: "isprint tdNum",
			width: 170
		}, //-3贷方金额
		{
			data: "drCr",
			className: "isprint tc",
			// className: "isprint tdNum"
		}, //-2方向
		{
			data: "bStadAmt",
			className: "isprint tdNum right",
			width: 170
		} //-1余额
		];
		//外币式
		var WAIBIColsArr = [{
			data: "vouDate",
			className: "isprint tc nowrap",
			width: 92
		}, //-17日期
		{
			data: "vouNo",
			className: 'nowrap isprint',
			width: 154
		}, //-16凭证字号
		{
			data: "billDate",
			className: 'nowrap isprint',
			width: 140
		}, //15票据日期
		{
			data: "billNo",
			className: 'nowrap isprint',
			width: 150
		}, //-14票据号
		{
			data: "dAccoName",
			className: 'ellipsis isprint',
			width: 200,
			render: function (data, type, rowdata, meta) {
				if (data == '' || data == null) {
					data = ''
				}
				return '<span  title="' + data + '">' + data + '</span>'
			}
		}, //-13对方科目
		{
			data: "vouGuid"
		}, //-12凭证
		{
			data: "descpt",
			className: 'ellipsis isprint length-overflow-tr',
			width: 200,
			"render": function (data, type, full, meta) {
				if (data != null) {
					if (full.vouGuid != null) {
						return '<span  title="'+data+'">' + data + '</span>';
					} else {
						return data;
					}
				} else {
					return "";
				}
			}
		}, //-11摘要
		{
			data: "dExRate",
			className: 'nowrap  isprint right',
		}, //-10借方金额-汇率
		{
			data: "dCurrAmt",
			className: 'nowrap isprint tdNum right',
			width: 170
		}, //-9借方金额-外币
		{
			data: "dStadAmt",
			className: 'nowrap  isprint tdNum right',
			width: 170
		}, //-8借方金额-本币
		{
			data: "cExRate",
			className: 'nowrap  isprint right',
		}, //-7贷方金额-汇率
		{
			data: "cCurrAmt",
			className: 'nowrap  isprint tdNum right',
			width: 170
		}, //-6贷方金额-外币
		{
			data: "cStadAmt",
			className: 'nowrap  isprint tdNum right',
			width: 170
		}, //-5贷方金额-本币
		{
			data: "drCr",
			className: 'nowrap tc isprint ',
		}, //-4方向
		{
			data: "bExRate",
			className: 'nowrap  isprint ',
		}, //-3余额-汇率
		{
			data: "bCurrAmt",
			className: 'nowrap  isprint tdNum right',
			width: 170
		}, //-2余额-外币
		{
			data: "bStadAmt",
			className: 'nowrap  isprint tdNum right',
			width: 170
		} //-1余额-本币
		];
		//数量式
		var SHULIANGColsArr = [{
			data: "vouDate",
			className: "isprint tc nowrap",
			width: 92
		}, //-18日期	

		{
			data: "vouNo",
			className: 'nowrap isprint',
			width: 154
		}, //-15凭证字号
		{
			data: "billDate",
			className: 'nowrap isprint',
			width: 150
		}, //-14票据日期
		{
			data: "billNo",
			className: 'nowrap isprint',
			width: 150
		}, //-13票据号
		{
			data: "dAccoName",
			className: 'ellipsis isprint',
			width: 200,
			render: function (data, type, rowdata, meta) {
				if (data == '' || data == null) {
					data = ''
				}
				return '<span  title="' + data + '">' + data + '</span>'
			}
		}, //-12对方科目
		{
			data: "vouGuid",
			className: 'nowrap isprint',
		}, //-15凭证字号
		{
			data: "descpt",
			className: 'ellipsis isprint length-overflow-tr',
			width: 250,
			"render": function (data, type, full, meta) {
				if (data != null) {
					if (full.vouGuid != null) {
						return '<span  title="'+data+'">' + data + '</span>';
					} else {
						return data;
					}
				} else {
					return "";
				}
			}
		}, //-11摘要

		{
			data: "dPrice",
			className: 'nowrap  isprint tdNum right',
			width: 170
		}, //-10借方金额-单价
		{
			data: "dQty",
			className: 'nowrap  isprint'
		}, //-9借方金额-数量
		{
			data: "dStadAmt",
			className: 'nowrap  isprint tdNum right',
			width: 170
		}, //-8借方金额-金额

		{
			data: "cPrice",
			className: 'nowrap  isprint tdNum'
		}, //-7贷方金额-单价
		{
			data: "cQty",
			className: 'nowrap  isprint'
		}, //-6贷方金额-数量
		{
			data: "cStadAmt",
			className: 'nowrap  isprint tdNum right',
			width: 170
		}, //-5贷方金额-金额
		{
			data: "drCr",
			className: 'nowrap tc isprint '
		}, //-4方向
		{
			data: "bPrice",
			className: 'nowrap  isprint tdNum right',
			width: 170
		}, //-3余额-单价
		{
			data: "bQty",
			className: 'nowrap  isprint'
		}, //-2余额-数量
		{
			data: "bStadAmt",
			className: 'nowrap isprint tdNum right',
			width: 170
		} //-1余额-金额
		];


		//数量外币式
		var SHULWAIBColsArr = [
			{
				data: "vouDate",
				className: "isprint tc nowrap",
				width: 92
			}, //-24日期
			{
				data: "vouNo",
				className: 'nowrap isprint',
			}, //-21凭证字号
			{
				data: "billDate",
				className: 'nowrap isprint',
				width: 140
			}, //20票据日期
			{
				data: "billNo",
				className: 'nowrap isprint',
				width: 150
			}, //-19票据号
			{
				data: "dAccoName",
				className: 'ellipsis isprint',
				width: 200,
				render: function (data, type, rowdata, meta) {
					if (data == '' || data == null) {
						data = ''
					}
					return '<span  title="' + data + '">' + data + '</span>'
				}
			}, //-18对方科目
			{
				data: "vouGuid",
				className: 'nowrap isprint'
			}, //-21凭证
			{
				data: "descpt",
				className: 'ellipsis isprint length-overflow-tr',
				width: 200,
				"render": function (data, type, full, meta) {
					if (data != null) {
						if (full.vouGuid != null) {
							return '<span  title="'+data+'">' + data + '</span>';
						} else {
							return data;
						}
					} else {
						return "";
					}
				}
			}, //-17摘要
			{
				data: "dExRate",
				className: 'nowrap isprint  ',
				width: 100
			}, //-16借方金额-汇率
			{
				data: "dCurrAmt",
				className: 'nowrap isprint tdNum right',
				width: 170
			}, //-15借方金额-外币
			{
				data: "dPrice",
				className: 'nowrap isprint  tdNum right',
				width: 170
			}, //-14借方金额-单价
			{
				data: "dQty",
				className: 'nowrap isprint '
			}, //-13借方金额-数量
			{
				data: "dStadAmt",
				className: 'nowrap isprint tdNum right',
				width: 170
			}, //-12借方金额-本币
			{
				data: "cExRate",
				className: 'nowrap isprint right',
				width: 100
			}, //-11贷方金额-汇率
			{
				data: "cCurrAmt",
				className: 'nowrap  isprint tdNum right',
				width: 170
			}, //-10贷方金额-外币
			{
				data: "cPrice",
				className: 'nowrap isprint tdNum right',
				width: 170
			}, //-9贷方金额-单价
			{
				data: "cQty",
				className: 'nowrap isprint'
			}, //-8贷方金额-数量
			{
				data: "cStadAmt",
				className: 'nowrap  isprint tdNum right',
				width: 170
			}, //-7贷方金额-本币
			{
				data: "drCr",
				className: 'nowrap tc isprint ',
			}, //-6方向
			{
				data: "bExRate",
				className: 'nowrap isprint right',
				width: 100
			}, //-5余额-汇率
			{
				data: "bCurrAmt",
				className: 'nowrap  isprint tdNum right',
				width: 170
			}, //-4余额-外币
			{
				data: "bPrice",
				className: 'nowrap isprint tdNum right',
				width: 170
			}, //-3余额-单价
			{
				data: "bQty",
				className: 'nowrap isprint '
			},//-2余额-数量
			{
				data: "bStadAmt",
				className: 'nowrap  isprint tdNum right',
				width: 170
			}, //-1余额-本币
		];
		var SANLANhtml1;
		var SANLANhtml2;

		var WAIBIhtml1;
		var WAIBIhtml2;

		var SHULIANGhtml1;
		var SHULIANGhtml2;

		var SHULWAIBhtml1;
		var SHULWAIBhtml2;

		return {

			//表格初始化
			newTable: function (columnsArr, tableData, type) {
				pageLength = ufma.dtPageLength('#glRptDlyJounalTable');
				var id = "glRptDlyJounalTable"; //表格id
				var toolBar = $('#' + id).attr('tool-bar');
				var columnDefsArr = [];
				if (type == "SANLAN") {
					columnDefsArr = [{
						"targets": [1],
						"render": function (data, type, full, meta) {
							if (data != null) {
								if (full.vouGuid != null) {
									return '<span class="turn-vou" data-vouguid="' + full.vouGuid + '">' + data + '</span>';
								} else {
									return data;
								}
							} else {
								return "";
							}
						}
					},
					{
						"targets": [2, 3, 4, 5],
						"visible": false
					},
					{
						"targets": [-5],
					},
					{
						"targets": [-4, -3, -1],
						"className": "tdNum isprint",
						"render": $.fn.dataTable.render.number(',', '.', 2, '')
					}
					]
				} else if (type == "WAIBI") {
					columnDefsArr = [{
						"targets": [1],
						"render": function (data, type, full, meta) {
							if (data != null) {
								if (full.vouGuid != null) {
									return '<span class="turn-vou" data-vouguid="' + full.vouGuid + '">' + data + '</span>';
								} else {
									return data;
								}
							} else {
								return "";
							}
						}
					},
					{
						"targets": [2, 3, 4, 5],
						"visible": false
					},
					{
						"targets": [5],
					},
					{
						"targets": [-9, -8, -6, -5, -2 - 1],
						"className": "tdNum isprint",
						"render": $.fn.dataTable.render.number(',', '.', 2, '')
					}
					]
				} else if (type == "SHULIANG") {
					columnDefsArr = [{
						"targets": [1],
						"render": function (data, type, full, meta) {
							if (data != null) {
								if (full.vouGuid != null) {
									return '<span class="turn-vou" data-vouguid="' + full.vouGuid + '">' + data + '</span>';
								} else {
									return data;
								}
							} else {
								return "";
							}
						}
					},
					{
						"targets": [2, 3, 4, 5],
						"visible": false
					},
					{
						"targets": [5],
					},
					{
						"targets": [-10, -8, -7, -5, -3 - 1],
						"className": "tdNum isprint",
						"render": $.fn.dataTable.render.number(',', '.', 2, '')
					}
					]
				} else if (type == "SHULWAIB") {
					columnDefsArr = [{
						"targets": [1],
						"render": function (data, type, full, meta) {
							if (data != null) {
								if (full.vouGuid != null) {
									return '<span class="turn-vou" data-vouguid="' + full.vouGuid + '">' + data + '</span>';
								} else {
									return data;
								}
							} else {
								return "";
							}
						}
					},
					{
						"targets": [2, 3, 4, 5],
						"visible": false
					},
					{
						"targets": [5],
					},
					{
						"targets": [-15, -14, -12, -10, -9, -7, -4, -3 - 1],
						"className": "tdNum isprint",
						"render": $.fn.dataTable.render.number(',', '.', 2, '')
					}
					]
				}
				page.glRptDlyJounalDataTable = page.glRptDlyJounalTable.DataTable({
					"language": {
						"url": bootPath + "agla-trd/datatables/datatable.default.js"
					},
					"fixedHeader": {
						header: true,
						footer: true
					},
					"data": tableData,
					"processing": true, //显示正在加载中
					"pagingType": "full_numbers", //分页样式
					"lengthChange": true, //是否允许用户自定义显示数量p
					"lengthMenu": [
						[10, 20, 50, 100, 200, -1],
						[10, 20, 50, 100, 200, "全部"]
					],
					"pageLength": pageLength,
					"ordering": false,
					"columns": columnsArr,
					"columnDefs": columnDefsArr,
					"dom": '<"printButtons"B>rt<"' + id + '-paginate"ilp>',
					//"dom": '<"printButtons"B>rt<"tableBottom"<"tool-bar-body"<"ufma-tool-btns"><"info"<"' + id + '-paginate"ilp>>>><"tableBottomFix"<"tool-bar-body"<"ufma-tool-btns"><"info"<"' + id + '-paginate"ilp>>>>',
					buttons: [{
						extend: 'print',
						text: '<i class="glyphicon icon-print" aria-hidden="true"></i>',
						exportOptions: {
							columns: '.isprint',
							format: {
								header: function (data, columnIdx) {
									if ($(data).length == 0) {
										return data;
									} else {
										return $(data)[0].innerHTML;
									}
								}
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
							columns: '.isprint',
							format: {
								header: function (data, columnIdx) {
									if ($(data).length == 0) {
										return data;
									} else {
										return $(data)[0].innerHTML;
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

						//						$("#printTableData .buttons-print").addClass("btn-print btn-permission").attr({
						//							"data-toggle": "tooltip",
						//							"title": "打印"
						//						});
						$('.dt-buttons').remove()
						$(".btn-print").off().on('click', function () {
							page.editor = ufma.showModal('tableprint', 450, 350);
							$('#rptStyle').html('')
							var searchFormats = {};
							searchFormats.agencyCode = rpt.nowAgencyCode;
							searchFormats.acctCode = rpt.nowAcctCode;
							searchFormats.componentId = 'GL_RPT_LEDGER';
							var postSetData = {
								agencyCode: rpt.nowAgencyCode,
								acctCode: rpt.nowAcctCode,
								componentId: $('#rptType option:selected').val(),
								rgCode: pfData.svRgCode,
								setYear: pfData.svSetYear,
								sys: '100',
								directory: '日记账'
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
										$op = $('<option templId = ' + data[i].templId + ' valueid="' + data[i].reportCode + '" value="' + jData + '">' + data[i].reportName + '</option>');
										$('#rptTemplate').append($op);
									}
								},
								error: function () { }
							});
						});
						$("#btn-printyun").off().on("click", function () {
							var postSetData = {
								reportCode:'GL_RPT_DAILYJOURNAL_SANLAN',
								templId:'*'
							}
							if($("#geshi").find("option:selected").attr('value')=="SHULIANG"){
								postSetData.reportCode='GL_RPT_DAILYJOURNAL_SHULIANG'
							}else if($("#geshi").find("option:selected").attr('value')=="WAIBI"){
								postSetData.reportCode='GL_RPT_DAILYJOURNAL_WAIBI'
							}else if($("#geshi").find("option:selected").attr('value')=="SHULWAIB"){
								postSetData.reportCode='GL_RPT_DAILYJOURNAL_SLWB'
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
									tabArgu.prjContent.startDate = $("#dateStart").getObj().getValue()
									tabArgu.prjContent.endDate = $("#dateEnd").getObj().getValue()
									//						console.info(JSON.stringify(tabArgu));
									var nowTabType = $(".change-rpt-type i").attr("data-type");
									// 添加凭证字号类型字段参数
									tabArgu.prjContent.vouTypeCode = $("#rpt-query-pzzh").val();
									var runNum = data.data.rowNum
									ufma.ajaxDef('/gl/rpt/getReportPrintCloudData/GL_RPT_DAILYJOURNAL', "post", tabArgu, function (result) {
										var outTableData = {}
										outTableData.agency= rpt.nowAgencyCode+' '+rpt.nowAgencyName
										outTableData.times = $("#dateStart").getObj().getValue()+'至'+$("#dateEnd").getObj().getValue()
										outTableData.acco = $('input[id="ACCO-data-key"]').val()
										outTableData.printor = rpt.nowUserName
										outTableData.startPage = 1
										outTableData.logo = '/pf/pub/css/logo.png'
										outTableData.date = rpt.today
										outTableData.title = '日记账'
										outTableData.showWatermark = true
										var pagelen = result.data.tableData.length
										outTableData.totalPage= Math.ceil(pagelen/runNum)
										result.data.outTableData = outTableData
										var keys = []
										$("#colList input").each(function (i) {
											if($(this).is(":checked")){
												keys.push({
													title:$(this).attr('data-title'),
													key:$(this).attr('data-code')
												})
											}
										})
										result.data.tableHead = {"drColumns":keys}
										var names = medata.template
										var html = YYPrint.engine(medata.template,medata.meta, result.data);
										YYPrint.print(html)
									})
								},
								error: function() {}
							});
						})
						$("#printTableData .buttons-excel").addClass("btn-export btn-permission").attr({
							"data-toggle": "tooltip",
							"title": "导出"
						});
						//使用该方法导出的数据前后没有空格,但需要导出全部必须将翻页选择到"全部" guohx  20190709
						//导出begin
						$(".btn-export").off().on('click', function (evt) {
							evt = evt || window.event;
							evt.preventDefault();
							uf.expTable({
								title: '日记账',
								topInfo:[
									['单位：'+rpt.nowAgencyCode+' '+rpt.nowAgencyName],
									['账套：'+rpt.nowAcctCode+' '+rpt.nowAcctName],
									['期间：'+$("#dateStart").getObj().getValue()+'至'+$("#dateEnd").getObj().getValue()],
									['方案名称：'+$("#nowPrjName").html()]
								],
								exportTable: '#' + id
							});
							//ufma.expXLSForDatatable($('#' + id), '日记账');
						});
						// $(".btn-export").off().on('click', function (evt) {
						// 	evt = evt || window.event;
						// 	evt.preventDefault();
						// 	ufma.expXLSForDatatable($('#' + id), '日记账');
						// });
						//导出end							
						$('#printTableData.btn-group').css("position", "inherit");
						$('#printTableData div.dt-buttons').css("position", "inherit");
						$('#printTableData [data-toggle="tooltip"]').tooltip();

						ufma.isShow(page.reslist);
						$('.' + id + '-paginate').appendTo($info);

						page.setVisibleCol();

						//驻底begin
						var toolBar = $(this).attr('tool-bar')
						var $info = $(toolBar + ' .info');
						if ($info.length == 0) {
							$info = $('<div class="info"></div>').appendTo($(toolBar + ' .tool-bar-body'));
						}
						$info.html('');
						$('.' + id + '-paginate').appendTo($info);
						//固定表头
						$("#glRptDlyJounalTable").fixedTableHead();
						//金额区间-范围筛选
						rpt.twoSearch(page.glRptDlyJounalTable);
						// 点击表格行高亮
						rpt.tableTrHighlight();
					},
					"drawCallback": function (settings) {
						ufma.dtPageLength($(this));
						page.headArr = rpt.tableHeader(id);
						ufma.isShow(page.reslist);
						page.glRptDlyJounalTable.find("td.dataTables_empty").text("")
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
						$(rpt.namespace).find("td span").on("click", function () {
							rpt.openVouShow(this, "glRptDlyJounal");
						})
						//////////////
						$('#glRptDlyJounalTable_wrapper').ufScrollBar({
							hScrollbar: true,
							mousewheel: false
						});
						setTimeout(function () {
							ufma.setBarPos($(window));
						}, 30);

						//驻底end
						// $('#glRptDlyJounalTable').tblcolResizable();

						//摘要-模糊单项筛选
						rpt.oneSearch(page.glRptDlyJounalTable);

						//金额区间-范围筛选
						// rpt.twoSearch(page.glRptDlyJounalTable);

					}
				});

				return page.glRptDlyJounalDataTable;
			},

			//设置隐藏列盒子内容
			setVisibleCol: function () {
				var nowHead = page.headArr;
				var changeHead = [];
				var html = "";
				for (var i = 0; i < nowHead.length; i++) {
					if (!nowHead[i].visible && nowHead[i].title != "凭证ID") {
						//console.info(nowHead[i].title);
						changeHead.push(nowHead[i]);
						var h = ufma.htmFormat('<p><label class="mt-checkbox mt-checkbox-outline">' +
							'<input type="checkbox" data-title="<%=title%>" data-code="'+nowHead[i].code+'" data-index="<%=index%>"><%=title%>' +
							'<span></span>' +
							'</label></p>', {
								title: nowHead[i].title,
								index: i
							});
						html += h;
					}
				}
				$("#colList").html(html);
				page.changeCol = changeHead;
				//console.info("page.changeCol=="+JSON.stringify(page.changeCol));
			},

			//初始化页面
			initPage: function () {
				//增加筛选框
				$(rpt.namespace + " #SANLAN .thTitle.rpt-th-zhaiyao-5").after($(rpt.backOneSearchHtml("摘要内容", "-5")));
				$(rpt.namespace + " #SANLAN .thTitle.rpt-th-jine-4").after($(rpt.backTwoSearchHtml("rpt-funnelBoxNum", "金额区间", "-4")));
				$(rpt.namespace + " #SANLAN .thTitle.rpt-th-jine3-3").after($(rpt.backTwoSearchHtml("rpt-funnelBoxNum3", "金额区间", "-3")));
				$(rpt.namespace + " #SANLAN .thTitle.rpt-th-jine3-1").after($(rpt.backTwoSearchHtml("rpt-funnelBoxNum3", "金额区间", "-1")));

				$(rpt.namespace + " #WAIBI .thTitle.rpt-th-zhaiyao-5").after($(rpt.backOneSearchHtml("摘要内容", "5")));
				$(rpt.namespace + " #WAIBI .thTitle.rpt-th-jine3-9").after($(rpt.backTwoSearchHtml("rpt-funnelBoxNum", "金额区间", "-9")));
				$(rpt.namespace + " #WAIBI .thTitle.rpt-th-jine3-8").after($(rpt.backTwoSearchHtml("rpt-funnelBoxNum", "金额区间", "-8")));
				$(rpt.namespace + " #WAIBI .thTitle.rpt-th-jine3-6").after($(rpt.backTwoSearchHtml("rpt-funnelBoxNum3", "金额区间", "-6")));
				$(rpt.namespace + " #WAIBI .thTitle.rpt-th-jine3-5").after($(rpt.backTwoSearchHtml("rpt-funnelBoxNum3", "金额区间", "-5")));
				$(rpt.namespace + " #WAIBI .thTitle.rpt-th-jine3-2").after($(rpt.backTwoSearchHtml("rpt-funnelBoxNum3", "金额区间", "-2")));
				$(rpt.namespace + " #WAIBI .thTitle.rpt-th-jine3-1").after($(rpt.backTwoSearchHtml("rpt-funnelBoxNum3", "金额区间", "-1")));

				$(rpt.namespace + " #SHULIANG .thTitle.rpt-th-zhaiyao-5").after($(rpt.backOneSearchHtml("摘要内容", "5")));
				$(rpt.namespace + " #SHULIANG .thTitle.rpt-th-jine3-8").after($(rpt.backTwoSearchHtml("rpt-funnelBoxNum3", "金额区间", "-8")));
				$(rpt.namespace + " #SHULIANG .thTitle.rpt-th-jine3-5").after($(rpt.backTwoSearchHtml("rpt-funnelBoxNum3", "金额区间", "-5")));
				$(rpt.namespace + " #SHULIANG .thTitle.rpt-th-jine3-1").after($(rpt.backTwoSearchHtml("rpt-funnelBoxNum3", "金额区间", "-1")));

				$(rpt.namespace + " #SHULWAIB .thTitle.rpt-th-zhaiyao-5").after($(rpt.backOneSearchHtml("摘要内容", "5")));
				$(rpt.namespace + " #SHULWAIB .thTitle.rpt-th-jine3-15").after($(rpt.backTwoSearchHtml("rpt-funnelBoxNum3", "金额区间", "-15")));
				$(rpt.namespace + " #SHULWAIB .thTitle.rpt-th-jine3-12").after($(rpt.backTwoSearchHtml("rpt-funnelBoxNum3", "金额区间", "-12")));
				$(rpt.namespace + " #SHULWAIB .thTitle.rpt-th-jine3-10").after($(rpt.backTwoSearchHtml("rpt-funnelBoxNum3", "金额区间", "-10")));
				$(rpt.namespace + " #SHULWAIB .thTitle.rpt-th-jine3-7").after($(rpt.backTwoSearchHtml("rpt-funnelBoxNum3", "金额区间", "-7")));
				$(rpt.namespace + " #SHULWAIB .thTitle.rpt-th-jine3-4").after($(rpt.backTwoSearchHtml("rpt-funnelBoxNum3", "金额区间", "-4")));
				$(rpt.namespace + " #SHULWAIB .thTitle.rpt-th-jine3-1").after($(rpt.backTwoSearchHtml("rpt-funnelBoxNum3", "金额区间", "-1")));

				page.SANLANhtml1 = $("#SANLAN tr").eq(0).html();

				page.WAIBIhtml1 = $("#WAIBI tr").eq(0).html();
				page.WAIBIhtml2 = $("#WAIBI tr").eq(1).html();

				page.SHULIANGhtml1 = $("#SHULIANG tr").eq(0).html();
				page.SHULIANGhtml2 = $("#SHULIANG tr").eq(1).html();

				page.SHULWAIBhtml1 = $("#SHULWAIB tr").eq(0).html();
				page.SHULWAIBhtml2 = $("#SHULWAIB tr").eq(1).html();
				//需要根据自己页面写的ID修改
				page.glRptDlyJounalTable = $('#glRptDlyJounalTable'); //当前table的ID
				page.glRptDlyJounalThead = $('#glRptDlyJounalThead'); //当前table的头部ID

				var tableData = [];
				$('#glRptDlyJounalTable tbody').html('');
				page.glRptDlyJounalThead.html('<tr>' + page.SANLANhtml1 + '</tr>');
				page.glRptDlyJounalDataTable = page.newTable(SANLANColsArr, tableData, "SANLAN");
				ufma.isShow(page.reslist);

				//初始化单位样式
				rpt.initAgencyList();

				//初始化账套样式
				rpt.initAcctList();

				//请求单位列表
				rpt.reqAgencyList();
				
				// 账表数据范围选择框记忆上次选择的数据
				rpt.getSysRuleSet();

				//请求会计体系列表
				//rpt.reqAccaList();

				//请求查询条件其他选项列表
				rpt.reqOptList();
			},

			//页面元素事件绑定使用jquery 的 on()方法
			onEventListener: function () {
				$("#rpt-query-pzzh").on('change',function(){
					rpt.vouTypeCode = $("#rpt-query-pzzh").val();
				});
				
				$(".label-more").on("click", function () {
					var timeId = setTimeout(function () {
						clearTimeout(timeId);
						//金额区间-范围筛选
						rpt.twoSearch(page.glRptDlyJounalTable);
						// 修改 CWYXM-19464 bug, 调用了 分页高度自适应函数
						ufma.setBarPos($(window));
					}, 300)

				})
				//方案作用域单选
				rpt.raidoInputGroup("rpt-radio-span");
				//期间单选按钮组
				rpt.raidoBtnGroup("rpt-query-btn-cont-date");

				$(rpt.namespace).find(".change-rpt-type,.rpt-table-sub-tip-currency").on("click", "i", function () {
					$(this).hide();
					$(this).siblings("select").show();
				});
				$(rpt.namespace).find(".rpt-table-sub-tip-currency").on("change", "select", function () {
					var tableData = [];
					$(this).siblings("i").attr("data-type", $(this).val());
					$(this).hide();
					$(this).siblings("i").text($(this).find("option:checked").text()).show();
					pageLength = ufma.dtPageLength('#glRptDlyJounalTable');
					$('#glRptDlyJounalTable_wrapper').ufScrollBar('destroy');
					page.glRptDlyJounalDataTable.clear().destroy();
					var nowTabType = $(".change-rpt-type i").attr("data-type");
					if (nowTabType == "WAIBI") {
						page.glRptDlyJounalThead.html('<tr>' + page.WAIBIhtml1 + '</tr><tr>' + page.WAIBIhtml2 + '</tr>');
						$('#glRptDlyJounalTable tbody').html('');
						page.glRptDlyJounalDataTable = page.newTable(WAIBIColsArr, tableData, "WAIBI");
					} else if (nowTabType == "SHULWAIB") {
						page.glRptDlyJounalThead.html('<tr>' + page.SHULWAIBhtml1 + '</tr><tr>' + page.SHULWAIBhtml2 + '</tr>');
						$('#glRptDlyJounalTable tbody').html('');
						page.glRptDlyJounalDataTable = page.newTable(SHULWAIBColsArr, tableData, "SHULWAIB");
					}
				});
				$(rpt.namespace).find(".change-rpt-type").on("change", "select", function () {
					pageLength = ufma.dtPageLength('#glRptDlyJounalTable');
					$('#glRptDlyJounalTable_wrapper').ufScrollBar('destroy');
					page.glRptDlyJounalDataTable.clear().destroy();
					var columnsArr = [];
					var tableData = [];
					$(this).siblings("i").attr("data-type", $(this).val());
					if ($(this).val() == "SANLAN") {
						page.glRptDlyJounalThead.html('<tr>' + page.SANLANhtml1 + '</tr>');
						$('#glRptDlyJounalTable tbody').html('');
						columnsArr = SANLANColsArr;
						$(".rpt-table-sub-tip-currency").hide();
					} else if ($(this).val() == "WAIBI") {
						page.glRptDlyJounalThead.html('<tr>' + page.WAIBIhtml1 + '</tr><tr>' + page.WAIBIhtml2 + '</tr>');
						$('#glRptDlyJounalTable tbody').html('');
						columnsArr = WAIBIColsArr;
						$(".rpt-table-sub-tip-currency").show();
					} else if ($(this).val() == "SHULIANG") {
						page.glRptDlyJounalThead.html('<tr>' + page.SHULIANGhtml1 + '</tr><tr>' + page.SHULIANGhtml2 + '</tr>');
						$('#glRptDlyJounalTable tbody').html('');
						columnsArr = SHULIANGColsArr;
						$(".rpt-table-sub-tip-currency").hide();
					} else if ($(this).val() == "SHULWAIB") {
						page.glRptDlyJounalThead.html('<tr>' + page.SHULWAIBhtml1 + '</tr><tr>' + page.SHULWAIBhtml2 + '</tr>');
						$('#glRptDlyJounalTable tbody').html('');
						columnsArr = SHULWAIBColsArr;
						$(".rpt-table-sub-tip-currency").show();
					}
					page.glRptDlyJounalDataTable = page.newTable(columnsArr, tableData, $(this).val());
					$(this).hide();
					$(this).siblings("i").text($(this).find("option:checked").text()).show();
				});

				//按钮提示
				rpt.tooltip();

				$("#dateStart").ufDatepicker({
					format: 'yyyy-mm-dd',
					viewMode: 'day',
					initialDate: '',
					onChange: function (fmtDate) {
						rpt.checkDate(fmtDate, "#dateStart")
					}
				})
				$("#dateEnd").ufDatepicker({
					format: 'yyyy-mm-dd',
					viewMode: 'day',
					initialDate: '',
					onChange: function (fmtDate) {
						rpt.checkDate(fmtDate, "#dateEnd")
					}
				})
				var mydate = new Date(pfData.svTransDate);
				Year = mydate.getFullYear();
				Month = (mydate.getMonth() + 1);
				Month = Month < 10 ? ('0' + Month) : Month;
				Day = mydate.getDate();
				$('#dateStart').getObj().setValue(Year + '-' + Month + '-01');
				$('#dateEnd').getObj().setValue(Year + '-' + Month + '-' + this.getLastDay(Year, Month));
				//				$(rpt.namespace).find("#dateStart,#dateEnd").datetimepicker(glRptVouSumDate);
				//				rpt.dateBenQi("dateStart", "dateEnd");
				$("#rpt-tab-time").find("span").eq(0).text($("#dateStart").getObj().getValue());
				$("#rpt-tab-time").find("span").eq(1).text($("#dateEnd").getObj().getValue());

				//选择期间，改变日历控件的值
				//选择期间，改变日历控件的值
				$(" #dateBq").on("click", function () {
					rpt.dateBenQi("dateStart", "dateEnd");
				});
				$(" #dateBn").on("click", function () {
					rpt.dateBenNian("dateStart", "dateEnd");
				});
				$(" #dateJr").on("click", function () {
					rpt.dateToday("dateStart", "dateEnd");
				});

				//单选会计体系
				$(rpt.namespace + " #accaList").on("click", "button", function () {
					if (!$(this).hasClass("btn-primary")) {
						//sessionStorage.clear();
						if (rpt.sessionKeyArr.length > 0) {
							for (var i = 0; i < rpt.sessionKeyArr.length; i++) {
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

				//搜索隐藏显示--表格模糊搜索
				// rpt.searchHideShow(page.glRptDlyJounalTable);
				ufma.searchHideShow(page.glRptDlyJounalTable);

				//显示/隐藏筛选框
				rpt.isShowFunnelBox();

				//显示/隐藏列隐藏框
				$(rpt.namespace).on("click", "#colAction", function (evt) {
					evt.stopPropagation();
					$("#colList input").each(function (i) {
						$(this).prop("checked", page.changeCol[i].visible);
					})

					$("div.rpt-funnelBox").hide();
					$(this).next("div.rpt-funnelBox").show();
				})

				//确认添加列
				$(rpt.namespace).find("#addCol").on("click", function (evt) {
					evt.stopPropagation();
					$("#colList label").each(function (i) {
						page.changeCol[i].visible = $(this).find("input").prop("checked");
						var nn = $(this).find("input").data("index");
						if ($(this).find("input").is(":checked")) {
							page.glRptDlyJounalDataTable.column(nn).visible(true);
							$(page.glRptDlyJounalDataTable.settings()[0].aoColumns[nn].nTh).addClass("isprint");
						} else {
							page.glRptDlyJounalDataTable.column(nn).visible(false);
							$(page.glRptDlyJounalDataTable.settings()[0].aoColumns[nn].nTh).removeClass("isprint");
						}
					});
					page.glRptDlyJounalDataTable.columns.adjust().draw();
					//固定表头
					$("#glRptDlyJounalTable").fixedTableHead();
				});


				//查询日记账
				$("#glRptDlyJounal-query").on("click", function () {
					if ($('#dateStart').getObj().getValue() > $('#dateEnd').getObj().getValue()) {
						ufma.showTip('开始日期不能大于结束日期！', function () { }, 'error');
						return false;
					}
					var $accoInput = $("#ACCO-data-key")
					if (!$.data($accoInput[0], 'data')) {
						ufma.showTip("请选择会计科目！", function () {
							$("#ACCO-data-key").focus();
						}, "warning");
						$("#ACCO-data-key").focus();
						return false;
					} else {
						var tabArgu = rpt.backTabArgu();

						tabArgu.prjContent.startDate = $("#dateStart").getObj().getValue()
						tabArgu.prjContent.endDate = $("#dateEnd").getObj().getValue()
						//						console.info(JSON.stringify(tabArgu));
						var nowTabType = $(".change-rpt-type i").attr("data-type");

						// 添加凭证字号类型字段参数
						tabArgu.prjContent.vouTypeCode = $("#rpt-query-pzzh").val();
						ufma.showloading('正在加载数据，请耐心等待...');

						// 查询时，修改方案的查询次数
						rpt.addQryCount(tabArgu.prjGuid);
						// 重新查询方案列表
						rpt.reqPrjList();
						
						ufma.ajax(portList.getReport, "post", tabArgu, function (result) {
							ufma.hideloading();
							var tableHead = result.data.tableHead;
							var tableData = result.data.tableData;

							for (var i = 0; i < tableData.length; i++) {
								if (tableData[i].descpt === "当日小计" || tableData[i].descpt === "本月合计" || tableData[i].descpt === "本年累计") {
									tableData[i].billDate = ""
								}
							}

							$('#glRptDlyJounalTable_wrapper').ufScrollBar('destroy');
							page.glRptDlyJounalDataTable.clear().destroy();

							if (nowTabType == "SANLAN") {
								page.glRptDlyJounalDataTable = page.newTable(SANLANColsArr, tableData, "SANLAN");
							} else if (nowTabType == "WAIBI") {
								page.glRptDlyJounalDataTable = page.newTable(WAIBIColsArr, tableData, "WAIBI");
							} else if (nowTabType == "SHULIANG") {
								page.glRptDlyJounalDataTable = page.newTable(SHULIANGColsArr, tableData, "SHULIANG");
							} else if (nowTabType == "SHULWAIB") {
								page.glRptDlyJounalDataTable = page.newTable(SHULWAIBColsArr, tableData, "SHULWAIB");
							}

						});
					}
				})

				/*与bug75982问题2相同，故一并修改--zsj
				 * $(".rpt-p-search-key").find("input").on("blur", function() {
					$(this).val("");
				})*/
				$("#btn-tableprintsave").off().on('click', function () {
					var oTable = $('#glRptDlyJounalTable').dataTable();
					var tblData = oTable.fnGetData()
					var ztitle = {}
					for (var i = 0; i < $("#showColSet table tbody tr").length; i++) {
						if ($("#showColSet table tbody tr").eq(i).find('input').is(':checked')) {
							var code = $("#showColSet table tbody tr").eq(i).find('td').eq(0).attr('data-code').toLowerCase() + 'name'
							var name = $("#showColSet table tbody tr").eq(i).find('td').eq(0).attr('data-code')
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
				$("#btn-tableprintqx").off().on('click', function () {
					page.editor.close();
				})
				/*				//点击推荐操作
								rpt.clickTips();*/

			},
			getLastDay: function (year, month) {
				var new_year = year; //取当前的年份          
				var new_month = month++; //取下一个月的第一天，方便计算（最后一天不固定）          
				if (month > 12) {
					new_month -= 12; //月份减          
					new_year++; //年份增          
				}
				var new_date = new Date(new_year, new_month, 1); //取当年当月中的第一天          
				return (new Date(new_date.getTime() - 1000 * 60 * 60 * 24)).getDate(); //获取当月最后一天日期 
			},

			//重构
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
			},
			//此方法必须保留
			init: function () {
				page.reslist = ufma.getPermission();
				ufma.parse();
				this.initPage();
				this.initPageNew();
				this.onEventListener();
				ufma.parseScroll();
			}
		}
	}();

	/////////////////////
	page.init();
});