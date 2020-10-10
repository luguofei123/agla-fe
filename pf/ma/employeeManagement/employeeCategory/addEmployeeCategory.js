$(function() {
	//open弹窗的关闭方法
	window._close = function(action) {
		if(window.closeOwner) {
			var data = {
				action: action
			};
			window.closeOwner(data);
		}
	};
	var svData = ufma.getCommonData();
	var ownerData = window.ownerData;
	var rowData = ownerData.rowdata ? JSON.parse(ownerData.rowdata) : {};

	function getByteLen(val) {
		var len = 0
		for(var i = 0; i < val.length; i++) {
			var a = val.charAt(i)
			if(a.match(/[^\x00-\xff]/gi) != null) {
				len += 2
			} else {
				len += 1
			}
		}
		return len
	}

	//接口URL集合
	var interfaceURL = {
		saveEmpClass: "/ma/emp/EmpClass/saveEmpClass", //保存
		selectEmpClassProperty: "/ma/emp/personType/selectEmpClassProperty", //查询已选择的属性
		selectMaEmpPropertyNotUseByClass: "/ma/emp/maEmpProperty/selectMaEmpPropertyNotUseByClass" //获取人员属性接口
	};
	var pageLength = 25;

	var page = function() {
		return {
			//表格列
			recombineColumns: function() {
				var columns = [
					[ // 支持多表头
						{
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
							field: 'dist_code',
							width: 300,
							name: '值集代码',
							headalign: 'center',
							align: 'left',
							render: function(rowid, rowdata, data) {
								return data;
							}
							// onKeyup: function (e) {
							//
							// }
						},
						{
							type: 'input',
							field: 'dist_name',
							width: 400,
							name: '值集名称',
							headalign: 'center',
							align: 'left',
							render: function(rowid, rowdata, data) {
								return data;
							}
						},
						{
							type: "toolbar",
							field: 'remark',
							width: 140,
							name: '操作',
							align: 'center',
							headalign: 'center',
							render: function(rowid, rowdata, data) {
								return '<a class="to-up btn btn-icon-only btn-sm btn-move-up btn-permission" data-toggle="tooltip" action= "" title="上移">' +
									'<span class="glyphicon icon-arrow-top"></span></a>' +
									'<a class="to-down btn btn-icon-only btn-sm btn-move-down btn-permission" data-toggle="tooltip" action= "" title="下移">' +
									'<span class="glyphicon icon-arrow-bottom"></span></a>';
							}
						}
					]
				];
				return columns;
			},
			//渲染表格
			showTable: function(tableData) {
				page.tableObjData = tableData;
				var id = "nameTable2";
				$('#' + id).ufDatagrid({
					data: tableData,
					disabled: false, // 可选择
					columns: page.recombineColumns(),
					initComplete: function(options, data) {
						//去掉谷歌表单自带的下拉提示
						// $(document).on("focus","input",function () {
						//     $(this).attr("autocomplete", "off");
						// });
					}
				});
			},
			//获取可选属性
			getProoerties: function(data, selectedArr) {
				var html = "<div class='list'></div>";
				$(".selectabled .newArr").append(html);
				var liHtml = '';
				for(var i = 0; i < data.length; i++) {
					if(selectedArr.indexOf(data[i].PROPERTY_CODE) < 0) {
						liHtml += '<label class="mt-checkbox mt-checkbox-outline"><input type="checkbox" data-code="' + data[i].PROPERTY_CODE + '" data-name="' + data[i].PROPERTY_NAME + '">' + data[i].PROPERTY_NAME + '<span></span></label>'
					} else {
						liHtml += '<label class="mt-checkbox mt-checkbox-outline"><input type="checkbox" checked="checked" data-code="' + data[i].PROPERTY_CODE + '" data-name="' + data[i].PROPERTY_NAME + '">' + data[i].PROPERTY_NAME + '<span></span></label>'
					}
				}
				$(".selectabled .newArr").find(".list").append(liHtml);
				if(selectedArr.length == data.length) {
					//$(".selectabled").find(".checkAll").attr("checked");
					$(".selectabled .newArr .checkAll").find("input").prop("checked", true);
				}
			},
			//获取已选属性
			getSelectedProoerties: function() {
				var argu = {
					classCode: rowData.classCode ? rowData.classCode : "",
					agencyCode: "*",
					rgCode: svData.svRgCode
				};
				ufma.post(interfaceURL.selectEmpClassProperty, argu, function(result) {
					var newData = result.data;
					//guohx CWYXM-17576已选属性部分丢失 20200617 此处逻辑原来处理返回的顺序 现在已经修改为后端按照ordIndex顺序返回
					// for(var i = 0; i < data.length; i++) {
					// 	var index = i + 1;
					// 	for(var y = 0; y < data.length; y++) {
					// 		if(index == data[y].ordIndex) {
					// 			newData.push(data[y]);
					// 		}
					// 	}
					// }
					var selectedArr = [];
					var html = "<ul class='list'></ul>";
					$(".selected .useArr").append(html);
					if(newData.length > 0) {
						var liHtml = '';
						for(var i = 0; i < newData.length; i++) {
							selectedArr.push(newData[i].propertyCode);
							liHtml += '<label class="mt-checkbox mt-checkbox-outline"><input type="checkbox" data-code="' + newData[i].propertyCode + '" data-name="' + newData[i].propertyName + '">' + newData[i].propertyName + '<span></span><i class="glyphicon icon-arrow-top hidden"></i><i class="glyphicon icon-arrow-bottom hidden"></i></label>'
						}
						$(".selected .useArr").find(".list").append(liHtml);
					}

					page.selectMaEmpPropertyNotUseByClass(selectedArr, newData);
				});
			},
			//修改时set值
			setValue: function() {
				$('#frmQuery').setForm(rowData);
				if(ownerData.action == "edit") {
					$("#classCode").attr("disabled", true)
				}

			},
			//获取人员属性
			selectMaEmpPropertyNotUseByClass: function(selectedArr, seleceddata) {
				var argu = {
					"isSys": ownerData.rowdata ? JSON.parse(ownerData.rowdata).isSys : "N"
				};
				ufma.get(interfaceURL.selectMaEmpPropertyNotUseByClass, argu, function(result) {
					var data = result.data;
					for(var i = 0; i < seleceddata.length; i++) {

						var obj = {
							"PROPERTY_CODE": seleceddata[i].propertyCode,
							"PROPERTY_NAME": seleceddata[i].propertyName,
						}
						data.push(obj)
					}
					page.getProoerties(data, selectedArr);
				})

			},
			initPage: function() {
				//权限控制
				page.reslist = ufma.getPermission();
				ufma.isShow(page.reslist);
				//初始化表格
				page.showTable([]);
				page.getSelectedProoerties();
				page.setValue();
			},
			onEventListener: function() {
				//选择SQL语句引用值集界面变化
				$('input[name="sqlValue"]').on("change", function() {
					if($(this).prop("checked")) {
						$("#sqlValueCodes").attr("disabled", false);
						$(".manual-opt").attr("disabled", true);
						$(".btn-preview").attr("disabled", false);
					} else {
						$("#sqlValueCodes").attr("disabled", true);
						$(".manual-opt").attr("disabled", false);
						$(".btn-preview").attr("disabled", true);
					}
				})
				//关闭
				$("#btn-close").on("click", function() {
					_close();
				});
				//确定
				$("#btn-sure").on("click", function() {
					var argu = $('#frmQuery').serializeObject();
					//校验
					if(argu.classCode == "") {
						ufma.showTip("请填写类别代码", function() {

						}, "warning");
						return false
					} else if(argu.className == "") {
						ufma.showTip("请写类别名称", function() {

						}, "warning");
						return false
					}
					if(getByteLen(argu.classCode) > 30) {
						ufma.showTip("类别代码不能超过30个字符", function() {

						}, "warning");
						return false
					} else if(getByteLen(argu.className) > 60) {
						ufma.showTip("类别名称不能超过60个字符", function() {

						}, "warning");
						return false
					}

					argu.agencyCode = "*";
					argu.rgCode = svData.svRgCode;
					argu.op = "1";
					argu.empClassProperty = [];
					if(ownerData.action == "add") {
						argu.op = "0";
					}

					var selectedProperties = $(".selected .useArr").find("label");
					for(var i = 0; i < selectedProperties.length; i++) {
						if($(selectedProperties[i]).find("input").attr("data-code") != "*") {
							var obj = {
								propertyCode: $(selectedProperties[i]).find("input").attr("data-code"),
								propertyName: $(selectedProperties[i]).find("input").attr("data-name"),
								ordIndex: i,
								isEmpty: "N",
								isVisible: "N",
							};
							argu.empClassProperty.push(obj);
						}
					}
					$("button").attr("disabled", true);
					ufma.showloading("正在加载数据，请耐心等待...");
					ufma.post(interfaceURL.saveEmpClass, argu, function(result) {
						ufma.hideloading("正在加载数据，请耐心等待...");
						var closeData = {
							action: "save",
							msg: result.msg,
							flag: result.flag
						}
						_close(closeData)

					});
					var timeId = setTimeout(function() {
						clearTimeout(timeId);
						$("button").attr("disabled", false);
					}, "5000")

				});
				//全选
				$(document).on("click", ".checkAll", function() {
					if($(this).find("input").prop("checked")) {
						$(this).parent().siblings().find(".list label").find("input").prop("checked", true);
					} else {
						$(this).parent().siblings().find(".list label").find("input").prop("checked", false);
					}
				});
				$(document).on("click", ".selectabled .list label:not(.checkAll)", function() {
					var len = $(".selectabled label").length - 1;
					if($(".selectabled input:checked").length == len) {
						$(".selectabled .checkAll").find("input").prop("checked", true)
					} else {
						$(".selectabled .checkAll").find("input").prop("checked", false)
					}
				});
				$(document).on("click", ".selected .list label:not(.checkAll)", function() {
					var len = $(".selected label").length - 1;
					if($(".selected input:checked").length == len) {
						$(".selected .checkAll").find("input").prop("checked", true)
					} else {
						$(".selected .checkAll").find("input").prop("checked", false)
					}
				});
				//增加
				$(".add").on("click", function() {
					//CWYXM-4479-修改排序后，新添加的数据改变原有顺序问题--zsj
					var pushArray = [];
					var useArray = [];
					var newArray = [];
					$(".useArr .list label").each(function() {
						var code = $(this).find('input').attr("data-code");
						var name = $(this).find('input').attr("data-name");
						var useJson = {};
						if(code != "*" && !$.isNull(code) && !$.isNull(name)) {
							useJson = {
								"code": code,
								"name": name
							}
							useArray.push(useJson);
						}
					})
					//整理选择的属性写入到已选属性中
					var activeLi = $(".selectabled input:checked");
					$(".selectabled input:checked").each(function() {
						var code = $(this).attr("data-code");
						var name = $(this).attr("data-name");
						var newJson = {};
						if(code != "*" && !$.isNull(code) && !$.isNull(name)) {
							newJson = {
								"code": code,
								"name": name
							}
						}
						newArray.push(newJson);
					});
					var toSelectedHtml = '';
					if(useArray.length == 0) {
						useArray = newArray;
						for(var i = 0; i < useArray.length; i++) {
							var code = useArray[i].code;
							var name = useArray[i].name;
							if(code != "*" && !$.isNull(code) && !$.isNull(name)) {
								toSelectedHtml += '<label class="mt-checkbox mt-checkbox-outline"><input type="checkbox" data-code="' + code + '" data-name="' + name + '">' + name + '<span></span><i class="glyphicon icon-arrow-top hidden"></i><i class="glyphicon icon-arrow-bottom hidden"></i></label>'
							}
						}
						$(".selected .useArr").find(".list").append(toSelectedHtml);
					} else {
						var $useArea = $(".useArr .list");
						var arrResult = [];
						var userCodeArr = [];
						for(var i = 0; i < useArray.length; i++) {
							userCodeArr.push(useArray[i].code)
						}
						if(!$.equalsArray(useArray, newArray)) {
							for(var i = 0; i < newArray.length; i++) {
								var arrCom = [];
								arrCom.push(newArray[i].code);
								if(!ufma.arrayContained(userCodeArr, arrCom)) {
									var code = newArray[i].code;
									var name = newArray[i].name;
									var pushJson = {};
									if(code != "*" && !$.isNull(code) && !$.isNull(name)) {
										pushJson = {
											"code": code,
											"name": name
										}
										pushArray.push(pushJson);
									}
								}
							}
							for(var i = 0; i < pushArray.length; i++) {
								var code = pushArray[i].code;
								var name = pushArray[i].name;
								$('<label class="mt-checkbox mt-checkbox-outline"><input type="checkbox" data-code="' + code + '" data-name="' + name + '">' + name + '<span></span><i class="glyphicon icon-arrow-top hidden"></i><i class="glyphicon icon-arrow-bottom hidden"></i></label>').appendTo($useArea);
							}
						}
					}
					$(".selected .useArr .checkAll").find("input").removeAttr("checked");
				});
				//删除
				$(".del").on("click", function() {
					var activeLi = $(".selected input:checked");
					var delArr = [];
					activeLi.each(function() {
						if($(this).attr("data-code") != "*") {
							$(this).closest("label").remove();
							delArr.push($(this).attr("data-code"));
						}
					});
					//可选属性相应的取消勾选
					var selectedLi = $(".selectabled input:checked");
					//修改删除时全选按钮问题--zsj
					if(selectedLi.length ==0){
						$(".selected .useArr .checkAll").find("input:checked").removeAttr("checked");
					}
					selectedLi.each(function() {
						var code = $(this).attr("data-code");
						if(delArr.indexOf(code) > -1) {
							$(this).prop("checked", false);
							$(".selectabled .newArr .checkAll").find("input").removeAttr("checked");
						}
					});
					
				});
				//鼠标滑入显示上移下移
				$(document).on("mouseover", ".list label", function() {
					$(this).find("i").removeClass("hidden");
				});
				//鼠标滑入隐藏上移下移
				$(document).on("mouseout", ".list label", function() {
					$(this).find("i").addClass("hidden");
				});
				$(document).on("click", ".list label i", function(e) {
					stopPropagation(e);
					if($(this).hasClass("icon-arrow-top")) {
						var prevEle = $(this).closest("label").prev("label");
						if(prevEle.find("input").attr("data-code") != "*") {
							var html = $(this).closest("label").html();
							var newHtml = '<label class="mt-checkbox mt-checkbox-outline">' + html + '</label>';
							$(newHtml).insertBefore(prevEle);
							$(this).closest("label").remove();
						}
					} else if($(this).hasClass("icon-arrow-bottom")) {
						var nextEle = $(this).closest("label").next("label");
						if(nextEle.length > 0) {
							var html = $(this).closest("label").html();
							var newHtml = '<label class="mt-checkbox mt-checkbox-outline">' + html + '</label>';
							$(newHtml).insertAfter(nextEle);
							$(this).closest("label").remove();
						}
					}
					return false;
				});
			},

			//此方法必须保留
			init: function() {
				ufma.parse();
				page.initPage();
				page.onEventListener();
				ufma.parseScroll();
			}
		}
	}();
	/////////////////////
	page.init();

	function stopPropagation(e) {
		if(e.stopPropagation)
			e.stopPropagation();
		else
			e.cancelBubble = true;
	}
});