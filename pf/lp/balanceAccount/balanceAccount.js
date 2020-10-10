$(function() {
	var page = function() {
		var ptData = ufma.getCommonData();
		var oTable;
		return {
			//初始化单位、账套
			initAgencyScc: function() {
				ufma.showloading('正在加载数据，请耐心等待...');
				//取单位数据
				var arguAge = {
					setYear: ptData.svSetYear,
					rgCode: ptData.svRgCode
				}
				dm.doGet("agency", arguAge, function(result) {
					//dm.doGet("agency", "", function(result) {
					$('#cbAgency').ufTreecombox({
						idField: 'id', //可选
						textField: 'codeName', //可选
						pIdField: 'pId', //可选
						placeholder: '请选择单位',
						readonly: false,
						icon: 'icon-unit',
						theme: 'label',
						leafRequire: true,
						data: result.data,
						onChange: function(sender, treeNode) {
							//缓存单位账套
							var params = {
								selAgecncyCode: treeNode.id,
								selAgecncyName: treeNode.name
							}
							ufma.setSelectedVar(params);
							agencyCode = $('#cbAgency').getObj().getValue();
							dm.acct({
								agencyCode: agencyCode,
								rgCode: ptData.svRgCode,
								setYear: ptData.svSetYear
							}, function(result) {
								$("#cbAcct").ufCombox({
									/*idField: 'CHR_CODE',
									textField: 'CODE_NAME',*/
									idField: 'code',
									textField: 'codeName',
									placeholder: '请选择账套',
									icon: 'icon-book',
									theme: 'label',
									leafRequire: true,
									data: result.data, //用来页面显示树的数据
									// 切换单位的时候不加载查询资产接口数据
									onChange: function(sender, data) {
										//缓存单位账套
										var params = {
											selAgecncyCode: $('#cbAgency').getObj().getValue(),
											selAgecncyName: $('#cbAgency').getObj().getText(),
											selAcctCode: data.code,
											selAcctName: data.name
										}
										ufma.setSelectedVar(params);
										// $('#btnQuery').trigger('click'); 
									},
									onComplete: function(sender, treeNode) {
										if(ptData.svAcctCode) { //如果有缓存的账套，就赋值
											$("#cbAcct").getObj().val(ptData.svAcctCode);
										} else {
											$('#cbAcct').getObj().val('1');
										}
									}
								});
							});
						},
						onComplete: function(sender) {
							if(ptData.svAgencyCode) {
								$('#cbAgency').getObj().val(ptData.svAgencyCode);
							} else {
								$('#cbAgency').getObj().val('1');
							}
							ufma.hideloading();
						}
					});
				});
			},
			initGridDPE: function() {
				var tableId = 'balAcccountTab';
				var columns = [{
						data: "assestName",
						width: 160,
						className: 'nowrap isprint',
						render: function(data, type, rowdata, meta) {
							if(!$.isNull(data)) {
								return '<span title="' + data + '">' + data + '</span>';
							} else {
								return '';
							}
						}
					},
					{
						data: "assCurrentMoney",
						className: 'nowrap isprint tr',
						width: 160,
						render: function(data, type, rowdata, meta) {
							var val = $.formatMoney(data);
							val == '0.00' ? '' : val;
							return '<span title="' + val + '">' + val + '</span>';
						}
					},
					{
						data: "finCurrentMoney",
						className: 'nowrap isprint tr',
						width: 160,
						render: function(data, type, rowdata, meta) {
							var val = $.formatMoney(data);
							val == '0.00' ? '' : val;
							return '<span title="' + val + '">' + val + '</span>';
						}
					},
					{
						data: "checkCurrent",
						className: 'nowrap isprint',
						render: function(data, type, rowdata, meta) {
							if(!$.isNull(data)) {
								return '<span title="' + data + '">' + data + '</span>';
							} else {
								return '';
							}
						}
					},
					{
						data: "assDepreciatedMoney",
						className: 'nowrap isprint',
						width: 160,
						render: function(data, type, rowdata, meta) {
							var val = $.formatMoney(data);
							val == '0.00' ? '' : val;
							return '<span title="' + val + '">' + val + '</span>';
						}
					},
					{
						data: "finDepreciatedMoney",
						className: 'nowrap isprint',
						width: 160,
						render: function(data, type, rowdata, meta) {
							var val = $.formatMoney(data);
							val == '0.00' ? '' : val;
							return '<span title="' + val + '">' + val + '</span>';
						}
					},
					{
						data: "checkDepreciated",
						className: 'nowrap isprint',
						render: function(data, type, rowdata, meta) {
							if(!$.isNull(data)) {
								return '<span title="' + data + '">' + data + '</span>';
							} else {
								return '';
							}
						}
					}
				];
				var opts = {
					"language": {
						"url": bootPath + "agla-trd/datatables/datatable.default.js"
					},
					"bFilter": true,
					"autoWidth": false,
					"bDestory": true,
					"processing": true, //显示正在加载中
					"pagingType": "full_numbers", //分页样式
					"lengthChange": true, //是否允许用户自定义显示数量p
					"lengthMenu": [
						[10, 20, 50, 100, 200, -1],
						[10, 20, 50, 100, 200, "全部"]
					],
					"pageLength": 20,
					"serverSide": false,
					"ordering": false,
					columns: columns,
					data: [],
					"dom": '<"datatable-toolbar"B>rt<"' + tableId + '-paginate"ilp>',
					buttons: [{
							extend: 'print',
							text: '<i class="glyphicon icon-print" aria-hidden="true"></i>',
							exportOptions: {
								modifier: {
									page: 'current'
								}
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
								modifier: {
									page: 'current'
								}
							},
							customize: function(xlsx) {
								var sheet = xlsx.xl.worksheets['sheet1.xml'];
							}
						}
					],
					initComplete: function(settings, json) {
						$('.datatable-toolbar').appendTo('#dtToolbar');
						var toolBar = $(this).attr('tool-bar')
						var $info = $(toolBar + ' .info');
						if($info.length == 0) {
							$info = $('<div class="info"></div>').appendTo($(toolBar + ' .tool-bar-body'));
						}
						$info.html('');
						$('.' + tableId + '-paginate').appendTo($info);
						$("#dtToolbar .buttons-print").css("border-radius", "4px 0 0 4px").addClass("btn-print btn-permission").attr({ // btn-permission
							"data-toggle": "tooltip",
							"title": "打印"
						});
						$("#dtToolbar .buttons-excel").css("border-radius", "0 4px 4px 0").addClass("btn-export btn-permission").attr({ // btn-permission
							"data-toggle": "tooltip",
							"title": "导出"
						});
						//导出begin
						$("#dtToolbar .buttons-excel").off().on('click', function(evt) {
							evt = evt || window.event;
							evt.preventDefault();
							ufma.expXLSForDatatable($('#balAcccountTab'), '与资产对账');
						});
						//导出end
						$('[data-toggle="tooltip"]').tooltip();
						ufma.isShow(page.reslist);
					},
					"drawCallback": function(settings) {
						ufma.isShow(page.reslist);
					}
				}
				oTable = $("#" + tableId).dataTable(opts);
			},
			loadGridDPE: function() {
				var argu = $('#frmQuery').serializeObject();
				argu = $.extend(argu, {
					agencyCode: $('#cbAgency').getObj().getValue(),
					setYear: ptData.svSetYear,
					rgCode: ptData.svRgCode
				});

				dm.loadGridData(argu, function(result) {
					oTable.fnClearTable();
					if(result.data.length > 0) {
						oTable.fnAddData(result.data, true);
					}
					$('#balAcccountTab').closest('.dataTables_wrapper').ufScrollBar({
						hScrollbar: true,
						mousewheel: false
					});
					ufma.setBarPos($(window));
				});
			},

			onEventListener: function() {
				//查询
				$('#btnQuery').on('click', function() {
					var startDate = $('#startDate').getObj().getValue();
					var endDate = $('#endDate').getObj().getValue();
					if(startDate > endDate) {
						ufma.alert('开始日期不能大于截止日期', "warning");
						return false;
					} else {
						page.loadGridDPE();
					}
				});
				//对账
				/* $('#btnBlance').on("click",function() {
					var startDate = $("#startDate").getObj().getValue();
					var endDate = $("#endDate").getObj().getValue();
				 	var startMonth = (new Date(startDate)).getMonth() + 1; //起始期间(只有月份，如7)
				 	var endMonth = (new Date(startEnd)).getMonth() + 1; //截止期间(只有月份，如7)
					ufma.showloading('正在加载数据，请耐心等待...');
					dm.balanceAcc(argu,function(){
						ufma.hideloading();
						page.assetTable.fnClearTable();
						if(result.data && result.data.length > 0) {
							 oTable.fnAddData(result.data, true);
						}
						ufma.setBarPos($(window));
					})
				 
				});*/
			},
			initPage: function() {
				page.reslist = ufma.getPermission();
				ufma.isShow(page.reslist);
				this.initAgencyScc();
				page.initGridDPE();
				$('.uf-datepicker').ufDatepicker({
					format: 'yyyy-mm',
					viewMode: 'month',
					initialDate: new Date()
				});
			},
			//此方法必须保留
			init: function() {
				//权限控制
				page.reslist = ufma.getPermission();
				ufma.isShow(page.reslist);

				page.initPage();
				page.onEventListener();

				ufma.parse();
				ufma.parseScroll();
			}
		}
	}();
	/////////////////////
	page.init();
});