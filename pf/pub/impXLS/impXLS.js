$(function () {
	var action = false;
	window._close = function () {
		if (window.closeOwner) {
			window.closeOwner(action);
		}
	};
	if (window.ownerData.eleCode == "LPSCHE") {
		$('#impInfo').html('导入预览');
		$("#impModal").css("display", "none");
	}
	var infor = JSON.parse(window.sessionStorage.getItem("dataSourceModelInfor"));
	var page = function () {
		//银行对账单接口
		var portList = {
			impExcel: "/ma/general/excel/impEleDatas?eleCode=" + ownerData.eleCode + '&rgCode=' + ownerData.rgCode + '&agencyCode=' + ownerData.agencyCode + '&setYear=' + ownerData.setYear //导入excel文件
		};

		return {
			showResult: function (data) {

				var scNum = data.successList.length, failNum = data.failList.length;
				var totalNum = scNum + failNum;
				action = scNum > 0;
				$('#impInfo').html('共' + totalNum + '项，其中：成功' + scNum + '项，失败' + failNum + '项');
				$('#impDetial').html('');
				if (failNum == 0) {
					$('#impDetial').html('<span style="display:inline-block;margin-top:50%;">导入成功！</span>');
					return false;
				}
				for (var i = 0; i < failNum; i++) {
					var row = data.failList[i];
					$('<div style="padding:5px 5px 0px">第' + row.excelLine + '行，' + row.failMsg + '</div>').appendTo('#impDetial');
				}
			},
			onEventListener: function () {

				//取消导入的模态框
				$('#importExcel .btn-close').on('click', function () {
					_close("close", {});
				});

				//选择上传文件
				$(".file-upload-box-btn").on("change", ".file-upload-input", function () {
					var oldFile = $(".file-upload-title span").text();
					// var filePath = $(this).val();
					var filePath = this.files[0].name;
					var $box = $(this).parents(".file-upload-box");
					if (filePath != "") {
						$box.find(".file-upload-tip").hide();
						$box.find(".file-upload-title").show().find("span").text(filePath);
					} else {
						if (oldFile != "") {
							$box.find(".file-upload-tip").hide();
							$box.find(".file-upload-title").show().find("span").text(oldFile);
						} else {
							$box.find(".file-upload-tip").show();
							$box.find(".file-upload-input").hide().find("span").text(filePath);
						}
					}
					if (window.ownerData.eleCode == "LPSCHE") { // 单据方案的导入校验
						ufma.showloading("正在校验导入数据，请稍后...");
						$('#impInfo').html('导入预览');
						$("#excelFile").attr("name", "file");
						var url = window.ownerData.checkUrl; // 导入校验接口
						var excelFile = new FormData();
						excelFile.append("file", $('#excelFile')[0].files[0]);
						excelFile.append("agencyCode", window.ownerData.agencyCode);
						excelFile.append("setYear", window.ownerData.setYear);
						excelFile.append("rgCode", window.ownerData.rgCode);
						excelFile.append("isSys", window.ownerData.isSys);
						$.ajax({
							url: url,
							type: 'POST',
							cache: false,
							data: excelFile,
							processData: false,
							contentType: false
						}).done(function (res) {
							ufma.hideloading();
							if (res.data.isImport === '1') {
								$(".btn-import").attr("disabled", false);
								$('#impDetial').html(res.msg);
							} else {
								$(".btn-import").attr("disabled", true);
								$('#impDetial').html(res.msg);
							}
						}).fail(function (res) {
							ufma.hideloading();
						});
					}
				});

				//导入文件
				$(".btn-import").on("click", function () {
					//点击后置为不能点击，传入成功或失败后再置为可点击，以防多次导入
					$(this).attr("disabled", true);
					if (window.ownerData.eleCode == "LPSCHE") { // 单据方案的导入校验
						ufma.showloading("正在导入数据，请稍后...");
						$('#impInfo').html('导入结果');
						$("#excelFile").attr("name", "file");
						var url = window.ownerData.insertUrl; // 导入校验接口
						var excelFile = new FormData();
						excelFile.append("file", $('#excelFile')[0].files[0]);
						excelFile.append("agencyCode", window.ownerData.agencyCode);
						excelFile.append("setYear", window.ownerData.setYear);
						excelFile.append("rgCode", window.ownerData.rgCode);
						excelFile.append("isSys", window.ownerData.isSys);
						$.ajax({
							url: url,
							type: 'POST',
							cache: false,
							data: excelFile,
							processData: false,
							contentType: false
						}).done(function(res) {
							ufma.hideloading();
							if(res.flag === "success") { // 导入成功
								$('#impDetial').html(res.msg);
							} else {
								$('#impDetial').html(res.msg);
							}
						}).fail(function(res) {
							ufma.hideloading();
						});
					} else {
						var excelFile = $("#excelFile").val();
						if ($.isNull(excelFile)) {
							ufma.showTip("请选择要导入的Excel文件！", function () { }, "warning");
							$(this).attr("disabled", false);
							return false;
						}
						ufma.showloading("正在导入数据，请稍后...");
						var url = ownerData.url ? ownerData.url : portList.impExcel;
						$.ajax({
							url: url,
							type: 'POST',
							cache: false,
							data: new FormData($('#excelFileFrom')[0]),
							processData: false,
							contentType: false
						}).done(function (res) {
							ufma.hideloading();
							$(".btn-import").attr("disabled", false);
							if (res.flag == "fail" && !res.data) {
								ufma.showTip(res.msg, function () {
	
								}, "error");
								return false;
							}
							page.showResult(res.data);
						}).fail(function (res) {
							ufma.hideloading();
							$(".btn-import").attr("disabled", false);
							page.showResult(res.data);
						});
					}


				});

				//取消
				$('#btn-cancle').click(function (e) {
					_close();
				});
			},
			initPage: function () {
				//$('#impModal').attr({'href':ownerData.eleCode+'.xlsx','download':ownerData.eleName+'.xlsx'});
				$("#impModal").on("click", function () {
					window.location.href = '/pub/file/downloadModel?fileName=' + ownerData.eleName + '.xlsx' + '&attachGuid=' + ownerData.eleCode + '&projectName=' + ownerData.projectName;
				});
			},

			//此方法必须保留
			init: function () {
				var tokenid = ufma.getCommonData().token;
				if (tokenid == undefined) {
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