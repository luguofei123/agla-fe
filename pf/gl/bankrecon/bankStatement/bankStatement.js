$(function () {
	var dgColumns, dgData, extendData;
	var page = function () {
		//银行对账单接口
		var portList = {
			agencyList: "/gl/eleAgency/getAgencyTree", //单位列表接口
			accScheList: "/gl/bank/recon/getBankReconSche", //方案列表接口
			getBankExtends: "/gl/bank/statement/getBankExtends", //获取对账单扩展字段
			accItemTree: "/gl/common/glAccItemData/getAccItemTree", //辅助项内容树
			getBankStatement: "/gl/bank/statement/getBankStatement", //查询对账单
			saveBankStatement: "/gl/bank/statement/saveBankStatement", //保存对账单	
			delBankStatement: "/gl/bank/statement/delBankStatement"//删除对账单
		};

		return {
			namespace: 'bankState',
			get: function (tag) {
				return $('#' + this.namespace + ' ' + tag);
			},
			//获取辅助项内容树
			reqAccItemTree: function (accItemCode, field) {
				var argu = {
					"agencyCode": page.cbAgency.getValue(),
					"eleCode": accItemCode
				};
				ufma.ajaxDef(portList.accItemTree, "get", argu, function (result) {
					if (accItemCode == "PROJECT") {
						extendData = result.data;
					}
					var data = result.data;
					var newData = [];
					var ele = field;
					for (var i = 0; i < data.length; i++) {
						var obj = {};
						var name = ele + "Name";
						var code = ele + "Code";
						var codeName = ele + "CodeName";
						obj[ele] = data[i].id;
						obj[code] = data[i].id;
						obj[codeName] = data[i].codeName;
						obj[name] = data[i].codeName;
						obj["pId"] = data[i].pId;
						newData.push(obj);
					}
					var treeName = ele + "Tree";
					page[treeName] = newData;
				});
			},

			//获取对账方案列表
			reqMethod: function () {
				var argu = {
					"agencyCode": page.agencyCode
				}
				ufma.get(portList.accScheList, argu, function (result) {
					var data = result.data;
					$("#accScheList").ufCombox({
						data: data
					});
					if (data.length > 0) {
						$("#accScheList").getObj().val(data[0].schemaGuid);
						page.schemaGuid = data[0].schemaGuid;
						//page.showExtTable();
						page.queryData("");
					}
				})
			},
			//获取数据
			getStatementData: function (bankFixedArr) {
				var argu = {
					"schemaGuid": page.schemaGuid,
					"agencyCode": page.agencyCode,
					"endDate": page.dateEnd,
					"isBalanceAcc": page.isBalanceAcc
				};
				var url = "/gl/bank/getStatement";
				var callback = function (result) {
					page.newZongStatementTables(bankFixedArr, result.data);
					page.newHengStatementTables(bankFixedArr, result.data);
				};
				$.ufajax(url, 'get', argu, callback);

			},
			//单选按钮组
			raidoBtnGroup: function (btnGroupClass) {
				$("#" + page.namespace).find("." + btnGroupClass).on("click", function () {
					if ($(this).hasClass("selected")) {
						$(this).siblings().removeClass("selected");
					} else {
						$(this).addClass("selected");
						$(this).siblings().removeClass("selected");
					}
				})
			},

			//返回本期时间
			dateBenQi: function (startId, endId) {
				var ddYear = page.setYear;
				var ddMonth = page.month - 1;
				var tdd = new Date(ddYear, ddMonth + 1, 0)
				var ddDay = tdd.getDate();
				$("#" + startId).getObj().setValue(new Date(ddYear, ddMonth, 1));
				$("#" + endId).getObj().setValue(new Date(ddYear, ddMonth, ddDay));
			},
			//返回本年时间
			dateBenNian: function (startId, endId) {
				var ddYear = page.setYear;
				$("#" + startId).getObj().setValue(new Date(ddYear, 0, 1));
				$("#" + endId).getObj().setValue(new Date(ddYear, 11, 31));
			},
			//返回今日时间
			dateToday: function (startId, endId) {
				var mydate = new Date(pfData.svTransDate);
				Year = mydate.getFullYear();
				Month = (mydate.getMonth() + 1);
				Month = Month < 10 ? ('0' + Month) : Month;
				Day = mydate.getDate();
				Day = Day < 10 ? ('0' + Day) : Day;
				$('#dateStart').getObj().setValue(Year + '-' + Month + '-' + Day);
				$('#dateEnd').getObj().setValue(Year + '-' + Month + '-' + Day);
			},
			adjGridTop: function () {
				var gridTop = $('#bankDataGrid').offset().top;
				var gridHeight = $(window).height() - gridTop - 130;
				$('#bankDataGrid').getObj().setBodyHeight(gridHeight);

			},
			//初始化表格
			initTable: function (id, data, colArr) {
				dgColumns = colArr;
				dgData = data;
				$('#' + id).ufDatagrid({
					data: data,
					disabled: false, //可选择
					frozenStartColumn: 1, //冻结开始列,从1开始
					frozenEndColumn: 1, //冻结结束列	
					columns: [colArr],
					initComplete: function (options, data) {
						var wid = $("#bankDataGridtreecomboxisBalanceAccName").width();
						$("#bankDataGridtreecomboxisBalanceAccName_popup").width(parseInt(wid + 4));
						$("#bankDataGridtreecomboxisBalanceAccName_popup .ufmaTree.ztree li a").css("min-width", "60px");

						for (var i = 0; i < data.length; i++) {
							var $trShow = $(".uf-grid-body-view .uf-grid-table #" + id + "_row_" + (i + 1));
							var $trShowTd = $trShow.find("td:not([name='statementGuid'])");
							if (data[i].isBalanceAcc == "1") {
								if (!$trShowTd.hasClass("bgc-gray2")) {
									$trShowTd.addClass("bgc-gray2");
									$trShowTd.click(function () {
										return false;
									});
								};
							}
						}
					},
					lock: { //行锁定
						class: 'bgc-gray2',
						filter: function (rowdata) { }
					}
				});
				this.adjGridTop();
				ufma.isShow(page.reslist);
			},

			//根据对账方案显示扩展表格
			// showExtTable: function () {
			// 	var extArgu = {
			// 		"schemaGuid": page.schemaGuid
			// 	};
			// 	ufma.ajaxDef(portList.getBankExtends, "get", extArgu, function (result) {
			// 		var data = result.data;
			// 		var extArr = data.extendTableHeadList;
			// 		var bankData = [];
			// 		page.loadTableData(extArr, bankData);
			// 	});
			// },

			//加载表格数据
			loadTableData: function (extArr, bankData) {
				var extCol = [];
				for (var i = 0; i < extArr.length; i++) {
					var eleCode = extArr[i].eleCode;
					var fName = extArr[i].showName;
					var field = extArr[i].extendField;
					if (eleCode == 'RELATION') { //项目关联号
						var colObj = {
							type: 'input',
							field: field,
							name: fName,
							width: 100,
							headalign: 'center'
						}
						extCol.push(colObj);
					} else if (eleCode == 'PROJECT') { //项目
						extCol.push(page.organizeProData(eleCode, fName, field));
					} else {
						extCol.push(page.organizeData(eleCode, fName, field));
					}
				}
				var allColArr = page.bankFixedArr.concat(extCol).concat(page.bankFixedOptArr)
				page.printColArr = allColArr;
				page.initTable('bankDataGrid', bankData, allColArr);
			},
			//组织项目数据
			organizeProData: function (eleCode, fName, field) {
				var ele = field;
				var fCodeName = ele + "CodeName";
				var fCode = ele + "Code";
				var fText = ele + "Name";
				var fId = ele;
				// page.reqAccItemTree(eleCode, field);
				var eleTree = ele + "Tree";
				var dataTree = page[eleTree];
				var colObj = {
					type: 'treecombox',
					field: fId,
					name: fName,
					width: 200,
					headalign: 'center',
					idField: fId,
					textField: fText,
					data: dataTree,
					leafRequire: false,
					onChange: function (e) {
						for (var i = 0; i < extendData.length; i++) {
							if (extendData[i].code == e.itemData[ele]) {
								$(e.sender).siblings('.inputedit[name="relation"]').val(extendData[i].relationCode);
							}
						}
					},
					beforeExpand: function (e) { },
					render: function (rowid, rowdata, data) {
						return rowdata[fText];
					}
				}
				return colObj;
			},
			//组织扩展字段数据
			organizeData: function (eleCode, fName, field) {
				var ele = field;
				var fCodeName = ele + "CodeName";
				var fCode = ele + "Code";
				var fText = ele + "Name";
				var fId = ele;
				// page.reqAccItemTree(eleCode, field);
				var eleTree = ele + "Tree";
				var dataTree = page[eleTree];
				if (field == 'setmodeCode') {
					var colObj = {
						type: 'treecombox',
						field: 'setmodeCode',
						name: '结算方式',
						width: 200,
						headalign: 'center',
						idField: 'setmodeCode',
						textField: 'setmodeCodeCodeName',
						data: page.setmodeCodeTree,
						onChange: function (e) { },
						beforeExpand: function (e) { },
						render: function (rowid, rowdata, data) {
							return rowdata.setmodeName;
						}
					}
				} else {
					var colObj = {
						type: 'treecombox',
						field: fId,
						name: fName,
						width: 200,
						headalign: 'center',
						idField: fId,
						textField: fText,
						data: dataTree,
						leafRequire: false,
						onChange: function (e) { },
						beforeExpand: function (e) { },
						render: function (rowid, rowdata, data) {
							return rowdata[fText];
						}
					}
				}

				return colObj;
			},
			//删除数据
			deleteData: function (guidArr, rowidArr, rowData) {
				if (rowData.length > 0) {
					for (var i = 0; i < rowData.length; i++) {
						if (rowData[i].isBalanceAcc == 1) {
							ufma.showTip("所选的对账单数据中包含已对账的数据,不允许删除!", function () { }, "error");
							return false;
						}
					}
				} else {
					if (rowData.isBalanceAcc == 1) {
						ufma.showTip("所选的对账单数据中包含已对账的数据,不允许删除!", function () { }, "error");
						return false;
					}
				}
				ufma.confirm("您确认删除数据库里的该条对账单吗？", function (action) {
					if (action) {
						var guidStr = guidArr.join(",");
						var argu = {
							"statementGuidDatas": guidStr,
							"agencyCode": page.agencyCode,
							schemaGuid: page.schemaGuid
						};
						ufma.delete(portList.delBankStatement, argu, function (result) {
							ufma.showTip(result.msg, function () {
								$(".btn-query").trigger("click");
							}, result.flag);
						});
					}
				}, {
						type: 'warning'
					});
			},

			//查询对账单
			queryData: function (searchKey) {
				var startDate = $("#dateStart input").val();
				var endDate = $("#dateEnd input").val();
				if ($.isNull($("#accScheList").getObj().getValue())) {
					ufma.showTip("请选择对账方案!", '', 'warnning');
					return false;
				} else {
					var queryArgu = {
						"agencyCode": page.agencyCode,
						"setYear": page.setYear,
						"rgCode": page.rgCode,
						"startDate": startDate,
						"endDate": endDate,
						//					"dateFrom": startDate,
						//					"dateTo": endDate,

						"schemaGuid": page.schemaGuid,
						"getBankStatement": page.getBankStatement,
						"isBalanceAcc": page.isBalanceAcc,
						"startFisPerd": 1,
						"isGetData": 1,
						"searchLike": searchKey
					}
					ufma.get(portList.getBankStatement, queryArgu, function (result) {
						var data = result.data;
						var bankData = data.glBankStatementList;
						var extArr = data.extendTableHeadList;
						for (var j = 0; j < extArr.length; j++) {
							var fName = extArr[j].showName;
							var field = extArr[j].extendField;
							if (field != 'relation') {
								var treeData = extArr[j].treeData;
								var eleCode = extArr[j].eleCode;
								if (eleCode == "PROJECT") {
									extendData = result.data;
								}
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
						page.loadTableData(extArr, bankData);
						$('#amtDrHJ').text($.formatMoney(result.data.AmtDrHJ));
						$('#amtCrHJ').text($.formatMoney(result.data.AmtCrHJ));
						$('#AmtYE').text($.formatMoney(result.data.AmtYE));
					});
				}

			},

			onEventListener: function () {
				// ufma.searchHideShow($('#bankDataGrid')); //搜索框
				var startDate = $("#dateStart input").val();
				var endDate = $("#dateEnd input").val();
				$("#searchHideBtn").on("click", function () {
					page.queryData($(".searchHide").val());
				});

				//期间单选按钮组
				page.raidoBtnGroup("label-radio");
				//按钮提示
				$("[data-toggle='tooltip']").tooltip();

				//绑定日历控件
				$('.uf-datepicker').ufDatepicker({
					format: 'yyyy-mm-dd',
					initialDate: page.today
				});

				//选择期间，改变日历控件的值
				$("#dateBq").on("click", function () {
					page.dateBenQi("dateStart", "dateEnd");
				});
				$("#dateBn").on("click", function () {
					page.dateBenNian("dateStart", "dateEnd");
				});
				$("#dateJr").on("click", function () {
					page.dateToday("dateStart", "dateEnd");
				});

				//点击方案设置
				$("#setAccSche").on("click", function () {
					var obj = {}; //选中的方案内容
					obj.schemaGuid = $("#accScheList").getObj().getValue();
					if ($.isNull(obj.schemaGuid)) {
						ufma.showTip("该单位下没有可查看的对账方案!", '', 'warnning');
						return false;
					} else {
						var param = {};
						param["action"] = "edit";
						param["agencyCode"] = page.cbAgency.getValue();
						param["agencyName"] = page.cbAgency.getText();
						param["rgCode"] = page.rgCode;
						param["setYear"] = page.setYear;
						param["data"] = obj;
						ufma.open({
							url: "../bankBalanceAccSche/setAccSche.html",
							title: "编辑对账方案",
							width: 1090,
							data: param,
							ondestory: function (data) {
								if (data.action == "save") {
									//获取对账方案列表
									page.reqMethod();
									$("#accScheList").getObj().val(obj.schemaGuid);
								}
							}
						});
					}
				});

				//导入银行对账单
				$(".btn-import").on("click", function () {
					if (!$.isNull($("#accScheList_input").val())) {
						var param = {};
						param["action"] = "add";
						param["schemaGuid"] = page.schemaGuid;
						param["bank"] = $("#accScheList").getObj().getItem().bank;
						param["bankCode"] = $("#accScheList").getObj().getItem().bankCode;
						param["bankAccount"] = $("#accScheList").getObj().getItem().bankAccount;
						param["agencyCode"] = page.agencyCode;
						param["setYear"] = page.setYear;
						param["rgCode"] = page.rgCode;
						ufma.open({
							url: "importExcel.html",
							title: "导入银行对账单",
							width: 890,
							data: param,
							ondestory: function (data) {
								if (data.action == "import") {
									//$("#bankDataGrid").getObj().load(data.tableData);
									$(".btn-query").trigger("click");
								}
							}
						});
					} else {
						ufma.showTip("请先选择一个对账方案！", function () { }, "warning");
						return false;
					}
				});
				//导出银行对账单
				//导出begin
				$(".btn-export").on('click', function (evt) {
					var expCols = dgColumns.select(function (el, i, res, param) {
						return $.isNull(el.className) || el.className.indexOf('no-print') == -1;
					});
					uf.expTable({
						title: '银行对账单',
						data: $('#bankDataGrid').getObj().getData(),
						columns: [expCols]
					});
				});
				//导出end
				//新增一行数据范围
				$("#addEditRow").on("click", function () {
					$(".checkAll,input.check-all").prop("checked", false); //点新增行时应该取消全选按钮--zsj
					if (!$.isNull(window.globalConfig)) {
						if (!window.globalConfig.loadCompleted) {
							ufma.showTip("正在加载数据...请稍候再进行操作！", function () { }, "warning");
							return false;
						}
					}
					var obj = $('#bankDataGrid').getObj(); //取对象
					var newRow = {
						isBalanceAcc: "0",
						isBalanceAccName: "未对账",
						statementDate: page.nowDate
					};
					var newId = obj.add(newRow);
					return false;
				});
				//删除一行数据
				$("#bankDataGrid").on("mousedown", ".btnDel", function () {
					var obj = $('#bankDataGrid').getObj(); //取对象
					var rowid = $(this).attr("rowid");
					var rowData = obj.getRowByTId(rowid);
					if (!rowData.hasOwnProperty("statementGuid")) {
						obj.del(rowid);
					} else {
						var guid = rowData.statementGuid;
						var guidArr = [guid];
						var rowidArr = [rowid];
						page.deleteData(guidArr, rowidArr, rowData);
					}
				});

				//批量删除数据
				$(".btn-delete").on("click", function () {
					var obj = $('#bankDataGrid').getObj(); //取对象
					var tableData = obj.getCheckData();
					var $check = $('#bankDataGrid').find(".check-item:checked");
					var checkData = $('#bankDataGrid').getObj().getCheckData();
					if (tableData.length > 0) {
						var rowidArr = [];
						var guidArr = [];
						for (var i = 0; i < tableData.length; i++) {
							var rowid = $check.eq(i).attr("rowid");
							if (tableData[i].hasOwnProperty("statementGuid")) {
								guidArr.push(tableData[i].statementGuid);
								rowidArr.push(rowid);
							} else {
								obj.del(rowid);
								if ($('.checkAll').eq(0).is(':checked')) {
									$(".checkAll").eq(0).trigger("click")
								}
							}
						}
						if (guidArr.length > 0) {
							page.deleteData(guidArr, rowidArr, checkData);
						}
						if ($('.checkAll').eq(0).is(':checked')) {
							$(".checkAll").trigger("click")
						}
					} else {
						ufma.showTip("请选择要删除的数据！", function () { }, "warning");
						return false;
					}
				});

				//查询银行对账单
				$(".btn-query").on("click", function () {
					if ($('#dateStart').getObj().getValue() > $('#dateEnd').getObj().getValue()) {
						ufma.showTip('开始日期不能大于结束日期！', function () { }, 'error');
						return false;
					}
					page.queryData("");
					$(".checkAll").attr("checked", false);
				});

				//保存银行对账单
				$(".btn-save").on("click", function () {
					var tableData = $("#bankDataGrid").getObj().getData();
					for (var i = 0; i < tableData.length; i++) {

						var flag1 = false,
							flag2 = false;
						if (tableData[i].hasOwnProperty("amtCr") && tableData[i].amtCr != "" && tableData[i].amtCr != "0" && tableData[i].amtCr != "0.00") {
							flag1 = true;
						}
						if (tableData[i].hasOwnProperty("amtDr") && tableData[i].amtDr != "" && tableData[i].amtDr != "0" && tableData[i].amtDr != "0.00") {
							flag2 = true;
						}

						if (!(flag1 || flag2)) {
							var strip = i + 1;
							ufma.showTip('第' + strip + '条借贷金额至少有一个不为0！', function () { }, "warning");
							return false;
						}
						tableData[i]["ordSeq"] = i + 1;
						tableData[i]["rgCode"] = page.rgCode;
						tableData[i]["setYear"] = page.setYear;
						tableData[i]["agencyCode"] = page.agencyCode;
						tableData[i]["schemaGuid"] = page.schemaGuid;
						tableData[i]['amtDr'] = (tableData[i]['amtDr'] + ",").replaceAll(',', '');
						tableData[i]['amtCr'] = (tableData[i]['amtCr'] + ",").replaceAll(',', '');
						if (!tableData[i].hasOwnProperty("statementGuid")) {
							tableData[i]["statementGuid"] = "";
						}
					}
					if (tableData.length != 0) {
						var argu = {
							glBankStatementList: tableData
						}
						ufma.post(portList.saveBankStatement, argu, function (result) {
							ufma.showTip(result.msg, function () { }, result.flag);
							page.queryData("");
							$(".checkAll").attr("checked", false);
						});
					} else {
						ufma.showTip("请先新增数据！", function () { }, "warning");
						return false;
					}
				});

				//打印
				$('.btn-print').click(function () {
					var tableData = $("#bankDataGrid").getObj().getData();
					var colArr = [];
					for (var i = 1; i < page.printColArr.length - 1; i++) {
						colArr.push(page.printColArr[i]);
					}
					if (tableData.length > 0) {
						uf.tablePrint({
							mode: "rowHeight",
							pageHeight: 924,
							title: '银行对账单',
							topLeft: page.agencyName,
							topCenter: '',
							topRight: '记录总数：' + tableData.length,
							bottomLeft: '',
							bottomCenter: '',
							bottomRight: '<span class="page-num"></span>',
							data: tableData,
							columns: [colArr]
						});
					} else {
						ufma.showTip("表格数据为空！", function () { }, "warning");
						return false;
					}
				});

				//全选
				$(".checkAll").on("click", function () {
					var flag = $(this).prop("checked");
					$("#bankDataGridHead").find('input.check-all').trigger('click');
				});
				$("body").on("change", 'input.check-all', function () {
					var flag = $(this).prop("checked");
					$(".checkAll").prop("checked", flag);
				});
				//bug79486--当表格数据都被选中时选中底部的全选框
				$(document).on("click", ".uf-grid-body-lock-content", function () {
					var timeId = setTimeout(function () {
						clearTimeout(timeId)
						var checkDatalen = $('#bankDataGrid').getObj().getCheckData().length;
						var allDatalen = $('#bankDataGrid').getObj().getData().length;
						if (checkDatalen != allDatalen) {
							$(".checkAll").prop("checked", false);
						} else {
							$(".checkAll").prop("checked", true);
						}
					}, 100);
				});
				//对账状态
				$('#query-status').on("click", function (e) {
					var _self = e.target;
					page.isBalanceAcc = $(_self).attr('value');
					if (page.isBalanceAcc == 2) {
						//显示全部
					} else if (page.isBalanceAcc == 1) {
						//显示已对账
					} else if (page.isBalanceAcc == 0) {
						//显示未对账
					}
					page.queryData("");
					$(".checkAll").attr("checked", false);
				});
			},

			//初始化页面
			initPage: function () {
				var pfData = ufma.getCommonData();
				page.nowDate = pfData.svTransDate; //当前年月日
				page.rgCode = pfData.svRgCode; //区划代码
				page.setYear = pfData.svSetYear; //本年 年度
				page.month = pfData.svFiscalPeriod; //本期 月份
				page.today = pfData.svTransDate; //今日 年月日
				//修改权限  将svUserCode改为 svUserId  20181012
				page.userId = pfData.svUserId; //登录用户ID
				// page.userId = pfData.svUserCode; //登录用户ID
				page.userName = pfData.svUserName; //登录用户名称
				page.agencyCode = pfData.svAgencyCode; //登录单位代码
				page.agencyName = pfData.svAgencyName; //登录单位名称
				page.isBalanceAcc = "0"; //对账状态
				//初始化单位列表样式
				page.cbAgency = $("#cbAgency").ufmaTreecombox2({
					valueField: 'id',
					textField: 'codeName',
					placeholder: '请选择单位',
					icon: 'icon-unit',
					readOnly: false,
					onchange: function (data) {
						page.initTable('bankDataGrid', [], page.bankFixedArr);
						//给全局单位变量赋值
						page.agencyCode = data.id;
						page.agencyName = data.name;
						//缓存单位账套
						var params = {
							selAgecncyCode: data.id,
							selAgecncyName: data.name
						}
						ufma.setSelectedVar(params);
						//银行对账单固定字段
						page.bankFixedArr = [{
							type: 'checkbox',
							field: '',
							name: '',
							width: 50,
							headalign: 'center',
							className: 'no-print',
							align: 'center'
						},
						{
							type: 'input',
							field: 'isBalanceAccName',
							name: '状态',
							width: 70,
							headalign: 'center',
							align: 'center'
						},
						{
							type: 'datepicker',
							field: 'statementDate',
							name: '单据日期',
							width: 100,
							headalign: 'center',
							align: 'center'
						},
						{
							type: 'input',
							field: 'vouNo',
							name: '单据编号',
							className: 'nowrap',
							width: 120,
							headalign: 'center',
							render: function (rowid, rowdata, data) {
								return $.isNull(rowdata.vouNo) ? '' : '<span title="' + rowdata.vouNo + '">' + rowdata.vouNo + '</span>';
							}
						},
						{
							type: 'input',
							field: 'descpt',
							name: '摘要',
							width: 250,
							headalign: 'center',
							render: function (rowid, rowdata, data) {
								return $.isNull(rowdata.descpt) ? '' : '<span title="' + rowdata.descpt + '">' + rowdata.descpt + '</span>';
							}
						},
						{
							type: 'money',
							field: 'amtDr',
							name: '借方金额',
							width: 170,
							headalign: 'center',
							align: 'right',
							render: function (rowid, rowdata, data) {
								var text = $.formatMoney(rowdata.amtDr, 2);
								return text == '0.00' ? '' : '<span title="' + text + '">' + text + '</span>';
							},
							onKeyup: function (sdr) {
								$("#bankDataGridmoneyamtCr").val('');
							}
						},
						{
							type: 'money',
							field: 'amtCr',
							name: '贷方金额',
							width: 170,
							headalign: 'center',
							align: 'right',
							render: function (rowid, rowdata, data) {
								var text = $.formatMoney(rowdata.amtCr, 2);
								return text == '0.00' ? '' : '<span title="' + text + '">' + text + '</span>';
							},
							onKeyup: function (sdr) {
								$("#bankDataGridmoneyamtDr").val('');
							}
						},
						{
							type: 'datepicker',
							field: 'billDate',
							name: '票据日期',
							width: 97,
							headalign: 'center',
							align: 'center'
						},
						{
							type: 'input',
							field: 'billNo',
							name: '票据号',
							width: 100,
							headalign: 'center'
						}
							//新增行时去掉这两行
							/* { type: 'input', field: 'groupGuid', name: '对账号', width: 180, headalign: 'center' },
							{ type: 'input', field: 'balanceDate', name: '对账时间', width: 150, headalign: 'center', align: 'center' },
	*/
						];

						//银行对账单固定操作字段
						page.bankFixedOptArr = [{
							type: 'toolbar',
							field: 'statementGuid',
							name: '操作',
							className: 'no-print',
							width: 46,
							headalign: 'center',
							align: 'center',
							render: function (rowid, rowdata, data) {
								return '<a class="btnDel" rowid="' + rowid + '" conid="' + rowdata + '"><span class="icon icon-trash"></span></a>';
							}
						}];

						//获取对账方案
						page.reqMethod();
						$(".check-all,.checkAll").prop("checked", false);
					}
				});

				//请求单位列表
				ufma.ajaxDef(portList.agencyList, "get", {
					"rgCode": page.rgCode,
					"setYear": page.setYear
				}, function (result) {
					var data = result.data;
					var cbAgency = $("#cbAgency").ufmaTreecombox2({
						data: result.data
					});

					var code = data[0].id;
					var name = data[0].name;

					if (page.agencyCode != "" && page.agencyName != "") {
						var agency = $.inArrayJson(data, 'id', page.agencyCode);
						if (agency != undefined) {
							cbAgency.val(page.agencyCode);
						} else {
							cbAgency.val(code);
							page.agencyCode = code;
							page.agencyName = name;
						}
					} else {
						cbAgency.val(code);
						page.agencyCode = code;
						page.agencyName = name;
					}
				});

				//初始化方案列表
				$("#accScheList").ufCombox({
					idField: "schemaGuid",
					textField: "schemaName",
					placeholder: "请选择对账方案",
					onChange: function (sender, data) {
						page.schemaGuid = data.schemaGuid;
						// $("#bankDataGrid").getObj().clear();
						$("#bankDataGrid").html("");
						//page.showExtTable();
						page.queryData("");
					}
				});
			},

			init: function () {
				page.reslist = ufma.getPermission();
				ufma.isShow(page.reslist);

				this.initPage();
				this.onEventListener();
				ufma.parse();
				ufma.parseScroll();
			}
		}
	}();

	page.init();
});