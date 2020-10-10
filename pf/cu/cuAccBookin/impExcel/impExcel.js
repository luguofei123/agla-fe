$(function() {
	window._close = function() {
		if(window.closeOwner) {
			window.closeOwner();
		}
	};
	var infor = JSON.parse(window.sessionStorage.getItem("dataSourceModelInfor"));
	var excelFile;
	var page = function() {
		var ptData = {};
		return {
			showResult: function(data) {
				$('#impInfo').html(data.impResult);
				$('#impDetial').html('');
				for(var i=0;i<data.result.length;i++){
					var row = data.result[i];
					$('<div style="padding:5px 5px 0px">'+row.msg+'</div>').appendTo('#impDetial');
				}
			},
			onEventListener: function() {
				//取消导入的模态框
				$('#importExcel .btn-close').on('click', function() {
					_close();
				});

				//选择上传文件
				$(".file-upload-box-btn").on("change", ".file-upload-input", function() {
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

				//导入文件
				$(".btn-import").on("click", function() {
					//点击后置为不能点击，传入成功或失败后再置为可点击，以防多次导入
					$(this).attr("disabled", true);
					excelFile = $("#excelFile").val();
					if($.isNull(excelFile)) {
						ufma.showTip("请选择要导入的Excel文件！", function() {}, "warning");
						return false;
					}
					var formdata= new FormData($('#excelFileFrom')[0]);
					formdata.append("agencyCode", window.ownerData.agencyCode);
					formdata.append("setYear", window.ownerData.setYear);
					formdata.append("rgCode", window.ownerData.rgCode);
					formdata.append("accountBookGuid",window.ownerData.accountBookGuid);
					$.ajax({
						url: '/cu/excel/createBill',
						type: 'POST',
						cache: false,
						data:formdata,
						processData: false,
						contentType: false
					}).done(function(res) {
						$(".btn-import").attr("disabled", false);
						if(res.flag == "fail" && !res.data) {
							ufma.showTip(res.msg, function() {}, res.flag);
							return false;
						}
						page.showResult(res.data);
					}).fail(function(res) {
						$(".btn-import").attr("disabled", false);
						page.showResult(res.data);
					});
				});
               //文件导出到本地
                $('#impModal').click(function(){
                	var accountBookGuid  = window.ownerData.accountBookGuid;
                	 var url = "/cu/excel/exportFile?accountBookGuid="+accountBookGuid;
                	 window.location.href = url; 
                });
				//取消
				$('#btn-cancle').click(function(e) {
					_close();
				});
			},
			//此方法必须保留
			init: function() {
				ptData = ufma.getCommonData();
				ufma.parse();
				page.onEventListener();
				ufma.parseScroll();

			},
		}

	}();
	page.init();
});
