$(function () {
	var bgItemDefaults = {
		agencyCode: '',
		chrId: '',
		chrCode: '',
		createDateBegin: '',
		createDateEnd: '',
		businessDateBegin: '',
		businessDateEnd: '',
		bgItemCurMin: '',
		bgItemCurMax: '',
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
	var menuId = '0750bcb9-6845-4777-9221-80137052683e';
	var iValue = 0;
  var divId = 'budgetItemDetailQueryPersion';
  //ZJGA820-1788--指标登记簿的财政下达指标方案中发文文号没有变为财政指标id，其他模块在执行过脚本后变了--zsj
  var compireMember = []; // 存放记忆列数据
	var page = function () {
		var agencyCode = null;
		var oTable, status;

		var tblDt = null; //指标数据
		var pnlFindRst = null;
		var tblId = 'queryTable';
		var arrBgItemStatus = [{
			id: "1",
			name: "全部"
		}, {
			id: "2",
			name: "未审核"
		}, {
			id: "3",
			name: "已审核"
		}];
		var curBgStatus;
    var pageLength = ufma.dtPageLength('#queryTable');
    //CWYXM-18080 编制指标时需要增加文本说明项，只录入文本，用于描述指标信息--zsj
    var textCodeArr = []; //存放文本说明项code，方便记忆方案存值
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
						userId: page.pfData.svUserId, //修改权限  将svUserCode改为 svUserId  20181012
						userName: page.pfData.svUserName,
						rptType: 'budgetItemDetailQueryPersion'
					});
					page.moreMsgSetting.agencyCode = page.agencyCode;
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
					page.changeBgPlan();
					$('#targetState').getObj().val('1');
					//page.initSearchPnl();
					//ZWCW01036143 、ZWCW01036129：预算执行情况表、指标台账增加记忆列功能--zsj
					page.reqPnl = true;
					page.selectSessionPlan();
          page.selectSessionData(); //ZWCW01036143 、ZWCW01036129：预算执行情况表、指标台账增加记忆列功能--zsj
          page.getSysFlag();//CWYXM-18102 指标权限设置需要支持按人员库中的部门人员设置指标权限--zsj
				});
      },
      //CWYXM-18102 指标权限设置需要支持按人员库中的部门人员设置指标权限--zsj
      getSysFlag: function(){
        var bgUrl = '/bg/sysdata/selectSysRgParaValue?rgCode=' + page.pfData.svRgCode + '&setYear=' + page.setYear + '&agencyCode=' + page.agencyCode + '&chrCode=BG005';
        ufma.ajaxDef(bgUrl,'get',{},function(result){
          page.treeDepType = result.data
        })
      },
			//ZWCW01036143 、ZWCW01036129：预算执行情况表、指标台账增加记忆列功能--zsj
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
			//ZWCW01036143 、ZWCW01036129：预算执行情况表、指标台账增加记忆列功能--zsj
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
			//ZWCW01036143 、ZWCW01036129：预算执行情况表、指标台账增加记忆列功能--zsj
			setShowColumn: function () {
				if (page.setMenberData && page.setMenberData.length > 0) {
					if (page.chooseFlag == true) {
						page.setShow = true;
						page.initQueryTable();
						oTable.fnClearTable();
						if (page.tableAllData.length > 0) {
              oTable.fnAddData(page.tableAllData, true);
							//模拟滚动条
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
			//ZWCW01036143 、ZWCW01036129：预算执行情况表、指标台账增加记忆列功�����--zsj
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
					//page.initSearchPnl(); 
				});
			},
			//ZWCW01036143 、ZWCW01036129：预算执行情况表、指标台账增加记忆列功能--zsj
			//用于请求记忆方案
			updateSessionPlan: function () {
				var argu = {
					acctCode: "*",
					agencyCode: page.agencyCode,
					configKey: page.configKeyPlan,
					configValue: page.configValuePlan,
					menuId: menuId
				}

				ufma.post('/pub/user/menu/config/update', argu, function (reslut) {
					/*page.reqPnl = false;
					page.selectSessionPlan();*/
				});
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
                page.planData = []
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
                // for (var z = 0; z < data.planVo_Items.length; z++) {
                //   var code = data.planVo_Items[z].eleCode;
                //   if (code != 'sendDocNum' && code != 'bgItemIdMx'){
                //       codeArr.push(data.planVo_Items[z]);
                //   }
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
                if(page.planData.isSendDocNum == "是"){
                    var isSendDocNumObj = {
                      eleCode:"sendDocNum",
                      eleName:page.sendCloName,
                      bgItemCode:"sendDocNum"
                    }
                  codeArr.push(isSendDocNumObj)
                }
                // ZJGA820-1550 因为指标ID是唯一的，所以指标编制模块需增加一指标ID查询条件。--zsj
                if(page.planData.isFinancialBudget == "1"){
                    var isSendDocNumObj = {
                        eleCode:"bgItemIdMx",
                        eleName:'财政指标ID',
                        bgItemCode:"bgItemIdMx"
                    }
                    codeArr.push(isSendDocNumObj)
                } 
                page.planData.planVo_Items = codeArr;
								page.initBgPlanItemPnl($('#searchPlanPnl'), page.planData);
								//CWYXM-12055 --指标管理模块，指标台账页面的预算方案和指标编码二级联动有问题，现在切换预算方案，指标编码没有切换--zsj
								/*$('#bgItemCode p').html('请选择指标编码');
								$('#bgItemCode p').css('color', '#d9d9d9');
								page.showTblData();*/
								//CWYXM-12002 --指标管理-预算执行情况表,点击指标编码联查,查到的是全部指标台账,而不是对应编码的--zsj
								if (!$.isNull(page.balanceTurnDetailQueryPersion) && !$.isNull(page.balanceTurnDetailQueryPersion.bgItemCode) && page.turnFlag == true) {
									$('#bgItemCode p').html(page.balanceTurnDetailQueryPersion.bgItemCode); //CWYXM-10755 --指标预算执行情况表，编码联查到指标台账，应按所选指标带出预算方案--zsj
									$('.clearBill').css("margin-top", "-29px");
									$('#bgItemCode p').css('color', '#333');
									page.bgItemCode = page.balanceTurnDetailQueryPersion.bgItemCode;
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
								//从预算执行情况表跳转到指标台账
								if ($.isNull(page.balanceTurnDetailQueryPersion)) {
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
                    } else {
                      element.getObj().val('111');
                    }
									} else {
										element.getObj().val('111');
									}
								} else {
									element.getObj().val(page.balanceTurnDetailQueryPersion.bgPlanChrId);
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
						status: status,
						planChrId: $("#cbBgPlan").getObj().getValue()
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
						rptType: "budgetItemDetailQueryPersion",
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
					rptType: "budgetItemDetailQueryPersion"
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
          }else if(cbItem == 'bgItemIdMx'){
            searchMap['bgItemIdMx'] = $('#bgItemIdMx').val();
          } else if(cbItem == 'sendDocNum'){
            searchMap['sendDocNum'] = $('#sendDocNum').val();
          } else {
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
			//单据状态
			changeBgPlan: function () {
				$('#targetState').ufTreecombox({
					data: arrBgItemStatus,
					placeholder: "请选择单据状态",
					onChange: function () {
						curBgStatus = $('#targetState').getObj().getValue()
						if (curBgStatus == "1") {
							status = '';
						} else if (curBgStatus == "2") {
							status = 1;
						} else if (curBgStatus == "3") {
							status = 3;
						}
					}
				});
				ufma.isShow(reslist);
			},
			//获取查询数据
			getSearchMap: function (planData) {
				var searchMap = page.getBgPlanItemMap(planData);
				searchMap['agencyCode'] = page.agencyCode;
				searchMap['bgPlanChrId'] = $("#cbBgPlan").getObj().getValue();
				searchMap['setYear'] = planData.setYear;
				searchMap['bgItemCode'] = [];
				searchMap['status'] = status;
				searchMap['createDateBegin'] = $('#startDate').getObj().getValue();
				searchMap['createDateEnd'] = $('#endDate').getObj().getValue();
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
				//ZWCW01036143 、ZWCW01036129：预算执行情况表、指标台账增加记忆列功能--zsj
				var column = [{
					data: "rowno",
					title: "序号",
					className: "tc nowrap",
					width: "30px"
				}];
        var moneyArr = ['curAdd', 'curInTransit', 'curCut', 'curBalance'];
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
              // var oneAssi = bg.shortLineToTF(page.planData.planVo_Items[m].eleFieldName);
              var oneAssi = page.planData.planVo_Items[m].eleFieldName;
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
              var oneText = page.planData.planVo_Txts[n].eleFieldName;
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
            if(page.planData.isSendDocNum != "是" && page.setMenberData[i].data == 'SEND_DOC_NUM') {
              page.setMenberData.splice(i,1)
            }
            if(page.planData.isFinancialBudget != "1" && page.setMenberData[i].data == 'BG_ITEM_ID_MX') {
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
									if (rowdata.IS_BUS_BILL == '1') { //需要跳转
										var turnType = '';
										if (rowdata.BILL_TYPE_NAME == '凭证') {
											turnType = 'vouTurnType';
										} else if (rowdata.SYS_ID == 'AR') { //报销
											turnType = 'incomeArType';
										} else if (rowdata.SYS_ID == 'UP') { //采购
											turnType = 'upBillType';
										} else if (rowdata.SYS_ID == 'CM') { //合同
											turnType = 'cmBillType';
										}
										return '<a class="common-jump-link turnData" style="display:block;" href="javascript:;" data-turnTitle="' + rowdata.BILL_TYPE_NAME + '" title="' + data + '" data-billType="' + rowdata.BILL_TYPE + '" data-billStatus="' + rowdata.STATUS + '" data-billId="' + rowdata.BILL_ID + '" data-acctCode="' + rowdata.ACCT_CODE + '" data-turn="' + turnType + '">' + data + '</a>';
									} else { //不需要跳转
										return '<code title="' + data + '">' + data + '</code>';
									}
								}
							})
						} else if (setData == "ISUPBUDGET") {
							column.push({
								data: "IS_UP_BUDGET",
								title: "是否采购",
                className: "IS_UP_BUDGET isprint nowrap tc",
								// width: "120px"
							});
						} else if ($.inArray(setData, assiArr) > -1 && setData != "ISUPBUDGET"  && setData != "BG_ITEM_ID_MX" && setData != "SEND_DOC_NUM") {
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
											return '<code title="' + showData[1] + '">' + showData[1] + '</code>';
										} else {
											return '<code title="' + data + '">' + data + '</code>';
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
            } else if ((page.setMenberData[i].data == "SEND_DOC_NUM" || $.inArray('SEND_DOC_NUM',compireMember) == -1) && page.planData.isSendDocNum == "是") {//ZJGA820-1788--指标登记簿的财政下达指标方案中发文文号没有变为财政指标id，其他模块在执行过脚本后变了--zsj
              column.push({
                data: "SEND_DOC_NUM",
                title: page.sendCloName,
                // width: 200,
                className: "SEND_DOC_NUM isprint nowrap BGThirtyLen",
                "render": function (data) {
                  if (!$.isNull(data)) {
                    return '<code title="' + data + '">' + data + '</code>';
                  } else {
                    return '';
                  }
                }
              })
            } else if ((page.setMenberData[i].data == "BG_ITEM_ID_MX" || $.inArray('BG_ITEM_ID_MX',compireMember) == -1) && page.planData.isFinancialBudget == "1") {//ZJGA820-1788--指标登记簿的财政下达指标方案中发文文号没有变为财政指标id，其他模块在执行过脚本后变了--zsj
              column.push({
                data: 'BG_ITEM_ID_MX',
                title: '财政指标ID',
                className: 'BG_ITEM_ID_MX isprint nowrap BGThirtyLen',
                // width: 200,
                "render": function (data) {
                  if (!$.isNull(data)) {
                    return '<code title="' + data + '">' + data + '</code>';
                  } else {
                    return '';
                  }
                }
              });
						} else if (page.setMenberData[i].data != "BG_ITEM_ID_MX" && page.setMenberData[i].data != "SEND_DOC_NUM"){  //ZJGA820-1788--指标登记簿的财政下达指标方案中发文文号没有变为财政指标id，其他模块在执行过脚本后变了--zsj
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
					column.push({
						data: "BILL_DATE",
						title: "单据日期",
            className: "BILL_DATE isprint nowrap tc BGdateClass",
            // width: "85px"
            "render": function (data) {
              if (!$.isNull(data)) {
                return '<code title="' + data + '">' + data + '</code>';
              } else {
                return '';
              }
            }
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
							if (rowdata.IS_BUS_BILL == '1') { //需要跳转
								var turnType = '';
								if (rowdata.BILL_TYPE_NAME == '凭证') {
									turnType = 'vouTurnType';
								} else if (rowdata.SYS_ID == 'AR') { //报销
									turnType = 'incomeArType';
								} else if (rowdata.SYS_ID == 'UP') { //采购
									turnType = 'upBillType';
								} else if (rowdata.SYS_ID == 'CM') { //合同
									turnType = 'cmBillType';
								}
								return '<a class="common-jump-link turnData" style="display:block;" href="javascript:;" data-turnTitle="' + rowdata.BILL_TYPE_NAME + '" title="' + data + '" data-billType="' + rowdata.BILL_TYPE + '" data-billStatus="' + rowdata.STATUS + '" data-billId="' + rowdata.BILL_ID + '" data-acctCode="' + rowdata.ACCT_CODE + '" data-turn="' + turnType + '">' + data + '</a>';
							} else { //不需要跳转
								return '<code title="' + data + '">' + data + '</code>';
							}

						}
					}, { //CWYXM-10738 --指标台账，单据摘要及指标摘要，建议限制最大宽度--zsj
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
					}, { // CWYXM-18408--指标年结涉及采购合同报销模块占用的指标结转完善--zsj
            data: "BILL_TYPE_NAME",
            title: "指标类型",
            className: "BILL_TYPE_NAME isprint nowrap BGTenLen",
            // width: "200px",
            "render": function (data) {
              if (!$.isNull(data)) {
                return '<code title="' + data + '">' + data + '</code>';
              } else {
                return '';
              }
            }
          });
          //获取辅助核算项
          //CWYXM-18216 --已经有记忆列的预算方案重新修改辅助项时(在预算方案里增减辅助项)，界面显示不同步--zsj
          if (page.planData && !page.planData.needSendDocNum) {
            page.planData.needSendDocNum = page.sendCloName
          }
          if (page.planData) {
            curBgPlanEleMsg = _BgPub_GetBgPlanEle(page.planData);
            //for(var index = 0; index < curBgPlanEleMsg.eleCodeArr.length; index++) {
            for (var index = curBgPlanEleMsg.eleCodeArr.length - 1; index >= 0; index--) { //CWYXM-11317 --指标台账联查指标编码，查询方案中的要素顺序建议与预算方案一致--zsj
              //CWYXM-11697  预算方案中要素选择里，增加是否采购属性，启用之后，编制指标时可选是和否，不能输入其他值，采购模块选择指标时，根据这个属性过滤。--zsj
              if (curBgPlanEleMsg.eleCodeArr[index] == "ISUPBUDGET") {
                column.push({
                  data: "IS_UP_BUDGET",
                  title: "是否采购",
                  className: "IS_UP_BUDGET isprint nowrap tc",
                  // width: "120px"
                });
              } else if(curBgPlanEleMsg.eleCodeArr[index] != "sendDocNum"  && curBgPlanEleMsg.eleCodeArr[index] != "bgItemIdMx"){
                var cbData = curBgPlanEleMsg.eleFieldName[index].toUpperCase();
                column.push({
                  data: cbData,
                  title: curBgPlanEleMsg.eleNameArr[index],
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
                data: textCode,
                title: page.planData.planVo_Txts[k].eleName,
                className: textCode + ' ' + 'nowrap isprint BGThirtyLen',
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
						data: "BG_ITEM_CODE",
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
					}, {
						data: "curAdd",
						title: "指标增加",
						className: "curAdd bgPubMoneyCol isprint tdNum nowrap BGmoneyClass tr",
						// width: "150px",
						render: $.fn.dataTable.render.number(',', '.', 2, '')
					}, {
						data: "curInTransit",
						title: "在途金额",
						className: "curInTransit bgPubMoneyCol isprint tdNum nowrap BGmoneyClass tr",
						// width: "150px",
						render: $.fn.dataTable.render.number(',', '.', 2, '')
					}, {
						data: "curCut",
						title: "指标减少",
						className: "curCut bgPubMoneyCol isprint tdNum nowrap BGmoneyClass tr",
						// width: "150px",
						render: $.fn.dataTable.render.number(',', '.', 2, '')
					}, {
						data: "curBalance",
						title: "指标余额",
						className: "curBalance bgPubMoneyCol isprint tdNum nowrap BGmoneyClass tr",
						// width: "150px",
						render: $.fn.dataTable.render.number(',', '.', 2, '')
					}, { //CWYXM-10738 --指标台账，单据摘要及指标摘要，建议限制最大宽度--zsj
						data: "BG_ITEM_SUMMARY",
						title: "指标摘要",
						className: "BG_ITEM_SUMMARY isprint nowrap BGThirtyLen",
						// width: "150px",
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
								data: "COME_DOC_NUM",
								title: "来文文号",
								className: "COME_DOC_NUM isprint nowrap BGThirtyLen",
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
								data: "SEND_DOC_NUM",
								title: page.sendCloName,
								className: "SEND_DOC_NUM isprint nowrap BGThirtyLen",
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
            //CWYXM-17554 预算方案设置中，增加财政指标ID属性，可选择是否启用，启用时，选择预算方案新增指标时，需要录入指标id，指标id也需要参与指标的要素唯一性校验--zsj
            if (page.planData.isFinancialBudget == "1") {
							column.push({
								data: "BG_ITEM_ID_MX",
								title:  '财政指标ID',
                className: "BG_ITEM_ID_MX isprint nowrap BGThirtyLen",
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
								title: '指标台账',
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
            //模拟滚动条
            $('#queryTable').closest('.dataTables_wrapper').ufScrollBar({
              hScrollbar: true,
              mousewheel: false
            });
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
							// 	hScrollbar: true,
							// 	mousewheel: false
							// });
							// ufma.setBarPos($(window));
							$('.dataTables_wrapper.no-footer .dataTables_scrollBody').css("border-bottom", "1px solid transparent")
						} else {
							// $('#queryTable').closest('.dataTables_wrapper').ufScrollBar('destroy');
							$('.dataTables_wrapper.no-footer .dataTables_scrollBody').css("border-bottom", "1px solid transparent")
            }
            //ZJGA820-1579 指标账表每列的宽度增加可拖拽调整宽度的功能--zsj
            var widthTab = 0;
            $('#queryTable').tblcolResizable({},function(){
              for(var i=0;i< $("#queryTable thead").find('th').length;i++){
                widthTab += $("#queryTable thead").find('th').eq(i).css('width')
              }
            });   
            $("#queryTable").css('width',widthTab)                          
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
			//ZWCW01036143 、ZWCW01036129：预算执行情况表、指标台账增加记忆列功能--zsj
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
			//ZWCW01036143 、ZWCW01036129：预算执行情况表、指标台账增加记忆列功能--zsj
			adjAssitNo: function () {
				var idx = 0;
				$('#colListTable tbody tr').each(function () {
					idx = idx + 1;
					$(this).find('.recNoTd').html(idx);
					$(this).find('.recNoTd').attr('title', idx);
				});
			},
			//ZWCW01036143 、ZWCW01036129：预算执行情况表、指标台账增加记忆列功能--zsj
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
			//ZWCW01036143 、ZWCW01036129：预算执行情况表、指标台账增加记忆列功能--zsj
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
				var surl = "/bg/report/getTzReport/";
				var argu = page.getSearchMap(page.planData);
        argu.includePermission = 1; //个人版按权限过滤指标
        argu.bgRuleDeportFrom = page.treeDepType; //CWYXM-18102 指标权限设置需要支持按人员库中的部门人员设置指标权限--zsj
				if (!$.isNull(argu.bgPlanChrId)) {
					ufma.showloading('数据加载中，请耐心等待...');
					ufma.post(surl,
						$.extend({}, bgItemDefaults, argu),
						function (result) {
							ufma.hideloading();
							if (result.flag === "success") {
								tblDt = result.data
								for (var i = 0; i < tblDt.length; i++) {
									if (tblDt[i].BG_ITEM_RESERVE == '1') {
										tblDt[i].BILL_TYPE_NAME = "预拨指标";
									} else if (tblDt[i].BG_ITEM_RESERVE == '2') {
										tblDt[i].BILL_TYPE_NAME = "预拨指标(已批复)";
									} else {
										if ((tblDt[i].SYS_ID == 'AR' || tblDt[i].SYS_ID == 'UP' || tblDt[i].SYS_ID == 'CM')) {

										} else {
											tblDt[i].BILL_TYPE_NAME = _bgPub_getBillTypeName(tblDt[i].BILL_TYPE); //用bill_type对应bill_type_name
										}
									}
								}
							} else {
								ufma.hideloading();
								ufma.showTip(result.msg, null, "error");
							}
							//加载指标-增加、减少、余额-----begin
							var mainTableData = result.data,
								totalMoney = 0.00,
								bgBalance = 0.00,
								bgRowCur = 0.00,
								curBgItemId = '',
								isAdd = false;
							for (var i = 0; i < mainTableData.length; i++) {
								i > 0 && (curBgItemId = mainTableData[i - 1].BG_ITEM_ID);
								if (curBgItemId != '' && curBgItemId != mainTableData[i].BG_ITEM_ID) {
									bgBalance = mainTableData[i].ROWCUR;
									bgRowCur = Math.abs(mainTableData[i].ROWCUR); //加绝对值
									isAdd = true;
									totalMoney += mainTableData[i].ROWCUR;
								} else {
									if (mainTableData[i].ORDR == "1") {
										totalMoney += mainTableData[i].ROWCUR;
										bgBalance += mainTableData[i].ROWCUR;
										isAdd = mainTableData[i].ROWCUR >= 0;
										bgRowCur = Math.abs(mainTableData[i].ROWCUR);
									} else if (mainTableData[i].SYS_ID == "GL" && mainTableData[i].ROWCUR < 0) {
										totalMoney -= mainTableData[i].ROWCUR;
										bgBalance -= mainTableData[i].ROWCUR;
										isAdd = mainTableData[i].ROWCUR < 0;
										bgRowCur = Math.abs(mainTableData[i].ROWCUR);
									} else if (mainTableData[i].IN_TRANSIT == '1') {
										totalMoney -= mainTableData[i].ROWCUR;
										bgBalance -= mainTableData[i].ROWCUR;
										isAdd = false;
										bgRowCur = mainTableData[i].ROWCUR;
									} else {
										totalMoney -= mainTableData[i].ROWCUR;
										bgBalance -= mainTableData[i].ROWCUR;
										isAdd = false;
										bgRowCur = Math.abs(mainTableData[i].ROWCUR);
									}
								}
								if (mainTableData[i].IN_TRANSIT == "1") {
									mainTableData[i].curAdd = "";
									mainTableData[i].curCut = "";
									mainTableData[i].curInTransit = bgRowCur;
								} else {
									mainTableData[i].curAdd = (isAdd ? bgRowCur : " ");
									mainTableData[i].curCut = (isAdd ? " " : bgRowCur);
									mainTableData[i].curInTransit = "";
								}

								//								mainTableData[i].curAdd = (isAdd ? bgRowCur : " ");
								//								mainTableData[i].curCut = (isAdd ? " " : bgRowCur);
								mainTableData[i].curBalance = bgBalance
								if (mainTableData[i].BILL_CODE == null) {
									mainTableData[i].BILL_CODE = " ";
								}
								mainTableData[i].rowno = i + 1;
								if (!$.isNull(mainTableData[i].BILL_CREATE_DATE) && !$.isEmptyObject(mainTableData[i].BILL_CREATE_DATE)) {
									mainTableData[i].BILL_DATE = mainTableData[i].BILL_CREATE_DATE.substring(0, 10);
								}
								if (mainTableData[i].BG_ITEM_RESERVE == "1") {
									mainTableData[i].BILL_TYPE_NAME = "预拨指标";
									mainTableData[i].BILL_DATE = mainTableData[i].CREATE_DATE.substring(0, 10);
								} else if (mainTableData[i].BG_ITEM_RESERVE == "2") {
									mainTableData[i].BILL_TYPE_NAME = "预拨指标(已批复)";
									mainTableData[i].BILL_DATE = mainTableData[i].CREATE_DATE.substring(0, 10);
								} else {
									if (mainTableData[i].SYS_ID == 'AR' || mainTableData[i].SYS_ID == 'UP' || tblDt[i].SYS_ID == 'CM') {

									} else {
										mainTableData[i].BILL_TYPE_NAME = _bgPub_getBillTypeName(mainTableData[i].BILL_TYPE);
									}
								}
								mainTableData[i].bgItemBalanceCurShow = mainTableData[i].bgItemBalanceCur;
							}
							//加载指标-增加、减少、余额-----end
							oTable.fnClearTable();
							//$("#billsCount").text(mainTableData.length); //数量
							//$("#billsTotalMoney").text($.formatMoney(totalMoney, 2)); //总额
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
			//凭证权限--联查凭证--CWYXM-4393--从指标台账跳入凭证录入--zsj
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
      // 方案相关
	//方案初始化begin
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
		setTimeout(function() {
			$('#planItemMore').find('.form-group').each(function() {
				var code = $(this).attr('eleCode');
				if(code == 'ISUPBUDGET') {
					$('#isUpBudget').getObj().val(tmpDataArr.isUpBudget);
				} else if(code == 'sendDocNum') {
					$('#sendDocNum').val(tmpDataArr.sendDocNum);
				} else if(code == 'bgItemIdMx') {
					$('#bgItemIdMx').val(tmpDataArr.bgItemIdMx);
				} else {
          for(var z = 0; z < assiData.length; z++) {
            if(assiData[z].eleCode == code && assiData[z].eleCode != 'ISUPBUDGET' && assiData[z].eleCode != 'bgItemIdMx' && assiData[z].eleCode != 'sendDocNum'){
              if($.inArray(assiData[z].bgItemCode,assiArr) > -1) {
                var valueItem = assiData[z].itemValue;
                if(valueItem && valueItem.length > 0) {
                  $('#cb' + code).getObj().val(assiData[z].itemValue[0].id);
                } else {
                  $('#cb' + code).getObj().val('');
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
	delPlan: function(agencyCode, planCode, planName, argu, _callback) {
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
				//更多
				$('.label-more').click(function () {
					if ($('.label-more span').text() == '更多') {
						$('.label-more span').text('收起')
					} else {
						$('.label-more span').text('更多')
          }
           // CWYXM-18872 --指标明细账,点击更多后界面乱了,具体见截图--zsj
          setTimeout(function(){
            $('#tool-bar').css('top',$('.workspace-top').height()+$('.workspace-center').height() + 2 + 'px')
          },100)
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
				//联查凭证--CWYXM-4393--从指标台账跳入凭证录入--zsj
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
					cacheData.rgCode = page.pfData.svRgCode;
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
								var baseUrl = '/pf/gl/vou/index.html?menuid=f24c3333-9799-439a-94c9-f0cdf120305d&dataFrom=budgetItemDetailQueryPersion&action=query&vouGuid=' + vouGuid + '&agencyCode=' + page.agencyCode + '&acctCode=' + page.tableAcctCode;
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
						//var url = '/pf/pvdf/index.html#/bd/openPage?productCode=CM&type=select&billTabUuid=&billTempletUuid=942CEC3EF0EE483B8111598C5A2E56FD&menuid=786ad277-d33b-46ce-9b20-bf4b0e80861c&businessKey=' + id;
            //ZJGA820-1783 --指标台账中点击采购与合同的单据编号跳转到单据页面为空白的。--zsj
            var url = '/pf/pvdf/bd/projectReporting?type=select&cardTempletId=DEE4CABB5F6F4F54895864145C09A4B3&menuid=5c15ae58-a926-409a-b2f3-2de51fb893d3&searchStatus=-1&productCode=CM&rowId=' + id;
            uf.openNewPage(page.isCrossDomain, $(this), 'openMenu', url, false, "合同");
					} else if (page.turnType == 'upBillType') { //采购
						var id = page.tableBillId;
						//var url = '/pf/pvdf/index.html#/bd/openPage?productCode=UP&type=select&billTabUuid=AC48E39C559542EEA9DD87E802D172CA&billTempletUuid=AEAA449CEF3149FCA033F069EC833C8A&menuid=2511c30a-46aa-4885-808e-5ee0a78bfb45&businessKey=' + id;
            //ZJGA820-1783 --指标台账中点击采购与合同的单据编号跳转到单据页面为空白的。--zsj
            var url = '/pf/pvdf/bd/projectReporting?type=select&cardTempletId=7296A057B46C4C3DB9F19E4B0C39C341&menuid=9967f3e1-20e0-4e6c-ad88-5a02c4d32a67&searchStatus=-1&productCode=UP&rowId=' + id;
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
							rptType: 'budgetItemDetailQueryPersion'
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
					//CWYXM-10949 --指标台账-编码选择弹窗，查询条件显示需修改--zsj
          var item = items[i];
          // CWYXM-18052 指标台账-账表查询,查询条件要素不一致间距就错了--zsj
          if (item.eleCode == 'sendDocNum' || item.eleCode == 'bgItemIdMx') {
            $curgroup = $('<div class="form-group"  eleCode="' + item.eleCode + '"  eleName="' + item.eleName + '" bgItemCode="' + item.bgItemCode + '"  style="margin-top:8px;width:30em;margin-left:1em;"></div>').prependTo($curRow);
            $('<lable class="control-label auto commonShowLab" title="' + item.eleName + '" style="display:inline-block;width:10em;text-align: right;vertical-align: sub;">' + item.eleName + '：</lable>').appendTo($curgroup);
          } else  if (item.eleCode == 'ISUPBUDGET'){
            $curgroup = $('<div class="form-group"  eleCode="' + item.eleCode + '"  eleName="' + item.eleName + '" bgItemCode="' + item.bgItemCode + '"  style="margin-top:8px;width:30em;margin-left:1em;"></div>').prependTo($curRow);
            $('<lable class="control-label auto commonShowLab" title="' + item.eleName + '" style="display:inline-block;width:10em;text-align: right;vertical-align: sub; ">' + item.eleName + '：</lable>').appendTo($curgroup);
          } else {
            $curgroup = $('<div class="form-group"  eleCode="' + item.eleCode + '"  eleName="' + item.eleName + '" bgItemCode="' + item.bgItemCode + '"  style="margin-top:8px;width:30em;margin-left:1em;"></div>').prependTo($curRow);
            $('<lable class="control-label auto commonShowLab" title="' + item.eleName + '" style="display:inline-block;width:10em;text-align: right;vertical-align: middle; ">' + item.eleName + '：</lable>').appendTo($curgroup);
          }
					if (item.eleCode == 'ISUPBUDGET') {
            var formCtrl = $('<div id="isUpBudget" class="typeTree uf-combox" style=" width:300px;margin-left:4px;margin-top: -4px;"></div>').appendTo($curgroup);
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
            var formCtrl = $('<input id="sendDocNum" class="form-control" style=" width:300px;margin-left:3px;margin-top: -13px;"/>').appendTo($curgroup);
					} else if (item.eleCode == 'bgItemIdMx') {
            var formCtrl = $('<input id="bgItemIdMx" class="form-control" style=" width:300px;margin-left:3px;margin-top: -13px;"/>').appendTo($curgroup);
					} else {
						var formCtrl = $('<div id="cb' + item.eleCode + '" class="typeTree uf-treecombox" style=" width:300px;margin-left: 4px;"></div>').appendTo($curgroup);
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
          var $curgroupTetx = $('<div class="form-group"  eleCode="' + textItem.eleCode + '"  eleName="' + textItem.eleName + '" bgItemCode="' + textItem.bgItemCode + '"  style="margin-top:8px;width:30em;margin-left:1em;"></div>').appendTo($curRowTetx);
          $('<lable class="control-label auto commonShowLab" title="' + textItem.eleName + '" style="display:inline-block;width:10em;text-align: right;vertical-align: sub;">' + textItem.eleName + '：</lable>').appendTo($curgroupTetx);
          var formCtrl = $('<input id="'+codeId+'" class="form-control" style=" width:300px;margin-left:3px;margin-top: -13px;"/>').appendTo($curgroupTetx);
        }
			},
			//初始化页面
			initPage: function () {
				this.initAgency();
				//CWYXM-11195 --指标台账，查询默认日期应为登录年度，目前为服务器年度--zsj
				$('#startDate').ufDatepicker({
					format: 'yyyy-mm-dd',
					initialDate: new Date(page.setYear, 0, 1)
				});
				//CWYXM-11195 --指标台账，查询默认日期应为登录年度，目前为服务器年度--zsj
				$('#endDate').ufDatepicker({
					format: 'yyyy-mm-dd',
					initialDate: new Date(page.pfData.svTransDate)
				});
				if (!$.isNull(page.balanceTurnDetailQueryPersion)) {
					if (!$.isNull(page.balanceTurnDetailQueryPersion.bgItemCode)) {
						$('#bgItemCode').val(page.balanceTurnDetailQueryPersion.bgItemCode)
					}
				}
				page.initQueryTable();
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
				page.setYear = parseInt(page.pfData.svSetYear);
				page.isCrossDomain = false;
				page.chooseFlag = false;
				page.setShow = false;
				page.balanceTurnDetailQueryPersion = '';
				page.showTrue = true;
				var myDataFrom = page.GetQueryString("dataFrom");
				if (!$.isNull(myDataFrom)) {
					page.balanceTurnDetailQueryPersion = JSON.parse(window.sessionStorage.getItem("balanceTurnDetailQueryPersion"));
					if (!$.isEmptyObject(page.balanceTurnDetailQueryPersion)) {
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
					"rptType": 'budgetItemDetailQueryPersion',
					'rebuild': true
				};
				page.contentObj = {};
			}
		}
	}();

	page.init();
});