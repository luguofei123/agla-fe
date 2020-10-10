$(function() {
	var fileclone;
	var page = function() {
		return {
			onEventListener: function() {
				//选择上传文件
				$(".file-upload-box-btn").on("change", ".file-upload-input", function() {
					var filePath;
					if(!this.files[0]){
						if(fileclone){
							$("#impFile").remove();
							$("#impFileHidden").after(fileclone);
							filePath = fileclone[0].files[0].name;
						}else{
							return false;
						}
					}else{
						fileclone = $("#impFile").clone(true);
						filePath = this.files[0].name;
					}
					console.log(filePath);
					var pos = filePath.lastIndexOf(".");
					var lastname = filePath.substring(pos, filePath.length);
					if((lastname.toLowerCase() != ".zip") && (lastname.toLowerCase() != ".xml")) {
						ufma.showTip("请选择zip格式或xml格式文件！", function() {}, "warning");
						// $(this).val(oldFile);
						$(".file-upload-title span").text("");
						return false;
					}
					
					var $box = $(this).parents(".file-upload-box");
					$box.find(".file-upload-tip").hide();
					$box.find(".file-upload-title").show().find("span").text(filePath);
					$("#importBtn").attr("disabled",false)
				});
				//导入文件
				$("#importBtn").on("click", function() {

					//点击后置为不能点击，传入成功或失败后再置为可点击，以防多次导入
					$(this).attr("disabled", true);
					var impFile = $("#impFile").val();
					if($.isNull(impFile)) {
						ufma.showTip("请选择要导入的文件！", function() {}, "warning");
						$(this).attr("disabled", false);
						return false;
					}
					var chks = $('input:checked');
					if(chks.length==0){
						ufma.showTip("请选择数据范围！", function() {}, "warning");
						$(this).attr("disabled", false);
						return false;
					}
					var data=[];
					for(var i=0;i<chks.length;i++){
						data.push($(chks[i]).val());
					}
					$('#dataType').val(data.join(','));

					ufma.showloading('正在导入，请耐心等待...');

					$.ajax({
						url: "/de/xmlParser/importXmlFile",
						type: 'POST',
						cache: false,
						data: new FormData($('#excelFileFrom')[0]),
						processData: false,
						//contentType: data.join(',')
						contentType: false
					}).done(function(res) {
						ufma.hideloading();
						$("#importBtn").attr("disabled", false);
						if(res.flag == "fail" && !res.data) {

							ufma.showTip(res.msg, function() {
								
							}, "error");
							return false;
						}else {
							ufma.showTip(res.msg, function() {

							}, res.flag);
						}

					}).fail(function(res) {
						ufma.hideloading();
						$("#importBtn").attr("disabled", false);

					});
				});
			},
			//初始化页面
			initPage: function() {
				var pfData = ufma.getCommonData();
				// $("#setYear").val(pfData.svSetYear);
				$("#rgCode").val(pfData.svRgCode);

			},

			init: function() {
				//获取session
				this.initPage();
				this.onEventListener();
				ufma.parse();
			}
		}
	}();

	page.init();

});