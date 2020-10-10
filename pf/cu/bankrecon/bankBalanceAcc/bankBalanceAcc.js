$(function () {
	var page = function () {

		var isLoading = true;
		var period = "";
		var month = "";
		var isOpposite = "";
		var reconResult = "";
		var bankInfo = ""; //开户行
		var journalResult = false;
		var statementResult = false;
		var portList = {
			agencyList: "/cu/common/eleAgency/getAgencyTree", //单位列表接口
			accScheList: "/cu/bankReconSche/select", //方案列表接口
			saveBalancedAuto: "/cu/bankBalance/saveBalancedAuto",//保存自动对账入库
			getExtendList: "/cu/bankExtend/getExtendList",//扩展字段
			getBankStatementList: "/cu/bankStatement/getBankStatementList",//获取银行对账单列表
			getJournal: "/cu/bankJournal/getJournal",//获取单位日记账列表
			balanceManual: "/cu/bankBalance/balanceManual",//手动对账
			balanceAuto: "/cu/bankBalance/balanceAuto",//自动对账
			getExtendForBanlance: "/cu/bankExtend/getExtendForBanlance",//自动对账获取扩展格式列表
			cancelBalance: "/cu/bankBalance/cancelBalance",//取消对账
			accItemTree: "/cu/common/getEleTree", //票据类型
		};
		var idToTable = {
			'btn-hide1': "zong-dwrjz",
			'btn-hide2': "zong-yhdzd",
			'btn-hide3': "heng-dwrjz",
			'btn-hide4': "heng-yhdzd"
		};
		return {
			namespace: '#bankBalanceAcc',

			//构建表头，表头添加单选框，表尾添加操作列
			newTableHead: function (tableHead, checkAllName) {
				//表头需要重新渲染
				for (var i = 0; i < tableHead.length; i++) {
					if (tableHead[i].sign) {
						tableHead.splice(i, 1);
					}
				}
				var headTitle = {
					title: '<label class="mt-checkbox mt-checkbox-single mt-checkbox-outline"><input type="checkbox"' +
						'class="datatable-group-checkable ' + checkAllName + '"/> &nbsp;<span></span> </label>',
					data: "chrId",
					width: "40px",
					sign: true
				};
				tableHead.unshift(headTitle);
				return tableHead;
			},
			initJournalExtend: function (data, isAutoGet) {
				if (!$.isNull(page.schemaGuid)) {
					ufma.showloading('正在加载数据，请耐心等待...');
				}
				var fixedJournalColumns1 = [{
					title: "状态",
					data: "isBalanceAccName",
					width: 70,
					className: 'tc nowrap'
				},
				{
					title: "登账日期",
					data: "jouDate",
					width: 97,
					className: 'tc nowrap'
				},
				{
					title: "凭证编号",
					data: "vouNo",
					width: '100px',
					className: ' nowrap'
				},
				{
					title: "摘要",
					data: "descpt",
					width: '200px',
					className: 'nowrap'
				},
				{
					title: "借方金额",
					data: "amtDr",
					className: 'tr nowrap',
					width: '160px',
					render: function (data, type, rowdata, meta) {
						var val = $.formatMoney(data);
						return val == '0.00' ? '' : val;
					}
				},
				{
					title: "贷方金额",
					data: "amtCr",
					className: 'tr nowrap',
					width: '160px',
					render: function (data, type, rowdata, meta) {
						var val = $.formatMoney(data);
						return val == '0.00' ? '' : val;
					}
				},
				{
					title: "票据号",
					data: "billNo",
					className: 'nowrap'
				}
				];
				for (var i = 0; i < data.length; i++) {
					var title = data[i].showName;
					var ele = data[i].eleCode;
					if (ele == 'RELATION') { //项目关联号单独拿出来
						var field = data[i].extendField;
						if (title != null && title != "" && field != null && field != "") {
							var obj = {
								title: title,
								data: field,
								className: 'nowrap'
							}
							fixedJournalColumns1.push(obj);
						}
					} else {
						var field = data[i].extendField + "Name";
						if (title != null && title != "" && field != null && field != "") {
							var obj = {
								title: title,
								data: field,
								className: 'nowrap'
							}
							fixedJournalColumns1.push(obj);
						}
					}

				}
				var fixedJournalColumns2 = [

					{
						title: "对账时间",
						data: "balanceDate",
						'width': '100px',
						className: 'tc nowrap'
					}, //revise
					{
						title: "账簿",
						data: "accountbookName",
						className: 'nowrap'
					}
				];
				var fixedJournalColumns = fixedJournalColumns1.concat(fixedJournalColumns2)

				page.exportJournalColumns = [{
					type: 'indexcolumn',
					field: '',
					name: '序号',
					width: 50,
					align: 'center',
					className: 'nowrap'
				}];
				for (var index in fixedJournalColumns) {
					if (fixedJournalColumns[index].data) {
						var expCol = {
							field: fixedJournalColumns[index].data,
							name: fixedJournalColumns[index].title,
							align: 'center',
							width: 200,
							className: 'nowrap'
						}
						page.exportJournalColumns.push(expCol);
					}
				}
				page.getJournalData(fixedJournalColumns, isAutoGet);
			},
			initStatementExtend: function (data) {
				if (!$.isNull(page.schemaGuid)) {
					ufma.showloading('正在加载数据，请耐心等待...');
				}
				//对账单表头固定列
				var fixedStatementColums1 = [{
					title: "状态",
					data: "isBalanceAccName",
					width: 70,
					className: 'tc nowrap'
				},
				{
					title: "记账日期",
					data: "statementDate",
					width: 97,
					className: 'tc nowrap'
				},
				{
					title: "凭证编号",
					data: "vouNo",
					width: 100,
					className: 'tc nowrap'
				},
					{
						title: "摘要",
						data: "descpt",
						className: 'ellipsis nowrap',
						width: 200,
						render: function (rowid, rowdata, data) {
							return $.isNull(data.descpt) ? '' : '<span title="' + data.descpt + '">' + data.descpt + '</span>';
						}
					},
					{
					title: "借方金额",
					data: "amtDr",
					className: 'tr nowrap',
					width: '160px',
					render: function (data, type, rowdata, meta) {
						var val = $.formatMoney(data);
						return val == '0.00' ? '' : val;
					}
				},
				{
					title: "贷方金额",
					data: "amtCr",
					className: 'tr nowrap',
					width: '160px',
					render: function (data, type, rowdata, meta) {
						var val = $.formatMoney(data);
						return val == '0.00' ? '' : val;
					}
				},
				{
					title: "票据号",
					data: "billNo",
					className: 'tc nowrap'
				}

				];
				for (var i = 0; i < data.length; i++) {
					var title = data[i].showName;
					var ele = data[i].eleCode;
					if (ele == 'RELATION') { //项目关联号单独拿出来
						var field = data[i].extendField;
						if (title != null && title != "" && field != null && field != "") {
							var obj = {
								title: title,
								data: field,
								className: 'nowrap'
							}
							fixedStatementColums1.push(obj);
						}
					} else {
						var field = data[i].extendField + "Name";
						if (title != null && title != "" && field != null && field != "") {
							var obj = {
								title: title,
								data: field,
								className: 'nowrap'
							}
							fixedStatementColums1.push(obj);
						}
					}

				}
				var fixedStatementColums2 = [{
					title: "对账时间",
					data: "balanceDate",
					'width': '100px',
					className: 'tc nowrap'
				}]
				var fixedStatementColums = fixedStatementColums1.concat(fixedStatementColums2);
				page.exportStatementsColumns = [{
					type: 'indexcolumn',
					field: '',
					name: '序号',
					width: 50,
					align: 'center',
					className: ' nowrap'
				}];
				for (var index in fixedStatementColums) {
					if (fixedStatementColums[index].data) {
						var expCol = {
							field: fixedStatementColums[index].data,
							name: fixedStatementColums[index].title,
							align: 'center',
							width: 200,
							className: ' nowrap'
						}
						page.exportStatementsColumns.push(expCol);
					}
				}
				page.getStatementData(fixedStatementColums);
			},
			//动态表格列宽
			initColumnsWidth: function (columns, data, id) {
				//定宽的列不参与百分比计算
				// var length = parseInt(columns.length - 1); // 2-> 1
				// var width = Math.floor(100 / length) + "%";
				// columns[0].width = "40px";
				// for (var i = 1; i < columns.length; i++) {
				//     if (columns[i].width == null || columns[i].width == undefined || columns[i].width == "") {
				//         columns[i].width = width;
				//     }
				// }
				//revise S
				//不用百分比，改为固定列宽
				columns[0].width = "40px";
				for (var i = 1; i < columns.length; i++) {
					if (columns[i].width == null || columns[i].width == undefined || columns[i].width == "") {
						if (columns[i].title.length <= 4) {
							if (columns[i].title === "摘要" || columns[i].title === "账簿") {
								columns[i].width = "200px";
							} else {
								columns[i].width = "160px";
							}
						} else if (columns[i].title.length <= 6) {
							columns[i].width = "200px";
						} else if (columns[i].title.length <= 8) {
							columns[i].width = "240px";
						} else if (columns[i].title.length <= 12) {
							columns[i].width = "30px";
						}
					}
				}
			},
			//动态改变表格宽度
			changeTableWidth: function (id, columns) {
				/*                var twidth = 0;
				                for (var i = 0; i < columns.length; i++) {
				                    twidth += parseInt(columns[i].width);
				                }
				                twidth = (twidth + 220).toString() + "px";
				                $("#" + id).css("width", twidth);*/
			},
			//插入对账号
			insertDzcount: function (columns) {
				var timeIndex = 11;
				for (var i = 0; i < columns.length; i++) {
					if (columns[i].title == "对账时间" && columns[i - 1].title != "对账号") {
						timeIndex = i;
						columns.splice(timeIndex, 0, {
							title: "对账号",
							data: "groupGuid",
							className: ' nowrap'
						});
						break;
					}
				}
			},
			//初始化表格
			// newZongJournalTables: function (fixedJournalColumns, data) {

			// 	page.insertDzcount(fixedJournalColumns);
			// 	//日记账表头固定列
			// 	var tabelId = "zong-dwrjz";
			// 	$("#" + tabelId).dataTable().fnDestroy();
			// 	$("#" + tabelId).html(''); //guohx 先清空动态加载列
			// 	var JournalColumns = page.newTableHead(fixedJournalColumns, "checkAll-one");
			// 	page.initColumnsWidth(fixedJournalColumns);

			// 	//revise S  根据表头各个标题的宽度改变table的宽度
			// 	page.changeTableWidth("zong-dwrjz", fixedJournalColumns);
			// 	//revise S  找到摘要的列 index
			// 	var descptIndex = 4;
			// 	for (var i = 0; i < fixedJournalColumns.length; i++) {
			// 		if (fixedJournalColumns[i].title === "摘要") {
			// 			descptIndex = i;
			// 		}
			// 	}
			// 	var windowHeight = $(window).height();
			// 	page.zongTableHeight = windowHeight - $("#expfunc-tool-bar").outerHeight(true) - $(".ufma-portlet").outerHeight(true) - 30 - 36;
			// 	//初始化纵表
			// 	page.zongDWRJZ = $("#" + tabelId).DataTable({
			// 		"language": {
			// 			"url": bootPath + "agla-trd/datatables/datatable.default.js"
			// 		},
			// 		data: data,
			// 		"bFilter": false,
			// 		"paging": false,
			// 		"bLengthChange": true, //去掉每页显示多少条数据
			// 		"processing": true, //是否显示正在加载
			// 		"pagingType": "first_last_numbers", //分页样式
			// 		"lengthChange": false, //是否允许用户自定显示数量
			// 		"bInfo": false, //页脚信息
			// 		"bSort": false, //排序功能
			// 		"bAutoWidth": false, //表格自定义宽度
			// 		"bProcessing": true,
			// 		"bDestroy": true,
			// 		'fixedHeader': true,
			// 		"scrollY": page.zongTableHeight + "px",
			// 		"sScrollX": true,
			// 		"scrollCollapse": true,
			// 		"columns": JournalColumns,
			// 		"ordering": true,
			// 		"columnDefs": [{
			// 			"targets": [0],
			// 			"serchable": false,
			// 			"bSortable": false,
			// 			"orderable": false,
			// 			"className": "nowrap",
			// 			"render": function (data, type, rowdata, meta) {
			// 				return '<label class="mt-checkbox mt-checkbox-single mt-checkbox-outline"><input type="checkbox" class="checkboxes singleCheck" value="' + data + '" data-code="' + rowdata.chrId + '"/> &nbsp;<span></span> </label>';
			// 			}
			// 		},
			// 		],
			// 		'buttons': [{
			// 			extend: 'excel',
			// 			className: 'export1 hidden'
			// 		}],
			// 		"dom": 'Bfrtip',
			// 		"initComplete": function (setting) {
			// 			$(".checkAll-one").prop("checked", false);
			// 			$(".checkAll-one").on('change', function () {
			// 				var t = $(this).is(":checked");
			// 				$('#zong-dwrjz').find('.checkboxes').each(function () {
			// 					t ? $(this).prop("checked", !0) : $(this).prop("checked", !1);
			// 					t ? $(this).closest('tr').addClass('selected') : $(this).closest('tr').removeClass('selected');
			// 				});
			// 				$(".checkAll-one").prop("checked", t);
			// 			});
			// 			var windowHeight = $(window).height();
			// 			var scrollY = windowHeight - $("#expfunc-tool-bar").outerHeight(true) - $(".ufma-portlet").outerHeight(true) - 30;
			// 			$("#zong-table1").css({ height: scrollY + 'px' });

			// 		},
			// 		"drawCallback": function (setting) {
			// 			$('#' + tabelId).find("td.dataTables_empty").text("")
			// 				.append('<img src="' + bootPath + 'images/noData.png"/><br/><i>目前还没有你要查询的数据</i>');
			// 			$(".btn-release").on("click", function (e) {
			// 				$(this).closest('tr').remove();
			// 			});
			// 			ufma.isShow(reslist);
			// 			$("#zong-table1 table tr th:first").removeClass("sorting_asc");//移除checkbox列的排序箭头 
			// 		}

			// 	});
			// 	/* $(".btn-query").click()*/
			// },
			// newZongStatementTables: function (statementColumns, data) {
			// 	// revise S插入对账号
			// 	page.insertDzcount(statementColumns);
			// 	var tabelId = "zong-yhdzd";
			// 	$("#" + tabelId).dataTable().fnDestroy();
			// 	$("#" + tabelId).html(''); //guohx 先清空动态加载列
			// 	var StatementColumns = page.newTableHead(statementColumns, 'checkAll-tow');
			// 	page.initColumnsWidth(StatementColumns);
			// 	//revise S  根据表头各个标题的宽度改变table的宽度
			// 	page.changeTableWidth("zong-yhdzd", StatementColumns);
			// 	//revise E
			// 	//revise S  找到摘要的列 index
			// 	var descptIndex = 4;
			// 	for (var i = 0; i < StatementColumns.length; i++) {
			// 		if (StatementColumns[i].title === "摘要") {
			// 			descptIndex = i;
			// 		}
			// 	}
			// 	var windowHeight = $(window).height();
			// 	page.zongTableHeight = windowHeight - $("#expfunc-tool-bar").outerHeight(true) - $(".ufma-portlet").outerHeight(true) - 30 - 36;
			// 	page.zongYHDZD = $("#" + tabelId).DataTable({
			// 		"language": {
			// 			"url": bootPath + "agla-trd/datatables/datatable.default.js"
			// 		},
			// 		data: data,
			// 		"bFilter": false,
			// 		"paging": false,
			// 		"bLengthChange": true, //去掉每页显示多少条数据
			// 		"processing": true, //是否显示正在加载
			// 		"pagingType": "first_last_numbers", //分页样式
			// 		"lengthChange": false, //是否允许用户自定显示数量
			// 		"bInfo": false, //页脚信息
			// 		"bSort": false, //排序功能
			// 		"bAutoWidth": false, //表格自定义宽度
			// 		"bProcessing": true,
			// 		"bDestroy": true,
			// 		"columns": StatementColumns,
			// 		"scrollY": page.zongTableHeight + "px",
			// 		'fixedHeader': true,
			// 		"sScrollX": true,
			// 		"scrollCollapse": true,
			// 		"ordering": true,
			// 		"columnDefs": [{
			// 			"targets": [0],
			// 			"serchable": false,
			// 			"bSortable": false,
			// 			"orderable": false,
			// 			"className": "nowrap",
			// 			"render": function (data, type, rowdata, meta) {
			// 				return '<label class="mt-checkbox mt-checkbox-single mt-checkbox-outline" ><input type="checkbox" class="checkboxes" value="' + data + '" data-code="' + rowdata.chrId + '"/> &nbsp;<span></span> </label>';
			// 			}
			// 		},
			// 		],
			// 		'buttons': [{
			// 			extend: 'excel',
			// 			className: 'export2 hidden'
			// 		}],
			// 		"dom": 'Bfrtip',
			// 		"initComplete": function (setting) {
			// 			$(".checkAll-tow").prop("checked", false);
			// 			$(".checkAll-tow").on('change', function () {
			// 				var t = $(this).is(":checked");
			// 				$("#zong-yhdzd").find('.checkboxes').each(function () {
			// 					t ? $(this).prop("checked", !0) : $(this).prop("checked", !1);
			// 					t ? $(this).closest('tr').addClass('selected') : $(this).closest('tr').removeClass('selected');
			// 				});
			// 				$(".checkAll-tow").prop("checked", t);
			// 			});
			// 			var windowHeight = $(window).height();
			// 			var scrollY = windowHeight - $("#expfunc-tool-bar").outerHeight(true) - $(".ufma-portlet").outerHeight(true) - 30;
			// 			$("#zong-table2").css({ height: scrollY + 'px' });
			// 		},
			// 		"drawCallback": function (setting) {
			// 			$('#' + tabelId).find("td.dataTables_empty").text("")
			// 				.append('<img src="' + bootPath + 'images/noData.png"/><br/><i>目前还没有你要查询的数据</i>');
			// 			$(".btn-release").on("click", function (e) {
			// 				$(this).closest('tr').remove();
			// 			});
			// 			ufma.isShow(reslist);
			// 			$("#zong-table2 table tr th:first").removeClass("sorting_asc");//移除checkbox列的排序箭头 
			// 		}
			// 	});
			// },
			newHengJournalTables: function (fixedJournalColumns, data) {
				// revise S插入对账号
				page.insertDzcount(fixedJournalColumns);
				//日记账表头固定列
				var tabelId = "heng-dwrjz";
				$("#" + tabelId).dataTable().fnDestroy();
				$("#" + tabelId).html(''); //guohx 先清空动态加载列
				var JournalColumns = page.newTableHead(fixedJournalColumns, "checkAll-three");
				page.initColumnsWidth(fixedJournalColumns);
				//revise S  根据表头各个标题的宽度改变table的宽度
				page.changeTableWidth("heng-dwrjz", fixedJournalColumns);

				//revise S  找到摘要的列 index
				var descptIndex = 4;
				for (var i = 0; i < fixedJournalColumns.length; i++) {
					if (fixedJournalColumns[i].title === "摘要") {
						descptIndex = i;
					}
				}

				//初始化横表
				page.hengDWRJZ = $("#" + tabelId).DataTable({
					"language": {
						"url": bootPath + "agla-trd/datatables/datatable.default.js"
					},
					data: data,

					"bFilter": false,
					"paging": false,
					"bLengthChange": true, //去掉每页显示多少条数据
					"processing": true, //是否显示正在加载
					"pagingType": "first_last_numbers", //分页样式
					"lengthChange": false, //是否允许用户自定显示数量
					"bInfo": false, //页脚信息
					"bSort": false, //排序功能
					"AutoWidth": false, //表格自定义宽度
					"bProcessing": true,
					"bDestroy": true,
					"columns": fixedJournalColumns,
					'fixedHeader': true,
					"ordering": true,
					"columnDefs": [{
						"targets": [0],
						"serchable": false,
						"orderable": false,
						"bSortable": false,
						"width": 30,
						"className": "nowrap no-print",
						"render": function (data, type, rowdata, meta) {
							return '<label class="mt-checkbox mt-checkbox-single mt-checkbox-outline" style="left: 10px;"><input type="checkbox" class="checkboxes" value="' + data + '" data-code="' + rowdata.chrId + '"/> &nbsp;<span></span> </label>';
						}
					}
					],
					'buttons': [{
						extend: 'excel',
						className: 'export3 hidden'
					}],
					// "dom": 'Bfrtip rt<"tableBox-three"t>',revise
					"dom": 'Bfrtip',
					"initComplete": function (setting) {
						$(".checkAll-three").prop("checked", false);
						$(".checkAll-three").on('change', function () {
							var t = $(this).is(":checked");
							$('#heng-dwrjz').find('.checkboxes').each(function () {
								t ? $(this).prop("checked", !0) : $(this).prop("checked", !1);
								t ? $(this).closest('tr').addClass('selected') : $(this).closest('tr').removeClass('selected');
							});
							$(".checkAll-three").prop("checked", t);
						});
						//revise S
						var windowHeight = $(window).height();
						$("#heng-dwrjz_wrapper .dataTables_scrollBody").css("height", windowHeight / 3 - 5);
						$("#heng-dwrjz" ).colResizable({
							liveDrag:true, 
							// gripInnerHtml:"<div class='grip'></div>", 
							draggingClass:"dragging", 
							// resizeMode:'overflow', 
							postbackSafe:true,
							partialRefresh:true,
							onResize: function (e) {
								if ($(".headFixedDiv").length > 0) {
									$(".headFixedInnerDiv").html("");
									var t = $("#heng-dwrjz")
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
					
							}
						}); 
						$("#heng-dwrjz").fixedTableHeadBank();
					},
					"drawCallback": function (setting) {
						$('#' + tabelId).find("td.dataTables_empty").text("")
							.append('<img src="' + bootPath + 'images/noData.png"/><br/><i>目前还没有你要查询的数据</i>');
						$(".tableBox-three").css({
							"height": page.hengTableHeight,
							"overflow-x": "auto",
							"overflow-y": "auto"
						});
						$(".btn-release").on("click", function (e) {
							$(this).closest('tr').remove();
						})
						ufma.isShow(reslist);
						$("#heng-dwrjz_wrapper table tr th:first").removeClass("sorting_asc");//移除checkbox列的排序箭头 
					}
				});
			},
			newHengStatementTables: function (statementColumns, data) {
				// revise S插入对账号
				page.insertDzcount(statementColumns);
				var tabelId = "heng-yhdzd";
				$("#" + tabelId).dataTable().fnDestroy();
				$("#" + tabelId).html(''); //guohx 先清空动态加载列
				var StatementColumns = page.newTableHead(statementColumns, 'checkAll-four');
				page.initColumnsWidth(StatementColumns, data, "heng-yhdzd");
				//revise S  根据表头各个标题的宽度改变table的宽度
				page.changeTableWidth("heng-yhdzd", StatementColumns);
				//revise S  找到摘要的列 index
				var descptIndex = 4;
				for (var i = 0; i < StatementColumns.length; i++) {
					if (StatementColumns[i].title === "摘要") {
						descptIndex = i;
					}
				}

				page.hengYHDZD = $("#" + tabelId).DataTable({
					"language": {
						"url": bootPath + "agla-trd/datatables/datatable.default.js"
					},
					data: data,
					"bFilter": false,
					"paging": false,
					"bLengthChange": true, //去掉每页显示多少条数据
					"processing": true, //是否显示正在加载
					"pagingType": "first_last_numbers", //分页样式
					"lengthChange": false, //是否允许用户自定显示数量
					"bInfo": false, //页脚信息
					"bSort": false, //排序功能
					"AutoWidth": false, //表格自定义宽度
					"bProcessing": true,
					"bDestroy": true,
					"columns": statementColumns,
					'fixedHeader': true,
					"ordering": true,
					"columnDefs": [{
						"targets": [0],
						"serchable": false,
						"orderable": false,
						"bSortable": false,
						"width": 30,
						"className": "nowrap no-print",
						"render": function (data, type, rowdata, meta) {
							return '<label class="mt-checkbox mt-checkbox-single mt-checkbox-outline" style="left: 10px;"><input type="checkbox" class="checkboxes" value="' + data + '" data-code="' + rowdata.chrId + '"/> &nbsp;<span></span> </label>';
						}
					}
					],
					'buttons': [{
						extend: 'excel',
						className: 'export4 hidden'
					}],
					// "dom": 'Bfrtip rt<"tableBox-four"t>',revise
					"dom": 'Bfrtip',
					"initComplete": function (setting) {
						$(".checkAll-four").prop("checked", false);
						$(".checkAll-four").on('change', function () {
							var t = $(this).is(":checked");
							$("#heng-yhdzd").find('.checkboxes').each(function () {
								t ? $(this).prop("checked", !0) : $(this).prop("checked", !1);
								t ? $(this).closest('tr').addClass('selected') : $(this).closest('tr').removeClass('selected');
							});
							$(".checkAll-four").prop("checked", t);
						});
						//revise S
						var windowHeight = $(window).height();
						$("#heng-yhdzd_wrapper .dataTables_scrollBody").css("height", windowHeight / 3 - 5);
						//$(".dataTables_scrollHeadInner").css("padding-right", "20px");
						$("#heng-yhdzd" ).colResizable({
							liveDrag:true, 
							draggingClass:"dragging", 
							postbackSafe:true,
							partialRefresh:true,
							onResize: function (e) {
								if ($(".headFixedDivTwo").length > 0) {
									$(".headFixedInnerDivTwo").html("");
									var t = $("#heng-yhdzd")
									var textAlign = t.find("thead").find("th").eq(1).css("text-align")
									var cloneTable = t.clone();
									cloneTable.appendTo($(".headFixedInnerDivTwo"))
									$(".headFixedInnerDivTwo").find("table").addClass("fixedTable")
									var id = $(".headFixedInnerDivTwo").find("table").attr("id");
									$(".headFixedInnerDivTwo").find("table").attr("id", id + "fixed")
									// $(".fixedTable").append($(cloneTable).html())
									$(".fixedTable").find("tbody").css("visibility", "hidden")
									$(".headFixedInnerDivTwo").find("th").find("input[type=checkbox]").closest("label").addClass("hidden")
									$(".headFixedDivTwo th").css("text-align", textAlign)
								}
					
							}
						}); 
						$("#heng-yhdzd").fixedTableHeadBankTwo();
					},
					"drawCallback": function (setting) {
						$('#' + tabelId).find("td.dataTables_empty").text("")
							.append('<img src="' + bootPath + 'images/noData.png"/><br/><i>目前还没有你要查询的数据</i>');
						$(".tableBox-four").css({
							"height": page.hengTableHeight,
							"border-right": "1px solid #D9D9D9",
							"overflow-x": "auto",
							"overflow-y": "auto"
						});
						$(".btn-release").on("click", function (e) {
							$(this).closest('tr').remove();
						})
						ufma.isShow(reslist);
						$("#heng-yhdzd_wrapper table tr th:first").removeClass("sorting_asc");//移除checkbox列的排序箭头 
					}
				});
			},
			isNotCheck: function () {
				if (page.direction == "zong") {
					var journalSelectLine = page.zongDWRJZ.rows(".selected").data().length;
					var statamentSelectedLine = page.zongYHDZD.rows(".selected").data().length;
					var allLength = journalSelectLine + statamentSelectedLine;
					if (allLength > 0) {
						return false;
					}
					return true;
				} else if (page.direction == "heng") {
					var journalSelectLine = page.hengDWRJZ.rows(".selected").data().length;
					var statamentSelectedLine = page.hengYHDZD.rows(".selected").data().length;
					var allLength = journalSelectLine + statamentSelectedLine;
					if (allLength > 0) {
						return false;
					}
					return true;
				}
			},
			//对账查询
			queryData: function () {
				if (!$.isNull($('input[name="minMoney"]').val()) && !$.isNull($('input[name="maxMoney"]').val())) {
					var moneyfrom = $('input[name="minMoney"]').val().replace(/,/g, "");
					var moneyto = $('input[name="maxMoney"]').val().replace(/,/g, "");
					if (parseFloat(moneyfrom) > parseFloat(moneyto)) {
						ufma.showTip('开始金额不能大于结束金额！', function () { }, 'error');
						return false;
					}
				}
				page.dateStart = $("#dateStart").getObj().getValue();
				page.dateEnd = $("#dateEnd").getObj().getValue();
				if ($('#dateStart').getObj().getValue() > $('#dateEnd').getObj().getValue()) {
					ufma.showTip('开始日期不能大于结束日期！', function () { }, 'error');
					return false;
				}
				//缓存表头扩展字段
				var schemaJournal = ufma.getObjectCache(page.schemaGuid + "schemaJournal");
				var schemaStatement = ufma.getObjectCache(page.schemaGuid + "schemaStatement");
				if (!$.isNull(schemaJournal)) {
					//page.initJournalExtend(schemaJournal.data);  //guohx  注释,不知道此处有什么用,导致发送了两次请求 对账失败
					ufma.get(portList.getExtendList, {
						schemaGuid: page.schemaGuid,
						bookType: "01",
						enabled: "1",
						agencyCode: page.cbAgency.getValue()
					}, function (result) {
						page.initJournalExtend(result.data, "0");
						ufma.setObjectCache(page.schemaGuid + "schemaJournal", result);
						ufma.hideloading();
					});
				} else {
					ufma.hideloading();
					page.initJournalExtend([]); //修改进来单位没有预算方案加载为空
				}
				if (!$.isNull(schemaStatement)) {
					//page.initStatementExtend(schemaStatement.data);
					ufma.get(portList.getExtendList, {
						schemaGuid: page.schemaGuid,
						bookType: "02",
						enabled: "1",
						agencyCode: page.cbAgency.getValue()
					}, function (sresult) {
						page.initStatementExtend(sresult.data);
						ufma.setObjectCache(page.schemaGuid + "schemaStatement", sresult);
						ufma.hideloading();
					});
				} else {
					ufma.hideloading();
					page.initStatementExtend([]);
				}
				$.timeOutRun(null, null, function () {
					page.onCalculate(true);
				}, 500);
			},
			initDate: function () {
				var pfData = ufma.getCommonData();
				var ddYear = pfData.svSetYear;
				var ddMonth = pfData.svFiscalPeriod - 1;
				$('#dateStart').ufDatepicker({
					format: 'yyyy-mm-dd',
					initialDate: new Date(new Date(ddYear, ddMonth, 1))
				});
				//修改默认进来为当前期间1号到今天 guohx 解决全年数据量大加载不出问题
				$('#dateEnd').ufDatepicker({
					format: 'yyyy-mm-dd',
					initialDate: pfData.svTransDate,
					onChange: function () {
						page.initPeriod();
					}
				});
			},
			getJournalRowData: function (table) {
				selectedLine = table.rows('.selected');
				var data = selectedLine.data();
				// if (data.length == 0) {
				// 	data = table.data();
				// }
				var guid = [];
				if (data != null && data != undefined) {
					for (var i = 0; i < data.length; i++) {
						guid.push(data[i].journalGuid);
					}
				}
				return guid;
			},
			getStatementRowData: function (table) {
				selectedLine = table.rows('.selected');
				var data = selectedLine.data();
				// if (data.length == 0) {
				// 	data = table.data();
				// }
				var guid = [];
				if (data != null && data != undefined) {
					for (var i = 0; i < data.length; i++) {
						guid.push(data[i].statementGuid);
					}
				}
				return guid;
			},
			//获取关联号 guohx  取消对账使用
			getJournalRcode: function (table) {
				selectedLine = table.rows('.selected');
				var data = selectedLine.data();
				var jouGuid = [];
				if (data != null && data != undefined) {
					for (var i = 0; i < data.length; i++) {
						jouGuid.push(data[i].journalGuid);
					}
				}
				return jouGuid;
			},
			getStatementRcode: function (table) {
				selectedLine = table.rows('.selected');
				var data = selectedLine.data();
				var stateGuid = [];
				if (data != null && data != undefined) {
					for (var i = 0; i < data.length; i++) {
						stateGuid.push(data[i].statementGuid);
					}
				}
				return stateGuid;
			},
			accAdd: function (arg1, arg2) {
				var r1, r2, m;
				try {
					r1 = arg1.toString().split(".")[1].length
				} catch (e) {
					r1 = 0
				}
				try {
					r2 = arg2.toString().split(".")[1].length
				} catch (e) {
					r2 = 0
				}
				m = Math.pow(10, Math.max(r1, r2))
				return ((arg1 * m + arg2 * m) / m).toFixed(2);
			},

			subTr: function (arg1, arg2) {
				var r1, r2, m, n;
				try {
					r1 = arg1.toString().split(".")[1].length
				} catch (e) {
					r1 = 0
				}
				try {
					r2 = arg2.toString().split(".")[1].length
				} catch (e) {
					r2 = 0
				}
				m = Math.pow(10, Math.max(r1, r2));
				//动态控制精度长度
				n = (r1 >= r2) ? r1 : r2;
				return ((arg1 * m - arg2 * m) / m).toFixed(2);
			},
			getAmt: function (table, amtName, init) {
				var data;
				if (!$.isNull(table)) {
					selectedLine = table.rows('.selected');
					if (init == true) {
						data = table.data();
					} else {
						data = selectedLine.data();
					}
				}
				var amt = 0;
				if (data != null && data != undefined) {
					for (var i = 0; i < data.length; i++) {
						var line = data[i];
						var num = 0;
						if (line[amtName] != null && line[amtName] != "") {
							num = line[amtName];
						}
						amt = page.accAdd(amt, num);
					}
				}
				return amt; //parseFloat(amt.toFixed(2))
			},
			getAutoRule: function () {
				var autoRule = [];
				$("#autoRule .rule-list ul").find("input[type=checkbox]").each(function (idx, item) {
					//不需要传输金额
					if (item.id != "amount")
						if (item.checked) {
							autoRule.push(item);
						}
				});
				return autoRule;
			},
			getJournalData: function (fixedJournalColumns, isAutoGet) {
				if (!$.isNull(page.schemaGuid)) {
					var argu = $('#frmQuery').serializeObject();
					var arguMore = $('#queryMore').serializeObject();
					argu = $.extend(argu, arguMore);
					argu.schemaGuid = page.schemaGuid;
					argu.agencyCode = page.cbAgency.getValue();
					argu.isBalanceAcc = page.isBalanceAcc;
					argu.groupGuidLike = page.isBalanceAcc == "0" ? "" : argu.groupGuidLike ;
					argu.rgCode = pfData.svRgCode;
					argu.setYear = pfData.svSetYear;
					argu.startFisPerd = 0;
					argu.isAutoGet = isAutoGet;
					var url = portList.getJournal;
					var callback = function (result) {
						// page.newZongJournalTables(fixedJournalColumns, result.data);
						page.newHengJournalTables(fixedJournalColumns, result.data);
						journalResult = true;
						if (journalResult && statementResult) {
							ufma.hideloading();
							journalResult = false;
							statementResult = false;
						}
					};
					$.ufajax(url, 'get', argu, callback);
				} else {
					// page.newZongJournalTables(fixedJournalColumns, []);
					page.newHengJournalTables(fixedJournalColumns, []);
				}
			},
			getStatementData: function (fixedStatementColums) {
				if (!$.isNull(page.schemaGuid)) {
					var argu = $('#frmQuery').serializeObject();
					var arguMore = $('#queryMore').serializeObject();
					argu = $.extend(argu, arguMore);
					argu.schemaGuid = page.schemaGuid;
					argu.agencyCode = page.cbAgency.getValue();
					argu.isBalanceAcc = page.isBalanceAcc;
					argu.groupGuidLike = page.isBalanceAcc == "0" ? "" : argu.groupGuidLike ;
					argu.rgCode = pfData.svRgCode;
					argu.setYear = pfData.svSetYear;
					argu.startFisPerd = 0;
					var url = portList.getBankStatementList;
					var callback = function (result) {
						// page.newZongStatementTables(fixedStatementColums, result.data.cuBankStatementList);
						page.newHengStatementTables(fixedStatementColums, result.data.cuBankStatementList);
						statementResult = true;
						//日记账和对账单都返回成功后去掉遮罩层
						if (journalResult && statementResult) {
							ufma.hideloading();
							journalResult = false;
							statementResult = false;
						}
					};
					$.ufajax(url, 'get', argu, callback);
				} else {
					// page.newZongStatementTables(fixedStatementColums, []);
					page.newHengStatementTables(fixedStatementColums, []);

				}

			},
			onCalculate: function (isNotcheck) {
				var journalAmtDr = 0; //单位日记账借方
				var journalAmtCr = 0;
				var statementAmtDr = 0;
				var statementAmtCr = 0;
				var balanceAmtDr = 0;
				var balanceAmtCr = 0;
				if (page.direction === 'zong') {
					var zongJournalAmtDr = page.getAmt(page.zongDWRJZ, "amtDr", isNotcheck);
					var zongJournalAmtCr = page.getAmt(page.zongDWRJZ, "amtCr", isNotcheck);
					var zongStatementAmtDr = page.getAmt(page.zongYHDZD, "amtDr", isNotcheck);
					var zongStatementAmtCr = page.getAmt(page.zongYHDZD, "amtCr", isNotcheck);
					journalAmtDr = zongJournalAmtDr;
					journalAmtCr = zongJournalAmtCr;
					statementAmtDr = zongStatementAmtDr;
					statementAmtCr = zongStatementAmtCr;
					if (isOpposite == 0) {
						balanceAmtDr = page.subTr(statementAmtCr, journalAmtCr);
						balanceAmtCr = page.subTr(statementAmtDr, journalAmtDr);
					} else if (isOpposite == 1) {
						balanceAmtDr = page.subTr(statementAmtDr, journalAmtCr);
						balanceAmtCr = page.subTr(statementAmtCr, journalAmtDr);
					}
				} else if (page.direction === 'heng') {
					var hengJournalAmtDr = page.getAmt(page.hengDWRJZ, "amtDr", isNotcheck);
					var hengJournalAmtCr = page.getAmt(page.hengDWRJZ, "amtCr", isNotcheck);
					var hengStatementAmtDr = page.getAmt(page.hengYHDZD, "amtDr", isNotcheck);
					var hengStatementAmtCr = page.getAmt(page.hengYHDZD, "amtCr", isNotcheck);
					journalAmtDr = hengJournalAmtDr;
					journalAmtCr = hengJournalAmtCr;
					statementAmtDr = hengStatementAmtDr;
					statementAmtCr = hengStatementAmtCr;
					if (isOpposite == 0) {
						balanceAmtDr = page.subTr(statementAmtDr, journalAmtDr);
						balanceAmtCr = page.subTr(statementAmtCr, journalAmtCr);
					} else if (isOpposite == 1) {
						balanceAmtDr = page.subTr(statementAmtCr, journalAmtDr);
						balanceAmtCr = page.subTr(statementAmtDr, journalAmtCr);
					}
				}
				if (balanceAmtDr == 0) {
					$("#balanceAmtDr").removeClass("label-cash-croci");
					$("#balanceAmtDr").addClass("label-cash-black");
				} else {
					$("#balanceAmtDr").removeClass("label-cash-black");
					$("#balanceAmtDr").addClass("label-cash-croci");
				}
				if (balanceAmtCr == 0) {
					$("#balanceAmtCr").removeClass("label-cash-croci");
					$("#balanceAmtCr").addClass("label-cash-black");
				} else {
					$("#balanceAmtCr").removeClass("label-cash-black");
					$("#balanceAmtCr").addClass("label-cash-croci");
				}
				var journalAmtDr = page.returnFloat(journalAmtDr);
				var statementAmtDr = page.returnFloat(statementAmtDr);
				var statementAmtDr = page.returnFloat(statementAmtDr);
				var balanceAmtDr = page.returnFloat(balanceAmtDr);
				var journalAmtCr = page.returnFloat(journalAmtCr);
				var statementAmtCr = page.returnFloat(statementAmtCr);
				var statementAmtCr = page.returnFloat(statementAmtCr);
				var balanceAmtCr = page.returnFloat(balanceAmtCr);
				$('#journalAmtDr').html(rpt.comdify(journalAmtDr));
				$('#statementAmtDr').html(rpt.comdify(statementAmtDr));
				$('#statementAmtDr3').html(rpt.comdify(statementAmtDr));
				$("#balanceAmtDr").html(rpt.comdify(balanceAmtDr));
				$('#journalAmtCr').html(rpt.comdify(journalAmtCr));
				$("#statementAmtCr").html(rpt.comdify(statementAmtCr));
				$("#statementAmtCr3").html(rpt.comdify(statementAmtCr));
				$("#balanceAmtCr").html(rpt.comdify(balanceAmtCr));

			},

			initExtendCondition: function () {
				$('#autoRule .rule-list ul').find('li').each(function (idex, item) {
					if ($(this).hasClass('extends-rule')) {
						$(this).remove();
					}
				});
				$.ufajax(portList.getExtendForBanlance, 'get', {
					"schemaGuid": page.schemaGuid,
					"agencyCode": page.agencyCode
				}, function (result) {
					/* callback1(result.data);*/
					var data = result.data
					var extendCondition = [];
					if (data != null && data != "") {
						for (var i = 0; i < data.length; i++) {
							journal = data[i].JOURNAL_EXTEND_FIELD;
							journalName = data[i].JOURNAL_SHOW_NAME;
							statement = data[i].STATEMENT_EXTEND_FIELD;
							statementName = data[i].JOURNAL_SHOW_NAME;
							extendCondition.push({
								"journal": journal,
								"journalName": journalName,
								"statement": statement,
								"statementName": statementName
							});
							condition = '<li class="extends-rule"><label class="mt-checkbox mt-checkbox-outline check-label check-query">' +
								' <input  type="checkbox" data-journal="' + journal + '" data-statement="' + statement + '" data-isDate="false">' +
								'日记账的【' + journalName + '】与对账单的【' + statementName + '】相同' +
								'<span class="check-span"></span> </label></li>';
							$('#autoRule .rule-list ul').append(condition);
						}
					}
				});
				/*  var callback1 = function (data) {
  
                  }*/
			},
			notEmpty: function (val) {
				if (val != null && val != "" && val != undefined) {
					return true;
				}
				return false;
			},
			//初始化期间
			initPeriod: function () {
				var year = $("#dateStart").getObj().getValue().substring(0, 4);
				month = parseInt($("#dateEnd").getObj().getValue().substring(5, 7));//放开注释 guohx  修改传递到弹窗参数
				period = year + '-' + page.addZero(month);
			},
			onEventListener: function () {
				//选中单行数据
				$("#zong-dwrjz,#zong-yhdzd,#heng-dwrjz,#heng-yhdzd").on("click", "tbody td:not(.btnGroup)", function (e) {
					e.preventDefault();
					var $ele = $(e.target);
					var $tr = $ele.closest("tr");
					var $input = $ele.closest('tr').find('input[type="checkbox"]');
					if ($tr.hasClass("selected")) {
						$tr.removeClass("selected");
						$input.prop("checked", false);
					} else {
						$tr.addClass("selected");
						$input.prop("checked", true);
					}
					//计算贷方金额，借方金额和差额
					if (page.isNotCheck()) {
						page.onCalculate(true);
					} else {
						page.onCalculate(false);
					}
				});
				$("#zong-table,#heng-table").on("change", 'input[type="checkbox"]', function (e) {
					if (page.isNotCheck()) {
						page.onCalculate(true);
					} else {
						page.onCalculate(false);
					}
				})
				//查询
				$(".btn-query").on("click", function () {
					page.queryData();
				});
				//手动对账
				$(".btn-Manual").on("click", function (e) {
					var argu = {};
					if (page.direction === "zong") {
						if (($("#zong-dwrjz").find(".selected").length + $("#zong-yhdzd").find(".selected").length) <= 1) {
							ufma.showTip("请先选择您要对账的数据", '', 'warnning');
							return false;
						} else {
							argu.journalGuids = page.getJournalRowData(page.zongDWRJZ);
							argu.statementGuids = page.getStatementRowData(page.zongYHDZD);
						}

					} else if (page.direction === "heng") {
						if (($("#heng-dwrjz").find(".selected").length + $("#heng-yhdzd").find(".selected").length) <= 1) {
							ufma.showTip("请先选择您要对账的数据", '', 'warnning');
							return false;
						} else {
							argu.journalGuids = page.getJournalRowData(page.hengDWRJZ);
							argu.statementGuids = page.getStatementRowData(page.hengYHDZD);
						}
					}
					argu.agencyCode = page.agencyCode;
					argu.schemaGuid = page.schemaGuid;
					argu.balAccPerd = page.fisPerd; //期间未定义  是否需要期间
					ufma.post(portList.balanceManual, argu, function (result) {
						ufma.showTip(result.msg, '', result.flag);
						if (result.flag === "success") {
							page.queryData();
						}
					});
				});
				//自动对账
				$('.btn-auto').on("click", function () {
					if ($.isNull(page.schemaGuid)) {
						ufma.showTip("请先选择对账方案！", '', 'warnning');
						return false;
					}
					$("#autoRule .rule-list ul").find("input[type=checkbox]").each(function (idx, item) {
						//不需要传输金额
						if (item.id != "amount")
							if (item.checked) {
								item.checked = false;
							}
					});
					$('#error').val("2");
					page.editor = ufma.showModal('autoRule', 590, 368);
				});
				$('.btn-confirmAcc').on("click", function (e) {
					ufma.showloading('正在加载数据，请耐心等待...');
					var autoRule = page.getAutoRule();
					var balanceKey = [];
					for (var i = 0; i < autoRule.length; i++) {
						var journal = autoRule[i].dataset.journal;
						var statement = autoRule[i].dataset.statement;
						var isDate = autoRule[i].dataset.isdate;
						if (journal != undefined && statement != undefined && isDate != undefined) {
							var rule = {};
							rule.journalKey = journal;
							rule.statementKey = statement;
							rule.isDate = isDate;
							if (journal == "JOU_DATE" || journal == "BILL_NO" || journal == "relation") {
								rule.isAccItem = 0;
							} else {
								rule.isAccItem = 1;
							}
							balanceKey.push(rule);
						}
					}
					var error = $('#error').val();
					var argu = $('#frmQuery').serializeObject();
					var arguMore = $('#queryMore').serializeObject();
					argu = $.extend(argu, arguMore);
					argu.balanceKey = balanceKey;
					argu.schemaGuid = page.schemaGuid;
					argu.balAccPerd = page.fisPerd;
					argu.agencyCode = page.agencyCode;
					argu.error = error;
					ufma.post(portList.balanceAuto, argu, function (result) {
						//加弹出层
						if (result.flag === "success") {
							ufma.hideloading();
							if (result.data.banlanceData == false) {
								page.queryData();
								ufma.showTip(result.msg, '', 'error');
								return false;
							} else {
								reconResult = result.data;
								page.editor.close();
								page.editor = ufma.showModal('reconResult', 590, 368);
								$('#jDrCount').html(reconResult.jDrCount);
								$('#jDrMoney').html($.formatMoney(reconResult.jDrMoney, 2));
								$('#jCrCount').html(reconResult.jCrCount);
								$('#jCrMoney').html($.formatMoney(reconResult.jCrMoney, 2));
								$('#sDrCount').html(reconResult.sDrCount);
								$('#sDrMoney').html($.formatMoney(reconResult.sDrMoney, 2));
								$('#sCrCount').html(reconResult.sCrCount);
								$('#sCrMoney').html($.formatMoney(reconResult.sCrMoney, 2));
							}
						}
					});
				});
				$(".btn-confirmRecon").on('click', function () {
					var data = {};
					data.journalLs = reconResult.journalLs;
					data.statementLs = reconResult.statementLs;
					data.jDrMoney = reconResult.jDrMoney;
					data.maxMoney = reconResult.maxMoney;
					data.minMoney = reconResult.minMoney;
					data.startDate = reconResult.startDate;
					data.statementGuids = reconResult.statementGuids;
					data.journalGuids = reconResult.journalGuids;
					data.balanceResults = reconResult.balanceResults;
					ufma.post(portList.saveBalancedAuto, data, function (result) {
						ufma.showTip(result.msg, '', result.flag);
						page.queryData();
						page.editor.close();
					});
				})
				$(".btn-close").on('click', function () {
					page.editor.close();
				})
				//取消对账
				$('.btn-cancelBalance').on('click', function () {
					if (page.direction === "zong") {
						if (($("#zong-dwrjz").find(".selected").length + $("#zong-yhdzd").find(".selected").length) < 1) {
							ufma.showTip("请选择要取消的对账数据", '', 'warnning');
							return false;
						}
						journalGuids = page.getJournalRcode(page.zongDWRJZ);
						statementGuids = page.getStatementRcode(page.zongYHDZD);
						var argu = {
							"agencyCode": page.agencyCode,
							"schemaGuid": page.schemaGuid,
							"journalGuids": journalGuids,
							"statementGuids": statementGuids
						};
						ufma.post(portList.cancelBalance, argu, function (result) {
							ufma.showTip(result.msg, '', result.flag);
							if (result.flag === "success") {
								page.queryData();
							}
						});
					} else if (page.direction === "heng") {
						if (($("#heng-dwrjz").find(".selected").length + $("#heng-yhdzd").find(".selected").length) < 1) {
							ufma.showTip("请选择要取消的对账数据", '', 'warnning');
							return false;
						}
						journalGuids = page.getJournalRcode(page.hengDWRJZ);
						statementGuids = page.getStatementRcode(page.hengYHDZD);
						// for (var i = 0; i < statementGuids.length; i++) {
						// 	journalGuids.push(statementGuids[i])
						// }
						var argu = {
							"agencyCode": page.agencyCode,
							"schemaGuid": page.schemaGuid,
							"journalGuids": journalGuids,
							"statementGuids": statementGuids
						};
						ufma.post(portList.cancelBalance, argu, function (result) {
							ufma.showTip(result.msg, '', result.flag);
							if (result.flag === "success") {
								page.queryData();
							}
						});
					}


				});
				//横纵表切换
				$("#zong").on("click", function (e) {
					$('.tab-content').css("margin-top", "5px");
					$("#zong-table").removeClass("hidden");
					$("#heng-table").addClass("hidden");
					page.direction = "zong";
					if (page.isNotCheck()) {
						page.onCalculate(true);
					} else {
						page.onCalculate(false);
					}
					page.queryData();
				});
				$("#heng").on("click", function (e) {
					$('.tab-content').css("margin-top", "5px");
					$("#heng-table").removeClass("hidden");
					$("#zong-table").addClass("hidden");
					page.direction = "heng";
					if (page.isNotCheck()) {
						page.onCalculate(true);
					} else {
						page.onCalculate(false);
					}
					page.queryData(); //解决切换后表头不自适应问题
				});
				$('#query-status').on("click", function (e) {
					var _self = e.target;
					//1.全部时下面三个按钮不显示，2.已对账时显示取消对账3.未对账时显示自动和手工对
					page.isBalanceAcc = $(_self).attr('value');
					if (page.isBalanceAcc == "") {
						$(".btn-Manual").hide() //手工对账
						$(".btn-auto").hide() //自动对账
						$(".btn-cancelBalance").hide() //取消对账
						$("#groupGuidLike").show();
						$("#pNo").val("");
					} else if (page.isBalanceAcc == "1") {
						$(".btn-Manual").hide() //手工对账
						$(".btn-auto").hide() //自动对账
						$(".btn-cancelBalance").show() //取消对账
						$("#groupGuidLike").show();
					} else if (page.isBalanceAcc == "0") {
						$(".btn-Manual").show() //手工对账
						$(".btn-auto").show() //自动对账
						$(".btn-cancelBalance").hide() //取消对账
						$("#groupGuidLike").hide();
						$("#pNo").val("");
					}

					page.queryData();
					//CWYXM-12566 出纳模块银行对账，手工对账后，将已对账的数据取消对账，切换到全部列表页面，下方单位日记账的金额没有带出 guohx 20200317
					page.onCalculate();
				});
				$('.rpt-tip-more').on('click', function () {
					if ($(this).find("i").text() == "更多") {
						$(this).find("i").text("收起");
						$(this).find("span").removeClass("icon-angle-bottom").addClass("icon-angle-top");
						$(".query-conceal").slideDown();
					} else {
						$(this).find("i").text("更多");
						$(this).find("span").removeClass("icon-angle-top").addClass("icon-angle-bottom");
						$(".query-conceal").slideUp();
					}
				});
				$("#setAccSche").on("click", function () {
					var obj = {}; //选中的方案内容
					obj.schemaGuid = $("#BankReconSche").getObj().getValue();
					if ($.isNull(obj.schemaGuid)) {
						ufma.showTip("该单位下没有可查看的对账方案!", '', 'warnning');
						return false;
					} else {
						var param = {};
						param["action"] = "edit";
						param["agencyCode"] = page.cbAgency.getValue();
						param["agencyName"] = page.cbAgency.getText();
						param["rgCode"] = page.rgCode;
						param["setYear"] = page.setYear;
						param["data"] = obj;
						param.bankInfo = bankInfo;
						ufma.open({
							url: "../bankBalanceAccSche/setAccSche.html",
							title: "编辑对账方案",
							width: 1090,
							data: param,
							ondestory: function (data) {
								if (data.action == "save") {
									//获取对账方案列表
									page.reqMethod();
									$("#BankReconSche").getObj().val(obj.schemaGuid);
								}
							}
						});
					}

				});
				//预览余额调节表
				$("#viewBalAdjTable").on("click", function (e) {
					if ($.isNull(page.schemaGuid)) {
						ufma.showTip("请先选择对账方案！", '', 'warnning');
						return false;
					}
					var stitle = '预览余额调节表';
					ufma.open({
						url: 'viewBalAdjTable.html',
						title: stitle,
						width: 1090,
						data: {
							'fisPerd': period,
							"month": month,
							"bankInfo": bankInfo,
							'schemaGuid': page.schemaGuid,
							/* 'agencyCode':$("#BankReconSche").getObj().val()*/
							'agencyCode': page.cbAgency.getValue()
						},
						ondestory: function (result) { }
					});
				});

				//隐藏菜单
				$('#hide').on('click', function () {
					$('#show').removeClass('hidden');
					$(this).addClass('hidden');
					$('#queryMore').addClass('hidden');
					ufma.setBarPos($(window));
				})
				//显示菜单
				$('#show').on('click', function () {
					$('#hide').removeClass('hidden')
					$(this).addClass('hidden')
					$('#queryMore').removeClass('hidden')
					ufma.setBarPos($(window));
				})
				//当点击左侧的导航栏时 动态计算宽度
				$(window).resize(function () {
					var tablewidth = $(window).width() - 32 - 30 - 48 - 7 - 5;
					$('.heng-table-table ').css("width", tablewidth);
					var centerWidth = $(".workspace-center").width();
					$("#expfunc-tool-bar").width(centerWidth);
					var padding = ($('.heng-table-title').width() - 16) / 2;
					$('#rjzExport').css("padding-left", padding);
					$('#rjzExport').css("padding-right", padding);
					$('#dzdExport').css("padding-left", padding);
					$('#dzdExport').css("padding-right", padding);
				});
				//导出单位日记账
				$("#rjzExport").on("click", function (evt) {
					evt = evt || window.event;
					evt.preventDefault();
					var topInfo = [
						['单位名称：' + page.agencyCode + ' ' + page.agencyName],
						['方案名称：' + page.schemaName],
						['日期：' + $("#dateStart").getObj().getValue() + '至' + $("#dateEnd").getObj().getValue()]
					]
					uf.expTable({
						title: '单位日记账',
						topInfo: topInfo,
						exportTable: '#heng-dwrjz'
					});
				});
				//导出银行对账单
				$("#dzdExport").on("click", function (evt) {
					evt = evt || window.event;
					evt.preventDefault();
					var topInfo = [
						['单位名称：' + page.agencyCode + ' ' + page.agencyName],
						['方案名称：' + page.schemaName],
						['日期：' + $("#dateStart").getObj().getValue() + '至' + $("#dateEnd").getObj().getValue()]
					]
					uf.expTable({
						title: '银行对账单',
						topInfo: topInfo,
						exportTable: '#heng-yhdzd'
					});
				});
			},
			initBankBalanceAcc: function () {
				page.initExtendCondition();
				var schemaJournal = ufma.getObjectCache(page.schemaGuid + "schemaJournal");
				var schemaStatement = ufma.getObjectCache(page.schemaGuid + "schemaStatement");
				if (schemaJournal != null && schemaJournal != undefined && schemaStatement != null && schemaStatement != undefined) {
					page.initJournalExtend(schemaJournal.data, "1");
					page.initStatementExtend(schemaStatement.data);
				} else {
					ufma.get(portList.getExtendList, {
						"schemaGuid": page.schemaGuid,
						bookType: "01",
						enabled: "1",
						agencyCode: page.cbAgency.getValue()
					}, function (result) {
						page.initJournalExtend(result.data, "1");
						ufma.setObjectCache(page.schemaGuid + "schemaJournal", result);
						ufma.get(portList.getExtendList, {
							"schemaGuid": page.schemaGuid,
							bookType: "02",
							enabled: "1",
							agencyCode: page.cbAgency.getValue()
						}, function (sresult) {
							page.initStatementExtend(sresult.data);
							ufma.setObjectCache(page.schemaGuid + "schemaStatement", sresult);
						})

					})
				}
			},
			//获取对账方案列表
			reqMethod: function () {
				var argu = {
					agencyCode: page.cbAgency.getValue(),
					rgCode: pfData.svRgCode,
					setYear: pfData.svSetYear
				};
				$("#BankReconSche").ufCombox({
					idField: "schemaGuid",
					textField: "schemaName",
					placeholder: "请选择对账方案",
					onChange: function (sender, data) {
						page.schemaGuid = data.schemaGuid;
						page.schemaName = data.schemaName;
						page.initBankBalanceAcc();
						isOpposite = data.isOpposite;

						if (page.notEmpty(data.bank)) { //开户行
							bankInfo = data.bank;
						} else {
							bankInfo = "";
						}

						if (page.notEmpty(data.bankAccount)) { //账号
							bankInfo += "&nbsp;" + data.bankAccount;
						} else {
							bankInfo = "";

						}

						$.timeOutRun(null, null, function () {
							page.drawAccDir(isOpposite);
						}, 500);
						$.timeOutRun(null, null, function () {
							page.onCalculate(true);
						}, 500);
					},
					onComplete: function (sender) {
						if (isLoading == true) {
							if (!$.isNull($(sender).getObj().getItem())) {
								isOpposite = $(sender).getObj().getItem().isOpposite;
								isLoading = false;
							}
						}
					}
				});
				//请求对账方案，因为异步可能导致表格加载时未加载自定义列的问题，所以在请求对账方案后先请求自定义列
				ufma.get(portList.accScheList, argu, function (result) {
					if (result.data.length == 0) {
						page.schemaGuid = "";
						page.queryData();
					}
					$("#BankReconSche").getObj().load(result.data);
					if (result.data.length > 0) {
						$("#BankReconSche").getObj().val(result.data[0].schemaGuid);
						page.schemaGuid = result.data[0].schemaGuid;
						/* page.initBankBalanceAcc();*/
					}
				});
			},
			//根据对账方案设置的方向来判断下面计算方式 by guohx
			drawAccDir: function (isOpposite) {
				if (isOpposite == 0) { //isOpposite值为0，日记账借方对对账单借方，日记账贷方对对账单贷方，即同方向
					$("#statementAmtCr2").addClass("hide");
					$("#statementAmtCr3").addClass("hide");
					$("#statementAmtDr2").addClass("hide");
					$("#statementAmtDr3").addClass("hide");
					$("#statementAmtDr1").removeClass("hide");
					$("#statementAmtDr").removeClass("hide");
					$("#statementAmtCr1").removeClass("hide");
					$("#statementAmtCr").removeClass("hide");
				} else if (isOpposite == 1) {
					$("#statementAmtDr1").addClass("hide");
					$("#statementAmtDr").addClass("hide");
					$("#statementAmtCr1").addClass("hide");
					$("#statementAmtCr").addClass("hide");
					$("#statementAmtCr2").removeClass("hide");
					$("#statementAmtCr3").removeClass("hide");
					$("#statementAmtDr2").removeClass("hide");
					$("#statementAmtDr3").removeClass("hide");
				}
			},
			addZero: function (num) {
				if (num < 10) {
					num = '0' + num;
				}
				return num;
			},
			//票据类型
			reqBillType: function () {
				var argu = {
					agencyCode: page.agencyCode,
					setYear: page.setYear,
					rgCode: page.rgCode,
					eleCode: "BILLTYPE"
				};
				ufma.get(portList.accItemTree, argu, function (result) {
					$('#billType').ufTreecombox({
						idField: 'code',
						textField: 'codeName',
						pIdField: 'pCode', //可选
						//placeholder: '请选择票据类型',
						leafRequire: false,
						readonly: false,
						data: result.data,
						onComplete: function (sender) {

						}
					});
				});
			},
			initPage: function () {
				$(".btn-query").trigger('click');
				var pfData = ufma.getCommonData();
				page.bennian = pfData.svSetYear; //本年 年度
				page.nowDate = pfData.svTransDate; //当前年月日
				page.rgCode = pfData.svRgCode; //区划代码
				page.userId = pfData.svUserId; //登录用户ID  //修改权限  将svUserCode改为 svUserId  20181012
				page.userName = pfData.svUserName; //登录用户名称
				page.agencyCode = pfData.svAgencyCode; //登录单位代码
				page.agencyName = pfData.svAgencyName; //登录单位名称
				page.setYear = pfData.svSetYear;
				page.initDate();
				page.dateStart = $("#dateStart").getObj().getValue();
				page.dateEnd = $("#dateEnd").getObj().getValue();
				page.isBalanceAcc = "0";
				$("#minMoney,#maxMoney").amtInputNull();
				//初始化单位
				page.cbAgency = $("#cbAgency").ufmaTreecombox2({
					valueField: 'id',
					textField: 'codeName',
					placeholder: '请选择单位',
					icon: 'icon-unit',
					readOnly: false,
					onchange: function (data) {
						//给全局单位变量赋值
						page.agencyCode = data.id;
						page.agencyName = data.name;
						//80827 【财务云8.0 鄂尔多斯 】20190630所有页面，单位或账套选择变化后，再打开其它页面时，自动显示为最近一次选择的单位或账套。--zsj
						//缓存单位
						var params = {
							selAgecncyCode: data.id,
							selAgecncyName: data.name
						}
						ufma.setSelectedVar(params);
						page.reqMethod();
						$.timeOutRun(null, null, function () {
							page.drawAccDir(isOpposite);
						}, 500);
						$.timeOutRun(null, null, function () {
							page.onCalculate(true);
						}, 500);
						page.reqBillType();
					}
				});
				page.initPeriod();
				//请求单位列表
				ufma.ajax(portList.agencyList, "get", {
					"rgCode": page.rgCode,
					"setYear": page.setYear
				}, function (result) {
					var data = result.data;
					if (result.data.length == 0) {
						page.schemaGuid = "";
						page.queryData();
					}
					var cbAgency = $("#cbAgency").ufmaTreecombox2({
						data: result.data
					});
					var code = data[0].id;
					var name = data[0].name;
					if (page.agencyCode != "" && page.agencyName != "") {
						var agency = $.inArrayJson(data, 'id', page.agencyCode);
						if (agency != undefined) {
							cbAgency.val(page.agencyCode);
						} else {
							cbAgency.val(code);
							page.agencyCode = code;
							page.agencyName = name;
						}
					} else {
						cbAgency.setValue(code, code + " " + name);
						page.agencyCode = code;
						page.agencyName = name;
					}
				});
				page.direction = "heng"; //默认横向
				var indexMonth = new Date().getMonth();
				page.fisPerd = $("#quj-line .month-text .month-one a").eq(indexMonth).attr("data-fisPerd");
				var windowHeight = $(window).height();
				//revise S
				setTimeout(function () {
					var centerWidth = $(".workspace-center").width();
					$("#expfunc-tool-bar").width(centerWidth);
				}, 200);

				$('.heng-table-title').css("height", Math.floor(windowHeight / 3) + 31);
				//revise E
				$('.heng-table-table ').css("height", Math.floor(windowHeight / 3) + 31);
				var tablewidth = $(window).width() - 32 - 30 - 48 - 7- 5;
				$('.heng-table-table ').css("width",tablewidth);
				$('.heng-table-table ').css("overflow","auto");
				//revise S
				$('.heng-table').css("height", page.hengTableHeight);
				var padding = ($('.heng-table-title').width() - 16) / 2;
				$('#rjzExport').css("padding-left", padding);
				$('#dzdExport').css("padding-left", padding);
				$('#rjzExport').css("padding-right", padding);
				$('#dzdExport').css("padding-right", padding);
				var paddingS = (Math.floor(windowHeight / 3) + 31 - 36 - 150) / 2;
				$('.padding-style').css("padding-top", paddingS);
				//revise E
				$.timeOutRun(null, null, function () {
					page.onCalculate(true);
				}, 500);
				$("#error").intInput();
			},
			returnFloat: function (value) {
				var value = Math.round(parseFloat(value) * 100) / 100;
				var xsd = value.toString().split(".");
				if (xsd.length == 1) {
					value = value.toString() + ".00";
					return value;
				}
				if (xsd.length > 1) {
					if (xsd[1].length < 2) {
						value = value.toString() + "0";
					}
					return value;
				}
			},

			init: function () {
				reslist = ufma.getPermission();
				ufma.isShow(reslist);
				page.initPage();
				page.returnFloat
				$.timeOutRun(null, null, function () {
					page.drawAccDir(isOpposite);
				}, 300);
				ufma.parse();
				this.onEventListener();
			}

		}
	}();
	page.init();
})