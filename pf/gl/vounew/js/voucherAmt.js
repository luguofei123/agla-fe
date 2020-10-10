//第三列事件
$(document).on("focus", ".money-sr", function() {
	voucherhover($(this))
})
//验证输入内容,只保留数字和小数点
$(document).on("keyup", ".money-sr", function() {
	var c = $(this);
	if(c.val().indexOf("。") >= 0) {
	 	var tempdian =  c.val().replace(/[。]/g, '.');
		$(this).val(tempdian);
	}
	if(/[^\d.]/.test(c.val())) { //替换非数字字符  
		var temp_amount = c.val().replace(/[^\d.+=-]/g, '');
		$(this).val(temp_amount);
	}
	if($(this).val() != "") {
		var thisvalsss = $(this).val()
		if(thisvalsss.indexOf("=") >= 0) {
			$(this).val("");
			if($(this).parents(".money-jd").hasClass("moneyj")) {
				$(this).parents(".money-jd").next(".money-jd").find(".money-sr").val("");
				$(this).parents(".money-jd").next(".money-jd").find(".money-xs").html("");
				$(this).val(0.00);
				$(this).next(".money-xs").html("000");
			} else {
				$(this).parents(".money-jd").prev(".money-jd").find(".money-sr").val("");
				$(this).parents(".money-jd").prev(".money-jd").find(".money-xs").html("");
				$(this).val(0.00);
				$(this).next(".money-xs").html("000");
			}
			$(this).val(0.00);
			$(this).next(".money-xs").html("000");
			var monjfang = 0;
			if(vousinglepz == false && vousinglepzzy == false) {
				for(var i = 0; i < $(".voucher-center").length; i++) {
					if($(".voucher-center").eq(i).find(".moneyj").find(".money-sr").val() != "") {
						monjfang += parseFloat($(".voucher-center").eq(i).find(".moneyj").find(".money-sr").val());
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
				if($(this).parents('.voucher-center').hasClass('voucher-centercw')) {
					for(var i = 0; i < $(".voucher-centercw").length; i++) {
						if($(".voucher-centercw").eq(i).find(".moneyj").find(".money-sr").val() != "") {
							monjfang += parseFloat($(".voucher-centercw").eq(i).find(".moneyj").find(".money-sr").val());
						}
					}
				} else if($(this).parents('.voucher-center').hasClass('voucher-centerys')) {
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
				for(var i = 0; i < $(".voucher-center").length; i++) {
					if($(".voucher-center").eq(i).find(".moneyd").find(".money-sr").val() != "") {
						mondfang += parseFloat($(".voucher-center").eq(i).find(".moneyd").find(".money-sr").val());
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
				if($(this).parents('.voucher-center').hasClass('voucher-centercw')) {
					for(var i = 0; i < $(".voucher-centercw").length; i++) {
						if($(".voucher-centercw").eq(i).find(".moneyd").find(".money-sr").val() != "") {
							mondfang += parseFloat($(".voucher-centercw").eq(i).find(".moneyd").find(".money-sr").val());
						}
					}
				} else if($(this).parents('.voucher-center').hasClass('voucher-centerys')) {
					for(var i = 0; i < $(".voucher-centerys").length; i++) {
						if($(".voucher-centerys").eq(i).find(".moneyd").find(".money-sr").val() != "") {
							mondfang += parseFloat($(".voucher-centerys").eq(i).find(".moneyd").find(".money-sr").val());
						}
					}
				} else {
					for(var i = 0; i < $(".voucher-center").length; i++) {
						if($(".voucher-center").eq(i).find(".moneyd").find(".money-sr").val() != "") {
							mondfang += parseFloat($(".voucher-center").eq(i).find(".moneyd").find(".money-sr").val());
						}
					}
				}
			}
			if($(this).parents(".money-jd").hasClass("moneyj")) {
				if(monjfang == mondfang) {} else {
					$(this).parents(".money-jd").next(".money-jd").find(".money-sr").val("");
					$(this).parents(".money-jd").next(".money-jd").find(".money-xs").html("");
					$(this).val((mondfang - monjfang).toFixed(2));
					if((mondfang - monjfang) >= 10000000000 || vousinglepz == true || vousinglepzzy == true) {
						$(this).next(".money-xs").html(formatNum((mondfang - monjfang).toFixed(2)));
					} else {
						$(this).next(".money-xs").html(((mondfang - monjfang).toFixed(2)) * 100);
					}
				}
			} else {
				if(monjfang == mondfang) {} else {
					$(this).parents(".money-jd").prev(".money-jd").find(".money-sr").val("");
					$(this).parents(".money-jd").prev(".money-jd").find(".money-xs").html("");
					$(this).val((monjfang - mondfang).toFixed(2));
					if((monjfang - mondfang) >= 10000000000 || vousinglepz == true || vousinglepzzy == true) {
						$(this).next(".money-xs").html(formatNum((monjfang - mondfang).toFixed(2)));
					} else {
						$(this).next(".money-xs").html(((monjfang - mondfang).toFixed(2)) * 100);
					}
				}
			}
			if($(this).val() >= 10000000000) {
				bidui();
			}
			$(this).focus()
			bidui();
			return false;
		}
		if(thisvalsss.indexOf("+") < 0) {
			bidui()
		}
	}
	//每次都运行总金额比对事件
})
//内容改变的时候运行改变事件
$(document).on("input", ".moneyj .money-sr", function() {
	$(this).parent(".money-jd").next(".moneyd").find(".money-sr").val("");
	$(this).parent(".money-jd").next(".moneyd").find(".money-xs").html("");
	$(this).parent(".money-jd").next(".moneyd").removeClass("money-ys");
	bidui();
})
//点击的时候判定本行分录是否有辅助核算项,有的话就不允许显示修改,没有就显示修改
$(document).on("click", ".voucher-center .moneyd", function(e) {
	voucherhover($(this))
	if(!isInputChange()){
		$(this).find(".money-sr").attr("readonly", true);
		return false;
	} else {
		if($(this).parents(".voucher-center").find(".abstractinp").eq(0).val() == "") {
			if($(this).parents(".voucher-body").prevAll(".voucher-center").length >= 1 && vousinglepzzy != true) {
				for(var i=0;i<$(this).parents(".voucher-body").prevAll(".voucher-center").length;i++){
					if($(this).parents(".voucher-body").prevAll(".voucher-center").eq(i).hasClass('deleteclass')!=true){
						$(this).parents(".voucher-center").find(".abstractinp").eq(0).val($(this).parents(".voucher-center").prevAll(".voucher-center").eq(i).find(".abstractinp").eq(0).val())
						break;
					}
				}
			} else if($(this).parents(".voucher-centercw").prevAll(".voucher-centercw").length >= 1 && vousinglepzzy == true) {
				for(var i=0;i<$(this).parents(".voucher-centercw").prevAll(".voucher-centercw").length;i++){
					if($(this).parents(".voucher-centercw").prevAll(".voucher-centercw").eq(i).hasClass('deleteclass')!=true){
						$(this).parents(".voucher-center").find(".abstractinp").eq(0).val($(this).parents(".voucher-centercw").prevAll(".voucher-centercw").eq(i).find(".abstractinp").eq(0).val())
						break;
					}
				}
			} else if($(this).parents(".voucher-centerys").prevAll(".voucher-centerys").length >= 1 && vousinglepzzy == true) {
				for(var i=0;i<$(this).parents(".voucher-centerys").prevAll(".voucher-centerys").length;i++){
					if($(this).parents(".voucher-centerys").prevAll(".voucher-centerys").eq(i).hasClass('deleteclass')!=true){
						$(this).parents(".voucher-center").find(".abstractinp").eq(0).val($(this).parents(".voucher-centerys").prevAll(".voucher-centerys").eq(i).find(".abstractinp").eq(0).val())
						break;
					}
				}
			}
			//当本侧无摘要时候向对侧方获取摘要	
			if($(this).parents(".voucher-center").find(".abstractinp").eq(0).val() == ""){
				if($(this).parents(".voucher-body").prevAll(".voucher-center").length >= 1) {
					for(var i=0;i<$(this).parents(".voucher-body").prevAll(".voucher-center").length;i++){
						if($(this).parents(".voucher-body").prevAll(".voucher-center").eq(i).find(".abstractinp").eq(0).val()!=''){
							$(this).parents(".voucher-center").find(".abstractinp").eq(0).val($(this).parents(".voucher-center").prevAll(".voucher-center").eq(i).find(".abstractinp").eq(0).val())
							break;
						}
					}
				}
			}
		}
		$(this).find(".money-sr").removeAttr("readonly");
	}
	$(".all-no").hide();
	stopPropagation(e)
	if($(this).parents(".voucher-centerhalf").find(".accountinginp").attr('accitemnum') == 1) {
		if($(this).parents(".voucher-centerhalf").find(".moneyd").find(".money-sr").val() == '' && isnoclickmoney) {
			var dmoney = $(this).parents(".voucher-centerhalf").find(".moneyj").find(".money-sr").val()
			var dmoneypar = $(this).parents(".voucher-centerhalf").find(".moneyj").find(".money-xs").html()
			$(this).parents(".voucher-centerhalf").find(".moneyd").find(".money-sr").val(dmoney).addClass('money-ys')
			$(this).parents(".voucher-centerhalf").find(".moneyd").find(".money-xs").html(dmoneypar)
			$(this).parents(".voucher-centerhalf").find(".moneyj").find(".money-sr").val('').removeClass('money-ys')
			$(this).parents(".voucher-centerhalf").find(".moneyj").find(".money-xs").html('')
			if(selectdata.data != undefined && selectdata.data.vouStatus == "O") {
				$("#pzzhuantai").hide();
				voubiaoji();
				$(this).parents(".voucher-centerhalf").attr("op", 1)
			}
			bidui()
		}
	} else{
		$(this).find(".money-sr").css("display", "block");
		$(this).find(".money-xs").css("display", "none");
		$(this).find(".money-xsbg").css("display", "none");
		$(this).find(".money-sr").focus();
		if($(this).find(".money-sr").val() == '' && isnoclickmoney) {
			var dmoney = $(this).parents(".voucher-centerhalf").find(".moneyj").find(".money-sr").val()
			var dmoneypar = $(this).parents(".voucher-centerhalf").find(".moneyj").find(".money-xs").html()
			$(this).parents(".voucher-centerhalf").find(".moneyd").addClass('money-ys')
			$(this).parents(".voucher-centerhalf").find(".moneyj").removeClass('money-ys')
			$(this).parents(".voucher-centerhalf").find(".moneyd").find(".money-sr").val(dmoney)
			$(this).parents(".voucher-centerhalf").find(".moneyd").find(".money-xs").html(dmoneypar)
			$(this).parents(".voucher-centerhalf").find(".moneyj").find(".money-sr").val('')
			$(this).parents(".voucher-centerhalf").find(".moneyj").find(".money-xs").html('')
			if(selectdata.data != undefined && selectdata.data.vouStatus == "O") {
				$("#pzzhuantai").hide();
				voubiaoji();
				$(this).parents(".voucher-centerhalf").attr("op", 1)
			}
		}
	}
})
$(document).on("click", ".voucher-center .moneyj", function(e) {
	voucherhover($(this))
	if(!isInputChange()){
		$(this).find(".money-sr").attr("readonly", true);
		return false;
	} else {
		if($(this).parents(".voucher-center").find(".abstractinp").eq(0).val() == "") {
			if($(this).parents(".voucher-body").prev(".voucher-center").length >= 1 && vousinglepzzy != true) {
				$(this).parents(".voucher-center").find(".abstractinp").eq(0).val($(this).parents(".voucher-center").prev(".voucher-center").find(".abstractinp").eq(0).val())
			} else if($(this).parents(".voucher-body").prev(".voucher-center").prev(".voucher-center").length >= 1 && $(this).parents(".voucher-body").hasClass('voucher-centercw') && vousinglepzzy == true) {
				$(this).parents(".voucher-center").find(".abstractinp").eq(0).val($(this).parents(".voucher-center").prev(".voucher-center").prev(".voucher-center").find(".abstractinp").eq(0).val())
			}
		}
		$(this).find(".money-sr").removeAttr("readonly");
	}
	$(".all-no").hide();
	stopPropagation(e)
	if($(this).parents(".voucher-centerhalf").find(".accountinginp").attr('accitemnum') == 1) {
		if($(this).parents(".voucher-centerhalf").find(".moneyj").find(".money-sr").val() == '' && isnoclickmoney) {
			var dmoney = $(this).parents(".voucher-centerhalf").find(".moneyd").find(".money-sr").val()
			var dmoneypar = $(this).parents(".voucher-centerhalf").find(".moneyd").find(".money-xs").html()
			$(this).parents(".voucher-centerhalf").find(".moneyj").find(".money-sr").val(dmoney).addClass('money-ys')
			$(this).parents(".voucher-centerhalf").find(".moneyj").find(".money-xs").html(dmoneypar)
			$(this).parents(".voucher-centerhalf").find(".moneyd").find(".money-sr").val('').removeClass('money-ys')
			$(this).parents(".voucher-centerhalf").find(".moneyd").find(".money-xs").html('')
			if(selectdata.data != undefined && selectdata.data.vouStatus == "O") {
				voubiaoji();
				$(this).parents(".voucher-centerhalf").attr("op", 1)
			}
			bidui()
		}
	} else {
		$(this).find(".money-sr").css("display", "block");
		$(this).find(".money-xs").css("display", "none");
		$(this).find(".money-xsbg").css("display", "none");
		$(this).find(".money-sr").focus();
		if($(this).find(".money-sr").val() == '' && isnoclickmoney) {
			var dmoney = $(this).parents(".voucher-centerhalf").find(".moneyd").find(".money-sr").val()
			var dmoneypar = $(this).parents(".voucher-centerhalf").find(".moneyd").find(".money-xs").html()
			$(this).parents(".voucher-centerhalf").find(".moneyj").addClass('money-ys')
			$(this).parents(".voucher-centerhalf").find(".moneyd").removeClass('money-ys')
			$(this).parents(".voucher-centerhalf").find(".moneyj").find(".money-sr").val(dmoney)
			$(this).parents(".voucher-centerhalf").find(".moneyj").find(".money-xs").html(dmoneypar)
			$(this).parents(".voucher-centerhalf").find(".moneyd").find(".money-sr").val('')
			$(this).parents(".voucher-centerhalf").find(".moneyd").find(".money-xs").html('')
			if(selectdata.data != undefined && selectdata.data.vouStatus == "O") {
				$("#pzzhuantai").hide();
				voubiaoji();
				$(this).parents(".voucher-centerhalf").attr("op", 1)
			}
		}
	}
})
//输入失去焦点的时候隐藏输入框显示分单位显示内容
$(document).on("blur", ".money-sr", function() {
	if($(this).val() != "") {
		var thisvalsss = $(this).val()
		if(thisvalsss.indexOf("=") >= 0) {
			$(this).val("");
			if($(this).parents(".money-jd").hasClass("moneyj")) {
				$(this).parents(".money-jd").next(".money-jd").find(".money-sr").val("");
				$(this).parents(".money-jd").next(".money-jd").find(".money-xs").html("");
				$(this).val(0.00);
				$(this).next(".money-xs").html("000");
			} else {
				$(this).parents(".money-jd").prev(".money-jd").find(".money-sr").val("");
				$(this).parents(".money-jd").prev(".money-jd").find(".money-xs").html("");
				$(this).val(0.00);
				$(this).next(".money-xs").html("000");
			}
			$(this).val(0.00);
			$(this).next(".money-xs").html("000");
			var monjfang = 0;
			for(var i = 0; i < $(".voucher-centerhalf").length; i++) {
				if($(".voucher-centerhalf").eq(i).find(".moneyj").find(".money-sr").val() != "") {
					monjfang += parseFloat($(".voucher-centerhalf").eq(i).find(".moneyj").find(".money-sr").val());
				}
			}
			var mondfang = 0;
			for(var i = 0; i < $(".voucher-centerhalf").length; i++) {
				if($(".voucher-centerhalf").eq(i).find(".moneyd").find(".money-sr").val() != "") {
					mondfang += parseFloat($(".voucher-centerhalf").eq(i).find(".moneyd").find(".money-sr").val());
				}
			}
			if($(this).parents(".money-jd").hasClass("moneyj")) {
				if(monjfang == mondfang) {} else {
					$(this).parents(".money-jd").next(".money-jd").find(".money-sr").val("");
					$(this).parents(".money-jd").next(".money-jd").find(".money-xs").html("");
					$(this).val((mondfang - monjfang).toFixed(2));
					if((mondfang - monjfang) >= 10000000000 || vousinglepz == true || vousinglepzzy == true) {
						$(this).next(".money-xs").html(formatNum((mondfang - monjfang).toFixed(2)));
					} else {
						$(this).next(".money-xs").html(((mondfang - monjfang).toFixed(2)) * 100);
					}
				}
			} else {
				if(monjfang == mondfang) {} else {
					$(this).parents(".money-jd").prev(".money-jd").find(".money-sr").val("");
					$(this).parents(".money-jd").prev(".money-jd").find(".money-xs").html("");
					$(this).val((monjfang - mondfang).toFixed(2));
					if((monjfang - mondfang) >= 10000000000 || vousinglepz == true || vousinglepzzy == true) {
						$(this).next(".money-xs").html(formatNum((monjfang - mondfang).toFixed(2)));
					} else {
						$(this).next(".money-xs").html(((monjfang - mondfang).toFixed(2)) * 100);
					}
				}
			}
			if($(this).val() >= 10000000000) {
				bidui();
			}
			$(this).focus()
			bidui();
			return false;
		} else if(thisvalsss.indexOf("+") >= 0) {
			var z = 0
			var arrstr = thisvalsss.split('+')
			for(var i = 0; i < arrstr.length; i++) {
				if(isNaN(parseFloat(arrstr[i]))) {

				} else {
					z += parseFloat(arrstr[i])
				}
			}
			$(this).val(z)
			var s = parseFloat($(this).val());
			s = s.toFixed(2);
			if(s == "0.00") {
				s = "";
			}
			$(this).val(s);
			var n = formatNum(s);
			if(s >= 10000000000 && vousinglepz == false && vousinglepzzy == false) {
				$(".money-xs").css({
					"letter-spacing": "2px",
					"margin-left": "-6px"
				})
				$(".moneydw").css("visibility", "hidden")
				$(".money-xsbg").css("visibility", "hidden");
				n = formatNum(s)
			} else if(s < 10000000000 && vousinglepz == false && vousinglepzzy == false) {
				$(".money-xs").css({
					"letter-spacing": "9px",
					"margin-left": "0px"
				})
				$(".moneydw").css("visibility", "visible")
				$(".money-xsbg").css("visibility", "visible");
				n = s.replace(".", "")
			}

			$(this).next(".money-xs").html(n);
			$(this).hide();
			$(this).next(".money-xs").show();
			$(this).nextAll(".money-xsbg").show();
			$(this).parent(".money-jd").addClass("money-ys");

		} else {
			var s = parseFloat($(this).val());
			if(isNaN(s)){
				s=0
			}
			s = s.toFixed(2);
			if(s == "0.00") {
				s = "";
			}
			$(this).val(s);
			var n = formatNum(s);
			if(s >= 10000000000 && vousinglepz == false && vousinglepzzy == false) {
				$(".money-xs").css({
					"letter-spacing": "2px",
					"margin-left": "-6px"
				})
				$(".moneydw").css("visibility", "hidden")
				$(".money-xsbg").css("visibility", "hidden");
				n = formatNum(s)
			} else if(s < 10000000000 && vousinglepz == false && vousinglepzzy == false) {
				$(".money-xs").css({
					"letter-spacing": "9px",
					"margin-left": "0px"
				})
				$(".moneydw").css("visibility", "visible")
				$(".money-xsbg").css("visibility", "visible");
				n = s.replace(".", "")
			}

			$(this).next(".money-xs").html(n);
			$(this).hide();
			$(this).next(".money-xs").show();
			$(this).nextAll(".money-xsbg").show();
			$(this).parent(".money-jd").addClass("money-ys");
		}
	} else {
		$(this).next(".money-xs").html("");
		$(this).hide();
		$(this).next(".money-xs").show();
		$(this).nextAll(".money-xsbg").show();
	}
	bidui();
})
//添加键盘事件,当按下enter的时候判定是否有内容,有就跳转到下一行,没有就跳到另外一处金额输入,借贷方都没有内容则没有响应
$(document).on('keydown', ".money-sr", function(event) {
	var editStatus0 = ($("#pzzhuantai").attr("vou-status") == undefined);
	if(!editStatus0) {
		var editStatus1 = ($("#pzzhuantai").attr("vou-status") == "O");
		var editStatus2 = (isInputor == true && (selectdata.data.inputor == ufgovkey.svUserId || selectdata.data.inputor == undefined));
		var editStatus3 = ((isvousource && isvousourceclick == false) || isvousourceclick)
		if(editStatus1 && (editStatus2 || isInputor == false) && editStatus3) {} else {
			return false;
		}
	}
	event = event || window.event;
	if(event.keyCode==229){
		var c = $(this);
		if(c.val().indexOf("。") >= 0) {
		 	var tempdian =  c.val().replace(/[。]/g, '.');
			$(this).val(tempdian);
		}
	}
	//Enter
	if(event.keyCode == 9) {
		event.preventDefault();
		if(keydownctrls == true && $("#btn-voucher-bc").length == 1) {
			keydownctrls = false;
			_this = $(this)
			setTimeout(function() {
				if(vousinglepzzy) {
					if(_this.parents(".voucher-centercw").length>0) {
						$(".voucher-centerys").eq(0).find('.abstractinp').focus()
					} else {
						$(".voucher-centercw").eq(0).find('.abstractinp').focus()
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
	if(event.shiftKey && event.keyCode == 13) {
		event.preventDefault();
		if($(this).parents(".voucher-center").hasClass('voucher-centercw')) {
			for(var i = 0; i < $(".voucher-centerys").length; i++) {
				if($(".voucher-centerys").eq(i).hasClass("deleteclass") != true) {
					$(".accountinginps").hide();
					$(".voucher-centerys").eq(i).find(".accountinginp").focus();
					break;
				}
			}
		} else if($(this).parents(".voucher-center").hasClass('voucher-centerys')) {
			for(var i = 0; i < $(".voucher-centercw").length; i++) {
				if($(".voucher-centercw").eq(i).hasClass("deleteclass") != true) {
					$(".abstractinps").hide();
					$(".voucher-centercw").eq(i).find(".abstractinp").focus();
					break;
				}
			}
		}
		event.keyCode = 0;
		if(event.preventDefault) { // firefox
			event.preventDefault();
		} else { // other
			event.returnValue = false;
		}
		return false;
	}
	if(event.keyCode == "13") {
		if($(this).val() != "") {
			var thisvalsss = $(this).val()
			if(thisvalsss.indexOf("+") >= 0 && thisvalsss.indexOf("=") < 0) {
				var z = 0
				var arrstr = thisvalsss.split('+')
				for(var i = 0; i < arrstr.length; i++) {
					if(isNaN(parseFloat(arrstr[i]))) {

					} else {
						z += parseFloat(arrstr[i])
					}
				}
				$(this).val(z)
			}
			if(thisvalsss.indexOf("=") >= 0) {
				$(this).val("");
				if($(this).parents(".money-jd").hasClass("moneyj")) {
					$(this).parents(".money-jd").next(".money-jd").find(".money-sr").val("");
					$(this).parents(".money-jd").next(".money-jd").find(".money-xs").html("");
					$(this).val(0.00);
					$(this).next(".money-xs").html("000");
				} else {
					$(this).parents(".money-jd").prev(".money-jd").find(".money-sr").val("");
					$(this).parents(".money-jd").prev(".money-jd").find(".money-xs").html("");
					$(this).val(0.00);
					$(this).next(".money-xs").html("000");
				}
				$(this).val(0.00);
				$(this).next(".money-xs").html("000");
				var monjfang = 0;
				var mondfang = 0;
				if($(this).parents('.voucher-center').hasClass('voucher-centercw')) {
					for(var i = 0; i < $(".voucher-centercw").length; i++) {
						if($(".voucher-centercw").eq(i).find(".moneyj").find(".money-sr").val() != "") {
							monjfang += parseFloat($(".voucher-centercw").eq(i).find(".moneyj").find(".money-sr").val());
						}
					}
					for(var i = 0; i < $(".voucher-centercw").length; i++) {
						if($(".voucher-centercw").eq(i).find(".moneyd").find(".money-sr").val() != "") {
							mondfang += parseFloat($(".voucher-centercw").eq(i).find(".moneyd").find(".money-sr").val());
						}
					}
				} else if($(this).parents('.voucher-center').hasClass('voucher-center-ys')) {
					for(var i = 0; i < $(".voucher-centerys").length; i++) {
						if($(".voucher-centerys").eq(i).find(".moneyj").find(".money-sr").val() != "") {
							monjfang += parseFloat($(".voucher-centerys").eq(i).find(".moneyj").find(".money-sr").val());
						}
					}
					for(var i = 0; i < $(".voucher-centerys").length; i++) {
						if($(".voucher-centerys").eq(i).find(".moneyd").find(".money-sr").val() != "") {
							mondfang += parseFloat($(".voucher-centerys").eq(i).find(".moneyd").find(".money-sr").val());
						}
					}
				} else if($(this).parents('.voucher-center').hasClass('voucher-center-cw')) {
					for(var i = 0; i < $(".voucher-center-cw").length; i++) {
						if($(".voucher-center-cw").eq(i).find(".moneyj").find(".money-sr").val() != "") {
							monjfang += parseFloat($(".voucher-center-cw").eq(i).find(".moneyj").find(".money-sr").val());
						}
					}
					for(var i = 0; i < $(".voucher-center-cw").length; i++) {
						if($(".voucher-center-cw").eq(i).find(".moneyd").find(".money-sr").val() != "") {
							mondfang += parseFloat($(".voucher-center-cw").eq(i).find(".moneyd").find(".money-sr").val());
						}
					}
				} else if($(this).parents('.voucher-center').hasClass('voucher-center-ys')) {
					for(var i = 0; i < $(".voucher-center-ys").length; i++) {
						if($(".voucher-center-ys").eq(i).find(".moneyj").find(".money-sr").val() != "") {
							monjfang += parseFloat($(".voucher-center-ys").eq(i).find(".moneyj").find(".money-sr").val());
						}
					}
					for(var i = 0; i < $(".voucher-center-ys").length; i++) {
						if($(".voucher-center-ys").eq(i).find(".moneyd").find(".money-sr").val() != "") {
							mondfang += parseFloat($(".voucher-center-ys").eq(i).find(".moneyd").find(".money-sr").val());
						}
					}
				} else {
					for(var i = 0; i < $(".voucher-center").length; i++) {
						if($(".voucher-center").eq(i).find(".moneyj").find(".money-sr").val() != "") {
							monjfang += parseFloat($(".voucher-center").eq(i).find(".moneyj").find(".money-sr").val());
						}
					}
					for(var i = 0; i < $(".voucher-center").length; i++) {
						if($(".voucher-center").eq(i).find(".moneyd").find(".money-sr").val() != "") {
							mondfang += parseFloat($(".voucher-center").eq(i).find(".moneyd").find(".money-sr").val());
						}
					}
				}
				if($(this).parents(".money-jd").hasClass("moneyj")) {
					if(monjfang == mondfang) {} else {
						$(this).parents(".money-jd").next(".money-jd").find(".money-sr").val("");
						$(this).parents(".money-jd").next(".money-jd").find(".money-xs").html("");
						$(this).val((mondfang - monjfang).toFixed(2));
						if((mondfang - monjfang) >= 10000000000 || vousinglepz == true || vousinglepzzy == true) {
							$(this).next(".money-xs").html(formatNum((mondfang - monjfang).toFixed(2)));
						} else {
							$(this).next(".money-xs").html(((mondfang - monjfang).toFixed(2)) * 100);
						}
					}
				} else {
					if(monjfang == mondfang) {} else {
						$(this).parents(".money-jd").prev(".money-jd").find(".money-sr").val("");
						$(this).parents(".money-jd").prev(".money-jd").find(".money-xs").html("");
						$(this).val((monjfang - mondfang).toFixed(2));
						if((monjfang - mondfang) >= 10000000000 || vousinglepz == true || vousinglepzzy == true) {
							$(this).next(".money-xs").html(formatNum((monjfang - mondfang).toFixed(2)));
						} else {
							$(this).next(".money-xs").html(((monjfang - mondfang).toFixed(2)) * 100);
						}
					}
				}
				if($(this).val() >= 10000000000) {
					bidui();
				}
				if($(this).val() >= 10000000000 && vousinglepz == false && vousinglepzzy == false) {
					$(".money-xs").css({
						"letter-spacing": "2px",
						"margin-left": "-6px"
					})
					$(".moneydw").css("visibility", "hidden")
					$(".money-xsbg").css("visibility", "hidden");
				} else if($(this).val() < 10000000000 && vousinglepz == false && vousinglepzzy == false) {
					$(".money-xs").css({
						"letter-spacing": "9px",
						"margin-left": "0px"
					})
					$(".moneydw").css("visibility", "visible")
					$(".money-xsbg").css("visibility", "visible");
				}
				$(this).focus
				bidui();
				return false;
			} else {
				var s = parseFloat($(this).val());
				s = s.toFixed(2);
				$(this).val(s);
				bidui();
				var n = formatNum(s);
				if(s >= 10000000000 && vousinglepz == false && vousinglepzzy == false) {
					$(".money-xs").css({
						"letter-spacing": "2px",
						"margin-left": "-6px"
					})
					$(".moneydw").css("visibility", "hidden")
					$(".money-xsbg").css("visibility", "hidden");
					n = formatNum(s)
				} else if(s < 10000000000 && vousinglepz == false && vousinglepzzy == false) {
					$(".money-xs").css({
						"letter-spacing": "9px",
						"margin-left": "0px"
					})
					$(".moneydw").css("visibility", "visible")
					$(".money-xsbg").css("visibility", "visible");
					n = s.replace(".", "")
				}
				$(this).next(".money-xs").html(n);
				$(this).hide();
				$(this).next(".money-xs").show();
				$(this).nextAll(".money-xsbg").show();
				$(this).parent(".money-jd").addClass("money-ys");
				if($(this).parent(".moneyj").hasClass("money-ys")) {
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
				if($(this).parent(".moneyd").hasClass("money-ys")) {
					if(vousinglepzzy != true) {
						if($(this).parents(".voucher-center").next(".voucher-center").find(".money-ys").length < 1) {
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
						if($(this).parents(".voucher-center").next(".voucher-center").next(".voucher-center").find(".money-ys").length < 1) {
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
				//				}
			}
		} else {
			if($(this).parent(".money-jd").hasClass("moneyj")) {
				$(this).parent(".money-jd").next(".money-jd").find(".money-xs").hide();
				$(this).parent(".money-jd").next(".money-jd").find(".money-xsbg").hide();
				$(this).parent(".money-jd").next(".money-jd").find(".money-sr").show();
				$(this).parent(".money-jd").next(".money-jd").find(".money-sr").focus();
			} else {
				$(this).next(".money-xs").html("");
			}
		}
		if($(this).parents(".voucher-center").next(".voucher-center").find(".abstractinp").length < 1 && $(this).parents(".voucher-center").find(".money-ys").length >= 1 ) {
			if($(this).parents('.voucher').hasClass('voucher-singelzy') != true) {
				if($(this).parents(".voucher-center").hasClass('voucher-center-cw')) {
					trisdata = 1
				} else if($(this).parents(".voucher-center").hasClass('voucher-center-ys')) {
					trisdata = 2
				}
				$(this).parents(".voucher-center").after(tr());
			} else {
				$(this).parents(".voucher-center").after(tr());
			}
			newvueTypesetting()
		};
		if($(this).parents(".voucher-center").find(".money-ys").length >= 1) {
			$(this).hide();
			$(this).next(".money-xs").show();
			$(this).nextAll(".money-xsbg").show();
			if($(this).parents('.voucher').hasClass('voucher-singelzybg') || $(this).parents('.voucher').hasClass('voucher-singelzy')){
				if($(this).parents('.voucher-centerys').length>0){
					$(this).parents(".voucher-center").next(".voucher-center").find(".voucher-centerys").find(".abstractinp").focus();
					$(this).parents(".voucher-center").next(".voucher-center").find(".voucher-centerys").attr("op", "1");
				}else if($(this).parents('.voucher-centercw').length>0){
					$(this).parents(".voucher-center").next(".voucher-center").find(".voucher-centercw").find(".abstractinp").focus();
					$(this).parents(".voucher-center").next(".voucher-center").find(".voucher-centercw").attr("op", "1");
				}
			}else{
				$(this).parents(".voucher-center").next(".voucher-center").find(".abstractinp").focus();
				$(this).parents(".voucher-center").next(".voucher-center").attr("op", "1");
			}

		}
		return false;
	}
	//F7
	if(event.keyCode == "118") {
		if($(this).parents(".money-jd").hasClass("moneyj")) {
			$(this).parents(".money-jd").next(".money-jd").find(".money-sr").val("");
			$(this).parents(".money-jd").next(".money-jd").find(".money-xs").html("");
			$(this).val(0.00);
			$(this).next(".money-xs").html("000");
		} else {
			$(this).parents(".money-jd").prev(".money-jd").find(".money-sr").val("");
			$(this).parents(".money-jd").prev(".money-jd").find(".money-xs").html("");
			$(this).val(0.00);
			$(this).next(".money-xs").html("000");
		}
		$(this).val(0.00);
		$(this).next(".money-xs").html("000");
		var monjfang = 0;
		for(var i = 0; i < $(".voucher-center").length; i++) {
			if($(".voucher-center").eq(i).find(".moneyj").find(".money-sr").val() != "") {
				monjfang += parseFloat($(".voucher-center").eq(i).find(".moneyj").find(".money-sr").val());
			}
		}
		var mondfang = 0;
		for(var i = 0; i < $(".voucher-center").length; i++) {
			if($(".voucher-center").eq(i).find(".moneyd").find(".money-sr").val() != "") {
				mondfang += parseFloat($(".voucher-center").eq(i).find(".moneyd").find(".money-sr").val());
			}
		}
		if($(this).parents(".money-jd").hasClass("moneyj")) {
			if(monjfang == mondfang) {} else {
				$(this).parents(".money-jd").next(".money-jd").find(".money-sr").val("");
				$(this).parents(".money-jd").next(".money-jd").find(".money-xs").html("");
				$(this).val((mondfang - monjfang).toFixed(2));
				if((mondfang - monjfang) >= 10000000000 || vousinglepz == true || vousinglepzzy == true) {
					$(this).next(".money-xs").html(formatNum((mondfang - monjfang).toFixed(2)));
				} else {
					$(this).next(".money-xs").html(((mondfang - monjfang).toFixed(2)) * 100);
				}
			}
		} else {
			if(monjfang == mondfang) {} else {
				$(this).parents(".money-jd").prev(".money-jd").find(".money-sr").val("");
				$(this).parents(".money-jd").prev(".money-jd").find(".money-xs").html("");
				$(this).val((monjfang - mondfang).toFixed(2));
				if((monjfang - mondfang) >= 10000000000 || vousinglepz == true || vousinglepzzy == true) {
					$(this).next(".money-xs").html(formatNum((monjfang - mondfang).toFixed(2)));
				} else {
					$(this).next(".money-xs").html(((monjfang - mondfang).toFixed(2)) * 100);
				}
			}
		}
		if($(this).val() >= 10000000000) {
			bidui();
		}
		$(this).parents(".voucher-center").attr("op", 1)
		bidui();
		return false;
	}
});
//使用一开始预定的处理事件,只允许左右键,删除键,enter键和数字键,小数点键发挥本来作用,其他事件则屏蔽
$(document).on('keydown', ".moneyj .money-sr", function(event) {
	event = event || window.event;
	var keyCode = event.keyCode
	if(!isNumber(keyCode, event)) return false
	//	if(event.keyCode == 83 && event.ctrlKey){
	//		alert(1)
	//		return false;
	//	}
})
$(document).on('keydown', ".moneyd .money-sr", function(event) {
	event = event || window.event;
	var keyCode = event.keyCode
	if(!isNumber(keyCode, event)) return false
	//	if(event.keyCode == 83 && event.ctrlKey){
	//		alert(1)
	//		return false;
	//	}
})
//当摁下空格键
$(document).on('keydown', ".moneyj .money-sr", function(event) {
	event = event || window.event;
	if(event.keyCode == "32") {
		return false;
	}
	bidui()
})
$(document).on('keyup', ".moneyj .money-sr", function(event) {
	event = event || window.event;
	if(event.keyCode == "32") {
		var thisval = $(this).val();
		$(this).parents(".voucher-center").attr("op", 1);
		$(this).val($(this).parent(".money-jd").next(".money-jd").find(".money-sr").val())
		$(this).parent(".money-jd").next(".money-jd").find(".money-sr").val(thisval);
		$(this).next(".money-xs").html($(this).parent(".money-jd").next(".money-jd").find(".money-xs").html());
		$(this).blur();
		$(this).parent(".money-jd").next(".money-jd").find(".money-xs").hide();
		$(this).parent(".money-jd").next(".money-jd").find(".money-xsbg").hide();
		$(this).parent(".money-jd").next(".money-jd").find(".money-sr").show();
		$(this).parent(".money-jd").next(".money-jd").find(".money-sr").focus();
		var nexval = $(this).parent(".money-jd").next(".money-jd").find(".money-sr");
		return false;
	}
	bidui()
})
//第四列事件
//改变内容的时候执行总金额比对函数
$(document).on("input", ".moneyd .money-sr", function() {
	if($(this).val != "") {
		$(this).parent(".money-jd").prev(".moneyj").find(".money-sr").val("");
		$(this).parent(".money-jd").prev(".moneyj").find(".money-xs").html("");
		$(this).parent(".money-jd").prev(".moneyj").removeClass("money-ys");
		bidui()
	}
})
//当为0的时候显示空
$(document).on("click", ".moneyd", function(e) {
	var editStatus0 = ($("#pzzhuantai").attr("vou-status") == undefined);
	if(!editStatus0){
		var editStatus1 = ($("#pzzhuantai").attr("vou-status") == "O");
		var editStatus2 = (isInputor == true && (selectdata.data.inputor == ufgovkey.svUserId ||selectdata.data.inputor == undefined));
		var editStatus3 = ((isvousource && isvousourceclick==false)|| isvousourceclick)
		if(editStatus1 && (editStatus2 || isInputor == false) && editStatus3) {
			$(this).find(".money-sr").removeAttr("readonly");
		}else{
			$(this).find(".money-sr").attr("readonly",true);
			return false;
		}
	}else{
		$(this).find(".money-sr").removeAttr("readonly");
	}
	stopPropagation(e)
	//	ufma.showTip($(this).find(".money-sr").val())
	if($(this).find(".money-sr").val() == "0") {
		$(this).find(".money-sr").val("")
	} else {}
	bidui()
})

//阻止空格键自己的内容
$(document).on('keydown', ".moneyd .money-sr", function(event) {
	event = event || window.event;
	if(event.keyCode == "32") {	
		return false;
	}
	bidui()
})
//当摁下空格键的时候将借贷方金额与焦点互相交换,并执行总金额比对函数
$(document).on('keyup', ".moneyd .money-sr", function(event) {
	event = event || window.event;
	if(event.keyCode == "32") {
		$(this).parents(".voucher-center").attr("op",1);
		var thisval = $(this).val()
		$(this).val($(this).parent(".money-jd").prev(".money-jd").find(".money-sr").val())
		$(this).parent(".money-jd").prev(".money-jd").find(".money-sr").val(thisval);
		$(this).next(".money-xs").html($(this).parent(".money-jd").prev(".money-jd").find(".money-xs").html());
		$(this).blur();
		$(this).parent(".money-jd").prev(".money-jd").find(".money-xs").hide();
		$(this).parent(".money-jd").prev(".money-jd").find(".money-xsbg").hide();
		$(this).parent(".money-jd").prev(".money-jd").find(".money-sr").show();
		$(this).parent(".money-jd").prev(".money-jd").find(".money-sr").focus();
		return false
	}
	bidui()
})