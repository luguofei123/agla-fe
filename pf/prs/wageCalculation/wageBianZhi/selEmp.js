$(function () {
    //open弹窗的关闭方法
    window._close = function (action) {
        if (window.closeOwner) {
            var data = {action: action};
            window.closeOwner(data);
        }
    };
    var svData = ufma.getCommonData();
    var ownerData = window.ownerData;

    //接口URL集合
    var interfaceURL = {
        getPrsOrgEmpTree:"/prs/emp/prsOrg/getPrsOrgEmpTree"//获取部门人员
    };
    var pageLength = 25;

    var page = function () {
        return {
            getPrsOrgEmpTree:function(){
                
                if(!localStorage.getItem("prsBzTreeData")){
                    ufma.showloading("正在加载数据，请耐心等待...")
                    ufma.get(interfaceURL.getPrsOrgEmpTree,"",function(result){
                        ufma.hideloading();
                        var data = result.data;
                        localStorage.setItem("prsBzTreeData",JSON.stringify(data));
                        var treeData = {
                            idKey:"id",//节点id
                            ele:"tree",//树dom
                            name:"codeName",//显示的节点名字段
                            zNodes:data,//树数据
                            isOpenAll:false//是否全部展开 true是 false否
                        }
                        prs.atree(treeData)
                    })
                }else{
                    var treeData = {
                        idKey:"id",//节点id
                        ele:"tree",//树dom
                        name:"codeName",//显示的节点名字段
                        zNodes:JSON.parse(localStorage.getItem("prsBzTreeData")),//树数据
                        isOpenAll:false,//是否全部展开 true是 false否
                        selCheckedNode:selCheckedNode//生成树收需要做的操作
                    }
                    prs.atree(treeData) 
                }
                
                function selCheckedNode(){
                    var val = JSON.parse(localStorage.getItem("prsEmpudsVal"));
                    if(val && val.length > 0){
                        var treeObj = $.fn.zTree.getZTreeObj("tree");
                        for (var i=0; i<val.length; i++) {
                            var node = treeObj.getNodeByParam("id", val[i], null);
                            treeObj.checkNode(node, true, true);
                        }
                    }
                }
                
                
            },
            initPage: function () {
                //权限控制
                page.reslist = ufma.getPermission();
                ufma.isShow(page.reslist);
                page.getPrsOrgEmpTree();
            },
            onEventListener: function () {
                //关闭
                $("#btn-close").on("click", function () {
                    _close();
                });
                //确定
                $("#btn-sure").on("click", function () {
                    var treeObj = $.fn.zTree.getZTreeObj("tree");
                    var nodes = treeObj.getCheckedNodes(true);
                    var closeData = {
                        orgcodes:[],
                        empuids:[],
                        empuidsArr:[]
                    }
                    for(var i=0;i<nodes.length;i++){
                        if(nodes[i].isLeaf == "Y"){
                            closeData.empuids.push(nodes[i].id);
                            closeData.orgcodes.push(nodes[i].pId);
                            closeData.empuidsArr.push({id:nodes[i].id,name:nodes[i].codeName})
                        }
                    }
                    _close(closeData);
                    
                });
            },

            //此方法必须保留
            init: function () {
                ufma.parse();
                page.initPage();
                page.onEventListener();
                ufma.parseScroll();
            }
        }
    }();
/////////////////////
    page.init();

    function stopPropagation(e) {
        if (e.stopPropagation)
            e.stopPropagation();
        else
            e.cancelBubble = true;
    }
});