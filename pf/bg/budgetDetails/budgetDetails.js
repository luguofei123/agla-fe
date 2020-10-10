$(function () {
  var bgItemDefaults = {
    agencyCode: '',
    chrId: '',
    chrCode: '',
    businessDateBegin: '',
    businessDateEnd: '',
    businessDateBegin: '',
    businessDateEnd: '',
    billStatus: '',
    sysIds: [],
    expfuncCode: '',
    govexpecoCode: '',
    expecoCode: '',
    depproCode: '',
    projectCode: '',
    protypeCode: '',
    fundtypeCode: '',
    bgtsourceCode: '',
    fundsourceCode: '',
    departmentCode: '',
    exptypeCode: '',
    bgResItem1: '',
    bgResItem2: '',
    bgResItem3: '',
    bgResItem4: '',
    bgResItem5: '',
    bgResItem6: '',
    bgResItem7: '',
    bgResItem8: '',
    bgResItem9: '',
    bgResItem10: '',
    bgResItem11: '',
    bgResItem12: '',
    bgResItem13: '',
    bgResItem14: '',
    bgResItem15: '',
    bgResItem16: '',
    bgResItem17: '',
    bgResItem18: '',
    bgResItem19: '',
    bgResItem20: '',
    bgResItem21: '',
    bgResItem22: '',
    bgResItem23: '',
    bgResItem24: '',
    bgResItem25: '',
    bgResItem26: '',
    bgResItem27: '',
    bgResItem28: '',
    bgResItem29: '',
    bgResItem30: '',
    bgItemType: ''
  }
  var menuId = '1001384c-87e5-42ee-a973-da034e8ccfbc';
  var iValue = 0;
  var divId = 'budgetDetails';
  //CWYXM-18080 编制指标时需要增加文本说明项，只录入文本，用于描述指标信息--zsj
  var textCodeArr = []; //存放文本说明项code，方便记忆方案存值
  //ZJGA820-1788--指标登记簿的财政下达指标方案中发文文号没有变为财政指标id，其他模块在执行过脚本后变了--zsj
  var compireMember = []; // 存放记忆列数据
  var page = function () {
    var oTable, billStatus;
    var pageLength = ufma.dtPageLength('#queryTable');
    //CWYXM-18080 编制指标时需要增加文本说明项，只录入文本，用于描述指标信息--zsj
    var textArr = [];
    var compireTextArr = [];
    // CWYXM-18216 已经有记忆列的预算方案重新修改辅助项时(在预算方案里增减辅助项)，界面显示不同步--zsj
    var assiArr = [];
    var compireArr = [];
    var assiEleCode = [];
    return {
      //初始化单位
      initAgency: function () {
        bg.setAgencyCombox($("#cbAgency"), {
          "userCode": page.pfData.svUserCode,
          "userId": page.pfData.svUserId,
          "setYear": page.setYear
        }, function (sender, treeNode) {
          page.agencyCode = treeNode.id;
          page.showPlan({
            agencyCode: page.agencyCode,
            userId: page.pfData.svUserId,
            userName: page.pfData.svUserName,
            rptType: 'budgetDetails'
          });
          page.moreMsgSetting.agencyCode = page.agencyCode;
          //缓存单位
          var params = {
            selAgecncyCode: treeNode.id,
            selAgecncyName: treeNode.name
          }
          ufma.setSelectedVar(params);
          var bgUrl = '/bg/sysdata/selectSysRgParaValue?rgCode=' + page.rgCode + '&setYear=' + page.setYear + '&agencyCode=' + treeNode.id + '&chrCode=BG003';
          ufma.get(bgUrl, {}, function (result) {
            page.needSendDocNum = result.data;
            if (page.needSendDocNum == true) {
              page.sendCloName = "指标id";
            } else {
              page.sendCloName = "发文文号";
            }
          });
          page.initBillType();
          page.reqPnl = true;
          page.selectSessionPlan();
          page.selectSessionData();
        });
      },
      //用于请求记忆列
      selectSessionData: function () {
        var argu = {
          agencyCode: page.agencyCode,
          acctCode: '*',
          menuId: menuId
        }
        ufma.get('/bg/pub/menuConfig/select', argu, function (result) {
          page.sessionPlanData = result.data;
          if (page.reqPnl == true) {
            page.initSearchPnl();
          } else {
            var cbBgPlanId = $('#cbBgPlan').getObj().getValue();
            var cbBgPlanText = $('#cbBgPlan').getObj().getText();
            var figValue = cbBgPlanId + ',' + cbBgPlanText;
            if (!$.isEmptyObject(page.sessionPlanData) && !$.isNull(page.sessionPlanData[figValue])) {
              var useData = page.sessionPlanData[figValue]
              page.setMenberData = eval("(" + useData + ")");
            } else {
              page.setMenberData = [];
            }
            page.setShowColumn();
          }
        });
      },
      //ZWCW01036143 、ZWCW01036129：预算执行情况表、预算执行明细表增加记忆列功能--zsj
      //用于请求记忆列
      updateSessionTable: function () {
        var argu = {
          acctCode: "*",
          agencyCode: page.agencyCode,
          configKey: page.configKey,
          configValue: page.configValue,
          menuId: menuId
        }
        ufma.post('/bg/pub/menuConfig/update', argu, function (reslut) {
          page.reqPnl = false;
          page.selectSessionData();
        });
      },
      //ZWCW01036143 、ZWCW01036129：预算执行情况表、预算执行明细表增加记忆列功能--zsj
      setShowColumn: function () {
        if (page.setMenberData && page.setMenberData.length > 0) {
          if (page.chooseFlag == true) {
            page.setShow = true;
            page.initQueryTable();
            oTable.fnClearTable();
            if (page.tableAllData.length > 0) {
              oTable.fnAddData(page.tableAllData, true);
              $('#queryTable').closest('.dataTables_wrapper').ufScrollBar({
                hScrollbar: true,
                mousewheel: false
              });
              ufma.setBarPos($(window));
            }
          }
          setTimeout(function () {
            for (var i = 0; i < page.changeCol.length; i++) {
              if (page.changeCol[i].title == page.setMenberData[i].title) {
                page.changeCol[i].visible = page.setMenberData[i].visible;
                var seq = page.setMenberData[i].seq;
                if (page.setMenberData[i].visible == true) {
                  oTable.api(true).column(i + 1).visible(true);
                } else {
                  oTable.api(true).column(i + 1).visible(false);
                }
              }
            }
            ufma.hideloading();
          }, 100)
        }
      },
      //ZWCW01036143 、ZWCW01036129：预算执行情况表、预算执行明细表增加记忆列功能--zsj
      //用于请求记忆方案
      selectSessionPlan: function () {
        var argu = {
          agencyCode: page.agencyCode,
          acctCode: '*',
          menuId: menuId
        }
        ufma.get('/pub/user/menu/config/select', argu, function (result) {
          page.sessionPlan = result.data;
          if (page.reqPnl == true) {
              page.initSearchPnl();
          }
        });
      },
      //ZWCW01036143 、ZWCW01036129：预算执行情况表、预算执行明细表增加记忆列功能--zsj
      //用于请求记忆方案
      updateSessionPlan: function () {
        var argu = {
          acctCode: "*",
          agencyCode: page.agencyCode,
          configKey: page.configKeyPlan,
          configValue: page.configValuePlan,
          menuId: menuId
        }
        ufma.post('/pub/user/menu/config/update', argu);
      },
      //预算方案
      initSearchPnl: function () {
        uf.cacheDataRun({
          element: $('#cbBgPlan'),
          cacheId: page.agencyCode + '_plan_items',
          url: bg.getUrl('bgPlan') + "?ajax=1",
          param: {
            'agencyCode': page.agencyCode,
            'setYear': page.setYear
          },
          callback: function (element, data) {
            element.ufCombox({ //初始化
              data: data, //列表数据
              readonly: true, //可选
              placeholder: "请选择预算方案",
              onChange: function (sender, data) {
                page.planData = data;
                page.setMenberData = [];
                if (data.planVo_Items.length > 0) {
                    $('.fzxName').removeClass('hide');
                } else {
                    $('.fzxName').addClass('hide');
                }
                if ($('#showTrue').attr('checked') == true) {
                    page.showTrue = true;
                } else if ($('#showFalse').attr('checked') == true) {
                    page.showTrue = false;
                }
                /**ZJGA820-1550 因为指标ID是唯一的，所以指标编制模块需增加一指标ID查询条件。
                 * 预算方案中启用了发文文号，指标的所有界面，需要有按发文文号查询的条件框；
                   涉及到所有菜单的主界面，分解、调整、调剂的新增弹框类界面；
                    指标的所有账表界面；
                  */
                var codeArr = []
                // CWYXM-18216 已经有记忆列的预算方案重新修改辅助项时(在预算方案里增减辅助项)，界面显示不同步--zsj
                // 方案要素去重
                var obj = {};
                for(var i =0; i < data.planVo_Items.length; i++){
                  var code = data.planVo_Items[i].eleCode;
                  if (code != 'sendDocNum' && code != 'bgItemIdMx'){
                    if(!obj[code]){
                      codeArr.push(data.planVo_Items[i]);
                      obj[code] = true;
                    }
                  }
                }
                // for (var z = 0; z < data.planVo_Items.length; z++) {
                //     var code = data.planVo_Items[z].eleCode;
                //     if (code != 'sendDocNum' && code != 'bgItemIdMx'){
                //         codeArr.push(data.planVo_Items[z]);
                //     }
                // } 
                if(page.planData.isSendDocNum == "是"){
                  var isSendDocNumObj = {
                    eleCode:"sendDocNum",
                    eleName:page.sendCloName,
                    bgItemCode:"sendDocNum"
                  }
                  // CWYXM-18872 --指标明细账,点击更多后界面乱了,具体见截图--zsj
                  // codeArr.splice(0,0,isSendDocNumObj)
                  codeArr.push(isSendDocNumObj)
                }
                //ZJGA820-1550 因为指标ID是唯一的，所以指标编制模块需增加一指标ID查询条件--zsj
                if(page.planData.isFinancialBudget == "1"){
                  var isSendDocNumObj = {
                    eleCode:"bgItemIdMx",
                    eleName:'财政指标ID',
                    bgItemCode:"bgItemIdMx"
                  }
                  // CWYXM-18872 --指标明细账,点击更多后界面乱了,具体见截图--zsj
                  // codeArr.splice(0,0,isSendDocNumObj)
                  codeArr.push(isSendDocNumObj)
                }
                page.planData.planVo_Items = codeArr;
                page.initBgPlanItemPnl($('#searchPlanPnl'), page.planData);
                if (!$.isNull(page.balanceTurnDetailQuery) && !$.isNull(page.balanceTurnDetailQuery.bgItemCode) && page.turnFlag == true) {
                  $('#bgItemCode p').html(page.balanceTurnDetailQuery.bgItemCode); //CWYXM-10755 --指标预算执行情况表，编码联查到预算执行明细表，应按所选指标带出预算方案--zsj
                  $('.clearBill').css("margin-top", "-29px");
                  $('#bgItemCode p').css('color', '#333');
                  page.bgItemCode = page.balanceTurnDetailQuery.bgItemCode;
                  page.turnFlag = false;
                } else {
                  page.bgItemCode = [];
                  $('#bgItemCode p').html('请选择指标编码');
                  $('#bgItemCode p').css('color', '#d9d9d9');
                }
                //bugCWYXM-10166--新增需求记忆预算方案--更新记忆数据--zsj
                page.configKeyPlan = '';
                page.configValuePlan = '';
                page.configKeyPlan = 'cbBgPlan';
                var cbBgPlanId = $('#cbBgPlan').getObj().getValue();
                var cbBgPlanText = $('#cbBgPlan').getObj().getText();
                page.configValuePlan = cbBgPlanId + ',' + cbBgPlanText;
                //CWYXM-10166--指标编制、指标控制管理界面记忆预算方案--修改为切换预算方案就记忆，弹窗不记忆
                //请求记忆方案
                page.updateSessionPlan();
                var figValue = cbBgPlanId + ',' + cbBgPlanText;
                //CWYXM-10625 --指标管理，查询不同预算方案，重新保存格式后，列表数据显示错误--zsj
                page.chooseFlag = false;
                page.tableAllData = [];
                //CWYXM-10173--zsj--指标控制管理界面，可以设置表格区哪些列可以展示，哪些列不展示，同时实现列排序和记忆功能
                if (!$.isEmptyObject(page.sessionPlanData) && !$.isNull(page.sessionPlanData[figValue])) {
                  var useData = page.sessionPlanData[figValue]
                  page.setMenberData = eval("(" + useData + ")");
                } else {
                  page.setMenberData = [];
                }
                page.initQueryTable();
                page.showTblData();
              },
              onComplete: function () {
                ufma.hideloading();
                //从预算执行情况表跳转到预算执行明细表
                if ($.isNull(page.balanceTurnDetailQuery)) {
                  if (!$.isEmptyObject(page.sessionPlan) && !$.isNull(page.sessionPlan.cbBgPlan)) {
                    var planData = page.sessionPlan.cbBgPlan.split(",");
                    var planId = planData[0];
                    var planName = planData[1];
                    //CWYXM-17038 指标管理模块--所有涉及到预算方案记忆的界面均需判断已记忆方案是否被删除--zsj
                    var planIdArr = [];
                    for(var a = 0; a < data.length; a++) {
                      planIdArr.push(data[a].chrId);
                    } 
                    if($.inArray(planId,planIdArr) > -1){                                       
                      $('#cbBgPlan').getObj().setValue(planId, planName);
                    }else{
                      $('#cbBgPlan').getObj().val('111');  
                    }
                  } else {
                    element.getObj().val('111');
                  }
                } else {
                  element.getObj().val(page.balanceTurnDetailQuery.bgPlanChrId);
                }
              }
            });
          }
        });
      },
      planSetData: function () {
        var planItems = page.getPlanItems();
        var isUpBudget = '';
        var sendDocNum = '';
        var bgItemIdMx = '';
        var textList = {};
				for (var m = 0; m < planItems.length; m++) {
					var itemValue = [];
					var idEceCode = planItems[m].itemField;
          var tmpEleCode = planItems[m].itemField;
          /**ZJGA820-1550 因为指标ID是唯一的，所以指标编制模块需增加一指标ID查询条件。
           * 预算方案中启用了发文文号，指标的所有界面，需要有按发文文号查询的条件框；
               涉及到所有菜单的主界面，分解、调整、调剂的新增弹框类界面；
              指标的所有账表界面；
          */   
          if (tmpEleCode == 'sendDocNum') {
            sendDocNum = $('#sendDocNum').val();
            itemValue = [];
          } else if (tmpEleCode == 'bgItemIdMx') {
            bgItemIdMx = $('#bgItemIdMx').val();
            itemValue = [];
          }else if (tmpEleCode == 'ISUPBUDGET') {
            isUpBudget = $('#isUpBudget').getObj().getValue();
            itemValue = [];
					} else if ($.inArray(tmpEleCode,assiEleCode) > -1){
            var getItemData = $('#cb' + idEceCode).getObj().getItem();
            if (!$.isNull(getItemData)) {
              var codeName = getItemData.codeName;
              var name = getItemData.name;
              var id = getItemData.id;
              itemValue = [{
                "codeName": codeName,
                "name": name,
                "id": id
              }];
            } else {
              itemValue = [];
            }
					} else if ($.inArray(tmpEleCode, textCodeArr) > -1){
            textList[bg.shortLineToTF(idEceCode)] = $('#' + bg.shortLineToTF(idEceCode)).val();
						itemValue = [];
					}
					var selectedItems = $.inArrayJson(page.contentObj.selectedItems, 'eleCode', tmpEleCode);
					if (selectedItems) {
						selectedItems.itemValue = itemValue;
					}
				}

        var tmpGetCaseNameModal = _bgPub_selfInputModal(divId, "查询方案", "请输入方案名称", function (sName) {
          var tmpUrl = _bgPub_requestUrlArray_report[3];
          var settingArgu = {
            bgItemCode: $('#bgItemCode p').html() == '请选择指标编码' ? '' : $('#bgItemCode p').html(),
            billStatus: $('#targetStatus').getObj().getValue(),
            planChrId: $("#cbBgPlan").getObj().getValue(),
            targetStatus: $('#targetStatus').getObj().getValue(),
            targetState: $('#targetState').ufmaTextboxlist().setting.tree.getCheckedNodes()
          }
          //bug77522--zsj--添加金额、日期的保存
          if ($('#isUpBudget')) {
            settingArgu.isUpBudget = isUpBudget;
          }
          if (page.planData.isSendDocNum == "是") {
            settingArgu.sendDocNum = sendDocNum;
          }
          if (page.planData.isFinancialBudget == "1") {
            settingArgu.bgItemIdMx = bgItemIdMx;
          }
settingArgu = $.extend(settingArgu, textList);
          var saveContentObj = {};
          saveContentObj = $.extend(page.contentObj, settingArgu);
          var saveObj = {
            prjGuid: '',
            agencyCode: page.agencyCode,
            userName: page.pfData.svUserName,
            userId: page.pfData.svUserId,
            rptType: "budgetDetails",
            prjName: sName,
            prjContent: JSON.stringify(saveContentObj)
          };
          ufma.post(tmpUrl, saveObj, function (result) {
            if (result.flag == "success") {
              ufma.showTip("保存成功", null, "success");
              $('.modal[id^="selfInputModal_"] .btn-cancel').trigger("click");
              page.doLoadAllRptCase();
            } else {
              ufma.showTip("保存失败!" + result.data, null, "error");
            }
          });
        });
      },
      doLoadAllRptCase: function () {
        var sUrl = _bgPub_requestUrlArray_report[2];
        var requestObj = {
          agencyCode: page.agencyCode,
          userName: page.pfData.svUserName,
          userId: page.pfData.svUserId,
          rptType: "budgetDetails"
        };
        ufma.post(sUrl, requestObj, function (result) {
          if (result.flag == "success") {
            $("#rptPlanList").empty();
            for (var i = 0; i < result.data.items.length; i++) {
              var tmpPrj = result.data.items[i];
              var caseFlagDiv = _bgPub_PNL_ReportFind_getFlagDiv(tmpPrj.prjGuid, tmpPrj.prjName, tmpPrj.prjContentOfString);
              $("#rptPlanList").append(caseFlagDiv);
            }
          }
        });
      },

      getModalSelectedResult: function () {
        var sSelectedType = "";
        var sSelectedCtrlPlanId = "";
        var aSelectedItems = [];
        var planData = page.getPlanItems();
        for (var i = 0; i < planData.length; i++) {
          var tmpItem = {
            chrId: '',
            eleCode: planData[i].itemField,
            eleName: planData[i].itemName,
            bgItemCode: planData[i].bgItemCode
          };
          aSelectedItems[aSelectedItems.length] = tmpItem;
        }
        return {
          "selectedType": "1",
          "selectedCtrlPlanId": "",
          "selectedItems": aSelectedItems
        };
      },
      getPlanItems: function () {
        var items = [];
        $("#planItemMore").find(".form-group").each(function () {
          var $div = $(this);
          var tmpEleCode = $div.attr("eleCode");
          var tmpEleName = $div.attr("eleName");
          var tmpItem = {};
          tmpItem.itemField = tmpEleCode;
          tmpItem.itemName = tmpEleName;
          tmpItem.bgItemCode = $div.attr("bgItemCode");
          tmpItem.itemValue = [];
          $div.find(".typeTree").each(function () {
            var tmpDt = $(this).getObj().getValue();
            if (tmpEleCode != 'ISUPBUDGET' && tmpEleCode != 'sendDocNum' && tmpEleCode != 'bgItemIdMx') {
              var getItemData = $('#cb' + tmpEleCode).getObj().getItem();
              if (!$.isNull(getItemData)) {
                var codeName = getItemData.codeName;
                var name = getItemData.name;
                var id = getItemData.id;
                tmpItem.itemValue = [{
                  "codeName": codeName,
                  "name": name,
                  "id": id
                }];
              } else {
                tmpItem.itemValue = [];
              }
            } else {
              tmpItem.itemValue = [];
            }
          });
          if (tmpItem.itemValue == false) { //修改要素值为空时,传参数需要加上itemNotNull
            tmpItem.itemNotNull = 1;
          }
          items.push(tmpItem);
        });
        return items;
      },
      //塞入辅助要素
      getBgPlanItemMap: function (planData) {
        if ($.isNull(planData)) return {};
        var searchMap = {
          'agencyCode': page.agencyCode
        };
        searchMap['setYear'] = planData.setYear;
        searchMap['bgPlanChrId'] = planData.chrId;
        for (var i = 0; i < planData.planVo_Items.length; i++) {
          var item = planData.planVo_Items[i];
          var cbItem = item.eleCode;
          var field = item.eleFieldName;
          //CWYXM-11697  预算方案中要素选择里，增加是否采购属性，启用之后，编制指标时可选是和否，不能输入其他值，采购模块选择指标时，根据这个属性过滤。--zsj
          /**ZJGA820-1550 因为指标ID是唯一的，所以指标编制模块需增加一指标ID查询条件。
          * 预算方案中启用了发文文号，指标的所有界面，需要有按发文文号查询的条件框；
          涉及到所有菜单的主界面，分解、调整、调剂的新增弹框类界面；
          指标的所有账表界面；
          */
          if (cbItem == 'ISUPBUDGET') {
            var combox = $('#isUpBudget').getObj();
            searchMap["isUpBudget"] = combox.getValue();
          }else if(cbItem == 'sendDocNum'){
            searchMap['sendDocNum'] = $('#sendDocNum').val();
          } else if(cbItem == 'bgItemIdMx'){
            searchMap['bgItemIdMx'] = $('#bgItemIdMx').val();
          }  else {
            var combox = $('#cb' + cbItem).getObj();
            searchMap[bg.shortLineToTF(field)] = combox.getValue();
          }
        };
        //CWYXM-18080 编制指标时需要增加文本说明项，只录入文本，用于描述指标信息--zsj--查询条件区域
        for (var k = 0; k < planData.planVo_Txts.length; k++) {
          var textCode = bg.shortLineToTF(planData.planVo_Txts[k].eleFieldName);
          searchMap[textCode] = $('#'+ textCode).val();
        }
        return searchMap;
      },
      //单据类型
      initBillType: function () {
        ufma.post('/bg/report/getSysModuleBillType?rgCode=' + page.rgCode + '&setYear=' + page.setYear + '&agencyCode=' + page.agencyCode, {}, function (result) {
          page.selectNodes = []
          page.selectNodes = result.data
          $('#targetState').ufmaTextboxlist({
            valueField: 'id',
            textField: 'name',
            name: "codeName",
            pId: "pId",
            leafRequire: true,
            data: result.data,
            expand: false,
            onchange: function (setting) {
            }
          });
        })
      },
      //单据状态
      changeBgPlan: function () {
        ufma.get('/ma/pub/enumerate/BG_QUERY_STATUS', {}, function (result) {
          $('#targetStatus').ufTreecombox({
            data: result.data,
            idField: 'ENU_CODE',
            textField: 'ENU_NAME',
            readonly: false,
            placeholder: "请选择单据状态",
            onChange: function () {
                //     billStatus = $('#targetStatus').getObj().getValue()
            }
          });
        })
      },
      //获取查询数据
      getSearchMap: function (planData) {
        var searchMap = page.getBgPlanItemMap(planData);
        searchMap['agencyCode'] = page.agencyCode;
        searchMap['bgPlanChrId'] = $("#cbBgPlan").getObj().getValue();
        searchMap['setYear'] = planData.setYear;
        var bgItemCode = $('#bgItemCode p').html() == '请选择指标编码' ? '' : $('#bgItemCode p').html();
        var bgItemCodeArr = [];
        var sysIdsArr = []
        var nodes = $('#targetState').ufmaTextboxlist().setting.tree.getCheckedNodes();
        var useNodes = []
        if (nodes.length != page.selectNodes.length) {
          for (var j = 0; j < nodes.length; j++) {
            var nodeOnj = {}
            if (nodes[j].check_Child_State == '-1' && nodes[j].isLeaf == '1') {
              if (nodes[j].pId == 'ALL' || nodes[j].pId == '0') {
                nodeOnj[nodes[j].id] = {
                  "value": nodes[j].id
                }
              } else {
                nodeOnj[nodes[j].pId] = {
                  "value": nodes[j].id
                }
              }
              useNodes.push(nodeOnj)
            }
          }
        } else {
          useNodes = []
        }
        for (var i = 0; i < useNodes.length; i++) {
          var sysIdsObj = {}
          sysIdsObj.sysId = Object.keys(useNodes[i])[0] == 'ALL' || Object.keys(useNodes[i])[0] == '0' ? Object.keys(useNodes[i])[0].value : Object.keys(useNodes[i])[0];
          sysIdsObj.busBillType = useNodes[i][sysIdsObj.sysId].value
          sysIdsArr.push(sysIdsObj)
        }
        searchMap['sysIds'] = sysIdsArr;
        searchMap['bgItemCode'] = bgItemCodeArr.push(bgItemCode);
        searchMap['billStatus'] = $('#targetStatus').getObj().getValue();
        searchMap['businessDateBegin'] = $('#startDate').getObj().getValue();
        searchMap['businessDateEnd'] = $('#endDate').getObj().getValue();
        return searchMap;
      },
      //加载表格
      initQueryTable: function () {
        if (oTable) {
          pageLength = ufma.dtPageLength('#queryTable');
          $('#queryTable').closest('.dataTables_wrapper').ufScrollBar('destroy');
          oTable.fnDestroy();
        }
        var tblId = 'queryTable';
        $("#" + tblId).html(''); //清空原有表格
        //ZWCW01036143 、ZWCW01036129：预算执行情况表、预算执行明细表增加记忆列功能--zsj
        var column = [{
          data: "rowno",
          title: "序号",
          className: "tc nowrap",
          width: "30px"
        }];
        var moneyArr = ['curAdd', 'curInTransit', 'curCut', 'curBalance','USE_CUR','TRANSIT_CUR','bgItemBalanceCur'];
        // 此处需要将方案里的要素添加至记忆列里
				if (page.planData && page.planData.planVo_Items.length > 0) {
          for (var i = 0; i < page.setMenberData.length; i++) {
            compireArr.push(page.setMenberData[i].data)
          }
					for (var m = 0; m < page.planData.planVo_Items.length; m++) {
            /**ZJGA820-1550 因为指标ID是唯一的，所以指标编制模块需增加一指标ID查询条件。
            * 预算方案中启用了发文文号，指标的所有界面，需要有按发文文号查询的条件框；
            涉及到所有菜单的主界面，分解、调整、调剂的新增弹框类界面；
            指标的所有账表界面；
            */
            if(page.planData.planVo_Items[m].eleCode != 'ISUPBUDGET' && page.planData.planVo_Items[m].eleCode != 'sendDocNum' && page.planData.planVo_Items[m].eleCode != 'bgItemIdMx'){
              var oneAssi = bg.shortLineToTF(page.planData.planVo_Items[m].eleFieldName);
              if ($.inArray(oneAssi,compireArr) == -1  && compireArr.length > 0) {
                var objAss = {
                  'title': page.planData.planVo_Items[m].eleName,
                  'data': oneAssi,
                  'visible':true,
                  'seq':parseInt(page.setMenberData.length + 1) 
                }
                page.setMenberData.push(objAss)
              }
              assiArr.push(oneAssi);
              assiEleCode.push(page.planData.planVo_Items[m].eleCode)
            }
					}
        }

        // 此处需要将方案里的要素添加至记忆列里
        if (page.planData && page.planData.planVo_Txts.length > 0) {
          for (var l = 0; l < page.setMenberData.length; l++) {
            compireTextArr.push(page.setMenberData[l].data)
          }
          for (var n = 0; n < page.planData.planVo_Txts.length; n++) {
          var oneText = bg.shortLineToTF(page.planData.planVo_Txts[n].eleFieldName);
          textCodeArr.push(page.planData.planVo_Txts[n].eleFieldName)
          if ($.inArray(oneText,compireTextArr) == -1  && compireTextArr.length > 0) {
            var objAss = {
              'title': page.planData.planVo_Txts[n].eleName,
              'data': oneText,
              'visible':true,
              'seq':parseInt(page.setMenberData.length + 1) 
            }
            page.setMenberData.push(objAss)
          }
          textArr.push(oneText);
          }
        }
        //ZJGA820-1788--指标登记簿的财政下达指标方案中发文文号没有变为财政指标id，其他模块在执行过脚本后变了--zsj
				if (page.setMenberData && page.setMenberData.length > 0) {
					for (var i = 0; i < page.setMenberData.length; i++) {
            compireMember.push(page.setMenberData[i].data)
            if(page.planData.isSendDocNum != "是" && page.setMenberData[i].data == 'sendDocNum') {
              page.setMenberData.splice(i,1)
            }
            if(page.planData.isFinancialBudget != "1" && page.setMenberData[i].data == 'bgItemIdMx') {
              page.setMenberData.splice(i,1)
            }
          }
        }
        if (page.setMenberData && page.setMenberData.length > 0) {
          for (var i = 0; i < page.setMenberData.length; i++) {
            var setData = page.setMenberData[i].data;
            if ($.inArray(setData, moneyArr) > -1) {
              column.push({
                data: setData,
                title: page.setMenberData[i].title,
                // width: 150,
                className: setData + " " + "isprint nowrap tr BGmoneyClass",
                render: $.fn.dataTable.render.number(',', '.', 2, '')
              })
            } else if (setData == 'BILL_CODE') {
              column.push({
                data: "BILL_CODE",
                title: "单据号",
                className: "isprint nowrap BGasscodeClass",
                // width: "150px",
                "render": function (data, type, rowdata, meta) {
                  var turnType = '';
                  if (rowdata.SYS_ID == 'GL') {
                      turnType = 'vouTurnType';
                  } else if (rowdata.SYS_ID == 'AR') { //报销
                      turnType = 'incomeArType';
                  } else if (rowdata.SYS_ID == 'UP') { //采购
                      turnType = 'upBillType';
                  } else if (rowdata.SYS_ID == 'CM') { //合同
                      turnType = 'cmBillType';
                  }
                  return '<a class="common-jump-link turnData" style="display:block;" href="javascript:;" data-turnTitle="' + rowdata.BILL_TYPE_NAME + '" title="' + data + '" data-billType="' + rowdata.BILL_TYPE + '" data-billStatus="' + rowdata.STATUS + '" data-billId="' + rowdata.BILL_ID + '" data-acctCode="' + rowdata.ACCT_CODE + '" data-turn="' + turnType + '">' + data + '</a>';
                }
              })
            } else if (setData == "isUpBudget") {
              column.push({
                data: "isUpBudget",
                title: "是否采购",
                className: "isUpBudget isprint nowrap tc",
                // width: "120px"
              });
            } else if ($.inArray(setData, assiArr) > -1 && setData != "isUpBudget" && setData != "bgItemIdMx" && setData != "sendDocNum") {
              column.push({
                data: setData,
                title: page.setMenberData[i].title,
                // width: 200,
                className: setData + " " + "isprint nowrap BGThirtyLen",
                "render": function (data) {
                  //bug75659--需要选项控制，项目、支出功能分类等可以隐藏编码，只显示名称--zsj
                  if (!$.isNull(data)) {
                    var showData = [];
                    if (page.showTrue == false) {
                      showData = data.split(' ');
                      return '<code title="' + data + '" style="overflow: hidden;text-overflow: ellipsis;white-space: nowrap;display:inline-block;width:150px" title="' + showData[1] + '">' + showData[1] + '</code>';
                    } else {
                      return '<code title="' + data + '" title="' + data + '" style="overflow: hidden;text-overflow: ellipsis;white-space: nowrap;display:inline-block;width:150px">' + data + '</code>';
                    }
                  } else {
                    return '';
                  }
                }
              })
            } else if ($.inArray(setData, textArr) > -1) {
							column.push({
								data: setData,
								title: page.setMenberData[i].title,
								// width: 200,
								className: setData + " " + "isprint nowrap BGThirtyLen",
								"render": function (data) {
                  if (!$.isNull(data)) {
                    return '<code title="' + data + '">' + data + '</code>';
                  } else {
                    return '';
                  }
								}
							})
            } else if ((page.setMenberData[i].data == "sendDocNum" || $.inArray('sendDocNum',compireMember) == -1) && page.planData.isSendDocNum == "是") {//ZJGA820-1788--指标登记簿的财政下达指标方案中发文文号没有变为财政指标id，其他模块在执行过脚本后变了--zsj
              column.push({
                data: "sendDocNum",
                title: page.sendCloName,
                // width: 200,
                className: "sendDocNum isprint nowrap BGThirtyLen",
                "render": function (data, type, rowdata, meta) {
                  if (!$.isNull(data)) {
                    return '<code title="' + data + '" style="overflow: hidden;text-overflow: ellipsis;white-space: nowrap;display:inline-block;width:150px">' + data + '</code>';
                  } else {
                    return '';
                  }
                }
              })
            } else if ((page.setMenberData[i].data == "bgItemIdMx" || $.inArray('bgItemIdMx',compireMember) == -1) && page.planData.isFinancialBudget == "1") {//ZJGA820-1788--指标登记簿的财政下达指标方案中发文文号没有变为财政指标id，其他模块在执行过脚本后变了--zsj
              column.push({
                data: 'bgItemIdMx',
                title: '财政指标ID',
                className: 'bgItemIdMx isprint nowrap BGThirtyLen',
                // width: 220,
                "render": function (data) {
                  if (!$.isNull(data)) {
                    return '<code title="' + data + '">' + data + '</code>';
                  } else {
                    return '';
                  }
                }
              });
						} else if ($.inArray(setData, assiArr) == -1 && setData != "isUpBudget" && setData != "bgItemIdMx" && setData != "sendDocNum" && $.inArray(setData, textArr) == -1){  //ZJGA820-1788--指标登记簿的财政下达指标方案中发文文号没有变为财政指标id，其他模块在执行过脚本后变了--zsj
              column.push({
                data: setData,
                title: page.setMenberData[i].title,
                // width: 200,
                className: setData + " " + "isprint nowrap BGThirtyLen",
                "render": function (data, type, rowdata, meta) {
                  if (!$.isNull(data)) {
                    return '<code title="' + data + '" style="overflow: hidden;text-overflow: ellipsis;white-space: nowrap;display:inline-block;width:150px">' + data + '</code>';
                  } else {
                    return '';
                  }
                }
              })
            }
          }
        } else {
            column.push({
              data: "bgItemCode",
              title: "指标编码",
              className: "BG_ITEM_CODE isprint nowrap BGasscodeClass",
              // width: "120px",
              "render": function (data) {
                if (!$.isNull(data)) {
                  return '<code title="' + data + '">' + data + '</code>';
                } else {
                  return '';
                }
              }
            });
            if (typeof page.planData == "object") {
              if (page.planData.isComeDocNum == "是") {
                column.push({
                  data: "comeDocNum",
                  title: "来文文号",
                  className: "comeDocNum isprint nowrap BGThirtyLen",
                  // width: "200px",
                  "render": function (data) {
                    if (!$.isNull(data)) {
                      return '<code title="' + data + '">' + data + '</code>';
                    } else {
                      return '';
                    }
                  }
                });
              }
              if (page.planData.isSendDocNum == "是") {
                column.push({
                  data: "sendDocNum",
                  title: page.sendCloName,
                  className: "sendDocNum isprint nowrap BGThirtyLen",
                  // width: "200px",
                  "render": function (data) {
                    if (!$.isNull(data)) {
                      return '<code title="' + data + '">' + data + '</code>';
                    } else {
                      return '';
                    }
                  }
                });
              }
              if (page.planData.isFinancialBudget == "1") {
                column.push({
                  data: "bgItemIdMx",
                  title: '财政指标ID' ,
                  className: "bgItemIdMx isprint nowrap BGThirtyLen",
                  // width: "200px",
                  "render": function (data) {
                    if (!$.isNull(data)) {
                      return '<code title="' + data + '">' + data + '</code>';
                    } else {
                      return '';
                    }
                  }
                });
              }
            }
            if (!$.isNull(page.planData)) {
              //获取辅助核算项
              //  curBgPlanEleMsg = _BgPub_GetBgPlanEle(page.planData);
              for (var index = page.planData.planVo_Items.length - 1; index >= 0; index--) {
                if (page.planData.planVo_Items[index].bgItemCode == "ISUPBUDGET") {
                  column.push({
                    data: "isUpBudget",
                    title: "是否采购",
                    className: "isUpBudget isprint nowrap tc",
                    // width: "120px"
                  });
                } else if(page.planData.planVo_Items[index].bgItemCode  != "sendDocNum" && page.planData.planVo_Items[index].bgItemCode  != "bgItemIdMx"){
                  // var cbData = curBgPlanEleMsg.eleFieldName[index].toUpperCase();
                  var cbData = bg.shortLineToTF(page.planData.planVo_Items[index].bgItemCode);
                  column.push({
                    data: cbData,
                    title: page.planData.planVo_Items[index].eleName,
                    className: cbData + " " + "tl isprint nowrap BGThirtyLen",
                    // width: '200px',
                    "render": function (data) {
                      //bug75659--需要选项控制，项目、支出功能分类等可以隐藏编码，只显示名称--zsj
                      if (!$.isNull(data)) {
                        var showData = [];
                        if (page.showTrue == false) {
                          showData = data.split(' ');
                          return '<code title="' + showData[1] + '">' + showData[1] + '</code>';
                        } else {
                          return '<code title="' + data + '">' + data + '</code>';
                        }
                      } else {
                        return '';
                      }
                    }
                  });
                }
            }
            //CWYXM-18080 编制指标时需要增加文本说明项，只录入文本，用于描述指标信息--zsj
            for (var k = 0; k < page.planData.planVo_Txts.length; k++) {
              var textCode = page.planData.planVo_Txts[k].eleFieldName
              column.push({
                data: bg.shortLineToTF(textCode),
                title: page.planData.planVo_Txts[k].eleName,
                className: textCode + ' ' + 'nowrap isprint BGThirtyLen',
                headalign: 'center',
                align: 'left',
                // width: 220,
                "render": function (data) {
                  if (!$.isNull(data)) {
                    return '<code title="' + data + '">' + data + '</code>';
                  } else {
                    return '';
                  }
                }
              });
            }
            }
            column.push({
              data: "SYS_NAME",
              title: "来源系统",
              className: "SYS_NAME isprint nowrap BGTenLen",
              // width: "90px",
              "render": function (data) {
                if (!$.isNull(data)) {
                  return '<code title="' + data + '">' + data + '</code>';
                } else {
                  return '';
                }
              }
            }, {
              data: "BILL_DATE",
              title: "单据日期",
              className: "BILL_DATE isprint nowrap BGdateClass tc",
              // width: "150px"
            }, {
              data: "BILL_TYPE_NAME",
              title: "单据类型",
              className: "BILL_TYPE_NAME isprint nowrap BGTenLen",
              // width: "150px",
              "render": function (data) {
                if (!$.isNull(data)) {
                  return '<code title="' + data + '">' + data + '</code>';
                } else {
                  return '';
                }
              }
            }, {
              data: "BILL_CODE",
              title: "单据号",
              className: "BILL_CODE isprint nowrap BGasscodeClass",
              // width: "150px",
              "render": function (data, type, rowdata, meta) {
                var turnType = '';
                if (rowdata.SYS_ID == 'GL') {
                  turnType = 'vouTurnType';
                } else if (rowdata.SYS_ID == 'AR') { //报销
                  turnType = 'incomeArType';
                } else if (rowdata.SYS_ID == 'UP') { //采购
                  turnType = 'upBillType';
                } else if (rowdata.SYS_ID == 'CM') { //合同
                  turnType = 'cmBillType';
                }
                return '<a class="common-jump-link turnData" style="display:block;" href="javascript:;" data-turnTitle="' + rowdata.BILL_TYPE_NAME + '" title="' + data + '" data-billType="' + rowdata.BILL_TYPE + '" data-billStatus="' + rowdata.STATUS + '" data-billId="' + rowdata.BILL_ID + '" data-acctCode="' + rowdata.ACCT_CODE + '" data-turn="' + turnType + '">' + data + '</a>';
              }
            }, { //CWYXM-10738 --预算执行明细表，单据摘要及指标摘要，建议限制最大宽度--zsj
              data: "BILL_SUMMARY",
              title: "单据摘要",
              className: "BILL_SUMMARY isprint nowrap BGThirtyLen",
              // width: "200px",
              "render": function (data) {
                if (!$.isNull(data)) {
                  return '<code title="' + data + '">' + data + '</code>';
                } else {
                  return '';
                }
              }
            }, { //CWYXM-10738 --预算执行明细表，单据摘要及指标摘要，建议限制最大宽度--zsj
              data: "BILL_STATUS",
              title: "单据状态",
              className: "BILL_STATUS isprint nowrap BGstatusClass tc",
              // width: "150px",
              "render": function (data) {
                if (!$.isNull(data)) {
                  return '<code title="' + data + '">' + data + '</code>';
                } else {
                  return '';
                }
              }
            }, {
              data: "IS_BACK",
              title: "是否退回",
              className: "IS_BACK  isprint nowrap tc",
              // width: "150px",
            }, {
              data: "LAST_DAYS",
              title: "天数",
              className: "LAST_DAYS  isprint  nowrap BGstatusClass",
              // width: "150px",
            }, {
              data: "USE_CUR",
              title: "执行金额",
              className: "USE_CUR bgPubMoneyCol isprint tdNum nowrap BGmoneyClass tr",
              // width: "150px",
              render: $.fn.dataTable.render.number(',', '.', 2, '')
            }, {
              data: "TRANSIT_CUR",
              title: "在途金额",
              className: "TRANSIT_CUR bgPubMoneyCol isprint tdNum nowrap BGmoneyClass tr",
              // width: "150px",
              render: $.fn.dataTable.render.number(',', '.', 2, '')
            }, {
              data: "bgItemBalanceCur",
              title: "指标余额",
              className: "bgItemBalanceCur bgPubMoneyCol isprint tdNum nowrap BGmoneyClass tr",
              // width: "150px",
              render: $.fn.dataTable.render.number(',', '.', 2, '')
            });
        }
        var opts = {
          "language": {
              "url": bootPath + "agla-trd/datatables/datatable.default.js"
          },
          "bFilter": true,
          "bAutoWidth": false,
          "bDestory": true,
          "processing": true, //显示正在加载中
          "pagingType": "full_numbers", //分页样式
          "lengthChange": true, //是否允许用户自定义显示数量p
          "lengthMenu": [
              [10, 20, 50, 100, 200, -1],
              [10, 20, 50, 100, 200, "全部"]
          ],
          "serverSide": false,
          "ordering": false,
          "pageLength": pageLength,
          "columns": column,
          //填充表格数据
          data: [],
          "dom": '<"datatable-toolbar"B>rt<"' + tblId + '-paginate"ilp>',
          buttons: [{
            extend: 'print',
            text: '<i class="glyphicon icon-print" aria-hidden="true"></i>',
            exportOptions: {
              columns: '.isprint'
            },
            customize: function (win) {
              $(win.document.body).find('h1').css("text-align", "center");
              $(win.document.body).css("height", "auto");
            }
          },
          {
            extend: 'excelHtml5',
            text: '<i class="glyphicon icon-upload" aria-hidden="true"></i>',
            exportOptions: {
              modifier: {
                page: 'current'
              }
            },
            customize: function (xlsx) {
              var sheet = xlsx.xl.worksheets['sheet1.xml'];
            }
          }
          ],
          initComplete: function (settings, json) {
            $('.datatable-toolbar').appendTo('#dtToolbar');
            var toolBar = $(this).attr('tool-bar')
            var $info = $(toolBar + ' .info');
            if ($info.length == 0) {
              //$('#tableTotalShow').appendTo($(toolBar + ' .tool-bar-body'));
              $info = $('<div class="info"></div>').appendTo($(toolBar + ' .tool-bar-body'));
            }
            $info.html('');
            $('.' + tblId + '-paginate').appendTo($info);

            $("#dtToolbar .buttons-print").css("border-radius", "4px 0 0 4px").addClass("btn-print btn-permission").attr({
              "data-toggle": "tooltip",
              "title": "打印"
            });
            $("#dtToolbar .buttons-excel").css("border-radius", "0 4px 4px 0").addClass("btn-export btn-permission").attr({
              "data-toggle": "tooltip",
              "title": "导出"
            });
            //导出begin
            $("#dtToolbar .buttons-excel").off().on('click', function (evt) {
              evt = evt || window.event;
              evt.preventDefault();
              uf.expTable({
                title: '预算执行明细表',
                exportTable: '#queryTable'
              });
            });
            //导出end	
            $('#dtToolbar [data-toggle="tooltip"]').tooltip();

            /*page.headArr = page.tableHeader('queryTable');
            page.setVisibleCol();*/
            page.headArr = [];
            if (page.setShow == true && page.chooseFlag == true) {
              oTable.fnClearTable();
              if (page.tableAllData.length > 0) {
                oTable.fnAddData(page.tableAllData, true);
              }
            } else {
              page.setShowColumn();
            }
            if (page.setMenberData && page.setMenberData.length > 0) {
              page.headArr = page.setMenberData;
              iValue = 0;
            } else {
              page.headArr = page.tableHeader('queryTable');
              iValue = 1;
            }
            page.setVisibleCol();
            ufma.setBarPos($(window));
            ufma.isShow(reslist);
          },
          drawCallback: function (settings) {
            ufma.setBarPos($(window));
            $('#queryTable').find("td.dataTables_empty").text("")
                .append('<img src="' + bootPath + 'images/noData.png"/><br/><i>目前还没有你要查询的数据</i>');
            var wrapperWidth = $('#queryTable_wrapper').width();
            var tableWidth = $('#queryTable').width();
            if (tableWidth > wrapperWidth) {
              //$('#queryTable').closest('.dataTables_wrapper').ufScrollBar('destroy');
              // $('#queryTable').closest('.dataTables_wrapper').ufScrollBar({
              //     hScrollbar: true,
              //     mousewheel: false
              // });
              $('.dataTables_wrapper.no-footer .dataTables_scrollBody').css("border-bottom", "1px solid transparent")
            } else {
              // $('#queryTable').closest('.dataTables_wrapper').ufScrollBar('destroy');
              $('.dataTables_wrapper.no-footer .dataTables_scrollBody').css("border-bottom", "1px solid transparent")
            }
             $('#queryTable').closest('.dataTables_wrapper').ufScrollBar({
                   hScrollbar: true,
                 mousewheel: false
             });
            ufma.isShow(reslist);
            // CWYXM-18872 --指标明细账,点击更多后界面乱了,具体见截图--zsj
            setTimeout(function(){
              $('#tool-bar').css('top',$('.workspace-top').height()+$('.workspace-center').height() + 2 + 'px')
            },100)
          },
          fnCreatedRow: function (nRow, aData, iDataIndex) {
            $('td:eq(0)', nRow).html(iDataIndex + 1);
          }
        }
        oTable = $("#" + tblId).dataTable(opts); //用于存储dataTable返回的信息
          //实现双表头
          //_bgPub_SpanDataTableHeadCell(tblId);
      },
      //ZWCW01036143 、ZWCW01036129：预算执行情况表、预算执行明细表增加记忆列功能--zsj
      setAssistGroupControl: function () {
        if ($('#colListTable thead tr th.btnGroup').length == 0) {
          $('#colListTable thead tr').append('<th class="nowrap btnGroup hide" style="width:50px;min-width:50px;text-align:center;">操作</th>');
        }
        $('#colListTable tbody tr').each(function () {
          var $tr = $(this);
          if ($tr.find('td.btnGroup').length == 0) {
            $tr.append('<td class="nowrap btnGroup">' +
                '<a class="btn btn-icon-only btn-sm btnDrag" data-toggle="tooltip" title="拖动排序"><span class="glyphicon icon-drag"></span></a>' +
                '</td>');
            $tr.find('td.btnGroup .btn[data-toggle="tooltip"]').tooltip();
          }
        });
      },
      //ZWCW01036143 、ZWCW01036129：预算执行情况表、预算执行明细表增加记忆列功能--zsj
      adjAssitNo: function () {
        var idx = 0;
        $('#colListTable tbody tr').each(function () {
          idx = idx + 1;
          $(this).find('.recNoTd').html(idx);
          $(this).find('.recNoTd').attr('title', idx);
        });
      },
      //ZWCW01036143 、ZWCW01036129：预算执行情况表、预算执行明细表增加记忆列功能--zsj
      tableHeader: function (tblId) {
        var columns = oTable.fnSettings().aoColumns;
        var visible = oTable.api(true).columns().visible(); //每列元素的隐藏/显示属性组
        var arr = []; //存储当前表格的表头信息
        for (var i = 0; i < visible.length; i++) {
          var obj = {};
          obj.title = columns[i].sTitle; //列名
          obj.index = i; //列的索引
          obj.data = columns[i].data;
          obj.visible = visible[i]; //列的隐藏/显示属性
          arr.push(obj);
        }
        return arr;
      },
      //ZWCW01036143 、ZWCW01036129：预算执行情况表、预算执行明细表增加记忆列功能--zsj
			setVisibleCol: function () {
				$('#colListTable').html('');
				var nowHead = page.headArr;
				var changeHead = [];
				var html = "";
				var $table = $('#colListTable');
				var recNo = 0;
        var head = '<thead><tr>'+
        '<th style="width: 30px;min-width: 30px;" class="hide">序号</th>'+
        '<th style="width: 30px;min-width: 30px;" class="hide">'+
          '<label class="mt-checkbox mt-checkbox-outline margin-right-8">'+
            '<input class="checkAll" type="checkbox" name="" id="">'+
            '<span></span>'+
          '</label>'+
        '</th>'+
        '<th style="width: 50px;min-width: 50px;" class="hide">列名</th>'+
        '</tr></thead><tbody>';
        $(head).appendTo($table);
				for (var i = iValue; i < nowHead.length; i++) {
					changeHead.push(nowHead[i]);
					//新增时，自动往后加
					recNo = i;
					var row = '<tr>' +
						'<td class="recNoTd hide" title="' + recNo + '">' + recNo +
						'</td>' +
						'<td class="checkLab">' +
						'<label class="mt-checkbox mt-checkbox-outline margin-right-8">' +
						' <input type="checkbox"> ' +
						' <span style="margin-top: 6px;"></span>' +
						' </label>' +
						'</td>' +
						'<td class="treeClick commonShowPan" columnData="' + nowHead[i].data + '" title="' + nowHead[i].title + '">' + nowHead[i].title +
						'</td>' +
						'</tr>';
           $(row).appendTo($table);
					page.setAssistGroupControl();
        }
        var body = '</tbody>';
        $(body).appendTo($table);
				$("#colList").html($table);
				page.changeCol = changeHead;
			},
      //获取表格数据
      showTblData: function (tblDt) {
        var surl = "/bg/report/getBillListFromBusinessModule?rgCode=" + page.rgCode + "&setYear=" + page.setYear + "&agencyCode=" + page.agencyCode;
        var argu = page.getSearchMap(page.planData);
        if ($('#bgItemCode p').html() == '请选择指标编码') {
          argu.bgItemCode = [];
        } else {
          argu.bgItemCode = page.bgItemCode;
        }
        if (!$.isNull(argu.bgPlanChrId)) {
          ufma.showloading('数据加载中，请耐心等待...');
          ufma.post(surl,
            $.extend({}, bgItemDefaults, argu),
            function (result) {
              ufma.hideloading();
              if (result.flag === "success") {
                tblDt = result.data
              } else {
                ufma.hideloading();
                ufma.showTip(result.msg, null, "error");
              }
              oTable.fnClearTable();
              if (result.data.length != 0) {
                oTable.fnAddData(result.data, true);
                page.tableAllData = result.data;
              }
              //模拟滚动条
              $('#queryTable').closest('.dataTables_wrapper').ufScrollBar({
                hScrollbar: true,
                mousewheel: false
              });
              ufma.setBarPos($(window));
          });
          //page.initQueryTable();
        } else {
          ufma.showTip('请先选择预算方案', function () {}, 'warning');
          return false;
        }
      },
      //凭证权限--联查凭证--CWYXM-4393--从预算执行明细表跳入凭证录入--zsj
      saveruieId: function (url) {
        if (typeof hex_md5 === "function" && ufma.getCommonData().svUserCode != null) {
          if (url.indexOf('?') > 0) {
            url = url + "&rueicode=" + hex_md5(ufma.getCommonData().svUserCode)
          } else {
            url = url + "?rueicode=" + hex_md5(ufma.getCommonData().svUserCode)
          }
        }
        return url
      },
      showPlan: function(argu) {
        function buildPlanItem(data) {
          for(var i = 0; i < data.length; i++) {
            var liHtml = ufma.htmFormat('<li data-agency="<%=agency%>" data-code="<%=code%>" data-scope="<%=scope%>" data-name="<%=name%>"><%=name%><b class="btn-close glyphicon icon-close"></b></li>', {
              code: data[i].prjGuid,
              name: data[i].prjName,
              scope: data[i].prjScope,
              agency: data[i].agencyCode
            });
            var $li = $(liHtml);
            $.data($li[0], 'planData', data[i]);
            $li[data[i].prjCode == dm.curPlan.prjCode ? 'addClass' : 'removeClass']('selected').appendTo("#rptPlanList ul");
          }
        }
        $("#rptPlanList").html('<ul class="uf-tip-menu"></ul>');
        page.getPlan(argu, buildPlanItem);

        $("#rptPlanList").off().on('click', 'li', function(e) {
          if($(e.target).is('.btn-close')) {
            var _li = $(this).closest('li');
            var planCode = _li.attr('data-code');
            var planName = _li.attr('data-name');
            var agencyCode = _li.attr('data-agency');
            page.delPlan(agencyCode, planCode, planName, argu, function(action) {
              if(action) {
                _li.remove();
                $("#rptPlanList").ufTooltip('hide');
              }
            });
          } else {
            $("#rptPlanList").ufTooltip('hide');
            // if($(this).hasClass('selected')) return false;
            $(this).siblings('.selected').removeClass('selected');
            $(this).addClass('selected');
            var planCode = $(this).attr('data-code');
            page.selectPlan($(this));
            if($('.label-more span').text() == '更多') {
              //$('.label-more span').text('收起')
              $('.label-more span').trigger("click");
            }
          }
        });
      },
      selectPlan: function(ths) {
        var tmpDataObj = $.data($(ths)[0], 'planData');
        var tmpDataArr = JSON.parse(tmpDataObj.prjContentOfString);
        var assiData = tmpDataArr.selectedItems;
        $('#cbBgPlan').getObj().val(tmpDataArr.planChrId)
        if(!$.isNull(tmpDataArr.bgItemCode)) {
          $('#bgItemCode p').html(tmpDataArr.bgItemCode);
          $('#bgItemCode p').css('color', '#333');
          $('.clearBill').css("margin-top", "-28px");
          $('.btnSetAccItem').css({
            "margin-top": "-35px",
            "margin-right": "-48px"
          });
        } else {
          $('#bgItemCode p').html('请选择指标编码');
          $('#bgItemCode p').css('color', '#d9d9d9');
          $('.btnSetAccItem').css({
            "margin-top": "-35px",
            "margin-right": "-49px"
          });
          $('.clearBill').css("margin-top", "-8px");
        }
        setTimeout(function() {
          $('#planItemMore').find('.form-group').each(function() {
            var code = $(this).attr('eleCode');
            if(code == 'ISUPBUDGET') {
              $('#isUpBudget').getObj().val(tmpDataArr.isUpBudget);
            } else if(code == 'sendDocNum') {
              $('#sendDocNum').val(tmpDataArr.sendDocNum);
            } else  if(code == 'bgItemIdMx') {
              $('#bgItemIdMx').val(tmpDataArr.bgItemIdMx);
            } else {
              for(var z = 0; z < assiData.length; z++) {
                if(assiData[z].eleCode == code && assiData[z].eleCode != 'ISUPBUDGET' && assiData[z].eleCode != 'bgItemIdMx' && assiData[z].eleCode != 'sendDocNum'){
                  if($.inArray(assiData[z].eleCode,assiEleCode) > -1) {
                    var valueItem = assiData[z].itemValue;
                    if(valueItem && valueItem.length > 0) {
                      $('#cb' + code).getObj().val(assiData[z].itemValue[0].id);
                    }
                  } else if($.inArray(assiData[z].eleCode,textCodeArr) > -1) {
                    var codeText = bg.shortLineToTF(code)
                    $('#' + codeText).val(tmpDataArr[codeText]);
                  }
                }
              }
            }
          });
        }, 2000)
      },
      delPlan: function(agencyCode, planCode, planName, _callback) {
        ufma.confirm('您确定要删除查询方案' + planName + '吗?', function(action) {
          if(action) {
            var argu = {
              "agencyCode": agencyCode,
              "prjGuid": planCode,
              "userId": page.pfData.svUserId //修改权限  将svUserCode改为 svUserId  20181012
            };
            dm.doPost('delPlan', argu, function(result) {
              ufma.showTip("方案删除成功！", function() {}, "success");
              _callback(true);
            });
          }
        }, {
          type: 'warning'
        });
      },
      getPlan: function(argu, _callback) {
        dm.doPost('getPlan', argu, function(result) {
          _callback(result.data.items);
        });
      },
      onEventListener: function () {
        $('#bgItemCode').find('.clearBill').on('click', function () {
          $('#bgItemCode p').html('请选择指标编码');
          if ($('#bgItemCode p').html() == '请选择指标编码') {
            $('#bgItemCode p').css('color', '#d9d9d9');
          } else {
            $('#bgItemCode p').css('color', '#333');
          }
          $('.clearBill').css("margin-top", "-29px");
          $('.btnSetAccItem').css({
            "margin-top": "-35px",
            "margin-right": "-49px"
          });
        });
        //选择指标编码弹窗
        $('#bgItemCode').find('.btnSetAccItem').on('click', function () {
          //设置关联辅助项
          var openData = {};
          openData.agencyCode = page.agencyCode;
          openData.setYear = page.setYear;
          openData.rgCode = page.rgCode;
          openData.planChrId = $("#cbBgPlan").getObj().getValue()
          ufma.open({
            url: 'chooseCode.html',
            title: '预算执行明细表编码选择',
            width: 1000,
            height: 500,
            data: openData,
            ondestory: function (result) {
              if (result) {
                if (result.action == 'save') {
                  $('#bgItemCode p').html('');
                  page.bgItemCode = result.data.tableData;
                  var str = '';
                  if (page.bgItemCode.length > 0) {
                    for (var i = 0; i < page.bgItemCode.length; i++) {
                      str = page.bgItemCode.join(',');
                    }
                  }
                  $('#bgItemCode p').html(str);
                  $('#bgItemCode p').attr('title', str);
                  $('#bgItemCode p').css('color', '#333');
                  //注释弹窗勾选已选单据--zsj
                  //$('#bgItemCode p').attr('all-data',data.data.openArgu);
                  $('.clearBill').css("margin-top", "-29px");
                  var oldPlanId = $("#cbBgPlan").getObj().getValue();
                  if (!$.isNull(result.data.openChrId) && result.data.openChrId != oldPlanId) {
                    $('#cbBgPlan').getObj().val(result.data.openChrId);
                  }
                  if (!$.isNull(str)) {
                    $('#bgItemCode p').html(str);
                    $('#bgItemCode p').css('color', '#333');
                  } else {
                    $('.clearBill').css("margin-top", "-29px");
                    $('#bgItemCode p').html('请选择指标编码');
                    $('#bgItemCode p').css('color', '#d9d9d9');
                  }
                } else {
                  $('.clearBill').css("margin-top", "-29px");
                  $('#bgItemCode p').html('请选择指标编码');
                  $('#bgItemCode p').css('color', '#d9d9d9');
                }
              }
            }
          });
        });
        //更多
        $('.btn-more-item').click(function () {
          if ($('.label-more span').text() == '更多') {
            $('.label-more span').text('收起')
            // $('#tool-bar').css('top',$('.workspace-top').height()+$('.workspace-center').height() + 20)
          } else {
            $('.label-more span').text('更多')
            // $('#tool-bar').css('top', $('#tool-bar').offset().top-$('#queryMore').height() - 50)
          }
          // CWYXM-18872 --指标明细账,点击更多后界面乱了,具体见截图--zsj
          setTimeout(function(){
            $('#tool-bar').css('top',$('.workspace-top').height()+$('.workspace-center').height() + 2 + 'px')
          },100)
        //  ufma.setBarPos($(window));
        });
        //bug75659--【财务云8.0 农业部】需要选项控制，项目、支出功能分类等可以隐藏编码，只显示名称--zsj
        $('#showTrue').on('click', function () {
          $('#showTrue').attr('checked', true);
          $('#showFalse').removeAttr('checked');
          page.showTrue = true;
          page.showTblData();
        });
        //bug75659--【财务云8.0 农业部】需要选项控制，项目、支出功能分类等可以隐藏编码，只显示名称--zsj
        $('#showFalse').on('click', function () {
          $('#showFalse').attr('checked', true);
          $('#showTrue').removeAttr('checked');
          page.showTrue = false;
          page.showTblData();
        });

        //查询
        $('#btnQry').click(function () {
          page.showTblData();
        });
        //搜索框
        ufma.searchHideShow($('#queryTable'));
        //显示/隐藏列隐藏框--CWYXM-10173---可以设置表格区哪些列可以展示，哪些列不展示，同时实现列排序和记忆功能--zsj
        $("#colAction").on("click", function () {
          //if(page.chooseFlag == false) {
          page.setVisibleCol();
          var trLeng = $("#colListTable tbody tr").find('td.checkLab input').length;
          $("#colListTable tbody tr").find('td.checkLab input').each(function (i) {
            if (i < trLeng) {
              $(this).prop("checked", page.changeCol[i].visible);
            }
          });
          $("div.rpt-funnelBox").hide();
          $(this).next("div.rpt-funnelBox").show();
        });

        //确认添加列--CWYXM-10173---可以设置表格区哪些列可以展示，哪些列不展示，同时实现列排序和记忆功能--zsj
        $("#addCol").on("click", function () {
          page.chooseFlag = true;
          page.configKey = '';
          page.configValue = '';
          var conValue = [];
          var cbBgPlanId = $('#cbBgPlan').getObj().getValue();
          var cbBgPlanText = $('#cbBgPlan').getObj().getText();
          page.configKey = cbBgPlanId + ',' + cbBgPlanText;
          $("#colListTable tbody tr").each(function (i) {
            var tdSort = {};
            tdSort.title = $(this).closest('tr').find("td.treeClick").attr('title');
            tdSort.data = $(this).closest('tr').find("td.treeClick").attr('columnData');
            tdSort.seq = $(this).closest('tr').find("td.recNoTd").attr('title');
            if ($(this).find("td.checkLab input").is(":checked")) {
              tdSort.visible = true;
            } else {
              tdSort.visible = false;
            }
            conValue.push(tdSort);
          });
          var str = JSON.stringify(conValue);
          var newStr = str.replace(/\"/g, "'");
          page.configValue = newStr;
          ufma.showloading('数据加载中 ，请耐心等待...');
          page.updateSessionTable();
        });
        //鼠标移入移除时显示及隐藏--CWYXM-10173---可以设置表格区哪些列可以展示，哪些列不展示，同时实现列排序和记忆功能--zsj
        $(document).on("mouseenter", "div.rpt-funnelBox", function () {
          $(this).show();
          $("#colListTable tr").find('td.btnGroup .btnDrag').on('mousedown', function (e) {
            $(this).closest('tr').addClass('selectTr').siblings().removeClass('selectTr');
            //拖动时选中当前数据，并且拖动操作时滚动条跟随
            var callBack = function () {
              page.adjAssitNo();
            }
            $('#colListTable').mangerTableSort(callBack);
          });
        }).on("mouseleave", "div.rpt-funnelBox", function () {
          $(this).hide();
        });
        //切换样式
        $('#btnSwitch').ufTooltip({
          className: 'p0',
          trigger: 'click', //click|hover
          opacity: 1,
          confirm: false,
          gravity: 'north', //north|south|west|east
          content: "#rptTableList"
        });
        //联查凭证--CWYXM-4393--从预算执行明细表跳入凭证录入--zsj
        $('#queryTable').on('click', '.common-jump-link', function (e) {
          e.preventDefault();
          page.bgItemCode = [];
          page.tableAcctCode = $(e.target).attr('data-acctCode');
          page.tableBillId = $(e.target).attr('data-billId');
          page.tableType = $(e.target).attr('data-billType');
          page.tableStatus = $(e.target).attr('data-billStatus');
          page.turnType = $(e.target).attr('data-turn');
          page.turnTitle = $(e.target).attr('data-turnTitle');
          ufma.removeCache("cacheData");
          //缓存数据
          var cacheData = {};
          cacheData.agencyCode = page.agencyCode;
          cacheData.acctCode = page.tableAcctCode;
          cacheData.setYear = page.setYear;
          cacheData.rgCode = page.rgCode;
          ufma.setObjectCache("cacheData", cacheData);
          var urlHost = window.location.host;
          var urlProtocol = window.location.protocol;
          var urlHead = urlProtocol + "//" + urlHost;
          var _this = $(this);
          if (page.turnType == 'vouTurnType') {
            var vouGuid = page.tableBillId;
            //CWYXM-7646--跳转问题修改--zsj
            ufma.ajaxDef('/gl/vou/getVou/' + vouGuid, 'get', '', function (result) {
              if (result.data != null) {
                var baseUrl = '/pf/gl/vou/index.html?menuid=f24c3333-9799-439a-94c9-f0cdf120305d&dataFrom=budgetDetails&action=query&vouGuid=' + vouGuid + '&agencyCode=' + page.agencyCode + '&acctCode=' + page.tableAcctCode;
                //	window.parent.openNewMenu(_this);
                uf.openNewPage(page.isCrossDomain, $(this), 'openMenu', baseUrl, false, "凭证录入");
              } else {
                ufma.showTip('该凭证已在其他页面删除，请刷新页面', function () {}, "warning");
              }
            }); 
          } else if (page.turnType == 'incomeArType') { //报销
            var id = page.tableBillId;
            var uid = "type=otherModelShow" + "&billId=" + id + "&menuid=" + '140101001001' + "&coCode=" + page.agencyCode; //报销添加单位
            var url = '/A/ar/resources/myArBillEdit?' + uid;
            uf.openNewPage(page.isCrossDomain, $(this), 'openMenu', url, false, page.turnTitle);
          } else if (page.turnType == 'cmBillType') { //合同
            var id = page.tableBillId;
            var url = '/pf/pvdf/index.html#/bd/openPage?productCode=CM&type=select&billTabUuid=&billTempletUuid=942CEC3EF0EE483B8111598C5A2E56FD&menuid=786ad277-d33b-46ce-9b20-bf4b0e80861c&businessKey=' + id;
            uf.openNewPage(page.isCrossDomain, $(this), 'openMenu', url, false, "合同");
          } else if (page.turnType == 'upBillType') { //采购
            var id = page.tableBillId;
            var url = '/pf/pvdf/index.html#/bd/openPage?productCode=UP&type=select&billTabUuid=AC48E39C559542EEA9DD87E802D172CA&billTempletUuid=AEAA449CEF3149FCA033F069EC833C8A&menuid=2511c30a-46aa-4885-808e-5ee0a78bfb45&businessKey=' + id;
            uf.openNewPage(page.isCrossDomain, $(this), 'openMenu', url, false, "采购");
          }
        });
        $('#showMethodTip').click(function () {
          if ($("#rptPlanList").find('li').length == 0) {
            $("#rptPlanList ul").append('<li class="tc">无可用方案</li>');
          };
        });
        //重构时，方案保存在其它文件中，不好添加新方案，在按钮点击时重新加载，不是最好方案
        $(document).on('click', '.btn-save[id^="selfInputModal"]', function () {
          setTimeout(function () {
            page.showPlan({
              agencyCode: page.agencyCode,
              userId: page.pfData.svUserId, //修改权限  将svUserCode改为 svUserId  20181012
              userName: page.pfData.svUserName,
              rptType: 'budgetDetails'
            });
          }, 600);
        });
        $('#showMethodTip').ufTooltip({
          className: 'p0',
          trigger: 'click', //click|hover
          opacity: 1,
          confirm: false,
          gravity: 'north', //north|south|west|east
          content: "#rptPlanList"
        });
        $('#btnSave').on('click', function () {
          var rst = page.getModalSelectedResult();
          page.contentObj = $.extend({}, rst);
          page.planSetData()
        });
      },
      //显示更多
      initBgPlanItemPnl: function ($pnl, planData) {
        if (planData != null) {
          var items = planData.planVo_Items;
        }
        var $curRow = $('#planItemMore');
        $curRow.html('');
        for (var i = 0; i < items.length; i++) {
          //CWYXM-10949 --预算执行明细表-编码选择弹窗，查询条件显示需修改--zsj
          var item = items[i];
          if (item.eleCode == 'sendDocNum' || item.eleCode == 'bgItemIdMx') {
            $curgroup = $('<div class="form-group"  eleCode="' + item.eleCode + '"  eleName="' + item.eleName + '" bgItemCode="' + item.bgItemCode + '"  style="width:30em;margin-left:1em;margin-bottom:8px;"></div>').prependTo($curRow);
            $('<lable class="control-label auto commonShowLab" title="' + item.eleName + '" style="display:inline-block;width:10em;text-align: right;vertical-align: text-bottom;">' + item.eleName + '：</lable>').appendTo($curgroup);
          } else {
            $curgroup = $('<div class="form-group"  eleCode="' + item.eleCode + '"  eleName="' + item.eleName + '" bgItemCode="' + item.bgItemCode + '"  style="width:30em;margin-left:1em;margin-bottom:8px;"></div>').prependTo($curRow);
            $('<lable class="control-label auto commonShowLab" title="' + item.eleName + '" style="display:inline-block;width:10em;text-align: right;vertical-align: text-bottom; ">' + item.eleName + '：</lable>').appendTo($curgroup);
          }
          if (item.eleCode == 'ISUPBUDGET') {
            var formCtrl = $('<div id="isUpBudget" class="typeTree uf-combox" style=" width:300px;margin-left:3px;"></div>').appendTo($curgroup);
            var isUpBudgetData = [{
              code: "1",
              pId: "*",
              isLeaf: 1,
              parentId: "",
              levelNum: 1,
              pCode: "",
              codeName: "是",
              name: "是",
              chrFullname: "是",
              eleCode: "",
              id: "1",
              isFinal: "",
              lastVer: "",
            }, {
              code: "0",
              pId: "*",
              isLeaf: 1,
              parentId: "",
              levelNum: 1,
              pCode: "",
              codeName: "否",
              name: "否",
              chrFullname: "否",
              eleCode: "",
              id: "0",
              isFinal: "",
              lastVer: "",
            }];
            $('#isUpBudget').ufCombox({
              idField: "id",
              textField: "codeName",
              placeholder: "请选择是否采购",
              data: isUpBudgetData, //json 数据 
              onChange: function (sender, data) {},
              onComplete: function (sender) {}
            });
          } else if (item.eleCode == 'sendDocNum') {
            var formCtrl = $('<input id="sendDocNum" class="form-control" style=" width:300px;margin-left:3px;"/>').appendTo($curgroup);
          } else if (item.eleCode == 'bgItemIdMx') {
            var formCtrl = $('<input id="bgItemIdMx" class="form-control" style=" width:300px;margin-left:3px;"/>').appendTo($curgroup);
          }  else {
            var formCtrl = $('<div id="cb' + item.eleCode + '" class="typeTree uf-treecombox" style=" width:300px;margin-left:3px;"></div>').appendTo($curgroup);
            var param = {};
            param['agencyCode'] = planData.agencyCode;
            param['setYear'] = ufma.getCommonData().svSetYear;
            param['eleCode'] = item.eleCode;
            param['eleLevel'] = item.eleLevel;
            var treecombox = $('#cb' + item.eleCode);
            bg.cacheDataRun({
              element: treecombox,
              cacheId: param['agencyCode'] + param['eleCode'],
              url: bg.getUrl('bgPlanItem'),
              param: param,
              eleName: item.eleName,
              callback: function (ele, data, tmpEleName) {
                $(ele).ufTreecombox({ //初始化
                  data: data, //列表数据
                  idField: 'id',
                  textField: 'codeName',
                  readonly: false,
                  pIdField: 'pId',
                  placeholder: "请选择" + tmpEleName
                });
              }
            });
            var sId = "cb" + item.eleCode;
            $('#' + sId).off("keyup").on("keyup", function (e) {
              if (e.keyCode == 8) { //退格键，支持删除
                e.stopPropagation();
                var subId = $(e.target).attr("id").replace("_input_show", "");
                subId = subId.replace("_input", "");
                $('#' + subId + '_value').val('');
                $('#' + subId + '_input').val('');
                $('#' + subId + '_input_show').val('');
                $('#' + subId + '_text').val('');
              }
            });
          }
        }
        //CWYXM-18080 编制指标时需要增加文本说明项，只录入文本，用于描述指标信息--zsj--查询条件区域
        for (var k = 0; k < planData.planVo_Txts.length; k++) {
          var textItem = planData.planVo_Txts[k]
          var codeId = bg.shortLineToTF(textItem.eleFieldName) 
          var $curRowTetx = $('#planItemMore');
          var $curgroupTetx = $('<div class="form-group"  eleCode="' + textItem.eleCode + '"  eleName="' + textItem.eleName + '" bgItemCode="' + textItem.bgItemCode + '"  style="width:30em;margin-left:1em;margin-bottom:8px;"></div>').appendTo($curRowTetx);
          $('<lable class="control-label auto commonShowLab" title="' + textItem.eleName + '" style="display:inline-block;width:10em;text-align: right;vertical-align: text-bottom;">' + textItem.eleName + '：</lable>').appendTo($curgroupTetx);
          var formCtrl = $('<input id="'+codeId+'" class="form-control" style=" width:300px;margin-left:3px;"/>').appendTo($curgroupTetx);
        }
      },

      //初始化页面
      initPage: function () {
        this.initAgency();
        page.changeBgPlan();
        //CWYXM-11195 --预算执行明细表，查询默认日期应为登录年度，目前为服务器年度--zsj
        $('#startDate').ufDatepicker({
          format: 'yyyy-mm-dd',
          initialDate: new Date(page.setYear, 0, 1)
        });
        //CWYXM-11195 --预算执行明细表，查询默认日期应为登录年度，目前为服务器年度--zsj
        $('#endDate').ufDatepicker({
          format: 'yyyy-mm-dd',
          initialDate: new Date(page.pfData.svTransDate)
        });
        if (!$.isNull(page.balanceTurnDetailQuery)) {
          if (!$.isNull(page.balanceTurnDetailQuery.bgItemCode)) {
            $('#bgItemCode p').html(page.balanceTurnDetailQuery.bgItemCode); //CWYXM-10755 --指标预算执行情况表，编码联查到预算执行明细表，应按所选指标带出预算方案--zsj
            $('.clearBill').css("margin-top", "-29px");
            //$('#bgItemCode').val(page.balanceTurnDetailQuery.bgItemCode)
          }
        }
        //page.initQueryTable();
        $.fn.dataTable.ext.errMode = 'none';
      },
      GetQueryString: function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]);
        return null;
      },
      init: function () {
        //获取session
        reslist = ufma.getPermission();
        ufma.isShow(reslist);
        page.pfData = ufma.getCommonData();
        page.agencyCode = page.pfData.svAgencyCode;
        page.rgCode = page.pfData.svRgCode;
        page.setYear = parseInt(page.pfData.svSetYear);
        page.isCrossDomain = false;
        page.chooseFlag = false;
        page.setShow = false;
        page.balanceTurnDetailQuery = '';
        page.showTrue = true;
        page.selectNodes = []
        var myDataFrom = page.GetQueryString("dataFrom");
        if (!$.isNull(myDataFrom)) {
          page.balanceTurnDetailQuery = JSON.parse(window.sessionStorage.getItem("balanceTurnDetailQuery"));
          if (!$.isEmptyObject(page.balanceTurnDetailQuery)) {
            page.turnFlag = true;
          } else {
            page.turnFlag = false;
          }
        }
        this.initPage();
        //page.dealJump();
        this.onEventListener();
        ufma.parse();
        ufma.parseScroll();
        window.addEventListener('message', function (e) {
          if (e.data.hasOwnProperty('messageType') && e.data.messageType == 'clientWidth') {
            page.isCrossDomain = true;
          } else {
            page.isCrossDomain = false;
          }
        });
        page.moreMsgSetting = {
          "agencyCode": page.pfData.svAgencyCode,
          "userId": page.pfData.svUserId, //  将svUserCode改为 svUserId  20181012
          "userName": page.pfData.svUserName,
          "rptType": 'budgetDetails',
          'rebuild': true
        };
        page.contentObj = {};
      }
    }
  }();

    page.init();
});
