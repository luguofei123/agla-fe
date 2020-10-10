/*
 * 2018-6-8zhaoxj
 * 进入页面请求单位树，默认set单位值，触发change,请求单据方案，走查询接口，渲染table
 * 切换tab页签走查询接口，再渲染table
 * */
$(function () {
	//获取session
	var ptData = ufma.getCommonData();
	var bennian = ptData.svSetYear; //本年 年度
	var benqi = ptData.svFiscalPeriod; //本期 月份
	var today = ptData.svTransDate; //今日 年月日
	var pageLength = ufma.dtPageLengthbackend('assetBooking-data');
	var timeId = null;
	var vouGen = false;
	var datachneng = [];
	var nowAgencyCode = ptData.svAgencyCode;
	var nowAgencyName = ptData.svAgencyName;
	var nowAcctCode = ptData.svAcctCode;
	var nowAcctName = ptData.svAcctName;
	var nowSchemeGuid = '';
	var nowSchemeType = '';
	var serachData = { // CWYXM-12100：修改为后端分页
		currentPage: 1,
		pageSize: pageLength,
	};

	var vousourcelist = []
	var changeVgFlag = true; // 方案可点击
	var isRememberedGL072;//系统选项
	var rowTableData = {};
	//接口URL集合
	var interfaceURL = {
		search: "/lp/getBussinessBillData/search", //查询
		getTemplateNames: "/lp/template/getYwdjTemplateNames", //请求模版名称
		getAgencyTree: "/lp/eleAgency/getAgencyTree", //请求单位树
		getSchemeTypes: "/lp/scheme/getBussinessSchemeTypes/", //根据单位id获取单据方案列表
		getTableHeadName: "/lp/scheme/getTableHeadName", //导入数据时获取表头信息
		deleteBillByGuid: "/lp/getBillData/deleteBillByGuid/", //删除单据
		createTargerBill: "/lp/targetBillCreate/createTargerBill", //批量生成
		createHzTargerBill: "/lp/targetBillCreate/createHzTargerBill", //有主单据编号的批量生成
		controlBigVou: "/lp/targetBillCreate/controlBigVou", // 大数据量的批量生成接口
		getBillGuids: "/lp/getBillData/getBillGuids", // 查询所有单据billGuid的接口
		preview: "/lp/targetBillCreate/preview", //预览
		cancelGenerateBill: "/lp/targetBillCreate/cancelGenerateBill", //取消生成的单据
		viewVoucher: "/lp/targetBillCreate/viewVoucher/", //单据生成之后查看凭证
		savePreviewTargetBill: "/lp/targetBillCreate/savePreviewTargetBill", //保存预览的单据对象
		getEnumerate: "/lp/enumerate/List/", //枚举表获取科目合并方式
		getEleCommonTree: "/lp/sys/getEleCommonTree/", //根据要素编码获取要素的值
		zfPlan: "/lp/getBillData/zfPlan", //导入webservice
		importBillData: "/lp/scheme/importBillData", //导入中间库数据
		getAcct: "/lp/sys/getRptAccts", //账套
		getRptAccoTree: "/coaAcc/getRptAccoTree", //获取会计科目
		getVouType: "/lp/sys/getVouType/", //凭证类型
		lpBillRestore: "/lp/getBillData/lpBillRestore", //还原
		lpBillNoGenerate: "/lp/getBillData/lpBillNoGenerate", //不生成
		getVousource:'/lp/enumerate/List/VOU_SOURCE'
	};

	var pfData = ufma.getCommonData();
	var searchKey = ufma.sessionKey("lp", "assetBooking", pfData.svRgCode, pfData.svSetYear, pfData.svAgencyCode, pfData.svAcctCode, "assetBooking" + "_searchKey");

	var page = function () {

		//定义datatables全局变量
		var vgDataTable;

		//定义门户local storage数据
		var svData;

		//行选中保存
		var mainSelectedRows = [],
			inputChecks = [];

		var ulL = 0, liL = 0;

		return {

			//字符串下滑线转驼峰
			strTransform: function (str) {
				str = str.toLowerCase();
				var re = /_(\w)/g;
				str = str.replace(re, function ($0, $1) {
					return $1.toUpperCase();
				});
				return str;
			},
			hasStr: function (str, hasStr) {
				if (str != null) {
					return str.indexOf(hasStr) >= 0;
				} else {
					return false;
				}
			},
			//更多条件设置弹框
			moreQuerySet: function (data) {
				if (data != undefined) {
					for (var i = 0; i < data.length; i++) {
						//如果不是单据编号就创建节点
						if (data[i].lpField !== "BILL_NO" && !page.hasStr(data[i].lpField, "BILL_DATE")) {
							var $label = $('<label class="mt-checkbox mt-checkbox-outline" title="' + data[i].itemName + '">' +
								'<input type="checkbox" name="' + page.strTransform(data[i].lpField) + '" data-itype="' + data[i].enuCode + '"  eleCode="' + data[i].eleCode + '">&nbsp;<i>' + data[i].itemName + '</i>' +
								//'<input type="checkbox" name="' + data[i].lpField + '" data-itype="' + data[i].itemType + '" >&nbsp;<i>' + data[i].itemName + '</i>' +
								'<span></span></label>');
							$('.lp-setting-box-body').append($label);
						}
					}
				}
			},

			//数组去重
			arrDistinct: function (arr) {
				var n = [];
				for (var i = 0; i < arr.length; i++) {
					if (n.indexOf(arr[i]) == -1) {
						n.push(arr[i]);
					}
				}
				return n;
			},

			//如果field是要素，获取该要素select下拉框选项，接口：/lp/getBillData/getComboData/ + agencyCode + / + field
			getComboData: function (result) {
				page.contentEle = result.data;
			},
			//组织要素类型条件的数据（用于更多条件查询时，select的选项），使用新接口，放弃此方法
			arrangeEle: function (eleArr) {
				if (eleArr != null) {
					page.eleData = [];
					for (var i = 0; i < eleArr.length; i++) {
						page.contentEle = [];
						ufma.ajaxDef("/lp/getBillData/getComboData/" + page.cbAgency.getValue() + "/" + eleArr[i], "get", "", page.getComboData);
						var eleOne = [];
						for (var j = 0; j < page.contentEle.length; j++) {
							eleOne.push(page.contentEle[j][eleArr[i]]);
						}
						page.eleData[eleArr[i]] = page.arrDistinct(eleOne);
					}
				}
			},
			//组织要素类型条件的数据（用于更多条件查询时，select的选项）
			getEle: function () {
				var url = interfaceURL.getEle + page.cbAgency.getValue();
				//请求要素列表
				ufma.get(url, "", function (res) {
					page.eleData = res.data;
				});
			},
			//获得单据数据
			getBillData: function (result) {
				vouGen = false;
				if (result.data != null) {
					page.amt = result.data.amt;

					//组织表头数据
					var tHead = result.data.item;
					if (tHead != undefined) {
						//datatables表头数据结构
						var tColumns = [];
						var noIndex; //获得编号数据的index，用于列表格数据渲染
						page.infoData = [];
						var eleArr = []; //筛选出数据类型为要素的字段
						var targetBill = []; //金额列
						// #4268 资产记账已生成页签，将凭证字号放到第一列
						if ($('ul.nav-tabs').find('li.active a').attr("data-state") == "0") {
							tColumns.push({
								title: "凭证字号",
								data: "PZZH",
								className: "isprint nowrap ellipsis",
								render: function (data, type, rowdata, meta) {
									if (!data) {
										return "";
									}
									return '<span class="billurlvou" main-bill-no="' + rowdata.MAIN_BILL_NO + '" data-guid="' + rowdata.BILL_GUID + '">' + data + '</span>';
								}
							});
						}
						for (var i = 0; i < tHead.length; i++) {
							if (tHead[i].lpField == "MAIN_BILL_NO") {
								vouGen = true;
							}
							if (tHead[i].lpField == "BILL_NO") {
								if ($('ul.nav-tabs').find('li.active a').attr("data-state") == "-1") {
									noIndex = i + 1;
								} else {
									noIndex = i;
								}
							}
							//获得金额
							if (tHead[i].lpField != "BILL_NO" && page.hasStr(tHead[i].lpField, "AMT")) {
								if ($('ul.nav-tabs').find('li.active a').attr("data-state") === "0") {
									targetBill.push((i + 2));
								} else {
									targetBill.push((i + 1));
								}
							}

							if (tHead[i].lpField != null) {
								var billItem = {
									name: tHead[i].itemName,
									//val : page.strTransform(tHead[i].lpField)
									val: tHead[i].lpField
								};
								page.infoData.push(billItem);
								if (page.hasStr(tHead[i].lpField, "AMT")) { //金额
									var headOne = {
										title: tHead[i].itemName,
										//data : page.strTransform(tHead[i].lpField),
										data: tHead[i].lpField,
										className: "isprint nowrap ellipsis tdNum",
									};
									tColumns.push(headOne);
								} else { 
									//只有资产新增类型的并且系统选项-资产记账可以完善资产卡片的财务信息时 才可以打开弹窗 guohx 20200914
									if (tHead[i].lpField == "BILL_NO" && isRememberedGL072 && nowSchemeType == "1") {
										var headOne = {
											title: tHead[i].itemName,
											data: tHead[i].lpField,
											className: "isprint nowrap",
											render: function (data, type, rowdata, meta) {
												if (!data) {
													return "";
												}
												return "<a class='viewData under-line common-jump-link' data-index='" + rowdata.BILL_NO + "'>" + data + "</a>";
											}
										};
									}else{
										var headOne = {
											title: tHead[i].itemName,
											data: tHead[i].lpField,
											className: "isprint nowrap",
											render: function (data, type, rowdata, meta) {
												if (!data) {
													return "";
												}
												return data;
											}
										};
									}
									
									tColumns.push(headOne);
								}

							}

							if (tHead[i].itemType == "07") {
								eleArr.push(page.strTransform(tHead[i].lpField));
								//eleArr.push(tHead[i].lpField);
							}
						}

						//列数据渲染
						var tColumnDefs = [];
						var headCheck = {
							title: '<label class="mt-checkbox mt-checkbox-single mt-checkbox-outline">' +
								'<input type="checkbox" id="th-check" class="datatable-group-checkable" data-set="#data-table .checkboxes" />' +
								'&nbsp;<span></span></label>',
							className: "nowrap check-style",
							data: null,
						};
						tColumns.unshift(headCheck);
						var defCheck = {
							"targets": [0],
							"serchable": false,
							"orderable": false,
							"className": "col-check",
							"render": function (data, type, rowdata, meta) {
								return '<label class="mt-checkbox mt-checkbox-single mt-checkbox-outline"> ' +
									'<input type="checkbox" class="checkboxes" value="' + data + '" main-bill-no="' + rowdata.MAIN_BILL_NO + '" data-guid="' + rowdata.BILL_GUID + '"/>' +
									'&nbsp;<span></span></label>';
							}
						}
						tColumnDefs.unshift(defCheck);
						var amtRender = {
							"targets": targetBill,
							"serchable": false,
							// "orderable": true,
							"render": $.fn.dataTable.render.number(',', '.', 2, '')
						}
						tColumnDefs.push(amtRender);
						//未生成时操作按钮:生成、删除、预览，已生成时操作按钮:取消生成、查看凭证
						if ($('ul.nav-tabs').find('li.active a').attr("data-state") == "-1") {

							var headact = {
								title: "操作",
								className: "nowrap",
								data: null,
								"orderable": false,
								width: 120,
								"render": function (data, type, rowdata, meta) {
									return '<a class="btn btn-icon-only btn-sm vg-vougen btn-gen btn-permission" main-bill-no="' + rowdata.MAIN_BILL_NO + '" data-guid="' + rowdata.BILL_GUID + '" data-toggle="tooltip" action= "" title="生成">' +
										'<span class="glyphicon icon-result"></span></a>' +
										'<a class="btn btn-icon-only btn-sm vg-preview btn-preview btn-permission" main-bill-no="' + rowdata.MAIN_BILL_NO + '" data-guid="' + rowdata.BILL_GUID + '" data-toggle="tooltip" action= "" title="预览">' +
										'<span class="glyphicon icon-details"></span></a>' +
										// '<a class="btn btn-icon-only btn-sm vg-accItems btn-add-accItems btn-permission" data-guid="'+rowdata.BILL_GUID+'" data-toggle="tooltip" action= "" title="补充核算信息">' +
										// '<span class="glyphicon icon-navicon"></span></a>' +
										'<a class="btn btn-icon-only btn-sm vg-cancel-card btn-cancel btn-permission" main-bill-no="' + rowdata.MAIN_BILL_NO + '" data-guid="' + rowdata.BILL_GUID + '" data-toggle="tooltip" action= "" title="不生成">' +
										'<span class="glyphicon icon-uniE96D" style="margin-top:4px"></span></a>' +
										'<a class="btn btn-icon-only btn-sm vg-del btn-delete btn-permission" main-bill-no="' + rowdata.MAIN_BILL_NO + '" data-guid="' + rowdata.BILL_GUID + '" data-toggle="tooltip" action= "" title="删除">' +
										'<span class="glyphicon icon-trash"></span></a>';
								}
							};
							tColumns.push(headact);
						} else if ($('ul.nav-tabs').find('li.active a').attr("data-state") == "0") {
							tColumns.push({
								title: "生成方式",
								data: "INPUTMODE",
								className: "isprint nowrap ellipsis",
								render: function (data, type, rowdata, meta) {
									if (!data) {
										return "";
									}
									return data;
								}
							});
							var headact = {
								title: "操作",
								className: "nowrap",
								data: null,
								"orderable": false,
								width: 120,
								render: function (data, type, rowdata, meta) {
									return '<a class="btn btn-icon-only btn-sm vg-check btn-watch btn-permission" data-guid="' + rowdata.BILL_GUID + '" data-toggle="tooltip" action= "" title="查看凭证">' +
										'<span class="glyphicon icon-eye"></span></a>' +
										'<a class="btn btn-icon-only btn-sm vg-recover btn-gen-cancel btn-permission" data-guid="' + rowdata.BILL_GUID + '" data-toggle="tooltip" action= "" title="取消生成">' +
										'<span class="glyphicon icon-recover"></span></a>'
								}
							};
							tColumns.push(headact);
						} else if ($('ul.nav-tabs').find('li.active a').attr("data-state") == "2") {
							var headact = {
								title: "操作",
								className: "nowrap",
								data: null,
								"orderable": false,
								width: 120,
								render: function (data, type, rowdata, meta) {
									return '<a class="btn btn-icon-only btn-sm vg-un-cancel btn-un-cancel btn-permission" main-bill-no="' + rowdata.MAIN_BILL_NO + '"  data-guid="' + rowdata.BILL_GUID + '" data-toggle="tooltip" action= "" title="还原">' +
										'<span class="glyphicon icon-return"></span></a>' +
										'<a class="btn btn-icon-only btn-sm vg-delete btn-delete btn-permission" main-bill-no="' + rowdata.MAIN_BILL_NO + '"  data-guid="' + rowdata.BILL_GUID + '" data-toggle="tooltip" action= "" title="删除">' +
										'<span class="glyphicon icon-trash"></span></a>'
								}
							};
							tColumns.push(headact);
						}
					}

					if (!$('.lp-setting-box-body').children().get(0)) {
						//更多条件设置
						page.moreQuerySet(tHead);
					}
					// page.arrangeEle(eleArr);
					if ($.isEmptyObject(result.data) === true) {
						page.showTableData([], [{
							data: null
						}], []);
					} else {
						page.showTableData(result.data, tColumns, tColumnDefs);
					}
					// CWYXM-12100：修改为后端分页
					var paging = result.data;
					// 分页部分功能 -- B
					//分页  不分页需判断
					if(!$.isNull(paging.content)){
						if (paging.content.pageSize != 0) {
							//创建基本分页节点
							var $pageBase = $('<ul id="vbTable-pagination" class="pagination pagination-sm pull-left"></ul>');
							//创建上一页节点  根据当前也判断是否可以点
							var $pagePrev;
							if ((paging.content.pageNum - 1) == 0) {
								$pagePrev = $('<li class="vbPrevPage disabled"><span><span aria-hidden="true" class="glyphicon icon-angle-left"></span></span></li>');
							} else {
								$pagePrev = $('<li class="vbPrevPage"><a href="javascript:;" aria-label="Previous" data-prevpage=' + (paging.content.pageNum - 1) + '>' +
									'<span aria-hidden="true" class="glyphicon icon-angle-left"></span>' +
									'</a></li>');
							}
							$pageBase.append($pagePrev);
							//创建页数节点,根据pageSize和凭证数据总数
							//创建页数变量
							var pageAmount = Math.ceil(paging.count / paging.content.pageSize);
							var $pageItem;
							for (var k = 1; k <= pageAmount; k++) {
								//第一页和最后一页显示
								if (k == 1 || k == pageAmount) {
									//三元运算判断是否当前页
									$pageItem = (k == paging.content.pageNum) ? $('<li class="vbNumPage active"><span data-gopage=' + k + '>' + k + ' <span class="sr-only">(current)</span></span></li>') : $('<li class="vbNumPage"><a href="javascript:;" data-gopage=' + k + '>' + k + '</a></li>');
								} else {
									//判断分页页数除去第一页和最后一页按钮的剩下的按钮数量是否大余3
									if ((pageAmount - 2) <= 3) {
										//三元运算判断是否当前页
										$pageItem = (k == paging.content.pageNum) ? $('<li class="vbNumPage active"><span data-gopage=' + k + '>' + k + ' <span class="sr-only">(current)</span></span></li>') : $('<li class="vbNumPage"><a href="javascript:;" data-gopage=' + k + '>' + k + '</a></li>');
									} else if ((pageAmount - 2) > 3) {
										//判断当前页位置
										if (paging.content.pageNum <= 2) {
											//分页按钮加载2到4之间
											if (k >= 2 && k <= 4) {
												//三元运算判断是否当前页
												$pageItem = (k == paging.content.pageNum) ? $('<li class="vbNumPage active"><span data-gopage=' + k + '>' + k + ' <span class="sr-only">(current)</span></span></li>') : $('<li class="vbNumPage"><a href="javascript:;" data-gopage=' + k + '>' + k + '</a></li>');
											}
										} else if (paging.content.pageNum > 2 && paging.content.pageNum < (pageAmount - 1)) {
											//分页按钮加载pageNum-1到pageNum+1之间
											if (k >= (paging.content.pageNum - 1) && k <= (paging.content.pageNum + 1)) {
												//三元运算判断是否当前页
												$pageItem = (k == paging.content.pageNum) ? $('<li class="vbNumPage active"><span data-gopage=' + k + '>' + k + ' <span class="sr-only">(current)</span></span></li>') : $('<li class="vbNumPage"><a href="javascript:;" data-gopage=' + k + '>' + k + '</a></li>');
											}
										} else if (paging.content.pageNum >= (pageAmount - 1)) {
											//分页按钮加载pageAmount-3到pageAmount-1之间
											if (k >= (pageAmount - 3) && k <= (pageAmount - 1)) {
												//三元运算判断是否当前页
												$pageItem = (k == paging.content.pageNum) ? $('<li class="vbNumPage active"><span data-gopage=' + k + '>' + k + ' <span class="sr-only">(current)</span></span></li>') : $('<li class="vbNumPage"><a href="javascript:;" data-gopage=' + k + '>' + k + '</a></li>');
											}
										}
									}
								}
								$pageBase.append($pageItem);
							}
							//创建下一页节点 根据当前页判断是否可以点
							var $pageNext;
							if ((pageAmount - paging.content.pageNum) == 0) {
								$pageNext = $('<li class="vbNextPage disabled"><span><span aria-hidden="true" class="glyphicon icon-angle-right"></span></span></li>');
							} else {
								$pageNext = $('<li class="vbNextPage"><a href="javascript:;" aria-label="Next" data-nextpage=' + (paging.content.pageNum + 1) + '>' +
									'<span aria-hidden="true" class="glyphicon icon-angle-right"></span>' +
									'</a></li>');
							}
							$pageBase.append($pageNext);
							$("#assetBooking .ufma-table-paginate").html($pageBase);
						}
					}
					//修改无方案的时候，点击查询会出现多个分页 guohx  20200921
					if($.isNull(paging.content)){
						$(".ufma-table-paginate").html("");
					}
					//创建分页大小基本节点
					var $pageSizeBase = $('<div class="pull-left" style="margin: 0 16px;"></div>');
					var $pageSel = $('<select class="vbPageSize bordered-input"></select>');
					//根据pageSize创建下拉列表
					//分页数组
					var pageArr = [20, 50, 100, 200, 500, 1000, 2000];
					var $pageOp;
					//定义是否不分页变量
					var isNoPaging;
					for (var n = 0; n < pageArr.length; n++) {
						isNoPaging = (pageArr[n] == 0) ? "不分页" : pageArr[n];
						if (pageArr[n] == serachData.pageSize) {
							$pageOp = $('<option value=' + pageArr[n] + ' selected>' + isNoPaging + '</option>');
						} else {
							$pageOp = $('<option value=' + pageArr[n] + '>' + isNoPaging + '</option>');
						}
						$pageSel.append($pageOp);
					}
					$pageSizeBase.append("<span>显示 </span>");
					$pageSizeBase.append($pageSel);
					$pageSizeBase.append("<span> 条</span>");
					$("#assetBooking .ufma-table-paginate").prepend($pageSizeBase);

					//创建总数统计节点
					var $vouDataSum = $('<div class="pull-left">共 <span class="vbSum">' + (paging.count ? paging.count : 0) + '</span> 条</div>');
					$("#assetBooking .ufma-table-paginate").prepend($vouDataSum);
					
				}
				// ufma.hideloading();
			},
			//datatables数据显示
			showTableData: function (dataObj, columnsArr, columnDefsArr) {
				var id = "assetBooking-data";
				var data = dataObj.length == 0 ? [] : dataObj.content.list;
				// var toolBar = $('#' + id).attr('tool-bar');
				vgDataTable = $('#' + id).DataTable({
					"language": {
						"url": bootPath + "agla-trd/datatables/datatable.default.js"
					},
					"data": data,
					"searching": true,
					"bFilter": false, //去掉搜索框
					// "bLengthChange": true, //去掉每页显示多少条数据
					"processing": false, //显示正在加载中
					"pagingType": "full_numbers", //分页样式
					"paging": false,
					"bInfo": true, //页脚信息
					"bSort": false, //排序功能
					"bProcessing": true,
					"bDestroy": true,
					"columns": columnsArr,
					"columnDefs": columnDefsArr,
					"ordering": true,
					"bAutoWidth": true, //表格自定义宽度，和swidth一起用
					"fixedHeader": true, //同时固定表头和列样式
					"dom": '<"datatable-toolbar"B>rt<"' + id + '-paginate"ilp>',
					"buttons": [{
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
					"initComplete": function (settings, json) {
						//打印&导出按钮
						$('.datatable-toolbar').appendTo('#dtToolbar');
						// $('#datatables-print').html('');
						// $('#datatables-print').append($(".printButtons"));
						$(".datatable-toolbar .buttons-print").addClass("btn-print btn-permission").attr({
							"data-toggle": "tooltip",
							"title": "打印"
						});
						$(".datatable-toolbar .buttons-excel").addClass("btn-export btn-permission").attr({
							"data-toggle": "tooltip",
							"title": "导出"
						});

						var maxLen = (Math.floor(($(document.body).width() - 32 - 290- 426 - 30) / 150));
						if (page.amt) {
							//渲染总金额
							var amtHtml = '<span style="padding-right: 10px">共' + dataObj.count + '条数据</span>';
							var moreAmtHtml = '';
							if (page.amt.length > maxLen) {
								$(".show-more-amt-btn").show();
							} else {
								$(".show-more-amt-btn").hide();
							}
							for (var i = 0; i < page.amt.length; i++) {
								if (i < maxLen) {
									amtHtml += '<span style="padding-right: 10px">' + page.amt[i] + '</span>';
								} else {
									moreAmtHtml += '<li>'+ page.amt[i] +'</li>'
								}
							}
							$(".tool-show-amt").html('');
							$(".tool-show-amt").append(amtHtml);
							$(".more-amt-list").html('');
							$(".more-amt-list").append(moreAmtHtml);
						} else {
							$(".show-more-amt-btn").hide();
						}

						//导出begin
						$("#dtToolbar .buttons-excel").off().on('click', function (evt) {
							evt = evt || window.event;
							evt.preventDefault();
							ufma.expXLSForDatatable($('#' + id), '资产记账');
						});
						//导出end

						// 同时固定表头和列样式
						// $('#assetBooking-data_wrapper').ufScrollBar({
						// 	hScrollbar: true,
						// 	mousewheel: false
						// });
						ufma.setBarPos($(window));
						//驻底end

						//未生成时，才能批量操作
						if ($('ul.nav-tabs').find('li.active a').attr("data-state") == "-1") {
							$('.tool-btns-hasGenerated').hide();
							$('.tool-btns-noGenerated').hide();
							$(".tool-btns-preGenerated").show();
						} else if ($('ul.nav-tabs').find('li.active a').attr("data-state") == "0") {
							$('.tool-btns-hasGenerated').show();
							$(".tool-btns-preGenerated").hide();
							$('.tool-btns-noGenerated').hide();
						} else {
							$('.tool-btns-hasGenerated').hide();
							$(".tool-btns-preGenerated").hide();
							$('.tool-btns-noGenerated').show();
						}

						//checkbox的全选操作
						$("body").on("click", 'input#th-check', function () { // 表头全选
							var isCorrect = $(this).is(':checked');
							if (isCorrect) {
								$('.datatable-group-checkable-all').prop("checked", false); // 勾选全选当前页，取消全选所有页选中效果
								$("span.selRows").show();
							}
							$('#' + id + ' .checkboxes').each(function () {
								isCorrect ? $(this).prop("checked", !0) : $(this).prop("checked", !1);
								isCorrect ? $(this).closest("tr").addClass("selected") : $(this).closest("tr").removeClass("selected");
							});
							$('#assetBooking-dataleft .checkboxes').each(function () {
								isCorrect ? $(this).prop("checked", !0) : $(this).prop("checked", !1);
								isCorrect ? $(this).closest("tr").addClass("selected") : $(this).closest("tr").removeClass("selected");
							})
							$('.datatable-group-checkable').prop("checked", isCorrect);
							if (isCorrect) { // 全选修改mainSelectedRows和inputChecks
								var dataArr = vgDataTable.data();
								for (var i = 0; i < dataArr.length; i++) {
									mainSelectedRows.push(dataArr[i].MAIN_BILL_NO);
									inputChecks.push(true);
								}
							} else {
								mainSelectedRows = [];
								inputChecks = [];
							}
							$("#assetBooking-data_wrapper").find("tbody tr").each(function(){
								$(this).find('input.checkboxes').attr("checked", isCorrect).prop("checked", isCorrect);
								if (isCorrect) {
									$(this).addClass("selected");
								} else {
									$(this).removeClass("selected");
								}
							})
							page.calculateAmts()
						});

						$('.datatable-group-checkable').on("change", function () {
							var isCorrect = $(this).is(':checked');
							if (isCorrect) {
								$('.datatable-group-checkable-all').prop("checked", false); // 勾选全选当前页，取消全选所有页选中效果
								$("span.selRows").show();
							}
							$('#' + id + ' .checkboxes').each(function () {
								isCorrect ? $(this).prop("checked", !0) : $(this).prop("checked", !1);
								isCorrect ? $(this).closest("tr").addClass("selected") : $(this).closest("tr").removeClass("selected");
							})
							$('#assetBooking-dataleft .checkboxes').each(function () {
								isCorrect ? $(this).prop("checked", !0) : $(this).prop("checked", !1);
								isCorrect ? $(this).closest("tr").addClass("selected") : $(this).closest("tr").removeClass("selected");
							})
							$('.datatable-group-checkable').prop("checked", isCorrect);
							if (isCorrect) { // 全选修改mainSelectedRows和inputChecks
								var dataArr = vgDataTable.data();
								for (var i = 0; i < dataArr.length; i++) {
									mainSelectedRows.push(dataArr[i].MAIN_BILL_NO);
									inputChecks.push(true);
								}
							} else {
								mainSelectedRows = [];
								inputChecks = [];
							}
							$("#assetBooking-data_wrapper").find("tbody tr").each(function(){
								$(this).find('input.checkboxes').attr("checked", isCorrect).prop("checked", isCorrect);
								var indexs = $(this).index()
								$("#assetBooking-dataleft tbody").find("tr").eq(indexs).find(".checkboxes").attr("checked", isCorrect).prop("checked", isCorrect);
								if (isCorrect) {
									$(this).addClass("selected");
									$("#assetBooking-dataleft tbody").find("tr").eq(indexs).addClass("selected")
								} else {
									$(this).removeClass("selected");
									$("#assetBooking-dataleft tbody").find("tr").eq(indexs).removeClass("selected")
								}
							})
							page.calculateAmts();
						});
						//checkbox的全选操作: 全选所有页
						$('.datatable-group-checkable-all').on("change", function () {
							var isCorrect = $(this).is(':checked');
							$('#' + id + ' .checkboxes').each(function () {
								isCorrect ? $(this).prop("checked", !0) : $(this).prop("checked", !1);
								isCorrect ? $(this).closest("tr").addClass("selected") : $(this).closest("tr").removeClass("selected");
							});
							$('#assetBooking-dataleft .checkboxes').each(function () {
								isCorrect ? $(this).prop("checked", !0) : $(this).prop("checked", !1);
								isCorrect ? $(this).closest("tr").addClass("selected") : $(this).closest("tr").removeClass("selected");
							})
							$('.datatable-group-checkable').prop("checked", isCorrect);
							if (isCorrect) { // 全选修改mainSelectedRows和inputChecks
								var dataArr = vgDataTable.data();
								for (var i = 0; i < dataArr.length; i++) {
									mainSelectedRows.push(dataArr[i].MAIN_BILL_NO);
									inputChecks.push(true);
								}
								$('.datatable-group-checkable').prop("checked", false); // 勾选全选所有页，取消全选当前页选中效果
								$("span.selRows").hide(); //  隐藏选项金额
							} else {
								mainSelectedRows = [];
								inputChecks = [];
							}
							$("#assetBooking-data_wrapper").find("tbody tr").each(function(){
								$(this).find('input.checkboxes').attr("checked", isCorrect).prop("checked", isCorrect);
								var indexs = $(this).index()
								$("#assetBooking-dataleft tbody").find("tr").eq(indexs).find(".checkboxes").attr("checked", isCorrect).prop("checked", isCorrect);
								if (isCorrect) {
									$(this).addClass("selected");
									$("#assetBooking-dataleft tbody").find("tr").eq(indexs).addClass("selected")
								} else {
									$(this).removeClass("selected");
									$("#assetBooking-dataleft tbody").find("tr").eq(indexs).removeClass("selected")
								}
							})
							page.calculateAmts()
						});
						
						ufma.isShow(page.reslist);
						$('.datatable-toolbar [data-toggle="tooltip"]').tooltip();

						// #4268 修复带有排序功能的列宽太窄 导致排序icon被覆盖的问题
						$("#assetBooking-data").find("th.sorting").css("padding-right", "20px");
						$("#assetBooking-dataleft,#assetBooking-dataright,#assetBooking-datahead").hide()
						if(data.length>0){
							page.leftfixedcolumns()
							page.rightfixedcolumns()	
							page.headfixedcolumns()
							$('#assetBooking-data').tblcolResizable({},function(){
								page.getwidthorleft()
							});
							page.getwidthorleft()
							$('.JCLRgrips').css('width',$('.JCLRgrips').width() - $('#datarigthhead').width() + 'px');
						}
					},
					"drawCallback": function (settings) {
						$("#assetBooking-data").find("td.dataTables_empty").text("").append('<img src="' + bootPath + 'images/noData.png"/><br/><i>目前还没有你要查询的数据</i>');

						//权限控制
						ufma.isShow(page.reslist);
						ufma.setBarPos($(window));

						// 每次更新完列表把全选按钮置为未勾选
						$('.datatable-group-checkable').attr("checked", false);
						$('.datatable-group-checkable-all').attr("checked", false);
						if(data.length>0){
							page.leftfixedcolumns()
							page.rightfixedcolumns()
							page.headfixedcolumns()
							$('#assetBooking-data').tblcolResizable({},function(){
								page.getwidthorleft()
							});
							$('.JCLRgrips').css('width',$('.JCLRgrips').width() - $('#datarigthhead').width() + 'px');
						}
						ufma.hideloading();
					}
				});
			},
			headfixedcolumns:function(){
				$("#assetBooking-datahead").html($("#assetBooking-data thead").prop("outerHTML"))
				.css({"width":$("#assetBooking-data").width(),'min-width':$("#assetBooking-data").css('min-width')}).show()
				for(var i=0;i<$("#assetBooking-datahead thead").find('th').length;i++){
					$("#assetBooking-datahead thead").find('th').eq(i).css('width',$("#assetBooking-data thead").find('th').eq(i).css('width'))
				}
				$("#assetBooking-datahead th").on('click',function(){
					var trsd = $(this).index()
					$("#assetBooking-data thead").find('th').eq(trsd).click()
				})
			},
			leftfixedcolumns:function(){
				var ths = ''
				ths+='<tr role="row">'
				ths+=$("#assetBooking-data").find('thead').find('tr').eq(0).find('th').eq(0).prop('outerHTML')
				ths+='</tr>'
				$("#assetBooking-dataleft").find('thead').html(ths)
				$("#datalefthead").find('thead').html(ths)
				var trs = ''
				var trbody = $("#assetBooking-data").find('tbody').find('tr')
				for(var i=0;i<trbody.length;i++){
					if(i%2!=0){
						trs+='<tr class="even" role="row">'
					}else{
						trs+='<tr class="odd" role="row">'
					}
					trs+=trbody.eq(i).find('td').eq(0).prop('outerHTML')
					trs+='</tr>'
				}
				$("#assetBooking-dataleft").find('tbody').html(trs).show()
				$("#assetBooking-dataleft").show()
				$("#assetBooking-dataright .checkboxes").on('change',function(){
					var isCorrect = $(this).is(':checked');
					var trsd = $(this).parents('tr').index()
					$("#assetBooking-data tbody").find("tr").eq(indexs).find(".checkboxes").attr("checked", isCorrect).prop("checked", isCorrect);
				})
			},
			rightfixedcolumns:function(){
				var lengs = $("#assetBooking-data").find('thead').find('tr').eq(0).find('th').length-1
				var ths = ''
				ths+='<tr role="row">'
				ths+=$("#assetBooking-data").find('thead').find('tr').eq(0).find('th').eq(lengs).prop('outerHTML')
				ths+='</tr>'
				$("#assetBooking-dataright").find('thead').html(ths)
				$("#datarigthhead").find('thead').html(ths)
				var trs = ''
				var trbody = $("#assetBooking-data").find('tbody').find('tr')
				for(var i=0;i<trbody.length;i++){
					if(i%2!=0){
						trs+='<tr class="even" role="row">'
					}else{
						trs+='<tr class="odd" role="row">'
					}
					trs+=trbody.eq(i).find('td').eq(lengs).prop('outerHTML')
					trs+='</tr>'
				}
				$("#assetBooking-dataright").find('tbody').html(trs)
				$("#assetBooking-dataright").show()
				// $("#assetBooking-dataright .btn").off('click').on('click',function(){
				// 	var sd=$(this).index()
				// 	var trsd = $(this).parents('tr').index()
				// 	$("#assetBooking-data tbody").find('tr').eq(trsd).find('.nowrap').find(".btn").eq(sd).click()
				// })
			},
			getwidthorleft:function(){
				$("#assetBooking .table-tab").css("height",page.getScrollY())
				$("#assetBooking-dataleft,#datalefthead").find('thead').find('tr').eq(0).find('th').eq(0).css('width',$("#assetBooking-data").find('thead').find('tr').eq(0).find('th').eq(0).css('width'))
				$("#assetBooking-dataleft,#datalefthead").css('width',$("#assetBooking-data").find('thead').find('tr').eq(0).find('th').eq(0).css('width'))
				var lengs = $("#assetBooking-data").find('thead').find('tr').eq(0).find('th').length-1
				$("#assetBooking-dataright,#datarigthhead").find('thead').find('tr').eq(0).find('th').eq(0).css('width',$("#assetBooking-data").find('thead').find('tr').eq(0).find('th').eq(lengs).css('width'))
				$("#assetBooking-dataright,#datarigthhead").css('width',$("#assetBooking-data").find('thead').find('tr').eq(0).find('th').eq(lengs).css('width'))
				$("#assetBooking-datahead").css({"width":$("#assetBooking-data").width(),'min-width':$("#assetBooking-data").css('min-width')}).show()
				for(var i=0;i<$("#assetBooking-datahead thead").find('th').length;i++){
					$("#assetBooking-datahead thead").find('th').eq(i).css('width',$("#assetBooking-data thead").find('th').eq(i).css('width'))
				}
				var rightwz = $("#assetBooking-data").find('thead').find('tr').eq(0).find('th').eq(lengs).offset().left
				var kuandu = $("#assetBooking-data").find('thead').find('tr').eq(0).find('th').eq(lengs).width()
				var scroll = $(".table-tab").scrollLeft()
				var tabwidth = $(".table-tab").width()
				if(rightwz+kuandu>tabwidth){
					$("#assetBooking-dataright,#datarigthhead").css({'left':tabwidth-20-kuandu+scroll+"px"})
				}else{
					$("#assetBooking-dataright,#datarigthhead").css({'left':rightwz-30+scroll+'px'})
				} 
				$("#assetBooking-dataleft,#datalefthead").css({'left':scroll+"px"})
				$('#assetBooking-datahead,#datarigthhead,#datalefthead').css({'top':$('#assetBooking .table-tab').scrollTop()+'px'})
			},
			// 计算表格的高度
			getScrollY: function() {
				var $bar = $('.ufma-tool-bar');
				var winH = $(window).height();
				var barH = $bar.outerHeight(true);
				return winH - barH - 56 - 78 - 30 - 40 - 30 - 120 + 'px'
			},

			//选择系统级模版，用户自定义凭证类型
			definedVouType: function (tarArgu) {
				tarArgu.target[0].vouBudDate = "";
				tarArgu.target[0].vouBudTypeCode = "";
				tarArgu.target[0].vouDate = "";
				tarArgu.target[0].vouFinTypeCode = "";
				// liuyyn #3956需求
				if (lp.IS_DOUBLE_VOU) {
					if ($("#vouBudDate").find("input").val() !== '【自定义日期】') {
						tarArgu.target[0].vouBudDate = page.CorE($("#vouBudDate").find("input").val() ? $("#vouBudDate").find("input").val() : "");
					} else {
						tarArgu.target[0].vouBudDate = page.CorE($("#vouBudDate").find("input").attr('data-formula'));
					}
					tarArgu.target[0].vouBudTypeCode = $("#vouBudTypeCode").getObj().getValue() ? "'" + $("#vouBudTypeCode").getObj().getValue() + "'" : "";
					if ($("#vouFinDate").find("input").val() !== '【自定义日期】') {
						tarArgu.target[0].vouDate = page.CorE($("#vouFinDate").find("input").val() ? $("#vouFinDate").find("input").val() : "");
					} else {
						tarArgu.target[0].vouDate = page.CorE($("#vouFinDate").find("input").attr('data-formula'));
					}
					tarArgu.target[0].vouFinTypeCode = $("#vouFinTypeCode").getObj().getValue() ? "'" + $("#vouFinTypeCode").getObj().getValue() + "'" : "";
				} else if (lp.SINGLE) {
					if ($("#VouDate").find("input").val() !== '【自定义日期】') {
						tarArgu.target[0].vouDate = page.CorE($("#VouDate").find("input").val() ? $("#VouDate").find("input").val() : "");
					} else {
						tarArgu.target[0].vouDate = page.CorE($("#VouDate").find("input").attr('data-formula'));
					}
					tarArgu.target[0].vouFinTypeCode = $("#VouType").getObj().getValue() ? "'" + $("#VouType").getObj().getValue() + "'" : "";
				}
			},
			//表操作事件
			tableClick: function () {
				//点击行内生成按钮
				$(document).on('click', 'tbody tr .vg-vougen', function (e) {
					stopPropagation(e);
					var oneData = {
						BILL_GUID: $(this).attr("data-guid")
					};

					if (!page.checkBills()) {
						return false;
					}
					var ZcDetailBills = [];
					var billGuids = [];
					if (vouGen) {
						var mainBillNo = $(this).attr("main-bill-no");
						var tableRowDatas = vgDataTable.data();
						for (var i = 0; i < tableRowDatas.length; i++) {
							if (tableRowDatas[i].MAIN_BILL_NO == mainBillNo) {
								billGuids.push(tableRowDatas[i].BILL_GUID);
								if (!$.isNull(rowTableData[tableRowDatas[i].BILL_NO])) {
									ZcDetailBills = rowTableData[tableRowDatas[i].BILL_NO];
								} else {
									ZcDetailBills = [];
								}
							}
						}

					} else {
						billGuids.push(oneData.BILL_GUID);
					}
					var pgArgu = page.combinePGArgu();
					//请求

					function rand(min, max) {
						return Math.floor(Math.random() * (max - min)) + min;
					}
					var isPreviewFlag = false;
					var seed = Date.parse(new Date()) + rand(1000, 9999);

					var tarArgu = {
						target: [{
							tmpGuid: pgArgu.tmpGuid,
							guids: billGuids,
							agencyCode: pgArgu.agencyCode,
							acctCode: pgArgu.currAcctCode,
							mParam: pgArgu.mparam,
							schemeGuid: pgArgu.schemeGuid,
							schemeName: pgArgu.schemeName,
							seed: seed,
							ZcDetailBills : ZcDetailBills
						}],
						rgCode: ptData.svRgCode,
						setYear: ptData.svSetYear
					};
					tarArgu["target"][0].SummaryGenerate = "0";
					if (vouGen) {
						tarArgu["target"][0].SummaryGenerate = "1";
					}
					page.definedVouType(tarArgu);
					if ($("input[name='isPreview']").prop("checked") && vouGen) {
						isPreviewFlag = true;
						//勾选了生成前预览并且是主单据编号
						ufma.showloading('正在加载数据，请耐心等待...');
						tarArgu.target[0].isAllBills = 0; // 单行生成传0 预览接口传isAllBills
						var newUrl = interfaceURL.preview + "?currAgencyCode=" + pgArgu.currAgencyCode + "&currAcctCode=" + pgArgu.currAcctCode + "&agencyTypeCode=" + pgArgu.agencyTypeCode;
						ufma.post(newUrl, tarArgu, function (result) {
							ufma.hideloading();
							//凭证弹窗
							var oneData = undefined;
							page.openPreviewWindow(oneData, tarArgu, result.data, tarArgu["target"][0].SummaryGenerate);
						});
					} else {
						ufma.showloading('正在加载数据，请耐心等待...');
						tarArgu.isAllBills = 0; // 单行生成传0
						var newUrl = interfaceURL.createTargerBill + "?currAgencyCode=" + pgArgu.currAgencyCode + "&currAcctCode=" + pgArgu.currAcctCode + "&agencyTypeCode=" + pgArgu.agencyTypeCode;
						ufma.post(newUrl, tarArgu, function (result) {
							if (result.flag == "success") {
								page.rememberConditions();
								ufma.hideloading();
								if (result.data.generateList[0].state == "成功") {
									ufma.showTip("编号为" + result.data.generateList[0].billNo + "的单据生成凭证成功!", function () {

									}, "success");
									page.searchContent();
									var id = page.cbAgency.getValue();
									page.renderBillSchemes(id); // 获取方案列表					
								} else {
									ufma.showTip(result.data.generateList[0].error, function () {

									}, "error");
								}
							} else {
								ufma.showTip(result.msg, function () { }, "error");
								ufma.hideloading();
							}
						})
					}
				});
				//点击行内预览按钮
				$(document).on('click', 'tbody tr .btn-preview', function (e) {
					stopPropagation(e);
					// var oneData = vgDataTable.row($(this).parents('tr')).data();
					var oneData = {
						BILL_GUID: $(this).attr("data-guid")
					};
					page.billGeneratePreview(oneData, $(this));
				});
				//点击行内删除按钮
				$(document).on('click', 'tbody tr .vg-del', function (e) {
					stopPropagation(e);
					var oneData = {
						BILL_GUID: $(this).attr("data-guid")
					};
					page.deleteBillByGuid(oneData, "0", $(this));
				});
				//点击行内已生成取消生成按钮
				$(document).on('click', 'tbody tr .vg-recover', function (e) {
					stopPropagation(e);
					var oneData = {
						BILL_GUID: $(this).attr("data-guid")
					};
					page.cancelGenerateBill(oneData, "0");
				});
				$(document).on('click', 'tbody tr .vg-check', function (e) {
					stopPropagation(e);
					var oneData = {
						BILL_GUID: $(this).attr("data-guid")
					};
					ufma.showloading('正在加载数据，请耐心等待...');
					var argu = {
						rgCode: ptData.svRgCode,
						setYear: ptData.svSetYear
					};
					ufma.get(interfaceURL.viewVoucher + oneData.BILL_GUID, argu, function (result) {
						//凭证弹窗
						// var urlPath = "http://127.0.0.1:8083";
						var ssdata = result.data[0]
						if (result.data[0] == null) {
							ssdata = result.data[1]
						}
						ufma.hideloading();
						if (ssdata.isBigVou == '1') {
							var vouGuid = ssdata.vouGuid
							var baseUrl = '/pf/gl/voubig/voubig.html?menuid=14a44be5-f2bf-4729-8bc7-702c01e3cfcf&action=query&vouGuid=' + vouGuid;
							uf.openNewPage(page.isCrossDomain, $(this), 'openMenu', baseUrl, false, "凭证查看");
						} else {
							var urlPath = "";
							var turnUrl = urlPath + '/pf/gl/vou/index.html?menuid=f24c3333-9799-439a-94c9-f0cdf120305d&action=preview&preview=0&dataFrom=vouBox'
							turnUrl = page.addRueicode(turnUrl);
							ufma.open({
								url: turnUrl,
								title: '查看凭证',
								width: 1200,
								// height:500,
								data: result.data, // page.deleVouGuidWatch(result.data),--deleVouGuidWatch此方法未对data做处理，故直接用result.data代替
								ondestory: function (data) {
									//重绘表格（因固定列引起的操作按钮点击事件消失）
									$("#assetBooking-data").DataTable().draw(false);
								}
							});
						}
					})
				})
				//点击行内已生成查看凭证按钮
				$(document).on('click', 'tbody tr .billurlvou', function (e) {
					stopPropagation(e);
					var oneData = {
						BILL_GUID: $(this).attr("data-guid")
					};
					ufma.showloading('正在加载数据，请耐心等待...');
					var argu = {
						rgCode: ptData.svRgCode,
						setYear: ptData.svSetYear
					};
					ufma.get(interfaceURL.viewVoucher + oneData.BILL_GUID, argu, function (result) {
						// //凭证弹窗
						ufma.hideloading();
						var ssdata = result.data[0]
						if (result.data[0] == null) {
							ssdata = result.data[1]
						}
						ufma.hideloading();
						if (ssdata.isBigVou == '1') {
							var vouGuid = ssdata.vouGuid
							var baseUrl = '/pf/gl/voubig/voubig.html?menuid=14a44be5-f2bf-4729-8bc7-702c01e3cfcf&action=query&vouGuid=' + vouGuid;
							uf.openNewPage(page.isCrossDomain, $(this), 'openMenu', baseUrl, false, "凭证查看");
						} else {
							var vouguid = result.data[0].vouGuid
							var turnUrl = '/pf/gl/vou/index.html?menuid=f24c3333-9799-439a-94c9-f0cdf120305d&action=query&dataFrom=lp&vouGuid=' + vouguid
							uf.openNewPage(page.isCrossDomain, $(this), 'openMenu', turnUrl, false, "凭证录入");
						}
					})
				})
				//点击行内还原
				$(document).on('click', "tbody tr .vg-un-cancel", function (e) {
					stopPropagation(e);
					var oneData = {
						BILL_GUID: $(this).attr("data-guid")
					};
					var tab = $(".nav-tabs .active").find("a").attr("data-state");
					page.unCancel(oneData, "0", tab);
				})
				//点击不生成行内删除
				$(document).on('click', "tbody tr .vg-delete", function (e) {
					stopPropagation(e);
					var oneData = {
						BILL_GUID: $(this).attr("data-guid")
					};
					var tab = $(".nav-tabs .active").find("a").attr("data-state");
					page.deleteBillByGuid(oneData, "0", $(this), tab);
				})
				//点击行内不生成
				$(document).on('click', "tbody tr .vg-cancel-card", function (e) {
					stopPropagation(e);
					var oneData = {
						BILL_GUID: $(this).attr("data-guid")
					};
					page.cancelGen(oneData, "0");
				})

			},
			//跳转凭证录入界面增加参数rueicode
			addRueicode: function (url) {
				if (typeof hex_md5 === "function" && ufma.getCommonData().svUserCode != null) {
					if (url.indexOf('?') > 0) {
						url = url + "&rueicode=" + hex_md5(ufma.getCommonData().svUserCode)
					} else {
						url = url + "?rueicode=" + hex_md5(ufma.getCommonData().svUserCode)
					}
				}
				return url
			},
			//请求单据方案
			getSchemeTypes: function () {
				$('.lp-setting-box-body').html('');
				page.clearVgMoreQuery();
				page.queryIdx = [];
				$('.lp-query-box-right .tip-more').find('i').text('更多');
				$('.lp-query-box-right .tip-more').find('.glyphicon').addClass('icon-angle-bottom').removeClass('icon-angle-top');
				// $('.lp-query-box-right .tip-more').hide();
				$(".lp-query-box-bottom").hide();
				//切换单位，单据类型改变
				// $('#vgBillType').html('');
				$('.vgTargetBill').html('');
				// var id = page.cbAgency.getValue();
				// lp.renderBillSchemes(id, page.clearVgMoreQuery);
			},
			//初始化单位
			initAgency: function () {
				svData = ufma.getCommonData();

				//单位选择
				page.cbAgency = $("#cbAgency").ufmaTreecombox2({
					valueField: 'id',
					textField: 'codeName',
					readonly: false,
					placeholder: '请选择单位',
					icon: 'icon-unit',
					onchange: function (data) {
						//请求单据方案
						page.getSchemeTypes();
						//请求账套
						page.getAcct();
						page.agencyTypeCode = data.divKind;
						lp.agencyCode = data.id;
						var params = {
							selAgecncyCode: data.id,
							selAgecncyName: data.name,
						}
						ufma.setSelectedVar(params);
						//获取系统选项
						page.getSysRuleSet();
					},
					initComplete: function (sender) { }
				});
			},
			//初始化账套
			initAcct: function () {
				$("#cbAcct").ufCombox({
					idField: 'code',
					textField: 'codeName',
					placeholder: '请选择账套',
					icon: 'icon-book',
					theme: 'label',
					onChange: function (sender, data) {
						$("#navdiv").show(); //解决当初始化单位没有方案会hide 切换后如果有方案要显示 guohx  20200918
						// lp.renderSchemeNames(page.cbAgency.getValue(), $("#vgBillType").getObj().getValue(), $("#cbAcct").getObj().getValue(), page.setRememberData);
						var id = page.cbAgency.getValue();
						lp.renderBillSchemes(id, page.clearVgMoreQuery);
						// 获取方案列表
						nowSchemeGuid = '';
						nowSchemeType = '';
						page.renderBillSchemes(id);
						
						//缓存单位账套
						var params = {
							selAgecncyCode: page.cbAgency.getValue(),
							selAgecncyName: page.cbAgency.getText(),
							selAcctCode: $("#cbAcct").getObj().getValue(),
							selAcctName: $("#cbAcct").getObj().getText()
						}
						ufma.setSelectedVar(params);

						//获取默认的remember数据
						lp.getRememberData(page.setRememberData)
					},
					onComplete: function (sender) {
						$(".uf-combox input").attr("autocomplete", "off");
						if (nowAcctCode) {
							$("#cbAcct").getObj().val(nowAcctCode);
						} else {
							$('#cbAcct').getObj().val('1');
						}
					}
				});
			},
			renderBillSchemes: function (agencyId) {
				var url = interfaceURL.getSchemeTypes;
				var argu = {
					acctCode: $("#cbAcct").getObj().getValue(),
					accsCode: $("#cbAcct").getObj().getItem().accsCode,
					agencyCode: agencyId,
					rgCode: ptData.svRgCode,
					setYear: ptData.svSetYear,
					agencyTypeCode: $("#cbAcct").getObj().getItem().agencyTypeCode,
					isInternalSystem : "1",
					sysId : 'ZC' 
				}
				ufma.get(url, argu, function (result) {
					// 赋到视图显示
					var newData = [];
					for (var i = 0; i < result.data.length; i++) {
							if (result.data[i].dataSrcType != "00") {//00是内部子系统
									newData.push(result.data[i])
							}
					}
					$("#vgBillType_input").attr("autocomplete", "off");
					if(newData.length > 0){
						var ts = '';
						for (var i = 0; i < newData.length; i++) {
							if (newData[i].bizBillCount > 0) {
								ts += '<li><a href="javascript:;" data-type = "' + newData[i].billTypeCode + '" code="' + newData[i].schemeGuid + '">' + newData[i].schemeName + ' <span>(' + newData[i].bizBillCount + ')</span></a></li>'
							} else {
								ts += '<li><a href="javascript:;" data-type = "' + newData[i].billTypeCode + '" code="' + newData[i].schemeGuid + '">' + newData[i].schemeName + '</a></li>'
							}
						}
						$(".vgBillTypeList").html(ts);
						for (var j = 0; j < newData.length; j++) {
							$(".vgBillTypeList li").eq(j).data('data', newData[j]);
						}
						ulL = $(".vgBillTypeList")[0].offsetWidth;
						liL = 0
						for (var i = 0; i < $(".vgBillTypeList li").length; i++) {
							liL += $(".vgBillTypeList li").eq(i)[0].offsetWidth
						}
						if (ulL > liL) {
							$("#btn-left").hide()
							$("#btn-right").hide()
						} else {
							$("#btn-left").show()
							$("#btn-right").show()
						}
						if(lp.getUrlParam('schemeGuid')!=null){
								//如果从“单据查询”页面跳转过来
								//按照类型分别跳转到“未生成”和“已生成”标签页
								var type = lp.getUrlParam('type'),mainid = lp.getUrlParam('mainid');
								if(type ==='2'){
									$(".vgBillTypeList li").eq(1).trigger("click");
								}else{
									$(".vgBillTypeList li").eq(0).trigger("click");
								}
								//将日期从“本期”改成“本年”
								$("#vgTime").find("#vgTimeYear").trigger("click");
								//获取单据编号并赋值
								for (var i = 0; i < result.data.length.length; i++) {
									if($(".vgBillTypeList li").eq(i).data("data").schemeGuid === lp.getUrlParam('schemeGuid')) {
										$(".vgBillTypeList li").eq(i).addClass('active');
									}
								}
								var selfInterval = setInterval(function(){
										//如果表格内有了数据
										if($('#assetBooking-data tbody tr').eq(0).find('td.dataTables_empty').length===0&&$('#assetBooking-data tbody tr').length>0){
												$('.searchHide').val(mainid);
												$('#searchHideBtn').trigger("click");
												clearInterval(selfInterval);
										}
								},300);
						}else if (!$.isNull(lp.rememberData) && !$.isNull(lp.rememberData.vgBillType)){
								//有存储的值就用存储的
								for (var i = 0; i < result.data.length.length; i++) {
									if($(".vgBillTypeList li").eq(i).data("data").schemeGuid === lp.rememberData.vgBillType) {
										$(".vgBillTypeList li").eq(i).addClass('active');
									}
								}
						}else{
							var schemeGuid = newData[0].schemeGuid;
							for (var i = 0; i < result.data.length.length; i++) {
								if($(".vgBillTypeList li").eq(i).data("data").schemeGuid === schemeGuid) {
									$(".vgBillTypeList li").eq(i).addClass('active');
								}
							}
						}
						if (nowSchemeGuid) {
							var marginL = 0; // 如果高亮tab不在页面显示，滚动到可显示位置
							for (var k = 0; k < newData.length; k++) {
								$(".vgBillTypeList li").eq(k).removeClass('active');
								if (nowSchemeGuid == newData[k].schemeGuid) {
									$(".vgBillTypeList li").eq(k).addClass('active');
									$(".vgBillTypeList li").eq(k).trigger("click");
									if (marginL > ulL) {
										var rmvL = $('.vgBillTypeList li').eq(k).width() - 128 - 20;
										var s = liL - ulL + rmvL;
										$('.vgBillTypeList li').eq(0).css({"margin-left": '-' + s + 'px'});
									} else {
										$('.vgBillTypeList li').eq(0).css({"margin-left": '-' + marginL + 'px'});
									}
									break;
								} else {
									marginL += $(".vgBillTypeList li").eq(k)[0].offsetWidth;
								}
							}
						} else {
							$(".vgBillTypeList li").eq(0).addClass('active');
							$(".vgBillTypeList li").eq(0).trigger("click");
							nowSchemeGuid = newData[0].schemeGuid;
							nowSchemeType = newData[0].billTypeCode;
						}	
						lp.renderSchemeNames(page.cbAgency.getValue(), nowSchemeGuid, $("#cbAcct").getObj().getValue());
					}else{
						$("#navdiv").hide();
						ufma.showTip('查询单据方案结果为空！',function(){
							ufma.hideloading();
						},'warning');
					}
					$(".ufma-table-paginate").html("");
					var timeId = setTimeout(function(){
							clearTimeout(timeId);
							$(".btn-query").trigger("click");
					},500)
				});
			},
			//请求账套
			getAcct: function () {
				//请求账套
				var agencyCode = page.cbAgency.getValue();
				var arg = {
					agencyCode: agencyCode,
					setYear: pfData.svSetYear,
					rgCode: pfData.svRgCode,
					agencyTypeCode: ''
				};
				ufma.get(interfaceURL.getAcct, arg, function (result) {
					ufma.hideloading();
					var data = result.data;
					$("#cbAcct").getObj().load(data);

					if (data.length > 0) {
						var timeId = setTimeout(function () {
							clearTimeout(timeId)
						}, 500)
					}

				});
			},
			getUrlParam: function (name) {
				var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象 
				var r = window.location.search.substr(1).match(reg); //匹配目标参数 
				if (r != null) {
					return unescape(r[2]);
				} else {
					return null; //返回参数值 
				}
			},
			//请求单位树
			getAgencyTree: function () {
				ufma.showloading('正在加载数据，请耐心等待...');
				var argu = {
					setYear: ptData.svSetYear,
					rgCode: ptData.svRgCode
				};
				ufma.get(interfaceURL.getAgencyTree, argu, function (result) {
					var data = result.data;
					page.cbAgency = $("#cbAgency").ufmaTreecombox2({
						data: data,
					});
					//默认选择单位S
					if (data.length != 0) {
						if (nowAgencyCode != "" && nowAgencyName != "") {
							var agency = $.inArrayJson(data, 'id', nowAgencyCode);
							if (agency != undefined) {
								if (page.getUrlParam('agencyCode') != null) {
									page.cbAgency.val(page.getUrlParam('agencyCode'));
								} else {
									page.cbAgency.val(nowAgencyCode);
								}
							} else {
								page.cbAgency.select(1);
							}
						} else {
							page.cbAgency.select(1);
						}
					} else {
						ufma.hideloading();
					}
					//默认选择单位E

				});
			},
			//判断平行记账及单双凭证
			getIsParallel: function (data) {
				var acctData = $("#cbAcct").getObj().getItem();
				//如果选择的模版是系统级的，显示凭证类型下拉和凭证日期，共用户自己选择
				//data.ISDORS为1是系统级的模版
				$(".lp-vou-li").addClass("hidden");
				$(".lp-double-vou").addClass("hidden");
				$(".lp-single-vou").addClass("hidden");
				if (data.ISDORS == "1") {
					lp.ISDORS = true;
					//如果是平行记账且是双凭证，财务会计和预算会计都显示出来
					if (acctData.isParallel === "1" && acctData.isDoubleVou == 1) {
						$(".lp-vou-li").removeClass("hidden");
						$(".lp-double-vou").removeClass("hidden");
						//请求凭证类型
						page.getVouType(acctData.code, true);
						lp.IS_DOUBLE_VOU = true;
						lp.SINGLE = false;
					} else {
						//非平行记账或平行记账单凭正，只显示一个
						$(".lp-vou-li").removeClass("hidden");
						$(".lp-single-vou").removeClass("hidden");

						//请求凭证类型
						page.getVouType(acctData.code, false);
						lp.IS_DOUBLE_VOU = false;
						lp.SINGLE = true;
					}
				}

			},
			//请求凭证类型
			getVouType: function (acctCode, isParallel) {
				var year = ufma.getCommonData().svSetYear;
				var agencyCode = page.cbAgency.getValue();

				if (isParallel) { //平行记账且是双凭证

					var url = interfaceURL.getVouType + agencyCode + "/" + year + "/1" + "/" + acctCode;
					var argu = {
						rgCode: pfData.svRgCode,
						setYear: ptData.svSetYear
					};
					ufma.get(url, argu, function (result) {
						var data = result.data;
						if (data && data.length > 0) {
							vouTypeData = data;
						}
						//财务会计类凭证
						$("#vouFinTypeCode").ufCombox({
							idField: "chrCode",
							textField: "chrName",
							data: data, //json 数据
							placeholder: "请选凭证类型",
							onChange: function (sender, data) {
								page.vouFinTypeCode = data.chrCode;
							},
							onComplete: function (sender) {
								$("#vouFinTypeCode_input").attr("autocomplete", "off");
								$("#vouFinTypeCode").getObj().val(data[0].chrCode);
								page.setSencondRemberData();
							}
						});
					});

					//预算会计类凭证
					var url = interfaceURL.getVouType + agencyCode + "/" + year + "/2" + "/" + acctCode;
					ufma.get(url, argu, function (result) {
						var data = result.data;
						$("#vouBudTypeCode").ufCombox({
							idField: "chrCode",
							textField: "chrName",
							data: data, //json 数据
							placeholder: "请选凭证类型",
							onChange: function (sender, data) {
								page.vouBudTypeCode = data.chrCode
							},
							onComplete: function (sender) {
								$("#vouBudTypeCode_input").attr("autocomplete", "off");
								$("#vouBudTypeCode").getObj().val(data[0].chrCode);
								page.setSencondRemberData();
							}
						});
					});
				} else { //非平行记账或平行记账单凭证
					var argu = {
						rgCode: pfData.svRgCode,
						setYear: ptData.svSetYear
					};
					var url = interfaceURL.getVouType + agencyCode + "/" + year + "/*" + "/" + acctCode;
					ufma.get(url, argu, function (result) {
						var data = result.data;
						if (data && data.length > 0) {
							vouTypeData = data;
						}
						$("#VouType").ufCombox({
							idField: "chrCode",
							textField: "chrName",
							data: data, //json 数据
							placeholder: "请选凭证类型",
							onChange: function (sender, data) {
								page.VouType = data.chrCode
							},
							onComplete: function (sender) {
								$("#VouType_input").attr("autocomplete", "off");
								$("#VouType").getObj().val(data[0].chrCode);
								page.setSencondRemberData();
							}
						});
					});
				}
			},
			//导入数据时请求表头信息
			getTableHeadName: function (schemeGuid, type, aCode, schemeName, item) {
				var tabArgu = {
					schemeGuid: schemeGuid,
					rgCode: ptData.svRgCode,
					setYear: ptData.svSetYear
				};
				//记住导入数据时选择的方案，导入成功后，依然查询此方案的数据列表
				page.schemeGuid = schemeGuid;

				ufma.post(interfaceURL.getTableHeadName, tabArgu, function (result) {
					var tableHeadName = result.data;
					//返回成功后跳转页面
					var tabArgu = {
						"agencyCode": aCode,
						"schemeName": schemeName,
						"dataSourceType": type,
						"schemeGuid": schemeGuid,
						"tableHeadName": tableHeadName,
						"item": item,
						"acctCode": $("#cbAcct").getObj().getValue()
					};
					ufma.setObjectCache("dataSourceModelInfor", tabArgu);
					/* 
					 * CWYXM-8433--资产记账和凭证生成界面，选择使用xml导入的方案点击取数时，弹出xml文件选择框
					 *  1、根据方案的类型动态控制弹窗标题；
					 * 2、根据方案类型控制弹窗界面“工作表”和“数据行”的显示与隐藏
					 * zsj
					 */
					var openTitle = "";
					if (page.openDataSrcType == "01") {
						openTitle = "Excel数据导入";
					} else if (page.openDataSrcType == "06") {
						openTitle = "XML数据导入";
					}
					ufma.open({
						url: '/pf/lp/billScheme/schemeDataImport.html',
						title: openTitle,
						width: 1090,
						data: {
							action: 'defineType',
							openDataSrcType: page.openDataSrcType
							// data: data
						},
						ondestory: function (data) {
							if (data.action == "save") {
								// if (vgDataTable != undefined) {
								//     vgDataTable.clear().destroy();
								// }
								// page.getSchemeTypes();
								// $('.lp-query-box-right .btn-query').trigger("click");
								var id = page.cbAgency.getValue();
								page.renderBillSchemes(id); // 获取方案列表
							}

						}
					});
				});
			},
			//请求科目合并方式
			createTarBillPara: function () {
				var argu = {
					rgCode: ptData.svRgCode,
					setYear: ptData.svSetYear
				};
				ufma.get(interfaceURL.getEnumerate + "LP_TAR_BILL_OPT", argu, page.renderTarBillPara);
			},
			//渲染科目合并方式
			renderTarBillPara: function (res) {
				$("#combine-mode .modeName").html("");
				var hebingfangs = '';
				// liuyyn #3963 默认摘要累加不展示 ==> #6665 修改为摘要累加一直显示 不隐藏
				for (var i in res.data) {
					if (res.data[i] === "摘要累加") {
						hebingfangs += '<label id="DescptAppend" class="mt-checkbox mt-checkbox-outline">'
						hebingfangs += '<input type="checkbox" name="' + i + '" value="" disabled="true"/>'
						hebingfangs += res.data[i]
						hebingfangs += '<span></span>'
						hebingfangs += '</label>'
					} else {
						hebingfangs += '<label class="mt-checkbox mt-checkbox-outline">'
						hebingfangs += '<input type="checkbox" name="' + i + '" value="" />'
						hebingfangs += res.data[i]
						hebingfangs += '<span></span>'
						hebingfangs += '</label>'
					}
				}
				$("#combine-mode .modeName").html(hebingfangs);
			},
			//校验有没有模版
			haveSchemes: function () {
				if (lp.temNum == 0) {
					//没有模版
					ufma.showTip("该单据类型下没有凭证模版", function () { }, "warning");
					return false;
				}
				return true;
			},
			//校验是否选择模版
			haveSelectScheme: function () {
				if ($("#temName").getObj().getValue() == "" || $("#temName").getObj().getValue() == undefined) {
					ufma.showTip("请选择要生成的凭证模版", function () { }, "warning");
					return false;
				}
				return true;
			},
			//点表格行内预览
			billGeneratePreview: function (oneData, t) {
				//判断是否有模版
				if (!page.haveSchemes()) {
					return false;
				}

				//判断是否选择模版
				if (!page.haveSelectScheme()) {
					return false;
				}

				//有勾选模版，组织传递的参数
				var billGuids = [];
				if (vouGen && t) {
					var mainBillNo = t.attr("main-bill-no");
					var tableRowDatas = vgDataTable.data();
					for (var i = 0; i < tableRowDatas.length; i++) {
						if (tableRowDatas[i].MAIN_BILL_NO == mainBillNo) {
							billGuids.push(tableRowDatas[i].BILL_GUID);
						}
					}

				} else {
					billGuids.push(oneData.BILL_GUID);
				}

				var pgArgu = page.combinePGArgu();
				//请求
				var tarArgu = {
					target: [{
						tmpGuid: pgArgu.tmpGuid,
						guids: billGuids,
						agencyCode: pgArgu.agencyCode,
						acctCode: pgArgu.currAcctCode,
						mParam: pgArgu.mparam,
						schemeGuid: pgArgu.schemeGuid,
						schemeName: pgArgu.schemeName,
						SummaryGenerate: "0"
					}],
					rgCode: ptData.svRgCode,
					setYear: ptData.svSetYear
				};
				if (vouGen && t) {
					tarArgu.target[0].SummaryGenerate = "1";
				}
				page.definedVouType(tarArgu);
				ufma.showloading('正在加载数据，请耐心等待...');
				tarArgu.target[0].isAllBills = 0; // 单行生成传0 预览接口传isAllBills
				var newUrl = interfaceURL.preview + "?currAgencyCode=" + pgArgu.currAgencyCode + "&currAcctCode=" + pgArgu.currAcctCode + "&agencyTypeCode=" + pgArgu.agencyTypeCode;
				ufma.post(newUrl, tarArgu, function (result) {
					ufma.hideloading();
					//凭证弹窗
					page.openPreviewWindow(oneData, tarArgu, result.data, tarArgu.target[0].SummaryGenerate);
				});

			},
			//打开凭证弹窗前，预览删除vouGuid
			deleVouGuid: function (data) {
				for (var i = 0; i < data.length; i++) {
					delete data[i].vouGuid;
					if(data[i].vouSource!=undefined &&  data[i].vouSourceName == undefined){
						if(vousourcelist.length == 0){
							var url = "VOU_SOURCE";
							var argu = {
								rgCode:svData.svRgCode,
								setYear:svData.svSetYear
							};
							ufma.ajaxDef(interfaceURL.getVousource, 'get',argu,function(result){
								vousourcelist = result.data
							});
						}
						if(vousourcelist[data[i].vouSource]!=undefined){
							data[i].vouSourceName = vousourcelist[data[i].vouSource]
						}
					}
				}
				return data;
			},
			//预览打开弹窗SummaryGenerate=="1"是汇总生成
			openPreviewWindow: function (oneData, pgArgu, previewData, SummaryGenerate) {
				// var urlPath = "http://127.0.0.1:8083";
				var urlPath = "";
				var turnUrl = urlPath + '/pf/gl/vou/index.html?menuid=6661003001001&action=preview&preview=1&dataFrom=vouBox'
				turnUrl = page.addRueicode(turnUrl);
				ufma.open({
					url: turnUrl,
					title: '凭证生成',
					width: 1250,
					// height:500,
					data: page.deleVouGuid(previewData),
					ondestory: function (data) {
						//窗口关闭时回传的值
						if (data.action && data.action.action == "save") {
							var argu = {};
							argu.vouHeadList = data.action.data;
							argu.schemeGuid = pgArgu.target[0].schemeGuid;
							argu.tmpGuid = pgArgu.target[0].tmpGuid;
							if (SummaryGenerate == "1") {
								//汇总生成
								argu.billGuid = pgArgu.target[0].guids;
							} else {
								//单条生成
								argu.billGuid = oneData.BILL_GUID;
							}
							argu.SummaryGenerate = SummaryGenerate;
							argu.rgCode = ptData.svRgCode;
							argu.setYear = ptData.svSetYear;
							if (!$.isNull(rowTableData[data.action.data[0].srcBillNo])) {
								argu.ZcDetailBills = rowTableData[data.action.data[0].srcBillNo];
							} else {
								argu.ZcDetailBills = [];
							}
							ufma.showloading("正在加载数据，请耐心等待...");
							page.ajax(interfaceURL.savePreviewTargetBill, "post", argu, page.ajaxResult, oneData, pgArgu, previewData, SummaryGenerate);
							// ufma.post(interfaceURL.savePreviewTargetBill, argu, function (result) {
							//     if(result.flag == "success"){
							//         ufma.showTip(result.msg,function () {
							//             page.searchContent();
							//         },result.flag);
							//     }else{
							//         ufma.showTip(result.msg,function () {
							//             page.openPreviewWindow(oneData,pgArgu);
							//         },result.flag);
							//     }
							//
							//
							// });

						} else {
							//重绘表格（因固定列引起的操作按钮点击事件消失）
							$("#assetBooking-data").DataTable().draw(false);
						}
					}
				});
			},
			ajaxResult: function () {
				page.searchContent();
				var id = page.cbAgency.getValue();
				page.renderBillSchemes(id); // 获取方案列表
			},
			ajax: function (url, type, argu, callback, oneData, pgArgu, previewData, SummaryGenerate) {
				if ($.isNull(url)) return false;
				//防止连续点击，如果同时多个时可能会有一次失败，禁止这们使用
				if ($('.btn-ajax').attr('disabled') == 'true') {
					return false;
				};
				var argusb = argu
				if (type != 'get') {
					argu = JSON.stringify(argu);
				}

				if (url.indexOf("?") != -1) {
					url = url + "&ajax=1";
				} else {
					url = url + "?ajax=1";
				}

				$.ajax({
					url: url,
					type: type, //GET
					async: true, //或false,是否异步
					data: argu,
					timeout: 60000, //超时时间
					dataType: 'json', //返回的数据格式：json/xml/html/script/jsonp/text
					contentType: 'application/json; charset=utf-8',
					beforeSend: function (xhr) {
						//console.log(xhr)
						//console.log('发送前')
						//ufma.showloading('正在请求数据，请耐心等待...');
						$('.btn-ajax').attr('disabled', 'true');
					},
					success: function (result) {
						ufma.hideloading();
						if (result.flag != 'fail') {
							if (result.data.state == "成功") {
								ufma.showTip("生成凭证成功", function () { }, "success");
								callback();
							} else {
								page.openPreviewWindow(oneData, pgArgu, argusb.vouHeadList, SummaryGenerate);
								ufma.showTip("生成凭证失败," + result.data.error, function () { }, "error");
							}

						} else {
							page.openPreviewWindow(oneData, pgArgu, argusb.vouHeadList, SummaryGenerate);
							ufma.showTip(result.msg, function () { }, "error");
						}
						$('.btn-ajax').removeAttr('disabled');
						page.rememberConditions();
					},
					error: function (jqXHR, textStatus) {
						page.openPreviewWindow(oneData, pgArgu, previewData, SummaryGenerate);
						$('.btn-ajax').removeAttr('disabled');
						ufma.hideloading();
						var error = "";
						switch (jqXHR.status) {
							case 408:
								error = "请求超时";
								break;
							case 500:
								error = "服务器错误";
								break;
							default:
								break;
						}
						if (error != "") {
							ufma.showTip(error, function () { }, "error");
							return false;
						}
					},
					complete: function (data) {
						ufma.hideloading();
						$('.btn-ajax').removeAttr('disabled');
					}
				});
			},
			//预览和生成传参整理
			combinePGArgu: function () {
				var pgArgu = {};
				//合并方式
				var inputs = $(".modeName ").find("input");
				var len = inputs.length;
				pgArgu.mparam = {};
				for (var i = 0; i < len; i++) {
					if ($(".modeName ").find("input").eq(i).is(':checked')) {
						pgArgu.mparam[$(".modeName ").find("input").eq(i).attr("name")] = true;
					} else {
						pgArgu.mparam[$(".modeName ").find("input").eq(i).attr("name")] = false;
					}
				}

				//模版
				pgArgu.tmpGuid = $("#temName").getObj().getValue();
				//单据方案
				pgArgu.schemeGuid = $(".vgBillTypeList li.active").data("data").schemeGuid;
				pgArgu.schemeName = lp.schemeData.schemeName;
				//单位
				pgArgu.agencyCode = page.cbAgency.getValue();
				//当前账套
				pgArgu.currAcctCode = "";
				if ($("#cbAcct").length > 0) {
					pgArgu.currAcctCode = $("#cbAcct").getObj().getValue();
				}
				//当前单位
				pgArgu.currAgencyCode = page.cbAgency.getValue();
				//当前单位的单位类型
				pgArgu.agencyTypeCode = page.agencyTypeCode ? page.agencyTypeCode : "";
				return pgArgu;
			},
			//有主单据编号，批量生成
			hasMainGenerate: function () {
				if (!page.checkBills()) {
					return false;
				}
				//有勾选模版，组织传递的参数
				//批量生成
				var tarArgu = [],
					mainBills = [];
				var tableData = vgDataTable.data();
				var pgArgu = page.combinePGArgu();
				// if ($(".datatable-group-checkable").prop("checked") || $('.datatable-group-checkable-all').prop("checked")) {
					mainSelectedRows = [];
					var tableData2 = vgDataTable.rows("tr.selected").data();
					for (var i = 0; i < tableData2.length; i++) {
						if (mainBills.indexOf(tableData2[i].MAIN_BILL_NO) < 0) {
							mainBills.push(tableData2[i].MAIN_BILL_NO);
						}
					}
					mainSelectedRows = mainBills;
				// }

				if(!$('.datatable-group-checkable-all').prop("checked")) {
					if (mainSelectedRows.length == 0) {
						ufma.showTip("请勾选要生成的单据", function () {
	
						}, "warning");
						return false;
					}
				}
				function rand(min, max) {
					return Math.floor(Math.random() * (max - min)) + min;
				}
				var seed = Date.parse(new Date()) + rand(1000, 9999);
				for (var i = 0; i < mainSelectedRows.length; i++) {
					var tarObj = {
						target: [{
							tmpGuid: pgArgu.tmpGuid,
							guids: [],
							agencyCode: pgArgu.agencyCode,
							acctCode: pgArgu.currAcctCode,
							mParam: pgArgu.mparam,
							schemeGuid: pgArgu.schemeGuid,
							schemeName: pgArgu.schemeName,
							SummaryGenerate: "1",
							seed: seed,
							ZcDetailBills : []
						}],
						agencyCode: pgArgu.agencyCode,
						rgCode: ptData.svRgCode,
						setYear: ptData.svSetYear
					}
					for (var y = 0; y < tableData.length; y++) {
						if (tableData[y].MAIN_BILL_NO == mainSelectedRows[i]) {
							tarObj.target[0].guids.push(tableData[y].BILL_GUID);
							if (!$.isNull(rowTableData[tableData[y].BILL_NO])) {
								tarObj.target[0].ZcDetailBills = rowTableData[tableData[y].BILL_NO];
							} else {
								tarObj.target[0].ZcDetailBills = [];
							}
						}
					}
					page.definedVouType(tarObj);
					tarArgu.push(tarObj);
				}

				var isReturnFlag2 = false; // controlBigVou的请求是否返回数据
				var isPreviewFlag = false;
				// 生成前预览 只生成一张凭证时可用：汇总生成一张时，或带主单据编号时选一个主单据编号的批量生成时
				if ($("input[name='isPreview']").prop("checked") && mainSelectedRows.length == 1) {
					isPreviewFlag = true;
					tarArgu = tarArgu[0];
					//勾选了生成前预览
					ufma.showloading('正在加载数据，请耐心等待...');
					// 预览接口传isAllBills
					var isAll = $('.datatable-group-checkable-all').prop("checked");
					if (isAll) { // 勾选了全选所有页 请求查询所有单据接口
						page.getBillGuids(function(result) {
							if (result.flag == 'success') {
								var newTarArgu = JSON.parse(JSON.stringify(tarArgu));
								newTarArgu.target[0].guids = [];
								for (var i = 0; i < result.data.length; i++) {
									for (var j = 0; j < result.data[i].length; j++) {
										newTarArgu.target[0].guids.push(result.data[i][j]);
									}
								}
								newTarArgu.target[0].isAllBills = 1; 
								var newUrl = interfaceURL.preview + "?currAgencyCode=" + pgArgu.currAgencyCode + "&currAcctCode=" + pgArgu.currAcctCode + "&agencyTypeCode=" + pgArgu.agencyTypeCode;
								ufma.post(newUrl, newTarArgu, function (result) {
									ufma.hideloading();
									//凭证弹窗
									var oneData = undefined;
									page.openPreviewWindow(oneData, newTarArgu, result.data, newTarArgu["target"][0].SummaryGenerate);
								});
							} else {
								ufma.showTip(result.msg, function () { }, "error");
								ufma.hideloading();
							}
						});					
					} else {
						tarArgu.target[0].isAllBills = 0;
						var newUrl = interfaceURL.preview + "?currAgencyCode=" + pgArgu.currAgencyCode + "&currAcctCode=" + pgArgu.currAcctCode + "&agencyTypeCode=" + pgArgu.agencyTypeCode;
						ufma.post(newUrl, tarArgu, function (result) {
							ufma.hideloading();
							//凭证弹窗
							var oneData = undefined;
							page.openPreviewWindow(oneData, tarArgu, result.data, tarArgu["target"][0].SummaryGenerate);
						});
					}
				} else {
					ufma.showloading('正在加载数据，请耐心等待...');
					var isAll = $('.datatable-group-checkable-all').prop("checked");
					if (isAll) { // 勾选了全选所有页 请求查询所有单据接口
						page.getBillGuids(function(result) {
							if (result.flag == 'success') {
								var newTarArgu = JSON.parse(JSON.stringify(tarArgu));
								var totalNum = 0;
								for (var i = 0; i < result.data.length; i++) {
									newTarArgu[i] = JSON.parse(JSON.stringify(newTarArgu[0]));
									newTarArgu[i].target[0].guids = result.data[i];
									newTarArgu[i].target[0].isAllBills = isAll ? 1 : 0;
									totalNum += result.data[i].length;
								}
								if (totalNum > 1000) {
									ufma.confirm('当前所选共有' + totalNum +'条明细单据，将批量生成，是否继续', function (action) { // 带主单据编号的批量生成
										if (action) {
											var newUrl = interfaceURL.createHzTargerBill + "?currAgencyCode=" + pgArgu.currAgencyCode + "&currAcctCode=" + pgArgu.currAcctCode + "&agencyTypeCode=" + pgArgu.agencyTypeCode;
											ufma.post(newUrl, newTarArgu, function (result) {
												if (result.flag == "success") {
													mainSelectedRows = [];
													page.plBillGenerateResult(result, "mainBillNo");
													var id = page.cbAgency.getValue();
													page.renderBillSchemes(id); // 获取方案列表
												} else {
													ufma.showTip(result.msg, function () { }, "error");
													ufma.hideloading();
												}
											}, null, function () { // 超时的回调
												var getControlBigVou = function () {
													var tarArgu = {
														target: [{
															agencyCode: pgArgu.agencyCode,
															rgCode: ptData.svRgCode,
															setYear: ptData.svSetYear,
															seed: seed
														}],
													};
													var newUrl = interfaceURL.controlBigVou;
													ufma.showloading('正在加载数据，请耐心等待...');
													ufma.post(newUrl, tarArgu, function (result) {
														if (result.data && result.data != '' && JSON.stringify(result.data) != '{}') {
															isReturnFlag2 = true;
															clearInterval(timeFn);
															mainSelectedRows = [];
															page.plBillGenerateResult(result.data, "mainBillNo");
															var id = page.cbAgency.getValue();
															page.renderBillSchemes(id); // 获取方案列表
														}
													});
												}
												getControlBigVou();
												timeFn = setInterval(function(){
													if(!isReturnFlag2) { // 第二个没返回
														getControlBigVou();
													} else {
														clearInterval(timeFn);
													}
												}, 20 * 1000);
											});
										} else {
											//点击取消的回调函数
											ufma.hideloading();
										}
									}, {
										type: 'warning'
									});
								} else {
									var newUrl = interfaceURL.createHzTargerBill + "?currAgencyCode=" + pgArgu.currAgencyCode + "&currAcctCode=" + pgArgu.currAcctCode + "&agencyTypeCode=" + pgArgu.agencyTypeCode;
									ufma.post(newUrl, newTarArgu, function (result) {
										if (result.flag == "success") {
											mainSelectedRows = [];
											page.plBillGenerateResult(result, "mainBillNo");
											var id = page.cbAgency.getValue();
											page.renderBillSchemes(id); // 获取方案列表
										} else {
											ufma.showTip(result.msg, function () { }, "error");
											ufma.hideloading();
										}
									}, null, function () { // 超时的回调
										var getControlBigVou = function () {
											var tarArgu = {
												target: [{
													agencyCode: pgArgu.agencyCode,
													rgCode: ptData.svRgCode,
													setYear: ptData.svSetYear,
													seed: seed
												}],
											};
											var newUrl = interfaceURL.controlBigVou;
											ufma.showloading('正在加载数据，请耐心等待...');
											ufma.post(newUrl, tarArgu, function (result) {
												if (result.data && result.data != '' && JSON.stringify(result.data) != '{}') {
													isReturnFlag2 = true;
													clearInterval(timeFn);
													mainSelectedRows = [];
													page.plBillGenerateResult(result.data, "mainBillNo");
													var id = page.cbAgency.getValue();
													page.renderBillSchemes(id); // 获取方案列表
												}
											});
										}
										getControlBigVou();
										timeFn = setInterval(function(){
											if(!isReturnFlag2) { // 第二个没返回
												getControlBigVou();
											} else {
												clearInterval(timeFn);
											}
										}, 20 * 1000);
									});
								}
							} else {
								ufma.showTip(result.msg, function () { }, "error");
								ufma.hideloading();
							}
						});
					} else {
						// var totalL = 0;
						// for (var i = 0; i < tarArgu.length; i++) {
						// 	tarArgu[i].target[0].isAllBills = isAll ? 1 : 0;
						// 	totalL += tarArgu[i].target[0].guids.length;
						// }
						
						if (vgDataTable.rows("tr.selected").data().length > 1000) {
							ufma.confirm('当前所选共有' + vgDataTable.rows("tr.selected").data().length +'条明细单据，将批量生成，是否继续', function (action) { // 带主单据编号的批量生成
								if (action) {
									for (var i = 0; i < tarArgu.length; i++) {
										tarArgu[i].target[0].isAllBills = isAll ? 1 : 0;
									}
									var newUrl = interfaceURL.createHzTargerBill + "?currAgencyCode=" + pgArgu.currAgencyCode + "&currAcctCode=" + pgArgu.currAcctCode + "&agencyTypeCode=" + pgArgu.agencyTypeCode;
									ufma.post(newUrl, tarArgu, function (result) {
										if (result.flag == "success") {
											mainSelectedRows = [];
											page.plBillGenerateResult(result, "mainBillNo");
											var id = page.cbAgency.getValue();
											page.renderBillSchemes(id); // 获取方案列表
										} else {
											ufma.showTip(result.msg, function () { }, "error");
											ufma.hideloading();
										}
									}, null, function () { // 超时的回调
										var getControlBigVou = function () {
											var tarArgu = {
												target: [{
													agencyCode: pgArgu.agencyCode,
													rgCode: ptData.svRgCode,
													setYear: ptData.svSetYear,
													seed: seed
												}],
											};
											var newUrl = interfaceURL.controlBigVou;
											ufma.showloading('正在加载数据，请耐心等待...');
											ufma.post(newUrl, tarArgu, function (result) {
												if (result.data && result.data != '' && JSON.stringify(result.data) != '{}') {
													isReturnFlag2 = true;
													clearInterval(timeFn);
													mainSelectedRows = [];
													page.plBillGenerateResult(result.data, "mainBillNo");
													var id = page.cbAgency.getValue();
													page.renderBillSchemes(id); // 获取方案列表
												}
											});
										}
										getControlBigVou();
										timeFn = setInterval(function(){
											if(!isReturnFlag2) { // 第二个没返回
												getControlBigVou();
											} else {
												clearInterval(timeFn);
											}
										}, 20 * 1000);
									});
								} else {
									//点击取消的回调函数
									ufma.hideloading();
								}
							}, {
								type: 'warning'
							});
						} else {
							for (var i = 0; i < tarArgu.length; i++) {
								tarArgu[i].target[0].isAllBills = isAll ? 1 : 0;
							}
							var newUrl = interfaceURL.createHzTargerBill + "?currAgencyCode=" + pgArgu.currAgencyCode + "&currAcctCode=" + pgArgu.currAcctCode + "&agencyTypeCode=" + pgArgu.agencyTypeCode;
							ufma.post(newUrl, tarArgu, function (result) {
								if (result.flag == "success") {
									mainSelectedRows = [];
									page.plBillGenerateResult(result, "mainBillNo");
									var id = page.cbAgency.getValue();
									page.renderBillSchemes(id); // 获取方案列表
								} else {
									ufma.showTip(result.msg, function () { }, "error");
									ufma.hideloading();
								}
							}, null, function () { // 超时的回调
								var getControlBigVou = function () {
									var tarArgu = {
										target: [{
											agencyCode: pgArgu.agencyCode,
											rgCode: ptData.svRgCode,
											setYear: ptData.svSetYear,
											seed: seed
										}],
									};
									var newUrl = interfaceURL.controlBigVou;
									ufma.showloading('正在加载数据，请耐心等待...');
									ufma.post(newUrl, tarArgu, function (result) {
										if (result.data && result.data != '' && JSON.stringify(result.data) != '{}') {
											isReturnFlag2 = true;
											clearInterval(timeFn);
											mainSelectedRows = [];
											page.plBillGenerateResult(result.data, "mainBillNo");
											var id = page.cbAgency.getValue();
											page.renderBillSchemes(id); // 获取方案列表
										}
									});
								}
								getControlBigVou();
								timeFn = setInterval(function(){
									if(!isReturnFlag2) { // 第二个没返回
										getControlBigVou();
									} else {
										clearInterval(timeFn);
									}
								}, 20 * 1000);
							});
						}
					}
				}
				// $(".datatable-group-checkable").prop("checked", false);
			},
			//凭证生成或预览前校验
			checkBills: function () {
				//判断是否有模版
				if (!page.haveSchemes()) {
					return false;
				}

				//判断是否选择模版
				if (!page.haveSelectScheme()) {
					return false;
				}
				return true;
			},
			//汇总生成或者批量生成前校验是否勾选单据
			slectedBills: function () {
				if (vgDataTable.rows("tr.selected").data().length == 0) {
					// 未勾选表格单据
					ufma.showTip("请勾选要生成的单据", function () { }, "warning");
					return false;

				}
				return true;
			},
			//汇总生成
			billSummaryGenerate: function (oneData) {
				if (!page.checkBills()) {
					return false;
				}
				//有勾选模版，组织传递的参数
				var billGuids = [];
				if (!page.slectedBills()) {
					return false;
				}
				if (page.hasMainBillNo) {
					//有主单据编号 S
					// var tableData = vgDataTable.data();
					// for (var i = 0; i < mainSelectedRows.length; i++) {
					// 	for (var y = 0; y < tableData.length; y++) {
					// 		if (tableData[y].MAIN_BILL_NO == mainSelectedRows[i]) {
					// 			billGuids.push(tableData[y].BILL_GUID);
					// 		}
					// 	}
					// }
					var tableDataSelected = vgDataTable.rows("tr.selected").data();
					function unique(arr) { // 数组去重
						return arr.filter(function(item, index, arr) {
							return arr.indexOf(item, 0) === index;
						});
					}
					var newmainSelectedRows = unique(mainSelectedRows);
					for (var y = 0; y < tableDataSelected.length; y++) {
						if (newmainSelectedRows.indexOf(tableDataSelected[y].MAIN_BILL_NO) > -1) {
							billGuids.push(tableDataSelected[y].BILL_GUID);
						}
					}
				} else {
					var tableData = vgDataTable.rows("tr.selected").data();
					for (var i = 0; i < tableData.length; i++) {
						billGuids.push(tableData[i].BILL_GUID);
					}
				}
				var pgArgu = page.combinePGArgu();
									
				function rand(min, max) {
					return Math.floor(Math.random() * (max - min)) + min;
				}
				var isReturnFlag2 = false;
				var isPreviewFlag = false;
				var seed = Date.parse(new Date()) + rand(1000, 9999);

				var tarArgu = {
					target: [{
						tmpGuid: pgArgu.tmpGuid,
						guids: billGuids,
						agencyCode: pgArgu.agencyCode,
						acctCode: pgArgu.currAcctCode,
						mParam: pgArgu.mparam,
						schemeGuid: pgArgu.schemeGuid,
						schemeName: pgArgu.schemeName,
						seed: seed
					}],
					rgCode: ptData.svRgCode,
					setYear: ptData.svSetYear
				};
				page.definedVouType(tarArgu);
				tarArgu["target"][0].SummaryGenerate = "1";
				if ($("input[name='isPreview']").prop("checked")) {
					isPreviewFlag = true;
					//勾选了生成前预览
					ufma.showloading('正在加载数据，请耐心等待...');
					// 预览接口传isAllBills
					var isAll = $('.datatable-group-checkable-all').prop("checked");
					if (isAll) { // 勾选了全选所有页 请求查询所有单据接口
						page.getBillGuids(function(result) {
							if (result.flag == 'success') {
								var newTarArgu = JSON.parse(JSON.stringify(tarArgu));
								newTarArgu.target[0].guids = [];
								for (var i = 0; i < result.data.length; i++) {
									for (var j = 0; j < result.data[i].length; j++) {
										newTarArgu.target[0].guids.push(result.data[i][j]);
									}
								}
								newTarArgu.target[0].isAllBills = 1; 
								var newUrl = interfaceURL.preview + "?currAgencyCode=" + pgArgu.currAgencyCode + "&currAcctCode=" + pgArgu.currAcctCode + "&agencyTypeCode=" + pgArgu.agencyTypeCode;
								ufma.post(newUrl, newTarArgu, function (result) {
									ufma.hideloading();
									//凭证弹窗
									page.openPreviewWindow(oneData, newTarArgu, result.data, newTarArgu["target"][0].SummaryGenerate);
								});
							} else {
								ufma.showTip(result.msg, function () { }, "error");
								ufma.hideloading();
							}
						});					
					} else {
						tarArgu.target[0].isAllBills = 0;
						var newUrl = interfaceURL.preview + "?currAgencyCode=" + pgArgu.currAgencyCode + "&currAcctCode=" + pgArgu.currAcctCode + "&agencyTypeCode=" + pgArgu.agencyTypeCode;
						ufma.post(newUrl, tarArgu, function (result) {
							ufma.hideloading();
							//凭证弹窗
							page.openPreviewWindow(oneData, tarArgu, result.data, tarArgu["target"][0].SummaryGenerate);
						});
					}
				} else {
					ufma.showloading('正在加载数据，请耐心等待...');
					var isAll = $('.datatable-group-checkable-all').prop("checked");
					tarArgu.isAllBills = isAll ? 1 : 0; // 全选所有页
					if (isAll) { // 勾选了全选所有页 请求查询所有单据接口
						page.getBillGuids(function(result) {
							if (result.flag == 'success') {
								var newTarArgu = JSON.parse(JSON.stringify(tarArgu));
								newTarArgu.target[0].guids = [];
								var totalNum = 0;
								for (var i = 0; i < result.data.length; i++) {
									for (var j = 0; j < result.data[i].length; j++) {
										newTarArgu.target[0].guids.push(result.data[i][j]);
									}
									totalNum += result.data[i].length;
								}
								if (totalNum > 1000) {
									ufma.confirm('当前所选单据共' + totalNum +'条，将汇总生成1张凭证，是否继续', function (action) { // 汇总生成
										if (action) {
											//点击确定的回调函
											var newUrl = interfaceURL.createTargerBill + "?currAgencyCode=" + pgArgu.currAgencyCode + "&currAcctCode=" + pgArgu.currAcctCode + "&agencyTypeCode=" + pgArgu.agencyTypeCode;
											ufma.post(newUrl, newTarArgu, function (result) {
												//汇总生成,生成成功后，弹出凭证录入弹窗；生成失败，提示失败，不弹窗
												if (result.flag == "success") {
													page.plBillGenerateResult(result);
													var id = page.cbAgency.getValue();
													page.renderBillSchemes(id); // 获取方案列表
												} else {
													ufma.showTip(result.msg, function () { }, "error");
													ufma.hideloading();
												}
											}, null, function () { // 超时的回调
												var getControlBigVou = function () {
													var tarArgu = {
														target: [{
															agencyCode: pgArgu.agencyCode,
															rgCode: ptData.svRgCode,
															setYear: ptData.svSetYear,
															seed: seed
														}],
													};
													var newUrl = interfaceURL.controlBigVou;
													ufma.showloading('正在加载数据，请耐心等待...');
													ufma.post(newUrl, tarArgu, function (result) {
														if (result.data && result.data != '' && JSON.stringify(result.data) != '{}') {
															isReturnFlag2 = true;
															clearInterval(timeFn);
															page.plBillGenerateResult(result.data);
															var id = page.cbAgency.getValue();
															page.renderBillSchemes(id); // 获取方案列表
														}
													});
												}
												getControlBigVou();
												timeFn = setInterval(function(){
													if(!isReturnFlag2) { // 第二个没返回
														getControlBigVou();
													} else {
														clearInterval(timeFn);
													}
												}, 20 * 1000);
											});
										} else {
											//点击取消的回调函数
											ufma.hideloading();
										}
									}, {
										type: 'warning'
									});
								} else {
									var newUrl = interfaceURL.createTargerBill + "?currAgencyCode=" + pgArgu.currAgencyCode + "&currAcctCode=" + pgArgu.currAcctCode + "&agencyTypeCode=" + pgArgu.agencyTypeCode;
									ufma.post(newUrl, newTarArgu, function (result) {
										//汇总生成,生成成功后，弹出凭证录入弹窗；生成失败，提示失败，不弹窗
										if (result.flag == "success") {
											page.plBillGenerateResult(result);
											var id = page.cbAgency.getValue();
											page.renderBillSchemes(id); // 获取方案列表
										} else {
											ufma.showTip(result.msg, function () { }, "error");
											ufma.hideloading();
										}
									}, null, function () { // 超时的回调
										var getControlBigVou = function () {
											var tarArgu = {
												target: [{
													agencyCode: pgArgu.agencyCode,
													rgCode: ptData.svRgCode,
													setYear: ptData.svSetYear,
													seed: seed
												}],
											};
											var newUrl = interfaceURL.controlBigVou;
											ufma.showloading('正在加载数据，请耐心等待...');
											ufma.post(newUrl, tarArgu, function (result) {
												if (result.data && result.data != '' && JSON.stringify(result.data) != '{}') {
													isReturnFlag2 = true;
													clearInterval(timeFn);
													page.plBillGenerateResult(result.data);
													var id = page.cbAgency.getValue();
													page.renderBillSchemes(id); // 获取方案列表		
												}
											});
										}
										getControlBigVou();
										timeFn = setInterval(function(){
											if(!isReturnFlag2) { // 第二个没返回
												getControlBigVou();
											} else {
												clearInterval(timeFn);
											}
										}, 20 * 1000);
									});
								}
							} else {
								ufma.showTip(result.msg, function () { }, "error");
								ufma.hideloading();
							}
						});
					} else {
						if (tarArgu.target[0].guids.length > 1000) {
							ufma.confirm('当前所选单据共' + tarArgu.target[0].guids.length +'条，将汇总生成1张凭证，是否继续', function (action) { // 汇总生成
								if (action) {
									var newUrl = interfaceURL.createTargerBill + "?currAgencyCode=" + pgArgu.currAgencyCode + "&currAcctCode=" + pgArgu.currAcctCode + "&agencyTypeCode=" + pgArgu.agencyTypeCode;
									ufma.post(newUrl, tarArgu, function (result) {
										//汇总生成,生成成功后，弹出凭证录入弹窗；生成失败，提示失败，不弹窗
										if (result.flag == "success") {
											page.plBillGenerateResult(result);
											var id = page.cbAgency.getValue();
											page.renderBillSchemes(id); // 获取方案列表
										} else {
											ufma.showTip(result.msg, function () { }, "error");
											ufma.hideloading();
										}
									}, null, function () { // 超时的回调
										var getControlBigVou = function () {
											var tarArgu = {
												target: [{
													agencyCode: pgArgu.agencyCode,
													rgCode: ptData.svRgCode,
													setYear: ptData.svSetYear,
													seed: seed
												}],
											};
											var newUrl = interfaceURL.controlBigVou;
											ufma.showloading('正在加载数据，请耐心等待...');
											ufma.post(newUrl, tarArgu, function (result) {
												if (result.data && result.data != '' && JSON.stringify(result.data) != '{}') {
													isReturnFlag2 = true;
													clearInterval(timeFn);
													page.plBillGenerateResult(result.data);
													var id = page.cbAgency.getValue();
													page.renderBillSchemes(id); // 获取方案列表		
												}
											});
										}
										getControlBigVou();
										timeFn = setInterval(function(){
											if(!isReturnFlag2) { // 第二个没返回
												getControlBigVou();
											} else {
												clearInterval(timeFn);
											}
										}, 20 * 1000);
									});
								} else {
									//点击取消的回调函数
									ufma.hideloading();
								}
							}, {
								type: 'warning'
							});
						} else {
							var newUrl = interfaceURL.createTargerBill + "?currAgencyCode=" + pgArgu.currAgencyCode + "&currAcctCode=" + pgArgu.currAcctCode + "&agencyTypeCode=" + pgArgu.agencyTypeCode;
							ufma.post(newUrl, tarArgu, function (result) {
								//汇总生成,生成成功后，弹出凭证录入弹窗；生成失败，提示失败，不弹窗
								if (result.flag == "success") {
									page.plBillGenerateResult(result);
									var id = page.cbAgency.getValue();
									page.renderBillSchemes(id); // 获取方案列表
								} else {
									ufma.showTip(result.msg, function () { }, "error");
									ufma.hideloading();
								}
							}, null, function () { // 超时的回调
								var getControlBigVou = function () {
									var tarArgu = {
										target: [{
											agencyCode: pgArgu.agencyCode,
											rgCode: ptData.svRgCode,
											setYear: ptData.svSetYear,
											seed: seed
										}],
									};
									var newUrl = interfaceURL.controlBigVou;
									ufma.showloading('正在加载数据，请耐心等待...');
									ufma.post(newUrl, tarArgu, function (result) {
										if (result.data && result.data != '' && JSON.stringify(result.data) != '{}') {
											isReturnFlag2 = true;
											clearInterval(timeFn);
											page.plBillGenerateResult(result.data);
											var id = page.cbAgency.getValue();
											page.renderBillSchemes(id); // 获取方案列表
										}
									});
								}
								getControlBigVou();
								timeFn = setInterval(function(){
									if(!isReturnFlag2) { // 第二个没返回
										getControlBigVou();
									} else {
										clearInterval(timeFn);
									}
								}, 20 * 1000);
							});
						}
					}
				}
			},
			//批量生成
			billGenerate: function () {
				if (!page.checkBills()) {
					return false;
				}
				//有勾选模版，组织传递的参数
				var billGuids = [];
				if (!page.slectedBills()) {
					return false;
				}
				var pgArgu = page.combinePGArgu();
				var tableData = vgDataTable.rows("tr.selected").data();
				for (var i = 0; i < tableData.length; i++) {
					billGuids.push(tableData[i].BILL_GUID);
				}
													
				function rand(min, max) {
					return Math.floor(Math.random() * (max - min)) + min;
				}
				var isReturnFlag2 = false;
				var isPreviewFlag = false;
				var seed = Date.parse(new Date()) + rand(1000, 9999);

				var tarArgu = {
					target: [{
						tmpGuid: pgArgu.tmpGuid,
						guids: billGuids,
						agencyCode: pgArgu.agencyCode,
						acctCode: pgArgu.currAcctCode,
						mParam: pgArgu.mparam,
						schemeGuid: pgArgu.schemeGuid,
						schemeName: pgArgu.schemeName,
						seed: seed
					}],
					rgCode: ptData.svRgCode,
					setYear: ptData.svSetYear
				};
				page.definedVouType(tarArgu);
				tarArgu["target"][0].SummaryGenerate = "0";
				if ($("input[name='isPreview']").prop("checked") && tarArgu.target[0].guids.length == 1) {
					isPreviewFlag = true;
					//如果只勾选了一条单据并且勾选了生成前预览 不带主单据编号
					ufma.showloading('正在加载数据，请耐心等待...');
					var oneData = {
						BILL_GUID: tarArgu.target[0].guids[0]
					};
					tarArgu.target[0].isAllBills = 0; // 此时只有一条选中的单据，确定没有勾选全选所有页 预览接口传isAllBills
					var newUrl = interfaceURL.preview + "?currAgencyCode=" + pgArgu.currAgencyCode + "&currAcctCode=" + pgArgu.currAcctCode + "&agencyTypeCode=" + pgArgu.agencyTypeCode;
					ufma.post(newUrl, tarArgu, function (result) {
						ufma.hideloading();
						//凭证弹窗
						page.openPreviewWindow(oneData, tarArgu, result.data, tarArgu["target"][0].SummaryGenerate);
					});
				} else {
					ufma.showloading('正在加载数据，请耐心等待...');
					var isAll = $('.datatable-group-checkable-all').prop("checked");
					tarArgu.isAllBills = isAll ? 1 : 0; // 全选所有页
					if (isAll) { // 勾选了全选所有页 请求查询所有单据接口
						page.getBillGuids(function(result) {
							if (result.flag == 'success') {
								var newTarArgu = JSON.parse(JSON.stringify(tarArgu));
								newTarArgu.target[0].guids = [];
								var totalNum = 0;
								for (var i = 0; i < result.data.length; i++) {
									for (var j = 0; j < result.data[i].length; j++) {
										newTarArgu.target[0].guids.push(result.data[i][j]);
									}
									totalNum += result.data[i].length;
								}
								if (totalNum > 1000) {
									ufma.confirm('当前所选单据共' + totalNum +'条将批量生成，是否继续；', function (action) { // 批量生成
										if (action) {
											//点击确定的回调函
											var newUrl = interfaceURL.createTargerBill + "?currAgencyCode=" + pgArgu.currAgencyCode + "&currAcctCode=" + pgArgu.currAcctCode + "&agencyTypeCode=" + pgArgu.agencyTypeCode;
											ufma.ajax(newUrl, "post", newTarArgu, function (result) {
												if (result.flag == "success") {
													page.plBillGenerateResult(result);
													var id = page.cbAgency.getValue();
													page.renderBillSchemes(id); // 获取方案列表		
												} else {
													ufma.showTip(result.msg, function () { }, "error");
													ufma.hideloading();
												}
											}, null, function () { // 超时的回调
												var getControlBigVou = function () {
													var tarArgu = {
														target: [{
															agencyCode: pgArgu.agencyCode,
															rgCode: ptData.svRgCode,
															setYear: ptData.svSetYear,
															seed: seed
														}],
													};
													var newUrl = interfaceURL.controlBigVou;
													ufma.showloading('正在加载数据，请耐心等待...');
													ufma.post(newUrl, tarArgu, function (result) {
														if (result.data && result.data != '' && JSON.stringify(result.data) != '{}') {
															isReturnFlag2 = true;
															clearInterval(timeFn);
															page.plBillGenerateResult(result.data);
															var id = page.cbAgency.getValue();
															page.renderBillSchemes(id); // 获取方案列表				
														}
													});
												}
												getControlBigVou();
												timeFn = setInterval(function(){
													if(!isReturnFlag2) { // 第二个没返回
														getControlBigVou();
													} else {
														clearInterval(timeFn);
													}
												}, 20 * 1000);
											});
										} else {
											//点击取消的回调函数
											ufma.hideloading();
										}
									}, {
										type: 'warning'
									});
								} else {
									var newUrl = interfaceURL.createTargerBill + "?currAgencyCode=" + pgArgu.currAgencyCode + "&currAcctCode=" + pgArgu.currAcctCode + "&agencyTypeCode=" + pgArgu.agencyTypeCode;
									ufma.ajax(newUrl, "post", newTarArgu, function (result) {
										if (result.flag == "success") {
											page.plBillGenerateResult(result);
											var id = page.cbAgency.getValue();
											page.renderBillSchemes(id); // 获取方案列表
										} else {
											ufma.showTip(result.msg, function () { }, "error");
											ufma.hideloading();
										}
									}, null, function () { // 超时的回调
										var getControlBigVou = function () {
											var tarArgu = {
												target: [{
													agencyCode: pgArgu.agencyCode,
													rgCode: ptData.svRgCode,
													setYear: ptData.svSetYear,
													seed: seed
												}],
											};
											var newUrl = interfaceURL.controlBigVou;
											ufma.showloading('正在加载数据，请耐心等待...');
											ufma.post(newUrl, tarArgu, function (result) {
												if (result.data && result.data != '' && JSON.stringify(result.data) != '{}') {
													isReturnFlag2 = true;
													clearInterval(timeFn);
													page.plBillGenerateResult(result.data);
													var id = page.cbAgency.getValue();
													page.renderBillSchemes(id); // 获取方案列表		
												}
											});
										}
										getControlBigVou();
										timeFn = setInterval(function(){
											if(!isReturnFlag2) { // 第二个没返回
												getControlBigVou();
											} else {
												clearInterval(timeFn);
											}
										}, 20 * 1000);
									});
								}
							} else {
								ufma.showTip(result.msg, function () { }, "error");
								ufma.hideloading();
							}
						});
					} else {
						if (tarArgu.target[0].guids.length > 1000) {
							ufma.confirm('当前所选单据共' + tarArgu.target[0].guids.length +'条将批量生成，是否继续；', function (action) { // 批量生成
								if (action) {
									//点击确定的回调函
									var newUrl = interfaceURL.createTargerBill + "?currAgencyCode=" + pgArgu.currAgencyCode + "&currAcctCode=" + pgArgu.currAcctCode + "&agencyTypeCode=" + pgArgu.agencyTypeCode;
									ufma.ajax(newUrl, "post", tarArgu, function (result) {
										if (result.flag == "success") {
											page.plBillGenerateResult(result);
											var id = page.cbAgency.getValue();
											page.renderBillSchemes(id); // 获取方案列表
										} else {
											ufma.showTip(result.msg, function () { }, "error");
											ufma.hideloading();
										}
									}, null, function () { // 超时的回调
										var getControlBigVou = function () {
											var tarArgu = {
												target: [{
													agencyCode: pgArgu.agencyCode,
													rgCode: ptData.svRgCode,
													setYear: ptData.svSetYear,
													seed: seed
												}],
											};
											var newUrl = interfaceURL.controlBigVou;
											ufma.showloading('正在加载数据，请耐心等待...');
											ufma.post(newUrl, tarArgu, function (result) {
												if (result.data && result.data != '' && JSON.stringify(result.data) != '{}') {
													isReturnFlag2 = true;
													clearInterval(timeFn);
													page.plBillGenerateResult(result.data);
													var id = page.cbAgency.getValue();
													page.renderBillSchemes(id); // 获取方案列表		
												}
											});
										}
										getControlBigVou();
										timeFn = setInterval(function(){
											if(!isReturnFlag2) { // 第二个没返回
												getControlBigVou();
											} else {
												clearInterval(timeFn);
											}
										}, 20 * 1000);
									});
								} else {
									//点击取消的回调函数
									ufma.hideloading();
								}
							}, {
								type: 'warning'
							});
						} else {
							var newUrl = interfaceURL.createTargerBill + "?currAgencyCode=" + pgArgu.currAgencyCode + "&currAcctCode=" + pgArgu.currAcctCode + "&agencyTypeCode=" + pgArgu.agencyTypeCode;
							ufma.ajax(newUrl, "post", tarArgu, function (result) {
								if (result.flag == "success") {
									page.plBillGenerateResult(result);
									var id = page.cbAgency.getValue();
									page.renderBillSchemes(id); // 获取方案列表
								} else {
									ufma.showTip(result.msg, function () { }, "error");
									ufma.hideloading();
								}
							}, null, function () { // 超时的回调
								var getControlBigVou = function () {
									var tarArgu = {
										target: [{
											agencyCode: pgArgu.agencyCode,
											rgCode: ptData.svRgCode,
											setYear: ptData.svSetYear,
											seed: seed
										}],
									};
									var newUrl = interfaceURL.controlBigVou;
									ufma.showloading('正在加载数据，请耐心等待...');
									ufma.post(newUrl, tarArgu, function (result) {
										if (result.data && result.data != '' && JSON.stringify(result.data) != '{}') {
											isReturnFlag2 = true;
											clearInterval(timeFn);
											page.plBillGenerateResult(result.data);
											var id = page.cbAgency.getValue();
											page.renderBillSchemes(id); // 获取方案列表
										}
									});
								}
								getControlBigVou();
								timeFn = setInterval(function(){
									if(!isReturnFlag2) { // 第二个没返回
										getControlBigVou();
									} else {
										clearInterval(timeFn);
									}
								}, 20 * 1000);
							});
						}
					}
				}

			},
			//批量生成后结果
			plBillGenerateResult: function (result, type) {
				page.rememberConditions();
				ufma.hideloading();
				//生成多条弹出有表格的弹窗
				var obj = {
					data: result.data,
					type: type
				};
				ufma.setObjectCache("GenerateModal", obj);
				// showModal("/pf/lp/assetBooking/billGenerateModal.html");
				ufma.open({
					url: 'billGenerateModal.html',
					title: '凭证生成结果',
					width: 1090,
					//height:500,
					data: result.data,
					ondestory: function (data) {
						//窗口关闭时回传的值
						if (data) {
							// $("#assetBooking-data_wrapper").ufScrollBar('destroy');
							page.billDataSearch();
						}
					}
				});
			},
			//取消生成
			cancelGenerateBill: function (selectedRows, type) {
				//type为0时单行取消生成，type为1时批量取消生成
				var targu = {
					billGuids: [],
					rgCode: ptData.svRgCode,
					setYear: ptData.svSetYear,
					agencyCode: page.cbAgency.getValue()
				};
				if (type == "0") {
					var billGuid = selectedRows.BILL_GUID;
					targu.billGuids.push(billGuid);
				} else {
					if (selectedRows.length == 0) {
						ufma.showTip("请勾选要取消生成的单据", function () {

						}, "warning");
						return false;
					}
					for (var i = 0; i < selectedRows.length; i++) {
						targu.billGuids.push(selectedRows[i].BILL_GUID);
					}
				}
				ufma.confirm('您确定要取消吗？', function (action) {
					if (action) {
						//点击确定的回调函
						ufma.showloading('正在加载数据，请耐心等待...');
						ufma.post(interfaceURL.cancelGenerateBill, targu, function (result) {
							ufma.hideloading();
							ufma.showTip(result.msg, function () {

							}, result.flag);
							page.searchContent();
							var id = page.cbAgency.getValue();
							page.renderBillSchemes(id); // 获取方案列表
						})
					} else {
						//点击取消的回调函数
					}
				}, {
						type: 'warning'
					});
			},
			//删除单据
			deleteBillByGuid: function (selectedRows, type, t, tab) {
				//type为0时单行删除，type为1时批量取删除
				var targu = {
					billGuids: [],
					rgCode: ptData.svRgCode,
					setYear: ptData.svSetYear,
					tab: "-1"
				};
				if (tab) {
					targu.tab = tab
				}
				if (type == "0") {
					var billGuid = selectedRows.BILL_GUID;
					if (vouGen && t) {
						var mainBillNo = t.attr("main-bill-no");
						var tableRowDatas = vgDataTable.data();
						for (var i = 0; i < tableRowDatas.length; i++) {
							if (tableRowDatas[i].MAIN_BILL_NO == mainBillNo) {
								targu.billGuids.push(tableRowDatas[i].BILL_GUID);
							}
						}

					} else {
						targu.billGuids.push(billGuid);
					}
				} else {
					if (selectedRows.length == 0) {
						ufma.showTip("请勾选要删除的单据", function () {

						}, "warning");
						return false;
					}
					for (var i = 0; i < selectedRows.length; i++) {
						targu.billGuids.push(selectedRows[i].BILL_GUID);
					}
				}
				ufma.confirm('您确定要删除单据吗？', function (action) {
					if (action) {
						//点击确定的回调函
						ufma.showloading('正在加载数据，请耐心等待...');
						if (tab == '2') { // 已生成
							var isAll = $('.datatable-group-checkable-all')[1].checked;
						} else {
							var isAll = $('.datatable-group-checkable-all').prop("checked");
						}
						targu.isAllBills = isAll ? 1 : 0; 
						targu.searchBill = page.getBillGuids(null, true);
						ufma.post(interfaceURL.deleteBillByGuid, targu, function (result) {
							ufma.hideloading();
							ufma.showTip(result.msg, function () {

							}, result.flag);
							page.searchContent();
							var id = page.cbAgency.getValue();
							page.renderBillSchemes(id); // 获取方案列表
						})
					} else {
						//点击取消的回调函数
					}
				}, {
						type: 'warning'
					});
			},
			//未生成
			cancelGen: function (selectedRows, type) {
				//type为0时单行不生成，type为1时批量不生成
				var targu = {
					billGuids: [],
					rgCode: ptData.svRgCode,
					setYear: ptData.svSetYear,
				};
				if (type == "0") {
					var billGuid = selectedRows.BILL_GUID;
					if (vouGen && t) {
						var mainBillNo = t.attr("main-bill-no");
						var tableRowDatas = vgDataTable.data();
						for (var i = 0; i < tableRowDatas.length; i++) {
							if (tableRowDatas[i].MAIN_BILL_NO == mainBillNo) {
								targu.billGuids.push(tableRowDatas[i].BILL_GUID);
							}
						}

					} else {
						targu.billGuids.push(billGuid);
					}
				} else {
					if (selectedRows.length == 0) {
						ufma.showTip("请勾选不生成的单据", function () {

						}, "warning");
						return false;
					}
					for (var i = 0; i < selectedRows.length; i++) {
						targu.billGuids.push(selectedRows[i].BILL_GUID);
					}
				}
				ufma.confirm('您确定勾选单据不生成凭证吗？', function (action) {
					if (action) {
						//点击确定的回调函
						ufma.showloading('正在加载数据，请耐心等待...');
						var isAll = $('.datatable-group-checkable-all').prop("checked");
						targu.isAllBills = isAll ? 1 : 0; 
						targu.searchBill = page.getBillGuids(null, true);
						ufma.post(interfaceURL.lpBillNoGenerate, targu, function (result) {
							ufma.hideloading();
							ufma.showTip(result.msg, function () {

							}, result.flag);
							page.searchContent();
							var id = page.cbAgency.getValue();
							page.renderBillSchemes(id); // 获取方案列表
						})
					} else {
						//点击取消的回调函数
					}
				}, {
						type: 'warning'
					});
			},
			//未生成还原
			unCancel: function (selectedRows, type, tab) {
				//type为0时单行还原，type为1时批量还原
				var targu = {
					billGuids: [],
					rgCode: ptData.svRgCode,
					setYear: ptData.svSetYear
				};
				if (type == "0") {
					var billGuid = selectedRows.BILL_GUID;
					if (vouGen && t) {
						var mainBillNo = t.attr("main-bill-no");
						var tableRowDatas = vgDataTable.data();
						for (var i = 0; i < tableRowDatas.length; i++) {
							if (tableRowDatas[i].MAIN_BILL_NO == mainBillNo) {
								targu.billGuids.push(tableRowDatas[i].BILL_GUID);
							}
						}

					} else {
						targu.billGuids.push(billGuid);
					}
				} else {
					if (selectedRows.length == 0) {
						ufma.showTip("请勾选要还原的单据", function () {

						}, "warning");
						return false;
					}
					for (var i = 0; i < selectedRows.length; i++) {
						targu.billGuids.push(selectedRows[i].BILL_GUID);
					}
				}
				ufma.confirm('您确定要还原单据吗？', function (action) {
					if (action) {
						//点击确定的回调函
						ufma.showloading('正在加载数据，请耐心等待...');
						if (tab == '2') { // 已生成
							var isAll = $('.datatable-group-checkable-all')[1].checked;
						} else {
							var isAll = $('.datatable-group-checkable-all').prop("checked");
						}
						targu.isAllBills = isAll ? 1 : 0; 
						targu.searchBill = page.getBillGuids(null, true);
						ufma.post(interfaceURL.lpBillRestore, targu, function (result) {
							ufma.hideloading();
							ufma.showTip(result.msg, function () {

							}, result.flag);
							page.searchContent();
							var id = page.cbAgency.getValue();
							page.renderBillSchemes(id); // 获取方案列表
						})
					} else {
						//点击取消的回调函数
					}
				}, {
						type: 'warning'
					});
			},
			//查询所有单据接口
			getBillGuids: function (callback, searchFlag) {
				var searchBill = {};
				searchBill.agencyCode = page.cbAgency.getValue();
				searchBill.schemeGuid = $(".vgBillTypeList li.active").data("data").schemeGuid;
				searchBill.dateFrom = $("#dateStart").getObj().getValue();
				searchBill.dateTo = $("#dateEnd").getObj().getValue();
				searchBill.billNo = $('#vgBillNo').val();
				searchBill.billState = $('ul.nav-tabs').find('li.active a').attr("data-state");
				var fieldArr = [];
				$("#vgMoreQuery").find('.lp-query-li').each(function (i) {
					if (i != 0) {
						var fieldOne = {};
						if ($(this).find('.uf-combox').get(0)) {
							fieldOne.key = $(this).find('.uf-combox').attr('name');
							fieldOne.value = ($(this).find('.uf-combox').getObj() && $(this).find('.uf-combox').getObj().getItem() && $(this).find('.uf-combox').getObj().getItem().code) ? $(this).find('.uf-combox').getObj().getItem().code : null;
							fieldOne.type = $(this).find('.uf-combox').attr('data-itype');
						} else if ($(this).find('input').get(0)) {
							if ($(this).find('input').length > 1) {
								fieldOne.key = $(this).find('input[data-direction="from"]').attr('name');
								if ($(this).find('input[data-direction="from"]').val()) { }
								fieldOne.value = $(this).find('input[data-direction="from"]').val().replace(/,+/g, "") + "," + $(this).find('input[data-direction="to"]').val().replace(/,+/g, "");
								fieldOne.type = $(this).find('input[data-direction="from"]').attr('data-itype');
							} else {
								fieldOne.key = $(this).find('input').attr('name');
								fieldOne.value = $(this).find('input').val();
								fieldOne.type = $(this).find('input').attr('data-itype');
							}
						} else if ($(this).find('select').get(0)) {
							fieldOne.key = $(this).find('select').attr('name');
							fieldOne.value = $(this).find('select').val();
							fieldOne.type = $(this).find('select').attr('data-itype');
						}
						fieldArr.push(fieldOne);
					}

				});
				searchBill.field = fieldArr;
				searchBill.acctCode = $("#cbAcct").getObj().getValue();
				searchBill.rgCode = ptData.svRgCode;
				searchBill.setYear = ptData.svSetYear;
				searchBill.currentPage = parseInt(serachData.currentPage);
				searchBill.pageSize = parseInt(serachData.pageSize);
				ufma.showloading('正在加载数据，请耐心等待...');
				if (!searchFlag) {
					ufma.ajax(interfaceURL.getBillGuids, "post", searchBill, function(result) {
						callback(result);
					});
				} else {
					return searchBill;
				}
			},
			//查询表格内容
			searchContent: function () {
				mainSelectedRows = [];
				inputChecks = [];
				page.hasMainBillNo = false;
				if ($("#dateStart").getObj().getValue() == '' || $("#dateEnd").getObj().getValue() == '') {
					ufma.showTip('日期不可为空', function () { }, 'warning');
					return false;
				}
				// $("input[name='isPreview']").prop("checked",false);
				$('.vgTargetBill').html('');
				$("#assetBooking-data input.datatable-group-checkable").prop("checked", false);
				$("#tool-bar input.datatable-group-checkable").prop("checked", false);

				if (vgDataTable != undefined && $('#assetBooking-data').html() !== "") {
					// pageLength = ufma.dtPageLength('#assetBooking-data');
					// $("#assetBooking-data_wrapper").ufScrollBar('destroy');
					vgDataTable.destroy();
				}
				$('#assetBooking-data').empty();
				// $('#assetBooking-data').html('');
				$('.lp-setting-box-body').html('');
				page.queryIdx = [];
				page.billDataSearch();
			},
			//组织表格查询数据并查询（基础查询）
			billDataSearch: function () {
				var searchBill = {};
				searchBill.agencyCode = page.cbAgency.getValue();
				searchBill.schemeGuid = nowSchemeGuid;
				searchBill.dateFrom = $("#dateStart").getObj().getValue();
				searchBill.dateTo = $("#dateEnd").getObj().getValue();
				searchBill.billNo = $('#vgBillNo').val();
				searchBill.billState = $('ul.nav-tabs').find('li.active a').attr("data-state");
				// searchBill.pageSize = lp.schemeData.bizBillCount;
				// if (searchBill.pageSize == "0") {
				//     searchBill.pageSize = "100";
				// }
				// searchBill.currentPage = "1";

				var fieldArr = [];
				$("#vgMoreQuery").find('.lp-query-li').each(function (i) {
					if (i != 0) {
						var fieldOne = {};
						if ($(this).find('.uf-combox').get(0)) {
							fieldOne.key = $(this).find('.uf-combox').attr('name');
							fieldOne.value = ($(this).find('.uf-combox').getObj() && $(this).find('.uf-combox').getObj().getItem() && $(this).find('.uf-combox').getObj().getItem().code) ? $(this).find('.uf-combox').getObj().getItem().code : null;
							fieldOne.type = $(this).find('.uf-combox').attr('data-itype');
						} else if ($(this).find('input').get(0)) {
							if ($(this).find('input').length > 1) {
								fieldOne.key = $(this).find('input[data-direction="from"]').attr('name');
								if ($(this).find('input[data-direction="from"]').val()) { }
								fieldOne.value = $(this).find('input[data-direction="from"]').val().replace(/,+/g, "") + "," + $(this).find('input[data-direction="to"]').val().replace(/,+/g, "");
								fieldOne.type = $(this).find('input[data-direction="from"]').attr('data-itype');
							} else {
								fieldOne.key = $(this).find('input').attr('name');
								fieldOne.value = $(this).find('input').val();
								fieldOne.type = $(this).find('input').attr('data-itype');
							}
						} else if ($(this).find('select').get(0)) {
							fieldOne.key = $(this).find('select').attr('name');
							fieldOne.value = $(this).find('select').val();
							fieldOne.type = $(this).find('select').attr('data-itype');
						}
						fieldArr.push(fieldOne);
					}

				});
				searchBill.field = fieldArr;
				searchBill.acctCode = $("#cbAcct").getObj().getValue();
				searchBill.rgCode = ptData.svRgCode;
				searchBill.setYear = ptData.svSetYear;
				// CWYXM-12100：修改为后端分页
				searchBill.currentPage = parseInt(serachData.currentPage);
				searchBill.pageSize = parseInt(serachData.pageSize);
				ufma.showloading('正在加载数据，请耐心等待...');
				ufma.post(interfaceURL.search, searchBill, page.getBillData);
			},
			bottomdata: function () {
				//单据项目
				var argu = {
					rgCode: ptData.svRgCode,
					setYear: ptData.svSetYear
				};
				ufma.get("/lp/formulaEditor/getBillItems?schemeGuid=" + $(".vgBillTypeList li.active").data("data").schemeGuid, argu, function (res) {

					for (var j = 0; j < res.data.length; j++) {
						var djxmchnengdata = {};
						var code = 'Main.' + page.strTransform(res.data[j].lpField);
						djxmchnengdata[code] = '单据项目.' + res.data[j].itemName;
						datachneng.push(djxmchnengdata);

					}
				})
				//环境变量
				ufma.get("/lp/formulaEditor/getEnvVars", argu, function (res) {
					for (var i in res.data) {
						var hjblchnengdata = {};
						var codes = "EnvVar." + i;
						hjblchnengdata[codes] = "环境变量." + res.data[i];
						datachneng.push(hjblchnengdata)
					}
				})
			},
			//字符串下滑线转驼峰
			strTransform: function (str) {
				str = str.toLowerCase();
				var re = /_(\w)/g;
				str = str.replace(re, function ($0, $1) {
					return $1.toUpperCase();
				});
				return str;
			},
			CorE: function (str) {
				str = str.toString();
				if (str.indexOf("【") >= 0 && str.indexOf("】") < 0) {
					return str;
				} else if (str.indexOf("【") < 0 && str.indexOf("】") >= 0) {
					return str;
				} else if (str.indexOf("【") < 0 && str.indexOf("】") < 0) {
					return str;
				} else {
					var chnleft = str.indexOf("【")
					var chnright = str.indexOf("】")
					var sdds = str.substring(chnleft + 1, chnright)
					var streng = ""
					for (var i = 0; i < datachneng.length; i++) {
						for (var k in datachneng[i]) {
							if (datachneng[i][k] == sdds) {
								streng = "{" + k + "}";
							}
						}
					}
					if (streng == "") {
						return str;
					} else {
						var strs = str.replace("【" + sdds + "】", streng);
						return page.CorE(strs);
					}
				}
			},
			clearVgMoreQuery: function () {
				$('#vgMoreQuery').html('');
				$('#vgMoreQuery').append('<input type="text" style="display: none"/>');
				var billNoHtml = '<div class="lp-query-li">' +
					'<label class="lp-query-li-cont-title  lp-query-li-cont-title-more">单据编号</label><span class="colon">：</span>' +
					'<div class="lp-query-li-cont">' +
					'<input type="text" id="vgBillNo" class="bordered-input padding-3 input-control input-height"/>' +
					'</div>' +
					'</div>';
				$('#vgMoreQuery').append(billNoHtml);

				$('.lp-query-box-right .tip-more').find('i').text('更多');
				$('.lp-query-box-right .tip-more').find('.glyphicon').addClass('icon-angle-bottom').removeClass('icon-angle-top');
				$(".lp-query-box-bottom").hide();

				var eleListArr = [];
				if (lp.vgBillTypeChange && lp.configSelect && lp.schemeData && lp.schemeData.schemeGuid && lp.configSelect[lp.schemeData.schemeGuid]) {
					var arr = JSON.parse(lp.configSelect[lp.schemeData.schemeGuid]);
					for (var i = 0; i < arr.length; i++) {
						if (arr[i]["data-itype"] === '05') {
							var $query = $('<div class="lp-query-li" style="width: 616px;">' +
								'<label class="lp-query-li-cont-title lp-query-li-cont-title-more" title="' + arr[i]["title"] + '">' + arr[i]["title"] + '</label><span class="colon">：</span></div>');
						} else {
							var $query = $('<div class="lp-query-li">' +
								'<label class="lp-query-li-cont-title lp-query-li-cont-title-more" title="' + arr[i]["title"] + '">' + arr[i]["title"] + '</label><span class="colon">：</span></div>');
						}
						var $cont;
						switch (arr[i]["data-itype"]) {
							case "08":
								$cont = $('<div class="lp-query-li-cont" eleCode="' + arr[i]["eleCode"] + '">' +
									'<input type="text" name="' + arr[i]["name"] + '" class="more-input bordered-input padding-3 input-control" data-itype="' + arr[i]["data-itype"] + '" /></div>');
								break;
							case "05":
								$cont = $('<div class="lp-query-li-cont" eleCode="' + arr[i]["eleCode"] + '" style="padding-left: 5px">' +
									'<input class="more-input bordered-input padding-3 money" type="text" name="' + arr[i]["name"] + '" data-direction="from" data-itype="' + arr[i]["data-itype"] + '" placeholder="0.00" /> 至 ' +
									'<input class="more-input bordered-input padding-3 money" type="text" name="' + arr[i]["name"] + '" data-direction="to" data-itype="' + arr[i]["data-itype"] + '" placeholder="0.00" /></div>');
								break;
							case "07":
								var id = "eleList" + i.toString();
								$cont = $('<div class="lp-query-li-cont" eleCode="' + arr[i]["eleCode"] + '"><div id="' + id + '" class="uf-treecombox" name="' + arr[i]["name"] + '" data-itype="' + arr[i]["data-itype"] + '" style="width: 180px"></div></div>');
								var obj = {
									no: i,
									eleCode: arr[i]["eleCode"]
								};
								eleListArr.push(obj);
								break;
							case "02":
								$cont = $('<div class="lp-query-li-cont" eleCode="' + arr[i]["eleCode"] + '">' +
									'<input type="text" name="' + $arr[i]["name"] + '" class="more-input bordered-input padding-3" data-itype="' + arr[i]["data-itype"] + '" /></div>');
								break;
							default:
								$cont = $('<div class="lp-query-li-cont" eleCode="' + arr[i]["eleCode"] + '">' +
									'<input type="text" name="' + arr[i]["name"] + '" class="more-input bordered-input padding-3 input-control" data-itype="' + arr[i]["data-itype"] + '" /></div>');
								break;
						}
						$query.append($cont);
						$('#vgMoreQuery').append($query);
					}
					//渲染更多条件要素列表
					for (var i = 0; i < eleListArr.length; i++) {
						var id = "#eleList" + eleListArr[i]["no"].toString();
						var eleCode = eleListArr[i]["eleCode"];
						page.getItemDatas(id, eleCode);
					}
				}

				// #8689 资产记账，设置金额查询条件，选择起始金额不会带出截止金额，需要再次保存查询条件才可以
				// 添加金额类操作逻辑: 右边输入框获取焦点时带入左边值
				$("#vgMoreQuery").find("input[data-direction='to']").focus(function () {
					var fromVal = $(this).parent().find("input[data-direction='from']").val();
					$(this).val(fromVal);
					$(this).addClass("selected");
					$(this).select();
				});
				if ($("#vgMoreQuery").find(".money").length > 0) {
					$(".money").amtInputMinus();
				}
			},
			//初始化取数按钮
			importDatas: function () {
				$('#b-import').ufTooltip({
					trigger: 'click',
					opacity: 1,
					gravity: 'north',
					confirm: false,
					content: "#lp-btns-list"
				});

			},
			//返回本期时间
			dateBenQi: function (startId, endId, sel) {
				var ddYear = bennian;
				var ddMonth = benqi - 1;
				var tdd = new Date(ddYear, ddMonth + 1, 0);
				var ddDay = tdd.getDate();
				$("#" + startId).getObj().setValue(new Date(ddYear, ddMonth, 1));
				$("#" + endId).getObj().setValue(new Date(ddYear, ddMonth, ddDay));

			},
			//返回本年时间
			dateBenNian: function (startId, endId) {
				var ddYear = bennian;
				$("#" + startId).getObj().setValue(new Date(ddYear, 0, 1));
				$("#" + endId).getObj().setValue(new Date(ddYear, 11, 31));

			},
			//返回今日时间
			dateToday: function (startId, endId) {
				//	$(rpt.namespace).find("#"+startId+",#"+endId).datetimepicker('setDate',(new Date()));
				$("#" + startId + ",#" + endId).getObj().setValue(new Date(today));

			},
			getItemDatas: function (id, eleCode) {
				var argu = {
					rgCode: ptData.svRgCode,
					setYear: ptData.svSetYear,
					agencyCode: lp.agencyCode, // liuyyn #4533 传单位编码
					acctCode: $("#cbAcct").getObj().getValue()
				};
				ufma.get(interfaceURL.getEleCommonTree + eleCode, argu, function (result) {
					// $(id).getObj().load(result.data);
					$(id).ufTreecombox({
						idField: 'code',
						textField: 'codeName',
						leafRequire: true,
						data: result.data,
						placeholder: "请选择要素",
						readonly: false,
						onChange: function (sender, data) { },
						onComplete: function (sender) {
							$(".uf-combox-input").attr("autocomplete", "off");
							$(id).getObj().clear();
						}
					});
					$(id).getObj().val("001");
				})
			},
			//关闭公式回调
			setFormulaEditorData: function (data) {
				if (data.action) {
					var id2 = $("#" + data.action.alldata.allid);
					$(id2).find("input").val(data.action.val);
					$(id2).find("input").attr("data-formula", data.action.formula);
					var rememberVal = data.action.val + "&" + data.action.formula;
					if (data.action.alldata.allid == "VouDate") {
						page.VouDate = rememberVal
					}
					if (data.action.alldata.allid == "vouFinDate") {
						page.vouFinDate = rememberVal
					}
					if (data.action.alldata.allid == "vouBudDate") {
						page.vouBudDate = rememberVal
					}
				}
			},
			//给凭证类型、凭证日期set reminber值
			setSencondRemberData: function () {
				if ($("#VouType").getObj() && lp.rememberData.VouType != "") {
					$("#VouType").getObj().val(lp.rememberData.VouType);
					var newVouData = lp.rememberData.VouDate ? lp.rememberData.VouDate.split("&") : [];
					$("#VouDate").find("input").val(newVouData[0]).attr("data-formula", newVouData[1]);
					if (newVouData[0] == "【环境变量.业务日期】" || newVouData[0] == "【单据项目.单据日期】") {
						$('#startVouDate').hide();
					} else {
						$('#startVouDate').show();
					}
				}
				if ($("#vouFinTypeCode").getObj() && lp.rememberData.vouFinTypeCode != "") {
					$("#vouFinTypeCode").getObj().val(lp.rememberData.vouFinTypeCode);
					var newVouData = lp.rememberData.vouFinDate ? lp.rememberData.vouFinDate.split("&") : [];
					$("#vouFinDate").find("input").val(newVouData[0]).attr("data-formula", newVouData[1]);
					if (newVouData[0] == "【环境变量.业务日期】" || newVouData[0] == "【单据项目.单据日期】") {
						$('#startVouFinDate').hide();
					} else {
						$('#startVouFinDate').show();
					}
				}
				if ($("#vouBudTypeCode").getObj() && lp.rememberData.vouBudTypeCode != "") {
					$("#vouBudTypeCode").getObj().val(lp.rememberData.vouBudTypeCode);
					var newVouData = lp.rememberData.vouFinDate ? lp.rememberData.vouFinDate.split("&") : [];
					$("#vouBudDate").find("input").val(newVouData[0]).attr("data-formula", newVouData[1]);
					if (newVouData[0] == "【环境变量.业务日期】" || newVouData[0] == "【单据项目.单据日期】") {
						$('#startVouBudDate').hide();
					} else {
						$('#startVouBudDate').show();
					}
				}

			},
			//set remember的值
			setRememberData: function (data) {

				if (data.isPreview == "true") {
					$("input[name=isPreview]").prop("checked", true);
				}
				if(!$.isNull(data.modeName)){
					var modeNameSplit = data.modeName.split(",");
					if (modeNameSplit[0] == "true") {
						$("input[name='isMergerDr']").prop("checked", true);
					} else {
						$("input[name='isMergerDr']").prop("checked", false);
					}
					if (modeNameSplit[1] == "true") {
						$("input[name='isMergerCr']").prop("checked", true);
					} else {
						$("input[name='isMergerCr']").prop("checked", false);
					}
					if (modeNameSplit[2] == "true") {
						$("input[name='isMergerAcc']").prop("checked", true);
					} else {
						$("input[name='isMergerAcc']").prop("checked", false);
					}
					if (modeNameSplit[3] == "true") {
						$("input[name='onlyDescpt']").prop("checked", true)
					} else {
						$("input[name='onlyDescpt']").prop("checked", false)
					}
				}
			},
			//生成凭证成功后，存储选择的条件
			rememberConditions: function () {
				var argu = [];
				//日期和单据编号
				page.dateStart = $("#dateStart").getObj().getValue();
				page.dateEnd = $("#dateEnd").getObj().getValue();
				var dateType = $("#vgTime").find(".btn-primary").attr("data-type");
				var vgBillNo = $("#vgBillNo").val();
				var date = dateType + "&" + page.dateStart + "&" + page.dateEnd + "&" + vgBillNo;
				var obj1 = {
					"agencyCode": lp.agencyCode,
					"acctCode": $("#cbAcct").getObj().getValue(),
					"menuId": "e9d34f53-00e0-491e-aac5-e481156e91ef",
					"configKey": "date",
					"configValue": date
				}
				argu.push(obj1);

				//合并方式
				var value = $("input[name='isMergerDr']").prop("checked").toString() + "," +
					$("input[name='isMergerCr']").prop("checked") + "," +
					$("input[name='isMergerAcc']").prop("checked") + "," +
					$("input[name='onlyDescpt']").prop("checked")
				var obj2 = {
					"agencyCode": lp.agencyCode,
					"acctCode": $("#cbAcct").getObj().getValue(),
					"menuId": "e9d34f53-00e0-491e-aac5-e481156e91ef",
					"configKey": "modeName",
					"configValue": value
				}
				argu.push(obj2);
				//生成前预览
				var isPreview = $("input[name=isPreview]").prop("checked");
				var obj3 = {
					"agencyCode": lp.agencyCode,
					"acctCode": $("#cbAcct").getObj().getValue(),
					"menuId": "e9d34f53-00e0-491e-aac5-e481156e91ef",
					"configKey": "isPreview",
					"configValue": isPreview.toString()
				}
				argu.push(obj3);
				//凭证类型
				var VouType = {
					vouFinTypeCode: page.vouFinTypeCode,
					vouBudTypeCode: page.vouBudTypeCode,
					VouType: page.VouType
				}
				var obj4 = {
					"agencyCode": lp.agencyCode,
					"acctCode": $("#cbAcct").getObj().getValue(),
					"menuId": "e9d34f53-00e0-491e-aac5-e481156e91ef",
					"configKey": "vouFinTypeCode",
					"configValue": page.vouFinTypeCode ? page.vouFinTypeCode : ""
				}
				argu.push(obj4);
				var obj5 = {
					"agencyCode": lp.agencyCode,
					"acctCode": $("#cbAcct").getObj().getValue(),
					"menuId": "e9d34f53-00e0-491e-aac5-e481156e91ef",
					"configKey": "vouBudTypeCode",
					"configValue": page.vouBudTypeCode ? page.vouBudTypeCode : ""
				}
				argu.push(obj5);
				var obj6 = {
					"agencyCode": lp.agencyCode,
					"acctCode": $("#cbAcct").getObj().getValue(),
					"menuId": "e9d34f53-00e0-491e-aac5-e481156e91ef",
					"configKey": "VouType",
					"configValue": page.VouType ? page.VouType : ""
				}
				argu.push(obj6);
				//凭证日期
				var obj7 = {
					"agencyCode": lp.agencyCode,
					"acctCode": $("#cbAcct").getObj().getValue(),
					"menuId": "e9d34f53-00e0-491e-aac5-e481156e91ef",
					"configKey": "VouDate",
					"configValue": page.VouDate ? page.VouDate : ""
				}
				argu.push(obj7);
				var obj8 = {
					"agencyCode": lp.agencyCode,
					"acctCode": $("#cbAcct").getObj().getValue(),
					"menuId": "e9d34f53-00e0-491e-aac5-e481156e91ef",
					"configKey": "vouFinDate",
					"configValue": page.vouFinDate ? page.vouFinDate : ""
				}
				argu.push(obj8);
				var obj9 = {
					"agencyCode": lp.agencyCode,
					"acctCode": $("#cbAcct").getObj().getValue(),
					"menuId": "e9d34f53-00e0-491e-aac5-e481156e91ef",
					"configKey": "vouBudDate",
					"configValue": page.vouBudDate ? page.vouBudDate : ""
				}
				argu.push(obj9);
				//单据方案
				var obj10 = {
					"agencyCode": lp.agencyCode,
					"acctCode": $("#cbAcct").getObj().getValue(),
					"menuId": "e9d34f53-00e0-491e-aac5-e481156e91ef",
					"configKey": "vgBillType",
					"configValue": $(".vgBillTypeList li.active").data("data").schemeGuid
				}
				argu.push(obj10);
				//模板
				var obj11 = {
					"agencyCode": lp.agencyCode,
					"acctCode": $("#cbAcct").getObj().getValue(),
					"menuId": "e9d34f53-00e0-491e-aac5-e481156e91ef",
					"configKey": "temName",
					"configValue": $("#temName").getObj().getValue()
				}
				argu.push(obj11);
				lp.rememberItem(argu);
				// lp.rememberItem("temName", $("#temName").getObj().getValue());  
			},
			//勾选数据计算金额
			calculateAmts: function () {
				var selectedRows = vgDataTable.rows("tr.selected").data();
				if ($("span.selRows").length == 0) {
					var spanHtml = '<span class="selRows">已选：<span class="spanNum">0</span>条，金额：<span class="spanAmt">0</span></span>';
					$(".tool-show-amt").append(spanHtml);
				}
				var l = selectedRows.length;
				var amts = 0;
				for (var i = 0; i < selectedRows.length; i++) {
					for (var y in selectedRows[i]) {
						if (page.hasStr(y, "AMT")) {
							amts += parseFloat(selectedRows[i][y])
						}

					}
				}
				$("span.selRows .spanNum").html(l);
				$("span.selRows .spanAmt").html($.formatMoney(amts, 2))
			},
			// liuyyn #3956需求
			// 初始化凭证日期选项
			initDateOptions: function () {
				var dateOptionsList = [{
					chrCode: "1",
					chrName: "单据日期"
				},
				{
					chrCode: "2",
					chrName: "业务日期"
				},
				{
					chrCode: "3",
					chrName: "自定义日期"
				}
				];
				$("#VouDate").ufCombox({
					idField: "chrCode",
					textField: "chrName",
					data: dateOptionsList, //json 数据
					placeholder: "请选凭证日期类型",
					onChange: function (sender, data) {
						switch (data.chrCode) {
							case '1':
								$('#startVouDate').hide()
								$("#VouDate").find("input").val('【单据项目.单据日期】');
								$("#VouDate").find("input").attr("data-formula", "{Main.billDate}");
								page.VouDate = "【单据项目.单据日期】&{Main.billDate}";
								break;
							case '2':
								$('#startVouDate').hide()
								$("#VouDate").find("input").val('【环境变量.业务日期】');
								$("#VouDate").find("input").attr("data-formula", "{EnvVar.svTransDate}");
								page.VouDate = "【环境变量.业务日期】&{EnvVar.svTransDate}";
								break;
							case '3':
								$('#startVouDate').show()
								$("#VouDate").find("input").val('【自定义日期】');
								$("#VouDate").find("input").attr("data-formula", $('#startVouDate').find("input[value]").attr("value"));
								page.VouDate = "【自定义日期】&{EnvVar.svTransDate}";
								break;
							default:
								$('#startVouDate').hide()
								$("#VouDate").find("input").val('');
								$("#VouDate").find("input").removeAttr("data-formula");
								page.VouDate = "";
								break;
						}
					}
				});
				$("#VouDate .icon-close").click(function () {
					$('#startVouDate').hide();
					$("#VouDate").find("input").removeAttr("data-formula");
				})
				$("#vouFinDate").ufCombox({
					idField: "chrCode",
					textField: "chrName",
					data: dateOptionsList, //json 数据
					placeholder: "请选凭证日期类型",
					onChange: function (sender, data) {
						switch (data.chrCode) {
							case '1':
								$('#startVouFinDate').hide()
								$("#vouFinDate").find("input").val('【单据项目.单据日期】');
								$("#vouFinDate").find("input").attr("data-formula", "{Main.billDate}");
								page.vouFinDate = "【单据项目.单据日期】&{Main.billDate}";
								break;
							case '2':
								$('#startVouFinDate').hide()
								$("#vouFinDate").find("input").val('【环境变量.业务日期】');
								$("#vouFinDate").find("input").attr("data-formula", "{EnvVar.svTransDate}");
								page.vouFinDate = "【环境变量.业务日期】&{EnvVar.svTransDate}";
								break;
							case '3':
								$('#startVouFinDate').show()
								$("#vouFinDate").find("input").val('【自定义日期】');
								$("#vouFinDate").find("input").attr("data-formula", $('#startVouFinDate').find("input[value]").attr("value"));
								page.vouFinDate = "【自定义日期】&{EnvVar.svTransDate}";
								break;
							default:
								$('#startVouFinDate').hide()
								$("#vouFinDate").find("input").val('');
								$("#vouFinDate").find("input").removeAttr("data-formula");
								page.vouFinDate = "";
								break;
						}
					}
				});
				$("#vouFinDate .icon-close").click(function () {
					$('#startVouFinDate').hide();
					$("#vouFinDate").find("input").removeAttr("data-formula");
				})
				$("#vouBudDate").ufCombox({
					idField: "chrCode",
					textField: "chrName",
					data: dateOptionsList, //json 数据
					placeholder: "请选凭证日期类型",
					onChange: function (sender, data) {
						switch (data.chrCode) {
							case '1':
								$('#startVouBudDate').hide()
								$("#vouBudDate").find("input").val('【单据项目.单据日期】');
								$("#vouBudDate").find("input").attr("data-formula", "{Main.billDate}");
								page.vouBudDate = "【单据项目.单据日期】&{Main.billDate}";
								break;
							case '2':
								$('#startVouBudDate').hide()
								$("#vouBudDate").find("input").val('【环境变量.业务日期】');
								$("#vouBudDate").find("input").attr("data-formula", "{EnvVar.svTransDate}");
								page.vouBudDate = "【环境变量.业务日期】&{EnvVar.svTransDate}";
								break;
							case '3':
								$('#startVouBudDate').show()
								$("#vouBudDate").find("input").val('【自定义日期】');
								$("#vouBudDate").find("input").attr("data-formula", $('#startVouBudDate').find("input[value]").attr("value"));
								page.vouBudDate = "【自定义日期】&{EnvVar.svTransDate}";
								break;
							default:
								$('#startVouBudDate').hide()
								$("#vouBudDate").find("input").val('');
								$("#vouBudDate").find("input").removeAttr("data-formula");
								page.vouBudDate = "";
								break;
						}
					}
				});
				$("#vouBudDate .icon-close").click(function () {
					$('#startVouBudDate').hide();
					$("#vouBudDate").find("input").removeAttr("data-formula");
				})
				//打开查看资产信息界面
				$(document).on('click', '.viewData', function (e) {
					var tempIndex = $(this).attr('data-index');
					var arg = {
						agencyCode: page.cbAgency.getValue(),
						setYear: ptData.svSetYear,
						rgCode: ptData.svRgCode,
						billType : nowSchemeType,
						subCode  : tempIndex
					};
					if(!$.isNull(rowTableData[tempIndex])){
						ufma.open({
							url: 'viewAsset.html',
							title: '查看资产信息',
							width: 1090,
							data: {
								agencyCode : page.cbAgency.getValue(),
								rgCode: ptData.svRgCode,
								setYear: ptData.svSetYear,
								assetData : rowTableData[tempIndex]
							},
							ondestory: function (action) {
								if (action.action == "save") {
									if (!$.isNull(action.assetData)) {
										rowTableData[tempIndex] = action.assetData
									}
								}
							}
						});
					}else{
						ufma.get('/lp/getBillData/getAssetLists', arg, function (result) {
							if(result.flag == "success"){
								var data = result.data;
								ufma.open({
									url: 'viewAsset.html',
									title: '查看资产信息',
									width: 1090,
									data: {
										agencyCode : page.cbAgency.getValue(),
										rgCode: ptData.svRgCode,
										setYear: ptData.svSetYear,
										assetData : data
									},
									ondestory: function (action) {
										if (action.action == "save") {
											if (!$.isNull(action.assetData)) {
												rowTableData[tempIndex] = action.assetData
											}
										}
									}
								});
							}else{
								ufma.showTip("未查询到明细资产数据！", function () {}, "warning");
								return false;
							}
						});
					}
				});
			},

			// 初始化自定义日期按钮
			initVouDate: function () {
				$('#startVouDate').ufDatepicker({
					format: 'yyyy-mm-dd', //yyyy-mm-dd,yyyy-mm
					initialDate: new Date(),
					onChange: function (fmtDate) {
						// 切换日期要执行的操作
						$("#VouDate").find("input").val('【自定义日期】');
						$("#VouDate").find("input").attr("data-formula", fmtDate);
						page.VouDate = "【自定义日期】&" + fmtDate;
					}
				});
				$('#startVouFinDate').ufDatepicker({
					format: 'yyyy-mm-dd', //yyyy-mm-dd,yyyy-mm
					initialDate: new Date(),
					onChange: function (fmtDate) {
						// 切换日期要执行的操作
						$("#vouFinDate").find("input").val('【自定义日期】');
						$("#vouFinDate").find("input").attr("data-formula", fmtDate);
						page.vouFinDate = "【自定义日期】&" + fmtDate;
					}
				});
				$('#startVouBudDate').ufDatepicker({
					format: 'yyyy-mm-dd', //yyyy-mm-dd,yyyy-mm
					initialDate: new Date(),
					onChange: function (fmtDate) {
						// 切换日期要执行的操作
						$("#vouBudDate").find("input").val('【自定义日期】');
						$("#vouBudDate").find("input").attr("data-formula", fmtDate);
						page.vouBudDate = "【自定义日期】&" + fmtDate;
					}
				});
			},
			//获取系统选项- 资产记账是否完善资产卡片的财务信息 判断单链接是否显示
			getSysRuleSet : function () {
				ufma.ajaxDef("/gl/vou/getSysRuleSet/" + lp.agencyCode + "?chrCodes=GL072", 'get', "", function(data) {
					isRememberedGL072 = data.data.GL072;
				});
			},
			//初始化页面
			initPage: function () {
				//默认本期
				var Year, Month, Day;
				// liuyyn #3956需求
				// 初始化凭证日期选项
				page.initDateOptions();
				// 初始化自定义日期按钮
				page.initVouDate();
				$('#startVouDate').hide()
				$('#startVouFinDate').hide()
				$('#startVouBudDate').hide()
				//权限控制
				page.reslist = ufma.getPermission();
				ufma.isShow(page.reslist);
				// this.setDayInMonth();
				var date = new Date(today);
				var year = date.getFullYear();
				//绑定日历控件
				var startInitData = {
					format: 'yyyy-mm-dd',
					initialDate: new Date(today),
					onChange: function (fmtDate) {
						page.dateStart = fmtDate
						if (fmtDate != "") {
							var curDate = new Date(fmtDate)
							var curYear = curDate.getFullYear();
							if (curYear !== "" && curYear !== undefined && year !== curYear) {
								ufma.showTip("只能选择本年日期", function () {
									$("#dateStart").getObj().setValue("")
								}, "warning");

							}
						}
					}
				}
				var endInitData = {
					format: 'yyyy-mm-dd',
					initialDate: new Date(today),
					onChange: function (fmtDate) {
						page.dateEnd = fmtDate
						if (fmtDate != "") {
							var curDate = new Date(fmtDate)
							var curYear = curDate.getFullYear();
							if (year !== curYear) {
								ufma.showTip("只能选择本年日期", function () {
									$("#dateEnd").getObj().setValue("")
								}, "warning");

							}
						}
					}
				}
				$("#dateStart").ufDatepicker(startInitData);
				$("#dateEnd").ufDatepicker(endInitData);
				page.dateBenQi("dateStart", "dateEnd");
				//初始化单位树
				page.initAgency();
				//初始化账套
				page.initAcct();
				//初始化单据方案
				lp.initBillSchemes();
				//初始化模版名称
				lp.initSchemeNames(page.getIsParallel, page.bottomdata);
				//请求单位树
				page.getAgencyTree();
				//请求科目合并方式
				page.createTarBillPara()
				$(".searchHide").css({
					"width": "160px",
					"display": "inline-block"
				});

			},

			//页面元素事件绑定使用jquery 的 on()方法
			onEventListener: function () {
				// 金额-更多
				$(document).on('click', ".show-more-amt-btn", function (e) {
					$('.tool-show-more-amt').addClass('show');
					$(document).one('click',function(){
						$('.tool-show-more-amt').removeClass('show');
					})
					e.stopPropagation();
				});
				$(document).on('click', ".vgBillTypeList li", function () {
					if (changeVgFlag) {
						changeVgFlag = false;
						if ($(this).hasClass('active') != true) {
							$('.vgBillTypeList li').removeClass('active');
							$(this).addClass('active');
							if ($(this).offset().left + $(this).width() > ulL + 40) { // 点击的方案显示不全时，向右滚动
								var str = $('.vgBillTypeList li').eq(0).css('margin-left').toString();
								var strin = str.substring(0, str.length - 2)
								if (parseFloat(strin) != 0) {
									strin = strin.substring(1, strin.length)
								}
								var lis = parseFloat(strin) + $(this).width();
								// $('.vgBillTypeList li').eq(0).css('margin-left', '-' + lis + 'px');
								$('.vgBillTypeList li').eq(0).animate({"margin-left": '-' + lis + 'px'});
							}
							nowSchemeGuid = $(".vgBillTypeList li.active").data("data").schemeGuid;
							nowSchemeType = $(".vgBillTypeList li.active a").attr("data-type");
						}
						// 资产记账页 记录的条件设置
						ufma.ajaxDef('/pub/user/menu/config/select?agencyCode=' + lp.agencyCode + '&acctCode='+ $("#cbAcct").getObj().getValue() +'&menuId=e9d34f53-00e0-491e-aac5-e481156e91ef', "get", '', function(data) {
							lp.configSelect = data.data;
							if (lp.configSelect) {
									lp.vgBillTypeChange = true;
							}
						})
						$(".lp-vou-li").addClass("hidden");
						$(".lp-single-vou").addClass("hidden");
						$(".lp-double-vou").addClass("hidden");
						lp.IS_DOUBLE_VOU = false;
						lp.ISDORS = false;
						lp.SINGLE = false;
						//渲染模版名称
						if($(".billGenetateAccount").length == 0){
								lp.renderSchemeNames(page.cbAgency.getValue(), $(this).data('data').schemeGuid, "");
						}else{
								lp.renderSchemeNames(page.cbAgency.getValue(), $(this).data('data').schemeGuid, $("#cbAcct").getObj().getValue());
						}
						lp.schemeData = $(this).data('data');
						//清除条件设置
						page.clearVgMoreQuery();
						$(".ufma-table-paginate").html("");
						var timeId = setTimeout(function(){
								clearTimeout(timeId);
								$(".btn-query").trigger("click");
								changeVgFlag = true;
						},500)
					}
				});
				$(document).on('click', '#btn-right', function () {
					var str = $('.vgBillTypeList li').eq(0).css('margin-left').toString();
					var strin = str.substring(0, str.length - 2)
					if (parseFloat(strin) != 0) {
						strin = strin.substring(1, strin.length)
					}
					var liLen = $('.vgBillTypeList li').length;
					var rmvL = $('.vgBillTypeList li').eq(liLen - 1).width() - 80;
					var calcL = liL - ulL - parseFloat(strin) + 128;
					if (calcL > ulL) {
						var lis = parseFloat(strin) + ulL - 80;
						$('.vgBillTypeList li').eq(0).css('margin-left', '-' + lis + 'px')
					} else if (ulL > calcL && calcL > 0) {
						var lis = liL - ulL + rmvL;
						$('.vgBillTypeList li').eq(0).css('margin-left', '-' + lis + 'px')
					}
				})
				$(document).on('click', '#btn-left', function () {
					var str = $('.vgBillTypeList li').eq(0).css('margin-left').toString();
					var strin = str.substring(0, str.length - 2)
					if (parseFloat(strin) != 0) {
						strin = strin.substring(1, strin.length)
					}
					if (parseFloat(strin) > ulL + 128) {
						var lis = parseFloat(strin) - ulL + 80;
						$('.vgBillTypeList li').eq(0).css('margin-left', '-' + lis + 'px')
					} else {
						var lis = liL - ulL;
						$('.vgBillTypeList li').eq(0).css('margin-left', '0px')
					}
				})
				// 更多查询条件输入框不可输入%
				$("#vgMoreQuery").on("keyup", function () {
					$(this).find('.lp-query-li').each(function () {
						if ($(this).find("input").hasClass("input-control")) {
							var newStr = $(this).find("input[type='text']").val().replace(/[%]/g, '');
							$(this).find("input[type='text']").val(newStr);
						}
					});
				});

				//表格单行选中
				$(document).on("click", "tbody tr", function (e) {
					$('.datatable-group-checkable-all').prop("checked", false); // 点击行时取消全选所有页
					stopPropagation(e);
					if ($("td.dataTables_empty").length > 0) {
						return false;
					}
					var inputDom = $(this).find('input.checkboxes');
					var inputCheck = $(inputDom).prop("checked");
					$(inputDom).prop("checked", !inputCheck);
					var indexs = $(this).index()
					$("#assetBooking-dataleft tbody").find("tr").eq(indexs).find(".checkboxes").attr("checked", !inputCheck).prop("checked", !inputCheck);
					$(this).toggleClass("selected");
					var $tmp = $(".checkboxes:checkbox");
					$(".datatable-group-checkable").prop("checked", $tmp.length == $tmp.filter(":checked").length);
					var currentBillGuid = vgDataTable.data()[indexs].BILL_GUID
					var currentMainBillNo = vgDataTable.data()[indexs].MAIN_BILL_NO;
					if (currentMainBillNo) { // 有主单据编号的
						$("#assetBooking-data_wrapper").find("tbody tr").each(function(){
							var rowMainBillNo = $(this).find('input.checkboxes').attr("main-bill-no");
							if (currentMainBillNo == rowMainBillNo) {
								$(this).find('input.checkboxes').attr("checked", !inputCheck).prop("checked", !inputCheck);
								var indexs = $(this).index()
								$("#assetBooking-dataleft tbody").find("tr").eq(indexs).find(".checkboxes").attr("checked", !inputCheck).prop("checked", !inputCheck);
								if (!inputCheck) {
									$(this).addClass("selected");
									$("#assetBooking-dataleft tbody").find("tr").eq(indexs).addClass("selected")
								} else {
									$(this).removeClass("selected");
									$("#assetBooking-dataleft tbody").find("tr").eq(indexs).removeClass("selected")
								}
							}
						})
					} else { // 不带主单据编号的
						$("#assetBooking-data_wrapper").find("tbody tr").each(function(){
							var rowBillGuid = $(this).find('input.checkboxes').attr("data-guid");
							if (currentBillGuid == rowBillGuid) {
								$(this).find('input.checkboxes').attr("checked", !inputCheck).prop("checked", !inputCheck);
								var indexs = $(this).index()
								$("#assetBooking-dataleft tbody").find("tr").eq(indexs).find(".checkboxes").attr("checked", !inputCheck).prop("checked", !inputCheck);
								if (!inputCheck) {
									$(this).addClass("selected");
									$("#assetBooking-dataleft tbody").find("tr").eq(indexs).addClass("selected")
								} else {
									$(this).removeClass("selected");
									$("#assetBooking-dataleft tbody").find("tr").eq(indexs).removeClass("selected")
								}
							}
						})
					}
					page.calculateAmts();
					return false;
				});
				page.tableClick();

				//切换业务日期
				$("#vgTime").on("click", "button", function () {
					if (!$(this).hasClass("btn-primary")) {
						//样式改变
						$(this).removeClass("btn-default").addClass("btn-primary").siblings(".btn.btn-primary").removeClass("btn-primary").addClass("btn-default");
					}
				});
				$("#vgTime").find("#vgTimeYear").on("click", function () {
					page.dateBenNian("dateStart", "dateEnd");

				});
				$("#vgTime").find("#vgTimeMonth").on("click", function () {
					page.dateBenQi("dateStart", "dateEnd", true);

				});
				$("#vgTime").find("#vgTimeDay").on("click", function () {
					page.dateToday("dateStart", "dateEnd");
				});

				//点击页签
				$("#assetBooking .nav-tabs").on("click", "li", function () {
					ufma.showloading('正在加载数据，请耐心等待...');
					$("#assetBooking .nav-tabs li").removeClass("active");
					$(this).addClass("active");
					page.searchContent();
				});

				//点击更多条件设置弹框的确定按钮，勾选的条件加载
				$(".lp-setting-box-footer .btn-primary").on("click", function () {
					lp.vgBillTypeChange = false; // 点击条件设置的确认后修改值为false
					page.clearVgMoreQuery();
					page.queryIdx = []; //用于存储更多条件的勾选项的序列号，防止勾选后点取消造成的页面问题
					page.queryTitle = []; //用于存储更多条件的勾选项的title，记录查询条件
					var eleListArr = [];
					//循环遍历勾选的
					$(".lp-setting-box-body label input:checked").each(function (i) {
						if ($(this).attr("data-itype") === '05') {
							var $query = $('<div class="lp-query-li" style="width: 616px;">' +
								'<label class="lp-query-li-cont-title lp-query-li-cont-title-more" title="' + $(this).parents('label').find('i').text() + '">' + $(this).parents('label').find('i').text() + '</label><span class="colon">：</span></div>');
						} else {
							var $query = $('<div class="lp-query-li">' +
								'<label class="lp-query-li-cont-title lp-query-li-cont-title-more" title="' + $(this).parents('label').find('i').text() + '">' + $(this).parents('label').find('i').text() + '</label><span class="colon">：</span></div>');
						}
						var $cont;
						switch ($(this).attr("data-itype")) {
							case "03":
							case "08":
								$cont = $('<div class="lp-query-li-cont" eleCode="' + $(this).attr("eleCode") + '">' +
									'<input type="text" name="' + $(this).attr('name') + '" class="more-input bordered-input padding-3 input-control" data-itype="' + $(this).attr("data-itype") + '" /></div>');
								break;
							case "05":
								$cont = $('<div class="lp-query-li-cont" eleCode="' + $(this).attr("eleCode") + '" style="padding-left: 5px">' +
									'<input class="more-input bordered-input padding-3 money" type="text" name="' + $(this).attr('name') + '" data-direction="from" data-itype="' + $(this).attr("data-itype") + '" placeholder="0.00" /> 至 ' +
									'<input class="more-input bordered-input padding-3 money" type="text" name="' + $(this).attr('name') + '" data-direction="to" data-itype="' + $(this).attr("data-itype") + '" placeholder="0.00" /></div>');
								break;
							case "07":
								var id = "eleList" + i.toString();
								$cont = $('<div class="lp-query-li-cont" eleCode="' + $(this).attr("eleCode") + '"><div id="' + id + '" class="uf-treecombox" name="' + $(this).attr('name') + '" data-itype="' + $(this).attr("data-itype") + '" style="width: 180px"></div></div>');
								var obj = {
									no: i,
									eleCode: $(this).attr("eleCode")
								};
								eleListArr.push(obj);
								break;
							case "02":
								$cont = $('<div class="lp-query-li-cont" eleCode="' + $(this).attr("eleCode") + '">' +
									'<input type="text" name="' + $(this).attr('name') + '" class="more-input bordered-input padding-3" data-itype="' + $(this).attr("data-itype") + '" /></div>');
								break;
							default:
								$cont = $('<div class="lp-query-li-cont" eleCode="' + $(this).attr("eleCode") + '">' +
									'<input type="text" name="' + $(this).attr('name') + '" class="more-input bordered-input padding-3 input-control" data-itype="' + $(this).attr("data-itype") + '" /></div>');
								break;
						}
						$query.append($cont);
						$('#vgMoreQuery').append($query);
						page.queryIdx.push($(this).parents('label').index());
						page.queryTitle.push({
							"eleCode": $(this).attr("eleCode"),
							"name": $(this).attr('name'),
							"data-itype": $(this).attr("data-itype"),
							"title": $(this).parents('label').attr("title")
						});

						// #6943 添加金额类操作逻辑: 右边输入框获取焦点时带入左边值
						$("#vgMoreQuery").find("input[data-direction='to']").focus(function () {
							var fromVal = $(this).parent().find("input[data-direction='from']").val();
							$(this).val(fromVal);
							$(this).addClass("selected");
							$(this).select();
						});
					});
					//渲染更多条件要素列表
					for (var i = 0; i < eleListArr.length; i++) {
						var id = "#eleList" + eleListArr[i]["no"].toString();
						var eleCode = eleListArr[i]["eleCode"];
						page.getItemDatas(id, eleCode);
					}
					if ($("#vgMoreQuery").find(".money").length > 0) {
						//$(".money").amtInput();
						$(".money").amtInputMinus(); //解决清空输入框值后仍显示0.00的问题 允许输入负数
					}

					//绑定时间控件
					$("#vgMoreQuery").find("[data-itype='04']").datetimepicker({
						format: 'yyyy-mm-dd',
						autoclose: true,
						todayBtn: true,
						startView: 'month',
						minView: 'month',
						maxView: 'decade',
						language: 'zh-CN'
					});
					$("#vgMoreQuery").find("[data-itype='04'][data-direction='from']").val(new Date().getFullYear() + '-01-01');
					$("#vgMoreQuery").find("[data-itype='04'][data-direction='to']").val(new Date().getFullYear() + '-12-31');

					$('.lp-query-box-right .lp-setting-box').slideUp();

					if ($('#vgMoreQuery').children().get(0)) {
						$('.lp-query-box-right .tip-more').find('i').text('收起');
						$('.lp-query-box-right .tip-more').find('.glyphicon').addClass('icon-angle-top').removeClass('icon-angle-bottom');
						// $('.lp-query-box-right .tip-more').show();
						$(".lp-query-box-bottom").show();
					} else {
						$('.lp-query-box-right .tip-more').find('i').text('更多');
						$('.lp-query-box-right .tip-more').find('.glyphicon').addClass('icon-angle-bottom').removeClass('icon-angle-top');
						// $('.lp-query-box-right .tip-more').hide();
						$(".lp-query-box-bottom").hide();
					}
					timeId = setTimeout(function () {
						ufma.setBarPos($(window));
						clearTimeout(timeId);
					}, 300)

					// 记录当前选定的条件设置
					configupdate($(".vgBillTypeList li.active").data("data").schemeGuid, JSON.stringify(page.queryTitle));
				});

				//点击更多条件设置弹框的取消和X按钮
				$(".lp-setting-box-footer .btn-default,.lp-setting-box-header .icon-close").on('click', function () {
					$('.lp-query-box-right .lp-setting-box').slideUp('normal', function () {
						$('.lp-setting-box-body label input:checked').prop('checked', false);
						for (var i = 0; i < page.queryIdx.length; i++) {
							$('.lp-setting-box-body label input').eq(page.queryIdx[i]).prop('checked', true);
						}
					});
				});

				// CWYXM-12100：修改为后端分页
				//分页尺寸下拉发生改变
				$(".ufma-table-paginate").on("change", ".vbPageSize", function () {
					pageLength = ufma.dtPageLengthbackend('assetBooking-data', $(".ufma-table-paginate").find(".vbPageSize").val());
					serachData.pageSize = $(".ufma-table-paginate").find(".vbPageSize").val();
					$(".vbDataSum").html("");
					$("#assetBooking-data tbody").html('');
					$("#tool-bar .slider").remove();
					$(".ufma-table-paginate").html("");
					page.billDataSearch(pageLength);
				});

				//点击页数按钮
				$(".ufma-table-paginate").on("click", ".vbNumPage", function () {
					if ($(this).find("a").length != 0) {
						serachData.currentPage = $(this).find("a").attr("data-gopage");
						serachData.pageSize = $(".ufma-table-paginate").find(".vbPageSize").val();
						$(".vbDataSum").html("");
						$("#assetBooking-data tbody").html('');
						$("#tool-bar .slider").remove();
						$(".ufma-table-paginate").html("");
						page.billDataSearch();
					}
				});

				//点击上一页
				$(".ufma-table-paginate").on("click", ".vbPrevPage", function () {
					if (!$(".ufma-table-paginate .vbPrevPage").hasClass("disabled")) {
						serachData.currentPage = $(this).find("a").attr("data-prevpage");
						serachData.pageSize = $(".ufma-table-paginate").find(".vbPageSize").val();
						$(".vbDataSum").html("");
						$("#assetBooking-data tbody").html('');
						$("#tool-bar .slider").remove();
						$(".ufma-table-paginate").html("");
						page.billDataSearch();
					}
				});

				//点击下一页
				$(".ufma-table-paginate").on("click", ".vbNextPage", function () {
					if (!$(".ufma-table-paginate .vbNextPage").hasClass("disabled")) {
						serachData.currentPage = $(this).find("a").attr("data-nextpage");
						serachData.pageSize = $(".ufma-table-paginate").find(".vbPageSize").val();
						$(".vbDataSum").html("");
						$("#assetBooking-data tbody").html('');
						$(".ufma-tool-btns").html('');
						$(".ufma-table-paginate").html("");
						page.billDataSearch();
					}
				});


				//点击查询
				$('.lp-query-box-right .btn-query').on('click', function () {
					$('.lp-query-box-right .lp-setting-box').slideUp();
					//zsj修改金额判空处理
					if (!$.isNull($('input[data-direction="from"]').val()) && !$.isNull($('input[data-direction="to"]').val())) {
						var moneyfrom = $('input[data-direction="from"]').val().replace(/,/g, "");
						var moneyto = $('input[data-direction="to"]').val().replace(/,/g, "");
						if (parseFloat(moneyfrom) > parseFloat(moneyto)) {
							ufma.showTip('开始金额不能大于结束金额！', function () { }, 'error');
							return false;
						}
					}
					page.searchContent();
				});
				//点击条件设置
				$('.lp-query-box-right .btn-queryset').on('click', function () {
					$('.lp-query-box-right .lp-setting-box').slideDown();
					if (lp.vgBillTypeChange) {
						if (lp.schemeData && lp.configSelect && lp.schemeData.schemeGuid && lp.configSelect[lp.schemeData.schemeGuid]) {
							var arr = JSON.parse(lp.configSelect[lp.schemeData.schemeGuid]);
							$(".lp-setting-box-body label input").each(function () {
								for (var i = 0; i < arr.length; i++) {
									if ($(this).parents('label').attr("title") === arr[i]["title"]) {
										if (!$(this).attr("checked")) {
											$(this).trigger("click"); // 设置查询条件弹窗内容勾选
										}
									}
								}
							});
						}
					} else {
						// #vgMoreQuery中选择的name记录到数组中 .lp-setting-box-body下拉框中选中对应
						var namesArr = [];
						$("#vgMoreQuery .lp-query-li input").each(function (i) {
							if ($(this).attr("name")) namesArr.push($(this).attr("name"));
						});
						// 去重
						var res = [];
						for (var i = 0; i < namesArr.length; i++) {
							var current = namesArr[i];
							if (res.indexOf(current) === -1) {
								res.push(current)
							}
						}
						namesArr = res;
						$(".lp-setting-box-body label input").each(function (i) {
							$(this).attr("checked", false)
							$(this).attr("value", "")
							for (var i = 0; i < namesArr.length; i++) {
								if ($(this).attr("name") === namesArr[i]) {
									$(this).trigger("click");
								}
							}
						});
					}
				});

				//点击更多和收起
				$('.lp-query-box-right .tip-more').on('click', function () {
					if ($(this).find("i").text() == "更多") {
						$(this).find("i").text("收起");
						$(this).find("span").removeClass("icon-angle-bottom").addClass("icon-angle-top");
						$(".lp-query-box-bottom").slideDown();
					} else {
						$(this).find("i").text("更多");
						$(this).find("span").removeClass("icon-angle-top").addClass("icon-angle-bottom");
						$(".lp-query-box-bottom").slideUp();
					}
					if (timeId) {
						clearTimeout(timeId);
					}
					timeId = setTimeout(function () {
						ufma.setBarPos($(window));
						clearTimeout(timeId);
					}, 300)
				});

				//汇总生成
				$('#vgSumGen,#tool-bar-sumgen').on('click', function () {
					// page.billGenerateModal("1");
					page.billSummaryGenerate();
				});

				//生成
				$('#vgVouGen,#tool-bar-vougen').on('click', function (e) {
					// page.billGenerateModal("2");
					if (vouGen) {
						page.hasMainGenerate();
						return false;
					}
					page.billGenerate();
				});

				//批量取消生成
				$('#tool-bar-recoverGen').on('click', function () {
					var selectedRows = vgDataTable.rows("tr.selected").data();
					page.cancelGenerateBill(selectedRows, "1");
				});
				//批量删除
				$('#tool-bar-delete').on('click', function () {
					var selectedRows = vgDataTable.rows("tr.selected").data();
					page.deleteBillByGuid(selectedRows, "1");
				});
				//批量不生成
				$("#tool-bar-cancel").on("click", function () {
					var selectedRows = vgDataTable.rows("tr.selected").data();
					page.cancelGen(selectedRows, "1");
				});
				//批量还原
				$("#un-cancel").on("click", function () {
					var selectedRows = vgDataTable.rows("tr.selected").data();
					var tab = $(".nav-tabs .active").find("a").attr("data-state");
					page.unCancel(selectedRows, "1", tab);
				});
				//批量不生成删除
				$("#tool-delete").on("click", function () {
					var selectedRows = vgDataTable.rows("tr.selected").data();
					page.deleteBillByGuid(selectedRows, "1", undefined, "2");
				});
				//表格搜索功能 S
				ufma.searchHideShow($("#assetBooking-data"));
				$(document).on("click", "#open-check-vou", function (e) {
					var oneData = JSON.parse(window.sessionStorage.getItem("oneData"));
					var argu = {
						rgCode: ptData.svRgCode,
						setYear: ptData.svSetYear
					};
					ufma.get(interfaceURL.viewVoucher + oneData.billGuid, argu, function (result) {
						//凭证弹窗
						var ssdata = result.data[0]
						if (result.data[0] == null) {
							ssdata = result.data[1]
						}
						ufma.hideloading();
						if (ssdata.isBigVou == '1') {
							var vouGuid = ssdata.vouGuid
							var baseUrl = '/pf/gl/voubig/voubig.html?menuid=14a44be5-f2bf-4729-8bc7-702c01e3cfcf&action=query&vouGuid=' + vouGuid;
							uf.openNewPage(page.isCrossDomain, $(this), 'openMenu', baseUrl, false, "凭证查看");
						} else {
							var urlPath = "";
							var turnUrl = urlPath + '/pf/gl/vou/index.html?menuid=6661003001001&action=preview&preview=0&dataFrom=vouBox'
							turnUrl = page.addRueicode(turnUrl);
							ufma.open({
								url: turnUrl,
								title: '查看凭证',
								width: 1200,
								// height:500,
								data: result.data, // page.deleVouGuidWatch(result.data),--deleVouGuidWatch此方法未对data做处理，故直接用result.data代替
								ondestory: function (data) {
									//窗口关闭时回传的值
								}
							});
						}
					})
				});
				// 合并方式change事件（借方 贷方 辅助核算合并 摘要累加 摘要相同时合并）
				$(".modeName").on("change", "input[type='checkbox']", function () {
					if ($(this).attr("name") == "onlyDescpt") { // 点击摘要相同时合并
						if ($(this).prop("checked")) { // 勾选摘要相同时合并
							$(this).parents(".modeName").find("input[name='isMergerDr']").prop("checked", true);
							$(this).parents(".modeName").find("input[name='isMergerCr']").prop("checked", true);
							$(this).parents(".modeName").find("input[name='isMergerAcc']").prop("checked", true);
							// 借方 贷方 辅助核算合并 摘要相同时合并 全部勾选时  摘要累加取消勾选且不可用
							$("#DescptAppend").find("input[name='isDescptAppend']").removeAttr("checked");
							$("#DescptAppend").find("input[name='isDescptAppend']").attr("disabled", true);
						} else { // 取消勾选摘要相同时合并
							$("#DescptAppend").find("input[name='isDescptAppend']").attr("disabled", false);
						}
					} else if ($(this).attr("name") == "isMergerAcc") { // 点击辅助核算合并
						if ($(this).parents(".modeName").find("input[name='onlyDescpt']").prop("checked") == true) {
							$(this).prop("checked", true); // 摘要相同时合并勾选状态时，辅助核算合并不可取消勾选
						} else if ($(this).prop("checked")) { // 摘要相同时合并未勾选状态时，勾选借方/贷方
							$(this).parents(".modeName").find("input[name='isMergerDr']").prop("checked", true);
							$(this).parents(".modeName").find("input[name='isMergerCr']").prop("checked", true);
						}
					} else if ($(this).attr("name") == "isMergerCr" || $(this).attr("name") == "isMergerDr") { // 点击借方/贷方
						if ($(this).parents(".modeName").find("input[name='isMergerAcc']").prop("checked") == true) {
							$(this).prop("checked", true); // 辅助核算合并勾选状态时，借方/贷方不可取消勾选
						}
					}
					// liuyyn #3963 选中借方合并/贷方合并/辅助核算合并时，展示摘要累加选项 
					// ==> #6665 勾选借方/贷方/辅助核算合并任意一个时，摘要累加可以勾选，如果这三个选项都没有勾选，摘要累加取消勾选切不可用；
					if ($(this).parents(".modeName").find("input[name='isMergerCr']").prop("checked") || $(this).parents(".modeName").find("input[name='isMergerDr']").prop("checked") || $(this).parents(".modeName").find("input[name='isMergerAcc']").prop("checked")) {
						if ($(this).parents(".modeName").find("input[name='onlyDescpt']").prop("checked")) {
							$("#DescptAppend").find("input[name='isDescptAppend']").attr("disabled", true);
						} else {
							$("#DescptAppend").find("input[name='isDescptAppend']").attr("disabled", false);
						}
					} else {
						$("#DescptAppend").find("input[name='isDescptAppend']").removeAttr("checked");
						$("#DescptAppend").find("input[name='isDescptAppend']").attr("disabled", true);
					}
				});
				$("#lp-btns-list").on("click", function () {
					$("#lp-btns-list").ufTooltip('hide');
				});
				$("#lp-btns-list").on("click", "button", function () {
					if (!$(this).hasClass("btn-primary")) {
						$(this).addClass("btn-primary").removeClass("btn-default").siblings("button").removeClass("btn-primary").addClass("btn-default");
					}
				});
				//取数
				$("#b-import").on("click", function () {
					var item = $(".vgBillTypeList li.active").data("data");
					var schemeGuid = item.schemeGuid;
					var billTypeCode = item.billTypeCode;
					var dataSrcType = item.dataSrcType;
					/* 
					 * CWYXM-8433--资产记账和凭证生成界面，选择使用xml导入的方案点击取数时，弹出xml文件选择框
					 *  1、根据方案的类型动态控制弹窗标题；
					 * 2、根据方案类型控制弹窗界面“工作表”和“数据行”的显示与隐藏
					 * zsj
					 */
					page.openDataSrcType = item.dataSrcType;
					var argu = {};
					argu.dateFrom = $("#dateStart").getObj().getValue();
					argu.dateTo = $("#dateEnd").getObj().getValue();
					if (item.dataSrcType == "01" || item.dataSrcType == "06") {
						//导入excel
						var schemeName = item.schemeName;
						var type = "";
						var agencyCode = page.cbAgency.getValue();
						page.getTableHeadName(schemeGuid, type, agencyCode, schemeName, item);

					} else if (item.dataSrcType == "02" || item.dataSrcType == "03" || item.dataSrcType == "04") {
						//导入webSerVice
						ufma.open({
							url: 'dateModal.html',
							title: '请选择起止日期',
							width: 500,
							height: 400,
							data: argu,
							ondestory: function (action) {
								if (action.action && action.action.action == 'save') {
									ufma.showloading('正在加载数据，请耐心等待...');
									var argu = $.extend(action.action.argu, {
										schemeGuid: schemeGuid,
										dataSrcType: dataSrcType,
										billTypeCode: billTypeCode,
										agencyCode: page.cbAgency.getValue(),
										acctCode: $("#cbAcct").getObj().getValue(),
									});
									argu.rgCode = ptData.svRgCode;
									argu.setYear = ptData.svSetYear;
									ufma.post(interfaceURL.importBillData, argu, function (result) {
										ufma.hideloading();
										ufma.showTip(result.msg, function () {
											// $('.lp-query-box-right .btn-query').trigger("click");
											var id = page.cbAgency.getValue();
											page.renderBillSchemes(id); // 获取方案列表
										}, result.flag)
									})
								}
							}
						});
					} else if (item.dataSrcType == "05") {
						ufma.open({
							url: 'dateModal.html',
							title: '请选择起止日期',
							width: 500,
							height: 350,
							//data: bennian,
							ondestory: function (action) {
								if (action.action && action.action.action == 'save') {
									ufma.get('/lp/gwzjConfig/selectLpGwzjConfig', '', function (result) {
										if (result.data.length > 0) {
											var urls = result.data[0].URL
											var urlss = result.data[1].URL
											var views = result.data[5].URL
											$.ajax({
												type: "get",
												url: urls,
												async: true,
												success: function (data) {
													ufma.showloading('正在加载数据，请耐心等待...');
													var alls = data;
													var rdata = data.ReadAllPayFileInfosResult
													if (rdata.ErrorCode == 0 && rdata.IsSuccess == true) {
														var pdatas = rdata.PayFileInfos
														var payName = []
														for (var i = 0; i < pdatas.length; i++) {
															var paylsname = pdatas[i].FileName.substring(0, pdatas[i].FileName.length - 4)
															payName.push(paylsname)
														}
														var nowerll = payName.join(',')
														var menuid = $.getUrlParam('menuid');
														$.ajax({
															type: "get",
															url: urlss + nowerll,
															async: true,
															beforeSend: function(xhr) {
																xhr.setRequestHeader("x-function-id",menuid);
															},
															success: function (data) {
																var allss = data
																var rdatas = data.ReadPayFileByNamesResult
																if (rdatas.ErrorCode == 0 && rdatas.IsSuccess == true) {
																	var argu = $.extend(action.action.argu, {
																		schemeGuid: schemeGuid,
																		dataSrcType: dataSrcType,
																		billTypeCode: billTypeCode,
																		agencyCode: page.cbAgency.getValue(),
																		acctCode: null,
																		ReadAllPayFileInfosResult: JSON.stringify(alls),
																		ReadPayFileByNamesResult: JSON.stringify(allss),
																		view: views
																	});
																	argu.rgCode = ptData.svRgCode;
																	argu.setYear = ptData.svSetYear;
																	ufma.post(interfaceURL.importBillData, argu, function (result) {
																		ufma.hideloading();
																		ufma.showTip(result.msg, function () {
																			// $('.lp-query-box-right .btn-query').trigger("click");
																			var id = page.cbAgency.getValue();
																			page.renderBillSchemes(id); // 获取方案列表								
																		}, result.flag)
																	})
																}
															}
														})
													} else {
														ufma.showTip('获取文件失败', function () { }, 'error')
													}
												}
											})
										}
									})
								}
							}
						});
					} else {
						//导入中间库、内部子系统
						ufma.showloading('正在加载数据，请耐心等待...');
						var argu = {
							schemeGuid: schemeGuid,
							dataSrcType: dataSrcType,
							billTypeCode: billTypeCode,
							agencyCode: page.cbAgency.getValue()
						};
						argu.rgCode = ptData.svRgCode;
						argu.setYear = ptData.svSetYear;
						var url = ''
						if (item.dataSrcType == "06") {
							url = interfaceURL.importXmlBill;
							argu.acctCode = $("#cbAcct").getObj().getValue();
						} else {
							url = interfaceURL.importBillData;
						}
						//	ufma.post(interfaceURL.importBillData, argu, function(result) {
						ufma.post(url, argu, function (result) {
							ufma.hideloading();
							ufma.showTip(result.msg, function () {
								// $('.lp-query-box-right .btn-query').trigger("click");
								var id = page.cbAgency.getValue();
								page.renderBillSchemes(id); // 获取方案列表
							}, result.flag)
						})
					}

				});
				//调用公式编辑器
				$(document).on("click", ".clickbtns", function (e) {
					var allid = $(this).closest(".vouDate").attr("id");
					var datas = {
						billTypeGuid: $(".vgBillTypeList li.active").data("data").schemeGuid,
						agencyCode: page.cbAgency.getValue(),
						eleCode: undefined,
						targetBill: $('#tgTarget').val() ? $('#tgTarget').val() : 'LP_VOU_TEMPLATE',
						allid: allid,
						thisId: "templateGeneration",
						UPagencyCode: page.cbAgency.getValue(),
						FormulaEditorVal: $("#" + allid).find("input").val(),
						reqAcctCode: {
							reqAcctCode: $("#cbAcct").getObj().getValue(),
							reqAcctType: 1
						}
					};
					ufma.setObjectCache("openFormulaEditor", datas);
					ufma.open({
						url: '../formulaeditor/formulaEditor.html',
						title: '公式编辑器',
						width: 1090,
						// height: 500,
						data: "",
						ondestory: function (data) {
							page.setFormulaEditorData(data);
							// var id = $(window.parent.document).find("iframe[name='menuFrame']");
							// $(id).attr("scrolling","no");
						}
					});
				});
				$("#assetBooking .table-tab").scroll(function() {
					var lengs = $("#assetBooking-data").find('thead').find('tr').eq(0).find('th').length-1
					var rightwz = $("#assetBooking-data").find('thead').find('tr').eq(0).find('th').eq(lengs).offset().left
					var kuandu = $("#assetBooking-data").find('thead').find('tr').eq(0).find('th').eq(lengs).width()
					var scroll = $(".table-tab").scrollLeft()
					var tabwidth = $(".table-tab").width()
					if(rightwz+kuandu>tabwidth){
						$("#assetBooking-dataright,#datarigthhead").css({'left':tabwidth-20-kuandu+scroll+"px"})
					}else{
						$("#assetBooking-dataright,#datarigthhead").css({'left':rightwz-30+scroll+'px'})
					} 
					$("#assetBooking-dataleft,#datalefthead").css({'left':scroll+"px"})
					$('#assetBooking-datahead,#datarigthhead,#datalefthead').css({'top':$('#assetBooking .table-tab').scrollTop()+'px'})
				})
				
			},

			//此方法必须保留
			init: function () {
				ufma.parse();
				page.openDataSrcType = '';
				this.initPage();
				this.onEventListener();
				ufma.parseScroll();
				window.addEventListener('message', function (e) {
					if (e.data.hasOwnProperty('messageType') && e.data.messageType == 'clientWidth') {
						page.isCrossDomain = true;
					} else {
						page.isCrossDomain = false;
					}
				})
			}
		}
	}();
	/////////////////////
	page.init();
	$("body").on("click", "#pzlrtzdiv", function () {
		window.parent.openNewMenu($(this));
	});

	function stopPropagation(e) {
		if (e.stopPropagation)
			e.stopPropagation();
		else
			e.cancelBubble = true;
	}

	function showModal(url, width, height) {
		if (typeof (width) == "undefined") {
			width = document.body.clientWidth;
		}
		if (typeof (height) == "undefined") {
			height = document.body.clientHeight;
		}
		var divBg = '<div id="tempModalBg" style="background:#fff;width:1090px;height:500px;position:fixed;z-index:9999;overflow:hidden;top:0;left:0;">' +
			'<iframe src="' + url + '" height="100%" width="100%" style="border:none;position:absolute;"></iframe>' +
			'</div>';
		$("body").append($(divBg));
		var topVal = ($(window).height() - $("#tempModalBg").height()) / 2;
		var leftVal = ($(window).width() - 1090) / 2;
		$("#tempModalBg").css({
			top: topVal.toString() + 'px',
			left: leftVal.toString() + 'px'
		});
		$("#ModalBg").css("display", "block");
		$("body").css("overflow", "hidden");
		$(window).on("resize", function () {
			var topVal = ($(window).height() - $("#tempModalBg").height()) / 2;
			var leftVal = ($(window).width() - 1090) / 2;
			$("#tempModalBg").css({
				top: topVal.toString() + 'px',
				left: leftVal.toString() + 'px'
			});
		});
	};

	// 记录/修改条件设置
	function configupdate(key, value) {
		var data = {
			"agencyCode": lp.agencyCode,
			"acctCode": $("#cbAcct").getObj().getValue(),
			"menuId": "e9d34f53-00e0-491e-aac5-e481156e91ef",
			"configKey": key,
			"configValue": value
		}
		ufma.ajaxDef('/pub/user/menu/config/update', "post", data, function (data) { })
	}

});