$(function () {
    var pageLength= ufma.dtPageLength('#glRptLedgerTable');
    var page = function () {

        var glRptLedgerDataTable;//全局datatable对象
        var glRptLedgerTable;//全局table的ID
        var glRptLedgerThead;//全局table的头部ID
        var isCrossDomain = false;

        //总账所用接口
        // rpt.urlPath = "http://127.0.0.1:8083";//本地调试
        rpt.urlPath = "";//服务器
        var portList = {
            getReport:rpt.urlPath+"/gl/rpt/getReportData/BIDA_RPT_LEDGER"//请求表格数据
            // getReport: rpt.urlPath + "/gl/rpt/getReportData/GL_RPT_LEDGER"//请求表格数据
        };

        //todo @莎姐 应该定义组织表头的公共方法，这个js中有3个方法都定义了这个columnsArr数组，应该定义在外层或者集成在rptcommon
        var columnsArr = [{
           data: "setYear",
           className: "isprint tc",
        }, //0年
           {
               data: "fisPerd",
               className: "isprint tc",
           }, //1月
           {
               data: "rowType"
           }, //-6行类型 	只有当rowType=1时，才允许联查
            {
                data:"agencyCode",
                render:function (data, type, rowdata, meta) {
                    if(!data){
                        return "";
                    }
                    return data;
                }
            },
            {data:"agencyName",
                render:function (data, type, rowdata, meta) {
                    if(!data){
                        return "";
                    }
                    return data;
                }
            },
            {data:"acctCode",
                render:function (data, type, rowdata, meta) {
                    if(!data){
                        return "";
                    }
                    return data;
                }
            },
            {data:"acctName",
                render:function (data, type, rowdata, meta) {
                    if(!data){
                        return "";
                    }
                    return data;
                }
            },
           {
               data: "descpt"
           }, //-5摘要
           {
               data: "drAmt",
               className:'isprint nowrap tr tdNum'
           }, //-4借方金额
           {
               data: "crAmt",
               className:'isprint nowrap tr tdNum'
           }, //-3贷方金额
           {
               data: "balSign"
           }, //-2方向
           {
               data: "balAmt",
               className:'isprint nowrap tr tdNum'
           } //-1余额
        ];


        return {

            //表格初始化
            // newTable:function(columnsArr, dataArr){
            newTable: function (dataArr) {
                var hideColumns;
                if(rpt2.isShowAgency && rpt2.isShowAcct){
                    hideColumns = [2];
                }else if(rpt2.isShowAgency){
                    hideColumns = [2,5,6];
                }else if(rpt2.isShowAcct){
                    hideColumns = [2, 3,4];
                }else{
                    hideColumns = [2, 3, 4, 5, 6];
                }

                var id = "glRptLedgerTable";//表格id
                var toolBar = $('#' + id).attr('tool-bar');
                page.glRptLedgerDataTable = page.glRptLedgerTable.DataTable({
                    "language": {
                        "url": bootPath + "agla-trd/datatables/datatable.default.js"
                    },
                    "fixedHeader": {
                        header: true,
                        footer: true
                    },
                    "data": dataArr,
                    "processing": true,//显示正在加载中
                    "pagingType": "full_numbers",//分页样式
                    "lengthChange": true,//是否允许用户自定义显示数量p
                    "lengthMenu": [
                        [10, 20, 50, 100, 200, -1],
                        [10, 20, 50, 100, 200, "全部"]
                    ],
                    "pageLength": pageLength,//默认每页显示100条--zsj--吉林公安需求
                    "ordering": false,
                    "columns": columnsArr,
                    "columnDefs": [
                        {
                            "targets": hideColumns,
                            "visible": false
                        },
                        {
                            "targets": [-5],
                            "render": function (data, type, full, meta) {
                                if (data != null) {
                                    if (full.rowType == "1" || full.rowType == "8") {
                                        return '<span data-year="' + full.setYear + '" data-month="' + full.fisPerd + '">' + data + '</span>';
                                    } else {
                                        return data;
                                    }
                                } else {
                                    return "";
                                }
                            },
                        },
                        {
                            "targets": [0, 1, 2, 3 -5, -2],
                            "className": "isprint"
                        },
                        {
                            "targets": [-4, -3, -1],
                            "className": "tdNum isprint",
                            "render": $.fn.dataTable.render.number(',', '.', 2, '')
                        }
                    ],
                    "dom": '<"printButtons"B>rt<"' + id + '-paginate"ilp>',
                    //"dom":'rt<"'+id+'-paginate"ilp>',
                    // "dom":'<"printButtons"B>rt<"tableBottom"<"tool-bar-body"<"ufma-tool-btns"><"info"<"'+id+'-paginate"ilp>>>><"tableBottomFix"<"tool-bar-body"<"ufma-tool-btns"><"info"<"'+id+'-paginate"ilp>>>>',
                    "buttons": [
                        {
                            extend: 'excelHtml5',
                            text: '<i class="glyphicon icon-upload" aria-hidden="true"></i>',
                            exportOptions: {
                                columns: '.isprint',
                                format: {
                                    header: function (data, columnIdx) {
                                        if ($(data).length == 0) {
                                            return data;
                                        } else {
                                            return $(data)[0].innerHTML;
                                        }
                                    }
                                }
                            },
                            customize: function (xlsx) {
                                var sheet = xlsx.xl.worksheets['sheet1.xml'];
                            }
                        }
                    ],
                    "initComplete": function () {
                        $("#printTableData").html("");
                        $("#printTableData").append($(".printButtons"));

                        $("#printTableData .buttons-excel").css("border-radius", "0 4px 4px 0").addClass("btn-export btn-permission").attr({
                            "data-toggle": "tooltip",
                            "title": "导出"
                        });
                        //导出begin
                        $("#printTableData .buttons-excel").off().on('click', function(evt) {
                            evt = evt || window.event;
                            evt.preventDefault();
                            uf.expTable({
                                title: '汇总总账',
                                topInfo:[
									['方案名称：'+$("#nowPrjName").html()]
								],
                                exportTable: '#' + id
                            });                        });
                        $('#printTableData.btn-group').css("position", "inherit");
                        $('#printTableData div.dt-buttons').css("position", "inherit");
                        $('#printTableData [data-toggle="tooltip"]').tooltip();
                        ufma.isShow(page.reslist);
                        //驻底begin
                        var toolBar = $(this).attr('tool-bar')
                        var $info = $(toolBar + ' .info');
                        if ($info.length == 0) {
                            $info = $('<div class="info"></div>').appendTo($(toolBar + ' .tool-bar-body'));
                        }
                        $info.html('');
                        $('.' + id + '-paginate').appendTo($info);

                        $('#' + id).closest('.dataTables_wrapper').ufScrollBar({
                            hScrollbar: true,
                            mousewheel: false
                        });
                        ufma.setBarPos($(window));
                        $("#tool-bar").width($(".rpt-workspace").width() - 224);
                        // $("#tool-bar").css("margin-left", "252px");
                        //驻底end

                        var timeId = setTimeout(function () {
                            //左侧树高度
                            var h = $(window).height() -88;
                            $(".rpt-acc-box-left").height(h);
                            var H = $(".rpt-acc-box-right").height();
                            if(H > h){
                                $(".rpt-acc-box-left").height(h + 48);
                                if($("#tool-bar .slider").length > 0){
                                    $(".rpt-acc-box-left").height(h + 52);
                                }
                            }
                            $(".rpt-atree-box-body").height($(".rpt-acc-box-left").height() - 96);
                            clearTimeout(timeId);
                        },200);
                        //固定表头
                        $("#glRptLedgerTable").fixedTableHead();
                        //金额区间-范围筛选
                        rpt.twoSearch(page.glRptLedgerTable);
                        // 点击表格行高亮
                        rpt.tableTrHighlight();
                    },
                    "drawCallback": function (settings) {
                        ufma.dtPageLength($(this));
                        page.glRptLedgerTable.find("td.dataTables_empty").text("")
                            .append('<img src="' + bootPath + 'images/noData.png"/><br/><i>目前还没有你要查询的数据</i>');

                        if ($(".rpt-table-sub-tip2 i").text() == "万元" && !$(".tdNum").hasClass("wanyuan")) {
                            $("td.tdNum").each(function () {
                                if ($(this).text() != "") {
                                    var num = $(this).text().replace(/\,/g, "");
                                    $(this).text(rpt.comdify(parseFloat(num / 10000).toFixed(6)));
                                }
                                $(this).addClass("wanyuan");
                            })
                        }
                        ufma.isShow(page.reslist);
                        ufma.setBarPos($(window));

                        //弹出明细账
                        // $(rpt.namespace).find("td span").on("click", function () {
                        //     page.openJournalShow(this);
                        // })

                        //设置底部工具栏的显隐
                        // rpt.showHide("glRptLedgerTable");

                        // var timeId = setTimeout(function () {
                        //     var h = $(".rpt-acc-box-right").height();
                        //     if(h < $(window).height()-57){
                        //         $("#tool-bar").animate({"top":h + 50 + "px"},"fast");
                        //     }
                        //     clearTimeout(timeId);
                        // },300);
                        //
                        // $(window).scroll(function () {
                        //     var h = $(".rpt-acc-box-right").height();
                        //     if(h < $(window).height()-57){
                        //         $("#tool-bar").animate({"top":h + 50 + "px"},"fast");
                        //     }
                        // });
                    }
                });

                return page.glRptLedgerDataTable;
            },

            //总账联查明细账
            openJournalShow: function (dom) {
                sessionStorage.removeItem(rpt.journalFormLedger);

                var year = $(dom).data("year");
                var month = $(dom).data("month");

                var accaCode = $(rpt.namespace + " #accaList").find(".btn-primary").data("code");//会计体系

                var tdd = new Date(year, month, 0);
                var ddDay = tdd.getDate();

                if (month.length == 1) {
                    month = "0" + month;
                }

                var startDate = year + "-" + month + "-01";//开始日期
                var endDate = year + "-" + month + "-" + ddDay;//结束日期

                var ACCOitems = rpt.qryItemsArr();//选中会计科目代码数组


                //var rptOption = rpt.rptOptionArr();//其他查询项

                var IS_INCLUDE_UNPOST = $("#IS_INCLUDE_UNPOST").prop("checked");
                var IS_INCLUDE_JZ = $("#IS_INCLUDE_JZ").prop("checked");
//				console.info(IS_INCLUDE_UNPOST+","+IS_INCLUDE_JZ);

                if (IS_INCLUDE_UNPOST) {
                    IS_INCLUDE_UNPOST = "Y"
                } else {
                    IS_INCLUDE_UNPOST = "N"
                }

                if (IS_INCLUDE_JZ) {
                    IS_INCLUDE_JZ = "Y"
                } else {
                    IS_INCLUDE_JZ = "N"
                }
                var arguObj = {
                    "acctCode": rpt.nowAcctCode,
//						"acctName":rpt.nowAcctName,
                    "agencyCode": rpt.nowAgencyCode,
//						"agencyName":rpt.nowAgencyName,
                    "prjCode": "",
                    "prjName": "",
                    "prjScope": "",
                    "rptType": "GL_RPT_JOURNAL",
                    "setYear": rpt.nowSetYear,
                    "userId": rpt.nowUserId,
                    "prjContent": {
                        "accaCode": accaCode,
                        "agencyAcctInfo": [{
                            "acctCode": rpt.nowAcctCode,
                            "agencyCode": rpt.nowAgencyCode
                        }],
                        "startDate": startDate,
                        "endDate": endDate,
                        "startYear": "",
                        "startFisperd": "",
                        "endYear": "",
                        "endFisperd": "",
                        "qryItems": ACCOitems,
                        "rptCondItem": [],
                        "rptOption": [
                            {"defCompoValue": IS_INCLUDE_UNPOST, "optCode": "IS_INCLUDE_UNPOST", "optName": "含未记账凭证"},
                            {"defCompoValue": IS_INCLUDE_JZ, "optCode": "IS_INCLUDE_JZ", "optName": "含结转凭证"},
                            {"defCompoValue": "N", "optCode": "IS_JUSTSHOW_OCCFISPERD", "optName": "只显示有发生期间"}
                        ],
                        "curCode": "RMB",
                        "rptStyle": "SANLAN",
                        "rptTitleName": "明细账"
                    }
                };
                arguObj.timeBtn = $(".rpt-query-btn-cont-date").find("button[class='btn btn-primary']").attr("id");
                var arguStr = JSON.stringify(arguObj);
                sessionStorage.setItem(rpt.journalFormLedger, arguStr);
                rpt.sessionKeyArr.push(rpt.journalFormLedger);
//				window.location.href = '../glRptJournal/glRptJournal.html?dataFrom=glRptLedger&action=query';

                // //门户打开方式
                // $(this).attr('data-href', '../../../gl/rpt/glRptJournal/glRptJournal.html?menuid=' + rpt.journalMenuId + '&dataFrom=glRptLedger&action=query');
                // $(this).attr('data-title', '明细账');
                // window.parent.openNewMenu($(this));
                var baseUrl = '/gl/rpt/glRptJournal/glRptJournal.html?menuid='+rpt.journalMenuId+'&dataFrom=glRptBal&action=query';
                // baseUrl = page.isCrossDomain ? '/pf' + baseUrl : '../../..' + baseUrl;
                baseUrl = '/pf' + baseUrl;
				uf.openNewPage(page.isCrossDomain, $(this), 'openMenu', baseUrl, false, "明细账");		
            },

            //初始化页面
            initPage: function () {
                //增加筛选框
                $(rpt.namespace + " .thTitle.rpt-th-zhaiyao-5").after($(rpt.backOneSearchHtml("摘要内容", "-5")));
                $(rpt.namespace + " .thTitle.rpt-th-jine-4").after($(rpt.backTwoSearchHtml("rpt-funnelBoxNum", "金额区间", "-4")));
                $(rpt.namespace + " .thTitle.rpt-th-jine3-3").after($(rpt.backTwoSearchHtml("rpt-funnelBoxNum3", "金额区间", "-3")));
                $(rpt.namespace + " .thTitle.rpt-th-jine3-1").after($(rpt.backTwoSearchHtml("rpt-funnelBoxNum3", "金额区间", "-1")));

                //需要根据自己页面写的ID修改
                page.glRptLedgerTable = $('#glRptLedgerTable');//当前table的ID
                page.glRptLedgerThead = $('#glRptLedgerThead');//当前table的头部ID

                // page.glRptLedgerDataTable = page.newTable(columnsArr);
                page.glRptLedgerDataTable = page.newTable();
                //page.glRptLedgerDataTable.ajax.url("glRptLedger.json");
                // 权限控制
                ufma.isShow(page.reslist);
                // //初始化单位样式
                // rpt.initAgencyList();
                //
                // //初始化账套样式
                // rpt.initAcctList();
                //
                // //请求单位列表
                // rpt.reqAgencyList();
                //请求左侧单位账套树
                // rpt2.atreeData();
                //请求科目体系
                rpt2.reqAccsList();
                //清空查询方案，并查询
                rpt.showPlan();
                //初始化查询方案
                rpt.initPageNew();

                $("#accList1,#accList2,#accList3,#accList4,#accList5").ufCombox({
                    idField: "accItemCode",
                    textField: "accItemName",
                    placeholder: "请选择",
                    readonly: true,
                    onChange: function (sender, data) {
                        /*
                        data=data.sort(
                                function compareFunction(item1,item2){
                                            return item1.accItemName.localeCompare(item2.accItemName,"zh");
                                }
                        )
                        */
                        var raun = true;
                        var senderid = sender.attr("id");
                        for (var i = 1; i < 6; i++) {
                            if ($("#accList" + i).getObj().getValue() == $("#" + senderid).getObj().getValue() && $("#" + senderid).getObj().getText() != '请选择' && senderid != 'accList' + i) {
                                if ($("#" + senderid).getObj().getText() != '请选择') {
                                    raun = false
                                    ufma.showTip("请勿选择重复科目辅助项", function () {
                                    }, "warning");
                                    $("#" + senderid).getObj().setValue("", "请选择")
                                }

                            }
                        }
                        if (raun) {
                            rpt.accHtml(sender, data)
                        }

                    },
                    onComplete: function (sender) {

                    }
                });

                //请求会计体系列表
                //rpt.reqAccaList();

                //请求查询条件其他选项列表
                rpt.reqOptList();

                // $(window).scroll(function () {
                // 	//设置底部工具栏的显隐
                // 	rpt.showHide("glRptLedgerTable");
                // })
                // $(window,page.glRptLedgerTable).resize(function(e){
                // 	//设置底部工具栏的显隐
                // 	rpt.showHide("glRptLedgerTable");
                // })
                $(window).resize(function () {
                    $("#tool-bar").find(".slider").width($(".rpt-workspace").width() - 252);
                    $("#tool-bar").width($(".rpt-workspace").width() - 224);
                });
                ufma.parseScroll();
            },

            //页面元素事件绑定使用jquery 的 on()方法
            onEventListener: function () {
                $(".label-more").on("click", function () {
                    var timeId = setTimeout(function () {
                        clearTimeout(timeId);
                        ufma.setBarPos($(window));
                        //金额区间-范围筛选
                        rpt.twoSearch(page.glRptLedgerTable);
                    }, 300)

                })
                //方案作用域单选
                rpt.raidoInputGroup("rpt-radio-span");
                //期间单选按钮组
                rpt.raidoBtnGroup("rpt-query-btn-cont-date");
                //按钮提示
                rpt.tooltip();

                //绑定日历控件
                var glRptLedgerDate = {
                    format: 'yyyy-mm',
                    viewMode: 'month',
                    initialDate: new Date(),
					onChange: function (fmtDate) {
						rpt.checkDate(fmtDate, "#dateStart")
					}
                };
                $("#dateStart,#dateEnd").ufDatepicker(glRptLedgerDate);
                rpt.dateBenQi("dateStart", "dateEnd");

                //选择期间，改变日历控件的值
                $(" #dateBq").on("click", function () {
                    rpt.dateBenQi("dateStart", "dateEnd");
                });
                $(" #dateBn").on("click", function () {
                    rpt.dateBenNian("dateStart", "dateEnd");
                });

                //单选会计体系
                $(rpt.namespace + " #accaList").on("click", "button", function () {
                    if (!$(this).hasClass("btn-primary")) {
                        //sessionStorage.clear();
                        if (rpt.sessionKeyArr.length > 0) {
                            for (var i = 0; i < rpt.sessionKeyArr.length; i++) {
                                sessionStorage.removeItem(rpt.sessionKeyArr[i]);
                            }
                        }
                        //还原查询条件
                        $(rpt.namespace).find('.rpt-method-list li').css({
                            "border": "1px solid rgba(16,142,233,0.30)",
                            "background": "rgba(16,142,233,0.20)"
                        }).removeClass("isUsed").find("span,b").css("color", "#108EE9");
                        rpt.clearTagsTree();
                        $(this).addClass("btn-primary").removeClass("btn-default");
                        $(this).siblings("button").removeClass("btn-primary").addClass("btn-default");
                    }
                })

                //查选方案列表的触摸效果
                rpt.methodPointer();

                //点击查询方案
                rpt.clickMethod();

                //使用共享方案
                rpt.useShareMethod();

                //删除查询方案
                rpt.deleteMethod();

                //打开-保存查询方案模态框
                rpt.openSaveMethodModal();

                //确认-保存查询方案
                $('#sureSaveMethod,#saveAs').on('click', function (e) {
                    if ($("#methodName").val().trim() != "") {
                        rpt.reqSavePrj($(e.target).is('#saveAs'));
                    } else {
                        ufma.showInputHelp('methodName', '<span class="error">方案名称不能为空</span>');
                        $('#methodName').closest('.form-group').addClass('error');
                    }
                });

                //输入方案名的提示
                rpt.methodNameTips();

                //编辑表格名称
                rpt.editTableTitle();

                //编辑金额单位
                rpt.changeMonetaryUnit();

                //下拉选择展开隐藏
                rpt.showSelectTree();
                //revise
                $("#oneAcco").parent().on("click", function (e) {
                    var radioType = $(this).parents(".rpt-query-li-cont").find(".rpt-query-li-action input[type='hidden']").val();
                    rpt.showHideTree(this, "ACCO", radioType);
                });

                //展开隐藏共享查询方案
                rpt.showHideShareMethod();

                //搜索隐藏显示--表格模糊搜索
                ufma.searchHideShow(page.glRptLedgerTable);
                // rpt.searchHideShow(page.glRptLedgerTable);

                //显示更多查询方案
                rpt.showMoreMethod();

                //显示/隐藏筛选框
                rpt.isShowFunnelBox();

                //摘要-模糊单项筛选
                rpt.oneSearch(page.glRptLedgerTable);

                //金额区间-范围筛选
                rpt.twoSearch(page.glRptLedgerTable);

                //查询总表
                $("#glRptLedger-query").on("click", function () {
                    if($('#dateStart').getObj().getValue() > $('#dateEnd').getObj().getValue()) {
                        ufma.showTip('开始月份不能大于结束月份！', function() {}, 'error');
                        return false;
                    }
                    var domUl = $("#ACCO-data-key").parents(".rpt-tree-view").find(".rpt-tags-list");
                    var tabArgu = rpt2.backTabArgu();
                    // var isTrue = false;
                    console.log(tabArgu);
                    var qryItems = tabArgu.prjContent.qryItems;
                    //总账里辅助项必需有一条确定的项才可以查询
                    //判断科目辅助项，如果没有选择科目辅助项提示选择，若选择了辅助项，没有选择具体项提示选择具体项，
                    // if (qryItems.length <= 0) {
                    //     ufma.showTip("请选择科目辅助项！", function () {
                    //     }, "warning");
                    //     return false;
                    // } else {
                    //     for (var i = 0; i < qryItems.length; i++) {
                    //         if (qryItems[i].items.length == 0) {
                    //             ufma.showTip("请选择" + qryItems[i].itemTypeName + "！", function () {
                    //                 $("#" + qryItems[i].itemType + "-data-key").focus();
                    //             }, "warning");
                    //             return false;
                    //         }
                    //     }
                    // }

                    //请求查询
                    var tabArgu = rpt2.backTabArgu();
                    if (tabArgu.acctCode === "") {
                        ufma.showTip("请选择至少一个账套", function () {
                        }, "warning");
                        return false;
                    }
                    var qryItems = tabArgu.prjContent.qryItems, res = false;
                    for (var i = 0; i < qryItems.length; i++) {
                        if (qryItems[i].itemType == "ACCO" && qryItems[i].items.length == 0) {
                            res = true;
                            break
                        }
                    }
                    if (res) {
                        ufma.showTip("请选择一项会计科目", function () { }, "warning")
                        return false
                    }
                    ufma.showloading('正在请求数据，请耐心等待...');
                    // 查询时，修改方案的查询次数
                    rpt.addQryCount(tabArgu.prjGuid);
                    // 重新查询方案列表
                    rpt.reqPrjList();
                    ufma.ajax(portList.getReport, "post", tabArgu, function (result) {
                        ufma.hideloading();
                        var tableHead = result.data.tableHead;
                        var tableData = result.data.tableData;
                        pageLength= ufma.dtPageLength('#glRptLedgerTable');
                        $('#glRptLedgerTable_wrapper').ufScrollBar('destroy');
                        page.glRptLedgerDataTable.clear().destroy();
                        page.glRptLedgerDataTable = page.newTable(tableData);
                        // page.glRptLedgerDataTable = page.newTable(columnsArr, tableData);
                    });
                    //按单位显示/按账套显示
                    $("#isShowAgency").on("click", function (e) {
                        var isShowAgency = $("#isShowAgency").prop("checked");
                        if (isShowAgency) {
                            rpt2.isShowAgency = true;
                        } else {
                            rpt2.isShowAgency = false;
                        }
                        // changeTableDate();
                    });
                    $("#isShowAcct").on("click", function (e) {
                        var isShowAcct = $("#isShowAcct").prop("checked");
                        if (isShowAcct) {
                            rpt2.isShowAcct = true;
                        } else {
                            rpt2.isShowAcct = false;
                        }
                        // changeTableDate();
                    })


                    // if($(domUl).find("li").length<2){
                    // 	ufma.showTip("请选择会计科目！",function(){
                    // 		$("#ACCO-data-key").focus();
                    // 	},"warning");
                    // 	$("#ACCO-data-key").focus();
                    // 	return false;
                    // }else{
                    // 	var tabArgu = rpt.backTabArgu();
                    //
                    // 	ufma.ajax(portList.getReport,"post",tabArgu,function(result){
                    // 		var tableHead = result.data.tableHead;
                    // 		var tableData = result.data.tableData;
                    //
                    // 		page.glRptLedgerDataTable.clear().destroy();
                    // 		page.glRptLedgerDataTable = page.newTable(columnsArr, tableData);
                    // 	});
                    // }
                });

                //2019-5-7不知道干嘛用的注释掉了，代码影响界面显示
                // $(".rpt-p-search-key").find("input").on("blur", function () {
                //     $(this).val("");
                // });

                //点击推荐操作
                rpt.clickTips();

                //打印
                $(".btn-print").on("click", function () {
                    rpt.rptPrint("glRptLedger", "glRptLedgerTable", "SANLAN");
                });
                //返回
                $(".menuBtn").on("click", function () {
                    rpt2.openTabMenu(this);
                });
                $(".btn-print").off().on('click', function() {
                    page.editor = ufma.showModal('tableprint', 450, 350);
                    $('#rptStyle').html('')
                    var searchFormats = {};
                    searchFormats.agencyCode = "*";
                    searchFormats.acctCode = "*";
                    searchFormats.componentId = 'GL_RPT_LEDGER';
                    ufma.post("/gl/GlRpt/RptFormats",searchFormats,function(result){
                        var data = result.data;
                        for(var i=0;i<data.length;i++){
                            var $op = $('<option value="'+data[i].rptFormat+'">'+data[i].rptFormatName+'</option>');
                            $('#rptStyle').append($op);
                        }
                        $('#rptStyle').val("SANLAN");
                        var postSetData = {
                            agencyCode: "*",
                            acctCode: "*",
                            componentId: $('#rptType option:selected').val(),
                            rgCode:pfData.svRgCode,
                            setYear:pfData.svSetYear,
                            sys:'100',
                            directory:'总账'+$('#rptStyle option:selected').text()
                        };
                        ufma.post("/pqr/api/report?sys=100",postSetData,function(result){
                            var data = result.data;
                            $('#rptTemplate').html('')
                            for(var i=0;i<data.length;i++){
                                var jData =data[i].reportCode
                                $op = $('<option value="'+jData+'">'+data[i].reportName+'</option>');
                                $('#rptTemplate').append($op);
                            }
                        });
                    });
                });
                $('#rptStyle').on('change', function() {
                    var postSetData = {
                        agencyCode: rpt.nowAgencyCode,
                        acctCode: rpt.nowAcctCode,
                        componentId: $('#rptType option:selected').val(),
                        rgCode:pfData.svRgCode,
                        setYear:pfData.svSetYear,
                        sys:'100',
                        directory:'总账'+$('#rptStyle option:selected').text()
                    };
                    ufma.post("/pqr/api/report?sys=100",postSetData,function(result){
                        var data = result.data;
                        $('#rptTemplate').html('')
                        for(var i=0;i<data.length;i++){
                            var jData =data[i].reportCode
                            $op = $('<option value="'+jData+'">'+data[i].reportName+'</option>');
                            $('#rptTemplate').append($op);
                        }
                    });
                })
                $("#btn-tableprintsave").off().on('click', function() {
                    var oTable = $('#glRptLedgerTable').dataTable();
                    var tblData = oTable.fnGetData()
                    var ztitle ={}
                    for(var i=0;i<$("#showColSet table tbody tr").length;i++){
                        if($("#showColSet table tbody tr").eq(i).find('input').is(':checked')){
                            var code=$("#showColSet table tbody tr").eq(i).find('td').eq(0).attr('data-code').toLowerCase()+'name'
                            var name=$("#showColSet table tbody tr").eq(i).find('td').eq(0).attr('data-code')
                            ztitle[code] = name
                        }
                    }
                    ufma.printForPT({
                        printModal:$('#rptTemplate option:selected').val(),
                        print:'blank',
                        data:{data:[tblData]},
                        headData:[ztitle]
                    })
                    page.editor.close();
                });
                $("#btn-tableprintqx").off().on('click', function() {
                    page.editor.close();
                })
            },
            //此方法必须保留
            init: function () {
                page.reslist = ufma.getPermission();
                ufma.parse();
                this.initPage();
                this.onEventListener();
            }
        }
    }();

    /////////////////////
    page.init();
    $(window).scroll(function () {
        if ($(this).scrollTop() > 30) {
            $(".rpt-acc-box-left").css("top", "12px");
        } else {
            $(".rpt-acc-box-left").css("top", "58px");
        }
    });
    window.addEventListener('message', function (e) {
        if (e.data.hasOwnProperty('messageType') && e.data.messageType == 'clientWidth') {
                page.isCrossDomain = true;
        } else {
                page.isCrossDomain = false;
        }
    });
});