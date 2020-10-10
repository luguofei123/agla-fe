$(function () {
    window._close = function (action) {
        if (window.closeOwner) {
            var data = {
                action: action
            };
            window.closeOwner(data);
        }
    };
    //获取公式编辑器返回来的值并set到页面相应的位置
    window.setData = function (data) {
        page.setFormulaEditorData(data);
    };

    var onerdata = window.ownerData;
    var datachneng = [];
    var pfData = ufma.getCommonData();
    var isFirstFlag = true;
    //接口URL集合
    var interfaceURL = {
        getTemplate: "/lp/template/getTemplate",//根据id获取模版数据
        getAcct: "/lp/sys/getRptAccts",//账套
        getIsParallel: "/lp/sys/getIsParallel/",//根据单位和账套code判断是否单双凭证
        getVouType: "/lp/sys/getVouType/",//凭证类型
        getAgencyType: "/lp/enumerate/List/AGENCY_TYPE_CODE",//单位类型列表
    };

    var page = function () {
        return {
            getTemplate: function () {
                var argu = {
                    rgCode: pfData.svRgCode,
                    setYear: pfData.svSetYear
                };
                ufma.post(interfaceURL.getTemplate + "?tmpGuid=" + onerdata.guid, argu, function (result) {
                    page.tempDatas = result.data;
                })
            },
            //初始化单位类型
            initAgencyTypeList: function () {
                $("#agencyType").ufCombox({
                    idField: "key",
                    textField: "value",
                    // data: data, //json 数据
                    placeholder: "请选择单位类型",
                    onChange: function (sender, data) {
                        if (!isFirstFlag) {
                            // 刷新账套列表
                            page.getAcct();
                        } else {
                            isFirstFlag = false;
                        }
                    }
                });
            },
            //初始化账套
            initAcct: function () {
                $("#acct").ufCombox({
                    idField: "code",
                    textField: "codeName",
                    // data: data, //json 数据
                    placeholder: "请选择账套",
                    onChange: function (sender, data) {
                        page.getIsParallel(data);
                    },
                    onComplete: function () {
                        $("input").attr("autocomplete", "off");
                        $("#acct").getObj().val("001");
                    }
                });
                //请求账套
                page.getAcct();
            },
            //请求账套
            getAcct: function () {
                var arg = {
                    agencyCode: onerdata.agencyCode,
                    rgCode: pfData.svRgCode,
                    setYear: pfData.svSetYear,
                    agencyTypeCode: $("#agencyType").getObj().getValue()
                };
                ufma.get(interfaceURL.getAcct, arg, function (result) {
                    $("#acct").getObj().load(result.data);
                    $("#acct").getObj().val("001");
                });
            },
            //请求后渲染单位类型
            getAgencyTypeList: function (result) {
                var data = [{
                    "key": "*",
                    "value": "通用"
                }];
                for (var key in result.data) {
                    data.push({
                        "key": key,
                        "value": result.data[key]
                    }) 
                }
                $("#agencyType").ufCombox({
                    data: data, //json 数据
                    onComplete: function (sender) {
                        $("#agencyType").getObj().val("*");
                    }
                });
            },
             //请求单位类型
             getAgencyType: function () {
                var argu = {
                    rgCode: pfData.svRgCode,
                    setYear: pfData.svSetYear
                };
                ufma.get(interfaceURL.getAgencyType, argu, page.getAgencyTypeList);
            },
            //初始化凭证类型
            initVouType: function () {
                //财务会计类凭证
                $("#vou-fin-type").ufCombox({
                    idField: "chrCode",
                    textField: "chrName",
                    placeholder: "请选凭证类型",
                    onChange: function (sender, data) {
                    },
                    onComplete: function (sender) {
                    }
                });
                $("#vou-bug-type").ufCombox({
                    idField: "chrCode",
                    textField: "chrName",
                    placeholder: "请选凭证类型",
                    onChange: function (sender, data) {
                    },
                    onComplete: function (sender) {
                    }
                });
                $("#vou-type").ufCombox({
                    idField: "chrCode",
                    textField: "chrName",
                    placeholder: "请选凭证类型",
                    onChange: function (sender, data) {
                    },
                    onComplete: function (sender) {

                    }
                });

            },
            getIsParallel: function (acctData) {
                //如果是平行记账且是双凭证，财务会计和预算会计都显示出来
                if (acctData.isParallel === "1" && acctData.isDoubleVou == 1) {
                    $("#vou-double").show();
                    $("#vou").hide();
                    //请求凭证类型
                    setTimeout(function () {
                        page.getVouType(acctData.code, true);
                    }, 500)
                    page.IS_DOUBLE_VOU = true;
                } else {
                    //非平行记账或平行记账单凭正，只显示一个
                    $("#vou-double").hide();
                    $("#vou").show();
                    //请求凭证类型
                    setTimeout(function () {
                        page.getVouType(acctData.code, false);
                    }, 500)
                    page.IS_DOUBLE_VOU = false;
                }

            },
            getVouType: function (acctCode, isParallel) {
                var year = ufma.getCommonData().svSetYear;
                var argu = {
                    rgCode: pfData.svRgCode,
                    setYear: pfData.svSetYear
                };

                if (isParallel) {//平行记账且是双凭证
                    console.log(page.tempDatas.lpVouTemplate.vouFinTypeCode);
                    if (page.tempDatas.lpVouTemplate.vouFinTypeCode.indexOf("ZDY:") >= 0) {
                        var obj = [{
                            chrCode: "*",
                            chrName: "自定义规则",
                            codeName: "* 自定义规则"
                        }];
                        $("#vou-fin-type").getObj().load(obj);
                        $("#vou-fin-type").getObj().val("*");
                    } else {
                        var url = interfaceURL.getVouType + onerdata.agencyCode + "/" + year + "/1" + "/" + acctCode;
                        ufma.get(url, argu, function (result) {
                            var data = result.data;
                            //财务会计类凭证
                            $("#vou-fin-type").getObj().load(data);
                            $("#vou-fin-type").getObj().val("001");
                        });
                    }
                    //预算会计类凭证
                    if (page.tempDatas.lpVouTemplate.vouBudTypeCode.indexOf("ZDY:") >= 0) {
                        var obj = [{
                            chrCode: "*",
                            chrName: "自定义规则",
                            codeName: "* 自定义规则"
                        }];
                        $("#vou-bug-type").getObj().load(obj);
                        $("#vou-bug-type").getObj().val("*");
                    } else {

                        var url = interfaceURL.getVouType + onerdata.agencyCode + "/" + year + "/2" + "/" + acctCode;
                        ufma.get(url, argu, function (result) {
                            var data = result.data;
                            $("#vou-bug-type").getObj().load(data);
                            $("#vou-bug-type").getObj().val("001");
                        });
                    }
                } else {//非平行记账或平行记账单凭证
                    console.log(page.tempDatas.lpVouTemplate.vouBudTypeCode);
                    console.log(page.tempDatas.lpVouTemplate.vouFinTypeCode);
                    if (page.tempDatas.lpVouTemplate.vouBudTypeCode.indexOf("ZDY:") >= 0 || page.tempDatas.lpVouTemplate.vouFinTypeCode.indexOf("ZDY:") >= 0) {
                        var obj = [{
                            chrCode: "*",
                            chrName: "自定义规则",
                            codeName: "* 自定义规则"
                        }];
                        $("#vou-type").getObj().load(obj);
                        $("#vou-type").getObj().val("*");
                    } else {
                        var url = interfaceURL.getVouType + onerdata.agencyCode + "/" + year + "/*" + "/" + acctCode;
                        ufma.get(url, argu, function (result) {
                            var data = result.data;
                            $("#vou-type").getObj().load(data);
                            $("#vou-type").getObj().val("001");
                        });
                    }
                }
            },
            bottomdata: function () {
                //单据项目
                ufma.get("/lp/formulaEditor/getBillItems?schemeGuid=" + onerdata.schemeGuid, "", function (res) {

                    for (var j = 0; j < res.data.length; j++) {
                        var djxmchnengdata = {};
                        var code = 'Main.' + page.strTransform(res.data[j].lpField);
                        djxmchnengdata[code] = '单据项目.' + res.data[j].itemName;
                        datachneng.push(djxmchnengdata);

                    }
                })
                //环境变量
                ufma.get("/lp/formulaEditor/getEnvVars", "", function (res) {
                    for (var i in res.data) {
                        var hjblchnengdata = {};
                        var codes = "EnvVar." + i;
                        hjblchnengdata[codes] = "环境变量." + res.data[i];
                        datachneng.push(hjblchnengdata)
                    }
                })
            },
            //字符串下滑线转驼峰
            strTransform: function (str) {
                str = str.toLowerCase();
                var re = /_(\w)/g;
                str = str.replace(re, function ($0, $1) {
                    return $1.toUpperCase();
                });
                return str;
            },
            CorE: function (str) {
                str = str.toString();
                if (str.indexOf("【") >= 0 && str.indexOf("】") < 0) {
                    return str;
                } else if (str.indexOf("【") < 0 && str.indexOf("】") >= 0) {
                    return str;
                } else if (str.indexOf("【") < 0 && str.indexOf("】") < 0) {
                    return str;
                } else {
                    var chnleft = str.indexOf("【")
                    var chnright = str.indexOf("】")
                    var sdds = str.substring(chnleft + 1, chnright)
                    var streng = ""
                    for (var i = 0; i < datachneng.length; i++) {
                        for (var k in datachneng[i]) {
                            if (datachneng[i][k] == sdds) {
                                streng = "{" + k + "}";
                            }
                        }
                    }
                    if (streng == "") {
                        return str;
                    } else {
                        var strs = str.replace("【" + sdds + "】", streng);
                        return page.CorE(strs);
                    }
                }
            },
            //把公式编辑器里的值set到相应的位置上
            setFormulaEditorData: function (data) {
                if (data.action) {
                    var id2 = $("#" + data.action.alldata.allid);
                    $(id2).find("input").val(data.action.val);
                    $(id2).find("input").attr("data-formula", data.action.formula);
                }
            },

            //初始化页面
            initPage: function () {
                // 初始化凭证类型
                page.initVouType();
                //请求凭证模版数据
                page.getTemplate();
                // 初始化单位类型
                page.getAgencyType()
                page.initAgencyTypeList();

                //初始化账套
                page.initAcct();
                //获取单据项目、环境变量
                page.bottomdata();

            },
            onEventListener: function () {
                $("body").on("click", ".set-form-li .uf-buttonedit-button", function () {
                    var allid = $(this).parents(".set-form-li").attr("id");
                    var datas = {
                        billTypeGuid: onerdata.schemeGuid,
                        agencyCode: onerdata.agencyCode,
                        // targetBill: $('#tgTarget').val() ? $('#tgTarget').val() : 'LP_VOU_TEMPLATE',
                        eleCode: "",
                        allid: allid,
                        thisId: "template-copy",
                        UPagencyCode: onerdata.agencyCode,
                        FormulaEditorVal: $("#" + allid).find("input").val(),
                        reqAcctCode: { reqAcctCode: $("#acct").getObj().getValue(), reqAcctType: 1 },
                    };
                    ufma.setObjectCache("openFormulaEditor", datas);
                    $(".u-msg-dialog-top", parent.document).prevAll("#billDefinition").find("#open-formula-editor").click();
                });
                $(document).on("click", "#btn-qx", function () {
                    _close();
                });
                $(document).on("click", "#btnsave", function () {
                    $(this).attr("disabled", true);
                    page.tempDatas.lpVouTemplate.agencyTypeCode = $("#agencyType").getObj().getValue(); // 单位类型
                    page.tempDatas.lpVouTemplate.acctCode = $("#acct").getObj().getValue();
                    page.tempDatas.lpVouTemplate.accaCode = "";
                    page.tempDatas.lpVouTemplate.agencyCode = onerdata.agencyCode;
                    page.tempDatas.lpVouTemplate.vouTmpName = $("input[name='tempName']").val();
                    if (page.tempDatas.lpVouTemplate.vouTmpName == "") {
                        ufma.showTip("模版名称不能为空", function () {
                        }, "warning");
                        $(this).attr("disabled", false);
                        return false;
                    }
                    if (page.tempDatas.lpVouTemplate.acctCode == "") {
                        ufma.showTip("账套不能为空", function () {
                        }, "warning");
                        $(this).attr("disabled", false);
                        return false;
                    }
                    if(page.IS_DOUBLE_VOU){
                        if($("#vou-fin-type").getObj().getValue()!="*"){
                            page.tempDatas.lpVouTemplate.vouFinTypeCode = "'"+$("#vou-fin-type").getObj().getValue()+"'";
                        }
                        if($("#vou-bug-type").getObj().getValue()!="*"){
                            page.tempDatas.lpVouTemplate.vouBudTypeCode = "'"+$("#vou-bug-type").getObj().getValue()+"'";
                        }
                        page.tempDatas.lpVouTemplate.vouDate = page.CorE($("#vou-fin-date").find("input").val() ? $("#vou-fin-date").find("input").val() : "");
                        page.tempDatas.lpVouTemplate.vouBudDate = page.CorE($("#vou-bug-date").find("input").val() ? $("#vou-bug-date").find("input").val() : "");
                        if (page.tempDatas.lpVouTemplate.vouFinTypeCode != "" && page.tempDatas.lpVouTemplate.vouDate == "") {
                            ufma.showTip("财务会计凭证日期不能为空", function () {
                            }, "warning");
                            $(this).attr("disabled", false);
                            return false;
                        }
                        if (page.tempDatas.lpVouTemplate.vouBudTypeCode != "" && page.tempDatas.lpVouTemplate.vouBudDate == "") {
                            ufma.showTip("预算会计凭证日期不能为空", function () {
                            }, "warning");
                            $(this).attr("disabled", false);
                            return false;
                        }
                    }else{
                        if($("#vou-type").getObj().getValue()!="*"){
                            page.tempDatas.lpVouTemplate.vouFinTypeCode = "'"+$("#vou-type").getObj().getValue()+"'";
                        }
                        // page.tempDatas.lpVouTemplate.vouDate = $("#vou-date").find("input").val();
                        page.tempDatas.lpVouTemplate.vouDate = page.CorE($("#vou-date").find("input").val() ? $("#vou-date").find("input").val() : "");
                        if (page.tempDatas.lpVouTemplate.vouFinTypeCode != "" && page.tempDatas.lpVouTemplate.vouDate == "") {
                            ufma.showTip("凭证日期不能为空", function () {
                            }, "warning");
                            $(this).attr("disabled", false);
                            return false;
                        }

                    }
                    delete page.tempDatas.lpVouTemplate.vouTmpGuid;
                    ufma.put("/lp/template/saveTemplate?", page.tempDatas, function (res) {
                        ufma.showTip(res.msg, function () {
                            _close("save");
                        }, res.flag);
                    });
                    var t = $(this);
                    setTimeout(function () {
                        t.attr("disabled", false);
                    }, 5000)
                })


            },
            //此方法必须保留
            init: function () {
                ufma.parse();
                //权限控制
                page.reslist = ufma.getPermission();
                ufma.isShow(page.reslist);
                this.initPage();
                this.onEventListener();
            }

        }
    }();
    page.init();

});