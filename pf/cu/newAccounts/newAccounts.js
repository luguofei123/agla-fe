$(function() {
	var page = function() {
		var pageData = {
			agencyCode: '',
			bgplanData: '',
			tblDt: '',
			tabData: [],
			bgPlanCode: ''
		}
		var rowTableData = {};
		var oTableChack, oTableCarrry, oTableCarrryItems;
		var pageLengthChack = ufma.dtPageLength('#oTableChack');
		var pageLengthCarrry = ufma.dtPageLength('#oTableCarrry');
		var pageLengthCarrryItems = ufma.dtPageLength('#oTableCarrryItems');
		var pageLength = ufma.dtPageLength('#gridGOV'); //分页
		var accountbookGuids = [];
		var serachData = { // 修改为后端分页
			currentPage: 1,
			pageSize: 20,
		};
		var tableData;
		return {
			//初始化单位
			initAgencyScc: function() {
				page.cbAgency = $('#cbAgency').ufmaTreecombox2({
					valueField: 'id', //可选
					textField: 'codeName', //可选
					readonly: false,
					pIdField: 'pId', //可选
					placeholder: '请选择单位',
					icon: 'icon-unit',
					theme: 'label',
					leafRequire: true,
					onchange: function(data) {
						agencyCode = data.id;
						agencyName = data.name;
						var params = {
							selAgecncyCode: agencyCode,
							selAgecncyName: agencyName
						}
						ufma.setSelectedVar(params);
						page.checkNeedAcct();
						$('#onePage').removeClass('hide');

					}
				});
				ufma.ajaxDef(dm.getCtrl('agency') + "?setYear=" + pfData.svSetYear + "&rgCode=" + pfData.svRgCode, "get", "", function(result) {
					page.cbAgency = $("#cbAgency").ufmaTreecombox2({
						data: result.data
					});
					var agyCode = $.inArrayJson(result.data, "id", pfData.svAgencyCode);
					if(agyCode != undefined) {
						page.cbAgency.val(pfData.svAgencyCode);
					} else {
						page.cbAgency.val(result.data[0].id);
					}
				});
			},
			clearTimeLine: function() {
				$('#zdzzTimeline').html('');
				page.timeline = $('#zdzzTimeline').ufmaTimeline([{
					step: '数据检查',
					target: 'zdzj'
				}, {
					step: '结转处理',
					target: 'savemb'
				}, {
					step: '完成',
					target: 'setend'
				}]);
				$('#btnPrev').addClass('hide');
			},
			//加载表格
			initCheckTable: function() {
				if(oTableChack) {
					pageLengthCarrry = ufma.dtPageLength('#dataCheck');
					oTableChack.fnDestroy();
				}
				var tblId = 'dataCheck';
				$("#" + tblId).html(''); //清空原有表格
				var columns = [{
						data: "ACCOUNTBOOK_NAME",
						title: "账簿",
						className: "tc nowrap",
						width: "200px"
					},
					{
						data: "isOk",
						title: "检查结果",
						className: "nowrap detailInfo tl ellipsis",
						width: "100px",
						render: function(data, type, rowdata, meta) {
							return data ? '通过' : '不通过';
						}
					}, {
						data: "msg",
						title: "详细信息",
						className: "nowrap detailInfo tl ellipsis",
						width: "200px",
						"render": function(data, type, rowdata, meta) {
							return '<span title="' + data + '">' + data + '</span>';

						}
					}
				];
				var opts = {
					"language": {
						"url": bootPath + "agla-trd/datatables/datatable.default.js"
					},
					"bFilter": true,
					"bAutoWidth": false,
					"bDestory": true,
					"processing": true, //显示正在加载中
					"pagingType": "full_numbers", //分页样式
					"lengthChange": true, //是否允许用户自定义显示数量p
					"lengthMenu": [
						[10, 20, 50, 100, 200, -1],
						[10, 20, 50, 100, 200, "全部"]
					],
					"serverSide": false,
					"ordering": false,
					"pageLength": pageLengthChack,
					"columns": columns,
					//填充表格数据
					data: [],
					"dom": 'rt',
					initComplete: function(settings, json) {
						ufma.isShow(reslist);
					},
					drawCallback: function(settings) {
						$('#dataCheck').find("td.dataTables_empty").text("")
							.append('<img src="' + bootPath + 'images/noData.png"/><br/><i>目前还没有你要查询的数据</i>');
						ufma.isShow(reslist);
					}
				}
				oTableChack = $("#" + tblId).dataTable(opts); //用于存储dataTable返回的信息
			},
			//获取结转处理表格数据
			showTblData: function() {
				ufma.showloading('数据加载中，请耐心等待...');
				var arguAge = {
					agencyCode: agencyCode,
					setYear: pfData.svSetYear,
					rgCode: pfData.svRgCode,
					accountbookGuids: accountbookGuids
				}
				if(isNeedAcct) {
					arguAge.acctCode = acctCode;
				}
				dm.doPost("yearInit", arguAge, function(result) {
					ufma.hideloading();
					oTableCarrry.fnClearTable();
					if(!$.isNull(result.data) && result.data.length > 0) {
						oTableCarrry.fnAddData(result.data, true);
					}
				})
			},
			getColumns: function() {
				rowTableData = {};
				var columns = [];
				columns = [{
						title: '<label class="mt-checkbox mt-checkbox-single mt-checkbox-outline"> <input type="checkbox"' + 'class="datatable-group-checkable" id="check-head"/>&nbsp;<span></span> </label>',
						width: 36,
						className: 'nowrap no-print text-center',
						render: function(data, type, rowdata, meta) {
							return "<label class='mt-checkbox mt-checkbox-single mt-checkbox-outline'> <input type='checkbox' class='check-all' index=" + meta.row + " value='0' /> &nbsp;<span></span> </label>";
						}
					},
					{
						title: "账簿",
						data: "ACCOUNTBOOK_NAME",
						className: 'nowrap isprint',
						"render": function(data, type, rowdata, meta) {
							var index = meta.row + 1;
							if($.isNull(rowTableData[rowdata.ACCOUNTBOOK_GUID])) {
								rowTableData[rowdata.ACCOUNTBOOK_GUID] = rowdata;
							}
							return "<a class='viewData under-line common-jump-link' data-index='" + rowdata.ACCOUNTBOOK_GUID + "'>" + rowdata.ACCOUNTBOOK_NAME + "</a>";
						}
					},
					{
						title: "账簿类型",
						data: "ACCOUNTBOOK_TYPE_NAME",
						className: 'nowrap tc isprint'
					},
					{
						title: "币种",
						data: "CUR_NAME",
						className: 'nowrap tc isprint',
						width: 100
					}
				];
				columns.push({
					title: "账套",
					data: 'ACCT_NAME',
					className: 'nowrap  isprint',
					width: 44
				});
				columns.push({
					title: "科目",
					data: "ACCO_NAME",
					className: 'nowrap isprint'
				});
				columns.push({
					title: "上级账簿",
					data: 'PARENT_NAME',
					className: 'nowrap  isprint'
				});
				columns.push({
					title: "期末余额",
					data: 'BAL_AMT',
					className: 'nowrap tr isprint',
					render: $.fn.dataTable.render.number(',', '.', 2, ''),
					render: function(data, type, rowdata, meta) {
						var val = $.formatMoney(data);
						return val == 0 ? '' : val;
					}
				});
				return columns;
			},
			initGrid: function(data) {
				var columns = page.getColumns();
				oTable = $("#gridGOV").dataTable({
					"language": {
						"url": bootPath + "agla-trd/datatables/datatable.default.js"
					},
					"autoWidth": false,
					"bDestory": true,
					"processing": true, //显示正在加载中
					// "pagingType": "full_numbers", //分页样式
					// "lengthChange": true, //是否允许用户自定义显示数量p
					// "lengthMenu": [
					// 	[10, 20, 50, 100, 200, -1],
					// 	[10, 20, 50, 100, 200, "全部"]
					// ],
					// "pageLength": ufma.dtPageLength("#gridGOV"),
					"paging": false,
					"serverSide": false,
					"ordering": false,
					"columns": columns,
					//填充表格数据
					"data": data,
					"dom": 'rt<"gridGOV-paginate"ilp>',
					"initComplete": function(settings, json) {
						var toolBar = $(this).attr('tool-bar')
						var $info = $(toolBar + ' .info');
						if($info.length == 0) {
							$info = $('<div class="info"></div>').appendTo($(toolBar + ' .tool-bar-body'));
						}
						$info.html('');
						$('.gridGOV-paginate').appendTo($info);
						$('#gridGOV').closest('.dataTables_wrapper').ufScrollBar({
							hScrollbar: true,
							mousewheel: false
						});
						ufma.setBarPos($(window));
						ufma.isShow(page.reslist);
					},
					"drawCallback": function() {
						$('#gridGOV').find("td.dataTables_empty").text("")
							.append('<img src="' + bootPath + 'images/noData.png"/><br/><i>目前还没有你要查询的数据</i>');
						ufma.setBarPos($(window));
						$("#check-head").prop('checked', false)
						$("#all").prop('checked', false);
						ufma.isShow(page.reslist);
						// 修改为后端分页
						if(!$.isNull(page.tableData)){
							var paging = page.tableData;
							uf.backendPaging(paging,"newAccounts",serachData);
						}
					}
				});
			},
			//获取表格数据
			loadGrid: function() {
				var argu = {
					agencyCode: agencyCode,
					setYear: pfData.svSetYear,
					rgCode: pfData.svRgCode
				};
				if(isNeedAcct) {
					argu.acctCode = acctCode;
				}
				// 修改为后端分页
				pageLength = ufma.dtPageLength('#gridGOV');
				argu.currentPage = parseInt(serachData.currentPage);
				argu.pageSize = parseInt(serachData.pageSize) ? parseInt(serachData.pageSize) : 99999999; // 没有值时查全部
				//查询后记录当前选择的行数信息到缓存
				localStorage.removeItem("newAccountsPageSize");
				localStorage.setItem("newAccountsPageSize", argu.pageSize);
				dm.loadGridData(argu, function(result) {
					$('#gridGOV_wrapper').ufScrollBar('destroy'); //动态销毁表格前要先销毁滚动条,否则滚动条无效
					$("#gridGOV").dataTable().fnDestroy();
					$("#gridGOV").html(''); //guohx 先清空动态加载列     此处代码后面必须重新初始化表头 直接addData不生效
					page.tableData = result.data;
					page.initGrid(result.data.list);
				});
			},
			//获取系统选项-各界面需选择账套
			checkNeedAcct: function() {
				//ufma.get("/cu/sysRgpara/getBooleanByChrCode/CU002", {}, function (result) {
				ufma.get("/cu/sysRgpara/getBooleanByChrCode/CU002" + "/" + agencyCode, {}, function(result) { //CWYXM-11399 --系统管理-系统选项，出纳是否显示账套，设置为单位级控制，但仍然是由系统级控制--zsj
					isNeedAcct = result.data;
					if(isNeedAcct) {
						$("#acct").removeClass("hide");
						$("#cbAcct").ufCombox({
							idField: 'code',
							textField: 'codeName',
							readonly: false,
							placeholder: '请选择账套',
							icon: 'icon-book',
							theme: 'label',
							onChange: function(sender, data) {
								acctCode = $('#cbAcct').getObj().getValue();
								acctName = $('#cbAcct').getObj().getText();

								var params = {
									selAgecncyCode: agencyCode,
									selAgecncyName: agencyName,
									selAcctCode: acctCode,
									selAcctName: acctName
								}
								ufma.setSelectedVar(params);
								page.initGrid();
								page.loadGrid();
							},
							onComplete: function(sender) {
								if(pfData.svAcctCode) {
									$("#cbAcct").getObj().val(pfData.svAcctCode);
								} else {
									$('#cbAcct').getObj().val('1');
								}
								ufma.hideloading();
							}
						});
						var argu = {
							agencyCode: agencyCode,
							setYear: pfData.svSetYear
						}
						callback = function(result) {
							$("#cbAcct").getObj().load(result.data);
						}
						ufma.get("/cu/common/eleCoacc/getCoCoaccs/" + agencyCode, argu, callback);

					} else {
						$("#acct").addClass("hide");
						page.initGrid();
						page.loadGrid();
					}

				});
			},
			//初始化结转处理表格
			initCarryTable: function() {
				if(oTableCarrry) {
					pageLengthCarrry = ufma.dtPageLength('#carryOver');
					//				    /$('#carryOver').closest('.dataTables_wrapper').ufScrollBar('destroy');
					oTableCarrry.fnDestroy();
				}
				var tblId = 'carryOver';
				$("#" + tblId).html(''); //清空原有表格
				var columns = [{
					data: "ACCOUNTBOOK_NAME",
					title: "账簿",
					className: "tc nowrap",
					width: 50,

				}];
				columns.push({
					data: 'isOk',
					title: '结转结果',
					className: 'nowrap isprint tc',
					width: 100,
					render: function(data, type, rowdata, meta) {
						return data ? '结转成功' : '结转中断';
					}
				});
				columns.push({
					data: 'msg',
					title: '详细信息',
					className: 'nowrap isprint ',
					width: 120
				});
				oTableCarrry = $("#" + tblId).dataTable({
					"language": {
						"url": bootPath + "agla-trd/datatables/datatable.default.js"
					},
					//"bFilter": true,
					"autoWidth": false,
					"bDestory": true,
					"processing": true, //显示正在加载中
					"pagingType": "full_numbers", //分页样式
					"lengthChange": true, //是否允许用户自定义显示数量p
					"lengthMenu": [
						[20, 50, 100, 200, -1],
						[20, 50, 100, 200, "全部"]
					],
					//"pageLength": 100, //默认每页显示100条--zsj--吉林公安需求
					"pageLength": ufma.dtPageLength("#" + tblId),
					"serverSide": false,
					"ordering": false,
					columns: columns,
					//填充表格数据
					data: [],
					"dom": "rt",
					initComplete: function(settings, json) {
						$('.carryDownCurInput').amtInputNull();
						ufma.isShow(reslist);
						//固定表头
						$("#carryOver").fixedTableHead();
					},
					drawCallback: function(settings) {
						$('#carryOver').find("td.dataTables_empty").text("")
							.append('<img src="' + bootPath + 'images/noData.png"/><br/><i>目前还没有你要查询的数据</i>');
						ufma.isShow(reslist);
						ufma.setBarPos($(window));
						var wrapperWidth = $('#carryOver_wrapper').width();
						var tableWidth = $('#carryOver').width();
						if(tableWidth > wrapperWidth) {
							$('#carryOver').closest('.dataTables_wrapper').ufScrollBar({
								hScrollbar: true,
								mousewheel: false
							});
							ufma.setBarPos($(window));
							$('.dataTables_wrapper.no-footer .dataTables_scrollBody').css("border-bottom", "1px solid transparent")
						} else {
							$('#carryOver').closest('.dataTables_wrapper').ufScrollBar('destroy');
							$('.dataTables_wrapper.no-footer .dataTables_scrollBody').css("border-bottom", "1px solid transparent")
						}
					}
				})
				//oTableCarrry = $("#" + tblId).dataTable(opts); //用于存储dataTable返回的信息
			},
			//初始化结转处理表格
			initCarryItemsTable: function(data) {
				if(oTableCarrryItems) {
					pageLengthCarrryItems = ufma.dtPageLength('#carryItems');
					oTableCarrryItems.fnDestroy();
				}
				var tblId = 'carryItems';
				$("#" + tblId).html(''); //清空原有表格
				var columns = [{
					data: "schemaName",
					title: "对账方案",
					className: "tc nowrap",
					width: 50,

				}];
				columns.push({
					data: 'isOk',
					title: '结转结果',
					className: 'nowrap isprint tc',
					width: 100,
					render: function(data, type, rowdata, meta) {
						return data ? '结转成功' : '结转中断';
					}
				});
				columns.push({
					data: 'msg',
					title: '详细信息',
					className: 'nowrap isprint ',
					width: 120
				});
				oTableCarrryItems = $("#" + tblId).dataTable({
					"language": {
						"url": bootPath + "agla-trd/datatables/datatable.default.js"
					},
					//"bFilter": true,
					"autoWidth": false,
					"bDestory": true,
					"processing": true, //显示正在加载中
					"pagingType": "full_numbers", //分页样式
					"lengthChange": true, //是否允许用户自定义显示数量p
					"lengthMenu": [
						[20, 50, 100, 200, -1],
						[20, 50, 100, 200, "全部"]
					],
					//"pageLength": 100, //默认每页显示100条--zsj--吉林公安需求
					"pageLength": ufma.dtPageLength("#" + tblId),
					"serverSide": false,
					"ordering": false,
					columns: columns,
					//填充表格数据
					data: data,
					"dom": "rt",
					initComplete: function(settings, json) {
						$('.carryDownCurInput').amtInputNull();
						ufma.isShow(reslist);
						//固定表头
						$("#carryItems").fixedTableHead();
					},
					drawCallback: function(settings) {
						$('#carryItems').find("td.dataTables_empty").text("")
							.append('<img src="' + bootPath + 'images/noData.png"/><br/><i>目前还没有你要查询的数据</i>');
						ufma.isShow(reslist);
						ufma.setBarPos($(window));
						var wrapperWidth = $('#carryItems_wrapper').width();
						var tableWidth = $('#carryItems').width();
						if(tableWidth > wrapperWidth) {
							$('#carryItems').closest('.dataTables_wrapper').ufScrollBar({
								hScrollbar: true,
								mousewheel: false
							});
							ufma.setBarPos($(window));
							$('.dataTables_wrapper.no-footer .dataTables_scrollBody').css("border-bottom", "1px solid transparent")
						} else {
							$('#carryItems').closest('.dataTables_wrapper').ufScrollBar('destroy');
							$('.dataTables_wrapper.no-footer .dataTables_scrollBody').css("border-bottom", "1px solid transparent")
						}
						page.timeline.next();
					}
				})
				//oTableCarrry = $("#" + tblId).dataTable(opts); //用于存储dataTable返回的信息
			},
			onEventListener: function() {
				//点击开始年结：隐藏onePage
				$('#beginEnd').on('click', function() {
					accountbookGuids = [];
					$("#gridGOV tbody tr").each(function(index, row) {
						var $chk = $(this).find("input[type='checkbox']");
						if($chk.is(":checked") == true) {
							var tempIndex = $(this).find('.viewData').attr('data-index');
							var tempData = rowTableData[tempIndex];
							var accountbookGuid = tempData.ACCOUNTBOOK_GUID;
							accountbookGuids[accountbookGuids.length] = accountbookGuid;
						}
					});

					var arguAge = {
						agencyCode: agencyCode,
						setYear: pfData.svSetYear,
						rgCode: pfData.svRgCode,
						accountbookGuids: accountbookGuids
					}
					if(isNeedAcct) {
						arguAge.acctCode = acctCode;
					}
					ufma.showloading('数据加载中，请耐心等待...');
					dm.doPost("dataCheck", arguAge, function(result) {
						ufma.hideloading();
						if(result.flag == 'fail') {
							return false;
						} else {
							$('#onePage').addClass('hide');
							$('#tool-bar').addClass('hide');
							$('#zdzzTimeline').removeClass('hide');
							$('#dataCheckArea').removeClass('hide');
							$('#cbAgency').getObj().setEnabled(false);
							$('#cbAgency').attr('disabled', true);
							page.clickBtn = 'beginEnd';
							page.initCheckTable();
							oTableChack.fnClearTable();
							if(result.data.length != 0) {
								for(var i = 0; i < result.data.length; i++) {
									page.checkTableData = result.data;
									oTableChack.fnAddData(result.data[i], true)
								}
							}
							page.clearTimeLine();
							page.disableFlag = true;
						}
					});

				});
				//结转未达项
				$('#carryItem').on('click', function() {
					var arguAge = {
						agencyCode: agencyCode,
						setYear: pfData.svSetYear,
					}
					ufma.showloading('结转未达项中，请耐心等待...');
					dm.doPost("carryItems", arguAge, function(result) {
						ufma.hideloading();
						if(result.flag == 'fail') {
							return false;
						} else {
							//CWYXM-9867 出纳管理-生成新年度账,结转未达项的进度界面，进度条需修改为完成状态--zsj
							$('#zdzzTimeline').removeClass('hide');
							page.clearTimeLine();
							page.timeline.next();
							$('#onePage').addClass('hide');
							$('#tool-bar').addClass('hide');
							$('#cbAgency').getObj().setEnabled(false);
							$('#cbAgency').attr('disabled', true);
							page.clickBtn = 'beginEnd';
							page.initCarryItemsTable(result.data);
							page.disableFlag = true;
						}
					});

				});
				//点击检查界面的下一步
				$('#dataCheckNext').on('click', function() {
					$('#cbAgency').getObj().setEnabled(false);
					$('#onePage').addClass('hide');
					$('#dataCheckArea').addClass('hide');
					$('#tool-bar').addClass('hide');
					$('#carryOverArea').removeClass('hide');
					$('#carryItemsArea').addClass('hide');
					//CWYXM-9867 出纳管理-生成新年度账,结转未达项的进度界面，进度条需修改为完成状态--zsj
					page.timeline.next();
					page.timeline.next();
					page.initCarryTable();
					page.showTblData();
				});
				//点击检查界面的上一步
				$('#dataCheckCancel').on('click', function() {
					$('#onePage').removeClass('hide');
					$('#dataCheckArea').addClass('hide');
					$('#carryOverArea').addClass('hide');
					$('#carryItemsArea').addClass('hide');
					$('#cbAgency').getObj().setEnabled(true);
					//$('#cbAgency').removeAttr('disabled');
					$('#zdzzTimeline').addClass('hide');
					$('#tool-bar').removeClass('hide');
					page.clearTimeLine();
					accountbookGuids = [];
				});
				//点击结转未达项
				$('#carryItem').on('click', function() {
					$('#cbAgency').getObj().setEnabled(false);
					$('#onePage').addClass('hide');
					$('#dataCheckArea').addClass('hide');
					$('#tool-bar').addClass('hide');
					$('#carryOverArea').addClass('hide');
					$('#carryItemsArea').removeClass('hide');
					page.timeline.next();
					page.timeline.next();
					page.initCarryTable();
					// page.showTblData();
				});
				//点击完成
				$('#carryOverCancel').on('click', function() {
					page.initGrid();
					page.loadGrid();
					$('#onePage').removeClass('hide');
					$('#dataCheckArea').addClass('hide');
					$('#carryOverArea').addClass('hide');
					$('#carryItemsArea').addClass('hide');
					$('#cbAgency').getObj().setEnabled(true);
					$('#zdzzTimeline').addClass('hide');
					$('#tool-bar').removeClass('hide');
					page.disableFlag = false;
					page.clearTimeLine();
					accountbookGuids = [];
				});
				//点击结转未达项完成
				$('#carryItemsCancel').on('click', function() {
					page.initGrid();
					page.loadGrid();
					$('#onePage').removeClass('hide');
					$('#dataCheckArea').addClass('hide');
					$('#carryOverArea').addClass('hide');
					$('#carryItemsArea').addClass('hide');
					$('#cbAgency').getObj().setEnabled(true);
					$('#zdzzTimeline').addClass('hide');
					$('#tool-bar').removeClass('hide');
					page.disableFlag = false;
					page.clearTimeLine();
					accountbookGuids = [];
				});
				//表头全选
				$("body").on("click", 'input#check-head', function() {
					var flag = $(this).prop("checked");
					if(flag) {
						$("#gridGOV").find("tbody tr").addClass("selected").nextUntil("tr").addClass("selected");
					} else {
						$("#gridGOV").find("tbody tr").removeClass("selected").nextUntil("tr").removeClass("selected");
					}
					$("#gridGOV_wrapper").find('input.check-all').prop('checked', flag);
					$("#all").prop('checked', flag)
				});
				//全选
				$("#all").on("click", function() {
					var flag = $(this).prop("checked");
					$("#gridGOV_wrapper").find('input.check-all').prop('checked', flag);
					$("#check-head").prop('checked', flag)
					if(flag) {
						$("#gridGOV").find("tbody tr").addClass("selected").nextUntil("tr").addClass("selected");
					} else {
						$("#gridGOV").find("tbody tr").removeClass("selected").nextUntil("tr").removeClass("selected");
					}
				});
				//单选
				$("body").on("click", 'input.check-all', function() {
					var num = 0;
					var arr = document.querySelectorAll('.check-all')
					for(var i = 0; i < arr.length; i++) {
						if(arr[i].checked) {
							num++
						}
					}
					if(num == arr.length) {
						$("#all").prop('checked', true)
						$("#check-head").prop('checked', true)
					} else {
						$("#all").prop('checked', false)
						$("#check-head").prop('checked', false)
					}
					var $tr = $(this).parents("tr");
					$tr.toggleClass("selected");
				});
				$(".rpt-table-tab").scroll(function() {
					if(!$.isNull($(this).find("thead").offset())) {
						var headTop = $(this).find("thead").offset().top;
						if($(".rpt-table-tab").scrollTop() >= 0) {
							$(".headFixedDiv").removeClass("hidden");
							$(".headFixedDiv").css({
								"top": "197px"
							}); //,"position": "absolute"
						} else {
							$(".headFixedDiv").addClass("hidden")
						}
					}

				});
				//修改为后端分页
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
				page.initAgencyScc();
				$('#agencyText').html('');
				page.timeline = $('#zdzzTimeline').ufmaTimeline([{
					step: '数据检查',
					target: 'zdzj'
				}, {
					step: '结转处理',
					target: 'savemb'
				}, {
					step: '完成',
					target: 'setend'
				}]);
				// page.loadGrid();
				//page.initQueryTable();
			},
			init: function() {
				//获取session
				reslist = ufma.getPermission();
				ufma.isShow(reslist);
				pfData = ufma.getCommonData();
				this.initPage();
				// 初始化时取缓存中记录的行数信息
				serachData.pageSize = parseInt(localStorage.getItem("newAccountsPageSize")) ? parseInt(localStorage.getItem("newAccountsPageSize")) : 20;
				//page.dealJump();
				this.onEventListener();
				ufma.parse();
				ufma.parseScroll();

			}
		}
	}();

	page.init();
});