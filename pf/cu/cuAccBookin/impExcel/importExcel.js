$(function () {
	window._close = function (action, tableData) {
		if (window.closeOwner) {
			var data = {
				action: action,
				tableData: tableData
			};
			window.closeOwner(data);
		}
	}
	var bImp = false,
		readData;
	var accountInfo;
	var isCurrency;
	var amtImpType = "1";
	var followChangeStart = false;
	var followChangeEnd = false;
	var fileClone;
	var tableData;
	var tempRows;
	var scheData;
	var page = function () {
		//银行对账单接口
		var portList = {
			getBankImpSche: "/cu/journalImpSche/select", //请求数据格式方案列表
			previewExcel: "/cu/journalImpSche/showJournalExcel", //选择excel文件
			impExcel: "/cu/journalImpSche/impJournalExcel" //导入excel文件
		};

		return {
			//获取账簿信息
			getAccountInfo: function () {
				//编辑调用数据
				if (!$.isNull(window.ownerData.accountBookGuid)) {
					ufma.ajaxDef("/cu/cuAccountBook/select/" + window.ownerData.accountBookGuid, "post", "", function (result) {
						accountInfo = result.data;
					});
				}
			},
			//初始化预览表格
			initTable: function (id, data) {
				var tableObj = $("#" + id).dataTable({
					"language": {
						"url": bootPath + "agla-trd/datatables/datatable.default.js"
					},
					"data": data,
					bRetrieve: true,
					"paging": false, // 禁止分页
					"processing": true, //显示正在加载中
					"ordering": false,
					"columns": page.initColumns(),
					"bAutoWidth": false,
					"dom": 'rt',
					"initComplete": function () {
						//guohx  20180822  注释掉延时和trigger  不知道为什么  注释掉滚动条可用
						//var timeId = setTimeout(function () {
						$('#' + id).closest('.dataTables_wrapper').ufScrollBar({
							hScrollbar: true,
							mousewheel: false
						});
						//$('.ufma-layout-up').trigger('scroll');
						//}, 300);

					},
					"drawCallback": function (settings) {
						//var twidth = 15 * colArr.length;
						//$("#" + id).css("width", twidth + "%");
						$("#" + id).find("td.dataTables_empty").text("")
							.append('<img src="' + bootPath + 'images/noData.png"/><br/><i>目前还没有你要查询的数据</i>');
					}
				});
				// return tableObj;
			},
			initColumns: function () {
				var columns = [
					{
						title: "行号",
						data: "rowNum",
						className: 'nowrap tc isprint',
						width: 100
					},
					{
						title: "登账日期",
						data: "jouDate",
						className: 'nowrap tc isprint',
						width: 100
					}];
				columns.push({
					title: "摘要",
					data: "summary",
					className: 'nowrap isprint'
				});
				columns.push({
					title: "票据类型",
					data: 'billtypeCodeName',
					className: 'nowrap tr isprint'
				});
				columns.push({
					title: "票据号",
					data: 'billNo',
					className: 'nowrap tr isprint'
				});
				if ((!isCurrency) && (amtImpType == "1")) {
					columns.push({
						title: "借贷方向",
						data: "drCrName",
						className: 'nowrap tr isprint '
					});
					columns.push({
						title: "金额",
						data: 'money',
						className: 'nowrap tr isprint tdNum',
						render: $.fn.dataTable.render.number(',', '.', 2, ''),
						render: function (data, type, rowdata, meta) {
							var val = $.formatMoney(data);
							return val == 0 ? '' : val;
						}
					});
				} else if (isCurrency && (amtImpType == "1")) {
					columns.push({
						title: "借贷方向",
						data: "drCrName",
						className: 'nowrap tr isprint '
					});
					columns.push({
						title: "本币金额",
						data: 'money',
						className: 'nowrap tr isprint tdNum',
						render: $.fn.dataTable.render.number(',', '.', 2, ''),
						render: function (data, type, rowdata, meta) {
							var val = $.formatMoney(data);
							return val == 0 ? '' : val;
						}
					});
					columns.push({
						title: "外币金额",
						data: 'currencyMoney',
						className: 'nowrap tr isprint tdNum',
						render: $.fn.dataTable.render.number(',', '.', 2, ''),
						render: function (data, type, rowdata, meta) {
							var val = $.formatMoney(data);
							return val == 0 ? '' : val;
						}
					});
					columns.push({
						title: "汇率",
						data: 'exchangeRate',
						className: 'nowrap tr isprint tdNum',
						render: $.fn.dataTable.render.number(',', '.', 2, ''),
						render: function (data, type, rowdata, meta) {
							var val = $.formatMoney(data);
							return val == 0 ? '' : val;
						}
					});
				} else if (isCurrency && amtImpType == "2") {
					columns.push({
						title: "本币借方金额",
						data: 'drMoney',
						className: 'nowrap tr isprint tdNum',
						render: $.fn.dataTable.render.number(',', '.', 2, ''),
						render: function (data, type, rowdata, meta) {
							var val = $.formatMoney(data);
							return val == 0 ? '' : val;
						}
					});
					columns.push({
						title: "本币贷方金额",
						data: 'crMoney',
						className: 'nowrap tr isprint tdNum',
						render: $.fn.dataTable.render.number(',', '.', 2, ''),
						render: function (data, type, rowdata, meta) {
							var val = $.formatMoney(data);
							return val == 0 ? '' : val;
						}
					});
					columns.push({
						title: "外币借方金额",
						data: 'currencyDrMoney',
						className: 'nowrap tr isprint tdNum',
						render: $.fn.dataTable.render.number(',', '.', 2, ''),
						render: function (data, type, rowdata, meta) {
							var val = $.formatMoney(data);
							return val == 0 ? '' : val;
						}
					});
					columns.push({
						title: "外币贷方金额",
						data: 'currencyCrMoney',
						className: 'nowrap tr isprint tdNum',
						render: $.fn.dataTable.render.number(',', '.', 2, ''),
						render: function (data, type, rowdata, meta) {
							var val = $.formatMoney(data);
							return val == 0 ? '' : val;
						}
					});
					columns.push({
						title: "汇率",
						data: 'exchangeRate',
						className: 'nowrap tr isprint tdNum',
						render: $.fn.dataTable.render.number(',', '.', 2, ''),
						render: function (data, type, rowdata, meta) {
							var val = $.formatMoney(data);
							return val == 0 ? '' : val;
						}
					});
				} else {
					columns.push({
						title: "借方金额",
						data: 'drMoney',
						className: 'nowrap tr isprint tdNum',
						render: $.fn.dataTable.render.number(',', '.', 2, ''),
						render: function (data, type, rowdata, meta) {
							var val = $.formatMoney(data);
							return val == 0 ? '' : val;
						}
					});
					columns.push({
						title: "贷方金额",
						data: 'crMoney',
						className: 'nowrap tr isprint tdNum',
						render: $.fn.dataTable.render.number(',', '.', 2, ''),
						render: function (data, type, rowdata, meta) {
							var val = $.formatMoney(data);
							return val == 0 ? '' : val;
						}
					});
				}
				columns.push({
					title: "凭证字号",
					data: 'vouTypeNameNo',
					className: 'nowrap tr isprint'
				});
				if (!$.isNull(accountInfo.needShowAccitem) && !$.isNull(window.ownerData.items)) {
					var needShowAccItem = accountInfo.needShowAccitem.split(',');
					for (var i = 0; i < needShowAccItem.length; i++) {
						for (var j = 0; j < window.ownerData.items.length; j++) {
							if (needShowAccItem[i] == window.ownerData.items[j].accitemCode) {
								var item = window.ownerData.items[j];
								var cbName = item.eleName;
								var cbItem = item.eleCode;
								var cbCode = item.accitemCode;
								if (!$.isNull(cbItem)) {
									columns.push({
										title: cbName,
										data: page.shortLineToTF(cbCode) + 'CodeName', //转为accitemCodeCodeName
										className: 'nowrap',
										width: 240
									});
								}
							}
						}
					}
				}
				columns.push({
					title: "支出类型",
					data: 'typeName',
					className: 'nowrap isprint'
				});
				columns.push({
					title: "经办人",
					data: 'dealWith',
					className: 'nowrap isprint'
				});
				columns.push({
					title: "资金类型",
					data: 'cashTypeName',
					className: 'nowrap isprint'
				});
				columns.push({
					title: "对方单位",
					data: 'oppositeUnit',
					className: 'nowrap  isprint'
				});
				columns.push({
					title: "备注",
					data: 'remark',
					className: 'nowrap isprint'
				});
				columns.push({
					title: "是否回单",
					data: 'isReceiptName',
					className: 'nowrap tc isprint',
					width: 40
				});
				return columns;
			},
			//获取账簿币种属性是否为本币
			getCurPro: function () {
				if (!$.isNull(accountInfo.curCode)) {
					var argu = {
						agencyCode: window.ownerData.agencyCode,
						eleCode: 'CURRENCY',
						chrCode: accountInfo.curCode
					};
					ufma.ajaxDef("/cu/common/getAccItemTree", 'get', argu, function (result) {
						if (result.data.length != 0) {
							if (result.data[0].isStdCur == "0") { //为外币
								isCurrency = true;
							} else {
								//显示金额
								isCurrency = false;
							}
						}
					});
				} else {
					//显示金额
					isCurrency = false;
				}
			},


			//打开设置导入方案页面
			openDataSet: function (impScheGuid) {
				var param = {};
				param["impType"] = 2;
				param["impScheGuid"] = impScheGuid;
				if (!$.isNull($("#sheetList").getObj().getItem())) {
					param["letterList"] = $("#sheetList").getObj().getItem().colums; //excel列名集合
				}
				param["agencyCode"] = page.agencyCode;
				param["acctCode"] = window.ownerData.acctCode;
				param["accoCode"] = window.ownerData.accoCode;
				param["setYear"] = page.setYear;
				param["rgCode"] = page.rgCode;
				param["accountBookGuid"] = window.ownerData.accountBookGuid;
				param["accountInfo"] = accountInfo;
				param["isCurrency"] = isCurrency;
				param["items"] = window.ownerData.items;
				param["tempRows"] = tempRows;
				ufma.open({
					url: "setDataFormat.html",
					title: "设置导入方案",
					width: 790,
					data: param,
					ondestory: function (data) {
						if (data.action == "delete" || data.action == "save") {
							bImp = false;
							amtImpType = data.amtImpType;
							$("#impScheGuid").val(data.impScheGuid);
							page.reqImpScheList();
							page.reqPreExcel("method");
							bImp = true;
						}

					}
				});
			},
			reqImpScheList: function () {
				var formatArgu = {
					"impScheGuid": page.impScheGuid,
					"agencyCode": page.agencyCode,
					"accountbookGuid": window.ownerData.accountBookGuid
				};
				ufma.ajaxDef(portList.getBankImpSche, "get", formatArgu, function (result) {
					var data = result.data;
					$("#formatList").ufCombox({
						data: data,
						onComplete: function (sender) {
							if (data.length > 0) {
								sender.getObj().val(data[0].impScheGuid);
								$("#impScheGuid").val(data[0].impScheGuid);
								$("#colStart").val(data[0].startLine);
								amtImpType = data[0].amtImpType;
							}
						}
					});
					if (data.length > 0) {
						$("#form-showTab .tab-content").show();
						$("#form-showTab .setTip").hide();
						page.initTable("showTable", []);
					} else {
						$("#form-showTab .tab-content").hide();
						$("#form-showTab .setTip").show();
					}
				});
			},


			//请求预览excel
			reqPreExcel: function (type) {
				var file = $("#excelFile").val();
				if (file == "") return false;
				if (bImp) return false;
				//guohx 需要克隆一下上次选中的文件 解决再次点开选择文件不选中文件后 记忆之前选中的文件 20200211
				fileClone = $("#excelFile").clone(true);
				function showInfo(res) {
					var data = res.data;
					var baseInfo = data.fileBaseMsg;
					tableData = data.cuJournalVos;
					if (type == "file" || type == "method") {
						$("#sheetList").getObj().load(baseInfo);
						$(".btn-setting").attr("disabled",false); //当预览结果没有返回之前不允许点击设置，guohx CWYXM-17736
						$("#sheetList").getObj().val('1');
						$("#sheetCode").val($("#sheetList").getObj().getValue());
						$("#sheetName").val($("#sheetList").getObj().getText());
						var selectObj = $.inArrayJson(baseInfo, "sheetCode", data.sheetCode);
					} else if (type == "line") { }
					var flag = $("#form-showTab .tab-content").css("display");
					if (flag != "none") {
						var timeId = setTimeout(function () {
							clearTimeout(timeId);
							bImp = false;
							$('#showTable_wrapper').ufScrollBar('destroy'); //动态销毁表格前要先销毁滚动条,否则滚动条无效
							$("#showTable").dataTable().fnDestroy();
							$("#showTable").html(''); //guohx 先清空动态加载列     此处代码后面必须重新初始化表头 直接addData不生效
							var newData = data.cuJournalVos.slice($("#startList_input").val() - 1, $("#endList_input").val());
							page.initTable("showTable", newData);
						}, 300);
					}

				}
				if (type == "file") {
					bImp = true;
					$("#sheetCode").val();
					$("#sheetName").val();
					$("#colStart").val();
					$("#colEnd").val();
					$("#sheetList").getObj().clear();
				}
				$.ajax({
					url: portList.previewExcel,
					type: 'POST',
					cache: false,
					data: new FormData($('#excelFileFrom')[0]),
					processData: false,
					contentType: false
				}).done(function (res) {
					readData = res;
					if (readData.flag == "success") {
						showInfo(readData);
					} else {
						ufma.showTip(readData.msg, function () { }, "error");
					}

				}).fail(function (res) {
					ufma.showTip("导入失败！", function () { }, "error");
				});

			},

			//加载数据行的值集
			reqLineArr: function (obj) {
				$("#startList").getObj().clear();
				$("#endList").getObj().clear();

				var lineArr = [];
				for (var i = obj.minRow; i <= obj.maxRow; i++) {
					var lineObj = {
						id: i,
						name: i
					};
					lineArr.push(lineObj);
				}
				$("#startList").getObj().load(lineArr);
				$("#endList").getObj().load(lineArr);
				//guohx 20200108  解决多次发请求问题 和第二次预览之前请求的起始行不对问题
				// var timeId = setTimeout(function () {
				if (!$.isNull(scheData)) {
					if (!$.isNull(scheData.startLine)) {
						$("#startList").getObj().val(scheData.startLine);
					} else {
						$("#startList").getObj().val(lineArr[0].id);
					}
					$("#endList").getObj().val(lineArr[lineArr.length - 1].id);
				}
				// clearTimeout(timeId);
				// }, 30);
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
			dealTableData: function () {
				bImp = false;
				$('#showTable_wrapper').ufScrollBar('destroy'); //动态销毁表格前要先销毁滚动条,否则滚动条无效
				$("#showTable").dataTable().fnDestroy();
				$("#showTable").html(''); //guohx 先清空动态加载列     此处代码后面必须重新初始化表头 直接addData不生效
				var newData = tableData.slice($("#startList_input").val() - 1, $("#endList_input").val());
				page.initTable("showTable", newData);
			},
			onEventListener: function () {
				//取消导入的模态框
				$('#importExcel .btn-close').on('click', function () {
					_close("close", {});
				});

				//选择上传文件
				$(".file-upload-box-btn").on("change", ".file-upload-input", function () {
					var index = 0;
					if (index == 0) {
						index = 1;
						var fileSize = $("#excelFile").val().length;
						if (fileSize == 0) {
							$("#excelFile").remove();
							$("#impScheGuid").after(fileClone);
						}
					}
					var oldFile = $(".file-upload-title span").text();
					var filePath = this.files[0];
					var $box = $(this).parents(".radio-title");
					if (!$.isNull(filePath)) {
						$box.find(".file-upload-tip").hide();
						$box.find(".file-upload-title").show().find("span").text(filePath.name);
						$box.find(".file-upload-title").show().find("span").attr("title",filePath.name)
					} else {
						if (oldFile != "") {
							$box.find(".file-upload-tip").hide();
							$box.find(".file-upload-title").show().find("span").text(oldFile);
						} else {
							$box.find(".file-upload-tip").show();
							$box.find(".file-upload-input").hide().find("span").text(filePath.name);
						}
					}
				});
				//删除文件
				$(".file-upload-title .icon-close").on("click", function () {
					var $box = $(this).parents(".radio-title");
					$box.find(".file-upload-tip").show();
					$box.find(".file-upload-title").hide().find("span").text("");
					$box.find(".file-upload-input").val("");
					$("#sheetList").getObj().clear();
					$("#startList").getObj().clear();
					$("#endList").getObj().clear();
					$('#showTable_wrapper').ufScrollBar('destroy'); //动态销毁表格前要先销毁滚动条,否则滚动条无效
					$("#showTable").dataTable().fnDestroy();
					$("#showTable").html(''); //guohx 先清空动态加载列     此处代码后面必须重新初始化表头 直接addData不生效
					page.initTable("showTable", []);
				});

				//打开设置导入方案页面
				$(".showSet").on("click", function () {
					var impScheGuid = "";
					var file = $("#excelFile").val();
					if (file != "") {
						impScheGuid = $("#formatList").getObj().getValue();
					} else {
						ufma.showTip("请先选择excel文件！", function () { }, "warning");
						return false;
					}
					page.openDataSet(impScheGuid);
				});
				//选择excel文件
				$("#excelFile").on("change", function () {
					page.reqPreExcel("file");
				});

				//导入文件
				$(".btn-import").on("click", function () {
					var excelFile = $("#excelFile").val();
					if ($.isNull(excelFile)) {
						ufma.showTip("请选择要导入的Excel文件！", function () { }, "warning");
						return false;
					}

					var formatVal2 = $("#formatList").getObj().getValue();
					if ($.isNull(formatVal2)) {
						ufma.showTip("请选择导入方案！", function () { }, "warning");
						return false;
					}
					ufma.showloading('正在加载数据请耐心等待...')
					var impScheGuid = $("#formatList").getObj().getValue();
					$.ajax({
						url: portList.impExcel + page.urlArgu,
						type: 'POST',
						cache: false,
						data: new FormData($('#excelFileFrom')[0]),
						processData: false,
						contentType: false
					}).done(function (res) {
						ufma.hideloading();
						if (res.flag == "success") {
							ufma.showTip(res.msg, function () {
								_close("import", res.data);
							}, "success");
						} else {
							ufma.showTip(res.msg, function () {
								$('#showTable_wrapper').ufScrollBar('destroy'); //动态销毁表格前要先销毁滚动条,否则滚动条无效
								$("#showTable").dataTable().fnDestroy();
								$("#showTable").html(''); //guohx 先清空动态加载列  解决缺少列的问题
								var newData = res.data.slice($("#startList_input").val() - 1, $("#endList_input").val());
								page.initTable("showTable", res.data);
							}, "error");
						}
					}).fail(function (res) {
						ufma.hideloading();
						if (res.flag == "fail") {
							$('#showTable_wrapper').ufScrollBar('destroy'); //动态销毁表格前要先销毁滚动条,否则滚动条无效
							$("#showTable").dataTable().fnDestroy();
							$("#showTable").html(''); //guohx 先清空动态加载列     此处代码后面必须重新初始化表头 直接addData不生效
							var newData = res.data.slice($("#startList_input").val() - 1, $("#endList_input").val());
							page.initTable("showTable", res.data);
						}
						ufma.showTip(res.msg, function () { }, "error");
					});
				}
				);
				//
				$('.ufma-layout-up').scroll(function (e) {
					var sc = $(this).scrollTop();
					var _sc = $('#showTable').closest('.dataTables_wrapper').find('.hsc');
					var scTop = sc + $(this).height() - $('#form-uploadTab').outerHeight(true) - 21;
					_sc.css({ 'top': scTop + 'px' });
				});
				//修改使用回车键却弹出了导入方案设置界面
				$(document).on("keydown", function (event) {
					event = event || window.event;
					if (window.event && window.event.keyCode == 13) {
						window.event.returnValue = false;
					}
				});
			},

			//此方法必须保留
			init: function () {
				page.urlArgu = "?ajax=1";
				ufma.parse();
				page.agencyCode = window.ownerData.agencyCode;
				page.setYear = window.ownerData.setYear;
				page.rgCode = window.ownerData.rgCode;
				page.getAccountInfo();
				page.getCurPro();
				$(".btn-setting").attr("disabled",true);
				//初始化工作列表
				$("#sheetList").ufCombox({
					idField: "sheetCode",
					textField: "sheetName",
					placeholder: "请选择工作表",
					onChange: function (sender, data) {
						followChangeEnd = false;
						followChangeStart = false;
						tempRows = data;
						page.reqLineArr(data);
						$("#sheetCode").val(data.sheetCode);
						$("#sheetName").val(data.sheetName);
						page.reqPreExcel("sheet");
						followChangeEnd = true;
						followChangeStart = true;
					}
				});
				//初始化开始数据行
				$("#startList").ufCombox({
					idField: "id",
					textField: "name",
					placeholder: "请选择",
					onChange: function (sender, data) {
						$("#colStart").val(data.id);
						if (followChangeStart) {
							//guohx 解决切换起始行不向后端发请求，前端自己处理数据 20200213
							page.dealTableData();
						}
					}
				});
				//初始化结束数据行
				$("#endList").ufCombox({
					idField: "id",
					textField: "name",
					placeholder: "请选择",
					onChange: function (sender, data) {
						$("#colEnd").val(data.id);
						if (followChangeEnd) {
							page.dealTableData();
						}
					}
				});

				//初始化导入方案列表
				$("#formatList").ufCombox({
					idField: "impScheGuid",
					textField: "impScheName",
					placeholder: "请选择数据格式方案",
					onChange: function (sender, data) {
						scheData = data;
						$("#impScheGuid").val(data.impScheGuid);
						$("#colStart").val(data.startLine);
						amtImpType = data.amtImpType;
						page.reqPreExcel("method"); //解开注释,切换方案要重新刷表格
					}
				});
				$("#excelFileFrom").show();
				//请求数据格式方案列表
				page.reqImpScheList();

				page.onEventListener();

			}
		}
	}();
	page.init();
});