$(function () {
  var agencyCode = null
  var menuId = "f2a92b8b-5b29-4413-86c2-afe466e0ea4e"
  var oTable
  var iValue = 0
  //CWYXM-18080 编制指标时需要增加文本说明项，只录入文本，用于描述指标信息--zsj
  var textCodeArr = []; //存放文本说明项code，方便记忆方案存值
  //ZJGA820-1788--指标登记簿的财政下达指标方案中发文文号没有变为财政指标id，其他模块在执行过脚本后变了--zsj
  var compireMember = []; // 存放记忆列数据
  var page = (function () {
    return {
      agencyCode: "",
      planData: "",
      chrId: "",
      initAgency: function () {
        bg.setAgencyCombox(
          $("#cbAgency"),
          {
            userCode: page.pfData.svUserCode,
            userId: page.pfData.svUserId,
            setYear: page.setYear,
          },
          function (sender, treeNode) {
            page.agencyCode = treeNode.id
            //80827 【财务云8.0 鄂尔多斯 】20190630所有页面，单位或账套选择变化后，再打开其它页面时，自动显示为最近一次选择的单位或账套。--zsj
            //缓存单位
            var params = {
              selAgecncyCode: treeNode.id,
              selAgecncyName: treeNode.name,
            }
            ufma.setSelectedVar(params)
            //CWYXM-12690--根据系统选项判断发文文号是否必填，若必填则将列名“发文文号”改完指标id--zsj
            var bgUrl =
              "/bg/sysdata/selectSysRgParaValue?rgCode=" +
              page.rgCode +
              "&setYear=" +
              page.setYear +
              "&agencyCode=" +
              treeNode.id +
              "&chrCode=BG003"
            ufma.get(bgUrl, {}, function (result) {
              page.needSendDocNum = result.data
              if (page.needSendDocNum == true) {
                page.sendCloName = "指标id"
              } else {
                page.sendCloName = "发文文号"
              }
            })
            page.reqPnl = true
            //CWYXM-18102 指标权限设置需要支持按人员库中的部门人员设置指标权限--zsj
            page.getSysFlag();
            //	page.initSearchPnl();
            page.selectSessionPlan() //CWYXM-10166--指标编制、指标控制管理界面记忆预算方案--zsj
            page.selectSessionData() //CWYXM-10166 指标编制、指标控制管理界面记忆预算方案--新增需求记忆预算方案--单位加载完后请求预算方案，若有记忆则用已经记忆 的值的数据--zsj
          }
        )
      },
      // CWYXM-18144--ZJGA：指标授权时可以授权金额，指标使用时按授权金额对可使用余额进行控制--zsj--查询系统选项
      getAuthCur: function () {
        var bgUrl = '/bg/sysdata/selectSysRgParaValue?rgCode=' + page.rgCode + '&setYear=' + page.setYear + '&agencyCode=*' + '&chrCode=BG007';
        ufma.ajaxDef(bgUrl,'get',{},function(result){
          page.authCurFlag = result.data
        })
      },
      //CWYXM-18102 指标权限设置需要支持按人员库中的部门人员设置指标权限--zsj
      getSysFlag: function() {
        var bgUrl = '/bg/sysdata/selectSysRgParaValue?rgCode=' + page.rgCode + '&setYear=' + page.setYear + '&agencyCode=' + page.agencyCode + '&chrCode=BG005';
        ufma.ajaxDef(bgUrl,'get',{},function(result){
          page.treeDepType = result.data
        })
      },
      //CWYXM-10173--zsj--指标控制管理界面，可以设置表格区哪些列可以展示，哪些列不展示，同时实现列排序和记忆功能
      //用于请求记忆列
      selectSessionData: function () {
        var argu = {
          agencyCode: page.agencyCode,
          acctCode: "*",
          menuId: menuId,
        }
        ufma.get("/bg/pub/menuConfig/select", argu, function (result) {
          page.sessionPlanData = result.data
          if (page.reqPnl == true) {
            page.initSearchPnl()
          } else {
            var cbBgPlanId = $("#cbBgPlan").getObj().getValue()
            var cbBgPlanText = $("#cbBgPlan").getObj().getText()
            var figValue = cbBgPlanId + "," + cbBgPlanText
            if (
              !$.isEmptyObject(page.sessionPlanData) &&
              !$.isNull(page.sessionPlanData[figValue])
            ) {
              var useData = page.sessionPlanData[figValue]
              page.setMenberData = eval("(" + useData + ")")
            } else {
              page.setMenberData = []
            }
            page.setShowColumn()
          }
        })
      },
      //CWYXM-10173--zsj--指标控制管理界面，可以设置表格区哪些列可以展示，哪些列不展示，同时实现列排序和记忆功能
      //用于请求记忆列
      updateSessionTable: function () {
        var argu = {
          acctCode: "*",
          agencyCode: page.agencyCode,
          configKey: page.configKey,
          configValue: page.configValue,
          menuId: menuId,
        }

        ufma.post("/bg/pub/menuConfig/update", argu, function (reslut) {
          page.reqPnl = false
          page.selectSessionData()
        })
      },
      //CWYXM-10173--zsj--指标控制管理界面，可以设置表格区哪些列可以展示，哪些列不展示，同时实现列排序和记忆功能
      setShowColumn: function () {
        if (page.setMenberData.length > 0) {
          if (page.chooseFlag == true) {
            page.setShow = true
            //page.setVisibleCol();
            page.setTable()
            oTable.fnClearTable()
            if (page.tableAllData.length > 0) {
              oTable.fnAddData(page.tableAllData, true)
            }
          }
          setTimeout(function () {
            for (var i = 0; i < page.changeCol.length; i++) {
              if (page.changeCol[i].title == page.setMenberData[i].title) {
                page.changeCol[i].visible = page.setMenberData[i].visible
                var seq = page.setMenberData[i].seq
                if (page.setMenberData[i].visible == true) {
                  oTable
                    .api(true)
                    .column(i + 2)
                    .visible(true)
                } else {
                  oTable
                    .api(true)
                    .column(i + 2)
                    .visible(false)
                }
              }
            }
            ufma.hideloading()
          }, 100)
        }
      },
      //CWYXM-10173--zsj--指标控制管理界面，可以设置表格区哪些列可以展示，哪些列不展示，同时实现列排序和记忆功能
      //用于请求记忆方案
      selectSessionPlan: function () {
        var argu = {
          agencyCode: page.agencyCode,
          acctCode: "*",
          menuId: menuId,
        }
        ufma.get("/pub/user/menu/config/select", argu, function (result) {
          page.sessionPlan = result.data
          if (page.reqPnl == true) {
            page.initSearchPnl()
          }
          //page.initSearchPnl();
        })
      },
      //CWYXM-10173--zsj--指标控制管理界面，可以设置表格区哪些列可以展示，哪些列不展示，同时实现列排序和记忆功能
      //用于请求记忆方案
      updateSessionPlan: function () {
        var argu = {
          acctCode: "*",
          agencyCode: page.agencyCode,
          configKey: page.configKeyPlan,
          configValue: page.configValuePlan,
          menuId: menuId,
        }

        ufma.post("/pub/user/menu/config/update", argu, function (reslut) {
          /*page.reqPnl = false;
					page.selectSessionPlan();*/
        })
      },

      initSearchPnl: function () {
        uf.cacheDataRun({
          element: $("#cbBgPlan"),
          cacheId: page.agencyCode + "_plan_items",
          url: bg.getUrl("bgPlan") + "?ajax=1",
          param: {
            agencyCode: page.agencyCode,
            setYear: page.setYear,
          },
          callback: function (element, data) {
            element.ufCombox({
              // 初始化
              data: data, // 列表数据
              readonly: true, // 可选
              placeholder: "请选择预算方案",
              onChange: function (sender, data) {
                page.setMenberData = []
                page.planData = data
                var codeArr = []
                // for (var z = 0; z < data.planVo_Items.length; z++) {
                //     var code = data.planVo_Items[z].eleCode;
                //     if (code != 'sendDocNum' && code != 'bgItemIdMx'){
                //         codeArr.push(data.planVo_Items[z]);
                //     }
                // } 
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
                if (data.isFinancialBudget == '1') {
                  var bgItemIdMxArgu = {
                    eleName: "财政指标ID",
                    eleCode:'bgItemIdMx',
                    nameCode: "bgItemIdMx"
                  }
                  codeArr.splice(0, 0, bgItemIdMxArgu);
                }
                data.needSendDocNum = page.sendCloName
                if (data.isSendDocNum == '是') {
                  var sendDocNumArgu = {
                    eleName:  page.sendCloName,
                    eleCode:'sendDocNum',
                    nameCode: "sendDocNum"
                  }
                  codeArr.splice(0, 0, sendDocNumArgu);
                }
                page.planData.planVo_Items = codeArr;
                bg.initBgPlanItemPnl($("#searchPlanPnl"),  page.planData)
                //page.adjGridTop();
                page.chrId = $("#cbBgPlan_value").val()
                //bugCWYXM-10166--新增需求记忆预算方案--更新记忆数据--zsj
                page.configKeyPlan = ""
                page.configValuePlan = ""
                page.configKeyPlan = "cbBgPlan"
                var cbBgPlanId = $("#cbBgPlan").getObj().getValue()
                var cbBgPlanText = $("#cbBgPlan").getObj().getText()
                page.configValuePlan = cbBgPlanId + "," + cbBgPlanText
                //CWYXM-10166--指标编制、指标控制管理界面记忆预算方案--修改为切换预算方案就记忆，弹窗不记忆
                //请求记忆方案
                page.updateSessionPlan()
                var figValue = cbBgPlanId + "," + cbBgPlanText
                //CWYXM-10625 --指标管理，查询不同预算方案，重新保存格式后，列表数据显示错误--zsj
                page.chooseFlag = false
                page.tableAllData = []
                //CWYXM-10173--zsj--指标控制管理界面，可以设置表格区哪些列可以展示，哪些列不展示，同时实现列排序和记忆功能
                if (
                  !$.isEmptyObject(page.sessionPlanData) &&
                  !$.isNull(page.sessionPlanData[figValue])
                ) {
                  var useData = page.sessionPlanData[figValue]
                  page.setMenberData = eval("(" + useData + ")")
                } else {
                  page.setMenberData = []
                }
                page.setTable()
                page.getTableData()
              },
              onComplete: function (sender, elData) {
                if (!$.isEmptyObject(page.sessionPlan) &&!$.isNull(page.sessionPlan.cbBgPlan)) {
                  var planData = page.sessionPlan.cbBgPlan.split(",")
                  var planId = planData[0]
                  var planName = planData[1]
                  $("#cbBgPlan").getObj().setValue(planId, planName)
                  //CWYXM-17038 指标管理模块--所有涉及到预算方案记忆的界面均需判断已记忆方案是否被删除--zsj
                   var planIdArr = [];
                   for(var a = 0; a < data.length; a++) {
                        planIdArr.push(data[a].chrId);
                    } 
                    if($.inArray(planId,planIdArr) > -1){                                           
                        $('#cbBgPlan').getObj().setValue(planId, planName);
                    } else {
                        $('#cbBgPlan').getObj().val('111');
                    }                  
                } else {
                  bg.selectBgPlan($(element), elData)
                }
              },
            })
          },
        })
      },
      getSearchMap: function (planData) {
        var searchMap = bg.getBgPlanItemMap(planData)
        //searchMap['billType'] = 1;
        searchMap["bgReserve"] = ""
        searchMap["businessDateBegin"] = $("#createDate1").getObj().getValue()
        searchMap["businessDateEnd"] = $("#createDate2").getObj().getValue()
        return searchMap
      },
      //CWYXM-10173--zsj--指标控制管理界面，可以设置表格区哪些列可以展示，哪些列不展示，同时实现列排序和记忆功能
      setTable: function () {
        ufma.showloading("数据加载中，请耐心等待...")
        if (oTable) {
          oTable.dataTable().fnDestroy()
        }
        // CWYXM-18216 已经有记忆列的预算方案重新修改辅助项时(在预算方案里增减辅助项)，界面显示不同步--zsj
        var assiArr = [];
        var compireArr = [];
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
              if ($.inArray(oneAssi,compireArr) == -1 && compireArr.length > 0) {
                var objAss = {
                  'title': page.planData.planVo_Items[m].eleName,
                  'data': oneAssi,
                  'visible':true,
                  'seq':parseInt(page.setMenberData.length + 1) 
                }
                page.setMenberData.push(objAss)
              }
              assiArr.push(oneAssi);
            }
					}
        }
        //CWYXM-18080 编制指标时需要增加文本说明项，只录入文本，用于描述指标信息--zsj
        var textArr = [];
        var compireTextArr = [];
        // 此处需要将方案里的要素添加至记忆列里
        if (page.planData && page.planData.planVo_Txts.length > 0) {
          for (var l = 0; l < page.setMenberData.length; l++) {
            compireTextArr.push(page.setMenberData[l].data)
          }
          for (var n = 0; n < page.planData.planVo_Txts.length; n++) {
              var oneText = bg.shortLineToTF(page.planData.planVo_Txts[n].eleFieldName);
              textCodeArr.push(oneText);
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
        $("#mangerTable").html("")
        var column = [
          {
            data: "",
            title:
              '<label class="mt-checkbox mt-checkbox-single mt-checkbox-outline"> ' +
              '<input type="checkbox" class="datatable-group-checkable" id="check_H"/>&nbsp;' +
              "<span></span> " +
              "</label>",
            className: "nowrap tc",
            width: "40px",
          },
          {
            data: "bgItemId",
            title: "操作",
            width: "400px",
            className: "opts nowrap tc",
          },
        ]
        if (page.setMenberData.length > 0) {
          for (var i = 0; i < page.setMenberData.length; i++) {
            if (page.setMenberData[i].data == "bgCtrlType") {
              column.push({
                data: "bgCtrlType",
                title: "控制方式",
                // width: 150,
                className: "bgCtrlType isprint nowrap BGTenLen",
                render: function (data, type, rowdata, meta) {
                  if (!$.isNull(data)) {
                    if (data == "0") {
                      data = "禁止"
                    } else if (data === "1") {
                      data = "预警"
                    } else if (data === "2") {
                      data = "不控制"
                    }
                    return data
                  } else {
                    return ""
                  }
                },
              })
            } else if (
              page.setMenberData[i].data == "bgItemCur" ||
              page.setMenberData[i].data == "composeCur" ||
              page.setMenberData[i].data == "adjAndDispenseCur" ||
              page.setMenberData[i].data == "realBgItemCur" ||
              page.setMenberData[i].data == "bgUseCur" ||
              page.setMenberData[i].data == "bgItemBalanceCur"
            ) {
              var setData = page.setMenberData[i].data
              column.push({
                data: setData,
                title: page.setMenberData[i].title,
                // width: 150,
                className: setData + " " + "isprint nowrap tr BGmoneyClass",
                render: function (data, type, rowdata, meta) {
                  return $.formatMoney(data, 2)
                },
              })
            } else if ((page.setMenberData[i].data == "sendDocNum" || $.inArray('sendDocNum',compireMember) == -1) && page.planData.isSendDocNum == "是") {//ZJGA820-1788--指标登记簿的财政下达指标方案中发文文号没有变为财政指标id，其他模块在执行过脚本后变了--zsj
              column.push({
                data: "sendDocNum",
                title: page.sendCloName,
                // width: 200,
                className: "sendDocNum isprint nowrap BGThirtyLen",
                "render": function (data) {
                  if (!$.isNull(data)) {
                    return '<code title="' + data + '">' + data + '</code>';
                  } else {
                    return '';
                  }
                }
              })
            } else if ((page.setMenberData[i].data == "bgItemIdMx" || $.inArray('bgItemIdMx',compireMember) == -1) && page.planData.isFinancialBudget == "1") {//ZJGA820-1788--指标登记簿的财政下达指标方案中发文文号没有变为财政指标id，其他模块在执行过脚本后变了--zsj
              column.push({
                data: "bgItemIdMx",
                title: '财政指标ID',
                className: "bgItemIdMx nowrap print BGThirtyLen",
                // width: 200,
                "render": function (data) {
                  if (!$.isNull(data)) {
                    return '<code title="' + data + '">' + data + '</code>';
                  } else {
                    return '';
                  }
                }
              });
            } else{//ZJGA820-1788--指标登记簿的财政下达指标方案中发文文号没有变为财政指标id，其他模块在执行过脚本后变了--zsj
              var setData = page.setMenberData[i].data
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
            }
          }
        } else {
          column.push(
            // 支持多表头
            {
              data: "bgItemCode",
              title: "指标编码",
              // width: 100,
              className: "bgItemCode isprint nowrap"
            },
            // CWYXM-18408--指标年结涉及采购合同报销模块占用的指标结转完善--zsj
            {
              data: "bgTypeName",
              title: "指标类型",
              className: "bgTypeName isprint nowrap BGTenLen",
              //width: "250px",
              "render": function (data) {
                if (!$.isNull(data)) {
                  return '<code title="' + data + '">' + data + '</code>';
                } else {
                  return '';
                }
              }
            },
            {
              data: "bgItemSummary",
              title: '摘要',
              // width: 200,
              className: "bgItemSummary isprint nowrap BGThirtyLen",
              "render": function (data) {
                if (!$.isNull(data)) {
                  return '<code title="' + data + '">' + data + '</code>';
                } else {
                  return '';
                }
             }
            }
          )
          if (page.planData.isComeDocNum == "是") {
            column.push({
              data: "comeDocNum",
              title: "来文文号",
              // width: 200,
              className: "comeDocNum isprint nowrap BGThirtyLen",
              "render": function (data) {
                if (!$.isNull(data)) {
                  return '<code title="' + data + '">' + data + '</code>';
                } else {
                  return '';
                }
             }
            })
          }
          if (page.planData.isSendDocNum == "是") {
            column.push({
              data: "sendDocNum",
              title: page.sendCloName,
              // width: 200,
              className: "sendDocNum isprint nowrap BGThirtyLen",
              "render": function (data) {
                if (!$.isNull(data)) {
                  return '<code title="' + data + '">' + data + '</code>';
                } else {
                  return '';
                }
             }
            })
          }
        //CWYXM-17554 预算方案设置中，增加财政指标ID属性，可选择是否启用，启用时，选择预算方案新增指标时，需要录入指标id，指标id也需要参与指标的要素唯一性校验--zsj
        if (page.planData.isFinancialBudget == "1") {
            column.push({
                data: "bgItemIdMx",
                title: '财政指标ID',
                className: "bgItemIdMx nowrap print BGThirtyLen",
                // width: 250,
                "render": function (data) {
                  if (!$.isNull(data)) {
                    return '<code title="' + data + '">' + data + '</code>';
                  } else {
                    return '';
                  }
                }
            });
         } 
          if (!$.isNull(page.planData)) {
            for (var i = 0; i < page.planData.planVo_Items.length; i++) {
              var item = page.planData.planVo_Items[i]
              var cbItem = item.eleCode
              //CWYXM-11697  预算方案中要素选择里，增加是否采购属性，启用之后，编制指标时可选是和否，不能输入其他值，采购模块选择指标时，根据这个属性过滤。--zsj
              if (cbItem != "ISUPBUDGET" && cbItem != 'sendDocNum' &&  cbItem != 'bgItemIdMx') {
                  var cbData = bg.shortLineToTF(item.eleFieldName) + "Name"
                  column.push({
                  data: cbData,
                  title: item.eleName,
                  // width: 200,
                  className: bg.shortLineToTF(item.eleFieldName) + " " + "isprint nowrap BGThirtyLen",
                  "render": function (data) {
                    if (!$.isNull(data)) {
                      return '<code title="' + data + '">' + data + '</code>';
                    } else {
                      return '';
                    }
                  }
                  })
              } else if(cbItem == "ISUPBUDGET"){
                  column.push({
                  data: "isUpBudget",
                  title: "是否采购",
                  className: "isUpBudget nowrap isprint tc",
                  //  width: 120
                  })
              }
            }
            //CWYXM-18080 编制指标时需要增加文本说明项，只录入文本，用于描述指标信息--zsj--查询条件区域
            for (var k = 0; k < page.planData.planVo_Txts.length; k++) {
              var textCode = bg.shortLineToTF(page.planData.planVo_Txts[k].eleFieldName)
              column.push({
                data: textCode,
                title: page.planData.planVo_Txts[k].eleName,
                className: textCode+" nowrap print BGThirtyLen",
                // width: 250,
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
            data: "bgCtrlType",
            title: "控制方式",
            // width: 150,
            className: "bgCtrlType isprint nowrap",
            render: function (data, type, rowdata, meta) {
              if (!$.isNull(data)) {
                if (data == "0") {
                  data = "禁止"
                } else if (data === "1") {
                  data = "预警"
                } else if (data === "2") {
                  data = "不控制"
                }
                return data
              } else {
                return ""
              }
            }
            },
            {
              data: "bgWarnRatio",
              title: "预警百分比",
              // width: 150,
              className: "bgWarnRatio isprint nowrap",
            },
            {
              data: "bgCtrlRatio",
              title: "控制百分比",
              // width: 150,
              className: "bgCtrlRatio isprint nowrap",
            },
            {
              data: "bgItemCur",
              title: "金额",
              // width: 150,
              className: "bgItemCur isprint nowrap tr BGmoneyClass",
              render: function (data, type, rowdata, meta) {
                return $.formatMoney(data, 2)
              },
            },
            {
              data: "composeCur",
              title: "分解金额",
              // width: 150,
              className: "composeCur isprint nowrap tr BGmoneyClass",
              render: function (data, type, rowdata, meta) {
                return $.formatMoney(data, 2)
              },
            },
            {
              data: "adjAndDispenseCur",
              title: "调整金额",
              // width: 150,
              className: "adjAndDispenseCur isprint nowrap tr BGmoneyClass",
              render: function (data, type, rowdata, meta) {
                return $.formatMoney(data, 2)
              },
            },
            {
              data: "realBgItemCur",
              title: "可执行金额",
              // width: 150,
              className: "realBgItemCur isprint nowrap tr BGmoneyClass",
              render: function (data, type, rowdata, meta) {
                return $.formatMoney(data, 2)
              },
            },
            {
              data: "bgUseCur",
              title: "已执行金额",
              // width: 150,
              className: "bgUseCur isprint nowrap tr BGmoneyClass",
              render: function (data, type, rowdata, meta) {
                return $.formatMoney(data, 2)
              },
            },
            {
              data: "bgItemBalanceCur",
              title: "余额",
              // width: 150,
              className: "bgItemBalanceCur isprint nowrap tr BGmoneyClass",
              render: function (data, type, rowdata, meta) {
                return $.formatMoney(data, 2)
              },
            },
            {
              data: "ctrlUser",
              title: "归口审核人",
              // width: 150,
              className: "ctrlUser isprint nowrap BGTenLen",
            },
            {
              data: "cwUser",
              title: "财务审核人",
              // width: 150,
              className: "cwUser isprint nowrap BGTenLen",
            },
            {
              data: "ctrlDeptNames",
              title: "归口部门",
              // width: 150,
              className: "ctrlDeptNames isprint nowrap BGThirtyLen",
              "render": function (data) {
                if (!$.isNull(data)) {
                  return '<code title="' + data + '">' + data + '</code>';
                } else {
                  return '';
                }
             }
            },
            {
              data: "deptNames",
              title: "用款部门",
              //  width: 150,
              className: "deptNames isprint nowrap BGThirtyLen",
              "render": function (data) {
                  if (!$.isNull(data)) {
                    return '<code title="' + data + '">' + data + '</code>';
                  } else {
                    return '';
                  }
               }
            }
          )
        }

        oTable = $("#mangerTable").dataTable({
          language: {
            url: bootPath + "agla-trd/datatables/datatable.default.js",
          },
          bFilter: true,
          bAutoWidth: false,
          bDestory: true,
          processing: true, //显示正在加载中
          serverSide: false,
          ordering: false,
          scrollY: 300,
          paging: false,
          columns: column,
          columnDefs: [
            {
              targets: [0],
              serchable: false,
              orderable: false,
              className: "checktd tc nowrap",
              width:'40px',
              render: function (data, type, rowdata, meta) {
                return (
                  '<div class="checkdiv">' +
                  '</div><label class="mt-checkbox mt-checkbox-single mt-checkbox-outline"> ' +
                  '<input type="checkbox" class="checkboxes" data-bgItemId="' +
                  rowdata.bgItemId +
                  '" data-initType="' +
                  rowdata.isYearInit +
                  '" data-bgItemParentid="' +
                  rowdata.bgItemParentid +
                  '"  data-bgItemParentid="' +
                  rowdata.bgItemCode +
                  '" index="' +
                  meta.row +
                  '" />&nbsp; ' +
                  "<span></span> " +
                  "</label>"
                )
              },
            },
            {
              targets: [1],
              serchable: false,
              orderable: false,
              className: "opts nowrap",
              render: function (data, type, rowdata, meta) {
                var disableFlag = "" //<span class="glyphicon icon-edit"></span> <span class="glyphicon icon-uniE96C"></span>
                disableFlag =
                  rowdata.status == 1 ? "disabled" : "disabled:false"
                var enabledType = ""
                var btnType = ""
                enabledType = rowdata.enabled === "1" ? "启用" : "停用"
                btnType = rowdata.enabled === "1" ? "stop" : "start"
                var isCanAuthClass = rowdata.isCanAuth === '-1' ? "hide" : ''
                var isCanAuth = rowdata.isCanAuth === '1' ? "" : "disabled"
                return (
                  '<a class="btn btn-icon-only btn-sm btn-edit btn-permission common-jump-link" row-index="' +
                  meta.row +
                  '" data-toggle="tooltip" rowid="' +
                  data +
                  '" title="控制" style="color:#108EE9;margin-left:-7px;">' +
                  "控制</a>" +
                  '<a class="btn btn-icon-only btn-sm btn-change btn-permission common-jump-link" row-index="' +
                  meta.row +
                  '" data-toggle="tooltip" rowid="' +
                  data +
                  '" title="变更" style="color:#108EE9;margin-left:5px;">' +
                  "变更</a>" +
                  '<a class="btn btn-icon-only btn-sm btn-decompose common-jump-link btn-permission"  row-index="' +
                  meta.row +
                  '" data-toggle="tooltip" style="color:#108EE9;margin-left:5px;"' +
                  disableFlag +
                  ">分解</a>" +
                  '<a class="btn btn-icon-only btn-sm btn-adjust common-jump-link btn-permission" row-index="' +
                  meta.row +
                  '" data-toggle="tooltip" style="margin-left:4px;color:#108EE9;margin-right:7px;"' +
                  disableFlag +
                  ">调整</a>" +
                   '<a class="btn btn-icon-only btn-sm btn-' +
                  btnType +
                  ' common-jump-link btn-permission" data-bgItemId="' +
                  rowdata.bgItemId +
                  '"row-index="' +
                  meta.row +
                  '" data-toggle="tooltip" style="margin-left:4px;color:#108EE9;margin-right:7px;"' +
                  disableFlag +
                  ">" +
                  enabledType +
                  "</a>"+
                  '<a class="btn btn-icon-only btn-sm btn-lookLog common-jump-link " row-index="' +
                  meta.row +
                  '" data-toggle="tooltip" style="margin-left:4px;color:#108EE9;margin-right:7px;"' +
                  ">日志</a>" +
                  '<a class="btn btn-icon-only btn-sm btn-auth common-jump-link ' + isCanAuthClass + '"  row-index="' +
                  meta.row +
                  '" data-toggle="tooltip" style="color:#108EE9;margin-left:5px;"' +
                  isCanAuth +
                  ">授权</a>" 
                )
              },
            },
          ],
          //填充表格数据
          data: [],
          dom: "rt",
          initComplete: function (options, data) {
            page.headArr = []
            if (page.setShow == true && page.chooseFlag == true) {
              oTable.fnClearTable()
              if (page.tableAllData.length > 0) {
                oTable.fnAddData(page.tableAllData, true)
              }
            } else {
              page.setShowColumn()
            }
            if (page.setMenberData.length > 0) {
              page.headArr = page.setMenberData
              iValue = 0
            } else {
              page.headArr = page.tableHeader("mangerTable")
              iValue = 2
            }
            page.setVisibleCol()
            //CWYXM-10624 --指标管理页面，操作列‘分解、调整’按钮未自动加载，重新保存格式后方显示--zsj
            ufma.isShow(reslist)
            var optArr = [
              "btn-edit",
              "btn-change",
              "btn-decompose",
              "btn-adjust",
              "btn-stop",
              "start",
            ]
            var conNum = 1
            for (var k = 0; k < reslist.length; k++) {
              //解决数据库存储字段名不同
              var code = reslist[k].code || reslist[k].id
              if ($.inArray(code, optArr) > -1) {
                conNum++
              }
            }
            // CWYXM-18144--ZJGA：指标授权时可以授权金额，指标使用时按授权金额对可使用余额进行控制--zsj--显示授权金额的操作按钮
            if (page.authCurFlag == true) {
              conNum++;
            }
            if (conNum == 0 || conNum == 1) {
              $(
                "#mangerTable_wrapper .dataTables_scroll .dataTables_scrollHead th.sorting_disabled.opts.nowrap"
              ).addClass("num0")
            } else if (conNum == 2) {
              $(
                "#mangerTable_wrapper .dataTables_scroll .dataTables_scrollHead th.sorting_disabled.opts.nowrap"
              ).addClass("num2")
            } else if (conNum == 3) {
              $(
                "#mangerTable_wrapper .dataTables_scroll .dataTables_scrollHead th.sorting_disabled.opts.nowrap"
              ).addClass("num3")
            } else if (conNum == 4) {
              $(
                "#mangerTable_wrapper .dataTables_scroll .dataTables_scrollHead th.sorting_disabled.opts.nowrap"
              ).addClass("num4")
            } else if (conNum == 5) {
              $(
                "#mangerTable_wrapper .dataTables_scroll .dataTables_scrollHead th.sorting_disabled.opts.nowrap"
              ).addClass("num5")
            } else if (conNum > 5) {
              $(
                "#mangerTable_wrapper .dataTables_scroll .dataTables_scrollHead th.sorting_disabled.opts.nowrap"
              ).addClass("num6")
            } else if (conNum > 6) {
              $(
                "#mangerTable_wrapper .dataTables_scroll .dataTables_scrollHead th.sorting_disabled.opts.nowrap"
              ).addClass("num7")
            }
            var widthTab = 0;
            for(var i=0;i< $("#mangerTable thead").find('th').length;i++){
              widthTab += parseInt($("#mangerTable thead").find('th').eq(i).css('width').split('px')[0]);
            } 
            widthTab = widthTab + 18 + 'px';
            $.fn.dataTable.ext.errMode = "none"
            ufma.hideloading()
          },
          drawCallback: function (settings) {
            $("#mangerTable")
              .find("td.dataTables_empty")
              .text("")
              .append(
                '<img src="' +
                  bootPath +
                  'images/noData.png"/><br/><i>目前还没有你要查询的数据</i>'
              )
            ufma.isShow(reslist)
            var wrapperWidth = $("#mangerTable_wrapper").width()
            var tableWidth = $("#mangerTable").width()
            if (tableWidth > wrapperWidth) {
              $("#mangerTable").closest(".dataTables_wrapper").ufScrollBar({
                hScrollbar: true,
                mousewheel: false,
              })
              ufma.setBarPos($(window))
              $(".dataTables_wrapper.no-footer .dataTables_scrollBody").css(
                "border-bottom",
                "1px solid transparent"
              )
            } else {
              if (!$.isNull(wrapperWidth) && !$.isNull(tableWidth)) {
                $("#mangerTable")
                .closest(".dataTables_wrapper")
                .ufScrollBar("destroy")
                $(".dataTables_wrapper.no-footer .dataTables_scrollBody").css(
                  "border-bottom",
                  "1px solid transparent"
                )
              }
            }

            var optArr = [
              "btn-edit",
              "btn-change",
              "btn-decompose",
              "btn-adjust",
              "btn-stop",
              "start",
            ]
            var conNum = 0
            for (var k = 0; k < reslist.length; k++) {
              //解决数据库存储字段名不同
              var code = reslist[k].code || reslist[k].id
              if ($.inArray(code, optArr) > -1) {
                conNum++
              }
            }
            // CWYXM-18144--ZJGA：指标授权时可以授权金额，指标使用时按授权金额对可使用余额进行控制--zsj--显示授权金额的操作按钮
            if (page.authCurFlag == true) {
              conNum++;
            }
            if (conNum == 0 || conNum == 1) {
              $(
                "#mangerTable_wrapper .dataTables_scroll .dataTables_scrollHead th.sorting_disabled.opts.nowrap"
              ).addClass("num0")
            } else if (conNum == 2) {
              $(
                "#mangerTable_wrapper .dataTables_scroll .dataTables_scrollHead th.sorting_disabled.opts.nowrap"
              ).addClass("num2")
            } else if (conNum == 3) {
              $(
                "#mangerTable_wrapper .dataTables_scroll .dataTables_scrollHead th.sorting_disabled.opts.nowrap"
              ).addClass("num3")
            } else if (conNum == 4) {
              $(
                "#mangerTable_wrapper .dataTables_scroll .dataTables_scrollHead th.sorting_disabled.opts.nowrap"
              ).addClass("num4")
            } else if (conNum == 5) {
              $(
                "#mangerTable_wrapper .dataTables_scroll .dataTables_scrollHead th.sorting_disabled.opts.nowrap"
              ).addClass("num5")
            } else if (conNum > 5) {
              $(
                "#mangerTable_wrapper .dataTables_scroll .dataTables_scrollHead th.sorting_disabled.opts.nowrap"
              ).addClass("num6")
            } else if (conNum > 6) {
              $(
                "#mangerTable_wrapper .dataTables_scroll .dataTables_scrollHead th.sorting_disabled.opts.nowrap"
              ).addClass("num7")
            }
            var widthTab = 0;
            for(var i=0;i< $("#mangerTable thead").find('th').length;i++){
              widthTab += parseInt($("#mangerTable thead").find('th').eq(i).css('width').split('px')[0]);
            } 
            widthTab = widthTab + 18 + 'px';
            $("#mangerTable").css('width',widthTab);
          },
        })
      },
      //CWYXM-10173--zsj--指标控制管理界面，可以设置表格区哪些列可以展示，哪些列不展示，同时实现列排序和记忆功能
      getTableData: function () {
        ufma.showloading("数据加载中，请耐心等待...")
        if ($.isNull(page.planData)) {
          return false
        }
        var url =
          "/bg/ctrlManage/getBgItems" +
          "?agencyCode=" +
          page.agencyCode +
          "&setYear=" +
          page.setYear
        var argu = page.getSearchMap(page.planData)
        argu.isUseAuthCur = page.authCurFlag ? '1' : '2'
        ufma.post(url, argu, function (result) {
          ufma.hideloading()
          var newData = result.data
          var billNum = !$.isNull(result.data) ? result.data.length : 0
          $(".billNum").html(billNum)
          oTable.fnClearTable()
          if (result.data.length != 0) {
            page.tableAllData = result.data
            oTable.fnAddData(result.data, true)
          }
        })
      },
      adjGridTop: function () {
        if ($(".label-more div").text() == "更多") {
          $(".label-more div").text("收起")
        } else {
          $(".label-more div").text("更多")
        }

        $.timeOutRun(
          null,
          null,
          function () {
            var gridTop = $("#mangerTable").offset().top
            var gridHeight = $(window).height() - gridTop - 65
            $("#mangerTable").getObj().setBodyHeight(gridHeight)
          },
          800
        )
      },
      //CWYXM-10173--zsj--指标控制管理界面，可以设置表格区哪些列可以展示，哪些列不展示，同时实现列排序和记忆功能
      setAssistGroupControl: function () {
        if ($("#colListTable thead tr th.btnGroup").length == 0) {
          $("#colListTable thead tr").append(
            '<th class="nowrap btnGroup hide" style="width:50px;min-width:50px;text-align:center;">操作</th>'
          )
        }
        $("#colListTable tbody tr").each(function () {
          var $tr = $(this)
          if ($tr.find("td.btnGroup").length == 0) {
            $tr.append(
              '<td class="nowrap btnGroup">' +
                '<a class="btn btn-icon-only btn-sm btnDrag" data-toggle="tooltip" title="拖动排序"><span class="glyphicon icon-drag"></span></a>' +
                "</td>"
            )
            $tr.find('td.btnGroup .btn[data-toggle="tooltip"]').tooltip()
          }
        })
      },
      //CWYXM-10173--zsj--指标控制管理界面，可以设置表格区哪些列可以展示，哪些列不展示，同时实现列排序和记忆功能
      adjAssitNo: function () {
        var idx = 0
        $("#colListTable tbody tr").each(function () {
          idx = idx + 1
          $(this).find(".recNoTd").html(idx)
          $(this).find(".recNoTd").attr("title", idx)
        })
      },
      //CWYXM-10173--zsj--指标控制管理界面，可以设置表格区哪些列可以展示，哪些列不展示，同时实现列排序和记忆功能
      tableHeader: function (tblId) {
        var columns = oTable.fnSettings().aoColumns
        var visible = oTable.api(true).columns().visible() //每列元素的隐藏/显示属性组
        var arr = [] //存储当前表格的表头信息
        for (var i = 0; i < visible.length; i++) {
          var obj = {}
          obj.title = columns[i].sTitle //列名
          obj.index = i //列的索引
          obj.data = columns[i].sClass.split(" ")[0]
          obj.visible = visible[i] //列的隐藏/显示属性
          arr.push(obj)
        }
        return arr
      },
      //设置隐藏列盒子内容--CWYXM-10173--zsj--指标控制管理界面，可以设置表格区哪些列可以展示，哪些列不展示，同时实现列排序和记忆功能
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

      openEditWin: function (data, bgCtrlType, bgWarnRatio, bgCtrlRatio) {
        ufma.open({
          url: "bManageSet.html",
          title: "指标控制设置",
          width: 400,
          height: 250,
          data: {
            agencyCode: page.agencyCode,
            setYear: page.setYear,
            rgCode: page.rgCode,
            chrId: page.chrId,
            bgCtrlType: bgCtrlType,
            bgWarnRatio: bgWarnRatio,
            bgCtrlRatio: bgCtrlRatio,
            param: data,
            menuId: menuId,
          },
          ondestory: function (result) {
            //	page.setTable();
            page.getTableData()
          },
        })
      },
      //打开变更弹窗
      openChangeWin: function (bgItemId) {
        ufma.open({
          url: "budgetChange.html",
          title: "指标变更",
          width: 800,
          data: {
            agencyCode: page.agencyCode,
            setYear: page.setYear,
            rgCode: page.rgCode,
            chrId: page.chrId,
            bgItemId: bgItemId,
          },
          ondestory: function (result) {
            //	page.setTable();
            page.getTableData()
          },
        })
      },
      initPage: function () {
        //$('#createDate1').ufDatepicker('update', page.pfData.svTransDate.substr(0, 8) + "01");
        var mydate = new Date(page.pfData.svTransDate)
        var Year = mydate.getFullYear()
        $("#createDate1").getObj().setValue(Year + '-01-01')
        $("#createDate2").ufDatepicker("update", page.pfData.svTransDate)
        page.initAgency();
        // CWYXM-18144--ZJGA：指标授权时可以授权金额，指标使用时按授权金额对可使用余额进行控制--zsj--查询系统选项
        page.getAuthCur();
        $.timeOutRun(null,null,function () {
            $("#cbAgency").getObj().val(page.agencyCode)
            page.initSearchPnl()
          },
          1000
        )
        $.fn.dataTable.ext.errMode = "none"
      },

      onEventListener: function () {
        //CWYXM-10619 指标控制管理，点击列表全选按钮，未生效--zsj
        $("body").on("click", "input#check_H", function () {
          var flag = $(this).prop("checked")
          $("#mangerTable_wrapper")
            .find("input.checkboxes")
            .prop("checked", flag)
          $("#btnAll").prop("checked", flag)
        })
        $("body").on("click", "#btnAll", function () {
          var flag = $(this).prop("checked")
          $("#mangerTable_wrapper")
            .find("input.checkboxes")
            .prop("checked", flag)
          $("input#check_H").prop("checked", flag)
        })
        $("body").on("click", "input.checkboxes", function () {
          var num = 0
          var arr = document.querySelectorAll(".checkboxes")
          for (var i = 0; i < arr.length; i++) {
            if (arr[i].checked) {
              num++
            }
          }
          if (num == arr.length) {
            $("#check_H").prop("checked", true)
            $("#btnAll").prop("checked", true)
          } else {
            $("#check_H").prop("checked", false)
            $("#btnAll").prop("checked", false)
          }
        })
        //搜索框
        ufma.searchHideShow($("#mangerTable"))
        $("#print").click(function () {
          $("#mangerTable").ufPrintTable({
            mode: "rowNumber",
            header: "headerInfo",
            pageNumStyle: "第#p页/共#p页",
            pageNumClass: ".pageNum",
            pageSize: 20,
          })
        })
        /*$('#export').click(function() {
					$("#mangerTable").ufTableExport({
						fileName: "指标控制管理", // 导出表名
						ignoreColumn: "-1" // 不需要导出的LIE
					});
				});*/
        //导出begin
        //CWYXM-10627--指标管理，导出列表内容，未显示摘要，且不应显示操作列，名称需改为‘指标管理’，目前为‘指标控制管理’--zsj
        $("#export").off().on("click", function (evt) {
            evt = evt || window.event
            evt.preventDefault()
            ufma.expXLSForDatatable($("#mangerTable"), "指标管理")
          })
        //导出end

        $(".btn-more-item").click(function () {
          //	page.adjGridTop();
        })
        $("#btnControl").on("click", function () {
          var checkData = []
          $("#mangerTable_wrapper")
            .find("input.checkboxes:checked")
            .each(function () {
              var rowIndex = $(this).attr("index")
              var rowData = {}
              if (rowIndex) {
                rowData = oTable.api(false).row(rowIndex).data()
              }
              checkData.push(rowData)
            })
          if (checkData.length == 0) {
            ufma.showTip("请选择一条指标！", function () {}, "warning")
            return false
          }
          var data = []
          for (var i = 0; i < checkData.length; i++) {
            data.push({
              bgItemId: checkData[i].bgItemId,
            })
          }
          if (checkData.length != 1) {
            page.openEditWin(data)
          } else {
            page.openEditWin(
              checkData[0].bgItemId,
              checkData[0].bgCtrlType,
              checkData[0].bgWarnRatio,
              checkData[0].bgCtrlRatio
            )
          }
        })
        $("#btnQry").click(function () {
          var beginDate = $("#createDate1").getObj().getValue()
          var endDate = $("#createDate2").getObj().getValue()
          if (beginDate > endDate) {
            ufma.showTip("开始日期不得小于结束日期", null, "error")
          } else {
            page.chrId = $("#cbBgPlan_value").val()
            if (page.chrId == "") {
              ufma.showTip("请先选择一个预算方案", null, "warning")
              return
            }
            //	page.setTable();
            page.getTableData() //CWYXM-10173--zsj--指标控制管理界面，可以设置表格区哪些列可以展示，哪些列不展示，同时实现列排序和记忆功能
          }
        })
        //CWYXM-10173--zsj--指标控制管理界面，可以设置表格区哪些列可以展示，哪些列不展示，同时实现列排序和记忆功能
        $("#mangerTable").on("click", ".btn-edit", function (e) {
          var rowIndex = $(this).attr("row-index")
          var rowData = {}
          if (rowIndex) {
            rowData = oTable.api(false).row(rowIndex).data()
          }
          if ($.isNull(page.agencyCode)) {
            ufma.showTip("请选择单位！",function(){}, "warning")
            return false
          }
          page.openEditWin(
            rowData.bgItemId,
            rowData.bgCtrlType,
            rowData.bgWarnRatio,
            rowData.bgCtrlRatio
          )
        })
        //变更
        $("#mangerTable").on("click", ".btn-change", function (e) {
          if ($.isNull(page.agencyCode)) {
            ufma.showTip("请选择单位！",function(){}, "warning")
            return false
          }
          var rowIndex = $(this).attr("row-index")
          var rowData = {}
          if (rowIndex) {
            rowData = oTable.api(false).row(rowIndex).data()
          }
          page.openChangeWin(rowData.bgItemId)
        })
        //查看日志
        $("#mangerTable").on("click", '.btn-lookLog', function (e) {
          var rowIndex = $(this).attr("row-index")
          var rowData = {}
          if (rowIndex) {
            rowData = oTable.api(false).row(rowIndex).data()
          }
          _bgPub_showLogModal("budgetManage", {
            "bgBillId": rowData.billId,
            "bgItemCode": "",
            "agencyCode":page.agencyCode
          });
        });
        //当单据状态为“3”，即已审核时点击分解打开分解弹窗进行分解，需要携带指标管理界面的单位、预算方案
        $("#mangerTable").on("click", ".btn-decompose", function (e) {
          e.preventDefault()
          var rowIndex = $(this).attr("row-index")
          var rowData = {}
          if (rowIndex) {
            rowData = oTable.api(false).row(rowIndex).data()
          }
          var newBillCode = ""
          var url =
            "/bg/budgetItem/multiPost/newBill" +
            "?agencyCode=" +
            rowData.agencyCode +
            "&setYear=" +
            rowData.setYear +
            "&billType=2"
          page.useTurnArgu = {
            agencyCode: rowData.agencyCode,
            bgPlanChrId: rowData.bgPlanId,
            bgPlanChrName: rowData.bgPlanName,
            bgPlanChrCode: rowData.bgItemCode,
          }
          ufma.get(url, {}, function (result) {
            newBillCode = result.data.billCode
            var billId = result.data.billId
            ufma.open({
              url: "optDecompose.html",
              title: "指标分解",
              width: 1090,
              //height: 250,
              data: {
                agencyCode: page.agencyCode,
                billId: billId,
                planId: page.planData.chrId,
                planData: page.planData,
                status: status,
                setYear: rowData.setYear,
                billCode: newBillCode,
                decomposeData: page.useTurnArgu,
                rgCode: page.rgCode,
                subRowData: rowData,
                menuId: menuId,
                needSendDocNum: page.needSendDocNum,
              },
              ondestory: function (result) {
                //	page.setTable();
                page.getTableData()
              },
            })
          })
        })
        //当单据状态为“3”，即已审核时点击调整打开调整弹窗进行分解，需要携带指标管理界面的单位、预算方案
        $("#mangerTable").on("click", ".btn-adjust", function (e) {
          e.preventDefault()
          var rowIndex = $(this).attr("row-index")
          var rowData = {}
          if (rowIndex) {
            rowData = oTable.api(false).row(rowIndex).data()
          }
          var newBillCode = ""
          var url =
            "/bg/budgetItem/multiPost/newBill" +
            "?agencyCode=" +
            rowData.agencyCode +
            "&setYear=" +
            rowData.setYear +
            "&billType=3"
          page.useTurnArgu = {
            agencyCode: rowData.agencyCode,
            bgPlanChrId: rowData.bgPlanId,
            bgPlanChrName: rowData.bgPlanName,
            bgPlanChrCode: rowData.bgItemCode,
          }
          ufma.get(url, {}, function (result) {
            newBillCode = result.data.billCode
            newbillId = result.data.billId
            ufma.open({
              url: "optAdjust.html",
              title: "指标调整",
              width: 1090,
              //height: 250,
              data: {
                agencyCode: page.agencyCode,
                billId: rowData.billId,
                planId: page.planData.chrId,
                planData: page.planData,
                status: status,
                setYear: rowData.setYear,
                billCode: newBillCode,
                decomposeData: page.useTurnArgu,
                rgCode: page.rgCode,
                subRowData: rowData,
                status: "1",
                action: "add",
                newbillId: newbillId,
                sendCloName:page.sendCloName
              },
              ondestory: function (result) {
                //	page.setTable();
                page.getTableData()
              },
            })
          })
        })
        //新增需求启用：ZJGA820-208---增加指标停用、启用，有在途单据，即业务单据占用没有到终审，需提示出占用的单子，全部终审以后才能停用该指标；--zsj
        $("#mangerTable").on("click", ".btn-start ", function (e) {
          e.preventDefault()
          var rowIndex = $(this).attr("row-index")
          var bgItemId = $(this).attr("data-bgItemId")
          var rowData = {}
          if (rowIndex) {
            rowData = oTable.api(false).row(rowIndex).data()
          }
          var url =
            "/bg/ctrlManage/updateBgItemEnableStatus?agencyCode=" +
            rowData.agencyCode +
            "&setYear=" +
            rowData.setYear +
            "&rgCode=" +
            page.rgCode
          var argu = [
            {
              bgItemId: bgItemId,
              bgItemCode: rowData.bgItemCode,
            },
          ]
          ufma.post(url, argu, function (result) {
            ufma.showTip(
              result.msg,
              function () {
                page.getTableData()
              },
              result.flag
            )
          })
        })
        //新增需求停用：ZJGA820-208---增加指标停用、启用，有在途单据，即业务单据占用没有到终审，需提示出占用的单子，全部终审以后才能停用该指标；--zsj
        $("#mangerTable").on("click", ".btn-stop ", function (e) {
          e.preventDefault()
          var rowIndex = $(this).attr("row-index")
          var bgItemId = $(this).attr("data-bgItemId")
          var rowData = {}
          if (rowIndex) {
            rowData = oTable.api(false).row(rowIndex).data()
          }
          var url =
            "/bg/ctrlManage/updateBgItemDisableStatus?agencyCode=" +
            rowData.agencyCode +
            "&setYear=" +
            rowData.setYear +
            "&rgCode=" +
            page.rgCode
          var argu = [
            {
              bgItemId: bgItemId,
              bgItemCode: rowData.bgItemCode,
            },
          ]
          ufma.post(url, argu, function (result) {
            ufma.showTip(
              result.msg,
              function () {
                page.getTableData()
              },
              result.flag
            )
          })
        })
        $("#btnStart").on("click", function () {
          var checkData = []
          $("#mangerTable_wrapper")
            .find("input.checkboxes:checked")
            .each(function () {
              var rowIndex = $(this).attr("index")
              var rowData = {}
              if (rowIndex) {
                rowData = oTable.api(false).row(rowIndex).data()
              }
              checkData.push(rowData)
            })
          if (checkData.length == 0) {
            ufma.showTip("请选择一条指标！", function () {}, "warning")
            return false
          }
          var data = []
          for (var i = 0; i < checkData.length; i++) {
            var argu = {}
            argu.bgItemId = checkData[i].bgItemId
            argu.bgItemCode = checkData[i].bgItemCode
            data.push(argu)
          }
          var url =
            "/bg/ctrlManage/updateBgItemEnableStatus?agencyCode=" +
            page.agencyCode +
            "&setYear=" +
            page.setYear +
            "&rgCode=" +
            page.rgCode

          ufma.post(url, data, function (result) {
            ufma.showTip(
              result.msg,
              function () {
                page.getTableData()
              },
              result.flag
            )
          })
        })
        $("#btnStop").on("click", function () {
          var checkData = []
          $("#mangerTable_wrapper")
            .find("input.checkboxes:checked")
            .each(function () {
              var rowIndex = $(this).attr("index")
              var rowData = {}
              if (rowIndex) {
                rowData = oTable.api(false).row(rowIndex).data()
              }
              checkData.push(rowData)
            })
          if (checkData.length == 0) {
            ufma.showTip("请选择一条指标！", function () {}, "warning")
            return false
          }
          var data = []
          for (var i = 0; i < checkData.length; i++) {
            var argu = {}
            argu.bgItemId = checkData[i].bgItemId
            argu.bgItemCode = checkData[i].bgItemCode
            data.push(argu)
          }
          var url =
            "/bg/ctrlManage/updateBgItemDisableStatus?agencyCode=" +
            page.agencyCode +
            "&setYear=" +
            page.setYear +
            "&rgCode=" +
            page.rgCode

          ufma.post(url, data, function (result) {
            ufma.showTip(
              result.msg,
              function () {
                page.getTableData()
              },
              result.flag
            )
          })
        })
        // CWYXM-18144--ZJGA：指标授权时可以授权金额，指标使用时按授权金额对可使用余额进行控制--zsj--点击授权金额的操作按钮
        $("#mangerTable").on("click", ".btn-auth", function (e) {
          e.preventDefault()
          var rowIndex = $(this).attr("row-index")
          var rowData = {}
          if (rowIndex) {
            rowData = oTable.api(false).row(rowIndex).data()
          }
            ufma.open({
              url: "optAuth.html",
              title: "指标授权",
              width: 890,
              height: 600,
              data: {
                agencyCode: page.agencyCode,
                bgItemId: rowData.bgItemId,
                setYear: rowData.setYear,
                bgItemCode: rowData.bgItemCode,
                treeDepType: page.treeDepType,
                rgCode: page.rgCode,
                configType: 'AUTH_CUR'
              },
              ondestory: function (result) {
                //	page.setTable();
                page.getTableData()
              },
            })
        })
        //显示/隐藏列隐藏框--CWYXM-10173---可以设置表格区哪些列可以展示，哪些列不展示，同时实现列排序和记忆功能--zsj
        $("#colAction").on("click", function () {
          //if(page.chooseFlag == false) {
          page.setVisibleCol()
          var trLeng = $("#colListTable tbody tr").find("td.checkLab input")
            .length
          $("#colListTable tbody tr")
            .find("td.checkLab input")
            .each(function (i) {
              if (i < trLeng) {
                $(this).prop("checked", page.changeCol[i].visible)
              }
            })
          $("div.rpt-funnelBox").hide()
          $(this).next("div.rpt-funnelBox").show()
        })

        //确认添加列--CWYXM-10173---可以设置表格区哪些列可以展示，哪些列不展示，同时实现列排序和记忆功能--zsj
        $("#addCol").on("click", function () {
          page.chooseFlag = true
          page.configKey = ""
          page.configValue = ""
          var conValue = []
          var cbBgPlanId = $("#cbBgPlan").getObj().getValue()
          var cbBgPlanText = $("#cbBgPlan").getObj().getText()
          page.configKey = cbBgPlanId + "," + cbBgPlanText
          $("#colListTable tbody tr").each(function (i) {
            var tdSort = {}
            tdSort.title = $(this)
              .closest("tr")
              .find("td.treeClick")
              .attr("title")
            tdSort.data = $(this)
              .closest("tr")
              .find("td.treeClick")
              .attr("columnData")
            tdSort.seq = $(this).closest("tr").find("td.recNoTd").attr("title")
            if ($(this).find("td.checkLab input").is(":checked")) {
              tdSort.visible = true
            } else {
              tdSort.visible = false
            }
            conValue.push(tdSort)
          })
          var str = JSON.stringify(conValue)
          var newStr = str.replace(/\"/g, "'")
          page.configValue = newStr
          ufma.showloading("数据加载中 ，请耐心等待...")
          page.updateSessionTable()
        })
        //鼠标移入移除时显示及隐藏--CWYXM-10173---可以设置表格区哪些列可以展示，哪些列不展示，同时实现列排序和记忆功能--zsj
        $(document)
          .on("mouseenter", "div.rpt-funnelBox", function () {
            $(this).show()
            $("#colListTable tr")
              .find("td.btnGroup .btnDrag")
              .on("mousedown", function (e) {
                $(this)
                  .closest("tr")
                  .addClass("selectTr")
                  .siblings()
                  .removeClass("selectTr")
                //拖动时选中当前数据，并且拖动操作时滚动条跟随
                var callBack = function () {
                  page.adjAssitNo()
                }
                $("#colListTable").mangerTableSort(callBack)
              })
          })
          .on("mouseleave", "div.rpt-funnelBox", function () {
            $(this).hide()
          })
      },
      // 此方法必须保留
      init: function () {
        reslist = ufma.getPermission()
        ufma.isShow(reslist)
        page.pfData = ufma.getCommonData()
        page.agencyCode = page.pfData.svAgencyCode
        page.rgCode = page.pfData.svRgCode
        page.setYear = parseInt(page.pfData.svSetYear)
        page.chooseFlag = false;
        page.setShow = false;
        // CWYXM-18144--ZJGA：指标授权时可以授权金额，指标使用时按授权金额对可使用余额进行控制--zsj--查询系统选项
        page.authCurFlag = false;
        page.treeDepType = false;
        ufma.parse()
        uf.parse()
        this.initPage()
        //this.setTable();   //修改guohx  不选预算方案不展示表头
        this.onEventListener()
      },
    }
  })()
  // ///////////////////
  page.init()
})
