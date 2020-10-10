$(function() {
	var page = function() {
		var sendObj = {};
		var ptData = {};
		var agencyCode = '',
			agencyName = '',
			acctCode = '';
		acctName = '';
		var oTable;
		var isNeedAcct;
		return {
			initAgencyScc: function() {
				ufma.showloading('正在加载数据，请耐心等待...');
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
				columns = [
					// {
					// 	title: "序号",
					// 	data: "rowno",
					// 	className: 'tc nowrap isprint',
					// 	width: 44,
					// 	"render": function (data, type, rowdata, meta) {
					// 		var index = meta.row + 1
					// 		return "<span>" + index + "</span>";
					// 	}
					// }, 
					{
						title: "账簿名称",
						data: "accountbookName",
						width: 200,
						className: ' isprint'
					},
					{
						title: "期初余额",
						data: "qcMoney",
						className: 'isprint tdNum tr',
						render: function(data, type, rowdata, meta) {
							var val = $.formatMoney(data);
							return val == '0.00' ? '' : val;
						}
					},
					{
						title: "金额",
						data: "rcDrMoney",
						className: 'isprint tdNum tr',
						render: function(data, type, rowdata, meta) {
							var val = $.formatMoney(data);
							return val == '0.00' ? '' : val;
						}

					},
					{
						title: "笔数",
						data: "rcDrCount",
						className: 'nowrap tr isprint tdNum',
						render: function(data, type, rowdata, meta) {
							if(data == 0) {
								return ''
							} else {
								return data
							}
						}
					},
					{
						title: "金额",
						data: "rcCrMoney",
						className: 'isprint tdNum tr',
						render: function(data, type, rowdata, meta) {
							var val = $.formatMoney(data);
							return val == '0.00' ? '' : val;
						}

					},
					{
						title: "笔数",
						data: "rcCrCount",
						className: 'nowrap tr isprint tdNum',
						render: function(data, type, rowdata, meta) {
							if(data == 0) {
								return ''
							} else {
								return data
							}
						}
					},
					{
						title: "期末余额",
						data: "money",
						className: 'isprint tdNum tr',
						render: function(data, type, rowdata, meta) {
							var val = $.formatMoney(data);
							return val == '0.00' ? '' : val;
						}
					}
				];
				var tableId = 'gridDPE';

				oTable = $("#" + tableId).dataTable({
					"language": {
						"url": bootPath + "agla-trd/datatables/datatable.default.js"
					},
					"autoWidth": false,
					"bDestory": true,
					"processing": true, //显示正在加载中
					"pagingType": "full_numbers", //分页样式
					"lengthChange": true, //是否允许用户自定义显示数量p
					"lengthMenu": [
						[10, 20, 50, 100, 200, -1],
						[10, 20, 50, 100, 200, "全部"]
					],
					"pageLength": 100,
					"serverSide": false,
					"ordering": false,
					columns: columns,
					data: [],
					"dom": '<"datatable-toolbar"B>rt<"' + tableId + '-paginate"ilp>',
					buttons: [{
							extend: 'print',
							text: '<i class="glyphicon icon-print" aria-hidden="true"></i>',
							exportOptions: {
								columns: [0, 1, 2, 3, 4, 5, 6]
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
								columns: [0, 1, 2, 3, 4, 5, 6]
							},
							customize: function(xlsx) {
								var sheet = xlsx.xl.worksheets['sheet1.xml'];
							}
						}
					],
					initComplete: function(settings, json) {
						$('.datatable-toolbar').appendTo('#dtToolbar');
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
							uf.expTable({
								title: '综合查询',
								exportTable: '#gridDPE'
							});
						});
						//导出end
						$('#dtToolbar [data-toggle="tooltip"]').tooltip();
						var toolBar = $(this).attr('tool-bar')
						var $info = $(toolBar + ' .info');
						if($info.length == 0) {
							$info = $('<div class="info"></div>').appendTo($(toolBar + ' .tool-bar-body'));
						}
						$info.html('');
						$('.' + tableId + '-paginate').appendTo($info);
						$('.btn-print').removeAttr('href');
						$(".btn-print").off().on('click', function() {
							page.pdfData();
						})
						ufma.isShow(page.reslist);
					},
					fnCreatedRow: function(nRow, aData, iDataIndex) {
						if(!$.isNull(aData)) {
							if(aData.rowType != "0") {
								$(nRow).css({
									"background-color": "#f0f0f0"
								})
							}
						}
					}
				});
			},
			//获取表格数据
			loadGridDPE: function() {
				var argu = $('#frmQuery').serializeObject();
				var isReceipt = $('input:radio[name="isReceipt"]:checked').val();
				if($('#isAccountNotNull').is(':checked')) {
					var isAccountNotNull = 1;
				} else {
					var isAccountNotNull = 0;
				}
				argu = $.extend(argu, {
					agencyCode: agencyCode,
					setYear: ptData.svSetYear,
					rgCode: ptData.svRgCode,
					isReceipt: isReceipt ,//是否回单,
					isAccountNotNull:isAccountNotNull
				});
				if(isNeedAcct) {
					argu.acctCode = $("#cbAcct").getObj().getValue();
				}
				dm.loadGridData(argu, function(result) {
					page.tableData = result.data;
					oTable.fnClearTable();
					if(!$.isNull(result.data)) {
						oTable.fnAddData(result.data, true);
					}
					$('#gridDPE').closest('.dataTables_wrapper').ufScrollBar({ //浮动滚动条
						hScrollbar: true,
						mousewheel: false
					});
					ufma.setBarPos($(window));
					$('#gridDPE').fixedColumns({
						rightColumns: 1
					});
				});
			},
			//返回本期时间
			dateBenQi: function(startId, endId) {
				var ddYear = page.setYear;
				var ddMonth = page.month - 1;
				var tdd = new Date(ddYear, ddMonth + 1, 0)
				var ddDay = tdd.getDate();
				$("#" + startId).getObj().setValue(new Date(ddYear, ddMonth, 1));
				$("#" + endId).getObj().setValue(new Date(ddYear, ddMonth, ddDay));
			},
			//返回本年时间
			dateBenNian: function(startId, endId) {
				var ddYear = page.setYear;
				$("#" + startId).getObj().setValue(new Date(ddYear, 0, 1));
				$("#" + endId).getObj().setValue(new Date(ddYear, 11, 31));
			},
			//返回今日时间
			dateToday: function(startId, endId) {
				var mydate = new Date(page.nowDate);
				Year = mydate.getFullYear();
				Month = (mydate.getMonth() + 1);
				Month = Month < 10 ? ('0' + Month) : Month;
				Day = mydate.getDate();
				Day = Day < 10 ? ('0' + Day) : Day;
				$('#startJouDate').getObj().setValue(Year + '-' + Month + '-' + Day);
				$('#endJouDate').getObj().setValue(Year + '-' + Month + '-' + Day);
			},
			//组织打印数据
			pdfData: function() {
				var isReceipt;
				if($('input:radio[name="isReceipt"]:checked').val() == '1') {
					isReceipt = '是';
				} else if($('input:radio[name="isReceipt"]:checked').val() == '0') {
					isReceipt = '否';
				} else {
					isReceipt = '全部';
				}
				var printsdataall = {
					'data': page.tableData,
					'startJouDate': $('#startJouDate').getObj().getValue(),
					'endJouDate': $('#endJouDate').getObj().getValue(),
					'isReceipt': isReceipt,
					'agencyCode': agencyCode,
					'agencyName': agencyName
				}
				if(isNeedAcct) {
					printsdataall.acctCode = acctCode;
					printsdataall.acctName = '账套 ： ' + acctName;
				}
				ufma.post('/cu/print/getPrintDataForBase', printsdataall, function(result) {
					var now = [{}]
					now[0].CU_JOURNAL_DATA = result.data[0].CU_JOURNAL_DATA;
					now[0].CU_JOURNAL_HEAD = result.data[1].CU_JOURNAL_HEAD;
					var coster = JSON.stringify(now)
					page.getPdf('CU_JOURNAL_COMQUERY', '*', coster)
				})
			},
			getPdf: function(reportCode, templId, groupDef) {
				var xhr = new XMLHttpRequest()
				var formData = new FormData()
				formData.append('reportCode', reportCode)
				formData.append('templId', templId)
				formData.append('groupDef', groupDef)
				xhr.open('POST', '/pqr/api/printpdfbydata', true)
				xhr.setRequestHeader('context-type', 'text/xml;charset=utf-8')
				xhr.responseType = 'blob'

				//保存文件
				xhr.onload = function(e) {
					if(xhr.status === 200) {
						if(xhr.status === 200) {
							var content = decodeURIComponent(xhr.getResponseHeader('Content-Disposition'))
							window.open(content, '_blank', 'titlebar=no,location=no,toolbar=no,menubar=no;top=100')
						}
					}
				}

				//状态改变时处理返回值
				xhr.onreadystatechange = function() {
					if(xhr.readyState === 4) {
						//通信成功时
						if(xhr.status === 200) {
							//交易成功时
							ufma.hideloading();
						} else {
							var content = decodeURIComponent(xhr.getResponseHeader('Content-Disposition'))
							//提示框，各系统自行选择插件
							alert(content)
							ufma.hideloading();
						}
					}
				}
				xhr.send(formData)
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
								page.initGridDPE();
								page.loadGridDPE();
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
						$("#acct").addClass("hide");
						page.initGridDPE();
						page.loadGridDPE();
					}

				});
			},
			onEventListener: function() {
				$('#btnQuery').click(function() {
					if($('#startJouDate').getObj().getValue() > $('#endJouDate').getObj().getValue()) {
						ufma.showTip('开始日期不能大于结束日期！', function() {}, 'error');
						return false;
					}
					page.loadGridDPE();
				});
				//选择期间，改变日历控件的值
				$("#dateBq").on("click", function() {
					page.dateBenQi("startJouDate", "endJouDate");
				});
				$("#dateBn").on("click", function() {
					page.dateBenNian("startJouDate", "endJouDate");
				});
				$("#dateJr").on("click", function() {
					page.dateToday("startJouDate", "endJouDate");
				});
			},
			//初始化页面
			initPage: function() {
				page.reslist = ufma.getPermission();
				ufma.isShow(page.reslist);
				var pfData = ufma.getCommonData();
				page.nowDate = pfData.svTransDate; //当前年月日
				page.rgCode = pfData.svRgCode; //区划代码
				page.setYear = pfData.svSetYear; //本年 年度
				page.month = pfData.svFiscalPeriod; //本期 月份
				page.today = pfData.svTransDate; //今日 年月日
				page.initAgencyScc();
				$('.uf-datepicker').ufDatepicker({
					format: 'yyyy-mm-dd',
					//initialDate: new Date()
					//CWYXM-9865 出纳管理-生成新年度账，新年度登入后，综合查询默认本日时间为2019年的时间--zsj
					initialDate: pfData.svTransDate
				});
				page.dateBenQi("startJouDate", "endJouDate");
			},

			init: function() {
				//获取session
				ptData = ufma.getCommonData();
				this.initPage();
				this.onEventListener();
				ufma.parse();
				ufma.parseScroll();
			}
		}
	}();

	page.init();
});