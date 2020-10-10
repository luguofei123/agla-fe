$(function() {
  window._close = function() {
    window.closeOwner();
  };
  //var ptData = {};
  //CWYXM-9860 --出纳管理-生成新年度账，结转到新年度的账簿，登记期初账，日期依然显示上一年度的日期-zsj
  var ptData = ufma.getCommonData();
  var mydate = new Date(ptData.svTransDate);
  var Year = mydate.getFullYear();
  var queryItems = [];
  var items;
  var treeArry = [];
  var requiredACCarray = [];
  var sendObj = {};
  var balance;
  var isCurrency = false;
  var keydownctrls = true;
  var linkGuidsArr = [];
  var page = (function() {
    return {
      //转换为驼峰
      shortLineToTF: function(str) {
        var arr = str.split("_");
        for (var i = 0; i < arr.length; i++) {
          arr[i] = arr[i].toLowerCase();
        }
        for (var i = 1; i < arr.length; i++) {
          arr[i] = arr[i].toLowerCase();
          arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].substring(1);
        }
        return arr.join("");
      },
      //判断辅助核算项是否必填
      requiredACC: function() {
        var requiredACC = sendObj.requiredACC;
        if (requiredACC != "" || requiredACC != undefined) {
          requiredACCarray = requiredACC.split(",");
        }
        for (var i = 0; i < requiredACCarray.length; i++) {
          var requiredACCid = requiredACCarray[i];
          $("#" + requiredACCid).addClass("required");
        }
      },
      //保存校验账簿余额不足不可以支出  guohx  20190801 add
      //新增：借贷方向*金额<0 判断是否小于余额
      //编辑 ： 借方 余额为账簿余额减旧金额  贷方 余额为账簿余额加旧金额
      checkBalance: function() {
        if (sendObj.isStrictbook == "1") {
          page.queryBalData(sendObj.accountbookGuid, sendObj.balByAccitem);
          var drCr = $("#drCrN").hasClass("active") ? -1 : 1;
          var money;
          if (!isCurrency) {
            //没有启用外币
            money = $(".money")
              .val()
              .split(",")
              .join("");
          } else {
            money = $(".onemoney")
              .val()
              .split(",")
              .join("");
          }
          if (window.ownerData.action == "add") {
            //新增
            if (drCr == 1 && money < 0) {
              money = parseFloat(money) * -1;
              if (money > page.balance) {
                ufma.showTip(
                  "账簿余额不足不允许支出!",
                  function() {
                    return false;
                  },
                  "warning"
                );
              } else {
                return true;
              }
            } else if (drCr == -1 && money > 0) {
              if (money > page.balance) {
                ufma.showTip(
                  "账簿余额不足不允许支出!",
                  function() {
                    return false;
                  },
                  "warning"
                );
              } else {
                return true;
              }
            } else {
              return true;
            }
          } else if (window.ownerData.action == "edit") {
            //编辑
            var newBalance;
            var money = parseFloat(money);
            if (window.ownerData.oneData.drCr == "1") {
              //借
              newBalance = page.balance - window.ownerData.oneData.drMoney;
              if (parseFloat(money) < 0) {
                money = parseFloat(money) * -1;
              }
            } else {
              newBalance = page.balance + window.ownerData.oneData.crMoney;
            }
            if (money > newBalance && drCr == "-1") {
              ufma.showTip(
                "账簿余额不足不允许支出!",
                function() {
                  return false;
                },
                "warning"
              );
            } else {
              return true;
            }
          }
        } else {
          return true;
        }
      },
      //校验上月未结账不允许继续做账
      checkLamonKeep: function() {
        var bookFisPerd = $("#jouDate")
          .getObj()
          .getValue()
          .substring(5, 7);
        if (bookFisPerd < 10) {
          bookFisPerd = bookFisPerd.substring(1, 2);
        }
        var isBookCloseInFisPerd;
        if (sendObj.isLamonKeep == "1" && bookFisPerd != "1") {
          var argu = {
            agencyCode: window.ownerData.agencyCode,
            setYear: window.ownerData.setYear,
            rgCode: window.ownerData.rgCode,
            accountbookGuid: sendObj.accountbookGuid,
            fisPerd: bookFisPerd - 1
          };
          ufma.ajaxDef("/cu/cuAccountBook/isBookCloseInFisPerd", "get", argu, function(result) {
            isBookCloseInFisPerd = result.data;
          });
          if (!isBookCloseInFisPerd) {
            ufma.showTip(
              "上月未结账不允许继续做账!",
              function() {
                return false;
              },
              "warning"
            );
          } else {
            return true;
          }
        } else {
          return true;
        }
      },
      //保存校验辅项是否必填
      checkRequiredACC: function() {
        var requiredACC = sendObj.requiredACC;
        if (!$.isNull(requiredACC)) {
          requiredACCarray = requiredACC.split(",");
          for (var i = 0; i < requiredACCarray.length; i++) {
            var requiredACCid = requiredACCarray[i];
            if ($.isNull($("#" + requiredACCid + " input").val())) {
              ufma.showTip("请将带*号的必填辅助项填写完整!", function() {}, "warning");
              return false;
            }
          }
        }
        return true;
      },
      //票据类型
      reqBillType: function() {
        var argu = {
          agencyCode: window.ownerData.agencyCode,
          setYear: window.ownerData.setYear,
          rgCode: window.ownerData.rgCode,
          eleCode: "BILLTYPE"
        };
        dm.cbbAccItem(argu, function(result) {
          $("#billTypeCode").ufTreecombox({
            idField: "code",
            textField: "codeName",
            pIdField: "pCode", //可选
            //placeholder: '请选择票据类型',
            leafRequire: true,
            data: result.data,
            onComplete: function(sender) {
              var timeId = setTimeout(function() {
                $("#btnQuery").trigger("click");
                clearTimeout(timeId);
              }, 300);
            }
          });
        });
      },
      //常用摘要--CWYXM-4270--zsj
      reqSummary: function(inputValue) {
        var descName = "";
        if (!$.isNull(inputValue)) {
          descName = ufma.transformQj(inputValue);
        } else {
          descName = "";
        }
        var argu = {
          agencyCode: window.ownerData.agencyCode,
          setYear: window.ownerData.setYear,
          rgCode: window.ownerData.rgCode,
          acctCode: page.acctCode,
          descName: descName
        };
        ufma.ajaxDef("/cu/summary/selectMaDesc", "get", argu, function(result) {
          $("#summary").ufselectInput({ data: result.data, text: "descName" });
        });
      },
      //凭证类型--zsj--bug80697 【20190605 广东省财政厅】手工登账的日记账界面的凭证号无法手工录入
      getVoutype: function () {
        var agencyCode = window.ownerData.agencyCode;
        var acctCode = window.ownerData.acctCode;
        var setYear = window.ownerData.setYear;
        var accaCode = "*";
        var vouUrl = "/cu/eleVouType/getVouType" + "/" + agencyCode + "/" + setYear + "/" + acctCode + "/" + accaCode;
        ufma.get(vouUrl, "", function (result) {
          var data = result.data;
          vouTypeArray = {};
          //循环把option填入select
          var $vouTypeOp = '<option value="">  </option>';
          for (var i = 0; i < data.length; i++) {
            //创建凭证类型option节点
            vouTypeArray[data[i].code] = data[i].name;
            $vouTypeOp += '<option value="' + data[i].code + '">' + data[i].name + '</option>';
          }
          $('#vouType').html($vouTypeOp);
        });
      },
      getVouFisPerd: function () {
        var data = window.ownerData.fisPerdData;
        vouFisPerdArray = {};
        //循环把option填入select
        var $vouFisPerdOp = '<option value="">  </option>';
        for (var i = 0; i < data.length; i++) {
          //创建凭证类型option节点
          vouFisPerdArray[data[i].code] = data[i].codeName;
          $vouFisPerdOp += '<option value="' + data[i].code + '">' + data[i].codeName + '</option>';
        }
        $('#vouFisPerd').html($vouFisPerdOp);
      },
      //账簿
      reqAccountBook: function() {
        var url = dm.getCtrl("accBook");
        callback = function(result) {
          $("#accountbookCode").ufTreecombox({
            idField: "ID",
            textField: "accountbookName",
            pIdField: "PID", //可选
            leafRequire: true,
            readonly: false,
            data: result.data,
            onComplete: function(sender) {
              if (window.ownerData.accountbookGuid) {
                $("#accountbookCode")
                  .getObj()
                  .val(window.ownerData.accountbookGuid);
              }
            },
            onChange: function(sender, data) {
              sendObj.needShowAcc = data.NEED_SHOW_ACCITEM; //辅助核算项
              sendObj.acctCode = data.ACCT_CODE;
              page.acctCode = data.ACCT_CODE;
              sendObj.accoCode = data.ACCO_CODE;
              sendObj.accountbookGuid = data.ID;
              sendObj.IS_SUMMARYNEED = data.IS_SUMMARYNEED; //摘要是否必输
              sendObj.requiredACC = data.REQUIRED_ACCITEM; //辅助核算项是否必填
              sendObj.isCashType = data.IS_CASHTYPE; //是否显示资金类型
              sendObj.isPayment = data.IS_SHOW_PAYMENT; //是否显示支出类型
              sendObj.isTicResource = data.IS_TICRESOURCE; //是否显示单据来源
              sendObj.isKeepData = data.IS_KEEPDATA; //保存并新增时是否保留数据--zsj--bug77574
              sendObj.isBalByAccitem = data.IS_BAL_BY_ACCITEM; //是否按照辅项计算账簿余额
              sendObj.balByAccitem = data.BAL_BY_ACCITEM; //按照辅助核算项计算余额的辅助项
              sendObj.isStrictbook = data.IS_STRICTBOOK; //账簿余额不足不允许支出
              sendObj.isLamonKeep = data.IS_LAMON_KEEP; //上月未结账不允许继续做账
              sendObj.curCode = data.CUR_CODE; //币种
              sendObj.accountBookType = data.ACCOUNTBOOK_TYPE; //账簿类别
              sendObj.isDealWith = data.IS_DEAL_WITH; //经办人是否必填--zsj--CWYXM-10502
              page.getCurPro(); //通过币种属性控制显示哪些项
              if (sendObj.IS_SUMMARYNEED == "1") {
                $("#summaryReq").addClass("required");
              } else if (sendObj.IS_SUMMARYNEED == "0") {
                $("#summaryReq").removeClass("required");
              }
              if (sendObj.isCashType == "0") {
                $(".isCashType").addClass("hidden");
              } else if (sendObj.isCashType == "1") {
                $(".isCashType").removeClass("hidden");
              }
              if (sendObj.isPayment == "0") {
                $(".isPayment").addClass("hidden");
              } else if (sendObj.isPayment == "1") {
                $(".isPayment").removeClass("hidden");
              }
              //经办人是否必填--zsj--CWYXM-10502
              if (sendObj.isDealWith == "1") {
                $(".dealWithClass").addClass("required");
                $("#dealWith").val(ptData.svUserName);
              } else if (sendObj.isDealWith == "0") {
                $(".dealWithClass").removeClass("required");
              }
              var type = data.ACCOUNTBOOK_TYPE;
              window.ownerData.changeTitle(type);
              if (window.ownerData.action == "add") {
                page.getJouNo(false);
              }
              if (!$.isNull(sendObj.needShowAcc)) {
                page.reqAccItem(sendObj.needShowAcc, sendObj.acctCode, sendObj.accoCode);
              }
              if (sendObj.isBalByAccitem != "1" || window.ownerData.action == "add") {
                //新增或者启用了辅助项余额
                page.queryBalData(sendObj.accountbookGuid, sendObj.balByAccitem);
              }
              //常用摘要--CWYXM-4270--zsj--切换账簿时需要重新加载一下摘要
              page.reqSummary();
            }
          });
        };
        ufma.ajaxDef(
          url,
          "get",
          {
            agencyCode: window.ownerData.agencyCode,
            acctCode: window.ownerData.acctCode
          },
          callback
        );
      },
      //请求辅助核算项
      reqAccItem: function(needShowAcc, acctCode, accoCode) {
        var needShowAccItem = needShowAcc.split(",");
        //动态辅助核算项--begin
        var argu = {
          acctCode: acctCode,
          accoCode: accoCode,
          agencyCode: window.ownerData.agencyCode,
          setYear: window.ownerData.setYear,
          rgCode: window.ownerData.rgCode
        };
        dm.getAccoFZ(argu, function(result) {
          var itemElecode = [];
          if (result.data != null) {
            items = result.data;
            page.items = items;
            for (var i = 0; i < needShowAccItem.length; i++) {
              for (var j = 0; j < items.length; j++) {
                if (needShowAccItem[i] == items[j].accitemCode) {
                  itemElecode.push(items[j]);
                }
              }
            }
          }
          var $curRow = $("#planItemMore");
          $curRow.html("");
          for (var i = 0; i < itemElecode.length; i++) {
            var item = itemElecode[i];
            var itemEle = page.shortLineToTF(item.accitemCode) + "Code";
            if (!$.isNull(itemEle)) {
              $curgroup = $('<div class="form-group" id="' + item.accitemCode + '"style="width:22em;margin-left:0px;margin-top: 10px;"></div>').prependTo($curRow);
              $('<lable class="control-label auto" data-toggle= "tooltip" title="' + item.eleName + '" style="display:inline-block;width:100px;text-align: right;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">' + item.eleName + "：</lable>").appendTo($curgroup);
              var formCtrl = $('<div class="control-element uf-treecombox" id="' + itemEle + '" name="' + itemEle + '"style=" width:190px;margin-left:5px;margin-top:-8px;"></div>').appendTo($curgroup);
              var param = {};
              param["agencyCode"] = window.ownerData.agencyCode;
              param["setYear"] = window.ownerData.setYear;
              param["eleCode"] = item.eleCode;
              treecombox = $("#" + itemEle);
              page.cacheDataRun({
                element: treecombox,
                cacheId: param["agencyCode"] + param["eleCode"],
                url: dm.getCtrl("fzhxs"),
                param: param,
                eleName: item.eleName,
                callback: function(ele, data, tmpEleName) {
                  $(ele).ufTreecombox({
                    //初始化
                    data: data, //列表数据
                    idField: "code",
                    textField: "codeName",
                    pIdField: "pCode",
                    readonly: false,
                    leafRequire: true,
                    placeholder: "请选择" + tmpEleName,
                    onComplete: function(sender) {
                      page.requiredACC();
                    },
                    onChange: function(sender, data) {
                      var item = sender[0].id.substring(0, sender[0].id.length - 4).toUpperCase();
                      var accitems = [];
                      if (!$.isNull(sendObj.balByAccitem)) {
                        accitems = sendObj.balByAccitem.split(",");
                        for (var i = 0; i < accitems.length; i++) {
                          if (accitems[i].indexOf("_") != -1) {
                            accitems[i] = accitems[i].replace("_", "");
                          }
                        }
                        if ($.inArray(item, accitems) != -1) {
                          page.queryBalData(sendObj.accountbookGuid, sendObj.balByAccitem);
                        }
                      }
                    }
                  });
                }
              });
              var sId = itemEle;
              $("#" + sId)
                .off("keyup")
                .on("keyup", function(e) {
                  if (e.keyCode == 8) {
                    //退格键，支持删除
                    e.stopPropagation();
                    var subId = $(e.target)
                      .attr("id")
                      .replace("_input_show", "");
                    subId = subId.replace("_input", "");
                    $("#" + subId + "_value").val("");
                    $("#" + subId + "_input").val("");
                    $("#" + subId + "_input_show").val("");
                    $("#" + subId + "_text").val("");
                  }
                });
              treeArry.push(sId);
            }
          }
          setTimeout(function() {
            //一定要加延时处理
            $("#frmBookIn").setForm(window.ownerData.oneData);
          }, 300);
        });
        //动态辅助核算项--end
      },
      //获取账簿余额
      queryBalData: function(accountbookGuid, balByAccitem) {
        var argu = {
          agencyCode: window.ownerData.agencyCode,
          acctCode: sendObj.acctCode,
          setYear: window.ownerData.setYear,
          rgCode: window.ownerData.rgCode,
          accountbookGuid: accountbookGuid
        };
        if (!$.isNull(balByAccitem)) {
          var accitems = balByAccitem.split(",");
          for (var i = 0; i < accitems.length; i++) {
            var accitem = accitems[i].toLowerCase();
            var itemEle = page.shortLineToTF(accitem) + "Code";
            argu[itemEle] = $("#" + itemEle + "_value").val();
          }
        }
        ufma.ajaxDef("/cu/journal/getCuJournalMoneyInfo", "get", argu, function(result) {
          if (!$.isNull(result.data)) {
            page.balance = result.data;
            $("#balance").text($.formatMoney(result.data));
          }
        });
      },
      //获取账簿币种属性是否为本币
      getCurPro: function() {
        if (!$.isNull(sendObj.curCode)) {
          var argu = {
            agencyCode: window.ownerData.agencyCode,
            eleCode: "CURRENCY",
            chrCode: sendObj.curCode,
            curDate: $("#jouDate")
              .getObj()
              .getValue()
              .substring(0, 7)
          };
          ufma.ajaxDef("/cu/common/getAccItemTree", "get", argu, function(result) {
            if (result.data.length != 0) {
              if (result.data[0].isStdCur == "0") {
                //为外币
                isCurrency = true;
                //显示
                $("#default").addClass("hidden");
                $("#curStyle").removeClass("hidden");
                if (result.data[0].eleRateList.length != "0") {
                  //guohx 解决input监听不到js的赋值改变，故在前后聚焦失焦去捕捉blur事件 20200213
                  $("#exchangeRate").focus();
                  $("#exchangeRate").val(result.data[0].eleRateList[0].direRate);
                  $("#exchangeRate").blur();
                }
              } else {
                //显示金额
                isCurrency = false;
                $("#default").removeClass("hidden");
                $("#curStyle").addClass("hidden");
              }
            }
          });
        } else {
          //显示金额
          isCurrency = false;
          $("#default").removeClass("hidden");
          $("#curStyle").addClass("hidden");
        }
      },
      //切换日期获取汇率获取账簿币种属性是否为本币
      getDireRate: function(curDate) {
        if (!$.isNull(sendObj.curCode)) {
          var argu = {
            agencyCode: window.ownerData.agencyCode,
            eleCode: "CURRENCY",
            chrCode: sendObj.curCode,
            curDate: $("#jouDate")
              .getObj()
              .getValue()
              .substring(0, 7)
          };
          ufma.ajaxDef("/cu/common/getAccItemTree", "get", argu, function(result) {
            if (!$.isNull(result.data)) {
              if (result.data[0].isStdCur == "0") {
                //为外币
                if (result.data[0].eleRateList.length != "0") {
                  $("#exchangeRate").focus();
                  $("#exchangeRate").val(result.data[0].eleRateList[0].direRate);
                  $("#exchangeRate").blur();
                } else {
                  $("#exchangeRate");
                  $("#exchangeRate").val("");
                  $("#exchangeRate").blur();
                }
              }
            }
          });
        }
      },
      //初始化页面
      initPage: function() {
        page.reslist = ufma.getPermission();
        ufma.isShow(page.reslist);
        page.acctCode = window.ownerData.acctCode;
        page.reqAccountBook();
        page.reqBillType();
        page.getVoutype();
        page.getVouFisPerd();
        //	page.reqSummary();//常用摘要--CWYXM-4270--zsj--初始化时不用加载
        setTimeout(function() {
          //一定要加延时处理
          if (window.ownerData.action == "edit") {
            $("#accountbookCode")
              .getObj()
              .setEnabled();
          }
        }, 300);
        $("#jouDate").ufDatepicker({
          format: "yyyy-mm-dd",
          initialDate: new Date(),
          onChange: function() {
            if (window.ownerData.action == "add") {
              //修改bug74975---zsj--按日生成的账簿：日期改变编号重排；按月生成的账簿：日期改变，编号递增
              page.getJouNo(false);
            } else {
              page.getJouNo(true);
            }
            page.getDireRate();
          }
        });
        //经侯总确认将 期初登账日期固定在每年的一月一日，编辑时也应固定在每年的一月一日
        if (window.ownerData.type == 0 || window.ownerData.bookinType == 0) {
          $(".qcdz").removeClass("required");
          $("#jouDate")
            .getObj()
            .setValue(Year + '-01-01');
          $("#jouDate input").attr("disabled", "disabled");
          $("#jouDate span").addClass("hide");
        } else {
          $("#jouDate")
            .getObj()
            .setValue(window.ownerData.jouDate);
        }
        $(".zeromoney").val($.formatMoney($(".zeromoney").val()));
        $(".onemoney").val($.formatMoney($(".onemoney").val()));
        //$('#jouNo').intInput();  //intInput()不支持以0开头，故用onkeyup = "value=value.replace(/[^\d]/g,'')"---zsj
        if (!$.isNull(window.ownerData.oneData)) {
          $("#btnSaveAndAdd").removeClass("disabled");
          $("#btnSave").removeClass("disabled");
          keydownctrls = true;
        }
        if (!$.isNull(window.ownerData.oneData)) {
          window.ownerData.oneData.cashTypeCur = window.ownerData.oneData.cashType;
          window.ownerData.oneData.isReceiptCur = window.ownerData.oneData.isReceipt;
          window.ownerData.oneData.typeCur = window.ownerData.oneData.type;
          window.ownerData.oneData.money = window.ownerData.oneData.money;
          window.ownerData.oneData.localMoney = window.ownerData.oneData.money;
        }
        $("#frmBookIn").setForm(window.ownerData.oneData);
        setTimeout(function() {
          //一定要加延时处理
          if (!$.isNull(window.ownerData.oneData)) {
            $("#description").val(window.ownerData.oneData.summary);
            // CWYXM-19806 出纳管理-登记出纳账，从账务取数得出纳账，点击详情，凭证信息不显示 guohx 20200901
            $('#vouType option[value="'+ window.ownerData.oneData.vouType+'"]').attr('selected',true).prop('selected',true)
            $('#vouFisPerd option[value="'+ window.ownerData.oneData.vouFisPerd+'"]').attr('selected',true).prop('selected',true)
          }
          if (window.ownerData.canEdit == 0) {
            $("#frmBookIn").disable();
            $("#btnSaveAndAdd").addClass("disabled");
            $("#btnSave").addClass("disabled");
            keydownctrls = false;
          } else if (window.ownerData.canEdit == 1) {
            // $('#frmBookIn').disable();
            //解决win10 ie11禁用后input无法输入中文
            $("#accountbookCode").disable();
            $("#jouNoDiv").disable();
            $("#jouDate").disable();
            $("#drcr").disable();
            $(".isCashType").disable();
            $(".isPayment").disable();
            $("#isReceipt").disable();
            $("#voutypecode").disable();
            $("#billType").disable();
            $("#billNoDiv").disable();
            $("#oppositeUnitDiv").disable();
            //ysdp 20200623092519 登记出纳账，零余额账簿，从国库生成的出纳账能够允许修改备注 guohx 20200715
            // $("#remarkDiv").disable(); 
            $("#defaultMoney").disable();
            $("#localMoney").disable();
            $("#isReceiptCUR").disable();
            var timeId = setTimeout(function() {
              var requiredACC = sendObj.requiredACC;
              if (requiredACC != "" || requiredACC != undefined) {
                requiredACCarray = requiredACC.split(",");
              }
              for (var i = 0; i < requiredACCarray.length; i++) {
                var requiredACCid = requiredACCarray[i];
                $("#" + requiredACCid).disable();
              }
              clearTimeout(timeId);
            }, 300);
            $("#btnSaveAndAdd").removeClass("disabled");
            $("#btnSave").removeClass("disabled");
            keydownctrls = true;
          } else {
            $("#btnSaveAndAdd").removeClass("disabled");
            $("#btnSave").removeClass("disabled");
            keydownctrls = true;
          }
        }, 200);
        if (!$.isNull(window.ownerData.oneData)) {
          if (!$.isNull(window.ownerData.oneData.linkJouGuid)) {
            $("#drcr").disable();
          }
        }
      },
      cacheDataRun: function(setting) {
        setting.callback = setting.callback || function(data) {};
        setting.cached = setting.cached || false;
        var callback = setting.callback;
        var data;
        if (setting.cached) {
          if ($.isNull(setting.cacheId)) {
            callback();
            return false;
          }
          data = uf.getObjectCache(setting.cacheId);
        }
        if (!$.isNull(data)) {
          if (setting.hasOwnProperty("element")) {
            callback(setting.element, data, setting.eleName);
          } else {
            callback(data);
          }
        } else {
          setting.param = setting.param || {};
          if ($.isNull(setting.url)) return false;
          $.ufajax(setting.url, "get", setting.param, function(result) {
            if (result.hasOwnProperty("data")) {
              uf.setObjectCache(setting.cacheId, result.data);
              if (setting.hasOwnProperty("element")) {
                callback(setting.element, result.data, setting.eleName);
              } else {
                callback(result.data);
              }
            } else {
              alert("错误的数据格式!");
            }
          });
        }
      },

      save: function(flag) {
        //修改关联账簿相关--zsj
        if (!page.checkRequiredACC()) {
          return false;
        }
        if (!page.checkLamonKeep()) {
          //校验上月已结账
          return false;
        }
        //当经办人为必填时，需要判断是否为空--zsj--CWYXM-10502
        if ($(".dealWithClass").hasClass("required") && $.isNull($("#dealWith").val())) {
          ufma.showTip("经办人不能为空！", function() {}, "warning");
          return false;
        }
        if (!isCurrency) {
          //没有启用外币
          ufma.showloading("正在保存出纳账，请耐心等待...");
          var url = "/cu/journal/saveJournal";
          if (window.ownerData.action == "add") {
            //新增保存
            var argu = $("#frmBookIn").serializeObject();
            if ($.isNull(argu.accountbookGuid)) {
              ufma.showTip(
                "账簿不能为空!请先选择一个账簿",
                function() {
                  ufma.hideloading();
                },
                "warning"
              );
              return false;
            }
            if (sendObj.isCashType == "0") {
              argu.cashType = "";
            }
            if (sendObj.isPayment == "0") {
              argu.type = "";
            }
            argu.summary = $("#description").val();
            argu.money = argu.money.replace(/,/g, "");
            argu.agencyCode = window.ownerData.agencyCode;
            argu.setYear = window.ownerData.setYear;
            argu.rgCode = window.ownerData.rgCode;
            argu.acctCode = sendObj.acctCode;
            argu.accoCode = sendObj.accoCode;
            argu.jouType = sendObj.accountBookType;
            argu.recordType = window.ownerData.bookinType; //1日常 0期初
            ufma.post(url, argu, function(result) {
              ufma.showTip(
                result.msg,
                function() {
                  ufma.hideloading();
                  _close();
                },
                result.flag
              );
            });
          } else {
            //编辑保存
            if (!page.checkRequiredACC()) {
              return false;
            }
            // if (!page.checkBalance()) {
            // 	return false;
            // }
            if (!page.checkLamonKeep()) {
              //校验上月已结账
              return false;
            }
            var argu = $("#frmBookIn").serializeObject();
            argu.money = argu.money.replace(/,/g, "");
            if ($.isNull(argu.accountbookGuid)) {
              ufma.showTip(
                "账簿不能为空!请先选择一个账簿",
                function() {
                  ufma.hideloading();
                },
                "warning"
              );
              return false;
            }
            if (sendObj.isCashType == "0") {
              argu.cashType = "";
            }
            if (sendObj.isPayment == "0") {
              argu.type = "";
            }
            argu.summary = $("#description").val();
            var oldData = window.ownerData.oneData;
            var linkJouGuid = window.ownerData.oneData.linkJouGuid;
            linkGuidsArr = [];
            if (!$.isNull(linkJouGuid)) {
              linkGuidsArr.push({
                seq: window.ownerData.oneData.jouNo,
                linkJouGuid: linkJouGuid
              });
            }
            argu = $.extend(oldData, argu);
            /* bug81248--出纳登记出纳账登账之后改日期凭证号会变--编辑修改保存时增加参数jouGuid--zsj*/
            argu.jouGuid = window.ownerData.jouGuid;
            var argulink = {
              linkGuids: linkGuidsArr
            };
            argu.linkGuidDetail = window.ownerData.oneData.linkGuidDetail;
            if (!$.isNull(linkJouGuid)) {
              dm.getlinkMessage(argulink, function(result) {
                var msg = result.msg;
                ufma.confirm(
                  "是否同时修改以下关联日记账:<br/>" + msg,
                  function(action) {
                    if (action) {
                      //点击确定的回调函数
                      argu = $.extend(argu, {
                        isModifyLink: 1
                      });
                      ufma.post(url, argu, function(result) {
                        ufma.showTip(
                          result.msg,
                          function() {
                            ufma.hideloading();
                            _close();
                          },
                          result.flag
                        );
                      });
                    } else {
                      //点击取消的回调函数
                      argu = $.extend(argu, {
                        isModifyLink: 0
                      });
                      ufma.post(url, argu, function(result) {
                        ufma.showTip(
                          result.msg,
                          function() {
                            ufma.hideloading();
                            _close();
                          },
                          result.flag
                        );
                      });
                    }
                  },
                  {
                    type: "warning"
                  }
                );
              });
            } else {
              ufma.post(url, argu, function(result) {
                ufma.showTip(
                  result.msg,
                  function() {
                    ufma.hideloading();
                    _close();
                  },
                  result.flag
                );
              });
            }
          }
          if (!flag) {
            $("#frmBookIn").setForm();
          }
        } else {
          if ($.isNull($(".currencyMoney").val())) {
            ufma.showTip(
              "请先填写外币金额!",
              function() {
                ufma.hideloading();
              },
              "warning"
            );
            return false;
          }
          if ($.isNull($(".exchangeRate").val())) {
            ufma.showTip(
              "请先填写汇率!",
              function() {
                ufma.hideloading();
              },
              "warning"
            );
            return false;
          }
          var tempMoney = $.formatMoney($(".currencyMoney").val() * $(".exchangeRate").val());
          if ($.formatMoney($(".onemoney").val()) != tempMoney) {
            //如果本币金额!= 外币金额* 汇率 不可保存
            ufma.confirm(
              "本位币金额不等于（汇率*外币）金额，是否继续保存？",
              function(action) {
                if (action) {
                  ufma.showloading("正在保存出纳账，请耐心等待...");
                  var url = "/cu/journal/saveJournal";
                  if (window.ownerData.action == "add") {
                    //新增保存
                    var argu = $("#frmBookIn").serializeObject();
                    if ($.isNull(argu.accountbookGuid)) {
                      ufma.showTip(
                        "账簿不能为空!请先选择一个账簿",
                        function() {
                          ufma.hideloading();
                        },
                        "warning"
                      );
                      return false;
                    }
                    if (sendObj.isCashType == "0") {
                      argu.cashType = "";
                    }
                    if (sendObj.isPayment == "0") {
                      argu.type = "";
                    }
                    argu.summary = $("#description").val();
                    argu.money = argu.localMoney.replace(/,/g, "");
                    argu.cashType = argu.cashTypeCur;
                    argu.isReceipt = argu.isReceiptCur;
                    argu.type = argu.typeCur;
                    argu.agencyCode = window.ownerData.agencyCode;
                    argu.setYear = window.ownerData.setYear;
                    argu.rgCode = window.ownerData.rgCode;
                    argu.acctCode = sendObj.acctCode;
                    argu.accoCode = sendObj.accoCode;
                    argu.jouType = sendObj.accountBookType;
                    argu.recordType = window.ownerData.bookinType; //1日常 0期初
                    ufma.post(url, argu, function(result) {
                      ufma.showTip(
                        result.msg,
                        function() {
                          ufma.hideloading();
                          _close();
                        },
                        result.flag
                      );
                    });
                  } else {
                    //编辑保存
                    if (!page.checkRequiredACC()) {
                      return false;
                    }
                    // if (!page.checkBalance()) {
                    // 	return false;
                    // }
                    if (!page.checkLamonKeep()) {
                      //校验上月已结账
                      return false;
                    }
                    var argu = $("#frmBookIn").serializeObject();
                    argu.money = argu.localMoney.replace(/,/g, "");
                    argu.cashType = argu.cashTypeCur;
                    argu.isReceipt = argu.isReceiptCur;
                    argu.type = argu.typeCur;
                    if ($.isNull(argu.accountbookGuid)) {
                      ufma.showTip(
                        "账簿不能为空!请先选择一个账簿",
                        function() {
                          ufma.hideloading();
                        },
                        "warning"
                      );
                      return false;
                    }
                    if (sendObj.isCashType == "0") {
                      argu.cashType = "";
                    }
                    if (sendObj.isPayment == "0") {
                      argu.type = "";
                    }
                    argu.summary = $("#description").val();
                    var oldData = window.ownerData.oneData;
                    var linkJouGuid = window.ownerData.oneData.linkJouGuid;
                    linkGuidsArr = [];
                    if (!$.isNull(linkJouGuid)) {
                      linkGuidsArr.push({
                        seq: window.ownerData.oneData.jouNo,
                        linkJouGuid: linkJouGuid
                      });
                    }
                    argu = $.extend(oldData, argu);
                    /* bug81248--出纳登记出纳账登账之后改日期凭证号会变--编辑修改保存时增加参数jouGuid--zsj*/
                    argu.jouGuid = window.ownerData.jouGuid;
                    var argulink = {
                      linkGuids: linkGuidsArr
                    };
                    argu.linkGuidDetail = window.ownerData.oneData.linkGuidDetail;
                    if (!$.isNull(linkJouGuid)) {
                      dm.getlinkMessage(argulink, function(result) {
                        var msg = result.msg;
                        ufma.confirm(
                          "是否同时修改以下关联日记账:<br/>" + msg,
                          function(action) {
                            if (action) {
                              //点击确定的回调函数
                              argu = $.extend(argu, {
                                isModifyLink: 1
                              });
                              ufma.post(url, argu, function(result) {
                                ufma.showTip(
                                  result.msg,
                                  function() {
                                    ufma.hideloading();
                                    _close();
                                  },
                                  result.flag
                                );
                              });
                            } else {
                              //点击取消的回调函数
                              argu = $.extend(argu, {
                                isModifyLink: 0
                              });
                              ufma.post(url, argu, function(result) {
                                ufma.showTip(
                                  result.msg,
                                  function() {
                                    ufma.hideloading();
                                    _close();
                                  },
                                  result.flag
                                );
                              });
                            }
                          },
                          {
                            type: "warning"
                          }
                        );
                      });
                    } else {
                      ufma.post(url, argu, function(result) {
                        ufma.showTip(
                          result.msg,
                          function() {
                            ufma.hideloading();
                            _close();
                          },
                          result.flag
                        );
                      });
                    }
                  }
                } else {
                  //点击取消的回调函数
                  return false;
                }
              },
              {
                type: "warning"
              }
            );
          } else {
            ufma.showloading("正在保存出纳账，请耐心等待...");
            var url = "/cu/journal/saveJournal";
            if (window.ownerData.action == "add") {
              //新增保存
              var argu = $("#frmBookIn").serializeObject();
              if ($.isNull(argu.accountbookGuid)) {
                ufma.showTip(
                  "账簿不能为空!请先选择一个账簿",
                  function() {
                    ufma.hideloading();
                  },
                  "warning"
                );
                return false;
              }
              if (sendObj.isCashType == "0") {
                argu.cashType = "";
              }
              if (sendObj.isPayment == "0") {
                argu.type = "";
              }
              argu.summary = $("#description").val();
              argu.money = argu.localMoney.replace(/,/g, "");
              argu.cashType = argu.cashTypeCur;
              argu.isReceipt = argu.isReceiptCur;
              argu.type = argu.typeCur;
              argu.agencyCode = window.ownerData.agencyCode;
              argu.setYear = window.ownerData.setYear;
              argu.rgCode = window.ownerData.rgCode;
              argu.acctCode = sendObj.acctCode;
              argu.accoCode = sendObj.accoCode;
              argu.jouType = sendObj.accountBookType;
              argu.recordType = window.ownerData.bookinType; //1日常 0期初
              ufma.post(url, argu, function(result) {
                ufma.showTip(
                  result.msg,
                  function() {
                    ufma.hideloading();
                    _close();
                  },
                  result.flag
                );
              });
            } else {
              //编辑保存
              if (!page.checkRequiredACC()) {
                return false;
              }
              // if (!page.checkBalance()) {
              // 	return false;
              // }
              if (!page.checkLamonKeep()) {
                //校验上月已结账
                return false;
              }
              var argu = $("#frmBookIn").serializeObject();
              argu.money = argu.localMoney.replace(/,/g, "");
              argu.cashType = argu.cashTypeCur;
              argu.isReceipt = argu.isReceiptCur;
              argu.type = argu.typeCur;
              if ($.isNull(argu.accountbookGuid)) {
                ufma.showTip(
                  "账簿不能为空!请先选择一个账簿",
                  function() {
                    ufma.hideloading();
                  },
                  "warning"
                );
                return false;
              }
              if (sendObj.isCashType == "0") {
                argu.cashType = "";
              }
              if (sendObj.isPayment == "0") {
                argu.type = "";
              }
              argu.summary = $("#description").val();
              var oldData = window.ownerData.oneData;
              var linkJouGuid = window.ownerData.oneData.linkJouGuid;
              linkGuidsArr = [];
              if (!$.isNull(linkJouGuid)) {
                linkGuidsArr.push({
                  seq: window.ownerData.oneData.jouNo,
                  linkJouGuid: linkJouGuid
                });
              }
              argu = $.extend(oldData, argu);
              /* bug81248--出纳登记出纳账登账之后改日期凭证号会变--编辑修改保存时增加参数jouGuid--zsj*/
              argu.jouGuid = window.ownerData.jouGuid;
              var argulink = {
                linkGuids: linkGuidsArr
              };
              argu.linkGuidDetail = window.ownerData.oneData.linkGuidDetail;
              if (!$.isNull(linkJouGuid)) {
                dm.getlinkMessage(argulink, function(result) {
                  var msg = result.msg;
                  ufma.confirm(
                    "是否同时修改以下关联日记账:<br/>" + msg,
                    function(action) {
                      if (action) {
                        //点击确定的回调函数
                        argu = $.extend(argu, {
                          isModifyLink: 1
                        });
                        ufma.post(url, argu, function(result) {
                          ufma.showTip(
                            result.msg,
                            function() {
                              ufma.hideloading();
                              _close();
                            },
                            result.flag
                          );
                        });
                      } else {
                        //点击取消的回调函数
                        argu = $.extend(argu, {
                          isModifyLink: 0
                        });
                        ufma.post(url, argu, function(result) {
                          ufma.showTip(
                            result.msg,
                            function() {
                              ufma.hideloading();
                              _close();
                            },
                            result.flag
                          );
                        });
                      }
                    },
                    {
                      type: "warning"
                    }
                  );
                });
              } else {
                ufma.post(url, argu, function(result) {
                  ufma.showTip(
                    result.msg,
                    function() {
                      ufma.hideloading();
                      _close();
                    },
                    result.flag
                  );
                });
              }
            }
          }
        }
      },
      //保存并新增
      saveAdd: function() {
        //zsj--bug74907 登记出纳账 在做提现或是存现时，会在现金账簿和银行账簿中同时生成两笔日记账，修改现金日记账的金额时，对应其他账簿的金额也变，删除也会同时删除
        if (!page.checkRequiredACC()) {
          return false;
        }
        // if (!page.checkBalance()) {
        // 	return false;
        // }
        if (!page.checkLamonKeep()) {
          //校验上月已结账
          return false;
        }
        //当经办人为必填时，需要判断是否为空--zsj--CWYXM-10502
        if ($(".dealWithClass").hasClass("required") && $.isNull($("#dealWith").val())) {
          ufma.showTip("经办人不能为空！", function() {}, "warning");
          return false;
        }
        if (!isCurrency) {
          //没有启用外币
          ufma.showloading("正在保存出纳账，请耐心等待...");
          var url = "/cu/journal/saveJournal";
          if (window.ownerData.action == "add") {
            //新增保存
            var argu = $("#frmBookIn").serializeObject();
            if ($.isNull(argu.accountbookGuid)) {
              ufma.showTip(
                "账簿不能为空!请先选择一个账簿",
                function() {
                  ufma.hideloading();
                },
                "warning"
              );
              return false;
            }
            if (sendObj.isCashType == "0") {
              argu.cashType = "";
            }
            if (sendObj.isPayment == "0") {
              argu.type = "";
            }
            argu.agencyCode = window.ownerData.agencyCode;
            argu.setYear = window.ownerData.setYear;
            argu.rgCode = window.ownerData.rgCode;
            argu.money = argu.localMoney;
            argu.acctCode = sendObj.acctCode;
            argu.accoCode = sendObj.accoCode;
            argu.jouType = sendObj.accountBookType;
            argu.recordType = window.ownerData.bookinType; //1日常 0期初
            argu.money = $(".money")
              .val()
              .replace(/,/g, "");
            argu.summary = $("#description").val();
            ufma.post(url, argu, function(result) {
              ufma.showTip(
                result.msg,
                function() {
                  ufma.hideloading();
                  page.getJouNo(false);
                  page.queryBalData(sendObj.accountbookGuid, sendObj.balByAccitem);
                },
                result.flag
              );
              page.clearAll();
              $("#description").focus();
            });
          } else {
            //编辑保存
            if (!page.checkRequiredACC()) {
              return false;
            }
            // if (!page.checkBalance()) {
            // 	return false;
            // }
            if (!page.checkLamonKeep()) {
              //校验上月已结账
              return false;
            }
            var argu = $("#frmBookIn").serializeObject();
            argu.money = argu.localMoney;
            if ($.isNull(argu.accountbookGuid)) {
              ufma.showTip(
                "账簿不能为空!请先选择一个账簿",
                function() {
                  ufma.hideloading();
                },
                "warning"
              );
              return false;
            }
            if (sendObj.isCashType == "0") {
              argu.cashType = "";
            }
            if (sendObj.isPayment == "0") {
              argu.type = "";
            }
            argu.summary = $("#description").val();
            var oldData = window.ownerData.oneData;
            var linkJouGuid = window.ownerData.oneData.linkJouGuid;
            linkGuidsArr = [];
            if (!$.isNull(linkJouGuid)) {
              linkGuidsArr.push({
                seq: window.ownerData.oneData.jouNo,
                linkJouGuid: linkJouGuid
              });
            }
            argu = $.extend(oldData, argu);
            argu.money = $(".money")
              .val()
              .replace(/,/g, "");
            /* bug81248--出纳登记出纳账登账之后改日期凭证号会变--编辑修改保存时增加参数jouGuid--zsj*/
            argu.jouGuid = window.ownerData.jouGuid;
            argu.linkGuidDetail = window.ownerData.oneData.linkGuidDetail;
            var argulink = {
              linkGuids: linkGuidsArr
            };
            if (!$.isNull(linkJouGuid)) {
              dm.getlinkMessage(argulink, function(result) {
                var msg = result.msg;
                ufma.confirm(
                  "是否同时修改以下关联日记账:<br/>" + msg,
                  function(action) {
                    if (action) {
                      //点击确定的回调函数
                      argu = $.extend(argu, {
                        isModifyLink: 1
                      });
                      ufma.post(url, argu, function(result) {
                        ufma.showTip(
                          result.msg,
                          function() {
                            if (result.flag == "success") {
                              window.ownerData.action = "add"; //为解决修改时“保存新增”action一直为edit的问题
                              isModifyLink = 0;
                            }
                            ufma.hideloading();
                            page.getJouNo(false); //解决“保存并新增”后编号没有变化的问题
                            page.queryBalData(sendObj.accountbookGuid, sendObj.balByAccitem);
                          },
                          result.flag
                        );
                        page.clearAll();
                        $("#description").focus();
                        $("#jouDate")
                          .getObj()
                          .setValue(window.ownerData.jouDate);
                      });
                    } else {
                      //点击取消的回调函数
                      argu = $.extend(argu, {
                        isModifyLink: 0
                      });
                      ufma.post(url, argu, function(result) {
                        ufma.showTip(
                          result.msg,
                          function() {
                            if (result.flag == "success") {
                              window.ownerData.action = "add"; //为解决修改时“保存新增”action一直为edit的问题
                              isModifyLink = 0;
                            }
                            ufma.hideloading();
                            page.getJouNo(false); //解决“保存并新增”后编号没有变化的问题
                            page.queryBalData(sendObj.accountbookGuid, sendObj.balByAccitem);
                          },
                          result.flag
                        );
                        page.clearAll();
                        $("#description").focus();
                      });
                      $("#jouDate")
                        .getObj()
                        .setValue(window.ownerData.jouDate);
                    }
                  },
                  {
                    type: "warning"
                  }
                );
              });
            } else {
              ufma.post(url, argu, function(result) {
                ufma.showTip(
                  result.msg,
                  function() {
                    if (result.flag == "success") {
                      window.ownerData.action = "add"; //为解决修改时“保存新增”action一直为edit的问题
                      isModifyLink = 0;
                    }
                    ufma.hideloading();
                    page.getJouNo(false); //解决“保存并新增”后编号没有变化的问题
                    page.queryBalData(sendObj.accountbookGuid, sendObj.balByAccitem);
                  },
                  result.flag
                );
                page.clearAll();
                $("#description").focus();
              });
            }
          }
        } else {
          if ($.isNull($(".currencyMoney").val())) {
            ufma.showTip(
              "请先填写外币金额!",
              function() {
                ufma.hideloading();
              },
              "warning"
            );
            return false;
          }
          if ($.isNull($(".exchangeRate").val())) {
            ufma.showTip(
              "请先填写汇率!",
              function() {
                ufma.hideloading();
              },
              "warning"
            );
            return false;
          }
          var tempMoney = $.formatMoney($(".currencyMoney").val() * $(".exchangeRate").val());
          if ($.formatMoney($(".onemoney").val()) != tempMoney) {
            //如果本币金额!= 外币金额* 汇率 不可保存
            ufma.confirm(
              "本位币金额不等于（汇率*外币）金额，是否继续保存？",
              function(action) {
                if (action) {
                  ufma.showloading("正在保存出纳账，请耐心等待...");
                  var url = "/cu/journal/saveJournal";
                  if (window.ownerData.action == "add") {
                    //新增保存
                    var argu = $("#frmBookIn").serializeObject();
                    if ($.isNull(argu.accountbookGuid)) {
                      ufma.showTip(
                        "账簿不能为空!请先选择一个账簿",
                        function() {
                          ufma.hideloading();
                        },
                        "warning"
                      );
                      return false;
                    }
                    if (sendObj.isCashType == "0") {
                      argu.cashType = "";
                    }
                    if (sendObj.isPayment == "0") {
                      argu.type = "";
                    }
                    argu.agencyCode = window.ownerData.agencyCode;
                    argu.setYear = window.ownerData.setYear;
                    argu.rgCode = window.ownerData.rgCode;
                    argu.cashType = argu.cashTypeCur;
                    argu.isReceipt = argu.isReceiptCur;
                    argu.type = argu.typeCur;
                    argu.money = argu.localMoney.replace(/,/g, "");
                    argu.acctCode = sendObj.acctCode;
                    argu.accoCode = sendObj.accoCode;
                    argu.jouType = sendObj.accountBookType;
                    argu.recordType = window.ownerData.bookinType; //1日常0期初
                    argu.summary = $("#description").val();
                    ufma.post(url, argu, function(result) {
                      ufma.showTip(
                        result.msg,
                        function() {
                          ufma.hideloading();
                          page.getJouNo(false);
                          page.queryBalData(sendObj.accountbookGuid, sendObj.balByAccitem);
                          page.getDireRate();
                        },
                        result.flag
                      );
                      page.clearAll();
                      $("#description").focus();
                    });
                  } else {
                    //编辑保存
                    if (!page.checkRequiredACC()) {
                      return false;
                    }
                    // if (!page.checkBalance()) {
                    // 	return false;
                    // }
                    if (!page.checkLamonKeep()) {
                      //校验上月已结账
                      return false;
                    }
                    var argu = $("#frmBookIn").serializeObject();
                    argu.money = argu.localMoney.replace(/,/g, "");
                    argu.cashType = argu.cashTypeCur;
                    argu.isReceipt = argu.isReceiptCur;
                    argu.type = argu.typeCur;
                    if ($.isNull(argu.accountbookGuid)) {
                      ufma.showTip(
                        "账簿不能为空!请先选择一个账簿",
                        function() {
                          ufma.hideloading();
                        },
                        "warning"
                      );
                      return false;
                    }
                    if (sendObj.isCashType == "0") {
                      argu.cashType = "";
                    }
                    if (sendObj.isPayment == "0") {
                      argu.type = "";
                    }
                    argu.summary = $("#description").val();
                    var oldData = window.ownerData.oneData;
                    var linkJouGuid = window.ownerData.oneData.linkJouGuid;
                    linkGuidsArr = [];
                    if (!$.isNull(linkJouGuid)) {
                      linkGuidsArr.push({
                        seq: window.ownerData.oneData.jouNo,
                        linkJouGuid: linkJouGuid
                      });
                    }
                    argu = $.extend(oldData, argu);
                    /* bug81248--出纳登记出纳账登账之后改日期凭证号会变--编辑修改保存时增加参数jouGuid--zsj*/
                    argu.jouGuid = window.ownerData.jouGuid;
                    argu.linkGuidDetail = window.ownerData.oneData.linkGuidDetail;
                    var argulink = {
                      linkGuids: linkGuidsArr
                    };
                    if (!$.isNull(linkJouGuid)) {
                      dm.getlinkMessage(argulink, function(result) {
                        var msg = result.msg;
                        ufma.confirm(
                          "是否同时修改以下关联日记账:<br/>" + msg,
                          function(action) {
                            if (action) {
                              //点击确定的回调函数
                              argu = $.extend(argu, {
                                isModifyLink: 1
                              });
                              ufma.post(url, argu, function(result) {
                                ufma.showTip(
                                  result.msg,
                                  function() {
                                    if (result.flag == "success") {
                                      window.ownerData.action = "add"; //为解决修改时“保存新增”action一直为edit的问题
                                      isModifyLink = 0;
                                    }
                                    ufma.hideloading();
                                    page.getJouNo(false); //解决“保存并新增”后编号没有变化的问题
                                    page.queryBalData(sendObj.accountbookGuid, sendObj.balByAccitem);
                                    page.getDireRate();
                                  },
                                  result.flag
                                );
                                page.clearAll();
                                $("#description").focus();
                                $("#jouDate")
                                  .getObj()
                                  .setValue(window.ownerData.jouDate);
                              });
                            } else {
                              //点击取消的回调函数
                              argu = $.extend(argu, {
                                isModifyLink: 0
                              });
                              ufma.post(url, argu, function(result) {
                                ufma.showTip(
                                  result.msg,
                                  function() {
                                    if (result.flag == "success") {
                                      window.ownerData.action = "add"; //为解决修改时“保存新增”action一直为edit的问题
                                      isModifyLink = 0;
                                    }
                                    ufma.hideloading();
                                    page.getJouNo(false); //解决“保存并新增”后编号没有变化的问题
                                    page.queryBalData(sendObj.accountbookGuid, sendObj.balByAccitem);
                                    page.getDireRate();
                                  },
                                  result.flag
                                );
                                page.clearAll();
                                $("#description").focus();
                              });
                              $("#jouDate")
                                .getObj()
                                .setValue(window.ownerData.jouDate);
                            }
                          },
                          {
                            type: "warning"
                          }
                        );
                      });
                    } else {
                      ufma.post(url, argu, function(result) {
                        ufma.showTip(
                          result.msg,
                          function() {
                            if (result.flag == "success") {
                              window.ownerData.action = "add"; //为解决修改时“保存新增”action一直为edit的问题
                              isModifyLink = 0;
                            }
                            ufma.hideloading();
                            page.getJouNo(false); //解决“保存并新增”后编号没有变化的问题
                            page.queryBalData(sendObj.accountbookGuid, sendObj.balByAccitem);
                            page.getDireRate();
                          },
                          result.flag
                        );
                        page.clearAll();
                        $("#description").focus();
                      });
                    }
                  }
                } else {
                  //点击取消的回调函数
                  return false;
                }
              },
              {
                type: "warning"
              }
            );
          } else {
            ufma.showloading("正在保存出纳账，请耐心等待...");
            var url = "/cu/journal/saveJournal";
            if (window.ownerData.action == "add") {
              //新增保存
              var argu = $("#frmBookIn").serializeObject();
              if ($.isNull(argu.accountbookGuid)) {
                ufma.showTip(
                  "账簿不能为空!请先选择一个账簿",
                  function() {
                    ufma.hideloading();
                  },
                  "warning"
                );
                return false;
              }
              if (sendObj.isCashType == "0") {
                argu.cashType = "";
              }
              if (sendObj.isPayment == "0") {
                argu.type = "";
              }
              argu.agencyCode = window.ownerData.agencyCode;
              argu.setYear = window.ownerData.setYear;
              argu.rgCode = window.ownerData.rgCode;
              argu.cashType = argu.cashTypeCur;
              argu.isReceipt = argu.isReceiptCur;
              argu.type = argu.typeCur;
              argu.money = argu.localMoney.replace(/,/g, "");
              argu.acctCode = sendObj.acctCode;
              argu.accoCode = sendObj.accoCode;
              argu.jouType = sendObj.accountBookType;
              argu.recordType = window.ownerData.bookinType; //1日常 0期初
              argu.summary = $("#description").val();
              ufma.post(url, argu, function(result) {
                ufma.showTip(
                  result.msg,
                  function() {
                    ufma.hideloading();
                    page.getJouNo(false);
                    page.queryBalData(sendObj.accountbookGuid, sendObj.balByAccitem);
                    page.getDireRate();
                  },
                  result.flag
                );
                page.clearAll();
                $("#description").focus();
              });
            } else {
              //编辑保存
              if (!page.checkRequiredACC()) {
                return false;
              }
              // if (!page.checkBalance()) {
              // 	return false;
              // }
              if (!page.checkLamonKeep()) {
                //校验上月已结账
                return false;
              }
              var argu = $("#frmBookIn").serializeObject();
              argu.money = argu.localMoney.replace(/,/g, "");
              argu.cashType = argu.cashTypeCur;
              argu.isReceipt = argu.isReceiptCur;
              argu.type = argu.typeCur;
              if ($.isNull(argu.accountbookGuid)) {
                ufma.showTip(
                  "账簿不能为空!请先选择一个账簿",
                  function() {
                    ufma.hideloading();
                  },
                  "warning"
                );
                return false;
              }
              if (sendObj.isCashType == "0") {
                argu.cashType = "";
              }
              if (sendObj.isPayment == "0") {
                argu.type = "";
              }
              argu.summary = $("#description").val();
              var oldData = window.ownerData.oneData;
              var linkJouGuid = window.ownerData.oneData.linkJouGuid;
              linkGuidsArr = [];
              if (!$.isNull(linkJouGuid)) {
                linkGuidsArr.push({
                  seq: window.ownerData.oneData.jouNo,
                  linkJouGuid: linkJouGuid
                });
              }
              argu = $.extend(oldData, argu);
              /* bug81248--出纳登记出纳账登账之后改日期凭证号会变--编辑修改保存时增加参数jouGuid--zsj*/
              argu.jouGuid = window.ownerData.jouGuid;
              argu.linkGuidDetail = window.ownerData.oneData.linkGuidDetail;
              var argulink = {
                linkGuids: linkGuidsArr
              };
              if (!$.isNull(linkJouGuid)) {
                dm.getlinkMessage(argulink, function(result) {
                  var msg = result.msg;
                  ufma.confirm(
                    "是否同时修改以下关联日记账:<br/>" + msg,
                    function(action) {
                      if (action) {
                        //点击确定的回调函数
                        argu = $.extend(argu, {
                          isModifyLink: 1
                        });
                        ufma.post(url, argu, function(result) {
                          ufma.showTip(
                            result.msg,
                            function() {
                              if (result.flag == "success") {
                                window.ownerData.action = "add"; //为解决修改时“保存新增”action一直为edit的问题
                                isModifyLink = 0;
                              }
                              ufma.hideloading();
                              page.getJouNo(false); //解决“保存并新增”后编号没有变化的问题
                              page.queryBalData(sendObj.accountbookGuid, sendObj.balByAccitem);
                              page.getDireRate();
                            },
                            result.flag
                          );
                          page.clearAll();
                          $("#description").focus();
                          $("#jouDate")
                            .getObj()
                            .setValue(window.ownerData.jouDate);
                        });
                      } else {
                        //点击取消的回调函数
                        argu = $.extend(argu, {
                          isModifyLink: 0
                        });
                        ufma.post(url, argu, function(result) {
                          ufma.showTip(
                            result.msg,
                            function() {
                              if (result.flag == "success") {
                                window.ownerData.action = "add"; //为解决修改时“保存新增”action一直为edit的问题
                                isModifyLink = 0;
                              }
                              ufma.hideloading();
                              page.getJouNo(false); //解决“保存并新增”后编号没有变化的问题
                              page.queryBalData(sendObj.accountbookGuid, sendObj.balByAccitem);
                              page.getDireRate();
                            },
                            result.flag
                          );
                          page.clearAll();
                          $("#description").focus();
                        });
                        $("#jouDate")
                          .getObj()
                          .setValue(window.ownerData.jouDate);
                      }
                    },
                    {
                      type: "warning"
                    }
                  );
                });
              } else {
                ufma.post(url, argu, function(result) {
                  ufma.showTip(
                    result.msg,
                    function() {
                      if (result.flag == "success") {
                        window.ownerData.action = "add"; //为解决修改时“保存新增”action一直为edit的问题
                        isModifyLink = 0;
                      }
                      ufma.hideloading();
                      page.getJouNo(false); //解决“保存并新增”后编号没有变化的问题
                      page.queryBalData(sendObj.accountbookGuid, sendObj.balByAccitem);
                      page.getDireRate();
                    },
                    result.flag
                  );
                  page.clearAll();
                  $("#description").focus();
                });
              }
            }
          }
        }
      },
      clearAll: function() {
        //bug77574---zsj
        if (sendObj.isKeepData == "1") {
          //保存并新增时保留数据--启用---现金、银行账簿、零余额账簿日常登账时：单据编号增加，金额、票据号、凭证号清空，其它内容不变
          $("#jouNo,.money,#exchangeRate,#currencyMoney,#billNo,#vouNo").val("");
        } else if (sendObj.isKeepData == "0") {
          //保存并新增时保留数据--禁用---现金、银行账簿、零余额账簿日常登账时：单据编号增加，经办人不清 空，其它内容按第一次打开页面默认值显示
          $("#jouNo,#description,#exchangeRate,#currencyMoney,.money,#billNo,#vouNo,#remark").val(""); //原本为空格，导致金额清空时会放入空格，这样保存时会报服务端错误
          //bug79929--zsj
          for (var i = 0; i < treeArry.length; i++) {
            //var treeId = page.shortLineToTF(treeArry[i]) + 'Code';
            var treeId = treeArry[i]; // + 'Code';
            $("#" + treeId)
              .getObj()
              .clear();
          }
          $("#billTypeCode")
            .getObj()
            .clear();
          //bug79932--zsj
          $("#isReceiptN")
            .addClass("active")
            .siblings()
            .removeClass("active");
          $("#cashTypeN")
            .addClass("active")
            .siblings()
            .removeClass("active");
          $("#drCrY")
            .addClass("active")
            .siblings()
            .removeClass("active");
          $("#typeY")
            .addClass("active")
            .siblings()
            .removeClass("active");
          if (window.ownerData.type == 0 || window.ownerData.bookinType == 0) {
            $(".qcdz").removeClass("required");
            $("#jouDate")
              .getObj()
              .setValue(Year + '-01-01');
            $("#jouDate input").attr("disabled", "disabled");
            $("#jouDate span").addClass("hide");
          } else {
            $("#jouDate")
              .getObj()
              .setValue(window.ownerData.jouDate);
          }
        }
      },
      //获取日记账编码
      getJouNo: function(flag) {
        var argu = {
          agencyCode: window.ownerData.agencyCode,
          acctCode: sendObj.acctCode,
          accoCode: sendObj.accoCode,
          setYear: window.ownerData.setYear,
          rgCode: window.ownerData.rgCode,
          accountbookGuid: sendObj.accountbookGuid,
          jouDate: $("#jouDate")
            .getObj()
            .getValue(),
          bookinType: window.ownerData.bookinType
        };
        if (flag) {
          argu.jouGuid = window.ownerData.jouGuid;
        }
        dm.cbbGetJouNo(argu, function(result) {
          if (!$.isNull(result.data)) {
            $("#jouNo").val(result.data);
          }
        });
      },
      onEventListener: function() {
        $("#btnSave").on("click", function() {
          $("#btnSave").attr("disabled", true);
          keydownctrls = false;
          page.save(true);
          var timeId = setTimeout(function() {
            $("#btnSave").attr("disabled", false);
            keydownctrls = true;
            clearTimeout(timeId);
          }, 5000);
        });
        $("#btnSaveAndAdd").on("click", function() {
          page.saveAdd(false);
        });
        $("#btnQuit").on("click", function() {
          _close();
        });
        //常用摘要--CWYXM-4270--zsj
        $("#description").on("input", function() {
          //常用摘要
          var inputValue = $("#description").val();
          page.reqSummary(inputValue);
        });
        $("#description").on("click", function() {
          //常用摘要
          var inputValue = $("#description").val();
          page.reqSummary(inputValue);
        });
        //bug81752 【20190703 财务云8.0 广东省财政厅】出纳管理—登记出纳账 修改从账务取数的单据日期 报服务端异常--zsj
        $("#vouNo")
          .on("keyup paste", function() {
            $(this).val(
              $(this)
                .val()
                .replace(/[^\d]/g, "")
            );
          })
          .on("blur", function() {
            $(this).val(
              $(this)
                .val()
                .replace(/\D/g, "")
            );
          });
        //intInput()不支持以0开头---zsj
        $("#jouNo")
          .on("keyup paste", function() {
            $(this).val(
              $(this)
                .val()
                .replace(/[^\d]/g, "")
            );
          })
          .on("blur", function() {
            $(this).val(
              $(this)
                .val()
                .replace(/\D/g, "")
            );
          });
        //外币
        $(".currencyMoney").on("input", function(e) {
          e.stopPropagation();
          e.preventDefault();
          if (!$.isNull($(".currencyMoney").val()) && !$.isNull($(".exchangeRate").val())) {
            var tempMoney = $(".currencyMoney").val() * $(".exchangeRate").val();
            $(".money")
              .eq(1)
              .val($.formatMoney(tempMoney));
          }
        });
        //汇率
        $(".exchangeRate").on("blur input", function(e) {
          e.stopPropagation();
          e.preventDefault();
          if (!$.isNull($(".currencyMoney").val()) && !$.isNull($(".exchangeRate").val())) {
            var tempMoney = $(".currencyMoney").val() * $(".exchangeRate").val();
            $(".money")
              .eq(1)
              .val($.formatMoney(tempMoney));
          } else {
            //如果汇率为空则清空本币金额和外币金额 guohx 20200219
            $(".money")
              .eq(1)
              .val("");
            $(".currencyMoney").val("");
          }
        });
        //冲突 不能修改本币金额
        $(".onemoney,.zeromoney").blur(function() {
          $(this).val($.formatMoney($(this).val()));
        });
        $(".onemoney,.zeromoney").focus(function() {
          var moneySPP = $(this)
            .val()
            .split(",")
            .join("");
          $(this).val(moneySPP);
          this.select();
        });
        //增加快捷键需求 guohx 20200213
        $(document).on("keydown", function(event) {
          //Ctrl+S 保存
          if (event.keyCode == 83 && event.ctrlKey) {
            event.preventDefault();
            if (keydownctrls == true && $("#btnSave").length == 1) {
              keydownctrls = false;
              setTimeout(function() {
                $("#btnSave").trigger("click");
                keydownctrls = true;
              }, 1);
              event.keyCode = 0;
              if (event.preventDefault) {
                // firefox
                event.preventDefault();
              } else {
                // other
                event.returnValue = false;
              }
            }
          }
          //Alt+N 保存并新增
          if (event.altKey && event.keyCode == 78) {
            event.preventDefault();
            $("#btnSaveAndAdd").trigger("click");
            event.preventDefault();
            event.returnValue = false;
            return false;
          }
        });
      },

      //此方法必须保留
      init: function() {
        this.initPage();
        this.onEventListener();
        ptData = ufma.getCommonData();
        ufma.parseScroll();
        ufma.parse();
      }
    };
  })();

  /////////////////////
  page.init();
});
