$(function () {
	var agencyCode = '',
		agencyName = '';
	var items;
	var DWPlanData;
	var CZPlanData;
	var CZPlanId;
	var DWPlanId;
	var bgItemId; //选中的财政指标的id
	var allCZData; //财政指标表格数据对象
	var selIndex; // 选中的序列号
	var dgColumns;
	var curTableData; //单位指标表格数据
	var isEdit = false; //是否做过修改未保存
	var compireCol = ['bgItemSummary', 'bgItemCur']; //CWYXM-11999 财政指标,点击财政指标会弹出'单位指标未保存提示'--zsj
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
    var oTable;
	var page = function () {
		var ptData = {};
		return {
			//获取单位下拉树
			initAgencyScc: function () {
				page.cbAgency = $('#cbAgency').ufmaTreecombox2({
					valueField: 'id', //可选
					textField: 'codeName', //可选
					readonly: false,
					pIdField: 'pId', //可选
					placeholder: '请选择单位',
					icon: 'icon-unit',
					theme: 'label',
					leafRequire: true,
					onchange: function (data) {
						agencyCode = data.id;
						agencyName = data.name;
						var params = {
							selAgecncyCode: agencyCode,
							selAgecncyName: agencyName
						}
						ufma.setSelectedVar(params);
						//根据系统选项判断发文文号是否必填
						var bgUrl = '/bg/sysdata/selectSysRgParaValue?rgCode=' + ptData.svRgCode + '&setYear=' + page.setYear + '&agencyCode=' + agencyCode + '&chrCode=BG003'
						ufma.get(bgUrl, {}, function (result) {
							page.needSendDocNum = result.data;
							if (page.needSendDocNum == true) {
								page.sendCloName = "指标id";
							} else {
								page.sendCloName = "发文文号";
							}
						});
						page.initCZPlan();
						page.adjGridTop($('#decompose-data'));
						page.initItems();
					}
				});
				ufma.ajaxDef(dm.getCtrl('agency') + "?setYear=" + page.setYear + "&rgCode=" + ptData.svRgCode, "get", "", function (result) {
					page.cbAgency = $("#cbAgency").ufmaTreecombox2({
						data: result.data
					});
					var agyCode = $.inArrayJson(result.data, "id", ptData.svAgencyCode);
					if (agyCode != undefined) {
						page.cbAgency.val(ptData.svAgencyCode);
					} else {
						page.cbAgency.val(result.data[0].id);
					}
				});
			},
			//初始化财政指标预算方案
			initCZPlan: function () {
				$("#cbBgPlan").ufCombox({
					idField: 'chrId',
					textField: 'chrName',
					readonly: false,
					placeholder: '请选择财政指标',
					onChange: function (sender, data) {
						if (CZPlanId != data.chrId) {
							var tempChrid = data.chrId;
							if (!page.checkEdit()) {
								ufma.confirm('您有未保存的单位指标，确认离开吗？', function (action) {
									if (action) { //确认
										selIndex = "";
										page.CZPlanData = data;
										page.initDWPlan(data.chrId);
										page.initCZItems();
										CZPlanId = tempChrid;
									} else { //取消
										$('#cbBgPlan').getObj().val(CZPlanId);
									}
								}, {
									type: 'warning'
								});
							} else {
								selIndex = "";
								page.CZPlanData = data;
								page.initDWPlan(data.chrId);
								page.initCZItems();
							}
						} else {
							selIndex = "";
							page.CZPlanData = data;
							page.initDWPlan(data.chrId);
							page.initCZItems();
						}
					},
					onComplete: function (sender, data) {
						$('#cbBgPlan').getObj().val('1');
						if (!$.isNull(data[0])) {
							CZPlanId = data[0].chrId;
						}
					}
				});
				var argu = {
					agencyCode: agencyCode,
					setYear: page.setYear,
					isEnabled: 1,
					expBgType: 1
				}
				dm.cbbBgPlan(argu, function (result) {
					$("#cbBgPlan").getObj().load(result.data);
					//如果切换单位后，财政指标没有值，清空下面表格和单位指标选择下拉框
					if (result.data.length == 0) {
						$('#gridGOV_wrapper').ufScrollBar('destroy'); //动态销毁表格前要先销毁滚动条,否则滚动条无效
						$("#gridGOV").dataTable().fnDestroy();
						$("#gridGOV").html(''); //guohx 先清空动态加载列     此处代码后面必须重新初始化表头 直接addData不生效
						page.initGrid([]);
						$("#agencyItems").getObj().load(result.data);
					}
				});
			},
			//初始化单位指标预算方案
			initDWPlan: function (bgPlanChrId) {
				$("#agencyItems").ufCombox({
					idField: 'chrId',
					textField: 'chrName',
					readonly: false,
					placeholder: '请选择单位指标',
					onChange: function (sender, data) {
						if (DWPlanId != data.chrId) {
							var tempChrid = data.chrId;
							if (!page.checkEdit()) {
								ufma.confirm('您有未保存的单位指标，确认离开吗？', function (action) {
									if (action) { //确认
										page.DWPlanData = data;
										if ($("#gridGOV tbody").find("tr.sel-row-backcolor").length == 0) {
											page.initItems();
										} else {
											page.initDWItems();
										}
										DWPlanId = tempChrid;
									} else { //取消
										$('#agencyItems').getObj().val(DWPlanId);
									}
								}, {
									type: 'warning'
								});
							} else {
								DWPlanId = tempChrid; //CWYXM-11538 --财政指标，切换单位指标时，单位指标没有刷新--zsj
								page.DWPlanData = data;
								//								/page.initItems();
								if ($("#gridGOV tbody").find("tr.sel-row-backcolor").length == 0) {
									page.initItems();
								} else {
									page.initDWItems();
								}
							}
						} else {
							DWPlanId = tempChrid; //CWYXM-11538 --财政指标，切换单位指标时，单位指标没有刷新--zsj
							page.DWPlanData = data;
							//								/page.initItems();
							if ($("#gridGOV tbody").find("tr.sel-row-backcolor").length == 0) {
								page.initItems();
							} else {
								page.initDWItems();
							}
						}
					},
					onComplete: function (sender, data) {
						if (data && data.length > 0) {
							$('#agencyItems').getObj().val('1');
							DWPlanId = data[0].chrId;
						}

					}
				});
				var argu = {
					agencyCode: agencyCode,
					setYear: page.setYear,
					expBgType: 2,
					bgPlanChrId: bgPlanChrId
				}
				dm.cbbDWBgPlan(argu, function (result) {
					$("#agencyItems").getObj().load(result.data);
					if (result.data.length == 0) {
						page.setChildTable([], []);
					}
				});
			},
			//初始化财政指标
			initCZItems: function () {
				var argu = {
					"agencyCode": agencyCode,
					"bgItemType": "2",
					"bgReserve": 1,
					"status": 3,
					"setYear": page.setYear,
					"chrId": $("#cbBgPlan").getObj().getValue()
				}
				dm.cbbGetBudgetItems(argu, function (result) {
					var data = [];
					if (!$.isNull(result.data.billWithItemsVo)) {
						for (var i = 0; i < result.data.billWithItemsVo.length; i++) {
							var item = result.data.billWithItemsVo[i];
							for (var j = 0; j < item.billWithItems.length; j++) {
								var row = item.billWithItems[j];
								data.push(row);
							};
						}
					}
					$('#gridGOV_wrapper').ufScrollBar('destroy'); //动态销毁表格前要先销毁滚动条,否则滚动条无效
					$("#gridGOV").dataTable().fnDestroy();
					$("#gridGOV").html(''); //guohx 先清空动态加载列     此处代码后面必须重新初始化表头 直接addData不生效
					allCZData = data;
					page.initGrid(data);
				});
			},
			//初始化单位指标
			initDWItems: function (bgItemId) {
				var selectBgItemId = "";
				if ($("#gridGOV tbody").find("tr.sel-row-backcolor").length == 0) {
					selectBgItemId = bgItemId;
				} else {
					$("#gridGOV tbody").find("tr.sel-row-backcolor").each(function () {
						var rowIndex = $(this).find("td").eq(0).find("span").attr('rowindex');
						selIndex = rowIndex;
						var $this = $(this);
						if (rowIndex) {
							selectBgItemId = oTable.api(false).row(rowIndex).data().bgItemId;
						}
					})
				}
				var argu = {
					"bgItemId": selectBgItemId,
					"bgPlanId": $("#agencyItems").getObj().getValue()
				}
				ufma.post(dm.getCtrl('getAgencyBudgetItems') + "?agencyCode=" + agencyCode + "&setYear=" + page.setYear, argu, function (result) {
					var data = result.data;
					var extArr = result.data.eleValueList;
					for (var j = 0; j < extArr.length; j++) {
						var fName = extArr[j].eleName;
						var field = page.shortLineToTF(extArr[j].eleFieldName);
						var treeData = extArr[j].data;
						var eleCode = extArr[j].eleCode;
						if (eleCode != 'ISUPBUDGET') {
							var newData = [];
							for (var i = 0; i < treeData.length; i++) {
								var obj = {};
								var name = field + "Name";
								var code = field + "Code";
								var codeName = field + "CodeName";
								obj[field] = treeData[i].id;
								obj[code] = treeData[i].id;
								obj[codeName] = treeData[i].codeName;
								obj[name] = treeData[i].codeName;
								obj["pId"] = treeData[i].pId;
								newData.push(obj);
							}
							var treeName = field + "Tree";
							page[treeName] = newData;
						}
					}
					page.setChildTable(extArr, result.data.itemList);
					var curAll = 0.00;
					for (var i = 0; i < result.data.itemList.length; i++) {
						curAll = curAll + result.data.itemList[i].bgItemCur;
					}
					//如果是未选中财政指标情况下 需要将待分解金额 和分解金额清空 guohx 
					if ($.isNull(selIndex)) {
						$('#billHJJE').html("0.00");
						$('#decomposableAmt').html("0.00");
					} else {
						$('#billHJJE').html($.formatMoney(curAll));
						$("#gridGOV tbody").find("tr.sel-row-backcolor").each(function () {
							var rowIndex = $(this).find("td").eq(0).find("span").attr('rowindex');
							selIndex = rowIndex;
							var bgBalCur = 0;
							if (rowIndex) {
								bgBalCur = oTable.api(false).row(rowIndex).data().bgItemBalanceCur;
								// var regCur = /^[1-9][0-9]+$/gi;
								// if (regCur.test(bgBalCur) == false) {
								// 	bgBalCur = !$.isNull(bgBalCur) ? bgBalCur.replace(/,/g, '') : '';
                                // }
                if(typeof(bgBalCur) != "number"){
                    bgBalCur = !$.isNull(bgBalCur) ? bgBalCur.replace(/,/g, '') : '';
                }
							}
							page.totalBalanceCur = ufma.parseFloat(bgBalCur) + ufma.parseFloat(curAll)
							//page.totalBalanceCur = ufma.parseFloat(allCZData[selIndex].bgItemBalanceCur) + ufma.parseFloat(curAll)
							$('#decomposableAmt').html($.formatMoney(page.totalBalanceCur - curAll));
						});
					}

				});
			},
			//初始化预算方案下的指标
			initItems: function () {
				var selectBgItemId = '';
				var argu = {
					"agencyCode": agencyCode,
					"bgReserve": 1,
					"setYear": page.setYear,
					"chrId": $("#agencyItems").getObj().getValue(),
					"rgCode": ptData.svRgCode
				}
				if ($.isNull($("#agencyItems").getObj().getValue())) {
					return false;
				}
				ufma.post(dm.getCtrl('getAgencyItems') + "?agencyCode=" + agencyCode + "&setYear=" + page.setYear, argu, function (result) {
					var extArr = result.data.eleValueList;
					var newData = [];
					for (var j = 0; j < extArr.length; j++) {
						var fName = extArr[j].eleName;
						if (extArr[j].eleFieldName != 'ISUPBUDGET') {
							var field = page.shortLineToTF(extArr[j].eleFieldName);
							var treeData = extArr[j].data;
							var eleCode = extArr[j].eleCode;
							for (var i = 0; i < treeData.length; i++) {
								var obj = {};
								var name = field + "Name";
								var code = field + "Code";
								var codeName = field + "CodeName";
								obj[field] = treeData[i].id;
								obj[code] = treeData[i].id;
								obj[codeName] = treeData[i].codeName;
								obj[name] = treeData[i].codeName;
								obj["pId"] = treeData[i].pId;
								newData.push(obj);
							}
							var treeName = field + "Tree";
							page[treeName] = newData;
						} else {
							newData.push({
								type: 'treecombox',
								field: 'isUpBudget',
								idField: "code",
								textField: 'codeName',
								name: "是否采购",
								// width: 200,
								headalign: 'center',
								data: isUpBudgetData,
								className: 'nowrap isprint',
								align: 'center',
								render: function (rowid, rowdata, data) {
									return rowdata.isUpBudget;
								},
								//ZJGA820-1307【指标管理】--1.指标分解时，带入的指标要素信息不允许修改--zsj
								beforeExpand: function (sender, data) {
									//-1是不限制 0是明细级
									if ($.inArray('ISUPBUDGET', page.parentAssiArr) > -1) {
										$('#decompose-datatreecomboxisUpBudget').addClass('uf-combox-disabled');
										$('#decompose-datatreecomboxisUpBudget_input').attr('readonly', true);
										$('#decompose-datatreecomboxisUpBudget_popup').addClass('hide');
									} else {
										$(sender.sender).removeClass('uf-combox-disabled');
										$('#decompose-datatreecomboxisUpBudget_input').removeAttr('readonly');
										$('#decompose-datatreecomboxisUpBudget_popup').removeClass('hide');
									}
								}
							});
						}
					}
					page.setChildTable(extArr, result.data.itemList);
					$('#billHJJE').html("0.00");
					$('#decomposableAmt').html("0.00");
				});
			},
			//获取财政指标表格列
			getColumns: function () {
				var columns = [];
				columns = [{
						title: "指标编码",
						// width: 100,
						data: "bgItemCode",
						className: 'nowrap isprint BGasscodeClass',
						render: function (data, type, rowdata, meta) {
							if (!$.isNull(data)) {
								return '<span  rowindex="' + meta.row + '" >' + data + '</span>';
							} else {
								return '';
							}
						}
					},
					//ZJGA820-1671--财政指标分解模块的上方财政下达指标希望增加列单据日期--雪蕊：显示指标的录入日期，显示到编码列后面，只加在父表格--提交85、30，在30出补丁--zsj
					{
						title: "录入日期",
						// width: 80,
						data: "createDate",
            			className: 'nowrap isprint BGdateClass tc',
						render: function (data, type, rowdata, meta) {
							var dataDate = !$.isNull(data) ? data.split(' ')[0] : ''
							if (!$.isNull(data)) {
								return '<code  rowindex="' + meta.row + '" >' + dataDate + '</code>';
							} else {
								return '';
							}
						}
					},{
						// CWYXM-18408--指标年结涉及采购合同报销模块占用的指标结转完善
						title: "指标类型",
						// width: 200,
						data: "bgTypeName",
						className: 'nowrap isprint BGTenLen',
						"render": function (data, type, rowdata, meta) {
							if (!$.isNull(data)) {
								return '<code title="' + data + '">' + data + '</code>';
							} else {
								return '';
							}
						}
					},
					{
						title: '摘要',
						// width: 200,
						data: "bgItemSummary",
						className: 'nowrap isprint BGThirtyLen',
						"render": function (data, type, rowdata, meta) {
							if (!$.isNull(data)) {
								return '<code title="' + data + '">' + data + '</code>';
							} else {
								return '';
							}
						}
					}
				];
				if (!$.isNull(page.CZPlanData)) {
					if (page.CZPlanData.isComeDocNum == "是") {
						columns.push({
							title: "来文文号",
							// width: 200,
							data: "comeDocNum",
							className: 'nowrap isprint BGThirtyLen'
						});
					}
					if (page.CZPlanData.isSendDocNum == "是") {
						columns.push({
							title: page.sendCloName,
							// width: 200,
							data: "sendDocNum",
							className: 'nowrap isprint BGThirtyLen'
						});
          }
          if (page.CZPlanData.isFinancialBudget == "1") {
						columns.push({
							title: '财政指标ID',
							// width: 200,
							data: "bgItemIdMx",
							className: 'nowrap isprint BGThirtyLen'
						});
					}
					var codeArr = [];
					for (var z = 0; z < page.CZPlanData.planVo_Items.length; z++) {
						var code = page.CZPlanData.planVo_Items[z].eleCode;
						codeArr.push(code);
					}
					if ($.inArray('ISUPBUDGET', codeArr) > -1) {
						columns.push({
							data: 'isUpBudget',
							title: "是否采购",
							// width: 200,
							className: 'nowrap isprint tc'
						});
					}
					for (var i = 0; i < page.CZPlanData.planVo_Items.length; i++) {
						var item = page.CZPlanData.planVo_Items[i];
						var cbItem = item.eleCode;
						if (cbItem != 'ISUPBUDGET') {
							columns.push({
								data: page.shortLineToTF(item.eleFieldName) + 'Name',
								title: item.eleName,
								// width: 240,
								className: 'nowrap isprint BGThirtyLen',
								"render": function (data, type, rowdata, meta) {
									if (!$.isNull(data)) {
										return '<code title="' + data + '">' + data + '</code>';
									} else {
										return '';
									}
								}
							});
						}
          };
          //CWYXM-18080 编制指标时需要增加文本说明项，只录入文本，用于描述指标信息--zsj--查询条件区域
          for (var k = 0; k < page.CZPlanData.planVo_Txts.length; k++) {
            var fieldNew = page.shortLineToTF(page.CZPlanData.planVo_Txts[k].eleFieldName);
            columns.push({
							title: page.CZPlanData.planVo_Txts[k].eleName,
							// width: 200,
							data: fieldNew,
							className: 'nowrap isprint BGThirtyLen'
						});
          }
				}
				columns.push({
					title: "批复金额",
					// width: 100,
					data: "bgItemCur",
					className: 'nowrap tr isprint tdNum BGmoneyClass',
					render: $.fn.dataTable.render.number(',', '.', 2, ''),
					render: function (data, type, rowdata, meta) {
						var val = $.formatMoney(data);
						return val == 0 ? '' : val;
					}
				});
				columns.push({
					title: "分解金额",
					// width: 100,
					data: 'composeCur',
					className: 'nowrap tr isprint tdNum BGmoneyClass',
					render: $.fn.dataTable.render.number(',', '.', 2, ''),
					render: function (data, type, rowdata, meta) {
						var val = $.formatMoney(data);
						return val == 0 ? '' : val;
					}
				});
				columns.push({
					title: "调整金额",
					// width: 100,
					data: 'adjAndDispenseCur',
					className: 'nowrap tr isprint tdNum BGmoneyClass',
					render: $.fn.dataTable.render.number(',', '.', 2, ''),
					render: function (data, type, rowdata, meta) {
						var val = $.formatMoney(data);
						return val == 0 ? '' : val;
					}
				});
				columns.push({
					title: "余额",
					// width: 100,
					data: 'bgItemBalanceCur',
					className: 'nowrap tr isprint tdNum BGmoneyClass',
					render: $.fn.dataTable.render.number(',', '.', 2, ''),
					render: function (data, type, rowdata, meta) {
						var val = $.formatMoney(data);
						return val == 0 ? '' : val;
					}
				});
				return columns;
			},
			//初始化财政指标表格
			initGrid: function (data) {
        if($('#gridGOV').closest('.dataTables_wrapper').length > 0) {
					$('#gridGOV').closest('.dataTables_wrapper').ufScrollBar('destroy');
					oTable.fnDestroy();
				}
				var columns = page.getColumns();
				oTable = $("#gridGOV").dataTable({
					"language": {
						"url": bootPath + "agla-trd/datatables/datatable.default.js"
					},
					"autoWidth": false,
					"bDestory": true,
					"processing": true, //显示正在加载中
					"pagingType": "full_numbers", //分页样式
					"serverSide": false,  //ZJGA820-1672 财政指标分解模块也希望增加点击表头自动排序功能--zsj
					"ordering": true, 
					"scrollY": page.getHeight() - 44,
					"scrollX":true,
					"paging": false,
					"bInfo": false, //页脚信息
					"columns": columns,
					//填充表格数据
					data: data,
					"dom": '<"datatable-toolbar"B>rt<ilp>',
					buttons: [{
						extend: 'excelHtml5',
						text: '<i class="glyphicon icon-upload" aria-hidden="true"></i>',
						exportOptions: {
							columns: '.isprint'
						},
						customize: function (xlsx) {
							var sheet = xlsx.xl.worksheets['sheet1.xml'];
						}
					}],
					initComplete: function (settings, json) {
						$('.datatable-toolbar').appendTo('#dtToolbar');
						//CWYXM-15857 【20200430 财务云8.20.15】指标管理-财政指标界面有两个重叠的滚动条,具体见截图 --zsj
						// $('#gridGOV').closest('.dataTables_wrapper').ufScrollBar({
						// 	hScrollbar: true,
						// 	mousewheel: false
						// });
						// ufma.setBarPos($(window));
						$("#dtToolbar .buttons-excel").css("border-radius", "0 4px 4px 0").addClass("btn-export btn-permission").attr({
							"data-toggle": "tooltip",
							"title": "导出"
						});
						//导出begin
						$("#dtToolbar .buttons-excel").off().on('click', function (evt) {
							//ZJGA820-1778 财政指标模块中点击上方财政指标的导出按钮，系统界面出现问题--zsj
							evt = evt || window.event;
							evt.preventDefault();
							uf.expTable({
								title: '财政指标',
								exportTable: '#gridGOV'
							});
						});
						//导出end
						$('#dtToolbar [data-toggle="tooltip"]').tooltip();
						ufma.isShow(page.reslist);
						// $("#gridGOV").fixedTableHead();
						$(".dataTables_scrollBody").css("border-bottom", "1px solid #D9D9D9");
					},
					"drawCallback": function () {
						$('#gridGOV').find("td.dataTables_empty").text("")
							.append('<img src="' + bootPath + 'images/noData.png"/><br/><i>目前还没有你要查询的数据</i>');
						$("#check-head").prop('checked', false)
						$("#all").prop('checked', false);
						//登记出纳账页面表头可以拉动宽度
            // $('#gridGOV').tblcolResizable();
            ufma.setBarPos($(window));
						ufma.isShow(page.reslist);
					}
				});
			},
			//设置单位指标表格
			setChildTable: function (extArr, data) {
				page.parentAssiArr = [];
				for (var i = 0; i < page.CZPlanData.planVo_Items.length; i++) {
					var item = page.CZPlanData.planVo_Items[i];
					var cbItem = item.eleCode;
					page.parentAssiArr.push(cbItem)
				};
				var columns = page.getDmpCols(extArr);
				dgColumns = columns;
				curTableData = [];
				curTableData = data;
				$('#decompose-data').ufDatagrid({
					data: data,
					idField: 'bgItemCode', // 用于金额汇总
					disabled: false, // 可选择
					frozenStartColumn: 1, // 冻结开始列,从1开始
					frozenEndColumn: 2, // 冻结结束列
          paginate: true, // 分页
          columns: columns,
					editColumns: [1, 2, 3],
					toolbar: [{
            type: 'checkbox',
            class: 'check-all',
            text: '全选'
          },
          {
            type: 'button',
            class: 'btn-primary btn-add',
            text: '新增',
            action: function () {
              var tmpChrId = $('#agencyItems').getObj().getValue();
              if ($.isNull(tmpChrId)) {
                ufma.showTip("请先选择一个预算方案", null, "warning");
                return false;
              }
              if ($.isNull(selIndex) || $.isNull(allCZData[selIndex].bgItemCode)) {
                ufma.showTip("请先选择一条财政指标", null, "warning");
                return false;
              }
              // 新增一条指标
              ufma.get(
                dm.getCtrl("newBudgetItem") + "?agencyCode=" + agencyCode + "&setYear=" + page.setYear, {
                  "bgPlanChrId": page.DWPlanData.chrId,
                  "bgPlanChrCode": page.DWPlanData.chrCode,
                  "agencyCode": agencyCode,
                  "billType": '2',
                  "bgReserve": '2'
                },
                function (result) {
                  if (result.flag == "success") {
                    var rowData = result.data;
                    rowData.realBgItemCur = 0;
                    rowData.bgItemBalanceCur = 0;
                    rowData.status = "";
                    //指标分解子指标时，第一行带入的是父指标的各列信息，第二行时，需要带入上一行的信息，而不是父指标的内容；新增行时分解金额都默认为0，不要赋值；
                    if ($('#decompose-data').getObj().getData().length == 0) {
                      rowData.bgItemSummary = allCZData[selIndex].bgItemSummary;
                      rowData.sendDocNum = allCZData[selIndex].sendDocNum;
                      rowData.bgItemIdMx = allCZData[selIndex].bgItemIdMx;
                      if (!$.isNull(page.CZPlanData)) {
                        for (var i = 0; i < page.CZPlanData.planVo_Items.length; i++) {
                          var item = page.CZPlanData.planVo_Items[i];
                          var cbItem = item.eleCode;
                          var cbItemCode = page.shortLineToTF(item.eleFieldName);
                          var cbItemName = cbItemCode + 'Name';
                          if (cbItem == "ISUPBUDGET") {
                            rowData['isUpBudget'] = allCZData[selIndex]['isUpBudget'];
                          } else {
                            rowData[cbItemCode] = allCZData[selIndex][cbItemCode];
                            rowData[cbItemName] = allCZData[selIndex][cbItemName];
                          }
                        };
                      }
                      $('#decompose-data').getObj().add(rowData); // 取对象
                    } else {
                      //修改写法，向后台传参，以后台新增指标返回的对象为主，只修改要素和摘要值 guohx 20200103
                      var newRow = $('#decompose-data').getObj().getData();
                      if (!$.isNull(page.DWPlanData)) {
                        for (var i = 0; i < page.DWPlanData.planVo_Items.length; i++) {
                          var item = page.DWPlanData.planVo_Items[i];
                          var cbItem = item.eleCode;
                          var cbItemCode = page.shortLineToTF(item.eleFieldName);
                          var cbItemName = cbItemCode + 'Name';
                          if (cbItem == "ISUPBUDGET") {
                            rowData['isUpBudget'] = newRow[newRow.length - 1]['isUpBudget'];
                          } else {
                            rowData[cbItemCode] = newRow[newRow.length - 1][cbItemCode];
                            rowData[cbItemName] = newRow[newRow.length - 1][cbItemName];
                          }
                          rowData.bgItemSummary = newRow[newRow.length - 1].bgItemSummary;
                          rowData.sendDocNum = newRow[newRow.length - 1].sendDocNum;
                          rowData.bgItemIdMx = newRow[newRow.length - 1].bgItemIdMx;
                        };
                      }
                      $('#decompose-data').getObj().add(rowData); // 取对象
                    }
                    $('#billHJJE').html($.formatMoney(page.getRowsSum()));
                    $('#decomposableAmt').html($.formatMoney(page.totalBalanceCur - page.getRowsSum()));
                  }
                });
              page.adjGridTop($('#decompose-data'));
            }
          },
          {
            type: 'button',
            class: 'btn-default btn-save',
            text: '保存',
            action: function () {
              if ($.isNull(selIndex) || $.isNull(allCZData[selIndex].bgItemCode)) {
                ufma.showTip("请先选择一条财政指标", null, "warning");
                return false;
              }
              var billHJJE = 0.00;
              var items = [];
              var sendCount = 0; //根据系统选项判断发文文号是否必填
              //CWYXM-12743--与雪蕊姐沟通后确认：是否采购项为必填 --zsj
              var isUpBudgetCount = 0;
              var bgItemIdMxCount = 0; //CWYXM-17554 预算方案设置中，增加财政指标ID属性，可选择是否启用，启用时，选择预算方案新增指标时，需要录入指标id，指标id也需要参与指标的要素唯一性校验--zsj 
              var compireArr = [];
              for (var k = 0; k < page.DWPlanData.planVo_Items.length; k++) {
                compireArr.push(page.DWPlanData.planVo_Items[k].eleCode);
              }
              var hasIsUpBudget = false;
              if ($.inArray("ISUPBUDGET", compireArr) > -1) {
                hasIsUpBudget = true;
              }
              var tableData = JSON.parse(JSON.stringify($("#decompose-data").getObj().getData())); //改为深拷贝 20200103 不然会导致引用一致 guohx
              for (var i = 0; i < tableData.length; i++) {
                tableData[i].adjustDir = 1;
                tableData[i].bgCutCur = 0;
                tableData[i].checkCutCur = 0;
                tableData[i].bgItemParentid = allCZData[selIndex].bgItemId;
                tableData[i].bgItemParentcode = allCZData[selIndex].bgItemCode;
                //CWYXM-11697 --：预算方案中要素选择里，增加是否采购属性，启用之后，编制指标时可选是和否，不能输入其他值，采购模块选择指标时，根据这个属性过滤--zsj
                if ($.isNull(tableData[i].isUpBudget) && hasIsUpBudget == true) {
                  isUpBudgetCount++;
                } else {
                  if (tableData[i].isUpBudget == '是') {
                    tableData[i].isUpBudget = '1';
                  } else if (tableData[i].isUpBudget == '否') {
                    tableData[i].isUpBudget = '0';
                  }
                }
                //根据系统选项判断发文文号是否必填
                if ($.isNull(tableData[i].sendDocNum)) {
                  sendCount++;
                }
                //CWYXM-17554 预算方案设置中，增加财政指标ID属性，可选择是否启用，启用时，选择预算方案新增指标时，需要录入指标id，指标id也需要参与指标的要素唯一性校验--zsj
                if ($.isNull(tableData[i].bgItemIdMx)) {
                  bgItemIdMxCount++;
                }
                items.push(tableData[i]);
                billHJJE = billHJJE + ufma.parseFloat(tableData[i].bgItemCur);
              }
              if (tableData.length != 0) {
                allCZData[selIndex].adjustDir = 2;
                allCZData[selIndex].bgCutCur = billHJJE;
                allCZData[selIndex].checkCutCur = billHJJE;
                //CWYXM-20576 财政指标-新增后保存提示'源指标要素[是否采购]值与目标指标不一致',其实采购属性是一致的,具体见截图--zsj
                if (allCZData[selIndex].isUpBudget == '是') {
                  allCZData[selIndex].isUpBudget = '1';
                } else if (allCZData[selIndex].isUpBudget == '否') {
                  allCZData[selIndex].isUpBudget = '0';
                }
                items.unshift(allCZData[selIndex]);
              }
              //因为新增单元行取财政指标时,将余额赋值为0 所以需要重新从页面取值 guohx 20191230 判断选中的指标余额是否大于分解金额之和
              // var tempBal = $("#gridGOV tbody tr.sel-row-backcolor").find('td:last')[0].innerHTML;
              //根据系统选项判断发文文号是否必填
              if (page.DWPlanData.isSendDocNum == "是" && sendCount > 0 && page.needSendDocNum == true) {
                ufma.showTip('请输入' + page.sendCloName, function () {}, 'warning');
                return false;
              }
              //CWYXM-12743--与雪蕊姐沟通后确认：是否采购项为必填 --zsj
              if (isUpBudgetCount > 0) {
                ufma.showTip('请选择是否采购！', function () {}, 'warning');
                return false;
              }
              if (page.DWPlanData.isFinancialBudget == "1" && bgItemIdMxCount > 0 ) {
                ufma.showTip('请输入财政指标ID', function () {}, 'warning');
                return false;
              }
              if (page.totalBalanceCur >= billHJJE) {
                var argu = {
                  "agencyCode": agencyCode,
                  "setYear": page.setYear,
                  "rgCode": ptData.svRgCode,
                  "bgPlanId": $("#agencyItems").getObj().getValue(),
                  "bgItemParentid": bgItemId,
                  "billDate": ptData.svTransDate,
                  "billCur": billHJJE,
                  "items": items
                }
                ufma.showloading('数据保存中，请耐心等待...');
                ufma.post(dm.getCtrl('saveAgencyItems') + "?agencyCode=" + agencyCode + "&setYear=" + page.setYear, argu, function (result) {
                  ufma.hideloading();
                  if (result.flag == "success") {
                    ufma.showTip("保存成功", null, "success");
                    page.getOneItems(bgItemId);
                    page.initDWItems(bgItemId);
                  }
                });
              } else {
                ufma.showTip("分解指标金额之和不可大于待分解指标余额,请修改!", function () {}, "warning");
                return false;
              }
            }
          },
          {
            type: 'button',
            class: 'btn-default btn-audit',
            text: '审核',
            action: function () {
              var itemList = [];
              var tableData = $("#decompose-data").getObj().getCheckData();
              for (var i = 0; i < tableData.length; i++) {
                itemList.push({
                  "bgItemId": tableData[i].bgItemId
                });
              }
              if (!page.checkEdit()) {
                ufma.showTip("您有未保存的内容，请先保存！", function () {}, "warning")
                return false;
              }
              if (itemList.length == 0) {
                ufma.showTip("请先选择一条审核的指标！", function () {}, "warning");
                return false;
              }
              var argu = {
                "agencyCode": agencyCode,
                "setYear": page.setYear,
                "rgCode": ptData.svRgCode,
                "bgPlanId": $("#agencyItems").getObj().getValue(),
                "itemList": itemList
              }
              dm.cbbAuditBudgetItems(argu, function (result) {
                if (result.flag == "success") {
                  ufma.showTip("审核成功", null, "success");
                  //根据是否选中财政指标判断下面单位指标加载哪种数据来源
                  if ($.isNull(selIndex)) {
                    page.initItems();
                  } else {
                    page.initDWItems(bgItemId);
                  }
                }
              });
            }
          },
          {
            type: 'button',
            class: 'btn-default btn-unaudit',
            text: '销审',
            action: function () {
              var itemList = [];
              var tableData = $("#decompose-data").getObj().getCheckData();
              for (var i = 0; i < tableData.length; i++) {
                itemList.push({
                  "bgItemId": tableData[i].bgItemId
                });
              }
              if (!page.checkEdit()) {
                ufma.showTip("您有未保存的内容，请先保存！", function () {}, "warning")
                return false;
              }
              if (itemList.length == 0) {
                ufma.showTip("请先选择一条销审的指标!", function () {}, "warning");
                return false;
              }

              var argu = {
                "agencyCode": agencyCode,
                "setYear": page.setYear,
                "rgCode": ptData.svRgCode,
                "bgPlanId": $("#agencyItems").getObj().getValue(),
                "itemList": itemList
              }
              ufma.post(dm.getCtrl('cancelAuditAgencyItems') + "?agencyCode=" + agencyCode + "&setYear=" + page.setYear, argu, function (result) {
                if (result.flag == "success") {
                  ufma.showTip("销审成功", null, "success");
                  if ($.isNull(selIndex)) {
                    page.initItems();
                  } else {
                    page.initDWItems(bgItemId);
                  }
                }
              });
            }
          }
					],
					initComplete: function (options, data) {
						$('#decompose-data tr').on('click', '.btn-log', function (e) {
							e.stopPropagation();
							var rowid = $(this).closest('tr').attr('id');
							var rowData = $('#decompose-data').getObj().getRowByTId(rowid);
							_bgPub_showLogModal("financeItem", {
								"bgBillId": rowData.billId,
								"bgItemCode": rowData.bgItemCode,
								"agencyCode": agencyCode
							});
						});
						page.adjGridTop($('#decompose-data'));
						ufma.isShow(reslist);
					},
					//已审核的行锁定 不可修改
					lock: { //行锁定
						class: 'bgc-gray2',
						filter: function (rowdata) {
							//未选中财政指标，下方单位指标不可编辑 删除 guohx
							if ($.isNull(selIndex)) {
								return rowdata.bgItemId != "";
							} else {
								return rowdata.status == 3;
							}

						}
          }
				});

				ufma.isShow(reslist);
			},
			//取分解表头
			getDmpCols: function (extArr) {
				var column = [ // 支持多表头
					{
						type: 'checkbox',
						field: '',
						name: '',
						width: 40,
						className: 'no-print',
						headalign: 'center',
						align: 'center'
					},
					{
						type: 'toolbar',
						field: 'option',
						name: '操作',
						className: 'no-print nowrap',
						width: 80,
						headalign: 'center',
						render: function (rowid, rowdata, data, meta) {
							if (rowdata.status == '3' || $.isNull(selIndex)) { //如果为已审核单子或者是未选中财政指标的情况，不可删除 guohx
								return '<button class="btn btn-log btn-watch-detail " data-toggle="tooltip"  title="日志"><span class="icon-log"></span></button>';
							} else if (rowdata.status == '1') {
								return '<button class="btn btn-log btn-watch-detail " data-toggle="tooltip"  title="日志"><span class="icon-log"></span></button>' +
									'<button class="btn btn-del btn-delete icon-trash" data-toggle="tooltip" title="删除"></button>';
							} else {
								//新增的状态为空，没有审核按钮
								return '<button class="btn btn-del btn-delete icon-trash" data-toggle="tooltip" title="删除"></button>';
							}
						}
					},
					{
						// type: 'input',
						field: 'status',
						name: '状态',
						width: 100,
						className: 'tc nowrap BGstatusClass',
            headalign: 'center',
            border: '1',
						"render": function (rowid, rowdata, data, meta) {
							if ($.isNull(data)) {
								return '';
							} else if (data == "1") {
								return "未审核";
							} else {
								return "已审核";
							}
						}
					},
					{
						// type: 'input',
						field: 'bgItemCode',
						name: '指标编码',
						width: 120,
						className: 'nowrap BGasscodeClass',
						headalign: 'center'
					},{
						// CWYXM-18408--指标年结涉及采购合同报销模块占用的指标结转完善
						field: 'bgTypeName',
						name: '指标类型',
						className: 'nowrap BGTenLen',
						width: 200,
            			headalign: 'center',
						"render": function (rowid, rowdata, data, meta) {
							if (!$.isNull(data)) {
								return '<code title="' + data + '">' + data + '</code>';
							} else {
								return '';
							}
						}
					},
					{
						type: 'input',
						field: 'bgItemSummary',
						name: '摘要',
						className: 'nowrap BGThirtyLen',
						width: 200,
            			headalign: 'center',
						"render": function (rowid, rowdata, data, meta) {
							if (!$.isNull(data)) {
								return '<code title="' + data + '">' + data + '</code>';
							} else {
								return '';
							}
						}
					}
				];
        var fzcolumn = [];
				if (!$.isNull(page.DWPlanData)) {
					var codeArr = [];
					for (var z = 0; z < page.DWPlanData.planVo_Items.length; z++) {
						var code = page.DWPlanData.planVo_Items[z].eleCode;
						codeArr.push(code);
					}
					if (page.DWPlanData.isComeDocNum == "是") {
						column.push({
							type: 'input',
							field: 'comeDocNum',
							name: '来文文号',
							className: 'nowrap BGThirtyLen',
							width: 200,
               					headalign: 'center',
							"render": function (rowid, rowdata, data, meta) {
								if (!$.isNull(data)) {
								return '<code title="' + data + '">' + data + '</code>';
								} else {
								return '';
								}
							}
						});
					}

					if (page.CZPlanData.isSendDocNum == "是" && page.DWPlanData.isSendDocNum == "是") {
						column.push({
							//ZJGA820-1380【指标管理】--[财政指标]在单位指标部分点击新增之后，“发文文号”和“是否采购”不会自动带下来，需要能够带下来，并且不能够修改--zsj
							//type: 'input',
							field: 'sendDocNum',
							name: page.sendCloName,
							className: 'nowrap BGThirtyLen',
							width: 200,
            				headalign: 'center',
							"render": function (rowid, rowdata, data, meta) {
								if (!$.isNull(data)) {
								return '<code title="' + data + '">' + data + '</code>';
								} else {
								return '';
								}
							}

						});
					} else if (page.CZPlanData.isSendDocNum == "否" && page.DWPlanData.isSendDocNum == "是") {
						column.push({
							//ZJGA820-1380【指标管理】--[财政指标]在单位指标部分点击新增之后，“发文文号”和“是否采购”不会自动带下来，需要能够带下来，并且不能够修改--zsj
							type: 'input',
							field: 'sendDocNum',
							name: page.sendCloName,
							className: 'nowrap BGThirtyLen',
							width: 200,
           				    headalign: 'center',
							"render": function (rowid, rowdata, data, meta) {
								if (!$.isNull(data)) {
								return '<code title="' + data + '">' + data + '</code>';
								} else {
								return '';
								}
							}
						});
          }
          if (page.CZPlanData.isFinancialBudget == "1" && page.DWPlanData.isFinancialBudget == "1") {
						column.push({
							field: 'bgItemIdMx',
							name:  '财政指标ID',
							className: 'nowrap BGThirtyLen',
							width: 200,
              headalign: 'center',
							"render": function (rowid, rowdata, data, meta) {
                if (!$.isNull(data)) {
                  return '<code title="' + data + '">' + data + '</code>';
                } else {
                  return '';
                }
							}

						});
					} else if (page.CZPlanData.isFinancialBudget == "0" && page.DWPlanData.isFinancialBudget == "1") {
						column.push({
							type: 'input',
							field: 'bgItemIdMx',
							name:  '财政指标ID',
							className: 'nowrap BGThirtyLen',
							width: 200,
              headalign: 'center',
							"render": function (rowid, rowdata, data, meta) {
                if (!$.isNull(data)) {
                  return '<code title="' + data + '">' + data + '</code>';
                } else {
                  return '';
                }
							}
						});
          }
					if ($.inArray('ISUPBUDGET', codeArr) > -1) {
						if ($.inArray('ISUPBUDGET', page.parentAssiArr) > -1) {
							column.push({
								field: 'isUpBudget',
								name: "是否采购",
								// width: 200,
                headalign: 'center',
                align: 'center',
                className: 'nowrap',
								"render": function (rowid, rowdata, data, meta) {
									if (!$.isNull(data)) {
										return data;
									} else {
										return '';
									}
								}
							});
						} else {
							column.push({
								type: 'treecombox',
								field: 'isUpBudget',
								idField: "code",
								textField: 'codeName',
								name: "是否采购",
								// width: 200,
                headalign: 'center',
                align: 'center',
                data: isUpBudgetData,
                className: 'nowrap isprint',
								render: function (rowid, rowdata, data) {
									return rowdata.isUpBudget;
								}
							});
						}

          }
          for (var i = 0; i < extArr.length; i++) {
            var eleCode = extArr[i].eleCode;
            var fName = extArr[i].eleName;
            var field = page.shortLineToTF(extArr[i].eleFieldName);
            var eleLevel = extArr[i].eleLevel;
            if (eleCode != 'ISUPBUDGET') {
              //CWYXM-11999 财政指标,点击财政指标会弹出'单位指标未保存提示'--zsj
              if ($.inArray(field, compireCol) === -1) {
                compireCol.push(field);
              }
              fzcolumn.push(page.expandData(eleCode, fName, field, eleLevel));
            }
          }
          //CWYXM-18080 编制指标时需要增加文本说明项，只录入文本，用于描述指标信息--zsj--查询条件区域
          for (var k = 0; k < page.DWPlanData.planVo_Txts.length; k++) {
            var fieldNew = page.shortLineToTF(page.DWPlanData.planVo_Txts[k].eleFieldName);
            column.push({
              type: 'input',
              field: fieldNew,
              name: page.DWPlanData.planVo_Txts[k].eleName ,
              className: 'nowrap BGThirtyLen',
              width: 200,
              headalign: 'center',
              "render": function (rowid, rowdata, data, meta) {
                if (!$.isNull(data)) {
                  return '<code title="' + data + '">' + data + '</code>';
                } else {
                  return '';
                }
              }
            });
          }
				}
				var lastcolumn = [{
          type: 'money',
          //bgCWYXM-4518--指标分解自动生成的分解金额应等于待分解金额，目前未包含调剂金额--zsj
          field: 'bgItemCur',
          name: '金额',
          width: 150,
          align: 'right',
          headalign: 'center',
          className: 'tc nowrap BGmoneyClass',
          "render": function (rowid, rowdata, data, meta) {
            if (!$.isNull(data)) {
              return '<code title="' + data + '">' + $.formatMoney(data, 2) + '</code>';
            } else {
              return '';
            }
          },
          onKeyup: function (e) {
            $('#billHJJE').html($.formatMoney(page.getRowsSum()));
            $('#decomposableAmt').html($.formatMoney(page.totalBalanceCur - page.getRowsSum()));
          }
        }, 
              //暂时支持两层分解--赵雪蕊--zsj
                  // {
        // 	type: 'money',
        // 	field: 'composeCur',
        // 	name: '分解金额',
        // 	width: 150,
        // 	align: 'right',
        // 	headalign: 'center',
        // 	"render": function (rowid, rowdata, data, meta) {
        // 		if (!$.isNull(data)) {
        // 			return '<code title="' + data + '">' + $.formatMoney(data, 2) + '</code>';
        // 		} else {
        // 			return '';
        // 		}
        // 	}
        // },
        {
          type: 'money',
          field: 'adjAndDispenseCur',
          name: '调整金额',
          width: 150,
          align: 'right',
          headalign: 'center',
          className: 'tc nowrap BGmoneyClass',
          "render": function (rowid, rowdata, data, meta) {
            if (!$.isNull(data)) {
              return '<code title="' + data + '">' + $.formatMoney(data, 2) + '</code>';
            } else {
              return '';
            }
          }
        },
        {
          type: 'money',
          field: 'bgItemBalanceCur',
          name: '余额',
          width: 150,
          align: 'right',
          headalign: 'center',
          className: 'tc nowrap BGmoneyClass',
          "render": function (rowid, rowdata, data, meta) {
            if (!$.isNull(data)) {
              return '<code title="' + data + '">' + $.formatMoney(data, 2) + '</code>';
            } else {
              return '';
            }
          }
        }

			];
				column = column.concat(fzcolumn).concat(lastcolumn);
				return [column];
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

			//动态获取两个表格的高度
			getHeight: function () {
				var height = $(window).height() - $(".workspace-top").height() - $(".btn-body").height() - 50 - 25;
				return height / 2;
			},
			//调整分解子指标的高度
			adjGridTop: function ($table) {
				//不能去掉延迟，不然会取不到表格对象
				$.timeOutRun(null, null, function () {
					$table.getObj().setBodyHeight(page.getHeight());
				}, 20);
			},
			//获取分解子指标的金额之和
			getRowsSum: function () {
				var rowsSum = $('#decompose-data').getObj().getData();
				var sum = 0.00;
				for (var i = 0; i < rowsSum.length; i++) {
					if (!$.isNull(rowsSum[i].bgItemCur)) {
						sum = sum + parseFloat(rowsSum[i].bgItemCur);
					}
				}
				return sum;
			},
			//组织扩展项的数据
			expandData: function (eleCode, fName, field, eleLevel) {
				var ele = field;
				var fText = ele + "Name";
				var fId = ele;
				var eleTree = ele + "Tree";
				var dataTree = page[eleTree];
				var colObj = {
					type: 'treecombox',
					field: fId,
					name: fName,
					idField: fId,
					textField: fText,
					data: dataTree,
					width: 200,
					headalign: 'center',
					className: 'nowrap BGThirtyLen',
					leafRequire: false,
					onChange: function (e) {},
					//ZJGA820-1307【指标管理】--1.指标分解时，带入的指标要素信息不允许修改--zsj
					beforeExpand: function (sender, data) {
						//-1是不限制 0是明细级
						if (eleLevel == '0') {
							if ($.inArray(eleCode, page.parentAssiArr) > -1) {
								$('#decompose-datatreecombox' + fId).addClass('uf-combox-disabled');
								$('#decompose-datatreecombox' + fId + '_input').attr('readonly', true);
								$('#decompose-datatreecombox' + fId + '_popup').addClass('hide');
							} else {
								$(sender.sender).removeClass('uf-combox-disabled');
								$('#decompose-datatreecombox' + fId + '_input').removeAttr('readonly');
								$('#decompose-datatreecombox' + fId + '_popup').removeClass('hide');
							}

						} else {
							$(sender.sender).removeClass('uf-combox-disabled');
							$('#decompose-datatreecombox' + fId + '_input').removeAttr('readonly');
							$('#decompose-datatreecombox' + fId + '_popup').removeClass('hide');
						}
					},
					"render": function (rowid, rowdata, data, meta) {
            if (!$.isNull(data)) {
              return '<code title="' + rowdata[fText] + '">' + rowdata[fText] + '</code>';
            } else {
              return '';
            }
					}
				}
				return colObj;
			},
			//去除千分位中的‘，’
			delcommafy: function (num) {
				if (num && num != 'undefined' && num != 'null') {
					var numS = num;
					numS = numS.toString();
					numS = numS.replace(/,/gi, '');
					return numS;
				} else {
					return num;
				}
			},
			//查找一条父指标的值，回写余额和分解金额 
			getOneItems: function (bgItemId) {
				var argu = {
					"agencyCode": agencyCode,
					"bgItemType": "2",
					"bgReserve": 1,
					"status": 3,
					"setYear": page.setYear,
					"chrId": $("#cbBgPlan").getObj().getValue(),
					"bgItemId": bgItemId
				}
				ufma.ajaxDef(dm.getCtrl("getBudgetItems") + "?setYear=" + page.setYear + "&rgCode=" + ptData.svRgCode, "post", argu, function (result) {
					var bgItemBalCur = $.formatMoney(result.data.billWithItemsVo[0].billWithItems[0].bgItemBalanceCur);
					var composeCur = $.formatMoney(result.data.billWithItemsVo[0].billWithItems[0].composeCur);
					$("#gridGOV tbody tr.sel-row-backcolor").find('td:last').eq(0).html(bgItemBalCur);
					var tdLength = $("#gridGOV tbody tr.sel-row-backcolor").find('td').length - 3;
					$("#gridGOV tbody tr.sel-row-backcolor").find('td').eq(tdLength).eq(0).html(composeCur);
					if (!$.isNull(selIndex)) {
						allCZData[selIndex].bgItemBalanceCur = bgItemBalCur;
					}
				});
			},
			//校验是否编辑过
			checkEdit: function () {
				if ($.isNull(page.DWPlanData)) {
					return true;
				} else {
					//CWYXM-11999 财政指标,点击财政指标会弹出'单位指标未保存提示'--zsj
					var tmpData = $("#decompose-data").getObj().getData();
					var tmpDataComp = [];
					for (var i = 0; i < tmpData.length; i++) {
						var tmpArr = {};
						for (var x = 0; x < compireCol.length; x++) {
							var colName = compireCol[x];
							if (tmpData[i][colName]) {
								tmpArr[colName] = tmpData[i][colName]
							}
						}
						tmpDataComp.push(tmpArr);
					}
					var curDataComp = [];
					for (var i = 0; i < curTableData.length; i++) {
						var curArr = {};
						for (var x = 0; x < compireCol.length; x++) {
							var colName = compireCol[x];
							if (curTableData[i][colName]) {
								curArr[colName] = curTableData[i][colName]
							}
						}
						curDataComp.push(curArr);
					}

					var bEdit = (JSON.stringify(curDataComp) == JSON.stringify(tmpDataComp));
					//var bEdit = (JSON.stringify(curTableData) == JSON.stringify(tmpData))
					if (curTableData.length == 0 && tmpData.length == 0) return true;
					return bEdit;
					// if (istitle == 1) return true;
					//return bEdit;
				}
			},
			onEventListener: function () {
				$("[data-toggle='tooltip']").tooltip();
				ufma.searchHideShow($('#gridGOV'), $("#searchHideBtnCZ"));
				ufma.searchHideShow($('#decompose-data'), $("#searchHideBtnDW"));
				//选中父指标刷新下面子指标表格
				$(document).on('click', "#gridGOV tbody tr", function (e) {
					var rowIndex = $(this).find("td").eq(0).find("span").attr('rowindex');
					selIndex = rowIndex;
					var $this = $(this);
					if (rowIndex) {
						bgItemId = allCZData[selIndex].bgItemId;
						if (!page.checkEdit()) {
							ufma.confirm('您有未保存的单位指标，确认离开吗？', function (action) {
								if (action) { //确认
									//再点击同一行时行加深取消，同时取消财政指标的选择，下方待分解金额置为0
									if ($this.hasClass("sel-row-backcolor")) {
										$this.removeClass("sel-row-backcolor");
										$("#selBgItemCode").html("");
										selIndex = "";
										$('#billHJJE').html("0.00");
										$('#decomposableAmt').html("0.00");
										page.initItems();
									} else if ($this.siblings('.sel-row-backcolor').length != 0) {
										$this.siblings('.sel-row-backcolor').removeClass("sel-row-backcolor");
										$this.addClass("sel-row-backcolor");
										$("#selBgItemCode").html(allCZData[selIndex].bgItemCode);
									} else { //只能选中一个给背景颜色 
										$this.addClass("sel-row-backcolor");
										$("#selBgItemCode").html(allCZData[selIndex].bgItemCode);
									}
									page.initDWItems(bgItemId);
								} else { //取消
									$('#cbBgPlan').getObj().val(CZPlanId);
								}
							}, {
								type: 'warning'
							});
						} else {
							//再点击同一行时行加深取消，同时取消财政指标的选择，下方待分解金额置为0
							if ($(this).hasClass("sel-row-backcolor")) {
								$(this).removeClass("sel-row-backcolor");
								$("#selBgItemCode").html("");
								selIndex = "";
								$('#billHJJE').html("0.00");
								$('#decomposableAmt').html("0.00");
								page.initItems();
							} else if ($(this).siblings('.sel-row-backcolor').length != 0) {
								$(this).siblings('.sel-row-backcolor').removeClass("sel-row-backcolor");
								$(this).addClass("sel-row-backcolor");
								$("#selBgItemCode").html(allCZData[selIndex].bgItemCode);
							} else { //只能选中一个给背景颜色 
								$(this).addClass("sel-row-backcolor");
								$("#selBgItemCode").html(allCZData[selIndex].bgItemCode);
							}
							page.initDWItems(bgItemId);
						}
					}
				});
				//状态列,余额列,调整金额列,分解金额列不可编辑只可查看
				//guohx  修改 页面初始化的时候没有#decompose-data该元素，故用document写法
				$(document).on("click", "#decompose-data", function () {
					$("#decompose-data").find('input[name="status"]').attr('disabled', true);
					$("#decompose-data").find('input[name="composeCur"]').attr('disabled', true);
					$("#decompose-data").find('input[name="adjAndDispenseCur"]').attr('disabled', true);
					$("#decompose-data").find('input[name="bgItemBalanceCur"]').attr('disabled', true);
					$("#decompose-data").find('input[name="bgItemCode"]').attr('disabled', true);
				});
				//删除子指标一行
				$(document).on('mousedown', '#decompose-data .btn-delete', function (e) {
					e.stopPropagation();
					var rowid = $(this).closest('tr').attr('id');
					var obj = $('#decompose-data').getObj(); // 取对象
					ufma.confirm('您确定要删除选中的行数据吗？', function (action) {
						if (action) {
							obj.del(rowid);
							$('#billHJJE').html($.formatMoney(page.getRowsSum()));
							$('#decomposableAmt').html($.formatMoney(page.totalBalanceCur - page.getRowsSum()));
						}
					}, {
						type: 'warning'
					});

				});
				//导出
        $('#export').on("click", function (evt) {
          //ZJGA820-1778 财政指标模块中点击上方财政指标的导出按钮，系统界面出现问题--zsj
          evt = evt || window.event;
          evt.preventDefault();
					var expCols = dgColumns[0].select(function (el, i, res, param) {
						return $.isNull(el.className) || el.className.indexOf('no-print') == -1;
          });
					uf.expTable({
						title: '财政指标',
						data: $('#decompose-data').getObj().getData(),
						columns: [expCols]
					});
				});
				//金额失去鼠标焦点
				$(document).on("blur", "#decompose-data tbody td[name='bgItemCur']", function () {
					$('#billHJJE').html($.formatMoney(page.getRowsSum()));
					$('#decomposableAmt').html($.formatMoney(page.totalBalanceCur - page.getRowsSum()));
				});
				$(document).on("focus", "#decompose-data tbody td[name='sendDocNum']", function () {
					if (page.CZPlanData.isSendDocNum == "是") {
						$('#decompose-datainputsendDocNum').attr('readOnly', true);
					} else {
						$('#decompose-datainputsendDocNum').removeAttr('readOnly');
					}
        });
        $(document).on("focus", "#decompose-data tbody td[name='bgItemIdMx']", function () {
					if (page.CZPlanData.isSendDocNum == "是") {
						$('#decompose-datainputbgItemIdMx').attr('readOnly', true);
					} else {
						$('#decompose-datainputbgItemIdMx').removeAttr('readOnly');
					}
				});
				//导入
				$('#import').on('click', function () {
				// CWYXM-19618 --财政指标点击导入前端报错,具体见截图--zsj
          if ($.isNull($("#cbBgPlan").getObj().getValue())) {
						ufma.showTip('请选择财政指标预算方案！', function () {},'warning');
						return false;
          } else if ($.isNull($("#agencyItems").getObj().getValue())) {
						ufma.showTip('请选择单位指标预算方案！', function () {},'warning');
						return false;
					} else {
            ufma.open({
              url: 'importItem.html',
              title: '导入单位指标',
              width: 1090,
              data: {
                "agencyCode": agencyCode,
                "agencyName": agencyName,
                "setYear": page.setYear,
                "rgCode": ptData.svRgCode,
                "DWPlanData": page.DWPlanData,
                "needSendDocNum": page.needSendDocNum,
                //CWYXM-184070---财政指标界面导入单位指标时，可以不填写与父指标相同的要素，导入模版中不显示对应的列--zsj
                'financeBudgetPlanId': $('#cbBgPlan').getObj().getValue()
              },
              ondestory: function (data) {
                // // CWYXM-16224-- 财政指标,如果导入的指标id和财政指标ID不一致也能导入成功,但是新增的单位指标的指标id就和导入的一样了--zsj
                // if(data.length > 0) {
                //     for(var j = 0;j<data.length;j++){
                //         var dataOne = data[j]
                //         $('#decompose-data').getObj().add(dataOne);
                //     }
                //     $('#billHJJE').html($.formatMoney(page.getRowsSum()));
                //     $('#decomposableAmt').html($.formatMoney(page.totalBalanceCur - page.getRowsSum()));
                // CWYXM-16224-- 财政指标,如果导入的指标id和财政指标id不一致也能导入成功,但是新增的单位指标的指标id就和导入的一样了--zsj
                for(var j = 0;j<data.length;j++){
                  var dataOne = data[j]
                  var rowData =  {}
                  if (!$.isNull(page.DWPlanData)) {
                    for (var i = 0; i < page.DWPlanData.planVo_Items.length; i++) {
                        var item = page.DWPlanData.planVo_Items[i];
                        var cbItem = item.eleCode;
                        var cbItemCode = page.shortLineToTF(item.eleFieldName);
                        var cbItemName = cbItemCode + 'Name';
                        if (cbItem == "ISUPBUDGET") {
                            rowData['isUpBudget'] = dataOne['isUpBudget'];
                        } else {
                            rowData[cbItemCode] = dataOne[cbItemCode];
                            rowData[cbItemName] = dataOne[cbItemName];
                        }
                        rowData.bgItemCode = dataOne.bgItemCode;
                        rowData.bgItemSummary = dataOne.bgItemSummary;
                        rowData.sendDocNum = dataOne.sendDocNum;
                        rowData.status = dataOne.status;
                        rowData.composeCur = dataOne.composeCur;
                        rowData.bgItemCur = dataOne.bgItemCur;
                        rowData.adjAndDispenseCur = dataOne.adjAndDispenseCur;
                        rowData.bgItemBalanceCur = dataOne.bgItemBalanceCur;
                    };
                    rowData = $.extend(dataOne, rowData);
                    $('#decompose-data').getObj().add(rowData);
                  }
                }
              }
            })
          }
				});
			},
			//初始化页面
			initPage: function () {
				page.reslist = ufma.getPermission();
				ufma.isShow(page.reslist);
				page.nowDate = ptData.svTransDate; //当前年月日
				page.setYear = parseInt(ptData.svSetYear); //本年 年度
				page.month = ptData.svFiscalPeriod; //本期 月份
				page.today = ptData.svTransDate; //今日 年月日
				page.initGrid();
				page.initAgencyScc();
			},
			//此方法必须保留
			init: function () {
				reslist = ufma.getPermission();
				ufma.isShow(reslist);
				ptData = ufma.getCommonData();
				this.initPage();
				this.onEventListener();
				ufma.parseScroll();
				ufma.parse();
				var timeId = setTimeout(function () {
					for (var i = 0; i < $('input').length; i++) {
						$('input:not([autocomplete]),textarea:not([autocomplete]),select:not([autocomplete])').attr('autocomplete', 'off');
					}
					clearTimeout(timeId);
				}, 500);
				page.totalBalanceCur = 0;
			}
		}
	}();

	/////////////////////
	page.init();
});