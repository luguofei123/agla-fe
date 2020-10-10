$(function() {
  //open弹窗的关闭方法
  window._close = function(action, msg) {
    if (window.closeOwner) {
      var data = { action: action, msg: msg }
      window.closeOwner(data)
    }
  }
  var svData = ufma.getCommonData()

  //接口URL集合
  var interfaceURL = {
    savePrsItemCo: '/prs/prsitemco/savePrsItemCo', // 新增工资项目
    getNewPritemCode: '/prs/prsitemco/getNewPritemCode', // 获取新的工资项目编码
    updatePrsItemCo: '/prs/prsitemco/updatePrsItemCo' // 修改工资项目
  }
  var pageLength = 25

  var page = (function() {
    return {
    	
      getCheckData : function() {
    	  var inputChecks = $("input[name=prType]:checked");
          var prtypeCodes = [];
          for (var i = 0; i < inputChecks.length; i++) {
              prtypeCodes.push($(inputChecks[i]).attr("data-code"));
          }
          return prtypeCodes;
      },
      // 初始化表单
      initFormData: function() {
        var data = window.ownerData.prsTypeData;
        var prtypeCode = window.ownerData.prtypeCode;
        var labelHtml = '<label class="rpt-check checkAll mt-checkbox mt-checkbox-outline"><input data-code="*" type="checkbox" autocomplete="off">全部<span></span></label>';
        for (var i = 0; i < data.length; i++) {
        	if (data[i].prtypeCode == prtypeCode) {
        		continue;
        	}
            labelHtml += '<label class="rpt-check mt-checkbox mt-checkbox-outline"><input name="prType" data-code="' + data[i].prtypeCode + '" type="checkbox" autocomplete="off">' + data[i].prtypeName + '<span></span></label>'
        }
        $("#prTypes").append(labelHtml);
      },
      // 保存
      save: function() {
    	  var tableDatas = window.ownerData.tableDatas;
          var prtypeCodes = page.getCheckData();
    	  var argu = {
              prsTypes: []
          };
    	  if (prtypeCodes.length == 0) {
    		  ufma.alert("请选择数据");
    		  return false;
    	  }
    	  for (var k = 0; k < prtypeCodes.length; k++) {
    		  for (var i = 0; i < tableDatas.length; i++) {
                  var obj = {
                      pritemCode: tableDatas[i].pritemCode,
                      prtypeCode: prtypeCodes[k],
                      setYear: svData.svSetYear,
                      pritemCalcType: "",
                      isTaxItem: tableDatas[i].isTaxItem ? tableDatas[i].isTaxItem : "N",
                      formulaName: tableDatas[i].formulaName,
                      priority: tableDatas[i].priority,
                      ordIndex: tableDatas[i].ordIndex,
                      paycloseClear: tableDatas[i].paycloseClear,
                      maxValue: "",
                      minValue: "",
                      isUsed: tableDatas[i].isUsed,
                      pritemPro: "",
                      pritemCodeTax: tableDatas[i].pritemCodeTax ? tableDatas[i].pritemCodeTax : "",
                      isEditable: tableDatas[i].isEditable,
                      ljjsxm: tableDatas[i].ljjsxm ? tableDatas[i].ljjsxm : "",
                      isYearAwardTaxItem: tableDatas[i].isYearAwardTaxItem ? tableDatas[i].isYearAwardTaxItem : "N",
                      isDifferentColor : tableDatas[i].isDifferentColor ? tableDatas[i].isDifferentColor : "N",
                      isHighLight : tableDatas[i].isHighLight ? tableDatas[i].isHighLight : "N",
                      isExtSys: tableDatas[i].isExtSys?tableDatas[i].isExtSys:'',
                      isExtSysName: tableDatas[i].isExtSysName?tableDatas[i].isExtSysName: ''
                  };
                  argu.prsTypes.push(obj);
              }
    	  }
    	  //   /prs/PrsTypeItem/updatePrsTypeItem 
          ufma.post(window.ownerData.url, argu, function (result) {
        	  window.parent.ufma.showTip(result.msg, function () {
              }, result.flag);
              _close();
          })
      },

      initPage: function() {
        //权限控制
        page.reslist = ufma.getPermission()
        ufma.isShow(page.reslist)
        this.initFormData()
      },
      onEventListener: function() {
        // 保存按钮点击事件
        $('#btn-save').on('click', page.save)
        // 关闭按钮点击事件
        $('#btn-close').on('click', function() {
          _close()
        })
        
        $("#prTypes").on("change", ".checkAll input", function () {
            if ($(this).prop("checked")) {
                $("input[name=prType]").prop("checked", true)
            } else {
                $("input[name=prType]").prop("checked", false)
            }
            page.getSearchData();
        })
        $("#prTypes").on("change", "input[name=prType]", function () {
            var checks = $("input[name=prType]:checked");
            var inputs = $("input[name=prType]");
            if (checks.length == inputs.length) {
                $(".checkAll").find("input").prop("checked", true)
            } else {
                $(".checkAll").find("input").prop("checked", false)
            }
        })
      },

      //此方法必须保留
      init: function() {
        ufma.parse()
        page.initPage()
        page.onEventListener()
        ufma.parseScroll()
      }
    }
  })()
  /////////////////////
  page.init()

  function stopPropagation(e) {
    if (e.stopPropagation) e.stopPropagation()
    else e.cancelBubble = true
  }
})
