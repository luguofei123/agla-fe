/**
 *报表的查询方案头部
 */

var _bgPub_PNL_ReportFind_getFlagDiv = function (divId, text, data) {
	var rst = "<div class='bgPub-case-pnl rptCaseDiv' style='padding-top:1px; top: 3px;' id='" + divId + "' data='" + data + "'>" +
		"<div class='casefont' id='casefont_" + divId + " ' title='" + text + "'>" + text + "&nbsp;&nbsp;<b class='glyphicon icon-close deletebutton'></b></div>" +

		"</div>" +
		"</div>";
	return rst;
};

var _bgPub_PNL_ReportFind_getFlagDiv_addAction = function (divId, selfFunc) {
	$("#" + divId).off("click").on("click", function (e) {
		$(this).remove();
		if (!$.isNull(selfFunc)) {
			selfFunc($(this).attr("data"));
		}
	});
};

/**
 * 获得具体的组件ID
 * @param divId
 * @return {{morePlanBtn: string, findMsgLeftDiv: string, findTable: string, lastDate: string, comboboxMoney: string, inputFrom: string, inputTo: string, saveBtn: string, findBtn: string, caseSetBtn: string, moreConditionBtn: string, setCaseModalId: string, setCaseByBgItem: string, setCaseByCtrl: string, listOfCase: string, allBgItemList: string, choisedBgItemList: string, choiseItemBtn: string, disChoiseItemBtn: string, bgCtrlListDiv: string, btnModalClose: string, btnModalOK: string}}
 * @private
 */
var _bgPub_PNL_ReportFind_initId = function (divId) {
	return {
		morePlanBtn: "_reportFindMore_morePlanBtn_" + divId,
		findMsgLeftDiv: "_reportFindMore_findMsgLeftDiv_" + divId,
		findTable: "_reportFindMore_findTable_" + divId,
		lastDate: "_reportFindMore_lastDate_" + divId,
		//comboboxMoney : "_reportFindMore_cbbMoney_" + divId,
		inputFrom: "_reportFindMore_inputFrom_" + divId,
		inputTo: "_reportFindMore_inputTo_" + divId,
		saveBtn: "_reportFindMore_saveBtn_" + divId,
		findBtn: "_reportFindMore_findBtn_" + divId,
		caseSetBtn: "_reportFindMore_caseSetBtn_" + divId,
		moreConditionBtn: "_reportFindMore_moreConditionBtn_" + divId,
		setCaseModalId: "_reportFindMore_setCaseModalId_" + divId,
		setCaseByBgItem: "_reportFindMore_setCaseByBgItem_" + divId,
		setCaseByCtrl: "_reportFindMore_setCaseByCtrl_" + divId,
		listOfCase: "_reportFindMore_listOfCase_" + divId,
		allBgItemList: "_reportFindMore_allBgItemList_" + divId,
		choisedBgItemList: "_reportFindMore_choisedBgItemList_" + divId,
		choiseItemBtn: "_reportFindMore_choiseItemBtn_" + divId,
		disChoiseItemBtn: "_reportFindMore_disChoiseItemBtn_" + divId,
		bgCtrlListDiv: "_reportFindMore_bgCtrlListDiv_" + divId,
		btnModalClose: "_reportFindMore_btnModalClose_" + divId,
		btnModalOK: "_reportFindMore_btnModalOK_" + divId,
		bgPlanName: "_reportFindMore_bgPlanName_" + divId
	};
};
var _setting;
/**
 * ********** 主函数入口 *****************
 * @param divId : 更多  的内部会部署到哪个div上。"
 * @param setting :设置,json:
 *    agencyCode   : string 单位代码
 *    rptType : string 报表类型
 *    userId : string  //属性叫userId， 实际上是userCode 千万别穿错了
 *    userName : string
 *    computHeight : function 点击 更多/收起 按钮时调用，传入参数：$("#" + _id_bgPub_div_find_Left_tbl).css("height") 变动前的值，变动后的值
 *    doFindBySelf :function(eleInBgItemObj) 点击 查找 按钮时，如果此函数!=null 则调用此函数，传入pnl用户输入的单数。
 *                                否则调用自带函数。
 * @return   rst.curBgPlan : 当前的预算方案data;
 rst.curBgPlanMsg : 当前预算方案的json信息，是_curBgPlanMsg的对象;
 rst.curHeight : 当前头部的高度；
 */
var _bgPub_PNL_ReportFind = function (divId, setting) {
	_setting = $.extend({}, setting);
	_setting.id = $.extend({}, _bgPub_PNL_ReportFind_initId(divId))
	if (!setting.rebuild) {
		var _html = _bgPub_getModalHtml("bgPubReportFindPnl");
		_html = _html.replace("{morePlanBtn}", _setting.id.morePlanBtn).replace("{findMsgLeftDiv}", _setting.id.findMsgLeftDiv).
		replace("{findTable}", _setting.id.findTable).replace("{lastDate}", _setting.id.lastDate).
		replace("{comboboxMoney}", _setting.id.comboboxMoney).replace("{inputFrom}", _setting.id.inputFrom).
		replace("{inputTo}", _setting.id.inputTo).replace("{saveBtn}", _setting.id.saveBtn).
		replace("{findBtn}", _setting.id.findBtn).replace("{moreConditionBtn}", _setting.id.moreConditionBtn).
		replace("{listOfCase}", _setting.id.listOfCase).replace("{caseSetBtn}", _setting.id.caseSetBtn).
		replace("{setCaseModalId}", _setting.id.setCaseModalId).replace("{setCaseByBgItem}", _setting.id.setCaseByBgItem).
		replace("{setCaseByCtrl}", _setting.id.setCaseByCtrl).replace("{allBgItemList}", _setting.id.allBgItemList).
		replace("{choisedBgItemList}", _setting.id.choisedBgItemList).replace("{choiseItemBtn}", _setting.id.choiseItemBtn).
		replace("{disChoiseItemBtn}", _setting.id.disChoiseItemBtn).replace("{bgCtrlListDiv}", _setting.id.bgCtrlListDiv).
		replace("{btnModalClose}", _setting.id.btnModalClose).replace("{btnModalOK}", _setting.id.btnModalOK).
		replace("{bgPlanName}", _setting.id.bgPlanName);
		if ($("#" + divId).html() != null && $("#" + divId).html().trim() != '') {
			$("#" + divId).empty();
		}
		$("#" + divId).append(_html);
		uf.parse(); //格式化插件
	}
	var doLoadBgItems = function () {
		var url = "/bg/sysdata/getAllItemsInUse";
		var argu = {
			"setYear": ufma.getCommonData().svSetYear,
			"rgCode": ufma.getCommonData().svRgCode,
			"agencyCode": _setting.agencyCode
		}
		ufma.ajaxDef(url, "get", argu, function (result) {
			if (!result.data) return false;
			$("#" + _setting.id.allBgItemList).empty();
			$("#" + _setting.id.choisedBgItemList).empty();
			var items = result.data.planVo_Items;
			//CWYXM-9939 指标-汇总分析表，设置结果应保留上次选择结果--zsj
			var allArr = [];
			if (items.length > 0) {
				for (var i = 0; i < items.length; i++) {
					allArr.push(items[i].bgItemCode);
				}
			}
			if (!$.isNull(dm.moreMsgSetting.bgAttrStr)) {
				if (dm.moreMsgSetting.bgAttrStr.length == items.length) {
					if (dm.moreMsgSetting.bgAttrStr.length > 0) {
						var selectItems = dm.moreMsgSetting.bgAttrStr;
						for (var i = 0; i < selectItems.length; i++) {
							var tmpItem = selectItems[i];
							var _subHtml =
								"<div class='bgpub-bgnormal-postion-1 unselectBgItem' chrId='" + tmpItem.chrId + "' " +
								"eleCode='" + tmpItem.itemField + "' eleName='" + tmpItem.itemName + "'  bgItemCode='" + tmpItem.bgItemCode + "'>" +
								"<h5 style='padding-left: 23px;'>" + tmpItem.itemName + "</h5>" +
								"</div>";
							$("#" + _setting.id.choisedBgItemList).append(_subHtml);
						}
					}
				} else if (dm.moreMsgSetting.bgAttrStr.length < items.length) {
					var choisedArr = [];
					if (dm.moreMsgSetting.bgAttrStr.length > 0) {
						var selectItems = dm.moreMsgSetting.bgAttrStr;
						var subArr = [];
						for (var i = 0; i < selectItems.length; i++) {
							var tmpItem = selectItems[i];
							var _subHtml =
								"<div class='bgpub-bgnormal-postion-1 unselectBgItem' chrId='" + tmpItem.chrId + "' " +
								"eleCode='" + tmpItem.itemField + "' eleName='" + tmpItem.itemName + "'  bgItemCode='" + tmpItem.bgItemCode + "'>" +
								"<h5 style='padding-left: 23px;'>" + tmpItem.itemName + "</h5>" +
								"</div>";
							$("#" + _setting.id.choisedBgItemList).append(_subHtml);
							choisedArr.push(tmpItem.bgItemCode);
						}
						for (var j = 0; j < allArr.length; j++) {
							var code = allArr[j];
							if ($.inArray(code, choisedArr) === -1) {
								subArr.push(allArr[j]);
							}
						}
						var finalArr = [];
						for (var n = 0; n < items.length; n++) {
							var code = items[n].bgItemCode;
							if ($.inArray(code, subArr) > -1) {
								finalArr.push(items[n]);
							}
						}
						for (var m = 0; m < finalArr.length; m++) {
							var tmpItem = finalArr[m];
							var _subHtml =
								"<div class='bgpub-bgnormal-postion-1 unselectBgItem' chrId='" + tmpItem.chrId + "' " +
								"eleCode='" + tmpItem.eleCode + "' eleName='" + tmpItem.eleName + "' bgItemCode='" + tmpItem.bgItemCode + "'>" +
								"<h5 style='padding-left: 23px;'>" + tmpItem.eleName + "</h5>" +
								"</div>";
							$("#" + _setting.id.allBgItemList).append(_subHtml);
						}
					} else {
						for (var i = 0; i < items.length; i++) {
							var tmpItem = items[i];
							var _subHtml =
								"<div class='bgpub-bgnormal-postion-1 unselectBgItem' chrId='" + tmpItem.chrId + "' " +
								"eleCode='" + tmpItem.eleCode + "' eleName='" + tmpItem.eleName + "' bgItemCode='" + tmpItem.bgItemCode + "'>" +
								"<h5 style='padding-left: 23px;'>" + tmpItem.eleName + "</h5>" +
								"</div>";
							$("#" + _setting.id.allBgItemList).append(_subHtml);
						}
					}
				}
			}

			/*	}
			}*/

			//页签一 - 事件 - 点击全部要素列表中的某条要素，其处于选中状态
			$("#" + _setting.id.allBgItemList).find(".unselectBgItem").off("click").on("click", function (index, obj) {
				$("#" + _setting.id.allBgItemList).find(".unselectBgItem").removeClass("bgPub-divSelected-1");
				$(this).addClass("bgPub-divSelected-1");
			});
			//页签一 - 事件 - 点击已选中要素列表中的某条要素，其处于选中状态
			$("#" + _setting.id.choisedBgItemList).find(".unselectBgItem").off("click").on("click", function (index, obj) {
				$("#" + _setting.id.choisedBgItemList).find(".unselectBgItem").removeClass("bgPub-divSelected-1");
				$(this).addClass("bgPub-divSelected-1");
			});
			//页签一 - 事件 - 点击选中按钮
			$("#" + _setting.id.choiseItemBtn).off("click").on("click", function () {
				var aSelectedItem = $("#" + _setting.id.allBgItemList).find("div.bgPub-divSelected-1");
				if (aSelectedItem.length == 0) {
					ufma.showTip("请选中一条要素", null, "warning");
					return false;
				}
				aSelectedItem.removeClass("bgPub-divSelected-1");
				$("#" + _setting.id.choisedBgItemList).append(aSelectedItem.prop("outerHTML"));
				aSelectedItem.remove();

				//页签一 - 事件 - 点击已选中要素列表中的某条要素，其处于选中状态
				$("#" + _setting.id.choisedBgItemList).find(".unselectBgItem").off("click").on("click", function (index, obj) {
					$("#" + _setting.id.choisedBgItemList).find(".unselectBgItem").removeClass("bgPub-divSelected-1");
					$(this).addClass("bgPub-divSelected-1");
				});
			});
			//页签一 - 事件 - 点击取消选中按钮
			$("#" + _setting.id.disChoiseItemBtn).off("click").on("click", function () {
				var aSelectedItem = $("#" + _setting.id.choisedBgItemList).find("div.bgPub-divSelected-1");
				if (aSelectedItem.length == 0) {
					ufma.showTip("请选中一条要素", null, "warning");
					return false;
				}
				aSelectedItem.removeClass("bgPub-divSelected-1");
				$("#" + _setting.id.allBgItemList).append(aSelectedItem.prop("outerHTML"));
				aSelectedItem.remove();

				//页签一 - 事件 - 点击全部要素列表中的某条要素，其处于选中状态
				$("#" + _setting.id.allBgItemList).find(".unselectBgItem").off("click").on("click", function (index, obj) {
					$("#" + _setting.id.allBgItemList).find(".unselectBgItem").removeClass("bgPub-divSelected-1");
					$(this).addClass("bgPub-divSelected-1");
				});
			});
		});

	};
	var getModalSelectedResult = function () {
		var sSelectedType = "";
		var sSelectedCtrlPlanId = "";
		var aSelectedItems = [];

		var $checkedInput = $("#" + _setting.id.setCaseModalId + " input:radio:checked");
		var tmpIndex = $checkedInput.attr("pageindex");

		if (tmpIndex == "1") {
			sSelectedType = "1"; //按要素选择
			$("#" + _setting.id.choisedBgItemList).find(".unselectBgItem").each(function (index, obj) {
				var tmpItem = {
					chrId: '',
					eleCode: $(this).attr("eleCode"),
					eleName: $(this).attr("eleName"),
					bgItemCode: $(this).attr("bgItemCode")
				};
				aSelectedItems[aSelectedItems.length] = tmpItem;
			});
		} else {
			sSelectedType = "2"; //按方案选择
			sSelectedCtrlPlanId = "";
			var $tmpCtrl = $("#" + _setting.id.bgCtrlListDiv).find("input:radio:checked");
			$tmpCtrl.closest("div.ctrlPlanDiv").find("div.ctrlPlanItem").each(function (index, obj) {
				var tmpItem = {
					chrId: "",
					eleCode: $(this).attr("eleCode"),
					eleName: $(this).attr("eleName"),
					bgItemCode: $(this).attr("bgItemCode")
				};
				aSelectedItems[aSelectedItems.length] = tmpItem;
			});
		}
		return {
			"selectedType": sSelectedType,
			"selectedCtrlPlanId": sSelectedCtrlPlanId,
			"selectedItems": aSelectedItems
		};
	};

	//1, 给按钮挂接事件.
	//1.1 事件 - 更多 按钮
	$("#" + _setting.id.moreConditionBtn).off("click").on("click", function () {
		if ($(this).text() == "更多") { //点击更多按钮，打开全部表格
			$(this).text("收起");
			$("#" + _setting.id.findTable + " tbody").find("tr").show();
		} else { //点击 收起 按钮。收起表格
			$(this).text("更多");
			$("#" + _setting.id.findTable + " tbody").find("tr:gt(2)").hide();
		}
	});
	//1.2 事件 - 设置 按钮 （ 打开 模态框 ）
	if (_setting.rebuild) { //重构页面执行
		//初始化数据
		$(".tabController").hide();
		$("#" + _setting.id.setCaseByBgItem).prop("checked", "true");
		$(".tabController.step1").show();
		doLoadBgItems(); //只加载一次
	} else {

		$("#" + _setting.id.caseSetBtn).off("click").on("click", function () {
			var tmpModal = ufma.showModal(_setting.id.setCaseModalId, 800, 628, function () {
				//关闭时执行
			});

			//重新计算content的高度。自动计算的不对
			var contentHeight = parseFloat($(".u-msg-dialog").css("height"));
			contentHeight = contentHeight - tmpModal.modal.find('.u-msg-title').outerHeight(true);
			tmpModal.modal.find('.u-msg-footer').each(function (ele) {
				contentHeight = contentHeight - $(this).outerHeight(true);
			});
			tmpModal.msgContent.css('height', contentHeight + 'px');

			_setting.modalObj = $.extend({}, tmpModal);

			//初始化数据
			$(".tabController").hide();
			$("#" + _setting.id.setCaseByBgItem).prop("checked", "true");
			$(".tabController.step1").show();
			doLoadBgItems(); //只加载一次
			// doLoadBgCtrlPlans();
			var height1 = $(".u-msg-content").outerHeight(false) - 37 - 22 - 30;
			$(".bgRptCaseItemChoise").css("min-height", height1 + "px");
			$(".bgRptCaseItemChoise").css("max-height", height1 + "px");
			$(".bgRptCaseItemChoise").css("border-radius", "3px");
		});
	}
	//1.3 事件 - [模态框] 顶部的radiobutton选择事件
	$("#" + _setting.id.setCaseModalId + " input:radio").off("change").on("change", function () {
		var $checkedInput = $("#" + _setting.id.setCaseModalId + " input:radio:checked");

		var tmpIndex = $checkedInput.attr("pageindex");
		$(".tabController").hide();
		if (tmpIndex == "1") {
			$(".tabController.step1").show();
			// doLoadBgItems();
		} else {
			$(".tabController.step2").show();
			// doLoadBgCtrlPlans();
		}
	});
	//1.4 事件 - [模态框] 的 确认 按钮
	$("#" + _setting.id.btnModalOK).off("click").on("click", function () {
		var rst = getModalSelectedResult();
		_setting.modalObj.close();
		if ($.isNull(rst.selectedItems)) {
			_setting.contentObj = null;
		} else {
			_setting.contentObj = $.extend({}, rst);
		}
		_bgPub_PNL_ReportFind_ShowCase(_setting, rst);
	});
	//1.5 事件 - [模态框] 的 取消 按钮
	$("#" + _setting.id.btnModalClose).off("click").on("click", function () {
		_setting.modalObj.close();
	});
	//1.6 事件 - 保存 按钮
	$("#" + _setting.id.saveBtn).off("click").on("click", function () {
		var planItems = [];
    //CWYXM-11697 预算方案中要素选择里，增加是否采购属性，启用之后，编制指标时可选是和否，不能输入其他值，采购模块选择指标时，根据这个属性过滤。--zsj
    var isUpBudget = '';
    //ZJGA820-1550 因为指标ID是唯一的，所以指标编制模块需增加一指标ID查询条件--zsj
    var sendDocNum = '';
    // CWYXM-17554 预算方案设置中，增加财政指标ID属性，可选择是否启用，启用时，选择预算方案新增指标时，需要录入指标id，指标id也需要参与指标的要素唯一性校验--zsj
    var bgItemIdMx = '';
    var textList = {};
		if (!_setting.needSetPlan) {
			planItems = $("#" + _setting.id.findTable + " tr").find(".bgItemSelectedListDiv");
			if (planItems.length == 0) {
				ufma.showTip("请先设置查询方案内容", null, "warning");
				return false;
			}
			planItems.each(function (index, thisDiv) {
				var $div = $(thisDiv);
				var itemValue = [];
				$div.find("div.rptCaseDiv").each(function (index, subFlagDiv) {
					var tmpDt = JSON.parse($(subFlagDiv).attr("data"));
					itemValue[itemValue.length] = {
						"codeName": tmpDt.codeName,
						"name": tmpDt.name,
						"id": tmpDt.id
					};
				});
				var tmpEleCode = $div.attr("eleCode");
				if (tmpEleCode == 'ISUPBUDGET') {
					isUpBudget = $('#isUpBudget').getObj().getValue();
        }
        if (tmpEleCode == 'sendDocNum') {
          sendDocNum = $('#sendDocNum').val();
        }
        if (tmpEleCode == 'bgItemIdMx') {
          bgItemIdMx = $('#bgItemIdMx').val();
        }
				var selectedItems = $.inArrayJson(_setting.contentObj.selectedItems, 'eleCode', tmpEleCode);
				if (selectedItems) {
					selectedItems.itemValue = itemValue;
				}
			});
		} else {
			planItems = _setting.needSetPlan;
			for (var m = 0; m < planItems.length; m++) {
				var itemValue = [];
				var idEceCode = planItems[m].itemField;
				// $('#cb' + idEceCode).find('.rptCaseDiv').each(function () {
				// 	var tmpDt = JSON.parse($(this).attr("data"));
				// 	itemValue[itemValue.length] = {
				// 		"codeName": tmpDt.codeName,
				// 		"name": tmpDt.name,
				// 		"id": tmpDt.id
				// 	};
				// });
				var tmpEleCode = planItems[m].itemField;
				if (tmpEleCode == 'ISUPBUDGET') {
					isUpBudget = $('#isUpBudget').getObj().getValue();
        } else if (tmpEleCode == 'sendDocNum') {
					sendDocNum = $('#sendDocNum').val();
        } else if (tmpEleCode == 'sendDocNum') {
					bgItemIdMx = $('#bgItemIdMx').val();
        } else if ($.inArray(tmpEleCode,_setting.assiEleCode) > -1){
          $('#cb' + idEceCode).find('.rptCaseDiv').each(function () {
            var tmpDt = JSON.parse($(this).attr("data"));
            itemValue[itemValue.length] = {
              "codeName": tmpDt.codeName,
              "name": tmpDt.name,
              "id": tmpDt.id
            };
          });
        } else if ($.inArray(tmpEleCode, _setting.textCodeArr) > -1){
          textList[idEceCode] = $('#' + idEceCode).val();
          itemValue = [];
        }
				var selectedItems = $.inArrayJson(_setting.contentObj.selectedItems, 'eleCode', tmpEleCode);
				if (selectedItems) {
					selectedItems.itemValue = itemValue;
				}
			}
		}

		var tmpGetCaseNameModal = _bgPub_selfInputModal(divId, "查询方案", "请输入方案名称", function (sName) {
			var tmpUrl = _bgPub_requestUrlArray_report[3];

			var settingArgu = {
				moneyStart: $('#_reportFindMore_inputFrom_bgMoreMsgPnl-bgPerformanceReport').val(), //获取时间
				moneyEnd: $('#_reportFindMore_inputTo_bgMoreMsgPnl-bgPerformanceReport').val(),

			}
			if (_setting.needSetPlan) {
				settingArgu.planChrId = $('#cbBgPlan').getObj().getValue();
			}
			//bug77522--zsj--添加金额、日期的保存
			if ($('#isUpBudget')) {
				settingArgu.isUpBudget = isUpBudget;
      }
      if ($('#bgItemIdMx')) {
				settingArgu.bgItemIdMx = bgItemIdMx;
      }
      if ($('#sendDocNum')) {
				settingArgu.sendDocNum = sendDocNum;
      }
      if (_setting.bgItemIdMx != undefined  && _setting.bgItemIdMx != null) {
        settingArgu.bgItemIdMx = $('#bgItemIdMx').val()
      }
      if (_setting.sendDocNum != undefined  && _setting.sendDocNum != null) {
        settingArgu.sendDocNum = $('#sendDocNum').val()
      }
			if (!_setting.needSetPlan) {
				var isShowDec, isShowYuSuan;
				if ($('#isShowDec').prop('checked')) {
					settingArgu.isShowDec = 1;
				} else {
					settingArgu.isShowDec = 0;
				}
				settingArgu.dateStart = $('#starData').getObj().getValue();
				settingArgu.dateEnd = $('#endData').getObj().getValue();
			}
			if ($('#isShowYuSuan').prop('checked')) {
				settingArgu.isShowYuSuan = 1;
			} else {
				settingArgu.isShowYuSuan = 0;
      }
      settingArgu = $.extend(settingArgu, textList);
			_setting.contentObj = $.extend(_setting.contentObj, settingArgu);
			var saveObj = {
				prjGuid: '',
				agencyCode: _setting.agencyCode,
				userName: _setting.userName,
				userId: _setting.userId,
				rptType: _setting.rptType, //bgReportOfBudgetPerformance
				prjName: sName,
				prjContent: JSON.stringify(_setting.contentObj)
			};
			ufma.post(tmpUrl, saveObj, function (result) {
				if (result.flag == "success") {
					ufma.showTip("保存成功", null, "success");
					$('.modal[id^="selfInputModal_"] .btn-cancel').trigger("click");

					doLoadAllRptCase();
				} else {
					ufma.showTip("保存失败!" + result.data, null, "error");
				}
			});
		});

	});
	//1.7 事件 - 查询 按钮
	$("#" + _setting.id.findBtn).off("click").on("click", function () {
		if ($("#" + _setting.id.findTable + " tr").length <= 2) {
			ufma.showTip("请先设置查询方案", null, "warning");
			return false;
		}
		var pFindCdtn = {
			"agencyCode": _setting.agencyCode,
			"lastDate": $("#" + _setting.id.lastDate).find("input").val(),
			"items": []
		};
		$("#" + _setting.id.findTable + " tr").find(".bgItemSelectedListDiv").each(function (index, thisDiv) {
			var $div = $(thisDiv);
			var tmpEleCode = $div.attr("eleCode");
			var tmpEleName = $div.attr("eleName");
			var tmpItem = {};
			tmpItem.itemField = tmpEleCode;
			tmpItem.itemName = tmpEleName;
			tmpItem.bgItemCode = $div.attr("bgItemCode");
            tmpItem.itemValue = [];
            if (tmpEleCode == 'sendDocNum' || tmpEleCode == 'bgItemIdMx') {
                tmpItem.itemValue = $('#'+tmpEleCode).val()
            } else if (tmpEleCode == 'ISUPBUDGET') {
                tmpItem.itemValue = $('#'+tmpEleCode).getObj().getValue();
            } else {
                $div.find("div.rptCaseDiv").each(function (index, subFlagDiv) {
                    var tmpDt = $(subFlagDiv).attr("data");
                    tmpItem.itemValue[tmpItem.itemValue.length] = {
                        "value": JSON.parse(tmpDt).codeName
                    };
                });
            }
			if (tmpItem.itemValue == false) { //修改要素值为空时,传参数需要加上itemNotNull
				tmpItem.itemNotNull = 1;
			}
			pFindCdtn.items[pFindCdtn.items.length] = tmpItem;
		});
		// var tmpCbbSelect = _setting.cbb_Money.getText();
		var tmpCbbSelect = '金额';
		var minCur = "";
		var maxCur = "";
		if (!$.isNull(tmpCbbSelect) && tmpCbbSelect != "") {
			if (tmpCbbSelect == "金额") {
				minCur = $("#" + _setting.id.inputFrom).val();
				maxCur = $("#" + _setting.id.inputTo).val();
			}
			if (parseFloat(maxCur) < parseFloat(minCur)) {
				ufma.showTip("金额查找上限不能小于下限", null, "error");
				return false;
			}
		}

		pFindCdtn.minCur = minCur;
		pFindCdtn.maxCur = maxCur;

		$("#" + _setting.id.moreConditionBtn).text("更多");
		$("#" + _setting.id.findTable + " tbody").find("tr:gt(2)").hide();

		if (!$.isNull(_setting.doFindBySelf)) {
			_setting.doFindBySelf(pFindCdtn);
		}
	});
	var curPlan = {};
	//2, 加载全部可用的方案
	var doLoadAllRptCase = function () {
		var sUrl = _bgPub_requestUrlArray_report[2];
		var requestObj = {
			agencyCode: _setting.agencyCode,
			userId: _setting.userId,
			userName: _setting.userName,
			rptType: _setting.rptType
		};
		ufma.post(sUrl, requestObj, function (result) {
			if (result.flag == "success") {
				if (_setting.needSetPlan) {
					$("#rptPlanList").html('<ul class="uf-tip-menu"></ul>');
					var data = result.data.items;
					for (var i = 0; i < data.length; i++) {
						var liHtml = ufma.htmFormat('<li data-agency="<%=agency%>" data-code="<%=code%>" data-scope="<%=scope%>" data-name="<%=name%>"><%=name%><b class="btn-close glyphicon icon-close"></b></li>', {
							code: data[i].prjGuid,
							name: data[i].prjName,
							scope: data[i].prjScope,
							agency: data[i].agencyCode
						});
						var $li = $(liHtml);
						$.data($li[0], 'planData', data[i]);
						$li[data[i].prjCode == curPlan.prjCode ? 'addClass' : 'removeClass']('selected').appendTo("#rptPlanList ul");
					}
				}
				$("#" + _setting.id.listOfCase).empty();
				for (var i = 0; i < result.data.items.length; i++) {
					var tmpPrj = result.data.items[i];
					var caseFlagDiv = _bgPub_PNL_ReportFind_getFlagDiv(tmpPrj.prjGuid, tmpPrj.prjName, tmpPrj.prjContentOfString);
					$("#" + _setting.id.listOfCase).append(caseFlagDiv);
				}
				//为所有的按钮添加事件
				$("#" + _setting.id.listOfCase).find("div.rptCaseDiv").off("click").on("click", function (e) {
					var $tmpDiv = $(this);
					var tmpDataObj = JSON.parse($tmpDiv.attr("data"));
					$(this).addClass("button_color").siblings().removeClass('button_color'); //2018-07-25 mayb3 点击按钮切换查询方案 并且被点击的按钮颜色加深
					_setting.contentObj = $.extend({}, tmpDataObj);
					_bgPub_PNL_ReportFind_ShowCase(_setting, tmpDataObj);
					$("#" + _setting.id.moreConditionBtn).text("收起");
					$("#" + _setting.id.moreConditionBtn).trigger("click");
				});
				$("#" + _setting.id.listOfCase).find("div.rptCaseDiv .deletebutton").off("click").on("click", function (e) {
					e.stopPropagation(); // 按钮的单击事件，停止传播
					var $tmpDiv = $(this).closest("div.rptCaseDiv");
					ufma.confirm("确定要删除方案[" + $tmpDiv.find("div.casefont").text() + "]吗?", function (rst) {
						if (!rst) {
							return false;
						}
						var sUrl = _bgPub_requestUrlArray_report[4];
						var delObj = {};
						delObj.agencyCode = _setting.agencyCode;
						delObj.userId = _setting.userId;
						delObj.prjGuid = $tmpDiv.attr("id");
						ufma.post(sUrl, delObj, function (result) {
							if (result.flag == "success") {
								ufma.showTip("删除成功。", null, "success");
								$tmpDiv.remove();
							} else {
								ufma.showTip("删除失败。" + result.data, null, "error");
							}
						});
					});
				});
			}
		});
	};
	doLoadAllRptCase();
	//getBgPlanList(); //获取预算方案
	//修改guohx   将截止日期修改为取业务日期
	$('#endData').getObj().setValue(ufma.getCommonData().svTransDate);
};

/**
 * 显示 具体方案
 * @param pContent
 * @private
 */
var _bgPub_PNL_ReportFind_ShowCase = function (setting, pContent) {

	_setting.contentObj = $.extend(true, {}, pContent);
	var $tbl = $("#" + setting.id.findTable);
	//1, 清空旧的行
	$tbl.find("tr").each(function (index, tr) {
		if (!$(tr).hasClass("notEmpty")) {
			$(tr).remove();
		}
	});

	function setValue($pObj, data) {
		if (!data) return false;
		$pObj.find("div.rptCaseDiv").remove();
		if (data.length > 0) {
			for (var i = 0; i < data.length; i++) {
				var bCanAdd = false;
				var node = data[i];
				if (!node.hasOwnProperty('checked')) {
					bCanAdd = true;
				} else if (node.checked == true && (node.check_Child_State == -1 || node.check_Child_State == 2)) {
					bCanAdd = true;
				}
				if (bCanAdd) {
					var tmpId = data[i].id + "_" + $.getGuid();

					$pObj.append(_bgPub_PNL_ReportFind_getFlagDiv(tmpId, data[i].name, JSON.stringify(data[i])));
					_bgPub_PNL_ReportFind_getFlagDiv_addAction(tmpId);
				}
			}
		}
	}
	//bug77522--zsj
	//获取开始时间
	if (!$.isNull(_setting.contentObj.dateStart)) {
		$('#starData').getObj().setValue(_setting.contentObj.dateStart);
	} else {
		$('#starData').ufDatepicker({
			format: 'yyyy-mm-dd',
			initialDate: new Date(new Date().getFullYear(), 0, 1)
		});
	}
	//获取截止时间
	if (!$.isNull(_setting.contentObj.dateEnd)) {
		$('#endData').getObj().setValue(_setting.contentObj.dateEnd);
	} else {
		$('#endData').ufDatepicker({
			format: 'yyyy-mm-dd',
			initialDate: new Date(new Date().getFullYear(), 0, 1)
		});
	}
	//获取勾选状态
	var isShowDec, isShowYuSuan;
	if (_setting.contentObj.isShowDec == 1) {
		$('#isShowYuSuan').prop('checked', true);
	} else {
		$('#isShowYuSuan').prop('checked', false);
	}
	if (_setting.contentObj.isShowYuSuan == 1) {
		$('#isShowYuSuan').prop('checked', true);

	} else {
		$('#isShowYuSuan').prop('checked', false);
	}
	$('#_reportFindMore_inputFrom_bgMoreMsgPnl-bgPerformanceReport').val(_setting.contentObj.moneyStart); //获取开始金额
	$('#_reportFindMore_inputTo_bgMoreMsgPnl-bgPerformanceReport').val(_setting.contentObj.moneyEnd); //获取截止金额
	var $curRow = $tbl.find("tr.lastrow"); //获得最后一行。用于追加一行
	$tbl.find('.more-item').remove();
	var colLen = Math.ceil($curRow.find('td').length / 2);
	$.each(pContent.selectedItems, function (i, tmpItem) {
		if (i % colLen == 0) {
			$curRow = $('<tr class="more-item"></tr>').insertAfter($curRow);
		}
		var item = pContent.selectedItems[i];
		//CWYXM-11697  预算方案中要素选择里，增加是否采购属性，启用之后，编制指标时可选是和否，不能输入其他值，采购模块选择指标时，根据这个属性过滤。--zsj
		if (item.eleCode != 'ISUPBUDGET' && item.eleCode != 'bgItemIdMx' && item.eleCode != 'sendDocNum' && ($.inArray(item.eleCode,setting.assiEleCode) > -1 || setting.rptType == 'bgReportOfBudgetPersion' || setting.rptType == 'bgReportOfBudgetPerformance')) { //CWYXM-12238--预算执行情况表和汇总分析表，查询条件处界面优化' style='width:8.5em;'
			if (!pContent.planChrId) {
				var $base = $("<td class='bgPub-bgPlanTbl-lbl' style='height:40px;max-width:120px;height: 40px;white-space: nowrap;text-overflow: ellipsis; overflow: hidden;'></td>").appendTo($curRow);
				$("<div class='bgPub-bgPlanTbl-lbl-right' style='width:8.5em;' title='" + item.eleName + "' eleCode='" + item.eleCode + "' eleName='" + item.eleName + "' " +
					"bgItemCode='" + item.bgItemCode + "'>" + item.eleName + "：</div>").appendTo($base);
				var $inside = $("<td class='bgPub-bgPlanTbl-lbl-right' style='width:583px;text-align:left;'>").appendTo($curRow);
				var $insideDiv = $("<div class='bgpub-bgnormal-postion-1 bgPub-border bgItemSelectedListDiv  " + item.eleCode + "' " +
					"style='border-radius: 3px; height: 30px; width:350px; background-color: #FFFFFF;  overflow: auto; '" +
					"eleCode='" + item.eleCode + "' eleName='" + item.eleName + "' bgItemCode='" + item.bgItemCode + "'></div>").appendTo($inside);
				$("<div class='bgpub-bgnormal-absolute-right2 bgItemSelectDiv'style='width: 20px; background-color: #FFFFFF; display: none; cursor:pointer;'>...</div>").appendTo($insideDiv);
			} else {
				var $base = $("<td class='bgPub-bgPlanTbl-lbl' style='max-width:120px;height: 40px;white-space: nowrap;text-overflow: ellipsis; overflow: hidden;'></td>").appendTo($curRow);
				$("<div class='bgPub-bgPlanTbl-lbl-right' title='" + item.eleName + "'  eleCode='" + item.eleCode + "' eleName='" + item.eleName + "' " +
					"bgItemCode='" + item.bgItemCode + "'>" + item.eleName + "：</div>").appendTo($base);
				var $inside = $("<td class='bgPub-bgPlanTbl-lbl-right' style='width:583px;text-align:left;'>").appendTo($curRow);
				var $insideDiv = $("<div class='" + item.eleCode + " bgpub-bgnormal-postion-1 bgPub-border bgItemSelectedListDiv'" +
					"style='border-radius: 3px; height: 30px;margin-left:2px;width:300px;background-color: #FFFFFF;  overflow: auto; '" +
					"eleCode='" + item.eleCode + "' eleName='" + item.eleName + "' bgItemCode='" + item.bgItemCode + "'  id='cb" + item.eleCode + "'></div>").appendTo($inside);
				$("<div class='bgpub-bgnormal-absolute-right2 bgItemSelectDiv'style='width: 20px; background-color: #FFFFFF; display: none; cursor:pointer;'>...</div>").appendTo($insideDiv);
			}
			setValue($curRow.find('.bgItemSelectedListDiv.' + item.eleCode), tmpItem.itemValue);
		} else if (item.eleCode == 'sendDocNum' || item.eleCode == 'bgItemIdMx' || $.inArray(item.eleCode,setting.textCodeArr) > -1) { 
      //CWYXM-17554 预算方案设置中，增加财政指标ID属性，可选择是否启用，启用时，选择预算方案新增指标时，需要录入指标id，指标id也需要参与指标的要素唯一性校验;ZJGA820-1550 因为指标ID是唯一的，所以指标编制模块需增加一指标ID查询条件--zsj
      if (!pContent.planChrId) {
          var $base = $("<td class='bgPub-bgPlanTbl-lbl' style='max-width:120px;height:40px;white-space: nowrap;text-overflow: ellipsis; overflow: hidden;'></td>").appendTo($curRow);
          $("<div class='bgPub-bgPlanTbl-lbl-right' style='width:8.5em;' title='" + item.eleName + "' eleCode='" + item.eleCode + "' eleName='" + item.eleName + "' " +
              "bgItemCode='" + item.bgItemCode + "'>" + item.eleName + "：</div>").appendTo($base);
          var $inside = $("<td class='bgPub-bgPlanTbl-lbl-right' style='width:583px;text-align:left;'>").appendTo($curRow);
          $("<input class='form-control bgpub-bgnormal-postion-1 bgPub-border bgItemSelectedListDiv' bgItemCode='"+item.bgItemCode+"' eleCode='" + item.eleCode + "' eleName='" + item.eleName + "' style='width:300px;margin-left:2px;' id='"+item.eleCode+"'/>").appendTo($inside);
      } else {
          var $base = $("<td class='bgPub-bgPlanTbl-lbl' style='max-width:120px;height: 40px;white-space: nowrap;text-overflow: ellipsis; overflow: hidden;'></td>").appendTo($curRow);
          $("<div class='bgPub-bgPlanTbl-lbl-right' title='" + item.eleName + "'  eleCode='" + item.eleCode + "' eleName='" + item.eleName + "' " +
              "bgItemCode='" + item.bgItemCode + "'>" + item.eleName + "：</div>").appendTo($base);
          var $inside = $("<td class='bgPub-bgPlanTbl-lbl-right' style='width:583px;text-align:left;'>").appendTo($curRow);
          $("<input class='form-control bgpub-bgnormal-postion-1 bgPub-border bgItemSelectedListDiv' bgItemCode='"+item.bgItemCode+"' eleCode='" + item.eleCode + "' eleName='" + item.eleName + "' style='width:300px;margin-left:2px;' id='"+item.eleCode+"'/>").appendTo($inside);
      }
      setValue($curRow.find('.bgItemSelectedListDiv.' + item.eleCode), tmpItem.itemValue);
      $('#' + item.eleCode).val(pContent[item.eleCode])
    } else if (item.eleCode == 'ISUPBUDGET'){
			//自定义“是否采购”枚举数值
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
			var $base = $("<td class='bgPub-bgPlanTbl-lbl' style='height:40px;max-width:120px;height: 40px;white-space: nowrap;text-overflow: ellipsis; overflow: hidden;'></td>").appendTo($curRow);
			$("<div class='bgPub-bgPlanTbl-lbl-right' style='width:8.5em;' eleCode='" + item.eleCode + "' eleName='" + item.eleName + "' " +
				"bgItemCode='" + item.bgItemCode + "'>" + item.eleName + "：</div>").appendTo($base);
			var $inside = $("<td class='bgPub-bgPlanTbl-lbl-right' style='width:583px;text-align:left;'>").appendTo($curRow);
			var $insideDiv = $("<div id='isUpBudget' class='bgpub-bgnormal-postion-1 bgItemSelectedListDiv uf-combox' " +
				"style='height: 30px; width:350px;margin-top:-2px;'" +
				"eleCode='" + item.eleCode + "' eleName='" + item.eleName + "' bgItemCode='" + item.bgItemCode + "'></div>").appendTo($inside);
			$('#isUpBudget').ufCombox({
				idField: "id",
				textField: "codeName",
				//placeholder: "请选择是否采购",
				data: isUpBudgetData, //json 数据 
				onChange: function (sender, data) {},
				onComplete: function (sender) {}
			});
			setValue($curRow.find('.bgItemSelectedListDiv'), tmpItem.itemValue);
			$('#isUpBudget').getObj().val(pContent.isUpBudget)
		}
	});
	$("#" + setting.id.findTable + " tr").find(".bgItemSelectedListDiv").off("mouseenter").on("mouseenter", function (e) {
		$(this).find("div.bgItemSelectDiv").show();
	});
	$("#" + setting.id.findTable + " tr").find(".bgItemSelectedListDiv").off("mouseleave").on("mouseleave", function (e) {
		$(this).find("div.bgItemSelectDiv").hide();
	});
	$("#" + setting.id.findTable + " tr").find("div.bgItemSelectDiv").off("click").on("click", function (e) {
		var $parentDiv = $(this).closest(".bgItemSelectedListDiv");
		var oldData = [];
		$parentDiv.find("div.rptCaseDiv").each(function () {
			var itemData = $(this).attr('data');
			if (itemData) {
				oldData.push(JSON.parse(itemData));
			}
		});
		var sUrl = _bgPub_requestUrlArray[2] + "?agencyCode=" + setting.agencyCode + "&setYear=" + ufma.getCommonData().svSetYear + "&eleCode=" + $parentDiv.attr("eleCode") + "&eleLevel=9";
		var modalView = ufma.selectBaseTree({
				url: sUrl,
				baseType: $parentDiv.attr("eleCode"),
				title: "选择" + $parentDiv.attr("eleName"),
				height: 450,
				bSearch: false,
				data: oldData,
				buttons: {
					'确认': {
						class: 'btn btn-sm btn-primary  btn-save',
						action: function (data) {
							// var $closeBtn = $('<div class="u-msg-close"> <span aria-hidden="true">×</span></div>');
							/*	if(data.length > 0) {
									for(var i = 0; i < data.length; i++) {
										var tmpId = data[i].id + "_" + $.getGuid(),
											bCanAddDt = true;
										//做去重复性检查;
										$parentDiv.find("div.rptCaseDiv").each(function(index, obj) {
											var tmpDt = JSON.parse($(obj).attr("data"));
											if(tmpDt.id == data[i].id) {
												bCanAddDt = false;
											}
										});
										if(bCanAddDt) {
											$parentDiv.append(_bgPub_PNL_ReportFind_getFlagDiv(tmpId, data[i].name, JSON.stringify(data[i])));
											_bgPub_PNL_ReportFind_getFlagDiv_addAction(tmpId);
										}
									}
								}*/
							setValue($parentDiv, data);
							closeModalView();
						}
					}
				}
			}

		);
		var closeModalView = function () {
			modalView.close();
		};
  });
  if ($('.btn-more-item i').hasClass('icon-angle-bottom')) {
    $('#budgetQuery').find('.more-item').addClass('hide');
  } else if($('.btn-more-item i').hasClass('icon-angle-top')) {
    $('#budgetQuery').find('.more-item').removeClass('hide');
  }
  
};