var lp = {};
var ptData = ufma.getCommonData();
lp.selectApi = false;
//普通的，btn个数超过一定的数量用省略号表示
lp.renderMoreBtns = function (id, data, code, name, num) {
    //渲染html
    var html = '';
    var btns = "", len = data.length;
    var restLIst = '<div class="lp-btns-list" style="display: none">';
    for (var i = 0; i < data.length; i++) {
        var dataName = data[i][name];
        if(dataName.length > 6){
            dataName = dataName.substr(0,6) + "...";
        }
        if (i < num) {
            btns += '<button class="btn btn-default" data-id="' + data[i][code] + '" title="'+data[i][name]+'">' + dataName + '</button>';
        } else {
            restLIst += '<button class="btn btn-default" value="" data-id="' + data[i][code] + '" style="display: block" title="'+data[i][name]+'">' + dataName + '</button>';
        }
    }
    restLIst += "</div>";
    if (len > num) {
        btns += '<span class="lp-rest-sign">...</span>';
    }
    btns += restLIst;
    html += btns;
    $(id).html("").append(html);
    $(id).find("button").eq(0).attr("class","btn btn-primary");
};
//有“全部”的btn，btn个数超过一定的数量用省略号表示
lp.btnsAddAll = function (id, data, code, name, num) {
    //渲染html
    var html = '<button class="btn btn-default" data-id="">全部</button>';
    var btns = "", len = data.length;
    var restLIst = '<div class="lp-btns-list" style="display: none">';
    for (var i = 0; i < data.length; i++) {
        var name = data[i][name];
        if(name.length > 6){
            name = name.substr(0,6) + "...";
        }
        if (i < num) {
            btns += '<button class="btn btn-default" data-id="' + data[i][code] + '" title="'+data[i][name]+'">' + data[i][name] + '</button>';
        } else {
            restLIst += '<button class="btn btn-default" value="" data-id="' + data[i][code] + '" style="display: block" title="'+data[i][name]+'">' + data[i][name] + '</button>';
        }
    }
    restLIst += "</div>";
    if (len > num) {
        btns += '<span class="lp-rest-sign">...</span>';
    }
    btns += restLIst;
    html += btns;
    $(id).html("").append(html);
    $(id).find("button").eq(0).attr("class","btn btn-primary");
};
/*
* 带数量标志的，btn个数超过一定的数量用省略号表示
* id:父级id
* data:需要展示的数据
* code:数据code
* name:数据name
* count:展示的数据为几个
* num:后面展示的数据个数，例（10）
* usedId:正在使用的id
* */
lp.renderMoreBtnsWithNum = function (id, data, code, name, count, num, usedId) {
    //渲染html
    var html = '';
    var btns = "", len = data.length;
    var restLIst = '<div class="lp-btns-list" style="display: none">';
    for (var i = 0; i < data.length; i++) {
        var dataName = data[i][name];
        if(dataName.length > 6){
            dataName = dataName.substr(0,6) + "...";
        }
        if (i < num) {
            if(usedId && data[i][code] == usedId){
                btns += '<button class="btn btn-primary" data-toggle="tooltip"  data-id="' + data[i][code] + '" data-name="'+data[i][name]+'" title="'+data[i][name]+'">' + dataName + '<span class="badge">(' + data[i][count] + ')</span></button>';
            }else{
                btns += '<button class="btn btn-default" data-toggle="tooltip"  data-id="' + data[i][code] + '" data-name="'+data[i][name]+'" title="'+data[i][name]+'">' + dataName + '<span class="badge">(' + data[i][count] + ')</span></button>';
            }
        } else {
            if(usedId && data[i][code] == usedId) {
                restLIst += '<button class="btn btn-primary" data-toggle="tooltip" value="" data-id="' + data[i][code] + '" data-name="'+data[i][name]+'" style="display: block" title="'+data[i][name]+'">' + dataName + '<span class="badge">(' + data[i][count] + ')</span></button>';
            }else{
                restLIst += '<button class="btn btn-default" data-toggle="tooltip" value="" data-id="' + data[i][code] + '" data-name="'+data[i][name]+'" style="display: block" title="'+data[i][name]+'">' + dataName + '<span class="badge">(' + data[i][count] + ')</span></button>';
            }
        }
    }
    restLIst += "</div>";
    if (len > num) {
        btns += '<span class="lp-rest-sign">...</span>';
    }
    btns += restLIst;
    html += btns;
    $(id).html("").append(html);
    if(!usedId){
        $(id).find("button").eq(0).attr("class","btn btn-primary");
    }
};

//普通的单选，btn个数超过一定的数量用省略号表示
lp.renderMoreRadios = function (id, data, code, name, num) {
    //渲染html
    var html = '';
    var btns = "", len = data.length;
    var restLIst = '<div class="lp-btns-list" style="display: none">';
    for (var i = 0; i < data.length; i++) {
        if (i < num) {
            btns += '<label class="mt-radio mt-radio-outline margin-right-8" data-toggle="tooltip" title="'+data[i][name]+'">' +
                '<input type="radio" vou-tmp-name = "' + data[i][name] + '" vou-tmp-id ="' + data[i][code] + '" name="tempName" >' + data[i][name] + '&nbsp;<span></span>' +
                '</label>';
        } else {
            restLIst += '<label class="mt-radio mt-radio-outline margin-right-8" data-toggle="tooltip" title="'+data[i][name]+'">' +
                '<input type="radio" vou-tmp-name = "' + data[i][name] + '" vou-tmp-id ="' + data[i][code] + '" name="tempName" >' + data[i][name] + '&nbsp;<span></span>' +
                '</label>';
        }
    }
    restLIst += "</div>";
    if (len > num) {
        btns += '<span class="lp-rest-sign">...</span>';
    }
    btns += restLIst;
    html += btns;
    $(id).html("").append(html);
};
//初始化单据方案
lp.initBillSchemes = function () {
    $("#vgBillType").ufCombox({
        idField:"schemeGuid",
        textField:"schemeName",
        // data:data, //json 数据
        placeholder:"请选择单据方案",
        onComplete: function (sender) {
            // 业务单据记账页 记录的条件设置
            ufma.ajaxDef('/pub/user/menu/config/select?agencyCode=' + lp.agencyCode + '&acctCode='+ $("#cbAcct").getObj().getValue() +'&menuId=e9d34f53-00e0-491e-aac5-e481156e91ef', "get", '', function(data) {
                lp.configSelect = data.data;
            })
        }
    });
};
/*
* 渲染单据方案下拉（凭证生成和日志通用）
* agencyId：单位id
* */
lp.getUrlParam=function(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象 
    var r = window.location.search.substr(1).match(reg); //匹配目标参数 
    if(r != null)
        return unescape(r[2]);
    return null; //返回参数值 
},
lp.renderBillSchemes = function (agencyId, clearVgMoreQuery, setRememberData) {
    var url = "/lp/scheme/getBussinessSchemeTypes";
    var argu = {
        acctCode:$("#cbAcct").getObj().getValue(),
        accsCode:$("#cbAcct").getObj().getItem().accsCode,
        agencyCode:agencyId,
        rgCode:ptData.svRgCode,
        setYear:ptData.svSetYear,
        agencyTypeCode: $("#cbAcct").getObj().getItem().agencyTypeCode,
        isInternalSystem : "1",
        sysId : 'ZC' 
    }
    ufma.get(url, argu, function (result) {

        // var data = result.data;
        var newData = [];
        for (var i = 0; i < result.data.length; i++) {
            if (result.data[i].dataSrcType != "00") {//00是内部子系统
                newData.push(result.data[i])
            }
        }
        var len = newData.length;
        $("#vgBillType").ufCombox({
            data: newData,
            onChange:function(sender,data){
                // 业务单据记账页 记录的条件设置
                ufma.ajaxDef('/pub/user/menu/config/select?agencyCode=' + lp.agencyCode + '&acctCode='+ $("#cbAcct").getObj().getValue() +'&menuId=e9d34f53-00e0-491e-aac5-e481156e91ef', "get", '', function(data) {
                    lp.configSelect = data.data;
                    if (lp.configSelect) {
                        lp.vgBillTypeChange = true;
                    }
                })
                $(".lp-vou-li").addClass("hidden");
                $(".lp-single-vou").addClass("hidden");
                $(".lp-double-vou").addClass("hidden");
                lp.IS_DOUBLE_VOU = false;
                lp.ISDORS = false;
                lp.SINGLE = false;
                //渲染模版名称
                if($(".billGenetateAccount").length == 0){
                    lp.renderSchemeNames(agencyId, data.schemeGuid, "");
                }else{
                    lp.renderSchemeNames(agencyId, data.schemeGuid, $("#cbAcct").getObj().getValue());
                }
                lp.schemeData = data;
                //清除条件设置
                clearVgMoreQuery();
                var timeId = setTimeout(function(){
                    clearTimeout(timeId);
                    $(".btn-query").trigger("click");
                },500)
            },
            onComplete:function(sender){
                $("#vgBillType_input").attr("autocomplete", "off");
                if(result.data.length > 0){
                    if(lp.getUrlParam('schemeGuid')!=null){
                        //如果从“单据查询”页面跳转过来
                        //按照类型分别跳转到“未生成”和“已生成”标签页
                        var type = lp.getUrlParam('type'),mainid = lp.getUrlParam('mainid');
                        if(type ==='2'){
                            $("#assetBooking .nav-tabs li").eq(1).trigger("click");
                        }else{
                            $("#assetBooking .nav-tabs li").eq(0).trigger("click");
                        }
                        //将日期从“本期”改成“本年”
                        $("#vgTime").find("#vgTimeYear").trigger("click");
                        //获取单据编号并赋值
                        $("#vgBillType").getObj().val(lp.getUrlParam('schemeGuid'));
                        var selfInterval = setInterval(function(){
                            //如果表格内有了数据
                            if($('#assetBooking-data tbody tr').eq(0).find('td.dataTables_empty').length===0&&$('#assetBooking-data tbody tr').length>0){
                                $('.searchHide').val(mainid);
                                $('#searchHideBtn').trigger("click");
                                clearInterval(selfInterval);
                            }
                        },300);
                    }else if (!$.isNull(lp.rememberData) && !$.isNull(lp.rememberData.vgBillType)){
                        //有存储的值就用存储的
                        $("#vgBillType").getObj().val(lp.rememberData.vgBillType);
                    }else{
                        var schemeGuid = newData[0].schemeGuid;
                        $("#vgBillType").getObj().val(schemeGuid);
                    }
                }else{
                    ufma.showTip('查询单据方案结果为空！',function(){},'warning');
                }
            }
        });
    });

};
//初始化模版名称
lp.initSchemeNames = function (callback,bottomdata) {
    $("#temName").ufCombox({
        idField:"VOU_TMP_GUID",
        textField:"VOU_TMP_NAME",
        // data:data, //json 数据
        placeholder:"请选择凭证模版",
        onChange:function(sender,data){
            callback(data);
            bottomdata();
            
        },
        onComplete:function(sender){
            $("#temName_input").attr("autocomplete", "off");
        }
    });
};
/*
* 渲染模版名称
* agencyId:单位id
* schemeGuid:单据方案id
* */
lp.renderSchemeNames = function (agencyId,schemeGuid,acctCode,setRememberData) {
    var URL = "/lp/template/getYwdjTemplateNames";
    var url = URL + "?agencyCode=" + agencyId + "&schemeGuid=" + schemeGuid + "&acctCode=" + acctCode + "&accsCode=" + $("#cbAcct").getObj().getItem().accsCode+ "&agencyTypeCode=" + $("#cbAcct").getObj().getItem().agencyTypeCode;
    var argu = {
        rgCode: ptData.svRgCode,
        setYear: ptData.svSetYear
    };
    ufma.get(url, argu, function (result) {
        lp.temNum = result.data.length;
        $("#temName").getObj().load(result.data);
        if(result.data.length > 0){
            if (!$.isNull(lp.rememberData) && !$.isNull(lp.rememberData.temName)) {
                $("#temName").getObj().val(lp.rememberData.temName);
            }else{
                $("#temName").getObj().val(result.data[0].VOU_TMP_GUID);
            }
        }
    });
};
/**
 * key 保存项名称
 * value 保存项值
 */
lp.rememberItem = function (argu) {
    ufma.post("/pub/user/menu/config/updateMultiple", argu, function () {

    })
};
//获取默认数据
lp.getRememberData = function (callback) {
    lp.rememberData = "";
    var argu = {
        agencyCode: lp.agencyCode,
        acctCode: $("#cbAcct").getObj().getValue(),
        menuId: "e9d34f53-00e0-491e-aac5-e481156e91ef"
    };
    ufma.get("/pub/user/menu/config/select", argu, function (result) {
        lp.rememberData = result.data;
        callback(result.data)
    })
}
