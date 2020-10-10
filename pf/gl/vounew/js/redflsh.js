$(document).on("click", "#btn-voucher-conghong", function(e) {
	$("#zezhao").show();
	$("#zezhao").html("");
	var curVouType = $('#leftbgselect').val();
	var curysvoutype = '';
	if($('.chaiwu').css('display')!='none' && $('.chaiwu').hasClass('xuanzhongcy') ){
		curVouType = $('#leftbgselect').val()
		if(quanjuvouyusuan!=undefined && quanjuvouyusuan !=null){
			curysvoutype = quanjuvouyusuan.vouTypeCode
		}
	}else if($('.yusuan').css('display')!='none' && $('.yusuan').hasClass('xuanzhongcy') ){
		curysvoutype = $('#leftbgselect').val()
		if(quanjuvouchaiwu!=undefined && quanjuvouchaiwu !=null){
		 	curVouType = quanjuvouchaiwu.vouTypeCode
		}
	}
	var conghongalltr = '';
	conghongalltr += '<div class="conghongall">'
	conghongalltr += '<div class="conghongall-head">'
	conghongalltr += '<div class="conghongall-head-bt">凭证冲红</div>'
	conghongalltr += '<div class="conghongall-close icon-close"></div>'
	conghongalltr += '</div>'
	conghongalltr += '<div class="conghongall-body">'
	conghongalltr += '<div class="conghongall-xiao-bt icon-point"></div>'
	
	conghongalltr += '<h1 class="conghongall-tishi">红字凭证将按以下设置生成！</h1>'
	conghongalltr += '<div class="conghongall-biaoj">'
	if($('.chaiwu').css('display')!='none'){
		conghongalltr += '<div style="width:100%;height:40px;">'
		conghongalltr += '<span class="conghongleixingbt">财务凭证类型：</span>'
		conghongalltr += '<select name="" id="conghongleixing">'
	//	console.info(danweiname.data);
		for(var i = 0; i < danweinamec.length; i++) {
			conghongalltr += '<option '+(curVouType==danweinamec[i].code?'selected':'')+' value="' + danweinamec[i].code + '">' + danweinamec[i].name + '</option>'
		}
		conghongalltr += '</select>'
		conghongalltr += '</div>'
		conghongalltr += '<div style="width:100%;height:40px;">'
		conghongalltr += '<span class="conghongleixingbt">预算凭证类型：</span>'
		conghongalltr += '<select name="" id="conghongleixingys">'
	//	console.info(danweinamec);
		for(var i = 0; i < danweinamey.length; i++) {
			conghongalltr += '<option '+(curysvoutype==danweinamey[i].code?'selected':'')+' value="' + danweinamey[i].code + '">' + danweinamey[i].name + '</option>'
		}
		conghongalltr += '</select>'
		conghongalltr += '</div>'
	}else{
		conghongalltr += '<div style="width:100%;height:40px;">'
		conghongalltr += '<span class="conghongleixingbt">财务凭证类型：</span>'
		conghongalltr += '<select name="" id="conghongleixing">'
	//	console.info(danweiname.data);
		for(var i = 0; i < danweinamec.length; i++) {
			conghongalltr += '<option '+(curVouType==danweinamec[i].code?'selected':'')+' value="' + danweinamec[i].code + '">' + danweinamec[i].name + '</option>'
		}
		conghongalltr += '</select>'
		conghongalltr += '</div>'
	}
	conghongalltr += '</div>'
	if($('.chaiwu').css('display')!='none'){
		conghongalltr += '<div id="conghongbg">'
	}else{
		conghongalltr += '<div id="conghongbg" style="margin-top:-20px;">'
	}
	conghongalltr += '<span class="conghongbgda">凭证日期：</span>'
	conghongalltr += '<input type="text" id="conghongdates">'
	conghongalltr += '<img src="img/dates.png" class="conghongicondates" />'
	conghongalltr += '<div id="conghongcalendar"></div>'
	conghongalltr += '</div>'
	conghongalltr += '</div>'
	conghongalltr += '<div class="conghongall-foot">'
	conghongalltr += '<div class="btn-conghongall-close">取消</div>'
	conghongalltr += '<div class="btn-conghongall-submit">保存</div>'
	conghongalltr += '</div>'
	conghongalltr += '</div>'
	$("#zezhao").html(conghongalltr);
	$("#conghongdates").datetimepicker({
	    format: 'yyyy-mm-dd',
        autoclose: true,
        todayBtn: true,
        startView: 'month',
        minView:'month',
        maxView:'decade',
        language: 'zh-CN'
	});
	$("#conghongdates").val(ufgovkey.svTransDate)
	stopPropagation(e);
})
$(document).on("click", ".conghongall", function(e) {
	stopPropagation(e);
	$("#conghongcalendar").hide();
})
$(document).on("click", ".conghongall-close", function(e) {
	$("#zezhao").hide();
	$("#zezhao").html("")
})
$(document).on("click", ".btn-conghongall-close", function(e) {
	$("#zezhao").hide();
	$("#zezhao").html("");
})
$(document).on("click", ".conghongicondates", function(e) {
	$("#conghongcalendar").toggle();
	stopPropagation(e)
})
$(document).on("click", ".btn-conghongall-submit", function() {
	var that = $(this);
	if(!$(this).hasClass("btn-disablesd")) {
		$(this).addClass("btn-disablesd")
		var redvoucher = new Object();
		redvoucher.vouGuid = $(".voucher-head").attr("namess");
		redvoucher.vouDate = $("#conghongdates").val();
		redvoucher.vouType = $("#conghongleixing option:selected").attr("value");
		if($('.chaiwu').css('display') !='none'){
			redvoucher.ysvouType = $("#conghongleixingys option:selected").attr("value");
		}else{
			redvoucher.ysvouType = '';
		}
		var titlesrc='redVoucher'
		if(vousinglepz == true){
			titlesrc = 'redVoucher'
		}
		$.ajax({
			type: "post",
			url: "/gl/vou/"+ titlesrc + "?ajax=1&rueicode="+hex_md5svUserCode,
			async: true,
			data: JSON.stringify(redvoucher),
			contentType: 'application/json; charset=utf-8',
			success: function(data) {
				that.removeClass("btn-disablesd");
				if(data.flag == "success") {
					$(".voucher").remove();
					voucheralls();
					dataforcwys(data.data)
					$("#zezhao").html("");
					$("#zezhao").hide();
					cwyspd();
					chapz();
					zhuantai();
					ufma.showTip(data.msg, function() {}, "success")
				} else {
					ufma.showTip(data.msg, function() {}, "error")
				}
			},
			error: function(data) {
				that.removeClass("btn-disablesd");
				ufma.showTip("未连接数据库", function() {}, "error")
			}
		})
		
	}
})
var dd=ufgovkey.svTransDate
