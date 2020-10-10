/*zhaoxjb 2018.5.17
 * 渲染完来源子系统后set方案名称、描述等，initSonSystem()方法里
 * */
var typeData = [];
var eleList = [];
var columnNameList = [];
var agencyName = "";
var timeId;
var pfData = ufma.getCommonData();
var vouFonfigData;
var vouFonfigEdit; //编辑时获取当前方案的凭证联查信息 guohx 
$(function() {
	var onerdata = window.ownerData;
	var soSystemData = onerdata.data.soSystemData;
	window._close = function(action) {
		if(window.closeOwner) {
			var data = {
				action: action,
				// aCode: aCode,
				// dataType: dataType,
				// guid: guid
			};
			window.closeOwner(data);
		}
	};

	if(onerdata.className) {
		$(".includeAgency").css("display", "none");
		// $(".justAgency").css("display", "block");
		$(".includeAgency #bdAgencyEdit").css("visibility", "hidden");
		// $(".justAgency #bdAgency").css("visibility", "visible");
	}
	//接口URL集合
	var interfaceURL = {
		getAgencyTree: "/lp/eleAgency/getAgencyTree", //用于显示单位树
		getEnumerate: "/lp/enumerate/", //枚举表获取数据源类型
		getEnumerateList: "/lp/enumerate/List/", //枚举表获取数据库类型
		getColumnName: "/lp/scheme/getColumnName", //获取纳税人名称列
		saveDataConfig: "/lp/scheme/saveDataConfig", //新增保存数据源
		getEle: "/lp/sys/getEle/", //获取要素列表
		getTableHeadName: "/lp/scheme/getTableHeadName", //获取表头信息
		saveSchemeConfig: "/lp/scheme/saveSchemeConfig", //保存方案配置
		updateSchemeById: "/lp/scheme/updateSchemeById", //编辑保存方案配置
		billItemType: "/lp/enumerate/List/LP_BILL_ITEM_TYPE", //获取枚举值域（单据节点类型）
		getSchemeById: "/lp/scheme/getSchemeById/", //根据id请求方案（设置方案）
		getBillTypes: "/lp/billType/getBillTypes/", //获取单据类型
		testLpRelationConfig: "/lp/relationConfig/testLpRelationConfig", //测试配置
		getTableColumn: '/lp/gwzjConfig/getTableColumn' //公务之家视图字段下拉列表
	};

	var src = {};
	src.itemTypeData = [];
	var page = function() {
		return {
			//初始化表格（数据库类型）
			initbaseType: function() {
				$("#databaseType").ufCombox({
					idField: "ENU_CODE",
					textField: "ENU_NAME",
					// data: data, //json 数据
					placeholder: "请选择数据库类型",
					onChange: function(sender, data) {
						if(data.ENU_CODE == "01") {
							//oracle数据库端口号
							$("#port").val("1521");
						} else if(data.ENU_CODE == "02") {
							//达梦数据库端口号
							$("#port").val("5236");
						}
					},
					onComplete: function(sender) {}
				});
				page.getLpDbType();
			},
			//请求数据库类型
			getLpDbType: function() {
				var argu = {
					rgCode: pfData.svRgCode,
					setYear: pfData.svSetYear
				};
				ufma.get(interfaceURL.getEnumerateList + "LP_DB_TYPE", argu, function(result) {
					var data = [];
					for(var i in result.data) {
						data.push({
							"ENU_CODE": i,
							"ENU_NAME": result.data[i]
						});
					}
					$("#databaseType").getObj().load(data);
					$("#databaseType").getObj().val("001");
				})
			},
			//重组columns
			recombineColumns: function(type, isUsed, isTurned) {
				var columns = [
					[ // 支持多表头
						{
							// type: 'input',
							field: 'ROWNU',
							width: 40,
							name: '序号',
							align: 'center',
							headalign: 'center'
						},
						{
							type: 'input',
							field: 'ITEM_CODE',
							width: 149,
							name: 'EXCEL文件列（第x列）',
							headalign: 'center',
							align: 'left',
							onKeyDown:function(e,event){
								if(event.keyCode == 229 || event.keyCode == 0) {
									event.preventDefault();
									event.preventDefault();
									ufma.showTip('请使用英文输入法')
									e.sender.blur()
									event.returnValue = false;
								}
								
							},
							onInput:function(e,event){
								if ($("#data-type").find("button[active='true']").attr("data-id") == "01") {
									if(e.sender.val() !== "") {
										var newArr = [];
										for(var i = 0; i < e.sender.val().length; i++) {
											if(!/[A-Z]/.test(e.data[i])) {
												if(/[a-z]/.test(e.data[i])) {
													newArr.push(e.data[i].toUpperCase());
												} else {
													newArr.push("");
												}
											} else {
												newArr.push(e.data[i]);
											}
										}
										e.sender.val(newArr.join(""));
									}
								}
							}
						},
						{
							type: 'input',
							field: 'ITEM_NAME',
							width: 119,
							name: '别名',
							headalign: 'center',
							align: 'left',
							render: function(rowid, rowdata, data) {
								return data;
							}
						},
						{
							field: 'COLUMN_NAME',
							width: 149,
							name: '字段代码（会计平台）',
							headalign: 'center',
							align: 'left'
						},
						{
							type: 'combox',
							field: 'IS_PK',
							name: '主键',
							width: 60,
							headalign: 'center',
							align: 'left',
							idField: 'IS_PK',
							textField: 'ISPKNAME',
							pIdField: '',
							data: [{
									"IS_PK": "1",
									"ISPKNAME": "是"
								},
								{
									"IS_PK": "0",
									"ISPKNAME": "否"
								}
							],
							render: function(rowid, rowdata, data) {
								if(!data || data == "") {
									rowdata.IS_PK = "0";
									return '否';
								}
								if(rowdata.IS_PK == '1') {
									return '是';
								} else if(rowdata.IS_PK == '0') {
									return '否';
								}
							},
							onChange: function(e) {},
							beforeExpand: function(e) { //下拉框初始化

							}
						},
						{
							type: 'combox',
							field: 'ENU_CODE',
							name: '字段类型',
							width: 100,
							headalign: 'center',
							align: 'left',
							idField: 'ENU_CODE',
							textField: 'ENU_NAME',
							pIdField: '',
							data: src.itemTypeData,
							render: function(rowid, rowdata, data) {
								if(!data) {
									return "";
								}
								return rowdata.ENU_NAME;
							},
							onChange: function(e, data) {
								//字段代码是要素，对应要素可下拉选择，否则不能选择对应要素
								if(e.rowData.ENU_NAME != "要素" && e.rowData.ENU_NAME != "要素名称") {
									$("#nameTable2comboxeleCode").getObj().setEnabled(false);
									$("#nameTable2comboxeleCode").getObj().val("");
									$("#nameTable2comboxeleCode_input").attr("disabled", true);
									$("#nameTable2comboxeleCode").css("display", "none")

								} else {
									$("#nameTable2comboxeleCode").getObj().setEnabled(true);
									$("#nameTable2comboxeleCode_input").attr("disabled", false);
								}
								var rowid = $(".uf-grid-table-edit").attr("rowid");
								var rowNoarr = rowid.split("_");
								var rowNo = rowNoarr[rowNoarr.length - 1];
								if (rowNo == "2" || rowNo == "3" || rowNo == "4" || rowNo == "34") {
									//CWYXM-19342  会计平台，单据方案-excel方案，35行字段类型下拉框无法选择 guohx 此处需求为不可下拉，故隐藏 20200824
									$(".uf-grid-table-edit .uf-combox .uf-combox-btn").hide();
									$(".uf-grid-table-edit .uf-combox .icon-close").hide();
								}
							},
							beforeExpand: function (e) { //下拉框初始化
								
							}
						},
						{
							type: 'combox',
							field: 'eleCode',
							name: '对应要素',
							width: 146,
							headalign: 'center',
							align: 'left',
							idField: 'eleCode',
							textField: 'eleName',
							pIdField: '',
							// data: page.eleData,
							data: eleList,
							render: function(rowid, rowdata, data) {
								if(!data) {
									return '';
								}
								for(var i = 0; i < eleList.length; i++) {
									if(eleList[i].eleCode == rowdata.eleCode) {
										return eleList[i].eleName;
									}
								}
							},
							onChange: function(e) {
								// liuyyn 选完对应要素改变转换是否可编辑状态
								$("#nameTable2comboxIS_TURN").find(".uf-combox-clear.icon-close").hide();
								if(e.rowData.ENU_NAME === "要素" && e.rowData.eleName) {
									$("#nameTable2comboxIS_TURN").getObj().setEnabled(true);
									$("#nameTable2comboxIS_TURN_btn").show();
									$("#nameTable2comboxIS_TURN_input").removeAttr("disabled");
								} else {
									$("#nameTable2comboxIS_TURN").getObj().setEnabled(false);
									$("#nameTable2comboxIS_TURN_btn").hide();
									$("#nameTable2comboxIS_TURN_input").attr("disabled", "disabled");
								}
							},
							beforeExpand: function(e) { //下拉框初始化
								$(e.sender).getObj().load(eleList);
								// if(e.rowData.enuCode == "07"){
								// 	$(e.sender).getObj().load(page.eleData);
								// }else{
								// 	$(e.sender).getObj().load([]);
								// }
							}
						},
						{
							type: 'input',
							field: 'ORD_SEQ',
							width: 60,
							name: '顺序',
							headalign: 'center',
							align: 'left',
							onKeyup: function(e) {
								if(e.data !== "" && isNaN(e.data)) {
									$("#nameTable2inputORD_SEQ").val("");
								}
							}
						},
						{
							type: 'combox',
							field: 'IS_DISPLAY',
							name: '显示',
							width: 60,
							headalign: 'center',
							align: 'left',
							idField: 'IS_DISPLAY',
							textField: 'ISDISPLAYNAME',
							pIdField: '',
							data: [{
									"IS_DISPLAY": "1",
									"ISDISPLAYNAME": "是"
								},
								{
									"IS_DISPLAY": "0",
									"ISDISPLAYNAME": "否"
								}
							],
							render: function(rowid, rowdata, data) {
								if(!data || data == "") {
									rowdata.IS_DISPLAY = "1";
									return '是';
								}
								if(rowdata.IS_DISPLAY == '1') {
									return '是';
								} else if(rowdata.IS_DISPLAY == '0') {
									return '否';
								}
							},
							onChange: function(e) {},
							beforeExpand: function(e) { //下拉框初始化

							}
						},
					]
				];
				if(type == "02") {
					columns[0].splice(1, 1, {
						type: 'combox',
						field: 'ITEM_CODE',
						name: '中间库字段',
						className: 'itemCode',
						width: 129,
						headalign: 'center',
						align: 'left',
						idField: 'ITEM_CODE',
						textField: 'ITEM_CODE_NAME',
						pIdField: '',
						data: page.dbDatas,
						render: function(rowid, rowdata, data) {
							if(!data) {
								return '';
							}
							return rowdata.ITEM_CODE
						},
						onChange: function(e) {},
						beforeExpand: function(e) { //下拉框初始化
							// $(e.sender).getObj().load(eleList);
							// if(e.rowData.enuCode == "07"){
							// 	$(e.sender).getObj().load(page.eleData);
							// }else{
							// 	$(e.sender).getObj().load([]);
							// }
						}
					});
					columns[0][1].name = "中间库字段";
					columns[0][1].onKeyup = function() {

					}
				}
				if(type == "05") {
					columns[0].splice(1, 1, {
						type: 'combox',
						field: 'ITEM_CODE',
						name: '视图字段',
						width: 129,
						headalign: 'center',
						align: 'left',
						idField: 'ITEM_CODE',
						textField: 'ITEM_CODE_NAME',
						pIdField: '',
						data: page.gwzjlist,
						render: function(rowid, rowdata, data) {
							if(!data) {
								return '';
							}
							return rowdata.ITEM_CODE
						},
						onChange: function(e) {},
						beforeExpand: function(e) { //下拉框初始化
							//视图字段
							page.getTableColumn(function(res) {
								$(e.sender).getObj().load(res);
							});
						}
					});
					columns[0][1].name = "视图字段";
					columns[0][1].onKeyup = function() {

					}
				}
				if(type == "00") {
					columns[0][1].name = "字段代码（业务系统）";
					columns[0][1].onKeyup = function() {}
				}
				if(type == "03") {
					columns[0][1].name = "webservice字段";
					columns[0][1].onKeyup = function() {}
				}
				if(type == "04") {
					columns[0][1].name = "http字段";
					columns[0][1].onKeyup = function() {}
				}
				//新增需求导入xml--CWYXM-8433--表格展示部分--zsj
				if(type == "06") {
					columns[0].splice(1, 1, {
						type: 'input',
						field: 'ITEM_CODE',
						width: 120,
						name: '字段标签名',
						headalign: 'center',
						align: 'left',
						onKeyup: function(e) {
							if($.isNull(e.data)) {
								$("#nameTable2inputITEM_NAME").val("");
							}
						}
					}, {
						type: 'input',
						field: 'XML_NAME',
						width: 120,
						name: '字段标签属性名',
						headalign: 'center',
						align: 'left',
						onKeyup: function(e) {
							if($.isNull(e.data)) {
								$("#nameTable2inputLABEL_PROPERTIES_NAME").val("");
							}
						}
					}, {
						type: 'input',
						field: 'XML_VALUE',
						width: 120,
						name: '字段标签属性值',
						headalign: 'center',
						align: 'left',
						onKeyup: function(e) {
							if($.isNull(e.data)) {
								$("#nameTable2inputLABEL_PROPERTIES_VALUE").val("");
							}
						}
					});
					columns[0][1].name = "字段标签名";
					columns[0][1].onKeyup = function() {}
				}

				//修改 by guohx  20180929  产品说此处动态效果不稳定,要求写死
				if(isUsed) {
					columns[0].push({
						type: 'combox',
						field: 'IS_HOLD',
						name: '挂接',
						width: 60,
						headalign: 'center',
						align: 'left',
						idField: 'IS_HOLD',
						textField: 'ISHOLDNAME',
						pIdField: '',
						data: [{
								"IS_HOLD": "1",
								"ISHOLDNAME": "是"
							},
							{
								"IS_HOLD": "0",
								"ISHOLDNAME": "否"
							}
						],
						render: function(rowid, rowdata, data) {
							if(!data || data == "") {
								rowdata.IS_HOLD = "0";
								return '否';
							}
							if(rowdata.IS_HOLD == '1') {
								return '是';
							} else if(rowdata.IS_HOLD == '0') {
								return '否';
							}
						},
						onChange: function(e) {},
						beforeExpand: function(e) { //下拉框初始化

						}
					})
				} else {
					if(columns.length == 9) {
						columns[0].splice(columns[0].length - 1, 1)
					}
				}
				if(isTurned) { // liuyyn 添加转换
					columns[0].push({
						type: 'combox',
						field: 'IS_TURN',
						name: '名称转换',
						width: 60,
						headalign: 'center',
						align: 'left',
						idField: 'IS_TURN',
						textField: 'ISTURNEDNAME',
						pIdField: '',
						data: [{
								"IS_TURN": "1",
								"ISTURNEDNAME": "是"
							},
							{
								"IS_TURN": "0",
								"ISTURNEDNAME": "否"
							}
						],
						render: function(rowid, rowdata, data) {
							if(!data || data == "") {
								rowdata.IS_TURN = "0";
								return '否';
							}
							if(rowdata.IS_TURN == '1') {
								return '是';
							} else if(rowdata.IS_TURN == '0') {
								return '否';
							}
						},
						onChange: function(e) {},
						beforeExpand: function(e) { //下拉框初始化

						}
					})
				} else {
					if(columns.length == 9) {
						columns[0].splice(columns[0].length - 1, 1)
					}

				}
				return columns;
			},
			/**
			 * 渲染主表
			 * @param id 表id
			 * @param tableData 表体数据
			 * @param eleList 要素列表
			 * @param type 数据源类型
			 * @param isUsed 启用挂接
			 * @param isTurned 启用转换
			 */
			initTable2: function(id, tableData, eleList, type, isUsed, isTurned) {
				$('#' + id).ufDatagrid({
					data: tableData,
					disabled: false, // 可选择
					columns: page.recombineColumns(type, isUsed, isTurned),
					initComplete: function(options, data) {
						//去掉谷歌表单自带的下拉提示
						$(document).on("focus", "input", function() {
							$(this).attr("autocomplete", "off");
						});

						if($("#nameTable2comboxIS_HOLD").length > 0) {
							$("#nameTable2comboxIS_HOLD").getObj().setEnabled(false);
						}

						//单位级下不能编辑系统级的方案和模版
						//     if ((onerdata.className && onerdata.data.agencyId == "*")|| onerdata.data.billNum == "true" || onerdata.data.temNum == "true") {//单位code
						if(onerdata.className && onerdata.data.agencyId == "*") { //单位code
							$("#nameTable2").getObj().setEnabled(false);
						}

						//表头驻顶
						$(".ufma-layout-up").scroll(function() {
							var headTop = $("#nameTable2").offset().top;
							if($(".ufma-layout-up").scrollTop() >= headTop) {
								$("#nameTable2Head").css({
									position: "fixed",
									top: "0px",
									"z-index": "2001",
									"background-color": "#EEF1F6"
								});
							} else {
								$("#nameTable2Head").css({
									position: "inherit"
								});
							}

						});

						//中间库需要先测试配置（主要是新增的时候用），否则无法选择中间库字段
						$("#nameTable2 tr").on("click", function() {
							// if ((onerdata.data.billNum != "true" && onerdata.data.temNum != "true" || onerdata.className && onerdata.data.agencyId == "*") && type == "02" && page.dbDatas == undefined) {
							// if ((onerdata.className && onerdata.data.agencyId == "*") && type == "02" && page.dbDatas == undefined) {
							if(type == "02" && page.dbDatas == undefined) {
								if(onerdata.action === "editBill") {
									//获取中间库字段
									var argu = page.checkRelationBaseDatas();
									ufma.showloading();
									ufma.post(interfaceURL.testLpRelationConfig, argu, function(result) {
										var timeId = setTimeout(function() {
											ufma.hideloading();
											clearTimeout(timeId);
										}, 500);
										page.dbDatas = result.data;

										$("#nameTable2comboxITEM_CODE").getObj().load(result.data);
										var tabtleDatas = $("#nameTable2").getObj().getData();
										var rowid = $(".uf-grid-table-edit").attr("rowid");
										var rowNoarr = rowid.split("_");
										var rowNo = rowNoarr[rowNoarr.length - 1];
										var code = tabtleDatas[rowNo - 1].ITEM_CODE;
										$("#nameTable2comboxITEM_CODE").getObj().val(code);
									});
								} else {
									ufma.showTip("没有可供选择的中间库字段，请检测数据库是否连接成功", function() {

									}, "warning");
								}

							}
						});

						//BILL_NO、BILL_DATE、FIELD01、FIELD32行预置字段不能修改 S
						//操作别名
						$(document).on("focus", "#nameTable2inputITEM_NAME", function(e) {
							var rowid = $(".uf-grid-table-edit").attr("rowid");
							// var rowNoarr = rowid.split("_");
							// var rowNo = rowNoarr[rowNoarr.length - 1];
							// liuyyn 修改别名：摘要和报销单号为可编辑状态
							// if (rowNo == "2" || rowNo == "3" || rowNo == "4" || rowNo == "34") {
							// CWYXM-19039 因为增加了第一行，可编辑状态：单据编号和单据日期不可修改
							var ele = $("#" + rowid + "[pid='" + rowid + "']").find("td[name='COLUMN_NAME']");
							// if(rowNo == "3" || rowNo == "4") {
							if (ele[0].innerHTML == "BILL_NO" || ele[0].innerHTML == "BILL_DATE") {
								$(this).attr("disabled", true);
							}
						});
						$(document).on("blur", "#nameTable2inputITEM_NAME", function(e) {
							$(this).attr("disabled", false);
						});

						//操作字段类型
						$(document).on("focus", "#nameTable2comboxENU_CODE_input", function() {
							page.setEnabledFn();
						});
						$(document).on("blur", "#nameTable2comboxENU_CODE_input", function() {
							$(".uf-grid-table-edit .uf-combox").getObj().setEnabled(true);
						});

						//操作是否主键
						$(document).on("focus", "#nameTable2comboxIS_PK_input", function() {
							page.setEnabledFn();
						});
						$(document).on("blur", "#nameTable2comboxIS_PK_input", function() {
							$(".uf-grid-table-edit .uf-combox").getObj().setEnabled(true);
						});

						//操作主键和字段类型的下拉标志
						$(document).on("click", "#nameTable2comboxENU_CODE .uf-combox-btn", function() {
							page.setEnabledFn();
						});
						$(document).on("click", "#nameTable2comboxIS_PK .uf-combox-btn", function() {
							page.setEnabledFn();
						});
						$(document).on("click", "#nameTable2comboxENU_CODE span", function() {
							page.setEnabledFn();
						});
						$(document).on("click", "#nameTable2comboxIS_PK span", function() {
							page.setEnabledFn();
						});

						//操作编辑行以外的区域
						$(document).on("click", function(e) {
							var div1 = $('.uf-grid-table-edit')[0];
							if(e.target != div1 && !$.contains(div1, e.target)) {
								$(".uf-grid-table-edit .uf-combox").getObj().setEnabled(true);
								$(".uf-grid-table-edit .uf-combox").getObj().setEnabled(true);
							}
						});
						$(document).on("click", "table", function(e) {
							var div1 = $('.uf-grid-table-edit')[0];
							if(e.target != div1 && !$.contains(div1, e.target)) {
								$(".uf-grid-table-edit .uf-combox").getObj().setEnabled(true);
								$(".uf-grid-table-edit .uf-combox").getObj().setEnabled(true);
							}
						});
						//BILL_NO和BILL_DATE行预置字段不能修改 E

						//挂接控制 选择了要素的才能选择挂接 S
						$(document).on("focus", "#nameTable2comboxIS_HOLD_input", function() {
							if($("#nameTable2comboxeleCode_text").val() == "" || $("#nameTable2comboxeleCode_text").val() == undefined) {
								$("#nameTable2comboxIS_HOLD").getObj().setEnabled(false);
								$("#nameTable2comboxIS_HOLD").getObj().val("0");
							}
						});
						$(document).on("blur", "#nameTable2comboxIS_HOLD_input", function() {
							$(".uf-combox").getObj().setEnabled(true);
						});
						$(document).on("click", "#nameTable2comboxIS_HOLD .uf-combox-btn", function() {
							if($("#nameTable2comboxeleCode_text").val() == "" || $("#nameTable2comboxeleCode_text").val() == undefined) {
								$("#nameTable2comboxIS_HOLD").getObj().setEnabled(false);
								$("#nameTable2comboxIS_HOLD").getObj().val("0");
							} else {
								$("#nameTable2comboxIS_HOLD").getObj().setEnabled(true);
							}
						});
						$(document).on("click", "#nameTable2comboxIS_HOLD span", function() {
							if($("#nameTable2comboxeleCode_text").val() == "" || $("#nameTable2comboxeleCode_text").val() == undefined) {
								$("#nameTable2comboxIS_HOLD").getObj().setEnabled(false);
								$("#nameTable2comboxIS_HOLD").getObj().val("0");
							} else {
								$("#nameTable2comboxIS_HOLD").getObj().setEnabled(true);
							}
						});

						//挂接控制 选择了要素的才能选择挂接 E

						// liuyyn 操作转换控制 选择了要素的才能选择转换  初始化转换是否可编辑                      
						$("#nameTable2").on("mousedown", "tr", function() {
							var obj = $('#nameTable2').getObj();
							// var rowid = $(this).context.rowIndex;
							var rowid = $(".uf-grid-table-edit").attr("rowid");
							var rowNoarr = rowid ? rowid.split("_") : [];
							var rowNo = rowNoarr[rowNoarr.length - 1];
							var rowData = obj.getData()[rowNo - 1];
							$("#nameTable2comboxIS_TURN").find(".uf-combox-clear.icon-close").hide();
							if(rowData) {
								if(rowData.ENU_NAME === "要素" && rowData.eleName) {
									$("#nameTable2comboxIS_TURN_btn").show();
									$("#nameTable2comboxIS_TURN_input").removeAttr("disabled");
								} else {
									$("#nameTable2comboxIS_TURN_btn").hide();
									$("#nameTable2comboxIS_TURN_input").attr("disabled", "disabled");
								}
							}
						});
					}
				});
			},
			//控制表格td内容是否可以改变
			setEnabledFn: function() {
				var rowid = $(".uf-grid-table-edit").attr("rowid");
				var rowNoarr = rowid.split("_");
				var rowNo = rowNoarr[rowNoarr.length - 1];
				$(".uf-grid-table-edit .uf-combox").getObj().setEnabled(false);
				$(".uf-grid-table-edit .uf-combox .icon-close").hide();
				if($("#nameTable2comboxITEM_CODE").length > 0) {
					$("#nameTable2comboxITEM_CODE").getObj().setEnabled(true);
					$(".uf-grid-table-edit .uf-combox .icon-close").show();
				}
				if (rowNo != "2" && rowNo != "3" && rowNo != "4" && rowNo != "34") {
					$(".uf-grid-table-edit .uf-combox").getObj().setEnabled(true);
					$(".uf-grid-table-edit .uf-combox .icon-close").show();
				} 
			},
			//根据所属单位（和数据源）加载页面内容
			showContent: function() {
				$('.model-list').html(""); //清除原始内容
				var url, agencyCode = "*";
				if($('input[name="subUnits"]:checked').val() == "*") {
					url = "?agencyCode=*";
					agencyCode = "*"
				} else {
					if(page.agency == undefined || $("#bdAgencyEdit_input").val() == "") {
						url = "";
						agencyCode = "*"
					} else {
						url = "?agencyCode=" + page.agency.getValue();
						agencyCode = page.agency.getValue()
					}
				}
				var type = $('#source-btn button[active="true"]').attr("data-id");

				var tabArgu = {
					"agencyCode": agencyCode,
					"dataSourceType": type
				};
				// ufma.post(interfaceURL.getDataSource, tabArgu, page.DataSourceListHtml);
				// ufma.get(interfaceURL.getBillTypeList + url, "", page.getBillTypeList);
			},
			//加载单位（系统级）
			getAgency: function(result) {
				var data = result.data;
				if(onerdata.className) {
					$("#bdAgency").html(onerdata.agencyName);
				} else {
					page.agency = $("#bdAgencyEdit").ufmaTreecombox({
						valueField: 'id',
						textField: 'codeName',
						readOnly: false,
						leafRequire: true,
						popupWidth: 1.5,
						data: data,
						onchange: function(data) {
							//选择单位事重新获取单位对应的要素并重新渲染table
							page.getEle();
						},
						onComplete: function(sender) {

						}
					});
					$("#bdAgencyEdit_input").attr("autocomplete", "off");
				}

				if(onerdata.action === "editBill") {
					//如果是编辑方案则set单位的值
					if(onerdata.data.agencyId === "*") {
						$("#dwcode").css("display", "none");
						$("#dwcode2").css("display", "none").attr("agency-code", onerdata.data.agencyCode);
					} else {
						$("#dwcode").css("display", "none");
						$("#dwcode3").css("display", "block").attr("agency-code", onerdata.data.agencyCode);
						$("#dwcode3 .dw-name").text(onerdata.data.agencyName)
					}

					//单位级下不能编辑系统级的方案和模版
					if(onerdata.className) { //单位级
						if(onerdata.data.agencyId == "*") {
							$(".allAgency").css("display", "block");
							$(".justAgency").css("display", "none");
						} else {
							$(".allAgency").css("display", "none");
							// $(".justAgency").css("display", "block");
						}
					}
				}

				//请求表格数据字段代码
				page.getColumnName();

			},
			DataSourceTypeHtml: function(result) {
				var data = result.data,
					dsHtml = "";
				// dataSourceType = data;
				typeData = data;
				//新增方案时内部子系统不显示
				for(var i in data) {
					// if(onerdata.action !== "editBill" && i == "00") {
					if(i == "00") { // CWYXM-19846：不显示内部子系统
						dsHtml += '';
					} else if(i == "02" || i == "03" || i == "04" || i == "06") {
						dsHtml += '<button class="btn btn-default" value="" data-id="' + i + '" data-show="1">' + data[i] + '</button>';
					} else {
						dsHtml += '<button class="btn btn-default" value="" data-id="' + i + '">' + data[i] + '</button>';
					}
				}
				$("#data-type").prepend(dsHtml);
				$("#data-type").find("button").eq(0).addClass("btn-primary").removeClass("btn-default").attr("active", "true");

				if(onerdata.action === "editBill") {
					// $('#IsTurnedBtn').addClass('hide');
					$('#data-type button[data-id="' + onerdata.data.dataType + '"]').attr({
						"class": "btn btn-primary",
						"active": true,
						"disabled": false
					}).siblings("button").attr({
						"class": "btn btn-default",
						"active": false,
						"disabled": true
					});
					if($('#nameform' + onerdata.data.dataType).length > 0) {
						$('#nameform' + onerdata.data.dataType).show();
						$("#showbase").show();
						if(onerdata.data.dataType == "02") {
							$('#btn-test').show();
						}
					}
					if(onerdata.data.dataType === "01" || onerdata.data.dataType === "02") {
						$("#IsTurnedBtn").removeClass("hide");
						if($("input[name='isTurned']").prop("checked")) { //如果选中了第一个 第二个显示
							$("#IsAllowBtn").removeClass("hide");
						}
					} else {
						$("#IsTurnedBtn").addClass("hide");
						$("#IsAllowBtn").addClass("hide");
					}
				} else {
					$('#IsTurnedBtn').removeClass('hide');
					$('#IsAllowBtn').addClass('hide');
				}

				page.showContent();

				var argu = {
					rgCode: pfData.svRgCode,
					setYear: pfData.svSetYear
				};
				ufma.get(interfaceURL.getAgencyTree, argu, page.getAgency);
			},
			//请求数据源类型
			getDataSourceType: function() {
				var url = "LP_DS_TYPE";
				var argu = {
					rgCode: pfData.svRgCode,
					setYear: pfData.svSetYear
				};
				ufma.get(interfaceURL.getEnumerate + url, argu, page.DataSourceTypeHtml);
			},
			getTableColumn: function(callback) {
				ufma.get(interfaceURL.getTableColumn, null, function(data) {
					if(data.data.true) {
						page.gwzjlist = data.data.true;
					} else {
						ufma.showTip(data.data.false, function() {}, 'error')
						return;
					}
					//测试
					// page.gwzjlist = [{ITEM_CODE:'111',ITEM_CODE_NAME:'AAA'},{ITEM_CODE:'222',ITEM_CODE_NAME:'BBB'},{ITEM_CODE:'333',ITEM_CODE_NAME:'CCC'},];//测试
					if(callback) {
						callback(page.gwzjlist);
					}
				});
			},
			//整理表格数据（新增）
			reTableData: function(data, i, enuCodeNO, enuCodeDate, mainEnuCodeNO, enuCodeSummary, reimbursement) {
				var isPk = '0',
					isPkName = '否',
					itemName = "",
					enuCode = "",
					enuName = "";
				if(data === "BILL_NO") {
					isPk = "1";
					isPkName = "是";
					itemName = "单据编号";
					enuCode = enuCodeNO;
					enuName = "单据编号";
				}
				if(data === "BILL_DATE") {
					isPk = "0";
					isPkName = "否";
					itemName = "单据日期";
					enuCode = enuCodeDate;
					enuName = "业务日期";
				}
				if(data === "FIELD01") {
					isPk = "0";
					isPkName = "否";
					itemName = "摘要";
					enuCode = enuCodeSummary;
					enuName = "摘要";
				}
				if(data === "FIELD32") {
					isPk = "0";
					isPkName = "否";
					itemName = "报销单号";
					enuCode = reimbursement;
					enuName = "普通字符型节点";
				}
				var obj = {
					ROWNU: (i + 1).toString(),
					LP_FIELD: data,
					COLUMN_NAME: data,
					IS_PK: isPk,
					ISPKNAME: isPkName,
					ITEM_CODE: "",
					ITEM_NAME: itemName,
					ENU_CODE: enuCode,
					ENU_NAME: enuName,
					eleCode: "",
					eleName: "",
					IS_DISPLAY: "1",
					ISDISPLAYNAME: "是",
					ORD_SEQ: ""
				};
				return obj;
			},
			//整理表格列数据
			columnArr: function() {
				var columnArr = [{
						data: "ORD_SEQ"
					},
					{
						data: "ITEM_CODE"
					},
					{
						data: "ITEM_NAME"
					},
					{
						data: "COLUMN_NAME"
					},
					{
						data: "IS_PK"
					},
					{
						data: "ENU_CODE"
					},
					{
						data: "ele_code"
					}
				];
				return columnArr;
			},
			//请求要素列表
			getEle: function() {
				var agencyCode = "*";
				if(onerdata.action === "editBill") { //编辑
					agencyCode = onerdata.data.agencyId;
				} else if(onerdata.agencyCode) {
					agencyCode = onerdata.agencyCode;
				}
				var url = interfaceURL.getEle + agencyCode;
				//请求要素列表
				var argu = {
					rgCode: pfData.svRgCode,
					setYear: pfData.svSetYear
				};
				ufma.get(url, argu, function(res) {
					eleList = res.data;
					// for(var i=0;i<eleList.length;i++){
					//     eleList[i].eleCode = eleList[i].accItemCode
					//     eleList[i].eleName = eleList[i].accItemName
					// }
					page.getSchemeById(eleList, agencyCode);

				});
			},
			//渲染table
			renderTableHtml: function(eleList, tableData) {

				var nameTableThead = $('#nameTableThead tr th');
				var theadLen = nameTableThead.length;
				var len = columnNameList.length;
				var tableDatas = [];
				var enuCodeNO = "",
					enuCodeDate = "",
					mainEnuCodeNO = "",
					enuCodeSummary = "",
					reimbursement = "";
				if(src.itemTypeData.length > 0) {
					for(var i = 0; i < src.itemTypeData.length; i++) {
						if(src.itemTypeData[i].ENU_NAME == "单据编号") {
							enuCodeNO = src.itemTypeData[i].ENU_CODE;
						} else if(src.itemTypeData[i].ENU_NAME == "业务日期") {
							enuCodeDate = src.itemTypeData[i].ENU_CODE
						} else if(src.itemTypeData[i].ENU_NAME == "主单据编号") {
							mainEnuCodeNO = src.itemTypeData[i].ENU_CODE
						} else if(src.itemTypeData[i].ENU_NAME == "摘要") {
							enuCodeSummary = src.itemTypeData[i].ENU_CODE
						} else if(src.itemTypeData[i].ENU_NAME == "普通字符型节点") {
							reimbursement = src.itemTypeData[i].ENU_CODE
						}
					}
				}
				//渲染tbody S
				if(tableData) { //编辑
					tableDatas = tableData;
					if(tableDatas[3].ITEM_CODE == "") {
						tableDatas[3].IS_PK = "0";
						tableDatas[3].ITEM_NAME = "摘要";
						tableDatas[3].ENU_CODE = "10";
						tableDatas[3].ENU_NAME = "摘要";
					}
					if(tableDatas[34].ITEM_CODE == "") {
						tableDatas[34].IS_PK = "0";
						tableDatas[34].ITEM_NAME = "报销单号";
						tableDatas[34].ENU_CODE = "08";
						tableDatas[34].ENU_NAME = "普通字符型节点";
					}
				} else { //新增
					for(var i = 0; i < len; i++) {
						//整理表格数据 S
						tableDatas.push(page.reTableData(columnNameList[i], i, enuCodeNO, enuCodeDate, mainEnuCodeNO, enuCodeSummary, reimbursement));
						//整理表格数据 E
					}
				}

				page.tableDatas = tableDatas;
				page.eleList = eleList;
				var type = $("#data-type").find("button[active='true']").attr("data-id");
				var isUsed = false;
				if(onerdata.data.isUsed == "1") {
					isUsed = true;
				}
				var isTurned = false;
				if(onerdata.data.isTurned == "1") {
					isTurned = true;
				}
				page.initTable2("nameTable2", tableDatas, eleList, type, isUsed, isTurned);
			},
			eleFun: function(result) {
				ufma.hideloading();
				columnNameList = result.data; //字段代码
				//请求要素列表
				page.getEle();
			},
			//请求纳税人名称列
			getColumnName: function() {
				ufma.showloading("正在加载数据，请耐心等待...");
				var argu = {
					rgCode: pfData.svRgCode,
					setYear: pfData.svSetYear
				};
				ufma.get(interfaceURL.getColumnName, argu, page.eleFun);
			},
			//初始化单据类型
			initBillType: function() {
				$("#billType").ufCombox({
					idField: "billTypeCode",
					textField: "billTypeName",
					data: [], //json 数据
					placeholder: "请选择单据类型",
					onChange: function(sender, data) {},
					onComplete: function(sender) {
						$("input").attr("autocomplete", "off");
					}
				});
			},
			//请求单据类型
			getBillType: function() {
				var argu = {
					rgCode: pfData.svRgCode,
					setYear: pfData.svSetYear,
					agencyCode: onerdata.agencyCode
				};
				ufma.get(interfaceURL.getBillTypes + $("#dataSonSystem").getObj().getValue(), argu, function(result) {
					$("#billType").getObj().load(result.data);
					if(onerdata.action === "editBill" && page.edit) {
						$("#billType").getObj().val(onerdata.data.billType);
						page.edit = false;
					} else {
						$("#billType").getObj().val("001");
					}

				})
			},
			//渲染来源子系统下拉
			initSonSystem: function() {
				// soSystemData.splice(0,1);
				$("#dataSonSystem").ufCombox({
					idField: "ENU_CODE",
					textField: "ENU_NAME",
					data: JSON.parse(soSystemData), //json 数据
					placeholder: "请选择来源子系统",
					onChange: function(sender, data) {
						page.getBillType();
					},
					onComplete: function(sender) {
						$("input").attr("autocomplete", "off");
						//如果是编辑状态下set内容
						page.setLpSchemeBaseDatas();
					}
				});
			},
			//请求字段类型
			getFieldType: function() {
				var argu = {
					rgCode: pfData.svRgCode,
					setYear: pfData.svSetYear
				};
				ufma.ajaxDef(interfaceURL.billItemType, "get", argu, function(result) {
					for(var i in result.data) {
						src.itemTypeData.push({
							"ENU_CODE": i,
							"ENU_NAME": result.data[i]
						});
					}
				});
			},
			//根据id请求方案（设置方案）
			getSchemeById: function(eleList, agencyCode) {
				if(onerdata.action === "editBill") {
					var tabArgu = {
						agencyCode: agencyCode,
						rgCode: pfData.svRgCode,
						setYear: pfData.svSetYear
					};
					var url = interfaceURL.getSchemeById + onerdata.data.schemeGuid + "/" + onerdata.data.dataType;
					ufma.get(url, tabArgu, page.setSchemeContent);
				} else {
					//渲染表格dom
					page.renderTableHtml(eleList);
				}

			},
			//请求http请求方式
			getHttpTypes: function() {
				var argu = {
					rgCode: pfData.svRgCode,
					setYear: pfData.svSetYear
				};
				ufma.get(interfaceURL.getEnumerateList + "LP_REQUEST_TYPE", argu, function(result) {
					var data = [];
					for(var i in result.data) {
						data.push({
							"ENU_CODE": i,
							"ENU_NAME": result.data[i]
						});
					}
					$("#requestType").ufCombox({
						idField: "ENU_CODE",
						textField: "ENU_NAME",
						data: data, //json 数据
						placeholder: "请选择数据请求方式",
						onChange: function(sender, data) {},
						onComplete: function(sender) {
							if(!page.setHttpType) {
								$("#requestType").getObj().val("001");
							}

						}
					});
				})
			},
			//编辑状态下set基础信息
			setLpSchemeBaseDatas: function() {
				if(onerdata.action === "editBill") {
					page.edit = true;
					//set方案名称、来源子系统等等
					var schemeDescribe = onerdata.data.schemeDescribe ? onerdata.data.schemeDescribe : "";
					$("#scheme-name").val(onerdata.data.schemeName);
					$("#dataSonSystem").getObj().val(onerdata.data.sysId);
					$("#scheme-describe1").val(schemeDescribe);
					$("#scheme-describe2").val(schemeDescribe);
					if(onerdata.data.isUsed == "1") {
						$("input[name='isUsed']").attr("checked", true);
					}
					if(onerdata.data.isTurned == "1") {
						$("input[name='isTurned']").attr("checked", true);
						$('#IsAllowBtn').removeClass('hide');
						if(onerdata.data.isAllow == "1") {
							$("input[name='isAllow']").prop("checked", true);
						}
					} else {
						$('#IsAllowBtn').addClass('hide');
						$("input[name='isAllow']").attr("checked", false);
					}
					if(onerdata.className && onerdata.data.agencyId == "*") { //单位级方案界面
						//单位级下不能编辑系统级的方案和模版
						//系统级的全都不能修改
						$("input").attr("disabled", true);
						$("#dataSonSystem").getObj().setEnabled(false);
						$("#billType").getObj().setEnabled(false);
						$("#data-type button").attr("disabled", true);
						$("#scheme-describe1").attr("disabled", true);
						$("#scheme-describe2").attr("disabled", true);
						$("#btn-save").attr("disabled", true);
						$("textarea").attr("disabled", true);
						$("#nameform02").disable();
						$("#nameform03").disable();
						$("#nameform04").disable();

					}
					// else if (onerdata.data.billNum == "true" || onerdata.data.temNum == "true") {
					//     //单据导入了数据或者增加了模版，则仅有描述可以修改
					//     $("input").attr("disabled", true);
					//     $("#dataSonSystem").getObj().setEnabled(false);
					//     $("#data-type button").attr("disabled", true);
					//     $("#billType").getObj().setEnabled(false);
					//     $("#nameform02").disable();
					//     $("#nameform03").disable();
					//     $("#nameform04").disable();
					// }
					return false;
				}
				$("#dataSonSystem").getObj().val("001");
			},
			//xml导入赋值
			setLabelData: function(data) {
				$("#labelName").val(data.LABEL_NAME);
				$("#labelProperties").val(data.LABEL_PROPERTIES);
				$("#labelPropertiesValue").val(data.LABEL_PROPERTIES_VALUE);
				$("#lableTag").val(data.LABEL);
			},
			//编辑状态下set表格信息
			setSchemeContent: function (result) {
				var data = result.data;
				page.createDate = data[1].CREATE_DATE;
				page.createUser = data[1].CREATE_USER;
				for (var i = 0; i < data.length; i++) {
					data[i].eleCode = data[i].ELE_CODE;
					data[i].eleName = data[i].ELE_NAME;
				}
				//渲染表格dom
				page.renderTableHtml(eleList, data);
				//set中间库基本信息
				var type = $("#data-type").find("button[active='true']").attr("data-id");
				if (type == "02") {
					$('#describeWrap1').addClass('hide');
					$('#describeWrap2').removeClass('hide');
					page.setBaseData(data[1]);
				} else if (type == "03") {
					page.setWebBaseData(data[1]);
				} else if (type == "04") {
					page.setHttpBaseData(data[1]);
				} else if (type == "06") {
					page.setLabelData(data[1]);
				}
				for (var i = 0; i < data.length; i++) {
					if (data[i].COLUMN_NAME == "BILL_NO") {
						vouFonfigEdit = {
							"jointSearchAddress": data[i].JOINT_SEARCH_ADDRESS,
							"showfield": data[i].SHOWFIELD,
							"valuefield": data[i].VALUEFIELD
						}
					}
				}
				vouFonfigData = vouFonfigEdit;
				if(data[0].IS_INTERNAL_SYSTEM == "1") { // 内部子系统
					$("input[name='isInternalSystem']").attr("checked", true);
				} else {
					$("input[name='isInternalSystem']").attr("checked", false);
				}
			},
			//get中间库信息
			getBaseData: function() {
				var run = {};
				run["名称"] = {
					value: $("#connectName").val(),
					name: "connectName"
				};
				run["数据库类型"] = {
					value: $("#databaseType").getObj().getValue(),
					name: "databaseType"
				};
				run["数据库名称"] = {
					value: $("#databaseName").val(),
					name: "databaseName"
				};
				run["主机名"] = {
					value: $("#hostName").val(),
					name: "hostName"
				};
				run["端口"] = {
					value: $("#port").val(),
					name: "port"
				};
				run["数据库用户名"] = {
					value: $("#databaseUsername").val(),
					name: "databaseUsername"
				};
				run["口令"] = {
					value: $("#databasePassword").val(),
					name: "databasePassword"
				};
				run["表名或视图"] = {
					value: $("#tableName").val(),
					name: "tableName"
				};
				run["取数语句"] = {
					value: $("#statements").val(),
					name: "statements"
				};
				run["回写语句"] = {
					value: $("#reStatements").val(),
					name: "reStatements"
				};

				return run;
			},
			//set中间库信息
			setBaseData: function(data) {
				$("#connectName").val(data.CONNECT_NAME);
				$("#databaseType").getObj().val(data.DATABASE_TYPE);
				$("#databaseName").val(data.DATABASE_NAME);
				$("#hostName").val(data.HOST_NAME);
				$("#port").val(data.PORT);
				$("#databaseUsername").val(data.DATABASE_USERNAME);
				$("#databasePassword").val(data.DATABASE_PASSWORD);
				$("#tableName").val(data.TABLE_NAME);
				$("#statements").val(data.STATEMENTS);
				$("#reStatements").val(data.RE_STATEMENTS);
				console.log(data.IS_ACCT_CODE);
				if(data.IS_ACCT_CODE === '1') {
					$("input[name='isAcctCode']").prop('checked', true);
				} else {
					$("input[name='isAcctCode']").prop('checked', false);
				}
			},
			//set webservice信息
			setWebBaseData: function(data) {
				$("#username").val(data.USERNAME);
				$("#password").val(data.PASSWORD);
				$("#url").val(data.URL);
				$("#method").val(data.METHOD);
			},
			//set HTTP信息
			setHttpBaseData: function(data) {
				$("#requestType").getObj().val(data.REQUEST_TYPE);
				$("#parameter").val(data.PARAMETER);
				$("#httpUrl").val(data.URL);
				$("#authority").val(data.AUTHORITY);
				page.setHttpType = true;
			},
			//校验中间库基本信息并为保存结构赋值
			checkRelationBaseDatas: function() {
				var baseDatas = page.getBaseData();
				var result = false,
					newBaseDatas = {};
				for(var i in baseDatas) {
					if(baseDatas[i].value == "" || baseDatas[i].value == undefined || baseDatas[i].value == null) {
						if(i != "语句" && i != "表名或视图" && i != "取数语句" && i != "回写语句") {
							ufma.showTip("中间库" + i + "不能为空", function() {

							}, "warning");
							result = true;
							break;
						}
					} else {
						newBaseDatas[baseDatas[i].name] = baseDatas[i].value;
					}
				}
				if(result) {
					return false
				}
				newBaseDatas["rgCode"] = pfData.svRgCode;
				newBaseDatas["setYear"] = pfData.svSetYear;
				return newBaseDatas;
			},
			//校验webservice基本信息并为保存结构赋值
			checkWebBaseDatas: function() {
				if($("#url").val() == "") {
					ufma.showTip("webservice服务器地址不能为空", function() {

					}, "warning");
					return false;
				}
				if($("#username").val() == "") {
					ufma.showTip("webservice用户名不能为空", function() {

					}, "warning");
					return false;
				}
				if($("#password").val() == "") {
					ufma.showTip("webservice密码不能为空", function() {

					}, "warning");
					return false;
				}
				var obj = {
					url: $("#url").val(),
					username: $("#username").val(),
					password: $("#password").val(),
					method: $("#method").val(),
				};
				return obj;

			},
			//校验基本信息并为保存结构赋值
			checkBaseDatas: function() {
				//数据源名称、描述等
				var obj = {},
					agencyCode = "*";
				if(onerdata && onerdata.action === "editBill") {
					obj.agencyCode = onerdata.data.agencyId;
				} else if(onerdata.className) {
					obj.agencyCode = onerdata.agencyCode;
				} else {
					// if ($('input[name="subUnits"]:checked').val() == "*") {
					//     tabArgu.lpScheme.agencyCode = "*";
					// } else {
					//     if (page.agency == undefined || $("#bdAgency_input").val() == "") {
					//         tabArgu.lpScheme.agencyCode = "*";
					//     } else {
					//         tabArgu.lpScheme.agencyCode = page.agency.getValue();
					//     }
					// }
					obj.agencyCode = agencyCode;
				}
				if(obj.agencyCode == "" || obj.agencyCode == undefined) {
					ufma.showTip("单位不能为空", function() {}, "warning");
					return false;
				}
				obj.createDate = page.createDate ? page.createDate : ""; //创建时间
				obj.createUser = page.createUser ? page.createUser : ""; //创建用户
				obj.schemeName = $("#scheme-name").val(); //方案名称
				obj.dataSrcType = $("#data-type").find('button[active="true"]').attr("data-id"); //数据源类型
				obj.schemeDescribe = obj.dataSrcType === '02' ? $("#scheme-describe2").val() : $("#scheme-describe1").val(); //方案描述
				obj.sysId = $("#dataSonSystem").getObj().getValue(); //来源子系统
				if(obj.sysId=='' || obj.sysId==undefined){
					ufma.showTip("来源子系统不能为空", function() {}, "warning");
					return false
				}
				obj.billTypeCode = $("#billType").getObj().getValue();
				if($("input[name='isUsed']:checked").length > 0) {
					obj.isUsed = "1";
				} else {
					obj.isUsed = "0";
				}
				if(!$('#describeWrap2').hasClass('hide') && $("input[name='isAcctCode']:checked").length > 0) {
					obj.isAcctCode = "1";
				} else {
					obj.isAcctCode = "0";
				}
				if($("input[name='isTurned']:checked").length > 0) {
					obj.isTurned = "1";
				} else {
					obj.isTurned = "0";
				}
				if($("input[name='isAllow']:checked").length > 0) {
					obj.isAllow = "1";
				} else {
					obj.isAllow = "0";
				}
				if($("input[name='isInternalSystem']:checked").length > 0) {
					obj.isInternalSystem = "1";
				} else {
					obj.isInternalSystem = "0";
				}
				if(obj.schemeName == "" || obj.schemeName == undefined || obj.schemeName == null) {
					ufma.showTip("方案名称不能为空", function() {}, "warning");
					return false;
				}
				return obj;
			},
			//校验http基本信息并为保存结构赋值
			chechHttpBaseDatas: function() {
				if($("#httpUrl").val() == "") {
					ufma.showTip("http地址不能为空", function() {

					}, "warning");
					return false;
				}
				if($("#requestType").getObj().getValue() == "") {
					ufma.showTip("http请求方式不能为空", function() {

					}, "warning");
					return false;
				}

				var obj = {
					url: $("#httpUrl").val(),
					requestType: $("#requestType").getObj().getValue(),
					parameter: $("#parameter").val(),
					authority: $("#authority").val()
				};
				return obj;
			},
			saveBillScheme: function() {
				var tabArgu = {};
				tabArgu.lpScheme = {};
				tabArgu.lpRelationConfig = {};
				tabArgu.lpWebserviceInfo = {};
				tabArgu.lpHttpInfo = {};
				tabArgu.lpBillItems = [];
				var lpXmlConfig = $('#nameform06').serializeObject(); //获取xml导入时input框值
				tabArgu.lpXmlConfig = lpXmlConfig; //xml导入
				
				//基本信息校验并取值 S
				if (page.checkBaseDatas()) {
					tabArgu.lpScheme = page.checkBaseDatas();
				} else {
					return false;
				}
				//基本信息校验并取值 E

				//中间库基本信息校验并取值 S
				var type = $("#data-type").find("button[active='true']").attr("data-id");
				if(type == "02") {
					var baseDatas = page.checkRelationBaseDatas();
					if(baseDatas) {
						tabArgu.lpRelationConfig = baseDatas;
					} else {
						return false;
					}
				}
				//中间库基本信息校验并取值 E
				// if (type != '06') { // 工单CWYXM-19111 去掉此判断条件
					//检查凭证配置信息
					tabArgu.lpSchemeJointSearch = (!$.isNull(vouFonfigData)) ? vouFonfigData : {};
				// }
				//webservice基本信息校验并取值 S
				if(type == "03") {
					var webBaseDatas = page.checkWebBaseDatas();
					if(webBaseDatas) {
						tabArgu.lpWebserviceInfo = webBaseDatas;
					} else {
						return false;
					}
				}
				//webservice基本信息校验并取值 E

				//http基本信息校验并取值 S
				if(type == "04") {
					var httpBaseDatas = page.chechHttpBaseDatas();
					if(httpBaseDatas) {
						tabArgu.lpHttpInfo = httpBaseDatas;
					} else {
						return false;
					}
				}
				//公务之家 无参数 无校验

				//http基本信息校验并取值 E
				//xml基本信息校验
				if(type == "06") {
					var lpXmlConfig = $('#nameform06').serializeObject(); //获取xml导入时input框值
					if($.isNull(lpXmlConfig.labelName)) {
						ufma.showTip('表标签名不能为空', function() {}, 'warning');
						return false;
					}
					if($.isNull(lpXmlConfig.labelProperties)) {
						ufma.showTip('表标签属性不能为空', function() {}, 'warning');
						return false;
					}
					if($.isNull(lpXmlConfig.labelPropertiesValue)) {
						ufma.showTip('表标签属性值不能为空', function() {}, 'warning');
						return false;
					}
					if($.isNull(lpXmlConfig.label)) {
						ufma.showTip('行标签不能为空', function() {}, 'warning');
						return false;
					}
					if(!$.isNull(lpXmlConfig.labelName) && !$.isNull(lpXmlConfig.labelProperties) && !$.isNull(lpXmlConfig.labelPropertiesValue) && !$.isNull(lpXmlConfig.label)) {
						tabArgu.lpXmlConfig = lpXmlConfig; //xml导入
					}
				}
				//表格数据校验并保存
				var tabtleDatas = $("#nameTable2").getObj().getData();
				var trLen = tabtleDatas.length;
				var requireField = [];
				//保存时把后台返回的表格数据的每一行的BILL_TYPE_GUID、IS_DISPLAY、ITEM_TYPE、PARENT_CODE全都传回去
				var resultVal = false,
					seqArray = [],
					haveOrdSeq = false;
				for(var i = 0; i < trLen; i++) {
					var rowArr = {};
					console.log(tabtleDatas[i]);
					if(seqArray.indexOf(parseInt(tabtleDatas[i].ORD_SEQ)) > -1) {
						ufma.showTip("顺序列重复，请修改", function() {}, "warning");
						seqArray = [];
						resultVal = true;
						break;
					} else {
						rowArr.ordSeq = tabtleDatas[i].ORD_SEQ;
						if(rowArr.ordSeq != "") {
							haveOrdSeq = true;
							seqArray.push(parseInt(rowArr.ordSeq));
						}
					}
					rowArr.itemCode = tabtleDatas[i].ITEM_CODE;
					//新增时表格里不带下面这四个值，所以做了判断
					rowArr.billTypeGuid = tabtleDatas[i].BILL_TYPE_GUID ? tabtleDatas[i].BILL_TYPE_GUID : "";
					rowArr.isDisplay = tabtleDatas[i].IS_DISPLAY ? tabtleDatas[i].IS_DISPLAY : "";
					// rowArr.itemType = tabtleDatas[i].ITEM_TYPE ? tabtleDatas[i].ITEM_TYPE : "";
					rowArr.parentCode = tabtleDatas[i].PARENT_CODE ? tabtleDatas[i].PARENT_CODE : "";

					if(tabtleDatas[i].ITEM_CODE || tabtleDatas[i].ITEM_NAME || tabtleDatas[i].ENU_CODE) {
						rowArr.itemName = tabtleDatas[i].ITEM_NAME;
						rowArr.lpField = tabtleDatas[i].COLUMN_NAME;
						//由于去掉一行，导致报销单号序号应为34 guohx 20200728 此处报销单号不必填 不校验
						if(tabtleDatas[i].ITEM_CODE == "" && i != 3 && i != 34) {
							var type = $("#data-type").find("button[active='true']").attr("data-id");
							if(type == "02") {
								ufma.showTip("第" + (i + 1) + "行请填写中间库字段", function() {

								}, "warning");
								resultVal = true;
								break;
							} else if(type == "05") {
								ufma.showTip("第" + (i + 1) + "行请填写视图字段", function() {

								}, "warning");
								resultVal = true;
								break;
							} else if(type != "06" && type != "02" && type != "05") {
								ufma.showTip("第" + (i + 1) + "行请填写EXCEL列", function() {

								}, "warning");
								resultVal = true;
								break;
							}
						}
						if(tabtleDatas[i].ITEM_NAME == "" && i != 3 && i != 34) {
							ufma.showTip("第" + (i + 1) + "行请填写别名", function() {

							}, "warning");
							resultVal = true;
							break;
						}
						if(tabtleDatas[i].ENU_CODE == "" && i != 3 && i != 34) {
							ufma.showTip("第" + (i + 1) + "行请填写字段类型", function() {

							}, "warning");
							resultVal = true;
							break;
						}
						//xml基本信息校验
						if(type == "06") {
							if(!$.isNull(tabtleDatas[i].ITEM_CODE)) {
								if($.isNull(tabtleDatas[i].XML_NAME)) {
									ufma.showTip("第" + (i + 1) + "行请填写字段标签属性名", function() {}, 'warning');
									return false;
								} else if($.isNull(tabtleDatas[i].XML_VALUE)) {
									ufma.showTip("第" + (i + 1) + "行请填写字段标签属性值", function() {}, 'warning');
									return false;
								}
							}
						}
						if(((i == 3 || i == 34) && tabtleDatas[i].ITEM_CODE != "" && tabtleDatas[i].ITEM_NAME != "" && tabtleDatas[i].ENU_CODE != "") || (i != 3 && i != 34)) {
							rowArr.isPk = tabtleDatas[i].IS_PK;
							if(rowArr.isPk === "" || rowArr.isPk === null || rowArr.isPk === undefined) {
								rowArr.isPk = "0";
							}
							rowArr.enuCode = tabtleDatas[i].ENU_CODE;
							rowArr.enuName = tabtleDatas[i].ENU_NAME;
							rowArr.eleCode = tabtleDatas[i].eleCode;
							rowArr.isHold = tabtleDatas[i].IS_HOLD;
							rowArr.isTurn = tabtleDatas[i].IS_TURN;
							rowArr.isAllow = tabtleDatas[i].IS_ALLOW;
							if(type == "06") {//保存时字段为字段标签属性名 labelPropertiesName、字段标签属性值labelPropertiesValue，回显时为XML_NAME、XML_VALUE
								rowArr.labelPropertiesName = tabtleDatas[i].XML_NAME;
								rowArr.labelPropertiesValue = tabtleDatas[i].XML_VALUE;
							}
							if(rowArr.enuName == "要素" && rowArr.eleCode == "") {
								ufma.showTip("第" + tabtleDatas[i].ROWNU + "行数据必须选择对应要素", function() {}, "warning");
								resultVal = true;
								break;
							}
							if(requireField.indexOf(rowArr.enuCode) < 0) {
								requireField.push(rowArr.enuCode);
							}
							tabArgu.lpBillItems.push(rowArr);
						}

					}

				}
				if(!haveOrdSeq){
					tabArgu.lpBillItems.forEach(function(item,index){
						item.ordSeq = index + 1
					})
				}
				if(resultVal) {
					return false;
				}
				if(requireField.indexOf("05") < 0) {
					ufma.showTip("必须有一个字段类型选择金额", function() {}, "warning");
					return false;
				}
				if(tabArgu.lpBillItems.length > 0) {
					tabArgu.rgCode = pfData.svRgCode;
					tabArgu.setYear = pfData.svSetYear;
					var callback = function(result) {
						var closeTip = function() {
							_close("save");
						};
						ufma.showTip(result.msg, closeTip, result.flag);
					};
					$("button").attr("disabled", true);
					if(onerdata.action === "editBill") {
						tabArgu.lpScheme.schemeGuid = onerdata.data.schemeGuid;
						ufma.post(interfaceURL.updateSchemeById, tabArgu, callback);
					} else {
						ufma.post(interfaceURL.saveSchemeConfig, tabArgu, callback);
					}
					var timeId = setTimeout(function() {
						$("button").attr("disabled", false);
						clearTimeout(timeId);
					}, 5000)

				} else {
					ufma.showTip("请填写表格数据", function() {}, "warning");
				}
			},
			//初始化页面
			initPage: function() {
				//权限控制
				page.reslist = ufma.getPermission();
				ufma.isShow(page.reslist);
				//初始化表格
				var type = onerdata.data.dataType;
				if(onerdata.action === "editBill") {
					$("#isInternalSys").removeClass("hide");
				} else {
					$("#isInternalSys").addClass("hide");
				}
				page.initTable2("nameTable2", [], [], type, false, false);
				//请求数据源类型
				page.getDataSourceType();
				//渲染来源子系统下拉
				page.initSonSystem();
				//请求字段类型
				page.getFieldType();
				//初始化单据类型
				page.initBillType();
				page.initbaseType();
				//请求http选择方式
				page.getHttpTypes();

			},
			//页面元素事件绑定使用jquery 的 on()方法
			onEventListener: function() {
				//选中单位的时候,单位下拉才会出现
				$('input[name="subUnits"]').on('change', function() {
					if($('input[name="subUnits"]:checked').val() == "*") {
						//所属单位为全局
						$("#bdAgencyEdit").css({
							"visibility": "hidden"
						});
						//page.agency.setValue("0","全部"); //目前不好使
						$("#bdAgencyEdit_input").val("");
						// page.showContent();
					} else {
						//所属单位为所选单位
						$("#bdAgencyEdit").css({
							"visibility": "visible"
						});
						// page.showContent();
					}
					//选择单位事重新获取单位对应的要素并重新渲染table
					page.getEle();
				});
				//点数据源类型切换类型
				$("#data-type").on('click', 'button', function(e) {
					if(!$(this).hasClass("btn-primary")) {
						$(this).addClass("btn-primary").removeClass("btn-default").attr('active', 'true').siblings("button").removeClass("btn-primary").addClass("btn-default").attr('active', 'false');
						if($(this).attr('data-show') == "1") {
							$("#showbase").show();
							$("#showbase").html('<span class="icon-angle-top"></span>收起');
							$('#btn-test').hide();
							$('#nameform' + $(this).attr('data-id')).show();
							$('#nameform' + $(this).attr('data-id')).siblings(".nameform").hide();
							if($(this).attr('data-id') == '02') {
								$('#btn-test').show();
							}
						} else {
							$("#showbase").hide();
							$('#btn-test').hide();
							$('.nameform').hide();
						}
						//XML 不显示凭证联查配置按钮  guohx 20200708
						if ($(this).attr('data-id') == '06') {
							$('#vouConfig').hide();
						} else {
							$('#vouConfig').show();
						}
						var isUsed = false;
						if($("input[name='isUsed']:checked").length > 0) {
							isUsed = true;
						}
						// liuyyn 添加转换
						var isTurned = false;
						if($("input[name='isTurned']:checked").length > 0) {
							isTurned = true;
						}
						var type = $("#data-type").find("button[active='true']").attr("data-id");
						page.initTable2("nameTable2", page.tableDatas, page.eleList, type, isUsed, isTurned);
					}
					//新需求 描述框后添加了 是否按“账套取数”的勾选项
					if($(this).attr('data-id') == "02") {
						$('#describeWrap1').addClass('hide');
						$('#describeWrap2').removeClass('hide');
					} else {
						$('#describeWrap1').hasClass('hide') ? $('#describeWrap1').removeClass('hide') : false;
						$('#describeWrap2').hasClass('hide') ? true : $('#describeWrap2').addClass('hide');
					}
					// liuyyn 
					// sunch 无论是新增还是编辑状态 选择 "EXCEL" 和 "中间库" 显示"数据转换"选择框 IsTurnedBtn 其他按钮都不显示
					if($(this).attr('data-id') == "01" || $(this).attr('data-id') == "02") {
						$("#IsTurnedBtn").removeClass("hide");
						if($("input[name='isTurned']").prop("checked")) { //如果选中了第一个 第二个显示
							$("#IsAllowBtn").removeClass("hide");
						}
					} else {
						$("#IsTurnedBtn").addClass("hide");
						$("#IsAllowBtn").addClass("hide");
					}
				});
				$("#showbase").on('click', function(e) {
					if($(this).find('span').hasClass("icon-angle-top")) {
						$(this).html('<span class="icon-angle-bottom"></span>展开');
						$('.nameform').hide()
					} else {
						$(this).html('<span class="icon-angle-top"></span>收起');
						var type = $("#data-type").find("button[active='true']").attr("data-id");
						$('#nameform' + type).show()

					}

				});
				//取消
				$(document).on("click", "#btn-qx", function(e) {
					_close("cancel");
				});
				$(document).on("click", "#btn-close", function(e) {
					_close("cancel");
				});
				//公式编辑器
				$("body").on("click", ".set-form-li .uf-buttonedit-button", function() {
					var allid = $(this).parents(".set-form-li").attr("id");
					var elecode = $(this).prev("input").attr("elecode");
					ufma.open({
						url: '../formulaeditor/formulaEditor.html',
						title: '公式编辑器',
						width: 656,
						height: 500,
						data: {
							// billTypeGuid: "111",
							// agencyCode: danwei,
							// eleCode: elecode,
							targetBill: 'LP_VOU_TEMPLATE',
							allid: allid,
							thisId: "templateGeneration",
							// UPagencyCode: onerdata.data.UPagencyCode,
							FormulaEditorVal: $("#" + allid).find("input").val()
						},
						ondestory: function(data) {
							//窗口关闭时回传的值
							$("#" + data.action.alldata.allid).find("input").val(data.action.val)
						}
					});
				});
				//方案配置保存
				$("body").on("click", "#btn-save", function() {
					if(onerdata.data.temNum == "true" && onerdata.data.billNum == "true") {
						ufma.confirm('当前单据方案已经存在凭证模板并且导入了数据，请确定是否要修改', function(action) {
							if(action) {
								//点击确定的回调函数
								page.saveBillScheme();
							} else {
								//点击取消的回调函数
							}
						}, {
							type: 'warning'
						});
						return false;
					} else if(onerdata.data.temNum == "true") {
						ufma.confirm('当前单据方案已经存在凭证模板，请确定是否要修改', function(action) {
							if(action) {
								//点击确定的回调函数
								page.saveBillScheme();
							} else {
								//点击取消的回调函数
							}
						}, {
							type: 'warning'
						});
						return false;
					} else if(onerdata.data.billNum == "true") {
						ufma.confirm('当前单据方案已经导入了数据，请确定是否要修改', function(action) {
							if(action) {
								//点击确定的回调函数
								page.saveBillScheme();
							} else {
								//点击取消的回调函数
							}
						}, {
							type: 'warning'
						});
						return false;
					}
					page.saveBillScheme();

				});
				//测试配置
				$('body').on("click", "#btn-test", function() {
					var argu = {};
					var baseDatas = page.checkRelationBaseDatas();
					if(baseDatas) {
						argu = baseDatas;
					} else {
						return false;
					}
					$("#btn-test").attr("disabled", true);
					ufma.post(interfaceURL.testLpRelationConfig, argu, function(result) {
						ufma.showTip(result.msg, function() {

						}, result.flag);
						page.dbDatas = result.data;
						var type = $("#data-type").find("button[active='true']").attr("data-id");
						var isUsed = false;
						if($("input[name='isUsed']:checked").length > 0) {
							isUsed = true;
						}
						// liuyyn 添加转换
						var isTurned = false;
						if($("input[name='isTurned']:checked").length > 0) {
							isTurned = true;
						}
						page.initTable2("nameTable2", page.tableDatas, page.eleList, type, isUsed, isTurned);
					});
					var timeId = setTimeout(function() {
						$("#btn-test").attr("disabled", false);
						clearTimeout(timeId);
					}, 5000);
				});
				//启用挂接
				// $("input[name='isUsed']").on("change", function (e) {
				//     var tabtleDatas = $("#nameTable2").getObj().getData();
				//     var type = $("#data-type").find("button[active='true']").attr("data-id");

				//     if ($(this).prop("checked")) {
				//         var isUsed = true;
				//         page.initTable2("nameTable2", tabtleDatas, page.eleList, type, isUsed);
				//     } else {
				//         var isUsed = false;
				//         page.initTable2("nameTable2", tabtleDatas, page.eleList, type, isUsed);
				//     }
				// })
				//liuyyn 启用挂接 添加启用转换
				$("input").on("change", function(e) {
					var tabtleDatas = $("#nameTable2").getObj().getData();
					var type = $("#data-type").find("button[active='true']").attr("data-id");
					if($(this).attr("name") === "isUsed") {
						var isUsed = $(this).prop("checked") ? true : false;
						var isTurned = $("input[name='isTurned']").prop("checked") ? true : false;
						page.initTable2("nameTable2", tabtleDatas, page.eleList, type, isUsed, isTurned);
					} else if($(this).attr("name") === "isTurned") {
						if($(this).prop("checked")) {
							$('#IsAllowBtn').removeClass('hide');
						} else {
							$("input[name='isAllow']").prop("checked", false);
							$('#IsAllowBtn').addClass('hide');
						}
						var isTurned = $(this).prop("checked") ? true : false;
						var isUsed = $("input[name='isUsed']").prop("checked") ? true : false;
						page.initTable2("nameTable2", tabtleDatas, page.eleList, type, isUsed, isTurned);
					}
				})
				//凭证联查配置
				$("#vouConfig").on('click', function(e) {
					ufma.open({
						url: 'vouConfig.html',
						title: '凭证联查配置',
						width: 1000,
						height: 320,
						data: {
							"vouFonfigEdit": vouFonfigEdit,
							"action" : onerdata.action 
						},
						ondestory: function(data) {
							//窗口关闭时回传的值
							if (data.action == "save") {
								vouFonfigData = data.resultData;
							}
						}
					});
				});
			},
			//此方法必须保留
			init: function() {
				ufma.parse();
				this.initPage();
				this.onEventListener();
			}
		}
	}();
	page.init();
});