$(function() {
	window._close = function(action) {
		if(window.closeOwner) {
			var data = {
				action: action
			};
			window.closeOwner(data);
		}
	};

	var onerdata = window.ownerData;
	var page = function() {
		return {
			renderTable: function() {
				var data = onerdata;
				var tHead = '<ul class="tHead clearfix">' +
					'<li class="head-agency-code tc">单位</li>' +
					'<li class="head-acco-code tc borderR borderL">方案名称</li>' + //科目代码
					'<li class="head-status tc borderR">状态</li>' +
					'<li class="head-reason tc">原因</li>' +
					'</ul>';
				$(".content").append(tHead);
				for(var i in data){
					for(var j=0;j<data[i].length;j++){
						for(var z in data[i][j]){
							if(z!='agencyAndAcctCode'){
								var row = '<div class="table-row  clearfix">' +
									'<div class="agencyCode block tc" title= '+i+'>'+i+'</div>' +
									'<div class="accoCode block borderR borderL tc" title= '+z+'>'+z+'</div>' +
									'<div class="statuss block borderR tc">'+data[i][j][z].status+'</div>' +
									'<div class="reason block tc" title= '+data[i][j][z].reason+'>'+data[i][j][z].reason+'</div>' +
									'</div>';
								$(".content").append(row);
							}
						}
					}
				}
				
			},
			//初始化页面
			initPage: function() {
				page.renderTable();
			},
			onEventListener: function() {
				$("#btn-close").on("click", function() {
					_close();
				})
			},
			//此方法必须保留
			init: function() {
				ufma.parse();
				this.initPage();
				this.onEventListener();
			}

		}
	}();
	page.init();

});