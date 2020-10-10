;
var pfData = ufma.getCommonData();
var rpt = {};
//用于存储打开的模态框
rpt.setQuery;
rpt.namespace = "#" + $(".rptType").data("name");
rpt.accListHtml = $(".rpt-query-box-center").html();
var voutypeacca = '';
var vousinglepz = false;
var itemName = [];
//是否加载完毕
rpt.journalLoaded = false;
rpt.nowDate = pfData.svTransDate; //当前年月日
rpt.module = "gl"; //模块代码
rpt.compoCode = "rpt"; //部件代码
rpt.rgCode = pfData.svRgCode; //区划代码

rpt.bennian = pfData.svSetYear; //本年 年度
rpt.benqi = pfData.svFiscalPeriod; //本期 月份
rpt.today = pfData.svTransDate; //今日 年月日

//账表所用接口
rpt.portList = {
	agencyList: "/gl/eleAgency/getAgencyTree", //单位列表接口
	acctList: "/gl/eleCoacc/getRptAccts", //账套列表接口
	accaList: "/gl/eleAcca/getRptAccas", //会计体系列表接口
	tipsList: "/gl/accTips/getTips", //推荐项列表接口
	optList: "/gl/rpt/prj/getOptList", //查询条件其他选项列表接口
	accoTree: "/gl/sys/coaAcc/getRptAccoTree", //会计科目树（账套级）接口
	accItemTree: "/gl/common/glAccItemData/getAccItemTree", //辅助项资料树（单位级）接口
	savePrj: "/gl/rpt/prj/savePrj", //保存查询方案
	prjContent: "/gl/rpt/prj/getPrjcontent", //查询方案内容接口
	deletePrj: "/gl/rpt/prj/deletePrj", //删除查询方案
	billType: "/gl/elecommon/getEleCommonTree", //票据类型
	getVoutype: "/gl/eleVouType/getVouType/", //请求凭证字号
	rptAccItemTypeList: "/gl/EleAccItem/getRptAccItemTypePost" //辅助项类别列表接口包括科目
};
rpt.nowSetYear = pfData.svSetYear; //当前年份
//修改权限  将svUserCode改为 svUserId  20181012
rpt.nowUserId = pfData.svUserId; //登录用户ID
// rpt.nowUserId = pfData.svUserCode; //登录用户ID
rpt.nowUserName = pfData.svUserName; //登录用户名称
rpt.nowAgencyCode = pfData.svAgencyCode; //登录单位代码
rpt.nowAgencyName = pfData.svAgencyName; //登录单位名称
rpt.nowAcctCode = pfData.svAcctCode; //账套代码
rpt.nowAcctName = pfData.svAcctName; //账套名称
rpt.rptType = $(".rptType").val(); //账表类型

//储存页面已存在session的key
rpt.sessionKeyArr = [];
//获得节点下面的所有子节点
rpt.getAllChildrenNodes = function(treeNode, result) {
	if(treeNode.isParent) {
		var childrenNodes = treeNode.children;
		if(childrenNodes) {
			for(var i = 0; i < childrenNodes.length; i++) {
				result += "," + (childrenNodes[i].id);
				result = rpt.getAllChildrenNodes(childrenNodes[i], result);
			}
		}
	}
	return result;
};
//判断更多查询方案按钮是否显示
rpt.moreMethodBtn = function(ulDom, moreDom) {
	var len = 0;
	$("." + ulDom).find("li").each(function(i) {
		var liW = $(this).css("width");
		var liLen = parseInt(liW.substring(0, liW.indexOf("p")));
		len += parseInt(liLen + 8);
	})
	if(len < ($(".rpt-method-box").width() - 126)) {
		$("." + moreDom).hide();
	} else {
		$("." + moreDom).show();
	}
};
//单选按钮组
rpt.raidoBtnGroup = function(btnGroupClass) {
	$(rpt.namespace).find("." + btnGroupClass).on("click", "button", function() {
		$(this).addClass("btn-primary").removeClass("btn-default");
		$(this).siblings("button").removeClass("btn-primary").addClass("btn-default");
	})
};
//单选radio组
rpt.raidoInputGroup = function(labelClass) {
	$(rpt.namespace).find("." + labelClass).on("click", function() {
		$(this).find("input").attr("checked", true);
		$(this).siblings().find("input").removeAttr("checked");
	})
};
//选择树形展示的radio组
rpt.raidoTreeShow = function() {
	$(rpt.namespace).find(".rpt-query-box-center .rpt-query-box-li").each(function(i) {
		var $combox = $("#accList" + (i + 1));
		$(this).on("click", ".rpt-query-li-action [type='radio']", function(e) {
			e.stopPropagation();
			if(!$(this).hasClass("radioSelected")) {
				$(this).addClass("radioSelected").parent().siblings().find("[type='radio']").removeClass("radioSelected");
				var itemCode = $combox.getObj().getValue();
				var radioType = $(this).val();
				var $li = $(this).parents(".rpt-query-box-li")
				var that = $li.find(".rpt-tree-view");
				that.html(
					'<p class="rpt-p-search-key">' +
					'<input type="text" readonly id="' + itemCode + '-data-key">' +
					'<span class="search-btn icon icon-writeoff"></span>' +
					'</p>'
				);
				$li.find(".rpt-tree-data").html('<ul id="' + itemCode + '-data" class="ufmaTree ztree"></ul>');
				$(this).parents(".rpt-query-li-action").find("input[type='hidden']").val(radioType);
				var treeKey = ufma.sessionKey(rpt.module, rpt.compoCode, rpt.rgCode, rpt.nowSetYear, rpt.nowAgencyCode, rpt.nowAcctCode, rpt.namespace + itemCode);
				var treeStr = sessionStorage.removeItem(treeKey);
			}
		})
	})
};
//返回本期时间
rpt.dateBenQi = function(startId, endId) {
	var ddYear = rpt.bennian;
	var ddMonth = rpt.benqi - 1;
	var tdd = new Date(ddYear, ddMonth + 1, 0)
	var ddDay = tdd.getDate();
	$("#" + startId).getObj().setValue(new Date(ddYear, ddMonth, 1));
	$("#" + endId).getObj().setValue(new Date(ddYear, ddMonth, ddDay));
};
//返回本年时间
rpt.dateBenNian = function(startId, endId) {
	var ddYear = rpt.bennian;
	$("#" + startId).getObj().setValue(new Date(ddYear, 0, 1));
	$("#" + endId).getObj().setValue(new Date(ddYear, 11, 31));
};
//返回今日时间
rpt.dateToday = function(startId, endId) {
	$("#" + startId + ",#" + endId).getObj().setValue(new Date(rpt.today));
};
//判断li-over和计数是否显示
rpt.selectTip = function(ulDom, numDom) {
	var len = 0;
	$(ulDom).find("li").not(".rpt-li-over").each(function(i) {
		var width = $(this).find("span").width() + 30;
		len += parseInt(width + 4)
		if(len < 213) {
			len = len + 4;
			$(this).show();
			$(ulDom).css("width", len + "px");
			$(ulDom).siblings(".rpt-p-search-key").css("width", (288 - len) + "px");
		} else {
			$(this).hide();
			$(ulDom).find("li:lt(i)").show();
			$(ulDom).find("li.rpt-li-over").show();
		}
	})
	var num = parseInt($(numDom).text());
	if(num > 0) {
		$(numDom).parent("div.rpt-tags-num").show();
	} else {
		$(numDom).parent("div.rpt-tags-num").hide();
	}
};
//构建树节点标签
rpt.createTags = function(treeId, type) {
	var mytree = $.fn.zTree.getZTreeObj(treeId);
	var firstNode = mytree.getNodes()[0];
	var nodeNamesArr = [];
	nodeNamesArr.push(firstNode.name);
	var NodesStr = [];
	if(firstNode.isParent) {
		var result = rpt.getAllChildrenNodes(firstNode, result);
		if(result != "" && result != undefined && result != null) {
			if(result.indexOf(",") != "-1") {
				NodesStr = result.split(",");
			} else {
				NodesStr.push(result);
			}
		}
	} else {
		NodesStr.push(firstNode.id);
	}
	var ulDom = $("#" + treeId).parent("div.rpt-tree-data").siblings("div.rpt-tree-view").find("ul.rpt-tags-list");
	$(ulDom).html('<li class="rpt-li-over" style="display: none;">...</li>');
	var liArr = [];
	$(ulDom).find("li").each(function() {
		liArr.push($(this).find("span").text());
	})
	var numDom = $(ulDom).siblings("div.rpt-tags-num").find("span");
	var num = 0;
	var checkNodes;
	if(rpt.rptType == "accDetailPay") {
		checkNodes = mytree.getCheckedNodes(true);
	}
	var allCheckNodes = [];
	for(var i = 0; i < checkNodes.length; i++) {
		if(rpt.rptType == "accDetailPay") {
			var halfCheck = checkNodes[i].getCheckStatus();
			var pnode = checkNodes[i].isParent;
			if(rpt.rptType == "accDetailPay") {
				if(!halfCheck.half) {
					allCheckNodes.push(checkNodes[i]);
				}
			}
		}
	}
	var len = 0;
	if(allCheckNodes.length > 0 && allCheckNodes.length < NodesStr.length) {
		for(var i = 0; i < allCheckNodes.length; i++) {
			if($.inArray(allCheckNodes[i].name, liArr) == "-1") {
				num++;
				var newLi = '<li><span data-code="' + allCheckNodes[i].id + '" title="' + allCheckNodes[i].name + '">' + allCheckNodes[i].name + '</span><b class="glyphicon icon-close"></b></li>';
				$(ulDom).find("li.rpt-li-over").before($(newLi));
				$(numDom).text(num);
				rpt.selectTip(ulDom, numDom);
			}
		}
	} else if(allCheckNodes.length == NodesStr.length) {
		num = allCheckNodes.length - 1;
		if(nodeNamesArr[0] != "全部") {
			num = allCheckNodes.length;
		} else {
			num = allCheckNodes.length - 1;
		}
		var newLi = '<li><span data-code="' + allCheckNodes[0].id + '" title="' + allCheckNodes[0].name + '">' + allCheckNodes[0].name + '</span><b class="glyphicon icon-close"></b></li>';
		len = ($(newLi).find("span").text().length * 14) + 34;
		$(ulDom).css("width", len + "px");
		$(ulDom).siblings(".rpt-p-search-key").css("width", (288 - len) + "px");
		$(ulDom).find("li.rpt-li-over").before($(newLi));
		$(numDom).text(num);
		$(numDom).parent("div.rpt-tags-num").show();
	} else {
		$(ulDom).find("li").hide();
		$(numDom).text(0);
		$(numDom).parent("div.rpt-tags-num").hide();
		$(ulDom).css("width", "0px");
		$(ulDom).siblings(".rpt-p-search-key").css("width", "288px");
	}
	$("#" + treeId).siblings("p").find("input").val("");
};
//下拉选择创建标签
rpt.selectTags = function(treeId, type) {
	var dom = treeId;
	var tree = type;
	//构建树节点标签
	rpt.createTags(treeId, type);
	//if(rpt.rptType == "accDetailPay") {}
};
//移除树节点标签
rpt.removeTags = function(dom, tree) {
	var ulDom = $(dom).parents("ul.rpt-tags-list");
	var treeId = $(dom).parents("div.rpt-query-li-selete").find("ul.ztree").attr("id");
	var liDom = $(dom).parent("li").remove();
	var domName = $(dom).siblings("span").text();
	var mytree = tree;
	var domNode = mytree.getNodeByParam("name", domName, null);
	var checkNodes = mytree.checkNode(domNode, false, true);
	$(ulDom).siblings(".rpt-p-search-key").find("input").val("").focus();
};
//删除select标签
rpt.deleteSelete = function(dom, tree) {
	var dom = dom;
	var tree = tree;
	//移除树节点标签
	rpt.removeTags(dom, tree);
	//if(rpt.rptType == "accDetailPay") {}
};
//返回创建下拉选择树
var ii = "00";
//返回需要需要显示辅助项的HTML
rpt.queryInputHtml = function(liArr) {
	var inputHtml = "";
	var tagHtml = "";
	var tipHtml = "";
	var liHtml = "";
	var liHtml0 = '<li class="rpt-query-box-li rpt-query-box-li0">' +
		'<label class="rpt-query-li-cont-title subjoin"><span title="<%=name%>" data-journal="<%=journal%>" data-statement="<%=statement%>" data-pos="<%=pos%>" data-dir="<%=dir%>" data-seq="<%=seq%>" data-code="<%=code%>" id="<%=code%>"><%=name%>：</span></label>' +
		'<div class="rpt-query-li-cont">' +
		'<div class="rpt-query-li-selete">' +
		'<div class="rpt-tree-view bordered-input">' +

		'<p class="rpt-p-search-key">' +
		'<input type="text" readonly id="<%=code%>-data-key">' +
		'<span class="search-btn icon icon-writeoff"></span>' +
		'</p>' +
		'</div>' +

		'</div>' +
		'<div class="rpt-query-li-tip">' +
		'<span class="rpt-query-li-tip-t">推荐：</span>' +
		'<span class="rpt-query-li-tip-c" id="<%=code%>Tips" data-item="<%=code%>">';

	var liHtml2 = '</span>' +
		'</div>' +
		'</div>' +
		'</li>';

	for(var i = 0; i < liArr.length; i++) {
		tagHtml = "";
		if(liArr[i].items.length > 0) {
			for(var j = 0; j < liArr[i].items.length; j++) {
				var th = ufma.htmFormat('<li><span data-code="<%=tagCode%>" title="<%=tagName%>"><%=tagName%></span><b class="glyphicon icon-close"></b></li>', {
					tagCode: liArr[i].items[j].code,
					tagName: liArr[i].items[j].name
				});
				tagHtml += th;
			}
		}
		tipHtml = "";
		if(liArr[i].tips != null && liArr[i].tips.length > 0) {
			for(var j = 0; j < liArr[i].tips.length; j++) {
				var ih = ufma.htmFormat('<i title="<%=tipName%>" data-code="<%=tipCode%>" ><%=tipName%></i>', {
					tipCode: liArr[i].tips[j].chrCode,
					tipName: liArr[i].tips[j].chrName
				});

				tipHtml += ih;
			}
		}
		liHtml = liHtml0 + tagHtml + liHtml1 + tipHtml + liHtml2;
		var bh = ufma.htmFormat(liHtml, {
			dir: liArr[i].itemDir,
			seq: liArr[i].seq,
			pos: liArr[i].itemPos,
			name: liArr[i].itemTypeName,
			code: liArr[i].itemType,
			num: liArr[i].items.length,
			journal: liArr[i].journal,
			statement: liArr[i].statement,
		});
		inputHtml += bh;
	}
	return inputHtml;
};
//返回当前选中的科目范围
rpt.checkItemTags = function(itemCode) {
	var tags = $("#" + itemCode + "-data-key").parent("p.rpt-p-search-key").siblings("ul.rpt-tags-list").find("li");
	var itemCodeRange = ""; //选中科目范围
	if(tags.length > 1) {
		for(var i = 0; i < tags.length - 1; i++) {
			itemCodeRange += "," + tags.eq(i).find("span").data("code");
		}
		itemCodeRange = itemCodeRange.substr(1);
	} else {
		itemCodeRange = "0";
	}
	return itemCodeRange;
};
//打开-保存查询方案模态框
rpt.openSaveMethodModal = function() {
	$(rpt.namespace).find('#saveMethod').on('click', function() {
		var meLi = $(rpt.namespace).find("#rptPlanList li.selected");
		if($(meLi).length > 0) {
			var code = $(meLi).attr("data-code");
			var name = $(meLi).attr("data-name");
			var scope = $(meLi).attr("data-scope"); //作用域
			$("#methodName").val(name).attr("data-code", code);
			var nn = parseInt(scope - 1);
			$(".rpt-radio-span").eq(nn).find("input").attr("checked", true);

		} else {
			$("#methodName").val("").attr("data-code", "");
			$(".rpt-radio-span").eq(0).find("input").attr("checked");
			$(".rpt-radio-span").eq(0).siblings().find("input").removeAttr("checked");
		}
		rpt.setQuery = ufma.showModal('saveMethod-box', 600, 320);
	});
	$(rpt.namespace).find('.btn-close').on('click', function() {
		rpt.setQuery.close();
	});
	document.onkeydown = function(e) {
		//捕捉回车事件
		var ev = (typeof event != 'undefined') ? window.event : e;
		if(ev.keyCode == 13) {
			return false;
		}
	}
};
//输入方案名的提示
rpt.methodNameTips = function() {
	$(rpt.namespace).find('#methodName').on('focus', function() {
		ufma.hideInputHelp('methodName');
		$('#methodName').closest('.form-group').removeClass('error');
	}).on("blur", function() {
		if($("#methodName").val().trim() == "") {
			ufma.showInputHelp('methodName', '<span class="error">方案名称不能为空</span>');
			$('#methodName').closest('.form-group').addClass('error');
		}
	});
};
//返回辅助项的数组对象
rpt.qryItemsArr = function() {
	var qryItemsArr = [];
	var accoItem = {
		itemType: "ACCO",
		itemTypeName: "会计科目",
		items: [],
		seq: 0,
		isShowItem: rpt.rptType == "GL_RPT_BAL" ? 1 : 0,
	}
	var _ipt = $('input[id="ACCO-data-key"]');
	if(_ipt.val() != '') {
		var accData = $.data(_ipt[0], 'data') || [];
		for(var i = 0; i < accData.length; i++) {
			var itemObj = {};
			//itemObj.code = accData[i].CHR_CODE;
			itemObj.code = accData[i].code; //多区划
			// itemObj.name = accData[i].codeName;
			itemObj.name = accData[i].codeName || accData[i].name;
			accoItem.items.push(itemObj);
		}
	}
	qryItemsArr.push(accoItem);
	var currentItem = {
		isGradsum: "0",
		isShowItem: "1",
		itemDir: "",
		itemLevel: "-1",
		itemPos: "condition",
		itemType: "CURRENT",
		itemTypeName: "往来单位:",
		items: [],
		seq: 1,
		isShowItem: rpt.rptType == "GL_RPT_BAL" ? 1 : 0,
	}
	var cbCurrentData = $('#cbCurrent').getObj().getItem(); //getItem获取code、codeName
	if(cbCurrentData && cbCurrentData != '') {
		var itemObj = {};
		itemObj.code = cbCurrentData.code;
		itemObj.name = cbCurrentData.codeName;
		currentItem.items.push(itemObj);
	}
	qryItemsArr.push(currentItem);
	$(rpt.namespace).find(".rpt-query-box-li0").each(function(i) {
		if(!$(this).hasClass("li-hide")) {
			var qryItemsObj = {};
			if(i == "0" && rpt.rptType == "GL_RPT_COLUMNAR") {
				qryItemsObj.itemDir = $(rpt.namespace + " .rpt-btn-switch .btn-primary").attr("data-code");
				qryItemsObj.itemPos = "row";
				qryItemsObj.itemType = $(rpt.namespace + " #selectTitle").val();
				qryItemsObj.itemTypeName = $(rpt.namespace + " #selectTitle").find("option:checked").text();
			} else {
				var spanDom = $(this).find(".rpt-query-li-cont-title span");
				qryItemsObj.itemDir = $(spanDom).data("dir") ? $(spanDom).data("dir") : ""; //展开方向(仅当位置为列时，有效);('dr','cr','dbl')
				qryItemsObj.itemPos = $(spanDom).data("pos") ? $(spanDom).data("pos") : ""; //核算项数据位置（行、列）
				qryItemsObj.itemTypeName = $(spanDom).text(); //核算项类别名称
				//汇总级次
				qryItemsObj.itemLevel = $(this).find(".rpt-query-li-action input[type='hidden']").val();
				//显示
			}
			qryItemsObj.seq = i + 1; //核算项类别顺序号
		}
	});
	return qryItemsArr;
};
//返回方案内容对象
rpt.prjContObj = function() {

	//方案内容
	prjContObj = {
		"accaCode": "*",
		"curCode": "",
		"rptStyle": "SANLAN",
		"rptTitleName": "",
		"accoType": "4",
		"rgCode": rpt.rgCode
	};
	//会计体系代码
	prjContObj.accaCode = $(rpt.namespace + " #accaList").find(".btn-primary").data("code");
	//选择的单位账套信息
	prjContObj.agencyAcctInfo = [];
	var acctInfoObj = {};
	acctInfoObj.acctCode = rpt.nowAcctCode; //账套代码
	acctInfoObj.agencyCode = rpt.nowAgencyCode; //单位代码
	prjContObj.agencyAcctInfo.push(acctInfoObj);
	var startDate = $("#dateStart").getObj().getValue();
	var startEnd = $("#dateEnd").getObj().getValue();
	var billType = $('#billType').getObj().getValue();
	var billNo = $('#billNo').val();
	var vouTypeCode = $('#vouTypeCode').val();
	var endCurDate = $("#endCurDate").getObj().getValue();
	var startVouNo = $('#startVouNo').val();
	var endVouNo = $('#endVouNo').val();
	var cbCurrent = $('#cbCurrent').getObj().getValue();
	var currentTypeSign = $('#hxType .selected').attr('value');
	var timeBring = $('#timeBring .selected').attr('id');
	if(rpt.rptType == "accDetailPay") {
		prjContObj.startDate = startDate; //起始日期(如2017-01-01)
		prjContObj.endDate = startEnd; //截止日期(如2017-01-01)
		prjContObj.startYear = ""; //起始年度(只有年，如2017)
		prjContObj.startFisperd = ""; //起始期间(只有月份，如7)
		prjContObj.endYear = ""; //截止年度(只有年，如2017)
		prjContObj.endFisperd = ""; //截止期间(只有月份，如7)
		prjContObj.billType = billType;
		prjContObj.billNo = billNo;
		prjContObj.vouTypeCode = vouTypeCode;
		prjContObj.endCurDate = endCurDate;
		prjContObj.startVouNo = startVouNo;
		prjContObj.endVouNo = endVouNo;
		prjContObj.cbCurrent = cbCurrent;
		prjContObj.timeBring = timeBring;
		prjContObj.currentTypeSign = currentTypeSign;
		prjContObj.rptOption = rpt.rptOptionArr(); //获取其他
	}
	//核算项设置
	prjContObj.qryItems = rpt.qryItemsArr();
	prjContObj.dataType = $("#colAction").attr("data-type");
	//查询条件对象
	prjContObj.rptCondItem = [];
	return prjContObj;
};
//返回账表其他选项的数组对象
rpt.rptOptionArr = function() {
	var rptOptionArr = [];
	var labelDom;
	labelDom = $('#pzCheck');
	$(labelDom).each(function() {
		var rptOptionObj = {};
		var flag = $(this).find("input").prop("checked");
		if(flag) {
			rptOptionObj.defCompoValue = "Y";
		} else {
			rptOptionObj.defCompoValue = "N";
		}
		rptOptionObj.optCode = $(this).find("input").attr("id");
		rptOptionObj.optName = $(this).text();
		rptOptionArr.push(rptOptionObj);
	})
	return rptOptionArr;
};
/**账表页面通用请求回调方法***********************************************************************/
//----------------------单位列表 start-------------------------//
//请求单位列表
rpt.reqAgencyList = function() {
	var arguAge = {
		"setYear": rpt.nowSetYear,
		"rgCode": pfData.svRgCode,
	}
	//ufma.get(rpt.portList.agencyList, "", function(result) {
	ufma.get(rpt.portList.agencyList, arguAge, function(result) {
		var data = result.data;
		rpt.cbAgency = $("#cbAgency").ufmaTreecombox2({
			data: result.data
		});
		var code = data[0].id;
		var name = data[0].name;
		var codeName = data[0].codeName;

		if(rpt.nowAgencyCode != "" && rpt.nowAgencyName != "") {
			var agency = $.inArrayJson(data, 'id', rpt.nowAgencyCode);
			if(agency != undefined) {
				rpt.cbAgency.val(rpt.nowAgencyCode);
			} else {
				rpt.cbAgency.val(code);
				rpt.nowAgencyCode = code;
				rpt.nowAgencyName = name;
			}
		} else {
			rpt.cbAgency.val(code);
			rpt.nowAgencyCode = rpt.cbAgency.getValue();
			rpt.nowAgencyName = rpt.cbAgency.getText();
		}
	});
};

//----------------------单位列表 end-----------------------------//

//----------------------账套列表 start---------------------------//
//请求账套列表
rpt.reqAcctList = function() {
	var acctArgu = {
		"agencyCode": rpt.nowAgencyCode,
		"userId": rpt.nowUserId,
		"setYear": rpt.nowSetYear
	};
	ufma.get(rpt.portList.acctList, acctArgu, function(result) {
		var data = result.data;
		rpt.cbAcct = $("#cbAcct").ufmaCombox2({
			data: data
		});

		if(data.length > 0) {
			/*var code = data[0].CHR_CODE;
			var name = data[0].CHR_NAME;
			var codeName = data[0].CODE_NAME;*/
			var code = data[0].code;
			var name = data[0].name;
			var codeName = data[0].codeName;

			if(rpt.nowAcctCode != "" && rpt.nowAcctName != "") {
				var flag = rpt.cbAcct.val(rpt.nowAcctCode);
				if(flag == "undefined") {
					rpt.cbAcct.val(rpt.nowAcctCode);
				} else if(flag == false) {
					rpt.cbAcct.setValue(code, codeName);
					rpt.nowAcctCode = code;
					rpt.nowAcctName = name;
				}
			} else {
				rpt.cbAcct.setValue(code, name);
				rpt.nowAcctCode = code;
				rpt.nowAcctName = name;
			}

		} else {
			ufma.showTip("该单位下面没有账套，请重新选择单位！", function() {}, "warning");
		}
	});
};
//请求凭证字号列表
rpt.reqVoutype = function(result) {
	if(voutypeacca == 1 && vousinglepz == false) {
		var reqUrl = rpt.portList.getVoutype + rpt.nowAgencyCode + "/" + rpt.nowSetYear + "/" + rpt.nowAcctCode + "/" + "1";
	} else {
		var reqUrl = rpt.portList.getVoutype + rpt.nowAgencyCode + "/" + rpt.nowSetYear + "/" + rpt.nowAcctCode + "/" + "*";
	}
	ufma.ajax(reqUrl, "get", "", function(result) {
		var data = result.data;

		var selectHtml = "";
		for(var i = 0; i < data.length; i++) {
			var sHtml = ufma.htmFormat('<option value="<%=code%>"><%=name%></option>', {
				/*code: data[i].CHR_CODE,
				name: data[i].CHR_NAME*/
				code: data[i].code, //多区划
				name: data[i].name //多区划
			});
			selectHtml += sHtml;
		}
		selectHtml = '<option value=""></option>' + selectHtml;
		$(rpt.namespace + " #vouTypeCode").html(selectHtml);
	});
};

//----------------------账套列表 end-----------------------------//
rpt.reqBillType = function() {
	var billTypeArgu = {
		agencyCode: rpt.nowAgencyCode,
		setYear: pfData.svSetYear,
		rgCode: pfData.svRgCode,
		eleCode: "BILLTYPE"
	};
	dm.commonApi(billTypeArgu, function(result) {
		$('#billType').getObj().load(result.data);
	});
};
//请求往来单位
rpt.reqCbCurrent = function() {
	var cbCurrentArgu = {
		agencyCode: rpt.nowAgencyCode,
		setYear: pfData.svSetYear,
		rgCode: pfData.svRgCode,
		eleCode: "CURRENT"
	};
	dm.commonApi(cbCurrentArgu, function(result) {
		$('#cbCurrent').getObj().load(result.data);
	});
};
//切换单位或账套是清空查询条件
rpt.changeAgenOrAcct = function() {
	var ddYear = rpt.bennian;
	$('#billType').getObj().setValue("");
	$('#cbCurrent').getObj().setValue("");
	$('#billNo').val("");
	$('#vouTypeCode').val("");
	$("#endCurDate").getObj().setValue(new(Date));
	$("#dateStart").getObj().setValue(new(Date));
	$("#dateEnd").getObj().setValue(new(Date));
	$('#startVouNo').val("");
	$('#endVouNo').val("");
	$('#whxType,#yhxType').removeClass('selected');
	$('#allType').addClass('selected');
	$('#dateBn').addClass('selected').siblings().removeClass('selected');
	$("#dateStart").getObj().setValue(new Date(ddYear, 0, 1));
	$("#dateEnd").getObj().setValue(new Date(ddYear, 11, 31));
	$("#pzCheck input:checkbox").prop("checked", "checked");
	//$('#queryAcco input').val("全部");
}
//初始化单位选择样式及change事件
rpt.initAgencyList = function() {
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
			//缓存单位账套
			var params = {
				selAgecncyCode: data.id,
				selAgecncyName: data.name,
			}
			ufma.setSelectedVar(params);
			if(rpt.sessionKeyArr.length > 0) {
				for(var i = 0; i < rpt.sessionKeyArr.length; i++) {
					sessionStorage.removeItem(rpt.sessionKeyArr[i]);
				}
			}
			$("div.rpt-tree-data").hide();
			//请求账套列表
			rpt.reqAcctList();
			rpt.changeAgenOrAcct();
		}
	});
};
//初始化账套选择样式及change事件
rpt.initAcctList = function() {
	rpt.cbAcct = $("#cbAcct").ufmaCombox2({
		/*valueField: 'CHR_CODE',
		textField: 'CODE_NAME',*/
		valueField: 'code', //多区划
		textField: 'codeName', //多区划
		readOnly: false,
		placeholder: '请选择账套',
		icon: 'icon-book',
		onchange: function(data) {
			//给全局账套变量赋值
			/*rpt.nowAcctCode = data.CHR_CODE;
			rpt.nowAcctName = data.CHR_NAME;*/
			rpt.nowAcctCode = data.code; //多区划
			rpt.nowAcctName = data.codeName; //多区划
			//缓存单位账套
			var params = {
				selAgecncyCode: rpt.cbAgency.getValue(),
				selAgecncyName: rpt.cbAgency.getText(),
				selAcctCode: data.code,
				selAcctName: data.name
			}
			ufma.setSelectedVar(params);
			if(data.IS_PARALLEL == 1) {
				vouisParallel = true
			} else {
				vouisParallel = false
			}
			if(data.IS_PARALLEL == '1' && data.IS_DOUBLE_VOU == '1') {
				voutypeacca = 1
				vousinglepz = false
			} else if(data.IS_PARALLEL == '1' && data.IS_DOUBLE_VOU == '0') {
				voutypeacca = 1
				vousinglepz = true
			} else if(data.IS_PARALLEL == '0') {
				voutypeacca = 0
				vousinglepz = false
			}
			if(rpt.sessionKeyArr.length > 0) {
				for(var i = 0; i < rpt.sessionKeyArr.length; i++) {
					sessionStorage.removeItem(rpt.sessionKeyArr[i]);
				}
			}
			$("div.rpt-tree-data").hide();
			rpt.reqAccList();
			//请求共享方案列表
			rpt.reqSharePrjList();
			/*//重构begin
			dm.showPlan({
				"agencyCode": dm.svAcctCode,
				"acctCode": dm.svAcctCode,
				"rptType": rpt.rptType,
				"userId": dm.svUserId, //修改权限  将svUserCode改为 svUserId  20181012
				"setYear": dm.svSetYear
			});
			//重构end*/
			//请求会计体系列表
			rpt.reqAccaList();
			rpt.reqBillType();
			rpt.reqCbCurrent();
			rpt.reqVoutype();
			rpt.initQueryAcco();
			rpt.changeAgenOrAcct();
			// $('#btnQuery').trigger('click');
			//CWYXM-18112【20200630 财务云8.30.10】账务处理模块：应付明细账初始化进来没有传值会计科目来查询 改到会计科目赋值后查询 20200805 guohx
		}
	});
};
rpt.initQueryAcco = function() {
	var params = {
		"acctCode": rpt.nowAcctCode,
		"agencyCode": rpt.nowAgencyCode,
		"setYear": rpt.nowSetYear,
		"userId": rpt.nowUserId,
		"eleCode": 'ACCO',
		"accoType": "4"
	}
	ufma.get('/gl/common/glAccItemData/getAccItemTree', params, function(result) {
		if(result.data.length > 0) {
			var firstItem = result.data[0];
			var _ipt = $('input[id="ACCO-data-key"]');
			_ipt.val(firstItem.codeName);
			$.data(_ipt[0], 'data', [firstItem]);	
		}
		$('#btnQuery').trigger('click');
	});
};
rpt.initBillType = function() {
	rpt.billType = $("#billType").ufTreecombox({
		idField: "code",
		textField: "codeName",
		pIdField: 'pCode', //可选
		readonly: false,
		placeholder: '请选择票据类型',
		leafRequire: false,
		onChange: function(data) {}
	});
};
rpt.initCbCurrent = function() {
	rpt.cbCurrent = $("#cbCurrent").ufTreecombox({
		idField: 'code',
		textField: 'codeName',
		pIdField: 'pCode', //可选
		readonly: false,
		placeholder: '请选择往来方',
		leafRequire: false,
		onChange: function(data) {}
	});
};
//填充五个辅助下拉列表
rpt.reqAccList = function() {
	var url = rpt.portList.rptAccItemTypeList + '?acctCode='+rpt.nowAcctCode+'&agencyCode='+rpt.nowAgencyCode+'&setYear='+rpt.nowSetYear+'&userId='+rpt.nowUserId;
	ufma.ajax(url, "POST", [], function(result) {
		var listItem = result.data;

		var newArr = [{
			"accItemCode": "",
			"accItemName": "请选择"
		}];
		for(var i = 0; i < listItem.length; i++) {
			if(listItem[i].accItemCode != 'ACCO') {
				newArr.push(listItem[i]);
			}
		}
		rpt.resBackQuery();
		rpt.journalLoaded = true;
	});
};

//----------------------会计体系列表start-----------------------//
//请求函数——会计体系列表
rpt.reqAccaList = function() {
	var argu = {
		"agencyCode": rpt.nowAgencyCode,
		"acctCode": rpt.nowAcctCode,
		"rgCode": rpt.rgCode,
		"setYear": rpt.nowSetYear
	}
	ufma.ajax(rpt.portList.accaList, "get", argu, rpt.showAccaList);
};
//回调函数——会计体系列表
rpt.showAccaList = function(result) {
	var list = result.data;
	var divHtml = "";
	for(var i = 0; i < list.length; i++) {
		var btn = ufma.htmFormat('<button class="btn btn-default" data-code="<%=code%>"><%=name%></button>', {
			code: list[i].accaCode,
			name: list[i].accaName
		});
		divHtml += btn;
	}
	divHtml = '<button class="btn btn-primary" data-code="*">全部</button>' + divHtml;
	$("#accaList").html(divHtml);
	if(list.length == 1) {
		if(rpt.rptType == "accDetailPay") {
			$(".accaList-title,#accaList").hide();
			$(".rpt-query-date").css("margin-left", "-79px");
		}
	} else if(list.length == 2) {
		if(rpt.rptType == "accDetailPay") {
			$(".accaList-title,#accaList").show();
			$(".rpt-query-date").css("margin-left", "0");
		}
	}
};
//----------------------会计体系列表end-------------------------//

//----------------------共享方案列表 start------------------------//
//请求函数——共享方案列表
rpt.reqSharePrjList = function() {
	var prjArgu = {
		"agencyCode": rpt.nowAgencyCode,
		"acctCode": rpt.nowAcctCode,
		"rptType": rpt.rptType,
		"userId": rpt.nowUserId,
		"setYear": rpt.nowSetYear
	};
	ufma.ajax(rpt.portList.sharePrjList, "get", prjArgu, rpt.showSharePrjList);
};
//回调函数——共享方案列表
rpt.showSharePrjList = function(result) {
	var prjList = result.data;
	var methodHtml = "";
	if(prjList.length > 0) {
		$(".rpt-method-tip").find("i").css("display", "inline-block");
		for(var i = 0; i < prjList.length; i++) {
			var liHtml = ufma.htmFormat('<li><span title="<%=name%>" data-scope="<%=scope%>"><%=name%></span><button class="btn btn-default" data-code="<%=code%>">使用</button></li>', {
				code: prjList[i].prjCode,
				name: prjList[i].prjName,
				scope: prjList[i].prjScope
			});
			methodHtml += liHtml;
		}
		$(".rpt-share-method-box-body ul").html(methodHtml);
		$(".rpt-share-method-box-top span").text(prjList.length);
	} else {
		$(".rpt-share-method-box-body ul").html("");
		$(".rpt-share-method-box-top span").text(0);
		$(".rpt-method-tip").find("i").css("display", "none");
	}
};
//----------------------共享方案列表 end-------------------------//
//----------------------保存方案 start--------------------------//
//请求函数——请求保存方案
rpt.reqSavePrj = function(isNew) {

	var savePrjArgu = {};

	savePrjArgu.acctCode = rpt.nowAcctCode; //账套代码
	savePrjArgu.agencyCode = rpt.nowAgencyCode; //单位代码

	savePrjArgu.prjCode = isNew ? '' : $("#methodName").attr("data-code"); //方案代码
	savePrjArgu.prjName = $("#methodName").val(); //方案名称
	savePrjArgu.prjScope = $('input:radio[name="prjScope"]:checked').val() //方案作用域
	savePrjArgu.rptType = $(".rptType").val(); //账表类型
	savePrjArgu.setYear = rpt.nowSetYear; //业务年度
	savePrjArgu.userId = rpt.nowUserId; //用户Id
	if($("#colAction").attr("data-type") == "02") {
		savePrjArgu.dataType = "02";
	} else {
		savePrjArgu.dataType = "01";
	}
	savePrjArgu.qryItems = rpt.qryItemsArr();
	//方案内容
	savePrjArgu.prjContent = rpt.prjContObj();
	ufma.post(rpt.portList.savePrj, savePrjArgu, rpt.resSavePrj);
};
//回调函数——请求保存方案
rpt.resSavePrj = function(result) {
	var flag = result.flag;
	var prjCode = result.data.prjCode;
	var prjScope = result.data.prjScope;
	dm.curPlan = result.data;
	if(flag == "success") {

		ufma.showTip("查询方案保存成功！", function() {
			rpt.setQuery.close();
		}, "success");
		//重构-刷新方案列表
		dm.showPlan({
			"agencyCode": dm.svAcctCode,
			"acctCode": dm.svAcctCode,
			"rptType": rpt.rptType,
			"userId": dm.svUserId, //修改权限  将svUserCode改为 svUserId  20181012
			"setYear": dm.svSetYear
		});

	} else {
		ufma.alert(result.msg, "error");
		return false;
	}
};
//----------------------保存方案 end----------------------------//
//----------------------请求方案内容（不包含余额表） start-----------------------//
//请求函数——请求方案内容
rpt.reqPrjCont = function(prjCode) {
	var prjContArgu = {
		"acctCode": rpt.nowAcctCode,
		"agencyCode": rpt.nowAgencyCode,
		"prjCode": prjCode,
		"rptType": "accDetailPay",
		"setYear": rpt.nowSetYear,
		"userId": rpt.nowUserId
	};
	ufma.ajax(rpt.portList.prjContent, "get", prjContArgu, rpt.showPrjCont);
};

rpt.firstTxt = "";
rpt.ACCOtext = "";
//回调函数——展示查询方案内容
rpt.showPrjCont = function(result) {
	var prjContent = JSON.parse(result.data.prjContent);
	var qryItems = prjContent.qryItems;
	rpt.accQueryShow(prjContent);
	//$('#frmQuery').setForm(prjContent);
	$('#queryMore').setForm(prjContent);
	prjCode = result.data.prjCode;
	rpt.prjCode = prjCode;
	if(prjContent.rptOption[0].defCompoValue == "Y") {
		$("#pzCheck input:checkbox").prop("checked", "checked");
	} else if(prjContent.rptOption[0].defCompoValue == "N") {
		$("#pzCheck input:checkbox").removeAttr("checked");
	}
	if(prjContent.timeBring == "dateBn") {
		$('#dateBn').addClass('selected').siblings().removeClass('selected');
	} else if(prjContent.timeBring == "dateBq") {
		$('#dateBq').addClass('selected').siblings().removeClass('selected');
	} else if(prjContent.timeBring == "dateJr") {
		$('#dateJr').addClass('selected').siblings().removeClass('selected');
	}
	if(prjContent.currentTypeSign == "") {
		$('#allType').addClass('selected').siblings().removeClass('selected');
	} else if(prjContent.currentTypeSign == "0") {
		$('#whxType').addClass('selected').siblings().removeClass('selected');
	} else if(prjContent.currentTypeSign == "1") {
		$('#yhxType').addClass('selected').siblings().removeClass('selected');
	}
	$('#dateStart').getObj().setValue(prjContent.startDate);
	$('#dateEnd').getObj().setValue(prjContent.endDate);
};

/**账表页面的相关绑定操作**********************************************************************/
//会计科目树入参改变，还原查询条件框
rpt.backQuery = function() {
		var eleCode = $("#ACCO").data("code"); //会计科目代码
		var accoArgu = {
			"agencyCode": rpt.nowAgencyCode,
			"acctCode": rpt.nowAcctCode,
			"eleCode": eleCode,
			"userId": rpt.nowUserId,
			"setYear": rpt.nowSetYear
		};
		ufma.ajax(rpt.portList.tipsList, "get", accoArgu, rpt.resBackQuery);
	},
	//回调函数——还原查询条件框
	rpt.resBackQuery = function() {
		$('#queryAcco .search-btn').off().on('click', function(e) {
			rpt.showHideTree(this, 'ACCO', '会计科目');
		});
		rpt.raidoTreeShow();
	};
//渲染方案的辅助项
rpt.accQueryShow = function(prjContent) {
	var liArr = prjContent.qryItems[0]
	rpt.resBackQuery();
	var $li = $(rpt.namespace + " .rpt-query-box-center .rpt-query-box-li");
	var code = liArr.itemType;
	var title = liArr.itemTypeName;
	var flag = code != 'ACCO';
	var items = [];
	var item = liArr.items;
	items.push({
		/*'CHR_CODE': item[0].code,*/
		'code': item[0].code,
		'name': item[0].name
	});
	itemName = [];
	itemName.push(items[0].name);
	var _input = $('input[id="' + code + '-data-key"]');
	$.data(_input[0], 'data', items);
	if(!$.isNull(itemName)) {
		_input.val(itemName);
	} else {
		_input.val('全部');
	}
	//下面的以后重构时去掉
	if(flag) {
		//显示
		if(liArr[i].isShowItem == "1") {
			$li.eq(i - 1).find(".isShowCol").prop("checked", true);
		} else {
			$li.eq(i - 1).find(".isShowCol").removeAttr("checked");
		}
		//逐级汇总
		if(liArr[i].isGradSum == "1") {
			$li.eq(i - 1).find(".isSumCol").prop("checked", true);
		} else {
			$li.eq(i - 1).find(".isSumCol").removeAttr("checked");
		}
	}
};

//点击查询方案
rpt.clickMethod = function() {
	$(rpt.namespace).find('.rpt-method-list').on('click', 'li span', function() {
		if($(this).parent("li").hasClass("isUsed")) {
			$(this).parent("li").css({
				"border": "1px solid rgba(16,142,233,0.30)",
				"background": "rgba(16,142,233,0.20)"
			}).removeClass("isUsed").find("span,b").css("color", "#108EE9");
			//取消选中的查询方案后还原会计体系
			rpt.backToOrigin();
		} else {
			$(this).parent("li").css({
				"border": "1px solid #108EE9",
				"background": "#108EE9"
			}).addClass("isUsed").find("span,b").css("color", "#fff");
			$(this).parent("li").siblings().css({
				"border": "1px solid rgba(16,142,233,0.30)",
				"background": "rgba(16,142,233,0.20)"
			}).removeClass("isUsed").find("span,b").css("color", "#108EE9");
			$(rpt.namespace).find('.rpt-share-method-box-body .btn').remove("isUsed");
			if($(this).offset().top > 67) {
				$(this).parents("ul.rpt-method-listrpt-method-list").find("li").eq(0).before($(this).parent("li"));
			}

			//请求方案内容
			var prjCode = $(this).data("code"); //方案代码
			rpt.reqPrjCont(prjCode);
		}

	});
};

//使用共享方案
rpt.useShareMethod = function() {
	$(rpt.namespace).find('.rpt-share-method-box-body').on('click', '.btn', function() {
		$(this).addClass("isUsed");
		$(rpt.namespace).find('.rpt-method-list li').css({
			"border": "1px solid rgba(16,142,233,0.30)",
			"background": "rgba(16,142,233,0.20)"
		}).removeClass("isUsed").find("span,b").css("color", "#108EE9");
		//请求方案内容
		var prjCode = $(this).data("code"); //方案代码
		rpt.reqPrjCont(prjCode);
	});
};
//取消或删除查询方案时用来还原会计体系
rpt.backToOrigin = function() {
	//还原会计体系
	rpt.reqAccaList();
	var dd = new Date();
	var ddYear = dd.getFullYear();
	$('a[name="period"].selected').removeClass('selected');
	$('#billType').getObj().setValue("");
	$('#cbCurrent').getObj().setValue("");
	$('#billNo').val("");
	$('#vouTypeCode').val("");
	$("#endCurDate").getObj().setValue("");
	$("#dateStart").getObj().setValue("");
	$("#dateEnd").getObj().setValue("");
	$('#startVouNo').val("");
	$('#endVouNo').val("");
	$('#hxType a').removeClass('selected');
	$('#timeBring a').removeClass('selected');
	$("#pzCheck input:checkbox").removeAttr("checked");
	//$('#queryAcco input').val("全部");
	itemName = [];
};
//返回账表查询的入参结果集
rpt.backTabArgu = function() {
	var tabArgu = {};
	tabArgu.acctCode = rpt.nowAcctCode; //账套代码
	tabArgu.agencyCode = rpt.nowAgencyCode; //单位代码
	var meLi = $(rpt.namespace).find(".rpt-method-list li.isUsed");
	var meBtn = $(rpt.namespace).find(".rpt-share-method-box-body .btn.isUsed");
	if($(meLi).length > 0) {
		tabArgu.prjCode = $(meLi).find("span").data("code");
		tabArgu.prjName = $(meLi).find("span").text();
		tabArgu.prjScope = $(meLi).find("span").data("scope");
	} else if($(meBtn).length > 0) {
		tabArgu.prjCode = $(meBtn).data("code");
		tabArgu.prjName = $(meBtn).siblings("span").text();
		tabArgu.prjScope = $(meBtn).siblings("span").data("scope");
	} else {
		tabArgu.prjCode = ""; //方案代码
		tabArgu.prjName = ""; //方案名称
		tabArgu.prjScope = ""; //方案作用域
	}
	tabArgu.rptType = rpt.rptType; //账表类型
	tabArgu.setYear = rpt.nowSetYear; //业务年度
	tabArgu.userId = rpt.nowUserId; //用户id
	tabArgu.prjContent = rpt.prjContObj(); //方案内容
	return tabArgu;
};
//查选方案列表的触摸效果
rpt.methodPointer = function() {
	$(rpt.namespace).find(".rpt-method-list").on("mouseover", "li", function() {
		$(this).css({
			"border": "1px solid rgb(16, 142, 233)"
		});
	}).on("mouseout", "li", function() {
		var color = $(this).css("color");
		if(color == "rgb(255, 255, 255)") {
			$(this).css({
				"border": "1px solid rgb(16, 142, 233)"
			});
		} else {
			$(this).css({
				"border": "1px solid rgba(16, 142, 233, 0.3)"
			});
		}
	});
	$(rpt.namespace).find(".rpt-method-list").on("mouseover", "li b", function() {
		var color = $(this).css("color");
		var background;
		if(color != "rgb(16, 142, 233)") {
			background = "rgb(16, 142, 233)";
		} else {
			background = "rgb(255, 255, 255)";
		}
		$(this).css({
			"border-radius": "50%",
			"background": color,
			"color": background
		});
	}).on("mouseout", "li b", function() {
		var color = $(this).css("color");
		var background;
		if(color != "rgb(16, 142, 233)") {
			background = "rgb(16, 142, 233)";
		} else {
			background = "rgb(255, 255, 255)";
		}
		$(this).css({
			"border-radius": "50%",
			"background": "none",
			"color": background
		});
	});
};
rpt.showHideTree = function(dom, code, text) {
	var params = {
		"acctCode": rpt.nowAcctCode,
		"agencyCode": rpt.nowAgencyCode,
		"setYear": rpt.nowSetYear,
		"userId": rpt.nowUserId,
		"accoType": "4"
	}
	params.eleCode = code
	ufma.open({
		url: bootPath + '/pub/baseTreeSelect/baseTreeSelect.html',
		title: '选择' + text,
		width: 580,
		height: 545,
		data: {
			'flag': code,
			'rootName': text,
			'checkbox': true, //如果后期不需要复选框就改成false
			'leafRequire': false,
			'data': params
		},
		ondestory: function(result) {
			if(result.action) {
				var input = $(dom).closest(".rpt-p-search-key").find("input[id$='data-key']");
				var valList = [];
				for(var i = 0; i < result.data.length; i++) {
					valList.push(result.data[i].codeName);
				}
				$(input).val(valList.join(','));
				$.data($(input)[0], 'data', result.data);
				ufma.setBarPos($(window));
			};
		}
	});
};
//打开联查凭证页面
/*rpt.openVouShow = function(dom, page) {
	var vouGuid = $(dom).attr("data-vouguid"); //凭证id
	if(vouGuid) {
		 $(this).attr('data-href', '../../../gl/vou/index.html?menuid=' + rpt.vouMenuId + '&dataFrom=' + page + '&action=query&vouGuid=' + vouGuid + '&agencyCode=' + rpt.nowAgencyCode + '&acctCode=' + rpt.nowAcctCode);
		$(this).attr('data-title', '凭证录入');
		window.parent.openNewMenu($(this)); 
	}
};*/
//收集表格表头信息
rpt.tableHeader = function(tableId) {
	var columns = $("#" + tableId).DataTable().settings()[0].aoColumns;
	var visible = $("#" + tableId).DataTable().columns().visible(); //每列元素的隐藏/显示属性组
	var arr = []; //存储当前表格的表头信息
	for(var i = 0; i < visible.length; i++) {
		var obj = {};
		obj.title = columns[i].sTitle; //列名
		obj.code = columns[i].data; //列名代码
		obj.index = i; //列的索引
		obj.visible = visible[i]; //列的隐藏/显示属性
		obj.pTitle = $(columns[i].nTh).attr("parent-title") == undefined ? "" : $(columns[i].nTh).attr("parent-title"); //列名的父元素名
		arr.push(obj);
	}
	return arr;
};
//修改相关辅助项
rpt.accHtml = function(sender, data) {
	var id = sender.attr("id");
	var index = parseInt(id.substring(id.length - 1) - 1);
	var name = data.accItemName;
	var code = data.accItemCode;
	var $li = $(rpt.namespace + " .rpt-query-box-center .rpt-query-box-li");
	$li.eq(index).find(".rpt-query-li-action label input").removeAttr("checked");
	if(index == "0") {
		$li.eq(index).find(".rpt-query-li-action label input.isShowCol").prop("checked", true);
	}
	$li.eq(index).find(".rpt-query-li-action [type='radio']").eq(2).prop("checked", true);
	$li.eq(index).find(".rpt-query-li-action input[type='hidden']").val("-1");
	$li.find(".rpt-tree-data").hide();
	$li.eq(index).find(".rpt-tree-data").html("");
	if(name == "请选择") {
		$li.eq(index).addClass("li-hide");
		$li.eq(index).find(".rpt-query-li-cont-title span").attr({
			"title": "",
			"data-code": "",
			"id": ""
		}).text("");
		$li.eq(index).find(".rpt-tree-view").html(
			'<p class="rpt-p-search-key">' +
			'<input type="text" readonly id="">' +
			'<span class="search-btn icon icon-writeoff"></span>' +
			'</p>'
		);
	} else {
		$li.eq(index).removeClass("li-hide");
		$li.eq(index).find(".rpt-query-li-cont-title span").attr({
			"title": name,
			"data-code": code,
			"id": code
		}).html(name + '：');
		$li.eq(index).find(".rpt-tree-view").html(
			'<p class="rpt-p-search-key">' +
			'<input type="text" readonly id="' + code + '-data-key">' +
			'<span class="search-btn icon icon-writeoff"></span>' +
			'</p>'
		);
		$li.eq(index).find(".rpt-tree-data").html('<ul id="' + code + '-data" class="ufmaTree"></ul>');
	}
	ufma.setBarPos($(window));
};
//返回表格需要显示的辅助项数组
rpt.tableColArr = function() {
	var liArr = []; //需要显示的辅助核算项
	$(".rpt-query-box-li0").each(function() {
		if(!$(this).hasClass("li-hide")) {
			var that = $(this).find(".rpt-query-li-cont-title span");
			var liObj = {};
			//显示
			if($(this).find(".isShowCol").prop("checked")) {
				liObj.isShowItem = "1";
			} else {
				liObj.isShowItem = "0";
			}
			liObj.seq = "condition";
			liObj.dir = "";
			liObj.itemPos = "";
			liObj.itemTypeName = $(that).text().replaceAll('：', '');
			liObj.itemType = $(that).attr("id");
			if($(that).data("tips") != null && $(that).data("tips") != "") {
				liObj.tips = eval('(' + $(that).data("tips") + ')');
			} else {
				liObj.tips = "";
			}
			if($(that).data("tags") != null && $(that).data("tags") != "") {
				liObj.items = eval('(' + $(that).data("tags") + ')');
			} else {
				liObj.items = "";
			}
			liArr.push(liObj);
		}
	});
	var showLiArr = [];
	for(var i = 0; i < liArr.length; i++) {
		if(liArr[i].isShowItem == "1") {
			showLiArr.push(liArr[i]);
		}
	}
	return showLiArr;
};