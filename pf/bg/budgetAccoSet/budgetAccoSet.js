$(function () {
	//-------------------------------------- var parameter ---------------------------------------------
	var mainTableId = "bgAccoSet-data";
	var modalTableId_1 = "bgAccoSet-data-modal-1";
	var modalTableId_2 = "bgAccoSet-data-modal-2-1";
	var modalTableId_3 = "bgAccoSet-data-modal-2-2";

	var curPageIndex = 1;
	var color_Blue = '#108EE9';
	var color_White = '#FFFFFF';
	var color_Gray = '#D9D9D9';
	var selectedRow = null;
	var acctCode = "201701";
	var agencyCode = "001";
	var setYear = "";
	var curAgencyData = null;
	var curAcctData = null;
	var haveBindAcct = false;

	var bgCtrlPlanId = "";
	var bgCtrlPlanCode = "";
	var bgCtrlPlanName = "";
	var bgCtrlPlanItemNames = "";
	var ctrlPlanChrId = "";
	var mainTblObj = null;
	var mainTblObj1 = null;
	var mainTblObj2 = null;
	var addModal = null;
	var progressController = null;

	var requestUrlArray = [
		getURL(0) + "/bg/Plan/budgetAccoSet/getBgAccoList", //0  获得预算科目及方案列表
		getURL(0) + "/bg/Plan/budgetAccoSet/getMaAccoList", //1  获得科目列表
		getURL(0) + "/bg/Plan/budgetAccoSet/getSingleBgAcco", //2  获得某一条数据详细信息：1个控制方案的信息
		getURL(0) + "/bg/Plan/budgetAccoSet/saveBgAccoSet", //3  保存设置
		getURL(0) + "/bg/Plan/budgetAccoSet/delBgAccoSet", //4  删除预算科目
		getURL(0) + "/bg/Plan/ctrlPlan/getPlanList", //5  获得控制方案列表
		getURL(0) + "/bg/Plan/ctrlPlan/getPlan" //6获得一个控制方案的信息
	];

	var initMainTbl = function () {
    // 修改85平台问题--zsj
    var url = requestUrlArray[0];
    var argu = {
      "acctCode": acctCode,
      "agencyCode": agencyCode
    }
    ufma.ajaxDef(url,'GET',argu,function(result){
      initMainTbl_show(result.data.bgAccos);
    })
		// $.ajax({
		// 	url: requestUrlArray[0] + "?ajax=1",
		// 	data: {
		// 		"acctCode": acctCode,
		// 		"agencyCode": agencyCode
		// 	},
		// 	type: "GET",
		// 	async: false, //同步
		// 	dataType: 'json', //返回的数据格式：json/xml/html/script/jsonp/text
		// 	contentType: 'application/json; charset=utf-8',
		// 	success: function (result) {
		// 		initMainTbl_show(result.data.bgAccos);
		// 	}
		// });
		ufma.isShow(reslist);
	};

	var initMainTbl_show = function (pData) {

		var scrollY = $("div.container-fluid").outerHeight(true) - 150;

		if (!$.isNull(mainTblObj)) {
			mainTblObj.destroy();
			$("#" + mainTableId).empty();
		}

		mainTblObj = $('#' + mainTableId).DataTable({
			"data": pData,
			"bFilter": false, // 去掉搜索框
			"bLengthChange": true, // 去掉每页显示多少条数据
			"processing": false, // 显示正在加载中
			"bInfo": false, // 页脚信息
			"bSort": false, // 排序功能
			"bAutoWidth": true, // 表格自定义宽度，和swidth一起用
			"bProcessing": true,
			"bDestroy": true,
			"paging": false,
			"scrollY": scrollY + "px",
			columns: [{
					title: '  序号',
					data: "",
					width: "5%"
				},
				{
					title: "科目",
					data: "acco"
				},
				{
					title: "方向",
					data: "debitCredit",
					width: "8%"
				},
				{
					title: "控制方案",
					data: "planName",
					width: "17%"
				},
				{
					title: "控制要素",
					data: "bgItemNames",
					width: "35%"
				},
				{
					title: "操作",
					data: '',
					width: "15%"
				}
			],
			columnDefs: [{
					"targets": [0],
					"serchable": false,
					"orderable": false,
					"className": "rowNum",
					"render": function (data, type, rowdata, meta) {
            //CWYXM-20868 -- 基础资料-预算支出控制设置，设置完科目后前台没显示，具体见截图--zsj--兼容业务代码中请求方式为get或GET的情况
            if (!$.isNull(rowdata)) {
              return '<span class="table-Col-rowNum" >' + rowdata.id + '</span>';
            } else {
              return '';
            }
          }
				},
				{
					"targets": [2],
					"serchable": false,
					"orderable": false,
					"className": "coaAcc-subject"
				},
				{
					"targets": [-1],
					"serchable": false,
					"orderable": false,
					"className": "text-center nowrap btnGroup",
					"render": function (data, type, rowdata, meta) {
						var active = rowdata.isDeleted == 0 ? 'disabled' : '';
						var unactive = rowdata.isDeleted == 1 ? 'disabled' : '';
						return '<a class="btn btn-icon-only btn-delete btn-sm btn-permission" data-toggle="tooltip" ' + unactive + ' action= "unactive" ' +
							'rowid="' + data + '" title="删除">' +
							'<span class="glyphicon icon-trash delSpan"></span></a>' +
							'<a class="btn btn-icon-only btn-edit btn-sm btn-permission" data-toggle="tooltip" ' + unactive + ' action= "unactive" ' +
							'rowid="' + data + '" title="编辑">' +
							'<span class="glyphicon icon-edit edtSpan"></span></a>';
					}
				}
			],
			"dom": 'rt'
		});

		var $clostDiv = $("#" + mainTableId).closest("div");
		$($clostDiv).css("border-bottom", "0px black solid");

		//删除图片的点击
		$("#" + mainTableId + " tbody").find(".delSpan").off("click").on("click", function (e) {
			var $tr = $(this).closest("tr");
			var $rowData = $("#" + mainTableId).DataTable().row($tr).data();
			var accoCode = $rowData.acco.substring(0, $rowData.acco.indexOf(' '));
			var requestData = {
				"agencyCode": $rowData.agencyCode,
				"setYear": $rowData.setYear,
				"acctCode": $rowData.acctCode,
				"accoCode": accoCode,
				"ctrlPlanChrId": $rowData.planId,
				"ctrlPlanChrCode": $rowData.planCode
			};
			ufma.confirm('要删除本行记录吗?', function (action) {
				if (!action) {
					return;
				} else {
					ufma.get(
						requestUrlArray[4],
						requestData,
						function (result) {
							// 	//这里没有使用datatable.row.remove方法，因为remove后继续删除，出现多次调用情况
							// 	//暂时没有找到问题，使用了重新加载的笨法子。这样可能有卡顿和消耗。
							if (result.flag == "success") {
								ufma.showTip('删除成功！', function () {}, 'success'); //guohx 
								initMainTbl();
							}
						}
					);
				}
			}, {
				'type': 'warning'
			});
		});

		//编辑图片的点击
		$("#" + mainTableId + " tbody").find(".edtSpan").off("click").on("click", function (e) {
			var $tr = $(this).closest("tr");
			var $rowData = $("#" + mainTableId).DataTable().row($tr).data();
			ufma.get(
				requestUrlArray[6] + "?type=detail&ctrlPlanChrId=" + $rowData.planId + "&agencyCode=" + agencyCode, {},
				function (result) {
					var rowData = result.data;
					bgCtrlPlanId = rowData.chrId;
					bgCtrlPlanCode = rowData.chrCode;
					bgCtrlPlanName = rowData.chrName;
					bgCtrlPlanItemNames = rowData.bgItemNames;

					doLoadModal("edit");


					$("#budgetAccoSetLabel").html("编辑预算支出控制");
					// $("#budgetAccoSet-edt").modal('show');
				}
			);
		});
		ufma.isShow(reslist);
	};

	var initModalTable1 = function () {
		var scrollY = 200;

		ufma.get(requestUrlArray[5], {
			"type": "detail",
			"acctCode": acctCode,
			"agencyCode": agencyCode,
			"enabled": 1
		}, function (rst) {
			if (rst.flag != "success") {
				ufma.showTip(rst.msg, null, "error");
				return false;
			}

			var cols = [{
					title: '选择',
					data: "",
					width: "10%"
				},
				{
					title: '序号',
					data: "chrId",
					width: "10%"
				},
				{
					title: "控制方案",
					data: "chrName",
					width: "25%"
				},
				{
					title: "控制方案ID",
					data: "chrId",
					visible: false
				},
				{
					title: "控制要素",
					data: "bgItemNames"
				}
			];
			var colDef = [{
					"targets": [0],
					"serchable": false,
					"orderable": false,
					"className": "nowrap",
					"render": function (data, type, rowdata, meta) {
						if (rowdata.chrId == ctrlPlanChrId) {
							return '<label class="mt-checkbox mt-checkbox-single mt-checkbox-outline"> ' +
								'<input type="checkbox" class="checkboxes ipt" checked value="" data-id="' + rowdata.chrId + '"  name="mainRowCheck" />&nbsp; ' +
								'<span></span> ' +
								'</label>';
						} else {
							return '<label class="mt-checkbox mt-checkbox-single mt-checkbox-outline"> ' +
								'<input type="checkbox" class="checkboxes ipt"  value="" data-id="' + rowdata.chrId + '"  name="mainRowCheck" />&nbsp; ' +
								'<span></span> ' +
								'</label>';
						}

					}
				},
				{
					"targets": [2],
					"serchable": false,
					"orderable": false,
					"className": "coaAcc-subject"
				}
			];
			var dt = rst.data.plans;
			var options = {
				"data": dt,
				"columns": cols,
				"columnDefs": colDef,
				"bFilter": false, // 去掉搜索框
				"bLengthChange": true, // 去掉每页显示多少条数据
				"processing": true, // 显示正在加载中
				"bInfo": false, // 页脚信息
				"bPaginate": false,
				"bSort": false, // 排序功能
				"bAutoWidth": true, // 表格自定义宽度，和swidth一起用
				"bProcessing": true,
				"bDestroy": true,
				"scrollY": scrollY + "px",
				"dom": 'rt',
				"fnDrawCallback": function (setting, json) {
					var api = this.api();
					var startIndex = api.context[0]._iDisplayStart; //获取到本页始的条数
					api.column(1).nodes().each(function (cell, i) {
						cell.innerHTML = startIndex + i + 1;
					});
					$("#" + modalTableId_1 + " tbody input[type='checkbox']").on("click", function (e) {
						var $ele = $(e.target); //获得触发事件的元素（id名字）
						if ($ele.is(":checked") == true) {
							if (selectedRow != null) {
								$(selectedRow).find("input").prop("checked", false);
								selectedRow == null;
							}
							selectedRow = $ele.closest("tr");
							bgCtrlPlanId = $("#" + modalTableId_1).DataTable().row(selectedRow).data().chrId;
							bgCtrlPlanCode = $("#" + modalTableId_1).DataTable().row(selectedRow).data().chrCode;
							bgCtrlPlanName = $("#" + modalTableId_1).DataTable().row(selectedRow).data().chrName;
							bgCtrlPlanItemNames = $("#" + modalTableId_1).DataTable().row(selectedRow).data().bgItemNames;
						} else {
							selectedRow = null;
							bgCtrlPlanId = "";
							bgCtrlPlanCode = "";
							bgCtrlPlanName = "";
							bgCtrlPlanItemNames = "";
						}
					});
				}
			};
			if (!$.isNull(mainTblObj1)) {
				mainTblObj1.destroy();
				$("#" + modalTableId_1).empty();
				mainTblObj1 = null;
			}
			mainTblObj1 = $("#" + modalTableId_1).DataTable(options);
			var $clostDiv = $("#" + modalTableId_1).closest("div");
			$($clostDiv).css("border-bottom", "0px black solid");
		});
	};

	var initModalTable2 = function (url) {
		//ufma.isShow(reslist);
		var scrollY = 180;
		var sUrl = requestUrlArray[2] + "?agencyCode=-1";

		if (!$.isNull(mainTblObj2)) {
			mainTblObj2.destroy();
			$("#" + modalTableId_2).empty();
			mainTblObj2 = null;
		}

		if (!$.isNull(url)) {
			sUrl = url;
		}

		ufma.get(url, null,
			function (rst) {
				if (rst.flag == "success") {
					mainTblObj2 = $("#" + modalTableId_2).DataTable({
						"data": rst.data.bgAccoJDList,
						"bFilter": false, // 去掉搜索框
						"bLengthChange": true, // 去掉每页显示多少条数据
						"processing": false, // 显示正在加载中
						"bInfo": false, // 页脚信息
						"bSort": false, // 排序功能
						"bAutoWidth": true, // 表格自定义宽度，和swidth一起用
						"bProcessing": true,
						"bPaginate": false,
						"bDestroy": true,
						"scrollY": scrollY + "px",
						columns: [{
								title: '科目',
								data: "acco",
								width: "70%"
							},
							{
								title: '借方',
								data: "accoJ",
								width: "15%"
							},
							{
								title: '贷方',
								data: "accoD",
								width: "15%"
							}
						],
						columnDefs: [{
								"targets": [-1],
								"serchable": false,
								"orderable": false,
								"className": "text-center nowrap btnGroup",
								"render": function (data, type, rowdata, meta) {
									var checked = "";
									if (rowdata.accoD == "") {
										checked = '';
									} else {
										checked = 'checked="checked"';
									}
									return '<label class="mt-checkbox mt-checkbox-single mt-checkbox-outline"> ' +
										'<input type="checkbox" class="checkboxes" value="D" data-level="' +
										rowdata.levelNum + '" ' + checked + ' name="mainRowCheck" /> &nbsp; ' +
										'<span></span> ' +
										'</label>';
								}
							},
							{
								"targets": [-2],
								"serchable": false,
								"orderable": false,
								"className": "text-center nowrap btnGroup",
								"render": function (data, type, rowdata, meta) {
									var checked = "";
									if (rowdata.accoJ == "") {
										checked = '';
									} else {
										checked = 'checked="checked"';
									}
									return '<label class="mt-checkbox mt-checkbox-single mt-checkbox-outline"> ' +
										'<input type="checkbox" class="checkboxes" value="J" data-level="' +
										rowdata.levelNum + '" ' + checked + ' name="mainRowCheck" /> &nbsp; ' +
										'<span></span> ' +
										'</label>';
								}
							}
						],
						"dom": 'rt',
						"fnDrawCallback": function (setting, json) {
							$("#" + modalTableId_2 + " tbody input[type='checkbox']").on("click", function (e) {
								var tbl = $("#" + modalTableId_2).DataTable();
								var $ele = e.target;
								//var $tr = $ele.closest("tr");
								var $tr = $($ele).closest("tr"); //20170830 guohx 修改兼容ie11
								var rowData = tbl.row($tr).data();
								if ($ele.value == "J") { //借方
									if ($($ele).is(":checked") == true) {
										rowData.accoJ = rowData.acco;
									} else {
										rowData.accoJ = "";
									}
								} else { //贷方
									if ($($ele).is(":checked") == true) {
										rowData.accoD = rowData.acco;
									} else {
										rowData.accoD = "";
									}
								}
							});
							// ufma.isShow(reslist);
						}

						//遍历表格里面由于此值相同的 勾选
					});

					var $clostDiv = $("#" + modalTableId_2).closest("div");
					$($clostDiv).css("border-bottom", "0px black solid");
					ctrlPlanChrId = rst.data.ctrlPlanChrId;
				}
			}
		)
	};

	var reLoadModalTable2 = function () {
		$("#bgAccoSet-modal-ctrlPlanName").html(bgCtrlPlanName);
		$("#bgAccoSet-modal-ctrlPlanEleName").html(bgCtrlPlanItemNames);

		initModalTable2(requestUrlArray[2] + "?agencyCode=" + agencyCode + "&acctCode=" + acctCode + "&ctrlPlanChrId=" + bgCtrlPlanId)
	};

	var doSaveModalTable2 = function () {
		var modalTable2 = $("#" + modalTableId_2).DataTable();
		var requestData = {};
		requestData.agencyCode = agencyCode;
		requestData.acctCode = acctCode;
		requestData.bgCtrlPlanId = bgCtrlPlanId;
		requestData.bgCtrlPlanCode = bgCtrlPlanCode;
		requestData.bgCtrlPlanName = bgCtrlPlanName;
		requestData.accos = [];
		var flag = false;
		var j = 0;
		for (var i = 0; i < modalTable2.data().length; i++) {
			if (modalTable2.data()[i].accoD || modalTable2.data()[i].accoJ) {
				requestData.accos[j] = modalTable2.data()[i];
				j = j + 1;
				flag = true
			}
		}
		if (flag) {
			ufma.post(requestUrlArray[3], requestData, function (result) {
				if (result.flag == "success") {
					curPageIndex = 3;
					gotoModalPage();
					ufma.showTip('保存成功！', function () {}, 'success'); //guohx 
					initMainTbl();

				}
			});
		} else {
			ufma.showTip('请选择数据！', function () {}, 'warning')
		}


	}

	var modalTitle_choise1 = function () {
		progressController.gotoStep(1);
	};

	var modalTitle_choise2 = function () {
		progressController.gotoStep(2);
	};

	var modalTitle_choise3 = function () {
		progressController.gotoStep(3);
	};

	var gotoModalPage = function () {
		if (curPageIndex == 1) {
			//第一页
			$("#bgAccoSet-tab-content-modal-1").show();
			$("#bgAccoSet-tab-content-modal-2").hide();
			$("#bgAccoSet-tab-content-modal-3").hide();
			$("#bgAccoSet-edt-button3").show();
			//$("#bgAccoSet-edt-button1").addClass("focus");
			$("#bgAccoSet-edt-button1").html("下一步");
			$("#bgAccoSet-edt-button2").hide();
			modalTitle_choise1();
		} else if (curPageIndex == 2) {
			$("#bgAccoSet-tab-content-modal-1").hide();
			$("#bgAccoSet-tab-content-modal-2").show();
			$("#bgAccoSet-tab-content-modal-3").hide();
			$("#bgAccoSet-edt-button3").show();
			//	$("#bgAccoSet-edt-button1").removeClass("focus");
			$("#bgAccoSet-edt-button1").html("上一步");
			$("#bgAccoSet-edt-button2").show();
			$("#bgAccoSet-edt-button2").html("保存");
			$("#bgAccoSet-edt-button2").removeAttr("data-dismiss");
			modalTitle_choise2();
		} else if (curPageIndex == 3) {
			$("#bgAccoSet-tab-content-modal-1").hide();
			$("#bgAccoSet-tab-content-modal-2").hide();
			$("#bgAccoSet-tab-content-modal-3").show();
			$("#bgAccoSet-edt-button3").hide();
			//	$("#bgAccoSet-edt-button1").removeClass("focus");
			$("#bgAccoSet-edt-button1").html("继续设置");
			$("#bgAccoSet-edt-button2").html("完成");
			$("#bgAccoSet-edt-button2").attr("data-dismiss", "modal"); //增加关闭事件
			modalTitle_choise3();
		}
	};

	var doLoadModal = function (type) {
		//1, 画 - 加载头部的进度条
		progressController = _bgPub_Progress1("progress-bgaccoset", 650, {
			count: 3,
			labels: ["选择控制方案", "模板设置", "完成"]
		});

		addModal = ufma.showModal("budgetAccoSet-edt", 700, null);

		if ($.isNull(type) || type == "new") {
			//在打模态框时，获得控制方案列表，不在模态框中刷新，可以加快速度。
			curPageIndex = 1;
			initModalTable1();
			$("#bgAccoSet-edt-button1").show();
			gotoModalPage();
		} else {
			reLoadModalTable2();
			curPageIndex = 2;
			gotoModalPage();
			$("#bgAccoSet-edt-button1").hide();
		}
		$("#budgetAccoSetLabel").html("新增预算支出控制");
		// ufma.showModal("budgetAccoSet-edt", 1090, 628, null);
	};
	//------------------------------ bindingAction ---------------------------------------------------------
	$(document).on("click", "#btn-add", function (e) {
		ctrlPlanChrId = "";
		doLoadModal();
	});

	$(document).on("click", "#bgAccoSet-edt-button1", function (e) {
		if (curPageIndex == 1) { //下一步
			var flag = false
			for (var i = 0; i < $('.ipt').length; i++) {
				if ($('.ipt')[i].checked) {
					flag = true
				}
			}
			if (!flag) {
				ufma.showTip("请选择一条控制方案",function(){},'warning');
			} else {
				reLoadModalTable2();
				curPageIndex = 2;
				gotoModalPage();
			}
		} else if (curPageIndex == 2) { //上一步
			curPageIndex = 1;
			gotoModalPage();
			initModalTable1();
		} else if (curPageIndex == 3) { //继续设置
			curPageIndex = 1;
			//可能需要刷新一下数据
			gotoModalPage();
		}
	});


	$(document).on("click", "#bgAccoSet-edt-button2", function (e) {
		if (curPageIndex == 1) { //取消
			curPageIndex = 1;
			addModal.close();
		} else if (curPageIndex == 2) { //保存
			//保存
			doSaveModalTable2();

		} else if (curPageIndex == 3) { //完成
			curPageIndex = 1;
			addModal.close();
		}
	});

	$(document).on("click", "#bgAccoSet-edt-button3", function (e) {
		addModal.close();
	});

	//选择科目
	$(document).off("click", "#btn-choiseAcco").on("click", "#btn-choiseAcco", function (e) {
		var modalView = ufma.selectBaseTree({
			url: requestUrlArray[1] + "?acctCode=" + acctCode + "&agencyCode=" + agencyCode + "&setYear=" + page.setYear,
			baseType: "acco",
			title: "选择科目",
			bSearch: false,
			buttons: {
				'确认': {
					class: 'btn btn-sm btn-primary  btn-save',
					action: function (data) {
						var $closeBtn = $('<div class="u-msg-close"> <span aria-hidden="true">×</span></div>');
						if (data.length > 0) {
							var $table = $("#" + modalTableId_2).DataTable();
							for (var i = 0; i < data.length; i++) {
								//if (data[i].level < 1 || data[i].isParent == true) { continue; }
								if (data[i].isLeaf != 1) {
									continue;
								} //CWYXM-5902--修改 为只有 叶子节点才可以使用--zsj
								var accoCode = data[i].id;
								var accoName = data[i].name.substring(data[i].name.indexOf(']') + 1);
								var accoPid = data[i].pId;

								var curDt = $table.rows().data();
								var bCanAdd = true;
								for (var k = 0; k < curDt.length; k++) {
									if (curDt[k].acco == accoCode + " " + accoName) {
										bCanAdd = false;
										break;
									}
								}
								if (bCanAdd) {
									$table.row.add({
										"acco": accoCode + " " + accoName,
										"accoJ": accoCode + " " + accoName,
										"accoD": accoCode + " " + accoName,
										"debitCredit": "0",
										"planId": bgCtrlPlanId,
										"planCode": bgCtrlPlanCode,
										"planName": bgCtrlPlanName,
										"isNew": "Y"
									});
								}
							}
							$table.rows().draw();
						}
						closeModalView();
					}
				},
				"取消": {
					class: 'btn btn-sm btn-default btn-cancel',
					action: function (data) {
						closeModalView();
					}
				}

			}
		});

		var closeModalView = function () {
			modalView.close();
		};
	});

	//------------------------------ page begin ------------------------------------------------------------
	var page = function () {
		return {
			// 1， 初始化表格 initDataTable
			initDataTable: function () {
				initMainTbl();
			},
			init: function () {
				page.pfData = ufma.getCommonData();
				page.setYear = page.pfData.svSetYear;
				reslist = ufma.getPermission();
				/*  reslist = [
						  {},{},{},{},{}
				  ];*/
				ufma.isShow(reslist);
				ufma.showloading("正在加载数据, 请稍后...");
				ufma.parse();
				var bIsLoading = true;
				_bgPub_Bind_Cbb_AgencyList("cbb_Agency", {
					afterChange: function (treeNode) {
						curAgencyData = treeNode;
						agencyCode = curAgencyData.id;
						//80827 【财务云8.0 鄂尔多斯 】20190630所有页面，单位或账套选择变化后，再打开其它页面时，自动显示为最近一次选择的单位或账套。--zsj
						//缓存单位
						var params = {
							selAgecncyCode: curAgencyData.id,
							selAgecncyName: curAgencyData.name
						}
						ufma.setSelectedVar(params);
						// 单位切换后，切换账套
						/*						$("#cbb_Acct").empty();
												$("#cbb_Acct").removeAttr("aria-new");
												$("#cbb_Acct").removeClass();*/
						var tmpacct = _bgPub_Bind_Cbb_AcctList("cbb_Acct", {
							afterChange: function (data) {
								if ($.isNull(data) || data.length == 0) {
									ufma.hideloading();
									return;
								}
								curAcctData = data;
								acctCode = curAcctData.code;
								initMainTbl();
								bIsLoading = false;
                                ufma.hideloading();	
                                //CWYXM-17472 oracle12c 基础资料-预算支出控制设置打开没带出账套,必须得选择一下--zsj--更新已缓存的单位账套				
                                //缓存单位账套
                                var params = {
                                    selAgecncyCode: curAgencyData.id,
                                    selAgecncyName: curAgencyData.name,
                                    selAcctCode: curAcctData.code,
                                    selAcctName: curAcctData.name
                                }
                                ufma.setSelectedVar(params);
							},
							stopLoad: function () {
								bIsLoading = false;
								ufma.hideloading();
							}
						}, agencyCode);
						if ($.isNull(tmpacct)) {
							if ($.fn.DataTable.isDataTable('#' + mainTableId)) {
								$("#" + mainTableId).DataTable().clear().draw();
							}
							bIsLoading = false;
							ufma.hideloading();
						}
					}
				});
				//var icount = 0;
				//	var tmpInte = setInterval(function () {
				// if (!bIsLoading) {
				// 	clearInterval(tmpInte);
				// }
				//if (icount === 20) {
				if (bIsLoading) {
					bIsLoading = false;
					ufma.hideloading();
					//clearInterval(tmpInte);
				}
				//	}
				//	icount++;
				//	}, 500);
				ufma.parse();
				ufma.parseScroll();
			}
		}
	}();

	page.init();
});