var glRptJournalDate = {
	format: 'yyyy-mm-dd',
	autoclose: true,
	todayBtn: true,
	startView: 'month',
	minView: 'month',
	maxView: 'decade',
	language: 'zh-CN'
};
if(vousingelzysdob){
 	glRptJournalDate = {
		format: 'yyyy-mm-dd',
		autoclose: true,
		todayBtn: true,
		startView: 'month',
		minView: 'month',
		maxView: 'decade',
		language: 'zh-CN',
		pickerPosition:'top-right'
	};
}
//各状态按钮以及对应权限
var btnpermission = {
	"btn-post": "记账",
	"btn-turnred": "冲红",
	"btn-search": "搜索",
	"btn-add": "新增",
	"btn-save": "保存",
	"btn-saveadd": "保存并新增",
	"btn-watch": "查看",
	"btn-print": "打印",
	"btn-print-preview": "打印预览",
	"btn-print-previewpdf": "打印",
	"btn-delete": "删除",
	"btn-audit": "审核",
	"btn-turnerror": "标错",
	"btn-cancel": "作废",
	"btn-copy": "复制",
	"btn-upload": "上传",
	"btn-scan": "扫描",
	"btn-templet": "调用模板",
	"btn-templet": "调用草稿",
	"btn-addtemplet": "保存为模板",
	"btn-addprint": "保存并打印",
	"btn-temporary": "暂存",
	"btn-delaudit": "销审",
	"btn-delpost": "反记账"
}

function allshowbtn(btnd) {
	var voucherbtns = ''
	if(btnd.length <= 4) {
		voucherbtns += '<div class="voucherbtns">'
		for(var btnlength = 0; btnlength < btnd.length; btnlength++) {
			voucherbtns += '<div id="' + btnd[btnlength].id + '" class="btn-voucher ' + btnd[btnlength].class + ' ' + btnd[btnlength].isclass + '">' + btnd[btnlength].name + '</div>'
		}
		voucherbtns += '</div>'
	} else {
		voucherbtns += '<div class="voucherbtns">'
		for(var btnlength = 0; btnlength < 3; btnlength++) {
			voucherbtns += '<div id="' + btnd[btnlength].id + '" class="btn-voucher ' + btnd[btnlength].class + ' ' + btnd[btnlength].isclass + '">' + btnd[btnlength].name + '</div>'
		}
		voucherbtns += '<div class="btn-voucher-lang">更多 <span class="icon-angle-bottom"></span>'
		voucherbtns += '<div class="all-no">'
		for(var btnlength = 3; btnlength < btnd.length; btnlength++) {
			voucherbtns += '<div id="' + btnd[btnlength].id + '" class="all-no-fen ' + btnd[btnlength].class + ' ' + btnd[btnlength].isclass + '">' + btnd[btnlength].name + '</div>'
		}
		voucherbtns += '<div id="btn-bcb" class="all-no-fen btn-add">备查簿</div>'
		voucherbtns += '<div id="btn-fz" class="all-no-fen">复制</div>'
		voucherbtns += '<div id="btn-cr" class="all-no-fen">插入</div>'
		voucherbtns += '</div>'
		voucherbtns += '</div>'
		voucherbtns += '</div>'
	}
	return voucherbtns
}

function showbtns(voubtn) {
	if(getUrlParam("action") == "preview" && getUrlParam("preview") == "1") {
		var z = '<div class="voucherbtns">'
		z += '<div id="btn-voucher-bcclose" class="btn-voucher btn-voucher-hover">生成</div>'
		z += '<div id="btn-voucher-qxbc" class="btn-voucher">取消</div>'
		z += '</div>'
		$(".voucherbtn").html(z);
//		$(".voucherbtns").css("margin-left", -$(".voucherbtns").width() / 2);
	} else if(getUrlParam("action") == "preview" && getUrlParam("preview") == "0") {
		var z = '<div class="voucherbtns">'
		z += '<div id="btn-voucher-qxbc" class="btn-voucher">关闭</div>'
		z += '</div>'
		$(".voucherbtn").html(z);
//		$(".voucherbtns").css("margin-left", -$(".voucherbtns").width() / 2);
	} else {
		var voubtnshow = [];
		for(var k = 0; k < voubtn.length; k++) {
			for(var i = 0; i < isbtnpermission.length; i++) {
				if(isbtnpermission[i].id == voubtn[k].class && isbtnpermission[i].flag != "0") {
					voubtnshow.push(voubtn[k])
				}
			}
		}
		$(".voucherbtn").html(allshowbtn(voubtnshow));
//		$(".voucherbtns").css("margin-left", -$(".voucherbtns").width() / 2);
	}

}

function vouluru() {
	var voubtn = [{
		"id": "btn-voucher-xz",
		"name": "新增",
		"class": "btn-add",
		"isclass": ""
	}, {
		"id": "btn-voucher-bc",
		"name": "保存",
		"class": "btn-save",
		"isclass": "btn-voucher-hover"
	}, {
		"id": "btn-voucher-bcbxz",
		"name": "保存并新增",
		"class": "btn-saveadd",
		"isclass": ""
	}, {
		"id": "btn-voucher-bcbdy",
		"name": "保存并打印",
		"class": "btn-addprint",
		"isclass": ""
	}, {
		"id": "btn-voucher-zc",
		"name": "暂存",
		"class": "btn-temporary",
		"isclass": ""
	}, {
		"id": "mbsr",
		"name": "调用模板",
		"class": "btn-templet",
		"isclass": ""
	}, {
		"id": "mbsrcom",
		"name": "智能模板",
		"class": "btn-templet",
		"isclass": ""
	}, {
		"id": "cgsr",
		"name": "调用草稿",
		"class": "btn-templet",
		"isclass": ""
	}, {
		"id": "mbbc",
		"name": "保存为模板",
		"class": "btn-addtemplet",
		"isclass": ""
	}, {
		"id": "voudataRefresh",
		"name": "刷新",
		"class": "btn-add",
		"isclass": ""
	}]
	checkVouSource(voubtn);
	showbtns(voubtn)
}

function vouchakan() {
	var voubtn = [{
		"id": "btn-voucher-xz",
		"name": "新增",
		"class": "btn-add",
		"isclass": ""
	}, {
		"id": "btn-voucher-sh",
		"name": "审核",
		"class": "btn-audit",
		"isclass": "btn-voucher-hover"
	}, {
		"id": "btn-voucher-dy",
		"name": "打印",
		"class": "btn-print",
		"isclass": ""
	}, {
		"id": "btn-voucher-dypdf",
		"name": "打印",
		"class": "btn-print-previewpdf",
		"isclass": ""
	}, {
		"id": "mbsr",
		"name": "调用模板",
		"class": "btn-templet",
		"isclass": ""
	}, {
		"id": "mbsrcom",
		"name": "智能模板",
		"class": "btn-templet",
		"isclass": ""
	}, {
		"id": "cgsr",
		"name": "调用草稿",
		"class": "btn-templet",
		"isclass": ""
	}, {
		"id": "mbbc",
		"name": "保存为模板",
		"class": "btn-addtemplet",
		"isclass": ""
	}, {
		"id": "btn-voucher-zf",
		"name": "作废",
		"class": "btn-cancel",
		"isclass": ""
	}, {
		"id": "btn-voucher-biaocuo",
		"name": "标错",
		"class": "btn-turnerror",
		"isclass": ""
	}, {
		"id": "btn-voucher-dyyl",
		"name": "打印预览",
		"class": "btn-print-preview",
		"isclass": ""
	}, {
		"id": "voudataRefresh",
		"name": "刷新",
		"class": "btn-add",
		"isclass": ""
	}]
	if(onlyVoidCanDel == false) {
		voubtn.push({
			"id": "btn-voucher-sc",
			"name": "删除",
			"class": "btn-delete",
			"isclass": ""
		});
	}
	checkVouSource(voubtn);
	showbtns(voubtn)
}

function voubiaoji() {
	var voubtn = [{
		"id": "btn-voucher-xz",
		"name": "新增",
		"class": "btn-add",
		"isclass": ""
	}, {
		"id": "btn-voucher-bc",
		"name": "保存",
		"class": "btn-save",
		"isclass": "btn-voucher-hover"
	}, {
		"id": "btn-voucher-bcbxz",
		"name": "保存并新增",
		"class": "btn-saveadd",
		"isclass": ""
	}, {
		"id": "mbsr",
		"name": "调用模板",
		"class": "btn-templet",
		"isclass": ""
	}, {
		"id": "mbsrcom",
		"name": "智能模板",
		"class": "btn-templet",
		"isclass": ""
	}, {
		"id": "cgsr",
		"name": "调用草稿",
		"class": "btn-templet",
		"isclass": ""
	}, {
		"id": "mbbc",
		"name": "保存为模板",
		"class": "btn-addtemplet",
		"isclass": ""
	}, {
		"id": "btn-voucher-bcbdy",
		"name": "保存并打印",
		"class": "btn-addprint",
		"isclass": ""
	}, {
		"id": "voudataRefresh",
		"name": "刷新",
		"class": "btn-add",
		"isclass": ""
	}]
	checkVouSource(voubtn);
	showbtns(voubtn)
	if(quanjuvouchaiwu != null && quanjuvouchaiwu.vouDetails != undefined) {
		for(var i = 0; i < quanjuvouchaiwu.vouDetails.length; i++) {
			if(quanjuvouchaiwu.vouDetails[i].op == 3) {
				quanjuvouchaiwu.vouDetails[i].op = 1
			}
		}
	}
	if(quanjuvouyusuan != null && quanjuvouyusuan.vouDetails != undefined) {
		for(var i = 0; i < quanjuvouyusuan.vouDetails.length; i++) {
			if(quanjuvouyusuan.vouDetails[i].op == 3) {
				quanjuvouyusuan.vouDetails[i].op = 1
			}
		}
	}
}

function vouweigaicuo() {
	var voubtn = [{
		"id": "btn-voucher-xz",
		"name": "新增",
		"class": "btn-add",
		"isclass": ""
	}, {
		"id": "btn-voucher-gaicuo",
		"name": "改错",
		"class": "btn-delturnerror",
		"isclass": "btn-voucher-hover"
	}, {
		"id": "btn-voucher-bcbxz",
		"name": "保存并新增",
		"class": "btn-saveadd",
		"isclass": ""
	}, {
		"id": "mbsr",
		"name": "调用模板",
		"class": "btn-templet",
		"isclass": ""
	}, {
		"id": "mbsrcom",
		"name": "智能模板",
		"class": "btn-templet",
		"isclass": ""
	}, {
		"id": "cgsr",
		"name": "调用草稿",
		"class": "btn-templet",
		"isclass": ""
	}, {
		"id": "mbbc",
		"name": "保存为模板",
		"class": "btn-addtemplet",
		"isclass": ""
	}, {
		"id": "btn-voucher-bcbdy",
		"name": "保存并打印",
		"class": "btn-turnerror",
		"isclass": ""
	}, {
		"id": "voudataRefresh",
		"name": "刷新",
		"class": "btn-add",
		"isclass": ""
	}]
	checkVouSource(voubtn);
	showbtns(voubtn)
}

function vouyigaicuo() {
	var voubtn = [{
		"id": "btn-voucher-xz",
		"name": "新增",
		"class": "btn-add",
		"isclass": ""
	}, {
		"id": "btn-voucher-xc",
		"name": "销错",
		"class": "btn-noturnerror",
		"isclass": "btn-voucher-hover"
	}, {
		"id": "btn-voucher-dy",
		"name": "打印",
		"class": "btn-print",
		"isclass": ""
	}, {
		"id": "btn-voucher-dypdf",
		"name": "打印",
		"class": "btn-print-previewpdf",
		"isclass": ""
	},{
		"id": "btn-voucher-bcbdy",
		"name": "保存并打印",
		"class": "btn-turnerror",
		"isclass": ""
	}, {
		"id": "mbsr",
		"name": "调用模板",
		"class": "btn-templet",
		"isclass": ""
	}, {
		"id": "mbsrcom",
		"name": "智能模板",
		"class": "btn-templet",
		"isclass": ""
	}, {
		"id": "cgsr",
		"name": "调用草稿",
		"class": "btn-templet",
		"isclass": ""
	}, {
		"id": "mbbc",
		"name": "保存为模板",
		"class": "btn-addtemplet",
		"isclass": ""
	}, {
		"id": "btn-voucher-zf",
		"name": "作废",
		"class": "btn-cancel",
		"isclass": ""
	}, {
		"id": "btn-voucher-biaocuo",
		"name": "标错",
		"class": "btn-turnerror",
		"isclass": ""
	}, {
		"id": "btn-voucher-dyyl",
		"name": "打印预览",
		"class": "btn-print-preview",
		"isclass": ""
	}, {
		"id": "voudataRefresh",
		"name": "刷新",
		"class": "btn-add",
		"isclass": ""
	}]
	checkVouSource(voubtn);
	showbtns(voubtn)
}

function vouyizuofei() {
	var voubtn = [{
		"id": "btn-voucher-xz",
		"name": "新增",
		"class": "btn-add",
		"isclass": ""
	}, {
		"id": "btn-voucher-sc",
		"name": "删除",
		"class": "btn-delete",
		"isclass": "btn-voucher-hover"
	}, {
		"id": "btn-voucher-dy",
		"name": "打印",
		"class": "btn-print",
		"isclass": ""
	},{
		"id": "btn-voucher-dypdf",
		"name": "打印",
		"class": "btn-print-previewpdf",
		"isclass": ""
	}, {
		"id": "mbsr",
		"name": "调用模板",
		"class": "btn-templet",
		"isclass": ""
	}, {
		"id": "mbsrcom",
		"name": "智能模板",
		"class": "btn-templet",
		"isclass": ""
	}, {
		"id": "cgsr",
		"name": "调用草稿",
		"class": "btn-templet",
		"isclass": ""
	}, {
		"id": "btn-voucher-hy",
		"name": "还原",
		"class": "btn-delcancel",
		"isclass": ""
	}, {
		"id": "btn-voucher-dyyl",
		"name": "打印预览",
		"class": "btn-print-preview",
		"isclass": ""
	}, {
		"id": "voudataRefresh",
		"name": "刷新",
		"class": "btn-add",
		"isclass": ""
	}]
	checkVouSource(voubtn);
	showbtns(voubtn)
}

function vouyishenhe() {
	var voubtn = [{
		"id": "btn-voucher-xz",
		"name": "新增",
		"class": "btn-add",
		"isclass": ""
	}, {
		"id": "btn-voucher-jz",
		"name": "记账",
		"class": "btn-post",
		"isclass": "btn-voucher-hover"
	}, {
		"id": "btn-voucher-dy",
		"name": "打印",
		"class": "btn-print",
		"isclass": ""
	}, {
		"id": "btn-voucher-dypdf",
		"name": "打印",
		"class": "btn-print-previewpdf",
		"isclass": ""
	},{
		"id": "mbsr",
		"name": "调用模板",
		"class": "btn-templet",
		"isclass": ""
	}, {
		"id": "mbsrcom",
		"name": "智能模板",
		"class": "btn-templet",
		"isclass": ""
	}, {
		"id": "cgsr",
		"name": "调用草稿",
		"class": "btn-templet",
		"isclass": ""
	}, {
		"id": "mbbc",
		"name": "保存为模板",
		"class": "btn-addtemplet",
		"isclass": ""
	}, {
		"id": "btn-voucher-xs",
		"name": "销审",
		"class": "btn-delaudit",
		"isclass": ""
	}, {
		"id": "btn-voucher-dyyl",
		"name": "打印预览",
		"class": "btn-print-preview",
		"isclass": ""
	}, {
		"id": "voudataRefresh",
		"name": "刷新",
		"class": "btn-add",
		"isclass": ""
	}]
	checkVouSource(voubtn);
	showbtns(voubtn)
}

function vouyijizhang() {
	var voubtn = [{
		"id": "btn-voucher-xz",
		"name": "新增",
		"class": "btn-add",
		"isclass": ""
	}, {
		"id": "btn-voucher-conghong",
		"name": "冲红",
		"class": "btn-turnred",
		"isclass": "btn-voucher-hover"
	},{
		"id": "btn-voucher-dypdf",
		"name": "打印",
		"class": "btn-print-previewpdf",
		"isclass": ""
	}, {
		"id": "btn-voucher-dy",
		"name": "打印",
		"class": "btn-print",
		"isclass": ""
	}, {
		"id": "mbsr",
		"name": "调用模板",
		"class": "btn-templet",
		"isclass": ""
	}, {
		"id": "mbsrcom",
		"name": "智能模板",
		"class": "btn-templet",
		"isclass": ""
	}, {
		"id": "cgsr",
		"name": "调用草稿",
		"class": "btn-templet",
		"isclass": ""
	}, {
		"id": "mbbc",
		"name": "保存为模板",
		"class": "btn-addtemplet",
		"isclass": ""
	}, {
		"id": "btn-voucher-fjz",
		"name": "反记账",
		"class": "btn-delpost",
		"isclass": ""
	}, {
		"id": "btn-voucher-dyyl",
		"name": "打印预览",
		"class": "btn-print-preview",
		"isclass": ""
	}, {
		"id": "voudataRefresh",
		"name": "刷新",
		"class": "btn-add",
		"isclass": ""
	}]
	checkVouSource(voubtn);
	showbtns(voubtn)
	if(selectdata.data.isWriteOff == '2' || selectdata.data.isWriteOff == '1'){
		$("#btn-voucher-conghong").addClass('btn-disablesd')
	}
}
//新增凭证拼接
function voucheralls() {
	$(".xjll").hide();
	$("#sppz").removeAttr("name")
	$("#sppz").attr("optNoType", optNoType)
	$("#leftbgselect").removeAttr("disabled", false)
	voutypeword()
	if(optNoType==0){
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
	xialacode = rpt.nowAgencyCode;
	if(vousinglepz == false && vousinglepzzy == false) {
		var voucherallss = '';
		voucherallss += '<div class="voucher">'
		voucherallss += '<div class="voucher-head">'
		voucherallss += '<div class="abstracthead">摘要</div>'
		voucherallss += '<div class="accountinghead">会计科目&nbsp&nbsp&nbsp&nbsp<span class="icon-angle-bottom allvoucherycshow" title="展开全部辅助核算项"></span></div>'
		voucherallss += '<div class="fhead jf">'
		voucherallss += '<p>借方金额</p>'
		voucherallss += '<div class="moneydw">'
		voucherallss += '<span class="blues">十</span>'
		voucherallss += '<span>亿</span>'
		voucherallss += '<span>千</span>'
		voucherallss += '<span class="blues">百</span>'
		voucherallss += '<span>十</span>'
		voucherallss += '<span>万</span>'
		voucherallss += '<span class="blues">千</span>'
		voucherallss += '<span>百</span>'
		voucherallss += '<span>十</span>'
		voucherallss += '<span class="reds">元</span>'
		voucherallss += '<span>角</span>'
		voucherallss += '<span class="last">分</span>'
		voucherallss += '</div>'
		voucherallss += '</div>'
		voucherallss += '<div class="fhead df">'
		voucherallss += '<p>贷方金额</p>'
		voucherallss += '<div class="moneydw">'
		voucherallss += '<span class="blues">十</span>'
		voucherallss += '<span>亿</span>'
		voucherallss += '<span>千</span>'
		voucherallss += '<span class="blues">百</span>'
		voucherallss += '<span>十</span>'
		voucherallss += '<span>万</span>'
		voucherallss += '<span class="blues">千</span>'
		voucherallss += '<span>百</span>'
		voucherallss += '<span>十</span>'
		voucherallss += '<span class="reds">元</span>'
		voucherallss += '<span>角</span>'
		voucherallss += '<span class="last">分</span>'
		voucherallss += '</div>'
		voucherallss += '</div>'
		voucherallss += '</div>'
		for(var k = 0; k < 4; k++) {
			if($(".chaiwu").hasClass("xuanzhongcy")) {
					voucherallss += '<div class="voucher-body voucher-center voucher-center-cw" op="0">'
				} else {
					voucherallss += '<div class="voucher-body voucher-center voucher-center-ys" op="0">'
				}
			voucherallss += '<div class="voucherjias">'
			voucherallss += '<a href="javascript:" class="voucherjia"><span class="icon-open"></span></a>'
			voucherallss += '<a href="javascript:" class="voucherjiass"></a>'
			voucherallss += '</div>'
			voucherallss += '<div class="abstract">'
			voucherallss += '<textarea class="abstractinp"></textarea>'
			voucherallss += '</div>'
			voucherallss += '<div class="accounting">'
			voucherallss += '<textarea class="accountinginp"></textarea>'
			voucherallss += '<span class="accountingye">余额:200</span>'
			voucherallss += '<span class="accountingmx">明细账</span>'
			voucherallss += '<div class="fuyan"><span>辅</span></div>'
			voucherallss += '</div>'
			voucherallss += '<div center class="money-jd moneyj">'
			voucherallss += '<input type="text" class="money-sr" />'
			voucherallss += '<div class="money-xs"></div>'
			voucherallss += '<div class="money-xsbg"></div>'
			voucherallss += '</div>'
			voucherallss += '<div center class="money-jd moneyd">'
			voucherallss += '<input type="text" class="money-sr" />'
			voucherallss += '<div class="money-xs"></div>'
			voucherallss += '<div class="money-xsbg"></div>'
			voucherallss += '</div>'
			voucherallss += '<div class="voucherjians">'
			voucherallss += '<a href="javascript:" class="voucherjian icon-trash"></a>'
			voucherallss += '</div>'
			voucherallss += '</div>'
		}
		voucherallss += '<div class="voucher-body voucher-footer">'
		voucherallss += '<div class="heji">合计</div>'
		voucherallss += '<div center class="money-jd moneyj">'
		voucherallss += '<div class="money-xs"></div>'
		voucherallss += '<div class="money-xsbg"></div>'
		voucherallss += '</div>'
		voucherallss += '<div center class="money-jd moneyd">'
		voucherallss += '<div class="money-xs"></div>'
		voucherallss += '<div class="money-xsbg"></div>'
		voucherallss += '</div>'
		voucherallss += '</div>'
		voucherallss += '</div>'
		$(".voudetail").html(voucherallss);
		$(".voucherall").height(523)
		
		$(".nowu").val("暂无信息");
		$(".voucher-history-zhankai").find("b").addClass("icon-angle-bottom").removeClass("icon-angle-top");
		$(".voucher-history-by").css("height", "0px");
		$(".voucher-history-by").html("");
		
	} else if(vousinglepzzy == false && vousinglepz == true) {
		var voucherallss = '';
		voucherallss += '<div class="voucher voucher-singel">'
		voucherallss += '<div class="voucher-head">'
		voucherallss += '<div class="voucherType" style="width:47px"></div>'
		voucherallss += '<div class="abstracthead">摘要</div>'
		voucherallss += '<div class="accountinghead">会计科目&nbsp&nbsp&nbsp&nbsp<span class="icon-angle-bottom allvoucherycshow" title="展开全部辅助核算项"></span></div>'
		voucherallss += '<div class="fhead jf">'
		voucherallss += '<p>借方金额</p>'
		voucherallss += '</div>'
		voucherallss += '<div class="fhead df">'
		voucherallss += '<p>贷方金额</p>'
		voucherallss += '</div>'
		voucherallss += '</div>'
		for(var k = 0; k < 6; k++) {
			voucherallss += '<div class="voucher-body voucher-center" op="0">'
			voucherallss += '<div class="voucherjias">'
			voucherallss += '<a href="javascript:" class="voucherjia"><span class="icon-open"></span></a>'
			voucherallss += '<a href="javascript:" class="voucherjiass"></a>'
			voucherallss += '</div>'
			voucherallss += '<div class="vouchertypebody">'
			//			voucherallss += '<div class="vouchertypebodycw">财</div>'
			voucherallss += '</div>'
			voucherallss += '<div class="abstract">'
			voucherallss += '<textarea class="abstractinp"></textarea>'
			voucherallss += '</div>'
			voucherallss += '<div class="accounting">'
			voucherallss += '<textarea class="accountinginp"></textarea>'
			voucherallss += '<span class="accountingye">余额:200</span>'
			voucherallss += '<span class="accountingmx">明细账</span>'
			voucherallss += '<div class="fuyan"><span>辅</span></div>'
			voucherallss += '</div>'
			voucherallss += '<div center class="money-jd moneyj">'
			voucherallss += '<input type="text" class="money-sr" />'
			voucherallss += '<div class="money-xs"></div>'
			voucherallss += '</div>'
			voucherallss += '<div center class="money-jd moneyd">'
			voucherallss += '<input type="text" class="money-sr" />'
			voucherallss += '<div class="money-xs"></div>'
			voucherallss += '</div>'
			voucherallss += '<div class="voucherjians">'
			voucherallss += '<a href="javascript:" class="voucherjian icon-trash"></a>'
			voucherallss += '</div>'
			voucherallss += '</div>'
		}
		voucherallss += '<div class="voucher-body voucher-footer">'
		voucherallss += '<div class="heji">  '
		voucherallss += '<div class="" style="font-weight:bold;line-height: 73px;float: left;height: 73px;width: 46px;text-align: center;border-right: 1px solid #DFE6EC;">合计</div>'
		voucherallss += '<div class="hejicw" style="margin-left:58px;margin-top:15px;">财务会计：</div>'
		voucherallss += '<div class="hejiys" style="margin-left:58px;">预算会计：</div>'
		voucherallss += '</div>'
		voucherallss += '<div center class="money-jd moneyj" style="padding-top: 16px;">'
		voucherallss += '<div class="money-cw" style="text-align:right">0.00</div>'
		voucherallss += '<div class="money-ys" style="text-align:right">0.00</div>'
		voucherallss += '</div>'
		voucherallss += '<div center class="money-jd moneyd" style="padding-top: 16px;">'
		voucherallss += '<div class="money-cw" style="text-align:right">0.00</div>'
		voucherallss += '<div class="money-ys" style="text-align:right">0.00</div>'
		voucherallss += '</div>'
		voucherallss += '</div>'
		voucherallss += '</div>'
		$(".voudetail").html(voucherallss);
		$(".voucherall").height(623)
		
		$(".nowu").val("暂无信息");
		$(".voucher-history-zhankai").find("b").addClass("icon-angle-bottom").removeClass("icon-angle-top");
		$(".voucher-history-by").css("height", "0px");
		$(".voucher-history-by").html("");
		
	} else if(vousinglepzzy == true && vousinglepz == false) {
		var  lk = 4
		if($('.voudetail').height()>410){
			lk = 6
		}else if($('.voudetail').height()>360){
			lk = 5
		}
		var voucherallss = '';
		voucherallss += '<div class="voucher voucher-singelzy">'
		voucherallss += '<div class="voucher-head">'
		voucherallss += '<div class="voucherheadbtn"></div>'
		voucherallss += '<div class="voucherheadtitle">财务会计</div>'
		voucherallss += '<div class="voucherheadtitley">预算会计</div>'
		voucherallss += '<div class="voucherheadbtny"></div>'
		voucherallss += '<div class="vouindex">序号</div>'
		voucherallss += '<div class="abstracthead">摘要</div>'
		voucherallss += '<div class="accountinghead">会计科目</div>'
		voucherallss += '<div class="fhead jf">借方金额</div>'
		voucherallss += '<div class="fhead df">贷方金额</div>'
		voucherallss += '<div class="abstractheadtwo">摘要</div>'
		voucherallss += '<div class="accountingheady">会计科目</div>'
		voucherallss += '<div class="fhead jfy">借方金额</div>'
		voucherallss += '<div class="fhead dfy">贷方金额</div>'
		voucherallss += '</div>'
		voucherallss += '<div class="voubodyscroll">'
		for(var k = 0; k < lk; k++) {
			voucherallss += '<div class="voucher-body voucher-center">'
			voucherallss += '<div class="voucherjias">'
			voucherallss += '<a href="javascript:" class="voucherjia"><span class="icon-open"></span></a>'
			voucherallss += '<a href="javascript:" class="voucherjiass"><span class="icon-Addto_icon"></span></a>'
			voucherallss += '</div>'
			voucherallss += '<div class="voucher-centercw voucher-centerhalf">'
			voucherallss += '<div class="voucherindex"></div>'
			voucherallss += '<div class="abstract">'
			voucherallss += '<textarea class="abstractinp"></textarea>'
			voucherallss += '</div>'
			voucherallss += '<div class="accounting">'
			voucherallss += '<textarea class="accountinginp"></textarea>'
			voucherallss += '<span class="accountingye">余额:200</span>'
			voucherallss += '<span class="accountingmx">明细账</span>'
			voucherallss += '</div>'
			voucherallss += '<div center class="money-jd moneyj">'
			voucherallss += '<input type="text" class="money-sr" />'
			voucherallss += '<div class="money-xs"></div>'
			voucherallss += '</div>'
			voucherallss += '<div center class="money-jd moneyd">'
			voucherallss += '<input type="text" class="money-sr" />'
			voucherallss += '<div class="money-xs"></div>'
			voucherallss += '</div>'
			voucherallss += '<div class="voudeletediv"><div class="voudelete"><span class="glyphicon icon-close"></span></div></div>'
			voucherallss += '</div>'
			voucherallss += '<div class="voucher-centerys voucher-centerhalf">'
			voucherallss += '<div class="abstract">'
			voucherallss += '<textarea class="abstractinp"></textarea>'
			voucherallss += '</div>'
			voucherallss += '<div class="accounting">'
			voucherallss += '<textarea class="accountinginp"></textarea>'
			voucherallss += '<span class="accountingye">余额:200</span>'
			voucherallss += '<span class="accountingmx">明细账</span>'
			voucherallss += '</div>'
			voucherallss += '<div center class="money-jd moneyj">'
			voucherallss += '<input type="text" class="money-sr" />'
			voucherallss += '<div class="money-xs"></div>'
			voucherallss += '</div>'
			voucherallss += '<div center class="money-jd moneyd">'
			voucherallss += '<input type="text" class="money-sr" />'
			voucherallss += '<div class="money-xs"></div>'
			voucherallss += '</div>'
			voucherallss += '<div class="voudeletediv"><div class="voudelete"><span class="glyphicon icon-close"></span></div></div>'
			voucherallss += '</div>'
			voucherallss += '<div class="voucherjians">'
			voucherallss += '<a href="javascript:" class="voucherjian icon-trash"></a>'
			voucherallss += '</div>'
			voucherallss += '</div>'
		}
		voucherallss += '</div>'
		voucherallss += '<div class="voucher-body voucher-footer">'
		voucherallss += '<div class="moneyhjcw">'
		voucherallss += '<div class="vouindexss"></div>'
		voucherallss += '<div class="heji">合计:<span class="hejihz"></span></div>'
		voucherallss += '<div center class="money-jd moneyj">'
		voucherallss += '<div class="money-xs"></div>'
		voucherallss += '</div>'
		voucherallss += '<div center class="money-jd moneyd">'
		voucherallss += '<div class="money-xs"></div>'
		voucherallss += '</div>'
		voucherallss += '</div>'
		voucherallss += '<div class="moneyhjys">'
		voucherallss += '<div class="hejihz"></div>'
		voucherallss += '<div center class="money-jd moneyj">'
		voucherallss += '<div class="money-xs"></div>'
		voucherallss += '</div>'
		voucherallss += '<div center class="money-jd moneyd">'
		voucherallss += '<div class="money-xs"></div>'
		voucherallss += '</div>'
		voucherallss += '</div>'
		voucherallss += '</div>'
		voucherallss += '</div>'
		$(".voudetail").html(voucherallss);
		$(".voucherall").height(523)
		
		$(".nowu").val("暂无信息");
		$(".voucher-history-zhankai").find("b").addClass("icon-angle-bottom").removeClass("icon-angle-top");
		$(".voucher-history-by").css("height", "0px");
		$(".voucher-history-by").html("");
		
	}
	newvueTypesetting()
}
//单条分录
function tr() {
	if(trisdata == undefined) {
		trisdata = 1
	}
	var iscw = 0;
	var isys = 0;
	var iscy = false;
	if(iscw > 0 && isys > 0) {
		iscy = true
	}
	var tr = '';
	if(vousinglepz == false && vousinglepzzy == false) {
		tr += '<div class="voucher-body voucher-center" op="0">'
		tr += '<div class="voucherjias">'
		tr += '<a href="javascript:" class="voucherjia"><span class="icon-open"></span></a>'
		tr += '<a href="javascript:" class="voucherjiass"></a>'
		tr += '</div>'
		tr += '<div class="abstract">'
		tr += '<textarea class="abstractinp"></textarea>'
		tr += '</div>'
		tr += '<div class="accounting">'
		tr += '<textarea class="accountinginp"></textarea>'
		tr += '<span class="accountingye">余额:200</span>'
		tr += '<span class="accountingmx">明细账</span>'
		tr += '<div class="fuyan"><span>辅</span></div>'
		tr += '</div>'
		tr += '<div center class="money-jd moneyj">'
		tr += '<input type="text" class="money-sr" />'
		tr += '<div class="money-xs"></div>'
		tr += '<div class="money-xsbg"></div>'
		tr += '</div>'
		tr += '<div center class="money-jd moneyd">'
		tr += '<input type="text" class="money-sr" />'
		tr += '<div class="money-xs"></div>'
		tr += '<div class="money-xsbg"></div>'
		tr += '</div>'
		tr += '<div class="voucherjians">'
		tr += '<a href="javascript:" class="voucherjian icon-trash"></a>'
		tr += '</div>'
		tr += '</div>'
	} else if(vousinglepz == true && trisdata == 1 && iscy) {
		tr += '<div class="voucher-body voucher-center voucher-center-cw" op="0">'
		tr += '<div class="voucherjias">'
		tr += '<a href="javascript:" class="voucherjia"><span class="icon-open"></span></a>'
		tr += '<a href="javascript:" class="voucherjiass"></a>'
		tr += '</div>'
		tr += '<div class="vouchertypebody">'
		tr += '<div class="vouchertypebodycw">财</div>'
		tr += '</div>'
		tr += '<div class="abstract">'
		tr += '<textarea class="abstractinp"></textarea>'
		tr += '</div>'
		tr += '<div class="accounting">'
		tr += '<textarea class="accountinginp"></textarea>'
		tr += '<span class="accountingye">余额:200</span>'
		tr += '<span class="accountingmx">明细账</span>'
		tr += '<div class="fuyan"><span>辅</span></div>'
		tr += '</div>'
		tr += '<div center class="money-jd moneyj">'
		tr += '<input type="text" class="money-sr" />'
		tr += '<div class="money-xs"></div>'
		tr += '</div>'
		tr += '<div center class="money-jd moneyd">'
		tr += '<input type="text" class="money-sr" />'
		tr += '<div class="money-xs"></div>'
		tr += '</div>'
		tr += '<div class="voucherjians">'
		tr += '<a href="javascript:" class="voucherjian icon-trash"></a>'
		tr += '</div>'
		tr += '</div>'
	}else if(vousinglepz == true && trisdata == 2 && iscy) {
		tr += '<div class="voucher-body voucher-center voucher-center-ys" op="0">'
		tr += '<div class="voucherjias">'
		tr += '<a href="javascript:" class="voucherjia"><span class="icon-open"></span></a>'
		tr += '<a href="javascript:" class="voucherjiass"></a>'
		tr += '</div>'
		tr += '<div class="vouchertypebody">'
		tr += '<div class="vouchertypebodyys">预</div>'
		tr += '</div>'
		tr += '<div class="abstract">'
		tr += '<textarea class="abstractinp"></textarea>'
		tr += '</div>'
		tr += '<div class="accounting">'
		tr += '<textarea class="accountinginp"></textarea>'
		tr += '<span class="accountingye">余额:200</span>'
		tr += '<span class="accountingmx">明细账</span>'
		tr += '<div class="fuyan"><span>辅</span></div>'
		tr += '</div>'
		tr += '<div center class="money-jd moneyj">'
		tr += '<input type="text" class="money-sr" />'
		tr += '<div class="money-xs"></div>'
		tr += '</div>'
		tr += '<div center class="money-jd moneyd">'
		tr += '<input type="text" class="money-sr" />'
		tr += '<div class="money-xs"></div>'
		tr += '</div>'
		tr += '<div class="voucherjians">'
		tr += '<a href="javascript:" class="voucherjian icon-trash"></a>'
		tr += '</div>'
		tr += '</div>'
	} else if(vousinglepz == true && iscy == false) {
		tr += '<div class="voucher-body voucher-center" op="0">'
		tr += '<div class="voucherjias">'
		tr += '<a href="javascript:" class="voucherjia"><span class="icon-open"></span></a>'
		tr += '<a href="javascript:" class="voucherjiass"></a>'
		tr += '</div>'
		tr += '<div class="vouchertypebody">'
		tr += '</div>'
		tr += '<div class="abstract">'
		tr += '<textarea class="abstractinp"></textarea>'
		tr += '</div>'
		tr += '<div class="accounting">'
		tr += '<textarea class="accountinginp"></textarea>'
		tr += '<span class="accountingye">余额:200</span>'
		tr += '<span class="accountingmx">明细账</span>'
		tr += '<div class="fuyan"><span>辅</span></div>'
		tr += '</div>'
		tr += '<div center class="money-jd moneyj">'
		tr += '<input type="text" class="money-sr" />'
		tr += '<div class="money-xs"></div>'
		tr += '</div>'
		tr += '<div center class="money-jd moneyd">'
		tr += '<input type="text" class="money-sr" />'
		tr += '<div class="money-xs"></div>'
		tr += '</div>'
		tr += '<div class="voucherjians">'
		tr += '<a href="javascript:" class="voucherjian icon-trash"></a>'
		tr += '</div>'
		tr += '</div>'
	} else if(vousinglepzzy == true && vousinglepz == false) {
		tr += '<div class="voucher-body voucher-center">'
		tr += '<div class="voucherjias">'
		tr += '<a href="javascript:" class="voucherjia"><span class="icon-open"></span></a>'
		tr += '<a href="javascript:" class="voucherjiass"><span class="icon-Addto_icon"></span></a>'
		tr += '</div>'
		tr += '<div class="voucher-centercw voucher-centerhalf">'
		tr += '<div class="voucherindex"></div>'
		tr += '<div class="abstract">'
		tr += '<textarea class="abstractinp"></textarea>'
		tr += '</div>'
		tr += '<div class="accounting">'
		tr += '<textarea class="accountinginp"></textarea>'
		tr += '<span class="accountingye">余额:200</span>'
		tr += '<span class="accountingmx">明细账</span>'
		tr += '</div>'
		tr += '<div center class="money-jd moneyj">'
		tr += '<input type="text" class="money-sr" />'
		tr += '<div class="money-xs"></div>'
		tr += '</div>'
		tr += '<div center class="money-jd moneyd">'
		tr += '<input type="text" class="money-sr" />'
		tr += '<div class="money-xs"></div>'
		tr += '</div>'
		tr += '<div class="voudeletediv"><div class="voudelete"><span class="glyphicon icon-close"></span></div></div>'
		tr += '</div>'
		tr += '<div class="voucher-centerys voucher-centerhalf">'
		tr += '<div class="abstract">'
		tr += '<textarea class="abstractinp"></textarea>'
		tr += '</div>'
		tr += '<div class="accounting">'
		tr += '<textarea class="accountinginp"></textarea>'
		tr += '<span class="accountingye">余额:200</span>'
		tr += '<span class="accountingmx">明细账</span>'
		tr += '</div>'
		tr += '<div center class="money-jd moneyj">'
		tr += '<input type="text" class="money-sr" />'
		tr += '<div class="money-xs"></div>'
		tr += '</div>'
		tr += '<div center class="money-jd moneyd">'
		tr += '<input type="text" class="money-sr" />'
		tr += '<div class="money-xs"></div>'
		tr += '</div>'
		tr += '<div class="voudeletediv"><div class="voudelete"><span class="glyphicon icon-close"></span></div></div>'
		tr += '</div>'
		tr += '<div class="voucherjians">'
		tr += '<a href="javascript:" class="voucherjian icon-trash"></a>'
		tr += '</div>'
		tr += '</div>'
	} 
	return tr;
}

function chapzTr(){
	var centerss = '';
	if(vousinglepz == false && vousinglepzzy == false) {
		if(selectdata.data.vouDetails.length >= 4) {
			var len = (selectdata.data.vouDetails.length - 4) * 50
			$(".voucherall").height(523 + len)
			for(var i = 0; i < selectdata.data.vouDetails.length; i++) {
				if($(".chaiwu").hasClass("xuanzhongcy")) {
					centerss += '<div class="voucher-body voucher-center voucher-center-cw">'
				} else {
					centerss += '<div class="voucher-body voucher-center voucher-center-ys">'
				}
				centerss += '<div class="voucherjias">'
				centerss += '<a href="javascript:" class="voucherjia"><span class="icon-open"></span></a>'
				centerss += '<a href="javascript:" class="voucherjiass"></a>'
				centerss += '</div>'
				centerss += '<div class="abstract">'
				centerss += '<textarea class="abstractinp"></textarea>'
				centerss += '</div>'
				centerss += '<div class="accounting">'
				centerss += '<textarea class="accountinginp"></textarea>'
				centerss += '<span class="accountingye">余额:200</span>'
				centerss += '<span class="accountingmx">明细账</span>'
				centerss += '<div class="fuyan"><span>辅</span></div>'
				centerss += '</div>'
				centerss += '<div center class="money-jd moneyj">'
				centerss += '<input type="text" class="money-sr" />'
				centerss += '<div class="money-xs"></div>'
				centerss += '<div class="money-xsbg"></div>'
				centerss += '</div>'
				centerss += '<div center class="money-jd moneyd">'
				centerss += '<input type="text" class="money-sr" />'
				centerss += '<div class="money-xs"></div>'
				centerss += '<div class="money-xsbg"></div>'
				centerss += '</div>'
				centerss += '<div class="voucherjians">'
				centerss += '<a href="javascript:" class="voucherjian icon-trash"></a>'
				centerss += '</div>'
				centerss += '</div>'
			}
		} else {
			$(".voucherall").height(523)
			for(var i = 0; i < 4; i++) {
				if($(".chaiwu").hasClass("xuanzhongcy")) {
					centerss += '<div class="voucher-body voucher-center voucher-center-cw">'
				} else {
					centerss += '<div class="voucher-body voucher-center voucher-center-ys">'
				}
				centerss += '<div class="voucherjias">'
				centerss += '<a href="javascript:" class="voucherjia"><span class="icon-open"></span></a>'
				centerss += '<a href="javascript:" class="voucherjiass"></a>'
				centerss += '</div>'
				centerss += '<div class="abstract">'
				centerss += '<textarea class="abstractinp"></textarea>'
				centerss += '</div>'
				centerss += '<div class="accounting">'
				centerss += '<textarea class="accountinginp"></textarea>'
				centerss += '<span class="accountingye">余额:200</span>'
				centerss += '<span class="accountingmx">明细账</span>'
				centerss += '<div class="fuyan"><span>辅</span></div>'
				centerss += '</div>'
				centerss += '<div center class="money-jd moneyj">'
				centerss += '<input type="text" class="money-sr" />'
				centerss += '<div class="money-xs"></div>'
				centerss += '<div class="money-xsbg"></div>'
				centerss += '</div>'
				centerss += '<div center class="money-jd moneyd">'
				centerss += '<input type="text" class="money-sr" />'
				centerss += '<div class="money-xs"></div>'
				centerss += '<div class="money-xsbg"></div>'
				centerss += '</div>'
				centerss += '<div class="voucherjians">'
				centerss += '<a href="javascript:" class="voucherjian icon-trash"></a>'
				centerss += '</div>'
				centerss += '</div>'
			}
		}
	} else if(vousinglepz == true && vousinglepzzy == false) {
		if(selectdata.data.vouDetails.length >= 6) {
			var len = (selectdata.data.vouDetails.length - 6) * 50
			$(".voucherall").height(623 + len)
			for(var k = 0; k < selectdata.data.vouDetails.length; k++) {
				if(selectdata.data.vouDetails[k].accaCode == '1') {
					centerss += '<div class="voucher-body voucher-center voucher-center-cw">'
				} else {
					centerss += '<div class="voucher-body voucher-center voucher-center-ys">'
				}
				centerss += '<div class="voucherjias">'
				centerss += '<a href="javascript:" class="voucherjia"><span class="icon-open"></span></a>'
				centerss += '<a href="javascript:" class="voucherjiass"></a>'
				centerss += '</div>'
				centerss += '<div class="vouchertypebody">'
				if(selectdata.data.vouDetails[k].accaCode == '1') {
					centerss += '<div class="vouchertypebodycw">财</div>'
				} else {
					centerss += '<div class="vouchertypebodyys">预</div>'
				}
				centerss += '</div>'
				centerss += '<div class="abstract">'
				centerss += '<textarea class="abstractinp"></textarea>'
				centerss += '</div>'
				centerss += '<div class="accounting">'
				centerss += '<textarea class="accountinginp"></textarea>'
				centerss += '<span class="accountingye">余额:200</span>'
				centerss += '<span class="accountingmx">明细账</span>'
				centerss += '<div class="fuyan"><span>辅</span></div>'
				centerss += '</div>'
				centerss += '<div center class="money-jd moneyj">'
				centerss += '<input type="text" class="money-sr" />'
				centerss += '<div class="money-xs"></div>'
				centerss += '</div>'
				centerss += '<div center class="money-jd moneyd">'
				centerss += '<input type="text" class="money-sr" />'
				centerss += '<div class="money-xs"></div>'
				centerss += '</div>'
				centerss += '<div class="voucherjians">'
				centerss += '<a href="javascript:" class="voucherjian icon-trash"></a>'
				centerss += '</div>'
				centerss += '</div>'
			}
		} else {
			$(".voucherall").height(623)
			for(var k = 0; k < 6; k++) {
				if(selectdata.data.vouDetails[k]!=undefined){
					if(selectdata.data.vouDetails[k].accaCode == '1') {
						centerss += '<div class="voucher-body voucher-center voucher-center-cw">'
					} else {
						centerss += '<div class="voucher-body voucher-center voucher-center-ys">'
					}
					centerss += '<div class="voucherjias">'
					centerss += '<a href="javascript:" class="voucherjia"><span class="icon-open"></span></a>'
					centerss += '<a href="javascript:" class="voucherjiass"></a>'
					centerss += '</div>'
					centerss += '<div class="vouchertypebody">'
					if(selectdata.data.vouDetails[k].accaCode == '1') {
						centerss += '<div class="vouchertypebodycw">财</div>'
					} else {
						centerss += '<div class="vouchertypebodyys">预</div>'
					}
					centerss += '</div>'
				}else{
					centerss += '<div class="voucher-body voucher-center">'
					centerss += '<div class="voucherjias">'
					centerss += '<a href="javascript:" class="voucherjia"><span class="icon-open"></span></a>'
					centerss += '<a href="javascript:" class="voucherjiass"></a>'
					centerss += '</div>'
					centerss += '<div class="vouchertypebody">'
					centerss += '</div>'
				}
				centerss += '<div class="abstract">'
				centerss += '<textarea class="abstractinp"></textarea>'
				centerss += '</div>'
				centerss += '<div class="accounting">'
				centerss += '<textarea class="accountinginp"></textarea>'
				centerss += '<span class="accountingye">余额:200</span>'
				centerss += '<span class="accountingmx">明细账</span>'
				centerss += '<div class="fuyan"><span>辅</span></div>'
				centerss += '</div>'
				centerss += '<div center class="money-jd moneyj">'
				centerss += '<input type="text" class="money-sr" />'
				centerss += '<div class="money-xs"></div>'
				centerss += '</div>'
				centerss += '<div center class="money-jd moneyd">'
				centerss += '<input type="text" class="money-sr" />'
				centerss += '<div class="money-xs"></div>'
				centerss += '</div>'
				centerss += '<div class="voucherjians">'
				centerss += '<a href="javascript:" class="voucherjian icon-trash"></a>'
				centerss += '</div>'
				centerss += '</div>'
			}
		}
	} else if(vousinglepz == false && vousinglepzzy == true) {
		var  lk = 4
		if($('.voudetail').height()>410){
			lk = 6
		}else if($('.voudetail').height()>360){
			lk = 5
		}
		if(selectdata.data.vouDetails.length/2 >= lk) {
			centerss += '<div class="voubodyscroll">'
			for(var k = 0; k < selectdata.data.vouDetails.length / 2; k++) {
				centerss += '<div class="voucher-body voucher-center">'
				centerss += '<div class="voucherjias">'
				centerss += '<a href="javascript:" class="voucherjia"><span class="icon-open"></span></a>'
				centerss += '<a href="javascript:" class="voucherjiass"><span class="icon-Addto_icon"></span></a>'
				centerss += '</div>'
				centerss += '<div class="voucher-centercw voucher-centerhalf">'
				centerss += '<div class="voucherindex"></div>'
				centerss += '<div class="abstract">'
				centerss += '<textarea class="abstractinp"></textarea>'
				centerss += '</div>'
				centerss += '<div class="accounting">'
				centerss += '<textarea class="accountinginp"></textarea>'
				centerss += '<span class="accountingye">余额:200</span>'
				centerss += '<span class="accountingmx">明细账</span>'
				centerss += '</div>'
				centerss += '<div center class="money-jd moneyj">'
				centerss += '<input type="text" class="money-sr" />'
				centerss += '<div class="money-xs"></div>'
				centerss += '</div>'
				centerss += '<div center class="money-jd moneyd">'
				centerss += '<input type="text" class="money-sr" />'
				centerss += '<div class="money-xs"></div>'
				centerss += '</div>'
				centerss += '<div class="voudeletediv"><div class="voudelete"><span class="glyphicon icon-close"></span></div></div>'
				centerss += '</div>'
				centerss += '<div class="voucher-centerys voucher-centerhalf">'
				centerss += '<div class="abstract">'
				centerss += '<textarea class="abstractinp"></textarea>'
				centerss += '</div>'
				centerss += '<div class="accounting">'
				centerss += '<textarea class="accountinginp"></textarea>'
				centerss += '<span class="accountingye">余额:200</span>'
				centerss += '<span class="accountingmx">明细账</span>'
				centerss += '</div>'
				centerss += '<div center class="money-jd moneyj">'
				centerss += '<input type="text" class="money-sr" />'
				centerss += '<div class="money-xs"></div>'
				centerss += '</div>'
				centerss += '<div center class="money-jd moneyd">'
				centerss += '<input type="text" class="money-sr" />'
				centerss += '<div class="money-xs"></div>'
				centerss += '</div>'
				centerss += '<div class="voudeletediv"><div class="voudelete"><span class="glyphicon icon-close"></span></div></div>'
				centerss += '</div>'
				centerss += '<div class="voucherjians">'
				centerss += '<a href="javascript:" class="voucherjian icon-trash"></a>'
				centerss += '</div>'
				centerss += '</div>'
			}
			centerss += '</div>'
		} else {
			centerss += '<div class="voubodyscroll">'
			for(var k = 0; k < lk; k++) {
				centerss += '<div class="voucher-body voucher-center">'
				centerss += '<div class="voucherjias">'
				centerss += '<a href="javascript:" class="voucherjia"><span class="icon-open"></span></a>'
				centerss += '<a href="javascript:" class="voucherjiass"><span class="icon-Addto_icon"></span></a>'
				centerss += '</div>'
				centerss += '<div class="voucher-centercw voucher-centerhalf">'
				centerss += '<div class="voucherindex"></div>'
				centerss += '<div class="abstract">'
				centerss += '<textarea class="abstractinp"></textarea>'
				centerss += '</div>'
				centerss += '<div class="accounting">'
				centerss += '<textarea class="accountinginp"></textarea>'
				centerss += '<span class="accountingye">余额:200</span>'
				centerss += '<span class="accountingmx">明细账</span>'
				centerss += '</div>'
				centerss += '<div center class="money-jd moneyj">'
				centerss += '<input type="text" class="money-sr" />'
				centerss += '<div class="money-xs"></div>'
				centerss += '</div>'
				centerss += '<div center class="money-jd moneyd">'
				centerss += '<input type="text" class="money-sr" />'
				centerss += '<div class="money-xs"></div>'
				centerss += '</div>'
				centerss += '<div class="voudeletediv"><div class="voudelete"><span class="glyphicon icon-close"></span></div></div>'
				centerss += '</div>'
				centerss += '<div class="voucher-centerys voucher-centerhalf">'
				centerss += '<div class="abstract">'
				centerss += '<textarea class="abstractinp"></textarea>'
				centerss += '</div>'
				centerss += '<div class="accounting">'
				centerss += '<textarea class="accountinginp"></textarea>'
				centerss += '<span class="accountingye">余额:200</span>'
				centerss += '<span class="accountingmx">明细账</span>'
				centerss += '</div>'
				centerss += '<div center class="money-jd moneyj">'
				centerss += '<input type="text" class="money-sr" />'
				centerss += '<div class="money-xs"></div>'
				centerss += '</div>'
				centerss += '<div center class="money-jd moneyd">'
				centerss += '<input type="text" class="money-sr" />'
				centerss += '<div class="money-xs"></div>'
				centerss += '</div>'
				centerss += '<div class="voudeletediv"><div class="voudelete"><span class="glyphicon icon-close"></span></div></div>'
				centerss += '</div>'
				centerss += '<div class="voucherjians">'
				centerss += '<a href="javascript:" class="voucherjian icon-trash"></a>'
				centerss += '</div>'
				centerss += '</div>'
			}
			centerss += '</div>'
		}
	}
	return centerss
}
//辅助核算项
function fzhspzpj(fzhscf){
	//获取点击内容的name值
	var ss = fzhscf.attr("name");
	//遍历循环,根据name来查询最初加载过来的数据,寻找到其对应的辅助核算项的表头,并循环遍历到页面上
	var voucherycss = new Object();
	for(var d in tablehead) {
		var c = d.substring(0, d.length - 4)
		if(quanjuvoudatas.data[ss][c] == 1) {
			voucherycss[d] = tablehead[d];
		}
	}
	voucherycTitleData(ss)
	var voucheryc = ''
	var lengvouychead = ''
	var nowAccoCode = fzhscf.find(".ACCO_CODE").html();
	var accItemArr = voucherycss;
	//			if(voucherycss.length > 0) { //得到辅助项的存在，再进行排序。wangpl 2018.01.22
	voucherycss = resOrderAccItem(nowAccoCode, accItemArr);
	var noshowaccitem = showAccItem(nowAccoCode, accItemArr)
	//          }
	var isyic = false
	for(var i in voucherycss) {
		if(temporaryfzhs.length>0){
			if(temporaryfzhs[0][i]!=undefined){
				isyic=true
			}
		}else if(temporaryfzhsprev.length>0){
			if(temporaryfzhsprev[0][i]!=undefined){
				isyic=true
			}
		}
		var l = i
		if($('#AssDataAll').find('.'+l).length<1){
			var assnoll = ''
			if(fzhsxl[l].length>100){
				var nowlen = 0
				assnoll += '<ul isAlllength="now" class="ycbodys '+l+'">'
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
		if(voucherycss[i].value != undefined && voucherycss[i].value != '') {
			lengvouychead += '<div class="ychead"  name="' + i + '"  mrvalue = ' + voucherycss[i].value + '>' + voucherycss[i].ELE_NAME + '</div>'
		} else {
			lengvouychead += '<div class="ychead"  name="' + i + '">' + voucherycss[i].ELE_NAME + '</div>'
		}
		if(voucherycss[i]["ELE_CODE"] == "CURRENT" && isbussDate){
			lengvouychead += '<div class="ychead"   name="bussDate"  mrvalue = "">往来日期</div>'
		}
	}
	if(quanjuvoudatas.data[ss].expireDate == 1) {
		if(temporaryfzhs.length>0){
			if(temporaryfzhs[0]['expireDate']!=undefined){
				isyic=true
			}
		}else if(temporaryfzhsprev.length>0){
			if(temporaryfzhsprev[0]['expireDate']!=undefined){
				isyic=true
			}
		}
		lengvouychead += '<div class="ychead" name="expireDate">到期日</div>'
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
		if(temporaryfzhs.length>0){
			if(temporaryfzhs[0]['billNo']!=undefined){
				isyic=true
			}
		}else if(temporaryfzhsprev.length>0){
			if(temporaryfzhsprev[0]['billNo']!=undefined){
				isyic=true
			}
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
			if(isaddAssbtn==true){
				assnoll += '<div class="fzhsadd" tzurl = "billtype">+新增票据类型</div>'
			}
			assnoll += '</ul>'
			$('#AssDataAll').append(assnoll)
		}
		lengvouychead += '<div class="ychead" name="billNo">票据号</div>'
		lengvouychead += '<div class="ychead" name="billType">票据类型</div>'
		lengvouychead += '<div class="ychead" name="billDate">票据日期</div>'
	}
	if(quanjuvoudatas.data[ss].currency == 1) {
		ufma.ajaxDef('/gl/eleCurrRate/getCurrType', "get", {
			"agencyCode": rpt.nowAgencyCode
		}, function(result) {
			curCodefzhsxl = result.data
		})
		if(temporaryfzhs.length>0){
			if(temporaryfzhs[0]['curCode']!=undefined){
				isyic=true
			}
		}else if(temporaryfzhsprev.length>0){
			if(temporaryfzhsprev[0]['curCode']!=undefined){
				isyic=true
			}
		}
		if($('#AssDataAll').find('.currency').length<1){
			var assnoll = ''
			assnoll += '<ul class="ycbodys currency">'
			for(var n = 0; n < curCodefzhsxl.length; n++) {
				if(curCodefzhsxl[n].eleRateList.length>0){
					if(curexratefzhsxl["i"+n]==undefined){
						curexratefzhsxl["i"+n]=curCodefzhsxl[n].eleRateList[0].direRate
					}
					assnoll += '<li rateDigits ="' + curCodefzhsxl[n].rateDigits+'" exrate = "i'+n+'" levels = "' + curCodefzhsxl[n].levelNum + '" fname="' + curCodefzhsxl[n].chrName + '" class="PopListBoxItem unselected dianji' + curCodefzhsxl[n].isLeaf + ' fzlv' + curCodefzhsxl[n].levelNum + '"><p><span class="code">' + curCodefzhsxl[n].chrCode + '</span>  <span class="name">' + curCodefzhsxl[n].chrName + '</span></p></li>'
				}else{
					assnoll += '<li rateDigits ="' + curCodefzhsxl[n].rateDigits+'" exrate = "" levels = "' + curCodefzhsxl[n].levelNum + '" fname="' + curCodefzhsxl[n].chrName + '" class="PopListBoxItem unselected dianji' + curCodefzhsxl[n].isLeaf + ' fzlv' + curCodefzhsxl[n].levelNum + '"><p><span class="code">' + curCodefzhsxl[n].chrCode + '</span>  <span class="name">' + curCodefzhsxl[n].chrName + '</span></p></li>'
				}
			}
			assnoll += '</ul>'
			$('#AssDataAll').append(assnoll)
		}
		lengvouychead += '<div class="ychead" name="curCode">币种</div>'
		lengvouychead += '<div class="ychead" name="exRate">汇率</div>'
		lengvouychead += '<div class="ychead" name="currAmt">外币金额</div>'
	}
	if(quanjuvoudatas.data[ss].qty == 1) {
		if(temporaryfzhs.length>0){
			if(temporaryfzhs[0]['price']!=undefined){
				isyic=true
			}
		}else if(temporaryfzhsprev.length>0){
			if(temporaryfzhsprev[0]['price']!=undefined){
				isyic=true
			}
		}
		lengvouychead += '<div class="ychead" name="price">单价</div>'
		lengvouychead += '<div class="ychead" name="qty">数量</div>'
	}
	lengvouychead += '<div class="ychead noshowdata" noshow=' + noshowaccitem + '>金额</div>'
	var lengvouyc = ''
	var fzbolen = 1
	if(temporaryfzhs.length>0 && isyic && isHistoryfzhs){
		fzbolen = temporaryfzhs.length
	}else if(temporaryfzhsprev.length>0 && isyic && isHistoryfzhs){
		fzbolen = temporaryfzhsprev.length
	}
	for(var i = 0; i < fzbolen; i++) {
		lengvouyc += '<div class="voucher-yc-bo" op="0" inde ="0">'
		for(var l in voucherycss) {
			lengvouyc += '<div  class="ycbody">'
			lengvouyc += '<textarea relation = "'+l+'" class="ycbodyinp"></textarea>'
			lengvouyc += '</div>'
			if(voucherycss[l]["ELE_CODE"] == "CURRENT" && isbussDate){
				lengvouyc += '<div  class="ycbody">'
				lengvouyc += '<input type="text"  value="'+$("#dates").getObj().getValue()+'" class="ycbodyinp bussDate"  />'
				lengvouyc += '</div>'
			}
		}
		if(quanjuvoudatas.data[ss].expireDate == 1) {
			lengvouyc += '<div  class="ycbody">'
			lengvouyc += '<input type="text" class="ycbodyinp daoqiri"  />'
			lengvouyc += '</div>'
		}
		if(quanjuvoudatas.data[ss].showBill == 1) {
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

		
		if(quanjuvoudatas.data[ss].currency == 1) {
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
		if(quanjuvoudatas.data[ss].qty == 1) {
			lengvouyc += '<div  class="ycbody">'
			lengvouyc += '<input type="text" class="ycbodyinp priceinp"  />'
			lengvouyc += '</div>'
			lengvouyc += '<div  class="ycbody">'
			lengvouyc += '<input type="text" class="ycbodyinp qtyinp"  qty="'+quanjuvoudatas.data[ss].qtyDigits+'" />'
			lengvouyc += '</div>'
		}
		lengvouyc += '<input type="text" class="ycbody yctz" />'
		lengvouyc += '</div>'
	}
//	lengvouyc += '</div>'
//	voucheryc += '<div class="voucher-close"><span class="glyphicon icon-close"> </span></div>'
//	voucheryc += '<div class="voucher-yc-addbtns">'
//	for(var i = 0; i < fzbolen; i++) {
//		voucheryc += '<div class="ycadddiv"  inde = "'+fzbolen+'"><img src="img/jia.png" class="ycadd"></div>'
//	}
//	voucheryc += '</div>'
//	voucheryc += '<div class="voucher-yc-bg">'
//	voucheryc += '<div class="voucher-yc-bt">'
//	voucheryc+=lengvouyc
//	voucheryc += '<div class="voucher-yc-deletebtns">'
//	for(var i = 0; i < fzbolen; i++) {
//		voucheryc += '<div class="ycdeldiv"  inde = "'+fzbolen+'"><span class="ycdelect icon-trash"></span></div>'
//	}
//	voucheryc += '</div>'
	
	voucheryc += '<div class="voucher-yc-bt-gudinbg">'
	voucheryc += '<div class="voucher-yc-bt-gudin" dataIndex = '+ss+'>'
	voucheryc += lengvouychead
	voucheryc += '</div>'
	voucheryc += '</div>'
	voucheryc += '<div class="voucher-bgallscroll">'
	voucheryc += '<div class="voucher-bgall">'
	voucheryc += '<div class="voucher-yc-addbtns" style="position: relative;">'
	for(var i = 0; i < fzbolen; i++) {
		voucheryc += '<div class="ycadddiv" inde="1"><img src="img/jia.png" class="ycadd" style="visibility: hidden;"></div>'
	}
	voucheryc += '</div>'
	voucheryc += '<div class="voucher-yc-bg">'
	voucheryc += '<div class="voucher-yc-bt">'
	voucheryc += lengvouychead
	voucheryc += '</div>'
	voucheryc += lengvouyc
	voucheryc += '</div>'
	voucheryc += '<div class="voucher-yc-deletebtns" style="position: relative;">'
	for(var i = 0; i < fzbolen; i++) {
		voucheryc += '<div class="ycdeldiv" inde="1"><span class="ycdelect icon-trash" style="visibility: hidden;"></span></div>'
	}
	voucheryc += '</div>'
	voucheryc += '</div>'
	voucheryc += '</div>'
	return voucheryc
}
function setfzhsxl(fzdata,pasyc){
	var nowAccoCode = pasyc.parents('.voucher-center').find('.accountinginp').attr('code');
	var voucherycss = new Object();
	var ss = $(".voucher-hover").find(".accountinginp").attr("accoindex");
	if($(".voucher-hover").hasClass("voucher-hovercw")){
		ss = $(".voucher-hover").find('.voucher-centercw').find(".accountinginp").attr("accoindex");
	}else if($(".voucher-hover").hasClass("voucher-hoverys")){
		ss = $(".voucher-hover").find('.voucher-centerys').find(".accountinginp").attr("accoindex");
	}
	for(var d in tablehead) {
		var c = d.substring(0, d.length - 4)
		if(quanjuvoudatas.data[ss][c] == 1) {
			voucherycss[d] = tablehead[d];
		}
	}
	var accItemArr = voucherycss;
	voucherycss = resOrderAccItem(nowAccoCode, accItemArr);
	for(var k = 0; k < fzdata.length; k++) {
		pasyc.find(".voucher-yc-bo").eq(k).find(".yctz").val(formatNum(parseFloat(fzdata[k].stadAmt).toFixed(2))).trigger('blur')
		for(var r = 0; r < pasyc.find(".voucher-yc-bo").eq(k).find(".ycbodyinp").length; r++) {
			var relation  =pasyc.find(".voucher-yc-bo").eq(k).find(".ycbodyinp").eq(r).attr('relation')
			var $li = $('#AssDataAll').find("."+relation).find("li");
			if(pasyc.find(".voucher-yc-bt").find(".ychead").eq(r).attr("name") == "expireDate") {
				pasyc.find(".voucher-yc-bo").eq(k).find(".ycbodyinp").eq(r).val(fzdata[k].expireDate);
			}else if(pasyc.find(".voucher-yc-bt").find(".ychead").eq(r).attr("name") == "billNo") {
				pasyc.find(".voucher-yc-bo").eq(k).find(".ycbodyinp").eq(r).val(fzdata[k].billNo);
			}else if(pasyc.find(".voucher-yc-bt").find(".ychead").eq(r).attr("name") == "billDate") {
				pasyc.find(".voucher-yc-bo").eq(k).find(".ycbodyinp").eq(r).val(fzdata[k].billDate);
			}else if(pasyc.find(".voucher-yc-bt").find(".ychead").eq(r).attr("name") == "billType") {
				for(var s = 0; s < $li.length; s++) {
					if($li.eq(s).find(".code").text() == fzdata[k].billType) {
						$li.eq(s).removeClass("unselected").addClass("selected");
						var fzxlnrcode = $li.eq(s).find(".code").text();
						var fzxlnrname = $li.eq(s).find(".name").text();
						pasyc.find(".voucher-yc-bo").eq(k).find(".ycbodyinp").eq(r).val(fzxlnrcode + " " + fzxlnrname).attr('code',fzxlnrcode)
					}
				}
			}else if(pasyc.find(".voucher-yc-bt").find(".ychead").eq(r).attr("name") == "curCode") {
				for(var s = 0; s < $li.length; s++) {
					if($li.eq(s).find(".code").text() == fzdata[k].curCode) {
						$li.eq(s).removeClass("unselected").addClass("selected");
						var fzxlnrcode = $li.eq(s).find(".code").text();
						var fzxlnrname = $li.eq(s).find(".name").text();
						var exrate = $li.eq(s).attr('exrate')
						var rateDigits = $li.eq(s).attr('rateDigits')
						pasyc.find(".voucher-yc-bo").eq(k).find(".ycbodyinp").eq(r).val(fzxlnrcode + " " + fzxlnrname)
						pasyc.find(".voucher-yc-bo").eq(k).find(".exrateinp").attr('exrate', exrate).attr('rateDigits', rateDigits)
					}
				}
			}else{
				for(var l in voucherycss) {
					for(var n = 0; n < fzhsxl[l].length; n++) {
						var name = pasyc.find(".ychead").eq(r).attr("name");
						if(fzdata[k][name] == fzhsxl[l][n].code && l == name) {
							var fzxlnrcode = fzhsxl[l][n].code;
							var fzxlnrname = ''
							if(isaccfullname) {
								fzxlnrname = fzhsxl[l][n].chrFullname;
							} else {
								fzxlnrname = fzhsxl[l][n].name
							}
							pasyc.find(".voucher-yc-bo").eq(k).find(".ycbodyinp").eq(r).val(fzxlnrcode + " " + fzxlnrname).attr('code',fzxlnrcode)
							break;
						}
					}
				}
			}
		}
	}
}
