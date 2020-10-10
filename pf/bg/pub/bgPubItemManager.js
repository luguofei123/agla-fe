function _bgPub_itemManager() {
	//************************* 属性定义 *****************************
	/**单位
	 * @type {string}
	 */
	this.agencyCode = '';
	/**
	 * 行业类型  1=产品  2=社保
	 */
	this.professionType = 1;
	/**预算方案
	 * @type {null}
	 */
	this.myBgPlanObj = null;
	/**预算方案 - 数据拆解
	 * @type {null}
	 */
	this.myBgPlanMsgObj = null;
	/**单据类型
	 * @type {number}
	 */
	this.billType = 1; //1=指标单据新增(可执行-社保) 2=分解单 3=调整单 4=调剂单 5=待分配(社保) 6=下拨单(社保) 7=分配单(社保) 8=支付单(社保)
	/**可执行  或 预留 指标
	 * @type {number}
	 */
	this.bgReserve = 1; //1 可执行指标    2 预留指标
	/**
	 * @type {number}
	 */
	this.bgItemFrom_billType = 5; //指标来源的单据类型：5=待分配指标
	/**预拨  或  批复  指标
	 * @type {number}
	 */
	this.bgItemReserve = 0; //0: 正常指标；1：预拨指标；2：批复指标

	/**
	 * 查询指标类型 - 可执行
	 * @type {string}
	 */
	this.bgItemType_CanUse = '1';
	/**
	 * 查询指标类型 - 可分解
	 * @type {string}
	 */
	this.bgItemType_Compose = '2';
	/**
	 * 查询指标类型 - 可调剂出
	 * @type {string}
	 */
	this.bgItemType_DespenseOut = '3';
	/**
	 * 查询指标类型 - 可调剂入
	 * @type {string}
	 */
	this.bgItemType_DespenseIn = '4';
	/**
	 * 查询指标类型 - 可调整
	 * @type {string}
	 */
	this.bgItemType_Adjust = '5';

	//************************* 函数定义 ******************************

	/**加载预算方案  -- 传入的预算方案json
	 * @param planObj
	 */
	this.loadBgPlanObjFromObj = function (planObj) {
    var menuid = $.getUrlParam('menuid');
		this.myBgPlanObj = $.extend({}, planObj);
		this.myBgPlanMsgObj = $.extend({}, _BgPub_GetBgPlanEle(this.myBgPlanObj));
	};

	/**加载预算方案  -- 根据预算方案ID加载
	 * @param planId
	 */
	this.loadBgPlanObjById = function (planId) {
    var menuid = $.getUrlParam('menuid');
		var v_planObj = null;
		$.ajax({
			url: _bgPub_requestUrlArray[1],
			data: {
				"agencyCode": this.agencyCode,
				"setYear": ufma.getCommonData().svSetYear,
				"bgPlanChrId": planId
			},
			dataType: "json",
			type: "GET",
			contentType: "application/json;charset=utf-8",
      async: false,
      beforeSend: function(xhr) {
        xhr.setRequestHeader("x-function-id",menuid);
      },
			success: function (data) {
				if (data.data.length > 0) {
					v_planObj = $.extend({}, data.data[0]);
				} else {
					v_planObj = {};
				}
			}
		});

		this.myBgPlanObj = $.extend({}, v_planObj);
		this.myBgPlanMsgObj = $.extend({}, _BgPub_GetBgPlanEle(this.myBgPlanObj));
	};

	/** 获得一个新指标
	 * @param successFunc 请求成功则执行
	 * @param failedFunc 请求失败则执行
	 * @return rstNewItem
	 */
	this.newBgItem = function (successFunc, failedFunc) {
    var rstNewItem = null;
    var menuid = $.getUrlParam('menuid');
		$.ajax({
			url: _bgPub_requestUrlArray_subJs[3], //3  新增一条指标
			type: "GET",
			async: false, //同步
			dataType: 'json', //返回的数据格式：json/xml/html/script/jsonp/text
			contentType: 'application/json; charset=utf-8',
			data: {
				"bgPlanChrId": this.myBgPlanObj.chrId,
				"bgPlanChrCode": this.myBgPlanObj.chrCode,
				"agencyCode": this.agencyCode,
				"setYear": ufma.getCommonData().svSetYear
      },
      beforeSend: function(xhr) {
        xhr.setRequestHeader("x-function-id",menuid);
      },
			success: function (result) {
				if (result.flag == "success") {
					//初始化一些指标数据
					result.data.status = '1'; //未审核
					result.data.dataSource = '1'; //数据来源：手工编制
					result.data.createSource = '1'; //建立来源：编制
					result.data.bgReserve = '1'; //可执行指标
				}
				if (!$.isNull(successFunc)) {
					successFunc(result);
				}
			},
			failed: function (result) {
				if (!$.isNull(failedFunc)) {
					failedFunc(result);
				}
			}
		});

	};

	/**
	 * 获得一个新单据
	 * @param successFunc 成功执行函数，传入responseData.data
	 * @param failedFunc  失败执行函数，传入失败信息
	 */
	this.newBill = function (successFunc, failedFunc) {
    var url = '';
    var menuid = $.getUrlParam('menuid');
		if (this.professionType === 1) {
			url = _bgPub_requestUrlArray_subJs[14];
		} else if (this.professionType === 2) {
			url = _bgPub_requestUrlArray_socialSec[14];
		}

		$.ajax({
			url: url,
			data: {
				"agencyCode": this.agencyCode,
				"setYear": ufma.getCommonData().svSetYear,
				"billType": this.billType
			},
			type: "GET",
			async: false,
			dataType: 'json', //返回的数据格式：json/xml/html/script/jsonp/text
      contentType: 'application/json; charset=utf-8',
      beforeSend: function(xhr) {
        xhr.setRequestHeader("x-function-id",menuid);
      },
			success: function (result) {
				if (result.flag === "success") {
					if (!$.isNull(successFunc)) {
						successFunc(result.data);
					}
				} else {
					if (!$.isNull(failedFunc)) {
						failedFunc(result.msg);
					}
				}
			},
			failed: function (result) {
				if (!$.isNull(failedFunc)) {
					failedFunc(result);
				}
			}
		});
	};

	/**
	 * 删除指标
	 * @param bgItemArr  字符串的数组，记录要删除的指标的ID
	 * @param bgPlanChrId  预算方案ID  guohx  add   满足停用预算方案不可删除,后台要求加参数
	 * @param successFunc  删除成功调用, 没有传入参数
	 * @param failedFunc 删除失败调用，传入参数(失败信息)
	 */
	this.deleteBgItem = function (bgItemArr, bgPlanChrId, successFunc, failedFunc) {
		var url = '';
		if (this.professionType === 1) {
			if (this.bgItemReserve == 0) { //0: 正常指标；
				url = _bgPub_requestUrlArray_subJs[5] + "?billType=" + this.billType + "&agencyCode=" + this.agencyCode + "&setYear" + ufma.getCommonData().svSetYear;
			} else if (this.bgItemReserve == 1) { //1：预拨指标；
				url = _bgPub_requestUrlArray_subJs[24] + "?billType=" + this.billType + "&agencyCode=" + this.agencyCode + "&setYear" + ufma.getCommonData().svSetYear;
			}
		} else if (this.professionType === 2) {
			url = _bgPub_requestUrlArray_socialSec[5] + "?billType=" + this.billType + "&agencyCode=" + this.agencyCode + "&setYear" + ufma.getCommonData().svSetYear;
		}

		var delItem = [];
		for (var i = 0; i < bgItemArr.length; i++) {
			delItem[delItem.length] = {
				"billId": "",
				"bgItemId": bgItemArr[i]
			};
		}
		var requestObj = {
			"agencyCode": this.agencyCode,
			"setYear": ufma.getCommonData().svSetYear,
			"bgPlanChrId": bgPlanChrId,
			"items": delItem
		};
		ufma.post(
			url,
			requestObj,
			function (result) {
				if (result.flag == "success") {
					if (!$.isNull(successFunc)) {
						successFunc(result);
					}
				} else {
					if (!$.isNull(failedFunc)) {
						failedFunc(result.msg);
					}
				}
			}
		);
	};

	/**
	 * 删除指标 - 单据
	 * @param bgItemArr  字符串的数组，记录要删除的指标的ID
	 * @param bgPlanChrId  预算方案ID  guohx  add   满足停用预算方案不可删除,后台要求加参数
	 * @param successFunc  删除成功调用, 没有传入参数
	 * @param failedFunc 删除失败调用，传入参数(失败信息)
	 */
	this.deleteBill = function (billIdArr, bgPlanChrId, successFunc, failedFunc) {
		var url = '';
		if (this.professionType === 1) {
			url = _bgPub_requestUrlArray_subJs[5] + "?billType=" + this.billType + "&agencyCode=" + this.agencyCode + "&setYear" + ufma.getCommonData().svSetYear;
		} else if (this.professionType === 2) {
			url = _bgPub_requestUrlArray_socialSec[5] + "?billType=" + this.billType + "&agencyCode=" + this.agencyCode + "&setYear" + ufma.getCommonData().svSetYear;
		}

		var delItem = [];
		for (var i = 0; i < billIdArr.length; i++) {
			delItem[delItem.length] = {
				"billId": billIdArr[i],
				"bgItemId": null
			};
		}
		var requestObj = {
			"agencyCode": this.agencyCode,
			"setYear": ufma.getCommonData().svSetYear,
			"bgPlanChrId": bgPlanChrId,
			"items": delItem
		};
		ufma.post(
			url,
			requestObj,
			function (result) {
				if (result.flag == "success") {
					if (!$.isNull(successFunc)) {
						successFunc();
					}
				} else {
					if (!$.isNull(failedFunc)) {
						failedFunc(result.msg);
					}
				}
			}
		);
	};

	/**
	 * 指标保存  ---  指标保存，不带单据结构。  ---
	 * @param data  要保存的指标数据，每个指标对象必须要有属性：isNew  shouldSave
	 * @param successFunc(responseData)
	 * @param failedFunc(errMsgString)
	 * @param preTreatmentDataFunc(rowDt) 保存前的预处理数据函数
	 */
	this.saveBgItem = function (data, successFunc, failedFunc, preTreatmentDataFunc) {
		var saveItems = {};
		saveItems.agencyCode = this.agencyCode;
		saveItems.setYear = ufma.getCommonData().svSetYear;
		saveItems.items = [];
		for (var i = 0; i < data.length; i++) {
			var rowDt = data[i];
			if ((rowDt.isNew === "是") || (!$.isNull(rowDt.shouldSave) && rowDt.shouldSave === "1")) {
				if (!$.isNull(preTreatmentDataFunc)) {
					preTreatmentDataFunc(data[i]);
				}
				saveItems.items[saveItems.items.length] = data[i];
			}
		}
		if (saveItems.items.length > 0) {
			var sUrl = "";

			if (this.professionType == 1) {
				if (this.bgItemReserve == 0) { //0: 正常指标；
					sUrl = _bgPub_requestUrlArray_subJs[19];
				} else if (this.bgItemReserve == 1) { //1：预拨指标；
					sUrl = _bgPub_requestUrlArray_subJs[22];
				}
			} else if (this.professionType == 2) {

			}

			ufma.post(sUrl, saveItems,
				function (result) {
					if (result.flag == "success") {
						if (!$.isNull(failedFunc)) {
							successFunc(result);
						}
					} else {
						if (!$.isNull(failedFunc)) {
							failedFunc("保存失败 : " + result.msg);
						}
					}
				});
		} else {
			if (!$.isNull(failedFunc)) {
				failedFunc("没有要保存的指标数据");
			}
		}
	};

	/**
	 * 单据保存 --
	 * @param billDt 单据数据
	 * @param successFunc  保存成功后执行
	 * @param failedFunc   保存失败后执行
	 */
	this.saveBgBill = function (billDt, successFunc, failedFunc) {
		var sUrl = "";
		if (this.professionType == '1') { //产品
			sUrl = _bgPub_requestUrlArray_subJs[4] + "?billType=" + this.billType + "&agencyCode=" + this.agencyCode + '&setYear=' + ufma.getCommonData().svSetYear;
		} else { //社保

		}
		ufma.post(sUrl, billDt,
			function (result) {
				if (result.flag == "success") {
					if (!$.isNull(failedFunc)) {
						successFunc(result);
					}
				} else {
					if (!$.isNull(failedFunc)) {
						failedFunc("保存失败 : " + result.msg);
					}
				}
			}
		);
	};

	/**
	 * 将url请求得到的数据，组织成以下结构：
	 *          第一行：单据头部： 单据号、 日期 、 制单人 ...
	 *          第二行：单据明细1： 指标编号 | 摘要 | 要素... | 金额
	 *          第三行：单据明细2： 指标编号 | 摘要 | 要素... | 金额
	 *          第n行： 单据明细n： 指标编号 | 摘要 | 要素... | 金额
	 *          第n+1行：      更多。
	 * @param urlData 数据结构需要符合：{billWithItemsVo：[{billId:'', billCode:'', ..., billWithItems:[{指标}, {指标}]}, {}]}
	 * @param maxDetailCount
	 * @param addTitleRow  boolean
	 * @param addBottomRow boolean
	 */
	this.organizeUrlBillData = function (urlData, maxDetailCount, addTitleRow, addBottomRow) {
		var rst = {};
		rst.data = [];
		rst.money = 0;
		var maxC = maxDetailCount || 5; //默认5

		var totalMoney = 0;
		if ($.isNull(urlData) || $.isNull(urlData.billWithItemsVo) || urlData.length === 0) {
			return rst;
		}
		rst.billCount = urlData.billWithItemsVo.length;
		for (var i = 0; i < urlData.billWithItemsVo.length; i++) {
			//****** 单据头部 **********
			var tmpBill = urlData.billWithItemsVo[i];
			if (addTitleRow) {
				var billTitle = new bgItemObj();
				billTitle.billId = tmpBill.billId;
				billTitle.bgPlanId = tmpBill.bgPlanId;
				billTitle.billCode = tmpBill.billCode;
				billTitle.billDate = tmpBill.billDate;
				billTitle.agencyCode = tmpBill.agencyCode;
				billTitle.setYear = tmpBill.setYear;
        billTitle.billCur = tmpBill.billCur;
        billTitle.ctrlDeptNum = tmpBill.ctrlDeptNum;
				billTitle.status = tmpBill.status;
				billTitle.createUser = tmpBill.createUser;
				billTitle.createDate = tmpBill.createDate;
				billTitle.createUserName = tmpBill.createUserName;
				billTitle.checkDate = tmpBill.checkDate;
				billTitle.checkUser = tmpBill.checkUser;
				billTitle.checkUserName = tmpBill.checkUserName;
				billTitle.isBill = 1;
				billTitle.isMore = 0;
				billTitle.bgPlanName = '';

				billTitle.bgAddCurShow = 0;
				billTitle.bgCutCurShow = 0;
				billTitle.bgItemBalanceCurShow = 0;
				billTitle.modifyAfterCur = 0;
				billTitle.bgItemUnAllotCurShow = 0;
				billTitle.bgItemCurShow = 0.00;

				billTitle.comeDocNum = "";
				billTitle.sendDocNum = "";
				//sunshuanag--提供给工作流
				billTitle.taskId = tmpBill.taskId;
				billTitle.procDefId = tmpBill.procDefId;
				billTitle.nodeId = tmpBill.nodeId;
				billTitle.procInstId = tmpBill.procInstId;
        billTitle.diffCur = tmpBill.diffCur;
        //CWYXM-18142--nbhs指标调剂申请（审批流版）传递给工作流的数据中需要将如下字段值传递过去--zsj
        /**经雪蕊确认：
         * 指标调剂申请（审批流版）传递给工作流的数据中需要将如下字段值传递过去，用于审批流判断该申请单需要走哪些流程
        1.申请人code 2.申请人所在的部门code，（查询人员库中该申请人所在的部门）3.支出类型exptypecode 4.资金性质fundtypecode 5.项目名称depprocode 6.指标编码bg_item_code
        */
        billTitle.createDeptCode = tmpBill.createDeptCode;
        billTitle.depproCode = tmpBill.billWithItems[0].depproCode;//项目名称
        billTitle.exptypeCode = tmpBill.billWithItems[0].exptypeCode; //支出类型
        billTitle.fundtypeCode = tmpBill.billWithItems[0].fundtypeCode; //资金性质
				billTitle.ctrlUser = tmpBill.ctrlUser;
				billTitle.cwUser = tmpBill.cwUser;
				billTitle.ctrlDeptCode = tmpBill.ctrlDeptCode;
				rst.data[rst.data.length] = billTitle;
			}

			totalMoney = totalMoney + tmpBill.billCur;

			//****** 单据明细 **************
			for (var j = 0; j < tmpBill.billWithItems.length; j++) {
				if (j === maxC) {
					break;
				}
				var tmpBgItem = tmpBill.billWithItems[j];
				tmpBgItem.billId = tmpBill.billId;
				tmpBgItem.bgPlanId = tmpBill.bgPlanId;
        tmpBgItem.billCode = tmpBill.billCode;
				tmpBgItem.isBill = 0;
				tmpBgItem.isMore = 0;

				if ($.isNull(tmpBgItem.bgPlanName)) {
					tmpBgItem.bgPlanName = '';
				}
				tmpBgItem.createDate = tmpBgItem.createDate.substr(0, 10);
				tmpBgItem.bgAddCurShow = tmpBgItem.bgAddCur; //修改金额千分位处理问题
				tmpBgItem.bgCutCurShow = tmpBgItem.bgCutCur; //修改金额千分位处理问题
				tmpBgItem.bgItemBalanceCurShow = tmpBgItem.bgItemBalanceCur; //修改金额千分位处理问题

				tmpBgItem.bgItemUnAllotCurShow = tmpBgItem.bgItemUnAllotCur; //修改金额千分位处理问题
				tmpBgItem.bgItemCurShow = tmpBgItem.bgItemCur; //修改金额千分位处理问题

				rst.data[rst.data.length] = tmpBgItem;
			}

			//***** 单据结尾 **************
			if (addBottomRow) {
				var billBottom = new bgItemObj();
				billBottom.billId = tmpBill.billId;
				billBottom.bgPlanId = tmpBill.bgPlanId;
				billBottom.billCode = tmpBill.billCode;
				billBottom.billDate = tmpBill.billDate;
				billBottom.agencyCode = tmpBill.agencyCode;
				billBottom.setYear = tmpBill.setYear;
        billBottom.billCur = tmpBill.billCur;
        billBottom.ctrlDeptNum = tmpBill.ctrlDeptNum;
				billBottom.status = tmpBill.status;
				billBottom.checkDate = tmpBill.checkDate;
				billBottom.checkUser = tmpBill.checkUser;
				billBottom.isBill = 0;
				billBottom.isMore = 1;
				billBottom.bgPlanName = '';

				billBottom.bgAddCurShow = 0;
				billBottom.bgCutCurShow = 0;
				billBottom.bgItemBalanceCurShow = 0;
				billBottom.modifyAfterCur = 0;

				billBottom.comeDocNum = "";
        billBottom.sendDocNum = "";
        //CWYXM-18142--nbhs指标调剂申请（审批流版）传递给工作流的数据中需要将如下字段值传递过去--zsj
        /**经雪蕊确认：
         * 指标调剂申请（审批流版）传递给工作流的数据中需要将如下字段值传递过去，用于审批流判断该申请单需要走哪些流程
        1.申请人code 2.申请人所在的部门code，（查询人员库中该申请人所在的部门）3.支出类型exptypecode 4.资金性质fundtypecode 5.项目名称depprocode 6.指标编码bg_item_code
        */
        billBottom.createDeptCode = tmpBill.createDeptCode;
        billBottom.depproCode = tmpBill.billWithItems[0].depproCode;//项目名称
        billBottom.exptypeCode = tmpBill.billWithItems[0].exptypeCode; //支出类型
        billBottom.fundtypeCode = tmpBill.billWithItems[0].fundtypeCode; //资金性质
			  rst.data[rst.data.length] = billBottom;
			}
		}
		rst.money = totalMoney;
		return rst;
	};

	/**
	 * 将产品的多岗模式的请求得到的单据，整理得到指标，返回指标
	 * @param billWithItemsVo
	 * @return {Array}
	 */
	this.organizeBgItemFromMultiPostBills = function (billWithItemsVo) {
		var rst = [];
		for (var i = 0; i < billWithItemsVo.length; i++) {
			var tmpBill = $.extend({}, billWithItemsVo[i]);
			for (var j = 0; j < tmpBill.billWithItems.length; j++) {
				var tmpBgItem = tmpBill.billWithItems[j];
				tmpBgItem.bgItemOperCol = "";
				tmpBgItem.createDate = tmpBgItem.createDate.substring(0, 10);
				tmpBgItem.checkDate = $.isNull(tmpBill.checkDate) ? '' : tmpBill.checkDate.substring(0, 10);
				tmpBgItem.checkUser = tmpBill.checkUser;
				tmpBgItem.checkUserName = tmpBill.checkUserName;
				addCurShow(tmpBgItem, "realBgItemCurShow", "realBgItemCur"); //指标金额--经确认还原为原来的金额-CWYXM-10727
				//  addCurShow(tmpBgItem, "realBgItemCurShow", "bgItemCur");//CWYXM-10727 指标分解新增页面，金额应显示最初指标编制金额--zsj
				addCurShow(tmpBgItem, "bgItemBalanceCurShow", "bgItemBalanceCur"); //指标余额
				addCurShow(tmpBgItem, "dispenseCurOutShow", "dispenseCurOut"); //调剂出金额
				addCurShow(tmpBgItem, "dispenseCurInShow", "dispenseCurIn"); //调剂入金额
				addCurShow(tmpBgItem, "afterDispenseCurShow", "afterDispenseCur"); //调剂后金额
				rst[rst.length] = tmpBgItem;
			}
		}
		return rst;
	}

	/**
	 * 添加金额的show字段
	 * @param pObj
	 * @param CurShowName
	 * @param CurName
	 */
	var addCurShow = function (pObj, CurShowName, CurName) {
		if (pObj.hasOwnProperty(CurName)) {
			if ($.isNull(pObj[CurName])) {
				pObj[CurName] = 0.00;
				pObj[CurShowName] = 0.00;
			} else {
				// pObj[CurShowName] = $.formatMoney(pObj[CurName], 2);
				pObj[CurShowName] = pObj[CurName]; //修改金额千分位处理问题
			}
		} else {
			pObj[CurName] = 0.00;
			pObj[CurShowName] = 0.00;
		}
	}

	/**
	 * 审核单据
	 * @param billIdArr  要审核的单据ID数组
	 * @param onSuccess  审核成功执行
	 * @param onFailed  审核失败执行
	 */
	this.auditBill = function (divId, billIdArr, onSuccess, onFailed) {
		var rqObj_audit = new bgBillAuditOrUnAudit();
		rqObj_audit.agencyCode = this.agencyCode;
		rqObj_audit.setYear = ufma.getCommonData.svSetYear;
		rqObj_audit.billType = this.billType;
		rqObj_audit.latestOpUser = _bgPub_getUserMsg().userCode;
		rqObj_audit.latestOpUserName = _bgPub_getUserMsg().userName;
		rqObj_audit.checkDate = _BgPub_getCurentDate("0");
		rqObj_audit.checkUser = _bgPub_getUserMsg().userCode;
		rqObj_audit.checkUserName = _bgPub_getUserMsg().userName;
		for (var i = 0; i < billIdArr.length; i++) {
			rqObj_audit.items[rqObj_audit.items.length] = {
				"billId": billIdArr[i]
			};
		}
		rqObj_audit.status = "3";
		var url = '';
		if (this.professionType == 2) {
			url = _bgPub_requestUrlArray_socialSec[12] + "?billType=" + this.billType + "&agencyCode=" + this.agencyCode;
		} else if (this.professionType == 1) {
			url = _bgPub_requestUrlArray_subJs[12] + "?billType=" + this.billType + "&agencyCode=" + this.agencyCode;
		}
		_bgPub_LoadAuditOrUnAuditModal(divId, 1, url, rqObj_audit, {
			"callbackSuccess": onSuccess || function (data) {
				ufma.showTip("审核成功", null, "success");
			},
			"callbackFailed": onFailed || function (data) {
				ufma.showTip("审核失败." + data, null, "error");
			}
		});
	};

	/**
	 * 销审单据
	 * @param billIdArr  要审核的单据ID数组
	 * @param onSuccess  审核成功执行
	 * @param onFailed  审核失败执行
	 */
	this.unAuditBill = function (divId, billIdArr, onSuccess, onFailed) {
		var rqObj_audit = new bgBillAuditOrUnAudit();
		rqObj_audit.agencyCode = this.agencyCode;
		rqObj_audit.setYear = ufma.getCommonData.svSetYear;
		rqObj_audit.billType = this.billType;
		for (var i = 0; i < billIdArr.length; i++) {
			rqObj_audit.items[rqObj_audit.items.length] = {
				"billId": billIdArr[i]
			};
		}
		rqObj_audit.status = "1";
		var url = '';
		if (this.professionType == 2) {
			url = _bgPub_requestUrlArray_socialSec[13] + "?billType=" + this.billType + "&agencyCode=" + this.agencyCode;
		} else if (this.professionType == 1) {
			url = _bgPub_requestUrlArray_subJs[13] + "?billType=" + this.billType + "&agencyCode=" + this.agencyCode;
		}
		_bgPub_LoadAuditOrUnAuditModal(divId, 2, url, rqObj_audit, {
			"callbackSuccess": onSuccess || function (data) {
				ufma.showTip("销审成功", null, "success");
			},
			"callbackFailed": onFailed || function (data) {
				ufma.showTip("销审失败." + data, null, "error");
			}
		});
	};

	/**
	 * 获得指标。
	 * @param eleCdtnObj 查询条件
	 * @param successFunc 查询成功后执行
	 * @param failedFunc 查询失败后执行
	 * @param itemState 指标状态：1=未审核； 3=已审核； null||0=全部
	 * @return {*}
	 */
	this.getBgItems = function (eleCdtnObj, successFunc, failedFunc, itemState) {
		var surl = '';
    var menuid = $.getUrlParam('menuid');
		if (this.professionType === 1) {
			if (this.bgItemReserve == 0) { //0: 正常指标；
				surl = _bgPub_requestUrlArray_subJs[0] + "?agencyCode=" + this.agencyCode + "&setYear=" + ufma.getCommonData().svSetYear;
			} else if (this.bgItemReserve == 1) { //1：预拨指标； //待修改 预拨需要传系统日期对应年度 但新年度下没有预算方案
				surl = _bgPub_requestUrlArray_subJs[23] + "?agencyCode=" + this.agencyCode + "&bgItemReserve=" + this.bgItemReserve + "&setYear=" + ufma.getCommonData().svSetYear;
			} else if (this.bgItemReserve == 2) { //2：批复指标
				surl = _bgPub_requestUrlArray_subJs[23] + "?agencyCode=" + this.agencyCode + "&bgItemReserve=" + this.bgItemReserve + "&setYear=" + ufma.getCommonData().svSetYear;
			}
		} else if (this.professionType === 2) {

		}

		var tmpEleCdtn = null;
		if (eleCdtnObj == null) {
			tmpEleCdtn = new eleInBgItemObj();
			tmpEleCdtn.agencyCode = this.agencyCode;
			tmpEleCdtn.chrId = this.myBgPlanObj.chrId;
			//请求添加主要素
			if (this.myBgPlanMsgObj.priEle == "") {
				tmpEleCdtn.priEle = "";
			} else {
				tmpEleCdtn.priEle = this.myBgPlanMsgObj.priEle;
			}
		} else {
			tmpEleCdtn = $.extend({}, eleCdtnObj);
		}
		if (!$.isNull(itemState) && itemState !== 0) {
			tmpEleCdtn.status = itemState + "";
		}
		if (this.bgItemReserve != 0) {
			tmpEleCdtn.bgItemReserve = this.bgItemReserve;
		} else {
			tmpEleCdtn.bgItemReserve = '';
		}
		$.ajax({
			url: surl,
			type: "POST",
			data: JSON.stringify(tmpEleCdtn),
			dataType: "json",
			contentType: "application/json;charset=utf-8",
			async: true, //异步
			success: function (data) {
				if (!$.isNull(successFunc)) {
					successFunc(data);
				}
      },
      beforeSend: function(xhr) {
        xhr.setRequestHeader("x-function-id",menuid);
      },
			failed: function (data) {
				if (!$.isNull(failedFunc)) {
					failedFunc(data);
				}
			}
		});

	};

	/**
	 * 查询单据
	 * @param eleCdtnObj 查询条件
	 * @param successFunc  查询成功执行
	 * @param failedFunc   查询失败执行
	 * @param billState  单据状态： 1=未审核； 3=已审核； null||0= 全部
	 */
	this.getBgBills = function (eleCdtnObj, successFunc, failedFunc, billState, complateCommit) {
		var sUrl = '';
    var menuid = $.getUrlParam('menuid');
		if (this.professionType === 1) { //产品
			if (this.bgItemReserve === 0) { //0: 正常指标； // 预拨、批复没有单据
				if ($.isNull(complateCommit) || complateCommit == '0') {
					sUrl = _bgPub_requestUrlArray_subJs[27] + "?agencyCode=" + this.agencyCode + "&setYear=" + ufma.getCommonData().svSetYear;
				} else if (complateCommit == '1') {
					sUrl = '/df/access/public/bg/workflow/getBillDoneList?agencyCode=' + this.agencyCode + '&setYear=' + ufma.getCommonData().svSetYear;
				}

			}
		} else if (this.professionType === 2) {

		}

		var tmpEleCdtn = null;
		if (eleCdtnObj == null) {
			tmpEleCdtn = new eleInBgItemObj();
			tmpEleCdtn.agencyCode = this.agencyCode;
			if (complateCommit == '1') {
				tmpEleCdtn.bgplanChrId = this.myBgPlanObj.chrId;
				tmpEleCdtn.workFlowStatus = "done";
			} else {
				tmpEleCdtn.chrId = this.myBgPlanObj.chrId;
			}

			//请求添加主要素
			if (this.myBgPlanMsgObj.priEle == "") {
				tmpEleCdtn.priEle = "";
			} else {
				tmpEleCdtn.priEle = this.myBgPlanMsgObj.priEle;
			}
		} else {
			tmpEleCdtn = $.extend({}, eleCdtnObj);
			if (complateCommit == '1') {
				delete(tmpEleCdtn["chrId"]);
				tmpEleCdtn.bgPlanChrId = this.myBgPlanObj.chrId;
				tmpEleCdtn.workFlowStatus = "done";
			} else {
				tmpEleCdtn.chrId = this.myBgPlanObj.chrId;
			}
		}
		tmpEleCdtn.billType = this.billType;
		if (!$.isNull(billState) && billState !== 0) {
			tmpEleCdtn.status = billState;
		}
		if (this.bgItemReserve != 0) {
			tmpEleCdtn.bgItemReserve = this.bgItemReserve;
		} else {
			tmpEleCdtn.bg = '';
		}
		$.ajax({
			url: sUrl,
			type: "POST",
			data: JSON.stringify(tmpEleCdtn),
			dataType: "json",
			contentType: "application/json;charset=utf-8",
      async: true, //异步
      beforeSend: function(xhr) {
        xhr.setRequestHeader("x-function-id",menuid);
      },
			success: function (data) {
				if (!$.isNull(successFunc)) {
					successFunc(data);
				}
			},
			failed: function (data) {
				if (!$.isNull(failedFunc)) {
					failedFunc(data);
				}
			}
		});

	};

	/**
	 * 批复指标
	 * @param data 批复指标数据
	 * @param data 批复指标预算方案 add  guohx  解决停用预算方案不可批复问题
	 * @param successFunc  批复成功执行
	 * @param failedFunc  批复失败执行
	 */
	this.replyBgItems = function (data, bgPlanChrId, successFunc, failedFunc) {
		var saveItems = {};
		saveItems.agencyCode = this.agencyCode;
		saveItems.bgPlanChrId = bgPlanChrId;
		saveItems.setYear = ufma.getCommonData().svSetYear;
		saveItems.items = [];
		for (var i = 0; i < data.length; i++) {
			saveItems.items[saveItems.items.length] = data[i];
		}

		if (saveItems.items.length > 0) {
			var sUrl = _bgPub_requestUrlArray_subJs[25];

			ufma.post(sUrl, saveItems,
				function (result) {
					if (result.flag == "success") {
						if (!$.isNull(failedFunc)) {
							successFunc(result);
						}
					} else {
						if (!$.isNull(failedFunc)) {
							failedFunc("批复失败 : " + result.msg);
						}
					}
				});
		} else {
			if (!$.isNull(failedFunc)) {
				failedFunc("没有要批复的指标数据");
			}
		}
	}

	/**
	 * 销批指标
	 * @param data 批复指标数据
	 * @param data 批复指标预算方案 add  guohx  解决停用预算方案不可销批问题
	 * @param successFunc  批复成功执行
	 * @param failedFunc  批复失败执行
	 */
	this.cancelReplyBgItems = function (data, bgPlanChrId, successFunc, failedFunc) {
		var saveItems = {};
		saveItems.agencyCode = this.agencyCode;
		saveItems.bgPlanChrId = bgPlanChrId;
		saveItems.setYear = ufma.getCommonData().svSetYear;
		saveItems.items = [];
		for (var i = 0; i < data.length; i++) {
			saveItems.items[saveItems.items.length] = data[i];
		}

		if (saveItems.items.length > 0) {
			var sUrl = _bgPub_requestUrlArray_subJs[26];

			ufma.post(sUrl, saveItems,
				function (result) {
					if (result.flag == "success") {
						if (!$.isNull(failedFunc)) {
							successFunc(result);
						}
					} else {
						if (!$.isNull(failedFunc)) {
							failedFunc("销批失败 : " + result.msg);
						}
					}
				});
		} else {
			if (!$.isNull(failedFunc)) {
				failedFunc("没有要销批的指标数据");
			}
		}
	}

}