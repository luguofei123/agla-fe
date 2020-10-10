$(function () {
    var onerdata = JSON.parse(window.sessionStorage.getItem("openAccItemTypeEditor"));
    var danwei = onerdata.agencyCode;
    var className = onerdata.className;
    var getReqAcctCode = onerdata.getReqAcctCode;
    var datachneng = onerdata.datachneng;
    var tgAccountdata = onerdata.tgAccountdata;
    window._close = function (action, data) {
        if (window.closeOwner) {
            var data = {
                action: action,
            };
            window.closeOwner(data);
        }
    }
    //获取公式编辑器返回来的值并set到页面相应的位置
    window.setData = function (data) {
        page.setFormulaEditorData(data);
    };
    
    var page = function () {
        return {
            //渲染辅助核算
            tgAccountgrid: function (tgAccountdata) {
                ufma.get("/lp/eleAccItem/" + danwei, "", function (res) {
                    console.log(res)
                    if (tgAccountdata == 0) {
                        tgAccountdata = [{
                            "eleName": "",
                            "eleCode": "",
                            "accItemCode": "",
                            "gsName": ""
                        }]
                    } else {
                        for (var i = 0; i < tgAccountdata.length; i++) {
                            for (var j = 0; j < res.data.length; j++) {
                                //修改自定义辅助核算elecode与accItemCode不一致无法给accItemName赋值，导致界面不显示辅助核算名问题--zsj
                                if (tgAccountdata[i].accItemCode == res.data[j].accItemCode) {
                                    tgAccountdata[i].accItemName = res.data[j].accItemName
                                    tgAccountdata[i].eleCode = res.data[j].eleCode
                                    tgAccountdata[i].accitemCode = res.data[j].accItemCode
                                }
                            }

                        }
                    }
                    tgAccountdatahq = tgAccountdata;
                    $('#tgAccounttable').ufDatagrid({
                        data: tgAccountdata,
                        idField: 'chrCode', // 用于金额汇总
                        pId: 'pcode', // 用于金额汇总
                        disabled: false, // 可选择
                        columns: [
                            [ // 支持多表头
                                {
                                    type: 'treecombox',
                                    field: 'accItemCode',
                                    name: '辅助核算',
                                    width: 270,
                                    headalign: 'center',
                                    align: 'left',
                                    idField: 'accItemCode',
                                    textField: 'accItemName',
                                    pIdField: '',
                                    data: res.data,
                                    render: function (rowid, rowdata, data) {
                                        if (!data) {
                                            return '';
                                        }
                                        return rowdata.accItemName;
                                    },
                                    onChange: function (e) {
                                        var indexs = $("#" + e.rowId).index() - 1
                                        tgAccountdatahq[indexs].eleCode = e.itemData.eleCode
                                        tgAccountdatahq[indexs].eleName = e.itemData.accItemName
                                        tgAccountdatahq[indexs].accItemCode = e.itemData.accItemCode;
                                    }
                                },
                                {
                                    type: 'buttonedit',
                                    field: 'gsName',
                                    width: 500,
                                    name: '值公式',
                                    headalign: 'center',
                                    align: 'left',
                                    onBtnClick: function (e) {
                                        var rid = e.rowId;
                                        var indexs = $("#" + e.rowId).index() - 1;
                                        if (!getReqAcctCode) {
                                            return false;
                                        }
                                        var datas = {
                                            billTypeGuid: onerdata.addTemplate.data.schemeGuid,
                                            agencyCode: danwei,
                                            targetBill: $('#tgTarget').val() ? $('#tgTarget').val() : 'LP_VOU_TEMPLATE',
                                            eleCode: tgAccountdatahq[indexs].eleCode,
                                            allid: "gsName",
                                            rid: rid,
                                            thisId: "templateGeneration",
                                            UPagencyCode: onerdata.addTemplate.data.UPagencyCode,
                                            FormulaEditorVal: $("#tgAccounttablebuttoneditgsName").find("input[name=gsName]").val(),
                                            reqAcctCode: getReqAcctCode,
                                            pagePosition: "accountGsName"
                                        };
                                        ufma.setObjectCache("openFormulaEditor", datas);
                                        $(".u-msg-dialog-top", parent.document).prevAll("#billDefinition").find("#open-formula-editor").click();
                                    }
                                },
                                {
                                    type: "toolbar",
                                    field: 'remark',
                                    width: 140,
                                    name: '操作',
                                    align: 'center',
                                    headalign: 'center',
                                    render: function (rowid, rowdata, data) {
                                        return '<a class="insertthis btn btn-icon-only btn-sm btn-insert-row btn-permission" data-toggle="tooltip" action= "" title="插入">' +
                                            '<span class="glyphicon icon-insert"></span></a>' + '<a class="delthis btn btn-icon-only btn-sm btn-delete-row btn-permission" data-toggle="tooltip" action= "" title="删除">' +
                                            '<span class="glyphicon icon-trash"></span></a>' + '<a class="tuodongtop btn btn-icon-only btn-sm btn-move-up btn-permission" data-toggle="tooltip" action= "" title="向上移动">' +
                                            '<span class="glyphicon icon-arrow-top"></span></a>' + '<a class="tuodongbottom btn btn-icon-only btn-sm btn-move-down btn-permission" data-toggle="tooltip" action= "" title="向下移动">' +
                                            '<span class="glyphicon icon-arrow-bottom"></span></a>';
                                    }
                                }
                            ]
                        ],
                        initComplete: function (options, data) {
                            //单据方案（单位级）单据方案为系统级下的模版不能更改
                            if (className) {//单据方案（单位级）
                                if (onerdata.addTemplate.data.agencyCode == "*") {//模版是系统级的
                                    $(".uf-datagrid").getObj().setEnabled(false);
                                    $("#tgAccountbutton").attr("disabled", true);
                                }
                            }
                            $("#tgAccounttableBody").css("height", "auto");

                            ufma.isShow(page.reslist);
                        },
                    });

                })
            },
            //把公式编辑器里的值set到相应的位置上
            setFormulaEditorData: function (data) {
                if (data.action) {
                   if (data.action.pagePosition == "accountGsName") {
                        //辅助核算-值公式
                        $(document).find("#tgAccounttableBody").find(".uf-grid-body-view .uf-grid-table tbody").find("#" + data.action.alldata.rid).find("td[name=gsName]").text(data.action.val);
                        $(document).find("#tgAccounttablebuttoneditgsName").find("input[name=gsName]").val(data.action.val);
                    } else {
                        var id2 = $("#" + data.action.alldata.allid);
                        $(id2).find("input").val(data.action.val);
                        $(id2).find("input").attr("data-formula", data.action.formula);
                    }
                }
            },
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
            
            //此方法必须保留
            init: function () {
                page.reslist = ufma.getPermission();
                ufma.isShow(page.reslist);
                page.tgAccountgrid(tgAccountdata);
            }
        }
    }();
    setTimeout(function () {
        page.init();
    }, 200)
    // 添加行
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
    //核算项行插入
    $(document).on("mousedown", "#tgAccounttable .insertthis span", function () {
        var rowid = $(this).parents("tr").attr("id");
        var rowindex = $(this).parents("tr").index();
        var rowdata = {
            "eleName": "",
            "eleCode": "",
            "accItemCode": "",
            "gsName": ""
        }
        var insertdata = {
            "eleName": "",
            "eleCode": "",
            "accItemCode": "",
            "gsName": ""
        }
        tgAccountdatahq.splice(rowindex, '0', rowdata)
        var obj = $('#tgAccounttable').getObj();
        obj.insert(rowid, rowdata)
        ufma.isShow(page.reslist);
    });
    //辅助核算表格行删除
    $(document).on("mousedown", "#tgAccounttable .delthis span", function () {
        var rowid = $(this).parents("tr").attr("id");
        var rowindex = $(this).parents("tr").index();
        tgAccountdatahq.splice(rowindex, 1)
        var obj = $('#tgAccounttable').getObj();
        obj.del(rowid)
    });
    //核算项行向上
    $(document).on("mousedown", "#tgAccounttable .tuodongtop span", function () {
        $(this).parents(".panel").click();
        var rowindex = $(this).parents("tr").index() - 1;
        var key = tgAccountdatahq[rowindex];
        if (rowindex > 0) {
            tgAccountdatahq[rowindex] = tgAccountdatahq[rowindex - 1]
            tgAccountdatahq[rowindex - 1] = key
            var thistr = $(this).parents("tr");
            var thistrnext = $(this).parents("tr").prev("tr");
            thistr.insertBefore(thistrnext);
        }
    })
    //核算项行向下
    $(document).on("mousedown", "#tgAccounttable .tuodongbottom span", function () {
        $(this).parents(".panel").click();
        var rowindex = $(this).parents("tr").index() - 1;
        var key = tgAccountdatahq[rowindex];
        if (rowindex < tgAccountdatahq.length - 1) {
            tgAccountdatahq[rowindex] = tgAccountdatahq[rowindex + 1]
            tgAccountdatahq[rowindex + 1] = key
            var thistr = $(this).parents("tr");
            var thistrnext = $(this).parents("tr").next("tr");
            thistr.insertAfter(thistrnext);
        }
    })
    //点击确定
    $("#btn-FormulaEditorsave").click(function () {
        //辅项表格行内容都是必填项
        var lpVouAccitemTemplates = [];
        var accountTableDatas = $("#tgAccounttable").getObj().getData();
        var accountResult = false;
        for (var i = 0; i < accountTableDatas.length; i++) {
            var dataone = new Object();
            dataone.ordSeq = i + 1;
            dataone.accItemCode = accountTableDatas[i].accItemCode;
            if (dataone.accItemCode == "" || dataone.accItemCode == undefined) {
                accountResult = true;
                ufma.showTip("辅助核算表第" + dataone.ordSeq + "行辅助核算未填写", function () {

                }, "warning");
                break;
            }
            dataone.value = page.CorE(accountTableDatas[i].gsName);
            if (dataone.value == "" || dataone.value == undefined) {
                accountResult = true;
                ufma.showTip("辅助核算表第" + dataone.ordSeq + "行值公式未填写", function () {

                }, "warning");
                break;
            }
            dataone.accItemName = accountTableDatas[i].accItemName;
            dataone.gsName = accountTableDatas[i].gsName;
            lpVouAccitemTemplates.push(dataone);
        }
        if (accountResult) {
            return false;
        }
        var datas = {
            action: 'save',
            pagePosition: 'accItemType',
            data: lpVouAccitemTemplates,
            rid: onerdata.rid,
            tgAccountdata: lpVouAccitemTemplates,
        };
        _close(datas);
    });
    
})