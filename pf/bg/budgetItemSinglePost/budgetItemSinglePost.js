$(function () {

	var curBgPlanData = null; //当前选中的预算方案
	var curAgencyData = null; //当前选中的单位
	var acctCode = "201701";    //账套
	var agencyCode = "001";     //单位
	var setYear = "2017";       //年度
	var bgItemTable = "bgItemTable";
	var eleCdtn = null;
	var tblFix_Oper = null;
	var table_titleHeight = 37;
	var tblDt;
	var span_bgCur = 0;
	var span_haveAllocatCur = 0;
	var span_canAllocatCur = 0;
	var pnlFindRst = null;
	var cellTree = null;
	var leftTree = null;

	var maEle_CbbOnChange = function (data) {

	};

	var tbl_clearCbbCell = function () {
		if (cellTree == null || cellTree.setting == null) {
			return;
		}
		var $td = $("#" + cellTree.setting.id);
		$td.empty();
		$td.removeAttr("id");
		$td.removeAttr("class");
		$td.removeAttr("style");
		$td.removeAttr("aria-new");
	};

	var tbl_afterCbbSelect_cellChange = function (data) {
		var $td = $("#" + cellTree.setting.id);
		var tbl = $("#" + bgItemTable).DataTable();
		$td.empty();
		$td.removeAttr("id");
		$td.removeAttr("class");
		$td.removeAttr("style");
		$td.removeAttr("aria-new");
		if (data.codeName != null && data.codeName != '') {
			tbl.cell($td).data(data.codeName);
			tbl.row($td).data().shouldSave = "1";
		}
	};

	/**
	 * 表格金额输入发生了变动后的处理, 修改对应的data
	 */
	var tbl_afterInputMoney_cellChange = function (value, doc) {
		var tbl = $("#" + bgItemTable).DataTable();
		var val = value;
		if (val == null || val == '') {
			val = '0';
		}
		tbl.cell(doc).data(val);
		tbl.row(doc).data().shouldSave = "1";
	};

	/**
		根据左侧树节点的选中与否，过滤指标表格
	*/
	var doFilterMainTable = function () {
		if (leftTree == null) { return; }
		if (tblDt == null || tblDt.length == 0) { return; }
		var allNodes = leftTree.getNodes();
		var tbl = $("#" + bgItemTable).DataTable();
		var sKey = _BgPub_getEleDataFieldNameByCode(pnlFindRst.curBgPlanMsg.priEle, pnlFindRst.curBgPlanMsg.priEleFieldName);
		var tempTblDt = [];
		for (var i = 0; i < allNodes.length; i++) {
			var sChrCode = allNodes[i].chrCode;
			if (allNodes[i].checked) {
				for (var j = 0; j < tblDt.length; j++) {
					if (tblDt[j][sKey].startWith(sChrCode)) {
						tempTblDt.push(tblDt[j]);
					}
				}
			}
		}
		doRepaintBgItemTable(tempTblDt);
		// tbl.draw();
	};

	/**
	 * 根据指标表格的数据，重画左侧树的节点是否处于check状态
	 * @return {[type]} [description]
	 */
	var repaintBgItem_leftTree_NodesCheckStatus = function () {
		setTimeout(function () {
			if (leftTree == null) { return; }
			if (tblDt == null || tblDt.length == 0) { return; }
			var allNodes = leftTree.getNodes();
			var tbl = $("#" + bgItemTable).DataTable();
			var sKey = _BgPub_getEleDataFieldNameByCode(pnlFindRst.curBgPlanMsg.priEle, pnlFindRst.curBgPlanMsg.priEleFieldName);
			var tempTblDt = tbl.data();
			leftTree.checkAllNodes(false);
			for (var i = 0; i < allNodes.length; i++) {
				var tmpNode = allNodes[i];
				var sChrCode = tmpNode.chrCode;
				for (var j = 0; j < tempTblDt.length; j++) {
					var sKeyVal = tempTblDt[j][sKey];
					if (sKeyVal.substring(0, sKeyVal.indexOf(" ")) == sChrCode) {
						leftTree.checkNode(tmpNode, true, true, true);  //check = true
					}
				}
			}
		}, 500);
	};

	/**
	 *  根据预算方案的变动，重绘左侧树
	 */
	var repaintBgItem_leftTree = function () {
		if (pnlFindRst.curBgPlanMsg.priEle == "") {
			//没有主要素，隐藏左侧树
			$("#bgitemlefttree").hide();
			$("#bgItemMainPnl").css("width", "100%");
			leftTree = null;
		} else {
			//有主要素，显示并组织左侧树
			$("#bgitemlefttree").show();
			$("#bgItemMainPnl").css("width", (parseInt($("#div_bgitembody").css("width")) - parseInt($("#bgitemlefttree").css("width")) - 13));
			var set = {
				url: _bgPub_requestUrlArray_subJs[9] + "?agencyCode=" + agencyCode + "&setYear" + page.pfData.svSetYear + "&eleCode=" + pnlFindRst.curBgPlanMsg.priEle +
					"&eleLevel=" + pnlFindRst.curBgPlanMsg.priEleLevel,
				pIdKey: "pId",
				idKey: "id",
				nameKey: "codeName",
				async: false,
				checkbox: true,
				onClick: function (e, treeId, treeNode, clickFlag) {
					if (!treeNode.checked) {  //通过点击节点来修改checkbox的属性
						leftTree.checkNode(treeNode, true, true, true);  //check = true
					} else {
						leftTree.checkNode(treeNode, false, true, true); //check = false
					}
				},
				onDblClick: function (e) { },
				addHoverDom: function (treeId, treeNode) {
					var aObj = $("#" + treeNode.tId + "_a");
					if ($("#diyBtn_" + treeNode.id).length > 0) return;

					var editStr = '<a class="btn btn-icon-only btn-sm" data-toggle="tooltip" action= "unactive" ' +
						'title="增加" id="diyBtn_space_' + treeNode.id + '">' +
						'<span class="glyphicon icon-plus delSpan" id="diyBtn_' + treeNode.id + '"></span></a>';
					aObj.append(editStr);
				},
				removeHoverDom: function (treeId, treeNode) {
					$("#diyBtn_" + treeNode.id).unbind().remove();
					$("#diyBtn_space_" + treeNode.id).unbind().remove();
				},
				onCheck: function (e, treeId, treeNode) {
					doFilterMainTable();
				},
				//************************************************************
				beforeDrag: function (treeId, treeNodes) { return false; },
				beforeEditName: function (treeId, treeNode) { return false; },
				beforeRemove: function (treeId, treeNode) { return false; },
				onRemove: function (e, treeId, treeNode) { return false; },
				beforeRename: function (treeId, treeNode, newName, isCancel) { return false; },
				onRename: function (e, treeId, treeNode, isCancel) { return false; },
				showRemoveBtn: function (treeId, treeNode) { return false; },
				showRenameBtn: function (treeId, treeNode) { return false; }
				//*************************************************************
			};
			leftTree = $("#bgitemlefttree_ul").bgPriEleTree(set);
		}
	};

	/**
	 * 计算全部的总金额
	 */
	var doComputTotalMoney = function () {
		span_bgCur = 0;
		$("#" + bgItemTable + " tbody tr").each(function (e) {
			var rowdata = $("#" + bgItemTable).DataTable().row($(this)).data();
			if (rowdata == null) { return; }
			span_bgCur = parseFloat(span_bgCur) + parseFloat(rowdata.bgItemCur);
			span_haveAllocatCur = 0;
			span_canAllocatCur = 0;
			rowdata.shouldSave = "0";
		});
		$("#span_bgCur").text(span_bgCur);
		$("#span_haveAllocatCur").text(span_haveAllocatCur);
		$("#span_canAllocatCur").text(span_canAllocatCur);
	};

	/**
	 * 绘制日志的table
	 */
	var doDrawItemLogTable = function (bgItemId) {
		var colObj = [];
		colObj[0] = {
			title: "发生时间",
			data: "optTime",
			width: "180px"
		};
		colObj[1] = {
			title: "行为",
			data: "optType"
		};
		colObj[2] = {
			title: "操作人",
			data: "optUser"
		};
		colObj[3] = {
			title: "指标编码",
			data: "bgItemCode"
		};
		var i = 4;
		for (var iIndex = 0; iIndex < curBgPlanData.planVo_Items.length; iIndex++) {
			var itemObj = curBgPlanData.planVo_Items[iIndex];
			colObj[i] = {
				title: itemObj.eleName,
				data: _BgPub_getEleDataFieldNameByCode(itemObj.eleCode, itemObj.eleFieldName)
			};
			i++;
		}
		colObj[i] = {
			title: "预算金额",
			data: "bgItemCur",
			width: "150px"
		};
		var colDef = [];
		colDef[0] =
			{
				"targets": [1],
				"render": function (data, type, rowdata, meta) {
					if (data == '01') {
						return '新增';
					} else if (data == '02') {
						return '修改';
					} else if (data == '03') {
						return '删除';
					} else {
						return data;
					}
				}
			};
		var itemLogTbl = $("#bgItemLogTable").dataTable({
			"ajax": {
				"url": _bgPub_requestUrlArray_subJs[2],
				"data": { "acctCode": acctCode, "agencyCode": agencyCode, "bgItemId": bgItemId },
				"type": "get",
				"dataSrc": "data.logs"
			},
			columns: colObj,
			columnDefs: colDef,
			"bFilter": false, // 去掉搜索框
			"bLengthChange": true, // 去掉每页显示多少条数据
			"processing": true,// 显示正在加载中
			"bInfo": false,// 页脚信息
			"bSort": false, // 排序功能
			"bAutoWidth": false,// 表格自定义宽度，和swidth一起用
			"bProcessing": true,
			"bDestroy": true,
			"dom": "rt"
		});
	};

	/**
	 * 显示日志的div    getURL(0) + "/bg/budgetItem/budgetItemLog", //2  获得指标日志
	 */
	var doShowItemLog = function (row) {
		$("#bgItemLog").css("top", row.offset().top + parseInt(row.css("height")) + 2);
		$("#bgItemLog").css("left", $("#bgitemmidtable").offset().left);
		$("#bgItemLog").css("display", "block");
		$("#bgItemLog").css("width", $("#bgitemmidtable").css("width"));
		var rowDt = $("#" + bgItemTable).DataTable().row(row).data();
		doDrawItemLogTable(rowDt.bgItemId);
	};
	/**
	 * 隐藏日志的div
	 */
	var doHideItemLog = function () {
		var bgitemTbl = $("#bgItemLogTable").DataTable();
		bgitemTbl.destroy();
		$("#bgItemLogTable").empty();
		$("#bgItemLog").css("display", "none");
	};

	/**
	 * 显示快速替换框的div
	 */
	var doShowItemExchange = function (top, left) {
		$("#bgItemExchange").css("top", top);
		$("#bgItemExchange").css("left", left);
		$("#bgItemExchange").css("display", "block");

	};
	/**
	 * 隐藏快速替换框的div
	 */
	var doHideItemExchange = function () {
		$("#bgItemExchange").css("display", "none");
	};

	/**
	 * 根据data执行重新绘制表格的行为
	 */
	var doRepaintBgItemTable = function (pData) {
		var bgitemTbl = $("#" + bgItemTable).DataTable();
		bgitemTbl.destroy();
		$("#" + bgItemTable).empty();
		var colObjs = [];
		var colDefObjs = [];
		var colWidth = 0;
		//********************* 增加columns的参数 ****************************************
		var i = 0;
		if (pnlFindRst.curBgPlanMsg.priEle != "") {
			colObjs[i] = {
				title: pnlFindRst.curBgPlanMsg.priEleName,
				data: _BgPub_getEleDataFieldNameByCode(pnlFindRst.curBgPlanMsg.priEle, pnlFindRst.curBgPlanMsg.priEleFieldName),
				width: "200px"
			};
			i++;
			colWidth = colWidth + 200;
		}
		colObjs[i] = {
			title: "指标编码",
			data: "bgItemCode",
			width: "150px",
			className: "UnEdit"
		};
		i++;
		colWidth = colWidth + 150;
		for (var iIndex = 0; iIndex < curBgPlanData.planVo_Items.length; iIndex++) {
			var itemObj = curBgPlanData.planVo_Items[iIndex];
			if (pnlFindRst.curBgPlanMsg.priEle != "" && itemObj.eleCode == pnlFindRst.curBgPlanMsg.priEle) { continue; }
			colObjs[i] = {
				title: itemObj.eleName,
				data: _BgPub_getEleDataFieldNameByCode(itemObj.eleCode, itemObj.eleFieldName),
				width: "200px"
			};
			i++;
			colWidth = colWidth + 200;
		}
		colObjs[i] = {
			title: "预算金额",
			data: "bgItemCur",
			width: "150px"
		};
		i++;
		colWidth = colWidth + 150;

		if (pnlFindRst.curBgPlanMsg.priEle != "") {
			colObjs[i] = {
				title: "已分配金额",
				data: "bgItemFpedCur",
				type: "money",
				width: "150px",
				className: "UnEdit"
			};
			i++;
			colWidth = colWidth + 150;
			colObjs[i] = {
				title: "可分配金额",
				data: "bgItemCanFpCur",
				type: "money",
				width: "150px",
				className: "UnEdit"
			};
			i++;
			colWidth = colWidth + 150;
		}

		colObjs[i] = {
			title: "操作",
			data: "bgItemCode",
			width: "100px",
			className: "UnEdit"
		};
		colWidth = colWidth + 100;
		//*********************************************************************************

		//*********** 增加 columnDefs 的参数 ************************
		colDefObjs[0] = {
			"targets": [-1],
			"serchable": false,
			"orderable": false,
			"className": "rowNum",
			"render": function (data, type, rowdata, meta) {
				return '<a class="btn btn-icon-only btn-sm" data-toggle="tooltip" action= "unactive" ' +
					'rowid="' + data + '" title="删除">' +
					'<span class="glyphicon icon-trash delSpan"></span></a>' +
					'<a class="btn btn-icon-only btn-sm" data-toggle="tooltip"  action= "unactive" ' +
					'rowid="' + data + '" title="附件">' +
					'<span class="glyphicon icon-paperclip paperSpan"></span></a>' +
					'<a class="btn btn-icon-only btn-sm" data-toggle="tooltip"  action= "unactive" ' +
					'rowid="' + data + '" title="日志">' +
					'<span class="glyphicon icon-file logSpan"></span></a>';
			}
		}
		//*********************************************************
		var isScrollY = parseInt($("#bgitemmidtable").css("height")) - table_titleHeight;
		var tblSetting = {
			"data": pData,
			"columns": colObjs,
			"columnDefs": colDefObjs,
			"ordering": false,
			"lengthChange": false,
			"paging": false,
			"bFilter": false, // 去掉搜索框
			"processing": true,// 显示正在加载中
			"bInfo": false,// 页脚信息
			"bSort": false, // 排序功能
			"autoWidth": true,  //配合列宽，注意，TRUE的时候是关闭自动列宽，坑死了
			"scrollX": true,
			"scrollY": isScrollY,
			"select": true,
			"bDestroy": true,
			"dom": 'rt',
			"fnDrawCallback": function (setting, json) { }
		};
		var tbl = null;
		if (typeof (pData) != 'undefined' && pData.length > 0) {
			if (colWidth > parseInt($("#bgitemmidtable").css("width"))) {
				// tblFix_Oper = _bgPub_newTblFlixCol(tbl, {"leftColumns" : 0, "rightColumns" : 1});
				tblSetting.fixedColumns = { "leftColumns": 0, "rightColumns": 1 };
			}
		}
		tbl = $("#" + bgItemTable).DataTable(tblSetting);
		var $clostDiv = $("#" + bgItemTable).closest("div");
		$($clostDiv).css("border-bottom", "0px black solid");

		//表头为要素增加可替换的图片
		var tHead = tbl.table().header();
		$(tHead).find("th").each(function () {
			var thText = $(this).text();
			for (var iIndex = 0; iIndex < curBgPlanData.planVo_Items.length; iIndex++) {
				var itemObj = curBgPlanData.planVo_Items[iIndex];
				if (itemObj.eleName == thText) {
					$(this).append(
						'&nbsp;<a class="table-head-exchange btn-sm" data-toggle="tooltip" action= "unactive" title="替换">' +
						'<span class="glyphicon icon-replace" id="thSpan_"' + itemObj.eleCode + ' value=' + itemObj.eleCode + '></span></a>');
					break;
				}
			}
		});

		//table绑定事件
		$(tbl.table().container()).off("click", ".delSpan").on("click", ".delSpan", function (e) { //删除
			//		getURL(0) + "/bg/budgetItem/singlePost/delBudgetItems",  //5  指标删除
			var rowData = tbl.row($(this).closest("tr")).data();
			ufma.confirm("确定要删除本行指标吗?", function (action) {
				if (action) {
					var delDt = {};
					delDt.agencyCode = agencyCode;
					delDt.items = [rowData];

					ufma.post(
						_bgPub_requestUrlArray_subJs[20],
						delDt,
						function (result) {
							if (result.flag == "success") {
								ufma.showTip("指标删除成功。 ", null, "success");
								tbl.row($(this)).remove().draw();
								doComputTotalMoney();
							} else {
								ufma.showTip("指标删除失败 ： " + result.msg, null, "error");
							}
						}
					);
				}
			});
		});
		$(".paperSpan").off("click").on("click", function (e) { //附件
			var row = tbl.table().row(this);
			var existFiles = [];
			var paperOption = {
				'agencyCode': agencyCode,
				'billId': row.chrId,
				'uploadURL': "",
				'downloadURL': '',
				'delURL': ''
			};
			_bgPub_ImpAttachment("budgetItemSinglePost", "附件导入", existFiles, paperOption);
		});
		$(".logSpan").off("click").on("click", function (e) { //日志
			var row = $(this).closest("tr");
			//日志框
			if ($("#bgItemLog").css("display") == "none") {
				doShowItemLog(row);
			} else {
				doHideItemLog();
			}
		});
		$(tbl.table().container()).off("dblclick", "td:not(.UnEdit)").on("dblclick", "td:not(.UnEdit)", function (e) {//双击编辑单元格
			// off("click", "td:not(.UnEdit)").on("click", "td:not(.UnEdit)", function(e){ //双击编辑单元格
			// $("#" + bgItemTable + " tbody td :not(.UnEdit)").on("dblclick", function(e){//双击编辑单元格
			var row = $(this).closest("tr");
			var col = tbl.column(this);

			var sId = col.dataSrc();
			tbl_clearCbbCell();

			if (sId == "bgItemCur") {  //指标金额
				_BgPub_Bind_InputMoney(this, sId + "_money", tbl_afterInputMoney_cellChange, tbl.cell(this).data());
				$("#" + sId + "_money").blur(function (e) {
					var tmpE = jQuery.Event("keyup");
					tmpE.keyCode = 13;
					$("#" + sId + "_money").trigger(tmpE);
				});
				$("#" + sId + "_money").focus();
				$("#" + sId + "_money").select();
			} else {
				for (var iIndex = 0; iIndex < curBgPlanData.planVo_Items.length; iIndex++) {
					var itemObj = curBgPlanData.planVo_Items[iIndex];
					var sTblTitleField = _BgPub_getEleDataFieldNameByCode(itemObj.eleCode, itemObj.eleFieldName);
					if (sTblTitleField == sId) {
						var tmpFullName = tbl.cell(this).data();
						var billStatus = '1'; //新增
						if (!$.isNull(tmpFullName)) {
							billStatus = '0'; //编辑
						}
						//先清空cell里面的值
						tbl.cell(this).data('');
						cellTree = _BgPub_Bind_EleComboBox_Single(this, itemObj.eleCode, itemObj.eleName, itemObj.eleLevel,
							tbl_afterCbbSelect_cellChange, agencyCode, null, null, billStatus);
						$("#" + cellTree.setting.id).css("width", "200px");
						$("#" + cellTree.setting.id).blur(function (e) {
							tbl_afterCbbSelect_cellChange({});
						});
						break;
					}
				}
			}
			ufma.isShow(reslist);
		});
	};

	/**
	 * 根据预算方案的变动，重绘指标表格 - 1, 获得服务器数据，调用重绘行为
	 * @parameter bNotRepaintTbl : boolean true=只获得服务器的数据，存入tblDt，不重绘表格；
	 *            												 false=重绘表格。（默认值=false）
	 */
	var repaintBgItem_itemTable = function (bNotRepaintTbl, pEleCdtn) {
		//************ 增加ajax的参数 *******************
		eleCdtn = null;
		var surl = _bgPub_requestUrlArray_subJs[18] + "?agencyCode=" + agencyCode;
		if ($.isNull(pEleCdtn)) {
			eleCdtn = new eleInBgItemObj();
			eleCdtn.agencyCode = agencyCode;
			eleCdtn.setYear = page.pfData.svSetYear;
			eleCdtn.chrId = curBgPlanData.chrId;
			//请求添加主要素
			if (pnlFindRst.curBgPlanMsg.priEle == "") {
				eleCdtn.priEle = "";
			} else {
				eleCdtn.priEle = pnlFindRst.curBgPlanMsg.priEle;
			}
		} else {
			eleCdtn = $.extend({}, pEleCdtn);
		}
		//**********************************************
		ufma.post(surl,
			eleCdtn,
			function (result) {
				tblDt = result.data.items;
				if (bNotRepaintTbl) { return; }
				doRepaintBgItemTable(tblDt);
				doComputTotalMoney();
			}
		);
	};

	var moreMsgSetting = {
		"agencyCode": agencyCode,
		computHeight: function (tblH_before, tblH_after) {
			var d = $("#bgitemlefttree").css("height");
			var d2 = $("#bgitemmidtable").css("height");
			//重新计算下面的树的高度
			var change = (parseInt(tblH_after) - parseInt(tblH_before));
			var rst = parseInt(d) - change;
			var rst2 = parseInt(d2) - change;
			$("#bgitemlefttree").css("height", rst);
			$("#bgitemlefttree").css("max-height", rst);
			$("#bgItemMainPnl").css("height", rst);
			$("#bgitemmidtable").css("height", rst2);
			doRepaintBgItemTable(tblDt);
		},
		changeBgPlan: function (data) {
			//实在找不到原因，ufma-combox-popup默认不显示
			setTimeout(function () {
				$('.ufma-combox-popup').css({
					'display': 'none'
				});
			}, 100);
			curBgPlanData = data;
			//根据预算方案重新绘制整个界面
			//1, 根据是否具备主要素，绘制左侧树的情况。
			repaintBgItem_leftTree();
			//2, 绘制指标表格的情况
			repaintBgItem_itemTable();
			//3, 根据表格情况绘制左侧树的勾选状态
			repaintBgItem_leftTree_NodesCheckStatus();
		},
		afterFind: function (data) {
			tblDt = data.data.items;
			doRepaintBgItemTable(tblDt);
			doComputTotalMoney();
		},
		doFindBySelf: function (eleCdtn) {
			repaintBgItem_itemTable(false, eleCdtn);
		}
	};


	//---------------------------binding -----------------------------------------------------------
	//快速替换-标题icon：显示/隐藏
	$(document).on("click", ".icon-replace", function (e) {
		var th_exchange = $(this).closest("th");
		if ($("#bgItemExchange").css("display") == "none") {
			var iTop = th_exchange.offset().top + parseInt($(this).closest("tr").css("height")) + 2;
			var iLeft = th_exchange.offset().left
			doShowItemExchange(iTop, iLeft);

			for (var iIndex = 0; iIndex < curBgPlanData.planVo_Items.length; iIndex++) {
				var itemObj = curBgPlanData.planVo_Items[iIndex];
				if (itemObj.eleCode == $(this).attr("value")) {
					_BgPub_Bind_EleComboBox(['bgItemExchange_From'], [itemObj.eleCode], [itemObj.eleName], [itemObj.eleLevel],
						[maEle_CbbOnChange], agencyCode, null, null);
					_BgPub_Bind_EleComboBox(['bgItemExchange_To'], [itemObj.eleCode], [itemObj.eleName], [itemObj.eleLevel],
						[maEle_CbbOnChange], agencyCode, null, null);
					break;
				}
			}
		} else {
			doHideItemExchange();
		}
	});

	//指标新增
	$(document).on("click", "#btn-newItem", function (e) {
		ufma.get(_bgPub_requestUrlArray_subJs[3],//3  新增一条指标
			{ "bgPlanChrId": curBgPlanData.chrId, "bgPlanChrCode": curBgPlanData.chrCode, "agencyCode": agencyCode, "setYear": page.pfData.svSetYear },
			function (result) {
				if (result.flag == "success") {
					if (tblDt.length == 0) {
						tblDt[0] = result.data;
						doRepaintBgItemTable(tblDt);
					} else {
						$("#" + bgItemTable).DataTable().row.add(result.data).draw();
					}
				}
			});
	});

	//指标保存
	$(document).on("click", "#btn-saveItem", function (e) {
		var saveDt = {};
		var rowData = null;
		saveDt.agencyCode = agencyCode;
		saveDt.setYear = page.pfData.svSetYear;
		saveDt.items = [];
		$("#" + bgItemTable + " tbody tr").each(function (e) {
			rowData = $("#" + bgItemTable).DataTable().row(e).data();
			if (rowData.isNew == "是") {
				saveDt.items[saveDt.items.length] = rowData;
			} else if (rowData.shouldSave != null) {
				if (rowData.shouldSave == "1") {
					saveDt.items[saveDt.items.length] = rowData;
				}
			}
		});
		if (saveDt.items.length == 0) {
			ufma.showTip("没有要保存的指标. ", null, "warning");
		} else {
			ufma.confirm('确定要保存指标吗?', function (action) {
				if (action) {
					ufma.post(_bgPub_requestUrlArray_subJs[19],//getURL(0) + "/bg/budgetItem/singlePost/saveBudgetItems", //4 指标保存
						saveDt,
						function (result) {
							if (result.flag == "success") {
								ufma.showTip("保存成功.", null, "success");

								$("#" + bgItemTable + " tbody tr").each(function (e) {
									var rowdata = $("#" + bgItemTable).DataTable().row($(this)).data();
									rowdata.shouldSave = "0";
									rowData.isNew = "否";
								});

								repaintBgItem_itemTable(true);  //获得全部指标数据，存放在tblDt中
								repaintBgItem_leftTree_NodesCheckStatus();
								doComputTotalMoney();
							} else {
								ufma.showTip("保存失败 : " + result.msg, null, "error");
							}
						});
				}
			});
		}
	});

	//xls文件导入
	$(document).on("click", "#btn-impItem", function (e) {
		var setting = _ImpXlsFile("budgetItemSinglePost", "bgItem", curBgPlanData.chrId, function (data) {
			tblDt = data.data.items;
			doRepaintBgItemTable(tblDt);
			setting.closeModal();
		}, function (data) {
			ufma.showTip(data.msg, null, "error");
		});
	});

	//xls文件导出
	$(document).on("click", "#btn-expItem", function (e) {
		var requestParam = {
			"bgPlanChrId": curBgPlanData.chrId,
			"items": []
		};

		$("#" + bgItemTable + " tbody tr").each(function (e) {
			var rowdata = $("#" + bgItemTable).DataTable().row($(this)).data();
			var item = {};
			item.bgItemCode = rowdata.bgItemCode;
			for (var j = 0; j < pnlFindRst.curBgPlanMsg.eleCodeArr.length; j++) {
				var sName = _BgPub_getEleDataFieldNameByCode(pnlFindRst.curBgPlanMsg.eleCodeArr[j],
					pnlFindRst.curBgPlanMsg.eleFieldName[j]);
				item[sName] = rowdata[sName];
			}
			item.bgItemCur = rowdata.bgItemCur;
			item.bgItemCanFpCur = rowdata.bgItemCanFpCur;
			item.bgItemFpedCur = rowdata.bgItemFpedCur;
			requestParam.items.push(item);
		});

		ufma.post(_bgPub_requestUrlArray_subJs[21],
			requestParam,
			function (result) {
				if (result.flag == "success") {
					window.location.href = result.data;
				} else {
					ufma.showTip(result.data, null, "error");
				}
			});
	});

	//快速替换-替换
	$(document).on("click", "#btn-exchange", function (e) {

	});

	//快速替换-取消
	$(document).on("click", "#btn-unexchange", function (e) {
		doHideItemExchange();
	});

	//测试专用
	$(document).on("click", "#btn-test", function (e) {

	});
	//------------------------------ page begin ------------------------------------------------------------
	var page = function () {
		return {
			init: function () {
				reslist = ufma.getPermission();
				ufma.isShow(reslist);
				ufma.parse();
				ufma.showloading("正在加载单位信息和对应的预算方案");
				_bgPub_Bind_Cbb_AgencyList("cbb_agency", {
					// afterChange : function(tree, treeNode){
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
						pnlFindRst = _PNL_MoreByBgPlan('bgMoreMsgPnl', moreMsgSetting); //重新加载头部更多
						ufma.isShow(reslist);
						ufma.hideloading();
					}
				});
				
				//计算界面元素的高度，所有的高度计算根本，依赖于    $(".workspace").css("height") ****************************************
				//				$(".workspace").css("height", parseInt($(document.body).outerHeight(true) - 50));
				var h_workspace = parseInt($(".workspace").css("height"));
				var h_workspace_top = parseInt($(".workspace-top").css("height"));
				var h_div_findMsg = parseInt(pnlFindRst.curHeight);
				//.workspace:padding 8px 8px 8px 8px; border:1px
				var h_workspace_center = h_workspace - 2 * 8 - 2 * 1 - h_workspace_top;
				var h_div_bgItemBody = h_workspace_center - h_div_findMsg;
				//.div-bgitembody-lefttree:margin 12px 12px 12px 0
				var h_div_bgItemBody_leftTree = h_div_bgItemBody - 2 * 12; //=.div-bgitembody-midtable =#bgitemmidtable
				var h_div_bgItemTable_bottomMsg = parseInt($(".bgItemTbl-Msg").css("height"));
				var h_div_bgItemTable_bottomBtn = parseInt($(".bgItemTbl-Btn").css("height"));
				var h_div_bgItemTable = h_div_bgItemBody_leftTree - h_div_bgItemTable_bottomMsg - h_div_bgItemTable_bottomBtn;
				//bgItemMainPnl
				$(".div-bgitembody-lefttree").css("height", h_div_bgItemBody_leftTree);
				$(".div-bgitembody-midtable").css("height", h_div_bgItemBody_leftTree);
				$(".bgItemTbl-Height").css("height", h_div_bgItemTable);
				$("#bgItemMainPnl").css("width", (parseInt($("#div_bgitembody").css("width")) - parseInt($("#bgitemlefttree").css("width")) - 13));
				//*******************************************************************************************************************
				page.pfData = ufma.getCommonData();
			}
		}
	}();

	page.init();




});
