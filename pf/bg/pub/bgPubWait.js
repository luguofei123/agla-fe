/**
 * 等待的浮框
 * @return 返回值json对象，带有函数：close()，用于关闭等待框。
 */
var _bgPub_showWait = function(divId){
  var waitId = "__bgPub_waitDiv_";
    var _wait_HTML = _bgPub_getModalHtml("bgPubWaitModal");
    _wait_HTML = _wait_HTML.replace("{waitId}", waitId);
  if($("#" + waitId).length == 0){
    $("#" + divId).append(_wait_HTML);
  }
  $("#" + waitId).modal({
    "keyboard" : false,
      "show" : true
  });

  var rst = {
    close : function(){
        $("#" + waitId).modal("hide");
    }
  };

  return rst;
};
