/**
 日志  浮层
 @param option 指标ID
 {
    bgItemId : string 指标ID（1条） 可以为null,
    bgBillId ： string 指标单据ID（1条） 可以为null,
    bgItemIds ： array [] 指标ID（多条） 可以为null,
    bgBillIds ： array [] 指标单据ID（多条） 可以为null,
    //以上四个参数，不能全部为null，至少一个有值
    bgItemCode : 指标Code,
    agencyCode : 单位代码,
    url : 读取日志的url. 不传的话，默认是_bgPub_requestUrlArray_subJs【2】
 }
 */
var _bgPub_showLogModal = function (divId, option) {

  var _setting = {
    _div_logModalId: "_bgPub_logModal_" + divId,
    _div_logModal_contentId: "_bgPub_logModal_contentDiv_" + divId,
    _div_logModal_content_headId: "_bgPub_logModal_contentDiv_head_" + divId,
    _div_logModal_content_bodyId: "_bgPub_logModal_contentDiv_body_" + divId,
    _tbl_logModal_Id: "_tbl_logModal_Id" + divId
  };
  _setting._option = $.extend({}, option);
  _setting._tblObj = null;

  var cap = "指标日志";
  var logHtml = _bgPub_getModalHtml("bgPubLogModal");
  logHtml = logHtml.replace("{_div_logModalId}", _setting._div_logModalId).
  replace("{_div_logModal_contentId}", _setting._div_logModal_contentId).
  replace("{_div_logModal_content_headId}", _setting._div_logModal_content_headId).
  replace("{_div_logModal_content_bodyId}", _setting._div_logModal_content_bodyId).replace("{caption}", cap).
  replace("{cp}", cap).replace("{_tbl_logModal_Id}", _setting._tbl_logModal_Id);

  if ($("#" + _setting._div_logModalId).length > 0) {
    $("#" + _setting._div_logModalId).remove();
  }
  $("#" + divId).append(logHtml);

  ufma.parse();
  //uf.parse(); //guohx   修改打开日志后,清空单位和预算方案问题

  $("#" + _setting._div_logModal_content_bodyId).css("min-height", "400px");
  $("#" + _setting._div_logModal_content_bodyId).css("max-height", "400px");
  $("#" + _setting._div_logModal_content_bodyId).css("overflow", "auto");

  var url = "";
  if ($.isNull(_setting._option.url)) {
    url = _bgPub_requestUrlArray_subJs[2] + "?agencyCode=" + _setting._option.agencyCode;
  } else {
    url = _setting._option.url;
  }

  var sendDt = {
    "bgItemId": _setting._option.bgItemId,
    "bgBillId": _setting._option.bgBillId,
    "bgItemIds": _setting._option.bgItemIds,
    "bgBillIds": _setting._option.bgBillIds,
    "agencyCode": _setting._option.agencyCode,
    "bgItemCode": _setting._option.bgItemCode
  };

  ufma.post(
    url,
    sendDt,
    function (rst) {
      if (rst.flag === "success") {
        paintLogTbl(rst.data);
      } else {
        ufma.showTip("日志获取失败!" + rst.msg, null, "error");
      }
    }
  );

  var paintLogTbl = function (data) {

    var col = [
      {
        key: "sno",
        name: "序号",
        width: "60px"
      },
      {
        key: "optType",
        name: "操作类型",
        className: "BGTenLen nowrap",
        // width: "100px"
      },
      {
        key: "optTime",
        name: "发生时间",
        className: "BGdateClass nowrap",
        // width: "100px"
      },
      {
        key: "optUser",
        name: "操作人",
        className: "BGTenLen nowrap",
        // width: "60px"
      },
      {
        key: "bgItemCode",
        name: "指标编码",
        className: "BGasscodeClass nowrap",
        // width: "100px"
      },
      {
        key: "bgItemCur",
        name: "指标金额",
        type: "money",
        className: "BGmoneyClass nowrap",
        // width: "120px"
      }
    ];

    for (var i = 0; i < data.logs.length; i++) {
        data.logs[i].sno = (i + 1);
    }

    var modal_tableObj = $("#" + _setting._tbl_logModal_Id).ufmaDataTable({
        data: data.logs,
        columns: col
    });

    //显示模态框
    $("#" + _setting._div_logModalId).modal({
        "backdrop": true,
        "show": true,
        "keyboard": false
    });

    //模态框关闭事件的监听
    $("#" + _setting._div_logModalId).off("hidden.bs.modal").on("hidden.bs.modal", function () {
        //关闭时执行。
        if (!$.isNull(_setting._option.onClose)) {
            var _fileList = [];
            $("#" + _setting._div_modal_content_body_fileBoxId + " .impAttachmentSubFileBox[type='file'][asignedInputId='']").each(function () {
                var fileName = $(this).find("span").text();
                _fileList[_fileList.length] = {
                    "filename": fileName,
                    "filesize": 0,
                    "fileid": $(this).attr("fileid")
                };
            });
            _setting._option.onClose(_fileList);
        }
    });
  };

  // ufma.showModal(_setting._div_logModalId, 980, null, function () {
  //
  // });


};