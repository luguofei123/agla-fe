$(function () {
  var mainDivId = "workFlowTwoSidesAdjustVerify";
  var pnlFindRst = null;
  var tblDt = null; //指标数据
  var tblId = "mainTable-twoSidesAdjItem";
  var tblObj = null;
  var tblCellTree = null;

  var modal_curBill = null; //当前的模态框的调剂单据

  var modal_clearTableAfterSave = false; //保存后清空表格
  var modal_open_type = 1; // 模态框打开的方式。1=新增状态打开   2=修改状态打开。默认是1.
  var tblPrintBtnClass = "mainTable-twoSideAdjItem-printBtn";
  var tblPrintBtnClassExpXls = "mainTable-twoSideAdjItem-expXlsBtn";
  var maxDetailCount_eachBill = 6; //每条单据最大的显示行数
  var bgItemManager = null; // _bgPub_itemManager;

  var tempBeginCur = null;
  var tempBeginPid = null;
  var curBgPlanData = null; //主界面预算方案
  var moreMsgSetting = {
    "agencyCode": '',
    showMoney: false,
    dateTimeAtFirst: true,
    computHeight: function (tblH_before, tblH_after) {},
    changeBgPlan: function (data) {
      //实在找不到原因，ufma-combox-popup默认不显示
      setTimeout(function () {
        $('.ufma-combox-popup').css({
          'display': 'none'
        });
      }, 100);
      curBgPlanData = data;
      bgItemManager.loadBgPlanObjFromObj(data);
      pnlFindRst.doFindBtnClick();
    },
    afterFind: function (data) {},
    doFindBySelf: function (eleCdtn) {
      showTblData(false, eleCdtn);
    }
  };
  var getTabSetState = function () {
    var $selNav = $(".nav.nav-tabs").find("li.NAVSELECT");
    var statusNav = $selNav.find("a").attr("data-status");
    return statusNav; // O=未审批 A=已审批 其他=全部
  };
  var roleCodeSet = '';

  /**
   * 根据预算方案显示主页面的主表(获取数据，调用doPaintTable函数绘制表格。)
   * @param  {[type]} bNotRepaintTbl [false=url获得数据并且刷新表格   true=url获得数据，但不刷新表格]
   * @param  {[eleInBgItemObj]} pEleCdtn [=null 时，会自行组装一个对象；否则使用此参数的对象]
   * @return {[type]}                [description]
   */
  var showTblData = function (bNotRepaintTbl, pEleCdtn) {
    //var statusNav = getTabSetState();
    var loadingMsg = '正在加载调剂指标, 请稍后...';
    var $selNav = $(".nav.nav-tabs").find("li.NAVSELECT");
    var statusNav = $selNav.find("a").attr("data-status");
    var eleCdtn = {};
    if (statusNav == "todo" || statusNav == "done") {
      eleCdtn = {
        "rgCode": "87",
        "agencyCode": bgItemManager.agencyCode,
        "setYear": page.pfData.svSetYear,
        "rgCode": page.pfData.svRgCode,
        "billType": "4",
        "bgPlanChrId": curBgPlanData.chrId,
        "businessDateBegin": $('#_bgPub_dtpBegin_bgMoreMsgPnl-twoSidesAdjItem').getObj().getValue(),
        "businessDateEnd": $('#_bgPub_dtpEnd_bgMoreMsgPnl-twoSidesAdjItem').getObj().getValue(),
        "workFlowStatus": statusNav
      }
    }
    ufma.showloading(loadingMsg);
    /*var dt = bgItemManager.getBgBills(pEleCdtn,
    	function(result) {*/
    ufma.post('/df/access/public/bg/workflow/getBillTodoList', eleCdtn, function (result) {
        if (result.flag === "success") {
          tblDt = $.extend({}, result.data);
          //bug77471--zsj
          if (tblDt.billWithItemsVo.length > 0) {
            $("#bgInput-fileCount-twoSidesAdjLower").val(tblDt.billWithItemsVo[0].attachNum + "");
            pageAttachNum = tblDt.billWithItemsVo[0].attachNum;
          }
          ufma.hideloading();
          if (bNotRepaintTbl) {
            return;
          }
          doPaintTable(tblDt);
        } else {
          ufma.hideloading();
          ufma.showTip(result.msg, null, "error");
        }
      }
      /*function(data) {
      	ufma.hideloading();
      	ufma.showTip(data, null, "error");
      }, itemStatus*/
    );
    ufma.isShow(reslist);
  };

  function formatCheckboxCol(rowdata) {
    return '<label class="mt-checkbox mt-checkbox-single mt-checkbox-outline"> ' +
      '<input type="checkbox" class="checkboxes" data-level="' + rowdata.levelNum + '" name="mainRowCheck" />&nbsp;' +
      '<span></span> ' +
      '</label>';
  }

  function formatOperate(rowdata) {
    if (statusNav == "todo") {
      //未审批
      return '<a class="btn btn-icon-only btn-sm btn-edit btn-permission mainEditSpan common-jump-link"' +
        'rowid="' + rowdata.bgItemId + '" title="编辑" data-original-title="编辑" style="color: #108EE9;">编辑</a>' +
        '<a class="btn btn-icon-only btn-sm btn-audit  btn-permission mainAuditSpan common-jump-link" ' +
        'rowid="' + rowdata.bgItemId + '"  title="审批" data-original-title="审批" style="margin-left:5px;color: #108EE9;">审批</a>' +
        '<a class="btn btn-icon-only btn-back btn-sm  btn-permission mainBackSpan common-jump-link" data-toggle="tooltip"  ' +
        'rowid="' + rowdata.bgItemId + '"  title="驳回" data-original-title="驳回" style="margin-left:5px;color: #108EE9;">驳回</a>' +
        '<a class="btn btn-icon-only btn-sm btn-look btn-permission mainShowSpan common-jump-link" data-toggle="tooltip"' +
        'rowid="' + data + '" title="查看" style="margin-left:5px;color: #108EE9;">查看</a>';
    } else if (statusNav == "done") {
      //审批
      return '<a class="btn btn-icon-only btn-sm btn-un-audit btn-permission  mainCancelAuditSpan common-jump-link" action= "unactive" ' +
        'rowid="' + rowdata.bgItemId + '"   title="销审" data-original-title="销审" style="margin-left:5px;color: #108EE9;">销审</a>' +
        '<a class="btn btn-icon-only btn-sm btn-watch-detail btn-permission mainLogSpan common-jump-link" action= "unactive" ' +
        'rowid="' + rowdata.bgItemId + '"  title="日志" data-original-title="日志" style="margin-left:5px;color: #108EE9;">日志</a>' +
        '<a class="btn btn-icon-only btn-sm btn-l  mainShowSpan common-jump-link btn-permission" data-toggle="tooltip"' +
        'rowid="' + data + '" title="查看" style="margin-left:5px;color: #108EE9;">查看</a>'
    }
  }
  /**
   * 主界面 - 画表格
   * @param tblDt
   */
  var doPaintTable = function (tableData) {
    var tmpBillId = '',
      bCreate = true,
      rowSpan, $mgColFirst, $mgColLast;
    var tblCols = [{
        data: "",
        title: '<label class="mt-checkbox mt-checkbox-single mt-checkbox-outline" style="right:-3px"> <input id="input-seleAllUp" type="checkbox" class="checkboxes" name="mainRowCheck">&nbsp;<span></span> </label>',
        className: "notPrint",
        width: "40px"
      },
      {
        data: "bgItemCode",
        title: "指标编码",
        className: "print BGasscodeClass",
        // width: "100px"
      },
      // CWYXM-18408--指标年结涉及采购合同报销模块占用的指标结转完善--zsj
      {
        data: "bgTypeName",
        title: "指标类型",
        className: "isprint nowrap BGTenLen", 
      },
      {
        data: "bgItemSummary",
        title: '摘要',
        className: "print BGThirtyLen",
        // width: "200px"
      }
    ];
    if (currentplanData.isComeDocNum == "是") {
      tblCols.push({
        data: "comeDocNum",
        title: "来文文号",
        className: "print BGThirtyLen",
        // width: "200px"
      });
    }
    if (currentplanData.isSendDocNum == "是") {
      tblCols.push({
        data: "sendDocNum",
        title: page.sendCloName,
        className: "print BGThirtyLen",
        // width: "200px"
      });
    }
    //循环添加预算方案的要素信息
    for (var index = 0; index < bgItemManager.myBgPlanMsgObj.eleCodeArr.length; index++) {
      tblCols.push({
        data: _BgPub_getEleDataFieldNameByCode(bgItemManager.myBgPlanMsgObj.eleCodeArr[index],
          bgItemManager.myBgPlanMsgObj.eleFieldName[index]),
        title: bgItemManager.myBgPlanMsgObj.eleNameArr[index],
        className: "print BGThirtyLen",
        // width: "200px"
      });
    }
    //添加最后的金额，日期，操作列
    //批复金额名称修改为‘年初预算’
    tblCols.push({
      data: "bgItemCur",
      title: "年初预算",
      className: "bgPubMoneyCol print BGmoneyClass tr",
      // width: "150px",
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
      className: "isprint nowrap BGmoneyClass tr",
      // width: "150px",
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
      className: "bgPubMoneyCol print BGmoneyClass tr",
      // width: "150px",
      render: $.fn.dataTable.render.number(',', '.', 2, '') //修改金额千分位处理问题
    });
    tblCols.push({
      data: "bgCutCurShow",
      title: "调出金额",
      className: "bgPubMoneyCol print BGmoneyClass tr",
      // width: "150px",
      render: $.fn.dataTable.render.number(',', '.', 2, '') //修改金额千分位处理问题
    });
    //调剂后金额修改名称为‘调剂后余额’
    tblCols.push({
      data: "modifyAfterCur",
      title: "调剂后余额",
      className: "bgPubMoneyCol print BGmoneyClass tr",
      // width: "150px",
      type: "money", //解决主界面table调整后金额千分位问题,
      render: $.fn.dataTable.render.number(',', '.', 2, '') //修改金额千分位处理问题
    });
    tblCols.push({
      data: "bgPlanName",
      title: "预算方案",
      className: "bgPubMoneyCol print BGThirtyLen",
      // width: "100px"
    });
    //bug76244--增加备注列--经侯总确认目前只加指标调整与指标调剂
    tblCols.push({
      data: "remark",
      title: "备注",
      className: "print BGThirtyLen",
      // width: "200px"
    });
    var statusNav = getTabSetState();
    var loadingMsg = '正在加载调剂指标, 请稍后...';
    var itemStatus = 0;
    if (statusNav == "todo") {
      tblCols.push({
        data: "bgItemId",
        title: "操作",
        className: "notPrint",
        width: "140px"
      });
    } else if (statusNav == "done") {
      tblCols.push({
        data: "bgItemId",
        title: "操作",
        className: "notPrint",
        width: "100px"
      });
    }

    var colDefs = [{
      "targets": [-1],
      "serchable": false,
      "orderable": false,
      "render": function (data, type, rowdata, meta) {
        var rst = "";
        if (statusNav == "todo") {
          rst = '<a class="btn btn-icon-only btn-sm btn-edit btn-permission mainEditSpan common-jump-link" data-toggle="tooltip" ' +
            'rowid="' + data + '" title="编辑" style="color: #108EE9;">编辑</a>' +
            '<a class="btn btn-icon-only btn-sm btn-audit btn-permission mainAuditSpan common-jump-link" data-toggle="tooltip"' +
            'rowid="' + data + '" title="审批" style="margin-left:5px;color: #108EE9;">审批</a>' +
            '<a class="btn btn-icon-only btn-sm btn-look btn-permission mainShowSpan common-jump-link" data-toggle="tooltip"' +
            'rowid="' + data + '" title="查看" style="margin-left:5px;color: #108EE9;">查看</a>' +
            '<a class="btn btn-icon-only btn-sm btn-back btn-permission mainBackSpan common-jump-link" data-toggle="tooltip"' +
            'rowid="' + data + '" title="驳回" style="margin-left:5px;color: #108EE9;">驳回</a>';
        } else if (statusNav == "done") {
          rst =
            '<a class="btn btn-icon-only btn-sm btn-canlceCheck   mainCancelAuditSpan common-jump-link" data-toggle="tooltip" ' +
            'rowid="' + data + '" title="销审"style="margin-left:5px;color: #108EE9;">销审</a>' +
            '<a class="btn btn-icon-only btn-sm btn-watch-detail btn-permission mainLogSpan common-jump-link"' +
            'rowid="' + data + '"  title="日志" data-original-title="日志" style="margin-left:5px;color: #108EE9;">日志</a>' +
            '<a class="btn btn-icon-only btn-sm btn-look   mainShowSpan common-jump-link" data-toggle="tooltip"' +
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
    //$("#span-billsTotalMoney-twoSidesAdjItem").text(jQuery.formatMoney(mainTableData.money / 2 + "", 2) + "");//表格下发显示的金额
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
          for (var i = tdNum - 2; i > 1; i--) {
            $('td:eq(' + i + ')', nRow).remove();
          }
          $('td:eq(1)', nRow).attr('colspan', tdNum - 2);
        }
        var $selNav = $(".nav.nav-tabs").find("li.NAVSELECT");
        var statusNav = $selNav.find("a").attr("data-status");
        if (aData.isBill == 1) {
          $(nRow).attr('datatype', 1);
          var checkDate = ufma.parseNull(aData.checkDate).substr(0, 10);
          var midRowColSpanHtml = "<a data-procInstId='" + aData.procInstId + "' data-procDefId='" + aData.procDefId + "' data-nodeId='" + aData.nodeId + "' data-taskId='" + aData.taskId + "' data-diffCur='" + aData.diffCur + "'  class='billRow-a  common-jump-link btn-watch' href='javascript:;'>单据编号:&nbsp;" + aData.billCode + "&nbsp;&nbsp;&nbsp;&nbsp;" +
            "单据日期:&nbsp;" + ufma.parseNull(aData.billDate) + "&nbsp;&nbsp;&nbsp;&nbsp;" +
            "单据金额:&nbsp;" + jQuery.formatMoney(aData.billCur + "", 2) + "&nbsp;&nbsp;&nbsp;&nbsp;" +
            "制单人:&nbsp;" + ufma.parseNull(aData.createUserName) + "&nbsp;&nbsp;&nbsp;&nbsp;"; //点击进入查看单据界面
          if (statusNav == "done") {
            /*midRowColSpanHtml += "审批人:&nbsp;" + ufma.parseNull(aData.checkUserName) + "&nbsp;&nbsp;&nbsp;&nbsp;" +
            	"审批日期:&nbsp;" + checkDate + "&nbsp;&nbsp;&nbsp;&nbsp;"; //点击进入查看单据界面*/
          }

          $('td:eq(1)', nRow).html(midRowColSpanHtml);
        } else if (aData.isMore == 1) {
          $(nRow).attr('datatype', 3);
          var midRowColSpanHtml1 = "<a data-diffCur='" + aData.diffCur + "' class='bgPub-billRow-a bgPub-billRow-a-more billRow-a btn-watch' href='javascript:;'>更多></a>"; //点击进入查看单据界面
          $('td:eq(1)', nRow).html(midRowColSpanHtml1);
        } else {
          $(nRow).attr('datatype', 2);
        }

        ///////////
        var tdNum = $('td', nRow).length;
        if (aData.isBill == 1) {

          $mgColFirst = $('td:eq(0)', nRow);
          $mgColLast = $('td:eq(' + (tdNum - 1) + ')', nRow);
          tmpBillId = aData.billId;
          rowSpan = 1;
        } else {
          rowSpan = rowSpan + 1;
          $('td:eq(' + (tdNum - 1) + ')', nRow).remove();
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
        /*与雪蕊沟通后注释拖动列--CWYXM-11319 --指标调剂列表查看，预算方案列应为左对齐--zsj
         * $mainTable.tblcolResizable({
        	'bindTable': '#mainTable-twoSidesAdjItem'
        });*/
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
                var $lastTd = $($(this).find('td:last-child'));
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
        var $selNav = $(".nav.nav-tabs").find("li.NAVSELECT");
        var statusNav = $selNav.find("a").attr("data-status");
        //1， 单据头部的横向合并
        for (var i = 0; i < rows.length; i++) {
          var row = rows[i];
          var rowData = tmpTbl.api().row(row).data();
          if (rowData.isBill == 1) { //说明这行是单子头部信息，要进行合并
            var checkDate = ufma.parseNull(rowData.checkDate).substr(0, 10);
            var billTitle_checkMsg = '';
            var $selNav = $(".nav.nav-tabs").find("li.NAVSELECT");
            var statusNav = $selNav.find("a").attr("data-status");
            if (statusNav == "done") {
              //if(rowData.status == "") { //审批标签下显示审批人和审批日期
              /*billTitle_checkMsg =
              	"审批日期:&nbsp;" + checkDate + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" +
              	"审批人&nbsp;:" + rowData.checkUserName + "&nbsp;&nbsp;&nbsp;&nbsp;";*/
            }
            var startRowNodeHtml = $(row).find("td:eq(0)").html();
            var lastRowNodeHtml = $(row).find("td:eq(" + (colspanCount + 1) + ")").html();
            var midRowColSpanHtml = "<a data-diffCur='" + aData.diffCur + "' class='billRow-a btn-watch' href='javascript:;'>单据编号:&nbsp;" + rowData.billCode + "&nbsp;&nbsp;&nbsp;&nbsp;" +
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
            var startRowNodeHtml1 = $(row).find("td:eq(0)").html();
            var lastRowNodeHtml1 = $(row).find("td:eq(" + (colspanCount + 1) + ")").html();
            //a.billRow-a
            var midRowColSpanHtml1 = "<a data-diffCur='" + aData.diffCur + "' class='bgPub-billRow-a btn-watch bgPub-billRow-a-more billRow-a' href='javascript:;'>更多></a>"; //点击进入查看单据界面
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
    /*var $clostDiv = $("#" + tblId).closest("div");
    $($clostDiv).css("border-bottom", "0px black solid");*/
    _BgPub_ReSetDataTable_AfterPaint(tblId);

    var mainTblFoot_leftPnl = '<div class="bg-multi-floatLeft-1">' + '<label class="mt-checkbox mt-checkbox-single mt-checkbox-outline bg-top-4"> ' + '<input id="input-seleAll" type="checkbox" class="checkboxes" value=""/> &nbsp; 全选' + '<span></span> ' + '</label> ' + '</div>';

    var $selNav = $(".nav.nav-tabs").find("li.NAVSELECT");
    var statusNav = $selNav.find("a").attr("data-status");
    if (statusNav == "todo") {
      //未审批
      mainTblFoot_leftPnl = mainTblFoot_leftPnl + '<div class="bg-multi-floatLeft-1"> ' + '<button type="button" id="btn-audit" class="btn btn-sm btn-default btn-audit bg-multiModal-leftButton">审批</button> ';
      $('#btn-un-check-twoSidesAdjItem').addClass('hide');
      $('#btn-check-twoSidesAdjItem,.btn-audit').removeClass('hide');
    } else if (statusNav == "done") {
      //已审批
      mainTblFoot_leftPnl = mainTblFoot_leftPnl + '<div class="bg-multi-floatLeft-1"> ' + '<button type="button" id="btn-un-check-twoSidesAdjItem" class="btn btn-sm btn-default hide btn-un-audit bgpub-normal-leftButton-1">销审</button> ';
      $('#btn-un-check-twoSidesAdjItem').removeClass('hide');
      $('#btn-check-twoSidesAdjItem,.btn-audit').addClass('hide');
    }
    mainTblFoot_leftPnl = mainTblFoot_leftPnl + '</div> ';
    $("#bg-mainTableFooterDiv-leftPnl").append(mainTblFoot_leftPnl);

    addListenerToMainTable();

    ufma.hideloading();
    ufma.isShow(reslist);
  };
  //单据状态变化时及时保存日志
  var doSaveLog = function (optType, items) {
    var url = '/access/public/bg/workflow/saveOptLog?rgCode=' + page.pfData.svRgCode + '&setYear=' + page.setYear + '&agencyCode=' + bgItemManager.agencyCode;
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
      var url = '/bg/budgetItem/getBudgetItemsByBill?agencyCode=' + bgItemManager.agencyCode + "&rgCode=" + page.pfData.svRgCode + "&setYear=" + page.pfData.svSetYear;
      ufma.post(url, argu, function (result) {
        //itemDispenseInList表是调入指标;itemDispenseOutList表是调出指标
        var openData = result.data;
        openData.billType = "4";
        if (!$.isNull(openData)) {
          openData.agencyCode = bgItemManager.agencyCode;
          openData.setYear = page.pfData.svSetYear;
          openData.rgCode = page.pfData.svRgCode;
          openData.openAction = "inEdit";
          openData.labStatus = statusNav;
          openData.needSendDocNum = page.needSendDocNum;
          openData.isSendDocNum = currentplanData.isSendDocNum;
          openData.isComeDocNum = currentplanData.isComeDocNum;
          openData.outSendDocNum = outSendDocNum;
          openData.outComeDocNum = outComeDocNum;
          openData.outDocNumToId = outDocNumToId;
          openData.outUpBudgetNeed = outUpBudgetNeed;
          ufma.open({
            url: 'workFlowOpen.html',
            title: '指标调剂编辑',
            width: 1100,
            data: openData,
            ondestory: function (action) {
              showTblData();
            }
          });
        }
      })

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
    //查看工作流
    $("#" + tblId + " tbody").on("click", ".mainShowSpan", function (e) {
      var rowDt = tblObj.row($(this).closest("tr")).data();
      var businessKey = rowDt.billId;
      var taskId = rowDt.taskId;
      var userCode = page.pfData.svUserCode;
      var billCurValue = rowDt.diffCur;
      var ctrlUser = rowDt.ctrlUser;
      var cwUser = rowDt.cwUser;
      var ctrlDeptCode = rowDt.ctrlDeptCode;
      var variables = [{
          type: "integer",
          name: "BILL_CUR",
          value: billCurValue
        }, {
          type: "string",
          name: "CTRL_USER",
          value: ctrlUser
        }, {
          type: "string",
          name: "CW_USER",
          value: cwUser
        }, {
          type: "string",
          name: "CTRL_DEPT_CODE",
          value: ctrlDeptCode
        }, {
          type: "string",
          name: "msgUrl",
          value: '/pf/bg/workFlowTwoSidesAdjustVerify/workFlowTwoSidesAdjust.html?mennuid=1eeebf70-f02d-43df-83d5-ec97c805a843'
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
          value: '待审批指标'
        }
      ];
      ufma.showModal("openWork", 1090);
      emiter.emit('workflow-trace-full', {
        id: '#openWork',
        businessKey: businessKey,
        variables: variables
      });

    });
    //审批工作流
    $("#" + tblId + " tbody").on("click", ".mainAuditSpan", function (e) {
      var rowDt = tblObj.row($(this).closest("tr")).data();
      var businessKey = rowDt.billId;
      var taskId = rowDt.taskId;
      var procDefId = rowDt.procDefId;
      var nodeId = rowDt.nodeId;
      var billCurValue = rowDt.diffCur;
      var ctrlUser = rowDt.ctrlUser;
      var cwUser = rowDt.cwUser;
      var ctrlDeptCode = rowDt.ctrlDeptCode;
      var variables = [{
          type: "integer",
          name: "BILL_CUR",
          value: billCurValue
        }, {
          type: "string",
          name: "CTRL_USER",
          value: ctrlUser
        }, {
          type: "string",
          name: "CW_USER",
          value: cwUser
        }, {
          type: "string",
          name: "CTRL_DEPT_CODE",
          value: ctrlDeptCode
        }, {
          type: "string",
          name: "msgUrl",
          value: '/pf/bg/workFlowTwoSidesAdjustVerify/workFlowTwoSidesAdjust.html?mennuid=1eeebf70-f02d-43df-83d5-ec97c805a843'
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
          value: '待审批指标'
        }
      ];
      var roleCode = page.pfData.svRoleCode;
      if (roleCodeSet.indexOf(roleCode) != -1 && billCurValue != 0) {
        ufma.showTip('调入金额不等于调出金额', function () {}, 'warning');
        return false;
      } else {
        emiter.emit('approve', {
          businessKey: businessKey, // 当有单据Id时，taskId,procDefId和nodeId可不传
          variables: variables,
          taskId: taskId,
          nodeId: nodeId,
          procDefId: procDefId,
          onCancel: function () {},
          onComplete: function (ret) {
            if ($.isNull(ret.message) && ret.error == '0') {
              ufma.showTip('审批成功', function () {}, 'success');
              //指标审批界面，点击审核按钮，工作流返回成功后，调用保存日志接口，optType传“11”
              var optType = "11";
              var items = [{
                "billId": businessKey
              }]
              doSaveLog(optType, items);
              pnlFindRst.doFindBtnClick(); //调用查询按钮
            } else {
              ufma.showTip(ret.message, function () {}, 'warning');
            }
          }
        });
      }
    });
    //销审工作流
    $("#" + tblId + " tbody").on("click", ".mainCancelAuditSpan", function (e) {
      //permitCancel:0是不可撤销，permitCancel:1是可撤销
      var rowDt = tblObj.row($(this).closest("tr")).data();
      var businessKey = rowDt.billId;
      var billCurValue = $(this).closest('td').prev().find('a').attr('data-diffCur');
      var ctrlUser = rowDt.ctrlUser;
      var cwUser = rowDt.cwUser;
      var ctrlDeptCode = rowDt.ctrlDeptCode;
      var taskId = $(this).closest('td').prev().find('a').attr('data-taskId');
      var procInstId = $(this).closest('td').prev().find('a').attr('data-procInstId');
      var procDefId = $(this).closest('td').prev().find('a').attr('data-procDefId');
      var nodeId = $(this).closest('td').prev().find('a').attr('data-nodeId');
      var checkUrl = ' /df/access/public/bg/workflow/checkBillCanCancelAudit';
      var checkArgu = {
        agencyCode: bgItemManager.agencyCode,
        bgPlanChrId: curBgPlanData.chrId,
        billType: '4',
        checkDate: '',
        checkUser: "",
        checkUserName: "",
        items: [{
          billId: businessKey
        }],
        setYear: page.useYear,
        status: "1"
      }
      var variables = [{
          type: "integer",
          name: "BILL_CUR",
          value: billCurValue
        }, {
          type: "string",
          name: "CTRL_USER",
          value: ctrlUser
        }, {
          type: "string",
          name: "CW_USER",
          value: cwUser
        }, {
          type: "string",
          name: "CTRL_DEPT_CODE",
          value: ctrlDeptCode
        }, {
          type: "string",
          name: "msgUrl",
          value: '/pf/bg/workFlowTwoSidesAdjustVerify/workFlowTwoSidesAdjust.html?mennuid=1eeebf70-f02d-43df-83d5-ec97c805a843'
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
          value: '待审批指标'
        }
      ];
      //撤销前先判断是否可撤销，如果是再判断流程是否已结束isWorkFlowEnded，如果结束就激活activateWorkflow，如果没结束就取消cancel
      ufma.post(checkUrl, checkArgu, function (result) {
        if (result.flag == 'success') {
          //if(taskId == '' || taskId == null) {
          ufma.confirm("确定要销审这条指标吗?", function (action) {
            if (action) {
              //if(!$.isNull(taskId)) {
              emiter.emit('canTaskCancel', {
                taskId: taskId,
                nodeId: nodeId,
                procDefId: procDefId,
                procInstId: procInstId,
                variables: variables,
                businessKey: businessKey, // 当有单据Id时，taskId,procDefId和nodeId可不传
                onCancel: function () {},
                onComplete: function (ret) {
                  if (ret == false) {
                    ufma.showTip('流程不可撤销', function () {}, 'warning')
                  } else if (ret == true) {
                    emiter.emit('isWorkflowEnded', {
                      businessKey: businessKey, // 当有单据Id时，taskId,procDefId和nodeId可不传
                      onCancel: function () {},
                      onComplete: function (aa) {
                        if (aa) {
                          emiter.emit('activateWorkflow', {
                            taskId: taskId,
                            nodeId: nodeId,
                            procDefId: procDefId,
                            procInstId: procInstId,
                            variables: variables,
                            businessKey: businessKey, // 当有单据Id时，taskId,procDefId和nodeId可不传
                            onCancel: function () {},
                            onComplete: function () {

                            }
                          });
                        } else {
                          emiter.emit('cancel', {
                            taskId: taskId,
                            nodeId: nodeId,
                            procDefId: procDefId,
                            procInstId: procInstId,
                            variables: variables,
                            businessKey: businessKey, // 当有单据Id时，taskId,procDefId和nodeId可不传
                            onCancel: function () {},
                            onComplete: function (result) {
                              if (result.error == 0) {
                                ufma.showTip('流程撤销成功', function () {}, 'success');
                                //指标审批界面，点击销审按钮，工作流返回成功后，调用保存日志接口，optType传“12”
                                var optType = "12";
                                var items = [{
                                  "billId": businessKey
                                }]
                                doSaveLog(optType, items);
                                pnlFindRst.doFindBtnClick(); //调用查询按钮
                              } else {
                                ufma.showTip(result.message, function () {}, 'warning')
                              }
                            }
                          });
                        }
                      }
                    });
                  }
                }
              });
              //	}
            }
          }, {
            'type': 'warning'
          });
        }

      });
    });
    //驳回工作流
    $("#" + tblId + " tbody").on("click", ".mainBackSpan", function (e) {
      var rowDt = tblObj.row($(this).closest("tr")).data();
      var taskId = rowDt.taskId;
      var procDefId = rowDt.procDefId;
      var nodeId = rowDt.nodeId;
      var procInstId = rowDt.procInstId;
      var businessKey = rowDt.billId;
      var billCurValue = rowDt.diffCur;
      var ctrlUser = rowDt.ctrlUser;
      var cwUser = rowDt.cwUser;
      var ctrlDeptCode = rowDt.ctrlDeptCode;
      var variables = [{
          type: "integer",
          name: "BILL_CUR",
          value: billCurValue
        }, {
          type: "string",
          name: "CTRL_USER",
          value: ctrlUser
        }, {
          type: "string",
          name: "CW_USER",
          value: cwUser
        }, {
          type: "string",
          name: "CTRL_DEPT_CODE",
          value: ctrlDeptCode
        }, {
          type: "string",
          name: "msgUrl",
          value: '/pf/bg/workFlowTwoSidesAdjustVerify/workFlowTwoSidesAdjust.html?mennuid=1eeebf70-f02d-43df-83d5-ec97c805a843'
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
          value: '待审批指标'
        }
      ];
      emiter.emit('back', {
        taskId: taskId,
        nodeId: nodeId,
        procDefId: procDefId,
        procInstId: procInstId,
        variables: variables,
        businessKey: businessKey, // 当有单据Id时，taskId,procDefId和nodeId可不传
        onCancel: function () {},
        onComplete: function (ret) {
          if ($.isNull(ret.message) && ret.error == '0') {
            ufma.showTip('驳回成功', function () {}, 'success');
            //指标审批界面，点击驳回按钮，工作流返回成功后，调用保存日志接口，optType传“17”
            var optType = "17";
            var items = [{
              "billId": businessKey
            }]
            doSaveLog(optType, items);
            pnlFindRst.doFindBtnClick(); //调用查询按钮
          } else {
            ufma.showTip(ret.message, function () {}, 'warning');
          }
        }
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
      _bgPub_showLogModal("workFlowTwoSidesAdjustVerify", {
        "bgBillId": dt.billId,
        "bgItemCode": "",
        "agencyCode": bgItemManager.agencyCode,
        "setYear": page.pfData.svSetYear
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
   * 模态框 - 取消
   */
  $("#btn-modal-close").on("click", function () {
    //bugCWYXM-4545--查看已审批的指标调剂单据，应不可以编辑--zsj--已审批单据点取消时不提示，直接关闭
    if ($("#btn-modal-close").attr("sheet") == '3' && page.statusNavType != '3') {
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
      pnlFindRst.doFindBtnClick();
    }
  });
  //工作流批量审核
  $("#btn-check-twoSidesAdjItem").off("click").on("click", function (e) {
    var rows = $("#" + tblId).dataTable().fnGetNodes();
    var batchApprove = [];
    for (var k = 0; k < rows.length; k++) {
      var row = rows[k];

      if ($(row).find("td:eq(0):has(label)").length > 0) {
        if ($(row).find("td:eq(0):has(label)").find("input[type='checkbox']").is(":checked") == true) {
          var rowDt = tblObj.row(row).data();
          var businessKey = rowDt.billId;
          var billCurValue = rowDt.diffCur;
          var taskId = rowDt.taskId;
          var procDefId = rowDt.procDefId;
          var nodeId = rowDt.nodeId;
          var ctrlUser = rowDt.ctrlUser;
          var cwUser = rowDt.cwUser;
          var ctrlDeptCode = rowDt.ctrlDeptCode;
          var variables = [{
              type: "integer",
              name: "BILL_CUR",
              value: billCurValue
            }, {
              type: "string",
              name: "CTRL_USER",
              value: ctrlUser
            }, {
              type: "string",
              name: "CW_USER",
              value: cwUser
            }, {
              type: "string",
              name: "CTRL_DEPT_CODE",
              value: ctrlDeptCode
            }, {
              type: "string",
              name: "msgUrl",
              value: '/pf/bg/workFlowTwoSidesAdjustVerify/workFlowTwoSidesAdjust.html?mennuid=1eeebf70-f02d-43df-83d5-ec97c805a843'
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
              value: '待审批指标'
            }
          ];
          var batchObj = {
            taskId: taskId,
            businessKey: businessKey,
            variables: variables
          }
          batchApprove.push(batchObj);
        }
      }
    }
    if (batchApprove.length == 0) {
      ufma.showTip("请选择要审核的单据", null, "warning");
    } else {
      ufma.confirm("确定要审核所选的单据吗?",
        function (action) {
          if (action) {
            emiter.emit('batchApprove', {
              menuId: '6f7c4687-0463-4d2c-85c1-178e82361811',
              list: batchApprove,
              onCancel: function () {},
              onComplete: function (ret) {
                if (ret.msg == "成功") {
                  pnlFindRst.doFindBtnClick(); //调用查询按钮
                }
              }
            });
          }
        }, {
          'type': 'warning'
        });
    }
  });

  /**
   * 主界面  -  待办、已办页签变动
   */
  $(".nav.nav-tabs li").on("click", function (e) {
    var tmpStatus = $(this).find('a').attr("data-status");
    if (tmpStatus == "todo") {
      $("#btn-check-twoSidesAdjItem").removeClass('hide');
      $("#btn-del-twoSidesAdjItem").removeClass('hide');
      $("#btn-un-check-twoSidesAdjItem").addClass('hide');
    } else if (tmpStatus == "done") {
      $("#btn-check-twoSidesAdjItem").addClass('hide');
      $("#btn-un-check-twoSidesAdjItem").removeClass('hide');
      $("#btn-check-twoSidesAdjItem").addClass('hide');
      $("#btn-del-twoSidesAdjItem").addClass('hide');
    }
    $(".nav.nav-tabs li").removeClass("NAVSELECT");
    $(this).addClass("NAVSELECT");

    pnlFindRst.doFindBtnClick(); //调用查询按钮
    $("#input-seleAll-twoSidesAdjItem").prop("checked", false); //切换页签清空全选按钮  guohx 20171206
    $("#input-seleAllUp").prop("checked", false);
  });

  /**
   * 主界面 - 打印
   */
  $("#budgetItemTwoSidesAdjust-print").off("click").on("click", function () {
    $("." + tblPrintBtnClass).trigger("click");
  });

  /**
   * 主界面 - 导出
   */
  //$("#budgetItemTwoSidesAdjust-exp").off("click").on("click", function() {
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
  var getWorkFlowConfig = function () {
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
    ufma.get('/df/access/public/bg/workflow/getWorkFlowDispenseSet', {}, function (result) {
      roleCodeSet = result.data;
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
        bgItemManager = new _bgPub_itemManager();
        bgItemManager.billType = 4;
        bgItemManager_modal_out = new _bgPub_itemManager();
        bgItemManager_modal_out.billType = 1;
        bgItemManager_modal_in = new _bgPub_itemManager();
        bgItemManager_modal_in.billType = 1;

        //pnlFindRst = _PNL_MoreByBgPlan('bgMoreMsgPnl-twoSidesAdjItem', moreMsgSetting); //加载头部更多
        _bgPub_Bind_Cbb_AgencyList("cbb-agency-twoSidesAdjItem", { //绑定单位
          afterChange: function (treeNode) {
            //实在找不到原因，ufma-combox-popup默认不显示
            setTimeout(function () {
              $('.ufma-combox-popup').css({
                'display': 'none'
              });
            }, 100);
            bgItemManager.agencyCode = treeNode.id;
            bgItemManager_modal_out.agencyCode = treeNode.id;
            bgItemManager_modal_in.agencyCode = treeNode.id;
            moreMsgSetting.agencyCode = treeNode.id;
            getWorkFlowConfig()
            //80827 【财务云8.0 鄂尔多斯 】20190630所有页面，单位或账套选择变化后，再打开其它页面时，自动显示为最近一次选择的单位或账套。--zsj
            //缓存单位
            var params = {
              selAgecncyCode: treeNode.id,
              selAgecncyName: treeNode.name
            }
            ufma.setSelectedVar(params);
            //CWYXM-12690--根据系统选项判断发文文号是否必填，若必填则将列名“发文文号”改完指标id--zsj
            var bgUrl = '/bg/sysdata/selectSysRgParaValue?rgCode=' + page.pfData.svRgCode + '&setYear=' + page.setYear + '&agencyCode=' + treeNode.id + '&chrCode=BG003';
            ufma.get(bgUrl, {}, function (result) {
              page.needSendDocNum = result.data;
              if (page.needSendDocNum == true) {
                page.sendCloName = "指标id";
              } else {
                page.sendCloName = "发文文号";
              }
            });
            pnlFindRst = _PNL_MoreByBgPlan('bgMoreMsgPnl-twoSidesAdjItem', moreMsgSetting); //根据单位的变化重新加载头部更多
          }
        });

        //更多按钮点击事件,原来页面布局没有按规范写，实在不好修改，不要骂人
        function adjWindow() {
          $('.workspace').css({
            'min-height': '10px',
            'height': $(window).height() - 10
          });
          var boxHeight = $(window).height() - $('.workspace-top').outerHeight(true);
          var morePanelHeight = $('#bgMoreMsgPnl-twoSidesAdjItem').outerHeight(true);
          var btFixedHeight = $('#fixDiv-twoSidesAdjItem').outerHeight(true);
          var defHeight = $('#mainTableDiv-twoSidesAdjItem').outerHeight(true) - $('#mainTableDiv-twoSidesAdjItem').height();
          var offset = 48;
          if ($('#_bgPub_btn_more_bgMoreMsgPnl-twoSidesAdjItem').text() == '更多') {
            offset = 48;
          }
          $('#mainTableDiv-twoSidesAdjItem').css({
            'overflow': 'auto',
            'height': boxHeight - morePanelHeight - defHeight - btFixedHeight - offset + 'px'
          });
          $('.dataTables_scrollBody').css({
            'height': ($('#mainTableDiv-twoSidesAdjItem').height() - offset) + 'px'
          });
        }

        $(document).on('click', '#_bgPub_btn_more_bgMoreMsgPnl-twoSidesAdjItem', function (e) {
          adjWindow();
        });
        $('[data-toggle="tooltip"]').tooltip();
        $.fn.dataTable.ext.errMode = 'none';
      }
    }
  }();

  page.init();
});