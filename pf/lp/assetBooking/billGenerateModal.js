$(function () {
    window._close = function (action) {
        if (window.closeOwner) {
            var data = {action: action};
            window.closeOwner(data);
        }
    };
    // var ownerData = window.ownerData;
    var ownerData = JSON.parse(window.sessionStorage.getItem("GenerateModal"));
    //接口URL集合
    var interfaceURL = {
        preview: "/lp/targetBillCreate/preview",//预览
        createTargerBill: "/lp/targetBillCreate/createTargerBill",//批量生成
        viewVoucher: "/lp/targetBillCreate/viewVoucher/"//单据生成之后查看凭证
    };
    var pfData = ufma.getCommonData();

    var columns = [
        {
            title: "单据编号", data: "billNo",
            render: function (data, type, rowdata, meta) {
                var newData = data.split(",");
                var tdHtml = '';
                for (var i = 0; i < newData.length; i++) {
                    tdHtml += '<div>' + newData[i] + '</div>'
                }
                return tdHtml;

            }
        },
        {
            title: "单据日期", data: "billDate", className: 'billDate',
            render: function(data) {
                return '<div class="content" title='+ data +'>' + data + '</div>'
            }
        },
        {
            title: "凭证号", data: "vouNo",
            render: function (data, type, rowdata, meta) {
                if (!data) {
                    return "";
                }
                else {
                    return data;
                }

            }
        },
        {title: "单据金额", data: "billAmount",
            render:function (data, type, rowdata, meta) {
                if(!data || data == "0.00" || data == 0){
                    return "";
                }
                return '<div style="text-align: right">'+$.formatMoney(data, 3);+'</div>';
            }
        },
        {title: "状态", data: "state"},
        {
            title: "操作", data: null,
            "render": function (data, type, rowdata, meta) {
                if (rowdata.state == "失败") {
                    var error = rowdata.error;
                    error = rowdata.error.replace("<br>","");
                    error = error.replace("<br>","");
                    return '<a class="check-log"  data-toggle="tooltip" action= "" title="'+error+'">查看错误原因</a>';
                }else{
                    return '<a class="check-vou">查看凭证</a>';
                }

            }
        }
    ];

    var page = function () {

        return {
            //初始化表格
            initTable: function (data, columns) {
                if(ownerData.type == "mainBillNo"){
                    columns[0].title = "主单据编号";
                    columns[0].data = "mainBillNo";
                }
                // data.splice(0, 3);
                var id = "showTable";
                page.tableObj = $("#" + id).DataTable({
                    "language": {
                        "url": bootPath + "agla-trd/datatables/datatable.default.js"
                    },
                    "data": data,
                    "bRetrieve": true,
                    // "paging": false, // 禁止分页
                    "processing": true, //显示正在加载中
                    "pagingType": "full_numbers", //分页样式
                    "lengthChange": true, //是否允许用户自定义显示数量p
                    "lengthMenu": [
                        [10, 20, 50, 100, 200, -1],
                        [10, 20, 50, 100, 200, "全部"]
                    ],
                    "pageLength": 20,
                    "ordering": false,
                    "columns": columns,
                    // "scrollY": "260px",
                    // "sScrollX": "100%",
                    // "scrollCollapse": true,
                    // "autoWidth": true,
                    // "dom": 'rt',
                    "dom": 'rt<"' + id + '-paginate"ilp>',
                    "initComplete": function () {
                        //驻底 S
                        var toolBar = $(this).attr('tool-bar')
                        var $info = $(toolBar + ' .info');
                        if ($info.length == 0) {
                            $info = $('<div class="info"></div>').appendTo($(toolBar + ' .tool-bar-body'));
                        }
                        $info.html('');
                        $('.' + id + '-paginate').appendTo($info);

                        //表格模拟滚动条
                        $('#' + id).closest('.dataTables_wrapper').ufScrollBar({
                            hScrollbar: true,
                            mousewheel: false
                        });
                        var h = $(".ufma-layout-up").height();
                        $("#tool-bar").css({"top":h - 39 +"px","position":"absolute"});
                        $(".ufma-tool-bar .tool-bar-body").css("margin-right","0");
                        //tool-bar宽度
                        var wVal = $("table").css("width");
                        $("#tool-bar").css("width",parseInt(wVal) +18 + "px");
                        // ufma.setBarPos($(window));
                        //驻底 E

                        //查看凭证
                        $("#showTable").on("click",".check-vou",function (e) {
                            e.stopPropagation();
                            var oneData = page.tableObj.row($(this).parents('tr')).data();
                            ufma.setObjectCache("oneData", oneData);
                            $(".u-msg-dialog-top", parent.document).prevAll("#assetBooking").find("#open-check-vou").click();
                        })

                    },
                    "drawCallback": function (settings) {
                        // var twidth = 15 * colArr.length;
                        // $("#" + id).css("width", twidth + "%");
                        $("#" + id).find("td.dataTables_empty").text("")
                            .append('<img src="' + bootPath + 'images/noData.png"/><br/><i>目前还没有你要查询的数据</i>');

                        //按钮提示
                        $("[data-toggle='tooltip']").tooltip();
                        //权限控制
                        ufma.isShow(page.reslist);

                    }

                });
                // return tableObj;
            },
            preview: function () {
                var tarArgu = {
                    tmpGuid: ownerData.data.tmpGuid,
                    billList: ownerData.data.billList,
                    agencyCode: ownerData.data.agencyCode,
                    rgCode:pfData.svRgCode,
                    setYear:pfData.svSetYear
                };
                ufma.post(interfaceURL.preview, tarArgu, page.renderPreview());
            },
            renderPreview: function () {

            },
            onEventListener: function () {
                //点击表格中的预览
                $("#showTable").on("click", ".preview-vou", function () {
                    var tr = $(this).parents("tr");
                    var trData = page.tableObj.rows(tr).data()[0];
                });
                //点击表格中的删除
                $("#showTable").on("click", ".cancle-gen", function () {
                    var tr = $(this).parents("tr");
                    var trData = page.tableObj.rows(tr).data()[0];
                });
                //点击表格中的查看错误日志
                $("#showTable").on("click", ".check-log", function () {
                    var tr = $(this).parents("tr");
                    var trData = page.tableObj.rows(tr).data()[0];
                    // window.location.href = "billGenerateLog.html";
                });
                //点击取消
                $(document).on("click", "#btn-qx", function () {
                    _close("save");
                    // closeModel();
                });
                $(document).on("click",".close-model",function () {
                    closeModel();
                });
            },

            //此方法必须保留
            init: function () {
                ufma.parse();
                //权限控制
                page.reslist = ufma.getPermission();
                ufma.isShow(page.reslist);
                //初始化表格
                page.initTable(ownerData.data.generateList, columns);
                $("#bill-num").find("i").text(ownerData.data.num);
                $("#amount-num").find("i").text($.formatMoney(ownerData.data.amt, 2));
                page.onEventListener();
                ufma.parseScroll();


            }
        }
    }();
/////////////////////
    page.init();
    function closeModel() {
        $("#tempModalBg", parent.document).prevAll("#assetBooking").find(".lp-query-box-right .btn-query").click();
        $("#tempModalBg", parent.document).prevAll("#assetBooking").siblings("#ModalBg").css("display","none");
        $("#tempModalBg", parent.document).remove();
    }
});