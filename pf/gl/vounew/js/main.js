var rpt = {};
rpt.portList = {
	agencyList: "/gl/eleAgency/getAgencyTree", //单位列表接口
	acctList: "/gl/eleCoacc/getRptAccts" //账套列表接口
};
if (getUrlParam("action") == "preview") {
	ifForIndex = false
	$('body').addClass('fontsmall')
	$('.voucher-beizhu').hide()
	$('.voucher-history').hide()
	$(".btn-showleft").hide()
	//	$("#rightbg").hide()
	$(".btn-bgfj").hide()
	$(".chaiwu").css('margin-top', '-50px')
	$(".yusuan").css('margin-top', '-50px')
	$("#pzlrbt").hide()
	$("#cbAgency").hide()
	$("#cbAcct").hide()
	$('.voucherxz').css({
		'border': '0px solid #fff'
	})
	$(".voucherkj").hide()
	$(".voucherqh").hide()
	$("#showMethodTip").css({
		'top': '52px',
		'z-index': '11'
	})
	$("#vouHangup").css({
		'top': '53px',
		'z-index': '11'
	})
	$(".voucherall").css('margin-top', '-50px')
} else {
	rpt.nowAgencyCode = ufgovkey.svAgencyCode; //登录单位代码
	rpt.nowAgencyName = ufgovkey.svAgencyName; //登录单位名称
	rpt.nowAcctCode = ufgovkey.svAcctCode; //账套代码
	rpt.nowAcctName = ufgovkey.svAcctName; //账套名称
}
if (getUrlParam("agencyCode") != undefined && getUrlParam("agencyCode") != null) {
	rpt.nowAgencyCode = getUrlParam("agencyCode")
}
if (getUrlParam("acctCode") != undefined && getUrlParam("acctCode") != null) {
	rpt.nowAcctCode = getUrlParam("acctCode")
}
rpt.isParallel = 0; //是否平行记账，0：否，没有预算会计页签，1：是，
rpt.createUser = ""; //账套创建人
rpt.cbAgency = $("#cbAgency").ufmaTreecombox2({
	valueField: 'id',
	textField: 'codeName',
	readonly: false,
	placeholder: '请选择单位',
	icon: 'icon-unit',
	onchange: function (data) {
		//给全局单位变量赋值
		rpt.nowAgencyCode = data.id;
		rpt.nowAgencyName = data.name;
		rpt.AgencyTypeCode = data.agencyType;
		//请求账套列表
		rpt.reqAcctList();
		prevnextvoucher = -1;
		if (rpt.isParallel != "1") {
			$(".chaiwu").hide();
			$(".yusuan").hide();
		} else {
			$(".chaiwu").show();
			$(".yusuan").show();
		}
		//刚开始打开的时候读取是否显示凭证号带期间，初始化需求
		ufma.ajaxDef("/gl/vou/getSysRuleSet/" + rpt.nowAgencyCode + "?chrCodes=GL001,GL005,GL002,GL011,GL012,GL010,GL026,GL028,GL038,GL035,GL044,GL046,GL047,GL050,GL051,GL052,GL053,GL054,GL059,GL061", 'get', "", function (data) {
			isauditbiaocuo = data.data.GL001
			isInputor = data.data.GL005; //禁止修改他人编制的凭证
			onlyVoidCanDel = data.data.GL002; //只能删除作废的凭证
			isAddVou = data.data.GL011; //上期未结账则不允许做本期凭证
			isAuditVou = data.data.GL012; //上期未结账则不允许审核本期凭证
			isvousourceclick = data.data.GL010; //是否允许修改子系统
			isfispredvouno = data.data.GL028;
			isVouDel = data.data.GL038;
			isHistoryfzhs = data.data.GL035;
			isbussDate = data.data.GL044;
			isabstract = data.data.GL046;
			isaddAssbtn = data.data.GL047;
			erristext = data.data.GL050;
			iszerofjd = data.data.GL051;
			iscancelshenhe = data.data.GL052;
			isdeljizang = data.data.GL053;
			isAssnullSave = data.data.GL054;
			isAssRemark = data.data.GL059;
			isprintlp = data.data.GL061;
			if (ifForIndex != true) {
				isvousourceclick = true
			}
			if (data.data.GL026 == true) {
				//显示挂接按钮
				$('#vouHangup').show();
			} else if (data.data.GL026 == false) {
				$('#vouHangup').hide();
			}
		});
		var params = {
			selAgecncyCode: rpt.nowAgencyCode,
			selAgecncyName: rpt.nowAgencyName,
			selAcctCode: rpt.nowAcctCode,
			selAcctName: rpt.nowAcctName
		}
		ufma.setSelectedVar(params);
		setInterval(function () {
			ufma.get("/gl/vou/requestQueryCheck", "", function (data) { });
		}, 300000)
		curexratefzhsxl = {}
	}
});
rpt.cbAcct = $("#cbAcct").ufmaCombox2({
	valueField: 'id',
	textField: 'codeName',
	readOnly: false,
	placeholder: '请选择账套',
	icon: 'icon-book',
	onchange: function (data) {
		//给全局账套变量赋值
		rpt.isDoubleVou = data.isDoubleVou
		rpt.nowAcctCode = data.code;
		rpt.nowAcctName = data.name;
		rpt.isParallel = data.isParallel
		var params = {
			selAgecncyCode: rpt.nowAgencyCode,
			selAgecncyName: rpt.nowAgencyName,
			selAcctCode: rpt.nowAcctCode,
			selAcctName: rpt.nowAcctName
		}
		ufma.setSelectedVar(params);
		$(".voucherleft").hide();
		// ufma.ajaxDef("/gl/vou/getAccoBal/" + rpt.nowAgencyCode +"/"+rpt.nowAcctCode, "get","",function(data) {
		// 	voubalance = data.data;
		// });
		ufma.ajaxDef('/pub/user/menu/config/select?agencyCode=' + rpt.nowAgencyCode + '&acctCode=' + rpt.nowAcctCode + '&menuId=f24c3333-9799-439a-94c9-f0cdf120305d', "get", '', function (data) {
			nowvoutype = data.data.voutype
			if (data.data.vouisdouble == 1) {
				if ($("#vouislrud").hasClass('zys')) {
					$("#vouislrud").find('#vouisdoublesingle').prop('checked', true).attr('checked', true)
					$("#vouislrud").find('#vouisdoublesingles').prop('checked', false).attr('checked', false)
				} else {
					$("#vouislrud").addClass('zys')
					$("#vouislrud").find('#vouisdoublesingle').prop('checked', true).attr('checked', true)
					$("#vouislrud").find('#vouisdoublesingles').prop('checked', false).attr('checked', false)
				}
			} else {
				if ($("#vouislrud").hasClass('zys')) {
					$("#vouislrud").removeClass('zys')
					$("#vouislrud").find('#vouisdoublesingles').prop('checked', true).attr('checked', true)
					$("#vouislrud").find('#vouisdoublesingle').prop('checked', false).attr('checked', false)
				}
			}
			if (data.data.vouisfullname == 1) {
				isaccfullname = true
				$("#vouisfullname").find('#vouisfullnamesingle').prop('checked', true).attr('checked', true)
				$("#vouisfullname").find('#vouisfullnamesingles').prop('checked', false).attr('checked', false)
			} else {
				isaccfullname = false
				$("#vouisfullname").find('#vouisfullnamesingle').prop('checked', false).attr('checked', false)
				$("#vouisfullname").find('#vouisfullnamesingles').prop('checked', true).attr('checked', true)
			}
			if (data.data.vouisvaguesearch == 1) {
				$("#vouisvaguesearch").prop('checked', true).attr('checked', true)
				$("#vouisvaguesearchs").prop('checked', false).attr('checked', false)
				vouisvague = false
			} else {
				$("#vouisvaguesearchs").prop('checked', true).attr('checked', true)
				$("#vouisvaguesearch").prop('checked', false).attr('checked', false)
				vouisvague = true
			}
			if (data.data.vouiscopyprevAss == 1) {
				$("#vouiscopyprevAsss").prop('checked', false).attr('checked', false)
				$("#vouiscopyprevAss").prop('checked', true).attr('checked', true)
				vouiscopyprevAss = true
			} else {
				$("#vouiscopyprevAsss").prop('checked', true).attr('checked', true)
				$("#vouiscopyprevAss").prop('checked', false).attr('checked', false)
				vouiscopyprevAss = false
			}
			if (data.data.vouisaddDate == 1) {
				$("#vouisaddDaten").prop('checked', false).attr('checked', false)
				$("#vouisaddDatey").prop('checked', true).attr('checked', true)
				vouisaddDate = true
			} else {
				$("#vouisaddDaten").prop('checked', true).attr('checked', true)
				$("#vouisaddDatey").prop('checked', false).attr('checked', false)
				vouisaddDate = false
			}
			if (data.data.defalultOpen == 1) {
				$("#defalultOpen").prop('checked', false).attr('checked', false)
				$("#defalultOpenNo").prop('checked', true).attr('checked', true)
				isdefaultopen = true
			} else {
				$("#defalultOpenNo").prop('checked', true).attr('checked', true)
				$("#defalultOpen").prop('checked', false).attr('checked', false)
				isdefaultopen = false
			}
		})
		if (data.isParallel == '1' && data.isDoubleVou == '1') {
			rpt.isParallel = 1
			vousinglepz = false
			$('.vouisdouble').hide()
		} else if (data.isParallel == '1' && data.isDoubleVou == '0') {
			rpt.isParallel = 1
			vousinglepz = true
			$('.vouisdouble').show()
		} else if (data.isParallel == '0') {
			rpt.isParallel = 0
			vousinglepz = false
			$('.vouisdouble').hide()
		}
		rpt.createUser = data.fiLeader;
		if ($("#vouislrud").hasClass('zys') && data.isParallel == '1' && data.isDoubleVou == '0') {
			vousinglepzzy = true
			vousinglepz = false
		} else {
			vousinglepzzy = false
		}
		//		vouboxtrue = false;
		if (rpt.isParallel == "1") {
			$(".chaiwu").show();
			$(".yusuan").show();
		} else {
			$(".chaiwu").hide();
			$(".yusuan").hide();
		}
		// setTimeout(function () {
			if (vousinglepz == true) {
				$(".chaiwu").hide();
				$(".yusuan").hide();
			} else if (vousinglepzzy == true) {
				$(".chaiwu").hide();
				$(".yusuan").hide();
			}
			var accacodes = '';
			if ($('.chaiwu').css('display') != 'none') {
				accacodes = '1'
				ufma.ajaxDef("/gl/eleVouType/getVouType/" + rpt.nowAgencyCode + "/" + ufgovkey.svSetYear + "/" + rpt.nowAcctCode + "/" + accacodes, "get", '', function (data) {
					danweinamec = data.data;
				})
			}
			if ($('.yusuan').css('display') != 'none') {
				accacodes = '2'
				ufma.ajaxDef("/gl/eleVouType/getVouType/" + rpt.nowAgencyCode + "/" + ufgovkey.svSetYear + "/" + rpt.nowAcctCode + "/" + accacodes, "get", '', function (data) {
					danweinamey = data.data;
				})
			}
			if (vousinglepzzy == true || $('.yusuan').css('display') == 'none') {
				accacodes = '*'
				ufma.ajaxDef("/gl/eleVouType/getVouType/" + rpt.nowAgencyCode + "/" + ufgovkey.svSetYear + "/" + rpt.nowAcctCode + "/" + accacodes, "get", '', function (data) {
					danweinamec = data.data;
				})
			}
			voutypeword()
			MaxVouNoUp()
		// }, 200)
		//获取会计科目，辅助核算，辅助核算顺序，默认范围以及默认辅助项
		var keyss = '*'
		if(getUrlParam("action") != "voumodel"){
			keyss = $("#leftbgselect option:selected").attr("value")
		}
		ufma.ajaxDef("/gl/vou/getAccoAndAccitem/"+ rpt.nowAgencyCode + "/" + rpt.nowAcctCode +"/"+keyss, "get", '', function(data) {
			quanjuvoudatas.data = data.data.accos;
			$("#accounting-container").html(acctaccaall())
			$("#accounting-container-cw").html(acctacca1())
			$("#accounting-container-ys").html(acctacca2())
			tablehead = data.data.tableHead;
			fzhsxl = data.data.optionData;
			accitemOrderSeq = data.data.accitemOrder
		})
		if (rpt.nowAgencyCode != "*") {
			ufma.ajax("/gl/vou/selDesc", "get", { 'descName': '', 'agencyCode': rpt.nowAgencyCode, 'acctCode': rpt.nowAcctCode }, function (data) {
				zaiyao = data;
				var ssr = ''
				for (var i = 0; i < data.data.length; i++) {
					ssr += '<li class="PopListBoxItem unselected" name = "' + data.data[i].assCode + '">' + data.data[i].descName + '</li>'
				}
				$("#abstract-container").html(ssr);
			})
		}
		ufma.ajax("/gl/vou/getAllbgAccItems/" + rpt.nowAgencyCode + "/" + rpt.nowAcctCode, "get", '', function (data) {
			keypandingzhibiao = data.data
		})
		var pagereslist = ufma.getPermission();
		ufma.isShow(pagereslist);
		upadd();
	}
});
//请求单位列表
rpt.reqAgencyList = function () {
	ufma.ajaxDef(rpt.portList.agencyList, "get", "", function (result) {
		var data = result.data;
		rpt.cbAgency = $("#cbAgency").ufmaTreecombox2({
			data: result.data
		});
		var code = data[0].id;
		var name = data[0].name;
		var codeName = data[0].codeName;
		if (JSON.parse(window.sessionStorage.getItem("cacheData")) != null && getUrlParam("dataFrom") == "vouBox" && getUrlParam("action") == "query" || getUrlParam("action") == "add") {
			var keycacheData = JSON.parse(window.sessionStorage.getItem("cacheData"));
			rpt.cbAgency.val(keycacheData.agencyCode);
			rpt.cbAcct.val(keycacheData.acctCode);
			rpt.nowAgencyCode = rpt.cbAgency.getValue();
			rpt.nowAgencyName = rpt.cbAgency.getText();
			rpt.nowAcctCode = rpt.cbAcct.getValue();
			rpt.nowAcctName = rpt.cbAcct.getText();
		} else if (getUrlParam("action") == "preview") {
			if (window.ownerData[0] != null && window.ownerData[0] != '') {
				rpt.cbAgency.val(window.ownerData[0].agencyCode);
				rpt.cbAcct.val(window.ownerData[0].acctCode);
			} else {
				rpt.cbAgency.val(window.ownerData[1].agencyCode);
				rpt.cbAcct.val(window.ownerData[1].acctCode);
			}
			rpt.nowAgencyCode = rpt.cbAgency.getValue();
			rpt.nowAgencyName = rpt.cbAgency.getText();
			rpt.nowAcctCode = rpt.cbAcct.getValue();
			rpt.nowAcctName = rpt.cbAcct.getText();
		} else if (getUrlParam("action") == "voumodel") {
			rpt.cbAgency.val(window.ownerData.agencyCode);
			rpt.cbAcct.val(window.ownerData.acctCode);
			if (window.ownerData.agencyCode == '*') {
				rpt.nowAgencyCode = '*'
			} else {
				rpt.nowAgencyCode = rpt.cbAgency.getValue();
			}
			rpt.nowAgencyName = rpt.cbAgency.getText();
			if (window.ownerData.acctCode == '*') {
				rpt.nowAcctCode = '*'
			} else {
				rpt.nowAcctCode = rpt.cbAcct.getValue();
			}
			rpt.nowAcctName = rpt.cbAcct.getText();
		} else {
			if (rpt.nowAgencyCode != "") {
				var agency = $.inArrayJson(data, 'id', rpt.nowAgencyCode);
				if (agency != undefined) {
					rpt.cbAgency.val(rpt.nowAgencyCode);
				} else {
					rpt.cbAgency.val(code);
				}
			} else {
				rpt.cbAgency.val(code);
			}
		}
	});
};
//账套列表
//请求账套列表
rpt.reqAcctList = function () {
	var acctArgu = {
		"agencyCode": rpt.nowAgencyCode,
		"userId": rpt.nowUserId,
		"setYear": rpt.nowSetYear
	};
	ufma.ajaxDef(rpt.portList.acctList, "get", acctArgu, function (result) {
		var data = result.data;
		rpt.cbAcct = $("#cbAcct").ufmaCombox2({
			data: data
		});
		if (data.length > 0) {
			var code = data[0].id;
			var name = data[0].name;
			var codeName = data[0].codeName;
			if (rpt.nowAcctCode != "" && rpt.nowAcctName != "") {
				var flag = rpt.cbAcct.val(rpt.nowAcctCode);
				if (flag == "undefined") {
					rpt.cbAcct.val(rpt.nowAcctCode);
				} else if (flag == false) {
					rpt.cbAcct.val(code);
				}
			} else {
				rpt.cbAcct.val(code);
			}
		} else {
			ufma.showTip("该单位下没有账套，请重新选择！", function () { }, "warning");
			return false;
		}
	});
};
//账套列表
//请求单位列表
rpt.reqAgencyList();
var xialacode = rpt.nowAgencyCode;
function voutypeword() {
	if ($('.chaiwu').hasClass('xuanzhongcy') && $('.chaiwu').css('display') != 'none') {
		var ss = ''
		for (var i = 0; i < danweinamec.length; i++) {
			ss += '<option value="' + danweinamec[i].code + '">' + danweinamec[i].name + '</option>'
		}
		$("#leftbgselect").html(ss);
	}
	if ($('.yusuan').hasClass('xuanzhongcy') && $('.yusuan').css('display') != 'none') {
		var ss = ''
		for (var i = 0; i < danweinamey.length; i++) {
			ss += '<option value="' + danweinamey[i].code + '">' + danweinamey[i].name + '</option>'
		}
		$("#leftbgselect").html(ss);
	}
	if ($('.yusuan').css('display') == 'none') {
		var ss = ''
		for (var i = 0; i < danweinamec.length; i++) {
			ss += '<option value="' + danweinamec[i].code + '">' + danweinamec[i].name + '</option>'
		}
		$("#leftbgselect").html(ss);
	}
	for (var i = 0; i < $("#leftbgselect").find("option").length; i++) {
		if ($("#leftbgselect").find("option").eq(i).attr("value") == nowvoutype) {
			$("#leftbgselect").find("option").eq(i).attr("selected", true)
		}
	}
}
//返回正确排序的辅助项对象
function resOrderAccItem(accoCode, accItemArr) {
	var nowAccItemSeq = $.inArrayJson(accitemOrderSeq, 'accoCode', accoCode);
	var orderAccItem = new Object();
	if (nowAccItemSeq != undefined) {
		var accitemList = nowAccItemSeq.accitemList;
		for (var i = 0; i < accitemList.length; i++) {
			if (accitemList[i]["IS_SHOW"] == 1 && accitemList[i]["ACCITEM_CODE"] != "CURRENCY") {
				var str = accitemList[i]["ACCITEM_CODE"];
				var code = tf(str) + "Code";
				orderAccItem[code] = accItemArr[code];
				if (accitemList[i]["ACCITEM_VALUE"] != undefined && orderAccItem[code] != undefined) {
					orderAccItem[code].value = accitemList[i]["ACCITEM_VALUE"]
				}
			}

		}
	}
	return orderAccItem;
}
//返回默认加载但不显示的辅助核算项
function showAccItem(accoCode, accItemArr) {
	var nowAccItemSeq = $.inArrayJson(accitemOrderSeq, 'accoCode', accoCode);
	var orderAccItem = {};
	if (nowAccItemSeq != undefined) {
		var accitemList = nowAccItemSeq.accitemList;
		for (var i = 0; i < accitemList.length; i++) {
			if (accitemList[i]["IS_SHOW"] != 1) {
				var str = tf(accitemList[i]["ACCITEM_CODE"]) + "Code";
				var code = accitemList[i]["ACCITEM_VALUE"]
				orderAccItem[str] = code
			}

		}
	}
	var jsonstr = JSON.stringify(orderAccItem);
	return jsonstr;
}
//切换新增状态
function upadd() {
	prevnextvoucher = -1;
	optNoType = 0;
	$("#fjd").val("");
	$("#xiaocuo").hide();
	$("#pzzhuantai").hide().text("").removeAttr("vou-status");
	$("#pzzhuantaiC").hide().text("").removeAttr("vou-status");
	$(".chaiwu").addClass("xuanzhongcy").removeAttr("names");
	$(".yusuan").removeClass("xuanzhongcy").removeAttr("names");
	$("#leftbgselect").prop("disabled", false)
	$("#sppz").removeAttr('vouno')
	quanjuvouchaiwu = {};
	quanjuvouyusuan = {};
	selectdata = {};
	selectdata.data = {};
	$(".datesno").hide();
	$(".voucher").remove();
	vouchecker = '';
	var nowvalue = nowvoutype;
	voucheralls()
	for (var i = 0; i < $("#leftbgselect").find("option").length; i++) {
		if ($("#leftbgselect").find("option").eq(i).attr("value") == nowvalue) {
			$("#leftbgselect").find("option").eq(i).attr("selected", true)
		}
	}
	vouluru();
	$("#vfjz").find("span").text("");
	$("#vfsh").find("span").text("");
	$("#vfzd").find("span").text("").attr('code', '');
	$(".bxd").hide()
	$(".vouSource").text('手工输入');
	closeVouMask()
	if (!vouisaddDate) {
		$("#dates").getObj().setValue(result);
	}
	setTimeout(function () {
		biduiindex()
	}, 100)
}
function acctaccaall() {
	var tr = ''
	page.Codenameacct = {}
	for (var i = 0; i < quanjuvoudatas.data.length; i++) {
		page.Codenameacct[quanjuvoudatas.data[i].accoCode] = i
		if (quanjuvoudatas.data[i].levNum > 0) {
			tr += '<li levNum="' + quanjuvoudatas.data[i].levNum + '" style="display:none;" fname="' + quanjuvoudatas.data[i].accoFullName + '" title="' + quanjuvoudatas.data[i].remark + '" acca="' + quanjuvoudatas.data[i].accaCode + '" name="' + i + '" cashflow="' + quanjuvoudatas.data[i].isCashflow + '" role="' + quanjuvoudatas.data[i].accBal + '" class="unselected leave' + quanjuvoudatas.data[i].levNum + ' clik' + quanjuvoudatas.data[i].isLeaf + ' fuhs' + quanjuvoudatas.data[i].accitemNum + '"><p><span class="ACCO_CODE">' + quanjuvoudatas.data[i].accoCode + '</span> <span class="ACCO_NAME">' + quanjuvoudatas.data[i].accoName + '</span></p><span class="fu">辅</span></li>'
		} else {
			tr += '<li levNum="' + quanjuvoudatas.data[i].levNum + '" fname="' + quanjuvoudatas.data[i].accoFullName + '" title="' + quanjuvoudatas.data[i].remark + '" acca="' + quanjuvoudatas.data[i].accaCode + '" name="' + i + '" cashflow="' + quanjuvoudatas.data[i].isCashflow + '"role="' + quanjuvoudatas.data[i].accBal + '" class="PopListBoxItem unselected leave' + quanjuvoudatas.data[i].levNum + ' clik' + quanjuvoudatas.data[i].isLeaf + ' fuhs' + quanjuvoudatas.data[i].accitemNum + '"><p class="sq"><span class="ACCO_CODE">' + quanjuvoudatas.data[i].accoCode + '</span> <span class="ACCO_NAME">' + quanjuvoudatas.data[i].accoName + '</span></p><span class="fu">辅</span></li>'
		}
	}

	tr += '<li class="bukedian"><p>没有对应的会计科目</p></li>'
	tr += '<li class="xzkjkm"><a >+新增会计科目</a></li>'
	return tr
}
function acctacca1() {
	var tr = ''
	for (var i = 0; i < quanjuvoudatas.data.length; i++) {
		if (quanjuvoudatas.data[i].accaCode == 1) {
			if (quanjuvoudatas.data[i].levNum > 0) {
				tr += '<li levNum="' + quanjuvoudatas.data[i].levNum + '" style="display:none;" fname="' + quanjuvoudatas.data[i].accoFullName + '" title="' + quanjuvoudatas.data[i].remark + '" acca="' + quanjuvoudatas.data[i].accaCode + '" name="' + i + '" cashflow="' + quanjuvoudatas.data[i].isCashflow + '" role="' + quanjuvoudatas.data[i].accBal + '" class="unselected leave' + quanjuvoudatas.data[i].levNum + ' clik' + quanjuvoudatas.data[i].isLeaf + ' fuhs' + quanjuvoudatas.data[i].accitemNum + '"><p><span class="ACCO_CODE">' + quanjuvoudatas.data[i].accoCode + '</span> <span class="ACCO_NAME">' + quanjuvoudatas.data[i].accoName + '</span></p><span class="fu">辅</span></li>'
			} else {
				tr += '<li levNum="' + quanjuvoudatas.data[i].levNum + '" fname="' + quanjuvoudatas.data[i].accoFullName + '" title="' + quanjuvoudatas.data[i].remark + '" acca="' + quanjuvoudatas.data[i].accaCode + '" name="' + i + '" cashflow="' + quanjuvoudatas.data[i].isCashflow + '"role="' + quanjuvoudatas.data[i].accBal + '" class="PopListBoxItem unselected leave' + quanjuvoudatas.data[i].levNum + ' clik' + quanjuvoudatas.data[i].isLeaf + ' fuhs' + quanjuvoudatas.data[i].accitemNum + '"><p class="sq"><span class="ACCO_CODE">' + quanjuvoudatas.data[i].accoCode + '</span> <span class="ACCO_NAME">' + quanjuvoudatas.data[i].accoName + '</span></p><span class="fu">辅</span></li>'
			}
		}
	}
	tr += '<li class="bukedian"><p>没有对应的会计科目</p></li>'
	tr += '<li class="xzkjkm"><a >+新增会计科目</a></li>'
	return tr
}
function acctacca2() {
	var tr = ''
	for (var i = 0; i < quanjuvoudatas.data.length; i++) {
		if (quanjuvoudatas.data[i].accaCode == 2) {
			if (quanjuvoudatas.data[i].levNum > 0) {
				tr += '<li levNum="' + quanjuvoudatas.data[i].levNum + '" style="display:none;" fname="' + quanjuvoudatas.data[i].accoFullName + '" title="' + quanjuvoudatas.data[i].remark + '" acca="' + quanjuvoudatas.data[i].accaCode + '" name="' + i + '" cashflow="' + quanjuvoudatas.data[i].isCashflow + '" role="' + quanjuvoudatas.data[i].accBal + '" class="unselected leave' + quanjuvoudatas.data[i].levNum + ' clik' + quanjuvoudatas.data[i].isLeaf + ' fuhs' + quanjuvoudatas.data[i].accitemNum + '"><p><span class="ACCO_CODE">' + quanjuvoudatas.data[i].accoCode + '</span> <span class="ACCO_NAME">' + quanjuvoudatas.data[i].accoName + '</span></p><span class="fu">辅</span></li>'
			} else {
				tr += '<li levNum="' + quanjuvoudatas.data[i].levNum + '" fname="' + quanjuvoudatas.data[i].accoFullName + '" title="' + quanjuvoudatas.data[i].remark + '" acca="' + quanjuvoudatas.data[i].accaCode + '" name="' + i + '" cashflow="' + quanjuvoudatas.data[i].isCashflow + '" role="' + quanjuvoudatas.data[i].accBal + '" class="PopListBoxItem unselected leave' + quanjuvoudatas.data[i].levNum + ' clik' + quanjuvoudatas.data[i].isLeaf + ' fuhs' + quanjuvoudatas.data[i].accitemNum + '"><p class="sq"><span class="ACCO_CODE">' + quanjuvoudatas.data[i].accoCode + '</span> <span class="ACCO_NAME">' + quanjuvoudatas.data[i].accoName + '</span></p><span class="fu">辅</span></li>'
			}
		}
	}
	tr += '<li class="bukedian"><p>没有对应的会计科目</p></li>'
	tr += '<li class="xzkjkm"><a >+新增会计科目</a></li>'
	return tr
}
var selectdata = new Object()
selectdata.data = {}

function chaclickfu(ths, strdata, accoSurplus, dfDc) {
	var ss = $(".voucher-hover").find(".accountinginp").attr("accoindex");
	if ($(".voucher-hover").hasClass("voucher-hovercw")) {
		ss = $(".voucher-hover").find('.voucher-centercw').find(".accountinginp").attr("accoindex");
	} else if ($(".voucher-hover").hasClass("voucher-hoverys")) {
		ss = $(".voucher-hover").find('.voucher-centerys').find(".accountinginp").attr("accoindex");
	}
	var voucherycss = new Object();
	for (var d in tablehead) {
		var c = d.substring(0, d.length - 4)
		if (quanjuvoudatas.data[ss][c] == 1) {
			voucherycss[d] = tablehead[d];
		}
	}
	voucherycTitleData(ss)
	var voucheryc = ''
	var lengvouychead = ''
	var nowAccoCode = ths.find('.accountinginp').attr('code');
	var accItemArr = voucherycss;
	//			if(voucherycss.length > 0) { //得到辅助项的存在，再进行排序。wangpl 2018.01.22
	voucherycss = resOrderAccItem(nowAccoCode, accItemArr);
	var noshowaccitem = showAccItem(nowAccoCode, accItemArr)
	//          }
	for (var i in voucherycss) {
		var l = i
		if ($('#AssDataAll').find('.' + l).length < 1) {
			var assnoll = ''
			if (fzhsxl[l].length > 100) {
				var nowlen = 0
				assnoll += '<ul isAlllength="now" class="ycbodys ' + l + '">'
				for (var n = 0; n < fzhsxl[l].length; n++) {
					if (fzhsxl[l][n].enabled == 1) {
						if (fzhsxl[l][n].levelNum == 1 && nowlen < 100) {
							nowlen++;
							assnoll += '<li datalen = ' + n + ' department = "' + fzhsxl[l][n].departmentCode + '" levels = "' + fzhsxl[l][n].levelNum + '" fname="' + fzhsxl[l][n].chrFullname + '" class="PopListBoxItem unselected  dianji' + fzhsxl[l][n].isLeaf + ' fzlv' + fzhsxl[l][n].levelNum + ' "><p class="sq"><span class="code">' + fzhsxl[l][n].code + '</span>  <span class="name">' + fzhsxl[l][n].name + '</span></p></li>'
						} else if (fzhsxl[l][n].levelNum == 1 && nowlen >= 100) {
							assnoll += '<div class="">当前辅助项数量较多，点击加载剩余辅助项</div>'
						}
					}
				}
			} else {
				assnoll += '<ul class="ycbodys ' + l + '">'
				for (var n = 0; n < fzhsxl[l].length; n++) {
					if (fzhsxl[l][n].enabled == 1) {
						if (fzhsxl[l][n].levelNum == 1) {
							assnoll += '<li department = "' + fzhsxl[l][n].departmentCode + '" levels = "' + fzhsxl[l][n].levelNum + '" fname="' + fzhsxl[l][n].chrFullname + '" class="PopListBoxItem unselected  dianji' + fzhsxl[l][n].isLeaf + ' fzlv' + fzhsxl[l][n].levelNum + ' "><p class="sq"><span class="code">' + fzhsxl[l][n].code + '</span>  <span class="name">' + fzhsxl[l][n].name + '</span></p></li>'
						} else {
							assnoll += '<li department = "' + fzhsxl[l][n].departmentCode + '" style="display:none;" levels = "' + fzhsxl[l][n].levelNum + '" fname="' + fzhsxl[l][n].chrFullname + '" class="unselected  dianji' + fzhsxl[l][n].isLeaf + ' fzlv' + fzhsxl[l][n].levelNum + ' "><p><span class="code">' + fzhsxl[l][n].code + '</span>  <span class="name">' + fzhsxl[l][n].name + '</span></p></li>'
						}
					} else {
						assnoll += '<li levels = "' + fzhsxl[l][n].levelNum + '" fname="' + fzhsxl[l][n].chrFullname + '" class=" unselected allnoshow  dianji' + fzhsxl[l][n].isLeaf + ' fzlv' + fzhsxl[l][n].levelNum + ' "><p><span class="code">' + fzhsxl[l][n].code + '</span>  <span class="name">' + fzhsxl[l][n].name + '</span></p></li>'
					}
				}
			}
			if (isaddAssbtn == true) {
				assnoll += '<div class="fzhsadd" tzurl = ' + l + '>+新增 ' + tablehead[l].ELE_NAME + '</div>'
			}
			assnoll += '</ul>'
			$('#AssDataAll').append(assnoll)
		}
		if (voucherycss[i].value != undefined && voucherycss[i].value != '') {
			lengvouychead += '<div class="ychead"  name="' + i + '"  mrvalue = ' + voucherycss[i].value + '>' + voucherycss[i].ELE_NAME + '</div>'
		} else {
			lengvouychead += '<div class="ychead"  name="' + i + '">' + voucherycss[i].ELE_NAME + '</div>'
		}
		if (voucherycss[i]["ELE_CODE"] == "CURRENT" && isbussDate) {
			lengvouychead += '<div class="ychead"   name="bussDate"  mrvalue = "">往来日期</div>'
		}
	}
	if (quanjuvoudatas.data[ss].expireDate == 1) {
		lengvouychead += '<div class="ychead" name="expireDate">到期日</div>'
	}
	if (quanjuvoudatas.data[ss].showBill == 1) {
		if (billfzhsxl.length == 0) {
			$.ajax({
				type: "get",
				url: "/gl/vou/getEleBillType/" + rpt.nowAgencyCode + "?ajax=1&rueicode=" + hex_md5svUserCode,
				dataType: "json",
				async: false,
				success: function (data) {
					billfzhsxl = data.data
				},
				error: function (data) {
					ufma.showTip("票据类型未加载成功,请检查网络", function () { }, "error")
				}
			});
		}
		if ($('#AssDataAll').find('.billTypeinp').length < 1) {
			var assnoll = ''
			assnoll += '<ul class="ycbodys billTypeinp">'
			for (var n = 0; n < billfzhsxl.length; n++) {
				if (billfzhsxl[n].enabled == 1 || billfzhsxl[n].enabled == undefined) {
					assnoll += '<li levels = "' + billfzhsxl[n].levelNum + '" fname="' + billfzhsxl[n].chrName + '" class="PopListBoxItem unselected dianji' + billfzhsxl[n].isLeaf + ' fzlv' + billfzhsxl[n].levelNum + '"><p><span class="code">' + billfzhsxl[n].chrCode + '</span>  <span class="name">' + billfzhsxl[n].chrName + '</span></p></li>'
				} else {
					assnoll += '<li levels = "' + billfzhsxl[n].levelNum + '" fname="' + billfzhsxl[n].chrName + '" class="unselected allnoshow dianji' + billfzhsxl[n].isLeaf + ' fzlv' + billfzhsxl[n].levelNum + '"><p><span class="code">' + billfzhsxl[n].chrCode + '</span>  <span class="name">' + billfzhsxl[n].chrName + '</span></p></li>'
				}
			}
			if (isaddAssbtn == true) {
				assnoll += '<div class="fzhsadd" tzurl = "billtype">+新增票据类型</div>'
			}
			assnoll += '</ul>'
			$('#AssDataAll').append(assnoll)
		}
		lengvouychead += '<div class="ychead" name="billNo">票据号</div>'
		lengvouychead += '<div class="ychead" name="billType">票据类型</div>'
		lengvouychead += '<div class="ychead" name="billDate">票据日期</div>'
	}
	if (quanjuvoudatas.data[ss].currency == 1) {
		ufma.ajaxDef('/gl/eleCurrRate/getCurrType', "get", {
			"agencyCode": rpt.nowAgencyCode
		}, function (result) {
			curCodefzhsxl = result.data
		})
		if ($('#AssDataAll').find('.currency').length < 1) {
			var assnoll = ''
			assnoll += '<ul class="ycbodys currency">'
			for (var n = 0; n < curCodefzhsxl.length; n++) {
				if (curCodefzhsxl[n].eleRateList.length > 0) {
					if (curexratefzhsxl["i" + n] == undefined) {
						curexratefzhsxl["i" + n] = curCodefzhsxl[n].eleRateList[0].direRate
					}
					assnoll += '<li rateDigits ="' + curCodefzhsxl[n].rateDigits + '" exrate = "i' + n + '" levels = "' + curCodefzhsxl[n].levelNum + '" fname="' + curCodefzhsxl[n].chrName + '" class="PopListBoxItem unselected dianji' + curCodefzhsxl[n].isLeaf + ' fzlv' + curCodefzhsxl[n].levelNum + '"><p><span class="code">' + curCodefzhsxl[n].chrCode + '</span>  <span class="name">' + curCodefzhsxl[n].chrName + '</span></p></li>'
				} else {
					assnoll += '<li rateDigits ="' + curCodefzhsxl[n].rateDigits + '" exrate = "" levels = "' + curCodefzhsxl[n].levelNum + '" fname="' + curCodefzhsxl[n].chrName + '" class="PopListBoxItem unselected dianji' + curCodefzhsxl[n].isLeaf + ' fzlv' + curCodefzhsxl[n].levelNum + '"><p><span class="code">' + curCodefzhsxl[n].chrCode + '</span>  <span class="name">' + curCodefzhsxl[n].chrName + '</span></p></li>'
				}
			}
			assnoll += '</ul>'
			$('#AssDataAll').append(assnoll)
		}
		lengvouychead += '<div class="ychead" name="curCode">币种</div>'
		lengvouychead += '<div class="ychead" name="exRate">汇率</div>'
		lengvouychead += '<div class="ychead" name="currAmt">外币金额</div>'
	}
	if (quanjuvoudatas.data[ss].qty == 1) {
		lengvouychead += '<div class="ychead" name="price">单价</div>'
		lengvouychead += '<div class="ychead" name="qty">数量</div>'
	}
	lengvouychead += '<div class="ychead noshowdata" noshow=' + noshowaccitem + '>金额</div>'
	var lengvouyc = ''
	var fzbolen = 1
	if (strdata != null && strdata.length > 0) {
		for (var k = 0; k < strdata.length; k++) {
			if (selectdata.data.vouGuid == strdata[k].vouGuid) {
				lengvouyc += '<div class="voucher-yc-bo"  refBillGuid="' + strdata[k].refBillGuid + '" inde="' + k + '" op="' + strdata[k].op + '"   namess="' + strdata[k].vouGuid + '" namesss="' + strdata[k].detailGuid + '" namessss="' + strdata[k].detailAssGuid + '">'
			} else if (selectdata.data.templateGuid == strdata[k].vouGuid) {
				lengvouyc += '<div class="voucher-yc-bo"  refBillGuid="' + strdata[k].refBillGuid + '" inde="' + k + '" op="' + strdata[k].op + '"   namess="' + strdata[k].vouGuid + '" namesss="' + strdata[k].detailGuid + '" namessss="' + strdata[k].detailAssGuid + '">'

			} else {
				lengvouyc += '<div class="voucher-yc-bo" inde="' + k + '" op="0">'
			}
			for (var l in voucherycss) {
				lengvouyc += '<div  class="ycbody">'
				lengvouyc += '<textarea relation = "' + l + '" class="ycbodyinp"></textarea>'
				lengvouyc += '</div>'
				if (voucherycss[l]["ELE_CODE"] == "CURRENT" && isbussDate) {
					lengvouyc += '<div  class="ycbody">'
					lengvouyc += '<input type="text"  value="' + $("#dates").getObj().getValue() + '" class="ycbodyinp bussDate"  />'
					lengvouyc += '</div>'
				}
			}
			if (quanjuvoudatas.data[ss].expireDate == 1) {
				lengvouyc += '<div  class="ycbody">'
				lengvouyc += '<input type="text" class="ycbodyinp daoqiri"  />'
				lengvouyc += '</div>'
			}
			if (quanjuvoudatas.data[ss].showBill == 1) {
				lengvouyc += '<div  class="ycbody">'
				lengvouyc += '<input type="text" class="ycbodyinp billNoinp"  />'
				lengvouyc += '</div>'
				lengvouyc += '<div  class="ycbody">'
				lengvouyc += '<textarea relation="billTypeinp" class="ycbodyinp billTypeinp"></textarea>'
				lengvouyc += '</div>'
				lengvouyc += '<div  class="ycbody">'
				lengvouyc += '<input type="text" class="ycbodyinp billDateinp"  />'
				lengvouyc += '</div>'
			}
			if (quanjuvoudatas.data[ss].currency == 1) {
				lengvouyc += '<div  class="ycbody">'
				lengvouyc += '<input relation = "currency" type="text" class="ycbodyinp curcodeinp"  />'
				lengvouyc += '</div>'
				lengvouyc += '<div  class="ycbody">'
				lengvouyc += '<input type="text" class="ycbodyinp exrateinp"  />'
				lengvouyc += '</div>'
				lengvouyc += '<div  class="ycbody">'
				lengvouyc += '<input type="text" class="ycbodyinp curramtinp"  />'
				lengvouyc += '</div>'
			}
			if (quanjuvoudatas.data[ss].qty == 1) {
				lengvouyc += '<div  class="ycbody">'
				lengvouyc += '<input type="text" class="ycbodyinp priceinp"  />'
				lengvouyc += '</div>'
				lengvouyc += '<div  class="ycbody">'
				lengvouyc += '<input type="text" class="ycbodyinp qtyinp"  qty="' + quanjuvoudatas.data[ss].qtyDigits + '" />'
				lengvouyc += '</div>'
			}
			lengvouyc += '<input type="text" class="ycbody yctz" />'
			lengvouyc += '</div>'
		}
	} else {
		for (var k = 0; k < 1; k++) {
			lengvouyc += '<div class="voucher-yc-bo" op="0" inde ="0">'
			for (var l in voucherycss) {
				lengvouyc += '<div  class="ycbody">'
				lengvouyc += '<textarea relation = "' + l + '" class="ycbodyinp"></textarea>'
				lengvouyc += '</div>'
				if (voucherycss[l]["ELE_CODE"] == "CURRENT" && isbussDate) {
					lengvouyc += '<div  class="ycbody">'
					lengvouyc += '<input type="text"  value="' + $("#dates").getObj().getValue() + '" class="ycbodyinp bussDate"  />'
					lengvouyc += '</div>'
				}
			}
			if (quanjuvoudatas.data[ss].expireDate == 1) {
				lengvouyc += '<div  class="ycbody">'
				lengvouyc += '<input type="text" class="ycbodyinp daoqiri"  />'
				lengvouyc += '</div>'
			}
			if (quanjuvoudatas.data[ss].showBill == 1) {
				lengvouyc += '<div  class="ycbody">'
				lengvouyc += '<input type="text" class="ycbodyinp billNoinp"  />'
				lengvouyc += '</div>'
				lengvouyc += '<div  class="ycbody">'
				lengvouyc += '<textarea relation="billTypeinp" class="ycbodyinp billTypeinp"></textarea>'
				lengvouyc += '</div>'
				lengvouyc += '<div  class="ycbody">'
				lengvouyc += '<input type="text" class="ycbodyinp billDateinp"  />'
				lengvouyc += '</div>'
			}
			if (quanjuvoudatas.data[ss].currency == 1) {
				lengvouyc += '<div  class="ycbody">'
				lengvouyc += '<input relation = "currency" type="text" class="ycbodyinp curcodeinp"  />'
				lengvouyc += '</div>'
				lengvouyc += '<div  class="ycbody">'
				lengvouyc += '<input type="text" class="ycbodyinp exrateinp"  />'
				lengvouyc += '</div>'
				lengvouyc += '<div  class="ycbody">'
				lengvouyc += '<input type="text" class="ycbodyinp curramtinp"  />'
				lengvouyc += '</div>'
			}
			if (quanjuvoudatas.data[ss].qty == 1) {
				lengvouyc += '<div  class="ycbody">'
				lengvouyc += '<input type="text" class="ycbodyinp priceinp"  />'
				lengvouyc += '</div>'
				lengvouyc += '<div  class="ycbody">'
				lengvouyc += '<input type="text" class="ycbodyinp qtyinp"  qty="' + quanjuvoudatas.data[ss].qtyDigits + '" />'
				lengvouyc += '</div>'
			}
			lengvouyc += '<input type="text" class="ycbody yctz" />'
			lengvouyc += '</div>'
		}
	}
	voucheryc += '<div class="voucher-yc-bt-gudinbg">'
	voucheryc += '<div class="voucher-yc-bt-gudin" dataIndex = ' + ss + '>'
	voucheryc += lengvouychead
	voucheryc += '</div>'
	voucheryc += '</div>'
	voucheryc += '<div class="voucher-bgallscroll">'
	voucheryc += '<div class="voucher-bgall">'
	voucheryc += '<div class="voucher-yc-addbtns" style="position: relative;">'
	if (strdata != null && strdata.length > 0) {
		for (var i = 0; i < strdata.length; i++) {
			voucheryc += '<div class="ycadddiv" inde="1"><img src="img/jia.png" class="ycadd" style="visibility: hidden;"></div>'
		}
	} else {
		for (var i = 0; i < 1; i++) {
			voucheryc += '<div class="ycadddiv" inde="1"><img src="img/jia.png" class="ycadd" style="visibility: hidden;"></div>'
		}
	}
	voucheryc += '</div>'
	voucheryc += '<div class="voucher-yc-bg">'
	voucheryc += '<div class="voucher-yc-bt">'
	voucheryc += lengvouychead
	voucheryc += '</div>'
	voucheryc += lengvouyc
	voucheryc += '</div>'
	voucheryc += '<div class="voucher-yc-deletebtns" style="position: relative;">'
	if (strdata != null && strdata.length > 0) {
		for (var i = 0; i < strdata.length; i++) {
			voucheryc += '<div class="ycdeldiv" inde="1"><span class="ycdelect icon-trash" style="visibility: hidden;"></span></div>'
		}
	} else {
		for (var i = 0; i < 1; i++) {
			voucheryc += '<div class="ycdeldiv" inde="1"><span class="ycdelect icon-trash" style="visibility: hidden;"></span></div>'
		}
	}
	voucheryc += '</div>'
	voucheryc += '</div>'
	voucheryc += '</div>'
	$('.voudetailAss').find('.voucher-yc').eq(0).html(voucheryc);
	if (selectdata.data.vouStatus != "A" && selectdata.data.vouStatus != "C" && selectdata.data.vouStatus != "P") {
		$('.daoqiri,.billDateinp,.bussDate').datetimepicker(glRptJournalDate)
	} else {
		$('.daoqiri').addClass('daoqiriend')
		$('.daoqiriend').removeClass('daoqiri')
	}
	voucherYcAssCss($('.voudetailAss').find('.voucher-yc').eq(0))
	if (strdata != null) {
		var sdvdvdass = strdata
		var vifvcyb = $('.voudetailAss').find('.voucher-yc').eq(0).find(".voucher-yc-bo")
		for (var k = 0; k < sdvdvdass.length; k++) {
			if (sdvdvdass[k].op == "2") {
				vifvcyb.eq(k).addClass("deleteclass");
			} else {
				vifvcyb.eq(k).find(".yctz").val(formatNum(parseFloat(sdvdvdass[k].stadAmt).toFixed(2)))
				for (var r = 0; r < vifvcyb.eq(k).find(".ycbodyinp").length; r++) {
					var relation = vifvcyb.eq(k).find(".ycbodyinp").eq(r).attr('relation')
					var $li = $('#AssDataAll').find("." + relation).find("li");
					var headName = $('.voudetailAss').find('.voucher-yc-bg').find(".voucher-yc-bt").find(".ychead").eq(r).attr("name")
					if (headName == "expireDate") {
						vifvcyb.eq(k).find(".ycbodyinp").eq(r).val(sdvdvdass[k].expireDate);
					} else if (headName == "billNo") {
						vifvcyb.eq(k).find(".ycbodyinp").eq(r).val(sdvdvdass[k].billNo);
					} else if (headName == "price") {
						vifvcyb.eq(k).find(".ycbodyinp").eq(r).val(sdvdvdass[k].price);
					} else if (headName == "qty") {
						vifvcyb.eq(k).find(".ycbodyinp").eq(r).val(sdvdvdass[k].qty);
					} else if (headName == "exRate") {
						vifvcyb.eq(k).find(".ycbodyinp").eq(r).val(sdvdvdass[k].exRate);
					} else if (headName == "currAmt") {
						vifvcyb.eq(k).find(".ycbodyinp").eq(r).val(formatNum(sdvdvdass[k].currAmt));
					} else if (headName == "billDate") {
						vifvcyb.eq(k).find(".ycbodyinp").eq(r).val(sdvdvdass[k].billDate);
					} else if (headName == "bussDate") {
						vifvcyb.eq(k).find(".ycbodyinp").eq(r).val(sdvdvdass[k].bussDate);
					} else if (headName == "billType") {
						for (var s = 0; s < $li.length; s++) {
							if ($li.eq(s).find(".code").text() == sdvdvdass[k].billType) {
								$li.eq(s).removeClass("unselected").addClass("selected");
								var fzxlnrcode = $li.eq(s).find(".code").text();
								var fzxlnrname = $li.eq(s).find(".name").text();
								vifvcyb.eq(k).find(".ycbodyinp").eq(r).val(fzxlnrcode + " " + fzxlnrname)
							}
						}
					} else if (headName == "curCode") {
						for (var s = 0; s < $li.length; s++) {
							if ($li.eq(s).find(".code").text() == sdvdvdass[k].curCode) {
								$li.eq(s).removeClass("unselected").addClass("selected");
								var fzxlnrcode = $li.eq(s).find(".code").text();
								var fzxlnrname = $li.eq(s).find(".name").text();
								var exrate = $li.eq(s).attr('exrate')
								var rateDigits = $li.eq(s).attr('rateDigits')
								vifvcyb.eq(k).find(".ycbodyinp").eq(r).val(fzxlnrcode + " " + fzxlnrname).attr('code', fzxlnrcode)
								vifvcyb.eq(k).find(".exrateinp").attr('exrate', exrate).attr('rateDigits', rateDigits)
							}
						}
					} else if (headName == "diffTermDir") {
						if (dfDc == 1) {
							vifvcyb.eq(k).find(".ycbodyinp").eq(r).val('正向');
							$li.eq(0).removeClass("unselected").addClass("selected");
						} else {
							vifvcyb.eq(k).find(".ycbodyinp").eq(r).val('反向');
							$li.eq(1).removeClass("unselected").addClass("selected");
						}
					} else {
						var btcoded = headName
						for (var s = 0; s < fzhsxl[relation].length; s++) {
							if (fzhsxl[relation][s].code == sdvdvdass[k][btcoded]) {
								var fzxlnrcode = fzhsxl[relation][s].code
								var fzxlnrname = ''
								if (!isaccfullname) {
									fzxlnrname = fzhsxl[relation][s].name;
								} else {
									fzxlnrname = fzhsxl[relation][s].chrFullname;
								}
								vifvcyb.eq(k).find(".ycbodyinp").eq(r).val(fzxlnrcode + " " + fzxlnrname).attr('code', fzxlnrcode)
							}
						}
					}
				}
			}
		}
	}
}

function chapzone(obj) {
	var _this = obj
	_this.find(".abstractinp").val(voucopydata.descpt);
	for (var j = 0; j < $("#accounting-container").find("li").length; j++) {
		if (voucopydata.accoCode == "") {
			_this.find('.accountinginp').val("");
		} else {
			if (voucopydata.accoCode == $("#accounting-container").find("li").eq(j).find(".ACCO_CODE").text()) {
				var selacclen = $("#accounting-container").find("li").eq(j)
				if (isaccfullname) {
					_this.find('.accountinginp').val(voucopydata.accoCode + " " + selacclen.attr("fname")).attr("accbal", voucopydata.drCr);
				} else {
					_this.find('.accountinginp').val(voucopydata.accoCode + " " + selacclen.find(".ACCO_NAME").text()).attr("accbal", voucopydata.drCr);
				}
				_this.find('.accountinginp').parents('.accounting').attr('title', _this.find('.accountinginp').val())
				_this.find('.accountinginp').attr('acca', selacclen.attr('acca'))
				_this.find('.accountinginp').attr('code', selacclen.find(".ACCO_CODE").text())
				_this.find('.accountinginp').attr('name', selacclen.find(".ACCO_NAME").text())
				_this.find('.accountinginp').attr('accoindex', selacclen.attr('name'))
				_this.find('.accountinginp').attr('fname', selacclen.attr('fname'))
				var vounowbal = voubalance[selacclen.find(".ACCO_CODE").text()] || 0
				_this.find('.accountinginp').attr('cashflow', selacclen.attr('cashflow'))
				_this.find('.accountinginp').parents(".accounting").find(".accountingye").show();
				_this.find('.accountinginp').parents(".accounting").find(".accountingye").text("余额：" + formatNum(vounowbal));
				_this.find('.accountinginp').parents(".accounting").find(".accountingye").attr("title", "余额：" + formatNum(vounowbal));
				_this.find('.accountinginp').parents(".accounting").find(".accountingmx").show();
				if (vousinglepz == true) {
					if (_this.find('.accountinginp').attr('acca') == '1') {
						_this.find('.accountinginp').parents('.voucher-center').removeClass('voucher-center-ys').removeClass('voucher-center-cw').addClass('voucher-center-cw')
						_this.find('.accountinginp').parents('.voucher-center').find('.vouchertypebody').html('<div class="vouchertypebodycw">财</div>')

					} else if (_this.find('.accountinginp').attr('acca') == '2') {
						_this.find('.accountinginp').parents('.voucher-center').removeClass('voucher-center-ys').removeClass('voucher-center-cw').addClass('voucher-center-ys')
						_this.find('.accountinginp').parents('.voucher-center').find('.vouchertypebody').html('<div class="vouchertypebodyys">预</div>')
					}
				}
				if (selacclen.hasClass("fuhs0") != true) {
					_this.find('.accountinginp').parents(".accounting").find(".fuyan").show()
					if (voucopydata.vouDetailAsss != null) {
						var strdata = JSON.stringify(voucopydata.vouDetailAsss)
						_this.find('.accounting').attr('fudata', strdata)
						_this.find('.accounting').parents(".accounting").attr('accoSurplus', voucopydata.accoSurplus)
						_this.find('.accounting').parents(".accounting").attr('dfDc', voucopydata.dfDc)
					}
				} else {
					_this.find('.accountinginp').parents(".accounting").find(".fuyan").hide()
				}
				break;
			} else {
				_this.find('.accountinginp').val("");
			}
		}
	}
	if (voucopydata.drCr == -1) {
		if (voucopydata.stadAmt != null) {
			if (voucopydata.stadAmt == "") {
				if (vousinglepz == true) {
					_this.find('.moneyd').find(".money-sr").val("")
					_this.find('.moneyd').find(".money-xs").html("")
				} else if (vousinglepz == false && vousinglepzzy == true) {
					_this.find('.moneyd').find(".money-sr").val("")
					_this.find('.moneyd').find(".money-xs").html("")
				} else {
					_this.find('.moneyd').find(".money-sr").val("")
					_this.find('.moneyd').find(".money-xs").html("")
				}

				_this.find('.moneyj').find(".money-sr").val("")
				_this.find('.moneyj').find(".money-xs").html("")
			} else {
				_this.find('.moneyd').find(".money-sr").val(parseFloat(voucopydata.stadAmt).toFixed(2)).addClass('money-ys')
				if (voucopydata.stadAmt >= 10000000000 || vousinglepz == true || vousinglepzzy == true) {
					_this.find('.moneyd').find(".money-xs").html(formatNum(parseFloat(voucopydata.stadAmt).toFixed(2)))
				} else {
					_this.find('.moneyd').find(".money-xs").html(parseFloat(parseFloat(voucopydata.stadAmt).toFixed(2) * 100).toFixed(0))
				}
				_this.find('.moneyj').find(".money-sr").val("")
				_this.find('.moneyj').find(".money-xs").html("")
			}
		}
	} else {
		if (voucopydata.stadAmt != null) {
			if (voucopydata.stadAmt == "") {
				if (vousinglepz == true) {
					_this.find('.moneyd').find(".money-sr").val("")
					_this.find('.moneyd').find(".money-xs").html("")
				} else if (vousinglepz == false && vousinglepzzy == true) {
					_this.find('.moneyd').find(".money-sr").val("")
					_this.find('.moneyd').find(".money-xs").html("")
				} else {
					_this.find('.moneyd').find(".money-sr").val("")
					_this.find('.moneyd').find(".money-xs").html("")
				}

				_this.find('.moneyd').find(".money-sr").val("")
				_this.find('.moneyd').find(".money-xs").html("")
			} else {
				_this.find('.moneyj').find(".money-sr").val(parseFloat(voucopydata.stadAmt).toFixed(2)).addClass('money-ys')
				if (voucopydata.stadAmt >= 10000000000 || vousinglepz == true || vousinglepzzy == true) {
					_this.find('.moneyj').find(".money-xs").html(formatNum(parseFloat(voucopydata.stadAmt).toFixed(2)))
				} else {
					_this.find('.moneyj').find(".money-xs").html(parseFloat(parseFloat(voucopydata.stadAmt).toFixed(2) * 100).toFixed(0))
				}
				_this.find('.moneyd').find(".money-sr").val("")
				_this.find('.moneyd').find(".money-xs").html("")
			}
		}
	}

	if (vousinglepz == true) {
		if (_this.find('.accountinginp').attr('acca') == '1') {
			_this.find('.accountinginp').parents('.voucher-center').removeClass('voucher-center-ys').removeClass('voucher-center-cw').addClass('voucher-center-cw')
			_this.find('.accountinginp').parents('.voucher-center').find('.vouchertypebody').html('<div class="vouchertypebodycw">财</div>')

		} else if (_this.find('.accountinginp').attr('acca') == '2') {
			_this.find('.accountinginp').parents('.voucher-center').removeClass('voucher-center-ys').removeClass('voucher-center-cw').addClass('voucher-center-ys')
			_this.find('.accountinginp').parents('.voucher-center').find('.vouchertypebody').html('<div class="vouchertypebodyys">预</div>')
		}
	}
	bidui()
}

function chapzhq() {
	if (selectdata.data.vouDetails.length > 0) {
		var cwarrvou = []
		var ysarrvou = []
		for (var i = 0; i < selectdata.data.vouDetails.length; i++) {
			if (selectdata.data.vouDetails[i].accaCode == 1) {
				cwarrvou.push(selectdata.data.vouDetails[i])
			} else if (selectdata.data.vouDetails[i].accaCode == 2) {
				ysarrvou.push(selectdata.data.vouDetails[i])
			}
		}
		var allrunvous = []
		if (cwarrvou.length >= ysarrvou.length) {
			for (var i = 0; i < cwarrvou.length; i++) {
				allrunvous.push(cwarrvou[i])
				if (ysarrvou[i] != undefined) {
					allrunvous.push(ysarrvou[i])
				} else {
					allrunvous.push({
						'op': '3'
					})
				}
			}
		} else {
			for (var i = 0; i < ysarrvou.length; i++) {
				if (cwarrvou[i] != undefined) {
					allrunvous.push(cwarrvou[i])
				} else {
					allrunvous.push({
						'op': '3',
						'descpt': ''
					})
				}
				allrunvous.push(ysarrvou[i])
			}
		}
		selectdata.data.vouDetails = allrunvous
	}
}

function chapzhqdan() {
	if (selectdata.data.vouDetails.length > 0) {
		var cwarrvou = []
		var ysarrvou = []
		for (var i = 0; i < selectdata.data.vouDetails.length; i++) {
			if (selectdata.data.vouDetails[i].accaCode == 1) {
				cwarrvou.push(selectdata.data.vouDetails[i])
			} else if (selectdata.data.vouDetails[i].accaCode == 2) {
				ysarrvou.push(selectdata.data.vouDetails[i])
			}
		}
		var allrunvous = []
		for (var i = 0; i < cwarrvou.length; i++) {
			if (cwarrvou[i].accoCode != '' || cwarrvou[i].stadAmt != '') {
				allrunvous.push(cwarrvou[i])
			}
		}
		for (var i = 0; i < ysarrvou.length; i++) {
			if (ysarrvou[i].accoCode != '' || ysarrvou[i].stadAmt != '') {
				allrunvous.push(ysarrvou[i])
			}
		}
		selectdata.data.vouDetails = allrunvous
	}
}
function chapz() {
	if (vousinglepzzy == true) {
		chapzhq()
	}
	if (vousinglepz == true) {
		chapzhqdan()
	}
	if (selectdata.data.vouSource != 'MANUAL' && selectdata.data.vouSource != undefined && selectdata.data.vouSource != '' && selectdata.data.vouSource != null) {
		isvousource = false
	} else {
		isvousource = true
	}
	$(".voucherleft").hide();
	vouchecker = selectdata.data.checker
	if (vousinglepz == false && vousinglepzzy == false) {
		if (selectdata.data.amtCr >= 10000000000) {
			$(".voucherall").find(".voucher-footer").find(".moneyj .money-xs").html(formatNum(selectdata.data.amtCr.toFixed(2)));
		} else if (selectdata.data.amtCr < 1 && selectdata.data.amtCr > 0) {
			$(".voucherall").find(".voucher-footer").find(".moneyj .money-xs").html('0' + selectdata.data.amtCr * 100);
		} else {
			$(".voucherall").find(".voucher-footer").find(".moneyj .money-xs").html(selectdata.data.amtCr * 100);
		}
		if (selectdata.data.amtDr >= 10000000000) {
			$(".voucherall").find(".voucher-footer").find(".moneyd .money-xs").html(formatNum(selectdata.data.amtDr.toFixed(2)));
		} else if (selectdata.data.amtCr < 1 && selectdata.data.amtCr > 0) {
			$(".voucherall").find(".voucher-footer").find(".moneyj .money-xs").html('0' + selectdata.data.amtCr * 100);
		} else {
			$(".voucherall").find(".voucher-footer").find(".moneyd .money-xs").html(selectdata.data.amtDr * 100);
		}
	} else if (vousinglepz == true && vousinglepzzy == false) {
		if (selectdata.data.amtCr > 0 && selectdata.data.amtDr > 0) {
			$(".voucherall").find(".voucher-footer").find(".moneyj .money-cw").html(formatNum(parseFloat(selectdata.data.amtCr).toFixed(2)));
			$(".voucherall").find(".voucher-footer").find(".moneyd .money-cw").html(formatNum(parseFloat(selectdata.data.amtDr).toFixed(2)));
		}
		if (selectdata.data.ysAmtCr > 0 && selectdata.data.ysAmtDr > 0) {
			$(".voucherall").find(".voucher-footer").find(".moneyj .money-ys").html(formatNum(parseFloat(selectdata.data.ysAmtCr).toFixed(2)));
			$(".voucherall").find(".voucher-footer").find(".moneyd .money-ys").html(formatNum(parseFloat(selectdata.data.ysAmtDr).toFixed(2)));
		}
	} else if (vousinglepz == false && vousinglepzzy == true) {
		if (selectdata.data.amtCr > 0 && selectdata.data.amtDr > 0) {
			$(".voucherall").find(".voucher-footer").find(".moneyhjcw .moneyj .money-xs").html(formatNum(parseFloat(selectdata.data.amtCr).toFixed(2)));
			$(".voucherall").find(".voucher-footer").find(".moneyhjcw .moneyd .money-xs").html(formatNum(parseFloat(selectdata.data.amtDr).toFixed(2)));
		}
		if (selectdata.data.ysAmtCr > 0 && selectdata.data.ysAmtDr > 0) {
			$(".voucherall").find(".voucher-footer").find(".moneyhjys .moneyj .money-xs").html(formatNum(parseFloat(selectdata.data.ysAmtCr).toFixed(2)));
			$(".voucherall").find(".voucher-footer").find(".moneyhjys .moneyd .money-xs").html(formatNum(parseFloat(selectdata.data.ysAmtDr).toFixed(2)));
		}
	}
	for (var i = 0; i < $("#leftbgselect").find("option").length; i++) {
		$("#leftbgselect").find("option").eq(i).removeProp("selected")

	}
	for (var i = 0; i < $("#leftbgselect").find("option").length; i++) {
		if ($("#leftbgselect").find("option").eq(i).attr("value") == selectdata.data.vouTypeCode) {
			$("#leftbgselect").find("option").eq(i).prop("selected", true)
			$("#leftbgselect").find("option").eq(i).attr("selected", true)
		}
	}
	if (selectdata.data.vouDate != undefined) {
		$("#dates").getObj().setValue(selectdata.data.vouDate);
	}
	$("#fjd").val(selectdata.data.vouCnt);
	if (selectdata.data.vouNo != '' && selectdata.data.vouNo != undefined && selectdata.data.vouNo != null) {
		if (isfispredvouno) {
			if (selectdata.data.fisPerd != '' && selectdata.data.fisPerd != undefined && selectdata.data.fisPerd != null) {
				var voufispred = parseFloat(selectdata.data.fisPerd)
				if (voufispred < 10) {
					voufispred = '0' + voufispred
				}
				$("#sppz").val(voufispred + '-' + selectdata.data.vouNo);
			} else {
				var voufispred = (new Date($("#dates").getObj().getValue()).getMonth()) + 1
				if (voufispred < 10) {
					voufispred = '0' + voufispred
				}
				$("#sppz").val(voufispred + '-' + selectdata.data.vouNo);
			}
		} else {
			$("#sppz").val(selectdata.data.vouNo);
		}
		// $("#sppz").attr('vouno', $("#sppz").val())
	}
	if (selectdata.data.fisPerd != '' && selectdata.data.fisPerd != undefined && selectdata.data.fisPerd != null) {
		$("#sppz").attr('fisperds', selectdata.data.fisPerd)
	} else {
		$("#sppz").attr('fisperds', (new Date($("#dates").getObj().getValue()).getMonth()) + 1)
	}
	$(".nowu").val(selectdata.data.remark);
	if(selectdata.data.isWriteOff == '2'){
		$(".iswriteoff").text("被冲红凭证:"+selectdata.data.writeOffVouTypeName+'-'+selectdata.data.writeOffVouNo).attr("guid",selectdata.data.writeOffId).show()
		$(".iswriteoff").attr("title","被冲红凭证:"+selectdata.data.writeOffVouTypeName+'-'+selectdata.data.writeOffVouNo)
	}else if(selectdata.data.isWriteOff == '1'){
		$(".iswriteoff").text("冲红生成凭证:"+selectdata.data.writeOffVouTypeName+'-'+selectdata.data.writeOffVouNo).attr("guid",selectdata.data.writeOffId).show()
		$(".iswriteoff").attr("title","冲红生成凭证:"+selectdata.data.writeOffVouTypeName+'-'+selectdata.data.writeOffVouNo)
	}else{
		$(".iswriteoff").hide()
	}
	if (selectdata.data.vouSourceName == undefined || selectdata.data.vouSourceName == null || selectdata.data.vouSourceName == '') {
		$(".vouSource").text('手工输入');
	} else {
		$(".vouSource").text(selectdata.data.vouSourceName);
	}
	if (selectdata.data.vouSource == 'AR') {
		if (getUrlParam("action") == "preview" && getUrlParam("preview") == "1") { } else {
			if (rpt.nowAgencyCode.substring(0, 3) == 999) {
				ufma.ajaxDef('/gl/vou/seleteBillNoListByVouGuid/' + selectdata.data.vouGuid, 'get', '', function (result) {
					$(".bxd").show()
					$(".bxd").html('报销单：' + result.data.billNo).prop('title', result.data.billNo).attr('gwzj', result.data.vouOpGuid).attr('dowloads', result.data.PDF)
				})
			} else {
				ufma.ajaxDef('/gl/vou/seleteBillNoAndBxNoListByVouGuid/' + selectdata.data.vouGuid, 'get', '', function (result) {
					$(".bxd").show()
					$(".bxd").html('报销单：' + result.data.billNo).prop('title', result.data.billNo).attr('gwzj', result.data.vouOpGuid).attr('dowloads', result.data.PDF)
				})
			}
		}
	} else {
		$('.bxd').hide()
	}
	$(".voucher-center").remove();
	$('.voubodyscroll').remove()
	var centerss = chapzTr()
	$(".voucher-head").after(centerss);
	if (vousinglepzzy && vousinglepz != true) {
		for (var i = 0; i < selectdata.data.vouDetails.length; i++) {
			$(".voucher-centerhalf").eq(i).attr("refBillGuid", selectdata.data.vouDetails[i].refBillGuid);
			if (selectdata.data.vouGuid == selectdata.data.vouDetails[i].vouGuid) {
				$(".voucher-centerhalf").eq(i).attr("namess", selectdata.data.vouDetails[i].vouGuid);
				$(".voucher-centerhalf").eq(i).attr("namesss", selectdata.data.vouDetails[i].detailGuid);
				$(".voucher-centerhalf").eq(i).attr("op", selectdata.data.vouDetails[i].op);
			} else if (selectdata.data.templateGuid != '') {
				$(".voucher-centerhalf").eq(i).attr("op", selectdata.data.vouDetails[i].op);
				$(".voucher-centerhalf").eq(i).attr("namess", selectdata.data.vouDetails[i].vouGuid);
				$(".voucher-centerhalf").eq(i).attr("namesss", selectdata.data.vouDetails[i].detailGuid);
			} else {
				$(".voucher-centerhalf").eq(i).attr("op", 0);
			}
			$(".voucher-centerhalf").eq(i).find(".abstractinp").val(selectdata.data.vouDetails[i].descpt);
			if (selectdata.data.vouDetails[i].accoCode == "") {
				$(".accountinginp").eq(i).val("");
			} else {
				var j = page.Codenameacct[selectdata.data.vouDetails[i].accoCode]
				var selacclen = $("#accounting-container").find("li").eq(j)
				if (selacclen.hasClass('clik1')) {
					if (isaccfullname) {
						$(".accountinginp").eq(i).val(selectdata.data.vouDetails[i].accoCode + " " + selacclen.attr("fname")).attr("accbal", selectdata.data.vouDetails[i].drCr);
					} else {
						$(".accountinginp").eq(i).val(selectdata.data.vouDetails[i].accoCode + " " + selacclen.find(".ACCO_NAME").text()).attr("accbal", selectdata.data.vouDetails[i].drCr);
					}
					$(".accountinginp").eq(i).parents('.accounting').attr('title', $(".accountinginp").eq(i).val())
					$(".accountinginp").eq(i).next(".accountinginps").find("li").eq(j).removeClass("unselected").addClass("selected");
					$(".accountinginp").eq(i).attr('acca', selacclen.attr('acca'))
					$(".accountinginp").eq(i).attr('accoindex', selacclen.attr('name'))
					$(".accountinginp").eq(i).attr('code', selacclen.find(".ACCO_CODE").text())
					$(".accountinginp").eq(i).attr('name', selacclen.find(".ACCO_NAME").text())
					$(".accountinginp").eq(i).attr('fname', selacclen.attr('fname'))
					if(selacclen.hasClass('fuhs0')){
						$(".accountinginp").eq(i).attr('accitemNum','0')
					}else{
						$(".accountinginp").eq(i).attr('accitemNum', '1')
					}
					$(".accountinginp").eq(i).attr('drcr', selectdata.data.vouDetails[i].drCr)
					var vounowbal = voubalance[selacclen.find(".ACCO_CODE").text()] || 0
					$(".accountinginp").eq(i).attr('cashflow', selacclen.attr('cashflow'))
					$(".accountinginp").eq(i).parents(".accounting").find(".accountingye").show();
					$(".accountinginp").eq(i).parents(".accounting").find(".accountingye").text("余额：" + formatNum(vounowbal));
					$(".accountinginp").eq(i).parents(".accounting").find(".accountingye").attr("title", "余额：" + formatNum(vounowbal));
					$(".accountinginp").eq(i).parents(".accounting").find(".accountingmx").show();
					if (selacclen.hasClass("fuhs0") != true) {
						$(".accountinginp").eq(i).parents(".accounting").find(".fuyan").show()
						var ss = $(".accounting").eq(i).find(".accountinginp").attr("accoindex");
						if (selectdata.data.vouDetails[i].vouDetailAsss != null) {
							var strdata = JSON.stringify(selectdata.data.vouDetails[i].vouDetailAsss)
							$(".accountinginp").eq(i).parents(".accounting").attr('fudata', strdata)
							$(".accountinginp").eq(i).parents(".accounting").attr('accoSurplus', selectdata.data.vouDetails[i].accoSurplus)
							$(".accountinginp").eq(i).parents(".accounting").attr('dfDc', selectdata.data.vouDetails[i].dfDc)
						}
					}
				} else {
					$(".accountinginp").eq(i).val(selectdata.data.vouDetails[i].accoCode);
				}
				if ($("#accounting-container").find("li").eq(j).length < 1) {
					$(".accountinginp").eq(i).val("");
				}
			}
			if (selectdata.data.vouDetails[i].drCr == -1) {
				if (selectdata.data.vouDetails[i].stadAmt == null) { } else {
					if (selectdata.data.vouDetails[i].stadAmt == "" && parseFloat(selectdata.data.vouDetails[i].stadAmt) != 0) {
						$(".moneyd").eq(i).find(".money-sr").val("")
						$(".moneyd").eq(i).find(".money-xs").html("")
						$(".moneyj").eq(i).find(".money-sr").val("")
						$(".moneyj").eq(i).find(".money-xs").html("")
					} else {
						$(".moneyd").eq(i).find(".money-sr").val(parseFloat(selectdata.data.vouDetails[i].stadAmt).toFixed(2)).addClass('money-ys')
						if (selectdata.data.vouDetails[i].stadAmt >= 10000000000 || vousinglepz == true || vousinglepzzy == true) {
							$(".moneyd").eq(i).find(".money-xs").html(formatNum(parseFloat(selectdata.data.vouDetails[i].stadAmt).toFixed(2)))
						} else if (selectdata.data.vouDetails[i].stadAmt < 1 && selectdata.data.vouDetails[i].stadAmt > 0) {
							$(".moneyd").eq(i).find(".money-xs").html('0' + parseFloat(parseFloat(selectdata.data.vouDetails[i].stadAmt).toFixed(2) * 100).toFixed(0))
						} else {
							$(".moneyd").eq(i).find(".money-xs").html(parseFloat(parseFloat(selectdata.data.vouDetails[i].stadAmt).toFixed(2) * 100).toFixed(0))
						}
						$(".moneyj").eq(i).find(".money-sr").val("")
						$(".moneyj").eq(i).find(".money-xs").html("")
					}
				}
			} else {
				if (selectdata.data.vouDetails[i].stadAmt == null) { } else {
					if (selectdata.data.vouDetails[i].stadAmt == "" && parseFloat(selectdata.data.vouDetails[i].stadAmt) != 0) {
						$(".moneyj").eq(i).find(".money-sr").val("")
						$(".moneyj").eq(i).find(".money-xs").html("")
						$(".moneyd").eq(i).find(".money-sr").val("")
						$(".moneyd").eq(i).find(".money-xs").html("")
					} else {
						$(".moneyj").eq(i).find(".money-sr").val(parseFloat(selectdata.data.vouDetails[i].stadAmt).toFixed(2)).addClass('money-ys')
						if (selectdata.data.vouDetails[i].stadAmt >= 10000000000 || vousinglepz == true || vousinglepzzy == true) {
							$(".moneyj").eq(i).find(".money-xs").html(formatNum(parseFloat(selectdata.data.vouDetails[i].stadAmt).toFixed(2)))
						} else if (selectdata.data.vouDetails[i].stadAmt < 1 && selectdata.data.vouDetails[i].stadAmt > 0) {
							$(".moneyj").eq(i).find(".money-xs").html('0' + parseFloat(parseFloat(selectdata.data.vouDetails[i].stadAmt).toFixed(2) * 100).toFixed(0))
						} else {
							$(".moneyj").eq(i).find(".money-xs").html(parseFloat(parseFloat(selectdata.data.vouDetails[i].stadAmt).toFixed(2) * 100).toFixed(0))
						}
						$(".moneyd").eq(i).find(".money-sr").val("")
						$(".moneyd").eq(i).find(".money-xs").html("")
					}
				}
			}
		}
	} else {
		for (var i = 0; i < selectdata.data.vouDetails.length; i++) {
			if (selectdata.data.vouDetails[i].op == "2") {
				$(".voucher-center").eq(i).attr("namess", selectdata.data.vouDetails[i].vouGuid);
				$(".voucher-center").eq(i).attr("namesss", selectdata.data.vouDetails[i].detailGuid);
				$(".voucher-center").eq(i).attr("refBillGuid", selectdata.data.vouDetails[i].refBillGuid);
				$(".voucher-center").eq(i).attr("op", selectdata.data.vouDetails[i].op);
				$(".voucher-center").eq(i).addClass("deleteclass");
			} else {
				$(".voucher-center").eq(i).attr("refBillGuid", selectdata.data.vouDetails[i].refBillGuid);
				if (selectdata.data.vouGuid == selectdata.data.vouDetails[i].vouGuid) {
					$(".voucher-center").eq(i).attr("namess", selectdata.data.vouDetails[i].vouGuid);
					$(".voucher-center").eq(i).attr("namesss", selectdata.data.vouDetails[i].detailGuid);
					$(".voucher-center").eq(i).attr("op", selectdata.data.vouDetails[i].op);
				} else if (selectdata.data.templateGuid != '') {
					$(".voucher-center").eq(i).attr("op", selectdata.data.vouDetails[i].op);
					$(".voucher-center").eq(i).attr("namess", selectdata.data.vouDetails[i].vouGuid);
					$(".voucher-center").eq(i).attr("namesss", selectdata.data.vouDetails[i].detailGuid);
				} else {
					$(".voucher-center").eq(i).attr("op", 0);
				}
				if ($(".voucher-center").eq(i).find(".abstractinp").length == 0) {
					$(".voucher-center").eq(i).attr('descpt', selectdata.data.vouDetails[i].descpt);
				} else {
					$(".voucher-center").eq(i).find(".abstractinp").val(selectdata.data.vouDetails[i].descpt);
				}
				if (selectdata.data.vouDetails[i].accoCode == "") {
					$(".accountinginp").eq(i).val("");
				} else {
					var j = page.Codenameacct[selectdata.data.vouDetails[i].accoCode]
					var selacclen = $("#accounting-container").find("li").eq(j)
					if (selacclen.hasClass('clik1')) {
						if (isaccfullname) {
							$(".accountinginp").eq(i).val(selectdata.data.vouDetails[i].accoCode + " " + selacclen.attr("fname")).attr("accbal", selectdata.data.vouDetails[i].drCr);
						} else {
							$(".accountinginp").eq(i).val(selectdata.data.vouDetails[i].accoCode + " " + selacclen.find(".ACCO_NAME").text()).attr("accbal", selectdata.data.vouDetails[i].drCr);
						}
						$(".accountinginp").eq(i).parents('.accounting').attr('title', $(".accountinginp").eq(i).val())
						$(".accountinginp").eq(i).next(".accountinginps").find("li").eq(j).removeClass("unselected").addClass("selected");
						$(".accountinginp").eq(i).attr('acca', selacclen.attr('acca'))
						$(".accountinginp").eq(i).attr('accoindex', selacclen.attr('name'))
						$(".accountinginp").eq(i).attr('code', selacclen.find(".ACCO_CODE").text())
						$(".accountinginp").eq(i).attr('name', selacclen.find(".ACCO_NAME").text())
						$(".accountinginp").eq(i).attr('fname', selacclen.attr('fname'))
						$(".accountinginp").eq(i).attr('drcr', selectdata.data.vouDetails[i].drCr)
						if(selacclen.hasClass('fuhs0')){
							$(".accountinginp").eq(i).attr('accitemNum','0')
						}else{
							$(".accountinginp").eq(i).attr('accitemNum', '1')
						}
						var vounowbal = voubalance[selacclen.find(".ACCO_CODE").text()] || 0
						$(".accountinginp").eq(i).attr('cashflow', selacclen.attr('cashflow'))
						$(".accountinginp").eq(i).parents(".accounting").find(".accountingye").show();
						$(".accountinginp").eq(i).parents(".accounting").find(".accountingye").text("余额：" + formatNum(vounowbal));
						$(".accountinginp").eq(i).parents(".accounting").find(".accountingye").attr("title", "余额：" + formatNum(vounowbal));
						$(".accountinginp").eq(i).parents(".accounting").find(".accountingmx").show();
						if (selacclen.hasClass("fuhs0") != true) {
							$(".accountinginp").eq(i).parents(".accounting").find(".fuyan").show()
							var ss = $(".accounting").eq(i).find(".accountinginp").attr("accoindex");
							if (selectdata.data.vouDetails[i].vouDetailAsss != null) {
								var strdata = JSON.stringify(selectdata.data.vouDetails[i].vouDetailAsss)
								$(".accountinginp").eq(i).parents(".accounting").attr('fudata', strdata)
								$(".accountinginp").eq(i).parents(".accounting").attr('accoSurplus', selectdata.data.vouDetails[i].accoSurplus)
								$(".accountinginp").eq(i).parents(".accounting").attr('dfDc', selectdata.data.vouDetails[i].dfDc)
							}
						}
					} else {
						$(".accountinginp").eq(i).val(selectdata.data.vouDetails[i].accoCode);
					}
					if ($("#accounting-container").find("li").eq(j).length < 1) {
						$(".accountinginp").eq(i).val("");
					}
				}
				if (selectdata.data.vouDetails[i].drCr == -1) {
					if (selectdata.data.vouDetails[i].stadAmt == null) { } else {
						if (selectdata.data.vouDetails[i].stadAmt == "" && parseFloat(selectdata.data.vouDetails[i].stadAmt) != 0) {
							$(".moneyd").eq(i).find(".money-sr").val("")
							$(".moneyd").eq(i).find(".money-xs").html("")
							$(".moneyj").eq(i).find(".money-sr").val("")
							$(".moneyj").eq(i).find(".money-xs").html("")
						} else {
							$(".moneyd").eq(i).find(".money-sr").val(parseFloat(selectdata.data.vouDetails[i].stadAmt).toFixed(2)).addClass('money-ys')
							if (selectdata.data.vouDetails[i].stadAmt >= 10000000000 || vousinglepz == true || vousinglepzzy == true) {
								$(".moneyd").eq(i).find(".money-xs").html(formatNum(parseFloat(selectdata.data.vouDetails[i].stadAmt).toFixed(2)))
							} else if (selectdata.data.vouDetails[i].stadAmt < 1 && selectdata.data.vouDetails[i].stadAmt > 0) {
								$(".moneyd").eq(i).find(".money-xs").html('0' + parseFloat(parseFloat(selectdata.data.vouDetails[i].stadAmt).toFixed(2) * 100).toFixed(0))
							} else {
								$(".moneyd").eq(i).find(".money-xs").html(parseFloat(parseFloat(selectdata.data.vouDetails[i].stadAmt).toFixed(2) * 100).toFixed(0))
							}
							$(".moneyj").eq(i).find(".money-sr").val("")
							$(".moneyj").eq(i).find(".money-xs").html("")
						}
					}
				} else {
					if (selectdata.data.vouDetails[i].stadAmt == null) { } else {
						if (selectdata.data.vouDetails[i].stadAmt == "" && parseFloat(selectdata.data.vouDetails[i].stadAmt) != 0) {
							$(".moneyj").eq(i).find(".money-sr").val("")
							$(".moneyj").eq(i).find(".money-xs").html("")
							$(".moneyd").eq(i).find(".money-sr").val("")
							$(".moneyd").eq(i).find(".money-xs").html("")
						} else {
							$(".moneyj").eq(i).find(".money-sr").val(parseFloat(selectdata.data.vouDetails[i].stadAmt).toFixed(2)).addClass('money-ys')
							if (selectdata.data.vouDetails[i].stadAmt >= 10000000000 || vousinglepz == true || vousinglepzzy == true) {
								$(".moneyj").eq(i).find(".money-xs").html(formatNum(parseFloat(selectdata.data.vouDetails[i].stadAmt).toFixed(2)))
							} else if (selectdata.data.vouDetails[i].stadAmt < 1 && selectdata.data.vouDetails[i].stadAmt > 0) {
								$(".moneyj").eq(i).find(".money-xs").html('0' + parseFloat(parseFloat(selectdata.data.vouDetails[i].stadAmt).toFixed(2) * 100).toFixed(0))
							} else {
								$(".moneyj").eq(i).find(".money-xs").html(parseFloat(parseFloat(selectdata.data.vouDetails[i].stadAmt).toFixed(2) * 100).toFixed(0))
							}
							$(".moneyd").eq(i).find(".money-sr").val("")
							$(".moneyd").eq(i).find(".money-xs").html("")
						}
					}
				}
			}
		}
	}

	for (var i = 0; i < $(".accountinginp").length; i++) {
		if ($(".accountinginp").eq(i).attr("cashflow") == "1") {
			$(".xjll").slideDown(100);
			break;
		} else {
			$(".xjll").slideUp(100);
		}
	}
	if(selectdata.data.vouGuid != undefined && selectdata.data.vouGuid != "" && selectdata.data.vouStatus!='C') {
		ufma.ajaxDef('/gl/vou/checkVouNeedSignSur/'+selectdata.data.vouGuid+'/'+selectdata.data.vouSource+'/'+selectdata.data.vouKind,'get','',function(result){
			if(result.data){
				$("#differBtn").slideDown(100).attr('data-fisPerd',selectdata.data.fisPerd);
				$("#differBtn").attr('data-createDate',selectdata.data.createDate).attr('data-createUser',selectdata.data.createUser)
			}else{
				$("#differBtn").slideUp(100);
			}
		})
	}
	$('#voudetailAsstitle .titlename').html("科目：")
	$('#voudetailassyc').html('')
	if (selectdata.data.vouGuid == undefined || selectdata.data.vouGuid == "") {
		$("#leftbgselect").prop("disabled", false)
	} else {
		$("#leftbgselect").prop("disabled", true)
	}
	if (selectdata.data.remark == null) {
		$(".nowu").val("");
	} else {
		$(".nowu").val(selectdata.data.remark);
	}
	$(".voucher-history-zhankai").find("b").addClass("icon-angle-bottom").removeClass("icon-angle-top");
	$(".voucher-history-by").css("height", "0px");
	$(".voucher-history-by").html("");
	vouluru();
	
	newvueTypesetting()
	if (selectdata.data.posterName != null) {
		$("#vfjz").find("span").text(selectdata.data.posterName)
	} else {
		$("#vfjz").find("span").text("")
	}
	if (selectdata.data.auditorName != null) {
		$("#vfsh").find("span").text(selectdata.data.auditorName)
	} else {
		$("#vfsh").find("span").text("")
	}
	if (selectdata.data.inputorName != null) {
		$("#vfzd").find("span").text(selectdata.data.inputorName).attr('code', selectdata.data.inputor)
	} else {
		$("#vfzd").find("span").text("")
	}
	bidui();
}
function huoqufzhs() {
	var _this = $('.voudetailAss')
	var vouDetailAsss = new Array();
	var accoSurplus = ''
	var dfDc = ''
	for (var j = 0; j < _this.find(".voucher-yc").find(".voucher-yc-bo").length; j++) {
		_this.find(".voucher-yc").find(".voucher-yc-bo").eq(j).index = j
		var bodyss = new Object();
		var $ycBt = _this.find(".voucher-yc-bg");
		var headLen = $ycBt.find(".ychead").length - 1;
		for (var k = 0; k < headLen; k++) {
			var dd = $ycBt.find(".ychead").eq(k).attr("name");
			if (dd == 'expireDate' || dd == 'qty' || dd == 'price' || dd == 'exRate') {
				var itemCodeName = $ycBt.find(".voucher-yc-bo").eq(j).find(".ycbody").eq(k).find(".ycbodyinp").val();
				bodyss[dd] = itemCodeName;
			} else if (dd == 'currAmt') {
				var itemCodeName = $ycBt.find(".voucher-yc-bo").eq(j).find(".ycbody").eq(k).find(".ycbodyinp").val().split(",").join("");
				bodyss[dd] = itemCodeName;
			} else if (dd == 'billNo' || dd == 'billDate') {
				var itemCodeName = $ycBt.find(".voucher-yc-bo").eq(j).find(".ycbody").eq(k).find(".ycbodyinp").val();
				bodyss[dd] = itemCodeName;
			} else {
				var itemCode = $ycBt.find(".voucher-yc-bo").eq(j).find(".ycbody").eq(k).find(".ycbodyinp").attr('code');
				bodyss[dd] = itemCode;
			}
		}
		var noshows = JSON.parse(_this.find(".voucher-yc").find(".voucher-yc-bt").find('.noshowdata').attr('noshow'))
		for (var n in noshows) {
			bodyss[n] = noshows[n]
		}
		bodyss.op = "0";
		bodyss.vouDetailSeq = _this.find(".voucher-yc").find(".voucher-yc-bo").eq(j).index();
		bodyss.vouSeq = _this.index();
		bodyss.stadAmt = _this.find(".voucher-yc").find(".voucher-yc-bo").eq(j).find(".yctz").val().split(",").join("");
		vouDetailAsss.push(bodyss);
	}
	return [vouDetailAsss, accoSurplus, dfDc]
}
function huoquone(obj) {
	var _this = obj
	var datass = new Object();
	var abstract;
	if (_this.find(".abstractinp").length > 0) {
		abstract = _this.find(".abstractinp").val();
	} else {
		abstract = '';
	}
	var accoCodeName = _this.find(".accountinginp").val();
	var accoCode = accoCodeName.substring(0, accoCodeName.indexOf(" "));
	if (_this.find(".accountinginp").attr('allname') != undefined) {
		accoCodeName = _this.find(".accountinginp").attr('allname')
	}
	if (_this.find(".moneyj .money-sr").val() == "") {
		var drCr = -1;
		var stadAmt = _this.find(".moneyd .money-sr").val();
	} else {
		var drCr = 1
		var stadAmt = _this.find(".moneyj .money-sr").val();
	}
	var vouDetailAsss = new Array();
	if (_this.find(".accounting").attr('fudata') != undefined) {
		vouDetailAsss = JSON.parse(_this.find(".accounting").attr('fudata'))
		for (var i = 0; i < vouDetailAsss.length; i++) {
			delete vouDetailAsss[i].vouGuid
			delete vouDetailAsss[i].detailAssGuid
			delete vouDetailAsss[i].detailGuid
			vouDetailAsss[i].op = 0
		}
	} else {
		var cwhover = _this.hasClass('voucher-centercw') && _this.parents('.voucher-center').hasClass('voucher-hovercw')
		var yshover = _this.hasClass('voucher-centerys') && _this.parents('.voucher-center').hasClass('voucher-hoverys')
		// var doublehover = true
		if (cwhover || yshover) {
			for (var j = 0; j < $("#voudetailassyc").find(".voucher-yc-bo").length; j++) {
				$("#voudetailassyc").find(".voucher-yc-bo").eq(j).index = j
				var bodyss = new Object();
				var $ycBt =  $("#voudetailassyc").find('.voucher-bgall');
				var headLen = $ycBt.find(".ychead").length - 1;
				for (var k = 0; k < headLen; k++) {
					var dd = $ycBt.find(".ychead").eq(k).attr("name");
					if (dd == 'expireDate' || dd == 'qty' || dd == 'price' || dd == 'exRate') {
						var itemCodeName = $ycBt.find(".voucher-yc-bo").eq(j).find(".ycbody").eq(k).find(".ycbodyinp").val();
						bodyss[dd] = itemCodeName;
					} else if (dd == 'currAmt') {
						var itemCodeName = $ycBt.find(".voucher-yc-bo").eq(j).find(".ycbody").eq(k).find(".ycbodyinp").val().split(",").join("");
						bodyss[dd] = itemCodeName;
					} else if (dd == 'billNo' || dd == 'billDate' || dd == 'bussDate') {
						var itemCodeName = $ycBt.find(".voucher-yc-bo").eq(j).find(".ycbody").eq(k).find(".ycbodyinp").val();
						bodyss[dd] = itemCodeName;
					} else {
						var itemCodeName = $ycBt.find(".voucher-yc-bo").eq(j).find(".ycbody").eq(k).find(".ycbodyinp").val();
						var itemCode = itemCodeName.substring(0, itemCodeName.indexOf(" "));
						bodyss[dd] = itemCode;
					}
				}
				var noshows = JSON.parse($ycBt.find(".voucher-yc-bt").find('.noshowdata').attr('noshow'))
				for (var n in noshows) {
					bodyss[n] = noshows[n]
				}
				bodyss.op = "0";
				bodyss.vouDetailSeq = $ycBt.find(".voucher-yc-bo").eq(j).index();
				bodyss.vouSeq = $(".voucher-centerhalf").eq(i).index();
				if ($(".voucher-centerhalf").eq(i).find(".voucher-yc").eq(z).find(".voucher-yc-bo").eq(j).attr("refBillGuid") != undefined) {
					bodyss.refBillGuid = $ycBt.find(".voucher-yc-bo").eq(j).attr("refBillGuid")
				}
				bodyss.stadAmt = $ycBt.find(".voucher-yc-bo").eq(j).find(".yctz").val().split(",").join("");
				vouDetailAsss.push(bodyss);
			}
		}
	}
	datass.op = "0";
	datass.vouDetailAsss = vouDetailAsss;
	datass.descpt = abstract;
	datass.drCr = drCr;
	datass.stadAmt = stadAmt;
	datass.accoCode = accoCode;
	datass.accaCode = _this.find(".accountinginp").attr('acca')
	if (datass.accaCode == undefined) {
		if (_this.hasClass('voucher-center-ys') || _this.hasClass('voucher-centerys')) {
			datass.accaCode = 2
		} else if (_this.hasClass('voucher-center-cw') || _this.hasClass('voucher-centercw')) {
			datass.accaCode = 1
		}
	}
	datass.vouSeq = _this.index();
	return datass
}

function huoqu() {
	var datasd = new Object();
	if ($(".voucher-head").attr("namess") == undefined) {
		if ($(".voucher-head").attr("tenamess") != undefined) {
			datasd.templateGuid = $(".voucher-head").attr("tenamess");
		}
		datasd.vouKind = "RC";
		if ($("#sppz").val() != '*' && $("#sppz").val() != '') {
			if (isfispredvouno) {
				datasd.vouNo = $("#sppz").val().substring($("#sppz").val().indexOf('-') + 1, $("#sppz").val().length);
			} else {
				datasd.vouNo = $("#sppz").val()
			}
		}
		datasd.optNoType = $("#sppz").attr('optNoType')
		datasd.vouDate = $("#dates").getObj().getValue();
		if ($("#fjd").val() != "") {
			datasd.vouCnt = $("#fjd").val();
		} else {
			datasd.vouCnt = "0";
		}
		datasd.checker = vouchecker
		datasd.vouDesc = '';
		datasd.agencyCode = rpt.nowAgencyCode;
		datasd.setYear = new Date($("#dates").getObj().getValue()).getFullYear();
		datasd.rgCode = ufgovkey.svRgCode;
		if ($("#pzzhuantaiC").attr("vou-status") != undefined) {
			datasd.treasuryHook = $("#pzzhuantaiC").attr("vou-status");
		} else {
			datasd.treasuryHook = selectdata.data.treasuryHook;
		}
		if ($(".xuanzhongcy").text() == "财务会计") {
			datasd.accaCode = 1;
			if ($(".yusuan").attr("names") != undefined) {
				datasd.vouGroupId = $(".yusuan").attr("names")
			}
			if ($(".chaiwu").attr("names") != undefined) {
				datasd.vouGroupId = $(".chaiwu").attr("names")
			}
		} else {
			datasd.accaCode = 2;
			if ($(".chaiwu").attr("names") != undefined) {
				datasd.vouGroupId = $(".chaiwu").attr("names")
			}
			if ($(".yusuan").attr("names") != undefined) {
				datasd.vouGroupId = $(".yusuan").attr("names")
			}
		}
		if (vousinglepz == true || vousinglepzzy == true || rpt.isParallel != "1") {
			datasd.accaCode = "*";
		}
		datasd.acctCode = rpt.nowAcctCode;
		datasd.fiLeader = rpt.createUser;
		if ($(".nowu").val() == "") {
			datasd.remark = "暂无信息"
		} else {
			datasd.remark = $(".nowu").val();
		}
		datasd.vouTypeCode = $("#leftbgselect option:selected").attr("value");
		//保存的op一直为0
		datasd.op = "0";
		var datasss = new Array();
		for (var i = 0; i < $(".voucher-centerhalf").length; i++) {
			if ($(".voucher-centerhalf").eq(i).attr("op") != 2) {
				if ($(".voucher-centerhalf").eq(i).find(".accountinginp").val() != "" || ($(".voucher-centerhalf").eq(i).find(".abstractinp").val() != "" && $(".voucher-centerhalf").eq(i).find(".abstractinp").val() != undefined) || $(".voucher-centerhalf").eq(i).find(".moneyj").find(".money-xs").html() != "" || $(".voucher-centerhalf").eq(i).find(".moneyd").find(".money-xs").html() != "") {
					if (vousinglepzzy && $(".voucher-centerhalf").eq(i).hasClass('voucher-centerys') && $(".voucher-centerhalf").eq(i).find(".accountinginp").val() == "" && $(".voucher-centerhalf").eq(i).find(".moneyj").find(".money-xs").html() == "" && $(".voucher-centerhalf").eq(i).find(".moneyd").find(".money-xs").html() == "") { } else {
						$(".voucher-centerhalf").eq(i).index = i;
						var datass = new Object();
						var abstract;
						if ($(".voucher-centerhalf").eq(i).find(".abstractinp").length > 0) {
							abstract = $(".voucher-centerhalf").eq(i).find(".abstractinp").val();
						} else {
							if ($(".voucher-centerhalf").eq(i).attr('descpt') != undefined && $(".voucher-centerhalf").eq(i).attr('descpt') != '') {
								abstract = $(".voucher-centerhalf").eq(i).attr('descpt')
							} else {
								abstract = $(".voucher-centerhalf").eq(i - 1).find(".abstractinp").val();
							}
						}
						var accoCodeName = $(".voucher-centerhalf").eq(i).find(".accountinginp").val();

						if ($(".voucher-centerhalf").eq(i).find(".accountinginp").attr('allname') != undefined) {
							accoCodeName = $(".voucher-centerhalf").eq(i).find(".accountinginp").attr('allname')
						}
						var accoCode = accoCodeName.substring(0, accoCodeName.indexOf(" "));
						if ($(".voucher-centerhalf").eq(i).find(".moneyj .money-sr").val() == "") {
							var drCr = -1;
							var stadAmt = $(".voucher-centerhalf").eq(i).find(".moneyd .money-sr").val();
						} else {
							var drCr = 1
							var stadAmt = $(".voucher-centerhalf").eq(i).find(".moneyj .money-sr").val();
						}
						var vouDetailAsss = new Array();
						if ($(".voucher-centerhalf").eq(i).find(".accounting").attr('fudata') != undefined) {
							if (JSON.parse($(".voucher-centerhalf").eq(i).find(".accounting").attr('fudata')) != '') {
								vouDetailAsss = JSON.parse($(".voucher-centerhalf").eq(i).find(".accounting").attr('fudata'))
							} else {
								vouDetailAsss = []
							}
							for (var z = 0; z < vouDetailAsss.length; z++) {
								for (var j in vouDetailAsss[z]) {
									if (vouDetailAsss[z][j] == "*") {
										delete vouDetailAsss[z][j]
									}
								}
							}
						} else {
							var cwhover = $(".voucher-centerhalf").eq(i).hasClass('voucher-centercw') && $(".voucher-centerhalf").eq(i).parents('.voucher-center').hasClass('voucher-hovercw')
							var yshover = $(".voucher-centerhalf").eq(i).hasClass('voucher-centerys') && $(".voucher-centerhalf").eq(i).parents('.voucher-center').hasClass('voucher-hoverys')
							// var doublehover = true
							if (cwhover || yshover) {
								for (var j = 0; j < $("#voudetailassyc").find(".voucher-yc-bo").length; j++) {
									if ( $("#voudetailassyc").find(".voucher-yc-bo").eq(j).find(".yctz").val() != "" && parseFloat( $("#voudetailassyc").find(".voucher-yc-bo").eq(j).find(".yctz").val()) != 0) {
										$("#voudetailassyc").find(".voucher-yc-bo").eq(j).index = j
										var bodyss = new Object();
										var $ycBt = $("#voudetailassyc").find('.voucher-bgall');
										var headLen = $ycBt.find(".ychead").length - 1;
										for (var k = 0; k < headLen; k++) {
											var dd = $ycBt.find(".ychead").eq(k).attr("name");
											if (dd == 'expireDate' || dd == 'qty' || dd == 'price' || dd == 'exRate') {
												var itemCodeName = $ycBt.find(".voucher-yc-bo").eq(j).find(".ycbody").eq(k).find(".ycbodyinp").val();
												bodyss[dd] = itemCodeName;
											} else if (dd == 'currAmt') {
												var itemCodeName = $ycBt.find(".voucher-yc-bo").eq(j).find(".ycbody").eq(k).find(".ycbodyinp").val().split(",").join("");
												bodyss[dd] = itemCodeName;
											} else if (dd == 'billNo' || dd == 'billDate' || dd == 'bussDate') {
												var itemCodeName = $ycBt.find(".voucher-yc-bo").eq(j).find(".ycbody").eq(k).find(".ycbodyinp").val();
												bodyss[dd] = itemCodeName;
											} else {
												var itemCodeName = $ycBt.find(".voucher-yc-bo").eq(j).find(".ycbody").eq(k).find(".ycbodyinp").val();
												var itemCode = itemCodeName.substring(0, itemCodeName.indexOf(" "));
												bodyss[dd] = itemCode;
											}
										}
										var noshows = JSON.parse($ycBt.find(".voucher-yc-bt").find('.noshowdata').attr('noshow'))
										for (var n in noshows) {
											bodyss[n] = noshows[n]
										}
										bodyss.op = "0";
										bodyss.vouDetailSeq = $ycBt.find(".voucher-yc-bo").eq(j).index();
										bodyss.vouSeq = $(".voucher-centerhalf").eq(i).index();
										if ($ycBt.find(".voucher-yc-bo").eq(j).attr("refBillGuid") != undefined) {
											bodyss.refBillGuid = $ycBt.find(".voucher-yc-bo").eq(j).attr("refBillGuid")
										}
										bodyss.stadAmt = $ycBt.find(".voucher-yc-bo").eq(j).find(".yctz").val().split(",").join("");
										vouDetailAsss.push(bodyss);
									} else if (voucherupnow) {
										$("#voudetailassyc").find(".voucher-yc-bo").eq(j).index = j
										var bodyss = new Object();
										var $ycBt =  $("#voudetailassyc").find('.voucher-bgall');
										var headLen = $ycBt.find(".ychead").length - 1;
										for (var k = 0; k < headLen; k++) {
											var dd = $ycBt.find(".ychead").eq(k).attr("name");
											if (dd == 'expireDate' || dd == 'qty' || dd == 'price' || dd == 'exRate') {
												var itemCodeName = $ycBt.find(".voucher-yc-bo").eq(j).find(".ycbody").eq(k).find(".ycbodyinp").val();
												bodyss[dd] = itemCodeName;
											} else if (dd == 'currAmt') {
												var itemCodeName = $ycBt.find(".voucher-yc-bo").eq(j).find(".ycbody").eq(k).find(".ycbodyinp").val().split(",").join("");
												bodyss[dd] = itemCodeName;
											} else if (dd == 'billNo' || dd == 'billDate' || dd == 'bussDate') {
												var itemCodeName = $ycBt.find(".voucher-yc-bo").eq(j).find(".ycbody").eq(k).find(".ycbodyinp").val();
												bodyss[dd] = itemCodeName;
											} else {
												var itemCodeName = $ycBt.find(".voucher-yc-bo").eq(j).find(".ycbody").eq(k).find(".ycbodyinp").val();
												var itemCode = itemCodeName.substring(0, itemCodeName.indexOf(" "));
												bodyss[dd] = itemCode;
											}
										}
										var noshows = JSON.parse($ycBt.find(".voucher-yc-bt").find('.noshowdata').attr('noshow'))
										for (var n in noshows) {
											bodyss[n] = noshows[n]
										}
										bodyss.op = "0";
										bodyss.vouDetailSeq = $ycBt.find(".voucher-yc-bo").eq(j).index();
										bodyss.vouSeq = $(".voucher-centerhalf").eq(i).index();
										if ($(".voucher-centerhalf").eq(i).find(".voucher-yc").eq(z).find(".voucher-yc-bo").eq(j).attr("refBillGuid") != undefined) {
											bodyss.refBillGuid = $ycBt.find(".voucher-yc-bo").eq(j).attr("refBillGuid")
										}
										bodyss.stadAmt = $ycBt.find(".voucher-yc-bo").eq(j).find(".yctz").val().split(",").join("");
										vouDetailAsss.push(bodyss);
									}
								}
							}
						}
						datass.op = "0";
						datass.vouDetailAsss = vouDetailAsss;
						datass.descpt = abstract;
						datass.drCr = drCr;
						datass.stadAmt = stadAmt;
						datass.accoCode = accoCode;
						if ($(".voucher-centerhalf").eq(i).attr("refBillGuid") != undefined) {
							datass.refBillGuid = $(".voucher-centerhalf").eq(i).attr("refBillGuid");
						}
						datass.accaCode = $(".voucher-centerhalf").eq(i).find(".accountinginp").attr('acca')
						if (datass.accaCode == undefined) {
							if ($(".voucher-centerhalf").eq(i).hasClass('voucher-center-ys') || $(".voucher-centerhalf").eq(i).hasClass('voucher-centerys')) {
								datass.accaCode = 2
							} else if ($(".voucher-centerhalf").eq(i).hasClass('voucher-center-cw') || $(".voucher-centerhalf").eq(i).hasClass('voucher-centercw')) {
								datass.accaCode = 1
							}
						}
						datass.vouSeq = $(".voucher-centerhalf").eq(i).index();
						datasss.push(datass)
					}
				}
			}
		}
		//获取合计并且转换成为保留两位小数的数字
		if (vousinglepz == false && vousinglepzzy == false) {
			var moneyj = $(".voucher-footer").find(".moneyj .money-xs").html();
			var moneyd = $(".voucher-footer").find(".moneyd .money-xs").html();
			if (moneyj.indexOf(".") >= 0) {
				datasd.amtDr = (parseFloat(commafyback(moneyj))).toFixed(2);
			} else {
				datasd.amtDr = (parseFloat(moneyj) / 100).toFixed(2);
			}
			if (moneyd.indexOf(".") >= 0) {
				datasd.amtCr = (parseFloat(commafyback(moneyd))).toFixed(2);
			} else {
				datasd.amtCr = (parseFloat(moneyd) / 100).toFixed(2);
			}
		} else if (vousinglepz == true && vousinglepzzy == false) {
			var moneyj = $(".voucher-footer").find(".moneyj .money-cw").html();
			var moneyd = $(".voucher-footer").find(".moneyd .money-cw").html();
			if (moneyj.indexOf(".") >= 0) {
				datasd.amtDr = (parseFloat(commafyback(moneyj))).toFixed(2);
			} else {
				datasd.amtDr = (parseFloat(moneyj) / 100).toFixed(2);
			}
			if (moneyd.indexOf(".") >= 0) {
				datasd.amtCr = (parseFloat(commafyback(moneyd))).toFixed(2);
			} else {
				datasd.amtCr = (parseFloat(moneyd) / 100).toFixed(2);
			}
			var ysmoneyj = $(".voucher-footer").find(".moneyj .money-ys").html();
			var ysmoneyd = $(".voucher-footer").find(".moneyd .money-ys").html();
			if (ysmoneyj.indexOf(".") >= 0) {
				datasd.ysAmtDr = (parseFloat(commafyback(ysmoneyj))).toFixed(2);
			} else {
				datasd.ysAmtDr = (parseFloat(ysmoneyj) / 100).toFixed(2);
			}
			if (moneyd.indexOf(".") >= 0) {
				datasd.ysAmtCr = (parseFloat(commafyback(ysmoneyd))).toFixed(2);
			} else {
				datasd.ysAmtCr = (parseFloat(ysmoneyd) / 100).toFixed(2);
			}
		} else if (vousinglepz == false && vousinglepzzy == true) {
			var moneyj = $(".voucher-footer").find(".moneyhjcw .moneyj .money-xs").html();
			var moneyd = $(".voucher-footer").find(".moneyhjcw .moneyd .money-xs").html();
			if (moneyj.indexOf(".") >= 0) {
				datasd.amtDr = (parseFloat(commafyback(moneyj))).toFixed(2);
			} else {
				datasd.amtDr = (parseFloat(moneyj) / 100).toFixed(2);
			}
			if (moneyd.indexOf(".") >= 0) {
				datasd.amtCr = (parseFloat(commafyback(moneyd))).toFixed(2);
			} else {
				datasd.amtCr = (parseFloat(moneyd) / 100).toFixed(2);
			}
			var ysmoneyj = $(".voucher-footer").find(".moneyhjys .moneyj .money-xs").html();
			var ysmoneyd = $(".voucher-footer").find(".moneyhjys .moneyd .money-xs").html();
			if (ysmoneyj.indexOf(".") >= 0) {
				datasd.ysAmtDr = (parseFloat(commafyback(ysmoneyj))).toFixed(2);
			} else {
				datasd.ysAmtDr = (parseFloat(ysmoneyj) / 100).toFixed(2);
			}
			if (moneyd.indexOf(".") >= 0) {
				datasd.ysAmtCr = (parseFloat(commafyback(ysmoneyd))).toFixed(2);
			} else {
				datasd.ysAmtCr = (parseFloat(ysmoneyd) / 100).toFixed(2);
			}
		}
		if (isNaN(parseFloat(datasd.amtDr))) {
			datasd.amtDr = "000";
		}
		if (isNaN(parseFloat(datasd.amtCr))) {
			datasd.amtCr = "000";
		}
		if (isNaN(parseFloat(datasd.ysAmtDr))) {
			datasd.ysAmtDr = "000";
		}
		if (isNaN(parseFloat(datasd.ysAmtCr))) {
			datasd.ysAmtCr = "000";
		}
		datasd.inputor = $("#vfzd").find("span").attr('code')
		datasd.inputorName = $("#vfzd").find("span").text()
		datasd.auditorName = $("#vfsh").find("span").text()
		datasd.posterName = $("#vfjz").find("span").text()
		datasd.vouDetails = datasss;
	} else {
		datasd.checker = vouchecker
		datasd.vouKind = "RC";
		if ($("#sppz").val() != '*' && $("#sppz").val() != '') {
			if (isfispredvouno) {
				datasd.vouNo = $("#sppz").val().substring($("#sppz").val().indexOf('-') + 1, $("#sppz").val().length);
			} else {
				datasd.vouNo = $("#sppz").val()
			}
		}
		datasd.optNoType = '0'
		datasd.vouDate = $("#dates").getObj().getValue();
		if ($("#fjd").val() != "") {
			datasd.vouCnt = $("#fjd").val();
		} else {
			datasd.vouCnt = "0";
		}
		if ($(".xuanzhongcy").text() == "财务会计") {
			datasd.accaCode = 1;
			if ($(".yusuan").attr("names") != undefined) {
				datasd.vouGroupId = $(".yusuan").attr("names")
			}
			if ($(".chaiwu").attr("names") != undefined) {
				datasd.vouGroupId = $(".chaiwu").attr("names")
			}
		} else {
			datasd.accaCode = 2;
			if ($(".chaiwu").attr("names") != undefined) {
				datasd.vouGroupId = $(".chaiwu").attr("names")
			}
			if ($(".yusuan").attr("names") != undefined) {
				datasd.vouGroupId = $(".yusuan").attr("names")
			}
		}
		if (vousinglepz == true || vousinglepzzy == true || rpt.isParallel != "1") {
			datasd.accaCode = "*";
		}
		datasd.vouDesc = selectdata.data.vouDesc;
		datasd.agencyCode = rpt.nowAgencyCode;
		datasd.acctCode = rpt.nowAcctCode;
		//		datasd.printStatus = "1";
		datasd.vouNo = selectdata.data.vouNo;
		datasd.setYear = selectdata.data.setYear;
		datasd.rgCode = selectdata.data.rgCode;
		datasd.isWriteOff = selectdata.data.isWriteOff;
		datasd.writeOffVouTypeName = selectdata.data.writeOffVouTypeName;
		datasd.writeOffVouNo = selectdata.data.writeOffVouNo;
		datasd.writeOffId = selectdata.data.writeOffId;
		datasd.fisPerd = new Date($("#dates").getObj().getValue()).getMonth() + 1;
		//		datasd.counta = "0";
		datasd.vouTypeCode = $("#leftbgselect option:selected").attr("value");
		if (selectdata.data != undefined) {
			datasd.vouNo = selectdata.data.vouNo;
			datasd.setYear = selectdata.data.setYear;
			datasd.rgCode = selectdata.data.rgCode;
			datasd.fisPerd = new Date($("#dates").getObj().getValue()).getMonth() + 1;
			datasd.errFlag = selectdata.data.errFlag;;
			if ($("#pzzhuantai").attr("vou-status") != undefined) {
				datasd.vouStatus = $("#pzzhuantai").attr("vou-status");
			} else {
				datasd.vouStatus = selectdata.data.vouStatus;
			}
			if ($("#pzzhuantaiC").attr("vou-status") != undefined) {
				datasd.treasuryHook = $("#pzzhuantaiC").attr("vou-status");
			} else {
				datasd.treasuryHook = selectdata.data.treasuryHook;
			}
			//datasd.vouTypeCode = selectdata.data.vouTypeCode;
		}
		//		datasd.errMessage = "string";
		datasd.fiLeader = rpt.createUser;
		if ($(".nowu").val() == "") {
			datasd.remark = "暂无信息"
		} else {
			datasd.remark = $(".nowu").val();
		}
		//修改保存时候最外部元素默认为1
		//drcr为-1时候为贷方,为1的时候为借
		datasd.op = "1";
		datasd.lastVer = selectdata.data.lastVer;
		var datasss = new Array();
		for (var i = 0; i < $(".voucher-centerhalf").length; i++) {
			if ($(".voucher-centerhalf").eq(i).find(".accountinginp").val() != "" || $(".voucher-centerhalf").eq(i).find(".abstractinp").val() != "" || $(".voucher-centerhalf").eq(i).find(".moneyj").find(".money-xs").html() != "" || $(".voucher-centerhalf").eq(i).find(".moneyd").find(".money-xs").html() != "") {
				if (vousinglepzzy && $(".voucher-centerhalf").eq(i).hasClass('voucher-centerys') && $(".voucher-centerhalf").eq(i).find(".accountinginp").val() == "" && $(".voucher-centerhalf").eq(i).find(".moneyj").find(".money-xs").html() == "" && $(".voucher-centerhalf").eq(i).find(".moneyd").find(".money-xs").html() == "") {
					if ($(".voucher-centerhalf").eq(i).attr("namess") != undefined) {
						$(".voucher-centerhalf").eq(i).index = i;
						var datass = new Object();
						datass.op = '2';
						datass.vouGuid = $(".voucher-centerhalf").eq(i).attr("namess");
						datass.detailGuid = $(".voucher-centerhalf").eq(i).attr("namesss");
						datass.vouSeq = $(".voucher-centerhalf").eq(i).index();
						datasss.push(datass);
					}
				} else {
					$(".voucher-centerhalf").eq(i).index = i;
					var datass = new Object();
					var abstract;
					if ($(".voucher-centerhalf").eq(i).find(".abstractinp").length > 0) {
						abstract = $(".voucher-centerhalf").eq(i).find(".abstractinp").val();
					} else {
						if ($(".voucher-centerhalf").eq(i).attr('descpt') != undefined && $(".voucher-centerhalf").eq(i).attr('descpt') != '') {
							abstract = $(".voucher-centerhalf").eq(i).attr('descpt')
						} else {
							abstract = $(".voucher-centerhalf").eq(i - 1).find(".abstractinp").val();
						}
					}
					var accoCodeName = $(".voucher-centerhalf").eq(i).find(".accountinginp").val();
					if ($(".voucher-centerhalf").eq(i).find(".accountinginp").attr('allname') != undefined) {
						accoCodeName = $(".voucher-centerhalf").eq(i).find(".accountinginp").attr('allname')
					}
					var accoCode = accoCodeName.substring(0, accoCodeName.indexOf(" "));
					if ($(".voucher-centerhalf").eq(i).find(".moneyj .money-sr").val() == "") {
						var drCr = -1;
						var stadAmt = $(".voucher-centerhalf").eq(i).find(".moneyd .money-sr").val();
					} else {
						var drCr = 1
						var stadAmt = $(".voucher-centerhalf").eq(i).find(".moneyj .money-sr").val();
					}
					var vouDetailAsss = new Array();
					if ($(".voucher-centerhalf").eq(i).find(".accounting").attr('fudata') != undefined) {
						if (JSON.parse($(".voucher-centerhalf").eq(i).find(".accounting").attr('fudata')) != '') {
							vouDetailAsss = JSON.parse($(".voucher-centerhalf").eq(i).find(".accounting").attr('fudata'))
						} else {
							vouDetailAsss = []
						}
						for (var z = 0; z < vouDetailAsss.length; z++) {
							for (var j in vouDetailAsss[z]) {
								if (vouDetailAsss[z][j] == "*") {
									delete vouDetailAsss[z][j]
								}
							}
						}
						datass['accoSurplus'] = $(".voucher-centerhalf").eq(i).find(".accounting").attr('accoSurplus')
						datass['dfDc'] = $(".voucher-centerhalf").eq(i).find(".accounting").attr('dfDc')
					} else {
						var cwhover = $(".voucher-centerhalf").eq(i).hasClass('voucher-centercw') && $(".voucher-centerhalf").eq(i).parents('.voucher-center').hasClass('voucher-hovercw')
						var yshover = $(".voucher-centerhalf").eq(i).hasClass('voucher-centerys') && $(".voucher-centerhalf").eq(i).parents('.voucher-center').hasClass('voucher-hoverys')
						// var doublehover = true
						if (cwhover || yshover) {
							for (var j = 0; j < $("#voudetailassyc").find(".voucher-yc-bo").length; j++) {
								if ( $("#voudetailassyc").find(".voucher-yc-bo").eq(j).find(".yctz").val() != "" && parseFloat( $("#voudetailassyc").find(".voucher-yc-bo").eq(j).find(".yctz").val()) != 0) {
									$("#voudetailassyc").find(".voucher-yc-bo").eq(j).index = j
									var bodyss = new Object();
									var $ycBt = $("#voudetailassyc").find('.voucher-bgall');
									var headLen = $ycBt.find(".ychead").length - 1;
									for (var k = 0; k < headLen; k++) {
										var dd = $ycBt.find(".ychead").eq(k).attr("name");
										if (dd == 'expireDate' || dd == 'qty' || dd == 'price' || dd == 'exRate') {
											var itemCodeName = $ycBt.find(".voucher-yc-bo").eq(j).find(".ycbody").eq(k).find(".ycbodyinp").val();
											bodyss[dd] = itemCodeName;
										} else if (dd == 'currAmt') {
											var itemCodeName = $ycBt.find(".voucher-yc-bo").eq(j).find(".ycbody").eq(k).find(".ycbodyinp").val().split(",").join("");
											bodyss[dd] = itemCodeName;
										} else if (dd == 'billNo' || dd == 'billDate' || dd == 'bussDate') {
											var itemCodeName = $ycBt.find(".voucher-yc-bo").eq(j).find(".ycbody").eq(k).find(".ycbodyinp").val();
											bodyss[dd] = itemCodeName;
										} else {
											var itemCodeName = $ycBt.find(".voucher-yc-bo").eq(j).find(".ycbody").eq(k).find(".ycbodyinp").val();
											var itemCode = itemCodeName.substring(0, itemCodeName.indexOf(" "));
											bodyss[dd] = itemCode;
										}
									}
									var noshows = JSON.parse($ycBt.find(".voucher-yc-bt").find('.noshowdata').attr('noshow'))
									for (var n in noshows) {
										bodyss[n] = noshows[n]
									}
									bodyss.op = "0";
									bodyss.vouDetailSeq = $ycBt.find(".voucher-yc-bo").eq(j).index();
									bodyss.vouSeq = $(".voucher-centerhalf").eq(i).index();
									if ($ycBt.find(".voucher-yc-bo").eq(j).attr("refBillGuid") != undefined) {
										bodyss.refBillGuid = $ycBt.find(".voucher-yc-bo").eq(j).attr("refBillGuid")
									}
									bodyss.stadAmt = $ycBt.find(".voucher-yc-bo").eq(j).find(".yctz").val().split(",").join("");
									vouDetailAsss.push(bodyss);
								} else if (voucherupnow) {
									$("#voudetailassyc").find(".voucher-yc-bo").eq(j).index = j
									var bodyss = new Object();
									var $ycBt =  $("#voudetailassyc").find('.voucher-bgall');
									var headLen = $ycBt.find(".ychead").length - 1;
									for (var k = 0; k < headLen; k++) {
										var dd = $ycBt.find(".ychead").eq(k).attr("name");
										if (dd == 'expireDate' || dd == 'qty' || dd == 'price' || dd == 'exRate') {
											var itemCodeName = $ycBt.find(".voucher-yc-bo").eq(j).find(".ycbody").eq(k).find(".ycbodyinp").val();
											bodyss[dd] = itemCodeName;
										} else if (dd == 'currAmt') {
											var itemCodeName = $ycBt.find(".voucher-yc-bo").eq(j).find(".ycbody").eq(k).find(".ycbodyinp").val().split(",").join("");
											bodyss[dd] = itemCodeName;
										} else if (dd == 'billNo' || dd == 'billDate' || dd == 'bussDate') {
											var itemCodeName = $ycBt.find(".voucher-yc-bo").eq(j).find(".ycbody").eq(k).find(".ycbodyinp").val();
											bodyss[dd] = itemCodeName;
										} else {
											var itemCodeName = $ycBt.find(".voucher-yc-bo").eq(j).find(".ycbody").eq(k).find(".ycbodyinp").val();
											var itemCode = itemCodeName.substring(0, itemCodeName.indexOf(" "));
											bodyss[dd] = itemCode;
										}
									}
									var noshows = JSON.parse($ycBt.find(".voucher-yc-bt").find('.noshowdata').attr('noshow'))
									for (var n in noshows) {
										bodyss[n] = noshows[n]
									}
									bodyss.op = "0";
									bodyss.vouDetailSeq = $ycBt.find(".voucher-yc-bo").eq(j).index();
									bodyss.vouSeq = $(".voucher-centerhalf").eq(i).index();
									if ($(".voucher-centerhalf").eq(i).find(".voucher-yc").eq(z).find(".voucher-yc-bo").eq(j).attr("refBillGuid") != undefined) {
										bodyss.refBillGuid = $ycBt.find(".voucher-yc-bo").eq(j).attr("refBillGuid")
									}
									bodyss.stadAmt = $ycBt.find(".voucher-yc-bo").eq(j).find(".yctz").val().split(",").join("");
									vouDetailAsss.push(bodyss);
								}
							}
						}
					}
					if ($(".voucher-centerhalf").eq(i).attr("namess") == undefined) {
						datass.op = 0;
					} else {
						datass.op = $(".voucher-centerhalf").eq(i).attr("op");
					}
					datass.vouGuid = $(".voucher-centerhalf").eq(i).attr("namess");
					datass.detailGuid = $(".voucher-centerhalf").eq(i).attr("namesss");
					if ($(".voucher-centerhalf").eq(i).attr("refBillGuid") != undefined) {
						datass.refBillGuid = $(".voucher-centerhalf").eq(i).attr("refBillGuid");
					}
					datass.vouDetailAsss = vouDetailAsss;
					datass.descpt = abstract;
					datass.drCr = drCr;
					datass.stadAmt = stadAmt;
					datass.accoCode = accoCode;
					datass.accaCode = $(".voucher-centerhalf").eq(i).find(".accountinginp").attr('acca')
					if (datass.accaCode == undefined) {
						if ($(".voucher-centerhalf").eq(i).hasClass('voucher-center-ys') || $(".voucher-centerhalf").eq(i).hasClass('voucher-centerys')) {
							datass.accaCode = 2
						} else if ($(".voucher-centerhalf").eq(i).hasClass('voucher-center-cw') || $(".voucher-centerhalf").eq(i).hasClass('voucher-centercw')) {
							datass.accaCode = 1
						}
					}
					datass.vouSeq = $(".voucher-centerhalf").eq(i).index();
					datasss.push(datass)
				}

			}

		}
		if (vousinglepz == false && vousinglepzzy == false) {
			var moneyj = $(".voucher-footer").find(".moneyj .money-xs").html();
			var moneyd = $(".voucher-footer").find(".moneyd .money-xs").html();
			if (moneyj.indexOf(".") >= 0) {
				datasd.amtDr = (parseFloat(commafyback(moneyj))).toFixed(2);
			} else {
				datasd.amtDr = (parseFloat(moneyj) / 100).toFixed(2);
			}
			if (moneyd.indexOf(".") >= 0) {
				datasd.amtCr = (parseFloat(commafyback(moneyd))).toFixed(2);
			} else {
				datasd.amtCr = (parseFloat(moneyd) / 100).toFixed(2);
			}
		} else if (vousinglepz == true && vousinglepzzy == false) {
			var moneyj = $(".voucher-footer").find(".moneyj .money-cw").html();
			var moneyd = $(".voucher-footer").find(".moneyd .money-cw").html();
			if (moneyj.indexOf(".") >= 0) {
				datasd.amtDr = (parseFloat(commafyback(moneyj))).toFixed(2);
			} else {
				datasd.amtDr = (parseFloat(moneyj) / 100).toFixed(2);
			}
			if (moneyd.indexOf(".") >= 0) {
				datasd.amtCr = (parseFloat(commafyback(moneyd))).toFixed(2);
			} else {
				datasd.amtCr = (parseFloat(moneyd) / 100).toFixed(2);
			}
			var ysmoneyj = $(".voucher-footer").find(".moneyj .money-ys").html();
			var ysmoneyd = $(".voucher-footer").find(".moneyd .money-ys").html();
			if (ysmoneyj.indexOf(".") >= 0) {
				datasd.ysAmtDr = (parseFloat(commafyback(ysmoneyj))).toFixed(2);
			} else {
				datasd.ysAmtDr = (parseFloat(ysmoneyj) / 100).toFixed(2);
			}
			if (moneyd.indexOf(".") >= 0) {
				datasd.ysAmtCr = (parseFloat(commafyback(ysmoneyd))).toFixed(2);
			} else {
				datasd.ysAmtCr = (parseFloat(ysmoneyd) / 100).toFixed(2);
			}
		} else if (vousinglepz == false && vousinglepzzy == true) {
			var moneyj = $(".voucher-footer").find(".moneyhjcw .moneyj .money-xs").html();
			var moneyd = $(".voucher-footer").find(".moneyhjcw .moneyd .money-xs").html();
			if (moneyj.indexOf(".") >= 0) {
				datasd.amtDr = (parseFloat(commafyback(moneyj))).toFixed(2);
			} else {
				datasd.amtDr = (parseFloat(moneyj) / 100).toFixed(2);
			}
			if (moneyd.indexOf(".") >= 0) {
				datasd.amtCr = (parseFloat(commafyback(moneyd))).toFixed(2);
			} else {
				datasd.amtCr = (parseFloat(moneyd) / 100).toFixed(2);
			}
			var ysmoneyj = $(".voucher-footer").find(".moneyhjys .moneyj .money-xs").html();
			var ysmoneyd = $(".voucher-footer").find(".moneyhjys .moneyd .money-xs").html();
			if (ysmoneyj.indexOf(".") >= 0) {
				datasd.ysAmtDr = (parseFloat(commafyback(ysmoneyj))).toFixed(2);
			} else {
				datasd.ysAmtDr = (parseFloat(ysmoneyj) / 100).toFixed(2);
			}
			if (moneyd.indexOf(".") >= 0) {
				datasd.ysAmtCr = (parseFloat(commafyback(ysmoneyd))).toFixed(2);
			} else {
				datasd.ysAmtCr = (parseFloat(ysmoneyd) / 100).toFixed(2);
			}
		}
		if (isNaN(parseFloat(datasd.amtDr))) {
			datasd.amtDr = "000";
		}
		if (isNaN(parseFloat(datasd.amtCr))) {
			datasd.amtCr = "000";
		}
		if (isNaN(parseFloat(datasd.ysAmtDr))) {
			datasd.ysAmtDr = "000";
		}
		if (isNaN(parseFloat(datasd.ysAmtCr))) {
			datasd.ysAmtCr = "000";
		}
		datasd.inputor = $("#vfzd").find("span").attr('code')
		datasd.inputorName = $("#vfzd").find("span").text()
		datasd.auditorName = $("#vfsh").find("span").text()
		datasd.posterName = $("#vfjz").find("span").text()
		datasd.vouGuid = $(".voucher-head").attr("namess");
		datasd.vouDetails = datasss;
	}
	return datasd;
}
function noBC() {
	$("#btn-voucher-bc").addClass("btn-disablesd")
	$("#btn-voucher-bcbxz").addClass("btn-disablesd")
	$("#btn-voucher-bcbdy").addClass("btn-disablesd")
	$("#btn-voucher-zc").addClass("btn-disablesd")
	$("#mbbc").addClass("btn-disablesd")
}
function zhuantai() {
	voucherindex = 0;
	if (selectdata.data.templateGuid == undefined || selectdata.data.templateGuid == '') {
		$(".voucher-head").attr("namess", selectdata.data.vouGuid);
		$(".voucher-head").removeAttr("tenamess")
	} else {
		$(".voucher-head").attr("tenamess", selectdata.data.templateGuid);
		$(".voucher-head").removeAttr("namess")
	}
	if (selectdata.data.vouGuid == '') {
		$(".voucher-head").removeAttr("namess")
	}
	if (selectdata.data.treasuryHook == 1) {
		if ($('.yusuan').hasClass("xuanzhongcy") || vousinglepz || vousinglepzzy) {
			$("#pzzhuantaiC").show();
		} else {
			$("#pzzhuantaiC").hide();
		}
		$("#pzzhuantaiC").css("background", "rgb(236, 210, 21)").text("未挂接").attr("vou-status", selectdata.data.treasuryHook)
	} else if (selectdata.data.treasuryHook == 2) {
		if ($('.yusuan').hasClass("xuanzhongcy") || vousinglepz || vousinglepzzy) {
			$("#pzzhuantaiC").show();
		} else {
			$("#pzzhuantaiC").hide();
		}
		$("#pzzhuantaiC").css("background", "rgb(236, 210, 21)").text("已挂接").attr("vou-status", selectdata.data.treasuryHook)
	} else if (selectdata.data.treasuryHook == 3) {
		$("#pzzhuantaiC").hide();
		$("#pzzhuantaiC").css("background", "rgb(236, 210, 21)").text("已挂接").attr("vou-status", selectdata.data.treasuryHook)
	} else {
		$("#pzzhuantaiC").hide().text("").removeAttr("vou-status");
	}
	if (selectdata.data.errFlag != 0 && $(".voucher-head").attr("namess") != undefined) {
		$("#xiaocuo").show();
	} else {
		$("#xiaocuo").hide();
	}
	if (selectdata.data.remark == null) {
		$(".nowu").val("");
	} else {
		$(".nowu").val(selectdata.data.remark);
	}
	$(".voucher-head").attr("op", selectdata.data.op);
	if (selectdata.data.templateGuid == undefined || selectdata.data.templateGuid == '') {
		if (selectdata.data.errFlag == 0 || selectdata.data.vouStatus == "C") {
			$("#xiaocuo").hide();
			if (selectdata.data.vouStatus == "O") {
				$("#pzzhuantai").show();
				$("#pzzhuantai").css("background", "#00A553");
				$("#pzzhuantai").text("未审核").attr("vou-status", selectdata.data.vouStatus);
				$(".datesno").hide()
				vouchakan();
				if (selectdata.data.vouDetails != undefined) {
					for (i = 0; i < selectdata.data.vouDetails.length; i++) {
						if (selectdata.data.vouDetails[i].op != 3 && issindouxg) {
							voubiaoji();
							break;
						}
					}
				}
			} else if (selectdata.data.vouStatus == "A") {
				$("#pzzhuantai").show();
				$("#pzzhuantai").css("background", "#00A553");
				$("#pzzhuantai").text("已审核").attr("vou-status", selectdata.data.vouStatus);
				$(".datesno").show()
				vouyishenhe();
			} else if (selectdata.data.vouStatus == "C") {
				$("#pzzhuantai").show();
				$("#pzzhuantai").css("background", "#EE4033");
				$("#pzzhuantai").text("已作废").attr("vou-status", selectdata.data.vouStatus);
				$(".datesno").show()
				vouyizuofei();
			} else if (selectdata.data.vouStatus == "P") {
				$("#pzzhuantai").show();
				$("#pzzhuantai").css("background", "#00A553");
				$("#pzzhuantai").text("已记账").attr("vou-status", selectdata.data.vouStatus);
				$(".datesno").show()
				vouyijizhang();
			} else {
				$("#pzzhuantai").hide().text("").removeAttr("vou-status");
				vouluru()
			}
		} else if (selectdata.data.errFlag == 2) {
			$("#pzzhuantai").show();
			$("#pzzhuantai").css("background", "#00A553");
			$("#pzzhuantai").text("已改错");
			vouyigaicuo()
		} else if (selectdata.data.errFlag == 1) {
			$("#pzzhuantai").show();
			$("#pzzhuantai").css("background", "#ffc017");
			$("#pzzhuantai").text("未改错");
			vouweigaicuo()
		}
	} else {
		vouluru();
	}
	
}

function afterAddRow() {
	//	if($(document).scrollTop() + document.documentElement.clientHeight > $(".voucherall").height()) {}else{
	//		var sc = $(document).scrollTop();
	//		$(window).scrollTop(sc+50);
	//	}
}

function cwyspd() {
	if (selectdata.data != undefined) {
		if (selectdata.data.accaCode == 1) {
			$(".chaiwu").addClass("xuanzhongcy").removeAttr("names");
			$(".yusuan").removeClass("xuanzhongcy").removeAttr("names");
			$(".xuanzhongcy").attr("names", selectdata.data.vouGroupId);
		} else if (selectdata.data.accaCode == 2) {
			$(".yusuan").addClass("xuanzhongcy").removeAttr("names");
			$(".chaiwu").removeClass("xuanzhongcy").removeAttr("names");
			$(".xuanzhongcy").attr("names", selectdata.data.vouGroupId);
		}
		if (selectdata.data.accaCode == "*") {
			$(".chaiwu").addClass(".xuanzhongcy").attr("names", selectdata.data.vouGroupId);
		}
		voutypeword()
		if ($("#leftbgselect option").length > 0) {
			if (isfispredvouno) {
				var voufispred = (new Date($("#dates").getObj().getValue()).getMonth()) + 1
				if (voufispred < 10) {
					voufispred = '0' + voufispred
				}
				$(".voucherhe").find("#sppz").val(voufispred + '-' + vouCurrMaxVouNo);
			} else {
				$(".voucherhe").find("#sppz").val(vouCurrMaxVouNo);
			}
		} else {
			$(".voucherhe").find("#sppz").val('');
		}
	}
}
var quanjuvouchaiwu = new Object();
var quanjuvouyusuan = new Object();

$(document).on('change', '#vouaccRelationtable .checkalls', function () {
	if ($(this).is(':checked')) {
		$("#vouaccRelationtable input[type='checkbox']").prop('checked', true)
	} else {
		$("#vouaccRelationtable input[type='checkbox']").prop('checked', false)
	}
})
$(document).on('click', '#btn-Relationsave', function () {
	var datar = []
	for (var i = 0; i < $('#vouaccRelationtable tbody tr').length; i++) {
		if ($('#vouaccRelationtable tbody tr').eq(i).find("input[type='checkbox']").is(':checked')) {
			var datanow = eval("(" + $('#vouaccRelationtable tbody tr').eq(i).attr('datas') + ")")
			datar.push(datanow)
		}
	}
	var thisindex = $("#vouaccRelationtable").attr('remind') - 1
	if ($('.voucher').hasClass('voucher-singelzybg')) {
		thisindex = $("#vouaccRelationtable").attr('remind')
	}
	var dataup = huoqu('isf')
	if (datar.length == 1) {
		voucopydata = datar[0]
		chapzone($('.voucher-centerhalf').eq(thisindex))
		page.editor.close()
	} else if (datar.length > 1) {
		for (var i = 0; i < datar.length; i++) {
			dataup.vouDetails.push(datar[i])
		}
		if (selectdata.data == undefined) {
			selectdata.data = {}
		}
		selectdata.data.vouDetails = dataup.vouDetails
		chapz()
		zhuantai()
		page.editor.close()
		isfocusmodal = true
	}
})
$(document).on('click', '#btn-Relationqx', function () {
	var thisindex = $("#vouaccRelationtable").attr('remind') - 1
	if ($('.voucher').hasClass('voucher-singelzybg')) {
		thisindex = $("#vouaccRelationtable").attr('remind')
	}
	$('.voucher-center').eq(thisindex).find('.accountinginp').val('1').focus().val('')
	page.editor.close()
	isfocusmodal = true
})
$(document).on('click', '#btn-bcb', function () {
	var databc = huoqu()
	var tiao = ''
	for (var i = 0; i < databc.vouDetails.length; i++) {
		if (databc.vouDetails[i].accoCode == '1211') {
			tiao = '应收'
			break;
		} else if (databc.vouDetails[i].accoCode == '2301') {
			tiao = '应付'
			break;
		}
	}
	if(tiao == '') {
		ufma.showTip("您当前凭证没有备查簿科目", function() {}, 'warning')
	} else if(tiao == '应收') {
		var baseUrl = '/pf/gl/notesReceivable/notesReceivable.html?username=9092&isvou=true&menuid=e7e70c9a-45aa-4ab1-9d1d-68ba6ffdeae6&menuname=%E5%BA%94%E6%94%B6%E7%A5%A8%E6%8D%AE%E5%A4%87%E6%9F%A5%E7%B0%BF&firstLevel=31';
		uf.openNewPage(page.isCrossDomain, $(this), 'openMenu', baseUrl, false, "应收票据备查簿");
	} else if(tiao == '应付') {
		var baseUrl = '/pf/gl/notesPayable/notesPayable.html?username=9092&isvou=true&menuid=0a6f6771-dc35-48f1-9ba5-8cb5e31ae717&menuname=%E5%BA%94%E4%BB%98%E7%A5%A8%E6%8D%AE%E5%A4%87%E6%9F%A5%E7%B0%BF&firstLevel=31';
		uf.openNewPage(page.isCrossDomain, $(this), 'openMenu', baseUrl, false, "应付票据备查簿");
	}
})
$(document).on('click','#differBtn',function(){
	var guid = $('.voucher-head').attr('namess')
	if($.isNull(guid)){
		ufma.showTip('请保存凭证后再登记差异项',function(){},'warning')
	}else{
		var Data = {
			'fisPerd':$(this).attr('data-fisPerd'),
			'surGuid':'',
			'createDate':$(this).attr('data-createDate'),
			'createUser':$(this).attr('data-createUser')
		}
		ufma.open({
			title: '登记差异项',
			width: 1200,
			url: '/pf/gl/differRegist/differRegistSet.html',
			data: {
				"acctCode": rpt.nowAcctCode,      
				"agencyCode": rpt.nowAgencyCode,
				'guid':guid,
				'datas':Data,
				'issave':true
			},
			ondestory: function (result) {
			}
		});
	}
})