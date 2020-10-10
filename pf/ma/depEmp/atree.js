$(function(){
    window.atreeObj = new Atree();
    /**
     * 单位树类
     */
    function Atree(){
        var pfData = ufma.getCommonData();
        var rgCode = pfData.svRgCode,//区划代码
        nowSetYear = pfData.svSetYear,//当前年份
        nowAgencyCode = pfData.svAgencyCode,//登录单位代码
        nowAgencyName = pfData.svAgencyName;//登录单位名称
        // var nowAcctCode = pfData.svAcctCode;//账套代码
        // var nowAcctName = pfData.svAcctName;//账套名称
    
        var zTreeOnCheck = function(event, treeId, treeNode){
        }
        var zTreeOnClick = function(event, treeId, treeNode) {
            nowAgencyCode = treeNode.code;
            nowAgencyName = treeNode.codeName;
            // clickAtree(nowAgencyCode, nowAgencyName,clickAgencyCallBack);
        }
        
        var zTreeBeforeClick = function(treeId, treeNode, clickFlag){
            //点击“全部”判断
            // if(treeNode.code==='*'){
            //     return false;
            // }
            var treeObj = $.fn.zTree.getZTreeObj("atree");
            treeObj.checkNode(treeNode, true, true, true);
            return false;
        }
        
        var getFontCss = function(treeId, treeNode) {
            return (!!treeNode.highlight) ? { color: "#F04134", "font-weight": "bold" } : {
                color: "#333",
                "font-weight": "normal"
            };
        }
    
        var setting = {
            data: {
                key:{
                    name: 'codeName'
                },
                simpleData: {
                    enable: true
                }
            },
            view: {
                nameIsHTML: true,
                fontCss: getFontCss,
                showLine: false,
                showIcon: false,
                showTitle: false,
                selectedMulti: false
            },
            check:{
                enable: true
            },
            callback: {
                onCheck: zTreeOnCheck,
                // onClick: zTreeOnClick,
                beforeClick: zTreeBeforeClick,
                beforeClick: zTreeBeforeClick
            }
        }
        /** 
         * 递归获得节点下面的所有子节点
         */
        var getAllChildrenNodes = function(treeNode,result){
            if (treeNode.isParent) {
                var childrenNodes = treeNode.children;
                if (childrenNodes) {
                    for (var i = 0; i < childrenNodes.length; i++) {
                           result += ","+(childrenNodes[i].id);
                        result = getAllChildrenNodes(childrenNodes[i], result);
                    }
                }
            }
            return result;
        }
        /**
         * 请求单位数据
         */
        var getAtreeData = function(callback){
            ufma.ajax('/ma/emp/prsOrg/getPrsOrgEmpTree', 'get', 
            {
              "agencyCode": nowAgencyCode,
              "setYear": nowSetYear,
              "rgCode": rgCode
            }
            ,function(result){
                var nodes = getAtreeDataNodes(result);
                callback(nodes);
            })
        }
        /**
         * 由单位数据返回构造后的node集合(数组类型)
         */
        var getAtreeDataNodes = function(result){
            var nodes = result.data;
            return nodes;
        }

        var lastValue = '',searchNodeList = [];
    
        var focusKey = function (e) {
            if ($("#key").hasClass("empty")) {
                $("#key").removeClass("empty");
            }
        }
    
        var blurKey = function (e) {
            if ($("#key").get(0).value === "") {
                $("#key").addClass("empty");
            }
        }
    
        var allNodesArr = function () {
            var zTree = $.fn.zTree.getZTreeObj("atree");
            var nodes = zTree.getNodes();
            var allNodesArr = [];
            var allNodesStr;
            for (var i = 0; i < nodes.length; i++) {
                var result = "";
                var result = getAllChildrenNodes(nodes[i], result);
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
    
        var searchNode = function (e) {
            var zTree = $.fn.zTree.getZTreeObj("atree");
            var value = $.trim($("#key").get(0).value);
            var keyType = "name";
    
            if ($("#key").hasClass("empty")) {
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
    
            searchNodeList = zTree.getNodesByParamFuzzy(keyType, value);
    
            updateNodes(true);
    
            var NodesArr = allNodesArr();
            if (searchNodeList.length > 0) {
                var index = NodesArr.indexOf(searchNodeList[0].id.toString());
                $(".rpt-atree-box-body").scrollTop((30 * index));
            }
        }
    
        var updateNodes = function (highlight) {
            var zTree = $.fn.zTree.getZTreeObj("atree");
            for (var i = 0, l = searchNodeList.length; i < l; i++) {
                searchNodeList[i].highlight = highlight;
                zTree.updateNode(searchNodeList[i]);
            }
        }
    
        var atreeTodo = function (nodes){
            var treeObj = $.fn.zTree.init($("#atree"), setting, nodes);
            this.treeObj = treeObj;
            treeObj.expandAll(true);
            $("#key").bind("focus", focusKey).bind("blur", blurKey).bind("propertychange", searchNode).bind("input", searchNode);
            return treeObj;
        }
    
        this.treeObj = null;
        var timeout = null;
        /**
         * 初始化
         */
        this.initAtree = function(clickAgencyCallBack,checkAgencyCallBack){
            getAtreeData(function(nodes){
                $(document).ready(function (){
                    if(typeof(clickAgencyCallBack)==='function'){
                        setting.callback.onClick = function(event, treeId, treeNode){
                            nowAgencyCode = treeNode.code;
                            nowAgencyName = treeNode.codeName;
                            clickAgencyCallBack(nowAgencyCode,nowAgencyName)
                        }
                    }
                    if(typeof(checkAgencyCallBack)==='function'){
                        setting.callback.onCheck = function(event, treeId, treeNode){
                            var deptList = [],empList = [];
                            var treeObj = $.fn.zTree.getZTreeObj("atree");
                            var nodes = treeObj.getCheckedNodes(true);
                            nodes.forEach(function(item,index){
                                // console.log(item.code)
                                // console.log(item.name)
                                // console.log(item.codeName)
                                // console.log(item.isLeaf)
                                if(item.code!='*'&&item.isLeaf=='1'){
                                    empList.push(item.code);
                                }
                                if(item.code!='*'&&item.isLeaf=='0'){
                                    var obj = {
                                        code:item.code,
                                        name:item.name,
                                        codeName: item.codeName
                                    };
                                    deptList.push(obj);
                                }
                            })
                            // console.log(empList)
                            // console.log(deptList)
                            checkAgencyCallBack(empList, deptList)
                        }
                    }
                    atreeTodo(nodes);
                });
            });
        }
        /**
         * 更新树
         */
        this.updateAtree = function(clickAgencyCallBack,checkAgencyCallBack,agencyCode){
            getAtreeData(function(nodes){
                $.fn.zTree.destroy("atree");
                $(document).ready(function (){
                    if(typeof(clickAgencyCallBack)==='function'){
                        setting.callback.onClick = function(event, treeId, treeNode){
                            nowAgencyCode = treeNode.code;
                            nowAgencyName = treeNode.codeName;
                            clickAgencyCallBack(nowAgencyCode,nowAgencyName)
                        }
                    }
                    if(typeof(checkAgencyCallBack)==='function'){
                        setting.callback.onCheck = function(event, treeId, treeNode){
                            clearTimeout(timeout);
                                timeout = setTimeout(function(){
                                    var agencyCodeList = [];
                                    var treeObj = $.fn.zTree.getZTreeObj("atree");
                                    var nodes = treeObj.getCheckedNodes(true);
                                    nodes.forEach(function(item,index){
                                        if(item.code!='*'&&item.isLeaf==1){
                                            agencyCodeList.push(item.code)
                                        }
                                    })
                                    checkAgencyCallBack(agencyCodeList)
                                },500);
                        }
                    }
                    var treeObj = atreeTodo(nodes);
                    //默认选择更新指定的agencyCode
                    if(agencyCode){
                        var targetNode = treeObj.getNodeByParam("code", agencyCode)
                        treeObj.selectNode(targetNode)
                    }
                });
            });
        }
        /**
         * 树结点筛选
         */
        this.treeFilter = function(status,clickAgencyCallBack){
            $.fn.zTree.destroy("atree");
            if(status==='3'){
                this.initAtree(clickAgencyCallBack);
            }else{
                var filterNodes = [];
                getAtreeData(function(nodes){
                    nodes.forEach(function(item){
                        if(item.status===status){
                            filterNodes.push(item);
                        }
                    })
                    if(filterNodes.length===0){
                        ufma.showTip('没有您要筛选的单位数据',function(){},'warning')
                    }else{
                        filterNodes.unshift({
                            id : '*',
                            code : '*',
                            pId: null,
                            pCode: null,
                            name : '全部',
                            codeName : '全部',
                            codeNameAndStatus: '全部'
                        });
                    }
                    atreeTodo(filterNodes);
                })
            }
        }
    }
})
