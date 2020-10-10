$(function () {
	var agencyCode = null;
	var pnlFindRst = null;
	var curAgencyData = null;
	var curBgPlanData = null; //主界面的预算方案
	var curBgPlanEleMsg = null;
	var tblDt = null; //指标数据
	var tblId = "mainTable";
	var tblObj = null;
	var addModal = null; //新增模态框的对象
	var modal_curBgPlan = null; //浮层的预算方案
	var modal_billDate = null;
	var modalTblId = "bgMultiModalTable";
	var modal_tableObj = null;
	var modalCellTree = null;
	var modalCurBgBill = null;
	var tblPrintBtnClass = "mainTable-bgitemMulti-printBtn";
	var tblPrintBtnClassExpXls = "mainTable-bgitemMulti-expXlsBtn";
	var modal_clearTableAfterSave = false; //保存后清空表格
	var modal_billAttachment = []; //单据的附件
	//bug77471--zsj
	var attachNum = 0; //附件前输入框数字
	var pageAttachNum = 0; //后端返回的附件数字
	var fileLeng = 0; //实际上传文件数
	var billType = 1; //1=指标单据新增(可执行-社保) 2=分解单 3=调剂单 4=调整单 5=待分配(社保) 6=下拨单(社保) 7=分配单(社保)
	var catchTblData;
	//CWYXM-10166 指标编制、指标控制管理界面记忆预算方案--新增需求记忆预算方案--传给bgPub.js的数据--zsj
	var acctCode = '*';
	var menuId = $.getUrlParam('menuid');
	var bgPlanCacheId = 'bg-multiModal-bgPlan';
	var openType = 'new';
	var moreMsgSetting = {
		"agencyCode": agencyCode,
		showMoney: false,
		dateTimeAtFirst: true,
		computHeight: function (tblH_before, tblH_after) {

		},
		changeBgPlan: function (data) {
			//实在找不到原因，ufma-combox-popup默认不显示
			setTimeout(function () {
				$('.ufma-combox-popup').css({
					'display': 'none'
				});
			}, 100);
      curBgPlanData = data;
      //CWYXM-18216 --已经有记忆列的预算方案重新修改辅助项时(在预算方案里增减辅助项)，界面显示不同步--zsj
      if (!curBgPlanData.needSendDocNum) {
        curBgPlanData.needSendDocNum = page.sendCloName
      }
			curBgPlanEleMsg = _BgPub_GetBgPlanEle(curBgPlanData);
			showTblData(false);
		},
		afterFind: function (data) {
			tblDt = data;
		},
		doFindBySelf: function (eleCdtn) {
			showTblData(false, eleCdtn);
		}
	};

	/**
	 * 给主界面的表格添加事件监听
	 * @return {[type]} [description]
	 */
	var addListenerToMainTable = function () {
		/**
		 * 事件一，增加 checkbox 勾选的事件响应情况
		 * @param  {[type]} e [description]
		 * @return {[type]}   [description]
		 */
		$("#input-seleAll").off("change").on("change", function (e) {
			var selAll = ($(this).is(":checked") == true);
			$("#input-seleAllUp").prop("checked", selAll);
			var rows = $("#" + tblId).dataTable().fnGetNodes();
			for (var k = 0; k < rows.length; k++) {
				var row = rows[k];
				if ($(row).find("td:eq(0):has(label)").length > 0) {
					$(row).find("td:eq(0):has(label)").find("input[type='checkbox']").prop("checked", selAll);
					$(row).find("td:eq(0):has(label)").find("input[type='checkbox']").trigger("change");
				}
			}
		});
		$("#input-seleAllUp").off("change").on("change", function (e) { //guohx 添加表头checkbox
			var selAll = ($(this).is(":checked") == true);
			$("#input-seleAll").prop("checked", selAll);
			var rows = $("#" + tblId).dataTable().fnGetNodes();
			for (var k = 0; k < rows.length; k++) {
				var row = rows[k];
				if ($(row).find("td:eq(0):has(label)").length > 0) {
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
		$("#btn-check").off("click").on("click", function (e) {
			var $selNav = $(".nav.nav-tabs").find("li.NAVSELECT");
			var statusNav = $selNav.find("a").attr("data-status");
			var rqObj_audit = new bgBillAuditOrUnAudit();
			rqObj_audit.agencyCode = agencyCode;
			rqObj_audit.setYear = page.useYear;
			rqObj_audit.billType = billType;
			rqObj_audit.bgPlanChrId = curBgPlanData.chrId;
			var rows = $("#" + tblId).dataTable().fnGetNodes();
			var iCount = 0;
			var url = null;
			for (var k = 0; k < rows.length; k++) {
				var row = rows[k];
				if ($(row).find("td:eq(0):has(label)").length > 0) {
					if ($(row).find("td:eq(0):has(label)").find("input[type='checkbox']").is(":checked") == true) {
						iCount++;
						var rowDt = tblObj.row(row).data();
						rqObj_audit.items[rqObj_audit.items.length] = {
							"billId": rowDt.billId
						};
					}
				}
			}
			if (iCount == 0) {
				ufma.showTip("请先选择一条单据", null, "warning");
				return false;
			}

			if (statusNav == "O") {
				ufma.confirm('您确定要审核选择的单据吗？', function (ac) {
					if (ac) {
						rqObj_audit.status = "3"; //guohx 增加审核参数  20171024
						rqObj_audit.checkDate = page.pfData.svSysDate;
						rqObj_audit.checkUser = page.pfData.svUserCode;
						rqObj_audit.checkUserName = page.pfData.svUserName;
						var url = _bgPub_requestUrlArray_subJs[12] + "?billType=" + billType + "&agencyCode=" + agencyCode;
						var callback = function (result) {
							ufma.showTip('审核成功！', function () {
								pnlFindRst.doFindBtnClick();
							}, 'success');
						};
						ufma.post(url, rqObj_audit, callback);
					}
				}, {
					'type': 'warning'
				});

			} else if (statusNav == "A") {
				ufma.confirm('您确定要销审选择的单据吗？', function (ac) {
					if (ac) {
						rqObj_audit.status = "1";
						var url = _bgPub_requestUrlArray_subJs[13] + "?billType=" + billType + "&agencyCode=" + agencyCode;
						var callback = function (result) {
							ufma.showTip('销审成功！', function () {
								pnlFindRst.doFindBtnClick();
							}, 'success');
						};
						ufma.post(url, rqObj_audit, callback);
					}
				}, {
					'type': 'warning'
				});
			}
		});

		/**
		 * 事件三，删除(单据)  按钮点击事件
		 * @param  {[type]} e [description]
		 * @return {[type]}   [description]
		 * getURL(0) + "/bg/budgetItem/multiPost/delBudgetItems",  //5  指标删除/指标单据删除-多岗
		 */
		$("#btn-del").off("click").on("click", function (e) {
			var rows = $("#" + tblId).dataTable().fnGetNodes();
			var iDelCount = 0;
			var url = _bgPub_requestUrlArray_subJs[5] + "?billType=" + billType + "&agencyCode=" + agencyCode;
			var requestObj = {
				"bgPlanChrId": curBgPlanData.chrId,
				"agencyCode": agencyCode,
				"setYear": page.useYear,
				items: []
			};
			for (var k = 0; k < rows.length; k++) {
				var row = rows[k];
				if ($(row).find("td:eq(0):has(label)").length > 0) {
					if ($(row).find("td:eq(0):has(label)").find("input[type='checkbox']").is(":checked") == true) {
						var billStatus = $("#" + tblId).DataTable().row(row).data().status;
						if (billStatus == '3') {
							//已审核的不能删除
							continue;
						}
						//此行进行删除
						iDelCount++;
						var rowDt = tblObj.row(row).data();
						requestObj.items[requestObj.items.length] = {
							"billId": rowDt.billId,
							"bgItemId": ""
						};
					}
				}
			}
			if (iDelCount == 0) {
				ufma.showTip("请选择要删除的单据", null, "warning");
			} else {
				ufma.confirm("确定要删除所选的单据吗?",
					function (action) {
						if (action) {
							ufma.post(
								url,
								requestObj,
								function (result) {
									if (result.flag == "success") {
										ufma.showTip("删除成功", null, "success");
										setTimeout(function () {
											pnlFindRst.doFindBtnClick();
										}, 1000);
									} else {
										ufma.showTip("删除失败！" + result.msg, null, "error");
									}
								}
							)
						}
					}, {
						'type': 'warning'
					});
			}
		});
		//工作流批量审核
		$("#btn-batchApprove").off("click").on("click", function (e) {
			var rows = $("#" + tblId).dataTable().fnGetNodes();
			var iDelCount = 0;

			for (var k = 0; k < rows.length; k++) {
				var row = rows[k];
				var batchApprove = [];
				if ($(row).find("td:eq(0):has(label)").length > 0) {
					if ($(row).find("td:eq(0):has(label)").find("input[type='checkbox']").is(":checked") == true) {
						var rowDt = tblObj.row(row).data();
						var businessKey = rowDt.billId;
						var batchObj = {
							businessKey: businessKey,
							variables: []
						}
						batchApprove.push(batchObj);
					}
				}
			}
			if (iDelCount == 0) {
				ufma.showTip("请选择要审核的单据", null, "warning");
			} else {
				ufma.confirm("确定要审核所选的单据吗?",
					function (action) {
						if (action) {
							/*emiter.emit('approve', {
								menuId: '6f7c4687-0463-4d2c-85c1-178e82361811',
								list: batchApprove,
								onCancel: function() {},
								onComplete: function(ret) {}
							});*/
						}
					}, {
						'type': 'warning'
					});
			}
		});
		/**
		 * 事件四，添加  每行 第一列 checkbox的勾选监听
		 * @param  {[type]} e [description]
		 * @return {[type]}   [description]
		 */
		$("#" + tblId + " input[name='mainRowCheck']").off("change").on("change", function (e) {
			var selected = ($(this).is(":checked") == true);
			var $curRow = $(this).closest("tr");
			var rowCount = $(this).closest("tbody").find("tr").length;

			if (selected) {
				$curRow.addClass("selected");
				$curRow = $curRow.next();
				while ($curRow.find("td:eq(0):has(label)").length == 0) {
					$curRow.addClass("selected");
					if ($curRow.index() == (rowCount - 1)) {
						break;
					} //到最后一个节点，退出，别死循环了
					$curRow = $curRow.next();
				}
			} else {
				$curRow.removeClass("selected");
				$curRow = $curRow.next();
				while ($curRow.find("td:eq(0):has(label)").length == 0) {
					$curRow.removeClass("selected");
					if ($curRow.index() == (rowCount - 1)) {
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
		$("a.billRow-a").off("click").on("click", function (e) {
			openType = 'edit';
			page.btnAdd = false;
			page.addNew = false;
      catchTblData = undefined;
      initSearchPnl();
			var billId = tblObj.row($(this).closest("tr")).data().billId;
			page.rowBillId = billId;
			var bill = null;
			for (var i = 0; i < tblDt.billWithItemsVo.length; i++) {
				if (tblDt.billWithItemsVo[i].billId == billId) {
					bill = $.extend({}, tblDt.billWithItemsVo[i]);
					break;
				}
			}
			//bug77471--zsj
			if (bill.attachNum == '') {
				bill.attachNum = 0;
			}
			$("#btn-multiModal-fileCountInput").val(bill.attachNum + "");
			pageAttachNum = bill.attachNum;
			if (bill != null) {
				var itemsArr = [];
				for (var i = 0; i < bill.billWithItems.length; i++) {
					itemsArr.push($.extend({}, bill.billWithItems[i]));
				}
				bill.items = itemsArr;
				bill.isNew = "否";
        // doLoadModalWithData(bill);
        openPageFun(bill,'edit')
			}
		});
		//搜索框
		ufma.searchHideShow($('#mainTable'));
		/**
		 * 事件六， 每行最后一列的  编辑  图标， 添加响应事件
		 * @param  {[type]} e [description]
		 * @return {[type]}   [description]
		 */
		$("#" + tblId + " tbody").on("click", 'span.mainEditSpan', function (e) {
			$(this).closest("tr").find("a.billRow-a").trigger("click");
		});
		/**
		 * 事件七， 每行最后一列的  日志  图标， 添加响应事件
		 * @param  {[type]} e [description]
		 * @return {[type]}   [description]
		 */
		$("#" + tblId + " tbody").on("click", 'span.mainLogSpan', function (e) {
			var tr = $(this).closest("tr");
			var dt = tblObj.row(tr).data();

			_bgPub_showLogModal("budgetItemMultiPost", {
				"bgBillId": dt.billId,
				"bgItemCode": "",
				"agencyCode": agencyCode
			});
		});
		/**
		 * 事件八， 每行最后一列的  删除  图标， 添加响应事件
		 * @param  {[type]} e [description]
		 * @return {[type]}   [description]
		 */
		$("#" + tblId + " tbody").on("click", 'span.mainDelSpan', function (e) {
			var tmpBill = $("#" + tblId).DataTable().row($(this).closest("tr")).data();
			var url = _bgPub_requestUrlArray_subJs[5] + "?billType=" + billType + "&agencyCode=" + agencyCode;
			var requestObj = {
				"bgPlanChrId": curBgPlanData.chrId,
				"agencyCode": agencyCode,
				"setYear": page.useYear,
				items: [{
					"billId": tmpBill.billId,
					"bgItemId": ""
				}]
			};
			if (tmpBill.status == '3') {
				ufma.showTip("已审核的单据不能删除.", null, "warning");
				return false;
			}
			ufma.confirm("确定要删除本条单据[" + tmpBill.billCode + "]吗?",
				function (action) {
					if (action) {
						ufma.post(
							url,
							requestObj,
							function (result) {
								if (result.flag == "success") {
									ufma.showTip("删除成功", null, "success");
									setTimeout(function () {
										pnlFindRst.doFindBtnClick();
									}, 1000);
								} else {
									ufma.showTip("删除失败！" + result.msg, null, "error");
								}
							}
						)
					}
				}, {
					'type': 'warning'
				});
		});
		/**
		 * 事件九， 每行最后一列的  审核  图标， 添加响应事件
		 * @param  {[type]} e [description]
		 * @return {[type]}   [description]
		 */
		$("#" + tblId + " tbody").on("click", "span.mainAuditSpan", function (e) {
			var rqObj_audit = new bgBillAuditOrUnAudit();
			rqObj_audit.agencyCode = agencyCode;
			rqObj_audit.setYear = page.useYear;
			rqObj_audit.billType = billType;
			var rowDt = tblObj.row($(this).closest("tr")).data();
			rqObj_audit.items[0] = {
				"billId": rowDt.billId
			};
			rqObj_audit.status = "3";
			rqObj_audit.checkDate = page.pfData.svSysDate;
			rqObj_audit.checkUser = page.pfData.svUserCode;
			rqObj_audit.checkUserName = page.pfData.svUserName;
			rqObj_audit.bgPlanChrId = curBgPlanData.chrId;
			url = _bgPub_requestUrlArray_subJs[12] + "?billType=" + billType + "&agencyCode=" + agencyCode;
			ufma.confirm('您确定要审核选择的单据吗？', function (ac) {
				if (ac) {
					var callback = function (result) {
						ufma.showTip('审核成功！', function () {
							pnlFindRst.doFindBtnClick();
						}, 'success');
					};
					ufma.post(url, rqObj_audit, callback);
				}
			}, {
				'type': 'warning'
			});
		});
		/**
		 * 事件十， 每行最后一列的  销审  图标， 添加响应事件
		 * @param  {[type]} e [description]
		 * @return {[type]}   [description]
		 */
		$("#" + tblId + " tbody").on("click", "span.mainCancelAuditSpan", function (e) {
			var rqObj_audit = new bgBillAuditOrUnAudit();
			rqObj_audit.agencyCode = agencyCode;
			rqObj_audit.setYear = page.useYear;
			rqObj_audit.billType = billType;
			var rowDt = tblObj.row($(this).closest("tr")).data();
			rqObj_audit.items[0] = {
				"billId": rowDt.billId
			};
			rqObj_audit.status = "1";
			rqObj_audit.bgPlanChrId = curBgPlanData.chrId;
			url = _bgPub_requestUrlArray_subJs[13] + "?billType=" + billType + "&agencyCode=" + agencyCode;
			ufma.confirm('您确定要销审选择的单据吗？', function (ac) {
				if (ac) {
					var callback = function (result) {
						ufma.showTip('销审成功！', function () {
							pnlFindRst.doFindBtnClick();
						}, 'success');
					};
					ufma.post(url, rqObj_audit, callback);
				}
			}, {
				'type': 'warning'
			});
		});
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
	/**
	 * 表格金额输入发生了变动后的处理, 修改对应的data
	 */
	var tbl_afterInputMoney_cellChange = function (value, doc) {
		var tbl = $("#" + modalTblId).DataTable();
		var val = value;
		if (val == null || val == '') {
			val = '0';
		}
		tbl.cell(doc).data(val);
		//tbl.row(doc).data().shouldSave = "1";
	};

	var tbl_afterCbbSelect_cellChange = function (data) {
		if (modalCellTree == null) {
			return;
		}
		var $td = $("#" + modalCellTree.setting.id).closest("td");
		var tbl = $("#" + modalTblId).DataTable();
		//$td.empty();
		if (data.codeName != null && data.codeName != '') {
			tbl.cell($td).data(data.codeName);
			//page.needYsxm--预算项目；  page.needXmlx---项目类型
			/*
			 * CWYXM-12354指标编制时，如果预算方案中启用了项目、项目类型、预算项目，项目的基础资料中维护了项目所对应的项目类型和预算项目，编制指标时，选择项目，需要将项目类型和预算项目带出
			 * 1、项目+预算项目    或者项目+项目类型  。也应该自动填充的；
			 * 2、当预算项目、项目类型单元格值为空时，才覆盖
			 */
			if (page.needYsxm || page.needXmlx) {
				var urlProject = '/bg/sysdata/getEleProject?agencyCode=' + agencyCode + '&setYear=' + page.useYear + '&rgCode=' + page.rgCode + '&chrCode=' + data.code;
				ufma.ajaxDef(urlProject, 'get', {}, function (result) {
					if (page.needYsxm) {
						var $tdYS = $td.closest("tr").find('.DEPPRO');
						tbl.cell($tdYS).data(result.data.depproCodeName);
					}
					if (page.needXmlx) {
						var $tdYS = $td.closest("tr").find('.PROTYPE');
						tbl.cell($tdYS).data(result.data.protypeCodeName);
					}
				});
			}
		} else {

			tbl.cell($td).data(data.codeName);
		}
	};

	/**
	 * 表格摘要输入发生了变动后的处理, 修改对应的data
	 */
	var tbl_afterInputSummary_cellChange = function (value, doc) {
		var tbl = $("#" + modalTblId).DataTable();
		var val = value;
		if (val == null || val == '') {
			val = '';
		}
		tbl.cell(doc).data(val);
		//tbl.row(doc).data().shouldSave = "1";
	};

	function formatCheckboxCol(rowdata) {
		return '<label class="mt-checkbox mt-checkbox-single mt-checkbox-outline"> ' +
			'<input type="checkbox" class="checkboxes" data-level="' + rowdata.levelNum + '" name="mainRowCheck" />&nbsp;' +
			'<span></span> ' +
			'</label>';
	}

	function formatOperate(rowdata) {
		if (rowdata.status == "1") {
			//未审核
			return '<a class="btn btn-icon-only btn-sm btn-edit   btn-permission" data-toggle="tooltip" ' +
				'rowid="' + rowdata.bgItemId + '" title="编辑" data-original-title="编辑">' +
				'<span class="glyphicon icon-edit mainEditSpan"></span></a>' +
				'<a class="btn btn-icon-only btn-sm btn-audit   btn-permission" data-toggle="tooltip"  ' +
				'rowid="' + rowdata.bgItemId + '"   title="审核" data-original-title="审核">' +
				'<span class="glyphicon icon-audit mainAuditSpan"></span></a>' +
				'<a class="btn btn-icon-only btn-delete btn-sm   btn-permission" data-toggle="tooltip"  ' +
				'rowid="' + rowdata.bgItemId + '"   title="删除" data-original-title="删除">' +
				'<span class="glyphicon icon-trash mainDelSpan"></span></a>' +
				'<a class="btn btn-icon-only btn-start  btn-sm btn-permission hide" data-toggle="tooltip"  ' +
				'rowid="' + rowdata.bgItemId + '"   title="启动流程" data-original-title="启动流程">' +
				'<span class="glyphicon icon-play mainStartSpan"></span></a>' +
				'<a class="btn btn-icon-only btn-start  btn-sm btn-permission hide" data-toggle="tooltip"  ' +
				'rowid="' + rowdata.bgItemId + '"   title="显示流程" data-original-title="显示流程">' +
				'<span class="glyphicon icon-add-subordinate mainShowSpan"></span></a>' +
				'<a class="btn btn-icon-only btn-start  btn-sm btn-permission" data-toggle="tooltip"  ' +
				'rowid="' + rowdata.bgItemId + '"  title="单据审核" data-original-title="单据审核">' +
				'<span class="glyphicon icon-uniE96C mainCheckSpan"></span></a>' +
				'<a class="btn btn-icon-only btn-start  btn-sm btn-permission" data-toggle="tooltip"  ' +
				'rowid="' + rowdata.bgItemId + '"  title="驳回流程" data-original-title="驳回流程">' +
				'<span class="glyphicon icon-replace-t mainBackSpan"></span></a>' +
				'<a class="btn btn-icon-only btn-start  btn-sm btn-permission" data-toggle="tooltip"  ' +
				'rowid="' + rowdata.bgItemId + '"  title="撤销流程" data-original-title="撤销流程">' +
				'<span class="glyphicon icon-add-subordinate mainCancelSpan"></span></a>';
		} else if (rowdata.status == "3") {
			//审核
			return '<a class="btn btn-icon-only btn-sm btn-un-audit   btn-permission" data-toggle="tooltip" action= "unactive" ' +
				'rowid="' + rowdata.bgItemId + '"   title="销审" data-original-title="销审">' +
				'<span class="glyphicon icon-cancel-audit mainCancelAuditSpan"></span></a>' +
				'<a class="btn btn-icon-only btn-sm btn-watch-detail   btn-permission" data-toggle="tooltip" action= "unactive" ' +
				'rowid="' + rowdata.bgItemId + '"  title="日志" data-original-title="日志">' +
				'<span class="glyphicon icon-log mainLogSpan"></span></a>' +
				'<a class="btn btn-icon-only btn-start  btn-sm btn-permission hide" data-toggle="tooltip"  ' +
				'rowid="' + rowdata.bgItemId + '"   title="启动流程" data-original-title="启动流程">' +
				'<span class="glyphicon icon-play mainStartSpan"></span></a>' +
				'<a class="btn btn-icon-only btn-start  btn-sm btn-permission hide" data-toggle="tooltip"  ' +
				'rowid="' + rowdata.bgItemId + '"   title="显示流程" data-original-title="显示流程">' +
				'<span class="glyphicon icon-add-subordinate mainShowSpan"></span></a>' +
				'<a class="btn btn-icon-only btn-start  btn-sm btn-permission" data-toggle="tooltip"  ' +
				'rowid="' + rowdata.bgItemId + '"  title="单据审核" data-original-title="单据审核">' +
				'<span class="glyphicon icon-uniE96C mainCheckSpan"></span></a>' +
				'<a class="btn btn-icon-only btn-start  btn-sm btn-permission" data-toggle="tooltip"  ' +
				'rowid="' + rowdata.bgItemId + '"  title="驳回流程" data-original-title="驳回流程">' +
				'<span class="glyphicon icon-replace-t mainBackSpan"></span></a>' +
				'<a class="btn btn-icon-only btn-start  btn-sm btn-permission" data-toggle="tooltip"  ' +
				'rowid="' + rowdata.bgItemId + '"  title="撤销流程" data-original-title="撤销流程">' +
				'<span class="glyphicon icon-add-subordinate mainCancelSpan"></span></a>';
		} else {
			return '';
		}
	}

	/**
	 * 根据传入的tabData加载表格数据
	 * @param  {[type]} tabData 绘制表格的data, url.data
	 * @return {[type]}         [description]
	 */
	var doPaintTable = function (tabData) {
		var tmpBillId = '',
			bCreate = true,
			rowSpan, $mgColFirst, $mgColLast;
		var tblCols = [{
				data: "bgItemId",
				title: '<label class="mt-checkbox mt-checkbox-single mt-checkbox-outline" style="right:-3px"> <input id="input-seleAllUp" type="checkbox" class="checkboxes" data-level="undefined" name="mainRowCheck">&nbsp;<span></span> </label>',
				width: "40px"
			},
			{
				data: "bgItemCode",
				title: "指标编码",
				//width: "125px",
				className: "print nowrap BGasscodeClass",
				"render": function (data, type, rowdata, meta) {
					if (!$.isNull(data)) {
						return '<span title="' + data + '">' + data + '</span>';
					} else {
						return '';
					}
				}
			},
			// CWYXM-18408--指标年结涉及采购合同报销模块占用的指标结转完善
			{
				data: "bgTypeName",
				title: "指标类型",
				//width: "250px",
				className: "nowrap print BGTenLen",
				"render": function (data, type, rowdata, meta) {
					if (!$.isNull(data)) {
						return '<span title="' + data + '">' + data + '</span>';
					} else {
						return '';
					}
				}
			},
			{
				data: "bgItemSummary",
				title: '摘要',
				//width: "250px",
				className: "nowrap print BGThirtyLen",
				"render": function (data, type, rowdata, meta) {
					if (!$.isNull(data)) {
						return '<span title="' + data + '">' + data + '</span>';
					} else {
						return '';
					}
				}
			}
		];
		if (currentplanData.isComeDocNum == "是") {
			tblCols.push({
				data: "comeDocNum",
				title: "来文文号",
				className: "nowrap print BGThirtyLen",
				//width: "250px",
				"render": function (data, type, rowdata, meta) {
					if (!$.isNull(data)) {
						return '<span title="' + data + '">' + data + '</span>';
					} else {
						return '';
					}
				}
			});
		}
		if (currentplanData.isSendDocNum == "是") {
			tblCols.push({
				data: "sendDocNum",
				title: page.sendCloName,
				className: "nowrap print BGThirtyLen",
				//width: "250px",
				"render": function (data, type, rowdata, meta) {
					if (!$.isNull(data)) {
						return '<span title="' + data + '">' + data + '</span>';
					} else {
						return '';
					}
				}
			});
    }
         //CWYXM-17554 预算方案设置中，增加财政指标ID属性，可选择是否启用，启用时，选择预算方案新增指标时，需要录入指标id，指标id也需要参与指标的要素唯一性校验--zsj
    if (currentplanData.isFinancialBudget == "1") {
			tblCols.push({
				data: "bgItemIdMx",
				title: '财政指标ID',
				className: "nowrap print BGThirtyLen",
				//width: "250px",
				"render": function (data, type, rowdata, meta) {
					if (!$.isNull(data)) {
						return '<span title="' + data + '">' + data + '</span>';
					} else {
						return '';
					}
				}
			});
		}
		//循环添加预算方案的要素信息
		for (var index = 0; index < curBgPlanEleMsg.eleCodeArr.length; index++) {
      //CWYXM-11697 --预算方案中要素选择里，增加是否采购属性，启用之后，编制指标时可选是和否，不能输入其他值，采购模块选择指标时，根据这个属性过滤--zsj
			if (curBgPlanEleMsg.eleCodeArr[index] == 'ISUPBUDGET') {
				tblCols.push({
						data: 'isUpBudget',
						title: "是否采购",
						// width: "120px",
						className: "print nowrap tc",
						"render": function (data, type, rowdata, meta) {
							if (!$.isNull(data)) {
								if (data == '1') {
									data = '是'
									return data;
								} else if (data == '0') {
									data = '否';
									return data;
								} else {
									return data
								}
							} else {
								return '';
							}
						}
					}
				);
			} else {
				tblCols.push({
					data: _BgPub_getEleDataFieldNameByCode(curBgPlanEleMsg.eleCodeArr[index], curBgPlanEleMsg.eleFieldName[index]) + 'Name',
					title: curBgPlanEleMsg.eleNameArr[index],
					//width: "270px",
					className: "print nowrap BGThirtyLen",
					"render": function (data, type, rowdata, meta) {
						if (!$.isNull(data)) {
							return '<span title="' + data + '">' + data + '</span>';
						} else {
							return '';
						}
					}
				});
			}
    }
    //CWYXM-18080 编制指标时需要增加文本说明项，只录入文本，用于描述指标信息--zsj--查询条件区域
    for (var k = 0; k < curBgPlanData.planVo_Txts.length; k++) {
      var code = shortLineToTF(curBgPlanData.planVo_Txts[k].eleFieldName)
      tblCols.push({
        data: code,
        title: curBgPlanData.planVo_Txts[k].eleName,
        className: "nowrap print BGThirtyLen",
        //width: "250px",
        "render": function (data, type, rowdata, meta) {
          if (!$.isNull(data)) {
            return '<span title="' + data + '">' + data + '</span>';
          } else {
            return '';
          }
        }
      });
    }
		//添加最后的金额，日期，操作列
		tblCols.push({
			data: "bgItemCur",
			title: "金额",
			className: "print tr bgPubMoneyCol nowrap BGmoneyClass",
			//width: "150px",
			render: $.fn.dataTable.render.number(',', '.', 2, '')

		});
		tblCols.push({
			data: "createDate",
			title: "录入日期",
			// width: "150px",
			className: "print nowrap BGdateClass tc"
		});
		tblCols.push({
			data: "bgItemId",
			title: "操作",
			width: "100px",
			className: "nowrap",
			render: function (data, type, rowdata, meta) {
				return formatOperate(rowdata);
			}
		});

		var colDefs = [{
			"targets": [-1],
			"serchable": false,
			"orderable": false
		}, {
			"targets": [0],
			"serchable": false,
			"orderable": false,
			"render": function (data, type, rowdata, meta) {
				return formatCheckboxCol(rowdata);
			}
		}];
		var manager = new _bgPub_itemManager();
		var mainTableData = manager.organizeUrlBillData(tabData, 5, true, true);

		var bNotAutoWidth = true; //默认是取消自动宽度；
		/*if (mainTableData.data.length == 0) {
		    bNotAutoWidth = false;
		}*/

		/*修改点击查询时表格高度一直变大的问题
		var sScrollY = $(".workspace").outerHeight(true) - $(".workspace-top").outerHeight(true) -
			$("#bgMoreMsgPnl").outerHeight(true) - 12 - $(".nav").outerHeight(true) -
			$("#tableTotalShow").outerHeight(true) - 38 - 34 - 30;*/
		var tblSetting = {
			"data": mainTableData.data,
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
			"scrollY": 250, //修改点击查询时表格高度一直变大的问题
			"select": true,
			"bDestroy": true,
			"dom": 'Brt<"bg-mainTableFooterDiv" <"#bg-mainTableFooterDiv-leftPnl.leftDiv">>', //<"rightDiv" p><"rightDiv" i>
			"initComplete": function (options, data) {
				$('button[data-toggle="tooltip"]').tooltip();
			},
			"buttons": [{
				"extend": "print",
				"className": tblPrintBtnClass + " bgHide",
				"text": "打印",
				"autoPrint": true,
				'exportOptions': {
					'modifier': {
						'page': 'current'
					},
					'columns': ".print"
				}

			}, {
				'extend': 'excel',
				"className": tblPrintBtnClassExpXls + " bgHide",
				'text': '导出', //定义导出excel按钮的文字
				'exportOptions': {
					'modifier': {
						'page': 'current'
					},
					'rows': function (idx, data, node) {
						if (data.isBill === 1 || data.isMore === 1) {
							return false;
						} else {
							return true;
						}
					},
					'columns': ".print"
				}
			}],
			fnCreatedRow: function (nRow, aData, iDataIndex) {
				bCreate = true;
				////////
				$.data($(nRow)[0], 'rowdata', aData);
				$(nRow).attr('billid', aData.billId);
				if (aData.isBill == 1 || aData.isMore == 1) {
					var tdNum = $('td', nRow).length;
					for (var i = tdNum - 2; i > 1; i--) {
						$('td:eq(' + i + ')', nRow).remove();
					}
					$('td:eq(1)', nRow).attr('colspan', tdNum - 2);
				}

				if (aData.isBill == 1) {
					$(nRow).attr('datatype', 1);
					var checkDate = ufma.parseNull(aData.checkDate).substr(0, 10);
					var midRowColSpanHtml = "<a class='billRow-a  common-jump-link btn-watch btn-permission' href='javascript:;'>单据编号:&nbsp;" + aData.billCode + "&nbsp;&nbsp;&nbsp;&nbsp;" +
						"单据日期:&nbsp;" + ufma.parseNull(aData.billDate) + "&nbsp;&nbsp;&nbsp;&nbsp;" +
						"单据金额:&nbsp;" + jQuery.formatMoney(aData.billCur + "", 2) + "&nbsp;&nbsp;&nbsp;&nbsp;" +
						"制单人:&nbsp;" + ufma.parseNull(aData.createUserName) + "&nbsp;&nbsp;&nbsp;&nbsp;"; //点击进入查看单据界面
					if (aData.status == "3") {
						midRowColSpanHtml += "审核人:&nbsp;" + ufma.parseNull(aData.checkUserName) + "&nbsp;&nbsp;&nbsp;&nbsp;" +
							"审核日期:&nbsp;" + checkDate + "&nbsp;&nbsp;&nbsp;&nbsp;"; //点击进入查看单据界面
					}

					$('td:eq(1)', nRow).html(midRowColSpanHtml);
				} else if (aData.isMore == 1) {
					$(nRow).attr('datatype', 3);
					var midRowColSpanHtml1 = "<a class='bgPub-billRow-a bgPub-billRow-a-more billRow-a btn-permission btn-watch' href='javascript:;'>更多></a>"; //点击进入查看单据界面
					$('td:eq(1)', nRow).html(midRowColSpanHtml1);
				} else {
					$(nRow).attr('datatype', 2);
				}

				///////////
				var tdNum = $('td', nRow).length;
				if (aData.isBill == 1) {

					$mgColFirst = $('td:eq(0)', nRow);
					$mgColLast = $('td:eq(' + (tdNum - 1) + ')', nRow);
					tmpBillId = aData.billId;
					rowSpan = 1;
				} else {
					rowSpan = rowSpan + 1;
					$('td:eq(' + (tdNum - 1) + ')', nRow).remove();
					$('td:eq(0)', nRow).remove();
				}
				if ($mgColFirst)
					$mgColFirst.attr('rowspan', rowSpan);
				if ($mgColLast)
					$mgColLast.attr('rowspan', rowSpan);

			},
			"drawCallback": function (settings, json) { //合并单元格
				if (!bCreate) {
					var $tbl = $("#" + tblId);

					$("#" + tblId + ' tbody tr').each(function () {
						var billId = $(this).attr('billid');
						if (billId) {
							var datatype = $(this).attr('datatype');
							if (datatype == 2) {
								var $firstTd = $($(this).find('td').eq(0));
								var $lastTd = $($(this).find('td:last-child'));
								var rowData = $.data($(this)[0], 'rowdata');
								if ($tbl.find('tr[billid="' + billId + '"]').length == 1) {
									if ($firstTd.find('.mt-checkbox').length == 0) {
										$('<td>').html(formatCheckboxCol(rowData)).prependTo($(this));
									};
									if ($lastTd.find('.btn').length == 0) {
										$('<td>').html(formatOperate(rowData)).appendTo($(this));
									}
								} else {
									if ($firstTd.find('.mt-checkbox').length > 0) {
										$firstTd.remove();
									}
									if ($lastTd.find('.btn').length > 0) {
										$lastTd.remove();
									}
								}
							}
						}

					});
				}
			},
			initComplete: function (settings, json) {
				bCreate = false;
				var $mainTable = $($('#mainTable').closest('.dataTables_scroll').find('.dataTables_scrollHeadInner table'));
				/*与雪蕊沟通后注释拖动列--CWYXM-11319 --指标调剂列表查看，预算方案列应为左对齐--zsj
				 * $mainTable.tblcolResizable({
					'bindTable': '#mainTable'
				});*/
			}
		};

		if (tblObj != null) {
			tblObj.destroy();
			$("#" + tblId).empty();
		}
		tblObj = $("#" + tblId).DataTable(tblSetting);

		if (!$("#" + tblId).hasClass("ufma-table")) {
			$("#" + tblId).addClass("ufma-table");
		}
		if (!$("#" + tblId).hasClass("dataTable")) {
			$("#" + tblId).addClass("dataTable");
		}
		_BgPub_ReSetDataTable_AfterPaint(tblId);

		var mainTblFoot_leftPnl =
			'<div id="tableTotalShow" class="bg-table-sub bg-div-margin-top-bottom-8  btn-query btn-permission">' +
			' <span>共&nbsp;</span><span id="span_billsCount">' + tabData.billWithItemsVo.length + '</span><span>&nbsp;张单据&nbsp;&nbsp;&nbsp;' +
			'指标金额：&nbsp;</span><span id="span_billsTotalMoney">' + jQuery.formatMoney(mainTableData.money + "", 2) + '</span>' +
			'</div>' +
			'<div class="bg-multi-floatLeft-1">' +
			'<label class="mt-checkbox mt-checkbox-single mt-checkbox-outline bg-top-4"> ' +
			'<input id="input-seleAll" type="checkbox" class="checkboxes" value=""/> &nbsp; 全选' +
			'<span></span> ' +
			'</label> ' +
			'</div>';
		var $selNav = $(".nav.nav-tabs").find("li.NAVSELECT");
		var statusNav = $selNav.find("a").attr("data-status");
		if (statusNav == "O") {
			//未审核
			mainTblFoot_leftPnl = mainTblFoot_leftPnl +
				'<div class="bg-multi-floatLeft-1 multi-4"> ' +
				'<button type="button" id="btn-del" class="btn btn-sm btn-default btn-delete bg-multiModal-leftButton btn-permission">删除</button> ' +
				'</div> ' +
				'<div class="bg-multi-floatLeft-1 multi-4"> ' +
				'<button type="button" id="btn-check" class="btn btn-sm btn-default btn-audit bg-multiModal-leftButton btn-permission">审核</button> ' +
				'<div class="bg-multi-floatLeft-1 multi-4"> ' +
				'<button type="button" id="btn-batchApprove" class="btn btn-sm btn-default btn-batchApprove bg-multiModal-leftButton btn-permission">工作流批量审核</button> ';
		} else if (statusNav == "A") {
			//已审核
			mainTblFoot_leftPnl = mainTblFoot_leftPnl +
				'<div class="bg-multi-floatLeft-1 multi-4"> ' +
				'<button type="button" id="btn-check" class="btn btn-sm btn-default btn-un-audit bg-multiModal-leftButton btn-permission">销审</button> ';
		} else {
			//全部
			mainTblFoot_leftPnl = mainTblFoot_leftPnl +
				'<div class="bg-multi-floatLeft-1 multi-4"> ' +
				'<button type="button" id="btn-del" class="btn btn-sm btn-default btn-delete bg-multiModal-leftButton btn-permission" style="display:none">删除</button> ' +
				'</div> ' +
				'<div class="bg-multi-floatLeft-1 multi-4"> ' +
				'<button type="button" id="btn-check" class="btn btn-sm btn-default btn-audit bg-multiModal-leftButton btn-permission" style="display:none">审核</button> ';
		}
		mainTblFoot_leftPnl = mainTblFoot_leftPnl +
			'</div> ';
		$("#bg-mainTableFooterDiv-leftPnl").append(mainTblFoot_leftPnl);

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
	var showTblData = function (bNotRepaintTbl, pEleCdtn) {
		var surl = '';
		var eleCdtn = null;
		var $selNav = $(".nav.nav-tabs").find("li.NAVSELECT");
		var statusNav = $selNav.find("a").attr("data-status");
		if (!$.isNull(pEleCdtn)) {
			if (pEleCdtn.isUpBudget == '是') {
				pEleCdtn.isUpBudget = '1'
			} else if (pEleCdtn.isUpBudget == '否') {
				pEleCdtn.isUpBudget = '0'
			}
		}
		if (statusNav == "1") {
			eleCdtn = {
				"rgCode": "87",
				"agencyCode": agencyCode,
				"setYear": page.useYear,
				"billType": "1",
				"bgPlanChrId": curBgPlanData.chrId,
				"businessDateBegin": $('#_bgPub_dtpBegin_bgMoreMsgPnl').getObj().getValue(),
				"businessDateEnd": $('#_bgPub_dtpEnd_bgMoreMsgPnl').getObj().getValue(),
				"workFlowStatus": "todo",
				"status": "1"
			}
			surl = '/df/access/public/bg/workflow/getBillTodoList';
		} else {
			surl = _bgPub_requestUrlArray_subJs[27] + "?agencyCode=" + agencyCode + "&setYear=" + page.useYear + "&rgCode=" + page.pfData.svRgCode;
			if (pEleCdtn == null) {
				eleCdtn = new eleInBgItemObj();
				eleCdtn.agencyCode = agencyCode;
				eleCdtn.setYear = page.useYear;
				eleCdtn.chrId = curBgPlanData.chrId;
				eleCdtn.billType = billType;
				eleCdtn.businessDateBegin = $('#_bgPub_dtpBegin_bgMoreMsgPnl').getObj().getValue();
				eleCdtn.businessDateEnd = $('#_bgPub_dtpEnd_bgMoreMsgPnl').getObj().getValue();
				//请求添加主要素
				if (curBgPlanEleMsg.priEle == "") {
					eleCdtn.priEle = "";
				} else {
					eleCdtn.priEle = curBgPlanEleMsg.priEle;
				}
			} else {
				eleCdtn = pEleCdtn;
				eleCdtn.billType = billType;
			}
			if (statusNav == "O") {
				//未审核
				eleCdtn.status = "1";
			} else if (statusNav == "A") {
				//已审核
				eleCdtn.status = "3";
			} else {
				//全部
				eleCdtn.status = "";
			}
		}

		//**********************************************
		ufma.showloading("正在加载指标单据, 请稍后...");
		ufma.post(surl,
			eleCdtn,
			function (result) {
				if (result.flag == "success") {
					tblDt = result.data;
					//bug79183--保存并新增时清空附件
					if (page.add) {
						$("#btn-multiModal-fileCountInput").val("0");
						modal_billAttachment = [];
					} else {
						if (tblDt.billWithItemsVo.length > 0) {
							for (var i = 0; i < tblDt.billWithItemsVo.length; i++) {
								if (page.rowBillId == tblDt.billWithItemsVo[i].billId) {
									$("#btn-multiModal-fileCountInput").val(tblDt.billWithItemsVo[i].attachNum + "");
									pageAttachNum = tblDt.billWithItemsVo[i].attachNum;
								}
							}
						}
					}
					if (bNotRepaintTbl) {
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
	};
	var delModelData = function (bg_item_id, tr) {
		var manager = new _bgPub_itemManager();
		manager.agencyCode = agencyCode;
		//CWYXM-14408 --指标编制-导入指标，在导入的指标里增加行然后删除掉后可把之前导入的指标覆盖掉--弹窗行删除时不走接口--zsj
		//manager.deleteBgItem(bg_item_id, modal_curBgPlan.chrId, function () {
		modal_tableObj.row(tr).remove().draw();
		//});
	}
	var modalTbl_clearCbbCell = function () {
		if ($.isNull(modalCellTree)) {
			return;
		}
		var $tdTree = $("#" + modalCellTree.setting.id),
			$td = $tdTree.closest("td");
		var chooseData = $("#" + modalCellTree.setting.id + " input#multiModalCellTree_input").val(); //CWYXM-11383 达梦库：指标管理指标编制模块，新增指标时，指标要素选择后，再点击后面的叉号取消，数据没有清空成功--zsj
		$tdTree.removeClass();
		$tdTree.removeAttr("id");
		$tdTree.removeAttr("style");
		$tdTree.removeAttr("aria-new");
		$tdTree.empty();
		modalCellTree = null;
		$td.empty(); //CWYXM-11383 达梦库：指标管理指标编制模块，新增指标时，指标要素选择后，再点击后面的叉号取消，数据没有清空成功--zsj
		modal_tableObj.cell($td).data(chooseData); //CWYXM-11383 达梦库：指标管理指标编制模块，新增指标时，指标要素选择后，再点击后面的叉号取消，数据没有清空成功--zsj
		/*if($td.text() == null || $td.text() == "") {
			if(!$.isNull($td.attr("lastVal"))) {
				$td.empty();
				modal_tableObj.cell($td).data($td.attr("lastVal"));
			}
		}*/
	};

	/**
	 * 给 浮层 的 表格 挂接各种事件。在重画表格后调用
	 * @return {[type]} [description]
	 */
	var bindListenerToModalTable = function () {
		if (modal_tableObj == null) {
			return;
		} //
		/**
		 * 1, 事件一，单击单元格可以进入编辑状态
		 * @param  {[type]} [modal_tableObj== null]         [description]
		 * @return {[type]}                   [description]
		 */
		/*$(document).off("click", "#" + modalTblId + ' td:not(.UnEdit)').
				on("click", "#" + modalTblId + ' td:not(.UnEdit)', function() {*/
		$(document).on("click", function (e) {
			//WJBCWY-1600【财务云8.20.14 IE11】指标编制选不到末级科目，具体见截图--zsj
			var tarName = e.target.className.replace(/(^\s*)/g, "").split(' ')[0];
			//if(tarName != 'canEdit' || tarName != 'bgPubMoneyCol tr canEdit') {
			if (tarName != 'canEdit' && e.target.nodeName != "TH" && e.target.id.split('_')[0] != 'multiModalCellTree' && e.target.nodeName != "TH") {
				modalTbl_clearCbbCell();
			}
		});
		$(document).off("click", "#" + modalTblId + ' td:not(.UnEdit)').
		on("click", "#" + modalTblId + ' td:not(.UnEdit)', function () {
			var tbl = $("#" + modalTblId).DataTable();
			var col = tbl.column(this);
      var sId = col.dataSrc();
      var num = col[0][0];
			if (typeof (sId) == "undefined") {
				modalTbl_clearCbbCell();
				return;
			}
			modalTbl_clearCbbCell();
			if (sId == "bgItemCur") { //指标金额
				var rst = _BgPub_Bind_InputMoney(this, sId + "_money", tbl_afterInputMoney_cellChange, tbl.cell(this).data());
				$("#" + sId + "_money").blur(function (e) {
					var tmpE = jQuery.Event("keyup");
					tmpE.keyCode = 13;
          $("#" + sId + "_money").trigger(tmpE);
          var tdWidth = $('#bgMultiModalTable tbody tr td').eq(num).width();
          $('.dataTables_scrollHeadInner thead tr th').eq(num).css('width',tdWidth+ 'px');
          var oldW = 0;
          for(var k = 0;k < $('#bgMultiModalTable tbody tr td').length;k++){
            oldW += $('#bgMultiModalTable tbody tr td').eq(k).width();
          }
          $('.dataTables_scrollHeadInner').css('width',oldW +'px');
				});
				if (rst) {
					$("#" + sId + "_money").focus();
					$("#" + sId + "_money").select();
				}
			} else if (sId == "comeDocNum") { //来文文号
				var rst = _BgPub_Bind_InputText(this, sId + "_ComeDocNum", tbl_afterInputSummary_cellChange, tbl.cell(this).data());
				$("#" + sId + "_ComeDocNum").blur(function (e) {
					var tmpE = jQuery.Event("keyup");
					tmpE.keyCode = 13;
          $("#" + sId + "_ComeDocNum").trigger(tmpE);
          var tdWidth = $('#bgMultiModalTable tbody tr td').eq(num).width();
          $('.dataTables_scrollHeadInner thead tr th').eq(num).css('width',tdWidth+ 'px');
          var oldW = 0;
          for(var k = 0;k < $('#bgMultiModalTable tbody tr td').length;k++){
            oldW += $('#bgMultiModalTable tbody tr td').eq(k).width();
          }
          $('.dataTables_scrollHeadInner').css('width',oldW +'px');
				});
				if (rst) {
					$("#" + sId + "_ComeDocNum").focus();
					$("#" + sId + "_ComeDocNum").select();
				}
			} else if (sId == "sendDocNum") { //发文文号
				//CWYXM-12733 --经赵雪蕊确认--发文文号只控制除了（）、{}、【】、[]、下划线、短横线
				var containSpecial = RegExp(/[(\ )(\.)(\~)(\!)(\@)(\#)(\＃)(\$)(\＄)(\％)(\＾)(\＆)(\＼)(\｜)(\＂)(\＂)(\＇)(\＇)(\＜)(\＞)(\＝)(\%)(\^)(\&)(\*)(\＊)(\*)(\+)(\=)(\|)(\\)(\;)(\:)(\')(\")(\/)(\<)(\>)(\?)(\、)(\，)(\,)(\?)(\？)(\")(\")(\“)(\”)(\：)(\‘)(\’)(\|)(\@))(\#)(\￥)(\%)(\……)(\&)(\*)(\-)(\——)(\=)(\+)(\；)(\。)(\·)(\~)]+/);
				var rst = _BgPub_Bind_InputText(this, sId + "_SendDocNum", tbl_afterInputSummary_cellChange, tbl.cell(this).data());
				$("#" + sId + "_SendDocNum").blur(function (e) {
					if (containSpecial.test($(this).val())) { //替换非数字字符  
						//CZSB-796--财政社保项目，账套管理功能项存在跨站点脚本编制。<财政社保资金信息管理系统安全检测提出>--zsj
						var temp_amount = $(this).val().replaceAll(containSpecial, "");
						$(this).val(temp_amount);
					}
					var tmpE = jQuery.Event("keyup");
					tmpE.keyCode = 13;
          $("#" + sId + "_SendDocNum").trigger(tmpE);
          var tdWidth = $('#bgMultiModalTable tbody tr td').eq(num).width();
          $('.dataTables_scrollHeadInner thead tr th').eq(num).css('width',tdWidth+ 'px');
          var oldW = 0;
          for(var k = 0;k < $('#bgMultiModalTable tbody tr td').length;k++){
            oldW += $('#bgMultiModalTable tbody tr td').eq(k).width();
          }
          $('.dataTables_scrollHeadInner').css('width',oldW +'px');
				});
				if (rst) {
					$("#" + sId + "_SendDocNum").focus();
					$("#" + sId + "_SendDocNum").select();
				}
			} else if (sId == "bgItemIdMx") { //发文文号
				//CWYXM-12733 --经赵雪蕊确认--发文文号只控制除了（）、{}、【】、[]、下划线、短横线
				var containSpecial = RegExp(/[\W]|_/g);
				var rst = _BgPub_Bind_InputText(this, sId + "_SendDocNum", tbl_afterInputSummary_cellChange, tbl.cell(this).data());
				$("#" + sId + "_SendDocNum").blur(function (e) {
					if (containSpecial.test($(this).val())) { //替换非数字字符  
						//CZSB-796--财政社保项目，账套管理功能项存在跨站点脚本编制。<财政社保资金信息管理系统安全检测提出>--zsj
						var temp_amount = $(this).val().replaceAll(containSpecial, "");
						$(this).val(temp_amount);
					}
					var tmpE = jQuery.Event("keyup");
					tmpE.keyCode = 13;
          $("#" + sId + "_SendDocNum").trigger(tmpE);
          var tdWidth = $('#bgMultiModalTable tbody tr td').eq(num).width();
          $('.dataTables_scrollHeadInner thead tr th').eq(num).css('width',tdWidth+ 'px');
          var oldW = 0;
          for(var k = 0;k < $('#bgMultiModalTable tbody tr td').length;k++){
            oldW += $('#bgMultiModalTable tbody tr td').eq(k).width();
          }
          $('.dataTables_scrollHeadInner').css('width',oldW +'px');
				});
				if (rst) {
					$("#" + sId + "_SendDocNum").focus();
					$("#" + sId + "_SendDocNum").select();
				}
			} else if (sId == "bgItemSummary") { //指标摘要
				var rst = _BgPub_Bind_InputText(this, sId + "_summary", tbl_afterInputSummary_cellChange, tbl.cell(this).data());
				$("#" + sId + "_summary").blur(function (e) {
					var tmpE = jQuery.Event("keyup");
					tmpE.keyCode = 13;
          $("#" + sId + "_summary").trigger(tmpE);
          var tdWidth = $('#bgMultiModalTable tbody tr td').eq(num).width();
          $('.dataTables_scrollHeadInner thead tr th').eq(num).css('width',tdWidth+ 'px');
          var oldW = 0;
          for(var k = 0;k < $('#bgMultiModalTable tbody tr td').length;k++){
            oldW += $('#bgMultiModalTable tbody tr td').eq(k).width();
          }
          $('.dataTables_scrollHeadInner').css('width',oldW +'px');
				});
				//CWYXM-10737 --指标编制-摘要列，指标调整、调剂-备注列前台应限制长度，目前未限制保存报错--zsj
				$("#" + sId + "_summary").attr('maxlength', 100);
				if (rst) {
					$("#" + sId + "_summary").focus();
					$("#" + sId + "_summary").select();
				}
			} else {
				var subArr = [];
				page.needYsxm = false;
				page.needXmlx = false;
				for (var j = 0; j < modal_curBgPlan.planVo_Items.length; j++) {
					var code = modal_curBgPlan.planVo_Items[j].eleCode;
					subArr.push(code);
				}
				for (var iIndex = 0; iIndex < modal_curBgPlan.planVo_Items.length; iIndex++) {
          var itemObj = modal_curBgPlan.planVo_Items[iIndex];
          if (itemObj.eleCode != "ISUPBUDGET") {
            var sTblTitleField = _BgPub_getEleDataFieldNameByCode(itemObj.eleCode, itemObj.eleFieldName);
            if (sTblTitleField == sId) {
              //先清空cell里面的值
              var tmpDivId = "multiModalCellTree",
                tmpDiv = "<div id='" + tmpDivId + "' style='height:28px'></div>",
                tmpFullName = tbl.cell(this).data();
              tbl.cell(this).data('');
              $(this).html(tmpDiv);
              $(this).attr("lastVal", tmpFullName);
              var billStatus = '1'; //新增
              if (!$.isNull(tmpFullName)) {
                billStatus = '0'; //编辑
              }
              //CWYXM-12571--指标编制-当预算方案里有部门这个要素，指标编制时，选择部门会提示没有该项目--zsj
              if ($.inArray("DEPPRO", subArr) > -1 && $.inArray("PROJECT", subArr) > -1 && sId == "projectCode") {
                page.needYsxm = true;
              }
              if ($.inArray("PROTYPE", subArr) > -1 && $.inArray("PROJECT", subArr) > -1 && sId == "projectCode") {
                page.needXmlx = true;
              }
              modalCellTree = _BgPub_Bind_EleComboBox_Single("#" + tmpDivId, itemObj.eleCode, itemObj.eleName, itemObj.eleLevel,
                tbl_afterCbbSelect_cellChange, agencyCode, null, null, billStatus);
              $("#" + modalCellTree.setting.id).css("width", "250px");
              $("#" + modalCellTree.setting.id + " input[type='text']").removeAttr("readonly");
              if (!$.isNull(tmpFullName)) { //再点击时不清空已选要素  guohx
                var code = tmpFullName.substring(0, tmpFullName.indexOf(" "));
                $("#" + modalCellTree.setting.id).ufmaTreecombox().setValue(code, tmpFullName);
              }
              break;
            }
            var tdWidth = $('#bgMultiModalTable tbody tr td').eq(num).width();
            $('.dataTables_scrollHeadInner thead tr th').eq(num).css('width',tdWidth+ 'px');
            var oldW = 0;
            for(var k = 0;k < $('#bgMultiModalTable tbody tr td').length;k++){
              oldW += $('#bgMultiModalTable tbody tr td').eq(k).width();
            }
            $('.dataTables_scrollHeadInner').css('width',oldW +'px');
          } else if (sId == "isUpBudget") { //是否采购
            var sTblTitleField = _BgPub_getEleDataFieldNameByCode("ISUPBUDGET", "是否采购");
            if (sTblTitleField == sId) {
              //先清空cell里面的值
              var tmpDivId = "multiModalCellTree",
                tmpDiv = "<div id='" + tmpDivId + "' style='height:28px'></div>",
                tmpFullName = tbl.cell(this).data();
              tbl.cell(this).data('');
              $(this).html(tmpDiv);
              $(this).attr("lastVal", tmpFullName);
              var billStatus = '1'; //新增
              if (!$.isNull(tmpFullName)) {
                billStatus = '0'; //编辑
              }
              modalCellTree = _BgPub_Bind_EleComboBox_Single("#" + tmpDivId, "ISUPBUDGET", "是否采购", '1',
                tbl_afterCbbSelect_cellChange, agencyCode, null, null, billStatus);
              $("#" + modalCellTree.setting.id).css({
                "width": "120px",
                "border": "1px solid #d9d9d9"
              });
              $("#" + modalCellTree.setting.id + " input[type='text']").removeAttr("readonly");
              if (!$.isNull(tmpFullName)) { //再点击时不清空已选要素  guohx
                var code = '';
                if (tmpFullName == '是') {
                  code = '1';
                } else if (tmpFullName == '否') {
                  code = '0';
                }
                $("#" + modalCellTree.setting.id).ufmaTreecombox().setValue(code, tmpFullName);
              }
            }
              var tdWidth = $('#bgMultiModalTable tbody tr td').eq(num).width();
              $('.dataTables_scrollHeadInner thead tr th').eq(num).css('width',tdWidth+ 'px');
              var oldW = 0;
              for(var k = 0;k < $('#bgMultiModalTable tbody tr td').length;k++){
                oldW += $('#bgMultiModalTable tbody tr td').eq(k).width();
              }
              $('.dataTables_scrollHeadInner').css('width',oldW +'px');
          }
        }
        //CWYXM-18080 编制指标时需要增加文本说明项，只录入文本，用于描述指标信息--zsj--查询条件区域
        for (var k = 0; k < modal_curBgPlan.planVo_Txts.length; k++) {
          var itemObj = modal_curBgPlan.planVo_Txts[k];
          // 文本说明项
          if (shortLineToTF(itemObj.eleCode) == sId) {
            //CWYXM-18080 编制指标时需要增加文本说明项，只录入文本，用于描述指标信息--指标要素设置--说明项区域input不走ufma.js的校验 此校验：$(this).attr('bgItem') != 'bgItemInput' --zsj
            var containSpecial = RegExp(/[(\~)(\!)(\#)(\$)(\%)(\^)(\&)(\*)(\+)(\=)(\[)(\])(\{)(\})(\|)(\\)(\;)(\:)(\')(\")(\/)(\<)(\>)(\?)(\)(\￥)(\……)(\！)(\`)(\·)(\【)(\】)(\‘)(\、)(\；)(\，)(\。)(\；)(\‘)(\,)(\@)(\「)(\」)(\：)(\”)(\“)(\《)(\》)(\？)]+/);
            var rst = _BgPub_Bind_InputText(this, sId + "_TextDes", tbl_afterInputSummary_cellChange, tbl.cell(this).data());
            $("#" + sId + "_TextDes").blur(function (e) {
              if (containSpecial.test($(this).val())) {
                var temp_amount = $(this).val().replaceAll(containSpecial, "");
                $(this).val(temp_amount);
              }
              var tmpE = jQuery.Event("keyup");
              tmpE.keyCode = 13;
              $("#" + sId + "_TextDes").trigger(tmpE);
              var tdWidth = $('#bgMultiModalTable tbody tr td').eq(num).width();
              $('.dataTables_scrollHeadInner thead tr th').eq(num).css('width',tdWidth+ 'px');
              var oldW = 0;
              for(var k = 0;k < $('#bgMultiModalTable tbody tr td').length;k++){
                oldW += $('#bgMultiModalTable tbody tr td').eq(k).width();
              }
              $('.dataTables_scrollHeadInner').css('width',oldW +'px');
            });
            if (rst) {
              $("#" + sId + "_TextDes").focus();
              $("#" + sId + "_TextDes").select();
            }
          }
        }
			}
		});
		/*	$(document).on("blur", "#" + modalTblId + ' td:not(.UnEdit)', function() {
				modalTbl_clearCbbCell();
			})*/

		$(document).off("click", "#" + modalTblId + ' td a.btn-delete').on("click", "#" + modalTblId + ' td a.btn-delete', function () {
			var $row = $(this).closest("tr");
			var bgItemId = modal_tableObj.row($row).data().bgItemId;
			delModelData([bgItemId], $(this).closest("tr"));
		});
	};
	//添加 修改要素的下拉不能输入 组织冒泡到TD 
	$(document).on('click', '#multiModalCellTree', function (e) {
		stopPropagation(e)
	})
	/**
	 * 获得 浮层 表格的数据。
	 * @return {[type]} 新增：返回[]  查看：返回具体的数据
	 */
	// var getModalTableData = function () {
	// 	return modalCurBgBill.items;
	// };

	/**
	 * 根据预算方案重画浮层表格。
	 * @param  {[type]} planData [description]
	 * @return {[type]}          [description]
	 */
	// var repaintModalTableByBgPlan = function (planData) {
  //   //CWYXM-18216 --已经有记忆列的预算方案重新修改辅助项时(在预算方案里增减辅助项)，界面显示不同步--zsj
  //   if (!planData.needSendDocNum) {
  //     planData.needSendDocNum = page.sendCloName
  //   }
	// 	var bgPlanEle = _BgPub_GetBgPlanEle(planData);
	// 	if (bgPlanEle == null) {
	// 		return;
	// 	}
	// 	var nullData = getModalTableData() || [];
	// 	//已审核状态的单子不能编辑
	// 	if (modalCurBgBill.status == "3") {
	// 		//指标编码、摘要、要素..、金额、操作（删除）
	// 		var tblCols = [{
	// 				data: "bgItemCode",
	// 				title: "指标编码",
	// 				className: "UnEdit nowrap BGasscodeClass",
	// 				//width: "180px",
	// 				"render": function (data, type, rowdata, meta) {
	// 					if (!$.isNull(data)) {
	// 						return '<span title="' + data + '">' + data + '</span>';
	// 					} else {
	// 						return '';
	// 					}
	// 				}
	// 			},
	// 			{
	// 				data: "bgItemSummary",
	// 				title: '摘要',
	// 				//width: "250px",
	// 				className: "UnEdit BGTenLen nowrap",
	// 				"render": function (data, type, rowdata, meta) {
	// 					if (!$.isNull(data)) {
	// 						return '<span title="' + data + '">' + data + '</span>';
	// 					} else {
	// 						return '';
	// 					}
	// 				}
	// 			}
	// 		];
	// 		if (currentplanData.isComeDocNum == "是") {
	// 			tblCols.push({
	// 				data: "comeDocNum",
	// 				title: "来文文号",
	// 				className: "print UnEdit BGThirtyLen nowrap",
	// 				//width: "250px",
	// 				"render": function (data, type, rowdata, meta) {
	// 					if (!$.isNull(data)) {
	// 						return '<span title="' + data + '">' + data + '</span>';
	// 					} else {
	// 						return '';
	// 					}
	// 				}
	// 			});
	// 		}
	// 		if (currentplanData.isSendDocNum == "是") {
	// 			tblCols.push({
	// 				data: "sendDocNum",
	// 				title: page.sendCloName,
	// 				className: "nowrap print UnEdit BGThirtyLen",
	// 				//width: "250px",
	// 				"render": function (data, type, rowdata, meta) {
	// 					if (!$.isNull(data)) {
	// 						return '<span title="' + data + '">' + data + '</span>';
	// 					} else {
	// 						return '';
	// 					}
	// 				}
	// 			});
  //     }
  //     //CWYXM-17554 预算方案设置中，增加财政指标ID属性，可选择是否启用，启用时，选择预算方案新增指标时，需要录入指标id，指标id也需要参与指标的要素唯一性校验--zsj
  //     if (currentplanData.isFinancialBudget == "1") {
	// 			tblCols.push({
	// 				data: "bgItemIdMx",
	// 				title: '财政指标ID',
	// 				className: "nowrap print UnEdit BGThirtyLen",
	// 				//width: "250px",
	// 				"render": function (data, type, rowdata, meta) {
	// 					if (!$.isNull(data)) {
	// 						return '<span title="' + data + '">' + data + '</span>';
	// 					} else {
	// 						return '';
	// 					}
	// 				}
	// 			});
	// 		}
	// 		for (var i = 0; i < bgPlanEle.eleCodeArr.length; i++) {
	// 			if (bgPlanEle.eleCodeArr[i] == 'ISUPBUDGET') {
	// 				tblCols.push({
	// 					data: _BgPub_getEleDataFieldNameByCode('ISUPBUDGET', "是否采购"),
	// 					title: "是否采购",
	// 					// width: "120px",
	// 					className: "UnEdit nowrap tc",
	// 					"render": function (data, type, rowdata, meta) {
	// 						if (!$.isNull(data)) {
	// 							if (data == '1') {
	// 								data = '是'
	// 								return data;
	// 							} else if (data == '0') {
	// 								data = '否';
	// 								return data;
	// 							} else {
	// 								return data
	// 							}
	// 						} else {
	// 							return '';
	// 						}
	// 					}
	// 				});
	// 			} else {
	// 				var tmpCol = {
	// 					data: _BgPub_getEleDataFieldNameByCode(bgPlanEle.eleCodeArr[i], bgPlanEle.eleFieldName[i]),
	// 					title: bgPlanEle.eleNameArr[i],
	// 					//width: "250px",
	// 					className: "UnEdit BGThirtyLen nowrap",
	// 					"render": function (data, type, rowdata, meta) {
	// 						if (!$.isNull(data)) {
	// 							return '<span title="' + data + '">' + data + '</span>';
	// 						} else {
	// 							return '';
	// 						}
	// 					}
	// 				};
	// 				tblCols.push(tmpCol);
	// 			}
  //     }
  //     //CWYXM-18080 编制指标时需要增加文本说明项，只录入文本，用于描述指标信息--zsj--查询条件区域
  //     for (var k = 0; k < planData.planVo_Txts.length; k++) {
  //       var code = shortLineToTF(planData.planVo_Txts[k].eleFieldName)
  //       tblCols.push({
  //         data: code,
  //         title: planData.planVo_Txts[k].eleName,
  //         className: "nowrap print BGThirtyLen",
  //         //width: "250px",
  //         "render": function (data, type, rowdata, meta) {
  //           if (!$.isNull(data)) {
  //             return '<span title="' + data + '">' + data + '</span>';
  //           } else {
  //             return '';
  //           }
  //         }
  //       });
  //     }
	// 		tblCols.push({
	// 			data: "bgItemCur",
	// 			title: "金额",
	// 			//width: "180px",
	// 			className: "bgPubMoneyCol tr UnEdit nowrap BGmoneyClass",
	// 			render: $.fn.dataTable.render.number(',', '.', 2, '')
	// 		});
	// 	} else {
	// 		//指标编码、摘要、要素..、金额、操作（删除）
	// 		var tblCols = [{
	// 				data: "bgItemCode",
	// 				title: "指标编码",
	// 				className: "UnEdit nowrap BGasscodeClass",
	// 				width: "120px",
	// 				"render": function (data, type, rowdata, meta) {
	// 					if (!$.isNull(data)) {
	// 						return '<span title="' + data + '">' + data + '</span>';
	// 					} else {
	// 						return '';
	// 					}
	// 				}
	// 			},
	// 			{
	// 				data: "bgItemSummary",
	// 				title: '摘要',
	// 				width: "250px",
	// 				className: "canEdit nowrap  BGThirtyLen",
	// 				"render": function (data, type, rowdata, meta) {
	// 					if (!$.isNull(data)) {
	// 						return '<span title="' + data + '"  class="canEdit BGThirtyLen">' + data + '</span>';
	// 					} else {
	// 						return '';
	// 					}
	// 				}
	// 			}
	// 		];
	// 		if (currentplanData.isComeDocNum == "是") {
	// 			tblCols.push({
	// 				data: "comeDocNum",
	// 				title: "来文文号",
	// 				className: "canEdit nowrap  BGThirtyLen",
	// 				width: "250px",
	// 				"render": function (data, type, rowdata, meta) {
	// 					if (!$.isNull(data)) {
	// 						return '<span title="' + data + '" class="canEdit BGThirtyLen">' + data + '</span>';
	// 					} else {
	// 						return '';
	// 					}
	// 				}
	// 			});
	// 		}
	// 		if (currentplanData.isSendDocNum == "是") {
	// 			tblCols.push({
	// 				data: "sendDocNum",
	// 				title: page.sendCloName,
	// 				className: "canEdit nowrap  BGThirtyLen",
	// 				width: "250px",
	// 				"render": function (data, type, rowdata, meta) {
	// 					if (!$.isNull(data)) {
	// 						return '<span title="' + data + '" class="canEdit BGThirtyLen">' + data + '</span>';
	// 					} else {
	// 						return '';
	// 					}
	// 				}
	// 			});
  //     }
  //     //CWYXM-17554 预算方案设置中，增加财政指标ID属性，可选择是否启用，启用时，选择预算方案新增指标时，需要录入指标id，指标id也需要参与指标的要素唯一性校验--zsj
  //     if (currentplanData.isFinancialBudget == "1") {
	// 			tblCols.push({
	// 				data: "bgItemIdMx",
	// 				title: '财政指标ID',
	// 				className: "canEdit nowrap  BGThirtyLen",
	// 				width: "250px",
	// 				"render": function (data, type, rowdata, meta) {
	// 					if (!$.isNull(data)) {
	// 						return '<span title="' + data + '" class="canEdit BGThirtyLen">' + data + '</span>';
	// 					} else {
	// 						return '';
	// 					}
	// 				}
	// 			});
	// 		}
	// 		for (var i = 0; i < bgPlanEle.eleCodeArr.length; i++) {
	// 			if (bgPlanEle.eleCodeArr[i] == 'ISUPBUDGET') {
	// 				tblCols.push({
	// 					data: _BgPub_getEleDataFieldNameByCode('ISUPBUDGET', "是否采购"),
	// 					title: "是否采购",
	// 					width: "120px",
	// 					className: "canEdit nowrap tc",
	// 					"render": function (data, type, rowdata, meta) {
	// 						if (!$.isNull(data)) {
	// 							if (data == '1') {
	// 								data = '是'
	// 								return data;
	// 							} else if (data == '0') {
	// 								data = '否';
	// 								return data;
	// 							} else {
	// 								return data
	// 							}
	// 						} else {
	// 							return '';
	// 						}
	// 					}
	// 				});
	// 			} else {
	// 				var tmpCol = {
	// 					data: _BgPub_getEleDataFieldNameByCode(bgPlanEle.eleCodeArr[i], bgPlanEle.eleFieldName[i]),
	// 					title: bgPlanEle.eleNameArr[i],
	// 					width: "250px",
	// 					className: "canEdit " + bgPlanEle.eleCodeArr[i] + "  BGThirtyLen  nowrap",
	// 					"render": function (data, type, rowdata, meta) {
	// 						if (!$.isNull(data)) {
	// 							return '<span title="' + data + '" class="canEdit BGThirtyLen" >' + data + '</span>';
	// 						} else {
	// 							return '';
	// 						}
	// 					}
	// 				};
	// 				tblCols.push(tmpCol);
	// 			}
  //     }
  //     //CWYXM-18080 编制指标时需要增加文本说明项，只录入文本，用于描述指标信息--zsj--查询条件区域
  //     for (var k = 0; k < planData.planVo_Txts.length; k++) {
  //       var code = shortLineToTF(planData.planVo_Txts[k].eleFieldName)
  //       tblCols.push({
  //         data: code,
  //         title: planData.planVo_Txts[k].eleName,
  //         className: "nowrap print BGThirtyLen",
  //         width: "250px",
  //         "render": function (data, type, rowdata, meta) {
  //           if (!$.isNull(data)) {
  //             return '<span title="' + data + '">' + data + '</span>';
  //           } else {
  //             return '';
  //           }
  //         }
  //       });
  //     }
	// 		tblCols.push({
	// 			data: "bgItemCur",
	// 			title: "金额",
	// 			width: "180px",
	// 			className: "bgPubMoneyCol tr canEdit nowrap BGmoneyClass",
	// 			render: $.fn.dataTable.render.number(',', '.', 2, '')
	// 		});
	// 	}

	// 	tblCols.push({
	// 		data: "",
	// 		title: "操作",
	// 		className: "UnEdit tc nowrap",
	// 		width: "80px"
	// 	});
	// 	//CWYXM-14548--指标编制 - 如果要素不填保存在弹出框的提示是导入结果--zsj
	// 	page.useColumn = [{
	// 		data: "desc",
	// 		title: "保存结果",
	// 		className: "nowrap BGThirtyLen",
	// 		// width: "250px",
	// 		"render": function (data, type, rowdata, meta) {
	// 			if (!$.isNull(data)) {
	// 				return '<span title="' + data + '">' + data + '</span>';
	// 			} else {
	// 				return '';
	// 			}
	// 		}
	// 	}];
	// 	for (var k = 0; k < tblCols.length - 1; k++) {
	// 		page.useColumn.push(tblCols[k])
	// 	}
	// 	//ZJGA820-1459【指标管理】指标编制新增导入指标，在除金额不同其他要素相同时，还要提示一列计算金额的差额。---导入失败时，做个金额比较吧，单独一列显示差额
	// 	page.useColumn.push({
	// 		data: "diffCur",
	// 		title: "差额",
	// 		// width: "180px",
	// 		className: "bgPubMoneyCol tr nowrap BGmoneyClass",
	// 		render: $.fn.dataTable.render.number(',', '.', 2, '')
	// 	})
	// 	var colDefObjs = [{
	// 		"targets": [-1],
	// 		"serchable": false,
	// 		"orderable": false,
	// 		"render": function (data, type, rowdata, meta) {
	// 			if (rowdata.status == "1") { //未审核
	// 				return '<a class=" btn-delete btn  btn-icon-only btn-sm" data-toggle="tooltip" action= "del" ' +
	// 					'bg_item_id="' + rowdata.bgItemId + '" title="删除">' +
	// 					'<span class="glyphicon icon-trash delSpan"></span></a>';
	// 			} else {
	// 				return '<a class=" btn-delete btn disabled btn-icon-only btn-sm" data-toggle="tooltip" action= "del" ' +
	// 					'bg_item_id="' + rowdata.bgItemId + '" title="删除">' +
	// 					'<span class="glyphicon icon-trash delSpan"></span></a>';
	// 			}
	// 		}
	// 	}];
	// 	var sScrollY = ($("#bg-multiModal-content").outerHeight(true) - $("#bg-multiModal-content-top").outerHeight(true) - 90) + "px";
	// 	var option = {
	// 		"data": nullData,
	// 		"columns": tblCols,
	// 		"columnDefs": colDefObjs,
	// 		"ordering": false,
	// 		"lengthChange": false,
	// 		"paging": false,
	// 		"bFilter": false, // 去掉搜索框
	// 		"processing": true, // 显示正在加载中
	// 		"bInfo": false, // 页脚信息
	// 		"bSort": false, // 排序功能
	// 		"autoWidth": true, //配合列宽，注意，TRUE的时候是关闭自动列宽，坑死了
	// 		"scrollX": true,
	// 		"scrollY": sScrollY,
	// 		"select": true,
	// 		"bDestroy": true,
	// 		"dom": 'rt',
	// 		"drawCallback": function (settings, json) {

	// 		},
	// 		initComplete: function (settings, json) {

	// 		}
	// 	};

	// 	if (modal_tableObj != null) {
	// 		modal_tableObj.destroy();
	// 		$("#" + modalTblId).empty();
	// 	}
	// 	modal_tableObj = $("#" + modalTblId).DataTable(option);
	// 	_BgPub_ReSetDataTable_AfterPaint(modalTblId);
	// 	bindListenerToModalTable();

	// 	if (nullData.length == 0) {
	// 		$("#btn-newRow").trigger("click");
	// 	}
	// 	setTimeout(function () {
	// 		catchTblData = $.extend(true, [], $("#" + modalTblId).dataTable().fnGetData());
	// 	}, 300);

	// 	ufma.isShow(reslist);
	// };
  var initSearchPnl = function () {
    var argu = {
      agencyCode: agencyCode,
      setYear: page.useYear,
      rgCode: page.pfData.svRgCode
    }
    ufma.showloading('数据加载中，请耐心等待...');
    ufma.get('/bg/sysdata/getBgPlanArray', argu, function (result) {
      $('#bg-multiModal-bgPlan').ufCombox({ //初始化
        idField: "chrId",
        textField: "chrName",
        data: result.data, //列表数据
        readOnly: false, //可选
        placeholder: "请选择预算方案",
        onChange: function (sender, data) {
          modal_curBgPlan = data;
          modal_curBgPlan.needSendDocNum = page.sendCloName
          //根据预算方案的变化加载表格
          // repaintModalTableByBgPlan(modal_curBgPlan);
          //ZJGA820-1764 --指标权限管理模块，点击新增指标界面的预算方案那里没有记忆功能，查询条件预算项目那里不支持手输模糊查询。点击弹出下拉框还挡住了部分输入框。--zsj
          page.configKey = '';
          page.configValue = '';
          page.configKey = 'bg-multiModal-bgPlan';
          var cbBgPlanId = $('#bg-multiModal-bgPlan').getObj().getValue();
          var cbBgPlanText = $('#bg-multiModal-bgPlan').getObj().getText();
          page.configValue = cbBgPlanId + ',' + cbBgPlanText;
          updateSessionPlan();
        },
        onComplete: function (sender) {
          ufma.hideloading();
          var parentId = $('#_bgPub_cbb_BgPlan_bgMoreMsgPnl').getObj().getValue();
          //ZJGA820-1764 --指标权限管理模块，点击新增指标界面的预算方案那里没有记忆功能，查询条件预算项目那里不支持手输模糊查询。点击弹出下拉框还挡住了部分输入框。--zsj
          if (!$.isNull(parentId)) {
            $('#bg-multiModal-bgPlan').getObj().val(parentId);
          } else {
            if (result.data.length > 0) {
            $('#bg-multiModal-bgPlan').getObj().val(result.data[0].chrId);
            }
          }
          if (openType == 'edit') {
            $('#bg-multiModal-bgPlan #bg-multiModal-bgPlan_btn').addClass('hide')
          } else {
            $('#bg-multiModal-bgPlan #bg-multiModal-bgPlan_btn').removeClass('hide')
          }
        }
      });
    });
  };
  //ZJGA820-1764 --指标权限管理模块，点击新增指标界面的预算方案那里没有记忆功能，查询条件预算项目那里不支持手输模糊查询。点击弹出下拉框还挡住了部分输入框。--zsj
  var selectSessionData = function () {
    var argu = {
      agencyCode: agencyCode,
      acctCode: '*',
      menuId: menuId
    }
    ufma.ajaxDef('/pub/user/menu/config/select','get', argu, function (result) {
      page.sessionPlanData = result.data;
    });
  };
	/**
	 * 根据传入的bill数据加载浮层
	 * @return {[type]} [description]
	 */
	var doLoadModalWithData = function (billData) {
		//1, 初始化各种数据
		addModal = null; //新增模态框的对象
		modal_curBgPlan = null; //浮层的预算方案
		modal_billDate = null;
		modalCellTree = null;
		modalCurBgBill = billData;
		modal_billAttachment = [];
		modalCurBgBill.billType = billType;
		$("#btn-multiModal-fileCountInput").val("0");
		if (modal_tableObj != null) {
			modal_tableObj.destroy();
			$("#" + modalTblId).empty();
			modal_tableObj = null;
		}
		//2, 绑定浮层的预算方案
    var cbBgPlanIdMain = '';
    var planSelectId = '';
		// var tmpBgPlanTree = _BgPub_Bind_ComboBox_BgPlanList("bg-multiModal-bgPlan", agencyCode, menuId, acctCode, bgPlanCacheId, openType, cbBgPlanIdMain, function (data) { //CWYXM-10166 指标编制、指标控制管理界面记忆预算方案--新增需求记忆预算方案--传给bgPub.js的数据--zsj
		// 	if (catchTblData) {
		// 		var tmpTblDt = $("#" + modalTblId).dataTable().fnGetData();
		// 		if (!$.equalsArray(catchTblData, tmpTblDt)) {
		// 			ufma.confirm('指标信息已修改，是否切换预算方案？', function (ac) {
		// 				if (ac) {
		// 					if (modal_curBgPlan != null && modal_curBgPlan.chrId == data.chrId) {
		// 						return;
		// 					}
		// 					modal_curBgPlan = data;
		// 					$('#_bgPub_cbb_BgPlan_bgMoreMsgPnl').getObj().getValue()
		// 					//根据预算方案的变化加载表格
		// 					repaintModalTableByBgPlan(modal_curBgPlan);
		// 				} else {
		// 					$("#bg-multiModal-bgPlan").getObj().setValue(modal_curBgPlan.chrId, modal_curBgPlan.chrName, false);
		// 				}
		// 			}, {
		// 				'type': 'warning'
		// 			});
		// 			return false;
		// 		};

		// 	}
		// 	if (modal_curBgPlan != null && modal_curBgPlan.chrId == data.chrId) {
		// 		return;
		// 	}
    //   modal_curBgPlan = data;
    //   modal_curBgPlan.needSendDocNum = page.sendCloName
    //   //根据预算方案的变化加载表格
		// 	repaintModalTableByBgPlan(modal_curBgPlan);
		// }, null, $('#'+planSelectId).getObj().getValue());
		//3，绑定浮层的顶部时间
		// modal_billDate = _BgPub_dateTimePicker("bg_multiModal_dtp");
		//4, 加载浮层顶部的单据号
		$("#multiModal_billCode").val(billData.billCode);
		$("#multiModal_billCode").attr("data", billData);
		$("#multiModal_billCode").attr("billId", billData.billId);
    addModal = ufma.showModal("budgetItemMultiPost-add", 1090);

		//5, 重新计算content的高度。自动计算的不对

		/*	var modalMinHeight = $("#" + tblId).closest("body").outerHeight(true) - 20;
			$(".u-msg-dialog").css("min-height", modalMinHeight + "px");
			var contentHeight = modalMinHeight - addModal.modal.find('.u-msg-title').outerHeight(true);
			addModal.modal.find('.u-msg-footer').each(function(ele) {
				contentHeight = contentHeight - $(this).outerHeight(true);
			});
			addModal.msgContent.css('height', contentHeight + 'px');*/

		//6, 显示加载的遮罩层，如果不是新增方案，需要显示已有的指标到表格中
		//if(!$.isNull(tmpBgPlanTree)) {
		//	if(!$.isNull(tmpBgPlanTree.setting.tree) && tmpBgPlanTree.setting.tree.getNodes().length > 0) {
		if (billData.isNew == "否" && billData.items.length > 0) {
			modalCurBgBill.latestOpUserName = _bgPub_getUserMsg().userName;
			modalCurBgBill.latestOpUser = _bgPub_getUserMsg().userCode;
			modalCurBgBill.latestOpDate = page.pfData.svSysDate;
			// 1,根据带的数据查找对应的预算方案
			//var tmpBgPlanId = billData.items[0].bgPlanId;
			// modal_billDate.setValue(billData.items[0].createDate);
			/*for(var i = 0; i < tmpBgPlanTree.setting.tree.getNodes().length; i++) {
				var tmpNode = tmpBgPlanTree.setting.tree.getNodes()[i];
				if(tmpNode.chrId == tmpBgPlanId) {
					tmpBgPlanTree.select(i + 1);
					// ufma.hideloading();
					break;
				}
			}*/
			// 2,加载单据的附件信息  getURL(0) + "/bg/attach/getAttach"   //17，附件查找
			var tmpRst = _bgPub_GetAttachment({
				"billId": billData.billId,
				"agencyCode": agencyCode
			});
			if (!$.isNull(tmpRst.data.bgAttach)) {
				for (var m = 0; m < tmpRst.data.bgAttach.length; m++) {
					modal_billAttachment[modal_billAttachment.length] = {
						"filename": tmpRst.data.bgAttach[m].fileName,
						"filesize": 0,
						"fileid": tmpRst.data.bgAttach[m].attachId
					};
				}
				//$("#btn-multiModal-fileCountInput").val(modal_billAttachment.length + "");
			}
			$("#btn-multiModal-fileCountInput").val(pageAttachNum + ""); //bug77471--zsj
			//3, 已审核单据进入，不能 修改\导入\新增行 功能。-----此处需求未明确，后续维护人员可与需求经理核实后进行补充开发
			if (modalCurBgBill.status == "3") {
				$("#btn-modal-imp").hide();
				$("#btn-modal-saveAndNew").hide();
				$("#btn-modal-save").hide();
				$("#btn-newRow").hide();
				$("#budgetItemMultiPost-add .u-msg-title h4").text("指标查看-[已审核]");
				//已审核的单子不允许修改附件数或者上传附件
				$('#btn-multiModal-fileCountInput').attr('disabled', true);
			} else {
				$("#btn-modal-imp").show();
				$("#btn-modal-saveAndNew").show();
				$("#btn-modal-save").show();
				$("#btn-newRow").show();
				$("#budgetItemMultiPost-add .u-msg-title h4").text("指标查看-[未审核]");
				//未审核的单子允许修改附件数或者上传附件
				$('#btn-multiModal-fileCountInput').attr('disabled', false);
			}
			//修改  编辑界面不可修改单据日期  guohx
			$("#bg-multiModal-bgPlan").getObj().setEnabled(false);
      $("#bg-multiModal-bgPlan input").attr("disabled", "disabled");
      $('#bg-multiModal-bgPlan #bg-multiModal-bgPlan_btn').addClass('hide');
			$("#bg_multiModal_dtp input").attr("disabled", "disabled");
			$("#bg_multiModal_dtp span").hide();
			$("#bg_multiModal_dtp").css("background", "#eee");
			$("#bg_multiModal_dtp").getObj().setValue(billData.billDate);
			// 4,取消遮罩层
			ufma.hideloading();
		} else {
			$("#btn-modal-imp").show();
			$("#btn-modal-saveAndNew").show();
			$("#btn-modal-save").show();
			$("#btn-newRow").show();
      $("#budgetItemMultiPost-add .u-msg-title h4").text("新增指标编制");
      //ZJGA820-1670---指标编制点击新增单据日期默认是2020年1月1日，需要改为登陆日期。经雪蕊、侯总确定改为当前登录日期--zsj
			$("#bg_multiModal_dtp").getObj().setValue(page.pfData.svTransDate);
			//$('#bg_multiModal_dtp').getObj().setValue(page.Year + '-01-01');
			$("#bg_multiModal_dtp input").attr("disabled", false);
			$("#bg_multiModal_dtp span").show();
			$("#bg_multiModal_dtp").css("background", "#ffffff");
			$("#bg-multiModal-bgPlan").getObj().setEnabled(true);
      $("#bg-multiModal-bgPlan input").attr("disabled", false);
      $('#bg-multiModal-bgPlan #bg-multiModal-bgPlan_btn').removeClass('hide')
			modalCurBgBill.items = [];
		}
	};
	//CWYXM-10166 指标编制、指标控制管理界面记忆预算方案--新增需求记忆预算方案--更新已经记忆的数据--zsj
	var updateSessionPlan = function () {
		var argu = {
			acctCode: acctCode,
			agencyCode: agencyCode,
			configKey: page.configKey,
			configValue: page.configValue,
			menuId: menuId
		}
		ufma.post('/pub/user/menu/config/update', argu, function (reslut) {});
	};
	// var saveItems = function (isAdd) {
	// 	var tmpTblDt = $("#" + modalTblId).DataTable().data();
	// 	modalCurBgBill.items = [];
	// 	var billCur = 0;
	// 	var sendCount = 0; //CWYXM-12690--根据系统选项判断发文文号是否必填，若必填则将列名“发文文号”改完指标id--zsj
  //   var isUpBudgetCount = 0; //CWYXM-12743--与雪蕊姐沟通后确认：是否采购项为必填 --zsj
  //   var bgItemIdMxCount = 0; //CWYXM-17554 预算方案设置中，增加财政指标ID属性，可选择是否启用，启用时，选择预算方案新增指标时，需要录入指标id，指标id也需要参与指标的要素唯一性校验--zsj 
	// 	var hasIsUpBudget = false;
	// 	if ($.inArray("ISUPBUDGET", curBgPlanEleMsg.eleCodeArr) > -1) {
	// 		hasIsUpBudget = true;
	// 	}
	// 	for (var i = 0; i < tmpTblDt.length; i++) {
	// 		var rowDt = tmpTblDt[i];
	// 		//CWYXM-12690--根据系统选项判断发文文号是否必填，若必填则将列名“发文文号”改完指标id--zsj
	// 		if ($.isNull(rowDt.sendDocNum)) {
	// 			sendCount++;
	// 		}
	// 		//CWYXM-12743--与雪蕊姐沟通后确认：是否采购项为必填 --zsj
	// 		if ($.isNull(rowDt.isUpBudget) && hasIsUpBudget == true) {
	// 			isUpBudgetCount++;
	// 		} else {
	// 			if (rowDt.isUpBudget == '是') {
	// 				rowDt.isUpBudget = '1';
	// 			} else if (rowDt.isUpBudget == '否') {
	// 				rowDt.isUpBudget = '0';
	// 			}
  //           }
  //           //CWYXM-17554 预算方案设置中，增加财政指标ID属性，可选择是否启用，启用时，选择预算方案新增指标时，需要录入指标id，指标id也需要参与指标的要素唯一性校验--zsj
	// 		if ($.isNull(rowDt.bgItemIdMx)) {
	// 			bgItemIdMxCount++;
	// 		}
	// 		if (!$.isNull(rowDt.isDeleted) && rowDt.isDeleted == 1) {
	// 			continue;
	// 		}
	// 		rowDt.createUser = _bgPub_getUserMsg().userCode;
	// 		rowDt.createUserName = _bgPub_getUserMsg().userName;
	// 		modalCurBgBill.items[modalCurBgBill.items.length] = rowDt;
	// 		billCur = billCur + parseFloat(rowDt.bgItemCur);
	// 	}
	// 	modalCurBgBill.billCur = billCur == "null" ? "" : billCur;
	// 	modalCurBgBill.setYear = page.useYear;
	// 	//bugCWYXM-4281--新增指标编制，单据日期应为当前登录所选日期，目前为1月1日，保存后自动变更为当前日期
	// 	modalCurBgBill.billDate = $('#bg_multiModal_dtp').getObj().getValue(); //_bgPub_getUserMsg().busDate;
	// 	modalCurBgBill.createUser = _bgPub_getUserMsg().userCode;
	// 	modalCurBgBill.createUserName = _bgPub_getUserMsg().userName;
	// 	modalCurBgBill.bgPlanId = $('#bg-multiModal-bgPlan').getObj().getValue(); //加上预算方案ss
	// 	//bug77471--zsj
	// 	if ($("#btn-multiModal-fileCountInput").val() < fileLeng) {
	// 		ufma.showTip('输入附件数不能小于已上传附件数！', function () {}, 'warning');
	// 		return false;
	// 	}
	// 	//CWYXM-12690--根据系统选项判断发文文号是否必填，若必填则将列名“发文文号”改完指标id--zsj
	// 	if (currentplanData.isSendDocNum == "是" && sendCount > 0 && page.needSendDocNum == true) {
	// 		ufma.showTip('请输入' + page.sendCloName, function () {}, 'warning');
	// 		return false;
	// 	}
	// 	//CWYXM-12743--与雪蕊姐沟通后确认：是否采购项为必填 --zsj
	// 	if (isUpBudgetCount > 0) {
	// 		ufma.showTip('请选择是否采购！', function () {}, 'warning');
	// 		return false;
  //     }
  //       //CWYXM-17554 预算方案设置中，增加财政指标ID属性，可选择是否启用，启用时，选择预算方案新增指标时，需要录入指标id，指标id也需要参与指标的要素唯一性校验--zsj
  //     if(currentplanData.isFinancialBudget == "1" && bgItemIdMxCount > 0) {
  //       ufma.showTip('请输入财政指标ID！', function () {}, 'warning');
  //       return false;    
  //     }
	// 	modalCurBgBill.attachNum = $("#btn-multiModal-fileCountInput").val(); //bug77471--zsj
	// 	page.configKey = '';
	// 	page.configValue = '';
	// 	page.configKey = 'bg-multiModal-bgPlan';
	// 	var cbBgPlanId = $('#bg-multiModal-bgPlan').getObj().getValue();
	// 	var cbBgPlanText = $('#bg-multiModal-bgPlan').getObj().getText();
	// 	//ZJGA820-1346--指标管理】--【指标导入】除金额不同以外所有要素包括ID都一致的情况下，导入之后以列表的形式展示导入情况，并且显示指标所有信息，还需要支持EXCEL导出--zsj
	// 	ufma.post(
	// 		'/bg/budgetItem/multiPost/saveBudgetItemsAdd?billType=' + billType + '&agencyCode=' + agencyCode + '&setYear=' + page.useYear,
	// 		modalCurBgBill,
	// 		function (result) {
	// 			if ($.isNull(result.data)) {
	// 				//updateSessionPlan();
	// 				catchTblData = $.extend(true, [], $("#" + modalTblId).dataTable().fnGetData());
	// 				ufma.showTip("保存成功", null, "success");
	// 				if (isAdd == "false") {
	// 					addModal.close();
	// 					$('#_bgPub_cbb_BgPlan_bgMoreMsgPnl').getObj().setValue(cbBgPlanId, cbBgPlanText);
	// 				}
	// 				if (!modal_clearTableAfterSave) {
	// 					modalCurBgBill.isNew = "否";
	// 					for (var i = 0; i < tmpTblDt.length; i++) {
	// 						tmpTblDt[i].isNew = "否";
	// 						//tmpTblDt[i].shouldSave = "0";
	// 					}
	// 				} else {
	// 					modal_clearTableAfterSave = false;
	// 					setTimeout(function () {
	// 						ufma.get(_bgPub_requestUrlArray_subJs[14], {
	// 								"agencyCode": agencyCode
	// 							},
	// 							function (result) {
	// 								if (result.flag == "success") {
	// 									//1, 重绘表格
	// 									modal_billDate = null;
	// 									modalCellTree = null;
	// 									modalCurBgBill = result.data;
	// 									modalCurBgBill.billType = billType;
	// 									modalCurBgBill.items = [];
	// 									// repaintModalTableByBgPlan(modal_curBgPlan);
	// 									//2, 替换成新的方案
	// 									$("#multiModal_billCode").val(result.data.billCode);
	// 									$("#multiModal_billCode").attr("data", result.data);
	// 									$("#multiModal_billCode").attr("billId", result.data.billId);
	// 									$("#btn-multiModal-fileCountInput").val('0');
	// 									modal_billAttachment = [];
	// 								}
	// 							}
	// 						);
	// 					}, 2000); //延迟两秒后自动清空
	// 				}
	// 				setTimeout(function () {
	// 					pnlFindRst.doFindBtnClick();
	// 				}, 1000);
	// 			} else {
	// 				var openData = {};
	// 				openData.tableData = result.data.wrongList;
	// 				openData.columns = page.useColumn;
	// 				openData.msg = result.msg;
	// 				openData.modalCurBgBill = modalCurBgBill;
	// 				openData.billType = billType;
	// 				openData.agencyCode = agencyCode;
	// 				openData.setYear = page.useYear;
	// 				openData.url = result.data.expUrl;
	// 				ufma.open({
	// 					url: 'openExcel.html',
	// 					title: '保存结果预览',
	// 					width: 1000,
	// 					height: 500,
	// 					data: openData,
	// 					ondestory: function (result) {
	// 						if (result.action == 'save' && result.flag == true) {
	// 							addModal.close();
	// 							pnlFindRst.doFindBtnClick();
	// 						}
	// 					}
	// 				});

	// 				//ufma.showTip("保存失败!" + result.msg, null, "error");
	// 			}
	// 		}
	// 	);
	// };

	$(document).on('click', '.u-msg-dialog .u-msg-close', function () {
		if (!$.isNull(addModal)) {
			if (addModal.canClose) {
				//新增页面直接点“取消”按钮时请求该接口，下次点击“新增”时后端返回的指标编码不会多增加一次
				var billCode = $('#multiModal_billCode').val();
				var argu = {
					billCode: billCode,
					"agencyCode": agencyCode
				}
				//只有新增时才请求--zsj--CWYXM10681
				if (openType == 'new') {
					ufma.get('/bg/budgetItem/multiPost/backMaxsn', argu, function () {});
				}
				//	addModal.close();
			}
		}

	});
	//点击金额列
	/*$('#mainTable.bgPubMoneyCol').on('click',function(){
		$('.bgPubMoneyCol input').addClass('moneyInput');
		$('.moneyInput').amtInput();
	})*/
	$('#bgItemCur_money').on('keyup', function () {
		$('#bgItemCur_money').amtInput();
	})
	//阻止 click 事件冒泡到父元素
	function stopPropagation(e) {
		if (e.stopPropagation)
			e.stopPropagation();
		else
			e.cancelBubble = true;
	}
	//********************************************************[绑定事件]***************************************************
	/**
	 * 新增按钮，弹出模态框
	 * @param  {[type]} e [description]
	 * @return {[type]}   [description]
	 getURL(0) + "/bg/budgetItem/multiPost/newBill"  //14  新建一个单据
	 */
  var openPageFun = function(data,flag) {
    if (flag == 'add') {
      // page.selectSessionData(); //bugCWYXM-3951--新增需求记忆预算方案
      var stitle = '新增指标编制';
      ufma.open({
        url: 'multiPostOpen.html',
        title: stitle,
        width: 1200,
        height:650,
        data: {
          'agencyCode': agencyCode,
          'setYear': page.useYear,
          'action': flag,
          'billData': data,
          'planId': curBgPlanData.chrId, //CWYXM-11974 达梦库和oracle库有此问题：指标管理模块，指标分解，点击新增时没有选择预算方案前，页面样式错误--zsj
          'planData': page.planData,
          'sessionPlanData': page.sessionPlanData,
          'status': '1',
          'needSendDocNum': page.needSendDocNum //判断发文文号是否必填
        },
        ondestory: function (result) {
          //关闭弹窗界面 后主页的预算方案默认为新增时用到的方案
          if (result.ation == 'save'){
            selectSessionData();
            $('#_bgPub_cbb_BgPlan_bgMoreMsgPnl').getObj().val(page.sessionPlanData['bg-multiModal-bgPlan'])
            pnlFindRst.doFindBtnClick();
          }
        }
      });
    } else if (flag == 'edit') {
      stitle = '编辑指标编制';
      ufma.open({
        url: 'multiPostOpen.html',
        title: stitle,
        width: 1200,
        data: {
          'agencyCode': agencyCode,
          'setYear': page.useYear,
          'action': flag,
          'billData': data,
          'planId': curBgPlanData.chrId,
          'planData': curBgPlanData,
          'status': status,
          'sessionPlanData': page.sessionPlanData,
          'assiData': tblDt,
          'needSendDocNum': page.needSendDocNum //判断发文文号是否必填
        },
        ondestory: function (result) {
          // if ((result.action == 'ok') || (result.action == 'exit')) {
          //   page.setTable();
          // }
        }
      });
    }
  }
	$("#btn-add").off("click").on("click", function (e) {
    openType = 'new';
    initSearchPnl();
		page.btnAdd = true;
		fileLeng = 0;
		catchTblData = undefined;
		ufma.get(_bgPub_requestUrlArray_subJs[14], {
				"agencyCode": agencyCode,
				"setYear": page.useYear
			},
			function (result) {
				if (result.flag == "success") {
					if (!$.isNull(curBgPlanData)) {
						if (curBgPlanData.enabled == '否') {
							ufma.showTip("该预算方案已停用,不能新增指标,请重新选择!", null, "error");
							return;
						}
						result.data.bgPlanId = curBgPlanData.chrId;
					}
          // doLoadModalWithData(result.data);
         // 后期重构代码需要的弹窗
          openPageFun(result.data,'add')
				}
			}
		);
	});

	/**
	 * 打印按钮
	 */
	$("#bgMulti-printBtn").on("click", function () {
		$("." + tblPrintBtnClass).trigger("click");
	});

	/**
	 * 导出按钮
	 */
	$("#bgMulti-expBtn").on("click", function () {
		$("." + tblPrintBtnClassExpXls).trigger("click");
	});

	/**
	 * 审核、未审核、全部  [页签]  的变动
	 * @param  {[type]} e [description]
	 * @return {[type]}   [description]
	 */
	$(".nav.nav-tabs li").on("click", function (e) {
		var tmpStatus = $(this).find('a').attr("data-status"); //O=未审核  A=审核  T=全部
		if (tmpStatus == "O") {
			$("#btn-check").text("审核");
			$("#btn-check").show();
		} else if (tmpStatus == "A") {
			$("#btn-check").text("销审");
			$("#btn-check").show();
			$("#btn-del").hide();
		} else {
			$("#btn-check").hide();
		}
		$(".nav.nav-tabs li").removeClass("NAVSELECT");
		$(this).addClass("NAVSELECT");
		//清空表格
		$("#" + tblId).DataTable().clear().draw();
		pnlFindRst.doFindBtnClick(); //调用查询按钮
	});

	/**
	 * 模态框表格-新增一行[本质就是获得一条指标]
	 * 特点：手工录入 + 新增未审核 + 可执行指标
	 * @param  {[type]} e [description]
	 * @return {[type]}   [description]
	 * getURL(0) + "/bg/budgetItem/newBudgetItem", //3  新增一条指标
	 */
	$("#btn-newRow").off("click").on("click", function (e) {
		modalTbl_clearCbbCell();
		if (modal_curBgPlan == null) {
			ufma.showTip("请先选择一个预算方案", null, "warning");
			return;
		}
		ufma.get(_bgPub_requestUrlArray_subJs[3], //3  新增一条指标
			{
				"bgPlanChrId": modal_curBgPlan.chrId,
				"bgPlanChrCode": modal_curBgPlan.chrCode,
				"agencyCode": agencyCode,
				"setYear": page.useYear
			},
			function (result) {
				if (result.flag == "success") {
					//初始化一些指标数据
					result.data.status = '1'; //未审核
					result.data.dataSource = '1'; //数据来源：手工编制
					result.data.createSource = '1'; //建立来源：编制
					result.data.bgReserve = '1'; //可执行指标
					result.data.billId = modalCurBgBill.billId; //指标对应的单据ID
					//新增行时只有bgItemCode、bgItemId和上一行不一样
					var newBgItemId = result.data.bgItemId;
					var newBgItemCode = result.data.bgItemCode;
					//财务云项目CWYXM-11692 --nbsh----指标编制新增指标数据时，新增行默认带出上一行编辑的要素数据，摘要和金额不需要带入--zsj
					var oldData = $("#" + modalTblId).DataTable().data();
					var prevRowDt = oldData[oldData.length - 1];
					var tableData = $.extend(true, result.data, prevRowDt);
					tableData.bgItemId = newBgItemId;
					tableData.bgItemCode = newBgItemCode;
					tableData.bgItemCur = '';
					tableData.bgItemSummary = '';
					//CWYXM-12331 指标编制-未审核指标点击编辑新增行无反应，前端报错
					if (openType == 'new') { //新增
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
						}]

					} else {
						tableData.isUpBudget = result.data.isUpBudget; //CWYXM-12331 指标编制-未审核指标点击编辑新增行无反应，前端报错
					}

					$("#" + modalTblId).DataTable().row.add(tableData).draw();
				}
			});
	});

	/**
	 * 模态框表格-保存按钮
	 * @param  {[type]} e [description]
	 * @return {[type]}   [description]
	 */
	// $("#btn-modal-save").off("click").on("click", function (e) {
	// 	modalTbl_clearCbbCell();
	// 	saveItems("false");
	// 	page.addNew = true;
	// 	page.btnAdd = true;
	// });

	// /**
	//  * 模态框 - 文件导入  按钮
	//  * @param  {[type]} e [description]
	//  * @return {[type]}   [description]
	//  */
	// $("#btn-modal-imp").off("click").on("click", function (e) {
	// 	modalTbl_clearCbbCell();
	// 	var tmpImpModal = _ImpXlsFile("budgetItemMultiPost", "bgMultiItem", modal_curBgPlan.chrId,
	// 		function (data) {
	// 			//success
	// 			if (data.flag == "success") {
	// 				modalCurBgBill.items = data.data.items
	// 				//这里注意，需要自动切换方案。方案的信息应当来源于服务的应答
	// 				repaintModalTableByBgPlan(modal_curBgPlan);
	// 				tmpImpModal.closeModal();
	// 				ufma.showTip("导入成功", null, "success");
	// 			} else {

	// 				ufma.showTip(data.msg, function () {
	// 					$('#bgMultiItem_xlsInputModal_filePath').val('');
	// 				}, "error");
	// 			}
	// 		},
	// 		function (data) {
	// 			//failed
	// 			ufma.showTip(data, function () {
	// 				$('#bgMultiItem_xlsInputModal_filePath').val('');
	// 			}, "error");
	// 		}, {
	// 			"agencyCode": agencyCode,
	// 			"billId": $("#multiModal_billCode").attr("billId")
	// 		});
	// });

	// /**
	//  * 模态框 - 取消  按钮
	//  * @param  {[type]} e [description]
	//  * @return {[type]}   [description]
	//  */
	var closeCheck = function () {
		var tblData = $("#" + modalTblId).dataTable().fnGetData();
		var cacheData = catchTblData;
		//以下两个循环，主要解决isNew对这两个对象判断相等的干扰
		for (var i = 0; i < tblData.length; i++) {
			tblData[i].isNew = "否";
		}
		for (var i = 0; i < cacheData.length; i++) {
			cacheData[i].isNew = "否";
		}

		return $.equalsArray(cacheData, tblData);
	};
	// $("#btn-modal-close").off("click").on("click", function (e) {
	// 	modalTbl_clearCbbCell();
	// 	if (!closeCheck()) {
	// 		ufma.confirm("有未保存的数据，是否确定离开页面?", function (rst) {
	// 			if (rst) {
	// 				addModal.close();
	// 			}
	// 		}, {
	// 			'type': 'warning'
	// 		});
	// 		return false;
	// 	} else {
	// 		//新增页面直接点“取消”按钮时请求该接口，下次点击“新增”时后端返回的指标编码不会多增加一次
	// 		var billCode = $('#multiModal_billCode').val();
	// 		var argu = {
	// 			billCode: billCode,
	// 			"agencyCode": agencyCode
	// 		}
	// 		if (openType == 'new') { //只有新增时才请求--zsj--CWYXM10681 
	// 			ufma.get('/bg/budgetItem/multiPost/backMaxsn', argu, function () {});
	// 		}
	// 		addModal.close();
	// 	}
	// });
	// /**
	//  * 模态框 - 保存并新增  按钮
	//  * @param  {[type]} e [description]
	//  * @return {[type]}   [description]
	//  */
	// $("#btn-modal-saveAndNew").off("click").on("click", function (e) {
	// 	modalTbl_clearCbbCell();
	// 	fileLeng = 0;
	// 	modal_clearTableAfterSave = true;
	// 	saveItems("true");
	// 	page.add = true;
	// 	page.btnAdd = true;
	// });
	// /**
	//  * 模态框  - 附件  按钮事件绑定
	//  * @param  {[type]} e [description]
	//  * @return {[type]}   [description]
	//  */
	// $("#btn-multiModal-aboutFiles").off("click").on("click", function (e) {
	// 	var option = {
	// 		"agencyCode": agencyCode,
	// 		"billId": modalCurBgBill.billId,
	// 		"uploadURL": _bgPub_requestUrlArray_subJs[8] + "?agencyCode=" + agencyCode + "&billId=" + modalCurBgBill.billId + "&setYear=" + page.useYear,
	// 		"delURL": _bgPub_requestUrlArray_subJs[16] + "?agencyCode=" + agencyCode + "&billId=" + modalCurBgBill.billId + "&setYear=" + page.useYear,
	// 		"downloadURL": _bgPub_requestUrlArray_subJs[15] + "?agencyCode=" + agencyCode + "&billId=" + modalCurBgBill.billId + "&setYear=" + page.useYear,
	// 		"onClose": function (fileList) {
	// 			/*$("#btn-multiModal-fileCountInput").val(fileList.length + "");
	// 			modal_billAttachment = cloneObj(fileList);*/
	// 			//bug77471--zsj

	// 			fileLeng = fileList.length;
	// 			if (page.btnAdd || page.addNew) {
	// 				attachNum = fileLeng;
	// 			} else {
	// 				showTblData();
	// 				attachNum = fileList.length < pageAttachNum ? pageAttachNum : fileList.length;
	// 			}
	// 			$("#btn-multiModal-fileCountInput").val(attachNum + "");
	// 			modal_billAttachment = cloneObj(fileList);
	// 		}
	// 	};
	// 	//bugCWYXM-4284--已审核单据只能查看附件不可以删除已审核过的附件、且不能上传新的附件--zsj
	// 	_bgPub_ImpAttachment("budgetItemMultiPost", "指标单据[" + modalCurBgBill.billCode + "]附件导入", modal_billAttachment, option, modalCurBgBill.status);
	// });
	//********************************************************[界面入口函数]*****************************************************

	var page = function () {
		return {
			init: function () {
				reslist = ufma.getPermission();
				ufma.isShow(reslist);
				page.pfData = ufma.getCommonData();
				var mydate = new Date(page.pfData.svTransDate);
				page.Year = mydate.getFullYear();
				page.useYear = parseInt(page.pfData.svSetYear);
				page.rgCode = page.pfData.svRgCode;
				page.needYsxm = false;
        page.needXmlx = false;
        page.sessionPlanData = {};
				//page.manageTurnMultiPost = JSON.parse(window.sessionStorage.getItem("manageTurnMultiPost"));
				ufma.parse();
				uf.parse();
				//pnlFindRst = _PNL_MoreByBgPlan('bgMoreMsgPnl', moreMsgSetting); //加载头部更多
				_bgPub_Bind_Cbb_AgencyList("cbb_agency", { //绑定单位
					afterChange: function (treeNode) {
						//实在找不到原因，ufma-combox-popup默认不显示
						setTimeout(function () {
							$('.ufma-combox-popup').css({
								'display': 'none'
							});
						}, 100);
						curAgencyData = treeNode;
						agencyCode = treeNode.id;
						moreMsgSetting.agencyCode = treeNode.id;
						//CWYXM-10166 指标编制、指标控制管理界面记忆预算方案--新增需求记忆预算方案--传给bgPub.js的数据--zsj
						moreMsgSetting.menuId = menuId;
						moreMsgSetting.acctCode = '*';
						moreMsgSetting.bgPlanCacheId = bgPlanCacheId;
						moreMsgSetting.openType = 'new';
            moreMsgSetting.cbBgPlanIdMain = '';
            selectSessionData();
						//80827--20190630所有页面，单位或账套选择变化后，再打开其它页面时，自动显示为最近一次选择的单位或账套。--zsj
						//缓存单位
						var params = {
							selAgecncyCode: treeNode.id,
							selAgecncyName: treeNode.name
						}
						ufma.setSelectedVar(params);
						//CWYXM-12690--根据系统选项判断发文文号是否必填，若必填则将列名“发文文号”改完指标id--zsj
						var bgUrl = '/bg/sysdata/selectSysRgParaValue?rgCode=' + page.rgCode + '&setYear=' + page.useYear + '&agencyCode=' + treeNode.id + '&chrCode=BG003'
						ufma.ajaxDef(bgUrl,'get', {}, function (result) {
							page.needSendDocNum = result.data;
							//CWYXM-12690--根据系统选项判断发文文号是否必填，若必填则将列名“发文文号”改完指标id--zsj
							if (page.needSendDocNum == true) {
								page.sendCloName = "指标id";
							} else {
								page.sendCloName = "发文文号";
							}
            });
            moreMsgSetting.needSendDocNum = page.sendCloName;
						pnlFindRst = _PNL_MoreByBgPlan('bgMoreMsgPnl', moreMsgSetting); //根据单位的变化重新加载头部更多
					}
				});
				$.fn.dataTable.ext.errMode = 'none';
			}
		};
	}();

	page.init();

});