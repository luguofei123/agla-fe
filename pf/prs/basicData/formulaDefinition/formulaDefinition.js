$(function () {
    //open弹窗的关闭方法
    window._close = function (action) {
        if (window.closeOwner) {
            var data = {action: action};
            window.closeOwner(data);
        }
    };
    var svData = ufma.getCommonData();
    var moveNote = [];
    var prsTypeData = [];
    //接口URL集合
    var interfaceURL = {
        findBasePrsTypeItem: "/prs/PrsTypeItem/findBasePrsTypeItem",//查询系统级工资类别参数及基础数据
        findPrsTypeItem: "/prs/PrsTypeItem/findPrsTypeItem",//传入类别查询系统公式
        updatePrsTypeItem: "/prs/PrsTypeItem/updatePrsTypeItem",//保存
        downPrsTypeItem: "/prs/PrsTypeItem/downPrsTypeItem",//下发
        getAgencyTree: '/prs/prsAgency/getAgencyTree',//下发树
        findPrsTypeCo: "/prs/PrsTypeItemCo/findPrsTypeCo",//查询单位级工资类别
        delPrsTypeItem: "/prs/PrsTypeItem/delPrsTypeItem",//删除
    };
    if ($("body").attr("data-code")) {
        interfaceURL.findPrsTypeItem = "/prs/PrsTypeItemCo/findPrsTypeItemCo";
        interfaceURL.updatePrsTypeItem = "/prs/PrsTypeItemCo/savePrsTypeItemCo";
        interfaceURL.delPrsTypeItem = "/prs/PrsTypeItemCo/delPrsTypeItemCo"
    }
    var col = {priority:"优先级",pritemCode:"工资项目名称",isEditable:"数据来源",formulaName:"公式定义",isUsed:"是否启用",
                paycloseClear:"下月清零",ordIndex:"顺序号",isTaxItem:"个人所得税项目",
                isYearAwardTaxItem:"年终奖个人所得税项目",isDifferentColor:"是否差异标红",isHighLight:"是否着重显示",
        // isShowNotedit: "是否展示非手动录入项"
    }
    var pageLength = 25;
    var sysdatas = [
        {code: "length", name: "优先级"},
        {code: "wageCode", name: "工资项目名称"},
        {code: "dataSourceCode", name: "数据来源"},
        {code: "formula", name: "公式定义"},
        {code: "enableCode", name: "是否启用"},
        {code: "clearCode", name: "下月清零"},
        {code: "shunxuhao", name: "顺序号"},
        {code: "ljjsxm", name: "累计基数项目"},
        {code: "personTaxCode", name: "个人所得税项目"},
        {code: "personTaxBasicCode", name: "个人所得税计算基数项目"},
        {code: "personAnnualBonusCode", name: "年终奖个人所得税项目"}
    ];
    var agencydatas = [
        {code: "length", name: "优先级"},
        {code: "wageCode", name: "工资项目名称"},
        {code: "dataSourceCode", name: "数据来源"},
        {code: "formula", name: "公式定义"},
        {code: "enableCode", name: "是否启用"},
        {code: "clearCode", name: "下月清零"},
        {code: "shunxuhao", name: "顺序号"},
        {code: "ljjsxm", name: "累计基数项目"},
        {code: "personTaxCode", name: "个人所得税项目"},
        {code: "personTaxBasicCode", name: "个人所得税计算基数项目"},
        {code: "personAnnualBonusCode", name: "年终奖个人所得税项目"},
        // {code: "bufaCode", name: "补发项目"},
        {code: "redCode", name: "是否差异标红"},
        {code: "isHighLight", name: "是否着重显示"},
        // {code: "shoudongCode", name: "是否展示非手动录入项"}
        {code: "extSysGetVals", name: "外部系统取数"}
    ];

    var page = function () {
        return {
            //系统级表格列
            recombineColumns: function () {
                var checks = $("#colList input:checked");
                var checksArr = [];
                for (var i = 0; i < checks.length; i++) {
                    var code = $(checks[i]).attr("data-code");
                    checksArr.push(code);
                }
                var columns = {
                    length: {
                        type: 'input',
                        field: 'priority',
                        width: 60,
                        name: '优先级',
                        headalign: 'center',
                        align: 'left',
                        onKeyup: function (e) {
                            if (e.data !== "") {
                                var newData = e.data.replace(/[^\d+-]/g, '');
                                $("#nameTable2inputseqColumn").val(newData);
                            }

                        }
                    },
                    wageCode: {
                        type: 'treecombox',
                        field: 'pritemCode',
                        name: '工资项目名称',
                        width: 100,
                        headalign: 'center',
                        align: 'left',
                        idField: 'pritemCode',
                        textField: 'pritemCodeName',
                        pIdField: '',
                        data: page.prsItemsData,
                        render: function (rowid, rowdata, data) {
                            if (!data) {
                                return "";
                            }
                            return '<span title="'+rowdata.pritemCodeName+'">' + rowdata.pritemCodeName +'</span>';
                        },
                        onChange: function (e, data) {
                            var rowid = e.rowId;
                            var rowNoarr = rowid.split("_");
                            var rowNo = parseInt(rowNoarr[rowNoarr.length - 1]);
                            if (!page.tempItem[rowNo]) {
                                if (page.tempItemArr.indexOf(e.itemData.pritemCode) < 0) {
                                    page.tempItem[rowNo] = e.itemData.pritemCode;
                                    page.tempItemArr.push(e.itemData.pritemCode);
                                } else {
                                    ufma.showTip("存在重复数据，请检查", function () {
                                        $("#nameTablecomboxpritemCode").getObj().clear();
                                    }, "warning")
                                }
                            } else {
                                if (page.tempItemArr.indexOf(e.itemData.pritemCode) < 0) {
                                    page.tempItem[rowNo] = e.itemData.pritemCode;
                                    page.tempItemArr.splice(rowNo - 1, 1, e.itemData.pritemCode);
                                } else if (page.tempItem[rowNo] != e.itemData.pritemCode) {
                                    ufma.showTip("存在重复数据，请检查", function () {
                                        $("#nameTablecomboxpritemCode").getObj().clear();
                                    }, "warning")
                                }

                            }
                        },
                        beforeExpand: function (e) { //下拉框初始化
                            // $(e.sender).getObj().load(src.itemTypeData);
                        }
                    },
                    dataSourceCode: {
                        type: 'combox',
                        field: 'isEditable',
                        name: '数据来源',
                        width: 100,
                        headalign: 'center',
                        align: 'left',
                        idField: 'isEditable',
                        textField: 'isEditableName',
                        pIdField: '',
                        data: page.prsValItemsData,
                        render: function (rowid, rowdata, data) {
                            if (!data) {
                                return "";
                            }
                            return rowdata.isEditableName;
                        },
                        onChange: function (e) {
                            if (e.itemData.pritemCode != "2") {
                                $("#nameTablebuttoneditformulaName").find("input[name=formulaName]").val("");
                            }
                        },
                        beforeExpand: function (e) { //下拉框初始化
                            // $(e.sender).getObj().load(src.itemTypeData);
                        }
                    },
                    formula: {
                        type: 'buttonedit',
                        field: 'formulaName',
                        name: '公式定义',
                        width: 200,
                        headalign: 'center',
                        align: 'left',
                        onBtnClick: function (e) {
                            var rid = e.rowId;
                            var rowData = e.rowData;
                            if (rowData.isEditable == "2") {
                                var datas = {
                                    employeeDatas: page.prsValEmpsData,
                                    wageItems: page.prsItemsDataFor,
                                    rid: rid,
                                    thisId: "formulaDefinition",
                                    FormulaEditorVal: $("#nameTablebuttoneditformulaName").find("input[name=formulaName]").val(),
                                    rowData: rowData,
                                    prtypeCode: $("#itemTab .active").find("a").attr("data-id")
                                };
                                ufma.open({
                                    url: '../formulaeditor/formulaEditor.html',
                                    title: '公式编辑器',
                                    width: 1090,
                                    height: 500,
                                    data: datas,
                                    ondestory: function (data) {
                                        //窗口关闭时回传的值
                                        if (data.action) {
                                            $("#nameTableBody").find(".uf-grid-body-view .uf-grid-table tbody").find("#" + data.action.rid).find("td[name=formulaName]").text(data.action.val);
                                            $("#nameTablebuttoneditformulaName").find("input[name=formulaName]").val(data.action.val);
                                        }
                                    }
                                });
                            }


                        }
                    },
                    enableCode: {
                        type: 'combox',
                        field: 'isUsed',
                        name: '是否启用',
                        width: 80,
                        headalign: 'center',
                        align: 'left',
                        idField: 'isUsed',
                        textField: 'isUsedName',
                        pIdField: '',
                        data: [
                            {isUsed: "Y", isUsedName: "是"},
                            {isUsed: "N", isUsedName: "否"}
                        ],
                        render: function (rowid, rowdata, data) {
                            if (data == "Y") {
                                return "是";
                            } else if (data == "N") {
                                return "否";
                            }
                            return data;
                        },
                        onChange: function (e, data) {
                        },
                        beforeExpand: function (e) { //下拉框初始化
                            // $(e.sender).getObj().load(src.itemTypeData);
                        }
                    },
                    clearCode: {
                        type: 'combox',
                        field: 'paycloseClear',
                        name: '下月清零',
                        width: 80,
                        headalign: 'center',
                        align: 'left',
                        idField: 'paycloseClear',
                        textField: 'paycloseClearName',
                        pIdField: '',
                        data: [
                            {paycloseClear: "Y", paycloseClearName: "是"},
                            {paycloseClear: "N", paycloseClearName: "否"}
                        ],
                        render: function (rowid, rowdata, data) {
                            if (data == "Y") {
                                return "是";
                            } else if (data == "N") {
                                return "否";
                            }
                            return data;
                        },
                        onChange: function (e, data) {
                        },
                        beforeExpand: function (e) { //下拉框初始化
                            // $(e.sender).getObj().load(src.itemTypeData);
                        }
                    },
                    shunxuhao: {
                        type: 'input',
                        field: 'ordIndex',
                        width: 60,
                        name: '顺序号',
                        headalign: 'center',
                        align: 'left',
                        render: function (rowid, rowdata, data) {
                            return data;
                        }
                    },
                    ljjsxm: {
                    	type: 'combox',
                        field: 'ljjsxm',
                        name: '累计基数项目',
                        width: 80,
                        headalign: 'center',
                        align: 'left',
                        idField: 'ljjsxmCode',
                        textField: 'ljjsxmName',
                        pIdField: '',
                        data: page.ljjsxm,
                        render: function (rowid, rowdata, data) {
                            if (!data) {
                                return "";
                            }
                            return rowdata.ljjsxmName;
                        },
                        onChange: function (e, data) {
                        },
                        beforeExpand: function (e) { //下拉框初始化
                            // $(e.sender).getObj().load(src.itemTypeData);
                        }
                    },
                    personTaxCode: {
                        type: 'combox',
                        field: 'isTaxItem',
                        name: '个人所得税项目',
                        width: 80,
                        headalign: 'center',
                        align: 'left',
                        idField: 'isTaxItem',
                        textField: 'pritemCodeTaxName',
                        pIdField: '',
                        data: [
                            {isTaxItem: "Y", pritemCodeTaxName: "是"},
                            {isTaxItem: "N", pritemCodeTaxName: "否"}
                        ],
                        render: function (rowid, rowdata, data) {
                            if (data == "Y") {
                                return "是";
                            } else if (data == "N") {
                                return "否";
                            }
                            return data;
                        },
                        onChange: function (e, data) {
                        },
                        beforeExpand: function (e) { //下拉框初始化
                            // $(e.sender).getObj().load(src.itemTypeData);
                        }
                    },
                    personTaxBasicCode: {
                        type: 'combox',
                        field: 'pritemCodeTax',
                        name: '个人所得税计算基数项目',
                        width: 80,
                        headalign: 'center',
                        align: 'left',
                        idField: 'pritemCodeTax',
                        textField: 'pritemCodeTaxName',
                        pIdField: '',
                        data: page.prsItemsData2,
                        render: function (rowid, rowdata, data) {
                            if (!data) {
                                return "";
                            }
                            return rowdata.pritemCodeTaxName;
                        },
                        onChange: function (e, data) {
                        },
                        beforeExpand: function (e) { //下拉框初始化
                            // $(e.sender).getObj().load(src.itemTypeData);
                        }
                    },
                    personAnnualBonusCode: {
                        type: 'combox',
                        field: 'isYearAwardTaxItem',
                        name: '年终奖个人所得税项目',
                        width: 80,
                        headalign: 'center',
                        align: 'left',
                        idField: 'isYearAwardTaxItem',
                        textField: 'isYearAwardTaxItemName',
                        pIdField: '',
                        data: [
                            {isYearAwardTaxItem: "Y", isYearAwardTaxItemName: "是"},
                            {isYearAwardTaxItem: "N", isYearAwardTaxItemName: "否"}
                        ],
                        render: function (rowid, rowdata, data) {
                            if (data == "Y") {
                                return "是";
                            } else if (data == "N") {
                                return "否";
                            }
                            return data;
                        },
                        onChange: function (e, data) {
                        },
                        beforeExpand: function (e) { //下拉框初始化
                            // $(e.sender).getObj().load(src.itemTypeData);
                        }
                    }
                };
                var newColumns = [
                    [
                        {
                            type: 'checkbox',
                            field: '',
                            name: '',
                            width: 50,
                            headalign: 'center',
                            className: 'no-print',
                            align: 'center',
                            render: function (rowid, rowdata, data) {
                                return '<label class="mt-checkbox mt-checkbox-outline"><input data-id="' + rowdata.pritemCode + '" rowid="'+rowid+'" pid="'+rowid+'" class="check-item" index="0" type="checkbox" value="1"><span></span></label>'
                            },
                        }
                    ]
                ];
                for (var i = 0; i < checksArr.length; i++) {
                    newColumns[0].push(columns[checksArr[i]]);
                }
                return newColumns;
            },
            //单位级表格列
            recombineColumnsAgy: function () {
                var checks = $("#colList input:checked");
                var checksArr = [];
                for (var i = 0; i < checks.length; i++) {
                    var code = $(checks[i]).attr("data-code");
                    checksArr.push(code);
                }
                var columns = {
                    length: {
                        type: 'input',
                        field: 'priority',
                        width: 60,
                        name: '优先级',
                        headalign: 'center',
                        align: 'left',
                        onKeyup: function (e) {
                            if (e.data !== "") {
                                var newData = e.data.replace(/[^\d+-]/g, '');
                                $("#nameTable2inputseqColumn").val(newData);
                            }

                        }
                    },
                    wageCode: {
                        type: 'treecombox',
                        field: 'pritemCode',
                        name: '工资项目名称',
                        width: 100,
                        headalign: 'center',
                        align: 'left',
                        idField: 'pritemCode',
                        textField: 'pritemCodeName',
                        pIdField: '',
                        data: page.prsItemsData,
                        render: function (rowid, rowdata, data) {
                            if (!data) {
                                return "";
                            }
                            return '<span title="'+rowdata.pritemCodeName+'">' + rowdata.pritemCodeName +'</span>';
                        },
                        onChange: function (e, data) {
                            var rowid = e.rowId;
                            var rowNoarr = rowid.split("_");
                            var rowNo = parseInt(rowNoarr[rowNoarr.length - 1]);
                            if (!page.tempItem[rowNo]) {
                                if (page.tempItemArr.indexOf(e.itemData.pritemCode) < 0) {
                                    page.tempItem[rowNo] = e.itemData.pritemCode;
                                    page.tempItemArr.push(e.itemData.pritemCode);
                                } else {
                                    ufma.showTip("存在重复数据，请检查", function () {
                                        $("#nameTablecomboxpritemCode").getObj().clear();
                                    }, "warning")
                                }
                            } else {
                                if (page.tempItemArr.indexOf(e.itemData.pritemCode) < 0) {
                                    page.tempItem[rowNo] = e.itemData.pritemCode;
                                    page.tempItemArr.splice(rowNo - 1, 1, e.itemData.pritemCode);
                                } else if (page.tempItem[rowNo] != e.itemData.pritemCode) {
                                    ufma.showTip("存在重复数据，请检查", function () {
                                        $("#nameTablecomboxpritemCode").getObj().clear();
                                    }, "warning")
                                }

                            }

                        },
                        beforeExpand: function (e) { //下拉框初始化
                            // $(e.sender).getObj().load(src.itemTypeData);
                        }
                    },
                    dataSourceCode: {
                        type: 'combox',
                        field: 'isEditable',
                        name: '数据来源',
                        width: 80,
                        headalign: 'center',
                        align: 'left',
                        idField: 'isEditable',
                        textField: 'isEditableName',
                        pIdField: '',
                        data: page.prsValItemsData,
                        render: function (rowid, rowdata, data) {
                            if (!data) {
                                return "";
                            }
                            return rowdata.isEditableName;
                        },
                        onChange: function (e) {
                            if (e.itemData.pritemCode != "2") {
                                $("#nameTablebuttoneditformulaName").find("input[name=formulaName]").val("");
                            }
                            if(e.itemData.isEditable!='W'){
                                $(e.sender[0]).parent().find('#nameTablecomboxisExtSys').addClass('hidden');
                            }else{
                                $(e.sender[0]).parent().find('#nameTablecomboxisExtSys').removeClass('hidden');
                            }
                        },
                        beforeExpand: function (e) { //下拉框初始化
                            // $(e.sender).getObj().load(src.itemTypeData);
                        }
                    },
                    formula: {
                        type: 'buttonedit',
                        field: 'formulaName',
                        name: '公式定义',
                        width: 200,
                        headalign: 'center',
                        align: 'left',
                        onBtnClick: function (e) {
                            var rid = e.rowId;
                            var rowData = e.rowData;
                            if (rowData.isEditable == "2") {
                                var datas = {
                                    employeeDatas: page.prsValEmpsData,
                                    wageItems: page.prsItemsDataFor,
                                    rid: rid,
                                    thisId: "formulaDefinition",
                                    FormulaEditorVal: $("#nameTablebuttoneditformulaName").find("input[name=formulaName]").val(),
                                    rowData: rowData,
                                    prtypeCode: $("#itemTab .active").find("a").attr("data-id"),
                                    isAgency:true
                                };
                                ufma.open({
                                    url: '../formulaeditor/formulaEditor.html',
                                    title: '公式编辑器',
                                    width: 1090,
                                    height: 500,
                                    data: datas,
                                    ondestory: function (data) {
                                        //窗口关闭时回传的值
                                        if (data.action) {
                                            $("#nameTableBody").find(".uf-grid-body-view .uf-grid-table tbody").find("#" + data.action.rid).find("td[name=formulaName]").text(data.action.val);
                                            $("#nameTablebuttoneditformulaName").find("input[name=formulaName]").val(data.action.val);
                                        }
                                    }
                                });
                            }


                        }
                    },
                    enableCode: {
                        type: 'combox',
                        field: 'isUsed',
                        name: '是否启用',
                        width: 60,
                        headalign: 'center',
                        align: 'left',
                        idField: 'isUsed',
                        textField: 'isUsedName',
                        pIdField: '',
                        data: [
                            {isUsed: "Y", isUsedName: "是"},
                            {isUsed: "N", isUsedName: "否"}
                        ],
                        render: function (rowid, rowdata, data) {
                            if (data == "Y") {
                                return "是";
                            } else if (data == "N") {
                                return "否";
                            }
                            return data;
                        },
                        onChange: function (e) {
                            console.log(e)
                            //如果是新增的条目 则不提示
                            if(!!!e.rowData.isAdd){
                                //如果查询回得数据为启用状态
                                var flag = true
                                var arr = page.searchData.filter(function(item){
                                    return item.pritemCode === e.rowData.pritemCode
                                }).map(function(item){
                                    return item.isUsed === 'Y'
                                })
                                if(arr.length > 0){
                                    flag = arr[0]
                                }
                                if(e.itemData.isUsed == 'N' && flag){
                                    //如果不启用某一项 需要给个弹窗的提示
                                    ufma.confirm('工资项目停用后，将会清除掉当前工资编制批次中的该工资项的数据，是否继续停用？', function (action) {
                                        if (action) {
                                            //点击确定的回调函数
                                        } else {
                                            //点击取消的回调函数
                                            //如果选择了否，将启用的值还原为“是”
                                            $(e.sender).getObj().val('Y')
                                            $('#'+e.rowId + ' [name=isUsed]').html('是')
                                        }
                                    }, {type: 'warning'});
                                }
                            }
                        },
                        beforeExpand: function (e) { //下拉框初始化
                            // $(e.sender).getObj().load(src.itemTypeData);
                        }
                    },
                    clearCode: {
                        type: 'combox',
                        field: 'paycloseClear',
                        name: '下月清零',
                        width: 60,
                        headalign: 'center',
                        align: 'left',
                        idField: 'paycloseClear',
                        textField: 'paycloseClearName',
                        pIdField: '',
                        data: [
                            {paycloseClear: "Y", paycloseClearName: "是"},
                            {paycloseClear: "N", paycloseClearName: "否"}
                        ],
                        render: function (rowid, rowdata, data) {
                            if (data == "Y") {
                                return "是";
                            } else if (data == "N") {
                                return "否";
                            }
                            return data;
                        },
                        onChange: function (e, data) {
                        },
                        beforeExpand: function (e) { //下拉框初始化
                            // $(e.sender).getObj().load(src.itemTypeData);
                        }
                    },
                    shunxuhao: {
                        type: 'input',
                        field: 'ordIndex',
                        width: 60,
                        name: '顺序号',
                        headalign: 'center',
                        align: 'left',
                        render: function (rowid, rowdata, data) {
                            return data;
                        }
                    },
                    ljjsxm: {
                    	type: 'combox',
                        field: 'ljjsxm',
                        name: '累计基数项目',
                        width: 80,
                        headalign: 'center',
                        align: 'left',
                        idField: 'ljjsxmCode',
                        textField: 'ljjsxmName',
                        pIdField: '',
                        data: page.ljjsxm,
                        render: function (rowid, rowdata, data) {
                            if (!data) {
                                return "";
                            }
                            return rowdata.ljjsxmName;
                        },
                        onChange: function (e, data) {
                        },
                        beforeExpand: function (e) { //下拉框初始化
                            // $(e.sender).getObj().load(src.itemTypeData);
                        }
                    },
                    personTaxCode: {
                        type: 'combox',
                        field: 'isTaxItem',
                        name: '个人所得税项目',
                        width: 60,
                        headalign: 'center',
                        align: 'left',
                        idField: 'isTaxItem',
                        textField: 'pritemCodeTaxName',
                        pIdField: '',
                        data: [
                            {isTaxItem: "Y", pritemCodeTaxName: "是"},
                            {isTaxItem: "N", pritemCodeTaxName: "否"}
                        ],
                        render: function (rowid, rowdata, data) {
                            if (data == "Y") {
                                return "是";
                            } else if (data == "N") {
                                return "否";
                            }
                            return data;
                        },
                        onChange: function (e, data) {
                        },
                        beforeExpand: function (e) { //下拉框初始化
                            // $(e.sender).getObj().load(src.itemTypeData);
                        }
                    },
                    personTaxBasicCode: {
                        type: 'combox',
                        field: 'pritemCodeTax',
                        name: '个人所得税计算基数项目',
                        width: 80,
                        headalign: 'center',
                        align: 'left',
                        idField: 'pritemCodeTax',
                        textField: 'pritemCodeTaxName',
                        pIdField: '',
                        data: page.prsItemsData2,
                        render: function (rowid, rowdata, data) {
                            if (!data) {
                                return "";
                            }
                            return rowdata.pritemCodeTaxName;
                        },
                        onChange: function (e, data) {
                        },
                        beforeExpand: function (e) { //下拉框初始化
                            // $(e.sender).getObj().load(src.itemTypeData);
                        }
                    },
                    personAnnualBonusCode: {
                        type: 'combox',
                        field: 'isYearAwardTaxItem',
                        name: '年终奖个人所得税项目',
                        width: 80,
                        headalign: 'center',
                        align: 'left',
                        idField: 'isYearAwardTaxItem',
                        textField: 'isYearAwardTaxItemName',
                        pIdField: '',
                        data: [
                            {isYearAwardTaxItem: "Y", isYearAwardTaxItemName: "是"},
                            {isYearAwardTaxItem: "N", isYearAwardTaxItemName: "否"}
                        ],
                        render: function (rowid, rowdata, data) {
                            if (data == "Y") {
                                return "是";
                            } else if (data == "N") {
                                return "否";
                            }
                            return data;
                        },
                        onChange: function (e, data) {
                        },
                        beforeExpand: function (e) { //下拉框初始化
                            // $(e.sender).getObj().load(src.itemTypeData);
                        }
                    },
                    // bufaCode: {
                    //     type: 'combox',
                    //     field: 'supplyItem',
                    //     name: '补发项目',
                    //     width: 200,
                    //     headalign: 'center',
                    //     align: 'left',
                    //     idField: 'supplyItem',
                    //     textField: 'supplyItemName',
                    //     pIdField: '',
                    //     data: page.prsItemsData3,
                    //     render: function (rowid, rowdata, data) {
                    //         if (!data) {
                    //             return "";
                    //         }
                    //         return rowdata.supplyItemName;
                    //     },
                    //     onChange: function (e, data) {
                    //     },
                    //     beforeExpand: function (e) { //下拉框初始化
                    //         // $(e.sender).getObj().load(src.itemTypeData);
                    //     }
                    // },
                    redCode: {
                        type: 'combox',
                        field: 'isDifferentColor',
                        name: '是否差异标红',
                        width: 60,
                        headalign: 'center',
                        align: 'left',
                        idField: 'isDifferentColor',
                        textField: 'isDifferentColorName',
                        pIdField: '',
                        data: [
                            {isDifferentColor: "Y", isDifferentColorName: "是"},
                            {isDifferentColor: "N", isDifferentColorName: "否"}
                        ],
                        render: function (rowid, rowdata, data) {
                            if (data == "Y") {
                                return "是";
                            } else if (data == "N") {
                                return "否";
                            }
                            return rowdata.isDifferentColorName;
                        },
                        onChange: function (e, data) {
                        },
                        beforeExpand: function (e) { //下拉框初始化
                            // $(e.sender).getObj().load(src.itemTypeData);
                        }
                    },
                    isHighLight: {
                        type: 'combox',
                        field: 'isHighLight',
                        name: '是否着重显示',
                        width: 60,
                        headalign: 'center',
                        align: 'left',
                        idField: 'isHighLight',
                        textField: 'isHighLightName',
                        pIdField: '',
                        data: [
                            {isHighLight: "Y", isHighLightName: "是"},
                            {isHighLight: "N", isHighLightName: "否"}
                        ],
                        render: function (rowid, rowdata, data) {
                            if (data == "Y") {
                                return "是";
                            } else if (data == "N") {
                                return "否";
                            }
                            return rowdata.isHighLightName;
                        },
                        onChange: function (e, data) {
                        },
                        beforeExpand: function (e) { //下拉框初始化
                            // $(e.sender).getObj().load(src.itemTypeData);
                        }
                    },
                    // shoudongCode: {
                    //     type: 'combox',
                    //     field: 'isShowNotedit',
                    //     name: '是否展示非手动录入项',
                    //     width: 200,
                    //     headalign: 'center',
                    //     align: 'left',
                    //     idField: 'isShowNotedit',
                    //     textField: 'isShowNoteditName',
                    //     pIdField: '',
                    //     data: [
                    //         {isShowNotedit: "Y", isShowNoteditName: "是"},
                    //         {isShowNotedit: "N", isShowNoteditName: "否"}
                    //     ],
                    //     render: function (rowid, rowdata, data) {
                    //         if (data == "Y") {
                    //             return "是";
                    //         } else if (data == "N") {
                    //             return "否";
                    //         }
                    //         return rowdata.isShowNoteditName;
                    //     },
                    //     onChange: function (e, data) {
                    //     },
                    //     beforeExpand: function (e) { //下拉框初始化
                    //         // $(e.sender).getObj().load(src.itemTypeData);
                    //     }
                    // },
                    extSysGetVals: {
                        type: 'combox',
                        field: 'isExtSys',
                        name: '外部系统取数',
                        width: 80,
                        headalign: 'center',
                        align: 'left',
                        idField: 'isExtSys',
                        textField: 'isExtSysVal',
                        pIdField: '',
                        data: page.extSysGetValsData,
                        render: function (rowid, rowdata, data) {
                            if (!data) {
                                return "";
                            }
                            if(rowdata.isEditable=='W'){
                                return rowdata.isExtSysName;
                            }else{
                                $(this).addClass('hidden');
                                return " ";
                            }
                        },
                        onChange: function (e) {
                            console.log(e);
                        },
                        beforeExpand: function (e) {
                        }
                    }
                };
                var newColumns = [
                    [
                        {
                            type: 'checkbox',
                            field: '',
                            name: '',
                            width: 50,
                            headalign: 'center',
                            className: 'no-print',
                            align: 'center',
                            render: function (rowid, rowdata, data) {
                                return '<label class="mt-checkbox mt-checkbox-outline"><input data-id="' + rowdata.pritemCode + '" rowid="'+rowid+'" pid="'+rowid+'" class="check-item" index="0" type="checkbox" value="1"><span></span></label>'
                            },
                        }
                    ]
                ];
                for (var i = 0; i < checksArr.length; i++) {
                    newColumns[0].push(columns[checksArr[i]]);
                }
                return newColumns;
            },
            //临时存储已选择的工资项目
            tempItemArrfun: function (tableData) {
                page.tempItem = {};
                page.tempItemArr = [];
                for (var i = 0; i < tableData.length; i++) {
                    var rowIndex = i + 1;
                    var obj = {};
                    page.tempItem[rowIndex] = tableData[i].pritemCode;
                    page.tempItemArr.push(tableData[i].pritemCode);
                }
            },
            //渲染表格
            showTable: function (tableData) {
                page.tempItemArrfun(tableData);
                page.tableObjData = tableData;
                var columns;
                var toolbarArr = [
                    {
                        type: 'button',
                        class: 'btn btn-default btn-add btn-permission ml10',
                        text: '增加',
                        action: function() {
                            if($("#itemTab li.active").length == 0){
                                ufma.showTip("请选择一个工资类别后，再增加公式",function(){},"warning");
                                return false
                            }
                            var obj = $('#nameTable').getObj();
                            var datas = obj.getData();
                            var max = 0;
                            for(var i=0;i<datas.length;i++){
                                if(parseInt(datas[i].priority) > max){
                                    max = parseInt(datas[i].priority)
                                }
                            }
                            var index = max + 1;
                            var rowdata = {
                                priority:index.toString(),
                                isUsed:"Y",
                                paycloseClear:"Y",
                                isTaxItem:"N",
                                isYearAwardTaxItem:"N",
                                isEditable: "Y",
                                isEditableName: "手动录入",
                                ordIndex:index.toString(),
                                isAdd: '1'
                            };
                            if($("body").attr("data-code")){
                                rowdata.isDifferentColor = "N";
                                // rowdata.isShowNotedit = "N";
                                rowdata.isHighLight = "N"
                            }
                            obj.add(rowdata);
                            console.log('表格添加数据完成！');
                        }
                    },
                    {
                        type: 'button',
                        class: 'btn btn-default btn-delete btn-permission',
                        text: '删除',
                        action: function() {
                            var obj = $('#nameTable').getObj();
                            var datas = obj.getCheckData();
                            var $check = $('#nameTable').find('.check-item:checked')

                            if (datas.length == 0) {
                                ufma.showTip("请选择要删除的数据", function () {

                                }, "warning");
                                return false;
                            }
                            //把要删除的数据分成已保存的和未保存的
                            var haveSaved = [],notSaved = [];
                            for(var i=0;i<datas.length;i++){
                                if(datas[i].createDate){
                                    haveSaved.push(datas[i]);
                                }else{
                                    var rowid = $check.eq(i).attr('rowid');
                                    datas[i]["rowid"] = rowid;
                                    notSaved.push(datas[i]);
                                }
                            }
                            if (!page.checkEdit()) {
                                ufma.confirm('您有未保存的内容，确认删除吗？', function (action) {
                                    if (action) {
                                        //点击确定的回调函数
                                        delFun()
                                    } else {
                                        //点击取消的回调函数
                                    }
                                }, {type: 'warning'});
                                return false
                            } else {
                                delFun()
                                
                            }

                            function delFun(){
                                if(haveSaved.length > 0){
                                    delSaved();
                                }
                                if(notSaved.length > 0){
                                    delNew();
                                }
                            }
                            function delNew(){
                                if (notSaved.length > 0) {
                                for (var i = 0; i < notSaved.length; i++) {
                                    obj.del(notSaved[i].rowid)
                                }
                                } 
                            }
                            function delSaved() {
                                var argu = {
                                    prsTypes: []
                                };
                                for (var i = 0; i < haveSaved.length; i++) {
                                        var obj2 = {
                                            pritemCode: haveSaved[i].pritemCode,
                                            prtypeCode: haveSaved[i].prtypeCode
                                        };
                                        argu.prsTypes.push(obj2);
                                }
                                ufma.post(interfaceURL.delPrsTypeItem, argu, function (result) {
                                    ufma.showTip(result.msg, function () {

                                    }, result.flag)
                                    page.getSearchData();
                                })
                            }
                        }
                    },
                    {
                        type: 'button',
                        class: 'btn btn-default btn-senddown btn-permission',
                        text: '下发',
                        action: function() {
                            var obj = $('#nameTable').getObj();
                            var checkData = obj.getCheckData();
                            if (checkData.length == 0) {
                                //没有勾选则全部下发
                                checkData =  obj.getData();
                            }
                            if (checkData.length == 0) {
                                ufma.showTip("请选择工资类别！",function(){},"warning");
                                return false;
                            }
                            if (checkData.length == 1) {
                                if (checkData[0].isUsed == 'N') {
                                    ufma.showTip("勾选数据包含 停用状态的公式,不能下发",function(){},"warning");
                                    return false;
                                }
                                checkData =  obj.getData();
                            }
                            page.modal = ufma.selectBaseTree({
                                url: interfaceURL.getAgencyTree,
                                rootName: '所有单位',
                                title: '选择下发单位',
                                bSearch: true, //是否有搜索框
                                checkAll: true,//是否有全选
                                buttons: { //底部按钮组
                                    '确认下发': {
                                        class: 'btn-primary',
                                        action: function (data) {
                                            if (data.length == 0) {
                                                ufma.alert('请选择单位！', 'warning');
                                                return false;
                                            }
                                            // var prtypeCode = $(".tab-items .btn-primary").attr("data-id");
                                            var prtypeCode = $("#itemTab").find("li.active").find("a").attr("data-id");
                                            var argu = {
                                                setYear: svData.svSetYear,
                                                agencyCodes: [],
                                                prtypeCode: prtypeCode,
                                                pritemCodes: []
                                            };

                                            // var tableDatas = obj.getData();
                                            for (var i = 0; i < checkData.length; i++) {
                                                if (checkData[i].isUsed === 'Y') {
                                                    argu.pritemCodes.push(checkData[i].pritemCode)
                                                }
                                            }
                                            for (var i = 0; i < data.length; i++) {
                                                argu.agencyCodes.push(data[i].code);
                                            }
                                            ufma.post(interfaceURL.downPrsTypeItem, argu, function (result) {
                                                ufma.showTip(result.msg, function () {
                                                }, result.flag);
                                                page.modal.close();
                                            });
                                            //下发后取消全选
                                            $("input[name='checkbox']").prop("checked", false);
                                        }
                                    },
                                    '取消': {
                                        class: 'btn-default',
                                        action: function () {
                                            page.modal.close();
                                        }
                                    }
                                }
                            });
                        }
                    },
                    {
                        type: 'button',
                        class: 'btn btn-default btn-copy btn-permission',
                        text: '复制到',
                        action: function() {
                            var obj = $('#nameTable').getObj();
                            var datas = obj.getCheckData();
                            var $check = $('#nameTable').find('.check-item:checked')

                            if (datas.length == 0) {
                                ufma.showTip("请选择要复制的数据", function () {
                                }, "warning");
                                return false;
                            }
                            if (!page.checkEdit()) {
                                ufma.alert('您有未保存的内容，请先保存再操作.');
                                return false;
                            }
                            var prtypeCode = $("#itemTab .active").find("a").attr("data-id");
                            var tableDatas = $("#nameTable").getObj().getCheckData();
                            var args = {
                                prsTypeData : prsTypeData,
                                prtypeCode : prtypeCode,
                                tableDatas : tableDatas,
                                url : interfaceURL.updatePrsTypeItem
                            };
                            ufma.open({
                                url: 'selectType.html',
                                title: '选择要复制到的工资类别',
                                width: 450,
                                height: 400,
                                data: args,
                                ondestory: function (data) {
                                    //窗口关闭时回传的值
                                }
                            });
                        }
                    }
                ];
                if ($("body").attr("data-code")) {
                    columns = page.recombineColumnsAgy()
                    toolbarArr.splice(2,1);
                } else {
                    columns = page.recombineColumns()
                }
                var id = "nameTable";
                $('#' + id).ufDatagrid({
                    frozenStartColumn: 1, //冻结开始列,从1开始
                    frozenEndColumn: 1, //冻结结束列
                    data: tableData,
                    disabled: false, // 可选择
                    columns: columns,
                    paginate: true, // 分页
					pagingType: "full_numbers", // 分页样式
                    toolbar: toolbarArr,
                    initComplete: function (options, data) {
                        // console.log('initComplete');
                        $('.uf-grid-table').on('click', function(){
                            setTimeout(function(){
                                $("#nameTabletreecomboxpritemCode").getObj().setEnabled(false)
                                $("#nameTabletreecomboxpritemCode .icon-close").addClass("hidden")
                                $(".uf-grid-table-edit #nameTabletreecomboxpritemCode_btn").addClass("hidden")
                            }, 30)
                        })
                        //保存过的工资项目不能修改
                        $(document).on("focus", "#nameTabletreecomboxpritemCode_input", function () {
                            console.log('focus')
                            var rowid = $(".uf-grid-table-edit").attr("rowid");
                            var rowNoarr = rowid.split("_");
                            var rowNo = parseInt(rowNoarr[rowNoarr.length - 1]);
                            var len = page.searchData.length ? page.searchData.length : 0;
                            if (rowNo > len) {
                                //新增一行
                                $("#nameTabletreecomboxpritemCode").getObj().setEnabled(true);
                                $("#nameTabletreecomboxpritemCode_btn").removeClass("hidden");
                                $(".icon-close").removeClass("hidden")
                            } else {
                                //修改某一行
                                $("#nameTabletreecomboxpritemCode").getObj().setEnabled(false);
                                $("#nameTabletreecomboxpritemCode_btn").addClass("hidden");
                                $(".icon-close").addClass("hidden")
                                ufma.showTip('保存过的工资项目不能修改',function(){},'warning');
                            }
                        })
                        //来源是手工计算时，公式定义单元格才可编辑
                        $(document).on("focus","input[name=formulaName]",function(){
                            var rowid = $(".uf-grid-table-edit").attr("rowid");
                            var rowData = $('#' + id).getObj().getRowByTId(rowid);
                            if(rowData.isEditable != 2){
                                $(this).attr("disabled",true)
                            }
            
                        })
                        $(document).on("blur","input[name=formulaName]",function(){
                            $(this).attr("disabled",false)
                        })
                        ufma.isShow(page.reslist);
                        ufma.hideloading();
                    }
                });
                ufma.isShow(page.reslist);
                //表格内容高度
                if ($("#nameTableBody").attr("data-h") != "1") {
                    var h = $(".workspace").height();
                    var tableBodyH = h - 166;
                    $("#nameTableBody").height(tableBodyH).attr("data-h", "1");
                }
            },
            //单位级界面用到的基础数据
            baseDatasAgency: function (data) {
                //工资项目
                page.prsItemsDataFor = data.prsItemCos;
                page.prsItemsData = [];
                for (var i = 0; i < data.prsItemCos.length; i++) {
                    var obj = {
                        pritemCode: data.prsItemCos[i].pritemCode,
                        pritemCodeName: data.prsItemCos[i].pritemName
                    };
                    page.prsItemsData.push(obj);
                }
                page.prsItemsData2 = [];
                for (var i = 0; i < data.prsItemCos.length; i++) {
                    var obj = {
                        pritemCodeTax: data.prsItemCos[i].pritemCode,
                        pritemCodeTaxName: data.prsItemCos[i].pritemName
                    };
                    page.prsItemsData2.push(obj);
                }
                page.prsItemsData3 = [];
                for (var i = 0; i < data.prsItemCos.length; i++) {
                    var obj = {
                        supplyItem: data.prsItemCos[i].pritemCode,
                        supplyItemName: data.prsItemCos[i].pritemName
                    };
                    page.prsItemsData3.push(obj);
                }
                //数据来源
                page.prsValItemsData = [];
                for (var i = 0; i < data.prsVals.length; i++) {
                    var obj = {
                        isEditable: data.prsVals[i].valId,
                        isEditableName: data.prsVals[i].val
                    };
                    page.prsValItemsData.push(obj);
                }
                //人员信息
                page.prsValEmpsData = data.pageGridColumns;
                //ljjsxm
                page.ljjsxm = [];
                for (var i = 0; i < data.prsItemCos.length; i++) {
                    var obj = {
                		ljjsxmCode: data.prsItemCos[i].pritemCode,
                		ljjsxmName: data.prsItemCos[i].pritemName
                    };
                    page.ljjsxm.push(obj);
                }
                page.extSysGetValsData = [];
                //外部系统取数
                for (var i = 0; i < data.extSysVals.length; i++) {
                    var obj = {
                        isExtSys: data.extSysVals[i].valId,
                        isExtSysVal: data.extSysVals[i].val
                    };
                    page.extSysGetValsData.push(obj);
                }
            },
            //表格数据
            getSearchData: function () {
                // var id = $(".tab-items .btn-primary").attr("data-id");
                var id = $("#itemTab").find("li.active").find("a").attr("data-id");
                var argu = {
                    prtypeCode: id?id:""
                };
                ufma.showloading("正在加载数据，请耐心等待...");
                ufma.post(interfaceURL.findPrsTypeItem, argu, function (result) {
                    if(!$("body").attr("data-code")&&result.data.length==0){
                        ufma.hideloading();
                    }
                    if($("body").attr("data-code")&&result.data.prsTypeItemCos.length==0){
                        ufma.hideloading();
                    }
                    var data = result.data;
                    if ($("body").attr("data-code")) {
                        page.searchData = data.prsTypeItemCos;
                        page.baseDatasAgency(data);
                    } else {
                        page.searchData = data;
                    }
                    //表格
                    page.showTable(page.searchData);
                })

            },
            //系统级选择列
            renderSeletableColumns: function () {
                page.renderP(sysdatas);
            },
            //单位级选择列
            renderSeletableColumnsAgy: function () {
                page.renderP(agencydatas);
            },
            renderP: function (datas) {
                var arr = ["length", "wageCode", "dataSourceCode", "formula", "enableCode", "clearCode", "clearCode", "shunxuhao"];
                var pHtml = "";
                for (var i = 0; i < datas.length; i++) {
                    if (arr.indexOf(datas[i].code) >= 0) {
                        pHtml += '<p><label class="mt-checkbox mt-checkbox-outline" title="' + datas[i].name + '"><input type="checkbox" checked="checked" data-code="' + datas[i].code + '" data-name="' + datas[i].name + '">' + datas[i].name + '<span></span></label></p>'
                    } else {
                        pHtml += '<p><label class="mt-checkbox mt-checkbox-outline" title="' + datas[i].name + '"><input type="checkbox" data-code="' + datas[i].code + '" data-name="' + datas[i].name + '">' + datas[i].name + '<span></span></label></p>'
                    }

                }
                $("#colList").append(pHtml);
            },
            //打开弹窗
            openWin: function () {
                var openData = {};
                ufma.open({
                    url: 'addEmployeeImport.html',
                    title: title,
                    width: 1090,
                    //height:500,
                    data: openData,
                    ondestory: function (data) {
                        //窗口关闭时回传的值
                        if (data) {
                            page.getSearchData();
                        }
                    }
                });
            },
            //获取勾选的数据
            getCheckedRows: function () {
                var checkes = $("input.checkboxes:checked");
                return checkes;
            },
            //请求数据
            allOtherDatasList: function () {
                var argu = {};
                ufma.showloading("正在加载数据请耐心等待...");
                ufma.post(interfaceURL.findBasePrsTypeItem, argu, function (result) {
                    ufma.hideloading();
                    var data = result.data;
                    //工资项目
                    page.prsItemsDataFor = data.prsItems;
                    page.prsItemsData = [];
                    for (var i = 0; i < data.prsItems.length; i++) {
                        var obj = {
                            pritemCode: data.prsItems[i].pritemCode,
                            pritemCodeName: data.prsItems[i].pritemName
                        };
                        page.prsItemsData.push(obj);
                    }
                    page.prsItemsData2 = [];
                    for (var i = 0; i < data.prsItems.length; i++) {
                        var obj = {
                            pritemCodeTax: data.prsItems[i].pritemCode,
                            pritemCodeTaxName: data.prsItems[i].pritemName
                        };
                        page.prsItemsData2.push(obj);
                    }
                    page.prsItemsData3 = [];
                    for (var i = 0; i < data.prsItems.length; i++) {
                        var obj = {
                            supplyItem: data.prsItems[i].pritemCode,
                            supplyItemName: data.prsItems[i].pritemName
                        };
                        page.prsItemsData3.push(obj);
                    }
                    //数据来源
                    page.prsValItemsData = [];
                    for (var i = 0; i < data.prsValItems.length; i++) {
                        var obj = {
                            isEditable: data.prsValItems[i].valId,
                            isEditableName: data.prsValItems[i].val
                        };
                        page.prsValItemsData.push(obj);
                    }
                  //ljjsxm
                    page.ljjsxm = [];
                    for (var i = 0; i < data.prsItems.length; i++) {
                        var obj = {
                    		ljjsxmCode: data.prsItems[i].pritemCode,
                    		ljjsxmName: data.prsItems[i].pritemName
                        };
                        page.ljjsxm.push(obj);
                    }
                    //初始化表格
                    page.showTable([]);
                    //人员信息
                    page.prsValEmpsData = data.prsValEmps;
                    //工资类别
                    page.renderWageTypes(data.prsTypes);
                });
            },
            //查询单位级工资类别
            findPrsTypeCo: function () {
                ufma.post(interfaceURL.findPrsTypeCo, {}, function (result) {
                    var data = result.data;
                    page.renderWageTypes(data);
                })
            },
            //渲染工资类别
            renderWageTypes: function (wageTypes) {
            	prsTypeData = wageTypes;
                var liHtmls = "";
                // for (var i = 0; i < wageTypes.length; i++) {
                //     liHtmls += '<button class="btn btn-default tab-li" data-id="' + wageTypes[i].prtypeCode + '">' + wageTypes[i].prtypeName + '</button>'
                // }
                // $(".tab-items").append(liHtmls);
                // $(".tab-items").find(".btn").eq(0).addClass("btn-primary").removeClass("btn-default");
                for (var i = 0; i < wageTypes.length; i++) {
                    liHtmls += '<li><a href="javascript:;" data-id="' + wageTypes[i].prtypeCode + '" data-name="' + wageTypes[i].prtypeName + '" >' + wageTypes[i].prtypeName + '</a></li>'
                }
                var w = $(".prs-workspace").width();
                $("#navTabBox").width(w-158);
                $('#itemTab').css({
                    'width': '3000px',
                    'min-width': '100%'
                }).html(liHtmls);
                var timeId = setTimeout(function () {
                    clearTimeout(timeId);

                    var tabWidth = 10,
                        boxWidth = $('#navTabBox').width();
                    $('#itemTab li').each(function () {
                        tabWidth += $(this).outerWidth(true);
                        $(this)[boxWidth < tabWidth ? 'addClass' : 'removeClass']('hidden');
                    });
                    $('#itemTab').css({
                        'width': tabWidth + 'px'
                    });
                    $('#tabBtn')[boxWidth < tabWidth ? 'removeClass' : 'addClass']('none');
                }, 600);
                $("#itemTab").find("li").eq(0).addClass("active");
                page.tabIndex = 0;
                if(wageTypes.length > 0){
                    page.getSearchData();
                }
                
            },
            //检验数据是否改变
            checkEdit: function () {
                var tmpData = $("#nameTable").getObj().getData();
                console.log(tmpData.length, page.searchData.length);
                for (var i = 0; i < tmpData.length; i++) {
                    for (var s in tmpData[i]) {
                        if (tmpData[i][s] == '' || tmpData[i][s] == "*") {
                            delete tmpData[i][s]
                        }
                    }
                }
                for (var i = 0; i < page.searchData.length; i++) {
                    for (var s in page.searchData[i]) {
                        if (page.searchData[i][s] == '' || page.searchData[i][s] == "*") {
                            delete page.searchData[i][s]
                        }
                    }
                }
                var bEdit = (JSON.stringify(page.searchData) == JSON.stringify(tmpData))
                if (page.searchData.length == 0 && tmpData.length == 0) return true;
                // if(istitle == 1) return true;
                if(!bEdit){
                    return bEdit;
                }
                return bEdit;
            },
            //获取需要保存的数据
            getChangedDatas:function(){
                var changedDatas = [];
                var tableDatas = $("#nameTable").getObj().getData();
                for(var i=0;i<tableDatas.length;i++){
                    if(page.searchData[i]){
                        var origionData = JSON.stringify(page.searchData[i]);
                        var currentData = JSON.stringify(tableDatas[i])
                        if(origionData != currentData){
                            changedDatas.push(tableDatas[i])
                        }
                    }else{
                        changedDatas.push(tableDatas[i])
                    }
                }
                return changedDatas;
            },
            save: function () {
                var prtypeCode = $("#itemTab").find("li.active").find("a").attr("data-id");
                var argu = {
                    prsTypes: []
                };
                var tableDatas = page.getChangedDatas();
                if(tableDatas.length == 0){
                    ufma.showTip("无修改过的数据，不需要保存",function(){},"warning");
                    return false
                }
                var res2 = false;
                for (var i = 0; i < tableDatas.length; i++) {
                    var obj = {
                        pritemCode: tableDatas[i].pritemCode?tableDatas[i].pritemCode:'',
                        pritemCodeName: tableDatas[i].pritemCodeName?tableDatas[i].pritemCodeName:'',
                        prtypeCode: prtypeCode?prtypeCode:'',
                        setYear: svData.svSetYear?svData.svSetYear:'',
                        pritemCalcType: "",
                        isTaxItem: tableDatas[i].isTaxItem ? tableDatas[i].isTaxItem : "N",
                        formulaName: tableDatas[i].formulaName?tableDatas[i].formulaName:'',
                        priority: tableDatas[i].priority?tableDatas[i].priority:'',
                        ordIndex: tableDatas[i].ordIndex?tableDatas[i].ordIndex:'',
                        paycloseClear: tableDatas[i].paycloseClear?tableDatas[i].paycloseClear:'',
                        maxValue: "",
                        minValue: "",
                        isUsed: tableDatas[i].isUsed?tableDatas[i].isUsed:'',
                        pritemPro: "",
                        pritemCodeTax: tableDatas[i].pritemCodeTax ? tableDatas[i].pritemCodeTax : "",
                        isEditable: tableDatas[i].isEditable?tableDatas[i].isEditable:'',
                        ljjsxm: tableDatas[i].ljjsxm ? tableDatas[i].ljjsxm : "",
                        isYearAwardTaxItem: tableDatas[i].isYearAwardTaxItem ? tableDatas[i].isYearAwardTaxItem : "N"
                    };
                    var res = false;
                    for(var y in obj){
                        if(obj[y] == undefined || obj[y] == null){
                            if(y == "formulaName"){
                                /*if(obj["isEditable"] == "2"){
                                    res = true;
                                    ufma.showTip("有 公式定义 项未填写，请检查",function(){},"warning");
                                    break
                                }*/
                            }else{
                                // res = true;
                                console.log(y)
                                console.log(col[y])
                                // ufma.showTip("有 项未填写，请检查",function(){},"warning");
                                break 
                            }
                        }
                    }
                    if(res){
                        res2 = true;
                        break
                    }
                    argu.prsTypes.push(obj);
                }

                if(res2){
                    return false
                }
                var denabledRow = argu.prsTypes.filter(item => {
                    return item.isUsed == 'N'
                })
                var argu2 = { prsTypes: denabledRow }
                //保存之前先获取不启用的行数据
                ufma.post('/prs/prscalcdata/clearPritem', argu2, function(res){
                    ufma.post(interfaceURL.updatePrsTypeItem, argu, function (result) {
                        ufma.showTip(result.msg, function () {
    
                        }, result.flag);
                        page.getSearchData()
                    })
                })
            },
            //单位级保存
            saveAgency: function () {
                var prtypeCode = $("#itemTab").find("li.active").find("a").attr("data-id");
                var argu = {
                    prsTypes: []
                };
                var tableDatas = page.getChangedDatas();
                if(tableDatas.length == 0){
                    ufma.showTip("无修改过的数据，不能保存",function(){},"warning");
                    return false
                }
                var res2 = false;
                for (var i = 0; i < tableDatas.length; i++) {
                    var obj = {
                        pritemCode: tableDatas[i].pritemCode?tableDatas[i].pritemCode:'',
                        pritemCodeName: tableDatas[i].pritemCodeName?tableDatas[i].pritemCodeName:'',
                        prtypeCode: prtypeCode?prtypeCode:'',
                        pritemCalcType: "",
                        isTaxItem: tableDatas[i].isTaxItem ? tableDatas[i].isTaxItem : "N",
                        formulaName: tableDatas[i].formulaName?tableDatas[i].formulaName:'',
                        priority: tableDatas[i].priority?tableDatas[i].priority:'',
                        ordIndex: tableDatas[i].ordIndex?tableDatas[i].ordIndex:'',
                        paycloseClear: tableDatas[i].paycloseClear?tableDatas[i].paycloseClear:'',
                        maxValue: "",
                        minValue: "",
                        isUsed: tableDatas[i].isUsed?tableDatas[i].isUsed:'',
                        pritemPro: "",
                        pritemCodeTax: tableDatas[i].pritemCodeTax ? tableDatas[i].pritemCodeTax : "",
                        isEditable: tableDatas[i].isEditable?tableDatas[i].isEditable:'',
                        isYearAwardTaxItem: tableDatas[i].isYearAwardTaxItem ? tableDatas[i].isYearAwardTaxItem : "N",
                        taxPlusItem: "",
                        capitalName: "",
                        supplyItem: tableDatas[i].supplyItem ? tableDatas[i].supplyItem : "",
                        isDifferentColor: tableDatas[i].isDifferentColor ? tableDatas[i].isDifferentColor : "",
                        isHighLight: tableDatas[i].isHighLight?tableDatas[i].isHighLight:'',
                        ljjsxm: tableDatas[i].ljjsxm ? tableDatas[i].ljjsxm : "",
                        dataFromAr: "",
                        // isShowNotedit: tableDatas[i].isShowNotedit ? tableDatas[i].isShowNotedit : "",
                        isExtSys: tableDatas[i].isExtSys?tableDatas[i].isExtSys:'',
                        isExtSysName: tableDatas[i].isExtSysVal?tableDatas[i].isExtSysVal:''
                    };
                    //编辑状态 
                    // if(tableDatas[i].isEditable=='W'&&tableDatas[i].isExtSys=='N'){
                    //     ufma.showTip("外部系统取数选项不能为空",function(){},"warning");
                    //     res2 = true;
                    //     return false;
                    // }
                    var res = false;
                    for(var y in obj){
                        if(obj[y] == undefined || obj[y] == null){
                            if(y == "formulaName"){
                                /*if(obj["isEditable"] == "2"){
                                    res = true;
                                    ufma.showTip("有 公式定义 项未填写，请检查",function(){},"warning");
                                    break
                                }*/
                            }else{
                                // res = true;
                                console.log(y)
                                console.log(col[y])
                                // ufma.showTip("有 项未填写，请检查",function(){},"warning");
                                break 
                            }
                               
                            
                        }
                    }
                    if(res){
                        res2 = true;
                        break
                    }
                    argu.prsTypes.push(obj);
                }
                if(res2){
                    return false
                }
                var denabledRow = argu.prsTypes.filter(item => {
                    return item.isUsed == 'N'
                })
                var argu2 = { prsTypes: denabledRow }
                //保存之前先获取不启用的行数据
                ufma.post('/prs/prscalcdata/clearPritem', argu2, function(res){
                    ufma.post(interfaceURL.updatePrsTypeItem, argu, function (result) {
                        ufma.showTip(result.msg, function () {
    
                        }, result.flag);
                        page.getSearchData()
                    })
                })
            },
            initPage: function () {
                //权限控制
                page.reslist = ufma.getPermission();
                ufma.isShow(page.reslist);
                if ($("body").attr("data-code")) {
                	page.renderSeletableColumnsAgy();
                    page.showTable([]);
                    page.findPrsTypeCo();
                } else {
                    page.renderSeletableColumns();
                    //请求其他数据
                    page.allOtherDatasList();
                }


            },
            onEventListener: function () {
                //tab切换
                $("#itemTab").on("click", "li", function () {
                    //保证表格内容渲染完毕才允许向下执行
                    if (!page.checkEdit()) {
                        ufma.confirm('您有未保存的内容，确认离开吗？', function (action) {
                            if (action) {
                                //点击确定的回调函数
                                page.getSearchData();
                                page.tabIndex = $("#itemTab").find("li.active").index();
                            } else {
                                $("#itemTab").find("li").removeClass("active");
                                $("#itemTab").find("li").eq(page.tabIndex).addClass("active");
                                //点击取消的回调函数
                            }
                        }, {type: 'warning'});
                        return false
                    }
                    page.getSearchData();
                });
                //保存
                $("#btn-save").on("click", function () {
                    if ($("body").attr("data-code")) {
                        page.saveAgency();
                    } else {
                        page.save();
                    }
                });
                //选择显示的列
                $("#colAction").on("click", function () {
                    $(this).next(".rpt-funnelBoxList").toggleClass("hidden");
                });
                $("#addCol").on("click", function () {
                    $(this).closest(".rpt-funnelBoxList").addClass("hidden");
                    var tableDatas = $("#nameTable").getObj().getData();
                    page.showTable(tableDatas);
                });
                $('#rightMove').on('click', function () {
                    var lastItems = $('#itemTab li.hidden');
                    if (lastItems.length == 0) return false;
                    var activeItems = $('#itemTab li:not(.hidden)');
                    var num = parseInt($(this).attr("data-num"));
                    var $lastItem = $(lastItems[0]);
                    $lastItem.removeClass('hidden');
                    // var ml = parseInt($('#itemTab').css('margin-left').replace('px', '')) - $lastItem.outerWidth(true);
                    // var ml = parseInt($('#itemTab').css('margin-left').replace('px', '')) - $(activeItems[num]).outerWidth(true);
                
                    var mlw = $(lastItems[0]).outerWidth(true);
                    var ml = parseFloat($('#itemTab').css('margin-left').replace('px', '')) - mlw;
                    moveNote.push(mlw);
                    $('#itemTab').css({
                        'margin-left': ml + 'px'
                    });

                    $("#rightMove").attr("data-num", num + 1);
                    $("#leftMove").attr("data-num", num + 1)
                });
                $('#leftMove').on('click', function () {
                    var lastItems = $('#itemTab li:not(.hidden)');
                    if (lastItems.length == 0) return false;
                    // var activeItems = $('#itemTab li:not(.hidden)');
                    var $lastItem = $(lastItems[lastItems.length - 1]);
                    if(moveNote.length == 0) return false;
                    var num = parseInt($("#rightMove").attr("data-num"));
                    var mrw = moveNote[num-1];
                    if(mrw){
                        // var ml = parseInt($('#itemTab').css('margin-left').replace('px', '')) + $(activeItems[num - 1]).outerWidth(true);
                        var ml = parseInt($('#itemTab').css('margin-left').replace('px', '')) + mrw;
                        ml = ml > 0 ? 0 : ml;
                        $('#itemTab').css({
                            'margin-left': ml + 'px'
                        });
                        $lastItem.addClass('hidden');
                        // if (ml < 0) 
                        moveNote.splice(num-1,1)
                        $("#leftMove").attr("data-num", num - 1)
                        $("#rightMove").attr("data-num", num - 1)
                    }
                    // var ml = parseInt($('#itemTab').css('margin-left').replace('px', '')) + $lastItem.outerWidth(true);
                });
                
                $('#tool-bar-copy').off('click').on('click', function () {
                	var obj = $('#nameTable').getObj();
                    var datas = obj.getCheckData();
                    var $check = $('#nameTable').find('.check-item:checked')

                    if (datas.length == 0) {
                        ufma.showTip("请选择要复制的数据", function () {
                        }, "warning");
                        return false;
                    }
                    if (!page.checkEdit()) {
                        ufma.alert('您有未保存的内容，请先保存再操作.');
                        return false;
                    }
                    var prtypeCode = $("#itemTab .active").find("a").attr("data-id");
                    var tableDatas = $("#nameTable").getObj().getCheckData();
                    var args = {
                    	prsTypeData : prsTypeData,
                    	prtypeCode : prtypeCode,
                    	tableDatas : tableDatas,
                    	url : interfaceURL.updatePrsTypeItem
                    };
                    ufma.open({
                        url: 'selectType.html',
                        title: '选择要复制到的工资类别',
                        width: 450,
                        height: 400,
                        data: args,
                        ondestory: function (data) {
                            //窗口关闭时回传的值
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

    function stopPropagation(e) {
        if (e.stopPropagation)
            e.stopPropagation();
        else
            e.cancelBubble = true;
    }
});
