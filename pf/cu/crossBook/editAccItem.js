$(function () {
	/*window._close = function(state) {
		if(window.closeOwner) {
			var data = {
				action: state,
				result: {}
			};
			window.closeOwner(data);
		}
	}*/
	window._close = function (state, data) {
		if (window.closeOwner) {
			var data = {
				action: state,
				result: data
			};
			window.closeOwner(data);
		}
	}
	var page = function () {
		var tempL = window.ownerData.subRowData[0].rowid.length;
		var tempIndex = window.ownerData.subRowData[0].rowid.substring(14, tempL) - 1;
		var assistItems = window.ownerData.assistItems[window.ownerData.accountbookGuid].accItems;
		var accitemShow = window.ownerData.accitemShow;
		var requireAcc = window.ownerData.assistItems[window.ownerData.accountbookGuid].requiredACC;
		var dataAccitem = window.ownerData.dataAccitem;
		return {
			//获取要素树
			reqAccItemTree: function (eleCode) {
				var newData = [];
				for (var i = 0; i < assistItems.length; i++) {
					if (assistItems[i].eleCode == eleCode) {
						var tempAccitemList = assistItems[i].accItemDataList;
						for (var j = 0; j < tempAccitemList.length; j++) {
							var obj = {};
							obj.accContCode = tempAccitemList[j].id;
							obj.accContCodeName = tempAccitemList[j].codeName;
							obj.accContName = tempAccitemList[j].name;
							obj.isLeaf = tempAccitemList[j].isLeaf;
							obj.pId = tempAccitemList[j].pId;
							newData.push(obj);
						}
					}
				}
				var treeName = eleCode + "Tree";
				page[treeName] = newData;
			},
			//初始化表头
			getBudgetHead: function (tableData) { // 第一个页面表格
				var columns = [];
				var column1 = [ // 支持多表头
					{
						type: 'indexcolumn',
						field: 'ordSeq',
						name: '序号',
						width: 50,
						headalign: 'center',
						align: 'center'
					},
					{
						//type: 'input',
						field: 'eleName',
						name: '辅助核算项',
						width: 200,
						idField: 'eleCode',
						textField: 'eleName',
						headalign: 'center',
						render: function (rowid, rowdata, data) {
							if (!data) {
								return "";
							}
							return data;
						}
					},
					{
						type: 'treecombox',
						field: 'accContCode',
						name: '辅助核算内容',
						width: 200,
						headalign: 'center',
						idField: 'accContCode',
						textField: 'accContCodeName',
						leafRequire: true,
						beforeExpand: function (e) { //下拉框初始化
							var $trEdit = e.sender.parent(".uf-grid-table-edit");
							var $trShow = e.sender.parent().attr("rowid"); //对应展示数据的行id
							var eleCode = e.rowData.eleCode;
							if (!$.isNull(eleCode)) {
								//获取辅助项内容树
								page.reqAccItemTree(eleCode);
								var eleTree = eleCode + "Tree";
								var dataTree = page[eleTree];
								$(e.sender).getObj().load(dataTree);
								// if (e.rowData.hasOwnProperty("accContCode")) {
								// 	e.sender.getObj().val(e.rowData.accContCode);
								// }
							} else {
								$(e.sender).getObj().load([]);
							}
						},
						onChange: function (e) {

						},
						onComplete: function (e) {
							var $trEdit = e.sender.parent(".uf-grid-table-edit");
							var accitemCode = e.rowData.accitemCode;
							if (!$.isNull(accitemShow)) {
								for (var i = 0; i < accitemShow.length; i++) {
									if (accitemShow[i].keyDataCode == accitemCode) {
										e.sender.getObj().val(accitemShow[i].keyValueCode);
									}
								}
							}
						},
						render: function (rowid, rowdata, data) {
							return rowdata.accContCodeName;
						}
					}
				];
				columns.push(column1);
				return columns;
			},
			//保存校验辅项是否必填
			checkRequiredACC: function (accitemData) {
				var requiredACCarray = [];
				if (!$.isNull(requireAcc)) {
					requiredACCarray = requireAcc.split(',');
				}
				for (var i = 0; i < requiredACCarray.length; i++) {
					var requiredACCid = requiredACCarray[i];
					for (var j = 0; j < accitemData.length; j++) {
						if (requiredACCid == accitemData[j].eleCode) {
							// var tempCode = page.shortLineToTF(requiredACCid) + "Code";
							if ($.isNull(accitemData[j].accContCode)) {
								ufma.showTip('该账簿设置了辅助核算项' + accitemData[j].eleName + '必填,请先填写完整!', function () { }, 'warning');
								return false;
							}
						}
					}
				}
				return true;
			},

			save: function () {
				var accitemData = $('#accitemTable').getObj().getData();
				var items = [];
				//判断辅助核算项是否必填
				if (!page.checkRequiredACC(accitemData)) {
					return items;
				} else {
					for (var i = 0; i < accitemData.length; i++) {
						var temp = {
							assId: window.ownerData.subRowData[0].rowid
						}
						temp.keyDataCode = accitemData[i].accitemCode;
						temp.keyValueCode = accitemData[i].accContCode;
						temp.keyDataName = accitemData[i].accContCodeName;
						temp.keyEleName = accitemData[i].eleName;
						items.push(temp);
					}
					return items;
				}

			},
			//初始化表格
			initTable: function (data) {
				$('#accitemTable').ufDatagrid({
					data: data,
					disabled: false, // 可选择
					columns: page.getBudgetHead(data),
					initComplete: function (options, data) {
						var tableH = $(".ufma-layout-up").outerHeight(true) - 82;
						$('#accitemTable').css({
							height: tableH + 'px',
							'overflow-y': 'auto'
						});
					},
				});
			},
			initPage: function () {
				if (!$.isNull(dataAccitem)) {
					var accitemArr = dataAccitem.split(',');
					assitemArr = accitemArr;
					for (var j = 0; j < assitemArr.length; j++) {
						// var accitemObj = {};
						var accitemStr = accitemArr[j].split('：');
						var keyStr = Object.keys(window.ownerData.accItemObj);
						for (var k = 0; k < keyStr.length; k++) {
							if (accitemStr[0] == keyStr[k]) {
								var accitemArrary = accitemStr[1].split(' ');
								var tempCode = window.ownerData.accItemObj[keyStr[k]];
								for (var i = 0; i < assistItems.length; i++) {
									if (tempCode == assistItems[i].accitemCode) {
										assistItems[i].accContCodeName = accitemStr[1];
										assistItems[i].accContCode = accitemStr[1].split(' ')[0];
									}
								}
							}
						}
					}
				}
				// for (var i = 0; i < accitemShow.length; i++) {
				// 	if (accitemShow[i].keyDataCode == assistItems[i].accitemCode) {
				// 		assistItems[i].accContCodeName = accitemShow[i].keyDataName;
				// 	}
				// }
				page.initTable(assistItems);
				$("input").attr("autocomplete", "off");
			},
			onEventListener: function () {
				$('#btn-save').click(function () {
					var items = page.save();
					if (items.length != 0) {
						_close('ok', items);
					}
				});
				$('#btn-cancle').click(function () {
					var items = page.save();
					_close('ok', items);
				});
			},
			// 此方法必须保留
			init: function () {
				page.reslist = ufma.getPermission();
				ufma.isShow(page.reslist);
				page.pfData = ufma.getCommonData();
				ufma.parse();
				this.initPage();
				this.onEventListener();
			}
		}
	}();
	page.init();
});