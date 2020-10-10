function xianjinglius(xianjingliu,quanjuvoudatas) {
	console.log('打开界面');
	ufma.open({
		title: '现金流量',
		width: 893,
		height: 480,
		url: '/pf/gl/cashflow/cashflow.html',
		data: {
			"data": xianjingliu,
			"quanjuvoudatas": quanjuvoudatas,
			'fisperd':(new Date($("#dates").getObj().getValue()).getMonth()) + 1,
			'selectdata':selectdata
		},
		ondestory: function (result) {
			if(result.action == 1){
				ufma.showTip(result.result, function() {}, "success")
			}else if(result.action == -1){
				ufma.showTip(result.result, function() {}, "error")
			}
		}
	});
}

$(document).on("click", ".xjll", function() {
	var key = new Object();
	if($(".voucher-head").attr("namess") == undefined) {
		ufma.showTip("凭证尚未保存", function() {}, "warning")
	} else {
		var vouGuidkey = $(".voucher-head").attr("namess");
		$.ajax({
			type: "get",
			url: "/gl/vou/getCf/" + vouGuidkey + "?ajax=1&rueicode="+hex_md5svUserCode,
			async: false,
			success: function(data) {
				if(data.flag == "success") {
					xianjingliu = data;
					xianjinglius(xianjingliu,quanjuvoudatas);
				} else {
					ufma.showTip(data.msg, function() {}, "error")
				}
			},
			error: function() {
				ufma.showTip("连接失败，请检查网络", function() {}, "error")
			}
		});
	}

})