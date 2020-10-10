$(function() {
	/**************************
	 ******* 可执行指标编制 ****
	 **************************/
	var agencyCode = null;
	var setYear = null;
	var pnlFindRst = null;
	var curAgencyData = null;
	var curBgPlanData = null; //主界面的预算方案
	var curBgPlanEleMsg = null;
	var tblDt = null; //指标数据
	var tblId = "mainTable-exebgItem";
	var tblPrintBtnClass = "mainTable-exebgItem-printBtn";
	var tblPrintBtnClassExpXls = "mainTable-exebgItem-expXlsBtn";
	var tblObj = null;
	var addModal = null; //新增模态框的对象
	var modal_curBgPlan = null; //浮层的预算方案
	var modal_billDate = null;
	var modalTblId = "bgMultiModalTable-exebgItem"; //
	var modal_tableObj = null;
	var modalCellTree = null;
	var modalCurBgBill = null;
	var modal_clearTableAfterSave = false; //保存后清空表格
	var modal_billAttachment = []; //单据的附件
	//bug79887--zsj
	var attachNum = 0; //附件前输入框数字
	var pageAttachNum = 0; //后端返回的附件数字
	var fileLeng = 0; //实际上传文件数
	var billType = 1; //1=指标单据新增(可执行-社保) 2=分解单 3=调剂单 4=调整单 5=待分配(社保) 6=下拨单(社保) 7=分配单(社保)
	var bgReserve = 1; //1 可执行指标    2 预留指标
	var maxDetailCount_eachBill = 6; //每条单据最大的显示行数
	var modal_refreshWhenClose = false;
	var modal_open_readOnly = false;
	var acctCode = '*';
	var menuId = '3737B20AA98B455793CABECBE1B6A845';
	var bgPlanCacheId = '';
	var openType = 'new';
	var moreMsgSetting = {
		"agencyCode": agencyCode,
		showMoney: false,
		dateTimeAtFirst: true,
		computHeight: function(tblH_before, tblH_after) {
			var divAfter = $("#mainTableDiv-exebgItem").find(".dataTables_scrollBody").height() +
				(parseInt(tblH_before) - parseInt(tblH_after));
			$("#mainTableDiv-exebgItem").find(".dataTables_scrollBody").css("height", divAfter + "px");
		},
		changeBgPlan: function(data) {
			//实在找不到原因，ufma-combox-popup默认不显示
			setTimeout(function() {
				$('.ufma-combox-popup').css({
					'display': 'none'
				});
			}, 100);
			curBgPlanData = data;
			curBgPlanEleMsg = _BgPub_GetBgPlanEle(curBgPlanData);
			// doPaintTable([]); //重画表格，但是不加载数据
			pnlFindRst.doFindBtnClick();
		},
		afterFind: function(data) {
			// tblDt = data;
		},
		doFindBySelf: function(eleCdtn) {
			showTblData(false, eleCdtn);
		}
	};

	var getTabSetState = function() {
		var $selNav = $(".nav.nav-tabs").find("li.NAVSELECT");
		var statusNav = $selNav.find("a").attr("data-status");
		return statusNav; // O=未审核 A=已审核 其他=全部
	};

	/**
	 * 根据单据ID，从主表中删除单据
	 * @param  {[type]} billId [description]
	 * @return {[type]}        [description]
	 */
	var removeBillFromMainTable = function(billId) {
		var dtData = $("#" + tblId).DataTable().rows().data();
		for(var i = dtData.length - 1; i >= 0; i--) {
			var rowObj = dtData[i];
			if(rowObj.billId == billId) {
				$("#" + tblId).DataTable().row(i).remove();
			}
		}
		$("#" + tblId).DataTable().draw();
		ufma.isShow(reslist);
	};

	/**
	 * 用于处理_bgPub_requestUrlArray_socialSec[0]返回的请求的data参数
	 * @param  {[type]} urlData [description]
	 * @return {[type]}         [description]
	 */
	var organizeMainTblDataByURLResponse = function(urlData) {
		var rst = [];
		var totalMoney = 0;
		if($.isNull(urlData) || $.isNull(urlData.billWithItemsVo) || urlData.length == 0) {
			return rst;
		}
		for(var i = 0; i < urlData.billWithItemsVo.length; i++) {
			//****** 单据头部 **********
			var tmpBill = urlData.billWithItemsVo[i];
			var billTitle = new bgItemObj();
			billTitle.billId = tmpBill.billId;
			billTitle.billCode = tmpBill.billCode;
			billTitle.billDate = tmpBill.billDate;
			billTitle.agencyCode = tmpBill.agencyCode;
			billTitle.setYear = tmpBill.setYear;
			billTitle.billCur = tmpBill.billCur;
			billTitle.status = tmpBill.status;
			billTitle.createUser = tmpBill.createUser;
			billTitle.createUserName = tmpBill.createUserName;
			billTitle.createDate = tmpBill.createDate;
			billTitle.checkDate = tmpBill.checkDate;
			billTitle.checkUser = tmpBill.checkUser;
			billTitle.checkUserName = tmpBill.checkUserName;
			billTitle.isBill = 1;
			billTitle.isMore = 0;
			billTitle.bgItemCurShow = 0;
			billTitle.comeDocNum = "";
			billTitle.sendDocNum = "";
			rst[rst.length] = billTitle;

			totalMoney = totalMoney + tmpBill.billCur;

			//****** 单据明细 **************
			for(var j = 0; j < tmpBill.billWithItems.length; j++) {
				if(j == maxDetailCount_eachBill) {
					break;
				}
				var tmpBgItem = tmpBill.billWithItems[j];
				tmpBgItem.billId = tmpBill.billId;
				tmpBgItem.billCode = tmpBill.billCode;
				tmpBgItem.isBill = 0;
				tmpBgItem.isMore = 0;
				tmpBgItem.createUser = tmpBill.createUser;
				tmpBgItem.createDate = tmpBill.createDate.substr(0, 10);
				tmpBgItem.checkDate = tmpBill.checkDate;
				tmpBgItem.checkUser = tmpBill.checkUser;
				tmpBgItem.bgItemCurShow = $.formatMoney(tmpBgItem.bgItemCur, 2);
				rst[rst.length] = tmpBgItem;
			}

			//***** 单据结尾 **************
			var billBottom = new bgItemObj();
			billBottom.billId = tmpBill.billId;
			billBottom.billCode = tmpBill.billCode;
			billBottom.billDate = tmpBill.billDate;
			billBottom.agencyCode = tmpBill.agencyCode;
			billBottom.setYear = tmpBill.setYear;
			billBottom.billCur = tmpBill.billCur;
			billBottom.status = tmpBill.status;
			billBottom.checkDate = tmpBill.checkDate;
			billBottom.checkUser = tmpBill.checkUser;
			billBottom.isBill = 0;
			billBottom.isMore = 1;
			billBottom.bgItemCurShow = 0;
			billBottom.comeDocNum = "";
			billBottom.sendDocNum = "";
			rst[rst.length] = billBottom;
		}
		$("#span-billsCount-exebgItem").text(urlData.billWithItemsVo.length + "");
		$("#span-billsTotalMoney-exebgItem").text(jQuery.formatMoney(totalMoney + "", 2) + "");
		return rst;
	};

	/**
	 * 审核、销审的确切执行. (根据导航栏的状态确定审核或销审)
	 * @return {[type]} [description]
	 */
	var doAuditOrUnAudit = function() {
		var statusNav = getTabSetState();

		var rqObj_audit = new bgBillAuditOrUnAudit();
		rqObj_audit.agencyCode = agencyCode;
		rqObj_audit.setYear = setYear;
		rqObj_audit.billType = billType;
		rqObj_audit.latestOpUser = _bgPub_getUserMsg().userCode;
		rqObj_audit.latestOpUserName = _bgPub_getUserMsg().userName;
		var rows = $("#" + tblId).dataTable().fnGetNodes();
		var iCount = 0;
		var url = null;
		for(var k = 0; k < rows.length; k++) {
			var row = rows[k];
			if($(row).find("td:eq(0):has(label)").length > 0) {
				if($(row).find("td:eq(0):has(label)").find("input[type='checkbox']").is(":checked") == true) {
					iCount++;
					var rowDt = tblObj.row(row).data();
					rqObj_audit.items[rqObj_audit.items.length] = {
						"billId": rowDt.billId
					};
				}
			}
		}
		if(iCount == 0) {
			ufma.showTip("请选择要审核的单据", null, "warning");
			return false;
		}

		if(statusNav == "O") {
			//审核单据
			// getURL(0) + "/bg/budgetItem/multiPost/audit",    //12 指标审核
			rqObj_audit.status = "3";
			rqObj_audit.checkUser = _bgPub_getUserMsg().userCode;
			rqObj_audit.checkUserName = _bgPub_getUserMsg().userName;
			rqObj_audit.checkDate = _BgPub_getCurentDate();
			url = _bgPub_requestUrlArray_socialSec[12] + "?billType=" + billType + "&agencyCode=" + agencyCode;
			_bgPub_LoadAuditOrUnAuditModal("exeBudgetItem", 1, url, rqObj_audit, {
				"callbackSuccess": function(data) {
					ufma.showTip("审核成功", null, "success");
					setTimeout(function() {
						// for (var i = 0; i < rqObj_audit.items.length; i++) {
						//     removeBillFromMainTable(rqObj_audit.items[i].billId);
						// }
						pnlFindRst.doFindBtnClick();
					}, 1000);
				}
			});
		} else if(statusNav == "A") {
			//销审单据
			// getURL(0) + "/bg/budgetItem/multiPost/cancelAudit",  //13  指标销审
			rqObj_audit.status = "1";
			url = _bgPub_requestUrlArray_socialSec[13] + "?billType=" + billType + "&agencyCode=" + agencyCode;
			_bgPub_LoadAuditOrUnAuditModal("exeBudgetItem", 2, url, rqObj_audit, {
				"callbackSuccess": function(data) {
					ufma.showTip("销审成功", null, "success");
					setTimeout(function() {
						// for (var i = 0; i < rqObj_audit.items.length; i++) {
						//     removeBillFromMainTable(rqObj_audit.items[i].billId);
						// }
						pnlFindRst.doFindBtnClick();
					}, 1000);
				}
			});
		}
	};

	/**
	 * 给主界面的表格添加事件监听
	 * @return {[type]} [description]
	 */
	var addListenerToMainTable = function() {
		/**
		 * 事件一，增加 checkbox 勾选的事件响应情况
		 * @param  {[type]} e [description]
		 * @return {[type]}   [description]
		 */
		$("#input-seleAll-exebgItem").off("change").on("change", function(e) {
			var selAll = ($(this).is(":checked") == true);
			var rows = $("#" + tblId).dataTable().fnGetNodes();
			for(var k = 0; k < rows.length; k++) {
				var row = rows[k];
				if($(row).find("td:eq(0):has(label)").length > 0) {
					$(row).find("td:eq(0):has(label)").find("input[type='checkbox']").prop("checked", selAll);
					$(row).find("td:eq(0):has(label)").find("input[type='checkbox']").trigger("change");
				}
			}
		});

		/**
		 * 事件二，审核/未审核  按钮点击事件
		 * @param  {[type]} btn [description]
		 * @return {[type]}     [description]
		 */
		$("#btn-check-exebgItem").off("click").on("click", function(e) {
			doAuditOrUnAudit();
		});

		/**
		 * 事件三，删除(单据)  按钮点击事件
		 * @param  {[type]} e [description]
		 * @return {[type]}   [description]
		 * getURL(0) + "/bg/budgetItem/multiPost/delBudgetItems",  //5  指标删除/指标单据删除-多岗
		 */
		$("#btn-del-exebgItem").off("click").on("click", function(e) {
			if(getTabSetState() == "A") {
				ufma.showTip("已审核单据不能删除", null, "warning");
				return false;
			}
			var rows = $("#" + tblId).dataTable().fnGetNodes();
			var iDelCount = 0;
			var url = _bgPub_requestUrlArray_socialSec[5] + "?billType=" + billType + "&agencyCode=" + agencyCode;
			var requestObj = {
				"agencyCode": agencyCode,
				"setYear": setYear,
				items: []
			};
			for(var k = 0; k < rows.length; k++) {
				var row = rows[k];
				if($(row).find("td:eq(0):has(label)").length > 0) {
					if($(row).find("td:eq(0):has(label)").find("input[type='checkbox']").is(":checked") == true) {
						//此行进行删除
						var rowDt = tblObj.row(row).data();
						if(rowDt.status == "1") {
							requestObj.items[requestObj.items.length] = {
								"billId": rowDt.billId,
								"bgItemId": ""
							};
							iDelCount++;
						}
					}
				}
			}
			if(iDelCount == 0) {
				ufma.showTip("请选择要删除的单据", null, "warning");
			} else {
				ufma.confirm("确定要删除所选的单据吗?",
					function(action) {
						if(action) {
							ufma.post(
								url,
								requestObj,
								function(result) {
									if(result.flag == "success") {
										ufma.showTip("删除成功", null, "success");
										setTimeout(function() {
											pnlFindRst.doFindBtnClick();
										}, 1000);
									} else {
										ufma.showTip("删除失败！" + result.msg, null, "error");
									}
								}
							)
						}
					});
			}
		});
		/**
		 * 事件四，添加  每行 第一列 checkbox的勾选监听
		 * @param  {[type]} e [description]
		 * @return {[type]}   [description]
		 */
		$("#" + tblId + " input[name='mainRowCheck']").off("change").on("change", function(e) {
			var selected = ($(this).is(":checked") == true);
			var $curRow = $(this).closest("tr");
			var rowCount = $(this).closest("tbody").find("tr").length;

			if(selected) {
				$curRow.addClass("selected");
				$curRow = $curRow.next();
				while($curRow.find("td:eq(0):has(label)").length == 0) {
					$curRow.addClass("selected");
					if($curRow.index() == (rowCount - 1)) {
						break;
					} //到最后一个节点，退出，别死循环了
					$curRow = $curRow.next();
				}
			} else {
				$curRow.removeClass("selected");
				$curRow = $curRow.next();
				while($curRow.find("td:eq(0):has(label)").length == 0) {
					$curRow.removeClass("selected");
					if($curRow.index() == (rowCount - 1)) {
						break;
					} //到最后一个节点，退出，别死循环了
					$curRow = $curRow.next();
				}
			}
		});

		/**
		 * 事件五， 为表格的 单据头部行 增加点击事件，进入单据的编辑界面
		 * @param  {[type]} e [description]
		 * @return {[type]}   [description]
		 */
		$("a.billRow-a").off("click").on("click", function(e) {
			var billId = tblObj.row($(this).closest("tr")).data().billId;
			page.btnAdd = false;
			page.add = false;
			page.addNew = false;
			page.rowBillId = billId;
			var bill = null;
			for(var i = 0; i < tblDt.billWithItemsVo.length; i++) {
				if(tblDt.billWithItemsVo[i].billId == billId) {
					bill = $.extend({}, tblDt.billWithItemsVo[i]);
					break;
				}
			}
			//bug79887--zsj
			if(bill.attachNum == '') {
				bill.attachNum = 0;
			}
			$("#bgInput-fileCount-exebgItem").val(bill.attachNum + "");
			pageAttachNum = bill.attachNum;
			modal_billAttachment = page.modalBillAttachment;
			if(bill != null) {
				var itemsArr = bill.billWithItems.concat();
				bill.items = itemsArr;
				bill.isNew = "否";
				doLoadModalWithData(bill);
			}
			//modal_billAttachment = page.modalBillAttachment;
		});

		/**
		 * 事件六， 每行最后一列的  编辑  图标， 添加响应事件
		 * @param  {[type]} e [description]
		 * @return {[type]}   [description]
		 */
		$("#" + tblId + " tbody").find("span.mainEditSpan").off("click").on("click", function(e) {
			$(this).closest("tr").find("a.billRow-a").trigger("click");
		});
		/**
		 * 事件七， 每行最后一列的  日志  图标， 添加响应事件
		 * @param  {[type]} e [description]
		 * @return {[type]}   [description]
		 */
		$("#" + tblId + " tbody").find("span.mainLogSpan").off("click").on("click", function(e) {
			var rowDt = tblObj.row($(this).closest("tr")).data();
		});
		/**
		 * 事件八， 每行最后一列的  删除  图标， 添加响应事件
		 * @param  {[type]} e [description]
		 * @return {[type]}   [description]
		 */
		$("#" + tblId + " tbody").find("span.mainDelSpan").off("click").on("click", function(e) {

			var tmpBill = $("#" + tblId).DataTable().row($(this).closest("tr")).data();
			if(tmpBill.status == "3") {
				ufma.showTip("已审核单据不能删除", null, "warning");
				return false;
			}
			var url = _bgPub_requestUrlArray_socialSec[5] + "?billType=" + billType + "&agencyCode=" + agencyCode;
			var requestObj = {
				"agencyCode": agencyCode,
				"setYear": setYear,
				items: [{
					"billId": tmpBill.billId,
					"bgItemId": ""
				}]
			};
			ufma.confirm("确定要删除本条单据[" + tmpBill.billCode + "]吗?",
				function(action) {
					if(action) {
						ufma.post(
							url,
							requestObj,
							function(result) {
								if(result.flag == "success") {
									ufma.showTip("删除成功", null, "success");
									setTimeout(function() {
										pnlFindRst.doFindBtnClick();
									}, 1000);
								} else {
									ufma.showTip("删除失败！" + result.msg, null, "error");
								}
							}
						)
					}
				});
		});

	};

	/**
	 * 表格金额输入发生了变动后的处理, 修改对应的data
	 */
	var tbl_afterInputMoney_cellChange = function(value, doc) {
		var tbl = $("#" + modalTblId).DataTable();
		var val = value;
		if(val == null || val == '') {
			val = '0';
		}
		//tbl.cell(doc).data($.formatMoney(val, 2));
		tbl.cell(doc).data(val); //bug79524--zsj
		tbl.row(doc).data().shouldSave = "1";
		tbl.row(doc).data().bgItemCur = val;
	};

	/**
	 * 表格摘要输入发生了变动后的处理, 修改对应的data
	 */
	var tbl_afterInputSummary_cellChange = function(value, doc) {
		var tbl = $("#" + modalTblId).DataTable();
		var val = value;
		if(val == null || val == '') {
			val = '';
		}
		tbl.cell(doc).data(val);
		tbl.row(doc).data().shouldSave = "1";
	};

	var tbl_afterCbbSelect_cellChange = function(data) {
		if(modalCellTree == null) {
			return;
		}
		var $td = $("#" + modalCellTree.setting.id).closest("td");
		var tbl = $("#" + modalTblId).DataTable();
		//$td.empty();
		if(data.codeName != null && data.codeName != '') {
			tbl.cell($td).data(data.codeName);
			//tbl.row($td).data().shouldSave = "1";
		}
	};

	/**
	 * 根据传入的tabData加载表格数据
	 * @param  {[type]} tabData 绘制表格的data, url.data
	 * @return {[type]}         [description]
	 */
	var doPaintTable = function(tabData) {
		var bCreate = true;
		var tblCols = [
			/**
			 * 第一列，checkbox
			 */
			{
				data: "",
				title: "",
				class: "notPrint",
				width: "30px"
			},
			{
				data: "bgItemCode",
				title: "指标编码",
				class: "print",
				width: "100px"
			},
			{
				data: "bgItemSummary",
				title: "摘要",
				class: "print",
				width: "200px"
			}
		];
		if(currentplanData.isComeDocNum == "是") {
			tblCols.push({
				data: "comeDocNum",
				title: "来文文号",
				class: "print",
				width: "200px"
			});
		}
		if(currentplanData.isSendDocNum == "是") {
			tblCols.push({
				data: "sendDocNum",
				title: "发文文号",
				class: "print",
				width: "200px"
			});
		}
		//循环添加预算方案的要素信息
		for(var index = 0; index < curBgPlanEleMsg.eleCodeArr.length; index++) {
			tblCols.push({
				data: _BgPub_getEleDataFieldNameByCode(curBgPlanEleMsg.eleCodeArr[index], curBgPlanEleMsg.eleFieldName[index]),
				title: curBgPlanEleMsg.eleNameArr[index],
				class: "print",
				width: "200px"
			});
		}
		//添加最后的金额，日期，操作列
		tblCols.push({
			data: "bgItemCurShow",
			title: "金额",
			class: "bgPubMoneyCol print",
			width: "100px"
		});
		tblCols.push({
			data: "createDate",
			title: "录入日期",
			class: "print",
			width: "100px"
		});
		tblCols.push({
			data: "bgItemId",
			title: "操作",
			class: "notPrint",
			width: "100px"
		});

		var colDefs = [{
			"targets": [-1],
			"serchable": false,
			"orderable": false,
			"render": function(data, type, rowdata, meta) {
				return '<a class="btn btn-icon-only btn-sm" data-toggle="tooltip" action= "unactive" ' +
					'rowid="' + data + '" title="编辑">' +
					'<span class="glyphicon icon-edit mainEditSpan"></span></a>' +

					// '<a class="btn btn-icon-only btn-sm" data-toggle="tooltip" action= "unactive" ' +
					// 'rowid="' + data + '" title="日志">' +
					// '<span class="glyphicon icon-file mainLogSpan"></span></a>' +

					'<a class="btn btn-icon-only btn-sm" data-toggle="tooltip" action= "unactive" ' +
					'rowid="' + data + '" title="删除">' +
					'<span class="glyphicon icon-trash mainDelSpan"></span></a>';
			}
		}, {
			"targets": [0],
			"serchable": false,
			"orderable": false,
			"render": function(data, type, rowdata, meta) {
				return '<label class="mt-checkbox mt-checkbox-single mt-checkbox-outline"> ' +
					'<input type="checkbox" name="mainRowCheck" />&nbsp;' +
					'<span></span> ' +
					'</label>';
			}
		}];
		var mainTableData = organizeMainTblDataByURLResponse(tabData);

		var bNotAutoWidth = true; //默认是取消自动宽度；
		if(mainTableData.length == 0) {
			bNotAutoWidth = false;
		}

		/*var sScrollY = $(".workspace").outerHeight(true) - $(".workspace-top").outerHeight(true) -
			$("#bgMoreMsgPnl-exebgItem").outerHeight(true) - 12 - $(".nav").outerHeight(true) -
			$("#tableTotalShow-exebgItem").outerHeight(true) - 38 - 34 - 30;*/
		var tblSetting = {
			"data": mainTableData,
			"columns": tblCols,
			"columnDefs": colDefs,
			// "pagingType" : "simple_numbers",
			"paging": false,
			"ordering": false,
			"lengthChange": false,
			"processing": true, // 显示正在加载中
			"bSort": false, // 排序功能
			"autoWidth": bNotAutoWidth, //配合列宽，注意，TRUE的时候是关闭自动列宽，坑死了
			"scrollX": true,
			//"scrollY": sScrollY,
			"scrollY": 250,
			"select": true,
			"bDestroy": true,
			// "dom" : 'rt<"bg-mainTableFooterDiv" <"#bg-mainTableFooterDiv-leftPnl.leftDiv"><"rightDiv" i>>', //<"rightDiv" p>
			"dom": 'Brt', //<"rightDiv" p>
			"buttons": [{
				"extend": "print",
				"className": tblPrintBtnClass + " bgHide",
				"text": "打印",
				"autoPrint": true
			}, {
				'extend': 'excel',
				"className": tblPrintBtnClassExpXls + " bgHide",
				'text': '导出', //定义导出excel按钮的文字
				'exportOptions': {
					'modifier': {
						'page': 'current'
					},
					'rows': function(idx, data, node) {
						if(data.isBill === 1 || data.isMore === 1) {
							return false;
						} else {
							return true;
						}
					},
					'columns': ".print"
				}
			}],
			"initComplete": function() { //修改 guohx   增加按钮上弹出中文提示功能  20170925
				bCreate = false;
				$("#exeBudgetItem-print").attr({
					"data-toggle": "tooltip",
					"title": "打印"
				});
				$("#exeBudgetItem-exp").attr({
					"data-toggle": "tooltip",
					"title": "导出"
				});
				$('button[data-toggle="tooltip"]').tooltip();
				ufma.isShow(reslist);
			},
			fnCreatedRow: function(nRow, aData, iDataIndex) {
				bCreate = true;
				////////
				$.data($(nRow)[0], 'rowdata', aData);
				$(nRow).attr('billid', aData.billId);
				if(aData.isBill == 1 || aData.isMore == 1) {
					var tdNum = $('td', nRow).length;
					for(var i = tdNum - 2; i > 1; i--) {
						$('td:eq(' + i + ')', nRow).remove();
					}
					$('td:eq(1)', nRow).attr('colspan', tdNum - 2);
				}

				if(aData.isBill == 1) {
					$(nRow).attr('datatype', 1);
					var checkDate = ufma.parseNull(aData.checkDate).substr(0, 10);
					var midRowColSpanHtml = "<a class='billRow-a common-jump-link' href='javascript:;'>单据编号:&nbsp;" + aData.billCode + "&nbsp;&nbsp;&nbsp;&nbsp;" +
						"单据日期:&nbsp;" + ufma.parseNull(aData.billDate) + "&nbsp;&nbsp;&nbsp;&nbsp;" +
						"单据金额:&nbsp;" + jQuery.formatMoney(aData.billCur + "", 2) + "&nbsp;&nbsp;&nbsp;&nbsp;" +
						"制单人:&nbsp;" + ufma.parseNull(aData.createUserName) + "&nbsp;&nbsp;&nbsp;&nbsp;"; //点击进入查看单据界面
					if(aData.status == "3") {
						midRowColSpanHtml += "审核人:&nbsp;" + ufma.parseNull(aData.checkUserName) + "&nbsp;&nbsp;&nbsp;&nbsp;" +
							"审核日期:&nbsp;" + checkDate + "&nbsp;&nbsp;&nbsp;&nbsp;"; //点击进入查看单据界面
					}

					$('td:eq(1)', nRow).html(midRowColSpanHtml);
				} else if(aData.isMore == 1) {
					$(nRow).attr('datatype', 3);
					var midRowColSpanHtml1 = "<a class='bgPub-billRow-a bgPub-billRow-a-more billRow-a common-jump-link' href='javascript:;'>更多></a>"; //点击进入查看单据界面
					$('td:eq(1)', nRow).html(midRowColSpanHtml1);
				} else {
					$(nRow).attr('datatype', 2);
				}

				///////////
				var tdNum = $('td', nRow).length;
				if(aData.isBill == 1) {

					$mgColFirst = $('td:eq(0)', nRow);
					$mgColLast = $('td:eq(' + (tdNum - 1) + ')', nRow);
					tmpBillId = aData.billId;
					rowSpan = 1;
				} else {
					rowSpan = rowSpan + 1;
					$('td:eq(' + (tdNum - 1) + ')', nRow).remove();
					$('td:eq(0)', nRow).remove();
				}
				if($mgColFirst)
					$mgColFirst.attr('rowspan', rowSpan);
				if($mgColLast)
					$mgColLast.attr('rowspan', rowSpan);

			},
			// "drawCallback": function (settings, json) { //合并单元格
			//     var tmpTbl = $("#" + tblId).dataTable();
			//     var rows = tmpTbl.fnGetNodes(); ////fnGetNodes获取表格所有行，rows[i]表示第i行tr对象
			//     var colspanCount = 2 + curBgPlanEleMsg.eleCodeArr.length + 2 ; //指标编码+摘要+要素列+金额+录入日期
			//     var rowspan_firstNode = null;
			//     var rowspan_lastNode = null;
			//     var rowspanCount = 1;

			//     //1， 单据头部的横向合并
			//     for (var i = 0; i < rows.length; i++) {
			//         var row = rows[i];
			//         var rowData = tmpTbl.api().row(row).data();
			//         if (rowData.isBill == 1) { //说明这行是单子头部信息，要进行合并
			//             var billTitle_checkMsg = '';
			//             if (rowData.status == "3") { //审核标签下显示审核人和审核日期
			//                 billTitle_checkMsg =
			//                     "审核日期:&nbsp;" + rowData.checkDate + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" +
			//                     "审核人&nbsp;:" + rowData.checkUserName + "&nbsp;&nbsp;&nbsp;&nbsp;";
			//             }
			//             var startRowNodeHtml = $(row).find("td:eq(0)").html();
			//             var lastRowNodeHtml = $(row).find("td:eq(" + (colspanCount + 1) + ")").html();
			//             var midRowColSpanHtml = "<a class='billRow-a' href='javascript:;'>单据编号:&nbsp;" + rowData.billCode + "&nbsp;&nbsp;&nbsp;&nbsp;" +
			//                 "单据日期:&nbsp;" + rowData.billDate + "&nbsp;&nbsp;&nbsp;&nbsp;" +
			//                 "单据金额:&nbsp;" + jQuery.formatMoney(rowData.billCur + "", 2) + "&nbsp;&nbsp;&nbsp;&nbsp;" +
			//                 "制单人&nbsp;:" + rowData.createUserName + "&nbsp;&nbsp;&nbsp;&nbsp;" +
			//                 billTitle_checkMsg + "</a>";//点击进入查看单据界面
			//             $(row).empty();
			//             $(row).append("<td>" + startRowNodeHtml + "</td>" +
			//                 "<td colspan='" + colspanCount + "'>" + midRowColSpanHtml + "</td>" +
			//                 "<td>" + lastRowNodeHtml + "</td>");
			//         } else if (rowData.isMore == 1) { //说明这行是单位的尾部信息，要添加更多的点击按钮
			//             var startRowNodeHtml1 = $(row).find("td:eq(0)").html();
			//             var lastRowNodeHtml1 = $(row).find("td:eq(" + (colspanCount + 1) + ")").html();
			//             var midRowColSpanHtml1 = "<a class='billRow-a billRow-a-more' href='javascript:;'>更多></a>";//点击进入查看单据界面
			//             $(row).empty();
			//             $(row).append("<td>" + startRowNodeHtml1 + "</td>" +
			//                 "<td colspan='" + colspanCount + "'>" + midRowColSpanHtml1 + "</td>" +
			//                 "<td>" + lastRowNodeHtml1 + "</td>");
			//         }
			//     }
			//     //2，列的纵向合并
			//     for (var j = 0; j < rows.length; j++) {
			//         var row = rows[j];
			//         var rowData2 = tmpTbl.api().row(row).data();
			//         if (rowData2.isBill == 1) { //说明这行是单子头部信息，要进行合并
			//             rowspan_firstNode = $(row).find("td:eq(0)");
			//             rowspan_lastNode = $(row).find("td:eq(2)");
			//             rowspanCount = 1;
			//         } else {
			//             if (rowData2.isMore == 0) {
			//                 rowspanCount++;
			//                 rowspan_lastNode.attr("rowspan", rowspanCount);
			//                 $(row).find("td:eq(" + (colspanCount + 1) + ")").remove();
			//                 rowspan_firstNode.attr("rowspan", rowspanCount);
			//                 $(row).find("td:eq(0)").remove();
			//             } else {
			//                 rowspanCount++;
			//                 rowspan_lastNode.attr("rowspan", rowspanCount);
			//                 $(row).find("td:eq(2)").remove();
			//                 rowspan_firstNode.attr("rowspan", rowspanCount);
			//                 $(row).find("td:eq(0)").remove();
			//             }
			//         }
			//     }
			// }
			"drawCallback": function(settings, json) { //合并单元格
				if(!bCreate) {
					var $tbl = $("#" + tblId);

					$("#" + tblId + ' tbody tr').each(function() {
						var billId = $(this).attr('billid');
						if(billId) {
							var datatype = $(this).attr('datatype');
							if(datatype == 2) {
								var $firstTd = $($(this).find('td').eq(0));
								var $lastTd = $($(this).find('td:last-child'));
								var rowData = $.data($(this)[0], 'rowdata');
								if($tbl.find('tr[billid="' + billId + '"]').length == 1) {
									if($firstTd.find('.mt-checkbox').length == 0) {
										$('<td>').html(formatCheckboxCol(rowData)).prependTo($(this));
									};
									if($lastTd.find('.btn').length == 0) {
										$('<td>').html(formatOperate(rowData)).appendTo($(this));
									}
								} else {
									if($firstTd.find('.mt-checkbox').length > 0) {
										$firstTd.remove();
									}
									if($lastTd.find('.btn').length > 0) {
										$lastTd.remove();
									}
								}
							}
						}

					});
				}
				var fixtop = $('#fixDiv-exebgItem').position().top;
				var pageHeight = $('.workspace-center').height();
				var planHeight = $('#bgMoreMsgPnl-exebgItem').height();
				if(planHeight > 62) {
					planHeight = planHeight - 62;
					var scorll = 460 + planHeight; //- 330 
					$('#fixDiv-exebgItem').css("top", scorll + "px");
				} else {
					$('#fixDiv-exebgItem').css("top", "460px");
				}
			},
		};

		if(tblObj != null) {
			tblObj.destroy();
			$("#" + tblId).empty();
		}
		tblObj = $("#" + tblId).DataTable(tblSetting);
		if(!$("#" + tblId).hasClass("ufma-table")) {
			$("#" + tblId).addClass("ufma-table");
		}
		if(!$("#" + tblId).hasClass("dataTable")) {
			$("#" + tblId).addClass("dataTable");
		}
		var $clostDiv = $("#" + tblId).closest("div");
		$($clostDiv).css("border-bottom", "0px black solid");
		addListenerToMainTable();
		ufma.hideloading();
		ufma.isShow(reslist);
	};

	/**
	 * 显示多岗主页面的主表(获取数据，调用doPaintTable函数绘制表格。)
	 * @param  {[type]} bNotRepaintTbl [false=url获得数据并且刷新表格   true=url获得数据，但不刷新表格]
	 * @param  {[eleInBgItemObj]} pEleCdtn [=null 时，会自行组装一个对象；否则使用此参数的对象]
	 * @return {[type]}                [description]
	 */
	var showTblData = function(bNotRepaintTbl, pEleCdtn) {
		var surl = _bgPub_requestUrlArray_socialSec[19] + "?agencyCode=" + agencyCode + "&setYear=" + setYear + "&bgReserve=" + bgReserve + "&billType=" + billType;
		var eleCdtn = null;
		if(pEleCdtn == null) {
			eleCdtn = new eleInBgItemObj();
			eleCdtn.agencyCode = agencyCode;
			eleCdtn.setYear = setYear;
			eleCdtn.chrId = curBgPlanData.chrId;
			eleCdtn.billType = billType;
			//bug82141--财政社保问题--zsj
			eleCdtn.businessDateBegin = $('#_bgPub_dtpBegin_bgMoreMsgPnl-exebgItem').getObj().getValue();
			eleCdtn.businessDateEnd = $('#_bgPub_dtpEnd_bgMoreMsgPnl-exebgItem').getObj().getValue();
			//请求添加主要素
			if(curBgPlanEleMsg.priEle == "") {
				eleCdtn.priEle = "";
			} else {
				eleCdtn.priEle = curBgPlanEleMsg.priEle;
			}
		} else {
			eleCdtn = pEleCdtn;
		}
		var statusNav = getTabSetState();
		if(statusNav == "O") {
			//未审核
			eleCdtn.status = "1";
		} else if(statusNav == "A") {
			//已审核
			eleCdtn.status = "3";
		} else {
			//全部
			eleCdtn.status = "";
		}
		//**********************************************
		ufma.showloading("正在加载(可执行)指标单据, 请稍后...");
		ufma.post(surl,
			eleCdtn,
			function(result) {
				if(result.flag == "success") {
					tblDt = $.extend({}, result.data);
					//bug79887--zsj
					if(page.add) {
						$("#bgInput-fileCount-exebgItem").val("0");
						modal_billAttachment = [];
					} else {
						if(tblDt.billWithItemsVo.length > 0) {
							for(var i = 0; i < tblDt.billWithItemsVo.length; i++) {
								if(page.rowBillId == tblDt.billWithItemsVo[i].billId) {
									$("#bgInput-fileCount-exebgItem").val(tblDt.billWithItemsVo[i].attachNum + "");
									pageAttachNum = tblDt.billWithItemsVo[i].attachNum;
									page.modalBillAttachment = tblDt.billWithItemsVo[i].modal_billAttachment;
								}
							}

						}
					}

					if(bNotRepaintTbl) {
						ufma.hideloading();
						return;
					}
					doPaintTable(tblDt);
					// doComputTotalMoney();
				} else {
					ufma.hideloading();
					ufma.showTip(result.msg, null, "error");
				}
			}
		);

		ufma.isShow(reslist);
	};

	/*	var modalTbl_clearCbbCell = function() {
			if(modalCellTree == null || modalCellTree.setting == null) {
				return;
			}
			var $td = $("#" + modalCellTree.setting.id);
			$td.removeClass();
			$td.removeAttr("id");
			$td.removeAttr("style");
			$td.removeAttr("aria-new");
			$td.empty();
			modalCellTree = null;
		};*/
	var modalTbl_clearCbbCell = function() {
		if($.isNull(modalCellTree)) {
			return;
		}
		var $tdTree = $("#" + modalCellTree.setting.id),
			$td = $tdTree.closest("td");
		$tdTree.removeClass();
		$tdTree.removeAttr("id");
		$tdTree.removeAttr("style");
		$tdTree.removeAttr("aria-new");
		$tdTree.empty();
		modalCellTree = null;
		if($td.text() == null || $td.text() == "") {
			if(!$.isNull($td.attr("lastVal"))) {
				$td.empty();
				modal_tableObj.cell($td).data($td.attr("lastVal"));
			}
		}
	};
	/**
	 * 给 浮层 的 表格 挂接各种事件。在重画表格后调用
	 * @return {[type]} [description]
	 */
	var bindListenerToModalTable = function() {
		if(modal_tableObj == null) {
			return;
		} //
		/**
		 * 1, 事件一，单击单元格可以进入编辑状态
		 * @param  {[type]} [modal_tableObj== null]         [description]
		 * @return {[type]}                   [description]
		 */
		modal_tableObj.off("click", "tbody td").on("click", "tbody td", function(e) {
			//$(document).off("click", "#" + modalTblId + ' td:not(.UnEdit)').on("click", "#" + modalTblId + ' td:not(.UnEdit)', function() {
			if(modal_open_readOnly) {
				return;
			}
			var tbl = $("#" + modalTblId).DataTable();
			var col = tbl.column(this);
			var sId = col.dataSrc();
			if(typeof(sId) == "undefined") {
				modalTbl_clearCbbCell();
				return;
			}
			modalTbl_clearCbbCell();
			if(sId == "bgItemCur") { //指标金额
				_BgPub_Bind_InputMoney(this, sId + "_money-exebgItem", tbl_afterInputMoney_cellChange, tbl.cell(this).data());
				$("#" + sId + "_money-exebgItem").blur(function(e) {
					var tmpE = jQuery.Event("keyup");
					tmpE.keyCode = 13;
					$("#" + sId + "_money-exebgItem").trigger(tmpE);
				});
				$("#" + sId + "_money-exebgItem").focus();
				$("#" + sId + "_money-exebgItem").select();
			} else if(sId == "comeDocNum") { //来文文号
				var rst = _BgPub_Bind_InputText(this, sId + "_ComeDocNum", tbl_afterInputSummary_cellChange, tbl.cell(this).data());
				$("#" + sId + "_ComeDocNum").blur(function(e) {
					var tmpE = jQuery.Event("keyup");
					tmpE.keyCode = 13;
					$("#" + sId + "_ComeDocNum").trigger(tmpE);
				});
				if(rst) {
					$("#" + sId + "_ComeDocNum").focus();
					$("#" + sId + "_ComeDocNum").select();
				}
			} else if(sId == "sendDocNum") { //发文文号
				var rst = _BgPub_Bind_InputText(this, sId + "_SendDocNum", tbl_afterInputSummary_cellChange, tbl.cell(this).data());
				$("#" + sId + "_SendDocNum").blur(function(e) {
					var tmpE = jQuery.Event("keyup");
					tmpE.keyCode = 13;
					$("#" + sId + "_SendDocNum").trigger(tmpE);
				});
				if(rst) {
					$("#" + sId + "_SendDocNum").focus();
					$("#" + sId + "_SendDocNum").select();
				}
			} else if(sId == "bgItemSummary") { //指标摘要
				_BgPub_Bind_InputText(this, sId + "_summary-exebgItem", tbl_afterInputSummary_cellChange, tbl.cell(this).data());
				$("#" + sId + "_summary-exebgItem").blur(function(e) {
					var tmpE = jQuery.Event("keyup");
					tmpE.keyCode = 13;
					$("#" + sId + "_summary-exebgItem").trigger(tmpE);
				});
				$("#" + sId + "_summary-exebgItem").focus();
				$("#" + sId + "_summary-exebgItem").select();
			} else {
				for(var iIndex = 0; iIndex < modal_curBgPlan.planVo_Items.length; iIndex++) {
					var itemObj = modal_curBgPlan.planVo_Items[iIndex];
					var sTblTitleField = _BgPub_getEleDataFieldNameByCode(itemObj.eleCode, itemObj.eleFieldName);
					if(sTblTitleField == sId) {
						//先清空cell里面的值
						var tmpDivId = "multiModalCellTree-exebgItem";
						var tmpFullName = tbl.cell(this).data();
						tmpDiv = "<div id='" + tmpDivId + "' style='height:28px'></div>",
							tmpFullName = tbl.cell(this).data();
						tbl.cell(this).data('');
						$(this).html(tmpDiv);
						$(this).attr("lastVal", tmpFullName);
						var billStatus = '1'; //新增
						if(!$.isNull(tmpFullName)) {
							billStatus = '0'; //编辑
						}
						modalCellTree = _BgPub_Bind_EleComboBox_Single("#" + tmpDivId, itemObj.eleCode, itemObj.eleName, itemObj.eleLevel,
							tbl_afterCbbSelect_cellChange, agencyCode, null, null, billStatus);
						$("#" + modalCellTree.setting.id).css("width", "200px");
						$("#" + modalCellTree.setting.id + " input[type='text']").removeAttr("readonly");
						if(!$.isNull(tmpFullName)) { //再点击时不清空已选要素  guohx
							var code = tmpFullName.substring(0, tmpFullName.indexOf(" "));
							$("#" + modalCellTree.setting.id).ufmaTreecombox().setValue(code, tmpFullName);
						}
						break;
					}
				}
			}
		});
		//添加 修改要素的下拉不能输入 组织冒泡到TD 
		$(document).on('click', '#multiModalCellTree-exebgItem', function(e) {
			stopPropagation(e)
		})
		/**
		 * 事件二， 单行最后的操作图标可以删除指标
		 * @return {[type]} [description]
		 */
		modal_tableObj.off("click", "tbody .delSpan").on("click", "tbody .delSpan", function(e) {
			if(modal_open_readOnly) {
				return;
			}
			var rowDt = $("#" + modalTblId).DataTable().row($(e.target).closest("tr")).data();
			if(typeof(rowDt) == "undefined" || rowDt.length == 0) {
				return;
			}
			ufma.confirm("要删除本行指标吗?", function(action) {
				if(action) {
					if(rowDt.isNew === "是") {
						$("#" + modalTblId).DataTable().row($(e.target).closest("tr")).remove().draw();
					} else {
						var url = _bgPub_requestUrlArray_socialSec[5] + "?billType=" + billType + "&agencyCode=" + agencyCode;
						var requestObj = {
							"agencyCode": agencyCode,
							items: [{
								"billId": "",
								"bgItemId": rowDt.bgItemId
							}]
						};
						ufma.post(
							url,
							requestObj,
							function(result) {
								if(result.flag == "success") {
									ufma.showTip("删除成功", null, "success");
									modal_refreshWhenClose = true;
									$("#" + modalTblId).DataTable().row($(e.target).closest("tr")).remove().draw();
								} else {
									ufma.showTip("删除失败！" + result.msg, null, "error");
								}
							}
						);
					}
				}
			});
		});
	};

	/**
	 * 获得 浮层 表格的数据。
	 * @return {[type]} 新增：返回[]  查看：返回具体的数据
	 */
	var getModalTableData = function() {
		return modalCurBgBill.items;
	};

	/**
	 * 根据预算方案重画浮层表格。
	 * @param  {[type]} planData [description]
	 * @return {[type]}          [description]
	 */
	var repaintModalTableByBgPlan = function(planData) {
		var bgPlanEle = _BgPub_GetBgPlanEle(planData);
		if(bgPlanEle == null) {
			return;
		}
		var nullData = getModalTableData() || [];
		//指标编码、摘要、要素..、金额、操作（删除）
		var tblCols = [{
				data: "bgItemCode",
				title: "指标编码",
				class: "UnEdit",
				width: "150px"
			},
			{
				data: "bgItemSummary",
				title: "摘要",
				width: "200px"
			}
		];
		if(currentplanData.isComeDocNum == "是") {
			tblCols.push({
				data: "comeDocNum",
				title: "来文文号",
				width: "200px"
			});
		}
		if(currentplanData.isSendDocNum == "是") {
			tblCols.push({
				data: "sendDocNum",
				title: "发文文号",
				width: "200px"
			});
		}
		for(var i = 0; i < bgPlanEle.eleCodeArr.length; i++) {
			var tmpCol = {
				data: _BgPub_getEleDataFieldNameByCode(bgPlanEle.eleCodeArr[i], bgPlanEle.eleFieldName[i]),
				title: bgPlanEle.eleNameArr[i],
				width: "200px"
			};
			tblCols.push(tmpCol);
		}
		//改为bgItemCurShow->  bgItemCur 解决主界面分录超过6条 弹窗显示不出金额
		tblCols.push({
			data: "bgItemCur",
			title: "金额",
			class: "bgPubMoneyCol",
			width: "150px",
			render: $.fn.dataTable.render.number(',', '.', 2, '')
		});
		tblCols.push({
			data: "",
			title: "操作",
			class: "UnEdit",
			width: "80px"
		});
		var colDefObjs = [{
			"targets": [-1],
			"serchable": false,
			"orderable": false,
			"render": function(data, type, rowdata, meta) {
				return '<a class="btn btn-icon-only btn-sm" data-toggle="tooltip" action= "unactive" ' +
					'rowid="' + data + '" title="删除">' +
					'<span class="glyphicon icon-trash delSpan"></span></a>';
			}
		}];
		var sScrollY = ($("#bg-multiModal-content-exebgItem").outerHeight(true) - $("#bg-multiModal-content-top-exebgItem").outerHeight(true) - 8 - 2 - 40) + "px";
		var option = {
			"data": nullData,
			"columns": tblCols,
			"columnDefs": colDefObjs,
			"ordering": false,
			"lengthChange": false,
			"paging": false,
			"bFilter": false, // 去掉搜索框
			"processing": true, // 显示正在加载中
			"bInfo": false, // 页脚信息
			"bSort": false, // 排序功能
			"autoWidth": true, //配合列宽，注意，TRUE的时候是关闭自动列宽，坑死了
			"scrollX": true,
			"scrollY": sScrollY,
			"select": true,
			"bDestroy": true,
			"dom": 'rt'
		};

		if(modal_tableObj != null) {
			modal_tableObj.destroy();
			$("#" + modalTblId).empty();
		}
		modal_tableObj = $("#" + modalTblId).DataTable(option);
		_BgPub_ReSetDataTable_AfterPaint(modalTblId);
		if(!$("#" + modalTblId).hasClass("ufma-table")) {
			$("#" + modalTblId).addClass("ufma-table");
		}
		if(!$("#" + modalTblId).hasClass("dataTable")) {
			$("#" + modalTblId).addClass("dataTable");
		}
		var $clostDiv = $("#" + modalTblId).closest("div");
		$($clostDiv).css("border-bottom", "0px black solid");
		bindListenerToModalTable();
		ufma.isShow(reslist);
	};

	/**
	 * 当模态框关闭时调用此函数
	 * @return {[type]} [description]
	 */
	var doWhenModalClose = function() {
		if(modal_refreshWhenClose) {
			pnlFindRst.doFindBtnClick();
		}
	};

	/**
	 * 根据传入的bill数据  加载 浮层
	 * @return {[type]} [description]
	 */
	var doLoadModalWithData = function(billData) {
		//1, 初始化各种数据
		addModal = null; //新增模态框的对象
		modal_curBgPlan = null; //浮层的预算方案
		modal_billDate = null;
		modalCellTree = null;
		modal_billAttachment = [];
		modal_refreshWhenClose = false;
		modalCurBgBill = billData;
		if(billData.attachNum == '') {
			$("#bgInput-fileCount-exebgItem").val("0");
		}
		//$("#bgInput-fileCount-exebgItem").val("0");
		modalCurBgBill.billType = billType;
		if(modal_tableObj != null) {
			modal_tableObj.destroy();
			$("#" + modalTblId).empty();
			modal_tableObj = null;
		}
		modal_open_readOnly = false;
		//审核页签的编辑状态打开单据，就是只读的界面。
		if(billData.isNew == "否" && billData.items.length > 0) {
			modal_open_readOnly = (getTabSetState() == 'A');
		}
		//2, 绑定浮层的预算方案
		var cbBgPlanIdMain = '';
		var tmpBgPlanTree = _BgPub_Bind_ComboBox_BgPlanList("bg-multiModal-bgPlan-exebgItem", agencyCode, menuId, acctCode, bgPlanCacheId, openType, cbBgPlanIdMain,
			function(data) {
				if(modal_curBgPlan != null && modal_curBgPlan.chrId == data.chrId) {
					return;
				}
				modal_curBgPlan = data;
				//根据预算方案的变化加载表格
				repaintModalTableByBgPlan(modal_curBgPlan);
			}, null, $('#_bgPub_cbb_BgPlan_bgMoreMsgPnl-exebgItem').getObj().getValue());
		//3，绑定浮层的顶部时间
		//modal_billDate = _BgPub_dateTimePicker("bg-multiModal-dtp-exebgItem");
		modal_billDate = $('.uf-datepicker').ufDatepicker({
			format: 'yyyy-mm-dd',
			initialDate: new Date(page.pfData.svTransDate) //bug79086--zsj
		});
		//4, 加载浮层顶部的单据号
		$("#multiModal-billCode-exebgItem").val(billData.billCode);
		$("#multiModal-billCode-exebgItem").attr("data", billData);
		$("#multiModal-billCode-exebgItem").attr("billId", billData.billId);
		//显示模态框
		addModal = ufma.showModal("exeBudgetItem-add-exebgItem", 1090, 628, function() {
			//模态框的关闭事件。
			doWhenModalClose();
		});
		//5, 重新计算content的高度。自动计算的不对
		var contentHeight = parseFloat($(".u-msg-dialog").css("height"));
		contentHeight = contentHeight - addModal.modal.find('.u-msg-title').outerHeight(true);
		addModal.modal.find('.u-msg-footer').each(function(ele) {
			contentHeight = contentHeight - $(this).outerHeight(true);
		});
		addModal.msgContent.css('height', contentHeight + 'px');
		//6, 显示加载的遮罩层，如果不是新增方案，需要显示已有的指标到表格中
		//if(!$.isNull(tmpBgPlanTree)) {
		//if(!$.isNull(tmpBgPlanTree.setting.tree) && tmpBgPlanTree.setting.tree.getNodes().length > 0) {
		if(billData.isNew == "否" && billData.items.length > 0) {
			modalCurBgBill.latestOpUserName = _bgPub_getUserMsg().userName;
			modalCurBgBill.latestOpUser = _bgPub_getUserMsg().userCode;
			modalCurBgBill.latestOpDate = page.pfData.svTransDate;
			// 1,根据带的数据查找对应的预算方案
			//var tmpBgPlanId = billData.items[0].bgPlanId;
			// modal_billDate.setValue(billData.items[0].createDate);
			/*for(var i = 0; i < tmpBgPlanTree.setting.tree.getNodes().length; i++) {
				var tmpNode = tmpBgPlanTree.setting.tree.getNodes()[i];
				if(tmpNode.chrId == tmpBgPlanId) {
					tmpBgPlanTree.select(i + 1);
					break;
				}
			}*/
			// 2,加载单据的附件信息  getURL(0) + "/bg/attach/getAttach"   //17，附件查找
			var tmpRst = _bgPub_GetAttachment({
				"billId": billData.billId,
				"agencyCode": agencyCode
			});
			if(!$.isNull(tmpRst.data.bgAttach)) {
				for(var m = 0; m < tmpRst.data.bgAttach.length; m++) {
					modal_billAttachment[modal_billAttachment.length] = {
						"filename": tmpRst.data.bgAttach[m].fileName,
						"filesize": 0,
						"fileid": tmpRst.data.bgAttach[m].attachId
					};
				}
				//$("#bgInput-fileCount-exebgItem").val(modal_billAttachment.length + "");
			}
			$("#bgInput-fileCount-exebgItem").val(pageAttachNum + ""); //bug79887--zsj
			// 3,取消遮罩层--已审核单据不允许修改
			if(modalCurBgBill.status == "3") {
				$("#btn-modal-imp-exebgItem").hide();
				$("#btn-modal-saveAndNew-exebgItem").hide();
				$("#btn-modal-save-exebgItem").hide();
				$("#btn-newRow-exebgItem").hide();
				$("#exeBudgetItem-add-exebgItem .u-msg-title h4").text("指标查看-[已审核]");
				//已审核的单子不允许修改附件数或者上传附件
				$('#bgInput-fileCount-exebgItem').attr('disabled', true);
				$('#btn-multiModal-aboutFiles-exebgItem').attr('disabled', true);
				$("#bg-multiModal-dtp-exebgItem input").attr("disabled", "disabled");
				$("#bg-multiModal-dtp-exebgItem span").hide();
				$("#bg-multiModal-dtp-exebgItem input").val(billData.billDate);
			} else {
				$("#btn-modal-imp-exebgItem").show();
				$("#btn-modal-saveAndNew-exebgItem").show();
				$("#btn-modal-save-exebgItem").show();
				$("#btn-newRow-exebgItem").show();
				$("#exeBudgetItem-add-exebgItem .u-msg-title h4").text("指标查看-[未审核]");
				//未审核的单子允许修改附件数或者上传附件
				$('#bgInput-fileCount-exebgItem').attr('disabled', false);
				$('#btn-multiModal-aboutFiles-exebgItem').attr('disabled', false);
				$("#bg-multiModal-dtp-exebgItem input").attr("disabled", false);
				$("#bg-multiModal-dtp-exebgItem span").show();
				$("#bg-multiModal-dtp-exebgItem").getObj().setValue(billData.billDate);
			}
			//修改  编辑界面不可修改单据日期 、预算方案
			/*$("#bg-multiModal-dtp-exebgItem input").attr("disabled", "disabled");
			  $("#bg-multiModal-dtp-exebgItem span").hide();*/
			//$("#bg-multiModal-dtp-exebgItem").getObj().setValue(billData.billDate);
			$("#bg-multiModal-bgPlan-exebgItem").getObj().setEnabled(false);
			$("#bg-multiModal-bgPlan-exebgItem input").attr('disabled', true);
			ufma.hideloading();
		} else {
			// 不带数据打开编辑界面，但是没有单据数据，可能有主界面的预算方案数据  -- 新增
			//$("#bg-multiModal-dtp-exebgItem").find("input").removeAttr("readOnly");
			$("#btn-modal-imp-exebgItem").show();
			$("#btn-modal-saveAndNew-exebgItem").show();
			$("#btn-modal-save-exebgItem").show();
			$("#btn-newRow-exebgItem").show();
			$("#exeBudgetItem-add-exebgItem .u-msg-title h4").text("新增指标编制");
			$('.uf-datepicker').ufDatepicker({
				format: 'yyyy-mm-dd',
				initialDate: new Date(page.pfData.svTransDate) //bug79086--zsj
			});
			$("#bg-multiModal-dtp-exebgItem input").attr("disabled", false);
			$("#bg-multiModal-dtp-exebgItem span").show();
			$("#bg-multiModal-dtp-exebgItem").getObj().setValue(page.pfData.svTransDate);
			$("#bg-multiModal-bgPlan-exebgItem").getObj().setEnabled(true);
			$("#bg-multiModal-bgPlan-exebgItem input").attr('disabled', false);
			modalCurBgBill.items = [];
			modalCurBgBill.createUserName = _bgPub_getUserMsg().userName;
			modalCurBgBill.createUser = _bgPub_getUserMsg().userCode;
			/*if(!$.isNull(billData.bgPlanId) && billData.bgPlanId != '') {
				// 如果有预算方案，根据主界面的预算方案加载表格结构
				for(var s = 0; s < tmpBgPlanTree.setting.tree.getNodes().length; s++) {
					var tmpNode1 = tmpBgPlanTree.setting.tree.getNodes()[s];
					if(tmpNode1.chrId == billData.bgPlanId) {
						tmpBgPlanTree.select(s + 1);
						ufma.hideloading();
						break;
					}
				}
			} else {
				// 没有单据数据，没有预算方案，直接取消遮罩层
				ufma.hideloading();
			} */
		}
		//} 
		/*else {
			iCount++;
			if(iCount > 10) { //10秒超时, 终止循环
				clearInterval(intervalId);
				ufma.hideloading();
			}
		}*/
		//}
	};
	//********************************************************[绑定事件]***************************************************
	/**
	 * 新增按钮，弹出模态框
	 * @param  {[type]} e [description]
	 * @return {[type]}   [description]
	 getURL(0) + "/bg/budgetItem/multiPost/newBill"  //14  新建一个单据
	 */
	$("#btn-add-exebgItem").off("click").on("click", function(e) {
		ufma.get(_bgPub_requestUrlArray_socialSec[14], {
				"agencyCode": agencyCode,
				"billType": billType
			},
			function(result) {
				if(result.flag == "success") {
					if(!$.isNull(curBgPlanData)) {
						result.data.bgPlanId = curBgPlanData.chrId;
					}
					doLoadModalWithData(result.data);
				}
			}
		);
	});

	$("#btn-exp").on("click", function(e) {
		_bgPub_showWait();
	});

	/**
	 * 审核、未审核、全部  [页签]  的变动
	 * @param  {[type]} e [description]
	 * @return {[type]}   [description]
	 */
	$(".nav.nav-tabs li").on("click", function(e) {
		var tmpStatus = $(this).find('a').attr("data-status"); //O=未审核  A=审核  T=全部
		if(tmpStatus == "O") {
			$("#btn-check-exebgItem").text("审核");
			$("#btn-check-exebgItem").show();
		} else if(tmpStatus == "A") {
			$("#btn-check-exebgItem").text("销审");
			$("#btn-check-exebgItem").show();
		} else {
			$("#btn-check-exebgItem").hide();
		}
		$(".nav.nav-tabs li").removeClass("NAVSELECT");
		$(this).addClass("NAVSELECT");
		if($.isNull(tblObj)) {
			return;
		}
		//清空表格
		tblObj.clear().draw();
		pnlFindRst.doFindBtnClick(); //调用查询按钮
	});

	/**
	 * 主界面  打印  按钮事件
	 * @param  {[type]} e [description]
	 * @return {[type]}   [description]
	 */
	$("#exeBudgetItem-print").off("click").on("click", function(e) {
		$("." + tblPrintBtnClass).trigger("click");
	});

	/**
	 * 主界面  导出  按钮事件
	 * @param  {[type]} e [description]
	 * @return {[type]}   [description]
	 */
	$("#exeBudgetItem-exp").off("click").on("click", function(e) {
		$("." + tblPrintBtnClassExpXls).trigger("click");
	});

	/**
	 * 模态框表格-新增一行[本质就是获得一条指标]
	 * 特点：手工录入 + 新增未审核 + 可执行指标
	 * @param  {[type]} e [description]
	 * @return {[type]}   [description]
	 * getURL(0) + "/bg/budgetItem/newBudgetItem", //3  新增一条指标
	 */
	$("#btn-newRow-exebgItem").off("click").on("click", function(e) {
		if(modal_open_readOnly) {
			return;
		}
		if(modal_curBgPlan == null) {
			ufma.showTip("请先选择一个预算方案", null, "warning");
			return;
		}
		ufma.get(_bgPub_requestUrlArray_socialSec[3], //3  新增一条指标
			{
				"bgPlanChrId": modal_curBgPlan.chrId,
				"bgPlanChrCode": modal_curBgPlan.chrCode,
				"agencyCode": agencyCode,
				"setYear": setYear,
				"billType": billType,
				"bgReserve": bgReserve
			},
			function(result) {
				if(result.flag == "success") {
					//初始化一些指标数据
					result.data.status = '1'; //未审核
					result.data.dataSource = '1'; //数据来源：手工编制
					result.data.createSource = '1'; //建立来源：编制
					result.data.bgReserve = bgReserve; //可执行指标
					result.data.billId = modalCurBgBill.billId; //指标对应的单据ID
					result.data.bgItemCurShow = 0.00;
					result.data.createUserName = _bgPub_getUserMsg().userName;
					result.data.createUser = _bgPub_getUserMsg().userCode;
					$("#" + modalTblId).DataTable().row.add(result.data).draw();
				}
			});
	});

	/**
	 * 模态框表格-保存按钮
	 * @param  {[type]} e [description]
	 * @return {[type]}   [description]
	 */
	$("#btn-modal-save-exebgItem").off("click").on("click", function(e) {
		fileLeng = 0;
		page.addNew = false;
		page.add = true;
		page.btnAdd = true;
		if(modal_open_readOnly) {
			return;
		}
		var tmpTblDt = $("#" + modalTblId).DataTable().data();
		var billCur = 0;
		modalCurBgBill.items = [];
		for(var i = 0; i < tmpTblDt.length; i++) {
			var rowDt = tmpTblDt[i];
			if(rowDt.isNew == "是") {
				modalCurBgBill.items[modalCurBgBill.items.length] = rowDt;
			} else if(rowDt.shouldSave != null && rowDt.shouldSave == "1") {
				modalCurBgBill.items[modalCurBgBill.items.length] = rowDt;
			}
			billCur = billCur + parseFloat(rowDt.bgItemCur);
		}
		modalCurBgBill.billCur = billCur;
		modalCurBgBill.setYear = setYear;
		modalCurBgBill.bgPlanId = $('#bg-multiModal-bgPlan-exebgItem').getObj().getValue();
		//单据日期是可以前台改变的。
		modalCurBgBill.billDate = $("#bg-multiModal-dtp-exebgItem").find("input").val();
		//bug79887--zsj
		if($("#bgInput-fileCount-exebgItem").val() < fileLeng) {
			ufma.showTip('输入附件数不能小于已上传附件数！', function() {}, 'warning');
			return false;
		}
		modalCurBgBill.attachNum = $("#bgInput-fileCount-exebgItem").val(); //bug79887--zsj
		ufma.showloading("正在保存单据，请稍后....");
		ufma.post(
			_bgPub_requestUrlArray_socialSec[4] + "?billType=" + billType + "&agencyCode=" + agencyCode + '&setYear=' + ufma.getCommonData().svSetYear + "&billType=" + billType + "&bgReserve=" + bgReserve,
			modalCurBgBill,
			function(result) {
				if(result.flag == "success") {
					ufma.hideloading();
					ufma.showTip("保存成功", null, "success");
					if(page.btnAdd == true) {
						addModal.close();
						showTblData();
					}
					modal_refreshWhenClose = true;
					if(!modal_clearTableAfterSave) {
						modalCurBgBill.isNew = "否";
						for(var i = 0; i < tmpTblDt.length; i++) {
							tmpTblDt[i].isNew = "否";
							tmpTblDt[i].shouldSave = "0";
						}
					} else {
						modal_clearTableAfterSave = false;
						setTimeout(function() {
							ufma.get(_bgPub_requestUrlArray_socialSec[14], {
									"agencyCode": agencyCode,
									"billType": billType
								},
								function(result) {
									if(result.flag == "success") {
										//1, 重绘表格
										modal_billDate = null;
										modalCellTree = null;
										modalCurBgBill = result.data;
										modalCurBgBill.billType = billType;
										modalCurBgBill.items = [];
										repaintModalTableByBgPlan(modal_curBgPlan);
										//2, 替换成新的方案
										$("#multiModal-billCode-exebgItem").val(result.data.billCode);
										$("#multiModal-billCode-exebgItem").attr("data", result.data);
										$("#multiModal-billCode-exebgItem").attr("billId", result.data.billId);
										$("#bgInput-fileCount-exebgItem").val('0');
										modal_billAttachment = [];
									}
								}
							);
						}, 2000); //延迟两秒后自动清空
					}
				} else {
					ufma.hideloading();
					ufma.showTip("保存失败!" + result.msg, null, "error");
				}
			}
		);
	});

	/**
	 * 模态框 - 文件导入  按钮
	 * @param  {[type]} e [description]
	 * @return {[type]}   [description]
	 */
	$("#btn-modal-imp-exebgItem").off("click").on("click", function(e) {
		if(modal_open_readOnly) {
			return;
		}
		var tmpImpModal = _ImpXlsFile("exeBudgetItem", "bgMultiItem", curBgPlanData.chrId,
			function(data) {
				//success
				if(data.flag == "success") {
					modalCurBgBill.items = data.data.items.concat();
					//为导入的数据循环填充制单人信息
					for(var i = 0; i < modalCurBgBill.items.length; i++) {
						modalCurBgBill.items[i].createUserName = _bgPub_getUserMsg().userName;
						modalCurBgBill.items[i].createUser = _bgPub_getUserMsg().userName;
					}
					//这里注意，需要自动切换方案。方案的信息应当来源于服务的应答
					repaintModalTableByBgPlan(modal_curBgPlan);
					tmpImpModal.closeModal();
				} else {
					ufma.showTip(data.msg, null, "error");
				}
			},
			function(data) {
				//failed
				ufma.showTip(data, null, "error");
			}, {
				"agencyCode": agencyCode,
				"billId": $("#multiModal-billCode-exebgItem").attr("billId")
			});
	});

	/**
	 * 模态框 - 取消  按钮
	 * @param  {[type]} e [description]
	 * @return {[type]}   [description]
	 */
	$("#btn-modal-close-exebgItem").off("click").on("click", function(e) {
		doWhenModalClose();
		addModal.close();
	});

	/**
	 * 模态框 - 保存并新增  按钮
	 * @param  {[type]} e [description]
	 * @return {[type]}   [description]
	 */
	$("#btn-modal-saveAndNew-exebgItem").off("click").on("click", function(e) {
		if(modal_open_readOnly) {
			return;
		}
		modal_clearTableAfterSave = true;
		$("#btn-modal-save-exebgItem").trigger("click");
		page.addNew = true; //保存并新增
		page.add = false;
		page.btnAdd = false; //新增
		fileLeng = 0;
	});
	/**
	 * 模态框  - 附件  按钮事件绑定
	 * @param  {[type]} e [description]
	 * @return {[type]}   [description]
	 */
	$("#btn-multiModal-aboutFiles-exebgItem").off("click").on("click", function(e) {
		// getURL(0) + "/bg/budgetItem/upAttachment",      //8 附件导入
		// getURL(0) + "/bg/attach/FileDownload",  //15, 附件导出
		// getURL(0) + "/bg/attach/delAttach",  //16，附件删除
		// getURL(0) + "/bg/attach/getAttach"   //17，附件查找
		var option = {
			"agencyCode": agencyCode,
			"billId": modalCurBgBill.billId,
			"uploadURL": _bgPub_requestUrlArray_socialSec[8] + "?agencyCode=" + agencyCode + "&billId=" + modalCurBgBill.billId + "&setYear=" + setYear,
			// "uploadURL" :  _bgPub_requestUrlArray_socialSec[20],
			"delURL": _bgPub_requestUrlArray_socialSec[16] + "?agencyCode=" + agencyCode + "&billId=" + modalCurBgBill.billId + "&setYear=" + setYear,
			"downloadURL": _bgPub_requestUrlArray_socialSec[15] + "?agencyCode=" + agencyCode + "&billId=" + modalCurBgBill.billId + "&setYear=" + setYear,
			"onClose": function(fileList) {
				//$("#bgInput-fileCount-exebgItem").val(fileList.length + "");
				page.modalBillAttachment = cloneObj(fileList);
				fileLeng = fileList.length;
				//bug79887--zsj
				if(page.add || page.addNew) {
					attachNum = fileLeng;
				} else {
					showTblData();
					attachNum = fileList.length < pageAttachNum ? pageAttachNum : fileList.length;
				}
				$("#bgInput-fileCount-exebgItem").val(attachNum + "");
				modal_billAttachment = cloneObj(fileList);
			}
		};
		_bgPub_ImpAttachment("exeBudgetItem", "指标单据[" + modalCurBgBill.billCode + "]附件导入", modal_billAttachment, option);
	});
	//********************************************************[界面入口函数]*****************************************************
	var page = function() {
		return {
			init: function() {
				reslist = ufma.getPermission();
				page.pfData = ufma.getCommonData();
				ufma.isShow(reslist);
				ufma.parse();
				moreMsgSetting.menuId = '';
				moreMsgSetting.acctCode = '';
				moreMsgSetting.bgPlanCacheId = '';
				moreMsgSetting.openType = '';
				moreMsgSetting.cbBgPlanIdMain = '';
				pnlFindRst = _PNL_MoreByBgPlan('bgMoreMsgPnl-exebgItem', moreMsgSetting); //加载头部更多
				_bgPub_Bind_Cbb_AgencyList("cbb-agency-exebgItem", { //绑定单位
					afterChange: function(treeNode) {
						setTimeout(function() {
							$('.ufma-combox-popup').css({
								'display': 'none'
							});
						}, 100);
						ufma.showloading("正在加载预算方案, 请稍后...");
						curAgencyData = treeNode;
						agencyCode = treeNode.id;
						//80827 【财务云8.0 鄂尔多斯 】20190630所有页面，单位或账套选择变化后，再打开其它页面时，自动显示为最近一次选择的单位或账套。--zsj
						//缓存单位
						var params = {
							selAgecncyCode: treeNode.id,
							selAgecncyName: treeNode.name
						}
						ufma.setSelectedVar(params);
						setYear = ufma.getCommonData().svSetYear;
						moreMsgSetting.agencyCode = treeNode.id;
						moreMsgSetting.setYear = setYear;
						moreMsgSetting.menuId = '';
						moreMsgSetting.acctCode = '';
						moreMsgSetting.bgPlanCacheId = '';
						moreMsgSetting.openType = '';
						moreMsgSetting.cbBgPlanIdMain = '';
						pnlFindRst = _PNL_MoreByBgPlan('bgMoreMsgPnl-exebgItem', moreMsgSetting); //根据单位的变化重新加载头部更多
						var iCount = 0;
						var tmpInternalHand = setInterval(function() {
							var tmpPlanId = pnlFindRst.planIds.id_bgPub_div_find_Left_tbl_firstRow_cbbBgPlan;
							if($("#" + tmpPlanId).attr("agencyCode") == agencyCode) {
								//数据加载成功
								clearInterval(tmpInternalHand);
								ufma.hideloading();
							}
							iCount++;
							if(iCount == 20) {
								// 超时
								clearInterval(tmpInternalHand);
								ufma.hideloading();
								ufma.showTip("预算方案加载失败");
							}
						}, 1000);
					}
				});
			}
		};
	}();

	page.init();

});