;

var pfData = ufma.getCommonData();
//console.info("pfData=="+JSON.stringify(pfData));

var rpt = {};
//用于存储打开的模态框
rpt.setQuery;
rpt.namespace = "#" + $(".rptType").data("name");
//console.info(rpt.namespace);
rpt.accListHtml = $(".rpt-query-box-center").html();

//需要手动更新的menuid
rpt.vouMenuId = "6661003001001"; //凭证录入
rpt.journalMenuId = "6661003002001"; //明细账

//明细账是否加载完毕
rpt.journalLoaded = false;

rpt.nowDate = pfData.svTransDate; //当前年月日
rpt.module = "gl"; //模块代码
rpt.compoCode = "rpt"; //部件代码
//rpt.rgCode = "87";//区划代码
rpt.rgCode = pfData.svRgCode; //区划代码

rpt.bennian = pfData.svSetYear; //本年 年度
rpt.benqi = pfData.svFiscalPeriod; //本期 月份
rpt.today = pfData.svTransDate; //今日 年月日

//账表所用接口
rpt.portList = {
	//agencyList:"/gl/eleAgency/getRptAgencys",//单位列表接口
	agencyList: "/gl/eleAgency/getAgencyTree", //单位列表接口
	acctList: "/gl/eleCoacc/getRptAccts", //账套列表接口
	accaList: "/gl/eleAcca/getRptAccas", //会计体系列表接口
	tipsList: "/gl/accTips/getTips", //推荐项列表接口
	prjList: "/gl/rpt/prj/getPrjList", //查询方案列表接口
	sharePrjList: "/gl/rpt/prj/getSharePrjList", //共享方案列表接口
	optList: "/gl/rpt/prj/getOptList", //查询条件其他选项列表接口
	accoTree: "/gl/sys/coaAcc/getRptAccoTree", //会计科目树（账套级）接口
	accItemTree: "/gl/common/glAccItemData/getAccItemTree", //辅助项资料树（单位级）接口
	savePrj: "/gl/rpt/prj/savePrj", //保存查询方案
	prjContent: "/gl/rpt/prj/getPrjcontent", //查询方案内容接口
	deletePrj: "/gl/rpt/prj/deletePrj", //删除查询方案
	rptAccItemTypeList: "/gl/EleAccItem/getRptAccItemTypePost", //辅助项类别列表接口包括科目
	//getVoutype:"/gl/eleVouType/getVoutypeByAgencyCode/",//请求凭证字号
	getVoutype: "/gl/eleVouType/getVouType/", //请求凭证字号
	getCurrType: "/gl/eleCurrRate/getCurrType", //请求币种列表
	getEleLevelNum: "/gl/rpt/cond/getEleLevelNum", //获取汇总方式（凭证汇总表）
	getVouTypeFull: "/gl/eleVouType/getVouType/", //请求凭证类型、字号
	getVOU_SOURCE: "/gl/enumerate/VOU_SOURCE" //获取凭证来源
};

//请求接口需要的全局变量
//rpt.nowSetYear = "2017";//当前年份
//rpt.nowUserId = "sa";//登录用户ID
//rpt.nowUserName = "";//登录用户名称
//rpt.nowAgencyCode = "001";//登录单位代码
//rpt.nowAgencyName = "";//登录单位名称
//rpt.nowAcctCode = "";//账套代码
//rpt.nowAcctName = "";//账套名称
//rpt.rptType = $(".rptType").val();//账表类型

rpt.nowSetYear = pfData.svSetYear; //当前年份
//修改权限  将svUserCode改为 svUserId  20181012
rpt.nowUserId = pfData.svUserId
// rpt.nowUserId = pfData.svUserCode; //登录用户ID
rpt.nowUserName = pfData.svUserName; //登录用户名称
rpt.nowAgencyCode = pfData.svAgencyCode; //登录单位代码
rpt.nowAgencyName = pfData.svAgencyName; //登录单位名称
rpt.nowAcctCode = pfData.svAcctCode; //账套代码
rpt.nowAcctName = pfData.svAcctName; //账套名称
rpt.rptType = $(".rptType").val(); //账表类型

//储存页面已存在session的key
rpt.sessionKeyArr = [];

//总账联查明细账参数缓存
rpt.journalFormLedger = ufma.sessionKey(rpt.module, rpt.compoCode, rpt.rgCode, rpt.nowSetYear, rpt.nowAgencyCode, rpt.nowAcctCode, "journalFormLedger");
//余额表联查明细账参数缓存
rpt.journalFormBal = ufma.sessionKey(rpt.module, rpt.compoCode, rpt.rgCode, rpt.nowSetYear, rpt.nowAgencyCode, rpt.nowAcctCode, "journalFormBal");

/**账表的通用公共方法******************************************************************/
/*
 * JSON数组去重
 * @param: [array] json Array
 * @param: [string] 唯一的key名，根据此键名进行去重
 */
rpt.uniqueArray = function(array, key) {
	var result = [array[0]];
	for(var i = 1; i < array.length; i++) {
		var item = array[i];
		var repeat = false;
		for(var j = 0; j < result.length; j++) {
			if(item[key] == result[j][key]) {
				repeat = true;
				break;
			}
		}
		if(!repeat) {
			result.push(item);
		}
	}
	return result;
};

//返回地址栏的参数
rpt.GetQueryString = function(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
	var r = window.location.search.substr(1).match(reg);
	if(r != null) return unescape(r[2]);
	return null;
};

/*
 * 获得节点下面的所有子节点
 */
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

//数字保留千分位
rpt.comdify = function(n) {
	if(n == "" || n == null || n == undefined) {
		return n;
	}
	var re = /\d{1,3}(?=(\d{3})+$)/g;
	var n1 = n.replace(/^(\d+)((\.\d+)?)$/, function(s, s1, s2) {
		return s1.replace(re, "$&,") + s2;
	});
	return n1;
};

//判断更多查询方案按钮是否显示
rpt.moreMethodBtn = function(ulDom, moreDom) {
	var len = 0;
	$("." + ulDom).find("li").each(function(i) {
		//		var str = $(this).text();
		//		var size = $(this).text().length;
		//		var reg = /[\u4E00-\u9FA5\uF900-\uFA2D]/;
		//		var strLen = 0;
		//		for(var n=0;n<size;n++){
		//			if(reg.test(str.charAt(n))){
		//				strLen += 12;
		//			}else{
		//				strLen += 8;
		//			}
		//		}
		//		len += parseInt((strLen+34) + 8);

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
					'<ul class="rpt-tags-list">' +
					'<li class="rpt-li-over" style="display:none;">...</li>' +
					'</ul>' +
					'<p class="rpt-p-search-key">' +
					'<input type="text" id="' + itemCode + '-data-key">' +
					'</p>' +
					'<div class="rpt-tags-num" style="display:none;">(<span>0</span>)</div>'
				);
				$li.find(".rpt-tree-data").html('<ul id="' + itemCode + '-data" class="ufmaTree ztree"></ul>');

				$(this).parents(".rpt-query-li-action").find("input[type='hidden']").val(radioType);
				//			rpt.showHideTree(that,itemCode,radioType);

				var treeKey = ufma.sessionKey(rpt.module, rpt.compoCode, rpt.rgCode, rpt.nowSetYear, rpt.nowAgencyCode, rpt.nowAcctCode, rpt.namespace + itemCode);
				var treeStr = sessionStorage.removeItem(treeKey);
			}

		})
	})

	//	$(rpt.namespace).on("click",".rpt-query-li-action [type='radio']",function(){
	//		if(!$(this).hasClass("radioSelected")){
	//			$(this).addClass("radioSelected").parent().siblings().find("[type='radio']").removeClass("radioSelected");
	//			var $li = $(this).parents(".rpt-query-box-li")
	//			var radioType = $(this).val();
	//			var that = $li.find(".rpt-tree-view");
	//			var itemCode = $li.find(".rpt-query-li-cont-title span").data("code");
	//			that.html(
	//				'<ul class="rpt-tags-list">'+
	//					'<li class="rpt-li-over" style="display:none;">...</li>'+
	//				'</ul>'+
	//				'<p class="rpt-p-search-key">'+
	//					'<input type="text" id="'+itemCode+'-data-key">'+
	//				'</p>'+
	//				'<div class="rpt-tags-num" style="display:none;">(<span>0</span>)</div>'
	//			);
	//			$li.find(".rpt-tree-data").html('<ul id="'+itemCode+'-data" class="ufmaTree ztree"></ul>');
	//			
	//			$(this).parents(".rpt-query-li-action").find("input[type='hidden']").val(radioType);
	////			rpt.showHideTree(that,itemCode,radioType);
	//			
	//			var treeKey=ufma.sessionKey(rpt.module,rpt.compoCode,rpt.rgCode,rpt.nowSetYear,rpt.nowAgencyCode,rpt.nowAcctCode,rpt.namespace+itemCode);
	//			var treeStr = sessionStorage.removeItem(treeKey);
	//		}
	//	})
};

//返回本期时间
rpt.dateBenQi = function(startId, endId) {
	//	var dd = new Date();
	//	var ddYear = dd.getFullYear();
	//	var ddMonth = dd.getMonth();
	//	var tdd = new Date(ddYear,ddMonth+1,0)
	//	var ddDay = tdd.getDate();
	//	$(rpt.namespace).find("#"+startId).datetimepicker('setDate',(new Date(ddYear,ddMonth,1)));
	//	$(rpt.namespace).find("#"+endId).datetimepicker('setDate',(new Date(ddYear,ddMonth,ddDay)));

	var ddYear = rpt.bennian;
	var ddMonth = rpt.benqi - 1;
	var tdd = new Date(ddYear, ddMonth + 1, 0)
	var ddDay = tdd.getDate();
	$(rpt.namespace).find("#" + startId).datetimepicker('setDate', (new Date(ddYear, ddMonth, 1)));
	$(rpt.namespace).find("#" + endId).datetimepicker('setDate', (new Date(ddYear, ddMonth, ddDay)));
};
//返回本年时间
rpt.dateBenNian = function(startId, endId) {
	//	var dd = new Date();
	//	var ddYear = dd.getFullYear();
	//	$(rpt.namespace).find("#"+startId).datetimepicker('setDate',(new Date(ddYear,0,1)));
	//	$(rpt.namespace).find("#"+endId).datetimepicker('setDate',(new Date(ddYear,11,31)));

	var ddYear = rpt.bennian;
	$(rpt.namespace).find("#" + startId).datetimepicker('setDate', (new Date(ddYear, 0, 1)));
	$(rpt.namespace).find("#" + endId).datetimepicker('setDate', (new Date(ddYear, 11, 31)));
};
//返回今日时间
rpt.dateToday = function(startId, endId) {
	//	$(rpt.namespace).find("#"+startId+",#"+endId).datetimepicker('setDate',(new Date()));
	$(rpt.namespace).find("#" + startId + ",#" + endId).datetimepicker('setDate', (new Date(rpt.today)));
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
	if(rpt.rptType == "GL_RPT_LEDGER") {
		checkNodes = mytree.getSelectedNodes();
	} else {
		checkNodes = mytree.getCheckedNodes(true);
	}

	var allCheckNodes = [];
	for(var i = 0; i < checkNodes.length; i++) {
		if(rpt.rptType == "GL_RPT_LEDGER") {
			checkNodes = mytree.getSelectedNodes();
			allCheckNodes.push(checkNodes[i]);
		} else {
			var halfCheck = checkNodes[i].getCheckStatus();
			var pnode = checkNodes[i].isParent;

			if(rpt.rptType != "GL_RPT_COLUMNAR") {
				if(!halfCheck.half) {
					allCheckNodes.push(checkNodes[i]);
				}
			} else {
				if(!halfCheck.half && !pnode) {
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
		//len = 60;
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

	//余额表的操作
	if(rpt.rptType == "GL_RPT_BAL") {
		//如果不是设置辅助项带过来的标签 才清空下面辅助项已有的标签
		//		if(treeId == "ACCO-data" && type){
		//			rpt.changeItems();
		//		}
	}
	//明细账
	else if(rpt.rptType == "GL_RPT_JOURNAL") {

	}
	//总账、日记账
	else if(rpt.rptType == "GL_RPT_LEDGER" || rpt.rptType == "GL_RPT_DAILYJOURNAL") {

	}
	//多栏账
	else if(rpt.rptType == "GL_RPT_COLUMNAR") {

	} else {
		//		console.info("不是余额表、明细账、总账、日记账、多栏账,查看是否需要做细化处理！");
	}

};

//移除树节点标签
rpt.removeTags = function(dom, tree) {
	var ulDom = $(dom).parents("ul.rpt-tags-list");
	var treeId = $(dom).parents("div.rpt-query-li-selete").find("ul.ztree").attr("id");
	//	if(treeId != undefined) {
	var liDom = $(dom).parent("li").remove();
	var domName = $(dom).siblings("span").text();
	var mytree = tree;
	var domNode = mytree.getNodeByParam("name", domName, null);
	var checkNodes = mytree.checkNode(domNode, false, true);
	$(ulDom).siblings(".rpt-p-search-key").find("input").val("").focus();
	//	}
};

//删除select标签
rpt.deleteSelete = function(dom, tree) {
	var dom = dom;
	var tree = tree;
	//移除树节点标签
	rpt.removeTags(dom, tree);

	//余额表的操作
	if(rpt.rptType == "GL_RPT_BAL") {
		var treeId = $(dom).parents("div.rpt-query-li-selete").find("ul.ztree").attr("id");
		if(treeId == "ACCO-data") {
			rpt.changeItems();
		}
	}
	//明细账的操作
	else if(rpt.rptType == "GL_RPT_JOURNAL") {
		//		var treeId = $(dom).parents("div.rpt-query-li-selete").find("ul.ztree").attr("id");
		//		if(treeId == "ACCO-data"){
		//			rpt.changeItems();
		//		}
	}
	//总账、日记账的操作
	else if(rpt.rptType == "GL_RPT_LEDGER" || rpt.rptType == "GL_RPT_DAILYJOURNAL") {

	}
	//多栏账
	else if(rpt.rptType == "GL_RPT_COLUMNAR") {

	} else {
		//		console.info("不是余额表、明细账、总账、日记账、多栏账,查看是否需要做细化处理！");
	}

};

//返回创建下拉选择树

var ii = "00";
rpt.selectTree = function(treeId, nodes, checkFlag, radioType) {
	var myTree;
	var setting = {
		view: {
			selectedMulti: false,
			showLine: false,
			fontCss: getFontCss,
		},
		check: {
			enable: checkFlag
		},
		data: {
			simpleData: {
				enable: true
			}
		},
		callback: {
			beforeClick: atreeBeforeClick,
			onClick: zTreeOnClick,
			onCheck: zTreeOnCheck
		}
	};

	function atreeBeforeClick(treeId, treeNode, clickFlag) {
		if(rpt.rptType == "GL_RPT_LEDGER") {
			if(treeNode.id == "0") {
				return false;
			}
		}
	}

	function zTreeOnClick(event, treeId, treeNode) {
		var be = treeNode.checked;
		//myTree.checkNode(treeNode, !be, true);
		if(rpt.rptType == "GL_RPT_LEDGER") {
			myTree.selectNode(treeNode, false, false);
		} else {
			myTree.checkNode(treeNode, !be, true);
		}
		rpt.selectTags(treeId, true);
		$(key).val("").focus();
		if(rpt.rptType == "GL_RPT_JOURNAL") {
			$("#" + treeId).parent("div.rpt-tree-data").hide();
		}
	};

	function zTreeOnCheck(event, treeId, treeNode) {
		rpt.selectTags(treeId, true);
		$(key).val("").focus();
		if(rpt.rptType == "GL_RPT_JOURNAL") {
			$("#" + treeId).parent("div.rpt-tree-data").hide();
		}
	};

	function focusKey(e) {
		if(key.hasClass("empty")) {
			key.removeClass("empty");
		}
	}

	function blurKey(e) {
		if(key.get(0).value === "") {
			key.addClass("empty");
		}
	}
	var lastValue = "",
		nodeList = [],
		fontCss = {};

	function searchNode(e) {
		var value = $.trim(key.get(0).value);
		var keyType = "id";

		if(key.hasClass("empty")) {
			value = "";
		}
		if(lastValue === value) return;
		lastValue = value;
		if(value === "") return;
		updateNodes(false);

		//nodeList = myTree.getNodesByParamFuzzy(keyType, value);

		function filter(node) {
			return(value == node.name.substring(0, value.length));
		}
		nodeList = myTree.getNodesByFilter(filter);

		updateNodes(true);

		var NodesArr = allNodesArr();
		if(nodeList.length > 0) {
			var index = NodesArr.indexOf(nodeList[0].id);
			$("#" + treeId).scrollTop((30 * index));
		}

		$(key).keydown(function(e) {
			//console.info(2222);

			if(e.keyCode == 13) {
				if(nodeList.length > 0 && nodeList != null && nodeList != "") {
					var firstNode = myTree.getNodeByParam("name", nodeList[0].name, null);
					myTree.checkNode(firstNode, true, true);
					rpt.selectTags(treeId, true);
					$(key).val("").focus();
					if(rpt.rptType == "GL_RPT_JOURNAL") {
						$("#" + treeId).parent("div.rpt-tree-data").hide();
					}
					updateNodes(false);
				} else {
					//console.info(111);
					return false;
				}
			}

		});

	}

	function updateNodes(highlight) {
		for(var i = 0, l = nodeList.length; i < l; i++) {
			nodeList[i].highlight = highlight;
			myTree.updateNode(nodeList[i]);
		}
	}

	function getFontCss(treeId, treeNode) {
		// color:"#F04134"
		return(!!treeNode.highlight) ? {
			color: "#333",
			"font-weight": "bold"
		} : {
			color: "#333",
			"font-weight": "normal"
		};
	}

	function filter(node) {
		return !node.isParent && node.isFirstNode;
	}

	function allNodesArr() {
		var nodes = myTree.getNodes();
		var allNodesArr = [];
		var allNodesStr;
		for(var i = 0; i < nodes.length; i++) {
			var result = "";
			var result = rpt.getAllChildrenNodes(nodes[i], result);
			var NodesStr = result
			NodesStr = NodesStr.split(",");
			NodesStr.splice(0, 1, nodes[i].id);
			NodesStr = NodesStr.join(",");
			allNodesStr += "," + NodesStr;
		}
		allNodesArr = allNodesStr.split(",");
		allNodesArr.shift();
		return allNodesArr;
	}

	var key;

	$(document).ready(function() {
		var newNodes = [];
		var oneArr = [{
			"id": "0",
			"pId": "",
			"name": "全部",
			"levelNum": "1",
			"isLeaf": "1",
		}];
		for(var i = 0; i < nodes.length; i++) {
			var newNodeObj = {};
			if(i == 0 && nodes[0].name == "全部") {
				newNodeObj.levelNum = "1";
				newNodeObj.isLeaf = "1";
			} else {
				newNodeObj.levelNum = nodes[i].levelNum;
				newNodeObj.isLeaf = nodes[i].isLeaf;
			}
			newNodeObj.pId = nodes[i].pId;
			newNodeObj.id = nodes[i].id;
			if(nodes[i].name == "全部") {
				newNodeObj.name = nodes[i].name;
			} else {
				newNodeObj.name = nodes[i].id + " " + nodes[i].name;
			}
			newNodes.push(newNodeObj);
		}
		var allNewNodes = newNodes;
		if(nodes[0].name != "全部") {
			allNewNodes = oneArr.concat(newNodes);
		}

		//		var radioType = $("#"+treeId).parents(".rpt-query-li-cont").find(".rpt-query-li-action input[type='hidden']").val();
		console.info("radioType==" + radioType);
		if(radioType == "1") { //一级代码
			var firstArr = [];
			for(var i = 0; i < allNewNodes.length; i++) {
				if(allNewNodes[i].levelNum == "1") {
					firstArr.push(allNewNodes[i]);
				}
			}
			for(var i = 1; i < firstArr.length; i++) {
				firstArr[i]["pId"] = "0";
			}
			myTree = $.fn.zTree.init($("#" + treeId), setting, firstArr);

		} else if(radioType == "0") { //明细代码
			var leafArr = [];
			for(var i = 0; i < allNewNodes.length; i++) {
				if(allNewNodes[i].isLeaf == "1") {
					leafArr.push(allNewNodes[i]);
				}
			}
			for(var i = 1; i < leafArr.length; i++) {
				leafArr[i]["pId"] = "0";
			}
			myTree = $.fn.zTree.init($("#" + treeId), setting, leafArr);

		} else {
			myTree = $.fn.zTree.init($("#" + treeId), setting, allNewNodes);
		}
		myTree.expandAll(true);

		//暂时不考虑上下键选择节点回车选中
		//myTree.selectNode(myTree.getNodes()[0]);

		key = $("#" + treeId + "-key");
		key.bind("focus", focusKey)
			.bind("blur", blurKey)
			.bind("input", searchNode)
			.bind("keyup", searchNode);

		//将已创建的标签在树节点上标记选中
		var ulDom = $("#" + treeId).parent("div.rpt-tree-data").siblings("div.rpt-tree-view").find("ul.rpt-tags-list");
		var liArr = [];
		$(ulDom).find("li").not("li.rpt-li-over").each(function() {
			liArr.push($(this).find("span").text());
		})
		if(liArr.length > 0) {
			for(var i = 0; i < liArr.length; i++) {
				var thisNode = myTree.getNodeByParam("name", liArr[i], null);
				//myTree.checkNode(thisNode, true, true)
				if(rpt.rptType == "GL_RPT_LEDGER") {
					myTree.selectNode(thisNode, false, false);
				} else {
					myTree.checkNode(thisNode, true, true);
				}
			}
		}

		//console.info(myTree.getCheckedNodes(true).length);
		if(rpt.rptType == "GL_RPT_BAL" && myTree.getCheckedNodes(true).length == "0" && treeId == "ACCO-data") {
			myTree.checkAllNodes(true);
			var allCheckNodes = myTree.getCheckedNodes(true);
			var num = allCheckNodes.length;
			var newLi = '<li><span data-code="' + allCheckNodes[0].id + '" title="' + allCheckNodes[0].name + '">' + allCheckNodes[0].name + '</span><b class="glyphicon icon-close"></b></li>';
			len = ($(newLi).find("span").text().length * 14) + 34;
			var ulDom = $("#" + treeId).parent("div.rpt-tree-data").siblings("div.rpt-tree-view").find("ul.rpt-tags-list");
			var numDom = $(ulDom).siblings("div.rpt-tags-num").find("span");
			$(ulDom).css("width", len + "px");
			$(ulDom).siblings(".rpt-p-search-key").css("width", (288 - len) + "px");
			$(ulDom).find("li.rpt-li-over").before($(newLi));
			$(numDom).text(num);
			$(numDom).parent("div.rpt-tags-num").show();
		}

		//删除select标签
		$(".rpt-query-li-selete .rpt-tags-list").on("click", "b.icon-close", function(event) {
			event.stopPropagation();
			if(rpt.rptType == "GL_RPT_LEDGER") {

				$(this).parents(".rpt-tags-list").css("width", "0");
				$(this).parents(".rpt-tree-view").find(".rpt-p-search-key").css("width", "288px");
				$(this).parents(".rpt-tree-view").find(".rpt-tags-num").hide().find("span").text("0");
				rpt.deleteSelete(this, myTree);
				var treeObj = $.fn.zTree.getZTreeObj(treeId);
				var nodes = treeObj.getSelectedNodes();
				treeObj.cancelSelectedNode(nodes[0]);
			} else {
				if(treeId == $(this).parents(".rpt-tree-view").next('.rpt-tree-data').find('.ztree').attr('id')) {
					rpt.deleteSelete(this, myTree);
					zTreeOnCheck(event, treeId, myTree);
				}
			}
		});

		//回车删除标签节点
		$(key).keydown(function(event) {
			event.stopPropagation();
			if(event.keyCode == 8) {

				//					console.info("back");
				if($(key).val() == "") {
					var numDom = $("#" + treeId).parents(".rpt-query-li-selete").find(".rpt-tags-num");
					var tagsUl = $("#" + treeId).parents(".rpt-query-li-selete").find(".rpt-tags-list");
					var len = $(tagsUl).find("li").length;
					//						console.info(len);
					if(len > 1) {
						var that = $(tagsUl).find("li").eq(length - 2).find("b.icon-close");
						//							console.info($(tagsUl).find("li").eq(length-2).find("span").text());

						if(rpt.rptType == "GL_RPT_LEDGER") {

							$(that).parents(".rpt-tags-list").css("width", "0");
							$(that).parents(".rpt-tree-view").find(".rpt-p-search-key").css("width", "288px");
							$(that).parents(".rpt-tree-view").find(".rpt-tags-num").hide().find("span").text("0");

							rpt.deleteSelete(that, myTree);
							var treeObj = $.fn.zTree.getZTreeObj(treeId);
							var nodes = treeObj.getSelectedNodes();
							treeObj.cancelSelectedNode(nodes[0]);
						} else {
							rpt.deleteSelete(that, myTree);
							zTreeOnCheck(event, treeId, myTree);
						}
						//							rpt.deleteSelete(that,myTree);
						//							zTreeOnCheck(event, treeId, myTree);
						return false;
					} else {
						return false;
					}
				}
			}
		});

	});

	return myTree;
};

//返回需要需要显示辅助项的HTML
rpt.queryInputHtml = function(liArr) {
	var inputHtml = "";
	var tagHtml = "";
	var tipHtml = "";
	var liHtml = "";
	var liHtml0 = '<li class="rpt-query-box-li rpt-query-box-li0">' +
		'<label class="rpt-query-li-cont-title subjoin"><span title="<%=name%>" data-journal="<%=journal%>" data-statement="<%=statement%>" data-pos="<%=pos%>" data-dir="<%=dir%>" data-seq="<%=seq%>" data-code="<%=code%>" id="<%=code%>"><%=name%></span>：</label>' +
		'<div class="rpt-query-li-cont">' +
		'<div class="rpt-query-li-selete">' +
		'<div class="rpt-tree-view bordered-input">' +
		'<ul class="rpt-tags-list">';
	var liHtml1 = '<li class="rpt-li-over" style="display:none;">...</li>' +
		'</ul>' +
		'<p class="rpt-p-search-key">' +
		'<input type="text" id="<%=code%>-data-key">' +
		'</p>' +
		'<div class="rpt-tags-num" style="display:none;">(<span><%=num%></span>)</div>' +
		'</div>' +
		'<div class="rpt-tree-data bordered-input" style="display:none;">' +
		'<ul id="<%=code%>-data" class="ufmaTree ztree"></ul>' +
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
		//console.info(tagHtml);

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

//返回需要需要显示辅助项的HTML（多栏账）
rpt.queryCondHtml = function(liArr, type) {
	//console.info("===="+JSON.stringify(liArr));
	var inputHtml = "";
	var tagHtml = "";
	var liHtml = "";
	var liHtml0 = '<div class="rpt-query-box-li rpt-query-box-li0">' +
		'<label class="rpt-query-li-cont-title" id="rpt-query-li-cont-title-Columnar"><span title="<%=name%>" data-pos="<%=pos%>" data-dir="<%=dir%>" data-seq="<%=seq%>" data-code="<%=code%>" id="<%=code%>"><%=name%></span>：</label>' +
		'<div class="rpt-query-li-cont">' +
		'<div class="rpt-query-li-selete">' +
		'<div class="rpt-tree-view bordered-input">' +
		'<ul class="rpt-tags-list">';
	var liHtml1 = '<li class="rpt-li-over" style="display:none;">...</li>' +
		'</ul>' +
		'<p class="rpt-p-search-key">' +
		'<input type="text" id="<%=code%>-data-key">' +
		'</p>' +
		'<div class="rpt-tags-num" style="display:none;">(<span><%=num%></span>)</div>' +
		'</div>' +
		'<div class="rpt-tree-data bordered-input" style="display:none;">' +
		'<ul id="<%=code%>-data" class="ufmaTree ztree"></ul>' +
		'</div>' +
		'</div>' +
		'</div>' +
		'</div>';

	if(type == "1") {
		if(liArr.length > 0) {
			tagHtml = "";
			if(liArr[0].items.length > 0) {
				for(var j = 0; j < liArr[0].items.length; j++) {
					var th = ufma.htmFormat('<li><span data-code="<%=tagCode%>" title="<%=tagName%>"><%=tagName%></span><b class="glyphicon icon-close"></b></li>', {
						tagCode: liArr[0].items[j].code,
						tagName: liArr[0].items[j].name
					});

					tagHtml += th;
				}
			}
			//console.info(tagHtml);
			liHtml = liHtml0 + tagHtml + liHtml1;
			var bh = ufma.htmFormat(liHtml, {
				dir: liArr[0].itemDir,
				seq: liArr[0].seq,
				pos: liArr[0].itemPos,
				name: liArr[0].itemTypeName,
				code: liArr[0].itemType,
				num: liArr[0].items.length
			});

			inputHtml = '<li class="rpt-query-box-li">' +
				'<label style="margin-left:-4px;" class="rpt-query-li-cont-title"><span>选择条件</span>></label>' +
				'<div class="rpt-query-li-cont">' +
				bh +
				'</div>' +
				'</li>';
		}

		if(liArr.length > 1) {
			for(var i = 1; i < liArr.length; i++) {
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
				//console.info(tagHtml);
				liHtml = liHtml0 + tagHtml + liHtml1;
				var bh = ufma.htmFormat(liHtml, {
					dir: liArr[i].itemDir,
					seq: liArr[i].seq,
					pos: liArr[i].itemPos,
					name: liArr[i].itemTypeName,
					code: liArr[i].itemType,
					num: liArr[i].items.length
				});
				inputHtml += ('<li class="rpt-query-box-li">' + bh + '</li>');
			}
		}
	} else if(type == "2") {
		if(liArr.length > 0) {
			for(var i = 0; i < liArr.length; i++) {
				tagHtml = "";
				if(liArr[i].items.length > 0) {
					for(var j = 0; j < liArr[0].items.length; j++) {
						var th = ufma.htmFormat('<li><span data-code="<%=tagCode%>" title="<%=tagName%>"><%=tagName%></span><b class="glyphicon icon-close"></b></li>', {
							tagCode: liArr[i].items[j].code,
							tagName: liArr[i].items[j].name
						});

						tagHtml += th;
					}
				}
				//console.info(tagHtml);
				liHtml = liHtml0 + tagHtml + liHtml1;
				var bh = ufma.htmFormat(liHtml, {
					dir: liArr[i].itemDir,
					seq: liArr[i].seq,
					pos: liArr[i].itemPos,
					name: liArr[i].itemTypeName,
					code: liArr[i].itemType,
					num: liArr[i].items.length
				});
				inputHtml += ('<li class="rpt-query-box-li">' + bh + '</li>');
			}
		}
	}
	//console.info(inputHtml);
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

//展开隐藏共享查询方案
rpt.showHideShareMethod = function() {
	$(rpt.namespace).on("click", "#showMethodTip", function() {
		//rpt.reqSharePrjList();
		$(this).siblings("div.rpt-share-method-box").show();
	});
	$(rpt.namespace).on("click", function(e) {
		if($(e.target).closest("#showMethodTip").length == 0 && $(e.target).closest("div.rpt-share-method-box").length == 0) {
			$("div.rpt-share-method-box").hide();
		}
	});
	$(rpt.namespace).on("mouseenter", "div.rpt-share-method-box", function() {
		$(this).show();
	}).on("mouseleave", "div.rpt-share-method-box", function() {
		$(this).hide();
	});
};

//展开隐藏-设置查询条件
rpt.showHideSettingBox = function() {
	$(rpt.namespace).find("#rpt-chr-setting-btn").on("click", function() {
		$(rpt.namespace).find("div.rpt-chr-setting-box").show();
	});
	$(rpt.namespace).find(".rpt-chr-setting-box .icon-close,.rpt-chr-setting-box .btn-default").on("click", function() {
		$(rpt.namespace).find("div.rpt-chr-setting-box").hide();
	});
	$(rpt.namespace).on("click", function(e) {
		if($(e.target).closest("#rpt-chr-setting-btn").length == 0 && $(e.target).closest("div.rpt-chr-setting-box").length == 0) {
			$("div.rpt-chr-setting-box").hide();
		}
	});
};

//显示更多查询方案
rpt.showMoreMethod = function() {
	$(rpt.namespace).on("click", "div.rpt-method-more", function() {
		//$(".rpt-method-box-cont").addClass("rpt-method-box-cont-show").animate({"height":($(".rpt-method-list").height()+9)+"px"});
		$(".rpt-method-box-cont").addClass("rpt-method-box-cont-show").css({
			"height": ($(".rpt-method-list").height() + 9) + "px",
			"padding-left": "76px"
		});
		$("ul.method-list").css({
			"margin-left": "43px"
		});
		$(".rpt-method-title").css({
			"left": "8px"
		});
		$(this).hide();
	});
	$(rpt.namespace).on("mouseenter", ".rpt-method-box-cont-show", function() {
			$(this).show();
		})
		.on("mouseleave", ".rpt-method-box-cont-show", function() {
			$(this).removeClass("rpt-method-box-cont-show").css({
				"height": "40px",
				"padding-left": "68px"
			});
			$("ul.rpt-method-list").css({
				"margin-left": "-32px"
			});
			$(".rpt-method-title").css({
				"left": "0px"
			});
			rpt.moreMethodBtn("rpt-method-list", "rpt-method-more");
		});
};

//打开-保存查询方案模态框
rpt.openSaveMethodModal = function() {
	$(rpt.namespace).find('#saveMethod').on('click', function() {
		var meLi = $(rpt.namespace).find(".rpt-method-list li.isUsed");
		if($(meLi).length > 0) {
			var code = $(meLi).find("span").attr("data-code");
			var name = $(meLi).find("span").text();
			var scope = $(meLi).find("span").attr("data-scope"); //作用域
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

//返回账表其他选项的数组对象
rpt.rptOptionArr = function() {
	var rptOptionArr = [];
	var labelDom;
	if(rpt.rptType == "GL_RPT_VOUSUMMARY") {
		labelDom = $(rpt.namespace).find(".rpt-check");
	} else {
		labelDom = $(rpt.namespace).find(".rpt-query-li-check label");
	}
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

//返回辅助项的数组对象
rpt.qryItemsArr = function() {
	var qryItemsArr = [];
	$(rpt.namespace).find(".rpt-query-box-li0").each(function(i) {
		//		var dis = $(this).css("display");
		//		console.info("dis=="+dis);
		//		if(dis != "none"){
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
				//				qryItemsObj.itemType = $(spanDom).data("code");//核算项类别代码
				qryItemsObj.itemType = $("#accList" + (i + 1)).getObj().getValue(); //核算项类别代码

				qryItemsObj.itemTypeName = $(spanDom).text(); //核算项类别名称

				//汇总级次
				qryItemsObj.itemLevel = $(this).find(".rpt-query-li-action input[type='hidden']").val();
				//显示
				if($(this).find(".isShowCol").prop("checked")) {
					qryItemsObj.isShowItem = "1";
				} else {
					qryItemsObj.isShowItem = "0";
				}
				//逐级汇总
				if($(this).find(".isSumCol").prop("checked")) {
					qryItemsObj.isGradsum = "1";
				} else {
					qryItemsObj.isGradsum = "0";
				}
			}

			qryItemsObj.seq = i; //核算项类别顺序号

			qryItemsObj.items = []; //选择的核算项的值
			var tagsLiDom = $(this).find(".rpt-tags-list li");
			if(tagsLiDom.length > 1) {
				for(var i = 0; i < tagsLiDom.length - 1; i++) {
					var itemObj = {};
					itemObj.code = $(tagsLiDom).eq(i).find("span").data("code").toString();
					itemObj.name = $(tagsLiDom).eq(i).find("span").text();
					qryItemsObj.items.push(itemObj);
				}
			}

			qryItemsArr.push(qryItemsObj);
		}
	})
	console.info(qryItemsArr)
	return qryItemsArr;
};

//返回方案内容对象
rpt.prjContObj = function() {
	//方案内容
	prjContObj = {};

	//会计体系代码
	prjContObj.accaCode = $(rpt.namespace + " #accaList").find(".btn-primary").data("code");

	//选择的单位账套信息
	prjContObj.agencyAcctInfo = [];
	var acctInfoObj = {};
	acctInfoObj.acctCode = rpt.nowAcctCode; //账套代码
	acctInfoObj.agencyCode = rpt.nowAgencyCode; //单位代码
	prjContObj.agencyAcctInfo.push(acctInfoObj);

	if(rpt.rptType == "GL_RPT_BAL" || rpt.rptType == "GL_RPT_LEDGER") {
		prjContObj.startDate = ""; //起始日期(如2017-01-01)
		prjContObj.endDate = ""; //截止日期(如2017-01-01)

		prjContObj.startYear = $(rpt.namespace + " #dateStart").datetimepicker('getDate').getFullYear(); //起始年度(只有年，如2017)
		prjContObj.startFisperd = $(rpt.namespace + " #dateStart").datetimepicker('getDate').getMonth() + 1; //起始期间(只有月份，如7)
		prjContObj.endYear = $(rpt.namespace + " #dateEnd").datetimepicker('getDate').getFullYear(); //截止年度(只有年，如2017)
		prjContObj.endFisperd = $(rpt.namespace + " #dateEnd").datetimepicker('getDate').getMonth() + 1; //截止期间(只有月份，如7)
	} else if(rpt.rptType == "GL_RPT_JOURNAL" || rpt.rptType == "GL_RPT_DAILYJOURNAL" || rpt.rptType == "GL_RPT_VOUSUMMARY" || rpt.rptType == "GL_RPT_COLUMNAR") {
		prjContObj.startDate = $(rpt.namespace + " #dateStart").val(); //起始日期(如2017-01-01)
		prjContObj.endDate = $(rpt.namespace + " #dateEnd").val(); //截止日期(如2017-01-01)

		prjContObj.startYear = ""; //起始年度(只有年，如2017)
		prjContObj.startFisperd = ""; //起始期间(只有月份，如7)
		prjContObj.endYear = ""; //截止年度(只有年，如2017)
		prjContObj.endFisperd = ""; //截止期间(只有月份，如7)
	} else {
		//		console.info("不是余额表、明细账、总账、日记账、凭证汇总表、多栏账,查看是否需要做细化处理！");
	}

	if(rpt.rptType != "GL_RPT_VOUSUMMARY") {
		//核算项设置
		prjContObj.qryItems = rpt.qryItemsArr();
		//查询条件对象
		prjContObj.rptCondItem = [];
	} else {
		prjContObj.qryItems = [];
		//查询条件对象
		prjContObj.rptCondItem = [{
				"condCode": "vouType",
				"condName": "凭证字号",
				"condText": $(rpt.namespace + " #rpt-pzzh-select option:checked").text(),
				"condValue": $(rpt.namespace + " #rpt-pzzh-select option:checked").val()
			},
			{
				"condCode": "vouTypeFrom",
				"condName": "凭证编号起",
				"condText": $(rpt.namespace + " #rpt-pzzh-input-form").val(),
				"condValue": $(rpt.namespace + " #rpt-pzzh-input-form").val()
			},
			{
				"condCode": "vouTypeTo",
				"condName": "凭证编号止",
				"condText": $(rpt.namespace + " #rpt-pzzh-input-to").val(),
				"condValue": $(rpt.namespace + " #rpt-pzzh-input-to").val()
			},
			{
				"condCode": "vouSource",
				"condName": "凭证来源",
				"condText": $(rpt.namespace + " #rpt-pzly-select option:checked").text(),
				"condValue": $(rpt.namespace + " #rpt-pzly-select option:checked").val()
			},
			{
				"condCode": "accoSumLevel",
				"condName": "汇总方式",
				"condText": $(rpt.namespace + " #rpt-hzfs-select option:checked").text(),
				"condValue": $(rpt.namespace + " #rpt-hzfs-select option:checked").val()
			}
		];
	}

	//账表查询项
	prjContObj.rptOption = rpt.rptOptionArr();

	if(rpt.rptType == "GL_RPT_JOURNAL") {
		prjContObj.curCode = $(rpt.namespace + " .rpt-table-sub-tip-currency i").attr("data-type"); //币种代码
		prjContObj.rptStyle = $(rpt.namespace + " .change-rpt-type i").attr("data-type"); //账表样式
	} else {
		prjContObj.curCode = ""; //币种代码
		prjContObj.rptStyle = ""; //账表样式
	}
	prjContObj.rptTitleName = $(rpt.namespace + " .rpt-table-title-show span").text(); //账表中标题名称

	return prjContObj;
};

//改变第一个辅助项(科目辅助项名称是下拉选择时需要用到)
rpt.changeFirstItem = function(itemCode) {
	//销毁所有树
	$(".ztree:not(#cbAgency_tree)").each(function() {
		var zId = $(this).attr("id");
		$.fn.zTree.destroy(zId);
	});

	$(".rpt-p-search-key").eq(0).find("input").attr("id", itemCode + "-data-key");
	$(".rpt-tree-data").eq(0).find("ul").attr("id", itemCode + "-data").html("");
	$(".rpt-tags-list").eq(0).html('<li class="rpt-li-over" style="display:none;">...</li>').css("width", "0");
	$(".rpt-tags-list").eq(0).siblings("p").css("width", "288px");
	$(".rpt-tags-num").eq(0).html('(<span>0</span>)').hide();
	$(".rpt-query-li-tip-c").eq(0).attr({
		"id": itemCode + "Tips",
		"data-item": itemCode
	});

	if(rpt.rptType == "GL_RPT_JOURNAL") {
		//请求第一个推荐
		rpt.reqItemTip(itemCode);

		//清空新增的辅助项
		$(".rpt-query-box-bottom .rpt-query-box-li0").remove();
	} else if(rpt.rptType == "GL_RPT_COLUMNAR") {
		$(".rpt-query-box-bottom .rpt-query-box-li").last().prevAll().remove();
	}

};

//根据会计科目范围实时改变选中的辅助项(余额表)
rpt.changeItems = function() {
	var accoCodeRange = rpt.checkItemTags("ACCO"); //选中会计科目范围
	accoCodeRange = accoCodeRange || ''; //选中会计科目范围
	accoCodeRange = accoCodeRange.split(',');
	var url = rpt.portList.rptAccItemTypeList + '?acctCode='+rpt.nowAcctCode+'&agencyCode='+rpt.nowAgencyCode+'&setYear='+rpt.nowSetYear+'&userId='+rpt.nowUserId;
	ufma.ajax(url, "POST", accoCodeRange, rpt.isShowItems);
};

//回调函数——改变选中的辅助项目
rpt.isShowItems = function(result) {
	var data = result.data.tips;
	var codeArr = [];
	for(var i = 0; i < data.length; i++) {
		codeArr.push(data[i].accItemType);
	}

	var topLi = $(".rpt-query-box-top").find("li.rpt-query-box-li");
	if(topLi.length > 1) {
		for(var i = 1; i < topLi.length; i++) {
			var code = $(topLi).eq(i).find("label span").data("code");
			if($.inArray(code, codeArr) == "-1") {
				$(topLi).eq(i).remove();
			}
			//			else if(code != "ACCO"){
			//				$(topLi).eq(i).find(".rpt-tags-list").html('<li class="rpt-li-over" style="display:none;">...</li>');
			//				$(topLi).eq(i).find(".rpt-tags-num").hide().html('(<span>0</span>)');
			//			}
		}
	}
	var bottomLi = $(".rpt-query-box-bottom").find("li.rpt-query-box-li");
	if(bottomLi.length > 2) {
		for(var i = 0; i < bottomLi.length - 2; i++) {
			var code = $(bottomLi).eq(i).find("label span").data("code");
			if($.inArray(code, codeArr) == "-1") {
				$(bottomLi).eq(i).remove();
			}
			//			else if(code != "ACCO"){
			//				$(bottomLi).eq(i).find(".rpt-tags-list").html('<li class="rpt-li-over" style="display:none;">...</li>');
			//				$(bottomLi).eq(i).find(".rpt-tags-num").hide().html('(<span>0</span>)');
			//			}
		}
	}
};

/**账表页面通用请求回调方法***********************************************************************/

//----------------------币种列表 start-------------------------//
//请求币种列表
rpt.reqCurrType = function() {
	var reqUrl = rpt.portList.getCurrType;
	var agencyCode = "";
	if(rpt.nowAgencyCode == "" || rpt.nowAgencyCode == undefined || rpt.nowAgencyCode == "undefined") {
		agencyCode = "*";
	} else {
		agencyCode = rpt.nowAgencyCode;
	}
	ufma.ajax(reqUrl, "get", {
		"agencyCode": agencyCode
	}, function(result) {
		var data = result.data;
		if(data.length > 0) {
			var selectHtml = "";
			for(var i = 0; i < data.length; i++) {
				var sHtml = ufma.htmFormat('<option value="<%=code%>"><%=name%></option>', {
					code: data[i].currencyCode,
					name: data[i].currencyName
				});
				selectHtml += sHtml;
			}
			$(rpt.namespace + " .rpt-table-sub-tip-currency select").html(selectHtml);
			$(rpt.namespace + " .rpt-table-sub-tip-currency select").val(data[0].currencyCode);
			$(rpt.namespace + " .rpt-table-sub-tip-currency i").text(data[0].currencyName);
			$(rpt.namespace + " .rpt-table-sub-tip-currency i").attr("data-type", data[0].currencyCode);
		}
	});
};
//----------------------币种列表 end-----------------------------//

//----------------------凭证字号 start-------------------------//
//请求凭证字号列表
rpt.reqVoutype = function() {
	var reqUrl = rpt.portList.getVoutype + rpt.nowAgencyCode + "/" + rpt.nowSetYear;
	ufma.ajax(reqUrl, "get", "", function(result) {
		var data = result.data;
		var selectHtml = "";
		for(var i = 0; i < data.length; i++) {
			var sHtml = ufma.htmFormat('<option value="<%=code%>"><%=name%></option>', {
				code: data[i].CHR_CODE,
				name: data[i].CHR_NAME
			});
			selectHtml += sHtml;
		}

		selectHtml = '<option value=""></option>' + selectHtml;
		$(rpt.namespace + " #rpt-pzzh-select").html(selectHtml);
	});
};
//----------------------凭证字号 end-----------------------------//

//----------------------凭证类型、字号 start-------------------------//
//请求凭证类型、字号列表
rpt.getVouTypeFull = function() {
	var reqUrl = rpt.portList.getVouTypeFull + rpt.nowAgencyCode + "/" + rpt.nowSetYear;
	ufma.ajax(reqUrl, "get", "", function(result) {
		var data = result.data;
		var selectHtml = "";
		for(var i = 0; i < data.length; i++) {
			var sHtml = ufma.htmFormat('<option value="<%=code%>" data-name="<%=name%>"><%=fullName%></option>', {
				code: data[i].CHR_CODE,
				name: data[i].CHR_NAME,
				fullName: data[i].VOU_FULLNAME
			});
			selectHtml += sHtml;
		}
		$(rpt.namespace + " #rpt-pzlx-select").html(selectHtml);

		var selectHtml2 = "";
		for(var i = 0; i < data.length; i++) {
			var sHtml2 = ufma.htmFormat('<option value="<%=code%>" data-fullname="<%=fullName%>"><%=name%></option>', {
				code: data[i].CHR_CODE,
				name: data[i].CHR_NAME,
				fullName: data[i].VOU_FULLNAME
			});
			selectHtml2 += sHtml2;
		}
		$(rpt.namespace + " #rpt-pzzh-select").html(selectHtml2);

	});
};
//----------------------凭证类型、字号 end-----------------------------//

//----------------------汇总方式 start-------------------------//
//请求汇总方式列表
rpt.reqEleLevelNum = function() {
	var argu = {
		"agencyCode": rpt.nowAgencyCode,
		"acctCode": rpt.nowAcctCode,
		"eleCode": "ACCO"
	};
	ufma.ajax(rpt.portList.getEleLevelNum, "get", argu, function(result) {
		var data = result.data;
		var selectHtml = "";
		for(var i = 0; i < data.length; i++) {
			var sHtml = ufma.htmFormat('<option value="<%=code%>"><%=name%></option>', {
				code: data[i].levelNum,
				name: data[i].levelNumText
			});
			selectHtml += sHtml;
		}
		$(rpt.namespace + " #rpt-hzfs-select").html(selectHtml);
	});
};
//----------------------汇总方式 end-----------------------------//

//----------------------凭证来源 start-------------------------//
//请求凭证来源列表
rpt.getVOU_SOURCE = function() {
	ufma.ajax(rpt.portList.getVOU_SOURCE, "get", "", function(result) {
		var data = result.data;
		var pzlyHtml = "";
		for(var i = 0; i < data.length; i++) {
			var oHtml = ufma.htmFormat('<option value="<%=code%>"><%=name%></option>', {
				code: data[i].ENU_CODE,
				name: data[i].ENU_NAME
			});
			pzlyHtml += oHtml;
		}
		pzlyHtml = '<option value="*">全部</option>' + pzlyHtml;
		$(rpt.namespace + " #rpt-pzly-select").html(pzlyHtml);
	})
};
//----------------------凭证来源 end-----------------------------//

//----------------------单位列表 start-------------------------//
//请求单位列表
rpt.reqAgencyList = function() {
	//	var agencyArgu = {
	//		"agencyCode":rpt.nowAgencyCode,
	//		"userId":rpt.nowUserId,
	//		"setYear":rpt.nowSetYear
	//	};
	ufma.ajax(rpt.portList.agencyList, "get", "", function(result) {
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
			rpt.cbAgency.setValue(code, codeName);
			rpt.nowAgencyCode = code;
			rpt.nowAgencyName = name;
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
	ufma.ajax(rpt.portList.acctList, "get", acctArgu, function(result) {
		var data = result.data;
		rpt.cbAcct = $("#cbAcct").ufmaCombox2({
			data: data
		});
		if(data.length > 0) {
			var code = data[0].CHR_CODE;
			var name = data[0].CHR_NAME;
			var codeName = data[0].CODE_NAME;

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

//----------------------账套列表 end-----------------------------//

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

			if(rpt.sessionKeyArr.length > 0) {
				for(var i = 0; i < rpt.sessionKeyArr.length; i++) {
					sessionStorage.removeItem(rpt.sessionKeyArr[i]);
				}
			}
			$("div.rpt-tree-data").hide();

			//请求账套列表
			rpt.reqAcctList();

			if(rpt.rptType == "GL_RPT_BAL") {
				//表格单位信息
				$(".rpt-table-sub-tip1").find("span").eq(0).text(rpt.nowAgencyName);
				rpt.isSetAcc = false;
			} else if(rpt.rptType == "GL_RPT_JOURNAL") {
				//表格单位信息
				$(".rpt-table-sub-tip1").find("span").eq(0).text(rpt.nowAgencyName);
				//请求币种列表
				rpt.reqCurrType();
			} else if(rpt.rptType == "GL_RPT_LEDGER" || rpt.rptType == "GL_RPT_DAILYJOURNAL") {
				//表格单位信息
				$(".rpt-table-sub-tip1").find("span").eq(0).text(rpt.nowAgencyName);
				//还原查询条件
				rpt.clearTagsTree();
			} else if(rpt.rptType == "GL_RPT_VOUSUMMARY") {
				//请求凭证字号列表
				rpt.reqVoutype();
			} else if(rpt.rptType == "GL_RPT_COLUMNAR") {
				//表格单位信息
				$(".rpt-table-sub-tip1").find("span").eq(0).text(rpt.nowAgencyName);
				//请求科目辅助项下拉列表
				rpt.reqSelectItems();
			} else if(rpt.rptType == "GL_RPT_CFSTATEMENT") {
				//表格单位信息
				$(".rpt-table-sub-tip1").find("span").eq(0).text(rpt.nowAgencyName);
			} else if(rpt.rptType == "GL_RPT_CHRBOOK") {
				//表格单位信息
				$(".rpt-table-sub-tip1").find("span").eq(0).text(rpt.nowAgencyName);
				//请求凭证类型、字号列表
				rpt.getVouTypeFull();
			} else {
				//				console.info("不是余额表、明细账、总账、日记账、凭证汇总表、多栏账、现金流量统计表、序时账，请做细化处理！");
			}
		}
	});
};

//初始化账套选择样式及change事件
rpt.initAcctList = function() {
	rpt.cbAcct = $("#cbAcct").ufmaCombox2({
		valueField: 'CHR_CODE',
		textField: 'CODE_NAME',
		readOnly: false,
		placeholder: '请选择账套',
		icon: 'icon-book',
		onchange: function(data) {
			//			console.info(data);
			//给全局账套变量赋值
			rpt.nowAcctCode = data.CHR_CODE;
			rpt.nowAcctName = data.CHR_NAME;
			//			console.info(rpt.nowAcctName);
			if(rpt.sessionKeyArr.length > 0) {
				for(var i = 0; i < rpt.sessionKeyArr.length; i++) {
					sessionStorage.removeItem(rpt.sessionKeyArr[i]);
				}
			}
			$("div.rpt-tree-data").hide();

			rpt.reqAccList();

			/*//请求查询方案列表
			rpt.reqPrjList();
			//请求共享方案列表
			rpt.reqSharePrjList();*/
			dm.showPlan({
				"agencyCode": dm.svAcctCode,
				"acctCode": dm.svAcctCode,
				"rptType": rpt.rptType,
				"userId": dm.svUserId, //修改权限  将svUserCode改为 svUserId  20181012
				"setYear": dm.svSetYear
			});

			//请求会计体系列表
			rpt.reqAccaList();

			if(rpt.rptType == "GL_RPT_BAL") {
				//表格账套信息
				$(".rpt-table-sub-tip1").find("span").eq(1).text(rpt.nowAcctName);
				rpt.isSetAcc = false;
			} else if(rpt.rptType == "GL_RPT_JOURNAL") {
				//表格账套信息
				$(".rpt-table-sub-tip1").find("span").eq(1).text(rpt.nowAcctName);
			} else if(rpt.rptType == "GL_RPT_COLUMNAR") {
				//表格账套信息
				$(".rpt-table-sub-tip1").find("span").eq(1).text(rpt.nowAcctName);
				//请求科目辅助项下拉列表
				rpt.reqSelectItems();
			} else if(rpt.rptType == "GL_RPT_LEDGER" || rpt.rptType == "GL_RPT_DAILYJOURNAL") {
				//表格账套信息
				$(".rpt-table-sub-tip1").find("span").eq(1).text(rpt.nowAcctName);
				//还原查询条件
				rpt.clearTagsTree();
			} else if(rpt.rptType == "GL_RPT_VOUSUMMARY") {
				//请求汇总方式列表
				rpt.reqEleLevelNum();
			} else if(rpt.rptType == "GL_RPT_CFSTATEMENT") {
				//现金流量统计表不需要特殊处理
			} else if(rpt.rptType == "GL_RPT_CHRBOOK") {
				//表格账套信息
				$(".rpt-table-sub-tip1").find("span").eq(1).text(rpt.nowAcctName);
			} else {
				//
				//				console.info("不是余额表、明细账、总账、日记账、凭证汇总表、多栏账、现金流量统计表、序时账，请做细化处理！");
			}
		}
	});

};

//填充五个辅助下拉列表
rpt.reqAccList = function() {
	var url = rpt.portList.rptAccItemTypeList + '?acctCode='+rpt.nowAcctCode+'&agencyCode='+rpt.nowAgencyCode+'&setYear='+rpt.nowSetYear+'&userId='+rpt.nowUserId;
	ufma.ajax(url, "POST", [], function(result) {
		var listItem = result.data;
		//		var listItem = [
		//			{"accItemCode":"ACCO","accItemName":"会计科目"},
		//			{"accItemCode":"EXPFUNC","accItemName":"功能分类"},
		//			{"accItemCode":"PROJECT","accItemName":"项目"},
		//			{"accItemCode":"FUNDSOURCE","accItemName":"经费来源"},
		//			{"accItemCode":"DEPARTMENT","accItemName":"部门"},
		//			{"accItemCode":"EXPECO","accItemName":"部门预算经济分类"},
		//			{"accItemCode":"CURRENT","accItemName":"往来单位"},
		//			{"accItemCode":"EMPLOYEE","accItemName":"人员"}
		//		];
		var oneArr = [{
			"accItemCode": "",
			"accItemName": "请选择"
		}];
		var newArr = oneArr.concat(listItem);
		$("#accList1").getObj().load(newArr);
		$("#accList2").getObj().load(newArr);
		$("#accList3").getObj().load(newArr);
		$("#accList4").getObj().load(newArr);
		$("#accList5").getObj().load(newArr);

		rpt.resBackQuery();

		//明细账是否加载完毕
		rpt.journalLoaded = true;
	});
};

//----------------------科目推荐列表 start-----------------------//
//请求函数——科目推荐列表
rpt.reqItemTip = function(eleCode) {
	var accoArgu = {
		"agencyCode": rpt.nowAgencyCode,
		"acctCode": rpt.nowAcctCode,
		"eleCode": eleCode,
		"userId": rpt.nowUserId,
		"setYear": rpt.nowSetYear
	};
	ufma.ajax(rpt.portList.tipsList, "get", accoArgu, rpt.showTipsList);
};
//回调函数——科目推荐列表
rpt.showTipsList = function(result) {
	//console.info(JSON.stringify(result));
	var eleCode = result.data.eleCode;
	var list = result.data.tipsData;
	var spanHtml = "";
	for(var i = 0; i < list.length; i++) {
		//console.info(JSON.stringify(list[i]));
		//console.info(list[i].chrName);
		var iHtml = ufma.htmFormat('<i title="<%=name%>" data-code="<%=code%>" ><%=name%></i>', {
			code: list[i].chrCode,
			name: list[i].chrName
		});
		spanHtml += iHtml;
	}
	$("#" + eleCode + "Tips").html(spanHtml);
};
//----------------------科目推荐列表end-------------------------//

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

	//var divHtml = '<button class="btn btn-default" data-code="1">财务会计</button><button class="btn btn-default" data-code="2">预算会计</button>';
	divHtml = '<button class="btn btn-primary" data-code="*">全部</button>' + divHtml;
	$("#accaList").html(divHtml);

	if(list.length == 1) {
		if(rpt.rptType == "GL_RPT_VOUSUMMARY") {
			$(".accaList-title,#accaList").hide();
			$(".rpt-query-date").css("margin-left", "-90px");
		} else if(rpt.rptType == "GL_RPT_JOURNAL") {
			$(".accaList-title,#accaList").hide();
			$(".rpt-query-date").css("margin-left", "-79px");
		} else if(
			rpt.rptType == "GL_RPT_BAL" ||
			rpt.rptType == "GL_RPT_LEDGER" ||
			rpt.rptType == "GL_RPT_DAILYJOURNAL" ||
			rpt.rptType == "GL_RPT_COLUMNAR" ||
			rpt.rptType == "GL_RPT_CHRBOOK"
		) {
			$(".accaList-title,#accaList").hide();
			$(".rpt-query-date").css("margin-left", "-81px");
		}
	} else if(list.length == 2) {
		if(
			rpt.rptType == "GL_RPT_VOUSUMMARY" ||
			rpt.rptType == "GL_RPT_JOURNAL" ||
			rpt.rptType == "GL_RPT_BAL" ||
			rpt.rptType == "GL_RPT_LEDGER" ||
			rpt.rptType == "GL_RPT_DAILYJOURNAL" ||
			rpt.rptType == "GL_RPT_COLUMNAR" ||
			rpt.rptType == "GL_RPT_CHRBOOK"
		) {
			$(".accaList-title,#accaList").show();
			$(".rpt-query-date").css("margin-left", "0");
		}
	}
};
//----------------------会计体系列表end-------------------------//

//----------------------查询方案列表 start------------------------//
//请求函数——查询方案列表
rpt.reqPrjList = function() {
	var prjArgu = {
		"agencyCode": rpt.nowAgencyCode,
		"acctCode": rpt.nowAcctCode,
		"rptType": rpt.rptType,
		"userId": rpt.nowUserId,
		"setYear": rpt.nowSetYear
	};
	ufma.ajax(rpt.portList.prjList, "get", prjArgu, rpt.showPrjList);
};
//回调函数——查询方案列表
rpt.showPrjList = function(result) {
	var prjList = result.data;
	var methodHtml = "";
	for(var i = 0; i < prjList.length; i++) {
		var liHtml = ufma.htmFormat('<li><span data-code="<%=code%>" data-scope="<%=scope%>"><%=name%></span><b class="glyphicon icon-close"></b></li>', {
			code: prjList[i].prjCode,
			name: prjList[i].prjName,
			scope: prjList[i].prjScope
		});
		methodHtml += liHtml;
	}
	$(".rpt-method-list").html(methodHtml);

	//判断更多查询方案按钮是否显示
	rpt.moreMethodBtn("rpt-method-list", "rpt-method-more");
};
//----------------------查询方案列表 end-------------------------//

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

//----------------------请求查询条件其他选项列表 start---------------//
//请求函数——请求查询条件其他选项列表
rpt.reqOptList = function() {
	ufma.ajax(rpt.portList.optList, "get", {
		"rptType": rpt.rptType,
		"userId": rpt.nowUserId,
		"setYear": rpt.nowSetYear
	}, rpt.showOptList);
};
//回调函数——请求查询条件其他选项列表
rpt.showOptList = function(result) {
	var optArr = result.data;
	if(rpt.rptType == "GL_RPT_VOUSUMMARY") {
		var pzztHtml = ""; //凭证状态
		var hzfsHtml = ""; //汇总方式
		for(var i = 0; i < optArr.length; i++) {

			var bool = optArr[i].defCompoValue;
			var defaultChecked = false;
			if(bool == "Y") {
				defaultChecked = "checked";
			} else if(bool == "N") {
				defaultChecked = "";
			}
			var lab = ufma.htmFormat('<label class="rpt-check mt-checkbox mt-checkbox-outline"><input type="checkbox" <%=flag%> id="<%=id%>" ><%=name%><span></span></label>', {
				flag: defaultChecked,
				name: optArr[i].optName,
				id: optArr[i].optCode
			});

			if(optArr[i].optCode.substring(0, 11) == "IS_VOUSTAT_") {
				pzztHtml += lab;
			} else {
				hzfsHtml += lab;
			}
		}
		$(".rpt-pzzt-check").html(pzztHtml);
		$(".rpt-hzfs-check").html(hzfsHtml);

	} else {
		var checkHtml = "";
		for(var i = 0; i < optArr.length; i++) {
			var bool = optArr[i].defCompoValue;
			var defaultChecked = false;
			if(bool == "Y") {
				defaultChecked = "checked";
			} else if(bool == "N") {
				defaultChecked = "";
			}
			var lab = ufma.htmFormat('<label class="mt-checkbox mt-checkbox-outline"><input type="checkbox" <%=flag%> id="<%=id%>" ><%=name%><span></span></label>', {
				flag: defaultChecked,
				name: optArr[i].optName,
				id: optArr[i].optCode
			});
			checkHtml += lab;
		}
		$(".rpt-query-li-check").html(checkHtml);
	}
};
//----------------------请求查询条件其他选项列表 end-----------------//

//----------------------请求会计科目树 辅助项目树 start---------------//
//请求函数——请求会计科目树
rpt.reqAccoTree = function(radioType) {
	//会计体系代码
	var accaCode = $("#accaList").find("button.btn-primary").data("code");
	var treeArgu = {};
	if(accaCode == "*") {
		treeArgu = {
			"acctCode": rpt.nowAcctCode,
			"agencyCode": rpt.nowAgencyCode,
			"setYear": rpt.nowSetYear,
			"userId": rpt.nowUserId
		};
	} else {
		treeArgu = {
			"accaCode": accaCode,
			"acctCode": rpt.nowAcctCode,
			"agencyCode": rpt.nowAgencyCode,
			"setYear": rpt.nowSetYear,
			"userId": rpt.nowUserId
		};
	}
	ufma.ajax(rpt.portList.accoTree, "get", treeArgu, function(result) {
		var zNodes = result.data.treeData;
		var treeId = result.data.treeId + "-data";
		if(zNodes.length > 0) {
			if(rpt.rptType == "GL_RPT_LEDGER") {
				rpt.selectTree(treeId, zNodes, false, radioType);
			} else {
				rpt.selectTree(treeId, zNodes, true, radioType);
			}

			$("#" + treeId).parent("div.rpt-tree-data").show();
			$("#" + treeId + "-key").focus();

			var zNodesStr = JSON.stringify(zNodes);
			var treeKey = ufma.sessionKey(rpt.module, rpt.compoCode, rpt.rgCode, rpt.nowSetYear, rpt.nowAgencyCode, rpt.nowAcctCode, rpt.namespace + result.data.treeId);
			sessionStorage.setItem(treeKey, zNodesStr);
			rpt.sessionKeyArr.push(treeKey);
		} else {
			ufma.showTip("数据为空！", function() {}, "warning");
		}
	});
};
//请求函数——辅助项目树
rpt.reqAccItemTree = function(accItemType, radioType) {
	//选中会计科目范围
	//	var accoCodeRange = "";
	//	if(rpt.rptType == "GL_RPT_BAL"){
	//		accoCodeRange = rpt.checkItemTags("ACCO");
	//	}else if(rpt.rptType == "GL_RPT_JOURNAL"){
	//		accoCodeRange = "*";
	//	}

	var treeArgu = {
		//		"accoCodeRange":accoCodeRange,
		"eleCode": accItemType,
		"acctCode": rpt.nowAcctCode,
		"agencyCode": rpt.nowAgencyCode,
		"setYear": rpt.nowSetYear,
		"userId": rpt.nowUserId
	};
	ufma.ajax(rpt.portList.accItemTree, "get", treeArgu, function(result) {
		var zNodes = result.data;
		if(zNodes.length > 0) {
			var treeId = result.data[0].eleCode + "-data";
			//		console.info(treeId);
			if(rpt.rptType == "GL_RPT_LEDGER") {
				rpt.selectTree(treeId, zNodes, false, radioType);
			} else {
				rpt.selectTree(treeId, zNodes, true, radioType);
			}

			$("#" + treeId).parent("div.rpt-tree-data").show();
			$("#" + treeId + "-key").focus();

			var zNodesStr = JSON.stringify(zNodes);
			var treeKey = ufma.sessionKey(rpt.module, rpt.compoCode, rpt.rgCode, rpt.nowSetYear, rpt.nowAgencyCode, rpt.nowAcctCode, rpt.namespace + result.data.treeId);
			sessionStorage.setItem(treeKey, zNodesStr);
			rpt.sessionKeyArr.push(treeKey);
		} else {
			ufma.showTip("数据为空！", function() {}, "warning");
		}
	});
};
//回调函数——创建返回树
rpt.resCreateTree = function(result) {
	var zNodes = result.data.treeData;
	var treeId = result.data.treeId + "-data";
	if(zNodes.length > 0) {
		if(rpt.rptType == "GL_RPT_LEDGER") {
			rpt.selectTree(treeId, zNodes, false);
		} else {
			rpt.selectTree(treeId, zNodes, true);
		}

		$("#" + treeId).parent("div.rpt-tree-data").show();
		$("#" + treeId + "-key").focus();

		var zNodesStr = JSON.stringify(zNodes);
		var treeKey = ufma.sessionKey(rpt.module, rpt.compoCode, rpt.rgCode, rpt.nowSetYear, rpt.nowAgencyCode, rpt.nowAcctCode, rpt.namespace + result.data.treeId);
		sessionStorage.setItem(treeKey, zNodesStr);
		rpt.sessionKeyArr.push(treeKey);
	} else {
		ufma.showTip("数据为空！", function() {}, "warning");
	}
};
//回调函数——创建返回树
rpt.resCreateTree2 = function(result) {
	var zNodes = result.data;
	if(zNodes.length > 0) {
		var treeId = result.data[0].eleCode + "-data";
		//		console.info(treeId);
		if(rpt.rptType == "GL_RPT_LEDGER") {
			rpt.selectTree(treeId, zNodes, false);
		} else {
			rpt.selectTree(treeId, zNodes, true);
		}

		$("#" + treeId).parent("div.rpt-tree-data").show();
		$("#" + treeId + "-key").focus();

		var zNodesStr = JSON.stringify(zNodes);
		var treeKey = ufma.sessionKey(rpt.module, rpt.compoCode, rpt.rgCode, rpt.nowSetYear, rpt.nowAgencyCode, rpt.nowAcctCode, rpt.namespace + result.data.treeId);
		sessionStorage.setItem(treeKey, zNodesStr);
		rpt.sessionKeyArr.push(treeKey);
	} else {
		ufma.showTip("数据为空！", function() {}, "warning");
	}
};
//----------------------请求会计科目树 辅助项目树 end-----------------//

//----------------------保存方案 start--------------------------//
//请求函数——请求保存方案
rpt.reqSavePrj = function() {
	var savePrjArgu = {};

	savePrjArgu.acctCode = rpt.nowAcctCode; //账套代码
	savePrjArgu.agencyCode = rpt.nowAgencyCode; //单位代码

	savePrjArgu.prjCode = $("#methodName").attr("data-code"); //方案代码
	savePrjArgu.prjName = $("#methodName").val(); //方案名称
	savePrjArgu.prjScope = $('input:radio[name="prjScope"]:checked').val() //方案作用域
	savePrjArgu.rptType = $(".rptType").val(); //账表类型
	savePrjArgu.setYear = rpt.nowSetYear; //业务年度
	savePrjArgu.userId = rpt.nowUserId; //用户Id

	//方案内容
	//savePrjArgu.prjContent = JSON.stringify(rpt.prjContObj());
	savePrjArgu.prjContent = rpt.prjContObj();

	//	console.info(JSON.stringify(savePrjArgu));
	ufma.ajax(rpt.portList.savePrj, "post", savePrjArgu, rpt.resSavePrj);
};
//回调函数——请求保存方案
rpt.resSavePrj = function(result) {
	var flag = result.flag;
	var prjCode = result.data.prjCode;
	var prjScope = result.data.prjScope;
	if(flag == "success") {
		var meLi = $(".rpt-method-list li.isUsed");
		if($(meLi).length > 0) {
			$(meLi).find("span").text($("#methodName").val().trim());
			$(meLi).find("span").attr("data-scope", prjScope);
			$(meLi).find("span").attr("data-code", prjCode);
		} else {
			var newMethod = '<li><span data-code="' + prjCode + '" data-scope="' + prjScope + '">' + $("#methodName").val().trim() + '</span><b class="glyphicon icon-close"></b></li>';
			$('.rpt-method-list').append($(newMethod));
		}

		rpt.setQuery.close();
		rpt.moreMethodBtn("rpt-method-list", "rpt-method-more");
		ufma.showTip("查询方案保存成功！", function() {}, "success");
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
		"rptType": rpt.rptType,
		"setYear": rpt.nowSetYear,
		"userId": rpt.nowUserId
	};
	ufma.ajax(rpt.portList.prjContent, "get", prjContArgu, rpt.showPrjCont);
};

rpt.firstTxt = "";
rpt.ACCOtext = "";
//回调函数——展示查询方案内容
rpt.showPrjCont = function(result) {
	if(rpt.sessionKeyArr.length > 0) {
		for(var i = 0; i < rpt.sessionKeyArr.length; i++) {
			sessionStorage.removeItem(rpt.sessionKeyArr[i]);
		}
	}

	//方案内容对象
	var cont = eval('(' + result.data.prjContent + ')');
	//var cont = result.data.prjContent;
	//	console.info(JSON.stringify(cont));

	//会计体系
	var accaCode = cont.accaCode;
	if(accaCode == "*") {
		accaCode = 0;
	}
	$("#accaList").find("button").removeClass("btn-primary").addClass("btn-default");
	$("#accaList").find("button").eq(accaCode).removeClass("btn-default").addClass("btn-primary");

	//期间**************start
	//明细账、日记账、凭证汇总表
	if(rpt.rptType == "GL_RPT_JOURNAL" || rpt.rptType == "GL_RPT_DAILYJOURNAL" || rpt.rptType == "GL_RPT_VOUSUMMARY" || rpt.rptType == "GL_RPT_COLUMNAR") {
		var startDate = cont.startDate; //开始日期
		var endDate = cont.endDate; //截至日期
		$("#dateStart").datetimepicker('setDate', (new Date(startDate)));
		$("#dateEnd").datetimepicker('setDate', (new Date(endDate)));
	}
	//总账
	else if(rpt.rptType == "GL_RPT_LEDGER" || rpt.rptType == "GL_RPT_BAL") {
		var startYear = cont.startYear; //起始年度
		var startFisperd = cont.startFisperd; //起始月份
		var endYear = cont.endYear; //结束年度
		var endFisperd = cont.endFisperd; //结束月份
		$("#dateStart").datetimepicker('setDate', (new Date(startYear, startFisperd - 1)));
		$("#dateEnd").datetimepicker('setDate', (new Date(endYear, endFisperd - 1)));
	} else {
		//		console.info("不是余额表、明细账、总账、日记账、凭证汇总表、多栏账,查看是否需要做细化处理！");
	}
	//期间**************end

	//辅助核算项目**************start
	//明细账、余额表
	if(rpt.rptType == "GL_RPT_JOURNAL" || rpt.rptType == "GL_RPT_BAL" || rpt.rptType == "GL_RPT_LEDGER") {
		//辅助核算项目
		var qryItems = cont.qryItems;
		rpt.accQueryShow(qryItems);
	}
	//总账、日记账
	else if(rpt.rptType == "GL_RPT_DAILYJOURNAL") {

		//辅助核算项目
		var qryItems = cont.qryItems;
		var ulTop = $(".rpt-query-box-top");
		$(ulTop).find("li").eq(1).remove();
		var topArr = [];
		topArr.push(qryItems[0]);
		var ulTopHtml = rpt.queryInputHtml(topArr);
		$(ulTop).find("li:last-child").before($(ulTopHtml));

		//请求对应的推荐
		for(var i = 0; i < qryItems.length; i++) {
			rpt.reqItemTip(qryItems[0].itemType);
		}

	}
	//凭证汇总表
	else if(rpt.rptType == "GL_RPT_VOUSUMMARY") {
		//凭证汇总表不需要此内容
	}
	//多栏账
	else if(rpt.rptType == "GL_RPT_COLUMNAR") {
		//console.info("请处理多栏账方案展示");
		//辅助核算项目
		var qryItems = cont.qryItems;
		if(qryItems.length > 0) {
			//第一条辅助核算项
			var items1 = qryItems[0];
			var items1Code = qryItems[0].itemType;
			$("#selectTitle").val(items1Code);
			$("#selectTitle").attr({
				"data-seq": qryItems[0].seq,
				"data-pos": qryItems[0].itemPos,
				"data-dir": qryItems[0].itemDir
			});
			rpt.changeFirstItem(items1Code);

			//借贷方向
			var btn = $(rpt.namespace).find(".rpt-query-li-tip .rpt-btn-switch button");
			if(qryItems[0].itemDir == "dr") {
				//借方
				$(btn).eq(0).addClass("btn-primary").removeClass("btn-default");
				$(btn).eq(1).addClass("btn-default").removeClass("btn-primary");
			} else if(qryItems[0].itemDir == "cr") {
				//贷方
				$(btn).eq(1).addClass("btn-primary").removeClass("btn-default");
				$(btn).eq(0).addClass("btn-default").removeClass("btn-primary");
			}

			//填入选中标签
			if(qryItems[0].items.length > 0) {
				var tagHtml = "";
				for(var j = 0; j < qryItems[0].items.length; j++) {
					var th = ufma.htmFormat('<li><span data-code="<%=tagCode%>" title="<%=tagName%>"><%=tagName%></span><b class="glyphicon icon-close"></b></li>', {
						tagCode: qryItems[0].items[j].code,
						tagName: qryItems[0].items[j].name
					});

					tagHtml += th;
				}
				//console.info(tagHtml);
				$(rpt.namespace + " .rpt-li-over").before($(tagHtml));
				$(rpt.namespace + " .rpt-tags-num").eq(0).find("span").text(qryItems[0].items.length);
			}

			if(qryItems.length > 1) {
				//剩下的辅助核算项
				var moreItems = [];
				for(var i = 1; i < qryItems.length; i++) {
					moreItems.push(qryItems[i]);
				}
				var moreHtml = rpt.queryCondHtml(moreItems, 1);
				//展示方案中的辅助项
				$(rpt.namespace + " .rpt-query-li-check").parents("li.rpt-query-box-li").before($(moreHtml));

			}

		}
	}
	//其他
	else {
		//		console.info("不是余额表、明细账、总账、日记账、凭证汇总表、多栏账,查看是否需要做细化处理！");
	}

	if(rpt.rptType != "GL_RPT_VOUSUMMARY") {
		//显示选中的标签
		$("ul.rpt-tags-list").each(function() {
			var ulDom = this;
			var numDom = $(ulDom).siblings("div.rpt-tags-num").find("span");
			rpt.selectTip(ulDom, numDom);
		});
	}
	//辅助核算项目****************end

	//查询条件对象（凭证汇总表）
	if(rpt.rptType == "GL_RPT_VOUSUMMARY") {
		rptCondItem = cont.rptCondItem;
		for(var i = 0; i < rptCondItem.length; i++) {
			var condCode = rptCondItem[i].condCode;
			var condValue = rptCondItem[i].condValue;
			if(condCode == "vouType") { //凭证字号
				$(rpt.namespace + " #rpt-pzzh-select").val(condValue);
			} else if(condCode == "vouTypeFrom") { //凭证编号起
				$(rpt.namespace + " #rpt-pzzh-input-form").val(condValue);
			} else if(condCode == "vouTypeTo") { //凭证编号止
				$(rpt.namespace + " #rpt-pzzh-input-to").val(condValue);
			} else if(condCode == "vouSource") { //凭证来源
				$(rpt.namespace + " #rpt-pzly-select").val(condValue);
			} else if(condCode == "accoSumLevel") { //凭证汇总
				$(rpt.namespace + " #rpt-hzfs-select").val(condValue);
			}
		}
	}

	//其他
	var rptOption = {
		"data": cont.rptOption
	};
	rpt.showOptList(rptOption);

	//表格名称
	rptTitleName = cont.rptTitleName;
	$(".rpt-table-title-show span").text(rptTitleName);

	//表格类型
	if(rpt.rptType == "GL_RPT_JOURNAL") {
		rptStyle = cont.rptStyle; //账表样式
		var rptStyleName = "";
		if(rptStyle == "SANLAN") {
			rptStyleName = "三栏式";
		} else if(rptStyle == "WAIBI") {
			rptStyleName = "外币式";

			curCode = cont.curCode; //币种代码
			//请求币种名称
			//ufma.ajax(rpt.portList.)

		} else if(rptStyle == "SHULIANG") {
			rptStyleName = "数量金额式";
		} else {
			rptStyleName = "尚未定义";
		}
		$(rpt.namespace + " .change-rpt-type i").text(rptStyleName).attr("data-type", rptStyle);

	}

	//展开更多查询
	$('.rpt-tip-more').find("i").text("收起");
	$('.rpt-tip-more').find("span").removeClass("icon-angle-bottom").addClass("icon-angle-top");
	$(".rpt-query-box-bottom").slideDown();

	//用于前台判断请求科目辅助项的判断条件
	if(rpt.rptType == "GL_RPT_JOURNAL" || rpt.rptType == "GL_RPT_COLUMNAR") {
		$("#addQueryInput,#bottomACCO").attr("data-isleave", false).attr("data-isrun", false);

		var nowTxt = "";
		var tagsDom1 = $("#addQueryInput").find(".rpt-tags-list li");
		for(var i = 0; i < $(tagsDom1).length - 1; i++) {
			nowTxt += $(tagsDom1).eq(i).find("span").attr("title");
		}
		rpt.firstTxt = nowTxt;

		var nowACCOtext = "";
		var tagsDom2 = $("#bottomACCO").find(".rpt-tags-list li");
		for(var i = 0; i < $(tagsDom2).length - 1; i++) {
			nowACCOtext += $(tagsDom2).eq(i).find("span").attr("title");
		}
		rpt.ACCOtext = nowACCOtext;
	}
	return false;
};

//渲染方案的辅助项
rpt.accQueryShow = function(liArr) {
	rpt.resBackQuery();
	var $li = $(rpt.namespace + " .rpt-query-box-center .rpt-query-box-li");
	for(var i = 0; i < liArr.length; i++) {
		var code = liArr[i].itemType;
		var title = liArr[i].itemTypeName;
		var flag = $("#accList" + (i + 1)).getObj().val(code);
		if(flag != false) {
			$li.eq(i).removeClass("li-hide");;
			$li.eq(i).find(".rpt-query-li-cont-title span").attr({
				"title": title,
				"data-code": code,
				"id": code
			}).text(title);

			var tagHtml = "";
			var numHtml = "";
			if(liArr[i].items.length > 0) {
				for(var j = 0; j < liArr[i].items.length; j++) {
					var th = ufma.htmFormat('<li><span data-code="<%=tagCode%>" title="<%=tagName%>"><%=tagName%></span><b class="glyphicon icon-close"></b></li>', {
						tagCode: liArr[i].items[j].code,
						tagName: liArr[i].items[j].name
					});

					tagHtml += th;
				}
				numHtml = '<div class="rpt-tags-num">(<span>' + liArr[i].items.length + '</span>)</div>';
			} else {
				numHtml = '<div class="rpt-tags-num" style="display:none;">(<span>0</span>)</div>';
			}

			$li.eq(i).find(".rpt-tree-view").html(
				'<ul class="rpt-tags-list">' + tagHtml +
				'<li class="rpt-li-over" style="display:none;">...</li>' +
				'</ul>' +
				'<p class="rpt-p-search-key">' +
				'<input type="text" id="' + code + '-data-key">' +
				'</p>' + numHtml
			);

			$li.eq(i).find(".rpt-tree-data").html('<ul id="' + code + '-data" class="ufmaTree ztree"></ul>');

			var radioType = liArr[i].itemLevel; //代码级次
			if(radioType == "1") { //一级
				$li.eq(i).find(".rpt-query-li-action [type='radio']").eq(0).prop("checked", true);
			} else if(radioType == "0") { //明细
				$li.eq(i).find(".rpt-query-li-action [type='radio']").eq(1).prop("checked", true);
			} else if(radioType == "-1") { //全部
				$li.eq(i).find(".rpt-query-li-action [type='radio']").eq(2).prop("checked", true);
			}
			$li.eq(i).find(".rpt-query-li-action [type='hidden']").val(radioType);

			//显示
			if(liArr[i].isShowItem == "1") {
				$li.eq(i).find(".isShowCol").prop("checked", true);
			} else {
				$li.eq(i).find(".isShowCol").removeAttr("checked");
			}
			//逐级汇总
			if(liArr[i].isGradSum == "1") {
				$li.eq(i).find(".isSumCol").prop("checked", true);
			} else {
				$li.eq(i).find(".isSumCol").removeAttr("checked");
			}
		}
	}

	//显示选中的标签
	$("ul.rpt-tags-list").on("myEvent", function() {
		var ulDom = this;
		var numDom = $(ulDom).siblings("div.rpt-tags-num").find("span");
		rpt.selectTip(ulDom, numDom);
	});
	$("ul.rpt-tags-list").trigger("myEvent");
};
//----------------------请求方案内容 end-------------------------//

/**账表页面的相关绑定操作**********************************************************************/
//按钮提示
rpt.tooltip = function() {
	$("body").on('mouseenter', "[data-toggle='tooltip']", function() {
		$(this).tooltip('show');
	}).on("mouseleave", "[data-toggle='tooltip']", function() {
		$(this).tooltip('hide');
	});
};

//查询条件框--展开更多查询
rpt.queryBoxMore = function() {
	$(rpt.namespace).find('.rpt-tip-more').on('click', function() {
		if($(this).find("i").text() == "更多") {
			$(this).find("i").text("收起");
			$(this).find("span").removeClass("icon-angle-bottom").addClass("icon-angle-top");
			$(".rpt-query-box-bottom").slideDown();
			if(rpt.rptType == "GL_RPT_CHRBOOK") {
				$(rpt.namespace).find(".rpt-chr-setting").show();
			}
		} else {
			$(this).find("i").text("更多");
			$(this).find("span").removeClass("icon-angle-top").addClass("icon-angle-bottom");
			$(".rpt-query-box-bottom").slideUp();
			if(rpt.rptType == "GL_RPT_CHRBOOK") {
				$(rpt.namespace).find(".rpt-chr-setting").hide();
			}
		}
	});
};

//编辑表格名称
rpt.editTableTitle = function() {
	$(rpt.namespace).find(".rpt-table-title-show").on("mouseenter", function() {
		$("#show-edit").show();
	}).on("mouseleave", function() {
		$("#show-edit").hide();
	}).on("click", function() {
		$(this).hide();
		$(".rpt-table-title-edit").show().find("input").focus().val($(this).find("span").text());
	});
	$(rpt.namespace).find(".rpt-table-title-edit").on("focus", "input", function() {
		$(".rpt-table-title-show").hide();
		$(this).keydown(function(e) {
			var name = $(this).val();
			if(name != "" && e.keyCode == 13) {
				$("#show-edit,.rpt-table-title-edit").hide();
				$(".rpt-table-title-show").find("span").text(name);
				$(".rpt-table-title-show").show();
				$("#show-edit").hide();
			}
		});

	}).on("blur", "input", function() {
		var name = $(this).val();
		if(name != "") {
			$("#show-edit,.rpt-table-title-edit").hide();
			$(".rpt-table-title-show").find("span").text(name);
			$(".rpt-table-title-show").show();
		} else {
			ufma.alert("表格名称不能为空！", "warning");
			return false;
		}
	});
};

//改变金额单位（需要一直保留两位小数点，借贷还必须平衡，暂时不实现）
rpt.changeMonetaryUnit = function() {
	//	$(rpt.namespace).find(".rpt-table-sub-tip2").on("click","i",function(){
	//		$(this).hide();
	//		$(this).siblings("select").show();
	//	});
	//	$(rpt.namespace).find(".rpt-table-sub-tip2").on("change","select",function(){
	//		
	//		if($(this).val() == "万元" && !$(".tdNum").hasClass("wanyuan")){
	//			$("td.tdNum").each(function(){
	//				if($(this).text() != ""){
	//					var num = $(this).text().replace(/\,/g, "");
	//					$(this).text(rpt.comdify(parseFloat(num/10000).toFixed(6)));
	//				}	
	//				$(this).addClass("wanyuan");
	//			})
	//		}else if($(this).val() == "元" && $(".tdNum").hasClass("wanyuan")){
	//			$("td.tdNum").each(function(){
	//				if($(this).text() != ""){
	//					var num = $(this).text().replace(/\,/g, "");
	//					$(this).text(rpt.comdify(parseFloat(num*10000).toFixed(2)));
	//				}	
	//				$(this).removeClass("wanyuan");
	//			})
	//		}
	//
	//		$(this).hide();
	//		$(this).siblings("i").text($(this).val()).show();
	//	});
};

//搜索隐藏显示
rpt.searchHideShow = function(selector) {
	//搜索隐藏显示
	//	$("#searchHideBtn").hover(function(){
	//		$(".searchHide").animate({"width":"160px"}).focus().removeClass("focusOff");
	//	},function(){
	//		if($(".searchHide").hasClass("focusOff")){
	//			$(".searchHide").animate({"width":"0px"});
	//		}
	//	});
	//	$(".searchHide").focus(function(){
	//		$(this).css({"width":"160px"}).removeClass("focusOff");
	//	}).blur(function(){
	//		$(this).animate({"width":"0px"}).addClass("focusOff");
	//	});
	var searchKey = ufma.sessionKey(rpt.module, rpt.compoCode, rpt.rgCode, rpt.nowSetYear, rpt.nowAgencyCode, rpt.nowAcctCode, rpt.namespace + "_searchKey");

	$(".searchHide").focus(function() {
		$(this).keydown(function(e) {
			var val = $(this).val();
			if(e.keyCode == 13) {
				$(selector).DataTable().search(val).draw();
				sessionStorage.removeItem(searchKey);
			}
		});
	});
	$("#searchHideBtn").on("click", function(evt) {
		evt.stopPropagation();
		if($(".searchHide").hasClass("focusOff")) {
			var newVal = sessionStorage.getItem(searchKey);
			if(newVal != "") {
				$(".searchHide").val(newVal);
			}
			$(".searchHide").show().animate({
				"width": "160px"
			}).focus().removeClass("focusOff");
		} else {
			sessionStorage.removeItem(searchKey);

			var val = $(this).siblings("input[type='text']").val();
			$(selector).DataTable().search(val).draw();

			sessionStorage.setItem(searchKey, val);
			rpt.sessionKeyArr.push(searchKey);
		}
	});
	$(".iframeBtnsSearch").on("mouseleave", function() {
		if(!$(".searchHide").hasClass("focusOff") && $(".searchHide").val() == "") {
			$(".searchHide").animate({
				"width": "0px"
			}, "", "", function() {
				$(".searchHide").css("display", "none");
			}).addClass("focusOff");
		}
	});
};

//模糊单项选择
rpt.oneSearch = function(selector) {
	$("input").on("focus,click", function(evt) {
		evt.stopPropagation();
	});

	//$(rpt.namespace).find(".rpt-table-tab").on("click",".rpt-oneSearch",function(){
	$(".rpt-oneSearch").on("click", function() {
		var i = $(this).siblings("input").eq(0).attr("col-index");

		var type = $(".change-rpt-type select").val();
		var oneKey = ufma.sessionKey(rpt.module, rpt.compoCode, rpt.rgCode, rpt.nowSetYear, rpt.nowAgencyCode, rpt.nowAcctCode, rpt.namespace + "_" + type + "_" + i + "_oneKey");
		sessionStorage.removeItem(oneKey);

		var columns = $(selector).DataTable().columns(i);
		var val = $.fn.dataTable.util.escapeRegex($(this).siblings("input").val());
		columns.search(val, false, false).draw();
		if(val != "") {
			$(this).parents("th").find("span.thTitle").css("color", "#108EE9");
			$(this).parents("th").find("span.rpt-funnelBtn").css("color", "#108EE9");
		} else {
			$(this).parents("th").find("span.thTitle").css("color", "");
			$(this).parents("th").find("span.rpt-funnelBtn").css("color", "");
		}
		$(this).parent(".rpt-funnelBox").hide();

		sessionStorage.setItem(oneKey, val);
		rpt.sessionKeyArr.push(oneKey);
	})

	$(rpt.namespace + " .rpt-funnelCont .rpt-txtCont").eq(0).on("focus", function() {
		$(this).keydown(function(e) {
			var val = $(this).val();
			if(e.keyCode == 13) {
				//$(".rpt-oneSearch").trigger("click");

				var i = $(this).attr("col-index");

				var type = $(".change-rpt-type select").val();
				var oneKey = ufma.sessionKey(rpt.module, rpt.compoCode, rpt.rgCode, rpt.nowSetYear, rpt.nowAgencyCode, rpt.nowAcctCode, rpt.namespace + "_" + type + "_" + i + "_oneKey");
				sessionStorage.removeItem(oneKey);

				var columns = $(selector).DataTable().columns(i);
				var val = $.fn.dataTable.util.escapeRegex($(this).val());
				columns.search(val, false, false).draw();
				if(val != "") {
					$(this).parents("th").find("span.thTitle").css("color", "#108EE9");
					$(this).parents("th").find("span.rpt-funnelBtn").css("color", "#108EE9");
				} else {
					$(this).parents("th").find("span.thTitle").css("color", "");
					$(this).parents("th").find("span.rpt-funnelBtn").css("color", "");
				}
				$(this).parent(".rpt-funnelBox").hide();

				sessionStorage.setItem(oneKey, val);
				rpt.sessionKeyArr.push(oneKey);
			}
		});
	});
};

rpt.twoClick = function(dom, selector) {
	var i = $(dom).siblings("input").eq(0).attr("col-index");

	var type = $(".change-rpt-type select").val();
	var twoKey1 = ufma.sessionKey(rpt.module, rpt.compoCode, rpt.rgCode, rpt.nowSetYear, rpt.nowAgencyCode, rpt.nowAcctCode, rpt.namespace + "_" + type + "_" + i + "_twoKey1");
	var twoKey2 = ufma.sessionKey(rpt.module, rpt.compoCode, rpt.rgCode, rpt.nowSetYear, rpt.nowAgencyCode, rpt.nowAcctCode, rpt.namespace + "_" + type + "_" + i + "_twoKey2");
	sessionStorage.removeItem(twoKey1);
	sessionStorage.removeItem(twoKey2);

	var val1 = $.fn.dataTable.util.escapeRegex($(dom).siblings("input").eq(0).val());
	var val2 = $.fn.dataTable.util.escapeRegex($(dom).siblings("input").eq(1).val());
	var columns = $(selector).DataTable().columns(i);
	var numVal1 = "";
	var numVal2 = "";

	if(val1 == "" && val2 != "") {
		numVal1 = -Number.MAX_VALUE;
		numVal2 = val2.replace(/\,/g, "");
	} else if(val2 == "" && val1 != "") {
		numVal1 = val1.replace(/\,/g, "");
		numVal2 = Number.MAX_VALUE;
	} else if(val1 != "" && val2 != "") {
		numVal1 = val1.replace(/\,/g, "");
		numVal2 = val2.replace(/\,/g, "");
	}

	if(numVal1 != "" || numVal2 != "") {
		//		if(val1 == ""){
		//			val1 = -Number.MAX_VALUE;
		//		}else if(val2 == ""){
		//			val2 = Number.MAX_VALUE;
		//		}
		$.fn.dataTable.ext.search.push(
			function(settings, data, dataIndex) {
				var colIndex = data.length + parseInt(i);
				var min = parseFloat(numVal1, 10);
				var max = parseFloat(numVal2, 10);
				var col = parseFloat(data[colIndex], 10) || 0;
				//console.info("min="+min+"---max="+max+"---col="+col);
				if((isNaN(min) && isNaN(max)) ||
					(isNaN(min) && col <= max) ||
					(min <= col && isNaN(max)) ||
					(min <= col && col <= max)) {
					return true;
				}
				return false;
			}
		);
		$(dom).parents("th").find("span.thTitle").css("color", "#108EE9");
		$(dom).parents("th").find("span.rpt-funnelBtn").css("color", "#108EE9");
	} else {
		$.fn.dataTable.ext.search.pop();
		$(dom).parents("th").find("span.thTitle").css("color", "");
		$(dom).parents("th").find("span.rpt-funnelBtn").css("color", "");
	}
	$(selector).DataTable().draw();
	$(dom).parent(".rpt-funnelBox").hide();

	sessionStorage.setItem(twoKey1, numVal1);
	sessionStorage.setItem(twoKey2, numVal2);
	rpt.sessionKeyArr.push(twoKey1);
	rpt.sessionKeyArr.push(twoKey2);
};

//单列范围筛选
rpt.twoSearch = function(selector) {
	$("input").on("focus,click", function(evt) {
		evt.stopPropagation();
	});
	$(rpt.namespace + " .rpt-numCont").on("keyup", function() {
		$(this).val($(this).val().replace(/[^\d\.\-]/g, ''));
	});
	$(rpt.namespace + " .rpt-numCont").on("blur", function() {
		var num = $(this).val().replace(/\,/g, "");
		if(num != "") {
			var ret1 = /^-?([1-9]\d*\.\d*|0\.\d*[1-9]\d*|0?\.0+|0)$/;
			var ret2 = /^-?[1-9]\d*$/;      
			if(ret1.test(num) || ret2.test(num)) {
				$(this).val(rpt.comdify(parseFloat(num).toFixed(2)));
			} else {
				ufma.alert("请输入合法的数字！", "error");
				return false;
			}
		}
	});
	var isclicktwoser = 1
	$(".rpt-twoSearch").on("click", function() {
		if(isclicktwoser == 1) {
			isclicktwoser = 2
			var onevals = $(this).parent(".rpt-funnelCont").find("input[type='text']").eq(0).val();
			var twovals = $(this).parent(".rpt-funnelCont").find("input[type='text']").eq(1).val();
			$(this).parent(".rpt-funnelCont").find("input[type='text']").eq(0).val('');;
			$(this).parent(".rpt-funnelCont").find("input[type='text']").eq(1).val('');
			rpt.twoClick(this, selector);
			$(this).parent(".rpt-funnelCont").find("input[type='text']").eq(0).val(onevals);
			$(this).parent(".rpt-funnelCont").find("input[type='text']").eq(1).val(twovals);
			rpt.twoClick(this, selector);
			isclicktwoser = 1
		}
	})

	$(rpt.namespace + " .rpt-funnelCont .rpt-numCont").eq(1).on("focus", function() {
		$(this).keydown(function(e) {
			var val = $(this).val();
			if(e.keyCode == 13) {
				//$(".rpt-twoSearch").trigger("click");

				var i = $(this).siblings("input").attr("col-index");

				var type = $(".change-rpt-type select").val();
				var twoKey1 = ufma.sessionKey(rpt.module, rpt.compoCode, rpt.rgCode, rpt.nowSetYear, rpt.nowAgencyCode, rpt.nowAcctCode, rpt.namespace + "_" + type + "_" + i + "_twoKey1");
				var twoKey2 = ufma.sessionKey(rpt.module, rpt.compoCode, rpt.rgCode, rpt.nowSetYear, rpt.nowAgencyCode, rpt.nowAcctCode, rpt.namespace + "_" + type + "_" + i + "_twoKey2");
				sessionStorage.removeItem(twoKey1);
				sessionStorage.removeItem(twoKey2);

				var val1 = $.fn.dataTable.util.escapeRegex($(this).siblings("input").val());
				var val2 = $.fn.dataTable.util.escapeRegex($(this).val());
				var columns = $(selector).DataTable().columns(i);
				var numVal1 = "";
				var numVal2 = "";

				if(val1 == "" && val2 != "") {
					numVal1 = -Number.MAX_VALUE;
					numVal2 = val2.replace(/\,/g, "");
				} else if(val2 == "" && val1 != "") {
					numVal1 = val1.replace(/\,/g, "");
					numVal2 = Number.MAX_VALUE;
				} else if(val1 != "" && val2 != "") {
					numVal1 = val1.replace(/\,/g, "");
					numVal2 = val2.replace(/\,/g, "");
				}
				if(numVal1 != "" || numVal2 != "") {
					$.fn.dataTable.ext.search.push(
						function(settings, data, dataIndex) {
							var colIndex = data.length + parseInt(i);
							var min = parseFloat(numVal1, 10);
							var max = parseFloat(numVal2, 10);
							var col = parseFloat(data[colIndex], 10) || 0;
							if((isNaN(min) && isNaN(max)) ||
								(isNaN(min) && col <= max) ||
								(min <= col && isNaN(max)) ||
								(min <= col && col <= max)) {
								return true;
							}
							return false;
						}
					);
					$(this).parents("th").find("span.thTitle").css("color", "#108EE9");
					$(this).parents("th").find("span.rpt-funnelBtn").css("color", "#108EE9");
				} else {
					$.fn.dataTable.ext.search.pop();
					$(this).parents("th").find("span.thTitle").css("color", "");
					$(this).parents("th").find("span.rpt-funnelBtn").css("color", "");
				}
				$(selector).DataTable().draw();
				$(this).parent(".rpt-funnelBox").hide();

				sessionStorage.setItem(twoKey1, numVal1);
				sessionStorage.setItem(twoKey2, numVal2);
				rpt.sessionKeyArr.push(twoKey1);
				rpt.sessionKeyArr.push(twoKey2);
			}
		});
	});
};

//清空会计科目标签，销毁树(总账、日记账)
rpt.clearTagsTree = function() {
	//销毁所有树
	$(rpt.namespace + " .ztree:not(#cbAgency_tree)").each(function() {
		var zId = $(this).attr("id");
		$.fn.zTree.destroy(zId);
	});
	$(rpt.namespace + " .rpt-tags-list").eq(0).html('<li class="rpt-li-over" style="display:none;">...</li>').css("width", "0");
	$(rpt.namespace + " .rpt-tags-list").eq(0).siblings("p").css("width", "288px");
	$(rpt.namespace + " .rpt-tags-num").eq(0).html('(<span>0</span>)').hide();

	//请求会计科目推荐
	rpt.reqItemTip("ACCO");
};

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

		//销毁所有树
		$(".ztree:not(#cbAgency_tree)").each(function() {
			var zId = $(this).attr("id");
			$.fn.zTree.destroy(zId);
		});

		$("#accList1").getObj().val("ACCO");
		$("#accList2").getObj().val("");
		$("#accList3").getObj().val("");
		$("#accList4").getObj().val("");
		$("#accList5").getObj().val("");

		$(".rpt-query-box-center").html(rpt.accListHtml);
		$(rpt.namespace).find(".rpt-query-box-center .rpt-tree-view").each(function(i) {
			var $combox = $("#accList" + (i + 1));
			$(this).on("click", function(e) {
				e.stopPropagation();
				var code = $combox.getObj().getValue();
				var radioType = $(this).parents(".rpt-query-li-cont").find(".rpt-query-li-action input[type='hidden']").val();
				rpt.showHideTree(this, code, radioType);
			})
		});
		rpt.raidoTreeShow();
	};

//点击查询方案(不包含余额表)
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

			//console.info($(this).offset().top);
			if($(this).offset().top > 67) {
				$(this).parents("ul.rpt-method-listrpt-method-list").find("li").eq(0).before($(this).parent("li"));
			}

			//请求方案内容
			var prjCode = $(this).data("code"); //方案代码
			rpt.reqPrjCont(prjCode);
		}

	});
};

//使用共享方案(不包含余额表)
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
	if(rpt.rptType == "GL_RPT_BAL") {
		//还原会计体系
		rpt.reqAccaList();

		var dd = new Date();
		var ddYear = dd.getFullYear();
		$(rpt.namespace).find("#dateStart").datetimepicker('setDate', (new Date(ddYear, 0)));
		$(rpt.namespace).find("#dateEnd").datetimepicker('setDate', (new Date()));

		rpt.resBackQuery();
		rpt.reqOptList();

	} else if(rpt.rptType == "GL_RPT_LEDGER" || rpt.rptType == "GL_RPT_JOURNAL") {
		//还原会计体系
		rpt.reqAccaList();

		var dd = new Date();
		var ddYear = dd.getFullYear();
		$(rpt.namespace).find("#dateStart").datetimepicker('setDate', (new Date(ddYear, 0)));
		$(rpt.namespace).find("#dateEnd").datetimepicker('setDate', (new Date()));

		rpt.resBackQuery();
		rpt.reqOptList();

	} else if(rpt.rptType == "GL_RPT_COLUMNAR") {
		//还原会计体系
		rpt.reqAccaList();

		var dd = new Date();
		var ddYear = dd.getFullYear();
		$(rpt.namespace).find("#dateStart").datetimepicker('setDate', (new Date(ddYear, 0)));
		$(rpt.namespace).find("#dateEnd").datetimepicker('setDate', (new Date()));

		//请求科目辅助项下拉列表
		rpt.reqSelectItems();
		rpt.reqOptList();

	} else if(rpt.rptType == "GL_RPT_DAILYJOURNAL") {
		//还原会计体系
		rpt.reqAccaList();

		var dd = new Date();
		var ddYear = dd.getFullYear();
		$(rpt.namespace).find("#dateStart").datetimepicker('setDate', (new Date(ddYear, 0)));
		$(rpt.namespace).find("#dateEnd").datetimepicker('setDate', (new Date()));

		//还原查询条件框
		rpt.clearTagsTree();
		rpt.reqOptList();
	} else if(rpt.rptType == "GL_RPT_VOUSUMMARY") {
		//还原会计体系
		rpt.reqAccaList();
		//还原期间
		rpt.dateBenQi("dateStart", "dateEnd");
		//清空填入数据
		$("#rpt-pzzh-input-form,#rpt-pzzh-input-to").val("");
		//还原凭证字号
		$("#rpt-pzzh-select option").eq(0).prop("selected", true);
		//还原凭证来源
		$("#rpt-pzly-select option").eq(0).prop("selected", true);
		//还原汇总方式
		$("#rpt-hzfs-select option").eq(0).prop("selected", true);
		//还原其他check
		rpt.reqOptList();
	}
};

//删除方案
rpt.deleteMethod = function() {
	$(rpt.namespace).find('.rpt-method-list').on('click', 'b.icon-close', function() {
		var thisMothod = $(this).parent("li");
		var name = $(this).siblings("span").text();
		var pLiFlag = $(this).parent("li").hasClass("isUsed");
		var prjCode = $(this).siblings().data("code"); //方案代码

		ufma.confirm('您确定要删除 ' + name + ' 查询方案?', function(action) {
			if(action) {
				var prjDelArgu = {
					"agencyCode": rpt.nowAgencyCode,
					"prjCode": prjCode,
					"rptType": rpt.rptType,
					"setYear": rpt.nowSetYear,
					"userId": rpt.nowUserId
				};
				ufma.ajax(rpt.portList.deletePrj, "delete", prjDelArgu, function(result) {
					var flag = result.flag;
					if(flag == "success") {
						$(thisMothod).remove();
						rpt.moreMethodBtn("rpt-method-list", "rpt-method-more");
						ufma.showTip("删除成功！", function() {}, "success");
					}
					if(pLiFlag) {
						//还原会计体系
						rpt.backToOrigin();
					}
				});

			} else {

			}
		}, {
			type: 'warning'
		});
	});
};

//点击推荐操作 单一会计科目（总账、日记账）
rpt.clickTips = function() {
	$(rpt.namespace).on("click", ".rpt-query-li-tip-c i", function() {
		$(this).css("color", "#008ff0").siblings().css("color", "#333");
		//		var tagName = $(this).attr("title");
		var tagCode = $(this).data("code");
		var tagName = tagCode + " " + $(this).attr("title");
		var tagDom = '<li><span data-code="' + tagCode + '" title="' + tagName + '">' + tagName + '</span><b class="glyphicon icon-close"></b></li>';

		var viewDom = $(this).parents(".rpt-query-li-cont").find(".rpt-tree-view");
		$(viewDom).find(".rpt-li-over").prevAll().remove();
		$(viewDom).find(".rpt-li-over").before($(tagDom));
		$(viewDom).find(".rpt-tags-num").show().find("span").text("1");
		var width = $(viewDom).find(".rpt-tags-list li span").width() + 34;
		$(viewDom).find(".rpt-tags-list").css("width", width + "px");
		$(viewDom).find(".rpt-p-search-key").css("width", (288 - width) + "px");

		if($(viewDom).hasClass("hasTree")) {
			var myTree = $.fn.zTree.getZTreeObj("ACCO-data");
			var thisNode = myTree.getNodeByParam("name", tagName, null);
			myTree.checkAllNodes(false);
			myTree.checkNode(thisNode, true, true);
		}

	});
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

//返回单列筛选html
rpt.backOneSearchHtml = function(title, index) {
	var sHtml = '<div class="rpt-funnel">' +
		'<span class="glyphicon icon-filter rpt-funnelBtn"></span>' +
		'<div class="rpt-funnelBox rpt-funnelBoxText" >' +
		'<p class="rpt-funnelTitle">' +
		'<span class="rpt-funnelTitle-span1">' + title + '</span>' +
		'<span class="rpt-funnelTitle-span2">清空</span>' +
		'<span class="rpt-clear"></span>' +
		'</p>' +
		'<p class="rpt-funnelCont">' +
		'<input type="text" class="rpt-txtCont bordered-input" col-index="' + index + '" placeholder="请输入过滤内容"/>' +
		'<button class="btn btn-primary rpt-oneSearch">查询</button>' +
		'</p>' +
		'</div>' +
		'</div>';
	return sHtml;
}

//返回区间筛选html
rpt.backTwoSearchHtml = function(className, title, index) {
	var sHtml = '<div class="rpt-funnel">' +
		'<span class="glyphicon icon-filter rpt-funnelBtn"></span>' +
		'<div class="rpt-funnelBox ' + className + '" >' +
		'<p class="rpt-funnelTitle">' +
		'<span class="rpt-funnelTitle-span1">' + title + '</span>' +
		'<span class="rpt-funnelTitle-span2">清空</span>' +
		'<span class="rpt-clear"></span>' +
		'</p>' +
		'<p class="rpt-funnelCont">' +
		'<input type="text" class="rpt-numCont bordered-input" col-index="' + index + '" placeholder="0.00"/>' +
		'<span>至</span>' +
		'<input type="text" class="rpt-numCont bordered-input" col-index="' + index + '" placeholder="0.00"/>' +
		'<button class="btn btn-primary rpt-twoSearch">查询</button>' +
		'</p>' +
		'</div>' +
		'</div>';
	return sHtml;
}

//显示/隐藏筛选框
rpt.isShowFunnelBox = function() {
	$(rpt.namespace).on("click", ".rpt-funnelBtn", function(evt) {
		evt.stopPropagation();
		$("div.rpt-funnelBox").hide();

		var i = $(this).parents("th").find("input").eq(0).attr("col-index");
		var type = $(".change-rpt-type select").val();
		var thTitle = $(this).parents("th").find(".thTitle").text();
		if(thTitle == "摘要") {
			var oneKey = ufma.sessionKey(rpt.module, rpt.compoCode, rpt.rgCode, rpt.nowSetYear, rpt.nowAgencyCode, rpt.nowAcctCode, rpt.namespace + "_" + type + "_" + i + "_oneKey");
			var newVal = sessionStorage.getItem(oneKey);
			if(newVal != "" && newVal != null && $.data(this, 'loaded')) {
				$(this).parents("th").find("input").eq(0).val(newVal);
				$.data(this, 'loaded', true);
			}
		} else {
			var twoKey1 = ufma.sessionKey(rpt.module, rpt.compoCode, rpt.rgCode, rpt.nowSetYear, rpt.nowAgencyCode, rpt.nowAcctCode, rpt.namespace + "_" + type + "_" + i + "_twoKey1");
			var twoKey2 = ufma.sessionKey(rpt.module, rpt.compoCode, rpt.rgCode, rpt.nowSetYear, rpt.nowAgencyCode, rpt.nowAcctCode, rpt.namespace + "_" + type + "_" + i + "_twoKey2");
			var newVal1 = sessionStorage.getItem(twoKey1);
			var newVal2 = sessionStorage.getItem(twoKey2);
			if(newVal1 != "" && newVal1 != null && $.data(this, 'loaded')) {
				var numVal1 = newVal1.replace(/\\/g, "");
				$(this).parents("th").find("input").eq(0).val(numVal1);
			}
			if(newVal2 != "" && newVal2 != null && $.data(this, 'loaded')) {
				var numVal2 = newVal2.replace(/\\/g, "");
				$(this).parents("th").find("input").eq(1).val(numVal2);
			}
			$.data(this, 'loaded', true);
		}

		$(this).siblings("div.rpt-funnelBox").show();
	});
	//$(rpt.namespace).on("click",".rpt-funnelTitle-span2",function(){
	$(".rpt-funnelTitle-span2").off().on("click", function() {
		$(this).parents(".rpt-funnelBox").find("input[type='text']").val("");
		$(this).closest('.rpt-funnel').find('.rpt-twoSearch').trigger('click'); //by wangxin
		$(this).closest('.rpt-funnel').find('.rpt-oneSearch').trigger('click'); //by wangxin
	});
	$(rpt.namespace).on("click", function(e) {
		if($(e.target).closest(".rpt-funnelBtn").length == 0 && $(e.target).closest("div.rpt-funnelBox").length == 0 && $(e.target).closest("div#colAction").length == 0) {
			$("div.rpt-funnelBox").hide();
		}
	});
	$(rpt.namespace).on("mouseenter", "div.rpt-funnelBox", function() {
		$(this).show();
	}).on("mouseleave", "div.rpt-funnelBox", function() {
		$(this).hide();
	});
}

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

rpt.showHideTree = function(dom, code, radioType) {
	$(dom).parents("li.rpt-query-box-li").siblings().find("div.rpt-tree-data").hide();
	$(dom).parents("ul").siblings().find("div.rpt-tree-data").hide();

	$(dom).find("input").focus();

	var itemCode = "";

	if(!$.isNull(code)) {
		itemCode = code;
	} else {
		itemCode = $("#selectTitle").val();
		var ulDom = $(dom).parents(".rpt-query-box-li0").find("label select.rpt-select-title");
		//console.info($(ulDom).length);
		if($(ulDom).length > 0) {
			itemCode = $("#selectTitle").val();
		} else {
			var titleDom = $(dom).parents(".rpt-query-box-li0").find("label.rpt-query-li-cont-title span");
			itemCode = $(titleDom).data("code");
		}
	}

	var treeId = itemCode + "-data";

	var treeKey = ufma.sessionKey(rpt.module, rpt.compoCode, rpt.rgCode, rpt.nowSetYear, rpt.nowAgencyCode, rpt.nowAcctCode, rpt.namespace + itemCode);
	var treeStr = sessionStorage.getItem(treeKey);
	//console.info(treeKey+"=="+treeStr); 

	var isShow = $(dom).siblings("div.rpt-tree-data").css("display");
	var $Data = $(dom).siblings("div.rpt-tree-data");
	if(isShow == "none" || $Data.height() < 44) {
		if(itemCode == "ACCO") {
			if(treeStr != null) {
				var zNodes = JSON.parse(treeStr);
				$Data.show();
				if(rpt.rptType == "GL_RPT_LEDGER") {
					rpt.selectTree(treeId, zNodes, false, radioType);
				} else {
					rpt.selectTree(treeId, zNodes, true, radioType);
				}
			} else {
				rpt.reqAccoTree(radioType);
			}
		} else {

			if(treeStr != null) {
				var zNodes = JSON.parse(treeStr);
				if(rpt.rptType == "GL_RPT_LEDGER") {
					rpt.selectTree(treeId, zNodes, false, radioType);
				} else {
					rpt.selectTree(treeId, zNodes, true, radioType);
				}
				$(dom).siblings("div.rpt-tree-data").show();
			} else {
				rpt.reqAccItemTree(itemCode, radioType);
			}
		}

		setTimeout(function() {
			if($Data.height() < 44) {
				if(itemCode == "ACCO") {
					rpt.reqAccoTree(radioType);
				} else {
					rpt.reqAccItemTree(itemCode, radioType);
				}
			}
		}, 1000);
	}
};

//下拉选择树展开隐藏
rpt.showSelectTree = function(code) {
	$(rpt.namespace).on("click", function(e) {
		if($(e.target).closest("div.rpt-tree-view").length == 0 && $(e.target).closest("div.rpt-tree-data").length == 0) {
			$("div.rpt-tree-data").hide();
		}
	});
	$(rpt.namespace).on("mouseenter", "div.rpt-tree-data", function() {
		$(this).show();
	});
	//	$(rpt.namespace).on("mouseleave","div.rpt-tree-data",function(){
	//		$(this).hide();
	//	});
};

//打开联查凭证页面
rpt.openVouShow = function(dom, page) {
	var vouGuid = $(dom).attr("data-vouguid"); //凭证id
	//	console.info(vouGuid);
	if(vouGuid != "null" && vouGuid != "") {
		//		window.location.href = '../../vou/index.html?dataFrom='+page+'&action=query&vouGuid='+vouGuid+"&agencyCode="+rpt.nowAgencyCode+"&acctCode="+rpt.nowAcctCode;

		$(this).attr('data-href', '../../../gl/vou/index.html?menuid=' + rpt.vouMenuId + '&dataFrom=' + page + '&action=query&vouGuid=' + vouGuid + '&agencyCode=' + rpt.nowAgencyCode + '&acctCode=' + rpt.nowAcctCode);
		$(this).attr('data-title', '凭证录入');
		window.parent.openNewMenu($(this));
	}
};

//调用账簿打印预览
rpt.rptPrint = function(pageName, tableId, tableType) {
	sessionStorage.removeItem("iWantToPrint");
	var rptTitle = $(rpt.namespace + " .rpt-table-title-show span").text();
	var year = $(rpt.namespace + " #dateStart").datetimepicker('getDate').getFullYear();
	var tableSub = $(".rpt-table-sub-tip1").find("span").eq(0).text() + " " + $(".rpt-table-sub-tip1").find("span").eq(1).text();

	var tableData = $("#" + tableId).DataTable().data();
	var rowsArr = [];
	for(var i = 0; i < tableData.length; i++) {
		rowsArr.push(tableData[i]);
	}
	var acco = "";

	if(pageName == "glRptLedger") {
		acco = $(rpt.namespace + " .rpt-tags-list li").eq(0).find("span").attr("title");
	}
	//判断是否有科目
	var tabArgu = rpt.backTabArgu();
	var qryItems1 = tabArgu.prjContent.qryItems;
	var items0, indexAcco;
	var isHaveAcco = false;
	for(var i = 0; i < qryItems1.length; i++) {
		if(qryItems1[i].itemType === 'ACCO') {
			isHaveAcco = true;
			items0 = qryItems1[i];
			if(items0.items.length == 0 && pageName == 'glRptJournal') {
				var run = {
					'code': '0',
					'name': '全部'
				}
				items0.items.push(run)
			}
			indexAcco = i;
		}
	}
	var pData, argu, pDataArr = [];
	if(isHaveAcco) {
		var getData = {
			agencyCode: rpt.nowAgencyCode,
			acctCode: rpt.nowAcctCode,
			componentId: rpt.rptType,
			rptFormat: tableType
		};
		var prtModels = [];
		var getPrtFormatList = function(result) {
			var data = result.data;

			//循环创建模板
			for(var i = 0; i < data.length; i++) {
				var model = {};
				model.pForm = data[i].formattmplValue;
				model.pFormtmpl = data[i].sorttmplValue;
				model.pPaper = {
					marginBottom: data[i].marginBottom,
					marginLeft: data[i].marginLeft,
					marginRight: data[i].marginRight,
					marginTop: data[i].marginTop,
					paperCode: data[i].paperCode,
					paperHeight: data[i].paperHeight,
					paperName: data[i].paperName,
					paperOrientation: data[i].paperOrientation,
					paperWidth: data[i].paperWidth
				}
				model.tmplImg = data[i].tmplImg;
				model.defaultTmpl = data[i].defaultTmpl;
				model.formattmplCode = data[i].formattmplCode;
				model.formattmplName = data[i].formattmplName;
				prtModels.push(model);
			}

		}
		var items1 = items0.items;
		var getPdata = function(result) {
			var s = {
				labels: {
					rq: year,
					km: acco,
					ym: "",
					dwzt: tableSub,
					dyr: rpt.nowUserName,
					sh: "",
					dyrq: rpt.nowDate
				},
				rows: result.data.tableData
			};
			pDataArr.push(s);
		}

		var t = 0;
		for(var i = 0; i < items1.length; i++) {
			acco = items1[i].name;
			t++;
			tabArgu.prjContent.qryItems[indexAcco].items = [];
			tabArgu.prjContent.qryItems[indexAcco].items[0] = items1[i];
			//ufma.ajaxDef("/gl/rpt/getReportData/GL_RPT_JOURNAL", "post", tabArgu, getPdata);
			ufma.ajaxDef("/gl/rpt/getReportData/" + rpt.rptType, "post", tabArgu, function(result) {
				getPdata(result);
			});
		}
		ufma.ajaxDef("/gl/GlRpt/getPrtFormatList", "post", getData, getPrtFormatList);
		var printCache = {};
		printCache.pDataArr = pDataArr;
		printCache.models = prtModels;
		printCache.agencyCode = rpt.nowAgencyCode;
		printCache.acctCode = rpt.nowAcctCode;
		printCache.componentId = rpt.rptType;
		printCache.rptFormat = tableType;

		//判断缓存
		var judgeCache = {};
		judgeCache.dataFrom = "rptPrint";
		judgeCache.direct = "0";
		judgeCache.index = t;

		argu = {
			print: printCache,
			judge: judgeCache
		};
		//
		// pData = {
		//   labels:{
		//     rq: year,
		//     km: acco,
		//     ym: "",
		//     dwzt: tableSub,
		//     dyr: rpt.nowUserName,
		//     sh: "",
		//     dyrq: rpt.nowDate
		//   },
		//   rows:rowsArr
		// };
		//
		// argu = {
		//   judge:{
		//     dataFrom:pageName,//来源
		//     direct:"0",//直接打印（0：否，1：是）
		//   },
		//   print:{
		//     pData:pData,//打印需要的p_data
		//     getModels:{
		//       acctCode:rpt.nowAcctCode,//账套
		//       agencyCode:rpt.nowAgencyCode,//单位
		//       componentId:rpt.rptType,//部件id 账簿类型（明细账……）
		//       rptFormat:tableType//账簿样式（三栏式……）
		//     },
		//     title:rptTitle
		//   }
		// };
	} else {
		pData = {
			labels: {
				rq: year,
				km: acco,
				ym: "",
				dwzt: tableSub,
				dyr: rpt.nowUserName,
				sh: "",
				dyrq: rpt.nowDate
			},
			rows: rowsArr
		};

		argu = {
			judge: {
				dataFrom: pageName, //来源
				direct: "0", //直接打印（0：否，1：是）
			},
			print: {
				pData: pData, //打印需要的p_data
				getModels: {
					acctCode: rpt.nowAcctCode, //账套
					agencyCode: rpt.nowAgencyCode, //单位
					componentId: rpt.rptType, //部件id 账簿类型（明细账……）
					rptFormat: tableType //账簿样式（三栏式……）
				},
				title: rptTitle
			}
		};
	}

	// var pData = {
	//   labels:{
	//     rq: year,
	//     km: acco,
	//     ym: "",
	//     dwzt: tableSub,
	//     dyr: rpt.nowUserName,
	//     sh: "",
	//     dyrq: rpt.nowDate
	//   },
	//   rows:rowsArr
	// };
	//
	// var argu = {
	//   judge:{
	//     dataFrom:pageName,//来源
	//     direct:"0",//直接打印（0：否，1：是）
	//   },
	//   print:{
	//     pData:pData,//打印需要的p_data
	//     getModels:{
	//       acctCode:rpt.nowAcctCode,//账套
	//       agencyCode:rpt.nowAgencyCode,//单位
	//       componentId:rpt.rptType,//部件id 账簿类型（明细账……）
	//       rptFormat:tableType//账簿样式（三栏式……）
	//     },
	//     title:rptTitle
	//   }
	// };

	var printArgu = JSON.stringify(argu);
	//	console.info(printArgu);
	sessionStorage.setItem("iWantToPrint", printArgu);
	window.open(bootPath + 'pub/printpreview/printPreview.html');
};

//固定底部工具条
rpt.showHide = function(tableId) {
	var tableBox = $("#" + tableId);
	var thead = $("#" + tableId).find("thead");
	var tool = $(".tableBottom");
	var toolFix = $(".tableBottomFix");

	//$(thead).parents("table").width(tableBox.width());
	//设置固定底部工具条的宽度
	//	if (navigator.userAgent.indexOf('Firefox') >= 0){
	//		$(tool).css("width",$(tableBox).parent().width()+1+"px");
	//		$(toolFix).css("width",$(tableBox).parent().width()+1+"px");
	//	}else{
	$(tool).css({
		"width": $(tableBox).parent().width() + "px"
	});
	$(toolFix).css({
		"width": $(tableBox).parent().width() + "px"
	});
	//	}

	var winHei; //窗口高度
	var toolHei = $(toolFix).height(); //底部工具条的高度
	var theadHei = $(thead).height(); //头部区域的高度
	var theadBot; //头部区域距离底部的高度
	var toolTop; //底部工具条距离顶部的高度

	winHei = $(window).height();
	theadBot = winHei - ($(thead).offset().top - $(document).scrollTop()) - theadHei;
	toolTop = $(tool).offset().top - $(document).scrollTop();
	if(theadBot >= toolHei && toolTop > winHei) {
		$(toolFix).css("display", "block");
	} else {
		$(toolFix).css("display", "none");
	}

};

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
			'<ul class="rpt-tags-list">' +
			'<li class="rpt-li-over" style="display:none;">...</li>' +
			'</ul>' +
			'<p class="rpt-p-search-key">' +
			'<input type="text" id="">' +
			'</p>' +
			'<div class="rpt-tags-num" style="display:none;">(<span>0</span>)</div>'
		);
	} else {
		$li.eq(index).removeClass("li-hide");
		$li.eq(index).find(".rpt-query-li-cont-title span").attr({
			"title": name,
			"data-code": code,
			"id": code
		}).text(name);
		$li.eq(index).find(".rpt-tree-view").html(
			'<ul class="rpt-tags-list">' +
			'<li class="rpt-li-over" style="display:none;">...</li>' +
			'</ul>' +
			'<p class="rpt-p-search-key">' +
			'<input type="text" id="' + code + '-data-key">' +
			'</p>' +
			'<div class="rpt-tags-num" style="display:none;">(<span>0</span>)</div>'
		);
		$li.eq(index).find(".rpt-tree-data").html('<ul id="' + code + '-data" class="ufmaTree ztree"></ul>');
	}
};

//返回表格需要显示的辅助项数组
rpt.tableColArr = function() {
	var liArr = []; //需要显示的辅助核算项
	$(".rpt-query-box-li0").each(function() {
		//if($(this).css("display") != "none"){
		if(!$(this).hasClass("li-hide")) {
			var that = $(this).find(".rpt-query-li-cont-title span");
			var liObj = {};
			//显示
			if($(this).find(".isShowCol").prop("checked")) {
				liObj.isShowItem = "1";
			} else {
				liObj.isShowItem = "0";
			}
			//逐级汇总
			if($(this).find(".isSumCol").prop("checked")) {
				liObj.isGradSum = "1";
			} else {
				liObj.isGradSum = "0";
			}
			liObj.seq = "condition";
			liObj.dir = "";
			liObj.itemPos = "";
			liObj.itemTypeName = $(that).text();
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
	//console.info(JSON.stringify(liArr));

	var showLiArr = [];
	for(var i = 0; i < liArr.length; i++) {
		if(liArr[i].isShowItem == "1") {
			showLiArr.push(liArr[i]);
		}
	}

	return showLiArr;
};