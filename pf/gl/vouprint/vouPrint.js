$(function () {
	var page = function () {
		var pageLength = ufma.dtPageLength('#vouPrint-data');
		var printServiceUrl = 'https:' == document.location.protocol ? "https://" + window.location.host : "http://" + window.location.host;
		//定义datatables全局变量
		var vouPrintDataTable;
		var isprintlp = true;
		var dtIdlength = 100;
		//打印列表查询传入数据
		var searchListData = {
			agencyCode: "",
			acctCode: "",
			fisPerd: "",
			accaCode: "",
			vouStatus: "",
			rgCode: "",
			vouTypeCode: "",
			startVouNo: "",
			endVouNo: "",
			inputorName: "",
			startVouDate: "",
			endVouDate: ""
		};
		var agencyName = ''
		var acctName = ''
		var zjprintData;//bug79482
		var vouTypeArray = {};
		//存储凭证数据数组
		var vouCountArr = [];
		var isfispredvouno = false
		var svData;
		var voutypeacca = ''
		var vousinglepz = false

		//年度为当前年
		var setYear;

		//系统用户
		var user;
		var userAgent = navigator.userAgent //取得浏览器的userAgent字符串
		var isIE = window.ActiveXObject || 'ActiveXObject' in window //判断是否IE浏览器
		var isEdge = userAgent.indexOf('Edge') > -1 //判断是否Edge浏览器
		function getPdf(reportCode, templId, groupDef) {
			// var xhr = new XMLHttpRequest()
			// var formData = new FormData()
			// formData.append('reportCode', reportCode)
			// formData.append('templId', templId)
			// formData.append('groupDef', groupDef)
			// xhr.open('POST', '/pqr/api/printpdfbydata', true)
			// xhr.setRequestHeader('context-type', 'text/xml;charset=utf-8')
			// xhr.responseType = 'blob'

			// //保存文件
			// xhr.onload = function (e) {
			// 	if (xhr.status === 200) {
			// 		if (xhr.status === 200) {
			// 			var content = decodeURIComponent(xhr.getResponseHeader('Content-Disposition'))
			// 			window.open(content, '_blank', 'titlebar=no,location=no,toolbar=no,menubar=no;top=100')
			// 		}
			// 	}
			// }

			// //状态改变时处理返回值
			// xhr.onreadystatechange = function () {
			// 	if (xhr.readyState === 4) {
			// 		//通信成功时
			// 		if (xhr.status === 200) {
			// 			//交易成功时
			// 			ufma.hideloading();
			// 		} else {
			// 			var content = decodeURIComponent(xhr.getResponseHeader('Content-Disposition'))
			// 			//提示框，各系统自行选择插件
			// 			alert(content)
			// 			ufma.hideloading();
			// 		}
			// 	}
			// }
			// xhr.send(formData)
			var xhr = new XMLHttpRequest()
			ufma.hideloading()
			ufma.showloading('正在生成打印文件，请耐心等待...');
			var formData = {}
			formData.reportCode = reportCode
			formData.templId = templId
			formData.groupDef = groupDef
			var responseId = ''
			function pdfcc(){
				$.ajax({
					type: "get",
					url: "/pqr/api/getSyncPdfFile/"+responseId,
					dataType: "json",
					async: false,
					success: function(data) {
						if(data.code == '500'){
							ufma.hideloading()
							ufma.showTip(data.result)
						}else if(data.code!='200'){
							setTimeout(function(){
								pdfcc()
							},1000)
						}else {
							ufma.hideloading()
							window.open(decodeURIComponent(data.result), '_blank', 'titlebar=no,location=no,toolbar=no,menubar=no;top=100') 
						}
					},
					error: function() {}
				});
			}
			xhr.open('POST', '/pqr/api/printpdfbydatasync', true)
			xhr.setRequestHeader('context-type', 'text/xml;charset=utf-8')
			xhr.responseType = 'json'

			//状态改变时处理返回值
			xhr.onreadystatechange = function() {
				if(xhr.readyState === 4) {
					//通信成功时
					if(xhr.status === 200) {
						//交易成功时
						// console.log(xhr.response.responseId)
						responseId = xhr.response.responseId
						pdfcc()
					} else {
						var content = decodeURIComponent(xhr.getResponseHeader('Content-Disposition'))
						//提示框，各系统自行选择插件
						alert(content)
						ufma.hideloading();
					}
				}
			}
			xhr.send(JSON.stringify(formData))
		}

		return {

			//高度设置
			setHeight: function () {
				var outH = $(".vou-table-tab").offset().top;
				var tableH = $("#vouPrint-data").outerHeight();
				var barH = $("#vouPrint-tool-bar").outerHeight();
				var infoH = $(".vou-table-info").height();
				var addH = ((tableH + barH) > infoH) ? (tableH + barH) : infoH;
				var height = outH + addH + 16;
				$(".workspace").outerHeight(height);
				ufma.parseDoubleScroll();
			},

			//表格金额自动添加千分位和小数点保留两位
			moneyFormat: function (num) {
				return num = (num == null || num == undefined || num == '') ? 0 : (parseFloat(num).toFixed(2) + '').replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,');
			},
			numFormat: function (s) {
				if ($.isNull(s)) return '0';
				else return s;
			},
			showBtn: function (showBtns) {
				if (showBtns.length > 4) {
					var $moreBtns = $('<div class="btn-group pull-right" style="margin-left: 8px;">' +
						'<button class="btn btn-default btn-sm dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">' +
						'更多 <span class="caret"></span></button><ul class="dropdown-menu"></ul></div>');
					for (var s = 0; s < showBtns.length; s++) {
						if (s <= (showBtns.length - 4)) {
							var $li = $('<li><a href="javascript:;" id="' + showBtns[s].id + '" class="' + showBtns[s].class + ' btn-permission">' + showBtns[s].name + '</a></li>');
							$moreBtns.find('ul.dropdown-menu').prepend($li);
						} else {
							var $div = $('<div class="btn-group pull-right" style="margin-left: 8px;">' +
								'<button type="button" id="' + showBtns[s].id + '"class="btn btn-sm ' + showBtns[s].class + ' btn-permission">' + showBtns[s].name + '</button></div>');
							$('.vou-method-tip').append($div);
						}
					}
					$('.vou-method-tip').prepend($moreBtns);
				} else if (showBtns.length <= 4 && showBtns.length > 0) {
					for (var s = 0; s < showBtns.length; s++) {
						var $div = $('<div class="btn-group pull-right">' +
							'<button type="button" id="' + showBtns[s].id + '" style="margin-left: 8px;" class="btn btn-sm ' + showBtns[s].class + ' btn-permission">' + showBtns[s].name + '</button></div>');
						$('.vou-method-tip').append($div);
					}
				}
			},
			//初始化页面，默认选择当前月为结账期间
			defineFisPerd: function () {
				//获得月份（0-11）
				var indexMonth = new Date(svData.svTransDate).getMonth();

				//时间选择样式
				$("#vouPrint .month-text .month-one").removeClass("choose");
				$("#vouPrint .month-text .month-one").eq(indexMonth).addClass("choose");
				$("#vouPrint .blue-line .blue-one").removeClass("choose");
				$("#vouPrint .blue-line .blue-one").eq(indexMonth).addClass("choose");

				searchListData.fisPerd = $("#vouPrint .month-text .month-one.choose a").attr("data-fisPerd");
			},

			//加载会计体系
			initAccaCode: function (result) {
				var data = result.data;

				//循环把button填入div
				var $accaCodeBtn = '<button class="btn btn-primary" value="">全部</button>';
				for (var i = 0; i < data.length; i++) {
					//创建会计体系button节点
					$accaCodeBtn += '<button class="btn btn-default" value="' + data[i].accaCode + '">' + data[i].accaName + '</button>';
				}
				$('#vpAccaCode').empty();
				$('#vpAccaCode').append($accaCodeBtn);
			},

			//加载凭证类型
			initVouType: function (result) {
				var data = result.data;
				//循环把option(button)填入select(div)
				var $vouTypeOp = '<option value="">  </option>';
				var $vouTypeBtn = '<button class="btn btn-primary" value="">全部</button>';
				vouTypeArray = {};
				for (var i = 0; i < data.length; i++) {
					//创建凭证类型option(button)节点
					vouTypeArray[data[i].code] = data[i].name;
					$vouTypeOp += '<option value="' + data[i].code + '">' + data[i].name + '</option>';
					$vouTypeBtn += '<button class="btn btn-default" value="' + data[i].code + '">' + data[i].name + '</button>';
				}
				$('#vpVouTypeCode').html($vouTypeOp);
				$('#vpVouTypeCodeBtn').html($vouTypeBtn);
			},
			getVouTypeNameByCode: function (key) {

				return (vouTypeArray[key] == undefined) ? "" : vouTypeArray[key];
			},
			//加载凭证状态
			initVouStatus: function (result) {
				var data = result.data;

				//循环把button填入div
				var $vouStatusBtn = '<button class="btn btn-primary" value="" >全部</button>';
				for (var i = 0; i < data.length; i++) {
					//创建凭证状态button节点
					$vouStatusBtn += '<button class="btn btn-default" value="' + data[i].ENU_CODE + '">' + data[i].ENU_NAME + '</button>';
				}
				$('#vpVouStatus').append($vouStatusBtn);
			},

			//datables数据显示
			getVouPrintList: function (result) {
				var id = "vouPrint-data";
				var toolBar = $('#' + id).attr('tool-bar');
				var postData = result.data;
				zjprintData = result.data;//bug79482
				var colums = [{
					title: '<label class="mt-checkbox mt-checkbox-single mt-checkbox-outline"> ' +
						'<input type="checkbox" class="datatable-group-checkable"/>&nbsp;' +
						'<span></span> ' +
						'</label>',
					className: "nowrap",
					data: null
				},
				{
					title: "日期",
					data: "vouDate"
				},
				{
					title: "凭证字号",
					className: "ellipsis",
					data: "vouNo"
				},
				{
					title: "摘要",
					className: "ellipsis",
					data: "vouDesc"
				},
				{
					title: "金额",
					className: "money-style ellipsis max-w-210",
					//                          className:"money-style max-w-210",
					data: "amtCr"
				},
				{
					title: "制单人",
					className: "ellipsis",
					data: "inputorName"
				},
				{
					title: "审核人",
					className: "ellipsis",
					data: 'auditorName'
				},
				{
					title: "记账人",
					className: "ellipsis",
					data: 'posterName'
				},
				{
					title: "打印次数",
					className: "money-style",
					data: 'printCount'
				}
				]
				if(vousinglepz){
					colums.splice(4,1,{
						title: "财务金额",
						className: "money-style ellipsis max-w-210",
						//                          className:"money-style max-w-210",
						data: "amtDr"},
						{
						title: "预算金额",
						className: "money-style ellipsis max-w-210",
						//                          className:"money-style max-w-210",
						data: "ysAmtDr"
					})
				}
				var columnDefs = [{
					"targets": [0],
					"serchable": false,
					"orderable": false,
					"className": "nowrap",
					"render": function (data, type, rowdata, meta) {
						return '<label class="mt-checkbox mt-checkbox-single mt-checkbox-outline"> ' +
							'<input type="checkbox" class="checkboxes" value="' + data + '" />&nbsp;' +
							'<span></span> ' +
							'</label>';
					}
				},
				{
					"targets": [2],
					"orderable": false,
					"render": function (data, type, rowdata, meta) {
						if (isfispredvouno) {
							var parse = rowdata.fisPerd
							if (parse < 10) {
								parse = '0' + parse.toString()
							} else {
								parse = parse.toString()
							}
							return '<a  class="forvouurl" data-vouguid="'+rowdata.vouGuid+'"><span data-toggle="tooltip" title="' + page.getVouTypeNameByCode(rowdata.vouTypeCode) + '-' + parse + '-' + rowdata.vouNo + '" >' + page.getVouTypeNameByCode(rowdata.vouTypeCode) + '-' + parse + '-' + rowdata.vouNo + '</span></a>';
						} else {
							return '<a  class="forvouurl" data-vouguid="'+rowdata.vouGuid+'"><span data-toggle="tooltip" title="' + page.getVouTypeNameByCode(rowdata.vouTypeCode) + '-' + rowdata.vouNo + '">' + page.getVouTypeNameByCode(rowdata.vouTypeCode) + '-' + rowdata.vouNo + '</span></a>';
						}
					}
				},
				{
					"targets": [3],
					"orderable": false,
					"render": function (data, type, rowdata, meta) {
						return '<span data-toggle="tooltip" title="' + ufma.parseNull(rowdata.vouDesc) + '">' + ufma.parseNull(rowdata.vouDesc) + '</span>';
					}
				},
				{
					"targets": [4],
					"orderable": false,
					"className": "money-style",
					"render": function (data, type, rowdata, meta) {
						return '<span data-toggle="tooltip" title="' + page.moneyFormat(rowdata.amtCr) + '">' + page.moneyFormat(rowdata.amtCr) + '</span>';
						//                              return '<span>'+page.moneyFormat(rowdata.amtCr)+'</span>';
					}
				},
				{
					"targets": [-4],
					"orderable": false,
					"render": function (data, type, rowdata, meta) {
						return '<span data-toggle="tooltip" title="' + ufma.parseNull(rowdata.inputorName) + '">' + ufma.parseNull(rowdata.inputorName) + '</span>';
					}
				},
				{
					"targets": [-3],
					"orderable": false,
					"render": function (data, type, rowdata, meta) {
						return '<span data-toggle="tooltip" title="' + ufma.parseNull(rowdata.auditorName) + '">' + ufma.parseNull(rowdata.auditorName) + '</span>';
					}
				},
				{
					"targets": [-2],
					"orderable": false,
					"render": function (data, type, rowdata, meta) {
						return '<span data-toggle="tooltip" title="' + ufma.parseNull(rowdata.posterName) + '">' + ufma.parseNull(rowdata.posterName) + '</span>';
					}
				}
				]
				
				if(vousinglepz){
					columnDefs.splice(3,1,{
						"targets": [4],
						"orderable": false,
						"className": "money-style",
						"render": function (data, type, rowdata, meta) {
							return '<span data-toggle="tooltip" title="' + page.moneyFormat(rowdata.amtDr) + '">' + page.moneyFormat(rowdata.amtDr) + '</span>';
							//                              return '<span>'+page.moneyFormat(rowdata.amtCr)+'</span>';
						}
					},
					{
						"targets": [5],
						"orderable": false,
						"className": "money-style",
						"render": function (data, type, rowdata, meta) {
							return '<span data-toggle="tooltip" title="' + page.moneyFormat(rowdata.ysAmtDr) + '">' + page.moneyFormat(rowdata.ysAmtDr) + '</span>';
							//                              return '<span>'+page.moneyFormat(rowdata.amtCr)+'</span>';
						}
					})
				}
				if(vouPrintDataTable){
					vouPrintDataTable.clear();    //清空数据
					vouPrintDataTable.destroy(); 
					$("#" + id).empty()
				}
				if(vousinglepz){
					$("#" + id).html('<thead>'+
					'<tr>'+
					'<th class="check-style nowrap"><labelclass="mt-checkbox mt-checkbox-single mt-checkbox-outline">'+
					'<input type="checkbox" class="group-checkable"data-set="#data-table .checkboxes" />&nbsp; <span></span>'+
					'</label></th>'+
					'<th style="width: 120px;">日期</th>'+
					'<th style="width: 140px;">凭证字号</th>'+
					'<th class="ellipsis">摘要</th>'+
					'<th>财务金额</th>'+
					'<th>预算金额</th>'+
					'<th class="ellipsis">制单人</th>'+
					'<th class="ellipsis">审核人</th>'+
					'<th class="ellipsis">记账人</th>'+
					'<th style="width: 72px;">打印次数</th>'+
					'</tr></thead><tfoot></tfoot>')
				}else{
					$("#" + id).html('<thead>'+
					'<tr>'+
					'<th class="check-style nowrap"><labelclass="mt-checkbox mt-checkbox-single mt-checkbox-outline">'+
					'<input type="checkbox" class="group-checkable"data-set="#data-table .checkboxes" />&nbsp; <span></span>'+
					'</label></th>'+
					'<th style="width: 120px;">日期</th>'+
					'<th style="width: 140px;">凭证字号</th>'+
					'<th class="ellipsis">摘要</th>'+
					'<th>金额</th>'+
					'<th class="ellipsis">制单人</th>'+
					'<th class="ellipsis">审核人</th>'+
					'<th class="ellipsis">记账人</th>'+
					'<th style="width: 72px;">打印次数</th>'+
					'</tr></thead><tfoot></tfoot>')
				}
				vouPrintDataTable = $("#" + id).DataTable({
					"language": {
						"url": bootPath + "agla-trd/datatables/datatable.default.js"
					},
					/*"serverSide": true,
                    "ajax":{
				        url:"http://localhost:8080/gl/print/list",
				        type:"POST",
				       	data:searchListData
				    },*/
					"data": postData,
					"bFilter": false, //去掉搜索框
					"bLengthChange": true, //去掉每页显示多少条数据
					"processing": true, //显示正在加载中
					"pagingType": "full_numbers", //分页样式
					"lengthChange": true, //是否允许用户自定义显示数量p
					"lengthMenu": [
						[20, 50, 100, 200, -1],
						[20, 50, 100, 200, "全部"]
					],
					//					"pageLength": ufma.dtPageLength(id),
					"pageLength": pageLength,
					"bInfo": true, //页脚信息
					"bSort": false, //排序功能
					"bAutoWidth": false, //表格自定义宽度，和swidth一起用
					"bProcessing": true,
					"bDestroy": true,
					/*"scrollX":"100%",
					"scrollCollapse":true,
					"fixedColumns":{
						leftColumns:5
					},*/
					"columns": colums,
					"columnDefs": columnDefs,
					"dom": 'rt<"' + id + '-paginate"ilp>',
					"initComplete": function (settings, json) {
						//批量操作toolbar与分页
						var $info = $(toolBar + ' .info');
						if ($info.length == 0) {
							$info = $('<div class="info"></div>').appendTo($(toolBar + ' .tool-bar-body'));
						}
						$info.html('');
						$('.' + id + '-paginate').appendTo($info);

						//行内操作
						$("#" + id + ' .btn').on("click", function () {
							page.actionMore($(this).attr("action"), [$(this).attr("rowid")], $(this).closest('tr'));
						});

						//行checkbox的单选操作（不好使）
						/*                        $("#" + id + " tbody td:not(.btnGroup)").on("click", function (e) {
						                            e.preventDefault();
						                            var $ele = $(e.target);
						                            var $tr = $ele.closest("tr");
						                            if ($tr.hasClass("selected")) {
						                                $tr.find("input[type=checkbox]").prop("checked", false);
						                                $tr.removeClass("selected");
						                            } else {
						                                $tr.find("input[type=checkbox]").prop("checked", true);
						                                $tr.addClass("selected");
						                            }
						                        });*/

						//checkbox的全选操作
						$(".datatable-group-checkable").on("change", function () {
							var isCorrect = $(this).is(":checked");
							$("#" + id + " .checkboxes").each(function () {
								isCorrect ? $(this).prop("checked", !0) : $(this).prop("checked", !1);
								isCorrect ? $(this).closest("tr").addClass("selected") : $(this).closest("tr").removeClass("selected");
							})
							$(".datatable-group-checkable").prop("checked", isCorrect);
						});

					},
					"drawCallback": function (settings) {
						$("#vouPrint-data").find("td.dataTables_empty").text("").append('<img src="' + bootPath + 'images/noData.png"/><br/><i>目前还没有你要查询的数据</i>');
						if ($("#vouPrint-data td.dataTables_empty").get(0)) {
							$("#vouPrint-data input.datatable-group-checkable").prop("disabled", true);
							$("#vouPrint-tool-bar input.datatable-group-checkable").prop("disabled", true);
							$("#vouPrint-data input.datatable-group-checkable").prop("checked", false);
							$("#vouPrint-tool-bar input.datatable-group-checkable").prop("checked", false);
							$("#btn-direct-print").prop("disabled", true);
							$("#btn-print-preview").prop("disabled", true);
						} else {
							$("#vouPrint-data input.datatable-group-checkable").prop("disabled", false);
							$("#vouPrint-tool-bar input.datatable-group-checkable").prop("disabled", false);
							$("#vouPrint-data input.datatable-group-checkable").prop("checked", false);
							$("#vouPrint-tool-bar input.datatable-group-checkable").prop("checked", false);
							$("#btn-direct-print").prop("disabled", false);
							$("#btn-print-preview").prop("disabled", false);
						}
						pageLength = ufma.dtPageLength('#vouPrint-data');
						var  tfoot = ''
						if(vousinglepz){
							tfoot+='<td></td>'
							tfoot+='<td></td>'
							tfoot+='<td></td>'
							tfoot+='<td>合计：</td>'
							tfoot+='<td class="money-style ellipsis max-w-210"><span class="amtSum nowrap"></span></td>'
							tfoot+='<td class="money-style ellipsis max-w-210"><span class="ysamtSum nowrap"></span></td>'
							tfoot+='<td></td>'
							tfoot+='<td></td>'
							tfoot+='<td></td>'
							tfoot+='<td></td>'
						}else{
							tfoot+='<td></td>'
							tfoot+='<td></td>'
							tfoot+='<td>合计：</td>'
							tfoot+='<td class="money-style ellipsis max-w-210"><span class="amtSum nowrap"></span></td>'
							tfoot+='<td></td>'
							tfoot+='<td></td>'
							tfoot+='<td></td>'
							tfoot+='<td></td>'
						}
						$("#vouPrint-data tfoot").html(tfoot)
						//合计金额
						if (!$("#vouPrint-data tbody td.dataTables_empty").get(0)) {
							var sum = vouPrintDataTable.column(4).data().reduce(function (a, b) {
								return a + b;
							});
							var yssum = vouPrintDataTable.column(5).data().reduce(function (a, b) {
								return a + b;
							});
							$("#vouPrint-data .amtSum").html('<span data-toggle="tooltip" title="' + page.moneyFormat(sum) + '">' + page.moneyFormat(sum) + '</span>');
							$("#vouPrint-data .ysamtSum").html('<span data-toggle="tooltip" title="' + page.moneyFormat(yssum) + '">' + page.moneyFormat(yssum) + '</span>');

							//样式
							if ($("#vouPrint-data tbody tr").length % 2 == 1) {
								$("#vouPrint-data tfoot tr").css({
									"backgroundColor": "#F9F9F9"
								});
							} else {
								$("#vouPrint-data tfoot tr").css({
									"backgroundColor": "#FFFFFF"
								});
							}
						}

						//按钮提示
						$("[data-toggle='tooltip']").tooltip();

						//权限判断

						//权限&更多
						$('.vou-method-tip').html("");
						var objBtns = [
							//此功能屏蔽
							{
								'id': "btn-printsetpdf",
								"name": "打印设置",
								"class": "btn-default btn-printsetpdf"
							}, {
								'id': "btn-printsetpdfsys",
								"name": "系统级打印设置",
								"class": "btn-default btn-printsetpdfsys"
							}, {
								"id": "btn-check-vou",
								"name": "凭证检查",
								"class": "btn-default btn-check-vou"
							}, {
								id: "btn-print-cover",
								name: "打印封面",
								class: "btn-default btn-print btn-print-cover"
							}, {
								"id": "btn-print-previewpdf",
								"name": "打印",
								"class": "btn-primary btn-print-previewpdf"
							}
							//清除老版打印
							// },{
							// 	"id": "btn-printset",
							// 	"name": "打印设置",
							// 	"class": "btn-default btn-printset"
							// },{
							// 	"id": "btn-direct-print",
							// 	"name": "直接打印",
							// 	"class": "btn-default btn-direct-print"
							// },{
							// 	"id": "btn-print-preview",
							// 	"name": "打印预览",
							// 	"class": "btn-primary btn-print-preview"
						];
						//						ufma.hasMoreBtn(page.reslist,objBtns,page.showBtn);
						page.showBtn(objBtns)
						ufma.isShow(page.reslist);
						page.setHeight();
						//						ufma.isShow(page.reslist);
						// if($("#btn-direct-print").length == 0) {
						// 	$("#btn-printset").remove()
						// 	$("#btn-print-cover").remove()
						// }
					}
				});
			},

			//获取凭证、打印信息和凭证数量数据
			getVouInfo: function (result) {
				var data = result.data;

				if (data != null) {
					//凭证信息
					$("#vouPrint .vou-table-info .info-vou dd").eq(0).text(page.numFormat(data.vouMap.VOUCOUNT) + '张');
					$("#vouPrint .vou-table-info .info-vou dd").eq(2).text(page.numFormat(data.vouMap.CNTCOUNT) + '张');
					$("#vouPrint .vou-table-info .info-vou dd").eq(3).text(page.moneyFormat(data.vouMap.AMTCOUNT));
					if(vousinglepz){
						$("#vouPrint .vou-table-info .info-vou dt").eq(4).show();
						$("#vouPrint .vou-table-info .info-vou dt").eq(5).show();
						$("#vouPrint .vou-table-info .info-vou dd").eq(4).text(page.moneyFormat(data.vouMap.AMTCOUNT)).show();
						$("#vouPrint .vou-table-info .info-vou dd").eq(5).text(page.moneyFormat(data.vouMap.YSAMTCOUNT)).show();
						$("#vouPrint .vou-table-info .info-vou dd").eq(3).hide();
						$("#vouPrint .vou-table-info .info-vou dt").eq(3).hide();
					}else{
						$("#vouPrint .vou-table-info .info-vou dt").eq(3).show();
						$("#vouPrint .vou-table-info .info-vou dd").eq(3).text(page.moneyFormat(data.vouMap.AMTCOUNT)).show();
						$("#vouPrint .vou-table-info .info-vou dd").eq(4).hide();
						$("#vouPrint .vou-table-info .info-vou dt").eq(4).hide();
						$("#vouPrint .vou-table-info .info-vou dd").eq(5).hide();
						$("#vouPrint .vou-table-info .info-vou dt").eq(5).hide();
					}
					var $ul = $('<ul class="list-unstyled"></ul>');
					for (var i = 0; i < data.vouMap.vouNoList.length; i++) {
						//判断noList是否为null
						if (data.vouMap.vouNoList[i].noList != null) {
							for (var j = 0; j < data.vouMap.vouNoList[i].noList.length; j++) {
								var $li = $('<li>' + page.getVouTypeNameByCode(data.vouMap.vouNoList[i].vouTypeCode) + '-' + data.vouMap.vouNoList[i].noList[j].beginVouNo + ' ~ ' + page.getVouTypeNameByCode(data.vouMap.vouNoList[i].vouTypeCode) + '-' + data.vouMap.vouNoList[i].noList[j].endVouNo + '</li>');
								$ul.append($li);
							}
						}
					}
					$("#vouPrint .vou-table-info .info-vou dd").eq(1).html($ul);

					//打印信息
					$("#vouPrint .vou-table-info .info-print dd").eq(0).text(data.printMap.nprintCount + '张');
					$("#vouPrint .vou-table-info .info-print dd").eq(1).text(data.printMap.PRINTCOUNT + '张');
					if (!data.printMap.LATESTTIME) {
						$("#vouPrint .vou-table-info .info-print dd").eq(2).text("");
					} else {
						var latestTime = data.printMap.LATESTTIME;
						latestDay = latestTime.substring(0, latestTime.indexOf(" "));
						latestTime = latestTime.substring(latestTime.indexOf(" ") + 1);
						var $ltUl = $('<ul class="list-unstyled">' +
							'<li>' + latestDay + '</li><li>' + latestTime + '</li>' +
							'</ul>');
						$("#vouPrint .vou-table-info .info-print dd").eq(2).html($ltUl);
					}
					$("#vouPrint .vou-table-info .info-print dd").eq(3).text(data.printMap.LATESTUSER ? data.printMap.LATESTUSER : "");

					//凭证数量
					//循环把对应期间的数量，填入数组对应位置
					for (var k = 0; k < data.vouCountMap.length; k++) {
						vouCountArr[data.vouCountMap[k].FISPERD - 1] = data.vouCountMap[k].VOUCOUNT;
					}
					for (var n = 0; n < vouCountArr.length; n++) {
						if (vouCountArr[n] == undefined) {
							vouCountArr[n] = 0;
						}
					}
				}
				page.voucounts(vouCountArr);

				page.setHeight();
			},

			//线图
			voucounts: function (array) {
				var max = array[0];

				for (var i = 1; i < array.length; i++) {

					if (max < array[i]) max = array[i];

				}
				var min = 10;
				if (max < 10) {
					min = 10
				} else {
					min = null;
				}
				//初始化
				var myChart = echarts.init(document.getElementById('voucounts'));
				//参数设置
				option = {
					tooltip: { //提示框组件
						trigger: 'axis',
						formatter: function (params) {
							params = params[0];
							return params.name + "期间：" + params.value + "张凭证";
						},
						axisPointer: {
							animation: false
						},
						backgroundColor: 'rgba(0,0,0,0.5)'
					},
					grid: { //直角坐标系内绘图网格
						top: '3%',
						left: '1%',
						right: '3%',
						bottom: '14%',
						containLabel: true
					},
					xAxis: { //直角坐标系 grid 中的 x 轴

						type: 'category',
						boundaryGap: false,

						data: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
						/*data: ['1期间', '2期间', '3期间', '4期间', '5期间', '6期间', '7期间','8期间','9期间','10期间','11期间','12期间'],*/
						axisLabel: {
							interval: 0,
							rotate: 0
						}
					},
					yAxis: { //直角坐标系 grid 中的 y 轴
						type: 'value',
						splitNumber: 10,
						max: min
					},
					series: [ //系列列表
						{
							name: '凭证数量',
							type: 'line',
							stack: '总量',
							data: array,
							itemStyle: {
								normal: {
									color: '#008ff0',
									lineStyle: { // 系列级个性化折线样式
										width: 1,
										type: 'solid'
									}
								},
								emphasis: {
									color: 'solid'
								}
							}
						}
					]
				};
				myChart.clear();
				myChart.setOption(option, true); //参数设置方法    
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
			//查询条件还原
			resetSearchData: function () {
				searchListData.accaCode = "";
				searchListData.vouStatus = "";
				searchListData.vouTypeCode = "";
				searchListData.startVouNo = "";
				searchListData.endVouNo = "";
				searchListData.inputorName = "";
				$("#vouPrint #vpAccaCode button:eq(0)").removeClass("btn-default").addClass("btn-primary").siblings().removeClass("btn-primary").addClass("btn-default");
				$("#vouPrint #vpVouTypeCodeBtn button:eq(0)").removeClass("btn-default").addClass("btn-primary").siblings().removeClass("btn-primary").addClass("btn-default");
				$("#vouPrint #vpVouStatus button:eq(0)").removeClass("btn-default").addClass("btn-primary").siblings().removeClass("btn-primary").addClass("btn-default");
				$("#vouPrint #vpVouTypeCode option:eq(0)").prop("selected", true);
				$("#vouPrint #vpStartVouNo").val("");
				$("#vouPrint #vpEndVouNo").val("");
				$("#vouPrint #vpShowOwn").prop("checked", false);
				$("#vouPrint #vpInputor").prop("disabled", false).val("");
				var nowfisPerd = searchListData.fisPerd
				var Year = svData.svSetYear;
				var Month = $("#vouPrint .month-text .month-one.choose a").attr("data-fisPerd");
				Month = Month < 10 ? ('0' + Month) : Month;
				$('#vbStartVouDate').getObj().setValue(Year + '-' + Month + '-01');
				$('#vbEndVouDate').getObj().setValue(Year + '-' + Month + '-' + page.getLastDay(Year, Month));
				searchListData.startVouDate = $('#vbStartVouDate').getObj().getValue();
				searchListData.endVouDate = $('#vbEndVouDate').getObj().getValue();
			},
			//初始化页面
			initPage: function () {
				page.reslist = ufma.getPermission();
				//				console.log(page.reslist)
				ufma.isShow(page.reslist);
				svData = ufma.getCommonData();
				user = svData.svUserName;
				setYear = svData.svSetYear;
				searchListData.rgCode = svData.svRgCode;
				//初始化期间
				this.defineFisPerd();
				//账套选择
				$("#vbStartVouDate").ufDatepicker({
					format: 'yyyy-mm-dd',
					initialDate: '',
				}).on('change', function () {
					var startdate = $('#vbStartVouDate').getObj().getValue();
					var enddate = $('#vbEndVouDate').getObj().getValue();
					var startD = new Date(Date.parse(startdate.replace(/-/g, "/")));
					var endD = new Date(Date.parse(enddate.replace(/-/g, "/")));
					var days = endD.getTime() - startD.getTime()
					if (days < 0 || startD.getMonth() + 1 != $("#vouPrint .month-text .month-one.choose a").attr("data-fisPerd")) {
						ufma.showTip("日期区间不符", function () { }, "warning");
						var mydate = new Date(svData.svTransDate);
						Year = mydate.getFullYear();
						Month = $("#vouPrint .month-text .month-one.choose a").attr("data-fisPerd")
						Month = Month < 10 ? ('0' + Month) : Month;
						Day = mydate.getDate();
						$('#vbStartVouDate').getObj().setValue(Year + '-' + Month + '-01');
						searchListData.startVouDate = $('#vbStartVouDate').getObj().getValue()
					} else {
						searchListData.startVouDate = $('#vbStartVouDate').getObj().getValue()
					}
				})
				$("#vbEndVouDate").ufDatepicker({
					format: 'yyyy-mm-dd',
					initialDate: '',
				}).on('change', function () {
					var startdate = $('#vbStartVouDate').getObj().getValue();
					var enddate = $('#vbEndVouDate').getObj().getValue();
					var startD = new Date(Date.parse(startdate.replace(/-/g, "/")));
					var endD = new Date(Date.parse(enddate.replace(/-/g, "/")));
					var days = endD.getTime() - startD.getTime()
					if (days < 0 || endD.getMonth() + 1 != $("#vouPrint .month-text .month-one.choose a").attr("data-fisPerd")) {
						ufma.showTip("日期区间不符", function () { }, "warning");
						var mydate = new Date(svData.svTransDate);
						Year = mydate.getFullYear();
						Month = (mydate.getMonth() + 1);
						Month = Month < 10 ? ('0' + Month) : Month;
						Day = mydate.getDate();
						$('#vbEndVouDate').getObj().setValue($('#vbStartVouDate').getObj().getValue());
						searchListData.endVouDate = $('#vbEndVouDate').getObj().getValue()
					} else {
						searchListData.endVouDate = $('#vbEndVouDate').getObj().getValue()
					}
				})
				page.cbAcct = $("#cbAcct").ufmaCombox2({
					valueField: 'code',
					textField: 'codeName',
					placeholder: '请选择账套',
					icon: 'icon-book',
					onchange: function (data) {
						searchListData.acctCode = data.code;
						acctName = data.name;
						if (data.isParallel == '1' && data.isDoubleVou == '1') {
							voutypeacca = 1
							vousinglepz = false
						} else if (data.isParallel == '1' && data.isDoubleVou == '0') {
							voutypeacca = 1
							vousinglepz = true
						} else if (data.isParallel == '0') {
							voutypeacca = 0
							vousinglepz = false
						}
						
						var params = {
							selAgecncyCode: searchListData.agencyCode,
							selAgecncyName: agencyName,
							selAcctCode: searchListData.acctCode,
							selAcctName: acctName
						}
						ufma.setSelectedVar(params);
						page.coderule = {
							codeRule: data.accoCodeRule,
							printType: 1,
							printLevle: '',
							isPrint: 1,
							accItemName: '会计科目'
						}
						//查询条件还原
						page.resetSearchData();
						if (voutypeacca == 1 && vousinglepz == false) {
							ufma.ajaxDef("/gl/eleVouType/getVouType/" + searchListData.agencyCode + "/" + setYear + "/" + searchListData.acctCode + "/" + '1,2', "get", "", page.initVouType);
						} else {
							ufma.ajaxDef("/gl/eleVouType/getVouType/" + searchListData.agencyCode + "/" + setYear + "/" + searchListData.acctCode + "/" + '*', "get", "", page.initVouType);
						}
						//账套改变后，加载表格
						$("#vouPrint-data .amtSum").text("");
						if ($('#btn-search').length > 0) {
							ufma.post("/gl/print/list", searchListData, page.getVouPrintList);
						}

						//账套改变后，加载表格信息
						vouCountArr = [];
						$("#vouPrint .vou-table-info .info-vou dd").html("");
						$("#vouPrint .vou-table-info .info-print dd").html("");

						if ($('#btn-search').length > 0) {
							ufma.post("/gl/print/message", searchListData, page.getVouInfo);
						}
						//根据单位账套判断是否启用平行记账，不启用时隐藏会计体系
						var url2 = "/gl/eleCoacc/getIsParallel?agencyCode=" + searchListData.agencyCode + "&acctCode=" + searchListData.acctCode;
						var callback2 = function (result) {
							var isParallel = result.data;
							var isParallel = result.data;
							if (isParallel.IS_DOUBLE_VOU == "1" && isParallel.IS_PARALLEL == "1") {
								$("#vpAccaCode").parents(".vou-query-li").hide();
							} else if (isParallel.IS_DOUBLE_VOU == "0" && isParallel.IS_PARALLEL == "1") {
								$("#vpAccaCode").parents(".vou-query-li").hide();
							} else {
								$("#vpAccaCode").parents(".vou-query-li").hide();
							}
						}
						ufma.get(url2, {}, callback2);
						ufma.get("/gl/eleAcca/getRptAccas?agencyCode=" + searchListData.agencyCode + "&acctCode=" + searchListData.acctCode + "&rgCode=" + searchListData.rgCode + "&setYear=" + setYear, "", page.initAccaCode);
					}
				});

				//单位选择
				page.cbAgency = $("#cbAgency").ufmaTreecombox2({
					valueField: "id",
					textField: "codeName",
					readonly: false,
					placeholder: "请选择单位",
					icon: "icon-unit",
					onchange: function (data) {
						searchListData.agencyCode = data.id;
						agencyName = data.name;
						ufma.ajaxDef("/gl/vou/getSysRuleSet/" + searchListData.agencyCode + "?chrCodes=GL028", 'get', "", function (data) {
							isfispredvouno = data.data.GL028;
						})
						//改变单位,账套选择内容改变
						var url = '/gl/eleCoacc/getRptAccts'
						var callback = function (result) {
							page.cbAcct = $("#cbAcct").ufmaCombox2({
								data: result.data
							});
							var svFlag = $.inArrayJson(result.data, "code", svData.svAcctCode);
							if (svFlag != undefined) {
								page.cbAcct.val(svData.svAcctCode);
							} else {
								if (result.data.length > 0) {
									page.cbAcct.val(result.data[0].code);
								}
							}
						}
						ufma.get(url, {
							'userId': svData.svUserId,
							'setYear': svData.svSetYear,
							'agencyCode': searchListData.agencyCode
						}, callback);

						//改变单位，凭证类型改变
						$("#vpVouTypeCode").html("");
						$("#vpVouTypeCodeBtn").html("");
						//改变单位，凭证状态改变
						$("#vpVouStatus").html("");
						ufma.get("/gl/vouBox/vouStatus?agencyCode=" + searchListData.agencyCode, "", page.initVouStatus);
					}
				});
				ufma.ajaxDef("/gl/eleAgency/getAgencyTree", "get", "", function (result) {
					page.cbAgency = $("#cbAgency").ufmaTreecombox2({
						data: result.data
					});
					var agyCode = $.inArrayJson(result.data, "id", svData.svAgencyCode);
					if (agyCode != undefined) {
						page.cbAgency.val(svData.svAgencyCode);
					} else {
						page.cbAgency.val(result.data[0].id);
					}
				});
				ufma.ajaxDef("/gl/vou/getSysRuleSet/" + searchListData.agencyCode + "?chrCodes=GL061", 'get', "", function (data) {
					isprintlp = data.data.GL061
				});
				ufma.get("/gl/eleAcca/getRptAccas?agencyCode=" + searchListData.agencyCode + "&acctCode=" + searchListData.acctCode + "&rgCode=" + searchListData.rgCode + "&setYear=" + setYear, "", page.initAccaCode);
			},

			//页面元素事件绑定使用jquery 的 on()方法
			onEventListener: function () {
				//表格单行选中
				$("#vouPrint-data").on("click", "tbody tr", function (e) {
					e.preventDefault();
					var inputDom = $(this).find('input.checkboxes');
					var inputCheck = $(inputDom).prop("checked");
					$(inputDom).prop("checked", !inputCheck);
					$(this).toggleClass("selected");
					var $tmp = $(".checkboxes:checkbox");
					$(".datatable-group-checkable").prop("checked", $tmp.length == $tmp.filter(":checked").length);
					return false;
				});
				$(document).on('change', '#vouPrint-data_length select[name="vouPrint-data_length"]', function () {
					pageLength = ufma.dtPageLength('#vouPrint-data');
				})
				//点击凭证检查按钮
				$("#vouPrint").on("click", "#btn-check-vou", function () {
					var vouKindArray = [];
					$("#vouPrint #vpVouTypeCodeBtn button").each(function () {
						if ($(this).val() != "") {
							var kindOne = {};
							kindOne.CHR_CODE = $(this).val();
							kindOne.VOU_FULLNAME = $(this).text();
							vouKindArray.push(kindOne);
						}
					});
					//传到凭证检查页面的数据
					var postCheckData = {
						agencyCode: searchListData.agencyCode,
						acctCode: searchListData.acctCode,
						fisPerd: searchListData.fisPerd,
						vouKind: vouKindArray,
						vouTypeArray: vouTypeArray
					};
					var isp = ''
					if (voutypeacca == 1 && vousinglepz == false) {
						isp = '1,2'
					} else {
						isp = '*'
					}
					ufma.open({
						url: 'vouPrintVouCheck.html',
						title: '凭证检查',
						width: 1000,
						//                      height:500,
						data: {
							action: 'vouCheck',
							data: postCheckData,
							setYear: svData.svSetYear,
							isDouble: isp

						},
						ondestory: function (data) {
							//窗口关闭时回传的值
							if (data.action) {
								//账套改变后，加载表格
								if (voutypeacca == 1 && vousinglepz == false) {
									ufma.ajaxDef("/gl/eleVouType/getVouType/" + searchListData.agencyCode + "/" + setYear + "/" + searchListData.acctCode + "/" + '1,2', "get", "", page.initVouType);
								} else {
									ufma.ajaxDef("/gl/eleVouType/getVouType/" + searchListData.agencyCode + "/" + setYear + "/" + searchListData.acctCode + "/" + '*', "get", "", page.initVouType);
								}
								$("#vouPrint-data .amtSum").text("");
								if ($('#btn-search').length > 0) {
									ufma.post("/gl/print/list", searchListData, page.getVouPrintList);
								}

								//账套改变后，加载表格信息
								vouCountArr = [];
								$("#vouPrint .vou-table-info .info-vou dd").html("");
								$("#vouPrint .vou-table-info .info-print dd").html("");
								if ($('#btn-search').length > 0) {
									ufma.post("/gl/print/message", searchListData, page.getVouInfo);
								}
							}
						}
					});
				});

				//点击打印封面按钮
				$("#vouPrint").on("click", "#btn-print-cover", function () {
					var postCoverData = {
						agencyName: page.cbAgency.getText(),
						agencyCode: searchListData.agencyCode,
						acctCode: searchListData.acctCode,
						fisPerd: searchListData.fisPerd,
						setYear: setYear,
						rgCode: svData.svRgCode
					};
					ufma.open({
						url: 'vouPrintPrintCover.html',
						title: '打印封面',
						width: 900,
						//                      height:500,
						data: {
							action: 'printCover',
							data: postCoverData
						},
						ondestory: function (data) {
							//窗口关闭时回传的值
						}
					});
				});

				//点击打印设置按钮
				$("#vouPrint").on("click", "#btn-printsetpdf", function () {
					//传到打印设置页面的数据
					var postSetData = {
						agencyCode: searchListData.agencyCode,
						acctCode: searchListData.acctCode,
						componentId: "GL_VOU",
						rgCode: svData.svRgCode,
						setYear: svData.svSetYear,
						sys: '100',
						directory: '打印凭证',
						isCrossDomain: page.isCrossDomain
					};
					ufma.setObjectCache("testData", postSetData);
					ufma.open({
						url: 'vouPrintPrintSet.html',
						title: '打印设置',
						width: 1150,
						//                      height:500,
						data: {
							action: 'printSet',
							data: postSetData,
							codeRule: page.coderule
						},
						ondestory: function (data) {
							//窗口关闭时回传的值
						}
					});
				});
				$("#vouPrint").on("click", "#btn-printsetpdfsys", function () {
					//传到打印设置页面的数据
					var postSetData = {
						agencyCode: searchListData.agencyCode,
						acctCode: searchListData.acctCode,
						componentId: "GL_VOU",
						rgCode: svData.svRgCode,
						setYear: svData.svSetYear,
						sys: '100',
						directory: '打印凭证',
						isCrossDomain: page.isCrossDomain
					};
					ufma.setObjectCache("testData", postSetData);
					ufma.open({
						url: 'vouPrintPrintSet.html',
						title: '打印设置',
						width: 1150,
						//                      height:500,
						data: {
							action: 'printSet',
							isSys: true,
							data: postSetData,
							codeRule: page.coderule
						},
						ondestory: function (data) {
							//窗口关闭时回传的值
						}
					});
				});
				//点击打印pdf设置按钮
				$("#vouPrint").on("click", "#btn-printset", function () {
					//传到打印设置页面的数据
					var postSetData = {
						agencyCode: searchListData.agencyCode,
						acctCode: searchListData.acctCode,
						componentId: "GL_VOU",
						rgCode: svData.svRgCode,
						setYear: svData.svSetYear,
						sys: '100',
						directory: '打印凭证'
					};
					ufma.setObjectCache("testData", postSetData);
					ufma.open({
						url: 'vouPrintPrintSetOld.html',
						title: '打印设置',
						width: 1150,
						//                      height:500,
						data: {
							action: 'printSet',
							data: postSetData
						},
						ondestory: function (data) {
							//窗口关闭时回传的值
						}
					});
				});
				//点击打印预览按钮
				$("#vouPrint").on("click", "#btn-print-preview,#vou-print-preview", function () {
					//bug79482--zsj--表格数据为空时不允许打印
					if (zjprintData.length < 1) {
						ufma.showTip('没有需要打印的数据', function () { }, 'warning');
						return false;
					}
					//清除缓存
					var searchData = {};
					searchData.agencyCode = searchListData.agencyCode;
					searchData.acctCode = searchListData.acctCode;
					searchData.componentId = "GL_VOU";
					var ajaxdata = {
						agencyCode: searchListData.agencyCode,
						acctCode: searchListData.acctCode,
						componentId: 'GL_VOU'
					}
					var TMPL_CODEs = ''
					var formatTmplCodes = ''
					ufma.ajaxDef('/gl/vouPrint/getUsedPrtList', 'post', ajaxdata, function (result) {
						if (result.data.length == 0) {
							ufma.showTip('未设置默认打印模板，请在打印设置中设置默认打印模板后执行打印', function () { }, 'warning')
							return false;
						} else {
							TMPL_CODEs = result.data[0].printTmpl.TMPL_CODE
							searchData.tmplCode = TMPL_CODEs
							//							formatTmplCodes = result.data[0].printTmpl.formatTmplCode
							searchData.formatTmplCode = formatTmplCodes
						}
					})
					// 					searchData.formatTmplCode = "3001";
					// 					searchData.tmplCode = "3001";
					var guidArr = [];
					//判断是否有勾选
					if (vouPrintDataTable.rows("tr.selected").data().length != 0) {
						//有勾选打勾选
						var tableData = vouPrintDataTable.rows("tr.selected").data();
						for (var i = 0; i < tableData.length; i++) {
							guidArr.push(tableData[i].vouGuid);
						}
					} else {
						//没勾选打全部
						var tableData = vouPrintDataTable.rows().data();
						for (var i = 0; i < tableData.length; i++) {
							guidArr.push(tableData[i].vouGuid);
						}
					}
					searchData.vouGuids = guidArr;
					var callback = function (result) {
						var pData = result.data;
						var domain = printServiceUrl + '/pqr/pages/query/query.html';
						var uniqueInfo = new Date().getTime().toString()
						var url = domain +
							'?sys=100&templ=' + formatTmplCodes + '&code=' + TMPL_CODEs + '&blank&' +
							'uniqueInfo=' + uniqueInfo
						var myPopup = window.open(url, uniqueInfo);
						var dataCnt = 0;
						var connected = false;
						var dno = 0
						var index = setInterval(function () {
							dno++;
							if (connected || dno > 5) {
								clearInterval(index)
							} else {
								var message = {
									uniqueInfo: uniqueInfo,
									type: 0
								}
								console.log(message)
								//send the message and target URI
								myPopup.postMessage(message, domain)
							}
						}, 2000)
						window.addEventListener('message', function (event) {
							//连接通信
							if (event.data.hasOwnProperty('uniqueInfo')) {
								if (event.data.uniqueInfo === uniqueInfo) {
									if (event.data.result === 0) {
										connected = true;
										//如果发送测试数据未关闭，先关闭发送测试数据index
										console.log(event.data.uniqueInfo)
										//第一遍发送数据
										var message;
										var dType = 1;
										if (1 == pData.data.length) {
											dType = 2;
										}
										message = {
											uniqueInfo: uniqueInfo,
											type: dType,
											dataType: 1,
											data: {
												'gl_voucher_ds1': pData.data[0]
											}
										}
										console.log(JSON.stringify(message))
										myPopup.postMessage(message, domain)
									} else if (event.data.result === 1) {
										if (connected) {
											dataCnt++;
											var message;
											var dType = 1;
											if (dataCnt == (pData.data.length - 1)) {
												dType = 2;
											}
											message = {
												uniqueInfo: uniqueInfo,
												type: dType,
												dataType: 1,
												data: {
													'gl_voucher_ds1': pData.data[dataCnt]
												}
											}
											console.log(JSON.stringify(message))
											myPopup.postMessage(message, domain)
										}
									} else {
										console.log(event.data.reason)
									}
								}
							}
						}, false);
					}
					ufma.post("/gl/vouPrint/getPrtData", searchData, callback);
					// window.open('../../pub/printpreview/printPreview.html');
					// window.open('/pqr/pages/query/query.html?sys=100&code=8008001001&button&param&show&param=' + guidArr.join(','));
				});
				//点击打印pdf按钮
				$("#vouPrint").on("click", "#btn-print-previewpdf", function () {
					//清除缓存
					var searchData = {};
					searchData.agencyCode = searchListData.agencyCode;
					searchData.acctCode = searchListData.acctCode;
					searchData.componentId = "GL_VOU";
					var postSetData = {
						agencyCode: searchListData.agencyCode,
						acctCode: searchListData.acctCode,
						componentId: "GL_VOU",
						rgCode: svData.svRgCode,
						setYear: svData.svSetYear,
						sys: '100',
						directory: '打印凭证'
					};
					var reportCode = ''
					var templId = ''
					var Nowdata = {
						"agencyCode": searchListData.agencyCode,
						"acctCode": searchListData.acctCode,
						"componentId": "GL_VOU"
					}
					ufma.ajaxDef("/gl/vouPrint/getPrtTmplPdfNew", 'post', Nowdata, function (data) {
						reportCode = data.data[0].tmplCode
						templId = data.data[0].formattmplCode
						searchData.tmplCode = data.data[0].tmplCode
						searchData.formatTmplCode = data.data[0].formattmplCode
					})
					ufma.showloading('正在打印，请耐心等待...');
					var guidArr = [];
					//判断是否有勾选
					var vouinfo =[]
					if (vouPrintDataTable.rows("tr.selected").data().length != 0) {
						//有勾选打勾选
						var tableData = vouPrintDataTable.rows("tr.selected").data();
						for (var i = 0; i < tableData.length; i++) {
							guidArr.push(tableData[i].vouGuid);
							vouinfo.push({
								set_year: setYear,
								agency_code: searchListData.agencyCode,
								acct_code: searchListData.acctCode,
								rg_code:searchListData.rgCode,
								fis_perd: tableData[i].fisPerd,
								vou_type_name:page.getVouTypeNameByCode(tableData[i].vouTypeCode),
								vouNo: tableData[i].vouNo,
								vou_type_code: tableData[i].vouTypeCode
							})
						}
					} else {
						//没勾选打全部
						var tableData = vouPrintDataTable.rows().data();
						for (var i = 0; i < tableData.length; i++) {
							guidArr.push(tableData[i].vouGuid);
							vouinfo.push({
								set_year: setYear,
								agency_code: searchListData.agencyCode,
								acct_code: searchListData.acctCode,
								rg_code:searchListData.rgCode,
								fis_perd: tableData[i].fisPerd,
								vou_type_name:page.getVouTypeNameByCode(tableData[i].vouTypeCode),
								vouNo: tableData[i].vouNo,
								vou_type_code: tableData[i].vouTypeCode
							})
						}
					}
					searchData.vouGuids = guidArr;
					var lpdata;
					if (isprintlp) {
						ufma.ajaxDef("/gl/vou/selectBillListByVouGuids", 'post', guidArr, function (data) {
							lpdata = {}
							for (var i = 0; i < data.data.length; i++) {
								for (var z in data.data[i]) {
									lpdata[z] = data.data[i][z]
								}

							}
						})
					}
					var callback = function (result) {
						var voudata = []
						for (var i = 0; i < result.data.data.length; i++) {
							if (isprintlp) {
								var now = [{}]
								if(lpdata[result.data.data[i][0].vouGuid]!=undefined ){
									now=[lpdata[result.data.data[i][0].vouGuid]]
								}
								voudata.push({
									'gl_voucher_ds1': result.data.data[i],
									"lp_bill_info": now
								})
							} else {
								voudata.push({
									'gl_voucher_ds1': result.data.data[i],
									"lp_bill_info": [{}]
								})
							}
						}
						var pData = JSON.stringify(voudata);
						getPdf(reportCode, templId, pData)
					}
					ufma.ajaxDef("/gl/vou/getSysRuleSet/" + searchListData.agencyCode + "?chrCodes=GL066",'get', "", function(data) {
						if(data.data.GL066){
							ufma.post('/gl/vouBox/searchDisconVouNos', {vouInfo:vouinfo}, function (data) {
								if (data.data['true']!=undefined && data.data['true'].length > 0) {
									var result = [];
									for (var i = 0; i < data.data['true'].length; i ++) {
										result.push(data.data['true'][i]);
									}
									var names = ''
									for (var i = 0; i < result.length-1; i++) {
										names += result[i] + '，'
									}
									names += result[result.length-1]+'<br/>'
									ufma.confirm('当前断号有<br/>' + names + '是否继续打印？', function (action) {
										if (action) {
											ufma.post("/gl/vouPrint/getPrtDataPdf", searchData, callback);
											ufma.post("/gl/vouPrint/updatePtintCountByGuid", {
												vouGuids: guidArr
											}, function (data) { });
										}else{
											ufma.hideloading()
										}
									})
								} else {
									ufma.post("/gl/vouPrint/getPrtDataPdf", searchData, callback);
									ufma.post("/gl/vouPrint/updatePtintCountByGuid", {
										vouGuids: guidArr
									}, function (data) { });
								}
							})
						}else{
							ufma.post("/gl/vouPrint/getPrtDataPdf", searchData, callback);
							ufma.post("/gl/vouPrint/updatePtintCountByGuid", {
								vouGuids: guidArr
							}, function (data) { });
						}
					})
				});
				//点击直接打印按钮
				$("#vouPrint").on("click", "#btn-direct-print", function () {
					//bug79482--zsj--表格数据为空时不允许打印
					if (zjprintData.length < 1) {
						ufma.showTip('没有需要打印的数据', function () { }, 'warning');
						return false;
					}
					//清除缓存
					var searchData = {};
					searchData.agencyCode = searchListData.agencyCode;
					searchData.acctCode = searchListData.acctCode;
					searchData.componentId = "GL_VOU";
					// searchData.formatTmplCode = "3001";
					var ajaxdata = {
						agencyCode: searchListData.agencyCode,
						acctCode: searchListData.acctCode,
						componentId: 'GL_VOU'
					}

					var TMPL_CODEs = ''
					ufma.ajaxDef('/gl/vouPrint/getUsedPrtList', 'post', ajaxdata, function (result) {
						if (result.data.length == 0) {
							ufma.showTip('未设置默认打印模板，请在打印设置中设置默认打印模板后执行打印', function () { }, 'warning')
							return false;
						} else {
							TMPL_CODEs = result.data[0].printTmpl.TMPL_CODE
							searchData.tmplCode = TMPL_CODEs
							//							searchData.formatTmplCode = result.data[0].printTmpl.formatTmplCode
						}
					})
					// searchData.tmplCode = "3001";
					var guidArr = [];
					//判断是否有勾选
					if (vouPrintDataTable.rows("tr.selected").data().length != 0) {
						//有勾选打勾选
						var tableData = vouPrintDataTable.rows("tr.selected").data();
						for (var i = 0; i < tableData.length; i++) {
							guidArr.push(tableData[i].vouGuid);
						}
					} else {
						//没勾选打全部
						var tableData = vouPrintDataTable.rows().data();
						for (var i = 0; i < tableData.length; i++) {
							guidArr.push(tableData[i].vouGuid);
						}
					}
					searchData.vouGuids = guidArr;
					var callback = function (result) {
						var pData = result.data;

						var domain = printServiceUrl + '/pqr/pages/query/query.html';
						var uniqueInfo = new Date().getTime().toString()
						var url = domain +
							'?sys=100&code=' + TMPL_CODEs + '&print&' +
							'uniqueInfo=' + uniqueInfo
						var myPopup = window.open(url, uniqueInfo);
						var dataCnt = 0;
						var connected = false;
						var dno = 0
						var index = setInterval(function () {
							dno++;
							if (connected || dno > 5) {
								clearInterval(index)
							} else {
								var message = {
									uniqueInfo: uniqueInfo,
									type: 0
								}
								console.log(message)
								//send the message and target URI
								myPopup.postMessage(message, domain)
							}
						}, 2000)
						window.addEventListener('message', function (event) {
							//连接通信
							if (event.data.hasOwnProperty('uniqueInfo')) {
								if (event.data.uniqueInfo === uniqueInfo) {
									if (event.data.result === 0) {
										connected = true;
										//如果发送测试数据未关闭，先关闭发送测试数据index
										console.log(event.data.uniqueInfo)
										//第一遍发送数据
										var message;
										var dType = 1;
										if (1 == pData.data.length) {
											dType = 2;
										}
										message = {
											uniqueInfo: uniqueInfo,
											type: dType,
											dataType: 1,
											data: {
												'gl_voucher_ds1': pData.data[0]
											}
										}
										console.log(JSON.stringify(message))
										myPopup.postMessage(message, domain)
									} else if (event.data.result === 1) {
										if (connected) {
											dataCnt++;
											var message;
											var dType = 1;
											if (dataCnt == (pData.data.length - 1)) {
												dType = 2;
											}
											message = {
												uniqueInfo: uniqueInfo,
												type: dType,
												dataType: 1,
												data: {
													'gl_voucher_ds1': pData.data[dataCnt]
												}
											}
											console.log(JSON.stringify(message))
											myPopup.postMessage(message, domain)
										}
									} else {
										console.log(event.data.reason)
									}
								}
							}
						}, false);
					}
					ufma.post("/gl/vouPrint/getPrtData", searchData, callback);
					ufma.post("/gl/vouPrint/updatePtintCountByGuid", {
						vouGuids: guidArr
					}, function (data) { });
					// window.open('../../pub/printpreview/printPreview.html');
					// window.open('/pqr/pages/query/query.html?sys=100&code=8008001001&button&param&show&param=' + guidArr.join(','));
				});
				//点击月份
				$("#vouPrint .month-text .month-one a").on("click", function () {
					if (!$(this).parent().hasClass("choose")) {
						//样式改变
						$(this).parent().addClass("choose").siblings("li.month-one").removeClass("choose");
						var n = $(this).parent().index();
						$("#vouPrint .blue-line .blue-one:eq(" + n + ")").addClass("choose").siblings("li.blue-one").removeClass("choose");

						searchListData.fisPerd = $(this).attr("data-fisPerd");

						//查询条件还原
						page.resetSearchData();
						if (voutypeacca == 1 && vousinglepz == false) {
							ufma.ajaxDef("/gl/eleVouType/getVouType/" + searchListData.agencyCode + "/" + setYear + "/" + searchListData.acctCode + "/" + '1,2', "get", "", page.initVouType);
						} else {
							ufma.ajaxDef("/gl/eleVouType/getVouType/" + searchListData.agencyCode + "/" + setYear + "/" + searchListData.acctCode + "/" + '*', "get", "", page.initVouType);
						}
						//账套改变后，加载表格
						$("#vouPrint-data .amtSum").text("");
						if ($('#btn-search').length > 0) {
							ufma.post("/gl/print/list", searchListData, page.getVouPrintList);
						}
						//账套改变后，加载表格信息
						$("#vouPrint .vou-table-info .info-vou dd").html("");
						$("#vouPrint .vou-table-info .info-print dd").html("");
						if ($('#btn-search').length > 0) {
							ufma.post("/gl/print/message", searchListData, page.getVouInfo);
						}
					}
				});
				$("#vouPrint .blue-line .blue-one").on("click", function () {
					if (!$(this).hasClass("choose")) {
						//样式改变
						$(this).addClass("choose").siblings("li.blue-one").removeClass("choose");
						var n = $(this).index();
						$("#vouPrint .month-text .month-one:eq(" + n + ")").addClass("choose").siblings("li.month-one").removeClass("choose");
						searchListData.fisPerd = $("#vouPrint .month-text .month-one.choose a").attr("data-fisPerd");
						//查询条件还原
						page.resetSearchData();
						if (voutypeacca == 1 && vousinglepz == false) {
							ufma.ajaxDef("/gl/eleVouType/getVouType/" + searchListData.agencyCode + "/" + setYear + "/" + searchListData.acctCode + "/" + '1,2', "get", "", page.initVouType);
						} else {
							ufma.ajaxDef("/gl/eleVouType/getVouType/" + searchListData.agencyCode + "/" + setYear + "/" + searchListData.acctCode + "/" + '*', "get", "", page.initVouType);
						}
						//账套改变后，加载表格
						$("#vouPrint-data .amtSum").text("");
						if ($('#btn-search').length > 0) {
							ufma.post("/gl/print/list", searchListData, page.getVouPrintList);
						}
						//账套改变后，加载表格信息
						$("#vouPrint .vou-table-info .info-vou dd").html("");
						$("#vouPrint .vou-table-info .info-print dd").html("");
						if ($('#btn-search').length > 0) {
							ufma.post("/gl/print/message", searchListData, page.getVouInfo);
						}
					}
				});

				//会计体系按钮点击
				$("#vouPrint #vpAccaCode").on("click", "button", function () {
					if (!$(this).hasClass("btn-primary")) {
						//样式改变
						$(this).removeClass("btn-default").addClass("btn-primary").siblings(".btn.btn-primary").removeClass("btn-primary").addClass("btn-default");
					}
				});

				//凭证类型按钮点击
				$("#vouPrint #vpVouTypeCodeBtn").on("click", "button", function () {
					if (!$(this).hasClass("btn-primary")) {
						//样式改变
						$(this).removeClass("btn-default").addClass("btn-primary").siblings(".btn.btn-primary").removeClass("btn-primary").addClass("btn-default");

						//下方凭证字号的下拉也关联改变
						var val = $(this).val();
						$("#vouPrint #vpVouTypeCode option[value='" + val + "']").prop("selected", true);
					}
				});

				//凭证状态按钮点击
				$("#vouPrint #vpVouStatus").on("click", "button", function () {
					if (!$(this).hasClass("btn-primary")) {
						//样式改变
						$(this).removeClass("btn-default").addClass("btn-primary").siblings(".btn.btn-primary").removeClass("btn-primary").addClass("btn-default");
					}
				});

				//改变凭证字号的凭证类型下拉
				$("#vouPrint #vpVouTypeCode").on("change", function () {
					var val = $(this).val();
					$("#vouPrint #vpVouTypeCodeBtn button[value='" + val + "']").removeClass("btn-default").addClass("btn-primary").siblings(".btn.btn-primary").removeClass("btn-primary").addClass("btn-default");
				});

				//点击仅显示自己编制的凭证，制单人输入用户名称同时不可录入
				$("#vpShowOwn").on("change", function () {
					if ($(this).prop("checked") === true) {
						$("#vpInputor").val(user);
						$("#vpInputor").prop("disabled", true);
					} else {
						$("#vpInputor").val("");
						$("#vpInputor").prop("disabled", false);
					}
				});

				//点击查询按钮
				$("#vouPrint #btn-search").on("click", function () {
					//传参取值
					searchListData.accaCode = $("#vouPrint #vpAccaCode button.btn-primary").val();
					searchListData.vouStatus = $("#vouPrint #vpVouStatus button.btn-primary").val();
					searchListData.vouTypeCode = $("#vouPrint #vpVouTypeCode option:selected").val();
					searchListData.startVouNo = $("#vouPrint #vpStartVouNo").val();
					searchListData.endVouNo = $("#vouPrint #vpEndVouNo").val();
					searchListData.inputorName = $("#vouPrint #vpInputor").val();

					//账套改变后，加载表格
					$("#vouPrint-data .amtSum").text("");
					if ($('#btn-search').length > 0) {
						ufma.post("/gl/print/list", searchListData, page.getVouPrintList);
					}
					//账套改变后，加载表格信息
					$("#vouPrint .vou-table-info .info-vou dd").html("");
					$("#vouPrint .vou-table-info .info-print dd").html("");
					if ($('#btn-search').length > 0) {
						ufma.post("/gl/print/message", searchListData, page.getVouInfo);
					}
				})
				$("#vouPrint-data").on('click', '.forvouurl', function () {
					var guid =$(this).attr('data-vouguid') 
					var _this = $(this)
					ufma.ajaxDef('/gl/vou/getVou/' + guid, 'get', '', function (result) {
						if (result.data != null) {
							if(result.data[0].isBigVou != '1'){
								var baseUrl = '/pf/gl/vou/index.html?menuid=f24c3333-9799-439a-94c9-f0cdf120305d&dataFrom=vouprint&action=query&vouGuid=' + guid + '&vouAccaCode=*';
								uf.openNewPage(page.isCrossDomain,_this, 'openMenu',baseUrl, false, "凭证录入");
							}else{
								var baseUrl = '/pf/gl/voubig/voubig.html?menuid=14a44be5-f2bf-4729-8bc7-702c01e3cfcf&dataFrom=vouprint&action=query&vouGuid=' + guid + '&vouAccaCode=*';
								uf.openNewPage(page.isCrossDomain,_this, 'openMenu',baseUrl, false, "凭证查看");
							}
						}
					})
				})
			},
			//此方法必须保留
			init: function () {
				this.initPage();
				this.onEventListener();
				ufma.parseDoubleScroll();
				ufma.isShow(page.reslist);
				window.addEventListener('message', function (e) {
					if (e.data.hasOwnProperty('messageType') && e.data.messageType == 'clientWidth') {
						page.isCrossDomain = true;
					} else {
						page.isCrossDomain = false;
					}
				})
				$(document).on('click', '#vpAccaCode button', function () {
					if (voutypeacca == 1 && vousinglepz == false) {
						if ($(this).attr('value') == '') {
							ufma.ajaxDef("/gl/eleVouType/getVouType/" + searchListData.agencyCode + "/" + setYear + "/" + searchListData.acctCode + "/" + '1,2', "get", "", page.initVouType);
						} else if ($(this).attr('value') != '') {
							ufma.ajaxDef("/gl/eleVouType/getVouType/" + serachData.agencyCode + "/" + serachData.setYear + "/" + serachData.acctCode + "/" + $(this).attr('value'), "get", "", page.initVouType);
						}
					}
				})
			}
		}
	}();

	/////////////////////
	page.init();
});