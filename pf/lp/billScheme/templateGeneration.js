var accsData = [];
var acctData = [];
var vouTypeData = [];
var isParallel;
var agencyTreeData = []; // 单位
var lpVouAccitemTemplates = [];
var accItemTypeDataTemp = []; // 辅助核算暂存

$(function () {
    var onerdata = JSON.parse(window.sessionStorage.getItem("addTemplate"));
    var datachneng = [];
    // var showdatasuccess = 0;// 20200722 和红侠同后端商讨认为此变量无用故注释掉，若后面发现有用再打开
    var danjuleft = [];
    var danjuleftdata = {};

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

    function formatNum(str) {
        str = str.replace(',', '')
        var newStr = "";
        var count = 0;
        if (str == "") {
            ;
            return "0.00"
        } else if (str.indexOf(".") == -1) {
            for (var i = str.length - 1; i >= 0; i--) {
                if (count % 3 == 0 && count != 0) {
                    newStr = str.charAt(i) + "," + newStr;
                } else {
                    newStr = str.charAt(i) + newStr;
                }
                count++;
            }
            str = newStr + ".00"; //自动补小数点后两位
            return str
        } else {
            for (var i = str.indexOf(".") - 1; i >= 0; i--) {
                if (count % 3 == 0 && count != 0) {
                    newStr = str.charAt(i) + "," + newStr; //碰到3的倍数则加上“,”号
                } else {
                    newStr = str.charAt(i) + newStr; //逐个字符相接起来
                }
                count++;
            }
            str = newStr + (str + "00").substr((str + "00").indexOf("."), 3);
            return str
        }
    }

    var tgDetaildatahq = [];
    var tgAccountdata = [];
    var tgAccountdatahq = [];
    var danwei = onerdata.data.agencyCode;
    var billAgencyCode = onerdata.billAgencyCode;
    var className = onerdata.className;
    var mubiaodanju;
    var eleAccItemList = onerdata.eleAccItem;
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
    var ptData = ufma.getCommonData();
    //公式编辑器width取值赋值 S
    var winWidth = $("#templateGeneration").width();
    var fdWidth = winWidth * 90 / 100;
    //公式编辑器width取值赋值 E
    //接口URL集合
    var interfaceURL = {
        getAgencyTree: "/lp/eleAgency/getAgencyTree", //用于显示单位树
        getAccsList: "/lp/sys/getAccs",//科目体系树
        getVouType: "/lp/sys/getVouType/",//凭证类型
        getAgencyType: "/lp/enumerate/List/AGENCY_TYPE_CODE",//单位类型列表
        // getAcct: "/lp/sys/getAcct/",//账套
        getAcct: "/lp/sys/getRptAccts",//账套
        getIsParallel: "/lp/sys/getIsParallel/",//根据单位和账套code判断是否单双凭证
        enumerate: "/lp/enumerate/List/",//枚举表数据(借方、贷方)
        // getIsDoubleVou: "/lp/sys/getIsDoubleVou/"//根据单位和账套code判断是否单双凭证
    };
    //借贷方向数据全局变量
    var enumerateData = [];

    var page = function () {
        return {
            //加载单位
            getAgency: function () {
                // var data = result.data;
                page.agency = $("#tgAgency").ufCombox({
                    valueField: 'id',
                    textField: 'codeName',
                    readOnly: false,
                    leafRequire: true,
                    popupWidth: 1.5,
                    // data: data,
                    onChange: function (sender,data) {
                        danwei = data.id;
                        page.bottomdata();
                        if ($("#alldw").is(":checked")) {
                        } else {
                            // 辅助核算放到分录明细注释
                            // page.tgAccountgrid(key);
                            tgAccountdata = key;
                            page.getAcct(danwei);
                        }
                    }
                });
                $("#tgAgency_input").attr("autocomplete", "off");

                //编辑模版时set单位的值 S
                //单据方案为系统级，新增模版时可以增加系统级模版也可以增加单位级模版，
                //但是如果是编辑模版时系统级则只显示系统级，单位是不可改更改的
                //单据方案为单位级，新增模版只能是此单位，不能更改
                if (onerdata.data.agencyCode === "*") {
                    $('input[name="subUnits"]').eq(0).attr("checked", "checked");

                    if (onerdata.action === "editTemplate") {
                        //编辑时不能更改单位
                        // $('input[name="subUnits"]').eq(1).attr({"checked":false,disabled:true});
                        // $("#dwcode").css("display", "none");
                        // $("#dwcode2").css("display", "none").attr("agency-code", onerdata.data.agencyCode);
                    } else {
                        //新增时可以更改单位
                        // $('input[name="subUnits"]').eq(1).attr({"checked": false});
                        if (onerdata.data.nowAgencyCode) {
                            // $("#dwcode").css("display", "none");
                            $("#dwcode3").attr("agency-code", onerdata.data.agencyCode);
                            $("#dwcode3 .dw-name").text(onerdata.data.agencyName);
                            danwei = onerdata.data.agencyCode;
                        }

                    }
                } else {
                    //单位级新增和编辑都不能更改
                    // $("#dwcode").css("display", "none");
                    $("#dwcode3").attr("agency-code", onerdata.data.agencyCode);
                    $("#dwcode3 .dw-name").text(onerdata.data.agencyName)
                }
                if (className) {//单据方案（单位级）
                    // if (billAgencyCode && billAgencyCode == "*") {//方案是系统级
                    if (onerdata.data.agencyCode == "*") {//模版是系统级的
                        $("input,#btnsaveddd").attr("disabled", true);
                        $(".uf-combox").unbind("click");
                        $(".uf-buttonedit-icon").unbind("click");
                    }
                }

                //编辑模版时set单位的值 E

            },
            //渲染分录明细
            tgDetailgrid: function (tgDetaildata, tgAccountdata) {
                if (tgDetaildata.length == 0) {
                    tgDetaildata = [{
                        "templCondition": "",
                        "hjtx": "",
                        "hjkm": "",
                        "fx": "",
                        "moneyall": "",
                        "accItemType": "",
                    }, {
                        "templCondition": "",
                        "hjtx": "",
                        "hjkm": "",
                        "fx": "",
                        "moneyall": "",
                        "accItemType": "",
                    }]
                }
                tgDetaildatahq = tgDetaildata;
                $('#tgDetailtable').ufDatagrid({
                    data: tgDetaildata,
                    idField: 'chrCode', // 用于金额汇总
                    pId: 'pcode', // 用于金额汇总
                    disabled: false, // 可选择
                    frozenStartColumn: 1, //冻结开始列,从1开始
					frozenEndColumn: 1, //冻结结束列
                    columns: [
                        [ // 支持多表头
                            {
                                type: "toolbar",
                                field: 'remark',
                                width: 54,
                                name: '操作',
                                align: 'center',
                                headalign: 'center',
                                render: function (rowid, rowdata, data) {
                                    return '<a class="insertthis btn btn-icon-only btn-sm btn-insert-row btn-permission" data-toggle="tooltip" action= "" title="插入">' +
                                        '<span class="glyphicon icon-add"></span></a>' +
                                        '<a class="copythis btn btn-icon-only btn-sm btn-copy-row btn-permission" data-toggle="tooltip" action= "" title="复制">' +
                                        '<span class="glyphicon icon-file-x"></span></a>' +
                                        '<a class="delthis btn btn-icon-only btn-sm btn-delete-row btn-permission" data-toggle="tooltip" action= "" title="删除">' +
                                        '<span class="glyphicon icon-trash"></span></a>' +
                                        '<a class="tuodongtop btn btn-icon-only btn-sm btn-move-up btn-permission" data-toggle="tooltip" action= "" title="向上移动">' +
                                        '<span class="glyphicon icon-arrow-top"></span></a>' +
                                        '<a class="tuodongbottom btn btn-icon-only btn-sm btn-move-down btn-permission" data-toggle="tooltip" action= "" title="向下移动">' +
                                        '<span class="glyphicon icon-arrow-bottom"></span></a>';
                                }
                            },
                            {
                                type: 'buttonedit',
                                field: 'templCondition',
                                width: 150,
                                name: '生成条件',
                                headalign: 'center',
                                align: 'left',
                                onBtnClick: function (e) {
                                    var rid = e.rowId;
                                    var rowData = e.rowData;
                                    if (!getReqAcctCode()) {
                                        return false;
                                    }
                                    //revise S
                                    var datas = {
                                        billTypeGuid: onerdata.data.schemeGuid,
                                        agencyCode: danwei,
                                        targetBill: $('#tgTarget').val() ? $('#tgTarget').val() : 'LP_VOU_TEMPLATE',
                                        eleCode: "",
                                        allid: "templCondition",
                                        rid: rid,
                                        thisId: "templateGeneration",
                                        UPagencyCode: onerdata.data.UPagencyCode,
                                        FormulaEditorVal: $("#tgDetailtablebuttonedittemplCondition").find("input[name=templCondition]").val(),
                                        reqAcctCode: getReqAcctCode(),
                                        pagePosition: "detailCondition"
                                    };
                                    ufma.setObjectCache("openFormulaEditor", datas);
                                    $(".u-msg-dialog-top", parent.document).prevAll("#billDefinition").find("#open-formula-editor").click();
                                    //revise E

                                    // ufma.open({
                                    //     url: '../formulaeditor/formulaEditor.html',
                                    //     title: '公式编辑器',
                                    //     width: fdWidth,
                                    //     height: 500,
                                    //     data: {
                                    //         billTypeGuid: onerdata.data.schemeGuid,
                                    //         agencyCode: danwei,
                                    //         targetBill: $('#tgTarget').val() ? $('#tgTarget').val() : 'LP_VOU_TEMPLATE',
                                    //         eleCode: "",
                                    //         allid: "templCondition",
                                    //         rid: rid,
                                    //         thisId: "templateGeneration",
                                    //         UPagencyCode: onerdata.data.UPagencyCode,
                                    //         FormulaEditorVal: $("#tgDetailtablebuttonedittemplCondition").find("input[name=templCondition]").val(),
                                    //         reqAcctCode: getReqAcctCode()
                                    //     },
                                    //     ondestory: function (data) {
                                    //         //窗口关闭时回传的值
                                    //         if (data.action) {
                                    //             $("#tgDetailtableBody").find(".uf-grid-body-view .uf-grid-table tbody").find("#" + data.action.alldata.rid).find("td[name=templCondition]").text(data.action.val);
                                    //             $("#tgDetailtablebuttonedittemplCondition").find("input[name=templCondition]").val(data.action.val);
                                    //         }
                                    //
                                    //     }
                                    // });
                                }
                            },
                            {
                                type: 'buttonedit',
                                field: 'hjtx',
                                name: '摘要',
                                width: 150,
                                headalign: 'center',
                                align: 'left',
                                onBtnClick: function (e) {
                                    var rid = e.rowId;
                                    var rowData = e.rowData;
                                    if (!getReqAcctCode()) {
                                        return false;
                                    }
                                    //revise S
                                    var datas = {
                                        billTypeGuid: onerdata.data.schemeGuid,
                                        agencyCode: danwei,
                                        targetBill: $('#tgTarget').val() ? $('#tgTarget').val() : 'LP_VOU_TEMPLATE',
                                        eleCode: "",
                                        allid: "hjtx",
                                        rid: rid,
                                        thisId: "templateGeneration",
                                        UPagencyCode: onerdata.data.UPagencyCode,
                                        FormulaEditorVal: $("#tgDetailtablebuttonedithjtx").find("input[name=hjtx]").val(),
                                        reqAcctCode: getReqAcctCode(),
                                        pagePosition: "detailHjtx"
                                    };
                                    ufma.setObjectCache("openFormulaEditor", datas);
                                    $(".u-msg-dialog-top", parent.document).prevAll("#billDefinition").find("#open-formula-editor").click();
                                    //revise E
                                    // ufma.open({
                                    //     url: '../formulaeditor/formulaEditor.html',
                                    //     title: '公式编辑器',
                                    //     width: fdWidth,
                                    //     height: 500,
                                    //     data: {
                                    //         billTypeGuid: onerdata.data.schemeGuid,
                                    //         agencyCode: danwei,
                                    //         targetBill: $('#tgTarget').val() ? $('#tgTarget').val() : 'LP_VOU_TEMPLATE',
                                    //         eleCode: "",
                                    //         allid: "hjtx",
                                    //         rid: rid,
                                    //         thisId: "templateGeneration",
                                    //         UPagencyCode: onerdata.data.UPagencyCode,
                                    //         FormulaEditorVal: $("#tgDetailtablebuttonedithjtx").find("input[name=hjtx]").val(),
                                    //         reqAcctCode: getReqAcctCode()
                                    //     },
                                    //     ondestory: function (data) {
                                    //         //窗口关闭时回传的值
                                    //         if (data.action) {
                                    //             $("#tgDetailtableBody").find(".uf-grid-body-view .uf-grid-table tbody").find("#" + data.action.alldata.rid).find("td[name=hjtx]").text(data.action.val);
                                    //             $("#tgDetailtablebuttonedithjtx").find("input[name=hjtx]").val(data.action.val);
                                    //         }
                                    //
                                    //     }
                                    // });
                                }
                            },
                            {
                                type: 'buttonedit',
                                field: 'hjkm',
                                name: '会计科目',
                                width: 150,
                                headalign: 'center',
                                align: 'left',
                                onBtnClick: function (e) {
                                    var elecode = "ACCO";
                                    var rid = e.rowId;
                                    var rowData = e.rowData;
                                    if (!getReqAcctCode()) {
                                        return false;
                                    }
                                    //revise S
                                    var datas = {
                                        billTypeGuid: onerdata.data.schemeGuid,
                                        agencyCode: danwei,
                                        targetBill: $('#tgTarget').val() ? $('#tgTarget').val() : 'LP_VOU_TEMPLATE',
                                        eleCode: "ACCO",
                                        allid: "hjkm",
                                        rid: rid,
                                        thisId: "templateGeneration",
                                        UPagencyCode: onerdata.data.UPagencyCode,
                                        FormulaEditorVal: $("#tgDetailtablebuttonedithjkm").find("input[name=hjkm]").val(),
                                        reqAcctCode: getReqAcctCode(),
                                        pagePosition: "detailHjkm"
                                    };
                                    ufma.setObjectCache("openFormulaEditor", datas);
                                    $(".u-msg-dialog-top", parent.document).prevAll("#billDefinition").find("#open-formula-editor").click();
                                    //revise E
                                    // ufma.open({
                                    //     url: '../formulaeditor/formulaEditor.html',
                                    //     title: '公式编辑器',
                                    //     width: fdWidth,
                                    //     height: 500,
                                    //     data: {
                                    //         billTypeGuid: onerdata.data.schemeGuid,
                                    //         agencyCode: danwei,
                                    //         targetBill: $('#tgTarget').val() ? $('#tgTarget').val() : 'LP_VOU_TEMPLATE',
                                    //         eleCode: "ACCO",
                                    //         allid: "hjkm",
                                    //         rid: rid,
                                    //         thisId: "templateGeneration",
                                    //         UPagencyCode: onerdata.data.UPagencyCode,
                                    //         FormulaEditorVal: $("#tgDetailtablebuttonedithjkm").find("input[name=hjkm]").val(),
                                    //         reqAcctCode: getReqAcctCode()
                                    //     },
                                    //     ondestory: function (data) {
                                    //         //窗口关闭时回传的值
                                    //         if (data.action) {
                                    //             $("#tgDetailtableBody").find(".uf-grid-body-view .uf-grid-table tbody").find("#" + data.action.alldata.rid).find("td[name=hjkm]").text(data.action.val);
                                    //             $("#tgDetailtablebuttonedithjkm").find("input[name=hjkm]").val(data.action.val);
                                    //         }
                                    //
                                    //     }
                                    // });
                                }
                            },
                            {
                                type: 'combox',
                                field: 'drCr',
                                name: '方向',
                                width: 70,
                                headalign: 'center',
                                align: 'left',
                                idField: 'drCr',
                                textField: 'drCr_NAME',
                                pIdField: '',
                                data: enumerateData,
                                render: function (rowid, rowdata, data) {
                                    if (!rowdata.fx) {
                                        return '';
                                    }
                                    return rowdata.fx == "1"? "借方" :"贷方"
                                },
                                onChange: function (e) {

                                },
                                beforeExpand: function (e) { //下拉框初始化
                                    // $(e.sender).getObj().load(enumerateData);
                                }
                            },
                            {
                                type: 'buttonedit',
                                field: 'moneyall',
                                width: 150,
                                name: '金额',
                                headalign: 'center',
                                align: 'right',
                                onBtnClick: function (e) {
                                    var rid = e.rowId;
                                    var rowData = e.rowData;
                                    if (!getReqAcctCode()) {
                                        return false;
                                    }
                                    //revise S
                                    var datas = {
                                        billTypeGuid: onerdata.data.schemeGuid,
                                        agencyCode: danwei,
                                        targetBill: $('#tgTarget').val() ? $('#tgTarget').val() : 'LP_VOU_TEMPLATE',
                                        eleCode: "",
                                        allid: "moneyall",
                                        rid: rid,
                                        thisId: "templateGeneration",
                                        UPagencyCode: onerdata.data.UPagencyCode,
                                        FormulaEditorVal: $("#tgDetailtablebuttoneditmoneyall").find("input[name=moneyall]").val(),
                                        reqAcctCode: getReqAcctCode(),
                                        pagePosition: "detailMoneyall"
                                    };
                                    ufma.setObjectCache("openFormulaEditor", datas);
                                    $(".u-msg-dialog-top", parent.document).prevAll("#billDefinition").find("#open-formula-editor").click();
                                    //revise E
                                    // ufma.open({
                                    //     url: '../formulaeditor/formulaEditor.html',
                                    //     title: '公式编辑器',
                                    //     width: fdWidth,
                                    //     height: 500,
                                    //     data: {
                                    //         billTypeGuid: onerdata.data.schemeGuid,
                                    //         agencyCode: danwei,
                                    //         targetBill: $('#tgTarget').val() ? $('#tgTarget').val() : 'LP_VOU_TEMPLATE',
                                    //         eleCode: "",
                                    //         allid: "moneyall",
                                    //         rid: rid,
                                    //         thisId: "templateGeneration",
                                    //         UPagencyCode: onerdata.data.UPagencyCode,
                                    //         FormulaEditorVal: $("#tgDetailtablebuttoneditmoneyall").find("input[name=moneyall]").val(),
                                    //         reqAcctCode: getReqAcctCode()
                                    //     },
                                    //     ondestory: function (data) {
                                    //         //窗口关闭时回传的值=
                                    //         if (data.action) {
                                    //             $("#tgDetailtableBody").find(".uf-grid-body-view .uf-grid-table tbody").find("#" + data.action.alldata.rid).find("td[name=moneyall]").text(data.action.val);
                                    //             $("#tgDetailtablebuttoneditmoneyall").find("input[name=moneyall]").val(data.action.val);
                                    //         }
                                    //     }
                                    // });
                                }
                            },
                            {
                                type: 'textarea',
                                field: 'accItemType',
                                width: 400,
                                name: '辅助核算',
                                headalign: 'center',
                                onBtnClick: function (e) {
                                    var rid = e.rowId;
                                    var temp = rid.split("_");
                                    var i = parseInt(temp[temp.length-1]);
                                    var arr = [];
                                    if (tgAccountdata && tgAccountdata.length) {
                                        if (tgAccountdata[i - 1] instanceof Array) {
                                            arr = tgAccountdata[i - 1];
                                        } else {
                                            for(obj in tgAccountdata[i - 1]){
                                                if (tgAccountdata[i - 1][obj]["ordSeq"]) {
                                                    arr.push(tgAccountdata[i - 1][obj]);
                                                }
                                            }
                                        }
                                    }
                                    var datas = {
                                        agencyCode: danwei,
                                        className: className,
                                        getReqAcctCode: getReqAcctCode(),
                                        addTemplate: onerdata,
                                        datachneng: datachneng,
                                        rid: rid,
                                        FormulaEditorVal: $("#tgDetailtabletextareaaccItemType").find("textarea[name=accItemType]").val(),
                                        pagePosition: "accItemType",
                                        tgAccountdata: arr,
                                    };
                                    ufma.setObjectCache("openAccItemTypeEditor", datas);
                                    $(".u-msg-dialog-top", parent.document).prevAll("#billDefinition").find("#open-accItemType-editor").click();
                                }
                            },
                        ]
                    ],
                    initComplete: function (options, data) {
                        //var height = $(".ufma-layout-up").eq(0).height() - $(".ufma-layout-up-top").height() - 200;
                        // $("[data-toggle='tooltip']").tooltip();
                        setTimeout(function () {
                            for (var i = 0; i < $("#tgDetailtable").find(".uf-grid-body-view tbody tr").length; i++) {
                                if ($("#tgDetailtable .uf-grid-body-view tbody tr").eq(i).find("td[name='moneyall']").find(".cell-label").text() != "") {
                                    var nei = $("#tgDetailtable .uf-grid-body-view tbody tr").eq(i).find("td[name='moneyall']").find(".cell-label")
                                    nei.text(formatNum($("#tgDetailtable .uf-grid-body-view tbody tr").eq(i).find("td[name='moneyall']").find(".cell-label").text()));
                                }
                            }
                        }, 230);

                        //单据方案（单位级）单据方案为系统级下的模版不能更改
                        if (className) {//单据方案（单位级）
                            // if (billAgencyCode && billAgencyCode == "*") {//方案是系统级
                            if (onerdata.data.agencyCode == "*") {//模版是系统级的
                                $(".uf-datagrid").getObj().setEnabled(false);
                                // $("#tgDetailbutton").attr("disabled", true);
                            }
                        }
                        $("#tgDetailtableBody").css("height", "auto");

                        ufma.isShow(page.reslist);
                        $('#tgDetailtable').getObj().setBodyHeight($(".ufma-layout-up").eq(0).height() - 90);

                    }
                });
                setTimeout(function() {
                    for (var j = 0; j < tgAccountdata.length; j++) {
                        var h = $(document).find("#tgDetailtableBody").find(".uf-grid-table").find("#tgDetailtable_row_" + (j + 1)).find("td[name=accItemType]").height();
                        $(document).find("#tgDetailtableBody").find(".uf-grid-table").find("#tgDetailtable_row_" + (j + 1)).find("td[name=remark]").height(h);
                        // 打开弹框时核算回写
                        accItemTypeDataTemp[j] = tgAccountdata[j];
                    }
                }, 300);
            },
            // 辅助核算放到分录明细注释
            // //渲染辅助核算
            // tgAccountgrid: function (tgAccountdata) {
            //     ufma.get("/lp/eleAccItem/" + danwei, "", function (res) {
            //         // for (var i = 0; i < res.data.length; i++) {
            //         //     if (res.data[i].eleName == null) {
            //         //         res.data[i].eleName = "暂无";
            //         //     }
            //         //     if (res.data[i].accItemCode == null) {
            //         //         res.data[i].accItemCode = "0";
            //         //     }
            //         // }
            //         if (tgAccountdata == 0) {
            //             tgAccountdata = [{
            //                 "eleName": "",
            //                 "eleCode": "",
            //                 "accItemCode": "",
            //                 "gsName": ""
            //             }]
            //         } else {
            //             for (var i = 0; i < tgAccountdata.length; i++) {
            //                 for (var j = 0; j < res.data.length; j++) {
            //                     // if (tgAccountdata[i].accItemCode == res.data[j].eleCode) {
            //                     //修改自定义辅助核算elecode与accItemCode不一致无法给accItemName赋值，导致界面不显示辅助核算名问题--zsj
            //                     if (tgAccountdata[i].accItemCode == res.data[j].accItemCode) {
            //                         tgAccountdata[i].accItemName = res.data[j].accItemName
            //                         tgAccountdata[i].eleCode = res.data[j].eleCode
            //                         tgAccountdata[i].accitemCode = res.data[j].accItemCode
            //                     }
            //                 }

            //             }
            //         }
            //         tgAccountdatahq = tgAccountdata;
            //         $('#tgAccounttable').ufDatagrid({
            //             data: tgAccountdata,
            //             idField: 'chrCode', // 用于金额汇总
            //             pId: 'pcode', // 用于金额汇总
            //             disabled: false, // 可选择
            //             columns: [
            //                 [ // 支持多表头
            //                     {
            //                         type: 'treecombox',
            //                         field: 'accItemCode',
            //                         name: '辅助核算',
            //                         width: 270,
            //                         headalign: 'center',
            //                         align: 'left',
            //                         idField: 'accItemCode',
            //                         textField: 'accItemName',
            //                         pIdField: '',
            //                         data: res.data,
            //                         render: function (rowid, rowdata, data) {
            //                             if (!data) {
            //                                 return '';
            //                             }
            //                             return rowdata.accItemName;
            //                         },
            //                         onChange: function (e) {
            //                             var elecode = e.itemData.eleCode;
            //                             var indexs = $("#" + e.rowId).index() - 1
            //                             tgAccountdatahq[indexs].eleCode = e.itemData.eleCode
            //                             tgAccountdatahq[indexs].eleName = e.itemData.accItemName
            //                             tgAccountdatahq[indexs].accItemCode = e.itemData.accItemCode;
            //                         }
            //                     },
            //                     {
            //                         type: 'buttonedit',
            //                         field: 'gsName',
            //                         width: 500,
            //                         name: '值公式',
            //                         headalign: 'center',
            //                         align: 'left',
            //                         onBtnClick: function (e) {
            //                             var rid = e.rowId;
            //                             var rowData = e.rowData;
            //                             var indexs = $("#" + e.rowId).index() - 1;
            //                             if (!getReqAcctCode()) {
            //                                 return false;
            //                             }
            //                             //revise S
            //                             var datas = {
            //                                 billTypeGuid: onerdata.data.schemeGuid,
            //                                 agencyCode: danwei,
            //                                 targetBill: $('#tgTarget').val() ? $('#tgTarget').val() : 'LP_VOU_TEMPLATE',
            //                                 eleCode: tgAccountdatahq[indexs].eleCode,
            //                                 allid: "gsName",
            //                                 rid: rid,
            //                                 thisId: "templateGeneration",
            //                                 UPagencyCode: onerdata.data.UPagencyCode,
            //                                 FormulaEditorVal: $("#tgAccounttablebuttoneditgsName").find("input[name=gsName]").val(),
            //                                 reqAcctCode: getReqAcctCode(),
            //                                 pagePosition: "accountGsName"
            //                             };
            //                             ufma.setObjectCache("openFormulaEditor", datas);
            //                             $(".u-msg-dialog-top", parent.document).prevAll("#billDefinition").find("#open-formula-editor").click();
            //                             //revise E
            //                             // ufma.open({
            //                             //     url: '../formulaeditor/formulaEditor.html',
            //                             //     title: '公式编辑器',
            //                             //     width: fdWidth,
            //                             //     height: 500,
            //                             //     data: {
            //                             //         billTypeGuid: onerdata.data.schemeGuid,
            //                             //         agencyCode: danwei,
            //                             //         targetBill: $('#tgTarget').val() ? $('#tgTarget').val() : 'LP_VOU_TEMPLATE',
            //                             //         eleCode: tgAccountdatahq[indexs].eleCode,
            //                             //         allid: "gsName",
            //                             //         rid: rid,
            //                             //         thisId: "templateGeneration",
            //                             //         UPagencyCode: onerdata.data.UPagencyCode,
            //                             //         FormulaEditorVal: $("#tgAccounttablebuttoneditgsName").find("input[name=gsName]").val(),
            //                             //         reqAcctCode: getReqAcctCode()
            //                             //     },
            //                             //     ondestory: function (data) {
            //                             //         //窗口关闭时回传的值
            //                             //         if (data.action) {
            //                             //             $("#tgAccounttableBody").find(".uf-grid-body-view .uf-grid-table tbody").find("#" + data.action.alldata.rid).find("td[name=gsName]").text(data.action.val);
            //                             //             $("#tgAccounttablebuttoneditgsName").find("input[name=gsName]").val(data.action.val);
            //                             //         }
            //                             //     }
            //                             // });
            //                         }
            //                     },
            //                     {
            //                         type: "toolbar",
            //                         field: 'remark',
            //                         width: 140,
            //                         name: '操作',
            //                         align: 'center',
            //                         headalign: 'center',
            //                         render: function (rowid, rowdata, data) {
            //                             return '<a class="insertthis btn btn-icon-only btn-sm btn-insert-row btn-permission" data-toggle="tooltip" action= "" title="插入">' +
            //                                 '<span class="glyphicon icon-insert"></span></a>' + '<a class="delthis btn btn-icon-only btn-sm btn-delete-row btn-permission" data-toggle="tooltip" action= "" title="删除">' +
            //                                 '<span class="glyphicon icon-trash"></span></a>' + '<a class="tuodongtop btn btn-icon-only btn-sm btn-move-up btn-permission" data-toggle="tooltip" action= "" title="向上移动">' +
            //                                 '<span class="glyphicon icon-arrow-top"></span></a>' + '<a class="tuodongbottom btn btn-icon-only btn-sm btn-move-down btn-permission" data-toggle="tooltip" action= "" title="向下移动">' +
            //                                 '<span class="glyphicon icon-arrow-bottom"></span></a>';
            //                         }
            //                     }
            //                 ]
            //             ],
            //             initComplete: function (options, data) {
            //                 //var height = $(".ufma-layout-up").eq(0).height() - $(".ufma-layout-up-top").height() - 193;
            //                 $('#tgAccounttable').getObj().setBodyHeight(200);
            //                 // $("[data-toggle='tooltip']").tooltip();

            //                 //单据方案（单位级）单据方案为系统级下的模版不能更改
            //                 if (className) {//单据方案（单位级）
            //                     // if (billAgencyCode && billAgencyCode == "*") {//方案是系统级
            //                     if (onerdata.data.agencyCode == "*") {//模版是系统级的
            //                         $(".uf-datagrid").getObj().setEnabled(false);
            //                         $("#tgAccountbutton").attr("disabled", true);
            //                     }
            //                 }
            //                 $("#tgAccounttableBody").css("height", "auto");

            //                 ufma.isShow(page.reslist);
            //             },
            //         });

            //     })
            // },
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
                // showdatasuccess = 0;
                ufma.ajaxDef("/lp/formulaEditor/getBillItems?schemeGuid=" + onerdata.data.schemeGuid, "get","", function (res) {

                    for (var j = 0; j < res.data.length; j++) {
                        var djxmchnengdata = {};
                        var code = 'Main.' + page.strTransform(res.data[j].lpField);
                        djxmchnengdata[code] = '单据项目.' + res.data[j].itemName;
                        datachneng.push(djxmchnengdata);

                    }
                    // showdatasuccess++;
                })
                //环境变量
                ufma.ajaxDef("/lp/formulaEditor/getEnvVars", "get","", function (res) {
                    for (var i in res.data) {
                        var hjblchnengdata = {};
                        var codes = "EnvVar." + i;
                        hjblchnengdata[codes] = "环境变量." + res.data[i];
                        datachneng.push(hjblchnengdata)
                    }
                    // showdatasuccess++;
                })
                // 20200722同后端确认此接口无用故注释掉
                // //	对照关系
                // ufma.post("/lp/transRule/getRuleList", {
                //     "billTypeGuid": onerdata.data.schemeGuid,
                //     "agencyCode": onerdata.agencyCode
                // }, function (res) {
                //     for (var i = 0; i < res.data.length; i++) {
                //         var dzgxchnengdata = {};
                //         var codes = "analyticRule(bizBill,'" + res.data[i].ruleGuid + "')";
                //         dzgxchnengdata[codes] = "对照关系." + res.data[i].ruleName;
                //         datachneng.push(dzgxchnengdata);
                //     }
                //     showdatasuccess++;
                // })
            },
            // CorE: function (str) {
            //     str = str.toString();
            //     if (str.indexOf("【") >= 0 && str.indexOf("】") < 0) {
            //         return str;
            //     } else if (str.indexOf("【") < 0 && str.indexOf("】") >= 0) {
            //         return str;
            //     } else if (str.indexOf("【") < 0 && str.indexOf("】") < 0) {
            //         return str;
            //     } else {
            //         var chnleft = str.indexOf("【")
            //         var chnright = str.indexOf("】")
            //         var sdds = str.substring(chnleft + 1, chnright)
            //         var streng = ""
            //         for (var i = 0; i < datachneng.length; i++) {
            //             for (var k in datachneng[i]) {
            //                 if (datachneng[i][k] == sdds) {
            //                     streng = "{" + k + "}";
            //                 }
            //             }
            //         }
            //         if (streng == "") {
            //             return str;
            //         } else {
            //             var strs = str.replace("【" + sdds + "】", streng);
            //             return page.CorE(strs);
            //         }
            //     }
            // },
            matchAll: function (str, reg) {
                var res = [];
                var match;
                while (match = reg.exec(str)) {
                    res.push(match);
                }
                return res;
            },
            CorE: function (str) {
                str = str.toString();
                var rel = /ZDY:/g;
                var keysArr = page.matchAll(str, rel);
                for (var i = 0; i < keysArr.length; i++) {
                    str = str.replace(keysArr[i], "");
                }
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
            EorC: function (str) {
                if (!$.isNull(str)) {
                    str = str.toString();
                    var rel = /ZDY:/g;
                    var keysArr = page.matchAll(str, rel);
                    for (var i = 0; i < keysArr.length; i++) {
                        str = str.replace(keysArr[i], "");
                    }
                    if (str.indexOf("{") >= 0 && str.indexOf("}") < 0) {
                        return str;
                    } else if (str.indexOf("{") < 0 && str.indexOf("}") >= 0) {
                        return str;
                    } else if (str.indexOf("{") < 0 && str.indexOf("}") < 0) {
                        return str;
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
                            return str;
                        } else {
                            var strs = str.replace("{" + sdds + "}", streng);
                            return page.EorC(strs);
                        }
                    }
                }
            },
            setInfor: function (thisdata) {
                for (var i in thisdata) {
                    if (i != 'accaCode' && i != 'acctCode' && i != 'vouFinTypeCode' && i != 'vouBudTypeCode') {
                        $("#" + i).find("input").val(page.EorC(thisdata[i]));
                    }
                }
            },
            showinit: function () {
                // if (showdatasuccess == 3) {
                    if (onerdata.thisdata != undefined) {
                        var tgDetaildata = [];
                        for (var i = 0; i < onerdata.thisdata.lpVouDetailTemplates.length; i++) {
                            var dataone = new Object();
                            dataone.templCondition = page.EorC(onerdata.thisdata.lpVouDetailTemplates[i].templCondition)
                            dataone.hjkm = page.EorC(onerdata.thisdata.lpVouDetailTemplates[i].accoCode)
                            dataone.fx = page.EorC(onerdata.thisdata.lpVouDetailTemplates[i].drCr)
                            dataone.moneyall = page.EorC(onerdata.thisdata.lpVouDetailTemplates[i].stadAmt)
                            dataone.hjtx = page.EorC(onerdata.thisdata.lpVouDetailTemplates[i].descpt);
                            // CWYXM-14406：lp/template/getTemplate接口的ENU_CODE和ENU_NAME前后端大小写不一致，现前后端都修改为小写
                            dataone.drCr = onerdata.thisdata.lpVouDetailTemplates[i].drCr;
                            dataone.drCr_NAME = page.EorC(onerdata.thisdata.lpVouDetailTemplates[i].drCr_name);
                            var txt = '';
                            tgAccountdata[i] = [];
                            for (var j = 0; j < onerdata.thisdata.lpVouDetailTemplates[i].lpVouAccitemTemplates.length; j++) {
                                var data = {};
                                for (var m = 0; m < eleAccItemList.length; m++) {
                                    if (onerdata.thisdata.lpVouDetailTemplates[i].lpVouAccitemTemplates[j].accItemCode == eleAccItemList[m].accItemCode) {
                                        data.accItemName = eleAccItemList[m].accItemName;
                                    }
                                }
                                data.accItemCode = onerdata.thisdata.lpVouDetailTemplates[i].lpVouAccitemTemplates[j].accItemCode;
                                data.ordSeq = onerdata.thisdata.lpVouDetailTemplates[i].lpVouAccitemTemplates[j].ordSeq;
                                data.gsName = page.EorC(onerdata.thisdata.lpVouDetailTemplates[i].lpVouAccitemTemplates[j].value);
                                data.value = onerdata.thisdata.lpVouDetailTemplates[i].lpVouAccitemTemplates[j].value;
                                if (data.accItemCode) {
                                    txt += data.accItemName + ":" + data.gsName + "<br/>";
                                }
                                tgAccountdata[i].push(data);
                            }
                            dataone.accItemType = txt;
                            tgDetaildata.push(dataone)
                        }
                        // 辅助核算放到分录明细注释
                        // page.tgAccountgrid(tgAccountdata);
                        page.tgDetailgrid(tgDetaildata, tgAccountdata);
                        //获取到的模版基本信息填到相应的位置上
                        page.setInfor(onerdata.thisdata.lpVouTemplate);
                    } else {
                        var key = [];
                        // 辅助核算放到分录明细注释
                        // page.tgAccountgrid(key);
                        page.tgDetailgrid(key)
                    }
                // } else {
                //     setTimeout(function () {
                //         page.showinit()
                //     }, 200)
                // }
            },
            //初始化单位类型
            initAgencyTypeList: function () {
                $("#agencyType").ufCombox({
                    idField: "key",
                    textField: "value",
                    // data: data, //json 数据
                    placeholder: "请选择单位类型",
                    onChange: function (sender, data) {
                        // // 刷新账套列表
                        // page.getAcct();
                        //判断是编辑模版还是新增模版
                        if (page.getAgencyCode() == "*") {
                            //请求科目体系
                            page.getAccs();
                        } else {
                            //请求账套
                            // page.getAcct();
                        }
                        // 刷新凭证类型
                        page.getIsParallel($("#agencyType").getObj().getValue());
                    }
                });
            },
            //初始化科目体系
            initAccaList: function () {
                $("#domId").ufCombox({
                    idField: "code",
                    textField: "codeName",
                    // data: data, //json 数据
                    placeholder: "请选择科目体系",
                    onChange: function (sender, data) {
                        var accaCount = data.accaCount;
                        var accsCode = data.code;
                        $("#domId_input").attr("accs-code", accsCode);
                        if (accaCount === 2) {
                            $("#cwkj-name").removeClass("hidden");
                            $("#cwkj-part").addClass("two-show");
                            $("#yskj-part").addClass("two-show").removeClass("hidden");
                            $("#cwkj-wz").removeClass("hidden");
                            page.isParallel = true;
                            page.getVouType("*", true);
                        } else if (accaCount === 1) {
                            $("#cwkj-name").addClass("hidden");
                            $("#cwkj-part").removeClass("two-show");
                            $("#yskj-part").removeClass("two-show").addClass("hidden");
                            $("#cwkj-wz").addClass("hidden");
                            page.isParallel = false;
                            page.getVouType("*", false);
                        }

                    }
                });
            },
            //初始化账套
            initAcctList: function () {
                $("#domId2").ufCombox({
                    idField: "code",
                    textField: "codeName",
                    // data: data, //json 数据
                    placeholder: "请选择账套",
                    onChange: function (sender, data) {
                        var isparallel = data.isParallel;
                        var acctCode = data.code;
                        $("#domId2_input").attr("acct-code", acctCode);
                        page.getIsParallel(data);
                    }
                });
            },
            //请求后渲染账套
            getAcctList: function (result) {
                var data = result.data;
                if (data.length == 0) {
                    ufma.showTip("该单位下没有账套", function () {}, "warning");
                }
                $("#domId2").ufCombox({
                    data: data, //json 数据
                    onComplete: function (sender) {
                        if (data.length > 0) {
                            $("#domId2_input").attr("autocomplete", "off");
                            if (onerdata.action == "editTemplate") {
                                $("#domId2").getObj().val(onerdata.thisdata.lpVouTemplate["acctCode"]);
                            } else {
                                $("#domId2").getObj().val(data[0].code);
                            }
                            // page.showinit();
                        }
                    }
                });
                if (className) {//单据方案（单位级）
                    if (onerdata.data.agencyCode == "*") {//模版是系统级的
                        $("input").attr("disabled", true);
                        $(".uf-combox").unbind("click");
                        $(".uf-buttonedit-icon ").unbind("click");
                    }
                }
                page.getIsParallel($("#agencyType").getObj().getValue());
            },
            //请求后渲染单位类型
            getAgencyTree: function (result) {
                agencyTreeData = result.data;
                $("#tgAgency").ufCombox({
                    data: result.data, //json 数据
                    onComplete: function (sender, data) {
                    }
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
                        if (onerdata.action == "editTemplate") {
                            $("#agencyType").getObj().val(onerdata.thisdata.lpVouTemplate["agencyTypeCode"]);
                        } else {
                            $("#agencyType").getObj().val("*");
                        }
                    }
                });
            },
            //请求后渲染科目体系
            getAccsList: function (result) {
                var data = result.data;
                var agencyCode = page.getAgencyCode();
                $("#domId").ufCombox({
                    data: data, //json 数据
                    onComplete: function (sender) {
                        $("#domId_input").attr("autocomplete", "off");
                        if (onerdata.action == "editTemplate") {
                            $("#domId").getObj().val(onerdata.thisdata.lpVouTemplate["accaCode"]);
                        } else {
                            $("#domId").getObj().val(data[0].code);
                        }
                        // page.showinit();
                    }
                });
                // if (agencyCode == "*") {
                //     if (data && data.length > 0) {
                //         accsData = data;
                //     }
                //     $("#domId").ufCombox({
                //         data: data, //json 数据
                //         onComplete: function (sender) {
                //             $("#domId_input").attr("autocomplete", "off");
                //             page.showinit();
                //         }
                //     });
                // } else {
                //     // if (data && data.length > 0) {
                //     //     acctData = data;
                //     // }
                //     console.log("账套数据", data);
                //     $("#domId2").ufCombox({
                //         data: data, //json 数据
                //         onComplete: function (sender) {
                //             $("#domId2_input").attr("autocomplete", "off");
                //             $("#domId2").getObj().val(data[0].id);
                //             page.showinit();
                //         }
                //     });
                // }

                if (className) {//单据方案（单位级）
                    if (onerdata.data.agencyCode == "*") {//模版是系统级的
                        $("input").attr("disabled", true);
                        $(".uf-combox").unbind("click");
                        $(".uf-buttonedit-icon ").unbind("click");
                    }
                }

            },
            getIsParallel: function (acctData) {
                // var URL = interfaceURL.getIsParallel;
                // var url = URL + acctCode + '/' + danwei;
                // ufma.get(url, "", function (result) {
                //     var data = result.data;
                //如果是平行记账且是双凭证，财务会计和预算会计都显示出来
                if (acctData.isParallel === "1" && acctData.isDoubleVou == 1) {
                    $("#cwkj-name").removeClass("hidden");
                    $("#cwkj-part").addClass("two-show");
                    $("#yskj-part").addClass("two-show").removeClass("hidden");
                    //请求凭证类型
                    page.isParallel = true;
                    page.getVouType(acctData.code, true);
                    page.IS_DOUBLE_VOU = true;
                } else {
                    //非平行记账或平行记账单凭正，只显示一个
                    $("#cwkj-name").addClass("hidden");
                    $("#cwkj-part").removeClass("two-show");
                    $("#yskj-part").removeClass("two-show").addClass("hidden");
                    // page.setEmptyVal();
                    //请求凭证类型
                    page.isParallel = false;
                    page.getVouType(acctData.code, false);
                    page.IS_DOUBLE_VOU = false;
                }


                // });

            },
            setEmptyVal: function () {
                $("#vouBudTypeCode_input").val("");
                $("#vouBudTypeCode_input").attr("chrId", "");
                $("#vouBudDate").find("input").val("");
            },
            getVouType: function (acctCode, isParallel) {
                var year = ufma.getCommonData().svSetYear;
                var argu = {
                    rgCode: ptData.svRgCode,
                    setYear: ptData.svSetYear
                };
                if (isParallel) {//平行记账且是双凭证
                    var url = interfaceURL.getVouType + page.getAgencyCode() + "/" + year + "/1" + "/" + acctCode;
                    ufma.get(url, argu, function (result) {
                        var obj = {
                            chrCode: "*",
                            chrName: "自定义规则",
                            codeName: "* 自定义规则"
                        };
                        // result.data.unshift(obj);
                        result.data.push(obj); // CWYXM-17056
                        var data = result.data;
                        if (data && data.length > 0) {
                            vouTypeData = data;
                        }
                        console.log(data);
                        // 财务会计类凭证
                        $("#vouFinTypeCode").ufCombox({
                            idField: "chrCode",
                            textField: "chrName",
                            data: data, //json 数据
                            placeholder: "请选凭证类型",
                            onChange: function (sender, data) {
                                var chrId = data.chrId;
                                // $("#vouFinTypeCode_input").attr("chrId", chrId);

                            },
                            onComplete: function (sender) {
                                $("#vouFinTypeCode_input").attr("autocomplete", "off");
                                if (onerdata && onerdata.action == "editTemplate") {
                                    // $("#vouFinTypeCode").getObj().val(onerdata.thisdata.lpVouTemplate["vouFinTypeCode"]);
                                    // $("#vouFinTypeCode").find("input").val(page.EorC(onerdata.thisdata.lpVouTemplate["vouFinTypeCode"]));
                                    var tempVouFinType = page.EorC(onerdata.thisdata.lpVouTemplate["vouFinTypeCode"]);
                                    var count = 0;
                                    for (var i = 0; i < result.data.length; i++) {
                                        if (result.data[i].chrCode == tempVouFinType.replace(/'/g, "")) {
                                            $("#vouFinTypeCode").getObj().val(tempVouFinType.replace(/'/g, ""));
                                            count = 1;
                                        }
                                    }
                                    if (count != 1) {
                                        $("#vouFinTypeCode").getObj().val("*");
                                    }
                                    $("#vouFinTypeCode").find("input").attr("data-formula", tempVouFinType);
                                } else if (data.length > 0) {
                                    $("#vouFinTypeCode").getObj().val(data[0].chrCode);
                                }
                            }
                        });
                    });

                    //预算会计类凭证
                    var url = interfaceURL.getVouType + page.getAgencyCode() + "/" + year + "/2" + "/" + acctCode;
                    ufma.get(url, argu, function (result) {
                        var obj = {
                            chrCode: "*",
                            chrName: "自定义规则",
                            codeName: "* 自定义规则"
                        };
                        // result.data.unshift(obj); // CWYXM-17056
                        result.data.push(obj);
                        var data = result.data;
                        if (data && data.length > 0) {
                            vouTypeData = data;
                        }
                        $("#vouBudTypeCode").ufCombox({
                            idField: "chrCode",
                            textField: "chrName",
                            data: data, //json 数据
                            placeholder: "请选凭证类型",
                            onChange: function (sender, data) {
                                var chrId = data.chrId;
                                // $("#vouBudTypeCode_input").attr("chrId", chrId);
                            },
                            onComplete: function (sender) {
                                $("#vouBudTypeCode_input").attr("autocomplete", "off");
                                if (onerdata && onerdata.action == "editTemplate") {
                                    var tempVouBudType = page.EorC(onerdata.thisdata.lpVouTemplate["vouBudTypeCode"]);
                                    var count = 0;
                                    for (var i = 0; i < result.data.length; i++) {
                                        if (result.data[i].chrCode == tempVouBudType.replace(/'/g, "")) {
                                            $("#vouBudTypeCode").getObj().val(tempVouBudType.replace(/'/g, ""));
                                            count = 1;
                                        }
                                    }
                                    if (count != 1) {
                                        $("#vouBudTypeCode").getObj().val("*");
                                    }
                                    $("#vouBudTypeCode").find("input").attr("data-formula", tempVouBudType);
                                } else if (data.length > 0) {
                                    $("#vouBudTypeCode").getObj().val(data[0].chrCode);
                                }
                            }
                        });
                    });
                } else {//非平行记账或平行记账单凭证
                    var url = interfaceURL.getVouType + page.getAgencyCode() + "/" + year + "/*" + "/" + acctCode;
                    ufma.get(url, argu, function (result) {
                        var obj = {
                            chrCode: "*",
                            chrName: "自定义规则",
                            codeName: "* 自定义规则"
                        };
                        // result.data.unshift(obj);
                        result.data.push(obj); // CWYXM-17056
                        var data = result.data;
                        if (data && data.length > 0) {
                            vouTypeData = data;
                        }
                        $("#vouFinTypeCode").ufCombox({
                            idField: "chrCode",
                            textField: "chrName",
                            data: data, //json 数据
                            placeholder: "请选凭证类型",
                            onChange: function (sender, data) {
                                var chrId = data.chrId;
                                // $("#vouFinTypeCode_input").attr("chrId", chrId);

                            },
                            onComplete: function (sender) {
                                $("#vouFinTypeCode_input").attr("autocomplete", "off");
                                if (onerdata && onerdata.action == "editTemplate") {
                                    var tempVouFinType = page.EorC(onerdata.thisdata.lpVouTemplate["vouFinTypeCode"]);
                                    var count = 0;
                                    for (var i = 0; i < result.data.length; i++) {
                                        if (result.data[i].chrCode == tempVouFinType.replace(/'/g, "")) {
                                            $("#vouFinTypeCode").getObj().val(tempVouFinType.replace(/'/g, ""));
                                            count = 1;
                                        }
                                    }
                                    if (count != 1) {
                                        $("#vouFinTypeCode").getObj().val("*");
                                    }
                                    $("#vouFinTypeCode").find("input").attr("data-formula", tempVouFinType);
                                } else if (data.length > 0) {
                                    $("#vouFinTypeCode").getObj().val(data[0].chrCode);
                                }
                            }
                        });
                    });
                }

                //凭证日期 凭证类型
                if (onerdata.action == "editTemplate") {
                    $("#vouDate").find("input").val(page.EorC(onerdata.thisdata.lpVouTemplate["vouDate"]));
                    $("#vouDate").find("input").attr("data-formula", page.EorC(onerdata.thisdata.lpVouTemplate["vouDate"]));
                    $("#vouBudDate").find("input").val(page.EorC(onerdata.thisdata.lpVouTemplate["vouBudDate"]));
                    $("#vouBudDate").find("input").attr("data-formula", page.EorC(onerdata.thisdata.lpVouTemplate["vouBudDate"]));
                    // $("#vouFinTypeCode").find("input").val(page.EorC(onerdata.thisdata.lpVouTemplate["vouFinTypeCode"]));
                    // $("#vouFinTypeCode").find("input").attr("data-formula", page.EorC(onerdata.thisdata.lpVouTemplate["vouFinTypeCode"]));
                    // $("#vouBudTypeCode").find("input").val(page.EorC(onerdata.thisdata.lpVouTemplate["vouBudTypeCode"]));
                    // $("#vouBudTypeCode").find("input").attr("data-formula", page.EorC(onerdata.thisdata.lpVouTemplate["vouBudTypeCode"]));
                }
            },
            
            //请求单位
            getAgencyTreeList: function () {
                var argu = {
                    rgCode: ptData.svRgCode,
                    setYear: ptData.svSetYear
                };
                ufma.get(interfaceURL.getAgencyTree, argu, page.getAgencyTree);
            },
            //请求单位类型
            getAgencyType: function () {
                var argu = {
                    rgCode: ptData.svRgCode,
                    setYear: ptData.svSetYear
                };
                ufma.get(interfaceURL.getAgencyType, argu, page.getAgencyTypeList);
            },
            //请求科目体系
            getAccs: function () {
                //请求科目体系
                var argu = {
                    rgCode: ptData.svRgCode,
                    setYear: ptData.svSetYear
                };
                ufma.get(interfaceURL.getAccsList, argu, page.getAccsList);
            },
            //请求账套
            getAcct: function (agencyCode) {
                //请求账套
                if(agencyCode == undefined || agencyCode == null){
                    agencyCode = page.getAgencyCode();
                }
                var arg = {
                    agencyCode: agencyCode,
                    setYear: ptData.svSetYear,
                    rgCode: ptData.svRgCode,
                    agencyTypeCode: $("#agencyType").getObj().getValue()
                };
                ufma.get(interfaceURL.getAcct, arg, page.getAcctList);
            },
            //判断单位
            getAgencyCode: function () {
                var agencyCode = "*";
                if (onerdata.action === "editTemplate" || onerdata.data.agencyCode !== "*") {

                    //修改时或者是单位级单据方案时，取带过来的agencyCode
                    agencyCode = onerdata.data.agencyCode;
                } else {

                    //系统级单据方案时，获取选择的单位
                    if ($('input[name="subUnits"]:checked').val() == "*") {
                        agencyCode = "*";
                    } else {
                        // if (page.agency == undefined || $("#bdAgency_input").val() == "") {
                        //     agencyCode = "";
                        // } else {
                        // agencyCode = page.agency.getValue();
                        // }
                        agencyCode = danwei;
                    }
                }
                return agencyCode;
            },
            //请求枚举表数据
            enumerate: function () {
                var argu = {
                    rgCode: ptData.svRgCode,
                    setYear: ptData.svSetYear
                };
                var url = interfaceURL.enumerate + "ACCE_FMLA_DIRECT";
                ufma.get(url, argu, function (result) {
                    // enumerateData = result.data;
                    for (var i in result.data) {
                        enumerateData.push({ drCr: i, drCr_NAME: result.data[i] });
                    }
                    //渲染表格，修改set数据
                    page.showinit();
                });
            },
            //把公式编辑器里的值set到相应的位置上
            setFormulaEditorData: function (data) {
                if (data.action) {
                    if (data.action.pagePosition == "detailCondition") {
                        //分录明细-生成条件
                        $(document).find("#tgDetailtableBody").find(".uf-grid-body-view .uf-grid-table tbody").find("#" + data.action.alldata.rid).find("td[name=templCondition]").text(data.action.val);
                        $(document).find("#tgDetailtablebuttonedittemplCondition").find("input[name=templCondition]").val(data.action.val);
                    } else if (data.action.pagePosition == "detailHjtx") {
                        //分录明细-摘要
                        $(document).find("#tgDetailtableBody").find(".uf-grid-body-view .uf-grid-table tbody").find("#" + data.action.alldata.rid).find("td[name=hjtx]").text(data.action.val);
                        $(document).find("#tgDetailtablebuttonedithjtx").find("input[name=hjtx]").val(data.action.val);
                    } else if (data.action.pagePosition == "detailHjkm") {
                        //分录明细-会计科目
                        $(document).find("#tgDetailtableBody").find(".uf-grid-body-view .uf-grid-table tbody").find("#" + data.action.alldata.rid).find("td[name=hjkm]").text(data.action.val);
                        $(document).find("#tgDetailtablebuttonedithjkm").find("input[name=hjkm]").val(data.action.val);
                    } else if (data.action.pagePosition == "detailMoneyall") {
                        //分录明细-金额
                        $(document).find("#tgDetailtableBody").find(".uf-grid-body-view .uf-grid-table tbody").find("#" + data.action.alldata.rid).find("td[name=moneyall]").text(data.action.val);
                        $(document).find("#tgDetailtablebuttoneditmoneyall").find("input[name=moneyall]").val(data.action.val);
                    // } else if (data.action.pagePosition == "accountGsName") {
                    //     //辅助核算-值公式
                    //     $(document).find("#tgAccounttableBody").find(".uf-grid-body-view .uf-grid-table tbody").find("#" + data.action.alldata.rid).find("td[name=gsName]").text(data.action.val);
                    //     $(document).find("#tgAccounttablebuttoneditgsName").find("input[name=gsName]").val(data.action.val);
                    } else if (data.action.pagePosition == "accItemType") {
                        // lpVouAccitemTemplates = data.action.data;
                        var txt = '';
                        for (var i = 0; i < data.action.data.length; i++) {
                            txt += data.action.data[i].accItemName + ":" + data.action.data[i].gsName + "\r";
                        }
                        if (data.action.data.length > 6) {
                            $(document).find("#tgDetailtabletextareaaccItemType").find("textarea[name=accItemType]").height(data.action.data.length * 20);
                            var h = $(document).find("#tgDetailtabletextareaaccItemType").find("textarea[name=accItemType]").height();
                            $(document).find("#tgDetailtableBody").find(".uf-grid-table").find("#" + data.action.rid).find("td").height(h + 16);
                        }
                        $(document).find("#tgDetailtabletextareaaccItemType").find("textarea[name=accItemType]").val(txt);
                        $(document).find("#tgDetailtableBody").find(".uf-grid-table").find("#" + data.action.rid).find("td[name=accItemType]").text(txt);
                        // 公式编辑器里选择的辅助核算
                        var trArr = $(document).find("#tgDetailtableBody").find(".uf-grid-table").find('tr');
                        var actionIndex;
                        for (var j = 0; j < trArr.length; j++) {
                            if(trArr[j].id == data.action.rid) {
                                actionIndex = j - 1;
                                break;
                            }
                        }
                        accItemTypeDataTemp[actionIndex] = data.action.tgAccountdata;
                        var i = data.action.rid.split('_')[data.action.rid.split('_').length - 1]
                        tgAccountdata[i - 1] = data.action.tgAccountdata;
                    } else if (data.action.pagePosition == "vouFinTypeCode") {
                        //凭证类型
                        $("#vouFinTypeCode").find("input").attr("data-formula", data.action.formula);
                    } else if (data.action.pagePosition == "vouBudTypeCode") {
                        //凭证类型
                        $("#vouBudTypeCode").find("input").attr("data-formula", data.action.formula);
                    } else {
                        var id2 = $("#" + data.action.alldata.allid);
                        $(id2).find("input").val(data.action.val);
                        $(id2).find("input").attr("data-formula", data.action.formula);
                    }
                }
            },
            //初始化页面
            initPage: function () {
                // 请求单位列表
                page.getAgencyTreeList();
                // 加载单位
                page.getAgency();
                // 请求单位类型
                page.getAgencyType();
                // 初始化单位类型
                page.initAgencyTypeList();
                //初始化科目体系
                page.initAccaList();
                //初始化账套
                page.initAcctList();
                //请求枚举表数据（借方、贷方）
                page.enumerate();
                //判断是编辑模版还是新增模版
                if (page.getAgencyCode() == "*") {
                    $("#acct").addClass("hidden");
                    $("#accs").removeClass("hidden");
                    //请求科目体系
                    page.getAccs();
                } else {
                    $("#acct").removeClass("hidden");
                    $("#accs").addClass("hidden");
                    //请求账套
                    page.getAcct();
                }
                // $("#tgDetail").css("height", $(".ufma-layout-up").eq(0).height() - 250 + 'px');
            },
            onEventListener: function () {
                //选中单位的时候,单位下拉才会出现
                // $('input[name="subUnits"]').on('change', function () {
                //     if ($('#alldw').is(':checked')) {
                //         //所属单位为全局
                //         $("#tgAgency").css({
                //             "visibility": "hidden"
                //         });
                //         //page.agency.setValue("0","全部"); //目前不好使
                //         $("#tgAgency").val("");
                //         $("#accs").removeClass("hidden");
                //         $("#acct").addClass("hidden");
                //         // page.getVouType();
                //         danwei = "*";
                //     } else {
                //         danwei = "";
                //         $("#tgAgency").css({
                //             "visibility": "visible"
                //         });
                //         $("#accs").addClass("hidden");
                //         $("#acct").removeClass("hidden");
                //     }
                //     page.getIsParallel({})
                //     //清空基本信息 S
                //     $(".uf-combox").each(function () {
                //         $(this).getObj().setValue("", "");
                //     });
                //     $(".set-form-cont .uf-buttonedit-border input").each(function () {
                //         $(this).val("");
                //     })
                //     //清空基本信息 E

                //     // 重置单位
                //     $("#tgAgency").getObj().setValue(agencyTreeData[0].code, agencyTreeData[0].codeName);

                //     // 重置单位类型
                //     $("#agencyType").getObj().val("*");
                // });
                //选择凭证类型时监听事件,选中自定义时弹出公式编辑器 guohx            
                $('body').on("mousedown", "#vouFinTypeCode_popup .uf-combox-list-item", function (e) {
                    if ($(this).attr('option-value') == "*") {
                        if (!getReqAcctCode()) {
                            return false;
                        }
                        //revise S
                        if (page.isParallel) {
                            isCW = '1';
                        } else {
                            isCW = '*';
                        }
                        var datas = {
                            billTypeGuid: onerdata.data.schemeGuid,
                            agencyCode: danwei,
                            targetBill: $('#tgTarget').val() ? $('#tgTarget').val() : 'LP_VOU_TEMPLATE',
                            thisId: "templateGeneration",
                            UPagencyCode: onerdata.data.UPagencyCode,
                            FormulaEditorVal: $("#vouFinTypeCode").find("input").attr("data-formula"),
                            reqAcctCode: getReqAcctCode(),
                            isCW: isCW,
                            pagePosition: "vouFinTypeCode"
                        };
                        ufma.setObjectCache("openFormulaEditor", datas);
                        $(".u-msg-dialog-top", parent.document).prevAll("#billDefinition").find("#open-formula-editor").click();
                    }
                    $(this).trigger("click");
                });
                $('body').on("mousedown", "#vouBudTypeCode_popup .uf-combox-list-item", function (e) {
                    if ($(this).attr('option-value') == "*") {
                        if (!getReqAcctCode()) {
                            return false;
                        }
                        //revise S
                        var datas = {
                            billTypeGuid: onerdata.data.schemeGuid,
                            agencyCode: danwei,
                            targetBill: $('#tgTarget').val() ? $('#tgTarget').val() : 'LP_VOU_TEMPLATE',
                            thisId: "templateGeneration",
                            UPagencyCode: onerdata.data.UPagencyCode,
                            FormulaEditorVal: $("#vouBudTypeCode").find("input").attr("data-formula"),
                            reqAcctCode: getReqAcctCode(),
                            isCW: 2,
                            pagePosition: "vouBudTypeCode"
                        };
                        ufma.setObjectCache("openFormulaEditor", datas);
                        $(".u-msg-dialog-top", parent.document).prevAll("#billDefinition").find("#open-formula-editor").click();
                    }
                    $(this).trigger("click");
                });
                //随窗口大小变化
            },
            //此方法必须保留
            init: function () {
                ufma.parse();
                //权限控制
                page.reslist = ufma.getPermission();
                ufma.isShow(page.reslist);
                page.bottomdata();//调整调用顺序，不然编辑的时候，对比字典的结果没有拿到 guohx 20200805
                this.initPage();
                this.onEventListener();
            }

        }
    }();
    /////////////////////
    page.init();
    // $("body").on("click", "#tgDetailbutton", function () {
    //     var rowdata = {
    //         "templCondition": "",
    //         "hjtx": "",
    //         "hjkm": "",
    //         "fx": "",
    //         "moneyall": "",
    //         "accItemType": ""
    //     }
    //     tgDetaildatahq.push(rowdata)
    //     var obj = $('#tgDetailtable').getObj();
    //     obj.add(rowdata)
    //     // $("[data-toggle='tooltip']").tooltip();
    //     ufma.isShow(page.reslist);
    // })
    $("body").on("click", "#tgDetailtableBody", function () {
        $("#tgDetailtableBody").find("input").attr("disabled", true);
    })
    $("body").on("click", "#tgAccounttableBody", function () {
        $("#tgAccounttableBody").find("input[name=gsName]").attr("disabled", true);
    })
    $("body").on("click", "#tgAccountbutton", function () {
        var rowdata = {
            "eleName": "",
            "eleCode": "",
            "accItemCode": "",
            "gsName": ""
        }
        tgAccountdatahq.push(rowdata)
        var obj = $('#tgAccounttable').getObj();
        obj.add(rowdata)
        ufma.isShow(page.reslist);
    })

    function getReqAcctCode() {
        var accsCode = $("#domId").getObj().getValue();
        var acctCode = $("#domId2").getObj().getValue();
        var reqAcctCode;

        if (danwei == "*") {
            if (accsCode !== "" && accsCode !== null && accsCode !== undefined) {
                return reqAcctCode = { reqAcctCode: accsCode, reqAcctType: 0 };
            } else {
                ufma.showTip("请选择科目体系", function () {

                }, "warning");
                return false;
            }
        } else {
            if (acctCode !== "" && acctCode !== null && acctCode !== undefined) {
                return reqAcctCode = { reqAcctCode: acctCode, reqAcctType: 1 };
            } else {
                ufma.showTip("请选账套", function () {

                }, "warning");
                return false;

            }
        }
    }

    $("body").on("click", ".set-form-li .uf-buttonedit-button", function () {
        var allid = $(this).parents(".set-form-li").attr("id");
        var elecode = $(this).prev("input").attr("elecode");
        if (!getReqAcctCode()) {
            return false;
        }
        //revise S
        var datas = {
            billTypeGuid: onerdata.data.schemeGuid,
            agencyCode: danwei,
            eleCode: elecode,
            targetBill: $('#tgTarget').val() ? $('#tgTarget').val() : 'LP_VOU_TEMPLATE',
            allid: allid,
            thisId: "templateGeneration",
            UPagencyCode: onerdata.data.UPagencyCode,
            FormulaEditorVal: $("#" + allid).find("input").val(),
            reqAcctCode: getReqAcctCode()
        };
        ufma.setObjectCache("openFormulaEditor", datas);
        $(".u-msg-dialog-top", parent.document).prevAll("#billDefinition").find("#open-formula-editor").click();
        //revise E
        // ufma.open({
        //     url: '../formulaeditor/formulaEditor.html',
        //     title: '公式编辑器',
        //     width: fdWidth,
        //     height: 500,
        //     data: {
        //         billTypeGuid: onerdata.data.schemeGuid,
        //         agencyCode: danwei,
        //         eleCode: elecode,
        //         targetBill: $('#tgTarget').val() ? $('#tgTarget').val() : 'LP_VOU_TEMPLATE',
        //         allid: allid,
        //         thisId: "templateGeneration",
        //         UPagencyCode: onerdata.data.UPagencyCode,
        //         FormulaEditorVal: $("#" + allid).find("input").val(),
        //         reqAcctCode: getReqAcctCode()
        //     },
        //     ondestory: function (data) {
        //         //窗口关闭时回传的值
        //         if (data.action) {
        //             $("#" + data.action.alldata.allid).find("input").val(data.action.val);
        //             $("#" + data.action.alldata.allid).find("input").attr("data-formula", data.action.formula);
        //         }
        //     }
        // });
    })
    // //核算项行插入
    // $(document).on("mousedown", "#tgAccounttable .insertthis span", function () {
    //     var rowid = $(this).parents("tr").attr("id");
    //     var rowindex = $(this).parents("tr").index();
    //     var rowdata = {
    //         "eleName": "",
    //         "eleCode": "",
    //         "accItemCode": "",
    //         "gsName": ""
    //     }
    //     var insertdata = {
    //         "eleName": "",
    //         "eleCode": "",
    //         "accItemCode": "",
    //         "gsName": ""
    //     }
    //     tgAccountdatahq.splice(rowindex, '0', rowdata)
    //     var obj = $('#tgAccounttable').getObj();
    //     obj.insert(rowid, rowdata)
    //     ufma.isShow(page.reslist);
    // });
    //分录行插入
    $(document).on("mousedown", "#tgDetailtable .insertthis span", function () {
        var rowid = $(this).parents("tr").attr("id");
        var rowindex = $(this).parents("tr").index();
        var rowdata = [{
            "templCondition": "",
            "hjtx": "",
            "hjkm": "",
            "fx": "",
            "moneyall": "",
            "accItemType": ""
        }]
        var insertdata = {
            "templCondition": "",
            "hjtx": "",
            "hjkm": "",
            "fx": "",
            "moneyall": "",
            "accItemType": ""
        }
        tgDetaildatahq.splice(rowindex, '0', insertdata)
        var obj = $('#tgDetailtable').getObj();
        obj.insert(rowid, rowdata);
        // $("[data-toggle='tooltip']").tooltip();
        ufma.isShow(page.reslist);
    });
    //分录行复制
    $(document).on("mousedown", "#tgDetailtable .copythis span", function (e) {
        $(document).trigger("mousedown");
        var t = $(this);
        var timeId = setTimeout(function () {
            var rowid = t.parents("tr").attr("id");
            var arr = rowid.split("_");
            var rowindex = Number(arr[arr.length - 1]);
            var result = false, copyRowDatas;
            var eles = $(".uf-grid-body-view").find("#" + rowid).find("td");
            var rowObj = {};
            var trArr = $(document).find("#tgDetailtableBody").find(".uf-grid-table").find('tr');
            var actionIndex;
            var rowIdIndexArr = [];
            for (var j = 0; j < trArr.length; j++) {
                if(trArr[j].id == rowid) {
                    actionIndex = j - 1;
                    break;
                }
            }
            for (var m = 1; m < trArr.length; m++) {
                if(!trArr[m].id) {
                    break;
                }
                var arrTemp = trArr[m].id ? trArr[m].id.split("_") : [];
                var idIndex = Number(arrTemp[arrTemp.length - 1]);
                rowIdIndexArr.push(idIndex);
            }
            var newIndex = rowIdIndexArr.length + 1;
            for (var n = 0; n < rowIdIndexArr.length; n++) {
                if(rowIdIndexArr.indexOf(n + 1) > -1) {
                } else {
                    newIndex = n + 1;
                }
            }
            $(eles).each(function (i) {
                if ($(this).text() != "") {
                    result = true;
                }
                if (i == 0) {
                    rowObj.templCondition = $(this).text();
                } else if (i == 1) {
                    rowObj.hjtx = $(this).text();
                } else if (i == 2) {
                    rowObj.hjkm = $(this).text();
                } else if (i == 3) {
                    if ($(this).text() == "借方") {
                        rowObj.drCr = "1";
                        rowObj.drCr_NAME = "借方";
                        rowObj.fx = "1";
                    } else if ($(this).text() == "贷方") {
                        rowObj.drCr = "-1";
                        rowObj.drCr_NAME = "贷方";
                        rowObj.fx = "-1";
                    }
                } else if (i == 4) {
                    rowObj.moneyall = $(this).text();
                } else if (i == 5) { // 辅助核算单元格
                    rowObj.accItemType = $(this).text().replaceAll("】", "】<br>");
                    rowObj.data = accItemTypeDataTemp[actionIndex]; // 记录data
                }

            });
            if (!result) {
                copyRowDatas = {
                    "templCondition": "",
                    "hjtx": "",
                    "hjkm": "",
                    "fx": "",
                    "moneyall": "",
                    "accItemType": ""
                };
            } else {
                // var tableDatas = $("#tgDetailtable").getObj().getData();
                // copyRowDatas = tableDatas[rowindex-1];
                copyRowDatas = rowObj;
            }

            tgDetaildatahq.splice(rowindex, '0', copyRowDatas);
            var obj = $('#tgDetailtable').getObj();
            obj.insert(rowid, copyRowDatas);
            var h = $(document).find("#tgDetailtableBody").find(".uf-grid-table").find("#tgDetailtable_row_" + (rowindex)).find("td[name=accItemType]").height();
            $(document).find("#tgDetailtableBody").find(".uf-grid-table").find("#tgDetailtable_row_" + (newIndex)).find("td[name=remark]").height(h);
            // 复制行的辅助核算
            for (var i = accItemTypeDataTemp.length; i > -1; i--) {
                if (i > actionIndex) {
                    accItemTypeDataTemp[i] = accItemTypeDataTemp[i - 1];
                }
            }
            $("#tgDetailtabletextareaaccItemType").find("textarea[name=accItemType]").val(rowObj.data);
            tgAccountdatahq.splice(rowindex, 0, rowObj.data);
            tgAccountdata.splice(rowindex, 0, rowObj.data);
            ufma.isShow(page.reslist);
        }, 300)


    });
    // //辅助核算表格行删除
    // $(document).on("mousedown", "#tgAccounttable .delthis span", function () {
    //     var rowid = $(this).parents("tr").attr("id");
    //     var rowindex = $(this).parents("tr").index();
    //     tgAccountdatahq.splice(rowindex, 1)
    //     var obj = $('#tgAccounttable').getObj();
    //     obj.del(rowid)
    // })
    //分录明细表格行删除
    $(document).on("mousedown", "#tgDetailtable .delthis span", function () {
        var rowid = $(this).parents("tr").attr("id");
        var rowindex = $(this).parents("tr").index();
        tgDetaildatahq.splice(rowindex, 1)
        tgAccountdata.splice(rowindex, 1);
        var obj = $('#tgDetailtable').getObj();
        obj.del(rowid)
        accItemTypeDataTemp.splice(rowindex, 1);
    })
    //分录行向上
    $(document).on("mousedown", "#tgDetailtable .tuodongtop span", function () {
        $(this).parents(".panel").click();
        var rowindex = $(this).parents("tr").index() - 1;
        var keyhq = tgDetaildatahq[rowindex];
        var key = tgAccountdata[rowindex];
        var keyTemp = accItemTypeDataTemp[rowindex];
        if (rowindex > 0) {
            var thistr = $(this).parents("tr");
            var thistrnext = $(this).parents("tr").prev("tr");
            thistr.insertBefore(thistrnext);
            var rowid = $(this).parents("tr").attr("id");
            var rowidnext = $(".uf-grid-body-view").find("#" + rowid).prev("tr").attr("id");
            $(".uf-grid-body-view").find("#" + rowid).insertBefore($(".uf-grid-body-view").find("#" + rowidnext));
            if (rowidnext) {
                tgDetaildatahq[rowindex] = tgDetaildatahq[rowindex - 1]
                tgDetaildatahq[rowindex - 1] = keyhq
                tgAccountdata[rowindex] = tgAccountdata[rowindex - 1]
                tgAccountdata[rowindex - 1] = key
                accItemTypeDataTemp[rowindex] = accItemTypeDataTemp[rowindex - 1]
                accItemTypeDataTemp[rowindex - 1] = keyTemp
            }
        }
    })
    //分录行向下
    $(document).on("mousedown", "#tgDetailtable .tuodongbottom span", function () {
        $(this).parents(".panel").click();
        var rowindex = $(this).parents("tr").index() - 1;
        var keyhq = tgDetaildatahq[rowindex];
        var key = tgAccountdata[rowindex];
        var keyTemp = accItemTypeDataTemp[rowindex];
        if (rowindex < tgDetaildatahq.length - 1) {
            var thistr = $(this).parents("tr");
            var thistrnext = $(this).parents("tr").next("tr");
            thistr.insertAfter(thistrnext);
            var rowid = $(this).parents("tr").attr("id");
            var rowidnext = $(".uf-grid-body-view").find("#" + rowid).next("tr").attr("id");
            $(".uf-grid-body-view").find("#" + rowid).insertAfter($(".uf-grid-body-view").find("#" + rowidnext));
            if (rowidnext) {
                tgDetaildatahq[rowindex] = tgDetaildatahq[rowindex + 1]
                tgDetaildatahq[rowindex + 1] = keyhq
                tgAccountdata[rowindex] = tgAccountdata[rowindex + 1]
                tgAccountdata[rowindex + 1] = key
                accItemTypeDataTemp[rowindex] = accItemTypeDataTemp[rowindex + 1]
                accItemTypeDataTemp[rowindex + 1] = keyTemp
}
        }
    })
    // //核算项行向上
    // $(document).on("mousedown", "#tgAccounttable .tuodongtop span", function () {
    //     $(this).parents(".panel").click();
    //     var rowindex = $(this).parents("tr").index() - 1;
    //     var key = tgAccountdatahq[rowindex];
    //     if (rowindex > 0) {
    //         tgAccountdatahq[rowindex] = tgAccountdatahq[rowindex - 1]
    //         tgAccountdatahq[rowindex - 1] = key
    //         var thistr = $(this).parents("tr");
    //         var thistrnext = $(this).parents("tr").prev("tr");
    //         thistr.insertBefore(thistrnext);
    //     }
    // })
    // //核算项行向下
    // $(document).on("mousedown", "#tgAccounttable .tuodongbottom span", function () {
    //     $(this).parents(".panel").click();
    //     var rowindex = $(this).parents("tr").index() - 1;
    //     var key = tgAccountdatahq[rowindex];
    //     if (rowindex < tgAccountdatahq.length - 1) {
    //         tgAccountdatahq[rowindex] = tgAccountdatahq[rowindex + 1]
    //         tgAccountdatahq[rowindex + 1] = key
    //         var thistr = $(this).parents("tr");
    //         var thistrnext = $(this).parents("tr").next("tr");
    //         thistr.insertAfter(thistrnext);
    //     }
    // })
    $("body").on("mousedown", ".panel-title .actions", function () {
        $(".ufma-layout-up").height($(".ufma-layout-up").height() + 1)
        $(".ufma-layout-up").height($(".ufma-layout-up").height() - 1)
    })
    $("body").on("click", "#btn-qx", function () {
        _close();
        // $("#tempModalBg", parent.document).prevAll("#billDefinition").find("#showclickbillDefinition").click();
        // $("#tempModalBg", parent.document).prevAll("#billDefinition").siblings("#ModalBg").css("display", "none");
        // $("#tempModalBg", parent.document).remove();
    })

    //保存模版
    $("body").on("click", "#btnsaveddd", function () {
        // if (showdatasuccess == 3) {
            // //辅项表格行内容都是必填项
            // var lpVouAccitemTemplates = [];
            // var accountTableDatas = $("#tgAccounttable").getObj().getData();
            // var accountResult = false;
            // for (var i = 0; i < accountTableDatas.length; i++) {
            //     var dataone = new Object();
            //     dataone.ordSeq = i + 1;
            //     dataone.accItemCode = accountTableDatas[i].accItemCode;
            //     if (dataone.accItemCode == "" || dataone.accItemCode == undefined) {
            //         accountResult = true;
            //         ufma.showTip("辅助核算表第" + dataone.ordSeq + "行辅助核算未填写", function () {

            //         }, "warning");
            //         break;
            //     }
            //     dataone.value = page.CorE(accountTableDatas[i].gsName);
            //     if (dataone.value == "" || dataone.value == undefined) {
            //         accountResult = true;
            //         ufma.showTip("辅助核算表第" + dataone.ordSeq + "行值公式未填写", function () {

            //         }, "warning");
            //         break;
            //     }
            //     lpVouAccitemTemplates.push(dataone);
            // }
            // if (accountResult) {
            //     return false;
            // }

            //分录明细表格行内容都是必填项
            var lpVouDetailTemplates = [];
            var tableDatas = $("#tgDetailtable").getObj().getData();
            var detailResult = false;
            for (var i = 0; i < tableDatas.length; i++) {
                var dataone = new Object();
                dataone.ordSeq = i + 1;
                dataone.templCondition = page.CorE(tableDatas[i].templCondition);
                if (dataone.templCondition == "" || dataone.templCondition == undefined) {
                    detailResult = true;
                    ufma.showTip("分录明细表第" + dataone.ordSeq + "行生成条件未填写", function () {

                    }, "warning");
                    break;
                }
                dataone.accoCode = page.CorE(tableDatas[i].hjkm);
                if (dataone.accoCode == "" || dataone.accoCode == undefined) {
                    detailResult = true;
                    ufma.showTip("分录明细表第" + dataone.ordSeq + "行会计科目未填写", function () {

                    }, "warning");
                    break;
                }
                // dataone.drCr = page.CorE($("#tgDetailtableBody").find(".uf-grid-body-view .uf-grid-table tbody tr").eq(i).find('td[name=fx]').text());
                dataone.drCr = tableDatas[i].drCr ? tableDatas[i].drCr : "";
                if (dataone.drCr == "" || dataone.drCr == undefined) {
                    detailResult = true;
                    ufma.showTip("分录明细表第" + dataone.ordSeq + "行方向未填写", function () {

                    }, "warning");
                    break;
                }
                dataone.stadAmt = page.CorE(tableDatas[i].moneyall);
                if (dataone.stadAmt == "" || dataone.stadAmt == undefined) {
                    detailResult = true;
                    ufma.showTip("分录明细表第" + dataone.ordSeq + "行金额未填写", function () {

                    }, "warning");
                    break;
                }
                dataone.descpt = page.CorE(tableDatas[i].hjtx);
                if (dataone.descpt == "" || dataone.descpt == undefined) {
                    detailResult = true;
                    ufma.showTip("分录明细表第" + dataone.ordSeq + "行摘要未填写", function () {

                    }, "warning");
                    break;
                }
                // 保存时获取的辅助核算
                var obj = accItemTypeDataTemp[i];
                var arr = [];
                for (var j in obj) {
                    if (obj[j]["ordSeq"]) {
                        var newObj = {};
                        newObj.accItemCode = obj[j].accItemCode;
                        newObj.ordSeq = obj[j].ordSeq;
                        newObj.value = obj[j].value;
                        arr.push(newObj)
                    }
                }
                dataone.lpVouAccitemTemplates = arr;
                lpVouDetailTemplates.push(dataone);
            }
            if (detailResult) {
                return false;
            }

            if (onerdata.thisdata != undefined) {
                // var accsCode = $("#domId_input").attr("accs-code");
                // var acctCode = $("#domId2_input").attr("acct-code");
                var agencyTypeCode = $("#agencyType").getObj().getValue();
                var accsCode = $("#domId").getObj().getValue();
                var acctCode = $("#domId2").getObj().getValue();
                if ($("#vouBudTypeCode").getObj().getValue() == "*") {
                    var budChrId = "ZDY:" + page.CorE($("#vouBudTypeCode_input").attr("data-formula"));
                } else {
                    var budChrId = "'" + $("#vouBudTypeCode").getObj().getValue() + "'";
                }
                if ($("#vouFinTypeCode").getObj().getValue() == "*") {
                    var finChrId = "ZDY:" + page.CorE($("#vouFinTypeCode_input").attr("data-formula"));
                } else {
                    var finChrId = "'" + $("#vouFinTypeCode").getObj().getValue() + "'";
                }
                var updatekeys = {
                    // "lpVouAccitemTemplates": lpVouAccitemTemplates,
                    "lpVouDetailTemplates": lpVouDetailTemplates,
                    "lpVouTemplate": {
                        "schemeGuid": onerdata.data.schemeGuid, //--单据类型
                        // "tarBillKind": $('#tgTarget').val(), //--目标单据类型
                        // "tarBillKind": "LP_VOU_TEMPLATE", //--目标单据类型
                        "vouTmpName": page.CorE($("#vouTmpName").find("input").val() ? $("#vouTmpName").find("input").val() : ""),//模版名称
                        "agencyCode": danwei, //--单位代码
                        // "accaCode": page.CorE($("#accaCode").find("input").val()), //--科目体系
                        // "acctCode": page.CorE($("#acctCode").find("input").val()), //--帐套
                        "agencyTypeCode": page.CorE(agencyTypeCode ? agencyTypeCode : ""), //--单位类型
                        "accaCode": page.CorE(accsCode ? accsCode : ""), //--科目体系
                        "acctCode": page.CorE(acctCode ? acctCode : ""), //--帐套
                        "vouStatus": page.CorE($("#vouStatus").find("input").val() ? $("#vouStatus").find("input").val() : ""),
                        "vouDate": page.CorE($("#vouDate").find("input").val() ? $("#vouDate").find("input").val() : ""),//财务会计凭证日期
                        "vouBudDate": page.CorE($("#vouBudDate").find("input").val() ? $("#vouBudDate").find("input").val() : ""),//预算会计凭证日期
                        "vouDesc": page.CorE($("#vouDesc").find("input").val() ? $("#vouDesc").find("input").val() : ""),
                        "vouBudTypeCode": budChrId ? budChrId : "",//预算会计凭证类型
                        "inputor": page.CorE($("#inputor").find("input").val() ? $("#inputor").find("input").val() : ""),
                        "auditor": page.CorE($("#auditor").find("input").val() ? $("#auditor").find("input").val() : ""),
                        "vouFinTypeCode": finChrId ? finChrId : "",//财务会计凭证类型
                        "poster": page.CorE($("#poster").find("input").val() ? $("#poster").find("input").val() : ""),
                        "matchCondition": page.CorE($("#matchCondition").find("input").val() ? $("#matchCondition").find("input").val() : ""),
                        "vouCnt": page.CorE($("#vouCnt").find("input").val() ? $("#vouCnt").find("input").val() : ""),
                        "remark": page.CorE($("#remark").find("input").val() ? $("#remark").find("input").val() : ""),
                        "fisPerd": page.CorE($("#fisPerd").find("input").val() ? $("#fisPerd").find("input").val() : ""),
                        "createDate": onerdata.thisdata.lpVouTemplate.createDate,
                        "createUser": onerdata.thisdata.lpVouTemplate.createUser,
                        "lastVer": onerdata.thisdata.lpVouTemplate.lastVer,
                        "latestOpDate": onerdata.thisdata.lpVouTemplate.latestOpDate,
                        "latestOpUser": onerdata.thisdata.lpVouTemplate.latestOpUser,
                        "rgCode": onerdata.thisdata.lpVouTemplate.rgCode,
                        "setYear": onerdata.thisdata.lpVouTemplate.setYear,
                        "tarBillKind": onerdata.thisdata.lpVouTemplate.tarBillKind,
                        "vouTmpGuid": onerdata.thisdata.lpVouTemplate.vouTmpGuid
                    }
                }
                //校验
                if (!checkDatas(updatekeys)) {
                    $(this).attr("disabled", false);
                    return false;
                }
                $(this).attr("disabled", true);
                ufma.post("/lp/template/updateTemplate?", updatekeys, function (res) {
                    ufma.showTip(res.msg, function () {
                        // closeModel();
                        _close("save");
                    }, res.flag);

                })
                var t = $(this);
                setTimeout(function () {
                    t.attr("disabled", false);
                }, 5000);
            } else {
                // var accsCode = $("#domId_input").attr("accs-code");
                // var acctCode = $("#domId2_input").attr("acct-code");
                var agencyTypeCode = $("#agencyType").getObj().getValue();
                var accsCode = $("#domId").getObj().getValue();
                var acctCode = $("#domId2").getObj().getValue();
                if ($("#vouBudTypeCode").getObj().getValue() == "*") {
                    if (page.isParallel && page.IS_DOUBLE_VOU) {
                       var budChrId = "ZDY:" + page.CorE($("#vouBudTypeCode_input").attr("data-formula"));
                    }
                } else {
                    var budChrId = "'" + $("#vouBudTypeCode").getObj().getValue() + "'";
                }
                if ($("#vouFinTypeCode").getObj().getValue() == "*") {
                    // if (page.isParallel && page.IS_DOUBLE_VOU) { // CWYXM-16418：凭证类型可以选择自定义，所以注释此行判断
                    if ($("#vouFinTypeCode_input").attr("data-formula")) {
                        var finChrId = "ZDY:" + page.CorE($("#vouFinTypeCode_input").attr("data-formula"));
                    } else {
                        ufma.showTip("自定义规则时请定义公式", function() {}, "warning");
                        return;
                    }
                    // }
                } else {
                    var finChrId = "'" + $("#vouFinTypeCode").getObj().getValue() + "'";
                }
                var kes = {
                    // "lpVouAccitemTemplates": lpVouAccitemTemplates,
                    "lpVouDetailTemplates": lpVouDetailTemplates,
                    "lpVouTemplate": {
                        "schemeGuid": onerdata.data.schemeGuid, //--单据类型
                        // "tarBillKind": $('#tgTarget').val(), //--目标单据类型
                        // "tarBillKind": "LP_VOU_TEMPLATE", //--目标单据类型
                        "vouTmpName": page.CorE($("#vouTmpName").find("input").val() ? $("#vouTmpName").find("input").val() : ""),//模版名称
                        "agencyCode": danwei, //--单位代码
                        // "accaCode": page.CorE($("#accaCode").find("input").val()), //--科目体系
                        // "acctCode": page.CorE($("#acctCode").find("input").val()), //--帐套
                        "agencyTypeCode": page.CorE(agencyTypeCode ? agencyTypeCode : ""), //--单位类型
                        "accaCode": page.CorE(accsCode ? accsCode : ""), //--科目体系
                        "acctCode": page.CorE(acctCode ? acctCode : ""), //--帐套
                        "vouStatus": page.CorE($("#vouStatus").find("input").val() ? $("#vouStatus").find("input").val() : ""),
                        "vouDate": page.CorE($("#vouDate").find("input").val() ? $("#vouDate").find("input").val() : ""),//财务会计凭证日期
                        "vouBudDate": page.CorE($("#vouBudDate").find("input").val() ? $("#vouBudDate").find("input").val() : ""),//预算会计凭证日期
                        "vouDesc": page.CorE($("#vouDesc").find("input").val() ? $("#vouDesc").find("input").val() : ""),
                        "vouBudTypeCode": budChrId ? budChrId : "",//预算会计凭证类型
                        "inputor": page.CorE($("#inputor").find("input").val() ? $("#inputor").find("input").val() : ""),
                        "auditor": page.CorE($("#auditor").find("input").val() ? $("#auditor").find("input").val() : ""),
                        "vouFinTypeCode": finChrId ? finChrId : "",//财务会计凭证类型
                        "poster": page.CorE($("#poster").find("input").val() ? $("#poster").find("input").val() : ""),
                        "matchCondition": page.CorE($("#matchCondition").find("input").val() ? $("#matchCondition").find("input").val() : ""),
                        "vouCnt": page.CorE($("#vouCnt").find("input").val() ? $("#vouCnt").find("input").val() : ""),
                        "remark": page.CorE($("#remark").find("input").val() ? $("#remark").find("input").val() : ""),
                        "fisPerd": page.CorE($("#fisPerd").find("input").val() ? $("#fisPerd").find("input").val() : ""),
                    }
                }
                //校验
                if (!checkDatas(kes)) {
                    $(this).attr("disabled", false);
                    return false;
                }
                $(this).attr("disabled", true);
                ufma.put("/lp/template/saveTemplate?", kes, function (res) {
                    ufma.showTip(res.msg, function () {
                        // closeModel();
                        _close("save");
                    }, res.flag);
                })
                var t = $(this);
                setTimeout(function () {
                    t.attr("disabled", false);
                }, 5000);
            }
        // } else {
        //     setTimeout(function () {
        //         $("#btnsaveddd").click();
        //     }, 200)
        // }
    });
    function checkDatas(kes) {
        if (kes.lpVouTemplate.vouTmpName == "" || kes.lpVouTemplate.vouTmpName == undefined || kes.lpVouTemplate.vouTmpName == null) {
            ufma.showTip('模版名称不能为空', function () {
            }, "warning");
            return false;
        }
        if (page.IS_DOUBLE_VOU) {
            if (kes.lpVouTemplate.vouFinTypeCode != "" && kes.lpVouTemplate.vouDate == "") {
                ufma.showTip('财务会计的凭证日期不能为空', function () {
                }, "warning");
                return false;
            }
            // if (kes.lpVouTemplate.vouBudTypeCode != "" && kes.lpVouTemplate.vouBudDate == "") {
            //     ufma.showTip('预算会计的凭证日期不能为空', function () {
            //     }, "warning");
            //     return false;
            // }
        } else {
            if (kes.lpVouTemplate.vouFinTypeCode == "") {
                ufma.showTip('凭证类型不能为空', function () {
                }, "warning");
                return false;
            }
            if (kes.lpVouTemplate.vouFinTypeCode != "" && kes.lpVouTemplate.vouDate == "") {
                ufma.showTip('凭证日期不能为空', function () {
                }, "warning");
                return false;
            }
        }
        return true;
    }
    $(document).on("click", ".close-model", function () {
        $("#tempModalBg", parent.document).prevAll("#billDefinition").siblings("#ModalBg").css("display", "none");
        $("#tempModalBg", parent.document).remove();
    });

    function closeModel() {
        $("#tempModalBg", parent.document).prevAll("#billDefinition").find("#showclickbillDefinition").click();
        $("#tempModalBg", parent.document).prevAll("#billDefinition").siblings("#ModalBg").css("display", "none");
        $("#tempModalBg", parent.document).remove();
    }

    if (className) {//单据方案（单位级）
        // if (billAgencyCode && billAgencyCode == "*") {//方案是系统级
        if (onerdata.data.agencyCode == "*") {//模版是系统级的
            $(".uf-buttonedit-button").remove();
            $(document).off("mousedown", "#tgDetailtable .insertthis span");
            $(document).off("mousedown", "#tgAccounttable .insertthis span");
            $(document).off("mousedown", "#tgDetailtable .delthis span");
            $(document).off("mousedown", "#tgAccounttable .delthis span");
            $(document).off("mousedown", "#tgDetailtable .tuodongtop span");
            $(document).off("mousedown", "#tgAccounttable .tuodongtop span");
            $(document).off("mousedown", "#tgDetailtable .tuodongbottom span");
            $(document).off("mousedown", "#tgAccounttable .tuodongbottom span");

        }
    }

});