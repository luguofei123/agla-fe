$(function () {
    window._close = function (action) {
        if (window.closeOwner) {
            var data = {action: action};
            window.closeOwner(data);
        }
    };

    //接口URL集合
    var interfaceURL = {
        getRptAccoTree:"/lp/sys/coaAcc/getRptAccoTree",//请求会计科目
        getAccItemTree:"/lp/eleAccItem/getAccItemTree",//请求辅助核算项
        selectEleAccoItemByCond:"/lp/eleAccItem/selectEleAccoItemByCond"//请求辅助核算项
    };

    var page = function () {

        return {
            //初始化科目树
            initAcco:function () {
                $("#drFinAccoCode").ufTreecombox({
                    valueField: "id",
                    textField: "codeName",
                    pIdField: 'pId', //可选
                    readonly: false,
                    placeholder: "请选择会计科目",
                    leafRequire: false,
                    onChange:function (sender, data) {
                        page.getAccItem(data,"drFinAccoCode");
                    },
                    onComplete:function (sender) {
                    }
                });
                $("#crFinAccoCode").ufTreecombox({
                    valueField: "id",
                    textField: "codeName",
                    pIdField: 'pId', //可选
                    readonly: false,
                    placeholder: "请选择会计科目",
                    leafRequire: false,
                    onChange:function (sender, data) {
                        page.getAccItem(data,"crFinAccoCode");
                    },
                    onComplete:function (sender) {
                    }
                });
                $("#drBugAccoCode").ufTreecombox({
                    valueField: "id",
                    textField: "codeName",
                    pIdField: 'pId', //可选
                    readonly: false,
                    placeholder: "请选择会计科目",
                    leafRequire: false,
                    onChange:function (sender, data) {
                        page.getAccItem(data,"drBugAccoCode");
                    },
                    onComplete:function (sender) {
                    }
                });
                $("#crBugAccoCode").ufTreecombox({
                    valueField: "id",
                    textField: "codeName",
                    pIdField: 'pId', //可选
                    readonly: false,
                    placeholder: "请选择会计科目",
                    leafRequire: false,
                    onChange:function (sender, data) {
                        page.getAccItem(data,"crBugAccoCode");
                    },
                    onComplete:function (sender) {
                    }
                });
            },
            //请求财务会计科目
            getRptAccoTreeFin:function(){
                var argu = {
                    agencyCode:window.ownerData.agencyCode,
                    acctCode:window.ownerData.acctCode,
                    accaCode:"1",
                    rgCode:window.ownerData.rgCode,
                    setYear:window.ownerData.setYear
                };
                ufma.showloading('正在加载数据，请耐心等待...');
                ufma.get(interfaceURL.getRptAccoTree,argu,function (result) {
                    $("#drFinAccoCode").getObj().load(result.data.treeData);
                    $("#crFinAccoCode").getObj().load(result.data.treeData);
                    // page.setAcco(result.data.treeData,"drFinAccoCode","crFinAccoCode");
                    ufma.hideloading();
                });


            },
            //科目树set值
            setAcco:function(data,id1,id2){
                for(var i = 0;i<data.length;i++){
                    if(data[i].isLeaf == 1){
                        $("#" + id1).getObj().val(data[i].id);
                        $("#" + id2).getObj().val(data[i].id);
                    }
                }
            },
            //请求预算会计科目
            getRptAccoTreeBug:function(){
                var argu = {
                    agencyCode:window.ownerData.agencyCode,
                    acctCode:window.ownerData.acctCode,
                    accaCode:"2",
                    rgCode:window.ownerData.rgCode,
                    setYear:window.ownerData.setYear
                }
                ufma.get(interfaceURL.getRptAccoTree,argu,function (result) {
                    $("#drBugAccoCode").getObj().load(result.data.treeData);
                    $("#crBugAccoCode").getObj().load(result.data.treeData);
                    // page.setAcco(result.data.treeData,"drBugAccoCode","crBugAccoCode");
                });

            },
            //请求辅助核算项
            getAccItem:function(data,type){
                var argu = {
                    agencyCode:window.ownerData.agencyCode,
                    acctCode:window.ownerData.acctCode,
                    accoCode:data.id,
                    rgCode:window.ownerData.rgCode,
                    setYear:window.ownerData.setYear
                };
                $("#" + type).closest("form").find(".accitems-con").html("");
                ufma.get(interfaceURL.selectEleAccoItemByCond,argu,function (result) {
                    var itemsData = result.data.treeData;
                    for(var i =0 ;i<itemsData.length;i++){
                        page.renderItems(itemsData[i],type,i,itemsData.length)
                    }
                })
            },
            //渲染辅助项
            renderItems:function(item,type,i,length){
                var itemHtml = '<div class="form-group">' +
                    '<label class="control-label">'+item.eleName+'：</label>' +
                    '<div class="control-element">'+
                    '<div id="'+type + '_'+item.accitemCode+'" name="'+item.accitemCode+'" class="uf-treecombox" style="width: 160px"></div>'+
                    '</div>'+
                '</div>'
                if(type == "drFinAccoCode"){
                    $("#frmQuery1 .accitems-con").append(itemHtml);
                }else if(type == "crFinAccoCode"){
                    $("#frmQuery2 .accitems-con").append(itemHtml);
                }else if(type == "drBugAccoCode"){
                    $("#frmQuery3 .accitems-con").append(itemHtml);
                }else if(type == "crBugAccoCode"){
                    $("#frmQuery4 .accitems-con").append(itemHtml);
                }
                page.renderAccItems(item,type);
            },
            //渲染辅助项明细
            renderAccItems:function(item,type){
                var argu = {
                    agencyCode:window.ownerData.agencyCode,
                    // acctCode:window.ownerData.acctCode,
                    userId:window.ownerData.userId,
                    setYear:window.ownerData.setYear,
                    eleCode: item.accitemCode
                };
                ufma.get(interfaceURL.getAccItemTree,argu,function (result) {
                    $("#"+type+"_"+item.accitemCode).ufTreecombox({
                        valueField: "id",
                        textField: "codeName",
                        pIdField: 'pId', //可选
                        readonly: false,
                        placeholder: "请选择辅助项数据",
                        leafRequire: false,
                        data:result.data,
                        onChange:function (sender, data) {
                        },
                        onComplete:function (sender) {
                        }
                    });
                })

            },
            onEventListener: function () {
                $("#btn-save").on("click",function () {
                    var argu =$('form').serializeObject();
                    var data = {
                        action:"save",
                        argu:argu
                    };
                    _close(data);
                });
                $("#btn-qx").on("click",function () {
                    _close();
                })
            },
            initPage:function(){
                //初始化会计科目
                page.initAcco();
                //请求财务会计科目
                page.getRptAccoTreeFin();
                //请求预算会计科目
                page.getRptAccoTreeBug();
            },

            //此方法必须保留
            init: function () {
                //权限控制
                page.reslist = ufma.getPermission();
                ufma.isShow(page.reslist);
                ufma.parse();
                page.initPage();
                page.onEventListener();


            }
        }
    }();
/////////////////////
    page.init();
    function closeModel() {
        $("#tempModalBg", parent.document).prevAll("#tarBillGenerate").find(".lp-query-box-right .btn-query").click();
        $("#tempModalBg", parent.document).prevAll("#tarBillGenerate").siblings("#ModalBg").css("display","none");
        $("#tempModalBg", parent.document).remove();
    }
});