$(function () {
	window._close = function (state, id) {
		if (window.closeOwner) {
			var data = {
				action: state
			};
			window.closeOwner(data);
		}
	}
	var page = function () {
		var beginList = {
			saveBankReconBegin: "/cu/bankInit/saveBankBalAccInit", //保存银行对账期初
			getEleTree: "/cu/common/getAccItemTree", ////获取结算方式和票据类型
			getBookTree: "/cu/cuAccountBook/getBookTree", //获取账簿树
		};
		var billTypeData = []; //票据类型
		var accountbookData = []; //账簿
		var items; //辅助项
		var accountBookType; //账簿类别
		var accountbookObj = {};
		var accitemShow = {};
		var vouTypeData = []; //凭证类型
		var balance;
		return {
			//获取账簿
			getAccBook: function () {
				ufma.ajaxDef(beginList.getBookTree, "get", {
					agencyCode: window.ownerData.agencyCode,
					acctCode: window.ownerData.acctCode,
					rgCode: ufma.getCommonData().svRgCode,
					setYear: ufma.getCommonData().svSetYear,
					enabled: "1"
				},
					function (result) {
						var data = result.data;
						for (var i = 0; i < data.length; i++) {
							var obj = {};
							var ele = "accountbook"
							var code = ele + "Code";
							var codeName = ele + "Name";
							obj[code] = data[i].ACCOUNTBOOK_CODE;
							obj[codeName] = data[i].accountbookName;
							obj["accountbookGuid"] = data[i].ID;
							obj["id"] = data[i].ID;
							obj["pId"] = data[i].PID;
							obj["accoCode"] = data[i].ACCO_CODE;
							obj["acctCode"] = data[i].ACCT_CODE;
							obj["accountBookType"] = data[i].ACCOUNTBOOK_TYPE; //账簿类别
							obj["requiredACC"] = data[i].REQUIRED_ACCITEM; //辅助核算项是否必填
							obj["isLamonKeep"] = data[i].IS_LAMON_KEEP; //上月未结账不允许做账
							obj["isStrictbook"] = data[i].IS_STRICTBOOK; //账簿余额不足不允许支出
							obj["balByAccitem"] = data[i].BAL_BY_ACCITEM; //按照辅助核算项计算余额的辅助项
							accountbookData.push(obj);
						}
					});
			},
			//获取票据类型
			getBillType: function () {
				ufma.ajaxDef(beginList.getEleTree, "get", {
					agencyCode: window.ownerData.agencyCode,
					rgCode: ufma.getCommonData().svRgCode,
					eleCode: "BILLTYPE",
					setYear: ufma.getCommonData().svSetYear
				},
					function (result) {
						var data = result.data;
						for (var i = 0; i < data.length; i++) {
							var obj = {};
							var ele = "billtype"
							var code = ele + "Code";
							var codeName = ele + "CodeName";
							obj[code] = data[i].code;
							obj[codeName] = data[i].codeName;
							obj["pId"] = data[i].pId;
							billTypeData.push(obj);
						}
					});
			},
			//获取凭证
			getVoutype: function () {
				var agencyCode = window.ownerData.agencyCode;
				var acctCode = window.ownerData.acctCode;
				var setYear = window.ownerData.setYear;
				var accaCode = '*';
				var vouUrl = '/cu/eleVouType/getVouType' + '/' + agencyCode + '/' + setYear + '/' + acctCode + '/' + accaCode;
				ufma.get(vouUrl, '', function (result) {
					for (var i = 0; i < result.data.length; i++) {
						var obj = {};
						var ele = "vouType"
						var code = ele;
						var codeName = ele + "Name";
						obj[code] = result.data[i].code;
						obj[codeName] = result.data[i].codeName;
						obj["pId"] = result.data[i].pId;
						vouTypeData.push(obj);
					}
				});
			},

			//根据选择账簿获取辅项
			getAsiistItemByAccount: function (accoCode, accountbookGuid) {
				var argu = {
					"acctCode": window.ownerData.acctCode,
					"accoCode": accoCode,
					"agencyCode": window.ownerData.agencyCode,
					"setYear": window.ownerData.setYear,
					"rgCode": window.ownerData.rgCode,
					"accountbookGuid": accountbookGuid
				}
				ufma.ajaxDef('/cu/common/getAccItemList', 'get', argu, function (result) {
					page.items = result.data;
				})
				return page.items;
			},
			//组织可编辑表格表格数据
			fixedTable: function (data) {
				// var data = [];
				var columns = [
					[ //支持多表头
						{
							type: 'indexcolumn',
							field: 'ordSeq',
							name: '序号',
							width: 50,
							headalign: 'center',
							align: 'center'
						},
						{
							type: 'input',
							field: 'summary',
							name: '明细摘要',
							width: 200,
							headalign: 'center'
						},
						{
							type: 'treecombox',
							field: 'accountbookGuid',
							name: '账簿',
							width: 150,
							headalign: 'center',
							idField: 'accountbookGuid', //可选
							pIdField: 'pId',
							textField: 'accountbookName', //可选
							leafRequire: true,
							data: accountbookData,
							render: function (rowid, rowdata, data) {
								return rowdata.accountbookName;
							},
							onChange: function (e) {
								var accoCode = e.itemData.accoCode;
								var accountbookGuid = e.itemData.accountbookGuid;
								var accountAttr = {};
								if (!$.isNull(accoCode)) {
									accountAttr.accoCode = e.itemData.accoCode;
									accountAttr.accountBookType = e.itemData.accountBookType;
									accountAttr.acctCode = e.itemData.acctCode;
									accountAttr.accItems = page.getAsiistItemByAccount(accoCode, accountbookGuid);
									accountAttr.accountbookGuid = accountbookGuid;
									accountAttr.requiredACC = e.itemData.requiredACC;
									accountAttr.isLamonKeep = e.itemData.isLamonKeep;
									accountAttr.isStrictbook = e.itemData.isStrictbook;
									accountAttr.balByAccitem = e.itemData.balByAccitem;
									if ($.isNull(accountbookObj[accountAttr.accountbookGuid])) {
										accountbookObj[accountAttr.accountbookGuid] = accountAttr;
									}
								}
								console.log(accountbookObj);
							},
							beforeExpand: function (e) { }
						},
						{
							type: 'money',
							field: 'drMoney',
							name: '借方金额',
							visible: false,
							width: 100,
							headalign: 'center',
							align: 'right',
							render: function (rowid, rowdata, data) {
								if (!data || data == "0.00" || data == 0) {
									return '';
								}
								return $.formatMoney(data, 2);
							},
							onKeyup: function (sdr) {
								$("#bookTablemoneycrMoney").val('');
							}
						},
						{
							type: 'money',
							field: 'crMoney',
							name: '贷方金额',
							width: 100,
							headalign: 'center',
							align: 'right',
							render: function (rowid, rowdata, data) {
								if (!data || data == "0.00" || data == 0) {
									return '';
								}
								return $.formatMoney(data, 2);
							},
							onKeyup: function (sdr) {
								$("#bookTablemoneydrMoney").val('');
							}
						},
						{
							type: 'treecombox',
							field: 'billtypeCode',
							name: '票据类型',
							width: 150,
							headalign: 'center',
							idField: 'billtypeCode',
							textField: 'billtypeCodeName',
							leafRequire: true,
							data: billTypeData,
							onChange: function (e) { },
							beforeExpand: function (e) { },
							render: function (rowid, rowdata, data) {
								if (!data) {
									return '';
								}
								return rowdata.billtypeCodeName;
							}
						},
						{
							type: 'input',
							field: 'billNo',
							name: '票据号',
							width: 125,
							headalign: 'center',
							align: 'right'
						},
						{
							type: 'input',
							field: 'accitemString',
							name: '辅助核算',
							width: 250,
							headalign: 'center',
							className: 'accitemClass',
							render: function (rowid, rowdata, data) {
								if (!$.isNull(data)) {
									return '<span title="' + data + '" data-accitem="' + data + '">' + data + '</span>';
								} else {
									return '<span   data-accitem="">' + ' ' + '</span>';
								}

							}
						},
						{
							type: 'input',
							field: 'oppositeUnit',
							name: '对方单位',
							width: 200,
							headalign: 'center',
							align: 'center',
							render: function (rowid, rowdata, data) {
								if (!$.isNull(data)) {
									return '<span title="' + data + '">' + data + '</span>';
								} else {
									return ' ';
								}
							}
						},
						{
							type: 'treecombox',
							field: 'vouType',
							name: '凭证类型',
							width: 110,
							headalign: 'center',
							idField: 'vouType',
							textField: 'vouTypeName',
							leafRequire: true,
							data: vouTypeData,
							onChange: function (e) { },
							beforeExpand: function (e) { },
							render: function (rowid, rowdata, data) {
								if (!$.isNull(rowdata.vouTypeNameNo)) {
									var tempArr = rowdata.vouTypeNameNo.split('-');
								}
								if (!data) {
									return '';
								}
								return rowdata.vouType + " " + tempArr[0];
							}
						},
						{
							type: 'input',
							field: 'vouNo',
							name: '凭证编号',
							width: 80,
							headalign: 'center',
							align: 'right'
						},
						{
							type: 'treecombox',
							field: 'type',
							name: '支出类型',
							width: 110,
							headalign: 'center',
							idField: 'type',
							textField: 'namesd',
							data: [{
								"type": "1",
								"namesd": "基本"
							},
							{
								"type": "2",
								"namesd": "项目"
							}
							],
							onChange: function (e) { },
							beforeExpand: function (e) { },
							render: function (rowid, rowdata, data) {
								if (rowdata.type == '1') {
									return '基本';
								} else if (rowdata.type == '2') {
									return '项目';
								}
							},
						},
						{
							type: 'input',
							field: 'remark',
							name: '备注',
							width: 80,
							headalign: 'center',
							align: 'left'
						},
						{
							type: 'toolbar',
							field: 'option',
							name: '操作',
							width: 60,
							headalign: 'center',
							render: function (rowid, rowdata, data) {
								return '<a class="btnDel" rowid="' + rowid + '" conid="' + rowdata + '"><span class="icon icon-trash"></span></a>';
							}
						}
					]
				];
				// var jours = data.journalLs;
				page.initTable('bookTable', data, columns);
				return false;
			},
			//初始化单位未达项表格
			initTable: function (id, data, col) {
				$('#' + id).ufDatagrid({
					data: data,
					//idField: 'chrCode',
					pId: 'pcode',
					disabled: false, //可选择
					columns: col,
					initComplete: function (options, data) {
					},
					lock: { //行锁定 //已对账 已生成凭证 
						class: 'bgc-gray2',
						filter: function (rowdata) {
							return (rowdata.isCheck == 1) && (!$.isNull(rowdata.linkVouGuid));
						}
					}
				})
				if (window.ownerData.action == "add") {
					var obj = $('#' + id).getObj(); // 取对象
					var newId = obj.add();
				}
			},
			openAccItem: function (rowData) {
				if (!$.isNull(rowData[0].accitemString)) {
					page.showCellData = rowData[0].accitemString;
				}
				ufma.open({
					url: 'editAccItem.html',
					title: "编辑辅助核算",
					width: 710,
					data: {
						"agencyCode": window.ownerData.agencyCode,
						"setYear": window.ownerData.setYear,
						"rgCode": window.ownerData.rgCode,
						"assistItems": accountbookObj,
						"subRowData": rowData,
						"accountbookGuid": rowData[0].accountbookGuid,
						"dataAccitem": page.showCellData,
						"accItemObj": window.ownerData.accItemObj,
						"accitemShow": page.accitemShow
					},
					ondestory: function (data) {
						if (!$.isNull(data.result)) {
							page.transAss(data.result);
							page.accitemShow = data.result;
							console.log(page.accitemShow);
							// var assitemSaveArr = [];
							// assitemSaveArr.push(page.assitemSave);
							if (!$.isNull(data.result) && data.result.length > 0) {
								var accoAssList = page.showCellData;
								$(document).find('#bookTableinputaccitemString').val(accoAssList);
								$(document).find('#bookTableinputaccitemString span').attr("data-accitem", accoAssList);
							}
						}
					}
				})
			},
			//解析辅助核算项
			transAss: function (assData) {
				var accoAssList = [];
				for (var i = 0; i < assData.length; i++) {
					var ass = assData[i];
					if (!$.isNull(ass.keyDataName)) {
						accoAssList.push(ass.keyEleName + '：' + ass.keyDataName); //部门：01 部门01 
					}
					// $(document).find('#bookTableinputaccitemString span').attr('data-accitemCode', ass.keyDataCode);
				}
				page.showCellData = '';
				page.showCellData = accoAssList.join(',');
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
			//获取账簿余额
			queryBalData: function (accountbookGuid, balByAccitem) {
				var argu = {
					agencyCode: window.ownerData.agencyCode,
					acctCode: accountbookObj[accountbookGuid].acctCode,
					setYear: window.ownerData.setYear,
					rgCode: window.ownerData.rgCode,
					accountbookGuid: accountbookGuid
				};
				if (!$.isNull(balByAccitem)) {
					var accitems = balByAccitem.split(',');
					for (var i = 0; i < accitems.length; i++) {
						var accitem = accitems[i].toLowerCase();
						var itemEle = page.shortLineToTF(accitem) + 'Code';
						argu[itemEle] = $('#' + itemEle + '_value').val();
					}
				}
				ufma.ajaxDef("/cu/journal/getCuJournalMoneyInfo", 'get', argu, function (result) {
					if (!$.isNull(result.data)) {
						page.balance = result.data;
					}
				});
			},
			//保存校验账簿余额不足不可以支出  guohx  20190801 add
			//若旧数据为借方，即借改贷则账簿余额减旧金额;若旧数据为贷方，即贷改贷则账簿余额加旧金额。
			//若为新增登账数据且借贷方向选择了贷方则判断输入的金额是否小于等于账簿余额，若小于等于正常登账，大于提示账簿余额不足不允许支出。
			checkBalance: function (data, i) {
				if (!$.isNull(accountbookObj[data.accountbookGuid])) {
					if ((accountbookObj[data.accountbookGuid].isStrictbook == "1")) {
						page.queryBalData(data.accountbookGuid, accountbookObj[data.accountbookGuid].balByAccitem);
						if (window.ownerData.action == "add") { //新增							
							if (data.drMoney < 0) {
								if (data.drMoney * (-1) > page.balance) {
									ufma.showTip("账簿[" + data.accountbookName + "]余额不足不允许支出!", function () {
										return false;
									}, 'warning');
								} else {
									return true;
								}
							} else if (data.crMoney > 0) {
								if (data.crMoney > page.balance) {
									ufma.showTip("账簿[" + data.accountbookName + "]余额不足不允许支出!", function () {
										return false;
									}, 'warning');
								} else {
									return true;
								}
							} else {
								return true;
							}
							//待修改编辑逻辑
						} else if (window.ownerData.action == "edit") {  //编辑
							if (!(!$.isNull(data.drMoney) && (data.drMoney > 0))) { //借 并且金额大于0 不控制余额支出
								var money = $.isNull(data.drMoney) ? data.crMoney : data.drMoney;
								if (window.ownerData.oneData[0].drCr == "1") { //借 
									var newBalance = page.balance - window.ownerData.oneData[0].drMoney;
									if (money < 0) {
										money = data.drMoney * (-1);
									}
									if (money > newBalance) {
										ufma.showTip("账簿[" + data.accountbookName + "]余额不足不允许支出!", function () {
											return false;
										}, 'warning');
									} else {
										return true;
									}
								} else {
									var newBalance = page.balance + window.ownerData.oneData[0].crMoney;
									if (money > newBalance) {
										ufma.showTip("账簿[" + data.accountbookName + "]余额不足不允许支出!", function () {
											return false;
										}, 'warning');
									} else {
										return true;
									}
								}
							} else {
								return true;
							}
						}
					} else {
						return true;
					}
				} else {
					return true;
				}
			},
			//校验上月未结账不允许继续做账
			checkLamonKeep: function (data) {
				var bookFisPerd = $("#jouDate").getObj().getValue().substring(5, 7);
				if (bookFisPerd < 10) {
					bookFisPerd = bookFisPerd.substring(1, 2);
				}
				if (!$.isNull(accountbookObj[data.accountbookGuid])) {
					var isBookCloseInFisPerd;
					if ((accountbookObj[data.accountbookGuid].isLamonKeep == "1") && (bookFisPerd != "1")) {
						var argu = {
							agencyCode: window.ownerData.agencyCode,
							setYear: window.ownerData.setYear,
							rgCode: window.ownerData.rgCode,
							accountbookGuid: data.accountbookGuid,
							fisPerd: bookFisPerd - 1
						};
						ufma.ajaxDef("/cu/cuAccountBook/isBookCloseInFisPerd", 'get', argu, function (result) {
							isBookCloseInFisPerd = result.data;
						});
						if (!isBookCloseInFisPerd) {
							ufma.showTip("账簿[" + data.accountbookName + "] 上月未结账不允许继续做账!", function () {
								return false;
							}, 'warning');
						} else {
							return true;
						}
					} else {
						return true;
					}
				} else {
					return true;
				}
			},
			save: function (saveStyle) {
				ufma.showloading('正在保存出纳账，请耐心等待...');
				if (window.ownerData.action == "edit") {
					var argu = window.ownerData.rowData;
					delete argu.cuJournalVos;
					argu.mainGuid = window.ownerData.mainGuid;
					var arguFrm = $('#frmQuery').serializeObject();
					argu = $.extend(true, argu, arguFrm);
				} else {
					var argu = $('#frmQuery').serializeObject();
				}
				if ($.isNull(argu.jouNo)) {
					ufma.showTip("请先填写编号！");
					ufma.hideloading();
					return false;
				}
				if ($.isNull(argu.summary)) {
					ufma.showTip("请先填写摘要！");
					ufma.hideloading();
					return false;
				}
				if ($.isNull(argu.dealWith)) {
					ufma.showTip("请先填写经办人！");
					ufma.hideloading();
					return false;
				}
				var journal = $("#bookTable").getObj().getData();
				if (journal.length == 0) {
					ufma.showTip("请先填写新增账簿明细信息！");
					ufma.hideloading();
					return false;
				} else if ($.isNull(journal[0].accountbookGuid)) {
					ufma.showTip("请先填写新增账簿明细信息！");
					ufma.hideloading();
					return false;
				}
				var queryItems = {};
				var resultObj = {};
				var accitem = [];
				var assitemArr = [];
				for (var i = 0; i < journal.length; i++) {
					if (!page.checkLamonKeep(journal[i])) { //校验上月已结账
						return false;
					} else {
						for (var m = 0; m < journal.length; m++) {
							if ($.isNull(journal[m].accountbookGuid)) {
								ufma.showTip("请先填写第"+(m+1)+"行账簿！");
								ufma.hideloading();
								return false;
							}
							if ($.isNull(journal[m].summary)) {
								ufma.showTip("请先填写第"+(m+1)+"行摘要！");
								ufma.hideloading();
								return false;
							}
							if ($.isNull(journal[m].crMoney) && $.isNull(journal[m].drMoney)) {
								ufma.showTip("请先填写第" + (m + 1) + "行金额！");
								ufma.hideloading();
								return false;
							}
						}
						if (!$.isNull(journal[i].accitemString)) {
							var accitemArr = journal[i].accitemString.split(',');
							assitemArr = accitemArr;
							for (var j = 0; j < assitemArr.length; j++) {
								// var accitemObj = {};
								var accitemStr = accitemArr[j].split('：');
								var keyStr = Object.keys(window.ownerData.accItemObj);
								for (var k = 0; k < keyStr.length; k++) {
									if (accitemStr[0] == keyStr[k]) {
										var accitemArrary = accitemStr[1].split(' ');
										var tempCode = page.shortLineToTF(window.ownerData.accItemObj[keyStr[k]]) + "Code";
										journal[i][tempCode] = accitemArrary[0];
									}
								}
							}
						}
						delete journal[i].namesd;
						delete journal[i].vouTypeName;
						journal[i].recordType = "1";
						journal[i].jouType = "1"; //临时
					}
				}
				argu = $.extend(true, argu, {
					"cuJournalVos": journal,
					"agencyCode": window.ownerData.agencyCode,
					"acctCode": window.ownerData.acctCode,
					"setYear": window.ownerData.setYear,
					"rgCode": window.ownerData.rgCode
				});

				dm.saveAccount(argu, function (result) {
					ufma.showTip(result.msg, function () {
						if (result.flag == "success") {
							ufma.hideloading();
							if (saveStyle == "saveadd") {
								_close('saveadd');
							} else {
								_close('ok');
							}

						}
					}, result.flag);
				});
			},
			//获取一个账簿详细信息
			getOneAccount: function (accountbookGuid) {
				ufma.post("/cu/cuAccountBook/select/" + accountbookGuid, {}, function (result) {
					var accountAttr = {};
					accountAttr.accoCode = result.data.accoCode;
					accountAttr.accountBookType = result.data.accountBookType;
					accountAttr.acctCode = result.data.acctCode;
					accountAttr.accItems = page.getAsiistItemByAccount(accountAttr.acctCode, accountbookGuid);
					accountAttr.accountbookGuid = accountbookGuid;
					accountAttr.requiredACC = result.data.requiredACC;
					accountAttr.isLamonKeep = result.data.isLamonKeep;
					accountAttr.isStrictbook = result.data.isStrictbook;
					accountAttr.balByAccitem = result.data.balByAccitem;
					if ($.isNull(accountbookObj[accountAttr.accountbookGuid])) {
						accountbookObj[accountAttr.accountbookGuid] = accountAttr;
					}
				});
			},

			initPage: function () {
				//解决弹窗高度为0问题 guohx 20200617
				setTimeout(function () {   //guohx   解决左侧出现树问题 模拟点击
					var centerH = $('.ufma-layout-up').outerHeight(true) - 100;
					$('.workspace-center').css({
						height: centerH + 'px',
						'overflow': 'auto'
					});
					$('#bookTable').css({ height: centerH - 50 -42 + 'px'});
                    $('#bookTableBody').css({ height: centerH - 50 - 30 - 42 + 'px'});
				}, 100);
				$('#jouDate').ufDatepicker({
					format: 'yyyy-mm-dd',
					initialDate: page.pfData.svTransDate
				});
				page.getAccBook();
				page.getBillType();
				page.getVoutype();
				if (window.ownerData.action == "edit") {
					$('#frmQuery').setForm(window.ownerData.rowData);
					page.fixedTable(window.ownerData.oneData);
					for (var i = 0; i < window.ownerData.oneData.length; i++) {
						page.getOneAccount(window.ownerData.oneData[i].accountbookGuid);
					}
				} else {
					page.fixedTable();
				}
				$("input").attr("autocomplete", "off");
			},
			onEventListener: function () {
				$("#addRow").on("click", function () {
					var obj = $("#bookTable").getObj(); //取对象
					if (!$.isNull($("#summary").val())) {
						var newRow = { summary: $("#summary").val() };
					} else {
						var newRow = {};
					}
					var newId = obj.add(newRow);
					return false;
				});
				$('#btnCancle').click(function () {
					_close('ok');
				});
				$(document).on('mousedown', '#bookTableinputaccitemString', function (e) {
					$("#bookTableinputaccitemString").attr("autocomplete", "off");
					var obj = $('#bookTable').getObj(); // 取对象
					var rowid = $(this).parent().attr('rowid');
					var rowData = [];
					var rowObj = {
						rowid: rowid
					}
					rowObj = $.extend(rowObj, obj.getRowByTId(rowid));
					rowData.push(rowObj);
					if (accountbookObj[rowObj.accountbookGuid].accItems.length == 0) {
						ufma.showTip("该账簿没有启用的辅助核算！");
						return false;
					} else {

						page.openAccItem(rowData);
					}
				});
				//保存跨账簿登账
				$("#btnSave").on("click", function () {
					page.save("save");
				});
				//保存并新增
				$("#saveAdd").on("click", function () {
					page.save("saveadd");

				});
				// 删除一行
				$("#bookTable").on("mousedown", ".btnDel", function () {
					var obj = $('#bookTable').getObj();//取对象
					var rowid = $(this).attr("rowid");
					var rowData = obj.getRowByTId(rowid);
					if (!$.isNull(rowData.linkVouGuid) && (rowData.isCheck == 1)) {
						ufma.showTip("该条日记账已生成了凭证且已对账，请先取消生成凭证且在银行对账中取消对账！");
						return false;
					}
					if ((!$.isNull(rowData.linkVouGuid)) && (rowData.linkModule != 'GL')) {
						ufma.showTip("该条日记账已生成了凭证，请先取消生成凭证！");
						return false;
					}
					if (rowData.isCheck == 1) {
						ufma.showTip("该条日记账已对账，请先在银行对账中取消对账！");
						return false;
					}
					obj.del(rowid);
					// var tableDatas = $('#bookTable').getObj().getData();
					// page.fixedTable(tableDatas);
				});

				$('#jouNo').on('keyup paste', function () {
					$(this).val($(this).val().replace(/[^\d]/g, ''));
				}).on('blur', function () {
					$(this).val($(this).val().replace(/\D/g, ''));
				});
				//此处仍有缺陷,待与需求确认,现默认带出第一个的摘要,以后每行新增会带出,但修改摘要后,其他行不会联动 guohx 20190829
				$('#summary').on('blur', function () {
					if (!$.isNull($("#summary").val())) {
						$("#bookTable_row_1 td").eq(2).html($("#summary").val());
					}
				});
				//SCJCY-55 跨账簿登记出纳账，没有限制五十汉字，可以多余五十汉字 guohx 20200901 
				$("#bookTable").click(function () {
                    $("#bookTable").find('input[name="oppositeUnit"]').attr('maxlength', '50');
                });
			},
			// 此方法必须保留
			init: function () {
				reslist = ufma.getPermission();
				ufma.isShow(reslist);
				page.pfData = ufma.getCommonData();
				ufma.parse();
				this.initPage();
				this.onEventListener();
			}
		}
	}
		();
	page.init();
});