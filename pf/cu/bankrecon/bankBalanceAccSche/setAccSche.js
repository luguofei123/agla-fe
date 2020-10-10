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
		//对账方案接口
		var agencyCode = "";
		var setYear = "";
		var schemaGuid = "";
		var portList = {
			// getJournalSrc: "/gl/bank/recon/getJournalSrc", //日记账来源
			operatorList: "/cu/enumerate/GL_BANK_OPERATOR", //括号运算符枚举
			// acctList: "/cu/cuAccountBook/getBookTree", //账套列表接口
			// accoTree: "/cu/cuAccountBook/getBookTree", //科目树接口
			getBookTree: "/cu/cuAccountBook/getBookTree", //获取账簿树
			accItemList: "/cu/common/getAccItemList", //辅助项列表
			accItemTree: "/cu/common/getAccItemTree", //辅助项内容树
			elementList: "/cu/bankReconSche/getAccitem", //要素列表
			saveAccSche: "/cu/bankReconSche/saveReconSche", //保存对账方案
			getOneAccSche: "/cu/bankReconSche/getBankReconSche", //请求单个对账方案的内容
			deleteCondition: "/cu/bankReconSche/deleteCondition" //删除数据范围(暂时没用)
		};

		return {
			//获取日记账来源
			// reqJournalSrc: function() {
			// 	ufma.get(portList.getJournalSrc, "", function(result) {
			// 		var data = result.data;
			// 		var radioHtml = "";
			// 		for(var i = 0; i < data.length; i++) {
			// 			var one = "";
			// 			if(data[i].sysId == "501") {
			// 				one = ufma.htmFormat('<label class="mt-radio mt-radio-outline margin-right-8">' +
			// 					'<input type="radio" name="journalSrc" value="<%=code%>" codename="<%=name%>" checked>&nbsp;<%=name%>' +
			// 					'<span></span>' +
			// 					'</label>', {
			// 						code: data[i].sysId,
			// 						name: data[i].sysName
			// 					});
			// 			} else {
			// 				one = ufma.htmFormat('<label class="mt-radio mt-radio-outline margin-right-8">' +
			// 					'<input type="radio" name="journalSrc" value="<%=code%>" codename="<%=name%>">&nbsp;<%=name%>' +
			// 					'<span></span>' +
			// 					'</label>', {
			// 						code: data[i].sysId,
			// 						name: data[i].sysName
			// 					});
			// 			}
			// 			radioHtml += one;
			// 		}
			// 		$("#journalSrc").html(radioHtml);
			// 	});
			// },

			//获取括号运算符值集
			reqOperatorList: function () {
				ufma.ajaxDef(portList.operatorList, "get", "", function (result) {
					var data = result.data;

					page.OperatorList1 = []; //左括号 
					page.OperatorList2 = []; //右括号
					page.OperatorList3 = []; //运算符  

					var obj1 = {};
					obj1.operCode1 = "00";
					obj1.operName1 = "无";
					page.OperatorList1.push(obj1);

					var obj2 = {};
					obj2.operCode2 = "00";
					obj2.operName2 = "无";
					page.OperatorList2.push(obj2);

					for (var i = 0; i < data.length; i++) {
						if (data[i].ENU_CODE == "01") {
							obj1 = {};
							obj1.operCode1 = data[i].ENU_CODE;
							obj1.operName1 = data[i].ENU_NAME;
							page.OperatorList1.push(obj1);
						} else if (data[i].ENU_CODE == "02") {
							obj2 = {};
							obj2.operCode2 = data[i].ENU_CODE;
							obj2.operName2 = data[i].ENU_NAME;
							page.OperatorList2.push(obj2);
						}
					}
				});
			},

			//获取账簿树
			reqAcctList: function () {
				var argu = {
					"agencyCode": page.agencyCode,
					"accountbookTypes": "2,3"
				};
				if (window.ownerData.action == "add") {
					argu.enabled = "1";
				}
				ufma.ajaxDef(portList.getBookTree, "get", argu, function (result) {
					var data = result.data;
					var newData = [];
					for (var i = 0; i < data.length; i++) {
						var obj = {};
						obj.accountbookCode = data[i].ACCOUNTBOOK_CODE;
						obj.accountbookName = data[i].accountbookName;
						obj.accountbookGuid = data[i].ID;
						obj.pId = data[i].PID;
						obj.acctCode = data[i].ACCT_CODE;
						obj.accoCode = data[i].ACCO_CODE;
						newData.push(obj);
					}
					page.acctList = newData;
				});
			},

			//获取科目树
			// reqAccoTree: function (acctCode) {
			// 	var argu = {
			// 		"agencyCode": page.agencyCode,
			// 		"acctCode": acctCode,
			// 		"setYear": page.setYear,
			// 		"accoTypes": "2,3"
			// 	};
			// 	ufma.ajaxDef(portList.accoTree, "get", argu, function (result) {
			// 		var data = result.data.treeData;
			// 		if ($.isNull(data)) {
			// 			return false;
			// 		} else {
			// 			var newData = [];
			// 			for (var i = 0; i < data.length; i++) {
			// 				var obj = {};
			// 				obj.accoCode = data[i].id;
			// 				obj.accoCodeName = data[i].codeName;
			// 				obj.accoName = data[i].name;
			// 				obj.pId = data[i].pId;
			// 				newData.push(obj);
			// 			}
			// 			page.accoTree = newData;
			// 		}
			// 	});
			// },

			//获取辅助项列表
			reqAccItemList: function (bookID) {
				var argu = {
					"setYear": page.setYear,
					"rgCode": page.rgCode,
					"accountbookGuid": bookID
				};
				ufma.ajaxDef(portList.accItemList, "get", argu, function (result) {
					page.accItemList = result.data;
				});
			},

			//获取辅助项内容树
			reqAccItemTree: function (accItemCode) {
				var argu = {
					"agencyCode": page.agencyCode,
					"setYear": page.setYear,
					"rgCode": page.rgCode,
					"eleCode": accItemCode
				};
				ufma.ajaxDef(portList.accItemTree, "get", argu, function (result) {
					var data = result.data;
					var newData = [];
					for (var i = 0; i < data.length; i++) {
						var obj = {};
						obj.accContCode = data[i].id;
						obj.accContCodeName = data[i].codeName;
						obj.accContName = data[i].name;
						obj.isLeaf = data[i].isLeaf;
						obj.pId = data[i].pId;
						newData.push(obj);
					}
					page.accItemTree = newData;
				});
			},

			//打开设置对账单的模态框
			openSetWin: function (action, data) {
				var param = {};
				param["action"] = action;
				param["agencyCode"] = page.agencyCode;
				param["agencyName"] = page.agencyName;
				param["rgCode"] = page.rgCode;
				param["setYear"] = page.setYear;
				param["data"] = data;
				param["eleList"] = page.eleList;
				param["saveEleList"] = page.saveEleList;
				param["isUpdate"] = page.isUpdate;
				ufma.open({
					url: "setBankCol.html",
					title: "设置对账单格式",
					width: 790,
					data: param,
					ondestory: function (data) {
						if (data.action == "save") {

							page.bankExtArr = data.extArr; //银行对账单增加的列名
							var extArr = [];
							for (var i = 0; i < page.bankExtArr.length; i++) {
								if (page.bankExtArr[i].enabled == "1") {
									var extObj = {};
									extObj.title = page.bankExtArr[i].showName;
									extObj.data = "exm";
									extObj.eleCode = page.bankExtArr[i].eleCode;
									extArr.push(extObj);
								}
							}
							var thisBankColArr = page.bankColArr;
							var newBankColArr = thisBankColArr.concat(extArr);
							page.bankEmptyTable.destroy().clear();
							$("#bankData").html("");
							page.bankEmptyTable = page.initEmptyTable("bankData", newBankColArr);
							//page.initEmptyTable("agencyData", allCols, true);
						}
					}
				});
			},

			//收集表格表头信息
			tableHeader: function (tableId) {
				var columns = $("#" + tableId).DataTable().settings()[0].aoColumns;
				var visible = $("#" + tableId).DataTable().columns().visible(); //每列元素的隐藏/显示属性组
				var arr = []; //存储当前表格的表头信息
				for (var i = 0; i < visible.length; i++) {
					var obj = {};
					obj.title = columns[i].sTitle; //列名
					obj.code = columns[i].data; //列名代码
					obj.elecode = columns[i].eleCode;
					obj.index = i; //列的索引
					obj.visible = visible[i]; //列的隐藏/显示属性
					obj.pTitle = $(columns[i].nTh).attr("parent-title") == undefined ? "" : $(columns[i].nTh).attr("parent-title"); //列名的父元素名
					arr.push(obj);
				}
				return arr;
			},

			//设置隐藏列盒子内容
			setVisibleCol: function (nowHead) {
				var html = "";
				var top = 46;
				var changeHead = [];
				for (var i = 0; i < nowHead.length; i++) {
					if (!nowHead[i].visible) {
						changeHead.push(nowHead[i]);
						var h = ufma.htmFormat('<li><label class="mt-checkbox mt-checkbox-outline">' +
							'<input type="checkbox" data-elecode="<%=elecode%>" data-elename="<%=title%>" data-index="<%=index%>"><%=title%>' +
							'<span></span>' +
							'</label></li>', {
								title: nowHead[i].title,
								index: i,
								elecode: nowHead[i].elecode
							});
						html += h;
						top += 30;
					}
				}
				$(".box-col-list").html(html);
				page.changeCol = changeHead;
				$(".box-col").css({
					"top": "-" + "400px"
				});
			},

			//初始化空表格
			/**
			 * id：表格id
			 * columnsArr：数组，表格列信息
			 * colFlag：布尔值，true单位日记账，false银行对账单
			 * isUpdate：数字，编辑时若大于0就，已增加的列不能删除
			 */
			initEmptyTable: function (id, columnsArr, colFlag, isUpdate) {
				var tableObj = $("#" + id).DataTable({
					"data": [{
						"exm": "&nbsp;"
					}],
					"columns": columnsArr,
					"bPaginate": false, //翻页功能
					"bLengthChange": false, //改变每页显示数据数量
					"bFilter": false, //过滤功能
					"bSort": false, //排序功能
					"bInfo": false, //页脚信息
					"bAutoWidth": false, //自动宽度
					"initComplete": function () {
						//ufma.isShow(page.reslist);
						//单位日记账
						if (colFlag) {
							var headArr = page.tableHeader(id);
							page.setVisibleCol(headArr);

							if (page.action == "edit") {
								page.reqElementList("agency");
								var allElement = page.elementArr;
								for (var i = 0; i < page.agencyExtArr.length; i++) {
									for (var j = 0; j < allElement.length; j++) {
										if (allElement[j].eleCode == page.agencyExtArr[i].eleCode) {
											var $input = $("#agencyDataCol .box-col-list").find("li").eq(j).find("input");
											page.changeCol[j].visible = true;
											var nn = $input.data("index");
											$("#" + id).DataTable().column(nn).visible(true);
										}
									}
								}
								if (page.isUpdate > 0) {
									$("#agencyDataCol .box-col-list").find("li").find("input").attr("disabled", "disabled");
								}
								$("#" + id).DataTable().columns.adjust().draw();
							}
						}
					},
					"drawCallback": function (settings) {
						//ufma.isShow(page.reslist);
					}
				});
				return tableObj;
			},

			//初始化数据范围表格
			initEditTable: function (id, tableData) {
				$('#' + id).ufDatagrid({
					data: tableData,
					columns: [
						[{
							type: 'combox',
							field: 'operCode1',
							name: '括号',
							width: 55,
							headalign: 'center',
							align: 'center',
							idField: 'operCode1',
							textField: 'operName1',
							data: page.OperatorList1,
							onChange: page.operAction1,
							render: function (rowid, rowdata, data) {
								// if (!rowdata.operName1) { return rowdata.operName1 }
								// else if (!rowdata.operName2) { return rowdata.operName2 }
								// else { return rowdata.operName3 }
								return rowdata.operName1;

							}
						},
						{
							type: 'treecombox',
							field: 'accountbookGuid',
							name: '账簿',
							width: 172,
							headalign: 'center',
							idField: 'accountbookGuid',
							textField: 'accountbookName',
							data: page.acctList,
							// onChange: page.selectAcco,
							leafRequire: true,
							render: function (rowid, rowdata, data) {
								return $.isNull(rowdata.accountbookName) ? '' : '<span title="' + rowdata.accountbookName + '">' + rowdata.accountbookName + '</span>';
							}
						},
						// {
						//     type: 'treecombox',
						//     field: 'accoCode',
						//     name: '科目',
						//     width: 180,
						//     headalign: 'center',
						//     idField: 'accoCode',
						//     textField: 'accoCodeName',
						//     leafRequire: true,
						//     onChange: page.selectAcco,
						//     render: function (rowid, rowdata, data) {
						//         return rowdata.accoCodeName;
						//     }
						// },
						/*修改辅助核算项不显示问题
					{
						type: 'combox',
						field: 'eleCode',
						name: '辅助核算项',
						width: 200,
						headalign: 'center',
						idField: 'eleCode',
						textField: 'eleName',
						onChange: page.selectAccItem,
						render: function (rowid, rowdata, data) {
							return rowdata.eleName;
						}
					},
					{
						type: 'treecombox',
						field: 'accContCode',
						name: '辅助项内容',
						width: 200,
						headalign: 'center',
						idField: 'accContCode',
						textField: 'accContCodeName',
						leafRequire: false,
						beforeExpand: function (e) { //下拉框初始化

							var $trEdit = e.sender.parent(".uf-grid-table-edit");
							var $trShow = e.sender.attr("rowid"); //对应展示数据的行id
							// var acctCode = $trEdit.find('[name="acctCode"].uf-combox').getObj().getValue();
							// var accoCode = $trEdit.find('[name="accoCode"].uf-treecombox').getObj().getValue();
							var accountbookGuid = $trEdit.find('[name="accountbookGuid"].uf-treecombox').getObj().getValue();
							var accItemCode = $trEdit.find('[name="eleCode"].uf-combox').getObj().getValue();


							if (accountbookGuid != "" && accountbookGuid != null && accItemCode != "" && accItemCode != null) {
								//获取辅助项内容树
								page.reqAccItemTree(accItemCode);
								$(e.sender).getObj().load(page.accItemTree);
								if (e.rowData.hasOwnProperty("accContCode")) {
									e.sender.getObj().val(e.rowData.accContCode);
								}
							} else {
								$(e.sender).getObj().load([]);
							}
						},
						onChange: function (e) {
							if (e.rowData.hasOwnProperty("isLeaf")) {
								for (var i = 0; i < page.accItemTree.length; i++) {
									if (page.accItemTree[i].accContCode == e.rowData.accContCode) {
										e.rowData.isLeaf = page.accItemTree[i].isLeaf;
									}
								}
							}
						},
						render: function (rowid, rowdata, data) {
							return rowdata.accContCodeName;
						}
					},*/
						{
							type: 'combox',
							field: 'operCode2',
							name: '括号',
							width: 55,
							headalign: 'center',
							align: 'center',
							idField: 'operCode2',
							textField: 'operName2',
							data: page.OperatorList2,
							onChange: page.operAction2,
							render: function (rowid, rowdata, data) {
								// if (!rowdata.operName1) { return rowdata.operName1 }
								// else if (!rowdata.operName2) { return rowdata.operName2 }
								// else { return rowdata.operName3 }
								return rowdata.operName2;

							}

						},
						// {
						// 	type: 'combox',
						// 	field: 'operCode3',
						// 	name: '运算符',
						// 	width: 80,
						// 	headalign: 'center',
						// 	align: 'center',
						// 	idField: 'operCode3',
						// 	textField: 'operName3',
						// 	data: page.OperatorList3,
						// 	render: function(rowid, rowdata, data) {
						// 		return rowdata.operName3
						// 	}
						// },
						{
							type: 'toolbar',
							field: 'conditionGuid',
							name: '操作',
							width: 40,
							headalign: 'center',
							align: 'center',
							render: function (rowid, rowdata, data) {
								return '<a class="btnDel" rowid="' + rowid + '" conid="' + data + '"><span class="icon icon-trash"></span></a>';
							}
						}
						]
					],
					initComplete: function (options, data) {
						for (var i = 0; i < data.length; i++) {
							if (page.action == "edit" && page.isUpdate > 0) {
								var $trShow = $(".uf-grid-table #" + id + "_row_" + (i + 1));
								var $trEdit = $(".uf-grid-table-edit[rowid='" + id + "_row_" + (i + 1) + "']");
								$trShow.addClass("bgc-gray2");
								$trShow.click(function () {
									return false;
								})
							}
						}
					}
				});
				ufma.isShow(reslist);
			},
			//修改账套操作
			selectAcct: function (e) {
				var $trEdit = e.sender.parent(".uf-grid-table-edit");
				var $trId = $trEdit.attr("rowid");
				var $trShow = $("tr#" + $trId);

				var acctCode = e.itemData.acctCode; //账套代码
				//会计科目begin
				var acctCode = $trEdit.find('[name="acctCode"].uf-combox').getObj().getValue();
				var $accoObj = $trEdit.find('[name="accoCode"].uf-treecombox').getObj();
				page.accoTree = []; //先清空后渲染
				if (acctCode != "" && acctCode != null) {
					page.reqAccoTree(acctCode);
					$accoObj.load(page.accoTree);
					if (e.rowData.hasOwnProperty("accoCode")) {
						$accoObj.val(e.rowData.accoCode);
					}
				}
				//会计科目end
			},
			//修改科目操作
			selectAcco: function (e) {

				var $trEdit = e.sender.parent(".uf-grid-table-edit");
				var $trId = $trEdit.attr("rowid");
				var $trShow = $("tr#" + $trId);

				// var $acctObj = $trEdit.find('[name="acctCode"].uf-combox').getObj();
				// var acctCode = $acctObj.getValue(); //账套代码

				// var accoCode = e.itemData.accoCode; //科目代码

				//辅助begin
				// var acctCode = $trEdit.find('[name="acctCode"].uf-combox').getObj().getValue();
				// var accoCode = $trEdit.find('[name="accoCode"].uf-treecombox').getObj().getValue();
				var bookID = $trEdit.find('[name="accountbookGuid"].uf-treecombox').getObj().getValue();
				if (bookID != "" && bookID != null) {
					var $eleObj = $trEdit.find('[name="eleCode"].uf-combox').getObj();
					page.reqAccItemList(bookID);
					$eleObj.load(page.accItemList);
					if (e.rowData.hasOwnProperty("eleCode")) {
						$eleObj.val(e.rowData.eleCode);
					}
				}
				//辅助end
			},
			//修改辅助项操作
			selectAccItem: function (e) {
				var $trEdit = e.sender.parent(".uf-grid-table-edit");
				var $trId = $trEdit.attr("rowid");
				var $trShow = $("tr#" + $trId);

				// var $acctObj = $trEdit.find('[name="acctCode"].uf-combox').getObj();
				// var acctCode = $acctObj.getValue(); //账套代码

				// var $accoObj = $trEdit.find('[name="accoCode"].uf-treecombox').getObj();
				// var accoCode = $accoObj.getValue(); //科目代码

				var eleCode = e.itemData.eleCode; //辅助项代码

				//获取辅助项内容树
				page.reqAccItemTree(eleCode);
				var $accContObj = $trEdit.find('[name="accContCode"].uf-treecombox').getObj();
				$accContObj.load(page.accItemTree);

				$trShow.find('td[name="accContCode"]').text("");
			},
			//修改左括号
			operAction1: function (e) {
				//        		var operCode = e.itemData.operCode1;//括号代码
				//        		var $trEdit = e.sender.parent(".uf-grid-table-edit");
				//        		var $trId = $trEdit.attr("rowid");
				//        		var $trShow = $("tr#"+$trId);
				//        		if(operCode == "00"){
				//        			$trEdit.find("[name='operName2']").getObj().val("00");
				//        			var text = $trEdit.find("[name='operName2']").getObj().getText();
				//        			$trShow.find("td[name='operName2']").text(text);
				//        		}else if(operCode == "01"){
				//        			$trEdit.find("[name='operName2']").getObj().val("02");
				//        			var text = $trEdit.find("[name='operName2']").getObj().getText();
				//        			$trShow.find("td[name='operName2']").text(text);
				//        		}
			},
			//修改右括号
			operAction2: function (e) {
				//        		var operCode = e.itemData.operCode2;//括号代码
				//        		var $trEdit = e.sender.parent(".uf-grid-table-edit");
				//        		var $trId = $trEdit.attr("rowid");
				//        		var $trShow = $("tr#"+$trId);
				//        		if(operCode == "00"){
				//        			$trEdit.find("[name='operName1']").getObj().val("00");
				//        			var text = $trEdit.find("[name='operName1']").getObj().getText();
				//        			$trShow.find("td[name='operName1']").text(text);
				//        		}else if(operCode == "02"){
				//        			$trEdit.find("[name='operName1']").getObj().val("01");
				//        			var text = $trEdit.find("[name='operName1']").getObj().getText();
				//        			$trShow.find("td[name='operName1']").text(text);
				//        		}
			},

			//请求要素列表
			reqElementList: function (type) {
				var argu = {
					agencyCode: page.agencyCode,
					getType: type,
					schemaGuid: page.schemaGuid
				}
				ufma.ajaxDef(portList.elementList, "get", argu, function (result) {
					var data = result.data;
					var newData = [];
					for (var i = 0; i < data.length; i++) {
						var obj = {};
						obj.title = data[i].accItemName;
						obj.data = "exm";
						obj.visible = false;
						obj.eleCode = data[i].eleCode;
						obj.accItemCode = data[i].accItemCode;
						newData.push(obj);
					}
					if (type == "bank") {
						page.eleList = newData;
					} else if (type == "agency") {
						page.elementArr = newData;
					}
				});
			},

			//必输字段校验
			requiredValidator: function (inputId, inputName) {
				$('#' + inputId).on('focus paste keyup', function (e) {
					e.stopepropagation;
					$('#' + inputId).closest('.form-group').removeClass('error');
				}).on('blur', function () {
					if ($(this).val() == '') {
						ufma.showInputHelp(inputId, '<span class="error">' + inputName + '不能为空</span>');
						$('#' + inputId).closest('.form-group').addClass('error');
					} else {
						ufma.hideInputHelp(inputId);
						$('#' + inputId).closest('.form-group').removeClass('error');
					}
				});
			},

			//保存对账方案flag:true 保存并新增，false 保存
			saveAccSche: function (flag) {
				//校验数据
				//方案名称不为空
				//数据范围 括号要成对出现 运算符不为空（默认or）
				if ($('#sche-schemaName').val() == '') {
					ufma.showInputHelp('sche-schemaName', '<span class="error">方案名称不能为空</span>');
					$('#sche-schemaName').closest('.form-group').addClass('error');
					return false;
				}
				var aRangeData = $('#agencyRange').getObj().getData();

				if (aRangeData.length > 0 && !$.isNull(aRangeData[0])) {
					var leftCount = 0;
					var rightCount = 0;
					for (var i = 0; i < aRangeData.length; i++) {
						var accountbookGuid = aRangeData[i].accountbookGuid;
						if (accountbookGuid == "" || accountbookGuid == null) {
							ufma.showTip("第" + (i + 1) + "行数据范围的账簿不能为空！", function () { }, "warning");
							return false;
						}
						if (aRangeData[i].operName1 == "(") {
							leftCount++;
						}
						if (aRangeData[i].operName2 == ")") {
							rightCount++;
						}
					}
					if (leftCount != rightCount) {
						ufma.showTip("括号不匹配，请检查一下左右括号的数量！", function () { }, "warning");
						return false;
					}

				} else {
					ufma.showTip("至少增加一行数据范围数据！", function () { }, "warning");
					return false;
				}

				var argu = $('#accScheForm').serializeObject();

				//数据范围数组
				var condArr = [];
				for (var i = 0; i < aRangeData.length; i++) {
					var schemaGuid = argu.schemaGuid;
					var ope1 = aRangeData[i].operCode1;
					var ope2 = aRangeData[i].operCode2;
					// var ope3 = aRangeData[i].operCode3;
					var acctCode = aRangeData[i].acctCode;
					var accoCode = aRangeData[i].accoCode;
					var accountbookGuid = aRangeData[i].accountbookGuid;
					var isLeaf = aRangeData[i].isLeaf;
					var accoAccItem = aRangeData[i].eleCode;
					var chrCode = aRangeData[i].accContCode;
					var conditionGuid = aRangeData[i].conditionGuid;
					var condObj = {
						"schemaGuid": schemaGuid,
						"accoCode": accoCode,
						"acctCode": acctCode,
						"accountbookGuid": accountbookGuid,
						"conditionGuid": conditionGuid,
						"chrCode": chrCode,
						"isLeaf": isLeaf,
						"accoAccItem": accoAccItem,
						"operationSymbol1": ope1,
						"operationSymbol2": ope2
					}
					condArr.push(condObj);
				}

				//单位日记账新增的列数据组
				var agencyExtArr = [];

				var ordSeq = 0;
				/*	$('.uf-primary').click();*/
				$("#agencyDataCol .box-col-list li").each(function (i) {
					var $input = $(this).find("label input");
					//var flag = $input.prop("checked");
					if ($input.prop("checked")) {
						ordSeq++;
						var ff = "";
						if (ordSeq > 9) {
							ff = "field";
						} else {
							ff = "field0";
						}
						var agencyExtObj = {
							"enabled": 1,
							"schemaGuid": argu.schemaGuid,
							"extendField": ff + ordSeq,
							"showName": $input.data("elename"),
							"extendFieldGuid": "",
							"ordSeq": ordSeq,
							"bookType": "01",
							"eleCode": $input.data("elecode")
						};
						agencyExtArr.push(agencyExtObj);
					}

				});
				if (agencyExtArr.length == 0) {
					agencyExtArr = page.agencyExtArr;
				}
				if (ordSeq > 16) {
					ufma.showTip("单位日记账扩展格式不能大于16个", function () {

					}, "warning");
					return false;
				}
				//所有新增列数组
				var allExtArr = page.bankExtArr.concat(agencyExtArr);

				//方案字段
				var isOpposite = "1";
				if ($("input[name='isOpposite']").prop("checked")) {
					isOpposite = "1";
				} else {
					isOpposite = "0";
				}
				var fieldObj = {
					"rgCode": page.rgCode,
					"setYear": page.setYear,
					"agencyCode": page.agencyCode,
					"lastVer": argu.lastVer,
					"schemaGuid": argu.schemaGuid,
					"schemaName": argu.schemaName,
					"remark": argu.remark,
					"journalSrc": argu.journalSrc,
					"bank": argu.bank,
					"bankCode": argu.bankCode,
					"bankAccount": argu.bankAccount,
					"isUpdate": argu.isUpdate,
					"isOpposite": isOpposite
				};

				//checkbox选项数组
				var journalOpts = [];
				$(".check-list-box label").each(function () {
					var optObj = {};
					optObj.schemaGuid = argu.schemaGuid;
					optObj.optGuid = "";
					if ($(this).find("input").prop("checked")) {
						optObj.compoValue = "Y";
					} else {
						optObj.compoValue = "N";
					}
					optObj.compoType = "checkBox";
					optObj.optName = $(this).find("input").data("elename");
					optObj.optCode = $(this).find("input").attr("value");
					optObj.journalSrc = argu.journalSrc;
					optObj.searchType = $(this).find("input").attr("data-searchtype");
					journalOpts.push(optObj);
				})

				var scheObj = fieldObj;
				scheObj.cuBankJournalConditions = condArr;
				scheObj.cuBankExtends = allExtArr;
				scheObj.cuBankJournalOpts = journalOpts;
				/*{
					fieldObj,
					cuBankJournalConditions: condArr,
					cuBankExtends: allExtArr,
					cuBankReconSche: fieldObj,
					cuBankJournalOpts: journalOpts,
				}*/

				//CWYXM-8368--与王安珍、赵雪蕊确认按照汉字个数控制不能超过100个--zsj
				//if(fieldObj.remark.length > 65) {
				$('#accScheModal .btn-save').attr("disabled", true);
				$('#accScheModal .btn-saveadd').attr("disabled", true);
				if (fieldObj.remark.length > 100) {
					//ufma.showTip('方案描述过长！', function() {}, 'warning')
					ufma.showTip('方案描述不能超过100个汉字！', function () { }, 'warning');
				} else {
					ufma.post(portList.saveAccSche, scheObj, function (result) {
						if (flag) {
							ufma.showTip("保存成功，可以继续添加对账方案！", function () {
								page.isSaved = true; //标识已经保存数据，关闭窗口时需要刷新
								var timeId = setTimeout(function () {
									$('#accScheModal .btn-saveadd').attr("disabled", false);
									$('#accScheModal .btn-save').attr("disabled", false);
									clearTimeout(timeId);
								}, 500);
								//设置变量的初始值
								page.action = "add";
								page.bankExtArr = [];
								page.agencyExtArr = [];
								page.condEditArr = [];
								page.isUpdate = 0;
								$("input[name='schemaName'],input[name='journalSrc'],input[name='optCode'],input[name='isOpposite'],#addEditRow").removeAttr("disabled");

								//清空数据
								$('input.isClear').val('');
								$("input[value='501']").prop("checked", true);
								$(".check-list-box input").prop("checked", true);
								$("input[name='isOpposite']").prop("checked", true);

								//切换到单位日记账
								$(".nav-tabs li").eq(0).addClass("active").siblings().removeClass("active");
								$(".cont-tabs0").show().siblings().hide();

								//初始化数据范围表格
								var rangeObj = $('#agencyRange').getObj();
								var len = rangeObj.getData().length;
								for (var i = 0; i < len; i++) {
									var rowid = "agencyRange_row_" + (i + 1);
									rangeObj.del(rowid);
								}

								//初始化单位日记账格式
								page.reqElementList("agency");
								var allCols = page.agencyColArr.concat(page.elementArr).concat(page.plusArr);
								$("#agencyData").html("");
								page.agencyEmptyTable.clear().destroy();
								page.agencyEmptyTable = page.initEmptyTable("agencyData", allCols, true);

								//初始化对账单格式
								page.reqElementList("bank");
								page.bankEmptyTable.clear().destroy();
								$("#bankData").html("");
								page.bankEmptyTable = page.initEmptyTable("bankData", page.bankColArr);

							}, result.flag);
						} else {
							ufma.showTip("保存成功！", function () {
								_close("save");
								/* page.initEmptyTable("cartList", allCols, true);*/

							}, result.flag);
						}
					});
				}

			},
			//初始化凭证类型和凭证来源
			/*initVouTypeAndSource: function () {
				var url = "/gl/bank/recon/getVouType";
				var argu = { "agencyCode": page.agencyCode, "setYear": page.setYear, "rgCode": page.rgCode };
				//var argu = {};
				var $obj = $('#vouType');
				var $obj1 = $('#vouSource');
				var labelGroup = '';
				var labelGroup1 = '';
				var callback = function (result) {
					item1 = result.data.EleVouType;//凭证类型
					$.each(result.data.EleVouType, function (idx, item1) {
						labelGroup += '<label class="mt-checkbox mt-checkbox-outline margin-right-8"><input class="" type="checkbox" name="optCode"  data-searchtype="02" data-elename="' + item1.chrName + '" value="' + item1.chrCode + '"  checked> ' + item1.chrName + ' <span></span> </label>';
					});
					$(labelGroup).appendTo($obj);
					item2 = result.data.VouSource;//凭证来源
					$.each(result.data.VouSource, function (idx, item2) {
						labelGroup1 += '<label class="mt-checkbox mt-checkbox-outline margin-right-8"><input class="" type="checkbox" name="optCode"  data-searchtype="03" data-elename="' + item2.ENU_NAME + '" value="' + item2.ENU_CODE + '"  checked> ' + item2.ENU_NAME + ' <span></span> </label>';
					});
					$(labelGroup1).appendTo($obj1);
				}
				ufma.ajaxDef(url, "get", argu, callback);
			},*/
			onEventListener: function () {
				//CWYXM-8370 --只允许输入数字--zsj
				$("#sche-bankAccount").on('blur', function () {
					$(this).val($(this).val().replace(/[^\d]/g, ''));
				});
				//取消对账方案的模态框
				$('#accScheModal .btn-close').on('click', function () {
					page.bankExtArr = [];
					if (page.isSaved) {
						_close("saveadd");
					} else {
						_close("close");
					}
				});

				//校验方案名称
				page.requiredValidator("sche-schemaName", "方案名称");

				//保存对账方案的模态框
				$('#accScheModal .btn-save').on('click', function () {
					page.saveAccSche(false);
				});

				//保存并新增对账方案
				$('#accScheModal .btn-saveadd').on('click', function () {
					page.saveAccSche(true);
				});

				//切换单位日记账、银行对账单
				$(".nav-tabs li").each(function (i) {
					$(this).on("click", function () {
						$(this).addClass("active").siblings().removeClass("active");
						$(".cont-tabs" + i).show().siblings().hide();
					});
				});

				//显示、隐藏单位日记账更多列
				$("#agencyData").on("click", ".colAdd", function () {
					if ($("#agencyData .colAdd").hasClass("icon-plus-color")) {
						return false;
					} else {
						$("#agencyDataCol input").each(function (i) {
							$(this).prop("checked", page.changeCol[i].visible);
						})
						$("#agencyDataCol").toggle();
					}
				});
				$("#agencyDataCol").on("mouseleave", function () {
					$("#agencyDataCol").hide();
				});

				//确定显示单位日记账隐藏列
				$("#agencyDataCol .uf-primary").on("click", function (evt) {
					$("#agencyDataCol").hide()
					evt.stopPropagation();
					var num = 0;
					$("#agencyDataCol label").each(function (i) {
						page.changeCol[i].visible = $(this).find("input").prop("checked");
						var nn = $(this).find("input").data("index");
						if ($(this).find("input").is(":checked")) {
							num += 1;
							page.agencyEmptyTable.column(nn).visible(true);

						} else {
							page.agencyEmptyTable.column(nn).visible(false);
						}
					});
					page.agencyEmptyTable.columns.adjust().draw();
				});

				//重置单位日记账隐藏列
				$("#agencyDataCol .uf-gray").on("click", function (evt) {
					evt.stopPropagation();
					$("#agencyDataCol label").each(function (i) {
						if ($(this).find("input").attr("disabled") != "disabled") {
							$(this).find("input").prop("checked", false);
							page.changeCol[i].visible = false;
							var nn = $(this).find("input").data("index");
							page.agencyEmptyTable.column(nn).visible(false);
						}
					});
					page.agencyEmptyTable.columns.adjust().draw();
				});

				//打开设置对账单
				$('#setBankBtn').on('click', function (e) {
					e.preventDefault();
					var data = page.bankExtArr; //已设置的数据
					page.openSetWin(page.action, data);
					//					$(".btn-save").click();

				});

				//新增一行数据范围
				$("#addEditRow").on("click", function () {
					if (page.action == "edit" && page.isUpdate > 0) {
						ufma.showTip("不允许修改数据范围！", function () { }, "warning");
						return false
					}
					var obj = $('#agencyRange').getObj(); //取对象
					//            		var lastRow = obj.getData()[obj.getData().length-1];
					var newRow = {
						"conditionGuid": "",
						"acctCode": "",
						"acctName": "",
						"accoCode": "",
						"accoCodeName": "",
						"eleCode": "",
						"eleName": "",
						"isLeaf": "",
						"accContCode": "",
						"accContCodeName": "",
						"operName1": "",
						"operCode1": "",
						"operName2": "",
						"operCode2": "",
						"operName3": "或者"
					};
					var newId = obj.add(newRow);
					ufma.isShow(reslist);
					return false;
				});

				//删除一行数据范围
				$("#agencyRange").on("mousedown", ".btnDel", function () {
					if (page.action == "edit" && page.isUpdate > 0) {
						ufma.showTip("不允许修改数据范围！", function () { }, "warning");
						return false
					}
					var obj = $('#agencyRange').getObj(); //取对象
					var rowid = $(this).attr("rowid");
					obj.del(rowid);
				});

				$("#agencyRange").on("click", ".uf-grid-table-edit", function () {
					if (page.action == "edit" && page.isUpdate > 0) {
						ufma.showTip("不允许修改数据范围！", function () { }, "warning");
						return false
					}
					var obj = $('#agencyRange').getObj(); //取对象
					var rowid = $(this).attr("rowid");
					obj.del(rowid);
					$(this).css("top", "-34px");
				});
			},

			//此方法必须保留
			init: function () {
				reslist = ufma.getPermission();
				ufma.isShow(reslist);
				//
				$("#sche-bankAccount").numberInput();
				var ufgovkey = ufma.getCommonData();
				page.setYear = ufgovkey.svSetYear;
				page.rgCode = ufgovkey.svRgCode;
				ufma.parse();
				page.agencyCode = window.ownerData.agencyCode;
				page.action = window.ownerData.action;
				page.setYear = window.ownerData.setYear;
				page.rgCode = window.ownerData.rgCode;
				page.data = window.ownerData.data;
				if (JSON.stringify(page.data) == "{}") {
					page.schemaGuid = " ";
				} else {
					page.schemaGuid = page.data.schemaGuid;
				}
				page.isSaved = false;
				//获取权限数据

				//获取日记账来源
				// page.reqJournalSrc();

				//获取括号运算符值集
				page.reqOperatorList();

				//获取凭证类型和凭证来源
				//page.initVouTypeAndSource();

				//获取账套值集
				page.reqAcctList()

				if (page.action == "edit") {

					var data = page.data;
					var schemaGuid = data.schemaGuid;
					var argu = {
						schemaGuid: schemaGuid
					};
					ufma.ajaxDef(portList.getOneAccSche, "get", argu, function (result) {
						var scheData = result.data;

						//方案名称等字段
						//						var formData = scheData.cuBankReconSche;
						var formData = scheData;
						$('#accScheForm').setForm(formData);
						var isOpposite = formData.isOpposite;
						if (isOpposite == "1") {
							$("input[name='isOpposite']").prop("checked", true);
						} else {
							$("input[name='isOpposite']").removeAttr("checked");
						}

						//是否可以删除表格已增加的列
						page.isUpdate = formData.isUpdate;
						if (page.isUpdate > 0) {
							$("input[name='schemaName'],input[name='journalSrc'],input[name='optCode'],input[name='isOpposite'],#addEditRow").attr("disabled", true);
							$("#setBankBtn").addClass("disabled");
							//$("#agencyData").find("th[name='row-plus']").addClass("icon-plus-color");
							//$("#agencyData").find('.row-plus').addClass("icon-plus-color");  未完待续
						}

						//方案checkbox

						var checkArr = scheData.cuBankJournalOpts;
						for (var i = 0; i < checkArr.length; i++) {
							if (checkArr[i].compoValue == "Y") {
								$(".check-list-box input[data-elename='" + checkArr[i].optName + "']").prop("checked", true);
							} else if (checkArr[i].compoValue == "N") {
								$(".check-list-box input[data-elename='" + checkArr[i].optName + "']").removeAttr("checked");
							}
						}

						//扩展列
						var allColArr = scheData.cuBankExtends;
						page.agencyExtArr = []; //单位日记账扩展列
						page.bankExtArr = []; //银行对账单扩展列
						for (var i = 0; i < allColArr.length; i++) {
							if (allColArr[i].bookType == "01") {
								page.agencyExtArr.push(allColArr[i]);
							} else if (allColArr[i].bookType == "02") {
								page.bankExtArr.push(allColArr[i]);
							}
						}

						//数据范围
						page.condEditArr = scheData.cuBankJournalConditions;

					});
				} else if (page.action == "add") {
					$("input[name='schemaName'],input[name='journalSrc'],input[name='optCode'],input[name='isOpposite'],#addEditRow").removeAttr("disabled");

					page.bankExtArr = [];
					page.agencyExtArr = [];
					page.condEditArr = [];
					page.isUpdate = 0;

					$('input.isClear').val('');
					$("input[value='501']").prop("checked", true);
					$(".check-list-box input").prop("checked", true);
					$("input[name='isOpposite']").prop("checked", true);
				}

				//初始化数据范围表格
				var dataRange = [];
				var tempData = page.condEditArr;
				for (var i = 0; i < tempData.length; i++) {
					var obj = {}
					obj.conditionGuid = tempData[i].conditionGuid;

					var acctFlag = true;
					if (tempData[i].accountbookGuid != "" && tempData[i].accountbookGuid != null) {
						acctFlag = true;
						obj.accountbookGuid = tempData[i].accountbookGuid;
						var acctObj = $.inArrayJson(page.acctList, 'accountbookGuid', tempData[i].accountbookGuid);
						if (!$.isNull(acctObj)) {
							obj.accountbookName = acctObj.accountbookName;
						}
					} else {
						obj.accountbookGuid = null;
						obj.accountbookName = null;
						acctFlag = false;
					}

					var accoFlag = true;
					// if (acctFlag && tempData[i].accoCode != "" && tempData[i].accoCode != null) {
					// 	accoFlag = true;
					// 	obj.accoCode = tempData[i].accoCode;
					// 	page.reqAccoTree(tempData[i].acctCode);
					// 	var accoObj = $.inArrayJson(page.accoTree, 'accoCode', tempData[i].accoCode);
					// 	obj.accoCodeName = accoObj.accoCodeName;
					// } else {
					// 	obj.accoCode = null;
					// 	obj.accoName = null;
					// 	accoFlag = false;
					// }

					var eleFlag = true;
					if (acctFlag && accoFlag && tempData[i].accoAccItem != "" && tempData[i].accoAccItem != null) {
						eleFlag = true;
						obj.eleCode = tempData[i].accoAccItem;
						page.reqAccItemList(tempData[i].accountbookGuid);
						var eleObj = $.inArrayJson(page.accItemList, 'eleCode', tempData[i].accoAccItem);
						obj.eleName = eleObj.eleName;
					} else {
						obj.eleCode = null;
						obj.eleName = null;
						eleFlag = false;
					}

					if (acctFlag && accoFlag && eleFlag && tempData[i].chrCode != "" && tempData[i].chrCode != null) {
						obj.accContCode = tempData[i].chrCode;
						page.reqAccItemTree(tempData[i].accoAccItem);
						var accContObj = $.inArrayJson(page.accItemTree, 'accContCode', tempData[i].chrCode);
						obj.accContCodeName = accContObj.accContCodeName;
					} else {
						obj.accContCode = null;
						obj.accContCodeName = null;
					}

					if (tempData[i].operationSymbol1 != "" && tempData[i].operationSymbol1 != null) {
						obj.operCode1 = tempData[i].operationSymbol1;
						var operObj1 = $.inArrayJson(page.OperatorList1, 'operCode1', tempData[i].operationSymbol1);
						obj.operName1 = operObj1.operName1;
					} else {
						obj.operCode1 = null;
						obj.operName1 = null;
					}

					if (tempData[i].operationSymbol2 != "" && tempData[i].operationSymbol2 != null) {
						obj.operCode2 = tempData[i].operationSymbol2;
						var operObj2 = $.inArrayJson(page.OperatorList2, 'operCode2', tempData[i].operationSymbol2);
						obj.operName2 = operObj2.operName2;
					} else {
						obj.operCode2 = null;
						obj.operName2 = null;
					}

					// if(tempData[i].operationSymbol3 != "" && tempData[i].operationSymbol3 != null) {
					// 	obj.operCode3 = tempData[i].operationSymbol3;
					// 	var operObj3 = $.inArrayJson(page.OperatorList3, 'operCode3', tempData[i].operationSymbol3);
					// 	obj.operName3 = operObj3.operName3;
					// } else {
					// 	obj.operCode3 = null;
					// 	obj.operName3 = null;
					// }

					dataRange.push(obj);
				}
				page.initEditTable("agencyRange", dataRange);
				if ((page.action == "edit") && (page.isUpdate > 0)) { //已使用对账方案 设置数据范围列删除按钮置灰
					$("#agencyRange .btnDel").addClass("icon-plus-color");
				} else {
					$("#agencyRange .btnDel").removeClass("icon-plus-color");
				}

				//初始化单位日记账格式表格
				page.agencyColArr1 = [{
					title: "是否对账",
					data: "exm"
				},
				{
					//title: "凭证日期",//分支需求将凭证日期改为出纳账日期--zsj-bug74248
					title: "出纳账日期",
					data: "exm"
				},
				{
					//title: "凭证编号",//分支需求将凭证编号改为出纳账编号--zsj-bug74248
					title: "出纳账编号",
					data: "exm"
				},
				{
					title: "摘要",
					data: "exm"
				},
				{
					title: "借方金额",
					data: "exm"
				},
				{
					title: "贷方金额",
					data: "exm"
				},
				// {
				// 	title: "结算方式",
				// 	data: "exm"
				// },
				{
					title: "票据类型",
					data: "exm"
				},
				{
					title: "票据号",
					data: "exm"
				},
				{
					//title: "账套",
					title: "账簿", //分支需求将账套改为账簿--zsj-bug74248
					data: "exm"
				}
				];
				page.plusArr = [{
					title: '<span class="icon icon-plus uf-primary"></span>',
					data: "exm",
					//className: "colAdd cp"
					className: "colAdd cp hide" //分支需求暂时隐藏“+”--zsj-bug74248
				}];
				/*page.agencyColArr2 =[{title: "账套",data: "exm"}]*/

				if (page.action == "add") {
					page.reqElementList("agency");
					var allCols = page.agencyColArr1.concat(page.elementArr).concat(page.plusArr);
					page.agencyEmptyTable = page.initEmptyTable("agencyData", allCols, true);
				} else if (page.action == "edit") {
					if (page.isUpdate > 0) {
						page.reqElementList("agency");
						var allCols = page.agencyColArr1.concat(page.elementArr).concat(page.plusArr);
						page.agencyEmptyTable = page.initEmptyTable("agencyData", allCols, true, page.isUpdate);
					} else {
						page.reqElementList("agency");
						var allCols = page.agencyColArr1.concat(page.elementArr).concat(page.plusArr);
						page.agencyEmptyTable = page.initEmptyTable("agencyData", allCols, true, page.isUpdate);
					}

				}

				//初始化银行对账单格式表格
				page.bankColArr = [{
					title: "是否对账",
					data: "exm"
				},
				{
					title: "记账日期",
					data: "exm"
				},
				{
					//title: "凭证编号",//分支需求将凭证编号改为对账单编号--zsj-bug74248
					title: "对账单编号",
					data: "exm"
				},
				{
					title: "摘要",
					data: "exm"
				},
				{
					title: "借方金额",
					data: "exm"
				},
				{
					title: "贷方金额",
					data: "exm"
				},
				// {
				// 	title: "结算方式",
				// 	data: "exm"
				// },
				{
					title: "票据类型",
					data: "exm"
				},
				{
					title: "票据号",
					data: "exm"
				}
				];
				if (page.action == "add") {
					page.reqElementList("bank");
					page.bankEmptyTable = page.initEmptyTable("bankData", page.bankColArr);
				} else if (page.action == "edit") {
					page.reqElementList("bank");
					var extArr = [];
					for (var i = 0; i < page.bankExtArr.length; i++) {
						if (page.bankExtArr[i].enabled == "1") {
							var extObj = {};
							extObj.title = page.bankExtArr[i].showName;
							extObj.data = "exm";
							extObj.eleCode = page.bankExtArr[i].eleCode;
							extArr.push(extObj);
						}
					}
					var thisBankColArr = page.bankColArr;
					var newBankColArr = thisBankColArr.concat(extArr);
					$("#bankData").html("");
					page.bankEmptyTable = page.initEmptyTable("bankData", newBankColArr);
				}
				$("#agencyRangeBody").css("height","159px")
				page.onEventListener();

			}
		}
	}();
	page.init();
});