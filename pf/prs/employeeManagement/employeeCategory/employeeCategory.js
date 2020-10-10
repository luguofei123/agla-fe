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
        selectEmpClass: "/prs/emp/EmpClass/selectEmpClass",//查询
        delEmpClass: "/prs/emp/EmpClass/delEmpClass",//删除人员类别
        able: "/prs/emp/EmpClass/able",//停用/启用
    };
    var pageLength = 25;

    var page = function () {
        return {
            //表格列
            columns: function () {
                var columns = [
                    {
                        title: '<label class="mt-checkbox mt-checkbox-single mt-checkbox-outline">' +
                            '<input type="checkbox" id="th-check" class="datatable-group-checkable" data-set="#data-table .checkboxes" />' +
                            '&nbsp;<span></span></label>',
                        className: "nowrap check-style",
                        width: 30,
                        data: null,
                        "render": function (data, type, rowdata, meta) {
                            return '<label class="mt-checkbox mt-checkbox-single mt-checkbox-outline"> ' +
                                '<input type="checkbox" class="checkboxes" data-id="' + rowdata.classCode + '" />' +
                                '&nbsp;<span></span></label>';
                        }
                    },
                    {
                        title: "类别代码",
                        data: "classCode",
                        className: "isprint nowrap ellipsis",
                        render: function (data, type, rowdata, meta) {
                            if (!data) {
                                return "";
                            }
                            return data;
                        }
                    },
                    {
                        title: "类别名称",
                        data: "className",
                        className: "isprint nowrap ellipsis",
                        render: function (data, type, rowdata, meta) {
                            if (!data) {
                                return "";
                            }
                            return data;
                        }
                    },
                    {
                        title: "排序号",
                        data: "ordIndex",
                        className: "isprint nowrap ellipsis",
                        render: function (data, type, rowdata, meta) {
                            if (!data) {
                                return "";
                            }
                            return data;
                        }
                    },
                    {
                        title: "是否启用",
                        data: "isUsed",
                        className: "isprint nowrap ellipsis",
                        render: function (data, type, rowdata, meta) {
                            if (data == "Y") {
                                return "是";
                            } else if (data == "N") {
                                return "否";
                            }
                            return data;
                        }
                    },
                    {
                        title: "系统预置",
                        data: "isSys",
                        className: "isprint nowrap ellipsis",
                        render: function (data, type, rowdata, meta) {
                            if (data == "Y") {
                                return "是";
                            } else if (data == "N") {
                                return "否";
                            }
                            return data;
                        }
                    },
                    {
                        title: "是否控制编制人数",
                        data: "isLimit",
                        className: "isprint nowrap ellipsis",
                        render: function (data, type, rowdata, meta) {
                            if (data == "Y") {
                                return "是";
                            } else if (data == "N") {
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
                            var newRowData = JSON.stringify(rowdata);
                            return '<a class="btn btn-icon-only btn-edit btn-permission" data-id="' + rowdata.classCode + '" data-rowdata=\''+newRowData+'\' action= "" title="修改">' +
                                '<span class="glyphicon icon-edit"></span></a>' +
                                '<a class="btn btn-icon-only btn-delete btn-permission" data-id="' + rowdata.classCode + '" action= "" title="删除">' +
                                '<span class="glyphicon icon-trash"></span></a>'
                        }
                    }
                ];
                return columns;
            },
            //初始化表格
            initTable: function (data) {
                var id = "category-table";
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
                    "dom": '<"datatable-toolbar"B>rt<"' + id + '-paginate"ilp>',
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
                        $("#dtToolbar .buttons-excel").off().on('click', function (evt) {
                            evt = evt || window.event;
                            evt.preventDefault();
                            ufma.expXLSForDatatable($('#' + id), '人员类别');
                        });
                        //导出end

                        $('#category-table_wrapper').ufScrollBar({
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
                        if (data.length > 0) {
                            $("#" + id).fixedColumns({
                                rightColumns: 1,//锁定右侧一列
                                // leftColumns: 1//锁定左侧一列
                            });
                        }
                        $("#category-table").find("td.dataTables_empty").text("").append('<img src="' + bootPath + 'images/noData.png"/><br/><i>目前还没有你要查询的数据</i>');

                        //权限控制
                        ufma.isShow(page.reslist);
                        ufma.setBarPos($(window));
                        $('#category-table_wrapper').ufScrollBar("update");
                    }
                });
            },
            //获取表格数据
            getSearchData: function () {
                var argu = {
                    agencyCode: "*",
                    rgCode: svData.svRgCode
                };
                ufma.showloading("正在加载数据请耐心等待...");
                ufma.post(interfaceURL.selectEmpClass, argu, function (result) {
                    ufma.hideloading();
                    var data = result.data;
                    page.DataTable.clear().draw()
                    if(data.length > 0){
                        page.DataTable.rows.add(data)
                        page.DataTable.columns.adjust().draw()
                    }
                    $('#category-table_wrapper')
                      .ufScrollBar({
                        hScrollbar: true,
                        mousewheel: false
                      })
                    ufma.setBarPos($(window))
                    // page.initTable(data);
                })
            },
            //打开弹窗
            openWin: function (ele) {
                var title, openData;
                if (ele[0].id == "btn-add-value") {
                    title = "新增人员属性分类";
                    openData = {
                        action: "add"
                    };
                } else {
                    title = "修改人员属性分类";
                    var rowdata = ele.attr("data-rowdata");
                    openData = {
                        rowdata: rowdata,
                        action: "edit"
                    };
                }
                ufma.open({
                    url: 'addEmployeeCategory.html',
                    title: title,
                    width: 1090,
                    //height:500,
                    data: openData,
                    ondestory: function (data) {
                        //窗口关闭时回传的值
                        if (data.action && data.action.action == "save") {
                            ufma.showTip(data.action.msg,function(){},data.action.flag);
                            page.getSearchData();
                        }
                    }
                });
            },
            //删除传参
            delArgu: function (ele) {
                var argu = {
                    classCodes: [],
                    agencyCode: "*",
                    rgCode: svData.svRgCode
                };
                if (ele[0].id == "tool-bar-del") {
                    var checks = $("input.checkboxes:checked");
                    checks.each(function () {
                        var rowId = $(this).attr("data-id");
                        argu.classCodes.push(rowId);
                    })

                } else {
                    argu.classCodes.push(ele.attr("data-id"))
                }
                return argu;
            },
            //删除
            delValues: function (ele) {
                var argu = page.delArgu(ele);
                if (argu.classCodes.length == 0) {
                    ufma.showTip("请选择要删除的数据", function () {

                    }, "warning");
                    return false;
                }
                ufma.confirm('您确定要删除选中的数据吗？', function (action) {
                    if (action) {
                        //点击确定的回调函数
                        ufma.showloading("正在加载数据请耐心等待...");
                        ufma.post(interfaceURL.delEmpClass, argu, function (result) {
                            ufma.hideloading();
                            ufma.showTip(result.msg, function () {

                            }, result.flag);
                            page.getSearchData()
                        })
                    } else {
                        //点击取消的回调函数
                    }
                }, {type: 'warning'});
            },
            //启用/停用
            optEnabled: function (type) {
                var checked = $("table .checkboxes:checked");
                if (checked.length == 0) {
                    var message = "请选择要启用的数据";
                    if (type == "unactive") {
                        message = "请选择要停用的数据"
                    }
                    ufma.showTip(message, function () {

                    }, "warning")
                    return false
                }
                var argu = {
                    action: "active",
                    agencyCode: "*",
                    classCode: [],
                    rgCode: svData.svRgCode
                };
                for (var i = 0; i < checked.length; i++) {
                    argu.classCode.push($(checked[i]).attr("data-id"));
                }
                if (type == "unactive") {
                    argu.action = "unactive"
                }
                $("button").attr("disabled",true);
                ufma.showloading("正在加载数据请耐心等待...");
                ufma.post(interfaceURL.able, argu, function (result) {
                    ufma.hideloading("正在加载数据请耐心等待...");
                    ufma.showTip(result.msg, function () {

                    }, result.flag);
                    $("button").attr("disabled",false);
                    page.getSearchData()
                })
                var timeId = setTimeout(function () {
                    clearTimeout(timeId);
                    $("button").attr("disabled",false);
                },"5000")
            },
            initPage: function () {
                //权限控制
                page.reslist = ufma.getPermission();
                ufma.isShow(page.reslist);
                //初始化表格
                page.initTable([]);
                //查询
                page.getSearchData();
            },
            onEventListener: function () {
                //表格单行选中
                $(document).on("click", "tbody tr", function (e) {
                    stopPropagation(e);
                    if ($("td.dataTables_empty").length > 0) {
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
                $(document).on("click", "#btn-add-value", function () {
                    page.openWin($(this));
                });
                //修改
                $(document).on("click", "a.btn-edit", function () {
                    page.openWin($(this));
                });
                //删除表格行
                $(document).on("click", "a.btn-delete", function () {
                    page.delValues($(this))
                });
                //删除
                $(document).on("click", "#tool-bar-del", function () {
                    page.delValues($(this))
                });
                //启用
                $("#tool-bar-enable").on("click", function () {
                    page.optEnabled("active");
                });
                //停用
                $("#tool-bar-disable").on("click", function () {
                    page.optEnabled("unactive");
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