$(function() {
	var action = false;
	window._close = function() {
		if(window.closeOwner) {
			window.closeOwner(action);
		}
	};
	var infor = JSON.parse(window.sessionStorage.getItem("dataSourceModelInfor"));
	var oTableContent, oTableResult;
	var pageData = window.ownerData;
	var page = function() {
		var portList = {
			impExcel: "/ma/general/excel/impEleDatas?eleCode=" + ownerData.eleCode + '&rgCode=' + ownerData.rgCode + '&agencyCode=' + ownerData.agencyCode + '&setYear=' + ownerData.setYear //导入excel文件
		};

		return {
			initContentTable: function(data) {
				if(oTableContent) {
					oTableContent.fnDestroy();
				}
				var tblId = 'importContent';
				$("#" + tblId).html(''); //清空原有表格
				var columns = [{
					//data: "agencyCodeName",
					data: "单位编码",
					title: "单位",
					className: "tc nowrap commonShow",
					width: 100,
					render: function(data, type, rowdata, meta) {
						if(!$.isNull(data)) {
							return '<span title="' + data + '">' + data + '</span>';
						} else {
							return '';
						}
					}
				}, {
					//data: "chrCode",
					data: "账套编码",
					title: "账套编码",
					className: "tc nowrap commonShow",
					width: 100,
					render: function(data, type, rowdata, meta) {
						if(!$.isNull(data)) {
							return '<span title="' + data + '">' + data + '</span>';
						} else {
							return '';
						}
					}
				}, {
					//data: "chrName",
					data: "账套名称",
					title: "账套名称",
					className: "tc nowrap commonShow",
					width: 100,
					render: function(data, type, rowdata, meta) {
						if(!$.isNull(data)) {
							return '<span title="' + data + '">' + data + '</span>';
						} else {
							return '';
						}
					}
				}, {
					//data: "fiLeader",
					data: "财务负责人",
					title: "财务负责人",
					className: "tc nowrap commonShow",
					width: 100,
					render: function(data, type, rowdata, meta) {
						if(!$.isNull(data)) {
							return '<span title="' + data + '">' + data + '</span>';
						} else {
							return '';
						}
					}
				}, {
					//data: "taxpayerTypeCodeName",
					data: "纳税人类型编码",
					title: "纳税人类型",
					className: "tc nowrap commonShow",
					width: 100,
					render: function(data, type, rowdata, meta) {
						if(!$.isNull(data)) {
							return '<span title="' + data + '">' + data + '</span>';
						} else {
							return '';
						}
					}
				}, {
					//data: "accsCodeName",
					data: "科目体系编码",
					title: "科目体系",
					className: "tc nowrap commonShow",
					width: 100,
					render: function(data, type, rowdata, meta) {
						if(!$.isNull(data)) {
							return '<span title="' + data + '">' + data + '</span>';
						} else {
							return '';
						}
					}
				}, {
					//data: "agencyTypeCodeName",
					data: "单位类型编码",
					title: "单位类型",
					className: "tc nowrap commonShow",
					width: 100,
					render: function(data, type, rowdata, meta) {
						if(!$.isNull(data)) {
							return '<span title="' + data + '">' + data + '</span>';
						} else {
							return '';
						}
					}
				}, {
					//data: "isParallelName",
					data: "是否平行记账（1是，0否）",
					title: "平行记账",
					className: "tc nowrap commonShow",
					width: 100,
					render: function(data, type, rowdata, meta) {
						if(!$.isNull(data)) {
							return '<span title="' + data + '">' + data + '</span>';
						} else {
							return '';
						}
					}
				}, {
					//data: "isDoubleVouName",
					data: "是否双凭证（1是，0否）",
					title: "单双凭证",
					className: "tc nowrap commonShow",
					width: 100,
					render: function(data, type, rowdata, meta) {
						if(!$.isNull(data)) {
							return '<span title="' + data + '">' + data + '</span>';
						} else {
							return '';
						}
					}
				}, {
					//data: "isCashFlowAccount",
					data: "是否核算核算现金流量（1是，0否）",
					title: "核算现金流量",
					className: "tc nowrap commonShow",
					width: 100,
					render: function(data, type, rowdata, meta) {
						if(!$.isNull(data)) {
							return '<span title="' + data + '">' + data + '</span>';
						} else {
							return '';
						}
					}
				}, {
					//data: "issueAcco",
					data: "是否下发会计科目（1是，0否）",
					title: "下发科目",
					className: "tc nowrap commonShow",
					width: 100,
					render: function(data, type, rowdata, meta) {
						if(!$.isNull(data)) {
							return '<span title="' + data + '">' + data + '</span>';
						} else {
							return '';
						}
					}
				}];
				oTableContent = $("#" + tblId).dataTable({
					"language": {
						"url": bootPath + "agla-trd/datatables/datatable.default.js"
					},
					"bFilter": true,
					"autoWidth": false,
					"bDestory": true,
					"processing": true, //显示正在加载中
					"pagingType": "full_numbers", //分页样式
					"lengthChange": true, //是否允许用户自定义显示数量p
					"serverSide": false,
					"ordering": false,
					"scrollY":260,
					"paging":false,
					//"scrollX":true,
					columns: columns,
					//填充表格数据
					data: data,
					"dom": "rt", //'<"datatable-toolbar">rt<"' + tblId + '-paginate"ilp>',
					initComplete: function(settings, json) {
						$.fn.dataTable.ext.errMode = 'none';
					},
					drawCallback: function(settings) {
						$.fn.dataTable.ext.errMode = 'none';
						$('#importContent').find("td.dataTables_empty").text("")
							.append('<img src="' + bootPath + 'images/noData.png"/><br/><i>目前还没有你要查询的数据</i>');
						var wrapperWidth = $('#importContent_wrapper').width();
						var tableWidth = $('#importContent').width();
						$('.dataTables_wrapper.no-footer .dataTables_scrollBody').css("border-bottom", "1px solid transparent");
						if(!$.isNull(data) && data.length > 0) {
							$('#importContent').css("border-bottom", "1px solid #d3d3d3");
						}
					}
				})
			},
			initResultTable: function(data) {
				if(oTableResult) {
					oTableResult.fnDestroy();
				}
				var tblId = 'previewResult';
				$("#" + tblId).html(''); //清空原有表格
				var columns = [{
					data: "agencyCodeName",
					title: "单位",
					className: "tc nowrap commonShow",
					width: 100,
					render: function(data, type, rowdata, meta) {
						if(!$.isNull(data)) {
							return '<span title="' + rowdata.agencyCodeName + '">' + rowdata.agencyCodeName + '</span>';
						} else {
							return '';
						}
					}

				}, {
					data: "chrCode",
					title: "账套编码",
					className: "tc nowrap commonShow",
					width: 100,
					render: function(data, type, rowdata, meta) {
						if(!$.isNull(data)) {
							return '<span title="' + rowdata.chrCode + '">' + rowdata.chrCode + '</span>';
						} else {
							return '';
						}
					}
				}, {
					data: "chrName",
					title: "账套名称",
					className: "tc nowrap commonShow",
					width: 100,
					render: function(data, type, rowdata, meta) {
						if(!$.isNull(data)) {
							return '<span title="' + rowdata.chrName + '">' + rowdata.chrName + '</span>';
						} else {
							return '';
						}
					}
				}, {
					data: "fiLeader",
					title: "财务负责人",
					className: "tc nowrap commonShow",
					width: 100,
					render: function(data, type, rowdata, meta) {
						return '<span title="' + rowdata.fiLeader + '">' + rowdata.fiLeader + '</span>';
					}
				}, {
					data: "taxpayerTypeCodeName",
					title: "纳税人类型",
					className: "tc nowrap commonShow",
					width: 100,
					render: function(data, type, rowdata, meta) {
						if(!$.isNull(data)) {
							return '<span title="' + rowdata.taxpayerTypeCodeName + '">' + rowdata.taxpayerTypeCodeName + '</span>';
						} else {
							return '';
						}
					}
				}, {
					data: "accsCodeName",
					title: "科目体系",
					className: "tc nowrap commonShow",
					width: 100,
					render: function(data, type, rowdata, meta) {
						if(!$.isNull(data)) {
							return '<span title="' + rowdata.accsCodeName + '">' + rowdata.accsCodeName + '</span>';
						} else {
							return '';
						}
					}
				}, {
					data: "agencyTypeCodeName",
					title: "单位类型",
					className: "tc nowrap commonShow",
					width: 100,
					render: function(data, type, rowdata, meta) {
						if(!$.isNull(data)) {
							return '<span title="' + rowdata.agencyTypeCodeName + '">' + rowdata.agencyTypeCodeName + '</span>';
						} else {
							return '';
						}
					}
				}, {
					data: "isParallelName",
					title: "平行记账",
					className: "tc nowrap commonShow",
					width: 100,
					render: function(data, type, rowdata, meta) {
						if(!$.isNull(data)) {
							return '<span title="' + rowdata.isParallelName + '">' + rowdata.isParallelName + '</span>';
						} else {
							return '';
						}
					}
				}, {
					data: "isDoubleVouName",
					title: "单双凭证",
					className: "tc nowrap commonShow",
					width: 100,
					render: function(data, type, rowdata, meta) {
						if(!$.isNull(data)) {
							return '<span title="' + rowdata.isDoubleVouName + '">' + rowdata.isDoubleVouName + '</span>';
						} else {
							return '';
						}
					}
				}, {
					data: "accoCount",
					title: "科目数量",
					className: "tc nowrap commonShow",
					width: 100,
					render: function(data, type, rowdata, meta) {
						if(!$.isNull(data)) {
							return '<span title="' + rowdata.accoCount + '">' + rowdata.accoCount + '</span>';
						} else {
							return '';
						}
					}
				}, {
					data: "failMsg",
					title: page.showType,
					className: "tc nowrap commonShow",
					width: 100,
					render: function(data, type, rowdata, meta) {
						if(!$.isNull(data)) {
							return '<span title="' + rowdata.failMsg + '">' + rowdata.failMsg + '</span>';
						} else {
							return '';
						}
					}
				}];
				oTableResult = $("#" + tblId).dataTable({
					"language": {
						"url": bootPath + "agla-trd/datatables/datatable.default.js"
					},
					"bFilter": true,
					"autoWidth": false,
					"bDestory": true,
					"processing": true, //显示正在加载中
					"pagingType": "full_numbers", //分页样式
					"lengthChange": true, //是否允许用户自定义显示数量p
					"serverSide": false,
					"ordering": false,
					"paging":false,
					"scrollY": 260,
					//"scrollX": true,
					columns: columns,
					//填充表格数据
					data: data,
					"dom": "rt",
					initComplete: function(settings, json) {},
					drawCallback: function(settings) {
						$('#previewResult').find("td.dataTables_empty").text("")
							.append('<img src="' + bootPath + 'images/noData.png"/><br/><i>目前还没有你要查询的数据</i>');
						$('.dataTables_wrapper.no-footer .dataTables_scrollBody').css("border-bottom", "1px solid transparent");
						if(!$.isNull(data) && data.length > 0) {
							$('#previewResult').css("border-bottom", "1px solid #d3d3d3");
						}
					}
				})
			},
			createFunction: function() {
				var url = '/ma/general/excel/impEleDatas?eleCode=ACCT' + '&rgCode=' + pageData.rgCode + '&setYear=' + pageData.setYear;
				ufma.showloading('账套创建中，请耐心等待...');
				$.ajax({
					url: url,
					type: 'POST',
					cache: false,
					data: page.formData,
					processData: false,
					contentType: false
				}).done(function(res) {
					ufma.hideloading();
					if(res.flag == "fail") {
						ufma.showTip(res.msg, function() {
							return false;
						}, "warning");
					} else {
						$('.impInfo').html('导入结果');
						$('#impModal').addClass('hide');
						$('#btn-close').removeClass('hide');
						$('#btn-cancle').addClass('hide');
						$('#data-create-btn').addClass('hide');
						$('#data-next-btn').addClass('hide');
						$('.resultXls').removeClass('hide');
						$('.onePage').addClass('hide');
						page.showType = '导入结果';
						page.initResultTable(res.data);
					}
				}).fail(function(res) {
					ufma.hideloading();
					$('.impInfo').html('导入结果');
					$('#impModal').addClass('hide');
					$('#btn-close').removeClass('hide');
					$('#btn-cancle').addClass('hide');
					$('#data-create-btn').addClass('hide');
					$('#data-next-btn').addClass('hide');
					$('.resultXls').removeClass('hide');
					$('.onePage').addClass('hide');
					page.initResultTable(res.data);
				});
			},
			onEventListener: function() {
				$('#excelFile').on('input', function(e) {
					var files = e.target.files;
					var fileReader = new FileReader();
					//CWYXM-7503--多次上传统一文件时不及时刷新问题--zsj
					page.formData = new FormData($('#excelFileFrom')[0]);//fileForm为表单id
					fileReader.onload = function(ev) {
						try {
							var data = ev.target.result,
								workbook = XLSX.read(data, {
									type: 'binary'
								}), // 以二进制流方式读取得到整份excel表格对象
								excelData = []; // 存储获取到的数据
						} catch(e) {
							return;
						}
						// 表格的表格范围，可用于判断表头是否数量是否正确
						var fromTo = '';
						// 遍历每张表读取
						for(var sheet in workbook.Sheets) {
							if(workbook.Sheets.hasOwnProperty(sheet)) {
								fromTo = workbook.Sheets[sheet]['!ref'];
								excelData = excelData.concat(XLSX.utils.sheet_to_json(workbook.Sheets[sheet]));

							}
						}
						var realImport = [];
						for(var i = 0; i < excelData.length; i++) {
							if(!$.isNull(excelData[i].单位编码)) { //此处是 为了避免导入空行
								realImport = realImport.concat(excelData[i])
							}
						}
						page.initContentTable(realImport);
					 page.importData = $('#excelFile').val();
					 //CWYXM-7503--多次上传统一文件时不及时刷新问题--zsj
		             $('#excelFile').val('');
					};

					// 以二进制方式打开文件
					fileReader.readAsBinaryString(files[0]);
				});
				//取消导入的模态框
				$('#importExcel .btn-close').on('click', function() {
					_close("close", {});
				});
				//选择上传文件
				$(".file-upload-box-btn").on("change", ".file-upload-input", function() {
					$(".file-upload-title span").html('');
					var oldFile = $(".file-upload-title span").text();
					// var filePath = $(this).val();
					var filePath = this.files[0].name;
					var $box = $(this).parents(".file-upload-box");
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
				//导入文件结果预览
				$("#data-next-btn").on("click", function() {
					//点击后置为不能点击，传入成功或失败后再置为可点击，以防多次导入
					// var excelFile = $("#excelFile").val();
					//var excelFile = $('.file-upload-title span').html();
					var excelFile = page.importData;
					if($.isNull(excelFile)) {
						ufma.showTip("请选择要导入的Excel文件！", function() {}, "warning");
						return false;
					}
					console.log(page.formData)
					var url = '/ma/general/excel/previewExcelEleDatas?eleCode=ACCT' + '&rgCode=' + pageData.rgCode + '&setYear=' + pageData.setYear;
					ufma.showloading('数据检查中，请耐心等待...');
					$.ajax({
						url: url,
						type: 'POST',
						cache: false,
						data: page.formData,
						processData: false,
						contentType: false
					}).done(function(res) {
						ufma.hideloading();
						if(res.flag == "fail") {
							ufma.showTip(res.msg, function() {
								return false;
							}, "warning");

						} else {
							$('.resultXls').removeClass('hide');
							$('#impModal').addClass('hide');
							$('#data-create-btn').removeClass('hide');
							$('#data-next-btn').addClass('hide');
							$('.onePage').addClass('hide');
							page.showType = '校验结果';
							page.initResultTable(res.data);
							var checkCount = 0;
							for(var i = 0; i < res.data.length; i++) {
								if(res.data[i].failMsg == '通过') {
									checkCount = checkCount + 1;
								}
							}
							if(checkCount == res.data.length) {
								page.showNum = '0'; //校验结果为全部通过，创建账套时无需提示;
							} else if(checkCount < res.data.length) {
								if(checkCount != 0) {
									page.showNum = '1'; //校验结果为部分通过，创建账套时需提示:本次只创建预览成功的数据;（且后端只接收成功的数据）
								} else if(checkCount == 0) {
									page.showNum = '2'; //校验结果为全部失败，创建账套时需提示:请按照预览结果检查excel内容是否正确;
								}
							}
						}
					}).fail(function(res) {
						ufma.hideloading();
						$('.resultXls').removeClass('hide');
						$('.onePage').addClass('hide');
						page.initResultTable(res.data);
					});
				});
				//确定导入账套，既创建账套
				$('#data-create-btn').on('click', function() {
					if(page.showNum == '1') {
						ufma.confirm('本次只创建预览结果为‘通过’的账套', function(action) {
							if(action) {
								page.createFunction();
							} else {

							}
						}, {
							type: 'warning'
						});

					} else if(page.showNum == '0') {
						page.createFunction();
					} else if(page.showNum == '2') {
						ufma.showTip("请按照预览结果检查excel内容是否正确,请点击取消重新导入", function() {}, 'warning');
						return false;
					}
				})
				//取消
				$('#btn-cancle').click(function(e) {
					_close();
				});
				$('#btn-close').click(function(e) {
					_close();
				});
			},
			initPage: function() {
				var data = [];
				page.initContentTable(data);
				$("#impModal").on("click", function() {
					window.location.href = '/pub/file/downloadModel?fileName=账套.xlsx' + '&attachGuid=ACCT&projectName=ma';
				});
			},

			//此方法必须保留
			init: function() {
				$('.resultXls').addClass('hide');
				$('.previewXls').removeClass('hide');
				var tokenid = ufma.getCommonData().token;
				if(tokenid == undefined) {
					tokenid = "";
				}
				page.urlArgu = "?tokenid=" + tokenid + "&ajax=1";
				this.initPage();
				ufma.parse();
				page.onEventListener();
				ufma.parseScroll();

			},
		}

	}();
	page.init();
});