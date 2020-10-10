/*******模块全局应用*********/
var bg = {};
//接口url
bg.interFaces = {
	'agencyTree': '/bg/sysdata/getAgencyList', //单位树
	'bgPlan': '/bg/sysdata/getBgPlanArray', //预算方案列表@单位代码
	'person': '/bg/sysdata/unallocate/getApplicants', //申请人
	'bgPlanItem': '/bg/sysdata/getEleBgItemValues', //根据预算方案取要素@单位代码@要素代码@是否主
	'budget': '/bg/unallocateBudgetItem/getBudgetItems', //  选择得指标，主要是日期查询的是指标日期
	'bills': '/bg/unallocateBudgetItem/getBills', //  指标界面查询，获得指标
	'newBillId': '/bg/unallocateBudgetItem/newBill', //
	'bgallocateSave': '/bg/unallocateBudgetItem/saveUnallocateBudgetItems', //等分配指标单据保存
	'bgallocateDel': '/bg/unallocateBudgetItem/delBudgetItems', //等分配指标单据删除
	//
	'unacItemLog': '/bg/unallocateBudgetItem/budgetItemLog', //等分配指标日志
	'unacBillLog': '/bg/unallocateBudgetItem/billLog', //等分配指标单据日志
	'unacCheck': '/bg/unallocateBudgetItem/audit', //等分配指标分配审核
	'unacCancelAudit': '/bg/unallocateBudgetItem/cancelAudit', //分配销审
	//
	'getRepay': '/bg/unallocateBudgetItem/getRepay', //支付单查询
	'saveRepay': '/bg/unallocateBudgetItem/saveRepay', //支付单保存
	'delRepay': '/bg/unallocateBudgetItem/delRepay', //支付单删除
	'auditRepay': '/bg/unallocateBudgetItem/auditRepay', //支付审批
	'cancelAuditRepay': '/bg/unallocateBudgetItem/cancelAuditRepay', //支付销审
	'upAttachment': '/bg/budgetItem/upAttachment', //8 附件导入
	'fileDownload': '/bg/attach/FileDownload', //15, 附件导出
	'delAttach': '/bg/attach/delAttach', //16，附件删除
	'getAttach': '/bg/attach/getAttach' //17，附件查找
};
bg.getUrl = function (urlCode) {
	return bg.interFaces[urlCode];
};
/**
根据预算方案初始化查询面板
布局使用table,根据第一行列数显示栏数，第一行显示预算方案的选择
@pnl要素显示的table对象，要素显示在预算方案所在行的下面
@items要素数组
**/
//自定义“是否采购预算”枚举数值
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
bg.initBgPlanItemPnl = function ($pnl, planData) {
	if (planData != null) {
		var items = planData.planVo_Items;
	}
	if (items.length == 0) {
		$pnl.find('.label-more').addClass('hide');
	} else {
		$pnl.find('.label-more').removeClass('hide');
	}
	var bOpen = $pnl.find('.label-more').hasClass('open');
	$pnl.find('table tr:not(:eq(0))').remove();
	var $curRow = $pnl.find('table tr:eq(0)');
	var colLen = Math.ceil($curRow.find('td').length / 2);
	for (var i = 0; i < items.length; i++) {
		if (i % colLen == 0) {
			$curRow = $('<tr class="more-item"></tr>').insertAfter($curRow);
		}
		var item = items[i];
		$('<td class="label-ctrl commonControl" title="' + item.eleName + '">' + item.eleName + '：</td>').appendTo($curRow);
		//CWYXM-11693--nbsh---指标分 解、调整、调剂选择指标时，增加按摘要查询的条件--zsj
		if (item.eleName == '摘要' || item.nameCode == 'sendDocNum' || item.nameCode == 'bgItemIdMx') {
			var formCtrl = $('<td class="form-ctrl"><input  type="text" id="cb' + item.nameCode + '" class="querySummery uf-form-control" style=" width: 300px;border: 1px solid #d9d9d9;"></td>').appendTo($curRow);
		} else {
			//CWYXM-11697  预算方案中要素选择里，增加是否采购属性，启用之后，编制指标时可选是和否，不能输入其他值，采购模块选择指标时，根据这个属性过滤。--zsj
			if (item.eleCode != 'ISUPBUDGET') {
				var formCtrl = $('<td class="form-ctrl"><div id="cb' + item.eleCode + '" class="uf-treecombox" style=" width: 300px;"></div></td>').appendTo($curRow);
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
							idField: 'code',
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
			} else {
				var formCtrl = $('<td class="form-ctrl"><div id="isUpBudget" class="uf-combox" style=" width: 300px;"></div></td>').appendTo($curRow);
				$('#isUpBudget').ufCombox({
					idField: "id",
					textField: "codeName",
					placeholder: "请选择是否采购预算",
					data: isUpBudgetData, //json 数据 
					onChange: function (sender, data) {},
					onComplete: function (sender) {}
				});
			}
		}
  }
  //CWYXM-18080 编制指标时需要增加文本说明项，只录入文本，用于描述指标信息--zsj--查询条件区域
  for (var k = 0; k < planData.planVo_Txts.length; k++) {
    var textItem = planData.planVo_Txts[k]
		if ((items.length + k ) % colLen == 0) {
			$curRow = $('<tr class="more-item"></tr>').insertAfter($curRow);
		}
		$('<td class="label-ctrl commonControl" title="' + textItem.eleName + '">' + textItem.eleName + '：</td>').appendTo($curRow);
		var formCtrl = $('<td class="form-ctrl"><input  type="text" id="cb' + textItem.eleFieldName + '" class="querySummery uf-form-control" style=" width: 300px;border: 1px solid #d9d9d9;"></td>').appendTo($curRow);
	}
	$pnl.find('tr.wxfixedtable').remove();
	var fixedRow = $('<tr class="wxfixedtable" style="height:0px;"></tr>').insertAfter($curRow);
	$pnl.find('tr:eq(0) td').each(function () {
		$('<td style="height:0px;padding:0px;margin:0px;width:' + ($(this).outerWidth(true) + 2) + 'px;"></td>').appendTo(fixedRow);
	});
	if (!bOpen) {
		$pnl.find('.more-item').addClass('hide');
	} else {
		$.timeOutRun(null, null, function () {
			var pnlHeight = $pnl.find('table').outerHeight(true);
			$pnl.css({
				'height': pnlHeight + 'px'
			});
		}, 600);
	}
};

/**
 * 指标余额表
根据预算方案初始化查询面板
布局使用table,根据第一行列数显示栏数，第一行显示预算方案的选择
@pnl要素显示的table对象，要素显示在预算方案所在行的下面
@items要素数组
**/
bg.initBgPlanItemPnl1 = function ($pnl, planData) {
	if (planData != null) {
		var items = planData.planVo_Items;
	}
	if (items.length == 0) {
		$pnl.find('.label-more').addClass('hide');
	} else {
		$pnl.find('.label-more').removeClass('hide');
	}

	var bOpen = $pnl.find('.label-more').hasClass('open');
	$pnl.find('.more-item').remove();
	//var $curRow = $pnl.find('table tr:eq(1)');
	var $curRow = $pnl.find("tr.lastrow"); //获得最后一行。用于追加一行
	$pnl.find('.more-item').remove();
    var colLen = Math.ceil($curRow.find('td').length / 2);
    var newItems = []
    for (var v = 0; v < items.length; v++) {
        if (items[v].eleCode == 'ISUPBUDGET') {
          $('#isUpBudget').ufCombox({
            idField: "id",
            textField: "codeName",
            placeholder: "请选择是否采购预算",
            data: isUpBudgetData, //json 数据 
            onChange: function (sender, data) {},
            onComplete: function (sender) {}
          });
        } else {
          newItems.push(items[v])
        }
    }
	for (var i = 0; i < newItems.length; i++) {
		if (i % colLen == 0) {
			$curRow = $('<tr class="more-item"></tr>').insertAfter($curRow);
		}
		var item = newItems[i];
        //CWYXM-11697  预算方案中要素选择里，增加是否采购属性，启用之后，编制指标时可选是和否，不能输入其他值，采购模块选择指标时，根据这个属性过滤。--zsj
        /**ZJGA820-1550 因为指标ID是唯一的，所以指标编制模块需增加一指标ID查询条件。
        * 预算方案中启用了发文文号，指标的所有界面，需要有按发文文号查询的条件框；
        涉及到所有菜单的主界面，分解、调整、调剂的新增弹框类界面；
        指标的所有账表界面；
        */
    if(item.eleCode == 'sendDocNum'){
      var $base = $("<td class='bgPub-bgPlanTbl-lbl' style='max-width:120px;height: 40px;white-space: nowrap;text-overflow: ellipsis; overflow: hidden;'></td>").appendTo($curRow);
			$("<div class='bgPub-bgPlanTbl-lbl-right commonShowLab' title='" + item.eleName + "'  eleCode='" + item.eleCode + "' eleName='" + item.eleName + "' " +
				"bgItemCode='" + item.bgItemCode + "'>" + item.eleName + "：</div>").appendTo($base);
			var $inside = $("<td class='bgPub-bgPlanTbl-lbl-right' style='width:583px;text-align:left;'>").appendTo($curRow);
			$("<input class='form-control bgpub-bgnormal-postion-1 bgPub-border bgItemSelectedListDiv' bgItemCode='"+item.bgItemCode+"' eleCode='" + item.eleCode + "' eleName='" + item.eleName + "' style='width:300px;margin-left:2px;' id='"+item.eleCode+"'/>").appendTo($inside);
    }else if(item.eleCode == 'bgItemIdMx'){
      var $base = $("<td class='bgPub-bgPlanTbl-lbl' style='max-width:120px;height: 40px;white-space: nowrap;text-overflow: ellipsis; overflow: hidden;'></td>").appendTo($curRow);
			$("<div class='bgPub-bgPlanTbl-lbl-right commonShowLab' title='" + item.eleName + "'  eleCode='" + item.eleCode + "' eleName='" + item.eleName + "' " +
				"bgItemCode='" + item.bgItemCode + "'>" + item.eleName + "：</div>").appendTo($base);
			var $inside = $("<td class='bgPub-bgPlanTbl-lbl-right' style='width:583px;text-align:left;'>").appendTo($curRow);
			$("<input class='form-control bgpub-bgnormal-postion-1 bgPub-border bgItemSelectedListDiv' bgItemCode='"+item.bgItemCode+"' eleCode='" + item.eleCode + "' eleName='" + item.eleName + "' style='width:300px;margin-left:2px;' id='"+item.eleCode+"'/>").appendTo($inside);
    } else {
      var $base = $("<td class='bgPub-bgPlanTbl-lbl' style='max-width:120px;height: 40px;white-space: nowrap;text-overflow: ellipsis; overflow: hidden;'></td>").appendTo($curRow);
			$("<div class='bgPub-bgPlanTbl-lbl-right commonShowLab' title='" + item.eleName + "'  eleCode='" + item.eleCode + "' eleName='" + item.eleName + "' " +
				"bgItemCode='" + item.bgItemCode + "'>" + item.eleName + "：</div>").appendTo($base);
			var $inside = $("<td class='bgPub-bgPlanTbl-lbl-right' style='width:583px;text-align:left;'>").appendTo($curRow);
			var $insideDiv = $("<div class='bgpub-bgnormal-postion-1 bgPub-border bgItemSelectedListDiv ' " +
				"style='border-radius: 3px; height: 30px;margin-left:2px;  width:300px;background-color: #FFFFFF;  overflow: auto; '" +
				"eleCode='" + item.eleCode + "' eleName='" + item.eleName + "' bgItemCode='" + item.bgItemCode + "'  id='cb" + item.eleCode + "'></div>").appendTo($inside);
			$("<div class='bgpub-bgnormal-absolute-right2 bgItemSelectDiv'style='width: 20px; background-color: #FFFFFF; display: none; cursor:pointer;'>...</div>").appendTo($insideDiv);
		}
	}
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
  //CWYXM-18080 编制指标时需要增加文本说明项，只录入文本，用于描述指标信息--zsj--查询条件区域
  for (var k = 0; k < planData.planVo_Txts.length; k++) {
    var textItem = planData.planVo_Txts[k]
		if ((newItems.length + k ) % colLen == 0) {
			$curRow = $('<tr class="more-item"></tr>').insertAfter($curRow);
    }
    var $base = $("<td class='bgPub-bgPlanTbl-lbl' style='max-width:120px;height: 40px;white-space: nowrap;text-overflow: ellipsis; overflow: hidden;'></td>").appendTo($curRow);
    $("<div class='bgPub-bgPlanTbl-lbl-right' title='" + textItem.eleName + "'  eleCode='" + textItem.eleCode + "' eleName='" + textItem.eleName + "' " +
      "bgItemCode='" + textItem.bgItemCode + "'>" + textItem.eleName + "：</div>").appendTo($base);
    var $inside = $("<td class='bgPub-bgPlanTbl-lbl-right' style='width:583px;text-align:left;'>").appendTo($curRow);
    $("<input class='form-control bgpub-bgnormal-postion-1 bgPub-border bgItemSelectedListDiv' bgItemCode='"+textItem.bgItemCode+"' eleCode='" + textItem.eleCode + "' eleName='" + textItem.eleName + "' style='width:300px;margin-left:2px;' id='"+textItem.eleFieldName+"'/>").appendTo($inside);
	}
	$("#budgetQuery tr").find(".bgItemSelectedListDiv").off("mouseenter").on("mouseenter", function (e) {
		$(this).find("div.bgItemSelectDiv").show();
	});
	$("#budgetQuery tr").find(".bgItemSelectedListDiv").off("mouseleave").on("mouseleave", function (e) {
		$(this).find("div.bgItemSelectDiv").hide();
	});
	$("#budgetQuery tr").find("div.bgItemSelectDiv").off("click").on("click", function (e) {
		var $parentDiv = $(this).closest(".bgItemSelectedListDiv");
		var oldData = [];
		$parentDiv.find("div.rptCaseDiv").each(function () {
			var itemData = $(this).attr('data');
			if (itemData) {
				oldData.push(JSON.parse(itemData));
			}
		});
		var sUrl = _bgPub_requestUrlArray[2] + "?agencyCode=" + planData.agencyCode + "&setYear=" + ufma.getCommonData().svSetYear + "&eleCode=" + $parentDiv.attr("eleCode") + "&eleLevel=9";
		var modalView = ufma.selectBaseTree({
				url: sUrl,
				baseType: $parentDiv.attr("eleCode"),
				title: "选择" + $parentDiv.attr("eleName"),
				bSearch: false,
				data: oldData,
				buttons: {
					'确认': {
						class: 'btn btn-sm btn-primary btn-save',
						action: function (data) {
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

	$pnl.find('tr.wxfixedtable').remove();
	var fixedRow = $('<tr class="wxfixedtable" style="height:0px;"></tr>').insertAfter($curRow);
	$pnl.find('tr:eq(0) td').each(function () {
		$('<td style="height:0px;padding:0px;margin:0px;width:' + ($(this).outerWidth(true) + 2) + 'px;"></td>').appendTo(fixedRow);
	});
	if (!bOpen) {
		$pnl.find('.more-item').addClass('hide');
	} else {
		$.timeOutRun(null, null, function () {
			var pnlHeight = $pnl.find('table').outerHeight(true);
			$pnl.css({
				'height': pnlHeight + 'px'
			});
		}, 600);
	}

};

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
bg.cacheDataRun = function (setting) {
	setting.callback = setting.callback || function (data) {};
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
		if (setting.hasOwnProperty('element')) {
			callback(setting.element, data, setting.eleName);
		} else {
			callback(data);
		}
	} else {
		setting.param = setting.param || {};
    if ($.isNull(setting.url)) return false;
    // ZJGA820-1833 指标权限管理的新增页面、指标台账的指标台账编码选择页面、预算执行明细表中预算执行明细编码选择页面打不开，一直在转。--zsj--修改为同步请求，防止出现加载卡死问题
		ufma.ajaxDef(setting.url, 'get', setting.param, function (result) {
			if (result.hasOwnProperty('data')) {
				uf.setObjectCache(setting.cacheId, result.data);
				if (setting.hasOwnProperty('element')) {
					callback(setting.element, result.data, setting.eleName);
				} else {
					callback(result.data);
				}

			} else {
				alert('错误的数据格式!');
			}
		});
	}
};
/**
 * 根据预算方案切换后初始化的条件获取，注意这里只获得动态生成的控件的值,不包括日期等
 * planData预算方案数据，包含各要素信息
 */
bg.getBgPlanItemMap = function (planData) {
	if ($.isNull(planData)) return {};

	var searchMap = {
		'agencyCode': planData.agencyCode
	};
	searchMap['setYear'] = planData.setYear;
	searchMap['chrId'] = planData.chrId;
	for (var i = 0; i < planData.planVo_Items.length; i++) {
		var item = planData.planVo_Items[i];
		var cbItem = item.eleCode;
		var field = item.eleFieldName;
    //CWYXM-11697  预算方案中要素选择里，增加是否采购属性，启用之后，编制指标时可选是和否，不能输入其他值，采购模块选择指标时，根据这个属性过滤。--zsj
    //CWYXM-17554 预算方案设置中，增加财政指标ID属性，可选择是否启用，启用时，选择预算方案新增指标时，需要录入指标id，指标id也需要参与指标的要素唯一性校验--zsj
		if (cbItem == 'ISUPBUDGET') {
      var combox = $('#isUpBudget').getObj();
			searchMap["isUpBudget"] = combox.getValue();
		} else if(cbItem == 'sendDocNum'){
			searchMap['sendDocNum'] = $('#cbsendDocNum').val();
		} else if(cbItem == 'bgItemIdMx'){
			searchMap['bgItemIdMx'] = $('#cbbgItemIdMx').val();
		} else {
			var combox = $('#cb' + cbItem).getObj();
			searchMap[bg.shortLineToTF(field)] = combox.getValue();
		}
	};
  //CWYXM-18080 编制指标时需要增加文本说明项，只录入文本，用于描述指标信息--zsj--查询条件区域
  for (var k = 0; k < planData.planVo_Txts.length; k++) {
    var textCode = bg.shortLineToTF(planData.planVo_Txts[k].eleFieldName);
    searchMap[textCode] = $('#cb'+ planData.planVo_Txts[k].eleFieldName).val();
  }
	return searchMap;
}
/**
 * 下划线连接符转为驼峰格式
 * @param {Object} str  code_name ->codeName
 */
bg.shortLineToTF = function (str) {
	var arr = str.split("_");
	for (var i = 0; i < arr.length; i++) {
		arr[i] = arr[i].toLowerCase()
	}
	for (var i = 1; i < arr.length; i++) {
		arr[i] = arr[i].toLowerCase()
		arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].substring(1);
	}
	return arr.join("");
};

/**
 * 初始化单位树型下拉框
 * @ele下接框对象
 * @param请求的参数
 * @onchange下接框变化时调用方法
 */
bg.setAgencyCombox = function (ele, param, onchange) {
	var cacheId = $.json2guid(param) + '-cbAgency';
	var url = bg.getUrl('agencyTree');
	var menuid = $.getUrlParam('menuid');
	if (!$.isNull(menuid)) {
		if (url.indexOf('?') == -1) {
			url = url + '?menuId=' + menuid;
		} else {
			url = url + '&menuId=' + menuid;
		}

		url = url + '&roleId=' + ufma.getCommonData().svRoleId;
	}
	if (url.indexOf("?") != -1) {
		url = url + "&ajax=1";
	} else {
		url = url + "?ajax=1";
	}

	uf.cacheDataRun({
		element: $(ele),
		cacheId: cacheId,
		url: url,
		param: param,
		callback: function (element, data) {
			element.ufTreecombox({ //初始化
				data: data,
				placeholder: "请选择单位",
				leafRequire: true, //可选
				onChange: onchange,
				readonly: false,
				onComplete: function (sender) {
					var oneTree = $.fn.zTree.getZTreeObj("cbAgency_tree");
					oneTree.expandAll(true);
					if (!$.isNull(ufma.getCommonData().svAgencyCode)) {
						$(ele).getObj().val(ufma.getCommonData().svAgencyCode);
					} else {
						$(ele).getObj().val('1111');
					}
				}
			});
		}
	});
}

/**
 * 初始化预算方案下拉框
 * @ele下接框对象
 * @param请求的参数
 * @onchange下接框变化时调用方法
 */
bg.setBgPlanCombox = function (ele, param, onchange) {
	var cacheId = $.json2guid(param) + '-plan-items';
	uf.cacheDataRun({
		element: $(ele),
		cacheId: cacheId,
		url: bg.getUrl('bgPlan') + "?setYear=" + ufma.getCommonData().svSetYear + "&ajax=1",
		param: param,
		callback: function (element, data) {
			$(ele).ufCombox({ //初始化
				data: data, //列表数据
				readonly: true, //可选
				placeholder: "请选择预算方案",
				onChange: onchange,
				onComplete: function (sender, elData) {
					bg.selectBgPlan($(ele), elData);
				}
			});
		}
	});
}
bg.selectBgPlan = function (el, data) {
	var val = '';
	var enabledList = data.select(function (el, i, res, param) {
		return el.enabled == '是';
	});
	if (enabledList.length > 0) {
		val = enabledList[0].chrId;
	}

	el.getObj().val(val);
}
/**
 * 初始化预算方案下拉框
 * @ele下接框对象
 * @param请求的参数
 * @onchange下接框变化时调用方法
 */
bg.setPersionCombox = function (ele, param, onchange) {
	var cacheId = $.json2guid(param) + '-persion';
	uf.cacheDataRun({
		element: $(ele),
		cacheId: cacheId,
		url: bg.getUrl('person'),
		param: param,
		callback: function (element, data) {
			$(ele).ufCombox({ //初始化
				data: data, //列表数据
				readonly: true, //可选
				idField: "id",
				textField: "name",
				placeholder: "请选择申请人",
				onChange: onchange
			});
		}
	});
}