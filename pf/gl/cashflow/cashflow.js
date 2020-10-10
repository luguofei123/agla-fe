var xianjingliu;
var quanjuvoudatas;
var fisperd;
var selectdata;
var dingsq;
var lastfocus;
$(function () {
	xianjingliu = window.ownerData.data
	quanjuvoudatas = window.ownerData.quanjuvoudatas
	fisperd = window.ownerData.fisperd
	selectdata = window.ownerData.selectdata
	xianjinglius(xianjingliu,quanjuvoudatas,fisperd)
})
function xianjinglius(xianjingliu,quanjuvoudatas,fisperd) {
	var xianjingstr = '';
	xianjingstr += '<div id="xianjing">'
	xianjingstr += '<div class="xianjing-body">'
	xianjingstr += '<div class="xianjing-body-top">'
	xianjingstr += '<div class="xianjin-jing">现金流量净'
	if(parseFloat(xianjingliu.data.JLR_JE)>=0){
		xianjingstr += '流入：'
		xianjingstr += parseFloat(xianjingliu.data.JLR_JE).toFixed(2)+'</div>'
	}else{
		xianjingstr += '流出：'
		xianjingstr += -1*parseFloat(xianjingliu.data.JLR_JE).toFixed(2)+'</div>'
	}
	for(var i = 0; i < xianjingliu.data.CF_Vouacco.length; i++) {
		xianjingstr += '<div class="xianjing-body-top-center">'
		for(var k = 0; k < quanjuvoudatas.data.length; k++) {
			if(quanjuvoudatas.data[k].accoCode == xianjingliu.data.CF_Vouacco[i].ACCO_CODE) {
				xianjingstr += '<div class="xianjing-body-top-km">会计科目：'+quanjuvoudatas.data[k].accoCode+'  '+quanjuvoudatas.data[k].accoName+'</div>'
			}
		}
		if(xianjingliu.data.CF_Vouacco[i].DR_CR == 1) {
			xianjingstr += '<div class="xianjing-body-top-jd">方向：借方</div>'
		} else {
			xianjingstr += '<div class="xianjing-body-top-jd">方向：贷方</div>'
		}
		xianjingstr += '<div class="xianjing-body-top-je">金额：<span>'+parseFloat(xianjingliu.data.CF_Vouacco[i].STAD_AMT).toFixed(2)+'</span></div>'
		xianjingstr += '<div class="xianjing-body-top-detailid">'+xianjingliu.data.CF_Vouacco[i].DETAIL_GUID+'</div>'
		xianjingstr += '</div>'
	}
	xianjingstr += '</div>'
	xianjingstr += '<div class="xianjing-body-bottom">'
	xianjingstr += '<div class="xianjing-body-bottom-head">'
//	xianjingstr += '<div class="xianjing-body-bottom-head-flxh">分录号</div>'
	xianjingstr += '<div class="xianjing-body-bottom-head-km">科目</div>'
	xianjingstr += '<div class="xianjing-body-bottom-head-jd">方向</div>'
//	xianjingstr += '<div class="xianjing-body-bottom-head-xh">序号</div>'
//	xianjingstr += '<div class="xianjing-body-bottom-head-xjdm">现金流量代码</div>'
	xianjingstr += '<div class="xianjing-body-bottom-head-xj">现金流量名称</div>'
	xianjingstr += '<div class="xianjing-body-bottom-head-je">金额</div>'
	xianjingstr += '<div class="xianjing-body-bottom-head-cz">操作</div>'
	xianjingstr += '</div>'
	for(var i = 0; i < xianjingliu.data.CF_Cash.length; i++) {
		xianjingstr += '<div class="xianjing-body-bottom-body" dg="' + xianjingliu.data.CF_Cash[i].detailGuid + '">'
//		xianjingstr += '<div class="xianjing-body-bottom-body-flxh">'+xianjingliu.data.CF_Cash[i].vouSeq+'</div>'
		for(var k = 0; k < quanjuvoudatas.data.length; k++) {
			if(quanjuvoudatas.data[k].accoCode == xianjingliu.data.CF_Cash[i].accoCode) {
				xianjingstr += '<div class="xianjing-body-bottom-body-km" title="'+quanjuvoudatas.data[k].accoCode+'  '+quanjuvoudatas.data[k].accoName+'"><span class="coded">' + quanjuvoudatas.data[k].accoCode + '</span>  <span class="named">' + quanjuvoudatas.data[k].accoName + '</span></div>'
			}
		}
		if(xianjingliu.data.CF_Cash[i].drCr == 1) {
			xianjingstr += '<div class="xianjing-body-bottom-body-jd">借方</div>'
		} else {
			xianjingstr += '<div class="xianjing-body-bottom-body-jd">贷方</div>'
		}
//		xianjingstr += '<div class="xianjing-body-bottom-body-xh">'+(i+1)+'</div>'
//		xianjingstr += '<div class="xianjing-body-bottom-body-xjdm">&nbsp</div>'
		xianjingstr += '<div class="xianjing-body-bottom-body-xj">'
		xianjingstr += '<input type="text" class="xianjing-body-bottom-body-xj-sr" />'
		xianjingstr += '<ul class="xianjing-body-bottom-body-xj-xs">'
		for(var j = 0; j < xianjingliu.data.CF_Cash[i].acctCodeLinkCashFlowProject.length; j++) {
			xianjingstr += '<li levNum = "'+xianjingliu.data.CF_Cash[i].acctCodeLinkCashFlowProject[j].LEVEL_NUM+'" name="' + xianjingliu.data.CF_Cash[i].acctCodeLinkCashFlowProject[j].CHR_CODE + '" class="click' + xianjingliu.data.CF_Cash[i].acctCodeLinkCashFlowProject[j].IS_LEAF + ' leave' + xianjingliu.data.CF_Cash[i].acctCodeLinkCashFlowProject[j].LEVEL_NUM + ' jiedai' + xianjingliu.data.CF_Cash[i].acctCodeLinkCashFlowProject[j].INOUT_TYPE + ' pro unselected">'
			xianjingstr += '<p>' + xianjingliu.data.CF_Cash[i].acctCodeLinkCashFlowProject[j].CASHFLOW_NAME + '</p>'
			xianjingstr += '</li>'
		}
		xianjingstr += '</ul>'
		xianjingstr += '</div>'
		xianjingstr += '<div class="xianjing-body-bottom-body-je">'
		xianjingstr += '<input type="text" class="xianjing-body-bottom-body-je-sr" />'
		xianjingstr += '<div class="xianjing-body-bottom-body-je-xs"></div>'
		xianjingstr += '</div>'
		xianjingstr += '<div class="xianjing-body-bottom-body-cz"><span class="xianjing-body-bottom-body-delect icon-trash "></span><span class="xianjing-body-bottom-body-cai icon-node  "></span></div>'
		xianjingstr += '</div>'
	}
	xianjingstr += '</div>'
	xianjingstr += '<div class="xianjing-foot">'
	xianjingstr += '<div class="btn-xianjing-close">取消</div>'
	xianjingstr += '<div class="btn-xianjing-submit">确认</div>'
	xianjingstr += '</div>'
	xianjingstr += '</div>'
//	$("#cashflow-show").show();
	$("#cashflow-show").html(xianjingstr);
	var topr = 0;
	for(var i = 0; i < $(".xianjing-body-top-center").length; i++) {
		if($(".xianjing-body-top-center").eq(i).find(".xianjing-body-top-jd").text() == "借方") {
			topr += parseFloat($(".xianjing-body-top-center").eq(i).find(".xianjing-body-top-je").text());
		} else {
			topr -= parseFloat($(".xianjing-body-top-center").eq(i).find(".xianjing-body-top-je").text());
		}
	}
	$(".xianjing-body-top").find("p").css("color", "green");
	for(var i = 0; i < xianjingliu.data.CF_Cash.length; i++) {
		$(".xianjing-body-bottom-body-je-sr").eq(i).val(parseFloat(xianjingliu.data.CF_Cash[i].stadAmt).toFixed(2));
		$(".xianjing-body-bottom-body-je-xs").eq(i).text(formatNum(parseFloat(xianjingliu.data.CF_Cash[i].stadAmt).toFixed(2)));
		for(var j = 0; j < xianjingliu.data.CF_Cash[i].acctCodeLinkCashFlowProject.length; j++) {
			if(xianjingliu.data.CF_Cash[i].cashflowCode == xianjingliu.data.CF_Cash[i].acctCodeLinkCashFlowProject[j].CHR_CODE) {
				$(".xianjing-body-bottom-body-xj-sr").eq(i).val(xianjingliu.data.CF_Cash[i].acctCodeLinkCashFlowProject[j].CASHFLOW_NAME);
				$(".xianjing-body-bottom-body-xj-sr").eq(i).attr("title",xianjingliu.data.CF_Cash[i].acctCodeLinkCashFlowProject[j].CASHFLOW_NAME);
			}

		}
		for(var k = 0; k < $(".xianjing-body-bottom-body-xj-xs").eq(i).find("li").length; k++) {
			if($(".xianjing-body-bottom-body-xj-xs").eq(i).find("li").eq(k).attr("name") == xianjingliu.data.CF_Cash[i].cashflowCode) {
				$(".xianjing-body-bottom-body-xj-xs").eq(i).find("li").eq(k).removeClass("unselected").addClass("selected");
			}
		}
	}
	checkVouAmt();
}


var xianjingliu = new Object();

$(document).on("click", "#xianjing", function(e) {
	stopPropagation(e)
})
$(document).on("click", ".xianjing-close", function(e) {
	$("#cashflow-show").html('')
	$("#cashflow-show").hide();
})
$(document).on("keyup", ".xianjing-body-bottom-body-je-sr", function() {
	var c = $(this);
	if(/[^\d.]/.test(c.val())) { //替换非数字字符  
		var temp_amount = c.val().replace(/[^\d.-]/g, '');
		$(this).val(temp_amount);
	}
})
$(document).on("click", ".xianjing-body-bottom-body-je-xs", function() {
	$(this).hide();
	$(this).prev(".xianjing-body-bottom-body-je-sr").show();
	$(this).prev(".xianjing-body-bottom-body-je-sr").focus().select();
})
$(document).on("blur", ".xianjing-body-bottom-body-je-sr", function() {
	$(this).hide();
	if(!isNumber($(this).val())){
		$(this).val("0.00")
	}
	if($(this).val() == "") {
		$(this).val("0.00")
	} else {
		$(this).val(parseFloat($(this).val()).toFixed(2))
	}
	$(this).next(".xianjing-body-bottom-body-je-xs").show();
	$(this).next(".xianjing-body-bottom-body-je-xs").text(formatNum($(this).val()));
	checkVouAmt();
})

$(document).on("input", ".xianjing-body-bottom-body-je-sr", function() {
	if($(".voucher-head").attr("namess") != undefined) {
		$(".btn-xianjing-submit").attr("names", "修改")
	}
})
$(document).on('keydown', ".xianjing-body-bottom-body-je-sr", function(event) {
	event = event || window.event;
	var keyCode = event.keyCode
	if(!isNumber(keyCode, event)) return false
	if(keyCode == 13) {
		$(this).hide();
		$(this).next(".xianjing-body-bottom-body-je-xs").show();
		$(this).next(".xianjing-body-bottom-body-je-xs").text(formatNum($(this).val()));
	}
	if(keyCode == 61) {
		$(this).val("0.00");
		$(this).next(".xianjing-body-bottom-body-je-xs").text(formatNum($(this).val()));
		var topr = 0;
		for(var i = 0; i < $(".xianjing-body-top-center").length; i++) {
			if($(".xianjing-body-top-center").eq(i).find(".xianjing-body-top-jd").text() == "借方") {
				topr += parseFloat($(".xianjing-body-top-center").eq(i).find(".xianjing-body-top-je").text());
			} else {
				topr -= parseFloat($(".xianjing-body-top-center").eq(i).find(".xianjing-body-top-je").text());
			}
		}
		var bottomr = 0;
		for(var i = 0; i < $(".xianjing-body-bottom-body").length; i++) {
			if($(".xianjing-body-bottom-body").eq(i).find(".xianjing-body-bottom-body-xj-xs").find(".selected").hasClass("jiedai1")) {
				bottomr += parseFloat($(".xianjing-body-bottom-body").eq(i).find(".xianjing-body-bottom-body-je-sr").val());
			} else {
				bottomr -= parseFloat($(".xianjing-body-bottom-body").eq(i).find(".xianjing-body-bottom-body-je-sr").val());
			}
		}
		if(topr - bottomr == 0) {
			$(this).val(0);
		} else if(topr - bottomr > 0) {
			if($(this).parents(".xianjing-body-bottom-body").find(".xianjing-body-bottom-body-xj-xs").find(".selected").hasClass("jiedai1")) {
				$(this).val((topr - bottomr).toFixed(2))
			} else {
				$(this).val((bottomr - topr).toFixed(2))
			}
		} else if(topr - bottomr < 0) {
			if($(this).parents(".xianjing-body-bottom-body").find(".xianjing-body-bottom-body-xj-xs").find(".selected").hasClass("jiedai1")) {
				$(this).val((topr - bottomr).toFixed(2))
			} else {
				$(this).val((bottomr - topr).toFixed(2))
			}
		}
		return false;
	}
	if(keyCode == 187) {
		$(this).val("0.00");
		$(this).next(".xianjing-body-bottom-body-je-xs").text(formatNum($(this).val()));
		var topr = 0;
		for(var i = 0; i < $(".xianjing-body-top-center").length; i++) {
			if($(".xianjing-body-top-center").eq(i).find(".xianjing-body-top-jd").text() == "借方") {
				topr += parseFloat($(".xianjing-body-top-center").eq(i).find(".xianjing-body-top-je").text());
			} else {
				topr -= parseFloat($(".xianjing-body-top-center").eq(i).find(".xianjing-body-top-je").text());
			}
		}
		var bottomr = 0;
		for(var i = 0; i < $(".xianjing-body-bottom-body").length; i++) {
			if($(".xianjing-body-bottom-body").eq(i).find(".xianjing-body-bottom-body-xj-xs").find(".selected").hasClass("jiedai1")) {
				bottomr += parseFloat($(".xianjing-body-bottom-body").eq(i).find(".xianjing-body-bottom-body-je-sr").val());
			} else {
				bottomr -= parseFloat($(".xianjing-body-bottom-body").eq(i).find(".xianjing-body-bottom-body-je-sr").val());
			}
		}
		if(topr - bottomr == 0) {
			$(this).val(0);
		} else if(topr - bottomr > 0) {
			if($(this).parents(".xianjing-body-bottom-body").find(".xianjing-body-bottom-body-xj-xs").find(".selected").hasClass("jiedai1")) {
				$(this).val((topr - bottomr).toFixed(2))
			} else {
				$(this).val((bottomr - topr).toFixed(2))
			}
		} else if(topr - bottomr < 0) {
			if($(this).parents(".xianjing-body-bottom-body").find(".xianjing-body-bottom-body-xj-xs").find(".selected").hasClass("jiedai1")) {
				$(this).val((topr - bottomr).toFixed(2))
			} else {
				$(this).val((bottomr - topr).toFixed(2))
			}
		}
		return false;
	}
})
$(document).on("click", ".xianjing-body-bottom-body-xj-sr", function() {
	lastfocus = $(this);
	$(this).focus().select();
	$(".xianjing-body-bottom-body-xj-xs").hide();
	$(this).next(".xianjing-body-bottom-body-xj-xs").show();
	if($(".voucher-head").attr("namess") != undefined) {
		$(".btn-xianjing-submit").attr("names", "修改")
	}
})
function isNumber(val) {
    var regPos = /^\d+(\.\d+)?$/; //非负浮点数
    var regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/; //负浮点数
    if(regPos.test(val) || regNeg.test(val)) {
    	return true;
    } else {
    	return false;
    }
}
$(document).on("blur", ".xianjing-body-bottom-body-xj-sr", function() {
	_this = $(this);
	dingsq = setTimeout(function() {
		_this.next(".xianjing-body-bottom-body-xj-xs").hide(100);
	}, 200)
})
$(document).on("click", ".xianjing-body-bottom-body-xj-xs .click1", function() {
	$(this).parents(".xianjing-body-bottom-body-xj-xs").find("li").addClass("unselected").removeClass("selected");
	$(this).addClass("selected").removeClass("unselected");
	$(this).parents(".xianjing-body-bottom-body-xj-xs").prev(".xianjing-body-bottom-body-xj-sr").val($(this).find("p").text());
	$(this).parents(".xianjing-body-bottom-body-xj-xs").prev(".xianjing-body-bottom-body-xj-sr").attr("title",$(this).find("p").text());
	$(this).parents(".xianjing-body-bottom-body-xj-xs").hide();
	checkVouAmt();
})
$(document).on("click", ".xianjing-body-bottom-body-xj-xs .click0", function() {
	clearTimeout(dingsq);
	var _this = $(this)
	var str = _this.attr('name')
	var lvnum =parseFloat(_this.attr('levNum')) + 1
	if(_this.find('p').hasClass('sq') != true) {
		_this.find('p').addClass('sq')
	} else if(_this.find('p').hasClass('sq')) {
		_this.find('p').removeClass('sq')
	}
	for(var i = 0; i < _this.nextAll('li').length; i++) {
		var strnex = _this.nextAll('li').eq(i).attr('name')
		if(strnex != undefined && strnex.substring(0, str.length) == str) {
			if(_this.find('p').hasClass('sq')) {
				_this.nextAll('li').eq(i).hide().removeClass('pro').addClass('noselected')
			} else {
				var lvnums = _this.nextAll('li').eq(i).attr('levNum')
				if(lvnums == lvnum) {
					_this.nextAll('li').eq(i).show().addClass('pro').removeClass('noselected')
					if(_this.nextAll('li').eq(i).hasClass('clik0')) {
						_this.nextAll('li').eq(i).find('p').addClass('sq')
					}
				} else {
					_this.nextAll('li').eq(i).hide().removeClass('pro').addClass('noselected')
				}
			}
		} else if(strnex != undefined && strnex.substring(0, str.length) != str) {
			break;
		}
	}
	lastfocus.focus().select();
})

$(document).on("input", ".xianjing-body-bottom-body-xj-sr", function() {
	//scrollTop重置为0
	$(this).next(".xianjing-body-bottom-body-xj-xs").animate({
		scrollTop: 0
	}, 0);
	inde = 0;
	//清除所有的selected并添加unselected;
	$(this).next(".xianjing-body-bottom-body-xj-xs").find("li").removeClass("selected").addClass("unselected");
	for(var i = 0; i < $(this).next(".xianjing-body-bottom-body-xj-xs").find(".pro").length; i++) {
		$(this).next(".xianjing-body-bottom-body-xj-xs").find(".pro").eq(i).index = i;
	}
	//确保下拉框显示
	$(this).next(".xianjing-body-bottom-body-xj-xs").show()
	//遍历循环模糊查询
	for(var i = 0; i < $(this).next(".xianjing-body-bottom-body-xj-xs").find("li").length; i++) {
		if($(this).val() == "") {
			$(this).next(".xianjing-body-bottom-body-xj-xs").find("li").eq(i).removeClass("noselected").addClass("pro");
		} else {
			var tempStr = $(this).next(".xianjing-body-bottom-body-xj-xs").find("li").eq(i).text();
			var bool = tempStr.indexOf($(this).val());
			if(bool >= 0) {
				var tempStr = $(this).next(".xianjing-body-bottom-body-xj-xs").find("li").eq(i).removeClass("noselected").addClass("pro");
			} else {
				var tempStr = $(this).next(".xianjing-body-bottom-body-xj-xs").find("li").eq(i).addClass("noselected").removeClass("pro");

			}
		}

	}
	for(var i = 0; i < $(this).next(".xianjing-body-bottom-body-xj-xs").find(".pro").length; i++) {
		if($(this).next(".xianjing-body-bottom-body-xj-xs").find(".pro").eq(i).hasClass("clik1")) {
			$(this).next(".xianjing-body-bottom-body-xj-xs").find(".pro").eq(i).removeClass("unselected").addClass("selected");
			inde = i;
			break;
		}
	}
	//当模糊查询所有内容都不符合的时候,出现新增科目选项
	if($(this).next(".xianjing-body-bottom-body-xj-xs").find(".pro").length == 0) {
		$(".bukedian").show();
		$(".xzkjkm").show();
	} else {
		$(".bukedian").hide();
		$(".xzkjkm").hide();
	}
})
$(document).on("click", ".xianjing-body-bottom-body-delect", function() {
	var selectDetail = $(this).parents(".xianjing-body-bottom-body").attr("dg");
	var index = 0;
	for(var i = 0; i < $(".xianjing-body-bottom-body").length; i++) {
		var detailGuid = $(".xianjing-body-bottom-body").eq(i).attr("dg");
		if(selectDetail == detailGuid){
			index++;
		}
	}
	if(index <= 1){
		ufma.showTip("一条分录至少保留一条数据", function() {}, "error");
	}else{
		$(this).parents(".xianjing-body-bottom-body").remove();
		checkVouAmt()
	}
})
$(document).on("click", ".xianjing-body-bottom-body-cai", function() {
	var caiss = ''
	caiss += '<div class="xianjing-body-bottom-body" dg="' + $(this).parents(".xianjing-body-bottom-body").attr("dg") + '">'
	caiss += $(this).parents(".xianjing-body-bottom-body").html();
	caiss += '</div>'
	$(this).parents(".xianjing-body-bottom-body").after(caiss);
	$(this).parents(".xianjing-body-bottom-body").next(".xianjing-body-bottom-body").find(".xianjing-body-bottom-body-je-sr").val("0.00");
	$(this).parents(".xianjing-body-bottom-body").next(".xianjing-body-bottom-body").find(".xianjing-body-bottom-body-je-xs").text("0.00");
	$(this).parents(".xianjing-body-bottom-body").next(".xianjing-body-bottom-body").find(".xianjing-body-bottom-body-xj-sr").val($(this).parents(".xianjing-body-bottom-body").find(".xianjing-body-bottom-body-xj-sr").val());
	checkVouAmt()
})
$(document).on("click", ".btn-xianjing-submit", function() {
	submit();
})
function checkVouAmt(){
	var xianjingdata = new Object();
	var xianjingdatas = new Array();
	if($(".xianjing-body-bottom-body").length>0){
		for(var i = 0; i < $(".xianjing-body-bottom-body").length; i++) {
			var xjss = new Object();
			xjss.detailGuid = $(".xianjing-body-bottom-body").eq(i).attr("dg");
			xjss.agencyCode = xianjingliu.data.CF_Cash[0].agencyCode;
			xjss.fisPerd = xianjingliu.data.CF_Cash[0].fisPerd;
			if($(".xianjing-body-bottom-body").eq(i).find(".xianjing-body-bottom-body-jd").text() == "借方") {
				xjss.drCr = 1;
			} else {
				xjss.drCr = -1;
			}
			xjss.rgCode = xianjingliu.data.CF_Cash[0].rgCode
			xjss.setYear = xianjingliu.data.CF_Cash[0].setYear
			if($(".xianjing-body-bottom-body").eq(i).find(".xianjing-body-bottom-body-je-sr").val() == "") {
				xjss.stadAmt = $(".xianjing-body-bottom-body").eq(i).find(".xianjing-body-bottom-body-je-sr").val();
			} else {
				xjss.stadAmt = $(".xianjing-body-bottom-body").eq(i).find(".xianjing-body-bottom-body-je-sr").val();
			}
			xjss.vouDate = xianjingliu.data.CF_Cash[0].vouDate
			xjss.vouGuid = xianjingliu.data.CF_Cash[0].vouGuid
			xjss.vouNo = xianjingliu.data.CF_Cash[0].vouNo
			xjss.vouSeq = $(".xianjing-body-bottom-body").eq(i).find(".xianjing-body-bottom-body-flxh").html();
			xjss.cashflowSeq = i + 1;
			if($(".btn-xianjing-body-hover").text() == "对方科目") {
				xjss.assignType = -1;
			} else {
				xjss.assignType = 1
			}
			xjss.fisPerd = fisperd;
			xjss.rgCode = selectdata.data.rgCode;
			xjss.setYear = selectdata.data.setYear;
			xjss.vouDate = selectdata.data.vouDate;
			xjss.vouGuid = selectdata.data.vouGuid;
			xjss.vouNo = selectdata.data.vouNo;
			xjss.agencyCode = selectdata.data.agencyCode;
			xjss.accoCode = $(".xianjing-body-bottom-body").eq(i).find(".coded").text();
			xjss.cashflowCode = $(".xianjing-body-bottom-body").eq(i).find(".selected").attr("name");
			xianjingdatas.push(xjss);
		}
	}	
	$.ajax({
		type: "post",
		url: "/gl/vou/checkCashFlowAmt" + "?ajax=1",
		async: false,
		data: JSON.stringify(xianjingdatas),
		contentType: 'application/json; charset=utf-8',
		success: function(result) {
			for(var i = 0;i<$('.xianjing-body-top-detailid').length;i++){
				var flag = false;
				for(var j = 0;j<result.data.length;j++){
					if($('.xianjing-body-top-detailid').eq(i).html() == result.data[j]){
						flag = true;
					}
				}
				if(flag){
					$('.xianjing-body-top-je').eq(i).find('span').addClass('jine-red');
				}else{
					$('.xianjing-body-top-je').eq(i).find('span').removeClass('jine-red');
				}
			}
		},
		error: function() {
			ufma.showTip("校验失败", function() {}, "error");
		}
	});
}

function submit(){
	var xianjingdata = new Object();
	var xianjingdatas = new Array();
	var zeroJeRowNumArray = new Array();
	if($(".xianjing-body-bottom-body").length>0){
		for(var i = 0; i < $(".xianjing-body-bottom-body").length; i++) {
			var xjss = new Object();
			xjss.detailGuid = $(".xianjing-body-bottom-body").eq(i).attr("dg");
			xjss.agencyCode = xianjingliu.data.CF_Cash[0].agencyCode;
			xjss.fisPerd = xianjingliu.data.CF_Cash[0].fisPerd;
			if($(".xianjing-body-bottom-body").eq(i).find(".xianjing-body-bottom-body-jd").text() == "借方") {
				xjss.drCr = 1;
			} else {
				xjss.drCr = -1;
			}
			xjss.rgCode = xianjingliu.data.CF_Cash[0].rgCode
			xjss.setYear = xianjingliu.data.CF_Cash[0].setYear
			if($(".xianjing-body-bottom-body").eq(i).find(".xianjing-body-bottom-body-je-sr").val() == "") {
				xjss.stadAmt = $(".xianjing-body-bottom-body").eq(i).find(".xianjing-body-bottom-body-je-sr").val();
			} else {
				xjss.stadAmt = $(".xianjing-body-bottom-body").eq(i).find(".xianjing-body-bottom-body-je-sr").val();
			}
			if(parseFloat(xjss.stadAmt) == 0){
				zeroJeRowNumArray.push(i+1);
			}
			xjss.vouDate = xianjingliu.data.CF_Cash[0].vouDate
			xjss.vouGuid = xianjingliu.data.CF_Cash[0].vouGuid
			xjss.vouNo = xianjingliu.data.CF_Cash[0].vouNo
			xjss.vouSeq = $(".xianjing-body-bottom-body").eq(i).find(".xianjing-body-bottom-body-flxh").html();
			xjss.cashflowSeq = i + 1;
			if($(".btn-xianjing-body-hover").text() == "对方科目") {
				xjss.assignType = -1;
			} else {
				xjss.assignType = 1
			}
			xjss.fisPerd = fisperd;
			xjss.rgCode = selectdata.data.rgCode;
			xjss.setYear = selectdata.data.setYear;
			xjss.vouDate = selectdata.data.vouDate;
			xjss.vouGuid = selectdata.data.vouGuid;
			xjss.vouNo = selectdata.data.vouNo;
			xjss.agencyCode = selectdata.data.agencyCode;
			xjss.acctCode = selectdata.data.acctCode;
			xjss.accoCode = $(".xianjing-body-bottom-body").eq(i).find(".coded").text();
			xjss.cashflowCode = $(".xianjing-body-bottom-body").eq(i).find(".selected").attr("name");
			xianjingdatas.push(xjss);
		}
	}
	if(zeroJeRowNumArray.length > 0){
		var msg = "第";
		for(var i = 0;i<zeroJeRowNumArray.length;i++){
			if(i == zeroJeRowNumArray.length-1){
				msg += zeroJeRowNumArray[i];
			}else{
				msg += zeroJeRowNumArray[i]+",";
			}
		}
		msg += "行现金流量项目金额为0，是否继续保存？";
		ufma.confirm(msg, function(action) {
			if(action){
				commitSaveBeforeCheck(xianjingdatas);
			}
		});
	}else{
		commitSaveBeforeCheck(xianjingdatas);
	}
	
}

function commitSaveBeforeCheck(xianjingdatas){
	//等于零时执行删除
	if(xianjingdatas.length == 0){
		var vouGuidkey = $(".voucher-head").attr("namess");
		$.ajax({
			type: "get",
			url: "/gl/vou/delCashflow/" + vouGuidkey + "?ajax=1",
			async: false,
			success: function(data) {
				if(data.flag == "success") {
					_close(1,'删除成功');
				} else {
					_close(-1,data.msg);
				}
			},
			error: function() {
				ufma.showTip("连接失败，请检查网络", function() {}, "error")
			}
		});
		return;
	}
	$.ajax({
		type: "post",
		url: "/gl/vou/checkCashflow" + "?ajax=1",
		async: false,
		data: JSON.stringify(xianjingdatas),
		contentType: 'application/json; charset=utf-8',
		success: function(data) {
			if(data.flag == 1){
				commitSave(xianjingdatas);
			}else if(data.flag == -1){
				ufma.showTip(data.msg, function() {}, "error");
			}else if(data.flag == 0){
				ufma.confirm(data.msg, function(action) {
					if(action){
						commitSave(xianjingdatas);
					}
				});
			}
		},
		error: function() {
			ufma.showTip("校验失败", function() {}, "error");
		}
	});
		
}

function commitSave(xianjingdatas){
	$.ajax({
		type: "post",
		url: "/gl/vou/addCashflow" + "?ajax=1",
		async: false,
		data: JSON.stringify(xianjingdatas),
		contentType: 'application/json; charset=utf-8',
		success: function(data) {
			if(data.flag == "success") {
				_close(1,'保存成功');
			} else {
				_close(-1,data.msg);
			}
		},
		error: function() {
			ufma.showTip("保存失败", function() {}, "error")
			_close(0,0);
		}
	});
}
$(document).on("click", ".btn-xianjing-close", function() {
	if($(this).hasClass("btn-disablesd") != true) {
		$(this).addClass("btn-disablesd");
		if($(".btn-xianjing-submit").attr("names") != undefined) {
			ufma.confirm('是否更新现金流量', function(action) {
				if(action) {
					submit();
				} else {
					_close(0,0);
				}
			});
		} else {
			_close(0,0);
		}
		$(this).removeClass("btn-disablesd");
	}
})

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

function stopPropagation(e) {
	if(e.stopPropagation)
		e.stopPropagation();
	else
		e.cancelBubble = true;
}

window._close = function (state, data) {
	if (window.closeOwner) {
		var data = {
			action: state,
			result: data
		};
		window.closeOwner(data);
	}
}
