 $(function() {
	var page = function() {
		var ptData = {};
		var agencyCode = '',
			acctCode = '',
			initFlag = true;
		var pageLength = ufma.dtPageLength('#gridNotes');
		var oTable;
		return {
			tableId: 'gridNotes',
			tableData: [],
			//初始化单位
			initAgencyScc: function() {
				ufma.showloading('正在加载数据，请耐心等待...');
				//取单位数据
				var arguAge = {
					setYear: ptData.svSetYear,
					rgCode: ptData.svRgCode
				}
				dm.doGet("agency", arguAge, function(result) {
					// dm.doGet("agency","",function (result) {
					$('#cbAgency').ufTreecombox({
						// url: dm.getCtrl('agency'),
						idField: 'id', //可选
						textField: 'codeName', //可选
						pIdField: 'pId', //可选
						readonly: false,
						placeholder: '请选择单位',
						icon: 'icon-unit',
						theme: 'label',
						leafRequire: true,
						data: result.data,
						onChange: function(sender, treeNode) {
							//切换往来类型 S
							$("#colAction .text").text("单位");
							$("#colAction").attr("data-type", "01");
							//切换往来类型 E
							agencyCode = $('#cbAgency').getObj().getValue();
							page.agencyCode = agencyCode;
							//缓存单位账套
							var params = {
								selAgecncyCode: treeNode.code,
								selAgecncyName: treeNode.name,
							}
							ufma.setSelectedVar(params);
							var argu = {
								agencyCode: agencyCode,
								setYear: ptData.svSetYear
							}
							var url = dm.getCtrl('acct'); //+ agencyCode;
							//账套
							//var url = dm.getCtrl('acct') + agencyCode;
							var callback = function(result) {
								ufma.hideloading();
								if(result.data.length == 0) {
									ufma.showTip("该单位下没有账套，请重新选择单位！", function() {

									}, "warning");
									return false;
								}
								$("#cbAcct").getObj().load(result.data);
							};
							ufma.get(url, argu, callback);

						},
						onComplete: function(sender) {
							if(ptData.svAgencyCode) {
								$('#cbAgency').getObj().val(ptData.svAgencyCode);
							} else {
								$('#cbAgency').getObj().val('1');
							}
						}
					});
				})

				//page.cbAgency.select(1);
			},
			//初始化账套
			initAcct: function() {
				$("#cbAcct").ufCombox({
					/* idField: 'CHR_CODE',
					 textField: 'CODE_NAME',*/
					idField: 'code',
					textField: 'codeName',
					readonly: false,
					placeholder: '请选择账套',
					icon: 'icon-book',
					theme: 'label',
					onChange: function(sender, data) {
						page.accsCode = data.accsCode
						//缓存单位账套
						var params = {
							selAgecncyCode: $('#cbAgency').getObj().getValue(),
							selAgecncyName: $('#cbAgency').getObj().getText(),
							selAcctCode: data.code,
							selAcctName: data.name
						}
						ufma.setSelectedVar(params);
						dm.showPlan({
							"agencyCode": $('#cbAgency').getObj().getValue(),
							"acctCode": $("#cbAcct").getObj().getValue(),
							"rptType": "PAY_ACCOUNT",
							"userId": ptData.svUserId, //修改权限  将svUserCode改为 svUserId  20181012
							"setYear": ptData.svSetYear
						});
						dm.backToOrigin();
						//请求会计科目
						var reqData = {
							agencyCode: $('#cbAgency').getObj().getValue(),
							acctCode: $("#cbAcct").getObj().getValue(),
							accoType: "4",
							setYear: ptData.svSetYear,
							eleCode: "ACCO",
							userId: ptData.svUserId //修改权限  将svUserCode改为 svUserId  20181012             
						};
						dm.getAcco(reqData, page.renderAcco);
						//请求票据类型
						page.billType();

					},
					onComplete: function(sender) {
						if(ptData.svAcctCode) {
							$("#cbAcct").getObj().val(ptData.svAcctCode);
						} else {
							$('#cbAcct').getObj().val('1');
						}

					}
				});
			},
			//初始化科目树
			initAcco: function() {
				$("#accoCode").ufTreecombox({
					valueField: "id",
					textField: "codeName",
					pIdField: 'pId', //可选
					readonly: false,
					placeholder: "请选择会计科目",
					//leafRequire: false
					leafRequire: true, //修改bug75581--不可选择父级
					onChange:function(sender,data){ 
						console.log(data)
						page.tableData = []
						page.resetColumns(data)
					}
				})
			},
			/**
			* @description: 重新构建列方法
			*/
			resetColumns: function(data){
				var agencyCode = $("#cbAgency").getObj().getValue(),
				acctCode = $("#cbAcct").getObj().getValue()
				var argu = {
					setYear: ptData.svSetYear,
					rgCode: ptData.svRgCode,
					roleId: ptData.svRoleId,
					agencyCode: agencyCode,
					acctCode: acctCode,
					accsCode: page.accsCode,
					chrCode: data.code
				}
				dm.queryAccoTable(argu, function(result){
					// console.log(result)
					var accoColumns = []
					result.data.accoList.forEach(function(item){
						if(item.acctCode === acctCode){
							page.isShowField = item.field1==='1'?true:false
							page.isShowBill = item.isShowBill==='1'?true:false
							if(item.eleAccoItems.length > 0){
								item.eleAccoItems.forEach(function(it){
									if(it.accitemCode.indexOf('ACC_ITEM') > -1){
										var col = {
											title: it.eleName,
											data: 'accItem'+it.accitemCode.slice(8)+'Name',
											className: 'nowrap isprint'
										}
										accoColumns.push(col)
									} else {
										if (it.accitemCode === 'EMPLOYEE') {//如果往来方存在 不能显示人员
											$("#colAction").attr("data-type", '02');
											$("#colAction .text").text("个人");
											dm.payerEmployee(page.agencyCode);
										} else if (it.accitemCode == 'CURRENT') {
											$("#colAction").attr("data-type", '01');
											$("#colAction .text").text("往来单位");
											dm.payerAgency(page.agencyCode);
										} else {
											var col = {
												title: it.eleName,
												data: it.accitemCode.toLowerCase()+'Name',
												className: 'nowrap isprint'
											}
											accoColumns.push(col)
											$("#colAction").attr("data-type", '01');
											$("#colAction .text").text("往来单位");
											dm.payerAgency(page.agencyCode);
										}
									}
								})
							} else {
								//雪蕊说既没有挂人员也没有挂往来单位的默认显示往来单位
								$("#colAction").attr("data-type", '01');
								$("#colAction .text").text("往来单位");
								dm.payerAgency(page.agencyCode);
							}
						}
					})
					page.reDrawTable(page.isShowField, page.isShowBill, accoColumns)
				})
			},
			reDrawTable: function(isShowField, isShowBill, accoColumns){
				console.log('更新主表')
				var columns = [{
					title: "序号",
					data: "rowno",
					width: 30,
					className: 'nowrap tc isprint'
				},
				{
					title: "凭证日期",
					data: "vouDate",
					className: 'nowrap isprint'
				},
				{
					title: "凭证字号",
					data: "vouNoName",
					className: 'nowrap isprint',
					render: function(data, type, full, meta) {
						if(data != null) {
							if(full.vouGuid != null) {
								return '<span class="common-jump-link" data-vouguid="' + full.vouGuid + '">' + data + '</span>';
							} else {
								return data;
							}
						} else {
							return "";
						}
					}
				},
				{
					title: "摘要",
					data: "vouDesc",
					className: 'nowrap isprint'
				},
				{
					title: "会计科目",
					data: "accoName",
					className: 'nowrap isprint',
					width: 160
				},
				{
					title: "应付金额",
					data: "stadAmt",
					className: 'nowrap isprint tdNum',
					render: function(data, type, rowdata, meta) {
						if(!data || data == 0 || data == "0" || data == "0.00") {
							return "";
						}
						return '<div style="text-align: right">' + $.formatMoney(data, 2); + '</div>'
					}
				},
				{
					title: "已核销金额",
					data: "cancelMoney",
					className: 'nowrap isprint tdNum',
					render: function(data, type, rowdata, meta) {
						if(!data || data == 0 || data == "0" || data == "0.00") {
							return "";
						}
						return '<div style="text-align: right">' + $.formatMoney(data, 2); + '</div>'
					}
				},
				{
					title: "应付余额",
					data: "restMoney",
					className: 'nowrap isprint tdNum',
					render: function(data, type, rowdata, meta) {
						if(!data || data == 0 || data == "0" || data == "0.00") {
							return "";
						}
						return '<div style="text-align: right">' + $.formatMoney(data, 2); + '</div>'
					}
				},

				{
					title: "状态",
					data: "cancelStatusName",
					className: 'nowrap isprint'
				},
				{
					title: "收回金额",
					data: "takeBackMoney",
					className: 'nowrap isprint tdNum',
					render: function(data, type, rowdata, meta) {
						if(!data || data == 0 || data == "0" || data == "0.00") {
							return "";
						}
						return '<div style="text-align: right">' + $.formatMoney(data, 2); + '</div>'
					}
				},
				{
					title: "操作",
					data: "opt",
					className: 'nowrap tc',
					width: 160,
					render: function(data, type, rowdata, meta) {
						//如果数据的billStatus不为01，背书、贴现、收款、退票的按钮都不能点
						if(rowdata.rowType != 3) {
							var dis = false;
							return '<a ' + (dis ? "disabled" : "") + ' class="btn btn-icon-only btn-sm btn-permission icon-writeoff btn-cav" data-toggle="tooltip" action= "addlower" title="核销" rowindex="' + meta.row + '">' +
								'<a ' + (dis ? "disabled" : "") + ' class="btn btn-icon-only btn-sm btn-permission icon-discount btn-pay-back" data-toggle="tooltip" action= "addlower" title="收回" rowindex="' + meta.row + '">';
						}
	
					}
				}]
				var startIndex = 4 //插入数组的起始位置 默认从第4位开始
				if(isShowField){
					columns.splice(startIndex,0,
					{
						title: "往来方",
						data: "currentName",
						className: 'nowrap isprint',
						// width: 160
					},
					{
						title: "往来日期",
						data: "bussDate",
						className: 'nowrap isprint',
						// width: 80
					},
					{
						title: "往来号",
						data: "field1",
						className: 'nowrap isprint',
						// width: 160
					})
					startIndex += 3
				}
				if(isShowBill){
					columns.splice(startIndex,0,{
						title: "票据类型",
						data: "billTypeName",
						className: 'nowrap isprint',
						// width: 160
					},
					{
						title: "票据号",
						data: "billNo",
						className: 'nowrap isprint',
						// width: 160
					},
					{
						title: "票据日期",
						data: "billDate",
						className: 'nowrap isprint',
						// width: 80
					})
					startIndex += 3
				}
				if(accoColumns && accoColumns.length>0){
					startIndex +=1
					// console.log(startIndex)
					for(var len = accoColumns.length, i = len - 1;i>-1;i--){
						columns.splice(startIndex,0,accoColumns[i])
					}
				}
				console.log(columns)
				if(oTable){
					oTable.DataTable().clear().destroy()
					$('#' + page.tableId).html('')
				}
				// console.log(columns)
				oTable = $('#' + page.tableId).dataTable({
					language: {
						url: bootPath + "agla-trd/datatables/datatable.default.js"
					},
					autoWidth: false,
					bDestory: true,
					processing: true, //显示正在加载中
					pagingType: "full_numbers", //分页样式
					lengthChange: true, //是否允许用户自定义显示数量p
					lengthMenu: [
						[10, 20, 50, 100, 200, -1],
						[10, 20, 50, 100, 200, "全部"]
					],
					pageLength: pageLength,
					serverSide: false,
					ordering: false,
					columns: columns,
					data: page.tableData,
					dom: '<"datatable-toolbar"B>rt<"' + page.tableId + '-paginate"ilp>',
					buttons: [{
							extend: 'print',
							text: '<i class="glyphicon icon-print" aria-hidden="true"></i>',
							exportOptions: {
								columns: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18]
							},
							customize: function(win) {
								$(win.document.body).find('h1').css("text-align", "center");
								$(win.document.body).css("height", "auto");
							}
						},
						{
							extend: 'excelHtml5',
							text: '<i class="glyphicon icon-upload" aria-hidden="true"></i>',
							exportOptions: {
								columns: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18]
							},
							customize: function(xlsx) {
								var sheet = xlsx.xl.worksheets['sheet1.xml'];
							}
						}
					],
					initComplete: function(settings, json) {
						$('.datatable-toolbar').appendTo('#dtToolbar');
						var toolBar = $(this).attr('tool-bar');
						var $info = $(toolBar + ' .info');
						if($info.length == 0) {
							$info = $('<div class="info"></div>').appendTo($(toolBar + ' .tool-bar-body'));
						}
						$info.html('');
						$('.' + page.tableId + '-paginate').appendTo($info);
						ufma.isShow(page.reslist);
						$("#dtToolbar .buttons-print").css("border-radius", "4px 0 0 4px").addClass("btn-print btn-permission").attr({
							"data-toggle": "tooltip",
							"title": "打印"
						});
						$("#dtToolbar .buttons-excel").css("border-radius", "0 4px 4px 0").addClass("btn-export btn-permission").attr({
							"data-toggle": "tooltip",
							"title": "导出"
						});
						//导出begin
						$("#dtToolbar .buttons-excel").off().on('click', function(evt) {
							evt = evt || window.event;
							evt.preventDefault();
							ufma.expXLSForDatatable($('#gridNotes'), '应付款备查簿');
						});
						//导出end

					},
					"drawCallback": function (settings) {
						ufma.dtPageLength($(this))
						$('#gridNotes').find("td.dataTables_empty").text("")
							.append('<img class="no-print" src="' + bootPath + 'images/noData.png"/><br/><i>目前还没有你要查询的数据</i>');
						//弹出详细凭证
						$("#pay-account").find("td span").on("click", function () {
							var vouGuid = $(this).attr("data-vouguid"); //凭证id
							var vouMenuId = 'f24c3333-9799-439a-94c9-f0cdf120305d';
							if (vouGuid) {
								var baseUrl = '/pf/gl/vou/index.html?menuid=' + vouMenuId + '&dataFrom=accDetailIncome&action=query&vouGuid=' + vouGuid + '&agencyCode=' + page.agencyCode + '&acctCode=' + $("#cbAcct").getObj().getValue();
								uf.openNewPage(page.isCrossDomain, $(this), 'openMenu', baseUrl, false, "凭证录入");
							}
							ufma.setBarPos($(window));
						});
						$(".tableBox").css({
							"overflow-x": "scroll"
						});
						ufma.isShow(page.reslist);

					},
					fnCreatedRow: function(nRow, aData, iDataIndex) {
						$('td:eq(0)', nRow).html(iDataIndex + 1);
					}
				});
				if(initFlag){
					initFlag = false
				}else{
					page.loadMainTable()
				}
				$('#' + page.tableId).fixedColumns({
					rightColumns: 1 //锁定右侧一列
				});
			},
			//初始化票据类型
			initBillType: function() {
				$('#billType').ufTreecombox({
					idField: "code",
					textField: "codeName",
					pIdField: 'pCode', //可选
					placeholder: '请选择票据类型',
					leafRequire: true,
					readonly: false
				});
			},
			//请求票据类型
			billType: function() {
				var reqData = {
					agencyCode: page.agencyCode,
					setYear: ptData.svSetYear,
					rgCode: ptData.svRgCode,
					eleCode: "BILLTYPE"
				};

				dm.commonApi(reqData, function(result) {
					page.billTypeData = result.data;
					$('#billType').getObj().load(result.data);
				});
			},
			//初始化往来单位
			initPayerAgency: function() {
				$('#currentCode').ufTreecombox({
					idField: 'code',
					textField: 'codeName',
					pIdField: 'pCode', //可选
					placeholder: '请选择往来方',
					leafRequire: true,
					readonly: false
				});
			},

			//初始化主表
			initMainTable: function() {
				var columns = [{
					title: "序号",
					data: "rowno",
					width: 30,
					className: 'nowrap tc isprint'
				},
				{
					title: "凭证日期",
					data: "vouDate",
					className: 'nowrap isprint'
				},
				{
					title: "凭证字号",
					data: "vouNoName",
					className: 'nowrap isprint'
				},
				{
					title: "摘要",
					data: "vouDesc",
					className: 'nowrap isprint'
				},
				{
					title: "会计科目",
					data: "accoName",
					className: 'nowrap isprint',
					width: 160
				},
				{
					title: "应付金额",
					data: "stadAmt",
					className: 'nowrap isprint tdNum',
					render: function(data, type, rowdata, meta) {
						if(!data || data == 0 || data == "0" || data == "0.00") {
							return "";
						}
						return '<div style="text-align: right">' + $.formatMoney(data, 2); + '</div>'
					}
				},
				{
					title: "已核销金额",
					data: "cancelMoney",
					className: 'nowrap isprint tdNum',
					render: function(data, type, rowdata, meta) {
						if(!data || data == 0 || data == "0" || data == "0.00") {
							return "";
						}
						return '<div style="text-align: right">' + $.formatMoney(data, 2); + '</div>'
					}
				},
				{
					title: "应付余额",
					data: "restMoney",
					className: 'nowrap isprint tdNum',
					render: function(data, type, rowdata, meta) {
						if(!data || data == 0 || data == "0" || data == "0.00") {
							return "";
						}
						return '<div style="text-align: right">' + $.formatMoney(data, 2); + '</div>'
					}
				},

				{
					title: "状态",
					data: "cancelStatusName",
					className: 'nowrap isprint'
				},
				{
					title: "收回金额",
					data: "takeBackMoney",
					className: 'nowrap isprint tdNum',
					render: function(data, type, rowdata, meta) {
						if(!data || data == 0 || data == "0" || data == "0.00") {
							return "";
						}
						return '<div style="text-align: right">' + $.formatMoney(data, 2); + '</div>'
					}
				},
				{
					title: "操作",
					data: "opt",
					className: 'nowrap tc',
					width: 100,
					render: function(data, type, rowdata, meta) {
						//如果数据的billStatus不为01，背书、贴现、收款、退票的按钮都不能点
						if(rowdata.rowType != 3) {
							var dis = false;
							return '<a ' + (dis ? "disabled" : "") + ' class="btn btn-icon-only btn-sm btn-permission icon-writeoff btn-cav" data-toggle="tooltip" action= "addlower" title="核销" rowindex="' + meta.row + '">' +
								'<a ' + (dis ? "disabled" : "") + ' class="btn btn-icon-only btn-sm btn-permission icon-discount btn-pay-back" data-toggle="tooltip" action= "addlower" title="收回" rowindex="' + meta.row + '">';
						}

					}
				}
				];
				oTable = $('#' + page.tableId).dataTable({
					language: {
						url: bootPath + "agla-trd/datatables/datatable.default.js"
					},
					autoWidth: false,
					bDestory: true,
					processing: true, //显示正在加载中
					pagingType: "full_numbers", //分页样式
					lengthChange: true, //是否允许用户自定义显示数量p
					lengthMenu: [
						[10, 20, 50, 100, 200, -1],
						[10, 20, 50, 100, 200, "全部"]
					],
					pageLength: pageLength, //默认每页显示100条--zsj--吉林公安需求
					serverSide: false,
					ordering: false,
					columns: columns,
					data: [],
					dom: '<"datatable-toolbar"B>rt<"' + page.tableId + '-paginate"ilp>',
					buttons: [{
							extend: 'print',
							text: '<i class="glyphicon icon-print" aria-hidden="true"></i>',
							exportOptions: {
								columns: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]
							},
							customize: function(win) {
								$(win.document.body).find('h1').css("text-align", "center");
								$(win.document.body).css("height", "auto");
							}
						},
						{
							extend: 'excelHtml5',
							text: '<i class="glyphicon icon-upload" aria-hidden="true"></i>',
							exportOptions: {
								columns: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]
							},
							customize: function(xlsx) {
								var sheet = xlsx.xl.worksheets['sheet1.xml'];
							}
						}
					],
					initComplete: function(settings, json) {
						$('.datatable-toolbar').appendTo('#dtToolbar');
						var toolBar = $(this).attr('tool-bar');
						var $info = $(toolBar + ' .info');
						if($info.length == 0) {
							$info = $('<div class="info"></div>').appendTo($(toolBar + ' .tool-bar-body'));
						}
						$info.html('');
						$('.' + page.tableId + '-paginate').appendTo($info);
						ufma.isShow(page.reslist);
						$("#dtToolbar .buttons-print").css("border-radius", "4px 0 0 4px").addClass("btn-print btn-permission").attr({
							"data-toggle": "tooltip",
							"title": "打印"
						});
						$("#dtToolbar .buttons-excel").css("border-radius", "0 4px 4px 0").addClass("btn-export btn-permission").attr({
							"data-toggle": "tooltip",
							"title": "导出"
						});
						//导出begin
						$("#dtToolbar .buttons-excel").off().on('click', function(evt) {
							evt = evt || window.event;
							evt.preventDefault();
							ufma.expXLSForDatatable($('#gridNotes'), '应付款备查簿');
						});
						//导出end

					},
					"drawCallback": function (settings) {
						ufma.dtPageLength($(this))
						$('#gridNotes').find("td.dataTables_empty").text("")
							.append('<img class="no-print" src="' + bootPath + 'images/noData.png"/><br/><i>目前还没有你要查询的数据</i>');
						$(".tableBox").css({
							"overflow-x": "scroll"
						});
						ufma.isShow(page.reslist);

					},
					fnCreatedRow: function(nRow, aData, iDataIndex) {
						$('td:eq(0)', nRow).html(iDataIndex + 1);
					}
				});
				$('#' + page.tableId).fixedColumns({
					rightColumns: 1 //锁定右侧一列
				});
			},
			//条件查询
			loadMainTable: function() {
				ufma.showloading('正在加载数据，请耐心等待...');

				var argu = $('#frmQuery').serializeObject();
				var argu1 = $('#queryMore').serializeObject();
				argu = $.extend(argu, argu1, {
					agencyCode: $('#cbAgency').getObj().getValue(),
					acctCode: $('#cbAcct').getObj().getValue(),
					setYear: ptData.svSetYear,
					rgCode: ptData.svRgCode,
					accoType: 4,
					accoCode: $('#accoCode').getObj().getValue(),
					currentCode: $("#currentCode").getObj().getValue(),
					billType: $("#billType").getObj().getValue(),
				});
				if($("#colAction").attr("data-type") == "02") {
					argu.employeeCode = argu.currentCode;
					delete argu.currentCode
				}

				// argu.accoCode

				dm.loadGridData(argu, function(result) {
					ufma.hideloading();
					oTable.fnClearTable();
					if(result.data && result.data.length > 0) {
						page.tableData = result.data
						oTable.fnAddData(result.data, true);
					}

					//表格模拟滚动条
					$('#gridNotes').closest('.dataTables_wrapper').ufScrollBar({
						hScrollbar: true,
						mousewheel: false
					});
					ufma.setBarPos($(window));
					// $("#gridNotes").fixedColumns({
					// 	rightColumns: 1 //锁定右侧一列
					// });
				});
			},
			//会计科目树
			renderAcco: function(result) {
				$("#accoCode").getObj().load(result.data.treeData);
				var code  = ''
				for(var i = 0; i < result.data.treeData.length; i++) {
					if(result.data.treeData[i].isLeaf == "1") {
						code = result.data.treeData[i].code
						$('#accoCode').getObj().val(code);
						break;
					} else if(result.data.treeData[i].levelNum == '2') {
						code = result.data.treeData[i].code
						$('#accoCode').getObj().val(code);
						break;
					}
				}
				//请求往来单位
				dm.payerAgency(page.agencyCode);

			},
			openDueCav: function(rowData) {
				var arguStr = {
					agencyCode: rowData.agencyCode,
					acctCode: rowData.acctCode,
					accoCode: rowData.accoCode,
					currentCode: rowData.currentCode,
					cancelStatusName: rowData.cancelStatusName,
					colActionType: $("#colAction").attr("data-type")
				};
				if(rowData.employeeCode != "" && rowData.employeeCode != "*") {
					arguStr.currentCode = rowData.employeeCode;
					arguStr.colActionType = "02";
				}
				if(rowData.cancelMoney > 0) {
					arguStr.detailAssGuid = rowData.detailAssGuid;
				}
				//应收款参数缓存
				var notesAccounts = ufma.sessionKey("gl", "notesAccounts", ptData.svRgCode, ptData.svSetYear, ptData.svAgencyCode, ptData.svAcctCode, "notesAccounts");

				sessionStorage.setItem(notesAccounts, JSON.stringify(arguStr));
				//门户打开方式
				//$(this).attr('data-href', '/pf/gl/aceCav/aceCav.html?menuid=f546cde0-3247-49de-817d-3b843069e679&dataFrom=notesAccounts&action=query');
			//	$(this).attr('data-title', '应付款核销');
				// window.parent.openNewMenu($(this));
				var baseUrl = '/pf/gl/aceCav/aceCav.html?menuid=f546cde0-3247-49de-817d-3b843069e679&dataFrom=notesAccounts&action=query';
				uf.openNewPage(page.isCrossDomain, $(this), 'openMenu', baseUrl, false, "应付款核销");
			},
			onEventListener: function() {
				$('#sureSaveMethod,#saveAs').on('click', function(e) {
					var quryObj = $('#frmQuery').serializeObject();
					var quryObj1 = $('#queryMore').serializeObject();
					quryObj = $.extend(quryObj, quryObj1, {
						agencyCode: $('#cbAgency').getObj().getValue(),
						acctCode: $('#cbAcct').getObj().getValue(),
						setYear: ptData.svSetYear,
						rgCode: ptData.svRgCode,
						userId: ptData.svUserId, //修改权限  将svUserCode改为 svUserId  20181012
						accoCode: $('#accoCode').getObj().getValue(),
						accoName: $('#accoCode').getObj().getText(),
					});
					if($("#colAction").attr("data-type") == "02") {
						quryObj.dataType = "02";
					} else {
						quryObj.dataType = "01";
					}
					dm.reqSavePrj(quryObj, $(e.target).is('#saveAs'));
				});
				//点击“查询”事件
				$('#btnQuery').click(function() {
					if($('#startVouDate').getObj().getValue() > $('#endVouDate').getObj().getValue()) {
						ufma.showTip('开始日期不能大于结束日期！', function() {}, 'error');
						return false;
					}
					var minAmt = $('#minAmt').val().replace(/,/g, "");
					var maxAmt = $('#maxAmt').val().replace(/,/g, "");
					if(parseFloat(minAmt) > parseFloat(maxAmt)) {
						ufma.showTip('开始金额不能大于结束金额！', function() {}, 'error');
						return false;
					}
					page.loadMainTable();
				});
				//主表坏账确认、坏账收回
				$(document).on('click', function(e) {
					var rowIndex = $(e.target).attr('rowindex');

					var url = '';
					var title = '应付款收回';
					if($(e.target).is('.btn-pay-back')) {
						var title = '应付款收回';
						url = 'accountsBack.html';
					}
					if(url != "") {
						var rowData = oTable.api(false).rows(rowIndex).data()[0];
						var opendata = {
							action: "",
							billbook: rowData,
							billTypeData: page.billTypeData,
							payerAgencyData: dm.payerAgencyData
						};
						ufma.open({
							url: url,
							title: title,
							width: 920,
							height: 600,
							data: opendata,
							ondestory: function(action) {
								//if(action) {
								$('#btnQuery').trigger('click');
								//}
							}
						});
					}

				});
				//核销跳转
				$(document).on("click", ".btn-cav", function(e) {
					e.stopPropagation();
					var rowIndex = $(e.target).attr('rowindex');
					var rowData = oTable.api(false).rows(rowIndex).data()[0];
					page.openDueCav(rowData);

				});
				//显示隐藏科目树
				$("#searchText").on("focus", function(e) {
					e.stopPropagation();
					$("#baseTree").show();
				});
				//显示/隐藏列隐藏框
				$(document).on("click", "#colAction", function(evt) {
					evt.stopPropagation();
					$("div.rpt-funnelBox").hide();
					$(this).next("div.rpt-funnelBox").show();
				})
				//选择往来类型
				$("#colList").on("click", "span", function() {
					if($("#colAction .text").text() != $(this).text()) {
						$("#colAction .text").text($(this).text());
						$("#colAction").attr("data-type", $(this).attr("data-type"));
						if($(this).text() == "单位") {
							dm.payerAgency(page.agencyCode);
						} else if($(this).text() == "个人") {
							dm.payerEmployee(page.agencyCode);
						}
					}

					$(this).closest(".rpt-funnelBox").hide();
				})
				// CWYXM-19595 账务处理模块，应收备查簿，点击更多，页面样式错乱
				$(".label-more").on("click", function () {
					var timeId = setTimeout(function () {
						ufma.setBarPos($(window));
						clearTimeout(timeId);
					}, 100);
				});
			},
			//初始化页面
			initPage: function() {
				//权限控制
				page.reslist = ufma.getPermission();
				ufma.isShow(page.reslist);
				//初始化科目树
				page.initAcco();
				//初始化票据类型
				page.initBillType();
				//初始化账套
				page.initAcct();
				//初始化往来单位
				page.initPayerAgency();

				this.initAgencyScc();
				/////////////
				var date = new Date(ptData.svTransDate),
					y = date.getFullYear(),
					m = date.getMonth();
				$('#startVouDate').ufDatepicker({
					format: 'yyyy-mm-dd',
					//viewMode:'month',
					initialDate: new Date(y, 0, 1)
				});
				$('#endVouDate').ufDatepicker({
					format: 'yyyy-mm-dd',
					//viewMode:'month',
					initialDate: new Date(ptData.svTransDate)
				});
				dm.radioLabelDPEType('#apportionType');
				$('#minAmt,#maxAmt').amtInputNull();
				page.initMainTable();
				$("input").attr("autocomplete", "off");
				//保存查询方案打开模态框
				dm.openSaveMethodModal();
				//保存查询方案输入提示
				dm.methodNameTips();
				//重构查询方案列表
				page.initPageNew();

			},
			//重构
			initPageNew: function() {
				$('#showMethodTip').click(function() {
					if($("#rptPlanList").find('li').length == 0) {
						$("#rptPlanList ul").append('<li class="tc">无可用方案</li>');
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

			init: function() {
				//获取session
				ptData = ufma.getCommonData();
				this.initPage();
				this.onEventListener();
				ufma.parse();
				ufma.parseScroll();
				window.addEventListener('message', function(e) {
					if(e.data.hasOwnProperty('messageType') && e.data.messageType == 'clientWidth') {
						page.isCrossDomain = true;
					} else {
						page.isCrossDomain = false;
					}
				});
			}
		}
	}();

	page.init();
});