$(function() {
	var mainDivId = "budgetItemTwoSidesAdjust";
	var pnlFindRst = null;
	var tblDt = null; //指标数据
	var tblId = "mainTable-twoSidesAdjItem";
	var tblObj = null;
	var tblCellTree = null;
	var modal_Obj = null; //模态框的对象
	var modal_table_sheet1 = null; // 页签一：调出指标选择表格
	var modal_table_sheet2 = null; // 页签二：调入指标选择表格
	var modal_table_sheet3_out = null; //页签三：调出指标确定表格
	var modal_table_sheet3_in = null; // 页签三：调入指标确定表格
	var modal_tableId_sheet1 = "twoSidesAdjItemTable_Modal_out";
	var modal_tableId_sheet2 = "twoSidesAdjItemTable_Modal_in";
	var modal_tableId_sheet3_out = "table_outItems_selected";
	var modal_tableId_sheet3_in = "table_inItems_selected";
	var modal_select_outItems = []; //选择的调剂出的指标
	var modal_select_inItems = []; //选择的调剂入的指标
	var modal_curSheetIndex = 1;
	var modal_curBill = null; //当前的模态框的调剂单据
	var modal_pnlFindRst_itemout = null;
	var modal_pnlFindRst_itemin = null;
	var modal_clearTableAfterSave = false; //保存后清空表格
	var modal_open_type = 1; // 模态框打开的方式。1=新增状态打开   2=修改状态打开。默认是1.
	var tblPrintBtnClass = "mainTable-twoSideAdjItem-printBtn";
	var tblPrintBtnClassExpXls = "mainTable-twoSideAdjItem-expXlsBtn";
	var maxDetailCount_eachBill = 6; //每条单据最大的显示行数
	var bgItemManager = null; // _bgPub_itemManager;
	var bgItemManager_modal_out = null; // _bgPub_itemManager; 模态框专用
	var bgItemManager_modal_in = null; // _bgPub_itemManager; 模态框专用
	var refreshAfterCloseModal = true;
	var progressController = null; //浮层进度条的控制器
	var modal_billAttachment = []; //单据的附件
	//bug77471--zsj
	var attachNum = 0; //附件前输入框数字
	var pageAttachNum = 0; //后端返回的附件数字
	var fileLeng = 0; //实际上传文件数
	var tempBeginCur = null;
	var tempBeginPid = null;
	var curBgPlanData = null; //主界面预算方案
	var cacheSheet3In = [];
	var cacheSheet3Out = [];
	//CWYXM-10166 指标编制、指标控制管理界面记忆预算方案--新增需求记忆预算方案--传给bgPub.js的数据--zsj
	var acctCode = '*';
	var openType = 'new';
	var menuId = '30ec25c4-e32e-4719-9e9d-fcc17e3f417a';
	//弹窗保存时的方案id和name
	var cbBgPlanId = '';
	var cbBgPlanText = '';
	//主界面的方案id和name
	var cbBgPlanIdMain = "";
	var cbBgPlanTextMain = "";
	var bgPlanCacheId = 'cbBgPlan';
	var moreMsgSetting = {
		"agencyCode": '',
		showMoney: false,
		dateTimeAtFirst: true,
		computHeight: function(tblH_before, tblH_after) {

		},
		changeBgPlan: function(data) {
			//实在找不到原因，ufma-combox-popup默认不显示
			setTimeout(function() {
				$('.ufma-combox-popup').css({
					'display': 'none'
				});
			}, 100);
			curBgPlanData = data;
			bgItemManager.loadBgPlanObjFromObj(data);
			pnlFindRst.doFindBtnClick();
		},
		afterFind: function(data) {},
		doFindBySelf: function(eleCdtn) {
			showTblData(false, eleCdtn);
		}
	};
	var moreMsgSetting_modal_out = {
		"agencyCode": '',
		showMoney: false,
		dateTimeAtFirst: true,
		computHeight: function(tblH_before, tblH_after) {

		},
		changeBgPlan: function(data) {
			//实在找不到原因，ufma-combox-popup默认不显示
			setTimeout(function() {
				$('.ufma-combox-popup').css({
					'display': 'none'
				});
			}, 100);
			bgItemManager_modal_out.loadBgPlanObjFromObj(data);
			modal_pnlFindRst_itemout.doFindBtnClick();
		},
		afterFind: function(data) {},
		doFindBySelf: function(eleCdtn) {
			showTblData_Modal_Out(false, eleCdtn);
		}
	};

	var moreMsgSetting_modal_in = {
		"agencyCode": '',
		showMoney: false,
		dateTimeAtFirst: true,
		computHeight: function(tblH_before, tblH_after) {

		},
		changeBgPlan: function(data) {
			//实在找不到原因，ufma-combox-popup默认不显示
			setTimeout(function() {
				$('.ufma-combox-popup').css({
					'display': 'none'
				});
			}, 100);
			bgItemManager_modal_in.loadBgPlanObjFromObj(data);
			if(modal_select_outItems.length == 1) {
				modal_pnlFindRst_itemin.doFindBtnClick();
			}

		},
		afterFind: function(data) {},
		doFindBySelf: function(eleCdtn) {
			showTblData_Modal_In(false, eleCdtn);
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
	var getTabSetState = function() {
		var $selNav = $(".nav.nav-tabs").find("li.NAVSELECT");
		var statusNav = $selNav.find("a").attr("data-status");
		return statusNav; // O=未审核 A=已审核 其他=全部
	};

	/**
	 * 根据预算方案显示主页面的主表(获取数据，调用doPaintTable函数绘制表格。)
	 * @param  {[type]} bNotRepaintTbl [false=url获得数据并且刷新表格   true=url获得数据，但不刷新表格]
	 * @param  {[eleInBgItemObj]} pEleCdtn [=null 时，会自行组装一个对象；否则使用此参数的对象]
	 * @return {[type]}                [description]
	 */
	var showTblData = function(bNotRepaintTbl, pEleCdtn) {
		var statusNav = getTabSetState();
		var loadingMsg = '正在加载调剂指标, 请稍后...';
		var itemStatus = 0;
		if(statusNav == "O") {
			//未审核
			itemStatus = 1;
		} else if(statusNav == "A") {
			//已审核
			itemStatus = 3;
		}
		ufma.showloading(loadingMsg);
		var dt = bgItemManager.getBgBills(pEleCdtn,
			function(result) {
				if(result.flag === "success") {
					tblDt = $.extend({}, result.data);
					//bug77471--zsj
					if(tblDt.billWithItemsVo.length > 0) {
						$("#bgInput-fileCount-twoSidesAdjLower").val(tblDt.billWithItemsVo[0].attachNum + "");
						pageAttachNum = tblDt.billWithItemsVo[0].attachNum;
					}
					ufma.hideloading();
					if(bNotRepaintTbl) {
						return;
					}
					doPaintTable(tblDt);
				} else {
					ufma.hideloading();
					ufma.showTip(result.msg, null, "error");
				}
			},
			function(data) {
				ufma.hideloading();
				ufma.showTip(data, null, "error");
			}, itemStatus);
		ufma.isShow(reslist);
	};

	function formatCheckboxCol(rowdata) {
		return '<label class="mt-checkbox mt-checkbox-single mt-checkbox-outline"> ' +
			'<input type="checkbox" class="checkboxes" data-level="' + rowdata.levelNum + '" name="mainRowCheck" />&nbsp;' +
			'<span></span> ' +
			'</label>';
	}

	function formatOperate(rowdata) {
		if(rowdata.status == "1") {
			//未审核
			return '<a class="btn btn-icon-only btn-sm btn-edit   btn-permission" data-toggle="tooltip" ' +
				'rowid="' + rowdata.bgItemId + '" title="编辑" data-original-title="编辑">' +
				'<span class="glyphicon icon-edit mainEditSpan"></span></a>' +
				'<a class="btn btn-icon-only btn-sm btn-audit   btn-permission" data-toggle="tooltip"  ' +
				'rowid="' + rowdata.bgItemId + '"   title="审核" data-original-title="审核">' +
				'<span class="glyphicon icon-audit mainAuditSpan"></span></a>' +
				'<a class="btn btn-icon-only btn-delete btn-sm   btn-permission" data-toggle="tooltip"  ' +
				'rowid="' + rowdata.bgItemId + '"   title="删除" data-original-title="删除">' +
				'<span class="glyphicon icon-trash mainDelSpan"></span></a>';
		} else if(rowdata.status == "3") {
			//审核
			return '<a class="btn btn-icon-only btn-sm btn-un-audit   btn-permission" data-toggle="tooltip" action= "unactive" ' +
				'rowid="' + rowdata.bgItemId + '"   title="销审" data-original-title="销审">' +
				'<span class="glyphicon icon-cancel-audit mainCancelAuditSpan"></span></a>' +
				'<a class="btn btn-icon-only btn-sm btn-watch-detail   btn-permission" data-toggle="tooltip" action= "unactive" ' +
				'rowid="' + rowdata.bgItemId + '"  title="日志" data-original-title="日志">' +
				'<span class="glyphicon icon-log mainLogSpan"></span></a>';
		} else {
			return '';
		}
	}
	/**
	 * 主界面 - 画表格
	 * @param tblDt
	 */
	var doPaintTable = function(tableData) {
		var tmpBillId = '',
			bCreate = true,
			rowSpan, $mgColFirst, $mgColLast;
		var tblCols = [{
				data: "",
				title: '<label class="mt-checkbox mt-checkbox-single mt-checkbox-outline" style="right:-3px"> <input id="input-seleAllUp" type="checkbox" class="checkboxes" name="mainRowCheck">&nbsp;<span></span> </label>',
				className: "notPrint nowrap",
				width: "40px"
			},
			{
				data: "bgItemCode",
				title: "指标编码",
				className: "print nowrap BGasscodeClass",
				width: "100px"
			},
			{
				// CWYXM-18408--指标年结涉及采购合同报销模块占用的指标结转完善
				data: "bgTypeName",
				title: "指标类型",
				className: "print BGTenLen nowrap",
				width: "200px",
				"render": function(data, type, rowdata, meta) {
					if(!$.isNull(data)) {
						return '<code title="' + data + '">' + data + '</code>';
					} else {
						return '';
					}
				}
			},
			{
				data: "bgItemSummary",
				title: '摘要',
				className: "print BGThirtyLen nowrap",
				width: "200px",
				"render": function(data, type, rowdata, meta) {
					if(!$.isNull(data)) {
						return '<code title="' + data + '">' + data + '</code>';
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
				className: "print nowrap BGThirtyLen",
        width: "200px",
        "render": function(data, type, rowdata, meta) {
					if(!$.isNull(data)) {
						return '<code title="' + data + '">' + data + '</code>';
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
				className: "print nowrap BGThirtyLen",
        width: "200px",
        "render": function(data, type, rowdata, meta) {
					if(!$.isNull(data)) {
						return '<code title="' + data + '">' + data + '</code>';
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
				width: "200px",
				"render": function (data, type, rowdata, meta) {
					if (!$.isNull(data)) {
						return '<code title="' + data + '">' + data + '</code>';
					} else {
						return '';
					}
				}
			});
		}
		//循环添加预算方案的要素信息
		for(var index = 0; index < bgItemManager.myBgPlanMsgObj.eleCodeArr.length; index++) {
      var key = _BgPub_getEleDataFieldNameByCode(bgItemManager.myBgPlanMsgObj.eleCodeArr[index],bgItemManager.myBgPlanMsgObj.eleFieldName[index]);
			tblCols.push({
        data: key != 'isUpBudget' ? key + 'Name' : key,
				title: bgItemManager.myBgPlanMsgObj.eleNameArr[index],
				className: key != 'isUpBudget' ? 'print nowrap BGThirtyLen' : 'print nowrap tc',
				width: "200px"
			});
    }
    //CWYXM-18080 编制指标时需要增加文本说明项，只录入文本，用于描述指标信息--zsj--查询条件区域
    for (var k = 0; k < bgItemManager.myBgPlanObj.planVo_Txts.length; k++) {
      var code = shortLineToTF(bgItemManager.myBgPlanObj.planVo_Txts[k].eleFieldName)
      tblCols.push({
        data: code,
        title: bgItemManager.myBgPlanObj.planVo_Txts[k].eleName,
        width: 200,
        className: 'nowrap BGThirtyLen',
        render: function(data, type, rowdata, meta) {
          if(!$.isNull(data)) {
						return '<code title="' + data + '">' + data + '</code>';
					} else {
						return '';
					}
        }
      });
    }
		//添加最后的金额，日期，操作列
		tblCols.push({
			data: "bgAddCurShow",
			title: "调入金额",
			className: "bgPubMoneyCol print nowrap BGmoneyClass tr",
			width: "150px",
			render: $.fn.dataTable.render.number(',', '.', 2, '') //修改金额千分位处理问题
		});
		tblCols.push({
			data: "bgCutCurShow",
			title: "调出金额",
			className: "bgPubMoneyCol print nowrap BGmoneyClass tr",
			width: "150px",
			render: $.fn.dataTable.render.number(',', '.', 2, '') //修改金额千分位处理问题
		});
		tblCols.push({
			data: "modifyAfterCur",
			title: "调整后金额",
			className: "bgPubMoneyCol print nowrap BGmoneyClass tr",
			width: "150px",
			type: "money", //解决主界面table调整后金额千分位问题,
			render: $.fn.dataTable.render.number(',', '.', 2, '') //修改金额千分位处理问题
		});
		tblCols.push({
			data: "bgPlanName",
			title: "预算方案",
			className: "bgPubMoneyCol print BGThirtyLen", //CWYXM-11319 --指标调剂列表查看，预算方案列应为左对齐--zsj
			width: "150px",
			"render": function(data, type, rowdata, meta) {
				if(!$.isNull(data)) {
					return '<code title="' + data + '">' + data + '</code>';
				} else {
					return '';
				}
			}
		});
		//bug76244--增加备注列--经侯总确认目前只加指标调整与指标调剂
		tblCols.push({
			data: "remark",
			title: "备注",
			className: "print BGThirtyLen nowrap",
			width: "200px",
			"render": function(data, type, rowdata, meta) {
				if(!$.isNull(data)) {
					return '<code title="' + data + '">' + data + '</code>';
				} else {
					return '';
				}
			}
		});
		tblCols.push({
			data: "bgItemId",
			title: "操作",
			className: "notPrint nowrap",
			width: "100px"
		});

		var colDefs = [{
			"targets": [-1],
			"serchable": false,
			"orderable": false,
			"render": function(data, type, rowdata, meta) {
				var rst = "";
				if(rowdata.status == "1") {
					rst = '<a class="btn btn-icon-only btn-sm btn-edit btn-permission " data-toggle="tooltip" ' +
						'rowid="' + data + '" title="编辑">' +
						'<span class="glyphicon icon-edit mainEditSpan"></span></a>' +

						'<a class="btn btn-icon-only btn-sm btn-audit btn-permission " data-toggle="tooltip"' +
						'rowid="' + data + '" title="审核">' +
						'<span class="glyphicon icon-audit mainAuditSpan"></span></a>' +

						'<a class="btn btn-icon-only btn-sm btn-delete btn-permission" data-toggle="tooltip" ' +
						'rowid="' + data + '" title="删除">' +
						'<span class="glyphicon icon-trash mainDelSpan"></span></a>';

				} else if(rowdata.status == "3") {
					rst =
						'<a class="btn btn-icon-only btn-sm btn-un-audit btn-permission" data-toggle="tooltip" ' +
						'rowid="' + data + '" title="销审">' +
						'<span class="glyphicon icon-cancel-audit mainCancelAuditSpan"></span></a>' +
						'<a class="btn btn-icon-only btn-sm btn-watch-detail btn-permission" data-toggle="tooltip" ' +
						'rowid="' + data + '"  title="日志" data-original-title="日志">' +
						'<span class="glyphicon icon-log mainLogSpan"></span></a>';

				}
				return rst;
			}
		}, {
			"targets": [0],
			"serchable": false,
			"orderable": false,
			"render": function(data, type, rowdata, meta) {
				return '<label class="mt-checkbox mt-checkbox-single mt-checkbox-outline"> ' +
					'<input type="checkbox" name="mainRowCheck" />' +
					'<span></span> ' +
					'</label>';
			}
		}];

		var mainTableData = bgItemManager.organizeUrlBillData(tableData, maxDetailCount_eachBill, true, true);

		$("#span-billsCount-twoSidesAdjItem").text(tableData.billWithItemsVo.length + "");
		//$("#span-billsTotalMoney-twoSidesAdjItem").text(jQuery.formatMoney(mainTableData.money / 2 + "", 2) + "");//表格下发显示的金额
		$("#span-billsTotalMoney-twoSidesAdjItem").text(jQuery.formatMoney(mainTableData.money + "", 2) + ""); //表格下发显示的金额，由于后台已做处理，故前台不需处理
		var bNotAutoWidth = true; //默认是取消自动宽度；
		var sScrollY = $(".workspace").outerHeight(true) - $(".workspace-top").outerHeight(true) - $("#bgMoreMsgPnl").outerHeight(true) - 12 - $(".nav").outerHeight(true) - $("#fixDiv-twoSidesAdjItem").outerHeight(true) - 18 - 34 - 30 - 20;
		var tblSetting = {
			"data": mainTableData.data,
			"columns": tblCols,
			"columnDefs": colDefs,
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
			"dom": 'Brt', //<"rightDiv" p>
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
						if(data.isBill === 1 || data.isMore === 1) {
							return false;
						} else {
							return true;
						}
					},
					'columns': ".print"
				}
			}],
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
					var midRowColSpanHtml = "<a class='billRow-a  common-jump-link btn-watch btn-permission' href='javascript:;'>单据编号:&nbsp;" + aData.billCode + "&nbsp;&nbsp;&nbsp;&nbsp;" +
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
					var midRowColSpanHtml1 = "<a class='bgPub-billRow-a bgPub-billRow-a-more billRow-a btn-permission btn-watch' href='javascript:;'>更多></a>"; //点击进入查看单据界面
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
			"initComplete": function(options, data) {
				bCreate = false;
				var $mainTable = $($('#mainTable-twoSidesAdjItem').closest('.dataTables_scroll').find('.dataTables_scrollHeadInner table'));
				/*与雪蕊沟通后注释拖动列--CWYXM-11319 --指标调剂列表查看，预算方案列应为左对齐--zsj
				 * $mainTable.tblcolResizable({
					'bindTable': '#mainTable-twoSidesAdjItem'
				});*/
				$.fn.dataTable.ext.errMode = 'none';
			},
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
				return false;
				var tmpTbl = $("#" + tblId).dataTable();
				var rows = tmpTbl.fnGetNodes(); ////fnGetNodes获取表格所有行，rows[i]表示第i行tr对象
				var colspanCount = 2 + bgItemManager.myBgPlanMsgObj.eleCodeArr.length + 4; //指标编码+摘要+要素列+金额+录入日期
				var rowspan_firstNode = null;
				var rowspan_lastNode = null;
				var rowspanCount = 1;

				//1， 单据头部的横向合并
				for(var i = 0; i < rows.length; i++) {
					var row = rows[i];
					var rowData = tmpTbl.api().row(row).data();
					if(rowData.isBill == 1) { //说明这行是单子头部信息，要进行合并
						var checkDate = ufma.parseNull(rowData.checkDate).substr(0, 10);
						var billTitle_checkMsg = '';
						if(rowData.status == "3") { //审核标签下显示审核人和审核日期
							billTitle_checkMsg =
								"审核日期:&nbsp;" + checkDate + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" +
								"审核人&nbsp;:" + rowData.checkUserName + "&nbsp;&nbsp;&nbsp;&nbsp;";
						}
						var startRowNodeHtml = $(row).find("td:eq(0)").html();
						var lastRowNodeHtml = $(row).find("td:eq(" + (colspanCount + 1) + ")").html();
						var midRowColSpanHtml = "<a class='billRow-a btn-permission btn-watch' href='javascript:;'>单据编号:&nbsp;" + rowData.billCode + "&nbsp;&nbsp;&nbsp;&nbsp;" +
							"单据日期:&nbsp;" + rowData.billDate + "&nbsp;&nbsp;&nbsp;&nbsp;" +
							"单据金额:&nbsp;" + jQuery.formatMoney(rowData.billCur / 2 + "", 2) + "&nbsp;&nbsp;&nbsp;&nbsp;" +
							ufma.parseFloat(rowdata.billCur, 2)
						"制单人&nbsp;:" + rowData.createUserName + "&nbsp;&nbsp;&nbsp;&nbsp;" +
							billTitle_checkMsg + "</a>"; //点击进入查看单据界面
						$(row).empty();
						$(row).append("<td>" + startRowNodeHtml + "</td>" +
							"<td colspan='" + colspanCount + "'>" + midRowColSpanHtml + "</td>" +
							"<td>" + lastRowNodeHtml + "</td>");
					} else if(rowData.isMore == 1) { //说明这行是单位的尾部信息，要添加更多的点击按钮
						var startRowNodeHtml1 = $(row).find("td:eq(0)").html();
						var lastRowNodeHtml1 = $(row).find("td:eq(" + (colspanCount + 1) + ")").html();
						//a.billRow-a
						var midRowColSpanHtml1 = "<a class='bgPub-billRow-a btn-permission btn-watch bgPub-billRow-a-more billRow-a' href='javascript:;'>更多></a>"; //点击进入查看单据界面
						$(row).empty();
						$(row).append("<td>" + startRowNodeHtml1 + "</td>" +
							"<td colspan='" + colspanCount + "'>" + midRowColSpanHtml1 + "</td>" +
							"<td>" + lastRowNodeHtml1 + "</td>");
					}
				}
				//2，列的纵向合并
				for(var j = 0; j < rows.length; j++) {
					var row = rows[j];
					var rowData2 = tmpTbl.api().row(row).data();
					if(rowData2.isBill == 1) { //说明这行是单子头部信息，要进行合并
						rowspan_firstNode = $(row).find("td:eq(0)");
						rowspan_lastNode = $(row).find("td:eq(2)");
						rowspanCount = 1;
					} else {
						if(rowData2.isMore == 0) {
							rowspanCount++;
							rowspan_lastNode.attr("rowspan", rowspanCount);
							$(row).find("td:eq(" + (colspanCount + 1) + ")").remove();
							rowspan_firstNode.attr("rowspan", rowspanCount);
							$(row).find("td:eq(0)").remove();
						} else {
							rowspanCount++;
							rowspan_lastNode.attr("rowspan", rowspanCount);
							$(row).find("td:eq(2)").remove();
							rowspan_firstNode.attr("rowspan", rowspanCount);
							$(row).find("td:eq(0)").remove();
						}
					}
				}
				$.fn.dataTable.ext.errMode = 'none';
			}
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
		/*var $clostDiv = $("#" + tblId).closest("div");
		$($clostDiv).css("border-bottom", "0px black solid");*/
		_BgPub_ReSetDataTable_AfterPaint(tblId);

		var mainTblFoot_leftPnl = '<div class="bg-multi-floatLeft-1">' + '<label class="mt-checkbox mt-checkbox-single mt-checkbox-outline bg-top-4"> ' + '<input id="input-seleAll" type="checkbox" class="checkboxes" value=""/> &nbsp; 全选' + '<span></span> ' + '</label> ' + '</div>';

		var $selNav = $(".nav.nav-tabs").find("li.NAVSELECT");
		var statusNav = $selNav.find("a").attr("data-status");
		if(statusNav == "O") {
			//未审核
			mainTblFoot_leftPnl = mainTblFoot_leftPnl + '<div class="bg-multi-floatLeft-1"> ' + '<button type="button" id="btn-del" class="btn btn-sm btn-default btn-delete bg-multiModal-leftButton">删除</button> ' + '</div> ' + '<div class="bg-multi-floatLeft-1"> ' + '<button type="button" id="btn-check" class="btn btn-sm btn-default btn-audit bg-multiModal-leftButton">审核</button> ';
		} else if(statusNav == "A") {
			//已审核
			mainTblFoot_leftPnl = mainTblFoot_leftPnl + '<div class="bg-multi-floatLeft-1"> ' + '<button type="button" id="btn-check" class="btn btn-sm btn-default btn-un-audit bg-multiModal-leftButton">销审</button> ';
		} else {
			//全部
			mainTblFoot_leftPnl = mainTblFoot_leftPnl +
				'<div class="bg-multi-floatLeft-1"> ' +
				'<button type="button" id="btn-del" class="btn btn-sm btn-default btn-delete bg-multiModal-leftButton" style="display:none">删除</button> ' +
				'</div> ' +
				'<div class="bg-multi-floatLeft-1"> ' +
				'<button type="button" id="btn-check" class="btn btn-sm btn-default btn-audit bg-multiModal-leftButton" style="display:none">审核</button> ';
		}
		mainTblFoot_leftPnl = mainTblFoot_leftPnl + '</div> ';
		$("#bg-mainTableFooterDiv-leftPnl").append(mainTblFoot_leftPnl);

		addListenerToMainTable();

		ufma.hideloading();
		ufma.isShow(reslist);
	};

	var addListenerToMainTable = function() {

		/**
		 * 主界面 - 给主界面的表格增加监听事件。
		 */
		ufma.searchHideShow($('#' + tblId));
		/**
		 * 事件一 ： 点击头部可以打开界面
		 */
		$("a.billRow-a").off("click").on("click", function(e) {
			openType = 'edit';
			var billId = tblObj.row($(this).closest("tr")).data().billId;
			cbBgPlanId = $('#_bgPub_cbb_BgPlan_bgMoreMsgPnl-twoSidesAdjItem').getObj().getValue();
			bgItemManager.getBgBills({
					"billType": bgItemManager.billType,
					"billId": billId,
					"agencyCode": bgItemManager.agencyCode
				},
				function(result) {
					var bill = result.data.billWithItemsVo[0];
					if(!$.isNull(bill)) {
						pageAttachNum = bill.attachNum;
					}
					if(bill != null) {
						var itemsArr = bill.billWithItems.concat();
						bill.items = itemsArr;
						bill.isNew = "否";
						doLoadModalWithData(bill);
					}
				},
				function() {
					ufma.showTip("单据内容加载失败", null, "error");
				}, null);
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
		 * 事件三 ： 最后一列的按钮支持事件： 编辑
		 */
		$("#" + tblId + " tbody").on("click", "span.mainEditSpan", function(e) {
			$(this).closest("tr").find("a.billRow-a").trigger("click");
		});
		/**
		 * 事件四 ： 最后一列的按钮支持事件： 审核
		 */
		$("#" + tblId + " tbody").on("click", "span.mainAuditSpan", function(e) {
			var statusNav = getTabSetState();
			var rows = $("#" + tblId).dataTable().fnGetNodes();
			var dt = tblObj.row($(this).closest("tr")).data();
			var billIds = [];
			billIds.push({
				'billId': dt.billId
			});
			var rqObj_audit = new bgBillAuditOrUnAudit();
			rqObj_audit.agencyCode = bgItemManager.agencyCode;
			rqObj_audit.setYear = page.pfData.svSetYear;
			rqObj_audit.billType = bgItemManager.billType;
			rqObj_audit.items = billIds;
			rqObj_audit.status = "3"; //guohx 增加审核参数  20171024
			rqObj_audit.checkDate = page.pfData.svSysDate;
			rqObj_audit.checkUser = page.pfData.svUserCode;
			rqObj_audit.checkUserName = page.pfData.svUserName;
			rqObj_audit.bgPlanChrId = curBgPlanData.chrId;
			/*if (billIds.length == 0) {
			    ufma.showTip("请选择要审核的单据", null, "warning");
			    return false;
			}*/
			ufma.confirm('您确定要审核选择的单据吗？', function(ac) {
				if(ac) {
					var url = _bgPub_requestUrlArray_subJs[12] + "?billType=" + bgItemManager.billType + "&agencyCode=" + bgItemManager.agencyCode;
					var callback = function(result) {
						ufma.showTip('审核成功！', function() {
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
		 * 事件五 ： 最后一列的按钮支持事件： 删除
		 */
		$("#" + tblId + " tbody").on("click", "span.mainDelSpan", function(e) {
			var tmpBill = $("#" + tblId).DataTable().row($(this).closest("tr")).data();
			if(tmpBill.status == "3") {
				ufma.showTip("已审核单据不能删除", null, "warning");
				return false;
			}
			ufma.confirm("确定要删除本条单据[" + tmpBill.billCode + "]吗?",
				function(action) {
					if(action) {
						bgItemManager.deleteBill([tmpBill.billId], curBgPlanData.chrId,
							function() {
								ufma.showTip("删除成功", null, "success");
								pnlFindRst.doFindBtnClick();
							},
							function(msg) {
								ufma.showTip("删除失败！" + result.msg, null, "error");
							});
					}
				}, {
					'type': 'warning'
				});
		});
		/**
		 * 事件六 ： 最后一列的按钮支持事件： 销审
		 */
		$("#" + tblId + " tbody").on("click", "span.mainCancelAuditSpan", function(e) {
			var statusNav = getTabSetState();
			var rows = $("#" + tblId).dataTable().fnGetNodes();
			var dt = tblObj.row($(this).closest("tr")).data();
			var billIds = [];
			billIds.push({
				'billId': dt.billId
			});
			var rqObj_audit = new bgBillAuditOrUnAudit();
			rqObj_audit.agencyCode = bgItemManager.agencyCode;
			rqObj_audit.setYear = page.pfData.svSetYear;
			rqObj_audit.billType = bgItemManager.billType;
			rqObj_audit.items = billIds;
			rqObj_audit.status = "1"; //guohx 增加审核参数  20171024
			rqObj_audit.checkDate = page.pfData.svSysDate;
			rqObj_audit.checkUser = page.pfData.svUserCode;
			rqObj_audit.checkUserName = page.pfData.svUserName;
			rqObj_audit.bgPlanChrId = curBgPlanData.chrId;
			ufma.confirm('您确定要销审选择的单据吗？', function(ac) {
				if(ac) {
					var url = _bgPub_requestUrlArray_subJs[12] + "?billType=" + bgItemManager.billType + "&agencyCode=" + bgItemManager.agencyCode;
					var callback = function(result) {
						ufma.showTip('销审成功！', function() {
							pnlFindRst.doFindBtnClick();
						}, 'success');
					};
					ufma.post(url, rqObj_audit, callback);
				}
			}, {
				'type': 'warning'
			});

		});
		//日历
		$('.uf-datepicker').ufDatepicker({
			format: 'yyyy-mm-dd',
			initialDate: new Date()
		});
		/**
		 * 事件七 ： 最后一列的按钮支持事件： 日志
		 */
		$("#" + tblId + " tbody").on("click", "span.mainLogSpan", function(e) {
			var tr = $(this).closest("tr");
			var dt = tblObj.row(tr).data();
			_bgPub_showLogModal("budgetItemTwoSidesAdjust", {
				"bgBillId": dt.billId,
				"bgItemCode": "",
				"agencyCode": bgItemManager.agencyCode,
				"setYear": page.pfData.svSetYear
			});
		});

		$("#input-seleAllUp").off("change").on("change", function() {
			var selAll = ($(this).is(":checked") == true);
			$("#input-seleAll-twoSidesAdjItem").prop("checked", selAll);
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

	/**
	 * 调剂出指标表格
	 * @param bNotRepaintTbl
	 * @param pEleCdtn
	 */
	var showTblData_Modal_Out = function(bNotRepaintTbl, pEleCdtn) {
		var loadingMsg = '正在加载调剂出指标, 请稍后...';
		ufma.showloading(loadingMsg);
		if($.isNull(pEleCdtn)) {
			pEleCdtn = {};
		}
		pEleCdtn.bgItemType = bgItemManager_modal_out.bgItemType_DespenseOut;
		var dt = bgItemManager_modal_out.getBgItems(pEleCdtn,
			function(result) {
				if(result.flag === "success") {
					var tmpTblDt = $.extend({}, result.data);
					ufma.hideloading();
					if(bNotRepaintTbl) {
						return;
					}
					doPaintTable_Modal_Out(tmpTblDt);
				} else {
					ufma.hideloading();
					ufma.showTip(result.msg, null, "error");
				}
			},
			function(data) {
				ufma.hideloading();
				ufma.showTip(data, null, "error");
			}, 3);
		ufma.isShow(reslist);
	};

	/**
	 *
	 */
	var doPaintTable_Modal_Out = function(tabData) {
		var tblCols = [{
				data: "",
				title: "",
				className: "notPrint nowrap",
				width: "40px"
			},
			{
				data: "bgItemCode",
				title: "指标编码",
				className: "print nowrap BGasscodeClass",
				//width: "100px"
			},
			{
				// CWYXM-18408--指标年结涉及采购合同报销模块占用的指标结转完善
				data: "bgTypeName",
				title: "指标类型",
				className: "print BGTenLen nowrap",
				//width: "200px",
				"render": function(data, type, rowdata, meta) {
					if(!$.isNull(data)) {
						return '<code title="' + data + '">' + data + '</code>';
					} else {
						return '';
					}
				}
			},
			{
				data: "bgItemSummary",
				title: '摘要',
				className: "print BGThirtyLen nowrap",
				//width: "200px",
				"render": function(data, type, rowdata, meta) {
					if(!$.isNull(data)) {
						return '<code title="' + data + '">' + data + '</code>';
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
				className: "print nowrap BGThirtyLen",
        //width: "200px",
        "render": function(data, type, rowdata, meta) {
					if(!$.isNull(data)) {
						return '<code title="' + data + '">' + data + '</code>';
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
				className: "print nowrap BGThirtyLen",
        //width: "200px",
        "render": function(data, type, rowdata, meta) {
					if(!$.isNull(data)) {
						return '<code title="' + data + '">' + data + '</code>';
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
        className: "print nowrap  BGThirtyLen",
        //width: "200px",
        "render": function(data, type, rowdata, meta) {
          if(!$.isNull(data)) {
            return '<code title="' + data + '">' + data + '</code>';
          } else {
            return '';
          }
        }
      });
    }
		//循环添加预算方案的要素信息
		for(var index = 0; index < bgItemManager_modal_out.myBgPlanMsgObj.eleCodeArr.length; index++) {
      var key = _BgPub_getEleDataFieldNameByCode(bgItemManager_modal_out.myBgPlanMsgObj.eleCodeArr[index],bgItemManager_modal_out.myBgPlanMsgObj.eleFieldName[index]);
			tblCols.push({
				data: key != 'isUpBudget' ? key + 'Name' : key,
				title: bgItemManager_modal_out.myBgPlanMsgObj.eleNameArr[index],
				className: key != 'isUpBudget' ? 'print nowrap BGThirtyLen' : 'print nowrap tc',
				//width: "200px"
			});
		}
    //CWYXM-18080 编制指标时需要增加文本说明项，只录入文本，用于描述指标信息--zsj--查询条件区域
    for (var k = 0; k < bgItemManager_modal_out.myBgPlanObj.planVo_Txts.length; k++) {
      var code = shortLineToTF(bgItemManager_modal_out.myBgPlanObj.planVo_Txts[k].eleFieldName)
      tblCols.push({
        data: code,
        title: bgItemManager_modal_out.myBgPlanObj.planVo_Txts[k].eleName,
        //width: 200,
        className: 'nowrap BGThirtyLen',
        render: function(data, type, rowdata, meta) {
          if(!$.isNull(data)) {
						return '<code title="' + data + '">' + data + '</code>';
					} else {
						return '';
					}
        }
      });
    }
		//添加最后的金额，日期，操作列
		tblCols.push({
			data: "realBgItemCurShow",
			title: "金额",
			className: "bgPubMoneyCol print nowrap BGmoneyClass tr",
			//width: "150px",
			render: $.fn.dataTable.render.number(',', '.', 2, '') //修改金额千分位处理问题
		});
		tblCols.push({
			data: "bgItemBalanceCurShow",
			title: "余额",
			className: "bgPubMoneyCol print nowrap BGmoneyClass tr",
			//width: "150px",
			render: $.fn.dataTable.render.number(',', '.', 2, '') //修改金额千分位处理问题
		});
		tblCols.push({
			data: "createUserName",
			title: "编制人",
			className: "print nowrap BGTenLen",
			//width: "150px"
		});
		tblCols.push({
			data: "createDate",
			title: "编制日期",
			className: "print nowrap BGdateClass tc",
			// width: "150px"
		});
		tblCols.push({
			data: "checkUserName",
			title: "审核人",
			className: "print nowrap BGTenLen",
			//width: "150px"
		});
		tblCols.push({
			data: "checkDate",
			title: "审核日期",
			className: "print nowrap BGdateClass tc",
			// width: "150px"
		});
		tblCols.push({
			data: "bgItemOperCol",
			title: "操作",
			className: "notPrint nowrap",
			width: "40px"
		});
		var colDefs = [{
			"targets": [-1],
			"serchable": false,
			"orderable": false,
			"render": function(data, type, rowdata, meta) {
				return '<a class="btn btn-icon-only btn-sm btn-watch-detail btn-permission " data-toggle="tooltip" action= "unactive" ' +
					'rowid="' + data + '" title="日志">' +
					'<span class="glyphicon icon-log modalOutLogSpan"></span></a>';
			}
		}, {
			"targets": [0],
			"serchable": false,
			"orderable": false,
			"render": function(data, type, rowdata, meta) {
				return '<label class="mt-checkbox mt-checkbox-single mt-checkbox-outline"> ' +
					'<input type="checkbox" name="bgItemOutRowCheck" />' +
					'<span></span> ' +
					'</label>';
			}
		}];
		var bgItemOutTableData = bgItemManager_modal_out.organizeBgItemFromMultiPostBills(tabData.billWithItemsVo);
		var bNotAutoWidth = true; //默认是取消自动宽度；
		var sScrollY = "225px"; //for test

		var tblSetting = {
			"data": bgItemOutTableData,
			"columns": tblCols,
			"columnDefs": colDefs,
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
		if(modal_table_sheet1 != null) {
			modal_table_sheet1.destroy();
			$("#" + modal_tableId_sheet1).empty();
		}
		modal_table_sheet1 = $("#" + modal_tableId_sheet1).DataTable(tblSetting);
		if(!$("#" + modal_tableId_sheet1).hasClass("ufma-table")) {
			$("#" + modal_tableId_sheet1).addClass("ufma-table");
		}
		if(!$("#" + modal_tableId_sheet1).hasClass("dataTable")) {
			$("#" + modal_tableId_sheet1).addClass("dataTable");
		}
		/*var $clostDiv = $("#" + modal_tableId_sheet1).closest("div");
		$($clostDiv).css("border-bottom", "0px black solid");*/
		_BgPub_ReSetDataTable_AfterPaint(modal_tableId_sheet1);
		addListenerToModalTable_sheet1();
		ufma.hideloading();
		for(var i = 0; i < bgItemOutTableData.length; i++) {
			$("#table_outItems_selected tbody td[name='bgItemSummary']").each(function() {
				$(this).attr('title', bgItemOutTableData[i].bgItemSummary);
				$(this).addClass('BGThirtyLen');
			});
		}
		ufma.isShow(reslist);
	};

	var addListenerToModalTable_sheet1 = function() {
		/**
		 * 日志
		 */
		$("#" + modal_tableId_sheet1 + " tr span.modalOutLogSpan").off("click").on("click", function() {
			var tr = $(this).closest("tr");
			var dt = modal_table_sheet1.row(tr).data();

			_bgPub_showLogModal("budgetItemTwoSidesAdjust", {
				"bgItemId": dt.bgItemId,
				"bgItemCode": dt.bgItemCode,
				"agencyCode": bgItemManager.agencyCode
			});
		});
	};

	/**
	 * 调剂入指标表格
	 * @param bNotRepaintTbl
	 * @param pEleCdtn
	 */
	var showTblData_Modal_In = function(bNotRepaintTbl, pEleCdtn) {
		var loadingMsg = '正在加载调剂入指标, 请稍后...';
		ufma.showloading(loadingMsg);
		if($.isNull(pEleCdtn)) {
			pEleCdtn = {};
		}
		pEleCdtn.bgItemType = bgItemManager_modal_out.bgItemType_DespenseIn;
		var dt = bgItemManager_modal_in.getBgItems(pEleCdtn,
			function(result) {
				if(result.flag === "success") {
					var tmpTblDt = $.extend({}, result.data);
					//增加判断筛选调入指标
					var tmpTblData1 = [];
					var billWithItemsVo = [];
					for(var i = 0; i < tmpTblDt.billWithItemsVo.length; i++) {
						for(var j = 0; j < tmpTblDt.billWithItemsVo[i].billWithItems.length; j++) {
							if((tempBeginCur == -1) && (tmpTblDt.billWithItemsVo[i].billWithItems[0].parentBalanceCur == -1)) {
								tmpTblData1.push(tmpTblDt.billWithItemsVo[i]);
								break;
							} else if(tempBeginPid == tmpTblDt.billWithItemsVo[i].billWithItems[0].bgItemParentid) {
								tmpTblData1.push(tmpTblDt.billWithItemsVo[i]);
								break;
							}
						}
					}
					var tmpTblData = $.extend({
						'billWithItemsVo': tmpTblData1
					});
					ufma.hideloading();
					if(bNotRepaintTbl) {
						return;
					}
					doPaintTable_Modal_In(tmpTblData);
				} else {
					ufma.hideloading();
					ufma.showTip(result.msg, null, "error");
				}
			},
			function(data) {
				ufma.hideloading();
				ufma.showTip(data, null, "error");
			}, 3);
		ufma.isShow(reslist);
	};

	var doPaintTable_Modal_In = function(tabData) {
		var tblCols = [{
				data: "",
				title: "",
				className: "notPrint nowrap",
				width: "40px"
			},
			{
				data: "bgItemCode",
				title: "指标编码",
				className: "print nowrap BGasscodeClass",
				//width: "100px"
			},// CWYXM-18408--指标年结涉及采购合同报销模块占用的指标结转完善
			{
				data: "bgTypeName",
				title: "指标类型",
				className: "print BGTenLen nowrap",
				//width: "200px",
				"render": function(data, type, rowdata, meta) {
					if(!$.isNull(data)) {
						return '<code title="' + data + '">' + data + '</code>';
					} else {
						return '';
					}
				}
			},
			{
				data: "bgItemSummary",
				title: '摘要',
				className: "print BGThirtyLen nowrap",
				//width: "200px",
				"render": function(data, type, rowdata, meta) {
					if(!$.isNull(data)) {
						return '<code title="' + data + '">' + data + '</code>';
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
				className: "print nowrap BGThirtyLen",
        //width: "200px",
        "render": function(data, type, rowdata, meta) {
					if(!$.isNull(data)) {
						return '<code title="' + data + '">' + data + '</code>';
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
				className: "print nowrap BGThirtyLen",
        //width: "200px",
        "render": function(data, type, rowdata, meta) {
					if(!$.isNull(data)) {
						return '<code title="' + data + '">' + data + '</code>';
					} else {
						return '';
					}
				}
			});
    }
    if(currentplanData.isFinancialBudget == "1") {
			tblCols.push({
				data: "bgItemIdMx",
				title: '财政指标ID',
				className: "print nowrap BGThirtyLen",
        //width: "200px",
        "render": function(data, type, rowdata, meta) {
					if(!$.isNull(data)) {
						return '<code title="' + data + '">' + data + '</code>';
					} else {
						return '';
					}
				}
			});
		}
		//循环添加预算方案的要素信息
		for(var index = 0; index < bgItemManager_modal_in.myBgPlanMsgObj.eleCodeArr.length; index++) {
      var key = _BgPub_getEleDataFieldNameByCode(bgItemManager_modal_in.myBgPlanMsgObj.eleCodeArr[index],bgItemManager_modal_in.myBgPlanMsgObj.eleFieldName[index])
			tblCols.push({
				data: key != 'isUpBudget' ? key + 'Name' : key,
				title: bgItemManager_modal_in.myBgPlanMsgObj.eleNameArr[index],
				className: key != 'isUpBudget' ? 'print nowrap BGThirtyLen' : 'print nowrap tc',
				//width: "200px"
			});
    }
    //CWYXM-18080 编制指标时需要增加文本说明项，只录入文本，用于描述指标信息--zsj--查询条件区域
    for (var k = 0; k < bgItemManager_modal_in.myBgPlanObj.planVo_Txts.length; k++) {
      var code = shortLineToTF(bgItemManager_modal_in.myBgPlanObj.planVo_Txts[k].eleFieldName)
      tblCols.push({
        data: code,
        title: bgItemManager_modal_in.myBgPlanObj.planVo_Txts[k].eleName,
        //width: 200,
        className: 'nowrap BGThirtyLen',
        render: function(data, type, rowdata, meta) {
          if(!$.isNull(data)) {
						return '<code title="' + data + '">' + data + '</code>';
					} else {
						return '';
					}
        }
      });
    }
		//添加最后的金额，日期，操作列
		tblCols.push({
			data: "realBgItemCurShow",
			title: "金额",
			className: "bgPubMoneyCol print nowrap BGmoneyClass tr",
			//width: "150px",
			render: $.fn.dataTable.render.number(',', '.', 2, '') //修改金额千分位处理问题
		});
		tblCols.push({
			data: "bgItemBalanceCurShow",
			title: "余额",
			className: "bgPubMoneyCol print nowrap BGmoneyClass tr",
			//width: "150px",
			render: $.fn.dataTable.render.number(',', '.', 2, '') //修改金额千分位处理问题
		});
		tblCols.push({
			data: "createUserName",
			title: "编制人",
			className: "print nowrap BGTenLen",
			//width: "150px"
		});
		tblCols.push({
			data: "createDate",
			title: "编制日期",
			className: "print nowrap BGdateClass tc",
			// width: "150px"
		});
		tblCols.push({
			data: "checkUserName",
			title: "审核人",
			className: "print nowrap BGTenLen",
			//width: "150px"
		});
		tblCols.push({
			data: "checkDate",
			title: "审核日期",
			className: "print nowrap BGdateClass tc",
			// width: "150px"
		});
		tblCols.push({
			data: "bgItemOperCol",
			title: "操作",
			className: "notPrint nowrap",
			width: "40px"
		});
		var colDefs = [{
			"targets": [-1],
			"serchable": false,
			"orderable": false,
			"render": function(data, type, rowdata, meta) {
				return '<a class="btn btn-icon-only btn-sm btn-watch-detail btn-permission" data-toggle="tooltip" action= "unactive" ' +
					'rowid="' + data + '" title="日志">' +
					'<span class="glyphicon icon-log modalInLogSpan"></span></a>';
			}
		}, {
			"targets": [0],
			"serchable": false,
			"orderable": false,
			"render": function(data, type, rowdata, meta) {
				return '<label class="mt-checkbox mt-checkbox-single mt-checkbox-outline"> ' +
					'<input type="checkbox" name="bgItemOutRowCheck" />' +
					'<span></span> ' +
					'</label>';
			}
		}];
		var bgItemInTableData = bgItemManager_modal_out.organizeBgItemFromMultiPostBills(tabData.billWithItemsVo);
		var bNotAutoWidth = true; //默认是取消自动宽度；
		var sScrollY = "225px"; //for test
		var tblSetting = {
			"data": bgItemInTableData,
			"columns": tblCols,
			"columnDefs": colDefs,
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
		if(modal_table_sheet2 != null) {
			modal_table_sheet2.destroy();
			$("#" + modal_tableId_sheet2).empty();
		}
		modal_table_sheet2 = $("#" + modal_tableId_sheet2).DataTable(tblSetting);
		if(!$("#" + modal_tableId_sheet2).hasClass("ufma-table")) {
			$("#" + modal_tableId_sheet2).addClass("ufma-table");
		}
		if(!$("#" + modal_tableId_sheet2).hasClass("dataTable")) {
			$("#" + modal_tableId_sheet2).addClass("dataTable");
		}
		_BgPub_ReSetDataTable_AfterPaint(modal_tableId_sheet2);
		addListenerToModalTable_sheet2();
		ufma.hideloading();
		for(var i = 0; i < bgItemInTableData.length; i++) {
			$("#table_inItems_selected tbody td[name='bgItemSummary']").each(function() {
				$(this).attr('title', bgItemInTableData[i].bgItemSummary);
				$(this).addClass('BGThirtyLen');
			});
		}
		ufma.isShow(reslist);
	};

	var addListenerToModalTable_sheet2 = function() {
		/**
		 * 日志
		 */
		$("#" + modal_tableId_sheet2 + " tr span.modalInLogSpan").off("click").on("click", function() {
			var tr = $(this).closest("tr");
			var dt = modal_table_sheet2.row(tr).data();
			_bgPub_showLogModal("budgetItemTwoSidesAdjust", {
				"bgItemId": dt.bgItemId,
				"bgItemCode": dt.bgItemCode,
				"agencyCode": bgItemManager.agencyCode
			});
		});
	};

	/**
	 * 根据选择的调出和调入指标，来绘制第三个页签
	 */
	var doPaintTable_Modal_Sheet3 = function() {
		//1, 绘制调出的指标表格
		var tblCols1 = [{
        field: 'bgItemCode',
        name: '指标编码',
        headalign: 'center',
        width: 150,
        className: "nowrap BGasscodeClass",
        render: function(rowid, rowdata, data) {
          if(!$.isNull(data)) {
            return '<code title="' + data + '">' + data + '</code>';
          } else {
            return '';
          }
        }
      },
      // CWYXM-18408--指标年结涉及采购合同报销模块占用的指标结转完善
			{
        field: 'bgTypeName',
        name: '指标类型',
        headalign: 'center',
        width: 150,
        className: "nowrap BGTenLen",
        render: function(rowid, rowdata, data) {
          if(!$.isNull(data)) {
            return '<code title="' + data + '">' + data + '</code>';
          } else {
            return '';
          }
        }
			},
			{
        field: 'bgItemSummary',
        name: '摘要',
        headalign: 'center',
        width: 200,
        className: "nowrap BGThirtyLen",
        render: function(rowid, rowdata, data) {
          if(!$.isNull(data)) {
            return '<code title="' + data + '">' + data + '</code>';
          } else {
            return '';
          }
        }
			}
		]
		if(currentplanData.isComeDocNum == "是") {
			tblCols1.push({
        field: 'comeDocNum',
        name: '来文文号',
        headalign: 'center',
        width: 200,
        className: "nowrap BGThirtyLen",
        render: function(rowid, rowdata, data) {
          if(!$.isNull(data)) {
            return '<code title="' + data + '">' + data + '</code>';
          } else {
            return '';
          }
        }
			});
		}
		if(currentplanData.isSendDocNum == "是") {
			tblCols1.push({
        field: 'sendDocNum',
        name: page.sendCloName,
        headalign: 'center',
        width: 200,
        className: "nowrap BGThirtyLen",
        render: function(rowid, rowdata, data) {
          if(!$.isNull(data)) {
            return '<code title="' + data + '">' + data + '</code>';
          } else {
            return '';
          }
        }
			});
    }
    //CWYXM-17554 预算方案设置中，增加财政指标ID属性，可选择是否启用，启用时，选择预算方案新增指标时，需要录入指标id，指标id也需要参与指标的要素唯一性校验--zsj
    if(currentplanData.isFinancialBudget == "1") {
			tblCols1.push({
        field: 'bgItemIdMx',
        name: '财政指标ID',
        headalign: 'center',
        width: 200,
        className: "nowrap BGThirtyLen",
        render: function(rowid, rowdata, data) {
          if(!$.isNull(data)) {
            return '<code title="' + data + '">' + data + '</code>';
          } else {
            return '';
          }
        }
			});
		}
    tblCols1.push({
      field: 'bgItemBalanceCur',
      name: '可调出金额',
      headalign: 'center',
      width: 200,
      align: 'right',
      className: "nowrap BGmoneyClass",
      render: function(rowid, rowdata, data) {
        if(!$.isNull(data)) {
          return $.formatMoney(data, 2);
        } else {
          return '';
        }
      }
		}, {
      type: "money",
      field: 'dispenseCurOut',
      name: '调出金额',
      headalign: 'center',
      width: 200,
      align: 'right',
      className: "nowrap BGmoneyClass",
      render: function(rowid, rowdata, data) {
        if(!$.isNull(data)) {
          return $.formatMoney(data, 2);
        } else {
          return '';
        }
      },
      onKeyup: function(e) {

      }
		}, {
      field: 'afterDispenseCur',
      name: '调整后金额',
      headalign: 'center',
      width: 150,
      align: 'right',
      className: "nowrap BGmoneyClass",
      render: function(rowid, rowdata, data) {
        if(!$.isNull(data)) {
          return $.formatMoney(data, 2);
        } else {
          return '';
        }
      }
		});
		//循环添加预算方案的要素信息
		for(var index = 0; index < bgItemManager_modal_out.myBgPlanMsgObj.eleCodeArr.length; index++) {
      var key = _BgPub_getEleDataFieldNameByCode(bgItemManager_modal_out.myBgPlanMsgObj.eleCodeArr[index], bgItemManager_modal_out.myBgPlanMsgObj.eleFieldName[index]);
      if (key != 'isUpBudget') {
        tblCols1.push({
          field: key + 'Name',
          name: bgItemManager_modal_out.myBgPlanMsgObj.eleNameArr[index],
          headalign: 'center',
          width: 150,
          align: 'left',
          className: "nowrap BGmoneyClass",
          render: function(rowid, rowdata, data) {
            if(!$.isNull(data)) {
              return '<code title="' + data + '">' + data + '</code>';
            } else {
              return '';
            }
          }
        });
      } else {
        tblCols1.push({
          field: key,
          name: bgItemManager_modal_out.myBgPlanMsgObj.eleNameArr[index],
          headalign: 'center',
          width: 150,
          align: 'center',
          className: "nowrap BGmoneyClass",
          render: function(rowid, rowdata, data) {
            if(!$.isNull(data)) {
              return '<code title="' + data + '">' + data + '</code>';
            } else {
              return '';
            }
          }
        });
      }
    }
    //CWYXM-18080 编制指标时需要增加文本说明项，只录入文本，用于描述指标信息--zsj--查询条件区域
    for (var k = 0; k < bgItemManager_modal_out.myBgPlanObj.planVo_Txts.length; k++) {
      var code = shortLineToTF(bgItemManager_modal_out.myBgPlanObj.planVo_Txts[k].eleFieldName)
      tblCols1.push({
        field: code,
        name: bgItemManager_modal_out.myBgPlanObj.planVo_Txts[k].eleName,
        headalign: 'center',
        width: 150,
        align: 'center',
        className: "nowrap BGThirtyLen",
        render: function(rowid, rowdata, data) {
          if(!$.isNull(data)) {
            return '<code title="' + data + '">' + data + '</code>';
          } else {
            return '';
          }
        }
      });
    }
		//bug76244--增加备注列--经侯总确认目前只加指标调整与指标调剂
		tblCols1.push({
      field: 'remark',
      name: '备注',
      headalign: 'center',
      width: 150,
      type: 'input',
      className: "nowrap remark BGThirtyLen remarkOut",
      render: function(rowid, rowdata, data) {
        if(!$.isNull(data)) {
          return '<code title="' + data + '">' + data + '</code>';
        } else {
          return '';
        }
      },
      onKeyup: function(e) {
      }
    });
    var cutCur = 0
		for(var i = 0; i < modal_select_outItems.length; i++) { //add by guohx  20180109
      modal_select_outItems[i].bgItemBalanceCur = modal_select_outItems[i].bgItemBalanceCur + modal_select_outItems[i].bgCutCur;
      cutCur += modal_select_outItems[i].bgCutCur;
    }
    $("#twosidesAdj_outSumMoney").html($.formatMoney(cutCur,2));
		// modal_table_sheet3_out = $("#" + modal_tableId_sheet3_out).ufmaDataTable({
		// 	data: modal_select_outItems,
		// 	columns: tblCols1,
		// 	initComplete: function() {
		// 		for(var i = 0; i < modal_select_outItems.length; i++) {
		// 			$("#table_outItems_selected tbody td[name='bgItemSummary']").each(function() {
		// 				$(this).attr('title', modal_select_outItems[i].bgItemSummary);
		// 				$(this).addClass('BGThirtyLen');
		// 			});
		// 		}
		// 		//3, 为两个表格增加监听事件
		// 		addListenerToModalTable_sheet3();
		// 		$.fn.dataTable.ext.errMode = 'none';
		// 	}
    // });
    if(page.statusNavType == "3") {
      disabledFlag = true;
    } else {
      disabledFlag = false;
    }
    $('#table_outItems_selected').ufDatagrid({
      data: modal_select_outItems,
      idField: 'bgItemCode', //用于金额汇总
      pId: 'pid', //用于金额汇总
      disabled: disabledFlag, //可选
      paginate: false, //分页
      columns: [tblCols1],
      initComplete: function(options, data) {
        ufma.isShow(reslist);
      }
    });
		//2, 绘制调入的指标表格
		var tblCols2 = [{
        field: 'bgItemCode',
        name: '指标编码',
        headalign: 'center',
        width: 150,
        className: "nowrap BGasscodeClass",
        render: function(rowid, rowdata, data) {
          if(!$.isNull(data)) {
            return '<span title="' + data + '">' + data + '</span>';
          } else {
            return '';
          }
        }
      },
      // CWYXM-18408--指标年结涉及采购合同报销模块占用的指标结转完善
			{
        field: 'bgTypeName',
        name: '指标类型',
        headalign: 'center',
        width: 150,
        className: "nowrap BGTenLen",
        render: function(rowid, rowdata, data) {
          if(!$.isNull(data)) {
            return '<span title="' + data + '">' + data + '</span>';
          } else {
            return '';
          }
        }
			},
			{
        field: 'bgItemSummary',
        name: '摘要',
        headalign: 'center',
        width: 150,
        className: "nowrap BGThirtyLen",
        render: function(rowid, rowdata, data) {
          if(!$.isNull(data)) {
            return '<span title="' + data + '">' + data + '</span>';
          } else {
            return '';
          }
        }
			}
		]
		if(currentplanData.isComeDocNum == "是") {
			tblCols2.push({
        field: 'comeDocNum',
        name: '来文文号',
        headalign: 'center',
        width: 200,
        className: "nowrap BGThirtyLen",
        render: function(rowid, rowdata, data) {
          if(!$.isNull(data)) {
            return '<span title="' + data + '">' + data + '</span>';
          } else {
            return '';
          }
        }
			});
		}
		if(currentplanData.isSendDocNum == "是") {
			tblCols2.push({
        field: 'sendDocNum',
        name: page.sendCloName,
        headalign: 'center',
        width: 200,
        className: "nowrap BGThirtyLen",
        render: function(rowid, rowdata, data) {
          if(!$.isNull(data)) {
            return '<span title="' + data + '">' + data + '</span>';
          } else {
            return '';
          }
        }
			});
    }
    //CWYXM-17554 预算方案设置中，增加财政指标ID属性，可选择是否启用，启用时，选择预算方案新增指标时，需要录入指标id，指标id也需要参与指标的要素唯一性校验--zsj
    if(currentplanData.isFinancialBudget == "1") {
			tblCols2.push({
        field: 'bgItemIdMx',
        name: '财政指标ID',
        headalign: 'center',
        width: 200,
        className: "nowrap BGThirtyLen",
        render: function(rowid, rowdata, data) {
          if(!$.isNull(data)) {
            return '<span title="' + data + '">' + data + '</span>';
          } else {
            return '';
          }
        }
			});
		}
		tblCols2.push({
      type: "money",
      field: 'bgItemBalanceCur',
      name: '指标余额',
      headalign: 'center',
      width: 200,
      align: 'right',
      className: "nowrap BGmoneyClass",
      render: function(rowid, rowdata, data) {
        if(!$.isNull(data)) {
          return $.formatMoney(data, 2);
        } else {
          return '';
        }
      }
		}, {
      type: "money",
      field: 'dispenseCurOut',
      name: '调入金额',
      headalign: 'center',
      width: 200,
      align: 'right',
      className: "nowrap BGmoneyClass",
      render: function(rowid, rowdata, data) {
        if(!$.isNull(data)) {
          return $.formatMoney(data, 2);
        } else {
          return '';
        }
      },
      onKeyup: function(e) {
      }
		}, {
      field: 'afterDispenseCur',
      name: '调整后金额',
      headalign: 'center',
      width: 200,
      align: 'right',
      className: "nowrap BGmoneyClass",
      render: function(rowid, rowdata, data) {
        if(!$.isNull(data)) {
          return $.formatMoney(data, 2);
        } else {
          return '';
        }
      }
		});
		//循环添加预算方案的要素信息
		for(var index = 0; index < bgItemManager_modal_in.myBgPlanMsgObj.eleCodeArr.length; index++) {
      var key = _BgPub_getEleDataFieldNameByCode(bgItemManager_modal_in.myBgPlanMsgObj.eleCodeArr[index], bgItemManager_modal_in.myBgPlanMsgObj.eleFieldName[index]);
      if (key != 'isUpBudget') {
        tblCols2.push({
          field: key + 'Name',
          name: bgItemManager_modal_in.myBgPlanMsgObj.eleNameArr[index],
          headalign: 'center',
          width: 200,
          className: "nowrap BGThirtyLen",
          render: function(rowid, rowdata, data) {
            if(!$.isNull(data)) {
              return '<span title="' + data + '">' + data + '</span>';
            } else {
              return '';
            }
          }
        })
      } else {
        tblCols2.push({
          field: key,
          name: bgItemManager_modal_in.myBgPlanMsgObj.eleNameArr[index],
          headalign: 'center',
          width: 200,
          align:'center',
          className: "nowrap BGThirtyLen",
          render: function(rowid, rowdata, data) {
            if(!$.isNull(data)) {
              return '<span title="' + data + '">' + data + '</span>';
            } else {
              return '';
            }
          }
        })
      }
    }
    //CWYXM-18080 编制指标时需要增加文本说明项，只录入文本，用于描述指标信息--zsj--查询条件区域
    for (var k = 0; k < bgItemManager_modal_in.myBgPlanObj.planVo_Txts.length; k++) {
      var code = shortLineToTF(bgItemManager_modal_in.myBgPlanObj.planVo_Txts[k].eleFieldName)
      tblCols2.push({
        field: code,
        name: bgItemManager_modal_in.myBgPlanObj.planVo_Txts[k].eleName,
        headalign: 'center',
        width: 200,
        className: "nowrap BGThirtyLen",
        render: function(rowid, rowdata, data) {
          if(!$.isNull(data)) {
            return '<span title="' + data + '">' + data + '</span>';
          } else {
            return '';
          }
        }
      });
    }
		//bug76244--增加备注列--经侯总确认目前只加指标调整与指标调剂
		tblCols2.push({
      type: 'input',
      field: 'remark',
      name: '备注',
      headalign: 'center',
      width: 200,
      className: "remark nowrap BGThirtyLen remarkIn",
      render: function(rowid, rowdata, data) {
        if(!$.isNull(data)) {
          return '<span title="' + data + '">' + data + '</span>';
        } else {
          return '';
        }
      }
    });
    var addCur = 0
		for(var i = 0; i < modal_select_inItems.length; i++) {
			var $selNav = $(".nav.nav-tabs").find("li.NAVSELECT");
			var statusNav = $selNav.find("a").attr("data-status");
			if(statusNav == 'A') {
        modal_select_inItems[i].bgItemBalanceCur = modal_select_inItems[i].bgItemBalanceCur - modal_select_inItems[i].bgAddCur
      }
      addCur += modal_select_inItems[i].bgAddCur;
    }
    $("#twosidesAdj_inSumMoney").html($.formatMoney(addCur,2));
    var outMoney = !$.isNull($('#twosidesAdj_outSumMoney').html()) ? $('#twosidesAdj_outSumMoney').html().replace(/,/g, '') : 0;
    var diffCur = parseFloat(outMoney) - parseFloat(addCur);
    $("#twosidesAdj_balanceMoney").html($.formatMoney(diffCur,2));
		// modal_table_sheet3_in = $("#" + modal_tableId_sheet3_in).ufmaDataTable({
		// 	data: modal_select_inItems,
		// 	columns: tblCols2,
		// 	initComplete: function() {
		// 		for(var i = 0; i < modal_select_inItems.length; i++) {
		// 			$("#" + modal_tableId_sheet3_in + " tbody td[name='bgItemSummary']").each(function() {
		// 				$(this).attr('title', modal_select_inItems[i].bgItemSummary);
		// 				$(this).addClass('BGThirtyLen');
		// 			});
		// 		}
		// 		//3, 为两个表格增加监听事件
		// 		// addListenerToModalTable_sheet3();
		// 		$.fn.dataTable.ext.errMode = 'none';
		// 	}
    // });
    if(page.statusNavType == "3") {
      disabledFlag = true;
    } else {
      disabledFlag = false;
    }
    $('#table_inItems_selected').ufDatagrid({
      data: modal_select_inItems,
      idField: 'bgItemCode', //用于金额汇总
      pId: 'pid', //用于金额汇总
      disabled: disabledFlag, //可选
      paginate: false, //分页
      columns: [tblCols2],
      initComplete: function(options, data) {
        ufma.isShow(reslist);
      }
    });
		//取消事件的比较数据
    // cacheSheet3Out = modal_table_sheet3_out.getTableData()
    cacheSheet3Out = $('#table_outItems_selected').getObj().getData();
    // cacheSheet3In = modal_table_sheet3_in.getTableData()
    cacheSheet3In = $('#table_inItems_selected').getObj().getData();

		//4, 计算调入和调出金额
		// doPaintTable_Modal_Sheet3_ComputeOutAndInMoney();
		//5, 将表格的调剂金额都显示0
		if(modal_open_type == 1) {
			$("#" + modal_tableId_sheet3_out + " tbody td[name='dispenseCurOut']").find("div.money-label").text("0.00");
			$("#" + modal_tableId_sheet3_in + " tbody td[name='dispenseCurOut']").find("div.money-label").text("0.00");
		}
		ufma.isShow(reslist);
  };
  // 调出金额
  $(document).on("blur", "#table_outItems_selectedmoneydispenseCurOut", function () {
    var dSumOutMoney = 0.00;
    //bugCWYXM-4382--1.调出调入清零后调整后余额计算错误;2.清零调出调入保存提示问题--zsj
    var outMoney = !$.isNull($(this).val()) ? $(this).val().replace(/,/g, '') : 0;
    var rowid = $(this).closest('div').attr('rowid');
    var afterDispenseCur = 0;
    var bgItemBalanceCur = $('.uf-grid-body-view tr#' + rowid).find('td[name=bgItemBalanceCur').html();
    var dSumInMoney = !$.isNull($('#twosidesAdj_inSumMoney').html()) ? $('#twosidesAdj_inSumMoney').html().replace(/,/g, '') : 0;
    var maxOutMoney = !$.isNull(bgItemBalanceCur) ? bgItemBalanceCur.replace(/,/g, '') : 0;
    var subOut = 0;
    if(parseFloat(outMoney) > parseFloat(maxOutMoney)) {
      ufma.showTip("调出金额不能大于可调出金额", function(){
        $(this).val('');
        return false;
      }, 'warning'); 
    } else {
      if(!$.isNull(outMoney)) {
        //CWYXM-8127--修改调出金额时调出合计金额问题--zsj
        var outjust = 0;
        if(outMoney != 0) {
          outjust = outMoney;
        } else {
          outjust = 0;
        }
        dSumOutMoney = parseFloat(dSumOutMoney) + parseFloat(outjust + "");
        afterDispenseCur = parseFloat(maxOutMoney) - parseFloat(outjust);
        subOut = dSumOutMoney - dSumInMoney;
        $('.uf-grid-body-view tr#' + rowid).find('td[name=afterDispenseCur').text($.formatMoney(afterDispenseCur, 2));
        $("#twosidesAdj_outSumMoney").text($.formatMoney(dSumOutMoney, 2));
        $("#twosidesAdj_outSumMoney").attr("v", dSumOutMoney);
        $("#twosidesAdj_balanceMoney").text($.formatMoney(subOut, 2));
        $("#twosidesAdj_balanceMoney").attr("v", subOut);
      }
    }
  })
  // 调入金额
  $(document).on("blur", "#table_inItems_selectedmoneydispenseCurOut", function () {
    var dSumInMoney = 0.00;
    //bugCWYXM-4382--1.调出调入清零后调整后余额计算错误;2.清零调出调入保存提示问题--zsj
    var inMoney = !$.isNull($(this).val()) ? $(this).val().replace(/,/g, '') : 0;
    var rowid = $(this).closest('div').attr('rowid');
    var afterDispenseCur = 0;
    var bgItemBalanceCur = $('.uf-grid-body-view tr#' + rowid).find('td[name=bgItemBalanceCur').html();
    var dSumOutMoney = !$.isNull($('#twosidesAdj_outSumMoney').html()) ? $('#twosidesAdj_outSumMoney').html().replace(/,/g, '') : 0;
    var subOut = 0;
    var maxInMoney = !$.isNull(bgItemBalanceCur) ? bgItemBalanceCur.replace(/,/g, '') : 0;
    if(parseFloat(inMoney) > parseFloat(maxInMoney)) {
      ufma.showTip("调出金额不能大于可调出金额", function(){
        $(this).val('');
        return false;
      }, 'warning'); 
    } else {
      if(!$.isNull(inMoney)) {
        //CWYXM-8127--修改调出金额时调出合计金额问题--zsj
        var injust = 0;
        if(inMoney != 0) {
          injust = inMoney.replace(/,/g, '');
        } else {
          injust = 0;
        }
        dSumInMoney = parseFloat(dSumInMoney) + parseFloat(injust + "");
        afterDispenseCur = parseFloat(maxInMoney) - parseFloat(injust);
        subOut = dSumOutMoney - dSumInMoney;
        $('.uf-grid-body-view tr#' + rowid).find('td[name=afterDispenseCur').text($.formatMoney(afterDispenseCur, 2));
        $("#twosidesAdj_inSumMoney").text($.formatMoney(dSumInMoney, 2));
        $("#twosidesAdj_inSumMoney").attr("v", dSumInMoney);
        $("#twosidesAdj_balanceMoney").text($.formatMoney(subOut, 2));
        $("#twosidesAdj_balanceMoney").attr("v", subOut);
      }
    }
  })
	// var doPaintTable_Modal_Sheet3_ComputeOutAndInMoney = function() {
	// 	var dSumOutMoney = 0.00;
	// 	var dSumInMoney = 0.00;
	// 	$("#" + modal_tableId_sheet3_out + " table").find("tbody tr").each(function(index, obj) {
	// 		var rowDt_1 = modal_table_sheet3_out.getData($(this).attr("id"));
	// 		var rowDtShow_1 = modal_table_sheet3_out.getTrData($(this).attr("id"));
	// 		//bugCWYXM-4382--1.调出调入清零后调整后余额计算错误;2.清零调出调入保存提示问题--zsj
	// 		if(!$.isNull(rowDtShow_1.dispenseCurOut)) {
	// 			//CWYXM-8127--修改调出金额时调出合计金额问题--zsj
	// 			var outjust = 0;
	// 			if(rowDtShow_1.dispenseCurOut != 0) {
	// 				outjust = rowDtShow_1.dispenseCurOut.replace(/,/g, '');
	// 			} else {
	// 				outjust = 0;
	// 			}
	// 			dSumOutMoney = dSumOutMoney + parseFloat(outjust + "");
	// 			rowDt_1.afterDispenseCur = parseFloat(rowDt_1.bgItemBalanceCur) - parseFloat(outjust);
	// 			$(this).find("td[name='afterDispenseCur']").find("div:eq(0)").text($.formatMoney(rowDt_1.afterDispenseCur, 2));

	// 		}
	// 	});
	// 	$("#" + modal_tableId_sheet3_in + " table").find("tbody tr").each(function(index, obj) {
	// 		var rowDt_2 = modal_table_sheet3_in.getData($(this).attr("id"));
	// 		var rowDtShow_2 = modal_table_sheet3_in.getTrData($(this).attr("id"));
	// 		//bugCWYXM-4382--1.调出调入清零后调整后余额计算错误;2.清零调出调入保存提示问题--zsj
	// 		if(!$.isNull(rowDtShow_2.dispenseCurOut)) {
	// 			//CWYXM-8127--修改调入金额时调入合计金额问题--zsj
	// 			var outjust = 0;
	// 			if(rowDtShow_2.dispenseCurOut != 0) {
	// 				outjust = rowDtShow_2.dispenseCurOut.replace(/,/g, '');
	// 			} else {
	// 				outjust = 0;
	// 			}
	// 			dSumInMoney = dSumInMoney + parseFloat(outjust + "");
	// 			rowDt_2.afterDispenseCur = parseFloat(rowDt_2.bgItemBalanceCur) + parseFloat(outjust);
	// 			$(this).find("td[name='afterDispenseCur']").find("div:eq(0)").text($.formatMoney(rowDt_2.afterDispenseCur, 2));
	// 		}
	// 	});
	// 	$("#twosidesAdj_outSumMoney").text($.formatMoney(dSumOutMoney, 2));
	// 	$("#twosidesAdj_outSumMoney").attr("v", dSumOutMoney);
	// 	$("#twosidesAdj_inSumMoney").text($.formatMoney(dSumInMoney, 2));
	// 	$("#twosidesAdj_inSumMoney").attr("v", dSumInMoney);
	// 	$("#twosidesAdj_balanceMoney").text($.formatMoney(dSumOutMoney - dSumInMoney, 2));
	// 	$("#twosidesAdj_balanceMoney").attr("v", dSumOutMoney - dSumInMoney);
	// 	ufma.isShow(reslist);
	// 	$("#table_outItems_selected tbody td[name='dispenseCurOut']").find("input[name='dispenseCurOut']").attr("maxlength", "20"); //控制金额列输入不可超出20位
	// 	$("#table_inItems_selected tbody td[name='dispenseCurOut']").attr("maxlength", "20"); //控制金额列输入不可超出20位
	// }

	// var addListenerToModalTable_sheet3 = function() {
	// 	// 调剂出 指标表格事件
	// 	var $tmptable = $('#' + modal_table_sheet3_out.id + ' .ufma-datatable');
	// 	$tmptable.find("td input").off("keydown.bg").on("keydown.bg", function(e) {
	// 		var $input = $(this);
	// 		var rowIndex = $input.closest("tr").index() + 1; //当前行
	// 		if(e.keyCode == 38) {
	// 			//向上  方向键
	// 			if(rowIndex > 1) {
	// 				var $preRow = $('#' + modal_table_sheet3_out.id + ' .ufma-datatable').find("tr:eq(" + (rowIndex - 1) + ")");
	// 				$(this).blur();
	// 				$preRow.find("input").closest("div").show();
	// 				$preRow.find("input").focus();
	// 			}
	// 		} else if(e.keyCode == 40) {
	// 			//向下  方向键
	// 			$(this).blur();
	// 			if(rowIndex < ($tmptable.find("tr").length - 1)) {
	// 				var $nextRow = $('#' + modal_table_sheet3_out.id + ' .ufma-datatable').find("tr:eq(" + (rowIndex + 1) + ")");
	// 				$nextRow.find("input").closest("div").show();
	// 				$nextRow.find("input").focus();
	// 			}
	// 		}
	// 	});
	// 	$tmptable.find("td input").off("blur.bg").on("blur.bg", function(e) {
	// 		var $input = $(this);
	// 		var $curRow = $input.closest("tr");
	// 		var rowDt_1 = modal_table_sheet3_out.getData($curRow.attr("id"));
	// 		var rowDtShow_1 = modal_table_sheet3_out.getTrData($curRow.attr("id"));
	// 		var doOutMoney = parseFloat(rowDtShow_1.dispenseCurOut + "");
	// 		var maxOutMoney = parseFloat(rowDt_1.bgItemBalanceCur + "");
	// 		if(doOutMoney < 0) {
	// 			$input.val(0);
	// 			rowDtShow_1.dispenseCurOut = 0;
	// 			$input.closest("div").show();
	// 		}
	// 		if(doOutMoney > maxOutMoney) {
	// 			ufma.showTip("调出金额不能大于可调出金额", null, "error");
	// 			$input.val(0);
	// 			$input.closest("div").show();
	// 		}
	// 		// doPaintTable_Modal_Sheet3_ComputeOutAndInMoney();
	// 	});
	// 	// 调剂入 指标表格事件
	// 	var $tmptable2 = $('#' + modal_table_sheet3_in.id + ' .ufma-datatable');
	// 	$tmptable2.find("td input").off("keydown.bg").on("keydown.bg", function(e) {
	// 		var $input = $(this);
	// 		var rowIndex = $input.closest("tr").index() + 1; //当前行
	// 		if(e.keyCode == 38) {
	// 			//向上  方向键
	// 			if(rowIndex > 1) {
	// 				var $preRow = $('#' + modal_table_sheet3_in.id + ' .ufma-datatable').find("tr:eq(" + (rowIndex - 1) + ")");
	// 				$(this).blur();
	// 				$preRow.find("input").closest("div").show();
	// 				$preRow.find("input").focus();
	// 			}
	// 		} else if(e.keyCode == 40) {
	// 			//向下  方向键
	// 			$(this).blur();
	// 			if(rowIndex < ($tmptable.find("tr").length - 1)) {
	// 				var $nextRow = $('#' + modal_table_sheet3_in.id + ' .ufma-datatable').find("tr:eq(" + (rowIndex + 1) + ")");
	// 				$nextRow.find("input").closest("div").show();
	// 				$nextRow.find("input").focus();
	// 			}
	// 		}
	// 	});
	// 	$tmptable2.find("td input").off("blur.bg").on("blur.bg", function(e) {
	// 		// doPaintTable_Modal_Sheet3_ComputeOutAndInMoney();
	// 		var $input = $(this);
	// 		var $curRow = $input.closest("tr");
	// 		var rowDtShow_2 = modal_table_sheet3_out.getTrData($curRow.attr("id"));
	// 		var doInMoney = parseFloat(rowDtShow_2.dispenseCurOut + "");
	// 		var balanceMoney = parseFloat($("#twosidesAdj_balanceMoney").attr("v"));
	// 		if(doInMoney < 0) {
	// 			$input.val(0);
	// 			rowDtShow_2.dispenseCurOut = 0;
	// 			$input.closest("div").show();
	// 		}
	// 		if(balanceMoney < 0) {
	// 			ufma.showTip("调入的金额超出总调出金额", null, "error");
	// 			$input.val(0);
	// 			$input.closest("div").show();
	// 			// doPaintTable_Modal_Sheet3_ComputeOutAndInMoney();
	// 		}
	// 	});
	// 	$("#" + modal_tableId_sheet3_out + " tbody td[name='dispenseCurOut']").find("input").off("focus.bgA").on("focus.bgA", function() {
	// 		if(!$(this).hasClass("bgSelected")) {
	// 			$(this).select();
	// 			$(this).addClass("bgSelected");
	// 		}
	// 	});
	// 	$("#" + modal_tableId_sheet3_out + " tbody td[name='dispenseCurOut']").find("input").off("blur.bgA").on("blur.bgA", function() {
	// 		$(this).removeClass("bgSelected");
	// 		if($(this).val() == "0") {
	// 			$("#" + modal_tableId_sheet3_out + " tbody td[name='dispenseCurOut']").find("div.money-label").text("0.00");
	// 		}
	// 	});
	// 	$("#" + modal_tableId_sheet3_in + " tbody td[name='dispenseCurOut']").find("input").off("focus.bgA").on("focus.bgA", function() {
	// 		if(!$(this).hasClass("bgSelected")) {
	// 			$(this).select();
	// 			$(this).addClass("bgSelected");
	// 		}
	// 	});
	// 	$("#" + modal_tableId_sheet3_in + " tbody td[name='dispenseCurOut']").find("input").off("blur.bgA").on("blur.bgA", function() {
	// 		$(this).removeClass("bgSelected");
	// 		if($(this).val() == "0") {
	// 			$("#" + modal_tableId_sheet3_in + " tbody td[name='dispenseCurOut']").find("div.money-label").text("0.00");
	// 		}
	// 	});
	// };

	/**
	 * 模态框保存单据
	 * @return boolean
	 */
	var doSaveBill = function(successFunc) {
		if(!doSaveBill_check()) {
			return false;
		}
		modal_curBill.items = [];
		modal_curBill.setYear = page.pfData.svSetYear;
		modal_curBill.billCur = !$.isNull($('#twosidesAdj_outSumMoney').html()) ? parseFloat($('#twosidesAdj_outSumMoney').html().replace(/,/g, '')) : 0
		modal_curBill.createUser = _bgPub_getUserMsg().userCode;
		modal_curBill.createUserName = _bgPub_getUserMsg().userName;
		modal_curBill.billDate = $('#bg_twoSidesAdjModal_dtp').getObj().getValue(); //_bgPub_getUserMsg().busDate;
		modal_curBill.applicant = _bgPub_getUserMsg().userCode;
		modal_curBill.applicantName = _bgPub_getUserMsg().userName;
		modal_curBill.latestOpUser = _bgPub_getUserMsg().userCode;
		modal_curBill.latestOpUserName = _bgPub_getUserMsg().userName;
		//bug77471--zsj
		if($("#bgInput-fileCount-twoSidesAdjLower").val() < fileLeng) {
			ufma.showTip('输入附件数不能小于已上传附件数！', function() {}, 'warning');
			return false;
		}
		var saveFlagOut = true;
		var saveFlagIn = true;
		modal_curBill.attachNum = $("#bgInput-fileCount-twoSidesAdjLower").val() //bug77471--zsj
    //1， 调出指标
    var outBill = $('#table_outItems_selected').getObj().getData();
    for (var b = 0; b < outBill.length; b++ ){
      var rowDt = outBill[b];
			var dispenseCurOut = typeof rowDt.dispenseCurOut === 'number' ? rowDt.dispenseCurOut : rowDt.dispenseCurOut.replace(/,/g, '') ;
			if(dispenseCurOut > 0) {
				rowDt.bgAddCur = 0;
				rowDt.checkAddCur = 0;
				rowDt.bgCutCur = dispenseCurOut; //rowDtShow.dispenseCurOut;
				rowDt.remark = rowDt.remark;
				rowDt.checkCutCur = dispenseCurOut; //rowDtShow.dispenseCurOut;
				rowDt.adjustDir = 2;
				rowDt.isNew = '是';
				modal_curBill.items[modal_curBill.items.length] = rowDt;
			} else {
				saveFlagIn = false;
			}
    }
		// $("#" + modal_tableId_sheet3_out + " table").find("tbody tr").each(function(index, tr) {
		// 	var rowDt = modal_table_sheet3_out.getData($(this).attr("id"));
		// 	var rowDtShow = modal_table_sheet3_out.getTrData($(this).attr("id"));
		// 	var dispenseCurOut = rowDtShow.dispenseCurOut.replace(/,/g, '');
		// 	//if(rowDtShow.dispenseCurOut > 0) {
		// 	if(dispenseCurOut > 0) {
		// 		rowDt.bgAddCur = 0;
		// 		rowDt.checkAddCur = 0;
		// 		rowDt.bgCutCur = dispenseCurOut; //rowDtShow.dispenseCurOut;
		// 		rowDt.remark = rowDtShow.remark;
		// 		rowDt.checkCutCur = dispenseCurOut; //rowDtShow.dispenseCurOut;
		// 		rowDt.adjustDir = 2;
		// 		rowDt.isNew = '是';
		// 		modal_curBill.items[modal_curBill.items.length] = rowDt;
		// 	} else {
		// 		saveFlagOut = false;
		// 	}
		// });
    //2， 调入指标
    var inBill = $('#table_inItems_selected').getObj().getData();
    for (var j = 0; j < inBill.length; j++ ){
      var dispenseCurOut = typeof inBill[j].dispenseCurOut === 'number' ? inBill[j].dispenseCurOut : inBill[j].dispenseCurOut.replace(/,/g, '') ;
      var rowDt = inBill[j];
			if(dispenseCurOut > 0) {
				rowDt.bgCutCur = 0;
				rowDt.checkCutCur = 0;
				rowDt.bgAddCur = dispenseCurOut; //rowDtShow.dispenseCurOut;
				rowDt.checkAddCur = dispenseCurOut; //rowDtShow.dispenseCurOut;
				rowDt.remark = rowDt.remark;
				rowDt.adjustDir = 1;
				rowDt.isNew = '是';
				modal_curBill.items[modal_curBill.items.length] = rowDt;
			} else {
				saveFlagIn = false;
			}
    }
		// $("#" + modal_tableId_sheet3_in + " table").find("tbody tr").each(function(index, tr) {
		// 	var rowDt = modal_table_sheet3_in.getData($(this).attr("id"));
		// 	var rowDtShow = modal_table_sheet3_in.getTrData($(this).attr("id"));
		// 	var dispenseCurOut = rowDtShow.dispenseCurOut.replace(/,/g, '');
		// 	//if(rowDtShow.dispenseCurOut > 0) {
		// 	if(dispenseCurOut > 0) {
		// 		rowDt.bgCutCur = 0;
		// 		rowDt.checkCutCur = 0;
		// 		rowDt.bgAddCur = dispenseCurOut; //rowDtShow.dispenseCurOut;
		// 		rowDt.checkAddCur = dispenseCurOut; //rowDtShow.dispenseCurOut;
		// 		rowDt.remark = rowDtShow.remark;
		// 		rowDt.adjustDir = 1;
		// 		rowDt.isNew = '是';
		// 		modal_curBill.items[modal_curBill.items.length] = rowDt;
		// 	} else {
		// 		saveFlagIn = false;
		// 	}
		// });
		if(saveFlagOut == true && saveFlagIn == true) {
			//3, 保存
			bgItemManager.saveBgBill(modal_curBill,
				function(result) {
					ufma.showTip("保存成功。", null, "success");
					if(!$.isNull(successFunc)) {
						successFunc();
					}
				},
				function(msg) {
					ufma.showTip("保存失败！" + msg, null, "error");
				});
		} else if(saveFlagOut == false) { //CWYXM-11029 指标调剂，未录入调入调出金额直接保存，目前提示‘至少保留一条调整记录！’--zsj
			ufma.showTip('请输入调出金额', function() {}, 'warning');
			return false;
		} else if(saveFlagIn == false) {
			ufma.showTip('请输入调出金额', function() {}, 'warning');
			return false;
		}
	};

	/**
	 * 保存前的检查
	 * @return {boolean}
	 */
	var doSaveBill_check = function() {
		if($("#twosidesAdj_balanceMoney").attr("v") != "0") {
			ufma.showTip("调出总金额不等于调入总金额", null, "error");
			return false;
		} else {
			return true;
		}

	};

	/**
	 * 模态框打开时候的初始化操作
	 */
	var doLoadModalWithData_init = function() {
		ufma.isShow(reslist);
		modal_Obj = null; //新增模态框的对象
		modal_curBill = null;
		modal_billAttachment = [];
		if(!$.isNull(modal_table_sheet1)) {
			modal_table_sheet1.destroy();
			$("#" + modal_tableId_sheet1).empty();
			modal_table_sheet1 = null;
		}
		if(!$.isNull(modal_table_sheet2)) {
			modal_table_sheet2.destroy();
			$("#" + modal_tableId_sheet2).empty();
			modal_table_sheet2 = null;
		}
		// if(!$.isNull(modal_table_sheet3_out)) {
		// 	$("#" + modal_tableId_sheet3_out).empty();
		// 	modal_table_sheet3_out = null;
		// }
		// if(!$.isNull(modal_table_sheet3_in)) {
		// 	$("#" + modal_tableId_sheet3_in).empty();
		// 	modal_table_sheet3_in = null;
    // }
    if($('#table_inItems_selected').length > 0) {
			$('#table_inItems_selected').html('')
		}
    if($('#table_outItems_selected').length > 0) {
			$('#table_outItems_selected').html('')
		}
		bgItemManager_modal_out.myBgPlanObj = null;
		bgItemManager_modal_out.myBgPlanMsgObj = null;
		bgItemManager_modal_in.myBgPlanObj = null;
		bgItemManager_modal_in.myBgPlanMsgObj = null;
		modal_select_outItems = [];
		modal_select_inItems = [];
	};

	/**
	 * 打开模态框，根据billdata确定是新增还是编辑。
	 * @param billData
	 */
	var doLoadModalWithData = function(billData) {
		page.statusNavType = ''; //bugCWYXM-4545--查看已审核的指标调剂单据，应不可以编辑--zsj
		//1, 初始化各种数据：模态框对象句柄，4个表格的对象， 模态框的bgitemmanager
		doLoadModalWithData_init();
		//2, 画 - 加载调入调出两个界面的预算方案头部
		moreMsgSetting_modal_out.agencyCode = bgItemManager_modal_out.agencyCode;
		moreMsgSetting_modal_out.bgPlanCacheId = bgPlanCacheId;
    moreMsgSetting_modal_out.cbBgPlanIdMain = cbBgPlanIdMain;
    moreMsgSetting_modal_out.cbBgPlanMain = cbBgPlanIdMain;
    moreMsgSetting_modal_out.openPageType = '1'; //表示需要摘要--CWYXM-11693--nbsh---指标分 解、调整、调剂选择指标时，增加按摘要查询的条件--zsj
    moreMsgSetting_modal_out.fromWay  = 'out'
    if(openType == "new") {
      modal_pnlFindRst_itemout = _PNL_MoreByBgPlan('twoSidesAdjItem_modal_step1_morePnl', moreMsgSetting_modal_out);
      setTimeout(function() {
        moreMsgSetting_modal_in.agencyCode = bgItemManager_modal_in.agencyCode;
        moreMsgSetting_modal_in.cbBgPlanIdMain = '';
        moreMsgSetting_modal_in.fromWay  = 'in'
        modal_pnlFindRst_itemin = _PNL_MoreByBgPlan('twoSidesAdjItem_modal_step2_morePnl', moreMsgSetting_modal_in);
      }, 3000)
    }

		//3, 画 - 加载头部的进度条
		progressController = _bgPub_Progress1("progress-twoSidesAdjItem", 1045, {
			count: 3,
			labels: ["选择调出指标", "选择调入指标", "调剂指标"]
		});
		//4, 画 - 显示模态框
		var modalWidth = 1090;
		modal_Obj = ufma.showModal("twoSidesAdjItem-add", modalWidth, 648, function() {});
		var modalMinHeight = $("#" + tblId).closest("body").outerHeight(true) - 20;
		//$(".u-msg-dialog").css("min-height", modalMinHeight + "px");
		var contentHeight = modalMinHeight - modal_Obj.modal.find('.u-msg-title').outerHeight(true);
		modal_Obj.modal.find('.u-msg-footer').each(function(ele) {
			contentHeight = contentHeight - $(this).outerHeight(true);
		});
		//modal_Obj.msgContent.css('height', contentHeight + 'px');
		var tmpTabControllerHeight = contentHeight - $("#modal-title-left").outerHeight(true) - 8 - 4 - 70;
		//$(".tabController").css("min-height", tmpTabControllerHeight + "px");
		$(".tabController").css("max-height", tmpTabControllerHeight + "px");
		$("#twoSidesAdjItemTable_msg_step4").css("left", (modalWidth - 200) / 2 + "px");
		$("#twoSidesAdjItemTable_msg_step4").css("top", "100px");
		//$("#sheet3_body").css("max-height", $(".tabController").outerHeight(true) - $("#sheet3_top").outerHeight(true) + "px");
		//5, 数据 - 加载顶部的单据号，申请人信息
		modal_curBill = $.extend({}, billData);
		$("#twoSidesAdjModal_makeOper").text(_bgPub_getUserMsg().userName);
    $("#twoSidesAdjModal_billCode").val(modal_curBill.billCode);
		//6, 数据 - 根据billData是否是新单来确定新增或展示。
		if(!$.isNull(modal_curBill.items) && modal_curBill.items.length > 0) {
			ufma.showloading("正在加载单据信息，请稍后...");
			modal_open_type = 2; //6.1, 修改模式
			modal_curSheetIndex = 3;
			page.statusNavType = modal_curBill.status; //bugCWYXM-4545--查看已审核的指标调剂单据，应不可以编辑--zsj
			// 2,加载单据的附件信息  getURL(0) + "/bg/attach/getAttach"   //17，附件查找
			var tmpRst = _bgPub_GetAttachment({
				"billId": billData.billId,
				"agencyCode": bgItemManager.agencyCode
			});
			if(!$.isNull(tmpRst.data.bgAttach)) {
				for(var m = 0; m < tmpRst.data.bgAttach.length; m++) {
					modal_billAttachment[modal_billAttachment.length] = {
						"filename": tmpRst.data.bgAttach[m].fileName,
						"filesize": 0,
						"fileid": tmpRst.data.bgAttach[m].attachId
					};
				}
				//$("#bgInput-fileCount-twoSidesAdjLower").val(modal_billAttachment.length + "");
			}
			$("#bgInput-fileCount-twoSidesAdjLower").val(billData.attachNum + "");
			//直接初始化两个数组
			modal_select_outItems = [];
			modal_select_inItems = [];
			for(var i = 0; i < modal_curBill.items.length; i++) {
				var tmpItem = modal_curBill.items[i];
				tmpItem.afterDispenseCur = parseFloat(tmpItem.bgItemBalanceCur);
				if(!$.isNull(tmpItem.bgAddCur) && tmpItem.bgAddCur > 0) {
					tmpItem.dispenseCurOut = tmpItem.bgAddCur;
					modal_select_inItems[modal_select_inItems.length] = tmpItem;
					if(modal_select_inItems.length == 1) {
						bgItemManager_modal_in.loadBgPlanObjById(tmpItem.bgPlanId);
					}
				} else {
					tmpItem.dispenseCurOut = tmpItem.bgCutCur;
					modal_select_outItems[modal_select_outItems.length] = tmpItem;
					if(modal_select_outItems.length == 1) {
						bgItemManager_modal_out.loadBgPlanObjById(tmpItem.bgPlanId)
					}
				}
			}
      gotoModalSheet(modal_curSheetIndex);
      //CWYXM-16991---mysql 指标调价点击更多显示页面有问题--zsj
      if(openType == 'edit'){
          setTimeout(function(){
              doPaintTable_Modal_Sheet3();
          },1000)
      }else{
          doPaintTable_Modal_Sheet3(); 
      } 
			ufma.hideloading();
			$('#btn-modal-next').addClass('hide');
			$('#btn-modal-pre').addClass('hide');
			$("#btn-modal-continue").hide();
			//修改  编辑界面不可修改单据日期  guohx
			$("#bg_twoSidesAdjModal_dtp input").attr("disabled", "disabled");
			$("#bg_twoSidesAdjModal_dtp span").hide();
			$("#bg_twoSidesAdjModal_dtp").css("background", "#eee");
			//已审核单据禁止编辑
			//bugCWYXM-4545--查看已审核的指标调剂单据，应不可以编辑--zsj
			if(page.statusNavType == "3") {
				$("#table_inItems_selected tbody td[name='dispenseCurOut']").removeClass('moneyEdit');
				$("#table_outItems_selected tbody td[name='dispenseCurOut']").removeClass('moneyEdit');
				$('#btn-modal-save').attr("disabled", "disabled");
				$("#table_inItems_selected tbody td[name='remark']").removeClass('textInputEdit');
				$("#table_outItems_selected tbody td[name='remark']").removeClass('textInputEdit');
			} else {
				$("#table_inItems_selected tbody td[name='dispenseCurOut']").addClass('moneyEdit');
				$("#table_outItems_selected tbody td[name='dispenseCurOut']").addClass('moneyEdit');
				$('#btn-modal-save').attr("disabled", false);
				$("#table_inItems_selected tbody td[name='remark']").addClass('textInputEdit');
				$("#table_outItems_selected tbody td[name='remark']").addClass('textInputEdit');
			}
			for(var i = 0; i < modal_select_inItems.length; i++) {
				$("#table_inItems_selected tbody td[name='remark']").each(function() {
					$(this).attr('title', modal_select_inItems[i].remark);
					$(this).addClass('BGThirtyLen');
				});
			}
			for(var i = 0; i < modal_select_outItems.length; i++) {
				$("#table_outItems_selected tbody td[name='remark']").each(function() {
					$(this).attr('title', modal_select_outItems[i].remark);
					$(this).addClass('BGThirtyLen');
				});
			}
		} else {
			modal_open_type = 1; //6.2, 新增模式
			modal_curSheetIndex = 1;
			gotoModalSheet(modal_curSheetIndex);
			$('#btn-modal-next').removeClass('hide');
			$('#btn-modal-pre').removeClass('hide');
			$("#bg_twoSidesAdjModal_dtp input").attr("disabled", false);
			$("#bg_twoSidesAdjModal_dtp span").show();
      $("#bg_twoSidesAdjModal_dtp").css("background", "#ffffff");
      //ZJGA820-1670---指标编制点击新增单据日期默认是2020年1月1日，需要改为登陆日期。经雪蕊、侯总确定改为当前登录日期--zsj
      $("#bg_twoSidesAdjModal_dtp").getObj().setValue(page.pfData.svTransDate);
			$("#table_inItems_selected tbody td[name='dispenseCurOut']").attr("disabled", false);
			$('#btn-modal-save').attr("disabled", false);
			$("#table_inItems_selected tbody td[name='remark']").attr("disabled", false);
			//  $('#_bgPub_cbb_BgPlan_twoSidesAdjItem_modal_step1_morePnl').getObj().val(cbBgPlanIdMain);
		}
		ufma.isShow(reslist);
	};

	/**
	 * 模态框 - 跳转到第几个sheet的界面变化
	 * @param sheetIndex integer： 1，2，3，4
	 */
	var gotoModalSheet = function(sheetIndex) {
		var $btnPre = $("#btn-modal-pre");
		var $btnNext = $("#btn-modal-next");
		var $btnClose = $("#btn-modal-close");
		if(!$.isNull(progressController)) {
			progressController.gotoStep(sheetIndex);
		}
		$(".tabController").hide();
		$(".tabController").removeClass("active");
		if(sheetIndex === 1) {
			$btnPre.hide();
			$btnNext.show();
			$("#btn-modal-close").attr("sheet", "1")
			$("#btn-modal-save").hide();
			$("#btn-modal-continue").hide();
			$(".tabController.step1").addClass("active");
			$(".tabController.step1").show();
		} else if(sheetIndex === 2) {
			$btnPre.show();
			$btnNext.show();
			$("#btn-modal-close").attr("sheet", "2")
			$(".tabController.step2").addClass("active");
			$(".tabController.step2").show();
		} else if(sheetIndex === 3) {
			$btnPre.show();
			$btnNext.hide();
			$("#btn-modal-close").attr("sheet", "3")
			$("#btn-modal-save").show();
			$("#btn-modal-save").removeClass("btn-default");
			$("#btn-modal-save").addClass("btn-primary");
			$(".tabController.step3").addClass("active");
			$(".tabController.step3").show();
		} else if(sheetIndex === 4) {
			$btnPre.hide();
			$btnNext.hide();
			$("#btn-modal-close").attr("sheet", "4")
			$("#btn-modal-save").hide();
			$("#btn-modal-continue").show();
			$("#btn-modal-continue").removeClass("btn-default");
			$("#btn-modal-continue").addClass("btn-primary");
			$btnClose.text("关闭");
			$(".tabController.step4").addClass("active");
			$(".tabController.step4").show();
		}
	};

	/**
	 * 从模态框第一个页签中采集选中的调剂出指标
	 * @return {boolean}
	 */
	var collectModalSheetData1 = function() {
		modal_select_outItems = [];
		$("#" + modal_tableId_sheet1 + " tbody tr").each(function(index, tr) {
			if($(this).find("input[type='checkbox']").is(":checked") == true) {
				modal_select_outItems[modal_select_outItems.length] = $.extend({}, modal_table_sheet1.row(tr).data());
			}
		});
		return modal_select_outItems.length > 0;
	};

	/**
	 * 从模态框第二个页签中采集选中的调剂入的指标
	 * @return {boolean}
	 */
	var collectModalSheetData2 = function() {
		modal_select_inItems = [];
		$("#" + modal_tableId_sheet2 + " tbody tr").each(function(index, tr) {
			if($(this).find("input[type='checkbox']").is(":checked") == true) {
				modal_select_inItems[modal_select_inItems.length] = $.extend({}, modal_table_sheet2.row(tr).data());
			}
		});
		return modal_select_inItems.length > 0;
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
			if(rowObj.billId === billId) {
				$("#" + tblId).DataTable().row(i).remove();
			}
		}
		$("#" + tblId).DataTable().draw();
  };
  // bugCWYXM-3951--新增需求记忆预算方案--取出已经记忆的数据--zsj
  var updateSessionPlan = function (key, value) {
    var argu = {
      acctCode: "*",
      agencyCode: bgItemManager_modal_in.agencyCode,
      configKey: key,
      configValue: value,
      menuId: menuId
    }
    ufma.post('/pub/user/menu/config/update', argu, function (reslut) {});
  };
	//********************************************************[绑定事件]********************************************************
	/**
	 * 主界面 - 新增 按钮点击事件。打开模态框
	 */
	$("#btn-add-twoSidesAdjItem").on("click", function() {
		openType = "new";
		cbBgPlanIdMain = $('#_bgPub_cbb_BgPlan_bgMoreMsgPnl-twoSidesAdjItem').getObj().getValue();
		cbBgPlanTextMain = $('#_bgPub_cbb_BgPlan_bgMoreMsgPnl-twoSidesAdjItem').getObj().getText();
		bgItemManager.newBill(
			function(data) {
				doLoadModalWithData(data);
			},
			function(msg) {
				ufma.showTip(msg, null, "error");
			}
		)
	});

	/**
	 * 模态框 - 上一步
	 */
	$("#btn-modal-pre").on("click", function() {
		modal_curSheetIndex = $(".tabController.active").attr("pageindex");
		if(modal_curSheetIndex === 1) {
			return false;
		}
		modal_curSheetIndex--;
		switch(modal_curSheetIndex) {
			case 1:
				break;
			case 2:
				break;
			case 3:
				break;
			case 4:
				break;
			default:
				break;
        }
        //CWYXM-16380 指标调剂编辑选择调剂指标后输入调剂金额,点击上一步的界面有问题,具体见截图--zsj
		//$("#" + modal_tableId_sheet2).DataTable().clear().draw();
		gotoModalSheet(modal_curSheetIndex);
	});
	/**
	 * 模态框 - 下一步
	 */
	$("#btn-modal-next").on("click", function() {
		modal_curSheetIndex = $(".tabController.active").attr("pageindex");
		if(modal_curSheetIndex == 4) {
			modal_curSheetIndex = 1;
		} else {
			modal_curSheetIndex++;
		}
		switch(modal_curSheetIndex) {
			case 1: //4->1
				bgItemManager.newBill(
					function(data) {
						data.bgPlanId = bgItemManager.myBgPlanObj.chrId;
						modal_curBill = $.extend({}, data);
						$("#twoSidesAdjModal_makeOper").text(_bgPub_getUserMsg().userName);
						$("#twoSidesAdjModal_billCode").val(modal_curBill.billCode);
					},
					function(msg) {
						ufma.showTip('获取新单错误。' + msg, null, "error");
					}
				);
				gotoModalSheet(modal_curSheetIndex);
				break;
			case 2: //1->2
				if(!collectModalSheetData1()) {
					ufma.showTip("请选择要调剂出的指标", null, "warning");
					return false;
				}
				//CWYXM-6976--zsj--多对一的调剂要保证所选余额都不为0
				for(var i = 0; i < modal_select_outItems.length; i++) {
					if(modal_select_outItems[i].bgItemBalanceCur <= 0) {
						ufma.showTip('该指标可用余额为0,请重新选择一条指标！', function() {}, 'error');
						return false;
					}
				}
				cbBgPlanId = $('#_bgPub_cbb_BgPlan_twoSidesAdjItem_modal_step1_morePnl').getObj().getValue();
				cbBgPlanText = $('#_bgPub_cbb_BgPlan_twoSidesAdjItem_modal_step1_morePnl').getObj().getText();
				tempBeginCur = modal_select_outItems[0].parentBalanceCur;
				tempBeginPid = modal_select_outItems[0].bgItemParentid;
				var num = 0;
				if(modal_select_outItems.length == 1) {
					gotoModalSheet(modal_curSheetIndex);
          moreMsgSetting_modal_in.agencyCode = bgItemManager_modal_in.agencyCode;
          // ZJGA820-1827 --指标调剂模块新增页面2选择调入指标的预算方案需要增加记忆功能。--经雪蕊确认：只记忆主界面的预算方案，弹窗新增调出方案与主界面一致，调入方案与调出方案一致--zsj
          moreMsgSetting_modal_in.cbBgPlanOut = cbBgPlanId;
          modal_pnlFindRst_itemin = _PNL_MoreByBgPlan('twoSidesAdjItem_modal_step2_morePnl', moreMsgSetting_modal_in);
				} else {
					for(var i = 1; i < modal_select_outItems.length; i++) {
						if((tempBeginCur != -1) && (modal_select_outItems[i].parentBalanceCur != -1)) {
							if(tempBeginPid == modal_select_outItems[i].bgItemParentid) {
								num++;
							} else {
								ufma.showTip("只有均无父指标或具有相同父指标的指标才可以调剂!", null, "error");
								return false;
							}
						} else if((tempBeginCur == -1) && (modal_select_outItems[i].parentBalanceCur == -1)) {
							num++;
						} else {
							ufma.showTip("只有均无父指标或具有相同父指标的指标才可以调剂!", null, "error");
							return false;
						}
					}
					if(num == modal_select_outItems.length - 1) {
						gotoModalSheet(modal_curSheetIndex);
            moreMsgSetting_modal_in.agencyCode = bgItemManager_modal_in.agencyCode;
            // ZJGA820-1827 --指标调剂模块新增页面2选择调入指标的预算方案需要增加记忆功能。--经雪蕊确认：只记忆主界面的预算方案，弹窗新增调出方案与主界面一致，调入方案与调出方案一致--zsj
            moreMsgSetting_modal_in.cbBgPlanOut = cbBgPlanId;
            modal_pnlFindRst_itemin = _PNL_MoreByBgPlan('twoSidesAdjItem_modal_step2_morePnl', moreMsgSetting_modal_in);
            $('#_bgPub_cbb_BgPlan_twoSidesAdjItem_modal_step2_morePnl').getObj().val(cbBgPlanId);
					}
        }
        // var value = cbBgPlanId+','+cbBgPlanText;
        // updateSessionPlan('_bgPub_cbb_BgPlan_twoSidesAdjItem_modal_step1_morePnl', value);
				break;
			case 3: //2->3
				if(!collectModalSheetData2()) {
					ufma.showTip("请选择要调剂入的指标", null, "warning");
					return false;
				}
				if(modal_select_inItems.length > 1 && modal_select_outItems.length > 1) {
					ufma.showTip("指标调剂只能[1个调出多个调入] 或 [多个调出1个调入]。", null, "error");
					return false;
				}
				for(var ia = 0; ia < modal_select_outItems.length; ia++) {
					var tmpOutItem = modal_select_outItems[ia];
					for(var ib = 0; ib < modal_select_inItems.length; ib++) {
						var tmpInItem = modal_select_inItems[ib];
						if(tmpOutItem.bgItemId == tmpInItem.bgItemId) {
							ufma.showTip("调出指标和调入指标不能重复[" + tmpOutItem.bgItemCode + "]", null, "error");
							return false;
						}
						//添加校验,只有均无父指标或具有相同父指标的两条指标才可以调剂
						if(modal_select_outItems[ia].parentBalanceCur != -1 || modal_select_inItems[ib].parentBalanceCur != -1) {
							if(modal_select_outItems[ia].bgItemParentid != modal_select_inItems[ib].bgItemParentid) {
								ufma.showTip("只有均无父指标或具有相同父指标的指标才可以调剂!", null, "error");
								return false;
							}

						}
					}
        }
        // cbBgPlanId = $('#_bgPub_cbb_BgPlan_twoSidesAdjItem_modal_step2_morePnl').getObj().getValue();
				// cbBgPlanText = $('#_bgPub_cbb_BgPlan_twoSidesAdjItem_modal_step2_morePnl').getObj().getText();
        // var value = cbBgPlanId+','+cbBgPlanText;
        // updateSessionPlan('_bgPub_cbb_BgPlan_twoSidesAdjItem_modal_step2_morePnl', value);
        if(openType == 'edit'){ 
          $('#bgInput-fileCount-twoSidesAdjLower').val('')
        }
				doPaintTable_Modal_Sheet3();
				gotoModalSheet(modal_curSheetIndex);
				break;
			default:
				break;
		}
	});
	$("#btn-modal-save").on("click", function() {
		var modal_curSheetIndex = 4;
		doSaveBill(function() {
			gotoModalSheet(modal_curSheetIndex);
		});

	});

	$("#btn-modal-continue").on("click", function() {
		$("#btn-modal-close").trigger("click");
		$("#btn-add-twoSidesAdjItem").trigger("click");
	});
	/**
	 * 模态框 - 取消
	 */
	$("#btn-modal-close").on("click", function() {
		//bugCWYXM-4545--查看已审核的指标调剂单据，应不可以编辑--zsj--已审核单据点取消时不提示，直接关闭
		if($("#btn-modal-close").attr("sheet") == '3' && page.statusNavType != '3') {
			// var Sheet3Out = modal_table_sheet3_out.getTableData();
      // var Sheet3In = modal_table_sheet3_in.getTableData();
      var Sheet3Out = $('#table_inItems_selected').getObj().getData();  
      var Sheet3In = $('#table_outItems_selected').getObj().getData();   
			if(!$.equalsArray(cacheSheet3Out, Sheet3Out) || !$.equalsArray(cacheSheet3In, Sheet3In)) {
				ufma.confirm("有未保存的数据，是否确定离开页面?", function(rst) {
					if(rst) {
						modal_Obj.close();
						$('#_bgPub_cbb_BgPlan_bgMoreMsgPnl-twoSidesAdjItem').getObj().val(cbBgPlanId);
					}
				}, {
					'type': 'warning'
				});

				return false;
			} else {
				modal_Obj.close();
				$('#_bgPub_cbb_BgPlan_bgMoreMsgPnl-twoSidesAdjItem').getObj().val(cbBgPlanId);
			}
		} else {
			modal_Obj.close();
			$('#_bgPub_cbb_BgPlan_bgMoreMsgPnl-twoSidesAdjItem').getObj().val(cbBgPlanId);
		}

		if(refreshAfterCloseModal) {
			pnlFindRst.doFindBtnClick();
		}
	});

	/**
	 * 主界面 - 审核\销审 按钮
	 */
	$("#btn-check-twoSidesAdjItem").off("click").on("click", function() {
		var $selNav = $(".nav.nav-tabs").find("li.NAVSELECT");
		var statusNav = $selNav.find("a").attr("data-status");
		var rqObj_audit = new bgBillAuditOrUnAudit();
		rqObj_audit.agencyCode = bgItemManager.agencyCode;
		rqObj_audit.setYear = page.pfData.svSetYear;
		rqObj_audit.billType = bgItemManager.billType;
		rqObj_audit.bgPlanChrId = curBgPlanData.chrId;
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
			ufma.showTip("请先选择一条单据", null, "warning");
			return false;
		}
		ufma.confirm('您确定要审核选择的单据吗？', function(ac) {
			if(ac) {
				rqObj_audit.status = "3"; //guohx 增加审核参数  20171024
				rqObj_audit.checkDate = page.pfData.svSysDate;
				rqObj_audit.checkUser = page.pfData.svUserCode;
				rqObj_audit.checkUserName = page.pfData.svUserName;
				var url = _bgPub_requestUrlArray_subJs[12] + "?billType=" + bgItemManager.billType + "&agencyCode=" + bgItemManager.agencyCode;
				var callback = function(result) {
					ufma.showTip('审核成功！', function() {
						pnlFindRst.doFindBtnClick();
						$("#input-seleAll-twoSidesAdjItem").prop("checked", false);
						$("#input-seleAllUp").prop("checked", false);
					}, 'success');
				};
				ufma.post(url, rqObj_audit, callback);
			}
		}, {
			'type': 'warning'
		});
	});
	/**
	 * 主界面 - 销审 按钮
	 */
	$("#btn-un-check-twoSidesAdjItem").off("click").on("click", function() {
		var $selNav = $(".nav.nav-tabs").find("li.NAVSELECT");
		var statusNav = $selNav.find("a").attr("data-status");
		var rqObj_audit = new bgBillAuditOrUnAudit();
		rqObj_audit.agencyCode = bgItemManager.agencyCode;
		rqObj_audit.setYear = page.pfData.svSetYear;
		rqObj_audit.billType = bgItemManager.billType;
		rqObj_audit.bgPlanChrId = curBgPlanData.chrId;
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
			ufma.showTip("请先选择一条单据", null, "warning");
			return false;
		}
		ufma.confirm('您确定要销审选择的单据吗？', function(ac) {
			if(ac) {
				rqObj_audit.status = "1";
				var url = _bgPub_requestUrlArray_subJs[13] + "?billType=" + bgItemManager.billType + "&agencyCode=" + bgItemManager.agencyCode;
				var callback = function(result) {
					ufma.showTip('销审成功！', function() {
						pnlFindRst.doFindBtnClick();
						$("#input-seleAll-twoSidesAdjItem").prop("checked", false);
						$("#input-seleAllUp").prop("checked", false);
					}, 'success');
				};
				ufma.post(url, rqObj_audit, callback);
			}
		}, {
			'type': 'warning'
		});
	});
	/**
	 * 主界面  -  未审核、审核、全部 页签变动
	 */
	$(".nav.nav-tabs li").on("click", function(e) {
		var tmpStatus = $(this).find('a').attr("data-status");
		if(tmpStatus == "O") {
			$("#btn-check-twoSidesAdjItem").removeClass('hide');
			$("#btn-del-twoSidesAdjItem").removeClass('hide');
			$("#btn-un-check-twoSidesAdjItem").addClass('hide');
		} else if(tmpStatus == "A") {
			$("#btn-check-twoSidesAdjItem").addClass('hide');
			$("#btn-un-check-twoSidesAdjItem").removeClass('hide');
			$("#btn-check-twoSidesAdjItem").addClass('hide');
			$("#btn-del-twoSidesAdjItem").addClass('hide');
		} else {
			$("#btn-check-twoSidesAdjItem").addClass('hide');
			$("#btn-del-twoSidesAdjItem").addClass('hide');
			$("#btn-un-check-twoSidesAdjItem").addClass('hide');
		}
		$(".nav.nav-tabs li").removeClass("NAVSELECT");
		$(this).addClass("NAVSELECT");

		pnlFindRst.doFindBtnClick(); //调用查询按钮
		$("#input-seleAll-twoSidesAdjItem").prop("checked", false); //切换页签清空全选按钮  guohx 20171206
		$("#input-seleAllUp").prop("checked", false);
	});

	/**
	 * 主界面 - 打印
	 */
	$("#budgetItemTwoSidesAdjust-print").off("click").on("click", function() {
		$("." + tblPrintBtnClass).trigger("click");
	});

	/**
	 * 主界面 - 导出
	 */
	//$("#budgetItemTwoSidesAdjust-exp").off("click").on("click", function() {
	$("#export").off("click").on("click", function() { //CWYXM-9822 指标管理：指标调剂点击导出按钮，导出按钮没有反应--zsj
		$("." + tblPrintBtnClassExpXls).trigger("click");
	});

	/**
	 * 主界面 - 全选 checkbox变动
	 */
	$("#input-seleAll-twoSidesAdjItem").off("change").on("change", function(e) {
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
	 * 主界面 - 删除 按钮响应事件
	 */
	$("#btn-del-twoSidesAdjItem").off("click").on("click", function() {
		var billArr = [];

		var rows = $("#" + tblId).dataTable().fnGetNodes();
		for(var k = 0; k < rows.length; k++) {
			var row = rows[k];
			if($(row).find("td:eq(0):has(label)").length > 0) {
				if($(row).find("td:eq(0):has(label)").find("input[type='checkbox']").is(":checked") == true) {
					var billStatus = $("#" + tblId).DataTable().row(row).data().status;
					if(billStatus == '3') {
						//已审核的不能删除
						continue;
					}
					//此行进行删除
					var rowDt = tblObj.row(row).data();
					billArr.push(rowDt.billId);
				}
			}
		}

		if(billArr.length == 0) {
			ufma.showTip("请选择要删除的单据(已审核单据不能删除)", null, "warning");
			return false;
		}

		ufma.confirm("确认要删除所选单据吗?", function(rst) {
			if(!rst) {
				return false;
			}
			bgItemManager.deleteBill(billArr, curBgPlanData.chrId, function(rst) {
				ufma.showTip("删除成功", null, "success");
				pnlFindRst.doFindBtnClick();
				$("#input-seleAll-twoSidesAdjItem").prop("checked", false);
				$("#input-seleAllUp").prop("checked", false);
			}, function(msg) {
				ufma.showTip("删除失败: " + msg, null, "error");
			});
		}, {
			'type': 'warning'
		});
	});

	/**
	 * 模态框 - 附件按钮
	 */
	$("#btn-twoSidesAdjModal-aboutFiles").off("click").on("click", function() {
		var option = {
			"agencyCode": bgItemManager.agencyCode,
			"billId": modal_curBill.billId,
			"uploadURL": _bgPub_requestUrlArray_subJs[8] + "?agencyCode=" + bgItemManager.agencyCode + "&billId=" + modal_curBill.billId + "&setYear=" + page.pfData.svSetYear,
			"delURL": _bgPub_requestUrlArray_subJs[16] + "?agencyCode=" + bgItemManager.agencyCode + "&billId=" + modal_curBill.billId + "&setYear=" + page.pfData.svSetYear,
			"downloadURL": _bgPub_requestUrlArray_subJs[15] + "?agencyCode=" + bgItemManager.agencyCode + "&billId=" + modal_curBill.billId + "&setYear=" + page.pfData.svSetYear,
			"onClose": function(fileList) {
				//bug77471--zsj
				showTblData();
				fileLeng = fileList.length;
				attachNum = fileList.length < pageAttachNum ? pageAttachNum : fileList.length;
				$("#bgInput-fileCount-twoSidesAdjLower").val(attachNum + "");
				modal_billAttachment = cloneObj(fileList);
			}
		};
		//bugCWYXM-4284--已审核单据只能查看附件不可以删除已审核过的附件、且不能上传新的附件--zsj
		_bgPub_ImpAttachment(mainDivId, "调剂单[" + modal_curBill.billCode + "]附件导入", modal_billAttachment, option, modal_curBill.status);
	});
	//********************************************************[界面入口函数]*****************************************************
	var page = function() {
		return {
			init: function() {
				reslist = ufma.getPermission();
				ufma.isShow(reslist);
				ufma.parse();
				page.pfData = ufma.getCommonData();
				page.setYear = parseInt(page.pfData.svSetYear);
				bgItemManager = new _bgPub_itemManager();
				bgItemManager.billType = 4;
				bgItemManager_modal_out = new _bgPub_itemManager();
				bgItemManager_modal_out.billType = 1;
				bgItemManager_modal_in = new _bgPub_itemManager();
				bgItemManager_modal_in.billType = 1;
				//pnlFindRst = _PNL_MoreByBgPlan('bgMoreMsgPnl-twoSidesAdjItem', moreMsgSetting); //加载头部更多
				_bgPub_Bind_Cbb_AgencyList("cbb-agency-twoSidesAdjItem", { //绑定单位
					afterChange: function(treeNode) {
						//实在找不到原因，ufma-combox-popup默认不显示
						setTimeout(function() {
							$('.ufma-combox-popup').css({
								'display': 'none'
							});
						}, 100);
						bgItemManager.agencyCode = treeNode.id;
						bgItemManager_modal_out.agencyCode = treeNode.id;
						bgItemManager_modal_in.agencyCode = treeNode.id;
						moreMsgSetting.agencyCode = treeNode.id;
						//CWYXM-10166 指标编制、指标控制管理界面记忆预算方案--新增需求记忆预算方案--传给bgPub.js的数据--zsj
						moreMsgSetting.menuId = menuId;
						moreMsgSetting.acctCode = '*';
						moreMsgSetting.bgPlanCacheId = bgPlanCacheId;
						moreMsgSetting.openType = openType;
						//80827---20190630所有页面，单位或账套选择变化后，再打开其它页面时，自动显示为最近一次选择的单位或账套。--zsj
						//缓存单位
						var params = {
							selAgecncyCode: treeNode.id,
							selAgecncyName: treeNode.name
						}
						ufma.setSelectedVar(params);
						//CWYXM-12690--根据系统选项判断发文文号是否必填，若必填则将列名“发文文号”改完指标id--zsj
						var bgUrl = '/bg/sysdata/selectSysRgParaValue?rgCode=' + page.pfData.svRgCode + '&setYear=' + page.setYear + '&agencyCode=' + treeNode.id + '&chrCode=BG003';
						ufma.ajaxDef(bgUrl,'get' ,{}, function(result) {
							page.needSendDocNum = result.data;
							if(page.needSendDocNum == true) {
								page.sendCloName = "指标id";
							} else {
								page.sendCloName = "发文文号";
							}
            });
            moreMsgSetting.needSendDocNum = page.sendCloName;
            moreMsgSetting.needSendDocNum.budgetItemTwoSidesAdjust = true
            moreMsgSetting_modal_out.needSendDocNum = page.sendCloName;
            moreMsgSetting_modal_out.cbBgPlanMain = cbBgPlanIdMain;
            moreMsgSetting_modal_in.needSendDocNum = page.sendCloName;
						pnlFindRst = _PNL_MoreByBgPlan('bgMoreMsgPnl-twoSidesAdjItem', moreMsgSetting); //根据单位的变化重新加载头部更多
					}
				});

				//更多按钮点击事件,原来页面布局没有按规范写，实在不好修改，不要骂人
				function adjWindow() {
					$('.workspace').css({
						'min-height': '10px',
						'height': $(window).height() - 10
					});
					var boxHeight = $(window).height() - $('.workspace-top').outerHeight(true);
					var morePanelHeight = $('#bgMoreMsgPnl-twoSidesAdjItem').outerHeight(true);
					var btFixedHeight = $('#fixDiv-twoSidesAdjItem').outerHeight(true);
					var defHeight = $('#mainTableDiv-twoSidesAdjItem').outerHeight(true) - $('#mainTableDiv-twoSidesAdjItem').height();
					var offset = 48;
					if($('#_bgPub_btn_more_bgMoreMsgPnl-twoSidesAdjItem').text() == '更多') {
						offset = 48;
					}
					$('#mainTableDiv-twoSidesAdjItem').css({
						'overflow': 'auto',
						'height': boxHeight - morePanelHeight - defHeight - btFixedHeight - offset - 16 + 'px'
					});
					$('.dataTables_scrollBody').css({
						'height': ($('#mainTableDiv-twoSidesAdjItem').height() - offset - 16) + 'px'
					});
				}

				$(document).on('click', '#_bgPub_btn_more_bgMoreMsgPnl-twoSidesAdjItem', function(e) {
					adjWindow();
				});
				$('[data-toggle="tooltip"]').tooltip();
				$.fn.dataTable.ext.errMode = 'none';
			}
		}
	}();

	page.init();
});