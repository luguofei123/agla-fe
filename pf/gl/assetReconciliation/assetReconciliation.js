$(function () {

    var portList = {

        search: "/gl/GlFaJqCheck/search/", //对账查询
        getAgencyTree:"/gl/eleAgency/getAgencyTree",//单位树
        getCoCoaccs:"/gl/eleCoacc/getRptAccts",//账套 //CWYXM-18053 广东现场，资产对账没有账套 更换接口 guohx  20200707
    };
    var pfData = ufma.getCommonData();

    var page = function () {
        return {
            //初始化单位
            initAgencyScc: function () {
                ufma.showloading('正在加载数据，请耐心等待...');
                ufma.get(portList.getAgencyTree,"",function (result) {
                    ufma.hideloading();
                    $('#cbAgency').ufTreecombox({
                        // url: dm.getCtrl('agency'),
                        idField: 'id', //可选
                        textField: 'codeName', //可选
                        pIdField: 'pId', //可选
                        placeholder: '请选择单位',
                        readonly: false,
                        icon: 'icon-unit',
                        theme: 'label',
                        leafRequire: true,
                        data:result.data,
                        onChange: function (sender, treeNode) {
                            //缓存单位账套
                            var params = {
                                selAgecncyCode: treeNode.id,
                                selAgecncyName: treeNode.name
                            }
                            ufma.setSelectedVar(params);
                            //账套
                            page.getCoCoaccs();

                        },
                        onComplete: function (sender) {
                            if (pfData.svAgencyCode) {
                                $('#cbAgency').getObj().val(pfData.svAgencyCode);
                            } else {
                                $('#cbAgency').getObj().val('1');
                            }
                        }
                    });
                })

            },
            //请求账套
            getCoCoaccs:function(){
                var url = portList.getCoCoaccs ;
                ufma.get(url, {agencyCode:$('#cbAgency').getObj().getValue()}, function (result) {
                    if(result.data.length == 0){
                        ufma.showTip("该单位下没有账套，请重新选择单位！",function () {

                        },"warning");
                        return false;
                    }
                    $("#cbAcct").getObj().load(result.data);
                });

            },
            //初始化账套
            initAcct: function () {
                $("#cbAcct").ufCombox({
                    idField: 'code',
                    textField: 'codeName',
                    placeholder: '请选择账套',
                    icon: 'icon-book',
                    theme: 'label',
                    onChange: function (data) {
                        $("#btnQuery").trigger("click");

                    },
                    onComplete: function (sender) {
                        if (pfData.svAcctCode) {
                            $("#cbAcct").getObj().val(pfData.svAcctCode);
                        } else {
                            $('#cbAcct').getObj().val('1');
                        }

                    }
                });
            },
            combineColumns:function(){
                var columns = [
                    {
                        data: "faTypeName",
                        width: 160,
                        className: 'nowrap isprint'
                    },
                    {
                        data: "faJqCurrAmt",
                        className: 'nowrap isprint',
                        width: 160,
                        render: function (data, type, rowdata, meta) {
                            var val = $.formatMoney(data);
                            return '<div style="text-align: right">' + (val == '0.00' ? '' : val) + '</div>'

                        }
                    },
                    {
                        data: "glAccoCurrAmt",
                        className: 'nowrap isprint',
                        width: 160,
                        render: function (data, type, rowdata, meta) {
                            var val = $.formatMoney(data);
                            return '<div style="text-align: right">' + (val == '0.00' ? '' : val) + '</div>'

                        }
                    },
                    {
                        data: "glFaCurrCheckResult",
                        className: 'nowrap isprint'
                    },
                    {
                        data: "faJqDepreAmt",
                        className: 'nowrap isprint',
                        width: 160,
                        render: function (data, type, rowdata, meta) {
                            var val = $.formatMoney(data);
                            return '<div style="text-align: right">' + (val == '0.00' ? '' : val) + '</div>'

                        }
                    },
                    {
                        data: "glAccoDepreAmt",
                        className: 'nowrap isprint',
                        width: 160,
                        render: function (data, type, rowdata, meta) {
                            var val = $.formatMoney(data);
                            return '<div style="text-align: right">' + (val == '0.00' ? '' : val) + '</div>'

                        }
                    },
                    {
                        data: "glFaDepreCheckResult",
                        className: 'nowrap isprint',
                    }
                ];
                return columns;
            },
            //收集表格表头信息
            tableHeader: function(tableId) {
                var columns = $("#" + tableId).DataTable().settings()[0].aoColumns;
                var visible = $("#" + tableId).DataTable().columns().visible(); //每列元素的隐藏/显示属性组
                var arr = []; //存储当前表格的表头信息
                for(var i = 0; i < visible.length; i++) {
                    var obj = {};
                    obj.title = columns[i].sTitle; //列名
                    obj.code = columns[i].data; //列名代码
                    obj.index = i; //列的索引
                    obj.visible = visible[i]; //列的隐藏/显示属性
                    obj.pTitle = $(columns[i].nTh).attr("parent-title") == undefined ? "" : $(columns[i].nTh).attr("parent-title"); //列名的父元素名
                    arr.push(obj);
                }
                return arr;
            },
            initTable:function(){
                var tableId = "assetTable";
                page.assetTable = $("#assetTable").dataTable({
                    "language": {
                        "url": bootPath + "agla-trd/datatables/datatable.default.js"
                    },
                    "autoWidth": false,
                    "bDestory": true,
                    "processing": true, //显示正在加载中
                    "pagingType": "full_numbers", //分页样式
                    "lengthChange": true, //是否允许用户自定义显示数量p
                    "lengthMenu": [
                        [10, 20, 50, 100, 200, -1],
                        [10, 20, 50, 100, 200, "全部"]
                    ],
                    "pageLength": 20,
                    "serverSide": false,
                    "ordering": false,
                    columns: page.combineColumns(),
                    data: [],
                    "dom": '<"datatable-toolbar"B>rt<"' + tableId + '-paginate"ilp>',
                    buttons: [{
                        extend: 'print',
                        text: '<i class="glyphicon icon-print" aria-hidden="true"></i>',
                        exportOptions: {
                            columns: '.isprint',
                            format: {
                                header: function(data, columnIdx) {
                                    var thisHead = $.inArrayJson(page.headerArr, 'index', columnIdx);
                                    if($(data).length == 0) {
                                        return thisHead.pTitle + data;
                                    } else {
                                        return thisHead.pTitle + $(data)[0].innerHTML;
                                    }
                                }
                            }
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
                                columns: '.isprint',
                                format: {
                                    header: function(data, columnIdx) {
                                        var thisHead = $.inArrayJson(page.headerArr, 'index', columnIdx);
                                        if($(data).length == 0) {
                                            return thisHead.pTitle + data;
                                        } else {
                                            return thisHead.pTitle + $(data)[0].innerHTML;
                                        }
                                    }
                                }
                            },
                            customize: function(xlsx) {
                                var sheet = xlsx.xl.worksheets['sheet1.xml'];
                            }
                        }
                    ],
                    initComplete: function (settings, json) {
                        $('.datatable-toolbar').appendTo('#dtToolbar');
                        var toolBar = $(this).attr('tool-bar');
                        var $info = $(toolBar + ' .info');
                        if ($info.length == 0) {
                            $info = $('<div class="info"></div>').appendTo($(toolBar + ' .tool-bar-body'));
                        }
                        $info.html('');
                        $('.' + tableId + '-paginate').appendTo($info);

                        //导出begin
                        $("#dtToolbar .buttons-excel").off().on('click', function(evt) {
                            evt = evt || window.event;
                            evt.preventDefault();
                            uf.expTable({
                                title:'资产对账',
                                exportTable: '#' + tableId
                            });
                            // ufma.expXLSForDatatable($('#' + tableId), '资产对账');
                        });
                        //导出end

                        ufma.isShow(page.reslist);
                        ufma.setBarPos($(window));
                        page.headerArr = page.tableHeader(tableId);
                    },
                    "drawCallback": function (settings) {
                        ufma.isShow(page.reslist);

                    },
                    fnCreatedRow: function (nRow, aData, iDataIndex) {
                    }
                });
            },
            initPage:function(){
                page.initAgencyScc();
                page.initAcct();
                var date = {
                    format: 'yyyy-mm',
                    viewMode: 'month',
                    initialDate: new Date()
                };
                $(".uf-datepicker").ufDatepicker(date);
                //初始化表格
                page.initTable();
                //搜索
                // page.searchHideShow("#assetReconciliation");
                ufma.searchHideShow($("#assetReconciliation"));
            },
            //搜索隐藏显示
            searchHideShow: function(selector) {

                $(".searchHide").focus(function() {
                    $(this).keydown(function(e) {
                        var val = $(this).val();
                        if(e.keyCode == 13) {
                            $(selector).DataTable().search(val).draw();
                            sessionStorage.removeItem("assetTeconciliationSearchKey");
                        }
                    });
                });
                $("#searchHideBtn").on("click", function(evt) {
                    evt.stopPropagation();
                    if($(".searchHide").hasClass("focusOff")) {
                        var newVal = sessionStorage.getItem("assetTeconciliationSearchKey");
                        if(newVal != "") {
                            $(".searchHide").val(newVal);
                        }
                        $(".searchHide").show().animate({
                            "width": "160px"
                        }).focus().removeClass("focusOff");
                    } else {
                        sessionStorage.removeItem("assetTeconciliationSearchKey");

                        var val = $(this).siblings("input[type='text']").val();
                        $(selector).DataTable().search(val).draw();

                        sessionStorage.setItem("assetTeconciliationSearchKey", val);
                    }
                });
                $(".iframeBtnsSearch").on("mouseleave", function() {
                    if(!$(".searchHide").hasClass("focusOff") && $(".searchHide").val() == "") {
                        $(".searchHide").animate({
                            "width": "0px"
                        }, "", "", function() {
                            $(".searchHide").css("display", "none");
                        }).addClass("focusOff");
                    }
                });
            },
            onEventListener: function () {
                $(document).on("click","#btnQuery",function () {
                    var startDate = $("#startDate").getObj().getValue();
                    var startEnd = $("#endDate").getObj().getValue();
                    // prjContObj.startYear = (new Date(startDate)).getFullYear(); //起始年度(只有年，如2017)
                    var startMonth = (new Date(startDate)).getMonth() + 1; //起始期间(只有月份，如7)
                    // prjContObj.endYear = (new Date(startEnd)).getFullYear(); //截止年度(只有年，如2017)
                    var endMonth = (new Date(startEnd)).getMonth() + 1; //截止期间(只有月份，如7)

                    var url = portList.search +$('#cbAgency').getObj().getValue()+"/"+$("#cbAcct").getObj().getValue()+"/"+startMonth + "/" +endMonth;

                    ufma.showloading('正在加载数据，请耐心等待...');
                    ufma.get(url,"",function (result) {
                        ufma.hideloading();
                        // $("#gridNotes_wrapper").ufScrollBar('destroy');
                        page.assetTable.fnClearTable();
                        if (result.data && result.data.length > 0) {
                            page.assetTable.fnAddData(result.data, true);
                        }
                        //表格模拟滚动条
                        $('#assetTable').closest('.dataTables_wrapper').ufScrollBar({
                            hScrollbar: true,
                            mousewheel: false
                        });
                        ufma.setBarPos($(window));
                    })
                })
            },
            //此方法必须保留
            init: function () {
                //权限控制
                page.reslist = ufma.getPermission();
                ufma.isShow(page.reslist);

                page.initPage();
                page.onEventListener();

                ufma.parse();
                ufma.parseScroll();
            }
        }
    }();
    /////////////////////
    page.init();
});