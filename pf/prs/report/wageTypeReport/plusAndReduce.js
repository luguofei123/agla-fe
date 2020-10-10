$(function () {
    //open弹窗的关闭方法
    window._close = function (action) {
        if (window.closeOwner) {
            var data = {action: action};
            window.closeOwner(data);
        }
    };
    var svData = ufma.getCommonData();
    var onerdata = JSON.parse(window.sessionStorage.getItem("openPlusReduce"));
    // var ownerData = window.ownerData;
    //接口URL集合
    var interfaceURL = {
        saveAsVal: "/prs/asval/saveAsVal",//保存
        getAll: "/prs/asvalset/getAll"//查询
    };
    var pageLength = 25;

    var page = function () {
        return {
            //渲染相加项
            renderPlusItems: function (selectedArr) {
                var data = [
                    {code: "1", name: "基本工资"},
                    {code: "2", name: "岗位工资"},
                    {code: "3", name: "基本离休费"},
                    {code: "4", name: "其他津补贴"},
                    {code: "5", name: "薪级工资"},
                    {code: "6", name: "离休补贴"},
                    {code: "7", name: "生活补贴"}
                ];
                page.renderLabels(selectedArr,$(".plus-box-l"),data);
                if (selectedArr.length == data.length) {
                    $(".plus-box-l").find(".checkAll").attr("checked");
                }
            },
            //渲染相减项
            renderReduceItems: function (selectedArr) {
                var data = [
                    {code: "1", name: "基本工资"},
                    {code: "2", name: "岗位工资"},
                    {code: "3", name: "基本离休费"},
                    {code: "4", name: "其他津补贴"},
                    {code: "5", name: "薪级工资"},
                    {code: "6", name: "离休补贴"},
                    {code: "7", name: "生活补贴"}
                ];
                page.renderLabels(selectedArr,$(".reduce-box-l"),data);
                if (selectedArr.length == data.length) {
                    $(".reduce-box-l").find(".checkAll").attr("checked");
                }
            },
            renderLabels:function(selectedArr,ele,data){
                var liHtml = '<label class="mt-checkbox mt-checkbox-outline checkAll" ><input type="checkbox" data-code="*">全选<span></span></label>';
                for (var i = 0; i < data.length; i++) {
                    if (selectedArr.indexOf(data[i].code) < 0) {
                        liHtml += '<label class="mt-checkbox mt-checkbox-outline"><input type="checkbox" data-code="' + data[i].code + '" data-name="' + data[i].name + '">' + data[i].name + '<span></span></label>'
                    } else {
                        liHtml += '<label class="mt-checkbox mt-checkbox-outline"><input type="checkbox" checked="checked" data-code="' + data[i].code + '" data-name="' + data[i].name + '">' + data[i].name + '<span></span></label>'
                    }
                }
                ele.append(liHtml);
            },
            renderLabels2:function(ele,data){
                var arr=[];
                var liHtml = '<label class="mt-checkbox mt-checkbox-outline checkAll" ><input type="checkbox" data-code="*">全选<span></span></label>';
                for (var i = 0; i < data.length; i++) {
                    arr.push(data[i].code);
                        liHtml += '<label class="mt-checkbox mt-checkbox-outline"><input type="checkbox" data-code="' + data[i].code + '" data-name="' + data[i].name + '">' + data[i].name + '<span></span></label>'
                }
                ele.append(liHtml);
                return arr;
            },
            //已选择的相加项
            renderPlusSelected: function () {
                var data = [
                    {code: "1", name: "基本工资"},
                    {code: "2", name: "岗位工资"}
                ];
                var arr = page.renderLabels2($(".plus-box-r"),data);
                page.renderPlusItems(arr);
            },
            //已选择的相减项
            renderReduceSelected: function () {
                var data = [
                    {code: "3", name: "基本离休费"},
                    {code: "4", name: "其他津补贴"}
                ];
                var arr = page.renderLabels2($(".reduce-box-r"),data);
                page.renderReduceItems(arr);
            },

            initPage: function () {
                //权限控制
                page.reslist = ufma.getPermission();
                ufma.isShow(page.reslist);
                page.renderPlusSelected();
                page.renderReduceSelected();
            },
            onEventListener: function () {
                //关闭
                $("#btn-close").on("click", function () {
                    _close();
                });
                //确定
                $("#btn-sure").on("click", function () {
                    var plusItems = $(".plus-box-r").find("input");
                    var plusCodes = [],result = "";
                    for(var i=0;i<plusItems.length;i++){
                        if($(plusItems[i]).attr("data-code") != "*"){
                            plusCodes.push($(plusItems[i]).attr("data-code"));
                            if(i<plusItems.length-1){
                                result += $(plusItems[i]).attr("data-name") + "+";
                            }else{
                                result += $(plusItems[i]).attr("data-name");
                            }

                        }
                    }
                    var reduceItems = $(".reduce-box-r").find("input");
                    var reduceCodes = [];
                    for(var i=0;i<reduceItems.length;i++){
                        if($(reduceItems[i]).attr("data-code") != "*"){
                            reduceCodes.push($(reduceItems[i]).attr("data-code"));
                            if(result != ""){
                                result += "-" + $(reduceItems[i]).attr("data-name");
                            }else {
                                result += $(reduceItems[i]).attr("data-name");
                            }

                        }
                    }
                    var data = {
                        val:result,
                        reduceCodes:reduceCodes.join(),
                        plusCodes:plusCodes.join(),
                        rid:onerdata.rid
                    };
                    _close(data);
                });
                //全选
                $(document).on("click", ".checkAll",function () {
                    if ($(this).find("input").prop("checked")) {
                        $(this).siblings("label").find("input").prop("checked", true);
                    } else {
                        $(this).siblings("label").find("input").prop("checked", false);
                    }
                });
                $(document).on("click", ".plus-box-l label:not(.checkAll)", function () {
                    var len = $(".plus-box-l label").length - 1;
                    if ($(".plus-box-l input:checked").length == len) {
                        $(".plus-box-l .checkAll").find("input").prop("checked", true)
                    } else {
                        $(".plus-box-l .checkAll").find("input").prop("checked", false)
                    }
                });
                $(document).on("click", ".plus-box-r label:not(.checkAll)", function () {
                    var len = $(".plus-box-r label").length - 1;
                    if ($(".plus-box-r input:checked").length == len) {
                        $(".plus-box-r .checkAll").find("input").prop("checked", true)
                    } else {
                        $(".plus-box-r .checkAll").find("input").prop("checked", false)
                    }
                });
                $(document).on("click", ".reduce-box-l label:not(.checkAll)", function () {
                    var len = $(".reduce-box-l label").length - 1;
                    if ($(".reduce-box-l input:checked").length == len) {
                        $(".reduce-box-l .checkAll").find("input").prop("checked", true)
                    } else {
                        $(".reduce-box-l .checkAll").find("input").prop("checked", false)
                    }
                });
                $(document).on("click", ".reduce-box-r label:not(.checkAll)", function () {
                    var len = $(".reduce-box-r label").length - 1;
                    if ($(".reduce-box-r input:checked").length == len) {
                        $(".reduce-box-r .checkAll").find("input").prop("checked", true)
                    } else {
                        $(".reduce-box-r .checkAll").find("input").prop("checked", false)
                    }
                });
                //增加
                $(".addPlus").on("click", function () {
                    $(".plus-box-r").html("");
                    //整理选择的属性写入到已选属性中
                    var activeLi = $(".plus-box-l input:checked");
                    var toSelectedHtml = '<label class="mt-checkbox mt-checkbox-outline checkAll" ><input type="checkbox" data-code="*">全选<span></span></label>';
                    activeLi.each(function () {
                        var code = $(this).attr("data-code");
                        if (code != "*") {
                            var name = $(this).attr("data-name");
                            toSelectedHtml += '<label class="mt-checkbox mt-checkbox-outline"><input type="checkbox" data-code="' + code + '" data-name="' + name + '">' + name + '<span></span><i class="glyphicon icon-arrow-top hidden"></i><i class="glyphicon icon-arrow-bottom hidden"></i></label>'
                        }
                    });
                    $(".plus-box-r").append(toSelectedHtml);
                });
                //删除
                $(".delPlus").on("click", function () {
                    var activeLi = $(".plus-box-r input:checked");
                    var delArr = [];
                    activeLi.each(function () {
                        if ($(this).attr("data-code") != "*") {
                            $(this).closest("label").remove();
                            delArr.push($(this).attr("data-code"));
                        }
                    });
                    //可选属性相应的取消勾选
                    var selectedLi = $(".plus-box-l input:checked");
                    selectedLi.each(function () {
                        var code = $(this).attr("data-code");
                        if (delArr.indexOf(code) > -1) {
                            $(this).prop("checked", false)
                        }

                    });
                    $(".plus-box-l .checkAll").find("input").prop("checked", false);
                    $(".plus-box-r .checkAll").find("input").prop("checked", false)
                });
                //增加
                $(".addReduce").on("click", function () {
                    $(".reduce-box-r").html("");
                    //整理选择的属性写入到已选属性中
                    var activeLi = $(".reduce-box-l input:checked");
                    var toSelectedHtml = '<label class="mt-checkbox mt-checkbox-outline checkAll" ><input type="checkbox" data-code="*">全选<span></span></label>';
                    activeLi.each(function () {
                        var code = $(this).attr("data-code");
                        if (code != "*") {
                            var name = $(this).attr("data-name");
                            toSelectedHtml += '<label class="mt-checkbox mt-checkbox-outline"><input type="checkbox" data-code="' + code + '" data-name="' + name + '">' + name + '<span></span><i class="glyphicon icon-arrow-top hidden"></i><i class="glyphicon icon-arrow-bottom hidden"></i></label>'
                        }
                    });
                    $(".reduce-box-r").append(toSelectedHtml);
                });
                //删除
                $(".delReduce").on("click", function () {
                    var activeLi = $(".reduce-box-r input:checked");
                    var delArr = [];
                    activeLi.each(function () {
                        if ($(this).attr("data-code") != "*") {
                            $(this).closest("label").remove();
                            delArr.push($(this).attr("data-code"));
                        }
                    });
                    //可选属性相应的取消勾选
                    var selectedLi = $(".reduce-box-l input:checked");
                    selectedLi.each(function () {
                        var code = $(this).attr("data-code");
                        if (delArr.indexOf(code) > -1) {
                            $(this).prop("checked", false)
                        }

                    });
                    $(".reduce-box-l .checkAll").find("input").prop("checked", false)
                    $(".reduce-box-r .checkAll").find("input").prop("checked", false)
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