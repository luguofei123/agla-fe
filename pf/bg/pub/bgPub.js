/**-------------------------------------- pub function -------------------------------------------------*/
/**
 * PUB_获得请求上下文
 */
var getURL = function (type) {
	// 获取当前网址，如： http://localhost:8083/AA/BB/CC.jsp
	var curWwwPath = window.document.location.href;
	// 获取主机地址之后的目录，如： AA/BB/CC.jsp
	var pathName = window.document.location.pathname;
	var pos = curWwwPath.indexOf(pathName);
	// 获取主机地址，如： http://localhost:8083
	var localhostPaht = curWwwPath.substring(0, pos);
	// 获取带"/"的项目名，如：/AA
	var projectName = pathName.substring(0, pathName.substr(1)
		.indexOf('/') + 1);
	if (type == 0) {
		return (localhostPaht);
	} else if (type == 1) {
		return (localhostPaht + projectName)
	}
};
/**
 * PUB_克隆对象
 */
var cloneObj = function clone(obj) {
	var newO = {};
	var doClone = function (srcObj) {
		if (srcObj instanceof Array) {
			newO = [];
		}
		for (var key in srcObj) {
			var val = srcObj[key];
			newO[key] = typeof val === 'object' ? doClone(val) : val;
		}
		return newO;
	};
	if ($.type(obj) == "array") {
		return obj.concat();
	} else {
		return doClone(obj);
	}
};

//系统数据请求URL
var _bgPub_requestUrlArray = [
	getURL(0) + "/bg/budgetItem/singlePost/getBudgetItems", //0  获得指标
	getURL(0) + "/bg/sysdata/getBgPlanArray", //1  获得预算方案列表
	getURL(0) + "/bg/sysdata/getEleBgItemValues", //2  获得要素
	getURL(0) + "/bg/sysdata/getAgencyList", //3  获得单位列表
	getURL(0) + "/bg/sysdata/getAcctList", //4  获得账套列表
	getURL(0) + "/bg/sysdata/getFinanceAgencyList", //5, 获得财政区划
	getURL(0) + "/bg/Plan/budgetPlan/getPlan", //6, 获得一条预算方案信息
	getURL(0) + "/bg/Plan/ctrlPlan/getPlanList", //7, 获得控制方案列表
	getURL(0) + "/bg/sys/bgItem/getBgItems" //8, 获得指标的全部要素
];

//产品英文的请求URL
var _bgPub_requestUrlArray_subJs = [
	getURL(0) + "/bg/budgetItem/multiPost/getBudgetItems", //0  指标界面查询（查询指标），获得指标-多岗
	getURL(0) + "/bg/Plan/budgetAccoSet/getMaAccoList", //1  获得科目列表
	getURL(0) + "/bg/budgetItem/budgetItemLog", //2  获得指标日志
	getURL(0) + "/bg/budgetItem/newBudgetItem", //3  新增一条指标
	getURL(0) + "/bg/budgetItem/multiPost/saveBudgetItems", //4 指标保存-多岗
	getURL(0) + "/bg/budgetItem/multiPost/delBudgetItems", //5  指标删除/指标单据删除-多岗
	getURL(0) + "/bg/budgetItem/impBudgetItems", //6 导入
	getURL(0) + "/bg/budgetItem/multiPost/exportBudgetItems", //7 导出
	getURL(0) + "/bg/attach/uploadAttach", //8 附件导入
	getURL(0) + "/bg/sysdata/getEleBgItemValues", //9  获得要素
	getURL(0) + "/bg/budgetItem/multiPost/sendToAudit", //10 指标送审（批量）
	getURL(0) + "/bg/budgetItem/multiPost/withDraw", //11 指标收回
	getURL(0) + "/bg/budgetItem/multiPost/audit", //12 指标审核
	getURL(0) + "/bg/budgetItem/multiPost/cancelAudit", //13  指标销审
	getURL(0) + "/bg/budgetItem/multiPost/newBill", //14  新建一个单据
	getURL(0) + "/bg/attach/FileDownload", //15, 附件导出
	getURL(0) + "/bg/attach/delAttach", //16，附件删除
	getURL(0) + "/bg/attach/getAttach", //17，附件查找
	getURL(0) + "/bg/budgetItem/singlePost/getBudgetItems", //18  获得指标 - 单岗
	getURL(0) + "/bg/budgetItem/singlePost/saveBudgetItems", //19 指标保存 - 单岗
	getURL(0) + "/bg/budgetItem/singlePost/delBudgetItems", //20  指标删除 - 单岗
	getURL(0) + "/bg/budgetItem/expBudgetItems", //21 导出 - 单岗
	getURL(0) + "/bg/budgetItem/singlePost/saveReplyBudgetItems", //22 保存-预拨
	getURL(0) + "/bg/budgetItem/singlePost/getReplyBudgetItems", //23， 查询-预拨
	getURL(0) + "/bg/budgetItem/singlePost/delReplyBudgetItems", //24， 删除-预拨
	getURL(0) + "/bg/budgetItem/reply", //25 批复-预拨
	getURL(0) + "/bg/budgetItem/cancelReply", //26 销批 - 预拨
	getURL(0) + "/bg/budgetItem/multiPost/getBills", //27  指标界面查询（查询 单据）
	getURL(0) + "/bg/sysdata/getAgencyType" //28  获得单位列表
];

//社保的请求URL
var _bgPub_requestUrlArray_socialSec = [
	getURL(0) + "/bg/unallocateBudgetItem/getBudgetItems", //0  指标界面查询，获得指标  ***
	getURL(0) + "/bg/Plan/budgetAccoSet/getMaAccoList", //1  获得科目列表
	getURL(0) + "/bg/unallocateBudgetItem/budgetItemLog", //2  获得指标日志  ***
	getURL(0) + "/bg/unallocateBudgetItem/newBudgetItem", //3  新增一条指标  ***
	getURL(0) + "/bg/unallocateBudgetItem/saveUnallocateBudgetItems", //4 指标保存- 批量 ***
	getURL(0) + "/bg/unallocateBudgetItem/delBudgetItems", //5  指标删除/指标单据删除-批量 ***
	getURL(0) + "/bg/budgetItem/impBudgetItems", //6 导入
	getURL(0) + "/bg/unallocateBudgetItem/expBudgetItems", //7 导出 ***
	getURL(0) + "/bg/attach/uploadAttach", //8 附件导入
	getURL(0) + "/bg/sysdata/getEleBgItemValues", //9  获得要素
	getURL(0) + "/bg/unallocateBudgetItem/sendToAudit", //10 指标送审（批量） ***
	getURL(0) + "/bg/unallocateBudgetItem/withDraw", //11 指标收回 ***
	getURL(0) + "/bg/unallocateBudgetItem/audit", //12 指标审核  ***
	getURL(0) + "/bg/unallocateBudgetItem/cancelAudit", //13  指标销审 ***
	getURL(0) + "/bg/unallocateBudgetItem/newBill", //14  新建一个单据 ***
	getURL(0) + "/bg/attach/FileDownload", //15, 附件导出
	getURL(0) + "/bg/attach/delAttach", //16，附件删除
	getURL(0) + "/bg/attach/getAttach", //17，附件查找
	getURL(0) + "/bg/unallocateBudgetItem/billLog", //18, 单据日志 ***
	getURL(0) + "/bg/unallocateBudgetItem/getBills", //19, 单据查找，获得单据
	getURL(0) + "/gl/file/upload" //20, 测试用，无实际意义
];

//报表的URL
var _bgPub_requestUrlArray_report = [
	getURL(0) + "/bg/unallocate/report/getTzReport", //0, 指标台账 - 社保的
	getURL(0) + "/bg/unallocate/report/getBgExecuteReport", //1, 指标预算执行情况表 - 社保的
	getURL(0) + "/bg/report/getReportFindPlan", //2, 获取报表的查询方案信息 {agencyCode : '',userId : '',userName : '',rptType : ''}
	getURL(0) + "/bg/report/saveReportFindPlan", //3, 保存报表的查询方案信息 {prjGuid : '方案的GUID' 如果=null 或者='' 表示是新方案,agencyCode : 单位代码,userName:'',userId :'',rptType :'',prjName :'', prjContent :方案内容，是json字符串。具体含义报表自行定义}
	getURL(0) + "/bg/report/deleteReportFindPlan", //4, 删除报表的查询方案信息 {agencyCode : '',userId : '',prjGuid : ''}
	getURL(0) + "/bg/report/getBgExecuteReport", //5, 指标预算执行情况表 - 社保的
	getURL(0) + "/bg/report/getTzReport" //6, 指标台账
];

/**
 * 从请求的url中获得传入的参数
 * name : 参数名称
 */
var _bgPub_getUrlParam = function (name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
	var r = window.location.search.substr(1).match(reg);
	if (r != null) return unescape(r[2]);
	return null;
};

var _bgPub_getModalHtml = function (modalId) {
  var resultHtml = "";
  var menuid = $.getUrlParam('menuid');
	$.ajax({
		url: getURL(0) + "/pf/bg/pub/bgPubModals.html",
		type: "GET",
		async: false, //同步
		dataType: 'html', //返回的数据格式：json/xml/html/script/jsonp/text
    contentType: 'application/html; charset=utf-8',
    beforeSend: function(xhr) {
      xhr.setRequestHeader("x-function-id",menuid);
    },
		success: function (data) {
			$(data).each(function (i) {
				if ($(this).attr("id") === modalId) {
					resultHtml = $(this).html();
				}
			});
		}
	});
	return resultHtml;
}

var _BgPub_ReSetDataTable_AfterPaint = function (dataTableId) {

	if (!$("#" + dataTableId).hasClass("ufma-table")) {
		$("#" + dataTableId).addClass("ufma-table");
	}
	if (!$("#" + dataTableId).hasClass("dataTable")) {
		$("#" + dataTableId).addClass("dataTable");
	}
	$("#" + dataTableId + " td.dataTables_empty").text("没有符合条件的数据");
	var $clostDiv = $("#" + dataTableId).closest("div");
	$($clostDiv).css("border-bottom", "0px black solid");
	$(".bgtooltip").tooltip();
}

//----------------- 公共指标控件的函数 ---------------------------------------
/**
 * 根据传入的bgPlanData返回一个要素信息的结果_curBgPlanMsg的对象
 * @param  {[type]} bgPlanData 使用预算方案下拉框得到的data即可
 * @return {[type]}            _curBgPlanMsg的对象
 */
var _BgPub_GetBgPlanEle = function (bgPlanData) {
	var rst = new _curBgPlanMsg();
	if (bgPlanData == null || bgPlanData.planVo_Items == null || bgPlanData.planVo_Items.length == 0) {
		return rst;
	}
	//CWYXM-12062 --指标预算方案里有部门要素,但是在指标编制里面没有部门输入框---修改指标编制预算方案动态列问题--zsj
	var eleNameArr = [];
	for (var n = 0; n < bgPlanData.planVo_Items.length; n++) {
		eleNameArr.push(bgPlanData.planVo_Items[n].eleName);
	}
  var notUse = '摘要';
  var countNumNotASSI = 0
	for (var i = 0; i < bgPlanData.planVo_Items.length; i++) {
    var curEle = bgPlanData.planVo_Items[i];
     //CWYXM-18216 --已经有记忆列的预算方案重新修改辅助项时(在预算方案里增减辅助项)，界面显示不同步--zsj
		if (($.inArray(notUse, eleNameArr) > -1 && curEle.eleName == '摘要')|| ($.inArray('财政指标ID', eleNameArr) > -1 && curEle.eleName == "财政指标ID") || ($.inArray(bgPlanData.needSendDocNum, eleNameArr) > -1 && curEle.eleName == bgPlanData.needSendDocNum)) {
      countNumNotASSI ++ ;
    }
    if (countNumNotASSI > 0) {
      if (curEle.eleName != '摘要' && curEle.eleName != bgPlanData.needSendDocNum && curEle.eleName != "财政指标ID") { 
				var eleIdFlag = _func_getEleFlagByCode(curEle.eleCode);
				if (curEle.eleIsPri == "1") {
					rst.priEle = curEle.eleCode;
					rst.priEleName = curEle.eleName;
					rst.priEleFieldName = curEle.eleFieldName;
					rst.priEleLevel = curEle.eleLevel;
				}
				//CWYXM-12003 --指标调剂-在调剂指标处有一项问undentified--zsj
				if (i != 0) {
          rst.eleCodeArr[i - countNumNotASSI] = curEle.eleCode;
					rst.eleFieldName[i - countNumNotASSI] = curEle.eleFieldName; //eleFieldName
					rst.eleNameArr[i - countNumNotASSI] = curEle.eleName;
					rst.eleLevelArr[i - countNumNotASSI] = curEle.eleLevel;
					rst.eleIdArr[i - countNumNotASSI] = _func_getEleFlagByCode(curEle.eleCode)
          }
				}
		} else {
			var eleIdFlag = _func_getEleFlagByCode(curEle.eleCode);
			if (curEle.eleIsPri == "1") {
				rst.priEle = curEle.eleCode;
				rst.priEleName = curEle.eleName;
				rst.priEleFieldName = curEle.eleFieldName;
				rst.priEleLevel = curEle.eleLevel;
			}
			//CWYXM-12003 --指标调剂-在调剂指标处有一项问undentified--zsj
			rst.eleCodeArr[i] = curEle.eleCode;
			rst.eleFieldName[i] = curEle.eleFieldName; //eleFieldName
			rst.eleNameArr[i] = curEle.eleName;
			rst.eleLevelArr[i] = curEle.eleLevel;
			rst.eleIdArr[i] = _func_getEleFlagByCode(curEle.eleCode)
		}
	};
	return rst;
};

var _func_getEleFlagByCode = function (eleCode) {
	var upperCode = eleCode.toUpperCase();
	return "cbb_" + upperCode;
};
//CWYXM-10166 指标编制、指标控制管理界面记忆预算方案--新增需求记忆预算方案--单位加载完后请求预算方案，若有记忆则用已经记忆 的值的数据--zsj
var sessionPlanData = [];
var sessionPlan = function (data) {
	var argu = data;
	ufma.get('/pub/user/menu/config/select', argu, function (result) {
		sessionPlanData = result.data;
	});
}
//--- 设置div, 使其成为 选择预算方案的 下拉框
//--- pdata 如果！=null 就使用pdata。否则使用url
var currentplanData = {}; //全局变量   主要处理来文文号，发文文号
var _BgPub_Bind_ComboBox_BgPlanList = function (divIdName, agencyCode, menuId, acctCode, bgPlanCacheId, openType, cbBgPlanIdMain, funcOnChange, pdata, curPlanId) {
	if (agencyCode == null) {
		return null;
	}
	var vm = null;
	//CWYXM-10166 指标编制、指标控制管理界面记忆预算方案--新增需求记忆预算方案--单位加载完后请求预算方案，若有记忆则用已经记忆 的值的数据--zsj
	var selectArgu = {
		agencyCode: agencyCode,
		acctCode: acctCode,
		menuId: menuId
	}
	sessionPlan(selectArgu);
	if ($.isNull(pdata)) {
    $("#" + divIdName).attr("agencyCode", "");
    var url = _bgPub_requestUrlArray[1]; //+ "?agencyCode=" + agencyCode + "&setYear=" + ufma.getCommonData().svSetYear + "&isEnabled=1";
    var argu = {
      agencyCode: agencyCode,
      setYear: parseInt(ufma.getCommonData().svSetYear),
      isEnabled:'1'
    }
    // 修改85平台问题--zsj
    ufma.ajaxDef(url,'get',argu,function(result){
      $("#" + divIdName).ufCombox({
        // url: _bgPub_requestUrlArray[1] + "?agencyCode=" + agencyCode + "&setYear=" + ufma.getCommonData().svSetYear + "&isEnabled=1",
        data:result.data,
        idField: "chrId",
        textField: "chrName",
        placeholder: "请选择预算方案",
        onChange: function (sender, itemData) {
          currentplanData = itemData;
          funcOnChange(itemData);
          if (!$.isNull(bgPlanCacheId) && divIdName != '_bgPub_cbb_BgPlan_twoSidesAdjItem_modal_step2_morePnl' && divIdName != '_bgPub_cbb_BgPlan_twoSidesAdjItem_modal_step1_morePnl') {
            var configKey = bgPlanCacheId;
            var configValue = itemData.chrId + "," + itemData.chrName;
            var argu = {
              acctCode: "*",
              agencyCode: agencyCode,
              configKey: configKey,
              configValue: configValue,
              menuId: menuId
            }
            ufma.post('/pub/user/menu/config/update', argu, function (reslut) {
              sessionPlan(selectArgu);
            });
          }
        },
        onComplete: function (sender, data) {
          var val = curPlanId;
          if ($.isNull(curPlanId)) {
            var enabledList = data.select(function (el, i, res, param) {
              return el.enabled == '是';
            });
            if (enabledList.length > 0) {
              val = enabledList[0].chrId;
            }
          }
          //CWYXM-10166 指标编制、指标控制管理界面记忆预算方案--新增需求记忆预算方案--单位加载完后请求预算方案，若有记忆则用已经记忆 的值的数据--zsj
          if (!$.isEmptyObject(sessionPlanData) && !$.isNull(sessionPlanData[bgPlanCacheId]) && openType == 'new' && divIdName != '_bgPub_cbb_BgPlan_twoSidesAdjItem_modal_step2_morePnl' && divIdName != '_bgPub_cbb_BgPlan_twoSidesAdjItem_modal_step1_morePnl') {
            var planData = sessionPlanData[bgPlanCacheId].split(',');
            var planId = planData[0];
            var planName = planData[1];
              //CWYXM-17038 指标管理模块--所有涉及到预算方案记忆的界面均需判断已记忆方案是否被删除--zsj
            var planIdArr = [];
            for(var a = 0; a < data.length; a++) {
                planIdArr.push(data[a].chrId);
            } 
            if($.inArray(planId,planIdArr) > -1){                                           
                val = planId;
            }                   
          }
          if (!$.isNull(val)) {
            $("#" + divIdName).getObj().val(val);
          }
          if (divIdName == '_bgPub_cbb_BgPlan_twoSidesAdjItem_modal_step1_morePnl') {
            $("#" + divIdName).getObj().val(cbBgPlanIdMain);
          }
          //使用url加载完数据，把单位代码记录上
          $("#" + divIdName).attr("agencyCode", agencyCode);
        }
      });
    })
	} else {
		$("#" + divIdName).ufCombox({
			data: pdata,
			idField: "chrId",
			textField: "chrName",
			placeholder: "请选择预算方案",
			onChange: function (sender, itemData) {
				funcOnChange(itemData);
				if (!$.isNull(bgPlanCacheId)) {
					var configKey = divIdName;
					var configValue = itemData.chrId + "," + itemData.chrName;
					var argu = {
						acctCode: "*",
						agencyCode: agencyCode,
						configKey: configKey,
						configValue: configValue,
						menuId: menuId
					}
					ufma.post('/pub/user/menu/config/update', argu, function (reslut) {});
				}
			},
			onComplete: function ($cbb, data) {
				var val = curPlanId;
				var enabledList = data.select(function (el, i, res, param) {
					return el.enabled == '是';
				});
				//CWYXM-10166 指标编制、指标控制管理界面记忆预算方案--新增需求记忆预算方案--单位加载完后请求预算方案，若有记忆则用已经记忆 的值的数据--zsj
				if (!$.isEmptyObject(sessionPlanData) && !$.isNull(sessionPlanData[bgPlanCacheId]) && openType == 'new') {
					var planData = sessionPlanData[bgPlanCacheId].split(',');
					var planId = planData[0];
					var planName = planData[1];
          val = planId;
          //CWYXM-17038 指标管理模块--所有涉及到预算方案记忆的界面均需判断已记忆方案是否被删除--zsj
          var planIdArr = [];
          for(var a = 0; a < data.length; a++) {
              planIdArr.push(data[a].chrId);
          } 
          if($.inArray(planId,planIdArr) > -1){                                           
              val = planId;
          }  
				} else if (enabledList.length > 0) {
					val = enabledList[0].chrId;
				}
				if (divIdName == '_bgPub_cbb_BgPlan_twoSidesAdjItem_modal_step1_morePnl') {
					$("#" + divIdName).getObj().val(cbBgPlanIdMain);
				}
				$("#" + divIdName).getObj().val(val);
			}
		});
	}

	return vm;
};

//为要素绑定相应事件。--批量
/**
 * eleIdArr : 数组, cbb 控件的id
 * eleCodeArr: 数组, 元素的code值，elecode
 * eleNameArr：数组, 元素的name值，elename
 * eleLevelArr: 数组， eleLevel
 * funcOnChangeArr：数组，元素的相应事件
 * agencyCode：string 单位
 * valueFieldArr：数组，组织树的valueField，可以为null，默认值 chrId
 * textFieldArr ： 数组，组织树的textField，可以为null，默认值 chrName
 */
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
var _BgPub_Bind_EleComboBox = function (eleIdArr, eleCodeArr, eleNameArr, eleLevelArr,
	funcOnChangeArr, agencyCode, valueFieldArr, textFieldArr) {
	var rst = [];
	if (agencyCode == null) {
		return rst;
	}
	for (var i = 0; i < eleIdArr.length; i++) {
		var comP = eleIdArr[i].split("_")[1];
		if (comP != "ISUPBUDGET") {
			rst[i] = $("#" + eleIdArr[i]).ufmaTreecombox({
				url: _bgPub_requestUrlArray[2] + "?agencyCode=" + agencyCode + "&setYear=" + ufma.getCommonData().svSetYear + "&eleCode=" + eleCodeArr[i] + "&eleLevel=" + eleLevelArr[i],
				icon: "",
				valueField: "id",
				textField: "codeName",
				readOnly: false,
				leafRequire: false,
				placeholder: "请选择" + eleNameArr[i],
				onchange: funcOnChangeArr[i] || null
			});
			var sId = eleIdArr[i];
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
			//CWYXM-11697 ---预算方案中要素选择里，增加是否采购属性，启用之后，编制指标时可选是和否，不能输入其他值，采购模块选择指标时，根据这个属性过滤--zsj
			rst[i] = $("#" + eleIdArr[i]).ufmaTreecombox({
				icon: "",
				valueField: "code",
				readOnly: "true",
				textField: "codeName",
				leafRequire: false,
				data: isUpBudgetData,
				placeholder: "请选择是否采购",
				onchange: function (data) {},
				initComplete: function (sender) {}
			});
		}
	}
	return rst;
};
//为要素绑定相应事件。 -- 单挑
/**
 * doc : 一个html 的 doc节点
 * eleCodeArr:元素的code值，elecode
 * eleNameArr：元素的name值，elename
 * eleLevelArr:  eleLevel
 * funcOnChangeArr：元素的相应事件
 * agencyCode：string 单位
 * valueFieldArr：组织树的valueField，可以为null，默认值 chrId
 * textFieldArr ： 组织树的textField，可以为null，默认值 chrName
 */
var _BgPub_Bind_EleComboBox_Single = function (doc, eleCodeArr, eleNameArr, eleLevelArr,
	funcOnChangeArr, agencyCode, valueFieldArr, textFieldArr, billStatus) {
	var rst = null;
	if (eleCodeArr != 'ISUPBUDGET') {
		rst = $(doc).ufmaTreecombox({
			url: _bgPub_requestUrlArray[2] + "?agencyCode=" + agencyCode + "&setYear=" + ufma.getCommonData().svSetYear + "&eleCode=" + eleCodeArr + "&eleLevel=" + eleLevelArr + "&isNew=" + billStatus,
			icon: "",
			valueField: "id",
			readOnly: "true",
			textField: "codeName",
			leafRequire: false,
			placeholder: "请选择" + eleNameArr,
			beforeSelect: function (treeNode) {
				if (eleLevelArr == '-1') {
					return true;
				} else if (eleLevelArr == '0') {
					return treeNode.isLeaf == '1';
				} else {
					return treeNode.levelNum == eleLevelArr;
				}

				return true;
			},
			onchange: funcOnChangeArr || null
		});
	} else {
		//CWYXM-11697 ---预算方案中要素选择里，增加是否采购属性，启用之后，编制指标时可选是和否，不能输入其他值，采购模块选择指标时，根据这个属性过滤--zsj
		rst = $(doc).ufmaTreecombox2({
			icon: "",
			valueField: "code",
			readOnly: "true",
			textField: "codeName",
			leafRequire: false,
			data: isUpBudgetData,
			placeholder: "请选择" + eleNameArr,
			onchange: function (data) {},
			initComplete: function (sender) {}
		});
	}

	/*  var icount = 0;
	  var intverHand = setInterval(function () {
	      var arrNodeArr = rst.setting.tree.transformToArray(rst.setting.tree.getNodes());
	      if (icount > 15) {
	          //超时
	          clearInterval(intverHand);
	      }
	      if (arrNodeArr.length > 0) {
	          rst.setting.tree.expandAll(true);
	          $('#' + rst.setting.id).trigger("click");
	          clearInterval(intverHand);
	      } else {
	          icount++;
	      }
	  }, 500);*/

	return rst;
};
/**
 * 将某个单元格或者div变成可以输入金额的输入框
 */
var _BgPub_Bind_InputMoney = function (doc, id, afterInputFun, defaultVal) {
	if ($(doc).find("input#" + id).length > 0) {
		return false;
	}

	$(doc).empty();
	var _defVal = "";
	if (defaultVal != null) {
		_defVal = defaultVal;
	}
	var iwidth = $(doc).closest("td").outerWidth() -
		parseInt($(doc).closest("td").css("padding-left")) -
		parseInt($(doc).closest("td").css("padding-right"));
	$(doc).append('<input type="text" id="' + id + '" style="width:' + iwidth + 'px" value="' + _defVal + '" onkeyup="this.value=this.value.replace(\/[^0-9.]\/g,\'\')" ' +
		'onafterpaste="this.value=this.value.replace(\/[^0-9.]\/g,\'\')"/>');
	$(doc).on("keyup", function (e) {
		if (e.keyCode == 13) { //13等于回车键(Enter)键值,ctrlKey 等于 Ctrl
			var v = $("#" + id).val();
			$("#" + id).remove();
			$(doc).empty();
			$(doc).append(v);
			if (afterInputFun != null) {
				afterInputFun(v, doc);
			}
			e.keyCode = 0;
		}
	});

	return true;
};
/**
 * 将某个单元格或者div变成可以输入字符串的输入框
 */
var _BgPub_Bind_InputText = function (doc, id, afterInputFun, defaultVal) {
	if ($(doc).find("input#" + id).length > 0) {
		return false;
	}
	$(doc).empty();
	var _defVal = "";
	if (defaultVal != null) {
		_defVal = defaultVal;
	}
	var iwidth = $(doc).closest("td").outerWidth() -
		parseInt($(doc).closest("td").css("padding-left")) -
		parseInt($(doc).closest("td").css("padding-right"));
	$(doc).append('<input type="text" id="' + id + '" value="' + _defVal + '" style="width:' + iwidth + 'px"/>');
	$(doc).on("keyup", function (e) {
		if (e.keyCode == 13) { //13等于回车键(Enter)键值,ctrlKey 等于 Ctrl
			var v = $("#" + id).val();
			$("#" + id).remove();
			$(doc).empty();
			$(doc).append(v);
			if (afterInputFun != null) {
				afterInputFun(v, doc);
			}
			e.keyCode = 0;
		}
	});

	function moveEnd(obj) {
		obj.focus();
		var len = obj.value.length;
		if (document.selection) {
			var sel = obj.createTextRange();
			sel.moveStart('character', len); //设置开头的位置
			sel.collapse();
			sel.select();
		} else if (typeof obj.selectionStart == 'number' && typeof obj.selectionEnd == 'number') {
			obj.selectionStart = obj.selectionEnd = len;
		}
	}($(id)).get(0);

	return true;
	// $(id).focus();
};
/**
 * 绑定input只能输入数字
 */
var _BgPub_Bind_inputMoneyListener = function (inputId) {
	$("#" + inputId).on("keyup", function (e) {
		this.value = this.value.replace(/[^0-9.]/g, '');
	});
	$("#" + inputId).on("afterpaste", function (e) {
		this.value = this.value.replace(/[^0-9.]/g, '');
	});
};

/**
 * 根据要素code和要素fieldname获得要素的驼峰属性名称
 */
var _BgPub_getEleDataFieldNameByCode = function (eleCode, eleFieldName) {
	if (eleCode == 'ISUPBUDGET' || eleFieldName == 'ISUPBUDGET') {
		return "isUpBudget";
	} else {
		if (!$.isNull(eleFieldName)) {
			if (eleFieldName.toUpperCase().substring(0, 11) == "BG_RES_ITEM") {
				return "bgResItem" + eleFieldName.substring(11, 13);
			}
			if (eleFieldName.toUpperCase().substring(0, 11) == "BG_DEF_ITEM") {
				return "bgDefItem" + eleFieldName.substring(11, 13);
			} else {
				var lowerCode = eleCode.toLowerCase();
				return lowerCode + "Code";
			}
		}
	}
	if (!$.isNull(eleFieldName)) {
		if (eleFieldName.toUpperCase().substring(0, 11) == "BG_RES_ITEM") {
			return "bgResItem" + eleFieldName.substring(11, 13);
		}
		if (eleFieldName.toUpperCase().substring(0, 11) == "BG_DEF_ITEM") {
			return "bgDefItem" + eleFieldName.substring(11, 13);
		} else {
			var lowerCode = eleCode.toLowerCase();
			return lowerCode + "Code";
		}
	}
};

/**
 * 时间控件
 * @param  {[type]} divId [时间控件绑定到哪个div上面]
 * @return {[type]}       [description]
 */
var _BgPub_dateTimePicker = function (divId) {
	var _dtp = $("#" + divId);
	_dtp.empty();
	if (!_dtp.hasClass("input-group")) {
		_dtp.addClass("input-group");
	}
	if (!_dtp.hasClass("date")) {
		_dtp.addClass("date");
	}
	if (!_dtp.hasClass("bgPub-div-bgDateTime")) {
		_dtp.addClass("bgPub-div-bgDateTime");
	}
	var _dtp_html = "<input type='text' class='form-control' value='" + _BgPub_getCurentDate() + "'/>" +
		"<span class='input-group-addon bgpubgroupaddon'> " +
		"<span class='glyphicon glyphicon-calendar icon-calendar'></span>" +
		"</span>";
	_dtp.append(_dtp_html);

	//给尾部的日期添加格式化数据
	_dtp.datetimepicker({
		language: 'zh-CN', //显示中文
		format: 'yyyy-mm-dd', //显示格式
		minView: "month", //设置只显示到月份
		initialDate: new Date(), //初始化当前日期
		autoclose: true, //选中自动关闭
		todayBtn: true //显示今日按钮
	});

	// _dtp.datetimepicker().on("changeDate", function (e) {
	//     //
	// });

	_dtp.getValue = function () {
		return _dtp.find("input[type='text']").val();
	};

	_dtp.setValue = function (value) {
		_dtp.find("input[type='text']").val(value);
	};

	$(".datetimepicker").find(".glyphicon-arrow-left").addClass("icon-angle-left");
	$(".datetimepicker").find(".glyphicon-arrow-right").addClass("icon-angle-right");
	$(".datetimepicker").find(".glyphicon-arrow-left").removeClass("glyphicon-arrow-left");
	$(".datetimepicker").find(".glyphicon-arrow-right").removeClass("glyphicon-arrow-right");

	return _dtp;
};

/**
 * 获得当前日期 格式默认  yyyy-mm-dd
 * @param pType {[string]} [获得日期格式。支持如下：
 *              null || "0" : yyyy-MM-dd
 *                      "1" : yyyy-MM-01]
 * @return {[type]} [description]
 */
var _BgPub_getCurentDate = function (pType) {
	var _dt = new Date(_bgPub_getUserMsg().busDate);
	var rst = '';
	var iMonth = _dt.getMonth() + 1;
	var sMonth = "";
	if (iMonth < 10) {
		sMonth = "0" + iMonth;
	} else {
		sMonth = iMonth + "";
	}
	//bug79729--zsj--日期没有格式化
	var sDay = _dt.getDate();
	if (sDay < 10) {
		sDay = "0" + sDay;
	} else {
		sDay = sDay + "";
	}
	if ($.isNull(pType) || pType === "0") {
		rst = _dt.getFullYear() + "-" + sMonth + "-" + sDay;
	} else if (pType === "1") {
		// rst = _dt.getFullYear() + "-" + sMonth + "-01";
		rst = _dt.getFullYear() + "-" + "-01" + "-01";
	}
	return rst;
};

/**
 * 获得系统日期 格式默认  yyyy-mm-dd
 * @param pType {[string]} [获得日期格式。支持如下：
 *              null || "0" : yyyy-MM-dd
 *                      "1" : yyyy-MM-01]
 * @return {[type]} [description]
 */
var _BgPub_getCurentSysDate = function (pType) {
	var _dt = new Date(_bgPub_getUserMsg().sysDate);
	var rst = '';
	var iMonth = _dt.getMonth() + 1;
	var sMonth = "";
	if (iMonth < 10) {
		sMonth = "0" + iMonth;
	} else {
		sMonth = iMonth + "";
	}
	if ($.isNull(pType) || pType === "0") {
		rst = _dt.getFullYear() + "-" + sMonth + "-" + _dt.getDate();
	} else if (pType === "1") {
		rst = _dt.getFullYear() + "-" + sMonth + "-01";
	}
	return rst;
};
String.prototype.endWith = function (s) {
	if (s == null || s == "" || this.length == 0 || s.length > this.length)
		return false;
	if (this.substring(this.length - s.length) == s)
		return true;
	else
		return false;
	return true;
};

String.prototype.startWith = function (s) {
	if (s == null || s == "" || this.length == 0 || s.length > this.length)
		return false;
	if (this.substr(0, s.length) == s)
		return true;
	else
		return false;
	return true;
};

//主要素选择树
$.fn.bgPriEleTree = function (setting) {
	setting.idKey = setting.idKey || 'id';
	setting.pIdKey = setting.pIdKey || 'pId';
	setting.nameKey = setting.nameKey || 'name';
	setting.rootName = setting.rootName || '';
	if ($.isNull(setting.async)) {
		setting.async = true;
	}
	$tree = $(this);
	if (!$tree.hasClass('ufmaTree')) {
		$tree.addClass('ufmaTree');
	}
	if (!$tree.hasClass('ztree')) {
		$tree.addClass('ztree');
	}
	var checkBoxTypeObj = {
		"Y": "p",
		"N": "p"
	};
	if (!$.isNull(setting.checkParent)) {
		if (!setting.checkParent) {
			checkBoxTypeObj.Y = "";
			checkBoxTypeObj.N = "";
		}
	}

	var treeSetting = {
		async: {
			enable: setting.async,
			type: 'get',
			dataType: 'json', //返回的数据格式：json/xml/html/script/jsonp/text
			contentType: 'application/json; charset=utf-8',
			url: setting.url || null,
			dataFilter: function (treeId, parentNode, responseData) {
				var data = responseData;
				if (responseData.hasOwnProperty('data')) {
					data = responseData.data;
				}
				if (!$.isNull(setting.rootName)) {
					var rootNode = {};
					rootNode[setting.idKey] = "0";
					rootNode[setting.nameKey] = setting.rootName;
					rootNode.open = true;
					data.unshift(rootNode);
				}
				data[0].open = true;
				return data;
			}
		},
		view: {
			showLine: false,
			showIcon: false,
			addHoverDom: setting.addHoverDom,
			removeHoverDom: setting.removeHoverDom,
			selectedMulti: false
		},
		check: {
			//			enable: function(){if(setting.checkbox) return setting.checkbox;else return false;}(),
			enable: true,
			chkStyle: "checkbox",
			chkboxType: checkBoxTypeObj
		},
		edit: {
			enable: true,
			editNameSelectAll: true,
			showRemoveBtn: setting.showRemoveBtn,
			showRenameBtn: setting.showRenameBtn
		},
		data: {
			simpleData: {
				enable: true,
				idKey: setting.idKey,
				pIdKey: setting.pIdKey,
				rootPId: 0
			},
			key: {
				name: setting.nameKey
			},
			keep: {
				leaf: true
			}
		},
		callback: {
			onAsyncError: function (event, treeId, treeNode, XMLHttpRequest, textStatus, errorThrown) {
				ufma.alert(XMLHttpRequest);
			},
			onAsyncSuccess: setting.onAsyncSuccess || null,
			onClick: setting.onClick || null,
			onDblClick: setting.onDblClick || null,
			onCheck: setting.onCheck || null,
			beforeDrag: setting.beforeDrag,
			beforeEditName: setting.beforeEditName,
			beforeRemove: setting.beforeRemove,
			beforeRename: setting.beforeRename,
			onRemove: setting.onRemove,
			onRename: setting.onRename
		}
	};
	//return $.fn.zTree.init($tree, setting);
	if (setting.hasOwnProperty('url') && !$.isNull(setting.url)) {
		ufma.get(setting.url, {}, function (result) {
			return $.fn.zTree.init($tree, treeSetting, result.data);
		})

	} else {
		return $.fn.zTree.init($tree, treeSetting, setting.data || []);
	}

};

//指标请求的标准格式：
function eleInBgItemObj(data) {
	this.agencyCode = '';
	this.chrId = '';
	this.chrCode = '';
	this.createDateBegin = '';
	this.createDateEnd = '';
	this.businessDateBegin = '';
	this.businessDateEnd = '';
	if (data == '1') {
		this.bgItemSummary = ''; //摘要
	}
	this.bgItemCurMin = '';
	this.bgItemCurMax = '';
	this.expfuncCode = '';
	this.govexpecoCode = '';
	this.expecoCode = '';
	this.depproCode = '';
	this.projectCode = '';
	this.protypeCode = '';
	this.fundtypeCode = '';
	this.bgtsourceCode = '';
	this.fundsourceCode = '';
	this.departmentCode = '';
	this.exptypeCode = '';
	this.bgResItem1 = '';
	this.bgResItem2 = '';
	this.bgResItem3 = '';
	this.bgResItem4 = '';
	this.bgResItem5 = '';
	this.bgResItem6 = '';
	this.bgResItem7 = '';
	this.bgResItem8 = '';
	this.bgResItem9 = '';
	this.bgResItem10 = '';
	this.bgResItem11 = '';
	this.bgResItem12 = '';
	this.bgResItem13 = '';
	this.bgResItem14 = '';
	this.bgResItem15 = '';
	this.bgResItem16 = '';
	this.bgResItem17 = '';
	this.bgResItem18 = '';
	this.bgResItem19 = '';
	this.bgResItem20 = '';
	this.bgResItem21 = '';
	this.bgResItem22 = '';
	this.bgResItem23 = '';
	this.bgResItem24 = '';
	this.bgResItem25 = '';
	this.bgResItem26 = '';
	this.bgResItem27 = '';
	this.bgResItem28 = '';
	this.bgResItem29 = '';
	this.bgResItem30 = '';
	this.bgItemType = '';
}

//指标要素的标准格式：
function eleBgItem() {
	this.eleCode = '';
	this.eleName = '';
	this.eleIsPri = 0;
	this.eleFieldName = '';
	this.level = 0;
	this.eleOnChangeArr = null;
	this.eleComponentId = 0;
}

//指标 结构
function bgItemObj() {
	eleInBgItemObj.call(this); //继承eleInBgItemObj
	//*********以下属性为扩展 *******************
	this.setYear = "";
	this.bgItemId = "";
	this.bgItemCode = "";
	this.bgPlanId = "";
	this.bgPlanCode = "";
	this.bgItemSummary = "";
	this.createDate = "";
	this.createUser = "";
	this.latestOpDate = "";
	this.latestOpUser = "";
	this.bgItemParentid = "";
	this.bgItemParentcode = "";
	this.lastVer = "";
	this.bgCtrlType = "";
	this.bgCtrlRatio = "";
	this.bgWarnRatio = "";
	this.bgItemCur = 0;
	this.bgItemBgcur = 0;
	this.bgItemAdvcur = 0;
	this.status = 1;
	this.dataSource = 1;
	this.createSource = 1;
	this.bgItemReserve = "";
	this.bgReserve = "";
	this.bgReplyDate = "";
	this.bgReplyUser = "";
	this.billId = "";
	this.bgItemCanFpCur = "";
	this.bgItemFpedCur = "";
	this.bgAddCur = 0;
	this.bgCutCur = 0;
	this.checkAddCur = 0;
	this.checkCutCur = 0;
	this.dispenseCur = 0;
	this.composeCur = 0;
	this.adjCur = 0;
	this.realBgItemCur = 0;
	this.bgItemBalanceCur = 0;
	this.detailSummary = "";
	this.detailId = "";
	this.adjustDir = "";
	this.bgUseCur = "";
	this.bgPlanName = "";
	this.bgPlanType = "";
	this.bgCtrlPlanId = "";
	this.bgCtrlPlanCode = "";
	this.bgCtrlPlanName = "";
	this.isNew = "";
}

//[指标单据-头部]请求的标准格式
function bgBill() {
	this.agencyCode = '';
	this.setYear = '';
	this.createDate = '';
	this.createUser = '';
	this.sumary = '';
	this.applicant = '';
	this.billDate = '';
	this.billType = '';
	this.billCur = '';
	this.status = '';
	this.latestOpDate = '';
	this.latestOpUser = '';
	this.items = [];
}

//[指标单据-明细]请求的标准格式
function bgBillDetail() {

}

//[指标单据-审核、销审]请求的格式
function bgBillAuditOrUnAudit() {
	this.agencyCode = '';
	this.status = '';
	this.latestOpDate = '';
	this.latestOpUser = '';
	this.latestOpUserName = '';
	this.checkDate = "";
	this.checkUser = "";
	this.checkUserName = "";
	this.billType = "";
	this.opinion = ""; //意见
	this.items = [];
}

//******************************************** xls 指标文件导入 ************************************************** [开始] ****
/**
 * div: 用于弹出模态框的div
 * name:
 * bgPlanChrId : 方案id
 * requestSuccess: function 导入成功调用函数
 * requestFailed: function 导入失败调用函数
 * impSetting: 常用参数的设置，包括以下内容
 *                     billId : 单据ID。多岗模式的导入，使用此参数传入ID。如果不传，就是单岗模式
 *                     agencyCode ： 单位。如果为null，则不传
 */
var _ImpXlsFile = function (divId, name, bgPlanChrId, requestSuccess, requestFailed, impSetting) {
	var ml_id = (name || '') + "_xlsInputModal";
	var ml_lbl = ml_id + "_label"
	var ml_btn_imp = ml_id + "_btnImp";
	var ml_btn_cancel = ml_id + "_btnCancel";
	var ml_btn_filePath = ml_id + "_btnFilePath";
	var ml_btn_filePath_inputBtn = "__" + ml_btn_filePath;
	var ml_filePath = ml_id + "_filePath";
	var ml_fileForm = ml_id + "_submitForm";

	var ml = _bgPub_getModalHtml("impXlsFileModal");

	ml = ml.replace("{ml_id}", ml_id).replace("{ml_lbl}", ml_lbl).replace("{ml_btn_imp}", ml_btn_imp).
	replace("{ml_btn_cancel}", ml_btn_cancel).replace("{ml_btn_filePath}", ml_btn_filePath).
	replace("{ml_btn_filePath_inputBtn}", ml_btn_filePath_inputBtn).replace("{ml_filePath}", ml_filePath).
	replace("{ml_fileForm}", ml_fileForm);

	if ($("#" + divId).find("#" + ml_id).length > 0) {
		$("#" + divId).remove();
	}
	$("#" + divId).append(ml);

	//********* 绑定模态框事件 *****************************************
	$('#' + ml_id).on('hidden.bs.modal', function () {
		$('#' + ml_id).remove();
	});

	$("#" + ml_btn_filePath).on("click", function (e) {
		$("#" + ml_btn_filePath_inputBtn).trigger("click");
	});

	$("#" + ml_btn_imp).on("click", function (e) {
		if ($.isNull($("#" + ml_filePath).val())) {
			ufma.showTip("请先选择要导入的xls文件", null, "error");
			return false;
		}
		$("#" + ml_fileForm).find("div.input-group-btn").find(".fileinput-upload-button").trigger("click");
	});
	//******************************************************************

	//显示模态框
	$("#" + ml_id).modal('show');
	var impUrlA = null;
	var sAgencyCode = "*";
	if (!$.isNull(impSetting) && !$.isNull(impSetting.agencyCode)) {
		sAgencyCode = impSetting.agencyCode;
	}
	if ($.isNull(impSetting) || $.isNull(impSetting.billId)) {
		impUrlA = getURL(0) + "/bg/sysdata/analizeXlsFile?agencyCode=" + sAgencyCode + "&setYear=" + ufma.getCommonData().svSetYear + "&bgPlanChrId=" + bgPlanChrId;
	} else {
		impUrlA = getURL(0) + "/bg/sysdata/analizeXlsFile?agencyCode=" + sAgencyCode + "&billId=" +
			impSetting.billId + "&setYear=" + ufma.getCommonData().svSetYear + "&bgPlanChrId=" + bgPlanChrId;
	}
	var _impFile_bg = $("#" + ml_btn_filePath_inputBtn).fileinput({
		language: "zh",
		uploadUrl: impUrlA,
		overwriteInitial: false,
		uploadAsync: true, //默认异步上传
		showUpload: true, //是否显示上传按钮
		showRemove: false, //显示移除按钮
		showPreview: true, //是否显示预览
		browseClass: "btn btn-primary", //按钮样式
		enctype: 'multipart/form-data'
	});
	_impFile_bg.on("filebatchselected", function (event, files) {
		//选择文件后的处理方法。
		var subFile = files[files.length - 1];
		var fileName = subFile.name;
		$("#" + ml_filePath).val(fileName);
	});
	_impFile_bg.on("fileuploaded", function (event, data, previewId, index) {
		//上传成功后执行
		var rspData = data.response;
		if (rspData.flag == "success") {
			ufma.showTip("导入成功", null, "success");
			requestSuccess(rspData);
		} else {
			requestFailed(rspData.msg);
		}
	});

	var setting = {};
	setting.ml_id = ml_id;
	setting.ml_lbl = ml_lbl;
	setting.ml_btn_imp = ml_btn_imp;
	setting.ml_btn_cancel = ml_btn_cancel;
	setting.ml_btn_filePath = ml_btn_filePath;
	setting.ml_btn_filePath_inputBtn = ml_btn_filePath_inputBtn;
	setting.ml_filePath = ml_filePath;
	setting.ml_fileForm = ml_fileForm;
	setting.closeModal = function () {
		$("#" + ml_btn_cancel).trigger("click");
	}
	return setting;
};
//******************************************** xls 文件导入 **************************************************** [结束] ****

//******************************************** 模态框 - 输入对话框 ************************************************** [开始] ****
var _bgPub_selfInputModal = function (divId, stitle, sCap, confirmFunc) {
	var selfinput_id = "selfInputModal_" + $.getGuid();
	var selfinput_lbl = selfinput_id + "_label";
	var selfinput_cap = selfinput_id + "_btnImp";
	var selfinput_input = selfinput_id + "_btnCancel";
	var selfinput_btn_ok = selfinput_id + "_btnOK";
	var selfinput_btn_cancel = selfinput_id + "_btnCancel";

	var ml = _bgPub_getModalHtml("selfInputModal");

	ml = ml.replace("{selfinput_id}", selfinput_id).replace("{selfinput_lbl}", selfinput_lbl).replace("{selfinput_cap}", selfinput_cap).
	replace("{selfinput_input}", selfinput_input).replace("{selfinput_btn_ok}", selfinput_btn_ok).
	replace("{selfinput_btn_cancel}", selfinput_btn_cancel);

	if ($("#" + divId).find("#" + selfinput_id).length > 0) {
		$("#" + divId).remove();
	}
	$("body").append(ml);

	$("#" + selfinput_lbl).text(stitle);
	$("#" + selfinput_cap).text(sCap);

	//********* 绑定模态框事件 *****************************************
	$('#' + selfinput_id).on('hidden.bs.modal', function () {
		$('#' + selfinput_id).remove();
	});

	$("#" + selfinput_btn_ok).on("click", function (e) {
		if ($.isNull($("#" + selfinput_input).val())) {
			ufma.showTip("请先选输入信息", null, "error");
			return false;
		}
		if (!$.isNull(confirmFunc)) {
			confirmFunc($("#" + selfinput_input).val());
		}
		$("#" + selfinput_btn_cancel).trigger("click");
	});
	//******************************************************************

	//显示模态框
	$("#" + selfinput_id).modal('show');
	var setting = {};
	setting.selfinput_id = selfinput_id;
	setting.selfinput_lbl = selfinput_lbl;
	setting.selfinput_cap = selfinput_cap;
	setting.selfinput_input = selfinput_input;
	setting.selfinput_btn_ok = selfinput_btn_ok;
	setting.selfinput_btn_cancel = selfinput_btn_cancel;

	setting.closeModal = function () {
		$("#" + selfinput_btn_cancel).trigger("click");
	}
	return setting;
};
//******************************************** xls 文件导入 **************************************************** [结束] ****

//***************************************** 更多  头部查询及显示的组织 ******************************** [开始] ******
function _curBgPlanMsg() {
	this.eleIdArr = []; //ele
	this.eleCodeArr = []; //eleCode
	this.eleNameArr = []; //eleName
	this.eleLevelArr = []; //eleLevel
	this.eleFieldName = [];
	this.eleOnChangeArr = [];
	this.eleBindRst = [];
	this.eleChangeVal = {};

	this.priEle = ""; //elecode
	this.priEleName = ""; //elename
	this.priEleFieldName = ""; //eleFieldname
	this.priEleLevel = ""; //eleLevel

	this.clear = function () {
		this.eleIdArr = [];
		this.eleCodeArr = [];
		this.eleNameArr = [];
		this.eleFieldName = [];
		this.eleLevelArr = [];
		this.eleOnChangeArr = [];
		this.eleBindRst = [];
		this.eleChangeVal = {};

		this.priEle = "";
		this.priEleName = "";
		this.priEleFieldName = "";
		this.priEleLevel = "";
	};
}

/**
 * 头部  的ID列表
 * @type {Object}
 */
// var _PNL_MoreByBgPlan_Ids = null;
var _PNL_MoreByBgPlan_GetIdsFunc = function (divId) {
	return {
		id_bgPub_div_find_Left: "_bgPub_bgitemFindDiv_" + divId,
		id_bgPub_div_find_Right: "_bgPub_bgitemFindDivRight_" + divId,
		id_bgPub_div_find_Left_tbl: "_bgPub_bgitemFindTbl_" + divId,
		id_bgPub_div_find_Left_tbl_firstRow_bgPlanName: "_bgPub_bgplanName_" + divId,
		id_bgPub_div_find_Left_tbl_firstRow_cbbBgPlan: "_bgPub_cbb_BgPlan_" + divId,
		id_bgPub_div_find_Left_tbl_firstRow_eleName: "_bgPub_eleName1_" + divId,
		id_bgPub_div_find_Left_tbl_firstRow_eleValue: "_bgPub_eleValue1_" + divId,
		id_bgPub_div_find_Left_tbl_firstRow_cbbEleName: "_bgPub_cbb_BgPlan_" + divId,
		id_bgPub_div_find_Left_tbl_lastCell_money_name: "_bgPub_bgCreateDateLbl_" + divId,
		id_bgPub_div_find_Left_tbl_lastCell_money_Max: "_bgPub_bgMoneyMax_" + divId,
		id_bgPub_div_find_Left_tbl_lastCell_money_Min: "_bgPub_bgMoneyMin_" + divId,
		id_bgPub_div_find_Left_tbl_lastCell_date_name: "_bgPub_bgitemFindTbl_" + divId,
		id_bgPub_div_find_Left_tbl_lastCell_date_begin: "_bgPub_dtpBegin_" + divId,
		id_bgPub_div_find_Left_tbl_lastCell_date_end: "_bgPub_dtpEnd_" + divId,
		id_bgPub_div_find_Right_btn_find: "_bgPub_btn_find_" + divId,
		id_bgPub_div_find_Right_btn_more: "_bgPub_btn_more_" + divId
	};
};

/**
 * 画一个收缩起来的头部，供界面后面元素的绘画
 * @param  {[type]} divId [description]
 * @return 头部的高度
 */
var _PNL_MoreByBgPlan_initPaint = function (divId, subComponentIds) {
	var _PNL_MoreByBgPlan_Ids = null;
	if ($.isNull(subComponentIds)) {
		_PNL_MoreByBgPlan_Ids = $.extend({}, _PNL_MoreByBgPlan_GetIdsFunc(divId));
	} else {
		_PNL_MoreByBgPlan_Ids = subComponentIds;
	}
	var morPnlHtml = _bgPub_getModalHtml("_PNL_MoreByBgPlan_initPaintModal");
	morPnlHtml = morPnlHtml.replace("{id_bgPub_div_find_Left}", _PNL_MoreByBgPlan_Ids.id_bgPub_div_find_Left).replace("{id_bgPub_div_find_Left_tbl}", _PNL_MoreByBgPlan_Ids.id_bgPub_div_find_Left_tbl).replace("{id_bgPub_div_find_Left_tbl_firstRow_bgPlanName}", _PNL_MoreByBgPlan_Ids.id_bgPub_div_find_Left_tbl_firstRow_bgPlanName).replace("{id_bgPub_div_find_Left_tbl_firstRow_cbbBgPlan}", _PNL_MoreByBgPlan_Ids.id_bgPub_div_find_Left_tbl_firstRow_cbbBgPlan).replace("{id_bgPub_div_find_Left_tbl_firstRow_eleName}", _PNL_MoreByBgPlan_Ids.id_bgPub_div_find_Left_tbl_firstRow_eleName).replace("{id_bgPub_div_find_Left_tbl_firstRow_eleValue}", _PNL_MoreByBgPlan_Ids.id_bgPub_div_find_Left_tbl_firstRow_eleValue).replace("{id_bgPub_div_find_Left_tbl_firstRow_cbbEleName}", _PNL_MoreByBgPlan_Ids.id_bgPub_div_find_Left_tbl_firstRow_cbbEleName).replace("{id_bgPub_div_find_Right}", _PNL_MoreByBgPlan_Ids.id_bgPub_div_find_Right).replace("{id_bgPub_div_find_Right_btn_find}", _PNL_MoreByBgPlan_Ids.id_bgPub_div_find_Right_btn_find).replace("{id_bgPub_div_find_Right_btn_more}", _PNL_MoreByBgPlan_Ids.id_bgPub_div_find_Right_btn_more);

	if ($("#" + divId).html() != null && $("#" + divId).html().trim() != '') {
		$("#" + divId).empty();
	}
	$("#" + divId).append(morPnlHtml);
	var curHeight = ($("#" + _PNL_MoreByBgPlan_Ids.id_bgPub_div_find_Left_tbl).css("height"));
	return curHeight;
};
/**
 * divId : 更多  的内部会部署到哪个div上。"
 * setting :设置,json:
 *    agencyCode   : string 单位代码
 *    changeBgPlan : function 预算方案的下拉框发生变动时调用，传入参数： _curBgPlanData
 *    computHeight : function 点击 更多/收起 按钮时调用，传入参数：$("#" + _id_bgPub_div_find_Left_tbl).css("height") 变动前的值，变动后的值
 *    afterFind    : function 点击 查找  按钮时，从服务器获得数据成功后调用，传入参数： 后台返回的data
 *    showMoney  : boolean 是否显示金额范围的查找  默认显示
 *    dateTimeAtFirst : boolean 日期范围是否放在最前面（预算方案的后面，第一行第二列） 默认否，放在最后
 *    widget : json {key : '名称', value : 'html'} 自行添加小插件。如果有，则被添加到第一行第二列，优先级高于dateTimeAtFirst=true；
 *    doFindBySelf :function(eleInBgItemObj) 点击 查找 按钮时，如果此函数!=null 则调用此函数，传入pnl用户输入的单数。
 *                                否则调用自带函数。 此函数存在时，afterFind函数无效.
 * @return   rst.curBgPlan : 当前的预算方案data;
 rst.curBgPlanMsg : 当前预算方案的json信息，是_curBgPlanMsg的对象;
 rst.curHeight : 当前头部的高度；
 */
var _PNL_MoreByBgPlan = function (divId, setting) {
	var _set = jQuery.extend({}, setting);
	var _curBgPlanData = null;
	var _curBgPlanMsgObj = new _curBgPlanMsg();
	var bShowMoney = true;
	var _PNL_MoreByBgPlan_Ids = $.extend({}, _PNL_MoreByBgPlan_GetIdsFunc(divId));
	var _widget = _set.widget;

	_PNL_MoreByBgPlan_initPaint(divId, _PNL_MoreByBgPlan_Ids); //初始化表头的样子

	if (_set.showMoney != null) {
		bShowMoney = _set.showMoney;
	}
	var bDtpAtFirst = _set.dateTimeAtFirst || false;

	var _func_ele_CbbOnChange = function (data) {}
	/**
	 * 根据预算方案的变动，重绘头部
	 */
	var _repaintBgItem_findPanel = function () {
		_curBgPlanMsgObj.clear();

		var eleIdFlag = "";
		var eleBgItem = null;
		var iIndex = 0;
		var i = 0;
		var iCol = 1;
		var curEle = null;
		var row = "";
		var eleCell = "";
		$("#" + _PNL_MoreByBgPlan_Ids.id_bgPub_div_find_Left_tbl + "  tr:not(:first)").html(""); //清空除了第一行以外的表格;
		$("#" + _PNL_MoreByBgPlan_Ids.id_bgPub_div_find_Left_tbl + "  tr:not(:first)").remove(); //清空除了第一行以外的表格;
		var vPart1 = "<td class='bgPub-bgPlanTbl-lbl'> " +
			"<div class='bgPub-bgPlanTbl-lbl-right' >预算金额:</div>" +
			"</td>" +
			"<td class='bgPub-bgPlanTbl-blank-8p'></td>" +
			"<td class='bgPub-bgPlanTbl-input' value=''> " +
			"<div class='bgPub-div-bgDateTimeFatherPanel'>" +
			"<div class='bgPub-div-bgMoney'>" +
			"<input type='text' id='" + _PNL_MoreByBgPlan_Ids.id_bgPub_div_find_Left_tbl_lastCell_money_Min + "' class='' /> " +
			"</div>" +
			"<div class='bgPub-div-bgDateTimeText'>至</div>" +
			"<div class='bgPub-div-bgMoney'>" +
			"<input type='text' id='" + _PNL_MoreByBgPlan_Ids.id_bgPub_div_find_Left_tbl_lastCell_money_Max + "' class='' /> " +
			"</div>" +
			"</div>" +
			"</td>";

		var vPart2 = "<td class='bgPub-bgPlanTbl-lbl' > " +
			"<div class='bgPub-bgPlanTbl-lbl-right'>" + "录入日期:</div>" +
			"</td>" +
			"<td class='bgPub-bgPlanTbl-blank-8p'></td>" +
			"<td class='bgPub-bgPlanTbl-input' value=''> " +
			"<div class='bgPub-div-bgDateTimeFatherPanel'>" +
			"<div class='uf-datepicker bgPub-div-bgDateTime' id='" + _PNL_MoreByBgPlan_Ids.id_bgPub_div_find_Left_tbl_lastCell_date_begin + "'>" +
			"</div>" +
			"<div class='bgPub-div-bgDateTimeText'>至</div>" +
			"<div class='uf-datepicker bgPub-div-bgDateTime' id='" + _PNL_MoreByBgPlan_Ids.id_bgPub_div_find_Left_tbl_lastCell_date_end + "'>" +
			"</div>" +
			"</div>" +
			" </td>";
		var vPart3 = "<td class='bgPub-bgPlanTbl-lbl'></td>" +
			"<td class='bgPub-bgPlanTbl-blank-8p'></td>" +
			"<td class='bgPub-bgPlanTbl-input' value=''> ";

		if (!$.isNull(_widget)) {
			$("#" + _PNL_MoreByBgPlan_Ids.id_bgPub_div_find_Left_tbl_firstRow_eleName).html(_widget.key);
			$("#" + _PNL_MoreByBgPlan_Ids.id_bgPub_div_find_Left_tbl_firstRow_eleValue).html(_widget.value);

			if (bDtpAtFirst) { //日期被划入第二行第一列
				row = "<tr class='bgPub-bgPlanTbl-tr'>" + vPart2;
				iCol = 2;
				i = 0;
				//$(".bgPub-div-bgDateTime").getObj().setValue(_bgPub_getUserMsg().busDate);//结束日期取业务日期

			}
			var timeId = setTimeout(function () {
				//$("#_bgPub_dtpEnd_bgMoreMsgPnl-bgItemDetailQuery").find("input[type='text']").val(_bgPub_getUserMsg().busDate); //结束日期取业务日期
				$("#_bgPub_dtpEnd_bgMoreMsgPnl-bgItemDetailQuery").find("input[type='text']").val(tempDateEnd); //结束日期取业务日期
				clearTimeout(timeId);
			}, 300);
		} else {
			//第一行的第二部分，是预算方案的第一个元素, 固定死位置了
			if (!bDtpAtFirst) {
				curEle = _curBgPlanData.planVo_Items[0];
				if (curEle.eleName != '摘要' && curEle.eleCode != 'bgItemIdMx' && curEle.eleCode != 'sendDocNum') {
          $("#" + _PNL_MoreByBgPlan_Ids.id_bgPub_div_find_Left_tbl_firstRow_eleName).html(curEle.eleName + ":");
					$("#" + _PNL_MoreByBgPlan_Ids.id_bgPub_div_find_Left_tbl_firstRow_eleValue).attr("value", curEle.eleCode);
          // if (curEle.eleCode == 'bgItemIdMx') {
          //     var eachEleValue = "<input type='text' class='uf-form-control'  id='bgItemIdMx'/>";
          //     $("#" + _PNL_MoreByBgPlan_Ids.id_bgPub_div_find_Left_tbl_firstRow_eleValue).html(eachEleValue);
          // } else if (curEle.eleCode == 'sendDocNum') {
          //     var eachEleValue = "<input type='text' class='uf-form-control' id='sendDocNum'/>";
          //     $("#" + _PNL_MoreByBgPlan_Ids.id_bgPub_div_find_Left_tbl_firstRow_eleValue).html(eachEleValue);
          // } else {
          //     eleIdFlag = _func_getEleFlagByCode(curEle.eleCode) + "_" + $.getGuid();
          //     var eachEleValue = "<div id='" + eleIdFlag + "' class='ufma-treecombox ' />	";
          //     $("#" + _PNL_MoreByBgPlan_Ids.id_bgPub_div_find_Left_tbl_firstRow_eleValue).html(eachEleValue);
          // }
					_curBgPlanMsgObj.eleIdArr[iIndex] = eleIdFlag;
					_curBgPlanMsgObj.eleCodeArr[iIndex] = curEle.eleCode;
					_curBgPlanMsgObj.eleNameArr[iIndex] = curEle.eleName;
					_curBgPlanMsgObj.eleFieldName[iIndex] = curEle.eleFieldName;
					_curBgPlanMsgObj.eleOnChangeArr[iIndex] = function () {};
					_curBgPlanMsgObj.eleLevelArr[iIndex] = curEle.eleLevel;
					if (curEle.eleIsPri == "1") {
						_curBgPlanMsgObj.priEle = curEle.eleCode;
						_curBgPlanMsgObj.priEleName = curEle.eleName;
						_curBgPlanMsgObj.priEleFieldName = curEle.eleFieldName;
						_curBgPlanMsgObj.priEleLevel = curEle.eleLevel;
					}
					iIndex++;
					i = 1;
				}

			} else if (($("#" + _PNL_MoreByBgPlan_Ids.id_bgPub_div_find_Left_tbl_firstRow_eleValue + " .ufma-treecombox").html() == '') && (_PNL_MoreByBgPlan_Ids.id_bgPub_div_find_Left_tbl_firstRow_eleValue == "_bgPub_eleValue1_bgMoreMsgPnl_advBudgetItem")) {
				$("#" + _PNL_MoreByBgPlan_Ids.id_bgPub_div_find_Left_tbl_firstRow_eleName).html("录入日期:");
				var eachEleValue2 =
					"<div class='bgPub-div-bgDateTimeFatherPanel'>" +
					"<div class='uf-datepicker bgPub-div-bgDateTime' id='" + _PNL_MoreByBgPlan_Ids.id_bgPub_div_find_Left_tbl_lastCell_date_begin + "'>" +
					"</div>" +
					"<div class='bgPub-div-bgDateTimeText'>至</div>" +
					"<div class='uf-datepicker bgPub-div-bgDateTime' id='" + _PNL_MoreByBgPlan_Ids.id_bgPub_div_find_Left_tbl_lastCell_date_end + "'>" +
					"</div>" +
					"</div>";
				$("#" + _PNL_MoreByBgPlan_Ids.id_bgPub_div_find_Left_tbl_firstRow_eleValue).html(eachEleValue2);
				i = 0;

				var v_monthFirstDate = _BgPub_getCurentSysDate("1");

				$("#" + _PNL_MoreByBgPlan_Ids.id_bgPub_div_find_Left_tbl_lastCell_date_begin).ufDatepicker({
					format: 'yyyy-mm-dd',
					initialDate: v_monthFirstDate
				});
				$("#" + _PNL_MoreByBgPlan_Ids.id_bgPub_div_find_Left_tbl_lastCell_date_end).ufDatepicker({
					format: 'yyyy-mm-dd',
					initialDate: _bgPub_getUserMsg().sysDate
				}); //结束日期取业务日期
			} else if ($("#" + _PNL_MoreByBgPlan_Ids.id_bgPub_div_find_Left_tbl_firstRow_eleValue + " .ufma-treecombox").html() == '') {
				$("#" + _PNL_MoreByBgPlan_Ids.id_bgPub_div_find_Left_tbl_firstRow_eleName).html("单据日期:");
				var eachEleValue2 =
					"<div class='bgPub-div-bgDateTimeFatherPanel'>" +
					"<div class='uf-datepicker bgPub-div-bgDateTime' id='" + _PNL_MoreByBgPlan_Ids.id_bgPub_div_find_Left_tbl_lastCell_date_begin + "'>" +
					"</div>" +
					"<div class='bgPub-div-bgDateTimeText'>至</div>" +
					"<div class='uf-datepicker bgPub-div-bgDateTime' id='" + _PNL_MoreByBgPlan_Ids.id_bgPub_div_find_Left_tbl_lastCell_date_end + "'>" +
					"</div>" +
					"</div>";
				$("#" + _PNL_MoreByBgPlan_Ids.id_bgPub_div_find_Left_tbl_firstRow_eleValue).html(eachEleValue2);
				i = 0;
				var v_monthFirstDate = _BgPub_getCurentDate("1");

				$("#" + _PNL_MoreByBgPlan_Ids.id_bgPub_div_find_Left_tbl_lastCell_date_begin).ufDatepicker({
					format: 'yyyy-mm-dd',
					initialDate: v_monthFirstDate
				});

				$("#" + _PNL_MoreByBgPlan_Ids.id_bgPub_div_find_Left_tbl_lastCell_date_end).ufDatepicker({
					format: 'yyyy-mm-dd',
					initialDate: _bgPub_getUserMsg().busDate
				}); //结束日期取业务日期
			}
        }
		//多余的元素折入其他行
		for (; i < _curBgPlanData.planVo_Items.length; i++) {
			curEle = _curBgPlanData.planVo_Items[i];
			if (curEle.eleName != '摘要' && curEle.eleName != _set.needSendDocNum && curEle.eleName != '财政指标ID') {
				eleIdFlag = _func_getEleFlagByCode(curEle.eleCode) + "_" + $.getGuid();
				if (curEle.eleIsPri == "1") {
					_curBgPlanMsgObj.priEle = curEle.eleCode;
					_curBgPlanMsgObj.priEleName = curEle.eleName;
					_curBgPlanMsgObj.priEleFieldName = curEle.eleFieldName;
					_curBgPlanMsgObj.priEleLevel = curEle.eleLevel;
				}
			}
			if (iCol % 2 == 1) {
        //CWYXM-11693--nbsh---指标分解、调整、调剂选择指标时，增加按摘要查询的条件--zsj
        //CWYXM-18080 编制指标时需要增加文本说明项，只录入文本，用于描述指标信息--zsj--暂时不显示在查询条件区域
				if (curEle.eleName == '摘要' || curEle.eleName == _set.needSendDocNum || curEle.eleName == '财政指标ID') {
          //第一列
          eleCell = "<td class='bgPub-bgPlanTbl-lbl'> " +
            "<div class='bgPub-bgPlanTbl-lbl-right' id='_bgPub_eleName" + (i + 1) + "'>" + curEle.eleName + ":</div>" +
            "</td>" +
            "<td class='bgPub-bgPlanTbl-blank-8p'></td>" +
            "<td class='bgPub-bgPlanTbl-input' id='_bgPub_eleValue" + (i + 1) + "' value=''> " +
            "<input  type='text' id='cb" + curEle.eleCode + "' class='querySummery uf-form-control "+curEle.eleCode+"' style=' width:250px;border: 1px solid #d9d9d9;'> " +
            "</td>";
          row = "<tr class='bgPub-bgPlanTbl-tr'>" + eleCell;
				} else {
					//第一列
					eleCell = "<td class='bgPub-bgPlanTbl-lbl'> " +
						"<div class='bgPub-bgPlanTbl-lbl-right' id='_bgPub_eleName" + (i + 1) + "'>" + curEle.eleName + ":</div>" +
						"</td>" +
						"<td class='bgPub-bgPlanTbl-blank-8p'></td>" +
						"<td class='bgPub-bgPlanTbl-input' id='_bgPub_eleValue" + (i + 1) + "' value=''> " +
						"<div id='" + eleIdFlag + "' class='ufma-combox ' /> " +
						"</td>";
					row = "<tr class='bgPub-bgPlanTbl-tr'>" + eleCell;
				}
			} else if (iCol % 2 == 0) {
        //CWYXM-11693--nbsh---指标分解、调整、调剂选择指标时，增加按摘要查询的条件--zsj
        //CWYXM-18080 编制指标时需要增加文本说明项，只录入文本，用于描述指标信息--zsj--暂时不显示在查询条件区域
        if (curEle.eleName == '摘要' || curEle.eleName == _set.needSendDocNum || curEle.eleName == '财政指标ID') {
          //第一列
          eleCell = "<td class='bgPub-bgPlanTbl-lbl'> " +
            "<div class='bgPub-bgPlanTbl-lbl-right' id='_bgPub_eleName" + (i + 1) + "'>" + curEle.eleName + ":</div>" +
            "</td>" +
            "<td class='bgPub-bgPlanTbl-blank-8p'></td>" +
            "<td class='bgPub-bgPlanTbl-input' id='_bgPub_eleValue" + (i + 1) + "' value=''> " +
            "<input  type='text' id='cb" + curEle.eleCode + "' class='querySummery uf-form-control "+curEle.eleCode+"' style=' width:250px;border: 1px solid #d9d9d9;'> " +
            "</td>";
          row =  row + eleCell + "</tr>";
				} else  {
          eleCell = "<td class='bgPub-bgPlanTbl-lbl'> " +
          "<div class='bgPub-bgPlanTbl-lbl-right' id='_bgPub_eleName" + (i + 1) + "'>" + curEle.eleName + ":</div>" +
          "</td>" +
          "<td class='bgPub-bgPlanTbl-blank-8p'></td>" +
          "<td class='bgPub-bgPlanTbl-input' id='_bgPub_eleValue" + (i + 1) + "' value=''> " +
          "<div id='" + eleIdFlag + "' class='ufma-treecombox ' /> " +
          "</td>";
            row = row + eleCell + "</tr>";
        }
				//第二列
				$("#" + _PNL_MoreByBgPlan_Ids.id_bgPub_div_find_Left_tbl).append(row);
				row = "";
			}
      iCol++;
      if (curEle.eleName != '摘要' && curEle.eleName != _set.needSendDocNum && curEle.eleName != '财政指标ID') {
        _curBgPlanMsgObj.eleIdArr[iIndex] = eleIdFlag;
        _curBgPlanMsgObj.eleCodeArr[iIndex] = curEle.eleCode;
        _curBgPlanMsgObj.eleNameArr[iIndex] = curEle.eleName;
        _curBgPlanMsgObj.eleFieldName[iIndex] = curEle.eleFieldName;
        _curBgPlanMsgObj.eleOnChangeArr[iIndex] = _func_ele_CbbOnChange;
        _curBgPlanMsgObj.eleLevelArr[iIndex] = curEle.eleLevel;
        iIndex++;
      }	
    }
   //CWYXM-18080 编制指标时需要增加文本说明项，只录入文本，用于描述指标信息--zsj--查询条件区域
    for (var k = 0; k < _curBgPlanData.planVo_Txts.length; k++) {
			curEle = _curBgPlanData.planVo_Txts[k];
			if (iCol % 2 == 1) {
        //第一列
        eleCell = "<td class='bgPub-bgPlanTbl-lbl'> " +
          "<div class='bgPub-bgPlanTbl-lbl-right' id='_bgPub_eleName" + (k + 1) + "'>" + curEle.eleName + ":</div>" +
          "</td>" +
          "<td class='bgPub-bgPlanTbl-blank-8p'></td>" +
          "<td class='bgPub-bgPlanTbl-input' id='_bgPub_eleValue" + (k + 1) + "' value=''> " +
          "<input  type='text' id='cb" + curEle.eleCode + "' class='querySummery uf-form-control "+curEle.eleCode+"' style=' width:250px;border: 1px solid #d9d9d9;'> " +
          "</td>";
        row = "<tr class='bgPub-bgPlanTbl-tr'>" + eleCell;
			} else if (iCol % 2 == 0) {
        //第一列
        eleCell = "<td class='bgPub-bgPlanTbl-lbl'> " +
          "<div class='bgPub-bgPlanTbl-lbl-right' id='_bgPub_eleName" + (k + 1) + "'>" + curEle.eleName + ":</div>" +
          "</td>" +
          "<td class='bgPub-bgPlanTbl-blank-8p'></td>" +
          "<td class='bgPub-bgPlanTbl-input' id='_bgPub_eleValue" + (k + 1) + "' value=''> " +
          "<input  type='text' id='cb" + curEle.eleCode + "' class='querySummery uf-form-control "+curEle.eleCode+"' style=' width:250px;border: 1px solid #d9d9d9;'> " +
          "</td>";
        row =  row + eleCell + "</tr>";
				//第二列
				$("#" + _PNL_MoreByBgPlan_Ids.id_bgPub_div_find_Left_tbl).append(row);
				row = "";
			}
      iCol++;
		}
		//添加尾部元素
		if (row == "") {
			if (bShowMoney && !bDtpAtFirst) { //显示金额  且  日期显示在后面
				row = "<tr class='bgPub-bgPlanTbl-tr'>";
				row = row + vPart1 + vPart2;
				row = row + "</tr>";
				$("#" + _PNL_MoreByBgPlan_Ids.id_bgPub_div_find_Left_tbl).append(row);
			} else if (bShowMoney && bDtpAtFirst) { // 显示金额  且 日期显示在前面
				row = "<tr class='bgPub-bgPlanTbl-tr'>";
				row = row + vPart1 + vPart3;
				row = row + "</tr>";
				$("#" + _PNL_MoreByBgPlan_Ids.id_bgPub_div_find_Left_tbl).append(row);
			} else if (!bShowMoney && !bDtpAtFirst) { //不显示金额  且 日期显示在后面
				row = "<tr class='bgPub-bgPlanTbl-tr'>";
				row = row + vPart2 + vPart3;
				row = row + "</tr>";
				$("#" + _PNL_MoreByBgPlan_Ids.id_bgPub_div_find_Left_tbl).append(row);
			}
		} else {
			if (bShowMoney && !bDtpAtFirst) { //显示金额  且  日期显示在后面
				row = row + vPart1 + "</tr>";
				$("#" + _PNL_MoreByBgPlan_Ids.id_bgPub_div_find_Left_tbl).append(row);
				row = "<tr class='bgPub-bgPlanTbl-tr'>" + vPart2 + vPart3 + "</tr>";
				$("#" + _PNL_MoreByBgPlan_Ids.id_bgPub_div_find_Left_tbl).append(row);
			} else if (bShowMoney && bDtpAtFirst) { // 显示金额  且 日期显示在前面
				row = row + vPart1 + "</tr>";
				$("#" + _PNL_MoreByBgPlan_Ids.id_bgPub_div_find_Left_tbl).append(row);
			} else if (!bShowMoney && !bDtpAtFirst) { //不显示金额  且 日期显示在后面
				row = row + vPart2 + "</tr>";
				$("#" + _PNL_MoreByBgPlan_Ids.id_bgPub_div_find_Left_tbl).append(row);
			} else {
				row = row + vPart3 + "</tr>";
				$("#" + _PNL_MoreByBgPlan_Ids.id_bgPub_div_find_Left_tbl).append(row);
			}
		}

		//给所有的要素控件挂接事件
		_curBgPlanMsgObj.eleBindRst = _BgPub_Bind_EleComboBox(_curBgPlanMsgObj.eleIdArr, _curBgPlanMsgObj.eleCodeArr,
			_curBgPlanMsgObj.eleNameArr, _curBgPlanMsgObj.eleLevelArr, _curBgPlanMsgObj.eleOnChangeArr, _set.agencyCode, [], []);
		_BgPub_Bind_inputMoneyListener(_PNL_MoreByBgPlan_Ids.id_bgPub_div_find_Left_tbl_lastCell_money_Min);
		_BgPub_Bind_inputMoneyListener(_PNL_MoreByBgPlan_Ids.id_bgPub_div_find_Left_tbl_lastCell_money_Max);

		//收起表格
		$("#" + _PNL_MoreByBgPlan_Ids.id_bgPub_div_find_Right_btn_more).text("收起");
		$("#" + _PNL_MoreByBgPlan_Ids.id_bgPub_div_find_Right_btn_more).trigger("click", 'NOT');

		if (_PNL_MoreByBgPlan_Ids.id_bgPub_div_find_Left_tbl_firstRow_eleValue == "_bgPub_eleValue1_bgMoreMsgPnl-bgItemDetailQuery") {
			//格式化日期
			$("#" + _PNL_MoreByBgPlan_Ids.id_bgPub_div_find_Left_tbl_lastCell_date_begin).ufDatepicker({
				format: 'yyyy-mm-dd',
				initialDate: tempDateBegin
			});

			$("#" + _PNL_MoreByBgPlan_Ids.id_bgPub_div_find_Left_tbl_lastCell_date_end).ufDatepicker({
				format: 'yyyy-mm-dd',
				initialDate: tempDateEnd
			});
		} else if ((_PNL_MoreByBgPlan_Ids.id_bgPub_div_find_Left_tbl_firstRow_eleValue != "_bgPub_eleValue1_bgMoreMsgPnl_advBudgetItem") && ($("#" + _PNL_MoreByBgPlan_Ids.id_bgPub_div_find_Left_tbl_firstRow_eleValue + " .ufma-combox").html() == undefined)) {

			//格式化日期
			var v_monthFirstDate = _BgPub_getCurentDate("1");
			$("#" + _PNL_MoreByBgPlan_Ids.id_bgPub_div_find_Left_tbl_lastCell_date_begin).ufDatepicker({
				format: 'yyyy-mm-dd',
				initialDate: v_monthFirstDate
			});
		}

	};

	var _cbb_bgPlan_onchange = function (data) {
		$("#" + _PNL_MoreByBgPlan_Ids.id_bgPub_div_find_Right_btn_find).show(); //guohx  add  20171123   修改无权限时 改为默认不显示查询按钮
		$("#" + _PNL_MoreByBgPlan_Ids.id_bgPub_div_find_Right_btn_more).show();
		$("#" + _PNL_MoreByBgPlan_Ids.id_bgPub_div_find_Right_btn_more).closest("div").find(".arrow").show();
		if (_curBgPlanData != null) {
			if (_curBgPlanData.chrId == data.chrId) {
				return;
			}
		}
		if ($.trim($("#" + _PNL_MoreByBgPlan_Ids.id_bgPub_div_find_Right_btn_more).text()) == "收起") {
			//如果处于更多状态，先收起，再重画，避免走形
			$("#" + _PNL_MoreByBgPlan_Ids.id_bgPub_div_find_Right_btn_more).trigger("click", '');
		}
		var useData = [];
		for (var m = 0; m < data.planVo_Items.length; m++) {
			if (data.planVo_Items[m].eleName != "摘要" && data.planVo_Items[m].eleName != "财政指标ID"&& data.planVo_Items[m].eleName != _set.needSendDocNum) {
				useData.push(data.planVo_Items[m])
			}
    }
    _set.isSendDocNum = data.isSendDocNum;
    _set.isFinancialBudget = data.isFinancialBudget;
		data.planVo_Items = useData;
    _curBgPlanData = data;
    var codeArr = []
    for (var z = 0; z < data.planVo_Items.length; z++) {
        var code = data.planVo_Items[z].eleCode;
        if (code != 'sendDocNum' && code != 'bgItemIdMx'){
            codeArr.push(data.planVo_Items[z]);
        }
    }
    _curBgPlanData.planVo_Items = codeArr
		if (_set.openPageType && _set.openPageType == '1') {
			var summeryArgu = {
				eleName: "摘要",
				eleCode: "bgItemSummary"
			}
			_curBgPlanData.planVo_Items.splice(0, 0, summeryArgu);
        }
        if (_curBgPlanData.isFinancialBudget == '1') {
        var bgItemIdMxArgu = {
				eleName: "财政指标ID",
				eleCode: "bgItemIdMx"
			}
			_curBgPlanData.planVo_Items.splice(0, 0, bgItemIdMxArgu);
        }
        _curBgPlanData.needSendDocNum = _set.needSendDocNum
        if (_curBgPlanData.isSendDocNum == '是') {
        var sendDocNumArgu = {
				eleName:  _set.needSendDocNum,
				eleCode: "sendDocNum"
			}
			_curBgPlanData.planVo_Items.splice(0, 0, sendDocNumArgu);
        }         
		_repaintBgItem_findPanel();
		if (_set != null && _set.changeBgPlan != null) {
			_set.changeBgPlan(_curBgPlanData);
		}
	};
  //转换为驼峰
  var shortLineToTF = function (str) {
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
	//************** 绑定事件 ***********************
	//1， 更多/收起 按钮
	//flag = NOT 不计算高度
	var tempDateBegin = _BgPub_getCurentDate("1");
	var tempDateEnd = _bgPub_getUserMsg().busDate;
	$("#" + _PNL_MoreByBgPlan_Ids.id_bgPub_div_find_Right_btn_more).parent().off("click").on("click", function (e, flag) {
		var $glyphicon = $(this).find('.glyphicon');
		if ($.trim($("#" + _PNL_MoreByBgPlan_Ids.id_bgPub_div_find_Right_btn_more).text()) == "收起") {
			$("#" + _PNL_MoreByBgPlan_Ids.id_bgPub_div_find_Left_tbl + "  tr:not(:first)").hide();
			$("#" + _PNL_MoreByBgPlan_Ids.id_bgPub_div_find_Right_btn_more).text("更多");
			$glyphicon.removeClass('icon-angle-top');
			$glyphicon.addClass('icon-angle-bottom');
			//$("#" + _PNL_MoreByBgPlan_Ids.id_bgPub_div_find_Right_btn_more).closest("div").find(".arrow").find("span").removeClass("open");
		} else {
			$("#" + _PNL_MoreByBgPlan_Ids.id_bgPub_div_find_Right_btn_more).text("收起");
			$glyphicon.removeClass('icon-angle-bottom');
			$glyphicon.addClass('icon-angle-top');
			$("#" + _PNL_MoreByBgPlan_Ids.id_bgPub_div_find_Left_tbl + "  tr:not(:first)").show();
			//$("#" + _PNL_MoreByBgPlan_Ids.id_bgPub_div_find_Right_btn_more).closest("div").find(".arrow").find("span").addClass("open");
		}
		if (!$.isNull(flag) && flag === 'NOT') {
			return;
		} //自动调用事件时，不计算高度。

		var tbl_h1 = $("#" + _PNL_MoreByBgPlan_Ids.id_bgPub_div_find_Left_tbl).css("height");
		var tbl_h2 = $("#" + _PNL_MoreByBgPlan_Ids.id_bgPub_div_find_Left_tbl).css("height");
		if (!$.isNull(_set) && !$.isNull(_set.computHeight)) {
			_set.computHeight(tbl_h1, tbl_h2);
		}
		//修改社保的指标登记问题--bug84900、82105--zsj; 
		var pageHeight = $('.workspace-center').height();
		var planHeight = $('#bgMoreMsgPnl-exebgItem').height();
		var scorll = 0;
		if (planHeight > 62) {
			planHeight = planHeight - 62;
			scorll = 460 + planHeight; //- 330 
		} else {
			scorll = 460;
		}
		$('#fixDiv-exebgItem').css("top", scorll + "px");
	});
	//2，给预算方案的下拉框挂接事件
	if (_PNL_MoreByBgPlan_Ids.id_bgPub_div_find_Left_tbl_firstRow_eleValue == "_bgPub_eleValue1_bgMoreMsgPnl" ||
		_PNL_MoreByBgPlan_Ids.id_bgPub_div_find_Left_tbl_firstRow_eleValue == "_bgPub_eleValue1_bgMoreMsgPnl-twoSidesAdjItem" ||
		_PNL_MoreByBgPlan_Ids.id_bgPub_div_find_Left_tbl_firstRow_eleValue == "_bgPub_eleValue1_bgMoreMsgPnl-bgItemDetailQuery" ||
		_PNL_MoreByBgPlan_Ids.id_bgPub_div_find_Left_tbl_firstRow_eleValue == "_bgPub_eleValue1_bgMoreMsgPnl-exebgItem" ||
		_PNL_MoreByBgPlan_Ids.id_bgPub_div_find_Left_tbl_firstRow_eleValue == "_bgPub_eleValue1_bgMoreMsgPnl-unallocatebgitem" ||
		_PNL_MoreByBgPlan_Ids.id_bgPub_div_find_Left_tbl_firstRow_eleValue == "_bgPub_eleValue1_unallocateBgItem_modal_step1_morePnl" ||
		_PNL_MoreByBgPlan_Ids.id_bgPub_div_find_Left_tbl_firstRow_eleValue == "_bgPub_eleValue1_bgMoreMsgPnl_advBudgetItem") { //指标编制,调剂主界面
		_BgPub_Bind_ComboBox_BgPlanList(_PNL_MoreByBgPlan_Ids.id_bgPub_div_find_Left_tbl_firstRow_cbbBgPlan, _set.agencyCode, _set.menuId, _set.acctCode, _set.bgPlanCacheId, _set.openType, _set.cbBgPlanIdMain, _cbb_bgPlan_onchange, null, ''); //guohx  see去掉 默认传空  
		//CWYXM-10166 指标编制、指标控制管理界面记忆预算方案--新增需求记忆预算方案--传给bgPub.js的数据--zsj
	} else if (_PNL_MoreByBgPlan_Ids.id_bgPub_div_find_Left_tbl_firstRow_eleValue == "_bgPub_eleValue1_twoSidesAdjItem_modal_step1_morePnl") {
    //CWYXM-10166 指标编制、指标控制管理界面记忆预算方案--新增需求记忆预算方案--传给bgPub.js的数据--zsj
    // ZJGA820-1827 --指标调剂模块新增页面2选择调入指标的预算方案需要增加记忆功能。--经雪蕊确认：只记忆主界面的预算方案，弹窗新增调出方案与主界面一致，调入方案与调出方案一致--zsj
		_BgPub_Bind_ComboBox_BgPlanList(_PNL_MoreByBgPlan_Ids.id_bgPub_div_find_Left_tbl_firstRow_cbbBgPlan, _set.agencyCode, _set.menuId, _set.acctCode, _set.bgPlanCacheId, _set.openType, _set.cbBgPlanIdMain, _cbb_bgPlan_onchange, null, _set.cbBgPlanMain);
	} else if (_PNL_MoreByBgPlan_Ids.id_bgPub_div_find_Left_tbl_firstRow_eleValue == "_bgPub_eleValue1_twoSidesAdjItem_modal_step2_morePnl") { //指标调剂调出调入界面
    //CWYXM-10166 指标编制、指标控制管理界面记忆预算方案--新增需求记忆预算方案--传给bgPub.js的数据--zsj
    // ZJGA820-1827 --指标调剂模块新增页面2选择调入指标的预算方案需要增加记忆功能。--经雪蕊确认：只记忆主界面的预算方案，弹窗新增调出方案与主界面一致，调入方案与调出方案一致--zsj
		_BgPub_Bind_ComboBox_BgPlanList(_PNL_MoreByBgPlan_Ids.id_bgPub_div_find_Left_tbl_firstRow_cbbBgPlan, _set.agencyCode, _set.menuId, _set.acctCode, _set.bgPlanCacheId, _set.openType, _set.cbBgPlanIdMain, _cbb_bgPlan_onchange, null, _set.cbBgPlanOut);
	}
	//3，查找
	$("#" + _PNL_MoreByBgPlan_Ids.id_bgPub_div_find_Right_btn_find).off("click").on("click", function (e) {
		if ($.isNull(_curBgPlanData)) {
			return false;
		}
		//************ 增加ajax的参数 *******************
		var _eleCdtn = {};
		if (_set.openPageType && _set.openPageType == '1') {
			_eleCdtn = new eleInBgItemObj(_set.openPageType);
		} else {
			_eleCdtn = new eleInBgItemObj();
		}

		_eleCdtn.agencyCode = _set.agencyCode;
		_eleCdtn.setYear = ufma.getCommonData.svSetYear;
		_eleCdtn.chrId = _curBgPlanData.chrId;
        _eleCdtn.bgItemSummary = $('.bgPub-bgPlanTbl #_bgPub_eleValue1 #cbbgItemSummary').val();
        if (_set.isSendDocNum == "是") {
            if(_set.budgetItemTwoSidesAdjust && _set.budgetItemTwoSidesAdjust == true){
                _eleCdtn.sendDocNum = $('#_bgPub_bgitemFindTbl_bgMoreMsgPnl-twoSidesAdjItem .cbsendDocNum').val()
            }else if(_set.fromWay){
                if(_set.fromWay == 'out'){
                    _eleCdtn.sendDocNum = $('#_bgPub_bgitemFindDiv_twoSidesAdjItem_modal_step1_morePnl .sendDocNum').val()
                } else if(_set.fromWay == 'in'){
                    _eleCdtn.sendDocNum = $('#_bgPub_bgitemFindDiv_twoSidesAdjItem_modal_step2_morePnl .sendDocNum').val()
                }
            } else {
                _eleCdtn.sendDocNum = $('#cbsendDocNum').val()
            }
        } 
        if (_set.isFinancialBudget == "1") {
            if(_set.budgetItemTwoSidesAdjust && _set.budgetItemTwoSidesAdjust == true){
                _eleCdtn.bgItemIdMx = $('#_bgPub_bgitemFindTbl_bgMoreMsgPnl-twoSidesAdjItem .bgItemIdMx').val()
            }else if(_set.fromWay){
                if(_set.fromWay == 'out'){
                    _eleCdtn.bgItemIdMx = $('#_bgPub_bgitemFindDiv_twoSidesAdjItem_modal_step1_morePnl .bgItemIdMx').val()
                } else if(_set.fromWay == 'in'){
                    _eleCdtn.bgItemIdMx = $('#_bgPub_bgitemFindDiv_twoSidesAdjItem_modal_step2_morePnl .bgItemIdMx').val()
                }
            } else {
                _eleCdtn.bgItemIdMx = $('#cbbgItemIdMx').val()
            }
        }
		var surl = _bgPub_requestUrlArray[0];
		//请求添加主要素
		if (_curBgPlanMsgObj.priEle == "") {
			_eleCdtn.priEle = "";
		} else {
			_eleCdtn.priEle = _curBgPlanMsgObj.priEle;
		}
		//添加其他要素条件  _BgPub_getEleDataFieldNameByCode(itemObj.eleCode, itemObj.eleFieldName),
		for (var i = 0; i < _curBgPlanMsgObj.eleIdArr.length; i++) {
			if (_curBgPlanMsgObj.eleIdArr[i].eleName != '摘要' && _curBgPlanMsgObj.eleIdArr[i].eleName != _set.needSendDocNum && _curBgPlanMsgObj.eleIdArr[i].eleName != "财政指标ID" ) {
				var text = _curBgPlanMsgObj.eleBindRst[i].getText();
				if (typeof (text) != 'undefined' && text != '') {
					if (text.indexOf(" ") > -1) {
						text = text.substring(0, text.indexOf(" "));
					}
					for (var iIndex = 0; iIndex < _curBgPlanData.planVo_Items.length; iIndex++) {
						if (_curBgPlanData.planVo_Items[iIndex].eleCode == _curBgPlanMsgObj.eleCodeArr[i]) {
							_eleCdtn[_BgPub_getEleDataFieldNameByCode(_curBgPlanMsgObj.eleCodeArr[i],
								_curBgPlanData.planVo_Items[iIndex].eleFieldName)] = text;
							break;
						}
					}
				}
			}
    }
    //CWYXM-18080 编制指标时需要增加文本说明项，只录入文本，用于描述指标信息--zsj--查询条件区域
    for (var k = 0; k < _curBgPlanData.planVo_Txts.length; k++) {
      var code = shortLineToTF(_curBgPlanData.planVo_Txts[k].eleFieldName)
      _eleCdtn[code] = $('#cb'+_curBgPlanData.planVo_Txts[k].eleFieldName).val()
    }
		var minMoney = $("#" + _PNL_MoreByBgPlan_Ids.id_bgPub_div_find_Left_tbl_lastCell_money_Min).val();
		if (typeof (minMoney) != 'undefined' && minMoney != '') {
			_eleCdtn.bgItemCurMin = minMoney;
		}
		var maxMoney = $("#" + _PNL_MoreByBgPlan_Ids.id_bgPub_div_find_Left_tbl_lastCell_money_Max).val();
		if (typeof (maxMoney) != 'undefined' && maxMoney != '') {
			_eleCdtn.bgItemCurMax = maxMoney;
		}
		if (typeof (maxMoney) != 'undefined' && typeof (minMoney) != 'undefined' && maxMoney != '' && minMoney != '') {
			if (parseFloat(maxMoney) < parseFloat(minMoney)) {
				ufma.showTip("查询条件： 最大金额不能比最小金额小", null, "error");
				return;
			}
		}
		if (_PNL_MoreByBgPlan_Ids.id_bgPub_div_find_Left_tbl_firstRow_eleValue == "_bgPub_eleValue1_bgMoreMsgPnl_advBudgetItem") {
			var beginDtp = $("#" + _PNL_MoreByBgPlan_Ids.id_bgPub_div_find_Left_tbl_lastCell_date_begin).find("input").val();
			if (typeof (beginDtp) != 'undefined' && beginDtp != '') {
				_eleCdtn.createDateBegin = beginDtp;
			} else if (bDtpAtFirst) {
				//如果没有找到开始日期控件，且参数规定首先显示日期，那么就是第一次打开，给予默认日期。否则查找又问题。 wangpl 2017.10.10
				_eleCdtn.createDateBegin = _BgPub_getCurentDate("1");
			}
			var endDtp = $("#" + _PNL_MoreByBgPlan_Ids.id_bgPub_div_find_Left_tbl_lastCell_date_end).find("input").val();
			if (typeof (endDtp) != 'undefined' && endDtp != '') {
				_eleCdtn.createDateEnd = endDtp;
			} else if (bDtpAtFirst) {
				//如果没有找到开始日期控件，且参数规定首先显示日期，那么就是第一次打开，给予默认日期。否则查找又问题。 wangpl 2017.10.10
				_eleCdtn.createDateBegin = _BgPub_getCurentDate("0");
			}
			if (typeof (endDtp) != 'undefined' && typeof (beginDtp) != 'undefined' && endDtp != '' && beginDtp != '') {
				if (endDtp < beginDtp) {
					ufma.showTip("查询条件： 截止日期不能小于开始日期", null, "error");
					return;
				}
			}
			tempDateBegin = beginDtp;
			tempDateEnd = endDtp;
		} else {
			var beginDtp = $("#" + _PNL_MoreByBgPlan_Ids.id_bgPub_div_find_Left_tbl_lastCell_date_begin).find("input").val();
			if (typeof (beginDtp) != 'undefined' && beginDtp != '') {
				_eleCdtn.businessDateBegin = beginDtp;
			} else if (bDtpAtFirst) {
				//如果没有找到开始日期控件，且参数规定首先显示日期，那么就是第一次打开，给予默认日期。否则查找又问题。 wangpl 2017.10.10
				_eleCdtn.businessDateBegin = _BgPub_getCurentDate("1");
			}
			var endDtp = $("#" + _PNL_MoreByBgPlan_Ids.id_bgPub_div_find_Left_tbl_lastCell_date_end).find("input").val();
			if (typeof (endDtp) != 'undefined' && endDtp != '') {
				_eleCdtn.businessDateEnd = endDtp;
			} else if (bDtpAtFirst) {
				//如果没有找到开始日期控件，且参数规定首先显示日期，那么就是第一次打开，给予默认日期。否则查找又问题。 wangpl 2017.10.10
				_eleCdtn.businessDateBegin = _BgPub_getCurentDate("0");
			}
			if (typeof (endDtp) != 'undefined' && typeof (beginDtp) != 'undefined' && endDtp != '' && beginDtp != '') {
				if (endDtp < beginDtp) {
					ufma.showTip("查询条件： 截止日期不能小于开始日期", null, "error");
					return;
				}
			}
			tempDateBegin = beginDtp;
			tempDateEnd = endDtp;
		}

		//**********************************************
		if (_set.doFindBySelf != null) {
			if (!$.isNull(_eleCdtn)) {
				if (_eleCdtn.isUpBudget == '是') {
					_eleCdtn.isUpBudget = '1'
				} else if (_eleCdtn.isUpBudget == '否') {
					_eleCdtn.isUpBudget = '0'
				}
			}
			_set.doFindBySelf(_eleCdtn);
		} else {
			if (!$.isNull(_eleCdtn)) {
				if (_eleCdtn.isUpBudget == '是') {
					_eleCdtn.isUpBudget = '1'
				} else if (_eleCdtn.isUpBudget == '否') {
					_eleCdtn.isUpBudget = '0'
				}
			}
			ufma.ajaxDef(surl,'post',
				_eleCdtn,
				function (result) {
					if (_set != null && _set.afterFind != null) {
						_set.afterFind(result);
					}
				}
			);
		}
	});

	//*************** 返回结果 ****************
	var rst = {};
	rst.curBgPlan = _curBgPlanData;
	rst.curBgPlanMsg = _curBgPlanMsgObj;
	rst.curHeight = $("#" + _PNL_MoreByBgPlan_Ids.id_bgPub_div_find_Left_tbl).css("height");
	rst.doFindBtnClick = function () {
		$("#" + _PNL_MoreByBgPlan_Ids.id_bgPub_div_find_Right_btn_find).trigger("click");
	};
	rst.planIds = $.extend({}, _PNL_MoreByBgPlan_Ids);
	return rst;
};
//***************************************** 更多  头部查询及显示的组织 ******************************** [结束] ******

//***************************** 单位列表 ************************************ [开始] **********
/**
 * 将单位列表绑定到div上
 * divId ：要绑定到的divId
 * setting : json参数，包含：
 *            afterChange : function 单位切换后调用， 传入参数
 */
var _bgPub_Bind_Cbb_AgencyList = function (divId, setting) {
	var vm = null;
	var url = _bgPub_requestUrlArray[3];
	// var menuid = $.getUrlParam('menuid');
	// if (!$.isNull(menuid)) {
	// 	if (url.indexOf('?') == -1) {
	// 		url = url + '?menuId=' + menuid;
	// 	} else {
	// 		url = url + '&menuId=' + menuid;
	// 	}

	// 	url = url + '&roleId=' + ufma.getCommonData().svRoleId;
	// }

	// if (url.indexOf("?") != -1) {
	// 	url = url + "&ajax=1";
	// } else {
	// 	url = url + "?ajax=1";
	// }

	// $.ajax({
	// 	url: url,
	// 	data: {
	// 		"userCode": _bgPub_getUserMsg().userCode,
	// 		"userId": _bgPub_getUserMsg().userId,
	// 		"setYear": ufma.getCommonData().svSetYear
	// 	},
	// 	type: "GET",
	// 	async: false, //同步
	// 	dataType: 'json', //返回的数据格式：json/xml/html/script/jsonp/text
	// 	contentType: 'application/json; charset=utf-8',
	// 	success: function (data) {
	// 		vm = $("#" + divId).ufmaTreecombox2({
	// 			data: data.data,
	// 			icon: "icon-unit",
	// 			readOnly: "true",
	// 			valueField: "id",
	// 			textField: "codeName",
	// 			placeholder: "请选择单位",
	// 			onchange: setting.afterChange
	// 		});
	// 		$("#" + divId).addClass("bgPub-cbbAgency");
	// 		// vm.select(1);
	// 		if (!$.isNull(ufma.getCommonData().svAgencyCode)) {
	// 			vm.val(ufma.getCommonData().svAgencyCode);
	// 		} else {
	// 			vm.val('1');
	// 		}
	// 	}
  // });
  // 修改85平台问题--zsj
  ufma.ajaxDef(url,'GET',{},function(data){
    if(data.flag == 'success') {
      vm = $("#" + divId).ufmaTreecombox2({
        data: data.data,
        icon: "icon-unit",
        readOnly: "true",
        valueField: "id",
        textField: "codeName",
        placeholder: "请选择单位",
        onchange: setting.afterChange
      });
      $("#" + divId).addClass("bgPub-cbbAgency");
      // vm.select(1);
      if (!$.isNull(ufma.getCommonData().svAgencyCode)) {
        vm.val(ufma.getCommonData().svAgencyCode);
      } else {
        vm.val('1');
      }
    }
  })
	return vm;
};
//***************************** 单位列表 ************************************ [结束] **********
//***************************** 区划列表（本质也是单位，财政单位）        ***** [开始] **********
/**
 * 将单位列表绑定到div上
 * divId ：要绑定到的divId
 * setting : json参数，包含：
 *            afterChange : function 单位切换后调用， 传入参数
 */
var _bgPub_Bind_Cbb_RgAgencyList = function (divId, setting) {
	var vm = $("#" + divId).ufmaTreecombox2({
		url: _bgPub_requestUrlArray[3],
		valueField: "id",
		textField: "name",
		placeholder: "请选择区划",
		onchange: setting.afterChange
	});
	$("#" + divId).addClass("bgPub-cbbAgency");
	vm.select(1);
	return vm;
};
//***************************** 单位列表 ************************************ [结束] **********
//*****************************
//***************************** 账套列表 ************************************ [开始] **********
/**
 * 将单位列表绑定到div上
 * divId ：要绑定到的divId
 * setting : json参数，包含：
 *            afterChange : function 单位切换后调用， 传入参数
 */
var _bgPub_Bind_Cbb_AcctList = function (divId, setting, agencyCode) {
	var vm = null;
	var url = _bgPub_requestUrlArray[4] + "?agencyCode=" + agencyCode + '&setYear=' + ufma.getCommonData().svSetYear;
	// var menuid = $.getUrlParam('menuid');
	// if (!$.isNull(menuid)) {
	// 	if (url.indexOf('?') == -1) {
	// 		url = url + '?menuId=' + menuid;
	// 	} else {
	// 		url = url + '&menuId=' + menuid;
	// 	}

	// 	url = url + '&roleId=' + ufma.getCommonData().svRoleId;
	// }

	// if (url.indexOf("?") != -1) {
	// 	url = url + "&ajax=1";
	// } else {
	// 	url = url + "?ajax=1";
	// }
	// $.ajax({
	// 	url: url,
	// 	type: "GET",
	// 	async: false, //同步
	// 	dataType: 'json', //返回的数据格式：json/xml/html/script/jsonp/text
	// 	contentType: 'application/json; charset=utf-8',
	// 	success: function (data) {
	// 		if (data.flag == "success") {
	// 			if (data.data.length == 0) {
	// 				ufma.showTip('此单位下账套为空', {}, 'warning')
	// 				vm = $("#" + divId).ufmaCombox2({
	// 					data: [],
	// 					icon: "icon-book",
	// 					readOnly: "true",
	// 					valueField: "code",
	// 					textField: "codeName",
	// 					placeholder: "请选择账套"
	// 				});
	// 			} else {
	// 				vm = $("#" + divId).ufmaCombox2({
	// 					data: data.data,
	// 					icon: "icon-book",
	// 					readOnly: "true",
	// 					valueField: "code",
	// 					textField: "codeName",
	// 					placeholder: "请选择账套",
	// 					onchange: setting.afterChange
	// 				});
	// 				$("#" + divId).addClass("bgPub-cbbAgency");
	// 				vm.select(0);
	// 				//guohx 20181207 解除以下代码注释,修改默认带不出门户设置的账套问题
	// 				var pfData = ufma.getCommonData();
  //                   //vm.val(pfData.svAcctCode);
  //                   //CWYXM-17472 oracle12c 基础资料-预算支出控制设置打开没带出账套,必须得选择一下--zsj--当缓存单位与当前选中单位一致时再考虑赋值
	// 				if (agencyCode == pfData.svAgencyCode && !$.isNull(pfData.svAcctCode)) {
	// 					vm.val(pfData.svAcctCode);
	// 				} else {
	// 					if (!$.isNull(setting.stopLoad)) {
	// 						vm.select(0); //修改不按设置的默认值显示
	// 						setting.stopLoad();
	// 					}
	// 				}
	// 				setting.stopLoad();
	// 			}
	// 		} else {
	// 			vm = null;
	// 		}
	// 	},
	// 	failed: function (data) {
	// 		vm = null;
	// 	}
  // });
  ufma.ajaxDef(url,'GET',{},function(data){
    if (data.flag == "success") {
      if (data.data.length == 0) {
        ufma.showTip('此单位下账套为空', {}, 'warning')
        vm = $("#" + divId).ufmaCombox2({
          data: [],
          icon: "icon-book",
          readOnly: "true",
          valueField: "code",
          textField: "codeName",
          placeholder: "请选择账套"
        });
      } else {
        vm = $("#" + divId).ufmaCombox2({
          data: data.data,
          icon: "icon-book",
          readOnly: "true",
          valueField: "code",
          textField: "codeName",
          placeholder: "请选择账套",
          onchange: setting.afterChange
        });
        $("#" + divId).addClass("bgPub-cbbAgency");
        vm.select(0);
        //guohx 20181207 解除以下代码注释,修改默认带不出门户设置的账套问题
        var pfData = ufma.getCommonData();
        //vm.val(pfData.svAcctCode);
        //CWYXM-17472 oracle12c 基础资料-预算支出控制设置打开没带出账套,必须得选择一下--zsj--当缓存单位与当前选中单位一致时再考虑赋值
        if (agencyCode == pfData.svAgencyCode && !$.isNull(pfData.svAcctCode)) {
          vm.val(pfData.svAcctCode);
        } else {
          if (!$.isNull(setting.stopLoad)) {
            vm.select(0); //修改不按设置的默认值显示
            setting.stopLoad();
          }
        }
        setting.stopLoad();
      }
    } else {
      vm = null;
    }
  })
	return vm;
};
//***************************** 账套列表 ************************************ [结束] **********

/**
 * 对datatable对象进行遍历，查找勾选了checkbox的行的数据，返回。
 * 要求，第一列是checkbox列
 * @param  {[type]} tableId [description]
 * @return {[type]}         [description]
 */
var _bgPub_dataTable_getAllSelectedRowData = function (tableId) {
	var _tmpTblRows = $("#" + tableId).dataTable().fnGetNodes();
	var rst = [];
	if (!$.isNull(_tmpTblRows) && _tmpTblRows.length > 0) {
		for (var i = 0; i < _tmpTblRows.length; i++) {
			var _tmpRow = _tmpTblRows[i];
			if ($(_tmpRow).find("td:eq(0):has(label)").length > 0) {
				var chkRst = $(_tmpRow).find("td:eq(0):has(label)").find("input[type='checkbox']").is(":checked");
				if (chkRst == true) {
					rst[rst.length] = $.extend({}, $("#" + tableId).DataTable().row(_tmpRow).data());
				}
			}
		}
	}
	return rst;
};

/**
 * 绑定自定义数据的下来列表
 * 要求，第一列是checkbox列
 * @param  {[type]} divId [description]
 * @param  {[type]} arrData [{id:'', name:''}, {id:'', name:''}, {id:'', name:''}]
 * @param  {[type]} msg [没有选择时的提示信息]
 * @param  {[type]} afterChange
 * @return {[type]}         [description]
 */
var _bgPub_bind_selfDefined_ComboBox = function (divId, arrData, msg, afterChange) {
	var vm = $("#" + divId).ufmaTreecombox({
		data: arrData,
		valueField: "id",
		textField: "name",
		placeholder: msg,
		onchange: afterChange
	});
	vm.select(1);
	return vm;
};

var _bgPub_getBillTypeName = function (billTypeCode) {
	var rst = "";
	switch (billTypeCode) {
		case "1":
			rst = "指标录入";
			break;
		case "2":
			rst = "指标分解";
			break;
		case "3":
			rst = "指标调整";
			break;
		case "4":
			rst = "指标调剂";
			break;
		case "5":
			rst = "待分配指标录入";
			break;
		case "6":
			rst = "下拨指标录入";
			break;
		case "7":
			rst = "指标分配";
			break;
		case "GL":
			rst = "凭证"; //add by guohx 20171228
			break;
		default:
			rst = "指标录入";
			break;
	}
	return rst;
};

/**
 *获得当前系统的用户信息
 * @return {{userName: (*|string), userCode: (*|string), userId: (*|string)}}
 */
var _bgPub_getUserMsg = function () {
	return {
		userName: ufma.getCommonData().svUserName,
		userCode: ufma.getCommonData().svUserCode,
		userId: ufma.getCommonData().svUserId,
		busDate: ufma.getCommonData().svTransDate,
		sysDate: ufma.getCommonData().svSysDate.substring(0, 10)
	};

};
/**
 * 合并datatable的表头单元格
 * 注意，目前算法不支持： 同时存在  A|B|C  和 D|E 这种，只能都是 A|B|C 或者 都是 E|F 。
 * 即，不能有不同的层数出现。
 * @param tblId
 */
var _bgPub_SpanDataTableHeadCell = function (tblId) {
	var tmpTblObj = $("#" + tblId).DataTable();
	if ($.isNull(tmpTblObj)) {
		return false;
	}
	//取得头部的表格
	var headers = tmpTblObj.columns().header();
	if (headers.length == 0) {
		return false;
	}
	//检查是否需要进行头部合并。
	var $thead = $(headers[0]).closest("thead"),
		maxLine = 1,
		tmpAppearCount = 0;
	$thead.find("tr:eq(0) th").each(function (index, th) {
		tmpAppearCount = $(th).text().split("|").length - 1;
		if (tmpAppearCount > (maxLine - 1)) {
			maxLine = tmpAppearCount + 1;
		}
	});
	if (maxLine == 1) {
		return false;
	}
	//根据得到的具体行数，填充行。
	var trHtml = $thead.html();
	for (var i = 1; i < maxLine; i++) {
		$thead.append(trHtml);
	}
	$thead.find("th").removeAttr("rowspan");
	$thead.find("th").removeAttr("colspan");
	//合并单元格。
	var iColIndex = 0,
		iRowHeight = $thead.find("tr:eq(0)").outerHeight(true),
		$bodyScrollDiv = $(tmpTblObj.row(0).node()).closest("div"),
		catchColSpanTxt = [],
		catchColSpanNode = [],
		delClassName = "thisSelElementShouldBeDel";
	for (var i = 0; i < maxLine; i++) {
		catchColSpanTxt[i] = "";
		catchColSpanNode[i] = null;
	}
	$thead.find("tr:eq(0) th").each(function (index, th) {
		var tmpTxt = $(this).text(),
			tmpArr = $(th).text().split("|");
		if (tmpArr.length == 1) {
			$(th).attr("rowspan", maxLine);
			$thead.find("tr:gt(0)").each(function (irow, tr) {
				$(tr).find("th:eq(" + iColIndex + ")").addClass(delClassName);
			});
		} else {
			for (var i = 0; i < tmpArr.length; i++) {
				if (tmpArr[i] != catchColSpanTxt[i]) {
					catchColSpanTxt[i] = tmpArr[i];
					catchColSpanNode[i] = $thead.find("tr:eq(" + i + ") th:eq(" + index + ")");
					catchColSpanNode[i].attr("colspan", 1);
					catchColSpanNode[i].text(tmpArr[i]);
					for (var j = i + 1; j < catchColSpanTxt.length; j++) {
						catchColSpanTxt[j] = "";
						catchColSpanNode[j] = null;
					}
				} else {
					$thead.find("tr:eq(" + i + ") th:eq(" + index + ")").addClass(delClassName);
					catchColSpanNode[i].attr("colspan", parseInt(catchColSpanNode[i].attr("colspan")) + 1);
				}
			}
		}
		iColIndex++;
	});
	$thead.find("." + delClassName).remove();
	//调整表格体高度
	$bodyScrollDiv.css("height", ($bodyScrollDiv.outerHeight(true) - (maxLine - 1) * iRowHeight) + "px");
}