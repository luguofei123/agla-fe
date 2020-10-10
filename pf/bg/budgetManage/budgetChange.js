$(function () {
	window._close = function (state) {
		if (window.closeOwner) {
			var data = {
				action: state,
				result: {}
			};
			window.closeOwner(data);
		}
	}
	var page = function () {
		var assistItems = window.ownerData.assistItems;
		return {
			//获取编辑表格数据  guohx
			getTableData: function (bgItemId) {
				var callback = function (result) {
					page.initTable(result.data);
				};
				var argu = {
					"bgItemId": bgItemId,
					"agencyCode": window.ownerData.agencyCode,
					"setYear": window.ownerData.setYear
				};
				var url = "/bg/budgetItem/getItemELeList";
				ufma.post(url, argu, callback);
			},
			//获取要素树
			reqAccItemTree: function (eleCode) {
				var argu = {
					"agencyCode": window.ownerData.agencyCode,
					"setYear": window.ownerData.setYear,
					"eleCode": eleCode,
					"isNew":1
				};
				ufma.ajaxDef("/bg/sysdata/getEleBgItemValues", "get", argu, function (result) {
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
			//初始化表头
			getBudgetHead: function (tableData) { // 第一个页面表格
				var columns = [];
				var column1 = [ // 支持多表头
					{
						//type: 'input',
						field: 'eleName',
						name: '要素',
						// width: 200,
						idField: 'eleCode',
						textField: 'eleName',						
            headalign: 'center',
            className: "nowrap BGThirtyLen",
						render: function (rowid, rowdata, data) {
							if (!data) {
								return "";
							}
							return data;
						}
					},
					{
            //CWYXM-18848 --指标登记簿-指标变更原值可删，新值为空或为重都可保存，具体见截图--经雪蕊确认：控制不能删除，不能修改，新值必须填，必须不一致--zsj
						// type: 'input',
						field: 'eleValueCodeName',
						name: '原值',
						// width: 200,
            headalign: 'center',
            className:'oldTd BGThirtyLen',
						render: function (rowid, rowdata, data) {
							if (!data) {
								return "";
							} else {
                return '<span title="'+data+'" oldCode="'+rowdata.eleValue+'">'+data+'</span>';
              }
						}
					},
					{
						type: 'treecombox',
						field: 'accContCode',
						name: '新值',
						// width: 200,
						headalign: 'center',
						idField: 'accContCode',
						textField: 'accContCodeName',
            leafRequire: false,
            className:'BGThirtyLen',
						beforeExpand: function (e) { //下拉框初始化
							var $trEdit = e.sender.parent(".uf-grid-table-edit");
							var $trShow = e.sender.attr("rowid"); //对应展示数据的行id
							var eleCode = e.rowData.eleCode;
							if (!$.isNull(eleCode)) {
								//获取辅助项内容树
								page.reqAccItemTree(eleCode);
								$(e.sender).getObj().load(page.accItemTree);
								if (e.rowData.hasOwnProperty("accContCode")) {
									e.sender.getObj().val(e.rowData.accContCode);
								}
							} else {
								$(e.sender).getObj().load([]);
              }
              //CWYXM-18848 指标登记簿-指标变更原值可删，新值为空或为重都可保存，具体见截图--zsj
              page.accContCode = e.rowData.accContCode
						},
						onChange: function (e) {
              //CWYXM-18848 指标登记簿-指标变更原值可删，新值为空或为重都可保存，具体见截图--zsj
              var id = e.rowId;
              var code = $('tr[id="' + id + '"]').find('td.oldTd span').attr('oldCode')
              if (code == e.rowData.accContCode) {
                e.sender.getObj().val(page.accContCode);
                ufma.showTip('新值不能和原值一致！',function(){},'warning')
                return false;
              }
						},
						render: function (rowid, rowdata, data) {
							return rowdata.accContCodeName;
						}
					},
				];
				columns.push(column1);
				return columns;
			},
			//保存凭证模板
			save: function () {
				var cwkjData = $('#cwkj-data').getObj().getData();
				//最外层数据
				var items = [];
				var temp = {
					bgItemId: window.ownerData.bgItemId
        };
        var cont = 0;//CWYXM-18848 指标登记簿-指标变更原值可删，新值为空或为重都可保存，具体见截图--zsj
				for (var i = 0; i < cwkjData.length; i++) {
          temp[cwkjData[i].eleFieldName] = cwkjData[i].accContCode;
          //CWYXM-18848 指标登记簿-指标变更原值可删，新值为空或为重都可保存，具体见截图--zsj
          if ($.isNull(cwkjData[i].accContCode)) {
            cont++;
          }
				}
				items.push(temp);
				var argu = {
					"items": items
				}
				var callback = function (result) {
					if (result.flag == "success") {
						ufma.showTip("保存成功！", function () {
							_close('ok');
						}, "success");
					} else {
						ufma.showTip("保存失败！", function () { _close('ok'); }, "error");
					}
				}
        var agencyCode = window.ownerData.agencyCode;
        //CWYXM-18848 指标登记簿-指标变更原值可删，新值为空或为重都可保存，具体见截图--zsj
        if (cont > 0) {
          ufma.showTip('新值不能为空！',function(){},'warning')
          return false;
        } else {
          ufma.post("/bg/ctrlManage/updateBgCtrl?agencyCode=" + agencyCode, argu, callback);
        }
			},
			//初始化表格
			initTable: function (data) {
				$('#cwkj-data').ufDatagrid({
					data: data,
					disabled: false, // 可选择
					columns: page.getBudgetHead(data),
					initComplete: function (options, data) {

					},
				});
			},
			initPage: function () {
				page.getTableData(window.ownerData.bgItemId);
			},
			onEventListener: function () {
				$('#btn-save').click(function () {
					$("#btn-save").attr("disabled", true)
					page.save();
					var timeId = setTimeout(function () {
						$("#btn-save").attr("disabled", false)
						clearTimeout(timeId);
					}, 5000);
				});
				$('#btn-cancle').click(function () {
					_close('ok');
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
