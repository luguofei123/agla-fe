$(function () {
    // var onerdata = window.ownerData;
    var onerdata = JSON.parse(window.sessionStorage.getItem("openFormulaEditor"));
    var onerdataId = onerdata.thisId + onerdata.agencyCode;
    var danjuleft = [];
    var danjuleftdata = {};
    var hsdata = [];
    var datachneng = [];
    var showdatasuccess = 0;
    var ptData = ufma.getCommonData();
    window._close = function (action) {
        if (window.closeOwner) {
            var data = {
                action: action
            };
            window.closeOwner(data);
        }
    }

    function Sors(str) {
        var arr = str.split("_");
        for (var i = 0; i < arr.length; i++) {
            arr[i] = arr[i].toLowerCase()
        }
        for (var i = 1; i < arr.length; i++) {
            arr[i] = arr[i].toLowerCase()
            arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].substring(1);
        }
        return arr.join("");
    }

    //根据u-msg-dialog，确定FormulaEditor的width和height
    // $("#FormulaEditor").css({width: '94%', height: "358px"});
    $("#FormulaEditor").css({width: '94%'});
    var h = $(window).height()-226;
    $("#myTabContent").height(h);
    $(".mytab-right").height(h - 51);

    var page = function () {
        return {
            FormulaEditorBtn: function () {

            },
            textone: function () {
                //双击单据项目
                $(document).on("dblclick", "#djxm .clicks", function () {
                    if ($(this).attr("onclicks") == "1") {
                    } else {
//						var codes = $(this).attr("codesd") + "." + Sors($(this).attr("codesdno"));
                        var codes = "【" + $(this).attr("thname") + "】";
                        insertText(document.getElementById("FormulaEditorVal"), codes)
                        setTa1CursorPosition(getTa1CursorPosition())
                    }
                })
                //双击对照关系
                $(document).on("dblclick", "#dzgx .clicks", function () {
                    if ($(this).attr("onclicks") == "1") {
                        alert("抱歉：非叶子节点无法选择")
                    } else {
//						var codes = "analyticRule(bizBill,'" + $(this).attr("codesd") + "')";
                        var codes = "【" + $(this).attr("thname") + "】";
                        insertText(document.getElementById("FormulaEditorVal"), codes)
                        setTa1CursorPosition(getTa1CursorPosition())
                    }
                })
                //双击元素
                $(document).on("dblclick", "#ys .clicks", function () {
                    if ($(this).attr("onclicks") == "1") {
                        alert("抱歉：非叶子节点无法选择")
                    } else {
                        var codes = "'" + $(this).attr("codesd") + "'";
                        insertText(document.getElementById("FormulaEditorVal"), codes)
                        setTa1CursorPosition(getTa1CursorPosition())
                    }
                })
                //双击环境变量
                $(document).on("dblclick", "#hjbl .clicks", function () {
                    if ($(this).attr("onclicks") == "1") {
                        alert("抱歉：非叶子节点无法选择")
                    } else {
//						var codes = "EnvVar." + $(this).attr("codesd");
                        var codes = "【" + $(this).attr("thname") + "】";
                        insertText(document.getElementById("FormulaEditorVal"), codes)
                        setTa1CursorPosition(getTa1CursorPosition())
                    }
                })
                //双击函数
                $(document).on("dblclick", "#hs .clicks", function () {
                    var codes = $(this).attr("codesd");
                    insertText(document.getElementById("FormulaEditorVal"), codes)
                    setTa1CursorPosition(getTa1CursorPosition())
                })
                //				$(document).on("click", "", function() {
                //					if($(this).attr("onclicks") == "1") {
                //					} else {
                //						var codes = $(this).attr("codesd");
                //						insertText(document.getElementById("FormulaEditorVal"), codes)
                //						setTa1CursorPosition(getTa1CursorPosition())
                //					}
                //				})
                $(document).on("click", ".newbtn", function () {
                    // var codes = $(this).text();
                    var codes = $(this).attr("data-code");
                    insertText(document.getElementById("FormulaEditorVal"), codes);
                    setTa1CursorPosition(getTa1CursorPosition())
                })
            },
            clickTab: function () {
                setTimeout(function () {
                    $("#myTab").find("li").eq(0).find("a").click();
                }, 500)
            },
            leftclick: function () {
                for (var i = 0; i < $(".mytab-left").length; i++) {
                    $(".mytab-left").eq(i).find(".text-one").eq(0).click();
                }
            },
            //方法返回zTree的setting
            settingFun:function () {
                var setting = {

                    data: {//表示tree的数据格式
                        key: {
                            name: "codeName",
                        },
                        simpleData: {
                            enable: true,//表示使用简单数据模式
                            idKey: "id",//设置之后id为在简单数据模式中的父子节点关联的桥梁
                            pidKey: "pId",//设置之后pid为在简单数据模式中的父子节点关联的桥梁和id互相对应
                            rootId: "null"//pid为null的表示根节点
                        }
                    },
                    edit: {
                        view: {
                            showIcon: false
                        }

                    },
                    view: {//表示tree的显示状态
                        selectMulti: false,//表示禁止多选
                        showLine: false,//不显示连接线
                        showIcon: false,
                        fontCss : {size:"14px"}
                    },
                    check: {//表示tree的节点在点击时的相关设置
                        // enable:true,//是否显示radio/checkbox
                        // chkStyle:"checkbox",//值为checkbox或者radio表示
                        checkboxType: {p: "", s: ""},//表示父子节点的联动效果
                        radioType: "level"//设置tree的分组
                    },
                    callback: {//表示tree的一些事件处理函数
                        onDblClick: function (treeId, treeNode, leafData) {
                            if (leafData.isParent) {
                                ufma.showTip("请选择末级节点", function () {
                                }, "warning");
                                return false;
                            }
                            var codes = "'" + leafData.code + "'";
                            insertText(document.getElementById("FormulaEditorVal"), codes);
                            setTa1CursorPosition(getTa1CursorPosition())
                        },
                        // onCheck:handlerCheck
                    }
                }
                return setting;
            },
            dataclick: function () {
                $("body").on("click", "#djxm .mytab-left .text-one", function () {
                    var keys = $(this).attr("keys");
                    var djxmrighthtmldata = ''
                    for (var i = 0; i < danjuleftdata[keys].length; i++) {
                        djxmrighthtmldata += '<div class="text-one hand clicks" thname="' + danjuleftdata[keys][i].showthname + '" codesd="' + danjuleftdata[keys][i].tableName + '" codesdno="' + danjuleftdata[keys][i].lpField + '">' + danjuleftdata[keys][i].itemName + '</div>'
                    }
                    $("#djxm").find(".mytab-right .right-con").html(djxmrighthtmldata)
                })
                $("body").on("click", "#ys .mytab-left .text-one", function () {
                    var zTreeObj = $.fn.zTree.getZTreeObj("accoTree");
                    if(zTreeObj){
                        zTreeObj.destroy();
                    }

                    $("#ys").find(".mytab-right .right-con").html("");
                    var codes = $(this).attr("keys");
                    $(".yssearch").val("");
                    page.codes = undefined;
                    //会计科目 S
                    if (codes == "acco") {
                        // page.codes = "acco";
                        $(this).addClass("activeleft").siblings(".text-one").removeClass("activeleft");
                        var url;
                        if(onerdata.reqAcctCode.reqAcctType == 1){
                            //如果是单位级账套
                            url = "/lp/sys/coaAcc/getRptAccoTree/" + onerdata.agencyCode + "/" + onerdata.reqAcctCode.reqAcctCode;
                        }else{
                            //如果是系统级科目体系
                            url = "/lp/sys/getAccoTree/" + ptData.svSetYear + "?accsCode=" + onerdata.reqAcctCode.reqAcctCode + "&acceCode=&agencyCode=*&acctCode=*";
                        }
                        var argu = {
                            rgCode: ptData.svRgCode,
                            setYear: ptData.svSetYear
                        };
                        ufma.get(url, argu, function (result) {
                            var data;
                            if(onerdata.reqAcctCode.reqAcctType == 1){
                                data = result.data.treeData;
                            }else{
                                data = result.data;
                            }

                            page.accoData = data;
                            if (data.length == 1 && data.codeName == "全部") {
                                return false;
                            }
                            var ysrighthtmldata = '<div id="accoTree" class="ztree ufmaTree"></div>';
                            $("#ys").find(".mytab-right .right-con").html(ysrighthtmldata);
                            var setting = page.settingFun();
                            var zTreeObj = $.fn.zTree.init($("#accoTree"), setting, data);
                            zTreeObj.expandAll(true);
                        })

                        return false;
                    }
                    //会计科目 E

                    if (window.sessionStorage.getItem(onerdataId + codes + "FormulaEditorys") != null) {
                        var datapascodeys = JSON.parse(window.sessionStorage.getItem(onerdataId + codes + "FormulaEditorys"))
                        var ysrighthtmldata = "";
                        for (var i = 0; i < datapascodeys.length; i++) {
                            if (datapascodeys[i].pId == "") {
                                ysrighthtmldata += '<div class="text-one hand clicks" codesd="' + datapascodeys[i].id + '>' + datapascodeys[i].name + '</div>'
                            } else {
                                ysrighthtmldata += '<div class="text-one hand clicks ml' + (datapascodeys[i].pId) * 5 + '" codesd="' + datapascodeys[i].id + '" >' + datapascodeys[i].name + '</div>'
                            }
                        }
                        $("#ys").find(".mytab-right .right-con").html(ysrighthtmldata)
                    } else {
                        var argu = {
                            agencyCode:onerdata.agencyCode,
                            eleCode:codes,
                            rgCode:ptData.svRgCode,
                            setYear:ptData.svSetYear
                        };
                        ufma.get("/lp/eleAccItem/getAccItemTree", argu, function (result) {
                            var data = result.data;
                            page.accoData = data;
                            if (data.length == 1 && data.codeName == "全部") {
                                return false;
                            }
                            var ysrighthtmldata = '<div id="accoTree" class="ztree ufmaTree"></div>';
                            $("#ys").find(".mytab-right .right-con").html(ysrighthtmldata);
                            var setting = page.settingFun();
                            var zTreeObj = $.fn.zTree.init($("#accoTree"), setting, data);
                            zTreeObj.expandAll(true);
                        })
                    }

                });
                $("body").on("click", "#hs .mytab-left .text-one", function () {
                    var codes = $(this).attr("keys");
                    for (var i = 0; i < hsdata.length; i++) {
                        if (hsdata[i].funValue == codes) {
                            $("#hs").find(".mytab-right .right-con").html('<div class="text-head">函数说明</div><div class="text-two">' + hsdata[i].funDesc + '</div>')
                        }
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
            bottomdata: function () {
                //单据项目
                var argu = {
                    rgCode: ptData.svRgCode,
                    setYear: ptData.svSetYear
                };
                ufma.get("/lp/formulaEditor/getBillItems?schemeGuid=" + onerdata.billTypeGuid, argu, function (res) {
                    ufma.setObjectCache(onerdataId + "FormulaEditordjxm", res.data);
                    var hjbllefthtmldata = '';
                    for (var i = 0; i < res.data.length; i++) {
                        var hjblchnengdata = {};
                        hjbllefthtmldata += '<div class="text-one hand clicks"  thname="单据项目.' + res.data[i].itemName + '" codesd=' + res.data[i].itemCode + '>' + res.data[i].itemName + '</div>'
                        // var codes = res.data[i].tableName + '.' + res.data[i].lpField.toLowerCase();
                        var codes;
                        if(res.data[i].lpField.indexOf("_")> 0){
                            codes = 'Main.' + page.strTransform(res.data[i].lpField.toLowerCase());
                        }else{
                            codes = 'Main.' + res.data[i].lpField.toLowerCase();
                        }

                        hjblchnengdata[codes] = "单据项目." + res.data[i].itemName;
                        datachneng.push(hjblchnengdata)
                    }
                    $("#djxm").html(hjbllefthtmldata);
                    showdatasuccess++;
                })
                // if (window.sessionStorage.getItem(onerdataId + "FormulaEditordjxm") != null) {
                //     var datapas = JSON.parse(window.sessionStorage.getItem(onerdataId + "FormulaEditordjxm"))
                //     var hjbllefthtmldata = '';
                //     for (var i = 0; i < datapas.length; i++) {
                //         var hjblchnengdata = {};
                //         hjbllefthtmldata += '<div class="text-one hand clicks"  thname="单据项目.' + datapas[i].itemName + '" codesd=' + datapas[i].itemCode + '>' + datapas[i].itemName + '</div>'
                //         // var codes = datapas[i].tableName + '.' + datapas[i].lpField.toLowerCase();
                //         var codes = 'Main.' + datapas[i].lpField.toLowerCase();
                //         hjblchnengdata[codes] = "单据项目." + datapas[i].itemName;
                //         datachneng.push(hjblchnengdata)
                //     }
                //     $("#djxm").html(hjbllefthtmldata);
                //     showdatasuccess++;
                // } else {
                //     ufma.get("/lp/formulaEditor/getBillItems?schemeGuid=" + onerdata.billTypeGuid, "", function (res) {
                //         ufma.setObjectCache(onerdataId + "FormulaEditordjxm", res.data);
                //         var hjbllefthtmldata = '';
                //         for (var i = 0; i < res.data.length; i++) {
                //             var hjblchnengdata = {};
                //             hjbllefthtmldata += '<div class="text-one hand clicks"  thname="单据项目.' + res.data[i].itemName + '" codesd=' + res.data[i].itemCode + '>' + res.data[i].itemName + '</div>'
                //             // var codes = res.data[i].tableName + '.' + res.data[i].lpField.toLowerCase();
                //             var codes = 'Main.' + res.data[i].lpField.toLowerCase();
                //             hjblchnengdata[codes] = "单据项目." + res.data[i].itemName;
                //             datachneng.push(hjblchnengdata)
                //         }
                //         $("#djxm").html(hjbllefthtmldata);
                //         showdatasuccess++;
                //     })
                // }
                //要素
                // if (window.sessionStorage.getItem(onerdataId + "FormulaEditorys") != null) {
                //     var datapasys = JSON.parse(window.sessionStorage.getItem(onerdataId + "FormulaEditorys"))
                //     var yslefthtmldata = '<div class="text-one hand activeleft" keys="acco">会计科目</div>';
                //     for (var i = 0; i < datapasys.length; i++) {
                //         yslefthtmldata += '<div class="text-one hand" keys=' + datapasys[i].eleCode + '>' + datapasys[i].accItemName + '</div>';
                //     }
                //     $("#ys").find(".mytab-left").html(yslefthtmldata);
                //     showdatasuccess++;
                // } else {
                    ufma.get("/lp/eleAccItem/" + onerdata.agencyCode, argu, function (res) {
                        ufma.setObjectCache(onerdataId + "FormulaEditorys", res.data);
                        var yslefthtmldata = '<div class="text-one hand activeleft" keys="acco">会计科目</div>';
                        for (var i = 0; i < res.data.length; i++) {
                            yslefthtmldata += '<div class="text-one hand" keys=' + res.data[i].eleCode + '>' + res.data[i].accItemName + '</div>'
                        }

                        $("#ys").find(".mytab-left").html(yslefthtmldata);
                        showdatasuccess++;
                    })
                // }
                //环境变量
                if (window.sessionStorage.getItem(onerdataId + "FormulaEditorhjbl") != null) {
                    var datapashjbl = JSON.parse(window.sessionStorage.getItem(onerdataId + "FormulaEditorhjbl"))
                    var hjbllefthtmldata = '';
                    for (var i in datapashjbl) {
                        var hjblchnengdata = {};
                        hjbllefthtmldata += '<div class="text-one hand clicks" thname="环境变量.' + datapashjbl[i] + '" codesd=' + i + '>' + datapashjbl[i] + '</div>'
                        var codes = "EnvVar." + i;
                        hjblchnengdata[codes] = "环境变量." + datapashjbl[i];
                        datachneng.push(hjblchnengdata)
                    }
                    $("#hjbl").html(hjbllefthtmldata);
                    showdatasuccess++;
                } else {
                    ufma.get("/lp/formulaEditor/getEnvVars", argu, function (res) {
                        ufma.setObjectCache(onerdataId + "FormulaEditorhjbl", res.data);
                        var datapashjbl = JSON.parse(window.sessionStorage.getItem(onerdataId + "FormulaEditorhjbl"))
                        var hjbllefthtmldata = '';
                        var hjblchneng = {};
                        for (var i in res.data) {
                            var hjblchnengdata = {};
                            hjbllefthtmldata += '<div class="text-one hand clicks"  thname="环境变量.' + res.data[i] + '" codesd=' + i + '>' + res.data[i] + '</div>'
                            var codes = "EnvVar." + i;
                            hjblchnengdata[codes] = "环境变量." + datapashjbl[i];
                            datachneng.push(hjblchnengdata)
                        }
                        $("#hjbl").html(hjbllefthtmldata);
                        showdatasuccess++;
                    })
                }
                //函数
                if (window.sessionStorage.getItem(onerdataId + "FormulaEditorhs") != null) {
                    var datapashs = JSON.parse(window.sessionStorage.getItem(onerdataId + "FormulaEditorhs"))
                    hsdata = datapashs;
                    var len = hsdata.length;
                    var obj = {
                        funDesc: "条件为真",
                        funName: "true",
                        funValue: "true",
                        ordSeq: (len + 1).toString()
                    };
                    hsdata.push(obj);
                    var hslefthtmldata = '';
                    for (var i = 0; i < datapashs.length; i++) {
                        hslefthtmldata += '<div class="text-one hand clicks" keys=' + datapashs[i].funValue + ' codesd=' + datapashs[i].funValue + '>' + datapashs[i].funName + '</div>'
                    }
                    $("#hs").find(".mytab-left").html(hslefthtmldata);
                    showdatasuccess++;
                } else {
                    ufma.get("/lp/formulaEditor/getFunctions", argu, function (res) {
                        ufma.setObjectCache(onerdataId + "FormulaEditorhs", res.data);
                        hsdata = res.data;
                        var len = hsdata.length;
                        var obj = {
                            funDesc: "条件为真",
                            funName: "true",
                            funValue: "true",
                            ordSeq: (len + 1).toString()
                        };
                        hsdata.push(obj);
                        var hslefthtmldata = '';
                        for (var i = 0; i < res.data.length; i++) {
                            hslefthtmldata += '<div class="text-one hand clicks" keys=' + res.data[i].funValue + ' codesd=' + res.data[i].funValue + '>' + res.data[i].funName + '</div>'
                        }
                        $("#hs").find(".mytab-left").html(hslefthtmldata);
                        showdatasuccess++;
                    })
                }
                //	对照关系（现在不需要对照关系，注释掉了）
                // if(onerdata.eleCode != undefined && onerdata.eleCode != "") {
                // 	ufma.post("/lp/transRule/getRuleList", {
                // 		"billTypeGuid": onerdata.billTypeGuid,
                // 		"eleCode": onerdata.eleCode,
                // 		"agencyCode": onerdata.agencyCode
                // 	}, function(res) {
                // 		var dzgxlefthtmldata = '';
                // 		var dzgxchneng=[]
                // 		for(var i = 0; i < res.data.length; i++) {
                // 			var dzgxchnengdata={};
                // 			dzgxlefthtmldata += '<div class="text-one hand clicks"  thname="对照关系.'+ res.data[i].ruleName +'" codesd=' + res.data[i].ruleGuid + '>' + res.data[i].ruleName + '</div>'
                // 			var codes = "analyticRule(bizBill,'" + res.data[i].ruleGuid + "')";
                // 			dzgxchnengdata[codes]="对照关系."+ res.data[i].ruleName;
                // 			datachneng.push(dzgxchnengdata);
                // 		}
                // 		$("#dzgx").html(dzgxlefthtmldata);
                // 		showdatasuccess++;
                // 	})
                // }else{
                // 		showdatasuccess++;
                // }
            },
            showdatasu: function () {
                // if(showdatasuccess!=5){
                //reviese 去掉了对照关系，只剩下了四个
                if (showdatasuccess != 4) {
                    setTimeout(function () {
                        page.showdatasu();
                    }, 200)
                } else {
                    page.leftclick();
                    page.EnglishTranslation(onerdata.FormulaEditorVal)
//					$("#FormulaEditorVal").val(onerdata.FormulaEditorVal)
                }
            },
            transitEnglish: function (str) {
                if (str.indexOf("【") >= 0 && str.indexOf("】") < 0) {
                    ufma.showTip("内容不符合要求", function () {
                    }, "warning");
                } else if (str.indexOf("【") < 0 && str.indexOf("】") >= 0) {
                    ufma.showTip("内容不符合要求", function () {
                    }, "warning");
                } else if (str.indexOf("【") < 0 && str.indexOf("】") < 0) {
                    var url = "/lp/formulaEditor/verifyFormula?formula=" + str;
                    ufma.post(encodeURI(url).replace(/\+/g,'%2B'), "", function (res) {
                    // ufma.post(url, "", function (res) {
                    // ufma.post("/lp/formulaEditor/verifyFormula?formula=" + str, "", function (res) {
                        var data = {};
                        data.alldata = onerdata;
                        data.val = $("#FormulaEditorVal").val();
                        data.formula = page.CorE($("#FormulaEditorVal").val());
                        data.pagePosition = onerdata.pagePosition
                        _close(data);
                        // if (res.data == true) {
                        //
                        // } else {
                        //     ufma.showTip("内容不符合要求", function () {
                        //     }, "warning");
                        // }
                    })
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
                        ufma.showTip("内容不符合要求", function () {
                        }, "warning");
                    } else {
                        var strs = str.replace("【" + sdds + "】", streng);
                        page.transitEnglish(strs);
                    }
                }
            },
            EnglishTranslation: function (str) {
                if (str.indexOf("{") >= 0 && str.indexOf("}") < 0) {
                    $("#FormulaEditorVal").val(onerdata.FormulaEditorVal)
                } else if (str.indexOf("{") < 0 && str.indexOf("}") >= 0) {
                    $("#FormulaEditorVal").val(onerdata.FormulaEditorVal)
                } else if (str.indexOf("{") < 0 && str.indexOf("}") < 0) {
                    $("#FormulaEditorVal").val(str)
//					return str;
                } else {
                    var chnleft = str.indexOf("{")
                    var chnright = str.indexOf("}")
                    var sdds = str.substring(chnleft + 1, chnright)
                    var streng = ""
                    for (var i = 0; i < datachneng.length; i++) {
                        for (var k in datachneng[i]) {
                            if (k == sdds) {
                                streng = "【" + datachneng[i][k] + "】";
                            }
                        }
                    }
                    if (streng == "") {
                        $("#FormulaEditorVal").val(onerdata.FormulaEditorVal)
                    } else {
                        var strs = str.replace("{" + sdds + "}", streng);
                        page.EnglishTranslation(strs);
                    }
                }
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
            //此方法必须保留
            init: function () {
                //权限控制
                page.reslist = ufma.getPermission();
                ufma.isShow(page.reslist);
                page.dataclick();
                page.bottomdata();
                page.clickTab();
//				setTimeout(function() {
//					page.leftclick();
//				}, 200)
//				page.transitEnglish("【15645646】");
                page.textone()
                page.showdatasu();
//				$("#FormulaEditorVal").val(onerdata.FormulaEditorVal)
                //点击确定
                $("#btn-FormulaEditorsave").click(function () {
                    page.transitEnglish($("#FormulaEditorVal").val());
                });
                $("#btn-FormulaEditornone").click(function () {
                    $("#FormulaEditorVal").val("");
                });
                $("#btn-FormulaEditorup").click(function () {
                    var str = page.CorE($("#FormulaEditorVal").val());
                    var url = "/lp/formulaEditor/verifyFormula?formula=" + str;
                    ufma.post(encodeURI(url).replace(/\+/g,'%2B'), "", function (res) {
                    // ufma.post("/lp/formulaEditor/verifyFormula?formula=" + str, "", function (res) {
                        ufma.showTip(res.msg, function () {
                        }, res.flag);
                        // if (res.data == true) {
                        //     ufma.showTip("校验通过", function () {
                        //     }, "success");
                        // } else {
                        //     ufma.showTip("内容不符合要求", function () {
                        //     }, "warning");
                        // }
                    })
                })

            }
        }
    }();
    setTimeout(function () {
        page.init();
    }, 200)
    $(document).on("click", "#dzgx .text-one", function () {
        $("#dzgx .text-one").removeClass("actives");
        $(this).addClass("actives");
    })
    $(document).on("click", "#hjbl .text-one", function () {
        $("#hjbl .text-one").removeClass("actives");
        $(this).addClass("actives");
    })
    $(document).on("click", "#djxm .text-one", function () {
        $("#djxm .text-one").removeClass("actives");
        $(this).addClass("actives");
    })
    // 过滤ztree显示数据
    function ztreeFilter(zTreeObj,_keywords,callBackFunc) {
        if(!_keywords){
            _keywords =''; //如果为空，赋值空字符串
        }

        // 查找符合条件的叶子节点
        function filterFunc(node) {
            if(node && node.oldname && node.oldname.length>0){
                node["codeName"] = node.oldname; //如果存在原始名称则恢复原始名称
            }
            //node.highlight = false; //取消高亮
            zTreeObj.updateNode(node); //更新节点让之前对节点所做的修改生效
            if (_keywords.length == 0) {
                //如果关键字为空,返回true,表示每个节点都显示
                zTreeObj.showNode(node);
                zTreeObj.expandNode(node,true); //关键字为空时是否展开节点
                return true;
            }
            //节点名称和关键字都用toLowerCase()做小写处理
            if (node["codeName"] && node["codeName"].toLowerCase().indexOf(_keywords.toLowerCase())!=-1) {
                // if(isHighLight){ //如果高亮，对文字进行高亮处理
                //     //创建一个新变量newKeywords,不影响_keywords在下一个节点使用
                //     //对_keywords中的元字符进行处理,否则无法在replace中使用RegExp
                //     var newKeywords = _keywords.replace(rexMeta,function(matchStr){
                //         //对元字符做转义处理
                //         return '\\' + matchStr;
                //
                //     });
                //     node.oldname = node["codeName"]; //缓存原有名称用于恢复
                //     //为处理过元字符的_keywords创建正则表达式,全局且不分大小写
                //     var rexGlobal = new RegExp(newKeywords, 'gi');//'g'代表全局匹配,'i'代表不区分大小写
                //     //无法直接使用replace(/substr/g,replacement)方法,所以使用RegExp
                //     node["codeName"] = node.oldname.replace(rexGlobal, function(originalText){
                //         //将所有匹配的子串加上高亮效果
                //         var highLightText =
                //             '<span style="color: whitesmoke;background-color: darkred;">'
                //             + originalText
                //             +'</span>';
                //         return  highLightText;
                //     });
                //     zTreeObj.updateNode(node); //update让更名和高亮生效
                // }
                zTreeObj.showNode(node);//显示符合条件的节点
                return true; //带有关键字的节点不隐藏
            }

            zTreeObj.hideNode(node); // 隐藏不符合要求的节点
            return false; //不符合返回false
        }
        var nodesShow = zTreeObj.getNodesByFilter(filterFunc); //获取匹配关键字的节点
        processShowNodes(nodesShow, _keywords, zTreeObj);//对获取的节点进行二次处理
    }

    /**
     * 对符合条件的节点做二次处理
     */
    function processShowNodes(nodesShow,_keywords, zTreeObj){
        if(nodesShow && nodesShow.length>0){
            //关键字不为空时对关键字节点的祖先节点进行二次处理
            if(_keywords.length>0){
                $.each(nodesShow, function(n,obj){
                    var pathOfOne = obj.getPath();//向上追溯,获取节点的所有祖先节点(包括自己)
                    if(pathOfOne && pathOfOne.length>0){
                        // i < pathOfOne.length-1, 对节点本身不再操作
                        for(var i=0;i<pathOfOne.length-1;i++){
                            zTreeObj.showNode(pathOfOne[i]); //显示节点
                            zTreeObj.expandNode(pathOfOne[i],true); //展开节点
                        }
                    }
                });
            }else{ //关键字为空则显示所有节点, 此时展开根节点
                var rootNodes = zTreeObj.getNodesByParam('level','0');//获得所有根节点
                $.each(rootNodes,function(n,obj){
                    zTreeObj.expandNode(obj,true); //展开所有根节点
                });
            }
        }
    }
    var timeoutId = null;
    // 有输入后定时执行一次，如果上次的输入还没有被执行，那么就取消上一次的执行
    function searchNodeLazy(_keywords) {
        var zTreeObj = $.fn.zTree.getZTreeObj("accoTree");
        if(!zTreeObj){
            alter("获取树对象失败");
        }
        if (timeoutId) { //如果不为空,结束任务
            clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(function() {
            // ztreeFilter(zTreeObj,_keywords);    //延时执行筛选方法
            var nodes = zTreeObj.getNodesByParamFuzzy("codeName", _keywords, null);
            var fitedNode = [];
            for(var i = 0;i<nodes.length;i++){
                if(nodes[i].codeName.indexOf(_keywords) == 0){
                    fitedNode.push(nodes[i]);
                }
            }
            if (fitedNode.length>0) {
                zTreeObj.selectNode(fitedNode[0]);
            }
            $(".yssearch").focus();//输入框重新获取焦点
        }, 300);
    }

    $(document).on("input", ".yssearch", function () {
        var _keywords = $(this).val();
        searchNodeLazy(_keywords); //调用延时处理
        return false;

        $(this).parents("#ys").find(".mytab-right").animate({
            scrollTop: 0
        }, 0);
        for (var i = 0; i < $(this).parents("#ys").find(".mytab-right").find(".text-one").length; i++) {
            var tempStr = $(this).parents("#ys").find(".mytab-right").find(".text-one").eq(i).text();
            var bool = tempStr.indexOf($(this).val());
            if (bool >= 0) {
                $(this).parents("#ys").find(".mytab-right").find(".text-one").eq(i).show();
            } else {
                $(this).parents("#ys").find(".mytab-right").find(".text-one").eq(i).hide();
            }
        }
    })
    $(document).on("click", ".mytab-left .text-one", function () {
        $(this).parents(".mytab-left").find(".text-one").removeClass("activeleft");
        $(this).addClass("activeleft");
    })
    $(document).on("click", ".mytab-right .text-one", function () {
        $(this).parents(".mytab-right").find(".text-one").removeClass("actives");
        $(this).addClass("actives");
    })

    function getTa1CursorPosition() {
        var evt = window.event ? window.event : getTa1CursorPosition.caller.arguments[0];
        var oTa1 = document.getElementById("FormulaEditorVal");
        var cursurPosition = -1;
        if (oTa1.selectionStart) { //非IE浏览器
            cursurPosition = oTa1.selectionStart;
        } else { //IE
            var range = oTa1.createTextRange();
            range.moveToPoint(evt.x, evt.y);
            range.moveStart("character", -oTa1.value.length);
            cursurPosition = range.text.length;
        }
        return cursurPosition
    }

    function setTa1CursorPosition(i) {
        var oTa2 = document.getElementById("FormulaEditorVal");
        if (oTa2.selectionStart) { //非IE浏览器
            oTa2.selectionStart = i;
            oTa2.selectionEnd = i;
        } else { //IE
            var range = oTa2.createTextRange();
            range.move("character", i);
            range.select();
        }
    }

    function insertText(obj, str) {
        if (document.selection) {
            var sel = document.selection.createRange();
            sel.text = str;
        } else if (typeof obj.selectionStart === 'number' && typeof obj.selectionEnd === 'number') {
            var startPos = obj.selectionStart,
                endPos = obj.selectionEnd,
                cursorPos = startPos,
                tmpStr = obj.value;
            obj.value = tmpStr.substring(0, startPos) + str + tmpStr.substring(endPos, tmpStr.length);
            cursorPos += str.length;
            obj.selectionStart = obj.selectionEnd = cursorPos;
        } else {
            obj.value += str;
        }
        $("#FormulaEditorVal").focus();
    }

//	$(document).on("blur", "#FormulaEditorVal", function() {
//		getTa1CursorPosition()
//		//		setTimeout(function() {
//		////			$("#FormulaEditorVal").focus();
//		//			setTa1CursorPosition(2)
//		//		}, 200)
//	})

})