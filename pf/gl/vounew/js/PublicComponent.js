//作为弹出框关闭时候的回调
window._close = function(reData) {
	if(window.closeOwner) {
		var data = {
			action: reData
		};
		window.closeOwner(data);
	}
}
//关闭浏览器时候提示是否离开
window.onbeforeunload=function(e){     
　　var e = window.event||e;  
　　e.returnValue=("确定离开当前页面吗？");
}
//浏览器大小改变的时候出发自适应
$(window).resize(function(){
	newvueTypesetting()
});
//添加常规函数备用
var page = function() {
	return {}
}()
//记录上次的登录人使用凭证类型
var nowvoutype = '1'
//是否暂存标识
var isHistoryfzhs = true
//最大凭证号变量
var vouCurrMaxVouNo = '0001'
//制单人和标错人是否可为同一人
var isauditbiaocuo = true
//保存是否启用暂存校验，保存金额为0的辅助项
var voucherupnow = false
//获取域名
var printServiceUrl = 'https:' == document.location.protocol ? "https://" + window.location.host : "http://" + window.location.host;
//获取是否是插入的凭证
var optNoType = 0
//判断是否启用全称展示
var isaccfullname = true
//会计科目全局对象
var quanjuvoudatas = {
	data: []
}
//是否连续新增凭证
var vouisaddDate = true
//是否使用新增辅助项功能
var isaddAssbtn = true
//启用防止弹窗后触发聚焦事件
var isfocusmodal = true
//自动带入上一行辅助核算
var vouiscopyprevAss =  true
//凭证号是否包含期间
var isfispredvouno = false
//是否启用常用摘要
var isabstract = true
//是否显示往来日期
var isbussDate = true
//复制行操作凭证
var voucopydata = {}
//判定凭证来源是否手工录入
var isvousource = false
//凭证作为会计科目预览打开时候可修改子系统凭证
var ifForIndex = true
//默认展开会计科目
var isdefaultopen = true
//判定如果凭证来自于其他模块生成是否可以修改
var isvousourceclick = true
//判断是否启用双摘要且在下模式
var isdobabstractinp = true
var vouisvague = false
//判断初始化是否大屏
var windowWidth = $(window).width();
if(windowWidth > 1600) {
	isdobabstractinp = true
} else {
	isdobabstractinp = false
}
//单凭证左右结构双摘要启用字段
var vousingelzysdob = false
//点击金额栏切换借贷金额
var isnoclickmoney = false
//是否可以删除凭证
var isVouDel = true
//对ie11进行兼容
var ie11compatible = false
var ie11compatibleass = false
var vouchecker = ''
//打开模板传参字段
var searchmobandata = ''
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
//单凭证上下模式
var vousinglepz = false
//单凭证左右模式
var vousinglepzzy = false
//判断单凭证上下新增时候凭证分录是财务还是预算
var trisdata = 1
//在代码执行完之前不执行change事件的标识
var vouisendsel = false
//记录修改前的辅助核算
var temporaryfzhs = []
//记录上一行的辅助核算
var temporaryfzhsprev = []
//财政社保启用联查凭证
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
//票据类型下拉数据
var billfzhsxl = [];
//外币辅助项
var curCodefzhsxl = []
//默认外币汇率
var curexratefzhsxl = {}
//差异项
var diffentfzhsxl = [];
//科目辅助项顺序
var accitemOrderSeq = new Object(); 
//获取摘要下拉框的数据
var zaiyao = {
	data: []
}
var data = {}
var danweinamec = []; //凭证类型
var danweinamey = []; //凭证类型
function indexorvou(){
	for(var i=0;i<$(".voucher-body").length;i++){
		$(".voucher-body").eq(i).find('.voucherindex').html(i+1)
	}
	
}
//自适应页面大小并调整右侧内容是否默认显示
function newvueTypesetting(){
	var bodyw= $('body').width()
	var bodyheight = ($('body').height()-125)/2
	if(bodyheight-50<164){
		$('.voudetail').height(bodyheight*2-164)
		$('.voubodyscroll').css("max-height",$('.voudetail').height()-110+"px")
		$('.voudetailAss').height(164)
	}else if(bodyheight>370){
		var bodylength = $(".voudetail").find('.voubodyscroll').find('.voucher-body').length-6
		var zz=bodylength*50
		if(zz>250){
			zz=250
		}
		$('.voudetail').height(420+zz)
		$('.voubodyscroll').css("max-height",310+zz+"px")
		$('.voudetailAss').height($('body').height()-$('.voudetail').height()-75)
	}else{
		$('.voudetail').height(bodyheight+50)
		$('.voubodyscroll').css("max-height",bodyheight-60+"px")
		$('.voudetailAss').height(bodyheight-50)
	}
	$(".vou-right-searchtbody").height($('body').height()-140)
	if(bodyw>1570){
		$('.voucherall').width(bodyw-440)
		$('.vourightall').width(430)
	}else{
		$('.voucherall').width(bodyw-44)
		$('.vourightall').width(36)
		$('.vou-rightbody').hide()
	}
	$('.voucher-head').width($('.voubodyscroll').width())
	$('.voucher-center').width($('.voubodyscroll').width())
	$('.voucher-footer').width($('.voubodyscroll').width())
	$('.voucher-bgallscroll').css("height",$('.voudetailAss').height()-34+"px")
	$('.voucher-bgall').width($('.voucher-bgallscroll').width())
	voucherYcAssCss($('.voudetailAss').find('.voucher-yc').eq(0))
	indexorvou()
}
newvueTypesetting()

//权限用ajax
var  hex_md5svUserCode = ''
if (typeof hex_md5 === "function" && ufma.getCommonData().svUserCode != null) {
	hex_md5svUserCode = hex_md5(ufma.getCommonData().svUserCode)
}
//返回票据号编辑框
function resBillBoxHtml() {
	var billHtml = '';
	return billHtml;
}
//判断空字符串
function isNull(target) {
	if(typeof(target) == 'undefined' || null == target || '' === target || 'null' == target || 'undefined' === target) {
		return true;
	} else {
		return false;
	}
}
//获取url上的参数
function getUrlParam(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象 
	var r = window.location.search.substr(1).match(reg); //匹配目标参数 
	if(r != null)
		return unescape(r[2]);
	return null; //返回参数值 
}
//切换双凭证默认展示使用
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
//获取权限并判断是否可以编辑
var isbtnpermission = ufma.getPermission();
var isaccopen = true
for(var z = 0; z < isbtnpermission.length; z++) {
	if(isbtnpermission[z].id == 'btn-xzkjkm' && isbtnpermission[z].flag == '0') {
		isaccopen = false
	}
}
//判断凭证来源是否为SSSFM
function checkVouSource(voubtn) {
	if(selectdata != undefined) {
		if(!$.isNull(selectdata.data)) {
			if(selectdata.data.vouSource == "SSSFM") {
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
	var callback = function(result) {
		var voudata = []
		for(var i = 0; i < result.data.data.length; i++) {
			voudata.push({
				'gl_voucher_ds1': result.data.data[i]
			})
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
					$(".voucherhe").find("#sppz").val(voufispred + '-' + vouCurrMaxVouNo).removeAttr('vouno');
				} else {
					$(".voucherhe").find("#sppz").val(vouCurrMaxVouNo).removeAttr('vouno');
				}
			} else {
				$(".voucherhe").find("#sppz").val('');
			}
		})
	}
}
//日期框初始化
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
	var sctop = ths.offset().top - $(window).scrollTop() - ths.parents('.voucher-yc-bg').scrollTop() + 50
	var scleft = ths.offset().left - $(window).scrollLeft()
	if(ths.parents('.voucher-centerys').length>0 || ths.parents('.voucher-center').hasClass('voucher-center-ys')){
		$("#accounting-container-ys").show().addClass('selAccoTree').css({
			'position': 'fixed',
			'top': sctop,
			'left': scleft
		});
	}else if(ths.parents('.voucher-centercw').length>0  || ths.parents('.voucher-center').hasClass('voucher-center-cw')){
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
//判断修改权限
function isInputChange(){
	var editStatus0 = ($("#pzzhuantai").attr("vou-status") == undefined);
	if(!editStatus0) {
		var editStatus1 = ($("#pzzhuantai").attr("vou-status") == "O");
		var editStatus2 = (isInputor == true && (selectdata.data.inputor == ufgovkey.svUserId || selectdata.data.inputor == undefined));
		var editStatus3 = ((isvousource && isvousourceclick == false) || isvousourceclick)
		if(editStatus1 && (editStatus2 || isInputor == false) && editStatus3 && !editStatus0) {
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
			temporaryfzhs=ths.parents('.accounting').attr('fudata')
		}else{
			temporaryfzhsprev=ths.parents('.accounting').attr('fudata')
		}
	}else{
		for(var i = 0; i < ths.parents(".voucher-center").find(".voucher-yc").length; i++) {
				for(var j = 0; j < paryc.find(".voucher-yc-bo").length; j++) {
					paryc.find(".voucher-yc-bo").eq(j).index = j
					var bodyss = new Object();
					var $ycBt = paryc
					var headLen = $ycBt.find(".ychead").length - 1;
					for(var k = 0; k < headLen; k++) {
						var dd = $ycBt.find(".ychead").eq(k).attr("name");
						if(dd == 'expireDate') {
							var itemCodeName = $ycBt.find(".voucher-yc-bo").eq(j).find(".ycbody").eq(k).find(".ycbodyinp").val();
							bodyss[dd] = itemCodeName;
						} else if(dd == 'billNo') {
							var itemCodeName = $ycBt.find(".voucher-yc-bo").eq(j).find(".ycbody").eq(k).find(".ycbodyinp").val();
							bodyss[dd] = itemCodeName;
						} else if(dd == 'billDate') {
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
//更新记忆页面操作选项
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
		if(param!=undefined && param!=null &&  param.startVouDate !=undefined){
			$('#leftstartdate').getObj().setValue(param.startVouDate);
		}else{
			$('#leftstartdate').getObj().setValue(Year + '-' + Month + '-01');
		}
		if(param!=undefined && param!=null && param.endVouDate !=undefined){
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
	if(getUrlParam("dataFrom") == "vouBox" && vouboxtrue == true) {
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
		//		sddddd	
	} else {
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
	} //期间
	ufma.ajaxDef('/gl/vou/getVouHeads', "post", param, function(data) {
		leftsss = data;
	})
}
function leftsearchbody(){
	var leftss = '';
	for(var i = 0; i < leftsss.data.length; i++) {
		if(vousinglepz || vousinglepzzy) {
			leftss += '<div class="voucherleftbodyk voucherleftbodykdp" name="' + leftsss.data[i].vouGuid + '" weizhi="' + i + '">'
		} else {
			leftss += '<div class="voucherleftbodyk" name="' + leftsss.data[i].vouGuid + '" weizhi="' + i + '">'
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
			leftss += '<p class="cwje" jsnum = ' + leftsss.data[i].amtDr + '><span>财务金额：</span>' + formatNum(parseFloat(leftsss.data[i].amtDr).toFixed(2)) + '</p>'
			leftss += '<p class="ysje" jsnum = ' + leftsss.data[i].ysAmtDr + '><span>预算金额：</span>' + formatNum(parseFloat(leftsss.data[i].ysAmtDr).toFixed(2)) + '</p>'
		} else {
			leftss += '<p class="je"  jsnum = ' + leftsss.data[i].amtDr + '><span>金额：</span>' + formatNum(parseFloat(leftsss.data[i].amtDr).toFixed(2)) + '</p>'
		}
		leftss += '<div class="leftcha"><span class="icon-take-back" style="margin-right:8px;font-size:12px"></span>查看</div>'
		leftss += '<div class="leftbtns">'
		leftss += '	<div class="leftfz">复制</div>'
		leftss += '	<div class="leftcr">插入</div>'
		leftss += '	<div class="leftsc" sour=' + leftsss.data[i].vouSource + '>删除</div>'
		leftss += '	</div>'
		leftss += '	</div>'
	}
	$(".vou-right-searchtbody").html(leftss);
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
function voucherYcAssCss(voucherycb){
	var klengths = voucherycb.find('.voucher-yc-bg').width()
	var now = klengths/voucherycb.find('.voucher-yc-bg').find(".ychead").length-1
	if(now<200){
		voucherycb.find('.voucher-yc-bt').css({
			"width": voucherycb.find('.voucher-yc-bg').find(".ychead").length*200+"px"
		})
		voucherycb.find('.voucher-yc-bt-gudin').css({
			"width": voucherycb.find('.voucher-yc-bg').find(".ychead").length*200+"px"
		})
		voucherycb.find('.voucher-yc-bo').css({
			"width": voucherycb.find('.voucher-yc-bg').find(".ychead").length*200+"px"
		})
		voucherycb.find(".ychead").css({
			"width": "200px"
		})
		voucherycb.find(".ycbody").css({
			"width": "200px"
		})
	}else{
		voucherycb.find('.voucher-yc-bt').css({
			"width": '100%'
		})
		voucherycb.find('.voucher-yc-bo').css({
			"width": '100%'
		})
		voucherycb.find(".ychead").css({
			"width": klengths/voucherycb.find('.voucher-yc-bg').find(".ychead").length-1 + "px",
		})
		voucherycb.find(".ycbody").css({
			"width": klengths/voucherycb.find('.voucher-yc-bg').find(".ychead").length-1 + "px",
		})
	}
	$('.voucher-bgallscroll').height($(".voudetailAss").height()-35)
	$('.voucher-yc-bg').scroll(function(){
		var scrolllen = $('.voucher-yc-bg').scrollLeft()
		$(".voucher-yc-bt-gudinbg").scrollLeft(scrolllen)
	})
}
function voucherycTitleData(inde){
	if(inde !='no'){
	var ss = inde
	if(isaccfullname) {
		$('#voudetailAsstitle .titlename').html("科目：" + quanjuvoudatas.data[ss].accoCode + ' ' + quanjuvoudatas.data[ss].accoFullName)
	} else {
		$('#voudetailAsstitle .titlename').html("科目：" + quanjuvoudatas.data[ss].accoCode + ' ' + quanjuvoudatas.data[ss].accoName)
	}
	if($('.voucher-hover').find('.money-ys').length >= 1) {
		if($('.voucher-hover').hasClass('voucher-hovercw')){
			if($('.voucher-hover').find('.voucher-centercw').find('.money-ys').hasClass('moneyj') || $('.voucher-hover').find('.voucher-centercw').find('.money-ys').parents('.money-jd').hasClass('moneyj')) {
				$('#voudetailAsstitle .voucher-yc-j').prop("checked", true)
				$('#voudetailAsstitle .voucher-yc-d').prop("checked", false)
			} else {
				$('#voudetailAsstitle .voucher-yc-d').prop("checked", true)
				$('#voudetailAsstitle .voucher-yc-j').prop("checked", false)
			}
		}else if($('.voucher-hover').hasClass('voucher-hoverys')){
			if($('.voucher-hover').find('.voucher-centerys').find('.money-ys').hasClass('moneyj') || $('.voucher-hover').find('.voucher-centerys').find('.money-ys').parents('.money-jd').hasClass('moneyj')) {
				$('#voudetailAsstitle .voucher-yc-j').prop("checked", true)
				$('#voudetailAsstitle .voucher-yc-d').prop("checked", false)
			} else {
				$('#voudetailAsstitle .voucher-yc-d').prop("checked", true)
				$('#voudetailAsstitle .voucher-yc-j').prop("checked", false)
			}
		}else{
			if($(this).parents('.voucher-center').find('.money-ys').hasClass('moneyj') || $(this).parents('.voucher-center').find('.money-ys').parents('.money-jd').hasClass('moneyj')) {
				$('#voudetailAsstitle .voucher-yc-j').prop("checked", true)
				$('#voudetailAsstitle .voucher-yc-d').prop("checked", false)
			} else {
				$('#voudetailAsstitle .voucher-yc-d').prop("checked", true)
				$('#voudetailAsstitle .voucher-yc-j').prop("checked", false)
			}
		}
	}else{
		if(quanjuvoudatas.data[ss].accBal == '1'){
			$('#voudetailAsstitle .voucher-yc-j').prop("checked", true)
			$('#voudetailAsstitle .voucher-yc-d').prop("checked", false)
		}else{
			$('#voudetailAsstitle .voucher-yc-j').prop("checked", true)
			$('#voudetailAsstitle .voucher-yc-d').prop("checked", false)
		}
	}
	}else{
		$('#voudetailAsstitle .titlename').html("科目：")
		$('#voudetailAsstitle .voucher-yc-j').prop("checked", true)
		$('#voudetailAsstitle .voucher-yc-d').prop("checked", false)
	}
}
function voucherhover(_this){
	var assData; 
	var assDataaccoSurplus;
	var assDatadfDc; 
	var accindex;
	var isclick = false
	var titles ;
	var  cwy  = _this.parents('.voucher-hovercw').length>0 && _this.parents('.voucher-centercw').length<1
	var  ysc  = _this.parents('.voucher-hoverys').length>0 && _this.parents('.voucher-centerys').length<1
	if(_this.parents('.voucher-hover').length==0 || cwy || ysc){
		if(vousinglepzzy == true && vousinglepz == false){
			if($(".voucher-hover").hasClass("voucher-hovercw")){
				var asdata = huoqufzhs()
				$(".voucher-hover").find(".voucher-centercw").find('.accounting').attr('fudata',JSON.stringify(asdata[0])).attr('accoSurplus',asdata[1]).attr('dfDc',asdata[2])
			}else if($(".voucher-hover").hasClass("voucher-hoverys")){
				var asdata = huoqufzhs()
				$(".voucher-hover").find(".voucher-centerys").find('.accounting').attr('fudata',JSON.stringify(asdata[0])).attr('accoSurplus',asdata[1]).attr('dfDc',asdata[2])
			}
			$('.voucher-center').removeClass("voucher-hover").removeClass("voucher-hovercw").removeClass("voucher-hoverys")
			if(_this.parents(".voucher-centercw").length>0){
				_this.parents(".voucher-center").addClass('voucher-hover').addClass('voucher-hovercw')
				if($(".voucher-hover").find(".voucher-centercw").find('.accounting').attr('fudata')!=undefined){
					assData = JSON.parse($(".voucher-hover").find(".voucher-centercw").find('.accounting').attr('fudata'))
					assDataaccoSurplus = $(".voucher-hover").find(".voucher-centercw").find('.accounting').attr('accoSurplus')
					assDatadfDc = $(".voucher-hover").find(".voucher-centercw").find('.accounting').attr('dfDc')
					accindex =  $(".voucher-hover").find(".voucher-centercw").find('.accountinginp').attr('accoindex')
					if($(".voucher-hover").find(".voucher-centercw").find('.accountinginp').attr('accitemNum')!='1'){
						isclick = false
					}else{
						isclick = true
					}
				}
				titles = $(".voucher-hover").find(".voucher-centercw").find('.accounting')
			}else if(_this.parents(".voucher-centerys").length>0){
				_this.parents(".voucher-center").addClass('voucher-hover').addClass('voucher-hoverys')
				if($(".voucher-hover").find(".voucher-centerys").find('.accounting').attr('fudata')!=undefined){
					assData = JSON.parse($(".voucher-hover").find(".voucher-centerys").find('.accounting').attr('fudata'))
					assDataaccoSurplus = $(".voucher-hover").find(".voucher-centerys").find('.accounting').attr('accoSurplus')
					assDatadfDc = $(".voucher-hover").find(".voucher-centerys").find('.accounting').attr('dfDc')
					accindex =  $(".voucher-hover").find(".voucher-centerys").find('.accountinginp').attr('accoindex')
					if($(".voucher-hover").find(".voucher-centerys").find('.accountinginp').attr('accitemNum')!='1'){
						isclick = false
					}else{
						isclick = true
					}
				}
				titles = $(".voucher-hover").find(".voucher-centerys").find('.accounting')
			}
		}else{
			_this.parents(".voucher-center").addClass('voucher-hover')
			var asdata = huoqufzhs()
			$(".voucher-hover").find('.accounting').attr('fudata',JSON.stringify(asdata[0]))
			$(".voucher-hover").find('.accounting').attr('accoSurplus',asdata[1])
			$(".voucher-hover").find('.accounting').attr('dfDc',asdata[2])
			$('.voucher-center').removeClass("voucher-hover").removeClass("voucher-hovercw").removeClass("voucher-hoverys")
			_this.parents(".voucher-center").addClass('voucher-hover')
			if($(".voucher-hover").find(".voucher-centercw").find('.accounting').attr('fudata')!=undefined){
				assData = JSON.parse($(".voucher-hover").find(".voucher-centercw").find('.accounting').attr('fudata'))
				assDataaccoSurplus = $(".voucher-hover").find('.accounting').attr('accoSurplus')
				assDatadfDc = $(".voucher-hover").find('.accounting').attr('dfDc')
				accindex =  $(".voucher-hover").find('.accountinginp').attr('accoindex')
				if($(".voucher-hover").find('.accountinginp').attr('accitemNum')!='1'){
					isclick = false
				}else{
					isclick = true
				}
			}
			titles = $(".voucher-hover").find('.accounting')
		}
		if(accindex!=undefined){
			if(isclick){
				$(this).parents('.accounting')
				chaclickfu(titles,assData,assDataaccoSurplus,assDatadfDc)
			}else{
				$(".voucher-yc").html('')
				voucherycTitleData(accindex)
			}
		}else{
			$(".voucher-yc").html('')
			voucherycTitleData('no')
		}
	}
}
