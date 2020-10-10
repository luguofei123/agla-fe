$(function () {
    var page = function () {
        var portList = {
            expXmlFile:"/de/expAudit/expXmlFile"//导出
        };

        return {
            //初始化渲染单位类型、预算管理级次、经费来源、期间范围
            initAgencyType:function(){
                //单位类型
                var agencyTypeData = [
                    {chrCode:1,chrName:"行政单位"},
                    {chrCode:2,chrName:"事业单位"},
                    {chrCode:3,chrName:"其他"}
                ];
                $("#DWLX").ufCombox({
                    idField: "chrCode",
                    textField: "chrName",
                    data: agencyTypeData, //json 数据
                    placeholder: "",
                    onChange: function (sender, data) {
                    },
                    onComplete: function (sender) {
                        $("#DWLX").getObj().val(agencyTypeData[0].chrCode);
                    }
                });
                //预算管理级次
                var ysgljcData = [
                    {chrCode:1,chrName:"一级预算单位"},
                    {chrCode:2,chrName:"二级预算单位"},
                    {chrCode:3,chrName:"三级预算单位"},
                ];
                $("#YSGLJC").ufCombox({
                    idField: "chrCode",
                    textField: "chrName",
                    data: ysgljcData, //json 数据
                    placeholder: "",
                    onChange: function (sender, data) {
                    },
                    onComplete: function (sender) {
                        $("#YSGLJC").getObj().val(ysgljcData[0].chrCode);
                    }
                });
                //经费来源
                var jflyData = [
                    {chrCode:1,chrName:"全额拨款"},
                    {chrCode:2,chrName:"差额补贴"},
                    {chrCode:3,chrName:"自收自支"},
                ];
                $("#JFLY").ufCombox({
                    idField: "chrCode",
                    textField: "chrName",
                    data: jflyData, //json 数据
                    placeholder: "",
                    onChange: function (sender, data) {
                    },
                    onComplete: function (sender) {
                        $("#JFLY").getObj().val(jflyData[0].chrCode);
                    }
                });
                //期间范围月份
                var monthData = [];
                for(var i = 1;i<13;i++){
                    monthData.push({code:i,name:i});
                }
                $("#expmonthfrom").ufCombox({
                    idField: "code",
                    textField: "name",
                    data: monthData, //json 数据
                    placeholder: "",
                    onChange: function (sender, data) {
                    },
                    onComplete: function (sender) {
                        $("#expmonthfrom").getObj().val(monthData[0].code);
                    }
                });

                $("#expmonthto").ufCombox({
                    idField: "code",
                    textField: "name",
                    data: monthData, //json 数据
                    placeholder: "",
                    onChange: function (sender, data) {
                    },
                    onComplete: function (sender) {
                        $("#expmonthto").getObj().val(monthData[monthData.length -1].code);
                    }
                });
                //导出年度
                var yearData = [];
                var nowData = new Date();
                var nowYear = nowData.getFullYear();
                yearData.push({code:nowYear,name:nowYear});
                for(var i = 1;i<10;i++){
                    yearData.push({code:nowYear-i,name:nowYear-i});
                }
                $("#svFiscalYear").ufCombox({
                    idField: "code",
                    textField: "name",
                    data: yearData, //json 数据
                    placeholder: "",
                    onChange: function (sender, data) {
                    },
                    onComplete: function (sender) {
                        $("#svFiscalYear").getObj().val(yearData[0].code);
                    }
                });
            },
            getTxt1CursorPosition: function(oTxt1) {

                oTxt1.focus();

                var cursurPosition = -1;

                if (oTxt1.selectionStart) { //非IE浏览器
                    cursurPosition = oTxt1.selectionStart;

                } else { //IE
                    var range = document.selection.createRange();

                    range.moveStart("character", -oTxt1.value.length);

                    cursurPosition = range.text.length;

                }

                return cursurPosition;

            },
            setTxt1CursorPosition: function(oTxt1, i) {

                var cursurPosition = -1;

                if (oTxt1.selectionStart) { //非IE浏览器
                    //selectionStart我的理解是文本选择的开始位置
                    oTxt1.selectionStart = i + 1;

                    //selectionEnd我的理解是文本选择的结束位置
                    oTxt1.selectionEnd = i + 1;

                    oTxt1.focus();

                } else { //IE
                    var range = oTxt1.createTextRange();

                    range.move("character", i);

                    range.select();

                }

            },
            /**
             * key 保存项名称
             * value 保存项值
             */
            rememberItem: function (key, value) {
                var argu = {
                    "agencyCode": pfData.svAgencyCode,
                    "acctCode": pfData.svAcctCode,
                    "menuId": "7e22a815-935d-4e40-9bf3-93b692689d46",
                    "configKey": key,
                    "configValue": value
                };
                ufma.post("/pub/user/menu/config/update", argu, function () {

                })
            },
            //获取默认数据
            getRememberData: function () {
                var argu = {
                    agencyCode: pfData.svAgencyCode,
                    acctCode: pfData.svAcctCode,
                    menuId: "7e22a815-935d-4e40-9bf3-93b692689d46"
                };
                ufma.get("/pub/user/menu/config/select", argu, function (result) {
                    var data = result.data;
                    $("#XZQH").val(data.XZQH);
                    $("#zzjgdm").val(data.zzjgdm);
                })
            },
            initPage: function () {
                page.getRememberData();
                //请求科目体系
                rpt2.reqAccsList();
                //初始化下拉列表
                page.initAgencyType();
                var timeId = setTimeout(function () {
                    //左侧树高度
                    var h = $(window).height() -88;
                    $(".rpt-acc-box-left").height(h);
                    var H = $(".rpt-acc-box-right").height();
                    if(H > h){
                        $(".rpt-acc-box-left").height(h + 48);
                        if($("#tool-bar .slider").length > 0){
                            $(".rpt-acc-box-left").height(h + 52);
                        }
                    }
                    $(".rpt-atree-box-body").height($(".rpt-acc-box-left").height() - 126);
                    clearTimeout(timeId);
                },200);
            },
            backTabArgu: function () {
                var treeObj = $.fn.zTree.getZTreeObj("atree");
                var nodes = treeObj.getCheckedNodes(true);//获取选中的单位账套
                var tabArgu = {}, acctArr = [], agencyArr = [],acctNameArr = [], agencyNameArr = [];
                var len = nodes.length;
                if(len == 0){
                    ufma.showTip("请选择至少一个账套",function () {

                    },"warning");
                    return false
                }
                for (var i = 0; i < len; i++) {
                    if (nodes[i].isAcct) {//选取账套信息
                        acctArr.push(nodes[i]["acctCode"]);
                        acctNameArr.push(nodes[i]["acctName"]);
                        agencyArr.push(nodes[i]["agencyCode"]);
                        agencyNameArr.push(nodes[i]["agencyName"]);
                    }
                }
                tabArgu.acctCode = acctArr.join();//账套代码
                tabArgu.agencyCode = agencyArr.join();//单位代码
                tabArgu.acctName= acctNameArr.join();//账套代码
                tabArgu.agencyName = agencyNameArr.join();//单位代码
                return tabArgu;
            },
            onEventListener: function () {
                $("#XZQH").on("input",function (e) {
                    e.stopPropagation();
                    //获取光标位置
                    var Txt1Curs = page.getTxt1CursorPosition(this);
                    var texv;
                    if(e.keyCode != 8 && e.keyCode != 37 && e.keyCode != 39) {
                        texv = $(this).val().replace(/[^\d]/g, '')
                    }
                    if (this.value.length > texv.length) {

                        this.value = texv;

                        //设置光标位置
                        page.setTxt1CursorPosition(this, Txt1Curs - 2);

                    } else if (texv != this.value) {

                        this.value = texv;

                        if ((Txt1Curs - 1) % 5 == 4) {

                            //设置光标位置
                            page.setTxt1CursorPosition(this, Txt1Curs);

                        } else {

                            //设置光标位置
                            page.setTxt1CursorPosition(this, Txt1Curs - 1);

                        }
                    }
                    page.setTxt1CursorPosition(this, Txt1Curs - 1);
                    if($(this).val() > 6){
                        $(this).val($(this).val().substr(0,6));
                    }
                });
                $("#XZQH").on("blur",function () {
                    if($(this).val() != "" && $(this).val().length != 6){
                        ufma.showTip("行政区划代码为6位数",function () {

                        },"warning");
                    }
                });
                $("#zzjgdm").on("input",function (e) {
                    e.stopPropagation();
                    //获取光标位置
                    var Txt1Curs = page.getTxt1CursorPosition(this);
                    var texv;
                    if(e.keyCode != 8 && e.keyCode != 37 && e.keyCode != 39) {
                        texv = $(this).val().replace(/[^\d] || [^[A-Z]/g, '')
                    }
                    if (this.value.length > texv.length) {

                        this.value = texv;

                        //设置光标位置
                        page.setTxt1CursorPosition(this, Txt1Curs - 2);

                    } else if (texv != this.value) {

                        this.value = texv;

                        if ((Txt1Curs - 1) % 5 == 4) {

                            //设置光标位置
                            page.setTxt1CursorPosition(this, Txt1Curs);

                        } else {

                            //设置光标位置
                            page.setTxt1CursorPosition(this, Txt1Curs - 1);

                        }
                    }
                    page.setTxt1CursorPosition(this, Txt1Curs - 1);
                });
                $("#expXmlFile").on("click",function () {
                    var backTabArgu = page.backTabArgu();
                    if(!backTabArgu){
                        return false
                    }
                    var argu = $('#frmQuery').serializeObject();
                    if(argu.zzjgdm == ""){
                        ufma.showTip("请填写组织机构代码");
                        return false
                    }
                    if(argu.XZQH != "" && argu.XZQH.length != 6){
                        ufma.showTip("请填写六位行政区划代码");
                        return false
                    }
                    if(argu.svFiscalYear == ""){
                        ufma.showTip("导出会计年度不能为空");
                        return false
                    }
                    if(argu.expmonthfrom == ""){
                        ufma.showTip("起始期间不能为空");
                        return false
                    }
                    if(argu.expmonthto == ""){
                        ufma.showTip("截止期间不能为空");
                        return false
                    }
                    if(parseInt(argu.expmonthfrom)>parseInt(argu.expmonthto)){
                        ufma.showTip("期间范围截止期间不能早于起始期间");
                        return false
                    }
                    if($("#DWLX").getObj().getText() == ""){
                        ufma.showTip("单位类型不能为空");
                        return false;
                    }
                    if($("#YSGLJC").getObj().getText() == ""){
                        ufma.showTip("预算管理级次不能为空");
                        return false;
                    }
                    if($("#JFLY").getObj().getText() == ""){
                        ufma.showTip("经费来源不能为空");
                        return false;
                    }

                    var pfData = ufma.getCommonData();
                    var url = portList.expXmlFile + "?svFiscalYear=" + $("#svFiscalYear").getObj().getValue()
                        + '&expmonthfrom=' + $("#expmonthfrom").getObj().getValue()
                        + '&expmonthto=' + $("#expmonthto").getObj().getValue()
                        + '&SJFW=GL'
                        + '&agencyCode=' + backTabArgu.agencyCode
                        + '&agencyName=' + backTabArgu.agencyName
                        + '&acctCode=' + backTabArgu.acctCode
                        + '&acctName=' + backTabArgu.acctName
                        + '&userId=' + pfData.svUserId
                        + '&userName=' + pfData.svUserName
                        + '&setYear=' + pfData.svSetYear
                        + '&rgCode=' + pfData.svRgCode
                        + '&DWLX=' + $("#DWLX").getObj().getText()
                        + '&SSHY=' + argu.SSHY
                        + '&XZQH=' + argu.XZQH
                        + '&YSGLJC=' + $("#YSGLJC").getObj().getText()
                        + '&JFLY=' + $("#JFLY").getObj().getText();
                    window.location.href = url;
                    // if($("#auditDownload").length > 0){
                    //     $("#auditDownload").remove();
                    // }
                    // var aHtml = '<a href='+url+' id="auditDownload">下载</a>';
                    // $("body").append(aHtml);
                    // $("#auditDownload").trigger("click");

                });
                // $(document).on("blur", "#XZQH", function () {
                //     page.rememberItem("XZQH", $(this).val());
                // });
                // $(document).on("blur", "#zzjgdm", function () {
                //     page.rememberItem("zzjgdm", $(this).val());
                // })
            },
            //此方法必须保留
            init: function () {
                page.reslist = ufma.getPermission();
                ufma.isShow(page.reslist);
                ufma.parse();
                ufma.parseScroll();
                this.initPage();
                this.onEventListener();
            }
        }
    }();

    /////////////////////
    page.init();
    $(window).scroll(function () {
        if ($(this).scrollTop() > 30) {
            $(".rpt-acc-box-left").css("top", "12px");
        } else {
            $(".rpt-acc-box-left").css("top", "58px");
        }
    })
});