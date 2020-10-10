$(function() {
	window._close = function(action) {
		if(window.closeOwner) {
			var data = {
				action: action
			}
			window.closeOwner(data);
		}
	};

	var page = function() {
		var oTable;
		var firstId, items, schId, billStatu, contentWSC, itemsYSC, contentYSC;
		var cashData, cashguid, cashBookGuid, rowdataId, rocash;
		var cashBookName ='暂未选择现金账簿';
		var resultObj = {};
		var bookrowData = {};
		var intdata;
		var  searchData ='';
		var tableData;
		var billTypeCodeData;
		var serachData = { // 修改为后端分页
			currentPage: 1,
			pageSize: 20,
		};
		var pageLength = ufma.dtPageLength('#vouGkdjTable');
		return {
			//动态获取标签
			initTabParent: function() {
				var argu = {
					agencyCode: window.ownerData.agencyCode,
					setYear: window.ownerData.setYear,
					rgCode: window.ownerData.rgCode
				}
				dm.getBillTabs(argu, function(result) {
					if(result.data.length > 0) {
						for(var i = 0; i < result.data.length; i++) {
							var schemeName = result.data[i].schemeName;
							var schemeGuid = result.data[i].schemeGuid;
							var billTypeCode = result.data[i].billTypeCode;
							var $ul = $('#tabParent');
							var $li = $('<li class=""></li>').appendTo($ul);
							var $anew = $('<a href="javascript:;" name="'+billTypeCode+'" id="' + schemeGuid + '">' + schemeName + '</a>').appendTo($li);
							$('#tabParent li').eq(0).addClass('active');
							schId = $('#tabParent .active a').attr('id');
							billTypeCodeData = $('#'+schId).attr('name'); //修改切换页签时出现billTypeCodeData不对应问题
						}
					}
					page.tableTile(schId);
					page.onEventListener();
				});
				
			},
			//获取现金账簿
			initBook: function() {
				var argu = {
					agencyCode: window.ownerData.agencyCode,
					accountbookType: "1"
				};
				dm.bookTake(argu, function(result) {
					ufma.showloading('正在加载数据，请耐心等待...');
					$('#cashBook').ufTreecombox({
						valueField: cashguid,
						idField: 'accountbookGuid',
						textField: 'accountbookName',
						readonly: false, //修改下拉框不支持删除选入内容问题--zsj--bug74261
						pIdField: 'pCode', //可选
						placeholder: '请选择现金账簿',
						data: result.data.list,
						onComplete: function(sender) {
							ufma.hideloading();
						},
						onChange: function(sender, data) {

						}
					});
				});
			},
			//动态获取表头
			tableTile: function() {
				var argu = {
					agencyCode: window.ownerData.agencyCode,
					setYear: window.ownerData.setYear,
					rgCode: window.ownerData.rgCode,
					billStatu: "N",
					schemeGuid: schId,
					search:searchData,
					accountbookGuid : window.ownerData.accountbookGuid,
					startDate: $("#startDate").getObj().getValue(),
					endDate: $("#endDate").getObj().getValue()
				}
				// 修改为后端分页
				pageLength = ufma.dtPageLength('#vouGkdjTable');
				argu.currentPage = parseInt(serachData.currentPage);
				argu.pageSize = parseInt(serachData.pageSize) ? parseInt(serachData.pageSize) : 99999999; // 没有值时查全部
				//查询后记录当前选择的行数信息到缓存
				localStorage.removeItem("vouGkdjPageSize");
				localStorage.setItem("vouGkdjPageSize", argu.pageSize);
				dm.getBillColumns(argu, function(result) {
					page.tableData = result.data;
					items = page.tableData.item;
					contentWSC = page.tableData.page.list;
					page.initGrid(items);
				});
			},
			//初始化table
			initGrid: function() {
				var tableId = 'vouGkdjTable';
				if(oTable) {
					oTable.fnDestroy();
				}
				$('#' + tableId).html('');
				var columns = [{
					//checkBox的选框
					title: '<label class="mt-checkbox mt-checkbox-single mt-checkbox-outline"> <input type="checkbox"' + 'class="datatable-group-checkable" id="check_H"/>&nbsp;<span></span> </label>',
					data: "tableId", //主键
					className: 'tc nowrap',
					"orderable": false,
					width: 40
				}];
				if(!$.isNull(items)) {
					for(var i = 0; i < items.length; i++) {
						intdata = items.length;
						var itemName = items[i].itemName;
						var eleCode = items[i].lpField;
						if(eleCode == "AMT01") {
							columns.push({
								title: itemName,
								data: eleCode,
								width: 200,
								className: 'tr nowrap',
								render: function(data, meta) {
									var val = $.formatMoney(data);
									return val == '0.00' ? '' : val;
								}
							})
						} else if(eleCode == 'CASHBOOKNAME') {
							columns.push({
								title: itemName,
								data: eleCode,
								width: 200,
								className: 'nowrap tc',
								render: function(rowid, rowdata, data, meta) {
									if(data == '' || data == null) {
										return '';
									} else if(cashBookName == '') {
										return data;
									} else {
										return data = cashBookName;
									}
								}
							});
						} else if(eleCode == 'CASHBOOKGUID') {
							columns.push({
								title: itemName,
								data: eleCode,
								width: 200,
								className: 'nowrap hide',
								render: function(rowid, rowdata, data, meta) {
									if(data == '' || data == null) {
										return '';
									} else {
										return data = cashBookGuid;

									}
								}
							});
						} else {
							columns.push({
								title: itemName,
								data: eleCode,
								width: 200,
								className: 'nowrap'
							});
						}
					}
				}
				columns.push({
					title: "操作",
					data: "",
					//width: 30,
					className: 'nowrap',
					render: function(rowid, rowdata, data, meta) {
						if(data == '' || data == null) {
							return '';
						} else {
							return "<a class='btn-book' rowid='" + meta.row + "' value='0' /> 请选择账簿  </a>";
						}
					}
				});
				var opts = {
					"language": {
						"url": bootPath + "agla-trd/datatables/datatable.default.js"
					},
					"autoWidth": false,
					"bDestory": true,
					"processing": true, //显示正在加载中
					"paging": false,
					"serverSide": false,
					"ordering": true,
					"scrollY": 180,
					columns: columns,
					//填充表格数据
					data: [],
					"dom": 'rt<"' + tableId + '-paginate"ilp>',
					"columnDefs": [{ //对列进行特殊操作---》适用于checkBox
							"targets": [0], //第一列
							"serchable": false,
							"orderable": false,
							"className": "nowrap",
							"render": function(data, type, rowdata, meta) {
								return "<label class='mt-checkbox mt-checkbox-single mt-checkbox-outline'> <input type='checkbox' name='chebox_right' class='check-all-W hide' index=" + meta.row + " value='0' /> &nbsp;<span></span> </label>";
							}
						}

					],
					initComplete: function(settings, json) {
						page.loadGridWSC(schId);
						page.loadGridWSC(contentWSC);
						var toolBar = $(this).attr('tool-bar')
						var $info = $(toolBar + ' .info');
						if($info.length == 0) {
							$info = $('<div class="info"></div>').appendTo($(toolBar + ' .tool-bar-body'));
						}
						$info.html('');
						$('.' + tableId + '-paginate').appendTo($info);
						$('#vouGkdjTable').closest('.dataTables_wrapper').ufScrollBar({
							hScrollbar: true,
							vScrollbar: true,
							mousewheel: false
						});
						var layoutH = $('.ufma-layout-up').height();
						var toolBarH = $('#tool-bar').height();
						// CWYXM-19512 出纳管理-登记出纳账，从国库生成，取数界面，按钮被覆盖 guohx 20200824 改动动态计算aaa区域的高度
						var aaaH = $('.aaa').height();
						var theadH = $(".ufma-table").find("thead").height();
						var margin = layoutH - toolBarH - aaaH - theadH - 8.5 - 1 - 8;
						$('#tool-bar').css("margin-top", margin + "px");
						$('.dataTables_scrollBody').css("height", margin - 8 + "px");
						$('.slider').css("top", margin + 25 + "px");
					},
					drawCallback: function(settings) {
						$("#vouGkdjTable_wrapper").find("th.sorting").css("padding-right", "20px");

						$('#vouGkdjTable').find("td.dataTables_empty").text("")
							.append('<img src="' + bootPath + 'images/noData.png"/><br/><i>目前还没有你要查询的数据</i>');
						$(".tableBox").css({
							"overflow-x": "scroll"
						});
						// 修改为后端分页
						if (!$.isNull(page.tableData.page)) {
							var paging = page.tableData.page;
							uf.backendPaging(paging, "vouGkdj", serachData);
						}
						ufma.isShow(page.reslist);
						ufma.setBarPos($(window));
					}
				}
				oTable = $("#" + tableId).dataTable(opts);

			},
			//加载未生成表格 数据
			loadGridWSC: function() {
				oTable.fnClearTable();
				$('#vouGkdjTable').closest('.dataTables_wrapper').ufScrollBar('destroy')
				if(contentWSC.length != 0){
					oTable.fnAddData(contentWSC, true);
				}
			},
			//获取已生成表头
			tableTileYSC: function() {
				var argu = {
					agencyCode: window.ownerData.agencyCode,
					setYear: window.ownerData.setYear,
					rgCode: window.ownerData.rgCode,
					billStatu: "Y",
					schemeGuid: schId,
					search:searchData,
					startDate: $("#startDate").getObj().getValue(),
					endDate: $("#endDate").getObj().getValue()
				}
				dm.getBillColumns(argu, function(result) {
					page.tableData = result.data;
					itemsYSC = page.tableData.item;
					contentYSC = page.tableData.page.list;
					page.initGridYSC(itemsYSC);
				})
			},
			//初始化已生成table
			initGridYSC: function() {
				var tableId = 'vouGkdjTable';
				if(oTable) {
					oTable.fnDestroy();
				}
				$('#' + tableId).html('');
				var columns = [{
					//checkBox的选框
					title: '<label class="mt-checkbox mt-checkbox-single mt-checkbox-outline"> <input type="checkbox"' + 'class="datatable-group-checkable" id="check_H"/>&nbsp;<span></span> </label>',
					data: "tableId", //主键
					className: 'tc nowrap',
					"orderable": false,
					width: 40
				}];
				if(!$.isNull(itemsYSC)) {
					for(var i = 0; i < itemsYSC.length; i++) {
						var itemName = itemsYSC[i].itemName;
						var eleCode = itemsYSC[i].lpField;
						if(eleCode == "AMT01") {
							columns.push({
								title: itemName,
								data: eleCode,
								className: 'tr nowrap',
								render: function(data, type, rowdata, meta) {
									var val = $.formatMoney(data);
									return val == '0.00' ? '' : val;
								}
							})
						} else if(eleCode == "BILL_GUID") {
							columns.push({
								title: itemName,
								data: eleCode,
								className: 'nowrap hide',
								"render": function(data, type, rowdata, meta) {
									var index = meta.row + 1
									return "<a class='viewData' data-index='" + JSON.stringify(rowdata) + "'>" + rowdata.BILL_GUID + "</a>";
								}
							})
						} else if(eleCode == 'CASHBOOKGUID') {
							columns.push({
								title: itemName,
								data: eleCode,
								className: 'nowrap hide'
							});
						} else {
							columns.push({
								title: itemName,
								data: eleCode,
								className: 'nowrap'
							})
						}
					}
				}
				var opts = {
					"language": {
						"url": bootPath + "agla-trd/datatables/datatable.default.js"
					},
					"autoWidth": false,
					"bDestory": true,
					"processing": true, //显示正在加载中
					"paging": false,
					"serverSide": false,
					"ordering": true,
					"scrollY": 180,
					columns: columns,
					//填充表格数据
					data: [],
					"dom": 'rt<"' + tableId + '-paginate"ilp>',
					"columnDefs": [{ //对列进行特殊操作---》适用于checkBox
						"targets": [0], //第一列
						"serchable": false,
						"orderable": false,
						"className": "nowrap",
						"render": function(data, type, rowdata, meta) {
							return "<label class='mt-checkbox mt-checkbox-single mt-checkbox-outline'> <input type='checkbox' name='chebox' class='check-all-Y' index=" + meta.row + " value='0' /> &nbsp;<span></span> </label>";
						}
					}],
					initComplete: function(settings, json) {
						page.loadGridYSC(schId);
						page.loadGridYSC(contentYSC);
						var toolBar = $(this).attr('tool-bar')
						var $info = $(toolBar + ' .info');
						if($info.length == 0) {
							$info = $('<div class="info"></div>').appendTo($(toolBar + ' .tool-bar-body'));
						}
						$info.html('');
						$('.' + tableId + '-paginate').appendTo($info);
						$('#vouGkdjTable').closest('.dataTables_wrapper').ufScrollBar({
							hScrollbar: true,
							vScrollbar: true,
							mousewheel: false
						});
						//guohx 20200707 将页面改为驻底 高度自动计算
						var layoutH = $('.ufma-layout-up').height();
						var toolBarH = $('#tool-bar').height();
						var aaaH = $('.aaa').height();
						var theadH = $(".ufma-table").find("thead").height();
						var margin = layoutH - toolBarH - aaaH - theadH - 8.5 - 1 - 8;
						$('#tool-bar').css("margin-top", margin + "px");
						$('.dataTables_scrollBody').css("height", margin - 8 + "px");
						$('.slider').css("top", margin + 25 + "px");
					},
					drawCallback: function(settings) {
						$("#vouGkdjTable_wrapper").find("th.sorting").css("padding-right", "20px");
						$('#vouGkdjTable').find("td.dataTables_empty").text("")
							.append('<img src="' + bootPath + 'images/noData.png"/><br/><i>目前还没有你要查询的数据</i>');
						$(".tableBox").css({
							"overflow-x": "scroll"
						});
						// 修改为后端分页
						if (!$.isNull(page.tableData.page)) {
							var paging = page.tableData.page;
							uf.backendPaging(paging, "vouGkdj", serachData);
						}
						ufma.isShow(page.reslist);
						ufma.setBarPos($(window));
					}
				}
				oTable = $("#" + tableId).dataTable(opts);
			},
			//加载已生成数据
			loadGridYSC: function () {
				oTable.fnClearTable();
				if (contentYSC.length != 0) {
					oTable.fnAddData(contentYSC, true);
				}
				ufma.setBarPos($(window));
			},
			//获取未生成选择的数据 
			getCheckedRowsWSC: function() {
				var checkedArrayWSC = [];
				$("#vouGkdjTable_wrapper").find('input.check-all-W:checked').each(function() {
					checkedArrayWSC.push($(this).val());
				});
				return checkedArrayWSC;
			},
			//获取已生成选择数据
			getCheckedRowsYSC: function() {
				var checkedArrayYSC = [];
				$("#vouGkdjTable_wrapper").find('input.check-all-Y:checked').each(function() {
					checkedArrayYSC.push($(this).val());
				});
				return checkedArrayYSC;
			},
			//获取表格数据 guohx 
			loadGrid: function () {
				schId = $('#tabParent .active a').attr('id');
				scid = $('#tabAcce .active a').attr('id');
				billTypeCodeData = '';
				billTypeCodeData = $('#' + schId).attr('name'); //修改切换页签时出现billTypeCodeData不对应问题
				if (scid == 'wscBtn') {
					$('#txt').val('');
					$('#btnBuild').removeClass("hide");
					$('#btnCancleBuild').addClass("hide");
					page.tableTile(schId);
				} else if (scid == 'yscBtn') {
					$('#txt').val('');
					$('#btnCancleBuild').removeClass("hide");
					$('#btnBuild').addClass("hide");
					page.tableTileYSC(schId);
				}
			},
			//监听
			onEventListener: function() {
				//切换页签时默认选择未生成，然后刷新界面
				$('#tabParent li a').on('click', function (e) {
					e.preventDefault();
					schId = $(this).attr('id');
					scid = $('#tabAcce .active a').attr('id');
					billTypeCodeData = '';
					billTypeCodeData = $('#' + schId).attr('name'); //修改切换页签时出现billTypeCodeData不对应问题
					if (scid == 'wscBtn') {
						$('#txt').val('');
						$('#btnBuild').removeClass("hide");
						$('#btnCancleBuild').addClass("hide");
						page.tableTile(schId);
					} else if (scid == 'yscBtn') {
						$('#txt').val('');
						$('#btnCancleBuild').removeClass("hide");
						$('#btnBuild').addClass("hide");
						page.tableTileYSC(schId);
					}
				});
				$('#tabAcce li a').click(function (e) {
					e.preventDefault();
					schId = $('#tabParent .active a').attr('id');
					if ($(this).attr('id') == 'wscBtn') {
						$('#txt').val('');
						$('#btnBuild').removeClass("hide");
						$('#btnCancleBuild').addClass("hide");
						page.tableTile(schId);
					} else if ($(this).attr('id') == 'yscBtn') {
						$('#txt').val('');
						$('#btnCancleBuild').removeClass("hide");
						$('#btnBuild').addClass("hide");
						page.tableTileYSC(schId);
					}
				});  
				//行操作，选择现金账簿
				$(document).on('click', function(e) {
					var rowid = $(e.target).attr('rowid');
					if(!rowid) {
						return null;
					} else {
						$(e.target).addClass('active');
					}
					if($(e.target).is('.btn-book')) {
						rowdataId = rowid;
						page.model = ufma.showModal('saveMethod-box', 400, 280);
						page.initBook();
					}
				});
				//点击账簿选择确定按钮
				$('#sureChose').on('click', function() {
					cashBookGuid = $('#cashBook').getObj().getValue();
					cashBookName = $('#cashBook').getObj().getItem().accountbookName;
					page.model.close();
					oTable.fnUpdate(cashBookName, rowdataId, intdata, 0, 0); //修改指定单元格的值，参数为：需要填充的值，行，列，0或1（0：刷新表格；1：不刷新表格）
					oTable.fnUpdate(cashBookGuid, rowdataId, intdata - 1, 0, 0);

				});
				//全选			
				$("body").on("click", 'input#check_H', function() {
					var flag = $(this).prop("checked");
					$("#vouGkdjTable_wrapper").find('input.check-all-W').prop('checked', flag);
				});
				$("body").on("click", 'input.check-all-W', function() {
					var num = 0;
					var arr = document.querySelectorAll('.check-all-W')
					for(var i = 0; i < arr.length; i++) {
						if(arr[i].checked) {
							num++
						}
					}
					if(num == arr.length) {
						$("#check_H").prop('checked', true)
					} else {
						$("#check_H").prop('checked', false)
					}
				});
				//全选			
				$("body").on("click", 'input#check_H', function() {
					var flag = $(this).prop("checked");
					$("#vouGkdjTable_wrapper").find('input.check-all-Y').prop('checked', flag);
				});
				$("body").on("click", 'input.check-all-Y', function() {
					var num = 0;
					var arr = document.querySelectorAll('.check-all-Y')
					for(var i = 0; i < arr.length; i++) {
						if(arr[i].checked) {
							num++
						}
					}
					if(num == arr.length) {
						$("#check_H").prop('checked', true)
					} else {
						$("#check_H").prop('checked', false)
					}
				});
				//生成
				$('#btnBuild').on('click', function () {
					//bug78804--zsj
					//$("#btnBuild").attr("disabled", true);
					var arrChecked = page.getCheckedRowsWSC();
					var rowData = {};
					var userData = {
						"agencyCode": window.ownerData.agencyCode,
						"setYear": window.ownerData.setYear,
						"rgCode": window.ownerData.rgCode,
						"acctCode": window.ownerData.acctCode,
						"accountBookGuid": window.ownerData.accountbookGuid,
						"accountBookType": window.ownerData.accountBookType,
						"accoCode": window.ownerData.accoCode,
						"userId": window.ownerData.userId,
						"userName": window.ownerData.userName,
						"billTypeCode":billTypeCodeData
					};

					var argu = {
						userData: userData,
						item: items,
						content: []
					}
					if(arrChecked.length > 0) {
						$('#vouGkdjTable_wrapper').find('input.check-all-W:checked').each(function() {
							var rowIndex = $(this).attr('index');
							if(rowIndex) {
								rowData = oTable.api(false).row(rowIndex).data();
								rowData.CASHBOOKGUID = $(this).closest("tr").find("td").eq((intdata-1)).text(); //获取当前显示表格中的单元格值
								rowData.CASHBOOKNAME = $(this).closest("tr").find("td").eq(intdata).text(); //获取当前显示表格中的单元格值
							}
							argu.content.push(rowData);
						});
						ufma.showloading('正在生成出纳账，请耐心等待...');
						dm.getBillBuild(argu, function (result) { //生成
							if (result.flag = "success") {
								ufma.hideloading();
								ufma.showTip(result.msg, function () { }, 'success');
								page.tableTile();
								cashBookName = '暂未选择现金账簿';
							}
						});
					} else {
						ufma.alert('请至少选择一条数据！', "warning");
						return false;
					}
					/*var timeId = setTimeout(function () {
						$("#btnBuild").attr("disabled", false);
						clearTimeout(timeId);
					}, 5000);*/
				});
				//取消生成
				$('#btnCancleBuild').on('click', function() {
					var delDt = [];
					$("#vouGkdjTable tbody tr").each(function(index, row) {
						var $chk = $(this).find("input[type='checkbox']");
						if($chk.is(":checked") == true) {
							//配合后端修改该参数 原来为bill_guid guohx 20200825
							var jouGuid = JSON.parse($(this).find('.viewData').attr('data-index')).BILL_NO;
							delDt[delDt.length] = jouGuid;
						}
					});
					if(delDt.length == 0) {
						ufma.showTip(result.msg, function() {}, 'warning');
						return false;
					} else {
						var argu = {
							agencyCode: window.ownerData.agencyCode,
							setYear: window.ownerData.setYear,
							rgCode: window.ownerData.rgCode,
							billGuids: delDt
						};
						dm.getBillDelete(argu, function(result) { // 取消生成
							if(result.flag = "success") {
								ufma.showTip('取消生成成功', function() {}, 'success');
								page.tableTileYSC();
							}
						});
					}
				});
				$('#btnClose').on('click', function() {
					_close();
				});
				$('.btn-close').on('click', function() {
					page.model.close();
				});
				//搜索
				$(function() {
					$("#btn").click(function() {
						var inputAll = $('#txt').val();
						searchData = inputAll;
					 if($('#wscBtnli').hasClass('active')){
					 	page.tableTile();
					 	searchData = '';
					 }else if($('#yscBtnli').hasClass('active')){
					 	page.tableTileYSC();
					 	searchData = '';
					 }
					});
				});
				$('#txt').bind('keypress', function(event) {
					if(event.keyCode == "13") {
						$("#btn").click();
					}
				})
				// 修改为后端分页
				//分页尺寸下拉发生改变
				$(".ufma-table-paginate").on("change", ".vbPageSize", function () {
					pageLength = ufma.dtPageLength('#gridGOV', $(".ufma-table-paginate").find(".vbPageSize").val());
					serachData.pageSize = $(".ufma-table-paginate").find(".vbPageSize").val();
					$(".vbDataSum").html("");
					$("#gridGOV tbody").html('');
					$("#tool-bar .slider").remove();
					$(".ufma-table-paginate").html("");
					page.loadGrid();
				});

				//点击页数按钮
				$(".ufma-table-paginate").on("click", ".vbNumPage", function () {
					if ($(this).find("a").length != 0) {
						serachData.currentPage = $(this).find("a").attr("data-gopage");
						serachData.pageSize = $(".ufma-table-paginate").find(".vbPageSize").val();
						$(".vbDataSum").html("");
						$("#gridGOV tbody").html('');
						$("#tool-bar .slider").remove();
						$(".ufma-table-paginate").html("");
						page.loadGrid();
					}
				});

				//点击上一页
				$(".ufma-table-paginate").on("click", ".vbPrevPage", function () {
					if (!$(".ufma-table-paginate .vbPrevPage").hasClass("disabled")) {
						serachData.currentPage = $(this).find("a").attr("data-prevpage");
						serachData.pageSize = $(".ufma-table-paginate").find(".vbPageSize").val();
						$(".vbDataSum").html("");
						$("#gridGOV tbody").html('');
						$("#tool-bar .slider").remove();
						$(".ufma-table-paginate").html("");
						page.loadGrid();
					}
				});

				//点击下一页
				$(".ufma-table-paginate").on("click", ".vbNextPage", function () {
					if (!$(".ufma-table-paginate .vbNextPage").hasClass("disabled")) {
						serachData.currentPage = $(this).find("a").attr("data-nextpage");
						serachData.pageSize = $(".ufma-table-paginate").find(".vbPageSize").val();
						$(".vbDataSum").html("");
						$("#gridGOV tbody").html('');
						$(".ufma-tool-btns").html('');
						$(".ufma-table-paginate").html("");
						page.loadGrid();
					}
				});
			},
			//初始化页面
			initPage: function() {
				page.reslist = ufma.getPermission();
				ufma.isShow(page.reslist);
				ufma.showloading('正在加载数据，请耐心等待...');
				$('#startDate').ufDatepicker({
					format: 'yyyy-mm-dd',
					initialDate: window.ownerData.startDate,
					onChange: function () {
						page.loadGrid();
					}
				});
				$('#endDate').ufDatepicker({
					format: 'yyyy-mm-dd',
					initialDate: window.ownerData.endDate,
					onChange: function () {
						page.loadGrid();
					}
				});
				page.initTabParent();
				ufma.hideloading();
				$.fn.dataTable.ext.errMode = 'none';
			},
			init: function() {
				//获取session
				ptData = ufma.getCommonData(); //平台的缓存数据
				this.initPage();
				// 初始化时取缓存中记录的行数信息
				serachData.pageSize = parseInt(localStorage.getItem("vouGkdjPageSize")) ? parseInt(localStorage.getItem("vouGkdjPageSize")) : 20;
				ufma.parse();
				ufma.parseScroll();
				//this.onEventListener();

			}
		}
	}();
	page.init();
});