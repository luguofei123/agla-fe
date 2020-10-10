$(function () {
    var agencyCbb = null;
    var agencyCode = null;
    var setYear = null;
    var pnlFindRst = null;
    var pnlFindRst_modal = null;
    var curAgencyData = null;
    var curBgPlanData = null; //主界面的预算方案
    var curBgPlanEleMsg = null;
    var tblDt = null; //指标数据
    var tblId = "mainTable-unallocateBgItemToLower";
    var tblPrintBtnClass = "mainTable-unallocateBgItemToLower-printBtn";
    var tblPrintBtnClassExpXls = "mainTable-unallocateBgItemToLower-expXlsBtn";
    var tblObj = null;
    var addModal = null; //新增模态框的对象
    var modal_curBgPlan = null; //浮层的预算方案
    var modal_curBgPlanEleMsg = null;
    var modalTblId = "unallocateBgItemToLowerTable_obligate";
    var modalTblId2 = "unallocateBgItemToLowerTable_obligateA";
    var modal_tableObj = null;
    var modal_tableObj2 = null;
    var modalCurBgBill = null;
    var modal_selectedItems = [];
    var progressController = null; //浮层进度条的控制器
    var modal_clearTableAfterSave = false; //保存后清空表格
    var modal_billAttachment = []; //单据的附件
    var billType = 6; //1=指标单据新增(可执行-社保) 2=分解单 3=调剂单 4=调整单 5=待分配(社保) 6=下拨单(社保) 7=分配单(社保)
    var bgItemFrom_billType = 5; //指标来源的单据类型：5=待分配指标
    var bgReserve = 2; //1 可执行指标    2 预留指标
    var maxDetailCount_eachBill = 6; //每条单据最大的显示行数
    var modal_refreshWhenClose = false;
    var modal_open_readOnly = false;
    var modal_open_type = 1; // 模态框打开的方式。1=新增状态打开   2=修改状态打开。默认是1.
    var modal_tab2_fromTree = null;
    var modal_tab2_toTree = null;

    var moreMsgSetting = {
        "agencyCode": agencyCode,
        dateTimeAtFirst: true,
        showMoney: false,
        computHeight: function (tblH_before, tblH_after) {
            var divAfter = $("#mainTableDiv").find(".dataTables_scrollBody").height() +
                (parseInt(tblH_before) - parseInt(tblH_after));
            $("#mainTableDiv").find(".dataTables_scrollBody").css("height", divAfter + "px");
        },
        changeBgPlan: function (data) {
            curBgPlanData = data;
            curBgPlanEleMsg = _BgPub_GetBgPlanEle(curBgPlanData);
            // showTblData(false);
            pnlFindRst.doFindBtnClick();
        },
        afterFind: function (data) {
            tblDt = data;
        },
        doFindBySelf: function (eleCdtn) {
            showTblData(false, eleCdtn);
        }
    };

    var getTabSetState = function () {
        var $selNav = $(".nav.nav-tabs").find("li.NAVSELECT");
        var statusNav = $selNav.find("a").attr("data-status");
        return statusNav; // O=未审核 A=已审核 其他=全部
    };

    var moreMsgSetting_modal = {
        "agencyCode": agencyCode,
        showMoney: false,
        dateTimeAtFirst: true,
        computHeight: function (tblH_before, tblH_after) {

        },
        changeBgPlan: function (data) {
            modal_curBgPlan = data;
            modal_curBgPlanEleMsg = _BgPub_GetBgPlanEle(modal_curBgPlan);
            showModalTblData_obligate(false);
        },
        afterFind: function (data) {},
        doFindBySelf: function (eleCdtn) {
            showModalTblData_obligate(false, eleCdtn);
        }
    };

    /**
     * 用于处理_bgPub_requestUrlArray_socialSec[0\19]返回的请求的data参数
     * @param  {[type]} urlData [description]
     * @param {[boolean]} notAddBillTitleRow [是否增加单据头这一行。false=增加  true=不增加。默认false]
     * @return {[type]}         [description]
     */
    var organizeMainTblDataByURLResponse = function (urlData, notAddBillTitleRow) {
        var rst = [];
        var totalMoney = 0;
        if ($.isNull(urlData) || $.isNull(urlData.billWithItemsVo) || urlData.length == 0) {
            return rst;
        }
        for (var i = 0; i < urlData.billWithItemsVo.length; i++) {
            //****** 单据头部 **********
            var tmpBill = urlData.billWithItemsVo[i];
            var billTitle = new bgItemObj();
            billTitle.billId = tmpBill.billId;
            billTitle.billCode = tmpBill.billCode;
            billTitle.billDate = tmpBill.billDate;
            billTitle.agencyCode = tmpBill.agencyCode;
            billTitle.setYear = tmpBill.setYear;
            billTitle.billCur = tmpBill.billCur;
            billTitle.status = tmpBill.status;
            billTitle.createUser = tmpBill.createUser;
            billTitle.createDate = tmpBill.createDate;
            billTitle.createUserName = tmpBill.createUserName;
            billTitle.checkDate = tmpBill.checkDate;
            billTitle.checkUser = tmpBill.checkUser;
            billTitle.checkUserName = tmpBill.checkUserName;
            billTitle.isBill = 1;
            billTitle.isMore = 0;
            billTitle.bgItemUnAllotCurShow = 0;
            billTitle.bgItemCurShow = 0.00;
            billTitle.comeDocNum = "";
            billTitle.sendDocNum = "";
            if ($.isNull(notAddBillTitleRow) || !notAddBillTitleRow) {
                rst[rst.length] = billTitle;
            }
            totalMoney = totalMoney + tmpBill.billCur;

            //****** 单据明细 **************
            for (var j = 0; j < tmpBill.billWithItems.length; j++) {
                if (j == maxDetailCount_eachBill) {
                    break;
                }
                var tmpBgItem = tmpBill.billWithItems[j];
                tmpBgItem.billId = tmpBill.billId;
                tmpBgItem.billCode = tmpBill.billCode;
                tmpBgItem.isBill = 0;
                tmpBgItem.isMore = 0;
                tmpBgItem.createUser = tmpBill.createUser;
                tmpBgItem.createDate = tmpBill.createDate;
                tmpBgItem.checkDate = tmpBill.checkDate;
                tmpBgItem.checkUser = tmpBill.checkUser;
                tmpBgItem.bgItemUnAllotCurShow = $.formatMoney(tmpBgItem.bgItemUnAllotCur, 2);
                tmpBgItem.bgItemCurShow = $.formatMoney(tmpBgItem.bgItemCur, 2);
                rst[rst.length] = tmpBgItem;
            }

            //***** 单据结尾 **************
            var billBottom = new bgItemObj();
            billBottom.billId = tmpBill.billId;
            billBottom.billCode = tmpBill.billCode;
            billBottom.billDate = tmpBill.billDate;
            billBottom.agencyCode = tmpBill.agencyCode;
            billBottom.setYear = tmpBill.setYear;
            billBottom.billCur = tmpBill.billCur;
            billBottom.status = tmpBill.status;
            billBottom.checkDate = tmpBill.checkDate;
            billBottom.checkUser = tmpBill.checkUser;
            billBottom.isBill = 0;
            billBottom.isMore = 1;
            billBottom.bgItemUnAllotCurShow = 0;
            billBottom.bgItemCurShow = 0;
            billBottom.comeDocNum = "";
            billBottom.sendDocNum = "";
            if ($.isNull(notAddBillTitleRow) || !notAddBillTitleRow) {
                rst[rst.length] = billBottom;
            }
        }
        $("#span_billsCount").text(urlData.billWithItemsVo.length + "");
        $("#span_billsTotalMoney").text(jQuery.formatMoney(totalMoney + "", 2) + "");
        return rst;
    }

    /**
     * 根据单据ID，从主表中删除单据
     * @param  {[type]} billId [description]
     * @return {[type]}        [description]
     */
    var removeBillFromMainTable = function (billId) {
        var dtData = $("#" + tblId).DataTable().rows().data();
        for (var i = dtData.length - 1; i >= 0; i--) {
            var rowObj = dtData[i];
            if (rowObj.billId === billId) {
                $("#" + tblId).DataTable().row(i).remove();
            }
        }
        $("#" + tblId).DataTable().draw();
    };
    /**
     * guohx add 解决筛选不含预算方案的下拨单位
     */
    var checkAgencycode = function (allocatedAgency) {
        var url = '/bg/unallocateBudgetItem/checkAgencyCodeAllot';
        var argu = {
            "chrCode": modal_curBgPlan.chrCode,
            "setYear": ufma.getCommonData().svSetYear,
            "chrName": modal_curBgPlan.chrName,
            "items": allocatedAgency
        };
        var callback = function (result) {}
        ufma.post(url, argu, callback);
    };
    /**
     * 给主界面的表格添加事件监听
     * @return {[type]} [description]
     */
    var addListenerToMainTable = function () {
        /**
         * 事件一，删除(单据)  按钮点击事件
         * @param  {[type]} e [description]
         * @return {[type]}   [description]
         * getURL(0) + "/bg/budgetItem/multiPost/delBudgetItems",  //5  指标删除/指标单据删除-多岗
         */
        $("#btn-del").off("click").on("click", function (e) {
            if (getTabSetState() == "A") {
                ufma.showTip("已审核单据不能删除", null, "warning");
                return false;
            }
            var rows = $("#" + tblId).dataTable().fnGetNodes();
            var iDelCount = 0;
            var url = _bgPub_requestUrlArray_socialSec[5] + "?billType=" + billType + "&agencyCode=" + agencyCode;
            var requestObj = {
                "agencyCode": agencyCode,
                items: []
            };
            for (var k = 0; k < rows.length; k++) {
                var row = rows[k];
                if ($(row).find("td:eq(0):has(label)").length > 0) {
                    if ($(row).find("td:eq(0):has(label)").find("input[type='checkbox']").is(":checked") == true) {
                        //此行进行删除
                        var rowDt = tblObj.row(row).data();
                        if (rowDt.status == "1") {
                            requestObj.items[requestObj.items.length] = {
                                "billId": rowDt.billId,
                                "bgItemId": ""
                            };
                            iDelCount++;
                        }
                    }
                }
            }
            if (iDelCount == 0) {
                ufma.showTip("请选择要删除的单据", null, "warning");
            } else {
                ufma.confirm("确定要删除所选的单据吗?",
                    function (action) {
                        if (action) {
                            ufma.post(
                                url,
                                requestObj,
                                function (result) {
                                    if (result.flag == "success") {
                                        ufma.showTip("删除成功", null, "success");
                                        setTimeout(function () {
                                            pnlFindRst.doFindBtnClick();
                                        }, 1000);
                                    } else {
                                        ufma.showTip("删除失败！" + result.msg, null, "error");
                                    }
                                }
                            )
                        }
                    });
            }
        });
        /**
         * 事件二，添加  每行 第一列 checkbox的勾选监听
         * @param  {[type]} e [description]
         * @return {[type]}   [description]
         */
        $("#" + tblId + " input[name='mainRowCheck']").off("change").on("change", function (e) {
            var selected = ($(this).is(":checked") == true);
            var $curRow = $(this).closest("tr");
            var rowCount = $(this).closest("tbody").find("tr").length;

            if (selected) {
                $curRow.addClass("selected");
                $curRow = $curRow.next();
                while ($curRow.find("td:eq(0):has(label)").length == 0) {
                    $curRow.addClass("selected");
                    if ($curRow.index() == (rowCount - 1)) {
                        break;
                    } //到最后一个节点，退出，别死循环了
                    $curRow = $curRow.next();
                }
            } else {
                $curRow.removeClass("selected");
                $curRow = $curRow.next();
                while ($curRow.find("td:eq(0):has(label)").length == 0) {
                    $curRow.removeClass("selected");
                    if ($curRow.index() == (rowCount - 1)) {
                        break;
                    } //到最后一个节点，退出，别死循环了
                    $curRow = $curRow.next();
                }
            }
        });

        /**
         * 事件三， 为表格的 单据头部行 增加点击事件，进入单据的编辑界面
         * @param  {[type]} e [description]
         * @return {[type]}   [description]
         */
        $("a.billRow-a").off("click").on("click", function (e) {
            var billId = tblObj.row($(this).closest("tr")).data().billId;
            var bill = null;
            for (var i = 0; i < tblDt.billWithItemsVo.length; i++) {
                if (tblDt.billWithItemsVo[i].billId == billId) {
                    bill = $.extend({}, tblDt.billWithItemsVo[i]);
                    break;
                }
            }
            if (bill != null) {
                var itemsArr = bill.billWithItems.concat();
                bill.items = itemsArr;
                bill.isNew = "否";
                doLoadModalWithData(bill);
            }
        });

        /**
         * 事件四， 每行最后一列的  编辑  图标， 添加响应事件
         * @param  {[type]} e [description]
         * @return {[type]}   [description]
         */
        $("#" + tblId + " tbody").find("span.mainEditSpan").off("click").on("click", function (e) {
            $(this).closest("tr").find("a.billRow-a").trigger("click");
        });
        /**
         * 事件五， 每行最后一列的  日志  图标， 添加响应事件
         * @param  {[type]} e [description]
         * @return {[type]}   [description]
         */
        $("#" + tblId + " tbody").find("span.mainLogSpan").off("click").on("click", function (e) {

        });
        /**
         * 事件六， 每行最后一列的  删除  图标， 添加响应事件
         * @param  {[type]} e [description]
         * @return {[type]}   [description]
         */
        $("#" + tblId + " tbody").find("span.mainDelSpan").off("click").on("click", function (e) {
            var tmpBill = $("#" + tblId).DataTable().row($(this).closest("tr")).data();

            if (tmpBill.status == "3") {
                ufma.showTip("已审核单据不能删除", null, "warning");
                return false;
            }

            var url = _bgPub_requestUrlArray_socialSec[5] + "?billType=" + billType + "&agencyCode=" + agencyCode;
            var requestObj = {
                "agencyCode": agencyCode,
                items: [{
                    "billId": tmpBill.billId,
                    "bgItemId": ""
                }]
            };
            ufma.confirm("确定要删除本条单据[" + tmpBill.billCode + "]吗?",
                function (action) {
                    if (action) {
                        ufma.post(
                            url,
                            requestObj,
                            function (result) {
                                if (result.flag == "success") {
                                    ufma.showTip("删除成功", null, "success");
                                    setTimeout(function () {
                                        pnlFindRst.doFindBtnClick();
                                    }, 1000);
                                } else {
                                    ufma.showTip("删除失败！" + result.msg, null, "error");
                                }
                            }
                        )
                    }
                });
        });


    };

    /**
     * 表格金额输入发生了变动后的处理, 修改对应的data
     */
    var tbl_afterInputMoney_cellChange = function (value, doc) {
        var tbl = $("#" + modalTblId2).DataTable();
        var val = value;
        if (val == null || val == '') {
            val = '0';
        }
        tbl.cell(doc).data(val);
        tbl.row(doc).data().shouldSave = "1";
    };

    /**
     * 根据传入的tabData加载表格数据
     * @param  {[type]} tabData 绘制表格的data, url.data
     * @return {[type]}         [description]
     */
    var doPaintTable = function (tabData) {
        var tblCols = [
            /**
             * 第一列，checkbox
             */
            {
                data: "",
                title: "",
                class: "notPrint",
                width: "30px"
            },
            {
                data: "bgItemCode",
                title: "指标编码",
                class: "print",
                width: "100px"
            },
            {
                data: "bgItemSummary",
                title: "摘要",
                class: "print",
                width: "200px"
            }
        ];
        if (currentplanData.isComeDocNum == "是") {
            tblCols.push({
                data: "comeDocNum",
                title: "来文文号",
                class: "print",
                width: "200px"
            });
        }
        if (currentplanData.isSendDocNum == "是") {
            tblCols.push({
                data: "sendDocNum",
                title: "发文文号",
                class: "print",
                width: "200px"
            });
        }
        //循环添加预算方案的要素信息
        for (var index = 0; index < curBgPlanEleMsg.eleCodeArr.length; index++) {
            tblCols.push({
                data: _BgPub_getEleDataFieldNameByCode(curBgPlanEleMsg.eleCodeArr[index], curBgPlanEleMsg.eleFieldName[index]),
                title: curBgPlanEleMsg.eleNameArr[index],
                class: "print",
                width: "200px"
            });
        }
        //添加最后的金额，日期，操作列
        tblCols.push({
            data: "bgItemCurShow",
            title: "金额",
            class: "bgPubMoneyCol print",
            width: "100px"
        });
        tblCols.push({
            data: "createDate",
            title: "录入日期",
            class: "print",
            width: "100px"
        });
        tblCols.push({
            data: "bgItemId",
            title: "操作",
            class: "notPrint",
            width: "100px"
        });

        var colDefs = [{
            "targets": [-1],
            "serchable": false,
            "orderable": false,
            "render": function (data, type, rowdata, meta) {
                return '<a class="btn btn-icon-only btn-sm" data-toggle="tooltip" action= "unactive" ' +
                    'rowid="' + data + '" title="编辑">' +
                    '<span class="glyphicon icon-edit mainEditSpan"></span></a>' +

                    // '<a class="btn btn-icon-only btn-sm" data-toggle="tooltip" action= "unactive" ' +
                    // 'rowid="' + data + '" title="日志">' +
                    // '<span class="glyphicon icon-file mainLogSpan"></span></a>' +

                    '<a class="btn btn-icon-only btn-sm" data-toggle="tooltip" action= "unactive" ' +
                    'rowid="' + data + '" title="删除">' +
                    '<span class="glyphicon icon-trash mainDelSpan"></span></a>';
            }
        }, {
            "targets": [0],
            "serchable": false,
            "orderable": false,
            "render": function (data, type, rowdata, meta) {
                return '<label class="mt-checkbox mt-checkbox-single mt-checkbox-outline"> ' +
                    '<input type="checkbox" name="mainRowCheck" />' +
                    '<span></span> ' +
                    '</label>';
            }
        }];
        var mainTableData = organizeMainTblDataByURLResponse(tabData);
        var bNotAutoWidth = true; //默认是取消自动宽度；
        if (mainTableData.length == 0) {
            bNotAutoWidth = false;
        }

        var sScrollY = $(".workspace").outerHeight(true) - $(".workspace-top").outerHeight(true) -
            $("#bgMoreMsgPnl").outerHeight(true) - 12 - $(".nav").outerHeight(true) -
            $("#tableTotalShow").outerHeight(true) - 38 - 34 - 30;
        var tblSetting = {
            "data": mainTableData,
            "columns": tblCols,
            "columnDefs": colDefs,
            // "pagingType" : "simple_numbers",
            "paging": false,
            "ordering": false,
            "lengthChange": false,
            "processing": true, // 显示正在加载中
            "bSort": false, // 排序功能
            "autoWidth": bNotAutoWidth, //配合列宽，注意，TRUE的时候是关闭自动列宽，坑死了
            "scrollX": true,
            "scrollY": sScrollY,
            "select": true,
            "bDestroy": true,
            "dom": 'Brt', //<"rightDiv" p>
            "buttons": [{
                "extend": "print",
                "className": tblPrintBtnClass + " bgHide",
                "text": "打印",
                "autoPrint": true
            }, {
                'extend': 'excel',
                "className": tblPrintBtnClassExpXls + " bgHide",
                'text': '导出', //定义导出excel按钮的文字
                'exportOptions': {
                    'modifier': {
                        'page': 'current'
                    },
                    'rows': function (idx, data, node) {
                        if (data.isBill === 1 || data.isMore === 1) {
                            return false;
                        } else {
                            return true;
                        }
                    },
                    'columns': ".print"
                }
            }],
            "initComplete": function () { //修改 guohx   增加按钮上弹出中文提示功能  20170925
                $("#unallocateBgItemToLower-print").attr({
                    "data-toggle": "tooltip",
                    "title": "打印"
                });
                $("#btn_toLowerExp").attr({
                    "data-toggle": "tooltip",
                    "title": "导出"
                });
                $('button[data-toggle="tooltip"]').tooltip();
            },
            "drawCallback": function (settings, json) { //合并单元格
                var tmpTbl = $("#" + tblId).dataTable();
                var rows = tmpTbl.fnGetNodes(); ////fnGetNodes获取表格所有行，rows[i]表示第i行tr对象
                var colspanCount = 2 + curBgPlanEleMsg.eleCodeArr.length + 2; //指标编码+摘要+要素列+金额+录入日期
                var rowspan_firstNode = null;
                var rowspan_lastNode = null;
                var rowspanCount = 1;

                //1， 单据头部的横向合并
                for (var i = 0; i < rows.length; i++) {
                    var row = rows[i];
                    var rowData = tmpTbl.api().row(row).data();
                    if (rowData.isBill == 1) { //说明这行是单子头部信息，要进行合并
                        var billTitle_checkMsg = '';
                        if (rowData.status == "3") { //审核标签下显示审核人和审核日期
                            billTitle_checkMsg =
                                "审核日期:&nbsp;" + rowData.checkDate + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" +
                                "审核人&nbsp;:" + rowData.checkUserName + "&nbsp;&nbsp;&nbsp;&nbsp;";
                        }
                        var startRowNodeHtml = $(row).find("td:eq(0)").html();
                        var lastRowNodeHtml = $(row).find("td:eq(" + (colspanCount + 1) + ")").html();
                        var midRowColSpanHtml = "<a class='billRow-a' href='javascript:;'>单据编号:&nbsp;" + rowData.billCode + "&nbsp;&nbsp;&nbsp;&nbsp;" +
                            "单据日期:&nbsp;" + rowData.billDate + "&nbsp;&nbsp;&nbsp;&nbsp;" +
                            "单据金额:&nbsp;" + jQuery.formatMoney(rowData.billCur + "", 2) + "&nbsp;&nbsp;&nbsp;&nbsp;" +
                            "制单人&nbsp;:" + rowData.createUserName + "&nbsp;&nbsp;&nbsp;&nbsp;" +
                            billTitle_checkMsg + "</a>"; //点击进入查看单据界面
                        $(row).empty();
                        $(row).append("<td>" + startRowNodeHtml + "</td>" +
                            "<td colspan='" + colspanCount + "'>" + midRowColSpanHtml + "</td>" +
                            "<td>" + lastRowNodeHtml + "</td>");
                    } else if (rowData.isMore == 1) { //说明这行是单位的尾部信息，要添加更多的点击按钮
                        var startRowNodeHtml1 = $(row).find("td:eq(0)").html();
                        var lastRowNodeHtml1 = $(row).find("td:eq(" + (colspanCount + 1) + ")").html();
                        var midRowColSpanHtml1 = "<a class='billRow-a billRow-a-more' href='javascript:;'>更多></a>"; //点击进入查看单据界面
                        $(row).empty();
                        $(row).append("<td>" + startRowNodeHtml1 + "</td>" +
                            "<td colspan='" + colspanCount + "'>" + midRowColSpanHtml1 + "</td>" +
                            "<td>" + lastRowNodeHtml1 + "</td>");
                    }
                }
                //2，列的纵向合并
                for (var j = 0; j < rows.length; j++) {
                    var row = rows[j];
                    var rowData2 = tmpTbl.api().row(row).data();
                    if (rowData2.isBill == 1) { //说明这行是单子头部信息，要进行合并
                        rowspan_firstNode = $(row).find("td:eq(0)");
                        rowspan_lastNode = $(row).find("td:eq(2)");
                        rowspanCount = 1;
                    } else {
                        if (rowData2.isMore == 0) {
                            rowspanCount++;
                            rowspan_lastNode.attr("rowspan", rowspanCount);
                            $(row).find("td:eq(" + (colspanCount + 1) + ")").remove();
                            rowspan_firstNode.attr("rowspan", rowspanCount);
                            $(row).find("td:eq(0)").remove();
                        } else {
                            rowspanCount++;
                            rowspan_lastNode.attr("rowspan", rowspanCount);
                            $(row).find("td:eq(2)").remove();
                            rowspan_firstNode.attr("rowspan", rowspanCount);
                            $(row).find("td:eq(0)").remove();
                        }
                    }
                }
            }
        };

        if (tblObj != null) {
            tblObj.destroy();
            $("#" + tblId).empty();
        }
        tblObj = $("#" + tblId).DataTable(tblSetting);

        if (!$("#" + tblId).hasClass("ufma-table")) {
            $("#" + tblId).addClass("ufma-table");
        }
        if (!$("#" + tblId).hasClass("dataTable")) {
            $("#" + tblId).addClass("dataTable");
        }
        var $clostDiv = $("#" + tblId).closest("div");
        $($clostDiv).css("border-bottom", "0px black solid");

        addListenerToMainTable();

        ufma.hideloading();
    };

    /**
     * 显示多岗主页面的主表(获取数据，调用doPaintTable函数绘制表格。)
     * @param  {[type]} bNotRepaintTbl [false=url获得数据并且刷新表格   true=url获得数据，但不刷新表格]
     * @param  {[eleInBgItemObj]} pEleCdtn [=null 时，会自行组装一个对象；否则使用此参数的对象]
     * @return {[type]}                [description]
     */
    var showTblData = function (bNotRepaintTbl, pEleCdtn) {
        var surl = _bgPub_requestUrlArray_socialSec[19] + "?agencyCode=" + agencyCode + "&setYear=" + setYear + "&bgReserve=" + bgReserve + "&billType=" + billType;
        var eleCdtn = null;
        pEleCdtn.chrCode = curBgPlanData.chrCode; //guohx  20170907 修改下拨单位后方案ID不能区分预算方案问题
        pEleCdtn.chrId = curBgPlanData.chrId;
        if (pEleCdtn == null) {
            eleCdtn = new eleInBgItemObj();
            eleCdtn.agencyCode = agencyCode;
            eleCdtn.setYear = setYear;
            eleCdtn.chrId = curBgPlanData.chrId;
            //请求添加主要素
            if (curBgPlanEleMsg.priEle == "") {
                eleCdtn.priEle = "";
            } else {
                eleCdtn.priEle = curBgPlanEleMsg.priEle;
            }
        } else {
            eleCdtn = pEleCdtn;
        }
        eleCdtn.billType = billType;
        var statusNav = getTabSetState();
        if (statusNav == "O") {
            //未审核
            eleCdtn.status = "1";
        } else if (statusNav == "A") {
            //已审核
            eleCdtn.status = "3";
        } else {
            //全部
            eleCdtn.status = "";
        }
        //**********************************************
        ufma.showloading("正在加载(待分配)指标单据, 请稍后...");
        ufma.post(surl,
            eleCdtn,
            function (result) {
                if (result.flag == "success") {
                    tblDt = result.data;
                    if (bNotRepaintTbl) {
                        ufma.hideloading();
                        return;
                    }
                    doPaintTable(tblDt);
                    // doComputTotalMoney();
                } else {
                    ufma.hideloading();
                    ufma.showTip(result.msg, null, "error");
                }
            }
        );
    };

    /**
     * 显示多岗  浮层  的表格(获取数据，调用doPaintTable函数绘制表格。)
     * @param  {[type]} bNotRepaintTbl [false=url获得数据并且刷新表格   true=url获得数据，但不刷新表格]
     * @param  {[eleInBgItemObj]} pEleCdtn [=null 时，会自行组装一个对象；否则使用此参数的对象]
     * @return {[type]}                [description]
     */
    var showModalTblData_obligate = function (bNotRepaintTbl, pEleCdtn) {
        var surl = _bgPub_requestUrlArray_socialSec[0] + "?agencyCode=" + agencyCode + '&setYear=' + ufma.getCommonData().svSetYear + "&bgReserve=" + bgReserve + "&billType=" + bgItemFrom_billType;
        var eleCdtn = null;
        if (pEleCdtn == null) {
            eleCdtn = new eleInBgItemObj();
            eleCdtn.agencyCode = agencyCode;
            eleCdtn.chrId = modal_curBgPlan.chrId;
            eleCdtn.billType = bgItemFrom_billType;
            //请求添加主要素
            if (modal_curBgPlanEleMsg.priEle == "") {
                eleCdtn.priEle = "";
            } else {
                eleCdtn.priEle = modal_curBgPlanEleMsg.priEle;
            }
        } else {
            eleCdtn = pEleCdtn;
        }
        eleCdtn.status = '3'; //只要审核的待分配指标
        //**********************************************
        ufma.showloading("正在加载(待分配)指标, 请稍后...");
        ufma.post(surl,
            eleCdtn,
            function (result) {
                if (result.flag == "success") {
                    var tmpTblDt = result.data;
                    if (bNotRepaintTbl) {
                        ufma.hideloading();
                        return;
                    }
                    doPaintTable_obligate(tmpTblDt);
                } else {
                    ufma.hideloading();
                    ufma.showTip(result.msg, null, "error");
                }
            }
        );
    };

    /**
     * 将选择的区划显示到列表中
     * @param  {[string]} parentDivId [显示区划pnl的父容器]
     * @param  {[json]} rgMsg       [包含以下内容:]
     *                rgName : 区划名称
     *                rgId  : 区划ID
     *                rgCode  ： 区划代码
     * @return {[type]}             [description]
     */
    var modal_addRgPnl = function (parentDivId, rgMsg) {
        var $existPnl = $("#" + parentDivId + " .subRgPnl[id='" + rgMsg.rgCode + "']");
        if ($existPnl.length > 0) {
            return;
        }
        var rgPnlHtml = "<div id='" + rgMsg.rgId + "' code='" + rgMsg.rgCode + "' class='subRgPnl'>" +
            "<h5>" + rgMsg.rgName + "</h5>" +
            '<a class="btn btn-icon-only btn-sm" data-toggle="tooltip" action= "unactive"  title="删除">' +
            '<span class="glyphicon icon-close subRgPnlSpan_Del"></span></a>' +
            "</div>";
        $("#" + parentDivId).append(rgPnlHtml);
    };

    /**
     * 获得 浮层 表格的数据。
     * @return {[type]} 新增：返回[]  查看：返回具体的数据
     */
    var getModalTableData = function () {
        return modalCurBgBill.items;
    };

    /**
     * 根据预算方案重画浮层表格。
     * @param  {[type]} tabData [description]
     * @return {[type]}          [description]
     */
    var doPaintTable_obligate = function (tabData) {
        var tblCols = [
            /**
             * 第一列，checkbox
             */
            {
                data: "bgItemId",
                title: '<label class="mt-checkbox mt-checkbox-single mt-checkbox-outline"> ' +
                    '<input type="checkbox" class="datatable-group-checkable" name="headInput-ModalTbl1"/> &nbsp;' +
                    '<span></span> ' +
                    '</label>',
                width: "30px"
            },
            {
                data: "bgItemCode",
                title: "指标编码",
                width: "100px"
            },
            {
                data: "bgItemSummary",
                title: "摘要",
                width: "200px"
            }
        ];
        if (currentplanData.isComeDocNum == "是") {
            tblCols.push({
                data: "comeDocNum",
                title: "来文文号",
                width: "200px"
            });
        }
        if (currentplanData.isSendDocNum == "是") {
            tblCols.push({
                data: "sendDocNum",
                title: "发文文号",
                width: "200px"
            });
        }
        //循环添加预算方案的要素信息
        for (var index = 0; index < modal_curBgPlanEleMsg.eleCodeArr.length; index++) {
            tblCols.push({
                data: _BgPub_getEleDataFieldNameByCode(modal_curBgPlanEleMsg.eleCodeArr[index], modal_curBgPlanEleMsg.eleFieldName[index]),
                title: modal_curBgPlanEleMsg.eleNameArr[index],
                width: "200px"
            });
        }
        //添加最后的金额，日期，操作列
        tblCols.push({
            data: "bgItemUnAllotCurShow",
            title: "金额",
            class: "bgPubMoneyCol",
            width: "100px"
        });
        tblCols.push({
            data: "createUser",
            title: "编制人",
            width: "100px"
        });

        tblCols.push({
            data: "createDate",
            title: "编制日期",
            width: "100px"
        });

        tblCols.push({
            data: "checkUser",
            title: "审核人",
            width: "100px"
        });

        tblCols.push({
            data: "checkDate",
            title: "审核日期",
            width: "100px"
        });
        tblCols.push({
            data: "bgItemId",
            title: "操作",
            width: "100px"
        });

        var colDefs = [{
            "targets": [-1],
            "serchable": false,
            "orderable": false,
            "render": function (data, type, rowdata, meta) {
                return '<a class="btn btn-icon-only btn-sm" data-toggle="tooltip" action= "unactive" ' +
                    'rowid="' + data + '" title="日志">' +
                    '<span class="glyphicon icon-file mainLogSpan"></span></a>';
            }
        }, {
            "targets": [0],
            "serchable": false,
            "orderable": false,
            "render": function (data, type, rowdata, meta) {
                return '<label class="mt-checkbox mt-checkbox-single mt-checkbox-outline"> ' +
                    '<input type="checkbox" class="checkboxes" data-level="' + rowdata.levelNum + '" name="mainRowCheck" />&nbsp;' +
                    '<span></span> ' +
                    '</label>';
            }
        }];
        var tmpModal_TblData = organizeMainTblDataByURLResponse(tabData, true);

        var bNotAutoWidth = true; //默认是取消自动宽度；
        if (tmpModal_TblData.length == 0) {
            bNotAutoWidth = false;
        }

        var sScrollY = "225px"; //for test

        var tblSetting = {
            "data": tmpModal_TblData,
            "columns": tblCols,
            "columnDefs": colDefs,
            // "pagingType" : "simple_numbers",
            "paging": false,
            "ordering": false,
            "lengthChange": false,
            "processing": true, // 显示正在加载中
            "bSort": false, // 排序功能
            "autoWidth": bNotAutoWidth, //配合列宽，注意，TRUE的时候是关闭自动列宽，坑死了
            "scrollX": true,
            "scrollY": sScrollY,
            "select": true,
            "bDestroy": true,
            "dom": 'rt' //<"rightDiv" p>

        };

        if (modal_tableObj != null) {
            modal_tableObj.destroy();
            $("#" + modalTblId).empty();
        }

        if (!$("#" + modalTblId).hasClass("ufma-table")) {
            $("#" + modalTblId).addClass("ufma-table");
        }
        if (!$("#" + modalTblId).hasClass("dataTable")) {
            $("#" + modalTblId).addClass("dataTable");
        }

        modal_tableObj = $("#" + modalTblId).DataTable(tblSetting);

        var $clostDiv = $("#" + modalTblId).closest("div");
        $($clostDiv).css("border-bottom", "0px black solid");

        ufma.hideloading();
    };


    /**
     * 根据预算方案重画浮层表格 --  第三页签的。与第一页签结构相似，多了 区划、下拨金额 列。
     * @param  {[type]} tabData [description]
     * @return {[type]}          [description]
     */
    var doPaintTable_obligate2 = function (tabData) {
        var tblCols2 = [{
                "key": "rgName",
                "width": "100px",
                "name": "下拨区划"
            },
            {
                "key": "bgItemSummary",
                "width": "200px",
                "name": "摘要"
            }
        ];
        if (currentplanData.isComeDocNum == "是") {
            tblCols2.push({
                "key": "comeDocNum",
                "width": "200px",
                "name": "来文文号"
            });
        }
        if (currentplanData.isSendDocNum == "是") {
            tblCols2.push({
                "key": "sendDocNum",
                "width": "200px",
                "name": "发文文号"
            });
        }
        //循环添加预算方案的要素信息
        for (var index = 0; index < modal_curBgPlanEleMsg.eleCodeArr.length; index++) {
            tblCols2.push({
                "key": _BgPub_getEleDataFieldNameByCode(modal_curBgPlanEleMsg.eleCodeArr[index], modal_curBgPlanEleMsg.eleFieldName[index]),
                "width": "200px",
                "name": modal_curBgPlanEleMsg.eleNameArr[index]
            });
        }
        //添加最后的金额，日期，操作列
        if (modal_open_readOnly) {
            tblCols2.push({
                "key": "bgItemAllotCur",
                "width": "100px",
                "name": "下拨金额",
                "type": "money"
            });
        } else {
            tblCols2.push({
                "key": "bgItemAllotCur",
                "width": "100px",
                "name": "下拨金额",
                "edit": "true",
                "type": "money"
            });
        }
        tblCols2.push({
            "key": "",
            "width": "100px",
            "name": "操作",
            "buttons": [{
                "class": "icon-file mainLogSpan"
            }]
        });

        modal_tableObj2 = $("#" + modalTblId2).ufmaDataTable({
            data: tabData,
            columns: tblCols2
        });
        var $tmptable = $('#' + modal_tableObj2.id + ' .ufma-datatable');
        $tmptable.find("td input").off("keydown.bg").on("keydown.bg", function (e) {
            var $input = $(this);
            var rowIndex = $input.closest("tr").index() + 1; //当前行
            if (e.keyCode == 38) {
                //向上  方向键
                if (rowIndex > 1) {
                    var $preRow = $('#' + modal_tableObj2.id + ' .ufma-datatable').find("tr:eq(" + (rowIndex - 1) + ")");
                    $(this).blur();
                    $preRow.find("input").closest("div").show();
                    $preRow.find("input").focus();
                }
            } else if (e.keyCode == 40) {
                //向下  方向键
                $(this).blur();
                if (rowIndex < ($tmptable.find("tr").length - 1)) {
                    var $nextRow = $('#' + modal_tableObj2.id + ' .ufma-datatable').find("tr:eq(" + (rowIndex + 1) + ")");
                    $nextRow.find("input").closest("div").show();
                    $nextRow.find("input").focus();
                }
            }
        });
        //绑定键盘响应事件，支持方向键选择进入下一行。

        ufma.hideloading();
    };

    /**
     * 模态框 - 显示已有的下拨单
     * @param billData 下拨单信息 = modalCurBgBill
     */
    var doShowBillToModal = function (billData) {
        //1, 预处理数据: 为每条指标填充：区划名称、下拨金额（=指标金额）、初始化摘要。同时采集父指标ID、采集下拨区划信息
        var parentItemIds = [];
        var rgCodes = [];
        var agencyNodes = agencyCbb.setting.tree.transformToArray(agencyCbb.setting.tree.getNodes());
        for (var i = 0; i < billData.items.length; i++) {
            billData.items[i].rgName = ""; //给个初始化的值，避免找不到区划名称
            billData.items[i].bgItemAllotCur = billData.items[i].bgItemCur;
            billData.items[i].isNew = '否';
            for (var j = 0; j < agencyNodes.length; j++) {
                if (agencyNodes[j].id == billData.items[i].agencyCode) {
                    billData.items[i].rgName = agencyNodes[j].name;
                    break;
                }
            }
            if ($.isNull(billData.items[i].bgItemSummary) || $.isEmptyObject(billData.items[i].bgItemSummary)) {
                billData.items[i].bgItemSummary = '';
            }
            if ($.inArray(billData.items[i].bgItemParentid, parentItemIds) === -1) {
                parentItemIds[parentItemIds.length] = billData.items[i].bgItemParentid;
            }
            if ($.inArray(billData.items[i].agencyCode, rgCodes) === -1) {
                rgCodes[rgCodes.length] = billData.items[i].agencyCode;
            }
        }
        //1.1， 根据上面采集的使用区划，加载模态框的第二个页签。
        var aaaNodes = modal_tab2_fromTree.transformToArray(modal_tab2_fromTree.getNodes());
        for (var ai = 0; ai < aaaNodes.length; ai++) {
            for (var ii = 0; ii < rgCodes.length; ii++) {
                if (rgCodes[ii] == aaaNodes[ai].id) {
                    doChoiseRgNode(aaaNodes[ai]);
                    break;
                }
            }
        }

        //2,加载单据的 [附件信息]
        var tmpRst = _bgPub_GetAttachment({
            "billId": billData.billId,
            "agencyCode": agencyCode
        });
        if (!$.isNull(tmpRst.data.bgAttach)) {
            for (var m = 0; m < tmpRst.data.bgAttach.length; m++) {
                modal_billAttachment[modal_billAttachment.length] = {
                    "filename": tmpRst.data.bgAttach[m].fileName,
                    "filesize": 0,
                    "fileid": tmpRst.data.bgAttach[m].attachId
                };
            }
            $("#bgInput-fileCount-unallocateBgItemToLower").val(modal_billAttachment.length + "");
        }

        //3, 请求获得预算方案的信息。
        $.ajax({
            //guohx 20170907 修改 加传参数chrCode
            url: _bgPub_requestUrlArray[1] + "?agencyCode=" + agencyCode + "&setYear=" + ufma.getCommonData().svSetYear + "&bgPlanChrId=" + curBgPlanData.chrId + "&bgPlanChrCode=" + curBgPlanData.chrCode,
            type: "GET",
            async: false, //同步
            dataType: 'json', //返回的数据格式：json/xml/html/script/jsonp/text
            contentType: 'application/json; charset=utf-8',
            success: function (result) {
                if (result.flag == "success") {
                    modal_curBgPlan = result.data[0];
                    modal_curBgPlanEleMsg = _BgPub_GetBgPlanEle(modal_curBgPlan);
                } else {
                    modal_curBgPlan = null;
                    modal_curBgPlanEleMsg = null;
                }
            },
            failed: function () {
                modal_curBgPlan = null;
                modal_curBgPlanEleMsg = null;
            }
        });
        if ($.isNull(modal_curBgPlan)) {
            ufma.showTip("预算方案获取失败！", null, "error");
            return false;
        }

        //4, 根据1、3步骤的结果，请求获得父指标详细信息。 根据父指标信息，计算父指标的sum(可下拨金额), 同时为每条指标填充父指标的可下拨金额
        var surl = _bgPub_requestUrlArray_socialSec[0] + "?agencyCode=" + agencyCode + '&setYear=' + ufma.getCommonData().svSetYear + "&bgReserve=" + bgReserve + "&billType=" + bgItemFrom_billType;
        var eleCdtn = new eleInBgItemObj();
        eleCdtn.agencyCode = agencyCode;
        eleCdtn.chrId = modal_curBgPlan.chrId;
        eleCdtn.billType = bgItemFrom_billType;
        eleCdtn.itemIds = parentItemIds.join(",");
        eleCdtn.status = '3'; //只要审核的待分配指标
        ufma.post(surl,
            eleCdtn,
            function (result) {
                if (result.flag == "success") {
                    var parentItemsData = result.data;
                    var totalCur = 0.00;
                    modal_selectedItems = organizeMainTblDataByURLResponse(parentItemsData, true);
                    for (var k = 0; k < parentItemsData.billWithItemsVo.length; k++) {
                        for (var m = 0; m < parentItemsData.billWithItemsVo[k].billWithItems.length; m++) {
                            totalCur += parseFloat(parentItemsData.billWithItemsVo[k].billWithItems[m].bgItemUnAllotCur);
                            for (var n = 0; n < billData.items.length; n++) {
                                if (billData.items[n].bgItemParentid == parentItemsData.billWithItemsVo[k].billWithItems[m].bgItemId) {
                                    billData.items[n].bgItemUnAllotCur = parentItemsData.billWithItemsVo[k].billWithItems[m].bgItemUnAllotCur;
                                }
                            }
                        }
                    }
                    $("#unallocateBgItemToLowerModal_totalMoney").text(jQuery.formatMoney(totalCur + "", 2) + "");
                    //******* 画模态框的第三个页签的表格， 显示下拨指标 *********
                    doPaintTable_obligate2(billData.items);
                } else {
                    ufma.showTip("来源指标加载错误：" + result.msg, null, "error");
                }
                ufma.hideloading();
            }
        );
    };

    /**
     * 初始化区划来源
     */
    var doInitRgTree = function (fromTreeId, toTreeId) {
        modal_tab2_fromTree = null;
        modal_tab2_toTree = null;

        var tabTreeSet = {
            rootName: null,
            idKey: "id",
            pIdKey: "pId",
            nameKey: "name",
            addHoverDom: false,
            removeHoverDom: false,
            showRemoveBtn: false,
            showRenameBtn: false
        };

        $.ajax({
            url: _bgPub_requestUrlArray[3],
            type: "GET",
            async: false, //同步
            dataType: 'json', //返回的数据格式：json/xml/html/script/jsonp/text
            contentType: 'application/json; charset=utf-8',
            success: function (data) {
                modal_tab2_fromTree = $("#" + fromTreeId).bgPriEleTree($.extend({}, {
                    checkParent: false,
                    data: data.data
                }, tabTreeSet));
                modal_tab2_fromTree.expandAll(true);
            },
            error: function (data) {
                ufma.showTip(data);
                modal_tab2_fromTree = $("#" + fromTreeId).bgPriEleTree($.extend({}, {
                    checkParent: false,
                    data: []
                }, tabTreeSet));
            }
        });

        modal_tab2_toTree = $("#" + toTreeId).bgPriEleTree($.extend({
            checkParent: false
        }, tabTreeSet));
    };

    /**
     * 根据传入的bill数据加载浮层
     * @param billData 两种数据：
     *          1， newbill请求的返回data结构
     *          2， tblDt.billWithItemsVo[i] 主界面表格的某条单据
     *          第2种数据比第1种数据多了 items和billWithItems两个数组。其余属性有：
     *          agencyCode, applicant, applicantName, attachment, billCode, billCur, billDate, billId, billType,
     *          checkDate, checkUser, checkUserName, createDate, createUser, createUserName, isNew, lastVer,
     *          latestOpDate, latestOpUser, latestOpUserName, setYear, status, summary
     * @return {[type]} [description]
     */
    var doLoadModalWithData = function (billData) {
        //1, 初始化各种数据
        addModal = null; //新增模态框的对象
        modal_curBgPlan = null; //浮层的预算方案
        modal_selectedItems = [];
        modal_billAttachment = [];
        modalCurBgBill = $.extend({}, billData);
        modalCurBgBill.billType = billType;
        $("#bgInput-fileCount-unallocateBgItemToLower").val("0");
        if (modal_tableObj != null) {
            modal_tableObj.destroy();
            $("#" + modalTblId).empty();
            modal_tableObj = null;
        }
        if (modal_tableObj2 != null) {
            $("#" + modalTblId2).empty();
            modal_tableObj2 = null;
        }
        modal_open_readOnly = false;
        modal_refreshWhenClose = false;
        //编辑状态打开已审核单据，就是只读的界面。
        if (modalCurBgBill.isNew == "否" && modalCurBgBill.items.length > 0) {
            modal_open_readOnly = (getTabSetState == 'A') ||
                modalCurBgBill.status == '3';
        }
        //2.1, 加载更多的预算方案头部
        moreMsgSetting_modal.agencyCode = agencyCode;
        pnlFindRst_modal = _PNL_MoreByBgPlan("unallocateBgItem_modal_step1_morePnl", moreMsgSetting_modal);
        //2.2, 加载进度条
        progressController = _bgPub_Progress1("progress-unallocateBgItemToLower", 1045, {
            count: 4,
            labels: ["选择待下拨指标", "选择下拨区划", "编辑下拨指标", "完成"]
        });
        //3, 加载浮层顶部的单据号
        $("#unallocateBgItemToLowerModal_billCode").val(modalCurBgBill.billCode);
        $("#unallocateBgItemToLowerModal_billCode").attr("data", modalCurBgBill);
        $("#unallocateBgItemToLowerModal_billCode").attr("billId", modalCurBgBill.billId);
        //4, 显示模态框，重新计算content的高度。自动计算的不对
        var modalWidth = 1090;
        addModal = ufma.showModal("unallocateBudgetItemToLower-add", modalWidth, 628, function () {});
        var contentHeight = parseFloat($(".u-msg-dialog").css("height"));
        contentHeight = contentHeight - addModal.modal.find('.u-msg-title').outerHeight(true);
        addModal.modal.find('.u-msg-footer').each(function (ele) {
            contentHeight = contentHeight - $(this).outerHeight(true);
        });
        addModal.msgContent.css('height', contentHeight + 'px');
        var tmpTabControllerHeight = contentHeight - $("#modal-title-left").outerHeight(true) - 8 - 4 - 70;
        $(".tabController").css("min-height", tmpTabControllerHeight + "px");
        $(".tabController").css("max-height", tmpTabControllerHeight + "px");
        $(".unallocateBgItemToLower-tab2-div").css("min-height", tmpTabControllerHeight + "px");
        $(".unallocateBgItemToLower-tab2-div").css("max-height", tmpTabControllerHeight + "px");
        $(".tab2-agencyTree").css("min-height", tmpTabControllerHeight - 30 + "px");
        $(".tab2-agencyTree").css("max-height", tmpTabControllerHeight - 30 + "px");
        $("#unallocateBgItemToLowerTable_msg_step4").css("left", (modalWidth - 200) / 2 + "px");
        $("#unallocateBgItemToLowerTable_msg_step4").css("top", "100px");

        //5, 初始化区划来源
        doInitRgTree("tab2_agencyFrom", "tab2_agencyTo");

        //6, 界面的显示是新增还是编辑
        if (!$.isNull(modalCurBgBill.items) && modalCurBgBill.items.length > 0) {
            ufma.showloading("正在加载单据信息，请稍后...");
            modal_open_type = 2; //修改模式
            goToStepOfModal(3);
            doShowBillToModal(modalCurBgBill);
        } else {
            modal_open_type = 1; //新增模式
            goToStepOfModal(1);
        }
    };

    /**
     * 浮层  --  进入第几步  的选择
     * @param  {[type]} step [description]
     * @return {[type]}      [description]
     */
    var goToStepOfModal = function (step) {
        var istep = 1;
        if (!$.isNull(step)) {
            istep = parseInt(step + "");
        }
        if (!$.isNull(progressController)) {
            progressController.gotoStep(istep);
        }
        $(".tabController").hide();
        $(".tabController").removeClass("active");
        if (istep == 1) {
            $(".step1").addClass("active");
            $(".step1").show();
            $("#btn-modal-pre").hide();
            $("#btn-modal-next").text("下一步");
        } else if (istep == 2) {
            $(".step2").addClass("active");
            $(".step2").show();
            $("#btn-modal-pre").show();
            if (modal_open_type === 2) {
                $("#btn-modal-pre").hide(); //编辑模式打开的话，不能进入第一层，不能去更换原指标。
            }
            $("#btn-modal-next").text("下一步");
        } else if (istep == 3) {
            if (modal_open_readOnly) {
                $("#btn-modal-pre").hide();
            } else {
                $("#btn-modal-pre").show();
            }
            $(".step3").addClass("active");
            $(".step3").show();
            $("#btn-modal-next").text("确定");
        } else if (istep == 4) {
            $(".step4").addClass("active");
            $(".step4").show();
            $("#btn-modal-pre").hide();
            $("#btn-modal-next").text("继续编单");
        }
    };

    var doChoiseRgNode = function (ANode) {
        var toTreeNodes = modal_tab2_toTree.getNodes();
        var tmpCanSel = true;
        if (ANode.id == agencyCode) {
            tmpCanSel = false;
        } else {
            for (var j = 0; j < toTreeNodes.length; j++) {
                if (toTreeNodes[j].id == ANode.id) {
                    tmpCanSel = false;
                    break;
                }
            }
        }
        if (tmpCanSel) {
            delete ANode.children;
            ANode.check_Child_State = -1;
            ANode.isLastNode = true;
            ANode.isParent = false;
            ANode.checked = false;
            modal_tab2_toTree.addNodes(null, -1, ANode, true);
        }
    }
    //********************************************************[绑定事件]***************************************************
    /**
     * 响应模态框第一页签表格头部的checkbox事件
     */
    $(document).on("change.modalTbl1", "input", function () {
        if ($(this).attr("name") === "headInput-ModalTbl1") {
            if ($(this).is(":checked") == true) {
                $("#" + modalTblId + " tbody input[type='checkbox']").prop("checked", true);
            } else {
                $("#" + modalTblId + " tbody input[type='checkbox']").prop("checked", false);
            }
        }
    });

    /**
     * 点击导出按钮
     * @param  {[type]} e [description]
     * @return {[type]}   [description]
     */
    $("#btn_toLowerExp").off("click").on("click", function (e) {
        //暂时用此做测试按钮    test
    });
    /**
     * 新增按钮，弹出模态框
     * @param  {[type]} e [description]
     * @return {[type]}   [description]
     getURL(0) + "/bg/budgetItem/multiPost/newBill"  //14  新建一个单据
     */
    $("#btn-add").off("click").on("click", function (e) {
        if ($.isNull(agencyCode)) {
            ufma.alert('请选择单位！', 'error');
            return false;
        }
        ufma.get(_bgPub_requestUrlArray_socialSec[14], {
                "agencyCode": agencyCode,
                "billType": billType
            },
            function (result) {
                if (result.flag == "success") {
                    if (!$.isNull(curBgPlanData)) {
                        result.data.bgPlanId = curBgPlanData.chrId;
                    }
                    doLoadModalWithData(result.data);
                }
            }
        );
    });

    /**
     * 审核、未审核、全部  [页签]  的变动
     * @param  {[type]} e [description]
     * @return {[type]}   [description]
     */
    $(".nav.nav-tabs li").on("click", function (e) {
        var tmpStatus = $(this).find('a').attr("data-status"); //O=未审核  A=审核  T=全部
        if (tmpStatus == "O") {
            $("#btn-check").text("审核");
            $("#btn-check").show();
        } else if (tmpStatus == "A") {
            $("#btn-check").text("销审");
            $("#btn-check").show();
        } else {
            $("#btn-check").hide();
        }
        $(".nav.nav-tabs li").removeClass("NAVSELECT");
        $(this).addClass("NAVSELECT");
        //清空表格
        tblObj.clear().draw();
        pnlFindRst.doFindBtnClick(); //调用查询按钮
    });

    /**
     * 主界面  打印  按钮事件
     * @param  {[type]} e [description]
     * @return {[type]}   [description]
     */
    $("#unallocateBgItemToLower-print").off("click").on("click", function (e) {
        $("." + tblPrintBtnClass).trigger("click");
    });

    /**
     * 主界面  导出  按钮事件
     * @param  {[type]} e [description]
     * @return {[type]}   [description]
     */
    $("#btn_toLowerExp").off("click").on("click", function (e) {
        $("." + tblPrintBtnClassExpXls).trigger("click");
    });

    /**
     * 模态框  - 附件  按钮事件绑定
     * @param  {[type]} e [description]
     * @return {[type]}   [description]
     */
    $("#btn-unallocateBgItemToLowerModal-aboutFiles").off("click").on("click", function (e) {
        var option = {
            "agencyCode": agencyCode,
            "billId": modalCurBgBill.billId,
            "uploadURL": _bgPub_requestUrlArray_socialSec[8] + "?agencyCode=" + agencyCode + "&billId=" + modalCurBgBill.billId,
            "delURL": _bgPub_requestUrlArray_socialSec[16] + "?agencyCode=" + agencyCode + "&billId=" + modalCurBgBill.billId,
            "downloadURL": _bgPub_requestUrlArray_socialSec[15] + "?agencyCode=" + agencyCode + "&billId=" + modalCurBgBill.billId,
            "onClose": function (fileList) {
                $("#bgInput-fileCount-unallocateBgItemToLower").val(fileList.length + "");
                modal_billAttachment = cloneObj(fileList);
            }
        };
        _bgPub_ImpAttachment("unallocateBudgetItemToLower", "指标单据[" + modalCurBgBill.billCode + "]附件导入", modal_billAttachment, option);
    });

    /**
     * 模态框 -- 下一步  按钮  点击事件绑定
     * @param  {[type]} e [description]
     * @return {[type]}   [description]
     */
    $("#btn-modal-next").off("click").on("click", function (e) {
        var curPageIndex = $(".tabController.active").attr("pageindex");
        if (curPageIndex == "1") {
            //检查一， 是否有选择要下拨的指标数据
            modal_selectedItems = _bgPub_dataTable_getAllSelectedRowData(modalTblId);
            if (modal_selectedItems.length == 0) {
                ufma.showTip("请选择要下拨的指标数据.", null, "error");
                return false;
            }
            //根据页签一的数据，填充页签二的数据
            $("#unallocateModal_dtp").val(_BgPub_getCurentDate());
            //显示页签二
            goToStepOfModal(2);
        } else if (curPageIndex == "2") {
            if ($.isNull(modal_tab2_toTree) || modal_tab2_toTree.getNodes().length == 0) {
                ufma.showTip("请选择要下拨的区划", null, "error");
                return false;
            }
            var toTreeNodes = modal_tab2_toTree.getNodes();
            var totalCur = 0.00;
            var tab3Data = [];
            if (modal_open_type === 1) { //新单模式下，从区划到下拨指标的计算逻辑
                for (var i = 0; i < modal_selectedItems.length; i++) {
                    totalCur += modal_selectedItems[i].bgItemUnAllotCur;
                    var allocatedAgency = [];
                    for (var j = 0; j < toTreeNodes.length; j++) {
                        var tb3RowDt = $.extend({}, modal_selectedItems[i]);
                        tb3RowDt.rgName = toTreeNodes[j].name;
                        tb3RowDt.rgId = toTreeNodes[j].id;
                        tb3RowDt.bgItemAllotCur = 0.00;
                        tab3Data[tab3Data.length] = tb3RowDt;
                        var a = {
                            agencyCode: tb3RowDt.rgId,
                            agencyCodeName: tb3RowDt.rgName
                        };
                        allocatedAgency.push(a); //guohx 20170906
                    }
                }
                $("#unallocateBgItemToLowerModal_totalMoney").text(jQuery.formatMoney(totalCur + "", 2) + "");
            } else if (modal_open_type === 2) { //编辑模式下，从区划到下拨指标的计算逻辑
                var orgModalCurBgBill = modalCurBgBill.items.concat();
                for (var ii = 0; ii < modal_selectedItems.length; ii++) {
                    totalCur += modal_selectedItems[ii].bgItemUnAllotCur;
                    var allocatedAgency = [];
                    for (var jj = 0; jj < toTreeNodes.length; jj++) {
                        var tb3RowDt2 = $.extend({}, modal_selectedItems[ii]);
                        tb3RowDt2.rgName = toTreeNodes[jj].name;
                        tb3RowDt2.rgId = toTreeNodes[jj].id;
                        tb3RowDt2.bgItemAllotCur = 0.00;
                        var a = {
                            agencyCode: tb3RowDt.rgId,
                            agencyCodeName: tb3RowDt.rgName
                        };
                        allocatedAgency.push(a); //guohx 20170906
                        var canAdd = true;
                        for (var kk = 0; kk < orgModalCurBgBill.length; kk++) {
                            if (orgModalCurBgBill[kk].agencyCode == tb3RowDt2.rgId &&
                                orgModalCurBgBill[kk].bgItemParentid == tb3RowDt2.bgItemId) {
                                tab3Data[tab3Data.length] = $.extend({}, orgModalCurBgBill[kk]);
                                canAdd = false;
                                break;
                            }
                        }
                        if (canAdd) {
                            tab3Data[tab3Data.length] = tb3RowDt2;
                        }
                    }
                }
                $("#unallocateBgItemToLowerModal_totalMoney").text(jQuery.formatMoney(totalCur + "", 2) + "");
            }
            checkAgencycode(allocatedAgency);
            doPaintTable_obligate2(tab3Data);
            //显示页签三
            goToStepOfModal(3);
        } else if (curPageIndex == "3") {
            //如果是只读打开。直接关闭界面，退出。
            if (modal_open_readOnly) {
                $("#btn-modal-close").trigger("click");
                return false;
            }
            //否则，就正常保存。
            var curBgItemId = "";
            var curAllotCur = 0.00;
            var curBgItemCur = 0.00;
            var curBgItemCode = "";
            $("#" + modalTblId2 + " table").find("tbody tr").each(function (index, obj) {
                var rowDt = modal_tableObj2.getData($(this).attr("id"));
                var rowDt_Show = modal_tableObj2.getTrData($(this).attr("id"));
                if ($.isNull(rowDt_Show.bgItemAllotCur) ||
                    rowDt_Show.bgItemAllotCur == '' ||
                    parseFloat(rowDt_Show.bgItemAllotCur) == 0) {
                    rowDt_Show.bgItemAllotCur = 0.00;
                }
                if (curBgItemId == "") {
                    curBgItemId = rowDt.bgItemId;
                    curAllotCur += parseFloat(rowDt_Show.bgItemAllotCur);
                    curBgItemCur = rowDt.bgItemUnAllotCur;
                    curBgItemCode = rowDt.bgItemCode;
                } else if (curBgItemId != rowDt.bgItemId) {
                    if (curAllotCur > curBgItemCur) {
                        ufma.showTip("指标[" + curBgItemCode + "]的下拨金额大于指标金额, 不能下拨", null, "error");
                        return false;
                    }
                    curBgItemId = rowDt.bgItemId;
                    curAllotCur = parseFloat(rowDt_Show.bgItemAllotCur);
                    curBgItemCur = rowDt.bgItemUnAllotCur;
                    curBgItemCode = rowDt.bgItemCode;
                } else {
                    curAllotCur += parseFloat(rowDt_Show.bgItemAllotCur);
                }
            });
            //循环外再加一层校验, 检查最后一组数据
            if (curAllotCur > curBgItemCur) {
                ufma.showTip("指标[" + curBgItemCode + "]的下拨金额大于指标金额, 不能下拨", null, "error");
                return false;
            }
            //校验通过，给予保存
            modalCurBgBill.items = [];
            var totalBillCur = 0.00;
            $("#" + modalTblId2 + " table").find("tbody tr").each(function (index, obj) {
                var rowDt = modal_tableObj2.getData($(this).attr("id"));
                var rowDt_Show = modal_tableObj2.getTrData($(this).attr("id"));
                rowDt.bgItemCur = rowDt_Show.bgItemAllotCur;
                rowDt.status = '1';
                if (rowDt.isNew != '否') {
                    rowDt.isNew = '是';
                    rowDt.billId = modalCurBgBill.billId;
                    rowDt.billCode = modalCurBgBill.billCode;
                    rowDt.bgItemParentid = rowDt.bgItemId;
                    rowDt.bgItemParentcode = rowDt.bgItemCode;
                    rowDt.bgItemId = '';
                    rowDt.bgItemCode = '';
                    rowDt.agencyCode = rowDt.rgId;
                    rowDt.createUserName = _bgPub_getUserMsg().userName;
                    rowDt.createUser = _bgPub_getUserMsg().userCode;
                }
                rowDt.agencyCodeName = rowDt.rgName;

                totalBillCur += parseFloat(rowDt_Show.bgItemAllotCur);
                modalCurBgBill.items[modalCurBgBill.items.length] = rowDt;
            });
            modalCurBgBill.billCur = totalBillCur;
            ufma.showloading("正在保存下拨单，请稍后...");
            ufma.post(
                _bgPub_requestUrlArray_socialSec[4] + "?billType=" + billType + "&agencyCode=" + agencyCode + '&setYear=' + ufma.getCommonData().svSetYear + "&bgReserve=" + bgReserve,
                modalCurBgBill,
                function (result) {
                    if (result.flag == "success") {
                        ufma.hideloading();
                        ufma.showTip("保存成功", null, "success");
                        modal_refreshWhenClose = true;
                        //显示页签四
                        goToStepOfModal(4);
                    } else {
                        ufma.hideloading();
                        ufma.showTip("保存失败!" + result.msg, null, "error");
                    }
                }
            );

        } else if (curPageIndex == "4") {
            //清空上轮数据
            ufma.get(_bgPub_requestUrlArray_socialSec[14], {
                    "agencyCode": agencyCode,
                    "billType": billType
                },
                function (result) {
                    if (result.flag == "success") {
                        if (!$.isNull(curBgPlanData)) {
                            result.data.bgPlanId = curBgPlanData.chrId;
                        }
                        modalCurBgBill = result.data;
                        $("#bgInput-fileCount-unallocateBgItemToLower").val("0");
                        modalCurBgBill.billType = billType;
                        //加载更多的预算方案头部
                        moreMsgSetting_modal.agencyCode = agencyCode;
                        pnlFindRst_modal = _PNL_MoreByBgPlan("unallocateBgItem_modal_step1_morePnl", moreMsgSetting_modal);
                        // 加载浮层顶部的单据号
                        $("#unallocateBgItemToLowerModal_billCode").val(result.data.billCode);
                        $("#unallocateBgItemToLowerModal_billCode").attr("data", result.data);
                        $("#unallocateBgItemToLowerModal_billCode").attr("billId", result.data.billId);
                        if (modal_tableObj != null) {
                            modal_tableObj.clear().draw();
                        }
                        var toTreeNodes = modal_tab2_toTree.getNodes;
                        for (var i = 0; i < toTreeNodes.length; i++) {
                            modal_tab2_toTree.removeNode(toTreeNodes[i]);
                        }

                        //显示页签一
                        goToStepOfModal(1);
                    } else {
                        ufma.showTip(result.msg, null, "error");
                    }
                }
            );
        }
    });

    /**
     * 主页面 - 增加 checkbox 勾选的事件响应情况
     * @param  {[type]} e [description]
     * @return {[type]}   [description]
     */
    $("#input-seleAll").off("change").on("change", function (e) {
        var selAll = ($(this).is(":checked") == true);
        var rows = $("#" + tblId).dataTable().fnGetNodes();
        for (var k = 0; k < rows.length; k++) {
            var row = rows[k];
            if ($(row).find("td:eq(0):has(label)").length > 0) {
                $(row).find("td:eq(0):has(label)").find("input[type='checkbox']").prop("checked", selAll);
                $(row).find("td:eq(0):has(label)").find("input[type='checkbox']").trigger("change");
            }
        }
    });

    /**
     * 主页面 - 审核/未审核  按钮点击事件
     * @param  {[type]} btn [description]
     * @return {[type]}     [description]
     */
    $("#btn-check").off("click").on("click", function (e) {
        var statusNav = getTabSetState();

        var rqObj_audit = new bgBillAuditOrUnAudit();
        rqObj_audit.agencyCode = agencyCode;
        rqObj_audit.billType = billType;
        rqObj_audit.latestOpUser = _bgPub_getUserMsg().userCode;
        rqObj_audit.latestOpUserName = _bgPub_getUserMsg().userName;
        var rows = $("#" + tblId).dataTable().fnGetNodes();
        var iCount = 0;
        var url = null;
        for (var k = 0; k < rows.length; k++) {
            var row = rows[k];
            if ($(row).find("td:eq(0):has(label)").length > 0) {
                if ($(row).find("td:eq(0):has(label)").find("input[type='checkbox']").is(":checked") == true) {
                    iCount++;
                    var rowDt = tblObj.row(row).data();
                    rqObj_audit.items[rqObj_audit.items.length] = {
                        "billId": rowDt.billId
                    };
                }
            }
        }
        if (iCount == 0) {
            ufma.showTip("请选择要审核的单据", null, "warning");
            return false;
        }

        if (statusNav == "O") {
            //审核单据
            // getURL(0) + "/bg/budgetItem/multiPost/audit",    //12 指标审核
            rqObj_audit.status = "3";
            rqObj_audit.checkUser = _bgPub_getUserMsg().userCode;
            rqObj_audit.checkUserName = _bgPub_getUserMsg().userName;
            url = _bgPub_requestUrlArray_socialSec[12] + "?billType=" + billType + "&agencyCode=" + agencyCode;
            _bgPub_LoadAuditOrUnAuditModal("unallocateBudgetItemToLower", 1, url, rqObj_audit, {
                callbackSuccess: function (pData) {
                    ufma.showTip("审核成功", null, "success");
                    setTimeout(function () {
                        for (var i = 0; i < rqObj_audit.items.length; i++) {
                            removeBillFromMainTable(rqObj_audit.items[i].billId);
                        }
                    }, 1000);
                }
            });
        } else if (statusNav == "A") {
            //销审单据
            // getURL(0) + "/bg/budgetItem/multiPost/cancelAudit",  //13  指标销审
            rqObj_audit.status = "1";
            url = _bgPub_requestUrlArray_socialSec[13] + "?billType=" + billType + "&agencyCode=" + agencyCode;
            _bgPub_LoadAuditOrUnAuditModal("unallocateBudgetItemToLower", 2, url, rqObj_audit, {
                callbackSuccess: function (pData) {
                    ufma.showTip("销审成功", null, "success");
                    setTimeout(function () {
                        for (var i = 0; i < rqObj_audit.items.length; i++) {
                            removeBillFromMainTable(rqObj_audit.items[i].billId);
                        }
                    }, 1000);
                }
            });
        }


    });


    /**
     * 模态框 -- 上一步  按钮  点击事件绑定
     * @param  {[type]} e [description]
     * @return {[type]}   [description]
     */
    $("#btn-modal-pre").off("click").on("click", function (e) {
        var curPageIndex = $(".tabController.active").attr("pageindex");
        if (curPageIndex == "1") {
            //什么也不做，没有上一步了
        } else if (curPageIndex == "2") {
            goToStepOfModal(1);
        } else if (curPageIndex == "3") {
            if (modal_open_type === 2) {
                modalCurBgBill.items = [];
                $("#" + modalTblId2 + " table").find("tbody tr").each(function (index, obj) {
                    var rowDt = modal_tableObj2.getData($(this).attr("id"));
                    var rowDt_Show = modal_tableObj2.getTrData($(this).attr("id"));
                    rowDt.bgItemCur = rowDt_Show.bgItemAllotCur;
                    rowDt.bgItemAllotCur = rowDt_Show.bgItemAllotCur;
                    rowDt.status = '1';
                    if (rowDt.isNew != '否') {
                        rowDt.isNew = '是';
                        rowDt.billId = modalCurBgBill.billId;
                        rowDt.billCode = modalCurBgBill.billCode;
                        rowDt.bgItemParentid = rowDt.bgItemId;
                        rowDt.bgItemParentcode = rowDt.bgItemCode;
                        rowDt.bgItemId = '';
                        rowDt.bgItemCode = '';
                        rowDt.agencyCode = rowDt.rgId;

                        rowDt.createUserName = _bgPub_getUserMsg().userName;
                        rowDt.createUser = _bgPub_getUserMsg().userCode;
                    }
                    modalCurBgBill.items[modalCurBgBill.items.length] = $.extend({}, rowDt);
                });
            }
            //目前在保存完成的界面，不支持上一步
            goToStepOfModal(2);
        } else if (curPageIndex == "4") {
            //目前在保存完成的界面，不支持上一步
        }
    });

    /**
     * 模态框  --  第二个页签的 选择区划按钮事件  --  选择
     * @return {[type]} [description]
     */
    $("#unallocateBgItemToLower-tab2-select").off("click").on("click", function () {
        if ($.isNull(modal_tab2_fromTree)) {
            return;
        }
        var selNodes = modal_tab2_fromTree.getCheckedNodes(true);
        if ($.isNull(selNodes) || selNodes.length == 0) {
            return false;
        }
        for (var i = 0; i < selNodes.length; i++) {
            doChoiseRgNode(selNodes[i]);
        }
    });

    /**
     * 模态框  --  第二个页签的 选择区划按钮事件  --  取消选择
     * @return {[type]} [description]
     */
    $("#unallocateBgItemToLower-tab2-unselect").off("click").on("click", function () {
        if ($.isNull(modal_tab2_toTree)) {
            return;
        }
        var selNodes = modal_tab2_toTree.getCheckedNodes(true);
        if ($.isNull(selNodes) || selNodes.length == 0) {
            return false;
        }
        for (var i = 0; i < selNodes.length; i++) {
            modal_tab2_toTree.removeNode(selNodes[i], false);
        }
    });

    /**
     * 模态框 -- 取消  按钮  点击事件绑定
     * @param  {[type]} e [description]
     * @return {[type]}   [description]
     */
    $("#btn-modal-close").off("click").on("click", function (e) {
        addModal.close();
        if (modal_refreshWhenClose) {
            pnlFindRst.doFindBtnClick();
        }
    });
    //********************************************************[界面入口函数]*****************************************************
    var page = function () {
        return {
            init: function () {
                ufma.parse();
                pnlFindRst = _PNL_MoreByBgPlan('bgMoreMsgPnl', moreMsgSetting); //加载头部更多
                agencyCbb = _bgPub_Bind_Cbb_AgencyList("cbb_agency", { //绑定单位
                    // afterChange : function(tree, treeNode){
                    afterChange: function (treeNode) {
                        ufma.showloading("正在加载单位预算方案，请稍后...");
                        curAgencyData = treeNode;
                        agencyCode = treeNode.id;
                        //80827 【财务云8.0 鄂尔多斯 】20190630所有页面，单位或账套选择变化后，再打开其它页面时，自动显示为最近一次选择的单位或账套。--zsj
                        //缓存单位
                        var params = {
                            selAgecncyCode: treeNode.id,
                            selAgecncyName: treeNode.name
                        }
                        ufma.setSelectedVar(params);
                        setYear = ufma.getCommonData().svSetYear;
                        moreMsgSetting.agencyCode = treeNode.id;
                        moreMsgSetting.setYear = setYear;
                        pnlFindRst = _PNL_MoreByBgPlan('bgMoreMsgPnl', moreMsgSetting); //根据单位的变化重新加载头部更多
                        var iCount = 0;
                        var tmpInternalHand = setInterval(function () {
                            var tmpPlanId = pnlFindRst.planIds.id_bgPub_div_find_Left_tbl_firstRow_cbbBgPlan;
                            if ($("#" + tmpPlanId).attr("agencyCode") == agencyCode) {
                                //数据加载成功
                                clearInterval(tmpInternalHand);
                                ufma.hideloading();
                            }
                            iCount++;
                            if (iCount == 20) {
                                // 超时
                                clearInterval(tmpInternalHand);
                                ufma.hideloading();
                                ufma.showTip("预算方案加载失败");
                            }
                        }, 1000);
                        // ufma.hideloading();
                    }
                });
            }
        };
    }();

    page.init();


});