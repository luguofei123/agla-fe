$(function () {
	window._close = function () {
		window.closeOwner();
	};
	var ptData = {};
	var page = function () {
		return {
			//初始化页面
			initPage: function () {
				page.initGrid('gridCU');
				page.initGrid('gridGL');
				var drCr;
				if (window.ownerData.style == "drBalance") {//借方
					$("#drCr").find(".drBalance").attr("checked", true);
					drCr = "1";
					status = "drBalance";
				} else if (window.ownerData.style == "crBalance") {
					$("#drCr").find(".crBalance").attr("checked", true);
					drCr = "-1";
					status = "crBalance";
				} else {
					$("#drCr").find(".restBalance").attr("checked", true);
					drCr = "";
					status = "restBalance";
				}
				page.loadData(drCr, status);
				$('#accountBook').html(window.ownerData.accbookName);
			},
			loadData: function (drCr, status) {
				var argu = {
					agencyCode: window.ownerData.agencyCode,
					acctCode: window.ownerData.acctCode,
					accoCode: window.ownerData.accoCode,
					setYear: window.ownerData.setYear,
					rgCode: window.ownerData.svRgCode,
					accountbookGuid: window.ownerData.accountbookGuid,
					fisPerd: window.ownerData.mainData.fisPerd,
					IS_INCLUDE_UNPOST: window.ownerData.IS_INCLUDE_UNPOST,
					drCr: drCr
				};
				if (status == "restBalance") {
					argu.startFisPerd = 0;
					argu.endFisPerd = window.ownerData.mainData.fisPerd;
					argu.fisPerd = "";
				}
				ufma.showloading('数据加载中，请耐心等待...');
				dm.reqDetail(argu, function (result) {
					$("#gridCU").dataTable().fnClearTable();
					$("#gridGL").dataTable().fnClearTable();
					if (!$.isNull(result.data)) { //bug79259--zsj--修改打印时月份为null的问题
						if (result.data.journalList.length != "0") {
							$("#gridCU").dataTable().fnAddData(result.data.journalList, true);
						}
						if (result.data.vouDetails.length != "0") {
							$("#gridGL").dataTable().fnAddData(result.data.vouDetails, true);
						}
					}
					ufma.setBarPos($(window));
					ufma.hideloading();
				});

			},
			getColumns: function (tabelId) {
				//出纳
				if (tabelId == "gridCU") {
					var columns = [{
						title: "序号",
						data: "rowno",
						className: 'tc nowrap isprint',
						width: 44,
						"render": function (data, type, rowdata, meta) {
							var index = meta.row + 1
							return "<span>" + index + "</span>";
						}
					},
					{
						title: "单据编号",
						data: 'jouNo',
						className: 'nowrap tc',
						width: 44
					},
					{
						title: "摘要",
						data: "summary",
						className: 'nowrap'
					},
					{
						title: "登账日期",
						data: "jouDate",
						className: 'nowrap tc',
						width: 100
					},
					{
						title: "借方金额",
						data: "drMoney",
						className: 'nowrap tr',
						render: function (data, type, rowdata, meta) {
							var val = $.formatMoney(data);
							return val == '0.00' ? '' : val;
						}
					},
					{
						title: "贷方金额",
						data: 'crMoney',
						className: 'nowrap tr',
						render: function (data, type, rowdata, meta) {
							var val = $.formatMoney(data);
							return val == '0.00' ? '' : val;
						}
					}
					];
					return columns;
				} else {
					var columns = [{
						title: "序号",
						data: "rowno",
						className: 'tc nowrap isprint',
						width: 44,
						"render": function (data, type, rowdata, meta) {
							var index = meta.row + 1
							return "<span>" + index + "</span>";
						}
					},
					{
						title: "凭证字号",
						data: 'vouTypeNameNo',
						className: 'nowrap tc',
						width: 44,
						"render": function (data, type, rowdata, meta) {
							var index = meta.row + 1
							if (data) {
								return "<span class='viewData'>" + data + "</span>";
							} else {
								return "";
							}

						}
					},
					{
						title: "摘要",
						data: "descpt",
						className: 'nowrap'
					},
					{
						title: "凭证日期",
						data: "vouDate",
						className: 'nowrap tc',
						width: 100,
						render: function (data, type, rowdata, meta) {
							if (data) {
								return "<span>" + data + "</span>";
							} else {
								return "";
							}

						}
					},
					{
						title: "借方金额",
						data: "drAmt",
						className: 'nowrap tr',
						render: function (data, type, rowdata, meta) {
							var val = $.formatMoney(data);
							return val == '0.00' ? '' : val;
						}
					},
					{
						title: "贷方金额",
						data: 'crAmt',
						className: 'nowrap tr',
						render: function (data, type, rowdata, meta) {
							var val = $.formatMoney(data);
							return val == '0.00' ? '' : val;
						}
					}
					];
					return columns;
				}

			},

			initGrid: function (tabelId) {
				var columns = page.getColumns(tabelId);
				oTable = $("#" + tabelId).dataTable({
					"language": {
						"url": bootPath + "agla-trd/datatables/datatable.default.js"
					},
					"autoWidth": false,
					"bPaginate": false,
					"bDestory": true,
					"processing": true, //显示正在加载中
					"serverSide": false,
					"ordering": false,
					"pagingType": "full_numbers", //分页样式
					// "lengthChange": true, //是否允许用户自定义显示数量p
					// "lengthMenu": [
					// 	[10, 20, 50, 100, 200, -1],
					// 	[10, 20, 50, 100, 200, "全部"]
					// ],
					// "pageLength": ufma.dtPageLength("#" + tabelId),
					"columns": columns,
					"scrollY": 330,
					//填充表格数据
					data: [],
					"dom": 'rt',
					initComplete: function (settings, json) {
						var toolBar = $(this).attr('tool-bar')
						var $info = $(toolBar + ' .info');
						if ($info.length == 0) {
							$info = $('<div class="info"></div>').appendTo($(toolBar + ' .tool-bar-body'));
						}
						$info.html('');
						$("." + tabelId + "-paginate").appendTo($info);
						$("#" + tabelId).closest('.dataTables_wrapper').ufScrollBar({
							hScrollbar: true,
							mousewheel: false
						});
						var layoutH = $('.ufma-layout-up').height();
						var toolBarH = $('#tool-bar').height();
						var margin = layoutH - toolBarH - 50 - 36 - 50 - 10 - 10;
						$('.dataTables_scrollBody').css("height", margin + "px");
						$('#tool-bar').css("margin-top", margin + "px");
						$("#" + tabelId + "_wrapper").css("border-right", "1px solid #d9d9d9");
						var top = margin + 28;
						$('.slider').css("top", top + "px");
						$("#" + tabelId).fixedTableHead();
						ufma.setBarPos($(window));
					},
					fnCreatedRow: function (nRow, aData, iDataIndex) {
						if (!$.isNull(aData)) {
							if (aData.rowType == "1") {
								$(nRow).css({
									"background-color": "#f0f0f0"
								})
							}
						}
					},
					"drawCallback": function () {
						$("#" + tabelId).find("td.dataTables_empty").text("")
							.append('<img src="' + bootPath + 'images/noData.png"/><br/><i>目前还没有你要查询的数据</i>');

						$("#check-head").prop('checked', false);
						$("#all").prop('checked', false);
						//ufma.setBarPos($(window));
					}
				});
			},
			onEventListener: function () {
				$("#drCr").find('input[name="drCr"]').on("click", function () {
					var drCr = $(this).val();
					page.loadData(drCr, "");
				})
			},

			//此方法必须保留
			init: function () {
				//权限控制
				page.reslist = ufma.getPermission();
				ufma.isShow(page.reslist);
				this.initPage();
				this.onEventListener();
				ptData = ufma.getCommonData();
				ufma.parseScroll();
				ufma.parse();
			}
		}
	}();

	/////////////////////
	page.init();
});