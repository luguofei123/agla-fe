$(function () {
    window._close = function (action) {
        if (window.closeOwner) {
            var data = {action: action};
            window.closeOwner(data);
        }
    };
    var svData = ufma.getCommonData();
    var bennian = svData.svSetYear; //本年 年度
    var benqi = svData.svFiscalPeriod; //本期 月份
    var today = svData.svTransDate; //今日 年月日
    var nowAgencyCode = svData.svAgencyCode;
    var nowAgencyName = svData.svAgencyName;
	var pageLength = ufma.dtPageLengthbackend('showTable');
	var serachData = { // 修改为后端分页
		currentPage: 1,
		pageSize: pageLength,
	};


    //接口URL集合
    var interfaceURL = {
        search: "/lp/lpVouLog/selectLogByCondition",//查询
        getTemplateNames: "/lp/template/getTemplateNames",//请求模版名称
        getSchemeTypes: "/lp/scheme/getSchemeTypes/",//根据单位id获取单据方案列表
        getEnumerateSytem: "/lp/enumerate/List/",//获取来源子系统
        getAgencyTree: "/lp/eleAgency/getAgencyTree" //用于显示单位树
    };


    var page = function () {

        return {
            //设置时间
            getLastDay: function (year, month) {
                var new_year = year; //取当前的年份
                var new_month = month++; //取下一个月的第一天，方便计算（最后一天不固定）
                if (month > 12) {
                    new_month -= 12; //月份减
                    new_year++; //年份增
                }
                var new_date = new Date(new_year, new_month, 1); //取当年当月中的第一天
                return (new Date(new_date.getTime() - 1000 * 60 * 60 * 24)).getDate(); //获取当月最后一天日期
            },
            //设置时间
            setDayInYear: function () {
                var mydate = new Date();
                Year = mydate.getFullYear();
                $('#vgDateStart').val(Year + '-01-01');
                $('#vgDateEnd').val(Year + '-12-31');
            },
            //设置时间
            setDayInMonth: function () {
                var mydate = new Date();
                Year = mydate.getFullYear();
                Month = (mydate.getMonth() + 1);
                Month = Month < 10 ? ('0' + Month) : Month;
                Day = mydate.getDate();
                $('#vgDateStart').val(Year + '-' + Month + '-01');
                $('#vgDateEnd').val(Year + '-' + Month + '-' + this.getLastDay(Year, Month));
            },
            //设置时间
            setDayInDay: function () {
                var mydate = new Date();
                Year = mydate.getFullYear();
                Month = (mydate.getMonth() + 1);
                Month = Month < 10 ? ('0' + Month) : Month;
                Day = mydate.getDate();
                Day = Day < 10 ? ('0' + Day) : Day;
                $('#vgDateStart').val(Year + '-' + Month + '-' + Day);
                $('#vgDateEnd').val(Year + '-' + Month + '-' + Day);
            },
            
            //初始化表格
            initTable: function (id, data) {
                // data.splice(0, 3);
                var tableId = 'showTable';
                var columns = [
                    {
                        title: "序号", data: null, width: "40px", className: 'nowrap',
                        render: function (data, type, rowdata, meta) {
                            return '<div style="text-align: center">' + (meta.row + 1) + '</div>';
                        }
                    },
                    {title: "单据方案", data: "SCHEME_NAME", width: "120px", className: 'nowrap isprint'},
                    {title: "单据编号", data: "VOU_NO", width: "120px", className: 'nowrap isprint'},
                    {title: "来源子系统", data: "ENU_NAME", width: "120px", className: 'nowrap isprint'},
                    {title: "操作类型", data: "OPT_NAME", width: "60px", className: 'nowrap isprint'},
                    {title: "结果", data: "RESULT", width: "60px", className: 'nowrap isprint'},
                    {title: "详细信息", data: "DETAIL", width: "200px", className: 'nowrap isprint',
                        render:function (data, type, rowdata, meta) {
                            var reg = /(<br>)+/g;
                            var newData = data.replace(reg,"");
                            return '<div style="overflow: hidden;text-overflow: ellipsis" title="'+newData+'">' + newData + '</div>';
                        }
                    },
                    {title: "操作人", data: "OPT_PERSON", width: "120px", className: 'nowrap isprint'},
                    {title: "操作时间", data: "OPT_TIME", width: "160px", className: 'nowrap isprint'}
                ];
                page.tableObj = $("#" + id).DataTable({
                    "language": {
                        "url": bootPath + "agla-trd/datatables/datatable.default.js"
                    },
                    "data": data.list,
                    "bRetrieve": true,
                    // "paging": false, // 禁止分页
                    "processing": true, //显示正在加载中
                    "pagingType": "full_numbers", //分页样式
                    // "lengthChange": true, //是否允许用户自定义显示数量p
                    // "lengthMenu": [
                    //     [10, 20, 50, 100, 200, -1],
                    //     [10, 20, 50, 100, 200, "全部"]
                    // ],
                    // "pageLength": 20,
                    "paging": false,
                    "serverSide": false,
                    "ordering": false,
                    "columns": columns,
                    "autoWidth": false,
                    // "dom": 'rt<"' + tableId + '-paginate"ilp>',
                    "dom":'<"datatable-toolbar"B>rt<"' + tableId + '-paginate"ilp>',
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
                    "initComplete": function () {
                        //打印&导出按钮
                        $('.datatable-toolbar').appendTo('#dtToolbar');
                        // $('#datatables-print').html('');
                        // $('#datatables-print').append($(".printButtons"));
                        $(".datatable-toolbar .buttons-print").addClass("btn-print btn-permission").attr({
                            "data-toggle": "tooltip",
                            "title": "打印"
                        });
                        //点打印
                        // $(".buttons-print").off().on('click', function() {
                        //     page.editor = ufma.showModal('tableprint', 450, 350);
                        //     // $('#rptStyle').html('');
                        //     var postSetData = {
                        //         agencyCode: page.agency.getValue(),
                        //         acctCode: "*",
                        //         componentId: "LP_BILL_GENERATE_LOG",
                        //         rgCode:svData.svRgCode,
                        //         setYear:svData.svSetYear,
                        //         sys:'110',
                        //         directory:'业务日志'
                        //     };
                        //     ufma.post("/pqr/api/report?sys=666",postSetData,function(result){
                        //         var data = result.data;
                        //         $('#rptTemplate').html('')
                        //         for(var i=0;i<data.length;i++){
                        //             var jData =data[i].reportCode
                        //             $op = $('<option value="'+jData+'">'+data[i].reportName+'</option>');
                        //             $('#rptTemplate').append($op);
                        //         }
                        //     });
                        // });

                        $(".datatable-toolbar .buttons-excel").addClass("btn-export btn-permission").attr({
                            "data-toggle": "tooltip",
                            "title": "导出"
                        });

                        var h = $(".ufma-container").height();
                        var tdH = h - $(".lp-selete-box").height() - $(".lp-query-box").height() - 42 - $(".rpt-table-box").height() - 26 - 100 - 130;
                        $("#" + id).find("td.dataTables_empty").height(tdH);

                        var toolBar = $(this).attr('tool-bar');
                        var $info = $(toolBar + ' .info');
                        if ($info.length == 0) {
                            $info = $('<div class="info"></div>').appendTo($(toolBar + ' .tool-bar-body'));
                        }
                        $info.html('');
                        $('.' + tableId + '-paginate').appendTo($info);

                        //导出begin
                        $(".datatable-toolbar .buttons-excel").off().on('click', function(evt) {
                            evt = evt || window.event;
                            evt.preventDefault();
                            uf.expTable({
                                title:'业务日志',
                                exportTable: '#' + tableId
                            });
                            // ufma.expXLSForDatatable($('#' + tableId), '业务日志');
                        });
                        //导出end

                        //表格模拟滚动条 驻底begin
                        $('#' + tableId).closest('.dataTables_wrapper').ufScrollBar({
                            hScrollbar: true,
                            mousewheel: false
                        });
                        ufma.setBarPos($(window));
                        // $("#" + tableId).fixedColumns({
                        //     // rightColumns: 1,//锁定右侧一列
                        //     leftColumns: 1//锁定左侧一列
                        // });
                        //驻底 E
                        ufma.isShow(page.reslist);
                        $('.datatable-toolbar [data-toggle="tooltip"]').tooltip();

                    },
                    "drawCallback": function (settings) {
                        // var twidth = 15 * colArr.length;
                        // $("#" + id).css("width", twidth + "%");
                        $("#" + id).find("td.dataTables_empty").text("")
                            .append('<img src="' + bootPath + 'images/noData.png"/><br/><i>目前还没有你要查询的数据</i>');
                        //按钮提示
                        $("[data-toggle='tooltip']").tooltip();
                        ufma.setBarPos($(window));
                    }
                });
                // return tableObj;
            },
            //加载单位
            getAgency: function (result) {
                var data = result.data;
                page.agency = $("#bdAgency2").ufmaTreecombox2({
                    valueField: 'id',
                    textField: 'codeName',
                    readOnly: false,
                    icon: 'icon-unit',
                    leafRequire: true,
                    popupWidth: 1.5,
                    data: data,
                    onchange: function (data) {
                        //请求单据方案
                        page.getSchemeTypes();
                        //缓存单位账套
                        var params = {
                            selAgecncyCode: data.id,
                            selAgecncyName: data.name,
                        }
                        ufma.setSelectedVar(params);
                    }
                });

                //默认选择单位S
                // var svData = ufma.getCommonData();
                if (data.length != 0) {
                    if (nowAgencyCode != "" && nowAgencyName != "") {
                        var agency = $.inArrayJson(data, 'id', nowAgencyCode);
                        if (agency != undefined) {
                            page.agency.val(nowAgencyCode);
                        } else {
                            page.agency.select(1);
                        }
                    } else {
                        page.agency.select(1);
                    }
                } else {
                    ufma.hideloading();
                }
            },
            //请求单据类型
            getSchemeTypes: function () {
                $('#showTable').empty();
                $('.lp-setting-box-body').html('');
                $('#vgMoreQuery').html('');
                page.queryIdx = [];
                $('.lp-query-box-right .tip-more').find('i').text('更多');
                $('.lp-query-box-right .tip-more').find('.glyphicon').addClass('icon-angle-bottom').removeClass('icon-angle-top');
                $('.lp-query-box-right .tip-more').hide();
                $(".lp-query-box-bottom").hide();
                //切换单位，单据类型改变
                $('#vgBillType').html('');
                $('.vgTargetBill').html('');

                var argu = {
                    rgCode:svData.svRgCode,
                    setYear:svData.svSetYear
                };
                ufma.get(interfaceURL.getSchemeTypes + page.agency.getValue(), argu, page.renderSchemeTypes);
            },
            //渲染单据方案列表
            renderSchemeTypes: function (result) {
                var data = result.data;
                $("#vgBillType").ufCombox({
                    idField: "schemeGuid",
                    textField: "schemeName",
                    data: data,
                    placeholder: "请选择单据方案",
                    onChange: function (sender, data) {

                    },
                    onComplete: function (sender) {
                        $(".uf-combox-input").attr("autocomplete", "off");
                        var schemeGuid = data[0].schemeGuid;
                        $("#vgBillType").getObj().val(schemeGuid);

                        //进入页面自动查询表格数据
                        setTimeout(function () {
                            $('#search-btn').trigger("click");
                        }, 200);
                    }
                });
            },
            //请求来源子系统
            getSonSystem: function () {
                var url = "VOU_SOURCE";
                var argu = {
                    rgCode:svData.svRgCode,
                    setYear:svData.svSetYear
                };
                ufma.get(interfaceURL.getEnumerateSytem + url, argu, page.renderSonSystem);
            },
            //初始化来源子系统
            initSonSys: function () {
                $("#sonSye").ufCombox({
                    idField: "ENU_CODE",
                    textField: "ENU_NAME",
                    placeholder: "请选择单据方案",
                    onChange: function (sender, data) {

                    }
                });
            },
            //渲染来源子系统列表
            renderSonSystem: function (result) {
                var data = result.data;
                $("#sonSye").ufCombox({
                    data: data,
                    onComplete: function (sender) {
                        $(".uf-combox-input").attr("autocomplete", "off");
                        var enuCode = data[0].ENU_CODE;
                        $("#sonSye").getObj().val(enuCode);
                    }
                });

                // var $btn;
                // for (var i = 0; i < data.length; i++) {
                //     if (i == 0) {
                //         $btn = $('<button class="btn btn-primary" type="button" data-code="' + data[i].ENU_CODE + '">' +
                //             data[i].ENU_NAME + '</button>');
                //     } else {
                //         $btn = $('<button class="btn btn-default" type="button" data-code="' + data[i].ENU_CODE + '">' +
                //             data[i].ENU_NAME + '</button>');
                //     }
                //     $('#sonSye').append($btn);
                // }
            },
            //查询条件切换
            changeBtns: function (t) {
                if (!t.hasClass("btn-primary")) {
                    //样式改变
                    t.removeClass("btn-default").addClass("btn-primary").siblings(".btn.btn-primary").removeClass("btn-primary").addClass("btn-default");
                    // page.billDataSearch();

                }
            },
            //返回本期时间
            dateBenQi: function (startId, endId, sel) {
                var ddYear = bennian;
                var ddMonth = benqi - 1;
                var tdd = new Date(ddYear, ddMonth + 1, 0);
                var ddDay = tdd.getDate();
                $("#" + startId).getObj().setValue(new Date(ddYear, ddMonth, 1));
                $("#" + endId).getObj().setValue(new Date(ddYear, ddMonth, ddDay));

            },
            //返回本年时间
            dateBenNian: function (startId, endId) {
                var ddYear = bennian;
                $("#" + startId).getObj().setValue(new Date(ddYear, 0, 1));
                $("#" + endId).getObj().setValue(new Date(ddYear, 11, 31));

            },
            //返回今日时间
            dateToday: function (startId, endId) {
                //	$(rpt.namespace).find("#"+startId+",#"+endId).datetimepicker('setDate',(new Date()));
                $("#" + startId + ",#" + endId).getObj().setValue(new Date(today));

            },
            initPage: function () {
                //权限控制
                page.reslist = ufma.getPermission();
                ufma.isShow(page.reslist);
                //默认本期
                var Year, Month, Day;
                // this.setDayInMonth();
                //初始化来源系统
                page.initSonSys();
                //初始化表格
                page.initTable("showTable", []);
                //请求单位树
                var argu = {
                    rgCode:svData.svRgCode,
                    setYear:svData.svSetYear
                };
                ufma.get(interfaceURL.getAgencyTree, argu, page.getAgency);
                //请求来源子系统
                page.getSonSystem();
                var date = new Date(today);
                var year = date.getFullYear();
                var glRptLedgerStartDate = {
                    format: 'yyyy-mm-dd',
                    initialDate: new Date(today),
                    onChange: function (fmtDate) {
                        if (fmtDate != "") {
                            var curDate = new Date(fmtDate)
                            var curYear = curDate.getFullYear();
                            // if (curYear !== "" && curYear !== undefined && year !== curYear) {
                            //     ufma.showTip("只能选择本年日期", function () {
                            //         $("#dateStart").getObj().setValue("")
                            //     }, "warning");

                            // }
                        }

                    }
                };
                var glRptLedgerEndDate = {
                    format: 'yyyy-mm-dd',
                    initialDate: new Date(today),
                    onChange: function (fmtDate) {
                        if (fmtDate != "") {
                            var curDate = new Date(fmtDate)
                            var curYear = curDate.getFullYear();
                            // if (year !== curYear) {
                            //     ufma.showTip("只能选择本年日期", function () {
                            //         $("#dateEnd").getObj().setValue("")
                            //     }, "warning");

                            // }
                        }
                    }
                };
                $("#dateStart").ufDatepicker(glRptLedgerStartDate);
                $("#dateEnd").ufDatepicker(glRptLedgerEndDate);
                page.dateBenQi("dateStart", "dateEnd");
            },
            onEventListener: function () {
                //点击单据类型
                $("#vgBillType").on("click", "button", function () {
                    //样式改变 S
                    $(this).removeClass("btn-default").addClass("btn-primary").siblings(".btn.btn-primary").removeClass("btn-primary").addClass("btn-default");
                    $(this).find(".badge").css({"background-color": "#49a9ee", color: "#fff"});
                    $(this).siblings("button").find(".badge").css({"background-color": "#ECF6FD", color: "#666"});
                    $(".uf-tooltip").find("button").attr("class", "btn btn-default").find(".badge").css({
                        "background-color": "#fff",
                        color: "#666"
                    });
                    //样式改变 E
                });
                //点击来源子系统
                $("#sonSye").on("click", "button", function () {
                    $(this).removeClass("btn-default").addClass("btn-primary").siblings(".btn.btn-primary").removeClass("btn-primary").addClass("btn-default");
                });
                //操作类型
                $("#optType").on("click", "button", function () {
                    page.changeBtns($(this));
                });
                //切换业务日期
                $("#vgTime").on("click", "button", function () {
                    if (!$(this).hasClass("btn-primary")) {
                        //样式改变
                        $(this).removeClass("btn-default").addClass("btn-primary").siblings(".btn.btn-primary").removeClass("btn-primary").addClass("btn-default");
                    }
                });
                $("#vgTime").find("#vgTimeYear").on("click", function () {
                    page.dateBenNian("dateStart", "dateEnd");
                });
                $("#vgTime").find("#vgTimeMonth").on("click", function () {
                    page.dateBenQi("dateStart", "dateEnd", true);
                });
                $("#vgTime").find("#vgTimeDay").on("click", function () {
                    page.dateToday("dateStart", "dateEnd");
                });
                //点选模版名称
                $("#temNames").on('click', 'button', function (e) {
                    if (!$(this).hasClass('btn-primary')) {
                        $(this).attr("class", "btn btn-primary").siblings("button").attr("class", "btn btn-default");
                    }
                });
                //查询
                $("#search-btn").on("click", function () {
                    page.billDataSearch();
                })
                
				// 修改为后端分页
				//分页尺寸下拉发生改变
				$(".ufma-table-paginate").on("change", ".vbPageSize", function () {
					pageLength = ufma.dtPageLengthbackend('showTable', $(".ufma-table-paginate").find(".vbPageSize").val());
					serachData.pageSize = $(".ufma-table-paginate").find(".vbPageSize").val();
					$(".vbDataSum").html("");
					$("#showTable tbody").html('');
					$("#tool-bar .slider").remove();
					$(".ufma-table-paginate").html("");
					page.billDataSearch(pageLength);
				});

				//点击页数按钮
				$(".ufma-table-paginate").on("click", ".vbNumPage", function () {
					if ($(this).find("a").length != 0) {
						serachData.currentPage = $(this).find("a").attr("data-gopage");
						serachData.pageSize = $(".ufma-table-paginate").find(".vbPageSize").val();
						$(".vbDataSum").html("");
						$("#showTable tbody").html('');
						$("#tool-bar .slider").remove();
						$(".ufma-table-paginate").html("");
						page.billDataSearch();
					}
				});

				//点击上一页
				$(".ufma-table-paginate").on("click", ".vbPrevPage", function () {
					if (!$(".ufma-table-paginate .vbPrevPage").hasClass("disabled")) {
						serachData.currentPage = $(this).find("a").attr("data-prevpage");
						serachData.pageSize = $(".ufma-table-paginate").find(".vbPageSize").val();
						$(".vbDataSum").html("");
						$("#showTable tbody").html('');
						$("#tool-bar .slider").remove();
						$(".ufma-table-paginate").html("");
						page.billDataSearch();
					}
				});

				//点击下一页
				$(".ufma-table-paginate").on("click", ".vbNextPage", function () {
					if (!$(".ufma-table-paginate .vbNextPage").hasClass("disabled")) {
						serachData.currentPage = $(this).find("a").attr("data-nextpage");
						serachData.pageSize = $(".ufma-table-paginate").find(".vbPageSize").val();
						$(".vbDataSum").html("");
						$("#showTable tbody").html('');
						$(".ufma-tool-btns").html('');
						$(".ufma-table-paginate").html("");
						page.billDataSearch();
					}
                });
                
                //更多、收起切换
                $(".tip-more").on("click", function () {
                    if ($(this).find("span").hasClass("icon-angle-bottom")) {
                        $(this).find("span").removeClass("icon-angle-bottom").addClass("icon-angle-top");
                        $(this).find("i").text("收起");
                        $(".more-condition-part").slideDown();
                    } else {
                        $(this).find("span").removeClass("icon-angle-top").addClass("icon-angle-bottom");
                        $(this).find("i").text("更多");
                        $(".more-condition-part").slideUp()
                    }

                });
                // $("#btn-tableprintsave").off().on('click', function() {
                //     var oTable = $('#showTable').dataTable();
                //     var tblData = oTable.fnGetData()
                //     var ztitle ={}
                //     for(var i=0;i<$("#showColSet table tbody tr").length;i++){
                //         if($("#showColSet table tbody tr").eq(i).find('input').is(':checked')){
                //             var code=$("#showColSet table tbody tr").eq(i).find('td').eq(0).attr('data-code').toLowerCase()+'name'
                //             var name=$("#showColSet table tbody tr").eq(i).find('td').eq(0).attr('data-code')
                //             ztitle[code] = name
                //         }
                //     }
                //     ufma.printForPT({
                //         printModal:$('#rptTemplate option:selected').val(),
                //         print:'preview',
                //         data:{data:[tblData]},
                //         headData:[ztitle]
                //     })
                //     page.editor.close();
                // });
                // $("#btn-tableprintqx").off().on('click', function() {
                //     page.editor.close();
                // })

            },
            billDataSearch: function() {
                var reqArgu = {};
                reqArgu.schemeGuid = $("#vgBillType").getObj().getValue();
                // reqArgu.sysId = $("#sonSye").getObj().getValue();
                reqArgu.optType = $("#optType").find('button[class="btn btn-primary"]').attr("data-id");
                reqArgu.optPerson = $("#opt-per-input").val();
                // reqArgu.agencyCode = svData.svAgencyCode;
                reqArgu.agencyCode = page.agency.getValue();
                reqArgu.dateFrom = $('#dateStart').getObj().getValue();
                reqArgu.dateTo = $('#dateEnd').getObj().getValue();
                reqArgu.rgCode = svData.svRgCode;
                reqArgu.setYear = svData.svSetYear;

                // 修改为后端分页
                reqArgu.currentPage = parseInt(serachData.currentPage);
                reqArgu.pageSize = parseInt(serachData.pageSize);
                ufma.showloading();
                ufma.post(interfaceURL.search, reqArgu, page.getBillData);
            },
            getBillData: function (result) {
                ufma.hideloading();
                var data = result.data.content;
                $("#showTable_wrapper").ufScrollBar('destroy');
                page.tableObj.clear().destroy();
                $("#showTable").empty();
                page.initTable("showTable", data);
                $("#billGenerateLog .ufma-table-paginate").empty();
                // 修改为后端分页
                var paging = result.data;
                // 分页部分功能 -- B
                //分页  不分页需判断
                if (paging.content.pageSize != 0) {
                    //创建基本分页节点
                    var $pageBase = $('<ul id="vbTable-pagination" class="pagination pagination-sm pull-left"></ul>');
                    //创建上一页节点  根据当前也判断是否可以点
                    var $pagePrev;
                    if ((paging.content.pageNum - 1) == 0) {
                        $pagePrev = $('<li class="vbPrevPage disabled"><span><span aria-hidden="true" class="glyphicon icon-angle-left"></span></span></li>');
                    } else {
                        $pagePrev = $('<li class="vbPrevPage"><a href="javascript:;" aria-label="Previous" data-prevpage=' + (paging.content.pageNum - 1) + '>' +
                            '<span aria-hidden="true" class="glyphicon icon-angle-left"></span>' +
                            '</a></li>');
                    }
                    $pageBase.append($pagePrev);
                    //创建页数节点,根据pageSize和凭证数据总数
                    //创建页数变量
                    var pageAmount = paging.content.pages;
                    var $pageItem;
                    for (var k = 1; k <= pageAmount; k++) {
                        //第一页和最后一页显示
                        if (k == 1 || k == pageAmount) {
                            //三元运算判断是否当前页
                            $pageItem = (k == paging.content.pageNum) ? $('<li class="vbNumPage active"><span data-gopage=' + k + '>' + k + ' <span class="sr-only">(current)</span></span></li>') : $('<li class="vbNumPage"><a href="javascript:;" data-gopage=' + k + '>' + k + '</a></li>');
                        } else {
                            //判断分页页数除去第一页和最后一页按钮的剩下的按钮数量是否大余3
                            if ((pageAmount - 2) <= 3) {
                                //三元运算判断是否当前页
                                $pageItem = (k == paging.content.pageNum) ? $('<li class="vbNumPage active"><span data-gopage=' + k + '>' + k + ' <span class="sr-only">(current)</span></span></li>') : $('<li class="vbNumPage"><a href="javascript:;" data-gopage=' + k + '>' + k + '</a></li>');
                            } else if ((pageAmount - 2) > 3) {
                                //判断当前页位置
                                if (paging.content.pageNum <= 2) {
                                    //分页按钮加载2到4之间
                                    if (k >= 2 && k <= 4) {
                                        //三元运算判断是否当前页
                                        $pageItem = (k == paging.content.pageNum) ? $('<li class="vbNumPage active"><span data-gopage=' + k + '>' + k + ' <span class="sr-only">(current)</span></span></li>') : $('<li class="vbNumPage"><a href="javascript:;" data-gopage=' + k + '>' + k + '</a></li>');
                                    }
                                } else if (paging.content.pageNum > 2 && paging.content.pageNum < (pageAmount - 1)) {
                                    //分页按钮加载pageNum-1到pageNum+1之间
                                    if (k >= (paging.content.pageNum - 1) && k <= (paging.content.pageNum + 1)) {
                                        //三元运算判断是否当前页
                                        $pageItem = (k == paging.content.pageNum) ? $('<li class="vbNumPage active"><span data-gopage=' + k + '>' + k + ' <span class="sr-only">(current)</span></span></li>') : $('<li class="vbNumPage"><a href="javascript:;" data-gopage=' + k + '>' + k + '</a></li>');
                                    }
                                } else if (paging.content.pageNum >= (pageAmount - 1)) {
                                    //分页按钮加载pageAmount-3到pageAmount-1之间
                                    if (k >= (pageAmount - 3) && k <= (pageAmount - 1)) {
                                        //三元运算判断是否当前页
                                        $pageItem = (k == paging.content.pageNum) ? $('<li class="vbNumPage active"><span data-gopage=' + k + '>' + k + ' <span class="sr-only">(current)</span></span></li>') : $('<li class="vbNumPage"><a href="javascript:;" data-gopage=' + k + '>' + k + '</a></li>');
                                    }
                                }
                            }
                        }
                        $pageBase.append($pageItem);
                    }
                    //创建下一页节点 根据当前页判断是否可以点
                    var $pageNext;
                    if ((pageAmount - paging.content.pageNum) == 0) {
                        $pageNext = $('<li class="vbNextPage disabled"><span><span aria-hidden="true" class="glyphicon icon-angle-right"></span></span></li>');
                    } else {
                        $pageNext = $('<li class="vbNextPage"><a href="javascript:;" aria-label="Next" data-nextpage=' + (paging.content.pageNum + 1) + '>' +
                            '<span aria-hidden="true" class="glyphicon icon-angle-right"></span>' +
                            '</a></li>');
                    }
                    $pageBase.append($pageNext);
                    $("#billGenerateLog .ufma-table-paginate").html($pageBase);
                }

                //创建分页大小基本节点
                var $pageSizeBase = $('<div class="pull-left" style="margin: 0 16px;"></div>');
                var $pageSel = $('<select class="vbPageSize bordered-input"></select>');
                //根据pageSize创建下拉列表
                //分页数组
                var pageArr = [20, 50, 100, 200, 500, 1000, 2000];
                var $pageOp;
                //定义是否不分页变量
                var isNoPaging;
                for (var n = 0; n < pageArr.length; n++) {
                    isNoPaging = (pageArr[n] == 0) ? "不分页" : pageArr[n];
                    if (pageArr[n] == serachData.pageSize) {
                        $pageOp = $('<option value=' + pageArr[n] + ' selected>' + isNoPaging + '</option>');
                    } else {
                        $pageOp = $('<option value=' + pageArr[n] + '>' + isNoPaging + '</option>');
                    }
                    $pageSel.append($pageOp);
                }
                $pageSizeBase.append("<span>显示 </span>");
                $pageSizeBase.append($pageSel);
                $pageSizeBase.append("<span> 条</span>");
                $("#billGenerateLog .ufma-table-paginate").prepend($pageSizeBase);

                //创建总数统计节点
                var $vouDataSum = $('<div class="pull-left">共 <span class="vbSum">' + (paging.content.total ? paging.content.total : 0) + '</span> 条</div>');
                $("#billGenerateLog .ufma-table-paginate").prepend($vouDataSum);
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
});