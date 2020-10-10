$(function () {
	var page = function () {
		var portList = {
			selectAgencyInfo: "/ma/initNewYear/selectAgencyInfo", //查询单位新年度初始化状态
			initData: "/ma/initNewYear/initData", //新年度初始化
			getSysTemInfo: '/ma/initNewYear/getSysTemInfo'//系统级新年度初始化状态查询
		};
		return {
			system: false,
			agencyCode: '',
			agencyCodeList: [],
			getSysTemInfo: function () {
				var tabArgu = {
					setYear: page.setYear,
					rgCode: page.pfData.svRgCode
				};
				ufma.ajax(portList.getSysTemInfo, "get", tabArgu, function (result) {
					console.log(result);
					if (result.flag === 'success') {
						$('.sysDataTableStatus').html(result.data);
					} else {
						ufma.showTip(result.msg, function () { }, 'error');
					}
				});
			},
			initData: function (system, agencyList) {
				if (!system && agencyList.length <= 0) {
					ufma.showTip('请选择初始化单位', function () { }, "warning");
				}
				var tabArgu = {
					agencyList: agencyList,
					setYear: page.setYear,
					newYear: page.initYear,
					rgCode: page.pfData.svRgCode,
					system: system,//是否系统级
					userId: page.pfData.svUserId,
					userName: page.pfData.svUserName
				};
				ufma.showloading('正在初始化，请耐心等待...');
				ufma.ajax(portList.initData, "post", tabArgu, function (result) {
					ufma.hideloading();
					console.log(result);
					if (result.flag === 'success') {
						if (system) {
							ufma.showTip(result.msg, function () { }, result.flag);
							page.getSysTemInfo();
							// $('.sysDataTableStatus').html(result.msg);
						} else {
							//更新树
							atreeObj.updateAtree(page.agencyCode, function (agencyCode) {
								page.agencyCode = agencyCode;
								//重新查询一次
								page.queryTableData(agencyCode);
							});
							ufma.showTip('初始化成功', function () { }, "success");
						}
					} else {
						ufma.showTip('初始化失败', function () { }, 'error');
					}
				});
			},
			queryTableData: function (agencyCode) {
				if (!agencyCode) {
					page.showTable([], '');
					return;
				}
				var tabArgu = {
					agencyCode: agencyCode,
					setYear: page.setYear,
					rgCode: page.pfData.svRgCode,
					userId: page.pfData.svUserId,
					userName: page.pfData.svUserName
				};
				// ufma.showloading('正在加载数据，请耐心等待...');
				ufma.ajax(portList.selectAgencyInfo, "post", tabArgu, function (result) {
					// ufma.hideloading();
					console.log(result);
					page.showTable(result.data, result.msg, function () {

					});
				});

			},
			initTable: function () {
				var columns = [
					// {
					// 	title: '<label class="mt-checkbox mt-checkbox-single mt-checkbox-outline"> <input type="checkbox" class="datatable-group-checkable" id="check_H"/>&nbsp;<span></span> </label>',
					// 	data: null,
					// 	className: 'tc nowrap no-print',
					// 	width: 50,
					// 	render: function(data, type, rowdata, meta) {
					// 		return (
					// 		  '<label class="mt-checkbox mt-checkbox-single mt-checkbox-outline"> ' +
					// 		  '<input type="checkbox" class="checkboxes" data-id="' +
					// 		  data.enuCode +
					// 		  '" />' +
					// 		  '&nbsp;<span></span></label>'
					// 		)
					// 	  }
					// },
					{
						title: "模块",
						data: "enuName",
						className: 'tc nowrap',
						width: 200,
						render: function (data, type, rowdata, meta) {
							return data ? data : '';
						}
					},
					{
						title: "覆盖",
						data: 'cover',
						className: 'tc nowrap',
						width: 130,
						render: function (data, type, rowdata, meta) {
							var str = '<div id="coverCombox' + meta.row + '" data-type="' + rowdata.enuCode + '" class="uf-combox"></div>';
							return str;
						}
					},
					{
						title: "结转状态",
						data: "remark",
						className: 'tc nowrap',
						render: function (data, type, rowdata, meta) {
							return data ? data : '';
						}
					}];
				page.table = $('#annualReview').dataTable({
					"language": {
						"url": bootPath + "agla-trd/datatables/datatable.default.js"
					},
					"autoWidth": false,
					"bDestory": true,
					"processing": true, //显示正在加载中
					"paging": false, //分页样式
					searching: false,
					"serverSide": false,
					"ordering": false,
					"bInfo": false,
					columns: columns,
					data: [],
					initComplete: function (settings, json) {
						// $('.datatable-group-checkable').on("change", function () {
						// 	var isCorrect = $(this).is(':checked'),moduleList = [];
						// 	$('#annualReview .checkboxes').each(function () {
						// 		if(isCorrect){
						// 			$(this).prop("checked", true)
						// 			$(this).closest("tr").addClass("selected")
						// 			var moduleName = $(this).attr('data-id');
						// 			moduleList.push({module:moduleName,cover:$('.uf-combox[data-type='+moduleName+']').getObj().getValue()});
						// 		}else{
						// 			$(this).prop("checked", false)
						// 			$(this).closest("tr").removeClass("selected")
						// 		}
						// 	});
						// 	var initNewYearAgencyList = JSON.parse(sessionStorage.getItem('initNewYearAgencyList'));
						// 	var flag = false;
						// 	if(initNewYearAgencyList&&initNewYearAgencyList.length>0){
						// 		initNewYearAgencyList.forEach(function(item,index){
						// 			if(item.agencyCode === page.agencyCode){
						// 				item.moduleList = moduleList;
						// 				flag = true;
						// 			}
						// 		})
						// 		if(!flag){//如果单位在当前session中不存在
						// 			initNewYearAgencyList.push({
						// 				agencyCode: page.agencyCode,
						// 				moduleList: moduleList
						// 			})
						// 		}
						// 	}else{
						// 		initNewYearAgencyList = [];
						// 		initNewYearAgencyList.push({
						// 			agencyCode: page.agencyCode,
						// 			moduleList: moduleList
						// 		})
						// 	}
						// 	sessionStorage.setItem('initNewYearAgencyList',JSON.stringify(initNewYearAgencyList));
						// });
						ufma.isShow(page.reslist);
					},
					"drawCallback": function (settings) {
						ufma.isShow(page.reslist);

						var data = [
							{
								code: 'Y',
								codeName: '是'
							},
							{
								code: 'N',
								codeName: '否'
							}]
						$('.uf-combox').each(function (i) {
							$("#coverCombox" + i).ufCombox({
								idField: "code",
								textField: "codeName",
								data: data, //json 数据 
								onChange: function (sender, data) {
									console.log(data);
									//【11.11】逻辑改变
									var moduleName = $("#coverCombox" + i).attr('data-type');
									console.log(page.agencyCode);
									var agency_module_cover = sessionStorage.getItem(page.agencyCode + '_module_cover');
									var arr = [];
									if (agency_module_cover) {
										arr = JSON.parse(agency_module_cover);
										if (arr && arr.length > 0) {//如果sessionStorage保存过该单位下的模块覆盖信息
											var moduleCoverFlag = false;
											arr.forEach(function (item, index) {
												if (item.module === moduleName) {//如果包含相同模块名称，修改该模块覆盖信息,并做标记
													item.cover = data.code;
													moduleCoverFlag = true;
												}
											})
											if (!moduleCoverFlag) {
												arr.push({ module: moduleName, cover: data.code })
											}
										} else {
											arr.push({ module: moduleName, cover: data.code })
										}
									} else {
										arr.push({ module: moduleName, cover: data.code })
									}
									console.log(arr);
									if(page.agencyCode!='*'){
										sessionStorage.setItem(page.agencyCode + '_module_cover', JSON.stringify(arr));
									}
									// var arr = JSON.parse(sessionStorage.getItem('initNewYearAgencyList'));
									// var moduleName = $("#coverCombox"+i).attr('data-type');
									// console.log(moduleName);
									// if(arr&&arr.length>0){
									// 	arr.forEach(function(item,index){
									// 		if(page.agencyCode === item.agencyCode){
									// 			item.moduleList.forEach(function(it,ind){
									// 				if(it.module===moduleName){
									// 					item.moduleList[ind].cover = data.code;
									// 				}
									// 			})
									// 		}
									// 	})
									// 	sessionStorage.setItem('initNewYearAgencyList',JSON.stringify(arr));
									// }
								},
								onComplete: function (sender) {
								}
							});
						})

						// var initNewYearAgencyList = JSON.parse(sessionStorage.getItem('initNewYearAgencyList'));

						$('.uf-combox').each(function (i) {
							var moduleName = $("#coverCombox" + i).attr('data-type');
							var agency_module_cover = sessionStorage.getItem(page.agencyCode + '_module_cover');
							if (agency_module_cover) {
								var arr = JSON.parse(agency_module_cover), flag = true, self = $(this);
								arr.forEach(function (item) {
									if (item.module === moduleName) {
										self.getObj().val(item.cover);
										flag = false;
									}
								})
								if (flag) {
									$(this).getObj().val('N');
								}
							} else {
								$(this).getObj().val('N');
							}
						})

						//表格每一行选中的初始化状态
						// if(initNewYearAgencyList&&initNewYearAgencyList.length>0){
						// 	initNewYearAgencyList.forEach(function(item,index){
						// 		if(item.agencyCode === page.agencyCode){
						// 			if(item.moduleList&&item.moduleList.length>0){
						// 				item.moduleList.forEach(function(it,ind){
						// 					$('#annualReview .checkboxes[data-id='+it.module+']').prop('checked',true);
						// 					//覆盖状态初始化
						// 					console.log(it.module);
						// 					console.log(it.cover);
						// 					var $coverCombox = $('.uf-combox[data-type='+it.module+']');
						// 					console.log($coverCombox);
						// 					console.log($coverCombox.getObj());
						// 					if($coverCombox.length>0){
						// 						$coverCombox.attr('data-val',it.cover);
						// 						$coverCombox.getObj().val(it.cover);
						// 					}
						// 				})
						// 			}
						// 		}
						// 	})
						// 	var checkAllFlag = true;
						// 	$('#annualReview .checkboxes').each(function(){
						// 		if(!$(this).prop('checked')){
						// 			checkAllFlag = false;
						// 		}
						// 	})
						// 	if(checkAllFlag){
						// 		$('.datatable-group-checkable').prop('checked',true)
						// 	}else{
						// 		$('.datatable-group-checkable').prop('checked',false)
						// 	}
						// }
						// $('#annualReview .checkboxes').each(function(i){
						// 	$(this).on('click',function(e){
						// 		var moduleName = e.target.dataset.id;
						// 		var cover = $('.uf-combox[data-type='+moduleName+']').getObj().getValue(),
						// 		status = e.target.checked;
						// 		console.log(page.agencyCode);
						// 		console.log('cover: ',cover);
						// 		var arr = JSON.parse(sessionStorage.getItem('initNewYearAgencyList'));
						// 		var flag = false,mark = false, markIndex = 0;
						// 		if(arr&&arr.length>0){//如果之前选择过
						// 			arr.forEach(function(item,index){
						// 				if(item.agencyCode === page.agencyCode){//如果点击的是当前单位
						// 					item.moduleList.forEach(function(it,ind){
						// 						if(it.module === moduleName){//如果之前选择过模块
						// 							it.cover = cover;//是否覆盖赋值
						// 							markIndex = ind;
						// 							mark = true;
						// 						}
						// 					})
						// 					if(!mark){//如果之前未选中过这个模块
						// 						if(status){
						// 							item.moduleList.push({module:moduleName,cover:cover});//是否覆盖赋值
						// 						}
						// 					}else{
						// 						if(!status){
						// 							item.moduleList.splice(markIndex, 1);//数组中剪切
						// 						}
						// 					}
						// 					flag = true;
						// 				}
						// 			})

						// 			if(flag){//如果选中的当前单位之前选中过
						// 				sessionStorage.setItem('initNewYearAgencyList',JSON.stringify(arr));
						// 			}else{//如果没有选中过
						// 				var obj = {
						// 					agencyCode: page.agencyCode,
						// 					moduleList: []
						// 				}
						// 				obj.moduleList.push({module:moduleName,cover:cover})
						// 				arr.push(obj);
						// 				sessionStorage.setItem('initNewYearAgencyList',JSON.stringify(arr));
						// 			}
						// 		}else{//如果之前未选择过
						// 			if(status){
						// 				var list = [],agencyObj = {
						// 					agencyCode: page.agencyCode,
						// 					moduleList: []
						// 				}
						// 				console.log($('.uf-combox [data-type='+moduleName+']').getObj());
						// 				agencyObj.moduleList.push({module:moduleName,cover:cover});
						// 				list[0] = agencyObj;
						// 				sessionStorage.setItem('initNewYearAgencyList',JSON.stringify(list));
						// 			}
						// 		}


						// 	})
						// })
					}
				})
			},
			showTable: function (data, msg, cb) {
				console.log(data);
				if (data) {
					if (data.length > 0) {
						page.table.fnClearTable();
						page.table.fnAddData(data, true);
						if (typeof (cb) === 'function') {
							cb();
						}

					}
				}
			},
			initPage: function () {
				page.pfData = ufma.getCommonData();
				page.setYear = page.pfData.svSetYear;
				page.initYear = String(parseInt(page.setYear) + 1);
				$('#currentyear').val(page.setYear);
				$('#newyear').val(page.initYear);
				page.getSysTemInfo();
				page.initTable();
				atreeObj.initAtree(function (agencyCode) {
					page.agencyCode = agencyCode;
					page.queryTableData(agencyCode);
				});
			},
			onEventListener: function () {


				//系统级初始化
				$('#initsys-btn').on('click', function () {
					page.system = true;
					page.initData(true, []);
				});

				//单位级初始化
				$('#init-btn').on('click', function () {
					//单位级
					page.system = false;
					//获取选中的单位
					var treeObj = $.fn.zTree.getZTreeObj("atree");
					var nodes = treeObj.getCheckedNodes(true);
					if(nodes[0].id==='*'||nodes[0].code==='*'){
						nodes.splice(0,1);
					}
					if (nodes.length === 0) {
						ufma.showTip('请选择单位', function () { }, 'warning');
						return;
					}
					var reslist = [];
					nodes.forEach(function (item) {
						var agency_module_cover = sessionStorage.getItem(item.id + '_module_cover');
						var agencyModuleList = [];
						if (agency_module_cover) {
							agencyModuleList = JSON.parse(agency_module_cover);
						}
						if (agencyModuleList && agencyModuleList.length > 0) {
							reslist.push({ agencyCode: item.id, moduleList: agencyModuleList })
						} else {
							reslist.push({
								agencyCode: item.id, moduleList: [{ "module": "MA", "cover": "N" },
								{ "module": "GL", "cover": "N" },
								{ "module": "LP", "cover": "N" },
								{ "module": "CU", "cover": "N" },
								{ "module": "BG", "cover": "N" }]
							})
						}
					});
					console.log(reslist);
					//从sessionStorage获取选中了哪些单位的哪些模块，哪些模块选择了覆盖
					//结构[{agencyCode:"101",moduleList:[{module:"MA",cover:true},{module:"GL",cover:true}]]
					// var initNewYearAgencyList = JSON.parse(sessionStorage.getItem('initNewYearAgencyList'));
					// if (!initNewYearAgencyList || initNewYearAgencyList.length <= 0) {
					// 	ufma.showTip('请选择单位和模块', function () { }, 'warning');
					// 	return;
					// }

					// var reslist = [];
					// var noModuleFlag = false;
					// nodes.forEach(function (item, index) {
					// 	var flag = true;
					// 	initNewYearAgencyList.forEach(function (it, ind) {
					// 		if (it.moduleList && it.moduleList.length > 0) {
					// 			if (item.code === it.agencyCode) {
					// 				flag = false;
					// 				//initNewYearAgencyList需要过滤掉左侧树没选的
					// 				reslist.push(it);
					// 			}
					// 		}
					// 	})
					// 	if (flag) {//如果发现没有
					// 		ufma.showTip('已选择的单位' + item.code + '下无选中的模块', function () { }, 'warning');
					// 		noModuleFlag = true;
					// 		return;
					// 	}
					// });
					// if (noModuleFlag) {
					// 	return;
					// }
					if (reslist && reslist.length > 0) {
						page.initData(false, reslist);
						//清除sessionStorage
						var storage = window.sessionStorage;
						var str = '_module_cover'
						for (var i = 0; i < storage.length; i++) {
							var key = storage.key(i);
							if (key.indexOf(str) > -1) {
								sessionStorage.setItem(key, '');
							}
						}
					} else {
						ufma.showTip('请选择单位', function () { }, 'warning');
						return;
					}
				})
			},
			//此方法必须保留
			init: function () {
				page.reslist = ufma.getPermission();
				ufma.isShow(page.reslist);
				ufma.parse();
				//清除sessionStorage
				var storage = window.sessionStorage;
				var str = '_module_cover'
				for (var i = 0; i < storage.length; i++) {
					var key = storage.key(i);
					if (key.indexOf(str) > -1) {
						sessionStorage.setItem(key, '');
					}
				}
				this.initPage();
				this.onEventListener();

				var timeId = setTimeout(function () {
					//左侧树高度
					var h = $(window).height() - 128;
					$(".rpt-acc-box-left").height(h);
					var H = $(".rpt-acc-box-right").height();
					if (H > h) {
						$(".rpt-acc-box-left").height(h + 48);
						if ($("#tool-bar .slider").length > 0) {
							$(".rpt-acc-box-left").height(h + 52);
						}
					}
					$(".rpt-atree-box-body").height($(".rpt-acc-box-left").height() - 54);
					clearTimeout(timeId);
				}, 200);
			}
		}
	}();

	page.init();
	$(window).scroll(function () {
		if ($(this).scrollTop() > 30) {
			$(".rpt-acc-box-left").css("top", "12px");
		} else {
			$(".rpt-acc-box-left").css("top", "106px");
		}
	})
});