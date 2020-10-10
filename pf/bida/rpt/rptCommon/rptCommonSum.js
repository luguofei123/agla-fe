;
var pfData = ufma.getCommonData();
//console.info("pfData=="+JSON.stringify(pfData));

var rpt = {};
//用于存储打开的模态框
rpt.setQuery;
rpt.namespace = "#"+$(".rptType").data("name");
//console.info(rpt.namespace);

rpt.nowDate = pfData.svTransDate;//当前年月日
rpt.module = "gl";//模块代码
rpt.compoCode = "rpt";//部件代码
//rpt.rgCode = "87";//区划代码
rpt.rgCode = pfData.svRgCode;//区划代码

rpt.bennian = pfData.svSetYear;//本年 年度
rpt.benqi = pfData.svFiscalPeriod;//本期 月份
rpt.today = pfData.svTransDate;//今日 年月日

//储存页面已存在session的key
rpt.sessionKeyArr = [];

//余额表联查明细账参数缓存
rpt.journalFormBal=ufma.sessionKey(rpt.module,rpt.compoCode,rpt.rgCode,rpt.nowSetYear,rpt.nowAgencyCode,rpt.nowAcctCode,"journalFormBal");

rpt.urlPath = "http://127.0.0.1:8081";
//rpt.urlPath = "";

//账表所用接口
rpt.portList = {
	getAgencyAcctTree:"/bida/sys/common/getAgencyAcctTree",//单位账套树
	getAccsList:"/bida/ma/sys/accs/select",//科目体系
	accaList:"/bida/ma/sys/acca/select",//会计体系列表接口
	accoTree:"/bida/ma/sys/acco/selectTree",//会计科目树（账套级）接口
	accItemTree:"/bida/ma/sys/accItemData/selectTree",//辅助项资料树（单位级）接口
	rptAccItemTypeList:"/bida/ma/sys/accItemType/select",//辅助项类别列表接口包括科目
	
	tipsList:rpt.urlPath+"/gl/accTips/getTips",//推荐项列表接口
	prjList:rpt.urlPath+"/gl/rpt/prj/getPrjList",//查询方案列表接口
	sharePrjList:rpt.urlPath+"/gl/rpt/prj/getSharePrjList",//共享方案列表接口
	optList:rpt.urlPath+"/gl/rpt/prj/getOptList",//查询条件其他选项列表接口
	savePrj:rpt.urlPath+"/gl/rpt/prj/savePrj",//保存查询方案
	prjContent:rpt.urlPath+"/gl/rpt/prj/getPrjcontent",//查询方案内容接口
	deletePrj:rpt.urlPath+"/gl/rpt/prj/deletePrj",//删除查询方案
	
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

rpt.nowSetYear = pfData.svSetYear;//当前年份
rpt.nowUserId = pfData.svUserId;//登录用户ID    修改权限  将svUserCode改为 svUserId  20181012
rpt.nowUserName = pfData.svUserName;//登录用户名称
rpt.nowAgencyCode = pfData.svAgencyCode;//登录单位代码
rpt.nowAgencyName = pfData.svAgencyName;//登录单位名称
rpt.nowAcctCode = pfData.svAcctCode;//账套代码
rpt.nowAcctName = pfData.svAcctName;//账套名称
rpt.rptType = $(".rptType").val();//账表类型


/**账表的通用公共方法******************************************************************/
/*
 * JSON数组去重
 * @param: [array] json Array
 * @param: [string] 唯一的key名，根据此键名进行去重
 */
rpt.uniqueArray=function(array, key){
    var result = [array[0]];
    for(var i = 1; i < array.length; i++){
        var item = array[i];
        var repeat = false;
        for (var j = 0; j < result.length; j++) {
            if (item[key] == result[j][key]) {
                repeat = true;
                break;
            }
        }
        if (!repeat) {
            result.push(item);
        }
    }
    return result;
};

//返回地址栏的参数
rpt.GetQueryString=function(name){
	var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
	var r = window.location.search.substr(1).match(reg);
	if(r!=null)return  unescape(r[2]); return null;
};

/*
 * 获得节点下面的所有子节点
 */
rpt.getAllChildrenNodes=function(treeNode,result){
	if (treeNode.isParent) {
		var childrenNodes = treeNode.children;
        if (childrenNodes) {
            for (var i = 0; i < childrenNodes.length; i++) {
               	result += ","+(childrenNodes[i].id);
                result = rpt.getAllChildrenNodes(childrenNodes[i], result);
            }
        }
    }
    return result;
};

//数字保留千分位
rpt.comdify=function(n){
	var re=/\d{1,3}(?=(\d{3})+$)/g;
	var n1=n.replace(/^(\d+)((\.\d+)?)$/,function(s,s1,s2){return s1.replace(re,"$&,")+s2;});
	return n1;
};

//判断更多查询方案按钮是否显示
rpt.moreMethodBtn=function(ulDom,moreDom){
	var len = 0;
	$("."+ulDom).find("li").each(function(i){
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
		var liLen = parseInt(liW.substring(0,liW.indexOf("p")));
		len += parseInt(liLen+8);
	})
	if(len<($(".rpt-method-box").width()-126)){
		$("."+moreDom).hide();
	}else{
		$("."+moreDom).show();
	}
};

//单选按钮组
rpt.raidoBtnGroup=function(btnGroupClass){
	$(rpt.namespace).find("."+btnGroupClass).on("click","button",function(){
		$(this).addClass("btn-primary").removeClass("btn-default");
		$(this).siblings("button").removeClass("btn-primary").addClass("btn-default");
	})
};
//单选radio组
rpt.raidoInputGroup=function(labelClass){
	$(rpt.namespace).find("."+labelClass).on("click",function(){
		$(this).find("input").attr("checked",true);
		$(this).siblings().find("input").removeAttr("checked");
	})
};
//返回本期时间
rpt.dateBenQi=function(startId,endId){
//	var dd = new Date();
//	var ddYear = dd.getFullYear();
//	var ddMonth = dd.getMonth();
//	var tdd = new Date(ddYear,ddMonth+1,0)
//	var ddDay = tdd.getDate();
//	$(rpt.namespace).find("#"+startId).datetimepicker('setDate',(new Date(ddYear,ddMonth,1)));
//	$(rpt.namespace).find("#"+endId).datetimepicker('setDate',(new Date(ddYear,ddMonth,ddDay)));
	
	var ddYear = rpt.bennian;
	var ddMonth = rpt.benqi - 1;
	var tdd = new Date(ddYear,ddMonth+1,0)
	var ddDay = tdd.getDate();
	$(rpt.namespace).find("#"+startId).datetimepicker('setDate',(new Date(ddYear,ddMonth,1)));
	$(rpt.namespace).find("#"+endId).datetimepicker('setDate',(new Date(ddYear,ddMonth,ddDay)));
};
//返回本年时间
rpt.dateBenNian=function(startId,endId){
//	var dd = new Date();
//	var ddYear = dd.getFullYear();
//	$(rpt.namespace).find("#"+startId).datetimepicker('setDate',(new Date(ddYear,0,1)));
//	$(rpt.namespace).find("#"+endId).datetimepicker('setDate',(new Date(ddYear,11,31)));
	
	var ddYear = rpt.bennian;
	$(rpt.namespace).find("#"+startId).datetimepicker('setDate',(new Date(ddYear,0,1)));
	$(rpt.namespace).find("#"+endId).datetimepicker('setDate',(new Date(ddYear,11,31)));
};
//返回今日时间
rpt.dateToday=function(startId,endId){
//	$(rpt.namespace).find("#"+startId+",#"+endId).datetimepicker('setDate',(new Date()));
	$(rpt.namespace).find("#"+startId+",#"+endId).datetimepicker('setDate',(new Date(rpt.today)));
};


//判断li-over和计数是否显示
rpt.selectTip=function(ulDom,numDom){
	var len = 0;
	$(ulDom).find("li").not(".rpt-li-over").each(function(i){
		var width = $(this).find("span").width()+30;
		len += parseInt(width + 4)
		if(len<213){
			len = len + 4;
			$(this).show();
			$(ulDom).css("width",len+"px");
			$(ulDom).siblings(".rpt-p-search-key").css("width",(288-len)+"px");
		}else{
			$(this).hide();
			$(ulDom).find("li:lt(i)").show();
			$(ulDom).find("li.rpt-li-over").show();
		}
	})
	
	var num = parseInt($(numDom).text());
	if(num>0){
		$(numDom).parent("div.rpt-tags-num").show();
	}else{
		$(numDom).parent("div.rpt-tags-num").hide();
	}
};

//构建树节点标签
rpt.createTags=function(treeId,type){
	var mytree = $.fn.zTree.getZTreeObj(treeId);
	var firstNode = mytree.getNodes()[0];
	var nodeNamesArr = [];
	nodeNamesArr.push(firstNode.name);
	
	var NodesStr = [];
	if (firstNode.isParent) {
		var result =  rpt.getAllChildrenNodes(firstNode,result);
		if(result != "" && result != undefined && result != null){
			if(result.indexOf(",") != "-1"){
				NodesStr = result.split(",");
			}else{
				NodesStr.push(result);
			}
		}
	}else{
		NodesStr.push(firstNode.id);
	}
	
	var ulDom = $("#"+treeId).parent("div.rpt-tree-data").siblings("div.rpt-tree-view").find("ul.rpt-tags-list");
	$(ulDom).html('<li class="rpt-li-over" style="display: none;">...</li>');
	var liArr = [];
	$(ulDom).find("li").each(function(){
		liArr.push($(this).find("span").text());
	})
	
	var numDom = $(ulDom).siblings("div.rpt-tags-num").find("span");
	var num = 0;
	
	var checkNodes = mytree.getCheckedNodes(true);

	var allCheckNodes = [];
	for(var i=0;i<checkNodes.length;i++) {
		var halfCheck = checkNodes[i].getCheckStatus();
		var pnode = checkNodes[i].isParent;
		
		if(rpt.rptType != "GL_RPT_COLUMNAR"){
			if (!halfCheck.half){
				allCheckNodes.push(checkNodes[i]);
			}
		}else{
			if (!halfCheck.half && !pnode){
				allCheckNodes.push(checkNodes[i]);
			}
		}
			
	}
	
	var len = 0;
	if(allCheckNodes.length>0 && allCheckNodes.length<NodesStr.length){
		for(var i=0;i<allCheckNodes.length;i++){
			if($.inArray(allCheckNodes[i].name, liArr) == "-1"){
				num++;
				var newLi = '<li><span data-code="'+allCheckNodes[i].id+'" title="'+allCheckNodes[i].name+'">'+allCheckNodes[i].name+'</span><b class="glyphicon icon-close"></b></li>';
				$(ulDom).find("li.rpt-li-over").before($(newLi));
				$(numDom).text(num);
				rpt.selectTip(ulDom,numDom);
			}
		}
	}else if(allCheckNodes.length==NodesStr.length){
		num = allCheckNodes.length-1;
		if(nodeNamesArr[0] != "全部"){
			num = allCheckNodes.length;
		}else{
			num = allCheckNodes.length-1;
		}
		
		var newLi = '<li><span data-code="'+allCheckNodes[0].id+'" title="'+allCheckNodes[0].name+'">'+allCheckNodes[0].name+'</span><b class="glyphicon icon-close"></b></li>';
		//len = 60;
		len = ($(newLi).find("span").text().length * 14)+34;
		
		$(ulDom).css("width",len+"px");
		$(ulDom).siblings(".rpt-p-search-key").css("width",(288-len)+"px");
		
		$(ulDom).find("li.rpt-li-over").before($(newLi));
		$(numDom).text(num);
		$(numDom).parent("div.rpt-tags-num").show();
	}else{
		$(ulDom).find("li").hide();
		$(numDom).text(0);
		$(numDom).parent("div.rpt-tags-num").hide();
		
		$(ulDom).css("width","0px");
		$(ulDom).siblings(".rpt-p-search-key").css("width","288px");
	}
	
	$("#"+treeId).siblings("p").find("input").val("");
};

//下拉选择创建标签
rpt.selectTags=function(treeId,type){
	var dom = treeId;
	var tree = type;
	//构建树节点标签
	rpt.createTags(treeId,type);
	
	//余额表的操作
	if(rpt.rptType == "GL_RPT_BAL"){
		//如果不是设置辅助项带过来的标签 才清空下面辅助项已有的标签
//		if(treeId == "ACCO-data" && type){
//			rpt.changeItems();
//		}
	}
	//明细账
	else if(rpt.rptType == "GL_RPT_JOURNAL"){
		
	}
	//总账、日记账
	else if(rpt.rptType == "GL_RPT_LEDGER" || rpt.rptType == "GL_RPT_DAILYJOURNAL"){
		
	}
	//多栏账
	else if(rpt.rptType == "GL_RPT_COLUMNAR"){
		
	}
	else{
		console.info("不是余额表、明细账、总账、日记账、多栏账,查看是否需要做细化处理！");
	}
	
};

//移除树节点标签
rpt.removeTags=function(dom,tree){
	var ulDom = $(dom).parents("ul.rpt-tags-list");
	
	var liDom = $(dom).parent("li").remove();
	var treeId = $(dom).parents("div.rpt-query-li-selete").find("ul.ztree").attr("id");
	var domName = $(dom).siblings("span").text();
	var mytree = tree;
	var domNode = mytree.getNodeByParam("name",domName, null);
	var checkNodes = mytree.checkNode(domNode, false, true);
	
	$(ulDom).siblings(".rpt-p-search-key").find("input").val("").focus();
};

//删除select标签
rpt.deleteSelete=function(dom,tree){
	var dom = dom;
	var tree = tree;
	//移除树节点标签
	rpt.removeTags(dom,tree);
	
	//余额表的操作
	if(rpt.rptType == "GL_RPT_BAL"){
		var treeId = $(dom).parents("div.rpt-query-li-selete").find("ul.ztree").attr("id");
		if(treeId == "ACCO-data"){
			rpt.changeItems();
		}
	}
	//明细账的操作
	else if(rpt.rptType == "GL_RPT_JOURNAL"){
//		var treeId = $(dom).parents("div.rpt-query-li-selete").find("ul.ztree").attr("id");
//		if(treeId == "ACCO-data"){
//			rpt.changeItems();
//		}
	}
	//总账、日记账的操作
	else if(rpt.rptType == "GL_RPT_LEDGER" || rpt.rptType == "GL_RPT_DAILYJOURNAL"){
		
	}
	//多栏账
	else if(rpt.rptType == "GL_RPT_COLUMNAR"){
		
	}
	else{
		console.info("不是余额表、明细账、总账、日记账、多栏账,查看是否需要做细化处理！");
	}
	
};

//返回创建下拉选择树

var ii = "00";
rpt.selectTree=function(treeId,nodes){
	var myTree;
	var setting = {
		view: {
			selectedMulti: false,
			showLine:false,
			fontCss: getFontCss,
		},
		check: {
			enable: true
		},
		data: {
			simpleData: {
				enable: true
			}
		},
		callback: {
			onClick:zTreeOnClick,
			onCheck: zTreeOnCheck
		}
	};
	
	function zTreeOnClick(event, treeId, treeNode) {
		var be = treeNode.checked;
		myTree.checkNode(treeNode, !be, true);
	    rpt.selectTags(treeId,true);
		$(key).val("").focus();
		if(rpt.rptType == "GL_RPT_JOURNAL"){
			$("#"+treeId).parent("div.rpt-tree-data").hide();
		}
	};
	
	function zTreeOnCheck(event, treeId, treeNode) {
	    rpt.selectTags(treeId,true);
		$(key).val("").focus();
		if(rpt.rptType == "GL_RPT_JOURNAL"){
			$("#"+treeId).parent("div.rpt-tree-data").hide();
		}
	};
	
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
	function searchNode(e) {
		var value = $.trim(key.get(0).value);
		var keyType = "id";
		
		if (key.hasClass("empty")) {
			value = "";
		}
		if (lastValue === value) return;
		lastValue = value;
		if (value === "") return;
		updateNodes(false);

		nodeList = myTree.getNodesByParamFuzzy(keyType, value);
			
		updateNodes(true);
		
		
		var NodesArr = allNodesArr();
		if(nodeList.length>0){
			var index = NodesArr.indexOf(nodeList[0].id);
			$("#"+treeId).scrollTop((30*index));
		}
		
		$(key).keydown(function(e){
			//console.info(2222);
			
			if(e.keyCode==13){
				if(nodeList.length>0 && nodeList != null && nodeList != ""){
					var firstNode = myTree.getNodeByParam("name",nodeList[0].name,null);
					myTree.checkNode(firstNode, true, true);
					rpt.selectTags(treeId,true);
					$(key).val("").focus();
					if(rpt.rptType == "GL_RPT_JOURNAL"){
						$("#"+treeId).parent("div.rpt-tree-data").hide();
					}
					updateNodes(false);
				}else{
					//console.info(111);
					return false;
				}
			}
			
		});

	}
	function updateNodes(highlight) {
		for( var i=0, l=nodeList.length; i<l; i++) {
			nodeList[i].highlight = highlight;
			myTree.updateNode(nodeList[i]);
		}
	}
	function getFontCss(treeId, treeNode) {
		return (!!treeNode.highlight) ? {color:"#F04134", "font-weight":"bold"} : {color:"#333", "font-weight":"normal"};
	}
	function filter(node) {
		return !node.isParent && node.isFirstNode;
	}

	function allNodesArr(){
		var nodes =  myTree.getNodes();
		var allNodesArr = [];
		var allNodesStr;
		for(var i=0;i<nodes.length;i++){
			var result = "";
			var result =  rpt.getAllChildrenNodes(nodes[i],result);
			var NodesStr = result
			NodesStr = NodesStr.split(",");
			NodesStr.splice(0,1,nodes[i].id);
			NodesStr = NodesStr.join(",");
			allNodesStr += ","+NodesStr;
		}
		allNodesArr = allNodesStr.split(",");
		allNodesArr.shift();
		return allNodesArr;
	}

	var key;
	
	$(document).ready(function(){
		var newNodes = [];
		for(var i=0;i<nodes.length;i++){
			var newNodeObj = {};
			newNodeObj.pId = nodes[i].pId;
			newNodeObj.id = nodes[i].id;
			if(nodes[i].name == "全部"){
				newNodeObj.name = nodes[i].name;
			}else{
				newNodeObj.name = nodes[i].id+" "+nodes[i].name;
			}
			newNodes.push(newNodeObj);
		}
		myTree = $.fn.zTree.init($("#"+treeId), setting, newNodes);
		myTree.expandAll(true);

		
		//暂时不考虑上下键选择节点回车选中
		//myTree.selectNode(myTree.getNodes()[0]);
		
		key = $("#"+treeId+"-key");
		key.bind("focus", focusKey)
		.bind("blur", blurKey)
		.bind("input", searchNode)
		.bind("keyup", searchNode);
		
		//将已创建的标签在树节点上标记选中
		var ulDom = $("#"+treeId).parent("div.rpt-tree-data").siblings("div.rpt-tree-view").find("ul.rpt-tags-list");
		var liArr = [];
		$(ulDom).find("li").not("li.rpt-li-over").each(function(){
			liArr.push($(this).find("span").text());
		})
		if(liArr.length>0){
			for(var i=0;i<liArr.length;i++){
				var thisNode = myTree.getNodeByParam("name",liArr[i],null);
				myTree.checkNode(thisNode, true, true)
			}
		}
		
		//console.info(myTree.getCheckedNodes(true).length);
		if(rpt.rptType=="GL_RPT_BAL" && myTree.getCheckedNodes(true).length=="0" && treeId=="ACCO-data"){
			myTree.checkAllNodes(true);
			var allCheckNodes = myTree.getCheckedNodes(true);
			var num = allCheckNodes.length;
			var newLi = '<li><span data-code="'+allCheckNodes[0].id+'" title="'+allCheckNodes[0].name+'">'+allCheckNodes[0].name+'</span><b class="glyphicon icon-close"></b></li>';
			len = ($(newLi).find("span").text().length * 14)+34;
			var ulDom = $("#"+treeId).parent("div.rpt-tree-data").siblings("div.rpt-tree-view").find("ul.rpt-tags-list");
			var numDom = $(ulDom).siblings("div.rpt-tags-num").find("span");
			$(ulDom).css("width",len+"px");
			$(ulDom).siblings(".rpt-p-search-key").css("width",(288-len)+"px");
			$(ulDom).find("li.rpt-li-over").before($(newLi));
			$(numDom).text(num);
			$(numDom).parent("div.rpt-tags-num").show();
		}
		
		
		//删除select标签
		$(".rpt-query-li-selete .rpt-tags-list").on("click","b.icon-close",function(){
			rpt.deleteSelete(this,myTree);
			zTreeOnCheck(event, treeId, myTree);
		});
		
		//回车删除标签节点
		$(key).keydown(function(e){
			
			if(e.keyCode==8){
				
					console.info("back");
					if($(key).val() == ""){
						var numDom = $("#"+treeId).parents(".rpt-query-li-selete").find(".rpt-tags-num");
						var tagsUl = $("#"+treeId).parents(".rpt-query-li-selete").find(".rpt-tags-list");
						var len = $(tagsUl).find("li").length;
						console.info(len);
						if(len>1){
							var that = $(tagsUl).find("li").eq(length-2).find("b.icon-close");
							console.info($(tagsUl).find("li").eq(length-2).find("span").text());
							rpt.deleteSelete(that,myTree);
							zTreeOnCheck(event, treeId, myTree);
							return false;
						}else{
							return false;
						}
					}
			}
		});
		
	});
	
	return myTree;
};

//返回需要需要显示辅助项的HTML
rpt.queryInputHtml=function(liArr){
	var inputHtml = "";
	var tagHtml = "";
	var tipHtml = "";
	var liHtml = "";
	var liHtml0 ='<li class="rpt-query-box-li rpt-query-box-li0">'+
					'<label class="rpt-query-li-cont-title"><span title="<%=name%>" data-pos="<%=pos%>" data-dir="<%=dir%>" data-seq="<%=seq%>" data-code="<%=code%>" id="<%=code%>"><%=name%></span>：</label>'+
					'<div class="rpt-query-li-cont">'+
						'<div class="rpt-query-li-selete">'+
							'<div class="rpt-tree-view bordered-input">'+
								'<ul class="rpt-tags-list">';
					 	var liHtml1 ='<li class="rpt-li-over" style="display:none;">...</li>'+
								'</ul>'+
								'<p class="rpt-p-search-key">'+
									'<input type="text" id="<%=code%>-data-key">'+
								'</p>'+
								'<div class="rpt-tags-num" style="display:none;">(<span><%=num%></span>)</div>'+
							'</div>'+
							'<div class="rpt-tree-data bordered-input" style="display:none;">'+
								'<ul id="<%=code%>-data" class="ufmaTree ztree"></ul>'+
							'</div>'+
						'</div>'+
						'<div class="rpt-query-li-tip">'+
							'<span class="rpt-query-li-tip-t">推荐：</span>'+
							'<span class="rpt-query-li-tip-c" id="<%=code%>Tips" data-item="<%=code%>">';
								
				var liHtml2='</span>'+
						'</div>'+
					'</div>'+
				'</li>';
	
	for(var i=0;i<liArr.length;i++){
		tagHtml = "";
		if(liArr[i].items.length>0){
			for(var j=0;j<liArr[i].items.length;j++){
				var th = ufma.htmFormat('<li><span data-code="<%=tagCode%>" title="<%=tagName%>"><%=tagName%></span><b class="glyphicon icon-close"></b></li>',{
							tagCode:liArr[i].items[j].code,
							tagName:liArr[i].items[j].name
						});
						
				tagHtml += th;
			}
		}
		//console.info(tagHtml);
		
		tipHtml = "";
		if(liArr[i].tips != null && liArr[i].tips.length>0){
			for(var j=0;j<liArr[i].tips.length;j++){
				var ih = ufma.htmFormat('<i title="<%=tipName%>" data-code="<%=tipCode%>" ><%=tipName%></i>',{
							tipCode:liArr[i].tips[j].chrCode,
							tipName:liArr[i].tips[j].chrName
						});
						
				tipHtml += ih;
			}
		}
		
		liHtml = liHtml0+tagHtml+liHtml1+tipHtml+liHtml2;
		var bh = ufma.htmFormat(liHtml,{
				dir:liArr[i].itemDir,
				seq:liArr[i].seq,
				pos:liArr[i].itemPos,
				name:liArr[i].itemTypeName,
				code:liArr[i].itemType,
				num:liArr[i].items.length
			});
		inputHtml += bh;
	}
	return inputHtml;
};

//返回当前选中的科目范围
rpt.checkItemTags=function(itemCode){
	var tags = $("#"+itemCode+"-data-key").parent("p.rpt-p-search-key").siblings("ul.rpt-tags-list").find("li");
	var itemCodeRange = "";//选中科目范围
	if(tags.length>1){
		for(var i=0;i<tags.length-1;i++){
			itemCodeRange += ","+tags.eq(i).find("span").data("code");
		}
		itemCodeRange = itemCodeRange.substr(1);
	}else{
		itemCodeRange = "0";
	}
	return itemCodeRange;
};

//展开隐藏共享查询方案
rpt.showHideShareMethod=function(){
	$(rpt.namespace).on("click","#showMethodTip",function(){
		rpt.reqSharePrjList();
		$(this).siblings("div.rpt-share-method-box").show();
	});
	$(rpt.namespace).on("click",function(e){
		if($(e.target).closest("#showMethodTip").length == 0 && $(e.target).closest("div.rpt-share-method-box").length == 0){
	   		$("div.rpt-share-method-box").hide();
        }
	});
	$(rpt.namespace).on("mouseenter","div.rpt-share-method-box",function(){
		$(this).show();
	}).on("mouseleave","div.rpt-share-method-box",function(){
		$(this).hide();
	});
};

//展开隐藏-设置查询条件
rpt.showHideSettingBox=function(){
	$(rpt.namespace).find("#rpt-chr-setting-btn").on("click",function(){
		$(rpt.namespace).find("div.rpt-chr-setting-box").show();
	});
	$(rpt.namespace).find(".rpt-chr-setting-box .icon-close,.rpt-chr-setting-box .btn-default").on("click",function(){
		$(rpt.namespace).find("div.rpt-chr-setting-box").hide();
	});
	$(rpt.namespace).on("click",function(e){
		if($(e.target).closest("#rpt-chr-setting-btn").length == 0 && $(e.target).closest("div.rpt-chr-setting-box").length == 0){
	   		$("div.rpt-chr-setting-box").hide();
        }
	});
};

//显示更多查询方案
rpt.showMoreMethod=function(){
	$(rpt.namespace).on("click","div.rpt-method-more",function(){
		//$(".rpt-method-box-cont").addClass("rpt-method-box-cont-show").animate({"height":($(".rpt-method-list").height()+9)+"px"});
		$(".rpt-method-box-cont").addClass("rpt-method-box-cont-show").css({"height":($(".rpt-method-list").height()+9)+"px","padding-left":"76px"});
		$("ul.method-list").css({"margin-left":"43px"});
		$(".rpt-method-title").css({"left":"8px"});
		$(this).hide();
	});
	$(rpt.namespace).on("mouseenter",".rpt-method-box-cont-show",function(){
		$(this).show();
	})
	.on("mouseleave",".rpt-method-box-cont-show",function(){
		$(this).removeClass("rpt-method-box-cont-show").css({"height":"40px","padding-left":"68px"});
		$("ul.rpt-method-list").css({"margin-left":"-32px"});
		$(".rpt-method-title").css({"left":"0px"});
		rpt.moreMethodBtn("rpt-method-list","rpt-method-more");
	});
};

//打开-保存查询方案模态框
rpt.openSaveMethodModal=function(){
	$(rpt.namespace).find('#saveMethod').on('click',function(){
		var meLi = $(rpt.namespace).find(".rpt-method-list li.isUsed");
		if($(meLi).length>0){
			var code = $(meLi).find("span").data("code");
			var name = $(meLi).find("span").text();
			var scope = $(meLi).find("span").data("scope");//作用域
			$(".rpt-radio-span").eq(scope-1).find("input").attr("checked");
			$(".rpt-radio-span").eq(scope-1).siblings().find("input").removeAttr("checked");
			
		}else{
			$("#methodName").val("").attr("data-code","");
			$(".rpt-radio-span").eq(0).find("input").attr("checked");
			$(".rpt-radio-span").eq(0).siblings().find("input").removeAttr("checked");
		}
		
		rpt.setQuery = ufma.showModal('saveMethod-box',600,320);
	});
	$(rpt.namespace).find('.btn-close').on('click',function(){
		rpt.setQuery.close();
	});
};

//输入方案名的提示
rpt.methodNameTips=function(){
	$(rpt.namespace).find('#methodName').on('focus',function(){
		ufma.hideInputHelp('methodName');
		$('#methodName').closest('.form-group').removeClass('error');
	}).on("blur",function(){
		if($("#methodName").val().trim() == ""){
			ufma.showInputHelp('methodName','<span class="error">方案名称不能为空</span>');
			$('#methodName').closest('.form-group').addClass('error');
		}
	});
};

//返回账表其他选项的数组对象
rpt.rptOptionArr = function(){
	var rptOptionArr = [];
	var labelDom;
	if(rpt.rptType == "GL_RPT_VOUSUMMARY"){
		labelDom = $(rpt.namespace).find(".rpt-check");
	}else{
		labelDom = $(rpt.namespace).find(".rpt-query-li-check label");
	}
	$(labelDom).each(function(){
		var rptOptionObj = {};
		
		var flag = $(this).find("input").prop("checked");
		if(flag){
			rptOptionObj.defCompoValue = "Y";
		}else{
			rptOptionObj.defCompoValue = "N";
		}
		
		rptOptionObj.optCode = $(this).find("input").attr("id");
		rptOptionObj.optName = $(this).text();
		
		rptOptionArr.push(rptOptionObj);
		
	})
	
	return rptOptionArr;
};

//返回辅助项的数组对象
rpt.qryItemsArr = function(){
	var qryItemsArr = [];
	$(rpt.namespace).find(".rpt-query-box-li0").each(function(i){
		var qryItemsObj = {};
		
		if(i=="0" && rpt.rptType == "GL_RPT_JOURNAL"){
			qryItemsObj.itemDir =  $(rpt.namespace+" #selectTitle").data("dir");
			qryItemsObj.itemPos =  $(rpt.namespace+" #selectTitle").data("pos");
			qryItemsObj.itemType = $(rpt.namespace+" #selectTitle").val();
			qryItemsObj.itemTypeName = $(rpt.namespace+" #selectTitle").find("option:checked").text();
		}else if(i=="0" && rpt.rptType == "GL_RPT_COLUMNAR"){
			qryItemsObj.itemDir =  $(rpt.namespace+" .rpt-btn-switch .btn-primary").attr("data-code");
			qryItemsObj.itemPos =  "row";
			qryItemsObj.itemType = $(rpt.namespace+" #selectTitle").val();
			qryItemsObj.itemTypeName = $(rpt.namespace+" #selectTitle").find("option:checked").text();
		}else{
			var spanDom = $(this).find(".rpt-query-li-cont-title span");
			qryItemsObj.itemDir =  $(spanDom).data("dir");//展开方向(仅当位置为列时，有效);('dr','cr','dbl')
			qryItemsObj.itemPos =  $(spanDom).data("pos");//核算项数据位置（行、列）
			qryItemsObj.itemType = $(spanDom).data("code");//核算项类别代码
			qryItemsObj.itemTypeName = $(spanDom).text();//核算项类别名称
		}
		
		qryItemsObj.seq = i;//核算项类别顺序号
		
		qryItemsObj.items = [];//选择的核算项的值
		var tagsLiDom = $(this).find(".rpt-tags-list li");
		if(tagsLiDom.length>1){
			for(var i=0;i<tagsLiDom.length-1;i++){
				var itemObj = {};
				itemObj.code = $(tagsLiDom).eq(i).find("span").data("code").toString();
				itemObj.name = $(tagsLiDom).eq(i).find("span").text();
				qryItemsObj.items.push(itemObj);
			}
		}
		
		qryItemsArr.push(qryItemsObj);
		
	})
	
	return qryItemsArr;
};

//返回方案内容对象
rpt.prjContObj = function(){
	//方案内容
	prjContObj = {};
	
	//会计体系代码
	prjContObj.accaCode = $(rpt.namespace+" #accaList").find(".btn-primary").data("code");
	
	//选择的单位账套信息
	prjContObj.agencyAcctInfo = [];
	var treeObj = $.fn.zTree.getZTreeObj("atree");
	var nodes = treeObj.getCheckedNodes(true);//获取选中的单位账套
	console.info(nodes);
	var acctArr = [];
	for(var i=0;i<nodes.length;i++){
		if(nodes[i] == "true"){
			acctArr.push(nodes[i]);
		}
	}
	for(var i=0;i<acctArr.length;i++){
		var acctInfoObj = {};
		acctInfoObj.acctCode = acctArr[i].acctCode;//账套代码
		var pnode = treeObj.getNodeByParam("id", acctArr[i].pId, null);
		acctInfoObj.agencyCode = pnode.agencyCode;//单位代码
		prjContObj.agencyAcctInfo.push(acctInfoObj);
	}
	
	prjContObj.startDate = "";//起始日期(如2017-01-01)
	prjContObj.endDate = "";//截止日期(如2017-01-01)
	
	prjContObj.startYear = $(rpt.namespace+" #dateStart").datetimepicker('getDate').getFullYear();//起始年度(只有年，如2017)
	prjContObj.startFisperd = $(rpt.namespace+" #dateStart").datetimepicker('getDate').getMonth()+1;//起始期间(只有月份，如7)
	prjContObj.endYear = $(rpt.namespace+" #dateEnd").datetimepicker('getDate').getFullYear();//截止年度(只有年，如2017)
	prjContObj.endFisperd = $(rpt.namespace+" #dateEnd").datetimepicker('getDate').getMonth()+1;//截止期间(只有月份，如7)
	
	//核算项设置
	prjContObj.qryItems = rpt.qryItemsArr();

	//查询条件对象
	var isShowAgency = $("#isShowAgency").prop("checked");
	if(isShowAgency){
		isShowAgency = "1";
	}else{
		isShowAgency = "0";
	}
	var isShowAcct = $("#isShowAcct").prop("checked");
	if(isShowAcct){
		isShowAcct = "1";
	}else{
		isShowAcct = "0";
	}
	prjContObj.rptCondItem = [
		{
			"condCode":"isShowAgency",
			"condName":"显示单位",
			"condText":"",
			"condValue":isShowAgency
		},
		{
			"condCode":"isShowAcct",
			"condName":"显示账套",
			"condText":"",
			"condValue":isShowAcct
		}
	];
	
	//账表查询项
	prjContObj.rptOption = rpt.rptOptionArr();
	
	prjContObj.curCode = "";//币种代码
	prjContObj.rptStyle = "";//账表样式
	
	prjContObj.rptTitleName = $(rpt.namespace+" .rpt-table-title-show span").text();//账表中标题名称
	
	return prjContObj;
};

//根据会计科目范围实时改变选中的辅助项(余额表)
rpt.changeItems=function(){
	var accItemArgu = {
		"setYear":rpt.nowSetYear,
	};
	ufma.ajax(rpt.portList.rptAccItemTypeList,"get",accItemArgu,rpt.isShowItems);
};

//回调函数——改变选中的辅助项目
rpt.isShowItems=function(result){
	var data = result.data.tips;
	var codeArr = [];
	for(var i=0;i<data.length;i++){
		codeArr.push(data[i].accItemType);
	}
	
	var topLi = $(".rpt-query-box-top").find("li.rpt-query-box-li");
	if(topLi.length>1){
		for(var i=1;i<topLi.length;i++){
			var code = $(topLi).eq(i).find("label span").data("code");
			if($.inArray(code, codeArr) == "-1"){
				$(topLi).eq(i).remove();
			}
//			else if(code != "ACCO"){
//				$(topLi).eq(i).find(".rpt-tags-list").html('<li class="rpt-li-over" style="display:none;">...</li>');
//				$(topLi).eq(i).find(".rpt-tags-num").hide().html('(<span>0</span>)');
//			}
		}
	}
	var bottomLi = $(".rpt-query-box-bottom").find("li.rpt-query-box-li");
	if(bottomLi.length>2){
		for(var i=0;i<bottomLi.length-2;i++){
			var code = $(bottomLi).eq(i).find("label span").data("code");
			if($.inArray(code, codeArr) == "-1"){
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

//----------------------单位账套树 start-------------------------//
//请求单位账套树
rpt.atreeData=function(){
	var argu = {
		"setYear":rpt.nowSetYear,
		"rgCode":rpt.rgCode,
	};
	ufma.ajax(rpt.portList.getAgencyAcctTree,"get",argu,function(result){
		var atreeArr = result.data;
		var znodes = [];
		for(var i=0;i<atreeArr.length;i++){
			var nodeObj = {};
			nodeObj.id = atreeArr[i].id;
			nodeObj.pId = atreeArr[i].pId;
			nodeObj.name = atreeArr[i].name;
			nodeObj.title = atreeArr[i].name;
			nodeObj.isAcct = atreeArr[i].isAcct;
			nodeObj.agencyCode = atreeArr[i].agencyCode;
			nodeObj.agencyName = atreeArr[i].agencyName;
			nodeObj.acctCode = atreeArr[i].acctCode;
			nodeObj.acctName = atreeArr[i].acctName;
			znodes.push(nodeObj);
		}
		rpt.atree(znodes);
//		rpt.clickAtree(rpt.nowAgencyCode,rpt.nowAgencyName,rpt.nowAcctCode,rpt.nowAcctName);
	})
};
//----------------------单位账套树 end-----------------------------//

//----------------------科目推荐列表 start-----------------------//
//请求函数——科目推荐列表
rpt.reqItemTip=function(eleCode){
	var accoArgu = {
			"agencyCode":rpt.nowAgencyCode,
			"acctCode":rpt.nowAcctCode,
			"eleCode":eleCode,
			"userId":rpt.nowUserId,
			"setYear":rpt.nowSetYear
		};
	ufma.ajax(rpt.portList.tipsList,"get",accoArgu,rpt.showTipsList);
};
//回调函数——科目推荐列表
rpt.showTipsList=function(result){
	//console.info(JSON.stringify(result));
	var eleCode = result.data.eleCode;
	var list = result.data.tipsData;
	var spanHtml = "";
	for(var i=0;i<2;i++){
		//console.info(JSON.stringify(list[i]));
		//console.info(list[i].chrName);
		var iHtml = ufma.htmFormat('<i title="<%=name%>" data-code="<%=code%>" ><%=name%></i>',{code:list[i].chrCode,name:list[i].chrName});
		spanHtml += iHtml;
	}
	$("#"+eleCode+"Tips").html(spanHtml);
};
//----------------------科目推荐列表end-------------------------//

//----------------------会计体系列表start-----------------------//
//请求函数——会计体系列表
rpt.reqAccaList=function(){
	var argu = {
			"setYear":rpt.nowSetYear	
	}
	ufma.ajax(rpt.portList.accaList,"get",argu,rpt.showAccaList);
};
//回调函数——会计体系列表
rpt.showAccaList=function(result){
	var list = result.data;
	var divHtml = "";
	for(var i=0;i<list.length;i++){
		var btn = ufma.htmFormat('<button class="btn btn-default" data-code="<%=code%>"><%=name%></button>',{code:list[i].accaCode,name:list[i].accaName});
		divHtml += btn;
	}
	
	divHtml = '<button class="btn btn-primary" data-code="*">全部</button>' + divHtml;
	$("#accaList").html(divHtml);

};
//----------------------会计体系列表end-------------------------//

//----------------------查询方案列表 start------------------------//
//请求函数——查询方案列表
rpt.reqPrjList=function(){
	var prjArgu = {
			"agencyCode":rpt.nowAgencyCode,
			"acctCode":rpt.nowAcctCode,
			"rptType":rpt.rptType,
			"userId":rpt.nowUserId,
			"setYear":rpt.nowSetYear
		};
	ufma.ajax(rpt.portList.prjList,"get",prjArgu,rpt.showPrjList);
};
//回调函数——查询方案列表
rpt.showPrjList=function(result){
	var prjList = result.data;
	var methodHtml = "";
	for(var i=0;i<prjList.length;i++){
		var liHtml = ufma.htmFormat('<li><span data-code="<%=code%>" data-scope="<%=scope%>"><%=name%></span><b class="glyphicon icon-close"></b></li>',{
					code:prjList[i].prjCode,
					name:prjList[i].prjName,
					scope:prjList[i].prjScope
				});
		methodHtml += liHtml;
	}
	$(".rpt-method-list").html(methodHtml);
	
	//判断更多查询方案按钮是否显示
	rpt.moreMethodBtn("rpt-method-list","rpt-method-more");
};
//----------------------查询方案列表 end-------------------------//

//----------------------共享方案列表 start------------------------//
//请求函数——共享方案列表
rpt.reqSharePrjList=function(){
	var prjArgu = {
			"agencyCode":rpt.nowAgencyCode,
			"acctCode":rpt.nowAcctCode,
			"rptType":rpt.rptType,
			"userId":rpt.nowUserId,
			"setYear":rpt.nowSetYear
		};
	ufma.ajax(rpt.portList.sharePrjList,"get",prjArgu,rpt.showSharePrjList);
};
//回调函数——共享方案列表
rpt.showSharePrjList=function(result){
	var prjList = result.data;
	var methodHtml = "";
	if(prjList.length>0){
		$(".rpt-method-tip").find("i").css("display","inline-block");
		for(var i=0;i<prjList.length;i++){
			var liHtml = ufma.htmFormat('<li><span title="<%=name%>" data-scope="<%=scope%>"><%=name%></span><button class="btn btn-default" data-code="<%=code%>">使用</button></li>',{
						code:prjList[i].prjCode,
						name:prjList[i].prjName,
						scope:prjList[i].prjScope
					});
			methodHtml += liHtml;
		}
		$(".rpt-share-method-box-body ul").html(methodHtml);
		$(".rpt-share-method-box-top span").text(prjList.length);
	}else{
		$(".rpt-method-tip").find("i").css("display","none");
	}
};
//----------------------共享方案列表 end-------------------------//

//----------------------请求查询条件其他选项列表 start---------------//
//请求函数——请求查询条件其他选项列表
rpt.reqOptList=function(){
	ufma.ajax(rpt.portList.optList,"get",{"rptType":"GL_RPT_BAL","userId":rpt.nowUserId,"setYear":rpt.nowSetYear},rpt.showOptList);
};
//回调函数——请求查询条件其他选项列表
rpt.showOptList=function(result){
	var optArr = result.data;
	var checkHtml = "";
	for(var i=0;i<optArr.length;i++){
		var bool = optArr[i].defCompoValue;
		var defaultChecked = false;
		if(bool == "Y"){
			defaultChecked = "checked";
		}else if(bool == "N"){
			defaultChecked = "";
		}
		var lab = ufma.htmFormat('<label class="mt-checkbox mt-checkbox-outline"><input type="checkbox" <%=flag%> id="<%=id%>" ><%=name%><span></span></label>',{
					flag:defaultChecked,
					name:optArr[i].optName,
					id:optArr[i].optCode
				});
		checkHtml += lab;
	}
	$(".rpt-query-li-check").html(checkHtml);
	
};
//----------------------请求查询条件其他选项列表 end-----------------//

//----------------------请求会计科目树 辅助项目树 start---------------//
//请求函数——请求会计科目树
rpt.reqAccoTree=function(){
	//会计体系代码
	var accsCode = $(".rpt-accs-btn").find("button.btn-primary span").data("code");
	var treeArgu = {
		"accsCode":accsCode,
		"setYear":rpt.nowSetYear,
		"rgCode": rpt.rgCode
	};
	ufma.ajax(rpt.portList.accoTree,"get",treeArgu,rpt.resCreateTree);
};
//请求函数——辅助项目树
rpt.reqAccItemTree=function(accItemType){
	var treeArgu = {
		"accItemType":accItemType,
		"setYear":rpt.nowSetYear,
	};
	ufma.ajax(rpt.portList.accItemTree,"get",treeArgu,rpt.resCreateTree);
};
//回调函数——创建返回树
rpt.resCreateTree=function(result){
	var zNodes = result.data.treeData;
	var treeId = result.data.treeId+"-data";
	rpt.selectTree(treeId,zNodes);
	
	$("#"+treeId).parent("div.rpt-tree-data").show();
	$("#"+treeId+"-key").focus();
	
	var zNodesStr = JSON.stringify(zNodes);
	var treeKey=ufma.sessionKey(rpt.module,rpt.compoCode,rpt.rgCode,rpt.nowSetYear,rpt.nowAgencyCode,rpt.nowAcctCode,rpt.namespace+result.data.treeId);
	sessionStorage.setItem(treeKey,zNodesStr);
	rpt.sessionKeyArr.push(treeKey);

};
//----------------------请求会计科目树 辅助项目树 end-----------------//

//----------------------保存方案 start--------------------------//
//请求函数——请求保存方案
rpt.reqSavePrj=function(){
	var savePrjArgu={};
	
	savePrjArgu.acctCode = rpt.nowAcctCode;//账套代码
	savePrjArgu.agencyCode = rpt.nowAgencyCode;//单位代码
	
	savePrjArgu.prjCode = $("#methodName").data("code");//方案代码
	savePrjArgu.prjName = $("#methodName").val();//方案名称
	savePrjArgu.prjScope = $('input:radio[name="prjScope"]:checked').val()//方案作用域
	savePrjArgu.rptType = $(".rptType").val();//账表类型
	savePrjArgu.setYear = rpt.nowSetYear;//业务年度
	savePrjArgu.userId = rpt.nowUserId;//用户Id
	
	//方案内容
	//savePrjArgu.prjContent = JSON.stringify(rpt.prjContObj());
	savePrjArgu.prjContent = rpt.prjContObj();

	console.info(JSON.stringify(savePrjArgu));
	ufma.ajax(rpt.portList.savePrj,"post",savePrjArgu,rpt.resSavePrj);
};
//回调函数——请求保存方案
rpt.resSavePrj=function(result){
	var flag = result.flag;
	var prjCode = result.data.prjCode;
	var prjScope = result.data.prjScope;
	if(flag == "success"){
		var meLi = $(".rpt-method-list li.isUsed");
		if($(meLi).length>0){
			var name = $(meLi).find("span").text($("#methodName").val().trim());
		}else{
			var newMethod = '<li><span data-code="'+prjCode+'" data-scope="'+prjScope+'">'+$("#methodName").val().trim()+'</span><b class="glyphicon icon-close"></b></li>';
			$('.rpt-method-list').append($(newMethod));
		}
		
		rpt.setQuery.close();
		rpt.moreMethodBtn("rpt-method-list","rpt-method-more");
		ufma.showTip("查询方案保存成功！",function(){},"success");
	}else{
		ufma.alert(result.msg,"error");
		return false;
	}
};
//----------------------保存方案 end----------------------------//

/**账表页面的相关绑定操作**********************************************************************/
//按钮提示
rpt.tooltip = function(){
	$("[data-toggle='tooltip']").tooltip();
};

//查询条件框--展开更多查询
rpt.queryBoxMore = function(){
	$(rpt.namespace).find('.rpt-tip-more').on('click',function(){
		if($(this).find("i").text() == "更多"){
			$(this).find("i").text("收起");
			$(this).find("span").removeClass("icon-angle-bottom").addClass("icon-angle-top");
			$(".rpt-query-box-bottom").slideDown();
			if(rpt.rptType == "GL_RPT_CHRBOOK"){
				$(rpt.namespace).find(".rpt-chr-setting").show();
			}
		}else{
			$(this).find("i").text("更多");
			$(this).find("span").removeClass("icon-angle-top").addClass("icon-angle-bottom");
			$(".rpt-query-box-bottom").slideUp();
			if(rpt.rptType == "GL_RPT_CHRBOOK"){
				$(rpt.namespace).find(".rpt-chr-setting").hide();
			}
		}
	});
};

//编辑表格名称
rpt.editTableTitle = function(){
	$(rpt.namespace).find(".rpt-table-title-show").on("mouseenter",function(){
		$("#show-edit").show();
	}).on("mouseleave",function(){
		$("#show-edit").hide();
	}).on("click",function(){
		$(this).hide();
		$(".rpt-table-title-edit").show().find("input").focus().val($(this).find("span").text());
	});
	$(rpt.namespace).find(".rpt-table-title-edit").on("focus","input",function(){
		$(".rpt-table-title-show").hide();
		$(this).keydown(function(e){
			var name = $(this).val();
			if(name != "" && e.keyCode==13){
				$("#show-edit,.rpt-table-title-edit").hide();
				$(".rpt-table-title-show").find("span").text(name);
				$(".rpt-table-title-show").show();
				$("#show-edit").hide();
			}
		});
		
	}).on("blur","input",function(){
		var name = $(this).val();
		if(name != ""){
			$("#show-edit,.rpt-table-title-edit").hide();
			$(".rpt-table-title-show").find("span").text(name);
			$(".rpt-table-title-show").show();
		}else{
			ufma.alert("表格名称不能为空！","warning");
			return false;
		}
	});
};

//改变金额单位（需要一直保留两位小数点，借贷还必须平衡，暂时不实现）
rpt.changeMonetaryUnit = function(){
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
rpt.searchHideShow = function(selector){
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
	var searchKey=ufma.sessionKey(rpt.module,rpt.compoCode,rpt.rgCode,rpt.nowSetYear,rpt.nowAgencyCode,rpt.nowAcctCode,rpt.namespace+"_searchKey");
	
	$(".searchHide").focus(function(){
		$(this).keydown(function(e){
			var val = $(this).val();
			if(e.keyCode==13){
				$(selector).DataTable().search(val).draw();
				sessionStorage.removeItem(searchKey);
			}
		});
	});
	$("#searchHideBtn").on("click",function(evt){
		evt.stopPropagation();
		if($(".searchHide").hasClass("focusOff")){
			var newVal = sessionStorage.getItem(searchKey);
			if(newVal != ""){
				$(".searchHide").val(newVal);
			}
			$(".searchHide").show().animate({"width":"160px"}).focus().removeClass("focusOff");
		}else{
			sessionStorage.removeItem(searchKey);
			
			var val = $(this).siblings("input[type='text']").val();
			$(selector).DataTable().search(val).draw();

			sessionStorage.setItem(searchKey,val);
			rpt.sessionKeyArr.push(searchKey);
		}
	});
	$(".iframeBtnsSearch").on("mouseleave",function(){
		if(!$(".searchHide").hasClass("focusOff") && $(".searchHide").val() == ""){
			$(".searchHide").animate({"width":"0px"},"","",function(){
				$(".searchHide").css("display","none");
			}).addClass("focusOff");
		}
	});
};

//模糊单项选择
rpt.oneSearch = function(selector){
	$("input").on("focus,click",function(evt){
		evt.stopPropagation();
	});
	
	//$(rpt.namespace).find(".rpt-table-tab").on("click",".rpt-oneSearch",function(){
	$(".rpt-oneSearch").on("click",function(){
		var i = $(this).siblings("input").eq(0).attr("col-index");
		
		var type = $(".change-rpt-type select").val();
		var oneKey=ufma.sessionKey(rpt.module,rpt.compoCode,rpt.rgCode,rpt.nowSetYear,rpt.nowAgencyCode,rpt.nowAcctCode,rpt.namespace+"_"+type+"_"+i+"_oneKey");
		sessionStorage.removeItem(oneKey);
		
		var columns = $(selector).DataTable().columns(i);
		var val = $.fn.dataTable.util.escapeRegex($(this).siblings("input").val());
		columns.search(val, false, false).draw();
		if(val != ""){
			$(this).parents("th").find("span.thTitle").css("color","#108EE9");
			$(this).parents("th").find("span.rpt-funnelBtn").css("color","#108EE9");
		}else{
			$(this).parents("th").find("span.thTitle").css("color","");
			$(this).parents("th").find("span.rpt-funnelBtn").css("color","");
		}
		$(this).parent(".rpt-funnelBox").hide();
		
		sessionStorage.setItem(oneKey,val);
		rpt.sessionKeyArr.push(oneKey);
	})
	
	$(rpt.namespace+" .rpt-funnelCont .rpt-txtCont").eq(0).on("focus",function(){
		$(this).keydown(function(e){
			var val = $(this).val();
			if(e.keyCode==13){
				//$(".rpt-oneSearch").trigger("click");
				
				var i = $(this).attr("col-index");
				
				var type = $(".change-rpt-type select").val();
				var oneKey=ufma.sessionKey(rpt.module,rpt.compoCode,rpt.rgCode,rpt.nowSetYear,rpt.nowAgencyCode,rpt.nowAcctCode,rpt.namespace+"_"+type+"_"+i+"_oneKey");
				sessionStorage.removeItem(oneKey);
				
				var columns = $(selector).DataTable().columns(i);
				var val = $.fn.dataTable.util.escapeRegex($(this).val());
				columns.search(val, false, false).draw();
				if(val != ""){
					$(this).parents("th").find("span.thTitle").css("color","#108EE9");
					$(this).parents("th").find("span.rpt-funnelBtn").css("color","#108EE9");
				}else{
					$(this).parents("th").find("span.thTitle").css("color","");
					$(this).parents("th").find("span.rpt-funnelBtn").css("color","");
				}
				$(this).parent(".rpt-funnelBox").hide();
				
				sessionStorage.setItem(oneKey,val);
				rpt.sessionKeyArr.push(oneKey);
			}
		});
	});
};

//单列范围筛选
rpt.twoSearch = function(selector){
	$("input").on("focus,click",function(evt){
		evt.stopPropagation();
	});
	$(rpt.namespace+" .rpt-numCont").on("keyup",function(){
		$(this).val($(this).val().replace(/[^\d\.\-]/g,''));
	});
	$(rpt.namespace+" .rpt-numCont").on("blur",function(){
		var num = $(this).val().replace(/\,/g, "");
		if(num !=""){
			var ret1 = /^-?([1-9]\d*\.\d*|0\.\d*[1-9]\d*|0?\.0+|0)$/;
			var ret2 = /^-?[1-9]\d*$/;
	      	if(ret1.test(num) || ret2.test(num)){
				$(this).val(rpt.comdify(parseFloat(num).toFixed(2)));
			}else{
				ufma.alert("请输入合法的数字！","error");
				return false;
			}
		}
	});
	
	$(".rpt-twoSearch").on("click",function(){
		var i = $(this).siblings("input").eq(0).attr("col-index");
		
		var type = $(".change-rpt-type select").val();
		var twoKey1=ufma.sessionKey(rpt.module,rpt.compoCode,rpt.rgCode,rpt.nowSetYear,rpt.nowAgencyCode,rpt.nowAcctCode,rpt.namespace+"_"+type+"_"+i+"_twoKey1");
		var twoKey2=ufma.sessionKey(rpt.module,rpt.compoCode,rpt.rgCode,rpt.nowSetYear,rpt.nowAgencyCode,rpt.nowAcctCode,rpt.namespace+"_"+type+"_"+i+"_twoKey2");
		sessionStorage.removeItem(twoKey1);
		sessionStorage.removeItem(twoKey2);
		
		var val1 = $.fn.dataTable.util.escapeRegex($(this).siblings("input").eq(0).val());
		var val2 = $.fn.dataTable.util.escapeRegex($(this).siblings("input").eq(1).val());
		var columns = $(selector).DataTable().columns(i);
		var numVal1 = "";
		var numVal2 = "";

		if(val1 == "" && val2 != ""){
			numVal1 = -Number.MAX_VALUE;
			numVal2 = val2.replace(/\,/g, "");
		}else if(val2 == "" && val1 != ""){
			numVal1 = val1.replace(/\,/g, "");
			numVal2 = Number.MAX_VALUE;
		}else if(val1 != "" && val2 != ""){
			numVal1 = val1.replace(/\,/g, "");
			numVal2 = val2.replace(/\,/g, "");
		}
		
		if(val1 != "" || val2 != ""){
			if(val1 == ""){
				val1 = -Number.MAX_VALUE;
			}else if(val2 == ""){
				val2 = Number.MAX_VALUE;
			}
			$.fn.dataTable.ext.search.push(
				function( settings, data, dataIndex ) {
					var colIndex  =  data.length + parseInt(i);
					var min = parseFloat( val1, 10 );
					var max = parseFloat( val2, 10 );
					var col = parseFloat( data[colIndex],10 ) || 0; 
					console.info("min="+min+"---max="+max+"---col="+col);
					if ( ( isNaN( min ) && isNaN( max ) ) ||
						 ( isNaN( min ) && col <= max ) ||
						 ( min <= col   && isNaN( max ) ) ||
						 ( min <= col   && col <= max ) )
					{
						return true;
					}
					return false;
				}
			);
			$(this).parents("th").find("span.thTitle").css("color","#108EE9");
			$(this).parents("th").find("span.rpt-funnelBtn").css("color","#108EE9");
		}else{
			$.fn.dataTable.ext.search.pop();
			$(this).parents("th").find("span.thTitle").css("color","");
			$(this).parents("th").find("span.rpt-funnelBtn").css("color","");
		}
		$(selector).DataTable().draw();
		$(this).parent(".rpt-funnelBox").hide();
		
		sessionStorage.setItem(twoKey1,numVal1);
		sessionStorage.setItem(twoKey2,numVal2);
		rpt.sessionKeyArr.push(twoKey1);
		rpt.sessionKeyArr.push(twoKey2);
	})
	
	$(rpt.namespace+" .rpt-funnelCont .rpt-numCont").eq(1).on("focus",function(){
		$(this).keydown(function(e){
			var val = $(this).val();
			if(e.keyCode==13){
				//$(".rpt-twoSearch").trigger("click");

				var i = $(this).siblings("input").attr("col-index");
				
				var type = $(".change-rpt-type select").val();
				var twoKey1=ufma.sessionKey(rpt.module,rpt.compoCode,rpt.rgCode,rpt.nowSetYear,rpt.nowAgencyCode,rpt.nowAcctCode,rpt.namespace+"_"+type+"_"+i+"_twoKey1");
				var twoKey2=ufma.sessionKey(rpt.module,rpt.compoCode,rpt.rgCode,rpt.nowSetYear,rpt.nowAgencyCode,rpt.nowAcctCode,rpt.namespace+"_"+type+"_"+i+"_twoKey2");
				sessionStorage.removeItem(twoKey1);
				sessionStorage.removeItem(twoKey2);
				
				var val1 = $.fn.dataTable.util.escapeRegex($(this).siblings("input").val());
				var val2 = $.fn.dataTable.util.escapeRegex($(this).val());
				var columns = $(selector).DataTable().columns(i);
				var numVal1 = "";
				var numVal2 = "";
				
				if(val1 == "" && val2 != ""){
					numVal1 = -Number.MAX_VALUE;
					numVal2 = val2.replace(/\,/g, "");
				}else if(val2 == "" && val1 != ""){
					numVal1 = val1.replace(/\,/g, "");
					numVal2 = Number.MAX_VALUE;
				}else if(val1 != "" && val2 != ""){
					numVal1 = val1.replace(/\,/g, "");
					numVal2 = val2.replace(/\,/g, "");
				}
				if(val1 != "" || val2 != ""){
					if(val1 == ""){
						val1 = -Number.MAX_VALUE;
					}else if(val2 == ""){
						val2 = Number.MAX_VALUE;
					}
					$.fn.dataTable.ext.search.push(
						function( settings, data, dataIndex ) {
							var colIndex  =  data.length + parseInt(i);
							var min = parseFloat( val1, 10 );
							var max = parseFloat( val2, 10 );
							var col = parseFloat( data[colIndex],10 ) || 0; 
							if ( ( isNaN( min ) && isNaN( max ) ) ||
								 ( isNaN( min ) && col <= max ) ||
								 ( min <= col   && isNaN( max ) ) ||
								 ( min <= col   && col <= max ) )
							{
								return true;
							}
							return false;
						}
					);
					$(this).parents("th").find("span.thTitle").css("color","#108EE9");
					$(this).parents("th").find("span.rpt-funnelBtn").css("color","#108EE9");
				}else{
					$.fn.dataTable.ext.search.pop();
					$(this).parents("th").find("span.thTitle").css("color","");
					$(this).parents("th").find("span.rpt-funnelBtn").css("color","");
				}
				$(selector).DataTable().draw();
				$(this).parent(".rpt-funnelBox").hide();

				
				sessionStorage.setItem(twoKey1,numVal1);
				sessionStorage.setItem(twoKey2,numVal2);
				rpt.sessionKeyArr.push(twoKey1);
				rpt.sessionKeyArr.push(twoKey2);
			}
		});
	});
};

//会计科目树入参改变，还原查询条件框
rpt.backQuery=function(){
	var eleCode = $("#ACCO").data("code");//会计科目代码
	var accoArgu = {
			"agencyCode":rpt.nowAgencyCode,
			"acctCode":rpt.nowAcctCode,
			"eleCode":eleCode,
			"userId":rpt.nowUserId,
			"setYear":rpt.nowSetYear
		};
	ufma.ajax(rpt.portList.tipsList,"get",accoArgu,rpt.resBackQuery);
	
	//销毁所有树
//	$(".ztree").each(function(){
//		var zId = $(this).attr("id");
//		$.fn.zTree.destroy(zId);
//	});
//	$(".rpt-query-box-li0").remove();
//	$(".rpt-query-box-top").append($(page.ACCOdom));
},

//回调函数——还原查询条件框
rpt.resBackQuery=function(result){
	//销毁所有树
//	$(".ztree:not(#cbAgency_tree)").each(function(){
//		var zId = $(this).attr("id");
//		$.fn.zTree.destroy(zId);
//	});
	
	var list = result.data.tipsData;
	var spanHtml = "";//会计体系推荐
	for(var i=0;i<list.length;i++){
		var iHtml = ufma.htmFormat('<i title="<%=name%>" data-code="<%=code%>" ><%=name%></i>',{code:list[i].chrCode,name:list[i].chrName});
		spanHtml += iHtml;
	}
	
	//会计体系li标签
	var accoHtml = '<li class="rpt-query-box-li rpt-query-box-li0">'+
					'<label class="rpt-query-li-cont-title"><span title="会计科目" data-code="ACCO" id="ACCO">会计科目</span>：</label>'+
					'<div class="rpt-query-li-cont">'+
						'<div class="rpt-query-li-selete">'+
							'<div class="rpt-tree-view bordered-input">'+
								'<ul class="rpt-tags-list">'+
									'<li class="rpt-li-over" style="display:none;">...</li>'+
								'</ul>'+
								'<p class="rpt-p-search-key">'+
									'<input type="text" id="ACCO-data-key">'+
								'</p>'+
								'<div class="rpt-tags-num" style="display:none;">(<span>0</span>)</div>'+
							'</div>'+
							'<div class="rpt-tree-data bordered-input" style="display:none;">'+
								'<ul id="ACCO-data" class="ufmaTree ztree"></ul>'+
							'</div>'+
						'</div>'+
						'<div class="rpt-query-li-tip">'+
							'<span class="rpt-query-li-tip-t">推荐：</span>'+
							'<span class="rpt-query-li-tip-c" id="ACCOTips">'+
								spanHtml+
							'</span>'+
						'</div>'+
					'</div>'+
				'</li>';
	
//	var topLi = $(".rpt-query-box-top").find("li");
//	for(var i=1;i<topLi.length;i++){
//		$(topLi).eq(i).remove();
//	}
//	var bottomLi = $(".rpt-query-box-bottom").find("li");
//	if(bottomLi.length>2){
//		for(var i=0;i<bottomLi.length-2;i++){
//			$(bottomLi).eq(i).remove();
//		}
//	}
	$(".rpt-query-box-li0").remove();
	$(".rpt-query-box-top").append($(accoHtml));
	
	
};

//删除方案
rpt.deleteMethod = function(){
	$(rpt.namespace).find('.rpt-method-list').on('click','b.icon-close',function(){
		var thisMothod = $(this).parent("li");
		var name = $(this).siblings("span").text();
		var pLiFlag = $(this).parent("li").hasClass("isUsed");
		var prjCode = $(this).siblings().data("code");//方案代码
		
		ufma.confirm('您确定要删除 '+name+' 查询方案?',function(action){
			if(action){
				var prjDelArgu = {
					"agencyCode":rpt.nowAgencyCode,
					"prjCode":prjCode,
					"rptType":rpt.rptType,
					"setYear":rpt.nowSetYear,
					"userId":rpt.nowUserId
				};
				ufma.ajax(rpt.portList.deletePrj,"delete",prjDelArgu,function(result){
					var flag = result.flag;
					if(flag == "success"){
						$(thisMothod).remove();
						rpt.moreMethodBtn("rpt-method-list","rpt-method-more");
						ufma.showTip("删除成功！",function(){},"success");
					}
					if(pLiFlag){
						if(rpt.rptType == "GL_RPT_BAL"){
							
							
							var dd = new Date();
							var ddYear = dd.getFullYear();
							$(rpt.namespace).find("#dateStart").datetimepicker('setDate',(new Date(ddYear,0)));
							$(rpt.namespace).find("#dateEnd").datetimepicker('setDate',(new Date()));
							
							rpt.backQuery();
							rpt.reqOptList();
							
						}else if(rpt.rptType == "GL_RPT_JOURNAL" || rpt.rptType == "GL_RPT_COLUMNAR"){
							
							
							var dd = new Date();
							var ddYear = dd.getFullYear();
							$(rpt.namespace).find("#dateStart").datetimepicker('setDate',(new Date(ddYear,0)));
							$(rpt.namespace).find("#dateEnd").datetimepicker('setDate',(new Date()));
							
							//请求科目辅助项下拉列表
							rpt.reqSelectItems();
							rpt.reqOptList();
							
						}else if(rpt.rptType == "GL_RPT_LEDGER" || rpt.rptType == "GL_RPT_DAILYJOURNAL"){
							
							
							var dd = new Date();
							var ddYear = dd.getFullYear();
							$(rpt.namespace).find("#dateStart").datetimepicker('setDate',(new Date(ddYear,0)));
							$(rpt.namespace).find("#dateEnd").datetimepicker('setDate',(new Date()));
							
							//还原查询条件框
							rpt.clearTagsTree();
							rpt.reqOptList();
						}else if(rpt.rptType=="GL_RPT_VOUSUMMARY"){
							
							//还原期间
							rpt.dateBenQi("dateStart","dateEnd");
							//清空填入数据
							$("#rpt-pzzh-input-form,#rpt-pzzh-input-to").val("");
							//还原凭证字号
							$("#rpt-pzzh-select option").eq(0).prop("selected",true);
							//还原凭证来源
							$("#rpt-pzly-select option").eq(0).prop("selected",true);
							//还原汇总方式
							$("#rpt-hzfs-select option").eq(0).prop("selected",true);
							//还原其他check
							rpt.reqOptList();
						}
						
					}
				});
				
			}else{
				
			}
		},{type:'warning'});	
	});
};

//返回账表查询的入参结果集
rpt.backTabArgu = function(){
	var tabArgu = {};
					
	tabArgu.acctCode = rpt.nowAcctCode;//账套代码
	tabArgu.agencyCode = rpt.nowAgencyCode;//单位代码
	
	var meLi = $(rpt.namespace).find(".rpt-method-list li.isUsed");
	var meBtn = $(rpt.namespace).find(".rpt-share-method-box-body .btn.isUsed");
	if($(meLi).length>0){
		tabArgu.prjCode = $(meLi).find("span").data("code");
		tabArgu.prjName = $(meLi).find("span").text();
		tabArgu.prjScope = $(meLi).find("span").data("scope");
	}else if($(meBtn).length>0){
		tabArgu.prjCode = $(meBtn).data("code");
		tabArgu.prjName = $(meBtn).siblings("span").text();
		tabArgu.prjScope = $(meBtn).siblings("span").data("scope");
	}else{
		tabArgu.prjCode = "";//方案代码
		tabArgu.prjName = "";//方案名称
		tabArgu.prjScope = "";//方案作用域
	}
	
	tabArgu.rptType = rpt.rptType;//账表类型
	tabArgu.setYear = rpt.nowSetYear;//业务年度
	tabArgu.userId = rpt.nowUserId;//用户id
	
	tabArgu.prjContent = rpt.prjContObj();//方案内容
	
	return tabArgu;
};

//返回单列筛选html
rpt.backOneSearchHtml = function(title,index){
	var sHtml = '<div class="rpt-funnel">'+
	        		'<span class="glyphicon icon-filter rpt-funnelBtn"></span>'+
	        		'<div class="rpt-funnelBox rpt-funnelBoxText" >'+
	        			'<p class="rpt-funnelTitle">'+
	        				'<span class="rpt-funnelTitle-span1">'+title+'</span>'+
	        				'<span class="rpt-funnelTitle-span2">清空</span>'+
	        				'<span class="rpt-clear"></span>'+
	        			'</p>'+
	        			'<p class="rpt-funnelCont">'+
		        			'<input type="text" class="rpt-txtCont bordered-input" col-index="'+index+'" placeholder="请输入过滤内容"/>'+
		        			'<button class="btn btn-primary rpt-oneSearch">查询</button>'+
	        			'</p>'+
	        		'</div>'+
        		'</div>';
	return sHtml;
}

//返回区间筛选html
rpt.backTwoSearchHtml = function(className,title,index){
	var sHtml = '<div class="rpt-funnel">'+
					'<span class="glyphicon icon-filter rpt-funnelBtn"></span>'+
					'<div class="rpt-funnelBox '+className+'" >'+
						'<p class="rpt-funnelTitle">'+
							'<span class="rpt-funnelTitle-span1">'+title+'</span>'+
							'<span class="rpt-funnelTitle-span2">清空</span>'+
							'<span class="rpt-clear"></span>'+
						'</p>'+
						'<p class="rpt-funnelCont">'+
			    			'<input type="text" class="rpt-numCont bordered-input" col-index="'+index+'" placeholder="0.00"/>'+
			    			'<span>至</span>'+
			    			'<input type="text" class="rpt-numCont bordered-input" col-index="'+index+'" placeholder="0.00"/>'+
			    			'<button class="btn btn-primary rpt-twoSearch">查询</button>'+
						'</p>'+
					'</div>'+
				'</div>';
	return sHtml;
}

//显示/隐藏筛选框
rpt.isShowFunnelBox= function(){
	$(rpt.namespace).on("click",".rpt-funnelBtn",function(evt){
		evt.stopPropagation();
		$("div.rpt-funnelBox").hide();

		var i = $(this).parents("th").find("input").eq(0).attr("col-index");
		var type = $(".change-rpt-type select").val();
		var thTitle = $(this).parents("th").find(".thTitle").text();
		if(thTitle == "摘要"){
			var oneKey=ufma.sessionKey(rpt.module,rpt.compoCode,rpt.rgCode,rpt.nowSetYear,rpt.nowAgencyCode,rpt.nowAcctCode,rpt.namespace+"_"+type+"_"+i+"_oneKey");
			var newVal = sessionStorage.getItem(oneKey);
			if(newVal != "" && newVal != null){
				$(this).parents("th").find("input").eq(0).val(newVal);
			}
		}else{
			var twoKey1=ufma.sessionKey(rpt.module,rpt.compoCode,rpt.rgCode,rpt.nowSetYear,rpt.nowAgencyCode,rpt.nowAcctCode,rpt.namespace+"_"+type+"_"+i+"_twoKey1");
			var twoKey2=ufma.sessionKey(rpt.module,rpt.compoCode,rpt.rgCode,rpt.nowSetYear,rpt.nowAgencyCode,rpt.nowAcctCode,rpt.namespace+"_"+type+"_"+i+"_twoKey2");
			var newVal1 = sessionStorage.getItem(twoKey1);
			var newVal2 = sessionStorage.getItem(twoKey2);
			if(newVal1 != "" && newVal1 != null){
				var numVal1 = newVal1.replace(/\\/g, "");
				$(this).parents("th").find("input").eq(0).val(numVal1);
			}
			if(newVal2 != "" && newVal2 != null){
				var numVal2 = newVal2.replace(/\\/g, "");
				$(this).parents("th").find("input").eq(1).val(numVal2);
			}
		}
		
		$(this).siblings("div.rpt-funnelBox").show();
	});
	//$(rpt.namespace).on("click",".rpt-funnelTitle-span2",function(){
	$(".rpt-funnelTitle-span2").on("click",function(){
		$(this).parents(".rpt-funnelBox").find("input[type='text']").val("");
	});
	$(rpt.namespace).on("click",function(e){
		if($(e.target).closest(".rpt-funnelBtn").length == 0 && $(e.target).closest("div.rpt-funnelBox").length == 0 && $(e.target).closest("div#colAction").length == 0){
	   		$("div.rpt-funnelBox").hide();
        }
	});
	$(rpt.namespace).on("mouseenter","div.rpt-funnelBox",function(){
		$(this).show();
	}).on("mouseleave","div.rpt-funnelBox",function(){
		$(this).hide();
	});
}

//查选方案列表的触摸效果
rpt.methodPointer = function(){
	$(rpt.namespace).find(".rpt-method-list").on("mouseover","li",function(){
		$(this).css({"border":"1px solid rgb(16, 142, 233)"});
	}).on("mouseout","li",function(){
		var color = $(this).css("color");
		if(color == "rgb(255, 255, 255)"){
			$(this).css({"border":"1px solid rgb(16, 142, 233)"});
		}else{
			$(this).css({"border":"1px solid rgba(16, 142, 233, 0.3)"});
		}
	});
	$(rpt.namespace).find(".rpt-method-list").on("mouseover","li b",function(){
		var color = $(this).css("color");
		var background;
		if(color != "rgb(16, 142, 233)"){
			background = "rgb(16, 142, 233)";
		}else{
			background = "rgb(255, 255, 255)";
		}
		$(this).css({
			"border-radius":"50%",
			"background":color,
			"color":background
		});
	}).on("mouseout","li b",function(){
		var color = $(this).css("color");
		var background;
		if(color != "rgb(16, 142, 233)"){
			background = "rgb(16, 142, 233)";
		}else{
			background = "rgb(255, 255, 255)";
		}
		$(this).css({
			"border-radius":"50%",
			"background":"none",
			"color":background
		});
	});	
};

//下拉选择树展开隐藏
rpt.showSelectTree = function(){
	$(rpt.namespace).on("click","div.rpt-tree-view",function(e){
		$(this).parents("li.rpt-query-box-li").siblings().find("div.rpt-tree-data").hide();
		$(this).parents("ul").siblings().find("div.rpt-tree-data").hide();
		
		$(this).find("input").focus();
		
		var itemCode = $("#selectTitle").val();
		
		var ulDom = $(this).parents(".rpt-query-box-li0").find("label select.rpt-select-title");
		//console.info($(ulDom).length);
		if($(ulDom).length>0){
			itemCode = $("#selectTitle").val();
		}else{
			var titleDom = $(this).parents(".rpt-query-box-li0").find("label.rpt-query-li-cont-title span");
			itemCode = $(titleDom).data("code");
		}
		
		var treeId = itemCode+"-data";
		
		var treeKey=ufma.sessionKey(rpt.module,rpt.compoCode,rpt.rgCode,rpt.nowSetYear,rpt.nowAgencyCode,rpt.nowAcctCode,rpt.namespace+itemCode);
		var treeStr = sessionStorage.getItem(treeKey);
		//console.info(treeKey+"=="+treeStr); 
		
		var isShow = $(this).siblings("div.rpt-tree-data").css("display");
		if(isShow == "none"){
			if(itemCode == "ACCO"){
				
				if(treeStr != null){
					var zNodes = JSON.parse(treeStr); 
					rpt.selectTree(treeId,zNodes);
					$(this).siblings("div.rpt-tree-data").show();
				}else{
					rpt.reqAccoTree();
				}
				
			}else{
				
				if(treeStr != null){
					var zNodes = JSON.parse(treeStr); 
					rpt.selectTree(treeId,zNodes);
					$(this).siblings("div.rpt-tree-data").show();
				}else{
					rpt.reqAccItemTree(itemCode);
				}
			}
		}
	});
	$(rpt.namespace).on("click",function(e){
		if($(e.target).closest("div.rpt-tree-view").length == 0 && $(e.target).closest("div.rpt-tree-data").length == 0){
	   		$("div.rpt-tree-data").hide();
        }
	});
	$(rpt.namespace).on("mouseenter","div.rpt-tree-data",function(){
		$(this).show();
	});
//	$(rpt.namespace).on("mouseleave","div.rpt-tree-data",function(){
//		$(this).hide();
//	});
};


//固定底部工具条
rpt.showHide=function(tableId){
	var tableBox = $("#"+tableId);
	var thead = $("#"+tableId).find("thead");
	var tool = $(".tableBottom");
	var toolFix = $(".tableBottomFix");
	
	$(thead).parents("table").width(tableBox.width());
	//设置固定底部工具条的宽度
//	if (navigator.userAgent.indexOf('Firefox') >= 0){
//		$(tool).css("width",$(tableBox).parent().width()+1+"px");
//		$(toolFix).css("width",$(tableBox).parent().width()+1+"px");
//	}else{
		$(tool).css({"width":$(tableBox).parent().width()+"px"});
		$(toolFix).css({"width":$(tableBox).parent().width()+"px"});
//	}

	var winHei;//窗口高度
	var toolHei = $(toolFix).height();//底部工具条的高度
	var theadHei = $(thead).height();//头部区域的高度
	var theadBot;//头部区域距离底部的高度
		var toolTop;//底部工具条距离顶部的高度
		
		winHei = $(window).height();
		theadBot = winHei - ($(thead).offset().top-$(document).scrollTop()) - theadHei; 
		toolTop = $(tool).offset().top-$(document).scrollTop();
		if(theadBot >= toolHei && toolTop > winHei){
			$(toolFix).css("display","block");
		}else{
			$(toolFix).css("display","none");
		}
		
};

//单位账套树
rpt.atree=function(zNodes){
	var setting = {
		data: {
			simpleData: {
				enable: true
			}
		},
		check: {
			enable: true
		},
		view: {
			fontCss: getFontCss,
			showLine:false,
			showIcon: false,
			selectedMulti: false
		},
		callback: {
			onClick: zTreeOnClick,
			onCheck: zTreeOnCheck
		}
	};
	function zTreeOnClick(event, treeId, treeNode) {
//		var be = treeNode.checked;
//		var myTree = $.fn.zTree.getZTreeObj(treeId);
//		myTree.checkNode(treeNode, !be, true);
//		rpt.nowAgencyCode = treeNode.agencyCode;
//		rpt.nowAgencyName = treeNode.agencyName;
//		rpt.nowAcctCode = treeNode.acctCode;
//		rpt.nowAcctName = treeNode.acctName;
//	    rpt.clickAtree(rpt.nowAgencyCode,rpt.nowAgencyName,rpt.nowAcctCode,rpt.nowAcctName);
	};
	
	function zTreeOnCheck(event, treeId, treeNode) {
//		rpt.nowAgencyCode = treeNode.agencyCode;
//		rpt.nowAgencyName = treeNode.agencyName;
//		rpt.nowAcctCode = treeNode.acctCode;
//		rpt.nowAcctName = treeNode.acctName;
//	    rpt.clickAtree(rpt.nowAgencyCode,rpt.nowAgencyName,rpt.nowAcctCode,rpt.nowAcctName);
	};
	
	//节点名称超出长度 处理方式
	function addDiyDom(treeId, treeNode) {  
        var spaceWidth = 5;  
        var switchObj = $("#" + treeNode.tId + "_switch"),  
        icoObj = $("#" + treeNode.tId + "_ico");  
        switchObj.remove();  
        icoObj.before(switchObj);  
  
        if (treeNode.level > 1) {  
            var spaceStr = "<span style='display: inline-block;width:" + (spaceWidth * treeNode.level)+ "px'></span>";  
            switchObj.before(spaceStr);  
        }  
        var spantxt=$("#" + treeNode.tId + "_span").html();  
        if(spantxt.length>16){  
            spantxt=spantxt.substring(0,16)+"...";  
            $("#" + treeNode.tId + "_span").html(spantxt);  
        } 
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
	
	function allNodesArr(){
		var zTree = $.fn.zTree.getZTreeObj("atree");
		var nodes =  zTree.getNodes();
		var allNodesArr = [];
		var allNodesStr;
		for(var i=0;i<nodes.length;i++){
			var result = "";
			var result =  rpt.getAllChildrenNodes(nodes[i],result);
			var NodesStr = result
			NodesStr = NodesStr.split(",");
			NodesStr.splice(0,1,nodes[i].id);
			NodesStr = NodesStr.join(",");
			allNodesStr += ","+NodesStr;
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
		if (value === "") return;
		updateNodes(false);

		nodeList = zTree.getNodesByParamFuzzy(keyType, value);
			
		updateNodes(true);
		
		var NodesArr = allNodesArr();
		console.info(NodesArr)
		if(nodeList.length>0){
			var index = NodesArr.indexOf(nodeList[0].id.toString());
			$(".rpt-atree-box-body").scrollTop((30*index));
		}
	}
	function updateNodes(highlight) {
		var zTree = $.fn.zTree.getZTreeObj("atree");
		for( var i=0, l=nodeList.length; i<l; i++) {
			nodeList[i].highlight = highlight;
			zTree.updateNode(nodeList[i]);
		}
	}
	function getFontCss(treeId, treeNode) {
		return (!!treeNode.highlight) ? {color:"#F04134", "font-weight":"bold"} : {color:"#333", "font-weight":"normal"};
	}
	function filter(node) {
		return !node.isParent && node.isFirstNode;
	}

	var key;
	$(document).ready(function(){
		var treeObj = $.fn.zTree.init($("#atree"), setting, zNodes);
		
		treeObj.expandAll(true);
		
		key = $("#key");
		key.bind("focus", focusKey)
		.bind("blur", blurKey)
		.bind("propertychange", searchNode)
		.bind("input", searchNode);
	});
	
};

//点击左侧单位账套树
rpt.clickAtree = function(agencyCode,agencyName,acctCode,acctName){
	rpt.nowAgencyCode = agencyCode;
	rpt.nowAgencyName = agencyName;
	rpt.nowAcctCode = acctCode;
	rpt.nowAcctName = acctName;
	
	if(rpt.sessionKeyArr.length>0){
		for(var i=0;i<rpt.sessionKeyArr.length;i++){
			sessionStorage.removeItem(rpt.sessionKeyArr[i]);
		}
	}
	$("div.rpt-tree-data").hide();
	
}

//收集表格表头信息
rpt.tableHeader=function (tableId){
	var columns = $("#"+tableId).DataTable().settings()[0].aoColumns;
	var visible = $("#"+tableId).DataTable().columns().visible();//每列元素的隐藏/显示属性组
	var arr = [];//存储当前表格的表头信息
	for(var i=0;i<visible.length;i++){
		var obj={};
		obj.title = columns[i].sTitle;//列名
		obj.code = columns[i].data;//列名代码
		obj.index = i;//列的索引
		obj.visible = visible[i] ;//列的隐藏/显示属性
		obj.pTitle = $(columns[i].nTh).attr("parent-title") == undefined ? "" : $(columns[i].nTh).attr("parent-title");//列名的父元素名
		arr.push(obj);
	}
	return arr;
};

//请求科目体系
rpt.reqAccsList = function(){
	var argu = {
		setYear:rpt.nowSetYear,
		rgCode:rpt.rgCode
	};
	ufma.get(rpt.portList.getAccsList,argu,function(result){
		console.info(result);
		var data = result.data;
		if(data.length>3){
			$(".rpt-accs-more").show();
			var btnHtml = "";
			for(var i=0;i<3;i++){
				var one = ufma.htmFormat('<button class="btn btn-default"><span class="rpt-accs-span" data-code="<%=code%>" title="<%=name%>"><%=name%></span></button>',
					{
						code:data[i].chrCode,
						name:data[i].chrName
					}
				);
				btnHtml+=one;
			}
			$(".rpt-accs-btn").html(btnHtml);
			$(".rpt-accs-btn").find("button").eq(0).addClass("btn-primary").removeClass("btn-default");
			var liHtml = "";
			for(var i=3;i<data.length;i++){
				var two = ufma.htmFormat('<li><span class="rpt-accs-span" data-code="<%=code%>" title="<%=name%>"><%=name%></span></li>',
					{
						code:data[i].chrCode,
						name:data[i].chrName
					}
				);
				liHtml+=two;
			}
			$(".rpt-accs-ul").html(liHtml);
		}else{
			$(".rpt-accs-more").hide();
			var btnHtml = "";
			for(var i=0;i<data.length;i++){
				var one = ufma.htmFormat('<button class="btn btn-default"><span class="rpt-accs-span" data-code="<%=code%>" title="<%=name%>"><%=name%></span></button>',
					{
						code:data[i].chrCode,
						name:data[i].chrName
					}
				);
				btnHtml+=one;
			}
			$(".rpt-accs-btn").html(btnHtml);
			$(".rpt-accs-btn").find("button").eq(0).addClass("btn-primary").removeClass("btn-default");
		}
	});
}