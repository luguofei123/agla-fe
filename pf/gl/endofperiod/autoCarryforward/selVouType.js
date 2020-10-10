$(function() {
	window._close = function(action) {
		if(window.closeOwner) {
			var data = {
				action: action
			};
			window.closeOwner(data);
		}
	}
	var page = function() {
		return {
			initPage: function() {
				$("#vouTYpe").ufCombox({
					idField: "code",
					textField: "name",
					placeholder: "请选凭证类型",
					onChange: function (sender, data) {
					},
					onComplete: function (sender) {
					}
				});
				var url = "/gl/eleVouType/getVouType/*/" + page.pfData.svSetYear + "/*/*";
				ufma.get(url,"",function(result){
					$("#vouTYpe").getObj().load(result.data);
				})
			},
			onEventListener: function() {
				$("#btn-save").on("click",function(){
					_close("save")
				})
				$("#btn-close").on("click", function () {
					_close()
				})
				
			},
			//此方法必须保留
			init: function() {
				page.pfData = ufma.getCommonData();
				ufma.parse();
				this.initPage();
				this.onEventListener();
			}
		}
	}();
	/////////////////////
	page.init();
});