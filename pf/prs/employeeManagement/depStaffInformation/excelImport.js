/*zhaoxjb 2018.5.22*/
var guid = "";
var tableHeadName = [];
$(function () {

    window._close = function (action) {
        if (window.closeOwner) {
            var data = {
                action: action
            };
            window.closeOwner(data);
        }
    };
    //获取年度，区域并赋值 S
    var svData = ufma.getCommonData();
    var ownerData = window.ownerData;
    $("#setYear").val(svData.svSetYear);
    $("#rgCode").val(svData.svRgCode);
    var pageLength = 25;
    //接口URL集合
    var interfaceURL = {
        selectPrsExcelStyleEmp:"/prs/base/prsExcelStyleEmpCo/selectPrsExcelStyleEmpCo",//查询
        uploadExcel:"/prs/emp/maEmp/impEmpInformationExcel"//导入
    };
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
                            return data;
                            // return '<a href="" class="edit-row-data" data-id="'+rowdata.id+'" style="color: #108ee9">'+data+'</a>';
                        }
                    },
                    {
                        title: "匹配类型",
                        data: "matchitem",
                        className: "isprint nowrap ellipsis",
                        render: function (data, type, rowdata, meta) {
                            if (!data) {
                                return "";
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
                        title: "是否覆盖",
                        data: "isNeedCalc",
                        className: "isprint nowrap ellipsis",
                        render: function (data, type, rowdata, meta) {
                            if (!data) {
                                return "";
                            }
                            return data === 'Y' ? '是' : '否';
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
                    // "buttons": [{
                    //     extend: 'print',
                    //     text: '<i class="glyphicon icon-print" aria-hidden="true"></i>',
                    //     exportOptions: {
                    //         columns: '.isprint'
                    //     },
                    //     customize: function (win) {
                    //         $(win.document.body).find('h1').css("text-align", "center");
                    //         $(win.document.body).css("height", "auto");
                    //     }
                    // },
                    //     {
                    //         extend: 'excelHtml5',
                    //         text: '<i class="glyphicon icon-upload" aria-hidden="true"></i>',
                    //         exportOptions: {
                    //             columns: '.isprint'
                    //         },
                    //         customize: function (xlsx) {
                    //             var sheet = xlsx.xl.worksheets['sheet1.xml'];
                    //         }
                    //     }
                    // ],
                    "initComplete": function (settings, json) {
                        //驻底begin
                        var toolBar = $(this).attr('tool-bar')
                        var $info = $(toolBar + ' .info');
                        if($info.length == 0) {
                            $info = $('<div class="info"></div>').appendTo($(toolBar + ' .tool-bar-body'));
                        }
                        $info.html('');
                        $('.' + id + '-paginate').appendTo($info);

                        $('#'+id).closest('.dataTables_wrapper').ufScrollBar({
                            hScrollbar: true,
                            mousewheel: false
                        });
                        // ufma.setBarPos($(window));
                        var conH = $(".container-fluid").height();
                        if(conH > $(".ufma-layout-up").height() - 44){
                            conH = $(".ufma-layout-up").height() -44
                        }
                        $('#'+id).closest('.dataTables_wrapper').css("position","initial");
                        var sw = $('#'+id).closest('.dataTables_wrapper').find(".slider").width();
                        $('#'+id).closest('.dataTables_wrapper').find(".slider").css({top:conH +"px",height:"5px",left:"30px",width:sw +"px"});
                        $('#'+id).closest('.dataTables_wrapper').find(".slider span").css("height","5px");
                        var h = $(".ufma-layout-up").height();
                        $("#tool-bar").css({"top":conH + 5 + "px","position":"absolute"});
                        $(".ufma-tool-bar .tool-bar-body").css("margin-right","0");
                        var wVal = $(".table-part").css("width");
                        $("#tool-bar").css({"width":parseInt(wVal) +16 + "px","margin-left":"15px"});
                        $(".slider").css({"top":(parseFloat($(".slider").css("top")) - 4)+"px","height":"8px"});
                        $(".slider span").css({"height":"8px"});
                        //驻底end


                        //checkbox的全选操作
                        // $('.datatable-group-checkable').on("change", function () {
                        //     var isCorrect = $(this).is(':checked');
                        //     $('#' + id + ' .checkboxes').each(function () {
                        //         isCorrect ? $(this).prop("checked", !0) : $(this).prop("checked", !1);
                        //         isCorrect ? $(this).closest("tr").addClass("selected") : $(this).closest("tr").removeClass("selected");
                        //     });
                        //     $('.datatable-group-checkable').prop("checked", isCorrect);
                        // });
                        $(".checkboxes").on("change",function () {
                            $(this).closest("tr").siblings("tr").find(".checkboxes").prop("checked",false)
                        });

                        ufma.isShow(page.reslist);
                        $('.datatable-toolbar [data-toggle="tooltip"]').tooltip();
                        $("th .mt-checkbox-single").addClass("hidden")
                    },
                    "drawCallback": function (settings) {
                        // if(data.length > 0){
                        //     $("#" + id).fixedColumns({
                        //         rightColumns: 1,//锁定右侧一列
                        //         // leftColumns: 1//锁定左侧一列
                        //     });
                        // }
                        $("#mainTable").find("td.dataTables_empty").text("").append('<img src="' + bootPath + 'images/noData.png"/><br/><i>目前还没有你要查询的数据</i>');

                        //权限控制
                        ufma.isShow(page.reslist);
                        ufma.setBarPos($(window));
                        $('#mainTable_wrapper').ufScrollBar("update");
                    }
                });
            },
            //获取表格数据
            getTableData:function(){
                var argu = {
                    rgCode:svData.svRgCode,
                    setYear:svData.svSetYear,
                    agencyCode:svData.svAgencyCode
                };
                ufma.showloading("正在加载数据请耐心等待...");
                ufma.post(interfaceURL.selectPrsExcelStyleEmp,argu,function (result) {
                    ufma.hideloading();
                    // if (page.DataTable != undefined && $('#mainTable').html() !== "") {
                    //     pageLength = ufma.dtPageLength('#mainTable');
                    //     $("#mainTable_wrapper").ufScrollBar('destroy');
                    //     page.DataTable.destroy();
                    // }
                    var data = result.data;
                    page.initTable(data);
                })
                
            },
            //初始化页面
            initPage: function () {
                page.getTableData()
            },
            //页面元素事件绑定使用jquery 的 on()方法
            onEventListener: function () {
                //取消
                $(document).on("click", "#btn-cancle", function (e) {
                    _close("cancel");
                });
                //关闭
                $(document).on("click", "#btn-close", function (e) {
                    _close("close", {});
                });
                //选择上传文件
                $(".file-upload-box-btn").on("change", ".file-upload-input", function () {
                    var oldFile = $(".file-upload-title span").text();
                    // var filePath = $(this).val();
                    var filePath = this.files[0].name;
                    var $box = $(this).parents(".file-upload-box");
                    if (filePath != "") {
                        $box.find(".file-upload-tip").hide();
                        $box.find(".file-upload-title").show().find("span").text(filePath);
                    } else {
                        if (oldFile != "") {
                            $box.find(".file-upload-tip").hide();
                            $box.find(".file-upload-title").show().find("span").text(oldFile);
                        } else {
                            $box.find(".file-upload-tip").show();
                            $box.find(".file-upload-input").hide().find("span").text(filePath);
                        }
                    }
                });
                //删除文件
                $(".file-upload-title .icon-close").on("click", function () {
                    var $box = $(this).parents(".file-upload-box");
                    $box.find(".file-upload-tip").show();
                    $box.find(".file-upload-title").hide().find("span").text("");
                    $box.find(".file-upload-input").val("");
                });

                //改变文本起始行
                $("#editStartLine").on("change", function () {
                    var num = $(this).val();
                    if (num != "") {
                        page.reqPreText();
                    }
                });
                //导入
                $("#data-import-btn").on("click",function () {     
                    if (!$("input[id=excelFile]").val()) {
                        ufma.showTip("请选择一个要导入的Excel文件！","","warning");
                        return false
                    }
                    var checks = $("input.checkboxes:checked");
                    if(checks.length == 0){
                        ufma.showTip("请选择导入格式","","warning");
                        return false
                    }
                    var tr = $(checks).closest("tr");
                    var rowData = page.DataTable.row(tr).data();
                    $("input[name=matchcolumnindex]").val(rowData.matchcolumnindex);
                    $("input[name=datarowindex]").val(rowData.datarowindex);
                    $("input[name=sheetid]").val(rowData.sheetid);
                    $("input[name=id]").val(rowData.id);
                    ufma.showloading('正在导入数据，请耐心等待...');
                    $.ajax({
                        url: interfaceURL.uploadExcel,
                        type: 'POST',
                        cache: false,
                        data: new FormData($('#excelFileFrom')[0]),
                        processData: false,
                        contentType: false
                    }).done(function (res) {
                        ufma.hideloading();
                        if (res.flag === "success") {

                            ufma.showTip("导入成功！", function () {
                                _close("save");
                            }, "success");
                        } else {
                            $(".btn-import").attr("disabled",false);
                            ufma.showTip(res.msg, function () {
                            }, "error");
                        }
//
                    }).fail(function (res) {
                        ufma.hideloading();
                        $(".btn-import").attr("disabled",false);
//                        	console.info(res);
                        if (res.status === 500) {
                            ufma.showTip('导入数据失败，请检查导入文件的格式是否符合设置的导入方案!!', function () {
                            }, "error");
                        } else {
                            ufma.showTip(res.msg, function () {
                            }, "error");
                        }
                    });
                })

            },
            //此方法必须保留
            init: function () {
                ufma.parse();
                this.initPage();
                this.onEventListener();
            }
        }
    }();
    page.init();
});
