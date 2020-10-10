//悬浮提示
$(document).on("mousemove", ".ycbodyinp", function(e) {
	$(this).attr('title', $(this).val())
})
//辅助核算项的改写
//当点击了enter的时候跳到焦点下一个输入框
//点击时候选中所有内容并失去焦点
$(document).on("click", ".ycbodyinp", function(e) {
	var editStatus0 = ($("#pzzhuantai").attr("vou-status") == undefined);
	if(!editStatus0) {
		var editStatus1 = ($("#pzzhuantai").attr("vou-status") == "O");
		var editStatus2 = (isInputor == true && (selectdata.data.inputor == ufgovkey.svUserId || selectdata.data.inputor == undefined));
		var editStatus3 = ((isvousource && isvousourceclick == false) || isvousourceclick)
		if(editStatus1 && (editStatus2 || isInputor == false) && editStatus3) {
			$(this).removeAttr("readonly");
		} else {
			$(this).attr("readonly", true);
			return false;
		}
	} else {
		$(this).removeAttr("readonly");
		$(this).focus();
	}
	stopPropagation(e);
	$(".all-no").hide();
})
$(document).on("focus", ".ycbodyinp", function(e) {
	$('.ycbodyinp').removeClass('assCheck')
	$(this).addClass('assCheck')
	$(".ycbodys").hide()
	if($(this).attr('relation') != undefined) {
		var sctop = $(this).offset().top - $(window).scrollTop() - $(this).parents('.voucher-yc-bg').scrollTop() + 50
		var scbottom = $(this).offset().top - $(window).scrollTop() - $(this).parents('.voucher-yc-bg').scrollTop()-302
		var scleft = $(this).offset().left - $(window).scrollLeft()
		var widthass = $(this).width()
		var relation = $(this).attr('relation')
		if(sctop>scbottom){
			$('#AssDataAll').find("." + relation).show().css({
				'position': 'fixed',
				'top': scbottom,
				'height':'300px',
				'left': scleft,
				'width': widthass + 'px'
			});
		}else{
			$('#AssDataAll').find("." + relation).show().css({
				'position': 'fixed',
				'top': sctop,
				'height':'',
				'left': scleft,
				'width': widthass + 'px'
			});
		}
		if($(this).attr('relation') == 'employeeCode'){
			if($(this).parents('.voucher-yc-bo').find('.ycbodyinp[relation="departmentCode"]').length>0 && $(this).parents('.voucher-yc-bo').find('.ycbodyinp[relation="departmentCode"]').attr('code')!=undefined){
				var  departmentCode = $(this).parents('.voucher-yc-bo').find('.ycbodyinp[relation="departmentCode"]').attr('code')
				ufma.get('/gl/vou/getEmployeeList/'+rpt.nowAgencyCode+'/'+rpt.nowAcctCode+'/'+departmentCode,'',function(result){
					var employeeCodedata = result.data
					var assnoll = ''
					if(employeeCodedata.length>100){
						var nowlen = 0
						for(var n = 0; n < employeeCodedata.length; n++) {
							if(employeeCodedata[n].enabled == 1) {
								if(employeeCodedata[n].levelNum == 1 && nowlen<100){
									nowlen++;
									assnoll += '<li datalen = '+n+' department = "'+employeeCodedata[n].departmentCode+'" levels = "' + employeeCodedata[n].levelNum + '" fname="' + employeeCodedata[n].chrFullname + '" class="PopListBoxItem unselected  dianji' + employeeCodedata[n].isLeaf + ' fzlv' + employeeCodedata[n].levelNum + ' "><p class="sq"><span class="code">' + employeeCodedata[n].code + '</span>  <span class="name">' + employeeCodedata[n].name + '</span></p></li>'
								}else if(employeeCodedata[n].levelNum == 1 && nowlen>=100){
									assnoll += '<div class="">当前辅助项数量较多，点击加载剩余辅助项</div>'
								}
							}
						}
					}else{
						for(var n = 0; n < employeeCodedata.length; n++) {
							if(employeeCodedata[n].enabled == 1) {
								if(employeeCodedata[n].levelNum == 1){
									assnoll += '<li department = "'+employeeCodedata[n].departmentCode+'" levels = "' + employeeCodedata[n].levelNum + '" fname="' + employeeCodedata[n].chrFullname + '" class="PopListBoxItem unselected  dianji' + employeeCodedata[n].isLeaf + ' fzlv' + employeeCodedata[n].levelNum + ' "><p class="sq"><span class="code">' + employeeCodedata[n].code + '</span>  <span class="name">' + employeeCodedata[n].name + '</span></p></li>'
								}else{
									assnoll += '<li department = "'+employeeCodedata[n].departmentCode+'" style="display:none;" levels = "' + employeeCodedata[n].levelNum + '" fname="' + employeeCodedata[n].chrFullname + '" class="unselected  dianji' + employeeCodedata[n].isLeaf + ' fzlv' + employeeCodedata[n].levelNum + ' "><p><span class="code">' + employeeCodedata[n].code + '</span>  <span class="name">' + employeeCodedata[n].name + '</span></p></li>'
								}
							} else {
								assnoll += '<li levels = "' + employeeCodedata[n].levelNum + '" fname="' + employeeCodedata[n].chrFullname + '" class=" unselected allnoshow  dianji' + employeeCodedata[n].isLeaf + ' fzlv' + employeeCodedata[n].levelNum + ' "><p><span class="code">' + employeeCodedata[n].code + '</span>  <span class="name">' + employeeCodedata[n].name + '</span></p></li>'
							}
						}
					}
					if(isaddAssbtn==true){
						assnoll += '<div class="fzhsadd" tzurl ="departmentCode">+新增 人员</div>'
					}
					$('#AssDataAll').find('.employeeCode').html(assnoll).attr('Part','und')
				})
			
			}else if($('#AssDataAll').find(".employeeCode").attr('Part') == 'und'){
				var l = 'employeeCode'
				$('#AssDataAll').find('.employeeCode').html('')
				var assnoll = ''
				if(fzhsxl[l].length>100){
					var nowlen = 0
					for(var n = 0; n < fzhsxl[l].length; n++) {
						if(fzhsxl[l][n].enabled == 1) {
							if(fzhsxl[l][n].levelNum == 1 && nowlen<100){
								nowlen++;
								assnoll += '<li datalen = '+n+' department = "'+fzhsxl[l][n].departmentCode+'" levels = "' + fzhsxl[l][n].levelNum + '" fname="' + fzhsxl[l][n].chrFullname + '" class="PopListBoxItem unselected  dianji' + fzhsxl[l][n].isLeaf + ' fzlv' + fzhsxl[l][n].levelNum + ' "><p class="sq"><span class="code">' + fzhsxl[l][n].code + '</span>  <span class="name">' + fzhsxl[l][n].name + '</span></p></li>'
							}else if(fzhsxl[l][n].levelNum == 1 && nowlen>=100){
								assnoll += '<div class="">当前辅助项数量较多，点击加载剩余辅助项</div>'
							}
						}
					}
				}else{
					for(var n = 0; n < fzhsxl[l].length; n++) {
						if(fzhsxl[l][n].enabled == 1) {
							if(fzhsxl[l][n].levelNum == 1){
								assnoll += '<li department = "'+fzhsxl[l][n].departmentCode+'" levels = "' + fzhsxl[l][n].levelNum + '" fname="' + fzhsxl[l][n].chrFullname + '" class="PopListBoxItem unselected  dianji' + fzhsxl[l][n].isLeaf + ' fzlv' + fzhsxl[l][n].levelNum + ' "><p class="sq"><span class="code">' + fzhsxl[l][n].code + '</span>  <span class="name">' + fzhsxl[l][n].name + '</span></p></li>'
							}else{
								assnoll += '<li department = "'+fzhsxl[l][n].departmentCode+'" style="display:none;" levels = "' + fzhsxl[l][n].levelNum + '" fname="' + fzhsxl[l][n].chrFullname + '" class="unselected  dianji' + fzhsxl[l][n].isLeaf + ' fzlv' + fzhsxl[l][n].levelNum + ' "><p><span class="code">' + fzhsxl[l][n].code + '</span>  <span class="name">' + fzhsxl[l][n].name + '</span></p></li>'
							}
						} else {
							assnoll += '<li levels = "' + fzhsxl[l][n].levelNum + '" fname="' + fzhsxl[l][n].chrFullname + '" class=" unselected allnoshow  dianji' + fzhsxl[l][n].isLeaf + ' fzlv' + fzhsxl[l][n].levelNum + ' "><p><span class="code">' + fzhsxl[l][n].code + '</span>  <span class="name">' + fzhsxl[l][n].name + '</span></p></li>'
						}
					}
				}
				if(isaddAssbtn==true){
					assnoll += '<div class="fzhsadd" tzurl = ' + l + '>+新增 ' + tablehead[l].ELE_NAME + '</div>'
				}
				$('#AssDataAll').find('.employeeCode').html(assnoll).removeAttr('Part')
			}
		}
	}
	if(isclick0 == 0 && !ie11compatibleass) {
		if($(this).val() == '') {
			var trall = $(this).parents('.voucher-yc-bg')
			var trthis = $(this).parents('.voucher-yc-bo')
			$('#AssDataAll').find("." + relation).find('li').removeClass("selected").addClass("unselected").removeClass('PopListBoxItem').hide()
			$('#AssDataAll').find("." + relation).find('li[levels=1]').addClass('PopListBoxItem').show()
			$('#AssDataAll').find("." + relation).find('li[levels=1]').find('p').addClass('sq')
			$('#AssDataAll').find("." + relation).find('.noallassno').remove()
			for(var i = 0; i < trall.find('.voucher-yc-bt').find('.ychead').length; i++) {
				var  now = trthis.find('.ycbody').eq(i).find('.ycbodyinp').attr('relation')
				if(trall.find('.voucher-yc-bt').find('.ychead').eq(i).attr('mrvalue') != undefined) {
					var lun = $('#AssDataAll').find("." + now)
					var datanocla = fzhsxl[now]
					if(trthis.find('.ycbody').eq(i).find('.ycbodyinp').val() == '') {
						for(var z = 0; z < datanocla.length; z++) {
							if(datanocla[z].code == trall.find('.voucher-yc-bt').find('.ychead').eq(i).attr('mrvalue') && datanocla[z].isLeaf!=0) {
								if(isaccfullname){
									trthis.find('.ycbody').eq(i).find('.ycbodyinp').val(datanocla[z].code + ' ' + datanocla[z].chrFullname).attr('code',datanocla[z].code)
								}else{
									trthis.find('.ycbody').eq(i).find('.ycbodyinp').val(datanocla[z].code + ' ' + datanocla[z].name).attr('code',datanocla[z].code)
								}
							}
						}
					}
				}
			}
			if($('#AssDataAll').find("." + relation).attr('isAlllength')=='now'){
				var datanocla = fzhsxl[relation]
				var nowlen = 0;
				var assnoll = ''
				$("#AssDataAll").find('.'+ relation).html('')
				for(var n = 0; n < datanocla.length; n++) {
					if(datanocla[n].enabled == 1) {
						if(datanocla[n].levelNum == 1 && nowlen<100){
							nowlen++;
							assnoll += '<li datalen = '+n+' department = "'+datanocla[n].departmentCode+'" levels = "' + datanocla[n].levelNum + '" fname="' + datanocla[n].chrFullname + '" class="PopListBoxItem unselected  dianji' + datanocla[n].isLeaf + ' fzlv' + datanocla[n].levelNum + ' "><p class="sq"><span class="code">' + datanocla[n].code + '</span>  <span class="name">' + datanocla[n].name + '</span></p></li>'
						}else if(datanocla[n].levelNum == 1 && nowlen>=100){
							break;
						}
					}
				}
				if(tablehead[relation]!=undefined && isaddAssbtn==true){
					assnoll += '<div class="fzhsadd" tzurl = ' + relation+ '>+新增 ' + tablehead[relation].ELE_NAME + '</div>'
				}
				$("#AssDataAll").find('.'+ relation).html(assnoll)
			}
			if($(this).val()!=''){
				$(this).val($(this).attr('code'))
				$(this).trigger('input')
			}
		} else {
			if($(this).attr('code') != undefined && $(this).hasClass('diffTermDirinp') != true) {
				$(this).val($(this).attr('code'))
				$(this).trigger('input')
			}
		}
	}
})

var moneyzy = 0;
var scrollhide = 0
//辅助项input
$(document).on("keydown", ".ycbodyinp", function(event) {
	event = event || window.event;
	_this = $(this);
	if(event.keyCode == "27") {
		event.preventDefault();
		event.keyCode = 0;
		event.preventDefault();
		event.returnValue = false;
		$(this).blur();
		var s = 0;
		for(var i = 0; i < $(this).parents(".voucher-yc").find(".yctz").length; i++) {
			if($(this).parents(".voucher-yc").find(".yctz").eq(i).val() != "") {
				s += parseFloat($(this).parents(".voucher-yc").find(".yctz").eq(i).val());
			}
		}
		if(s > 0) {
			s = s.toFixed(2);
			var n = s
			if(s < 10000000000 && vousinglepz == false && vousinglepzzy == false) {
				n = s.replace(".", "");
			}
		} else if(s == 0) {
			$(this).parents(".voucher-yc").prevAll(".moneyj").find(".money-sr").val("");
			$(this).parents(".voucher-yc").prevAll(".moneyj").find(".money-xs").html("");
		}
		if($(this).parents(".voucher-center").next(".voucher-center").length < 1) {
			$(".voucherall").height($(".voucherall").height() + 50);

			
			$(this).parents(".voucher-center").after(tr());
		} else {
			var se = 0;
			var sl = $(this).parents(".voucher-center").nextAll(".voucher-center").length
			for(var i = 0; i < sl; i++) {
				if($(this).parents(".voucher-center").nextAll(".voucher-center").eq(i).attr('op') == 2) {
					se++;
				}
			}
			if(se == sl) {
				$(".voucherall").height($(".voucherall").height() + 50);

				
				$(this).parents(".voucher-center").after(tr());
			}
		};
		newvueTypesetting()
		setTimeout(function() {
			_this.parents(".voucher-yc").hide();
			$(".voucherall").height($(".voucherall").height() - _this.parents(".voucher-yc").outerHeight())
			voucherycshowheight()
			
			if(vousinglepzzy) {
				_this.parents(".voucher-yc").parents(".voucher-body").next(".voucher-center").next(".voucher-center").find(".abstractinp").focus();
				_this.parents(".voucher-yc").parents(".voucher-body").next(".voucher-center").next(".voucher-center").find(".abstractinp").val(_this.parents(".voucher-center").find(".abstractinp").val())
			} else {
				_this.parents(".voucher-yc").parents(".voucher-body").next(".voucher-center").find(".abstractinp").focus();
				_this.parents(".voucher-yc").parents(".voucher-body").next(".voucher-center").find(".abstractinp").val(_this.parents(".voucher-center").find(".abstractinp").val())
			}
		}, 50)
		if($(this).parents(".voucher-center").find(".moneyj").find('.money-sr').hasClass("money-ys")) {
			if(vousinglepzzy != true) {
				if($(this).parents(".voucher-center").next(".voucher-center").find(".money-ys").length < 1) {
					var jm = 0;
					var dm = 0;
					for(var i = 0; i < $(".voucher-center").length; i++) {
						if($(".voucher-center").eq(i).find(".moneyd").find(".money-sr").val() != "") {
							dm += parseFloat($(".voucher-center").eq(i).find(".moneyd").find(".money-sr").val());
						}
						if($(".voucher-center").eq(i).find(".moneyj").find(".money-sr").val() != "") {
							jm += parseFloat($(".voucher-center").eq(i).find(".moneyj").find(".money-sr").val());
						}
					}
					if(jm > dm) {
						var nextjsr = $(this).parents(".voucher-center").next(".voucher-center").find(".moneyj").find(".money-sr").val();
						var nextdsr = $(this).parents(".voucher-center").next(".voucher-center").find(".moneyd").find(".money-sr").val();
						if((jm - dm) >= 10000000000 || vousinglepz == true || vousinglepzzy == true) {
							$(this).parents(".voucher-center").next(".voucher-center").find(".moneyd").find(".money-xs").html(formatNum((jm - dm).toFixed(2)));
						} else {
							$(this).parents(".voucher-center").next(".voucher-center").find(".moneyd").find(".money-xs").html(((jm - dm) * 100).toFixed(0));
						}
						$(this).parents(".voucher-center").next(".voucher-center").find(".moneyd").find(".money-sr").val((jm - dm).toFixed(2));
						$(this).parents(".voucher-center").next(".voucher-center").find(".moneyd").addClass("money-ys")
						$(this).parents(".voucher-center").next(".voucher-center").find(".moneyj").find(".money-xs").html("");
						$(this).parents(".voucher-center").next(".voucher-center").find(".moneyj").find(".money-sr").val("");
						$(this).parents(".voucher-center").next(".voucher-center").find(".moneyj").removeClass("money-ys")
						//break;
					} else if(dm > jm) {
						if((dm - jm) >= 10000000000 || vousinglepz == true || vousinglepzzy == true) {
							$(this).parents(".voucher-center").next(".voucher-center").find(".moneyj").find(".money-xs").html(formatNum((dm - jm).toFixed(2)));
						} else {
							$(this).parents(".voucher-center").next(".voucher-center").find(".moneyj").find(".money-xs").html(((dm - jm) * 100).toFixed(0));
						}
						$(this).parents(".voucher-center").next(".voucher-center").find(".moneyj").find(".money-sr").val((dm - jm).toFixed(2));
						$(this).parents(".voucher-center").next(".voucher-center").find(".moneyj").addClass("money-ys")
						$(this).parents(".voucher-center").next(".voucher-center").find(".moneyd").find(".money-xs").html("");
						$(this).parents(".voucher-center").next(".voucher-center").find(".moneyd").find(".money-sr").val("");
						$(this).parents(".voucher-center").next(".voucher-center").find(".moneyd").removeClass("money-ys")
						//break;
					}
				}
			}
			if(vousinglepzzy) {
				if($(this).parents(".voucher-center").next(".voucher-center").next(".voucher-center").find(".money-ys").length < 1) {
					var jm = 0;
					var dm = 0;
					if($(this).parents(".voucher-center").hasClass('voucher-centercw')) {
						for(var i = 0; i < $(".voucher-centercw").length; i++) {
							if($(".voucher-centercw").eq(i).find(".moneyd").find(".money-sr").val() != "") {
								dm += parseFloat($(".voucher-centercw").eq(i).find(".moneyd").find(".money-sr").val());
							}
							if($(".voucher-centercw").eq(i).find(".moneyj").find(".money-sr").val() != "") {
								jm += parseFloat($(".voucher-centercw").eq(i).find(".moneyj").find(".money-sr").val());
							}
						}
					} else {
						for(var i = 0; i < $(".voucher-centerys").length; i++) {
							if($(".voucher-centerys").eq(i).find(".moneyd").find(".money-sr").val() != "") {
								dm += parseFloat($(".voucher-centerys").eq(i).find(".moneyd").find(".money-sr").val());
							}
							if($(".voucher-centerys").eq(i).find(".moneyj").find(".money-sr").val() != "") {
								jm += parseFloat($(".voucher-centerys").eq(i).find(".moneyj").find(".money-sr").val());
							}
						}
					}
					if(jm > dm) {
						var nextjsr = $(this).parents(".voucher-center").next(".voucher-center").next(".voucher-center").find(".moneyj").find(".money-sr").val();
						var nextdsr = $(this).parents(".voucher-center").next(".voucher-center").next(".voucher-center").find(".moneyd").find(".money-sr").val();
						if((jm - dm) >= 10000000000 || vousinglepz == true || vousinglepzzy == true) {
							$(this).parents(".voucher-center").next(".voucher-center").next(".voucher-center").find(".moneyd").find(".money-xs").html(formatNum((jm - dm).toFixed(2)));
						} else {
							$(this).parents(".voucher-center").next(".voucher-center").next(".voucher-center").find(".moneyd").find(".money-xs").html(((jm - dm) * 100).toFixed(0));
						}
						$(this).parents(".voucher-center").next(".voucher-center").next(".voucher-center").find(".moneyd").find(".money-sr").val((jm - dm).toFixed(2));
						$(this).parents(".voucher-center").next(".voucher-center").next(".voucher-center").find(".moneyd").addClass("money-ys")
						$(this).parents(".voucher-center").next(".voucher-center").next(".voucher-center").find(".moneyj").find(".money-xs").html("");
						$(this).parents(".voucher-center").next(".voucher-center").next(".voucher-center").find(".moneyj").find(".money-sr").val("");
						$(this).parents(".voucher-center").next(".voucher-center").next(".voucher-center").find(".moneyj").removeClass("money-ys")
						//break;
					} else if(dm > jm) {
						if((dm - jm) >= 10000000000 || vousinglepz == true || vousinglepzzy == true) {
							$(this).parents(".voucher-center").next(".voucher-center").next(".voucher-center").find(".moneyj").find(".money-xs").html(formatNum((dm - jm).toFixed(2)));
						} else {
							$(this).parents(".voucher-center").next(".voucher-center").next(".voucher-center").find(".moneyj").find(".money-xs").html(((dm - jm) * 100).toFixed(0));
						}
						$(this).parents(".voucher-center").next(".voucher-center").next(".voucher-center").find(".moneyj").find(".money-sr").val((dm - jm).toFixed(2));
						$(this).parents(".voucher-center").next(".voucher-center").next(".voucher-center").find(".moneyj").addClass("money-ys")
						$(this).parents(".voucher-center").next(".voucher-center").next(".voucher-center").find(".moneyd").find(".money-xs").html("");
						$(this).parents(".voucher-center").next(".voucher-center").next(".voucher-center").find(".moneyd").find(".money-sr").val("");
						$(this).parents(".voucher-center").next(".voucher-center").next(".voucher-center").find(".moneyd").removeClass("money-ys")
						//break;
					}
				}
			}
			bidui()
		}
		if($(this).parents(".voucher-center").find(".moneyd").find('.money-sr').hasClass("money-ys")) {
			if(vousinglepzzy != true) {
				if($(this).parents(".voucher-center").next(".voucher-center").find(".money-ys").length < 1 && $(this).parents(".voucher-center").next(".voucher-center").find('.fuyan').css('display')=='none') {
					var jm = 0;
					var dm = 0;
					if($(this).parents(".voucher-center").hasClass('voucher-centercw')) {
						for(var i = 0; i < $(".voucher-centercw").length; i++) {
							if($(".voucher-centercw").eq(i).find(".moneyd").find(".money-sr").val() != "") {
								dm += parseFloat($(".voucher-centercw").eq(i).find(".moneyd").find(".money-sr").val());
							}
							if($(".voucher-centercw").eq(i).find(".moneyj").find(".money-sr").val() != "") {
								jm += parseFloat($(".voucher-centercw").eq(i).find(".moneyj").find(".money-sr").val());
							}
						}
					} else {
						for(var i = 0; i < $(".voucher-centerys").length; i++) {
							if($(".voucher-centerys").eq(i).find(".moneyd").find(".money-sr").val() != "") {
								dm += parseFloat($(".voucher-centerys").eq(i).find(".moneyd").find(".money-sr").val());
							}
							if($(".voucher-centerys").eq(i).find(".moneyj").find(".money-sr").val() != "") {
								jm += parseFloat($(".voucher-centerys").eq(i).find(".moneyj").find(".money-sr").val());
							}
						}
					}
					if(jm > dm) {
						var nextjsr = $(this).parents(".voucher-center").next(".voucher-center").find(".moneyj").find(".money-sr").val();
						var nextdsr = $(this).parents(".voucher-center").next(".voucher-center").find(".moneyd").find(".money-sr").val();
						if((jm - dm) >= 10000000000 || vousinglepz == true || vousinglepzzy == true) {
							$(this).parents(".voucher-center").next(".voucher-center").find(".moneyd").find(".money-xs").html(formatNum((jm - dm).toFixed(2)));
						} else {
							$(this).parents(".voucher-center").next(".voucher-center").find(".moneyd").find(".money-xs").html(((jm - dm) * 100).toFixed(0));
						}
						$(this).parents(".voucher-center").next(".voucher-center").find(".moneyd").find(".money-sr").val((jm - dm).toFixed(2));
						$(this).parents(".voucher-center").next(".voucher-center").find(".moneyd").addClass("money-ys")
						$(this).parents(".voucher-center").next(".voucher-center").find(".moneyj").find(".money-xs").html("");
						$(this).parents(".voucher-center").next(".voucher-center").find(".moneyj").find(".money-sr").val("");
						$(this).parents(".voucher-center").next(".voucher-center").find(".moneyj").removeClass("money-ys")
						//break;
					} else if(dm > jm) {
						if((dm - jm) >= 10000000000 || vousinglepz == true || vousinglepzzy == true) {
							$(this).parents(".voucher-center").next(".voucher-center").find(".moneyj").find(".money-xs").html(formatNum((dm - jm).toFixed(2)));
						} else {
							$(this).parents(".voucher-center").next(".voucher-center").find(".moneyj").find(".money-xs").html(((dm - jm) * 100).toFixed(0));
						}
						$(this).parents(".voucher-center").next(".voucher-center").find(".moneyj").find(".money-sr").val((dm - jm).toFixed(2));
						$(this).parents(".voucher-center").next(".voucher-center").find(".moneyj").addClass("money-ys")
						$(this).parents(".voucher-center").next(".voucher-center").find(".moneyd").find(".money-xs").html("");
						$(this).parents(".voucher-center").next(".voucher-center").find(".moneyd").find(".money-sr").val("");
						$(this).parents(".voucher-center").next(".voucher-center").find(".moneyd").removeClass("money-ys")
						//break;
					}
				}
			}
			if(vousinglepzzy) {
				if($(this).parents(".voucher-center").next(".voucher-center").next(".voucher-center").find(".money-ys").length < 1 && $(this).parents(".voucher-center").next(".voucher-center").next(".voucher-center").find('.fuyan').css('display')=='none') {
					var jm = 0;
					var dm = 0;
					for(var i = 0; i < $(".voucher-center").length; i++) {
						if($(".voucher-center").eq(i).find(".moneyd").find(".money-sr").val() != "") {
							dm += parseFloat($(".voucher-center").eq(i).find(".moneyd").find(".money-sr").val());
						}
						if($(".voucher-center").eq(i).find(".moneyj").find(".money-sr").val() != "") {
							jm += parseFloat($(".voucher-center").eq(i).find(".moneyj").find(".money-sr").val());
						}
					}
					if(jm > dm) {
						var nextjsr = $(this).parents(".voucher-center").next(".voucher-center").next(".voucher-center").find(".moneyj").find(".money-sr").val();
						var nextdsr = $(this).parents(".voucher-center").next(".voucher-center").next(".voucher-center").find(".moneyd").find(".money-sr").val();
						if((jm - dm) >= 10000000000 || vousinglepz == true || vousinglepzzy == true) {
							$(this).parents(".voucher-center").next(".voucher-center").next(".voucher-center").find(".moneyd").find(".money-xs").html(formatNum((jm - dm).toFixed(2)));
						} else {
							$(this).parents(".voucher-center").next(".voucher-center").next(".voucher-center").find(".moneyd").find(".money-xs").html(((jm - dm) * 100).toFixed(0));
						}
						$(this).parents(".voucher-center").next(".voucher-center").next(".voucher-center").find(".moneyd").find(".money-sr").val((jm - dm).toFixed(2));
						$(this).parents(".voucher-center").next(".voucher-center").next(".voucher-center").find(".moneyd").addClass("money-ys")
						$(this).parents(".voucher-center").next(".voucher-center").next(".voucher-center").find(".moneyj").find(".money-xs").html("");
						$(this).parents(".voucher-center").next(".voucher-center").next(".voucher-center").find(".moneyj").find(".money-sr").val("");
						$(this).parents(".voucher-center").next(".voucher-center").next(".voucher-center").find(".moneyj").removeClass("money-ys")
						//break;
					} else if(dm > jm) {
						if((dm - jm) >= 10000000000 || vousinglepz == true || vousinglepzzy == true) {
							$(this).parents(".voucher-center").next(".voucher-center").next(".voucher-center").find(".moneyj").find(".money-xs").html(formatNum((dm - jm).toFixed(2)));
						} else {
							$(this).parents(".voucher-center").next(".voucher-center").next(".voucher-center").find(".moneyj").find(".money-xs").html(((dm - jm) * 100).toFixed(0));
						}
						$(this).parents(".voucher-center").next(".voucher-center").next(".voucher-center").find(".moneyj").find(".money-sr").val((dm - jm).toFixed(2));
						$(this).parents(".voucher-center").next(".voucher-center").next(".voucher-center").find(".moneyj").addClass("money-ys")
						$(this).parents(".voucher-center").next(".voucher-center").next(".voucher-center").find(".moneyd").find(".money-xs").html("");
						$(this).parents(".voucher-center").next(".voucher-center").next(".voucher-center").find(".moneyd").find(".money-sr").val("");
						$(this).parents(".voucher-center").next(".voucher-center").next(".voucher-center").find(".moneyd").removeClass("money-ys")
						//break;
					}
				}
			}
			bidui()
		}
		event.keyCode = 0
		return false;
	}
	if(event.keyCode == 117) {
		$(this).blur();
		var s = 0;
		for(var i = 0; i < $(this).parents(".voucher-yc").find(".yctz").length; i++) {
			if($(this).parents(".voucher-yc").find(".yctz").eq(i).val() != "") {
				s += parseFloat($(this).parents(".voucher-yc").find(".yctz").eq(i).val());
			}
		}
		if(s > 0) {
			s = s.toFixed(2);
			var n = s
			if(s < 10000000000 && vousinglepz == false && vousinglepzzy == false) {
				n = s.replace(".", "");
			}
		} else if(s == 0) {
			$(this).parents(".voucher-yc").prevAll(".moneyj").find(".money-sr").val("");
			$(this).parents(".voucher-yc").prevAll(".moneyj").find(".money-xs").html("");
		}
		if($(this).parents(".voucher-center").next(".voucher-center").length < 1) {
			$(".voucherall").height($(".voucherall").height() + 50);

			
			$(this).parents(".voucher-center").after(tr());
		};
		newvueTypesetting()
		setTimeout(function() {
			_this.parents(".voucher-yc").parents(".voucher-body").next(".voucher-center").find(".abstractinp").focus();
			_this.parents(".voucher-yc").hide();
			_this.parents(".voucher-yc").parents(".voucher-body").next(".voucher-center").find(".abstractinp").val(_this.parents(".voucher-center").find(".abstractinp").val())
			$(".voucherall").height($(".voucherall").height() -_this.parents(".voucher-yc").outerHeight())
			voucherycshowheight()
			
		}, 50)
		event.preventDefault();
		event.returnValue = false;
		return false;
	}
})

//辅助金额input
$(document).on("keydown", ".yctz", function(event) {
	event = event || window.event;
	var keyCode = event.keyCode
	//	if(!isNumber(keyCode, event)) return false
	_this = $(this);
	$('.ycbodyinp').removeClass('assCheck')
	if(event.keyCode == 9) {
		event.preventDefault();
		if(keydownctrls == true && $("#btn-voucher-bc").length == 1) {
			keydownctrls = false;
			_this = $(this)
			setTimeout(function() {
				if(vousinglepzzy) {
					if(_this.parents('.voucher-center').hasClass("voucher-centercw")) {
						for(var i = 0; i < $(".voucher-centerys").length; i++) {
							if($(".voucher-centerys").eq(i).hasClass('deleteclass') != true) {
								$(".voucher-centerys").eq(i).find('.abstractinp').focus()
								break;
							}
						}
					} else {
						for(var i = 0; i < $(".voucher-centercw").length; i++) {
							if($(".voucher-centercw").eq(i).hasClass('deleteclass') != true) {
								$(".voucher-centercw").eq(i).find('.abstractinp').focus()
								break;
							}
						}
					}
				}
				keydownctrls = true;
			}, 1)
			event.keyCode = 0;
			if(event.preventDefault) { // firefox
				event.preventDefault();
			} else { // other
				event.returnValue = false;
			}
		}
	}
	//摁下esc的时候收起辅助核算项并跳到下一行的摘要
	if(event.keyCode == "27") {
		event.preventDefault();
		event.keyCode = 0;
		event.preventDefault();
		event.returnValue = false;
		$(this).blur();
		if(vousinglepzzy  && vousinglepz!=true){
			if($(".voucher-hover").hasClass('voucher-hovercw')){
				$(".voucher-hover").next('.voucher-center').find('.voucher-centercw').find('.abstractinp').focus()
			}else{
				$(".voucher-hover").next('.voucher-center').find('.voucher-centerys').find('.abstractinp').focus()
			}
		}else{
			$(".voucher-hover").next('.voucher-center').find('.abstractinp').focus()
		}
		bidui()
		event.keyCode = 0;
		if(event.preventDefault) { // firefox
			event.preventDefault();
		} else { // other
			event.returnValue = false;
		}
		return false
	}
	//当摁下enter换行
	if(keyCode == "13") {
		event.preventDefault();
		event.returnValue = false;
		event.keyCode == 0
		scrollhide = 1
		var $parmoney = $(".voucher-hover")
		if(vousinglepzzy  && vousinglepz!=true){
			if($(".voucher-hover").hasClass('voucher-hovercw')){
				$parmoney = $(".voucher-hover").find('.voucher-centercw')
			}else{
				$parmoney = $(".voucher-hover").find('.voucher-centerys')
			}
		}
		var ss = $parmoney.find(".accountinginp").attr("accoindex");
		if($(this).parent(".voucher-yc-bo").nextAll(".voucher-yc-bo").length < 1) {
			var voucherycss = new Object();
			for(var d in tablehead) {
				var c = d.substring(0, d.length - 4)
				if(quanjuvoudatas.data[ss][c] == 1) {
					voucherycss[d] = tablehead[d];
				}
			}
			var nowAccoCode = $parmoney.find(".accountinginp").attr("code");
			var accItemArr = voucherycss;
			//			if(voucherycss.length > 0) { //得到辅助项的存在，再进行排序。wangpl 2018.01.22
			voucherycss = resOrderAccItem(nowAccoCode, accItemArr);
			//          }
			var inde = $(this).parents('.voucher-yc-bg').find('.voucher-yc-bo').length
			var voucherycbo = '';
			voucherycbo += '<div class="voucher-yc-bo" op="0" inde=' + inde + ' >'
			//			voucherycbo += '<div class="ycadddiv"><img src="img/jia.png" class="ycadd"></div>'
			for(var l in voucherycss) {
				voucherycbo += '<div  class="ycbody">'
				voucherycbo += '<textarea relation = "' + l + '" class="ycbodyinp"></textarea>'
				voucherycbo += '</div>'
				if(voucherycss[l]["ELE_CODE"] == "CURRENT" && isbussDate) {
					voucherycbo += '<div  class="ycbody">'
					voucherycbo += '<input type="text" value="' + $("#dates").getObj().getValue() + '" class="ycbodyinp bussDate"  />'
					voucherycbo += '</div>'
				}
			}
			if(quanjuvoudatas.data[ss].expireDate == 1) {
				voucherycbo += '<div  class="ycbody">'
				voucherycbo += '<input type="text" class="ycbodyinp daoqiri"  />'
				voucherycbo += '</div>'
			}
			if(quanjuvoudatas.data[ss].showBill == 1) {
				voucherycbo += '<div  class="ycbody">'
				voucherycbo += '<input type="text" class="ycbodyinp billNoinp"  />'
				voucherycbo += '</div>'
				voucherycbo += '<div  class="ycbody">'
				voucherycbo += '<textarea relation="billTypeinp" class="ycbodyinp billTypeinp"></textarea>'
				voucherycbo += '</div>'
				voucherycbo += '<div  class="ycbody">'
				voucherycbo += '<input type="text" class="ycbodyinp billDateinp"  />'
				voucherycbo += '</div>'
			}
			if(quanjuvoudatas.data[ss].currency == 1) {
				voucherycbo += '<div  class="ycbody">'
				voucherycbo += '<input relation = "currency" type="text" class="ycbodyinp curcodeinp"  />'
				voucherycbo += '</div>'
				voucherycbo += '<div  class="ycbody">'
				voucherycbo += '<input type="text" class="ycbodyinp exrateinp"  />'
				voucherycbo += '</div>'
				voucherycbo += '<div  class="ycbody">'
				voucherycbo += '<input type="text" class="ycbodyinp curramtinp"  />'
				voucherycbo += '</div>'
			}
			if(quanjuvoudatas.data[ss].qty == 1) {
				voucherycbo += '<div  class="ycbody">'
				voucherycbo += '<input type="text" class="ycbodyinp priceinp"  />'
				voucherycbo += '</div>'
				voucherycbo += '<div  class="ycbody">'
				voucherycbo += '<input type="text" class="ycbodyinp qtyinp"   qty="' + quanjuvoudatas.data[ss].qtyDigits + '" />'
				voucherycbo += '</div>'
			}
			voucherycbo += '<input type="text" class="ycbody yctz" />'
			//			voucherycbo += '<span class="ycdelect icon-trash"></span>'
			voucherycbo += '</div>'
			_this.parents('.voucher-bgallscroll').find('.voucher-yc-bg').append(voucherycbo);
			_this.parents('.voucher-bgallscroll').find('.voucher-yc-addbtns').append('<div class="ycadddiv" inde=' + inde + '><img src="img/jia.png" class="ycadd"></div>')
			_this.parents('.voucher-bgallscroll').find('.voucher-yc-deletebtns').append('<div class="ycdeldiv" inde=' + inde + '><span class="ycdelect icon-trash"></span></div>')
			$('.daoqiri,.billDateinp,.bussDate').datetimepicker(glRptJournalDate)
			voucherYcAssCss($('.voudetailAss').find('.voucher-yc').eq(0))
			if(quanjuvoudatas.data[ss].defcurCode != '' && quanjuvoudatas.data[ss].currency == 1) {
				for(var j = 0; j < _this.parents(".voucher-center").find(".voucher-yc").eq(i).find('.curcodeinp').length; j++) {
					if(_this.parents(".voucher-center").find(".voucher-yc").find('.curcodeinp').eq(j).val() == '') {
						for(var z = 0; z < $('#AssDataAll').find(".currency").find('li').length; z++) {
							var nowthis = $('#AssDataAll').find(".currency").find('li').eq(z)
							if(nowthis.find('.code').html() == quanjuvoudatas.data[ss].defcurCode) {
								var codecur = nowthis.find('.code').html()
								var curtext = nowthis.text()
								_this.parents(".voucher-center").find(".voucher-yc").find('.curcodeinp').eq(j).val(curtext).attr('code',codecur)
							}
						}
					}
				}
			}
		} else {
			$(this).parent(".voucher-yc-bo").next(".voucher-yc-bo").find(".ycbodyinp").eq(0).focus();
		}
		//填写金额
		if(vouiscopyprevAss) {
			var paryc = $(this).parents(".voucher-yc").find('.voucher-yc-bg')
			var bodyss = new Object();
			var $ycBt = paryc
			var headLen = $ycBt.find(".ychead").length - 1;
			for(var k = 0; k < headLen; k++) {
				var dd = $ycBt.find(".ychead").eq(k).attr("name");
				if(dd == 'expireDate' || dd == 'qty' || dd == 'price' || dd == 'exRate' || dd == 'currAmt') {
					var itemCodeName = $(this).parent(".voucher-yc-bo").find(".ycbody").eq(k).find(".ycbodyinp").val();
					bodyss[dd] = itemCodeName;
				} else if(dd == 'currAmt') {
					var itemCodeName = $(this).parent(".voucher-yc-bo").find(".ycbody").eq(k).find(".ycbodyinp").val().split(",").join("");
					bodyss[dd] = itemCodeName;
				} else if(dd == 'billNo' || dd == 'billDate' || dd == 'bussDate') {
					var itemCodeName = $ycBt.find(".voucher-yc-bo").find(".ycbody").eq(k).find(".ycbodyinp").val();
					bodyss[dd] = itemCodeName;
				} else {
					var itemCodeName = $(this).parent(".voucher-yc-bo").find(".ycbody").eq(k).find(".ycbodyinp").val();
					var itemCode = itemCodeName.substring(0, itemCodeName.indexOf(" "));
					bodyss[dd] = itemCode;
				}
			}
			var nextbpo = $(this).parent(".voucher-yc-bo").next(".voucher-yc-bo")
			for(var r = 0; r < nextbpo.find(".ycbodyinp").length; r++) {
				var relation  =nextbpo.find(".ycbody").eq(r).find(".ycbodyinp").attr('relation')
				var $li = $('#AssDataAll').find("."+relation).find("li");
				var $lis = fzhsxl[relation]
				if(paryc.find(".voucher-yc-bt").find(".ychead").eq(r).attr("name") == "expireDate") {
					nextbpo.find(".ycbodyinp").eq(r).val(bodyss.expireDate);
				} else if(paryc.find(".voucher-yc-bt").find(".ychead").eq(r).attr("name") == "billNo") {
					nextbpo.find(".ycbodyinp").eq(r).val(bodyss.billNo);
				} else if(paryc.find(".voucher-yc-bt").find(".ychead").eq(r).attr("name") == "price") {
					nextbpo.find(".ycbodyinp").eq(r).val(bodyss.price);
				} else if(paryc.find(".voucher-yc-bt").find(".ychead").eq(r).attr("name") == "qty") {
					nextbpo.find(".ycbodyinp").eq(r).val(bodyss.qty);
				} else if(paryc.find(".voucher-yc-bt").find(".ychead").eq(r).attr("name") == "exRate") {
					nextbpo.find(".ycbodyinp").eq(r).val(bodyss.exRate);
				} else if(paryc.find(".voucher-yc-bt").find(".ychead").eq(r).attr("name") == "currAmt") {
					nextbpo.find(".ycbodyinp").eq(r).val(formatNum(bodyss.currAmt));
				} else if(paryc.find(".voucher-yc-bt").find(".ychead").eq(r).attr("name") == "billDate") {
					nextbpo.find(".ycbodyinp").eq(r).val(bodyss.billDate);
				} else if(paryc.find(".voucher-yc-bt").find(".ychead").eq(r).attr("name") == "bussDate") {
					nextbpo.find(".ycbodyinp").eq(r).val(bodyss.bussDate);
				} else if(paryc.find(".voucher-yc-bt").find(".ychead").eq(r).attr("name") == "curCode") {
					for(var s = 0; s < $li.length; s++) {
						if($li.eq(s).find(".code").text() == bodyss.curCode) {
							$li.eq(s).removeClass("unselected").addClass("selected");
							var fzxlnrcode = $li.eq(s).find(".code").text();
							var fzxlnrname = $li.eq(s).find(".name").text();
							var exrate = $li.eq(s).attr('exrate')
							var rateDigits = $li.eq(s).attr('rateDigits')
							nextbpo.find(".ycbodyinp").eq(r).val(fzxlnrcode + " " + fzxlnrname).attr('code',fzxlnrcode)
							nextbpo.find(".exrateinp").eq(r).attr('exrate', exrate).attr('rateDigits', rateDigits)
						}
					}
				} else if(paryc.find(".voucher-yc-bt").find(".ychead").eq(r).attr("name") == "billType") {
					for(var s = 0; s < $li.length; s++) {
						if($li.eq(s).find(".code").text() == bodyss.billType) {
							$li.eq(s).removeClass("unselected").addClass("selected");
							var fzxlnrcode = $li.eq(s).find(".code").text();
							var fzxlnrname = $li.eq(s).find(".name").text();
							nextbpo.find(".ycbodyinp").eq(r).val(fzxlnrcode + " " + fzxlnrname).attr('code',fzxlnrcode)
						}
					}
				} else if(paryc.find(".voucher-yc-bt").find(".ychead").eq(r).attr("name") == "diffTermDir") {
					if(bodyss.dfDc == 1) {
						nextbpo.find(".ycbodyinp").eq(r).val('正向');
						$li.eq(0).removeClass("unselected").addClass("selected");
					} else {
						nextbpo.find(".ycbodyinp").eq(r).val('反向');
						$li.eq(1).removeClass("unselected").addClass("selected");
					}
				} else {
					var btcoded = paryc.find(".voucher-yc-bt").find(".ychead").eq(r).attr("name")
					for(var s = 0; s < $lis.length; s++) {
						if($lis[s].code == bodyss[btcoded]) {
							if(isaccfullname){
								nextbpo.find(".ycbodyinp").eq(r).val($lis[s].code + ' ' +$lis[s].chrFullname).attr('code',$lis[s].code)
							}else{
								nextbpo.find(".ycbodyinp").eq(r).val($lis[s].code + ' ' +$lis[s].name).attr('code',$lis[s].code);
							}
						}
					}
				}
			}
		}
		if(vouiscopyprevAss) {
			$(this).parent(".voucher-yc-bo").next(".voucher-yc-bo").find('.yctz').focus().select();
		} else {
			$(this).parent(".voucher-yc-bo").next(".voucher-yc-bo").find(".ycbodyinp").eq(0).focus();
		}
		var l = 0;
		for(var i = 0; i < _this.parents(".voucher-yc").find(".yctz").length; i++) {
			if(_this.parents(".voucher-yc").find(".yctz").eq(i).val() != "") {
				l += parseFloat(_this.parents(".voucher-yc").find(".yctz").eq(i).val().split(",").join(""));
			}
		}
		var isAction = "false";
		var temp = _this.parents(".voucher-yc-bg").attr("isaction");
		if(!$.isNull(temp)) {
			isAction = temp;
		}
		var accBal = $parmoney.find(".accounting").find(".accountinginp").attr("accbal"); //科目借贷方向
		var len = $parmoney.prevAll(".voucher-centerhalf:not(.deleteclass)").length;

		if($(this).parents(".voucher-center").find('.money-ys').length == 0) {
			if(len == 0 && isAction == "false") {
				l = l.toFixed(2);
				$parmoney.find(".moneyj").find(".money-sr").val(l).addClass("money-ys");
				var k = l;
				if(l < 10000000000 && vousinglepz == false && vousinglepzzy == false) {
					k = l.replace(".", "");
				}
				$parmoney.find(".moneyj").find(".money-xs").html(k);
				$parmoney.find(".moneyd").find(".money-sr").val("");
				$parmoney.find(".moneyd").find(".money-xs").html("");
			} else if(len > 0 && isAction == "false") {
				if(accBal == "1") {
					l = l.toFixed(2);
					$parmoney.find(".moneyj").find(".money-sr").val(l).addClass("money-ys");
					var k = l;
					if(l < 10000000000 && vousinglepz == false && vousinglepzzy == false) {
						k = l.replace(".", "");
					}
					$parmoney.find(".moneyj").find(".money-xs").html(k);
					$parmoney.find(".moneyd").find(".money-sr").val("");
					$parmoney.find(".moneyd").find(".money-xs").html("");
				} else if(accBal == "-1") {
					l = l.toFixed(2);
					$parmoney.find(".moneyd").find(".money-sr").val(l);
					$parmoney.find(".moneyd").find(".money-sr").addClass("money-ys");
					var k = l;
					if(l < 10000000000 && vousinglepz == false && vousinglepzzy == false) {
						k = l.replace(".", "");
					}
					$parmoney.find(".moneyd").find(".money-xs").html(k);
					$parmoney.find(".moneyj").find(".money-sr").val("").removeClass("money-ys");
					$parmoney.find(".moneyj").find(".money-xs").html("");
				}
			} else {
				if(moneyzy == 0) {
					l = l.toFixed(2);
					$parmoney.find(".moneyj").find(".money-sr").val(l).addClass("money-ys");
					var k = l;
					if(l < 10000000000 && vousinglepz == false && vousinglepzzy == false) {
						k = l.replace(".", "");
					}
					$parmoney.find(".moneyj").find(".money-xs").html(k);
					$parmoney.find(".moneyd").find(".money-sr").val("").removeClass("money-ys");
					$parmoney.find(".moneyd").find(".money-xs").html("");
				} else {
					l = l.toFixed(2);
					$parmoney.find(".moneyd").find(".money-sr").val(l).addClass("money-ys");
					var k = l;
					if(l < 10000000000 && vousinglepz == false && vousinglepzzy == false) {
						k = l.replace(".", "");
					}
					$parmoney.find(".moneyd").find(".money-xs").html(k);
					$parmoney.find(".moneyj").find(".money-sr").val("").removeClass("money-ys");
					$parmoney.find(".moneyj").find(".money-xs").html("");
				}
			}
		} else {
			l = l.toFixed(2);
			$parmoney.find(".money-ys").val(l)
			var k = l;
			if(l < 10000000000 && vousinglepz == false && vousinglepzzy == false) {
				k = l.replace(".", "");
			}
			$parmoney.find(".money-ys").next('.money-xs').html(k);
			if(vousinglepz == true || vousinglepzzy == true) {
				var nums = $parmoney.find('.money-ys').val()
				$parmoney.find('.money-ys').parents('.money-jd').find('.money-xs').html(formatNum(nums))
			}
		}
		setTimeout(function() {
			scrollhide = 0
		}, 300)
		event.keyCode = 0;
		if(event.preventDefault) { // firefox
			event.preventDefault();
		} else { // other
			event.returnValue = false;
		}
		return false;
	}
	//摁下空格键的时候改变本条分录的借贷方向
	if(keyCode == "32") {
		event.preventDefault();
		event.returnValue = false;
		event.keyCode == 0
		$(this).parents(".voucher-yc-bg").attr("isaction", true);
		if(moneyzy == 0) {
			moneyzy = 1;
		} else {
			moneyzy = 0;
		}
		var $parmoney = $(".voucher-hover")
		if(vousinglepzzy  && vousinglepz!=true){
			if($(".voucher-hover").hasClass('voucher-hovercw')){
				$parmoney = $(".voucher-hover").find('.voucher-centercw')
			}else{
				$parmoney = $(".voucher-hover").find('.voucher-centerys')
			}
		}
		var l = 0;
		for(var i = 0; i < $(this).parents(".voucher-yc").find(".yctz").length; i++) {
			if($(this).parents(".voucher-yc").find(".yctz").eq(i).val() != "") {
				l += parseFloat($(this).parents(".voucher-yc").find(".yctz").eq(i).val().split(",").join(""));
			}
		}
		if(moneyzy == 0) {
			l = l.toFixed(2);
			$(this).parents(".voucher-yc").prevAll(".moneyj").find(".money-sr").val(l).addClass("money-ys");
			var k = l;
			if(l < 10000000000 && vousinglepz == false && vousinglepzzy == false) {
				k = l.replace(".", "");
			}
			$parmoney.find(".moneyj").find(".money-xs").html(k);
			$parmoney.find(".moneyd").find(".money-sr").val("").removeClass("money-ys");
			$parmoney.find(".moneyd").find(".money-xs").html("");
			$parmoney.find('.voucher-yc-j').prop("checked", true)
			$parmoney.find('.voucher-yc-d').prop("checked", false)
			$parmoney.find('.titlemoney').html("金额：" + k)
		} else {
			l = l.toFixed(2);
			$(this).parents(".voucher-yc").prevAll(".moneyd").find(".money-sr").val(l).addClass("money-ys");
			var k = l;
			if(l < 10000000000 && vousinglepz == false && vousinglepzzy == false) {
				k = l.replace(".", "");
			}
			$parmoney.find(".moneyd").find(".money-xs").html(k);
			$parmoney.find(".moneyj").find(".money-sr").val("").removeClass("money-ys");
			$parmoney.find(".moneyj").find(".money-xs").html("");
			$parmoney.find('.voucher-yc-d').prop("checked", true)
			$parmoney.find('.voucher-yc-j').prop("checked", false)
			$parmoney.find('.titlemoney').html("金额：" + k)
		}
		$(this).parents(".voucher-center").attr("op", 1)
		if(vousinglepz == true || vousinglepzzy == true) {
			var nums = $(this).parents(".voucher-center").find('.money-ys').val()
			$parmoney.find('.money-ys').parents('.money-jd').find('.money-xs').html(formatNum(nums))
		}
		event.keyCode = 0;
		if(event.preventDefault) { // firefox
			event.preventDefault();
		} else { // other
			event.returnValue = false;
		}
		return false;
	}

})
//失去焦点的时候向金额传值,并根据其刚才改变的借贷方向加减
$(document).on("blur", ".yctz", function() {
	var editStatus0 = ($("#pzzhuantai").attr("vou-status") == undefined);
	if(!editStatus0) {
		var editStatus1 = ($("#pzzhuantai").attr("vou-status") == "O");
		var editStatus2 = (isInputor == true && (selectdata.data.inputor == ufgovkey.svUserId || selectdata.data.inputor == undefined));
		var editStatus3 = ((isvousource && isvousourceclick == false) || isvousourceclick)
		if(editStatus1 && (editStatus2 || isInputor == false) && editStatus3) {} else {
			return false;
		}
	}
	if($(this).val() != "" || $(this).val() == "0.00") {
		var s = parseFloat($(this).val().split(",").join(""));
		s = s.toFixed(2);
		if(s == "0.00") {
			s = "";
		}
	} else {
		var s = "";
	}
	$(this).val(s);
	var l = 0;
	for(var i = 0; i < $(this).parents(".voucher-yc").find(".yctz").length; i++) {
		if($(this).parents(".voucher-yc").find(".yctz").eq(i).val() != "") {
			l += parseFloat($(this).parents(".voucher-yc").find(".yctz").eq(i).val().split(",").join(""));
		}
	}

	var isAction = "false";
	var temp = $(this).parents(".voucher-yc-bg").attr("isaction");
	if(!$.isNull(temp)) {
		isAction = temp;
	}
	var accBal = $(this).parents(".voucher-yc").prevAll(".accounting").find(".accountinginp").attr("accbal"); //科目借贷方向
	var len = $(this).parents(".voucher-center").prevAll(".voucher-center:not(.deleteclass)").length;

	//	if(moneyzy == 0) {
	var $parmoney = $(".voucher-hover")
	if(vousinglepzzy  && vousinglepz!=true){
		if($(".voucher-hover").hasClass('voucher-hovercw')){
			$parmoney = $(".voucher-hover").find('.voucher-centercw')
		}else{
			$parmoney = $(".voucher-hover").find('.voucher-centerys')
		}
	}
	if($parmoney.find('.money-ys').length == 0) {
		if(len == 0 && isAction == "false") {
			l = l.toFixed(2);
			$parmoney.find(".moneyj").find(".money-sr").val(l).addClass("money-ys");
			var k = l
			if(l < 10000000000 && vousinglepz == false && vousinglepzzy == false) {
				k = l.replace(".", "");
			}
			$parmoney.find(".moneyj").find(".money-xs").html(k);
			$parmoney.find(".moneyd").find(".money-sr").val("");
			$parmoney.find(".moneyd").find(".money-xs").html("");
			//		}
		} else if(len > 0 && isAction == "false") {
			if(accBal == "1") {
				l = l.toFixed(2);
				$parmoney.find(".moneyj").find(".money-sr").val(l).addClass("money-ys");
				var k = l
				if(l < 10000000000 && vousinglepz == false && vousinglepzzy == false) {
					k = l.replace(".", "");
				}
				$parmoney.find(".moneyj").find(".money-xs").html(k);
				$parmoney.find(".moneyd").find(".money-sr").val("");
				$parmoney.find(".moneyd").find(".money-xs").html("");
			} else if(accBal == "-1") {
				l = l.toFixed(2);
				$parmoney.find(".moneyd").find(".money-sr").val(l);
				$parmoney.find(".moneyd").find(".money-sr").addClass("money-ys");
				var k = l
				if(l < 10000000000 && vousinglepz == false && vousinglepzzy == false) {
					k = l.replace(".", "");
				}
				$parmoney.find(".moneyd").find(".money-xs").html(k);
				$parmoney.find(".moneyj").find(".money-sr").val("").removeClass("money-ys");
				$parmoney.find(".moneyj").find(".money-xs").html("");
			}
		} else {
			if(moneyzy == 0) {
				l = l.toFixed(2);
				$parmoney.find(".moneyj").find(".money-sr").val(l).addClass("money-ys");
				var k = l
				if(l < 10000000000 && vousinglepz == false && vousinglepzzy == false) {
					k = l.replace(".", "");
				}
				$parmoney.find(".moneyj").find(".money-xs").html(k);
				$parmoney.find(".moneyd").find(".money-sr").val("").removeClass("money-ys");
				$parmoney.find(".moneyd").find(".money-xs").html("");
			} else {
				l = l.toFixed(2);
				$parmoney.find(".moneyd").find(".money-sr").val(l).addClass("money-ys");
				var k = l
				if(l < 10000000000 && vousinglepz == false && vousinglepzzy == false) {
					k = l.replace(".", "");
				}
				$parmoney.find(".moneyd").find(".money-xs").html(k);
				$parmoney.find(".moneyj").find(".money-sr").val("").removeClass("money-ys");
				$parmoney.find(".moneyj").find(".money-xs").html("");
			}
		}
	} else {
		l = l.toFixed(2);
		$(".voucher-hover").find(".money-ys").val(l)
		var k = l
		if(l < 10000000000 && vousinglepz == false && vousinglepzzy == false) {
			k = l.replace(".", "");
		}
		$parmoney.find(".money-ys").next('.money-xs').html(k);
		if(vousinglepz == true || vousinglepzzy == true) {
			var nums = $parmoney.find('.money-ys').val()
			$parmoney.find('.money-ys').parents('.money-jd').find('.money-xs').html(formatNum(nums))
		}
	}
	bidui();
	$(this).val(formatNum($(this).val()));
	if($(this).parents('.voucher-yc-bo').find('.exrateinp').length > 0 && $(this).parents('.voucher-yc-bo').find('.priceinp').length == 0) {
		var ws = parseFloat($(this).parents('.voucher-yc-bo').find('.exrateinp').attr('rateDigits'))
		var curnum = $(this).val().split(",").join("");
		var exrat = $(this).parents('.voucher-yc-bo').find('.curramtinp').val().split(",").join("")
		var yctz = $(this).parents('.voucher-yc-bo').find('.exrateinp').val().split(",").join("");
		if(!isNaN(parseFloat(exrat)) && !isNaN(parseFloat(curnum)) && exrat!=0) {
			// if(yctz == '' || parseFloat(yctz) == 0) {
				$(this).parents('.voucher-yc-bo').find('.exrateinp').val(parseFloat(curnum / exrat).toFixed(ws))
			// }
		}
	}
	if($(this).parents('.voucher-yc-bo').find('.curramtinp').length > 0 && $(this).parents('.voucher-yc-bo').find('.priceinp').length == 0) {
		var curnum = $(this).val().split(",").join("");
		var exrat = $(this).parents('.voucher-yc-bo').find('.exrateinp').val()
		var yctz = $(this).parents('.voucher-yc-bo').find('.curramtinp').val().split(",").join("");
		if(!isNaN(parseFloat(exrat)) && !isNaN(parseFloat(curnum)) && exrat!=0) {
			// if(yctz == '' || parseFloat(yctz) == 0) {
				$(this).parents('.voucher-yc-bo').find('.curramtinp').val(formatNum(parseFloat(curnum / exrat).toFixed(2)))
			// }
		}
	}
	if($(this).parents('.voucher-yc-bo').find('.priceinp').length > 0) {
		var ws = parseFloat($(this).parents('.voucher-yc-bo').find('.qtyinp').attr('qty'))
		var curnum = $(this).val().split(",").join("");
		var exrat = $(this).parents('.voucher-yc-bo').find('.qtyinp').val()
		var yctz = $(this).parents('.voucher-yc-bo').find('.priceinp').val().split(",").join("");
		if(!isNaN(parseFloat(exrat)) && !isNaN(parseFloat(curnum)) && exrat!=0) {
			// if(yctz == '' || parseFloat(yctz) == 0) {
				$(this).parents('.voucher-yc-bo').find('.priceinp').val(parseFloat(curnum / exrat).toFixed(ws))
			// }
		}
	}
	if($(this).parents('.voucher-yc-bo').find('.qtyinp').length > 0) {
		var ws = parseFloat($(this).parents('.voucher-yc-bo').find('.qtyinp').attr('qty'))
		var curnum = $(this).val().split(",").join("");
		var exrat = $(this).parents('.voucher-yc-bo').find('.priceinp').val()
		var yctz = $(this).parents('.voucher-yc-bo').find('.qtyinp').val().split(",").join("");
		if(!isNaN(parseFloat(exrat)) && !isNaN(parseFloat(curnum)) && exrat!=0) {
			// if(yctz == '' || parseFloat(yctz) == 0) {
				$(this).parents('.voucher-yc-bo').find('.qtyinp').val(parseFloat(curnum / exrat).toFixed(ws))
			// }
		}
	}
})
$(document).on("focus", ".curramtinp", function() {
	if($(this).val() != '') {
		$(this).val($(this).val().split(",").join(""))
	}
})
$(document).on("blur", ".curramtinp", function() {
	if($(this).val() != '') {
		var ws = parseFloat($(this).parents('.voucher-yc-bo').find('.exrateinp').attr('rateDigits'))
		if(isNaN(parseFloat($(this).val())) && $(this).val() != '') {
			$(this).val('1')
		}else{
			$(this).val(formatNum($(this).val()))
		}
		if($(this).parents('.voucher-yc-bo').find('.priceinp').length == 0) {
			var curnum = $(this).val().split(",").join("");
			var exrat = $(this).parents('.voucher-yc-bo').find('.exrateinp').val()
			var yctz = $(this).parents('.voucher-yc-bo').find('.yctz').val().split(",").join("");
			if(!isNaN(parseFloat(exrat)) && !isNaN(parseFloat(curnum))) {
				// if(yctz == '' || parseFloat(yctz) == 0) {
					$(this).parents('.voucher-yc-bo').find('.yctz').val(formatNum(parseFloat(curnum * exrat).toFixed(2)))
				// }
			}else if(!isNaN(parseFloat(curnum)) && !isNaN(parseFloat(yctz)) &&curnum!=0) {
				// if(exrat == '' || parseFloat(exrat) == 0) {
					$(this).parents('.voucher-yc-bo').find('.exrateinp').val(parseFloat(yctz / curnum).toFixed(ws))
				// }
			}
		}
		$(this).parents('.voucher-yc-bo').find('.yctz').trigger('blur')
	}
})
$(document).on("blur", ".priceinp", function() {
	if($(this).val() != '') {
		var ws = parseFloat($(this).parents('.voucher-yc-bo').find('.qtyinp').attr('qty'))
		if(isNaN(parseFloat($(this).val())) && $(this).val() != '') {
			$(this).val('1')
		}
		var curnum = $(this).val().split(",").join("");
		var exrat = $(this).parents('.voucher-yc-bo').find('.qtyinp').val()
		var yctz = $(this).parents('.voucher-yc-bo').find('.yctz').val().split(",").join("");
		if(!isNaN(parseFloat(exrat)) && !isNaN(parseFloat(curnum))) {
			// if(yctz == '' || parseFloat(yctz) == 0) {
				$(this).parents('.voucher-yc-bo').find('.yctz').val(formatNum(parseFloat(curnum * exrat).toFixed(2)))
			// }
		}else if(!isNaN(parseFloat(exrat)) && !isNaN(parseFloat(yctz)) &&curnum!=0) {
			// if(curnum == '' || parseFloat(curnum) == 0) {
				$(this).parents('.voucher-yc-bo').find('.qtyinp').val(parseFloat(yctz / curnum).toFixed(ws))
			// }
		}
		$(this).parents('.voucher-yc-bo').find('.yctz').trigger('blur')
	}
})
$(document).on("blur", ".qtyinp", function() {
	if($(this).val() != '') {
		var ws = parseFloat($(this).parents('.voucher-yc-bo').find('.qtyinp').attr('qty'))
		var exrat = $(this).val()
		if(isNaN(parseFloat(exrat)) && $(this).val() != '') {
			$(this).val('1')
		} else {
			var exratlen = $(this).attr('qty')
			var now = parseFloat($(this).val()).toFixed(exratlen)
			$(this).val(now)
		}
		var curnum = $(this).parents('.voucher-yc-bo').find('.priceinp').val().split(",").join("");
		var yctz = $(this).parents('.voucher-yc-bo').find('.yctz').val().split(",").join("");
		var exrat = $(this).val()
		if(!isNaN(parseFloat(exrat)) && !isNaN(parseFloat(curnum))){
			$(this).parents('.voucher-yc-bo').find('.yctz').val(formatNum(parseFloat(curnum * exrat).toFixed(2)))
		}else if(!isNaN(parseFloat(yctz)) && !isNaN(parseFloat(exrat)) &&exrat!=0) {
			// if(yctz == '' || parseFloat(yctz) == 0) {
				$(this).parents('.voucher-yc-bo').find('.priceinp').val(parseFloat(yctz / exrat).toFixed(ws))
			// }
		}
		$(this).parents('.voucher-yc-bo').find('.yctz').trigger('blur')
	}
})
$(document).on("blur", ".exrateinp", function() {
	if($(this).val() != '') {
		var exrat = $(this).val()
		if(isNaN(parseFloat(exrat)) && $(this).val() != '') {
			$(this).val('1')
		} else {
			if($(this).attr('.exrate') != undefined) {
				var exrate = $(this).attr('.exrate')
				curexratefzhsxl[exrate] = $(this).val()
			}
		}
		if($(this).parents('.voucher-yc-bo').find('.priceinp').length == 0) {
			var curnum = $(this).parents('.voucher-yc-bo').find('.curramtinp').val().split(",").join("");
			var yctz = $(this).parents('.voucher-yc-bo').find('.yctz').val().split(",").join("");
			var exrat = $(this).val()
			if(!isNaN(parseFloat(curnum)) && !isNaN(parseFloat(exrat))) {
				$(this).parents('.voucher-yc-bo').find('.yctz').val(formatNum(parseFloat(curnum * exrat).toFixed(2)))
			}else if(!isNaN(parseFloat(yctz)) && !isNaN(parseFloat(exrat)) &&exrat!=0){
				$(this).parents('.voucher-yc-bo').find('.curramtinp').val(parseFloat(yctz / exrat).toFixed(2))
			}
		}
		$(this).parents('.voucher-yc-bo').find('.yctz').trigger('blur')
	}
})
$(document).on("keyup", ".yctz", function() {
	var c = $(this);
	if(/[^\d.-]/.test(c.val())) { //替换非数字字符  
		var temp_amount = c.val().replace(/[^\d.=-]/g, '');
		$(this).val(temp_amount);
	}
	var $parmoney = $(".voucher-hover")
	if(vousinglepzzy  && vousinglepz!=true){
		if($(".voucher-hover").hasClass('voucher-hovercw')){
			$parmoney = $(".voucher-hover").find('.voucher-centercw')
		}else{
			$parmoney = $(".voucher-hover").find('.voucher-centerys')
		}
	}
	if($(this).val() != "") {
		var thisvalsss = $(this).val()
		if(thisvalsss.indexOf("=") >= 0) {
			$(this).val("");
			if($parmoney.find('.money-ys').length != 0) {
				$(this).blur()
				$(this).focus()
			}
			var monjfang = 0;
			if(vousinglepz == false && vousinglepzzy == false) {
				for(var i = 0; i < $(".voucher-centerhalf").length; i++) {
					if($(".voucher-centerhalf").eq(i).find(".moneyj").find(".money-sr").val() != "") {
						monjfang += parseFloat($(".voucher-centerhalf").eq(i).find(".moneyj").find(".money-sr").val());
					}
				}
			} else if(vousinglepz == true && vousinglepzzy == false) {
				if($(this).parents('.voucher-center').hasClass('voucher-center-cw')) {
					for(var i = 0; i < $(".voucher-center-cw").length; i++) {
						if($(".voucher-center-cw").eq(i).find(".moneyj").find(".money-sr").val() != "") {
							monjfang += parseFloat($(".voucher-center-cw").eq(i).find(".moneyj").find(".money-sr").val());
						}
					}
				} else if($(this).parents('.voucher-center').hasClass('voucher-center-ys')) {
					for(var i = 0; i < $(".voucher-center-ys").length; i++) {
						if($(".voucher-center-ys").eq(i).find(".moneyj").find(".money-sr").val() != "") {
							monjfang += parseFloat($(".voucher-center-ys").eq(i).find(".moneyj").find(".money-sr").val());
						}
					}
				} else {
					for(var i = 0; i < $(".voucher-center").length; i++) {
						if($(".voucher-center").eq(i).find(".moneyj").find(".money-sr").val() != "") {
							monjfang += parseFloat($(".voucher-center").eq(i).find(".moneyj").find(".money-sr").val());
						}
					}
				}
			} else if(vousinglepz == false && vousinglepzzy == true) {
				if($parmoney.hasClass('voucher-centercw')) {
					for(var i = 0; i < $(".voucher-centercw").length; i++) {
						if($(".voucher-centercw").eq(i).find(".moneyj").find(".money-sr").val() != "") {
							monjfang += parseFloat($(".voucher-centercw").eq(i).find(".moneyj").find(".money-sr").val());
						}
					}
				} else if($parmoney.hasClass('voucher-centerys')) {
					for(var i = 0; i < $(".voucher-centerys").length; i++) {
						if($(".voucher-centerys").eq(i).find(".moneyj").find(".money-sr").val() != "") {
							monjfang += parseFloat($(".voucher-centerys").eq(i).find(".moneyj").find(".money-sr").val());
						}
					}
				} else {
					for(var i = 0; i < $(".voucher-center").length; i++) {
						if($(".voucher-center").eq(i).find(".moneyj").find(".money-sr").val() != "") {
							monjfang += parseFloat($(".voucher-center").eq(i).find(".moneyj").find(".money-sr").val());
						}
					}
				}
			}
			var mondfang = 0;
			if(vousinglepz == false && vousinglepzzy == false) {
				for(var i = 0; i < $(".voucher-centerhalf").length; i++) {
					if($(".voucher-centerhalf").eq(i).find(".moneyd").find(".money-sr").val() != "") {
						mondfang += parseFloat($(".voucher-centerhalf").eq(i).find(".moneyd").find(".money-sr").val());
					}
				}
			} else if(vousinglepz == true && vousinglepzzy == false) {
				if($(this).parents('.voucher-center').hasClass('voucher-center-cw')) {
					for(var i = 0; i < $(".voucher-center-cw").length; i++) {
						if($(".voucher-center-cw").eq(i).find(".moneyd").find(".money-sr").val() != "") {
							mondfang += parseFloat($(".voucher-center-cw").eq(i).find(".moneyd").find(".money-sr").val());
						}
					}
				} else if($(this).parents('.voucher-center').hasClass('voucher-center-ys')) {
					for(var i = 0; i < $(".voucher-center-ys").length; i++) {
						if($(".voucher-center-ys").eq(i).find(".moneyd").find(".money-sr").val() != "") {
							mondfang += parseFloat($(".voucher-center-ys").eq(i).find(".moneyd").find(".money-sr").val());
						}
					}
				} else {
					for(var i = 0; i < $(".voucher-center").length; i++) {
						if($(".voucher-center").eq(i).find(".moneyd").find(".money-sr").val() != "") {
							mondfang += parseFloat($(".voucher-center").eq(i).find(".moneyd").find(".money-sr").val());
						}
					}
				}
			} else if(vousinglepz == false && vousinglepzzy == true) {
				if($parmoney.hasClass('voucher-centercw')) {
					for(var i = 0; i < $(".voucher-centercw").length; i++) {
						if($(".voucher-centercw").eq(i).find(".moneyd").find(".money-sr").val() != "") {
							mondfang += parseFloat($(".voucher-centercw").eq(i).find(".moneyd").find(".money-sr").val());
						}
					}
				} else if($parmoney.hasClass('voucher-centerys')) {
					for(var i = 0; i < $(".voucher-centerys").length; i++) {
						if($(".voucher-centerys").eq(i).find(".moneyd").find(".money-sr").val() != "") {
							mondfang += parseFloat($(".voucher-centerys").eq(i).find(".moneyd").find(".money-sr").val());
						}
					}
				} else {
					for(var i = 0; i < $(".voucher-centerhalf").length; i++) {
						if($(".voucher-centerhalf").eq(i).find(".moneyd").find(".money-sr").val() != "") {
							mondfang += parseFloat($(".voucher-centerhalf").eq(i).find(".moneyd").find(".money-sr").val());
						}
					}
				}
			}
			if($parmoney.find('.money-ys').length == 0) {
				if(mondfang > monjfang) {
					$parmoney.find(".moneyj").find(".money-sr").addClass('money-ys')
					$(this).val((mondfang - monjfang).toFixed(2));
				} else if(mondfang < monjfang) {
					$parmoney.find(".moneyd").find(".money-sr").addClass('money-ys')
					$(this).val((monjfang - mondfang).toFixed(2));
				}
			} else {
				if($parmoney.find(".money-ys").parents('.money-jd').hasClass("moneyj") || $parmoney.find(".money-ys").hasClass("moneyj")) {
					$(this).val((mondfang - monjfang).toFixed(2));
				} else {
					$(this).val((monjfang - mondfang).toFixed(2));
				}
			}
			$(this).blur()
			$(this).focus()
			bidui();
			return false;
		}
	}

})

$(document).on("click", ".ycadd", function(e) {
	if(!isInputChange()) {
		return false;
	} else {
		var ss = $(".voucher-hover").find(".accountinginp").attr("accoindex");
		if($(".voucher-hover").hasClass("voucher-hovercw")){
			ss = $(".voucher-hover").find('.voucher-centercw').find(".accountinginp").attr("accoindex");
		}else if($(".voucher-hover").hasClass("voucher-hoverys")){
			ss = $(".voucher-hover").find('.voucher-centerys').find(".accountinginp").attr("accoindex");
		}
		var voucherycss = new Object();
		for(var d in tablehead) {
			var c = d.substring(0, d.length - 4)
			if(quanjuvoudatas.data[ss][c] == 1) {
				voucherycss[d] = tablehead[d];
			}
		}
		var nowAccoCode = $(this).parents('.voucher-center').find(".accountinginp").attr("code");
		var accItemArr = voucherycss;
		//			if(voucherycss.length > 0) { //得到辅助项的存在，再进行排序。wangpl 2018.01.22
		voucherycss = resOrderAccItem(nowAccoCode, accItemArr);
		//          }
		var inde = $(this).parents('.voucher-yc-addbtns').next('.voucher-yc-bg').find('.voucher-yc-bo').length
		var voucherycbo = '';
		voucherycbo += '<div class="voucher-yc-bo" op="0" inde=' + inde + ' >'
		//	voucherycbo += '<div class="ycadddiv"><img src="img/jia.png" class="ycadd"></div>'
		for(var l in voucherycss) {
			voucherycbo += '<div  class="ycbody">'
			voucherycbo += '<textarea relation = "' + l + '" class="ycbodyinp"></textarea>'
			voucherycbo += '</div>'
			if(voucherycss[l]["ELE_CODE"] == "CURRENT" && isbussDate) {
				voucherycbo += '<div  class="ycbody">'
				voucherycbo += '<input type="text" value="' + $("#dates").getObj().getValue() + '" class="ycbodyinp bussDate"  />'
				voucherycbo += '</div>'
			}
		}
		if(quanjuvoudatas.data[ss].expireDate == 1) {
			voucherycbo += '<div  class="ycbody">'
			voucherycbo += '<input type="text" class="ycbodyinp daoqiri"  />'
			voucherycbo += '</div>'
		}
		if(quanjuvoudatas.data[ss].showBill == 1) {
			voucherycbo += '<div  class="ycbody">'
			voucherycbo += '<input type="text" class="ycbodyinp billNoinp"  />'
			voucherycbo += '</div>'
			voucherycbo += '<div  class="ycbody">'
			voucherycbo += '<textarea relation="billTypeinp" class="ycbodyinp billTypeinp"></textarea>'
			voucherycbo += '</div>'
			voucherycbo += '<div  class="ycbody">'
			voucherycbo += '<input type="text" class="ycbodyinp billDateinp"  />'
			voucherycbo += '</div>'
		}
		if(quanjuvoudatas.data[ss].currency == 1) {
			voucherycbo += '<div  class="ycbody">'
			voucherycbo += '<input relation = "currency"  type="text" class="ycbodyinp curcodeinp"  />'
			voucherycbo += '</div>'
			voucherycbo += '<div  class="ycbody">'
			voucherycbo += '<input type="text" class="ycbodyinp exrateinp"  />'
			voucherycbo += '</div>'
			voucherycbo += '<div  class="ycbody">'
			voucherycbo += '<input type="text" class="ycbodyinp curramtinp"  />'
			voucherycbo += '</div>'
		}
		if(quanjuvoudatas.data[ss].qty == 1) {
			voucherycbo += '<div  class="ycbody">'
			voucherycbo += '<input type="text" class="ycbodyinp priceinp"  />'
			voucherycbo += '</div>'
			voucherycbo += '<div  class="ycbody">'
			voucherycbo += '<input type="text" class="ycbodyinp qtyinp"   qty="' + quanjuvoudatas.data[ss].qtyDigits + '" />'
			voucherycbo += '</div>'
		}
		voucherycbo += '<input type="text" class="ycbody yctz" />'
		//	voucherycbo += '<span class="ycdelect icon-trash"></span>'
		voucherycbo += '</div>'
		$(this).parents('.voucher-yc-addbtns').next('.voucher-yc-bg').find('.voucher-yc-bo').eq(inde - 1).after(voucherycbo);
		$(this).parents('.voucher-yc-addbtns').append('<div class="ycadddiv" inde=' + inde + '><img src="img/jia.png" class="ycadd"></div>')
		$(this).parents('.voucher-yc-addbtns').nextAll('.voucher-yc-deletebtns').append('<div class="ycdeldiv" inde=' + inde + '><span class="ycdelect icon-trash"></span></div>')
		//	$('.daoqiri,.billDateinp,.bussDate').datetimepicker(glRptJournalDate)
		var _this = $(this)
		for(var i = 0; i < _this.parents(".voucher-center").find(".voucher-yc").length; i++) {
			if(_this.parents(".voucher-center").find(".voucher-yc").eq(i).hasClass("deleteclass")) {} else {
				voucherYcAssCss(_this.parents(".voucher-center").find(".voucher-yc").eq(i))
				if(quanjuvoudatas.data[ss].defcurCode != '' && quanjuvoudatas.data[ss].currency == 1) {
					for(var j = 0; j < _this.parents(".voucher-center").find(".voucher-yc").eq(i).find('.curcodeinp').length; j++) {
						if(_this.parents(".voucher-center").find(".voucher-yc").eq(i).find('.curcodeinp').eq(j).val() == '') {
							for(var z = 0; z < _this.parents(".voucher-center").find(".voucher-yc").eq(i).find('.curcodeinp').eq(j).next('.ycbodys').find('li').length; z++) {
								var nowthis = _this.parents(".voucher-center").find(".voucher-yc").eq(i).find('.curcodeinp').eq(j).next('.ycbodys').find('li').eq(z)
								if(nowthis.find('.code').html() == quanjuvoudatas.data[ss].defcurCode) {
									nowthis.trigger('click')
								}
							}
						}
					}
				}
			}
		}
		if(vouiscopyprevAss) {
			var paryc = $(this).parents(".voucher-yc")
			var bodyss = new Object();
			var $ycBt = paryc
			var headLen = $ycBt.find(".ychead").length - 1;
			var bolen =  $(this).parents(".voucher-yc").find('.voucher-yc-bo').length
			var copybo = $(this).parents(".voucher-yc").find('.voucher-yc-bo').eq(bolen-2)
			for(var k = 0; k < headLen; k++) {
				var dd = $ycBt.find(".ychead").eq(k).attr("name");
				if(dd == 'expireDate' || dd == 'qty' || dd == 'price' || dd == 'exRate' || dd == 'currAmt') {
					var itemCodeName = copybo.find(".ycbody").eq(k).find(".ycbodyinp").val();
					bodyss[dd] = itemCodeName;
				} else if(dd == 'currAmt') {
					var itemCodeName = copybo.find(".ycbody").eq(k).find(".ycbodyinp").val().split(",").join("");
					bodyss[dd] = itemCodeName;
				} else if(dd == 'billNo' || dd == 'billDate' || dd == 'bussDate') {
					var itemCodeName = copybo.find(".ycbody").eq(k).find(".ycbodyinp").val();
					bodyss[dd] = itemCodeName;
				} else {
					var itemCodeName = copybo.find(".ycbody").eq(k).find(".ycbodyinp").val();
					var itemCode = itemCodeName.substring(0, itemCodeName.indexOf(" "));
					bodyss[dd] = itemCode;
				}
			}
			var nextbpo = $(this).parents(".voucher-yc").find('.voucher-yc-bo').eq(bolen-1)
			for(var r = 0; r < nextbpo.find(".ycbodyinp").length; r++) {
				var relation  =nextbpo.find(".ycbody").eq(r).find(".ycbodyinp").attr('relation')
				var $li = $('#AssDataAll').find("."+relation).find("li");
				var $lis = fzhsxl[relation]
				if(paryc.find(".voucher-yc-bt").find(".ychead").eq(r).attr("name") == "expireDate") {
					nextbpo.find(".ycbodyinp").eq(r).val(bodyss.expireDate);
				} else if(paryc.find(".voucher-yc-bt").find(".ychead").eq(r).attr("name") == "billNo") {
					nextbpo.find(".ycbodyinp").eq(r).val(bodyss.billNo);
				} else if(paryc.find(".voucher-yc-bt").find(".ychead").eq(r).attr("name") == "price") {
					nextbpo.find(".ycbodyinp").eq(r).val(bodyss.price);
				} else if(paryc.find(".voucher-yc-bt").find(".ychead").eq(r).attr("name") == "qty") {
					nextbpo.find(".ycbodyinp").eq(r).val(bodyss.qty);
				} else if(paryc.find(".voucher-yc-bt").find(".ychead").eq(r).attr("name") == "exRate") {
					nextbpo.find(".ycbodyinp").eq(r).val(bodyss.exRate);
				} else if(paryc.find(".voucher-yc-bt").find(".ychead").eq(r).attr("name") == "currAmt") {
					nextbpo.find(".ycbodyinp").eq(r).val(formatNum(bodyss.currAmt));
				} else if(paryc.find(".voucher-yc-bt").find(".ychead").eq(r).attr("name") == "billDate") {
					nextbpo.find(".ycbodyinp").eq(r).val(bodyss.billDate);
				} else if(paryc.find(".voucher-yc-bt").find(".ychead").eq(r).attr("name") == "bussDate") {
					nextbpo.find(".ycbodyinp").eq(r).val(bodyss.bussDate);
				} else if(paryc.find(".voucher-yc-bt").find(".ychead").eq(r).attr("name") == "curCode") {
					for(var s = 0; s < $li.length; s++) {
						if($li.eq(s).find(".code").text() == bodyss.curCode) {
							$li.eq(s).removeClass("unselected").addClass("selected");
							var fzxlnrcode = $li.eq(s).find(".code").text();
							var fzxlnrname = $li.eq(s).find(".name").text();
							var exrate = $li.eq(s).attr('exrate')
							var rateDigits = $li.eq(s).attr('rateDigits')
							nextbpo.find(".ycbodyinp").eq(r).val(fzxlnrcode + " " + fzxlnrname).attr('code',fzxlnrcode)
							nextbpo.find(".exrateinp").eq(r).attr('exrate', exrate).attr('rateDigits', rateDigits)
						}
					}
				} else if(paryc.find(".voucher-yc-bt").find(".ychead").eq(r).attr("name") == "billType") {
					for(var s = 0; s < $li.length; s++) {
						if($li.eq(s).find(".code").text() == bodyss.billType) {
							$li.eq(s).removeClass("unselected").addClass("selected");
							var fzxlnrcode = $li.eq(s).find(".code").text();
							var fzxlnrname = $li.eq(s).find(".name").text();
							nextbpo.find(".ycbodyinp").eq(r).val(fzxlnrcode + " " + fzxlnrname).attr('code',fzxlnrcode)
						}
					}
				} else if(paryc.find(".voucher-yc-bt").find(".ychead").eq(r).attr("name") == "diffTermDir") {
					if(bodyss.dfDc == 1) {
						nextbpo.find(".ycbodyinp").eq(r).val('正向');
						$li.eq(0).removeClass("unselected").addClass("selected");
					} else {
						nextbpo.find(".ycbodyinp").eq(r).val('反向');
						$li.eq(1).removeClass("unselected").addClass("selected");
					}
				} else {
					var btcoded = paryc.find(".voucher-yc-bt").find(".ychead").eq(r).attr("name")
					for(var s = 0; s < $lis.length; s++) {
						if($lis[s].code == bodyss[btcoded]) {
							if(isaccfullname){
								nextbpo.find(".ycbodyinp").eq(r).val($lis[s].code + ' ' +$lis[s].chrFullname).attr('code',$lis[s].code)
							}else{
								nextbpo.find(".ycbodyinp").eq(r).val($lis[s].code + ' ' +$lis[s].name).attr('code',$lis[s].code);
							}
						}
					}
				}
			}
		}
		if($(this).parents(".voucher-yc").find(".voucher-yc-bo").length - $(this).parents(".voucher-yc").find(".deleteclass").length <= 8) {
			$(".voucherall").height($(".voucherall").height() + 52);
			voucherycshowheight()
			
		}
		if($(this).parents(".voucher-yc").find(".voucher-yc-bo").length - $(this).parents(".voucher-yc").find(".deleteclass").length > 8) {
			if(!$(this).parents(".voucher-yc").hasClass('ishei')){
				$(this).parents(".voucher-yc").css("height",$(this).parents(".voucher-yc").outerHeight()-52+"px").addClass('ishei');
			}
			$(this).parents(".voucher-yc").addClass("bgheight");
		}
	}
})
//删除辅助项分录行按钮
$(document).on("click", ".ycdelect", function(e) {
	stopPropagation(e)
	if(!isInputChange()) {
		return false;
	} else {
		$(this).parents(".voucher-center").attr("op", "1");
		var inde = $(this).parent('.ycdeldiv').index() - 1
		var editStatus0 = ($("#pzzhuantai").attr("vou-status") == undefined);
		if(!editStatus0) {
			var editStatus1 = ($("#pzzhuantai").attr("vou-status") == "O");
			var editStatus2 = (isInputor == true && (selectdata.data.inputor == ufgovkey.svUserId || selectdata.data.inputor == undefined));
			var editStatus3 = ((isvousource && isvousourceclick == false) || isvousourceclick)
			if(editStatus1 && (editStatus2 || isInputor == false) && editStatus3) {
				_this = $(this).parents(".voucher-yc");
				if(_this.find(".deleteclass").length + 1 < _this.find(".yctz").length) {
					if($(this).parents(".voucher-yc").find(".voucher-yc-bo").length - _this.find(".deleteclass").length <= 8) {
						$(".voucherall").height($(".voucherall").height() - 52)
						voucherycshowheight()
						
						_this.parents(".voucher-center").find(".voucher-yc").css("height",'').removeClass('ishei');
						_this.parents(".voucher-center").find(".voucher-yc").removeClass("bgheight");
					}
					$(this).parents(".voucher-yc").find(".voucher-yc-bo").eq(inde).remove()
					$(this).parents('.voucher-yc-deletebtns').prevAll('.voucher-yc-addbtns').find('.ycadddiv').eq(inde).remove()
					$(this).parents('.ycdeldiv').remove()
				} else {
					$(this).parents(".voucher-yc").find(".voucher-yc-bo").eq(inde).find("input").val("").removeAttr('code');
					$(this).parents(".voucher-yc").find(".voucher-yc-bo").eq(inde).find("textarea").val("").removeAttr('code');
					$(this).parents(".voucher-yc").find(".voucher-yc-bo").eq(inde).find(".selected").addClass("unselected").removeClass("selected");
				}
				var s = 0;
				for(var i = 0; i < _this.find(".yctz").length; i++) {
					if(_this.find(".yctz").eq(i).val() != "") {
						s += parseFloat(_this.find(".yctz").eq(i).val().split(",").join(""));
					}
				}
				s = s.toFixed(2);
				var n = s
				if(s < 10000000000 && vousinglepz == false && vousinglepzzy == false) {
					n = s.replace(".", "");
				}
				if(moneyzy == 0 && _this.parents(".voucher-center").find(".moneyd").find(".money-sr").val() == '') {
					_this.parents(".voucher-center").find(".moneyj").find(".money-sr").val(s).addClass("money-ys");;
					_this.parents(".voucher-center").find(".moneyj").find(".money-xs").html(n);
				} else if(moneyzy == 0 && _this.parents(".voucher-center").find(".moneyd").find(".money-sr").val() != '') {
					_this.parents(".voucher-center").find(".moneyd").find(".money-sr").val(s).addClass("money-ys");
					_this.parents(".voucher-center").find(".moneyd").find(".money-xs").html(n);
				} else if(moneyzy == 1 && _this.parents(".voucher-center").find(".moneyj").find(".money-sr").val() == '') {
					_this.parents(".voucher-center").find(".moneyd").find(".money-sr").val(s).addClass("money-ys");
					_this.parents(".voucher-center").find(".moneyd").find(".money-xs").html(n);
				} else if(moneyzy == 1 && _this.parents(".voucher-center").find(".moneyj").find(".money-sr").val() != '') {
					_this.parents(".voucher-center").find(".moneyj").find(".money-sr").val(s).addClass("money-ys");
					_this.parents(".voucher-center").find(".moneyj").find(".money-xs").html(n);
				}
				bidui();
			}
		} else {
			_this = $(this).parents(".voucher-yc");
			if(_this.find(".deleteclass").length + 1 < _this.find(".yctz").length) {
				if($(this).parents(".voucher-yc").find(".voucher-yc-bo").length - _this.find(".deleteclass").length <= 8) {
					$(".voucherall").height($(".voucherall").height() - 52)
					
					_this.parents(".voucher-center").find(".voucher-yc").css("height",'').removeClass('ishei');;
					_this.parents(".voucher-center").find(".voucher-yc").removeClass("bgheight");
				}
				$(this).parents(".voucher-yc").find(".voucher-yc-bo").eq(inde).remove()
				$(this).parents('.voucher-yc-deletebtns').prevAll('.voucher-yc-addbtns').find('.ycadddiv').eq(inde).remove()
				$(this).parents('.ycdeldiv').remove()
			} else {
				$(this).parents(".voucher-yc").find(".voucher-yc-bo").eq(inde).find("input").val("").removeAttr('code');
				$(this).parents(".voucher-yc").find(".voucher-yc-bo").eq(inde).find("textarea").val("").removeAttr('code');
				$(this).parents(".voucher-yc").find(".voucher-yc-bo").eq(inde).find(".selected").addClass("unselected").removeClass("selected");
			}

			var s = 0;
			for(var i = 0; i < _this.find(".yctz").length; i++) {
				if(_this.find(".yctz").eq(i).val() != "") {
					s += parseFloat(_this.find(".yctz").eq(i).val().split(",").join(""));
				}
			}
			s = s.toFixed(2);
			var n = s
			if(s < 10000000000 && vousinglepz == false && vousinglepzzy == false) {
				n = s.replace(".", "");
			}
			if(moneyzy == 0 && _this.parents(".voucher-center").find(".moneyd").find(".money-sr").val() == '') {
				_this.parents(".voucher-center").find(".moneyj").find(".money-sr").val(s).addClass("money-ys");;
				_this.parents(".voucher-center").find(".moneyj").find(".money-xs").html(n);
			} else if(moneyzy == 0 && _this.parents(".voucher-center").find(".moneyd").find(".money-sr").val() != '') {
				_this.parents(".voucher-center").find(".moneyd").find(".money-sr").val(s).addClass("money-ys");
				_this.parents(".voucher-center").find(".moneyd").find(".money-xs").html(n);
			} else if(moneyzy == 1 && _this.parents(".voucher-center").find(".moneyj").find(".money-sr").val() == '') {
				_this.parents(".voucher-center").find(".moneyd").find(".money-sr").val(s).addClass("money-ys");
				_this.parents(".voucher-center").find(".moneyd").find(".money-xs").html(n);
			} else if(moneyzy == 1 && _this.parents(".voucher-center").find(".moneyj").find(".money-sr").val() != '') {
				_this.parents(".voucher-center").find(".moneyj").find(".money-sr").val(s).addClass("money-ys");
				_this.parents(".voucher-center").find(".moneyj").find(".money-xs").html(n);
			}
			bidui();
		}
		if(vousinglepz == true) {
			var nums = $(this).parents(".voucher-center").find('.money-ys').val()
			$(this).parents(".voucher-center").find('.money-ys').parents('.money-jd').find('.money-xs').html(formatNum(nums))
			bidui();
		}
	}
})

$(document).on("mouseover", ".voucher-yc-bo", function() {
	var inde = $(this).index() - 1
	$(this).parents('.voucher-yc-bg').next('.voucher-yc-deletebtns').find(".ycdelect").eq(inde).css("visibility", "visible");
	$(this).parents('.voucher-yc-bg').prev('.voucher-yc-addbtns').find(".ycadd").eq(inde).css("visibility", "visible");
})
$(document).on("mouseout", ".voucher-yc-bo", function() {
	var inde = $(this).index() - 1
	$(this).parents('.voucher-yc-bg').next('.voucher-yc-deletebtns').find(".ycdelect").eq(inde).css("visibility", "hidden");
	$(this).parents('.voucher-yc-bg').prev('.voucher-yc-addbtns').find(".ycadd").eq(inde).css("visibility", "hidden");
})
$(document).on("mouseover", ".voucher-yc-deletebtns .ycdeldiv", function() {
	var inde = $(this).index()
	$(this).find('.ycdelect').css("visibility", "visible");
	$(this).parents('.voucher-yc-deletebtns').prevAll('.voucher-yc-addbtns').find('.ycadd').eq(inde - 1).css("visibility", "visible");
})
$(document).on("mouseover", ".voucher-yc-addbtns .ycadddiv", function() {
	var inde = $(this).index()
	$(this).find('.ycadd').css("visibility", "visible");
	$(this).parents('.voucher-yc-addbtns').nextAll('.voucher-yc-deletebtns').find('.ycdelect').eq(inde).css("visibility", "visible");
})
$(document).on("mouseout", ".voucher-yc-deletebtns .ycdeldiv", function() {
	var inde = $(this).index()
	$(this).find('.ycdelect').css("visibility", "hidden");
	$(this).parents('.voucher-yc-deletebtns').prevAll('.voucher-yc-addbtns').find('.ycadd').eq(inde - 1).css("visibility", "hidden");
})
$(document).on("mouseout", ".voucher-yc-addbtns .ycadddiv", function() {
	var inde = $(this).index()
	$(this).find('.ycadd').css("visibility", "hidden");
	$(this).parents('.voucher-yc-addbtns').nextAll('.voucher-yc-deletebtns').find('.ycdelect').eq(inde).css("visibility", "hidden");
})

//辅助项分录表格
$(document).on("click", ".voucher-yc", function(e) {
	stopPropagation(e)
})
$(document).on("click", ".yctz", function(e) {
	stopPropagation(e)
})
$(document).on("mouseout", ".voucher-yc", function(e) {
	stopPropagation(e)
})
var keyzhibiao = new Object()
//辅助金额input
$(document).on("focus", ".yctz", function() {
	var editStatus0 = ($("#pzzhuantai").attr("vou-status") == undefined);
	if(!editStatus0) {
		var editStatus1 = ($("#pzzhuantai").attr("vou-status") == "O");
		var editStatus2 = (isInputor == true && (selectdata.data.inputor == ufgovkey.svUserId || selectdata.data.inputor == undefined));
		var editStatus3 = ((isvousource && isvousourceclick == false) || isvousourceclick)
		if(editStatus1 && (editStatus2 || isInputor == false) && editStatus3) {
			$(this).removeAttr("readonly");
		} else {
			$(this).attr("readonly", true);
			//return false;
		}
	} else {
		$(this).removeAttr("readonly");
	}
	var thisvals = $(this).val().split(",").join("");
	if(!$(this).attr("readonly")) {
		$(this).val(thisvals).select();
	}
	_this = $(this);
	var fasong = true;
	for(var i = 0; i < $(this).parents(".voucher-yc-bo").find(".ycbodyinp").length; i++) {
		if($(this).parents(".voucher-yc-bo").find(".ycbodyinp").eq(i).val()=='' && $(this).parents(".voucher-yc-bo").find(".ycbodyinp").eq(i).attr("relation") !=undefined) {
			var inp = $(this).parents(".voucher-yc-bo").find(".ycbodyinp").eq(i)
			if( !inp.hasClass('billTypeinp') && !inp.hasClass('curcodeinp')) {
				fasong = false
			}
		}
	}
	if(fasong == true) {
		var yctzthis = new Object();
		var namei = $(".voucher-hover").find(".accountinginp").attr("accoindex");
		if($(".voucher-hover").hasClass("voucher-hovercw")){
			namei = $(".voucher-hover").find('.voucher-centercw').find(".accountinginp").attr("accoindex");
		}else if($(".voucher-hover").hasClass("voucher-hoverys")){
			namei = $(".voucher-hover").find('.voucher-centerys').find(".accountinginp").attr("accoindex");
		}
		yctzthis.accoId = quanjuvoudatas.data[namei].chrId;
		yctzthis.accoCode = quanjuvoudatas.data[namei].accoCode;
		yctzthis.stadAmt = 0;
		yctzthis.agencyCode = rpt.nowAgencyCode;
		yctzthis.acctCode = rpt.nowAcctCode;
		if($(".voucher-head").attr("namess") != undefined) {
			yctzthis.busBillId = $(".voucher-head").attr("namess");
		} else {
			yctzthis.busBillId = ""
		}
		var ycybodys = $(this).parents(".voucher-yc-bo").find(".ycbodyinp").length;
		for(var i = 0; i < ycybodys; i++) {
			if($(this).parents(".voucher-yc-bo").find(".ycbodyinp").eq(i).attr("relation") !=undefined){
				var name = $(this).parents(".voucher-yc-bg").find(".voucher-yc-bt").find(".ychead").eq(i).attr("name");
				var code = $(this).parents(".voucher-yc-bo").find(".ycbodyinp").eq(i).attr('code')
				if(tablehead[name] != undefined) {
					var thiselecode = tablehead[name].ELE_CODE
					yctzthis[tablehead[name].ELE_CODE] = code;
				}
			}
		}
		var noshows = JSON.parse($(this).parents(".voucher-yc-bg").find(".voucher-yc-bt").find(".noshowdata").attr('noshow'))
		for(var n in noshows) {
			var sz = n.substring(0, n.length - 4).toUpperCase()
			yctzthis[sz] = noshows[n]
		}
		var vcselname = $(".voucher-hover").find(".accountinginp").attr("accoindex");
		if($(".voucher-hover").hasClass("voucher-hovercw")){
			vcselname = $(".voucher-hover").find('.voucher-centercw').find(".accountinginp").attr("accoindex");
		}else if($(".voucher-hover").hasClass("voucher-hoverys")){
			vcselname = $(".voucher-hover").find('.voucher-centerys').find(".accountinginp").attr("accoindex");
		}
		var voucherycss = new Object();
		for(var d in tablehead) {
			var c = d.substring(0, d.length - 4)
			if(quanjuvoudatas.data[vcselname][c] == 2) {
				yctzthis[tablehead[d].ELE_CODE] = quanjuvoudatas.data[vcselname][d]
			}
		}
		if(keypandingzhibiao != null) {
			for(var i = 0; i < keypandingzhibiao.length; i++) {
				if(keypandingzhibiao[i].split(" ")[0] == quanjuvoudatas.data[namei].accoCode) {
					$.ajax({
						type: "post",
						url: "/gl/vou/queryBg" + "?ajax=1&rueicode="+hex_md5svUserCode,
						async: true,
						data: JSON.stringify(yctzthis),
						contentType: 'application/json; charset=utf-8',
						success: function(data) {
							if(data.flag == "success") {
								if(data.data != null && data.data.length > 0) {
									var tzlang = _this.parents(".voucher-yc-bo").find('.yctz').width() - 15
									_this.after('<span class="yctzyuer">指标余额：' + data.data[0].bgItemBalance + '</span><span class="yctzyutext" style="right:' + tzlang + 'px">预</span>')
									var yctzyuername = _this.parents(".voucher-center").index() + _this.parents(".voucher-yc-bo").index()
									_this.next(".yctzyuer").attr("name", yctzyuername);
									keyzhibiao[_this.next(".yctzyuer").attr("name")] = data.data;
								}
							}
						}
					});
				} else {
					$(this).parents(".voucher-yc-bo").find(".yctzyutext").remove()
					$(this).parents(".voucher-yc-bo").find(".yctzyuer").remove()
				}
			}
		}
	}
})

$(document).on("keydown", function(event) {
	if(!$(".voucher-yc input:focus").get(0) && $(".voucher-yc").is(":visible")) {
		if(event.keyCode == "13" && event.ctrlKey) {
			$(".voucher-yc").hide();
			var slength = $(".voucher").find('.voucher-center').length;
			for(var i = 0; i < $(".voucher").find('.voucher-center').length; i++) {
				if($(".voucher").find('.voucher-center').eq(i).attr('op') == 2) {
					slength--;
				}
			}
			$(".voucherall").height($(".voucherall").height() + ((slength - 4) * 50))
		}
	}
});
//关闭辅助项表格按钮
$(document).on("click", ".voucher-close", function(event) {
	event.stopPropagation();
	var $yc = $(this).parents(".voucher-yc");
	if($yc.css('display') != 'none') {
		$yc.hide();
		$(".voucherall").height($(".voucherall").height() -$yc.outerHeight())
		voucherycshowheight()
		
	}
});
$(document).on("click", ".voucher-yc-j", function(event) {
	event.stopPropagation();
	if(!isInputChange()) {
		$(this).attr("readonly", true);
		return false;
	} else {
		var l = 0;
		for(var i = 0; i < $(this).parents(".voudetailAss").find(".yctz").length; i++) {
			if($(this).parents(".voudetailAss").find(".yctz").eq(i).val() != "") {
				l += parseFloat($(this).parents(".voudetailAss").find(".yctz").eq(i).val().split(",").join(""));
			}
		}
		l = l.toFixed(2);
		var thiscenter;
		if($('.voucher-hover').hasClass('voucher-hovercw')){
			thiscenter = $('.voucher-hover').find(".voucher-centercw")
		}else  if($('.voucher-hover').hasClass('voucher-hoverys')){
			thiscenter = $('.voucher-hover').find(".voucher-centerys")
		}
		thiscenter.find(".moneyj").find(".money-sr").val(l).addClass("money-ys");
		thiscenter.find(".moneyj").find(".money-xs").html(l);
		thiscenter.find(".moneyd").find(".money-sr").val("").removeClass("money-ys");
		thiscenter.find(".moneyd").find(".money-xs").html("");
		bidui()
	}
});
$(document).on("click", ".voucher-yc-d", function(event) {
	event.stopPropagation();
	if(!isInputChange()) {
		$(this).attr("readonly", true);
		return false;
	} else {
		var l = 0;
		for(var i = 0; i < $(this).parents(".voudetailAss").find(".yctz").length; i++) {
			if($(this).parents(".voudetailAss").find(".yctz").eq(i).val() != "") {
				l += parseFloat($(this).parents(".voudetailAss").find(".yctz").eq(i).val().split(",").join(""));
			}
		}
		l = l.toFixed(2);
		var thiscenter;
		if($('.voucher-hover').hasClass('voucher-hovercw')){
			thiscenter = $('.voucher-hover').find(".voucher-centercw")
		}else  if($('.voucher-hover').hasClass('voucher-hoverys')){
			thiscenter = $('.voucher-hover').find(".voucher-centerys")
		}
		thiscenter.find(".moneyd").find(".money-sr").val(l).addClass("money-ys");
		thiscenter.find(".moneyd").find(".money-xs").html(l);
		thiscenter.find(".moneyj").find(".money-sr").val("").removeClass("money-ys");
		thiscenter.find(".moneyj").find(".money-xs").html("");
		bidui()
	}
});
$(document).on("click", ".fzhsadd", function(e) {
	stopPropagation(e);
	var title = $(this).attr('tzurl')
	var baseUrl = '';
	var title = ''
	if(fzhsurlData[title] == undefined) {
		baseUrl = '/pf/ma/userData/userDataAgy.html?menuid=ebb236b4-7020-4d40-b306-5fd90669ee59&menuname=%E5%9F%BA%E7%A1%80%E6%95%B0%E6%8D%AE%E7%BB%B4%E6%8A%A4&firstLevel=21'
		title = '基础数据维护'
	} else if($(this).attr('tzurl') == 'billtype'){
		baseUrl = fzhsurlData[title]
		title = '票据类型'
	}else{
		baseUrl = fzhsurlData[title]
		title = tablehead[title].ELE_NAME
	}
	ufma.removeCache("maobjData");
	var maobjData = {
		agencyCode: rpt.cbAgency.getValue(),
		acctCode: rpt.cbAcct.getValue()
	}
	ufma.setObjectCache("maobjData", maobjData);
	uf.openNewPage(page.isCrossDomain,$(this), 'openMenu', baseUrl, false, title);
	
})