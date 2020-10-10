$(function () {
	window._close = function (action) {
		if (window.closeOwner) {
			var data = {
				action: action
			};
			window.closeOwner(data);
		}
	};
	//接口URL集合
	var interfaceURL = {
		getPlanWithAccItems: "/bg/Plan/budgetPlan/getPlanWithAccItems", //指标-查询方案和表头
		getBudgetItemByPlanChrId: "/bg/budgetItem/getBudgetItemByPlanChrId", //指标-根据方案查询辅助关联关系数据
		getSchemeByAgencyCode: "/lp/scheme/getSchemeByAgencyCode", //会计平台-查询单据方案和表头
		getElementBills: "/lp/getBillData/getElementBills", //会计平台-根据单据方案查询单据信息
		fetchData: "/ma/sys/accItemLink/fetchData" //取数保存
	}
	var pfData = ufma.getCommonData();
	var onerdata = window.ownerData;
	var page = function () {

		return {
			//初始化预算方案
			initBudget: function () {
				$("#budget-item").ufCombox({
					idField: "id",
					textField: "name",
					// data: data, //json 数据
					placeholder: "请选择预算方案",
					// readonly:'false',
					onChange: function (sender, data) {
						page.combineTableHead(data, "0")

					},
					onComplete: function (sender) {

						$("input").attr("autocomplete", "off");
					}
				});
				//请求预算方案
				page.getPlanWithAccItems();
			},
			getPlanWithAccItems: function () {
				var argu = {
					agencyCode: onerdata.agencyCode,
					acctCode: onerdata.acctCode,
					setYear: pfData.svSetYear,
					rgCode: pfData.svRgCode
				}
				ufma.get(interfaceURL.getPlanWithAccItems, argu, function (result) {
					if (result.data.length > 0) {
						$("#budget-item").getObj().load(result.data);
					}

				})

			},
			//根据指标预算方案查询数据
			getBudgetItemByPlanChrId: function () {
				var argu = {
					rgCode: pfData.svRgCode,
					setYear: pfData.svSetYear,
					agencyCode: onerdata.agencyCode,
					acctCode: onerdata.acctCode,
					bgPlanId: $("#budget-item").getObj().getValue()
				}
				ufma.get(interfaceURL.getBudgetItemByPlanChrId, argu, function (result) {
					if (result.data) {
						page.showTableData(result.data);
					}
				})
			},
			//初始化单据方案
			initSchemeItem: function () {
				$("#schemne-item").ufCombox({
					idField: "code",
					textField: "name",
					// data: data, //json 数据
					placeholder: "请选择单据方案",
					// readonly:'false',
					onChange: function (sender, data) {
						page.combineTableHead(data, "1")

					},
					onComplete: function (sender) {

						$("input").attr("autocomplete", "off");
					}
				});
				//请求单据方案
				page.getSchemeByAgencyCode();
			},

			//根据单据方案查询数据
			getElementBills: function () {
				//会计平台不需要账套-zsj
				var url = interfaceURL.getElementBills + "/" + pfData.svRgCode + "/" + pfData.svSetYear + "/" + onerdata.agencyCode + '/' + $("#schemne-item").getObj().getValue() + "/" + onerdata.acctCode;
				ufma.get(url, "", function (result) {
					if (result.data) {
						page.showTableData(result.data)
					}
				})
			},
			//请求单据方案
			getSchemeByAgencyCode: function () {
				//会计平台不需要账套-zsj
				var url = interfaceURL.getSchemeByAgencyCode + "/" + pfData.svRgCode + "/" + pfData.svSetYear + "/" + onerdata.agencyCode
				ufma.get(url, "", function (result) {
					if (result.data.length > 0) {
						$("#schemne-item").getObj().load(result.data);
					}

				})
			},
			//组织表头
			combineTableHead: function (data, type) {
				page.destroyTable();
				var eleList = data.eleList;
				page.saveEleCodes = [];
				var columns = [{
					title: '<label class="mt-checkbox mt-checkbox-single mt-checkbox-outline">' +
						'<input type="checkbox" id="th-check" class="datatable-group-checkable" data-set="#data-table .checkboxes" />' +
						'&nbsp;<span></span></label>',
					className: "nowrap check-style",
					data: null,
					width: "30px",
					render: function (data, type, rowdata, meta) {
						return '<label class="mt-checkbox mt-checkbox-single mt-checkbox-outline"> ' +
							'<input type="checkbox" class="checkboxes" value="' + data + '" />' +
							'&nbsp;<span></span></label>';
					}
				}];
				for (var i = 0; i < eleList.length; i++) {
					var obj = {
						title: eleList[i].accItemName,
						data: eleList[i].accItemFieldCode + "Name",
						className: "nowrap"
					}
					page.saveEleCodes.push(eleList[i].accItemFieldCode);
					columns.push(obj)
				}
				page.columns = columns;
				if (type == "0") {
					page.getBudgetItemByPlanChrId()
				} else if (type == "1") {
					page.getElementBills()
				}

			},
			//销毁表格
			destroyTable: function () {
				if (page.vgDT && $("#mainTable").find("thead").length > 0) {
					//page.vgDT.destroy();
					page.vgDT.clear().destroy();
					page.saveEleCodes = [];				}
				$("#mainTable").empty();

			},
			//渲染表格
			showTableData: function (data, columns) {
				page.destroyTable();
				if (!page.columns || page.columns.length == 0) {
					return false
				}
				var id = "mainTable";
				var toolBar = $('#' + id).attr('tool-bar');
				page.vgDT = $('#' + id).DataTable({
					"language": {
						"url": bootPath + "agla-trd/datatables/datatable.default.js"
					},
					"data": data,
					"searching": true,
					"bFilter": false, //去掉搜索框
					"bLengthChange": true, //去掉每页显示多少条数据
					"processing": true, //显示正在加载中
					"pagingType": "full_numbers", //分页样式
					"lengthChange": true, //是否允许用户自定义显示数量p
					"lengthMenu": [
						[25, 50, 100, -1],
						[25, 50, 100, "全部"]
					],
					"pageLength": "25",
					"bInfo": true, //页脚信息
					"bSort": false, //排序功能
					"bAutoWidth": false, //表格自定义宽度，和swidth一起用
					"bProcessing": true,
					"bDestroy": true,
					"columns": page.columns,
					"scrollY": 279,
					// "columnDefs": columnDefsArr,
					// fixedColumns:{
					//     leftColumns: 1
					// },
					// "dom": 'rt<"' + id + '-paginate"ilp>',
					"dom": '<"datatable-toolbar"B>rt<"' + id + '-paginate"ilp>',
					"buttons": [{
						extend: 'print',
						text: '<i class="glyphicon icon-print" aria-hidden="true"></i>',
						exportOptions: {
							columns: '.isprint'
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
							columns: '.isprint'
						},
						customize: function (xlsx) {
							var sheet = xlsx.xl.worksheets['sheet1.xml'];
						}
					}
					],
					"initComplete": function (settings, json) {
						//打印&导出按钮
						$('.datatable-toolbar').appendTo('#dtToolbar');
						$('#mainTable').closest('.dataTables_wrapper').ufScrollBar({
							hScrollbar: true,
							mousewheel: false
						});
						// $('#datatables-print').html('');
						// $('#datatables-print').append($(".printButtons"));
						$(".datatable-toolbar .buttons-print").addClass("btn-print btn-permission").attr({
							"data-toggle": "tooltip",
							"title": "打印"
						});
						$(".datatable-toolbar .buttons-excel").addClass("btn-export btn-permission").attr({
							"data-toggle": "tooltip",
							"title": "导出"
						});
						//驻底begin
						var toolBar = $(this).attr('tool-bar');
						var $info = $(toolBar + ' .info');
						if ($info.length == 0) {
							$info = $('<div class="info"></div>').appendTo($(toolBar + ' .tool-bar-body'));
						}
						$info.html('');
						$('.' + id + '-paginate').appendTo($info);
						//驻底end

						//checkbox的全选操作
						$('.datatable-group-checkable').on("change", function () {
							var isCorrect = $(this).is(':checked');
							$('#' + id + ' .checkboxes').each(function () {
								isCorrect ? $(this).prop("checked", !0) : $(this).prop("checked", !1);
								isCorrect ? $(this).closest("tr").addClass("selected") : $(this).closest("tr").removeClass("selected");
							})
							$('.datatable-group-checkable').prop("checked", isCorrect);
						});

						ufma.isShow(page.reslist);
						$("#tool-bar").css("left", "0px")
						var wrapperWidth = $('#mainTable_wrapper').width();
						var tableWidth = $('#mainTable').width();
						if (tableWidth > wrapperWidth) {
							$('#mainTable_wrapper').css("overflow-x", "scroll");
						}
						var hei = $('.ufma-layout-up').height();
						//出不出滚动条都固定到底部，上面的查询面板也不跟着滚动，滚动条只给表格 guohx 20190911
						var tempH = hei - 34 - 10 - 8 - 30 - 10 - 40 + 3;
						$(".dataTables_wrapper").css("cssText", "height:" + tempH + "px !important");
						var top = hei - 38 ;
						$("#tool-bar").css("cssTop", "top:" + top + "px !important");
					},
					"drawCallback": function (settings) {
						//权限控制
						ufma.isShow(page.reslist);
						$("#tool-bar").css("left", "0px");
						var wrapperWidth = $('#mainTable_wrapper').width();
						var tableWidth = $('#mainTable').width();
						if (tableWidth > wrapperWidth) {
							$('#mainTable_wrapper').css("overflow-x", "scroll");
						} 
						var hei = $('.ufma-layout-up').height();
						var tempH = hei - 34 - 10 - 8 - 30 - 10 - 40 + 3;
						$(".dataTables_wrapper").css("cssText", "height:" + tempH + "px !important");
						var top = hei - 38 ;
						$("#tool-bar").css("cssTop", "top:" + top + "px !important");
					}
				});
			},
			initPage: function () {
				page.initBudget();
				page.initSchemeItem();

			},
			getChecksDatas: function () {
				var dataState = $(".nav-tabs .active").find("a").attr("data-state");
				var dataFromModule = dataState == "0" ? "bg" : "lp";
				var dataFromGuid, mainItem;
				if (dataFromModule == "bg") {
					dataFromGuid = $("#budget-item").getObj().getValue();
					mainItem = $("#budget-item").getObj().getItem().mainItem;
				} else {
					dataFromGuid = $("#schemne-item").getObj().getValue();
					mainItem = $("#schemne-item").getObj().getItem().mainItem;
				}

				var argu = {
					data: [],
					"module": dataFromModule,
					"agencyCode": onerdata.agencyCode,
					"acctCode": onerdata.acctCode,
					"mainItem": mainItem,
					"rgCode": pfData.svRgCode,
					"setYear": pfData.svSetYear
				}

				var tableData = page.vgDT.rows("tr.selected").data();
				var seq = page.vgDT.rows("tr.selected")[0];
				for (var i = 0; i < tableData.length; i++) {
					var obj = {
						"dataFromModule": dataFromModule,
						"dataFromGuid": dataFromGuid,
						"seq": parseInt(seq[i]) + 1
					};
					for (var y = 0; y < page.saveEleCodes.length; y++) {
						obj[page.saveEleCodes[y]] = tableData[i][page.saveEleCodes[y]]
					}
					argu.data.push(obj)
				}

				ufma.post(interfaceURL.fetchData, argu, function (result) {
					var closeData = {
						msg: result.msg,
						flag: result.flag,
						action: "save",
					}
					_close(closeData);
				})

			},
			onEventListener: function () {
				$(document).on("click", "tbody tr", function (e) {
					stopPropagation(e);
					if ($("td.dataTables_empty").length > 0) {
						return false;
					}
					var inputDom = $(this).find('input.checkboxes');
					var inputCheck = $(inputDom).prop("checked");
					$(inputDom).prop("checked", !inputCheck);
					$(this).toggleClass("selected");
					var $tmp = $(".checkboxes:checkbox");
					$(".datatable-group-checkable").prop("checked", $tmp.length == $tmp.filter(":checked").length);
					return false;
				});
				$("#btn-sure").on("click", function () {
					page.getChecksDatas();

				});
				$("#btn-qx").on("click", function () {
					_close();
				})
				$(".nav-tabs li").on("click", function () {
					var dataState = $(this).find("a").attr("data-state");
					$(".sel-combox .uf-combox").eq(dataState).removeClass("hidden");
					$(".sel-combox .uf-combox").eq(dataState).siblings(".uf-combox").addClass("hidden")
					$("#budget-item").getObj().val("");
					$("#schemne-item").getObj().val("");
					page.destroyTable();
				});
			},

			//此方法必须保留
			init: function () {
				//权限控制
				page.reslist = ufma.getPermission();
				ufma.isShow(page.reslist);
				ufma.parse();
				page.initPage();
				page.onEventListener();
				ufma.parseScroll();
				ufma.parse();
			}
		}
	}();
	/////////////////////
	page.init();

	function stopPropagation(e) {
		if (e.stopPropagation)
			e.stopPropagation();
		else
			e.cancelBubble = true;
	}
});