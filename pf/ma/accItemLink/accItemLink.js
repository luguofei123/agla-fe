$(function() {
	var curTableData = [],
		mainItemCode = '';
	var gridHead = []
	var gridOption = {}
	var istitle = 0
	var page = function() {

		//储存页面已存在session的key
		sessionKeyArr = [];
		var pfData = ufma.getCommonData();
		var module = "ma"; //模块代码
		var compoCode = "accItemLink"; //部件代码
		var rgCode = pfData.svRgCode;
		var nowSetYear = pfData.svSetYear;
		var nowUserId = pfData.svUserId; //修改权限  将svUserCode改为 svUserId  20181012
		var nowAgencyCode = pfData.svAgencyCode;
		var nowAgencyName = pfData.svAgencyName;
		var namespace = "#accItemLink";
		var isEdit = false; //是否做过修改未保存

		//辅助关联关系所用接口
		var portList = {
			agencyList: "/ma/sys/eleAgency/getAgencyTree", //单位列表接口
			acctCodeList: "/ma/sys/eleCoacc/getAcctTree/", //账套列表接口
			mainElementList: "/ma/sys/accItemLink/selectMainElement", //主要素列表
			getAccItemsInfo: "/ma/sys/accItemLink/getAccItemsInfo", //所有辅助核算下拉框的值
			getAccItemLinks: "/ma/sys/accItemLink/getAccItemLinks", //关联关系表格
			saveLinkTable: "/ma/sys/accItemLink/save" //保存关联关系表
		};

		var checkHtml = '<label class="mt-checkbox mt-checkbox-outline margin-right-8">' +
			'<input class="" type="checkbox">&nbsp;' +
			'<span></span>' +
			'</label>';
		return {
			//主要素列表
			reqMainElementList: function() {
				//var argu = "/"+nowAgencyCode+"/"+nowSetYear;
				var argu = {
					agencyCode: nowAgencyCode,
					acctCode: page.acctCode,
					setYear: nowSetYear,
					rgCode: rgCode
				};
				ufma.ajax(portList.mainElementList, "get", argu, function(result) {
					//console.log(result);
					var data = result.data;
					if(data.length > 0) {
						var listHtml = "";
						var listBtn = "";
						for(var i = 0; i < data.length; i++) {
							var item = data[i];
							if(item.countAccItemLinkData == 0) {
								var btn = ufma.htmFormat('<button type="button" data-code="<%=code%>" code="<%=id%>" class="btn btn-default link-item"><%=name%></button>', {
									code: data[i].eleCode,
									name: data[i].eleName,
									id: i
								});
								listHtml += btn;
							} else {
								var pageBtn = ufma.htmFormat('<li><a href="javascript:;" class="link-item" data-code="<%=code%>" code="<%=id%>"><%=name%></a></li>', {
									name: data[i].eleName,
									code: data[i].eleCode,
									id: i
								});
								listBtn += pageBtn
							}
						}
						$('#itemTab').css({
							'width': '3000px',
							'min-width': '100%'
						}).html(listBtn);
						var timeId = setTimeout(function() {
							clearTimeout(timeId);

							var tabWidth = 10,
								boxWidth = $('#navTabBox').width();
							$('#itemTab li').each(function() {
								tabWidth += $(this).outerWidth(true);
								$(this)[boxWidth < tabWidth ? 'addClass' : 'removeClass']('hidden');
							});
							$('#itemTab').css({
								'width': tabWidth + 'px'
							});
							$('#tabBtn')[boxWidth < tabWidth ? 'removeClass' : 'addClass']('none');
						}, 600);

						$(".link-ele-box-left-r").html(listHtml);
						//$(namespace + " .link-ele-box-left-r button").eq(0).removeClass("btn-default").addClass("btn-primary");
						//$('.table-sub-info .btn_box div').eq(0).addClass("active").removeClass('unactive').siblings('div').removeClass('active').addClass('unactive')
						//page.reqTableData(data[0].ELE_CODE);
						//CWYXM-5419--主要素与itemTab的要素存在互斥关系，当主要素中存在时itemTab就会消失，故当itemTab有值时优先选中itemTab--zsj
						if($('#itemTab').find('.link-item').length > 0) {
							mainItemCode = '';
						}
						var tabItem = $.isNull(mainItemCode) ? $('#itemTab').find('.link-item').eq(0) : $('[data-code="' + mainItemCode + '"]');
						if(tabItem.length > 0) {
							tabItem.trigger('click');
						} else {
							$(".link-ele-box-left-r button").eq(0).trigger('click');
						}
					}
				});
			},

			//请求所有辅助核算下拉框的值
			reqAccItemsInfo: function() {
				var argu = {
					agencyCode: nowAgencyCode,
					acctCode: page.acctCode,
					setYear: nowSetYear,
					rgCode: rgCode
				};
				ufma.ajaxDef(portList.getAccItemsInfo, "get", argu, function(result) {
					var infoData = result.data;
					for(var i = 0; i < infoData.length; i++) {
						gridOption[infoData[i].accItemFieldCode] = infoData[i].treeData
					}
				});
			},

			//请求关联关系表格
			reqTableData: function(code,searchKey) {
				isEdit = true;
				var argu = {
					mainItem: code,
					agencyCode: nowAgencyCode,
					acctCode: page.acctCode,
					setYear: nowSetYear,
					rgCode: rgCode,
					searchKey : searchKey
				};
				istitle = 1
				ufma.ajaxDef(portList.getAccItemLinks, "get", argu, function(result) {
					var data = result.data;
					page.tableData = data;
					page.showFZTable(data);
					ufma.hideloading();
				});
			},
			showFZTable: function(data) {
				$(".link-all-check input").prop("checked", false);
				var column = [{
						type: 'toolbar',
						field: 'option',
						name: '操作',
						width: 60,
						headalign: 'center',
						render: function(rowid, rowdata, data) {
							return '<button class="btn btn-delete" rowid="' + rowid + '" data-toggle="tooltip" title="删除"><span class="icon-trash"></span></button>';
						}
					},
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
						type: 'indexcolumn',
						key: '',
						name: '序号',
						width: 60,
						align: 'center',
						headalign: 'center'
					}
				];
				var headdata = data.tableHead
				$.each(headdata, function(i, item) { //解决 回显render问题 用for会把变量看成全局  
					//var item = assistItems[i];
					var cbItem = item.accItemFieldCode;
					var cbItemname = cbItem + 'Name';
					column.push({
						type: 'treecombox',
						field: data.tableHead[i].accItemFieldCode,
						name: data.tableHead[i].eleName,
						width: 180,
						headalign: 'center',
						idField: 'id',
						textField: 'codeName',
						pIdField: 'pId',
						leafRequire: true, //bug78013---修改为只有叶子节点可以选择--zsj
						data: gridOption[headdata[i].accItemFieldCode],
						render: function(rowid, rowdata, data) {
							if(!data) {
								return '';
							}
							return data + ' ' + rowdata[cbItemname]
						}
					});
				});
				var tableData = [];
				for(var i = 0; i < data.tableData.length; i++) {
					tableData.push(data.tableData[i]);
				}

				//所有辅助核算下拉框的值
				//				var infoDataKey = ufma.sessionKey(module, compoCode, rgCode, nowSetYear, nowAgencyCode, "", "AccItemsInfo");
				//				var infoDataStr = sessionStorage.getItem(infoDataKey);
				//				var infoDataData = JSON.parse(infoDataStr);
				//				var aFZLB = infoDataData;
				curTableData = tableData;
				$(namespace + ' #fztable').ufDatagrid({
					data: tableData,
					disabled: false, // 可选择
					columns: [column],
					frozenStartColumn: 1, //冻结开始列,从1开始
					frozenEndColumn: 1, //冻结结束列
					initComplete: function(options, data) {}
				});
				istitle = 0
				ufma.isShow(page.reslist);
				$("#rpt-tool-bar .link-table-count").html(tableData.length)
			},

			//判断表格为空时，添加提示图片，禁用全选
			isNoData: function() {
				var len = $(namespace).find("table tbody tr").length;
				if(len <= 0) {
					$(namespace).find(".noData").show();
					$(namespace).find(".link-all-check input,thead input").attr("disabled", true);
				} else {
					$(namespace).find(".noData").hide();
					$(namespace).find(".link-all-check input,thead input").removeAttr("disabled");
				}
			},
			//获取账套
			acctCodeList: function() {
				ufma.get(portList.acctCodeList + page.agencyCode, {
					"rgCode": rgCode,
					"setYear": nowSetYear
				}, function(result) {
					var acctData = result.data;
					if(acctData.length > 0) {
						page.chooseAcctFlag = false;
						/*page.cbAcct = $("#cbAcct").ufmaTreecombox2({
							data: acctData
						});*/
					} else {
						page.chooseAcctFlag = true;
					}
					page.cbAcct = $("#cbAcct").ufmaTreecombox2({
						valueField: 'code',
						textField: 'codeName',
						placeholder: '请选择账套',
						icon: 'icon-book',
						data: acctData,
						onchange: function(data) {
							page.acctCode = data.code;
							page.acctName = data.name;
							page.accsCode = data.accsCode;
							page.accsName = data.accsName;
							//请求所有辅助核算下拉框的值
							page.reqAccItemsInfo();
							//主要素列表
							page.reqMainElementList();
							//缓存单位账套
							var params = {
								selAgecncyCode: page.agencyCode,
								selAgecncyName: page.agencyName,
								selAcctCode: page.acctCode,
								selAcctName: page.acctName
							}
							ufma.setSelectedVar(params);
						},
						initComplete: function(sender) {
							if(!$.isNull(page.acctCode) && page.acctCode != '*' && !$.isNull(page.acctName)) {
								page.cbAcct.val(page.acctCode, page.acctName);
							} else if(acctData.length > 0) {
								page.cbAcct.select(1);
							} else {
								page.cbAcct.val('');
								page.acctCode = '';
								page.acctName = '';
								page.accsCode = '';
								page.accsName = '';
								var data = [];
								page.showFZTable(data);
							}
						}
					});
				});
				//page.initAcctScc();
			},
			//初始化账套
			/*initAcctScc: function() {
				page.cbAcct = $("#cbAcct").ufmaTreecombox2({
					valueField: 'code',
					textField: 'codeName',
					placeholder: '请选择账套',
					icon: 'icon-book',
					onchange: function(data) {
						page.acctCode = data.code;
						page.acctName = data.name;
						page.accsCode = data.accsCode;
						page.accsName = data.accsName;
						//主要素列表
						page.reqMainElementList();
						//请求所有辅助核算下拉框的值
						page.reqAccItemsInfo();
						//缓存单位账套
						var params = {
							selAgecncyCode: page.agencyCode,
							selAgecncyName: page.agencyName,
							selAcctCode: page.acctCode,
							selAcctName: page.acctName
						}
						ufma.setSelectedVar(params);
					},
					initComplete: function(sender) {
						if(!$.isNull(page.acctCode) && page.acctCode != '*' && !$.isNull(page.acctName)) {
							page.cbAcct.val(page.acctCode, page.acctName);
						} else if(data.length) {
							page.cbAcct.select(1);
						}
					}
				});
			},*/
			//初始化页面
			initPage: function() {
				page.reslist = ufma.getPermission();
				page.acctCode = pfData.svAcctCode;
				page.acctName = pfData.svAcctName;
				page.chooseAcctFlag = false;
				//初始化单位列表
				$("#cbAgency").ufmaTreecombox2({
					valueField: 'id',
					textField: 'codeName',
					placeholder: '请选择单位',
					icon: 'icon-unit',
					onchange: function(data) {

						//给全局单位变量赋值
						nowAgencyCode = data.id;
						page.agencyCode = nowAgencyCode;
						nowAgencyName = data.name;
						page.agencyName = data.name;
						page.acctCode = '';
						page.acctName = '';
						gridOption = {};
						if(data.isLeaf == '0') {
							$('#cbAcct').addClass('hide');
							page.acctCode = '*';
							//请求所有辅助核算下拉框的值
							// page.reqAccItemsInfo();
							// //主要素列表
							// page.reqMainElementList();
						} else {
							$('#cbAcct').removeClass('hide');
							page.acctCodeList();
						}
						//缓存单位账套
						var params = {
							selAgecncyCode: nowAgencyCode,
							selAgecncyName: nowAgencyName,
						}
						ufma.setSelectedVar(params);
					}
				});

				//请求单位列表
				ufma.ajax(portList.agencyList, "get", {
					"rgCode": rgCode,
					"setYear": nowSetYear
				}, function(result) {
					var data = result.data;
					var cbAgency = $("#cbAgency").ufmaTreecombox2({
						data: result.data
					});

					var code = data[0].id;
					var name = data[0].name;

					if(nowAgencyCode != "" && nowAgencyName != "") {
						cbAgency.val(nowAgencyCode);
					} else {
						cbAgency.setValue(code, name);
						nowAgencyCode = code;
						nowAgencyName = name;
					}
					//主要素列表
					//page.reqMainElementList();

					//请求所有辅助核算下拉框的值
					//page.reqAccItemsInfo();

				});

			},
			checkEdit: function() {
				var tmpData = $(namespace + " #fztable").getObj().getData();
				for(var i = 0; i < tmpData.length; i++) {
					for(var s in tmpData[i]) {
						if(tmpData[i][s] == '' || tmpData[i][s] == "*") {
							delete tmpData[i][s]
						}
					}
				}
				for(var i = 0; i < curTableData.length; i++) {
					for(var s in curTableData[i]) {
						if(curTableData[i][s] == '' || curTableData[i][s] == "*") {
							delete curTableData[i][s]
						}
					}
				}
				var bEdit = (JSON.stringify(curTableData) == JSON.stringify(tmpData))
				if(curTableData.length == 0 && tmpData.length == 0) return true;
				if(istitle == 1) return true;
				return bEdit;
			},
			//页面元素事件绑定使用jquery 的 on()方法
			onEventListener: function() {
				//取数
				$(document).on("click", "#btn-import", function() {
					if(page.chooseAcctFlag == true) {
						ufma.showTip('请选择账套', function() {}, 'warning');
						return false;
					} else {
						var openData = {
							agencyCode: nowAgencyCode,
							acctCode: page.acctCode
						}
						ufma.open({
							url: 'importModel.html',
							title: '取数',
							width: 1100,
							height: 650,
							data: openData,
							ondestory: function(data) {
								if(data.action && data.action.action) {
									ufma.showTip(data.action.msg, function() {}, data.action.flag)
									var mainCode = $(".link-ele-box-left-r .btn-primary").attr("data-code");
									if($("#itemTab li.active").length > 0) {
										mainCode = $("#itemTab li.active").find("a").attr("data-code")
									}
									mainItemCode = '';
									page.reqMainElementList();
									page.reqTableData(mainCode,"");
								}
							}
						});

					}
				});
				//更多主要素
				$(namespace + " #moreQuery").on("click", function() {
					if($(this).find("span").hasClass("icon-angle-bottom")) {
						$(this).find("i").text("收起");
						$(this).find("span").removeClass("icon-angle-bottom").addClass("icon-angle-top");
						$(namespace + " .link-ele-box-left-r").animate({
							"height": "100%"
						});
					} else {
						$(this).find("i").text("更多");
						$(this).find("span").removeClass("icon-angle-top").addClass("icon-angle-bottom");
						$(namespace + " .link-ele-box-left-r").animate({
							"height": "36px"
						});
					}
				});

				//单选主要素
				$(".link-ele-box-left-r,#itemTab").on("click", ".link-item", function(e) {
					e.stopPropagation();
					if(page.chooseAcctFlag == true) {
						var data = [];
						page.showFZTable(data);
						ufma.showTip('请选择账套', function() {}, 'warning');
						return false;
					} else {
						if($(this).hasClass('btn-primary')) return false;
						if($(this).parent('li').hasClass('active')) return false;
						if($(this).parent('li').siblings('.active').length == 0 && $(this).siblings('.btn-primary').length == 0) {
							isEdit = true;
						} else {
							isEdit = page.checkEdit();
						}
						var that = $(this);

						function setActive() {
							if(that.is('button')) {
								that.addClass("btn-primary").removeClass("btn-default");
								that.siblings("button").removeClass("btn-primary").addClass("btn-default");
								$('#itemTab .active').removeClass('active')
							} else {
								that.closest('li').addClass('active');
								that.closest('li').siblings('.active').removeClass('active');
								$('.link-ele-box-left-r .btn-primary').removeClass('btn-primary');
							}
						}
						if(!isEdit) {
							ufma.confirm('您有未保存的内容，确认离开吗？', function(action) {
								if(action) { //确认
									setActive();
									var code = $(that).data("code");
									mainItemCode = '';
									mainItemCode = code;
									page.reqTableData(code,"");
								} else { //取消

								}
							}, {
								type: 'warning'
							});
						} else {
							setActive();
							var code = $(that).data("code");
							mainItemCode = '';
							mainItemCode = code;
							page.reqTableData(code,"");
						}
					}

				})

				$('#rightMove').on('click', function() {
					if(page.chooseAcctFlag == true) {
						var data = [];
						page.showFZTable(data);
						ufma.showTip('请选择账套', function() {}, 'warning');
						return false;
					} else {
						var lastItems = $('#itemTab li.hidden');
						if(lastItems.length == 0) return false;
						$lastItem = $(lastItems[0]);
						$lastItem.removeClass('hidden');
						var ml = parseInt($('#itemTab').css('margin-left').replace('px', '')) - $lastItem.outerWidth(true);
						$('#itemTab').css({
							'margin-left': ml + 'px'
						});
					}

				});
				$('#leftMove').on('click', function() {
					if(page.chooseAcctFlag == true) {
						ufma.showTip('请选择账套', function() {}, 'warning');
						return false;
					} else {
						var lastItems = $('#itemTab li:not(.hidden)');
						if(lastItems.length == 0) return false;
						$lastItem = $(lastItems[lastItems.length - 1]);
						var ml = parseInt($('#itemTab').css('margin-left').replace('px', '')) + $lastItem.outerWidth(true);
						ml = ml > 0 ? 0 : ml;
						$('#itemTab').css({
							'margin-left': ml + 'px'
						});
						if(ml < 0)
							$lastItem.addClass('hidden');
					}

				});

				//按钮提示
				$("[data-toggle='tooltip']").tooltip();

				//新增辅助项关联关系
				//新增辅助项关联关系
				$(namespace + " #accSysAdd").click(function() {
					if(page.chooseAcctFlag == true) {
						ufma.showTip('请选择账套', function() {}, 'warning');
						return false;
					} else {
						if (!$.isNull(window.globalConfig)) {
							if (!window.globalConfig.loadCompleted) {
								ufma.showTip("正在加载数据...请稍候再进行操作！", function () { }, "warning");
								return false;
							}
						}
						var obj = $(namespace + ' #fztable').getObj(); // 取对象
						var newId = obj.add();
						obj.edit(newId);
						$("#rpt-tool-bar .link-table-count").html(obj.getData().length)
					}

				});
				//全选
				$(namespace).on("click", ".link-all-check,thead .mt-checkbox", function() {
					var flag = $(this).find("input").prop("checked");
					if(flag) {
						$(namespace + ' #fztable').find('input[type="checkbox"]').prop("checked", true)
					} else {
						$(namespace + ' #fztable').find('input[type="checkbox"]').prop("checked", false)
					}
				});
				//单行删除
				$(document).on('click', namespace + " #fztable .btn-delete", function(e) {
					var obj = $(namespace + " #fztable").getObj(); // 取对象
					var rowid = $(this).closest('tr').attr('id');
					obj.del(rowid);
					for(var i = 0; i < $(namespace + ' #fztable').find('.indexcolumn').length; i++) {
						$(namespace + ' #fztable').find('.indexcolumn').eq(i).html(i + 1)
					}
					$("#rpt-tool-bar .link-table-count").html(obj.getData().length)
				})
				//批量删除
				$(namespace + " #link-select-del").on("click", function() {
					if(page.chooseAcctFlag == true) {
						ufma.showTip('请选择账套', function() {}, 'warning');
						return false;
					} else {
						var obj = $(namespace + ' #fztable').getObj(); // 取对象
						if(obj.getCheckData().length > 0) {
							ufma.confirm('您确定要删除选中的数据？', function(action) {
								if(action) {
									//点击确定的回调函数
									for(var i = $(namespace + " #fztable").find('.check-item').length; i >= 0; i--) {
										if($(namespace + " #fztable").find('.check-item').eq(i).prop("checked")) {
											var thisid = $(namespace + " #fztable").find('.check-item').eq(i).closest('tr').attr('id')
											obj.del(thisid);
										}
									}
									for(var i = 0; i < $(namespace + ' #fztable').find('.indexcolumn').length; i++) {
										$(namespace + ' #fztable').find('.indexcolumn').eq(i).html(i + 1)
									}
									$("#rpt-tool-bar .link-table-count").html(obj.getData().length)
								} else {
									//点击取消的回调函数
								}
							}, {
								type: 'warning'
							});

						} else {
							ufma.alert("请选择要删除的数据！", "warning");
							return false;
						}
					}

				})

				//保存表格数据
				$("#saveTable").on("click", function() {
					if(page.chooseAcctFlag == true) {
						ufma.showTip('请选择账套', function() {}, 'warning');
						return false;
					} else {
						if(page.checkEdit()) {
							ufma.showTip('数据没有变化！', function() {}, 'warning');
							return false;
						}
						//if($(namespace+" .table-discoloration tbody tr").length!=0){
						var isSave = true,
							mainEleName;
						mainEleName = $("#fztable thead tr").find("th").eq(2).text();
						$(namespace + " .table-discoloration tbody tr").each(function() {
							var code = $(this).find("td").eq(2).find(".ufma-treecombox").ufmaTreecombox().getValue();
							if(code == "") {
								isSave = false;
							}
						});
						if(isSave) {
							ufma.showloading('数据保存中，请耐心等待...');
							var data = $(namespace + " #fztable").getObj().getData();
							for(var i = 0; i < data.length; i++) {
								delete data[i].cb;
							}

							var argu = {};
							//if(data.length>0){
							argu.data = data;
							argu.agencyCode = nowAgencyCode;
							argu.acctCode = page.acctCode;
							//argu.mainItem = $(namespace + " .link-ele-box-left-r").find(".btn-primary").attr("data-code");
							argu.mainItem = mainItemCode;
							argu.rgCode = rgCode;
							argu.setYear = nowSetYear;
							ufma.ajax(portList.saveLinkTable, "post", argu, function(result) {
								ufma.showTip(result.msg, function() {}, result.flag);
								ufma.hideloading();
								$('[data-code="' + mainItemCode + '"]').trigger('click');
								page.reqMainElementList();
							});

						} else {
							ufma.alert("主要素" + mainEleName + "不能为空！", "warning");
							return false;
						}
					}

					// }else{
					// 	ufma.showTip("表格数据为空！",function(){},"warning");
					// }

				});

				//打印
				$('.btn-print').click(function() {
					if(page.printData.length > 0) {
						uf.tablePrint({
							mode: "rowHeight",
							pageHeight: 924,
							title: '辅助关联关系',
							topLeft: nowAgencyName,
							topCenter: '',
							topRight: '记录总数：' + page.printData.length,
							bottomLeft: '',
							bottomCenter: '',
							bottomRight: '<span class="page-num"></span>',
							data: page.printData,
							columns: [page.exportColumns]
						});
					} else {
						ufma.showTip("表格已保存的数据为空！", function() {}, "warning");
						return false;
					}
				});
				//搜索
				$("#searchHideBtn").on("click", function () {
					var mainCode = $(".link-ele-box-left-r .btn-primary").attr("data-code");
					if ($("#itemTab li.active").length > 0) {
						mainCode = $("#itemTab li.active").find("a").attr("data-code")
					}
					page.reqTableData(mainCode, $(".searchHide").val());
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

	/////////////////////
	page.init();
});