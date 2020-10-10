$(function () {
  var pnlFindRst = null;
  var tblDt = null; //指标数据
  var tblId = "mainTable-twoSidesAdjItem";
  var tblObj = null;
  var tblPrintBtnClass = "mainTable-twoSideAdjItem-printBtn";
  var tblPrintBtnClassExpXls = "mainTable-twoSideAdjItem-expXlsBtn";
  var maxDetailCount_eachBill = 6; //每条单据最大的显示行数
  var bgItemManager = null; // _bgPub_itemManager;
  var refreshAfterCloseModal = true;
  var curBgPlanData = null; //主界面预算方案
  var agencyCode = ''
  var getTabSetState = function () {
    var $selNav = $(".nav.nav-tabs").find("li.NAVSELECT");
    var statusNav = $selNav.find("a").attr("data-status");
    return statusNav; // O=未提交 A=已提交 其他=全部
  };
  var currentplanData = {}
  var showTblData = function () {
    var statusNav = getTabSetState();
    var loadingMsg = '正在加载调剂指标, 请稍后...';
    var itemStatus = 0;
    var argu = {}
    var url = ''
    if (statusNav == "O") {
      //未提交
      itemStatus = 1;
    } else if (statusNav == "A") {
      //已提交
      itemStatus = 2;
    } else if (statusNav == 'T') {
      itemStatus = ""
    }
    if (statusNav != "A") {
      argu = {
        "agencyCode": bgItemManager.agencyCode,
        "businessDateBegin": $("#startDate").getObj().getValue(),
        "businessDateEnd": $("#endDate").getObj().getValue(),
        "createUser": page.pfData.svUserCode,
        "billType": "4",
        "status": itemStatus
      }
      url = '/bg/dispense/getDispenseBills?rgCode=' + page.pfData.svRgCode + '&setYear=' + page.setYear + '&agencyCode=' + bgItemManager.agencyCode;
    } else {
      argu = {
        "workFlowStatus": "done",
        "agencyCode": bgItemManager.agencyCode,
        "businessDateBegin": $("#startDate").getObj().getValue(),
        "businessDateEnd": $("#endDate").getObj().getValue(),
        "createUser": page.pfData.svUserCode,
        "billType": "4",
        "status": itemStatus
      }
      url = '/bg/dispense/getSubmitDispenseBills?rgCode=' + page.pfData.svRgCode + '&setYear=' + page.setYear + '&agencyCode=' + bgItemManager.agencyCode;
    }

    ufma.showloading(loadingMsg);
    ufma.post(url, argu, function (result) {
      if (result.flag === "success") {
        tblDt = $.extend({}, result.data);
        if (tblDt.billWithItemsVo.length > 0) {
          $("#bgInput-fileCount-twoSidesAdjLower").val(tblDt.billWithItemsVo[0].attachNum + "");
          pageAttachNum = tblDt.billWithItemsVo[0].attachNum;
        }
        ufma.hideloading();

        doPaintTable(tblDt);
      } else {
        ufma.hideloading();
        ufma.showTip(result.msg, null, "error");
      }
    })
    ufma.isShow(reslist);
  };

  function formatCheckboxCol(rowdata) {
    return '<label class="mt-checkbox mt-checkbox-single mt-checkbox-outline"> ' +
      '<input type="checkbox" class="checkboxes" data-level="' + rowdata.levelNum + '" name="mainRowCheck" />&nbsp;' +
      '<span></span> ' +
      '</label>';
  }

  function formatOperate(rowdata) {
    var enableFlag = '';
    // if ($.isNull(rowdata.taskId)) {
    //   enableFlag = 'disabled'
    // } else {
    //   enableFlag = ''
    // }
    if (statusNav == 'O') {
      //未提交
      return '<a class="btn btn-icon-only btn-sm btn-edit mainEditSpan common-jump-link btn-permission" data-toggle="tooltip" ' +
        'rowid="' + rowdata.bgItemId + '" title="编辑" data-original-title="编辑" style="color: #108EE9;">编辑</a>' +
        '<a class="btn btn-icon-only btn-sm btn-send common-jump-link mainAuditSpan btn-permission" data-toggle="tooltip"' +
        'rowid="' + rowdata.bgItemId + '" title="提交" data-original-title="提交" style="margin-left:5px;color: #108EE9;">提交</a>' +
        '<a class="btn btn-icon-only btn-sm btn-look btn-permission mainShowSpan common-jump-link ' + enableFlag + '"  data-toggle="tooltip"' +
        'rowid="' + data + '" title="查看" style="margin-left:5px;color: #108EE9;" style="margin-left:5px;color: #108EE9;">查看</a>' +
        '<a class="btn btn-icon-only btn-delete btn-sm  mainDelSpan common-jump-link btn-permission" data-toggle="tooltip"  ' +
        'rowid="' + rowdata.bgItemId + '"  title="删除" data-original-title="删除" style="margin-left:5px;color: #108EE9;">删除</a>';
    } else if (statusNav == 'A') {
      //提交
      return '<a class="btn btn-icon-only btn-sm btn-back mainCancelAuditSpan common-jump-link btn-permission" data-toggle="tooltip"' +
        'rowid="' + rowdata.bgItemId + '" title="撤回" data-original-title="撤回"style="color: #108EE9;">撤回</a>' +
        '<a class="btn btn-icon-only btn-sm btn-watch-detail  mainLogSpan common-jump-link btn-permission" data-toggle="tooltip" ' +
        'rowid="' + rowdata.bgItemId + '" title="日志" data-original-title="日志" style="margin-left:5px;color: #108EE9;">日志</a>' +
        '<a class="btn btn-icon-only btn-sm btn-look btn-permission mainShowSpan common-jump-link" data-toggle="tooltip"' +
        'rowid="' + data + '" title="查看" style="margin-left:5px;color: #108EE9;">查看</a>';
    } else {
      return '<a class="btn btn-icon-only btn-sm btn-look btn-permission mainShowSpan common-jump-link ' + enableFlag + '"  data-toggle="tooltip"' +
        'rowid="' + data + '" title="查看" style="margin-left:5px;color: #108EE9;">查看</a>';
    }
  }
  /**
   * 主界面 - 画表格
   * @param tblDt
   */
  var doPaintTable = function (tableData) {
    var $selNav = $(".nav.nav-tabs").find("li.NAVSELECT");
    var statusNav = $selNav.find("a").attr("data-status");
    var tmpBillId = '',
      bCreate = true,
      rowSpan, $mgColFirst, $mgColLast;
    var tblCols = [{
      data: "",
      title: '<label class="mt-checkbox mt-checkbox-single mt-checkbox-outline" style="right:-3px"> <input id="input-seleAllUp" type="checkbox" class="checkboxes" name="mainRowCheck">&nbsp;<span></span> </label>',
      class: "notPrint",
      width: "40px"
    }]
    if (statusNav == 'O') {
      tblCols.push({
        data: "bgItemId",
        title: "操作",
        class: "nowrap",
        width: "140px"
      });
    } else if (statusNav == 'A') {
      tblCols.push({
        data: "bgItemId",
        title: "操作",
        class: "nowrap",
        width: "100px"
      });
    }
    tblCols.push({
      data: "bgItemCode",
      title: "指标编码",
      class: "print nowrap BGasscodeClass",
      // width: "100px"
    }, {
      data: "bgItemSummary",
      title: '摘要',
      class: "print nowrap BGThirtyLen",
      //width: "200px"
    });
    if (currentplanData.isComeDocNum == "是") {
      tblCols.push({
        data: "comeDocNum",
        title: "来文文号",
        class: "print nowrap BGThirtyLen",
        //width: "200px"
      });
    }
    if (currentplanData.isSendDocNum == "是") {
      tblCols.push({
        data: "sendDocNum",
        title: page.sendCloName,
        class: "print nowrap BGThirtyLen",
        //width: "200px"
      });
    }
    //循环添加预算方案的要素信息
    for (var index = 0; index < currentplanData.planVo_Items.length; index++) {
      var tmpItem = currentplanData.planVo_Items[index];
      tblCols.push({
        data: _BgPub_getEleDataFieldNameByCode(tmpItem.eleCode, tmpItem.bgItemCode),
        title: tmpItem.eleName,
        class: "print nowrap BGThirtyLen",
        //width: "200px"
      });
    }
    //批复金额名称修改为‘年初预算’
    tblCols.push({
      data: "bgItemCur",
      title: "年初预算",
      class: "bgPubMoneyCol print nowrap BGmoneyClass tr",
      //width: "150px",
      "render": function (data, type, rowdata, meta) {
        if (data == '') {
          return 0;
        } else {
          return $.formatMoney(data, 2);
        }
      }
    });
    //可执行总额名称修改为‘调整后预算’
    tblCols.push({
      data: "realBgItemCur",
      title: "调整后预算",
      className: "isprint nowrap tr BGmoneyClass",
      //width: "150px",
      "render": function (data, type, rowdata, meta) {
        if (data == '') {
          return 0;
        } else {
          return $.formatMoney(data, 2);
        }
      }
    });
    tblCols.push({
      data: "bgAddCurShow",
      title: "调入金额",
      class: "bgPubMoneyCol print nowrap BGmoneyClass tr",
      //width: "150px",
      render: $.fn.dataTable.render.number(',', '.', 2, '') //修改金额千分位处理问题
    });
    tblCols.push({
      data: "bgCutCurShow",
      title: "调出金额",
      class: "bgPubMoneyCol print nowrap BGmoneyClass tr",
      //width: "150px",
      render: $.fn.dataTable.render.number(',', '.', 2, '') //修改金额千分位处理问题
    });
    //调剂后金额修改名称为‘调剂后余额’
    tblCols.push({
      data: "modifyAfterCur",
      title: "调剂后余额",
      class: "bgPubMoneyCol print nowrap BGmoneyClass tr",
      //width: "150px",
      type: "money", //解决主界面table调整后金额千分位问题,
      render: $.fn.dataTable.render.number(',', '.', 2, '') //修改金额千分位处理问题
    });
    tblCols.push({
      data: "bgPlanName",
      title: "预算方案",
      class: "bgPubMoneyCol print nowrap BGThirtyLen",
      //width: "100px"
    });
    //bug76244--增加备注列--经侯总确认目前只加指标调整与指标调剂
    tblCols.push({
      data: "remark",
      title: "备注",
      class: "print nowrap BGThirtyLen",
      //width: "200px"
    });
    var colDefs = [{
      "targets": [1],
      "serchable": false,
      "orderable": false,
      "render": function (data, type, rowdata, meta) {
        var rst = "";
        var enableFlag = '';
        // if ($.isNull(rowdata.taskId)) {
        //   enableFlag = 'disabled'
        // } else {
        //   enableFlag = ''
        // }
        if (statusNav == 'O') {
          //未提交
          rst = '<a class="btn btn-icon-only btn-sm btn-edit mainEditSpan common-jump-link btn-permission" data-toggle="tooltip" ' +
            'rowid="' + rowdata.bgItemId + '" title="编辑" data-original-title="编辑" style="color: #108EE9;">编辑</a>' +
            '<a class="btn btn-icon-only btn-sm btn-send common-jump-link mainAuditSpan btn-permission" data-toggle="tooltip"' +
            'rowid="' + rowdata.bgItemId + '" title="提交" data-original-title="提交" style="margin-left:5px;color: #108EE9;">提交</a>' +
            '<a class="btn btn-icon-only btn-sm btn-look btn-permission mainShowSpan common-jump-link ' + enableFlag + '" data-toggle="tooltip"' +
            'rowid="' + data + '" title="查看" style="margin-left:5px;color: #108EE9;" style="margin-left:5px;color: #108EE9;">查看</a>' +
            '<a class="btn btn-icon-only btn-delete btn-sm  mainDelSpan common-jump-link btn-permission" data-toggle="tooltip"  ' +
            'rowid="' + rowdata.bgItemId + '"  title="删除" data-original-title="删除" style="margin-left:5px;color: #108EE9;">删除</a>';
        } else if (statusNav == 'A') {
          //提交
          rst = '<a class="btn btn-icon-only btn-sm btn-back mainCancelAuditSpan common-jump-link btn-permission" data-toggle="tooltip"' +
            'rowid="' + rowdata.bgItemId + '" title="撤回" data-original-title="撤回" style="color: #108EE9;">撤回</a>' +
            '<a class="btn btn-icon-only btn-sm btn-watch-detail  mainLogSpan common-jump-link btn-permission" data-toggle="tooltip" ' +
            'rowid="' + rowdata.bgItemId + '" title="日志" data-original-title="日志" style="margin-left:5px;color: #108EE9;">日志</a>' +
            '<a class="btn btn-icon-only btn-sm btn-look btn-permission mainShowSpan common-jump-link" data-toggle="tooltip"' +
            'rowid="' + data + '" title="查看" style="margin-left:5px;color: #108EE9;">查看</a>';
        } else {
          return '<a class="btn btn-icon-only btn-sm btn-look btn-permission mainShowSpan common-jump-link ' + enableFlag + '"  data-toggle="tooltip"' +
            'rowid="' + data + '" title="查看" style="margin-left:5px;color: #108EE9;">查看</a>';
        }
        return rst;
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
    var mainTableData = bgItemManager.organizeUrlBillData(tableData, maxDetailCount_eachBill, true, true);
    $("#span-billsCount-twoSidesAdjItem").text(tableData.billWithItemsVo.length + "");

    $("#span-billsTotalMoney-twoSidesAdjItem").text(jQuery.formatMoney(mainTableData.money + "", 2) + ""); //表格下发显示的金额，由于后台已做处理，故前台不需处理
    var bNotAutoWidth = true; //默认是取消自动宽度；

    var sScrollY = $(".workspace").outerHeight(true) - $(".workspace-top").outerHeight(true) - $("#bgMoreMsgPnl").outerHeight(true) - 12 - $(".nav").outerHeight(true) - $("#fixDiv-twoSidesAdjItem").outerHeight(true) - 18 - 34 - 30 - 20;
    var tblSetting = {
      "data": mainTableData.data,
      "columns": tblCols,
      "columnDefs": colDefs,
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
        "autoPrint": true,
        "exportOptions": {
          'modifier': {
            'page': 'current'
          },
          'columns': ".print"
        }
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
      fnCreatedRow: function (nRow, aData, iDataIndex) {
        bCreate = true;
        ////////
        $.data($(nRow)[0], 'rowdata', aData);
        $(nRow).attr('billid', aData.billId);
        if (aData.isBill == 1 || aData.isMore == 1) {
          var tdNum = $('td', nRow).length;
          for (var i = tdNum - 1; i > 2; i--) {
            $('td:eq(' + i + ')', nRow).remove();
          }
          $('td:eq(2)', nRow).attr('colspan', tdNum - 2);
        }
        if (aData.isBill == 1) {
          $(nRow).attr('datatype', 1);
          var checkDate = ufma.parseNull(aData.createDate).substr(0, 10);
          var midRowColSpanHtml = "<a class='billRow-a  common-jump-link btn-watch ' href='javascript:;'>单据编号:&nbsp;" + aData.billCode + "&nbsp;&nbsp;&nbsp;&nbsp;" +
            "单据日期:&nbsp;" + ufma.parseNull(aData.billDate) + "&nbsp;&nbsp;&nbsp;&nbsp;" +
            "单据金额:&nbsp;" + jQuery.formatMoney(aData.billCur + "", 2) + "&nbsp;&nbsp;&nbsp;&nbsp;" +
            "制单人:&nbsp;" + ufma.parseNull(aData.createUserName) + "&nbsp;&nbsp;&nbsp;&nbsp;"; //点击进入查看单据界面
          if (statusNav == 'A') {
            midRowColSpanHtml += "提交人:&nbsp;" + ufma.parseNull(aData.createUserName) + "&nbsp;&nbsp;&nbsp;&nbsp;" +
              "提交日期:&nbsp;" + checkDate + "&nbsp;&nbsp;&nbsp;&nbsp;"; //点击进入查看单据界面
          }
          $('td:eq(2)', nRow).html(midRowColSpanHtml);
        } else if (aData.isMore == 1) {
          $(nRow).attr('datatype', 3);
          var midRowColSpanHtml1 = "<a class='bgPub-billRow-a bgPub-billRow-a-more billRow-a  btn-watch' href='javascript:;'>更多></a>"; //点击进入查看单据界面
          $('td:eq(2)', nRow).html(midRowColSpanHtml1);
        } else {
          $(nRow).attr('datatype', 2);
        }

        ///////////
        var tdNum = $('td', nRow).length;
        if (aData.isBill == 1) {
          $mgColFirst = $('td:eq(0)', nRow);
          $mgColLast = $('td:eq(1)', nRow);
          tmpBillId = aData.billId;
          rowSpan = 1;
        } else {
          rowSpan = rowSpan + 1;
          $('td:eq(' + (tdNum) + ')', nRow).remove();
          $('td:eq(1)', nRow).remove();
          $('td:eq(0)', nRow).remove();
        }
        if ($mgColFirst)
          $mgColFirst.attr('rowspan', rowSpan);
        if ($mgColLast)
          $mgColLast.attr('rowspan', rowSpan);

      },
      "initComplete": function (options, data) {
        bCreate = false;
        var $mainTable = $($('#mainTable-twoSidesAdjItem').closest('.dataTables_scroll').find('.dataTables_scrollHeadInner table'));

        $.fn.dataTable.ext.errMode = 'none';
      },
      "drawCallback": function (settings, json) { //合并单元格
        if (!bCreate) {
          var $tbl = $("#" + tblId);
          $("#" + tblId + ' tbody tr').each(function () {
            var billId = $(this).attr('billid');
            if (billId) {
              var datatype = $(this).attr('datatype');
              if (datatype == 2) {
                var $firstTd = $($(this).find('td').eq(0));
                var $lastTd = $($(this).find('td').eq(1));
                var rowData = $.data($(this)[0], 'rowdata');
                if ($tbl.find('tr[billid="' + billId + '"]').length == 1) {
                  if ($firstTd.find('.mt-checkbox').length == 0) {
                    $('<td>').html(formatCheckboxCol(rowData)).prependTo($(this));
                  };
                  if ($lastTd.find('.btn').length == 0) {
                    $('<td>').html(formatOperate(rowData)).appendTo($(this));
                  }
                } else {
                  if ($firstTd.find('.mt-checkbox').length > 0) {
                    $firstTd.remove();
                  }
                  if ($lastTd.find('.btn').length > 0) {
                    $lastTd.remove();
                  }
                }
              }
            }

          });
        }
        return false;
        var tmpTbl = $("#" + tblId).dataTable();
        var rows = tmpTbl.fnGetNodes(); ////fnGetNodes获取表格所有行，rows[i]表示第i行tr对象
        var colspanCount = 2 + bgItemManager.myBgPlanMsgObj.eleCodeArr.length + 4; //指标编码+摘要+要素列+金额+录入日期
        var rowspan_firstNode = null;
        var rowspan_lastNode = null;
        var rowspanCount = 1;

        //1， 单据头部的横向合并
        for (var i = 0; i < rows.length; i++) {
          var row = rows[i];
          var rowData = tmpTbl.api().row(row).data();
          if (rowData.isBill == 1) { //说明这行是单子头部信息，要进行合并
            var checkDate = ufma.parseNull(rowData.createDate).substr(0, 10);
            var billTitle_checkMsg = '';
            if (statusNav == 'A') { //提交标签下显示提交人和提交日期
              billTitle_checkMsg =
                "提交日期:&nbsp;" + checkDate + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" +
                "提交人&nbsp;:" + rowData.createUserName + "&nbsp;&nbsp;&nbsp;&nbsp;";
            }
            var startRowNodeHtml = $(row).find("td:eq(1)").html();
            var lastRowNodeHtml = $(row).find("td:eq(" + (colspanCount + 1) + ")").html();
            var midRowColSpanHtml = "<a class='billRow-a  btn-watch' href='javascript:;'>单据编号:&nbsp;" + rowData.billCode + "&nbsp;&nbsp;&nbsp;&nbsp;" +
              "单据日期:&nbsp;" + rowData.billDate + "&nbsp;&nbsp;&nbsp;&nbsp;" +
              "单据金额:&nbsp;" + jQuery.formatMoney(rowData.billCur / 2 + "", 2) + "&nbsp;&nbsp;&nbsp;&nbsp;" +
              ufma.parseFloat(rowdata.billCur, 2)
            "制单人&nbsp;:" + rowData.createUserName + "&nbsp;&nbsp;&nbsp;&nbsp;" +
              billTitle_checkMsg + "</a>"; //点击进入查看单据界面
            $(row).empty();
            $(row).append("<td>" + startRowNodeHtml + "</td>" +
              "<td colspan='" + colspanCount + "'>" + midRowColSpanHtml + "</td>" +
              "<td>" + lastRowNodeHtml + "</td>");
          } else if (rowData.isMore == 1) { //说明这行是单位的尾部信息，要添加更多的点击按钮
            var startRowNodeHtml1 = $(row).find("td:eq(1)").html();
            var lastRowNodeHtml1 = $(row).find("td:eq(" + (colspanCount + 2) + ")").html();
            //var lastRowNodeHtml1 = $(row).find("td:eq(1)").html();
            //a.billRow-a
            var midRowColSpanHtml1 = "<a class='bgPub-billRow-a  btn-watch bgPub-billRow-a-more billRow-a' href='javascript:;'>更多></a>"; //点击进入查看单据界面
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
            rowspan_lastNode = $(row).find("td:eq(1)");
            rowspanCount = 1;
          } else {
            if (rowData2.isMore == 0) {
              rowspanCount++;
              rowspan_lastNode.attr("rowspan", rowspanCount);
              $(row).find("td:eq(" + (colspanCount + 1) + ")").remove();
              //   $(row).find("td:eq(1)").remove();
              rowspan_firstNode.attr("rowspan", rowspanCount);
              $(row).find("td:eq(1)").remove();
            } else {
              rowspanCount++;
              rowspan_lastNode.attr("rowspan", rowspanCount);
              $(row).find("td:eq(1)").remove();
              rowspan_firstNode.attr("rowspan", rowspanCount);
              $(row).find("td:eq(0)").remove();
            }
          }
        }
        $.fn.dataTable.ext.errMode = 'none';
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

    _BgPub_ReSetDataTable_AfterPaint(tblId);

    var mainTblFoot_leftPnl = '<div class="bg-multi-floatLeft-1">' + '<label class="mt-checkbox mt-checkbox-single mt-checkbox-outline bg-top-4"> ' + '<input id="input-seleAll" type="checkbox" class="checkboxes" value=""/> &nbsp; 全选' + '<span></span> ' + '</label> ' + '</div>';

    var $selNav = $(".nav.nav-tabs").find("li.NAVSELECT");
    var statusNav = $selNav.find("a").attr("data-status");
    $("#bg-mainTableFooterDiv-leftPnl").append(mainTblFoot_leftPnl);

    addListenerToMainTable();

    ufma.hideloading();
    ufma.isShow(reslist);
  };
  //单据状态变化时及时保存日志
  var doSaveLog = function (optType, items) {
    var url = '/df/access/public/bg/workflow/saveOptLog?rgCode=' + page.pfData.svRgCode + '&setYear=' + page.setYear + '&agencyCode=' + bgItemManager.agencyCode;
    var argu = {
      "optType": optType,
      "billType": "4",
      "items": items
    }
    ufma.post(url, argu, function (result) {

    })
  };
  var addListenerToMainTable = function () {

    /**
     * 主界面 - 给主界面的表格增加监听事件。
     */
    ufma.searchHideShow($('#' + tblId));
    /**
     * 事件一 ： 点击头部可以打开界面
     */
    $("a.billRow-a").off("click").on("click", function (e) {
      var outSendDocNum = '';
      var outComeDocNum = '';
      var outDocNumToId = '';
      var outUpBudgetNeed = '';
      var url = '/bg/sysdata/selectOtherInfo?rgCode=' + page.pfData.svRgCode + '&setYear=' + page.setYear + '&agencyCode=' + bgItemManager.agencyCode;
      ufma.get(url, {}, function (result) {
        outSendDocNum = result.data.isSendDocNum == '1' ? '是' : '否 ';
        outComeDocNum = result.data.isComeDocNum == '1' ? '是' : '否 ';
        outDocNumToId = result.data.isUpBudget;
        outUpBudgetNeed = result.data.sendDocNumToId == '1' ? true : false;
      });
      var billId = tblObj.row($(this).closest("tr")).data().billId;
      var argu = {
        "billType": "4",
        "billId": billId
      }
      var $selNav = $(".nav.nav-tabs").find("li.NAVSELECT");
      var statusNav = $selNav.find("a").attr("data-status");
      var url = '/bg/budgetItem/getBudgetItemsByBill?agencyCode=' + bgItemManager.agencyCode + "&rgCode=" + page.pfData.svRgCode + "&setYear=" + page.setYear;
      ufma.post(url, argu, function (result) {
        //itemDispenseInList表是调入指标;itemDispenseOutList表是调出指标
        var openData = result.data;
        openData.billType = "4";
        if (!$.isNull(openData)) {
          openData.agencyCode = bgItemManager.agencyCode;
          openData.setYear = page.setYear;
          openData.rgCode = page.pfData.svRgCode;
          openData.labStatus = statusNav;
          openData.needSendDocNum = page.needSendDocNum;
          openData.isSendDocNum = currentplanData.isSendDocNum;
          openData.isComeDocNum = currentplanData.isComeDocNum;
          openData.outSendDocNum = outSendDocNum;
          openData.outComeDocNum = outComeDocNum;
          openData.outDocNumToId = outDocNumToId;
          openData.outUpBudgetNeed = outUpBudgetNeed;
          openData.openAction = "inEdit";
          ufma.open({
            url: 'workFlowOpen.html',
            title: '指标调剂',
            width: 1100,
            height: 500,
            data: openData,
            ondestory: function (action) {
              showTblData();

            }
          });
        }
      });
    });
    //查看工作流
    $("#" + tblId + " tbody").on("click", ".mainShowSpan", function (e) {
      var rowDt = tblObj.row($(this).closest("tr")).data();
      var businessKey = rowDt.billId;
      var userCode = page.pfData.svUserCode;
      var billCurValue = rowDt.diffCur;
      var ctrlUser = rowDt.ctrlUser;
      var cwUser = rowDt.cwUser;
      var ctrlDeptCode = rowDt.ctrlDeptCode;
      var ctrlMoney= rowDt.billCur;//金额
      var ctrlDeptNum = rowDt.ctrlDeptNum;//归口部门数量
      var taskId = rowDt.taskId;
    //CWYXM-18142--nbhs指标调剂申请（审批流版）传递给工作流的数据中需要将如下字段值传递过去--zsj
  /**经雪蕊确认：
   * 指标调剂申请（审批流版）传递给工作流的数据中需要将如下字段值传递过去，用于审批流判断该申请单需要走哪些流程
  1.申请人code 2.申请人所在的部门code，（查询人员库中该申请人所在的部门）3.支出类型exptypecode 4.资金性质fundtypecode 5.项目名称depprocode 6.指标编码bg_item_code
   */
      var createUser = rowDt.createUser; //申请人code
      var createDeptCode = rowDt.createDeptCode; //申请人所在的部门code
      var exptypecode = !$.isNull(rowDt.exptypeCode) ? rowDt.exptypeCode.split(' ')[0] : ''; //支出类型
      var fundtypecode = !$.isNull(rowDt.fundtypeCode) ?rowDt.fundtypeCode.split(' ')[0] : ''; //资金性质
      var depprocode = !$.isNull(rowDt.depproCode) ?rowDt.depproCode.split(' ')[0] : ''; //项目名称
      var variables = [{
          type: "integer",
          name: "BILL_CUR",
          value: parseFloat(billCurValue)
        }, {
          type: "string",
          name: "CTRL_USER",
          value: ctrlUser
        }, {
          type: "string",
          name: "CW_USER",
          value: cwUser
        },{
         type: "integer",
         name: "IN_CUR",
         value: ctrlMoney
        },{
          type: "integer",
          name: "CTRL_DEPT_NUM",
          value: ctrlDeptNum
        },
        {
          type: "string",
          name: "CTRL_DEPT_CODE",
          value: ctrlDeptCode
        }, {
          type: "string",
          name: "msgUrl",
          //value: '/pf/bg/nbhs-workFlowTwoSidesAdjustApply/workFlowTwoSidesAdjust.html?mennuid=6a2211ff-353a-4d52-8b3e-f15f45bce5a8'
          //由于制单岗和审批岗有不同的界面url，所以将此url传给工作流，然后在门户点击已办/待办跳转对应界面时根据interfaceType=1来请求/bg/public/workflow/getDispenseUrl，从而获取真实url，实现正确跳转--zsj
          value: '/bg/public/workflow/getDispenseUrl?interfaceType=1'  
        },
        {
          type: 'string',
          name: 'fromUserCode',
          value: page.pfData.svUserCode
        },
        {
          type: 'string',
          name: 'fromUserName',
          value: page.pfData.svUserName
        },
        {
          type: 'string',
          name: 'bizTypeCode',
          value: 'BILL_DISPENSE'
        },
        {
          type: 'string',
          name: 'bizTypeName',
          value: '指标调剂'
        },
        {
          type: 'string',
          name: 'businessKey',
          value: businessKey
        },
        {
          type: 'string',
          name: 'taskId',
          value: taskId
        },
        {
          type: 'string',
          name: 'todoTitle',
          value: '指标调剂申请'
        },
      {
          type: 'string',
          name: 'createUser',
          value: createUser
      },
      {
        type: 'string',
        name: 'name',
        value: createDeptCode
      },
      {
        type: 'string',
        name: 'exptypecode',
        value: exptypecode
      },
      {
        type: 'string',
        name: 'fundtypecode',
        value: fundtypecode
      },
      {
        type: 'string',
        name: 'depprocode',
        value: depprocode
      }
      ];
      ufma.showModal("openWork", 1090);
      emiter.emit('workflow-trace-full', {
        id: '#openWork',
        businessKey: businessKey,
        variables: variables
      });

    });

    /**
     * 事件二 ： 第一列的checkbox支持选择
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
     * 事件三 ： 最后一列的按钮支持事件： 编辑
     */
    $("#" + tblId + " tbody").on("click", ".mainEditSpan", function (e) {
      $(this).closest("tr").find("a.billRow-a").trigger("click");
    });
    //提交--启动工作流
    $("#" + tblId + " tbody").on("click", ".mainAuditSpan", function (e) {

      var rowDt = tblObj.row($(this).closest("tr")).data();
      var businessKey = rowDt.billId;
      var billCurValue = rowDt.diffCur;
      var ctrlUser = rowDt.ctrlUser;
      var cwUser = rowDt.cwUser;
      var ctrlDeptCode = rowDt.ctrlDeptCode;
      var ctrlMoney= rowDt.billCur;//金额
      var ctrlDeptNum = rowDt.ctrlDeptNum;//归口部门数量
    //CWYXM-18142--nbhs指标调剂申请（审批流版）传递给工作流的数据中需要将如下字段值传递过去--zsj
  /**经雪蕊确认：
   * 指标调剂申请（审批流版）传递给工作流的数据中需要将如下字段值传递过去，用于审批流判断该申请单需要走哪些流程
  1.申请人code 2.申请人所在的部门code，（查询人员库中该申请人所在的部门）3.支出类型exptypecode 4.资金性质fundtypecode 5.项目名称depprocode 6.指标编码bg_item_code
   */
    var createUser = rowDt.createUser; //申请人code
    var createDeptCode = rowDt.createDeptCode; //申请人所在的部门code
    var exptypecode = !$.isNull(rowDt.exptypeCode) ? rowDt.exptypeCode.split(' ')[0] : ''; //支出类型
    var fundtypecode = !$.isNull(rowDt.fundtypeCode) ?rowDt.fundtypeCode.split(' ')[0] : ''; //资金性质
    var depprocode = !$.isNull(rowDt.depproCode) ?rowDt.depproCode.split(' ')[0] : ''; //项目名称
      var variables = [{
          type: "integer",
          name: "BILL_CUR",
          value: parseFloat(billCurValue)
        }, {
          type: "string",
          name: "CTRL_USER",
          value: ctrlUser
        }, {
          type: "string",
          name: "CW_USER",
          value: cwUser
        },{
         type: "integer",
         name: "IN_CUR",
         value: ctrlMoney
        },{
          type: "integer",
          name: "CTRL_DEPT_NUM",
          value: ctrlDeptNum
        },
        {
          type: "string",
          name: "CTRL_DEPT_CODE",
          value: ctrlDeptCode
        }, {
          type: "string",
          name: "msgUrl",
          //value: '/pf/bg/nbhs-workFlowTwoSidesAdjustApply/workFlowTwoSidesAdjust.html?mennuid=6a2211ff-353a-4d52-8b3e-f15f45bce5a8'
          //由于制单岗和审批岗有不同的界面url，所以将此url传给工作流，然后在门户点击已办/待办跳转对应界面时根据interfaceType=1来请求/bg/public/workflow/getDispenseUrl，从而获取真实url，实现正确跳转--zsj
          value: '/bg/public/workflow/getDispenseUrl?interfaceType=1'  
        },
        {
          type: 'string',
          name: 'fromUserCode',
          value: page.pfData.svUserCode
        },
        {
          type: 'string',
          name: 'fromUserName',
          value: page.pfData.svUserName
        },
        {
          type: 'string',
          name: 'bizTypeCode',
          value: 'BILL_DISPENSE'
        },
        {
          type: 'string',
          name: 'bizTypeName',
          value: '指标调剂'
        },
        {
          type: 'string',
          name: 'businessKey',
          value: businessKey
        },
        {
          type: 'string',
          name: 'taskId',
          value: taskId
        },
        {
          type: 'string',
          name: 'todoTitle',
          value: '指标调剂申请'
        },
      {
          type: 'string',
          name: 'createUser',
          value: createUser
      },
      {
        type: 'string',
        name: 'name',
        value: createDeptCode
      },
      {
        type: 'string',
        name: 'exptypecode',
        value: exptypecode
      },
      {
        type: 'string',
        name: 'fundtypecode',
        value: fundtypecode
      },
      {
        type: 'string',
        name: 'depprocode',
        value: depprocode
      }
      ];
      var taskId = '';
      var procDefId = '';
      var nodeId = '';
      var checkUrl = '/df/access/public/bg/workflow/checkForNext';
      var checkArgu = {
        agencyCode: bgItemManager.agencyCode,
        bgPlanChrId: rowDt.bgPlanId,
        billType: bgItemManager.billType,
        checkDate: page.pfData.svSysDate,
        checkUser: page.pfData.svUserCode,
        checkUserName: page.pfData.svUserName,
        items: [{
          billId: businessKey
        }],
        setYear: page.setYear,
        status: "3"
      }
      ufma.post(checkUrl, checkArgu, function (result) {
        if (result.flag == 'success') {
          var getWorkDataUrl = '/df/access/public/bg/workflow/getWorkflowParam?agencyCode=' + bgItemManager.agencyCode + '&setYear=' + page.setYear;
          var workArgu = {
            "billId": businessKey,
            "billType": "4",
            "workflowStatus": "todo"
          }
          ufma.ajaxDef(getWorkDataUrl, "post", workArgu, function (res) {
            taskId = res.data.taskId;
            procDefId = res.data.procDefId;
            nodeId = res.data.nodeId;
          })
          var formDefinedData = {
            // 单据类型code
            bizTypeCode: 'BILL_DISPENSE', //"REPAY_GENERAL",单据类型：编制为1；分解为2；调整为3；调剂为4；
            // 区划code
            rgCode: page.pfData.svRgCode,
          };
          //if(taskId == '' || taskId == null) {
          ufma.confirm("确定要提交这条指标吗?", function (action) {
            if (action) {
              if ($.isNull(taskId)) {
                emiter.emit('start', {
                  bizTypeCode: formDefinedData.bizTypeCode,
                  rgCode: formDefinedData.rgCode,
                  businessKey: businessKey,
                  taskId: taskId,
                  nodeId: nodeId,
                  procDefId: procDefId,
                  userCode: page.pfData.svUserCode,
                  variables: variables,
                  bizExtra: {
                    bizTitle: '指标调剂申请',
                    //bizUrl: '/pf/bg/nbhs-workFlowTwoSidesAdjustApply/workFlowTwoSidesAdjust.html?menuid=6a2211ff-353a-4d52-8b3e-f15f45bce5a8'
                    //由于制单岗和审批岗有不同的界面url，所以将此url传给工作流，然后在门户点击已办/待办跳转对应界面时根据interfaceType=1来请求/bg/public/workflow/getDispenseUrl，从而获取真实url，实现正确跳转--zsj
                    bizUrl: '/bg/public/workflow/getDispenseUrl?interfaceType=1'  
                  },
                  onCancel: function () {

                  },
                  onComplete: function (ret) {
                    this.isLoading = false;
                    if (!$.isNull(ret.error)) {
                      var flag = '';
                      if (ret.error == 0) {
                        flag = 'success';
                        ufma.showTip('提交成功', function () {
                          //指标调剂申请界面，点击提交按钮，工作流返回成功后，调用保存日志接口，optType传“13”
                          var optType = "13";
                          doSaveLog(optType, checkArgu.items);
                          //  pnlFindRst.doFindBtnClick();
                          showTblData()
                        }, flag);
                      } else {
                        flag = 'warning';
                        ufma.showTip(ret.message, function () {
                          //pnlFindRst.doFindBtnClick();
                          showTblData()
                        }, flag);
                      }

                      return;
                    }
                    //ufma.showTip(JSON.stringify(ret.extra), function() {}, 'warning');
                  }
                });
              } else {
                emiter.emit('approve', {
                  businessKey: businessKey, // 当有单据Id时，taskId,procDefId和nodeId可不传
                  variables: variables,
                  //menuId: '6f7c4687-0463-4d2c-85c1-178e82361811',
                  taskId: taskId,
                  nodeId: nodeId,
                  procDefId: procDefId,
                  onCancel: function () {},
                  onComplete: function (ret) {
                    //指标调剂申请界面，点击提交按钮，工作流返回成功后，调用保存日志接口，optType传“13”
                    var optType = "13";
                    doSaveLog(optType, checkArgu.items);
                    // pnlFindRst.doFindBtnClick();
                    showTblData()
                  }
                });

              }
            }
          }, {
            'type': 'warning'
          });
        }
      });

    });
    /**
     * 事件五 ： 最后一列的按钮支持事件： 删除
     */
    $("#" + tblId + " tbody").on("click", ".mainDelSpan", function (e) {
      var tmpBill = $("#" + tblId).DataTable().row($(this).closest("tr")).data();
      if (tmpBill.status != "1") { //等于1可以 删除，不等于1才不能删除--zsj
        ufma.showTip("已提交的流程不能删除", null, "warning");
        return false;
      }
      ufma.confirm("确定要删除本条单据[" + tmpBill.billCode + "]吗?",
        function (action) {
          if (action) {
            bgItemManager.deleteBill([tmpBill.billId], tmpBill.bgPlanId,
              function () {
                ufma.showTip("删除成功", null, "success");
                //pnlFindRst.doFindBtnClick();
                showTblData()
              },
              function (msg) {
                ufma.showTip("删除失败！" + result.msg, null, "error");
              });
          }
        }, {
          'type': 'warning'
        });
    });
    /**
     * 事件六 ： 最后一列的按钮支持事件： 撤回
     */
    $("#" + tblId + " tbody").on("click", ".mainCancelAuditSpan", function (e) {
      var rowDt = tblObj.row($(this).closest("tr")).data();
      var businessKey = rowDt.billId;
      var taskId = rowDt.taskId;
      var procDefId = rowDt.procDefId;
      var nodeId = rowDt.nodeId;
      var procInstId = rowDt.procInstId;
      var billCurValue = rowDt.diffCur;
      var ctrlUser = rowDt.ctrlUser;
      var cwUser = rowDt.cwUser;
      var ctrlDeptCode = rowDt.ctrlDeptCode;
      var ctrlMoney= rowDt.billCur;//金额
      var ctrlDeptNum = rowDt.ctrlDeptNum;//归口部门数量
    //CWYXM-18142--nbhs指标调剂申请（审批流版）传递给工作流的数据中需要将如下字段值传递过去--zsj
  /**经雪蕊确认：
   * 指标调剂申请（审批流版）传递给工作流的数据中需要将如下字段值传递过去，用于审批流判断该申请单需要走哪些流程
  1.申请人code 2.申请人所在的部门code，（查询人员库中该申请人所在的部门）3.支出类型exptypecode 4.资金性质fundtypecode 5.项目名称depprocode 6.指标编码bg_item_code
   */
    var createUser = rowDt.createUser; //申请人code
    var createDeptCode = rowDt.createDeptCode; //申请人所在的部门code
    var exptypecode = !$.isNull(rowDt.exptypeCode) ? rowDt.exptypeCode.split(' ')[0] : ''; //支出类型
    var fundtypecode = !$.isNull(rowDt.fundtypeCode) ?rowDt.fundtypeCode.split(' ')[0] : ''; //资金性质
    var depprocode = !$.isNull(rowDt.depproCode) ?rowDt.depproCode.split(' ')[0] : ''; //项目名称
      var variables = [{
          type: "integer",
          name: "BILL_CUR",
          value: parseFloat(billCurValue)
        }, {
          type: "string",
          name: "CTRL_USER",
          value: ctrlUser
        }, {
          type: "string",
          name: "CW_USER",
          value: cwUser
        },{
         type: "integer",
         name: "IN_CUR",
         value: ctrlMoney
        },{
          type: "integer",
          name: "CTRL_DEPT_NUM",
          value: ctrlDeptNum
        },
        {
          type: "string",
          name: "CTRL_DEPT_CODE",
          value: ctrlDeptCode
        }, {
          type: "string",
          name: "msgUrl",
          //value: '/pf/bg/nbhs-workFlowTwoSidesAdjustApply/workFlowTwoSidesAdjust.html?mennuid=6a2211ff-353a-4d52-8b3e-f15f45bce5a8'
          //由于制单岗和审批岗有不同的界面url，所以将此url传给工作流，然后在门户点击已办/待办跳转对应界面时根据interfaceType=1来请求/bg/public/workflow/getDispenseUrl，从而获取真实url，实现正确跳转--zsj
          value: '/bg/public/workflow/getDispenseUrl?interfaceType=1'  
        },
        {
          type: 'string',
          name: 'fromUserCode',
          value: page.pfData.svUserCode
        },
        {
          type: 'string',
          name: 'fromUserName',
          value: page.pfData.svUserName
        },
        {
          type: 'string',
          name: 'bizTypeCode',
          value: 'BILL_DISPENSE'
        },
        {
          type: 'string',
          name: 'bizTypeName',
          value: '指标调剂'
        },
        {
          type: 'string',
          name: 'businessKey',
          value: businessKey
        },
        {
          type: 'string',
          name: 'taskId',
          value: taskId
        },
        {
          type: 'string',
          name: 'todoTitle',
          value: '指标调剂申请'
        },
      {
          type: 'string',
          name: 'createUser',
          value: createUser
      },
      {
        type: 'string',
        name: 'name',
        value: createDeptCode
      },
      {
        type: 'string',
        name: 'exptypecode',
        value: exptypecode
      },
      {
        type: 'string',
        name: 'fundtypecode',
        value: fundtypecode
      },
      {
        type: 'string',
        name: 'depprocode',
        value: depprocode
      }

      ];
      ufma.confirm('您确定要撤销选择的流程吗？', function (ac) {
        if (ac) {
          //permitCancel:0是不可撤销，permitCancel:1是可撤销
          emiter.emit('canTaskCancel', {
            taskId: taskId,
            businessKey: businessKey, // 当有单据Id时，taskId,procDefId和nodeId可不传
            onCancel: function () {},
            onComplete: function (ret) {
              if (ret == false) {
                ufma.showTip('流程不可撤销', function () {}, 'warning')
              } else if (ret == true) {
                emiter.emit('cancel', {
                  taskId: taskId,
                  // nodeId: nodeId,
                  // procDefId: procDefId,
                  // procInstId: procInstId,
                  bizExtra: {
                    bizTitle: '指标调剂申请',
                    //bizUrl: '/pf/bg/nbhs-workFlowTwoSidesAdjustApply/workFlowTwoSidesAdjust.html?mennuid=6a2211ff-353a-4d52-8b3e-f15f45bce5a8'
                    //由于制单岗和审批岗有不同的界面url，所以将此url传给工作流，然后在门户点击已办/待办跳转对应界面时根据interfaceType=1来请求/bg/public/workflow/getDispenseUrl，从而获取真实url，实现正确跳转--zsj
                    bizUrl: '/bg/public/workflow/getDispenseUrl?interfaceType=1'  
                  },
                  businessKey: businessKey, // 当有单据Id时，taskId,procDefId和nodeId可不传
                  variables: variables,
                  onCancel: function () {},
                  onComplete: function (ret) {
                    //指标调剂申请界面，点击撤回按钮，工作流返回成功后，调用保存日志接口，optType传“14”
                    var optType = "14";
                    var items = [{
                      "billId": businessKey
                    }]
                    doSaveLog(optType, items);
                    // pnlFindRst.doFindBtnClick();
                    showTblData()
                  }
                });
              }
            }
          });
        }
      }, {
        'type': 'warning'
      });

    });
    //日历
    $('.uf-datepicker').ufDatepicker({
      format: 'yyyy-mm-dd',
      initialDate: new Date()
    });
    /**
     * 事件七 ： 最后一列的按钮支持事件： 日志
     */
    $("#" + tblId + " tbody").on("click", ".mainLogSpan", function (e) {
      var tr = $(this).closest("tr");
      var dt = tblObj.row(tr).data();
      _bgPub_showLogModal("workFlowTwoSidesAdjustApply", {
        "bgBillId": dt.billId,
        "bgItemCode": "",
        "agencyCode": bgItemManager.agencyCode,
        "setYear": page.setYear
      });
    });

    $("#input-seleAllUp").off("change").on("change", function () {
      var selAll = ($(this).is(":checked") == true);
      $("#input-seleAll-twoSidesAdjItem").prop("checked", selAll);
      var rows = $("#" + tblId).dataTable().fnGetNodes();
      for (var k = 0; k < rows.length; k++) {
        var row = rows[k];
        if ($(row).find("td:eq(0):has(label)").length > 0) {
          $(row).find("td:eq(0):has(label)").find("input[type='checkbox']").prop("checked", selAll);
          $(row).find("td:eq(0):has(label)").find("input[type='checkbox']").trigger("change");
        }
      }
    });
  };


  //********************************************************[绑定事件]********************************************************
  /**
   * 主界面 - 新增 按钮点击事件。打开模态框
   */
  $("#btnAdd").on("click", function () {
    bgItemManager.newBill(
      function (data) {
        data.openAction = "inAdd";
        data.billType = "4";
        data.needSendDocNum = page.needSendDocNum;
        ufma.open({
          url: 'workFlowOpen.html',
          title: '指标调剂',
          width: 1400,// add by lnj 20200707 原来是1100 500
          height: 750,
          data: data,
          ondestory: function (action) {
            showTblData();
          }
        });
      },
      function (msg) {
        ufma.showTip(msg, null, "error");
      }
    )
  });

  $("#btn-modal-save").on("click", function () {
    var modal_curSheetIndex = 4;
    doSaveBill(function () {
      gotoModalSheet(modal_curSheetIndex);
    });

  });

  $("#btn-modal-continue").on("click", function () {
    $("#btn-modal-close").trigger("click");
    $("#btnAdd").trigger("click");
  });
  /**
   * 模态框 - 取消
   */
  $("#btn-modal-close").on("click", function () {
    //bugCWYXM-4545--查看已提交的指标调剂单据，应不可以编辑--zsj--已提交单据点取消时不提示，直接关闭
    if ($("#btn-modal-close").attr("sheet") == '3') {
      var Sheet3Out = modal_table_sheet3_out.getTableData();
      var Sheet3In = modal_table_sheet3_in.getTableData();
      if (!$.equalsArray(cacheSheet3Out, Sheet3Out) || !$.equalsArray(cacheSheet3In, Sheet3In)) {
        ufma.confirm("有未保存的数据，是否确定离开页面?", function (rst) {
          if (rst) {
            modal_Obj.close();
          }
        }, {
          'type': 'warning'
        });

        return false;
      } else {
        modal_Obj.close();
      }
    } else {
      modal_Obj.close();
    }

    if (refreshAfterCloseModal) {
      // pnlFindRst.doFindBtnClick();
      showTblData()
    }
  });

  /**
   * 主界面  -  未提交、提交、全部 页签变动
   */
  $(".nav.nav-tabs li").on("click", function (e) {
    var tmpStatus = $(this).find('a').attr("data-status");
    if (tmpStatus == "O") {
      $("#btn-check-twoSidesAdjItem").removeClass('hide');
      $("#btn-del-twoSidesAdjItem").removeClass('hide');
      $("#btn-un-check-twoSidesAdjItem").addClass('hide');
    } else if (tmpStatus == "A") {
      $("#btn-check-twoSidesAdjItem").addClass('hide');
      $("#btn-un-check-twoSidesAdjItem").removeClass('hide');
      $("#btn-check-twoSidesAdjItem").addClass('hide');
      $("#btn-del-twoSidesAdjItem").addClass('hide');
    } else {
      $("#btn-check-twoSidesAdjItem").addClass('hide');
      $("#btn-del-twoSidesAdjItem").addClass('hide');
      $("#btn-un-check-twoSidesAdjItem").addClass('hide');
    }
    $(".nav.nav-tabs li").removeClass("NAVSELECT");
    $(this).addClass("NAVSELECT");
    // pnlFindRst.doFindBtnClick(); 
    showTblData() //调用查询
    $("#input-seleAll-twoSidesAdjItem").prop("checked", false); //切换页签清空全选按钮  guohx 20171206
    $("#input-seleAllUp").prop("checked", false);
  });
  $('#btnQry').on('click',function(){
    showTblData(); 
   })
  /**
   * 主界面 - 打印
   */
  $("#budgetItemTwoSidesAdjust-print").off("click").on("click", function () {
    $("." + tblPrintBtnClass).trigger("click");
  });

  /**
   * 主界面 - 导出
   */

  $("#export").off("click").on("click", function () { //CWYXM-9822 指标管理：指标调剂点击导出按钮，导出按钮没有反应--zsj
    $("." + tblPrintBtnClassExpXls).trigger("click");
  });

  /**
   * 主界面 - 全选 checkbox变动
   */
  $("#input-seleAll-twoSidesAdjItem").off("change").on("change", function (e) {
    var selAll = ($(this).is(":checked") == true);
    $("#input-seleAllUp").prop("checked", selAll);
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
   * 主界面 - 删除 按钮响应事件
   */
  $("#btn-del-twoSidesAdjItem").off("click").on("click", function () {
    var billArr = [];
    var rows = $("#" + tblId).dataTable().fnGetNodes();
    for (var k = 0; k < rows.length; k++) {
      var row = rows[k];
      if ($(row).find("td:eq(0):has(label)").length > 0) {
        if ($(row).find("td:eq(0):has(label)").find("input[type='checkbox']").is(":checked") == true) {
          var billStatus = $("#" + tblId).DataTable().row(row).data().status;
          if (billStatus == '3') {
            //已提交的不能删除
            continue;
          }
          //此行进行删除
          var rowDt = tblObj.row(row).data();
          billArr.push(rowDt.billId);
        }
      }
    }

    if (billArr.length == 0) {
      ufma.showTip("请选择要删除的单据(已提交单据不能删除)", null, "warning");
      return false;
    }

    ufma.confirm("确认要删除所选单据吗?", function (rst) {
      if (!rst) {
        return false;
      }
      bgItemManager.deleteBill(billArr, curBgPlanData.chrId, function (rst) {
        ufma.showTip("删除成功", null, "success");
        // pnlFindRst.doFindBtnClick();
        showTblData()
        $("#input-seleAll-twoSidesAdjItem").prop("checked", false);
        $("#input-seleAllUp").prop("checked", false);
      }, function (msg) {
        ufma.showTip("删除失败: " + msg, null, "error");
      });
    }, {
      'type': 'warning'
    });
  });
  var getAgencyCode = function () {
    ufma.showloading('正在加载数据，请耐心等待...');
    var arguAge = {
      setYear: page.setYear,
      rgCode: page.rgCode
    }
    ufma.get('/bg/sysdata/getAgencyList', arguAge, function (result) {
      $('#cbAgency').ufTreecombox({
        idField: 'id', //可选
        textField: 'codeName', //可选
        pIdField: 'pId', //可选
        readonly: false,
        placeholder: '请选择单位',
        icon: 'icon-unit',
        theme: 'label',
        leafRequire: true,
        data: result.data,
        onChange: function (sender, treeNode) {
          agencyCode = treeNode.code;
          //缓存单位账套
          var params = {
            selAgecncyCode: treeNode.code,
            selAgecncyName: treeNode.name,
          }
          bgItemManager.agencyCode = treeNode.code;
          ufma.setSelectedVar(params);
          getWorkFlowConfing()
          getNeedSendDocNumStatus()
          getColumns()
        },
        onComplete: function (sender) {
          if (page.pfData.svAgencyCode) {
            $('#cbAgency').getObj().val(page.pfData.svAgencyCode);
          } else {
            $('#cbAgency').getObj().val('1');
          }
          ufma.hideloading();
        }
      });
    })
  }
  var getNeedSendDocNumStatus = function () {
    //CWYXM-12690--根据系统选项判断发文文号是否必填，若必填则将列名“发文文号”改完指标id--zsj
    var bgUrl = '/bg/sysdata/selectSysRgParaValue?rgCode=' + page.rgCode + '&setYear=' + page.setYear + '&agencyCode=' + agencyCode + '&chrCode=BG003';
    ufma.get(bgUrl, {}, function (result) {
      page.needSendDocNum = result.data;
      if (page.needSendDocNum == true) {
        page.sendCloName = "指标id";
      } else {
        page.sendCloName = "发文文号";
      }
    });
  }
  //ysdp:20200728093234--nbhs--门户待办、已办事项跳转问题--zsj
  var GetQueryString = function (name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
  }
  var getColumns = function () {
    ufma.get('/bg/sysdata/getAllItemsInUse?setYear=' + page.setYear + '&rgCode=' + page.rgCode + '&agencyCode=' + agencyCode, {},
      function (result) {
        currentplanData = result.data
        //ysdp:20200728093234--nbhs--门户待办、已办事项跳转问题--zsj
        var myDataFrom = GetQueryString("bgDataFrom");
				if (!$.isNull(myDataFrom)) {
					if (myDataFrom == '1') {
            $('.sendN').addClass('active').siblings().removeClass('active');
            $('.sendN').addClass("NAVSELECT").siblings().removeClass('NAVSELECT');
            $("#btn-check-twoSidesAdjItem").removeClass('hide');
            $("#btn-del-twoSidesAdjItem").removeClass('hide');
            $("#btn-un-check-twoSidesAdjItem").addClass('hide');
            $("#input-seleAll-twoSidesAdjItem").prop("checked", false); //切换页签清空全选按钮  guohx 20171206
            $("#input-seleAllUp").prop("checked", false);
          } else if (myDataFrom == '2') {
            $('.sendY').addClass('active').siblings().removeClass('active');
            $('.sendY').addClass("NAVSELECT").siblings().removeClass('NAVSELECT');
            $("#btn-check-twoSidesAdjItem").addClass('hide');
            $("#btn-un-check-twoSidesAdjItem").removeClass('hide');
            $("#btn-check-twoSidesAdjItem").addClass('hide');
            $("#btn-del-twoSidesAdjItem").addClass('hide');
            $("#input-seleAll-twoSidesAdjItem").prop("checked", false); //切换页签清空全选按钮  guohx 20171206
            $("#input-seleAllUp").prop("checked", false);
          }
        }
        showTblData() //调用查询
      })
  }
  var getWorkFlowConfing = function () {
    // 获得工作流的ip+端口的接口是：GET    /df/access/public/bg/workflow/getWorkFlowUrl 没有参数
    var workUrl = '';
    ufma.get('/df/access/public/bg/workflow/getWorkFlowUrl', {}, function (result) {
      workUrl = result.data;
      var flowModelerBaseUrl = "http://" + workUrl + "/fbpm-modeler";
      var flowProcessBaseUrl = "http://" + workUrl + "/fbpm-process";
      emiter.emit('config', {
        userCode: page.pfData.svUserCode,
        flowModelerBaseUrl: flowModelerBaseUrl,
        flowProcessBaseUrl: flowProcessBaseUrl,
        appCode: "BG", //"cwbx",
        rgCode: page.pfData.svRgCode,
        unitCode: bgItemManager.agencyCode
      });
    });
  }
  //********************************************************[界面入口函数]*****************************************************
  var page = function () {
    return {
      init: function () {
        reslist = ufma.getPermission();
        ufma.isShow(reslist);
        ufma.parse();
        page.pfData = ufma.getCommonData();
        page.setYear = parseInt(page.pfData.svSetYear);
        page.rgCode = parseInt(page.pfData.svRgCode);
        getAgencyCode()
        bgItemManager = new _bgPub_itemManager();
        bgItemManager.billType = 4;

        $(document).on('click', '#_bgPub_btn_more_bgMoreMsgPnl-twoSidesAdjItem', function (e) {
          adjWindow();
        });
        $('[data-toggle="tooltip"]').tooltip();
        $.fn.dataTable.ext.errMode = 'none';
        $('#startDate').ufDatepicker({
          format: 'yyyy-mm-dd',
          initialDate: new Date(page.setYear, 0, 1)
        });
        //CWYXM-11195 --指标台账，查询默认日期应为登录年度，目前为服务器年度--zsj
        $('#endDate').ufDatepicker({
          format: 'yyyy-mm-dd',
          initialDate: new Date(page.pfData.svTransDate)
        });
      }
    }
  }();

  page.init();
});