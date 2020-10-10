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
        getHistoryYearAndMonth: "/prs/prscalcdata/getHistoryYearAndMonth",//获取历史年，历史月份，历史批次
        changePrsCalcData: "/prs/prscalcdata/changePrsCalcData",//替换功能数据
        getPrsOrgEmpTree:"/prs/emp/prsOrg/getPrsOrgEmpTree"//获取部门人员
    };
    window.setData = function(data){
        page.orgcodes = data.orgcodes;
        page.empuids = data.empuids;
        var empuidsArr = data.empuidsArr;
        var html = '',title='';
        for(var i=0;i<empuidsArr.length;i++){
            html += '<span data-id="'+empuidsArr[i].id+'">'+empuidsArr[i].name+'</span>'+ '，' ;
            title += empuidsArr[i].name + "，"
        }
        $("#empuids").html("");
        $("#empuids").append(html.substr(0,html.length-1));
        $("#empuids").attr("title",title.substr(0,title.length-1))

    }
    var pageLength = 25;

    var page = function () {
        return {
            //初始化工资项目树
            initDepartment: function () {
                var moveItem = ownerData.searchDatas.moveItem;
                var pritemData = [],pritemData2 = [];
                for(var y=0;y<moveItem.length;y++){
                    for(var i in moveItem[y]){
                        var obj = {
                            pritemCode:i,
                            pritemName:moveItem[y][i]
                        };
                        pritemData.push(obj)
                        var obj2 = {
                            pritemCode2:i,
                            pritemName2:moveItem[y][i]
                        }
                        pritemData2.push(obj2)
                    }
                }
                
                $("#pritem1").ufTextboxlist({//初始化
                    idField: 'pritemCode',//可选
                    textField: 'pritemName',//可选
                    pIdField: 'pId',//可选
                    async: false,//异步
                    data:pritemData,//列表数据
                    // icon:'icon-book',
                    onChange: function (sender, treeNode) {
                    }
                });
            
                $("#pritem2").ufTextboxlist({//初始化
                    idField: 'pritemCode2',//可选
                    textField: 'pritemName2',//可选
                    pIdField: 'pId',//可选
                    async: false,//异步
                    data:pritemData2,//列表数据
                    // icon:'icon-book',
                    onChange: function (sender, treeNode) {
                    }
                });

            },
            //初始化工资类别，历史年，历史月，历史月批次，导入人员
            initWageType: function () {
                //工资类别
                $("#prtypeCode").ufCombox({
                    idField: "prtypeCode",
                    textField: "prtypeName",
                    data: ownerData.prsTypeCos, //json 数据
                    placeholder: "请选择工资类别",
                    onChange: function (sender, data) {
                    	var argu = $('#frmQuery').serializeObject();
                    	var newArgu = {
                    		prsType:argu.prtypeCode
                    	}
                    	ufma.post(interfaceURL.getHistoryYearAndMonth,newArgu,function(result){
                            var data = result.data;
                            //历史年
                            var yearData = [];
                            for(var i =0;i<data.years.length;i++){
                                var obj = {
                                    yearCode:data.years[i],
                                    yearName:data.years[i]
                                }
                                yearData.push(obj);
                            }
                            $("#setYear").getObj().load(yearData);
                            if(yearData.length > 0){
                                $("#setYear").getObj().val(yearData[0].yearCode);
                            }
                            //历史月
                            var payListSummary = data.payListSummary,moData = [];
                            page.payNoMoData = {};
                            moTemp = [];
                            for(var i=0;i<payListSummary.length;i++){
                                var key;
                                var noMoData = [];
                                for(var y in payListSummary[i]){
                                    if(y == "MO"){
                                        if(payListSummary[i][y] == ""){
                                            var obj = {moCode:"empty",moName:"empty"};
                                            moData.push(obj);
                                            key = "empty";
                                        }else{
                                            var obj = {moCode:payListSummary[i][y],moName:payListSummary[i][y]};
                                            //如果moData中已经包含这个月份数据则不再增加
                                            if(moTemp.indexOf(payListSummary[i][y]) == -1){
                                            	moData.push(obj);
                                            	moTemp.push(payListSummary[i][y]);
                                            }
                                            key = payListSummary[i][y];
                                        }
                                    }else{
                                        var obj = {PayNoMoCode:payListSummary[i][y],PayNoMoName:payListSummary[i][y]};
                                        //如果月份数据中有批次数据则将批次数据取出来再把新的数据加进去
                                        if(moTemp.indexOf(key)>-1 && page.payNoMoData[key]!=null){
                                        	noMoData = page.payNoMoData[key];
                                        }
                                        noMoData.push(obj)
                                    }
                                    
                                }
                                page.payNoMoData[key] = noMoData;

                                
                            }
                            
                            $("#mo").getObj().load(moData);
                            if(moData.length > 0){
                                $("#mo").getObj().val(moData[0].moCode);
                            }else{
                            	$("#payNoMo").getObj().load();
                            }
                            

                        })
                    },
                    onComplete: function (sender) {
                        $("#prtypeCode").getObj().val(ownerData.prtypeCodes.join())
                        // $("input").attr("autocomplete", "off");
                    }
                });
                //历史年
                $("#setYear").ufCombox({
                    idField: "yearCode",
                    textField: "yearName",
                    // data: data, //json 数据
                    placeholder: "请选择历史年",
                    onChange: function (sender, data) {
                    },
                    onComplete: function (sender) {
                        // $("input").attr("autocomplete", "off");
                    }
                });
                //历史月
                $("#mo").ufCombox({
                    idField: "moCode",
                    textField: "moName",
                    // data: data, //json 数据
                    placeholder: "请选择历史月",
                    onChange: function (sender, data) {
                         //历史月批次
                    $("#payNoMo").getObj().load(page.payNoMoData[data.moCode]);
                    $("#payNoMo").getObj().val(page.payNoMoData[data.moCode][0].PayNoMoCode);
                        
                    },
                    onComplete: function (sender) {
                        // $("input").attr("autocomplete", "off");
                    }
                });
                //历史月批次
                $("#payNoMo").ufCombox({
                    idField: "PayNoMoCode",
                    textField: "PayNoMoName",
                    // data: data, //json 数据
                    placeholder: "历史月批次",
                    onChange: function (sender, data) {
                    },
                    onComplete: function (sender) {
                        // $("input").attr("autocomplete", "off");
                    }
                });
                page.getWageType();
            },
        
            //获取工资类别，历史年，历史月，历史月批次，导入人员
            getWageType: function () {
                var argu= {
                    prsType:ownerData.prtypeCodes.join(",")
                };
                ufma.post(interfaceURL.getHistoryYearAndMonth,argu,function(result){
                    var data = result.data;
                    //历史年
                    var yearData = [];
                    for(var i =0;i<data.years.length;i++){
                        var obj = {
                            yearCode:data.years[i],
                            yearName:data.years[i]
                        }
                        yearData.push(obj);
                    }
                    $("#setYear").getObj().load(yearData);
                    if(yearData.length > 0){
                        $("#setYear").getObj().val(yearData[0].yearCode);
                    }
                    //历史月
                    var payListSummary = data.payListSummary,moData = [];
                    page.payNoMoData = {};
                    moTemp = [];
                    for(var i=0;i<payListSummary.length;i++){
                        var key;
                        var noMoData = [];
                        for(var y in payListSummary[i]){
                            if(y == "MO"){
                                if(payListSummary[i][y] == ""){
                                    var obj = {moCode:"empty",moName:"empty"};
                                    moData.push(obj);
                                    key = "empty";
                                }else{
                                    var obj = {moCode:payListSummary[i][y],moName:payListSummary[i][y]};
                                    //如果moData中已经包含这个月份数据则不再增加
                                    if(moTemp.indexOf(payListSummary[i][y]) == -1){
                                    	moData.push(obj);
                                    	moTemp.push(payListSummary[i][y]);
                                    }
                                    key = payListSummary[i][y];
                                }
                            }else{
                                var obj = {PayNoMoCode:payListSummary[i][y],PayNoMoName:payListSummary[i][y]};
                                //如果月份数据中有批次数据则将批次数据取出来再把新的数据加进去
                                if(moTemp.indexOf(key)>-1 && page.payNoMoData[key]!=null){
                                	noMoData = page.payNoMoData[key];
                                }
                                noMoData.push(obj)
                            }
                            
                        }
                        page.payNoMoData[key] = noMoData;

                        
                    }
                    
                    $("#mo").getObj().load(moData);
                    if(moData.length > 0){
                        $("#mo").getObj().val(moData[0].moCode);
                    }
                    

                })
                
                
            },
            //获取可选属性
            getProoerties: function (selectedArr) {
                var data = [
                    {code: "1", name: "人员唯一ID"},
                    {code: "2", name: "是否单位内人员"},
                    {code: "3", name: "人员类别代码"},
                    {code: "4", name: "薪资"},
                    {code: "5", name: "工资部门"}
                ];
                var html = "<div class='list'></div>";
                $(".selectabled .sel-box").append(html);
                var liHtml = '<label class="mt-checkbox mt-checkbox-outline checkAll" ><input type="checkbox" data-code="*">全选<span></span></label>';
                for (var i = 0; i < data.length; i++) {
                    if (selectedArr.indexOf(data[i].code) < 0) {
                        liHtml += '<label class="mt-checkbox mt-checkbox-outline"><input type="checkbox" data-code="' + data[i].code + '" data-name="' + data[i].name + '">' + data[i].name + '<span></span></label>'
                    } else {
                        liHtml += '<label class="mt-checkbox mt-checkbox-outline"><input type="checkbox" checked="checked" data-code="' + data[i].code + '" data-name="' + data[i].name + '">' + data[i].name + '<span></span></label>'
                    }
                }
                $(".selectabled .sel-box").find(".list").append(liHtml);
                if (selectedArr.length == data.length) {
                    $(".selectabled").find(".checkAll").attr("checked");
                }
            },
            //获取已选属性
            getSelectedProoerties: function () {
                var data = [
                    {code: "1", name: "人员唯一ID"},
                    {code: "2", name: "是否单位内人员"},
                ];
                var selectedArr = [];
                var html = "<ul class='list'></ul>";
                $(".selected .sel-box").append(html);
                var liHtml = '<label class="mt-checkbox mt-checkbox-outline checkAll"><input type="checkbox" data-code="*">全选<span></span></label>';
                for (var i = 0; i < data.length; i++) {
                    selectedArr.push(data[i].code);
                    liHtml += '<label class="mt-checkbox mt-checkbox-outline"><input type="checkbox" data-code="' + data[i].code + '" data-name="' + data[i].name + '">' + data[i].name + '<span></span><i class="glyphicon icon-arrow-top hidden"></i><i class="glyphicon icon-arrow-bottom hidden"></i></label>'
                }
                $(".selected .sel-box").find(".list").append(liHtml);
                page.getProoerties(selectedArr);
            },
            initPage: function () {
                //权限控制
                page.reslist = ufma.getPermission();
                ufma.isShow(page.reslist);
                page.initDepartment();
                page.initWageType();
                // page.getSelectedProoerties();
                $(".prtyNames").text(ownerData.prtyNames);
            },
            onEventListener: function () {
                //关闭
                $("#btn-close").on("click", function () {
                    _close();
                });
                //确定
                $("#btn-sure").on("click", function () {
                    var argu = $('#frmQuery').serializeObject();
                    var newArgu = {
                        "prtypeCodeTarget":ownerData.prtypeCodes.join(), //目标类别
                        "prtypeCodeCome":argu.prtypeCode, //来源类别
                        "pritem1":argu.pritemCode.split(","),//目标项工资项
                        "pritem2":argu.pritemCode2.split(","),//来源项工资项
                        "setYear":argu.setYear, //历史年
                        "payNoMo":argu.payNoMo,//历史批次
                        "mo":argu.mo,//历史月份
                        "agencyCode":svData.svAgencyCode,//单位
                        "orgcodes":page.orgcodes,//部门
                        "empuids":page.empuids//
                    }
                    if ($.isNull(argu.pritemCode) || $.isNull(argu.pritemCode2)) {
                    	ufma.showTip("来源项与目标项不能为空！","","warning")
                        return false
                    }
                    if (argu.pritemCode.split(",").length != argu.pritemCode2.split(",").length) {
                    	ufma.showTip("来源项与目标项不匹配！","","warning")
                        return false
                    }
                    ufma.post(interfaceURL.changePrsCalcData,newArgu,function(result){
                        var closeData = {
                            action:"save",
                            msg:result.msg,
                            flag:result.flag
                        }
                        _close(closeData);
                    })
                    
                });
                $("#empuids").on("click",function(){
                    var val = [], spans= $("#empuids span");
                    for(var i=0;i<spans.length;i++){
                        val.push($(spans[i]).attr("data-id"))
                    }
                    if(val.length == 0){
                        localStorage.removeItem("prsEmpudsVal")
                    }else{
                        localStorage.setItem("prsEmpudsVal",JSON.stringify(val))
                    }
                    
                    ownerData.openSelEmp();
                })
                
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