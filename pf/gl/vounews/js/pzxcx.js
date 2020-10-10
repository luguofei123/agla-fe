if(getUrlParam("dataFrom") == "vouBox" && getUrlParam("action") == "query") {
	var param = {};
	if(getUrlParam("dataFrom") == "vouBox" && vouboxtrue == true) {
		param = JSON.parse(window.sessionStorage.getItem("cacheData"));
		//		sddddd	
	} else {
		var voucherdwsese = rpt.nowAgencyCode;
		var voucherztsese = rpt.nowAcctCode;
		param.agencyCode = voucherdwsese;
		param.acctCode = voucherztsese;
		if($(".xuanzhongcy").hasClass("chaiwu")) {
			param.accaCode = 1;
		} else {
			param.accaCode = 2;
		}
		if(vousinglepz == true || vousinglepzzy == true) {
			param.accaCode = '*';
		}
		var myDate = new Date(Date.parse(dd.replace(/-/g, "/")));
		param.fisPerd = (new Date(ufgovkey.svTransDate).getMonth()) + 1;
	} //期间
	//期间
	function showVou() {
		var vouguid = getUrlParam("vouGuid");
		$.ajax({
			type: "get",
			url: "/gl/vou/getVou/" + vouguid + "?ajax=1&rueicode="+hex_md5svUserCode,
			async: true,
			success: function(data) {
				if(data.flag == "success" && data.data != null) {
					dataforcwys(data.data)
					if(getUrlParam("vouAccaCode") == "1") {
						selectdata.data = quanjuvouchaiwu;
						$(".chaiwu").addClass("xuanzhongcy");
						$(".yusuan").removeClass("xuanzhongcy");
					} else if(getUrlParam("vouAccaCode") == "2") {
						selectdata.data = quanjuvouyusuan;
						$(".chaiwu").removeClass("xuanzhongcy");
						$(".yusuan").addClass("xuanzhongcy");
					}
					setTimeout(function() {
						cwyspd();
						chapz();
						zhuantai();
						if(quanjuvouyusuan != null && quanjuvouchaiwu != null) {
							if($(".yusuan").hasClass('xuanzhongcy')) {
								$(".chaiwu").trigger('click');
								var timeId = setTimeout(function() {
									$(".yusuan").trigger('click');
									clearTimeout(timeId);
								}, 100);
							} else if($(".chaiwu").hasClass('xuanzhongcy')) {
								$(".yusuan").trigger('click');
								var timeId = setTimeout(function() {
									$(".chaiwu").trigger('click');
									clearTimeout(timeId);
								}, 100);
							}
						}
					}, 200)
				} else if(data.flag == "success" && data.data == null) {
					ufma.showTip('该凭证不存在，请刷新页面', function() {}, "warning");
				} else {
					ufma.showTip(data.msg, function() {}, "error");
				}
			},
			error: function(data) {
				ufma.showTip("未取到凭证信息", function() {}, "error")
			}
		});
	}
	var acctName = getUrlParam("acctName");
	if(acctName) {
		var acctCode = $.bof(acctName, ']');
		param.acctCode = $.eof(acctCode, '[');
		rpt.cbAcct.val(param.acctCode);
		var timeId = setTimeout(function() {
			showVou();
			clearTimeout(timeId);
		}, 200);
	} else {
		showVou();
	}
}
if(getUrlParam("dataFrom") != "vouBox" && getUrlParam("action") == "query") {
	var vouguid = getUrlParam("vouGuid");
	$.ajax({
		type: "get",
		url: "/gl/vou/getVou/" + vouguid + "?ajax=1&rueicode="+hex_md5svUserCode,
		async: true,
		success: function(data) {
			if(data.flag == "success") {
				var csagencyCode = "";
				var csacctCode = "";
				if(data.data[0] != null && data.data[0] != '') {
					csagencyCode = data.data[0].agencyCode
					csacctCode = data.data[0].acctCode
				} else {
					csagencyCode = data.data[1].agencyCode
					csacctCode = data.data[1].acctCode
				}
				rpt.cbAgency.val(csagencyCode);
				rpt.cbAcct.val(csacctCode);
				rpt.nowAgencyCode = rpt.cbAgency.getValue();
				rpt.nowAgencyName = rpt.cbAgency.getText();
				rpt.nowAcctCode = rpt.cbAcct.getValue();
				rpt.nowAcctName = rpt.cbAcct.getText();
				var param = {};
				var voucherdwsese = rpt.nowAgencyCode;
				var voucherztsese = rpt.nowAcctCode;
				param.agencyCode = voucherdwsese;
				param.acctCode = voucherztsese;
				var myDate = new Date(Date.parse(dd.replace(/-/g, "/")));
				param.fisPerd = (new Date(ufgovkey.svTransDate).getMonth()) + 1;
				var agencyCode = rpt.nowAgencyCode;
				$(".voucherhe").find("#sppz").val("*");
				$("#fjd").val("");
				$("#pzzhuantai").hide();
				$(".chaiwu").addClass("xuanzhongcy").removeAttr("names");
				$(".yusuan").removeClass("xuanzhongcy").removeAttr("names");
				$("#leftbgselect").prop("disabled", false)
//				$(".voucher").remove();
//				voucheralls()
//				vouluru();
				quanjuvouchaiwu = {}
				quanjuvouyusuan = {}
				selectdata = {};
				selectdata.data = {}
				dataforcwys(data.data)
				setTimeout(function() {
					cwyspd();
					chapz();
					zhuantai();
					if(quanjuvouyusuan != null && quanjuvouchaiwu != null) {
						if($(".yusuan").hasClass('xuanzhongcy')) {
							$(".chaiwu").trigger('click');
							var timeId = setTimeout(function() {
								$(".yusuan").trigger('click');
								clearTimeout(timeId);
							}, 100);
						} else if($(".chaiwu").hasClass('xuanzhongcy')) {
							$(".yusuan").trigger('click');
							var timeId = setTimeout(function() {
								$(".chaiwu").trigger('click');
								clearTimeout(timeId);
							}, 100);
						}
					}
					//序时账跳转定位分录辅助行
					if(getUrlParam("deguid")!=undefined && getUrlParam("deguid")!='undefined'){
						if(getUrlParam("desguid")!='' && getUrlParam("desguid")!=undefined){
							var deguid = getUrlParam("deguid")
							var desguid = getUrlParam("desguid")
							var ths = $(".voucher-center[namesss="+deguid+"]")
							if(ths.find('.fuyan').css('display')!="none"){
								ths.find('.fuyan').click()
							}
							var key1= $('.voucher-center').eq(0).offset().top
							if(ths.parents(".voubodyscroll").length>0){
								var toplen = ths.offset().top -key1
								$("voubodyscroll").scrollTop(toplen);
								var keys = $(".voucher-yc").find('.voucher-yc-bo').eq(0).offset().top
								var assh =ths.find('.voucher-yc').find('.voucher-yc-bo[namessss="'+desguid+'"]')
								assh.addClass('voucher-center-active')
								var toplenass = assh.offset().top -keys
								$(".voucher-yc").scrollTop(toplenass);
							}else{
								var assh =ths.find('.voucher-yc').find('.voucher-yc-bo[namessss="'+desguid+'"]')
								assh.addClass('voucher-center-active')
								var toplenass = assh.offset().top -key1
								$("html").scrollTop(toplenass);
								var keys = ths.find(".voucher-yc").find('.voucher-yc-bo').eq(0).offset().top
								var toplenass = assh.offset().top -keys
								ths.find(".voucher-yc").scrollTop(toplenass);
							}
						}else{
							var deguid = getUrlParam("deguid")
							var ths = $(".voucher-center[namesss='"+deguid+"']")
							var key1= $('.voucher-center').eq(0).offset().top
							ths.addClass("voucher-center-active")
							if(ths.parents(".voubodyscroll").length>0){
								var toplen = ths.offset().top -key1
								$("voubodyscroll").scrollTop(toplen);
							}else{
								var toplen = ths.offset().top -key1
								$("html").scrollTop(toplen);
							}
						}
					}
				}, 200)
			} else {
				ufma.showTip(data.msg, function() {}, "error");
			}
		},
		error: function(data) {
			ufma.showTip("未取到凭证信息", function() {}, "error")
		}
	})
};
if(getUrlParam("action") == "preview") {
	//	var csagencyCode = "";
	//	var csacctCode = "";
	//	if (window.ownerData[0] != null) {
	//		csagencyCode = window.ownerData[0].agencyCode
	//		csacctCode = window.ownerData[0].acctCode
	//	} else {
	//		csagencyCode = window.ownerData[1].agencyCode
	//		csacctCode = window.ownerData[1].acctCode
	//	}
	//	rpt.cbAgency.val(csagencyCode);
	//	rpt.cbAcct.val(csacctCode);
	rpt.nowAgencyCode = rpt.cbAgency.getValue();
	rpt.nowAgencyName = rpt.cbAgency.getText();
	rpt.nowAcctCode = rpt.cbAcct.getValue();
	rpt.nowAcctName = rpt.cbAcct.getText();
	dataforcwys(window.ownerData)
	setTimeout(function() {
		cwyspd();
		chapz();
		zhuantai();
		ufma.showloading('正在识别未录入辅助核算，请耐心等待...');
		setTimeout(function() {
			for(var i = 0; i < selectdata.data.vouDetails.length; i++) {
				if(selectdata.data.vouDetails[i].accoAssIsNullSum > 0){
					$(".voucher-center").eq(i).find('.accounting').find('.fuyan').trigger('click')
					break;
				}
			}
			ufma.hideloading();
		}, 200)
	}, 200)
};

if(getUrlParam("action") == "voumodel" && window.ownerData.action != "add") {
	rpt.nowAgencyCode = window.ownerData.agencyCode
	rpt.nowAgencyName = rpt.cbAgency.getText();
	rpt.nowAcctCode = window.ownerData.acctCode
	rpt.nowAcctName = rpt.cbAcct.getText();
	$('.voucherall').addClass('mobanhide')
	if(!$.isNull(window.ownerData.modelId)) {
		ufma.showloading('正在加载模板，请耐心等待...');
		$.ajax({
			type: "get",
			url: "/gl/vouTemp/getTempPairFromVou/" + window.ownerData.modelId + "/" + rpt.nowAgencyCode + "/" + rpt.nowAcctCode + "/" + ufgovkey.svRgCode + "/" + ufgovkey.svSetYear +"?ajax=1&rueicode="+hex_md5svUserCode,
			async: false,
			success: function(data) {
				if(data.flag == "success") {
					mobanneirong.data = data.data;
					selectdata.data = {};
					quanjuvouchaiwu = {};
					quanjuvouyusuan = {};
					if(mobanneirong.data.cwVouTempVo != null && mobanneirong.data.cwVouTempVo != '') {
						quanjuvouchaiwu.vouDetails = mobanneirong.data.cwVouTempVo.vouDetails;
						quanjuvouchaiwu.vouTypeCode = mobanneirong.data.cwVouTempVo.vouTypeCode;
						if(mobanneirong.data.cwVouTempVo.templateName!=''){
							$('#voumodalname').val(mobanneirong.data.cwVouTempVo.templateName)
						}
						if(mobanneirong.data.cwVouTempVo.description!=''){
							$("#voumodalnamesel").val(mobanneirong.data.cwVouTempVo.description)
						}
					} else {
						selectdata.data.accaCode = 2
						quanjuvouchaiwu = null;
					}
					if(mobanneirong.data.ysVouTempVo != null && mobanneirong.data.ysVouTempVo != '') {
						quanjuvouyusuan.vouDetails = mobanneirong.data.ysVouTempVo.vouDetails;
						quanjuvouyusuan.vouTypeCode = mobanneirong.data.ysVouTempVo.vouTypeCode;
						if(mobanneirong.data.ysVouTempVo.templateName!=''){
							$('#voumodalname').val(mobanneirong.data.ysVouTempVo.templateName)
						}
						if(mobanneirong.data.ysVouTempVo.description!=''){
							$("#voumodalnamesel").val(mobanneirong.data.ysVouTempVo.description)
						}
					} else {
						selectdata.data.accaCode = 1
						quanjuvouyusuan = null;
					}
					if((mobanneirong.data.cwVouTempVo != null && mobanneirong.data.ysVouTempVo != null) && (mobanneirong.data.cwVouTempVo != '' && mobanneirong.data.ysVouTempVo != '')) {
						if($(".xuanzhongcy").hasClass("chaiwu")) {
							selectdata.data.vouDetails = mobanneirong.data.cwVouTempVo.vouDetails;
							selectdata.data.vouTypeCode = mobanneirong.data.cwVouTempVo.vouTypeCode;
						} else {
							selectdata.data.vouDetails = mobanneirong.data.ysVouTempVo.vouDetails;
							selectdata.data.vouTypeCode = mobanneirong.data.ysVouTempVo.vouTypeCode;
						}
					} else if(mobanneirong.data.cwVouTempVo != null && mobanneirong.data.cwVouTempVo != '') {
						selectdata.data.vouTypeCode = mobanneirong.data.cwVouTempVo.vouTypeCode
						selectdata.data.vouDetails = mobanneirong.data.cwVouTempVo.vouDetails;
					} else if(mobanneirong.data.ysVouTempVo != null && mobanneirong.data.ysVouTempVo != '') {
						selectdata.data.vouTypeCode = mobanneirong.data.ysVouTempVo.vouTypeCode
						selectdata.data.vouDetails = mobanneirong.data.ysVouTempVo.vouDetails;
					}
					if(vousinglepz == true || vousinglepzzy == true){
						var vouDetailss = []
						if((mobanneirong.data.cwVouTempVo != null && mobanneirong.data.ysVouTempVo != null) && (mobanneirong.data.cwVouTempVo != '' && mobanneirong.data.ysVouTempVo != '')) {
							selectdata.data.vouDetails = mobanneirong.data.cwVouTempVo.vouDetails;
							selectdata.data.vouTypeCode = mobanneirong.data.cwVouTempVo.vouTypeCode;
							for(var i=0;i< mobanneirong.data.ysVouTempVo.vouDetails.length;i++){
								selectdata.data.vouDetails.push(mobanneirong.data.ysVouTempVo.vouDetails[i])
							}
						}
					}
					prevnextvoucher = -1;
					$(".xuanzhongcy").removeAttr("names");
					$("#fjd").val("");
					$("#pzzhuantai").hide().text("").removeAttr("vou-status");
					$(".voucher").remove();
					voucheralls();
					zhuantai();
					$("#zezhao").hide();
					$("body").css("overflow-y", "auto");
					chapz();
					if(optNoType==0){
						MaxVouNoUp()
					}
					vouluru();
					$("#dates").getObj().setValue(result);
					if(mobanneirong.data.cwVouTempVo != null && mobanneirong.data.ysVouTempVo != null && rpt.isDoubleVou == 1 && rpt.isDoubleVou) {
						changeCWYS();
					}
					ufma.hideloading();
				}
			}
		})
	}
}else if(getUrlParam("action") == "voumodel"){
	rpt.nowAgencyCode = window.ownerData.agencyCode
	rpt.nowAgencyName = rpt.cbAgency.getText();
	rpt.nowAcctCode = window.ownerData.acctCode
	rpt.nowAcctName = rpt.cbAcct.getText();
	$('.voucherall').addClass('mobanhide')
}
window.addEventListener('message', function (e) {
	if (e.data.hasOwnProperty('messageType') && e.data.messageType == 'clientWidth') {
		page.isCrossDomain = true;
	} else {
		page.isCrossDomain = false;
	}
})
page.openNewPages = function (isCrossDomain, that, actionType, baseUrl, isNew, title) {
	try{var href = window.top.location.href}catch(e){isCrossDomain = true}
	var roleId = getUrlParam('roleId')
	if($.isNull(roleId)) {
		roleId = ufma.getCommonData().svRoleId
	}
	if (isCrossDomain) {
		// 此处即为监听到跨域
		var data = {
			actionType: actionType, // closeMenu 关闭   openMenu 打开
			url: window.location.protocol + '//'+ window.location.host  + baseUrl+ '&roleId=' + roleId,
			isNew: isNew, // isNew: false表示在iframe中打开，为true的话就是在新页面打开
			title: title // 菜单标题
		}
		if(getUrlParam("action") == "preview") {
			window.parent.parent.postMessage(data, '*')
		}else{
			window.parent.postMessage(data, '*')
		}
	} else {
		//门户打开方式
		that.attr('data-href', baseUrl+ '&roleId=' + roleId);
		that.attr('data-title', title);
		if(getUrlParam("action") == "preview") {
			window.parent.parent.openNewMenu(that);
		}else{
			window.parent.openNewMenu(that);
		}
	}
};
$("#zezhao").html("");
$("#zezhao").hide();
vouisendsel = true