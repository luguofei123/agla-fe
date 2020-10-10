$(function () {
	var pageLength = ufma.dtPageLength('#gridDPE');
	//如果有单位账套的缓存，则取缓存的值
	var selEnviornmentVar = ufma.getSelectedVar();
	var nowAgencyCode, nowAgencyName, nowAcctCode, nowAcctName;
	if (selEnviornmentVar) {
		nowAgencyCode = selEnviornmentVar.selAgecncyCode; //登录单位代码
		nowAgencyName = selEnviornmentVar.selAgecncyName; //登录单位名称
		nowAcctCode = selEnviornmentVar.selAcctCode; //账套代码
		nowAcctName = selEnviornmentVar.selAcctName; //账套名称
	}
	var page = function () {
		var ptData = {};
		var agencyCode = '',
			acctCode = '';
		var oTable;
		var areatreedata = [];
		return {
			initAgencyScc: function () {
				ufma.showloading('正在加载数据，请耐心等待...');
				dm.doGet("agency", "", function (result) {
					$('#cbAgency').ufTreecombox({
						// url: dm.getCtrl('agency'),
						idField: 'id', //可选
						textField: 'codeName', //可选
						pIdField: 'pId', //可选
						placeholder: '请选择单位',
						icon: 'icon-unit',
						theme: 'label',
						leafRequire: true,
						readonly: false,
						data: result.data,
						onChange: function (sender, treeNode) {
							agencyCode = $('#cbAgency').getObj().getValue();
							var url = '/gl/eleCoacc/getRptAccts';
							callback = function (result) {
								// $("#cbAcct").getObj().load(result.data);
								page.reqAcctList(result)
							}
							ufma.get(url, {
								'userId': ptData.svUserId,
								'setYear': ptData.svSetYear,
								'agencyCode': agencyCode
							}, callback);
							//费用类型
							dm.cbbFeeType({
								agencyCode: agencyCode
								//setYear: window.ownerData.setYear,
								//rgCode: window.ownerData.rgCode
							}, function (result) {
								$('#fylxCode').ufTreecombox({
									idField: "id",
									textField: "codeName",
									pIdField: "pId",
									leafRequire: true,
									data: result.data,
									onComplete: function (sender) {
										var timeId = setTimeout(function () {
											$('#btnQuery').trigger('click');
											clearTimeout(timeId);
										}, 300);
									}
								});
								$('#fylxCode').getObj().val('01');
							});
							//缓存单位账套
							var params = {
								selAgecncyCode: $('#cbAgency').getObj().getValue(),
								selAgecncyName: $('#cbAgency').getObj().getText(),
								selAcctCode: $("#cbAcct").getObj().getValue(),
								selAcctName: $("#cbAcct").getObj().getText()
							}
							ufma.setSelectedVar(params);

						},
						onComplete: function (sender) {
							var data = result.data;
							if (data.length > 0) {
								var code = data[0].id;
								if (nowAgencyCode != "" && nowAgencyName != "") {
									var agency = $.inArrayJson(data, 'id', nowAgencyCode);
									if (agency != undefined) {
										$('#cbAgency').getObj().val(nowAgencyCode);
									} else {
										$('#cbAgency').getObj().val(code);
									}
								} else {
									$('#cbAgency').getObj().val(code);
								}
							}

							ufma.hideloading();
						}
					});
				})
			},
			//账套
			reqAcctList: function (result) {
				$("#cbAcct").ufCombox({
					idField: 'code',
					textField: 'codeName',
					placeholder: '请选择账套',
					data: result.data,
					icon: 'icon-book',
					theme: 'label',
					onChange: function (data) {
						page.getModelTree(); //获取模板树
						page.loadGridDPE();
						//缓存单位账套
						var params = {
							selAgecncyCode: $('#cbAgency').getObj().getValue(),
							selAgecncyName: $('#cbAgency').getObj().getText(),
							selAcctCode: $("#cbAcct").getObj().getValue(),
							selAcctName: $("#cbAcct").getObj().getText()
						}
						ufma.setSelectedVar(params);
					},
					onComplete: function (sender) {
						var data = result.data;
						if (data.length > 0) {
							var code = data[0].code;
							if (nowAcctCode != "" && nowAcctName != "") {
								var flag = $("#cbAcct").getObj().val(nowAcctCode);
								if (flag == "undefined") {
									$("#cbAcct").getObj().val(nowAcctCode);
								} else if (flag == false) {
									$("#cbAcct").getObj().val(code);
								}
							} else {
								$("#cbAcct").getObj().val(code);
							}
						}
						ufma.hideloading();
					}
				});
			},
			//请求差异项树 guohx
			getModelTree: function () {
				var url = "/gl/vou/surplus/getEleSurplusTree";
				var argu = {
					"setYear": page.setYear,
					"rgCode": page.rgCode,
					"agencyCode": page.agencyCode,
					"acctCode": page.acctCode
				}
				ufma.ajaxDef(url, "get", argu, function (result) {
					var atreeArr = result.data;
					var znodes = [];
					areatreedata = []
					for (var i = 0; i < atreeArr.length; i++) {
						var nodeObj = {};
						if (atreeArr[i].id == '11') {
							nodeObj.open = true;
						}
						nodeObj.id = atreeArr[i].id;
						nodeObj.pId = atreeArr[i].pId;
						nodeObj.codeName = atreeArr[i].codeName;
						nodeObj.chrId = atreeArr[i].id;
						nodeObj.isLeaf = atreeArr[i].isLeaf;
						nodeObj.chrCode = atreeArr[i].code;
						if(nodeObj.isLeaf!=0){
							areatreedata.push('surplus'+nodeObj.id)
						}
						znodes.push(nodeObj);
					}
					page.docTree(znodes);
					var timeId = setTimeout(function () {
						clearTimeout(timeId);
						var H = $(window).height();
						$(".ma-cont-box").height(H - 214)
					}, 300)
				});
			},
			docTree: function (zNodes) {
				var setting = {
					data: {
						simpleData: {
							enable: true
						},
						key: {
							name: 'codeName'
						},
					},
					view: {
						fontCss: getFontCss,
						showLine: false,
						showIcon: false,
						selectedMulti: false
					},
					callback: {
						onClick: zTreeOnClick
					}
				};

				function zTreeOnClick(event, treeId, treeNode) {
					page.chrCode = treeNode.id;
					areatreedata=[]
					if(treeNode.isLeaf!=0){
						areatreedata=['surplus'+treeNode.id]
					}else{
						areatreedata = getAllChildrenNodes(treeNode,areatreedata)
					}
					page.loadGridDPE();
				};

				//节点名称超出长度 处理方式
				function addDiyDom(treeId, treeNode) {
					var spaceWidth = 5;
					var switchObj = $("#" + treeNode.tId + "_switch"),
						icoObj = $("#" + treeNode.tId + "_ico");
					switchObj.remove();
					icoObj.before(switchObj);
					if (treeNode.level > 1) {
						var spaceStr = "<span style='display: inline-block;width:" + (spaceWidth * treeNode.level) + "px'></span>";
						switchObj.before(spaceStr);
					}
					var spantxt = $("#" + treeNode.tId + "_span").html();
					if (spantxt.length > 16) {
						spantxt = spantxt.substring(0, 16) + "...";
						$("#" + treeNode.tId + "_span").html(spantxt);
					}
				}

				function focusKey(e) {
					if (key.hasClass("empty")) {
						key.removeClass("empty");
					}
				}

				function blurKey(e) {
					if (key.get(0).value === "") {
						key.addClass("empty");
					}
				}
				var lastValue = "",
					nodeList = [],
					fontCss = {};

				function clickRadio(e) {
					lastValue = "";
					searchNode(e);
				}
				function getAllChildrenNodes(treeNode,result){
						if (treeNode.isParent) {
						var childrenNodes = treeNode.children;
						if (childrenNodes) {
							for (var i = 0; i < childrenNodes.length; i++) {
								if(childrenNodes[i].isLeaf !=0){
									result.push('surplus'+childrenNodes[i].id);
								}
								result = getAllChildrenNodes(childrenNodes[i], result);
							}
						}
					}
					return result;
				}
				function allNodesArr() {
					var zTree = $.fn.zTree.init($("#docTree"), setting, zNodes);
					var nodes = zTree.getNodes();
					var allNodesArr = [];
					var allNodesStr;
					for (var i = 0; i < nodes.length; i++) {
						var result = "";
						var result = page.getAllChildrenNodes(nodes[i], result);
						var NodesStr = result
						NodesStr = NodesStr.split(",");
						NodesStr.splice(0, 1, nodes[i].id);
						NodesStr = NodesStr.join(",");
						allNodesStr += "," + NodesStr;
					}
					allNodesArr = allNodesStr.split(",");
					allNodesArr.shift();
					return allNodesArr;
				}

				function searchNode(e) { }

				function updateNodes(highlight) {
					var zTree = $.fn.zTree.init($("#docTree"), setting, zNodes);
					for (var i = 0, l = nodeList.length; i < l; i++) {
						nodeList[i].highlight = highlight;
						zTree.updateNode(nodeList[i]);
					}
				}

				function getFontCss(treeId, treeNode) {
					return (!!treeNode.highlight) ? {
						color: "#F04134",
						"font-weight": "bold"
					} : {
							color: "#333",
							"font-weight": "normal"
						};
				}

				function filter(node) {
					return !node.isParent && node.isFirstNode;
				}
				var key;
				$(document).ready(function () {
					var treeObj = $.fn.zTree.init($("#docTree"), setting, zNodes);
					//CWYXM-18864【20200630 财务云8.30.10】账务处理模块,，补充登记差异项页面，样式有问题 guohx 20200805
					treeObj.expandAll(true); //默认展开
					var nodes = treeObj.getNodes();
					if (nodes.length > 0) {
						treeObj.selectNode(nodes[0]);
						page.chrCode = treeObj.getSelectedNodes()[0].id;
					}
					key = $("#key");
					key.bind("focus", focusKey)
						.bind("blur", blurKey)
						.bind("propertychange", searchNode)
						.bind("input", searchNode);
				});
				
			},
			initGridDPE: function () {
				var tableId = 'gridDPE';
				var columns = [

					{
						title: "日期",
						data: "vouDate",
						className: 'tc nowrap isprint'
					},
					{
						title: "凭证号",
						data: "vouNo",
						className: 'nowrap isprint',
						render: function (rowid, rowdata, data) {
							//修改问题：CWYXM-3908--	差异项明细表增加联查凭证功能--zsj
							//return data.vouTypeName + '-' + data.vouNo;
							if (data != null) {
								if (data.vouGuid != null) {
									return '<a class="common-jump-link turn-vou" data-vouguid="' + data.vouGuid + '">' + data.vouTypeName + '-' + data.vouNo + '</a>';
								} else {
									return data;
								}
							} else {
								return "";
							}
						},
					},
					{
						title: "摘要",
						data: "vouDesc",
						className: 'nowrap isprint',
						render: function (data, type, rowdata, meta) {
							if (data == '' || data == null) {
								data = ''
							}
							return '<span  title="' + data + '">' + data + '</span>'
						}
					},
					// {
					// 	title: "科目",
					// 	data: "accoCodeName",
					// 	className: 'nowrap isprint',
					// 	render: function (data, type, rowdata, meta) {
					// 		if (data == '' || data == null) {
					// 			data = ''
					// 		}
					// 		return '<span  title="' + data + '">' + data + '</span>'
					// 	}
					// },

					// {
					// 	title: "借方金额",
					// 	data: "drStadAmt",
					// 	className: 'tr nowrap isprint tdNum',
					// 	render: function (data, type, rowdata, meta) {
					// 		var val = $.formatMoney(data);
					// 		return val == '0.00' ? '' : val;
					// 	}
					// }, {
					// 	title: "贷方金额",
					// 	data: "crStadAmt",
					// 	className: 'tr nowrap isprint tdNum',
					// 	render: function (data, type, rowdata, meta) {
					// 		var val = $.formatMoney(data);
					// 		return val == '0.00' ? '' : val;
					// 	}
					// },
					// {
					// 	title: "差异方向",
					// 	data: "dfDc",
					// 	className: 'tc nowrap isprint',
					// 	render: function (data, type, rowdata, meta) {
					// 		if (data == '' || data == null) {
					// 			data = ''
					// 		}
					// 		return '<span  title="' + data + '">' + data + '</span>'
					// 	}
					// },
					{
						title: "差异项",
						data: "difference",
						className: 'nowrap isprint ',
						render: function (data, type, rowdata, meta) {
							if (data == '' || data == null) {
								data = ''
							}
							return '<span  title="' + data + '">' + data + '</span>'
						}
					},
					{
						title: "差异金额",
						data: "surplusAmt",
						className: 'nowrap tr isprint',
						render: function (data, type, rowdata, meta) {
							var val = $.formatMoney(data);
							return val == '0.00' ? '' : val;
						}
					},
				];
				pageLength = ufma.dtPageLength('#gridDPE');
				var opts = {
					"language": {
						"url": bootPath + "agla-trd/datatables/datatable.default.js"
					},
					"bFilter": true,
					"bPaginate": true,
					"autoWidth": false,
					"bDestory": true,
					"processing": true, //显示正在加载中
					"pagingType": "full_numbers", //分页样式
					"lengthChange": true, //是否允许用户自定义显示数量p
					"lengthMenu": [
						[10, 20, 50, 100, 200, -1],
						[10, 20, 50, 100, 200, "全部"]
					],
					"pageLength": pageLength, //默认每页显示100条--zsj--吉林公安需求
					"serverSide": false,
					"ordering": false,
					columns: columns,
					data: [],
					"dom": '<"datatable-toolbar"B>rt<"' + tableId + '-paginate"ilp>',
					buttons: [
					//guohx 原本是将打印按钮禁用掉了 我注释了 影响了导出的样式，如果之后要用，请放开调试 20200707 CWYXM-17880 mysql:账务处理，差异明细项，导出按钮，边框显示不全
					// 	{
					// 	extend: 'print',
					// 	text: '<i class="glyphicon icon-print" aria-hidden="true"></i>',
					// 	exportOptions: {
					// 		columns: [0, 1, 2, 3, 4, 5, 6, 7]
					// 	},
					// 	customize: function (win) {
					// 		$(win.document.body).find('h1').css("text-align", "center");
					// 		$(win.document.body).css("height", "auto");
					// 	}
					// },
					{
						extend: 'excelHtml5',
						text: '<i class="glyphicon icon-upload" aria-hidden="true"></i>',
						exportOptions: {
							columns: [0, 1, 2, 3, 4, 5, 6, 7]
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
						$('.' + tableId + '-paginate').appendTo($info);
						// $("#dtToolbar .buttons-print").css("border-radius", "4px 0 0 4px").addClass("btn-print btn-permission").attr({
						// 	"data-toggle": "tooltip",
						// 	"title": "打印"
						// }).removeAttr("href").css("display", "none");
						$("#dtToolbar .buttons-excel").css("border-radius", "0 4px 4px 0").addClass("btn-export").attr({
							"data-toggle": "tooltip",
							"title": "导出"
						});
						//导出begin
						// $("#dtToolbar .buttons-excel").off().on('click', function (evt) {
						// 	evt = evt || window.event;
						// 	evt.preventDefault();
						// 	ufma.expXLSForDatatable($('#gridDPE'), '差异项明细账');
						// });
						//导出end
						// $(".btn-print").off().on("click", function () {
						// 	var postSetData = {
						// 		reportCode:'GL_RPT_SURPLUSJOURNAL',
						// 		templId:'*'
						// 	}
						// 	$.ajax({
						// 		type: "POST",
						// 		url: "/pqr/api/iprint/templbycode",
						// 		dataType: "json",
						// 		data: postSetData,
						// 		success: function(data) {
						// 			var printcode= data.data.printCode
						// 			var medata = JSON.parse(data.data.tempContent)
						// 			var runNum = data.data.rowNum
						// 			var outTableData = {}
						// 			outTableData.agency= rpt.nowAgencyCode+' '+rpt.nowAgencyName
						// 			outTableData.times = $("#minOccurDate").getObj().getValue()+'至'+$("#maxOccurDate").getObj().getValue()
						// 			outTableData.acco = ''
						// 			outTableData.printor = rpt.nowUserName
						// 			outTableData.startPage = 1
						// 			outTableData.logo = '/pf/pub/css/logo.png'
						// 			outTableData.date = rpt.today
						// 			outTableData.title = '差异项明细账'
						// 			outTableData.showWatermark = true
						// 			var pagelen = page.printdata.length
						// 			outTableData.totalPage= Math.ceil(pagelen/runNum)
						// 			for(var i =0;i<page.printdata.length;i++){
						// 				page.printdata[i].vounos = page.printdata[i].vouTypeName + '-' + page.printdata[i].vouNo
						// 			}
						// 			var datas = {
						// 				tableData:page.printdata,
						// 				tableHead:{},
						// 				outTableData:outTableData
						// 			}
						// 			var names = medata.template
						// 			var html = YYPrint.engine(medata.template,medata.meta, datas);
						// 			YYPrint.print(html)
						// 		},
						// 		error: function() {}
						// 	});
						// })
						$('#dtToolbar [data-toggle="tooltip"]').tooltip();
						$(".btn-export").off().on('click', function (evt) {
							evt = evt || window.event;
							evt.preventDefault();
							uf.expTable({
								title: '差异项明细账',
								topInfo:[],
								exportTable: '#gridDPE'
							});
						});
						ufma.isShow(page.reslist);
						// ufma.setBarPos($(window));
						//固定表头
						$("#gridDPE").fixedTableHead();
					},
					"drawCallback": function (settings) {
						ufma.isShow(page.reslist);
						// ufma.setBarPos($(window));
						pageLength = ufma.dtPageLength($(this));
						$("#gridDPE").find("tbody tr").on("click", function () {
							$(this).toggleClass("selected-high-light")
								.siblings().removeClass("selected-high-light");
						})
					}
				}

				oTable = $("#" + tableId).dataTable(opts);
			},
			loadGridDPE: function () {
				var argu = $('#frmQuery').serializeObject();
				argu = $.extend(argu, {
					agencyCode: $('#cbAgency').getObj().getValue(),
					acctCode: $('#cbAcct').getObj().getValue(),
					setYear: ptData.svSetYear,
					rgCode: ptData.svRgCode,
					surplusCodes: areatreedata,
				});
				ufma.showloading('正在加载数据，请耐心等待...');
				dm.loadGridData(argu, function (result) {
					ufma.hideloading();
					oTable.fnClearTable();
					if (result.data.length > 0) {
						page.printdata = result.data
						oTable.fnAddData(result.data, true);
					}
					$('#gridDPE').closest('.dataTables_wrapper').ufScrollBar({
						hScrollbar: true,
						mousewheel: false
					});
					ufma.setBarPos($(window));
					//表格底部工具栏宽度
					$("#tool-bar").width($(".workspace").width() - 350);
					$(".slider").width($("#wrap").width() - 350);

				});
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
				$("#" + startId).getObj().setValue(Year + '-' + Month + '-' + Day);
				$("#" + endId).getObj().setValue(Year + '-' + Month + '-' + Day);
			},

			onEventListener: function () {
				$('#btnQuery').click(function () {
					if ($('#minOccurDate').getObj().getValue() > $('#maxOccurDate').getObj().getValue()) {
						ufma.showTip('开始日期不能大于结束日期！', function () { }, 'error');
						return false;
					}
					page.loadGridDPE();
				});
				//修改问题：CWYXM-3908--	差异项明细表增加联查凭证功能--zsj

				$('#gridDPE').on('click', 'tbody td .turn-vou', function (e) {
					var vouGuid = $(this).attr("data-vouguid"); //凭证id
					if(vouGuid) {
						var url = '/pf/gl/vou/index.html?menuid=' + rpt.vouMenuId + '&dataFrom=differAccount&action=query';
						if (typeof hex_md5 === "function" && ufma.getCommonData().svUserCode != null) {
							if (url.indexOf('?') > 0) {
								url = url + "&rueicode=" + hex_md5(ufma.getCommonData().svUserCode)
							} else {
								url = url + "?rueicode=" + hex_md5(ufma.getCommonData().svUserCode)
							}
						}
						ufma.removeCache("cacheData");
						//缓存数据
						var cacheData = {};
						cacheData.agencyCode = rpt.nowAgencyCode;
						cacheData.acctCode = rpt.nowAcctCode;
						cacheData.startVouDate = $('#minOccurDate').getObj().getValue();
						cacheData.endVouDate = $('#maxOccurDate').getObj().getValue();
						ufma.setObjectCache("cacheData", cacheData);
						/*$(this).attr('data-href', url + '&vouGuid=' + vouGuid + '&agencyCode=' + rpt.nowAgencyCode + '&acctCode=' + rpt.nowAcctCode);
						$(this).attr('data-title', '凭证录入');
						window.parent.openNewMenu($(this));*/
						var baseUrl = url + '&vouGuid=' + vouGuid + '&agencyCode=' + rpt.nowAgencyCode + '&acctCode=' + rpt.nowAcctCode;
				    uf.openNewPage(page.isCrossDomain, $(this), 'openMenu', baseUrl, false, "凭证录入");
					}
				});
				 
				//选择期间，改变日历控件的值
				$("#dateBq").on("click", function () {
					page.dateBenQi("minOccurDate", "maxOccurDate");
				});
				$("#dateBn").on("click", function () {
					page.dateBenNian("minOccurDate", "maxOccurDate");
				});
				$("#dateJr").on("click", function () {
					page.dateToday("minOccurDate", "maxOccurDate");
				});
			},
			checkDate: function (fmtDate, id) {
				var date = ptData.svTransDate;
				var year = new Date(date).getFullYear();
				if (fmtDate != "") {
					var curDate = new Date(fmtDate)
					var curYear = curDate.getFullYear();
					if (curYear !== "" && curYear !== undefined && year !== curYear) {
						ufma.showTip("只能选择登录年度日期", function () {
							$(id).getObj().setValue("")
						}, "warning");

					}
				}
			},
			//初始化页面
			initPage: function () {
				page.reslist = ufma.getPermission();
				ufma.isShow(page.reslist);
				page.nowDate = ptData.svTransDate; //当前年月日
				page.setYear = ptData.svSetYear; //本年 年度
				page.month = ptData.svFiscalPeriod; //本期 月份
				page.today = ptData.svTransDate; //今日 年月日

				this.initAgencyScc();
				/////////////
				var signInDate = new Date(ptData.svTransDate),
					y = signInDate.getFullYear(),
					m = signInDate.getMonth();
				$('#minOccurDate').ufDatepicker({
					format: 'yyyy-mm-dd',
					//viewMode:'month',
					initialDate: new Date(y, m, 1),
					onChange: function (fmtDate) {
						page.checkDate(fmtDate, "#minOccurDate")
					}
				});
				$('#maxOccurDate').ufDatepicker({
					format: 'yyyy-mm-dd',
					//viewMode:'month',
					initialDate: new Date(y, m + 1, 0),
					onChange: function (fmtDate) {
						page.checkDate(fmtDate, "#maxOccurDate")
					}
				});
				page.initGridDPE();
			},

			init: function () {
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