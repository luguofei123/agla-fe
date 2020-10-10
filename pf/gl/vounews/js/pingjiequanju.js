var rpt = {};
rpt.portList = {
	agencyList: "/gl/eleAgency/getAgencyTree", //单位列表接口
	acctList: "/gl/eleCoacc/getRptAccts" //账套列表接口
};
if(getUrlParam("action") == "preview" || getUrlParam("action") == "voumodel") {
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
	if(getUrlParam("action") == "preview"){
		$("#showMethodTip").css({
			'top': '52px',
			'z-index': '11'
		})
		$("#vouHangup").css({
			'top': '53px',
			'z-index': '11'
		})
		$("#vouaccSearchs").hide()
	}else{
		$(".vouchertitle").css('visibility',"hidden")
		$('.voucherhe').css('visibility',"hidden")
		$('.voucherfo').css('visibility',"hidden")
	}
	$(".voucherall").css('margin-top', '-50px')
} else {
	rpt.nowAgencyCode = ufgovkey.svAgencyCode; //登录单位代码
	rpt.nowAgencyName = ufgovkey.svAgencyName; //登录单位名称
	rpt.nowAcctCode = ufgovkey.svAcctCode; //账套代码
	rpt.nowAcctName = ufgovkey.svAcctName; //账套名称
}
if(getUrlParam("agencyCode") != undefined && getUrlParam("agencyCode") != null) {
	rpt.nowAgencyCode = getUrlParam("agencyCode")
}
if(getUrlParam("acctCode") != undefined && getUrlParam("acctCode") != null) {
	rpt.nowAcctCode = getUrlParam("acctCode")
}
rpt.isParallel = 0; //是否平行记账，0：否，没有预算会计页签，1：是，
rpt.createUser = ""; //账套创建人
rpt.nowSetYear = ufgovkey.svSetYear
rpt.nowUserId = ufgovkey.svUserId
rpt.cbAgency = $("#cbAgency").ufmaTreecombox2({
	valueField: 'id',
	textField: 'codeName',
	readonly: false,
	placeholder: '请选择单位',
	icon: 'icon-unit',
	onchange: function(data) {
		//给全局单位变量赋值
		rpt.nowAgencyCode = data.id;
		rpt.nowAgencyName = data.name;
		rpt.AgencyTypeCode = data.agencyType;
		//请求账套列表
		rpt.reqAcctList();
		prevnextvoucher = -1;
		if(rpt.isParallel != "1") {
			$(".chaiwu").hide();
			$(".yusuan").hide();
		} else {
			$(".chaiwu").show();
			$(".yusuan").show();
		}
		//刚开始打开的时候读取是否显示凭证号带期间，初始化需求
		ufma.ajaxDef("/gl/vou/getSysRuleSet/" + rpt.nowAgencyCode + "?chrCodes=GL001,GL005,GL002,GL011,GL012,GL010,GL026,GL028,GL038,GL035,GL044,GL046,GL047,GL050,GL051,GL052,GL053,GL054,GL059,GL061,GL062,GL063",'get', "", function(data) {
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
			isdepartmentChange = data.data.GL062;
			ismodifybtn = data.data.GL063;
			if(ifForIndex != true) {
				isvousourceclick = true
			}
			if(data.data.GL026 == true) {
				//显示挂接按钮
				$("#vouaccSearchs").css("right",'393px')
				$('#vouHangup').show().removeClass('noshow');
			} else if(data.data.GL026 == false) {
				$("#vouaccSearchs").css("right",'276px')
				$('#vouHangup').hide().addClass('noshow');
			}
		});
		var params = {
			selAgecncyCode: rpt.nowAgencyCode,
			selAgecncyName: rpt.nowAgencyName,
			selAcctCode: rpt.nowAcctCode,
			selAcctName: rpt.nowAcctName
		}
		ufma.setSelectedVar(params);
		setInterval(function() {
			ufma.get("/gl/vou/requestQueryCheck", "",function(data) {});
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
	onchange: function(data) {
		//给全局账套变量赋值
		rpt.isDoubleVou = data.isDoubleVou
		rpt.nowAcctCode = data.code;
		rpt.nowAcctName = data.name;
		rpt.isParallel = data.isParallel
		if(window.ownerData!=undefined && window.ownerData.agencyCode == '*'){
			rpt.nowAgencyCode = '*'
		}
		if(window.ownerData!=undefined && window.ownerData.acctCode == '*'){
			rpt.nowAcctCode = '*'
		}
		var params = {
			selAgecncyCode: rpt.nowAgencyCode,
			selAgecncyName: rpt.nowAgencyName,
			selAcctCode: rpt.nowAcctCode,
			selAcctName: rpt.nowAcctName
		}
		page.Codenameacct = {}
		ufma.setSelectedVar(params);
		$(".voucherleft").hide();
		ufma.ajaxDef('/pub/user/menu/config/select?agencyCode='+rpt.nowAgencyCode+'&acctCode='+rpt.nowAcctCode+'&menuId=f24c3333-9799-439a-94c9-f0cdf120305d', "get", '', function(data) {
   			nowvoutype = data.data.voutype
   			if(data.data.vouisdouble == 1){
   				if($("#vouislrud").hasClass('zys')) {
					$("#vouislrud").find('#vouisdoublesingle').prop('checked', true).attr('checked', true)
					$("#vouislrud").find('#vouisdoublesingles').prop('checked', false).attr('checked', false)
				} else {
					$("#vouislrud").addClass('zys')
					$("#vouislrud").find('#vouisdoublesingle').prop('checked', true).attr('checked', true)
					$("#vouislrud").find('#vouisdoublesingles').prop('checked', false).attr('checked', false)
				}
   			}else{
				if($("#vouislrud").hasClass('zys')) {
					$("#vouislrud").removeClass('zys')
					$("#vouislrud").find('#vouisdoublesingles').prop('checked', true).attr('checked', true)
					$("#vouislrud").find('#vouisdoublesingle').prop('checked', false).attr('checked', false)
				}
   			}
   			if(data.data.vouisfullname == 1){
				isaccfullname = true
				$("#vouisfullname").find('#vouisfullnamesingle').prop('checked', true).attr('checked', true)
				$("#vouisfullname").find('#vouisfullnamesingles').prop('checked', false).attr('checked', false)
   			}else{
				isaccfullname = false
				$("#vouisfullname").find('#vouisfullnamesingle').prop('checked', false).attr('checked', false)
				$("#vouisfullname").find('#vouisfullnamesingles').prop('checked', true).attr('checked', true)
   			}
   			if(data.data.vouisvaguesearch == 1){
   				$("#vouisvaguesearch").prop('checked', true).attr('checked', true)
				$("#vouisvaguesearchs").prop('checked', false).attr('checked', false)
				vouisvague = false
   			}else{
   				$("#vouisvaguesearchs").prop('checked', true).attr('checked', true)
				$("#vouisvaguesearch").prop('checked', false).attr('checked', false)
				vouisvague = true
   			}
   			if(data.data.vouiscopyprevAss == 1){
   				$("#vouiscopyprevAsss").prop('checked', false).attr('checked', false)
				$("#vouiscopyprevAss").prop('checked', true).attr('checked', true)
				vouiscopyprevAss = true
   			}else{
   				$("#vouiscopyprevAsss").prop('checked', true).attr('checked', true)
				$("#vouiscopyprevAss").prop('checked', false).attr('checked', false)
				vouiscopyprevAss = false
   			}
   			if(data.data.vouisaddDate == 1){
   				$("#vouisaddDaten").prop('checked', false).attr('checked', false)
				$("#vouisaddDatey").prop('checked', true).attr('checked', true)
				vouisaddDate = true
   			}else{
   				$("#vouisaddDaten").prop('checked', true).attr('checked', true)
				$("#vouisaddDatey").prop('checked', false).attr('checked', false)
				vouisaddDate = false
   			}
   			if(data.data.defalultOpen == 1){
				$("#defalultOpenNo").prop('checked', false).attr('checked', false)
				 $("#defalultOpen").prop('checked', true).attr('checked', true)
				isdefaultopen = true
   			}else{
				$("#defalultOpen").prop('checked', false).attr('checked', false)
				$("#defalultOpenNo").prop('checked', true).attr('checked', true)
				isdefaultopen = false
			}
   			if(data.data.ysorcw == 0){
				$("#ysorcwNo").prop('checked', true).attr('checked', true)
			 	$("#ysorcw").prop('checked', false).attr('checked', false)
				 isysorcw = false
   			}else{
				$("#ysorcwNo").prop('checked', false).attr('checked', false)
				$("#ysorcw").prop('checked', true).attr('checked', true)
				isysorcw = true
   			}
   			if(data.data.addindexiszy == 0){
				$("#addindexfj").prop('checked', true).attr('checked', true)
			 	$("#addindexzy").prop('checked', false).attr('checked', false)
				 addindexiszy = false
   			}else{
				$("#addindexfj").prop('checked', false).attr('checked', false)
				$("#addindexzy").prop('checked', true).attr('checked', true)
				addindexiszy = true
   			}
		})
		if(data.isParallel == '1' && data.isDoubleVou == '1') {
			rpt.isParallel = 1
			vousinglepz = false
			$('.vouisdouble').hide()
			$(".voucherhe").css('top', '27px') 
			$('.vouSource').css('margin-left', '-488px')
			$('.iswriteoff').css('margin-left', '-400px')
			$('.voucherhe').css({
				'width': '1094px',
				'margin-left': '-557px'
			})
		} else if(data.isParallel == '1' && data.isDoubleVou == '0') {
			rpt.isParallel = 1
			vousinglepz = true
			$('.vouisdouble').show()
			$(".voucherhe").css('top', '27px')
			$('.vouSource').css('margin-left', '-488px')
			$('.iswriteoff').css('margin-left', '-400px')
			$('.voucherhe').css({
				'width': '1094px',
				'margin-left': '-557px'
			})
		} else if(data.isParallel == '0') {
			rpt.isParallel = 0
			vousinglepz = false
			$('.vouisdouble').hide()
			$(".voucherhe").css('top', '27px')
			$('.vouSource').css('margin-left', '-488px')
			$('.iswriteoff').css('margin-left', '-400px')
			
			$('.voucherhe').css({
				'width': '1094px',
				'margin-left': '-557px'
			})
		}
		rpt.createUser = data.fiLeader;
		if($("#vouislrud").hasClass('zys') && data.isParallel == '1' && data.isDoubleVou == '0') {
			vousinglepzzy = true
			vousinglepz = false
			if(isdobabstractinp) {
				$(".voucherhe").css('top', '22px')
				$('.vouSource').css('margin-left', '-781px')
				$('.iswriteoff').css('margin-left', '-700px')
				$('.voucherhe').css({
					'width': '1700px',
					'margin-left': '-850px'
				})
			} else {
				$(".voucherhe").css('top', '27px')
				$('.vouSource').css('margin-left', '-488px')
				$('.iswriteoff').css('margin-left', '-400px')
				$('.voucherhe').css({
					'width': '1094px',
					'margin-left': '-557px'
				})
			}
		} else {
			vousinglepzzy = false
		}
		//		vouboxtrue = false;
		if(rpt.isParallel == "1") {
			$(".chaiwu").show();
			$(".yusuan").show();
		} else {
			$(".chaiwu").hide();
			$(".yusuan").hide();
		}
		setTimeout(function() {
			if(vousinglepz == true) {
				$(".chaiwu").hide();
				$(".yusuan").hide();
			} else if(vousinglepzzy == true) {
				$(".chaiwu").hide();
				$(".yusuan").hide();
			}
			var accacodes = '';
			if($('.chaiwu').css('display') != 'none') {
				accacodes = '1'
				ufma.ajaxDef("/gl/eleVouType/getVouType/" + rpt.nowAgencyCode + "/" + ufgovkey.svSetYear + "/" + rpt.nowAcctCode + "/" + accacodes, "get", '', function(data) {
					danweinamec = data.data;
				})
			}
			if($('.yusuan').css('display') != 'none') {
				accacodes = '2'
				ufma.ajaxDef("/gl/eleVouType/getVouType/" + rpt.nowAgencyCode + "/" + ufgovkey.svSetYear + "/" + rpt.nowAcctCode + "/" + accacodes, "get", '', function(data) {
					danweinamey = data.data;
				})
			}
			if(vousinglepzzy == true || $('.yusuan').css('display') == 'none') {
				accacodes = '*'
				ufma.ajaxDef("/gl/eleVouType/getVouType/" + rpt.nowAgencyCode + "/" + ufgovkey.svSetYear + "/" + rpt.nowAcctCode + "/" + accacodes, "get", '', function(data) {
					danweinamec = data.data;
				})
			}
			voutypeword()
			MaxVouNoUp() 
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
				$('#AssDataAll').html('')
				billfzhsxl =[]
				tablehead = data.data.tableHead;
				fzhsxl = data.data.optionData;
				accitemOrderSeq = data.data.accitemOrder
				$(".searchvvoukecha").html(accsDatasearch())
			})
		}, 200)
		if(rpt.nowAgencyCode!="*"){
			ufma.ajax("/gl/vou/selDesc", "get",{'descName':'','agencyCode':rpt.nowAgencyCode,'acctCode':rpt.nowAcctCode}, function(data) {
				zaiyao = data;
				var ssr = ''
				for(var i = 0; i < data.data.length; i++) {
					ssr += '<li class="PopListBoxItem unselected" name = "'+data.data[i].assCode+'">' + data.data[i].descName + '</li>'
				}
				$("#abstract-container").html(ssr);
			})
		}
		ufma.ajax("/gl/vou/getAllbgAccItems/" + rpt.nowAgencyCode + "/" + rpt.nowAcctCode, "get",'', function(data) {
			keypandingzhibiao = data.data
		})
		var pagereslist = ufma.getPermission();
		ufma.isShow(pagereslist);
		upadd();
	}
});
//请求单位列表
rpt.reqAgencyList = function() {
	ufma.ajaxDef(rpt.portList.agencyList, "get", "", function(result) {
		var data = result.data;
		rpt.cbAgency = $("#cbAgency").ufmaTreecombox2({
			data: result.data
		});
		var code = data[0].id;
		var name = data[0].name;
		var codeName = data[0].codeName;
		if(JSON.parse(window.sessionStorage.getItem("cacheData")) != null && getUrlParam("dataFrom") == "vouBox" && getUrlParam("action") == "query" || getUrlParam("action") == "add") {
			var keycacheData = JSON.parse(window.sessionStorage.getItem("cacheData"));
			rpt.cbAgency.val(keycacheData.agencyCode);
			rpt.cbAcct.val(keycacheData.acctCode);
			rpt.nowAgencyCode = rpt.cbAgency.getValue();
			rpt.nowAgencyName = rpt.cbAgency.getText();
			rpt.nowAcctCode = rpt.cbAcct.getValue();
			rpt.nowAcctName = rpt.cbAcct.getText();
		} else if(getUrlParam("action") == "preview") {
			if(window.ownerData[0] != null && window.ownerData[0] != '') {
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
		} else if(getUrlParam("action") == "voumodel") {
			rpt.cbAgency.val(window.ownerData.agencyCode);
			rpt.cbAcct.val(window.ownerData.acctCode);
			if(window.ownerData.agencyCode == '*'){
				rpt.nowAgencyCode = '*'
			}else{
				rpt.nowAgencyCode = rpt.cbAgency.getValue();
			}
			rpt.nowAgencyName = rpt.cbAgency.getText();
			if(window.ownerData.acctCode == '*'){
				rpt.nowAcctCode = '*'
			}else{
				rpt.nowAcctCode = rpt.cbAcct.getValue();
			}
			rpt.nowAcctName = rpt.cbAcct.getText();
		} else {
			if(rpt.nowAgencyCode != "") {
				var agency = $.inArrayJson(data, 'id', rpt.nowAgencyCode);
				if(agency != undefined) {
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
rpt.reqAcctList = function() {
	var acctArgu = {
		"agencyCode": rpt.nowAgencyCode,
		"userId": rpt.nowUserId,
		"setYear": rpt.nowSetYear
	};
	ufma.ajaxDef(rpt.portList.acctList, "get", acctArgu, function(result) {
		var data = result.data;
		rpt.cbAcct = $("#cbAcct").ufmaCombox2({
			data: data
		});
		if(data.length > 0) {
			var code = data[0].id;
			var name = data[0].name;
			var codeName = data[0].codeName;
			if(rpt.nowAcctCode != "" && rpt.nowAcctName != "") {
				var flag = rpt.cbAcct.val(rpt.nowAcctCode);
				if(flag == "undefined") {
					rpt.cbAcct.val(rpt.nowAcctCode);
				} else if(flag == false) {
					rpt.cbAcct.val(code);
				}
			} else {
				rpt.cbAcct.val(code);
			}
		} else {
			ufma.showTip("该单位下没有账套，请重新选择！", function() {}, "warning");
			return false;
		}
	});
};
//账套列表
//请求单位列表
rpt.reqAgencyList();
var xialacode = rpt.nowAgencyCode;
function voutypeword() {
	if($('.chaiwu').hasClass('xuanzhongcy') && $('.chaiwu').css('display') != 'none') {
		var ss = ''
		for(var i = 0; i < danweinamec.length; i++) {
			ss += '<option value="' + danweinamec[i].code + '">' + danweinamec[i].name + '</option>'
		}
		$("#leftbgselect").html(ss);
	}
	if($('.yusuan').hasClass('xuanzhongcy') && $('.yusuan').css('display') != 'none') {
		var ss = ''
		for(var i = 0; i < danweinamey.length; i++) {
			ss += '<option value="' + danweinamey[i].code + '">' + danweinamey[i].name + '</option>'
		}
		$("#leftbgselect").html(ss);
	}
	if($('.yusuan').css('display') == 'none') {
		var ss = ''
		for(var i = 0; i < danweinamec.length; i++) {
			ss += '<option value="' + danweinamec[i].code + '">' + danweinamec[i].name + '</option>'
		}
		$("#leftbgselect").html(ss);
	}
	for(var i = 0; i < $("#leftbgselect").find("option").length; i++) {
		if($("#leftbgselect").find("option").eq(i).attr("value") == nowvoutype) {
			$("#leftbgselect").find("option").eq(i).attr("selected", true)
		}
	}
}
//返回正确排序的辅助项对象
function resOrderAccItem(accoCode, accItemArr) {
	var nowAccItemSeq = $.inArrayJson(accitemOrderSeq, 'accoCode', accoCode);
	var orderAccItem = new Object();
	if(nowAccItemSeq != undefined) {
		var accitemList = nowAccItemSeq.accitemList;
		for(var i = 0; i < accitemList.length; i++) {
			if(accitemList[i]["IS_SHOW"] == 1 && accitemList[i]["ACCITEM_CODE"] != "CURRENCY") {
				var str = accitemList[i]["ACCITEM_CODE"];
				var code = tf(str) + "Code";
				orderAccItem[code] = accItemArr[code];
				if(accitemList[i]["DEFAULT_CODE"] != undefined && orderAccItem[code] != undefined) {
					orderAccItem[code].value = accitemList[i]["DEFAULT_CODE"]
				}
				if(accitemList[i]["RANGE"] != undefined && orderAccItem[code] != undefined && accitemList[i]["RANGE"].length>0){
					orderAccItem[code].valuerange = true
					var ranges = {}
					for(var z=0;z<accitemList[i]["RANGE"].length;z++){
						ranges[accitemList[i]["RANGE"][z].code]='1'
					}
					vouassRange[accitemList[i]["ACCO_CODE"]+code] =ranges
					vouassRange[accitemList[i]["ACCO_CODE"]+code+'data'] =accitemList[i]["RANGE"]
				}else if(orderAccItem[code] != undefined){
					orderAccItem[code].valuerange = 'undefined'
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
	if(nowAccItemSeq != undefined) {
		var accitemList = nowAccItemSeq.accitemList;
		for(var i = 0; i < accitemList.length; i++) {
			if(accitemList[i]["IS_SHOW"] != 1) {
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
	$(".voucher").remove();
	$(".datesno").hide();
	$('.vouaccSearchsinps').val('')
	$('.searchvvoukecha').removeAttr('vouGuid')
	vouchecker = '';
	var nowvalue = nowvoutype;
	voucheralls()
	for(var i = 0; i < $("#leftbgselect").find("option").length; i++) {
		if($("#leftbgselect").find("option").eq(i).attr("value") == nowvalue) {
			$("#leftbgselect").find("option").eq(i).attr("selected", true)
		}
	}
	vouluru();
	$('#serarchdespcinput').val('')
	$('#replacedespcinput').val('')
	$('.despctsearchModal').hide(200)
	searchdespclength = 0;
	$("#vfjz").find("span").text("");
	$("#vfsh").find("span").text("");
	$("#vfzd").find("span").text("").attr('code','');
	$(".bxd").hide()
	$(".vouSource").text('手工输入');
	$(".iswriteoff").hide();
	closeVouMask()
	if($('#vouislrud').hasClass("zys") || vousinglepz != true) {
		if(isdobabstractinp && vousinglepzzy) {
			$(".voucherhe").css('top', '22px')
			$('.vouSource').css('margin-left', '-781px')
			$('.iswriteoff').css('margin-left', '-700px')
			$('.voucherhe').css({
				'width': '1700px',
				'margin-left': '-850px'
			})
		} else {
			$(".voucherhe").css('top', '27px')
			$('.vouSource').css('margin-left', '-488px')
			$('.iswriteoff').css('margin-left', '-400px')
			$('.voucherhe').css({
				'width': '1094px',
				'margin-left': '-557px'
			})
		}
	} else {
		$(".voucherhe").css('top', '27px')
		$('.vouSource').css('margin-left', '-488px')
		$('.iswriteoff').css('margin-left', '-400px')
		$('.voucherhe').css({
			'width': '1094px',
			'margin-left': '-557px'
		})
	}
	if(!vouisaddDate){
		$("#dates").getObj().setValue(result);
	}
	setTimeout(function() {
		biduiindex()
	}, 100)
}
function acctaccaall() {
	var tr = ''
	page.Codenameacct = {}
	for(var i = 0; i < quanjuvoudatas.data.length; i++) {
		page.Codenameacct[quanjuvoudatas.data[i].accoCode] = i
		if(quanjuvoudatas.data[i].enabled===0){
			if(quanjuvoudatas.data[i].levNum > 0) {
				tr += '<li allowSurplus='+quanjuvoudatas.data[i].allowSurplus+' levNum="' + quanjuvoudatas.data[i].levNum + '" style="display:none;" fname="' + quanjuvoudatas.data[i].accoFullName + '" title="' + quanjuvoudatas.data[i].remark + '" acca="' + quanjuvoudatas.data[i].accaCode + '" name="' + i + '" cashflow="' + quanjuvoudatas.data[i].isCashflow + '" role="' + quanjuvoudatas.data[i].accBal + '" class="allnoshow  unselected leave' + quanjuvoudatas.data[i].levNum + ' clik' + quanjuvoudatas.data[i].isLeaf + ' fuhs' + quanjuvoudatas.data[i].accitemNum + '"><p><span class="ACCO_CODE">' + quanjuvoudatas.data[i].accoCode + '</span> <span class="ACCO_NAME">' + quanjuvoudatas.data[i].accoName + '</span></p><span class="fu">辅</span></li>'
			} else {
				tr += '<li allowSurplus='+quanjuvoudatas.data[i].allowSurplus+' levNum="' + quanjuvoudatas.data[i].levNum + '" fname="' + quanjuvoudatas.data[i].accoFullName + '" title="' + quanjuvoudatas.data[i].remark + '" acca="' + quanjuvoudatas.data[i].accaCode + '" name="' + i + '" cashflow="' + quanjuvoudatas.data[i].isCashflow + '"role="' + quanjuvoudatas.data[i].accBal + '" class="allnoshow PopListBoxItem unselected leave' + quanjuvoudatas.data[i].levNum + ' clik' + quanjuvoudatas.data[i].isLeaf + ' fuhs' + quanjuvoudatas.data[i].accitemNum + '"><p class="sq"><span class="ACCO_CODE">' + quanjuvoudatas.data[i].accoCode + '</span> <span class="ACCO_NAME">' + quanjuvoudatas.data[i].accoName + '</span></p><span class="fu">辅</span></li>'
			}
		}else{
			if(quanjuvoudatas.data[i].levNum > 0) {
				tr += '<li allowSurplus='+quanjuvoudatas.data[i].allowSurplus+' levNum="' + quanjuvoudatas.data[i].levNum + '" style="display:none;" fname="' + quanjuvoudatas.data[i].accoFullName + '" title="' + quanjuvoudatas.data[i].remark + '" acca="' + quanjuvoudatas.data[i].accaCode + '" name="' + i + '" cashflow="' + quanjuvoudatas.data[i].isCashflow + '" role="' + quanjuvoudatas.data[i].accBal + '" class="unselected leave' + quanjuvoudatas.data[i].levNum + ' clik' + quanjuvoudatas.data[i].isLeaf + ' fuhs' + quanjuvoudatas.data[i].accitemNum + '"><p><span class="ACCO_CODE">' + quanjuvoudatas.data[i].accoCode + '</span> <span class="ACCO_NAME">' + quanjuvoudatas.data[i].accoName + '</span></p><span class="fu">辅</span></li>'
			} else {
				tr += '<li allowSurplus='+quanjuvoudatas.data[i].allowSurplus+' levNum="' + quanjuvoudatas.data[i].levNum + '" fname="' + quanjuvoudatas.data[i].accoFullName + '" title="' + quanjuvoudatas.data[i].remark + '" acca="' + quanjuvoudatas.data[i].accaCode + '" name="' + i + '" cashflow="' + quanjuvoudatas.data[i].isCashflow + '"role="' + quanjuvoudatas.data[i].accBal + '" class="PopListBoxItem unselected leave' + quanjuvoudatas.data[i].levNum + ' clik' + quanjuvoudatas.data[i].isLeaf + ' fuhs' + quanjuvoudatas.data[i].accitemNum + '"><p class="sq"><span class="ACCO_CODE">' + quanjuvoudatas.data[i].accoCode + '</span> <span class="ACCO_NAME">' + quanjuvoudatas.data[i].accoName + '</span></p><span class="fu">辅</span></li>'
			}
		}
	}

	tr += '<li class="bukedian"><p>没有对应的会计科目</p></li>'
	tr += '<li class="xzkjkm"><a >+新增会计科目</a></li>'
	return tr
}
function acctacca1() {
	var tr = ''
	for(var i = 0; i < quanjuvoudatas.data.length; i++) {
		if(quanjuvoudatas.data[i].accaCode == 1) {
			if(quanjuvoudatas.data[i].enabled===0){
				if(quanjuvoudatas.data[i].levNum > 0) {
					tr += '<li allowSurplus='+quanjuvoudatas.data[i].allowSurplus+' levNum="' + quanjuvoudatas.data[i].levNum + '" style="display:none;" fname="' + quanjuvoudatas.data[i].accoFullName + '" title="' + quanjuvoudatas.data[i].remark + '" acca="' + quanjuvoudatas.data[i].accaCode + '" name="' + i + '" cashflow="' + quanjuvoudatas.data[i].isCashflow + '" role="' + quanjuvoudatas.data[i].accBal + '" class="allnoshow  unselected leave' + quanjuvoudatas.data[i].levNum + ' clik' + quanjuvoudatas.data[i].isLeaf + ' fuhs' + quanjuvoudatas.data[i].accitemNum + '"><p><span class="ACCO_CODE">' + quanjuvoudatas.data[i].accoCode + '</span> <span class="ACCO_NAME">' + quanjuvoudatas.data[i].accoName + '</span></p><span class="fu">辅</span></li>'
				} else {
					tr += '<li allowSurplus='+quanjuvoudatas.data[i].allowSurplus+' levNum="' + quanjuvoudatas.data[i].levNum + '" fname="' + quanjuvoudatas.data[i].accoFullName + '" title="' + quanjuvoudatas.data[i].remark + '" acca="' + quanjuvoudatas.data[i].accaCode + '" name="' + i + '" cashflow="' + quanjuvoudatas.data[i].isCashflow + '"role="' + quanjuvoudatas.data[i].accBal + '" class="allnoshow PopListBoxItem unselected leave' + quanjuvoudatas.data[i].levNum + ' clik' + quanjuvoudatas.data[i].isLeaf + ' fuhs' + quanjuvoudatas.data[i].accitemNum + '"><p class="sq"><span class="ACCO_CODE">' + quanjuvoudatas.data[i].accoCode + '</span> <span class="ACCO_NAME">' + quanjuvoudatas.data[i].accoName + '</span></p><span class="fu">辅</span></li>'
				}
			}else{
				if(quanjuvoudatas.data[i].levNum > 0) {
					tr += '<li allowSurplus='+quanjuvoudatas.data[i].allowSurplus+' levNum="' + quanjuvoudatas.data[i].levNum + '" style="display:none;" fname="' + quanjuvoudatas.data[i].accoFullName + '" title="' + quanjuvoudatas.data[i].remark + '" acca="' + quanjuvoudatas.data[i].accaCode + '" name="' + i + '" cashflow="' + quanjuvoudatas.data[i].isCashflow + '" role="' + quanjuvoudatas.data[i].accBal + '" class="unselected leave' + quanjuvoudatas.data[i].levNum + ' clik' + quanjuvoudatas.data[i].isLeaf + ' fuhs' + quanjuvoudatas.data[i].accitemNum + '"><p><span class="ACCO_CODE">' + quanjuvoudatas.data[i].accoCode + '</span> <span class="ACCO_NAME">' + quanjuvoudatas.data[i].accoName + '</span></p><span class="fu">辅</span></li>'
				} else {
					tr += '<li allowSurplus='+quanjuvoudatas.data[i].allowSurplus+' levNum="' + quanjuvoudatas.data[i].levNum + '" fname="' + quanjuvoudatas.data[i].accoFullName + '" title="' + quanjuvoudatas.data[i].remark + '" acca="' + quanjuvoudatas.data[i].accaCode + '" name="' + i + '" cashflow="' + quanjuvoudatas.data[i].isCashflow + '"role="' + quanjuvoudatas.data[i].accBal + '" class="PopListBoxItem unselected leave' + quanjuvoudatas.data[i].levNum + ' clik' + quanjuvoudatas.data[i].isLeaf + ' fuhs' + quanjuvoudatas.data[i].accitemNum + '"><p class="sq"><span class="ACCO_CODE">' + quanjuvoudatas.data[i].accoCode + '</span> <span class="ACCO_NAME">' + quanjuvoudatas.data[i].accoName + '</span></p><span class="fu">辅</span></li>'
				}
			}
		}
	}
	tr += '<li class="bukedian"><p>没有对应的会计科目</p></li>'
	tr += '<li class="xzkjkm"><a >+新增会计科目</a></li>'
	return tr
}
function acctacca2() {
	var tr = ''
	for(var i = 0; i < quanjuvoudatas.data.length; i++) {
		if(quanjuvoudatas.data[i].accaCode == 2) {
			if(quanjuvoudatas.data[i].enabled===0 ){
				if(quanjuvoudatas.data[i].levNum > 0) {
					tr += '<li allowSurplus='+quanjuvoudatas.data[i].allowSurplus+' levNum="' + quanjuvoudatas.data[i].levNum + '" style="display:none;" fname="' + quanjuvoudatas.data[i].accoFullName + '" title="' + quanjuvoudatas.data[i].remark + '" acca="' + quanjuvoudatas.data[i].accaCode + '" name="' + i + '" cashflow="' + quanjuvoudatas.data[i].isCashflow + '" role="' + quanjuvoudatas.data[i].accBal + '" class="allnoshow  unselected leave' + quanjuvoudatas.data[i].levNum + ' clik' + quanjuvoudatas.data[i].isLeaf + ' fuhs' + quanjuvoudatas.data[i].accitemNum + '"><p><span class="ACCO_CODE">' + quanjuvoudatas.data[i].accoCode + '</span> <span class="ACCO_NAME">' + quanjuvoudatas.data[i].accoName + '</span></p><span class="fu">辅</span></li>'
				} else {
					tr += '<li allowSurplus='+quanjuvoudatas.data[i].allowSurplus+' levNum="' + quanjuvoudatas.data[i].levNum + '" fname="' + quanjuvoudatas.data[i].accoFullName + '" title="' + quanjuvoudatas.data[i].remark + '" acca="' + quanjuvoudatas.data[i].accaCode + '" name="' + i + '" cashflow="' + quanjuvoudatas.data[i].isCashflow + '"role="' + quanjuvoudatas.data[i].accBal + '" class="allnoshow PopListBoxItem unselected leave' + quanjuvoudatas.data[i].levNum + ' clik' + quanjuvoudatas.data[i].isLeaf + ' fuhs' + quanjuvoudatas.data[i].accitemNum + '"><p class="sq"><span class="ACCO_CODE">' + quanjuvoudatas.data[i].accoCode + '</span> <span class="ACCO_NAME">' + quanjuvoudatas.data[i].accoName + '</span></p><span class="fu">辅</span></li>'
				}
			}else{
				if(quanjuvoudatas.data[i].levNum > 0) {
					tr += '<li allowSurplus='+quanjuvoudatas.data[i].allowSurplus+' levNum="' + quanjuvoudatas.data[i].levNum + '" style="display:none;" fname="' + quanjuvoudatas.data[i].accoFullName + '" title="' + quanjuvoudatas.data[i].remark + '" acca="' + quanjuvoudatas.data[i].accaCode + '" name="' + i + '" cashflow="' + quanjuvoudatas.data[i].isCashflow + '" role="' + quanjuvoudatas.data[i].accBal + '" class="unselected leave' + quanjuvoudatas.data[i].levNum + ' clik' + quanjuvoudatas.data[i].isLeaf + ' fuhs' + quanjuvoudatas.data[i].accitemNum + '"><p><span class="ACCO_CODE">' + quanjuvoudatas.data[i].accoCode + '</span> <span class="ACCO_NAME">' + quanjuvoudatas.data[i].accoName + '</span></p><span class="fu">辅</span></li>'
				} else {
					tr += '<li allowSurplus='+quanjuvoudatas.data[i].allowSurplus+' levNum="' + quanjuvoudatas.data[i].levNum + '" fname="' + quanjuvoudatas.data[i].accoFullName + '" title="' + quanjuvoudatas.data[i].remark + '" acca="' + quanjuvoudatas.data[i].accaCode + '" name="' + i + '" cashflow="' + quanjuvoudatas.data[i].isCashflow + '"role="' + quanjuvoudatas.data[i].accBal + '" class="PopListBoxItem unselected leave' + quanjuvoudatas.data[i].levNum + ' clik' + quanjuvoudatas.data[i].isLeaf + ' fuhs' + quanjuvoudatas.data[i].accitemNum + '"><p class="sq"><span class="ACCO_CODE">' + quanjuvoudatas.data[i].accoCode + '</span> <span class="ACCO_NAME">' + quanjuvoudatas.data[i].accoName + '</span></p><span class="fu">辅</span></li>'
				}
			}
		}
	}
	tr += '<li class="bukedian"><p>没有对应的会计科目</p></li>'
	tr += '<li class="xzkjkm"><a >+新增会计科目</a></li>'
	return tr
}
function accsDatasearch() {
	var tr = ''
	tr+='<li class="kechali" data-type="despct"><span class="code">摘要</span><span class="name"></span></li>'
	tr+='<li class="kechali" data-type="acco"><span class="code">会计科目</span><span class="name"></span></li>'
	if($('.voucher-head').attr('namess')!=undefined && $('.voucher-head').attr('namess') != ''){
		var guid = $('.voucher-head').attr('namess')
		ufma.ajaxDef('/gl/vou/getVouWithAccitem/'+guid,'get','',function(result){
			var useData=result.data
			var usedatalist = {}
			for(var i=0;i<useData.length;i++){
				var key = tf(useData[i])+'Code'
				usedatalist[key]=''
			}
			for(var i in tablehead) {
				if(usedatalist[i]!=undefined){
					tr+='<li class="kechali" data-type="'+i+'"><span class="code">'+tablehead[i].ELE_NAME+'</span><span class="name"></span></li>'
				}
			}
		})
	}else{
		for(var i in tablehead) {
			tr+='<li class="kechali" data-type="'+i+'"><span class="code">'+tablehead[i].ELE_NAME+'</span><span class="name"></span></li>'
		}
	}
	return tr
}

var selectdata = new Object()
selectdata.data = {} 

function chaclickfu(ths, strdata, accoSurplus, dfDc) {
	var ss;
	for(var j = 0; j < $("#accounting-container").find("li").length; j++) {
		if(ths.find('.accountinginp').attr('code') == $("#accounting-container").find("li").eq(j).find(".ACCO_CODE").text()) {
			ss = $("#accounting-container").find("li").eq(j).attr("name");
			break;
		}
	}
	var descptval = ths.parents(".voucher-center").find('.abstractinp').val()
	var voucherycss = new Object();
	for(var d in tablehead) {
		var c = d.substring(0, d.length - 4)
		if(quanjuvoudatas.data[ss][c] == 1) {
			voucherycss[d] = tablehead[d];
		}
	}
	var voucheryc = ""
	voucheryc += '<div class="voucher-yc" style="display:none">'
	if(vousinglepzzy) {
		voucheryc += '<div class="voucher-yc-title"><span class="titlename">科目：</span>'
		voucheryc += '&nbsp;&nbsp;<label class="mt-radio">'
		voucheryc += '<input type="radio" name="vouisdoublesingle"  class="voucher-yc-j"/>借<span></span>'
		voucheryc += '</label>'
		voucheryc += '&nbsp;&nbsp;<label class="mt-radio">'
		voucheryc += '<input type="radio" name="vouisdoublesingle"  class="voucher-yc-d"/>贷<span></span>'
		voucheryc += '</label>'
		voucheryc += '&nbsp;&nbsp;<div class="titlemoney" style="display:inline-block">金额:0.00'
		voucheryc += '</div>'
		voucheryc += '</div>'
	}
	voucheryc += '<div class="voucher-close"><span class="glyphicon icon-close"> </span></div>'
	voucheryc += '<div class="voucher-yc-addbtns">'
	if(strdata != null && strdata.length > 0) {
		for(var k = 0; k < strdata.length; k++) {
			voucheryc += '<div class="ycadddiv" inde = "' + k + '"><img src="img/insert.png" class="ycadd"></div>'
		}
	} else {
		voucheryc += '<div class="ycadddiv" inde = "0"><img src="img/insert.png" class="ycadd"></div>'
	}
	voucheryc += '<span class="icon-add ycaddopen"></span>'
	voucheryc += '</div>'
	voucheryc += '<div class="voucher-yc-bg">'
	voucheryc += '<div class="voucher-yc-bt">'
	var nowAccoCode = ths.find('.accountinginp').attr('code');
	var accItemArr = voucherycss;
	//					if(voucherycss.length > 0) { //得到辅助项的存在，再进行排序。wangpl 2018.01.22
	voucherycss = resOrderAccItem(nowAccoCode, accItemArr);
	var noshowaccitem = showAccItem(nowAccoCode, accItemArr)
	//					}
	if(isAssRemark){
		voucheryc += '<div class="ychead"  name="remark">摘要</div>'
	}
	for(var k in voucherycss) {
		voucheryc += '<div class="ychead"  isrange='+voucherycss[k].valuerange+' name="' + k + '"  mrvalue = ' + voucherycss[k].value + ' >' + voucherycss[k].ELE_NAME + '</div>'
		if((voucherycss[k]["ELE_CODE"] == "CURRENT" && isbussDate) || (voucherycss[k]["ELE_CODE"] == "EMPLOYEE" && isbussDate)) {
			voucheryc += '<div class="ychead"  name="bussDate"  mrvalue = "">往来日期</div>'
		}
		var l = k
		if($('#AssDataAll').find('.'+l).length<1){
			var assnoll = ''
			if(fzhsxl[l].length>100){
				var nowlen = 0
				assnoll += '<ul isAlllength="now" class="ycbodys '+l+'">'
				for(var n = 0; n < fzhsxl[l].length; n++) {
					if(fzhsxl[l][n].enabled == 1) {
						if(isdefaultopen){
							if(nowlen<100){
								nowlen++;
								assnoll += '<li datalen = '+n+' department = "'+fzhsxl[l][n].departmentCode+'" levels = "' + fzhsxl[l][n].levelNum + '" fname="' + fzhsxl[l][n].chrFullname + '" class="PopListBoxItem unselected  dianji' + fzhsxl[l][n].isLeaf + ' fzlv' + fzhsxl[l][n].levelNum + ' "><p class="sq"><span class="code">' + fzhsxl[l][n].code + '</span>  <span class="name">' + fzhsxl[l][n].name + '</span></p></li>'
							}else if(nowlen>=100){
								assnoll += '<li class="noallassno">当前数据过多，请使用搜索过滤</li>'
								break;
							}
						}else{
							if(fzhsxl[l][n].levelNum == 1 && nowlen<100){
								nowlen++;
								assnoll += '<li datalen = '+n+' department = "'+fzhsxl[l][n].departmentCode+'" levels = "' + fzhsxl[l][n].levelNum + '" fname="' + fzhsxl[l][n].chrFullname + '" class="PopListBoxItem unselected  dianji' + fzhsxl[l][n].isLeaf + ' fzlv' + fzhsxl[l][n].levelNum + ' "><p class="sq"><span class="code">' + fzhsxl[l][n].code + '</span>  <span class="name">' + fzhsxl[l][n].name + '</span></p></li>'
							}else if(fzhsxl[l][n].levelNum == 1 && nowlen>=100){
								assnoll += '<li class="noallassno">当前数据过多，请使用搜索过滤</li>'
								break;
							}
						}
					}
				}
			}else{
				assnoll += '<ul class="ycbodys '+l+'">'
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
			assnoll += '</ul>'
			$('#AssDataAll').append(assnoll)
		}
	}
	if(quanjuvoudatas.data[ss].field1 ==  '1'){
		voucheryc += '<div class="ychead"   name="field1"  mrvalue = "">往来号</div>'
	}
	if(quanjuvoudatas.data[ss].expireDate == 1) {
		voucheryc += '<div class="ychead" name="expireDate">到期日</div>'
	}
	if(quanjuvoudatas.data[ss].showBill == 1) {
		if(billfzhsxl.length == 0) {
			$.ajax({
				type: "get",
				url: "/gl/vou/getEleBillType/" + rpt.nowAgencyCode + "?ajax=1&rueicode="+hex_md5svUserCode,
				dataType: "json",
				async: false,
				success: function(data) {
					billfzhsxl = data.data
				},
				error: function(data) {
					ufma.showTip("票据类型未加载成功,请检查网络", function() {}, "error")
				}
			});
		}
		if($('#AssDataAll').find('.billTypeinp').length<1){
			var assnoll = ''
			assnoll += '<ul class="ycbodys billTypeinp">'
			for(var n = 0; n < billfzhsxl.length; n++) {
				if(billfzhsxl[n].enabled == 1 || billfzhsxl[n].enabled == undefined) {
					assnoll += '<li levels = "' + billfzhsxl[n].levelNum + '" fname="' + billfzhsxl[n].chrName + '" class="PopListBoxItem unselected dianji' + billfzhsxl[n].isLeaf + ' fzlv' + billfzhsxl[n].levelNum + '"><p><span class="code">' + billfzhsxl[n].chrCode + '</span>  <span class="name">' + billfzhsxl[n].chrName + '</span></p></li>'
				} else {
					assnoll += '<li levels = "' + billfzhsxl[n].levelNum + '" fname="' + billfzhsxl[n].chrName + '" class="unselected allnoshow dianji' + billfzhsxl[n].isLeaf + ' fzlv' + billfzhsxl[n].levelNum + '"><p><span class="code">' + billfzhsxl[n].chrCode + '</span>  <span class="name">' + billfzhsxl[n].chrName + '</span></p></li>'
				}
			}
			assnoll += '</ul>'
			$('#AssDataAll').append(assnoll)
		}
		voucheryc += '<div class="ychead" name="billNo">票据号</div>'
		voucheryc += '<div class="ychead" name="billType">票据类型</div>'
		voucheryc += '<div class="ychead" name="billDate">票据日期</div>'
	}
	if(quanjuvoudatas.data[ss].currency == 1) {
		ufma.ajaxDef('/gl/eleCurrRate/getCurrType', "get", {
			"agencyCode": rpt.nowAgencyCode
		}, function(result) {
			curCodefzhsxl = result.data
		})
		if($('#AssDataAll').find('.currency').length<1){
			var assnoll = ''
			assnoll += '<ul class="ycbodys currency">'
			for(var n = 0; n < curCodefzhsxl.length; n++) {
				if(curCodefzhsxl[n].eleRateList.length>0){
					if(curexratefzhsxl!=undefined){
						var nows = ''
						var iss = ''
						for(var j=0;j<curCodefzhsxl[n].eleRateList.length;j++){
							var nM = new Date(curCodefzhsxl[n].eleRateList[j].curDate).getMonth()
							var vM = new Date($("#dates").getObj().getValue()).getMonth()
							var nY = new Date(curCodefzhsxl[n].eleRateList[j].curDate).getFullYear()
							var vY = new Date($("#dates").getObj().getValue()).getFullYear()
							if(nM ==vM && nY == vY ){
								nows = j
							}
						}
						if(nows !=""){
							curexratefzhsxl["i"+n]=curCodefzhsxl[n].eleRateList[nows].direRate
							iss='i'+n
						}else if(curCodefzhsxl[n].eleRateList.length>0){
							var elelen = curCodefzhsxl[n].eleRateList.length-1
							curexratefzhsxl["i" + n] = curCodefzhsxl[n].eleRateList[elelen].direRate
							iss = 'i' + n
						}
					}
					assnoll += '<li rateDigits ="' + curCodefzhsxl[n].rateDigits+'" exrate = "'+iss+'" levels = "' + curCodefzhsxl[n].levelNum + '" fname="' + curCodefzhsxl[n].chrName + '" class="PopListBoxItem unselected dianji' + curCodefzhsxl[n].isLeaf + ' fzlv' + curCodefzhsxl[n].levelNum + '"><p><span class="code">' + curCodefzhsxl[n].chrCode + '</span>  <span class="name">' + curCodefzhsxl[n].chrName + '</span></p></li>'
				}else{
					assnoll += '<li rateDigits ="' + curCodefzhsxl[n].rateDigits+'" exrate = "" levels = "' + curCodefzhsxl[n].levelNum + '" fname="' + curCodefzhsxl[n].chrName + '" class="PopListBoxItem unselected dianji' + curCodefzhsxl[n].isLeaf + ' fzlv' + curCodefzhsxl[n].levelNum + '"><p><span class="code">' + curCodefzhsxl[n].chrCode + '</span>  <span class="name">' + curCodefzhsxl[n].chrName + '</span></p></li>'
				}
			}
			assnoll += '</ul>'
			$('#AssDataAll').append(assnoll)
		}
		voucheryc += '<div class="ychead" name="curCode">币种</div>'
		voucheryc += '<div class="ychead" name="exRate">汇率</div>'
		voucheryc += '<div class="ychead" name="currAmt">外币金额</div>'
	}
	if(quanjuvoudatas.data[ss].qty == 1) {
		voucheryc += '<div class="ychead" name="price">单价</div>'
		voucheryc += '<div class="ychead" name="qty">数量</div>'
	}
	// if(quanjuvoudatas.data[ss].allowSurplus == 1) {
	// 	$.ajax({
	// 		type: "get",
	// 		url: "/gl/vou/getEleSurplus/" + quanjuvoudatas.data[ss].accoCode + "?agencyCode=" + rpt.nowAgencyCode + "&acctCode=" + rpt.nowAcctCode + "&ajax=1&rueicode="+hex_md5svUserCode,
	// 		dataType: "json",
	// 		async: false,
	// 		success: function(data) {
	// 			diffentfzhsxl = data.data
	// 		},
	// 		error: function(data) {
	// 			ufma.showTip("差异项未加载成功,请检查网络", function() {}, "error")
	// 		}
	// 	});
		// var temporarydiffer =quanjuvoudatas.data[ss].accoCode +'diffTermCode'
		// if($('#AssDataAll').find('.'+temporarydiffer).length<1){
		// 	var assnoll = ''
		// 	assnoll += '<ul class="ycbodys '+temporarydiffer+'">'
		// 	for(var n = 0; n < diffentfzhsxl.length; n++) {
		// 		assnoll += '<li  levels = "' + diffentfzhsxl[n].levelNum + '" fname="' + diffentfzhsxl[n].name + '" class="PopListBoxItem unselected dianji' + diffentfzhsxl[n].isLeaf + ' fzlv' + diffentfzhsxl[n].levelNum + '"><p><span class="code">' + diffentfzhsxl[n].code + '</span>  <span class="name">' + diffentfzhsxl[n].name + '</span></p></li>'
		// 	}
		// 	assnoll += '</ul>'
		// 	$('#AssDataAll').append(assnoll)
		// }
		// if($('#AssDataAll').find('.diffTermDir').length<1){
		// 	var assnoll = ''
		// 	assnoll += '<ul class="ycbodys diffTermDir">'
		// 	assnoll += '<li fname="正向" class="PopListBoxItem  dianji1 fzlv1 selected"><p><span class="code"></span><span class="name">正向</span></p></li>'
		// 	assnoll += '<li fname="反向" class="PopListBoxItem unselected  dianji1 fzlv1"><p><span class="code"></span><span class="name">反向</span></p></li>'
		// 	assnoll += '</ul>'
		// 	$('#AssDataAll').append(assnoll)
		// }
		// voucheryc += '<div class="ychead" name="diffTermCode">差异项</div>'
		// voucheryc += '<div class="ychead" name="diffTermDir">差异方向</div>'
	// }
	voucheryc += '<div class="ychead noshowdata" noshow=' + noshowaccitem + '>金额</div>'
	//	voucheryc += '<div class="voucher-close"><span class="glyphicon icon-close"> </span></div>'
	voucheryc += '</div>';
	if(strdata != null && strdata.length > 0) {
		for(var k = 0; k < strdata.length; k++) {
			if(selectdata.data.vouGuid == strdata[k].vouGuid) {
				// voucheryc += '<div class="voucher-yc-bo" linkGuid="'+strdata[k].linkGuid+'" linkModule="'+strdata[k].linkModule+'" inde="' + k + '" ifEdit = "'+strdata[k].ifEdit+'" op="' + strdata[k].op + '"   namess="' + strdata[k].vouGuid + '" namesss="' + strdata[k].detailGuid + '" namessss="' + strdata[k].detailAssGuid + '"   refBillGuid="' + strdata[k].refBillGuid + '">'
				voucheryc += '<div class="voucher-yc-bo" linkGuid="'+strdata[k].linkGuid+'" linkModule="'+strdata[k].linkModule+'" inde="' + k + '" ifEdit = "true" op="' + strdata[k].op + '"   namess="' + strdata[k].vouGuid + '" namesss="' + strdata[k].detailGuid + '" namessss="' + strdata[k].detailAssGuid + '"   refBillGuid="' + strdata[k].refBillGuid + '">'
				//				voucheryc += '<div class="ycadddiv"><img src="img/jia.png" class="ycadd"></div>'
			} else if(selectdata.data.templateGuid == strdata[k].vouGuid) {
				voucheryc += '<div class="voucher-yc-bo" linkGuid="'+strdata[k].linkGuid+'" linkModule="'+strdata[k].linkModule+'" inde="' + k + '" ifEdit = "true" op="' + strdata[k].op + '"   namess="' + strdata[k].vouGuid + '" namesss="' + strdata[k].detailGuid + '" namessss="' + strdata[k].detailAssGuid + '"  refBillGuid="' + strdata[k].refBillGuid + '">'
				// voucheryc += '<div class="voucher-yc-bo" linkGuid="'+strdata[k].linkGuid+'" linkModule="'+strdata[k].linkModule+'" inde="' + k + '" ifEdit = "'+strdata[k].ifEdit+'" op="' + strdata[k].op + '"   namess="' + strdata[k].vouGuid + '" namesss="' + strdata[k].detailGuid + '" namessss="' + strdata[k].detailAssGuid + '"  refBillGuid="' + strdata[k].refBillGuid + '">'
				//				voucheryc += '<div class="ycadddiv"><img src="img/jia.png" class="ycadd"></div>'
			} else {
				if(strdata[k].refBillGuid!=undefined){
					voucheryc += '<div class="voucher-yc-bo" inde="' + k + '" op="0"  refBillGuid="' + strdata[k].refBillGuid + '">'
				}else{
					voucheryc += '<div class="voucher-yc-bo" inde="' + k + '" op="0">'
				}
				//				voucheryc += '<div class="ycadddiv"><img src="img/jia.png" class="ycadd"></div>'
			}
			if(isAssRemark){
				voucheryc += '<div  class="ycbody">'
				voucheryc += '<input type="text" class="ycbodyinp remark"  value="'+descptval+'" />'
				voucheryc += '</div>'
			}
			for(var l in voucherycss) {
				if(isuniversities == true && l == 'projectCode'){
					voucheryc += '<div  class="ycbody">'
					voucheryc += '<input type="text" relation = "' + l + '" class="ycbodyinp projectCode" readonly = "true"  />'
					voucheryc += '<span class="vouopendel project icon-close"></span>'
					voucheryc += '<div class="vouopenbtn project">...</div>'
					voucheryc += '</div>'
				}else if(isuniversities == true && l == 'quotaCode'){
					voucheryc += '<div  class="ycbody">'
					voucheryc += '<input type="text" relation = "' + l + '" class="ycbodyinp quotaCode" readonly = "true"  />'
					voucheryc += '<span class="vouopendel quota icon-close"></span>'
					voucheryc += '<div class="vouopenbtn quota">...</div>'
					voucheryc += '</div>'
				}else{
					voucheryc += '<div  class="ycbody">'
					voucheryc += '<textarea relation = "' + l + '" class="ycbodyinp"></textarea>'
					voucheryc += '</div>'
				}
				if((voucherycss[l]["ELE_CODE"] == "CURRENT" && isbussDate) || (voucherycss[l]["ELE_CODE"] == "EMPLOYEE" && isbussDate)) {
					voucheryc += '<div  class="ycbody">'
					voucheryc += '<input type="text" value="'+$("#dates").getObj().getValue()+'" class="ycbodyinp bussDate"  />'
					voucheryc += '</div>'
				}
			}
			if(quanjuvoudatas.data[ss].field1 ==  '1'){
				voucheryc += '<div  class="ycbody">'
				voucheryc += '<input type="text" class="ycbodyinp field1" readonly = "true"  />'
				voucheryc += '<span class="vouopendel icon-close"></span>'
				voucheryc += '<div class="vouopenbtn">...</div>'
				voucheryc += '</div>'
			}
			if(quanjuvoudatas.data[ss].expireDate == 1) {
				voucheryc += '<div  class="ycbody">'
				voucheryc += '<input type="text" class="ycbodyinp daoqiri"  />'
				voucheryc += '</div>'
			}
			if(quanjuvoudatas.data[ss].showBill == 1) {
				voucheryc += '<div  class="ycbody">'
				voucheryc += '<input type="text" class="ycbodyinp billNoinp"  />'
				voucheryc += '</div>'
				voucheryc += '<div  class="ycbody">'
				voucheryc += '<textarea relation="billTypeinp" class="ycbodyinp billTypeinp"></textarea>'
				voucheryc += '</div>'
				voucheryc += '<div  class="ycbody">'
				voucheryc += '<input type="text" class="ycbodyinp billDateinp"  />'
				voucheryc += '</div>'
			}
			if(quanjuvoudatas.data[ss].currency == 1) {
				voucheryc += '<div  class="ycbody">'
				voucheryc += '<input relation = "currency" type="text" class="ycbodyinp curcodeinp"  />'
				voucheryc += '</div>'
				voucheryc += '<div  class="ycbody">'
				voucheryc += '<input type="text" class="ycbodyinp exrateinp"  />'
				voucheryc += '</div>'
				voucheryc += '<div  class="ycbody">'
				voucheryc += '<input type="text" class="ycbodyinp curramtinp"  />'
				voucheryc += '</div>'
			}
			if(quanjuvoudatas.data[ss].qty == 1) {
				voucheryc += '<div  class="ycbody">'
				voucheryc += '<input type="text" class="ycbodyinp priceinp"  />'
				voucheryc += '</div>'
				voucheryc += '<div  class="ycbody">'
				voucheryc += '<input type="text" class="ycbodyinp qtyinp"  qty="' + quanjuvoudatas.data[ss].qtyDigits + '" />'
				voucheryc += '</div>'
			}
			voucheryc += '<input type="text" class="ycbody yctz" />'
			voucheryc += '</div>'
		}
	} else {
		for(var k = 0; k < 1; k++) {
			voucheryc += '<div class="voucher-yc-bo" op="0" inde="0">'
			var nowAccoCode = ths.find('.accountinginp').attr('code');
			var accItemArr = voucherycss;
			voucherycss = resOrderAccItem(nowAccoCode, accItemArr);
			var noshowaccitem = showAccItem(nowAccoCode, accItemArr)
			if(isAssRemark){
				voucheryc += '<div  class="ycbody">'
				voucheryc += '<input type="text" class="ycbodyinp remark" value="'+descptval+'"/>'
				voucheryc += '</div>'
			}
			for(var l in voucherycss) {
				if(isuniversities == true && l == 'projectCode'){
					voucheryc += '<div  class="ycbody">'
					voucheryc += '<input type="text" relation = "' + l + '" class="ycbodyinp projectCode" readonly = "true"  />'
					voucheryc += '<span class="vouopendel project icon-close"></span>'
					voucheryc += '<div class="vouopenbtn project">...</div>'
					voucheryc += '</div>'
				}else if(isuniversities == true && l == 'quotaCode'){
					voucheryc += '<div  class="ycbody">'
					voucheryc += '<input type="text" relation = "' + l + '" class="ycbodyinp quotaCode" readonly = "true"  />'
					voucheryc += '<span class="vouopendel quota icon-close"></span>'
					voucheryc += '<div class="vouopenbtn quota">...</div>'
					voucheryc += '</div>'
				}else{
					voucheryc += '<div  class="ycbody">'
					voucheryc += '<textarea relation = "' + l + '" class="ycbodyinp"></textarea>'
					voucheryc += '</div>'
				}
				if((voucherycss[l]["ELE_CODE"] == "CURRENT" && isbussDate) || (voucherycss[l]["ELE_CODE"] == "EMPLOYEE" && isbussDate)) {
					voucheryc += '<div  class="ycbody">'
					voucheryc += '<input type="text" value="'+$("#dates").getObj().getValue()+'" class="ycbodyinp bussDate" />'
					voucheryc += '</div>'
				}
			}
			if(quanjuvoudatas.data[ss].field1 ==  '1'){
				voucheryc += '<div  class="ycbody">'
				voucheryc += '<input type="text" class="ycbodyinp field1"  readonly = "true" />'
				voucheryc += '<span class="vouopendel icon-close"></span>'
				voucheryc += '<div class="vouopenbtn">...</div>'
				voucheryc += '</div>'
			}
			if(quanjuvoudatas.data[ss].expireDate == 1) {
				voucheryc += '<div  class="ycbody">'
				voucheryc += '<input type="text" class="ycbodyinp daoqiri"  />'
				voucheryc += '</div>'
			}
			if(quanjuvoudatas.data[ss].showBill == 1) {
				voucheryc += '<div  class="ycbody">'
				voucheryc += '<input type="text" class="ycbodyinp billNoinp"  />'
				voucheryc += '</div>'
				voucheryc += '<div  class="ycbody">'
				voucheryc += '<textarea relation="billTypeinp" class="ycbodyinp billTypeinp"></textarea>'
				voucheryc += '</div>'
				voucheryc += '<div  class="ycbody">'
				voucheryc += '<input type="text" class="ycbodyinp billDateinp"  />'
				voucheryc += '</div>'
			}
			if(quanjuvoudatas.data[ss].currency == 1) {
				voucheryc += '<div  class="ycbody">'
				voucheryc += '<input relation = "currency" type="text" class="ycbodyinp curcodeinp"  />'
				voucheryc += '</div>'
				voucheryc += '<div  class="ycbody">'
				voucheryc += '<input type="text" class="ycbodyinp exrateinp"  />'
				voucheryc += '</div>'
				voucheryc += '<div  class="ycbody">'
				voucheryc += '<input type="text" class="ycbodyinp curramtinp"  />'
				voucheryc += '</div>'
			}
			if(quanjuvoudatas.data[ss].qty == 1) {
				voucheryc += '<div  class="ycbody">'
				voucheryc += '<input type="text" class="ycbodyinp priceinp"  />'
				voucheryc += '</div>'
				voucheryc += '<div  class="ycbody">'
				voucheryc += '<input type="text" class="ycbodyinp qtyinp"  qty="' + quanjuvoudatas.data[ss].qtyDigits + '" />'
				voucheryc += '</div>'
			}
			voucheryc += '<input type="text" class="ycbody yctz" />'
			voucheryc += '</div>'
		}
	}
	voucheryc += '</div>'
	voucheryc += '<div class="voucher-yc-deletebtns">'
	voucheryc += '<div class="voucher-close"><span class="glyphicon icon-close"> </span></div>'
	if(strdata != null && strdata.length > 0) {
		for(var k = 0; k < strdata.length; k++) {
			voucheryc += '<div class="ycdeldiv" inde = "' + k + '"><span class="ycdelect icon-trash"></span></div>'
		}
	} else {
		voucheryc += '<div class="ycdeldiv" inde = "0"><span class="ycdelect icon-trash"></span></div>'
	}
	voucheryc += '</div>'
	voucheryc += '</div>'
	ths.parents(".voucher-center").append(voucheryc);
	if(selectdata.data.vouStatus != "A" && selectdata.data.vouStatus != "C" && selectdata.data.vouStatus != "P" && (selectdata.data.vouStatus == undefined || vouiseditsave)) {
		$('.daoqiri,.billDateinp,.bussDate').datetimepicker(glRptJournalDate)
	} else {
		$('.daoqiri').addClass('daoqiriend')
		$('.daoqiriend').removeClass('daoqiri')
	}
	var apvfvc = ths.parents(".voucher-center").find(".voucher-yc")
	for(var d = 0; d < apvfvc.length; d++) {
		if(apvfvc.eq(d).hasClass("deleteclass") != true) {
			voucherYcAssCss(apvfvc.eq(d))
		}
	}
	if(strdata != null) {
		var sdvdvdass = strdata
		var vifvcyb = ths.parents(".voucher-center").find(".voucher-yc-bo")
		for(var k = 0; k < sdvdvdass.length; k++) {
			if(sdvdvdass[k].op == "2") {
				vifvcyb.eq(k).addClass("deleteclass");
			} else {
				vifvcyb.eq(k).find(".yctz").val(formatNum(parseFloat(sdvdvdass[k].stadAmt).toFixed(2)))
				for(var r = 0; r < vifvcyb.eq(k).find(".ycbodyinp").length; r++) {
					var relation  =vifvcyb.eq(k).find(".ycbodyinp").eq(r).attr('relation')
					var $li = $('#AssDataAll').find("."+relation).find("li");
					var headName = ths.parents(".voucher-center").find(".voucher-yc-bt").find(".ychead").eq(r).attr("name")
					if(headName == "expireDate") {
						vifvcyb.eq(k).find(".ycbodyinp").eq(r).val(sdvdvdass[k].expireDate);
					} else if(headName == "billNo") {
						vifvcyb.eq(k).find(".ycbodyinp").eq(r).val(sdvdvdass[k].billNo);
					} else if(headName == "price") {
						vifvcyb.eq(k).find(".ycbodyinp").eq(r).val(sdvdvdass[k].price);
					} else if(headName == "qty") {
						vifvcyb.eq(k).find(".ycbodyinp").eq(r).val(sdvdvdass[k].qty);
					} else if(headName == "exRate") {
						vifvcyb.eq(k).find(".ycbodyinp").eq(r).val(sdvdvdass[k].exRate);
					} else if(headName == "currAmt") {
						vifvcyb.eq(k).find(".ycbodyinp").eq(r).val(formatNum(sdvdvdass[k].currAmt));
					} else if(headName == "billDate") {
						vifvcyb.eq(k).find(".ycbodyinp").eq(r).val(sdvdvdass[k].billDate);
					}else if(headName == "remark") {
						vifvcyb.eq(k).find(".ycbodyinp").eq(r).val(sdvdvdass[k].remark);
					}else if(headName == "field1") {
						vifvcyb.eq(k).find(".ycbodyinp").eq(r).val(sdvdvdass[k].field1).attr('cGuid',sdvdvdass[k].cancelAssGuid);
					}else if(headName == "bussDate") {
						if(sdvdvdass[k].bussDate !=undefined){
							vifvcyb.eq(k).find(".ycbodyinp").eq(r).val(sdvdvdass[k].bussDate);
						}
					}  else if(headName == "billType") {
						for(var s = 0; s < $li.length; s++) {
							if($li.eq(s).find(".code").text() == sdvdvdass[k].billType) {
								$li.eq(s).removeClass("unselected").addClass("selected");
								var fzxlnrcode = $li.eq(s).find(".code").text();
								var fzxlnrname = $li.eq(s).find(".name").text();
								vifvcyb.eq(k).find(".ycbodyinp").eq(r).val(fzxlnrcode + " " + fzxlnrname)
							}
						}
					} else if(headName == "curCode") {
						for(var s = 0; s < $li.length; s++) {
							if($li.eq(s).find(".code").text() == sdvdvdass[k].curCode) {
								$li.eq(s).removeClass("unselected").addClass("selected");
								var fzxlnrcode = $li.eq(s).find(".code").text();
								var fzxlnrname = $li.eq(s).find(".name").text();
								var exrate = $li.eq(s).attr('exrate')
								var rateDigits = $li.eq(s).attr('rateDigits')
								vifvcyb.eq(k).find(".ycbodyinp").eq(r).val(fzxlnrcode + " " + fzxlnrname).attr('code',fzxlnrcode)
								vifvcyb.eq(k).find(".exrateinp").attr('exrate', exrate).attr('rateDigits', rateDigits)
							}
						}
					}  else {
						var btcoded = headName
						for(var s = 0; s < fzhsxl[relation].length; s++) {
							if(fzhsxl[relation][s].code == sdvdvdass[k][btcoded]) {
								var fzxlnrcode = fzhsxl[relation][s].code
								var fzxlnrname = ''
								if(!isaccfullname) {
									fzxlnrname = fzhsxl[relation][s].name;
								} else {
									fzxlnrname = fzhsxl[relation][s].chrFullname;
								}
								vifvcyb.eq(k).find(".ycbodyinp").eq(r).val(fzxlnrcode + " " + fzxlnrname).attr('code',fzxlnrcode)
							}
						}
					}
				}
			}
		}
	}else if(sdvdvdass.length == 0){

	}
	if(sdvdvdass.length > 8) {
		ths.parents(".voucher-center").find(".voucher-yc").addClass("bgheight");
	}
}

function chapzone(obj) {
	var _this = obj
	_this.find(".abstractinp").val(voucopydata.descpt);
	for(var j = 0; j < $("#accounting-container").find("li").length; j++) {
		if(voucopydata.accoCode == "") {
			_this.find('.accountinginp').val("");
		} else {
			if(voucopydata.accoCode == $("#accounting-container").find("li").eq(j).find(".ACCO_CODE").text()) {
				var selacclen = $("#accounting-container").find("li").eq(j)
				if(isaccfullname) {
					_this.find('.accountinginp').val(voucopydata.accoCode + " " + selacclen.attr("fname")).attr("accbal", voucopydata.drCr);
				} else {
					_this.find('.accountinginp').val(voucopydata.accoCode + " " + selacclen.find(".ACCO_NAME").text()).attr("accbal", voucopydata.drCr);
				}
				_this.find('.accountinginp').parents('.accounting').attr('title', _this.find('.accountinginp').val())
				_this.find('.accountinginp').attr('acca',selacclen.attr('acca'))
				_this.find('.accountinginp').attr('code',selacclen.find(".ACCO_CODE").text())
				_this.find('.accountinginp').attr('name',selacclen.find(".ACCO_NAME").text())
				_this.find('.accountinginp').attr('accoindex',selacclen.attr('name'))
				_this.find('.accountinginp').attr('fname',selacclen.attr('fname'))
				_this.find('.accountinginp').attr('cashflow',selacclen.attr('cashflow'))
				_this.find('.accountinginp').attr('allowSurplus',selacclen.attr('allowSurplus'))
				_this.find('.accountinginp').parents(".accounting").find(".accountingye").show();
				_this.find('.accountinginp').parents(".accounting").find(".accountingye").text("余额");
				_this.find('.accountinginp').parents(".accounting").find(".accountingmx").show();
				if(vousinglepz == true) {
					if(_this.find('.accountinginp').attr('acca') == '1') {
						_this.find('.accountinginp').parents('.voucher-center').removeClass('voucher-center-ys').removeClass('voucher-center-cw').addClass('voucher-center-cw')
						_this.find('.accountinginp').parents('.voucher-center').find('.vouchertypebody').html('<div class="vouchertypebodycw">财</div>')
					
					} else if(_this.find('.accountinginp').attr('acca') == '2') {
						_this.find('.accountinginp').parents('.voucher-center').removeClass('voucher-center-ys').removeClass('voucher-center-cw').addClass('voucher-center-ys')
						_this.find('.accountinginp').parents('.voucher-center').find('.vouchertypebody').html('<div class="vouchertypebodyys">预</div>')
					}
				}
				if(selacclen.hasClass("fuhs0") != true) {
					_this.find('.accountinginp').parents(".accounting").find(".fuyan").show()
					if(voucopydata.vouDetailAsss != null) {
						var strdata = JSON.stringify(voucopydata.vouDetailAsss)
						_this.find('.accounting').attr('fudata', strdata)
						_this.find('.accounting').parents(".accounting").attr('accoSurplus', voucopydata.accoSurplus)
						_this.find('.accounting').parents(".accounting").attr('dfDc', voucopydata.dfDc)
					}
				}else{
					_this.find('.accountinginp').parents(".accounting").find(".fuyan").hide()
				}
				break;
			} else {
				_this.find('.accountinginp').val("");
			}
		}
	}
	if(voucopydata.drCr == -1) {
		if(voucopydata.stadAmt != null) {
			if(voucopydata.stadAmt == "") {
				if(vousinglepz == true) {
					_this.find('.moneyd').find(".money-sr").val("")
					_this.find('.moneyd').find(".money-xs").html("")
				} else if(vousinglepz == false && vousinglepzzy == true) {
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
				if(voucopydata.stadAmt >= 10000000000 || vousinglepz == true || vousinglepzzy == true) {
					_this.find('.moneyd').find(".money-xs").html(formatNum(parseFloat(voucopydata.stadAmt).toFixed(2)))
				} else {
					_this.find('.moneyd').find(".money-xs").html(parseFloat(parseFloat(voucopydata.stadAmt).toFixed(2) * 100).toFixed(0))
				}
				_this.find('.moneyj').find(".money-sr").val("")
				_this.find('.moneyj').find(".money-xs").html("")
			}
		}
	} else {
		if(voucopydata.stadAmt != null) {
			if(voucopydata.stadAmt == "") {
				if(vousinglepz == true) {
					_this.find('.moneyd').find(".money-sr").val("")
					_this.find('.moneyd').find(".money-xs").html("")
				} else if(vousinglepz == false && vousinglepzzy == true) {
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
				if(voucopydata.stadAmt >= 10000000000 || vousinglepz == true || vousinglepzzy == true) {
					_this.find('.moneyj').find(".money-xs").html(formatNum(parseFloat(voucopydata.stadAmt).toFixed(2)))
				} else {
					_this.find('.moneyj').find(".money-xs").html(parseFloat(parseFloat(voucopydata.stadAmt).toFixed(2) * 100).toFixed(0))
				}
				_this.find('.moneyd').find(".money-sr").val("")
				_this.find('.moneyd').find(".money-xs").html("")
			}
		}
	}
	
	if(vousinglepz == true) {
		if(_this.find('.accountinginp').attr('acca') == '1') {
			_this.find('.accountinginp').parents('.voucher-center').removeClass('voucher-center-ys').removeClass('voucher-center-cw').addClass('voucher-center-cw')
			_this.find('.accountinginp').parents('.voucher-center').find('.vouchertypebody').html('<div class="vouchertypebodycw">财</div>')
		
		} else if(_this.find('.accountinginp').attr('acca') == '2') {
			_this.find('.accountinginp').parents('.voucher-center').removeClass('voucher-center-ys').removeClass('voucher-center-cw').addClass('voucher-center-ys')
			_this.find('.accountinginp').parents('.voucher-center').find('.vouchertypebody').html('<div class="vouchertypebodyys">预</div>')
		}
	}
	bidui()
}

function chapzhq() {
	if(selectdata.data.vouDetails.length > 0) {
		var cwarrvou = []
		var ysarrvou = []
		for(var i = 0; i < selectdata.data.vouDetails.length; i++) {
			if(selectdata.data.vouDetails[i].accaCode == 1) {
				cwarrvou.push(selectdata.data.vouDetails[i])
			} else if(selectdata.data.vouDetails[i].accaCode == 2) {
				ysarrvou.push(selectdata.data.vouDetails[i])
			}
		}
		var allrunvous = []
		if(cwarrvou.length >= ysarrvou.length) {
			for(var i = 0; i < cwarrvou.length; i++) {
				allrunvous.push(cwarrvou[i])
				if(ysarrvou[i] != undefined) {
					allrunvous.push(ysarrvou[i])
				} else {
					allrunvous.push({
						'op': '3'
					})
				}
			}
		} else {
			for(var i = 0; i < ysarrvou.length; i++) {
				if(cwarrvou[i] != undefined) {
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
	if(selectdata.data.vouDetails.length > 0) {
		var cwarrvou = []
		var ysarrvou = []
		for(var i = 0; i < selectdata.data.vouDetails.length; i++) {
			if(selectdata.data.vouDetails[i].accaCode == 1) {
				cwarrvou.push(selectdata.data.vouDetails[i])
			} else if(selectdata.data.vouDetails[i].accaCode == 2) {
				ysarrvou.push(selectdata.data.vouDetails[i])
			}
		}
		var allrunvous = []
		for(var i = 0; i < cwarrvou.length; i++) {
			if(cwarrvou[i].accoCode != '' || cwarrvou[i].stadAmt != '') {
				allrunvous.push(cwarrvou[i])
			}
		}
		for(var i = 0; i < ysarrvou.length; i++) {
			if(ysarrvou[i].accoCode != '' || ysarrvou[i].stadAmt != '') {
				allrunvous.push(ysarrvou[i])
			}
		}
		selectdata.data.vouDetails = allrunvous
	}
}
function chapz() {
	if(vousinglepzzy == true) {
		chapzhq()
	}
	if(vousinglepz == true) {
		chapzhqdan()
	}
	if(ismodifybtn){
		vouiseditsave = false 
	}
	if(selectdata.data.vouSource != 'MANUAL' && selectdata.data.vouSource != 'AUTO' && selectdata.data.vouSource != undefined && selectdata.data.vouSource != '' && selectdata.data.vouSource != null) {
		isvousource = false
	} else {
		isvousource = true
	}
	$('#serarchdespcinput').val('')
	$('#replacedespcinput').val('')
	$('.despctsearchModal').hide(200)
	searchdespclength = 0;
	$('.vouaccSearchsinps').val('')
	$('.searchvvoukecha').removeAttr('vouGuid')
	$(".voucherleft").hide();
	vouchecker = selectdata.data.checker
	if(vousinglepz == false && vousinglepzzy == false) {
		if(selectdata.data.amtCr >= 10000000000) {
			$(".voucherall").find(".voucher-footer").find(".moneyj .money-xs").html(formatNum(selectdata.data.amtCr.toFixed(2)));
		} else if(selectdata.data.amtCr < 1 && selectdata.data.amtCr > 0) {
			$(".voucherall").find(".voucher-footer").find(".moneyj .money-xs").html('0' + selectdata.data.amtCr * 100);
		} else {
			$(".voucherall").find(".voucher-footer").find(".moneyj .money-xs").html(selectdata.data.amtCr * 100);
		}
		if(selectdata.data.amtDr >= 10000000000) {
			$(".voucherall").find(".voucher-footer").find(".moneyd .money-xs").html(formatNum(selectdata.data.amtDr.toFixed(2)));
		} else if(selectdata.data.amtCr < 1 && selectdata.data.amtCr > 0) {
			$(".voucherall").find(".voucher-footer").find(".moneyj .money-xs").html('0' + selectdata.data.amtCr * 100);
		} else {
			$(".voucherall").find(".voucher-footer").find(".moneyd .money-xs").html(selectdata.data.amtDr * 100);
		}
	} else if(vousinglepz == true && vousinglepzzy == false) {
		if(selectdata.data.amtCr > 0 && selectdata.data.amtDr > 0) {
			$(".voucherall").find(".voucher-footer").find(".moneyj .money-cw").html(formatNum(parseFloat(selectdata.data.amtCr).toFixed(2)));
			$(".voucherall").find(".voucher-footer").find(".moneyd .money-cw").html(formatNum(parseFloat(selectdata.data.amtDr).toFixed(2)));
		}
		if(selectdata.data.ysAmtCr > 0 && selectdata.data.ysAmtDr > 0) {
			$(".voucherall").find(".voucher-footer").find(".moneyj .money-ys").html(formatNum(parseFloat(selectdata.data.ysAmtCr).toFixed(2)));
			$(".voucherall").find(".voucher-footer").find(".moneyd .money-ys").html(formatNum(parseFloat(selectdata.data.ysAmtDr).toFixed(2)));
		}
	} else if(vousinglepz == false && vousinglepzzy == true) {
		if(selectdata.data.amtCr > 0 && selectdata.data.amtDr > 0) {
			$(".voucherall").find(".voucher-footer").find(".moneyhjcw .moneyj .money-xs").html(formatNum(parseFloat(selectdata.data.amtCr).toFixed(2)));
			$(".voucherall").find(".voucher-footer").find(".moneyhjcw .moneyd .money-xs").html(formatNum(parseFloat(selectdata.data.amtDr).toFixed(2)));
		}
		if(selectdata.data.ysAmtCr > 0 && selectdata.data.ysAmtDr > 0) {
			$(".voucherall").find(".voucher-footer").find(".moneyhjys .moneyj .money-xs").html(formatNum(parseFloat(selectdata.data.ysAmtCr).toFixed(2)));
			$(".voucherall").find(".voucher-footer").find(".moneyhjys .moneyd .money-xs").html(formatNum(parseFloat(selectdata.data.ysAmtDr).toFixed(2)));
		}
	}
	if(selectdata.data.vouTypeCode != $("#leftbgselect").find("option:selected").attr("value")){
		for(var i = 0; i < $("#leftbgselect").find("option").length; i++) {
			$("#leftbgselect").find("option").eq(i).removeProp("selected")
	
		}
		for(var i = 0; i < $("#leftbgselect").find("option").length; i++) {
			if($("#leftbgselect").find("option").eq(i).attr("value") == selectdata.data.vouTypeCode) {
				$("#leftbgselect").find("option").eq(i).prop("selected", true)
				$("#leftbgselect").find("option").eq(i).attr("selected", true)
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
			$(".searchvvoukecha").html(accsDatasearch())
		})
	}
	if(selectdata.data.vouDate != undefined) {
		$("#dates").getObj().setValue(selectdata.data.vouDate);
	}
	$("#fjd").val(selectdata.data.vouCnt);
	if(selectdata.data.vouNo != '' && selectdata.data.vouNo != undefined && selectdata.data.vouNo != null) {
		if(isfispredvouno) {
			if(selectdata.data.fisPerd != '' && selectdata.data.fisPerd != undefined && selectdata.data.fisPerd != null) {
				var voufispred = parseFloat(selectdata.data.fisPerd)
				if(voufispred < 10) {
					voufispred = '0' + voufispred
				}
				$("#sppz").val(voufispred + '-' + selectdata.data.vouNo);
			} else {
				var voufispred = (new Date($("#dates").getObj().getValue()).getMonth()) + 1
				if(voufispred < 10) {
					voufispred = '0' + voufispred
				}
				$("#sppz").val(voufispred + '-' + selectdata.data.vouNo);
			}
		} else {
			$("#sppz").val(selectdata.data.vouNo);
		}
		$("#sppz").attr('vouno', $("#sppz").val())
	}else{
		MaxVouNoUp()
	}
	if(selectdata.data.fisPerd != '' && selectdata.data.fisPerd != undefined && selectdata.data.fisPerd != null) {
		$("#sppz").attr('fisperds', selectdata.data.fisPerd)
	} else {
		$("#sppz").attr('fisperds', (new Date($("#dates").getObj().getValue()).getMonth()) + 1)
	}
	$(".nowu").text(selectdata.data.remark);
	if(selectdata.data.isWriteOff == '2'){
		$(".iswriteoff").text("冲红凭证").attr("guid",selectdata.data.writeOffId).show()
		$(".iswriteoff").attr("title","点击联查被冲红凭证:"+selectdata.data.writeOffVouTypeName+'-'+selectdata.data.writeOffVouNo)
	}else if(selectdata.data.isWriteOff == '1'){
		$(".iswriteoff").text("已冲红").attr("guid",selectdata.data.writeOffId).show()
		$(".iswriteoff").attr("title","点击联查冲红生成凭证:"+selectdata.data.writeOffVouTypeName+'-'+selectdata.data.writeOffVouNo)
	}else{
		$(".iswriteoff").hide()
	}
	if(selectdata.data.vouSourceName == undefined || selectdata.data.vouSourceName == null || selectdata.data.vouSourceName == '') {
		$(".vouSource").text('手工输入');
	} else {
		$(".vouSource").text(selectdata.data.vouSourceName);
	}
	if(selectdata.data.vouSource == 'AR') {
		if(getUrlParam("action") == "preview" && getUrlParam("preview") == "1") {} else {
			if(rpt.nowAgencyCode.substring(0,3) == 999){
				ufma.ajaxDef('/gl/vou/seleteBillNoListByVouGuid/' + selectdata.data.vouGuid, 'get', '', function(result) {
					$(".bxd").show()
					$(".bxd").html('报销单：' + result.data.billNo).prop('title', result.data.billNo).attr('gwzj',result.data.vouOpGuid).attr('dowloads',result.data.PDF)
				})
			}else{
				ufma.ajaxDef('/gl/vou/seleteBillNoAndBxNoListByVouGuid/' + selectdata.data.vouGuid+'/'+ufgovkey.svUserCode, 'get', '', function(result) {
					if(result.data.gwzjBillNo!=''){
						$(".bxd").show()
						$(".bxd").html('报销单：' + result.data.gwzjBillNo).prop('title', result.data.gwzjBillNo).attr('gwzj',result.data.vouOpGuid).attr('dowloads',result.data.PDF)
					}else{
						$(".bxd").show()
						$(".bxd").html('报销单：' + result.data.billNo).prop('title', result.data.billNo)
					}
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
	for(var i = 0; i < selectdata.data.vouDetails.length; i++) {
		if(selectdata.data.vouDetails[i].accoCode!=undefined){
			$(".voucher-center").eq(i).attr("refBillGuid", selectdata.data.vouDetails[i].refBillGuid);
			$(".voucher-center").eq(i).attr("ifEdit", true);
			if(selectdata.data.vouDetails[i].ifEdit == 'false'){
				$(".voucher-center").eq(i).attr("linkModule", selectdata.data.vouDetails[i].linkModule);
				$(".voucher-center").eq(i).attr("linkGuid", selectdata.data.vouDetails[i].linkGuid);
			}
			if(selectdata.data.vouGuid == selectdata.data.vouDetails[i].vouGuid) {
				$(".voucher-center").eq(i).attr("namess", selectdata.data.vouDetails[i].vouGuid);
				$(".voucher-center").eq(i).attr("namesss", selectdata.data.vouDetails[i].detailGuid);
			} else if(selectdata.data.templateGuid != '') {
				$(".voucher-center").eq(i).attr("namess", selectdata.data.vouDetails[i].vouGuid);
				$(".voucher-center").eq(i).attr("namesss", selectdata.data.vouDetails[i].detailGuid);
			}
			$(".voucher-center").eq(i).find(".abstractinp").val(selectdata.data.vouDetails[i].descpt);
			if(selectdata.data.vouDetails[i].accoCode == "") {
				$(".accountinginp").eq(i).val("");
			} else {
				if(page.Codenameacct[selectdata.data.vouDetails[i].accoCode]!=undefined){
					var j = page.Codenameacct[selectdata.data.vouDetails[i].accoCode]
					var selacclen = $("#accounting-container").find("li").eq(j)
					if(selacclen.hasClass('clik1')) {
						if(isaccfullname) {
							$(".accountinginp").eq(i).val(selectdata.data.vouDetails[i].accoCode + " " + selacclen.attr("fname")).attr("accbal", selectdata.data.vouDetails[i].drCr);
						} else {
							$(".accountinginp").eq(i).val(selectdata.data.vouDetails[i].accoCode + " " + selacclen.find(".ACCO_NAME").text()).attr("accbal", selectdata.data.vouDetails[i].drCr);
						}
						$(".accountinginp").eq(i).attr('acca',selacclen.attr('acca'))
						$(".accountinginp").eq(i).attr('accoindex',selacclen.attr('name'))
						$(".accountinginp").eq(i).attr('code',selacclen.find(".ACCO_CODE").text())
						$(".accountinginp").eq(i).attr('name',selacclen.find(".ACCO_NAME").text())
						$(".accountinginp").eq(i).attr('drCr',selectdata.data.vouDetails[i].drCr)
						$(".accountinginp").eq(i).attr('fname',selacclen.attr('fname'))
						$(".accountinginp").eq(i).attr('cashflow',selacclen.attr('cashflow'))
						$(".accountinginp").eq(i).attr('allowSurplus',selacclen.attr('allowSurplus'))
						$(".accountinginp").eq(i).parents(".accounting").find(".accountingye").show();
						$(".accountinginp").eq(i).parents(".accounting").find(".accountingye").text("余额");
						$(".accountinginp").eq(i).parents(".accounting").find(".accountingmx").show();
						if(selacclen.hasClass("fuhs0") != true) {
							$(".accountinginp").eq(i).parents(".accounting").find(".fuyan").show()
							if(selectdata.data.vouDetails[i].vouDetailAsss != null) {
								var strdata = JSON.stringify(selectdata.data.vouDetails[i].vouDetailAsss)
								$(".accountinginp").eq(i).parents(".accounting").attr('fudata', strdata)
							}
						}
					} else {
						$(".accountinginp").eq(i).val(selectdata.data.vouDetails[i].accoCode);
					}
				}
			}
			if(selectdata.data.vouDetails[i].drCr == -1) {
				if(selectdata.data.vouDetails[i].stadAmt != null) {
					if(selectdata.data.vouDetails[i].stadAmt == "" && parseFloat(selectdata.data.vouDetails[i].stadAmt) !=0) {
						$(".moneyd").eq(i).find(".money-sr").val("")
						$(".moneyd").eq(i).find(".money-xs").html("")
						$(".moneyj").eq(i).find(".money-sr").val("")
						$(".moneyj").eq(i).find(".money-xs").html("")
					} else {
						$(".moneyd").eq(i).find(".money-sr").val(parseFloat(selectdata.data.vouDetails[i].stadAmt).toFixed(2)).addClass('money-ys')
						if(selectdata.data.vouDetails[i].stadAmt >= 10000000000 || vousinglepz == true || vousinglepzzy == true) {
							$(".moneyd").eq(i).find(".money-xs").html(formatNum(parseFloat(selectdata.data.vouDetails[i].stadAmt).toFixed(2)))
						} else if(selectdata.data.vouDetails[i].stadAmt < 1 && selectdata.data.vouDetails[i].stadAmt > 0) {
							$(".moneyd").eq(i).find(".money-xs").html('0' + parseFloat(parseFloat(selectdata.data.vouDetails[i].stadAmt).toFixed(2) * 100).toFixed(0))
						} else {
							$(".moneyd").eq(i).find(".money-xs").html(parseFloat(parseFloat(selectdata.data.vouDetails[i].stadAmt).toFixed(2) * 100).toFixed(0))
						}
						$(".moneyj").eq(i).find(".money-sr").val("")
						$(".moneyj").eq(i).find(".money-xs").html("")
					}
				}
			} else {
				if(selectdata.data.vouDetails[i].stadAmt != null) {
					if(selectdata.data.vouDetails[i].stadAmt == ""&& parseFloat(selectdata.data.vouDetails[i].stadAmt) !=0) {
						$(".moneyj").eq(i).find(".money-sr").val("")
						$(".moneyj").eq(i).find(".money-xs").html("")
						$(".moneyd").eq(i).find(".money-sr").val("")
						$(".moneyd").eq(i).find(".money-xs").html("")
					} else {
						$(".moneyj").eq(i).find(".money-sr").val(parseFloat(selectdata.data.vouDetails[i].stadAmt).toFixed(2)).addClass('money-ys')
						if(selectdata.data.vouDetails[i].stadAmt >= 10000000000 || vousinglepz == true || vousinglepzzy == true) {
							$(".moneyj").eq(i).find(".money-xs").html(formatNum(parseFloat(selectdata.data.vouDetails[i].stadAmt).toFixed(2)))
						} else if(selectdata.data.vouDetails[i].stadAmt < 1 && selectdata.data.vouDetails[i].stadAmt > 0) {
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
	if(selectdata.data.vouGuid != undefined && selectdata.data.vouGuid != "" && selectdata.data.vouStatus!='C') {
		var nowyear = new Date($("#dates").getObj().getValue()).getFullYear()
		ufma.ajax('/gl/vou/checkVouNeedSignSur/'+selectdata.data.vouGuid+'/'+selectdata.data.vouSource+'/'+selectdata.data.vouKind+'/'+rpt.nowAgencyCode+'/'+rpt.nowAcctCode+'/'+ufgovkey.svRgCode+'/'+nowyear,'get','',function(result){
			if(result.data){
				$("#differBtn").slideDown(100).attr('data-fisPerd',selectdata.data.fisPerd);
				$("#differBtn").attr('data-createDate',selectdata.data.createDate).attr('data-createUser',selectdata.data.createUser)
			}else{
				$("#differBtn").slideUp(100);
			}
			for(var i = 0; i < $(".accountinginp").length; i++) {
				if($(".accountinginp").eq(i).attr("cashflow") == "1") {
					$(".xjll").slideDown(100);
					break;
				} else {
					$(".xjll").slideUp(100);
				}
			}
		})
	}
	if(selectdata.data.vouGuid == undefined || selectdata.data.vouGuid == "") {
		$("#leftbgselect").prop("disabled", false)
	} else {
		$("#leftbgselect").prop("disabled", true)
	}
	if(selectdata.data.remark == null) {
		$(".nowu").text("");
	} else {
		$(".nowu").text(selectdata.data.remark);
	}
	$(".voucher-history-zhankai").find("b").addClass("icon-angle-bottom").removeClass("icon-angle-top");
	$(".voucher-history-by").css("height", "0px");
	$(".voucher-history-by").html("");
	vouluru();
	var vclen = 0;
	var mobanjiahang = 4 - $(".voucher-center").length;
	if(mobanjiahang > 0) {
		for(var i = 0; i < mobanjiahang; i++) {
			$(".voucher-footer").before(tr());
			$(".voucherall").height($(".voucherall").height() + 50)
		}
	}
	var zclen = 0;
	if(vousinglepz) {
		var cjlen = $(".voucher-center").length - 6
		$(".voucherall").height(623 + 50 * cjlen)
	} else if(isdobabstractinp == true && vousinglepzzy) {
		var cjlen = $(".voucher-center").length - 4
		if(vousinglepzzy) {
			cjlen = $(".voucher-center").length / 2 - 4
		}
		if(cjlen>2){
			cjlen = 2
		}
		voucherycshowheight()
		$(".voucherall").height(658 + 50 * cjlen)

	} else {
		var cjlen = $(".voucher-center").length - 4
		if(vousinglepzzy) {
			cjlen = $(".voucher-center").length / 2 - 4
		}
		if(vousinglepzzy && vousingelzysdob){}else{
			$(".voucherall").height(523 + 50 * cjlen)
		}
	}
	if(selectdata.data.posterName != null) {
		$("#vfjz").find("span").text(selectdata.data.posterName)
	} else {
		$("#vfjz").find("span").text("")
	}
	if(selectdata.data.auditorName != null) {
		$("#vfsh").find("span").text(selectdata.data.auditorName)
	} else {
		$("#vfsh").find("span").text("")
	}
	if(selectdata.data.inputorName != null) {
		$("#vfzd").find("span").text(selectdata.data.inputorName).attr('code',selectdata.data.inputor)
	} else {
		$("#vfzd").find("span").text("")
	}
	bidui();
}

function huoquone(obj) {
	var _this = obj
	var datass = new Object();
	var abstract;
	if(_this.find(".abstractinp").length > 0) {
		abstract = _this.find(".abstractinp").val();
	} else {
		abstract = '';
	}
	var accoCodeName = _this.find(".accountinginp").val();
	var accoCode = accoCodeName.substring(0, accoCodeName.indexOf(" "));
	if(_this.find(".accountinginp").attr('allname') != undefined) {
		accoCodeName = _this.find(".accountinginp").attr('allname')
	}
	if(_this.find(".moneyj .money-sr").val() == "") {
		var drCr = -1;
		var stadAmt = _this.find(".moneyd .money-sr").val();
	} else {
		var drCr = 1
		var stadAmt = _this.find(".moneyj .money-sr").val();
	}
	var vouDetailAsss = new Array();
	if(_this.find(".accounting").attr('fudata') != undefined) {
		vouDetailAsss = JSON.parse(_this.find(".accounting").attr('fudata'))
		for(var i = 0; i < vouDetailAsss.length; i++) {
			delete vouDetailAsss[i].vouGuid
			delete vouDetailAsss[i].detailAssGuid
			delete vouDetailAsss[i].detailGuid
			vouDetailAsss[i].op = 0
		}
	} else {
		for(var z = 0; z < _this.find(".voucher-yc").length; z++) {
			if(_this.find(".voucher-yc").eq(z).hasClass("deleteclass") != true) {
				for(var j = 0; j < _this.find(".voucher-yc").eq(z).find(".voucher-yc-bo").length; j++) {
					_this.find(".voucher-yc").eq(z).find(".voucher-yc-bo").eq(j).index = j
					var bodyss = new Object();
					var $ycBt = _this.find(".voucher-yc").eq(z);
					var headLen = $ycBt.find(".ychead").length - 1;
					for(var k = 0; k < headLen; k++) {
						var dd = $ycBt.find(".ychead").eq(k).attr("name");
						if(dd == 'diffTermCode') {
							var itemCodeName = $ycBt.find(".voucher-yc-bo").eq(j).find(".ycbody").eq(k).find(".ycbodyinp").val();
							var itemCode = itemCodeName.substring(0, itemCodeName.indexOf(" "));
							//							if(itemCodeName!=''){
							datass['accoSurplus'] = itemCode;
							//							}
						} else if(dd == 'diffTermDir') {
							var itemCodeName = $ycBt.find(".voucher-yc-bo").eq(j).find(".ycbody").eq(k).find(".ycbodyinp").val();
							if(itemCodeName == '正向') {
								datass['dfDc'] = 1;
							} else {
								datass['dfDc'] = -1;
							}
						} else if(dd == 'expireDate' || dd == 'qty' || dd == 'price' || dd == 'exRate') {
							var itemCodeName = $ycBt.find(".voucher-yc-bo").eq(j).find(".ycbody").eq(k).find(".ycbodyinp").val().split(",").join("");
							bodyss[dd] = itemCodeName;
						} else if(dd == 'currAmt') {
							var itemCodeName = $ycBt.find(".voucher-yc-bo").eq(j).find(".ycbody").eq(k).find(".ycbodyinp").val().split(",").join("");
							bodyss[dd] = itemCodeName;
						} else if(dd == 'billNo' || dd == 'billDate' || dd == 'bussDate' || dd == 'remark' || dd == 'field1') {
							var itemCodeName = $ycBt.find(".voucher-yc-bo").eq(j).find(".ycbody").eq(k).find(".ycbodyinp").val();
							bodyss[dd] = itemCodeName;
							if( dd == 'field1' && itemCodeName!=''){
								bodyss.cancelAssGuid =  $ycBt.find(".voucher-yc-bo").eq(j).find(".ycbody").eq(k).find(".ycbodyinp").attr('cGuid')
							}
						} else {
							var itemCodeName = $ycBt.find(".voucher-yc-bo").eq(j).find(".ycbody").eq(k).find(".ycbodyinp").val();
							var itemCode = itemCodeName.substring(0, itemCodeName.indexOf(" "));
							bodyss[dd] = itemCode;
						}
					}
					var noshows = JSON.parse(_this.find(".voucher-yc").eq(z).find(".voucher-yc-bt").find('.noshowdata').attr('noshow'))
					for(var n in noshows) {
						bodyss[n] = noshows[n]
					}
					bodyss.op = "0";
					bodyss.vouDetailSeq = _this.find(".voucher-yc").eq(z).find(".voucher-yc-bo").eq(j).index();
					bodyss.vouSeq = _this.index();
					bodyss.stadAmt = _this.find(".voucher-yc").eq(z).find(".voucher-yc-bo").eq(j).find(".yctz").val().split(",").join("");
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
	datass.accaCode = _this.find(".accountinginp").attr('acca')
	if(datass.accaCode == undefined) {
		if(_this.hasClass('voucher-center-ys') || _this.hasClass('voucher-centerys')) {
			datass.accaCode = 2
		} else if(_this.hasClass('voucher-center-cw') || _this.hasClass('voucher-centercw')) {
			datass.accaCode = 1
		}
	}
	datass.vouSeq = _this.index();
	return datass
}

function huoqu(statusname) {
	var datasd = new Object();
	if($(".voucher-head").attr("namess") == undefined) {
		if($(".voucher-head").attr("tenamess") != undefined) {
			datasd.templateGuid = $(".voucher-head").attr("tenamess");
		}
		datasd.vouKind = "RC";
		if($("#sppz").val() != '*' && $("#sppz").val() != '') {
			if(isfispredvouno) {
				datasd.vouNo = $("#sppz").val().substring($("#sppz").val().indexOf('-') + 1, $("#sppz").val().length);
			} else {
				datasd.vouNo = $("#sppz").val()
			}
		}
		datasd.optNoType = $("#sppz").attr('optNoType')
		datasd.vouDate = $("#dates").getObj().getValue();
		if($("#fjd").val() != "") {
			datasd.vouCnt = $("#fjd").val();
		} else {
			datasd.vouCnt = "0";
		}
		datasd.checker = vouchecker
		datasd.vouDesc = '';
		datasd.agencyCode = rpt.nowAgencyCode;
		datasd.setYear = new Date($("#dates").getObj().getValue()).getFullYear();
		datasd.rgCode = ufgovkey.svRgCode;
		if($("#pzzhuantaiC").attr("vou-status") != undefined) {
			datasd.treasuryHook = $("#pzzhuantaiC").attr("vou-status");
		} else {
			datasd.treasuryHook = selectdata.data.treasuryHook;
		}
		if($(".xuanzhongcy").text() == "财务会计") {
			datasd.accaCode = 1;
			if($(".yusuan").attr("names") != undefined) {
				datasd.vouGroupId = $(".yusuan").attr("names")
			}
			if($(".chaiwu").attr("names") != undefined) {
				datasd.vouGroupId = $(".chaiwu").attr("names")
			}
		} else {
			datasd.accaCode = 2;
			if($(".chaiwu").attr("names") != undefined) {
				datasd.vouGroupId = $(".chaiwu").attr("names")
			}
			if($(".yusuan").attr("names") != undefined) {
				datasd.vouGroupId = $(".yusuan").attr("names")
			}
		}
		if(vousinglepz == true || vousinglepzzy == true || rpt.isParallel != "1") {
			datasd.accaCode = "*";
		}
		datasd.acctCode = rpt.nowAcctCode;
		datasd.fiLeader = rpt.createUser;
		if($(".nowu").text() == "") {
			datasd.remark = "暂无信息"
		} else {
			datasd.remark = $(".nowu").text();
		}
		datasd.vouTypeCode = $("#leftbgselect option:selected").attr("value");
		//保存的op一直为0
		datasd.op = "0";
		var datasss = new Array();
		for(var i = 0; i < $(".voucher-center").length; i++) {
			if($(".voucher-center").eq(i).attr("op") != 2) {
				if($(".voucher-center").eq(i).find(".accountinginp").val() != "" || ($(".voucher-center").eq(i).find(".abstractinp").val() != "" && $(".voucher-center").eq(i).find(".abstractinp").val() != undefined) || $(".voucher-center").eq(i).find(".moneyj").find(".money-xs").html() != "" || $(".voucher-center").eq(i).find(".moneyd").find(".money-xs").html() != "") {
					if(vousinglepzzy && $(".voucher-center").eq(i).hasClass('voucher-centerys') && $(".voucher-center").eq(i).find(".accountinginp").val() == "" && $(".voucher-center").eq(i).find(".moneyj").find(".money-xs").html() == "" && $(".voucher-center").eq(i).find(".moneyd").find(".money-xs").html() == "") {} else {
						$(".voucher-center").eq(i).index = i;
						var datass = new Object();
						var abstract;
						if($(".voucher-center").eq(i).find(".abstractinp").length > 0) {
							abstract = $(".voucher-center").eq(i).find(".abstractinp").val();
						} else {
							if($(".voucher-center").eq(i).attr('descpt') != undefined && $(".voucher-center").eq(i).attr('descpt') != '') {
								abstract = $(".voucher-center").eq(i).attr('descpt')
							} else {
								abstract = $(".voucher-center").eq(i - 1).find(".abstractinp").val();
							}
						}
						var accoCodeName = $(".voucher-center").eq(i).find(".accountinginp").val();

						if($(".voucher-center").eq(i).find(".accountinginp").attr('allname') != undefined) {
							accoCodeName = $(".voucher-center").eq(i).find(".accountinginp").attr('allname')
						}
						var accoCode = accoCodeName.substring(0, accoCodeName.indexOf(" "));
						if($(".voucher-center").eq(i).find(".moneyj .money-sr").val() == "") {
							var drCr = -1;
							var stadAmt = $(".voucher-center").eq(i).find(".moneyd .money-sr").val();
						} else {
							var drCr = 1
							var stadAmt = $(".voucher-center").eq(i).find(".moneyj .money-sr").val();
						}
						var vouDetailAsss = new Array();
						if($(".voucher-center").eq(i).find(".accounting").attr('fudata') != undefined) {
							if(JSON.parse($(".voucher-center").eq(i).find(".accounting").attr('fudata'))!=''){
								vouDetailAsss = JSON.parse($(".voucher-center").eq(i).find(".accounting").attr('fudata'))
							}else{
								vouDetailAsss = []
							}
							for(var z = 0; z < vouDetailAsss.length; z++) {
								for(var j in vouDetailAsss[z]) {
									if(vouDetailAsss[z][j] == "*") {
										delete vouDetailAsss[z][j]
									}
								}
							}
							datass['accoSurplus']=$(".voucher-center").eq(i).find(".accounting").attr('accoSurplus')
							datass['dfDc']=$(".voucher-center").eq(i).find(".accounting").attr('dfDc')
						} else {
							for(var z = 0; z < $(".voucher-center").eq(i).find(".voucher-yc").length; z++) {
								if($(".voucher-center").eq(i).find(".voucher-yc").eq(z).hasClass("deleteclass") != true) {
									for(var j = 0; j < $(".voucher-center").eq(i).find(".voucher-yc").eq(z).find(".voucher-yc-bo").length; j++) {
										if($(".voucher-center").eq(i).find(".voucher-yc").eq(z).find(".voucher-yc-bo").eq(j).find(".yctz").val() != "" && parseFloat($(".voucher-center").eq(i).find(".voucher-yc").eq(z).find(".voucher-yc-bo").eq(j).find(".yctz").val())!=0) {
											$(".voucher-center").eq(i).find(".voucher-yc").eq(z).find(".voucher-yc-bo").eq(j).index = j
											var bodyss = new Object();
											var $ycBt = $(".voucher-center").eq(i).find(".voucher-yc").eq(z);
											var headLen = $ycBt.find(".ychead").length - 1;
											for(var k = 0; k < headLen; k++) {
												var dd = $ycBt.find(".ychead").eq(k).attr("name");
												if(dd == 'diffTermCode') {
													var itemCodeName = $ycBt.find(".voucher-yc-bo").eq(j).find(".ycbody").eq(k).find(".ycbodyinp").val();
													var itemCode = itemCodeName.substring(0, itemCodeName.indexOf(" "));
													if(itemCodeName != '' || datass['accoSurplus'] == '') {
														datass['accoSurplus'] = itemCode;
													}
												} else if(dd == 'diffTermDir') {
													var itemCodeName = $ycBt.find(".voucher-yc-bo").eq(j).find(".ycbody").eq(k).find(".ycbodyinp").val();
													if(itemCodeName == '正向') {
														datass['dfDc'] = 1;
													} else {
														datass['dfDc'] = -1;
													}
												} else if(dd == 'expireDate' || dd == 'qty' || dd == 'price' || dd == 'exRate') {
													var itemCodeName = $ycBt.find(".voucher-yc-bo").eq(j).find(".ycbody").eq(k).find(".ycbodyinp").val().split(",").join("");
													bodyss[dd] = itemCodeName;
												} else if(dd == 'currAmt') {
													var itemCodeName = $ycBt.find(".voucher-yc-bo").eq(j).find(".ycbody").eq(k).find(".ycbodyinp").val().split(",").join("");
													bodyss[dd] = itemCodeName;
												} else if(dd == 'billNo' || dd == 'billDate' || dd == 'bussDate' || dd == 'remark' || dd == 'field1') {
													var itemCodeName = $ycBt.find(".voucher-yc-bo").eq(j).find(".ycbody").eq(k).find(".ycbodyinp").val();
													bodyss[dd] = itemCodeName;
													if( dd == 'field1' && itemCodeName!=''){
														bodyss.cancelAssGuid =  $ycBt.find(".voucher-yc-bo").eq(j).find(".ycbody").eq(k).find(".ycbodyinp").attr('cGuid')
													}
												} else {
													var itemCodeName = $ycBt.find(".voucher-yc-bo").eq(j).find(".ycbody").eq(k).find(".ycbodyinp").val();
													var itemCode = itemCodeName.substring(0, itemCodeName.indexOf(" "));
													bodyss[dd] = itemCode;
												}
											}
											var noshows = JSON.parse($(".voucher-center").eq(i).find(".voucher-yc").eq(z).find(".voucher-yc-bt").find('.noshowdata').attr('noshow'))
											for(var n in noshows) {
												bodyss[n] = noshows[n]
											}
											bodyss.op = "0";
											bodyss.vouDetailSeq = $(".voucher-center").eq(i).find(".voucher-yc").eq(z).find(".voucher-yc-bo").eq(j).index();
											bodyss.vouSeq = $(".voucher-center").eq(i).index();
											if($(".voucher-center").eq(i).find(".voucher-yc").eq(z).find(".voucher-yc-bo").eq(j).attr("refBillGuid")!=undefined){
												bodyss.refBillGuid = $(".voucher-center").eq(i).find(".voucher-yc").eq(z).find(".voucher-yc-bo").eq(j).attr("refBillGuid")
											}
											bodyss.stadAmt = $(".voucher-center").eq(i).find(".voucher-yc").eq(z).find(".voucher-yc-bo").eq(j).find(".yctz").val().split(",").join("");
											vouDetailAsss.push(bodyss);
										} else if(voucherupnow) {
											$(".voucher-center").eq(i).find(".voucher-yc").eq(z).find(".voucher-yc-bo").eq(j).index = j
											var bodyss = new Object();
											var $ycBt = $(".voucher-center").eq(i).find(".voucher-yc").eq(z);
											var headLen = $ycBt.find(".ychead").length - 1;
											for(var k = 0; k < headLen; k++) {
												var dd = $ycBt.find(".ychead").eq(k).attr("name");
												if(dd == 'diffTermCode') {
													var itemCodeName = $ycBt.find(".voucher-yc-bo").eq(j).find(".ycbody").eq(k).find(".ycbodyinp").val();
													var itemCode = itemCodeName.substring(0, itemCodeName.indexOf(" "));
													if(itemCodeName != '' || datass['accoSurplus'] == '') {
														datass['accoSurplus'] = itemCode;
													}
												} else if(dd == 'diffTermDir') {
													var itemCodeName = $ycBt.find(".voucher-yc-bo").eq(j).find(".ycbody").eq(k).find(".ycbodyinp").val();
													if(itemCodeName == '正向') {
														datass['dfDc'] = 1;
													} else {
														datass['dfDc'] = -1;
													}
												} else if(dd == 'expireDate' || dd == 'qty' || dd == 'price' || dd == 'exRate') {
													var itemCodeName = $ycBt.find(".voucher-yc-bo").eq(j).find(".ycbody").eq(k).find(".ycbodyinp").val().split(",").join("");
													bodyss[dd] = itemCodeName;
												} else if(dd == 'currAmt') {
													var itemCodeName = $ycBt.find(".voucher-yc-bo").eq(j).find(".ycbody").eq(k).find(".ycbodyinp").val().split(",").join("");
													bodyss[dd] = itemCodeName;
												} else if(dd == 'billNo' || dd == 'billDate' || dd == 'bussDate' || dd == 'remark'|| dd == 'field1') {
													var itemCodeName = $ycBt.find(".voucher-yc-bo").eq(j).find(".ycbody").eq(k).find(".ycbodyinp").val();
													bodyss[dd] = itemCodeName;
													if( dd == 'field1' && itemCodeName!=''){
														bodyss.cancelAssGuid =  $ycBt.find(".voucher-yc-bo").eq(j).find(".ycbody").eq(k).find(".ycbodyinp").attr('cGuid')
													}
												} else {
													var itemCodeName = $ycBt.find(".voucher-yc-bo").eq(j).find(".ycbody").eq(k).find(".ycbodyinp").val();
													var itemCode = itemCodeName.substring(0, itemCodeName.indexOf(" "));
													bodyss[dd] = itemCode;
												}
											}
											var noshows = JSON.parse($(".voucher-center").eq(i).find(".voucher-yc").eq(z).find(".voucher-yc-bt").find('.noshowdata').attr('noshow'))
											for(var n in noshows) {
												bodyss[n] = noshows[n]
											}
											bodyss.op = "0";
											bodyss.vouDetailSeq = $(".voucher-center").eq(i).find(".voucher-yc").eq(z).find(".voucher-yc-bo").eq(j).index();
											bodyss.vouSeq = $(".voucher-center").eq(i).index();
											if($(".voucher-center").eq(i).find(".voucher-yc").eq(z).find(".voucher-yc-bo").eq(j).attr("refBillGuid")!=undefined){
												bodyss.refBillGuid = $(".voucher-center").eq(i).find(".voucher-yc").eq(z).find(".voucher-yc-bo").eq(j).attr("refBillGuid")
											}
											bodyss.stadAmt = $(".voucher-center").eq(i).find(".voucher-yc").eq(z).find(".voucher-yc-bo").eq(j).find(".yctz").val().split(",").join("");
											vouDetailAsss.push(bodyss);

										}
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
						if($(".voucher-center").eq(i).attr("refBillGuid")!=undefined){
							datass.refBillGuid = $(".voucher-center").eq(i).attr("refBillGuid");
						}
						datass.accaCode = $(".voucher-center").eq(i).find(".accountinginp").attr('acca')
						if(datass.accaCode == undefined) {
							if($(".voucher-center").eq(i).hasClass('voucher-center-ys') || $(".voucher-center").eq(i).hasClass('voucher-centerys')) {
								datass.accaCode = 2
							} else if($(".voucher-center").eq(i).hasClass('voucher-center-cw') || $(".voucher-center").eq(i).hasClass('voucher-centercw')) {
								datass.accaCode = 1
							}
						}
						datass.vouSeq = $(".voucher-center").eq(i).index();
						datasss.push(datass)
						if(statusname == 'moban' && $(".voucher-center").eq(i).attr("mobanindex") == '1'){
							voucherindex = datasss.length
						}
					}
				}
			}
		}
		//获取合计并且转换成为保留两位小数的数字
		if(vousinglepz == false && vousinglepzzy == false) {
			var moneyj = $(".voucher-footer").find(".moneyj .money-xs").html();
			var moneyd = $(".voucher-footer").find(".moneyd .money-xs").html();
			if(moneyj.indexOf(".") >= 0) {
				datasd.amtDr = (parseFloat(commafyback(moneyj))).toFixed(2);
			} else {
				datasd.amtDr = (parseFloat(moneyj) / 100).toFixed(2);
			}
			if(moneyd.indexOf(".") >= 0) {
				datasd.amtCr = (parseFloat(commafyback(moneyd))).toFixed(2);
			} else {
				datasd.amtCr = (parseFloat(moneyd) / 100).toFixed(2);
			}
		} else if(vousinglepz == true && vousinglepzzy == false) {
			var moneyj = $(".voucher-footer").find(".moneyj .money-cw").html();
			var moneyd = $(".voucher-footer").find(".moneyd .money-cw").html();
			if(moneyj.indexOf(".") >= 0) {
				datasd.amtDr = (parseFloat(commafyback(moneyj))).toFixed(2);
			} else {
				datasd.amtDr = (parseFloat(moneyj) / 100).toFixed(2);
			}
			if(moneyd.indexOf(".") >= 0) {
				datasd.amtCr = (parseFloat(commafyback(moneyd))).toFixed(2);
			} else {
				datasd.amtCr = (parseFloat(moneyd) / 100).toFixed(2);
			}
			var ysmoneyj = $(".voucher-footer").find(".moneyj .money-ys").html();
			var ysmoneyd = $(".voucher-footer").find(".moneyd .money-ys").html();
			if(ysmoneyj.indexOf(".") >= 0) {
				datasd.ysAmtDr = (parseFloat(commafyback(ysmoneyj))).toFixed(2);
			} else {
				datasd.ysAmtDr = (parseFloat(ysmoneyj) / 100).toFixed(2);
			}
			if(moneyd.indexOf(".") >= 0) {
				datasd.ysAmtCr = (parseFloat(commafyback(ysmoneyd))).toFixed(2);
			} else {
				datasd.ysAmtCr = (parseFloat(ysmoneyd) / 100).toFixed(2);
			}
		} else if(vousinglepz == false && vousinglepzzy == true) {
			var moneyj = $(".voucher-footer").find(".moneyhjcw .moneyj .money-xs").html();
			var moneyd = $(".voucher-footer").find(".moneyhjcw .moneyd .money-xs").html();
			if(moneyj.indexOf(".") >= 0) {
				datasd.amtDr = (parseFloat(commafyback(moneyj))).toFixed(2);
			} else {
				datasd.amtDr = (parseFloat(moneyj) / 100).toFixed(2);
			}
			if(moneyd.indexOf(".") >= 0) {
				datasd.amtCr = (parseFloat(commafyback(moneyd))).toFixed(2);
			} else {
				datasd.amtCr = (parseFloat(moneyd) / 100).toFixed(2);
			}
			var ysmoneyj = $(".voucher-footer").find(".moneyhjys .moneyj .money-xs").html();
			var ysmoneyd = $(".voucher-footer").find(".moneyhjys .moneyd .money-xs").html();
			if(ysmoneyj.indexOf(".") >= 0) {
				datasd.ysAmtDr = (parseFloat(commafyback(ysmoneyj))).toFixed(2);
			} else {
				datasd.ysAmtDr = (parseFloat(ysmoneyj) / 100).toFixed(2);
			}
			if(moneyd.indexOf(".") >= 0) {
				datasd.ysAmtCr = (parseFloat(commafyback(ysmoneyd))).toFixed(2);
			} else {
				datasd.ysAmtCr = (parseFloat(ysmoneyd) / 100).toFixed(2);
			}
		}
		if(isNaN(parseFloat(datasd.amtDr))) {
			datasd.amtDr = "000";
		}
		if(isNaN(parseFloat(datasd.amtCr))) {
			datasd.amtCr = "000";
		}
		if(isNaN(parseFloat(datasd.ysAmtDr))) {
			datasd.ysAmtDr = "000";
		}
		if(isNaN(parseFloat(datasd.ysAmtCr))) {
			datasd.ysAmtCr = "000";
		}
		datasd.inputor = $("#vfzd").find("span").attr('code')
		datasd.inputorName = $("#vfzd").find("span").text()
		datasd.auditorName = $("#vfsh").find("span").text()
		datasd.posterName = $("#vfjz").find("span").text()
		datasd.vouDetails = datasss;
	} else {
		datasd.checker = vouchecker
		if(selectdata.data.vouKind!=undefined){
			datasd.vouKind = selectdata.data.vouKind;
		}else{
			datasd.vouKind = 'RC'
		}
		if($("#sppz").val() != '*' && $("#sppz").val() != '') {
			if(isfispredvouno) {
				datasd.vouNo = $("#sppz").val().substring($("#sppz").val().indexOf('-') + 1, $("#sppz").val().length);
			} else {
				datasd.vouNo = $("#sppz").val()
			}
		}
		datasd.optNoType = '0'
		datasd.vouDate = $("#dates").getObj().getValue();
		if($("#fjd").val() != "") {
			datasd.vouCnt = $("#fjd").val();
		} else {
			datasd.vouCnt = "0";
		}
		if($(".xuanzhongcy").text() == "财务会计") {
			datasd.accaCode = 1;
			if($(".yusuan").attr("names") != undefined) {
				datasd.vouGroupId = $(".yusuan").attr("names")
			}
			if($(".chaiwu").attr("names") != undefined) {
				datasd.vouGroupId = $(".chaiwu").attr("names")
			}
		} else {
			datasd.accaCode = 2;
			if($(".chaiwu").attr("names") != undefined) {
				datasd.vouGroupId = $(".chaiwu").attr("names")
			}
			if($(".yusuan").attr("names") != undefined) {
				datasd.vouGroupId = $(".yusuan").attr("names")
			}
		}
		if(vousinglepz == true || vousinglepzzy == true || rpt.isParallel != "1") {
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
		if(selectdata.data != undefined) {
			datasd.vouNo = selectdata.data.vouNo;
			datasd.setYear = selectdata.data.setYear;
			datasd.rgCode = selectdata.data.rgCode;
			datasd.fisPerd = new Date($("#dates").getObj().getValue()).getMonth() + 1;
			datasd.errFlag = selectdata.data.errFlag;;
			if($("#pzzhuantai").attr("vou-status") != undefined) {
				datasd.vouStatus = $("#pzzhuantai").attr("vou-status");
			} else {
				datasd.vouStatus = selectdata.data.vouStatus;
			}
			if($("#pzzhuantaiC").attr("vou-status") != undefined) {
				datasd.treasuryHook = $("#pzzhuantaiC").attr("vou-status");
			} else {
				datasd.treasuryHook = selectdata.data.treasuryHook;
			}
			//datasd.vouTypeCode = selectdata.data.vouTypeCode;
		}
		//		datasd.errMessage = "string";
		datasd.fiLeader = rpt.createUser;
		if($(".nowu").text() == "") {
			datasd.remark = "暂无信息"
		} else {
			datasd.remark = $(".nowu").text();
		}
		//修改保存时候最外部元素默认为1
		//drcr为-1时候为贷方,为1的时候为借
		datasd.op = "1";
		datasd.lastVer = selectdata.data.lastVer;
		var datasss = new Array();
		for(var i = 0; i < $(".voucher-center").length; i++) {
			if($(".voucher-center").eq(i).attr("op") == 2 && $(".voucher-center").eq(i).attr("namess") != undefined) {
				$(".voucher-center").eq(i).index = i;
				var datass = new Object();
				datass.op = $(".voucher-center").eq(i).attr("op");
				datass.vouGuid = $(".voucher-center").eq(i).attr("namess");
				datass.detailGuid = $(".voucher-center").eq(i).attr("namesss");
				datass.vouSeq = $(".voucher-center").eq(i).index();
				datasss.push(datass);
			} else if($(".voucher-center").eq(i).attr("op") != 2) {
				if($(".voucher-center").eq(i).find(".accountinginp").val() != "" || $(".voucher-center").eq(i).find(".abstractinp").val() != "" || $(".voucher-center").eq(i).find(".moneyj").find(".money-xs").html() != "" || $(".voucher-center").eq(i).find(".moneyd").find(".money-xs").html() != "") {
					if(vousinglepzzy && $(".voucher-center").eq(i).hasClass('voucher-centerys') && $(".voucher-center").eq(i).find(".accountinginp").val() == "" && $(".voucher-center").eq(i).find(".moneyj").find(".money-xs").html() == "" && $(".voucher-center").eq(i).find(".moneyd").find(".money-xs").html() == "") {
						if($(".voucher-center").eq(i).attr("namess") != undefined) {
							$(".voucher-center").eq(i).index = i;
							var datass = new Object();
							datass.op = '2';
							datass.vouGuid = $(".voucher-center").eq(i).attr("namess");
							datass.detailGuid = $(".voucher-center").eq(i).attr("namesss");
							datass.vouSeq = $(".voucher-center").eq(i).index();
							datasss.push(datass);
						}
					} else {
						$(".voucher-center").eq(i).index = i;
						var datass = new Object();
						var abstract;
						if($(".voucher-center").eq(i).find(".abstractinp").length > 0) {
							abstract = $(".voucher-center").eq(i).find(".abstractinp").val();
						} else {
							if($(".voucher-center").eq(i).attr('descpt') != undefined && $(".voucher-center").eq(i).attr('descpt') != '') {
								abstract = $(".voucher-center").eq(i).attr('descpt')
							} else {
								abstract = $(".voucher-center").eq(i - 1).find(".abstractinp").val();
							}
						}
						var accoCodeName = $(".voucher-center").eq(i).find(".accountinginp").val();
						if($(".voucher-center").eq(i).find(".accountinginp").attr('allname') != undefined) {
							accoCodeName = $(".voucher-center").eq(i).find(".accountinginp").attr('allname')
						}
						var accoCode = accoCodeName.substring(0, accoCodeName.indexOf(" "));
						//					var accoCode = $(".voucher-center").eq(i).find(".accountinginps").find(".selected").find(".ACCO_CODE").text();
						if($(".voucher-center").eq(i).find(".moneyj .money-sr").val() == "") {
							var drCr = -1;
							var stadAmt = $(".voucher-center").eq(i).find(".moneyd .money-sr").val();
						} else {
							var drCr = 1
							var stadAmt = $(".voucher-center").eq(i).find(".moneyj .money-sr").val();
						}
						var vouDetailAsss = new Array();
						if($(".voucher-center").eq(i).find(".accounting").attr('fudata') != undefined) {
							//							$(".voucher-center").eq(i).find('.accounting').find('.fuyan').trigger('click');
							if(JSON.parse($(".voucher-center").eq(i).find(".accounting").attr('fudata'))!=''){
								vouDetailAsss = JSON.parse($(".voucher-center").eq(i).find(".accounting").attr('fudata'))
							}else{
								vouDetailAsss = []
							}
							for(var z = 0; z < vouDetailAsss.length; z++) {
								for(var j in vouDetailAsss[z]) {
									if(vouDetailAsss[z][j] == "*") {
										delete vouDetailAsss[z][j]
									}
								}
							}
							datass['accoSurplus']=$(".voucher-center").eq(i).find(".accounting").attr('accoSurplus')
							datass['dfDc']=$(".voucher-center").eq(i).find(".accounting").attr('dfDc')
						} else {
							for(var z = 0; z < $(".voucher-center").eq(i).find(".voucher-yc").length; z++) {
								for(var j = 0; j < $(".voucher-center").eq(i).find(".voucher-yc").eq(z).find(".voucher-yc-bo").length; j++) {
									if($(".voucher-center").eq(i).find(".voucher-yc").eq(z).find(".voucher-yc-bo").eq(j).attr("op") == 2 && $(".voucher-center").eq(i).find(".voucher-yc-bo").eq(j).attr("namess") != undefined) {
										$(".voucher-center").eq(i).find(".voucher-yc").eq(z).find(".voucher-yc-bo").eq(j).index = j
										var bodyss = new Object();
										bodyss.vouDetailSeq = $(".voucher-center").eq(i).find(".voucher-yc").eq(z).find(".voucher-yc-bo").eq(j).index();
										bodyss.op = $(".voucher-center").eq(i).find(".voucher-yc").eq(z).find(".voucher-yc-bo").eq(j).attr("op");
										bodyss.vouGuid = $(".voucher-center").eq(i).find(".voucher-yc").eq(z).find(".voucher-yc-bo").eq(j).attr("namess");
										bodyss.detailGuid = $(".voucher-center").eq(i).find(".voucher-yc").eq(z).find(".voucher-yc-bo").eq(j).attr("namesss");
										bodyss.detailAssGuid = $(".voucher-center").eq(i).find(".voucher-yc").eq(z).find(".voucher-yc-bo").eq(j).attr("namessss");
										vouDetailAsss.push(bodyss);
									} else {
										if($(".voucher-center").eq(i).find(".voucher-yc").eq(z).find(".voucher-yc-bo").eq(j).find(".yctz").val() != "" && parseFloat($(".voucher-center").eq(i).find(".voucher-yc").eq(z).find(".voucher-yc-bo").eq(j).find(".yctz").val())!=0) {
											$(".voucher-center").eq(i).find(".voucher-yc").eq(z).find(".voucher-yc-bo").eq(j).index = j
											var bodyss = new Object();
											var $ycBt = $(".voucher-center").eq(i).find(".voucher-yc").eq(z);
											var headLen = $ycBt.find(".ychead").length - 1;
											for(var k = 0; k < headLen; k++) {
												var dd = $ycBt.find(".ychead").eq(k).attr("name");
												if(dd == 'diffTermCode') {
													var itemCodeName = $ycBt.find(".voucher-yc-bo").eq(j).find(".ycbody").eq(k).find(".ycbodyinp").val();
													var itemCode = itemCodeName.substring(0, itemCodeName.indexOf(" "));
													if(itemCodeName != '' || datass['accoSurplus'] == '') {
														datass['accoSurplus'] = itemCode;
													}
												} else if(dd == 'diffTermDir') {
													var itemCodeName = $ycBt.find(".voucher-yc-bo").eq(j).find(".ycbody").eq(k).find(".ycbodyinp").val();
													if(itemCodeName == '正向') {
														datass['dfDc'] = 1;
													} else {
														datass['dfDc'] = -1;
													}
												} else if(dd == 'expireDate' || dd == 'qty' || dd == 'price' || dd == 'exRate') {
													var itemCodeName = $ycBt.find(".voucher-yc-bo").eq(j).find(".ycbody").eq(k).find(".ycbodyinp").val().split(",").join("");
													bodyss[dd] = itemCodeName;
												} else if(dd == 'currAmt') {
													var itemCodeName = $ycBt.find(".voucher-yc-bo").eq(j).find(".ycbody").eq(k).find(".ycbodyinp").val().split(",").join("");
													bodyss[dd] = itemCodeName;
												} else if(dd == 'billNo' || dd == 'billDate' || dd == 'bussDate' || dd == 'remark' || dd == 'field1') {
													var itemCodeName = $ycBt.find(".voucher-yc-bo").eq(j).find(".ycbody").eq(k).find(".ycbodyinp").val();
													bodyss[dd] = itemCodeName;
													if( dd == 'field1' && itemCodeName!=''){
														bodyss.cancelAssGuid =  $ycBt.find(".voucher-yc-bo").eq(j).find(".ycbody").eq(k).find(".ycbodyinp").attr('cGuid')
													}
												} else {
													var itemCodeName = $ycBt.find(".voucher-yc-bo").eq(j).find(".ycbody").eq(k).find(".ycbodyinp").val();
													var itemCode = itemCodeName.substring(0, itemCodeName.indexOf(" "));
													bodyss[dd] = itemCode;
												}
											}
											var noshows = JSON.parse($(".voucher-center").eq(i).find(".voucher-yc").eq(z).find(".voucher-yc-bt").find('.noshowdata').attr('noshow'))
											for(var n in noshows) {
												bodyss[n] = noshows[n]
											}
											if($(".voucher-center").eq(i).find(".voucher-yc").eq(z).find(".voucher-yc-bo").eq(j).attr("namess") == undefined) {
												bodyss.op = 0;
											} else {
												if($(".voucher-center").eq(i).attr("op") == 1 && $(".voucher-center").eq(i).find(".voucher-yc").eq(z).find(".voucher-yc-bo").eq(j).attr("op") == 3) {
													bodyss.op = 1;
												} else {
													bodyss.op = $(".voucher-center").eq(i).find(".voucher-yc").eq(z).find(".voucher-yc-bo").eq(j).attr("op");
												}
											}
											bodyss.vouGuid = $(".voucher-center").eq(i).find(".voucher-yc").eq(z).find(".voucher-yc-bo").eq(j).attr("namess");
											bodyss.detailGuid = $(".voucher-center").eq(i).find(".voucher-yc").eq(z).find(".voucher-yc-bo").eq(j).attr("namesss");
											bodyss.detailAssGuid = $(".voucher-center").eq(i).find(".voucher-yc").eq(z).find(".voucher-yc-bo").eq(j).attr("namessss");
											if($(".voucher-center").eq(i).find(".voucher-yc").eq(z).find(".voucher-yc-bo").eq(j).attr("refBillGuid")!=undefined){
												bodyss.refBillGuid = $(".voucher-center").eq(i).find(".voucher-yc").eq(z).find(".voucher-yc-bo").eq(j).attr("refBillGuid")
											}
											var linkModule = $(".voucher-center").eq(i).find(".voucher-yc").eq(z).find(".voucher-yc-bo").eq(j).attr("linkModule")
											var linkGuid = $(".voucher-center").eq(i).find(".voucher-yc").eq(z).find(".voucher-yc-bo").eq(j).attr("linkGuid")
											if(linkModule!=undefined &&  linkModule!='undefined'){
												bodyss.linkModule = linkModule
											}
											if(linkGuid!=undefined &&  linkGuid!='undefined'){
												bodyss.linkGuid = linkGuid
											}
											bodyss.vouDetailSeq = $(".voucher-center").eq(i).find(".voucher-yc").eq(z).find(".voucher-yc-bo").eq(j).index();
											bodyss.vouSeq = $(".voucher-center").eq(i).index();
											bodyss.stadAmt = $(".voucher-center").eq(i).find(".voucher-yc").eq(z).find(".voucher-yc-bo").eq(j).find(".yctz").val().split(",").join("");
											vouDetailAsss.push(bodyss);
										}
									}
								}
							}
						}
						if($(".voucher-center").eq(i).attr("namess") == undefined) {
							datass.op = 0;
						} else {
							datass.op = $(".voucher-center").eq(i).attr("op");
						}
						datass.vouGuid = $(".voucher-center").eq(i).attr("namess");
						datass.detailGuid = $(".voucher-center").eq(i).attr("namesss");
						if($(".voucher-center").eq(i).attr("refBillGuid")!=undefined){
							datass.refBillGuid = $(".voucher-center").eq(i).attr("refBillGuid");
						}
						var linkModule = $(".voucher-center").eq(i).attr("linkModule")
						var linkGuid = $(".voucher-center").eq(i).attr("linkGuid")
						if(linkModule!=undefined && linkModule!='undefined'){
							datass.linkModule = linkModule
						}
						if(linkGuid!=undefined && linkGuid!='undefined'){
							datass.linkGuid = linkGuid
						}
						datass.vouDetailAsss = vouDetailAsss;
						datass.descpt = abstract;
						datass.drCr = drCr;
						datass.stadAmt = stadAmt;
						datass.accoCode = accoCode;
						datass.accaCode = $(".voucher-center").eq(i).find(".accountinginp").attr('acca')
						if(datass.accaCode == undefined) {
							if($(".voucher-center").eq(i).hasClass('voucher-center-ys') || $(".voucher-center").eq(i).hasClass('voucher-centerys')) {
								datass.accaCode = 2
							} else if($(".voucher-center").eq(i).hasClass('voucher-center-cw') || $(".voucher-center").eq(i).hasClass('voucher-centercw')) {
								datass.accaCode = 1
							}
						}
						datass.vouSeq = $(".voucher-center").eq(i).index();
						datasss.push(datass)
					}
				}
			}
		}
		if(vousinglepz == false && vousinglepzzy == false) {
			var moneyj = $(".voucher-footer").find(".moneyj .money-xs").html();
			var moneyd = $(".voucher-footer").find(".moneyd .money-xs").html();
			if(moneyj.indexOf(".") >= 0) {
				datasd.amtDr = (parseFloat(commafyback(moneyj))).toFixed(2);
			} else {
				datasd.amtDr = (parseFloat(moneyj) / 100).toFixed(2);
			}
			if(moneyd.indexOf(".") >= 0) {
				datasd.amtCr = (parseFloat(commafyback(moneyd))).toFixed(2);
			} else {
				datasd.amtCr = (parseFloat(moneyd) / 100).toFixed(2);
			}
		} else if(vousinglepz == true && vousinglepzzy == false) {
			var moneyj = $(".voucher-footer").find(".moneyj .money-cw").html();
			var moneyd = $(".voucher-footer").find(".moneyd .money-cw").html();
			if(moneyj.indexOf(".") >= 0) {
				datasd.amtDr = (parseFloat(commafyback(moneyj))).toFixed(2);
			} else {
				datasd.amtDr = (parseFloat(moneyj) / 100).toFixed(2);
			}
			if(moneyd.indexOf(".") >= 0) {
				datasd.amtCr = (parseFloat(commafyback(moneyd))).toFixed(2);
			} else {
				datasd.amtCr = (parseFloat(moneyd) / 100).toFixed(2);
			}
			var ysmoneyj = $(".voucher-footer").find(".moneyj .money-ys").html();
			var ysmoneyd = $(".voucher-footer").find(".moneyd .money-ys").html();
			if(ysmoneyj.indexOf(".") >= 0) {
				datasd.ysAmtDr = (parseFloat(commafyback(ysmoneyj))).toFixed(2);
			} else {
				datasd.ysAmtDr = (parseFloat(ysmoneyj) / 100).toFixed(2);
			}
			if(moneyd.indexOf(".") >= 0) {
				datasd.ysAmtCr = (parseFloat(commafyback(ysmoneyd))).toFixed(2);
			} else {
				datasd.ysAmtCr = (parseFloat(ysmoneyd) / 100).toFixed(2);
			}
		} else if(vousinglepz == false && vousinglepzzy == true) {
			var moneyj = $(".voucher-footer").find(".moneyhjcw .moneyj .money-xs").html();
			var moneyd = $(".voucher-footer").find(".moneyhjcw .moneyd .money-xs").html();
			if(moneyj.indexOf(".") >= 0) {
				datasd.amtDr = (parseFloat(commafyback(moneyj))).toFixed(2);
			} else {
				datasd.amtDr = (parseFloat(moneyj) / 100).toFixed(2);
			}
			if(moneyd.indexOf(".") >= 0) {
				datasd.amtCr = (parseFloat(commafyback(moneyd))).toFixed(2);
			} else {
				datasd.amtCr = (parseFloat(moneyd) / 100).toFixed(2);
			}
			var ysmoneyj = $(".voucher-footer").find(".moneyhjys .moneyj .money-xs").html();
			var ysmoneyd = $(".voucher-footer").find(".moneyhjys .moneyd .money-xs").html();
			if(ysmoneyj.indexOf(".") >= 0) {
				datasd.ysAmtDr = (parseFloat(commafyback(ysmoneyj))).toFixed(2);
			} else {
				datasd.ysAmtDr = (parseFloat(ysmoneyj) / 100).toFixed(2);
			}
			if(moneyd.indexOf(".") >= 0) {
				datasd.ysAmtCr = (parseFloat(commafyback(ysmoneyd))).toFixed(2);
			} else {
				datasd.ysAmtCr = (parseFloat(ysmoneyd) / 100).toFixed(2);
			}
		}
		if(isNaN(parseFloat(datasd.amtDr))) {
			datasd.amtDr = "000";
		}
		if(isNaN(parseFloat(datasd.amtCr))) {
			datasd.amtCr = "000";
		}
		if(isNaN(parseFloat(datasd.ysAmtDr))) {
			datasd.ysAmtDr = "000";
		}
		if(isNaN(parseFloat(datasd.ysAmtCr))) {
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
	fixedabsulate()
}

function noBC() {
	$("#btn-voucher-bc").addClass("btn-disablesd")
	$("#btn-voucher-bcbxz").addClass("btn-disablesd")
	$("#btn-voucher-bcbdy").addClass("btn-disablesd")
	$("#btn-voucher-zc").addClass("btn-disablesd")
	$("#mbbc").addClass("btn-disablesd")
}

function zhuantai() {
	$('.voucher-center').attr('mobanindex','0')
	if(selectdata.data.templateGuid == undefined || selectdata.data.templateGuid == '') {
		$(".voucher-head").attr("namess", selectdata.data.vouGuid);
		$(".voucher-head").removeAttr("tenamess")
	} else {
		$(".voucher-head").attr("tenamess", selectdata.data.templateGuid);
		$(".voucher-head").removeAttr("namess")
	}
	if(selectdata.data.vouGuid == ''){
		$(".voucher-head").removeAttr("namess")
	}
	if(selectdata.data.treasuryHook == 1) {
		if($('.yusuan').hasClass("xuanzhongcy") || vousinglepz || vousinglepzzy) {
			$("#pzzhuantaiC").show();
		} else {
			$("#pzzhuantaiC").hide();
		}
		$("#pzzhuantaiC").css("background", "rgb(236, 210, 21)").text("未挂接").attr("vou-status", selectdata.data.treasuryHook)
	} else if(selectdata.data.treasuryHook == 2) {
		if($('.yusuan').hasClass("xuanzhongcy") || vousinglepz || vousinglepzzy) {
			$("#pzzhuantaiC").show();
		} else {
			$("#pzzhuantaiC").hide();
		}
		$("#pzzhuantaiC").css("background", "rgb(236, 210, 21)").text("已挂接").attr("vou-status", selectdata.data.treasuryHook)
	} else if(selectdata.data.treasuryHook == 3) {
		$("#pzzhuantaiC").hide();
		$("#pzzhuantaiC").css("background", "rgb(236, 210, 21)").text("已挂接").attr("vou-status", selectdata.data.treasuryHook)
	} else {
		$("#pzzhuantaiC").hide().text("").removeAttr("vou-status");
	}
	if(selectdata.data.errFlag != 0 && $(".voucher-head").attr("namess") != undefined) {
		$("#xiaocuo").show();
	} else {
		$("#xiaocuo").hide();
	}
	if(selectdata.data.remark == null) {
		$(".nowu").text("");
	} else {
		$(".nowu").text(selectdata.data.remark);
	}
	$(".voucher-head").attr("op", selectdata.data.op);
	if(selectdata.data.templateGuid == undefined || selectdata.data.templateGuid == '') {
		if(selectdata.data.errFlag == 0 || selectdata.data.vouStatus == "C") {
			$("#xiaocuo").hide();
			if(selectdata.data.vouStatus == "O") {
				$("#pzzhuantai").show();
				$("#pzzhuantai").css("background", "#00A553");
				$("#pzzhuantai").text("未审核").attr("vou-status", selectdata.data.vouStatus);
				if(ismodifybtn){
					$(".datesno").show()
				}else{
					$(".datesno").hide()
				}
				vouchakan();
				var editStatus0 = ($("#pzzhuantai").attr("vou-status") == undefined);
				if(!editStatus0) {
					var editStatus1 = ($("#pzzhuantai").attr("vou-status") == "O");
					var editStatus2 = (isInputor == true && (selectdata.data.inputor == ufgovkey.svUserCode || selectdata.data.inputor == undefined));
					var editStatus3 = ((isvousource && isvousourceclick == false) || isvousourceclick)
					if(editStatus1 && (editStatus2 || isInputor == false) && editStatus3) {
					}else{
						$('#btn-voucher-xg').addClass('btn-disablesd')
					}
				}
				if(selectdata.data.vouDetails != undefined) {
					for(i = 0; i < selectdata.data.vouDetails.length; i++) {
						if(selectdata.data.vouDetails[i].op == 1 && issindouxg) {
							voubiaoji();
							break;
						}
					}
				}
			} else if(selectdata.data.vouStatus == "A") {
				$("#pzzhuantai").show();
				$("#pzzhuantai").css("background", "#00A553");
				$("#pzzhuantai").text("已审核").attr("vou-status", selectdata.data.vouStatus);
				$(".datesno").show()
				vouyishenhe();
			} else if(selectdata.data.vouStatus == "C") {
				$("#pzzhuantai").show();
				$("#pzzhuantai").css("background", "#EE4033");
				$("#pzzhuantai").text("已作废").attr("vou-status", selectdata.data.vouStatus);
				$(".datesno").show()
				vouyizuofei();
			} else if(selectdata.data.vouStatus == "P") {
				$("#pzzhuantai").show();
				$("#pzzhuantai").css("background", "#00A553");
				$("#pzzhuantai").text("已记账").attr("vou-status", selectdata.data.vouStatus);
				$(".datesno").show()
				vouyijizhang();
			} else {
				$("#pzzhuantai").hide().text("").removeAttr("vou-status");
				vouluru()
			}
		} else if(selectdata.data.errFlag == 2) {
			$("#pzzhuantai").show();
			$("#pzzhuantai").css("background", "#00A553");
			$("#pzzhuantai").text("已改错");
			vouyigaicuo()
		} else if(selectdata.data.errFlag == 1) {
			$("#pzzhuantai").show();
			$("#pzzhuantai").css("background", "#ffc017");
			$("#pzzhuantai").text("未改错");
			vouweigaicuo()
		}
	} else {
		vouluru();
	}
	fixedabsulate()
}

function afterAddRow() {
	//	if($(document).scrollTop() + document.documentElement.clientHeight > $(".voucherall").height()) {}else{
	//		var sc = $(document).scrollTop();
	//		$(window).scrollTop(sc+50);
	//	}
}

function fixedabsulate() {
	var fixedheight = 0;
	if(vousinglepzzy == false && vousinglepz == true) {
		fixedheight = $(".voucherall").height() - 100
	} else if(vousinglepzzy == true && vousinglepz == false && windowWidth > 1600 == false) {
		fixedheight = $(".voucherall").height() - 85
	} else if(vousinglepzzy == true && vousinglepz == false && windowWidth > 1600 == true) {
		fixedheight = $(".voucherall").height() - 135
	} else {
		fixedheight = $(".voucherall").height()
	}
	if($(document).scrollTop() + document.documentElement.clientHeight > $(".voucherall").height()) {
		$(".voucherbtn").css({
			"position": "absolute",
			"top": $(".voucherall").height() - 46 + "px"
		})
		//		$("#xiaocuo").css({
		//			"position": "absolute",
		//			"top": fixedheight - 487 + "px"
		//		})
	} else {
		$(".voucherbtn").css({
			"position": "fixed",
			"bottom": "0",
			"top": ""
		})
	}
	if($(document).scrollTop() + document.documentElement.clientHeight > fixedheight) {
		if(fixedheight - 513 > 50) {
			$(".voucherleft").css({
				"position": "absolute",
				"top": fixedheight - 483 + "px"
			})
		} else {
			$(".voucherleft").css({
				"position": "absolute",
				"top": "50px"
			})
		}
		if(fixedheight - 513 > 60) {
			$(".btn-showleft").css({
				"position": "absolute",
				"top": fixedheight - 513 + "px"
			})
		} else {
			$(".btn-showleft").css({
				"position": "absolute",
				"top": "60px"
			})
		}
		if($(".voucherall").height() - 423 > 100) {
			$(".chaiwu").css({
				"position": "absolute",
				"top": fixedheight - 423 + "px"
			})
		} else {
			$(".chaiwu").css({
				"position": "absolute",
				"top": "100px"
			})
		}
		if($(".voucherall").height() - 283 > 240) {
			$(".yusuan").css({
				"position": "absolute",
				"top": fixedheight - 283 + "px"
			})
		} else {
			$(".yusuan").css({
				"position": "absolute",
				"top": "240px"
			})
		}
		//		$(".xjll").css({
		//			"position": "absolute",
		//			"top": "50px"
		//		})
	} else {

		$(".voucherleft").css({
			"position": "fixed",
			"top": "50px",
			"bottom": ""
		})
		$(".btn-showleft").css({
			"position": "fixed",
			"top": "60px"
		})
		$(".chaiwu").css({
			"position": "fixed",
			"top": "150px"
		})
		$(".yusuan").css({
			"position": "fixed",
			"top": "290px"
		})
		//		$("#xiaocuo").css({
		//			"position": "fixed",
		//			"top":"80px"
		//		})
		//		$(".xjll").css({
		//			"position": "fixed",
		//			"top": "100px"
		//		})
	}
}

function cwyspd() {
	if(selectdata.data != undefined) {
		if(selectdata.data.accaCode == 1) {
			$(".chaiwu").addClass("xuanzhongcy").removeAttr("names");
			$(".yusuan").removeClass("xuanzhongcy").removeAttr("names");
			$(".xuanzhongcy").attr("names", selectdata.data.vouGroupId);
		} else if(selectdata.data.accaCode == 2) {
			$(".yusuan").addClass("xuanzhongcy").removeAttr("names");
			$(".chaiwu").removeClass("xuanzhongcy").removeAttr("names");
			$(".xuanzhongcy").attr("names", selectdata.data.vouGroupId);
		}
		if(selectdata.data.accaCode == "*") {
			$(".xuanzhongcy").attr("names", selectdata.data.vouGroupId);
		}
		voutypeword()
		if($("#leftbgselect option").length > 0) {
			if(isfispredvouno) {
				var voufispred = (new Date($("#dates").getObj().getValue()).getMonth()) + 1
				if(voufispred < 10) {
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
fixedabsulate();
$(document).on('dblclick', '#vouaccRelationtable tbody tr', function() {
	if($(this).find('input[type="checkbox"]').is(':checked')) {
		$(this).find('input[type="checkbox"]').prop('checked', false).attr('checked',false)
	} else {
		$(this).find('input[type="checkbox"]').prop('checked', true).attr('checked',true)
	}
})
$(document).on('change', '#vouaccRelationtable .checkalls', function() {
	if($(this).is(':checked')) {
		$("#vouaccRelationtable input[type='checkbox']").prop('checked', true)
	} else {
		$("#vouaccRelationtable input[type='checkbox']").prop('checked', false)
	}
})
$(document).on('click', '#btn-Relationsave', function() {
	var datar = []
	for(var i = 0; i < $('#vouaccRelationtable tbody tr').length; i++) {
		if($('#vouaccRelationtable tbody tr').eq(i).find("input[type='checkbox']").is(':checked')) {
			var datanow = accorationData[$('#vouaccRelationtable tbody tr').eq(i).attr('datas')]
			datar.push(datanow)
		}
	}
	var thisindex = $("#vouaccRelationtable").attr('remind') - 1
	if($('.voucher').hasClass('voucher-singelzybg') ||$('.voucher').hasClass('voucher-singelzyx')) {
		thisindex = $("#vouaccRelationtable").attr('remind')
	}
	var dataup = huoqu('isf')
	if(datar.length == 1) {
		voucopydata = datar[0]
		chapzone($('.voucher-center').eq(thisindex))
		page.editor.close()
	} else if(datar.length > 1) {
		for(var i = 0; i < datar.length; i++) {
			dataup.vouDetails.push(datar[i])
		}
		if(selectdata.data == undefined) {
			selectdata.data = {}
		}
		selectdata.data.vouDetails = dataup.vouDetails
		chapz()
		zhuantai()
		page.editor.close()
		isfocusmodal = true
	}
})
$(document).on('click', '#btn-Relationqx', function() {
	var thisindex = $("#vouaccRelationtable").attr('remind') - 1
	if($('.voucher').hasClass('voucher-singelzybg')) {
		thisindex = $("#vouaccRelationtable").attr('remind')
	}
	$('.voucher-center').eq(thisindex).find('.accountinginp').val('1').focus().val('')
	page.editor.close()
	isfocusmodal = true
})
$(document).on('click', '#btn-bcb', function() {
	var databc = huoqu()
	var tiao = ''
	for(var i = 0; i < databc.vouDetails.length; i++) {
		if(databc.vouDetails[i].accoCode == '1211') {
			tiao = '应收'
			break;
		} else if(databc.vouDetails[i].accoCode == '2301') {
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

$("#accReserbtn").click(function() {
	var inputAll = $('#accResearch').val();
	if(inputAll!='') {
		$('#vouaccRelationtable tbody tr').hide()
		if($('#vouaccRelationtable tbody tr').length > 0) {
			for(var i = 0; i < $('#vouaccRelationtable tbody tr').length; i++) {
				var text =  $('#vouaccRelationtable tbody tr').eq(i).find('td:not(".hide,.tc")').text()
				if(text.indexOf(inputAll) >= 0) {
					$('#vouaccRelationtable tbody tr').eq(i).show()
				}
			}
		}
	} else {
		//先隐藏全部，再把符合筛选条件的值显示
		$('#vouaccRelationtable tbody tr').show()
	}
});
$('#accResearch').on('keypress', function(event) {
	if(event.keyCode == "13") {
		$("#accReserbtn").click();
	}
})
$("#fzhsReserbtn").click(function() {
	var inputAll = $('#fzhsResearch').val();
	if(inputAll!='') {
		$('#voufzhsRelationtable tbody tr').hide()
		if($('#voufzhsRelationtable tbody tr').length > 0) {
			for(var i = 0; i < $('#voufzhsRelationtable tbody tr').length; i++) {
				var text =  $('#voufzhsRelationtable tbody tr').eq(i).find('td:not(".hide,.tc")').text()
				if(text.indexOf(inputAll) >= 0) {
					$('#voufzhsRelationtable tbody tr').eq(i).show()
				}
			}
		}
	} else {
		$('#voufzhsRelationtable tbody tr').show()
	}
});
$('#fzhsResearch').on('keypress', function(event) {
	if(event.keyCode == "13") {
		$("#fzhsReserbtn").click();
	}
})