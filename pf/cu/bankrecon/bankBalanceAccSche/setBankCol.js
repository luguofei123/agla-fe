$(function() {
	window._close = function(action, arr) {
		if(window.closeOwner) {
			var data = {
				action: action,
				extArr: arr
			};
			window.closeOwner(data);
		}
	}
	var page = function() {
		return {
			//初始化对账单格式表格
			initColTable: function(id, data) {
				$('#' + id).ufDatagrid({
					data: data,
					columns: [
						[ //支持多表头
							{
								type: 'indexcolumn',
								name: '序号',
								width: 58,
								headalign: 'center',
								align: 'center'
							},
							{
								field: 'field0',
								name: '字段',
								width: 150,
								headalign: 'center'
							},
							{
								type: 'input',
								field: 'showName',
								name: '显示名称',
								width: 200,
								headalign: 'center'
							},
							{
								type: 'combox',
								field: 'eleCode',
								name: '对应要素',
								width: 200,
								headalign: 'center',
								idField: 'eleCode',
								textField: 'title',
								data: page.eleList,
								onChange: function(e) {},
								beforeExpand: function(e) {},
								render: function(rowid, rowdata, text) {
									if(!rowdata.eleCode) return '';
									return  rowdata.title
								}
							},
							{
								name: '启用',
								field: 'isChecked',
								type: 'switch',
								width: 120,
								headalign: 'center',
								align: 'center'
							}
						]
					],
					initComplete: function(options, data) {
						for(var i = 0; i < data.length; i++) {
							if(page.action == "edit" && page.isUpdate > 0) {
								var $trShow = $(".uf-grid-table #bankColSet_row_" + (i + 1));
								var $trEdit = $(".uf-grid-table-edit[rowid='bankColSet_row_" + (i + 1) + "']");
								$trShow.addClass("bgc-gray2");
								$trShow.click(function() {
									return false;
								})
								$trShow.find("[name='isChecked'] input").attr("disabled", "disabled");
							}
						}
					},

				});
			},

			onEventListener: function() {
				//取消设置银行对账单的模态框
				$('#setRankModal .btn-close').on('click', function() {
					_close("close", []);
				});
				//保存设置银行对账单的模态框
				$('#setRankModal .btn-sure').on('click', function() {
					var obj = $('#bankColSet').getObj(); //取对象
					var arr = obj.getData();
					var colArr = []
					var n = 0;
					for(var i = 0; i < arr.length; i++) {
						var extGuid = arr[i].guid;
						var showName = arr[i].showName;
						var eleName = arr[i].title;
						var eleCode = arr[i].eleCode;
						var isChecked = arr[i].isChecked;
						if(showName != "" && eleName != "") {
							n++;
							var colObj = {};
							colObj.enabled = arr[i].isChecked;
							if(page.action = "add") {
								colObj.schemaGuid = "";
							} else if(page.action = "edit") {
								colObj.schemaGuid = page.data.schemaGuid;
							}
							var ff = "";
							if((i + 1) > 9) {
								ff = "field";
							} else {
								ff = "field0";
							}
							colObj.extendField = ff + (i + 1);
							colObj.showName = showName;
							colObj.extendFieldGuid = extGuid;
							colObj.ordSeq = n;
							colObj.bookType = "02";
							colObj.eleCode = eleCode
							colArr.push(colObj);
						}
						if(((showName == "" || eleName == "") && isChecked == 1) || (isChecked == 0 && (showName != "" || eleName != ""))) {
							ufma.showTip("请输入显示名称和对应要素,并启用！", function() {}, "warning");
							return false;
						}
					}
					_close("save", colArr);

				});
			},

			//此方法必须保留
			init: function() {
				ufma.parse();
				page.agencyCode = window.ownerData.agencyCode;
				page.action = window.ownerData.action;
				page.setYear = window.ownerData.setYear;
				page.eleList = window.ownerData.eleList;
				page.saveEleList = window.ownerData.saveEleList;
				page.bankExtArr = window.ownerData.data;
				page.isUpdate = window.ownerData.isUpdate;

				//获取权限数据
				//            	page.reslist = ufma.getPermission();
				//            	ufma.isShow(page.reslist);

				var tableData = [{
						field0: '自定义字段1',
						showName: '',
						title: '',
						eleCode: '',
						isChecked: 0,
						guid: "",
						isUpdate: 0
					},
					{
						field0: '自定义字段2',
						showName: '',
						title: '',
						eleCode: '',
						isChecked: 0,
						guid: "",
						isUpdate: 0
					},
					{
						field0: '自定义字段3',
						showName: '',
						title: '',
						eleCode: '',
						isChecked: 0,
						guid: "",
						isUpdate: 0
					},
					{
						field0: '自定义字段4',
						showName: '',
						title: '',
						eleCode: '',
						isChecked: 0,
						guid: "",
						isUpdate: 0
					},
					{
						field0: '自定义字段5',
						showName: '',
						title: '',
						eleCode: '',
						isChecked: 0,
						guid: "",
						isUpdate: 0
					},
					{
						field0: '自定义字段6',
						showName: '',
						title: '',
						eleCode: '',
						isChecked: 0,
						guid: "",
						isUpdate: 0
					},
					{
						field0: '自定义字段7',
						showName: '',
						title: '',
						eleCode: '',
						isChecked: 0,
						guid: "",
						isUpdate: 0
					},
					{
						field0: '自定义字段8',
						showName: '',
						title: '',
						eleCode: '',
						isChecked: 0,
						guid: "",
						isUpdate: 0
					},
					{
						field0: '自定义字段9',
						showName: '',
						title: '',
						eleCode: '',
						isChecked: 0,
						guid: "",
						isUpdate: 0
					},
					{
						field0: '自定义字段10',
						showName: '',
						title: '',
						eleCode: '',
						isChecked: 0,
						guid: "",
						isUpdate: 0
					}
				];
				// for(var i=0;i<page.bankExtArr.length;i++){
        		// 	var num = page.bankExtArr[i].extendField.substring(5);
        		// 	tableData[num-1].showName = page.bankExtArr[i].showName;
        		// 	tableData[num-1].eleCode = page.bankExtArr[i].eleCode;
        		// 	var eleObj = $.inArrayJson(page.eleList,'eleCode',page.bankExtArr[i].eleCode);
        		// 	tableData[num-1].title = eleObj.title;
        		// 	tableData[num-1].isChecked = page.bankExtArr[i].enabled;
        		// 	tableData[num-1].guid = page.bankExtArr[i].extendFieldGuid;
        		// 	tableData[num-1].isUpdate = page.isUpdate;
				// }
				for(var i=0;i<page.bankExtArr.length;i++){ //修改 兼容项目关联号 relation by guohx
					//var num = page.bankExtArr[i].extendField.substring(5);
        			tableData[i].showName = page.bankExtArr[i].showName;
        			tableData[i].eleCode = page.bankExtArr[i].eleCode;
        			var eleObj = $.inArrayJson(page.eleList,'eleCode',page.bankExtArr[i].eleCode);
        			tableData[i].title = eleObj.title;
        			tableData[i].isChecked = page.bankExtArr[i].enabled;
        			tableData[i].guid = page.bankExtArr[i].extendFieldGuid;
        			tableData[i].isUpdate = page.isUpdate;
        		}
				/*for(var i = 0; i < page.bankExtArr.length; i++) {
					var num = page.bankExtArr[i].extendField.substring(5);
					tableData[num - 1].showName = page.bankExtArr[i].showName;
					tableData[num - 1].eleCode = page.bankExtArr[i].eleCode;
				if(page.saveEleList[i]!=undefined){
                    var eleObj = page.saveEleList[i];
					tableData[num - 1].title = eleObj.title;
				}
					tableData[num - 1].isChecked = page.bankExtArr[i].enabled;
					tableData[num - 1].guid = page.bankExtArr[i].extendFieldGuid;
					tableData[num - 1].isUpdate = page.isUpdate;
				}*/
				page.initColTable("bankColSet", tableData);
				page.onEventListener();

			}
		}
	}();
	page.init();
});