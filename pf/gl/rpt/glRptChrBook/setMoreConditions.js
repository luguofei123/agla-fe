$(function () {
    window._close = function (state) {
        if (window.closeOwner) {
            var data = {
                action: state,
                result: {}
            };
            window.closeOwner(data);
        }
    };
    var ptData = ufma.getCommonData();
    var treeObj;
    var page = function () {

        //余额表所用接口
        var portList = {};


        return {
            initPzzh: function () {
                //凭证号
                $("#rptPzzhSelect").ufCombox({
                    idField: 'code',
                    textField: 'name',
                    onChange: function (sender, data) {
                        // 重新加载会计科目
                        var accItemArgu = {
                            "acctCode": window.ownerData.acctCode,
                            "agencyCode": window.ownerData.agencyCode,
                            "setYear": rpt.nowSetYear,
                            "userId": rpt.nowUserId,
                            "eleCode": 'ACCO',
                            "vouTypeCode": data.id
                        };
                        var accaCode = $(this).attr("data-code");
                        if (accaCode != undefined && accaCode != "") {
                            accItemArgu.accaCode = accaCode;
                        } else {
                            accItemArgu.accaCode = "*";
                        }
                        ufma.get("/gl/common/glAccItemData/getAccItemTree", accItemArgu, function (result) {
                            page.renderAcco(result.data); // 渲染会计科目树
                        })
                    },
                    onComplete: function (sender) {

                    }
                });
                //凭证来源
                $("#vouSource").ufCombox({
                    idField: 'ENU_CODE',
                    textField: 'ENU_NAME',
                    placeholder: '请选择凭证来源',
                    onChange: function (data) {

                    },
                    onComplete: function (sender) {
                        $(".uf-combox-input").attr("autocomplete", "off");
                    }
                });
                //会计科目
                // $("#accoCode").ufTreecombox({
                //     idField: "id",
                //     textField: "codeName",
                //     pIdField: 'pId', //可选
                //     placeholder: "请选择会计科目",
                //     leafRequire: false,
                //     // data: result.data.treeData,
                //     onChange: function (sender, data) {
                //         ufma.get("/gl/vou/getEleSurplus/" + data.CHR_ID, "", function (result) {
                //             $("#accoSurplus").getObj().load(result.data);
                //             if (sessionStorage.getItem('gl_rpt_glRptChrBook')) {
                //                 var conditions = JSON.parse(sessionStorage.getItem('gl_rpt_glRptChrBook'));
                //                 $("#accoSurplus").getObj().val(conditions.accoSurplus);
                //             }
                //         });
                //     },
                //     onComplete: function () {
                //     }
                // });
                // //差异项
                // $("#accoSurplus").ufTreecombox({
                //     idField: "id",
                //     textField: "codeName",
                //     pIdField: 'pId', //可选
                //     placeholder: "请选择差异项",
                //     leafRequire: false,
                //     readonly:false,
                //     // data: result.data.treeData,
                //     onChange: function (sender, data) {
                //     },
                //     onComplete: function () {
                //     }
                // });
                //票据类型
                $('#billType').ufTreecombox({
                    idField: "code",
                    textField: "codeName",
                    pIdField: 'pCode', //可选
                    placeholder: '请选择票据类型',
                    leafRequire: true,
                    readonly:false,
                    onChange: function (sender, data) {
                    },
                    onComplete: function () {
                    }
                });
            },
            getVoutype: function () {
                var vouType = "*";
                if (window.ownerData.isParallelsum == "1" && window.ownerData.isDoubleVousum == "1") {
                    vouType = "1,2";
                }
                var reqUrl = rpt.portList.getVoutype + window.ownerData.agencyCode + "/" + rpt.nowSetYear + "/" + window.ownerData.acctCode + "/" + vouType;
                ufma.ajax(reqUrl, "get", "", function (result) {
                    $("#rptPzzhSelect").getObj().load(result.data);
                });
            },
            getVouResource: function () {
                ufma.ajax(rpt.portList.getVOU_SOURCE, "get", "", function (result) {
                    var obj = {
                        ENU_CODE: "*",
                        ENU_NAME: "全部",
                        codeName: "* 全部"
                    };
                    result.data.unshift(obj);
                    $("#vouSource").getObj().load(result.data);
                })
            },
            getPrintStatus: function () {
                ufma.get("/gl/enumerate/PRINT_STATUS", "", function (result) {
                    var data = result.data;

                    var $statusOp = $('<button class="btn btn-primary" value="">全部</button>');
                    $("#vbPrintStatus").append($statusOp);

                    for (var i = 0; i < data.length; i++) {
                        var $status = $('<button class="btn btn-default" value="' + data[i].ENU_CODE + '">' + data[i].ENU_NAME + '</button>');
                        $("#vbPrintStatus").append($status);
                    }
                });
            },
            //渲染会计科目
            getAcco: function () {
                page.renderAcco(window.ownerData.accoDatas)
            },
            //会计科目树
            renderAcco:function (data) {
                $("#accoCode").getObj().load(data);
                $("#dAccoCode").getObj().load(data);

                //set值
                if (sessionStorage.getItem('gl_rpt_glRptChrBook')) {
                    var conditions = JSON.parse(sessionStorage.getItem('gl_rpt_glRptChrBook'));
                    if (conditions.qryItems[0].items.length > 0) {
                        // $('#accoCode').getObj().val(conditions.qryItems[0].items[0].code);
                        var accoCodes =conditions.qryItems[0].items;
                        var codeList = [];
                        for(var i=0;i<accoCodes.length;i++){
                        	codeList.push(accoCodes[i].code);
                            //$('#accoCode').getObj().setValue(accoCodes[i].code,accoCodes[i].name);
                        }
                        $('#accoCode').getObj().val(codeList.join(','));
                    }
                    if (conditions.qryItems.length > 1 && conditions.qryItems[1].items.length > 0) {
                        // $('#accoCode').getObj().val(conditions.qryItems[0].items[0].code);
                        var accoCodes =conditions.qryItems[1].items;
                        var codeList = [];
                        for(var i=0;i<accoCodes.length;i++){
                        	codeList.push(accoCodes[i].code);
                            //$('#accoCode').getObj().setValue(accoCodes[i].code,accoCodes[i].name);
                        }
                        $('#dAccoCode').getObj().val(codeList.join(','));
                    }

                }
                // else{
                //     if(window.ownerData.accoDatas.length > 0){
                //         var firstItem = window.ownerData.accoDatas[0];
                //         // $('#accoCode').getObj().val(firstItem.CHR_CODE);
                //         $('#accoCode').getObj().setValue(firstItem.id,firstItem.codeName);
                //     }
                // }
            },
            getBillType: function () {
                var argu = {
                    agencyCode: window.ownerData.agencyCode,
                    setYear: rpt.nowSetYear,
                    rgCode: rpt.rgCode,
                    eleCode: "BILLTYPE"
                };
                ufma.get("/gl/elecommon/getEleCommonTree", argu, function (result) {
                    $("#billType").getObj().load(result.data);
                });
            },
            getAccItemType: function () {
                var data = window.ownerData.accItems;
                for (var i = 1; i < data.length; i++) {
                    renderItem(data[i], i);
                }
                var clearHtml = '<div class="clearfix"></div>';
                $(".tab-content-box .content").eq(1).find("#frmQuery2").append(clearHtml);

                function renderItem(item, i) {
                    var id = "accItem-" + item.accItemCode;
                    var accItemName = item.accItemCode;
                        if(item.accItemName && item.accItemName != ""){
                            accItemName = item.accItemName;
                        }
                    var itemsHtml = '<div class="form-group">' +
                        '<label class="control-label" title="' + accItemName + '">' + accItemName + '：</label>' +
                        '<div class="control-element">' +
                        // '<div id="' + id + '" name="' + id + '" class="uf-treecombox" style="width: 262px"></div>' +
                        '<div id="' + id + '" name="' + id + '" class="uf-textboxlist" disabled="true" autocomplete="on" style="width: 262px"></div>' +
                        '</div>' +
                        '</div>';
                    $(".tab-content-box .content").eq(1).find("#frmQuery2").append(itemsHtml);
                    var accItemArgu = {
                        "acctCode": window.ownerData.acctCode,
                        "agencyCode": window.ownerData.agencyCode,
                        "setYear": rpt.nowSetYear,
                        "userId": rpt.nowUserId,
                        "accItemCode": item.accItemCode,
                        "vouTypeCode": $("#rptPzzhSelect").val()
                    };
                    ufma.get("/gl/common/glAccItemData/getAccItemTree", accItemArgu, function (result) {
                        // $("#accItem-" + item.accItemCode).ufTreecombox({
                        //     idField: "id",
                        //     textField: "codeName",
                        //     pIdField: 'pId', //可选
                        //     // placeholder: "请选择会计科目",
                        //     leafRequire: false,
                        //     readonly:false,
                        //     data: result.data,
                        //     onChange: function (sender, data) {
                        //     },
                        //     onComplete: function () {
                        //     }
                        // });
                        $("#accItem-" + item.accItemCode).ufTextboxlist({//初始化
                            idField    :'id',//可选
                            textField  :'codeName',//可选
                            pIdField  :'pId',//可选
                            async      :false,//异步
                            data       :result.data,//列表数据
                            // icon:'icon-book',
                            onChange   :function(sender, treeNode){
                            }
                        });
                        if (i == data.length - 1) {
                            var timeId = setTimeout(function () {
                                page.setCoditions();
                                clearTimeout(timeId);
                            }, 200)
                        }
                    })
                }


            },
            //set分录金额、辅助分录金额
            setAmt: function () {
                if (sessionStorage.getItem('gl_rpt_glRptChrBook')) {
                    var conditions = JSON.parse(sessionStorage.getItem('gl_rpt_glRptChrBook'));
                    //分录金额、辅助分录金额
                    $("#dStadAmtFrom").val(conditions.dStadAmtFrom);
                    $("#dStadAmtTo").val(conditions.dStadAmtTo);
                    $("#fzStadAmtFrom").val(conditions.fzStadAmtFrom);
                    $("#fzStadAmtTo").val(conditions.fzStadAmtTo);
                }
            },
            //set值
            setCoditions: function () {
                if (sessionStorage.getItem('gl_rpt_glRptChrBook')) {
                    var conditions = JSON.parse(sessionStorage.getItem('gl_rpt_glRptChrBook'));
                    $("#dateStart").getObj().setValue(new Date(conditions.startDate));
                    $("#dateEnd").getObj().setValue(new Date(conditions.endDate));
                    $("a[id='" + conditions.period + "']").addClass("selected").siblings("a").removeClass("selected");
                    // CWYXM-12377:【20200228 财务云8.20.14】序时账，调用查询方案查询，修改查询方案确定后日期带出有问题
                    conditions.dateStart = conditions.startDate;
                    conditions.dateEnd = conditions.endDate;
                    $('#frmQuery').setForm(conditions);
                    $('#frmQuery2').setForm(conditions);
                    //是否选中当前用户
                    if (conditions.nowUser == "1") {
                        $("#nowUser").prop("checked", true);
                    } else {
                        $("#nowUser").prop("checked", false);
                    }
                    //凭证状态
                    var labels = $("#vbStatus label");
                    for (var i = 0; i < labels.length; i++) {
                        var id = $(labels[i]).find("input[type='checkbox']").attr("id");
                        for (var y = 0; y < conditions.rptOption.length; y++) {
                            if (conditions.rptOption[y].optCode == id) {
                                if (conditions.rptOption[y].defCompoValue == "Y") {
                                    $("#" + id).prop("checked", true);
                                } else {
                                    $("#" + id).prop("checked", false);
                                }
                            }
                        }
                    }
                    //其他
                    var otherLabels = $("#rpt-hzfs-check label");
                    for (var i = 0; i < otherLabels.length; i++) {
                        var id = $(otherLabels[i]).find("input[type='checkbox']").attr("id");
                        for (var y = 0; y < conditions.rptOption.length; y++) {
                            if (conditions.rptOption[y].optCode == id) {
                                if (conditions.rptOption[y].defCompoValue == "Y") {
                                    $("#" + id).prop("checked", true);
                                } else {
                                    $("#" + id).prop("checked", false);
                                }
                            }
                        }
                    }
                    //打印状态
                    var printCount = conditions.printCount;
                    $("#vbPrintStatus").find("button[value='" + printCount + "']").addClass("btn-primary").removeClass("btn-default");
                    $("#vbPrintStatus").find("button[value='" + printCount + "']").siblings("button").removeClass("btn-primary").addClass("btn-default");
                    //借/贷
                    var drCr = conditions.drCr;
                    $("#drcr").find("button[value='" + drCr + "']").addClass("btn-primary").removeClass("btn-default");
                    $("#drcr").find("button[value='" + drCr + "']").siblings("button").removeClass("btn-primary").addClass("btn-default");
                    // 会计体系
                    var accaCode = conditions.accaCode;
                    $("#accaList").find("button[data-code='" + accaCode + "']").addClass("btn-primary").removeClass("btn-default");
                    $("#accaList").find("button[data-code='" + accaCode + "']").siblings("button").removeClass("btn-primary").addClass("btn-default");
                    
                    // 加载会计科目
                    var accItemArgu = {
                        "acctCode": window.ownerData.acctCode,
                        "agencyCode": window.ownerData.agencyCode,
                        "setYear": rpt.nowSetYear,
                        "userId": rpt.nowUserId,
                        "eleCode": 'ACCO',
                        "vouTypeCode": $("#rptPzzhSelect").val()
                    };
                    if (accaCode != undefined && accaCode != "") {
                        accItemArgu.accaCode = accaCode;
                    }
                    ufma.get("/gl/common/glAccItemData/getAccItemTree", accItemArgu, function (result) {
                        page.renderAcco(result.data); // 渲染会计科目树
                    })

                    //辅助项
                    for (var i = 1; i < conditions.qryItems.length; i++) {
                        if (conditions.qryItems[i].items.length > 0) {
                            var id = conditions.qryItems[i].itemType;
                            var itemId = "accItem-" + id;
                            var items = conditions.qryItems[i].items;
                            var codeList = [];
                            for(var y= 0;y<items.length;y++){
                            	codeList.push(items[y].code);
                                //$("#frmQuery2").find(".uf-textboxlist[id='" + itemId + "']").getObj().setValue(items[y].code,items[y].name);
                            }
                            if(codeList.length>0)
                            	$("#frmQuery2").find(".uf-textboxlist[id='" + itemId + "']").getObj().setValue(codeList.join(','), codeList.join(','));
                        }
                    }
                } else {
                    $("#dateStart").getObj().setValue(new Date(window.ownerData.dateStart));
                    $("#dateEnd").getObj().setValue(new Date(window.ownerData.dateEnd));
                    $("a[id='" + window.ownerData.period + "']").addClass("selected").siblings("a").removeClass("selected");
                }
            },
            //初始化科目树
            initAcco:function () {
                // $("#accoCode").ufTreecombox({
                //     valueField: "id",
                //     textField: "codeName",
                //     pIdField: 'pId', //可选
                //     readonly: false,
                //     placeholder: "请选择会计科目",
                //     leafRequire: false,
                //     onChange:function (sender, data) {
                //         ufma.get("/gl/vou/getEleSurplus/" + data.CHR_ID, "", function (result) {
                //             $("#accoSurplus").getObj().load(result.data);
                //             if (sessionStorage.getItem('gl_rpt_glRptChrBook')) {
                //                 var conditions = JSON.parse(sessionStorage.getItem('gl_rpt_glRptChrBook'));
                //                 $("#accoSurplus").getObj().val(conditions.accoSurplus);
                //             }
                //         });
                //     }
                // })
                $('#accoCode').ufTextboxlist({//初始化
                    idField    :'id',//可选
                    textField  :'codeName',//可选
                    pIdField  :'pId',//可选
                    async      :false,//异步
                    // data       :data,//列表数据
                    // icon:'icon-book',
                    onChange   :function(sender, treeNode){
                        // if (window.ownerData.isParallelsum == "1"){
                        //     ufma.get("/gl/vou/getEleSurplus/*", "", function (result) {
                        //         // ufma.get("/gl/vou/getEleSurplus/" + treeNode.CHR_ID, "", function (result) {
                        //         $("#accoSurplus").getObj().load(result.data);
                        //         if (sessionStorage.getItem('gl_rpt_glRptChrBook')) {
                        //             var conditions = JSON.parse(sessionStorage.getItem('gl_rpt_glRptChrBook'));
                        //             $("#accoSurplus").getObj().val(conditions.accoSurplus);
                        //         }
                        //     });
                        // }

                    }
                });
                $('#dAccoCode').ufTextboxlist({//初始化
                    idField    :'id',//可选
                    textField  :'codeName',//可选
                    pIdField   :'pId',//可选
                    async      :false,//异步
                    onChange   :function(sender, treeNode){
                    }
                });
            },

            initPage: function () {
                //绑定日历控件
                var glRptLedgerDate = {
                    format: 'yyyy-mm-dd',
                    initialDate: new Date(),
                    onChange: function (fmtDate) {
                        rpt.checkDate(fmtDate, "#dateStart")
                    }
                };
                var glRptLedgerEndDate = {
                    format: 'yyyy-mm-dd',
                    initialDate: new Date(),
                    onChange: function (fmtDate) {
                        rpt.checkDate(fmtDate, "#dateEnd")
                    }
                };
                $("#dateStart").ufDatepicker(glRptLedgerDate);
                $("#dateEnd").ufDatepicker(glRptLedgerEndDate);
                //选择期间，改变日历控件的值
                $("#dateBq").on("click", function () {
                    rpt.dateBenQi("dateStart", "dateEnd");
                });
                $("#dateBn").on("click", function () {
                    rpt.dateBenNian("dateStart", "dateEnd");
                });
                $("#dateJr").on("click", function () {
                    rpt.dateToday("dateStart", "dateEnd");
                });
                $(".money-condition").amtInputMinus(); // #7019 修复默认为空时传入0.00问题 修改bug7022--lyy--金额输入框支持输入负号
                // 会计体系
                rpt.reqAccaList();
                //初始化科目树
                page.initAcco();
                //初始化凭证号
                page.initPzzh();
                //请求凭证号
                page.getVoutype();
                //请求凭证来源
                page.getVouResource();
                //请求凭证状态
                rpt.reqOptList();
                //请求打印状态
                page.getPrintStatus();
                //请求科目
                page.getAcco();
                //请求票据类型
                page.getBillType();
                //请求辅助项
                page.getAccItemType();

                $(".rpt-pzzh-input").intInput();

                if (window.ownerData.isParallelsum != "1"){
                    // $("#accoSurplus-gruop").hide();
                    $("#drcr-gruop").css("margin-left","0");
                }
                page.setAmt();

            },

            onEventListener: function () {
                $("#rptPzzhSelect .uf-combox-clear").on("click", function () {
                    // 重新加载会计科目
                    var accItemArgu = {
                        "acctCode": window.ownerData.acctCode,
                        "agencyCode": window.ownerData.agencyCode,
                        "setYear": rpt.nowSetYear,
                        "userId": rpt.nowUserId,
                        "eleCode": 'ACCO',
                        "vouTypeCode": ''
                    };
                    var accaCode = $(this).attr("data-code");
                    if (accaCode != undefined && accaCode != "") {
                        accItemArgu.accaCode = accaCode;
                    } else {
                        accItemArgu.accaCode = "*";
                    }
                    ufma.get("/gl/common/glAccItemData/getAccItemTree", accItemArgu, function (result) {
                        page.renderAcco(result.data); // 渲染会计科目树
                    })
                });
                $(".nav-tabs").on("click", "li", function () {
                    if (!$(this).hasClass("active")) {
                        $(this).addClass("active").siblings("li").removeClass("active");
                        var num = $(this).index();
                        $(".tab-content-box .content").eq(num).fadeIn();
                        $(".tab-content-box .content").eq(num).siblings(".content").fadeOut();

                    }
                });
                // 点击切换会计体系
                $(".vbAccaCode").on("click", "button", function () {
					if (!$(this).hasClass("btn-primary")) {
						//样式改变
						$(this).removeClass("btn-default").addClass("btn-primary").siblings(".btn.btn-primary").removeClass("btn-primary").addClass("btn-default");
                        // 重新加载会计科目
                        var accItemArgu = {
                            "acctCode": window.ownerData.acctCode,
                            "agencyCode": window.ownerData.agencyCode,
                            "setYear": rpt.nowSetYear,
                            "userId": rpt.nowUserId,
                            "eleCode": 'ACCO',
                            "vouTypeCode": $("#rptPzzhSelect").val()
                        };
                        var accaCode = $(this).attr("data-code");
                        if (accaCode != undefined && accaCode != "") {
                            accItemArgu.accaCode = accaCode;
                        } else {
                            accItemArgu.accaCode = "*";
                        }
                        ufma.get("/gl/common/glAccItemData/getAccItemTree", accItemArgu, function (result) {
                            page.renderAcco(result.data); // 渲染会计科目树
                        })
                    }
				});

                $("#btnClose").on("click", function () {
                    _close();
                });
                $("#btnSave").on("click", function () {
                    var argu = $('#frmQuery').serializeObject();
                    var argu2 = $('#frmQuery2').serializeObject();
                    //日期
                    argu.startDate = argu.dateStart;
                    argu.endDate = argu.dateEnd;
                    //打印状态
                    var printCount = $("#vbPrintStatus").find("button[class='btn btn-primary']").val();
                    if(printCount == ""){
                        printCount = "-1";
                    }
                    //凭证状态
                    var rptOption = [];
                    $("#vbStatus label").each(function () {
                        var obj = {};
                        if ($(this).find("input").prop("checked")) {
                            obj.defCompoValue = "Y";
                        } else {
                            obj.defCompoValue = "N";
                        }
                        obj.optCode = $(this).find("input").attr("id");
                        obj.optName = $(this).text();
                        rptOption.push(obj);
                    });
                    //其他
                    $("#rpt-hzfs-check label").each(function () {
                        var obj = {};
                        if ($(this).find("input").prop("checked")) {
                            obj.defCompoValue = "Y";
                        } else {
                            obj.defCompoValue = "N";
                        }
                        obj.optCode = $(this).find("input").attr("id");
                        obj.optName = $(this).text();
                        rptOption.push(obj);
                    });
                    //凭证号
                    var rptCondItem = [];
                    var vouType = {
                        condCode: "vouType",
                        condName: "凭证字号",
                        condText: $("#rptPzzhSelect").getObj().getText(),
                        condValue: $("#rptPzzhSelect").getObj().getValue()
                    };
                    rptCondItem.push(vouType);
                    var vouTypeStart = {
                        condCode: "vouTypeFrom",
                        condName: "凭证编号起",
                        condText: argu.pzzhForm,
                        condValue: argu.pzzhForm
                    };
                    rptCondItem.push(vouTypeStart);
                    var vouTypeEnd = {
                        condCode: "vouTypeTo",
                        condName: "凭证编号止",
                        condText: argu.pzzhTo,
                        condValue: argu.pzzhTo
                    };
                    rptCondItem.push(vouTypeEnd);
                    //借/贷
                    var drCr = $("#drcr").find("button[class='btn btn-primary']").val();
                    if(drCr == ""){
                        drCr = "0";
                    }
                    // 会计体系
                    var accaCode = $("#accaList").find("button[class='btn btn-primary']").attr("data-code");
                    //会计科目、辅项、差异项
                    var qryItems = [];
                    var accoObj = {
                        isShowItem: 1,
                        itemType: "ACCO",
                        itemTypeName: "会计科目",
                        items: [],
                        seq: 0
                    };
                    if (argu.accoCode != "") {
                        var accoCodes = $("#accoCode").getObj().getItem();
                        if(accoCodes.length > 0 && accoCodes[0] != null){
                            for(var i = 0;i<accoCodes.length;i++){
                                var itemObj = {
                                    code: accoCodes[i].id,
                                    name: accoCodes[i].codeName
                                };
                                accoObj.items.push(itemObj);
                            }
                        }
                    }
                    qryItems.push(accoObj);

                    // 需求CWYXM-11604
                    //对方科目
                    var dAccoObj = {
                        isShowItem: 0,
                        itemType: "DACCO",
                        itemTypeName: "对方科目",
                        items: [],
                        seq: 0
                    };
                    if (argu.dAccoCode != "") {
                        var dAccoCodes = $("#dAccoCode").getObj().getItem();
                        if(dAccoCodes.length > 0 && dAccoCodes[0] != null){
                            for(var i = 0;i<dAccoCodes.length;i++){
                                var itemObj = {
                                    code: dAccoCodes[i].id,
                                    name: dAccoCodes[i].codeName
                                };
                                dAccoObj.items.push(itemObj);
                            }
                        }
                    }
                    qryItems.push(dAccoObj);
                    $("#frmQuery2 .form-group").each(function (i) {
                        var id = $(this).find(".uf-textboxlist").attr("id");
                        var accItemObj = {
                            isGradsum: "0",
                            isShowItem: "1",
                            itemDir: "",
                            itemLevel: "-1",
                            itemPos: "condition",
                            itemType: "",
                            itemTypeName: "",
                            items: [],
                            seq: 1
                        };
                        accItemObj.itemType = id.split("-")[1];
                        accItemObj.itemTypeName = $(this).find(".control-label").attr("title");
                        if (argu2[id] != "") {
                            var items = $("#" + id).getObj().getItem();
                            if(items.length > 0 && items[0] != null){
                                for (var i = 0;i<items.length;i++){
                                    var itemObj = {
                                        code: items[i].id,
                                        name: items[i].codeName
                                    };
                                    accItemObj.items.push(itemObj);
                                }
                            }
                            accItemObj.seq = i + 1;
                        }
                        qryItems.push(accItemObj);

                    });
                    //当前用户
                    argu.nowUser = "0";
                    if ($("#nowUser").prop("checked")) {
                        argu.nowUser = "1";
                    }
                    //日期按钮
                    argu.period = $("a[class='label label-radio selected']").attr("id");

                    argu = $.extend(argu, argu2, {
                        printCount: printCount,
                        rptOption: rptOption,
                        rptCondItem: rptCondItem,
                        drCr: drCr,
                        accaCode: accaCode,
                        qryItems: qryItems
                    });
                    if (parseFloat(argu.dStadAmtFrom) > parseFloat(argu.dStadAmtTo)) {
                        ufma.showTip("分录金额开始金额不能大于结束金额");
                        return false

                    }
                    if (parseFloat(argu.fzStadAmtFrom) > parseFloat(argu.fzStadAmtTo)) {
                        ufma.showTip("辅助分录金额开始金额不能大于结束金额");
                        return false

                    }
                    if (argu.dateStart == '' || argu.dateEnd == '') {
                        ufma.showTip("请选择期间");
                        return false
                    }
                    argu.dateStart
                    sessionStorage.setItem("gl_rpt_glRptChrBook", JSON.stringify(argu));
                    _close("save");
                });
                //打印状态
                $("#vbPrintStatus").on("click", "button", function () {
                    if (!$(this).hasClass("btn-primary")) {
                        $(this).addClass("btn-primary").removeClass("btn-default");
                        $(this).siblings("button").addClass("btn-default").removeClass("btn-primary");
                    }
                });
                //借贷
                $("#drcr").on("click", "button", function () {
                    if (!$(this).hasClass("btn-primary")) {
                        $(this).addClass("btn-primary").removeClass("btn-default");
                        $(this).siblings("button").addClass("btn-default").removeClass("btn-primary");
                    }
                });
                //当前用户改变
                $("#nowUser").on("change", function () {
                    if ($(this).prop("checked")) {
                        $("#inputorName").val(ptData.svUserName).attr("disabled", true);
                        return false;
                    }
                    $("#inputorName").val("").attr("disabled", false);
                })

            },
            //此方法必须保留
            init: function () {
                page.reslist = ufma.getPermission();
                this.initPage();
                this.onEventListener();
                ufma.parse();
                ufma.parseScroll();
            }
        }
    }();

    page.init();
});