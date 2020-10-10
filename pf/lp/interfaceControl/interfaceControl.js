$(function () {
    window._close = function (action) {
        if (window.closeOwner) {
            var data = {action: action};
            window.closeOwner(data);
        }
    };
    var svData = ufma.getCommonData();


    //接口URL集合
    var interfaceURL = {
        selectLpGwzjConfig:"/lp/gwzjConfig/selectLpGwzjConfig",//查询
        updateLpGwzjConfig:"/lp/gwzjConfig/updateLpGwzjConfig"//更新
       
    }; 


    var page = function () {

        return {
            //请求查询接口
            getSearch: function (result) {
                ufma.get(interfaceURL.selectLpGwzjConfig, { "enabled": "" }, function (result) {
                    if (result.data.length > 0) {
                        var data = result.data;
                        if (data[0].enabled == "1" && data[0].requestMode == "0") {
                            $(".control-div label").eq(0).find("input").prop("checked", true);
                            $(".control-div label").eq(1).find("input").removeAttr("checked");
                        } else if (data[0].enabled == "0" && data[0].requestMode == "0") {
                            $(".control-div label").eq(1).find("input").prop("checked", true);
                            $(".control-div label").eq(0).find("input").removeAttr("checked");
                        }
                        var $ul1 = $('<ul class="httpList"></ul>'), $li1 = "";
                        var $ul2 = $('<ul class="httpList"></ul>'), $li2 = "";
                        for (var i = 0; i < data.length; i++) {
                            var $disable = data[i].enabled == "1" ? '' : 'disabled';
                            //摆渡盘
                            if (data[i].requestMode == "0") {
                                $li1 += '<li guid="' + data[i].lpGwzjGuid + '" class="row"><div class="li-name col-md-3">' + data[i].labelName
                                    + '</div><div class="li-value col-md-9"><input ' +
                                    $disable + ' type="text" name="URL" class="bordered-input padding-3" style="width:100%" value="'
                                    + data[i].url + '"></div></li>';
                            } else {
                                //集中存储
                                $li2 += '<li guid="' + data[i].lpGwzjGuid + '" class="row"><div class="li-name col-md-3">' + data[i].labelName
                                    + '</div><div class="li-value col-md-9"><input ' +
                                    $disable + ' type="text" name="URL" class="bordered-input padding-3" style="width:100%" value="'
                                    + data[i].url + '"></div></li>'
                            }
                        }
                        $ul1.append($li1);
                        $(".lp-con-1").append($ul1);
                        $ul2.append($li2);
                        $(".lp-con-2").append($ul2);
                    }
                })
            },
            initPage: function () {
                //权限控制
                page.reslist = ufma.getPermission();
                ufma.isShow(page.reslist);
                page.getSearch()
            },
            onEventListener: function () {
                $("#btn-save").on("click",function(){
                    var argu = {lpGwzjConfigs:[]};
                    var lis = $(".lp-con-1 li");
                    var requestMode1 = $("input[name='requestMode']:checked").val() == "0" ? "1" : "0";
                    for(var i=0;i<lis.length;i++){
                        var $li = $(lis[i]);
                        var guid = $li.attr("guid");
                        var URL = $li.find("input[name=URL]").val();
                        var obj = {
                            lpGwzjGuid: guid,
                            url: URL,
                            enabled : requestMode1,
                            requestMode : "0"
                        }
                        argu.lpGwzjConfigs.push(obj)
                    }
                    var lis = $(".lp-con-2 li");
                    var requestMode2 = $("input[name='requestMode']:checked").val() == "1" ? "1" : "0";
                    for(var i=0;i<lis.length;i++){
                        var $li = $(lis[i]);
                        var guid = $li.attr("guid");
                        var URL = $li.find("input[name=URL]").val();
                        var obj = {
                            lpGwzjGuid: guid,
                            url: URL,
                            enabled : requestMode2,
                            requestMode : "1"
                        }
                        argu.lpGwzjConfigs.push(obj)
                    }
                    if (requestMode1 == "1") {
                        if ($.isNull(argu.lpGwzjConfigs[5].url)) {
                            ufma.showTip("请输入取数视图！", function () {
                            }, "warnning")
                            return false;
                        }
                    } else {
                        if ($.isNull(argu.lpGwzjConfigs[11].url)) {
                            ufma.showTip("请输入取数视图！", function () {
                            }, "warnning")
                            return false;
                        }
                    }
                    ufma.post(interfaceURL.updateLpGwzjConfig,argu,function(result){
                        ufma.showTip(result.msg,function(){},result.flag)
                    })
                    
                })
                $(".control-div label").each(function (i) {
                    $(this).on("click", function () {
                        //摆渡盘
                        if (i == 0) {
                            $(".control-div label").eq(0).find("input").prop("checked", true);
                            $(".control-div label").eq(1).find("input").removeAttr("checked");
                            var lis1 = $(".lp-con-1 li");
                            for (var j = 0; j < lis1.length; j++) {
                                var $li = $(lis1[j]);
                                $li.find("input").removeAttr("disabled");
                            }
                            var lis2 = $(".lp-con-2 li");
                            for (var k = 0; k < lis2.length; k++) {
                                var $li = $(lis2[k]);
                                $li.find("input").attr("disabled", "disabled");
                            }
                        } else {
                            $(".control-div label").eq(1).find("input").prop("checked", true);
                            $(".control-div label").eq(0).find("input").removeAttr("checked");
                            var lis1 = $(".lp-con-1 li");
                            for (var l = 0; l < lis1.length; l++) {
                                var $li = $(lis1[l]);
                                $li.find("input").attr("disabled", "disabled");
                            }
                            var lis2 = $(".lp-con-2 li");
                            for (var m = 0; m < lis2.length; m++) {
                                var $li = $(lis2[m]);
                                $li.find("input").removeAttr("disabled");
                            }
                        }
                    });
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
});