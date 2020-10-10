$(function() {

	var page = function() {
		var sendObj = {};
		var ptData = ufma.getCommonData();
		var agencyCode = '';
		var oTable;
		var pageLength = ufma.dtPageLength('#termTable'); //分页
		var fisPerd = $('#month-line .choose a').attr('data-fisPerd');
		var allMsg = [];
		var listMsg = [];
		var isNeedAcct;
		var serachData = { // 修改为后端分页
			currentPage: 1,
			pageSize: 20,
		};
		var tableData;
		return {
			initSelect: function(id) {
				$(id).ufTreecombox({
					idField: 'accountbookCode',
					textField: 'accountbookName',
					readonly: false,
					placeholder: '',
					leafRequire: true,
					data: []
				})
			},

			//获取单位下拉树
			initAgencyScc: function() {
				page.cbAgency = $('#cbAgency').ufmaTreecombox2({
					valueField: 'id', //可选
					textField: 'codeName', //可选
					pIdField: 'pId', //可选
					readonly: false,
					placeholder: '请选择单位',
					icon: 'icon-unit',
					theme: 'label',
					leafRequire: true,
					onchange: function(data) {
						agencyCode = data.id;
						//80827 【财务云8.0 鄂尔多斯 】20190630所有页面，单位或账套选择变化后，再打开其它页面时，自动显示为最近一次选择的单位或账套。--zsj
						//缓存单位
						var params = {
							selAgecncyCode: agencyCode
						}
						ufma.setSelectedVar(params);
						page.checkNeedAcct();

					}
				});
				ufma.ajaxDef(dm.getCtrl('agency') + "?setYear=" + ptData.svSetYear + "&rgCode=" + ptData.svRgCode, "get", "", function(result) {
					page.cbAgency = $("#cbAgency").ufmaTreecombox2({
						data: result.data
					});
					var agyCode = $.inArrayJson(result.data, "id", ptData.svAgencyCode);
					if(agyCode != undefined) {
						page.cbAgency.val(ptData.svAgencyCode);
					} else {
						page.cbAgency.val(result.data[0].id);
					}
				});
			},
			initGridDPE: function() {
				var tableId = "termTable"; //表格id
				var toolBar = $('#' + tableId).attr('tool-bar');
				var columns = [{
						title: '<label class="mt-checkbox mt-checkbox-single mt-checkbox-outline"> <input type="checkbox"' + 'class="datatable-group-checkable" id="check-head"/>&nbsp;<span></span> </label>',
						className: 'tc nowrap check-style no-print',
						render: function(data, type, rowdata, meta) {
							return "<label class='mt-checkbox mt-checkbox-single mt-checkbox-outline'> <input type='checkbox' class='check-all' Guid=" + rowdata.accountbookGuid + " index=" + meta.row + " value='0' /> &nbsp;<span></span> </label>";
						}
					}, {
						title: "账簿",
						data: "accountbookName",
						className: 'nowrap isprint'
					},
					{
						title: "已结期间",
						data: "maxCloseFisPerd",
						className: 'nowrap isprint  tc'
					},
					{
						title: "记录数",
						data: "rcAccount",
						className: 'nowrap isprint tc'
					},
					{
						title: "期初余额",
						data: "initMoney",
						className: 'tr nowrap isprint',
						render: function(data, type, rowdata, meta) {
							var val = $.formatMoney(data);
							return val == '0.00' ? '' : val;
						}
					},
					{
						title: "借方发生",
						data: "drMoney",
						className: 'tr nowrap isprint',
						render: function(data, type, rowdata, meta) {
							var val = $.formatMoney(data);
							return val == '0.00' ? '' : val;
						}
					},
					{
						title: "贷方发生",
						data: 'crMoney',
						className: 'tr nowrap isprint',
						render: function(data, type, rowdata, meta) {
							var val = $.formatMoney(data);
							return val == '0.00' ? '' : val;
						}
					},
					{
						title: "期末余额",
						data: 'endingMoney',
						className: 'tr nowrap isprint',
						render: function(data, type, rowdata, meta) {
							var val = $.formatMoney(data);
							return val == '0.00' ? '' : val;
						}
					}, {
						title: "与总账对账",
						data: 'generalLedgerBalance',
						className: 'tc nowrap isprint'
					}
				];
				var opts = {
					"language": {
						"url": bootPath + "agla-trd/datatables/datatable.default.js"
					},
					"autoWidth": false,
					"bDestory": true,
					"data": [],
					"processing": true, //显示正在加载中
					// "pageLength": pageLength,
					// "pagingType": "full_numbers", //分页样式
					// "lengthChange": true, //是否允许用户自定义显示数量p
					// "lengthMenu": [
					// 	[20, 50, 100, 200, 100000],
					// 	[20, 50, 100, 200, "全部"]
					// ],
					"paging": false,
					"serverSide": false,
					"ordering": false,
					"columns": columns,
					// "dom": 'rt<"' + tableId + '">',
					"dom": 'rt<"termTable-paginate"ilp>',
					"initComplete": function(settings, json) {
						var toolBar = $(this).attr('tool-bar')
						var $info = $(toolBar + ' .info');
						if($info.length == 0) {
							$info = $('<div class="info"></div>').appendTo($(toolBar + ' .tool-bar-body'));
						}
						$info.html('');
						$('.termTable-paginate').appendTo($info);
						ufma.isShow(page.reslist);
						$('#' + tableId).closest('.dataTables_wrapper').ufScrollBar({
							hScrollbar: true,
							mousewheel: false
						});
					},
					"drawCallback": function(settings) {
						$("#termTable").find("td.dataTables_empty").text("")
							.append('<img src="' + bootPath + 'images/noData.png"/><br/><i>目前还没有你要查询的数据</i>');

						$(".tableBox").css({
							"overflow-x": "auto"
						});
						$('#' + tableId).closest('.dataTables_wrapper').ufScrollBar('destroy');
						$('#' + tableId).closest('.dataTables_wrapper').ufScrollBar({
							hScrollbar: true,
							mousewheel: false
						});
						ufma.isShow(page.reslist);
						ufma.setBarPos($(window));
						// 修改为后端分页
						if(!$.isNull(page.tableData)){
							var paging = page.tableData;
							uf.backendPaging(paging,"termEndAccount",serachData);
						}
					}
				}
				oTable = $("#" + tableId).dataTable(opts);
			},

			loadGridDPE: function() {
				var fisPerdload = $('#month-line .choose a').attr('data-fisPerd');
				var argu = {
					agencyCode: agencyCode,
					setYear: ptData.svSetYear,
					rgCode: ptData.svRgCode,
					fisPerd: fisPerdload
				}
				if(isNeedAcct) {
					argu.acctCode = $("#cbAcct").getObj().getValue();
				}
				// 修改为后端分页
				pageLength = ufma.dtPageLength('#termTable');
				argu.currentPage = parseInt(serachData.currentPage);
				argu.pageSize = parseInt(serachData.pageSize) ? parseInt(serachData.pageSize) : 99999999; // 没有值时查全部
				//查询后记录当前选择的行数信息到缓存
				localStorage.removeItem("termEndAccountPageSize");
				localStorage.setItem("termEndAccountPageSize", argu.pageSize);
				dm.loadGridData(argu, function(result) {
					page.tableData = result.data;
					oTable.fnClearTable();
					if(!$.isNull(result.data.list) && result.data.list.length > 0) { //返回数据为数组时判断长度是否为大于0 ，且不为空
						oTable.fnAddData(result.data.list, true);
					}
					ufma.setBarPos($(window));
				});
				$("#check-head").prop('checked', false);
				$("#all").prop('checked', false);
			},
			prevMsg: function() {
				$('#divPre').html('');
				if(!$.isNull(allMsg)) {
					for(var i = 0; i < allMsg.length; i++) {
						if(allMsg[i].closeResult == true) {
							$('<div class="msgID" style="font-size: 20px;font-weight: bold;color: #333;"><span class="icon-check-circle" style="color: #00A854;"></span>' + allMsg[i].closeResultMsg + '</div>').appendTo('#divPre');
						} else if(allMsg[i].closeResult == false) {
							$('<div class="msgID" style="font-size: 20px;font-weight: bold;color: #333;"><span class="icon-cross-circle" style="color: red; visibility: visible;"></span>' + allMsg[i].closeResultMsg + '</div>').appendTo('#divPre');
						}
					}
				}
			},
			//结账
			auditAcc: function() {
				ufma.showloading('正在结账，请耐心等待...');
				var auditDt = [];
				linkGuidsArr = [];
				var state;
				$("#termTable tbody tr").each(function(index, row) {
					var $chk = $(this).find("input[type='checkbox']");
					if($chk.is(":checked") == true) {
						var jouGuid = $(this).find('.check-all').attr('Guid');
						auditDt[auditDt.length] = jouGuid;
					}
				});
				if(auditDt.length == 0) {
					ufma.showTip('请先选择一条要处理的数据!', function() {
						ufma.hideloading();
						return false;
					}, 'warning');
				} else {
					var fisPerdload = $('#month-line .choose a').attr('data-fisPerd');
					var argu = {
						agencyCode: agencyCode,
						setYear: ptData.svSetYear,
						rgCode: ptData.svRgCode,
						fisPerd: fisPerdload,
						accountbookGuids: auditDt
					}
					dm.postMoreBook(argu, function(result) {
						$("#auditResult").html("");
						allMsg = [];
						listMsg = [];
						listMsg = result.data;
						allMsg = result.data;
						if(!$.isNull(listMsg)) {
							for(var i = 0; i < listMsg.length; i++) {
								if(listMsg[i].closeResult == true) {
									$('<div class="msgID" style="font-size: 15px;font-weight: bold;color: #333;"><span class="icon-check-circle" style="color: #00A854;"></span>' + listMsg[i].closeResultMsg + '</div>').appendTo('#auditResult');
								} else if(listMsg[i].closeResult == false) {
									$('<div class="msgID" style="font-size: 15px;font-weight: bold;color: #333;"><span class="icon-cross-circle" style="color: red; visibility: visible;"></span>' + listMsg[i].closeResultMsg + '</div>').appendTo('#auditResult');
								}
							}
						}
						if(result.flag != "success") {
							ufma.hideloading();
							ufma.showTip(result.msg, '', 'error');
							return false;
						} else {
							ufma.hideloading();
							reconResult = result.data;
							page.editor = ufma.showModal('reconResult', 590, 368);
							page.getMinFisPerd();
						}
					});
				}

			},
			//反结账
			unAuditAcc: function() {
				ufma.showloading('正在反结账，请耐心等待...');
				var unAuditDt = [];
				linkGuidsArr = [];
				var state;
				$("#termTable tbody tr").each(function(index, row) {
					var $chk = $(this).find("input[type='checkbox']");
					if($chk.is(":checked") == true) {
						var jouGuid = $(this).find('.check-all').attr('Guid');
						unAuditDt[unAuditDt.length] = jouGuid;
					}
				});
				if(unAuditDt.length == 0) {
					ufma.showTip('请先选择一条要处理的数据!', function() {
						ufma.hideloading();
						return false;
					}, 'warning');
				} else {
					var fisPerdload = $('#month-line .choose a').attr('data-fisPerd');
					var argu = {
						agencyCode: agencyCode,
						setYear: ptData.svSetYear,
						rgCode: ptData.svRgCode,
						fisPerd: fisPerdload,
						accountbookGuids: unAuditDt
					}
					dm.postMoreBookOp(argu, function(result) {
						$("#auditResult").html("");
						allMsg = [];
						listMsg = [];
						listMsg = result.data;
						allMsg = result.data;
						if(!$.isNull(listMsg)) {
							for(var i = 0; i < listMsg.length; i++) {
								if(listMsg[i].closeResult == true) {
									$('<div class="msgID" style="font-size: 15px;font-weight: bold;color: #333;"><span class="icon-check-circle" style="color: #00A854;"></span>' + listMsg[i].closeResultMsg + '</div>').appendTo('#auditResult');
								} else if(listMsg[i].closeResult == false) {
									$('<div class="msgID" style="font-size: 15px;font-weight: bold;color: #333;"><span class="icon-cross-circle" style="color: red; visibility: visible;"></span>' + listMsg[i].closeResultMsg + '</div>').appendTo('#auditResult');
								}
							}
						}
						if(result.flag != "success") {
							ufma.hideloading();
							ufma.showTip(result.msg, '', 'error');
							return false;
						} else {
							ufma.hideloading();
							reconResult = result.data;
							page.editor = ufma.showModal('reconResult', 590, 368);
							page.getMinFisPerd();
						}
					});
				}

			},
			//获取系统选项-各界面需选择账套
			checkNeedAcct: function() {
				//	ufma.get("/cu/sysRgpara/getBooleanByChrCode/CU002", {}, function (result) {
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
								page.initGridDPE();
								allMsg = [];
								page.loadGridDPE();
								page.getMinFisPerd();
							},
							onComplete: function(sender) {
								if(ptData.svAcctCode) {
									$("#cbAcct").getObj().val(ptData.svAcctCode);
								} else {
									$('#cbAcct').getObj().val('1');
								}
								ufma.hideloading();
							}
						});
						var argu = {
							agencyCode: agencyCode,
							setYear: ptData.svSetYear
						}
						callback = function(result) {
							$("#cbAcct").getObj().load(result.data);
						}
						ufma.get("/cu/common/eleCoacc/getCoCoaccs/" + agencyCode, argu, callback);

					} else {
						acctCode ="";
						$("#acct").addClass("hide");
						page.initGridDPE();
						allMsg = [];
						page.loadGridDPE();
						page.getMinFisPerd();
					}
				});
			},
			//获取最大结账期间 guohx 选择账簿后，上面的结账条自动关联显示 16362
			getMinFisPerd: function () {
				var argu = {
					agencyCode: agencyCode,
					setYear: ptData.svSetYear,
					acctCode: acctCode
				}
				callback = function (result) {
					$("#month-line .blue-line a").each(function () {
						if ($(this).attr('data-fisperd') == result.data) {
							$(this).trigger('click');
						}
					});
				}
				ufma.get("/cu/cuAccountBook/getMinFisPerd", argu, callback);
			},
			onEventListener: function() {
				$('#btnOver').on('click', function() {
					ufma.showTip('结账已完成', function() {
						return false;
					}, 'warning');
				})
				//点击期间
				$(document).on("click", "#month-line .blue-line a", function() {
					$(this).parents('.blue-one').addClass('active').siblings("li.blue-one").removeClass("active");
					$(this).parents('.blue-one').addClass('choose').siblings("li.blue-one").removeClass("choose");
					page.loadGridDPE();
				});
				//结账
				$('#btnAudit').on('click', function() {
					page.auditAcc();
				})
				//反结账
				$('#btnUnaudit').on('click', function() {
					page.unAuditAcc();
				})
				//表头全选
				$("body").on("click", 'input#check-head', function() {
					var flag = $(this).prop("checked");
					if(flag) {
						$("#termTable").find("tbody tr").addClass("selected").nextUntil("tr").addClass("selected");
					} else {
						$("#termTable").find("tbody tr").removeClass("selected").nextUntil("tr").removeClass("selected");
					}
					$("#termTable_wrapper").find('input.check-all').prop('checked', flag);
					$("#all").prop('checked', flag)
				});
				//全选
				$("#all").on("click", function() {
					var flag = $(this).prop("checked");
					$("#termTable_wrapper").find('input.check-all').prop('checked', flag);
					$("#check-head").prop('checked', flag)
					if(flag) {
						$("#termTable").find("tbody tr").addClass("selected").nextUntil("tr").addClass("selected");
					} else {
						$("#termTable").find("tbody tr").removeClass("selected").nextUntil("tr").removeClass("selected");
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
				//确定关闭弹窗
				$("#btnSure").on('click', function() {
					page.editor.close();
					page.loadGridDPE();
				})
				//修改为后端分页
				//分页尺寸下拉发生改变
				$(".ufma-table-paginate").on("change", ".vbPageSize", function () {
					pageLength = ufma.dtPageLength('#termTable', $(".ufma-table-paginate").find(".vbPageSize").val());
					serachData.pageSize = $(".ufma-table-paginate").find(".vbPageSize").val();
					$(".vbDataSum").html("");
					$("#termTable tbody").html('');
					$("#tool-bar .slider").remove();
					$(".ufma-table-paginate").html("");
					page.loadGridDPE();
				});

				//点击页数按钮
				$(".ufma-table-paginate").on("click", ".vbNumPage", function () {
					if ($(this).find("a").length != 0) {
						serachData.currentPage = $(this).find("a").attr("data-gopage");
						serachData.pageSize = $(".ufma-table-paginate").find(".vbPageSize").val();
						$(".vbDataSum").html("");
						$("#termTable tbody").html('');
						$("#tool-bar .slider").remove();
						$(".ufma-table-paginate").html("");
						page.loadGridDPE();
					}
				});

				//点击上一页
				$(".ufma-table-paginate").on("click", ".vbPrevPage", function () {
					if (!$(".ufma-table-paginate .vbPrevPage").hasClass("disabled")) {
						serachData.currentPage = $(this).find("a").attr("data-prevpage");
						serachData.pageSize = $(".ufma-table-paginate").find(".vbPageSize").val();
						$(".vbDataSum").html("");
						$("#termTable tbody").html('');
						$("#tool-bar .slider").remove();
						$(".ufma-table-paginate").html("");
						page.loadGridDPE();
					}
				});

				//点击下一页
				$(".ufma-table-paginate").on("click", ".vbNextPage", function () {
					if (!$(".ufma-table-paginate .vbNextPage").hasClass("disabled")) {
						serachData.currentPage = $(this).find("a").attr("data-nextpage");
						serachData.pageSize = $(".ufma-table-paginate").find(".vbPageSize").val();
						$(".vbDataSum").html("");
						$("#termTable tbody").html('');
						$(".ufma-tool-btns").html('');
						$(".ufma-table-paginate").html("");
						page.loadGridDPE();
					}
				});
			},
			//初始化页面
			initPage: function() {
				page.reslist = ufma.getPermission();
				ufma.isShow(page.reslist);
				page.initGridDPE();
				page.initAgencyScc();
			},
			init: function() {
				//获取session
				ptData = ufma.getCommonData();
				this.initPage();
				// 初始化时取缓存中记录的行数信息
				serachData.pageSize = parseInt(localStorage.getItem("termEndAccountPageSize")) ? parseInt(localStorage.getItem("termEndAccountPageSize")) : 20;
				this.onEventListener();
				$('#cosetyear').html(ptData.svSetYear + '年')
				ufma.parse();
				ufma.parseScroll();
			}
		}
	}();
	page.init();
});