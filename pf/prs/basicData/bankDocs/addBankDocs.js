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
    // console.log(ownerData);
    //接口URL集合
    var interfaceURL = {
        savePrsBankStyleCo: "/prs/prsbankstyleco/savePrsBankStyleCo",//新增保存
        getPrsBankStyleCoByKey:"/prs/prsbankstyleco/getPrsBankStyleCoByKey",//查询单个银行代发文件格式
        updatePrsBankStyleCo:"/prs/prsbankstyleco/updatePrsBankStyleCo",//修改银行代发文件格式
        exportBankTemplateFile:"/prs/prsbankstyleco/exportPrsBankStyleCo",//导出数据
    };
    var pageLength = 25;
    var outTypeData = [
        {outType:"1",outTypeName:"输出日期"},
        {outType:"2",outTypeName:"字符"},
        {outType:"3",outTypeName:"金额汇总"},
        {outType:"4",outTypeName:"记录汇总"},
        {outType:"5",outTypeName:"输出时间"}
    ];
    var numStyleData =[
        {numStyle:"1",numStyleName:"日期无分隔"},
        {numStyle:"2",numStyleName:"日期-分隔"},
        {numStyle:"3",numStyleName:"日期/分隔"},
        {numStyle:"4",numStyleName:"有小数点"},
        {numStyle:"5",numStyleName:"无小数点"}
    ];
    var fillPosnData =[
        {fillPosn:"1",fillPosnName:"前补位"},
        {fillPosn:"2",fillPosnName:"后补位"}
    ];
    /**
     * @description: 处理tableData的方法
     */
    function doTableData(tableData){
        if(tableData && tableData.length > 0){
            tableData.forEach(function(row, index){
                row.pritemOrder = index + 1
                if(row.outType){
                    outTypeData.forEach(function(item){
                        if(row.outType === item.outType){
                            row.outType = item.outTypeName
                        }
                    })
                }
                if(row.numStyle){
                    numStyleData.forEach(function(item){
                        if(row.numStyle === item.numStyle){
                            row.numStyle = item.numStyleName
                        }
                    })
                }
                if(row.fillPosn){
                    fillPosnData.forEach(function(item){
                        if(row.fillPosn === item.fillPosn){
                            row.fillPosn = item.fillPosnName
                        }
                    })
                }
            })
        }
    }
    /**
     * @description: 需要修改 合计项目
     */
    function doTableDataSumCode(tableData){
        if(tableData && tableData.length > 0){
            tableData.forEach(function(row){
                if(row.sumItemCode&&ownerData.usedPritem&&ownerData.usedPritem.length>0){
                    ownerData.usedPritem.forEach(function(item){
                        if(row.sumItemCode === item.sumItemCode){
                            row.sumItemCode = item.sumItemName
                        }
                    })
                }
            })
        }
    }
    /**
     * @description: 需要修改 工资项目代码
     */
    function doTableDataPritemCode(tableData){
        if(tableData && tableData.length > 0){
            tableData.forEach(function(row){
                if(row.pritemCode&&ownerData.psAllItem&&ownerData.psAllItem.length>0){
                    ownerData.psAllItem.forEach(function(item){
                        if(row.pritemCode === item.pritemCode){
                            row.pritemCode = item.pritemName
                        }
                    })
                }
            })
        }
    }
    function download(filename, text) {
        var element = document.createElement('a');
        element.setAttribute('href', filename);
        element.setAttribute('download', text);

        element.style.display = 'none';
        document.body.appendChild(element);

        element.click();

        document.body.removeChild(element);
    }
    var page = function () {
        return {
            //表格列
            recombineColumns1: function () {
                var columns = [
                    [ // 支持多表头
                        {
                            type: 'checkbox',
                            field: '',
                            name: '',
                            width: 50,
                            headalign: 'center',
                            className: 'no-print',
                            align: 'center'
                        },
                        {
                            type: 'indexcolumn',
                            field: 'pritemOrder',
                            width: 40,
                            name: '序号',
                            headalign: 'center',
                            align: 'left',
                            render: function (rowid, rowdata, data) {
                                return data;
                            }
                            // onKeyup: function (e) {
                            //
                            // }
                        },
                        {
                            type: 'combox',
                            field: 'outType',
                            name: '字段类型',
                            // width: 200,
                            headalign: 'center',
                            align: 'center',
                            idField: 'outType',
                            textField: 'outTypeName',
                            pIdField: '',
                            data:outTypeData,
                            render: function (rowid, rowdata, data) {
                                for(var i=0;i<outTypeData.length;i++){
                                    if(outTypeData[i].outType == data){
                                        return outTypeData[i].outTypeName;
                                    }
                                }
                                return data;
                            },
                            onChange: function (e, data) {
                            },
                            beforeExpand: function (e) { //下拉框初始化
                                // $(e.sender).getObj().load(src.itemTypeData);
                            }
                        },
                        {
                            type: 'input',
                            field: 'outLen',
                            // width: 200,
                            name: '输出长度',
                            headalign: 'center',
                            align: 'left',
                            onKeyup: function (e) {
                                if (e.data !== "") {
                                    var newData = e.data.replace(/[^\d+-]/g,'');
                                    $("#nameTable1inputoutLen").val(newData);
                                }

                            }
                        },
                        {
                            type: 'input',
                            field: 'fillChar',
                            // width: 200,
                            name: '补位符',
                            headalign: 'center',
                            align: 'left',
                            render: function (rowid, rowdata, data) {
                                return data;
                            }
                        },
                        {
                            type: 'combox',
                            field: 'numStyle',
                            name: '数据输出格式',
                            // width: 200,
                            headalign: 'center',
                            align: 'center',
                            idField: 'numStyle',
                            textField: 'numStyleName',
                            pIdField: '',
                            data:numStyleData ,
                            render: function (rowid, rowdata, data) {
                                for(var i=0;i<numStyleData.length;i++){
                                    if(numStyleData[i].numStyle == data){
                                        return numStyleData[i].numStyleName;
                                    }
                                }
                                return data;
                            },
                            onChange: function (e, data) {
                            },
                            beforeExpand: function (e) { //下拉框初始化
                                // $(e.sender).getObj().load(src.itemTypeData);
                            }
                        },
                        {
                            type: 'combox',
                            field: 'fillPosn',
                            name: '补位位置',
                            // width: 200,
                            headalign: 'center',
                            align: 'left',
                            idField: 'fillPosn',
                            textField: 'fillPosnName',
                            pIdField: '',
                            data:fillPosnData ,
                            render: function (rowid, rowdata, data) {
                                for(var i=0;i<fillPosnData.length;i++){
                                    if(fillPosnData[i].fillPosn == data){
                                        return fillPosnData[i].fillPosnName;
                                    }
                                }
                                return data;
                            },
                            onChange: function (e, data) {
                            },
                            beforeExpand: function (e) { //下拉框初始化
                                // $(e.sender).getObj().load(src.itemTypeData);
                            }
                        },
                        {
                            type: 'input',
                            field: 'deftVal',
                            // width: 200,
                            name: '默认值',
                            headalign: 'center',
                            align: 'left',
                            render: function (rowid, rowdata, data) {
                                return data;
                            }
                        },
                        {
                            type: 'treecombox',
                            field: 'sumItemCode',
                            name: '合计项目',
                            // width: 200,
                            headalign: 'center',
                            align: 'center',
                            idField: 'sumItemCode',
                            textField: 'sumItemName',
                            pIdField: '',
                            data: ownerData.usedPritem,
                            render: function (rowid, rowdata, data) {
                                for(var i=0;i<ownerData.usedPritem.length;i++){
                                    if(ownerData.usedPritem[i]){
                                        if(ownerData.usedPritem[i].sumItemCode == data){
                                            return ownerData.usedPritem[i].sumItemName;
                                        }
                                    }
                                }
                                return '';
                            },
                            onChange: function (e, data) {
                            },
                            beforeExpand: function (e) { //下拉框初始化
                                // $(e.sender).getObj().load(src.itemTypeData);
                            }
                        }
                    ]
                ];
                return columns;
            },
            //渲染表格
            showTable1: function (tableData) {
                page.tableObjData = tableData;
                var id = "nameTable1";
                $('#' + id).ufDatagrid({
                    data: tableData,
                    disabled: false, // 可选择
                    columns: page.recombineColumns1(),
                    initComplete: function (options, data) {
                    }
                });
            },
            //表格列
            recombineColumns2: function () {
                var columns = [
                    [ // 支持多表头
                        {
                            type: 'checkbox',
                            field: '',
                            name: '',
                            width: 50,
                            headalign: 'center',
                            className: 'no-print',
                            align: 'center'
                        },
                        {
                            type: 'indexcolumn',
                            field: 'pritemOrder',
                            width: 40,
                            name: '序号',
                            headalign: 'center',
                            align: 'left',
                            render: function (rowid, rowdata, data) {
                                return data;
                            }
                            // onKeyup: function (e) {
                            //
                            // }
                        },
                        {
                            type: 'combox',
                            field: 'pritemCode',
                            name: '工资项目代码',
                            // width: 200,
                            headalign: 'center',
                            align: 'left',
                            idField: 'pritemCode',
                            textField: 'pritemName',
                            pIdField: '',
                            data: ownerData.psAllItem,
                            render: function (rowid, rowdata, data) {
                                if (!data) {
                                    return "";
                                }
                                for(var i=0;i<ownerData.psAllItem.length;i++){
                                    if(ownerData.psAllItem[i].pritemCode == data){
                                        return ownerData.psAllItem[i].pritemName;
                                        break
                                    }
                                }
                            },
                            onChange: function (e, data) {
                            },
                            beforeExpand: function (e) { //下拉框初始化
                                // $(e.sender).getObj().load(src.itemTypeData);
                            }
                        },
                        {
                            type: 'input',
                            field: 'fillChar',
                            // width: 200,
                            name: '补位符',
                            headalign: 'center',
                            align: 'left',
                            render: function (rowid, rowdata, data) {
                                return data;
                            }
                        },
                        {
                            type: 'combox',
                            field: 'numStyle',
                            name: '数据输出格式',
                            // width: 200,
                            headalign: 'center',
                            align: 'left',
                            idField: 'numStyle',
                            textField: 'numStyleName',
                            pIdField: '',
                            data: numStyleData,
                            render: function (rowid, rowdata, data) {
                                for(var i=0;i<numStyleData.length;i++){
                                    if(numStyleData[i].numStyle == data){
                                        return numStyleData[i].numStyleName;
                                        break
                                    }
                                }
                                return data;
                            },
                            onChange: function (e, data) {
                            },
                            beforeExpand: function (e) { //下拉框初始化
                                // $(e.sender).getObj().load(src.itemTypeData);
                            }
                        },
                        {
                            type: 'input',
                            field: 'pritemDataLenO',
                            // width: 200,
                            name: '项目数据输出长度',
                            headalign: 'center',
                            align: 'left',
                            onKeyup: function (e) {
                                if (e.data !== "") {
                                    var newData = e.data.replace(/[^\d+-]/g,'');
                                    $("#nameTable2inputpritemDataLenO").val(newData);
                                }

                            }
                        },
                        {
                            type: 'input',
                            field: 'pritemDataDecO',
                            // width: 200,
                            name: '项目数据输出小数长度',
                            headalign: 'center',
                            align: 'left',
                            onKeyup: function (e) {
                                if (e.data !== "") {
                                    var newData = e.data.replace(/[^\d+-]/g,'');
                                    $("#nameTable2inputpritemDataDecO").val(newData);
                                }

                            }
                        },
                        {
                            type: 'combox',
                            field: 'fillPosn',
                            name: '补位位置',
                            // width: 200,
                            headalign: 'center',
                            align: 'left',
                            idField: 'fillPosn',
                            textField: 'fillPosnName',
                            pIdField: '',
                            data: fillPosnData,
                            render: function (rowid, rowdata, data) {
                                for(var i=0;i<fillPosnData.length;i++){
                                    if(fillPosnData[i].fillPosn == data){
                                        return fillPosnData[i].fillPosnName;
                                        break
                                    }
                                }
                                return data;
                            },
                            onChange: function (e, data) {
                            },
                            beforeExpand: function (e) { //下拉框初始化
                                // $(e.sender).getObj().load(src.itemTypeData);
                            }
                        },
                        {
                            type: 'input',
                            field: 'bwChar',
                            // width: 200,
                            name: '前导字符',
                            headalign: 'center',
                            align: 'left',
                            render: function (rowid, rowdata, data) {
                                return data;
                            },
                            onKeyup: function (e) {

                            }
                        },
                        {
                            type: 'input',
                            field: 'ppChar',
                            // width: 200,
                            name: '后置字符',
                            headalign: 'center',
                            align: 'left',
                            render: function (rowid, rowdata, data) {
                                return data;
                            },
                            onKeyup: function (e) {

                            }
                        },
                        {
                            type: 'input',
                            field: 'constValue',
                            // width: 200,
                            name: '常量',
                            headalign: 'center',
                            align: 'left',
                            render: function (rowid, rowdata, data) {
                                return data;
                            },
                            onKeyup: function (e) {
                                if (e.data !== "") {
                                    var newData = e.data.replace(/[^\d+-]/g,'');
                                    $("#nameTable2inputconstValue").val(newData);
                                }

                            }
                        },
                    ]
                ];
                return columns;
            },
            //渲染表格
            showTable2: function (tableData) {
                page.tableObjData = tableData;
                var id = "nameTable2";
                $('#' + id).ufDatagrid({
                    data: tableData,
                    disabled: false, // 可选择
                    columns: page.recombineColumns2(),
                    initComplete: function (options, data) {
                        //去掉谷歌表单自带的下拉提示
                        // $(document).on("focus","input",function () {
                        //     $(this).attr("autocomplete", "off");
                        // });
                    }
                });
            },
            //表格列
            recombineColumns3: function () {
                var columns = [
                    [ // 支持多表头
                        {
                            type: 'checkbox',
                            field: '',
                            name: '',
                            width: 50,
                            headalign: 'center',
                            className: 'no-print',
                            align: 'center'
                        },
                        {
                            type: 'indexcolumn',
                            field: 'pritemOrder',
                            width: 40,
                            name: '序号',
                            headalign: 'center',
                            align: 'left',
                            render: function (rowid, rowdata, data) {
                                return data;
                            }
                            // onKeyup: function (e) {
                            //
                            // }
                        },
                        {
                            type: 'combox',
                            field: 'outType',
                            name: '字段类型',
                            // width: 200,
                            headalign: 'center',
                            align: 'center',
                            idField: 'outType',
                            textField: 'outTypeName',
                            pIdField: '',
                            data: outTypeData,
                            render: function (rowid, rowdata, data) {
                                for(var i=0;i<outTypeData.length;i++){
                                    if(outTypeData[i].outType == data){
                                        return outTypeData[i].outTypeName;
                                        break
                                    }
                                }
                                return data;
                            },
                            onChange: function (e, data) {
                            },
                            beforeExpand: function (e) { //下拉框初始化
                                // $(e.sender).getObj().load(src.itemTypeData);
                            }
                        },
                        {
                            type: 'input',
                            field: 'outLen',
                            // width: 200,
                            name: '输出长度',
                            headalign: 'center',
                            align: 'left',
                            onKeyup: function (e) {
                                if (e.data !== "") {
                                    var newData = e.data.replace(/[^\d+-]/g,'');
                                    $("#nameTable2inputseqColumn").val(newData);
                                }

                            }
                        },
                        {
                            type: 'input',
                            field: 'fillChar',
                            // width: 200,
                            name: '补位符',
                            headalign: 'center',
                            align: 'left',
                            render: function (rowid, rowdata, data) {
                                return data;
                            }
                        },
                        {
                            type: 'combox',
                            field: 'numStyle',
                            name: '数据输出格式',
                            // width: 200,
                            headalign: 'center',
                            align: 'center',
                            idField: 'numStyle',
                            textField: 'numStyleName',
                            pIdField: '',
                            data: numStyleData,
                            render: function (rowid, rowdata, data) {
                                for(var i=0;i<numStyleData.length;i++){
                                    if(numStyleData[i].numStyle == data){
                                        return numStyleData[i].numStyleName;
                                        break
                                    }
                                }
                                return data;
                            },
                            onChange: function (e, data) {
                            },
                            beforeExpand: function (e) { //下拉框初始化
                                // $(e.sender).getObj().load(src.itemTypeData);
                            }
                        },
                        {
                            type: 'combox',
                            field: 'fillPosn',
                            name: '补位位置',
                            // width: 200,
                            headalign: 'center',
                            align: 'left',
                            idField: 'fillPosn',
                            textField: 'fillPosnName',
                            pIdField: '',
                            data: fillPosnData,
                            render: function (rowid, rowdata, data) {
                                for(var i=0;i<fillPosnData.length;i++){
                                    if(fillPosnData[i].fillPosn == data){
                                        return fillPosnData[i].fillPosnName;
                                        break
                                    }
                                }
                                return data;
                            },
                            onChange: function (e, data) {
                            },
                            beforeExpand: function (e) { //下拉框初始化
                                // $(e.sender).getObj().load(src.itemTypeData);
                            }
                        },
                        {
                            type: 'input',
                            field: 'deftVal',
                            // width: 200,
                            name: '默认值',
                            headalign: 'center',
                            align: 'left',
                            render: function (rowid, rowdata, data) {
                                return data;
                            }
                        },
                        {
                            type: 'treecombox',
                            field: 'sumItemCode',
                            name: '合计项目',
                            // width: 200,
                            headalign: 'center',
                            align: 'center',
                            idField: 'sumItemCode',
                            textField: 'sumItemName',
                            pIdField: '',
                            data: ownerData.usedPritem,
                            render: function (rowid, rowdata, data) {
                                for(var i=0;i<ownerData.usedPritem.length;i++){
                                    if(ownerData.usedPritem[i]){
                                        if(ownerData.usedPritem[i].sumItemCode == data){
                                            return ownerData.usedPritem[i].sumItemName;
                                        }
                                    }
                                }
                                return '';
                            },
                            onChange: function (e, data) {
                            },
                            beforeExpand: function (e) { //下拉框初始化
                                // $(e.sender).getObj().load(src.itemTypeData);
                            }
                        }
                    ]
                ];
                return columns;
            },
            //渲染表格
            showTable3: function (tableData) {
                page.tableObjData = tableData;
                var id = "nameTable3";
                $('#' + id).ufDatagrid({
                    data: tableData,
                    disabled: false, // 可选择
                    columns: page.recombineColumns3(),
                    initComplete: function (options, data) {
                        //去掉谷歌表单自带的下拉提示
                        // $(document).on("focus","input",function () {
                        //     $(this).attr("autocomplete", "off");
                        // });
                    }
                });
            },
            //合计项目列表
            getTotalProgram: function () {
                var argu = {};
                ufma.get("", argu, function (result) {
                    page.getTotalProgramData = result.data;
                    page.getTableData1();
                })
            },
            //获取tableDatas1
            getTableData1: function (tableDatas) {
                if (!tableDatas) {
                    tableDatas = [];
                }
                page.showTable1(tableDatas);
            },
            //获取tableDatas2
            getTableData2: function (tableDatas) {
                if (!tableDatas) {
                    tableDatas = [];
                }
                page.showTable2(tableDatas);
            },
            //获取tableDatas3
            getTableData3: function (tableDatas) {
                if (!tableDatas) {
                    tableDatas = [];
                }
                page.showTable3(tableDatas);
            },
            //操作类型
            initOsType: function () {
                var data=[
                    {code:"0",name:"Windows 系列"},
                    {code:"1",name:"Linux/Unix 系列"},
                    {code:"2",name:"Mac OS X 系列"}
                ];
                $("#osType").ufCombox({
                    idField: "code",
                    textField: "name",
                    data: data, //json 数据
                    placeholder: "请选择匹配类型",
                    onChange: function (sender, data) {
                    },
                    onComplete: function (sender) {
                        $("input").attr("autocomplete", "off");
                        $("#osType").getObj().val("0")
                    }
                });
            },
            //查询数据
            getPrsBankStyleCoByKey:function(){
                var argu = {
                    prstylCode:ownerData.prstylCode
                };
                ufma.post(interfaceURL.getPrsBankStyleCoByKey,argu,function (result) {
                    var data = result.data;
                    page.bankData = data;
                    page.setValue(data);
                    page.getTableData1(data.prsBankStyleFirstRowCos);
                    page.getTableData2(data.prsBankStyleMiddleRowCos);
                    page.getTableData3(data.prsBankStyleLastRowCos);
                })
            },
            //修改set值
            setValue: function (data) {
                $('#frmQuery').setForm(data);
            },
            //组织要保存的table参数
            getTableArgu:function(){
                var tableDatas1 = $("#nameTable1").getObj().getData?$("#nameTable1").getObj().getData():[];
                var tableDatas2 = $("#nameTable2").getObj().getData?$("#nameTable2").getObj().getData():[];
                var tableDatas3 = $("#nameTable3").getObj().getData?$("#nameTable3").getObj().getData():[];
                var result = {
                    res:false,
                    prsBankStyleFirstRowCos:[],
                    prsBankStyleMiddleRowCos:[],
                    prsBankStyleLastRowCos:[]
                }
                for(var i=0;i<tableDatas1.length;i++){
                    var obj = {
                        deftVal:tableDatas1[i].deftVal,
                        fillChar:tableDatas1[i].fillChar,
                        fillPosn:tableDatas1[i].fillPosn,
                        numStyle:tableDatas1[i].numStyle,
                        outLen:tableDatas1[i].outLen,
                        outType:tableDatas1[i].outType,
                        pritemOrder:i+1,
                        sumItemCode:tableDatas1[i].sumItemCode
                    };
                    if(ownerData.action == "edit"){
                        obj.createUser = tableDatas1[i].createUser;
                        obj.createDate = tableDatas1[i].createDate;
                    }
                    result.prsBankStyleFirstRowCos.push(obj)
                }
                for(var i=0;i<tableDatas2.length;i++){
                    if(tableDatas2[i].pritemCode == ""){
                        ufma.showTip("请填写 中间行设置 页签的第 "+(i+1)+" 行的 工资项目代码",function () {

                        },"warning");
                        result.res = true;
                        break
                    }else if(tableDatas2[i].numStyle == ""){
                        ufma.showTip("请填写 中间行设置 页签的第 "+(i+1)+" 行的 输出数据格式",function () {

                        },"warning");
                        result.res = true;
                        break
                    }else if(tableDatas2[i].pritemDataLenO == ""){
                        ufma.showTip("请填写 中间行设置 页签的第 "+(i+1)+" 行的 项目数据输出长度",function () {

                        },"warning");
                        result.res = true;
                        break
                    }
                    var obj = {
                        bwChar:tableDatas2[i].bwChar,
                        constValue:tableDatas2[i].constValue,
                        fillChar:tableDatas2[i].fillChar,
                        fillPosn:tableDatas2[i].fillPosn,
                        numStyle:tableDatas2[i].numStyle,
                        ppChar:tableDatas2[i].ppChar,
                        pritemCode:tableDatas2[i].pritemCode,
                        // pritemDataDec:tableDatas2[i].pritemDataDec,
                        pritemDataDecO:tableDatas2[i].pritemDataDecO,
                        // pritemDataLen:tableDatas2[i].pritemDataLen,
                        pritemDataLenO:tableDatas2[i].pritemDataLenO,
                        pritemDataType:tableDatas2[i].pritemDataType,
                        pritemOrder:i+1
                    };
                    if(ownerData.action == "edit"){
                        obj.createUser = tableDatas2[i].createUser;
                        obj.createDate = tableDatas2[i].createDate;
                    }
                    result.prsBankStyleMiddleRowCos.push(obj);
                }
                for(var i=0;i<tableDatas3.length;i++){
                    var obj = {
                        deftVal:tableDatas3[i].deftVal,
                        fillChar:tableDatas3[i].fillChar,
                        fillPosn:tableDatas3[i].fillPosn,
                        numStyle:tableDatas3[i].numStyle,
                        outLen:tableDatas3[i].outLen,
                        outType:tableDatas3[i].outType,
                        pritemOrder:i+1,
                        sumItemCode:tableDatas3[i].sumItemCode
                    };
                    if(ownerData.action == "edit"){
                        obj.createUser = tableDatas3[i].createUser;
                        obj.createDate = tableDatas3[i].createDate;
                    }
                    result.prsBankStyleLastRowCos.push(obj);
                }
                return result;

            },
            initPage: function () {
                //权限控制
                page.reslist = ufma.getPermission();
                ufma.isShow(page.reslist);
                page.getTableData1();//调用接口时注释掉
                page.getTableData2();
                page.getTableData3();
                page.initOsType();
                if(ownerData.action == "edit"){
                    page.getPrsBankStyleCoByKey();
                    $("input[name=prstylCode]").attr("disabled",true)
                }


            },
            onEventListener: function () {
                // 去掉谷歌表单自带的下拉提示
                $(document).on("focus","input",function () {
                    $(this).attr("autocomplete", "off");
                });
                //关闭
                $("#btn-close").on("click", function () {
                    _close();
                });
                //确定
                $("#btn-sure").on("click", function () {
                    var argu = $('#frmQuery').serializeObject();
                    //校验
                    if (argu.prstylCode == "") {
                        ufma.showTip("请填写银行代发文件格式代码", function () {

                        }, "warning");
                        return false
                    } else if (argu.prstylName == "") {
                        ufma.showTip("请填写银行代发文件格式名称", function () {

                        }, "warning");
                        return false
                    } else if (argu.osType == "") {
                        ufma.showTip("请写银行接收端操作系统类型", function () {

                        }, "warning");
                        return false
                    }
                    var tableRes = page.getTableArgu();
                    if(tableRes.res){
                        return false
                    }

                    argu.prsBankStyleFirstRowCos = tableRes.prsBankStyleFirstRowCos;
                    argu.prsBankStyleMiddleRowCos = tableRes.prsBankStyleMiddleRowCos;
                    argu.prsBankStyleLastRowCos = tableRes.prsBankStyleLastRowCos;
                    var url = interfaceURL.savePrsBankStyleCo;
                    if(ownerData.action == "edit"){
                        url = interfaceURL.updatePrsBankStyleCo;
                        argu.createUser = page.bankData.createUser;
                        argu.createDate = page.bankData.createDate;
                    }
                    ufma.post(url, argu, function (result) {
                        var closeData = {
                            msg:result.msg,
                            flag:result.flag,
                            action:"save"
                        };
                        _close(closeData);
                    })
                });
                // 导入模板
                $("#btn-import").on("click", function () {
                    $("#import-files").click();
                })
                // 当表单文件有变化时执行提交动作
                $('#import-files').on('change', function(){
                    var files = $(this)[0].files;
                    var fileName = files[0].name
                    var ext = fileName.slice(fileName.lastIndexOf(".")+1).toLowerCase();
                    if ("xls" != ext) {
                        alert("只能上传Excle文件");
                        return false;
                    }
                    var formData = new FormData()
                    formData.append("excel_file", files[0]);
                    //添加单位年度区划
                    formData.append("setYear", svData.svSetYear);
                    formData.append("rgCode", svData.svRgCode);
                    if(page.bankData){
                        formData.append("agencyCode", page.bankData.agencyCode);
                    }else{
                        formData.append("agencyCode", svData.svAgencyCode);
                    }
                    ufma.showloading()
                    $.ajax({
                        url: '/prs/prsbankstyleco/importPrsBankStyleCo',
                        type: 'POST',
                        data: formData,
                        cache: false,
                        processData: false,
                        contentType: false,
                        success: function(res){
                            if(res.flag === 'success'){
                                ufma.hideloading()
                                var data = res.data;
                                if(!page.bankData){ page.bankData = {} }
                                page.bankData.prsBankStyleFirstRowCos = data.prsBankStyleFirstRowCos
                                page.bankData.prsBankStyleMiddleRowCos = data.prsBankStyleMiddleRowCos
                                page.bankData.prsBankStyleLastRowCos = data.prsBankStyleLastRowCos
                                page.getTableData1(data.prsBankStyleFirstRowCos);
                                page.getTableData2(data.prsBankStyleMiddleRowCos);
                                page.getTableData3(data.prsBankStyleLastRowCos);
                                // page.getPrsBankStyleCoByKey()
                                ufma.showTip(res.msg, function(){},res.flag)
                                if (res.data.errNameMsg) {
                                    ufma.showTip(res.flag.data.errNameMsg, function(){},'error')
                                }
                            }else{
                                ufma.showTip(res.msg, function(){},'error')
                            }
                            var obj = document.getElementById('import-files');
                            obj.value = ''
                        },
                        error: function(error){
                            console.log(error)
                            ufma.hideloading()
                            var obj = document.getElementById('import-files');
                            obj.value = ''
                        }
                    })
                });
                $("#btn-export").on("click", function () {
                    ufma.showloading()
                    var argu = $('#frmQuery').serializeObject();
                    var tableDatas1  = $("#nameTable1").getObj().getData();
                    var tableDatas2  = $("#nameTable2").getObj().getData();
                    var tableDatas3  = $("#nameTable3").getObj().getData();
                    argu.setYear = svData.svSetYear;
                    argu.rgCode = svData.svRgCode;
                    argu.agencyCode = svData.svAgencyCode
                    if(page.bankData){
                        argu.agencyCode = page.bankData.agencyCode
                        argu.prBankCode = page.bankData.prBankCode
                        argu.prBankName = page.bankData.prBankName
                        argu.createUser = page.bankData.createUser
                        argu.createDate = page.bankData.createDate
                        argu.latestOpUser = page.bankData.latestOpUser
                        argu.latestOpDate = page.bankData.latestOpDate
                    }

                    //CWYXM-12390  后端要求输出表格展示内容 前端需要在遍历一遍combox的单元格 重新赋值为文字内容
                    doTableData(tableDatas1)
                    doTableData(tableDatas2)
                    doTableData(tableDatas3)
                    //tableDatas1 和 tableDatas3需要修改 合计项目
                    doTableDataSumCode(tableDatas1)
                    doTableDataSumCode(tableDatas3)
                    //tableDatas2 需要修改 工资项目代码
                    doTableDataPritemCode(tableDatas2)

                    argu.prsBankStyleFirstRowCos = tableDatas1;
                    argu.prsBankStyleMiddleRowCos = tableDatas2;
                    argu.prsBankStyleLastRowCos = tableDatas3;
                    ufma.post(interfaceURL.exportBankTemplateFile, {prsBankStyleCo: argu}, function (result) {
                        ufma.hideloading()
                        window.location.href = '/pub/file/download?fileName=' + result.data.fileName + '&attachGuid=' + result.data.attachGuid;
                    });
                });
                //增行
                $(document).on("mousedown", ".btn-add-row", function () {
                    var btnValue = $(this).attr("data-value");
                    var rowdata = {};
                    var obj = $('#nameTable' + (parseInt(btnValue) + 1)).getObj();
                    obj.add(rowdata);
                    // ufma.isShow(page.reslist);
                });
                //删行
                $(document).on("click", ".btn-del-row", function () {
                    var index = $(".nav-tabs li.active").index();
                    var checkData, $check, obj, talbeFun;
                    if (index == 0) {
                        talbeFun = page.showTable1;
                        obj = $('#nameTable1').getObj();
                        checkData = obj.getCheckData();
                        $check = $('#nameTable1').find(".check-item:checked");
                    } else if (index == 1) {
                        talbeFun = page.showTable2;
                        obj = $('#nameTable2').getObj();
                        checkData = obj.getCheckData();
                        $check = $('#nameTable2').find(".check-item:checked");
                    } else if (index == 2) {
                        talbeFun = page.showTable3;
                        obj = $('#nameTable3').getObj();
                        checkData = obj.getCheckData();
                        $check = $('#nameTable3').find(".check-item:checked");
                    }

                    if ($check.length == 0) {
                        ufma.showTip("请选择要删除的数据", function () {

                        }, "warning");
                        return false;
                    }
                    for (var i = 0; i < checkData.length; i++) {
                        var rowid = $check.eq(i).attr("rowid");
                        obj.del(rowid);
                    }
                    talbeFun(obj.getData());
                });
                //tab切换
                $(".nav-tabs li").on("click", function () {
                    var index = $(this).index();
                    $(".nav-content").eq(index).removeClass("hidden").siblings(".nav-content").addClass("hidden");
                    var nameTableData = [];
                    if (index == 0) {
                        if ($("#nameTable1").getObj().getData) {
                            nameTableData = $("#nameTable1").getObj().getData();
                        }
                        page.getTableData1(nameTableData);
                    } else if (index == 1) {
                        if ($("#nameTable2").getObj().getData) {
                            nameTableData = $("#nameTable2").getObj().getData();
                        }
                        page.getTableData2(nameTableData);
                    } else if (index == 2) {
                        if ($("#nameTable3").getObj().getData) {
                            nameTableData = $("#nameTable3").getObj().getData();
                        }
                        page.getTableData3(nameTableData);
                    }
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
