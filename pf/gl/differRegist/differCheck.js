$(function () {
    window._close = function () {
        window.closeOwner();
    };
    var ptData = {};
    var page = function () {
        return {
            //初始化页面
            initPage: function () {
                $('#jouDate').ufDatepicker({
                    format: 'yyyy-mm-dd',
                    initialDate: new Date()
                });
                if (!$.isNull(window.ownerData.oneData)) {
                    $('#btnSaveAdd').removeClass('disabled');
                    $('#btnSave').removeClass('disabled');
                }
            },
            initGrid: function (data) {
                var columns = [
                    {
                        title: "项目",
                        data: "descpt",
                        className: 'nowrap'
                    },
                    {
                        title: "金额",
                        data: "drAmt",
                        className: 'nowrap tr',
                        render: function (data, type, rowdata, meta) {
                            var val = $.formatMoney(data);
                            return val == '0.00' ? '' : val;
                        }
                    }
                ];
                oTable = $("#gridGOV").dataTable({
                    "language": {
                        "url": bootPath + "agla-trd/datatables/datatable.default.js"
                    },
                    "autoWidth": false,
                    "bPaginate": false,
                    "bDestory": true,
                    "processing": true, //显示正在加载中
                    "serverSide": false,
                    "ordering": false,
                    // "pagingType": "full_numbers", //分页样式
                    // "lengthChange": true, //是否允许用户自定义显示数量p
                    // "lengthMenu": [
                    //     [10, 20, 50, 100, 200, -1],
                    //     [10, 20, 50, 100, 200, "全部"]
                    // ],
                    // "pageLength": ufma.dtPageLength("#gridGOV"),
                    "columns": columns,
                    //填充表格数据
                    data: data,
                    //"dom": 'rt<"gridGOV-paginate"ilp>',
                    "dom": 'rt<ilp>',
                    initComplete: function (settings, json) {
                        // var toolBar = $(this).attr('tool-bar')
                        // var $info = $(toolBar + ' .info');
                        // if ($info.length == 0) {
                        //     $info = $('<div class="info"></div>').appendTo($(toolBar + ' .tool-bar-body'));
                        // }
                        // $info.html('');
                        // $('.gridGOV-paginate').appendTo($info);
                        // $('#gridGOV').closest('.dataTables_wrapper').ufScrollBar({
                        //     hScrollbar: true,
                        //     mousewheel: false
                        // });
                        // ufma.setBarPos($(window));

                        // $(".checkAll-three").prop("checked", false);
                        // $(".checkAll-three").on('change', function () {
                        // });
                    },
                    "drawCallback": function () {
                        $('#gridGOV').find("td.dataTables_empty").text("")
                            .append('<img src="' + bootPath + 'images/noData.png"/><br/><i>目前还没有你要查询的数据</i>');
                        ufma.setBarPos($(window));
                        $("#check-head").prop('checked', false)
                        $("#all").prop('checked', false)
                    }
                });
            },
            loadGrid: function () {
                var argu = {
                    agencyCode: window.ownerData.agencyCode,
                    acctCode: window.ownerData.acctCode,
                    accoCode: window.ownerData.accoCode,
                    setYear: window.ownerData.setYear,
                    rgCode: window.ownerData.svRgCode,
                    fisPerd: window.ownerData.fisPerd,
                    startDate: window.ownerData.startDate,
                    endDate: window.ownerData.endDate,
                    isVouSign: window.ownerData.isVouSign
                };
                // dm.cbbGetData(argu, function (result) {
                //     if ($("#gridGOV").html() != '') {
                //         $("#gridGOV").dataTable().fnDestroy();
                //         $("#gridGOV").html('');
                //     }

                //     page.initGrid(result.data);
                // });
                var data = [{
                    "descpt": "摘要",
                    "drAmt": "4.00"
                }];
                page.initGrid(data);
            },
            onEventListener: function () {

                $('#btnClose').on('click', function () {
                    _close()
                });
                //表头全选
                $("body").on("click", 'input#check-head', function () {
                    var flag = $(this).prop("checked");
                    $("#gridGOV_wrapper").find('input.check-all').prop('checked', flag);
                    $("#all").prop('checked', flag)
                });
                //全选
                $("#all").on("click", function () {
                    var flag = $(this).prop("checked");
                    $("#gridGOV_wrapper").find('input.check-all').prop('checked', flag);
                    $("#check-head").prop('checked', flag)
                });
                //单选
                $("body").on("click", 'input.check-all', function () {
                    var num = 0;
                    var arr = document.querySelectorAll('.check-all')
                    for (var i = 0; i < arr.length; i++) {
                        if (arr[i].checked) {
                            num++
                        }
                    }
                    if (num == arr.length) {
                        $("#all").prop('checked', true)
                        $("#check-head").prop('checked', true)
                    } else {
                        $("#all").prop('checked', false)
                        $("#check-head").prop('checked', false)
                    }
                });
            },

            //此方法必须保留
            init: function () {
                //权限控制
                page.reslist = ufma.getPermission();
                ufma.isShow(page.reslist);
                this.initPage();
                page.loadGrid();
                this.onEventListener();
                ptData = ufma.getCommonData();
                ufma.parseScroll();
                ufma.parse();
            }
        }
    }();

    /////////////////////
    page.init();
});