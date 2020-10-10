//作为模态窗打开时的回调
window._close = function(reData, id, linkId) {
	if(window.closeOwner) {
		var data = {
			action: reData
		};
		if(id!=this.undefined){
			data.id = id
		}
		if(linkId!=this.undefined){
			data.linkId = linkId
		}
		window.closeOwner(data);
	}
}
window.onbeforeunload=function(e){     
　　var e = window.event||e;  
　　e.returnValue=("确定离开当前页面吗？");
} 
var voumenuid = getUrlParam("menuid")
ufma.getFapVersion(function (res) {
	if (res.data == "1" && ufma.GetQueryString("isJump") == "1") { //85平台 并且是从页面链接跳转过来的
		var callback = function (result) {
			voumenuid = result.data[0].id;
		}
		ufma.ajaxDef("/ma/sys/common/selectMenuCodeById", 'get',
			{
				menuId: ufma.GetQueryString("menuid")
			}, callback)
	} else {
		voumenuid = ufma.GetQueryString("menuid");
	}
})
var page = function() {
	return {}
}()
//添加辅助项范围的查询
var vouassRange={}
//记录上次的登录人使用凭证类型
var nowvoutype = '1'
//暂存
var isHistoryfzhs = true
//最大凭证号
var vouCurrMaxVouNo = '0001'
var isauditbiaocuo = true
var voucherupnow = false
var printServiceUrl = 'https:' == document.location.protocol ? "https://" + window.location.host : "http://" + window.location.host;
//是否修改
var optNoType = 0
var isaccfullname = true
var quanjuvoudatas = {
	data: []
}
//储存财务预算的关联数据
var accorationData=[]
//连续新增凭证
var vouisaddDate = true
//是否使用新增辅助项功能
var isaddAssbtn = true
var isfocusmodal = true
//自动带入上一行辅助核算
var vouiscopyprevAss =  true
var isfispredvouno = false
//是否显示常用摘要
var isabstract = true
//是否显示往来日期
var isbussDate = true
//复制行操作凭证
var voucopydata = {}
//判定是否来自于其他地方
var isvousource = false
var ifForIndex = true
var isdefaultopen = true
//判定如果凭证来自于其他模块生成是否可以修改
var isvousourceclick = true
//判断是否启用双摘要且在下模式
var isdobabstractinp = true
var vouisvague = false
//左右模式插入行是否单独插入
var iszysingleinsert = false
//判定分录行删除按钮是否可以展示
var isshowdetaildel = false
//判断是否大屏
var windowWidth = $(window).width();
if(window.ownerData ==undefined) {
	isdobabstractinp = true
	// $("#vouaccSearchs").show()
} else {
	isdobabstractinp = false
	// $("#vouaccSearchs").hide()
}
var ie11compatible = false
var ie11compatibleass = false
//单凭证左右结构双摘要启用字段
var vousingelzysdob = false
//点击金额栏切换借贷金额
var isnoclickmoney = false
//是否可以删除凭证
var isVouDel = true
var vouchecker = ''
var searchmobandata = ''
//是否汇总凭证
var isSummaryVou = false;
//指标文件
var keypandingzhibiao = []
//权限文件
var ufgovkey = ufma.getCommonData();
//左侧搜索内容
var leftsss = new Object();
//启用voubox
var vouboxtrue = true
//是否启用图形标错
var erristext = true
var isysorcw = false
var addindexiszy = true
//附件为0时候是否提示
var iszerofjd  = true
var iscancelshenhe = true
var isdeljizang = true
//辅助核算如果有值仍然使用辅助关联关系、
var isAssnullSave = false
//辅助核算是否有摘要
var isAssRemark = false
//打印是否打印单据信息
var isprintlp=true;
var isdepartmentChange = false
//判定修改是否需要点击修改按钮
var ismodifybtn = false
//是否展示往来号
var iscurrentNo = true
var isvouHangup = false
//是否按照项目编制凭证
var isprojectByVou=false
//添加部门经济分类索引
var expecoCodeindex = {}
//添加额度索引
var quotaCodeindex = {}
//添加财政预算项目索引
var depproCodeindex = {}
//添加项目索引
var projectCodeindex = {}
//票据号是否单独显示
var isalonebill = false
//判断环境是否为高校环境
var isuniversities = false
//是否自动找平分录金额
var isetcAmt = false;
var prevnextvoucher = -1;
ufma.ajaxDef('/bg/api/public/getUseBudgetSet','get','',function(data){
	if(data.data != 1){
		isuniversities = false
	}else{
		isuniversities = true
	}
})
if(ufgovkey == null) {}
//辅助核算对应的页面
var fzhsurlData = {
	'expfuncCode': '/pf/ma/expFunc/expFuncAgy.html?menuid=706bea16-f878-4427-b1d3-32e565720f77&menuname=%E6%94%AF%E5%87%BA%E5%8A%9F%E8%83%BD%E5%88%86%E7%B1%BB&firstLevel=21',
	'expecoCode': '/pf/ma/departBudget/departBudgetAgy.html?menuid=26cc1847-a3e0-4c80-a2a2-5b47467b7fa9&menuname=%E9%83%A8%E9%97%A8%E7%BB%8F%E6%B5%8E%E5%88%86%E7%B1%BB&firstLevel=21',
	'projectCode': '/pf/ma/project/projectAgy.html?menuid=f109ec32-830c-4be1-9a8a-0705777eaadd&menuname=%E9%A1%B9%E7%9B%AE&firstLevel=21',
	'currentCode': '/pf/ma/current/currentAgy.html?menuid=b443807f-d0ec-4182-8c5b-660702a232cf&menuname=%E5%BE%80%E6%9D%A5%E5%8D%95%E4%BD%8D&firstLevel=21', 
	'departmentCode': '/pf/ma/depEmp/depEmpAgy.html?menuid=bae081ed-a84c-4a15-9457-9ae259327575&menuname=%E9%83%A8%E9%97%A8%E4%BA%BA%E5%91%98&firstLevel=21',
	'employeeCode': '/pf/ma/depEmp/depEmpAgy.html?menuid=bae081ed-a84c-4a15-9457-9ae259327575&menuname=%E9%83%A8%E9%97%A8%E4%BA%BA%E5%91%98&firstLevel=21',
	'fatypeCode': '/pf/ma/govMoban/govMobanAgy.html?tableParam=MA_ELE_FATYPE&menuid=f30cbb73-0568-41b7-82c1-caa3822f151d&menuname=%E8%B5%84%E4%BA%A7%E7%B1%BB%E5%9E%8B&firstLevel=21',
	'setmodeCode': '/pf/ma/govMoban/govMobanAgy.html?tableParam=MA_ELE_SETMODE&menuid=db990e4f-6b0a-43a8-ac08-22d73651e892&menuname=%E7%BB%93%E7%AE%97%E6%96%B9%E5%BC%8F&firstLevel=21',
	'billtype':'/pf/ma/govMoban/govMobanAgy.html?tableParam=MA_ELE_BILLTYPE&menuid=769b9bf4-a112-4ef0-a0c3-f389540e994c&menuname=%E7%A5%A8%E6%8D%AE%E7%B1%BB%E5%9E%8B&firstLevel=21',
	'govexpecoCode':'/pf/ma/govMoban/govMobanAgy.html?tableParam=MA_ELE_GOVEXPECO&menuid=e0cffa22-27a6-4a53-b655-3ab456f2227d&menuname=%E6%94%BF%E5%BA%9C%E7%BB%8F%E6%B5%8E%E5%88%86%E7%B1%BB&firstLevel=11'
}
//登录日期
var result = ufgovkey.svTransDate;
var vousinglepz = false
var vousinglepzzy = false
var trisdata = 1
//在代码执行完之前不执行change事件的标识
var vouisendsel = false
//记录修改前的辅助核算
var temporaryfzhs = []
//记录上一行的辅助核算
var temporaryfzhsprev = []
var sssfmBtn = {
	"id": "btn-voucher-linkBill",
	"name": "联查单据",
	"class": "btn-link-bill",
	"isclass": ""
};
var isInputor;
var dd = ufgovkey.svTransDate;
$("#sppz").attr("disabled", true);
//获取所有可能出现的辅助核算项科目并且获取其对应的下拉框数据
var tablehead = new Object();
var voubalance = new Object();
var fzhsxl = new Object();
var billfzhsxl = [];
//合同号的下拉数据
var contractfzhsxl = []
var curCodefzhsxl = []
var curexratefzhsxl = {}
var diffentfzhsxl = [];
var accitemOrderSeq = new Object(); //科目辅助项顺序
//获取摘要下拉框的数据
var zaiyao = {
	data: []
}
var data = {}
var danweinamec = []; //凭证类型
var danweinamey = []; //凭证类型
function vouchershowsearch(){
	windowWidth = $(window).width();
	// if(windowWidth>1700){
	// 	$("#vouaccSearchs").show()
	// }else{
	// 	$("#vouaccSearchs").hide()
	// }
	if(windowWidth>1700 && vousinglepzzy == true && vousinglepz == false && isdobabstractinp == true){
		if($(this).hasClass('voucher-singelzybg')){
			$(".voucher").removeClass('voucher-singelzyx')
		}
		if(isprojectByVou && $(this).hasClass('voucher-singelzybg')){
			$(".voucher").removeClass('voucher-singelzyprojectx').addClass('voucher-singelzyproject')
		}
	}else{
		if($(this).hasClass('voucher-singelzybg')){
			$(".voucher").addClass('voucher-singelzyx')
		}
		if(isprojectByVou && $(this).hasClass('voucher-singelzybg')){
			$(".voucher").removeClass('voucher-singelzyproject').addClass('voucher-singelzyprojectx')
		}
	}
	if($('#vouislrud').hasClass("zys") || vousinglepz != true) {
		if(isdobabstractinp && vousinglepzzy && windowWidth>1700) {
			$('.voucherhe').css({
				'width': '1700px',
				'margin-left': '-850px'
			})
		} else if(vousinglepzzy){
			$('.voucherhe').css({
				'width': '1240px',
				'margin-left': '-626px'
			})
		}
	} else {
		$('.voucherhe').css({
			'width': '1094px',
			'margin-left': '-557px'
		})
	}
	fixedabsulate()
}
$(window).resize(function(){
	vouchershowsearch()
});
function GetQueryString(key) {
	// 获取参数
	var url = window.location.href;
	//截取？后的字符
	url = url.substring(url.indexOf("?"));
	// 正则筛选地址栏
	var reg = new RegExp("(^|&)" + key + "=([^&]*)(&|$)");
	// 匹配目标参数
	var result = url.substr(1).match(reg);
	//返回参数值
	return result ? decodeURIComponent(result[2]) : null;
}
//权限用ajax
function QXajax(url, callback) {
	if(isNull(url)) return false;

	$.ajax({
		url: url + "&ajax=1&rueicode="+hex_md5svUserCode,
		type: 'get', //GET
		async: false, //或false,是否异步
		//		data:argu,
		timeout: 60000, //超时时间
		dataType: 'json', //返回的数据格式：json/xml/html/script/jsonp/text
		contentType: 'application/json; charset=utf-8',
		beforeSend: function(xhr) {
			xhr.setRequestHeader("x-function-id",voumenuid);
		},
		success: function(result) {
			callback(result);
		},
		error: function(jqXHR, textStatus) {
			ufma.hideloading();
			var error = "";
			switch(jqXHR.status) {
				case 408:
					error = "请求超时";
					break;
				case 500:
					error = "服务器错误";
					break;
				default:
					break;
			}
			if(error != "") {
				ufma.alert(error);
				return false;
			}
		},
		complete: function(data) {
			$('.btn-ajax').removeAttr('disabled');
		}
	});
};
var  hex_md5svUserCode = ''
if (typeof hex_md5 === "function" && ufma.getCommonData().svUserCode != null) {
	hex_md5svUserCode = hex_md5(ufma.getCommonData().svUserCode)
}
var urlroleId = getUrlParam('roleId')
if($.isNull(urlroleId)) {
	urlroleId = ufma.getCommonData().svRoleId
}
hex_md5svUserCode+='&roleId=' + urlroleId
//返回票据号编辑框
function resBillBoxHtml() {
	var billHtml = '';
	return billHtml;
}
function isNull(target) {
	if(typeof(target) == 'undefined' || null == target || '' === target || 'null' == target || 'undefined' === target) {
		return true;
	} else {
		return false;
	}
}

function getUrlParam(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象 
	var r = window.location.search.substr(1).match(reg); //匹配目标参数 
	if(r != null)
		return unescape(r[2]);
	return null; //返回参数值 
}

function dataforcwys(data) {
	quanjuvouchaiwu = null
	quanjuvouyusuan = null
	for(var cy = 0; cy < data.length; cy++) {
		if(data[cy] !== null) {
			if(data[cy].accaCode == 1) {
				quanjuvouchaiwu = data[cy]
			} else if(data[cy].accaCode == 2) {
				quanjuvouyusuan = data[cy]
			} else if(data[cy].accaCode == '*') {
				quanjuvouchaiwu = data[cy]
				selectdata.data = data[cy]
			} else if(data[cy].accaCode == 3) {
				data[cy].accaCode = "*"
				quanjuvouchaiwu = data[cy]
				selectdata.data = data[cy]
			}
		}
	}
	if(quanjuvouchaiwu != null) {
		selectdata.data = quanjuvouchaiwu;
	} else if(quanjuvouyusuan != null) {
		selectdata.data = quanjuvouyusuan
	}
}
var isbtnpermission = ufma.getPermission();
//是否可打开会计科目编辑
var isaccopen = true
//是否可以保存并编辑科目
var vouiseditsave = true
if(ismodifybtn){
	vouiseditsave = false
}
//var isbtnpermission = [{"id":"btn-delete","flag":"9091"},{"id":"btn-audit","flag":"9091"},{"id":"btn-templet","flag":"9091"},{"id":"btn-addprint","flag":"9091"},{"id":"btn-temporary","flag":"9091"},{"id":"btn-delturnerror","flag":"9091"},{"id":"btn-search","flag":"9091"},{"id":"btn-add","flag":"9091"},{"id":"btn-save","flag":"9091"},{"id":"btn-saveadd","flag":"9091"},{"id":"btn-watch","flag":"9091"},{"id":"btn-print","flag":"9091"},{"id":"btn-print-preview","flag":"9091"},{"id":"btn-post","flag":"9091"},{"id":"btn-turnred","flag":"9091"},{"id":"btn-noturnerror","flag":"9091"},{"id":"btn-turnerror","flag":"9091"},{"id":"btn-cancel","flag":"9091"},{"id":"btn-copy","flag":"9091"},{"id":"btn-upload","flag":"9091"},{"id":"btn-scan","flag":"9091"},{"id":"btn-delaudit","flag":"9091"},{"id":"btn-delpost","flag":"9091"},{"id":"btn-insert","flag":"9091"},{"id":"btn-addtemplet","flag":"9091"},{"id":"btn-delcancel","flag":"9091"}];
for(var z = 0; z < isbtnpermission.length; z++) {
	if(isbtnpermission[z].role_id!=''){
		isbtnpermission[z].id = isbtnpermission[z].code
		isbtnpermission[z].flag = '9090'
	}
	if(isbtnpermission[z].id == 'btn-xzkjkm' && isbtnpermission[z].flag == '0') {
		isaccopen = false
	}
	if(isbtnpermission[z].id == 'btn-save' && isbtnpermission[z].flag == '0') {
		vouiseditsave = false
	}
	if(isbtnpermission[z].id == 'btn-detaildel') {
		isshowdetaildel = true
	}
}
//判断凭证来源是否为SSSFM
function checkVouSource(voubtn) {
	if(selectdata != undefined) {
		if(!$.isNull(selectdata.data)) {
			if(selectdata.data.vouSource == "SSSFM" || selectdata.data.vouSource == "NXBK") {
				voubtn.push(sssfmBtn);
			}
		}
	}

}
//给每一行添加序号
function biduiindex() {
	if(vousinglepz == false && vousinglepzzy == false) {
		var s = 1
		for(var i = 0; i < $('.voucher-center').length; i++) {
			if($('.voucher-center').eq(i).hasClass('deleteclass') != true) {
				var indexdiv = $('.voucher-center').eq(i).find('.voucherjias')
				if(indexdiv.find('.voucherindex').length == 0) {
					indexdiv.append('<span class="voucherindex">' + s + '</span>')
					s++;
				} else {
					indexdiv.find('.voucherindex').html(s)
					s++
				}
			}
		}
	} else if(vousinglepz == true && vousinglepzzy == false) {
		var s = 1
		for(var i = 0; i < $('.voucher-center').length; i++) {
			if($('.voucher-center').eq(i).hasClass('deleteclass') != true) {
				var indexdiv = $('.voucher-center').eq(i).find('.voucherjias')
				if(indexdiv.find('.voucherindex').length == 0) {
					indexdiv.append('<span class="voucherindex">' + s + '</span>')
					s++;
				} else {
					indexdiv.find('.voucherindex').html(s)
					s++
				}
			}
		}
	} else if(vousinglepz == false && vousinglepzzy == true) {
		var s = 1
		for(var i = 0; i < $('.voucher-centercw').length; i++) {
			if($('.voucher-centercw').eq(i).hasClass('deleteclass') != true) {
				var indexdiv = $('.voucher-centercw').eq(i).find('.voucherjias')
				if(indexdiv.find('.voucherindex').length == 0) {
					indexdiv.append('<span class="voucherindex">' + s + '</span>')
					s++;
				} else {
					indexdiv.find('.voucherindex').html(s)
					s++
				}
			}
		}
	}
}
//打印方法
function vouprint(dy) {
	ufma.removeCache("iWantToPrint");
	//凭证箱打印缓存数据
	var printCache = {};
	printCache.agencyCode = rpt.nowAgencyCode
	printCache.acctCode = rpt.nowAcctCode
	printCache.componentId = 'GL_VOU'
	var ajaxdata = {
		agencyCode: rpt.nowAgencyCode,
		acctCode: rpt.nowAcctCode,
		componentId: 'GL_VOU'
	}
	var TMPL_CODEs = ''
	ufma.ajaxDef('/gl/vouPrint/getUsedPrtList', 'post', ajaxdata, function(result) {
		if(result.data.length == 0) {
			ufma.showTip('未设置默认打印模板，请在打印设置中设置默认打印模板后执行打印', function() {}, 'warning')
			return false;
		} else {
			TMPL_CODEs = result.data[0].printTmpl.TMPL_CODE
			printCache.tmplCode = TMPL_CODEs
		}
	})
	printCache.vouGuids = [$(".voucher-head").attr("namess")];
	//打印判断缓存
	var judgeCache = {};
	judgeCache.dataFrom = "vou"; //来源
	judgeCache.direct = "1"; //是否直接打印，你们传"0"

	var cacheData = {
		print: printCache,
		judge: judgeCache
	};
	ufma.setObjectCache("iWantToPrint", cacheData);
	var callback = function(result) {
		var pData = result.data;
		var domain = printServiceUrl + '/pqr/pages/query/query.html';
		var uniqueInfo = new Date().getTime().toString()
		var url = domain +
			'?sys=100&code=' + TMPL_CODEs + '&' + dy + '&' +
			'uniqueInfo=' + uniqueInfo
		var myPopup = window.open(url, uniqueInfo);
		var dataCnt = 0;
		var connected = false;
		var index = setInterval(function() {
			if(connected) {
				clearInterval(index)
			} else {
				var message = {
					uniqueInfo: uniqueInfo,
					type: 0
				}
				//send the message and target URI
				myPopup.postMessage(message, domain)
			}
		}, 2000)
		window.addEventListener('message', function(event) {
			//连接通信
			if(event.data.hasOwnProperty('uniqueInfo')) {
				if(event.data.uniqueInfo === uniqueInfo) {
					if(event.data.result === 0) {
						connected = true;
						//如果发送测试数据未关闭，先关闭发送测试数据index

						//第一遍发送数据
						var message;
						var dType = 1;
						if(1 == pData.data.length) {
							dType = 2;
						}
						message = {
							uniqueInfo: uniqueInfo,
							type: dType,
							dataType: 1,
							data: {
								'gl_voucher_ds1': pData.data[0]
							}
						}
						myPopup.postMessage(message, domain)
					} else if(event.data.result === 1) {

						if(connected) {

							dataCnt++;
							var message;
							var dType = 1;
							if(dataCnt == (pData.data.length - 1)) {
								dType = 2;
							}
							message = {
								uniqueInfo: uniqueInfo,
								type: dType,
								dataType: 1,
								data: {
									'gl_voucher_ds1': pData.data[dataCnt]
								}
							}
							myPopup.postMessage(message, domain)
						}
					} else {}
				}
			}
		}, false);
	}
	ufma.post("/gl/vouPrint/getPrtData", printCache, callback);
}
function getPdf(reportCode, templId, groupDef) {
	var xhr = new XMLHttpRequest()
	var formData = new FormData()
	formData.append('reportCode', reportCode)
	formData.append('templId', templId)
	formData.append('groupDef', groupDef)
	xhr.open('POST', '/pqr/api/printpdfbydata', true)
	xhr.setRequestHeader('context-type', 'text/xml;charset=utf-8')
	xhr.responseType = 'blob'

	//保存文件
	xhr.onload = function(e) {
		if(xhr.status === 200) {
			if(xhr.status === 200) {
				var content = decodeURIComponent(xhr.getResponseHeader('Content-Disposition'))
				window.open(content, '_blank', 'titlebar=no,location=no,toolbar=no,menubar=no;top=100')
			}
		}
	}

	//状态改变时处理返回值
	xhr.onreadystatechange = function() {
		if(xhr.readyState === 4) {
			//通信成功时
			if(xhr.status === 200) {
				//交易成功时
				ufma.hideloading();
			} else {
				var content = decodeURIComponent(xhr.getResponseHeader('Content-Disposition'))
				//提示框，各系统自行选择插件
				alert(content)
				ufma.hideloading();
			}
		}
	}
	xhr.send(formData)
}
function vouprintpdf(){
	var printCache = {};
	printCache.agencyCode = rpt.nowAgencyCode
	printCache.acctCode = rpt.nowAcctCode
	printCache.componentId = 'GL_VOU'
	var ajaxdata = {
		agencyCode: rpt.nowAgencyCode,
		acctCode: rpt.nowAcctCode,
		componentId: 'GL_VOU'
	}
	var TMPL_CODEs = ''
	var postSetData = {
		agencyCode: rpt.nowAgencyCode,
		acctCode: rpt.nowAcctCode,
		componentId: "GL_VOU",
		rgCode: ufgovkey.svRgCode,
		setYear: ufgovkey.svSetYear,
		sys: '100',
		directory: '打印凭证'
	};
	var reportCode = ''
	var templId = ''
	var Nowdata = {
		"agencyCode": rpt.nowAgencyCode,
		"acctCode": rpt.nowAcctCode,
		"componentId": "GL_VOU"
	}
	ufma.ajaxDef("/gl/vouPrint/getPrtTmplPdfNew", 'post', Nowdata, function(data) {
			reportCode = data.data[0].tmplCode
			templId =  data.data[0].formattmplCode
			printCache.tmplCode =  data.data[0].tmplCode
			printCache.formatTmplCode =  data.data[0].formattmplCode
	})
	ufma.showloading('正在打印，请耐心等待...');
	printCache.vouGuids = [$(".voucher-head").attr("namess")];
	var guidArr =printCache.vouGuids
	var lpdata;
	if(isprintlp){
		ufma.ajaxDef("/gl/vou/selectBillListByVouGuids", 'post', [$(".voucher-head").attr("namess")], function(data) {
			lpdata = {}
			for(var i=0;i<data.data.length;i++){
				for(var z in data.data[i]){
					lpdata[z]=data.data[i][z]
				}
				
			}
		})
	}
	var callback = function(result) {
		var voudata = []
		for(var i = 0; i < result.data.data.length; i++) {
			if(isprintlp){
				var now = [{}]
				if(lpdata[guidArr[i]]!=undefined){
					now=[lpdata[guidArr[i]]]
				}
				voudata.push({
					'gl_voucher_ds1': result.data.data[i],
					"lp_bill_info":now
				})
			}else{
				voudata.push({
					'gl_voucher_ds1': result.data.data[i],
					"lp_bill_info":[{}]
				})
			}
		}
		var pData = JSON.stringify(voudata);
		getPdf(reportCode, templId, pData)
	}
	ufma.post("/gl/vouPrint/getPrtDataPdf", printCache, callback);
	ufma.post("/gl/vouPrint/updatePtintCountByGuid", {
		vouGuids: [$(".voucher-head").attr("namess")]
	}, function(data) {});
}
//更新凭证最大号方法
function MaxVouNoUp(){
	var newfispred = (new Date($("#dates").getObj().getValue()).getMonth()) + 1
	if($("#sppz").attr('fisperds') == newfispred  && $("#sppz").attr('vouno')!=undefined){
		$("#sppz").val($("#sppz").attr('vouno'))
	}else if($(".voucher-head").attr("namess") == undefined || $("#sppz").attr('fisperds') != newfispred) {
		ufma.ajaxDef('/gl/vou/getCurrMaxVouNo/' + rpt.nowAgencyCode + '/' + rpt.nowAcctCode + '/' + newfispred + '/' + $("#leftbgselect option:selected").attr("value"), 'post', '', function(data) {
			vouCurrMaxVouNo = data.data
			if($("#leftbgselect option").length > 0) {
				if(isfispredvouno) {
					var voufispred = (new Date($("#dates").getObj().getValue()).getMonth()) + 1
					if(voufispred < 10) {
						voufispred = '0' + voufispred
					}
					$(".voucherhe").find("#sppz").val(voufispred + '-' + vouCurrMaxVouNo).removeAttr('vouno').removeAttr('fisperds');
				} else {
					$(".voucherhe").find("#sppz").val(vouCurrMaxVouNo).removeAttr('vouno').removeAttr('fisperds');
				}
			} else {
				$(".voucherhe").find("#sppz").val('');
			}
		})
	}
}
$("#dates").ufDatepicker({
	format: 'yyyy-mm-dd',
	initialDate: ufgovkey.svTransDate,
}).on('change', function() {
	if($(".voucher-head").attr("namess") != undefined){
		if(selectdata.data.vouDate !=undefined){
			var oldfispred = (new Date(selectdata.data.vouDate).getMonth()) + 1
			var newfispred = (new Date($("#dates").getObj().getValue()).getMonth()) + 1
			if(oldfispred!=newfispred){
				$("#dates").getObj().setValue(selectdata.data.vouDate)
				ufma.showTip("凭证日期不符合原凭证所属期间，请重新选择", function() {}, "warning");
			}
		}
	}else{
		MaxVouNoUp()
	}
});
//关闭凭证自定义模态框
function closeVouMask(){
	$("#zezhao").html("")
	$("#zezhao").hide();
}
//大写字母下划线转小驼峰字符串
function tf(str) {
	var newStr = str.toLowerCase();
	var endStr = "";
	if(newStr.indexOf("_") != "-1") {
		var arr = newStr.split("_");
		for(var i = 1; i < arr.length; i++) {
			arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].substring(1);
		}
		endStr = arr.join("")
	} else {
		endStr = newStr
	}
	return endStr;
};
//还原会计科目等选择框
//显示会计科目
function accoSelShow(ths){
	$(".AccoTree").removeClass('selAccoTree').hide();
	var sctop = ths.offset().top - $(window).scrollTop() + 50
	var scleft = ths.offset().left - $(window).scrollLeft()
	if(ths.parents('.voucher-center').hasClass('voucher-centerys') || ths.parents('.voucher-center').hasClass('voucher-center-ys')){
		$("#accounting-container-ys").show().addClass('selAccoTree').css({
			'position': 'fixed',
			'top': sctop,
			'left': scleft
		});
	}else if(ths.parents('.voucher-center').hasClass('voucher-centercw') || ths.parents('.voucher-center').hasClass('voucher-center-cw')){
		$("#accounting-container-cw").show().addClass('selAccoTree').css({
			'position': 'fixed',
			'top': sctop,
			'left': scleft
		});
	}else{
		$("#accounting-container").show().addClass('selAccoTree').css({
			'position': 'fixed',
			'top': sctop,
			'left': scleft
		});
	}
}
function isInputChange(){
	var editStatus0 = ($("#pzzhuantai").attr("vou-status") == undefined);
	if(!editStatus0) {
		var editStatus1 = ($("#pzzhuantai").attr("vou-status") == "O");
		var editStatus2 = (isInputor == true && (selectdata.data.inputor == ufgovkey.svUserCode || selectdata.data.inputor == undefined));
		var editStatus3 = ((isvousource && isvousourceclick == false) || isvousourceclick)
		if(editStatus1 && (editStatus2 || isInputor == false) && editStatus3 && !editStatus0  && vouiseditsave) {
			return true
		}else{
			return false
		}
	}else{
		return true
	}
}
function Obtainaccs(ths,isprev){
	if(isprev){
		temporaryfzhs=[]
	}else{
		temporaryfzhsprev=[]
	}
	if(ths.parents('.accounting').attr('fudata')!=undefined){
		if(isprev){
			temporaryfzhs=JSON.parse(ths.parents('.accounting').attr('fudata'))
		}else{
			temporaryfzhsprev=JSON.parse(ths.parents('.accounting').attr('fudata'))
		}
	}else{
		for(var i = 0; i < ths.parents(".voucher-center").find(".voucher-yc").length; i++) {
			if(ths.parents(".voucher-center").find(".voucher-yc").eq(i).hasClass("deleteclass") != true) {
				var paryc = ths.parents(".voucher-center").find(".voucher-yc").eq(i)
				for(var j = 0; j < paryc.find(".voucher-yc-bo").length; j++) {
					paryc.find(".voucher-yc-bo").eq(j).index = j
					var bodyss = new Object();
					var $ycBt = paryc
					var headLen = $ycBt.find(".ychead").length - 1;
					for(var k = 0; k < headLen; k++) {
						var dd = $ycBt.find(".ychead").eq(k).attr("name");
						if(dd == 'diffTermCode') {
							var itemCodeName = $ycBt.find(".voucher-yc-bo").eq(j).find(".ycbody").eq(k).find(".ycbodyinp").val();
							var itemCode = itemCodeName.substring(0, itemCodeName.indexOf(" "));
							bodyss['accoSurplus'] = itemCode;
						} else if(dd == 'diffTermDir') {
							var itemCodeName = $ycBt.find(".voucher-yc-bo").eq(j).find(".ycbody").eq(k).find(".ycbodyinp").val();
							if(itemCodeName == '正向') {
								bodyss['dfDc'] = 1;
							} else {
								bodyss['dfDc'] = -1;
							}
						} else if(dd == 'expireDate') {
							var itemCodeName = $ycBt.find(".voucher-yc-bo").eq(j).find(".ycbody").eq(k).find(".ycbodyinp").val();
							bodyss[dd] = itemCodeName;
						} else if(dd == 'billNo') {
							var itemCodeName = $ycBt.find(".voucher-yc-bo").eq(j).find(".ycbody").eq(k).find(".ycbodyinp").val();
							bodyss[dd] = itemCodeName;
						} else if(dd == 'billDate' || dd == 'remark') {
							var itemCodeName = $ycBt.find(".voucher-yc-bo").eq(j).find(".ycbody").eq(k).find(".ycbodyinp").val();
							bodyss[dd] = itemCodeName;
						} else {
							var itemCodeName = $ycBt.find(".voucher-yc-bo").eq(j).find(".ycbody").eq(k).find(".ycbodyinp").val();
							var itemCode = itemCodeName.substring(0, itemCodeName.indexOf(" "));
							bodyss[dd] = itemCode;
						}
					}
					var noshows = JSON.parse($ycBt.find(".voucher-yc-bt").find('.noshowdata').attr('noshow'))
					for(var n in noshows) {
						bodyss[n] = noshows[n]
					}
					bodyss.stadAmt = $ycBt.find(".voucher-yc-bo").eq(j).find(".yctz").val().split(",").join("");
					if(isprev){
						temporaryfzhs.push(bodyss);
					}else{
						temporaryfzhsprev.push(bodyss);
					}
				}
			}
		}
	}
}
function configupdate(key,value){
	var data = {
    "agencyCode":rpt.nowAgencyCode,
    "acctCode":rpt.nowAcctCode,
    "menuId":"f24c3333-9799-439a-94c9-f0cdf120305d",
    "configKey":key,
    "configValue":value
	}
	ufma.ajaxDef('/pub/user/menu/config/update', "post", data, function(data) {})
}
function leftgetLastDay(year, month) {
	var new_year = year; //取当前的年份          
	var new_month = month++; //取下一个月的第一天，方便计算（最后一天不固定）          
	if(month > 12) {
		new_month -= 12; //月份减          
		new_year++; //年份增          
	}
	var new_date = new Date(new_year, new_month, 1); //取当年当月中的第一天          
	return(new Date(new_date.getTime() - 1000 * 60 * 60 * 24)).getDate(); //获取当月最后一天日期 
}
function nowleftfirpred(){
	var leftsearchdate = new Date(result);
	var Year = leftsearchdate.getFullYear();
	var Month = (leftsearchdate.getMonth() + 1);
	Month = Month < 10 ? ('0' + Month) : Month;
	var Day = leftsearchdate.getDate();
	if(getUrlParam("dataFrom") == "vouBox" && vouboxtrue == true) {
		var param = JSON.parse(window.sessionStorage.getItem("cacheData")) || [];
		if(param!=undefined && param!=null &&  !$.isNull(param.startVouDate)){
			$('#leftstartdate').getObj().setValue(param.startVouDate);
		}else{
			$('#leftstartdate').getObj().setValue(Year + '-' + Month + '-01');
		}
		if(param!=undefined && param!=null && !$.isNull(param.endVouDate)){
			$('#leftenddate').getObj().setValue(param.endVouDate);
		}else{
			$('#leftenddate').getObj().setValue(Year + '-' + Month + '-' + leftgetLastDay(Year, Month));
		}
	}else if(getUrlParam("action")=='query'){
		var param = JSON.parse(window.sessionStorage.getItem("cacheData")) || [];
		if(param!=undefined && param!=null && !$.isNull(param.startVouDate)){
			$('#leftstartdate').getObj().setValue(param.startVouDate);
		}else{
			$('#leftstartdate').getObj().setValue(Year + '-' + Month + '-01');
		}
		if(param!=undefined && param!=null && !$.isNull(param.endVouDate)){
			$('#leftenddate').getObj().setValue(param.endVouDate);
		}else{
			$('#leftenddate').getObj().setValue(Year + '-' + Month + '-' + leftgetLastDay(Year, Month));
		}
	}else{
		$('#leftstartdate').getObj().setValue(Year + '-' + Month + '-01');
		$('#leftenddate').getObj().setValue(Year + '-' + Month + '-' + leftgetLastDay(Year, Month));
	}
}
function leftsearch(){
	var param = {};
	param.agencyCode = rpt.nowAgencyCode;
	param.acctCode =  rpt.nowAcctCode;
	if($(".xuanzhongcy").hasClass("chaiwu")) {
		param.accaCode = 1;
	} else {
		param.accaCode = 2;
	}
	if(vousinglepz == true || vousinglepzzy == true || $(".xuanzhongcy").css('display')=='none') {
		param.accaCode = '*';
	}
	param.startVouDate = $("#leftstartdate").getObj().getValue();
	param.endVouDate = $("#leftenddate").getObj().getValue();
	if($('.voucherleftsearchinp').val()!=''){
		param.remark = $('.voucherleftsearchinp').val()
	}else{
		param.remark = ''
	}
	ufma.ajaxDef('/gl/vou/getVouHeads', "post", param, function(data) {
		leftsss = JSON.parse(JSON.stringify(data)) ;
		for(var i=data.data.length-1;i>=0;i--){
			if(data.data[i].isBigVou == 1){
				leftsss.data.splice(i, 1);
			}
		}
	})
}
function leftsearchbody(){
	var leftss = '';
	for(var i = 0; i < leftsss.data.length; i++) {
		if(vousinglepz || vousinglepzzy) {
			leftss += '<div class="voucherleftbodyk voucherleftbodykdp" isbigvou="'+leftsss.data[i].isBigVou+'" name="' + leftsss.data[i].vouGuid + '" weizhi="' + i + '">'
		} else {
			leftss += '<div class="voucherleftbodyk" isbigvou="'+leftsss.data[i].isBigVou+'" name="' + leftsss.data[i].vouGuid + '" weizhi="' + i + '">'
		}
		if(leftsss.data[i].vouStatusCode == 'O'){
			leftss += '<span class="leftpzzt leftws">'+leftsss.data[i].vouStatusName+'</span>'
		}else if(leftsss.data[i].vouStatusCode == 'A'){
			leftss += '<span class="leftpzzt leftws">'+leftsss.data[i].vouStatusName+'</span>'
		}else if(leftsss.data[i].vouStatusCode == 'C'){
			leftss += '<span class="leftpzzt leftzf">'+leftsss.data[i].vouStatusName+'</span>'
		}else if(leftsss.data[i].vouStatusCode == 'P'){
			leftss += '<span class="leftpzzt leftws">'+leftsss.data[i].vouStatusName+'</span>'
		}
		leftss += '<p><span>凭证号：</span>' + leftsss.data[i].vouTypeName + '-' + leftsss.data[i].vouNo + '</p>'
		leftss += '<p><span>日期：</span><span class="leftdates">' + leftsss.data[i].vouDate + '</span></p>'
		leftss += '<p class="leftzaiyao"><span></span><b></b></p>'
		if(vousinglepz || vousinglepzzy) {
			leftss += '<p class="cwje" jsnum = ' + leftsss.data[i].amtDr + '><span>财务金额:</span>' + formatNum(parseFloat(leftsss.data[i].amtDr).toFixed(2)) + '</p>'
			leftss += '<p class="ysje" jsnum = ' + leftsss.data[i].ysAmtDr + '><span>预算金额:</span>' + formatNum(parseFloat(leftsss.data[i].ysAmtDr).toFixed(2)) + '</p>'
		} else {
			leftss += '<p class="je"  jsnum = ' + leftsss.data[i].amtDr + '><span>金额:</span>' + formatNum(parseFloat(leftsss.data[i].amtDr).toFixed(2)) + '</p>'
		}
		leftss += '<div class="leftcha"><span class="icon-take-back" style="margin-right:8px;font-size:12px"></span>查看</div>'
		leftss += '<div class="leftbtns">'
		leftss += '	<div class="leftfz">复制</div>'
		leftss += '	<div class="leftcr">插入</div>'
		leftss += '	<div class="leftsc" sour=' + leftsss.data[i].vouSource + '>删除</div>'
		leftss += '	</div>'
		leftss += '	</div>'
	}
	$(".voucherleftbody").html(leftss);
	for(var i = 0; i < leftsss.data.length; i++) {
		$(".leftzaiyao").eq(i).find("b").text(leftsss.data[i].vouDesc)
		$(".leftzaiyao").eq(i).find("b").css("font-weight", "normal")
		$(".leftzaiyao").eq(i).find("span").text("摘要：")
		if($('.voucher-head').attr('namess')!=undefined){
			if(leftsss.data[i].vouGuid == $('.voucher-head').attr('namess')){
				prevnextvoucher = i
			}
		}
	}
}
function voucherYcAssCssbgheight(voucherycb){
	var klengths = vousinglepzzy?1076:910
	if(isdobabstractinp && vousinglepzzy == true) {
		klengths = 1600
		if($(window).width()<1700){
			klengths = 1170
		}
	}
	if(klengths/voucherycb.find(".ychead").length >150 && isdobabstractinp == false) {
	} else if(klengths/voucherycb.find(".ychead").length >150 && isdobabstractinp && vousinglepzzy == false) {
	} else if(isdobabstractinp && vousinglepzzy == true) {
		klengths = 1600
		if($(window).width()<1700){
			klengths = 1170
		}
		voucherycb.find(".voucher-yc-bt").css("width", klengths+1 + "px");
		voucherycb.find(".voucher-yc-bo").css("width", klengths+1 + "px");
		voucherycb.find('.voucher-close').show()
		voucherycb.find(".voucher-yc-deletebtns").find('.voucher-close').css("visibility", "hidden");
		if(voucherycb.find(".ychead").length < 8) {
			voucherycb.find(".voucher-yc-bg").css({
				"width": klengths +1 + "px",
				"position": "relative",
				"margin-left": "20"
			});
			voucherycb.find(".ychead").css({
				"width": klengths/voucherycb.find(".ychead").length-1 + "px",
			})
			voucherycb.find(".ycbody").css({
				"width": klengths/voucherycb.find(".ychead").length + "px",
			})
			voucherycb.find('.voucher-yc-bg').find(".ycbodyinp").css({
				"width": klengths/voucherycb.find(".ychead").length-9 + "px",
			})
			voucherycb.find(".yctz").css({
				"width": klengths/voucherycb.find(".ychead").length-9 + "px",
			})
			voucherycb.find(".Assaccbala").css({
				"right": klengths/voucherycb.find(".ychead").length-39 + "px",
			})
		} else {
			var klength = voucherycb.find(".ychead").length*200
			voucherycb.find(".voucher-yc-bt").css("width", klength + "px");
			voucherycb.find(".voucher-yc-bo").css("width", klength + "px");
			voucherycb.find(".voucher-yc-bg").css({
				"width": klength + 21 + "px",
				"position": "absolute",
				"left": "20px"
			});
		}
		voucherycb.find(".voucher-yc-addbtns").css({
			"position": "absolute",
			"left":"0px"
		});
		voucherycb.find(".voucher-yc-deletebtns").css({
			"position": "absolute",
			"right":"0px"
		});
		voucherycb.find('.voucher-yc-scroll').css({ 
			"position":"relative",
			"overflow-x":"scroll"
		})
	} else {
		var klength = voucherycb.find(".ychead").length*150
		voucherycb.find(".voucher-yc-bt").css("width", klength  +1+ "px");
		voucherycb.find(".voucher-yc-bo").css("width", klength  +1+ "px");
		voucherycb.find('.voucher-close').show()
		voucherycb.find(".voucher-yc-deletebtns").find('.voucher-close').css("visibility", "hidden");
		voucherycb.find(".voucher-yc-bg").css({
			"width":  klength  +21+ "px",
			"position": "absolute",
			"left": "20px"
		});
		voucherycb.find('.voucher-yc-scroll').css({ 
			"position":"relative",
			"overflow-x":"scroll"
		})
		voucherycb.find(".ychead").css({
			"width": 150-1 + "px",
		})
		voucherycb.find(".ycbody").css({
			"width": 150 + "px",
		})
		voucherycb.find('.voucher-yc-bg').find(".ycbodyinp").css({
			"width": 150-9 + "px",
		})
		voucherycb.find(".yctz").css({
			"width": 150-9 + "px",
		})
		voucherycb.find(".Assaccbala").css({
			"right": 150-39 + "px",
		})
		voucherycb.find(".voucher-yc-addbtns").css({
			"position": "absolute",
			"left":"0px"
		});
		voucherycb.find(".voucher-yc-deletebtns").css({
			"position": "absolute",
			"right":"0px"
		});
	}
	voucherycb.find('.voucher-yc-scroll').off('scroll').scroll(function(){
		var thss=$(".assCheck")
		if(thss.length>0){
			for(var i=0;i<$('#AssDataAll .ycbodys').length;i++){
				var relation = thss.attr('relation')
				if($('#AssDataAll .ycbodys').eq(i).css("display")!='none'){
					if(vousinglepzzy == true && isdobabstractinp == false  && vousingelzysdob){
						treePosition(thss,$('#AssDataAll').find("." + relation),true)
					}else{
						treePosition(thss,$('#AssDataAll').find("." + relation),false)
					}
				}
			}
		}
		var scrolllef = $(this).scrollLeft()
		voucherycb.find('.voucher-yc-scroll').find('.voucher-yc-deletebtns').css('right','-'+scrolllef+'px')
		voucherycb.find('.voucher-yc-scroll').find('.voucher-yc-addbtns').css('left',scrolllef+'px')
	})
	voucherycb.find('.voucher-yc-scroll').trigger('scroll')
}
function voucherYcAssCss(voucherycb){
	var klengths = vousinglepzzy?1076:910
	if(isdobabstractinp && vousinglepzzy == true) {
		klengths = 1600
		if($(window).width()<1700){
			klengths = 1170
		}
	}
	if(klengths/voucherycb.find(".ychead").length >150 && isdobabstractinp == false) {
		voucherycb.find(".voucher-yc-bt").css({
			"width": klengths +1+ "px",
			"position": "relative"
		});
		voucherycb.find(".voucher-yc-bo").css({
			"width": klengths +1 + "px",
			"position": "relative"
		});
		voucherycb.find(".voucher-yc-bg").css({
			"width": klengths +1+ "px",
			"position": "relative"
		});
		voucherycb.find(".voucher-yc-addbtns").css({
			"position": "relative"
		});
		voucherycb.find(".voucher-yc-deletebtns").css({
			"position": "relative"
		});
		voucherycb.find(".ychead").css({
			"width": klengths/voucherycb.find(".ychead").length-1 + "px",
		})
		voucherycb.find(".ycbody").css({
			"width": klengths/voucherycb.find(".ychead").length + "px",
		})
		voucherycb.find('.voucher-yc-bg').find(".ycbodyinp").css({
			"width": klengths/voucherycb.find(".ychead").length-9 + "px",
		})
		voucherycb.find(".yctz").css({
			"width": klengths/voucherycb.find(".ychead").length-9 + "px",
		})
		voucherycb.find(".Assaccbala").css({
			"right": klengths/voucherycb.find(".ychead").length-39 + "px",
		})
		voucherycb.find(".voucher-yc-deletebtns").find('.voucher-close').show()
	} else if(klengths/voucherycb.find(".ychead").length >150 && isdobabstractinp && vousinglepzzy == false) {
		voucherycb.find(".voucher-yc-bt").css({
			"width": klengths +1 + "px",
			"position": "relative"
		});
		voucherycb.find(".voucher-yc-bo").css({
			"width": klengths +1 + "px",
			"position": "relative"
		});
		voucherycb.find(".voucher-yc-bg").css({
			"width": klengths +1 + "px",
			"position": "relative"
		});
		voucherycb.find(".voucher-yc-addbtns").css({
			"position": "relative"
		});
		voucherycb.find(".voucher-yc-deletebtns").css({
			"position": "relative"
		});
		voucherycb.find(".ychead").css({
			"width": klengths/voucherycb.find(".ychead").length-1 + "px",
		})
		voucherycb.find(".ycbody").css({
			"width": klengths/voucherycb.find(".ychead").length + "px",
		})
		voucherycb.find('.voucher-yc-bg').find(".ycbodyinp").css({
			"width": klengths/voucherycb.find(".ychead").length-9 + "px",
		})
		voucherycb.find(".yctz").css({
			"width": klengths/voucherycb.find(".ychead").length-9 + "px",
		})
		voucherycb.find(".Assaccbala").css({
			"right": klengths/voucherycb.find(".ychead").length-39 + "px",
		})
		voucherycb.find(".voucher-yc-deletebtns").find('.voucher-close').show()
	} else if(isdobabstractinp && vousinglepzzy == true) {
		klengths = 1600
		if($(window).width()<1700){
			klengths = 1170
		}
		voucherycb.find(".voucher-yc-bt").css("width", klengths+1 + "px");
		voucherycb.find(".voucher-yc-bo").css("width", klengths+1 + "px");
		voucherycb.find('.voucher-close').show()
		voucherycb.find(".voucher-yc-deletebtns").find('.voucher-close').css("visibility", "hidden");
		if(voucherycb.find(".ychead").length < 8) {
			voucherycb.find(".voucher-yc-bg").css({
				"width": klengths +1 + "px",
				"position": "relative",
				"margin-left": "20"
			});
			voucherycb.find(".ychead").css({
				"width": klengths/voucherycb.find(".ychead").length-1 + "px",
			})
			voucherycb.find(".ycbody").css({
				"width": klengths/voucherycb.find(".ychead").length + "px",
			})
			voucherycb.find('.voucher-yc-bg').find(".ycbodyinp").css({
				"width": klengths/voucherycb.find(".ychead").length-9 + "px",
			})
			voucherycb.find(".yctz").css({
				"width": klengths/voucherycb.find(".ychead").length-9 + "px",
			})
			voucherycb.find(".Assaccbala").css({
				"right": klengths/voucherycb.find(".ychead").length-39 + "px",
			})
		} else {
			var klength = voucherycb.find(".ychead").length*200
			voucherycb.find(".voucher-yc-bt").css("width", klength + "px");
			voucherycb.find(".voucher-yc-bo").css("width", klength + "px");
			voucherycb.find(".voucher-yc-bg").css({
				"width": "1600px",
				"position": "relative",
				"margin-left": "20",
				"left": ""
			});
			if($(window).width()<1700){
				voucherycb.find(".voucher-yc-bg").css({
					"width": "1170px",
					"position": "relative",
					"margin-left": "20",
					"left": ""
				});
			}
		}
		voucherycb.find(".voucher-yc-addbtns").css({
			"position": "relative",
			"left":''
		});
		voucherycb.find(".voucher-yc-deletebtns").css({
			"position": "relative",
			"right":''
		});
		voucherycb.find('.voucher-yc-scroll').css({ 
			"position":"",
			"overflow-x":""
		})
	} else {
		var klength = voucherycb.find(".ychead").length*150
		voucherycb.find(".voucher-yc-bt").css("width", klength  +1+ "px");
		voucherycb.find(".voucher-yc-bo").css("width", klength  +1+ "px");
		voucherycb.find('.voucher-close').show()
		voucherycb.find(".voucher-yc-deletebtns").find('.voucher-close').css("visibility", "hidden");
		voucherycb.find(".voucher-yc-bg").css({
			"width":  klengths  +1+ "px",
			"position": "relative",
			"left": ""
		});
		voucherycb.find('.voucher-yc-scroll').css({ 
			"position":"",
			"overflow-x":""
		})
		voucherycb.find(".ychead").css({
			"width": 150-1 + "px",
		})
		voucherycb.find(".ycbody").css({
			"width": 150 + "px",
		})
		voucherycb.find('.voucher-yc-bg').find(".ycbodyinp").css({
			"width": 150-9 + "px",
		})
		voucherycb.find(".yctz").css({
			"width": 150-9 + "px",
		})
		voucherycb.find(".Assaccbala").css({
			"right": 150-39 + "px",
		})
		voucherycb.find(".voucher-yc-addbtns").css({
			"position": "relative",
			"left":''
		});
		voucherycb.find(".voucher-yc-deletebtns").css({
			"position": "relative",
			"right":''
		});
	}
	voucherycb.find('.voucher-yc-scroll').off('scroll').scroll(function(){
		var thss=$(".assCheck")
		if(thss.length>0){
			for(var i=0;i<$('#AssDataAll .ycbodys').length;i++){
				var relation = thss.attr('relation')
				if($('#AssDataAll .ycbodys').eq(i).css("display")!='none'){
					if(vousinglepzzy == true && isdobabstractinp == false  && vousingelzysdob){
						treePosition(thss,$('#AssDataAll').find("." + relation),true)
					}else{
						treePosition(thss,$('#AssDataAll').find("." + relation),false)
					}
				}
			}
		}
	})
}
//判断是否搜索成功
var isSearchSuccess = false
var isSearchSuccessTwo = false
function searchvouLocation(name,type,searchindex){
	var kinde = 1;
	var click = false
	if(!isSearchSuccessTwo){
		isSearchSuccessTwo = true
	}else{
		return false
	}
	if(vousinglepzzy == false){
		for(var i=0;i<$('.voucher-center').length;i++){
			if(type == ''){
				if($('.voucher-center').eq(i).find('.abstractinp').val().indexOf(name)>=0 && kinde == searchindex){
					locationsdetail($('.voucher-center').eq(i))
					if($('.voucher-center').eq(i).find('.abstractinp').attr("readonly")==undefined){
						$('.voucher-center').eq(i).find('.abstractinp').focus()
					}
					break;
				}else if($('.voucher-center').eq(i).find('.abstractinp').val().indexOf(name)>=0){
					kinde++
				}
				if($('.voucher-center').eq(i).find('.accountinginp').val().indexOf(name)>=0 && kinde == searchindex){
					locationsdetail($('.voucher-center').eq(i))
					if($('.voucher-center').eq(i).find('.accountinginp').attr("readonly")==undefined){
						$('.voucher-center').eq(i).find('.accountinginp').focus()
					}
					break;
				}else if($('.voucher-center').eq(i).find('.abstractinp').val().indexOf(name)>=0){
					kinde++
				}
				if($('.voucher-center').eq(i).find('.fuyan').css('display')!="none"){
					var data = undefined;
					if($(".voucher-center").eq(i).find(".accounting").attr('fudata')!=undefined){
						data = JSON.parse($(".voucher-center").eq(i).find(".accounting").attr('fudata'))
					}
					if(data!=undefined && $('.voucher-center').eq(i).find('.voucher-yc').length==0){
						for(var z=0;z<data.length;z++){
							for(var k in data[z]){
								if(tablehead[k]!=undefined && data[z][k].indexOf(name)>=0 && kinde == searchindex){
									locationsdetailass($('.voucher-center').eq(i),z,k)
									kinde++
									break;
								}else if(tablehead[k]!=undefined && data[z][k].indexOf(name)>=0){
									kinde++
								}
							}
						}
					}else if(data==undefined && $('.voucher-center').eq(i).find('.voucher-yc').length>0){
						var datas = $('.voucher-center').eq(i).find('.voucher-yc').find('.voucher-yc-bo')
						for(var z=0;z<datas.length;z++){
							var datasass = datas.eq(z).find('.ycbodyinp')
							for(var k =0;k<datasass.length;k++){
								if(tablehead[datasass.eq(k).attr('relation')]!=undefined && datasass.eq(k).val().indexOf(name)>=0 && kinde == searchindex){
									locationsdetailass($('.voucher-center').eq(i),z)
									if(datasass.eq(k).attr("readonly")==undefined){
										datasass.eq(k).focus()
									}
									kinde++
									break;
								}else if(tablehead[datasass.eq(k).attr('relation')]!=undefined && datasass.eq(k).val().indexOf(name)>=0){
									kinde++
								}
							}
						}
					}
				}
			}else{
				if(type == 'despct'){
					if($('.voucher-center').eq(i).find('.abstractinp').val().indexOf(name)>=0 && kinde == searchindex){
						locationsdetail($('.voucher-center').eq(i))
						if($('.voucher-center').eq(i).find('.abstractinp').attr("readonly")==undefined){
							$('.voucher-center').eq(i).find('.abstractinp').focus()
						}
						return false;
					}else if($('.voucher-center').eq(i).find('.abstractinp').val().indexOf(name)>=0){
						kinde++
					}
				}else if(type=='acco'){
					if($('.voucher-center').eq(i).find('.accountinginp').val().indexOf(name)>=0 && kinde == searchindex){
						locationsdetail($('.voucher-center').eq(i))
						if($('.voucher-center').eq(i).find('.accountinginp').attr("readonly")==undefined){
							$('.voucher-center').eq(i).find('.accountinginp').focus()
						}
						return false;
					}else if($('.voucher-center').eq(i).find('.accountinginp').val().indexOf(name)>=0){
						kinde++
					}
				}else{
					if($('.voucher-center').eq(i).find('.fuyan').css('display')!="none"){
						var data = undefined;
						if($(".voucher-center").eq(i).find(".accounting").attr('fudata')!=undefined){
							data = JSON.parse($(".voucher-center").eq(i).find(".accounting").attr('fudata'))
						}
						if(data!=undefined && $('.voucher-center').eq(i).find('.voucher-yc').length==0){
							for(var z=0;z<data.length;z++){
								for(var k in data[z]){
									if(k == type && data[z][k].indexOf(name)>=0 && kinde == searchindex){
										locationsdetailass($('.voucher-center').eq(i),z,type)
										kinde++
										break;
									}else if(k == type && data[z][k].indexOf(name)>=0){
										kinde++
									}
								}
							}
						}else if(data==undefined && $('.voucher-center').eq(i).find('.voucher-yc').length>0){
							var datas = $('.voucher-center').eq(i).find('.voucher-yc').find('.voucher-yc-bo')
							for(var z=0;z<datas.length;z++){
								var datasass = datas.eq(z).find('.ycbodyinp')
								for(var k =0;k<datasass.length;k++){
									if(datasass.eq(k).attr('relation') == type && datasass.eq(k).val().indexOf(name)>=0 && kinde == searchindex){
										locationsdetailass($('.voucher-center').eq(i),z)
										if(datasass.eq(k).attr("readonly")==undefined){
											datasass.eq(k).focus()
										}
										kinde++
										break;
									}else if(datasass.eq(k).attr('relation') == type && datasass.eq(k).val().indexOf(name)>=0){
										kinde++
									}
								}
							}
						}
					}
				}
			}
		}
	}else if(vousinglepz == false && vousinglepzzy == true){
		var isyssearch= 1
		for(var i=0;i<$('.voucher-centercw').length;i++){
			if(type == ''){
				if($('.voucher-centercw').eq(i).find('.abstractinp').val().indexOf(name)>=0 && kinde == searchindex){
					locationsdetail($('.voucher-centercw').eq(i))
					isyssearch = 0
					if($('.voucher-centercw').eq(i).find('.abstractinp').attr("readonly")==undefined){
						$('.voucher-centercw').eq(i).find('.abstractinp').focus()
					}
					break;
				}else if($('.voucher-centercw').eq(i).find('.abstractinp').val().indexOf(name)>=0){
					kinde++
				}
				if($('.voucher-centercw').eq(i).find('.accountinginp').val().indexOf(name)>=0 && kinde == searchindex){
					locationsdetail($('.voucher-centercw').eq(i))
					isyssearch = 0
					if($('.voucher-centercw').eq(i).find('.accountinginp').attr("readonly")==undefined){
						$('.voucher-centercw').eq(i).find('.accountinginp').focus()
					}
					break;
				}else if($('.voucher-centercw').eq(i).find('.accountinginp').val().indexOf(name)>=0){
					kinde++
				}
				if($('.voucher-centercw').eq(i).find('.fuyan').css('display')!="none"){
					var data = undefined;
					if($(".voucher-centercw").eq(i).find(".accounting").attr('fudata')!=undefined){
						data = JSON.parse($(".voucher-centercw").eq(i).find(".accounting").attr('fudata'))
					}
					if(data!=undefined && $('.voucher-centercw').eq(i).find('.voucher-yc').length==0){
						for(var z=0;z<data.length;z++){
							for(var k in data[z]){
								if(tablehead[k]!=undefined && data[z][k].indexOf(name)>=0 && kinde == searchindex){
									locationsdetailass($('.voucher-centercw').eq(i),z,k)
									isyssearch = 0
									kinde++
									break;
								}else if(tablehead[k]!=undefined && data[z][k].indexOf(name)>=0){
									kinde++
								}
							}
						}
					}else if(data==undefined && $('.voucher-centercw').eq(i).find('.voucher-yc').length>0){
						var datas = $('.voucher-centercw').eq(i).find('.voucher-yc').find('.voucher-yc-bo')
						for(var z=0;z<datas.length;z++){
							var datasass = datas.eq(z).find('.ycbodyinp')
							for(var k =0;k<datasass.length;k++){
								if(tablehead[datasass.eq(k).attr('relation')]!=undefined && datasass.eq(k).val().indexOf(name)>=0 && kinde == searchindex){
									locationsdetailass($('.voucher-centercw').eq(i),z)
									isyssearch = 0
									if(datasass.eq(k).attr("readonly")==undefined){
										datasass.eq(k).focus()
									}
									kinde++
									break;
								}else if(tablehead[datasass.eq(k).attr('relation')]!=undefined && datasass.eq(k).val().indexOf(name)>=0){
									kinde++
								}
							}
						}
					}
				}
			}else{
				if(type == 'despct'){
					if($('.voucher-centercw').eq(i).find('.abstractinp').val().indexOf(name)>=0 && kinde == searchindex){
						locationsdetail($('.voucher-centercw').eq(i))
						$('.voucher- ').eq(i).find('.abstractinp').focus()
						isyssearch = 0
						if($('.voucher-centercw').eq(i).find('.abstractinp').attr("readonly")==undefined){
							$('.voucher-centercw').eq(i).find('.abstractinp').focus()
						}
						break;
					}else if($('.voucher-centercw').eq(i).find('.abstractinp').val().indexOf(name)>=0){
						kinde++
					}
				}else if(type=='acco'){
					if($('.voucher-centercw').eq(i).find('.accountinginp').val().indexOf(name)>=0 && kinde == searchindex){
						locationsdetail($('.voucher-centercw').eq(i))
						isyssearch = 0
						if($('.voucher-centercw').eq(i).find('.accountinginp').attr("readonly")==undefined){
							$('.voucher-centercw').eq(i).find('.accountinginp').focus()
						}
						break;
					}else if($('.voucher-centercw').eq(i).find('.accountinginp').val().indexOf(name)>=0){
						kinde++
					}
				}else{
					if($('.voucher-centercw').eq(i).find('.fuyan').css('display')!="none"){
						var data = undefined;
						if($(".voucher-centercw").eq(i).find(".accounting").attr('fudata')!=undefined){
							data = JSON.parse($(".voucher-centercw").eq(i).find(".accounting").attr('fudata'))
						}
						if(data!=undefined && $('.voucher-centercw').eq(i).find('.voucher-yc').length==0){
							for(var z=0;z<data.length;z++){
								for(var k in data[z]){
									if(k == type && data[z][k].indexOf(name)>=0 && kinde == searchindex){
										locationsdetailass($('.voucher-centercw').eq(i),z,type)
										isyssearch = 0
										kinde++
										break;
									}else if(k == type && data[z][k].indexOf(name)>=0){
										kinde++
									}
								}
							}
						}else if(data==undefined && $('.voucher-centercw').eq(i).find('.voucher-yc').length>0){
							var datas = $('.voucher-centercw').eq(i).find('.voucher-yc').find('.voucher-yc-bo')
							for(var z=0;z<datas.length;z++){
								var datasass = datas.eq(z).find('.ycbodyinp')
								for(var k =0;k<datasass.length;k++){
									if(datasass.eq(k).attr('relation') == type && datasass.eq(k).val().indexOf(name)>=0 && kinde == searchindex){
										locationsdetailass($('.voucher-centercw').eq(i),z)
										isyssearch = 0
										if(datasass.eq(k).attr("readonly")==undefined){
											datasass.eq(k).focus()
										}
										kinde++
										break;
									}else if(datasass.eq(k).attr('relation') == type && datasass.eq(k).val().indexOf(name)>=0){
										kinde++
									}
								}
							}
						}
					}
				}
			}
		}
		if(isyssearch ==1){
			for(var i=0;i<$('.voucher-centerys').length;i++){
				if(type == ''){
					if($('.voucher-centerys').eq(i).find('.abstractinp').val().indexOf(name)>=0 && kinde == searchindex){
						locationsdetail($('.voucher-centerys').eq(i),'abstractinp')
						if($('.voucher-centerys').eq(i).find('.abstractinp').attr("readonly")==undefined){
							$('.voucher-centerys').eq(i).find('.abstractinp').focus()
						}
						break;
					}else if($('.voucher-centerys').eq(i).find('.abstractinp').val().indexOf(name)>=0){
						kinde++
					}
					if($('.voucher-centerys').eq(i).find('.accountinginp').val().indexOf(name)>=0 && kinde == searchindex){
						locationsdetail($('.voucher-centerys').eq(i),'accountinginp')
						if($('.voucher-centerys').eq(i).find('.accountinginp').attr("readonly")==undefined){
							$('.voucher-centerys').eq(i).find('.accountinginp').focus()
						}
						break;
					}else if($('.voucher-centerys').eq(i).find('.accountinginp').val().indexOf(name)>=0){
						kinde++
					}
					if($('.voucher-centerys').eq(i).find('.fuyan').css('display')!="none"){
						var data = undefined;
						if($(".voucher-centerys").eq(i).find(".accounting").attr('fudata')!=undefined){
							data = JSON.parse($(".voucher-centerys").eq(i).find(".accounting").attr('fudata'))
						}
						if(data!=undefined && $('.voucher-centerys').eq(i).find('.voucher-yc').length==0){
							for(var z=0;z<data.length;z++){
								for(var k in data[z]){
									if(tablehead[k]!=undefined && data[z][k].indexOf(name)>=0 && kinde == searchindex){
										locationsdetailass($('.voucher-centerys').eq(i),z,k)
										kinde++
										break;
									}else if(tablehead[k]!=undefined && data[z][k].indexOf(name)>=0){
										kinde++
									}
								}
							}
						}else if(data==undefined && $('.voucher-centerys').eq(i).find('.voucher-yc').length>0){
							var datas = $('.voucher-centerys').eq(i).find('.voucher-yc').find('.voucher-yc-bo')
							for(var z=0;z<datas.length;z++){
								var datasass = datas.eq(z).find('.ycbodyinp')
								for(var k =0;k<datasass.length;k++){
									if(tablehead[datasass.eq(k).attr('relation')]!=undefined && datasass.eq(k).val().indexOf(name)>=0 && kinde == searchindex){
										locationsdetailass($('.voucher-centerys').eq(i),z)
										if(datasass.eq(k).attr("readonly")==undefined){
											datasass.eq(k).focus()
										}
										kinde++
										break;
									}else if(tablehead[datasass.eq(k).attr('relation')]!=undefined && datasass.eq(k).val().indexOf(name)>=0){
										kinde++
									}
								}
							}
						}
					}
				}else{
					if(type == 'despct'){
						if($('.voucher-centerys').eq(i).find('.abstractinp').val().indexOf(name)>=0 && kinde == searchindex){
							locationsdetail($('.voucher-centerys').eq(i),'abstractinp')
							if($('.voucher-centerys').eq(i).find('.abstractinp').attr("readonly")==undefined){
								$('.voucher-centerys').eq(i).find('.abstractinp').focus()
							}
							break;
						}else if($('.voucher-centercw').eq(i).find('.abstractinp').val().indexOf(name)>=0){
							kinde++
						}
					}else if(type=='acco'){
						if($('.voucher-centerys').eq(i).find('.accountinginp').val().indexOf(name)>=0 && kinde == searchindex){
							locationsdetail($('.voucher-centerys').eq(i),'accountinginp')
							if($('.voucher-centerys').eq(i).find('.accountinginp').attr("readonly")==undefined){
								$('.voucher-centerys').eq(i).find('.accountinginp').focus()
							}
							break;
						}else if($('.voucher-centerys').eq(i).find('.accountinginp').val().indexOf(name)>=0){
							kinde++
						}
					}else{
						if($('.voucher-centerys').eq(i).find('.fuyan').css('display')!="none"){
							var data = undefined;
							if($(".voucher-centerys").eq(i).find(".accounting").attr('fudata')!=undefined){
								data = JSON.parse($(".voucher-centerys").eq(i).find(".accounting").attr('fudata'))
							}
							if(data!=undefined && $('.voucher-centerys').eq(i).find('.voucher-yc').length==0){
								for(var z=0;z<data.length;z++){
									for(var k in data[z]){
										if(k == type && data[z][k].indexOf(name)>=0 && kinde == searchindex){
											locationsdetailass($('.voucher-centerys').eq(i),z,type)
											kinde++
											break;
										}else if(k == type && data[z][k].indexOf(name)>=0){
											kinde++
										}
									}
								}
							}else if(data==undefined && $('.voucher-centerys').eq(i).find('.voucher-yc').length>0){
								var datas = $('.voucher-centerys').eq(i).find('.voucher-yc').find('.voucher-yc-bo')
								for(var z=0;z<datas.length;z++){
									var datasass = datas.eq(z).find('.ycbodyinp')
									for(var k =0;k<datasass.length;k++){
										if(datasass.eq(k).attr('relation') == type && datasass.eq(k).val().indexOf(name)>=0 && kinde == searchindex){
											locationsdetailass($('.voucher-centerys').eq(i),z)
											if(datasass.eq(k).attr("readonly")==undefined){
												datasass.eq(k).focus()
											}
											kinde++
											break;
										}else if(datasass.eq(k).attr('relation')==type && datasass.eq(k).val().indexOf(name)>=0){
											kinde++
										}
									}
								}
							}
						}
					}
				}
			}
		}
	}
	if(isSearchSuccess){
		isSearchSuccess = false
	}else{
		isSearchSuccessTwo = false
		if($('.voucher-center-active').length>0 && kinde>1){
			ufma.showTip("已经是搜索到的最后一条")
		}else if($('.voucher-center-active').length>0){
			$('.voucher-center-active').removeClass('voucher-center-active')
		}
		searchvouPageUporDown--;
	}
}
//定位到分录行
function locationsdetail(ths){
	isSearchSuccessTwo = false
	isSearchSuccess = true
	var key1= $('.voucher-center').eq(0).offset().top
	$('.voucher-center-active').removeClass('voucher-center-active')
	ths.addClass("voucher-center-active")
	if(ths.parents(".voubodyscroll").length>0){
		var toplen = ths.offset().top -key1
		$("voubodyscroll").scrollTop(toplen);
	}else{
		var toplen = ths.offset().top -key1
		$("html").scrollTop(toplen);
	}
}
//定位到辅助分录行
function locationsdetailass(ths,ass,nowals){
	isSearchSuccessTwo = false
	isSearchSuccess = true
	var key1= $('.voucher-center').eq(0).offset().top
	if(ths.parents(".voubodyscroll").length>0){
		if(ths.find('.fuyan').css('display')!="none"){
			ths.find('.fuyan').click()
		}
		var toplen = ths.offset().top -key1
		$("voubodyscroll").scrollTop(toplen);
		var keys = $(".voucher-yc").find('.voucher-yc-bo').eq(0).offset().top
		var assh =ths.find('.voucher-yc').find('.voucher-yc-bo').eq(ass)
		$('.voucher-center-active').removeClass('voucher-center-active')
		assh.addClass('voucher-center-active')
		var toplenass = assh.offset().top -keys
		$("voucher-yc").scrollTop(toplenass);
		if(nowals !=undefined){
			var searchdatasss = assh.find('.ycbodyinp[relation='+nowals+']')
			if(searchdatasss.attr("readonly")==undefined){
				searchdatasss.focus()
			}
		}
	}else{
		if(ths.find('.fuyan').css('display')!="none"){
			ths.find('.fuyan').click()
		}
		var assh =ths.find('.voucher-yc').find('.voucher-yc-bo').eq(ass)
		$('.voucher-center-active').removeClass('voucher-center-active')
		assh.addClass('voucher-center-active')
		var toplenass = assh.offset().top -key1
		$("html").scrollTop(toplenass);
		if(nowals !=undefined){
			var searchdatasss = assh.find('.ycbodyinp[relation='+nowals+']')
			if(searchdatasss.attr("readonly")==undefined){
				searchdatasss.focus()
			}
		}
		
	}
}
//财务带出预算关联或者预算带出财务关联
function autoRelationacco(thisd){
	for(var i = 0; i < $('.voucher-center').length; i++) {
		$('.voucher-center').eq(i).attr('indexs', $('.voucher-center').eq(i).index())
	}
	var dataup = huoqu('isf')
	for(var i = 0; i < $(thisd).length; i++) {
		if(thisd=='.voucher-centerys'){
			$(thisd).eq(i).attr('indexsys', i)
			$('.voucher-centercw').eq(i).attr('indexscw', i)
		}else{
			$(thisd).eq(i).attr('indexscw', i)
			$('.voucher-centerys').eq(i).attr('indexsys', i)
		}
	}
	$.each($(thisd),function(i,item){
		var Relationvou =  ''
		if(thisd=='.voucher-centerys'){
			Relationvou=$(thisd).eq(i).prev('.voucher-center')
		}else{
			Relationvou=$(thisd).eq(i).next('.voucher-center')
		}
		var thisvou =  $(thisd).eq(i)
		if(thisvou.find('.accountinginp').val()!='' && Relationvou.find('.accountinginp').val()==''){
			var thisindex = thisvou.attr('indexs')
			var datacwup = []
			for(var z = 0; z < dataup.vouDetails.length; z++) {
				if(dataup.vouDetails[z].vouSeq == thisindex) {
					datacwup.push(dataup.vouDetails[z])
				}
			}
			if(datacwup.length > 0) {
				ufma.ajax('/gl/vou/selectEleAccoLink/' + rpt.nowAgencyCode + '/' + rpt.nowAcctCode, 'post', datacwup, function(data) {
					if(data.data.length > 0) {
						voucopydata = data.data[0]
						chapzone(Relationvou)
					}
				})
			}
		}
	})
}
//获取页面上往来号金额
function getfield1Amt(){
	var field1Obj = {}
	for(var i = 0; i < $('.voucher-center').length; i++) {
		var that = $('.voucher-center').eq(i)
		if(that.find('.fuyan').css("display")!='none'){
			if(that.find('.accounting').attr('fudata')!=undefined){
				var assdata = JSON.parse(that.find('.accounting').attr('fudata'))
				for(var j=0;j<assdata.length;j++){
					var amt = parseFloat(field1Obj[assdata[j].field1].stadAmt)
					if(!isNaN(amt) && amt!=''){
						if(!$.isNull(assdata[j].field1)&& field1Obj[assdata[j].field1]!=undefined){
							field1Obj[assdata[j].field1]+=parseFloat(field1Obj[assdata[j].field1].stadAmt)
						}else if(!$.isNull(assdata[j].field1) && field1Obj[assdata[j].field1]==undefined){
							field1Obj[assdata[j].field1]=parseFloat(field1Obj[assdata[j].field1].stadAmt)
						}
					}
				}
			}else{
				var ycbo= that.find('.voucher-yc').find('.voucher-yc-bo')
				for(var j=0;j<ycbo.length;j++){
					var field1length = ycbo.eq(j).find('.field1').length
					var amt = parseFloat(ycbo.eq(j).find(".yctz").val().split(",").join(""))
					if(field1length>0 && ycbo.eq(j).find('.field1').val()!='' && amt!='' && !isNaN(amt)){
						var field1val = ycbo.eq(j).find('.field1').val()
						if(field1Obj[field1val]!=undefined){
							field1Obj[field1val]+= amt
						}else{
							field1Obj[field1val]= amt
						}
					}
				}
			}
		}
	}
	return field1Obj
}