$(function () {
    window._close = function (state, id) {
        if (window.closeOwner) {
            var data = {
                action: state
            };
            window.closeOwner(data);
        }
    }
    var page = function () {
        var beginList = {
            agencyList: "/gl/eleAgency/getAgencyTree",//单位列表接口
            acctList: "/gl/eleCoacc/getRptAccts",//账套列表接口
            accScheList: "/gl/bank/recon/getBankReconSche",//方案查询接口
            bankReconBeginList: "/gl/bank/getBankBalAccInit",//获取银行对账期初
            saveBankReconBegin: "/gl/bank/saveBankBalAccInit",//保存银行对账期初
        };
        //表格初始化置空行
        var dataOnload = [{
            billType: '', billNo: '', descpt: '',
            vouNo: '', vouDate: '', amtDr: '', amtCr: ''
        }];
        var dataOnloadOne = [{
            billType: '', billNo: '', descpt: '',
            vouNo: '', statementDate: '', amtDr: '', amtCr: ''
        }];
        var billTypeData = [];//票据类型
        var setmodeData = [];//结算方式

        // 账套
        var acctData = [];
        var colOnloadInit = [[        //支持多表头
            { type: 'indexcolumn', field: 'ordSeq', name: '序号', width: 50, headalign: 'center', align: 'center' },
            { type: 'input', field: 'isBalanceAccName', name: '状态', width: 70, headalign: 'center', align: 'center' },
            { type: 'datepicker', field: 'vouDate', name: '凭证日期', width: 90, headalign: 'center', align: 'center' },
            { type: 'input', field: 'vouNo', name: '凭证编号', width: 80, headalign: 'center', align: 'right' },
            { type: 'input', field: 'descpt', name: '摘要', width: 155, headalign: 'center' },
            {
                type: 'money',
                field: 'amtDr',
                name: '借方金额',
                width: 100,
                headalign: 'center',
                align: 'right',
                render: function (rowid, rowdata, data) {
                    if (!data || data == "0.00" || data == 0) {
                        return '';
                    }
                    return $.formatMoney(data, 2);
                },
                onKeyup: function (sdr) {
                    $("#lateBoxmoneyamtCr").val('');
                }
            },
            {
                type: 'money',
                field: 'amtCr',
                name: '贷方金额',
                width: 100,
                headalign: 'center',
                align: 'right',
                render: function (rowid, rowdata, data) {
                    if (!data || data == "0.00" || data == 0) {
                        return '';
                    }
                    return $.formatMoney(data, 2);
                },
                onKeyup: function (sdr) {
                    $("#lateBoxmoneyamtDr").val('');
                }
            },
            {
                type: 'treecombox',
                field: 'setmodeCode',
                name: '结算方式',
                width: 110,
                headalign: 'center',
                idField: 'setmodeCode',
                textField: 'setmodeName',
                data: setmodeData,
                onChange: function (e) {
                },
                beforeExpand: function (e) {
                },
                render: function (rowid, rowdata, data) {
                    return rowdata.setmodeName;
                }
            },
            {
                type: 'treecombox',
                field: 'billType',
                name: '票据类型',
                width: 110,
                headalign: 'center',
                idField: 'billType',
                textField: 'billTypeName',
                leafRequire: true,
                data: billTypeData,
                onChange: function (e) {
                },
                beforeExpand: function (e) {
                },
                render: function (rowid, rowdata, data) {
                    if (!data) {
                        return '';
                    }
                    return rowdata.billTypeName;
                }
            },
            { type: 'datepicker', field: 'billDate', name: '票据日期', width: 90, headalign: 'center', align: 'center' },
            { type: 'input', field: 'billNo', name: '票据号', width: 125, headalign: 'center', align: 'right' },
            {
                type: 'treecombox',
                field: 'code',
                name: '账套',
                width: 110,
                headalign: 'center',
                idField: 'code',
                textField: 'codeName',
                data: acctData,
                onChange: function (e) {
                },
                beforeExpand: function (e) {
                }
            },
            {
                type: 'toolbar',
                field: 'option',
                name: '操作',
                width: 60,
                headalign: 'center',
                render: function (rowid, rowdata, data) {
                    if (rowdata.isBalanceAcc == 0) {
                        var code = rowdata['chrCode'];
                        return '<a class="btnDel" rowid="' + rowid + '" conid="' + rowdata + '"><span class="icon icon-trash"></span></a>';
                    }
                    return '';
                }
            }
        ]];

        return {
            //获取票据类型
            getBillType: function () {
                var data = window.ownerData.datas.journalTableOption.billType;
                for (var i = 0; i < data.length; i++) {
                    var obj = {};
                    var ele = "billType"
                    //var code = ele + "Code";
                    var code = ele;
                    var codeName = ele + "Name";
                    obj[code] = data[i].code;
                    obj[codeName] = data[i].codeName;
                    obj["pId"] = data[i].pId;
                    billTypeData.push(obj);
                }
            },
            //获取结算方式
            getSetMode: function () {
                var data = window.ownerData.datas.journalTableOption.setmode;
                for (var i = 0; i < data.length; i++) {
                    var obj = {};
                    var ele = "setmode"
                    var code = ele + "Code";
                    var codeName = ele + "Name";
                    obj[code] = data[i].code;
                    obj[codeName] = data[i].codeName;
                    obj["pId"] = data[i].pId;
                    setmodeData.push(obj);
                }
            },
            //获取账套
            getAcctCode: function () {
                var data = window.ownerData.datas.journalTableOption.ACCT;
                for (var i = 0; i < data.length; i++) {
                    var obj = {};
                    obj.acctCode = data[i].code;
                    obj.acctName = data[i].codeName;
                    acctData.push(obj);
                }
            },
            reqTree: function (boxArr, boxOpt, cols, datas) {
                for (var i = 0; i < (boxArr).length; i++) {
                    var newData = [];
                    for (var j = 0; j < (boxOpt)[(boxArr)[i].extendField].length; j++) {
                        var obj = {};
                        var arr = [];
                        obj[(boxArr)[i].extendField] = (boxOpt)[(boxArr)[i].extendField][j].id;
                        // obj[(boxArr)[i].extendField + 'codeName'] = (boxOpt)[(boxArr)[i].extendField][j].codeName;
                        obj[(boxArr)[i].extendField + 'Name'] = (boxOpt)[(boxArr)[i].extendField][j].codeName;
                        obj["pId"] = (boxOpt)[(boxArr)[i].extendField][j].pId;
                        newData.push(obj);
                    }
                    if (window.ownerData.type == "0") {
                        if ((boxArr)[i].eleCode == "PROJECT") {
                            var ele = (boxArr)[i].extendField;
                            cols[0].splice(cols[0].length - 2, 0, {
                                type: 'treecombox',
                                field:ele,
                                name: (boxArr)[i].showName,
                                headalign: 'center',
                                idField: ele,
                                textField: ele + 'Name',
                                data: newData,
                                beforeExpand: function (e) {
                                    //下拉框初始化
                                },
                                onChange: function (e) {
                                    var extendData = window.ownerData.datas.journalTableOption[ele];
                                    for (var i = 0; i < extendData.length; i++) {
                                        if (extendData[i].code == e.itemData[ele]) {
                                            $(e.sender).siblings('.inputedit[name="relation"]').val(extendData[i].relationCode);
                                        }
                                    }
                                }
                            });
                        } else if ((boxArr)[i].extendField == "relation") { //项目关联号
                            cols[0].splice(cols[0].length - 2, 0, {
                                type: 'input',
                                field: (boxArr)[i].extendField,
                                name: (boxArr)[i].showName,
                                headalign: 'center'
                            });
                        } else {
                            cols[0].splice(cols[0].length - 2, 0, {
                                type: 'treecombox',
                                field: (boxArr)[i].extendField,
                                name: (boxArr)[i].showName,
                                headalign: 'center',
                                idField: (boxArr)[i].extendField,
                                textField: (boxArr)[i].extendField + 'Name',
                                data: newData,
                                beforeExpand: function (e) {
                                    //下拉框初始化
                                }
                            });
                        }
                    } else {  //银行对账单
                        if ((boxArr)[i].eleCode == "PROJECT") {
                            var ele = (boxArr)[i].extendField;
                            cols[0].splice(cols[0].length - 1, 0, {
                                type: 'treecombox',
                                field: ele,
                                name: (boxArr)[i].showName,
                                headalign: 'center',
                                idField: ele,
                                textField: ele + 'Name',
                                data: newData,
                                beforeExpand: function (e) {
                                    //下拉框初始化
                                },
                                onChange: function (e) {
                                    var extendData = window.ownerData.datas.statementTableOption[ele];
                                    for (var i = 0; i < extendData.length; i++) {
                                        if (extendData[i].code == e.itemData[ele]) {
                                            $(e.sender).siblings('.inputedit[name="relation"]').val(extendData[i].relationCode);
                                        }
                                    }
                                }
                            });
                        } else if ((boxArr)[i].extendField == "relation") { //项目关联号
                            cols[0].splice(cols[0].length - 1, 0, {
                                type: 'input',
                                field: (boxArr)[i].extendField,
                                name: (boxArr)[i].showName,
                                headalign: 'center'
                            });
                        } else {
                            cols[0].splice(cols[0].length - 1, 0, {
                                type: 'treecombox',
                                field: (boxArr)[i].extendField,
                                name: (boxArr)[i].showName,
                                headalign: 'center',
                                idField: (boxArr)[i].extendField,
                                textField: (boxArr)[i].extendField + 'Name',
                                data: newData,
                                beforeExpand: function (e) {
                                    //下拉框初始化
                                }
                            });
                        }

                    }

                    if (datas.length != 0) {
                        // datas[0][(boxArr)[i].extendField + "codeName"] = '';
                        datas[0][(boxArr)[i].extendField + "Name"] = '';

                    }

                }
            },
            //组织可编辑表格表格数据
            fixedTable: function (seq, seqDatas) {
                var data = window.ownerData.datas;
                if (window.ownerData.type == "0") {
                    //单位日记账
                    var colOnload = [[        //支持多表头
                        {
                            type: 'indexcolumn',
                            field: 'ordSeq',
                            name: '序号',
                            width: 50,
                            headalign: 'center',
                            align: 'center'
                        },
                        {
                            type: 'input',
                            field: 'isBalanceAccName',
                            name: '状态',
                            width: 70,
                            headalign: 'center',
                            align: 'center'
                        },
                        {
                            type: 'datepicker',
                            field: 'vouDate',
                            name: '凭证日期',
                            width: 90,
                            headalign: 'center',
                            align: 'center'
                        },
                        { type: 'input', field: 'vouNo', name: '凭证编号', width: 80, headalign: 'center', align: 'right' },
                        { type: 'input', field: 'descpt', name: '摘要', width: 155, headalign: 'center' },
                        {
                            type: 'money',
                            field: 'amtDr',
                            name: '借方金额',
                            width: 100,
                            headalign: 'center',
                            align: 'right',
                            render: function (rowid, rowdata, data) {
                                if (!data || data == "0.00" || data == 0) {
                                    return '';
                                }
                                return $.formatMoney(data, 2);
                            },
                            onKeyup: function (sdr) {
                                $("#lateBoxmoneyamtCr").val('');
                            }
                        },
                        {
                            type: 'money',
                            field: 'amtCr',
                            name: '贷方金额',
                            width: 100,
                            headalign: 'center',
                            align: 'right',
                            render: function (rowid, rowdata, data) {
                                if (!data || data == "0.00" || data == 0) {
                                    return '';
                                }
                                return $.formatMoney(data, 2);
                            },
                            onKeyup: function (sdr) {
                                $("#lateBoxmoneyamtDr").val('');
                            }
                        },
                        {
                            type: 'treecombox',
                            field: 'setmodeCode',
                            name: '结算方式',
                            width: 110,
                            headalign: 'center',
                            idField: 'setmodeCode',
                            textField: 'setmodeName',
                            data: setmodeData,
                            onChange: function (e) {
                            },
                            beforeExpand: function (e) {
                            },
                            render: function (rowid, rowdata, data) {
                                return rowdata.setmodeName;
                            }
                        },
                        {
                            type: 'treecombox',
                            field: 'billType',
                            name: '票据类型',
                            width: 110,
                            headalign: 'center',
                            idField: 'billType',
                            textField: 'billTypeName',
                            leafRequire: true,
                            data: billTypeData,
                            onChange: function (e) {
                            },
                            beforeExpand: function (e) {
                            },
                            render: function (rowid, rowdata, data) {
                                if (!data) {
                                    return '';
                                }
                                return rowdata.billTypeName;
                            }
                        },
                        {
                            type: 'datepicker',
                            field: 'billDate',
                            name: '票据日期',
                            width: 90,
                            headalign: 'center',
                            align: 'center'
                        },
                        { type: 'input', field: 'billNo', name: '票据号', width: 125, headalign: 'center', align: 'right' },
                        {
                            type: 'treecombox',
                            field: 'acctName',
                            name: '账套',
                            width: 110,
                            headalign: 'center',
                            idField: 'acctCode',
                            textField: 'acctName',
                            data: acctData,
                            onChange: function (e) {
                            },
                            beforeExpand: function (e) {
                            }
                        },
                        {
                            type: 'toolbar',
                            field: 'option',
                            name: '操作',
                            width: 60,
                            headalign: 'center',
                            render: function (rowid, rowdata, data) {
                                if (rowdata.isWdz == 1) {  //手工录入
                                    if (rowdata.isBalanceAcc == 0) { //未对账
                                        var code = rowdata['chrCode'];
                                        return '<a class="btnDel" rowid="' + rowid + '" conid="' + rowdata + '"><span class="icon icon-trash"></span></a>';
                                    } else {
                                        return '';
                                    }
                                } else {
                                    return '';
                                }
                            }
                        }
                    ]];
                    dataOnload = [];
                    page.reqTree(data.journalTableHead, data.journalTableOption, colOnload, dataOnload);
                    var jours = data.journalLs;
                    if (seq) {
                        jours = seqDatas;
                    }
                    if (jours == null || jours.length == 0) {
                        //colOnload[0].push(delOpt);

                        page.initTable('lateBox', dataOnload, colOnload);
                        //重置列
                        // colOnload[0].splice(8)
                    }
                    else {
                        //	colOnload[0].push(delOpt);
                        page.initTable('lateBox', jours, colOnload)
                        // colOnload[0].splice(8)
                    }
                    return false;
                }

                //银行对账单
                var colOnloadOne = [[        //支持多表头
                    { type: 'indexcolumn', field: 'ordSeq', name: '序号', width: 50, headalign: 'center', align: 'center' },
                    {
                        type: 'input',
                        field: 'isBalanceAccName',
                        name: '状态',
                        width: 70,
                        headalign: 'center',
                        align: 'center'
                    },
                    {
                        type: 'datepicker',
                        field: 'statementDate',
                        name: '记账日期',
                        width: 90,
                        headalign: 'center',
                        align: 'center'
                    },
                    { type: 'input', field: 'vouNo', name: '凭证编号', width: 80, headalign: 'center' },
                    { type: 'input', field: 'descpt', name: '摘要', width: 155, headalign: 'center' },
                    {
                        type: 'money',
                        field: 'amtDr',
                        name: '借方金额',
                        width: 100,
                        headalign: 'center',
                        align: 'right',
                        render: function (rowid, rowdata, data) {
                            if (!data || data == "0.00" || data == 0) {
                                return '';
                            }
                            return $.formatMoney(data, 2);
                        },
                        onKeyup: function (sdr) {
                            $("#lateBoxmoneyamtCr").val('');
                        }
                    },
                    {
                        type: 'money',
                        field: 'amtCr',
                        name: '贷方金额',
                        width: 100,
                        headalign: 'center',
                        align: 'right',
                        render: function (rowid, rowdata, data) {
                            if (!data || data == "0.00" || data == 0) {
                                return '';
                            }
                            return $.formatMoney(data, 2);
                        },
                        onKeyup: function (sdr) {
                            $("#lateBoxmoneyamtDr").val('');
                        }
                    },
                    {
                        type: 'treecombox',
                        field: 'setmodeCode',
                        name: '结算方式',
                        width: 110,
                        headalign: 'center',
                        idField: 'setmodeCode',
                        textField: 'setmodeName',
                        data: setmodeData,
                        onChange: function (e) {
                        },
                        beforeExpand: function (e) {
                        },
                        render: function (rowid, rowdata, data) {
                            return rowdata.setmodeName;
                        }
                    },
                    {
                        type: 'treecombox',
                        field: 'billType',
                        name: '票据类型',
                        width: 110,
                        headalign: 'center',
                        idField: 'billType',
                        textField: 'billTypeName',
                        leafRequire: true,
                        data: billTypeData,
                        onChange: function (e) {
                        },
                        beforeExpand: function (e) {
                        },
                        render: function (rowid, rowdata, data) {
                            if (!data) {
                                return '';
                            }
                            return rowdata.billTypeName;
                        }
                    },
                    {
                        type: 'datepicker',
                        field: 'billDate',
                        name: '票据日期',
                        width: 90,
                        headalign: 'center',
                        align: 'center'
                    },
                    { type: 'input', field: 'billNo', name: '票据号', width: 100, headalign: 'center' },
                    {
                        type: 'toolbar',
                        field: 'option',
                        name: '操作',
                        width: 60,
                        headalign: 'center',
                        render: function (rowid, rowdata, data) {
                            if (rowdata.isBalanceAcc == 0) {
                                var code = rowdata['chrCode'];
                                return '<a class="btnDel" rowid="' + rowid + '" conid="' + rowdata + '"><span class="icon icon-trash"></span></a>';
                            }
                            return '';
                        }
                    }
                ]];
                dataOnloadOne = [];
                page.reqTree(data.statementTableHead, data.statementTableOption, colOnloadOne, dataOnloadOne);
                var states = data.statementLs;
                if (seq) {
                    states = seqDatas;
                }
                if (states == null || states.length == 0) {
                    //	colOnloadOne[0].push(delOpt);

                    page.initTable('lateBox', dataOnloadOne, colOnloadOne);
                    // colOnloadOne[0].splice(8)
                }
                else {
                    //	colOnloadOne[0].push(delOpt);
                    page.initTable('lateBox', states, colOnloadOne);
                    // colOnloadOne[0].splice(8)
                }
                // page.calMoney();
            },
            //初始化单位未达项表格
            initTable: function (id, data, col) {
                $('#' + id).ufDatagrid({
                    data: data,
                    //idField: 'chrCode',
                    pId: 'pcode',
                    disabled: false,  //可选择
                    columns: col,
                    initComplete: function (options, data) {
                        $("#lateBoxmoneyamtDr").amtInput();
                        $("#lateBoxmoneyamtCr").amtInput();
                    },
                    //期初的行锁定 不可修改 guohx 20190312
                    lock: { //行锁定
                        class: 'bgc-gray2',
                        filter: function (rowdata) {
                            return rowdata.isBalanceAcc == 1;
                        }
                    }
                })
            },
            transformMoney: function (data) {
                var result;
                if (typeof data == "string") {
                    result = data.replaceAll(',', '');
                } else if (typeof data == "number") {
                    result = data;
                } else {
                    result = 0;
                }
                return result;
            },
            deleteData: function (guidArr, rowidArr, rowData) {
                if (rowData.length > 0) {
                    for (var i = 0; i < rowData.length; i++) {
                        if (rowData[i].isBalanceAcc == 1) {
                            ufma.showTip("所选的对账单数据中包含已对账的数据,不允许删除!", function () {
                            }, "error");
                            return false;
                        }
                    }
                } else {
                    if (rowData.isBalanceAcc == 1) {
                        ufma.showTip("所选的对账单数据中包含已对账的数据,不允许删除!", function () {
                        }, "error");
                        return false;
                    }
                }
                ufma.confirm("您确认删除数据库里的该条对账单吗？", function (action) {
                    if (action) {
                        var guidStr = guidArr.join(",");
                        var argu = {
                            "statementGuidDatas": guidStr
                        };
                        ufma.delete(portList.delBankStatement, argu, function (result) {
                            ufma.showTip(result.msg, function () {
                            }, result.flag);
                            var obj = $('#bankDataGrid').getObj(); //取对象
                            for (var i = 0; i < rowidArr.length; i++) {
                                obj.del(rowidArr[i]);
                            }
                        });
                    }
                }, {
                        type: 'warning'
                    });
            },


            initPage: function () {
                var timeId = setTimeout(function () {
                    var centerH = $('.ufma-layout-up').outerHeight(true) - 100;
                    $('.workspace-center').css({ height: centerH + 'px', 'overflow': 'auto' });
                    $('#lateBox').css({ height: centerH - 50 + 'px'});
                    $('#lateBoxBody').css({ height: centerH - 50 - 30 + 'px'});
                }, 200);
                page.getBillType();
                page.getSetMode();
                page.getAcctCode();
                page.initTable(window.ownerData.tableId, window.ownerData.data, colOnloadInit);
                page.fixedTable();
            },
            onEventListener: function () {
                $("#addRow").on("click", function () {
                    var obj = $("#" + window.ownerData.tableId).getObj();//取对象
                    var newRow = { "isBalanceAccName": "未对账" };
                    var newId = obj.add(newRow);
                    return false;
                });
                $('#btnCancle').click(function () {
                    _close('ok');
                });
                $("#btnSave").on("click", function () {
                    var journal = $("#lateBox").getObj().getData();
                    for (var i = 0; i < journal.length; i++) {
                        journal[i]['amtDr'] = page.transformMoney(journal[i]['amtDr']);
                        journal[i]['amtCr'] = page.transformMoney(journal[i]['amtCr']);
                        journal[i]['ordSeq'] = i + 1;
                        if (window.ownerData.type == "0" && (journal[i]['vouDate'] == null || journal[i]['vouDate'] == '')) {
                            ufma.showTip("第" + (i + 1) + "行日记账未达项日期未填写", function () {
                            }, "warning");
                            return false;
                        } else if (window.ownerData.type == "1" && (journal[i]['statementDate'] == null || journal[i]['statementDate'] == '')) {
                            ufma.showTip("第" + (i + 1) + "行对账单未达项日期未填写", function () {
                            }, "warning");
                            return false;
                        }
                        if ($.isNull(journal[i]['descpt'])) {
                            if (window.ownerData.type == "0") {
                                ufma.showTip("第" + (i + 1) + "行日记账摘要未填写", function () {
                                }, "warning");
                            } else {
                                ufma.showTip("第" + (i + 1) + "行对账单摘要未填写", function () {
                                }, "warning");
                            }
                            return false;
                        }
                        if (journal[i]['amtCr'] == '0.00' && journal[i]['amtDr'] == '0.00') {
                            if (window.ownerData.type == "0") {
                                ufma.showTip("第" + (i + 1) + "行日记账借贷金额未填写", function () {
                                }, "warning");
                            } else {
                                ufma.showTip("第" + (i + 1) + "行对账单借贷金额未填写", function () {
                                }, "warning");
                            }
                            return false;
                        }


                    }
                    //var statement = $("#listBox").getObj().getData();
                    var argu = {
                        schemaGuid: window.ownerData.schemaGuid,
                        bankInit: {
                            agencyAmt: window.ownerData.bankChangeInput,
                            bankAmt: window.ownerData.reconChangeInput
                        },
                        statementLs: []
                    };
                    if (window.ownerData.type == "0") {
                        argu.journalLs = journal;
                        argu.statementLs = window.ownerData.datas.statementLs;
                    } else {
                        argu.journalLs = window.ownerData.datas.journalLs;
                        argu.statementLs = journal;
                    }
                    var callback = function (result) {
                        var data = result.data;
                        ufma.showTip(result.msg, function () {
                            _close("save");
                        }, result.flag);
                        // page.editor.close();
                        $("#journalLsCount").text(data.journalLsCount);
                        $("#journalLsDr").text(data.journalLsDr);
                        $("#journalLsCr").text(data.journalLsCr);
                        $("#statementLsCount").text(data.statementLsCount);
                        $("#statementLsDr").text(data.statementLsDr);
                        $("#statementLsCr").text(data.statementLsCr);

                    };
                    $("#btnSave").attr("disabled", true);
                    ufma.post(beginList.saveBankReconBegin + "?agencyCode=" + window.ownerData.agencyCode, argu, callback);
                    var timeId = setTimeout(function () {
                        $("#btnSave").attr("disabled", false);
                    }, 5000);
                }
                );

                //删除一行
                function deleteOneRow(boxId) {
                    $("#" + boxId).on("mousedown", ".btnDel", function () {
                        var obj = $('#' + boxId).getObj();//取对象
                        var rowid = $(this).attr("rowid");
                        var rowData = obj.getRowByTId(rowid);
                        if (!rowData.hasOwnProperty("opt")) {
                            if (rowData.isBalanceAcc == 1) {
                                ufma.showTip("此数据是已对账数据，不允许删除！");
                                return false;
                            }
                            if (rowData.vouKind == "QC") {
                                ufma.showTip("此数据是期初数据，不允许删除！");
                                return false;
                            }
                            obj.del(rowid);
                            var tableDatas = $('#' + boxId).getObj().getData();
                            page.fixedTable(true, tableDatas);
                        } else {
                            var guid = rowData.opt;
                            var guidArr = [guid];
                            var rowidArr = [rowid];
                            page.deleteData(guidArr, rowidArr);
                        }
                        // page.calMoneyOne();
                    });
                }

                deleteOneRow('lateBox');
                deleteOneRow('listBox');
                
                $("#lateBox").click(function () {
                    $("#lateBox").find('input[name="isBalanceAccName"]').attr('disabled', true);
                });
            },
            // 此方法必须保留
            init: function () {
                reslist = ufma.getPermission();
                ufma.isShow(reslist);
                page.pfData = ufma.getCommonData();
                ufma.parse();
                this.initPage();
                this.onEventListener();
            }
        }
    }
        ();
    page.init();
})
    ;
