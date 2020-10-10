$(function () {
	window._close = function (action) {
		if (window.closeOwner) {
			var data = {
				action: action
			};
			window.closeOwner(data);
		}
	}
	var page = function () {
		var pageData = {};
		var oTableCarrry, oTableDep, oTablePro, oTableExp;
		var treeObj;
		var checkbox = true;
		var leafRequire = false;
		return {
			//动态获取表格列
			getTableColumns: function () {
				var url = '/bg/rule/getAllPlanItems?agencyCode=' + pageData.agencyCode + '&rgCode=' + pageData.rgCode + '&setYear=' + pageData.setYear;
				ufma.get(url, {}, function (result) {
					page.tableColumns = result.data;
					page.initCarryTable();
				});
			},
			//获取权限类别
			initSetTypeTree: function () {
        // CWYXM-18144--ZJGA：指标授权时可以授权金额，指标使用时按授权金额对可使用余额进行控制--zsj--查询系统选项
        var url = '';
        var argu = {};
        var type = '';
        if (pageData.authCurType == false) {
          url = '/ma/pub/enumerate/RULE_TYPE';
          type = 'get';
          argu = {}
        } else if (pageData.authCurType == true){
          url = '/bg/public/bg/bgapi/getEnumRuleType';
          argu = {
            authCur: pageData.authCurType
          }
          type = 'post';
        }
				ufma.ajaxDef(url, type, argu, function (result) {
					var $divHtml = $('.setTypeClss');
					$divHtml.html('');
					var checkFlag = false;
					for (var i = 0; i < result.data.length; i++) {
						$('<label class="mt-radio" style="margin-left:5px;"><input type="radio" class="typeCheck" enuCode="' + result.data[i].ENU_CODE + '"  enuName="' + result.data[i].ENU_NAME + '" name="configType" id="show_' + result.data[i].ENU_CODE + '" checked="true"/>&nbsp;' +
							'<span></span>' + result.data[i].ENU_NAME + '</label>&nbsp;').appendTo($divHtml);
					}
					if (pageData.treeTypeCode && !$.isNull(pageData.treeTypeCode) && pageData.pageAction == 'edit') {
						$('.setTypeClss').find('.typeCheck').each(function () {
							var enuCode = $(this).attr('enuCode');
							var enuName = $(this).attr('enuName');
							var enuId = $(this).attr('id');
							if (pageData.treeTypeCode == enuCode) {
								$(this).closest('div').find('.typeCheck').removeClass('ckeckTrue').removeAttr('checked');
								$(this).prop('checked', 'checked').addClass('ckeckTrue');
								$('#cbBgPlan').html('请选择' + enuName);
								page.typeSet = enuCode;
							}
						});
						$('.setTypeClss').find('.typeCheck').attr('disabled', true);
					} else {
						page.typeSet = result.data[0].ENU_CODE;
						$('#show_' + result.data[0].ENU_CODE).closest('div').find('.typeCheck').removeAttr('checked').removeClass('ckeckTrue');
						$('#show_' + result.data[0].ENU_CODE).prop('checked', 'checked').addClass('ckeckTrue');
						$('#cbBgPlan').html('请选择' + result.data[0].ENU_NAME);
            page.getNewTree(page.typeSet); //新增界面获取权限树数据
            $('.setTypeClss').removeAttr('disabled');
            //ZJGA820-1806 --指标权限管理的点击新增页面，只有一个“指标”页签。而返回列表点击权限名称进入详情界面却有“指标”“部门”“项目”三个页签，希望可以统一成一个页签，或者三个页签。--zsj
						if (page.typeSet == 'GKBM') {
							$('#departTree,#projectTree,#expecoTree').addClass('hide');
							$('#projectArea,#departArea,#expecoArea').addClass('hide');
							$('#billTable').addClass('active').siblings().removeClass('active');
							$('#billArea').removeClass('hide');
						} else if (page.typeSet == 'YKBM') {
							$('#expecoTree').addClass('hide');
							$('#departTree,#projectTree').removeClass('hide');
							$('#projectArea,#departArea,#expecoArea').addClass('hide');
							$('#billTable').addClass('active').siblings().removeClass('active');
							$('#billArea').removeClass('hide');
						} else if (page.typeSet == 'AR_BILL_TYPE') {
							$('#expecoTree').removeClass('hide');
							$('#departTree,#projectTree').addClass('hide');
							$('#projectArea,#departArea,#expecoArea').addClass('hide');
							$('#billTable').addClass('active').siblings().removeClass('active');
							$('#billArea').removeClass('hide');
						}
					}
				});
			},
			getNewTree: function (typeSet) {
				var configType = typeSet;
				if (configType == 'AR_BILL_TYPE') {
					var sul = '/bg/rule/selectBillTypeList?agencyCode=' + pageData.agencyCode + '&rgCode=' + pageData.rgCode + '&setYear=' + pageData.setYear;
					ufma.get(sul, {}, function (result) {
						var treeId = "permissionTree";
						page.treeType = '2'; //报销单据类型树
						page.accoTree(result.data, treeId, page.treeType);
					});
				} else {
          //CWYXM-18102 --指标权限设置需要支持按人员库中的部门人员设置指标权限--zsj
          if (pageData.treeDepType == true) {
            if (configType == 'GKBM') {
              var parm = {
                "rgCode": pageData.rgCode,
                "setYear": pageData.setYear,
                "agencyCode": pageData.agencyCode,
                "orgCode" : ""
              }
              // 系统选项启用人员库时使用如下接口
              var bgUrl = '/ma/api/selectPrsOrgTree?';
              ufma.ajaxDef(bgUrl,'post',parm,function(result){
                var treeId = "permissionTree";
                page.treeType = '2'; //非单据类型树
                page.accoTree(result.data, treeId, page.treeType);
              })
            } else if (configType == 'YKBM'){
              var parm = {
                "rgCode": pageData.rgCode,
                "setYear": pageData.setYear,
                "agencyCode": pageData.agencyCode,
                'empStat': '0'
              }
              // 系统选项启用人员库时使用如下接口
              var bgUrl = '/ma/api/selectPrsOrgEmpTree?';
              ufma.ajaxDef(bgUrl,'post',parm,function(result){
                var treeId = "permissionTree";
                page.treeType = '1'; //非单据类型树
                page.accoTree(result.data, treeId, page.treeType);
              })
            }
          } else {
             // 系统选项不启用人员库时使用如下接口
            var url = '/bg/rule/newRuleSet?agencyCode=' + pageData.agencyCode + '&rgCode=' + pageData.rgCode + '&setYear=' + pageData.setYear + '&configType=' + configType;
            ufma.ajaxDef(url,'post', {}, function (result) {
              var treeId = "permissionTree";
              page.treeType = '1'; //非单据类型树
              page.accoTree(result.data, treeId, page.treeType);
            });
          }
				}
			},

			//左侧权限树
			accoTree: function (result, assTreeId, treeType) {
				var treeRData = result;
				var idFiled = '';
				var pidFiled = '';
				var nameFiled = '';
				if (treeType == '1') {
					idFiled = 'id';
					pidFiled = 'pId';
					nameFiled = 'codeName';
				} else if (treeType == '2') {
					idFiled = 'code';
					pidFiled = '';
					nameFiled = 'name';
				}
				var treeSetting = {
					view: {
						showLine: false,
						showIcon: false
					},
					check: {
						enable: true,
						chkStyle: "checkbox"
					},

					data: {
						simpleData: {
							enable: true,
							idKey: idFiled,
							pIdKey: pidFiled,
							rootPId: 0
						},

						key: {
							name: nameFiled,
						},

						keep: {
							leaf: true
						}
					},
					callback: {
						onCheck: function (event, treeId, treeNode) {
							var myTree = $.fn.zTree.getZTreeObj(treeId);
							var zNodes = myTree.getNodes(); //获取所有父节点--zsj
							var allNodes = myTree.transformToArray(zNodes); //获取所有节点--zsj
							if (myTree.getCheckedNodes(true).length == allNodes.length) { //全选操作应该判断已勾选数据与所有数据长度的比较--zsj
								$(".uf-selectAll").find("input[name='isAll']").prop("checked", true)
							} else {
								$(".uf-selectAll").find("input[name='isAll']").prop("checked", false)
							}
							var parentTId = treeNode.parentTId;
							var tId = treeNode.tId;
							if ($('#' + tId).find('span').hasClass('checkbox_false_full_focus')) {
								if ($('#' + tId).find('span').hasClass('treedefault')) {
									$('#' + tId).find('.treedefault').html('');
									$('#' + tId).find('.treedefault').removeClass('treedefault');
									$('#' + tId).find('a').removeClass('curSelectedNode');
								}
							}
						},
						onClick: function (event, treeId, treeNode) {
							event.stopPropagation();
							var parentTId = treeNode.parentTId;
							var tId = treeNode.tId;
							if ($('#' + tId).find('a').hasClass('curSelectedNode')) {
								$('#' + tId).siblings().find('.curSelectedNode').removeClass('curSelectedNode')
								$('#' + parentTId).siblings().find('.curSelectedNode').removeClass('curSelectedNode');
							}
						}
					}
				};
				if (!$.isNull(treeObj)) {
					treeObj.destroy();
				}
				treeObj = $.fn.zTree.init($('#' + assTreeId), treeSetting, treeRData);
				//ZJGA820-1467 指标权限管理将左侧选人授权的列表默认不展开--zsj
				treeObj.expandAll(false);
				ufma.hideloading();
				var timeId = setTimeout(function () {
					page.setSelectedAcco(result, assTreeId, treeType);
					clearTimeout(timeId);
				}, 300);
				//全选事件
				$(document).on("click", ".uf-selectAll", function () {
					var flag = false;
					if (treeObj) {
						if ($(".uf-selectAll").find("input[name='isAll']").prop("checked")) {
							treeObj.checkAllNodes(true);
							flag = true;
						} else {
							treeObj.checkAllNodes(false);
							flag = false;
						}
					}
					setTimeout(function () {
						var myTree = $.fn.zTree.getZTreeObj(assTreeId);
						var zNodes = myTree.getNodes(); //获取所有父节点--zsj
						var allNodes = myTree.transformToArray(zNodes); //获取所有节点--zsj
						if (myTree.getCheckedNodes(false).length == allNodes.length) {
							$('#' + assTreeId + ' li').find('.checkbox_false_full').each(function () {
								if ($(this).parent().find('span').hasClass('treedefault') && !$(this).parent().find('span').hasClass('checkbox_true_full')) {
									$(this).parent().find('.treedefault').html('');
									$(this).parent().find('.treedefault').removeClass('treedefault');
									$(this).parent().find('a').removeClass('curSelectedNode');
								}
							});
						}
					}, 50)
				});
			},
			//显示已勾选数据
			setSelectedAcco: function (result, assTreeId, treeType) {
				if (!$.isNull(result) && result.length == 0) {
					return false;
				}
				var selectedHtml = "";
				var zTreeObj = $.fn.zTree.getZTreeObj(assTreeId);
				if (!zTreeObj) {
					return false;
				}
				for (var i = 0; i < result.length; i++) {
					if (result[i].flag == '1') {
						var nodes = [];
						if (treeType == '1') {
							nodes = treeObj.getNodesByParam("id", result[i].id, null); //修改当父节点 code与子节点code 一致时 选中错误的问题
						} else if (treeType == '2') {
							nodes = treeObj.getNodesByParam("code", result[i].code, null);
						}
						if (nodes.length > 0) {
							zTreeObj.checkNode(nodes[0], true, true);
							selectedHtml += '<label class="rpt-check mt-checkbox mt-checkbox-outline"><input name="selectedNode" type="checkbox" code="' + nodes[0].code + '" accaCode="' + nodes[0].code + '"/>' + nodes[0].codeName + '<span></span></label>';
						}
					}
				}
				$(".have-selected .select-content").append(selectedHtml);
			},
			//暂存已选中科目的code
			removeRepetition: function (code) {
				if (page.repetition) {
					if (page.repetition.indexOf(code) < 0) {
						page.repetition.push(code);
					}
				} else {
					page.repetition = [];
					page.repetition.push(code);
				}
			},

			//获取权限详细信息
			getPremissionTree: function () {
				var setType = "";
				var url = '/bg/rule/getRuleDetail?agencyCode=' + pageData.agencyCode + '&rgCode=' + pageData.rgCode + '&setYear=' + pageData.setYear;
				var argu = {
					"ruleId": pageData.ruleId, //权限名称id
          "setType": setType, //表示指标页签，部门页签用DEPARTMENT，项目页签用PROJECT,指标BGITEM
          "bgRuleDeportFrom": pageData.treeDepType
				}
				ufma.post(url, argu, function (result) {
					var treeData = result.data.deptList;
					var bgItemList = result.data.bgItemList;
					var departmentList = result.data.departmentList;
					var projectList = result.data.projectList;
					var expecoList = result.data.expecoList;
					pageData.treeTypeCode = result.data.configType; //用款部门传YKBM，归口部门传GKBM
					page.initSetTypeTree();
					var treeId = "permissionTree";
					if (pageData.treeTypeCode == 'AR_BILL_TYPE') {
						page.treeType = '2';
					} else {
						page.treeType = '1';
					}
					page.typeSet = result.data.configType;
					page.accoTree(treeData, treeId, page.treeType);
					if (pageData.treeTypeCode == 'GKBM') {
						page.allTableData = bgItemList;
						$('#departTree,#projectTree,#expecoTree').addClass('hide');
					} else if (pageData.treeTypeCode == 'YKBM') {
						page.allTableDataYK = bgItemList;
						$('#expecoTree').addClass('hide');
						$('#departTree,#projectTree').removeClass('hide');
					} else if (pageData.treeTypeCode == 'AR_BILL_TYPE') {
						page.allTableDataDJ = bgItemList;
						$('#departTree,#projectTree').addClass('hide');
						$('#expecoTree').removeClass('hide');
					}
					var billArr = [];
					for (var i = 0; i < bgItemList.length; i++) {
						var bill = {};
						bill.setId = bgItemList[i].setId;
						bill.setCode = bgItemList[i].setCode;
						bill.isShow = bgItemList[i].isShow;
						billArr.push(bill);
					}
					localStorage.removeItem("billSaveData");
					localStorage.setItem("billSaveData", JSON.stringify(billArr));
					//部门表格数据
					page.depData = departmentList;
					var depArr = [];
					for (var i = 0; i < departmentList.length; i++) {
						var bill = {};
						bill.setId = departmentList[i].setId;
						bill.setCode = departmentList[i].setCode;
						bill.isShow = departmentList[i].isShow;
						depArr.push(bill);
					}
					localStorage.removeItem("depSaveData");
					localStorage.setItem("depSaveData", JSON.stringify(depArr));
					//项目表格数据
					page.proData = projectList;
					var proArr = [];
					for (var i = 0; i < projectList.length; i++) {
						var bill = {};
						bill.setId = projectList[i].setId;
						bill.setCode = projectList[i].setCode;
						bill.isShow = projectList[i].isShow;
						proArr.push(bill);
					}
					localStorage.removeItem("proSaveData");
					localStorage.setItem("proSaveData", JSON.stringify(proArr));
					//部门经济分类表格数据
					page.expData = expecoList;
					var expArr = [];
					for (var i = 0; i < expecoList.length; i++) {
						var bill = {};
						bill.setId = expecoList[i].setId;
						bill.setCode = expecoList[i].setCode;
						bill.isShow = expecoList[i].isShow;
						expArr.push(bill);
					}
					localStorage.removeItem("expSaveData");
					localStorage.setItem("expSaveData", JSON.stringify(expArr));
					page.showTblData();
				});
			},
			//转换为驼峰
			shortLineToTF: function (str) {
				var arr = str.split("_");
				for (var i = 0; i < arr.length; i++) {
					arr[i] = arr[i].toLowerCase()
				}
				for (var i = 1; i < arr.length; i++) {
					arr[i] = arr[i].toLowerCase()
					arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].substring(1);
				}
				return arr.join("");
			},
			//初始化表格
			initCarryTable: function () {
				if (oTableCarrry) {
					oTableCarrry.fnDestroy();
					$('#carryOver').html('');
				}
				var tblId = 'carryOver';
				var columns = [{
					data: 'opt',
					title: '操作',
					className: 'nowrap optBill tc',
					width: 40,
					render: function (data, type, rowdata, meta) {
						return '<a setId="' + rowdata.setId + '" dataIndex="' + meta.row + '" class="btn btn-icon-only btn-sm  icon-trash f16 btnBillDelete" data-toggle="tooltip" title="删除">';
					}
				}, {
					data: "isShow",
					title: "查看金额",
					className: "tc nowrap",
					// width: 80,
					render: function (data, type, rowdata, meta) {
						if (rowdata.isShow == '1') {
							return '是';
						} else if (rowdata.isShow == '0') {
							return '否';
						}

					}
				}, {
					data: "setCode",
					title: "指标编码",
					className: "nowrap",
					// width: 100,

        },
        // CWYXM-18408--指标年结涉及采购合同报销模块占用的指标结转完善--zsj
         {
					data: "bgTypeName",
					title: "指标类型",
					className: "nowrap",
					// width: 100,
				}, {
					data: "bgItemSummary",
					title: '摘要',
					className: "nowrap BGThirtyLen",
					// width: 120,
					"render": function (data) {
						if (!$.isNull(data)) {
							return '<code title="' + data + '">' + data + '</code>';
						} else {
							return '';
						}
					}
				}];
				if (!$.isNull(page.tableColumns)) {
					for (var i = 0; i < page.tableColumns.length; i++) {
						var item = page.tableColumns[i];
						columns.push({
							data: page.shortLineToTF(item.bgItemCode),
							title: item.eleName,
							className: 'nowrap isprint BGThirtyLen',
							// width: 200,
							"render": function (data) {
								if (!$.isNull(data)) {
									return '<code title="' + data + '">' + data + '</code>';
								} else {
									return '';
								}
							}
						});
					}
				}
				oTableCarrry = $("#" + tblId).dataTable({
					"language": {
						"url": bootPath + "agla-trd/datatables/datatable.default.js"
					},
					"autoWidth": false,
					"bDestory": true,
					"processing": true, //显示正在加载中
					"serverSide": false,
					"ordering": false,
					"scrollY": 360,
					columns: columns,
					"columnDefs": [],
					paging: false,
					//填充表格数据
					data: [],
					"dom": "rt",
					initComplete: function (settings, json) {
						ufma.isShow(reslist);
						if ((page.typeSet == 'GKBM' && page.allTableData && page.allTableData.length == 0) || (page.typeSet == 'YKBM' && page.allTableDataYK && page.allTableDataYK.length == 0) || (page.typeSet == 'AR_BILL_TYPE' && page.allTableDataDJ && page.allTableDataDJ.length == 0)) {
							$('.uf-rpt-table.ufma-table.dataTable tr:last-child td').css({
								"border-bottom": "1px solid transparent"
							});
						} else {
							$('.uf-rpt-table.ufma-table.dataTable tr:last-child td').css({
								"border-bottom": "1px solid #D9D9D9"
							});
						}
					},
					drawCallback: function (settings) {
						$('#carryOver').find("td.dataTables_empty").text("")
							.append('<img src="' + bootPath + 'images/noData.png"/><br/><i>目前还没有你要查询的数据</i>');
						ufma.isShow(reslist);
						ufma.setBarPos($(window));
						var wrapperWidth = $('#carryOver_wrapper').width();
						var tableWidth = $('#carryOver').width();
						if (tableWidth > wrapperWidth) {
							$('#carryOver').closest('.dataTables_wrapper').ufScrollBar({
								hScrollbar: true,
								mousewheel: false
							});
							ufma.setBarPos($(window));
							$('.dataTables_wrapper.no-footer .dataTables_scrollBody').css("border-bottom", "1px solid transparent")
						} else {
						//	$('#carryOver').closest('.dataTables_wrapper').ufScrollBar('destroy');
							$('.dataTables_wrapper.no-footer .dataTables_scrollBody').css("border-bottom", "1px solid transparent")
						}
						if ((page.typeSet == 'GKBM' && page.allTableData && page.allTableData.length == 0) || (page.typeSet == 'YKBM' && page.allTableDataYK && page.allTableDataYK.length == 0) || (page.typeSet == 'AR_BILL_TYPE' && page.allTableDataDJ && page.allTableDataDJ.length == 0)) {
							$('.uf-rpt-table.ufma-table.dataTable tr:last-child td').css({
								"border-bottom": "1px solid transparent"
							});
						} else {
							$('.uf-rpt-table.ufma-table.dataTable tr:last-child td').css({
								"border-bottom": "1px solid #D9D9D9"
							});
						}
					}
				})
			},

			//获取表格数据
			showTblData: function () {
				ufma.hideloading();
				oTableCarrry.fnClearTable();
				if (page.typeSet == 'GKBM' && !$.isNull(page.allTableData) && page.allTableData.length > 0) {
					oTableCarrry.fnAddData(page.allTableData, true);
				} else if (page.typeSet == 'YKBM' && !$.isNull(page.allTableDataYK) && page.allTableDataYK.length > 0) {
					oTableCarrry.fnAddData(page.allTableDataYK, true);
				} else if (page.typeSet == 'AR_BILL_TYPE' && !$.isNull(page.allTableDataDJ) && page.allTableDataDJ.length > 0) {
					oTableCarrry.fnAddData(page.allTableDataDJ, true);
				}
			},
			//初始化部门表格
			initDepartTable: function () {
				if (oTableDep) {
          $('#depTable').closest('.dataTables_wrapper').ufScrollBar('destroy');
          oTableDep.fnDestroy();
          $('#depTable').html('');
				}
				var tblId = 'depTable';
				var columns = [{
					data: 'opt',
					title: '操作',
					className: 'nowrap optDep tc',
					width: 40,
					render: function (data, type, rowdata, meta) {
						return '<a dataIndex="' + meta.row + '" setId="' + rowdata.setId + '"  class="btn btn-icon-only btn-sm  icon-trash f16 btnDepDelete" data-toggle="tooltip" title="删除">';
					}
				}, {
					data: "isShow",
					title: "查看金额",
					className: "tc nowrap",
					width: 50,
					render: function (data, type, rowdata, meta) {
						if (rowdata.isShow == '1') {
							return '是';
						} else if (rowdata.isShow == '0') {
							return '否';
						}
					}
				}, {
					data: "setCode",
					title: "部门编码",
					className: "tc nowrap",
					width: 120,
				}, {
					data: "setCodeName",
					title: "部门名称",
					className: "tc nowrap commonShow",
					width: 200,
					render: function (data, type, rowdata, meta) {
						if (!$.isNull(data)) {
							return '<code title="' + data + '">' + data + '</code>';
						} else {
							return '';
						}
					}
				}];
				oTableDep = $("#" + tblId).dataTable({
					"language": {
						"url": bootPath + "agla-trd/datatables/datatable.default.js"
					},
					"autoWidth": false,
					"bDestory": true,
					"processing": true, //显示正在加载中
					"pagingType": "full_numbers", //分页样式
					"lengthChange": true, //是否允许用户自定义显示数量p
					"lengthMenu": [
						[20, 50, 100, 200, -1],
						[20, 50, 100, 200, "全部"]
					],
					//"pageLength": 100, //默认每页显示100条--zsj--吉林公安需求
					"pageLength": ufma.dtPageLength("#" + tblId),
					"serverSide": false,
					"ordering": false,
					"scrollY": 340,
					columns: columns,
					"columnDefs": [],
					//填充表格数据
					data: [],
					"dom": "rt",
					initComplete: function (settings, json) {
						ufma.isShow(reslist);
						if (page.depData && page.depData.length == 0) {
							$('.uf-rpt-table.ufma-table.dataTable tr:last-child td').css({
								"border-bottom": "1px solid transparent"
							});
						} else {
							$('.uf-rpt-table.ufma-table.dataTable tr:last-child td').css({
								"border-bottom": "1px solid #D9D9D9"
							});
						}
					},
					drawCallback: function (settings) {
						$('#depTable').find("td.dataTables_empty").text("")
							.append('<img src="' + bootPath + 'images/noData.png"/><br/><i>目前还没有你要查询的数据</i>');
						ufma.isShow(reslist);
						$('#depTable_wrapper').css({
							"border": "#d9d9d9 1px solid",
							"border-top": "none"
						});
						var wrapperWidth = $('#depTable_wrapper').width();
						var tableWidth = $('#depTable').width();
						if (tableWidth > wrapperWidth) {
							$('.dataTables_wrapper.no-footer .dataTables_scrollBody').css("border-bottom", "1px solid transparent");
						} else {
						//	$('#depTable').closest('.dataTables_wrapper').ufScrollBar('destroy');
							$('.dataTables_wrapper.no-footer .dataTables_scrollBody').css("border-bottom", "1px solid transparent");
						}
						if (page.depData && page.depData.length == 0) {
							$('.uf-rpt-table.ufma-table.dataTable tr:last-child td').css({
								"border-bottom": "1px solid transparent"
							});
						} else {
							$('.uf-rpt-table.ufma-table.dataTable tr:last-child td').css({
								"border-bottom": "1px solid #D9D9D9"
							});
						}
					}
				})
			},
			//获取部门表格数据
			showDepData: function () {
				ufma.hideloading();
				oTableDep.fnClearTable();
				if (!$.isNull(page.depData) && page.depData.length > 0) {
          oTableDep.fnAddData(page.depData, true);
          $('#depTable').closest('.dataTables_wrapper').ufScrollBar({
            hScrollbar: true,
            mousewheel: false
          });
				}
			},

			//初始化项目表格
			initProjectTable: function () {
				if (oTablePro) {
          $('#proTable').closest('.dataTables_wrapper').ufScrollBar('destroy');
					oTablePro.fnDestroy();
					$('#proTable').html('');
				}
				var tblId = 'proTable';
				var columns = [{
					data: 'opt',
					title: '操作',
					className: 'nowrap tc optPro',
					width: 40,
					render: function (data, type, rowdata, meta) {
						return '<a dataIndex="' + meta.row + '" setId="' + rowdata.setId + '"  class="btn btn-icon-only btn-sm icon-trash f16 btnProDelete" data-toggle="tooltip" title="删除">';
					}
				}, {
					data: "isShow",
					title: "查看金额",
					className: "tc nowrap",
					width: 50,
					render: function (data, type, rowdata, meta) {
						if (rowdata.isShow == '1') {
							return '是';
						} else if (rowdata.isShow == '0') {
							return '否';
						}
					}
				}, {
					data: "setCode",
					title: "项目编码",
					className: "tc nowrap",
					width: 120,
				}, {
					data: "setCodeName",
					title: "项目名称",
					className: "tc nowrap commonShow",
					width: 200,
					render: function (data, type, rowdata, meta) {
						if (!$.isNull(data)) {
							return '<code title="' + data + '">' + data + '</code>';
						} else {
							return '';
						}
					}
				}];
				oTablePro = $("#" + tblId).dataTable({
					"language": {
						"url": bootPath + "agla-trd/datatables/datatable.default.js"
					},
					//"bFilter": true,
					"autoWidth": false,
					"bDestory": true,
					"processing": true, //显示正在加载中
					"pagingType": "full_numbers", //分页样式
					"lengthChange": true, //是否允许用户自定义显示数量p
					"lengthMenu": [
						[20, 50, 100, 200, -1],
						[20, 50, 100, 200, "全部"]
					],
					//"pageLength": 100, //默认每页显示100条--zsj--吉林公安需求
					"pageLength": ufma.dtPageLength("#" + tblId),
					"serverSide": false,
					"ordering": false,
					"scrollY": 340,
					columns: columns,
					"columnDefs": [],
					//填充表格数据
					data: [],
					"dom": "rt",
					initComplete: function (settings, json) {
						ufma.isShow(reslist);
						if (page.proData && page.proData.length == 0) {
							$('.uf-rpt-table.ufma-table.dataTable tr:last-child td').css({
								"border-bottom": "1px solid transparent"
							});
						} else {
							$('.uf-rpt-table.ufma-table.dataTable tr:last-child td').css({
								"border-bottom": "1px solid #D9D9D9"
							});
						}
					},
					drawCallback: function (settings) {
						$('#proTable').find("td.dataTables_empty").text("")
							.append('<img src="' + bootPath + 'images/noData.png"/><br/><i>目前还没有你要查询的数据</i>');
						ufma.isShow(reslist);
						$('#proTable_wrapper').css({
							"border": "#d9d9d9 1px solid",
							"border-top": "none"
						});
						var wrapperWidth = $('#proTable_wrapper').width();
						var tableWidth = $('#proTable').width();
						if (tableWidth > wrapperWidth) {
							$('.dataTables_wrapper.no-footer .dataTables_scrollBody').css("border-bottom", "1px solid transparent")
						} else {
						//	$('#proTable').closest('.dataTables_wrapper').ufScrollBar('destroy');
							$('.dataTables_wrapper.no-footer .dataTables_scrollBody').css("border-bottom", "1px solid transparent")
						}
						if (page.proData && page.proData.length == 0) {
							$('.uf-rpt-table.ufma-table.dataTable tr:last-child td').css({
								"border-bottom": "1px solid transparent"
							});
						} else {
							$('.uf-rpt-table.ufma-table.dataTable tr:last-child td').css({
								"border-bottom": "1px solid #D9D9D9"
							});
						}
					}
				})
			},
			//获取项目表格数据
			showProData: function () {
				ufma.hideloading();
				oTablePro.fnClearTable();
				if (!$.isNull(page.proData) && page.proData.length > 0) {
          oTablePro.fnAddData(page.proData, true);
          $('#proTable').closest('.dataTables_wrapper').ufScrollBar({
            hScrollbar: true,
            mousewheel: false
          });
				}
			},

			//初始化部门经济分类表格
			initExpecoTable: function () {
				if (oTableExp) {
          $('#expTable').closest('.dataTables_wrapper').ufScrollBar('destroy');
          oTableExp.fnDestroy();
					$('#expTable').html('');
				}
				var tblId = 'expTable';
				var columns = [{
					data: 'opt',
					title: '操作',
					className: 'nowrap tc optExp',
					width: 40,
					render: function (data, type, rowdata, meta) {
						return '<a dataIndex="' + meta.row + '" setId="' + rowdata.setId + '"  class="btn btn-icon-only btn-sm icon-trash f16 btnExpDelete" data-toggle="tooltip" title="删除">';
					}
				}, {
					data: "isShow",
					title: "查看金额",
					className: "tc nowrap",
					width: 50,
					render: function (data, type, rowdata, meta) {
						if (rowdata.isShow == '1') {
							return '是';
						} else if (rowdata.isShow == '0') {
							return '否';
						}

					}
				}, {
					data: "setCode",
					title: "部门经济分类编码",
					className: "tc nowrap",
					width: 120,
				}, {
					data: "setCodeName",
					title: "部门经济分类名称",
					className: "tc nowrap commonShow",
					width: 200,
					render: function (data, type, rowdata, meta) {
						if (!$.isNull(data)) {
							return '<code title="' + data + '">' + data + '</code>';
						} else {
							return '';
						}

					}
				}];
				oTableExp = $("#" + tblId).dataTable({
					"language": {
						"url": bootPath + "agla-trd/datatables/datatable.default.js"
					},
					"autoWidth": false,
					"bDestory": true,
					"processing": true, //显示正在加载中
					"pagingType": "full_numbers", //分页样式
					"lengthChange": true, //是否允许用户自定义显示数量p
					"lengthMenu": [
						[20, 50, 100, 200, -1],
						[20, 50, 100, 200, "全部"]
					],
					//"pageLength": 100, //默认每页显示100条--zsj--吉林公安需求
					"pageLength": ufma.dtPageLength("#" + tblId),
					"serverSide": false,
					"ordering": false,
					"scrollY": 340,
					columns: columns,
					"columnDefs": [],
					//填充表格数据
					data: [],
					"dom": "rt",
					initComplete: function (settings, json) {
						ufma.isShow(reslist);
						if (page.expData && page.expData.length == 0) {
							$('.uf-rpt-table.ufma-table.dataTable tr:last-child td').css({
								"border-bottom": "1px solid transparent"
							});
						} else {
							$('.uf-rpt-table.ufma-table.dataTable tr:last-child td').css({
								"border-bottom": "1px solid #D9D9D9"
							});
						}
					},
					drawCallback: function (settings) {
						$('#expTable').find("td.dataTables_empty").text("")
							.append('<img src="' + bootPath + 'images/noData.png"/><br/><i>目前还没有你要查询的数据</i>');
						ufma.isShow(reslist);
						$('#expTable_wrapper').css({
							"border": "#d9d9d9 1px solid",
							"border-top": "none"
						});
						var wrapperWidth = $('#expTable_wrapper').width();
						var tableWidth = $('#expTable').width();
						if (tableWidth > wrapperWidth) {
							$('.dataTables_wrapper.no-footer .dataTables_scrollBody').css("border-bottom", "1px solid transparent")
						} else {
							//$('#expTable').closest('.dataTables_wrapper').ufScrollBar('destroy');
							$('.dataTables_wrapper.no-footer .dataTables_scrollBody').css("border-bottom", "1px solid transparent")
						}
						if (page.expData && page.expData.length == 0) {
							$('.uf-rpt-table.ufma-table.dataTable tr:last-child td').css({
								"border-bottom": "1px solid transparent"
							});
						} else {
							$('.uf-rpt-table.ufma-table.dataTable tr:last-child td').css({
								"border-bottom": "1px solid #D9D9D9"
							});
						}
					}
				})
			},
			//获取项目表格数据
			showExpData: function () {
				ufma.hideloading();
				oTableExp.fnClearTable();
				if (!$.isNull(page.expData) && page.expData.length > 0) {
          oTableExp.fnAddData(page.expData, true);
          $('#expTable').closest('.dataTables_wrapper').ufScrollBar({
            hScrollbar: true,
            mousewheel: false
          });
				}
			},
			//权限树需保存数据
			preTreeSaveData: function () {
				var nodes = treeObj.getCheckedNodes(true);
				var pcodeCodeArr = [];
				var nodeList = [];
				//找出已勾选数据的pid
				var checkNodes = [];
				for (var i = 0; i < nodes.length; i++) {
					var node = nodes[i];
					if (node.checked == true && (node.check_Child_State == -1 || node.check_Child_State == 2)) {
						if (page.typeSet != 'AR_BILL_TYPE') {
							pcodeCodeArr.push(node.id);
						}
						checkNodes.push(node);
					}
				}
				if (page.treeType == '2') {
					for (var m = 0; m < checkNodes.length; m++) {
						var nodeUseDj = {};
						nodeUseDj.configId = checkNodes[m].code;
						nodeUseDj.configCode = checkNodes[m].code;
						nodeList.push(nodeUseDj);
					}
				} else if (page.treeType == '1') {
					var typeTree = page.typeSet;
					for (var j = 0; j < checkNodes.length; j++) {
						var nodeUse = {};
						if (typeTree == 'GKBM' && pageData.bgItemList.length != 0) { //如果是归口部门  那么指标页签有值得时候，只能勾选一个,既指标的归口部门只能设置一个
							if (checkNodes[j].isLeaf == '1') {
								var pcode = checkNodes[j].pId;
								nodeUse.configId = pageData.treeDepType == false ? checkNodes[j].chrId : checkNodes[j].id;
								nodeUse.configCode = checkNodes[j].code;
								nodeList.push(nodeUse);
							}
						} else {
							if ($.isNull(checkNodes[j].parentTId)) {
								nodeUse.configId = pageData.treeDepType == false ? checkNodes[j].chrId : checkNodes[j].id;
								nodeUse.configCode = checkNodes[j].code;
								nodeList.push(nodeUse);
							} else if (!$.isNull(checkNodes[j].parentTId) && checkNodes[j].isLeaf == '1') {
								var pcode = checkNodes[j].pId;
								if ($.inArray(pcode, pcodeCodeArr) === -1) {
									nodeUse.configId = pageData.treeDepType == false ? checkNodes[j].chrId : checkNodes[j].id;
									nodeUse.configCode = checkNodes[j].code;
									nodeList.push(nodeUse);
                } 
                //ZJGA820-1807 在指标授权管理模块，先新增指标然后勾选左侧部门树，进行指标授权给多个部门，返回列表看到授权对象只显示了一个人。希望可以清晰的显示出来授权的三个部门。希望授权对象那里可以清晰显示出授权的部门。--zsj--用款部门传参有误
                // else {
								// 	pcodeCodeArr.splice(j, 1);
								// }
							} else if (!$.isNull(checkNodes[j].parentTId) && checkNodes[j].isLeaf == '0') {
								var pcode = checkNodes[j].pId;
								if ($.inArray(pcode, pcodeCodeArr) === -1) {
									nodeUse.configId = pageData.treeDepType == false ? checkNodes[j].chrId : checkNodes[j].id;
									nodeUse.configCode = checkNodes[j].code;
									nodeList.push(nodeUse);
								}
							}
						}
					}
				}
				return nodeList;
			},
			//指标需保存数据
			billSaveFun: function (actionFlag) {
				var items = [];
				var itemDel = [];
				if ($('#carryOver_wrapper').find('td.optBill .btnBillDelete').length > 0) {
					$('#carryOver_wrapper').find('td.optBill .btnBillDelete').each(function () {
						var rowIndex = $(this).attr('dataIndex');
						var setId = $(this).attr('setId');
						var setCode = '';
						var setCodeName = '';
						var isShow = '';
						var rowData = {};
						if (rowIndex) {
							setCode = oTableCarrry.api(false).row(rowIndex).data().setCode;
							isShow = oTableCarrry.api(false).row(rowIndex).data().isShow;
							rowData = oTableCarrry.api(false).row(rowIndex).data();
						}
						var rowDataSet = {
							"setId": setId,
							"setCode": setCode,
							"isShow": isShow
						};
						items.push(rowDataSet);
						if (actionFlag == 'delete') {
							itemDel.push(rowData);
							if (itemDel.length > 0) {
								if (page.typeSet == 'GKBM') {
									page.allTableData = itemDel;
								} else if (page.typeSet == 'YKBM') {
									page.allTableDataYK = itemDel;
								}
							}
						}
					});
				} else {
					if (page.typeSet == 'GKBM') {
						page.allTableData = [];
					} else if (page.typeSet == 'YKBM') {
						page.allTableDataYK = [];
					}
				}
				if (actionFlag == 'delete') {
					oTableCarrry.fnClearTable();
					if ((page.typeSet == 'GKBM' && page.allTableData && page.allTableData.length > 0)) {
						oTableCarrry.fnAddData(page.allTableData, true);
					} else if (page.typeSet == 'YKBM' && page.allTableDataYK && page.allTableDataYK.length > 0) {
						oTableCarrry.fnAddData(page.allTableDataYK, true);
					}
				}
				localStorage.removeItem("billSaveData");
				localStorage.setItem("billSaveData", JSON.stringify(items));
			},
			//部门需保存数据
			depSaveFun: function (actionFlag) {
				var items = [];
				var itemDel = [];
				if ($('#depTable_wrapper').find('td.optDep .btnDepDelete').length > 0) {
					$('#depTable_wrapper').find('td.optDep .btnDepDelete').each(function () {
						var rowIndex = $(this).attr('dataIndex');
						var setId = $(this).attr('setId');
						var setCode = '';
						var setCodeName = '';
						var isShow = '';
						var rowData = {};
						if (rowIndex) {
							setCode = oTableDep.api(false).row(rowIndex).data().setCode;
							isShow = oTableDep.api(false).row(rowIndex).data().isShow;
							rowData = oTableDep.api(false).row(rowIndex).data();
						}
						var rowDataSet = {
							"setId": setId,
							"setCode": setCode,
							"isShow": isShow
						};
						items.push(rowDataSet);
						if (actionFlag == 'delete') {
							itemDel.push(rowData);
							if (itemDel.length > 0) {
								page.depData = itemDel;
							}
						}
					});
				} else {
					page.depData = [];
				}

				if (actionFlag == 'delete') {
					oTableDep.fnClearTable();
					if (!$.isNull(page.depData) && page.depData.length > 0) {
						oTableDep.fnAddData(page.depData, true);
					}
				}
				localStorage.removeItem("depSaveData");
				localStorage.setItem("depSaveData", JSON.stringify(items));
			},
			//项目需保存数据
			proSaveFun: function (actionFlag) {
				var items = [];
				var itemDel = [];
				if ($('#proTable_wrapper').find('td.optPro .btnProDelete').length > 0) {
					$('#proTable_wrapper').find('td.optPro .btnProDelete').each(function () {
						var rowIndex = $(this).attr('dataIndex');
						var setId = $(this).attr('setId');
						var setCode = '';
						var setCodeName = '';
						var isShow = '';

						if (rowIndex) {
							setCode = oTablePro.api(false).row(rowIndex).data().setCode;
							isShow = oTablePro.api(false).row(rowIndex).data().isShow;
							rowData = oTablePro.api(false).row(rowIndex).data();
						}
						var rowDataSet = {
							"setId": setId,
							"setCode": setCode,
							"isShow": isShow
						};
						items.push(rowDataSet);
						if (actionFlag == 'delete') {
							itemDel.push(rowData);
							if (itemDel.length > 0) {
								page.proData = itemDel;
							}
						}
					});
				} else {
					page.proData = [];
				}

				if (actionFlag == 'delete') {
					oTablePro.fnClearTable();
					if (!$.isNull(page.proData) && page.proData.length > 0) {
						oTablePro.fnAddData(page.proData, true);
					}
				}
				localStorage.removeItem("proSaveData");
				localStorage.setItem("proSaveData", JSON.stringify(items));
			},
			//部门经济分类需保存数据
			expSaveFun: function (actionFlag) {
				var items = [];
				var itemDel = [];
				if ($('#expTable_wrapper').find('td.optExp .btnExpDelete').length > 0) {
					$('#expTable_wrapper').find('td.optExp .btnExpDelete').each(function () {
						var rowIndex = $(this).attr('dataIndex');
						var setId = $(this).attr('setId');
						var setCode = '';
						var setCodeName = '';
						var isShow = '';
						if (rowIndex) {
							setCode = oTableExp.api(false).row(rowIndex).data().setCode;
							isShow = oTableExp.api(false).row(rowIndex).data().isShow;
							rowData = oTableExp.api(false).row(rowIndex).data();
						}
						var rowDataSet = {
							"setId": setId,
							"setCode": setCode,
							"isShow": isShow
						};
						items.push(rowDataSet);
						if (actionFlag == 'delete') {
							itemDel.push(rowData);
							if (itemDel.length > 0) {
								page.expData = itemDel;
							}
						}
					});
				} else {
					page.expData = [];
				}

				if (actionFlag == 'delete') {
					oTableExp.fnClearTable();
					if (!$.isNull(page.expData) && page.expData.length > 0) {
						oTableExp.fnAddData(page.expData, true);
					}
				}
				localStorage.removeItem("expSaveData");
				localStorage.setItem("expSaveData", JSON.stringify(items));
			},
			//保存整个权限
			savePageFun: function () {
				//指标数据
				var checkJsonBill = localStorage.getItem("billSaveData");
				if (!$.isNull(checkJsonBill)) {
					pageData.bgItemList = eval("(" + checkJsonBill + ")");
				} else {
					pageData.bgItemList = [];
				}
				//部门数据
				var checkJsonDep = localStorage.getItem("depSaveData");
				if (!$.isNull(checkJsonDep)) {
					pageData.departmentList = eval("(" + checkJsonDep + ")");
				} else {
					pageData.departmentList = [];
				}
				//项目数据
				var checkJsonPro = localStorage.getItem("proSaveData");
				if (!$.isNull(checkJsonPro)) {
					pageData.projectList = eval("(" + checkJsonPro + ")");
				} else {
					pageData.projectList = [];
				}
				//部门经济分类数据
				var checkJsonExp = localStorage.getItem("expSaveData");
				if (!$.isNull(checkJsonExp)) {
					pageData.expecoList = eval("(" + checkJsonExp + ")");
				} else {
					pageData.expecoList = [];
				}
				pageData.configList = page.preTreeSaveData();
				//如果表格数据为空，那么树也为空，才能保存。如果表格有数据，那么树不能为空
				var typeTree = page.typeSet;
				//归口部门只能设置一个授权对象
				if (typeTree == 'GKBM' && pageData.configList.length == 0) {
					ufma.showTip('请先选择授权对象', function () {}, 'warning');
					return false;
				} else if (typeTree == 'GKBM' && pageData.configList.length > 1) { //如果是归口部门  那么指标页签有值得时候，只能勾选一个,既指标的归口部门只能设置一个
					ufma.showTip('指标的归口部门只能设置一个', function () {}, 'warning');
					return false;
				} else if (typeTree == 'GKBM' && pageData.bgItemList.length == 0) { //如果是归口部门  那么指标页签有值得时候，只能勾选一个,既指标的归口部门只能设置一个
					ufma.showTip('请先选择指标权限', function () {}, 'warning');
					return false;
				} else if (pageData.configList.length == 0) {
					ufma.showTip('请先选择授权对象', function () {}, 'warning');
					return false;
				} else if (pageData.configList.length != 0 && (pageData.bgItemList.length == 0 && pageData.departmentList.length == 0 && pageData.projectList.length == 0 && pageData.expecoList == 0)) {
					ufma.showTip('请先选择指标权限', function () {}, 'warning');
					return false;
				} else {
					if ($.isNull($('#methodName').val())) {
						ufma.showTip('权限名称不能为空', function () {}, 'warning');
						return false;
					} else {
						var url = '/bg/rule/saveRuleDetail?agencyCode=' + pageData.agencyCode + '&rgCode=' + pageData.rgCode + '&setYear=' + pageData.setYear + '&ruleId=' + pageData.ruleId;
						var argu = {
							"agencyCode": pageData.agencyCode,
							"rgCode": pageData.rgCode,
							"setYear": pageData.setYear,
							"configType": page.typeSet,
							"ruleId": pageData.ruleId,
							"ruleName": $('#methodName').val(),
							"configList": pageData.configList,
							"bgItemList": pageData.bgItemList,
							"departmentList": page.typeSet == "GKBM" || page.typeSet == "AR_BILL_TYPE" ? [] : pageData.departmentList,
							"projectList": pageData.typeSet == "GKBM" || page.typeSet == "AR_BILL_TYPE" ? [] : pageData.projectList,
							"expecoList": pageData.typeSet == "GKBM" || page.typeSet == "YKBM" ? [] : pageData.expecoList
						}
						ufma.post(url, argu, function (result) {
							if (result.flag == "success") {
								ufma.showTip('保存成功', function () {
									_close('save');
								}, 'success');
							} else {
								ufma.showTip(result.msg, function () {}, 'warning');
							}
						});
					}
				}
      },
      //ZJGA820-1764 --指标权限管理模块，点击新增指标界面的预算方案那里没有记忆功能，查询条件预算项目那里不支持手输模糊查询。点击弹出下拉框还挡住了部分输入框。--zsj
			selectSessionData: function () {
				var argu = {
					agencyCode: pageData.agencyCode,
					acctCode: '*',
					menuId: '1a556c2f-113f-4b7d-a129-ff620b4a5abd'
				}
				ufma.ajaxDef('/pub/user/menu/config/select','get', argu, function (result) {
					page.sessionPlanData = result.data;
				});
			},
			onEventListener: function () {
				$(document).on('change', '.setTypeClss .typeCheck', function () {
					var clickId = $(this).attr('id');
					var enuName = $(this).attr('enuName');
					var enuCode = $(this).attr('enuCode');
					var itemDel = [];
					if (!$(this).hasClass('ckeckTrue')) {
						var beforeCode = $('.setTypeClss').find('.typeCheck.ckeckTrue').attr('enuCode');
						var beforeName = $('.setTypeClss').find('.typeCheck.ckeckTrue').attr('enuName');
						var beforeId = $('.setTypeClss').find('.typeCheck.ckeckTrue').attr('id');
						$('#permissionTree').html('');
						if ($('#carryOver_wrapper').find('td.optBill .btnBillDelete').length > 0) {
							$('#carryOver_wrapper').find('td.optBill .btnBillDelete').each(function () {
								var rowIndex = $(this).attr('dataIndex');
								var setCode = '';
								var setCodeName = '';
								var isShow = '';
								var rowData = {};
								if (rowIndex) {
									setCode = oTableCarrry.api(false).row(rowIndex).data().setCode;
									isShow = oTableCarrry.api(false).row(rowIndex).data().isShow;
									rowData = oTableCarrry.api(false).row(rowIndex).data();
								}
								itemDel.push(rowData);
							});
						} else {
							itemDel = [];
						}
						if (beforeCode == 'GKBM') {
							page.allTableData = itemDel;
						} else if (beforeCode == 'YKBM') {
							page.allTableDataYK = itemDel;
						} else if (beforeCode == 'AR_BILL_TYPE') {
							page.allTableDataDJ = itemDel;
						}
						if (enuCode == 'GKBM') {
							$('#departTree,#projectTree,#expecoTree').addClass('hide');
							$('#projectArea,#departArea,#expecoArea').addClass('hide');
							$('#billTable').addClass('active').siblings().removeClass('active');
							$('#billArea').removeClass('hide');
						} else if (enuCode == 'YKBM') {
							$('#expecoTree').addClass('hide');
							$('#departTree,#projectTree').removeClass('hide');
							$('#projectArea,#departArea,#expecoArea').addClass('hide');
							$('#billTable').addClass('active').siblings().removeClass('active');
							$('#billArea').removeClass('hide');
						} else if (enuCode == 'AR_BILL_TYPE') {
							$('#expecoTree').removeClass('hide');
							$('#departTree,#projectTree').addClass('hide');
							$('#projectArea,#departArea,#expecoArea').addClass('hide');
							$('#billTable').addClass('active').siblings().removeClass('active');
							$('#billArea').removeClass('hide');
						}
						page.typeSet = enuCode; 
						$('#cbBgPlan').html('请选择' + enuName);
						page.initCarryTable();
						page.showTblData(); //加载单据表格
						page.getNewTree(page.typeSet);
						$(this).closest('div').find('.typeCheck').removeClass('ckeckTrue');
						$(this).addClass('ckeckTrue');
					} else {
            page.typeSet = enuCode; 
            page.getNewTree(page.typeSet);
            page.initCarryTable();
						page.showTblData(); //加载单据表格
          }
				});
				//删除指标数据
				$(document).on('click', 'td.optBill .btnBillDelete', function (e) {
					e.preventDefault();
					$(this).closest('tr').remove();
					page.billSaveFun('delete');
				});
				//删除部门数据
				$(document).on('click', 'td.optDep .btnDepDelete', function (e) {
					e.preventDefault();
					$(this).closest('tr').remove();
					page.depSaveFun('delete');
				});
				//删除项目
				$(document).on('click', 'td.optPro .btnProDelete', function (e) {
					e.preventDefault();
					$(this).closest('tr').remove();
					page.proSaveFun('delete');
				});
				//删除部门经济分类
				$(document).on('click', 'td.optExp .btnExpDelete', function (e) {
					e.preventDefault();
					$(this).closest('tr').remove();
					page.expSaveFun('delete');
				});
				//新增弹窗
				$("#addNewData").on('click', function () {
          //ZJGA820-1764 --指标权限管理模块，点击新增指标界面的预算方案那里没有记忆功能，查询条件预算项目那里不支持手输模糊查询。点击弹出下拉框还挡住了部分输入框。--zsj
          page.selectSessionData();
					//不要记忆已勾选数据, 相同的覆盖,不同的都保留
					var openData = {};
					openData.agencyCode = pageData.agencyCode;
					openData.setYear = pageData.setYear;
					openData.rgCode = pageData.rgCode;
					openData.setType = $('#tabAcce li.active a').attr('setType');
          openData.configType = page.typeSet;
          //ZJGA820-1764 --指标权限管理模块，点击新增指标界面的预算方案那里没有记忆功能，查询条件预算项目那里不支持手输模糊查询。点击弹出下拉框还挡住了部分输入框。--zsj
          openData.memberPlan =!$.isNull(page.sessionPlanData.cbBgPlan) ? page.sessionPlanData.cbBgPlan.split(',')[0] : '';
					if (openData.setType == 'BGITEM') {
						ufma.open({
							url: 'chooseBill.html',
							title: '指标选择',
							width: 1000,
							height: 500,
							data: openData,
							ondestory: function (result) {
								if (result) {
									if (result.action == 'save') {
										var chosedArr = [];
										var billData = [];
										if (page.typeSet == 'GKBM') {
											billData = page.allTableData;
										} else if (page.typeSet == 'YKBM') {
											billData = page.allTableDataYK;
										} else if (page.typeSet == 'AR_BILL_TYPE') {
											billData = page.allTableDataDJ;
										}
										for (var i = 0; i < billData.length; i++) {
											chosedArr.push(billData[i].setCode);
										}
										for (var j = 0; j < result.data.tableData.length; j++) {
											var code = result.data.tableData[j].setCode;
											if ($.inArray(code, chosedArr) === -1) { //如果等于-1，则表示字符code不包含在 choisedArr
												billData.push(result.data.tableData[j]);
											} else {
												var index = $.inArray(code, chosedArr);
												billData[index] = $.extend(billData[index], result.data.tableData[j]);
											}
										}
										oTableCarrry.fnClearTable();
										if (!$.isNull(billData) && billData.length > 0) {
											oTableCarrry.fnAddData(billData, true);
											page.billSaveFun('save');
										}
									}
								}
							}
						});
					} else {
						var title = '';
						var eleCode = '';
						if (openData.setType == 'DEPARTMENT') {
							title = '选择部门';
							eleCode = 'DEPARTMENT';
						} else if (openData.setType == 'PROJECT') {
							title = '选择项目';
							eleCode = 'PROJECT';
						}
						if (openData.setType == 'EXPECO') {
							title = '选择部门经济分类';
							eleCode = 'EXPECO';
						}
						openData.eleCode = eleCode;
						ufma.open({
							url: 'chooseTreeCode.html',
							title: title,
							width: 580,
							height: 500,
							data: openData,
							ondestory: function (result) {
								if (result) {
									if (result.action == 'sure') {
										if (openData.setType == 'DEPARTMENT') { //部门
											var chosedArr = [];
											for (var i = 0; i < page.depData.length; i++) {
												chosedArr.push(page.depData[i].setCode);
											}
											for (var j = 0; j < result.data.length; j++) {
												var code = result.data[j].setCode;
												if ($.inArray(code, chosedArr) === -1) { //如果等于-1，则表示字符code不包含在 choisedArr
													page.depData.push(result.data[j]);
												} else {
													var index = $.inArray(code, chosedArr);
													page.depData[index] = $.extend(page.depData[index], result.data[j]);
												}
											}
											oTableDep.fnClearTable();
											if (!$.isNull(page.depData) && page.depData.length > 0) {
												oTableDep.fnAddData(page.depData, true);
												page.depSaveFun('save');
											}
										} else if (openData.setType == 'PROJECT') { //项目
											var chosedArr = []
											for (var i = 0; i < page.proData.length; i++) {
												chosedArr.push(page.proData[i].setCode);
											}
											for (var j = 0; j < result.data.length; j++) {
												var code = result.data[j].setCode;
												if ($.inArray(code, chosedArr) === -1) { //如果等于-1，则表示字符code不包含在 choisedArr
													page.proData.push(result.data[j]);
												} else {
													var index = $.inArray(code, chosedArr);
													page.proData[index] = $.extend(page.proData[index], result.data[j]);
												}
											}
											oTablePro.fnClearTable();
											if (!$.isNull(page.proData) && page.proData.length > 0) {
												oTablePro.fnAddData(page.proData, true);
												page.proSaveFun('save');
											}
										}
										if (openData.setType == 'EXPECO') { //部门经济分类
											var chosedArr = []
											for (var i = 0; i < page.expData.length; i++) {
												chosedArr.push(page.expData[i].setCode);
											}
											for (var j = 0; j < result.data.length; j++) {
												var code = result.data[j].setCode;
												if ($.inArray(code, chosedArr) === -1) { //如果等于-1，则表示字符code不包含在 choisedArr
													page.expData.push(result.data[j]);
												} else {
													var index = $.inArray(code, chosedArr);
													page.expData[index] = $.extend(page.expData[index], result.data[j]);
												}
											}
											oTableExp.fnClearTable();
											if (!$.isNull(page.expData) && page.expData.length > 0) {
												oTableExp.fnAddData(page.expData, true);
												page.expSaveFun('save');
											}
										}
									}
								}
							}
						});
					}
				});
				//查询
				$('#btnQry').click(function () {
					page.getPremissionTree();
					ufma.setBarPos($(window));
				});
				//切换页签时默认选择指标，然后刷新界面
				$('#tabAcce li a').click(function (e) {
					e.preventDefault();
					if ($(this).attr('id') == 'aBillTable') {
						$('#billArea').removeClass('hide');
						$('#projectArea,#departArea,#expecoArea').addClass('hide');
						page.initCarryTable();
						page.showTblData(); //加载单据表格
						//page.
					} else if ($(this).attr('id') == 'aDepartTree') {
						$('#departArea').removeClass('hide');
						$('#billArea,#projectArea,#expecoArea').addClass('hide');
						page.initDepartTable();
						page.showDepData();
					} else if ($(this).attr('id') == 'aProjectTree') {
						$('#projectArea').removeClass('hide');
						$('#billArea,#departArea,#expecoArea').addClass('hide');
						page.initProjectTable();
						page.showProData();
					} else if ($(this).attr('id') == 'aExpecoTree') {
						$('#expecoArea').removeClass('hide');
						$('#billArea,#departArea,#projectArea').addClass('hide');
						page.initExpecoTable();
						page.showExpData();
					}
				});
				//保存--编辑
				$('#btnSave').on('click', function () {
					page.savePageFun();
				});
				$('#btnClose').on('click', function () {
					_close('cancle');
				});
			},

			//初始化页面
			initPage: function () {
				page.getTableColumns();
				$('#billTable').addClass('active').siblings("li").removeClass('active');
				$('#billArea').removeClass('hide');
				$('#projectArea,#departArea').addClass('hide');
				page.typeSet = '';
				if (pageData.pageAction == 'add') {
					$('#methodName').val('');
					page.initSetTypeTree();
					pageData.ruleId = '';
					pageData.treeTypeCode = '';
					$('.typeCheck').removeAttr('disabled');
				} else if (pageData.pageAction == 'edit') {
					$('.typeCheck').attr('disabled', true);
					$('#methodName').val(pageData.ruleName);
          pageData.treeTypeCode = window.ownerData.treeTypeCode;
					page.typeSet = pageData.treeTypeCode;
					page.getPremissionTree(page.typeSet); //编辑界面获取详细数据
				}
			},
			init: function () {
				//获取session
				reslist = ufma.getPermission();
				ufma.isShow(reslist);
				page.allTableData = [];
				page.allTableDataYK = [];
				page.allTableDataDJ = [];
				page.depData = [];
				page.proData = [];
				page.expData = [];
				localStorage.removeItem("expSaveData");
				localStorage.removeItem("billSaveData");
				localStorage.removeItem("depSaveData");
				localStorage.removeItem("proSaveData");
				pageData = window.ownerData;
				this.initPage();
				this.onEventListener();
				ufma.parse();
				ufma.parseScroll();
			}
		}
	}();

	page.init();
});