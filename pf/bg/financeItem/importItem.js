$(function() {
	window._close = function() {
		window.closeOwner(page.importData);
    };
	var ptData = {};
  var rowTableData = {};
  var menuid = $.getUrlParam('menuid');
	var page = function() {
		return {
			//初始化页面
			initPage: function() {
				$("#czPlan").html(window.ownerData.DWPlanData.chrName);
				$("#impModal").html(window.ownerData.DWPlanData.chrName + "导入模板下载");
				page.initGrid([]);
			},
			getColumns: function() {
				var columns = [];
				columns = [{
						title: "财政指标编码",
						width: 100,
						data: "bgItemParentcode",
						className: 'nowrap isprint'
					},
					{
						title: "指标编码",
						width: 100,
						data: "bgItemCode",
						className: 'nowrap isprint'
					},
					{
						title: '摘要',
						width: 200,
						data: "bgItemSummary",
						className: 'nowrap isprint'
					}
				];
				if(!$.isNull(window.ownerData.DWPlanData)) {
					if(window.ownerData.DWPlanData.isComeDocNum == "是") {
						columns.push({
							title: "来文文号",
							width: 200,
							data: "comeDocNum",
							className: 'nowrap isprint'
						});
					}
					if(window.ownerData.DWPlanData.isSendDocNum == "是") {
						columns.push({
							title: page.sendCloName,
							width: 200,
							data: "sendDocNum",
							className: 'nowrap isprint'
						});
          }
          if(window.ownerData.DWPlanData.isFinancialBudget == "1") {
						columns.push({
							title: '财政指标ID',
							width: 200,
							data: "bgItemIdMx",
							className: 'nowrap isprint'
						});
					}
					for(var i = 0; i < window.ownerData.DWPlanData.planVo_Items.length; i++) {
						var item = window.ownerData.DWPlanData.planVo_Items[i];
						var cbItem = item.eleCode;
						if(cbItem != 'ISUPBUDGET') {
							columns.push({
								data: page.shortLineToTF(item.eleFieldName) + 'Name',
								title: item.eleName,
								width: 240,
								className: 'nowrap isprint',
								"render": function(data, type, rowdata, meta) {
									if(!$.isNull(data)) {
										return '<span title="' + data + '">' + data + '</span>';
									} else {
										return '';
									}
								}
							});
						} else {
							columns.push({
								data: 'isUpBudget',
								title: "是否采购",
								// width: 120,
								className: 'nowrap isprint tc',
								"render": function(data, type, rowdata, meta) {
									if(data == '1') {
										return data = "是 ";
									} else if(data == '0') {
										return data = "否 ";
									}else{
										return data;
									}
								}
							});
						}
          };
          //CWYXM-18080 编制指标时需要增加文本说明项，只录入文本，用于描述指标信息--zsj
          for (var k = 0; k < window.ownerData.DWPlanData.length; k++) {
            var textCode =  bg.shortLineToTF(window.ownerData.DWPlanData[k].eleFieldName)
            columns.push({
              data: textCode,
              title: window.ownerData.DWPlanData[k].eleName,
              className: 'nowrap',
              width: 200,
              "render": function (data, type, rowdata, meta) {
                if (!$.isNull(data)) {
                  return '<span title="' + data + '">' + data + '</span>';
                } else {
                  return '';
                }
              }
            });
          }
				}
				columns.push({
					title: "金额",
					width: 100,
					data: "bgItemCur",
					className: 'nowrap tr isprint tdNum',
					render: $.fn.dataTable.render.number(',', '.', 2, ''),
					render: function(data, type, rowdata, meta) {
						var val = $.formatMoney(data);
						return val == 0 ? '' : val;
					}
				});
				columns.push({
					title: "导入结果",
					width: 100,
					data: "desc",
					className: 'nowrap isprint'
				});
				return columns;
			},
			initGrid: function(data) {
				var columns = page.getColumns();
				oTable = $("#gridGOV").dataTable({
					"language": {
						"url": bootPath + "agla-trd/datatables/datatable.default.js"
					},
					"autoWidth": false,
					"bPaginate": false,
					"bDestory": true,
					"processing": true, //显示正在加载中
					"serverSide": false,
					"ordering": false,
					"pagingType": "full_numbers", //分页样式
					"columns": columns,
					"scrollY": 330,
					//填充表格数据
					data: data,
					"dom": 'rt<ilp>',
					initComplete: function(settings, json) {
						if($.isEmptyObject(rowTableData)) {
							$('.uf-rpt-table.ufma-table.dataTable tr td:last-child, .uf-rpt-table.ufma-table.dataTable tr th:last-child').css({
								"border-bottom": "1px solid transparent"
							});
						} else {
							$('.uf-rpt-table.ufma-table.dataTable tr td:last-child, .uf-rpt-table.ufma-table.dataTable tr th:last-child').css({
								"border-bottom": "1px solid #D9D9D9"
							});
						}
						/*$('#gridGOV').closest('.dataTables_wrapper').ufScrollBar({
							hScrollbar: true,
							mousewheel: false
						});*/
						var layoutH = $('.ufma-layout-up').height();
						var margin = layoutH - 50 - 40 - 45 - 5;
						$('.dataTables_scrollBody').css("height", margin + "px");
						//$('#gridGOV_wrapper').css("border-right", "1px solid #d9d9d9");
						var top = margin + 28;
						$('.slider').css("top", top + "px");
						$(".checkAll-three").prop("checked", false);
						$(".checkAll-three").on('change', function() {});
						$('#gridGOV').fixedTableHead();
						ufma.setBarPos($(window));
					},
					"drawCallback": function() {
						$('#gridGOV').find("td.dataTables_empty").text("")
							.append('<img src="' + bootPath + 'images/noData.png"/><br/><i>目前还没有你要查询的数据</i>');

						$("#check-head").prop('checked', false);
						$("#all").prop('checked', false);
						/*if(rowTableData && rowTableData.length == 0) {
							$('.uf-rpt-table.ufma-table.dataTable tr:last-child td').css({
								"border-bottom": "1px solid transparent"
							});
						} else {
							$('.uf-rpt-table.ufma-table.dataTable tr:last-child td').css({
								"border-bottom": "1px solid #D9D9D9"
							});
						}*/
						//ufma.setBarPos($(window));
						var wrapperWidth = $('#gridGOV_wrapper').width();
						var tableWidth = $('#gridGOV').width();
						if(tableWidth > wrapperWidth) {
							$('#gridGOV').closest('.dataTables_wrapper').ufScrollBar({
								hScrollbar: true,
								mousewheel: false
							});
							ufma.setBarPos($(window));
							$('.dataTables_wrapper.no-footer .dataTables_scrollBody').css({
								"border-bottom": "1px solid transparent",
								"border-left": "1px solid #d9d9d9"
							});
						} else {
							$('#gridGOV').closest('.dataTables_wrapper').ufScrollBar('destroy');
							$('.dataTables_wrapper.no-footer .dataTables_scrollBody').css({
								"border-bottom": "1px solid transparent"
							});
						}
						if($.isEmptyObject(rowTableData)) {
							$('.uf-rpt-table.ufma-table.dataTable tr:last-child td').css({
								"border-bottom": "1px solid transparent"
							});
						} else {
							$('.uf-rpt-table.ufma-table.dataTable tr:last-child td').css({
								"border-bottom": "1px solid #D9D9D9"
							});
						}
					}
				});
			},
			importItems: function() {
				if(!$.isNull(rowTableData)) {
					var url = dm.getCtrl("insertAgencyItems") + "?agencyCode=" + window.ownerData.agencyCode +
						"&setYear=" + window.ownerData.setYear + "&rgCode=" + window.ownerData.rgCode + "&bgPlanId=" + window.ownerData.DWPlanData.chrId;
					ufma.showloading('正在导入，请耐心等待...');
					for(var i = 0; i < rowTableData.length; i++) {
						if(rowTableData[i].isUpBudget == '是') {
							rowTableData[i].isUpBudget = '1';
						} else if(rowTableData[i].isUpBudget == '否') {
							rowTableData[i].isUpBudget = '0';
						}
					}
					var argu = {
						"items": rowTableData
					}
					ufma.post(url, argu, function(result) {
						if(result.flag == "success") {
							ufma.showTip(result.msg, function() {
								ufma.hideloading();
								$("#gridGOV").DataTable().clear().destroy();
                                page.initGrid(result.data.items);
                                //CWYXM-16224 --财政指标,如果导入的指标id和财政指标ID不一致也能导入成功,但是新增的单位指标的指标id就和导入的一样了--zsj--导入的数据追加到后面
                                page.importData = [];
                                for(var i = 0;i < result.data.items.length; i++){
                                    if(result.data.items[i].desc == '导入成功'){
                                      page.importData.push(result.data.items[i])
                                    }
                                }
								$("#btnImport").attr("disabled", false);
							}, "success")
						} else {
							ufma.showTip(result.msg, function() {
								ufma.hideloading();
                                page.initGrid([]);
                                page.importData = [];
								$("#btnImport").attr("disabled", false);
							}, "error")
						}

					})
				} else {
					ufma.showTip('可导入数据为空,请先选择文件！', function() {}, 'warning');
					return false;
				}
			},
			//转换为驼峰
			shortLineToTF: function(str) {
				var arr = str.split("_");
				for(var i = 0; i < arr.length; i++) {
					arr[i] = arr[i].toLowerCase()
				}
				for(var i = 1; i < arr.length; i++) {
					arr[i] = arr[i].toLowerCase()
					arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].substring(1);
				}
				return arr.join("");
			},
			//请求预览excel
			reqPreExcel: function() {
				var file = $("#excelFile").val();
				if(file == "") return false;

				function showInfo(res) {
					rowTableData = res.data;
					$("#gridGOV").DataTable().clear().destroy();
					var timeId = setTimeout(function() {
						clearTimeout(timeId);
						page.initGrid(rowTableData);
					}, 300);
        }
        // 修改85平台问题--zsj
				$.ajax({
					url: dm.getCtrl("importAgencyItems") + "?agencyCode=" + window.ownerData.agencyCode +
						"&setYear=" + window.ownerData.setYear + "&rgCode=" + window.ownerData.rgCode + "&bgPlanId=" + window.ownerData.DWPlanData.chrId + "&financeBudgetPlanId=" + window.ownerData.financeBudgetPlanId,
					type: 'POST',
					cache: false,
					data: new FormData($('#excelFileFrom')[0]),
					processData: false,
          contentType: false,
          beforeSend: function(xhr) {
            xhr.setRequestHeader("x-function-id",menuid);
          }
				}).done(function(res) {
					readData = res;
					if(readData.flag == "success") {
						showInfo(readData);
					} else {
						ufma.showTip(readData.msg, function() {}, "error");
					}

				}).fail(function(res) {
					ufma.showTip("导入失败！", function() {}, "error");
				});

			},
			//导入模板下载--zsj
			exportBudgetplan: function() { //导出
        var url = '/bg/Plan/budgetPlan/expPlan';
        /**CWYXM-184070---财政指标界面导入单位指标时，可以不填写与父指标相同的要素，导入模版中不显示对应的列--zsj
         * 1. 选项名
          导入模板不显示财政指标要素
          参数： isImportTempFileShowFinanceBgEles :  1 显示  0 不显示
          2. 需要多穿一个财政预算方案id参数。 
          financeBudgetPlanId： 财政预算方案ID
          取参为：
         */
        var isImportTempFileShowFinanceBgEles = 0
				if ($('#isImportTempFileShowFinanceBgEles').is(':checked')) {
					isImportTempFileShowFinanceBgEles = 1;
				} else {
					isImportTempFileShowFinanceBgEles = 0;
				}
				var argu = {
					"bgPlanChrId": window.ownerData.DWPlanData.chrId,
					"agencyCode": window.ownerData.agencyCode,
					"agencyName": window.ownerData.agencyName,
					"setYear": window.ownerData.setYear,
          "needParentcode": "1",
          'isImportTempFileShowFinanceBgEles': isImportTempFileShowFinanceBgEles,
          'financeBudgetPlanId': window.ownerData.financeBudgetPlanId
				};
				var chrId = window.ownerData.DWPlanData.chrId;
				var agencyCode = window.ownerData.agencyCode;
        var setYear = window.ownerData.setYear;
        var financeBudgetPlanId = window.ownerData.financeBudgetPlanId;
				window.location.href = url + "?bgPlanChrId=" + chrId + "&agencyCode=" + agencyCode + "&setYear=" + setYear+ "&needParentcode=1&isImportTempFileShowFinanceBgEles="+ isImportTempFileShowFinanceBgEles+ "&financeBudgetPlanId=" + financeBudgetPlanId;
			},
			onEventListener: function() {
				$('#btnImport').on('click', function() {
					$("#btnImport").attr("disabled", true);
					page.importItems();
					var timeId = setTimeout(function() {
						$("#btnImport").attr("disabled", false);
						clearTimeout(timeId);
					}, 5000);
				})
				$('#btnClose').on('click', function() {
					_close()
				});
				$('#impModal').on('click', function() {
					page.exportBudgetplan();
				});
				$('#queryTable').on('click', function() {
					if($('#startDate').getObj().getValue() > $('#endDate').getObj().getValue()) {
						ufma.showTip('开始日期不能大于结束日期！', function() {}, 'warning');
						return false;
					}
					page.loadZWdata();
				});
				//选择上传文件
				$(".file-upload-box-btn").on("change", ".file-upload-input", function() {
					var oldFile = $(".file-upload-title span").text();
					// var filePath = $(this).val();
					var filePath = this.files[0].name;
					var $box = $(this).parents(".radio-title");
					if(filePath != "") {
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
					var $box = $(this).parents(".radio-title");
					$box.find(".file-upload-tip").show();
					$box.find(".file-upload-title").hide().find("span").text("");
					$box.find(".file-upload-input").val("");
				});
				//选择excel文件
				$("#excelFile").on("change", function() {
					page.reqPreExcel();
				});

				//导入文件
				$(".btn-import").on("click", function() {
					var excelFile = $("#excelFile").val();
					if($.isNull(excelFile)) {
						ufma.showTip("请选择要导入的Excel文件！", function() {}, "warning");
						return false;
					}

					var formatVal2 = $("#formatList").getObj().getValue();
					if($.isNull(formatVal2)) {
						ufma.showTip("请选择导入方案！", function() {}, "warning");
						return false;
					}
					ufma.showloading('正在加载数据请耐心等待...')
					var impScheGuid = $("#formatList").getObj().getValue();
					$.ajax({
						url: portList.impExcel + page.urlArgu,
						type: 'POST',
						cache: false,
						data: {},
						processData: false,
            contentType: false,
            beforeSend: function(xhr) {
              xhr.setRequestHeader("x-function-id",menuid);
            }
					}).done(function(res) {
						ufma.hideloading();
						if(res.flag == "success") {
							ufma.showTip(res.msg, function() {
								_close("import", res.data);
							}, "success");
						} else {
							ufma.showTip(res.msg, function() {
								$("#gridGOV").DataTable().clear().destroy();
								page.initGrid(data);
							}, "error");
						}
					}).fail(function(res) {
						ufma.hideloading();
						if(res.flag == "fail") {
							$("#gridGOV").DataTable().clear().destroy();
							page.initGrid(data);
						}
						ufma.showTip(res.msg, function() {}, "error");
					});
				});
			},

			//此方法必须保留
			init: function() {
				//权限控制
				page.reslist = ufma.getPermission();
				ufma.isShow(page.reslist);
                page.needSendDocNum = window.ownerData.needSendDocNum;
                page.importData = [];
				if(page.needSendDocNum == true) {
					page.sendCloName = "指标id";
				} else {
					page.sendCloName = "发文文号";
				}
				this.initPage();
				this.onEventListener();
				ptData = ufma.getCommonData();
				page.setYear = parseInt(ptData.svSetYear); //本年 年度
				ufma.parseScroll();
				ufma.parse();
			}
		}
	}();

	/////////////////////
	page.init();
});