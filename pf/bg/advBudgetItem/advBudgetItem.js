$(function() {
	var lastPlan = null;
	var curPlan = null;
	var pnlFindRst = null;
	var tblDt = null; //指标数据
	var tblId = "mainTable_advBudgetItem";
	var tblObj = null;
	var tblCellTree = null;
	var modal_Obj = null; //模态框的对象
	var modalTblId = "bgAdvModalTable";
	var modal_tableObj = null;
	var modalCellTree = null;
	var modal_clearTableAfterSave = false; //保存后清空表格
	var tblPrintBtnClass = "mainTable-advbudgetitem-printBtn";
	var tblPrintBtnClassExpXls = "mainTable-advbudgetitem-expXlsBtn";
	var bgItemReserve_yb = 1; //1：预拨指标；2：批复指标
	var bgItemReserve_pf = 2; //1：预拨指标；2：批复指标
	var maxDetailCount_eachBill = 6; //每条单据最大的显示行数
	var bgItemManager = null; // _bgPub_itemManager;
	var refreshAfterCloseModal = true;
	var reslist = [];
	var tempBudgetPlan = null;
	var curBgPlanData = null; //主界面预算方案
	var moreMsgSetting = {
		"agencyCode": '',
		showMoney: false,
		dateTimeAtFirst: true,
		computHeight: function(tblH_before, tblH_after) {
			var divAfter = $("#mainTableDiv_advBudgetItem").find(".dataTables_scrollBody").outerHeight(true) +
				(parseInt(tblH_before) - parseInt(tblH_after));
			$("#mainTableDiv_advBudgetItem").find(".dataTables_scrollBody").css("height", divAfter + "px");
		},
		changeBgPlan: function(data) {
			//实在找不到原因，ufma-combox-popup默认不显示
			setTimeout(function() {
				$('.ufma-combox-popup').css({
					'display': 'none'
				});
			}, 100);
			curBgPlanData = data;
			if(lastPlan == null) {
				lastPlan = $('#_bgPub_cbb_BgPlan_bgMoreMsgPnl_advBudgetItem_input').val();
			} else if(curPlan == null) {
				curPlan = $('#_bgPub_cbb_BgPlan_bgMoreMsgPnl_advBudgetItem_input').val();
			} else {
				lastPlan = curPlan;
				curPlan = $('#_bgPub_cbb_BgPlan_bgMoreMsgPnl_advBudgetItem_input').val();
			}
			tempBudgetPlan = curPlan;
			bgItemManager.loadBgPlanObjFromObj(data);
			pnlFindRst.doFindBtnClick();
		},
		afterFind: function(data) {
			tblDt = data;
		},
		doFindBySelf: function(eleCdtn) {
			if(!checkCanLeave()) {
				ufma.confirm("有未保存的数据，是否确定离开页面?", function(rst) {
					if(rst) {
						for(var i = 0; i < tblObj.rows().data().length; i++) {
							tblObj.rows().data()[i].shouldSave = "0";
						}
						showTblData(false, eleCdtn);
						return rst;
					} else {
						$('#_bgPub_cbb_BgPlan_bgMoreMsgPnl_advBudgetItem_input').val(lastPlan);
					}
				}, {
					'type': 'warning'
				})
			} else {
				showTblData(false, eleCdtn);
			}

		}
	};

	/**
	 * 主界面 - 表格 - 预拨金额 输入发生了变动后的处理, 修改对应的data
	 */
	var tbl_afterInputMoney_cellChange = function(value, doc) {
		var tbl = $("#" + tblId).DataTable();
		var val = value;
		if(val == null || val == '') {
			val = '0';
		}
		//tbl.cell(doc).data($.formatMoney(val, 2));
		tbl.cell(doc).data(val);
		tbl.row(doc).data().shouldSave = "1";
		tbl.row(doc).data().bgItemCur = val;
		tbl.row(doc).data().bgItemAdvCur = val;
	};

	var getTabSetState = function() {
		var $selNav = $(".nav.nav-tabs").find("li.NAVSELECT");
		var statusNav = $selNav.find("a").attr("data-status");
		return statusNav; // Y=预拨  P=批复
	};

	/**
	 * 表格金额输入发生了变动后的处理, 修改对应的data
	 */
	var tbl_afterInputMoney_modalCellChange = function(value, doc) {
		var tbl = $("#" + modalTblId).DataTable();
		var val = value;
		if(val == null || val == '') {
			val = '0';
		}

		//tbl.cell(doc).data($.formatMoney(val, 2));
		tbl.cell(doc).data(val);
		tbl.row(doc).data().shouldSave = "1";
		tbl.row(doc).data().bgItemAdvcur = val;
		tbl.row(doc).data().bgItemCur = val;
	};

	/**
	 * 表格摘要输入发生了变动后的处理, 修改对应的data
	 */
	var tbl_afterInputSummary_cellChange = function(value, doc) {
		var tbl = $("#" + tblId).DataTable();
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
			tbl.row($td).data().shouldSave = "1";
		}
	};

	var checkCanLeave = function() {
		if($.isNull(tblObj)) {
			return true;
		}
		var dt = tblObj.rows().data(),
			bCanLeave = true;
		//guohx   增加  修改bug  未保存点批复按钮不弹出提示
		for(var i = 0; i < dt.length; i++) {
			if(!$.isNull(dt[i].shouldSave) && dt[i].shouldSave == "1") {
				bCanLeave = false;
				return bCanLeave;
			}
		}
		return bCanLeave;
	};

	var mainTbl_clearCbbCell = function() {
		if(tblCellTree === null || tblCellTree.setting === null) {
			return;
		}
		var $tdTree = $("#" + tblCellTree.setting.id),
			$td = $tdTree.closest("td");
		$tdTree.removeClass();
		$tdTree.removeAttr("id");
		$tdTree.removeAttr("style");
		$tdTree.removeAttr("aria-new");
		$tdTree.empty();
		tblCellTree = null;

		if($td.text() == null || $td.text() == "") {
			if(!$.isNull($td.attr("lastVal"))) {
				$td.empty();
				tblObj.cell($td).data($td.attr("lastVal"));
			}
		}
	};

	var ModalTbl_clearCbbCell = function() {
		if(modalCellTree === null || modalCellTree.setting === null) {
			return;
		}
		var $td = $("#" + modalCellTree.setting.id);
		$td.removeClass();
		$td.removeAttr("id");
		$td.removeAttr("style");
		$td.removeAttr("aria-new");
		$td.empty();
		modalCellTree = null;
	};

	var tbl_afterCbbSelect_cellChange = function(data) {
		if(tblCellTree == null) {
			return;
		}
		var $td = $("#" + tblCellTree.setting.id).closest("td");
		var tbl = $("#" + tblId).DataTable();
		//$td.empty();
		if(data.codeName != null && data.codeName != '') {
			tbl.cell($td).data(data.codeName);
			tbl.row($td).data().shouldSave = "1";
		}
	};

	var addListenerToMainTable = function() {
		/**
		 * 1, 事件一，单击单元格可以进入编辑状态
		 * @param  {[type]} [modal_tableObj== null]         [description]
		 * @return {[type]}                   [description]
		 */
		tblObj.off("click", "tbody td:not(opCol)").on("click", "tbody td:not(opCol)", function(e) {
			//:not[.bgChkBox]
			if(!$(this).hasClass("bgChkBox") && getTabSetState() === "P") {
				//批复的不可编辑
				return false;
			}
			var tbl = $("#" + tblId).DataTable();
			var col = tbl.column(this);
			var sId = col.dataSrc();
			if(typeof(sId) === "undefined") {
				mainTbl_clearCbbCell();
				return;
			}
			mainTbl_clearCbbCell();
			if(sId === "bgItemAdvCurShow") { //指标金额
				var rst = _BgPub_Bind_InputMoney(this, sId + "_money-advBgItem", tbl_afterInputMoney_cellChange, tbl.cell(this).data());
				$("#" + sId + "_money-advBgItem").blur(function(e) {
					var tmpE = jQuery.Event("keyup");
					tmpE.keyCode = 13;
					$("#" + sId + "_money-advBgItem").trigger(tmpE);
				});
				if(rst) {
					$("#" + sId + "_money-advBgItem").focus();
					$("#" + sId + "_money-advBgItem").select();
				}
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
			} else if(sId === "bgItemSummary") { //指标摘要
				var rst = _BgPub_Bind_InputText(this, sId + "_summary_advbgItem", tbl_afterInputSummary_cellChange, tbl.cell(this).data());
				$("#" + sId + "_summary_advbgItem").blur(function(e) {
					var tmpE = jQuery.Event("keyup");
					tmpE.keyCode = 13;
					$("#" + sId + "_summary_advbgItem").trigger(tmpE);
				});
				if(rst) {
					$("#" + sId + "_summary_advbgItem").focus();
					$("#" + sId + "_summary_advbgItem").select();
				}
			} else {
				for(var iIndex = 0; iIndex < bgItemManager.myBgPlanObj.planVo_Items.length; iIndex++) {
					var itemObj = bgItemManager.myBgPlanObj.planVo_Items[iIndex];
					var sTblTitleField = _BgPub_getEleDataFieldNameByCode(itemObj.eleCode, itemObj.eleFieldName);
					if(sTblTitleField == sId) {
						//先清空cell里面的值
						var tmpFullName = tbl.cell(this).data();
						$(this).attr("lastVal", tmpFullName);
						tbl.cell(this).data('');
						var tmpDivId = "multiModalCellTree-advbgItem";
						var tmpDiv = "<div id='" + tmpDivId + "' style='height:28px'></div>";
						var billStatus = '1'; //新增
						if(!$.isNull(tmpFullName)) {
							billStatus = '0'; //编辑
						}
						$(this).html(tmpDiv);
						tblCellTree = _BgPub_Bind_EleComboBox_Single("#" + tmpDivId, itemObj.eleCode, itemObj.eleName, itemObj.eleLevel,
							tbl_afterCbbSelect_cellChange, bgItemManager.agencyCode, null, null, billStatus);
						$("#" + tblCellTree.setting.id).css("width", "200px");
						$("#" + tblCellTree.setting.id).blur(function(e) {
							tbl_afterCbbSelect_cellChange({});
						});
						$("#" + tblCellTree.setting.id + " input[type='text']").removeAttr("readonly");
						if(!$.isNull(tmpFullName)) { //再点击时不清空已选要素  guohx
							var code = tmpFullName.substring(0, tmpFullName.indexOf(" "));
							$("#" + tblCellTree.setting.id).ufmaTreecombox().setValue(code, tmpFullName);
						}

						break;
					}
				}
			}
		});
		/**
		 * 事件二 ： 第一列的checkbox支持选择
		 */
		$("#" + tblId + " input[name='mainRowCheck']").off("change").on("change", function(e) {
			var selected = ($(this).is(":checked") == true);
			var $curRow = $(this).closest("tr");
			var rowCount = $(this).closest("tbody").find("tr").length;
			if(selected) {
				$curRow.addClass("selected");
			} else {
				$curRow.removeClass("selected");
			}
		});
		/**
		 * 事件三 ： 最后操作列的 - 附件
		 */
		$(document).off('mousedown', '#mainTable_advBudgetItem tr span.mainFileSpan').on('mousedown', '#mainTable_advBudgetItem tr span.mainFileSpan', function(e) {
			// ufma.showTip("附件click", null, "success");
			var tr = $(this).closest("tr");
			var dt = tblObj.row(tr).data();
			var modal_Attachment = [];
			//1, 从服务器获得本指标的附件数量
			var tmpRst = _bgPub_GetAttachment({
				"billId": dt.bgItemId,
				"agencyCode": bgItemManager.agencyCode
			});
			if(!$.isNull(tmpRst.data.bgAttach)) {
				for(var m = 0; m < tmpRst.data.bgAttach.length; m++) {
					modal_Attachment[modal_Attachment.length] = {
						"filename": tmpRst.data.bgAttach[m].fileName,
						"filesize": 0,
						"fileid": tmpRst.data.bgAttach[m].attachId
					};
				}
			}

			//2, 加载附件窗口
			var option = {
				"agencyCode": bgItemManager.agencyCode,
				"billId": dt.bgItemId,
				"uploadURL": _bgPub_requestUrlArray_subJs[8] + "?agencyCode=" + bgItemManager.agencyCode + "&billId=" + dt.bgItemId,
				"delURL": _bgPub_requestUrlArray_subJs[16] + "?agencyCode=" + bgItemManager.agencyCode + "&billId=" + dt.bgItemId,
				"downloadURL": _bgPub_requestUrlArray_subJs[15] + "?agencyCode=" + bgItemManager.agencyCode + "&billId=" + dt.bgItemId,
				"onClose": function(fileList) {}
			};
			_bgPub_ImpAttachment("advBudgetItem", "指标[" + dt.bgItemCode + "]附件导入", modal_Attachment, option);
		});
		/**
		 * 事件四 ： 最后操作列的 - 日志
		 */
		$(document).off('mousedown', '#mainTable_advBudgetItem tr span.mainLogSpan').
		on('mousedown', '#mainTable_advBudgetItem tr span.mainLogSpan', function(e) {
			// ufma.showTip("日志click", null, "success");
			var tr = $(this).closest("tr");
			var dt = tblObj.row(tr).data();

			_bgPub_showLogModal("advBudgetItem", {
				"bgItemId": dt.bgItemId,
				"bgItemCode": dt.bgItemCode,
				"agencyCode": bgItemManager.agencyCode
			});
		});
		/**
		 * 事件五 ： 最后操作列的 - 删除
		 */
		$(document).off('mousedown', '#mainTable_advBudgetItem tr span.mainDelSpan').
		on('mousedown', '#mainTable_advBudgetItem tr span.mainDelSpan', function(e) {
			var tmpNavStatus = getTabSetState();
			var tr = $(this).closest("tr");
			var dt = tblObj.row(tr).data();
			if(dt.isNew == '是') {
				tblObj.row(tr).remove().draw();
				return false;
			}
			var delDt = [];
			delDt.push(dt.bgItemId);
			ufma.confirm("确定要删除本行数据吗?", function(rst) {
				if(!rst) {
					return false;
				}
				bgItemManager.deleteBgItem(delDt, dt.bgPlanId, function(result) {
					if(result.flag == "success") {
						ufma.showTip("删除成功", null, "success");
						tblObj.row(tr).remove().draw();
					}
				}, function(msg) {
					ufma.showTip(msg, null, "error");
				});
			}, {
				'type': 'warning'
			});
		});
		/**
		 * 事件六 ： 挂接筛选功能。
		 */
		$(".advBudgetItem #searchHideBtn").off("click");
		$(".advBudgetItem #iframeBtnsSearch").off("mouseleave");
		ufma.searchHideShow($('#' + tblId)); //搜索框

		/**
		 * 事件七 ： 最后操作列的 - 销批
		 */
		$("#" + tblId + " tr span.mainCancelAuditSpan").off("click").on("click", function(e) {
			var tmpNavStatus = getTabSetState();
			var tr = $(this).closest("tr");
			var dt = tblObj.row(tr).data();
			ufma.confirm("确定要销批本行数据吗?", function(rst) {
				if(!rst) {
					return false;
				}
				var xpDt = [];
				xpDt[0] = dt;
				bgItemManager.cancelReplyBgItems(xpDt, curBgPlanData.chrId,
					function(result) {
						ufma.showTip("销批成功", null, "success");
						pnlFindRst.doFindBtnClick();
					},
					function(msg) {
						ufma.showTip(msg, null, "error");
					}
				);
			}, {
				'type': 'warning'
			});
		});

		/**
		 * 事件八 ： 最后操作列的 - 批复
		 */
		$(document).off('mousedown', '#mainTable_advBudgetItem tr span.mainAuditSpan').on('mousedown', '#mainTable_advBudgetItem tr span.mainAuditSpan', function(e) {
			if(!checkCanLeave()) {
				ufma.showTip("您的指标暂未保存,不可批复!", null, "error");
				return false;
			} else {
				var tmpNavStatus = getTabSetState();
				var tr = $(this).closest("tr");
				var dt = tblObj.row(tr).data();
				var pfArr = [dt];
				doLoadModalWithData(pfArr);
			}

		});
		/**
		 * 事件九 : 表头全选按钮
		 */
		$("#input-seleAllUp").off("change").on("change", function(e) {
			var selAll = ($(this).is(":checked") == true);
			$("#input-seleAll-advBudgetItem").prop("checked", selAll);
			var rows = $("#" + tblId).dataTable().fnGetNodes();
			for(var k = 0; k < rows.length; k++) {
				var row = rows[k];
				if($(row).find("td:eq(0):has(label)").length > 0) {
					$(row).find("td:eq(0):has(label)").find("input[type='checkbox']").prop("checked", selAll);
					$(row).find("td:eq(0):has(label)").find("input[type='checkbox']").trigger("change");
				}
			}
		});
	};

	var addListenerToModalTable = function() {
		/**
		 * 1, 事件一，单击单元格可以进入编辑状态
		 * @param  {[type]} [modal_tableObj== null]         [description]
		 * @return {[type]}                   [description]
		 */
		$("#" + modalTblId).off("click", "tbody td").on("click", "tbody td", function(e) {
			var tbl = $("#" + modalTblId).DataTable();
			var col = tbl.column(this);
			var sId = col.dataSrc();
			if(typeof(sId) === "undefined") {
				ModalTbl_clearCbbCell();
				return;
			}
			ModalTbl_clearCbbCell();
			if(sId === "bgItemCurShow") { //批复金额
				var rst = _BgPub_Bind_InputMoney(this, sId + "_Advmoney-advBgItem", tbl_afterInputMoney_modalCellChange, tbl.cell(this).data());
				$("#" + sId + "_Advmoney-advBgItem").blur(function(e) {
					var tmpE = jQuery.Event("keyup");
					tmpE.keyCode = 13;
					$("#" + sId + "_Advmoney-advBgItem").trigger(tmpE);
				});
				if(rst) {
					$("#" + sId + "_Advmoney-advBgItem").focus();
					$("#" + sId + "_Advmoney-advBgItem").select();
				}
			}
		});
	};

	/**
	 * 根据预算方案显示主页面的主表(获取数据，调用doPaintTable函数绘制表格。)
	 * @param  {[type]} bNotRepaintTbl [false=url获得数据并且刷新表格   true=url获得数据，但不刷新表格]
	 * @param  {[eleInBgItemObj]} pEleCdtn [=null 时，会自行组装一个对象；否则使用此参数的对象]
	 * @return {[type]}                [description]
	 */
	var showTblData = function(bNotRepaintTbl, pEleCdtn) {
		var statusNav = getTabSetState();
		var loadingMsg = '';
		if(statusNav == "Y") {
			//预拨指标
			bgItemManager.bgItemReserve = bgItemReserve_yb;
			loadingMsg = "正在加载预拨指标, 请稍后...";
		} else if(statusNav == "P") {
			//批复指标
			bgItemManager.bgItemReserve = bgItemReserve_pf;
			loadingMsg = "正在加载批复指标, 请稍后...";
		}

		ufma.showloading(loadingMsg);
		var dt = bgItemManager.getBgItems(pEleCdtn,
			function(result) {
				if(result.flag === "success") {
					for(var i = 0; i < result.data.items.length; i++) {
						result.data.items[i].newCreateDate = result.data.items[i].createDate.substr(0, 10);
					}
					tblDt = $.extend({}, result.data);
					if(bNotRepaintTbl) {
						ufma.hideloading();
						return;
					}
					doPaintTable(tblDt.items);
				} else {
					ufma.hideloading();
					ufma.showTip(result.msg, null, "error");
				}
			},
			function(data) {
				ufma.hideloading();
				ufma.showTip(data, null, "error");
			});
		ufma.isShow(reslist);
	};

	/**
	 * 根据传入的tabData加载表格数据
	 * @param  {[type]} tabData 绘制表格的data, url.data
	 * @return {[type]}         [description]
	 */
	var doPaintTable = function(tabData) {
		var tblCols = [
			/**
			 * 第一列，checkbox
			 */
			{
				data: "",
				title: '<label class="mt-checkbox mt-checkbox-single mt-checkbox-outline"> <input id="input-seleAllUp" type="checkbox" class="checkboxes" data-level="undefined" name="mainRowCheck">&nbsp;<span></span> </label>',
				width: 30,
				class: "bgChkBox"
			},
			{
				data: "bgItemCode",
				title: "指标编码",
				width: "120px",
				class: "print",
				"render": function(data, type, rowdata, meta) {
					if(!$.isNull(data)) {
						return '<span title="' + data + '">' + data + '</span>';
					} else {
						return '';
					}
				}
      },
      // CWYXM-18408--指标年结涉及采购合同报销模块占用的指标结转完善--zsj
			{
				data: "bgTypeName",
				title: "指标类型",
				width: "260px",
				class: "print ellipsis",
				"render": function(data, type, rowdata, meta) {
					if(!$.isNull(data)) {
						return '<span title="' + data + '">' + data + '</span>';
					} else {
						return '';
					}
				}
			},
			{
				data: "bgItemSummary",
				title: '摘要',
				width: "260px",
				class: "print ellipsis",
				"render": function(data, type, rowdata, meta) {
					if(!$.isNull(data)) {
						return '<span title="' + data + '">' + data + '</span>';
					} else {
						return '';
					}
				}
			}
		];
		if(currentplanData.isComeDocNum == "是") {
			tblCols.push({
				data: "comeDocNum",
				title: "来文文号",
				class: "print ellipsis",
				width: "200px",
				"render": function(data, type, rowdata, meta) {
					if(!$.isNull(data)) {
						return '<span title="' + data + '">' + data + '</span>';
					} else {
						return '';
					}
				}
			});
		}
		if(currentplanData.isSendDocNum == "是") {
			tblCols.push({
				data: "sendDocNum",
				title: page.sendCloName,
				class: "print ellipsis",
				width: "200px",
				"render": function(data, type, rowdata, meta) {
					if(!$.isNull(data)) {
						return '<span title="' + data + '">' + data + '</span>';
					} else {
						return '';
					}
				}
			});
		}
		//循环添加预算方案的要素信息
		for(var index = 0; index < bgItemManager.myBgPlanMsgObj.eleCodeArr.length; index++) {
			tblCols.push({
				data: _BgPub_getEleDataFieldNameByCode(bgItemManager.myBgPlanMsgObj.eleCodeArr[index],
					bgItemManager.myBgPlanMsgObj.eleFieldName[index]),
				title: bgItemManager.myBgPlanMsgObj.eleNameArr[index],
				width: "260px",
				class: "print ellipsis",
				"render": function(data, type, rowdata, meta) {
					if(!$.isNull(data)) {
						return '<span title="' + data + '">' + data + '</span>';
					} else {
						return '';
					}
				}
			});
		}

		var tmpNavStatus = getTabSetState();
		//添加最后的金额，日期，操作列
		if(tmpNavStatus == "Y") {
			tblCols.push({
				data: "bgItemAdvCurShow",
				class: "bgPubMoneyCol print",
				title: "预拨金额",
				align: 'right',
				width: "150px",
				class: "print bgPubMoneyCol ellipsis",
				render: $.fn.dataTable.render.number(',', '.', 2, '') //解决千分位搜索问题
			});
		} else {
			tblCols.push({
				data: "bgItemCurShow",
				class: "bgPubMoneyCol print",
				title: "批复金额",
				align: 'right',
				width: "150px",
				class: "print bgPubMoneyCol ellipsis",
				render: $.fn.dataTable.render.number(',', '.', 2, '') //解决千分位搜索问题
			});
		}

		tblCols.push({
			data: "newCreateDate",
			title: "录入日期",
			width: "200px",
			class: "print ellipsis",

		});
		tblCols.push({
			data: "bgItemId",
			class: "opCol",
			title: "操作",
			width: "131px"
		});

		var colDefs = [{
			"targets": [-1],
			"serchable": false,
			"orderable": false,
			"render": function(data, type, rowdata, meta) {

				if(tmpNavStatus == "Y") {
					//预拨
					return '<a class="btn btn-icon-only btn-sm btn-attach   btn-permission" data-toggle="tooltip" ' +
						'rowid="' + data + '" title="附件" ">' +
						'<span class="glyphicon icon-paperclip mainFileSpan"></span></a>' +
						'<a class="btn btn-icon-only btn-sm btn-reply  btn-permission" data-toggle="tooltip"  ' +
						'rowid="' + data + '" title="批复" >' +
						'<span class="glyphicon icon-audit mainAuditSpan"></span></a>' +
						'<a class="btn btn-icon-only btn-delete btn-sm   btn-permission" data-toggle="tooltip"  ' +
						'rowid="' + data + '" title="删除" >' +
						'<span class="glyphicon icon-trash mainDelSpan"></span></a>';
				} else {
					//批复
					return '<a class="btn btn-icon-only btn-sm btn-attach   btn-permission" data-toggle="tooltip" ' +
						'rowid="' + data + '" title="附件" ">' +
						'<span class="glyphicon icon-paperclip mainFileSpan"></span></a>' +
						'<a class="btn btn-icon-only btn-sm btn-un-reply btn-permission " data-toggle="tooltip"  ' +
						'rowid="' + data + '" title="销批" >' +
						'<span class="glyphicon icon-cancel-audit mainCancelAuditSpan"></span></a>' +
						'<a class="btn btn-icon-only btn-sm btn-attach btn-permission " data-toggle="tooltip" ' +
						'rowid="' + data + '" title="日志" >' +
						'<span class="glyphicon icon-log mainLogSpan"></span></a>';
				}
			}
		}, {
			"targets": [0],
			"serchable": false,
			"orderable": false,
			"render": function(data, type, rowdata, meta) {
				return '<label class="mt-checkbox mt-checkbox-single mt-checkbox-outline"> ' +
					'<input type="checkbox" class="checkboxes" data-level="' + rowdata.levelNum + '" name="mainRowCheck" />&nbsp;' +
					'<span></span> ' +
					'</label>';
			}
		}];
		// var mainTableData = organizeMainTblDataByURLResponse(tabData, true);
		var mainTableData = tabData;
		var totalMoney = 0.00;
		for(var i = 0; i < mainTableData.length; i++) {
			//bgItemCur 和 bgItemAdvcur 不会同时为null或=0；
			if($.isNull(mainTableData[i].bgItemCur) || mainTableData[i].bgItemCur == 0) {
				mainTableData[i].bgItemCur = mainTableData[i].bgItemAdvcur;
			} else if($.isNull(mainTableData[i].bgItemAdvcur) || mainTableData[i].bgItemAdvcur == 0) {
				mainTableData[i].bgItemAdvcur = mainTableData[i].bgItemCur;
			}
			//mainTableData[i].bgItemCurShow = $.formatMoney(mainTableData[i].bgItemCur, 2);
			//mainTableData[i].bgItemAdvCurShow = $.formatMoney(mainTableData[i].bgItemAdvcur, 2);

			mainTableData[i].bgItemCurShow = mainTableData[i].bgItemCur; //解决千分位搜索问题
			mainTableData[i].bgItemAdvCurShow = mainTableData[i].bgItemAdvcur; //解决千分位搜索问题

			totalMoney += mainTableData[i].bgItemCur;
		}

		$("#span-billsCount-advBudgetItem").text(mainTableData.length); //数量
		$("#span-billsTotalMoney-advBudgetItem").text($.formatMoney(totalMoney, 2)); //总额

		var sScrollY = $(".workspace").outerHeight(true) - $(".workspace-top").outerHeight(true) -
			$("#bgMoreMsgPnl_advBudgetItem").outerHeight(true) - 12 - $(".nav").outerHeight(true) -
			$("#tableTotalShow-advBudgetItem").outerHeight(true) - 38 - 34 - 30;
		var tblSetting = {
			"data": mainTableData,
			"columns": tblCols,
			"columnDefs": colDefs,
			"paging": false,
			"ordering": false,
			"lengthChange": false,
			"processing": true, // 显示正在加载中
			"bSort": false, // 排序功能
			"autoWidth": true, //配合列宽，注意，TRUE的时候是关闭自动列宽，坑死了
			"scrollY": sScrollY,
			scrollX: true,

			/*			scrollCollapse: true,
			            paging: false,
			            fixedColumns: {
			                leftColumns: 1
			            },*/
			"select": true,
			"bDestroy": true,
			"dom": 'Brt', //<"rightDiv" p>
			"initComplete": function(options, data) {
				//$('button[data-toggle="tooltip"]').tooltip();
				/*var $mainTable = $($('#mainTable_advBudgetItem').closest('.dataTables_scroll').find('.dataTables_scrollHeadInner table'));
				$mainTable.tblcolResizable({
					'bindTable': '#mainTable_advBudgetItem'
				});*/
			},
			/*"order": [
				[1, "asc"] //默认以ID列升序排列  降序desc
			],*/
			"buttons": [{
				"extend": "print",
				"className": tblPrintBtnClass + " bgHide",
				"text": "打印",
				"autoPrint": true,
				"exportOptions": {
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
					'rows': function(idx, data, node) {
						return true;
					},
					'columns': ".print"
				}
			}],

			initComplete: function() {

				/*	             	var DTCScroll = $("#mainTableDiv_advBudgetItem").find('.dataTables_scrollBody');
				                    DTCScroll.css({'height':DTCScroll.css('max-height')});   */
			}
		};

		if(tblObj !== null) {
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
		/* var $clostDiv = $("#" + tblId).closest("div");
		 $($clostDiv).css("border-bottom", "0px black solid");*/
		_BgPub_ReSetDataTable_AfterPaint(tblId);
		$("#input-seleAll-advBudgetItem").prop("checked", false);
		$("#input-seleAllUp").prop("checked", false);
		addListenerToMainTable();
		ufma.hideloading();
		ufma.isShow(reslist);
	};

	/**
	 * 绘制模态框的表格
	 * @param data
	 */
	var doPaintModalTable = function(data) {
		var tblCols = [{
				data: "bgItemCode",
				title: "指标编码",
				width: "100px"
      },
      // CWYXM-18408--指标年结涉及采购合同报销模块占用的指标结转完善--zsj
			{
				data: "bgTypeName",
				title: "指标类型",
				width: "200px",
				className: 'ellipsis',
			},
			{
				data: "bgItemSummary",
				title: '摘要',
				width: "200px",
				className: 'ellipsis',
			}
		];
		if(currentplanData.isComeDocNum == "是") {
			tblCols.push({
				data: "comeDocNum",
				title: "来文文号",
				class: "print ellipsis",
				width: "200px"
			});
		}
		if(currentplanData.isSendDocNum == "是") {
			tblCols.push({
				data: "sendDocNum",
				title: page.sendCloName,
				class: "print ellipsis",
				width: "200px"
			});
		}
		//循环添加预算方案的要素信息
		for(var index = 0; index < bgItemManager.myBgPlanMsgObj.eleCodeArr.length; index++) {
			tblCols.push({
				data: _BgPub_getEleDataFieldNameByCode(bgItemManager.myBgPlanMsgObj.eleCodeArr[index],
					bgItemManager.myBgPlanMsgObj.eleFieldName[index]),
				title: bgItemManager.myBgPlanMsgObj.eleNameArr[index],
				width: "200px",
				class: "print ellipsis",
			});
		}
		//添加最后的金额，日期，操作列
		tblCols.push({
			data: "bgItemAdvcurShow",
			class: "bgPubMoneyCol print moneyInput",
			title: "预拨金额",
			align: 'right',
			width: "150px",
			render: $.fn.dataTable.render.number(',', '.', 2, '') //解决千分位搜索问题
		});
		tblCols.push({
			data: "bgUseCurShow",
			class: "bgPubMoneyCol print",
			title: "执行",
			width: "100px"
		});
		tblCols.push({
			data: "bgItemBalancecurShow",
			class: "bgPubMoneyCol print moneyInput",
			title: "余额",
			width: "150px",
			render: $.fn.dataTable.render.number(',', '.', 2, '') //解决千分位搜索问题
		});
		tblCols.push({
			data: "bgItemCurShow",
			class: "bgPubMoneyCol print moneyInput",
			align: 'right',
			title: "批复金额",
			width: "150px",
			render: $.fn.dataTable.render.number(',', '.', 2, '') //解决千分位搜索问题
		});
		tblCols.push({
			data: "newCreateDate",
			class: "opCol",
			title: "录入日期",
			width: "180px"
		});

		var modalTableData = data;
		for(var j = 0; j < modalTableData.length; j++) {
			if($.isNull(modalTableData[j].bgItemAdvcur)) {
				modalTableData[j].bgItemAdvcur = modalTableData[j].bgItemCur;
			}
			if($.isNull(modalTableData[j].bgItemAdvcurShow)) {
				//modalTableData[j].bgItemAdvcurShow = $.formatMoney(modalTableData[j].bgItemAdvcur, 2);
				modalTableData[j].bgItemAdvcurShow = modalTableData[j].bgItemAdvcur; //解决千分位搜索问题
			}
			if($.isNull(modalTableData[j].bgItemBalancecurShow)) {
				//modalTableData[j].bgItemBalancecurShow = $.formatMoney(modalTableData[j].bgItemBalanceCur, 2);
				modalTableData[j].bgItemBalancecurShow = modalTableData[j].bgItemBalanceCur; //解决千分位搜索问题
			}
			if($.isNull(modalTableData[j].bgUseCurShow)) {
				//modalTableData[j].bgUseCurShow = $.formatMoney(modalTableData[j].bgUseCur, 2);
				modalTableData[j].bgUseCurShow = modalTableData[j].bgUseCur; //解决千分位搜索问题
			}
		}

		var bNotAutoWidth = true; //默认是取消自动宽度；
		if(modalTableData.length == 0) {
			bNotAutoWidth = false;
		}

		var sScrollY = 200;

		sScrollY = $("#bg-multiModal-content-advBgItem").outerHeight(true) - 80;

		var tblSetting = {
			"data": modalTableData,
			"columns": tblCols,
			"paging": false,
			"ordering": false,
			"lengthChange": false,
			"processing": true, // 显示正在加载中
			"bSort": false, // 排序功能
			"autoWidth": bNotAutoWidth, //配合列宽，注意，TRUE的时候是关闭自动列宽，坑死了
			"scrollX": true,
			"scrollY": sScrollY,
			"select": true,
			"bDestroy": true,
			"dom": 'rt' //<"rightDiv" p>
		};
		if(!$.isNull(modal_tableObj)) {
			modal_tableObj.destroy();
			$("#" + modalTblId).empty();
		}
		modal_tableObj = $("#" + modalTblId).DataTable(tblSetting);

		if(!$("#" + modalTblId).hasClass("ufma-table")) {
			$("#" + modalTblId).addClass("ufma-table");
		}
		if(!$("#" + modalTblId).hasClass("dataTable")) {
			$("#" + modalTblId).addClass("dataTable");
		}
		/* var $clostDiv = $("#" + modalTblId).closest("div");
		 $($clostDiv).css("border-bottom", "0px black solid");*/
		_BgPub_ReSetDataTable_AfterPaint(modalTblId);
		addListenerToModalTable();

	};

	/**
	 * 加载模态框
	 * @param data
	 */
	var doLoadModalWithData = function(data) {
		modal_Obj = ufma.showModal("advBudgetItem-add", 1090);
		//重新计算content的高度。自动计算的不对
		/*var contentHeight = parseFloat($(".u-msg-dialog").css("height"));
		contentHeight = contentHeight - modal_Obj.modal.find('.u-msg-title').outerHeight(true);
		modal_Obj.modal.find('.u-msg-footer').each(function(ele) {
			contentHeight = contentHeight - $(this).outerHeight(true);
		});
		modal_Obj.msgContent.css('height', contentHeight + 'px');*/

		setTimeout(function() {
			doPaintModalTable(data);
		}, 500)
	}

	/**
	 * 模态框关闭时调用函数
	 
	var doWhenModalClose = function() {
		$(".nav.nav-tabs li").find("a[data-status='P']").trigger("click");
	}*/
	//********************************************************[绑定事件]***************************************************
	/**
	 * 预拨指标、批复指标  [页签]  的变动
	 * @param  {[type]} e [description]
	 * @return {[type]}   [description]
	 */
	$(".nav.nav-tabs li").on("click", function(e) {
		$(".nav.nav-tabs li").removeClass("NAVSELECT");
		$(this).addClass("NAVSELECT");
		var tmpStatus = $(this).find('a').attr("data-status"); //P=批复  Y=预拨
		if(tmpStatus == "Y") {
			$('#btn-new-advBudgetItem').show();
			$('#btn-save-advBudgetItem').show();
			$('#btn-pf-advBudgetItem').show();
			$('#btn-delete-advBudgetItem').show();
			$('#btn-xp-advBudgetItem').hide();
			if(!$.isNull(bgItemManager.myBgPlanObj)) {
				pnlFindRst.doFindBtnClick();
			}
		} else if(tmpStatus == "P") {
			if(!checkCanLeave()) {
				ufma.confirm("有未保存的数据，是否确定离开页面?", function(rst) {
					if(rst) {
						for(var i = 0; i < tblObj.rows().data().length; i++) {
							tblObj.rows().data()[i].shouldSave = "0";
						}
						$('#btn-new-advBudgetItem').hide();
						$('#btn-save-advBudgetItem').hide();
						$('#btn-pf-advBudgetItem').hide();
						$('#btn-delete-advBudgetItem').hide();
						$('#btn-xp-advBudgetItem').show();
						if(!$.isNull(bgItemManager.myBgPlanObj)) {
							pnlFindRst.doFindBtnClick();
						}
						return rst;
					} else {
						$(".nav.nav-tabs li").addClass("NAVSELECT");
						$(".nav.nav-tabs li").addClass("active");
						$(".nav a[data-status='P']").closest("li").removeClass("NAVSELECT");
						$(".nav a[data-status='P']").closest("li").removeClass("active");
						$('#btn-new-advBudgetItem').show();
						$('#btn-save-advBudgetItem').show();
						$('#btn-pf-advBudgetItem').show();
						$('#btn-delete-advBudgetItem').show();
						$('#btn-xp-advBudgetItem').hide();
						return rst;
					}
				}, {
					'type': 'warning'
				})
			} else {
				$('#btn-new-advBudgetItem').hide();
				$('#btn-save-advBudgetItem').hide();
				$('#btn-pf-advBudgetItem').hide();
				$('#btn-delete-advBudgetItem').hide();
				$('#btn-xp-advBudgetItem').show();
				if(!$.isNull(bgItemManager.myBgPlanObj)) {
					pnlFindRst.doFindBtnClick();
				}
			}
		}

	});

	/**
	 * 主界面 - icon - 文件导入按钮事件
	 */
	$("#btn-imp-advBudgetItem").off("click").on("click", function(e) {
		var tmpStatus = getTabSetState();
		if(tmpStatus == "P") {
			ufma.showTip("批复指标不能导入。", null, "warning");
			return false;
		}
		var tmpImpModal = _ImpXlsFile("advBudgetItem", "advBudgetItemImp", curBgPlanData.chrId, function(data) {
			//success
			if(data.flag == "success") {
				//这里注意，需要自动切换方案。方案的信息应当来源于服务的应答
				tblDt = ($("#" + tblId).dataTable().fnGetData()).concat(data.data.items)
				// for (var i = 0; i < result.data.items.length; i++) {
				//     result.data.items[i].newCreateDate = result.data.items[i].createDate.substr(0, 10);
				// }

				var data = [];
				for(var i = 0; i < tblDt.length; i++) { //修改 导入的指标未保存不可批复
					var row = $.extend(true, tblDt[i], {
						shouldSave: "1"
					});
					row.newCreateDate = row.createDate.substr(0, 10);
					data.push(row);
				}
				doPaintTable(data);
				tmpImpModal.closeModal();
			} else {
				ufma.showTip(data.msg, function() {
					$('#advBudgetItemImp_xlsInputModal_filePath').val('');
				}, "error");
			}
		}, function(data) {
			//failed
			ufma.showTip(data, function() {
				$('#advBudgetItemImp_xlsInputModal_filePath').val('');
			}, "error");
		}, {
			"agencyCode": bgItemManager.agencyCode,
			"billId": ""
		});
	});

	/**
	 * 主界面 - icon - 文件导出按钮事件
	 */
	$("#btn-exp-advBudgetItem").off("click").on("click", function(e) {
		$("." + tblPrintBtnClassExpXls).trigger("click");
	});

	/**
	 * 主界面 - icon - 打印按钮事件
	 */
	$("#btn-print-advBudgetItem").off("click").on("click", function(e) {
		$("." + tblPrintBtnClass).trigger("click");
	});

	/**
	 * 主界面 - 全选 checkbox
	 */
	$("#input-seleAll-advBudgetItem").off("change").on("change", function(e) {
		var selAll = ($(this).is(":checked") == true);
		$("#input-seleAllUp").prop("checked", selAll);
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
	 * 主界面 - button - 新增行
	 */
	$("#btn-new-advBudgetItem").off("click").on("click", function(e) {
		$("#input-seleAll-advBudgetItem").prop("checked", false); //点击新增行清空勾选框
		$("#input-seleAllUp").prop("checked", false);
		$("#mainTable_advBudgetItem .checkboxes").prop("checked", false);
		if($.isNull(bgItemManager.myBgPlanObj)) {
			ufma.showTip("请选择一个预算方案", null, "error");
			return false;
		}
		if(bgItemManager.myBgPlanObj.enabled == '否') {
			ufma.showTip("该预算方案已经被停用，请重新选择！", null, "error");
			return false;
		}
		bgItemManager.newBgItem(function(result) {
			if(result.flag == "success") {
				result.data.bgItemCurShow = "0.00";
				result.data.bgItemAdvCurShow = "0.00";
				if(result.data.createDate != null && result.data.createDate != "") {
					result.data.newCreateDate = result.data.createDate.substr(0, 10);
					//result.data.createDate = result.data.createDate.substr(0, 10);
				}
				$("#" + tblId).DataTable().row.add(result.data).draw();
				ufma.isShow(reslist);
			} else {
				ufma.showTip("新建指标失败！" + result.msg, null, "error");
			}
		}, function(result) {
			ufma.showTip("新建指标失败！" + result, null, "error");
		});
	});

	/**
	 * 主界面 - button - 保存
	 */
	$("#btn-save-advBudgetItem").off("click").on("click", function(e) {
		if($.isNull(tblObj)) {
			return false;
		}

		ufma.confirm("要保存指标吗?", function(rst) {
			if(!rst) {
				return false;
			}
			var saveDt = tblObj.data();
			//比较服务器时间与业务日期是不是同一年
			var pfData = ufma.getCommonData();
			var userDate = pfData.svSetYear;
			var serverDate = '';
			ufma.get("/bg/sysdata/getSysDate", {},
				function(result) {
					serverDate = new Date(result.data).getFullYear();
					if(serverDate != userDate) {
						ufma.showTip("业务时间和服务器时间不一致，请填写正确的业务时间!", null, "error");
					}
				});

			//保存前检查数据
			for(var i = 0; i < saveDt.length; i++) {
				if(saveDt[i].shouldSave == "1") {
					if(saveDt[i].bgItemCur <= 0) {
						ufma.showTip("指标金额不能小于等于0，请重新输入", null, "error");
						return false;
					}
				}
			}
			//预处理数据
			bgItemManager.saveBgItem(saveDt, function(data) {
					for(var i = 0; i < saveDt.length; i++) {
						saveDt[i].shouldSave = "0";
						saveDt[i].isNew = "否";
					}
					ufma.showTip("保存成功", null, "success");
					pnlFindRst.doFindBtnClick();
				},
				function(errMsg) {
					ufma.showTip(errMsg, null, "error");
				},
				function(rowDt) {
					rowDt.bgItemReserve = bgItemManager.bgItemReserve;
					rowDt.createUserName = _bgPub_getUserMsg().userName;
					rowDt.createUser = _bgPub_getUserMsg().userCode;
					rowDt.bgItemAdvcur = rowDt.bgItemCur;
					rowDt.status = 3; //预拨指标保存即为审核状态，可以直接使用
				});
		}, {
			'type': 'warning'
		});
	});

	/**
	 * 主界面 - button - 批复
	 */

	$("#btn-pf-advBudgetItem").off("click").on("click", function(e) {
		if(!checkCanLeave()) {
			ufma.showTip("您的指标暂未保存,不可批复!", null, "error");
			return false;
		} else {
			var pfArr = [];
			$("#" + tblId + " tbody tr").each(function(index, row) {
				var $chk = $(this).find("input[type='checkbox']");
				if($chk.is(":checked") == true) {
					pfArr[pfArr.length] = tblObj.row(this).data();
				}
			});
			if(pfArr.length == 0) {
				ufma.showTip('请先选择您要批复的指标', function() {}, 'warning');
				return false;
			} else {
				doLoadModalWithData(pfArr);
			}

		}

	});
	/**
	 * 主界面 - button - 删除
	 */
	$("#btn-delete-advBudgetItem").off("click").on("click", function(e) {
		var delDt = [];
		var delSum = 0;
		$("#" + tblId + " tbody tr").each(function(index, row) {
			var $chk = $(this).find("input[type='checkbox']");
			if($chk.is(":checked") == true) {
				if(tblObj.row(this).data().isNew == '否') {
					delDt[delDt.length] = tblObj.row(this).data().bgItemId;
					delSum++;
				} else if(tblObj.row(this).data().isNew == '是') {
					tblObj.row(this).remove().draw();
					delSum++;
					pnlFindRst.doFindBtnClick();
				}
			}
		});
		if(delDt.length > 0) {
			ufma.confirm("确定要删除选中的指标吗?", function(rst) {
				if(!rst) {
					return false;
				}
				bgItemManager.deleteBgItem(delDt, curBgPlanData.chrId, function(result) {
					if(result.flag == "success") {
						ufma.showTip("删除成功", null, "success");
						pnlFindRst.doFindBtnClick();
						$("#" + tblId + " tbody tr").each(function(index, row) {
							var $chk = $(this).find("input[type='checkbox']");
							if($chk.is(":checked") == true) {
								tblObj.row(this).remove().draw();
							}
						});
					}

				}, function(msg) {
					ufma.showTip(msg, null, "error");
				});

			}, {
				'type': 'warning'
			});
		} else if(delSum = 0) {
			ufma.showTip('请先选择一条指标！', function() {}, 'warning');
			return false;
		}

	});

	/**
	 * 主界面 - button - 销批
	 */
	$("#btn-xp-advBudgetItem").off("click").on("click", function(e) {
		var xpDt = [];
		$("#" + tblId + " tbody tr").each(function(index, row) {
			var $chk = $(this).find("input[type='checkbox']");
			if($chk.is(":checked") == true) {
				xpDt[xpDt.length] = tblObj.row(this).data();
			}
		});
		if(xpDt.length > 0) {
			ufma.confirm("确定要销批当前选中指标吗?", function(rst) {
				if(!rst) {
					return false;
				}

				bgItemManager.cancelReplyBgItems(xpDt, curBgPlanData.chrId,
					function(result) {
						ufma.showTip("销批成功", null, "success");
						pnlFindRst.doFindBtnClick();
					},
					function(msg) {
						ufma.showTip(msg, null, "error");
					}
				);

			}, {
				'type': 'warning'
			});
		} else {
			ufma.showTip('请先选择要销批的指标', function() {}, 'warning');
			return false;
		}

	});
	/**
	 * 主界面-导出
	 */
	$('#export').click(function() {
		$("#mainTable_advBudgetItem").ufTableExport({
			fileName: "预拨/批复指标", //导出表名
			ignoreColumn: "-1" //不需要导出的LIE
		});
	});
	/**
	 * 模态框 - 取消 按钮
	 */
	$("#btn-modal-close").off("click").on("click", function(e) {
		ufma.confirm("此操作将清空批复金额，是否继续?", function(rst) {
			if(!rst) {
				return false;
			}
			modal_Obj.close();
			for(var i = 0; i < tblObj.rows().data().length; i++) {
				tblObj.rows().data()[i].shouldSave = "0";
			}
			if(refreshAfterCloseModal) {
				pnlFindRst.doFindBtnClick();
			}
		}, {
			'type': 'warning'
		});
	});

	/**
	 * 模态框 - 确定 按钮
	 */
	$("#btn-modal-save").off("click").on("click", function(e) {
		ufma.confirm("确定要批复当前指标吗?", function(rst) {
			if(!rst) {
				return false;
			}
			var tmpModalTblDt = modal_tableObj.rows().data();
			var pfDt = [];
			for(var i = 0; i < tmpModalTblDt.length; i++) {
				var curRowDt = tmpModalTblDt[i];
				if(!$.isNull(curRowDt.bgItemCur) && curRowDt.bgItemCur != 0) {
					pfDt[pfDt.length] = {
						bgItemId: curRowDt.bgItemId,
						bgItemCur: curRowDt.bgItemCur,
						bgReplyDate: _BgPub_getCurentDate(),
						bgReplyUser: _bgPub_getUserMsg().userName,
						bgReplyUserName: _bgPub_getUserMsg().userName
					};
				}
			}
			bgItemManager.replyBgItems(pfDt, curBgPlanData.chrId,
				function(result) {
					ufma.showTip("批复成功", null, "success");
					refreshAfterCloseModal = true;
					modal_Obj.close();
					for(var i = 0; i < tblObj.rows().data().length; i++) {
						tblObj.rows().data()[i].shouldSave = "0";
					}
					pnlFindRst.doFindBtnClick();
				},
				function(msg) {
					ufma.showTip(msg, null, "error");
				}
			);
		}, {
			'type': 'warning'
		});
	})
	//********************************************************[界面入口函数]*****************************************************
	var page = function() {
		return {
			init: function() {
				ufma.parse();
				reslist = ufma.getPermission();
				page.pfData = ufma.getCommonData();
				page.setYear=parseInt(page.pfData.svSetYear);
				page.rgCode=page.pfData.svRgCode;
				ufma.isShow(reslist);
				bgItemManager = new _bgPub_itemManager();
				bgItemManager.bgItemReserve = bgItemReserve_yb;
				//pnlFindRst = _PNL_MoreByBgPlan('bgMoreMsgPnl_advBudgetItem', moreMsgSetting); //加载头部更多
				_bgPub_Bind_Cbb_AgencyList("cbb_agency_advBudgetItem", { //绑定单位
					afterChange: function(treeNode) {

						setTimeout(function() {
							$('.ufma-combox-popup').css({
								'display': 'none'
							});
						}, 100);
						bgItemManager.agencyCode = treeNode.id;
						moreMsgSetting.agencyCode = treeNode.id;
						//80827 【财务云8.0 鄂尔多斯 】20190630所有页面，单位或账套选择变化后，再打开其它页面时，自动显示为最近一次选择的单位或账套。--zsj
						//缓存单位
						var params = {
							selAgecncyCode: treeNode.id,
							selAgecncyName: treeNode.name
						}
						ufma.setSelectedVar(params);
						//CWYXM-12690--根据系统选项判断发文文号是否必填，若必填则将列名“发文文号”改完指标id--zsj
						var bgUrl = '/bg/sysdata/selectSysRgParaValue?rgCode=' + page.rgCode + '&setYear=' + page.setYear + '&agencyCode=' + treeNode.id + '&chrCode=BG003';
						ufma.get(bgUrl, {}, function(result) {
							page.needSendDocNum = result.data;
							if(page.needSendDocNum == true) {
								page.sendCloName = "指标id";
							} else {
								page.sendCloName = "发文文号";
							}
						});
						pnlFindRst = _PNL_MoreByBgPlan('bgMoreMsgPnl_advBudgetItem', moreMsgSetting); //根据单位的变化重新加载头部更多

					}
				});

			}
		};
	}();

	page.init();

});