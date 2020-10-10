var pfData = ufma.getCommonData();

var rpt2 = {};
//表格上面按单位/账套显示
rpt2.isShowAgency = false;
rpt2.isShowAcct = false;
//用于存储打开的模态框
rpt2.setQuery;
rpt2.namespace = "#" + $(".rptType").data("name");
//console.info(rpt2.namespace);

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

//余额表联查明细账参数缓存
rpt2.journalFormBal = ufma.sessionKey(rpt2.module, rpt2.compoCode, rpt2.rgCode, rpt2.nowSetYear, rpt2.nowAgencyCode, rpt2.nowAcctCode, "journalFormBal");

// rpt2.urlPath = "http://127.0.0.1:8081";
// rpt2.urlPath = "http://127.0.0.1:8083";//本地调试
rpt2.urlPath = "";//服务器

//账表所用接口
rpt2.portList = {
    getAgencyAcctTree: "/de/expAudit/getAgencyAcctTree",//单位账套树
    // getAgencyAcctTree: "/bida/sys/common/getAgencyAcctTree",//单位账套树
    // getAccsList: "/bida/ma/sys/accs/select",//科目体系
    // getAccsList: "/de/expAudit/selectAccsList",//科目体系 //
    getAccsList: '/ma/sys/accs/selectByAcct' //【RSSB-330】【sunchuang】【审计数据导出】-【审计数据导出】左侧科目体系按照账套挂接的科目体系区分
};

rpt2.nowSetYear = pfData.svSetYear;//当前年份
rpt2.nowUserId = pfData.svUserId;//登录用户ID    修改权限  将svUserCode改为 svUserId  20181012
rpt2.nowUserName = pfData.svUserName;//登录用户名称
rpt2.nowAgencyCode = pfData.svAgencyCode;//登录单位代码
rpt2.nowAgencyName = pfData.svAgencyName;//登录单位名称
rpt2.nowAcctCode = pfData.svAcctCode;//账套代码
rpt2.nowAcctName = pfData.svAcctName;//账套名称
rpt2.rptType = $(".rptType").val();//账表类型

/*
 * JSON数组去重
 * @param: [array] json Array
 * @param: [string] 唯一的key名，根据此键名进行去重
 */
rpt2.uniqueArray = function (array, key) {
    var result = [array[0]];
    for (var i = 1; i < array.length; i++) {
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
rpt2.GetQueryString = function (name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
};

/*
 * 获得节点下面的所有子节点
 */
rpt2.getAllChildrenNodes = function (treeNode, result) {
    if (treeNode.isParent) {
        var childrenNodes = treeNode.children;
        if (childrenNodes) {
            for (var i = 0; i < childrenNodes.length; i++) {
                result += "," + (childrenNodes[i].id);
                result = rpt2.getAllChildrenNodes(childrenNodes[i], result);
            }
        }
    }
    return result;
};


//判断li-over和计数是否显示
rpt2.selectTip = function (ulDom, numDom) {
    var len = 0;
    $(ulDom).find("li").not(".rpt-li-over").each(function (i) {
        var width = $(this).find("span").width() + 30;
        len += parseInt(width + 4)
        if (len < 213) {
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
    if (num > 0) {
        $(numDom).parent("div.rpt-tags-num").show();
    } else {
        $(numDom).parent("div.rpt-tags-num").hide();
    }
};

//构建树节点标签
rpt2.createTags = function (treeId, type) {
    var mytree = $.fn.zTree.getZTreeObj(treeId);
    var firstNode = mytree.getNodes()[0];
    var nodeNamesArr = [];
    nodeNamesArr.push(firstNode.name);

    var NodesStr = [];
    if (firstNode.isParent) {
        var result = rpt2.getAllChildrenNodes(firstNode, result);
        if (result != "" && result != undefined && result != null) {
            if (result.indexOf(",") != "-1") {
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
    $(ulDom).find("li").each(function () {
        liArr.push($(this).find("span").text());
    })

    var numDom = $(ulDom).siblings("div.rpt-tags-num").find("span");
    var num = 0;

    var checkNodes = mytree.getCheckedNodes(true);

    var allCheckNodes = [];
    for (var i = 0; i < checkNodes.length; i++) {
        var halfCheck = checkNodes[i].getCheckStatus();
        var pnode = checkNodes[i].isParent;

        if (rpt2.rptType != "GL_RPT_COLUMNAR") {
            if (!halfCheck.half) {
                allCheckNodes.push(checkNodes[i]);
            }
        } else {
            if (!halfCheck.half && !pnode) {
                allCheckNodes.push(checkNodes[i]);
            }
        }

    }

    var len = 0;
    if (allCheckNodes.length > 0 && allCheckNodes.length < NodesStr.length) {
        for (var i = 0; i < allCheckNodes.length; i++) {
            if ($.inArray(allCheckNodes[i].name, liArr) == "-1") {
                num++;
                var newLi = '<li><span data-code="' + allCheckNodes[i].id + '" title="' + allCheckNodes[i].name + '">' + allCheckNodes[i].name + '</span><b class="glyphicon icon-close"></b></li>';
                $(ulDom).find("li.rpt-li-over").before($(newLi));
                $(numDom).text(num);
                rpt2.selectTip(ulDom, numDom);
            }
        }
    } else if (allCheckNodes.length == NodesStr.length) {
        num = allCheckNodes.length - 1;
        if (nodeNamesArr[0] != "全部") {
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
rpt2.selectTags = function (treeId, type) {
    var dom = treeId;
    var tree = type;
    //构建树节点标签
    rpt2.createTags(treeId, type);

    //余额表的操作
    if (rpt2.rptType == "GL_RPT_BAL") {
        //如果不是设置辅助项带过来的标签 才清空下面辅助项已有的标签
//		if(treeId == "ACCO-data" && type){
//			rpt2.changeItems();
//		}
    }
    //明细账
    else if (rpt2.rptType == "GL_RPT_JOURNAL") {

    }
    //总账、日记账
    else if (rpt2.rptType == "GL_RPT_LEDGER" || rpt2.rptType == "GL_RPT_DAILYJOURNAL") {

    }
    //多栏账
    else if (rpt2.rptType == "GL_RPT_COLUMNAR") {

    }
    else {
        console.info("不是余额表、明细账、总账、日记账、多栏账,查看是否需要做细化处理！");
    }

};

//移除树节点标签
rpt2.removeTags = function (dom, tree) {
    var ulDom = $(dom).parents("ul.rpt-tags-list");

    var liDom = $(dom).parent("li").remove();
    var treeId = $(dom).parents("div.rpt-query-li-selete").find("ul.ztree").attr("id");
    var domName = $(dom).siblings("span").text();
    var mytree = tree;
    var domNode = mytree.getNodeByParam("name", domName, null);
    var checkNodes = mytree.checkNode(domNode, false, true);

    $(ulDom).siblings(".rpt-p-search-key").find("input").val("").focus();
};

//删除select标签
rpt2.deleteSelete = function (dom, tree) {
    var dom = dom;
    var tree = tree;
    //移除树节点标签
    rpt2.removeTags(dom, tree);

    //余额表的操作
    if (rpt2.rptType == "GL_RPT_BAL") {
        var treeId = $(dom).parents("div.rpt-query-li-selete").find("ul.ztree").attr("id");
        if (treeId == "ACCO-data") {
            rpt2.changeItems();
        }
    }
    //明细账的操作
    else if (rpt2.rptType == "GL_RPT_JOURNAL") {
//		var treeId = $(dom).parents("div.rpt-query-li-selete").find("ul.ztree").attr("id");
//		if(treeId == "ACCO-data"){
//			rpt2.changeItems();
//		}
    }
    //总账、日记账的操作
    else if (rpt2.rptType == "GL_RPT_LEDGER" || rpt2.rptType == "GL_RPT_DAILYJOURNAL") {

    }
    //多栏账
    else if (rpt2.rptType == "GL_RPT_COLUMNAR") {

    }
    else {
        console.info("不是余额表、明细账、总账、日记账、多栏账,查看是否需要做细化处理！");
    }

};
//返回入参
rpt2.backTabArgu = function () {
    var treeObj = $.fn.zTree.getZTreeObj("atree");
    var nodes = treeObj.getCheckedNodes(true);//获取选中的单位账套
    var tabArgu = {}, acctArr = [], agencyArr = [];
    var len = nodes.length;
    for (var i = 0; i < len; i++) {
        if (nodes[i]["acctCode"] && nodes[i]["acctCode"] !== "") {//选取账套信息
            acctArr.push(nodes[i]["acctCode"]);
            agencyArr.push(nodes[i]["agencyCode"]);
        }
    }
    tabArgu.acctCode = acctArr.join();//账套代码
    tabArgu.agencyCode = agencyArr.join();//单位代码
    return tabArgu;
};
//下拉选择树展开隐藏
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
//单位账套树
rpt2.atree = function (zNodes) {
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
            showLine: false,
            showIcon: false,
            selectedMulti: false
        },
        callback: {
            onClick: zTreeOnClick,
            onCheck: zTreeOnCheck
        }
    };

    function zTreeOnClick(event, treeId, treeNode) {
        var be = treeNode.checked;
        var myTree = $.fn.zTree.getZTreeObj(treeId);
        myTree.checkNode(treeNode, !be, true);
        if (!be) {
            rpt2.nowAgencyCode = treeNode.agencyCode;
            rpt2.nowAgencyName = treeNode.agencyName;
            rpt2.nowAcctCode = treeNode.acctCode;
            rpt2.nowAcctName = treeNode.acctName;
            rpt2.clickAtree(rpt2.nowAgencyCode, rpt2.nowAgencyName, rpt2.nowAcctCode, rpt2.nowAcctName);
        }

    };

    function zTreeOnCheck(event, treeId, treeNode) {
        var be = treeNode.checked;
        if (be) {
            rpt2.nowAgencyCode = treeNode.agencyCode;
            rpt2.nowAgencyName = treeNode.agencyName;
            rpt2.nowAcctCode = treeNode.acctCode;
            rpt2.nowAcctName = treeNode.acctName;
            rpt2.clickAtree(rpt2.nowAgencyCode, rpt2.nowAgencyName, rpt2.nowAcctCode, rpt2.nowAcctName);
        }
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

        // treeObj.expandAll(true);

        key = $("#key");
        key.bind("focus", focusKey)
            .bind("blur", blurKey)
            .bind("propertychange", searchNode)
            .bind("input", searchNode);
    });

};

//点击左侧单位账套树
rpt2.clickAtree = function (agencyCode, agencyName, acctCode, acctName) {
    $("div.rpt-tree-data").hide();

};
//请求科目体系
rpt2.reqAccsList = function () {
    var argu = {
        setYear: rpt2.nowSetYear,
        rgCode: rpt2.rgCode
    };
    ufma.get(rpt2.portList.getAccsList, argu, function (result) {
        rpt2.leftReqAccsListHtml(result);
        var data = result.data;
        if(data.length > 0){
            $("#domId").getObj().val(data[0].chrCode);
        }
    });
};
//左侧科目体系下拉
rpt2.leftReqAccsListHtml = function (result) {
    var data = result.data;
    $("#domId").ufCombox({
        idField: "chrCode",
        textField: "chrName",
        data: data, //json 数据
        placeholder: "请选择科目体系",
        onChange: function (sender, data) {
            //请求单位账套树
            var accsCode = data.chrCode;
            rpt2.atreeData(accsCode);
        },
        onComplete: function (sender) {
        }
    });
};
//请求单位账套树
rpt2.atreeData = function (accsCode) {
    var argu = {
        "setYear": rpt2.nowSetYear,
        "rgCode": rpt2.rgCode,
    };
    if (accsCode) {
        argu["accsCode"] = accsCode;
    }
    ufma.showloading("正在加载数据，请耐心等待");
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
            nodeObj.agencyCode = atreeArr[i].agencyCode?atreeArr[i].agencyCode:atreeArr[i].code;
            nodeObj.agencyName = atreeArr[i].agencyName?atreeArr[i].agencyName:atreeArr[i].codeName;
            nodeObj.acctCode = atreeArr[i].isAcct?atreeArr[i].code:"";
            nodeObj.acctName = atreeArr[i].isAcct?atreeArr[i].codeName:"";
            nodeObj.isParallel = atreeArr[i].isParallel;
            znodes.push(nodeObj);
        }
        rpt2.atree(znodes);
        rpt2.clickAtree(rpt2.nowAgencyCode, rpt2.nowAgencyName, rpt2.nowAcctCode, rpt2.nowAcctName);
        ufma.hideloading();
    })
};