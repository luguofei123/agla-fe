$(function () {
	window._close = function () {
		window.closeOwner();
	};
	var ptData = {};
	var rowTableData = {};
	var page = function () {
		return {
			//初始化页面
			initPage: function () {
				$('#startDate').ufDatepicker({
					format: 'yyyy-mm-dd',
					initialDate: window.ownerData.startDate
				});
				$('#endDate').ufDatepicker({
					format: 'yyyy-mm-dd',
					initialDate: window.ownerData.endDate
				});
				if (!$.isNull(window.ownerData.oneData)) {
					$('#btnSaveAdd').removeClass('disabled');
					$('#btnSave').removeClass('disabled');
				}
				if (window.ownerData.period == "jr") {
					$('#dateBn').removeClass("selected");
					$('#dateBq').removeClass("selected");
					$('#dateJr').addClass("selected");
				} else if (window.ownerData.period == "bq") {
					$('#dateBn').removeClass("selected");
					$('#dateBq').addClass("selected");
					$('#dateJr').removeClass("selected");
				} else {
					$('#dateBn').addClass("selected");
					$('#dateBq').removeClass("selected");
					$('#dateJr').removeClass("selected");
				}
				page.loadZWdata();
			},
			loadZWdata: function () {
				var argu = {
					agencyCode: window.ownerData.agencyCode,
					acctCode: window.ownerData.acctCode,
					accoCode: window.ownerData.accoCode,
					setYear: window.ownerData.setYear,
					rgCode: window.ownerData.svRgCode,
					fisPerd: window.ownerData.fisPerd,
					startDate: $('#startDate').getObj().getValue(),
					endDate: $('#endDate').getObj().getValue(),
					isVouSign: window.ownerData.isVouSign,
					accountbookGuid : window.ownerData.accountbookGuid
				};
				ufma.showloading('数据加载中，请耐心等待...');
				dm.cbbGetData(argu, function (result) {
					page.colData = [];
					page.tableData = result.data.data;
					var comlunsArr = [];
					page.accitemObj = result.data.eleAccoItemNames;
					$.each(page.accitemObj, function (key, value) {
						var cbName;
						var cbItem;
						var cbCodeName;
						comlunsArr.push({
							cbItem: value.eleCode,
							cbCodeName: value.columnName,
							cbName: value.eleName
						});
					});
					page.colData = comlunsArr;
					page.loadGrid();

				});

			},
			getColumns: function () {
				var columns = [{
					title: '<label class="mt-checkbox mt-checkbox-single mt-checkbox-outline"> <input type="checkbox"' + 'class="datatable-group-checkable" id="check-head"/>&nbsp;<span></span> </label>',
					className: 'tc nowrap',
					width: 40,
					render: function (data, type, rowdata, meta) {
						return "<label class='mt-checkbox mt-checkbox-single mt-checkbox-outline'> <input type='checkbox' class='check-all' index=" + meta.row + " value='0' /> &nbsp;<span></span> </label>";
					}
				},
				{
					title: "日期",
					data: "vouDate",
					className: 'nowrap tc',
					width: 100
				},
				{
					title: "凭证字号",
					data: 'vouTypeNameNo',
					className: 'nowrap tc',
					width: 44,
					"render": function (data, type, rowdata, meta) {
						var index = meta.row + 1;
						if (!$.isNull(JSON.stringify(rowdata))) {
							//guohx  2019-08-15  解决传参解析时有双引号的摘要 导致后面不再解析,现在改为数组对象处理
							if ($.isNull(rowTableData[rowdata.detailGuid])) {
								rowTableData[rowdata.detailGuid + ' ' + rowdata.detailAssGuid] = rowdata;
							}
							return "<span class='viewData' data-index = '" + rowdata.detailGuid + ' ' + rowdata.detailAssGuid + "'>" + rowdata.vouTypeNameNo + "</span>"; //bug79256--zsj--将a标签换为span
						}
					}
				},
				{
					title: "摘要",
					data: "descpt",
					className: 'nowrap',
					//CWYXM-18077 出纳管理模块，登记出纳账从账务取数界面，摘要列宽限制下，30个字内自适应，超过30气泡显示 guohx 20200708
					"render": function (data, type, rowdata, meta) {
						return "<span class='descptLong' title='" + rowdata.descpt + "'>" + rowdata.descpt + "</span>";
					}
				},
				{
					title: "科目",
					data: "accoName",
					className: 'nowrap tc',
					width: 100
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
				},
				{
					title: "票据类型",
					data: "billType",
					className: 'nowrap'
				},
				{
					title: "票据号",
					data: 'billNo',
					className: 'nowrap tr'
				},
				{
					title: "经办人",
					data: "dealwith",
					className: 'nowrap',
					render: function (data, type, rowdata, meta) {
						return rowdata.dealWithName;
					}
				}
				];
				for (var i = 0; i < page.colData.length; i++) {
					for (var j = 0; j < window.ownerData.colItem.length; j++) {
						if (Object.keys(page.accitemObj)[i] == window.ownerData.colItem[j]) {
							var item = page.colData[i];
							var cbName = item.cbName;
							var cbItem = item.cbItem;
							var cbCodeName = item.cbCodeName;
							if (!$.isNull(cbItem)) {
								columns.push({
									title: cbName,
									data: cbCodeName + 'Name', //转为accitemCodeCodeName
									className: 'nowrap',
									width: 240
								});
							}
						}
					}
				}
				return columns;
			},

			initGrid: function (data) {
				var columns = page.getColumns();
				oTable = $("#gridGOV").dataTable({
					"language": {
						"url": bootPath + "agla-trd/datatables/datatable.default.js"
					},
					"autoWidth": false,
					"bAutoWidth": true, ///* CWYXM-18405【广东项目】出纳管理-登记出纳账，从账务取数，列表框错位 */
					// "bPaginate": false,
					"bDestory": true,
					"processing": true, //显示正在加载中
					"serverSide": false,
					"ordering": false,
					"pagingType": "full_numbers", //分页样式
					"lengthChange": true, //是否允许用户自定义显示数量p
					"lengthMenu": [
						[10, 20, 50, 100, 200, -1],
						[10, 20, 50, 100, 200, "全部"]
					],
					"pageLength": ufma.dtPageLength("#gridGOV"),
					"columns": columns,
					"scrollX": true,/* CWYXM-18405【广东项目】出纳管理-登记出纳账，从账务取数，列表框错位 */
					//填充表格数据 
					data: data,
					"dom": 'rt<"gridGOV-paginate"ilp>',
					// "dom": 'rt<ilp>',
					initComplete: function (settings, json) {
						var toolBar = $(this).attr('tool-bar')
						var $info = $(toolBar + ' .info');
						if ($info.length == 0) {
							$info = $('<div class="info"></div>').appendTo($(toolBar + ' .tool-bar-body'));
						}
						$info.html('');
						$('.gridGOV-paginate').appendTo($info);
						$('.dataTables_wrapper.no-footer .dataTables_scrollBody').css("border-bottom", "1px solid transparent")
						var layoutH = $('.ufma-layout-up').height();
						var toolBarH = $('#tool-bar').height();
						var margin = layoutH - toolBarH - 50 - 40 - 45 - 5;
						$('.dataTables_scrollBody').css("height", margin + "px");
						$('#tool-bar').css("margin-top", margin + "px");
						$('#gridGOV_wrapper').css("border-right", "1px solid #d9d9d9");
						var top = margin + 28;
						$('.slider').css("top", top + "px");
						$(".checkAll-three").prop("checked", false);
						$(".checkAll-three").on('change', function () { });
						// $('#gridGOV').fixedTableHead();
						ufma.setBarPos($(window));
					},
					"drawCallback": function () {
						$('#gridGOV').find("td.dataTables_empty").text("")
							.append('<img src="' + bootPath + 'images/noData.png"/><br/><i>目前还没有你要查询的数据</i>');

						$("#check-head").prop('checked', false);
						$("#all").prop('checked', false);
						//ufma.setBarPos($(window));
					}
				});
			},
			loadGrid: function () {
				if ($("#gridGOV").html() != '') {
					$("#gridGOV").dataTable().fnDestroy();
					$("#gridGOV").html('');
				}
				// CWYXM-18441【广东项目】登记出纳账，从账务取数，取数弹窗页面，点击查询，点击第二次，页面内容会消失 清空html导致重新生成缺少tbody标签 guohx 
				page.initGrid(page.tableData);
				ufma.setBarPos($(window));
				ufma.hideloading();
			},
			save: function (flag) {
				var selectData = [];
				$("#gridGOV tbody tr").each(function (index, row) {
					var $chk = $(this).find("input[type='checkbox']");
					if ($chk.is(":checked") == true) {
						//字符串处理下 
						console.log(rowTableData[index]);
						var tempIndex = $(this).find('.viewData').attr('data-index');
						var tempData = rowTableData[tempIndex];
						tempData.jouDate = tempData.vouDate;
						tempData.summary = tempData.descpt;
						if (tempData.crAmt > 0) {
							tempData.drCr = "-1";
							tempData.money = tempData.crAmt;
						} else if (tempData.drAmt > 0) {
							tempData.drCr = "1";
							tempData.money = tempData.drAmt;
						}
						tempData.agencyCode = window.ownerData.agencyCode;
						tempData.setYear = window.ownerData.setYear;
						tempData.rgCode = window.ownerData.rgCode;
						tempData.acctCode = window.ownerData.acctCode;
						tempData.accoCode = window.ownerData.accoCode;
						// tempData.jouType = "1";
						tempData.accountbookGuid = window.ownerData.accountbookGuid;
						tempData.recordType = "1"; //1日常 0期初
						tempData.jouType = window.ownerData.accountBookType;
						tempData.dealWith = tempData.dealWithName;
						selectData[selectData.length] = tempData;
					}
				});
				if (selectData.length != 0) {
					var argu = selectData;
					var url = '/cu/journal/saveJournals';
					ufma.showloading('正在保存出纳账，请耐心等待...');
					ufma.post(url, argu, function (result) {
						ufma.showTip(result.msg, function () {
							ufma.hideloading();
							page.loadZWdata();
							$("#btnSave").attr("disabled", false);
						}, result.flag)
					})
				} else {
					ufma.showTip("没有可登记的数据", function () { }, "warning")
				}
			},
			//返回本期时间
			dateBenQi: function (startId, endId) {
				var ddYear = page.setYear;
				var ddMonth = page.month - 1;
				var tdd = new Date(ddYear, ddMonth + 1, 0)
				var ddDay = tdd.getDate();
				$("#" + startId).getObj().setValue(new Date(ddYear, ddMonth, 1));
				$("#" + endId).getObj().setValue(new Date(ddYear, ddMonth, ddDay));
			},
			//返回本年时间
			dateBenNian: function (startId, endId) {
				var ddYear = page.setYear;
				$("#" + startId).getObj().setValue(new Date(ddYear, 0, 1));
				$("#" + endId).getObj().setValue(new Date(ddYear, 11, 31));
			},
			//返回今日时间
			dateToday: function (startId, endId) {
				var mydate = new Date(ptData.svTransDate);
				Year = mydate.getFullYear();
				Month = (mydate.getMonth() + 1);
				Month = Month < 10 ? ('0' + Month) : Month;
				Day = mydate.getDate();
				Day = Day < 10 ? ('0' + Day) : Day;
				$('#startDate').getObj().setValue(Year + '-' + Month + '-' + Day);
				$('#endDate').getObj().setValue(Year + '-' + Month + '-' + Day);
			},
			onEventListener: function () {
				$('#btnSave').on('click', function () {
					$("#btnSave").attr("disabled", true);
					page.save(true);
					var timeId = setTimeout(function () {
						$("#btnSave").attr("disabled", false);
						clearTimeout(timeId);
					}, 5000);
				})
				$('#btnClose').on('click', function () {
					_close()
				});
				//表头全选
				$("body").on("click", 'input#check-head', function () {
					var flag = $(this).prop("checked");
					$("#gridGOV_wrapper").find('input.check-all').prop('checked', flag);
					$("#all").prop('checked', flag)
				});
				//全选
				$("#all").on("click", function () {
					var flag = $(this).prop("checked");
					$("#gridGOV_wrapper").find('input.check-all').prop('checked', flag);
					$("#check-head").prop('checked', flag)
				});
				//单选
				$("body").on("click", 'input.check-all', function () {
					var num = 0;
					var arr = document.querySelectorAll('.check-all')
					for (var i = 0; i < arr.length; i++) {
						if (arr[i].checked) {
							num++
						}
					}
					if (num == arr.length) {
						$("#all").prop('checked', true)
						$("#check-head").prop('checked', true)
					} else {
						$("#all").prop('checked', false)
						$("#check-head").prop('checked', false)
					}
				});
				//选择期间，改变日历控件的值
				$("#dateBq").on("click", function () {
					page.dateBenQi("startDate", "endDate");
				});
				$("#dateBn").on("click", function () {
					page.dateBenNian("startDate", "endDate");
				});
				$("#dateJr").on("click", function () {
					page.dateToday("startDate", "endDate");
				});
				$('#queryTable').on('click', function () {
					if ($('#startDate').getObj().getValue() > $('#endDate').getObj().getValue()) {
						ufma.showTip('开始日期不能大于结束日期！', function () { }, 'warning');
						return false;
					}
					page.loadZWdata();
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
				page.nowDate = ptData.svTransDate; //当前年月日
				page.setYear = ptData.svSetYear; //本年 年度
				page.month = ptData.svFiscalPeriod; //本期 月份
				page.today = ptData.svTransDate; //今日 年月日
				ufma.parseScroll();
				ufma.parse();
			}
		}
	}();

	/////////////////////
	page.init();
});