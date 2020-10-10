//附件进行修改
$(document).on("keydown", "#fjd", function(event) {
	event = event || window.event;
	if(event.keyCode == 13) {
		$(this).blur();
		$(".abstractinp").eq(0).focus().select();
	}
})
$(document).on("keyup", "#fjd", function() {
	var c = $(this);
	if(/[^\d]/.test(c.val())) { //替换非数字字符  
		var temp_amount = c.val().replace(/[^\d]/g, '');
		$(this).val(temp_amount);
	}
})
//
$(document).on('change', "#leftbgselect", function() {
	if(($(".voucher-head").attr("namess") != undefined || $(".voucher-head").attr("tenamess") != undefined) && vouisendsel) {
		for(var i = 0; i < $(".voucher-center").length; i++) {
			if($(".voucher-center").eq(i).attr("op") != 2 && $(".voucher-center").eq(i).attr("op") != 0) {
				$(".voucher-center").eq(i).attr("op", '1')
				for(var z = 0; z < $(".voucher-center").eq(i).find(".voucher-yc").length; z++) {
					if($(".voucher-center").eq(i).find(".voucher-yc-bo").eq(z).attr("op") != 2 && $(".voucher-center").eq(i).find(".voucher-yc").eq(z).attr("op") != 0) {
						for(var j = 0; j < $(".voucher-center").eq(i).find(".voucher-yc").eq(z).find(".voucher-yc-bo").length; j++) {
							if($(".voucher-center").eq(i).find(".voucher-yc").eq(z).find(".voucher-yc-bo").eq(j).attr("op") != 2 && $(".voucher-center").eq(i).find(".voucher-yc").eq(z).find(".voucher-yc-bo").eq(j).attr("op") != 0) {
								$(".voucher-center").eq(i).find(".voucher-yc").eq(z).find(".voucher-yc-bo").eq(j).attr("op", '1')
							}
						}
					}
				}
			}
		}
	}
	var keyss = '*'
	if(getUrlParam("action") != "voumodel"){
		keyss = $("#leftbgselect option:selected").attr("value")
	}
	ufma.ajaxDef("/gl/vou/getAccoAndAccitem/"+ rpt.nowAgencyCode + "/" + rpt.nowAcctCode +"/"+keyss, "get", '', function(data) {
		quanjuvoudatas.data = data.data.accos;
		$("#accounting-container").html(acctaccaall())
		$("#accounting-container-cw").html(acctacca1())
		$("#accounting-container-ys").html(acctacca2())
		$('#AssDataAll').html('') 
		tablehead = data.data.tableHead;
		fzhsxl = data.data.optionData;
		accitemOrderSeq = data.data.accitemOrder
	})
})
$(document).on("mouseover", ".voucherkj,.voucherkjxs", function() {
	$(".voucherkjxs").show();
})
$(document).on("mouseout", ".voucherkj,.voucherkjxs", function() {
	$(".voucherkjxs").hide();
})
$(document).on("change", "#leftbgselect", function() {
	prevnextvoucher = -1;
	MaxVouNoUp()
})
$("#dates").on('change', 'input', function() {
	if(($(".voucher-head").attr("namess") != undefined || $(".voucher-head").attr("tenamess") != undefined) && vouisendsel) {
		voubiaoji();
	}
});
$(document).on('mouseenter', '#vfjz,#vfsh,#vfzd', function(e) {
	$(this).attr('title', $(this).text());
});
$(document).on('click', '.iswriteoff', function(e) {
	var vouguid = $(this).attr("guid")
	ufma.get("/gl/vou/getVou/" + vouguid, '', function (data) {
		dataforcwys(data.data)
		cwyspd();
		chapz()
		zhuantai();
		if (quanjuvouyusuan != null && quanjuvouchaiwu != null) {
			if ($(".yusuan").hasClass('xuanzhongcy')) {
				$(".chaiwu").trigger('click');
				var timeId = setTimeout(function () {
					$(".yusuan").trigger('click');
					clearTimeout(timeId);
				}, 100);
			} else if ($(".chaiwu").hasClass('xuanzhongcy')) {
				$(".yusuan").trigger('click');
				var timeId = setTimeout(function () {
					$(".chaiwu").trigger('click');
					clearTimeout(timeId);
				}, 100);
			}
		}
	})
});