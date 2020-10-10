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
	ufma.ajaxDef("/gl/vou/getAccoAndAccitem/"+ rpt.nowAgencyCode + "/" + rpt.nowAcctCode +"/"+keyss+"/"+rpt.foryear, "get", '', function(data) {
		quanjuvoudatas.data = data.data.accos;
		tablehead = data.data.tableHead;
		fzhsxl = data.data.optionData;
		accitemOrderSeq = data.data.accitemOrder
		$("#accounting-container").html(acctaccaall())
		$("#accounting-container-cw").html(acctacca1())
		$("#accounting-container-ys").html(acctacca2())
		$('#AssDataAll').html('') 
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
$(document).on('mouseenter', '.vfjz,.vfsh,.vfzd', function(e) {
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
$(document).on('focus', '.vouaccSearchsinps', function(e) {
	stopPropagation(e)
	if($(this).val()!=''){
		$(this).select()
	}
	if($('.searchvvoukecha').attr('vouGuid')=='' ||$('.searchvvoukecha').attr('vouGuid')==undefined){
		var guid = $('.voucher-head').attr('namess')
		$(".searchvvoukecha").html(accsDatasearch())
		$(".searchvvoukecha").attr('vouGuid',guid)
	}
	$(".searchvvoukecha").show().find("li").find(".name").html($(this).val())
});
$(document).on('input', '.vouaccSearchsinps', function(e) {
	stopPropagation(e)
	searchvouPageUporDown = 1
	$(".searchvvoukecha").show().find("li").find(".name").html($(this).val())
});
$(document).on('blur', '.vouaccSearchsinps', function(e) {
	stopPropagation(e)
	setTimeout(function(){
		$('.searchvvoukecha').hide()
	},500)
});
var searchvouPageUporDown = 1
$(document).on('click', '.searchvvoukecha li', function(e) {
	stopPropagation(e)
	$(this).addClass("active").siblings("li").removeClass("active")
	searchvouPageUporDown = 1
	if($(".searchvvoukecha").find(".active").length>0){
		searchvouLocation($('.vouaccSearchsinps').val(),$(".searchvvoukecha").find(".active").attr('data-type'),searchvouPageUporDown)
	}else{
		searchvouLocation($('.vouaccSearchsinps').val(),'',searchvouPageUporDown)
	}
	setTimeout(function(){
		$('.searchvvoukecha').hide()
	},200)
});
$(document).on('keydown', '.vouaccSearchsinps', function(event) {
	stopPropagation(event)
	if(event.keyCode == 13) {
		event.preventDefault();
		searchvouPageUporDown = 1
		$(".btn-vouaccSearchs").click()
		event.keyCode = 0;
		if(event.preventDefault) { // firefox
			event.preventDefault();
		} else { // other
			event.returnValue = false;
		}
		return false;
	}
	//Shift+pgUp 搜索上一条
	if(event.shiftKey && event.keyCode == 33) {
		event.preventDefault();
		if(searchvouPageUporDown<=1){
			searchvouPageUporDown = 1
		}else{
			searchvouPageUporDown--;
		}
		if($(".searchvvoukecha").find(".active").length>0){
			searchvouLocation($('.vouaccSearchsinps').val(),$(".searchvvoukecha").find(".active").attr('data-type'),searchvouPageUporDown)
		}else{
			searchvouLocation($('.vouaccSearchsinps').val(),'',searchvouPageUporDown)
		}
		event.preventDefault();
		event.returnValue = false;
		return false;
	}
	//Shift+pgDown 搜索下一条
	if(event.shiftKey && event.keyCode == 34) {
		event.preventDefault();
		if($(".voucher-center-active").length>0){
			searchvouPageUporDown++;
		}
		if($(".searchvvoukecha").find(".active").length>0){
			searchvouLocation($('.vouaccSearchsinps').val(),$(".searchvvoukecha").find(".active").attr('data-type'),searchvouPageUporDown)
		}else{
			searchvouLocation($('.vouaccSearchsinps').val(),'',searchvouPageUporDown)
		}
		event.preventDefault();
		event.returnValue = false;
		return false;
	}
});
$(document).on('click', '.btn-vouaccSearchs', function(e) {
	stopPropagation(e)
	searchvouPageUporDown = 1
	if($(".searchvvoukecha").find(".active").length>0){
		searchvouLocation($('.vouaccSearchsinps').val(),$(".searchvvoukecha").find(".active").attr('data-type'),searchvouPageUporDown)
	}else{
		searchvouLocation($('.vouaccSearchsinps').val(),'',searchvouPageUporDown)
	}
	setTimeout(function(){
		$('.searchvvoukecha').hide()
	},100)
});
$(document).on('click', '.btn-vouaccSearchsclose', function(e) {
	stopPropagation(e)
	searchvouPageUporDown = 1
	$('#vouaccSearchs').hide()
});
function xianjinglius(xianjingliu,quanjuvoudatas) {
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
			beforeSend: function(xhr) {
				xhr.setRequestHeader("x-function-id",voumenuid);
			},
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
//摘要批量替换逻辑

$(document).on("click", ".despcSearchBtn", function() {
	var key;
	var lefts = $(this).offset().left - $(window).scrollLeft()
	if($(this).parents('.abstracthead').length>0){
		key = $(this).parents('.abstracthead').offset().left - $(window).scrollLeft()
	}else{
		key = $(this).parents('.abstractheadtwo').offset().left - $(window).scrollLeft()
	}
	if($(this).parents('.voucher-head').find('.voucherheadindex').length>0){
		key = $(this).parents('.voucher-head').find('.voucherheadindex').offset().left - $(window).scrollLeft()
	}
	if($(this).parents('.abstractheadys').length>0){
		key = $(this).parents('.abstractheadys').offset().left - $(window).scrollLeft()
	}
	if($(this).parents('.voucher-head').find('.voucherType').length>0){
		key = $(this).parents('.voucher-head').find('.voucherType').offset().left - $(window).scrollLeft()
	}
	if(!isInputChange()){
		$(".btn-replacedespcAll,.btn-replacedespc").attr('disabled',true).prop('disabled',true)
	}else{
		$(".btn-replacedespcAll,.btn-replacedespc").attr('disabled',false).prop('disabled',false)
	}
	$('.despctsearchModal').show(200).css('left',key+'px')
	$('.despctsearchModal .tip').css('left',lefts-key+"px")
	if($(this).parents('.voucherheadcw').length>0){
		$('.despctsearchModal').find('.searchnowys').parents('.mt-radio').addClass('hide')
		$('.despctsearchModal').find('.searchnowcw').parents('.mt-radio').removeClass('hide')
		$('.despctsearchModal').find('.searchnowcw').attr('checked',true).prop('checked',true)
	}else if($(this).parents('.voucherheadys').length>0){
		$('.despctsearchModal').find('.searchnowcw').parents('.mt-radio').addClass('hide')
		$('.despctsearchModal').find('.searchnowys').parents('.mt-radio').removeClass('hide')
		$('.despctsearchModal').find('.searchnowys').attr('checked',true).prop('checked',true)
	}else{
		$('.despctsearchModal').find('.searchnowys').parents('.mt-radio').addClass('hide')
		$('.despctsearchModal').find('.searchnowcw').parents('.mt-radio').addClass('hide')
		$('.despctsearchModal').find('.searchall').attr('checked',true).prop('checked',true)
	}
})
$(document).on("click", ".despctsearchModal .icon-close", function() {
	$('#serarchdespcinput').val('')
	$('#replacedespcinput').val('')
	$('.despctsearchModal').hide(200)
	searchdespclength = 0;
})
//获取符合的摘要字段并选中
var searchdespclength = 0
//添加批量替换方法
String.prototype.myReplace=function(f,e){//吧f替换成e
    var reg=new RegExp(f,"g"); //创建正则RegExp对象   
    return this.replace(reg,e); 
}
function replacedespcAll(dom){
	for(var i=0;i<dom.length;i++){
		if(dom.eq(i).find('.abstractinp').val()!=''){
			var despcval = dom.eq(i).find('.abstractinp').val();
			var searchval =$('#serarchdespcinput').val()
			var replaceval = $("#replacedespcinput").val()
			var newdespcval = despcval.myReplace(searchval,replaceval)
			dom.eq(i).find('.abstractinp').val(newdespcval)
		}
	}
}
function searchdespc(dom,index,replacedata){
	setTimeout(function(){
		var searchval =$('#serarchdespcinput').val()
		var searchvallength = searchval.length;
		var key = 0
		for(var i=0;i<dom.length;i++){
			if(dom.eq(i).find('.abstractinp').val()!=''){
				var despcval = dom.eq(i).find('.abstractinp').val();
				var despcvallength = despcval.length;
				if(despcvallength==searchvallength){
					if(despcval == searchval){
						key++;
						if(key == index){
							dom.eq(i).find('.abstractinp').focus().select()
							if(replacedata!=undefined && replacedata!=false){
								dom.eq(i).find('.abstractinp').val(replacedata).focus()
							}
							break;
						}
					}
				}else if(despcvallength>searchvallength){
					var qis = 0
					var ischange = false
					function qissel(){
						if(qis+searchvallength<=despcvallength){
							if(despcval.substring(qis,qis+searchvallength) == searchval){
								key++;
								if(key == index){
									dom.eq(i).find('.abstractinp').focus()
									dom.eq(i).find('.abstractinp')[0].selectionStart = qis;   //选中区域左边界
									dom.eq(i).find('.abstractinp')[0].selectionEnd = qis+searchvallength; //选中区域右边界
									ischange = true;
									if(replacedata!=undefined && replacedata!=false){
										var thisval = dom.eq(i).find('.abstractinp').val().split("")
										thisval.splice(qis,searchvallength)
										var keyss = thisval.join('')
										var keys = keyss.slice(0,qis)+replacedata+keyss.slice(qis,thisval.length)
										dom.eq(i).find('.abstractinp').val(keys).focus()
										dom.eq(i).find('.abstractinp')[0].selectionStart = qis;   //选中区域左边界
										dom.eq(i).find('.abstractinp')[0].selectionEnd = qis+replacedata.length; //选中区域右边界
										// searchdespclength++;
										searchdespc(dom,index,false)
									}
								}else{
									qis=qis+searchvallength
									qissel()
								}
							}else{
								qis++;
								qissel()
							}
						}
					}
					qissel()
					if(ischange){
						break;
					}
				}
			}
		}
		if(key == 0){
			if(replacedata==undefined){
				ufma.showTip('当前凭证搜索范围内无此摘要字段')
			}
		}else if(key<index){
			searchdespclength =1
			if(replacedata==undefined){
				searchdespc(dom,1)
			}
		}
	},200)
}
$(document).on('input','#serarchdespcinput',function(e){
	searchdespclength = 0;
})
$(document).on('change','.despctsearchModal .searchdespc',function(e){
	searchdespclength = 0;
})
$(document).on("click", ".btn-searchdespc", function() {
	if($('#serarchdespcinput').val()==''){
		ufma.showTip("请输入您要搜索的内容")
		return false
	}
	searchdespclength++;
	if($('.searchdespc:checked').hasClass('searchnowcw')){
		if($(".voucher").hasClass('voucher-singelzy')){
			searchdespc($('.voucher-centercw'),searchdespclength)
		}else if($(".voucher").hasClass('voucher-singel')){
			searchdespc($('.voucher-center-cw'),searchdespclength)
		}else{
			searchdespc($('.voucher-center'),searchdespclength)
		}
	}else if($('.searchdespc:checked').hasClass('searchnowys')){
		if($(".voucher").hasClass('voucher-singelzy')){
			searchdespc($('.voucher-centerys'),searchdespclength)
		}else if($(".voucher").hasClass('voucher-singel')){
			searchdespc($('.voucher-center-ys'),searchdespclength)
		}else{
			searchdespc($('.voucher-center'),searchdespclength)
		}
	}else if($('.searchdespc:checked').hasClass('searchall')){
		searchdespc($('.voucher-center'),searchdespclength)
	}
})

$(document).on("click", ".btn-replacedespc", function() {
	if(!isInputChange()){
		ufma.showTip("当前凭证不可修改")
	}
	if(searchdespclength == 0){
		searchdespclength = 1;
	}
	if($('.searchdespc:checked').hasClass('searchnowcw')){
		if($(".voucher").hasClass('voucher-singelzy')){
			searchdespc($('.voucher-centercw'),searchdespclength,$("#replacedespcinput").val())
		}else if($(".voucher").hasClass('voucher-singel')){
			searchdespc($('.voucher-center-cw'),searchdespclength,$("#replacedespcinput").val())
		}else{
			searchdespc($('.voucher-center'),searchdespclength,$("#replacedespcinput").val())
		}
	}else if($('.searchdespc:checked').hasClass('searchnowys')){
		if($(".voucher").hasClass('voucher-singelzy')){
			searchdespc($('.voucher-centerys'),searchdespclength,$("#replacedespcinput").val())
		}else if($(".voucher").hasClass('voucher-singel')){
			searchdespc($('.voucher-center-ys'),searchdespclength,$("#replacedespcinput").val())
		}else{
			searchdespc($('.voucher-center'),searchdespclength,$("#replacedespcinput").val())
		}
	}else if($('.searchdespc:checked').hasClass('searchall')){
		searchdespc($('.voucher-center'),searchdespclength,$("#replacedespcinput").val())
	}
})

$(document).on("click", ".btn-replacedespcAll", function() {
	if(!isInputChange()){
		ufma.showTip("当前凭证不可修改")
	}
	if($('.searchdespc:checked').hasClass('searchnowcw')){
		if($(".voucher").hasClass('voucher-singelzy')){
			replacedespcAll($('.voucher-centercw'))
		}else if($(".voucher").hasClass('voucher-singel')){
			replacedespcAll($('.voucher-center-cw'))
		}else{
			replacedespcAll($('.voucher-center'))
		}
	}else if($('.searchdespc:checked').hasClass('searchnowys')){
		if($(".voucher").hasClass('voucher-singelzy')){
			replacedespcAll($('.voucher-centerys'))
		}else if($(".voucher").hasClass('voucher-singel')){
			replacedespcAll($('.voucher-center-ys'))
		}else{
			replacedespcAll($('.voucher-center'))
		}
	}else if($('.searchdespc:checked').hasClass('searchall')){
		replacedespcAll($('.voucher-center'))
	}
})