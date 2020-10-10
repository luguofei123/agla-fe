;
var pfData = ufma.getCommonData();
//console.info("pfData=="+JSON.stringify(pfData));
var changeFlag = false;
var rpt2 = {};
//用于存储打开的模态框
rpt2.setQuery;
rpt2.namespace = "#" + $(".rptType").data("name");
//console.info(rpt2.namespace);

//明细账是否加载完毕
rpt2.journalLoaded = false;

rpt2.nowDate = pfData.svTransDate;//当前年月日
rpt2.module = "gl";//模块代码
rpt2.compoCode = "rpt";//部件代码
//rpt2.rgCode = "87";//区划代码
rpt2.rgCode = pfData.svRgCode;//区划代码

rpt2.bennian = pfData.svSetYear;//本年 年度
rpt2.benqi = pfData.svFiscalPeriod;//本期 月份
rpt2.today = pfData.svTransDate;//今日 年月日

//储存页面已存在session的key
rpt2.sessionKeyArr = [];

//总账联查明细账参数缓存
rpt2.journalFormLedger = ufma.sessionKey(rpt2.module, rpt2.compoCode, rpt2.rgCode, rpt2.nowSetYear, rpt2.nowAgencyCode, rpt2.nowAcctCode, "journalFormLedger");
//余额表联查明细账参数缓存
rpt2.journalFormBal = ufma.sessionKey(rpt2.module, rpt2.compoCode, rpt2.rgCode, rpt2.nowSetYear, rpt2.nowAgencyCode, rpt2.nowAcctCode, "journalFormBal");

//rpt2.urlPath = "http://127.0.0.1:8081";
// rpt2.urlPath = "http://127.0.0.1:8083";
rpt2.urlPath = "";

rpt2.balDataArr = [];

var treeTimeId = null;

//账表所用接口
rpt2.portList = {
    getVouBoxCount: rpt2.urlPath + "/gl/vouBox/getVouBoxCount",
    //agencyList:"/gl/eleAgency/getRptAgencys",//单位列表接口
    //agencyList:"/gl/eleAgency/getAgencyTree",//单位列表接口
    //acctList:"/gl/eleCoacc/getRptAccts",//账套列表接口
    getAgencyAcctTree: "/bida/sys/common/getAgencyAcctTree",//单位账套树
    accaList: rpt2.urlPath + "/gl/eleAcca/getRptAccas",//会计体系列表接口
    tipsList: rpt2.urlPath + "/gl/accTips/getTips",//推荐项列表接口
    prjList: rpt2.urlPath + "/gl/rpt/prj/getPrjList",//查询方案列表接口
    sharePrjList: rpt2.urlPath + "/gl/rpt/prj/getSharePrjList",//共享方案列表接口
    optList: rpt2.urlPath + "/gl/rpt/prj/getOptList",//查询条件其他选项列表接口
    accoTree: rpt2.urlPath + "/gl/sys/coaAcc/getRptAccoTree",//会计科目树（账套级）接口
    accItemTree: rpt2.urlPath + "/gl/common/glAccItemData/getAccItemTree",//辅助项资料树（单位级）接口
    savePrj: rpt2.urlPath + "/gl/rpt/prj/savePrj",//保存查询方案
    prjContent: rpt2.urlPath + "/gl/rpt/prj/getPrjcontent",//查询方案内容接口
    deletePrj: rpt2.urlPath + "/gl/rpt/prj/deletePrj",//删除查询方案
    //getVoutype:rpt2.urlPath+"/gl/eleVouType/getVoutypeByAgencyCode/",//请求凭证字号
    getVoutype: rpt2.urlPath + "/gl/eleVouType/getVouType/",//请求凭证字号
    getCurrType: rpt2.urlPath + "/gl/eleCurrRate/getCurrType/",//请求币种列表
    getEleLevelNum: rpt2.urlPath + "/gl/rpt/cond/getEleLevelNum",//获取汇总方式（凭证汇总表）
    getVouTypeFull: rpt2.urlPath + "/gl/eleVouType/getVouType/",//请求凭证类型、字号
    getVOU_SOURCE: rpt2.urlPath + "/gl/enumerate/VOU_SOURCE"//获取凭证来源
};

//请求接口需要的全局变量
//rpt2.nowSetYear = "2017";//当前年份
//rpt2.nowUserId = "sa";//登录用户ID
//rpt2.nowUserName = "";//登录用户名称
//rpt2.nowAgencyCode = "001";//登录单位代码
//rpt2.nowAgencyName = "";//登录单位名称
//rpt2.nowAcctCode = "";//账套代码
//rpt2.nowAcctName = "";//账套名称
//rpt2.rptType = $(".rptType").val();//账表类型

rpt2.nowSetYear = pfData.svSetYear;//当前年份
rpt2.nowUserId = pfData.svUserId;//登录用户ID    修改权限  将svUserCode改为 svUserId  20181012
rpt2.nowUserName = pfData.svUserName;//登录用户名称
rpt2.nowAgencyCode = pfData.svAgencyCode;//登录单位代码
rpt2.nowAgencyName = pfData.svAgencyName;//登录单位名称
rpt2.nowAcctCode = pfData.svAcctCode;//账套代码
rpt2.nowAcctName = pfData.svAcctName;//账套名称
rpt2.rptType = $(".rptType").val();//账表类型


/**账表的通用公共方法******************************************************************/
/*
 * JSON数组去重
 * @param: [array] json Array
 * @param: [string] 唯一的key名，根据此键名进行去重
 */
// rpt2.uniqueArray=function(array, key){
//     var result = [array[0]];
//     for(var i = 1; i < array.length; i++){
//         var item = array[i];
//         var repeat = false;
//         for (var j = 0; j < result.length; j++) {
//             if (item[key] == result[j][key]) {
//                 repeat = true;
//                 break;
//             }
//         }
//         if (!repeat) {
//             result.push(item);
//         }
//     }
//     return result;
// };

//返回地址栏的参数
rpt2.GetQueryString = function (name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
};

/*
 * 获得节点下面的所有子节点
 */
// rpt2.getAllChildrenNodes=function(treeNode,result){
// 	if (treeNode.isParent) {
// 		var childrenNodes = treeNode.children;
//         if (childrenNodes) {
//             for (var i = 0; i < childrenNodes.length; i++) {
//                	result += ","+(childrenNodes[i].id);
//                 result = rpt2.getAllChildrenNodes(childrenNodes[i], result);
//             }
//         }
//     }
//     return result;
// };

//数字保留千分位
// rpt2.comdify=function(n){
// 	var re=/\d{1,3}(?=(\d{3})+$)/g;
// 	var n1=n.replace(/^(\d+)((\.\d+)?)$/,function(s,s1,s2){return s1.replace(re,"$&,")+s2;});
// 	return n1;
// };

//判断更多查询方案按钮是否显示
// rpt2.moreMethodBtn=function(ulDom,moreDom){
// 	var len = 0;
// 	$("."+ulDom).find("li").each(function(i){
// //		var str = $(this).text();
// //		var size = $(this).text().length;
// //		var reg = /[\u4E00-\u9FA5\uF900-\uFA2D]/;
// //		var strLen = 0;
// //		for(var n=0;n<size;n++){
// //			if(reg.test(str.charAt(n))){
// //				strLen += 12;
// //			}else{
// //				strLen += 8;
// //			}
// //		}
// //		len += parseInt((strLen+34) + 8);
//
// 		var liW = $(this).css("width");
// 		var liLen = parseInt(liW.substring(0,liW.indexOf("p")));
// 		len += parseInt(liLen+8);
// 	})
// 	if(len<($(".rpt-method-box").width()-126)){
// 		$("."+moreDom).hide();
// 	}else{
// 		$("."+moreDom).show();
// 	}
// };

//单选按钮组
// rpt2.raidoBtnGroup=function(btnGroupClass){
// 	$(rpt2.namespace).find("."+btnGroupClass).on("click","button",function(){
// 		$(this).addClass("btn-primary").removeClass("btn-default");
// 		$(this).siblings("button").removeClass("btn-primary").addClass("btn-default");
// 	})
// };
//单选radio组
// rpt2.raidoInputGroup=function(labelClass){
// 	$(rpt2.namespace).find("."+labelClass).on("click",function(){
// 		$(this).find("input").attr("checked",true);
// 		$(this).siblings().find("input").removeAttr("checked");
// 	})
// };
//返回本期时间
// rpt2.dateBenQi=function(startId,endId){
// //	var dd = new Date();
// //	var ddYear = dd.getFullYear();
// //	var ddMonth = dd.getMonth();
// //	var tdd = new Date(ddYear,ddMonth+1,0)
// //	var ddDay = tdd.getDate();
// //	$(rpt2.namespace).find("#"+startId).datetimepicker('setDate',(new Date(ddYear,ddMonth,1)));
// //	$(rpt2.namespace).find("#"+endId).datetimepicker('setDate',(new Date(ddYear,ddMonth,ddDay)));
//
// 	var ddYear = rpt2.bennian;
// 	var ddMonth = rpt2.benqi - 1;
// 	var tdd = new Date(ddYear,ddMonth+1,0)
// 	var ddDay = tdd.getDate();
// 	$(rpt2.namespace).find("#"+startId).datetimepicker('setDate',(new Date(ddYear,ddMonth,1)));
// 	$(rpt2.namespace).find("#"+endId).datetimepicker('setDate',(new Date(ddYear,ddMonth,ddDay)));
// };
//返回本年时间
// rpt2.dateBenNian=function(startId,endId){
// //	var dd = new Date();
// //	var ddYear = dd.getFullYear();
// //	$(rpt2.namespace).find("#"+startId).datetimepicker('setDate',(new Date(ddYear,0,1)));
// //	$(rpt2.namespace).find("#"+endId).datetimepicker('setDate',(new Date(ddYear,11,31)));
//
// 	var ddYear = rpt2.bennian;
// 	$(rpt2.namespace).find("#"+startId).datetimepicker('setDate',(new Date(ddYear,0,1)));
// 	$(rpt2.namespace).find("#"+endId).datetimepicker('setDate',(new Date(ddYear,11,31)));
// };
//返回今日时间
// rpt2.dateToday=function(startId,endId){
// //	$(rpt2.namespace).find("#"+startId+",#"+endId).datetimepicker('setDate',(new Date()));
// 	$(rpt2.namespace).find("#"+startId+",#"+endId).datetimepicker('setDate',(new Date(rpt2.today)));
// };


//判断li-over和计数是否显示
// rpt2.selectTip=function(ulDom,numDom){
// 	var len = 0;
// 	$(ulDom).find("li").not(".rpt-li-over").each(function(i){
// 		var width = $(this).find("span").width()+30;
// 		len += parseInt(width + 4)
// 		if(len<213){
// 			len = len + 4;
// 			$(this).show();
// 			$(ulDom).css("width",len+"px");
// 			$(ulDom).siblings(".rpt-p-search-key").css("width",(288-len)+"px");
// 		}else{
// 			$(this).hide();
// 			$(ulDom).find("li:lt(i)").show();
// 			$(ulDom).find("li.rpt-li-over").show();
// 		}
// 	})
//
// 	var num = parseInt($(numDom).text());
// 	if(num>0){
// 		$(numDom).parent("div.rpt-tags-num").show();
// 	}else{
// 		$(numDom).parent("div.rpt-tags-num").hide();
// 	}
// };

//构建树节点标签
// rpt2.createTags=function(treeId,type){
// 	var mytree = $.fn.zTree.getZTreeObj(treeId);
// 	var firstNode = mytree.getNodes()[0];
// 	var nodeNamesArr = [];
// 	nodeNamesArr.push(firstNode.name);
//
// 	var NodesStr = [];
// 	if (firstNode.isParent) {
// 		var result =  rpt2.getAllChildrenNodes(firstNode,result);
// 		if(result != "" && result != undefined && result != null){
// 			if(result.indexOf(",") != "-1"){
// 				NodesStr = result.split(",");
// 			}else{
// 				NodesStr.push(result);
// 			}
// 		}
// 	}else{
// 		NodesStr.push(firstNode.id);
// 	}
//
// 	var ulDom = $("#"+treeId).parent("div.rpt-tree-data").siblings("div.rpt-tree-view").find("ul.rpt-tags-list");
// 	$(ulDom).html('<li class="rpt-li-over" style="display: none;">...</li>');
// 	var liArr = [];
// 	$(ulDom).find("li").each(function(){
// 		liArr.push($(this).find("span").text());
// 	})
//
// 	var numDom = $(ulDom).siblings("div.rpt-tags-num").find("span");
// 	var num = 0;
//
// 	var checkNodes = mytree.getCheckedNodes(true);
//
// 	var allCheckNodes = [];
// 	for(var i=0;i<checkNodes.length;i++) {
// 		var halfCheck = checkNodes[i].getCheckStatus();
// 		var pnode = checkNodes[i].isParent;
//
// 		if(rpt2.rptType != "GL_RPT_COLUMNAR"){
// 			if (!halfCheck.half){
// 				allCheckNodes.push(checkNodes[i]);
// 			}
// 		}else{
// 			if (!halfCheck.half && !pnode){
// 				allCheckNodes.push(checkNodes[i]);
// 			}
// 		}
//
// 	}
//
// 	var len = 0;
// 	if(allCheckNodes.length>0 && allCheckNodes.length<NodesStr.length){
// 		for(var i=0;i<allCheckNodes.length;i++){
// 			if($.inArray(allCheckNodes[i].name, liArr) == "-1"){
// 				num++;
// 				var newLi = '<li><span data-code="'+allCheckNodes[i].id+'" title="'+allCheckNodes[i].name+'">'+allCheckNodes[i].name+'</span><b class="glyphicon icon-close"></b></li>';
// 				$(ulDom).find("li.rpt-li-over").before($(newLi));
// 				$(numDom).text(num);
// 				rpt2.selectTip(ulDom,numDom);
// 			}
// 		}
// 	}else if(allCheckNodes.length==NodesStr.length){
// 		num = allCheckNodes.length-1;
// 		if(nodeNamesArr[0] != "全部"){
// 			num = allCheckNodes.length;
// 		}else{
// 			num = allCheckNodes.length-1;
// 		}
//
// 		var newLi = '<li><span data-code="'+allCheckNodes[0].id+'" title="'+allCheckNodes[0].name+'">'+allCheckNodes[0].name+'</span><b class="glyphicon icon-close"></b></li>';
// 		//len = 60;
// 		len = ($(newLi).find("span").text().length * 14)+34;
//
// 		$(ulDom).css("width",len+"px");
// 		$(ulDom).siblings(".rpt-p-search-key").css("width",(288-len)+"px");
//
// 		$(ulDom).find("li.rpt-li-over").before($(newLi));
// 		$(numDom).text(num);
// 		$(numDom).parent("div.rpt-tags-num").show();
// 	}else{
// 		$(ulDom).find("li").hide();
// 		$(numDom).text(0);
// 		$(numDom).parent("div.rpt-tags-num").hide();
//
// 		$(ulDom).css("width","0px");
// 		$(ulDom).siblings(".rpt-p-search-key").css("width","288px");
// 	}
//
// 	$("#"+treeId).siblings("p").find("input").val("");
// };

//下拉选择创建标签
// rpt2.selectTags=function(treeId,type){
// 	var dom = treeId;
// 	var tree = type;
// 	//构建树节点标签
// 	rpt2.createTags(treeId,type);
//
// 	//余额表的操作
// 	if(rpt2.rptType == "GL_RPT_BAL"){
// 		//如果不是设置辅助项带过来的标签 才清空下面辅助项已有的标签
// //		if(treeId == "ACCO-data" && type){
// //			rpt2.changeItems();
// //		}
// 	}
// 	//明细账
// 	else if(rpt2.rptType == "GL_RPT_JOURNAL"){
//
// 	}
// 	//总账、日记账
// 	else if(rpt2.rptType == "GL_RPT_LEDGER" || rpt2.rptType == "GL_RPT_DAILYJOURNAL"){
//
// 	}
// 	//多栏账
// 	else if(rpt2.rptType == "GL_RPT_COLUMNAR"){
//
// 	}
// 	else{
// 		console.info("不是余额表、明细账、总账、日记账、多栏账,查看是否需要做细化处理！");
// 	}
//
// };

//移除树节点标签
// rpt2.removeTags=function(dom,tree){
// 	var ulDom = $(dom).parents("ul.rpt-tags-list");
//
// 	var liDom = $(dom).parent("li").remove();
// 	var treeId = $(dom).parents("div.rpt-query-li-selete").find("ul.ztree").attr("id");
// 	var domName = $(dom).siblings("span").text();
// 	var mytree = tree;
// 	var domNode = mytree.getNodeByParam("name",domName, null);
// 	var checkNodes = mytree.checkNode(domNode, false, true);
//
// 	$(ulDom).siblings(".rpt-p-search-key").find("input").val("").focus();
// };

//删除select标签
// rpt2.deleteSelete=function(dom,tree){
// 	var dom = dom;
// 	var tree = tree;
// 	//移除树节点标签
// 	rpt2.removeTags(dom,tree);
//
// 	//余额表的操作
// 	if(rpt2.rptType == "GL_RPT_BAL"){
// 		var treeId = $(dom).parents("div.rpt-query-li-selete").find("ul.ztree").attr("id");
// 		if(treeId == "ACCO-data"){
// 			rpt2.changeItems();
// 		}
// 	}
// 	//明细账的操作
// 	else if(rpt2.rptType == "GL_RPT_JOURNAL"){
// //		var treeId = $(dom).parents("div.rpt-query-li-selete").find("ul.ztree").attr("id");
// //		if(treeId == "ACCO-data"){
// //			rpt2.changeItems();
// //		}
// 	}
// 	//总账、日记账的操作
// 	else if(rpt2.rptType == "GL_RPT_LEDGER" || rpt2.rptType == "GL_RPT_DAILYJOURNAL"){
//
// 	}
// 	//多栏账
// 	else if(rpt2.rptType == "GL_RPT_COLUMNAR"){
//
// 	}
// 	else{
// 		console.info("不是余额表、明细账、总账、日记账、多栏账,查看是否需要做细化处理！");
// 	}
//
// };

//返回创建下拉选择树

var ii = "00";
// rpt2.selectTree=function(treeId,nodes){
// 	var myTree;
// 	var setting = {
// 		view: {
// 			selectedMulti: false,
// 			showLine:false,
// 			fontCss: getFontCss,
// 		},
// 		check: {
// 			enable: true
// 		},
// 		data: {
// 			simpleData: {
// 				enable: true
// 			}
// 		},
// 		callback: {
// 			onClick:zTreeOnClick,
// 			onCheck: zTreeOnCheck
// 		}
// 	};
//
// 	function zTreeOnClick(event, treeId, treeNode) {
// 		var be = treeNode.checked;
// 		myTree.checkNode(treeNode, !be, true);
// 	    rpt2.selectTags(treeId,true);
// 		$(key).val("").focus();
// 		if(rpt2.rptType == "GL_RPT_JOURNAL"){
// 			$("#"+treeId).parent("div.rpt-tree-data").hide();
// 		}
// 	};
//
// 	function zTreeOnCheck(event, treeId, treeNode) {
// 	    rpt2.selectTags(treeId,true);
// 		$(key).val("").focus();
// 		if(rpt2.rptType == "GL_RPT_JOURNAL"){
// 			$("#"+treeId).parent("div.rpt-tree-data").hide();
// 		}
// 	};
//
// 	function focusKey(e) {
// 		if (key.hasClass("empty")) {
// 			key.removeClass("empty");
// 		}
// 	}
// 	function blurKey(e) {
// 		if (key.get(0).value === "") {
// 			key.addClass("empty");
// 		}
// 	}
// 	var lastValue = "", nodeList = [], fontCss = {};
// 	function searchNode(e) {
// 		var value = $.trim(key.get(0).value);
// 		var keyType = "id";
//
// 		if (key.hasClass("empty")) {
// 			value = "";
// 		}
// 		if (lastValue === value) return;
// 		lastValue = value;
// 		if (value === "") return;
// 		updateNodes(false);
//
// 		nodeList = myTree.getNodesByParamFuzzy(keyType, value);
//
// 		updateNodes(true);
//
//
// 		var NodesArr = allNodesArr();
// 		if(nodeList.length>0){
// 			var index = NodesArr.indexOf(nodeList[0].id);
// 			$("#"+treeId).scrollTop((30*index));
// 		}
//
// 		$(key).keydown(function(e){
// 			//console.info(2222);
//
// 			if(e.keyCode==13){
// 				if(nodeList.length>0 && nodeList != null && nodeList != ""){
// 					var firstNode = myTree.getNodeByParam("name",nodeList[0].name,null);
// 					myTree.checkNode(firstNode, true, true);
// 					rpt2.selectTags(treeId,true);
// 					$(key).val("").focus();
// 					if(rpt2.rptType == "GL_RPT_JOURNAL"){
// 						$("#"+treeId).parent("div.rpt-tree-data").hide();
// 					}
// 					updateNodes(false);
// 				}else{
// 					//console.info(111);
// 					return false;
// 				}
// 			}
//
// 		});
//
// 	}
// 	function updateNodes(highlight) {
// 		for( var i=0, l=nodeList.length; i<l; i++) {
// 			nodeList[i].highlight = highlight;
// 			myTree.updateNode(nodeList[i]);
// 		}
// 	}
// 	function getFontCss(treeId, treeNode) {
// 		return (!!treeNode.highlight) ? {color:"#F04134", "font-weight":"bold"} : {color:"#333", "font-weight":"normal"};
// 	}
// 	function filter(node) {
// 		return !node.isParent && node.isFirstNode;
// 	}
//
// 	function allNodesArr(){
// 		var nodes =  myTree.getNodes();
// 		var allNodesArr = [];
// 		var allNodesStr;
// 		for(var i=0;i<nodes.length;i++){
// 			var result = "";
// 			var result =  rpt2.getAllChildrenNodes(nodes[i],result);
// 			var NodesStr = result
// 			NodesStr = NodesStr.split(",");
// 			NodesStr.splice(0,1,nodes[i].id);
// 			NodesStr = NodesStr.join(",");
// 			allNodesStr += ","+NodesStr;
// 		}
// 		allNodesArr = allNodesStr.split(",");
// 		allNodesArr.shift();
// 		return allNodesArr;
// 	}
//
// 	var key;
//
// 	$(document).ready(function(){
// 		var newNodes = [];
// 		for(var i=0;i<nodes.length;i++){
// 			var newNodeObj = {};
// 			newNodeObj.pId = nodes[i].pId;
// 			newNodeObj.id = nodes[i].id;
// 			if(nodes[i].name == "全部"){
// 				newNodeObj.name = nodes[i].name;
// 			}else{
// 				newNodeObj.name = nodes[i].id+" "+nodes[i].name;
// 			}
// 			newNodes.push(newNodeObj);
// 		}
// 		myTree = $.fn.zTree.init($("#"+treeId), setting, newNodes);
// 		myTree.expandAll(true);
//
//
// 		//暂时不考虑上下键选择节点回车选中
// 		//myTree.selectNode(myTree.getNodes()[0]);
//
// 		key = $("#"+treeId+"-key");
// 		key.bind("focus", focusKey)
// 		.bind("blur", blurKey)
// 		.bind("input", searchNode)
// 		.bind("keyup", searchNode);
//
// 		//将已创建的标签在树节点上标记选中
// 		var ulDom = $("#"+treeId).parent("div.rpt-tree-data").siblings("div.rpt-tree-view").find("ul.rpt-tags-list");
// 		var liArr = [];
// 		$(ulDom).find("li").not("li.rpt-li-over").each(function(){
// 			liArr.push($(this).find("span").text());
// 		})
// 		if(liArr.length>0){
// 			for(var i=0;i<liArr.length;i++){
// 				var thisNode = myTree.getNodeByParam("name",liArr[i],null);
// 				myTree.checkNode(thisNode, true, true)
// 			}
// 		}
//
// 		//console.info(myTree.getCheckedNodes(true).length);
// 		if(rpt2.rptType=="GL_RPT_BAL" && myTree.getCheckedNodes(true).length=="0" && treeId=="ACCO-data"){
// 			myTree.checkAllNodes(true);
// 			var allCheckNodes = myTree.getCheckedNodes(true);
// 			var num = allCheckNodes.length;
// 			var newLi = '<li><span data-code="'+allCheckNodes[0].id+'" title="'+allCheckNodes[0].name+'">'+allCheckNodes[0].name+'</span><b class="glyphicon icon-close"></b></li>';
// 			len = ($(newLi).find("span").text().length * 14)+34;
// 			var ulDom = $("#"+treeId).parent("div.rpt-tree-data").siblings("div.rpt-tree-view").find("ul.rpt-tags-list");
// 			var numDom = $(ulDom).siblings("div.rpt-tags-num").find("span");
// 			$(ulDom).css("width",len+"px");
// 			$(ulDom).siblings(".rpt-p-search-key").css("width",(288-len)+"px");
// 			$(ulDom).find("li.rpt-li-over").before($(newLi));
// 			$(numDom).text(num);
// 			$(numDom).parent("div.rpt-tags-num").show();
// 		}
//
//
// 		//删除select标签
// 		$(".rpt-query-li-selete .rpt-tags-list").on("click","b.icon-close",function(){
// 			rpt2.deleteSelete(this,myTree);
// 			zTreeOnCheck(event, treeId, myTree);
// 		});
//
// 		//回车删除标签节点
// 		$(key).keydown(function(e){
//
// 			if(e.keyCode==8){
//
// 					console.info("back");
// 					if($(key).val() == ""){
// 						var numDom = $("#"+treeId).parents(".rpt-query-li-selete").find(".rpt-tags-num");
// 						var tagsUl = $("#"+treeId).parents(".rpt-query-li-selete").find(".rpt-tags-list");
// 						var len = $(tagsUl).find("li").length;
// 						console.info(len);
// 						if(len>1){
// 							var that = $(tagsUl).find("li").eq(length-2).find("b.icon-close");
// 							console.info($(tagsUl).find("li").eq(length-2).find("span").text());
// 							rpt2.deleteSelete(that,myTree);
// 							zTreeOnCheck(event, treeId, myTree);
// 							return false;
// 						}else{
// 							return false;
// 						}
// 					}
// 			}
// 		});
//
// 	});
//
// 	return myTree;
// };

//返回需要需要显示辅助项的HTML
// rpt2.queryInputHtml=function(liArr){
// 	var inputHtml = "";
// 	var tagHtml = "";
// 	var tipHtml = "";
// 	var liHtml = "";
// 	var liHtml0 ='<li class="rpt-query-box-li rpt-query-box-li0">'+
// 					'<label class="rpt-query-li-cont-title"><span title="<%=name%>" data-pos="<%=pos%>" data-dir="<%=dir%>" data-seq="<%=seq%>" data-code="<%=code%>" id="<%=code%>"><%=name%></span>：</label>'+
// 					'<div class="rpt-query-li-cont">'+
// 						'<div class="rpt-query-li-selete">'+
// 							'<div class="rpt-tree-view bordered-input">'+
// 								'<ul class="rpt-tags-list">';
// 					 	var liHtml1 ='<li class="rpt-li-over" style="display:none;">...</li>'+
// 								'</ul>'+
// 								'<p class="rpt-p-search-key">'+
// 									'<input type="text" id="<%=code%>-data-key">'+
// 								'</p>'+
// 								'<div class="rpt-tags-num" style="display:none;">(<span><%=num%></span>)</div>'+
// 							'</div>'+
// 							'<div class="rpt-tree-data bordered-input" style="display:none;">'+
// 								'<ul id="<%=code%>-data" class="ufmaTree ztree"></ul>'+
// 							'</div>'+
// 						'</div>'+
// 						'<div class="rpt-query-li-tip">'+
// 							'<span class="rpt-query-li-tip-t">推荐：</span>'+
// 							'<span class="rpt-query-li-tip-c" id="<%=code%>Tips" data-item="<%=code%>">';
//
// 				var liHtml2='</span>'+
// 						'</div>'+
// 					'</div>'+
// 				'</li>';
//
// 	for(var i=0;i<liArr.length;i++){
// 		tagHtml = "";
// 		if(liArr[i].items.length>0){
// 			for(var j=0;j<liArr[i].items.length;j++){
// 				var th = ufma.htmFormat('<li><span data-code="<%=tagCode%>" title="<%=tagName%>"><%=tagName%></span><b class="glyphicon icon-close"></b></li>',{
// 							tagCode:liArr[i].items[j].code,
// 							tagName:liArr[i].items[j].name
// 						});
//
// 				tagHtml += th;
// 			}
// 		}
// 		//console.info(tagHtml);
//
// 		tipHtml = "";
// 		if(liArr[i].tips != null && liArr[i].tips.length>0){
// 			for(var j=0;j<liArr[i].tips.length;j++){
// 				var ih = ufma.htmFormat('<i title="<%=tipName%>" data-code="<%=tipCode%>" ><%=tipName%></i>',{
// 							tipCode:liArr[i].tips[j].chrCode,
// 							tipName:liArr[i].tips[j].chrName
// 						});
//
// 				tipHtml += ih;
// 			}
// 		}
//
// 		liHtml = liHtml0+tagHtml+liHtml1+tipHtml+liHtml2;
// 		var bh = ufma.htmFormat(liHtml,{
// 				dir:liArr[i].itemDir,
// 				seq:liArr[i].seq,
// 				pos:liArr[i].itemPos,
// 				name:liArr[i].itemTypeName,
// 				code:liArr[i].itemType,
// 				num:liArr[i].items.length
// 			});
// 		inputHtml += bh;
// 	}
// 	return inputHtml;
// };

//返回需要需要显示辅助项的HTML（多栏账）
// rpt2.queryCondHtml=function(liArr,type){
// 	//console.info("===="+JSON.stringify(liArr));
// 	var inputHtml = "";
// 	var tagHtml = "";
// 	var liHtml = "";
// 	var liHtml0='<div class="rpt-query-box-li rpt-query-box-li0">'+
// 					'<label class="rpt-query-li-cont-title" id="rpt-query-li-cont-title-Columnar"><span title="<%=name%>" data-pos="<%=pos%>" data-dir="<%=dir%>" data-seq="<%=seq%>" data-code="<%=code%>" id="<%=code%>"><%=name%></span>：</label>'+
// 					'<div class="rpt-query-li-cont">'+
// 						'<div class="rpt-query-li-selete">'+
// 							'<div class="rpt-tree-view bordered-input">'+
// 								'<ul class="rpt-tags-list">';
// 					var liHtml1 = '<li class="rpt-li-over" style="display:none;">...</li>'+
// 								'</ul>'+
// 								'<p class="rpt-p-search-key">'+
// 									'<input type="text" id="<%=code%>-data-key">'+
// 								'</p>'+
// 								'<div class="rpt-tags-num" style="display:none;">(<span><%=num%></span>)</div>'+
// 							'</div>'+
// 							'<div class="rpt-tree-data bordered-input" style="display:none;">'+
// 								'<ul id="<%=code%>-data" class="ufmaTree ztree"></ul>'+
// 							'</div>'+
// 						'</div>'+
// 					'</div>'+
// 				'</div>';
//
// 	if(type=="1"){
// 		if(liArr.length>0){
// 			tagHtml = "";
// 			if(liArr[0].items.length>0){
// 				for(var j=0;j<liArr[0].items.length;j++){
// 					var th = ufma.htmFormat('<li><span data-code="<%=tagCode%>" title="<%=tagName%>"><%=tagName%></span><b class="glyphicon icon-close"></b></li>',{
// 								tagCode:liArr[0].items[j].code,
// 								tagName:liArr[0].items[j].name
// 							});
//
// 					tagHtml += th;
// 				}
// 			}
// 			//console.info(tagHtml);
// 			liHtml = liHtml0 + tagHtml + liHtml1;
// 			var bh = ufma.htmFormat(liHtml,{
// 					dir:liArr[0].itemDir,
// 					seq:liArr[0].seq,
// 					pos:liArr[0].itemPos,
// 					name:liArr[0].itemTypeName,
// 					code:liArr[0].itemType,
// 					num:liArr[0].items.length
// 				});
//
// 			inputHtml ='<li class="rpt-query-box-li">'+
// 							'<label style="margin-left:-4px;" class="rpt-query-li-cont-title"><span>选择条件</span>></label>'+
// 							'<div class="rpt-query-li-cont">'+
// 								bh+
// 							'</div>'+
// 						'</li>';
// 		}
//
// 		if(liArr.length>1){
// 			for(var i=1;i<liArr.length;i++){
// 				tagHtml = "";
// 				if(liArr[i].items.length>0){
// 					for(var j=0;j<liArr[i].items.length;j++){
// 						var th = ufma.htmFormat('<li><span data-code="<%=tagCode%>" title="<%=tagName%>"><%=tagName%></span><b class="glyphicon icon-close"></b></li>',{
// 									tagCode:liArr[i].items[j].code,
// 									tagName:liArr[i].items[j].name
// 								});
//
// 						tagHtml += th;
// 					}
// 				}
// 				//console.info(tagHtml);
// 				liHtml = liHtml0 + tagHtml + liHtml1;
// 				var bh = ufma.htmFormat(liHtml,{
// 						dir:liArr[i].itemDir,
// 						seq:liArr[i].seq,
// 						pos:liArr[i].itemPos,
// 						name:liArr[i].itemTypeName,
// 						code:liArr[i].itemType,
// 						num:liArr[i].items.length
// 					});
// 				inputHtml += ('<li class="rpt-query-box-li">'+bh+'</li>');
// 			}
// 		}
// 	}else if(type=="2"){
// 		if(liArr.length>0){
// 			for(var i=0;i<liArr.length;i++){
// 				tagHtml = "";
// 				if(liArr[i].items.length>0){
// 					for(var j=0;j<liArr[0].items.length;j++){
// 						var th = ufma.htmFormat('<li><span data-code="<%=tagCode%>" title="<%=tagName%>"><%=tagName%></span><b class="glyphicon icon-close"></b></li>',{
// 									tagCode:liArr[i].items[j].code,
// 									tagName:liArr[i].items[j].name
// 								});
//
// 						tagHtml += th;
// 					}
// 				}
// 				//console.info(tagHtml);
// 				liHtml = liHtml0 + tagHtml + liHtml1;
// 				var bh = ufma.htmFormat(liHtml,{
// 						dir:liArr[i].itemDir,
// 						seq:liArr[i].seq,
// 						pos:liArr[i].itemPos,
// 						name:liArr[i].itemTypeName,
// 						code:liArr[i].itemType,
// 						num:liArr[i].items.length
// 					});
// 				inputHtml += ('<li class="rpt-query-box-li">'+bh+'</li>');
// 			}
// 		}
// 	}
// 	//console.info(inputHtml);
// 	return inputHtml;
// };


//返回当前选中的科目范围
// rpt2.checkItemTags=function(itemCode){
// 	var tags = $("#"+itemCode+"-data-key").parent("p.rpt-p-search-key").siblings("ul.rpt-tags-list").find("li");
// 	var itemCodeRange = "";//选中科目范围
// 	if(tags.length>1){
// 		for(var i=0;i<tags.length-1;i++){
// 			itemCodeRange += ","+tags.eq(i).find("span").data("code");
// 		}
// 		itemCodeRange = itemCodeRange.substr(1);
// 	}else{
// 		itemCodeRange = "0";
// 	}
// 	return itemCodeRange;
// };

//展开隐藏共享查询方案
// rpt2.showHideShareMethod=function(){
// 	$(rpt2.namespace).on("click","#showMethodTip",function(){
// 		rpt2.reqSharePrjList();
// 		$(this).siblings("div.rpt-share-method-box").show();
// 	});
// 	$(rpt2.namespace).on("click",function(e){
// 		if($(e.target).closest("#showMethodTip").length == 0 && $(e.target).closest("div.rpt-share-method-box").length == 0){
// 	   		$("div.rpt-share-method-box").hide();
//         }
// 	});
// 	$(rpt2.namespace).on("mouseenter","div.rpt-share-method-box",function(){
// 		$(this).show();
// 	}).on("mouseleave","div.rpt-share-method-box",function(){
// 		$(this).hide();
// 	});
// };

//展开隐藏-设置查询条件
// rpt2.showHideSettingBox=function(){
// 	$(rpt2.namespace).find("#rpt-chr-setting-btn").on("click",function(){
// 		$(rpt2.namespace).find("div.rpt-chr-setting-box").show();
// 	});
// 	$(rpt2.namespace).find(".rpt-chr-setting-box .icon-close,.rpt-chr-setting-box .btn-default").on("click",function(){
// 		$(rpt2.namespace).find("div.rpt-chr-setting-box").hide();
// 	});
// 	$(rpt2.namespace).on("click",function(e){
// 		if($(e.target).closest("#rpt-chr-setting-btn").length == 0 && $(e.target).closest("div.rpt-chr-setting-box").length == 0){
// 	   		$("div.rpt-chr-setting-box").hide();
//         }
// 	});
// };

//显示更多查询方案
// rpt2.showMoreMethod=function(){
// 	$(rpt2.namespace).on("click","div.rpt-method-more",function(){
// 		//$(".rpt-method-box-cont").addClass("rpt-method-box-cont-show").animate({"height":($(".rpt-method-list").height()+9)+"px"});
// 		$(".rpt-method-box-cont").addClass("rpt-method-box-cont-show").css({"height":($(".rpt-method-list").height()+9)+"px","padding-left":"76px"});
// 		$("ul.method-list").css({"margin-left":"43px"});
// 		$(".rpt-method-title").css({"left":"8px"});
// 		$(this).hide();
// 	});
// 	$(rpt2.namespace).on("mouseenter",".rpt-method-box-cont-show",function(){
// 		$(this).show();
// 	})
// 	.on("mouseleave",".rpt-method-box-cont-show",function(){
// 		$(this).removeClass("rpt-method-box-cont-show").css({"height":"40px","padding-left":"68px"});
// 		$("ul.rpt-method-list").css({"margin-left":"-32px"});
// 		$(".rpt-method-title").css({"left":"0px"});
// 		rpt2.moreMethodBtn("rpt-method-list","rpt-method-more");
// 	});
// };

//打开-保存查询方案模态框
// rpt2.openSaveMethodModal=function(){
// 	$(rpt2.namespace).find('#saveMethod').on('click',function(){
// 		var meLi = $(rpt2.namespace).find(".rpt-method-list li.isUsed");
// 		if($(meLi).length>0){
// 			var code = $(meLi).find("span").data("code");
// 			var name = $(meLi).find("span").text();
// 			var scope = $(meLi).find("span").data("scope");//作用域
// 			$("#methodName").val(name).attr("data-code",code);
// 			$(".rpt-radio-span").eq(scope-1).find("input").attr("checked");
// 			$(".rpt-radio-span").eq(scope-1).siblings().find("input").removeAttr("checked");
//
// 		}else{
// 			$("#methodName").val("").attr("data-code","");
// 			$(".rpt-radio-span").eq(0).find("input").attr("checked");
// 			$(".rpt-radio-span").eq(0).siblings().find("input").removeAttr("checked");
// 		}
//
// 		rpt2.setQuery = ufma.showModal('saveMethod-box',600,320);
// 	});
// 	$(rpt2.namespace).find('.btn-close').on('click',function(){
// 		rpt2.setQuery.close();
// 	});
// };

//输入方案名的提示
// rpt2.methodNameTips=function(){
// 	$(rpt2.namespace).find('#methodName').on('focus',function(){
// 		ufma.hideInputHelp('methodName');
// 		$('#methodName').closest('.form-group').removeClass('error');
// 	}).on("blur",function(){
// 		if($("#methodName").val().trim() == ""){
// 			ufma.showInputHelp('methodName','<span class="error">方案名称不能为空</span>');
// 			$('#methodName').closest('.form-group').addClass('error');
// 		}
// 	});
// };

//返回账表其他选项的数组对象
// rpt2.rptOptionArr = function(){
// 	var rptOptionArr = [];
// 	var labelDom;
// 	if(rpt2.rptType == "GL_RPT_VOUSUMMARY"){
// 		labelDom = $(rpt2.namespace).find(".rpt-check");
// 	}else{
// 		labelDom = $(rpt2.namespace).find(".rpt-query-li-check label");
// 	}
// 	$(labelDom).each(function(){
// 		var rptOptionObj = {};
//
// 		var flag = $(this).find("input").prop("checked");
// 		if(flag){
// 			rptOptionObj.defCompoValue = "Y";
// 		}else{
// 			rptOptionObj.defCompoValue = "N";
// 		}
//
// 		rptOptionObj.optCode = $(this).find("input").attr("id");
// 		rptOptionObj.optName = $(this).text();
//
// 		rptOptionArr.push(rptOptionObj);
//
// 	})
//
// 	return rptOptionArr;
// };

//返回辅助项的数组对象
// rpt2.qryItemsArr = function(){
// 	var qryItemsArr = [];
// 	$(rpt2.namespace).find(".rpt-query-box-li0").each(function(i){
// 		var qryItemsObj = {};
//
// 		if(i=="0" && rpt2.rptType == "GL_RPT_JOURNAL"){
// 			qryItemsObj.itemDir =  $(rpt2.namespace+" #selectTitle").data("dir");
// 			qryItemsObj.itemPos =  $(rpt2.namespace+" #selectTitle").data("pos");
// 			qryItemsObj.itemType = $(rpt2.namespace+" #selectTitle").val();
// 			qryItemsObj.itemTypeName = $(rpt2.namespace+" #selectTitle").find("option:checked").text();
// 		}else if(i=="0" && rpt2.rptType == "GL_RPT_COLUMNAR"){
// 			qryItemsObj.itemDir =  $(rpt2.namespace+" .rpt-btn-switch .btn-primary").attr("data-code");
// 			qryItemsObj.itemPos =  "row";
// 			qryItemsObj.itemType = $(rpt2.namespace+" #selectTitle").val();
// 			qryItemsObj.itemTypeName = $(rpt2.namespace+" #selectTitle").find("option:checked").text();
// 		}else{
// 			var spanDom = $(this).find(".rpt-query-li-cont-title span");
// 			qryItemsObj.itemDir =  $(spanDom).data("dir");//展开方向(仅当位置为列时，有效);('dr','cr','dbl')
// 			qryItemsObj.itemPos =  $(spanDom).data("pos");//核算项数据位置（行、列）
// 			qryItemsObj.itemType = $(spanDom).data("code");//核算项类别代码
// 			qryItemsObj.itemTypeName = $(spanDom).text();//核算项类别名称
// 		}
//
// 		qryItemsObj.seq = i;//核算项类别顺序号
//
// 		qryItemsObj.items = [];//选择的核算项的值
// 		var tagsLiDom = $(this).find(".rpt-tags-list li");
// 		if(tagsLiDom.length>1){
// 			for(var i=0;i<tagsLiDom.length-1;i++){
// 				var itemObj = {};
// 				itemObj.code = $(tagsLiDom).eq(i).find("span").data("code").toString();
// 				itemObj.name = $(tagsLiDom).eq(i).find("span").text();
// 				qryItemsObj.items.push(itemObj);
// 			}
// 		}
//
// 		qryItemsArr.push(qryItemsObj);
//
// 	})
//
// 	return qryItemsArr;
// };

//返回方案内容对象
// rpt2.prjContObj = function(){
// 	//方案内容
// 	prjContObj = {};
//
// 	//会计体系代码
// 	prjContObj.accaCode = $(rpt2.namespace+" #accaList").find(".btn-primary").data("code");
//
// 	//选择的单位账套信息
// 	prjContObj.agencyAcctInfo = [];
// 	var acctInfoObj = {};
// 	acctInfoObj.acctCode = rpt2.nowAcctCode;//账套代码
// 	acctInfoObj.agencyCode = rpt2.nowAgencyCode;//单位代码
// 	prjContObj.agencyAcctInfo.push(acctInfoObj);
//
// 	if(rpt2.rptType == "GL_RPT_BAL" || rpt2.rptType == "GL_RPT_LEDGER"){
// 		prjContObj.startDate = "";//起始日期(如2017-01-01)
// 		prjContObj.endDate = "";//截止日期(如2017-01-01)
//
// 		prjContObj.startYear = $(rpt2.namespace+" #dateStart").datetimepicker('getDate').getFullYear();//起始年度(只有年，如2017)
// 		prjContObj.startFisperd = $(rpt2.namespace+" #dateStart").datetimepicker('getDate').getMonth()+1;//起始期间(只有月份，如7)
// 		prjContObj.endYear = $(rpt2.namespace+" #dateEnd").datetimepicker('getDate').getFullYear();//截止年度(只有年，如2017)
// 		prjContObj.endFisperd = $(rpt2.namespace+" #dateEnd").datetimepicker('getDate').getMonth()+1;//截止期间(只有月份，如7)
// 	}else if(rpt2.rptType == "GL_RPT_JOURNAL" ||  rpt2.rptType == "GL_RPT_DAILYJOURNAL" || rpt2.rptType == "GL_RPT_VOUSUMMARY" || rpt2.rptType == "GL_RPT_COLUMNAR"){
// 		prjContObj.startDate = $(rpt2.namespace+" #dateStart").val();//起始日期(如2017-01-01)
// 		prjContObj.endDate = $(rpt2.namespace+" #dateEnd").val();//截止日期(如2017-01-01)
//
// 		prjContObj.startYear = "";//起始年度(只有年，如2017)
// 		prjContObj.startFisperd = "";//起始期间(只有月份，如7)
// 		prjContObj.endYear = "";//截止年度(只有年，如2017)
// 		prjContObj.endFisperd = "";//截止期间(只有月份，如7)
// 	}else{
// 		console.info("不是余额表、明细账、总账、日记账、凭证汇总表、多栏账,查看是否需要做细化处理！");
// 	}
//
// 	if(rpt2.rptType != "GL_RPT_VOUSUMMARY"){
// 		//核算项设置
// 		prjContObj.qryItems = rpt2.qryItemsArr();
// 		//查询条件对象
// 		prjContObj.rptCondItem = [];
// 	}else{
// 		prjContObj.qryItems = [];
// 		//查询条件对象
// 		prjContObj.rptCondItem = [
// 			{
// 				"condCode":"vouType",
// 				"condName":"凭证字号",
// 				"condText":$(rpt2.namespace+" #rpt-pzzh-select").text(),
// 				"condValue":$(rpt2.namespace+" #rpt-pzzh-select option:checked").val()
// 			},
// 			{
// 				"condCode":"vouTypeFrom",
// 				"condName":"凭证编号起",
// 				"condText":$(rpt2.namespace+" #rpt-pzzh-input-form").val(),
// 				"condValue":$(rpt2.namespace+" #rpt-pzzh-input-form").val()
// 			},
// 			{
// 				"condCode":"vouTypeTo",
// 				"condName":"凭证编号止",
// 				"condText":$(rpt2.namespace+" #rpt-pzzh-input-to").val(),
// 				"condValue":$(rpt2.namespace+" #rpt-pzzh-input-to").val()
// 			},
// 			{
// 				"condCode":"vouSource",
// 				"condName":"凭证来源",
// 				"condText":$(rpt2.namespace+" #rpt-pzly-select").text(),
// 				"condValue":$(rpt2.namespace+" #rpt-pzly-select option:checked").val()
// 			},
// 			{
// 				"condCode":"accoSumLevel",
// 				"condName":"汇总方式",
// 				"condText":$(rpt2.namespace+" #rpt-hzfs-select").text(),
// 				"condValue":$(rpt2.namespace+" #rpt-hzfs-select option:checked").val()
// 			}
// 		];
// 	}
//
// 	//账表查询项
// 	prjContObj.rptOption = rpt2.rptOptionArr();
//
// 	if(rpt2.rptType == "GL_RPT_JOURNAL"){
// 		prjContObj.curCode = $(rpt2.namespace+" .rpt-table-sub-tip-currency i").attr("data-type");//币种代码
// 		prjContObj.rptStyle = $(rpt2.namespace+" .change-rpt-type i").attr("data-type");//账表样式
// 	}else{
// 		prjContObj.curCode = "";//币种代码
// 		prjContObj.rptStyle = "";//账表样式
// 	}
// 	prjContObj.rptTitleName = $(rpt2.namespace+" .rpt-table-title-show span").text();//账表中标题名称
//
// 	return prjContObj;
// };

//改变第一个辅助项(科目辅助项名称是下拉选择时需要用到)
// rpt2.changeFirstItem=function(itemCode){
// 	//销毁所有树
// //	$(".ztree:not(#cbAgency_tree)").each(function(){
// //		var zId = $(this).attr("id");
// //		$.fn.zTree.destroy(zId);
// //	});
//
// 	$(".rpt-p-search-key").eq(0).find("input").attr("id",itemCode+"-data-key");
// 	$(".rpt-tree-data").eq(0).find("ul").attr("id",itemCode+"-data").html("");
// 	$(".rpt-tags-list").eq(0).html('<li class="rpt-li-over" style="display:none;">...</li>').css("width","0");
// 	$(".rpt-tags-list").eq(0).siblings("p").css("width","288px");
// 	$(".rpt-tags-num").eq(0).html('(<span>0</span>)').hide();
// 	$(".rpt-query-li-tip-c").eq(0).attr({
// 		"id":itemCode+"Tips",
// 		"data-item":itemCode
// 	});
//
// 	if(rpt2.rptType == "GL_RPT_JOURNAL"){
// 		//请求第一个推荐
// 		rpt2.reqItemTip(itemCode);
//
// 		//清空新增的辅助项
// 		$(".rpt-query-box-bottom .rpt-query-box-li0:gt(0)").remove();
// 	}else if(rpt2.rptType == "GL_RPT_COLUMNAR"){
// 		$(".rpt-query-box-bottom .rpt-query-box-li").last().prevAll().remove();
// 	}
//
// };

//根据会计科目范围实时改变选中的辅助项(余额表)
// rpt2.changeItems=function(){
// 	var accoCodeRange = rpt2.checkItemTags("ACCO");//选中会计科目范围
// 	var accItemArgu = {
// 		"accoCodeRange":accoCodeRange,
// 		"acctCode":rpt2.nowAcctCode,
// 		"agencyCode":rpt2.nowAgencyCode,
// 		"setYear":rpt2.nowSetYear,
// 		"userId":rpt2.nowUserId
// 	};
// 	ufma.ajax(rpt2.portList.rptAccItemTypeList,"get",accItemArgu,rpt2.isShowItems);
// };

//回调函数——改变选中的辅助项目
// rpt2.isShowItems=function(result){
// 	var data = result.data.tips;
// 	var codeArr = [];
// 	for(var i=0;i<data.length;i++){
// 		codeArr.push(data[i].accItemType);
// 	}
//
// //	var topLi = $(".rpt-query-box-top").find("li.rpt-query-box-li");
// //	if(topLi.length>1){
// //		for(var i=1;i<topLi.length;i++){
// //			var code = $(topLi).eq(i).find("label span").data("code");
// //			if($.inArray(code, codeArr) == "-1"){
// //				$(topLi).eq(i).remove();
// //			}
// //		}
// //	}
// 	var bottomLi = $(".rpt-query-box-bottom").find("li.rpt-query-box-li");
// 	if(bottomLi.length>2){
// 		for(var i=0;i<bottomLi.length-2;i++){
// 			var code = $(bottomLi).eq(i).find("label span").data("code");
// 			if($.inArray(code, codeArr) == "-1"){
// 				$(bottomLi).eq(i).remove();
// 			}
// 		}
// 	}
// };


/**账表页面通用请求回调方法***********************************************************************/

//----------------------币种列表 start-------------------------//
//请求币种列表
// rpt2.reqCurrType = function(){
// 	var reqUrl = rpt2.portList.getCurrType+rpt2.nowAgencyCode;
// 	ufma.ajax(reqUrl,"get","",function(result){
// 		var data = result.data;
// 		if(data.length>0){
// 			var selectHtml = "";
// 			for(var i=0;i<data.length;i++){
// 				var sHtml = ufma.htmFormat('<option value="<%=code%>"><%=name%></option>',{
// 					code:data[i].currencyCode,
// 					name:data[i].currencyName
// 				});
// 				selectHtml += sHtml;
// 			}
// 			$(rpt2.namespace+" .rpt-table-sub-tip-currency select").html(selectHtml);
// 			$(rpt2.namespace+" .rpt-table-sub-tip-currency select").val(data[0].currencyCode);
// 			$(rpt2.namespace+" .rpt-table-sub-tip-currency i").text(data[0].currencyName);
// 			$(rpt2.namespace+" .rpt-table-sub-tip-currency i").attr("data-type",data[0].currencyCode);
// 		}
// 	});
// };
//----------------------币种列表 end-----------------------------//

//----------------------凭证字号 start-------------------------//
//请求凭证字号列表
// rpt2.reqVoutype = function(){
// 	var reqUrl = rpt2.portList.getVoutype+rpt2.nowAgencyCode+"/"+rpt2.nowSetYear;
// 	ufma.ajax(reqUrl,"get","",function(result){
// 		var data = result.data;
// 		var selectHtml = "";
// 		for(var i=0;i<data.length;i++){
// 			var sHtml = ufma.htmFormat('<option value="<%=code%>"><%=name%></option>',{
// 				code:data[i].CHR_CODE,
// 				name:data[i].CHR_NAME
// 			});
// 			selectHtml += sHtml;
// 		}
//
// 		selectHtml = '<option value=""></option>' + selectHtml;
// 		$(rpt2.namespace+" #rpt-pzzh-select").html(selectHtml);
// 	});
// };
//----------------------凭证字号 end-----------------------------//

//----------------------凭证类型、字号 start-------------------------//
//请求凭证类型、字号列表
// rpt2.getVouTypeFull = function(){
// 	var reqUrl = rpt2.portList.getVouTypeFull+rpt2.nowAgencyCode+"/"+rpt2.nowSetYear;
// 	ufma.ajax(reqUrl,"get","",function(result){
// 		var data = result.data;
// 		var selectHtml = "";
// 		for(var i=0;i<data.length;i++){
// 			var sHtml = ufma.htmFormat('<option value="<%=code%>" data-name="<%=name%>"><%=fullName%></option>',{
// 				code:data[i].CHR_CODE,
// 				name:data[i].CHR_NAME,
// 				fullName:data[i].VOU_FULLNAME
// 			});
// 			selectHtml += sHtml;
// 		}
// 		$(rpt2.namespace+" #rpt-pzlx-select").html(selectHtml);
//
// 		var selectHtml2 = "";
// 		for(var i=0;i<data.length;i++){
// 			var sHtml2 = ufma.htmFormat('<option value="<%=code%>" data-fullname="<%=fullName%>"><%=name%></option>',{
// 				code:data[i].CHR_CODE,
// 				name:data[i].CHR_NAME,
// 				fullName:data[i].VOU_FULLNAME
// 			});
// 			selectHtml2 += sHtml2;
// 		}
// 		$(rpt2.namespace+" #rpt-pzzh-select").html(selectHtml2);
//
// 	});
// };
//----------------------凭证类型、字号 end-----------------------------//

//----------------------汇总方式 start-------------------------//
//请求汇总方式列表
// rpt2.reqEleLevelNum = function(){
// 	var argu = {
// 		"agencyCode":rpt2.nowAgencyCode,
// 		"acctCode":rpt2.nowAcctCode,
// 		"eleCode":"ACCO"
// 	};
// 	ufma.ajax(rpt2.portList.getEleLevelNum,"get",argu,function(result){
// 		var data = result.data;
// 		var selectHtml = "";
// 		for(var i=0;i<data.length;i++){
// 			var sHtml = ufma.htmFormat('<option value="<%=code%>"><%=name%></option>',{
// 				code:data[i].levelNum,
// 				name:data[i].levelNumText
// 			});
// 			selectHtml += sHtml;
// 		}
// 		$(rpt2.namespace+" #rpt-hzfs-select").html(selectHtml);
// 	});
// };
//----------------------汇总方式 end-----------------------------//

//----------------------凭证来源 start-------------------------//
//请求凭证来源列表
// rpt2.getVOU_SOURCE = function(){
// 	ufma.ajax(rpt2.portList.getVOU_SOURCE,"get","",function(result){
// 		var data = result.data;
// 		var pzlyHtml = "";
// 		for(var i=0;i<data.length;i++){
// 			var oHtml = ufma.htmFormat('<option value="<%=code%>"><%=name%></option>',{
// 				code:data[i].ENU_CODE,
// 				name:data[i].ENU_NAME
// 			});
// 			pzlyHtml += oHtml;
// 		}
// 		pzlyHtml = '<option value="*">全部</option>'+pzlyHtml;
// 		$(rpt2.namespace+" #rpt-pzly-select").html(pzlyHtml);
// 	})
// };
//----------------------凭证来源 end-----------------------------//

//----------------------请求账务凭证数列表 start----------------------//
rpt2.reqVouBoxCount = function () {
    var accArgu = {
        "setYear": rpt2.nowSetYear,
        "rgCode": rpt2.rgCode,
        "acctCode": rpt2.nowAcctCode,
        "agencyCode": rpt2.nowAgencyCode
    }
    ufma.get(rpt2.portList.getVouBoxCount, accArgu, function (result) {
        var data = result.data;
        var accArr = [];
        var numAll = 0;
        var numO = 0;
        var numA = 0;
        var numF = 0;
        var numP = 0;
        for (var i = 0; i < data.length; i++) {
            var accObj = {};
            //期间
            accObj.fisPerd = data[i].fisPerd;
            //状态
            if (data[i].status == "CLOSED") {
                accObj.status = "已结账";
            } else if (data[i].status == "OPENED") {
                accObj.status = "未结账";
            }
            //凭证数
            accObj.vouCount = data[i].vouCount;
            numAll += parseInt(data[i].vouCount);

            if (data[i].vouBoxCount.length > 0) {
                for (var j = 0; j < data[i].vouBoxCount.length; j++) {
                    var countObj = data[i].vouBoxCount;
                    //未审核
                    var vouStatusO = $.inArrayJson(countObj, "VOU_STATUS", "O");
                    //审核数
                    var vouStatusA = $.inArrayJson(countObj, "VOU_STATUS", "A");
                    //复审数
                    var vouStatusF = $.inArrayJson(countObj, "VOU_STATUS", "F");
                    //记账数
                    var vouStatusP = $.inArrayJson(countObj, "VOU_STATUS", "P");

                    if ($.isNull(vouStatusO)) {
                        accObj.vouStatusO = "0";
                    } else {
                        accObj.vouStatusO = vouStatusO.count;
                    }

                    if ($.isNull(vouStatusA)) {
                        accObj.vouStatusA = "0";
                    } else {
                        accObj.vouStatusA = vouStatusA.count;
                    }

                    if ($.isNull(vouStatusF)) {
                        accObj.vouStatusF = "0";
                    } else {
                        accObj.vouStatusF = vouStatusF.count;
                    }

                    if ($.isNull(vouStatusP)) {
                        accObj.vouStatusP = "0";
                    } else {
                        accObj.vouStatusP = vouStatusP.count;
                    }
                }

            } else {
                accObj.vouStatusO = "0";
                accObj.vouStatusA = "0";
                accObj.vouStatusF = "0";
                accObj.vouStatusP = "0";
            }
            accArr.push(accObj);
        }

        for (var n = 0; n < accArr.length; n++) {
            numO += parseInt(accArr[n].vouStatusO);
            numA += parseInt(accArr[n].vouStatusA);
            numF += parseInt(accArr[n].vouStatusF);
            numP += parseInt(accArr[n].vouStatusP);
        }

        var accLast = {
            "fisPerd": "合计",
            "status": "",
            "vouCount": numAll,
            "vouStatusO": numO,
            "vouStatusA": numA,
            "vouStatusF": numF,
            "vouStatusP": numP
        }
        accArr.push(accLast);
        rpt2.newAccTable(accArr);
    })
};
//----------------------请求账务凭证数列表 end------------------------//

//请求科目辅助项下拉列表(明细账、多栏账)
// rpt2.reqSelectItems=function(){
// 	var accItemArgu = {
// 		"accoCodeRange":"",//选中科目范围
// 		"acctCode":rpt2.nowAcctCode,
// 		"agencyCode":rpt2.nowAgencyCode,
// 		"setYear":rpt2.nowSetYear,
// 		"userId":rpt2.nowUserId
// 	};
// 	ufma.ajax(rpt2.portList.rptAccItemTypeList,"get",accItemArgu,function(result){
// 		//销毁所有树
// //		$(rpt2.namespace+" .ztree:not(#cbAgency_tree)").each(function(){
// //			var zId = $(this).attr("id");
// //			$.fn.zTree.destroy(zId);
// //		});
//
// 		var listItem = result.data;
// 		var seleHtml = "";
// 		for(var i=0;i<listItem.length;i++){
// 			var opt = ufma.htmFormat('<option value="<%=code%>" ><%=name%></option>',{
// 							code:listItem[i].accItemCode,
// 							name:listItem[i].accItemName
// 						});
// 			seleHtml += opt;
// 		}
// 		$(rpt2.namespace+" #selectTitle").html(seleHtml);
// 		$(rpt2.namespace+" #selectTitle").find("option").eq(0).prop("checked",true);
// 		$(rpt2.namespace+" .rpt-p-search-key").eq(0).find("input").attr("id",listItem[0].accItemCode+"-data-key");
// 		$(rpt2.namespace+" .rpt-tree-data").eq(0).find("ul").attr("id",listItem[0].accItemCode+"-data")
//
// //		$(rpt2.namespace+" .rpt-tags-list").eq(0).html('<li class="rpt-li-over" style="display:none;">...</li>').css("width","0");
// //		$(rpt2.namespace+" .rpt-tags-list").eq(0).siblings("p").css("width","288px");
// //		$(rpt2.namespace+" .rpt-tags-num").eq(0).html('(<span>0</span>)').hide();
// //
// 		//第一个推荐
// //		var tipsHtml = "";
// //		for(j=0;j<listItem[0].tips.length;j++){
// //			var tHtml = ufma.htmFormat('<i title="<%=name%>" data-code="<%=code%>" ><%=name%></i>',{
// //							code:listItem[0].tips[j].chrCode,
// //							name:listItem[0].tips[j].chrName
// //						});
// //			tipsHtml += tHtml;
// //		}
// //		$(rpt2.namespace+" .rpt-query-li-tip-c").eq(0).attr({
// //			"id":listItem[0].accItemCode+"Tips",
// //			"data-item":listItem[0].accItemCode
// //		}).html(tipsHtml);
//
// //		if(rpt2.rptType == "GL_RPT_JOURNAL"){
// 			//清空新增的辅助项
// //			$(rpt2.namespace+" .rpt-query-box-bottom .rpt-query-box-li0").remove();
//
// //		}else if(rpt2.rptType == "GL_RPT_COLUMNAR"){
// 			//清空新增的辅助项
// 			$(rpt2.namespace+" .rpt-query-box-bottom .rpt-query-box-li0:gt(0)").remove();
// //		}
//
// 		//明细账是否加载完毕
// 		rpt2.journalLoaded = true;
// 	});
// };

//----------------------科目推荐列表 start-----------------------//
//请求函数——科目推荐列表
// rpt2.reqItemTip=function(eleCode){
// 	var accoArgu = {
// 			"agencyCode":rpt2.nowAgencyCode,
// 			"acctCode":rpt2.nowAcctCode,
// 			"eleCode":eleCode,
// 			"userId":rpt2.nowUserId,
// 			"setYear":rpt2.nowSetYear
// 		};
// 	ufma.ajax(rpt2.portList.tipsList,"get",accoArgu,rpt2.showTipsList);
// };
//回调函数——科目推荐列表
// rpt2.showTipsList=function(result){
// 	//console.info(JSON.stringify(result));
// 	var eleCode = result.data.eleCode;
// 	var list = result.data.tipsData;
// 	var spanHtml = "";
// 	if(list.length>0){
// 		for(var i=0;i<2;i++){
// 			//console.info(JSON.stringify(list[i]));
// 			//console.info(list[i].chrName);
// 			var iHtml = ufma.htmFormat('<i title="<%=name%>" data-code="<%=code%>" ><%=name%></i>',{code:list[i].chrCode,name:list[i].chrName});
// 			spanHtml += iHtml;
// 		}
// 		$("#"+eleCode+"Tips").html(spanHtml);
// 	}
// };
//----------------------科目推荐列表end-------------------------//

//----------------------会计体系列表start-----------------------//
//请求函数——会计体系列表
// rpt2.reqAccaList=function(){
// 	var argu = {
// 			"agencyCode":rpt2.nowAgencyCode,
// 			"acctCode":rpt2.nowAcctCode,
// 			"rgCode":rpt2.rgCode,
// 			"setYear":rpt2.nowSetYear
// 	}
// 	ufma.ajax(rpt2.portList.accaList,"get",argu,rpt2.showAccaList);
// };
//回调函数——会计体系列表
// rpt2.showAccaList=function(result){
// 	var list = result.data;
// 	var divHtml = "";
// 	for(var i=0;i<list.length;i++){
// 		var btn = ufma.htmFormat('<button class="btn btn-default" data-code="<%=code%>"><%=name%></button>',{code:list[i].accaCode,name:list[i].accaName});
// 		divHtml += btn;
// 	}
//
// 	//var divHtml = '<button class="btn btn-default" data-code="1">财务会计</button><button class="btn btn-default" data-code="2">预算会计</button>';
// 	divHtml = '<button class="btn btn-primary" data-code="*">全部</button>' + divHtml;
// 	$("#accaList").html(divHtml);
//
// 	if(list.length == 1){
// 		if(rpt2.rptType == "GL_RPT_VOUSUMMARY"){
// 			$(".accaList-title,#accaList").hide();
// 			$(".rpt-query-date").css("margin-left","-90px");
// 		}else if(
// 			rpt2.rptType == "GL_RPT_JOURNAL" ||
// 			rpt2.rptType == "GL_RPT_BAL" ||
// 			rpt2.rptType == "GL_RPT_LEDGER" ||
// 			rpt2.rptType == "GL_RPT_DAILYJOURNAL" ||
// 			rpt2.rptType == "GL_RPT_COLUMNAR" ||
// 			rpt2.rptType == "GL_RPT_CHRBOOK"
// 		){
// 			$("#accaList").parents("li").hide();
// 		}
// 	}else if(list.length == 2){
// 		if(
// 			rpt2.rptType == "GL_RPT_VOUSUMMARY" ||
// 			rpt2.rptType == "GL_RPT_JOURNAL" ||
// 			rpt2.rptType == "GL_RPT_BAL" ||
// 			rpt2.rptType == "GL_RPT_LEDGER" ||
// 			rpt2.rptType == "GL_RPT_DAILYJOURNAL" ||
// 			rpt2.rptType == "GL_RPT_COLUMNAR" ||
// 			rpt2.rptType == "GL_RPT_CHRBOOK"
// 		){
// 			$("#accaList").parents("li").show();
// 		}
// 	}
// };
//----------------------会计体系列表end-------------------------//

//----------------------查询方案列表 start------------------------//
//请求函数——查询方案列表
// rpt2.reqPrjList=function(){
// 	var prjArgu = {
// 			"agencyCode":rpt2.nowAgencyCode,
// 			"acctCode":rpt2.nowAcctCode,
// 			"rptType":rpt2.rptType,
// 			"userId":rpt2.nowUserId,
// 			"setYear":rpt2.nowSetYear
// 		};
// 	ufma.ajax(rpt2.portList.prjList,"get",prjArgu,rpt2.showPrjList);
// };
//回调函数——查询方案列表
// rpt2.showPrjList=function(result){
// 	var prjList = result.data;
// 	var methodHtml = "";
// 	for(var i=0;i<prjList.length;i++){
// 		var liHtml = ufma.htmFormat('<li><span data-code="<%=code%>" data-scope="<%=scope%>"><%=name%></span><b class="glyphicon icon-close"></b></li>',{
// 					code:prjList[i].prjCode,
// 					name:prjList[i].prjName,
// 					scope:prjList[i].prjScope
// 				});
// 		methodHtml += liHtml;
// 	}
// 	$(".rpt-method-list").html(methodHtml);
//
// 	//判断更多查询方案按钮是否显示
// 	rpt2.moreMethodBtn("rpt-method-list","rpt-method-more");
// };
//----------------------查询方案列表 end-------------------------//

//----------------------共享方案列表 start------------------------//
//请求函数——共享方案列表
// rpt2.reqSharePrjList=function(){
// 	var prjArgu = {
// 			"agencyCode":rpt2.nowAgencyCode,
// 			"acctCode":rpt2.nowAcctCode,
// 			"rptType":rpt2.rptType,
// 			"userId":rpt2.nowUserId,
// 			"setYear":rpt2.nowSetYear
// 		};
// 	ufma.ajax(rpt2.portList.sharePrjList,"get",prjArgu,rpt2.showSharePrjList);
// };
//回调函数——共享方案列表
// rpt2.showSharePrjList=function(result){
// 	var prjList = result.data;
// 	var methodHtml = "";
// 	if(prjList.length>0){
// 		$(".rpt-method-tip").find("i").css("display","inline-block");
// 		for(var i=0;i<prjList.length;i++){
// 			var liHtml = ufma.htmFormat('<li><span title="<%=name%>" data-scope="<%=scope%>"><%=name%></span><button class="btn btn-default" data-code="<%=code%>">使用</button></li>',{
// 						code:prjList[i].prjCode,
// 						name:prjList[i].prjName,
// 						scope:prjList[i].prjScope
// 					});
// 			methodHtml += liHtml;
// 		}
// 		$(".rpt-share-method-box-body ul").html(methodHtml);
// 		$(".rpt-share-method-box-top span").text(prjList.length);
// 	}else{
// 		$(".rpt-method-tip").find("i").css("display","none");
// 	}
// };
//----------------------共享方案列表 end-------------------------//

//----------------------请求查询条件其他选项列表 start---------------//
//请求函数——请求查询条件其他选项列表
// rpt2.reqOptList=function(){
// 	ufma.ajax(rpt2.portList.optList,"get",{"rptType":rpt2.rptType,"userId":rpt2.nowUserId,"setYear":rpt2.nowSetYear},rpt2.showOptList);
// };
//回调函数——请求查询条件其他选项列表
// rpt2.showOptList=function(result){
// 	var optArr = result.data;
// 	if(rpt2.rptType == "GL_RPT_VOUSUMMARY"){
// 		var pzztHtml = "";//凭证状态
// 		var hzfsHtml = "";//汇总方式
// 		for(var i=0;i<optArr.length;i++){
//
// 			var bool = optArr[i].defCompoValue;
// 			var defaultChecked = false;
// 			if(bool == "Y"){
// 				defaultChecked = "checked";
// 			}else if(bool == "N"){
// 				defaultChecked = "";
// 			}
// 			var lab = ufma.htmFormat('<label class="rpt-check mt-checkbox mt-checkbox-outline"><input type="checkbox" <%=flag%> id="<%=id%>" ><%=name%><span></span></label>',{
// 						flag:defaultChecked,
// 						name:optArr[i].optName,
// 						id:optArr[i].optCode
// 					});
//
// 			if(optArr[i].optCode.substring(0,11) == "IS_VOUSTAT_"){
// 				pzztHtml += lab;
// 			}else{
// 				hzfsHtml += lab;
// 			}
// 		}
// 		$(".rpt-pzzt-check").html(pzztHtml);
// 		$(".rpt-hzfs-check").html(hzfsHtml);
//
// 	}else{
// 		var checkHtml = "";
// 		for(var i=0;i<optArr.length;i++){
// 			var bool = optArr[i].defCompoValue;
// 			var defaultChecked = false;
// 			if(bool == "Y"){
// 				defaultChecked = "checked";
// 			}else if(bool == "N"){
// 				defaultChecked = "";
// 			}
// 			var lab = ufma.htmFormat('<label class="mt-checkbox mt-checkbox-outline"><input type="checkbox" <%=flag%> id="<%=id%>" ><%=name%><span></span></label>',{
// 						flag:defaultChecked,
// 						name:optArr[i].optName,
// 						id:optArr[i].optCode
// 					});
// 			checkHtml += lab;
// 		}
// 		$(".rpt-query-li-check").html(checkHtml);
// 	}
// };
//----------------------请求查询条件其他选项列表 end-----------------//

//----------------------请求会计科目树 辅助项目树 start---------------//
//请求函数——请求会计科目树
rpt2.reqAccoTree = function () {
    //会计体系代码
    var accaCode = $("#accaList").find("button.btn-primary").data("code");
    var treeArgu = {};
    if (accaCode == "*") {
        treeArgu = {
            "acctCode": rpt2.nowAcctCode,
            "agencyCode": rpt2.nowAgencyCode,
            "setYear": rpt2.nowSetYear,
            "userId": rpt2.nowUserId,
            "rgCode": rpt2.rgCode
        };
    } else {
        treeArgu = {
            "accaCode": accaCode,
            "acctCode": rpt2.nowAcctCode,
            "agencyCode": rpt2.nowAgencyCode,
            "setYear": rpt2.nowSetYear,
            "userId": rpt2.nowUserId,
            "rgCode": rpt2.rgCode
        };
    }
    ufma.ajax(rpt2.portList.accoTree, "get", treeArgu, rpt2.resCreateTree);
};
//请求函数——辅助项目树
// rpt2.reqAccItemTree=function(accItemType){
// 	//选中会计科目范围
// //	var accoCodeRange = "";
// //	if(rpt2.rptType == "GL_RPT_BAL"){
// //		accoCodeRange = rpt2.checkItemTags("ACCO");
// //	}else if(rpt2.rptType == "GL_RPT_JOURNAL"){
// //		accoCodeRange = "*";
// //	}
//
// 	var treeArgu = {
// //		"accoCodeRange":accoCodeRange,
// 		"eleCode":accItemType,
// 		"acctCode":rpt2.nowAcctCode,
// 		"agencyCode":rpt2.nowAgencyCode,
// 		"setYear":rpt2.nowSetYear,
// 		"userId":rpt2.nowUserId
// 	};
// 	ufma.ajax(rpt2.portList.accItemTree,"get",treeArgu,rpt2.resCreateTree2);
// };
//回调函数——创建返回树
// rpt2.resCreateTree=function(result){
// 	var zNodes = result.data.treeData;
// 	var treeId = result.data.treeId+"-data";
// 	rpt2.selectTree(treeId,zNodes);
//
// 	$("#"+treeId).parent("div.rpt-tree-data").show();
// 	$("#"+treeId+"-key").focus();
//
// 	var zNodesStr = JSON.stringify(zNodes);
// 	var treeKey=ufma.sessionKey(rpt2.module,rpt2.compoCode,rpt2.rgCode,rpt2.nowSetYear,rpt2.nowAgencyCode,rpt2.nowAcctCode,rpt2.namespace+result.data.treeId);
// 	sessionStorage.setItem(treeKey,zNodesStr);
// 	rpt2.sessionKeyArr.push(treeKey);
//
// };
//回调函数——创建返回树
// rpt2.resCreateTree2=function(result){
// 	var zNodes = result.data;
// 	if(zNodes.length>0){
// 		var treeId = result.data[0].eleCode+"-data";
// 		console.info(treeId);
// 		rpt2.selectTree(treeId,zNodes);
//
// 		$("#"+treeId).parent("div.rpt-tree-data").show();
// 		$("#"+treeId+"-key").focus();
//
// 		var zNodesStr = JSON.stringify(zNodes);
// 		var treeKey=ufma.sessionKey(rpt2.module,rpt2.compoCode,rpt2.rgCode,rpt2.nowSetYear,rpt2.nowAgencyCode,rpt2.nowAcctCode,rpt2.namespace+result.data.treeId);
// 		sessionStorage.setItem(treeKey,zNodesStr);
// 		rpt2.sessionKeyArr.push(treeKey);
// 	}else{
// 		ufma.showTip("辅助项没有数据！",function(){},"warning");
// 	}
// };
//----------------------请求会计科目树 辅助项目树 end-----------------//

//----------------------保存方案 start--------------------------//
//请求函数——请求保存方案
// rpt2.reqSavePrj=function(){
// 	var savePrjArgu={};
//
// 	savePrjArgu.acctCode = rpt2.nowAcctCode;//账套代码
// 	savePrjArgu.agencyCode = rpt2.nowAgencyCode;//单位代码
//
// 	savePrjArgu.prjCode = $("#methodName").data("code");//方案代码
// 	savePrjArgu.prjName = $("#methodName").val();//方案名称
// 	savePrjArgu.prjScope = $('input:radio[name="prjScope"]:checked').val()//方案作用域
// 	savePrjArgu.rptType = $(".rptType").val();//账表类型
// 	savePrjArgu.setYear = rpt2.nowSetYear;//业务年度
// 	savePrjArgu.userId = rpt2.nowUserId;//用户Id
//
// 	//方案内容
// 	//savePrjArgu.prjContent = JSON.stringify(rpt2.prjContObj());
// 	savePrjArgu.prjContent = rpt2.prjContObj();
//
// 	console.info(JSON.stringify(savePrjArgu));
// 	ufma.ajax(rpt2.portList.savePrj,"post",savePrjArgu,rpt2.resSavePrj);
// };
//回调函数——请求保存方案
// rpt2.resSavePrj=function(result){
// 	var flag = result.flag;
// 	var prjCode = result.data.prjCode;
// 	var prjScope = result.data.prjScope;
// 	if(flag == "success"){
// 		var meLi = $(".rpt-method-list li.isUsed");
// 		if($(meLi).length>0){
// 			var name = $(meLi).find("span").text($("#methodName").val().trim());
// 		}else{
// 			var newMethod = '<li><span data-code="'+prjCode+'" data-scope="'+prjScope+'">'+$("#methodName").val().trim()+'</span><b class="glyphicon icon-close"></b></li>';
// 			$('.rpt-method-list').append($(newMethod));
// 		}
//
// 		rpt2.setQuery.close();
// 		rpt2.moreMethodBtn("rpt-method-list","rpt-method-more");
// 		ufma.showTip("查询方案保存成功！",function(){},"success");
// 	}else{
// 		ufma.alert(result.msg,"error");
// 		return false;
// 	}
// };
//----------------------保存方案 end----------------------------//

//----------------------请求方案内容（不包含余额表） start-----------------------//
//请求函数——请求方案内容
// rpt2.reqPrjCont=function(prjCode){
// 	var prjContArgu = {
// 		"acctCode":rpt2.nowAcctCode,
// 		"agencyCode":rpt2.nowAgencyCode,
// 		"prjCode":prjCode,
// 		"rptType":rpt2.rptType,
// 		"setYear":rpt2.nowSetYear,
// 		"userId":rpt2.nowUserId
// 	};
// 	ufma.ajax(rpt2.portList.prjContent,"get",prjContArgu,rpt2.showPrjCont);
// };

rpt2.firstTxt = "";
rpt2.ACCOtext = "";
//回调函数——展示查询方案内容
// rpt2.showPrjCont=function(result){
// 	if(rpt2.sessionKeyArr.length>0){
// 		for(var i=0;i<rpt2.sessionKeyArr.length;i++){
// 			sessionStorage.removeItem(rpt2.sessionKeyArr[i]);
// 		}
// 	}
//
// 	//方案内容对象
// 	var cont = eval('('+result.data.prjContent+')');
// 	//var cont = result.data.prjContent;
// 	console.info(JSON.stringify(cont));
//
// 	//会计体系
// 	var accaCode = cont.accaCode;
// 	if(accaCode == "*"){
// 		accaCode = 0;
// 	}
// 	$("#accaList").find("button").removeClass("btn-primary").addClass("btn-default");
// 	$("#accaList").find("button").eq(accaCode).removeClass("btn-default").addClass("btn-primary");
//
// 	//期间**************start
// 	//明细账、日记账、凭证汇总表
// 	if(rpt2.rptType == "GL_RPT_JOURNAL" || rpt2.rptType == "GL_RPT_DAILYJOURNAL" || rpt2.rptType == "GL_RPT_VOUSUMMARY" || rpt2.rptType == "GL_RPT_COLUMNAR"){
// 		var startDate = cont.startDate;//开始日期
// 		var endDate = cont.endDate;//截至日期
// 		$("#dateStart").datetimepicker('setDate',(new Date(startDate)));
// 		$("#dateEnd").datetimepicker('setDate',(new Date(endDate)));
// 	}
// 	//总账
// 	else if(rpt2.rptType == "GL_RPT_LEDGER"){
// 		var startYear = cont.startYear;//起始年度
// 		var startFisperd = cont.startFisperd;//起始月份
// 		var endYear = cont.endYear;//结束年度
// 		var endFisperd = cont.endFisperd;//结束月份
// 		$("#dateStart").datetimepicker('setDate',(new Date(startYear,startFisperd-1)));
// 		$("#dateEnd").datetimepicker('setDate',(new Date(endYear,endFisperd-1)));
// 	}
// 	else{
// 		console.info("不是余额表、明细账、总账、日记账、凭证汇总表、多栏账,查看是否需要做细化处理！");
// 	}
// 	//期间**************end
//
// 	//辅助核算项目**************start
// 	//明细账
// 	if(rpt2.rptType == "GL_RPT_JOURNAL"){
// 		//辅助核算项目
// 		var qryItems = cont.qryItems;
// 		if(qryItems.length>0){
// 			//第一条辅助核算项
// 			var items1 = qryItems[0];
// 			var items1Code = qryItems[0].itemType;
// 			$("#selectTitle").val(items1Code);
// 			$("#selectTitle").attr({
// 				"data-seq":qryItems[0].seq,
// 				"data-pos":qryItems[0].itemPos,
// 				"data-dir":qryItems[0].itemDir
// 			});
// 			rpt2.changeFirstItem(items1Code);
// 			//填入选中标签
// 			if(qryItems[0].items.length>0){
// 				var tagHtml = "";
// 				for(var j=0;j<qryItems[0].items.length;j++){
// 					var th = ufma.htmFormat('<li><span data-code="<%=tagCode%>" title="<%=tagName%>"><%=tagName%></span><b class="glyphicon icon-close"></b></li>',{
// 								tagCode:qryItems[0].items[j].code,
// 								tagName:qryItems[0].items[j].name
// 							});
//
// 					tagHtml += th;
// 				}
// 				//console.info(tagHtml);
// 				$(rpt2.namespace+" .rpt-li-over").before($(tagHtml));
// 				$(rpt2.namespace+" .rpt-tags-num").eq(0).find("span").text(qryItems[0].items.length);
// 			}
//
// 			if(qryItems.length>1){
// 				//剩下的辅助核算项
// 				var moreItems = [];
// 				for(var i=1;i<qryItems.length;i++){
// 					moreItems.push(qryItems[i]);
// 				}
// 				var moreHtml = rpt2.queryInputHtml(moreItems);
// 				//展示方案中的辅助项
// 				$(rpt2.namespace+" .rpt-query-li-check").parents("li.rpt-query-box-li").before($(moreHtml));
//
// 				//请求每个辅助项的推荐项
// 				for(var i=1;i<qryItems.length;i++){
// 					rpt2.reqItemTip(qryItems[i].itemType);
// 				}
// 			}
//
// 		}
// 	}
// 	//总账、日记账
// 	else if(rpt2.rptType == "GL_RPT_LEDGER" || rpt2.rptType == "GL_RPT_DAILYJOURNAL"){
//
// 		//辅助核算项目
// 		var qryItems = cont.qryItems;
// 		var ulTop = $(".rpt-query-box-bottom");
// 		$(ulTop).find("li").eq(1).remove();
// 		var topArr = [];
// 		topArr.push(qryItems[0]);
// 		var ulTopHtml = rpt2.queryInputHtml(topArr);
// 		$(ulTop).find("li:last-child").before($(ulTopHtml));
//
// 		//请求对应的推荐
// 		for(var i=0;i<qryItems.length;i++){
// 			rpt2.reqItemTip(qryItems[0].itemType);
// 		}
//
// 	}
// 	//凭证汇总表
// 	else if(rpt2.rptType == "GL_RPT_VOUSUMMARY"){
// 		//凭证汇总表不需要此内容
// 	}
// 	//多栏账
// 	else if(rpt2.rptType == "GL_RPT_COLUMNAR"){
// 		//console.info("请处理多栏账方案展示");
// 		//辅助核算项目
// 		var qryItems = cont.qryItems;
// 		if(qryItems.length>0){
// 			//第一条辅助核算项
// 			var items1 = qryItems[0];
// 			var items1Code = qryItems[0].itemType;
// 			$("#selectTitle").val(items1Code);
// 			$("#selectTitle").attr({
// 				"data-seq":qryItems[0].seq,
// 				"data-pos":qryItems[0].itemPos,
// 				"data-dir":qryItems[0].itemDir
// 			});
// 			rpt2.changeFirstItem(items1Code);
//
// 			//借贷方向
// 			var btn = $(rpt2.namespace).find(".rpt-query-li-tip .rpt-btn-switch button");
// 			if(qryItems[0].itemDir == "dr"){
// 				//借方
// 				$(btn).eq(0).addClass("btn-primary").removeClass("btn-default");
// 				$(btn).eq(1).addClass("btn-default").removeClass("btn-primary");
// 			}else if(qryItems[0].itemDir == "cr"){
// 				//贷方
// 				$(btn).eq(1).addClass("btn-primary").removeClass("btn-default");
// 				$(btn).eq(0).addClass("btn-default").removeClass("btn-primary");
// 			}
//
// 			//填入选中标签
// 			if(qryItems[0].items.length>0){
// 				var tagHtml = "";
// 				for(var j=0;j<qryItems[0].items.length;j++){
// 					var th = ufma.htmFormat('<li><span data-code="<%=tagCode%>" title="<%=tagName%>"><%=tagName%></span><b class="glyphicon icon-close"></b></li>',{
// 								tagCode:qryItems[0].items[j].code,
// 								tagName:qryItems[0].items[j].name
// 							});
//
// 					tagHtml += th;
// 				}
// 				//console.info(tagHtml);
// 				$(rpt2.namespace+" .rpt-li-over").before($(tagHtml));
// 				$(rpt2.namespace+" .rpt-tags-num").eq(0).find("span").text(qryItems[0].items.length);
// 			}
//
// 			if(qryItems.length>1){
// 				//剩下的辅助核算项
// 				var moreItems = [];
// 				for(var i=1;i<qryItems.length;i++){
// 					moreItems.push(qryItems[i]);
// 				}
// 				var moreHtml = rpt2.queryCondHtml(moreItems,1);
// 				//展示方案中的辅助项
// 				$(rpt2.namespace+" .rpt-query-li-check").parents("li.rpt-query-box-li").before($(moreHtml));
//
// 			}
//
// 		}
// 	}
// 	//其他
// 	else{
// 		console.info("不是余额表、明细账、总账、日记账、凭证汇总表、多栏账,查看是否需要做细化处理！");
// 	}
//
// 	if(rpt2.rptType != "GL_RPT_VOUSUMMARY"){
// 		//显示选中的标签
// 		$("ul.rpt-tags-list").each(function(){
// 			var ulDom = this;
// 			var numDom = $(ulDom).siblings("div.rpt-tags-num").find("span");
// 			rpt2.selectTip(ulDom,numDom);
// 		});
// 	}
// 	//辅助核算项目****************end
//
// 	//查询条件对象（凭证汇总表）
// 	if(rpt2.rptType == "GL_RPT_VOUSUMMARY"){
// 		rptCondItem = cont.rptCondItem;
// 		for(var i=0;i<rptCondItem.length;i++){
// 			var condCode = rptCondItem[i].condCode;
// 			var condValue = rptCondItem[i].condValue;
// 			if(condCode == "vouType"){//凭证字号
// 				$(rpt2.namespace+" #rpt-pzzh-select").val(condValue);
// 			}else if(condCode == "vouTypeFrom"){//凭证编号起
// 				$(rpt2.namespace+" #rpt-pzzh-input-form").val(condValue);
// 			}else if(condCode == "vouTypeTo"){//凭证编号止
// 				$(rpt2.namespace+" #rpt-pzzh-input-to").val(condValue);
// 			}else if(condCode == "vouSource"){//凭证来源
// 				$(rpt2.namespace+" #rpt-pzly-select").val(condValue);
// 			}else if(condCode == "accoSumLevel"){//凭证汇总
// 				$(rpt2.namespace+" #rpt-hzfs-select").val(condValue);
// 			}
// 		}
// 	}
//
// 	//其他
// 	var rptOption = {"data":cont.rptOption};
// 	rpt2.showOptList(rptOption);
//
// 	//表格名称
// 	rptTitleName = cont.rptTitleName;
// 	$(".rpt-table-title-show span").text(rptTitleName);
//
// 	//表格类型
// 	if(rpt2.rptType == "GL_RPT_JOURNAL"){
// 		rptStyle = cont.rptStyle;//账表样式
// 		var rptStyleName = "";
// 		if(rptStyle == "SANLAN"){
// 			rptStyleName = "三栏式";
// 		}else if(rptStyle == "WAIBI"){
// 			rptStyleName = "外币式";
//
// 			curCode = cont.curCode;//币种代码
// 			//请求币种名称
// 			//ufma.ajax(rpt2.portList.)
//
// 		}else if(rptStyle == "SHULIANG"){
// 			rptStyleName = "数量金额式";
// 		}else{
// 			rptStyleName = "尚未定义";
// 		}
// 		$(rpt2.namespace+" .change-rpt-type i").text(rptStyleName).attr("data-type",rptStyle);
//
// 	}
//
// 	//展开更多查询
// 	$('.rpt-tip-more').find("i").text("收起");
// 	$('.rpt-tip-more').find("span").removeClass("icon-angle-bottom").addClass("icon-angle-top");
// 	$(".rpt-query-box-bottom").slideDown();
//
//
// 	//用于前台判断请求科目辅助项的判断条件
// 	if(rpt2.rptType == "GL_RPT_JOURNAL" || rpt2.rptType == "GL_RPT_COLUMNAR"){
// 		$("#addQueryInput,#bottomACCO").attr("data-isleave",false).attr("data-isrun",false);
//
// 		var nowTxt = "";
// 		var tagsDom1 = $("#addQueryInput").find(".rpt-tags-list li");
// 		for(var i=0;i<$(tagsDom1).length-1;i++){
// 			nowTxt += $(tagsDom1).eq(i).find("span").attr("title");
// 		}
// 		rpt2.firstTxt = nowTxt;
//
// 		var nowACCOtext = "";
// 		var tagsDom2 = $("#bottomACCO").find(".rpt-tags-list li");
// 		for(var i=0;i<$(tagsDom2).length-1;i++){
// 			nowACCOtext += $(tagsDom2).eq(i).find("span").attr("title");
// 		}
// 		rpt2.ACCOtext = nowACCOtext;
// 	}
// 	return false;
// };
//----------------------请求方案内容 end-------------------------//


/**账表页面的相关绑定操作**********************************************************************/
//按钮提示
// rpt2.tooltip = function(){
// 	$("[data-toggle='tooltip']").tooltip();
// };

//查询条件框--展开更多查询
rpt2.queryBoxMore = function () {
    $(rpt2.namespace).find('.rpt-tip-more').on('click', function () {
        if ($(this).find("i").text() == "更多") {
            $(this).find("i").text("收起");
            $(this).find("span").removeClass("icon-angle-bottom").addClass("icon-angle-top");
            $(".rpt-query-box-bottom").slideDown();
            if (rpt2.rptType == "GL_RPT_CHRBOOK") {
                $(rpt2.namespace).find(".rpt-chr-setting").show();
            }
        } else {
            $(this).find("i").text("更多");
            $(this).find("span").removeClass("icon-angle-top").addClass("icon-angle-bottom");
            $(".rpt-query-box-bottom").slideUp();
            if (rpt2.rptType == "GL_RPT_CHRBOOK") {
                $(rpt2.namespace).find(".rpt-chr-setting").hide();
            }
        }
    });
};

//编辑表格名称
// rpt2.editTableTitle = function(){
// 	$(rpt2.namespace).find(".rpt-table-title-show").on("mouseenter",function(){
// 		$("#show-edit").show();
// 	}).on("mouseleave",function(){
// 		$("#show-edit").hide();
// 	}).on("click",function(){
// 		$(this).hide();
// 		$(".rpt-table-title-edit").show().find("input").focus().val($(this).find("span").text());
// 	});
// 	$(rpt2.namespace).find(".rpt-table-title-edit").on("focus","input",function(){
// 		$(".rpt-table-title-show").hide();
// 		$(this).keydown(function(e){
// 			var name = $(this).val();
// 			if(name != "" && e.keyCode==13){
// 				$("#show-edit,.rpt-table-title-edit").hide();
// 				$(".rpt-table-title-show").find("span").text(name);
// 				$(".rpt-table-title-show").show();
// 				$("#show-edit").hide();
// 			}
// 		});
//
// 	}).on("blur","input",function(){
// 		var name = $(this).val();
// 		if(name != ""){
// 			$("#show-edit,.rpt-table-title-edit").hide();
// 			$(".rpt-table-title-show").find("span").text(name);
// 			$(".rpt-table-title-show").show();
// 		}else{
// 			ufma.alert("表格名称不能为空！","warning");
// 			return false;
// 		}
// 	});
// };

//改变金额单位（需要一直保留两位小数点，借贷还必须平衡，暂时不实现）
// rpt2.changeMonetaryUnit = function(){
// //	$(rpt2.namespace).find(".rpt-table-sub-tip2").on("click","i",function(){
// //		$(this).hide();
// //		$(this).siblings("select").show();
// //	});
// //	$(rpt2.namespace).find(".rpt-table-sub-tip2").on("change","select",function(){
// //
// //		if($(this).val() == "万元" && !$(".tdNum").hasClass("wanyuan")){
// //			$("td.tdNum").each(function(){
// //				if($(this).text() != ""){
// //					var num = $(this).text().replace(/\,/g, "");
// //					$(this).text(rpt2.comdify(parseFloat(num/10000).toFixed(6)));
// //				}
// //				$(this).addClass("wanyuan");
// //			})
// //		}else if($(this).val() == "元" && $(".tdNum").hasClass("wanyuan")){
// //			$("td.tdNum").each(function(){
// //				if($(this).text() != ""){
// //					var num = $(this).text().replace(/\,/g, "");
// //					$(this).text(rpt2.comdify(parseFloat(num*10000).toFixed(2)));
// //				}
// //				$(this).removeClass("wanyuan");
// //			})
// //		}
// //
// //		$(this).hide();
// //		$(this).siblings("i").text($(this).val()).show();
// //	});
// };

//搜索隐藏显示
// rpt2.searchHideShow = function(selector){
// 	//搜索隐藏显示
// //	$("#searchHideBtn").hover(function(){
// //		$(".searchHide").animate({"width":"160px"}).focus().removeClass("focusOff");
// //	},function(){
// //		if($(".searchHide").hasClass("focusOff")){
// //			$(".searchHide").animate({"width":"0px"});
// //		}
// //	});
// //	$(".searchHide").focus(function(){
// //		$(this).css({"width":"160px"}).removeClass("focusOff");
// //	}).blur(function(){
// //		$(this).animate({"width":"0px"}).addClass("focusOff");
// //	});
// 	var searchKey=ufma.sessionKey(rpt2.module,rpt2.compoCode,rpt2.rgCode,rpt2.nowSetYear,rpt2.nowAgencyCode,rpt2.nowAcctCode,rpt2.namespace+"_searchKey");
//
// 	$(".searchHide").focus(function(){
// 		$(this).keydown(function(e){
// 			var val = $(this).val();
// 			if(e.keyCode==13){
// 				$(selector).DataTable().search(val).draw();
// 				sessionStorage.removeItem(searchKey);
// 			}
// 		});
// 	});
// 	$("#searchHideBtn").on("click",function(evt){
// 		evt.stopPropagation();
// 		if($(".searchHide").hasClass("focusOff")){
// 			var newVal = sessionStorage.getItem(searchKey);
// 			if(newVal != ""){
// 				$(".searchHide").val(newVal);
// 			}
// 			$(".searchHide").show().animate({"width":"160px"}).focus().removeClass("focusOff");
// 		}else{
// 			sessionStorage.removeItem(searchKey);
//
// 			var val = $(this).siblings("input[type='text']").val();
// 			$(selector).DataTable().search(val).draw();
//
// 			sessionStorage.setItem(searchKey,val);
// 			rpt2.sessionKeyArr.push(searchKey);
// 		}
// 	});
// 	$(".iframeBtnsSearch").on("mouseleave",function(){
// 		if(!$(".searchHide").hasClass("focusOff") && $(".searchHide").val() == ""){
// 			$(".searchHide").animate({"width":"0px"},"","",function(){
// 				$(".searchHide").css("display","none");
// 			}).addClass("focusOff");
// 		}
// 	});
// };

//模糊单项选择
// rpt2.oneSearch = function(selector){
// 	$("input").on("focus,click",function(evt){
// 		evt.stopPropagation();
// 	});
//
// 	//$(rpt2.namespace).find(".rpt-table-tab").on("click",".rpt-oneSearch",function(){
// 	$(".rpt-oneSearch").on("click",function(){
// 		var i = $(this).siblings("input").eq(0).attr("col-index");
//
// 		var type = $(".change-rpt-type select").val();
// 		var oneKey=ufma.sessionKey(rpt2.module,rpt2.compoCode,rpt2.rgCode,rpt2.nowSetYear,rpt2.nowAgencyCode,rpt2.nowAcctCode,rpt2.namespace+"_"+type+"_"+i+"_oneKey");
// 		sessionStorage.removeItem(oneKey);
//
// 		var columns = $(selector).DataTable().columns(i);
// 		var val = $.fn.dataTable.util.escapeRegex($(this).siblings("input").val());
// 		columns.search(val, false, false).draw();
// 		if(val != ""){
// 			$(this).parents("th").find("span.thTitle").css("color","#108EE9");
// 			$(this).parents("th").find("span.rpt-funnelBtn").css("color","#108EE9");
// 		}else{
// 			$(this).parents("th").find("span.thTitle").css("color","");
// 			$(this).parents("th").find("span.rpt-funnelBtn").css("color","");
// 		}
// 		$(this).parent(".rpt-funnelBox").hide();
//
// 		sessionStorage.setItem(oneKey,val);
// 		rpt2.sessionKeyArr.push(oneKey);
// 	})
//
// 	$(rpt2.namespace+" .rpt-funnelCont .rpt-txtCont").eq(0).on("focus",function(){
// 		$(this).keydown(function(e){
// 			var val = $(this).val();
// 			if(e.keyCode==13){
// 				//$(".rpt-oneSearch").trigger("click");
//
// 				var i = $(this).attr("col-index");
//
// 				var type = $(".change-rpt-type select").val();
// 				var oneKey=ufma.sessionKey(rpt2.module,rpt2.compoCode,rpt2.rgCode,rpt2.nowSetYear,rpt2.nowAgencyCode,rpt2.nowAcctCode,rpt2.namespace+"_"+type+"_"+i+"_oneKey");
// 				sessionStorage.removeItem(oneKey);
//
// 				var columns = $(selector).DataTable().columns(i);
// 				var val = $.fn.dataTable.util.escapeRegex($(this).val());
// 				columns.search(val, false, false).draw();
// 				if(val != ""){
// 					$(this).parents("th").find("span.thTitle").css("color","#108EE9");
// 					$(this).parents("th").find("span.rpt-funnelBtn").css("color","#108EE9");
// 				}else{
// 					$(this).parents("th").find("span.thTitle").css("color","");
// 					$(this).parents("th").find("span.rpt-funnelBtn").css("color","");
// 				}
// 				$(this).parent(".rpt-funnelBox").hide();
//
// 				sessionStorage.setItem(oneKey,val);
// 				rpt2.sessionKeyArr.push(oneKey);
// 			}
// 		});
// 	});
// };

//单列范围筛选
// rpt2.twoSearch = function(selector){
// 	$("input").on("focus,click",function(evt){
// 		evt.stopPropagation();
// 	});
// 	$(rpt2.namespace+" .rpt-numCont").on("keyup",function(){
// 		$(this).val($(this).val().replace(/[^\d\.\-]/g,''));
// 	});
// 	$(rpt2.namespace+" .rpt-numCont").on("blur",function(){
// 		var num = $(this).val().replace(/\,/g, "");
// 		if(num !=""){
// 			var ret1 = /^-?([1-9]\d*\.\d*|0\.\d*[1-9]\d*|0?\.0+|0)$/;
// 			var ret2 = /^-?[1-9]\d*$/;
// 	      	if(ret1.test(num) || ret2.test(num)){
// 				$(this).val(rpt2.comdify(parseFloat(num).toFixed(2)));
// 			}else{
// 				ufma.alert("请输入合法的数字！","error");
// 				return false;
// 			}
// 		}
// 	});
//
// 	$(".rpt-twoSearch").on("click",function(){
// 		var i = $(this).siblings("input").eq(0).attr("col-index");
//
// 		var type = $(".change-rpt-type select").val();
// 		var twoKey1=ufma.sessionKey(rpt2.module,rpt2.compoCode,rpt2.rgCode,rpt2.nowSetYear,rpt2.nowAgencyCode,rpt2.nowAcctCode,rpt2.namespace+"_"+type+"_"+i+"_twoKey1");
// 		var twoKey2=ufma.sessionKey(rpt2.module,rpt2.compoCode,rpt2.rgCode,rpt2.nowSetYear,rpt2.nowAgencyCode,rpt2.nowAcctCode,rpt2.namespace+"_"+type+"_"+i+"_twoKey2");
// 		sessionStorage.removeItem(twoKey1);
// 		sessionStorage.removeItem(twoKey2);
//
// 		var val1 = $.fn.dataTable.util.escapeRegex($(this).siblings("input").eq(0).val());
// 		var val2 = $.fn.dataTable.util.escapeRegex($(this).siblings("input").eq(1).val());
// 		var columns = $(selector).DataTable().columns(i);
// 		var numVal1 = "";
// 		var numVal2 = "";
//
// 		if(val1 == "" && val2 != ""){
// 			numVal1 = -Number.MAX_VALUE;
// 			numVal2 = val2.replace(/\,/g, "");
// 		}else if(val2 == "" && val1 != ""){
// 			numVal1 = val1.replace(/\,/g, "");
// 			numVal2 = Number.MAX_VALUE;
// 		}else if(val1 != "" && val2 != ""){
// 			numVal1 = val1.replace(/\,/g, "");
// 			numVal2 = val2.replace(/\,/g, "");
// 		}
//
// 		if(val1 != "" || val2 != ""){
// 			if(val1 == ""){
// 				val1 = -Number.MAX_VALUE;
// 			}else if(val2 == ""){
// 				val2 = Number.MAX_VALUE;
// 			}
// 			$.fn.dataTable.ext.search.push(
// 				function( settings, data, dataIndex ) {
// 					var colIndex  =  data.length + parseInt(i);
// 					var min = parseFloat( val1, 10 );
// 					var max = parseFloat( val2, 10 );
// 					var col = parseFloat( data[colIndex],10 ) || 0;
// 					console.info("min="+min+"---max="+max+"---col="+col);
// 					if ( ( isNaN( min ) && isNaN( max ) ) ||
// 						 ( isNaN( min ) && col <= max ) ||
// 						 ( min <= col   && isNaN( max ) ) ||
// 						 ( min <= col   && col <= max ) )
// 					{
// 						return true;
// 					}
// 					return false;
// 				}
// 			);
// 			$(this).parents("th").find("span.thTitle").css("color","#108EE9");
// 			$(this).parents("th").find("span.rpt-funnelBtn").css("color","#108EE9");
// 		}else{
// 			$.fn.dataTable.ext.search.pop();
// 			$(this).parents("th").find("span.thTitle").css("color","");
// 			$(this).parents("th").find("span.rpt-funnelBtn").css("color","");
// 		}
// 		$(selector).DataTable().draw();
// 		$(this).parent(".rpt-funnelBox").hide();
//
// 		sessionStorage.setItem(twoKey1,numVal1);
// 		sessionStorage.setItem(twoKey2,numVal2);
// 		rpt2.sessionKeyArr.push(twoKey1);
// 		rpt2.sessionKeyArr.push(twoKey2);
// 	})
//
// 	$(rpt2.namespace+" .rpt-funnelCont .rpt-numCont").eq(1).on("focus",function(){
// 		$(this).keydown(function(e){
// 			var val = $(this).val();
// 			if(e.keyCode==13){
// 				//$(".rpt-twoSearch").trigger("click");
//
// 				var i = $(this).siblings("input").attr("col-index");
//
// 				var type = $(".change-rpt-type select").val();
// 				var twoKey1=ufma.sessionKey(rpt2.module,rpt2.compoCode,rpt2.rgCode,rpt2.nowSetYear,rpt2.nowAgencyCode,rpt2.nowAcctCode,rpt2.namespace+"_"+type+"_"+i+"_twoKey1");
// 				var twoKey2=ufma.sessionKey(rpt2.module,rpt2.compoCode,rpt2.rgCode,rpt2.nowSetYear,rpt2.nowAgencyCode,rpt2.nowAcctCode,rpt2.namespace+"_"+type+"_"+i+"_twoKey2");
// 				sessionStorage.removeItem(twoKey1);
// 				sessionStorage.removeItem(twoKey2);
//
// 				var val1 = $.fn.dataTable.util.escapeRegex($(this).siblings("input").val());
// 				var val2 = $.fn.dataTable.util.escapeRegex($(this).val());
// 				var columns = $(selector).DataTable().columns(i);
// 				var numVal1 = "";
// 				var numVal2 = "";
//
// 				if(val1 == "" && val2 != ""){
// 					numVal1 = -Number.MAX_VALUE;
// 					numVal2 = val2.replace(/\,/g, "");
// 				}else if(val2 == "" && val1 != ""){
// 					numVal1 = val1.replace(/\,/g, "");
// 					numVal2 = Number.MAX_VALUE;
// 				}else if(val1 != "" && val2 != ""){
// 					numVal1 = val1.replace(/\,/g, "");
// 					numVal2 = val2.replace(/\,/g, "");
// 				}
// 				if(val1 != "" || val2 != ""){
// 					if(val1 == ""){
// 						val1 = -Number.MAX_VALUE;
// 					}else if(val2 == ""){
// 						val2 = Number.MAX_VALUE;
// 					}
// 					$.fn.dataTable.ext.search.push(
// 						function( settings, data, dataIndex ) {
// 							var colIndex  =  data.length + parseInt(i);
// 							var min = parseFloat( val1, 10 );
// 							var max = parseFloat( val2, 10 );
// 							var col = parseFloat( data[colIndex],10 ) || 0;
// 							if ( ( isNaN( min ) && isNaN( max ) ) ||
// 								 ( isNaN( min ) && col <= max ) ||
// 								 ( min <= col   && isNaN( max ) ) ||
// 								 ( min <= col   && col <= max ) )
// 							{
// 								return true;
// 							}
// 							return false;
// 						}
// 					);
// 					$(this).parents("th").find("span.thTitle").css("color","#108EE9");
// 					$(this).parents("th").find("span.rpt-funnelBtn").css("color","#108EE9");
// 				}else{
// 					$.fn.dataTable.ext.search.pop();
// 					$(this).parents("th").find("span.thTitle").css("color","");
// 					$(this).parents("th").find("span.rpt-funnelBtn").css("color","");
// 				}
// 				$(selector).DataTable().draw();
// 				$(this).parent(".rpt-funnelBox").hide();
//
//
// 				sessionStorage.setItem(twoKey1,numVal1);
// 				sessionStorage.setItem(twoKey2,numVal2);
// 				rpt2.sessionKeyArr.push(twoKey1);
// 				rpt2.sessionKeyArr.push(twoKey2);
// 			}
// 		});
// 	});
// };

//清空会计科目标签，销毁树(总账、日记账)
// rpt2.clearTagsTree=function(){
// 	//销毁所有树
// //	$(rpt2.namespace+" .ztree:not(#cbAgency_tree)").each(function(){
// //		var zId = $(this).attr("id");
// //		$.fn.zTree.destroy(zId);
// //	});
// 	$(rpt2.namespace+" .rpt-tags-list").eq(0).html('<li class="rpt-li-over" style="display:none;">...</li>').css("width","0");
// 	$(rpt2.namespace+" .rpt-tags-list").eq(0).siblings("p").css("width","288px");
// 	$(rpt2.namespace+" .rpt-tags-num").eq(0).html('(<span>0</span>)').hide();
//
// 	//请求会计科目推荐
// 	rpt2.reqItemTip("ACCO");
// };

//会计科目树入参改变，还原查询条件框
// rpt2.backQuery=function(){
// 	var eleCode = $("#ACCO").data("code");//会计科目代码
// 	var accoArgu = {
// 			"agencyCode":rpt2.nowAgencyCode,
// 			"acctCode":rpt2.nowAcctCode,
// 			"eleCode":eleCode,
// 			"userId":rpt2.nowUserId,
// 			"setYear":rpt2.nowSetYear
// 		};
// 	ufma.ajax(rpt2.portList.tipsList,"get",accoArgu,rpt2.resBackQuery);
//
// 	//销毁所有树
// //	$(".ztree").each(function(){
// //		var zId = $(this).attr("id");
// //		$.fn.zTree.destroy(zId);
// //	});
// //	$(".rpt-query-box-li0").remove();
// //	$(".rpt-query-box-top").append($(page.ACCOdom));
// },

//回调函数——还原查询条件框
// rpt2.resBackQuery=function(result){
// 	//销毁所有树
// //	$(".ztree:not(#cbAgency_tree)").each(function(){
// //		var zId = $(this).attr("id");
// //		$.fn.zTree.destroy(zId);
// //	});
//
// 	var list = result.data.tipsData;
// 	var spanHtml = "";//会计体系推荐
// 	for(var i=0;i<list.length;i++){
// 		var iHtml = ufma.htmFormat('<i title="<%=name%>" data-code="<%=code%>" ><%=name%></i>',{code:list[i].chrCode,name:list[i].chrName});
// 		spanHtml += iHtml;
// 	}
//
// 	//会计科目li标签
// 	var accoHtml = '<li class="rpt-query-box-li rpt-query-box-li0">'+
// 					'<label class="rpt-query-li-cont-title"><span title="会计科目" data-code="ACCO" id="ACCO">会计科目</span>：</label>'+
// 					'<div class="rpt-query-li-cont">'+
// 						'<div class="rpt-query-li-selete">'+
// 							'<div class="rpt-tree-view bordered-input">'+
// 								'<ul class="rpt-tags-list">'+
// 									'<li class="rpt-li-over" style="display:none;">...</li>'+
// 								'</ul>'+
// 								'<p class="rpt-p-search-key">'+
// 									'<input type="text" id="ACCO-data-key">'+
// 								'</p>'+
// 								'<div class="rpt-tags-num" style="display:none;">(<span>0</span>)</div>'+
// 							'</div>'+
// 							'<div class="rpt-tree-data bordered-input" style="display:none;">'+
// 								'<ul id="ACCO-data" class="ufmaTree ztree"></ul>'+
// 							'</div>'+
// 						'</div>'+
// 						'<div class="rpt-query-li-tip">'+
// 							'<span class="rpt-query-li-tip-t">推荐：</span>'+
// 							'<span class="rpt-query-li-tip-c" id="ACCOTips">'+
// 								spanHtml+
// 							'</span>'+
// 						'</div>'+
// 					'</div>'+
// 				'</li>';
// 	// $(".rpt-query-box-li0").remove();
//
// 	//$(".rpt-query-box-top").append($(accoHtml));
// 	// if(rpt2.rptType == "GL_RPT_BAL"){
// 	// 	var ulBottom = $("#setQuery").parents("li.rpt-query-box-li");
// 	// 	$(ulBottom).before($(accoHtml));
// 	// }else{
// 	// 	var ulBottom = $(".rpt-query-box-bottom");
// 	// 	$(ulBottom).find("li").last().before($(accoHtml));
// 	// }
//
// };

//点击查询方案(不包含余额表)
// rpt2.clickMethod = function(){
// 	$(rpt2.namespace).find('.rpt-method-list').on('click','li span',function(){
// 		$(this).parent("li").css({
// 			"border":"1px solid #108EE9",
// 			"background":"#108EE9"
// 		}).addClass("isUsed").find("span,b").css("color","#fff");
// 		$(this).parent("li").siblings().css({
// 			"border":"1px solid rgba(16,142,233,0.30)",
// 			"background":"rgba(16,142,233,0.20)"
// 		}).removeClass("isUsed").find("span,b").css("color","#108EE9");
// 		$(rpt2.namespace).find('.rpt-share-method-box-body .btn').remove("isUsed");
//
// 		//console.info($(this).offset().top);
// 		if($(this).offset().top>67){
// 			$(this).parents("ul.rpt-method-list").find("li").eq(0).before($(this).parent("li"));
// 		}
//
// 		//请求方案内容
// 		var prjCode = $(this).data("code");//方案代码
// 		rpt2.reqPrjCont(prjCode);
// 	});
// };

//使用共享方案(不包含余额表)
// rpt2.useShareMethod = function(){
// 	$(rpt2.namespace).find('.rpt-share-method-box-body').on('click','.btn',function(){
// 		$(this).addClass("isUsed");
// 		$(rpt2.namespace).find('.rpt-method-list li').css({
// 			"border":"1px solid rgba(16,142,233,0.30)",
// 			"background":"rgba(16,142,233,0.20)"
// 		}).removeClass("isUsed").find("span,b").css("color","#108EE9");
// 		//请求方案内容
// 		var prjCode = $(this).data("code");//方案代码
// 		rpt2.reqPrjCont(prjCode);
// 	});
// };

//删除方案
// rpt2.deleteMethod = function(){
// 	$(rpt2.namespace).find('.rpt-method-list').on('click','b.icon-close',function(){
// 		var thisMothod = $(this).parent("li");
// 		var name = $(this).siblings("span").text();
// 		var pLiFlag = $(this).parent("li").hasClass("isUsed");
// 		var prjCode = $(this).siblings().data("code");//方案代码
//
// 		ufma.confirm('您确定要删除 '+name+' 查询方案?',function(action){
// 			if(action){
// 				var prjDelArgu = {
// 					"agencyCode":rpt2.nowAgencyCode,
// 					"prjCode":prjCode,
// 					"rptType":rpt2.rptType,
// 					"setYear":rpt2.nowSetYear,
// 					"userId":rpt2.nowUserId
// 				};
// 				ufma.ajax(rpt2.portList.deletePrj,"delete",prjDelArgu,function(result){
// 					var flag = result.flag;
// 					if(flag == "success"){
// 						$(thisMothod).remove();
// 						rpt2.moreMethodBtn("rpt-method-list","rpt-method-more");
// 						ufma.showTip("删除成功！",function(){},"success");
// 					}
// 					if(pLiFlag){
// 						if(rpt2.rptType == "GL_RPT_BAL"){
// 							//还原会计体系
// 							rpt2.reqAccaList();
//
// 							var dd = new Date();
// 							var ddYear = dd.getFullYear();
// 							$(rpt2.namespace).find("#dateStart").datetimepicker('setDate',(new Date(ddYear,0)));
// 							$(rpt2.namespace).find("#dateEnd").datetimepicker('setDate',(new Date()));
//
// 							rpt2.backQuery();
// 							rpt2.reqOptList();
//
// 						}else if(rpt2.rptType == "GL_RPT_JOURNAL" || rpt2.rptType == "GL_RPT_COLUMNAR"){
// 							//还原会计体系
// 							rpt2.reqAccaList();
//
// 							var dd = new Date();
// 							var ddYear = dd.getFullYear();
// 							$(rpt2.namespace).find("#dateStart").datetimepicker('setDate',(new Date(ddYear,0)));
// 							$(rpt2.namespace).find("#dateEnd").datetimepicker('setDate',(new Date()));
//
// 							//请求科目辅助项下拉列表
// 							rpt2.reqSelectItems();
// 							rpt2.reqOptList();
//
// 						}else if(rpt2.rptType == "GL_RPT_LEDGER" || rpt2.rptType == "GL_RPT_DAILYJOURNAL"){
// 							//还原会计体系
// 							rpt2.reqAccaList();
//
// 							var dd = new Date();
// 							var ddYear = dd.getFullYear();
// 							$(rpt2.namespace).find("#dateStart").datetimepicker('setDate',(new Date(ddYear,0)));
// 							$(rpt2.namespace).find("#dateEnd").datetimepicker('setDate',(new Date()));
//
// 							//还原查询条件框
// 							rpt2.clearTagsTree();
// 							rpt2.reqOptList();
// 						}else if(rpt2.rptType=="GL_RPT_VOUSUMMARY"){
// 							//还原会计体系
// 							rpt2.reqAccaList();
// 							//还原期间
// 							rpt2.dateBenQi("dateStart","dateEnd");
// 							//清空填入数据
// 							$("#rpt-pzzh-input-form,#rpt-pzzh-input-to").val("");
// 							//还原凭证字号
// 							$("#rpt-pzzh-select option").eq(0).prop("selected",true);
// 							//还原凭证来源
// 							$("#rpt-pzly-select option").eq(0).prop("selected",true);
// 							//还原汇总方式
// 							$("#rpt-hzfs-select option").eq(0).prop("selected",true);
// 							//还原其他check
// 							rpt2.reqOptList();
// 						}
//
// 					}
// 				});
//
// 			}else{
//
// 			}
// 		},{type:'warning'});
// 	});
// };

//点击推荐操作 单一会计科目（总账、日记账）
// rpt2.clickTips = function(){
// 	$(rpt2.namespace).on("click",".rpt-query-li-tip-c i",function(){
// 		$(this).css("color","#008ff0").siblings().css("color","#333");
// //		var tagName = $(this).attr("title");
// 		var tagCode = $(this).data("code");
// 		var tagName = tagCode+" "+$(this).attr("title");
// 		var tagDom = '<li><span data-code="'+tagCode+'" title="'+tagName+'">'+tagName+'</span><b class="glyphicon icon-close"></b></li>';
//
// 		var viewDom = $(this).parents(".rpt-query-li-cont").find(".rpt-tree-view");
// 		$(viewDom).find(".rpt-li-over").prevAll().remove();
// 		$(viewDom).find(".rpt-li-over").before($(tagDom));
// 		$(viewDom).find(".rpt-tags-num").show().find("span").text("1");
// 		var width = $(viewDom).find(".rpt-tags-list li span").width()+34;
// 		$(viewDom).find(".rpt-tags-list").css("width",width+"px");
// 		$(viewDom).find(".rpt-p-search-key").css("width",(288-width)+"px");
//
// 		if($(viewDom).hasClass("hasTree")){
// 			var myTree = $.fn.zTree.getZTreeObj("ACCO-data");
// 			var thisNode = myTree.getNodeByParam("name",tagName,null);
// 			myTree.checkAllNodes(false);
// 			myTree.checkNode(thisNode, true, true);
// 		}
//
// 	});
// };


//返回账表查询的入参结果集
// rpt2.backTabArgu = function(){
// 	var tabArgu = {};
//
// 	tabArgu.acctCode = rpt2.nowAcctCode;//账套代码
// 	tabArgu.agencyCode = rpt2.nowAgencyCode;//单位代码
//
// 	var meLi = $(rpt2.namespace).find(".rpt-method-list li.isUsed");
// 	var meBtn = $(rpt2.namespace).find(".rpt-share-method-box-body .btn.isUsed");
// 	if($(meLi).length>0){
// 		tabArgu.prjCode = $(meLi).find("span").data("code");
// 		tabArgu.prjName = $(meLi).find("span").text();
// 		tabArgu.prjScope = $(meLi).find("span").data("scope");
// 	}else if($(meBtn).length>0){
// 		tabArgu.prjCode = $(meBtn).data("code");
// 		tabArgu.prjName = $(meBtn).siblings("span").text();
// 		tabArgu.prjScope = $(meBtn).siblings("span").data("scope");
// 	}else{
// 		tabArgu.prjCode = "";//方案代码
// 		tabArgu.prjName = "";//方案名称
// 		tabArgu.prjScope = "";//方案作用域
// 	}
//
// 	tabArgu.rptType = rpt2.rptType;//账表类型
// 	tabArgu.setYear = rpt2.nowSetYear;//业务年度
// 	tabArgu.userId = rpt2.nowUserId;//用户id
//
// 	tabArgu.prjContent = rpt2.prjContObj();//方案内容
//
// 	return tabArgu;
// };

//返回单列筛选html
// rpt2.backOneSearchHtml = function(title,index){
// 	var sHtml = '<div class="rpt-funnel">'+
// 	        		'<span class="glyphicon icon-filter rpt-funnelBtn"></span>'+
// 	        		'<div class="rpt-funnelBox rpt-funnelBoxText" >'+
// 	        			'<p class="rpt-funnelTitle">'+
// 	        				'<span class="rpt-funnelTitle-span1">'+title+'</span>'+
// 	        				'<span class="rpt-funnelTitle-span2">清空</span>'+
// 	        				'<span class="rpt-clear"></span>'+
// 	        			'</p>'+
// 	        			'<p class="rpt-funnelCont">'+
// 		        			'<input type="text" class="rpt-txtCont bordered-input" col-index="'+index+'" placeholder="请输入过滤内容"/>'+
// 		        			'<button class="btn btn-primary rpt-oneSearch">查询</button>'+
// 	        			'</p>'+
// 	        		'</div>'+
//         		'</div>';
// 	return sHtml;
// }

//返回区间筛选html
// rpt2.backTwoSearchHtml = function(className,title,index){
// 	var sHtml = '<div class="rpt-funnel">'+
// 					'<span class="glyphicon icon-filter rpt-funnelBtn"></span>'+
// 					'<div class="rpt-funnelBox '+className+'" >'+
// 						'<p class="rpt-funnelTitle">'+
// 							'<span class="rpt-funnelTitle-span1">'+title+'</span>'+
// 							'<span class="rpt-funnelTitle-span2">清空</span>'+
// 							'<span class="rpt-clear"></span>'+
// 						'</p>'+
// 						'<p class="rpt-funnelCont">'+
// 			    			'<input type="text" class="rpt-numCont bordered-input" col-index="'+index+'" placeholder="0.00"/>'+
// 			    			'<span>至</span>'+
// 			    			'<input type="text" class="rpt-numCont bordered-input" col-index="'+index+'" placeholder="0.00"/>'+
// 			    			'<button class="btn btn-primary rpt-twoSearch">查询</button>'+
// 						'</p>'+
// 					'</div>'+
// 				'</div>';
// 	return sHtml;
// }

//显示/隐藏筛选框
// rpt2.isShowFunnelBox= function(){
// 	$(rpt2.namespace).on("click",".rpt-funnelBtn",function(evt){
// 		evt.stopPropagation();
// 		$("div.rpt-funnelBox").hide();
//
// 		var i = $(this).parents("th").find("input").eq(0).attr("col-index");
// 		var type = $(".change-rpt-type select").val();
// 		var thTitle = $(this).parents("th").find(".thTitle").text();
// 		if(thTitle == "摘要"){
// 			var oneKey=ufma.sessionKey(rpt2.module,rpt2.compoCode,rpt2.rgCode,rpt2.nowSetYear,rpt2.nowAgencyCode,rpt2.nowAcctCode,rpt2.namespace+"_"+type+"_"+i+"_oneKey");
// 			var newVal = sessionStorage.getItem(oneKey);
// 			if(newVal != "" && newVal != null){
// 				$(this).parents("th").find("input").eq(0).val(newVal);
// 			}
// 		}else{
// 			var twoKey1=ufma.sessionKey(rpt2.module,rpt2.compoCode,rpt2.rgCode,rpt2.nowSetYear,rpt2.nowAgencyCode,rpt2.nowAcctCode,rpt2.namespace+"_"+type+"_"+i+"_twoKey1");
// 			var twoKey2=ufma.sessionKey(rpt2.module,rpt2.compoCode,rpt2.rgCode,rpt2.nowSetYear,rpt2.nowAgencyCode,rpt2.nowAcctCode,rpt2.namespace+"_"+type+"_"+i+"_twoKey2");
// 			var newVal1 = sessionStorage.getItem(twoKey1);
// 			var newVal2 = sessionStorage.getItem(twoKey2);
// 			if(newVal1 != "" && newVal1 != null){
// 				var numVal1 = newVal1.replace(/\\/g, "");
// 				$(this).parents("th").find("input").eq(0).val(numVal1);
// 			}
// 			if(newVal2 != "" && newVal2 != null){
// 				var numVal2 = newVal2.replace(/\\/g, "");
// 				$(this).parents("th").find("input").eq(1).val(numVal2);
// 			}
// 		}
//
// 		$(this).siblings("div.rpt-funnelBox").show();
// 	});
// 	//$(rpt2.namespace).on("click",".rpt-funnelTitle-span2",function(){
// 	$(".rpt-funnelTitle-span2").on("click",function(){
// 		$(this).parents(".rpt-funnelBox").find("input[type='text']").val("");
// 	});
// 	$(rpt2.namespace).on("click",function(e){
// 		if($(e.target).closest(".rpt-funnelBtn").length == 0 && $(e.target).closest("div.rpt-funnelBox").length == 0 && $(e.target).closest("div#colAction").length == 0){
// 	   		$("div.rpt-funnelBox").hide();
//         }
// 	});
// 	$(rpt2.namespace).on("mouseenter","div.rpt-funnelBox",function(){
// 		$(this).show();
// 	}).on("mouseleave","div.rpt-funnelBox",function(){
// 		$(this).hide();
// 	});
// }

//查选方案列表的触摸效果
// rpt2.methodPointer = function(){
// 	$(rpt2.namespace).find(".rpt-method-list").on("mouseover","li",function(){
// 		$(this).css({"border":"1px solid rgb(16, 142, 233)"});
// 	}).on("mouseout","li",function(){
// 		var color = $(this).css("color");
// 		if(color == "rgb(255, 255, 255)"){
// 			$(this).css({"border":"1px solid rgb(16, 142, 233)"});
// 		}else{
// 			$(this).css({"border":"1px solid rgba(16, 142, 233, 0.3)"});
// 		}
// 	});
// 	$(rpt2.namespace).find(".rpt-method-list").on("mouseover","li b",function(){
// 		var color = $(this).css("color");
// 		var background;
// 		if(color != "rgb(16, 142, 233)"){
// 			background = "rgb(16, 142, 233)";
// 		}else{
// 			background = "rgb(255, 255, 255)";
// 		}
// 		$(this).css({
// 			"border-radius":"50%",
// 			"background":color,
// 			"color":background
// 		});
// 	}).on("mouseout","li b",function(){
// 		var color = $(this).css("color");
// 		var background;
// 		if(color != "rgb(16, 142, 233)"){
// 			background = "rgb(16, 142, 233)";
// 		}else{
// 			background = "rgb(255, 255, 255)";
// 		}
// 		$(this).css({
// 			"border-radius":"50%",
// 			"background":"none",
// 			"color":background
// 		});
// 	});
// };

// 下拉选择树展开隐藏
rpt2.showSelectTree = function () {
    $(rpt2.namespace).on("click", "div.rpt-tree-view", function (e) {
        $(this).parents("li.rpt-query-box-li").siblings().find("div.rpt-tree-data").hide();
        $(this).parents("ul").siblings().find("div.rpt-tree-data").hide();

        $(this).find("input").focus();

        var itemCode = $("#selectTitle").val();

        var ulDom = $(this).parents(".rpt-query-box-li0").find("label select.rpt-select-title");
        //console.info($(ulDom).length);
        if ($(ulDom).length > 0) {
            itemCode = $("#selectTitle").val();
        } else {
            var titleDom = $(this).parents(".rpt-query-box-li0").find("label.rpt-query-li-cont-title span");
            itemCode = $(titleDom).data("code");
        }

        var treeId = itemCode + "-data";

        var treeKey = ufma.sessionKey(rpt2.module, rpt2.compoCode, rpt2.rgCode, rpt2.nowSetYear, rpt2.nowAgencyCode, rpt2.nowAcctCode, rpt2.namespace + itemCode);
        var treeStr = sessionStorage.getItem(treeKey);
        //console.info(treeKey+"=="+treeStr);

        var isShow = $(this).siblings("div.rpt-tree-data").css("display");
        if (isShow == "none") {
            if (itemCode == "ACCO") {

                if (treeStr != null) {
                    var zNodes = JSON.parse(treeStr);
                    rpt2.selectTree(treeId, zNodes);
                    $(this).siblings("div.rpt-tree-data").show();
                } else {
                    rpt2.reqAccoTree();
                }

            } else {

                if (treeStr != null) {
                    var zNodes = JSON.parse(treeStr);
                    rpt2.selectTree(treeId, zNodes);
                    $(this).siblings("div.rpt-tree-data").show();
                } else {
                    rpt2.reqAccItemTree(itemCode);
                }
            }
        }
    });
    $(rpt2.namespace).on("click", function (e) {
        if ($(e.target).closest("div.rpt-tree-view").length == 0 && $(e.target).closest("div.rpt-tree-data").length == 0) {
            $("div.rpt-tree-data").hide();
        }
    });
    $(rpt2.namespace).on("mouseenter", "div.rpt-tree-data", function () {
        $(this).show();
    });
//	$(rpt2.namespace).on("mouseleave","div.rpt-tree-data",function(){
//		$(this).hide();
//	});
};

//打开联查凭证页面
// rpt2.openVouShow=function(dom,page){
// 	var vouGuid = $(dom).attr("data-vouguid");//凭证id
// 	console.info(vouGuid);
// 	if(vouGuid != "null" && vouGuid != ""){
// //		window.location.href = '../../vou/index.html?menuid=BF09D5DB0CA54A268CD6EA8584121401&dataFrom='+page+'&action=query&vouGuid='+vouGuid+"&agencyCode="+rpt2.nowAgencyCode+"&acctCode="+rpt2.nowAcctCode;
//
// 		$(this).attr('data-href','../../../gl/vou/index.html?menuid=BF09D5DB0CA54A268CD6EA8584121401&dataFrom='+page+'&action=query&vouGuid='+vouGuid+"&agencyCode="+rpt2.nowAgencyCode+"&acctCode="+rpt2.nowAcctCode);
// 		$(this).attr('data-title','凭证录入');
// 		window.parent.openNewMenu($(this));
// 	}
// };

//调用账簿打印预览
// rpt2.rptPrint = function(pageName,tableId,tableType){
// 	sessionStorage.removeItem("iWantToPrint");
// 	var rptTitle = $(rpt2.namespace+" .rpt-table-title-show span").text();
// 	var year = $(rpt2.namespace+" #dateStart").datetimepicker('getDate').getFullYear();
// 	var tableSub = $(".rpt-table-sub-tip1").find("span").eq(0).text()+" "+$(".rpt-table-sub-tip1").find("span").eq(1).text();
//
// 	var tableData = $("#"+tableId).DataTable().data();
// 	var rowsArr = [];
// 	for(var i=0;i<tableData.length;i++){
// 		rowsArr.push(tableData[i]);
// 	}
//
// 	var pData = {
// 			labels:{
// 			    rq: year,
// 			    km: "",
// 			    ym: "",
// 			    dwzt: tableSub,
// 			    dyr: rpt2.nowUserName,
// 			    sh: "",
// 			    dyrq: rpt2.nowDate
// 			},
// 			rows:rowsArr
// 		};
//
// 	var argu = {
// 			judge:{
// 				dataFrom:pageName,//来源
// 				direct:"0",//直接打印（0：否，1：是）
// 			},
// 			print:{
// 				pData:pData,//打印需要的p_data
// 				getModels:{
// 					acctCode:rpt2.nowAcctCode,//账套
// 					agencyCode:rpt2.nowAgencyCode,//单位
// 					componentId:rpt2.rptType,//部件id 账簿类型（明细账……）
// 					rptFormat:tableType//账簿样式（三栏式……）
// 				},
// 				title:rptTitle
// 			}
// 		};
//
// 	var printArgu = JSON.stringify(argu);
// 	console.info(printArgu);
// 	sessionStorage.setItem("iWantToPrint",printArgu);
// 	window.open(bootPath+'pub/printpreview/printPreview.html');
// };

//固定底部工具条
// rpt2.showHide=function(tableId){
// 	var tableBox = $("#"+tableId);
// 	var thead = $("#"+tableId).find("thead");
// 	var tool = $(".tableBottom");
// 	var toolFix = $(".tableBottomFix");
//
// 	$(thead).parents("table").width(tableBox.width());
// 	//设置固定底部工具条的宽度
// //	if (navigator.userAgent.indexOf('Firefox') >= 0){
// //		$(tool).css("width",$(tableBox).parent().width()+1+"px");
// //		$(toolFix).css("width",$(tableBox).parent().width()+1+"px");
// //	}else{
// 		$(tool).css({"width":$(tableBox).parent().width()+"px"});
// 		$(toolFix).css({"width":$(tableBox).parent().width()+"px"});
// //	}
//
// 	var winHei;//窗口高度
// 	var toolHei = $(toolFix).height();//底部工具条的高度
// 	var theadHei = $(thead).height();//头部区域的高度
// 	var theadBot;//头部区域距离底部的高度
// 		var toolTop;//底部工具条距离顶部的高度
//
// 		winHei = $(window).height();
// 		theadBot = winHei - ($(thead).offset().top-$(document).scrollTop()) - theadHei;
// 		toolTop = $(tool).offset().top-$(document).scrollTop();
// 		if(theadBot >= toolHei && toolTop > winHei){
// 			$(toolFix).css("display","block");
// 		}else{
// 			$(toolFix).css("display","none");
// 		}
//
// };
//----------------------单位账套树 start-------------------------//
//请求单位账套树
rpt2.atreeData = function () {
    var argu = {
        "setYear": rpt2.nowSetYear,
        "rgCode": rpt2.rgCode,
    };
    ufma.ajax(rpt2.portList.getAgencyAcctTree, "get", argu, function (result) {
        var atreeArr = result.data;
        var znodes = [];
        for (var i = 0; i < atreeArr.length; i++) {
            var nodeObj = {};
            nodeObj.id = atreeArr[i].id;
            nodeObj.pId = atreeArr[i].pId;
            nodeObj.name = atreeArr[i].codeName;
            nodeObj.title = atreeArr[i].codeName;
            nodeObj.isAcct = atreeArr[i].isAcct;
            nodeObj.agencyCode = atreeArr[i].agencyCode == "" ? atreeArr[i].code : atreeArr[i].agencyCode;
            nodeObj.agencyName = atreeArr[i].agencyName;
            nodeObj.acctCode = atreeArr[i].code;
            nodeObj.acctName = atreeArr[i].codeName;
            nodeObj.accsCode = atreeArr[i].accsCode;
            nodeObj.isParallel = atreeArr[i].isParallel;
            znodes.push(nodeObj);
        }
        rpt2.atree(znodes);
        rpt2.clickAtree2(rpt2.nowAgencyCode, rpt2.nowAgencyName, rpt2.nowAcctCode, rpt2.nowAcctName);

        if (rpt2.rptType == "accQuery") {
            rpt2.reqVouBoxCount();
        }

    })
};
//----------------------单位账套树 end-----------------------------//
//单位账套树
rpt2.atree = function (zNodes) {
    var setting = {
        data: {
            simpleData: {
                enable: true
            }
        },
        view: {
            // addDiyDom: addDiyDom,
            fontCss: getFontCss,
            showLine: false,
            showIcon: false
        },
        callback: {
            // beforeClick: atreeBeforeClick,
            onClick: zTreeOnClick,
        }
    };

    function zTreeOnClick(event, treeId, treeNode) {
        if (rpt.rptType == "GL_RPT_JOURNAL" || rpt.rptType == "GL_RPT_LEDGER") {
            changeFlag = true;
        }
        var isAcct = treeNode.isAcct;
        if (!isAcct) {
            ufma.showTip("请选择具体账套", function () {

            }, "warning");
            return false;
        }

        rpt2.nowAgencyCode = treeNode.agencyCode;
        rpt2.nowAgencyName = treeNode.agencyName;
        rpt2.nowAcctCode = treeNode.acctCode;
        rpt2.nowAcctName = treeNode.acctName;
        rpt2.nowAccsCode = treeNode.accsCode;

        rpt.nowAgencyCode = treeNode.agencyCode;
        rpt.nowAgencyName = treeNode.agencyName;
        rpt.nowAcctCode = treeNode.acctCode;
        rpt.nowAcctName = treeNode.acctName;
        rpt.nowAccsCode = treeNode.accsCode;
        rpt.isParallel = treeNode.isParallel;
        rpt.isParallelsum = treeNode.isParallel;

        // rpt2.clickAtree(rpt2.nowAgencyCode,rpt2.nowAgencyName,rpt2.nowAcctCode,rpt2.nowAcctName);
        rpt2.clickAtree2(rpt2.nowAgencyCode, rpt2.nowAgencyName, rpt2.nowAcctCode, rpt2.nowAcctName);

    };

    //节点名称超出长度 处理方式
    function addDiyDom(treeId, treeNode) {
        var spaceWidth = 5;
        var switchObj = $("#" + treeNode.tId + "_switch"),
            icoObj = $("#" + treeNode.tId + "_ico");
        switchObj.remove();
        icoObj.before(switchObj);

        if (treeNode.level > 1) {
            var spaceStr = "<span style='display: inline-block;width:" + (spaceWidth * treeNode.level) + "px'></span>";
            switchObj.before(spaceStr);
        }
        var spantxt = $("#" + treeNode.tId + "_span").html();
        if (spantxt.length > 16) {
            spantxt = spantxt.substring(0, 16) + "...";
            $("#" + treeNode.tId + "_span").html(spantxt);
        }
    }

    function atreeBeforeClick(treeId, treeNode, clickFlag) {
        var isAcct = treeNode.isAcct;
        if (treeTimeId) {
            clearTimeout(treeTimeId)
        }
        treeTimeId = setTimeout(function () {
            if (!isAcct) {
                ufma.showTip("请选择具体账套", function () {

                }, "warning");
                return false;
            }
        }, 200)

    }

    function atreeBeforeDbClick(treeId, treeNode, clickFlag) {
        var isAcct = treeNode.isAcct;
        if (treeTimeId) {
            clearTimeout(treeTimeId)
        }
        treeTimeId = setTimeout(function () {
            if (!isAcct) {
                ufma.showTip("请选择具体账套", function () {

                }, "warning");
                return false;
            }
        }, 200)

    }

    function focusKey(e) {
        if (key.hasClass("empty")) {
            key.removeClass("empty");
        }
    }

    function blurKey(e) {
        if (key.get(0).value === "") {
            key.addClass("empty");
        }
    }

    var lastValue = "", nodeList = [], fontCss = {};

    function clickRadio(e) {
        lastValue = "";
        searchNode(e);
    }

    function allNodesArr() {
        var zTree = $.fn.zTree.getZTreeObj("atree");
        var nodes = zTree.getNodes();
        var allNodesArr = [];
        var allNodesStr;
        for (var i = 0; i < nodes.length; i++) {
            var result = "";
            var result = rpt2.getAllChildrenNodes(nodes[i], result);
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

    function searchNode(e) {
        var zTree = $.fn.zTree.getZTreeObj("atree");
        var value = $.trim(key.get(0).value);
        var keyType = "name";

        if (key.hasClass("empty")) {
            value = "";
        }
        if (lastValue === value) return;
        lastValue = value;
        if (value === "") {
            updateNodes(false);
            return;
        }
        ;
        updateNodes(false);

        nodeList = zTree.getNodesByParamFuzzy(keyType, value);

        updateNodes(true);

        var NodesArr = allNodesArr();
        console.info(NodesArr)
        if (nodeList.length > 0) {
            var index = NodesArr.indexOf(nodeList[0].id.toString());
            $(".rpt-atree-box-body").scrollTop((30 * index));
        }
    }

    function updateNodes(highlight) {
        var zTree = $.fn.zTree.getZTreeObj("atree");
        for (var i = 0, l = nodeList.length; i < l; i++) {
            nodeList[i].highlight = highlight;
            zTree.updateNode(nodeList[i]);
        }
    }

    function getFontCss(treeId, treeNode) {
        return (!!treeNode.highlight) ? {color: "#F04134", "font-weight": "bold"} : {
            color: "#333",
            "font-weight": "normal"
        };
    }

    function filter(node) {
        return !node.isParent && node.isFirstNode;
    }

    var key;
    $(document).ready(function () {
        var treeObj = $.fn.zTree.init($("#atree"), setting, zNodes);


        var myPageFrom = rpt2.GetQueryString("pageFrom");
        if (myPageFrom != null && myPageFrom.toString().length > 1) {
            myPageFrom = rpt2.GetQueryString("pageFrom");
        }
        if (myPageFrom == "accQuery") {
            var arguStr = sessionStorage.getItem("accQueryArgu");
            if (arguStr) {
                console.info("arguStr==" + arguStr);
                var arguObj = JSON.parse(arguStr);
                rpt2.nowAgencyCode = arguObj.agencyCode;
                rpt2.nowAgencyName = arguObj.agencyName;
                rpt2.nowAcctCode = arguObj.acctCode;
                rpt2.nowAcctName = arguObj.acctName;

            }
            var pnodeList = treeObj.getNodesByParam("agencyCode", rpt2.nowAgencyCode);
            var nodeList = treeObj.getNodesByParam("acctCode", rpt2.nowAcctCode, pnodeList[0]);
            treeObj.selectNode(nodeList[0]);
            treeObj.expandNode(nodeList[0], true, true, true);
            rpt.nowAccsCode = nodeList[0].accsCode;
            rpt2.nowAccsCode = nodeList[0].accsCode;
            rpt.isParallel = nodeList[0].isParallel;
            rpt.isParallelsum = nodeList[0].isParallel;
            rpt.nowAgencyCode = nodeList[0].agencyCode;
            rpt.nowAgencyName = nodeList[0].agencyName;

        } else {
            if (rpt2.nowAgencyCode != "" && rpt2.nowAgencyName != "" && rpt2.nowAcctCode != "" && rpt2.nowAcctName != "") {
                var pnodeList = treeObj.getNodesByParam("agencyCode", rpt2.nowAgencyCode);
                var nodeList = treeObj.getNodesByParam("acctCode", rpt2.nowAcctCode, pnodeList[0]);
                treeObj.selectNode(nodeList[0]);
            } else {
                var nodeList = treeObj.getNodesByParam("isAcct", true);
                treeObj.selectNode(nodeList[0]);

                rpt2.nowAgencyCode = nodeList[0].agencyCode;
                rpt2.nowAgencyName = nodeList[0].agencyName;
                rpt2.nowAcctCode = nodeList[0].acctCode;
                rpt2.nowAcctName = nodeList[0].acctName;
            }
        }

        if (rpt2.rptType == "accQuery") {
            $(".rpt-acc-sub").find("span").eq(0).text(rpt2.nowAgencyName);
            $(".rpt-acc-sub").find("span").eq(1).text(rpt2.nowAcctName);
        } else {
            //表格单位信息
            $(".rpt-table-sub-tip1").find("span").eq(0).text(rpt2.nowAgencyName).attr('code', rpt2.nowAgencyCode);
            $(".rpt-table-sub-tip1").find("span").eq(1).text(rpt2.nowAcctName);
        }


        //treeObj.expandAll(true);

        key = $("#key");
        key.bind("focus", focusKey)
            .bind("blur", blurKey)
            .bind("propertychange", searchNode)
            .bind("input", searchNode);
    });

};
rpt2.clickAtree2 = function (agencyCode, agencyName, acctCode, acctName) {
    //给全局账套变量赋值
    rpt.nowAcctCode = acctCode;
    rpt.nowAcctName = acctName;

    rpt.accsSel = false;//在汇总余额表中控制选择科目体系的

//			console.info(rpt.nowAcctName);
    if (rpt.sessionKeyArr.length > 0) {
        for (var i = 0; i < rpt.sessionKeyArr.length; i++) {
            sessionStorage.removeItem(rpt.sessionKeyArr[i]);
        }
    }
    $("div.rpt-tree-data").hide();

    if (rpt.rptType != "GL_RPT_JOURNAL" && rpt.rptType != "GL_RPT_LEDGER") {
        rpt.reqAccList();
    }
    

    if (dm.isPrjList) {
        //请求查询方案列表
        rpt.reqPrjList();
        //请求共享方案列表
        rpt.reqSharePrjList()
        //请求会计体系列表
        rpt.reqAccaList();
    }

    if (rpt.rptType == "GL_RPT_BAL") {
        //表格账套信息
        $(".rpt-table-sub-tip1").find("span").eq(0).text(rpt.nowAgencyName);
        $(".rpt-table-sub-tip1").find("span").eq(1).text(rpt.nowAcctName);
        rpt.isSetAcc = false;
    } else if (rpt.rptType == "GL_RPT_JOURNAL") {
        //表格账套信息
        $(".rpt-table-sub-tip1").find("span").eq(0).text(rpt.nowAgencyName);
        $(".rpt-table-sub-tip1").find("span").eq(1).text(rpt.nowAcctName);
    } else if (rpt.rptType == "GL_RPT_LEDGER") {
        //表格账套信息
        $(".rpt-table-sub-tip1").find("span").eq(0).text(rpt.nowAgencyName);
        $(".rpt-table-sub-tip1").find("span").eq(1).text(rpt.nowAcctName);
    } else if (rpt.rptType == "GL_RPT_COLUMNAR") {
        //表格账套信息
        $(".rpt-table-sub-tip1").find("span").eq(0).text(rpt.nowAgencyName);
        $(".rpt-table-sub-tip1").find("span").eq(1).text(rpt.nowAcctName);
        //请求科目辅助项下拉列表
        rpt.reqSelectItems();
    }
    // else if(rpt.rptType == "GL_RPT_LEDGER" || rpt.rptType == "GL_RPT_DAILYJOURNAL"){
    else if (rpt.rptType == "GL_RPT_DAILYJOURNAL") {
        //表格账套信息
        $(".rpt-table-sub-tip1").find("span").eq(0).text(rpt.nowAgencyName);
        $(".rpt-table-sub-tip1").find("span").eq(1).text(rpt.nowAcctName);
        //还原查询条件
        rpt.clearTagsTree();
    } else if (rpt.rptType == "GL_RPT_VOUSUMMARY") {
        //请求汇总方式列表
        rpt.reqEleLevelNum();
    } else if (rpt.rptType == "GL_RPT_CFSTATEMENT") {
        //现金流量统计表不需要特殊处理
    } else if (rpt.rptType == "GL_RPT_CHRBOOK") {
        //表格账套信息
        $(".rpt-table-sub-tip1").find("span").eq(0).text(rpt.nowAgencyName);
        $(".rpt-table-sub-tip1").find("span").eq(1).text(rpt.nowAcctName);
    } else {
        //
//				console.info("不是余额表、明细账、总账、日记账、凭证汇总表、多栏账、现金流量统计表、序时账，请做细化处理！");
    }
     //bug76947--修改不能自动查询问题，现改为在账套选定后自动查询表格数据
    //  $('.btn-query').trigger('click');
    if (rpt.rptType === "GL_RPT_BAL" || rpt.rptType === "GL_RPT_LEDGER" || rpt.rptType === "GL_RPT_JOURNAL") {
        rpt.initQueryAcco(changeFlag);
        if (rpt.rptType === "GL_RPT_BAL") {
            dm.showItemCol(true);
            rpt.tableColArr();
        }
    }
};
//点击左侧单位账套树
// rpt2.clickAtree = function(agencyCode,agencyName,acctCode,acctName){
// 	rpt2.nowAgencyCode = agencyCode;
// 	rpt2.nowAgencyName = agencyName;
// 	rpt2.nowAcctCode = acctCode;
// 	rpt2.nowAcctName = acctName;
//
// 	if(rpt2.sessionKeyArr.length>0){
// 		for(var i=0;i<rpt2.sessionKeyArr.length;i++){
// 			sessionStorage.removeItem(rpt2.sessionKeyArr[i]);
// 		}
// 	}
// 	$("div.rpt-tree-data").hide();
//
// 	//请求查询方案列表
// 	rpt2.reqPrjList();
// 	//请求共享方案列表
// 	rpt2.reqSharePrjList()
// 	//请求会计体系列表
// 	rpt2.reqAccaList();
// 	console.info(rpt2.rptType);
//
// 	if(rpt2.rptType == "accQuery"){
// 		$(".rpt-acc-sub").find("span").eq(0).text(rpt2.nowAgencyName);
// 		$(".rpt-acc-sub").find("span").eq(1).text(rpt2.nowAcctName);
// 		if(rpt2.accTableObj != null){
// 			rpt2.accTableObj.clear().destroy();
// 		}
// 		rpt2.reqVouBoxCount();
// 	}else if(rpt2.rptType == "GL_RPT_BAL"){
// 		//表格单位信息
// 		$(".rpt-table-sub-tip1").find("span").eq(0).text(rpt2.nowAgencyName);
// 		$(".rpt-table-sub-tip1").find("span").eq(1).text(rpt2.nowAcctName);
// 		//还原查询条件
// 		rpt2.backQuery();
// 		rpt2.isSetAcc = false;
// 	}
// 	else if(rpt2.rptType == "GL_RPT_JOURNAL"){
// 		//表格单位信息
// 		$(".rpt-table-sub-tip1").find("span").eq(0).text(rpt2.nowAgencyName);
// 		$(".rpt-table-sub-tip1").find("span").eq(1).text(rpt2.nowAcctName);
// 		//请求科目辅助项下拉列表
// 		rpt2.reqSelectItems();
// 		//请求币种列表
// 		rpt2.reqCurrType();
// 	}
// 	else if(rpt2.rptType == "GL_RPT_LEDGER" || rpt2.rptType == "GL_RPT_DAILYJOURNAL"){
// 		//表格单位信息
// 		$(".rpt-table-sub-tip1").find("span").eq(0).text(rpt2.nowAgencyName);
// 		$(".rpt-table-sub-tip1").find("span").eq(1).text(rpt2.nowAcctName);
// 		//还原查询条件
// 		rpt2.clearTagsTree();
// 	}
// 	else if(rpt2.rptType == "GL_RPT_VOUSUMMARY"){
// 		//请求凭证字号列表
// 		rpt2.reqVoutype();
// 		//请求汇总方式列表
// 		rpt2.reqEleLevelNum();
// 	}
// 	else if(rpt2.rptType == "GL_RPT_COLUMNAR"){
// 		//表格单位信息
// 		$(".rpt-table-sub-tip1").find("span").eq(0).text(rpt2.nowAgencyName);
// 		//请求科目辅助项下拉列表
// 		rpt2.reqSelectItems();
// 	}
// 	else if(rpt2.rptType == "GL_RPT_CFSTATEMENT"){
// 		//表格单位信息
// 		$(".rpt-table-sub-tip1").find("span").eq(0).text(rpt2.nowAgencyName);
// 	}
// 	else if(rpt2.rptType == "GL_RPT_CHRBOOK"){
// 		//表格单位信息
// 		$(".rpt-table-sub-tip1").find("span").eq(0).text(rpt2.nowAgencyName);
// 		$(".rpt-table-sub-tip1").find("span").eq(1).text(rpt2.nowAcctName);
// 		//请求凭证类型、字号列表
// 		rpt2.getVouTypeFull();
// 	}
// 	else{
// 		console.info("不是余额表、明细账、总账、日记账、凭证汇总表、多栏账、现金流量统计表、序时账，请做细化处理！");
// 	}
//
// }

rpt2.openTabMenu = function (dom) {
    sessionStorage.removeItem("accQueryArgu");
    var arguObj = {
        agencyCode: rpt2.nowAgencyCode,
        agencyName: rpt2.nowAgencyName,
        acctCode: rpt2.nowAcctCode,
        acctName: rpt2.nowAcctName,
    };
    var arguStr = JSON.stringify(arguObj);
    sessionStorage.setItem("accQueryArgu", arguStr);

    var urlPath = $(dom).attr("data-href");
    var index = window.location.href.indexOf("&");
    rpt.urlStr = window.location.href.substr(index + 1, window.location.href.length - 1);
    window.location.href = urlPath.substring(6) + "&" + rpt.urlStr;
    //门户打开方式
    //window.parent.openNewMenu($(this));
}

//账务查询表格初始化
rpt2.newAccTable = function (tableData) {
    var id = "accTable";//表格id
    $("#" + id).dataTable().fnDestroy();
    rpt2.accTableObj = $("#" + id).DataTable({
        "language": {
            "url": bootPath + "agla-trd/datatables/datatable.default.js"
        },
        "fixedHeader": {
            header: true
        },
        "data": tableData,
        "processing": true,//显示正在加载中
        "ordering": false,
        "paging": false,
        "info": false,
        "columns": [//O:未审核凭证;A:已审核凭证;F:已复审凭证;P:已记账凭证;C:已作废凭证
            {title: "期间", data: "fisPerd"},
            {title: "状态", data: "status"},
            {title: "凭证总数", data: "vouCount"},
            {title: "未审核", data: "vouStatusO"},
            {title: "审核数", data: "vouStatusA"},
            {title: "复审数", data: "vouStatusF"},
            {title: "记账数", data: "vouStatusP"}
        ],
        "columnDefs": [
            {
                "targets": [0],
                "className": "tdCenter"
            },
            {
                "targets": [1],
                "className": "tdLeft"
            },
            {
                "targets": [-5, -4, -3, -2, -1],
                "className": "tdRight"
            }
        ],
        "dom": 'rt',
        "initComplete": function () {

        },
        "drawCallback": function (settings) {
            $("#" + id).find("td.dataTables_empty").text("")
                .append('<img src="' + bootPath + 'images/noData.png"/><br/><i>目前还没有你要查询的数据</i>');
        }
    });
    return rpt2.accTableObj;
};

//收集表格表头信息
// rpt2.tableHeader=function (tableId){
// 	var columns = $("#"+tableId).DataTable().settings()[0].aoColumns;
// 	var visible = $("#"+tableId).DataTable().columns().visible();//每列元素的隐藏/显示属性组
// 	var arr = [];//存储当前表格的表头信息
// 	for(var i=0;i<visible.length;i++){
// 		var obj={};
// 		obj.title = columns[i].sTitle;//列名
// 		obj.code = columns[i].data;//列名代码
// 		obj.index = i;//列的索引
// 		obj.visible = visible[i] ;//列的隐藏/显示属性
// 		obj.pTitle = $(columns[i].nTh).attr("parent-title") == undefined ? "" : $(columns[i].nTh).attr("parent-title");//列名的父元素名
// 		arr.push(obj);
// 	}
// 	return arr;
// };