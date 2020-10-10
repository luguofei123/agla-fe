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
        saveAsVal: "/prs/asval/saveAsVal",//保存
        getAll: "/prs/asvalset/getAll"//查询
    };

    //获取弹窗返回来的值并set到页面相应的位置
    window.setData = function(data) {
        page.setModelData(data);
    };
    var page = function () {
        return {
            //表格列
            columns:function(){
                var newColumns = [
                    [
                        {
                            type: 'input',
                            field: 'name',
                            width: 240,
                            name: '方案名称',
                            headalign: 'center',
                            align: 'left',
                            onKeyup: function (e) {

                            }
                        },
                        {
                            type: "toolbar",
                            field: 'remark',
                            width: 100,
                            name: '操作',
                            align: 'center',
                            headalign: 'center',
                            render: function (rowid, rowdata, data) {
                                return'<a class="to-up btn btn-icon-only btn-move-up" value="0" data-toggle="tooltip" action= "" title="上移">' +
                                    '<span class="glyphicon icon-arrow-top"></span></a>'+
                                '<a class="to-down btn btn-icon-only btn-move-down" value="0" data-toggle="tooltip" action= "" title="下移">' +
                                    '<span class="glyphicon icon-arrow-bottom"></span></a>'+
                                '<a class="to-del btn btn-icon-only btn-delete" value="0" data-toggle="tooltip" action= "" title="删除">' +
                                    '<span class="glyphicon icon-trash"></span></a>'
                            }
                        }
                    ]
                ];
                return newColumns;
            },
            //渲染表格
            showTable: function (tableData) {
                page.tableObjData = tableData;
                var id = "nameTable";
                $('#' + id).ufDatagrid({
                    // frozenStartColumn: 1, //冻结开始列,从1开始
                    // frozenEndColumn: 1, //冻结结束列
                    data: tableData,
                    disabled: false, // 可选择
                    columns:page.columns() ,
                    initComplete: function (options, data) {
                        //去掉谷歌表单自带的下拉提示
                        // $(document).on("focus","#nameTableinputwageItem",function () {
                        //     $(this).attr("disabled",true);
                        // });
                        // ufma.setBarPos($(window));
                        $("#nameTableBody .uf-grid-body-view tr").eq(1).find("td").eq(0).addClass("blue");
                        //单击方案查询明细
                        $("#nameTableBody td").off().on("click",function () {
                            if(!$(this).closest("tr").hasClass("fixed-row") && $(this).attr("name") !="remark"){
                                var index = $(this).closest("tr").index()-1;
                                var rowData = page.tableObjData[index];
                                var id = rowData.id;
                                page.id = id;
                                $("input[name=schemeName]").val($(this).text());
                                $("td").removeClass("blue");
                                $(this).addClass("blue");
                                //查询这个方案的明细
                                page.getDetail();
                            }
                        })

                    }
                });
                $("#nameTable").getObj().setEnabled(false);
                $('#nameTable').getObj().setBodyHeight(360);
            },
            //表格列
            columnsDetail:function(){
                var newColumns = [
                    [
                        {
                            type: 'indexcolumn',
                            field: 'ordSeq',
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
                            type: 'input',
                            field: 'columnName',
                            width: 200,
                            name: '列名',
                            headalign: 'center',
                            align: 'left',
                            onKeyup: function (e) {

                            }
                        },
                        {
                            type: 'input',
                            field: 'widthValue',
                            width: 60,
                            name: '宽度',
                            headalign: 'center',
                            align: 'left',
                            onKeyup: function (e) {
                                if (e.data !== "") {
                                    var newData = e.data.replace(/[^\d+-]/g,'');
                                    $("#nameTable2inputseqRow").val(newData);
                                }
                            }
                        },
                        {
                            type: 'buttonedit',
                            field: 'formula',
                            name: '运算值',
                            width: 200,
                            headalign: 'center',
                            align: 'left',
                            onBtnClick: function (e) {
                                var rid = e.rowId;
                                var rowData = e.rowData;
                                //revise S
                                var datas = {
                                    rid: rid,
                                    FormulaEditorVal: $("#nameTableDetailbuttoneditformula").find("input[name=formula]").val(),
                                    plusCodes:e.rowData.plusCodes?e.rowData.plusCodes:"1,2",
                                    reduceCodes:e.rowData.reduceCodes?e.rowData.reduceCodes:"3,4",
                                };
                                ufma.setObjectCache("openPlusReduce", datas);
                                $(".u-msg-dialog-top", parent.document).prevAll("#wageSlipPrint").find("#open-plus-reduce").click();
                            }
                        },
                        {
                            type: "toolbar",
                            field: 'remark',
                            width: 100,
                            name: '操作',
                            align: 'center',
                            headalign: 'center',
                            render: function (rowid, rowdata, data) {
                                return'<a class="to-up btn btn-icon-only btn-move-up" value="1" data-toggle="tooltip" action= "" title="上移">' +
                                    '<span class="glyphicon icon-arrow-top"></span></a>'+
                                    '<a class="to-down btn btn-icon-only btn-move-down"value="1" data-toggle="tooltip" action= "" title="下移">' +
                                    '<span class="glyphicon icon-arrow-bottom"></span></a>'+
                                    '<a class="to-del btn btn-icon-only btn-delete"value="1" data-toggle="tooltip" action= "" title="删除">' +
                                    '<span class="glyphicon icon-trash"></span></a>'
                            }
                        }
                    ]
                ];
                return newColumns;
            },
            //渲染明细表格
            showTableDetail: function (tableData) {
                page.tableObjDataDetail = tableData;
                var id = "nameTableDetail";
                $('#' + id).ufDatagrid({
                    // frozenStartColumn: 1, //冻结开始列,从1开始
                    // frozenEndColumn: 1, //冻结结束列
                    data: tableData,
                    disabled: false, // 可选择
                    columns:page.columnsDetail() ,
                    initComplete: function (options, data) {
                        //去掉谷歌表单自带的下拉提示
                        // $(document).on("focus","#nameTableDetailinputcolumnName",function () {
                        //
                        // });
                        // ufma.setBarPos($(window));

                    }
                });
                $('#nameTableDetail').getObj().setBodyHeight(360);
            },
            //获取方案
            getSchemes:function(){
                var data = [
                    {name:"默认方案",id:"1"},
                    {name:"方案一",id:"2"}
                ];
                page.showTable(data);
                page.id = data[0].id;
                $("input[name=schemeName]").val(data[0].name);
                page.getDetail();
            },
            //获取明细
            getDetail:function(){
                var argu = {
                    id:page.id
                };
                // ufma.get("",argu,function (result) {
                //     page.showTableDetail(result.data);
                // });
                var data = [
                    {columnName:"基本工资",widthValue:"100",formula:""},
                    {columnName:"岗位工资",widthValue:"200",formula:""},
                    {columnName:"高温补贴",widthValue:"300",formula:"170"},
                    {columnName:"应发工资合计",widthValue:"400",formula:"基本工资+岗位工资+高温"}
                ];
                if(page.id == "2"){
                    data = [
                        {columnName:"基本工资",widthValue:"100",formula:""},
                        {columnName:"岗位工资",widthValue:"200",formula:""},
                        {columnName:"高温补贴",widthValue:"300",formula:"170"},
                    ];
                }
                page.showTableDetail(data);
            },
            //保存
            save:function(val){
                if($("input[name=schemeName]").val() == ""){
                    ufma.showTip("请填写方案名称",function () {

                    },"warning");
                    return false;
                }
                var tableDatas = $("#nameTableDetail").getObj().getData();
                var id = page.id;
                var argu={};
                if(val == "saveAs"){
                    
                }
                ufma.post("",argu,function () {
                    _close()
                })
            },
            //将弹窗返回的值set到相应的位置
            setModelData:function(data){
                if(data.action){
                    $("#nameTableDetailBody").find(".uf-grid-body-view .uf-grid-table tbody").find("#" + data.action.rid).find("td[name=formula]").text(data.action.val);
                    $("#nameTableDetailbuttoneditformula").find("input[name=formula]").val(data.action.val);
                    $("#nameTableDetailbuttoneditformula").find("input[name=formula]").attr("data-plusCodes", data.action.plusCodes);
                    $("#nameTableDetailbuttoneditformula").find("input[name=formula]").attr("data-reduceCodes", data.action.reduceCodes);
                }
            },
            initPage: function () {
                //权限控制
                page.reslist = ufma.getPermission();
                ufma.isShow(page.reslist);
                page.showTable([]);
                page.showTableDetail([]);
                page.getSchemes();
            },
            onEventListener: function () {
                //关闭
                $("#btn-close").on("click", function () {
                    _close();
                });
                //增行
                $(document).on("mousedown", ".add-row", function () {
                    var obj;
                    if($(this).attr("id") == "addScheme"){
                        obj = $('#nameTable').getObj();
                    }else{
                        obj = $('#nameTableDetail').getObj();
                    }
                    var rowdata = {};
                    obj.add(rowdata);
                    // ufma.isShow(page.reslist);
                });
                //删行
                $(document).on("mousedown", "a.to-del", function () {
                    var rowid = $(this).parents("tr").attr("id");
                    var rowindex = $(this).parents("tr").index();
                    // tgDetaildatahq.splice(rowindex, 1)
                    var obj;
                    if($(this).closest("a").attr("value") == "0"){
                        obj = $('#nameTable').getObj();
                        obj.del(rowid)
                    }else{
                        obj = $('#nameTableDetail').getObj();
                        obj.del(rowid)
                        page.showTableDetail($('#nameTableDetail').getObj().getData())
                    }

                });
                //上移
                $(document).on("mousedown", ".to-up span", function () {
                    $(document).trigger("mousedown");
                    var rowindex = $(this).parents("tr").index() - 1;
                    var changeDatas;
                    if($(this).closest("a").attr("value") == "0"){
                        changeDatas = page.tableObjData;
                    }else{
                        changeDatas = page.tableObjDataDetail;
                    }
                    var key = changeDatas[rowindex];
                    if (rowindex > 0) {
                        changeDatas[rowindex] = changeDatas[rowindex - 1];
                        changeDatas[rowindex - 1] = key;
                        var thistr = $(this).parents("tr");
                        var thistrnext = $(this).parents("tr").prev("tr");
                        thistr.insertBefore(thistrnext);
                    }
                });
                //下移
                $(document).on("mousedown", ".to-down span", function (e) {
                    stopPropagation(e);
                    $(document).trigger("mousedown");
                    var rowindex = $(this).parents("tr").index() - 1;
                    var changeDatas;
                    if($(this).closest("a").attr("value") == "0"){
                        changeDatas = page.tableObjData;
                    }else{
                        changeDatas = page.tableObjDataDetail;
                    }
                    var key = changeDatas[rowindex];
                    if (rowindex < changeDatas.length - 1) {
                        changeDatas[rowindex] = changeDatas[rowindex + 1];
                        changeDatas[rowindex + 1] = key;
                        var thistr = $(this).parents("tr");
                        var thistrnext = $(this).parents("tr").next("tr");
                        thistr.insertAfter(thistrnext);
                    }
                });
                //保存
                $("#btn-sure").on("click",function () {
                    page.save();
                });
                //另存
                $("#btn-sure").on("click",function () {
                    page.save("saveAs");
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