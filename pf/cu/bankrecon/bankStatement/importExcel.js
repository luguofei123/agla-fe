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
	var followChangeStart = false;
	var followChangeEnd = false;
	var tableData;
	var page = function () {
		//银行对账单接口
		var portList = {
			getBankExtends: "/cu/bankStatement/getStatementExtend", //获取对账单扩展字段
			getBankImpSche: "/cu/bankStatement/getBankImpSche", //请求数据格式方案列表
			previewTxt: "/cu/bankStatement/previewBankStatementTxt", //选择文本文件
			previewExcel: "/cu/bankStatement/showBankStatementExcel", //选择excel文件
			impTxt: "/cu/bankStatement/impBankStatementTxt", //导入文件文件
			impExcel: "/cu/bankStatement/impBankStatementExcel" //导入excel文件
		};

		return {
			//初始化预览表格
			initTable: function (id, data, colArr) {
				var tableObj = $("#" + id).dataTable({
					"language": {
						"url": bootPath + "agla-trd/datatables/datatable.default.js"
					},
					"data": data,
					bRetrieve: true,
					"paging": false, // 禁止分页
					"processing": true, //显示正在加载中
					"ordering": false,
					"columns": colArr,
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
				return tableObj;
			},

			//请求扩展字段，重组表格
			extTable: function (id) {
				//获取扩展字段
				var extArgu = {
					"schemaGuid": page.schemaGuid
				};
				ufma.ajaxDef(portList.getBankExtends, "get", extArgu, function (result) {
					var extendsArr = result.data;
					var tableData = [];
					var extColArr = [];
					for (var i = 0; i < extendsArr.length; i++) {
						if (extendsArr[i].eleCode == "RELATION") {
							var extColObj = {
								'sTitle': extendsArr[i].showName,
								'mData': extendsArr[i].extendField,
								className: 'normal',
								'sWidth': '150px'
							}
							extColArr.push(extColObj);
						} else {
							var extColObj = {
								'sTitle': extendsArr[i].showName,
								'mData': extendsArr[i].extendField + "Name",
								className: 'normal',
								'sWidth': '150px'
							}
							extColArr.push(extColObj);
						}
					}
					page.allCol = page.bankColArr.concat(extColArr);
					page.initTable(id, tableData, page.allCol);
				});
			},

			//打开设置导入方案页面
			openDataSet: function (impType, impScheGuid) {
				var param = {};
				param["impType"] = impType;
				param["impScheGuid"] = impScheGuid;
				if (impType == "2") {
					if (!$.isNull($("#sheetList").getObj().getItem())) {
						param["letterList"] = $("#sheetList").getObj().getItem().colums; //excel列名集合
					}
				} else if (impType == "1") {
					param["letterList"] = []; //空数组
				}
				param["schemaGuid"] = page.schemaGuid;
				param["agencyCode"] = page.agencyCode;
				param["setYear"] = page.setYear;
				param["rgCode"] = page.rgCode;
				ufma.open({
					url: "setDataFormat.html",
					title: "设置导入方案",
					width: 890,
					data: param,
					ondestory: function (data) {
						if (data.action == "delete" || data.action == "save") {
							var impType = $("input[name='impType']:checked").val();
							if (impType == "1") { //文本
								page.reqImpScheList();
								page.reqPreText();
							} else if (impType == "2") { //excel
								//修改保存方案后 不预览
								bImp = false;
								page.reqImpScheList2();
								page.reqPreExcel("method");
							bImp = true;
							}
						}
					}
				});
			},

			//请求导入方案列表
			reqImpScheList: function () {
				var formatArgu = {
					"impType": "1",
					"schemaGuid": page.schemaGuid
				};
				ufma.ajaxDef(portList.getBankImpSche, "get", formatArgu, function (result) {
					var data = result.data;
					$("#formatList").ufCombox({
						data: data,
						onComplete: function (sender) {
							if (data.length > 0) {
								sender.getObj().val(data[0].impScheGuid);
								$("#impScheGuid").val(data[0].impScheGuid);
								$("#editStartLine,#colIndex").val(data[0].startLine);
							}
						}
					});
					if (data.length > 0) {
						$("#form-showTab1 .tab-content").show();
						$("#form-showTab1 .setTip").hide();
						page.extTable("showTable1");
					} else {
						$("#form-showTab1 .tab-content").hide();
						$("#form-showTab1 .setTip").show();
					}
				});
			},
			reqImpScheList2: function () {
				var formatArgu2 = {
					"impType": "2",
					"schemaGuid": page.schemaGuid
				};
				ufma.ajaxDef(portList.getBankImpSche, "get", formatArgu2, function (result) {
					var data = result.data;
					$("#formatList2").ufCombox({
						data: data,
						onComplete: function (sender) {
							if (data.length > 0) {
								sender.getObj().val(data[0].impScheGuid);
								$("#impScheGuid2").val(data[0].impScheGuid);
								$("#colStart").val(data[0].startLine);
							}
						}
					});
					if (data.length > 0) {
						$("#form-showTab2 .tab-content").show();
						$("#form-showTab2 .setTip").hide();
						page.extTable("showTable2");
					} else {
						$("#form-showTab2 .tab-content").hide();
						$("#form-showTab2 .setTip").show();
					}
				});
			},

			//请求预览文本
			reqPreText: function () {
				var file = $("#textFile").val();
				if (file != "") {
					$.ajax({
						url: portList.previewTxt + page.urlArgu,
						type: 'POST',
						cache: false,
						data: new FormData($('#textFileFrom')[0]),
						processData: false,
						contentType: false
					}).done(function (res) {
						var flag = $("#form-showTab1 .tab-content").css("display");
						if (flag != "none") {
							$("#showTable1").DataTable().clear().destroy();
							page.initTable("showTable1", res.data, page.allCol);
						}
					}).fail(function (res) {
						//ufma.showTip("导入失败！",function(){},"error");
					});
				}
			},

			//请求预览excel
			reqPreExcel: function (type) {
				var file = $("#excelFile").val();
				if (file == "") return false;
				if (bImp) return false;

				function showInfo(res) {
					if (res.flag == "success") {
						var data = res.data;
						var baseInfo = data.fileBaseMsg;
						tableData = data.bankStatement;
					if (type == "file" || type == "method") {
						$("#sheetList").getObj().load(baseInfo);
						$("#sheetList").getObj().val('1');
						$("#sheetCode").val($("#sheetList").getObj().getValue());
						$("#sheetName").val($("#sheetList").getObj().getText());
						var selectObj = $.inArrayJson(baseInfo, "sheetCode", data.sheetCode);
					} else if (type == "line") { }
					var flag = $("#form-showTab2 .tab-content").css("display");
					if (flag != "none") {
						var timeId = setTimeout(function () {
							clearTimeout(timeId);
							bImp = false;
								$('#showTable2_wrapper').ufScrollBar('destroy'); //动态销毁表格前要先销毁滚动条,否则滚动条无效
								$("#showTable2").dataTable().fnDestroy();
								$("#showTable2").html(''); //guohx 先清空动态加载列     此处代码后面必须重新初始化表头 直接addData不生效
								var newData = data.bankStatement.slice($("#startList_input").val() - 1, $("#endList_input").val());
								page.initTable("showTable2",newData, page.allCol);
							}, 300);
						}
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
				var timeId = setTimeout(function () {
					$("#startList").getObj().val(lineArr[0].id);
					$("#endList").getObj().val(lineArr[lineArr.length - 1].id);
					clearTimeout(timeId);
				}, 30);
			},

			dealTableData: function () {
				bImp = false;
				$('#showTable2_wrapper').ufScrollBar('destroy'); //动态销毁表格前要先销毁滚动条,否则滚动条无效
				$("#showTable2").dataTable().fnDestroy();
				$("#showTable2").html(''); //guohx 先清空动态加载列     此处代码后面必须重新初始化表头 直接addData不生效
				var newData = tableData.slice($("#startList_input").val() - 1, $("#endList_input").val());
				page.initTable("showTable2", newData, page.allCol);
			},
			onEventListener: function () {
				//取消导入的模态框
				$('#importExcel .btn-close').on('click', function () {
					_close("close", {});
				});

				//只能输入数字
				$("#editStartLine").on("keyup", function () {
					$(this).val($(this).val().replace(/[^\d]/g, ''));
				});

				//切换文本文件、Excel
				$(".radio-title label").each(function (i) {
					$(this).on("click", function () {
						$(".uf-dashed-hr").show();
						$(this).find("input").prop("checked", true);
						$(this).siblings().find("input").removeAttr("checked");
						$(".radio-body" + (i + 1)).show().siblings().hide();
						$(".showBox" + (i + 1)).show().siblings().hide();
						var impType = $("input[name='impType']:checked").val();
						if (impType == "1") { //文本
							$("#excelFileFrom").hide();
							$("#textFileFrom").show();
						} else if (impType == "2") { //excel
							$("#excelFileFrom").show();
							$("#textFileFrom").hide();
						}
					});
				});

				//选择上传文件
				$(".file-upload-box-btn").on("change", ".file-upload-input", function () {
					var oldFile = $(".file-upload-title span").text();
					// var filePath = $(this).val();
					var filePath = this.files[0].name;
					var $box = $(this).parents(".radio-title");
					if (filePath != "") {
						$box.find(".file-upload-tip").hide();
						$box.find(".file-upload-title").show().find("span").text(filePath);
						$box.find(".file-upload-title").show().find("span").attr("title",filePath)
					} else {
						if (oldFile != "") {
							$box.find(".file-upload-tip").hide();
							$box.find(".file-upload-title").show().find("span").text(oldFile);
						} else {
							$box.find(".file-upload-tip").show();
							$box.find(".file-upload-input").hide().find("span").text(filePath);
						}
					}
				});
				//删除文件
				$(".file-upload-title .icon-close").on("click", function () {
					var $box = $(this).parents(".radio-title");
					$box.find(".file-upload-tip").show();
					$box.find(".file-upload-title").hide().find("span").text("");
					$box.find(".file-upload-input").val("");
				});

				//打开设置导入方案页面
				$(".showSet").on("click", function () {
					var impType = $("input[name='impType']:checked").val();
					var impScheGuid = "";
					if (impType == "1") { //文本
						var file = $("#textFile").val();
						if (file != "") {
							impScheGuid = $("#formatList").getObj().getValue();
						} else {
							ufma.showTip("请先选择文本文件！", function () { }, "warning");
							return false;
						}
					} else if (impType == "2") { //excel
						var file = $("#excelFile").val();
						if (file != "") {
							impScheGuid = $("#formatList2").getObj().getValue();
						} else {
							ufma.showTip("请先选择excel文件！", function () { }, "warning");
							return false;
						}
					}
					page.openDataSet(impType, impScheGuid);
				});

				//选择文本文件
				$("#textFile").on("change", function () {
					page.reqPreText();
				});

				//选择excel文件
				$("#excelFile").on("change", function () {
					page.reqPreExcel("file");
				});

				//改变文本起始行
				$("#editStartLine").on("change", function () {
					var num = $(this).val();
					if (num != "") {
						page.reqPreText();
					}
				});

				//导入文件
				$(".btn-import").on("click", function () {
					var impType = $("input[name='impType']:checked").val();
					if (impType == "1") { //文本
						var textFile = $("#textFile").val();
						if ($.isNull(textFile)) {
							ufma.showTip("请选择要导入的文本文件！", function () { }, "warning");
							return false;
						}

						var formatVal = $("#formatList").getObj().getValue();
						if ($.isNull(formatVal)) {
							ufma.showTip("请选择导入方案！", function () { }, "warning");
							return false;
						}
						ufma.showloading('正在加载数据请耐心等待...')
						var impScheGuid = $("#formatList").getObj().getValue();
						$.ajax({
							url: portList.impTxt + page.urlArgu,
							type: 'POST',
							cache: false,
							data: new FormData($('#textFileFrom')[0]),
							processData: false,
							contentType: false
						}).done(function (res) {
							ufma.hideloading();
							if (res.flag == "success") {
								ufma.showTip(res.msg, function () {
									_close("import", res.data);
								}, "success");
							} else {
								ufma.showTip(res.msg, function () { }, "error");
							}
						}).fail(function (res) {
							ufma.hideloading();
							ufma.showTip(res.msg, function () { }, "error");
						});

					} else if (impType == "2") { //excel
						var excelFile = $("#excelFile").val();
						if ($.isNull(excelFile)) {
							ufma.showTip("请选择要导入的Excel文件！", function () { }, "warning");
							return false;
						}

						var formatVal2 = $("#formatList2").getObj().getValue();
						if ($.isNull(formatVal2)) {
							ufma.showTip("请选择导入方案！", function () { }, "warning");
							return false;
						}
						ufma.showloading('正在加载数据请耐心等待...')
						var impScheGuid = $("#formatList2").getObj().getValue();
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
								//成功 或者失败 都关闭弹窗 重新刷新 20200109 guohx 存在失败一部分的情况
								ufma.showTip(res.msg, function () {
									_close("import", res.data);
								}, res.flag);
							} else {
								ufma.showTip(res.msg, function () { }, "error");
							}
						}).fail(function (res) {
							ufma.hideloading();
							ufma.showTip(res.msg, function () { }, "error");
						});
					}
				});
				//
				$('.ufma-layout-up').scroll(function (e) {
					var sc = $(this).scrollTop();
					var _sc = $('#showTable2').closest('.dataTables_wrapper').find('.hsc');
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
				page.schemaGuid = window.ownerData.schemaGuid; //方案id
				page.bank = window.ownerData.bank; //银行
				page.bankCode = window.ownerData.bankCode; //银行code
				page.bankAccount = window.ownerData.bankAccount; //银行账号
				page.agencyCode = window.ownerData.agencyCode;
				page.setYear = window.ownerData.setYear;
				page.rgCode = window.ownerData.rgCode;

				if (page.bank != null) {
					$("label[for='bank']").text(page.bank);
					$("input[name='bank']").val(page.bankCode);
				}
				if (page.bankAccount != null) {
					$("label[for='bankAccount']").text(page.bankAccount);
					$("input[name='bankAccount']").val(page.bankAccount);
				}

				//初始化银行对账单格式表格
				page.bankColArr = [{
					sTitle: "单据日期",
					data: "statementDate",
					className: 'normal w150',
					sWidth: '150px'
				},
				{
					sTitle: "摘要",
					data: "descpt",
					className: 'normal',
					sWidth: '150px'
				},
				{
					sTitle: "借方金额",
					data: "amtDr",
					className: 'tr normal',
					render: function (rowid, rowdata, data) {
						var val = $.formatMoney(rowid, 2);
						return val == 0.00 ? '' : val;
					}
				},
				{
					sTitle: "贷方金额",
					data: "amtCr",
					className: 'tr normal',
					render: function (rowid, rowdata, data) {
						var val = $.formatMoney(rowid, 2);
						return val == 0.00 ? '' : val;
					}
				},
				{
					sTitle: "单据编号",
					data: "vouNo",
					className: 'normal',
					sWidth: '150px'
				},
				// {
				// 	sTitle: "结算方式",
				// 	data: "setmodeName",
				// 	className: 'normal',
				// 	sWidth: '150px'
				// },
				{
					sTitle: "票据类型",
					data: "billTypeName",
					className: 'normal',
					sWidth: '150px'
				},
				// {
				// 	sTitle: "票据日期",
				// 	data: "billDate",
				// 	className: 'normal',
				// 	sWidth: '150px'
				// },
				{
					sTitle: "票据号",
					data: "billNo",
					className: 'normal',
					sWidth: '150px'
				}
				];

				//初始化工作列表
				$("#sheetList").ufCombox({
					idField: "sheetCode",
					textField: "sheetName",
					placeholder: "请选择工作表",
					onChange: function (sender, data) {
						followChangeEnd = false;
						followChangeStart = false;
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
						$("#impScheGuid").val(data.impScheGuid);
						$("#editStartLine,#colIndex").val(data.startLine);
						page.reqPreText();
					}
				});
				$("#formatList2").ufCombox({
					idField: "impScheGuid",
					textField: "impScheName",
					placeholder: "请选择数据格式方案",
					onChange: function (sender, data) {
						$("#impScheGuid2").val(data.impScheGuid);
						$("#colStart").val(data.startLine);

						page.reqPreExcel("method");
					}
				});
				$("#excelFileFrom").hide();
				$("#textFileFrom").show();
				//请求数据格式方案列表
				page.reqImpScheList();
				page.reqImpScheList2();

				page.onEventListener();

			}
		}
	}();
	page.init();
});