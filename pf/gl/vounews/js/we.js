//阻止事件冒泡
function stopPropagation(e) {
	if(e.stopPropagation)
		e.stopPropagation();
	else
		e.cancelBubble = true;
}
//去除千分位
function commafyback(num) {
	var x = num.split(',');
	return parseFloat(x.join(""));
}
//选中某一段文字
function selectText(textbox, startIndex, stopIndex) {
    if (textbox.setSelectionRange) {
        textbox.setSelectionRange(startIndex, stopIndex);
    } else if (textbox.createTextRange) {
        var range = textbox.createTextRange();
        range.collapse(true);
        range.moveStart('character', startIndex);
        range.moveEnd('character', stopIndex - startIndex);
        range.select();
    }
    textbox.focus();
}
//1转换为01
function fix(num, length) {
	return('' + num).length < length ? ((new Array(length + 1)).join('0') + num).slice(-length) : '' + num;
}
//将1转换成001
function buquan(num, length) {
	var numstr = num.toString();
	var l = numstr.length;
	if(numstr.length >= length) {
		return numstr;
	}

	for(var i = 0; i < length - l; i++) {
		numstr = "0" + numstr;
	}
	return numstr;
}
function formatNum(str) {
	var newStr = "";
	var count = 0;
	str = str.toString();
	if(str.indexOf("-") == -1) {

		if(str == "") {
			str = "0.00"
			return str
		} else if(isNaN(str)) {
			str = "0.00"
			return str
		} else if(str.indexOf(".") == -1) {
			for(var i = str.length - 1; i >= 0; i--) {
				if(count % 3 == 0 && count != 0) {
					newStr = str.charAt(i) + "," + newStr;
				} else {
					newStr = str.charAt(i) + newStr;
				}
				count++;
			}
			str = newStr + ".00"; //自动补小数点后两位
			return str
		} else {
			for(var i = str.indexOf(".") - 1; i >= 0; i--) {
				if(count % 3 == 0 && count != 0) {
					newStr = str.charAt(i) + "," + newStr; //碰到3的倍数则加上“,”号
				} else {
					newStr = str.charAt(i) + newStr; //逐个字符相接起来
				}
				count++;
			}
			str = newStr + (str + "00").substr((str + "00").indexOf("."), 3);
			return str
		}
	} else {
		str = str = str.replace("-", "");
		if(str == "") {
			str = "0.00"
			return str
		} else if(isNaN(str)) {
			str = "0.00"
			return str
		} else if(str.indexOf(".") == -1) {
			for(var i = str.length - 1; i >= 0; i--) {
				if(count % 3 == 0 && count != 0) {
					newStr = str.charAt(i) + "," + newStr;
				} else {
					newStr = str.charAt(i) + newStr;
				}
				count++;
			}
			str = newStr + ".00"; //自动补小数点后两位
			return "-" + str
		} else {
			for(var i = str.indexOf(".") - 1; i >= 0; i--) {
				if(count % 3 == 0 && count != 0) {
					newStr = str.charAt(i) + "," + newStr; //碰到3的倍数则加上“,”号
				} else {
					newStr = str.charAt(i) + newStr; //逐个字符相接起来
				}
				count++;
			}
			str = newStr + (str + "00").substr((str + "00").indexOf("."), 3);
			return "-" + str
		}
	}
}

function voucherycshowheight() {
	if(vousinglepzzy && isdobabstractinp) {
		var lens = 0
		for(var i = 0; i < $('.voucher-yc').length; i++) {
			if($('.voucher-yc').eq(i).css('display') != 'none') {
				lens += 1
			}
		}
		if(lens > 0) {
			if($('.voucher-singelzybg').find(".voucherycshow").css('display') != 'none') {
				var lenss = $('.voucher-footer').eq(0).offset().top - $(window).scrollTop() + 60
				$('.voucher-singelzybg,.voucher-singelzyx').find(".voucherycshow").css("top", lenss + 'px').hide()
				$(".voucherall").height($(".voucherall").height() - 120);
				fixedabsulate()
			}
		} else {
			if($('.voucher-singelzybg').find(".voucherycshow").css('display') != 'none') {
				var lenss = $('.voucher-footer').eq(0).offset().top - $(window).scrollTop() + 60
				$('.voucher-singelzybg,.voucher-singelzyx').find(".voucherycshow").css("top", lenss + 'px').show()
				fixedabsulate()
			}else{
				var lenss = $('.voucher-footer').eq(0).offset().top - $(window).scrollTop() + 60
				$('.voucher-singelzybg,.voucher-singelzyx').find(".voucherycshow").css("top", lenss + 'px').show()
				$(".voucherall").height($(".voucherall").height() + 120);
				fixedabsulate()
			}
		}
	}
	if(isdobabstractinp == false && vousingelzysdob && vousinglepzzy) {
		var lens = 0
		for(var i = 0; i < $('.voucher-yc').length; i++) {
			if($('.voucher-yc').eq(i).css('display') != 'none') {
				lens += 1
			}
		}
		if(lens > 0) {
			if($('.voucher-singelzyx').find(".voucherycshow").css('display') != 'none') {
				var lenss = $('.voucher-footer').eq(0).offset().top - $(window).scrollTop() + 60
				$('.voucher-singelzybg,.voucher-singelzyx').find(".voucherycshow").css("top", lenss + 'px').hide()
				$(".voucherall").height($(".voucherall").height() - 120);
				fixedabsulate()
			}
		} else {
			if($('.voucher-singelzyx').find(".voucherycshow").css('display') != 'none') {
				var lenss = $('.voucher-footer').eq(0).offset().top - $(window).scrollTop() + 60
				$('.voucher-singelzybg,.voucher-singelzyx').find(".voucherycshow").css("top", lenss + 'px').show()
				$(".voucherall").height($(".voucherall").height() + 120);
				fixedabsulate()
			}else{
				var lenss = $('.voucher-footer').eq(0).offset().top - $(window).scrollTop() + 60
				$('.voucher-singelzybg,.voucher-singelzyx').find(".voucherycshow").css("top", lenss + 'px').show()
				$(".voucherall").height($(".voucherall").height() + 120);
				fixedabsulate()
			}
		}
	}
	
}
//点击页面其他地方需要隐藏的元素
$(document).on("click", function() {
	setTimeout(function() {
		$('.voucher-center').attr('mobanindex','0')
		$("#calendar").hide();
		$(".AccoTree").hide();
		$(".ycbodys").hide();
		$("#ssr").removeClass("show-menu");
		$(".voucherleft").hide();
		$(".voucherleftsearchinp").val('')
		$(".all-no").hide();
		$('.changemoneyjd').removeClass('changemoneyjd')
		for(var i = 0; i < $(".voucher-yc").length; i++) {
			if($(".voucher-yc").eq(i).css("display") != "none") {
				$(".voucher-yc").eq(i).hide();
				$(".voucherall").height($(".voucherall").height() - $(".voucher-yc").eq(i).outerHeight());
				fixedabsulate();
			}
		}
		var lenss = $('.voucher-footer').eq(0).offset().top - $(window).scrollTop() + 60
		$('.voucher-singelzybg,.voucher-singelzyx').find(".voucherycshow").css("top", lenss + 'px')
		if(vousinglepzzy && isdobabstractinp) {
			if($('.voucher-singelzybg').find(".voucherycshow").css('display') == 'none' || $('.voucher-singelzyx').find(".voucherycshow").css('display') == 'none') {
				var lenss = $('.voucher-footer').eq(0).offset().top - $(window).scrollTop() + 60
				$('.voucher-singelzybg,.voucher-singelzyx').find(".voucherycshow").css("top", lenss + 'px').show()
				$(".voucherall").height($(".voucherall").height() + 120);
				fixedabsulate()
			}
		}
		if(vousinglepzzy && vousingelzysdob) {
			if($('.voucher-singelzybg').find(".voucherycshow").css('display') == 'none' || $('.voucher-singelzyx').find(".voucherycshow").css('display') == 'none') {
				var lenss = $('.voucher-footer').eq(0).offset().top - $(window).scrollTop() + 60
				$('.voucher-singelzybg,.voucher-singelzyx').find(".voucherycshow").css("top", lenss + 'px').show()
				$(".voucherall").height($(".voucherall").height() + 120);
				fixedabsulate()
			}
		}
	}, 400)

})
//将数字转换成大写汉字

function changeMoneyToChinese(money) {
	var cnNums = new Array("零", "壹", "贰", "叁", "肆", "伍", "陆", "柒", "捌", "玖"); //汉字的数字  
	var cnIntRadice = new Array("", "拾", "佰", "仟"); //基本单位  
	var cnIntUnits = new Array("", "万", "亿", "兆"); //对应整数部分扩展单位  
	var cnDecUnits = new Array("角", "分", "毫", "厘"); //对应小数部分单位  
	//var cnInteger = "整"; //整数金额时后面跟的字符  
	var cnIntLast = "元"; //整型完以后的单位  
	var maxNum = 999999999999999.9999; //最大处理的数字  

	var IntegerNum; //金额整数部分  
	var DecimalNum; //金额小数部分  
	var ChineseStr = ""; //输出的中文金额字符串  
	var parts; //分离金额后用的数组，预定义  
	if(money == "") {
		return "";
	}
	money = parseFloat(money);
	if(money >= maxNum) {
		ufma.showTip('超出最大处理数字', function() {}, "warning");
		return "";
	}
	if(money == 0) {
		//ChineseStr = cnNums[0]+cnIntLast+cnInteger;  
		ChineseStr = cnNums[0] + cnIntLast
		//document.getElementById("show").value=ChineseStr;  
		return ChineseStr;
	}
	money = money.toString(); //转换为字符串  
	if(money.indexOf(".") == -1) {
		IntegerNum = money;
		DecimalNum = '';
	} else {
		parts = money.split(".");
		IntegerNum = parts[0];
		DecimalNum = parts[1].substr(0, 4);
	}
	if(parseInt(IntegerNum, 10) > 0) { //获取整型部分转换  
		zeroCount = 0;
		IntLen = IntegerNum.length;
		for(i = 0; i < IntLen; i++) {
			n = IntegerNum.substr(i, 1);
			p = IntLen - i - 1;
			q = p / 4;
			m = p % 4;
			if(n == "0") {
				zeroCount++;
			} else {
				if(zeroCount > 0) {
					ChineseStr += cnNums[0];
				}
				zeroCount = 0; //归零  
				ChineseStr += cnNums[parseInt(n)] + cnIntRadice[m];
			}
			if(m == 0 && zeroCount < 4) {
				ChineseStr += cnIntUnits[q];
			}
		}
		ChineseStr += cnIntLast;
		//整型部分处理完毕  
	}
	if(DecimalNum != '') { //小数部分  
		decLen = DecimalNum.length;
		for(i = 0; i < decLen; i++) {
			n = DecimalNum.substr(i, 1);
			if(n != '0') {
				ChineseStr += cnNums[Number(n)] + cnDecUnits[i];
			}
		}
	}
	if(ChineseStr == '') {
		ChineseStr += cnNums[0] + cnIntLast;
	}
	return ChineseStr;
}

function changeToChinese(money) {
	var cnNums = new Array("零", "一", "二", "三", "四", "五", "六", "七", "八", "九"); //汉字的数字  
	var cnIntRadice = new Array("", "拾", "佰", "仟"); //基本单位  
	var cnIntUnits = new Array("", "万", "亿", "兆"); //对应整数部分扩展单位  
	var cnDecUnits = new Array("角", "分", "毫", "厘"); //对应小数部分单位  
	//var cnInteger = "整"; //整数金额时后面跟的字符  
	var cnIntLast = ""; //整型完以后的单位  
	var maxNum = 999999999999999.9999; //最大处理的数字  

	var IntegerNum; //金额整数部分  
	var DecimalNum; //金额小数部分  
	var ChineseStr = ""; //输出的中文金额字符串  
	var parts; //分离金额后用的数组，预定义  
	if(money == "") {
		return "";
	}
	money = parseFloat(money);
	if(money >= maxNum) {
		ufma.showTip('超出最大处理数字', function() {}, "warning");
		return "";
	}
	if(money == 0) {
		//ChineseStr = cnNums[0]+cnIntLast+cnInteger;  
		ChineseStr = cnNums[0] + cnIntLast
		//document.getElementById("show").value=ChineseStr; 
		return ChineseStr;
	}
	money = money.toString(); //转换为字符串  
	if(money.indexOf(".") == -1) {
		IntegerNum = money;
		DecimalNum = '';
	} else {
		parts = money.split(".");
		IntegerNum = parts[0];
		DecimalNum = parts[1].substr(0, 4);
	}
	if(parseInt(IntegerNum, 10) > 0) { //获取整型部分转换  
		zeroCount = 0;
		IntLen = IntegerNum.length;
		for(i = 0; i < IntLen; i++) {
			n = IntegerNum.substr(i, 1);
			p = IntLen - i - 1;
			q = p / 4;
			m = p % 4;
			if(n == "0") {
				zeroCount++;
			} else {
				if(zeroCount > 0) {
					ChineseStr += cnNums[0];
				}
				zeroCount = 0; //归零  
				ChineseStr += cnNums[parseInt(n)] + cnIntRadice[m];
			}
			if(m == 0 && zeroCount < 4) {
				ChineseStr += cnIntUnits[q];
			}
		}
		ChineseStr += cnIntLast;
		//整型部分处理完毕  
	}
	if(DecimalNum != '') { //小数部分  
		decLen = DecimalNum.length;
		for(i = 0; i < decLen; i++) {
			n = DecimalNum.substr(i, 1);
			if(n != '0') {
				ChineseStr += cnNums[Number(n)] + cnDecUnits[i];
			}
		}
	}
	if(ChineseStr == '') {
		ChineseStr += cnNums[0] + cnIntLast;
	}
	return ChineseStr;
}
//计算借贷之间的平衡并显示差额
function bidui() {
	if(vousinglepz == false && vousinglepzzy == false) {
		var formatNumnow= false
		var s = 0;
		var dd = 0;
		for(var i = 0; i < $(".voucher-center").length; i++) {
			if($(".voucher-center").eq(i).find(".moneyd").find(".money-sr").val() != "") {
				var thismoney = parseFloat($(".voucher-center").eq(i).find(".moneyd").find(".money-sr").val().replace(",", ""));
				s += parseFloat($(".voucher-center").eq(i).find(".moneyd").find(".money-sr").val().replace(",", ""));
				if(thismoney>= 10000000000){
					formatNumnow = true
				}
			}
		}
		for(var i = 0; i < $(".voucher-center").length; i++) {
			if($(".voucher-center").eq(i).find(".moneyj").find(".money-sr").val() != "") {
				var thismoney = parseFloat($(".voucher-center").eq(i).find(".moneyj").find(".money-sr").val().replace(",", ""));
				dd += parseFloat($(".voucher-center").eq(i).find(".moneyj").find(".money-sr").val().replace(",", ""));
				if(thismoney>= 10000000000){
					formatNumnow = true
				}
			}
		}
		s = s.toFixed(2);
		var n;
		if(s >= 10000000000 || formatNumnow) {
			n = formatNum(s);
		} else {
			n = s.replace(".", "");
		}
		//	if(n == "000") {
		//		n = "";
		//	} else 
		if(n == "NaN") {
			n = "";
		}
		$(".voucher-footer").find(".moneyd").find(".money-xs").html(n);
		dd = dd.toFixed(2);
		var nn;
		if(dd >= 10000000000 || formatNumnow) {
			nn = formatNum(dd);
		} else {
			nn = dd.replace(".", "");
		}
		if(dd >= 10000000000 || s >= 10000000000 || formatNumnow) {
			$(".money-xs").css({
				"letter-spacing": "2px",
				"margin-left": "-6px"
			})
			$(".moneydw").css("visibility", "hidden")
			$(".money-xsbg").css("visibility", "hidden");
			for(var i = 0; i < $(".voucher-center").length; i++) {
				if($(".voucher-center").eq(i).find(".moneyd").find(".money-sr").val() != "") {
					var thismoney = parseFloat($(".voucher-center").eq(i).find(".moneyd").find(".money-sr").val());
					$(".voucher-center").eq(i).find(".moneyd").find(".money-xs").html(formatNum(thismoney))
				}
			}
			for(var i = 0; i < $(".voucher-center").length; i++) {
				if($(".voucher-center").eq(i).find(".moneyj").find(".money-sr").val() != "") {
					var thismoney = parseFloat($(".voucher-center").eq(i).find(".moneyj").find(".money-sr").val());
					$(".voucher-center").eq(i).find(".moneyj").find(".money-xs").html(formatNum(thismoney))
				}
			}
		} else {
			$(".money-xs").css({
				"letter-spacing": "9px",
				"margin-left": "0px"
			})
			$(".moneydw").css("visibility", "visible")
			$(".money-xsbg").css("visibility", "visible");
			for(var i = 0; i < $(".voucher-center").length; i++) {
				if($(".voucher-center").eq(i).find(".moneyd").find(".money-sr").val() != "") {
					var thismoney = $(".voucher-center").eq(i).find(".moneyd").find(".money-sr").val();
					$(".voucher-center").eq(i).find(".moneyd").find(".money-xs").html(thismoney.replace(".", ""))
				}
			}
			for(var i = 0; i < $(".voucher-center").length; i++) {
				if($(".voucher-center").eq(i).find(".moneyj").find(".money-sr").val() != "") {
					var thismoney = $(".voucher-center").eq(i).find(".moneyj").find(".money-sr").val();
					$(".voucher-center").eq(i).find(".moneyj").find(".money-xs").html(thismoney.replace(".", ""))
				}
			}
		}
		//	nn = dd.replace(".", "");
		//	if(nn == "000") {
		//		nn = "";
		//	} else 
		if(nn == "NaN") {
			nn = "";
		}
		$(".voucher-footer").find(".moneyj").find(".money-xs").html(nn);
		var j = $(".voucher-footer").find(".moneyj").find(".money-xs").html().replace(/,/gi, '');
		var d = $(".voucher-footer").find(".moneyd").find(".money-xs").html().replace(/,/gi, '');
		if(d == "") {
			d = 0;
		}
		if(j == d) {
			if(s < 0) {
				s = -s;
				var ss = changeMoneyToChinese(s);
				$(".heji").text("合计:负" + ss).attr('title',"合计:负" + ss);
			} else {
				var ss = changeMoneyToChinese(s);
				$(".heji").text("合计:" + ss).attr('title',"合计:" + ss);
			}
			$(".heji").css("color", "#000")
		} else if(parseFloat(j) > parseFloat(d)) {
			var ss = formatNum((parseFloat(j) / 100 - parseFloat(d) / 100).toFixed(2));
			$(".heji").text("差额:" + ss).attr('title',"差额:" + ss);
			$(".heji").css("color", "red");
		} else if(parseFloat(j) < parseFloat(d)) {
			var ss = formatNum((parseFloat(d) / 100 - parseFloat(j) / 100).toFixed(2));
			$(".heji").text("差额:" + ss).attr('title',"差额:" + ss);
			$(".heji").css("color", "red");
		}
		var s = 1
		for(var i = 0; i < $('.voucher-center').length; i++) {
			if($('.voucher-center').eq(i).hasClass('deleteclass') != true) {
				if($('.voucher-center').eq(i).find('.voucherjias').find('.voucherindex').length == 0) {
					$('.voucher-center').eq(i).find('.voucherjias').append('<span class="voucherindex">' + s + '</span>')
					s++;
				} else {

				}
			}
		}
	} else if(vousinglepz == true && vousinglepzzy == false) {
		biduicw()
		biduiys()
	} else if(vousinglepz == false && vousinglepzzy == true) {
		biduizycw()
		biduizyys()
	}
	biduiindex()
}

function biduicw() {
	var s = 0;
	var dd = 0;
	for(var i = 0; i < $(".voucher-center-cw").length; i++) {
		if($(".voucher-center-cw").eq(i).find(".moneyd").find(".money-sr").val() != "") {
			s += parseFloat($(".voucher-center-cw").eq(i).find(".moneyd").find(".money-sr").val().replace(",", ""));
		}
	}
	s = s.toFixed(2);
	var n = formatNum(s);
	//	if(n == "000") {
	//		n = "";
	//	} else 
	if(n == "NaN") {
		n = "";
	}
	$(".voucher-footer").find(".moneyd").find(".money-cw").html(n);
	for(var i = 0; i < $(".voucher-center-cw").length; i++) {
		if($(".voucher-center-cw").eq(i).find(".moneyj").find(".money-sr").val() != "") {
			dd += parseFloat($(".voucher-center-cw").eq(i).find(".moneyj").find(".money-sr").val().replace(",", ""));
		}
	}
	dd = dd.toFixed(2);
	var nn = formatNum(dd);
	if(nn == "NaN") {
		nn = "";
	}
	$(".voucher-footer").find(".moneyj").find(".money-cw").html(nn);
	var j = $(".voucher-footer").find(".moneyj").find(".money-cw").html().replace(/,/gi, '');
	var d = $(".voucher-footer").find(".moneyd").find(".money-cw").html().replace(/,/gi, '');
	if(d == "") {
		d = 0;
	}
	if(j == d) {
		if(s < 0) {
			s = -s;
			var ss = changeMoneyToChinese(s);
			$(".hejicw").text("财务会计:负" + ss).attr('title',"财务会计:负" + ss);
		} else {
			var ss = changeMoneyToChinese(s);
			$(".hejicw").text("财务会计:" + ss).attr('title',"财务会计:" + ss);
		}
		$(".hejicw").css("color", "#000")
	} else if(parseFloat(j) > parseFloat(d)) {
		var ss = formatNum((parseFloat(j) - parseFloat(d)).toFixed(2));
		$(".hejicw").text("财务会计差额:" + ss).attr('title',"财务会计差额:" + ss);
		$(".hejicw").css("color", "red");
	} else if(parseFloat(j) < parseFloat(d)) {
		var ss = formatNum((parseFloat(d) - parseFloat(j)).toFixed(2));
		$(".hejicw").text("财务会计差额:" + ss).attr('title',"财务会计差额:" + ss);
		$(".hejicw").css("color", "red");
	}
}

function biduiys() {
	var s = 0;
	var dd = 0;
	for(var i = 0; i < $(".voucher-center-ys").length; i++) {
		if($(".voucher-center-ys").eq(i).find(".moneyd").find(".money-sr").val() != "") {
			s += parseFloat($(".voucher-center-ys").eq(i).find(".moneyd").find(".money-sr").val().replace(",", ""));
		}
	}
	s = s.toFixed(2);
	var n = formatNum(s);
	//	if(n == "000") {
	//		n = "";
	//	} else 
	if(n == "NaN") {
		n = "";
	}
	$(".voucher-footer").find(".moneyd").find(".money-ys").html(n);
	for(var i = 0; i < $(".voucher-center-ys").length; i++) {
		if($(".voucher-center-ys").eq(i).find(".moneyj").find(".money-sr").val() != "") {
			dd += parseFloat($(".voucher-center-ys").eq(i).find(".moneyj").find(".money-sr").val().replace(",", ""));
		}
	}
	dd = dd.toFixed(2);
	var nn = formatNum(dd);
	if(nn == "NaN") {
		nn = "";
	}
	$(".voucher-footer").find(".moneyj").find(".money-ys").html(nn);
	var j = $(".voucher-footer").find(".moneyj").find(".money-ys").html().replace(/,/gi, '');
	var d = $(".voucher-footer").find(".moneyd").find(".money-ys").html().replace(/,/gi, '');
	if(d == "") {
		d = 0;
	}
	if(j == d) {
		if(s < 0) {
			s = -s;
			var ss = changeMoneyToChinese(s);
			$(".hejiys").text("预算会计:负" + ss).attr('title',"预算会计:负" + ss);
		} else {
			var ss = changeMoneyToChinese(s);
			$(".hejiys").text("预算会计:" + ss).attr('title',"预算会计:" + ss);
		}
		$(".hejiys").css("color", "#000")
	} else if(parseFloat(j) > parseFloat(d)) {
		var ss = formatNum((parseFloat(j) - parseFloat(d)).toFixed(2));
		$(".hejiys").text("预算会计差额:" + ss).attr('title',"预算会计差额:" + ss);
		$(".hejiys").css("color", "red");
	} else if(parseFloat(j) < parseFloat(d)) {
		var ss = formatNum((parseFloat(d) - parseFloat(j)).toFixed(2));
		$(".hejiys").text("预算会计差额:" + ss).attr('title',"预算会计差额:" + ss);
		$(".hejiys").css("color", "red");
	}
}

function biduizycw() {
	var s = 0;
	var dd = 0;
	for(var i = 0; i < $(".voucher-centercw").length; i++) {
		if($(".voucher-centercw").eq(i).find(".moneyd").find(".money-sr").val() != "") {
			if($(".voucher-centercw").eq(i).find('.voucher-yc-title').length > 0) {
				$(".voucher-centercw").eq(i).find('.voucher-yc-title').find('.titlemoney').text('金额:' + $(".voucher-centercw").eq(i).find(".moneyd").find(".money-sr").val())
				$(".voucher-centercw").eq(i).find('.voucher-yc-title').find('.voucher-yc-j').prop('checked', false)
				$(".voucher-centercw").eq(i).find('.voucher-yc-title').find('.voucher-yc-d').prop('checked', true)
			}
			s += parseFloat($(".voucher-centercw").eq(i).find(".moneyd").find(".money-sr").val().replace(",", ""));
		} else if($(".voucher-centercw").eq(i).find(".moneyj").find(".money-sr").val() != "") {
			if($(".voucher-centercw").eq(i).find('.voucher-yc-title').length > 0) {
				$(".voucher-centercw").eq(i).find('.voucher-yc-title').find('.titlemoney').text('金额:' + $(".voucher-centercw").eq(i).find(".moneyj").find(".money-sr").val())
				$(".voucher-centercw").eq(i).find('.voucher-yc-title').find('.voucher-yc-d').prop('checked', false)
				$(".voucher-centercw").eq(i).find('.voucher-yc-title').find('.voucher-yc-j').prop('checked', true)
			}
			dd += parseFloat($(".voucher-centercw").eq(i).find(".moneyj").find(".money-sr").val().replace(",", ""));
		}else if($(".voucher-centercw").eq(i).find(".moneyj").find(".money-sr").val() == "" &&  $(".voucher-centercw").eq(i).find(".moneyd").find(".money-sr").val() == "") {
			if($(".voucher-centercw").eq(i).find('.accountinginp').attr('accbal')==1){
				$(".voucher-centercw").eq(i).find('.voucher-yc').find('.voucher-yc-j').prop('checked',true)
				$(".voucher-centercw").eq(i).find('.voucher-yc').find('.voucher-yc-d').prop('checked',false)
			}else{
				$(".voucher-centercw").eq(i).find('.voucher-yc').find('.voucher-yc-j').prop('checked',false)
				$(".voucher-centercw").eq(i).find('.voucher-yc').find('.voucher-yc-d').prop('checked',true)
			}
		}
	}
	s = s.toFixed(2);
	var n = formatNum(s);
	//	if(n == "000") {
	//		n = "";
	//	} else 
	if(n == "NaN") {
		n = "";
	}
	$(".voucher-footer").find(".moneyhjcw").find(".moneyd").find('.money-xs').html(n);
//	for(var i = 0; i < $(".voucher-centercw").length; i++) {
//		if($(".voucher-centercw").eq(i).find(".moneyj").find(".money-sr").val() != "") {
//			if($(".voucher-centercw").eq(i).find('.voucher-yc-title').length > 0) {
//				$(".voucher-centercw").eq(i).find('.voucher-yc-title').find('.titlemoney').text('金额:' + $(".voucher-centercw").eq(i).find(".moneyj").find(".money-sr").val())
//				$(".voucher-centercw").eq(i).find('.voucher-yc-title').find('.voucher-yc-d').prop('checked', false)
//				$(".voucher-centercw").eq(i).find('.voucher-yc-title').find('.voucher-yc-j').prop('checked', true)
//			}
//			dd += parseFloat($(".voucher-centercw").eq(i).find(".moneyj").find(".money-sr").val().replace(",", ""));
//		}
//	}
	dd = dd.toFixed(2);
	var nn = formatNum(dd);
	if(nn == "NaN") {
		nn = "";
	}
	$(".voucher-footer").find(".moneyhjcw").find(".moneyj").find('.money-xs').html(nn);
	var j = $(".voucher-footer").find(".moneyhjcw").find(".moneyj").find('.money-xs').html().replace(/,/gi, '');
	var d = $(".voucher-footer").find(".moneyhjcw").find(".moneyd").find('.money-xs').html().replace(/,/gi, '');
	if(d == "") {
		d = 0;
	}
	if(j == d) {
		if(s < 0) {
			s = -s;
			var ss = changeMoneyToChinese(s);
			$(".moneyhjcw .heji").text("合计:负" + ss).attr('title',"合计:负" + ss);
		} else {
			var ss = changeMoneyToChinese(s);
			$(".moneyhjcw .heji").text("合计:" + ss).attr('title',"合计:" + ss);
		}
		$(".moneyhjcw .heji").css("color", "#000")
	} else if(parseFloat(j) > parseFloat(d)) {
		var ss = formatNum((parseFloat(j) - parseFloat(d)).toFixed(2));
		$(".moneyhjcw .heji").text("差额:" + ss).attr('title',"差额:" + ss);
		$(".moneyhjcw .heji").css("color", "red");
	} else if(parseFloat(j) < parseFloat(d)) {
		var ss = formatNum((parseFloat(d) - parseFloat(j)).toFixed(2));
		$(".moneyhjcw .heji").text("差额:" + ss).attr('title',"差额:" + ss);
		$(".moneyhjcw .heji").css("color", "red");
	}
}

function biduizyys() {
	var s = 0;
	var dd = 0;
	for(var i = 0; i < $(".voucher-centerys").length; i++) {
		if($(".voucher-centerys").eq(i).find(".moneyd").find(".money-sr").val() != "") {
			if($(".voucher-centerys").eq(i).find('.voucher-yc-title').length > 0) {
				$(".voucher-centerys").eq(i).find('.voucher-yc-title').find('.titlemoney').text('金额:' + $(".voucher-centerys").eq(i).find(".moneyd").find(".money-sr").val())
				$(".voucher-centerys").eq(i).find('.voucher-yc-title').find('.voucher-yc-j').prop('checked', false)
				$(".voucher-centerys").eq(i).find('.voucher-yc-title').find('.voucher-yc-d').prop('checked', true)
			}
			s += parseFloat($(".voucher-centerys").eq(i).find(".moneyd").find(".money-sr").val().replace(",", ""));
		}else if($(".voucher-centerys").eq(i).find(".moneyj").find(".money-sr").val() != "") {
			if($(".voucher-centerys").eq(i).find('.voucher-yc-title').length > 0) {
				$(".voucher-centerys").eq(i).find('.voucher-yc-title').find('.titlemoney').text('金额:' + $(".voucher-centerys").eq(i).find(".moneyj").find(".money-sr").val())
				$(".voucher-centerys").eq(i).find('.voucher-yc-title').find('.voucher-yc-d').prop('checked', false)
				$(".voucher-centerys").eq(i).find('.voucher-yc-title').find('.voucher-yc-j').prop('checked', true)
			}
			dd += parseFloat($(".voucher-centerys").eq(i).find(".moneyj").find(".money-sr").val().replace(",", ""));
		}else if($(".voucher-centerys").eq(i).find(".moneyj").find(".money-sr").val() == "" &&  $(".voucher-centerys").eq(i).find(".moneyd").find(".money-sr").val() == "") {
			if($(".voucher-centerys").eq(i).find('.accountinginp').attr('accbal')==1){
				$(".voucher-centerys").eq(i).find('.voucher-yc').find('.voucher-yc-j').prop('checked',true)
				$(".voucher-centerys").eq(i).find('.voucher-yc').find('.voucher-yc-d').prop('checked',false)
			}else{
				$(".voucher-centerys").eq(i).find('.voucher-yc').find('.voucher-yc-j').prop('checked',false)
				$(".voucher-centerys").eq(i).find('.voucher-yc').find('.voucher-yc-d').prop('checked',true)
			}
		}
	}
	s = s.toFixed(2);
	var n = formatNum(s);
	//	if(n == "000") {
	//		n = "";
	//	} else 
	if(n == "NaN") {
		n = "";
	}
	$(".voucher-footer").find(".moneyhjys").find(".moneyd").find('.money-xs').html(n);
//	for(var i = 0; i < $(".voucher-centerys").length; i++) {
//		if($(".voucher-centerys").eq(i).find(".moneyj").find(".money-sr").val() != "") {
//			if($(".voucher-centercw").eq(i).find('.voucher-yc-title').length > 0) {
//				$(".voucher-centercw").eq(i).find('.voucher-yc-title').find('.titlemoney').text('金额:' + $(".voucher-centercw").eq(i).find(".moneyj").find(".money-sr").val())
//				$(".voucher-centercw").eq(i).find('.voucher-yc-title').find('.voucher-yc-d').prop('checked', false)
//				$(".voucher-centercw").eq(i).find('.voucher-yc-title').find('.voucher-yc-j').prop('checked', true)
//			}
//			dd += parseFloat($(".voucher-centerys").eq(i).find(".moneyj").find(".money-sr").val().replace(",", ""));
//		}
//	}
	dd = dd.toFixed(2);
	var nn = formatNum(dd);
	if(nn == "NaN") {
		nn = "";
	}
	$(".voucher-footer").find(".moneyhjys").find(".moneyj").find('.money-xs').html(nn);
	var j = $(".voucher-footer").find(".moneyhjys").find(".moneyj").find('.money-xs').html().replace(/,/gi, '');
	var d = $(".voucher-footer").find(".moneyhjys").find(".moneyd").find('.money-xs').html().replace(/,/gi, '');
	if(d == "") {
		d = 0;
	}
	if(j == d) {
		if(s < 0) {
			s = -s;
			var ss = changeMoneyToChinese(s);
			$(".moneyhjys .hejihz").text("负" + ss).attr('title',"负" + ss);
		} else {
			var ss = changeMoneyToChinese(s);
			$(".moneyhjys .hejihz").text("" + ss).attr('title',"" + ss);
		}
		$(".moneyhjys .hejihz").css("color", "#000")
	} else if(parseFloat(j) > parseFloat(d)) {
		var ss = formatNum((parseFloat(j) - parseFloat(d)).toFixed(2));
		$(".moneyhjys .hejihz").text("" + ss).attr('title',"" + ss);
		$(".moneyhjys .hejihz").css("color", "red");
	} else if(parseFloat(j) < parseFloat(d)) {
		var ss = formatNum((parseFloat(d) - parseFloat(j)).toFixed(2));
		$(".moneyhjys .hejihz").text("" + ss).attr('title',"" + ss);
		$(".moneyhjys .hejihz").css("color", "red");
	}
}
//鼠标移入显示当前行的增删按钮;
$(document).on("mouseover", ".voucher-center", function() {
	if(vousinglepzzy == true) {
		if($(this).hasClass('voucher-centercw')) {
			$(this).find(".voucherjia").css("visibility", "visible");
			$(this).find(".voucherjiass").css("visibility", "visible");
			$(this).next('.voucher-center').find(".voucherjian").css("visibility", "visible");
		} else if($(this).hasClass('voucher-centerys')) {
			$(this).prev('.voucher-center').find(".voucherjia").css("visibility", "visible");
			$(this).prev('.voucher-center').find(".voucherjiass").css("visibility", "visible");
			$(this).find(".voucherjian").css("visibility", "visible");
		}
	} else {
		$(this).find(".voucherjia").css("visibility", "visible");
		$(this).find(".voucherjiass").css("visibility", "visible");
		$(this).find(".voucherjian").css("visibility", "visible");
	}
})
$(document).on("mouseout", ".voucher-center", function() {
	if(vousinglepzzy == true) {
		if($(this).hasClass('voucher-centercw')) {
			$(this).find(".voucherjia").css("visibility", "hidden");
			$(this).find(".voucherjiass").css("visibility", "hidden");
			//			$(this).find(".voucherindex").css("visibility", "visible");
			$(this).next('.voucher-center').find(".voucherjian").css("visibility", "hidden");
		} else if($(this).hasClass('voucher-centerys')) {
			$(this).prev('.voucher-center').find(".voucherjia").css("visibility", "hidden");
			$(this).prev('.voucher-center').find(".voucherjiass").css("visibility", "hidden");
			$(this).find(".voucherjian").css("visibility", "hidden");
			$(this).prev('.voucher-center').find(".voucherindex").css("visibility", "visible");
		}
	} else {
		//		$(this).find(".voucherindex").css("visibility", "visible");
		$(this).find(".voucherjia").css("visibility", "hidden");
		$(this).find(".voucherjiass").css("visibility", "hidden");
		$(this).find(".voucherjian").css("visibility", "hidden");
	}

})
$(document).on("mouseover", ".voudeletediv", function() {
	$(this).find(".voudelete").css("visibility", "visible");
	$(this).css('background','rgba(145,209,255,1)')
})
$(document).on("mouseout", ".voudeletediv", function() {
	$(this).find(".voudelete").css("visibility", "hidden");
	$(this).css('background','rgba(255,255,255,0)')
})
$(document).on("click", ".voudelete", function() {
	var editStatus4 = $(this).parents('.voucher-center').attr('ifEdit')=='false'
	if(!isInputChange() || editStatus4){
		return false;
	} else {
		$(this).parents('.voucher-center').find('.abstractinp').val('')
		var voucerls= ''
		voucerls += '<textarea class="accountinginp"></textarea>'
		voucerls += '<span class="accountingye">余额</span>'
		voucerls += '<span class="accountingmx">明细账</span>'
		voucerls += '<div class="fuyan"><span>辅</span></div>'
		$(this).parents('.voucher-center').find('.accounting').html(voucerls)
		$(this).parents('.voucher-center').find('.money-jd').find('.money-sr').val('')
		$(this).parents('.voucher-center').find('.money-jd').find('.money-xs').text('')
		$(this).parents('.voucher-center').find('.voucher-yc').remove()
		bidui()
		var seldat = huoqu()
		vousourceName = $(".vouSource").text()
		selectdata.data = seldat
		chapz()
		$(".vouSource").text(vousourceName)
		zhuantai()
		if($(".voucher-head").attr("namess") != undefined) {
			if(selectdata.data.vouStatus == "O") {
				$("#pzzhuantai").hide();
				voubiaoji();
			}
		}
	}
})
//输入框时候的阻止输入内容,允许使用左右键,确定键,数字键,小数点删除键
function isNumber(keyCode, event) {
	event = event || window.event;
	// 非数字
	if(keyCode == 83 && event.ctrlKey) return true
	if(keyCode == 37 && event.ctrlKey) return true
	if(keyCode == 39 && event.ctrlKey) return true
	if(keyCode == 78 && event.altKey) return true
	if(keyCode >= 65 && keyCode <= 90) return false
	return true
}
//这是页面刚进入时候设定获取焦点的元素
if(addindexiszy){
	$('.abstractinp').eq(0).focus()
}else{
	$("#fjd").focus()
}

//这是初始时候下拉的参数
var inde = 0;
//删除添加列的点击事件
$(document).on("click", ".voucherjiass", function() {
	var editStatus0 = ($("#pzzhuantai").attr("vou-status") == undefined);
	if (!editStatus0) {
		var editStatus1 = ($("#pzzhuantai").attr("vou-status") == "O");
		var editStatus2 = (isInputor == true && (selectdata.data.inputor == ufgovkey.svUserCode || selectdata.data.inputor == undefined))
		var editStatus3 = ((isvousource && isvousourceclick == false) || isvousourceclick)
		var editStatus4 = $(this).parents('.voucher-center').attr('ifEdit') == 'false'
		if (editStatus1 && (editStatus2 || isInputor == false) && editStatus3 && !editStatus4 && vouiseditsave) {
			if($(this).parents(".voucher-body").hasClass("voucher-center-cw")) {
				trisdata = 1
			} else if($(this).parents(".voucher-body").hasClass("voucher-center-ys")) {
				trisdata = 2
			}
			if(vousinglepzzy){
				$(this).parents(".voucher-body").next(".voucher-body").after(tr());
			}else{
				$(this).parents(".voucher-body").after(tr());
			}
			var vclen = 0;
			for(var i = 0; i < $(".voucher-centercw").length; i++) {
				if($(".voucher-centercw").eq(i).hasClass("deleteclass")) {
					vclen += 1;
				}
			}
			if($(".voucher").hasClass('voucher-singelzyx') != true){
				if($(".voucher-centercw").length - vclen <= 6 || $(".voucher").hasClass('voucher-singelzybg') != true) {
					$(".voucherall").height($(".voucherall").height() + 50);
				}
			}
			fixedabsulate();
			bidui()
			$(this).parents(".voucher-center").attr("op", "1");
			$(this).parents(".voucher-center").nextAll(".voucher-center").attr("op", "1");
			$(this).parents(".voucher-center").nextAll(".deleteclass").attr("op", "2");
		}
	} else {
		if($(this).parents(".voucher-body").hasClass("voucher-center-cw")) {
			trisdata = 1
		} else if($(this).parents(".voucher-body").hasClass("voucher-center-ys")) {
			trisdata = 2
		}
		if(vousinglepzzy){
			$(this).parents(".voucher-body").next(".voucher-body").after(tr());
		}else{
			$(this).parents(".voucher-body").after(tr());
		}
		var vclen = 0;
		for(var i = 0; i < $(".voucher-centercw").length; i++) {
			if($(".voucher-centercw").eq(i).hasClass("deleteclass")) {
				vclen += 1;
			}
		}
		if($(".voucher").hasClass('voucher-singelzyx') != true){
			if($(".voucher-centercw").length - vclen <= 6 || $(".voucher").hasClass('voucher-singelzybg') != true) {
				$(".voucherall").height($(".voucherall").height() + 50);
			}
		}
		
		fixedabsulate();
		bidui()
		$(this).parents(".voucher-center").attr("op", "1");
		$(this).parents(".voucher-center").nextAll(".voucher-center").attr("op", "1");
		$(this).parents(".voucher-center").nextAll(".deleteclass").attr("op", "2");
	}

})
$(document).on("click", ".voucherjia", function(e) {
	stopPropagation(e)
	var editStatus0 = ($("#pzzhuantai").attr("vou-status") == undefined);
	if (!editStatus0) {
		var editStatus1 = ($("#pzzhuantai").attr("vou-status") == "O");
		var editStatus2 = (isInputor == true && (selectdata.data.inputor == ufgovkey.svUserCode || selectdata.data.inputor == undefined))
		var editStatus3 = ((isvousource && isvousourceclick == false) || isvousourceclick)
		var editStatus4 = $(this).parents('.voucher-center').attr('ifEdit') == 'false'
		if (editStatus1 && (editStatus2 || isInputor == false) && editStatus3 && !editStatus4 && vouiseditsave) {
			if($(this).parents(".voucher-body").hasClass("voucher-center-cw")) {
				trisdata = 1
			} else if($(this).parents(".voucher-body").hasClass("voucher-center-ys")) {
				trisdata = 2
			}
			$(this).parents(".voucher-body").before(tr());
			var vclen = 0;
			for(var i = 0; i < $(".voucher-centercw").length; i++) {
				if($(".voucher-centercw").eq(i).hasClass("deleteclass")) {
					vclen += 1;
				}
			}
			if($(".voucher").hasClass('voucher-singelzyx') != true){
				if($(".voucher-centercw").length - vclen <= 6 || $(".voucher").hasClass('voucher-singelzybg') != true) {
					$(".voucherall").height($(".voucherall").height() + 50);
				}
			}
			fixedabsulate();
			bidui()
			$(this).parents(".voucher-center").attr("op", "1");
			$(this).parents(".voucher-center").nextAll(".voucher-center").attr("op", "1");
			$(this).parents(".voucher-center").nextAll(".deleteclass").attr("op", "2");
		}
	} else {
		if($(this).parents(".voucher-body").hasClass("voucher-center-cw")) {
			trisdata = 1
		} else if($(this).parents(".voucher-body").hasClass("voucher-center-ys")) {
			trisdata = 2
		}
		$(this).parents(".voucher-body").before(tr());
		var vclen = 0;
		for(var i = 0; i < $(".voucher-centercw").length; i++) {
			if($(".voucher-centercw").eq(i).hasClass("deleteclass")) {
				vclen += 1;
			}
		}
		if($(".voucher").hasClass('voucher-singelzyx') != true){
			if($(".voucher-centercw").length - vclen <= 6 || $(".voucher").hasClass('voucher-singelzybg') != true) {
				$(".voucherall").height($(".voucherall").height() + 50);
			}
		}
		
		fixedabsulate();
		bidui()
		$(this).parents(".voucher-center").attr("op", "1");
		$(this).parents(".voucher-center").nextAll(".voucher-center").attr("op", "1");
		$(this).parents(".voucher-center").nextAll(".deleteclass").attr("op", "2");
	}

})
$(document).on("click", ".voucherjian", function(e) {
	stopPropagation(e)
	for(var i = 0; i < $(".voucher-yc").length; i++) {
		if($(".voucher-yc").eq(i).css("display") != "none") {
			$(".voucher-yc").eq(i).hide();
			$(".voucherall").height($(".voucherall").height() - $(".voucher-yc").eq(i).outerHeight());
			fixedabsulate();
		}
	}
	var lenss = $('.voucher-footer').eq(0).offset().top - $(window).scrollTop() + 60
	$('.voucher-singelzybg').find(".voucherycshow").css("top", lenss + 'px')
	if(vousinglepzzy && isdobabstractinp) {
		if($('.voucher-singelzybg').find(".voucherycshow").css('display') == 'none') {
			var lenss = $('.voucher-footer').eq(0).offset().top - $(window).scrollTop() + 60
			$('.voucher-singelzybg').find(".voucherycshow").css("top", lenss + 'px').show()
			$(".voucherall").height($(".voucherall").height() + 120);
			fixedabsulate()
		}
	}
	var editStatus4 = $(this).parents('.voucher-center').attr('ifEdit')=='false'
	if(!isInputChange() || editStatus4){
		$(this).attr("readonly", true);
		return false;
	} else {
		if($(".voucher-center").length - $(this).parents(".voucher-center").siblings(".deleteclass").length > 2) {
			if(vousinglepz == false && vousinglepzzy == true && $(".voucher-center").length - $(this).parents(".voucher-center").siblings(".deleteclass").length < 5){
				ufma.showTip("至少留下两行", function() {}, "warning")
				return false
			}
			if(vousinglepz == false && vousinglepzzy == true) {
				$(this).parents(".voucher-center").prev('.voucher-center').remove()
			}
			$(this).parents(".voucher-center").remove()
			$(this).parents(".voucher-center").nextAll(".voucher-center").attr("op", "1");
			$(this).parents(".voucher-center").nextAll(".deleteclass").attr("op", "2");
			var vclen = 0;
			for(var i = 0; i < $(".voucher-centercw").length; i++) {
				if($(".voucher-centercw").eq(i).hasClass("deleteclass")) {
					vclen += 1;
				}
			}
			if($(".voucher").hasClass('voucher-singelzyx') != true){
				if($(".voucher-centercw").length - vclen <= 6 || $(".voucher").hasClass('voucher-singelzybg') != true) {
					$(".voucherall").height($(".voucherall").height() - 50)
				}
			}
			fixedabsulate();
			if(selectdata.data!=undefined && selectdata.data.vouStatus == "O") {
				$("#pzzhuantai").hide();
				voubiaoji();
			}
		} else {
			ufma.showTip("至少留下两行", function() {}, "warning")
		}
		bidui();
	}
})
//绑定获取焦点的行添加背景色
$(document).on("focus", "input", function() {
	var editStatus0 = ($("#pzzhuantai").attr("vou-status") == undefined);
	if(!editStatus0) {
		var editStatus1 = ($("#pzzhuantai").attr("vou-status") == "O");
		var editStatus2 = (isInputor == true && (selectdata.data.inputor == ufgovkey.svUserCode || selectdata.data.inputor == undefined))
		if(editStatus1 && (editStatus2 || isInputor == false)) {
			$(this).parents(".voucher-center").find(".abstractinp").addClass("bgblack");
			$(this).parents(".voucher-center").find(".accountinginp").addClass("bgblack");
			$(this).parents(".voucher-center").find(".money-xs").addClass("bgblack");
			$(this).removeClass("bgblack")
		} else {
//			return false;
		}
	} else {
		$(this).parents(".voucher-center").find(".abstractinp").addClass("bgblack");
		$(this).parents(".voucher-center").find(".accountinginp").addClass("bgblack");
		$(this).parents(".voucher-center").find(".money-xs").addClass("bgblack");
		$(this).removeClass("bgblack")
	}
})
//绑定失去焦点的行删除背景色
$(document).on("blur", "input", function() {
	$(this).parents(".voucher-center").find(".abstractinp").removeClass("bgblack");
	$(this).parents(".voucher-center").find(".accountinginp").removeClass("bgblack");
	$(this).parents(".voucher-center").find(".money-xs").removeClass("bgblack");
})

//点击保存的时候,判定是否有vouguid,有的话就切换成修改,没有的话就切换成保存;

//将点击f5事件转换为硬性重新加载事件
$(document).on("keydown", function(event) {
	event = event || window.event;
	if(event.keyCode == 116) {
		window.location.reload(true);
		return false;
	}
})
$(document).on("click", ".container", function(e) {
	stopPropagation(e)
})
//以下为各部位样式
$(document).on("click", function() {
	$(".allgd").hide();
})

$(document).on("click", ".mbtabbodyxz", function() {
	$("#zezhao").hide();
	//	window.location.reload(true);
	$("#btn-voucher-xz").click()
})
var prevnextvoucher = -1;
$(document).on("click", ".btn-nextvoucher", function(e) {
	var isnotpermission = '';
	if($(this).hasClass("btn-disablesd") !=true){
	$(this).addClass("btn-disablesd")
	for(var i = 0; i < isbtnpermission.length; i++) {
		if(isbtnpermission[i].id == "btn-watch") {
			isnotpermission = isbtnpermission[i].flag
		}
	}
	if(isnotpermission != "0") {
		for(var i = 0; i < $(".voucher-center").length; i++) {
			if($(".voucher-center").eq(i).attr("op") != undefined && $(".voucher-center").eq(i).attr("op") != 3 && $(".voucher-center").eq(i).attr("namess") != undefined && selectdata.data.errFlag == 0 && selectdata.data.vouStatus == "O") {
				gaibianl = false;
			}
			if($(".voucher-center").eq(i).attr("op") != undefined && $(".voucher-center").eq(i).attr("op") == 1 && $(".voucher-center").eq(i).attr("namess") == undefined) {
				gaibianl = false;
			}
		}
		if(gaibianl == false) {
			var _this= $(this)
			ufma.confirm('这会取消您当前输入的内容，是否继续', function(action) {
				if(action) {
					_this.removeClass("btn-disablesd")
					gaibianl = true;
					stopPropagation(e);
					leftsearch()
					if($('.voucher-head').attr('namess') != undefined){
						for(var z=0;z<leftsss.data.length;z++){
							if(leftsss.data[z].vouGuid == $('.voucher-head').attr('namess')){
								prevnextvoucher = z+1
							}
						}
					}
					if(prevnextvoucher >= leftsss.data.length) {
						ufma.showTip("已经是当期最后一张凭证", function() {}, "warning")
						prevnextvoucher = leftsss.data.length - 1
					} else {
						ufma.ajaxDef("/gl/vou/getVou/" + leftsss.data[prevnextvoucher].vouGuid, "get", '', function(data) {
							dataforcwys(data.data)
							cwyspd();
							chapz();
							zhuantai();
							if(quanjuvouyusuan != null && quanjuvouchaiwu != null) {
								if($(".yusuan").hasClass('xuanzhongcy')) {
									$(".chaiwu").trigger('click');
									var timeId = setTimeout(function() {
										$(".yusuan").trigger('click');
										clearTimeout(timeId);
									}, 300);
								} else if($(".chaiwu").hasClass('xuanzhongcy')) {
									$(".yusuan").trigger('click');
									var timeId = setTimeout(function() {
										$(".chaiwu").trigger('click');
										clearTimeout(timeId);
									}, 300);
								}
							}
						})
					}
				}else{
					_this.removeClass("btn-disablesd")
				}
			})
		} else {
			$(this).removeClass("btn-disablesd")
			gaibianl = true;
			stopPropagation(e);
			prevnextvoucher += 1;
			leftsearch()
			if($('.voucher-head').attr('namess') != undefined){
				for(var z=0;z<leftsss.data.length;z++){
					if(leftsss.data[z].vouGuid == $('.voucher-head').attr('namess')){
						prevnextvoucher = z+1
					}
				}
			}
			if(prevnextvoucher >= leftsss.data.length) {
				ufma.showTip("已经是当期最后一张凭证", function() {}, "warning")
				prevnextvoucher = leftsss.data.length - 1
			} else {
				ufma.ajaxDef("/gl/vou/getVou/" + leftsss.data[prevnextvoucher].vouGuid, "get", '', function(data) {
					dataforcwys(data.data)
					cwyspd();
					chapz();
					zhuantai();
					if(quanjuvouyusuan != null && quanjuvouchaiwu != null) {
						if($(".yusuan").hasClass('xuanzhongcy')) {
							$(".chaiwu").trigger('click');
							var timeId = setTimeout(function() {
								$(".yusuan").trigger('click');
								clearTimeout(timeId);
							}, 300);
						} else if($(".chaiwu").hasClass('xuanzhongcy')) {
							$(".yusuan").trigger('click');
							var timeId = setTimeout(function() {
								$(".chaiwu").trigger('click');
								clearTimeout(timeId);
							}, 300);
						}
					}
				})
			}
		}
	} else {
		ufma.showTip("您没有此权限", function() {}, "error")
	}
	}
})
$(document).on("click", ".btn-prevvoucher", function(e) {
	if($(this).hasClass("btn-disablesd") !=true){
	$(this).addClass("btn-disablesd")
	var isnotpermission = '';
	for(var i = 0; i < isbtnpermission.length; i++) {
		if(isbtnpermission[i].id == "btn-watch") {
			isnotpermission = isbtnpermission[i].flag
		}
	}
	if(isnotpermission != "0") {
		for(var i = 0; i < $(".voucher-center").length; i++) {
			if($(".voucher-center").eq(i).attr("op") != undefined && $(".voucher-center").eq(i).attr("op") != 3 && $(".voucher-center").eq(i).attr("namess") != undefined && selectdata.data.errFlag == 0 && selectdata.data.vouStatus == "O") {
				gaibianl = false;
			}
			if($(".voucher-center").eq(i).attr("op") != undefined && $(".voucher-center").eq(i).attr("op") == 1 && $(".voucher-center").eq(i).attr("namess") == undefined) {
				gaibianl = false;
			}
		}
		if(gaibianl == false) {
			var _this=$(this)
			ufma.confirm('这会取消您当前输入的内容，是否继续', function(action) {
				if(action) {
					_this.removeClass("btn-disablesd")
					gaibianl = true;
					stopPropagation(e)
					leftsearch()
					if($('.voucher-head').attr('namess') != undefined){
						for(var z=0;z<leftsss.data.length;z++){
							if(leftsss.data[z].vouGuid == $('.voucher-head').attr('namess')){
								prevnextvoucher = z-1
							}
						}
					}
					if(prevnextvoucher < 0 && $('.voucher-head').attr('namess') != undefined) {
						ufma.showTip("已经是当期第一张凭证", function() {}, "warning")
						prevnextvoucher = 0;
					} else {
						if(prevnextvoucher < 0 && $('.voucher-head').attr('namess') == undefined) {
							prevnextvoucher = 0
						}
						var titlesrcs = 'getVou'
						if(vousinglepz == true) {
							titlesrcs = 'getVou'
						}
						ufma.ajaxDef("/gl/vou/getVou/" + leftsss.data[prevnextvoucher].vouGuid, "get", '', function(data) {
							dataforcwys(data.data)
							cwyspd();
							chapz();
							zhuantai();
							if(quanjuvouyusuan != null && quanjuvouchaiwu != null) {
								if($(".yusuan").hasClass('xuanzhongcy')) {
									$(".chaiwu").trigger('click');
									var timeId = setTimeout(function() {
										$(".yusuan").trigger('click');
										clearTimeout(timeId);
									}, 300);
								} else if($(".chaiwu").hasClass('xuanzhongcy')) {
									$(".yusuan").trigger('click');
									var timeId = setTimeout(function() {
										$(".chaiwu").trigger('click');
										clearTimeout(timeId);
									}, 300);
								}
							}
						})
					}
				}else{
					_this.removeClass("btn-disablesd")
				}
			})
		} else {
			$(this).removeClass("btn-disablesd")
			gaibianl = true;
			stopPropagation(e)
			leftsearch()
			if($('.voucher-head').attr('namess') != undefined){
				for(var z=0;z<leftsss.data.length;z++){
					if(leftsss.data[z].vouGuid == $('.voucher-head').attr('namess')){
						prevnextvoucher = z-1
					}
				}
			}else{
				prevnextvoucher = leftsss.data.length-1
			}
			if(prevnextvoucher < 0 && $('.voucher-head').attr('namess') != undefined) {
				ufma.showTip("已经是当期第一张凭证", function() {}, "warning")
				prevnextvoucher = 0;
			} else {
				if(prevnextvoucher < 0 && $('.voucher-head').attr('namess') == undefined) {
					prevnextvoucher = 0
				}
				var titlesrcs = 'getVou'
				if(vousinglepz == true) {
					titlesrcs = 'getVou'
				}
				ufma.ajaxDef("/gl/vou/getVou/" + leftsss.data[prevnextvoucher].vouGuid, "get", '', function(data) {
					dataforcwys(data.data)
					cwyspd();
					chapz();
					zhuantai();
					if(quanjuvouyusuan != null && quanjuvouchaiwu != null) {
						if($(".yusuan").hasClass('xuanzhongcy')) {
							$(".chaiwu").trigger('click');
							var timeId = setTimeout(function() {
								$(".yusuan").trigger('click');
								clearTimeout(timeId);
							}, 300);
						} else if($(".chaiwu").hasClass('xuanzhongcy')) {
							$(".yusuan").trigger('click');
							var timeId = setTimeout(function() {
								$(".chaiwu").trigger('click');
								clearTimeout(timeId);
							}, 300);
						}
					}
				})
			}
		}
	} else {
		ufma.showTip("您没有此权限", function() {}, "error")
	}
	}
})
$(document).on("click", ".btn-onevoucher", function(e) {
	if($(this).hasClass("btn-disablesd") !=true){
	$(this).addClass("btn-disablesd")
	var isnotpermission = '';
	for(var i = 0; i < isbtnpermission.length; i++) {
		if(isbtnpermission[i].id == "btn-watch") {
			isnotpermission = isbtnpermission[i].flag
		}
	}
	if(isnotpermission != "0") {
		for(var i = 0; i < $(".voucher-center").length; i++) {
			if($(".voucher-center").eq(i).attr("op") != undefined && $(".voucher-center").eq(i).attr("op") != 3 && $(".voucher-center").eq(i).attr("namess") != undefined && selectdata.data.errFlag == 0 && selectdata.data.vouStatus == "O") {
				gaibianl = false;
			}
			if($(".voucher-center").eq(i).attr("op") != undefined && $(".voucher-center").eq(i).attr("op") == 1 && $(".voucher-center").eq(i).attr("namess") == undefined) {
				gaibianl = false;
			}
		}
		if(gaibianl == false) {
			var _this = $(this)
			ufma.confirm('这会取消您当前输入的内容，是否继续', function(action) {
				if(action) {
			_this.removeClass("btn-disablesd")
					gaibianl = true;
					stopPropagation(e);
					prevnextvoucher = 0;
					leftsearch()
					if(prevnextvoucher >= leftsss.data.length) {
						ufma.showTip("已经是当期第一张凭证", function() {}, "warning")
						prevnextvoucher = leftsss.data.length - 1
					} else {
						ufma.ajaxDef("/gl/vou/getVou/" + leftsss.data[prevnextvoucher].vouGuid, "get", '', function(data) {
							dataforcwys(data.data)
							cwyspd();
							chapz();
							zhuantai();
							if(quanjuvouyusuan != null && quanjuvouchaiwu != null) {
								if($(".yusuan").hasClass('xuanzhongcy')) {
									$(".chaiwu").trigger('click');
									var timeId = setTimeout(function() {
										$(".yusuan").trigger('click');
										clearTimeout(timeId);
									}, 300);
								} else if($(".chaiwu").hasClass('xuanzhongcy')) {
									$(".yusuan").trigger('click');
									var timeId = setTimeout(function() {
										$(".chaiwu").trigger('click');
										clearTimeout(timeId);
									}, 300);
								}
							}
						})
					}
				}else{
					_this.removeClass("btn-disablesd")
				}
			})
		} else {
			$(this).removeClass("btn-disablesd")
			gaibianl = true;
			stopPropagation(e);
			prevnextvoucher = 0;
			leftsearch()
			if(prevnextvoucher >= leftsss.data.length) {
				ufma.showTip("已经是当期第一张凭证", function() {}, "warning")
				prevnextvoucher = leftsss.data.length - 1
			} else {
				ufma.ajaxDef("/gl/vou/getVou/" + leftsss.data[prevnextvoucher].vouGuid, "get", '', function(data) {
					dataforcwys(data.data)
					cwyspd();
					chapz();
					zhuantai();
					if(quanjuvouyusuan != null && quanjuvouchaiwu != null) {
						if($(".yusuan").hasClass('xuanzhongcy')) {
							$(".chaiwu").trigger('click');
							var timeId = setTimeout(function() {
								$(".yusuan").trigger('click');
								clearTimeout(timeId);
							}, 300);
						} else if($(".chaiwu").hasClass('xuanzhongcy')) {
							$(".yusuan").trigger('click');
							var timeId = setTimeout(function() {
								$(".chaiwu").trigger('click');
								clearTimeout(timeId);
							}, 300);
						}
					}
				})
			}
		}
	} else {
		ufma.showTip("您没有此权限", function() {}, "error")
	}
	}
})
$(document).on("click", ".btn-lastvoucher", function(e) {
	if($(this).hasClass("btn-disablesd") !=true){
	$(this).addClass("btn-disablesd")
	var isnotpermission = '';
	for(var i = 0; i < isbtnpermission.length; i++) {
		if(isbtnpermission[i].id == "btn-watch") {
			isnotpermission = isbtnpermission[i].flag
		}
	}
	if(isnotpermission != "0") {
		for(var i = 0; i < $(".voucher-center").length; i++) {
			if($(".voucher-center").eq(i).attr("op") != undefined && $(".voucher-center").eq(i).attr("op") != 3 && $(".voucher-center").eq(i).attr("namess") != undefined && selectdata.data.errFlag == 0 && selectdata.data.vouStatus == "O") {
				gaibianl = false;
			}
			if($(".voucher-center").eq(i).attr("op") != undefined && $(".voucher-center").eq(i).attr("op") == 1 && $(".voucher-center").eq(i).attr("namess") == undefined) {
				gaibianl = false;
			}
		}
		if(gaibianl == false) {
			var _this = $(this)
			ufma.confirm('这会取消您当前输入的内容，是否继续', function(action) {
				if(action) {
					_this.removeClass("btn-disablesd")
					gaibianl = true;
					stopPropagation(e);
					leftsearch()
					prevnextvoucher = leftsss.data.length - 1;
					if(prevnextvoucher >= leftsss.data.length) {
						ufma.showTip("已经是当期最后一张凭证", function() {}, "warning")
						prevnextvoucher = leftsss.data.length - 1
					} else {
						ufma.ajaxDef("/gl/vou/getVou/" + leftsss.data[prevnextvoucher].vouGuid, "get", '', function(data) {
							dataforcwys(data.data)
							cwyspd();
							chapz();
							zhuantai();
							if(quanjuvouyusuan != null && quanjuvouchaiwu != null) {
								if($(".yusuan").hasClass('xuanzhongcy')) {
									$(".chaiwu").trigger('click');
									var timeId = setTimeout(function() {
										$(".yusuan").trigger('click');
										clearTimeout(timeId);
									}, 300);
								} else if($(".chaiwu").hasClass('xuanzhongcy')) {
									$(".yusuan").trigger('click');
									var timeId = setTimeout(function() {
										$(".chaiwu").trigger('click');
										clearTimeout(timeId);
									}, 300);
								}
							}
						})
					}
				}else{	
					_this.removeClass("btn-disablesd")
				}
			})
		} else {
			$(this).removeClass("btn-disablesd")
			gaibianl = true;
			stopPropagation(e);
			prevnextvoucher = leftsss.data.length - 1;
			leftsearch()
			if(prevnextvoucher >= leftsss.data.length) {
				ufma.showTip("已经是当期最后一张凭证", function() {}, "warning")
				prevnextvoucher = leftsss.data.length - 1
			} else {
				ufma.ajaxDef("/gl/vou/getVou/" + leftsss.data[prevnextvoucher].vouGuid, "get", '', function(data) {
					dataforcwys(data.data)
					cwyspd();
					chapz();
					zhuantai();
					if(quanjuvouyusuan != null && quanjuvouchaiwu != null) {
						if($(".yusuan").hasClass('xuanzhongcy')) {
							$(".chaiwu").trigger('click');
							var timeId = setTimeout(function() {
								$(".yusuan").trigger('click');
								clearTimeout(timeId);
							}, 300);
						} else if($(".chaiwu").hasClass('xuanzhongcy')) {
							$(".yusuan").trigger('click');
							var timeId = setTimeout(function() {
								$(".chaiwu").trigger('click');
								clearTimeout(timeId);
							}, 300);
						}
					}
				})
			}
		}
	} else {
		ufma.showTip("您没有此权限", function() {}, "error")
	}
	}
})
var voucherindex = 0;
$(document).on("focus", ".voucher-center textarea,.voucher-center input", function() {
	$('.voucher-center').attr('mobanindex','0')
	$(this).parents('.voucher-center').attr('mobanindex','1')
})
Date.prototype.Format = function(fmt) { //author: meizz
	var o = {
		"M+": this.getMonth() + 1, //月份 
		"d+": this.getDate(), //日 
		"h+": this.getHours(), //小时 
		"m+": this.getMinutes(), //分 
		"s+": this.getSeconds(), //秒 
		"q+": Math.floor((this.getMonth() + 3) / 3), //季度 
		"S": this.getMilliseconds() //毫秒 
	};
	if(/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
	for(var k in o)
		if(new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
	return fmt;
};
$(".times").text(ufgovkey.svTransDate)

function getLastDay() {
	var nowDate = $("#dates").getObj().getValue();
	var dt = new Date(Date.parse(nowDate.replace(/-/g, "/")));
	dt.setDate(1);
	dt.setMonth(dt.getMonth() + 1);
	cdt = new Date(dt.getTime() - 1000 * 60 * 60 * 24);
	var myDate = new Date(Date.parse(nowDate.replace(/-/g, "/")));
	return(cdt.getFullYear() + "-" + fix(myDate.getMonth() + 1, 2) + "-" + fix(cdt.getDate(), 2));
}
$(document).on("click", ".accountingmx", function(e) {
	stopPropagation(e)
	var nowDate = $("#dates").getObj().getValue();
	var myDate = new Date(Date.parse(nowDate.replace(/-/g, "/")));
	if($(".xuanzhongcy").hasClass("chaiwu")) {
		var zs = 1
	} else {
		var zs = 2
	}
	_this = $(this);
	var codes = _this.parents(".accounting").find(".accountinginp").attr("code");
	var names = _this.parents(".accounting").find(".accountinginp").attr("code") + " " +_this.parents(".accounting").find(".accountinginp").attr("name");
	var key = {
		"acctCode": rpt.nowAcctCode,
		"agencyCode": rpt.nowAgencyCode,
		"prjCode": "",
		"prjName": "",
		"prjScope": "",
		"rptType": "GL_RPT_JOURNAL",
		"setYear": myDate.getFullYear(),
		"userId": ufgovkey.svUserCode,
		"prjContent": {
			"agencyAcctInfo": [{
				"acctCode": rpt.nowAcctCode,
				"agencyCode": rpt.nowAgencyCode
			}],
			"startDate": myDate.getFullYear() + '-' + fix(myDate.getMonth() + 1, 2) + '-01',
			"endDate": getLastDay(),
			"startYear": "",
			"startFisperd": "",
			"endYear": "",
			"endFisperd": "",
			"qryItems": [{
				"itemType": "ACCO",
				"itemTypeName": "会计科目",
				"seq": 0,
				"items": [{
					"code": codes,
					"name": names
				}]
			}],
			"rptCondItem": [],
			"rptOption": [{
					"defCompoValue": "Y",
					"optCode": "IS_INCLUDE_UNPOST",
					"optName": "含未记账凭证"
				},
				{
					"defCompoValue": "N",
					"optCode": "IS_INCLUDE_JZ",
					"optName": "含结转凭证"
				},
				{
					"defCompoValue": "N",
					"optCode": "IS_JUSTSHOW_OCCFISPERD",
					"optName": "只显示有发生期间"
				}
			],
			"curCode": "RMB",
			"rptStyle": "SANLAN",
			"rptTitleName": "明细账"
		}
	}
	window.sessionStorage.setItem("journalFormVou", JSON.stringify(key))
	var title= '明细账'
	var baseUrl= '/pf/gl/rpt/glRptJournal/glRptJournal.html?dataFrom=vou&action=query&menuid=f34f56bd-a122-4f6d-a6b4-28b0068c524b'
	page.openNewPages(page.isCrossDomain,$(this), 'openMenu', baseUrl, false, title);
})
$(document).on("click", ".accountingye", function(e) {
	//	page.editor = ufma.showModal('vouAccoBal', 750, 350);
    var acco = $(this).parents('.accounting').find('.accountinginp').attr('code')
	var acconame = $(this).parents('.accounting').find('.accountinginp').attr('name')
	// var nowAccItemSeq = $.inArrayJson(accitemOrderSeq, 'accoCode', acco)
	var searchAssdata = {}
	// if(nowAccItemSeq != undefined) {
	// 	var accitemList = nowAccItemSeq.accitemList;
	// 	for(var i = 0; i < accitemList.length; i++) {
	// 		if(accitemList[i]["IS_SHOW"] == 1) {
	// 			var str = accitemList[i]["ACCITEM_CODE"];
	// 			var code = tf(str) + "Code";
	// 			var name = tablehead[code].ELE_NAME
	// 			searchAssdata[str] = name
	// 		}
	// 	}
	// }
	var tr = ''
	for(var i in searchAssdata){
		tr+='<label class="mt-checkbox mt-checkbox-single mt-checkbox-outline" style="margin-right:10px;">'
		tr+='<input type="checkbox" class="datatable-group-checkable" name="'+i+'" autocomplete="off">'+searchAssdata[i]
		tr+='<span></span>'
		tr+='</label>'
	}
	$("#vouaccBalRelation .searchAss").html(tr)
    ufma.ajaxDef("/gl/vou/getAccoBal/" + rpt.nowAgencyCode +"/"+rpt.nowAcctCode+'/'+acco, "get",'',function(data) {
		var data = data.data
		if(data[acco]!=undefined){
			var tr = '<tr><td>'+acco+' '+acconame+'</td><td>'+formatNum(data[acco])+'</td></tr>'
			$('#vouaccBaltab').find('tbody').html(tr)
		}else{
			$('#vouaccBaltab').find('tbody').html('')
			ufma.showTip('当前科目余额为0',function(){},'warning')
		}
	});
    page.editor = ufma.showModal('vouaccBalRelation', 1100, 500);
})

$(document).on("click", "#btn-vouaccBalRelationsearch", function(e) {
})
$(document).on("click", "#btn-vouaccBalRelationgb", function(e) {
	page.editor.close()
})
$(document).on("click", "#btn-vouAccoBalqx", function(e) {
	page.editor.close()
})
$(document).on("click", ".voucher-history-zhankai", function() {
	if($(this).find("b").hasClass("icon-angle-top")) {
		$(this).find("b").addClass("icon-angle-bottom").removeClass("icon-angle-top");
		$(this).parents(".voucher-history-bt").next(".voucher-history-by").css("height", "0px");
	} else {
		$(this).find("b").addClass("icon-angle-top").removeClass("icon-angle-bottom");
		$(this).parents(".voucher-history-bt").next(".voucher-history-by").css("height", "auto");
		if($(".voucher-head").attr("namess") == undefined) {
			ufma.showTip("凭证尚未保存", function() {}, "warning")
		} else {
			var vouGuid = $(".voucher-head").attr("namess");
			$.ajax({
				type: "get",
				url: "/gl/vou/getVouLog/" + vouGuid + "?ajax=1&rueicode="+hex_md5svUserCode,
				async: false,
				success: function(data) {
					//					var historydata = new Object();
					if(data.flag == "success") {
						if(data.data == null) {
							//							$(".voucher-history-by").html("暂无数据");
						} else {
							var historydata = '';
							for(var i = 0; i < data.data.length; i++) {
								if(data.data[i].vouHisGuid != null && data.data[i].vouHisGuid != "") {
									historydata += '<p class="voucher-history-by-nr" namess="' + data.data[i].vouHisGuid + '"><span class="voucher-history-by-time" style="color:#108EE9">' + data.data[i].optTime + ' </span><span class="jeiduan" style="color:#108EE9"></span><span class="voucher-history-by-pz" style="color:#108EE9">' + data.data[i].remark + '</span></p>'
								} else {
									historydata += '<p class="voucher-history-by-nr" namess="' + data.data[i].vouHisGuid + '"><span class="voucher-history-by-time">' + data.data[i].optTime + ' </span><span class="jeiduan"></span><span class="voucher-history-by-pz">' + data.data[i].remark + '</span></p>'
								}
							}
							$(".voucher-history-by").html(historydata);
						}
					} else {
						ufma.showTip(data.msg, function() {}, "error")
					}
				},
				error: function() {
					ufma.showTip("加载失败,请检查网络", function() {}, "error")
				}
			});
		}
	}
})
$(document).on("click", ".voucher-beizhu-zhankai", function() {
	$(".nowu").hide();
	$("#voucherbiaozhu").val($(".nowu").text());
	$("#voucherbiaozhu").show();
	$("#voucherbiaozhu").focus();
	$(".voucher-beizhu-by-queren").show();
})
$(document).on("click", ".voucher-beizhu-by-queren", function() {
	if($(".voucher-head").attr("namess") == undefined) {
		$(".nowu").show();
		$(".nowu").text($("#voucherbiaozhu").val())
		$("#voucherbiaozhu").hide();
		$(".voucher-beizhu-by-queren").hide();
	} else {
		var sss = new Object()
		sss.remark = $("#voucherbiaozhu").val();
		sss.vouGuid = $(".voucher-head").attr("namess")
		$.ajax({
			type: "post",
			url: "/gl/vou/editRemark" + "?ajax=1&rueicode="+hex_md5svUserCode,
			data: JSON.stringify(sss),
			contentType: 'application/json; charset=utf-8',
			async: true,
			success: function(data) {
				if(data.flag == "success") {
					$(".nowu").show();
					$(".nowu").text($("#voucherbiaozhu").val())
					$("#voucherbiaozhu").hide();
					$(".voucher-beizhu-by-queren").hide();
				} else {
					ufma.showTip(data.msg, function() {}, "error")
				}
			},
			error: function() {
				ufma.showTip("加载失败,请检查网络", function() {}, "error")
			}
		});
	}

})
$(document).on("blur", "#voucherbiaozhu", function() {
	setTimeout(function() {
		$("#voucherbiaozhu").hide();
		$(".voucher-beizhu-by-queren").hide();
		$(".nowu").show();
	}, 500)
})
$(document).on("click", ".btn-voucher-lang", function(e) {
	stopPropagation(e)
	$('.voucher-close').click()
	if($(this).find(".all-no").length == 1) {
		$(this).find(".all-no").toggle();
	}
})
$(document).on("focus", ".accountinginp,.money-jd,.yctz,#dates,#leftbgselect,#fjd", function() {
	if(!isInputChange()){
		$(this).attr("readonly", true);
		return false;
	} else {
		$(this).removeAttr("readonly");
		if($(".voucher-head").attr("namess") != undefined) {
			if(selectdata.data.vouStatus == "O") {
				$("#pzzhuantai").hide();
				voubiaoji();
			}
		}
	}
})
$(document).on("focus", "ycbodyinp", function() {
	if(!isInputChange()){
		$(this).attr("readonly", true);
		return false;
	} else {
		if($(".voucher-head").attr("namess") != undefined) {
			if(selectdata.data.vouStatus == "O") {
				$("#pzzhuantai").hide();
				voubiaoji();
			}
		}
	}
})
$(document).on("click", "#vouAttachBox", function(e) {
	stopPropagation(e)
})
$(document).scroll(function() {
	fixedabsulate()
	var ths=$(".accountcheck")
	var dths=$('.abstractcheck')
	var thss=$(".assCheck")
	// $(".assCheck").blur()
	if(ths.length>0){
		var sctop = ths.offset().top - $(window).scrollTop() - ths.parents('.voucher-yc-bg').scrollTop() + 50
		var scleft = ths.offset().left - $(window).scrollLeft()
		$('#accounting-container,#accounting-container-cw,#accounting-container-ys').css({
			'position': 'fixed',
			'top': sctop,
			'left': scleft
		})
	}
	if(thss.length>0){
		for(var i=0;i<$('#AssDataAll .ycbodys').length;i++){
			if($('#AssDataAll .ycbodys').eq(i).css("display")!='none'){
				var sctop = thss.offset().top - $(window).scrollTop() - thss.parents('.voucher-yc-bg').scrollTop() + 50
				var scbottom = thss.offset().top - $(window).scrollTop() - thss.parents('.voucher-yc-bg').scrollTop()-302
				var scleft = thss.offset().left - $(window).scrollLeft()
				var widthass = thss.width()
				var relation = thss.attr('relation')
				if(vousinglepzzy == true && isdobabstractinp == false  && vousingelzysdob){
					$('#AssDataAll .ycbodys').eq(i).css({
						'position': 'fixed',
						'top': scbottom,
						'height':'300px',
						'left': scleft,
						'width': widthass + 'px'
					});
				}else{
					$('#AssDataAll .ycbodys').eq(i).css({
						'position': 'fixed',
						'top': sctop,
						'height':'',
						'left': scleft,
						'width': widthass + 'px'
					});
				}
			}
		}
	}
	if(dths.length>0){
		var dsctop = dths.offset().top - $(window).scrollTop() - dths.parents('.voucher-yc-bg').scrollTop() + 50
		var dscleft = dths.offset().left - $(window).scrollLeft()
		$('#abstract-container').show().css({
			'position': 'fixed',
			'top': dsctop,
			'left': dscleft
		});
	}
	var lenss = $('.voucher-footer').eq(0).offset().top - $(window).scrollTop() + 60
	$('.voucher-singelzybg,.voucher-singelzyx').find(".voucher-yc").css("top", lenss + 'px')
	$('.voucher-singelzybg,.voucher-singelzyx').find(".voucherycshow").css("top", lenss + 'px')
});
$(document).on("click", ".zhibiao-close", function() {
	$("#zezhao").hide();
	$("#zezhao").html("");
})
$(document).on("click", ".btn-zhibiao-close", function() {
	$("#zezhao").hide();
	$("#zezhao").html("");
})

$(document).on("click", ".yctzyuer", function() {
	var namesd = $(this).attr("name");
	var zhibiao = '';
	zhibiao += '<div class="zhibiaoall">'
	zhibiao += '<div class="zhibiaohead">'
	zhibiao += '<p>预算控制余额详细信息</p>'
	zhibiao += '<span class="zhibiao-close icon-close"></span>'
	zhibiao += '</div>'
	zhibiao += '<div class="zhibiaobody">'
	for(var i = 0; i < keyzhibiao[namesd].length; i++) {
		zhibiao += '<div class="zhibiao-center">'
		//zhibiao += '<div class="zhibiaonum">方案' + changeToChinese(i + 1) + '</div>'
		zhibiao += '<div class="zhibiaonum">' + keyzhibiao[namesd][i].bgPlanName + '</div>'
		zhibiao += '<div class="zhibiaobt">指标摘要：' + keyzhibiao[namesd][i].bgItemSummary + '</div>'
		zhibiao += '<div class="zhibiaohref" style="color: #008FF0;display:none;">指标台账</div>'
		zhibiao += '<div class="zhibiao-center-body">'
		zhibiao += '<div class="zhibiao-center-body-top">'
		for(var k in tablehead) {
			if(keyzhibiao[namesd][i][tablehead[k].ELE_CODE] !== undefined) {
				zhibiao += '<div class="zhibiao-center-body-bm">'
				zhibiao += '<div class="zhibiaobbodybt">' + tablehead[k].ELE_NAME + '：</div>'
				zhibiao += '<div class="zhibiaobbodyby">'
				for(var z = 0; z < fzhsxl[k].length; z++) {
					if(keyzhibiao[namesd][i][tablehead[k].ELE_CODE] == fzhsxl[k][z].code) {
						zhibiao += fzhsxl[k][z].code + '  ' + fzhsxl[k][z].name
					}
				}
				zhibiao += '</div>'
				zhibiao += '</div>'
			}
		}
		zhibiao += '</div>'
		zhibiao += '<div class="zhibiao-center-body-bottom">'
		zhibiao += '<div class="zhibiao-center-body-kz">控制方式：  <span style="color:red;">' + keyzhibiao[namesd][i].bgCtrlType + '</span></div>'
		zhibiao += '<div class="zhibiao-center-body-yss">预算数： ' + keyzhibiao[namesd][i].bgItemCur + '</div>'
		zhibiao += '<div class="zhibiao-center-body-fss">发生数： ' + keyzhibiao[namesd][i].bgItemCurUse + '</div>'
		zhibiao += '<div class="zhibiao-center-body-ye">余额：  ' + keyzhibiao[namesd][i].bgItemBalance + '</div>'
		zhibiao += '</div>'
		zhibiao += '</div>'
		zhibiao += '</div>'
	}
	zhibiao += '</div>'
	zhibiao += '<div class="zhibiaofoot">'
	zhibiao += '<div class="btn-zhibiao-close">关闭</div>'
	zhibiao += '</div>'
	zhibiao += '</div>'
	$("#zezhao").show();
	$("#zezhao").html(zhibiao);
})

$(document).on("click", ".allvoucherycshow", function(e) {
	stopPropagation(e)
	for(var i = 0; i < $('.fuyan').length; i++) {
		if($('.fuyan').eq(i).parents('.voucher-center').hasClass('deleteclass') != true) {
			if($('.fuyan').eq(i).css('display') != 'none') {
				$('.fuyan').trigger('click')
			}         
		}
	}
	$(this).removeClass('allvoucherycshow').removeClass('icon-angle-bottom')
	$(this).addClass('allvoucherychide').addClass('icon-angle-top')
	$(this).attr('title', '关闭全部辅助项')
})
$(document).on("click", ".allvoucherychide", function(e) {
	stopPropagation(e)
	for(var i = 0; i < $(".voucher-yc").length; i++) {
		if($(".voucher-yc").eq(i).css("display") != "none") {
			$(".voucher-yc").eq(i).hide();
			$(".voucherall").height($(".voucherall").height() - $(".voucher-yc").eq(i).outerHeight());
			fixedabsulate();
		}
	}
	$(this).removeClass('allvoucherychide').removeClass('icon-angle-top')
	$(this).addClass('allvoucherycshow').addClass('icon-angle-bottom')
	$(this).attr('title', '展开全部辅助项')
})

$(document).on("click", ".allvoucherycshowzy", function(e) {
	stopPropagation(e)
	if($(this).attr('bs') == 'cw') {
		if($('.voucherheadys').find('.allvoucherychidezy').length > 0) {
			$('.voucherheadys').find('.allvoucherychidezy').trigger('click')
		}
		for(var i = 0; i < $('.voucher-centercw .fuyan').length; i++) {
			if($('.voucher-centercw .fuyan').eq(i).parents('.voucher-center').hasClass('deleteclass') != true) {
				if($('.voucher-centercw .fuyan').eq(i).css('display') != 'none') {
					$('.voucher-centercw .fuyan').eq(i).trigger('click')
				}
			}
		}
		$(this).removeClass('allvoucherycshowzy').removeClass('icon-angle-bottom')
		$(this).addClass('allvoucherychidezy').addClass('icon-angle-top')
		$(this).attr('title', '关闭全部财务辅助项')
	} else {
		if($('.voucherheadcw').find('.allvoucherychidezy').length > 0) {
			$('.voucherheadcw').find('.allvoucherychidezy').trigger('click')
		}
		for(var i = 0; i < $('.voucher-centerys .fuyan').length; i++) {
			if($('.voucher-centerys .fuyan').eq(i).parents('.voucher-center').hasClass('deleteclass') != true) {
				if($('.voucher-centerys .fuyan').eq(i).css('display') != 'none') {
					$('.voucher-centerys .fuyan').eq(i).trigger('click')
				}
			}
		}
		$(this).removeClass('allvoucherycshowzy').removeClass('icon-angle-bottom')
		$(this).addClass('allvoucherychidezy').addClass('icon-angle-top')
		$(this).attr('title', '关闭全部预算辅助项')
	}
})
$(document).on("click", ".allvoucherychidezy", function(e) {
	stopPropagation(e)
	if($(this).attr('bs') == 'cw') {
		for(var i = 0; i < $('.voucher-centercw .voucher-yc').length; i++) {
			if($('.voucher-centercw .voucher-yc').eq(i).css('display') != 'none') {
				$('.voucher-centercw .voucher-yc').eq(i).hide()
				$(".voucherall").height($(".voucherall").height() - $('.voucher-centercw .voucher-yc').eq(i).outerHeight());
				fixedabsulate();
			}
		}
		$(this).removeClass('allvoucherychidezy').removeClass('icon-angle-top')
		$(this).addClass('allvoucherycshowzy').addClass('icon-angle-bottom')
		$(this).attr('title', '展开全部财务辅助项')
	} else {
		for(var i = 0; i < $('.voucher-centerys .voucher-yc').length; i++) {
			if($('.voucher-centerys .voucher-yc').eq(i).css('display') != 'none') {
				$('.voucher-centerys .voucher-yc').eq(i).hide()
				$(".voucherall").height($(".voucherall").height() - $('.voucher-centerys .voucher-yc').eq(i).outerHeight());
				fixedabsulate();
			}
		}
		$(this).removeClass('allvoucherychidezy').removeClass('icon-angle-top')
		$(this).addClass('allvoucherycshowzy').addClass('icon-angle-bottom')
		$(this).attr('title', '展开全部预算辅助项')
	}

})
$('#showMethodTip').ufTooltip({
	className: 'p0',
	trigger: 'click', //click|hover
	opacity: 1,
	confirm: false,
	gravity: 'north', //north|south|west|east
	content: "#rptPlanList"
});
var issindouxg = true
var dpzsxzy = []
var vousourceName = ''
$("#vouisdoublesingle").click(function(e) {
	stopPropagation(e)
	var windowWidth = $(window).width();
	if(windowWidth > 1600) {
		isdobabstractinp = true
	} else {
		isdobabstractinp = false
	}
	//	$(this).find('input').click()
	var seldat = huoqu()
	vousourceName = $(".vouSource").text()
	if($("#btn-voucher-sh").length > 0) {
		issindouxg = false
	}
	if($("#vouislrud").hasClass('zys')) {
		$("#vouislrud").find('#vouisdoublesingle').prop('checked', true)
		$("#vouislrud").find('#vouisdoublesingles').prop('checked', false)
		vousinglepzzy = true
		vousinglepz = false
	} else {
		$("#vouislrud").addClass('zys')
		$("#vouislrud").find('#vouisdoublesingle').prop('checked', true)
		$("#vouislrud").find('#vouisdoublesingles').prop('checked', false)
		vousinglepzzy = true
		vousinglepz = false
	}
	upadd()
	selectdata.data = seldat
	cwyspd();
	chapz()
	$(".vouSource").text(vousourceName)
	zhuantai()
	if($("#btn-voucher-sh").length>0 && issindouxg){
		voubiaoji();
	}
	issindouxg = true
	configupdate('vouisdouble',1)
})
$("#vouisdoublesingles").click(function(e) {
	stopPropagation(e)
	var windowWidth = $(window).width();
	if(windowWidth > 1600) {
		isdobabstractinp = true
	} else {
		isdobabstractinp = false
	}
	//	$(this).find('input').click()
	var seldat = huoqu()
	vousourceName = $(".vouSource").text()
	if($("#btn-voucher-sh").length > 0) {
		issindouxg = false
	}
	if($("#vouislrud").hasClass('zys')) {
		$("#vouislrud").removeClass('zys')
		$("#vouislrud").find('#vouisdoublesingles').prop('checked', true)
		$("#vouislrud").find('#vouisdoublesingle').prop('checked', false)
		vousinglepz = true
		vousinglepzzy = false
	}
	upadd()
	selectdata.data = seldat
	cwyspd();
	chapz()
	$(".vouSource").text(vousourceName)
	zhuantai()
	if($("#btn-voucher-sh").length>0 && issindouxg){
		voubiaoji();
	}
	issindouxg = true
	configupdate('vouisdouble',0)
})
$("#vouisfullnamesingle").click(function(e) {
	stopPropagation(e)
	if(isaccfullname != true) {
		var seldat = huoqu()
		vousourceName = $(".vouSource").text()
		isaccfullname = true
		$("#vouisfullname").find('#vouisfullnamesingle').prop('checked', true)
		$("#vouisfullname").find('#vouisfullnamesingles').prop('checked', false)
		selectdata.data = seldat
		chapz()
		$(".vouSource").text(vousourceName)
		zhuantai()
		configupdate('vouisfullname',1)
	}
})
$("#vouisfullnamesingles").click(function(e) {
	stopPropagation(e)
	if(isaccfullname == true) {
		var seldat = huoqu()
		vousourceName = $(".vouSource").text()
		isaccfullname = false
		$("#vouisfullname").find('#vouisfullnamesingle').prop('checked', false)
		$("#vouisfullname").find('#vouisfullnamesingles').prop('checked', true)
		selectdata.data = seldat
		chapz()
		$(".vouSource").text(vousourceName)
		zhuantai()
		configupdate('vouisfullname',0)
	}
})
$("#vouisvaguesearch").click(function(e) {
	stopPropagation(e)
	vouisvague = false
	configupdate('vouisvaguesearch',1)
	
})
$("#vouisvaguesearchs").click(function(e) {
	stopPropagation(e)
	vouisvague = true
	configupdate('vouisvaguesearch',0)
})
$("#vouiscopyprevAss").click(function(e) {
	stopPropagation(e)
	vouiscopyprevAss = true
	configupdate('vouiscopyprevAss',1)
	
})
$("#vouiscopyprevAsss").click(function(e) {
	stopPropagation(e)
	vouiscopyprevAss = false
	configupdate('vouiscopyprevAss',0)
})
$("#vouisaddDaten").click(function(e) {
	stopPropagation(e)
	vouisaddDate = false
	configupdate('vouisaddDate',0)
})
$("#vouisaddDatey").click(function(e) {
	stopPropagation(e)
	vouisaddDate = true
	configupdate('vouisaddDate',1)
})
$("#defalultOpen").click(function(e) {
	stopPropagation(e)
	isdefaultopen = true
	configupdate('defalultOpen',1)
})
$("#defalultOpenNo").click(function(e) {
	stopPropagation(e)
	isdefaultopen = false
	configupdate('defalultOpen',0)
})
$("#ysorcw").click(function(e) {
	stopPropagation(e)
	isysorcw = true
	configupdate('ysorcw',1)
})
$("#ysorcwNo").click(function(e) {
	stopPropagation(e)
	isysorcw = false
	configupdate('ysorcw',0)
})
$("#addindexzy").click(function(e) {
	stopPropagation(e)
	addindexiszy = true
	configupdate('addindexiszy',1)
})
$("#addindexfj").click(function(e) {
	stopPropagation(e)
	addindexiszy = false
	configupdate('addindexiszy',0)
})
$(document).on("click", ".bxd", function(e) {
	if(rpt.nowAgencyCode.substring(0,3) == 999){
		var codeid = $(this).attr('gwzj')
		var loaddata = {
			 "boeHeaderId": codeid
		}
		var httpClientdata = {
			'url':"http://10.9.29.51/sys/interface/supportAccountPart/getBoePathForYonyou",
			'params':loaddata,
			'type':'POST'
		}
		var _this = $(this)
		$.ajax({
			type: "post",
			url: "/gl/httpClient/doHttpRequest",
			async: false,
			data: JSON.stringify(httpClientdata),
			contentType: 'application/json; charset=utf-8',
			dataType: 'json',
			success: function(data) {
				var url  = JSON.parse(data.data)
				window.open(url.data)	
			},
			error:function(data){
				
			}
		})
	// }else if($(".voucher-head").attr("namess")!=undefined){
	// 	var idsss =[]
	// 	ufma.ajaxDef("/gl/vou/selectBillListByVouGuids", 'post', [$(".voucher-head").attr("namess")], function(data) {
	// 	for(var i=0;i<data.data.length;i++){
	// 		if(data.data[i].field31 !=undefined && data.data[i].field31 !=''){
	// 			idsss.push(data.data[i].field31)
	// 		}
	// 	}
	// 	})
	// 	var nowid =idsss.join(',');
	// 	var uid = "type=otherModelShow" + "&billId=" + nowid + "&menuid=" + '140101001001';
	// 	var url = '/A/ar/resources/myArBillEdit?' + uid;
	// 	uf.openNewPage(page.isCrossDomain, $(this), 'openMenu', url, false, '报销单');
	}else if( $(this).attr('dowloads')!=undefined){
		var pdfcontent = $(this).attr('dowloads')
		if(pdfcontent!=''){
			window.open(printServiceUrl+'/'+pdfcontent, '_blank', 'titlebar=no,location=no,toolbar=no,menubar=no;top=100')
		}
	}
})
$(document).on('click', 'input,textarea,.money-jd', function(e) {
	$(this).parents('.voucher-center-active').removeClass('voucher-center-active')
})
$(document).on('focus', 'input,textarea', function(e) {
	$('.changemoneyjd').removeClass('changemoneyjd')
})
$(document).on('change', 'input,textarea', function(e) { //(\.')(\',)金额输入控制,(\_)(\/),(\:)(\?)url中用,(\ )去掉空格
	//去掉对负号的校验，避免金额出现问题  ==xiaosen
	//http和https url不参与校验
	//账套管理的账套名称 不走此校验$(this).attr('acctType') != 'acctCheck'--zsj
	if($(this).attr('type') != 'file' && $(this).val().indexOf("http") < 0 && $(this).val().indexOf("https") < 0 && $(this).attr('acctType') != 'acctCheck') {
		var containSpecial = RegExp(/[(\~)(\!)(\@)(\#)(\$)(\%)(\^)(\&)(\*)(\()(\))(\+)(\=)(\[)(\])(\{)(\})(\|)(\\)(\;)(\')(\")(\<)(\>)(\)]+/); //将'.'和','去除是因为金额输入时会用到，所以不能转义
		var inputValue = $(this).val();
		//只校验<></>防止XSS脚本攻击
		//var containSpecial = RegExp(/[(\<)(\>)(\")]+/);
		if(containSpecial.test(inputValue)) {
			var inputValueArr = inputValue.split('');
			var tmp = "";
			for(var i = 0; i < inputValue.length; i++) {
				if(inputValue.charCodeAt(i) == 32) {
					tmp = tmp + String.fromCharCode(12288);
				} else if(inputValue.charCodeAt(i) < 127 && !((inputValue.charCodeAt(i) >= 65 && inputValue.charCodeAt(i) <= 90) || (inputValue.charCodeAt(i) >= 97 && inputValue.charCodeAt(i) <= 122)) && !(inputValue.charCodeAt(i) >= 48 && inputValue.charCodeAt(i) <= 57)) {
					tmp = tmp + String.fromCharCode(inputValue.charCodeAt(i) + 65248);
				} else {
					tmp = tmp + inputValueArr[i];
				}
			}
			inputValue = tmp;
			$(this).val(inputValue);
		} else {
			var inputValueArr = inputValue.split('');
			var tmp = "";
			for(var i = 0; i < inputValue.length; i++) {
				if(((inputValue.charCodeAt(i) >= 65345 && inputValue.charCodeAt(i) <= 65370) || (inputValue.charCodeAt(i) >= 65313 && inputValue.charCodeAt(i) <= 65338)) || (inputValue.charCodeAt(i) >= 65296 && inputValue.charCodeAt(i) <= 65305)) {
					tmp += String.fromCharCode(inputValue.charCodeAt(i) - 65248);
				} else {
					tmp = tmp + inputValueArr[i];
				}
			}
			inputValue = tmp;
			$(this).val(inputValue);
		}
	}
});