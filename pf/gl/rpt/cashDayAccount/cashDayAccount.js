$(function() {
    var page = function() {
        var ptData = {};
        var agencyCode = '',
        acctCode = '';
        var oTable;
        return {
            initAgencyScc: function() {
                ufma.showloading('正在加载数据，请耐心等待...');
                //账套
                $('#cbAgency').ufTreecombox({
                    url: dm.getCtrl('agency'),
                    idField: 'id',
                    //可选
                    textField: 'codeName',
                    //可选
                    pIdField: 'pId',
                    //可选
                    placeholder: '请选择单位',
                    icon: 'icon-unit',
                    theme: 'label',
                    leafRequire: true,
                    onChange: function(sender, treeNode) {
                        agencyCode = $('#cbAgency').getObj().getValue();
                        var url = dm.getCtrl('acct') + agencyCode;
                        callback = function(result) {
                            $("#cbAcct").getObj().load(result.data);
                        }
                        ufma.get(url, {},
                        callback);
                    },
                    onComplete: function(sender) {
                        if (ptData.svAgencyCode) {
                            $('#cbAgency').getObj().val(ptData.svAgencyCode);
                        } else {
                            $('#cbAgency').getObj().val('1');
                        }
                        ufma.hideloading();
                    }
                });
            },
            initGridDPE: function() {
                var tableId = 'gridDPE';
                var columns = [{
                    title: "序号",
                    data: "rowno",
                    className: 'tc nowrap',
                    width: 30
                },
                {
                    title: "月",
                    data: "fylxName",
                    className: 'nowrap',
                    render: function(data, type, rowdata, meta) {
                        if (!rowdata.bookGuid) return '';
                        return data + '<span class="row-details icon-angle-top" dataId="' + rowdata.bookGuid + '"></span>'
                    }
                },
                {
                    title: "日",
                    data: "occurDate",
                    className: 'nowrap'
                },
                {
                    title: "单据编号",
                    data: "apportionTypeName",
                    className: 'nowrap'
                },
                {
                    title: "凭证编号",
                    data: 'startDate',
                    className: 'nowrap'
                },
                {
                    title: "摘要",
                    data: 'endDate',
                    className: 'nowrap',
                    "render": function(data, type, full, meta) {
                        if (data != null) {
                            if (full.rowType == "7" || full.rowType == "8") {
                                return '<span data-year="' + full.setYear + '" data-month="' + full.fisPerd + '">' + data + '</span>';
                            } else {
                                return data;
                            }
                        } else {
                            return "";
                        }
                    }
                },
                {
                    title: "经办人",
                    data: "apportionMoney",
                    className: ' nowrap',
                    render: function(data, type, rowdata, meta) {
                        var val = $.formatMoney(data);
                        return val == '0.00' ? '': val;
                    }
                },
                {
                    title: "票据号",
                    data: "apportionPeriod",
                    className: ' nowrap',
                    render: function(data, type, rowdata, meta) {
                        return data == 0 ? '': data;
                    }
                },
                {
                    title: "借方",
                    data: "apportionedMoney",
                    className: ' nowrap',
                    "render": $.fn.dataTable.render.number(',', '.', 2, '')
                },
                {
                    title: "贷方",
                    data: "apportionedPeriod",
                    className: ' nowrap',
                    "render": $.fn.dataTable.render.number(',', '.', 2, '')
                },
                {
                    title: "方向",
                    data: "noapportionedMoney",
                    className: ' nowrap',
                    render: function(data, type, rowdata, meta) {
                        var val = $.formatMoney(data);
                        return val == '0.00' ? '': val;
                    }
                },
                {
                    title: "余额",
                    data: "noapportionedPeriod",
                    className: ' nowrap',
                    "render": $.fn.dataTable.render.number(',', '.', 2, '')
                }];
                var opts = {
                    "language": {
                        "url": bootPath + "agla-trd/datatables/datatable.default.js"
                    },
                    "bFilter": true,
                    "autoWidth": false,
                    "bDestory": true,
                    "processing": true,
                    //显示正在加载中
                    "pagingType": "full_numbers",
                    //分页样式
                    "lengthChange": true,
                    //是否允许用户自定义显示数量p
                    "lengthMenu": [[10, 20, 50, 100, 200, -1], [10, 20, 50, 100, 200, "全部"]],
                    "pageLength": 20,
                    "serverSide": false,
                    "ordering": false,
                    columns: columns,
                    data: [],
                    "dom": '<"datatable-toolbar"B>rt<"' + tableId + '-paginate"ilp>',
                    buttons: [{
                        extend: 'print',
                        text: '<i class="glyphicon icon-print" aria-hidden="true"></i>',
                        exportOptions: {
                            columns: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
                        },
                        customize: function(win) {
                            $(win.document.body).find('h1').css("text-align", "center");
                            $(win.document.body).css("height", "auto");
                        }
                    },
                    {
                        extend: 'excelHtml5',
                        text: '<i class="glyphicon icon-upload" aria-hidden="true"></i>',
                        exportOptions: {
                            columns: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
                        },
                        customize: function(xlsx) {
                            var sheet = xlsx.xl.worksheets['sheet1.xml'];
                        }
                    }],
                    initComplete: function(settings, json) {
                        $('.datatable-toolbar').appendTo('#dtToolbar');
                        var toolBar = $(this).attr('tool-bar');
                         var $info = $(toolBar + ' .info');
                        if ($info.length == 0) {
                            $info = $('<div class="info"></div>').appendTo($(toolBar + ' .tool-bar-body'));
                        }
                        $info.html('');
                        $('.' + tableId + '-paginate').appendTo($info);

                        $('[data-toggle="tooltip"]').tooltip();
                    },
                    fnCreatedRow: function(nRow, aData, iDataIndex) {
                        $('td:eq(0)', nRow).html(iDataIndex + 1);
                    }
                }

                oTable = $("#" + tableId).dataTable(opts);
            },
            //入参
            loadGridDPE: function() {
                var argu = $('#frmQuery').serializeObject();
                var list = $('input:radio[name="treeShow1"]:checked').val();
                argu = $.extend(argu, {
                    agencyCode: $('#cbAgency').getObj().getValue(),
                    acctCode: $('#cbAcct').getObj().getValue(),
                    setYear: ptData.svSetYear,
                    rgCode: ptData.svRgCode,
                    list1: list
                });

                dm.loadGridData(argu,function(result) {
                    oTable.fnClearTable();
                    oTable.fnAddData(result.data, true);

                    $('#gridDPE').closest('.dataTables_wrapper').ufScrollBar({
                        hScrollbar: true,
                        mousewheel: false
                    });
                    ufma.setBarPos($(window));

                    $('#gridDPE').fixedColumns({
                        rightColumns: 1
                    });
                });
            },
            //搜索
            onEventListener: function() {
                $('#btnQuery,#searchHideBtn').click(function() {
                    page.loadGridDPE();
                });
            },
            //初始化账套
            initPage: function() {
                $("#cbAcct").ufCombox({
                    idField: 'CHR_CODE',
                    textField: 'CODE_NAME',
                    placeholder: '请选择账套',
                    icon: 'icon-book',
                    theme: 'label',
                    onChange: function(data) {

                    },
                    onComplete: function(sender) {
                        if (ptData.svAcctCode) {
                            $("#cbAcct").getObj().val(ptData.svAcctCode);
                        } else {
                            $('#cbAcct').getObj().val('1');
                        }
                        ufma.hideloading();
                    }
                });

                this.initAgencyScc();
                /////////////
                $('.uf-datepicker').ufDatepicker({
                    format: 'yyyy-mm-dd',
                    //viewMode:'month',
                    initialDate: new Date()
                });

                page.initGridDPE();

                 //显示/隐藏列隐藏框
                $("#colAction").on("click",function(evt){
                evt.stopPropagation();
                 $("#colList input").each(function(i){
                    $(this).prop("checked",page.changeCol[i].visible);
                })
                 $("div.rpt-funnelBox").hide();
                    $(this).next("div.rpt-funnelBox").show();

                })
                $("body").on("click",function(){

                 $("div.rpt-funnelBox").hide();
                })
                //确认添加列
                    $(rpt.namespace).find("#addCol").on("click",function(evt){
                        evt.stopPropagation();
                        $("#colList label").each(function(i){
                            page.changeCol[i].visible = $(this).find("input").prop("checked");
                            var nn = $(this).find("input").data("index");
                            if($(this).find("input").is(":checked")){
                                page.glRptDlyJounalDataTable.column(nn).visible(true);
                                $(page.glRptDlyJounalDataTable.settings()[0].aoColumns[nn].nTh).addClass("isprint");
                            }else{
                                page.glRptDlyJounalDataTable.column(nn).visible(false);
                                $(page.glRptDlyJounalDataTable.settings()[0].aoColumns[nn].nTh).removeClass("isprint");
                            }
                        });
                        page.glRptDlyJounalDataTable.columns.adjust().draw();
                    });


            },
            init: function() {
                //获取session
                ptData = ufma.getCommonData();
                this.initPage();
                this.onEventListener();
                ufma.parse();
                ufma.parseScroll();
                //绑定日历控件
                var glRptLedgerDate = {
                    format: 'yyyy-mm',
                    viewMode: 'month',
                    initialDate: new Date()
                };
                $("#dateStart,#dateEnd").ufDatepicker(glRptLedgerDate);
                rpt.dateBenQi("dateStart", "dateEnd");

                //选择期间，改变日历控件的值
                $(" #dateBq").on("click",
                function() {
                    rpt.dateBenQi("dateStart", "dateEnd");
                });
                $(" #dateBn").on("click",
                function() {
                    rpt.dateBenNian("dateStart", "dateEnd");
                });
                //搜索隐藏显示--表格模糊搜索
                rpt.searchHideShow(page.glRptLedgerTable);


            }
        }
    } ();

    page.init();
});