$(function () {
    //open弹窗的关闭方法
    window._close = function (action) {
        if (window.closeOwner) {
            var data = {action: action};
            window.closeOwner(data);
        }
    };
    var svData = ufma.getCommonData();

    //接口URL集合
    var interfaceURL = {
        selectPrsExcelStyleEmp:"/prs/sys/prsExcelStyleEmp/selectPrsExcelStyleEmp",//查询页面数据
        delPrsExcelStyleEmp:"/prs/sys/prsExcelStyleEmp/delPrsExcelStyleEmp",//删除
        getAgencyTree:"/prs/prsAgency/getAgencyTree",//下发树"
        sendPrsEmpExcelStyle:"/prs/sys/prsExcelStyleEmp/sendPrsEmpExcelStyle",//下发
        removeAllPrsExcelStyleEmpCoList:"/prs/sys/prsExcelStyleEmp/removeAllPrsExcelStyleEmpCoList"//清空
    };
    if($("body").attr("data-code")){
        interfaceURL.delPrsExcelStyleEmp = "/prs/base/prsExcelStyleEmpCo/delPrsExcelStyleEmpCo";
        interfaceURL.selectPrsExcelStyleEmp="/prs/base/prsExcelStyleEmpCo/selectPrsExcelStyleEmpCo"
    }

    var pageLength = 100;

    var page = function () {
        return {
            //表格列
            columns:function(){
                var columns = [
                    {
                        title: '<label class="mt-checkbox mt-checkbox-single mt-checkbox-outline">' +
                            '<input type="checkbox" id="th-check" class="datatable-group-checkable" data-set="#data-table .checkboxes" />' +
                            '&nbsp;<span></span></label>',
                        className: "nowrap check-style",
                        width:30,
                        data: null,
                        "render": function (data, type, rowdata, meta) {
                            return '<label class="mt-checkbox mt-checkbox-single mt-checkbox-outline"> ' +
                                '<input type="checkbox" class="checkboxes" data-id="' + data.id + '" />' +
                                '&nbsp;<span></span></label>';
                        }
                    },
                    {
                        title: "格式名称",
                        data: "name",
                        className: "isprint nowrap ellipsis",
                        render: function (data, type, rowdata, meta) {
                            if (!data) {
                                return "";
                            }
                            // return '<a href="" class="edit-row-data" data-id="'+rowdata.id+'" style="color: #108ee9">'+data+'</a>';
                            return data;
                        }
                    },
                    {
                        title: "匹配类型",
                        data: "matchitem",
                        className: "isprint nowrap ellipsis",
                        render: function (data, type, rowdata, meta) {
                            if (data == "1") {
                                return "姓名";
                            }else if(data == "2"){
                                return "人员编号";
                            }else if(data == "3"){
                                return "身份证号";
                            }
                            return data;
                        }
                    },
                    {
                        title: "对应列序号",
                        data: "matchcolumnindex",
                        className: "isprint nowrap ellipsis",
                        render: function (data, type, rowdata, meta) {
                            if (!data) {
                                return "";
                            }
                            return data;
                        }
                    },
                    {
                        title: "导入开始行",
                        data: "datarowindex",
                        className: "isprint nowrap ellipsis",
                        render: function (data, type, rowdata, meta) {
                            if (!data) {
                                return "";
                            }
                            return data;
                        }
                    },
                    {
                        title: "导入页签号",
                        data: "sheetid",
                        className: "isprint nowrap ellipsis",
                        render: function (data, type, rowdata, meta) {
                            if (!data) {
                                return "";
                            }
                            return data;
                        }
                    },
                    {
                        title: "是否计算",
                        data: "isNeedCalc",
                        className: "isprint nowrap ellipsis",
                        render: function (data, type, rowdata, meta) {
                            if (data == "Y") {
                                return "是";
                            }else if(data == "N"){
                                return "否";
                            }
                            return data;
                        }
                    },
                    {
                        title: "操作",
                        className: "nowrap minW",
                        data: null,
                        width: 120,
                        "render": function (data, type, rowdata, meta) {
                            return '<a class="btn btn-icon-only btn-edit edit-row-data btn-permission" data-id="'+rowdata.id+'" data-toggle="tooltip" action= "" title="修改">' +
                                '<span class="glyphicon icon-edit"></span></a>' +
                                '<a class="btn btn-icon-only btn-delete btn-permission" data-id="'+rowdata.id+'" data-toggle="tooltip" action= "" title="删除">' +
                                '<span class="glyphicon icon-trash"></span></a>'
                        }
                    }

                ];
                return columns;
            },
            //初始化表格
            initTable:function (data) {
                var id = "mainTable";
                var toolBar = $('#' + id).attr('tool-bar');
                page.DataTable = $('#' + id).DataTable({
                    "language": {
                        "url": bootPath + "agla-trd/datatables/datatable.default.js"
                    },
                    "data": data,
                    "searching": true,
                    "bFilter": false, //去掉搜索框
                    "bLengthChange": true, //去掉每页显示多少条数据
                    "processing": true, //显示正在加载中
                    "pagingType": "full_numbers", //分页样式
                    "lengthChange": true, //是否允许用户自定义显示数量p
                    "lengthMenu": [
                        [25, 50, 100, -1],
                        [25, 50, 100, "全部"]
                    ],
                    "pageLength": pageLength,
                    "bInfo": true, //页脚信息
                    "bSort": false, //排序功能
                    "bAutoWidth": false, //表格自定义宽度，和swidth一起用
                    "bProcessing": true,
                    "bDestroy": true,
                    "columns": page.columns(),
                    // "columnDefs": columnDefsArr,
                    // "fixedColumns":{
                    //     rightColumns: 1
                    // },
                    // "dom": 'rt<"' + id + '-paginate"ilp>',
                    // "dom": '<"printButtons"B>rt<"' + id + '-paginate"ilp>',
                    "dom":'<"datatable-toolbar"B>rt<"' + id + '-paginate"ilp>',
                    "buttons": [{
                        extend: 'print',
                        text: '<i class="glyphicon icon-print" aria-hidden="true"></i>',
                        exportOptions: {
                            columns: '.isprint'
                        },
                        customize: function (win) {
                            $(win.document.body).find('h1').css("text-align", "center");
                            $(win.document.body).css("height", "auto");
                        }
                    },
                        {
                            extend: 'excelHtml5',
                            text: '<i class="glyphicon icon-upload" aria-hidden="true"></i>',
                            exportOptions: {
                                columns: '.isprint'
                            },
                            customize: function (xlsx) {
                                var sheet = xlsx.xl.worksheets['sheet1.xml'];
                            }
                        }
                    ],
                    "initComplete": function (settings, json) {
                        //打印&导出按钮
                        $('.datatable-toolbar').appendTo('#dtToolbar');
                        // $('#datatables-print').html('');
                        // $('#datatables-print').append($(".datatable-toolbar"));
                        $(".datatable-toolbar .buttons-print").addClass("btn-print btn-permission").attr({
                            "data-toggle": "tooltip",
                            "title": "打印"
                        });
                        $(".datatable-toolbar .buttons-excel").addClass("btn-export btn-permission").attr({
                            "data-toggle": "tooltip",
                            "title": "导出"
                        });

                        //驻底begin
                        var toolBar = $(this).attr('tool-bar');
                        var $info = $(toolBar + ' .info');
                        if ($info.length == 0) {
                            $info = $('<div class="info"></div>').appendTo($(toolBar + ' .tool-bar-body'));
                        }
                        $info.html('');
                        $('.' + id + '-paginate').appendTo($info);

                        //导出begin
                        $("#dtToolbar .buttons-excel").off().on('click', function(evt) {
                            evt = evt || window.event;
                            evt.preventDefault();
                            ufma.expXLSForDatatable($('#' + id), '人员信息导入格式');
                        });
                        //导出end

                        $('#mainTable_wrapper').ufScrollBar({
                            hScrollbar: true,
                            mousewheel: false
                        });
                        ufma.setBarPos($(window));
                        //驻底end


                        //checkbox的全选操作
                        $('.datatable-group-checkable').on("change", function () {
                            var isCorrect = $(this).is(':checked');
                            $('#' + id + ' .checkboxes').each(function () {
                                isCorrect ? $(this).prop("checked", !0) : $(this).prop("checked", !1);
                                isCorrect ? $(this).closest("tr").addClass("selected") : $(this).closest("tr").removeClass("selected");
                            });
                            $('.datatable-group-checkable').prop("checked", isCorrect);
                        });

                        ufma.isShow(page.reslist);
                        $('.datatable-toolbar [data-toggle="tooltip"]').tooltip();
                    },
                    "drawCallback": function (settings) {
                        if(data.length > 0){
                            $("#" + id).fixedColumns({
                                rightColumns: 1,//锁定右侧一列
                                // leftColumns: 1//锁定左侧一列
                            });
                        }
                        $("#mainTable").find("td.dataTables_empty").text("").append('<img src="' + bootPath + 'images/noData.png"/><br/><i>目前还没有你要查询的数据</i>');

                        //权限控制
                        ufma.isShow(page.reslist);
                        ufma.setBarPos($(window));
                        $('#mainTable_wrapper').ufScrollBar("update");
                    }
                });
            },
            //数据
            getSearchData:function(){
                var argu = {
                    rgCode:svData.svRgCode,
                    setYear:svData.svSetYear,
                    agencyCode:svData.svAgencyCode
                };
                var queryData = $('#frmQuery').serializeObject()
                for (var key in queryData) {
                  if (queryData.hasOwnProperty(key)) {
                    argu[key] = queryData[key].trim()
                  }
                }
                if($("body").attr("data-code")){
                    argu.agencyCode = svData.svAgencyCode
                }
                ufma.showloading("正在加载数据请耐心等待...");
                ufma.post(interfaceURL.selectPrsExcelStyleEmp,argu,function (result) {
                    ufma.hideloading();
                    var data = result.data;
                    page.DataTable.clear().draw()
                    if(data.length > 0){
                        page.DataTable.rows.add(data)
                        page.DataTable.columns.adjust().draw()
                    }
                    $('#mainTable_wrapper')
                      .ufScrollBar({
                        hScrollbar: true,
                        mousewheel: false
                      })
                    ufma.setBarPos($(window))

                    page.cancelCheckAll()
                    // page.initTable(data);
                })
                // page.initTable([]);
            },
            //打开弹窗
            openWin:function(ele){
                var title,openData;
                if(ele[0].id == "btn-add-value"){
                    title ="新增人员导入格式";
                    openData ={
                        action:"add"
                    };
                }else{
                    title = "修改人员导入格式";
                    var rowId = ele.attr("data-id");
                    openData ={
                        rowId:rowId,
                        action:"edit"
                    };
                }
                if($("body").attr("data-code")){
                    openData.isAgency = true
                }
                ufma.open({
                    url: 'addEmployeeImport.html',
                    title: title,
                    width: 1090,
                    //height:500,
                    data: openData,
                    ondestory: function (data) {
                        //窗口关闭时回传的值
                        if (data.action) {
                            if(data.action.action == "save"){
                                ufma.showTip(data.action.msg,function(){},data.action.flag)
                            }
                            page.getSearchData();
                        }
                    }
                });
            },
            //删除传参
            delArgu:function(ele){
                var argu = {
                    ids:[]
                };
                if(ele[0].id == "tool-bar-del"){
                    var checks = $("input.checkboxes:checked");
                    checks.each(function () {
                        var rowId = $(this).attr("data-id");
                        argu.ids.push(rowId);
                    })

                }else{
                    argu.ids.push(ele.attr("data-id"))
                }
                return argu;
            },
            //删除
            delValues:function(ele){
                var argu = page.delArgu(ele);
                if(argu.ids.length == 0){
                    ufma.showTip("请选择要删除的数据",function () {

                    },"warning");
                    return false;
                }
                ufma.confirm('您确定要删除选中的数据吗？', function (action) {
                    if (action) {
                        //点击确定的回调函数
                        ufma.showloading("正在加载数据请耐心等待...");
                        ufma.post(interfaceURL.delPrsExcelStyleEmp,argu,function (result) {
                            ufma.hideloading();
                            ufma.showTip(result.msg,function () {
                                
                            },result.flag)
                            page.getSearchData();
                        })
                    }else{
                        //点击取消的回调函数
                    }
                },{type:'warning'});
            },
            cancelCheckAll: function() {
				$("#checkAll,.datatable-group-checkable").prop("checked", false);
			},
            //获取勾选的数据
            getCheckedRows:function(){
                var checks = $('input.checkboxes:checked')
                var ids = []
                checks.each(function() {
                  var id = $(this).attr('data-id')
                  ids.push(id)
                })
                return ids
            },
            //初始化匹配类型
            initMatchitem: function () {
                var data=[
                    { code: "姓名", name: "姓名" },
                    { code: "人员编号", name: "人员编号" },
                    { code: "身份证号", name: "身份证号" }
                ];
                $("#matchitem").ufCombox({
                    idField: "code",
                    textField: "name",
                    data: data, //json 数据
                    placeholder: "请选择匹配类型",
                    onChange: function (sender, data) {
                    },
                    onComplete: function (sender) {
                        // $("input").attr("autocomplete", "off");
                    }
                });
            },
            initPage: function () {
                //权限控制
                page.reslist = ufma.getPermission();
                ufma.isShow(page.reslist);
                page.initMatchitem()
                //初始化表格
                page.initTable([]);
                page.getSearchData();
            },
            onEventListener: function () {
                //表格单行选中
                $(document).on("click", "tbody tr", function (e) {
                    stopPropagation(e);
                    if($("td.dataTables_empty").length > 0){
                        return false;
                    }
                    var inputDom = $(this).find('input.checkboxes');
                    var inputCheck = $(inputDom).prop("checked");
                    $(inputDom).prop("checked", !inputCheck);
                    $(this).toggleClass("selected");
                    var $tmp = $(".checkboxes:checkbox");
                    $(".datatable-group-checkable").prop("checked", $tmp.length == $tmp.filter(":checked").length);

                    return false;
                });
                //新增
                $(document).on("click","#btn-add-value",function () {
                    page.openWin($(this));
                });
                //修改
                $(document).on("click","a.edit-row-data",function (e) {
                    stopPropagation(e);
                    page.openWin($(this));
                });
                //删除
                $(document).on("click","a.btn-delete",function () {
                    page.delValues($(this))
                });
                //删除
                $(document).on("click","#tool-bar-del",function () {
                    page.delValues($(this))
                });
                //查询
                $("#btnQuery").on("click",function () {
                    page.getSearchData();
                })
                //下发
                $('#tool-bar-sendown').on('click', function (e) {
                    stopPropagation(e);
                    var gnflData = page.getCheckedRows();
                    if (gnflData.length == 0) {
                        gnflData=page.DataTable.data();
                    }
                    page.modal = ufma.selectBaseTree({
                        url: interfaceURL.getAgencyTree,
                        rootName: '所有单位',
                        title: '选择下发单位',
                        bSearch: true, //是否有搜索框
                        checkAll:true,//是否有全选
                        // filter: { //其它过滤条件
                        //     '单位性质': { //标签
                        //         ajax: '/ma/pub/enumerate/AGENCY_TYPE_CODE', //地址
                        //         formControl: 'combox', //表单元素
                        //         data: {
                        //             rgCode: ma.rgCode,
                        //             setYear: ma.setYear
                        //         },
                        //         idField: 'ENU_CODE',
                        //         textField: 'ENU_NAME',
                        //         filterField: 'agencyType',
                        //     }
                        // },
                        buttons: { //底部按钮组
                            '确认下发': {
                                class: 'btn-primary',
                                action: function (data) {
                                    if (data.length == 0) {
                                        ufma.alert('请选择单位！', 'warning');
                                        return false;
                                    }
                                    var argu = {
                                        "ids": [],
                                        "agencyList": []
                                    };
                                    for(var i=0;i<data.length;i++){
                                        var obj = {toAgencyCode:data[i].code};
                                        argu.agencyList.push(obj)
                                    }
                                    if (gnflData.length !== 0) {
                                        argu.ids = gnflData
                                    } else {
                                        var tableDatas = page.DataTable.data();
                                        for(var i=0;i<tableDatas.length;i++){
                                            argu.ids.push(tableDatas[i].id);
                                        }
                                    }
                                    $(".btn").attr("disabled",true);
                                    ufma.showloading("正在加载数据，请耐心等待...");
                                    ufma.post(interfaceURL.sendPrsEmpExcelStyle, argu, function (result) {
                                        ufma.hideloading();
                                        $(".btn").attr("disabled",false);
                                        ufma.showTip(result.msg, function () { }, result.flag);
                                        page.modal.close();
                                        //下发后取消全选
                                    $(".datatable-group-checkable,.checkboxes").prop("checked", false);
                                    $("#mainTable").find("tbody tr.selected").removeClass("selected");
                                    });
                                    var timeId = setTimeout(function(){
                                        clearTimeout(timeId);
                                        $(".btn").attr("disabled",false);
                                    },"5000")
                                    
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
                });
                //清空
                $("#tool-bar-empty").on("click",function (e) {
                    ufma.confirm('本操作将删除所有单位的人员信息导入格式，是否继续？', function (action) {
                        if (action) {
                            //点击确定的回调函数
                            ufma.showloading("正在加载数据请耐心等待...");
                            ufma.get(interfaceURL.removeAllPrsExcelStyleEmpCoList,"",function (result) {
                                ufma.hideloading();
                                ufma.showTip(result.msg,function () {

                                },result.flag);
                                page.getSearchData();
                            })
                        }else{
                            //点击取消的回调函数
                        }
                    },{type:'warning'});
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
