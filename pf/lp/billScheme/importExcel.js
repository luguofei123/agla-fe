$(function() {
	window._close = function(action, tableData) {
		if(window.closeOwner) {
			var data = {
				action: action,
				tableData: tableData
			};
			window.closeOwner(data);
		}
	};
	var infor = JSON.parse(window.sessionStorage.getItem("dataSourceModelInfor"));
	if(infor.item.dataSrcType == '06') {
		$('#excelFileFrom').addClass("hide");
		$('#xmlFileFrom').removeClass("hide");
	} else {
		$('#excelFileFrom').removeClass("hide");
		$('#xmlFileFrom').addClass("hide");
	}
	var prevFile = null;
	
	var page = function() {
		// var excelFilePath = null;
		var msgTxt = '';
		var reqPreExcelMsg = {}
		var isFirst = true;
		//银行对账单接口
		var portList = {
			previewTxt: "/gl/bank/statement/previewBankStatementTxt", //选择文本文件
			previewExcel: "/gl/bank/statement/showBankStatementExcel", //选择excel文件
			impTxt: "/gl/bank/statement/impBankStatementTxt", //导入文件文件
			impExcel: "/gl/bank/statement/impBankStatementExcel", //导入excel文件
			getBillFileBaseMsg: "/lp/scheme/getBillFileBaseMsg", //获取文件基本信息
			// getExcelLtem: "/lp/scheme/getExcelLtem/",//导入
			importBillData: "/lp/scheme/importExcelBillData/", //导入
			controlImportExcel: "/lp/scheme/controlImportExcel/", //大数据导入（导入接口超时时请求）
			showLpBillExcel: "/lp/scheme/showLpBillExcel/", //预览excel数据
			getTableHeadName: "/lp/scheme/getTableHeadName", //导入数据时获取表头信息
			importXmlBill: '/lp/scheme/importXmlBill/', //xml导入--导入结果
			showLpBillXml: '/lp/scheme/showLpBillXml/' //xml--预览
		};

		return {
			//初始化预览表格
			initTable: function(id, data, colArr) {
				// data.splice(0, 3);
				page.tableObj = $("#" + id).DataTable({
					"language": {
						"url": bootPath + "agla-trd/datatables/datatable.default.js"
					},
					"data": data,
					"bRetrieve": true,
					"paging": false, // 禁止分页
					"bLengthChange": true, //去掉每页显示多少条数据
					"processing": true, //显示正在加载中
					"pagingType": "full_numbers", //分页样式
					"lengthChange": true, //是否允许用户自定义显示数量p
					"lengthMenu": [
						[20, 50, 100, -1],
						[20, 50, 100, "All"]
					],
					"pageLength": 20,
					"bInfo": true, //页脚信息
					"bSort": false, //排序功能
					"ordering": false,
					"columns": colArr,
					// "scrollY": "360px",
					// "sScrollX": "100%",
					// "scrollCollapse": true,
					"autoWidth": false,
					// "dom": 'rt',
					"dom": 'rt<"' + id + '-paginate"ilp>',
					"initComplete": function() {
						//驻底begin
						var toolBar = $(this).attr('tool-bar')
						var $info = $(toolBar + ' .info');
						if($info.length == 0) {
							$info = $('<div class="info"></div>').appendTo($(toolBar + ' .tool-bar-body'));
						}
						$info.html('');
						$('.' + id + '-paginate').appendTo($info);

						$('#' + id).closest('.dataTables_wrapper').ufScrollBar({
							hScrollbar: true,
							mousewheel: false
						});
						// ufma.setBarPos($(window));
						var conH = $(".container-fluid").height() + 25;
						if(conH > $(".ufma-layout-up").height() - 44) {
							conH = $(".ufma-layout-up").height() - 40;
						}
						$('#' + id).closest('.dataTables_wrapper').css("position", "initial");
						var sw = $('#' + id).closest('.dataTables_wrapper').find(".slider").width();
						$('#' + id).closest('.dataTables_wrapper').find(".slider").css({
							top: "0px",
							"margin-top": conH + "px",
							height: "5px",
							left: "30px",
							width: sw + "px"
						});
						$('#' + id).closest('.dataTables_wrapper').find(".slider span").css("height", "5px");
						$(".ufma-tool-bar .tool-bar-body").css("margin-right", "0");
						var wVal = $(".table-part").css("width");
						$("#tool-bar").css({
							"top": "0px",
							"margin-top": conH + "px",
							"position": "absolute",
							"width": parseInt(wVal) + 16 + "px",
							"margin-left": "15px"
						});
						$(".slider").css({
							"top": "-8px",
							"height": "8px"
						});
						$(".slider span").css({
							"height": "8px"
						});
						$(".dataTables_info").css({
							"display": "none" // CWYXM-12367: 去掉前端分页
						});
						$("#tool-bar .info").prepend("<span id='msgTxt'>" + msgTxt + "</span>");
						//驻底end
					},
					"drawCallback": function(settings) {
						// var twidth = 15 * colArr.length;
						// $("#" + id).css("width", twidth + "%");
						$("#" + id).find("td.dataTables_empty").text("")
							.append('<img src="' + bootPath + 'images/noData.png"/><br/><i>目前还没有你要查询的数据</i>');
					}
				});
				// return tableObj;
			},
			// //请求扩展字段，重组表格
			// extTable: function(id) {
			// 	//获取扩展字段
			// 	var extArgu = {
			// 		"schemaGuid": page.schemaGuid
			// 	};
			// 	ufma.ajaxDef(portList.getBankExtends, "get", extArgu, function(result) {
			// 		var data = result.data;
			// 		var extendsArr = data.extendTableHeadList;
			// 		var tableData = [];
			// 		var extColArr = [];
			// 		for(var i = 0; i < extendsArr.length; i++) {
			// 			var extColObj = {
			// 				title: extendsArr[i].showName,
			// 				data: extendsArr[i].extendField + "Name",
			// 				className: 'nowrap'
			// 			}
			// 			extColArr.push(extColObj);
			// 		}
			// 		page.allCol = page.bankColArr.concat(extColArr);
			// 		page.initTable(id, tableData, page.allCol);
			// 	});
			// },

			// //打开设置导入方案页面
			// openDataSet: function(impType, impScheGuid) {
			// 	var param = {};
			// 	param["impType"] = impType;
			// 	param["impScheGuid"] = impScheGuid;
			// 	if(impType == "2") {
			// 		param["letterList"] = $("#sheetList").getObj().getItem().colums; //excel列名集合
			// 	} else if(impType == "1") {
			// 		param["letterList"] = []; //空数组
			// 	}
			// 	param["schemaGuid"] = page.schemaGuid;
			// 	param["agencyCode"] = page.agencyCode;
			// 	param["setYear"] = page.setYear;
			// 	param["rgCode"] = page.rgCode;
			// 	ufma.open({
			// 		url: "setDataFormat.html",
			// 		title: "设置导入方案",
			// 		width: 790,
			// 		data: param,
			// 		ondestory: function(data) {
			// 			//                        console.log(data);
			// 			if(data.action == "delete" || data.action == "save") {
			// 				var impType = $("input[name='impType']:checked").val();
			// 				if(impType == "1") { //文本
			// 					page.reqImpScheList();
			// 					page.reqPreText();
			// 				} else if(impType == "2") { //excel
			// 					page.reqImpScheList2();
			// 					page.reqPreExcel("method");
			// 				}
			// 			}
			// 		}
			// 	});
			// },

			// //请求导入方案列表
			// reqImpScheList: function() {
			// 	var formatArgu = {
			// 		"impType": "1",
			// 		"schemaGuid": page.schemaGuid
			// 	};
			// 	ufma.ajaxDef(portList.getBankImpSche, "get", formatArgu, function(result) {
			// 		var data = result.data;
			// 		$("#formatList").ufCombox({
			// 			data: data,
			// 			onComplete: function(sender) {
			// 				if(data.length > 0) {
			// 					sender.getObj().val(data[0].impScheGuid);
			// 					$("#impScheGuid").val(data[0].impScheGuid);
			// 					$("#editStartLine,#colIndex").val(data[0].startLine);
			// 				}
			// 			}
			// 		});
			// 		if(data.length > 0) {
			// 			$("#form-showTab1 .tab-content").show();
			// 			$("#form-showTab1 .setTip").hide();
			// 			page.extTable("showTable1");
			// 		} else {
			// 			$("#form-showTab1 .tab-content").hide();
			// 			$("#form-showTab1 .setTip").show();
			// 		}
			// 	});
			// },
			// reqImpScheList2: function() {
			// 	var formatArgu2 = {
			// 		"impType": "2",
			// 		"schemaGuid": page.schemaGuid
			// 	};
			// 	ufma.ajaxDef(portList.getBankImpSche, "get", formatArgu2, function(result) {
			// 		var data = result.data;
			// 		$("#formatList2").ufCombox({
			// 			data: data,
			// 			onComplete: function(sender) {
			// 				if(data.length > 0) {
			// 					sender.getObj().val(data[0].impScheGuid);
			// 					$("#impScheGuid2").val(data[0].impScheGuid);
			// 					$("#colStart").val(data[0].startLine);
			// 				}
			// 			}
			// 		});
			// 		if(data.length > 0) {
			// 			$("#form-showTab2 .tab-content").show();
			// 			$("#form-showTab2 .setTip").hide();
			// 			page.extTable("showTable2");
			// 		} else {
			// 			$("#form-showTab2 .tab-content").hide();
			// 			$("#form-showTab2 .setTip").show();
			// 		}
			// 	});
			// },

			//请求预览文本
			reqPreText: function() {
				var file = $("#textFile").val();
				if(file != "") {
					var menuid = $.getUrlParam('menuid');
					$.ajax({
						url: portList.previewTxt + page.urlArgu,
						type: 'POST',
						cache: false,
						data: new FormData($('#textFileFrom')[0]),
						processData: false,
						contentType: false,
						beforeSend: function(xhr) {
							xhr.setRequestHeader("x-function-id",menuid);
						},
					}).done(function(res) {
						//	                	console.info(res);
						var flag = $("#form-showTab1 .tab-content").css("display");
						if(flag != "none") {
							$("#showTable1").DataTable().clear().destroy();
							page.initTable("showTable1", res.data, page.allCol);
						}
					}).fail(function(res) {
						//ufma.showTip("导入失败！",function(){},"error");
					});
				}
			},
			//请求预览excel表格数据
			showExcelData: function() {
				// $("#loadingModal").modal('show');
				ufma.showloading();
				var schemeGuid = $('#source-btn button[class="btn btn-primary"]').attr("scheme-guid");
				var url = portList.showLpBillExcel + schemeGuid + "/" + infor.acctCode;
				var excelData = new FormData($('#excelFileFrom')[0]);
				if (msgTxt) {
					if (parseInt($("#end-line").val()) > parseInt($("#start-line").val()) && parseInt($("#end-line").val()) < 20) {
						var endLineVal = parseInt($("#end-line").val());
					} else {
						var endLineVal = parseInt($("#start-line").val()) ? parseInt($("#start-line").val()) + 19 : 20;
					}
					excelData.set("endLine", endLineVal);
				} else {
					excelData.set("endLine", parseInt($("#end-line").val()));
				}
				var menuid = $.getUrlParam('menuid');
				$.ajax({
					url: url,
					type: 'POST',
					cache: false,
					data: excelData,
					processData: false,
					contentType: false,
					beforeSend: function(xhr) {
						xhr.setRequestHeader("x-function-id",menuid);
					},
				}).done(function(res) {
					ufma.hideloading();
					if(res.flag === "success") {
						var data = res.data;
						msgTxt = data.fileBaseMsg[data.sheetCode - 1].msg;
						var tableSource = [];
						if(data) {
							tableSource = data.lpBizBillLists;
						} else {
							tableSource = [];
						}
						page.tableObj.destroy();
						$('#showTable2').empty();
						page.initTable("showTable2", tableSource, page.bankColArr);
					} else {
						ufma.showTip(res.msg, function() {}, "error");
					}

				}).fail(function(res) {

				});
			},
			//请求预览excel
			reqPreExcel: function(type, sheetIndex) {
				var file = $("#excelFile").val();
				if(file != "") {
					var menuid = $.getUrlParam('menuid');
					$.ajax({
						url: portList.getBillFileBaseMsg,
						type: 'POST',
						cache: false,
						data: new FormData($('#excelFileFrom')[0]),
						processData: false,
						contentType: false,
						beforeSend: function(xhr) {
							xhr.setRequestHeader("x-function-id",menuid);
						}
					}).done(function(res) {
						var data = res.data;
						reqPreExcelMsg = data;
						msgTxt = sheetIndex ? res.data[sheetIndex].msg : res.data[0].msg;
						if(type == "file" || type == "method") {
							$("#sheetList").getObj().load(data);
							$("#sheetList").getObj().setValue(data.sheetCode, data.sheetName);
							$("#sheetCode").val(data.sheetCode);
							$("#sheetName").val(data.sheetName);
							
							var line1 = data[0];
							$("#sheetList").getObj().val(line1.sheetCode.toString());
							$("#start-line").val(line1.minRow);
							$("#end-line").val(line1.maxRow);
							$("#excelFileFrom #sheetCode").val(line1.sheetCode);
							$("#excelFileFrom #sheetName").val(line1.sheetName);
							$("#excelFileFrom #colStart").val(line1.minRow);
							$("#excelFileFrom #colEnd").val(line1.maxRow);
							//CWYXM-18712 会计平台->凭证生成导入报错->取数，导入exccel文件数据报错 guohx 增加参数 maxColumn 20200811
							$("#excelFileFrom #maxColumn").val(line1.maxColumn);
						}
						page.showExcelData();
					}).fail(function(res) {

					});
				}
			},

			//请求预览xml
			reqXmlData: function(type) {
				var file = $("#xmlFile").val();
				var schemeGuid = $('#source-btn button[class="btn btn-primary"]').attr("scheme-guid");
				var dataSrcType = infor.item.dataSrcType;
				var url = portList.importXmlBill + schemeGuid + "/" + dataSrcType + "/" + infor.acctCode;
				if(file != "") {
					var menuid = $.getUrlParam('menuid');
					$.ajax({
						url: url,
						type: 'POST',
						cache: false,
						data: new FormData($('#xmlFileFrom')[0]),
						processData: false,
						contentType: false,
						beforeSend: function(xhr) {
							xhr.setRequestHeader("x-function-id",menuid);
						},
					}).done(function(res) {
						ufma.hideloading();
						if(res.flag === "success") {
							ufma.showTip(res.msg, function() {
								_close("save");
							}, "success");
						} else {
							$(".btn-import").attr("disabled", false);
							ufma.showTip(res.msg, function() {}, "error");
						}
					}).fail(function(res) {

					});
				}
			},
			//展示预览xml
			showXMlData: function() {
				ufma.showloading();
				var schemeGuid = $('#source-btn button[class="btn btn-primary"]').attr("scheme-guid");
				var url = portList.showLpBillXml + schemeGuid + "/" + infor.acctCode;
				var menuid = $.getUrlParam('menuid');
				$.ajax({
					url: url,
					type: 'POST',
					cache: false,
					data: new FormData($('#xmlFileFrom')[0]),
					processData: false,
					contentType: false,
					beforeSend: function(xhr) {
						xhr.setRequestHeader("x-function-id",menuid);
					},
				}).done(function(res) {
					ufma.hideloading();
					if(res.flag === "success") {
						var data = res.data;
						var tableSource = [];
						if(data) {
							tableSource = data;
						} else {
							tableSource = [];
						}
						page.tableObj.destroy();
						$('#showTable2').empty();
						page.initTable("showTable2", tableSource, page.bankColArr);
					} else {
						ufma.showTip(res.msg, function() {}, "error");
					}

				}).fail(function(res) {

				});
			},
			//加载数据行的值集
			reqLineArr: function(obj) {
				var lineArr = [];
				for(var i = obj.minRow; i < obj.maxRow; i++) {
					var lineObj = {
						id: i,
						name: i
					};
					lineArr.push(lineObj);
				}
				$("#startList").ufCombox({
					data: lineArr,
					onComplete: function(sender) {
						if(lineArr.length > 0) {
							sender.getObj().val(lineArr[0].id);
							$("#colStart").val(lineArr[0].id);
						}
					}
				});
				$("#endList").ufCombox({
					data: lineArr,
					onComplete: function(sender) {
						if(lineArr.length > 0) {
							sender.getObj().val(lineArr[lineArr.length - 1].id);
							$("#colEnd").val(lineArr[lineArr.length - 1].id);
						}
					}
				});
			},
			//转驼峰
			toHump: function(str) {
				var arr = str.split("_");
				var resStr = arr[0].toLowerCase();
				for(var i = 1; i < arr.length; i++) {
					resStr += arr[i].substring(0, 1).toUpperCase() + arr[i].substring(1, arr[i].length).toLowerCase();
				}
				return resStr;
			},
			checkLines: function() {
				var valueStart = $("#start-line").val();
				var valueEnd = $("#end-line").val();
				var reg = /^[1-9]\d*$|^0$/; // 注意：故意限制了 0321 这种格式，如不需要，直接reg=/^\d+$/;
				if(valueStart != "") {
					if(reg.test(valueStart) != true) {
						ufma.showTip("开始行请填写数字，且不能是负值", function() {}, "warning");
						return false;
					}
				}
				if(valueEnd != "") {
					if(reg.test(valueEnd) == true) {
						if(parseInt(valueStart) > parseInt(valueEnd)) {
							ufma.showTip("开始行必须小于结束行", function() {}, "warning");
							return false;
						}
					} else {
						ufma.showTip("结束行请填写数字，且不能是负值", function() {}, "warning");
						return false;
					}
				}
				return true;
			},
			//请求表头信息
			getTableHeadName: function(schemeGuid) {
				var tabArgu = {
					schemeGuid: schemeGuid
				};
				ufma.post(portList.getTableHeadName, tabArgu, function(result) {
					page.reconHead(result.data);
					page.tableObj.destroy();
					$('#showTable2').empty();
					page.initTable('showTable2', [], page.bankColArr);
					if($(".file-upload-title span").text() !== "") {
						setTimeout(function() {
							page.showExcelData();
							page.showXMlData();
						}, 300)
					}

				});
			},
			//整理表头信息
			reconHead: function(tableHeadName) {
				page.bankColArr = [];
				for(var i = 0; i < tableHeadName.length; i++) {
					if(page.hasStr(tableHeadName[i].lpField, "AMT")) {
						var obj = {
							title: tableHeadName[i].itemName,
							data: page.toHump(tableHeadName[i].lpField),
							className: 'nowrap',
							render: function(data, type, rowdata, meta) {
								if(!data || data == "0.00" || data == 0) {
									return "";
								}
								return '<div style="text-align: right">' + $.formatMoney(data, 2); + '</div>';
							}
						};
						page.bankColArr.push(obj);
					} else {
						var obj = {
							title: tableHeadName[i].itemName,
							data: page.toHump(tableHeadName[i].lpField),
							className: 'nowrap'
						};
						page.bankColArr.push(obj);
					}

				}
			},
			hasStr: function(str, hasStr) {
				if(str != null) {
					return str.indexOf(hasStr) >= 0;
				} else {
					return false;
				}
			},

			//此方法必须保留
			init: function() {
				page.urlArgu = "?ajax=1";
				ufma.parse();
				//权限控制
				page.reslist = ufma.getPermission();
				ufma.isShow(page.reslist);

				if(page.bank != null) {
					$("label[for='bank']").text(page.bank);
					$("input[name='bank']").val(page.bankCode);
				}
				if(page.bankAccount != null) {
					$("label[for='bankAccount']").text(page.bankAccount);
					$("input[name='bankAccount']").val(page.bankAccount);
				}
				page.reconHead(tableHeadName);
				// if(page.bankColArr.length == 0){
				//     page.bankColArr = [
				//         {title: "序号", data: "isBalanceAccName"}
				//     ]
				// }
				page.initTable("showTable2", [], page.bankColArr);

				//初始化工作列表
				$("#sheetList").ufCombox({
					idField: "sheetCode",
					textField: "sheetName",
					placeholder: "请选择工作表",
					onChange: function(sender, data) {
						$("#sheetCode").val(data.sheetCode);
						$("#sheetName").val(data.sheetName);
						$("#start-line").val(data.minRow);
						$("#end-line").val(data.maxRow);
						$("#excelFileFrom #sheetCode").val(data.sheetCode);
						$("#excelFileFrom #sheetName").val(data.sheetName);
						$("#excelFileFrom #maxColumn").val(data.maxColumn);
						$("#excelFileFrom #colStart").val(data.minRow);
						$("#excelFileFrom #colEnd").val(data.maxRow);
						if (!isFirst) {
							msgTxt = data.sheetCode - 1 ? reqPreExcelMsg[data.sheetCode - 1].msg : reqPreExcelMsg[0].msg;
							$("#msgTxt").html(msgTxt);
							page.showExcelData();
						}
						isFirst = false;
					}
				});
				$(".uf-combox-input").attr("autocomplete", "off");
				//初始化开始数据行
				$("#startList").ufCombox({
					idField: "id",
					textField: "name",
					placeholder: "请选择",
					onChange: function(sender, data) {
						$("#colStart").val(data.id);
						page.reqPreExcel("line");
					}
				});
				//初始化结束数据行
				$("#endList").ufCombox({
					idField: "id",
					textField: "name",
					placeholder: "请选择",
					onChange: function(sender, data) {
						$("#colEnd").val(data.id);
						page.reqPreExcel("line");
					}
				});

				//初始化导入方案列表
				$("#formatList").ufCombox({
					idField: "impScheGuid",
					textField: "impScheName",
					placeholder: "请选择数据格式方案",
					onChange: function(sender, data) {
						$("#impScheGuid").val(data.impScheGuid);
						$("#editStartLine,#colIndex").val(data.startLine);
						page.reqPreText();
					}
				});
				$("#formatList2").ufCombox({
					idField: "impScheGuid",
					textField: "impScheName",
					placeholder: "请选择数据格式方案",
					onChange: function(sender, data) {
						$("#impScheGuid2").val(data.impScheGuid);
						$("#colStart").val(data.startLine);
						page.reqPreExcel("method");
					}
				});
				page.onEventListener();
				// ufma.parseScroll();
			},
			onEventListener: function() {
				//行输入
				$("#start-line").on("change", function() {
					$("#colStart").val($(this).val());
					if(page.checkLines()) { //行数校验
						page.showExcelData();
					}

				});
				$("#end-line").on("change", function() {
					$("#colEnd").val($(this).val());
					if(page.checkLines()) { //行数校验
						page.showExcelData();
					}
				});
				//取消导入的模态框
				$('#importExcel .btn-close').on('click', function() {
					_close("close", {});
				});

				//只能输入数字
				$("#editStartLine").on("keyup", function() {
					$(this).val($(this).val().replace(/[^\d]/g, ''));
				});

				//切换文本文件、Excel
				$(".radio-title label").each(function(i) {
					$(this).on("click", function() {
						$(".uf-dashed-hr").show();
						$(this).find("input").prop("checked", true);
						$(this).siblings().find("input").removeAttr("checked");
						$(".radio-body" + (i + 1)).show().siblings().hide();
						$(".showBox" + (i + 1)).show().siblings().hide();
					});
				});

				fileClickIndex = 0;
				tmpDom = null;
				$(".file-upload-box-btn").on("click", ".file-upload-input", function() {
				 fileClickIndex = 0;
				 tmpDom = $("#excelFile").clone(true);
				});

				//选择上传文件
				$(".file-upload-box-btn").on("change", ".file-upload-input", function() {
					if (fileClickIndex == 0) {
						fileClickIndex = 1;
						if ($(this).val().length == 0) {
							$("#excelFile").remove();
							$("#impScheGuid2").after(tmpDom);
						}
					}else{
						fileClickIndex = 0;
					}

					var oldFile = $(".file-upload-title span").text();
					// var filePath = $(this).val();
					var filePath = this.files.length > 0 ? this.files[0].name : oldFile;
					var $box = $(this).parents(".file-upload-box");
					if(this.files.length > 0) {
						$box.find(".file-upload-tip").hide();
						$box.find(".file-upload-title").show().find("span").text(filePath);
					} else {
						if(oldFile != "") {
							$box.find(".file-upload-tip").hide();
							$box.find(".file-upload-title").show().find("span").text(oldFile);
						} else {
							$box.find(".file-upload-tip").show();
							$box.find(".file-upload-input").hide().find("span").text(filePath);
						}
					}
				});
				//删除文件
				$(".file-upload-title .icon-close").on("click", function() {
					var $box = $(this).parents(".file-upload-box");
					$box.find(".file-upload-tip").show();
					$box.find(".file-upload-title").hide().find("span").text("");
					$box.find(".file-upload-input").val("");
				});

				//打开设置导入方案页面
				// $(".showSet").on("click", function() {
				// 	var impType = $("input[name='impType']:checked").val();
				// 	var impScheGuid = "";
				// 	if(impType == "1") { //文本
				// 		impScheGuid = $("#formatList").getObj().getValue();
				// 	} else if(impType == "2") { //excel
				// 		var file = prevFile;
				// 		if(file != "") {
				// 			impScheGuid = $("#formatList2").getObj().getValue();
				// 		} else {
				// 			ufma.showTip("请先选择excel文件！", function() {}, "warning");
				// 			return false;
				// 		}
				// 	}
				// 	page.openDataSet(impType, impScheGuid);
				// });

				//选择文本文件
				$("#textFile").on("change", function() {
					page.reqPreText();
				});

				//选择excel文件
				$("#excelFile").on("change", function(file) {
					var file = $(this).val() || prevFile;
					page.reqPreExcel("file");
					prevFile = file;
					isFirst = true;
				});
				//选择xml文件
				$("#xmlFile").on("change", function() {
					page.showXMlData();
				});

				//改变文本起始行
				$("#editStartLine").on("change", function() {
					var num = $(this).val();
					if(num != "") {
						page.reqPreText();
					}
				});

				//导入文件
				$(".btn-import").on("click", function() {
					var impType = "2";
					if(impType == "1") { //文本
						var textFile = $("#textFile").val();
						if($.isNull(textFile)) {
							ufma.showTip("请选择要导入的文本文件！", function() {}, "warning");
							return false;
						}
						var menuid = $.getUrlParam('menuid');
						$.ajax({
							url: portList.impTxt + page.urlArgu,
							type: 'POST',
							cache: false,
							data: new FormData($('#textFileFrom')[0]),
							processData: false,
							contentType: false,
							beforeSend: function(xhr) {
								xhr.setRequestHeader("x-function-id",menuid);
							},
						}).done(function(res) {
							//                        	console.info(res);
							if(res.flag == "success") {
								ufma.showTip("导入成功！", function() {
									_close("import", res.data);
								}, "success");
							} else {
								ufma.showTip(res.msg, function() {}, "error");
							}
						}).fail(function(res) {
							ufma.showTip(res.msg, function() {}, "error");
						});

					} else if(impType == "2") { //excel
						//点击后置为不能点击，传入成功或失败后再置为可点击，以防多次导入
						$(this).attr("disabled", true);
						if(infor.item.dataSrcType == '06') {
							page.reqXmlData();
						} else {
							var excelFile = prevFile;
							if($.isNull(excelFile)) {
								ufma.showTip("请选择要导入的Excel文件！", function() {}, "warning");
								return false;
							}

							if(page.checkLines()) { //行数校验
								var schemeGuid = $('#source-btn button[class="btn btn-primary"]').attr("scheme-guid");
								ufma.showloading('正在导入数据，请耐心等待...');
								console.log(new FormData($('#excelFileFrom')[0]));
								function rand(min, max) {
									return Math.floor(Math.random() * (max - min)) + min;
								}
								var seed = Date.parse(new Date()) + rand(1000, 9999);
								$("#seed").val(seed);
								var menuid = $.getUrlParam('menuid');
								$.ajax({
									url: portList.importBillData + schemeGuid + "/" + infor.item.dataSrcType + "/" + infor.acctCode,
									type: 'POST',
									cache: false,
									data: new FormData($('#excelFileFrom')[0]),
									processData: false,
									contentType: false,
									beforeSend: function(xhr) {
										xhr.setRequestHeader("x-function-id",menuid);
									},
								}).done(function(res) {
									ufma.hideloading();
									if(res.flag === "success") {

										ufma.showTip("导入成功！", function() {
											_close("save");
										}, "success");
									} else {
										$(".btn-import").attr("disabled", false);
										if (res.msg) {
											ufma.showTip(res.msg, function() {}, "error");
										}
									}
								}).fail(function(res) {
									$(".btn-import").attr("disabled", false);
									if (res.status === 504) { // 请求超时
										var returnFlag = false;
										var controlImportExcel = function () {
											var newUrl = portList.controlImportExcel;
											var tarArgu = {};
											tarArgu.seed = seed;
											ufma.ajax(newUrl, 'post', tarArgu, function (result) {
												if(result.flag === "success" && result.data !== '') {
													returnFlag = true;
													ufma.showTip("导入成功！", function() {
														_close("save");
													}, "success");
												} else {
													$(".btn-import").attr("disabled", false);
													if (result.msg) {
														ufma.showTip(result.msg, function() {}, "error");
													}
												}
											});
										}
										controlImportExcel();
										timeFn = setInterval(function(){
											if(!returnFlag) { // 第二个没返回
												controlImportExcel();
											} else {
												clearInterval(timeFn);
											}
										}, 20 * 1000);
									}
								});
							}

						}

					}
				});

				//点击来源子系统切换
				$("#source-btn").on("click", "button", function() {
					if(!$(this).hasClass("btn-primary")) {
						$("#lp-btns-list").hide();
						$(this).attr("class", "btn btn-primary").siblings("button").attr("class", "btn btn-default");
						$(this).siblings("#lp-btns-list").find("button").attr("class", "btn btn-default");
						var schemeGuid = $(this).attr("scheme-guid");
						page.getTableHeadName(schemeGuid);
					}
				});
				//点击来源子系统切换
				$(document).on("click", "#lp-btns-list button", function(e) {
					e.stopPropagation();
					$(this).attr("class", "btn btn-primary").siblings("button").attr("class", "btn btn-default");
					$(this).parent().siblings("button").attr("class", "btn btn-default");
					$("#lp-btns-list").show();
					var schemeGuid = $(this).attr("scheme-guid");
					page.getTableHeadName(schemeGuid);
				});
				//显示隐藏的来源子系统
				$(document).on("click", ".lp-rest-sign", function(e) {
					e.stopPropagation();
					$("#lp-btns-list").show();
				});
				//点击空白处，设置的弹框消失
				$(document).bind("click", function(e) {
					$("#lp-btns-list").hide();
				});

			}
		}
	}();
	page.init();
	$("input").attr("autocomplete", "off");
});