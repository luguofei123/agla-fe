$(function () {
	var oTable,
		ptData,
		agencyCode = '', //post数据
		setYear,
		rgCode;
	var needArr = [];
	var requiredAccarray = [];
	var balByAccitemArr = [];
	var isBalByAccitem = '';
	var isNeedAcct;
	var acctCode = '';
	var serachData = { // 修改为后端分页
		currentPage: 1,
		pageSize: 20,
	};
	var tableData; //表格数据
	var pageLength = ufma.dtPageLength('#gridGOV');
	var page = function () {
		return {
			initPage: function () {
				page.reslist = ufma.getPermission();
				ufma.isShow(page.reslist);
				page.cbAgency = $('#cbAgency').ufmaTreecombox2({
					valueField: 'id', //可选
					textField: 'codeName', //可选
					readonly: false, //添加后保证可以对单位进行输入搜索
					pIdField: 'pId', //可选
					placeholder: "请选择单位",
					icon: 'icon-unit',
					theme: 'label',
					leafRequire: true,
					onchange: function (data) {
						agencyCode = data.code;
						agencyName = data.name;

						//80827 【财务云8.0 鄂尔多斯 】20190630所有页面，单位或账套选择变化后，再打开其它页面时，自动显示为最近一次选择的单位或账套。--zsj
						//缓存单位
						var params = {
							selAgecncyCode: agencyCode,
							selAgecncyName: agencyName
						}
						ufma.setSelectedVar(params);
						page.checkNeedAcct();
					}
				});
				ufma.ajaxDef("/cu/common/eleAgency/getAgencyTree" + "?setYear=" + ptData.svSetYear + "&rgCode=" + ptData.svRgCode, "get", "", function (result) {
					page.cbAgency = $("#cbAgency").ufmaTreecombox2({
						data: result.data
					});
					var agyCode = $.inArrayJson(result.data, "id", ptData.svAgencyCode);
					if (agyCode != undefined) {
						page.cbAgency.val(ptData.svAgencyCode);
					} else {
						page.cbAgency.val(result.data[0].id);
					}
				});
				// 初始化时取缓存中记录的行数信息
				serachData.pageSize = parseInt(localStorage.getItem("bookManagePageSize")) ? parseInt(localStorage.getItem("bookManagePageSize")) : 20;
			},
			//定义表头
			gridHeader: function (type) {
				if (type == "2" || type == "3") {
					var columns = [{
						title: '<label class="mt-checkbox mt-checkbox-single mt-checkbox-outline"> <input type="checkbox"' + 'class="datatable-group-checkable" id="check-head"/>&nbsp;<span></span> </label>',
						className: 'tc nowrap check-style no-print',
						render: function (data, type, rowdata, meta) {
							return "<label class='mt-checkbox mt-checkbox-single mt-checkbox-outline'> <input type='checkbox' class='check-all' Guid=" + rowdata.accountbookGuid + " isLeaf=" + rowdata.isLeaf + " index=" + meta.row + " value='0' /> &nbsp;<span></span> </label>";
						}
					},
					{
						title: "序号",
						width: 44,
						className: 'nowrap tc isprint',
						"render": function (data, type, rowdata, meta) {
							var index = meta.row + 1
							return "<span>" + index + "</span>";
						}
					},
					{
						title: "账簿代码",
						data: "accountbookCode",
						className: 'nowrap isprint'
					},
					{
						title: "账簿名称",
						data: "accountbookName",
						className: 'nowrap isprint'
					},
					{
						title: "账簿类型",
						data: 'accountbookType',
						className: 'nowrap isprint',
						render: function (data, type, rowdata, meta) {
							if (data == '2') {
								data = "银行账簿";
							} else if (data == '1') {
								data = "现金账簿";
							} else if (data == '3') {
								data = "零余额账簿";
							} else {
								data = "全部";
							}
							return data;
						}
					},
					{
						title: "币种",
						//data: 'curCode',
						data: 'curName', //bug79439--显示外币：code name形式
						className: 'nowrap isprint'
					},
					{
						title: "账套",
						data: "acctName",
						className: 'nowrap isprint',
						width: 100
					},

					{
						title: "科目",
						data: 'accoName',
						className: 'nowrap isprint'
					},
					{
						title: "上级账簿",
						data: 'parentName',
						className: 'nowrap isprint'
					},
					{
						title: "银行",
						data: 'bankName',
						className: 'nowrap isprint'
					},
					{
						title: "账号",
						data: 'bankId',
						className: 'nowrap isprint'
					},
					{
						title: "地址",
						data: 'bankAddress',
						className: 'nowrap isprint'
					},
					{
						title: "从总账提取数据",
						data: 'isPickdata',
						className: 'nowrap isprint',
						render: function (data, type, rowdata, meta) {
							if (data == '1') {
								data = "是";
							} else {
								data = "否";
							}
							return data;
						}
					},
					{
						title: "编号生成方式",
						data: 'numType',
						className: 'nowrap isprint',
						render: function (data, type, rowdata, meta) {
							if (data == '2') {
								data = "按月生成";
							} else if (data == '1') {
								data = "按日生成";
							}
							return data;
						}
					},
					{
						title: "摘要必填",
						data: 'isSummaryneed',
						className: 'nowrap isprint',
						render: function (data, type, rowdata, meta) {
							if (data == '1') {
								data = "是";
							} else {
								data = "否";
							}
							return data;
						}
					},
					{
						title: "备注",
						data: 'remark',
						className: 'nowrap isprint'
					},
					{
						title: "状态",
						data: 'enabledName',
						className: 'nowrap isprint'
					},
					{
						title: "操作",
						data: "opt",
						width: 100,
						className: 'nowrap tc no-print',
						render: function (data, type, rowdata, meta) {
							var btns = '<a class="btn btn-icon-only btn-sm btn-permission icon-edit f16 btn-edit" isLeaf="' + rowdata.isLeaf + '" accountbookGuid="' + rowdata.accountbookGuid + '" rowindex="' + meta.row + '" data-toggle="tooltip" title="修改">';
							if (rowdata.enabled == "1") {
								btns = btns + '<a class="btn btn-icon-only btn-sm btn-permission icon-ban f16 btn-stop"  isLeaf="' + rowdata.isLeaf + '" accountbookGuid="' + rowdata.accountbookGuid + '" rowindex="' + meta.row + '" data-toggle="tooltip" title="停用">';
							} else {
								btns = btns + '<a class="btn btn-icon-only btn-sm btn-permission icon-play f16 btn-start"  isLeaf="' + rowdata.isLeaf + '" accountbookGuid="' + rowdata.accountbookGuid + '" rowindex="' + meta.row + '" data-toggle="tooltip" title="启用">';
							}
							btns = btns + '<a class="btn btn-icon-only btn-sm btn-permission icon-trash f16 btn-delete"  isLeaf="' + rowdata.isLeaf + '" accountbookGuid="' + rowdata.accountbookGuid + '" rowindex="' + meta.row + '" data-toggle="tooltip" title="删除">';
							return btns;
						}
					}
					];
					//默认的表头
				} else {
					var columns = [{
						title: '<label class="mt-checkbox mt-checkbox-single mt-checkbox-outline"> <input type="checkbox"' + 'class="datatable-group-checkable" id="check-head"/>&nbsp;<span></span> </label>',
						className: 'tc nowrap check-style no-print',
						render: function (data, type, rowdata, meta) {
							return "<label class='mt-checkbox mt-checkbox-single mt-checkbox-outline'> <input type='checkbox' class='check-all' Guid=" + rowdata.accountbookGuid + " index=" + meta.row + " value='0' /> &nbsp;<span></span> </label>";
						}
					},
					{
						title: "序号",
						width: 44,
						className: 'nowrap tc isprint',
						"render": function (data, type, rowdata, meta) {
							var index = meta.row + 1
							return "<span>" + index + "</span>";
						}
					},
					{
						title: "账簿代码",
						data: "accountbookCode",
						className: 'nowrap isprint'
					},
					{
						title: "账簿名称",
						data: "accountbookName",
						className: 'nowrap isprint'
					},
					{
						title: "账簿类型",
						data: 'accountbookType',
						className: 'nowrap isprint',
						render: function (data, type, rowdata, meta) {
							if (data == '2') {
								data = "银行账簿";
							} else if (data == '1') {
								data = "现金账簿";
							} else if (data == '3') {
								data = "零余额账簿";
							} else {
								data = "全部";
							}
							return data;
						}
					},
					{
						title: "币种",
						//data: 'curCode',
						data: 'curName', //bug79439--显示外币：code name形式
						className: 'nowrap isprint'
					},
					{
						title: "账套",
						data: "acctName",
						className: 'nowrap isprint',
						width: 100
					},
					{
						title: "科目",
						data: 'accoName',
						className: 'nowrap isprint'
					},
					{
						title: "上级账簿",
						data: 'parentName',
						className: 'nowrap isprint'
					},
					{
						title: "从总账提取数据",
						data: 'isPickdata',
						className: 'nowrap isprint',
						render: function (data, type, rowdata, meta) {
							if (data == '1') {
								data = "是";
							} else {
								data = "否";
							}
							return data;
						}
					},
					{
						title: "编号生成方式",
						data: 'numType',
						className: 'nowrap isprint',
						render: function (data, type, rowdata, meta) {
							if (data == '2') {
								data = "按月生成";
							} else if (data == '1') {
								data = "按日生成";
							}
							return data;
						}
					},
					{
						title: "摘要必填",
						data: 'isSummaryneed',
						className: 'nowrap  isprint',
						render: function (data, type, rowdata, meta) {
							if (data == '1') {
								data = "是";
							} else {
								data = "否";
							}
							return data;
						}
					},
					{
						title: "备注",
						data: 'remark',
						className: 'nowrap  isprint'
					},
					{
						title: "状态",
						data: 'enabledName',
						className: 'nowrap isprint'
					},
					{
						title: "操作",
						data: "opt",
						width: 100,
						className: 'nowrap tc no-print',
						render: function (data, type, rowdata, meta) {
							var btns = '<a class="btn btn-icon-only btn-sm btn-permission icon-edit f16 btn-edit" isLeaf="' + rowdata.isLeaf + '" accountbookGuid="' + rowdata.accountbookGuid + '" rowindex="' + meta.row + '" data-toggle="tooltip" title="修改">';
							if (rowdata.enabled == "1") {
								btns = btns + '<a class="btn btn-icon-only btn-sm btn-permission icon-ban f16 btn-stop"  isLeaf="' + rowdata.isLeaf + '" accountbookGuid="' + rowdata.accountbookGuid + '" rowindex="' + meta.row + '" data-toggle="tooltip" title="停用">';
							} else {
								btns = btns + '<a class="btn btn-icon-only btn-sm btn-permission icon-play f16 btn-start"  isLeaf="' + rowdata.isLeaf + '" accountbookGuid="' + rowdata.accountbookGuid + '" rowindex="' + meta.row + '" data-toggle="tooltip" title="启用">';
							}
							btns = btns + '<a class="btn btn-icon-only btn-sm btn-permission icon-trash f16 btn-delete"  isLeaf="' + rowdata.isLeaf + '" accountbookGuid="' + rowdata.accountbookGuid + '" rowindex="' + meta.row + '" data-toggle="tooltip" title="删除">';
							return btns;
						}
					}
					];
				}
				return columns;
			},
			//初始化table
			initGrid: function (types) {
				var columns = page.gridHeader(types);
				if (oTable) {
					$('#gridGOV').closest('.dataTables_wrapper').ufScrollBar('destroy');
					oTable.fnDestroy();
					$("#gridGOV").html('')
				}
				oTable = $("#gridGOV").dataTable({
					"language": {
						"url": bootPath + "agla-trd/datatables/datatable.default.js"
					},
					"bFilter": true,
					"autoWidth": false,
					"bDestory": true,
					"processing": true, //显示正在加载中
					// "pagingType": "full_numbers", //分页样式
					// "lengthChange": true, //是否允许用户自定义显示数量p
					// "lengthMenu": [
					// 	[10, 20, 50, 100, 200, -1],
					// 	[10, 20, 50, 100, 200, "全部"]
					// ],
					"paging": false,
					// "pageLength": pageLength,
					"serverSide": false,
					"ordering": false,
					columns: columns,
					"columnDefs": [{
						"targets": [-2],
						"className": "isprint commonShow",
						"render": function (data, type, rowdata, meta) {
							if (rowdata.enabled == 1) {
								return '<span style="color:#00A854" title="' + data + '">' + data + '</span>';
							} else {
								return '<span style="color:#F04134" title="' + data + '">' + data + '</span>';
							}
						}
					}]
					,
					//填充表格数据
					data: [],
					dom: '<"datatable-toolbar"B>rt<"gridGOV-paginate"ilp>',
					buttons: [{
						extend: 'print',
						text: '<i class="glyphicon icon-print btn-permission btn-print" aria-hidden="true"></i>',
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
						text: '<i class="glyphicon icon-upload btn-permission btn-export" aria-hidden="true"></i>',
						exportOptions: {
							columns: '.isprint'
						},
						customize: function (xlsx) {
							var sheet = xlsx.xl.worksheets['sheet1.xml'];
						}
					}
					],
					initComplete: function (settings, json) {
						var toolBar = $(this).attr('tool-bar')
						var $info = $(toolBar + ' .info');
						if ($info.length == 0) {
							$info = $('<div class="info"></div>').appendTo($(toolBar + ' .tool-bar-body'));
						}
						$info.html('');
						$('.gridGOV-paginate').appendTo($info);

						$('.datatable-toolbar').appendTo('#dtToolbar');
						$("#dtToolbar .buttons-print").css("border-radius", "4px 0 0 4px").addClass("btn-export btn-permission").attr({
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
						page.reslist = ufma.getPermission();
						// console.log(page.reslist);
						ufma.isShow(page.reslist);					
					},
					drawCallback: function () {
						$('#gridGOV').find("td.dataTables_empty").text("")
							.append('<img src="' + bootPath + 'images/noData.png"/><br/><i>目前还没有你要查询的数据</i>');
						$("#check-head").prop('checked', false);
						$("#all").prop('checked', false);
						$('#gridGOV').closest('.dataTables_wrapper').ufScrollBar({
							hScrollbar: true,
							mousewheel: false
						});
						// 修改为后端分页
						if (!$.isNull(tableData)){
							var paging = tableData;
							uf.backendPaging(paging,"bookManage",serachData);
						}											
						ufma.setBarPos($(window));
						ufma.isShow(page.reslist);
					}
				});
			},
			//获取表格数据，accountbookType=全部 现金账簿 银行账簿 零余额账簿  
			typeSelect: function (accountbookType) {
				var datas = {
					'accountbookType': accountbookType,
					'agencyCode': agencyCode
				}
				if (isNeedAcct) {
					datas.acctCode = acctCode;
				}
				// 修改为后端分页
				pageLength = ufma.dtPageLength('#gridGOV');
				datas.currentPage = parseInt(serachData.currentPage);
				datas.pageSize = parseInt(serachData.pageSize) ? parseInt(serachData.pageSize) : 99999999; // 没有值时查全部
				//查询后记录当前选择的行数信息到缓存
				localStorage.removeItem("bookManagePageSize");
				localStorage.setItem("bookManagePageSize", datas.pageSize);
				ufma.post('/cu/cuAccountBook/select', datas, function (result) {
					tableData = result.data;
					argu = result.data.list;
					oTable.fnClearTable();
					if (argu.length > 0) {
						oTable.fnAddData(argu, true);
					}
					$('#gridGOV').closest('.dataTables_wrapper').ufScrollBar({
						hScrollbar: true,
						mousewheel: false
					});
					ufma.setBarPos($(window));
				});
			},
			onEventListener: function () {
				//搜索
				ufma.searchHideShow($('#gridGOV'));

				//四个按钮的点击
				$(".moneyType").on("click", function () {
					pageLength = ufma.dtPageLength('#gridGOV');
					//设置表头
					page.initGrid($(this).attr('type'))
					//获取表格数据
					page.typeSelect($(this).attr('type'));
				})

				//表头全选
				$("body").on("click", 'input#check-head', function () {
					var flag = $(this).prop("checked");
					$("#gridGOV_wrapper").find('input.check-all').prop('checked', flag);
					$("#all").prop('checked', flag);
				});
				//全选
				$("#all").on("click", function () {
					var flag = $(this).prop("checked");
					$("#gridGOV_wrapper").find('input.check-all').prop('checked', flag);
					$("#check-head").prop('checked', flag);
				});
				//单选
				$("body").on("click", 'input.check-all', function () {
					var num = 0;
					var arr = document.querySelectorAll('.check-all');
					for (var i = 0; i < arr.length; i++) {
						if (arr[i].checked) {
							num++
						}
					}
					if (num == arr.length) {
						$("#all").prop('checked', true);
						$("#check-head").prop('checked', true);
					} else {
						$("#all").prop('checked', false);
						$("#check-head").prop('checked', false);
					}
				});
				//批量删除

				$('#delete').on('click', function (e) {
					var checkedArray = [];
					$("#gridGOV .check-all:checked").each(function () {
						if ($(this).attr('isLeaf') != 0) {
							checkedArray.push($(this).attr('Guid'));
						}
					});
					if (checkedArray.length == 0) {
						ufma.showTip('请选择数据！', function () { }, 'warning');
					} else {
						ufma.confirm('您确定要删除选中的数据吗？', function (action) {
							if (action) {
								//点击确定的回调函数
								ufma.post('/cu/cuAccountBook/deleteByGuids', {
									"Guids": checkedArray
								}, function (result) {
									if (result.flag == 'success') {
										ufma.showTip('删除成功！', function () { }, 'success');
										$('.moneyType').each(function () {
											if ($(this).hasClass('selected')) {
												//获取表格数据
												page.typeSelect($(this).attr('type'));
											}
										})
									} else {
										ufma.showTip(result.msg, function () { }, 'success');
									}
								})
							}
						}, {
								type: 'warning'
							});

					}
				});
				//单独删除
				$('#gridGOV').on('click', '.btn-delete', function () {
					var isLeaf = $(this).attr('isLeaf');
					var accountbookGuid = $(this).attr('accountbookGuid');
					if (isLeaf == 0) {
						ufma.showTip('该账簿为上级账簿，不可删除！', function () { }, 'warning');
					} else {
						ufma.confirm('您确定要删除选中的数据吗？', function (action) {
							if (action) {
								//点击确定的回调函数
								ufma.post("/cu/cuAccountBook/deleteByGuid/" + accountbookGuid, {}, function (result) {
									if (result.flag == 'success') {
										ufma.showTip('删除成功！', function () { }, 'success');
										$('.moneyType').each(function () {
											if ($(this).hasClass('selected')) {
												//获取表格数据
												page.typeSelect($(this).attr('type'));
											}
										})
									}

								});
							}
						}, {
								type: 'warning'
							});
					}
				})
				//单独启用
				$('#gridGOV').on('click', '.btn-start', function () {
					var isLeaf = $(this).attr('isLeaf');
					var accountbookGuid = $(this).attr('accountbookGuid');
					var bookGuids = [];
					bookGuids.push(accountbookGuid);
					if (isLeaf == 0) {
						ufma.confirm('该账簿为上级账簿，启用后该账簿所有下级账簿将被同步启用，您确定要启用吗？', function (action) {
							if (action) {
								//点击确定的回调函数
								ufma.post("/cu/cuAccountBook/enable", {
									"bookGuids": bookGuids,
									"isEnableChildren": "1"
								}, function (result) {
									if (result.flag == 'success') {
										ufma.showTip('启用成功！', function () { }, 'success');
										$('.moneyType').each(function () {
											if ($(this).hasClass('selected')) {
												//获取表格数据
												page.typeSelect($(this).attr('type'));
											}
										})
									}
								});
							}
						}, {
								type: 'warning'
							});
					} else {
						ufma.confirm('您确定要启用选中的数据吗？', function (action) {
							if (action) {
								//点击确定的回调函数
								ufma.post("/cu/cuAccountBook/enable", {
									"bookGuids": bookGuids,
									"isEnableChildren": "1"
								}, function (result) {
									if (result.flag == 'success') {
										ufma.showTip('启用成功！', function () { }, 'success');
										$('.moneyType').each(function () {
											if ($(this).hasClass('selected')) {
												//获取表格数据
												page.typeSelect($(this).attr('type'));
											}
										})
									}

								});
							}
						}, {
								type: 'warning'
							});
					}
				})
				//批量启用
				$('#btnStart').on('click', function (e) {
					var checkedArray = [];
					var isContainTop = false;
					$("#gridGOV .check-all:checked").each(function () {
						if ($(this).attr('isLeaf') == 0) {
							isContainTop = true;
						}
						checkedArray.push($(this).attr('Guid'));
					});
					if (checkedArray.length == 0) {
						ufma.showTip('请选择数据！', function () { }, 'warning');
					} else if (isContainTop) { //选中账簿包含上级账簿的情况
						ufma.confirm('您选中的账簿中包含上级账簿，启用后该账簿所有下级账簿将被同步启用，您确定要启用吗？', function (action) {
							if (action) {
								//点击确定的回调函数
								ufma.post("/cu/cuAccountBook/enable", {
									"bookGuids": checkedArray,
									"isEnableChildren": "1"
								}, function (result) {
									if (result.flag == 'success') {
										ufma.showTip('启用成功！', function () { }, 'success');
										$('.moneyType').each(function () {
											if ($(this).hasClass('selected')) {
												//获取表格数据
												page.typeSelect($(this).attr('type'));
											}
										})
									} else {
										ufma.showTip(result.msg, function () { }, 'success');
									}
								})
							}
						}, {
								type: 'warning'
							});

					} else {
						ufma.confirm('您确定要启用选中的数据吗？', function (action) {
							if (action) {
								//点击确定的回调函数
								ufma.post("/cu/cuAccountBook/enable", {
									"bookGuids": checkedArray,
									"isEnableChildren": "1"
								}, function (result) {
									if (result.flag == 'success') {
										ufma.showTip('启用成功！', function () { }, 'success');
										$('.moneyType').each(function () {
											if ($(this).hasClass('selected')) {
												//获取表格数据
												page.typeSelect($(this).attr('type'));
											}
										})
									} else {
										ufma.showTip(result.msg, function () { }, 'success');
									}
								})
							}
						}, {
								type: 'warning'
							});
					}
				});
				//单独停用
				$('#gridGOV').on('click', '.btn-stop', function () {
					var isLeaf = $(this).attr('isLeaf');
					var accountbookGuid = $(this).attr('accountbookGuid');
					var bookGuids = [];
					bookGuids.push(accountbookGuid);
					if (isLeaf == 0) {
						ufma.confirm('该账簿为上级账簿，停用后该账簿所有下级账簿将被同步停用，您确定要停用吗？', function (action) {
							if (action) {
								//点击确定的回调函数
								ufma.post("/cu/cuAccountBook/disEnable", {
									"bookGuids": bookGuids,
									"isDisEnableChildren": "1"
								}, function (result) {
									if (result.flag == 'success') {
										ufma.showTip('停用成功！', function () { }, 'success');
										$('.moneyType').each(function () {
											if ($(this).hasClass('selected')) {
												//获取表格数据
												page.typeSelect($(this).attr('type'));
											}
										})
									}
								});
							}
						}, {
								type: 'warning'
							});
					} else {
						ufma.confirm('您确定要停用选中的数据吗？', function (action) {
							if (action) {
								//点击确定的回调函数
								ufma.post("/cu/cuAccountBook/disEnable", {
									"bookGuids": bookGuids,
									"isDisEnableChildren": "1"
								}, function (result) {
									if (result.flag == 'success') {
										ufma.showTip('停用成功！', function () { }, 'success');
										$('.moneyType').each(function () {
											if ($(this).hasClass('selected')) {
												//获取表格数据
												page.typeSelect($(this).attr('type'));
											}
										})
									}

								});
							}
						}, {
								type: 'warning'
							});
					}
				})
				//批量停用
				$('#btnStop').on('click', function (e) {
					var checkedArray = [];
					var isContainTop = false;
					$("#gridGOV .check-all:checked").each(function () {
						if ($(this).attr('isLeaf') == 0) {
							isContainTop = true;
						}
						checkedArray.push($(this).attr('Guid'));
					});
					if (checkedArray.length == 0) {
						ufma.showTip('请选择数据！', function () { }, 'warning');
					} else if (isContainTop) { //选中账簿包含上级账簿的情况
						ufma.confirm('您选中的账簿中包含上级账簿，停用后该账簿所有下级账簿将被同步停用，您确定要停用吗？', function (action) {
							if (action) {
								//点击确定的回调函数
								ufma.post("/cu/cuAccountBook/disEnable", {
									"bookGuids": checkedArray,
									"isDisEnableChildren": "1"
								}, function (result) {
									if (result.flag == 'success') {
										ufma.showTip('停用成功！', function () { }, 'success');
										$('.moneyType').each(function () {
											if ($(this).hasClass('selected')) {
												//获取表格数据
												page.typeSelect($(this).attr('type'));
											}
										})
									} else {
										ufma.showTip(result.msg, function () { }, 'success');
									}
								})
							}
						}, {
								type: 'warning'
							});

					} else {
						ufma.confirm('您确定要停用选中的数据吗？', function (action) {
							if (action) {
								//点击确定的回调函数
								ufma.post("/cu/cuAccountBook/disEnable", {
									"bookGuids": checkedArray,
									"isDisEnableChildren": "1"
								}, function (result) {
									if (result.flag == 'success') {
										ufma.showTip('停用成功！', function () { }, 'success');
										$('.moneyType').each(function () {
											if ($(this).hasClass('selected')) {
												//获取表格数据
												page.typeSelect($(this).attr('type'));
											}
										})
									} else {
										ufma.showTip(result.msg, function () { }, 'success');
									}
								})
							}
						}, {
								type: 'warning'
							});
					}
				});
				//编辑
				$('#gridGOV').on('click', '.btn-edit', function () {
					var type;
					$('.moneyType').each(function () {
						if ($(this).hasClass('selected')) {
							type = $(this).attr('type');
						}
					})
					var accountbookGuid = $(this).attr('accountbookGuid');
					var rowIndex = $(this).attr('rowindex');
					var needShowAccitem = oTable.api(false).row(rowIndex).data().needShowAccitem;
					var requiredAccitem = oTable.api(false).row(rowIndex).data().requiredAccitem;
					var balByAccitem = oTable.api(false).row(rowIndex).data().balByAccitem;
					var enabled = oTable.api(false).row(rowIndex).data().enabled;
					isBalByAccitem = oTable.api(false).row(rowIndex).data().isBalByAccitem;
					needArr = [];
					needArr = needShowAccitem.split(",");
					requiredAccarray = [];
					requiredAccarray = requiredAccitem.split(",");
					balByAccitemArr = [];
					balByAccitemArr = balByAccitem.split(",");
					//是否为上级账簿
					var isLeaf = $(this).attr('isLeaf');
					page.secondPage('账簿设置', accountbookGuid, type, isLeaf, 'edit',enabled);
				})

				//添加弹框
				$('#btnAdd').click(function () {
					needArr = [];
					requiredAccarray = [];
					balByAccitemArr = [];
					isBalByAccitem = '';
					page.secondPage('新增账簿', '', '', '', 'add','');
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
					page.typeSelect($(this).attr('type'));
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
						page.typeSelect($(this).attr('type'));
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
						page.typeSelect($(this).attr('type'));
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
						page.typeSelect($(this).attr('type'));
					}
				});
			},

			secondPage: function (title, accountbookGuid, type, isLeaf, action,enabled) {
				ufma.open({
					url: 'allCurSet/allCurSet.html',
					title: title,
					width: 910,
					height: 800,
					data: {
						'agencyCode': agencyCode,
						'accountbookGuid': accountbookGuid || '',
						'type': type,
						'needShowAccitem': needArr,
						'requiredAccitem': requiredAccarray,
						'balByAccitem': balByAccitemArr,
						'isBalByAccitem': isBalByAccitem,
						"isLeaf": isLeaf,
						"action": action,
						"enabled" : enabled
					},
					ondestory: function () {
						$('.moneyType').each(function () {
							if ($(this).hasClass('selected')) {
								//获取表格数据
								page.initGrid($(this).attr('type'))
								page.typeSelect($(this).attr('type'));
							}
						})

					}
				});
			},
			//获取系统选项-各界面需选择账套
			checkNeedAcct: function () {
				//ufma.get("/cu/sysRgpara/getBooleanByChrCode/CU002", {}, function (result) {
				ufma.get("/cu/sysRgpara/getBooleanByChrCode/CU002" + "/" + agencyCode, {}, function (result) { //CWYXM-11399 --系统管理-系统选项，出纳是否显示账套，设置为单位级控制，但仍然是由系统级控制--zsj
					isNeedAcct = result.data;
					if (isNeedAcct) {
						$("#acct").removeClass("hide");
						$("#cbAcct").ufCombox({
							idField: 'code',
							textField: 'codeName',
							readonly: false,
							placeholder: '请选择账套',
							icon: 'icon-book',
							theme: 'label',
							onChange: function (sender, data) {
								acctCode = $('#cbAcct').getObj().getValue();
								$('.moneyType').each(function () {
									if ($(this).hasClass('selected')) {
										//获取表格数据
										page.initGrid($(this).attr('type'))
										page.typeSelect($(this).attr('type'));
									}
								});
							},
							onComplete: function (sender) {
								if (ptData.svAcctCode) {
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
						callback = function (result) {
							$("#cbAcct").getObj().load(result.data);
						}
						ufma.get("/cu/common/eleCoacc/getCoCoaccs/" + agencyCode, argu, callback);

					} else {
						$("#acct").addClass("hide");
						$('.moneyType').each(function () {
							if ($(this).hasClass('selected')) {
								//获取表格数据
								page.initGrid($(this).attr('type'))
								page.typeSelect($(this).attr('type'));
							}
						});
					}
				});
			},
			//此方法必须保留
			init: function () {
				ptData = ufma.getCommonData();
				page.setYear = ptData.svSetYear;
				page.rgCode = ptData.svRgCode;
				page.initPage()
				page.onEventListener();
				ufma.parseScroll();
				ufma.parse();
			}
		}
	}();

	page.init();

});