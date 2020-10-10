/**
 * =================== 此函数为主入口 ==============================
 * 此函数为提供 公共浮层，用户录入审核意见或者销审意见.
 * 需要引用bgPubImpAttachment.css 样式文件。
 * @param  {[string]} divId      [浮层挂接在哪个div上]
 * @param  {[int]} type       [1=审核  2=销审]
 * @param  {[string]} requestURL [请求调用的URL， 目前支持post]
 * @param  {[json]} requestObj [请求传递给服务端的参数对象]
 * @param  {[json]} setting    [设置，包含以下内容:]
 *                             {[function]} callbackSuccess    审核成功时调用 可以为null
 *                             {[function]} callbackFailed     审核失败时调用 可以为null
 * @return {[json]}            [无]
 */
var _bgPub_LoadAuditOrUnAuditModal = function (divId, type, requestURL, requestObj, setting) {
  var _setting = $.extend({}, setting);
  _setting._div_modalId = "_bgPub_auditOrUnAuditModal_" + divId;
  _setting._div_modal_contentId = "_bgPub_auditOrUnAuditModal_contentDiv_" + divId;
  _setting._div_modal_content_headId = "_bgPub_auditOrUnAuditModal_contentDiv_head_" + divId;
  _setting._div_modal_content_bodyId = "_bgPub_auditOrUnAuditModal_contentDiv_body_" + divId;
  _setting._div_modal_content_body_fileBoxId = "_bgPub_auditOrUnAuditModal_contentDiv_body_fileBox_" + divId;
  _setting._div_modal_textarea = "_bgPub_auditOrUnAuditModal_contentDiv_body_textarea_" + divId;
  _setting._btn_ok = "_bgPub_auditOrUnAuditModal_btn_ok_" + divId;
  _setting._btn_cancel = "_bgPub_auditOrUnAuditModal_btn_cancel_" + divId;
  var caption = "";
  var btn_ok = "";
  if (type == "1") {
    caption = "审核意见";
    btn_ok = "审核";
  } else if (type == "2") {
    caption = "销审意见";
    btn_ok = "销审";
  }

  if ($("#" + _setting._div_modalId).length > 0) {
    $("#" + _setting._div_modalId).remove();
  }

  var _modelHTML = '<div class="modal fade bs-example-modal-lg" id="' + _setting._div_modalId + '" ' +
    'tabindex="-1" role="dialog" aria-labelledby="' + caption + '">' +
    '<div class="modal-dialog modal-xm" role="document"> ' +
    '<div class="modal-content impAttachmentBody" id="' + _setting._div_modal_contentId + '"> ' +
    '<div class="modal-header" id="' + _setting._div_modal_content_headId + '"> ' +
    '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><!-- 关闭按钮 --> ' +
    '<span aria-hidden="true">&times;</span>   ' +
    '</button> ' +
    '<h4 class="modal-title" ">' + caption + '</h4>	<!-- 弹层的标题  --> ' +
    '</div> ' +
    '<div class="modal-body impAttachmentBody" id="' + _setting._div_modal_content_bodyId + '"> ' +
    '<!--编辑区begin--> ' +
    //这里添加意见录入框
    '<div class="impAttachmentSubDiv impAttachmentSubDiv-boxbody" id="' + _setting._div_modal_content_body_fileBoxId + '">' +
    '<textarea autofocus id="' + _setting._div_modal_textarea + '" class="bgAuditArea">同意</textarea>' +
    '</div>' +
    //这里添加底部的确定按钮和关闭按钮
    '<div class="impAttachmentSubDiv Abottom">' +
    '<div class="impAttachmentSubDiv impAttachment-rightButton">' +
    '<button type="button" class="btn btn-sm btn-primary impAttachment-rightButton" id="' + _setting._btn_ok + '">' + btn_ok + '</button> ' +
    '<button type="button" class="btn btn-sm btn-default impAttachment-rightButton"  data-dismiss="modal" id="' + _setting._btn_cancel + '">关闭</button> ' +
    '</div>' +
    '</div>' +
    '</div>' +
    '</div>' +
    '</div>' +
    '</div>';
  $("#" + divId).append(_modelHTML);
  $("#" + _setting._div_modal_contentId).css("width", parseInt($("#" + divId).css("width")) * 0.55);
  $("#" + _setting._div_modal_contentId).css("left", parseInt($("#" + divId).css("width")) * 0.15 * -1);

  $("#" + _setting._div_modal_contentId).css("max-height", 300);
  $("#" + _setting._div_modal_contentId).css("min-height", 300);

  var bigBoxHeight = 300 - 56 - 30 - 30 - 4 - 2 * 15;
  $("#" + _setting._div_modal_content_body_fileBoxId).css("max-height", bigBoxHeight);
  $("#" + _setting._div_modal_content_body_fileBoxId).css("min-height", bigBoxHeight);

  $("#" + _setting._div_modal_textarea).css("max-height", (bigBoxHeight - 3) + "px");
  $("#" + _setting._div_modal_textarea).css("min-height", (bigBoxHeight - 3) + "px");

  //显示模态框
  $("#" + _setting._div_modalId).modal('show');

  //绑定按钮
  $("#" + _setting._btn_ok).off("click").on("click", function (e) {
    requestObj.opinion = $("#" + _setting._div_modal_textarea).val();

    //
    var _doClose = function () {
      $("#" + _setting._btn_cancel).trigger("click");
    };

    ufma.post(
      requestURL,
      requestObj,
      function (result) {
        if (result.flag == "success") {
          $("#" + _setting._div_modal_content_headId + " button").trigger("click");
          if ($.isNull(_setting.callbackSuccess)) {
            setTimeout(function () {
              ufma.showTip(btn_ok + "成功", null, "success");
            }, 500);
          } else {
            _doClose();
            _setting.callbackSuccess(result.data);
          }
        } else {
          if ($.isNull(_setting.callbackFailed)) {
            ufma.showTip(btn_ok + "失败！" + result.msg, null, "error");
          } else {
            _setting.callbackFailed(result.data);
          }
        }
      }
    );

  });

};
