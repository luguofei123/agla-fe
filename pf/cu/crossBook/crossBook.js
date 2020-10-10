$(function () {
	var sendObj = {};
	var balance;
	var agencyCode = '',
		agencyName = '',
		acctCode = '',
		acctName = '';
	var linkGuidsArr = [];
	var generateID;
	var sessionAccbook = ufma.getSelectedVar();
	var flagId = 1;
	var rowTableData = {}
	var accItemObj;
	var serachData = { // 修改为后端分页
		currentPage: 1,
		pageSize: 20,
	};
	var tableData;
	var pageLength = ufma.dtPageLength('#gridGOV');
	var page = function () {
		var ptData = {};
		return {
			initSelect: function (id) {
				$(id).ufTreecombox({
					idField: 'accountbookCode',
					textField: 'accountbookName',
					readonly: false, //修改下拉框不支持删除选入内容问题--zsj--bug74261
					placeholder: '',
					leafRequire: true,
					data: []
				})
			},
			//获取单位下拉树
			initAgencyScc: function () {
				//ufma.showloading('正在加载数据，请耐心等待...');
				$('#cbAgency').ufTreecombox({
					url: dm.getCtrl('agency') + "?setYear=" + page.setYear + "&rgCode=" + ptData.svRgCode,
					idField: 'id', //可选
					textField: 'codeName', //可选
					readonly: false,
					pIdField: 'pId', //可选
					placeholder: '请选择单位',
					icon: 'icon-unit',
					theme: 'label',
					leafRequire: true,
					onChange: function (sender, treeNode) {
						agencyCode = $('#cbAgency').getObj().getValue();
						agencyName = $('#cbAgency').getObj().getText();
						//80827 【财务云8.0 鄂尔多斯 】20190630所有页面，单位或账套选择变化后，再打开其它页面时，自动显示为最近一次选择的单位或账套。--zsj
						//缓存单位
						var params = {
							selAgecncyCode: agencyCode,
							selAgecncyName: agencyName,
							selAcctCode: acctCode,
							selAcctName: acctName
						}
						ufma.setSelectedVar(params);
						//获取账套信息
						var url = dm.getCtrl('acct') + "/" + agencyCode;
						callback = function (result) {
							$("#Acct").getObj().load(result.data);
							for (var i = 0; i < result.data.length; i++) {
								if (result.data[i].isLeaf == "1") {
									if (sessionAccbook && !$.isNull(sessionAccbook.selAcctCode)) {
										$('#Acct').getObj().val(sessionAccbook.selAcctCode);
										break;
									} else {
										$('#Acct').getObj().val(result.data[i].code);
										flagId = result.data[i].code
										break;
									}
								}
							}

						}
						ufma.get(url, {
							agencyCode: agencyCode
						}, callback);
						page.reqBillType();
					},
					onComplete: function (sender) {
						if (!$.isNull(ptData.svAgencyCode)) {
							$('#cbAgency').getObj().val(ptData.svAgencyCode);
						} else {
							$('#cbAgency').getObj().val('1');
						}
						//ufma.hideloading();
					}
				});
			},
			//转换为驼峰
			shortLineToTF: function (str) {
				var arr = str.split("_");
				for (var i = 0; i < arr.length; i++) {
					arr[i] = arr[i].toLowerCase()
				}
				for (var i = 1; i < arr.length; i++) {
					arr[i] = arr[i].toLowerCase()
					arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].substring(1);
				}
				return arr.join("");
			},
			//初始化页面
			initPage: function () {
				page.reslist = ufma.getPermission();
				ufma.isShow(page.reslist);
				page.nowDate = ptData.svTransDate; //当前年月日
				page.setYear = ptData.svSetYear; //本年 年度
				page.month = ptData.svFiscalPeriod; //本期 月份
				page.today = ptData.svTransDate; //今日 年月日
				//账套初始化
				$("#Acct").ufTreecombox({
					idField: 'code',
					textField: 'codeName',
					readonly: false,
					placeholder: '请选择账套',
					icon: 'icon-book',
					theme: 'label',
					onChange: function (sender, data) {
						//80827 【财务云8.0 鄂尔多斯 】20190630所有页面，单位或账套选择变化后，再打开其它页面时，自动显示为最近一次选择的单位或账套。--zsj
						//缓存账套
						acctCode = data.code;
						acctName = data.codeName;
						var params = {
							selAgecncyCode: agencyCode,
							selAgecncyName: agencyName,
							selAcctCode: acctCode,
							selAcctName: acctName
						}
						ufma.setSelectedVar(params);
						$('#queryAll').trigger('click');
						accItemObj = {};
						page.reqAccitem();
						//凭证类型
						var argu = {
							rgCode: ptData.svRgCode
						};
						ufma.get('/cu/eleVouType/getVouType/' + agencyCode + '/' + page.setYear + '/' + acctCode + '/*', {}, function (result) {
							// var obj = {
							// 	CHR_CODE: "",
							// 	CHR_NAME: "全部",
							// 	VOU_FULLNAME: "全部"
							// };
							// result.data.unshift(obj);
							var data = result.data;
							vouTypeArray = {};
							//循环把option填入select
							var $vouTypeOp;
							for (var i = 0; i < data.length; i++) {
								//创建凭证类型option节点
								vouTypeArray[data[i].code] = data[i].name;
								$vouTypeOp += '<option value="' + data[i].code + '">' + data[i].name + '</option>';
							}
							$vouTypeOp = '<option value=""></option>' + $vouTypeOp;
							$('#vouType').html($vouTypeOp);
						});
					},
					onComplete: function (sender) {
						if (sessionAccbook && !$.isNull(sessionAccbook.selAcctCode)) {
							$('#Acct').getObj().val(sessionAccbook.selAcctCode);
						} else {
							$('#Acct').getObj().val(flagId);
						}
					}
				});
				$('#startJouDate').ufDatepicker({
					format: 'yyyy-mm-dd',
					initialDate: ptData.svTransDate
				});
				$('#endJouDate').ufDatepicker({
					format: 'yyyy-mm-dd',
					initialDate: ptData.svTransDate
				});
				$("#minMoney,#maxMoney").amtInputMinus();
				// 勾选借方/贷方/辅助核算合并任意一个时，摘要累加可以勾选，如果这三个选项都没有勾选，摘要累加取消勾选且不可用；
				if ($("#switchStyle").find("input[name='isMergerCr']").prop("checked") || $("#switchStyle").find("input[name='isMergerDr']").prop("checked") || $("#switchStyle").find("input[name='isMergerAcc']").prop("checked")) {
					if ($("#switchStyle").find("input[name='onlyDescpt']").prop("checked")) {
						$("#DescptAppend").find("input[name='isDescptAppend']").attr("disabled", true);
					} else {
						$("#DescptAppend").find("input[name='isDescptAppend']").attr("disabled", false);
					}
				} else {
					$("#DescptAppend").find("input[name='isDescptAppend']").removeAttr("checked");
					$("#DescptAppend").find("input[name='isDescptAppend']").attr("disabled", true);
				}
			},
			getColumns: function () {
				var columns = [];
				columns = [{
					title: '<label class="mt-checkbox mt-checkbox-single mt-checkbox-outline"> <input type="checkbox"' + 'class="datatable-group-checkable" id="check-head"/>&nbsp;<span></span> </label>',
					className: 'tc nowrap no-print check-style',
					render: function (data, type, rowdata, meta) {
						return "<label class='mt-checkbox mt-checkbox-single mt-checkbox-outline'> <input type='checkbox' class='check-all' index=" + meta.row + " value='0' /> &nbsp;<span></span> </label>";
					}
				},
				{
					title: "登账日期",
					data: "jouDate",
					className: 'nowrap tc isprint',
					width: 100
				},
				{
					title: "编号",
					data: 'jouNo',
					className: 'nowrap tc isprint',
					width: 44,
					"render": function (data, type, rowdata, meta) {
						var index = meta.row + 1;
						if ($.isNull(rowTableData[rowdata.mainGuid])) {
							rowTableData[rowdata.mainGuid] = rowdata;
						}
						return "<a class='viewData under-line common-jump-link' data-index='" + rowdata.mainGuid + "'>" + rowdata.jouNo + "</a>";
					}
				},
				{
					title: "摘要",
					data: "summary",
					className: 'nowrap isprint'
				},
				{
					title: "金额",
					data: "money",
					className: 'nowrap tr isprint tdNum',
					render: $.fn.dataTable.render.number(',', '.', 2, '')
				},
				{
					title: "凭证字号",
					data: 'vouTypeNameNo',
					className: 'nowrap tr isprint'
				},
				{
					title: "经办人",
					data: 'dealWith',
					className: 'nowrap isprint'
				},
				{
					title: "录入人",
					data: 'createUser',
					className: 'nowrap isprint'
				},
				{
					title: "备注",
					data: 'remark',
					className: 'nowrap isprint'
				}]
				return columns;
			},
			//初始化table
			initGrid: function (data) {
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
					data: data,
					"dom": '<"datatable-toolbar"B>rt<"gridGOV-paginate"ilp>',
					buttons: [{
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
					initComplete: function (settings, json) {
						$('.datatable-toolbar').appendTo('#dtToolbar');
						var toolBar = $(this).attr('tool-bar')
						var $info = $(toolBar + ' .info');
						if ($info.length == 0) {
							$info = $('<div class="info"></div>').appendTo($(toolBar + ' .tool-bar-body'));
						}
						$info.html('');
						$('.gridGOV-paginate').appendTo($info);
						$('#gridGOV').closest('.dataTables_wrapper').ufScrollBar({
							hScrollbar: true,
							mousewheel: false
						});
						ufma.setBarPos($(window));
						$("#dtToolbar .buttons-print").css("border-radius", "4px 0 0 4px").addClass("btn-print btn-permission").attr({
							"data-toggle": "tooltip",
							"title": "打印"
						});
						$("#dtToolbar .buttons-excel").css("border-radius", "0 4px 4px 0").addClass("btn-export btn-permission").attr({
							"data-toggle": "tooltip",
							"title": "导出"
						});
						//导出begin
						$("#dtToolbar .buttons-excel").off().on('click', function (evt) {
							evt = evt || window.event;
							evt.preventDefault();
							uf.expTable({
								title: '登记出纳账',
								exportTable: '#gridGOV'
							});
						});
						//导出end
						$('#dtToolbar [data-toggle="tooltip"]').tooltip();
						ufma.isShow(page.reslist);
						$("#gridGOV").fixedTableHead();
					},
					"drawCallback": function () {
						$('#gridGOV').find("td.dataTables_empty").text("")
							.append('<img src="' + bootPath + 'images/noData.png"/><br/><i>目前还没有你要查询的数据</i>');
						ufma.setBarPos($(window));
						$("#check-head").prop('checked', false)
						$("#all").prop('checked', false)
						ufma.isShow(page.reslist);
						// 修改为后端分页
						if(!$.isNull(page.tableData)){
							var paging = page.tableData;
							uf.backendPaging(paging,"crossBook",serachData);
						}
					}
				});
			},
			//获取表格数据
			loadGrid: function () {
				var argu = $('#frmQuery').serializeObject();

				var argu = $('#frmQuery').serializeObject();
				var arguMore = $('#queryMore').serializeObject();
				argu = $.extend(argu, arguMore);
				var vouType = $('#vouType option:selected').val();
				argu = $.extend(argu, {
					agencyCode: agencyCode,
					acctCode: acctCode,
					setYear: ptData.svSetYear,
					rgCode: ptData.svRgCode
				});
				// 修改为后端分页
				pageLength = ufma.dtPageLength('#gridGOV');
				argu.currentPage = parseInt(serachData.currentPage);
				argu.pageSize = parseInt(serachData.pageSize) ? parseInt(serachData.pageSize) : 99999999; // 没有值时查全部
				//查询后记录当前选择的行数信息到缓存
				localStorage.removeItem("crossBookPageSize");
				localStorage.setItem("crossBookPageSize", argu.pageSize);
				dm.loadGridData(argu, function (result) {
					page.tableData = result.data;
					$('#gridGOV_wrapper').ufScrollBar('destroy'); //动态销毁表格前要先销毁滚动条,否则滚动条无效
					$("#gridGOV").dataTable().fnDestroy();
					$("#gridGOV").html(''); //guohx 先清空动态加载列     此处代码后面必须重新初始化表头 直接addData不生效
					page.initGrid(result.data.list);
				});
			},
			cacheDataRun: function (setting) {
				setting.callback = setting.callback || function (data) { };
				setting.cached = setting.cached || false;
				var callback = setting.callback;
				var data;
				if (setting.cached) {
					if ($.isNull(setting.cacheId)) {
						callback();
						return false;
					}
					data = uf.getObjectCache(setting.cacheId);
				}
				if (!$.isNull(data)) {
					if (setting.hasOwnProperty('element')) {
						callback(setting.element, data, setting.eleName);
					} else {
						callback(data);
					}
				} else {
					setting.param = setting.param || {};
					if ($.isNull(setting.url)) return false;
					$.ufajax(setting.url, 'get', setting.param, function (result) {
						if (result.hasOwnProperty('data')) {
							uf.setObjectCache(setting.cacheId, result.data);
							if (setting.hasOwnProperty('element')) {
								callback(setting.element, result.data, setting.eleName);
							} else {
								callback(result.data);
							}

						} else {
							alert('错误的数据格式!');
						}
					});
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
				$('#startJouDate').getObj().setValue(Year + '-' + Month + '-' + Day);
				$('#endJouDate').getObj().setValue(Year + '-' + Month + '-' + Day);
			},
			//打开凭证弹窗前，将数据中的vouGuid字段删除
			deleVouGuid: function (data) {
				for (var i = 0; i < data.length; i++) {
					delete data[i].vouGuid;
				}
				return data;
			},
			openWin: function () {
				ufma.open({
					url: 'crossBookDaily.html',
					title: "跨账簿业务登账",
					width: 1090,
					data: {
						"agencyCode": agencyCode,
						"acctCode": acctCode,
						"setYear": ptData.svSetYear,
						"rgCode": ptData.svRgCode,
						"accountbookGuid": sendObj.accountbookGuid,
						"action": "add",
						"jouDate": ptData.svTransDate,
						"accItemObj": accItemObj
					},
					ondestory: function (data) {
						$('#queryAll').trigger('click');
						if (data.action == "saveadd") {
							$('#btnDaliy').trigger('click');
						}
					}
				})
			},
			//打开编辑界面窗口
			openEditWin: function (oneData, linkJouGuid, linkGuidsArr, mainGuid, rowData) {
				var canEdit = 1;
				//已对账 已生成凭证 
				if ((oneData.isCheck == 1) || (!$.isNull(oneData.linkVouGuid)) && oneData.linkModule != 'GL') {
					canEdit = 0;
				} else if (!$.isNull(oneData.linkGuid) || (oneData.linkModule == 'GL') || (oneData.linkModule == 'LP')) {
					//出纳从账务取数和国库生成允许修改摘要和经办人
					canEdit = 1;
				} else {
					canEdit = 2;
				}
				ufma.open({
					url: 'crossBookDaily.html',
					title: '跨账簿业务处理',
					width: 1090,
					data: {
						"agencyCode": agencyCode,
						"acctCode": acctCode,
						"setYear": ptData.svSetYear,
						"rgCode": ptData.svRgCode,
						"bookinType": oneData.recordType,
						"balance": balance,
						"oneData": oneData,
						"action": "edit",
						"jouDate": ptData.svTransDate,
						"linkJouGuid": linkJouGuid,
						"linkGuidsArr": linkGuidsArr,
						"accItemObj": accItemObj,
						"canEdit": canEdit,
						/* bug81248--出纳登记出纳账登账之后改日期凭证号会变--编辑修改保存时增加参数jouGuid--zsj*/
						"mainGuid": mainGuid,
						"rowData": rowData
					},
					ondestory: function (data) {
						$('#queryAll').trigger('click');
						if (data.action == "saveadd") {
							$('#btnDaliy').trigger('click');
						}
					}
				})
			},
			//预览打开弹窗SummaryGenerate=="1"是汇总生成
			openPreviewWindow: function (previewData) {
				var urlPath = "";
				ufma.open({
					url: urlPath + '/pf/gl/vou/index.html?menuid=f24c3333-9799-439a-94c9-f0cdf120305d&action=preview&preview=1&dataFrom=vouBox',
					title: '凭证生成',
					width: 1300,
					data: page.deleVouGuid(previewData),
					ondestory: function (data) {
						var delDt = [];
						//窗口关闭时回传的值
						if (data.action && data.action.action == "save") {
							// var argu = {};
							// argu.sysId = "CU";
							// argu.billType = "01";
							// argu.vouHeadList = data.action.data;
							// argu.setYear = ptData.svSetYear;
							// argu.rgCode = ptData.svRgCode;
							// argu.agencyCode = agencyCode;
							var argu = {
								"agencyCode": $('#cbAgency').getObj().getValue(),
								"acctCode": acctCode,
								"setYear": ptData.svSetYear,
								"rgCode": ptData.svRgCode,
								"userId": ptData.svUserId,
								"userCode": ptData.svUserCode,
								"roleId": ptData.svRoleId,
								"roleCode": ptData.svRoleCode,
								"mainGuids": delDt,
								"sysId": "CU",
								"isMain": true,
								"vouHeadList": data.action.data,
								"generate": 1
							}
							$("#gridGOV tbody tr").each(function (index, row) {
								var $chk = $(this).find("input[type='checkbox']");
								if ($chk.is(":checked") == true) {
									var mainGuid = $(this).find('.viewData').attr('data-index');
									delDt[delDt.length] = mainGuid;
								}
							});
							argu.mainGuids = delDt;
							dm.prebulidVou(argu, function (result) {
								ufma.showTip(result.msg, function () {
									$('#queryAll').trigger('click');
								}, 'success');
							});
						}
					}
				});
			},
			//票据类型
			reqBillType: function () {
				var argu = {
					agencyCode: agencyCode,
					setYear: ptData.svSetYear,
					rgCode: ptData.svRgCode,
					eleCode: "BILLTYPE"
				};
				dm.cbbAccItem(argu, function (result) {
					$('#billTypeCode').ufTreecombox({
						idField: 'code',
						textField: 'codeName',
						pIdField: 'pCode', //可选
						//placeholder: '请选择票据类型',
						leafRequire: true,
						readonly: false,
						data: result.data,
						onComplete: function (sender) {

						}
					});
				});
			},
			//单位账套下启用辅项
			reqAccitem: function () {
				var argu = {
					agencyCode: agencyCode,
					setYear: ptData.svSetYear,
					rgCode: ptData.svRgCode,
					acctCode: acctCode
				};
				dm.getAccitem(argu, function (result) {
					console.log(result.data);
					var accItems = result.data;
					for (var i = 0; i < accItems.length; i++) {
						accItemObj[accItems[i].accItemName] = accItems[i].accItemCode;
					}
				});
			},
			// 记录/修改合并方式数据
			configupdate: function (value) {
				var data = {
					"agencyCode": agencyCode,
					"acctCode": value.acctCode,
					"menuId": "4c4f64f8-e810-46f6-9757-1591c50188f5",
					"configKey": "switchStyleData",
					"configValue": JSON.stringify(value.mParam)
				}
				ufma.ajaxDef('/pub/user/menu/config/update', "post", data, function (data) { })
			},
			// 获取记忆的合并方式数据
			getRememberData: function (callback) {
				ptData.rememberData = {};
				var argu = {
					agencyCode: agencyCode,
					acctCode: isNeedAcct ? acctCode : sendObj.acctCode,
					menuId: "4c4f64f8-e810-46f6-9757-1591c50188f51"
				};
				ufma.get("/pub/user/menu/config/select", argu, function (result) {
					ptData.rememberData = result.data;
					callback(result.data)
				})
			},
			//set remember的值
			setRememberData: function (data) {
				var switchStyleData = (!data.switchStyleData || data.switchStyleData === {}) ? false : JSON.parse(data.switchStyleData);
				if (switchStyleData) {
					for (var key in switchStyleData) {
						if (switchStyleData[key]) {
							$("input[name='" + key + "']").prop("checked", true);
						} else {
							$("input[name='" + key + "']").prop("checked", false);
						}
					}
				} else {
					$("input[name='isMergerDr']").prop("checked", false);
					$("input[name='isMergerCr']").prop("checked", false);
					$("input[name='isMergerAcc']").prop("checked", false);
					$("input[name='onlyDescpt']").prop("checked", false);
					$("input[name='isDescptAppend']").prop("checked", false);
				}
			},
			onEventListener: function () {
				ufma.searchHideShow($('#gridGOV'));
				// 编辑按钮切换样式
				$('#btnSwitch').ufTooltip({
					trigger: 'click', //click|hover
					opacity: 1,
					confirm: false,
					gravity: 'north', //north|south|west|east
					content: "#switchStyle"
				});
				// 合并方式change事件（借方 贷方 辅助核算合并 摘要累加 摘要相同时合并）
				$("#switchStyle").on("change", "input[type='checkbox']", function () {
					if ($(this).attr("name") == "onlyDescpt") { // 点击摘要相同时合并
						if ($(this).prop("checked")) { // 勾选摘要相同时合并
							$(this).parents("#switchStyle").find("input[name='isMergerDr']").prop("checked", true);
							$(this).parents("#switchStyle").find("input[name='isMergerCr']").prop("checked", true);
							$(this).parents("#switchStyle").find("input[name='isMergerAcc']").prop("checked", true);
							// 借方 贷方 辅助核算合并 摘要相同时合并 全部勾选时  摘要累加取消勾选且不可用
							$("#DescptAppend").find("input[name='isDescptAppend']").removeAttr("checked");
							$("#DescptAppend").find("input[name='isDescptAppend']").attr("disabled", true);
						} else { // 取消勾选摘要相同时合并
							$("#DescptAppend").find("input[name='isDescptAppend']").attr("disabled", false);
						}
					} else if ($(this).attr("name") == "isMergerAcc") { // 点击辅助核算合并
						if ($(this).parents("#switchStyle").find("input[name='onlyDescpt']").prop("checked") == true) {
							$(this).prop("checked", true); // 摘要相同时合并勾选状态时，辅助核算合并不可取消勾选
						} else if ($(this).prop("checked")) { // 摘要相同时合并未勾选状态时，勾选借方/贷方
							$(this).parents("#switchStyle").find("input[name='isMergerDr']").prop("checked", true);
							$(this).parents("#switchStyle").find("input[name='isMergerCr']").prop("checked", true);
						}
					} else if ($(this).attr("name") == "isMergerCr" || $(this).attr("name") == "isMergerDr") { // 点击借方/贷方
						if ($(this).parents("#switchStyle").find("input[name='isMergerAcc']").prop("checked") == true) {
							$(this).prop("checked", true); // 辅助核算合并勾选状态时，借方/贷方不可取消勾选
						}
					}
					// 勾选借方/贷方/辅助核算合并任意一个时，摘要累加可以勾选，如果这三个选项都没有勾选，摘要累加取消勾选且不可用；
					if ($(this).parents("#switchStyle").find("input[name='isMergerCr']").prop("checked") || $(this).parents("#switchStyle").find("input[name='isMergerDr']").prop("checked") || $(this).parents("#switchStyle").find("input[name='isMergerAcc']").prop("checked")) {
						if ($(this).parents("#switchStyle").find("input[name='onlyDescpt']").prop("checked")) {
							$("#DescptAppend").find("input[name='isDescptAppend']").attr("disabled", true);
						} else {
							$("#DescptAppend").find("input[name='isDescptAppend']").attr("disabled", false);
						}
					} else {
						$("#DescptAppend").find("input[name='isDescptAppend']").removeAttr("checked");
						$("#DescptAppend").find("input[name='isDescptAppend']").attr("disabled", true);
					}
				});

				$('#btnDaliy').on('click', function () {
					page.openWin();
				})
				//主界面 查询
				$('#queryAll').on('click', function () {
					/*bug81043 【20190610 财务云8.0 广东省财政厅】登记出纳账页面的时间选择可以选择例如“2019-06-01”至“2019-03-01”这种错误时间区间而且系统不会提示，该区间查询出来不会显示任何结果--zsj*/
					if ($('#startJouDate').getObj().getValue() > $('#endJouDate').getObj().getValue()) {
						ufma.showTip('开始日期不能大于结束日期！', function () { }, 'warning');
						return false;
					}
					if (!$.isNull($('input[name="minMoney"]').val()) && !$.isNull($('input[name="maxMoney"]').val())) {
						var moneyfrom = $('input[name="minMoney"]').val().replace(/,/g, "");
						var moneyto = $('input[name="maxMoney"]').val().replace(/,/g, "");
						if (parseFloat(moneyfrom) > parseFloat(moneyto)) {
							ufma.showTip('开始金额不能大于结束金额！', function () { }, 'error');
							return false;
						}
					}
					page.loadGrid();
					// page.initGrid();
				})
				//表头全选
				$("body").on("click", 'input#check-head', function () {
					var flag = $(this).prop("checked");
					if (flag) {
						$("#gridGOV").find("tbody tr").addClass("selected").nextUntil("tr").addClass("selected");
					} else {
						$("#gridGOV").find("tbody tr").removeClass("selected").nextUntil("tr").removeClass("selected");
					}
					$("#gridGOV_wrapper").find('input.check-all').prop('checked', flag);
					$("#all").prop('checked', flag)
				});
				//全选
				$("#all").on("click", function () {
					var flag = $(this).prop("checked");
					$("#gridGOV_wrapper").find('input.check-all').prop('checked', flag);
					$("#check-head").prop('checked', flag)
					if (flag) {
						$("#gridGOV").find("tbody tr").addClass("selected").nextUntil("tr").addClass("selected");
					} else {
						$("#gridGOV").find("tbody tr").removeClass("selected").nextUntil("tr").removeClass("selected");
					}
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
					var $tr = $(this).parents("tr");
					$tr.toggleClass("selected");
				});
				//删除
				$('#delete').on('click', function () {
					var delDt = [];
					linkGuidsArr = [];
					var state;
					$("#gridGOV tbody tr").each(function (index, row) {
						var $chk = $(this).find("input[type='checkbox']");
						if ($chk.is(":checked") == true) {
							var mainGuid = $(this).find('.viewData').attr('data-index');
							//可删除
							delDt[delDt.length] = mainGuid;
						}
					});
					var argu = {
						agencyCode: agencyCode,
						setYear: ptData.svSetYear,
						rgCode: ptData.svRgCode,
						mainGuids: delDt
					};
					//点击确定的回调函数
					dm.delete(argu, function (result) {
						if (result.flag == 'success') {
							ufma.showTip('删除成功！', function () {
								$('#queryAll').trigger('click');
							}, 'success');
						}
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
				//选择期间，改变日历控件的值
				$("#dateBq").on("click", function () {
					page.dateBenQi("startJouDate", "endJouDate");
				});
				$("#dateBn").on("click", function () {
					page.dateBenNian("startJouDate", "endJouDate");
				});
				$("#dateJr").on("click", function () {
					page.dateToday("startJouDate", "endJouDate");
				});
				//打开编辑界面
				$(document).on('click', '.viewData', function (e) {
					linkGuidsArr = [];
					var tempIndex = $(this).attr('data-index');
					var tempData = rowTableData[tempIndex];
					var mainGuid = $(this).attr('data-index');
					var linkJouGuid = tempData.linkJouGuid;
					var cashType;
					var num = tempData.jouNo;
					var argu = {
						agencyCode: agencyCode,
						setYear: ptData.svSetYear,
						rgCode: ptData.svRgCode,
						acctCode: acctCode,
						mainGuid: mainGuid
					};
					if (!$.isNull(linkJouGuid)) {
						linkGuidsArr.push({
							"seq": num,
							"linkJouGuid": linkJouGuid
						});
					}
					dm.cbbGetone(argu, function (result) {
						var oneData = result.data;
						/* bug81248--出纳登记出纳账登账之后改日期凭证号会变--编辑修改保存时增加参数jouGuid--zsj*/
						page.openEditWin(oneData, linkJouGuid, linkGuidsArr, mainGuid, tempData);

					});
				});
				//生成凭证--新需求---------merge:是否合并生成（1是、0否）
				$('#createVou').on('click', function () {
					generateID = 'createVou';
					var delDt = [];
					var vouTypeNameNo = '';
					$("#gridGOV tbody tr").each(function (index, row) {
						var $chk = $(this).find("input[type='checkbox']");
						if ($chk.is(":checked") == true) {
							var tempIndex = $(this).find('.viewData').attr('data-index');
							var tempData = rowTableData[tempIndex];
							var mainGuid = tempData.mainGuid;
							vouTypeNameNo = tempData.vouTypeNameNo;
							if (!$.isNull(vouTypeNameNo)) { //当选中多行数据时，凭证字号是否为空用标志表示
								page.vouTypecan = '1';
							} else {
								page.vouTypecant = '2';
							}
							delDt[delDt.length] = mainGuid;
						}
					});
					if (delDt.length > 1) {
						ufma.showTip('只能选择一条数据生成凭证!', function () { }, 'warning');
						return false;
					} else if (delDt.length == 0) {
						ufma.showTip('请先选择一条数据!', function () { }, 'warning');
						return false;
					} else {
						// var arguVou = {
						// 	"agencyCode": $('#cbAgency').getObj().getValue(),
						// 	mainGuids: delDt,
						// 	"generate": "0",
						// 	"isMain": true,
						// }
						var arguVou = {
							"agencyCode": $('#cbAgency').getObj().getValue(),
							"acctCode": acctCode,
							"setYear": ptData.svSetYear,
							"rgCode": ptData.svRgCode,
							"userId": ptData.svUserId,
							"userCode": ptData.svUserCode,
							"roleId": ptData.svRoleId,
							"roleCode": ptData.svRoleCode,
							"mainGuids": delDt,
							"sysId": "CU",
							"generate": "1",
							"isMain": true
						}
						var inputs = $("#switchStyle ").find("input");
						var len = inputs.length;
						arguVou.mParam = {};
						for (var i = 0; i < len; i++) {
							if ($("#switchStyle ").find("input").eq(i).is(':checked')) {
								arguVou.mParam[$("#switchStyle ").find("input").eq(i).attr("name")] = true;
							} else {
								arguVou.mParam[$("#switchStyle ").find("input").eq(i).attr("name")] = false;
							}
						}

						//凭证类型--zsj--bug80697 【20190605 广东省财政厅】手工登账的日记账界面的凭证号无法手工录入
						if (page.vouTypecan == '1') {
							ufma.confirm('已存在凭证号，是否还需要生成凭证，生成凭证后覆盖原凭证号？', function (action) {
								if (action) {
									dm.previewVou(arguVou, function (result) {
										if (!$.isNull(result.data)) {
											previewData = result.data;
										}
										if (result.flag == "success") { // 返回成功 记忆合并方式
											page.configupdate(arguVou);
										}
										page.openPreviewWindow(previewData);
									});
								} else {
									//点击取消的回调函数
								}
								page.vouTypecan = '';
								page.vouTypecant = '';
							}, {
									type: 'warning'
								});
						} else {
							dm.previewVou(arguVou, function (result) {
								if (!$.isNull(result.data)) {
									previewData = result.data;
								}
								if (result.flag == "success") { // 返回成功 记忆合并方式
									page.configupdate(arguVou);
								}
								page.openPreviewWindow(previewData);
							});
						}
					}


				});
				//合并生成凭证--新需求---------merge:是否合并生成（1是、0否）
				$('#mergeCreateVou').on('click', function () {
					generateID = 'mergeCreateVou';
					var delDt = [];
					var vouTypeNameNo = '';
					var recordTypeArr = [];
					var temp = ["1", "2"];
					$("#gridGOV tbody tr").each(function (index, row) {
						var $chk = $(this).find("input[type='checkbox']");
						if ($chk.is(":checked") == true) {
							var tempIndex = $(this).find('.viewData').attr('data-index');
							var tempData = rowTableData[tempIndex];
							var mainGuid = tempData.mainGuid;
							vouTypeNameNo = tempData.vouTypeNameNo;
							if (!$.isNull(vouTypeNameNo)) { //当选中多行数据时，凭证字号是否为空用标志表示
								page.vouTypecan = '1';
							} else {
								page.vouTypecant = '2';
							}
							var recordType = tempData.recordType;
							recordTypeArr.push(recordType);
							if (ufma.arrayContained(recordTypeArr, temp)) {
								delDt[0] = 0;
							}
							delDt[delDt.length] = mainGuid;
						}
					});
					if (delDt[0] == 0) {
						ufma.showTip('请选择日常或期初日记账中的一种生成凭证!', function () { }, 'warning');
						return false;
					} else {
						//账套是否为生成前预览
						if (sendObj.isPreview == 1) {
							if (delDt.length == 0) {
								ufma.showTip('请选择要生成凭证的数据！', function () { }, 'warning');
								return false;
							} else {
								// var arguVou = {
								// 	"agencyCode": $('#cbAgency').getObj().getValue(),
								// 	mainGuids: delDt,
								// 	"generate": "1",
								// 	"isMain": true,
								// }
								var arguVou = {
									"agencyCode": $('#cbAgency').getObj().getValue(),
									"acctCode": acctCode,
									"setYear": ptData.svSetYear,
									"rgCode": ptData.svRgCode,
									"userId": ptData.svUserId,
									"userCode": ptData.svUserCode,
									"roleId": ptData.svRoleId,
									"roleCode": ptData.svRoleCode,
									"mainGuids": delDt,
									"sysId": "CU",
									"generate": "1",
									"isMain": true
								}
								var inputs = $("#switchStyle ").find("input");
								var len = inputs.length;
								arguVou.mParam = {};
								for (var i = 0; i < len; i++) {
									if ($("#switchStyle ").find("input").eq(i).is(':checked')) {
										arguVou.mParam[$("#switchStyle ").find("input").eq(i).attr("name")] = true;
									} else {
										arguVou.mParam[$("#switchStyle ").find("input").eq(i).attr("name")] = false;
									}
								}

								//凭证类型--zsj--bug80697 【20190605 广东省财政厅】手工登账的日记账界面的凭证号无法手工录入
								if (page.vouTypecan == '1') {
									ufma.confirm('已存在凭证号，是否还需要生成凭证，生成凭证后覆盖原凭证号？', function (action) {
										if (action) {
											dm.previewVou(arguVou, function (result) {
												if (!$.isNull(result.data)) {
													previewData = result.data;
												}
												if (result.flag == "success") { // 返回成功 记忆合并方式
													page.configupdate(arguVou);
												}
												page.openPreviewWindow(previewData);
											});
										} else {
											//点击取消的回调函数
										}
										page.vouTypecan = '';
										page.vouTypecant = '';
									}, {
											type: 'warning'
										});
								} else {
									dm.previewVou(arguVou, function (result) {
										if (!$.isNull(result.data)) {
											previewData = result.data;
										}
										if (result.flag == "success") { // 返回成功 记忆合并方式
											page.configupdate(arguVou);
										}
										page.openPreviewWindow(previewData);
									});
								}

							}
						} else {
							if (delDt.length == 0) {
								ufma.showTip('请选择要合并生成凭证的数据！', function () { }, 'warning');
								return false;
							} else {
								// var argu = {
								// 	"agencyCode": $('#cbAgency').getObj().getValue(),
								// 	mainGuids: delDt,
								// 	merge: 1,
								// 	"isMain": true,
								// }
								var argu = {
									"agencyCode": $('#cbAgency').getObj().getValue(),
									"acctCode": acctCode,
									"setYear": ptData.svSetYear,
									"rgCode": ptData.svRgCode,
									"userId": ptData.svUserId,
									"userCode": ptData.svUserCode,
									"roleId": ptData.svRoleId,
									"roleCode": ptData.svRoleCode,
									"mainGuids": delDt,
									"sysId": "CU",
									"generate": "1",
									"isMain": true,
									merge: 1,
								}
								var inputs = $("#switchStyle ").find("input");
								var len = inputs.length;
								argu.mParam = {};
								for (var i = 0; i < len; i++) {
									if ($("#switchStyle ").find("input").eq(i).is(':checked')) {
										argu.mParam[$("#switchStyle").find("input").eq(i).attr("name")] = true;
									} else {
										argu.mParam[$("#switchStyle").find("input").eq(i).attr("name")] = false;
									}
									
								}
								//凭证类型--zsj--bug80697 【20190605 广东省财政厅】手工登账的日记账界面的凭证号无法手工录入
								if (page.vouTypecan == '1') {
									ufma.confirm('已存在凭证号，是否还需要生成凭证，生成凭证后覆盖原凭证号？', function (action) {
										if (action) {
											dm.createVou(argu, function (result) {
												if (result.flag == "success") {
													ufma.showTip(result.msg, function () { }, 'success');
													page.loadGrid();
													page.configupdate(argu); // 返回成功 记忆合并方式
												} else {
													ufma.showTip(result.msg, function () { }, 'warning');
												}
											});
										} else {
											//点击取消的回调函数
										}
										page.vouTypecan = '';
										page.vouTypecant = '';
									}, {
											type: 'warning'
										});
								} else {
									dm.previewVou(argu, function (result) {
										if (result.flag == "success") {
											if (!$.isNull(result.data)) {
												previewData = result.data;
											}
											page.configupdate(argu); // 返回成功 记忆合并方式
											page.openPreviewWindow(previewData);
										} else {
											ufma.showTip(result.msg, function () { }, 'warning');
										}
									});
								}
							}
						}
					}

				});
				//取消生成---新需求
				$('#cancleVou').on('click', function () {
					var delDt = [];
					$("#gridGOV tbody tr").each(function (index, row) {
						var $chk = $(this).find("input[type='checkbox']");
						if ($chk.is(":checked") == true) {
							var mainGuid = $(this).find('.viewData').attr('data-index');
							delDt[delDt.length] = mainGuid;
						}
					});
					if (delDt.length == 0) {
						ufma.showTip('请选择要取消生成凭证的数据！', function () { }, 'warning');
						return false;
					} else {
						var argu = {
							"agencyCode": $('#cbAgency').getObj().getValue(),
							"setYear": ptData.svSetYear,
							"rgCode": ptData.svRgCode,
							"mainGuids": delDt,
							"isMain": true
						}
						dm.cancelVou(argu, function (result) {
							if (result.flag == "success") {
								ufma.showTip(result.msg, function () { }, 'success');
								page.loadGrid();
							} else {
								ufma.showTip(result.msg, function () { }, 'warning');
							}
						})
					}
				});
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
			//重构
			initPageNew: function () {
				$('#showMethodTip').click(function () {
					$('#rptPlanList').removeClass('hide');
					if (sendObj.accountBookType == '3') { //零余额	
						$('#gksc').removeClass('hide');
						$('#importRJZ').removeClass('hide');
						$('#importRJZ').css({
							'margin-top': '30px',
							'height': '22px',
							'float': 'left',
							'margin-left': '-90px',
							'border-top': '1px solid #D9D9D9',
							'width': '78px',
							'text-align': 'center'
						});
						$('#tixian').addClass('hide');
						$('#cunxian').addClass('hide');
						$('#zanwu').addClass('hide');
					} else if (sendObj.accountBookType == '1') { //现金
						$('#gksc').addClass('hide');
						$('#importRJZ').removeClass('hide');
						$('#importRJZ').css({
							'margin-top': '57px',
							'height': '22px',
							'float': 'left',
							'margin-left': '-52px',
							'border-top': '1px solid #D9D9D9',
							'width': '44px'
						});
						$('#tixian').removeClass('hide');
						$('#cunxian').removeClass('hide');
						$('#zanwu').addClass('hide');
					} else if (sendObj.accountBookType == '2') { //银行
						$('#gksc').addClass('hide');
						$('#tixian').addClass('hide');
						$('#cunxian').addClass('hide');
						$('#zanwu').addClass('hide');
						$('#importRJZ').removeClass('hide');
						$('#importRJZ').css({
							'margin-top': '10px',
							'height': '22px',
							'float': 'left',
							'margin-left': '0px',
							'border-top': 'none',
							'width': '44px'
						});
					} else {
						$('#gksc').addClass('hide');
						$('#tixian').addClass('hide');
						$('#cunxian').addClass('hide');
						$('#zanwu').removeClass('hide');
						$('#importRJZ').addClass('hide');
					}
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
				ptData = ufma.getCommonData();
				this.initPage();
				page.initAgencyScc();

				page.initGrid();
				// 初始化时取缓存中记录的行数信息
				serachData.pageSize = parseInt(localStorage.getItem("crossBookPageSize")) ? parseInt(localStorage.getItem("crossBookPageSize")) : 20;
				page.initPageNew();
				this.onEventListener();
				ufma.parseScroll();
				ufma.parse();
				var timeId = setTimeout(function () {
					for (var i = 0; i < $('input').length; i++) {
						$('input:not([autocomplete]),textarea:not([autocomplete]),select:not([autocomplete])').attr('autocomplete', 'off');
					}
					clearTimeout(timeId);
				}, 500);

			}
		}
	}();

	/////////////////////
	page.init();
});