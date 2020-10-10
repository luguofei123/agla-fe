/**
 * 进度条样式1 ： 圆圈1 -> 圆圈2 ->圆圈3 这样的结构
 * 高度固定，占位 70px；
 * @param  {[string]} divId  [显示进度条的父容器的id]
 * @param  {[int]} pWidth  [进度条的宽度]
 * @param  {[json]} option [配置参数：]
 *                  count : int 数量， 进度条有几个节点
 *                  labels : array of string 每个节点下部的说明名称
 * @return {[type]}        [description]
 */
var _bgPub_Progress1 = function(divId, pWidth, option){
  var _set = $.extend({}, option);
  _set.ids = $.extend({}, _bgPub_Progress1_initIds());
  var progressDiv = "<div id='"+_set.ids._progressDivId+"' class='progress1-style1 progress1-normalHeight' style='width:"+pWidth+"px'></div>";
  if($("#" + _set.ids._progressDivId).length > 0){
    $("#" + _set.ids._progressDivId).remove();
  }
  $("#" + divId).append(progressDiv);

  _set.width = pWidth;
  _set.height = 70;

  var tmpLeftBlankPnl_width = _set.width * 0.05;//总长度5%的距离，作为左边距
  var tmpLeftBlankPnl_html = "<div class='progress1-style2' style='width:"+tmpLeftBlankPnl_width+"px; height:70px'></div>";
  $("#" + _set.ids._progressDivId).append(tmpLeftBlankPnl_html);
  // 假设存在右边距，距离等于左边距，那么 (总长度-2*左边距)/节点数量 = 每个节点的宽度
  var tmpNode_div_width = (_set.width - 2*tmpLeftBlankPnl_width)/_set.count;
  // 每个圆圈节点的图像半径 = 28px;
  var tmpNode_circle_radius = 28;
  var tmpNode_circle_leftPnl_width = (tmpNode_div_width - tmpNode_circle_radius)/2;
  var tmpNode_circle_line_top = (tmpNode_circle_radius - 2)/2;

  var tmpNode_circle_blankPnl_html = "<div class='progress1-style2 ' style='width:"+tmpNode_circle_leftPnl_width+"px; " +
                                          "height:"+tmpNode_circle_radius+"px'></div>";
  for(var i=0; i<_set.count; i++){
    var tmpNode_div_html = "<div class='progress1-style2 ' style='width:"+tmpNode_div_width+"px; height:70px'>"+
                              "<div class='progress1-style1' style='height: 6px'></div>" +
                              "<div class='progress1-style1 ' style='height: "+tmpNode_circle_radius+"px'>" ;
    var tmpNode_circle_linePnl_html = "<div class='progress1-style2 ' style='width:"+tmpNode_circle_leftPnl_width+"px; " +
                                            "height:"+tmpNode_circle_radius+"px'>"+
                                        "<div class='progress1-style3 ' style='width:100%; " +
                                            "top:"+tmpNode_circle_line_top+"px; height:2px' tp='line' index='"+(i+1)+"'></div>" +
                                      "</div>";
    if(i==0){
      tmpNode_div_html = tmpNode_div_html +
                              tmpNode_circle_blankPnl_html+
                              "<div class='progress1-style2 progress1-circle' tp='circle' index='"+(i+1)+"'>" +
                                "<p >"+(i+1+"")+"</p>" +
                              "</div>" +
                              tmpNode_circle_linePnl_html +
                            "</div>";
    }else if(i==_set.count-1){
      tmpNode_div_html = tmpNode_div_html +
                              tmpNode_circle_linePnl_html+
                              "<div class='progress1-style2 progress1-circle' tp='circle' index='"+(i+1)+"'>" +
                                "<p >"+(i+1+"")+"</p>" +
                              "</div>" +
                              tmpNode_circle_blankPnl_html +
                            "</div>"  ;
    }else{
      tmpNode_div_html = tmpNode_div_html +
                              tmpNode_circle_linePnl_html+
                              "<div class='progress1-style2 progress1-circle' tp='circle' index='"+(i+1)+"'>" +
                                "<p >"+(i+1+"")+"</p>" +
                              "</div>" +
                              tmpNode_circle_linePnl_html +
                            "</div>"  ;
    }
    tmpNode_div_html = tmpNode_div_html +
                "<div class='progress1-style1' style='height: 6px'></div>" +
                "<div class='progress1-style1' style='height: 30px'>" +
                  "<p tp='font' index='"+(i+1)+"'>" + _set.labels[i] + "</p>" +
                "</div>" +
                "</div>";
    $("#" + _set.ids._progressDivId).append(tmpNode_div_html);
  }

  /**
   * 跳转到第几个进度位置。从1开始计算
   * @param  {[type]} iIndex [description]
   * @return {[type]}        [description]
   */
  var _goToStep = function(iIndex){
    $("#" + _set.ids._progressDivId).find("div[tp='circle']").each(function(index){
      var iAttr = $(this).attr("index");
      var $font = $("#" + _set.ids._progressDivId).find("p[tp='font'][index='"+iAttr+"']");
      var $line = $("#" + _set.ids._progressDivId).find("div[tp='line'][index='"+iAttr+"']");

      if(iAttr <= iIndex){
        if($(this).hasClass("progress1-circle-unselect")){
          $(this).removeClass("progress1-circle-unselect");
          $(this).addClass("progress1-circle-select");
          $font.removeClass("progress1-font-unselect");
          $font.addClass("progress1-font-select");
          $line.removeClass("progress1-line-unselect");
          $line.addClass("progress1-line-select");
        }
      }else{
        if($(this).hasClass("progress1-circle-select")){
          $(this).removeClass("progress1-circle-select");
          $(this).addClass("progress1-circle-unselect");
          $font.removeClass("progress1-font-select");
          $font.addClass("progress1-font-unselect");
          $line.removeClass("progress1-line-select");
          $line.addClass("progress1-line-unselect");
        }
      }
    });

  };

  //初始化
  $("#" + _set.ids._progressDivId).find("div[tp='line']").addClass("progress1-line-unselect");
  $("#" + _set.ids._progressDivId).find("div[tp='circle']").addClass("progress1-circle-unselect");
  $("#" + _set.ids._progressDivId).find("p[tp='font']").addClass("progress1-font-unselect");
  _goToStep(1);
  return {
    set : _set,
    gotoStep : _goToStep
  };
};

var _bgPub_Progress1_initIds = function(divId){
  return{
    _progressDivId : "_pgressDivId_" + divId
  };
};
