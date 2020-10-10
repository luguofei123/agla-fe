$(function () {
    window.setData = function (data) {
    };
    var page = function () {
        var agencyCode;
        var baseUrl;
        var getItemTable;

        return {
            getItemItem: function () {
                var id = "reportData";
                var callback = function (result) {
                    page.getItemTable = $('#reportData').DataTable({
                        data: result.data,
                        language: {
                            "url": "ufgov/agla-trd/datatables/datatable.default.js"
                        },
                        "bFilter": false, //去掉搜索框
                        "paging": false,
                        "bLengthChange": true, //去掉每页显示多少条数据
                        "processing": true, //是否显示正在加载
                        "pagingType": "first_last_numbers", //分页样式
                        "lengthChange": false, //是否允许用户自定显示数量
                        "bInfo": false, //页脚信息
                        "bSort": false, //排序功能
                        "bAutoWidth": true, //表格自定义宽度
                        "bProcessing": true,
                        "swidth": "50px",
                        "bDestroy": true,
                        "columns": [{
                            title: '<label class="mt-checkbox mt-checkbox-single mt-checkbox-outline"> <input type="checkbox"' +
                                'class="datatable-group-checkable"/> &nbsp;<span></span> </label>',
                            data: "ELE_CODE"
                        },
                        {
                            title: "要素名称",
                            data: "ELE_NAME"
                        },
                        {
                            title: "编码规则",
                            data: "CODE_RULE"
                        },
                        {
                            title: "控制方式",
                            data: "ENU_NAME"
                        }
                        ],
                        "columnDefs": [{
                            "defaultContent": "",
                            "targets": "_all"
                        },
                        {
                            "targets": [0],
                            "serchable": false,
                            "orderable": false,
                            "className": "nowrap",
                            "render": function (data, type, rowdata, meta) {
                                return '<label class="mt-checkbox mt-checkbox-single mt-checkbox-outline"> <input type="checkbox" class="checkboxes" value="' + data + '" />&nbsp; <span></span> </label>';
                            }
                        }

                        ],
                        "initComplete": function (settings, json) {
                            $('#' + id + ' .btn').on('click', function () {
                                page.itemStop($(this).attr('action'), [$(this).attr('rowid')], $(this).closest('tr'));
                            });

                            $('#' + id + ' tbody td:not(.btnGroup)').on('click', function (e) {
                                e.preventDefault();
                                var $ele = $(e.target);
                                if ($ele.is('a')) {
                                    page.bsAndEdt($ele.data('href'));
                                    return false;
                                }
                                var $tr = $ele.closest('tr');
                                if ($tr.hasClass('selected')) {
                                    $tr.removeClass('selected');
                                    //$tr.find('input[type="checkbox"]')[0].checked = false;
                                    $tr.find('input[type="checkbox"]').prop("checked", false);
                                } else {
                                    $tr.addClass('selected');
                                    //$tr.find('input[type="checkbox"]')[0].checked = true;
                                    $tr.find('input[type="checkbox"]').prop("checked", true);
                                }
                            });

                            $(".datatable-group-checkable").prop("checked", false);
                            $(".datatable-group-checkable").on('change', function () {
                                var t = $(this).is(":checked");
                                $('#' + id + ' .checkboxes').each(function () {
                                    t ? $(this).prop("checked", !0) : $(this).prop("checked", !1);
                                    t ? $(this).closest('tr').addClass('selected') : $(this).closest('tr').removeClass('selected');
                                });
                                $(".datatable-group-checkable").prop("checked", t);
                            });
                            ufma.setBarPos($(window));
                        },
                        "drawCallback": function (setting) {
                            page.reslist = ufma.getPermission();
                            ufma.isShow(page.reslist);
                        }
                    });
                };
                var url = page.baseUrl + "accitem/selectElement/" + page.agencyCode;
                ufma.get(url, { "rgCode": window.ownerData.rgCode, "setYear": window.ownerData.setYear }, callback);
            },
            setEnbale: function (idArray) {
            	ufma.showloading("数据启用中，请耐心等待");
                var argu = { "agencyCode": page.agencyCode, "eleCodeList": idArray };
                var url = page.baseUrl + "accitem/enable";
                var callback = function (result) {
                    ufma.showTip(result.msg, function () {
                        page.close('ok');
                        page.getItemItem();
                        ufma.hideloading();
                    }, result.flag)
                };
                ufma.ajax(url, "post", argu, callback);
            },
            close: function (closeType) {
                if (window.closeOwner) {
                    var data = { action: closeType, result: { 'name': '辅助核算项' } };
                    window.closeOwner(data);
                }
            },
            getItemIds: function () {
                var checkedArray = [];
                table = page.getItemTable;
                activeLine = table.rows('.selected');
                data = activeLine.data();
                for (var i = 0; i < data.length; i++)
                    checkedArray.push(data[i].ELE_CODE);
                return checkedArray;
            },
            onEventListener: function () {
                $("#btn-start").on("click", function () {
                    if (page.getItemIds().length == 0) {
                        ufma.showTip('请选择要素!', function () { }, 'warning')
                    } else {
                        page.setEnbale(page.getItemIds());
                    }

                })
            },
            //此方法必须保留
            pageinit: function () {
                page.getItemItem();
                page.onEventListener();
            },
            init: function () {
                page.agencyCode = window.ownerData.agencyCode;
                page.baseUrl = window.ownerData.baseUrl;
                ufma.deferred(function () {
                    page.pageinit();
                });

                $('.btn-close').on('click', function () {
                    page.close('clc-ok');
                });
            }
        }
    }();
    page.init();
});