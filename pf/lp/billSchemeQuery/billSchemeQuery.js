$(function () {
	window.showvouOpen = function(data) {
		var card = data;
		var urlPath = "";
		var turnUrl = urlPath + '/pf/gl/vou/index.html?menuid=6661003001001&action=preview&preview=0&dataFrom=vouBox'
		turnUrl = page.addRueicode(turnUrl);
		ufma.open({
		  url: turnUrl,
		  title: '查看凭证',
		  width: 1300,
		  // height:500,
		  data: card, // page.deleVouGuidWatch(result.data),--deleVouGuidWatch此方法未对data做处理，故直接用result.data代替
		  ondestory: function (data) {
		  }
		});
	};
	var ptData = ufma.getCommonData();
	var nowAgencyCode = ptData.svAgencyCode;
	var nowAgencyName = ptData.svAgencyName;
	var page = function () {
		var interfaceURL = {
			getAgencyTree: "/lp/eleAgency/getAgencyTree",//请求单位树
			previewNybVou: '/lp/targetBillCreate/previewNybVou',//-----预览接口
			createNybHzTargertBill: "/lp/targetBillCreate/createNybHzTargertBill", //---直接生成和批量生成
			cancelNybGenerateBill: '/lp/targetBillCreate/cancelNybGenerateBill',//---取消生成凭证接口
			saveNybPreviewTargetBill: '/lp/targetBillCreate/saveNybPreviewTargetBill',//--保存预览单据生成凭证
			viewVoucher: '/lp/targetBillCreate/viewVoucher/'//--预览凭证接口
		};
		return {
			receiveData: [],//累计接收到的未生成数据
			processedData: [],//累计接收到的已生成的数据
			addRueicode: function (url) {
				if (typeof hex_md5 === "function" && ufma.getCommonData().svUserCode != null) {
					if (url.indexOf('?') > 0) {
						url = url + "&rueicode=" + hex_md5(ufma.getCommonData().svUserCode)
					} else {
						url = url + "?rueicode=" + hex_md5(ufma.getCommonData().svUserCode)
					}
				}
				return url
			},
			initTables:function(){
				var columnsA = [{
					title: '<label class="mt-checkbox mt-checkbox-single mt-checkbox-outline"> <input type="checkbox" class="datatable-group-checkable" id="check_H"/>&nbsp;<span></span> </label>',
					data: null,
					className: 'tc nowrap no-print',
					width: 50,
					render: function (data, type, rowdata, meta) {
						return (
							'<label class="mt-checkbox mt-checkbox-single mt-checkbox-outline"> ' +
							'<input type="checkbox" class="checkboxes" data-id="' +rowdata.SCHEME_GUID +
							'" data-guid="' + rowdata.BILL_GUID + '" data-mainid="' + rowdata.MAIN_BILL_NO + '" />' +
							'&nbsp;<span></span></label>'
						)
					}
				}, {
					title: "单据方案",
					data: "SCHEME_NAME",
					className: 'tc nowrap ellipsis',
					width: 200,
					render: function (data, type, rowdata, meta) {
						return data ? data : '';
					}
				}, {
					title: "单据编号",
					data: "MAIN_BILL_NO",
					className: 'tc nowrap ellipsis',
					width: 200,
					render: function (data, type, rowdata, meta) {
						return data ? '<span class="urltz" data-id="'+rowdata.SCHEME_GUID+'" data-mainid="'+data+'" data-type="1">'+data+'</span>' : '';
					}
				}, {
					title: "收支内容",
					data: "FIELD01",
					className: 'tc nowrap ellipsis',
					width: 200,
					render: function (data, type, rowdata, meta) {
						return data ? data : '';
					}
				}, {
					title: "金额",
					data: "AMT01",
					className: 'tc nowrap ellipsis',
					width: 200,
					render: function (data, type, rowdata, meta) {
						return data ? data : '';
					}
				}, {
					title: "报销单日期",
					data: "FIELD28",
					className: 'tc nowrap ellipsis',
					width: 200,
					render: function (data, type, rowdata, meta) {
						return data ? data : '';
					}
				}, {
					title: "项目名称",
					data: "FIELD29",
					className: 'tc nowrap ellipsis',
					width: 200,
					render: function (data, type, rowdata, meta) {
						return data ? data : '';
					}
				}, {
					title: "经办人",
					data: "FIELD30",
					className: 'tc nowrap ellipsis',
					width: 200,
					render: function (data, type, rowdata, meta) {
						return data ? data : '';
					}
				}, {
					title: "内控制单人",
					data: "FIELD31",
					className: 'tc nowrap ellipsis',
					width: 200,
					render: function (data, type, rowdata, meta) {
						return data ? data : '';
					}
				}, {
					title: "操作",
					data: null,
					className: 'tc nowrap',
					width: 100,
					render: function (data, type, rowdata, meta) {
						return '<a class="generate" data-id="' + rowdata.SCHEME_GUID + '" data-guid="' + rowdata.BILL_GUID + '" data-mainid="' + rowdata.MAIN_BILL_NO + '" href="javascript:;" title="生成"><span class="glyphicon icon-result"></span></a><a class="preview" data-id="' + rowdata.SCHEME_GUID + '" data-guid="' + rowdata.BILL_GUID + '" data-mainid="' + rowdata.MAIN_BILL_NO + '" style="margin-left:15px;" href="javascript:;" title="预览"><span class="glyphicon icon-details"></span></a>';
					}
				}]
				page.table1 = $('#nameTable1').dataTable({
					"language": {
						"url": bootPath + "agla-trd/datatables/datatable.default.js"
					},
					"columns": columnsA,
					"data": [],
					"bAutoWidth": false, //表格自定义宽度
					"bDestory": true,
					"processing": true, //显示正在加载中
					"paging": false, //分页样式
					"searching": false,
					"serverSide": false,
					"bInfo": false,
					"autoWidth": true,
					"serverSide": false,
					"ordering": false,
					'destory':true,
					'scrollX':true,
					initComplete: function (settings, json) {
						$('#nameTable1_wrapper').ufScrollBar({
							hScrollbar: true,
							mousewheel: false
						})
						// ufma.setBarPos($(window))
						//checkbox的全选操作
						$('.datatable-group-checkable').on('change', function () {
							var isCorrect = $(this).is(':checked')
							$('#nameTable1 .checkboxes').each(function () {
								isCorrect
									? $(this).prop('checked', !0)
									: $(this).prop('checked', !1)
								isCorrect
									? $(this)
										.closest('tr')
										.addClass('selected')
									: $(this)
										.closest('tr')
										.removeClass('selected')
							})
							$('.datatable-group-checkable').prop('checked', isCorrect)
						})

						ufma.isShow(page.reslist)
						$('.datatable-toolbar [data-toggle="tooltip"]').tooltip()
					},
					"drawCallback": function (settings) {
						// if (data.length > 0) {
						// 	$('#nameTable1').fixedColumns({
						// 		rightColumns: 1 //锁定右侧一列
						// 		// leftColumns: 1//锁定左侧一列
						// 	})
						// }
						$('#nameTable1')
							.find('td.dataTables_empty')
							.text('目前还没有你要查询的数据')

						//权限控制
						ufma.isShow(page.reslist)
						// ufma.setBarPos($(window))
						$('#nameTable1_wrapper').ufScrollBar('update')
					}
				});
			},
			initTablesb: function () {
				var columnsB = [{
					title: '<label class="mt-checkbox mt-checkbox-single mt-checkbox-outline"> <input type="checkbox" class="datatable-group-checkable" id="check_H"/>&nbsp;<span></span> </label>',
					data: null,
					className: 'tc nowrap no-print',
					width: 50,
					render: function (data, type, rowdata, meta) {
						return (
							'<label class="mt-checkbox mt-checkbox-single mt-checkbox-outline"> ' +
							'<input type="checkbox" class="checkboxes" data-id="' +
							rowdata.SCHEME_GUID +
							'" data-mainid="' + rowdata.MAIN_BILL_NO + '" data-guid="' + rowdata.BILL_GUID + '"/>' +
							'&nbsp;<span></span></label>'
						)
					}
				}, {
					title: "凭证号",
					data: "PZZH",
					className: 'tc nowrap ellipsis',
					width: 200,
					render: function (data, type, rowdata, meta) {
						return data ? '<span class="urlvou" data-id="'+rowdata.SCHEME_GUID+'" data-mainid="'+data+'"  data-vouguid="'+rowdata.VOU_GUID+'" data-type="2">'+data+'</span>' : '';
					}
				}, {
					title: "单据方案",
					data: "SCHEME_NAME",
					className: 'tc nowrap ellipsis',
					width: 200,
					render: function (data, type, rowdata, meta) {
						return data ? data : '';
					}
				}, {
					title: "单据编号",
					data: "MAIN_BILL_NO",
					className: 'tc nowrap ellipsis',
					width: 200,
					render: function (data, type, rowdata, meta) {
						return data ? '<span class="urltz" data-id="'+rowdata.SCHEME_GUID+'" data-mainid="'+data+'" data-type="2">'+data+'</span>' : '';
					}
				}, {
					title: "收支内容",
					data: "FIELD01",
					className: 'tc nowrap ellipsis',
					width: 200,
					render: function (data, type, rowdata, meta) {
						return data ? data : '';
					}
				}, {
					title: "金额",
					data: "AMT01",
					className: 'tc nowrap ellipsis',
					width: 200,
					render: function (data, type, rowdata, meta) {
						return data ? data : '';
					}
				}, {
					title: "报销单日期",
					data: "FIELD28",
					className: 'tc nowrap ellipsis',
					width: 200,
					render: function (data, type, rowdata, meta) {
						return data ? data : '';
					}
				}, {
					title: "项目名称",
					data: "FIELD29",
					className: 'tc nowrap ellipsis',
					width: 200,
					render: function (data, type, rowdata, meta) {
						return data ? data : '';
					}
				}, {
					title: "经办人",
					data: "FIELD30",
					className: 'tc nowrap ellipsis',
					width: 200,
					render: function (data, type, rowdata, meta) {
						return data ? data : '';
					}
				}, {
					title: "内控制单人",
					data: "FIELD31",
					className: 'tc nowrap ellipsis',
					width: 200,
					render: function (data, type, rowdata, meta) {
						return data ? data : '';
					}
				}, {
					title: "操作",
					data: null,
					className: 'tc nowrap',
					width: 100,
					render: function (data, type, rowdata, meta) {
						return '<a class="cancelGenerate" data-id="' + rowdata.SCHEME_GUID + '" data-guid="' + rowdata.BILL_GUID + '" data-mainid="' + rowdata.MAIN_BILL_NO + '" href="javascript:;" title="取消生成"><span class="glyphicon icon-recover"></span></a><a class="btnWatch" data-id="' + rowdata.SCHEME_GUID + '" data-guid="' + rowdata.BILL_GUID + '" data-mainid="' + rowdata.MAIN_BILL_NO + '" href="javascript:;" style="margin-left: 15px;" title="查看凭证"><span class="glyphicon icon-eye"></span></a>';
					}
				}];
				page.table2 = $('#nameTable2').dataTable({
					"language": {
						"url": bootPath + "agla-trd/datatables/datatable.default.js"
					},
					"columns": columnsB,
					"data": [],
					"bAutoWidth": false, //表格自定义宽度
					"bDestory": true,
					"processing": true, //显示正在加载中
					"paging": false, //分页样式
					"searching": false,
					"serverSide": false,
					"bInfo": false,
					"autoWidth": true,
					"serverSide": false,
					"ordering": false,
					'destory':true,
					'scrollX':true,
					initComplete: function (settings, json) {
						$('#nameTable2_wrapper').ufScrollBar({
							hScrollbar: true,
							mousewheel: false
						})
						// page.setTable2BarPos();
						//checkbox的全选操作
						$('.datatable-group-checkable').on('change', function () {
							var isCorrect = $(this).is(':checked')
							$('#nameTable2 .checkboxes').each(function () {
								isCorrect
									? $(this).prop('checked', !0)
									: $(this).prop('checked', !1)
								isCorrect
									? $(this)
										.closest('tr')
										.addClass('selected')
									: $(this)
										.closest('tr')
										.removeClass('selected')
							})
							$('.datatable-group-checkable').prop('checked', isCorrect)
						})

						ufma.isShow(page.reslist)
						$('.datatable-toolbar [data-toggle="tooltip"]').tooltip()
					},
					"drawCallback": function (settings) {
						// if (data.length > 0) {
						// 	$('#nameTable2').fixedColumns({
						// 		rightColumns: 1 //锁定右侧一列
						// 		// leftColumns: 1//锁定左侧一列
						// 	})
						// }
						$('#nameTable2')
							.find('td.dataTables_empty')
							.text('目前还没有你要查询的数据')

						//权限控制
						ufma.isShow(page.reslist)
						// page.setTable2BarPos();
						$('#nameTable2_wrapper').ufScrollBar('update')
					}
				})
			},
			initAgency: function () {
				//单位选择
				page.cbAgency = $("#cbAgency").ufmaTreecombox2({
					valueField: 'id',
					textField: 'codeName',
					readonly: false,
					placeholder: '请选择单位',
					icon: 'icon-unit',
					onchange: function (data) {
						//请求要素
						// page.getEle();
						// lp.agencyCode = data.id;
						page.agencyTypeCode = data.divKind;
						var params = {
							selAgecncyCode: data.id,
							selAgecncyName: data.name,
						}
						ufma.setSelectedVar(params);

					},
					initComplete: function (sender) {
					}
				});
			},
			//请求单位树
			getAgencyTree: function () {
				ufma.showloading('正在加载数据，请耐心等待...');
				var argu = {
					setYear: ptData.svSetYear,
					rgCode: ptData.svRgCode
				};
				ufma.get(interfaceURL.getAgencyTree, argu, function (result) {
					ufma.hideloading();
					var data = result.data;
					page.cbAgency = $("#cbAgency").ufmaTreecombox2({
						data: data,
					});
					//默认选择单位S
					if (data.length != 0) {
						if (nowAgencyCode != "" && nowAgencyName != "") {
							var agency = $.inArrayJson(data, 'id', nowAgencyCode);
							if (agency != undefined) {
								page.cbAgency.val(nowAgencyCode);
							} else {
								// 5270 会计平台-凭证生成 第一次进入单位显示的是非账套级
								var isLeafNum = 0;
								if (data.length > 1) {
									for (var i = 0; i < data.length; i++) {
										if (data[i].isLeaf > 0) {
											isLeafNum = i;
											break;
										}
									}
								}
								page.cbAgency.select(isLeafNum + 1);
							}
						} else {
							page.cbAgency.select(1);
						}
					} else {
						ufma.hideloading();
					}

					//默认选择单位E
				});
			},
			updateTables: function (table, data) {
				if (data && data.length > 0) {
					table.fnClearTable();
					table.fnAddData(data, true);
				}
			},
			setTable2BarPos: function () {
				var $bar = $('.ufma-tool-bar');
				var barH = $bar.outerHeight(true);
				var bindElBtmPos = 0;
				$bar.parent().css('padding-bottom', barH + 20 + 'px');
				var $table2 = $('#nameTable2');
				if ($($table2.attr('tool-bar')).is($bar)) {

					if ($bar.attr('fixedwidth')) {
						$bar.width($table2.width());
					}

					bindElBtmPos = $table2.offset().top + $table2.outerHeight(true);
				}
				if ($bar.parent().outerHeight(true) != 0) {
					for (var i = 0; i < $bar.length; i++) {
						if ($bar.parents('#expfunc-choose-content').length < 1) {
							$bar.css({
								'position': 'absolute',
								'top': bindElBtmPos + 'px'
							});
						}
					}
				}
			},
			getData: function (btnId) {
				if (btnId === '1') {
					$('#nameTable1').removeClass('hide');
					$('#generateChecked').removeClass('hide');
					$('#nameTable2').addClass('hide');
					$('#cancelGenerate').addClass('hide');
					$('#tool-bar').find('.slider').remove()
					if (page.table1) { 
						page.table1.fnClearTable();    //清空数据
						page.table1.fnDestroy();         //销毁datatable
					}
					if (page.table2) { 
						page.table2.fnClearTable();    //清空数据
						page.table2.fnDestroy();         //销毁datatable
					}
					page.initTables();
					page.updateTables(page.table1, page.receiveData);
					// ufma.setBarPos($(window))
				} else {
					$('#nameTable1').addClass('hide');
					$('#generateChecked').addClass('hide');
					$('#nameTable2').removeClass('hide');
					$('#cancelGenerate').removeClass('hide');
					$('#tool-bar').find('.slider').remove()
					if (page.table1) { 
						page.table1.fnClearTable();    //清空数据
						page.table1.fnDestroy();         //销毁datatable
					}
					if (page.table2) { 
						page.table2.fnClearTable();    //清空数据
						page.table2.fnDestroy();         //销毁datatable
					}
					page.initTablesb()
					page.updateTables(page.table2, page.processedData);
					// setTimeout(function () {
					// 	page.setTable2BarPos();
					// }, 0)
					// ufma.setBarPos($(window))
				}

			},
			//批量生成后结果
			plBillGenerateResult: function (result, type) {
				//生成多条弹出有表格的弹窗
				var obj = {
					data: result.data,
					type: type
				};
				ufma.setObjectCache("GenerateModal", obj);
				ufma.open({
					url: 'billGenerateModal.html',
					title: '凭证生成结果',
					width: 1090,
					//height:500,
					data: result.data,
					ondestory: function (data) {
						//窗口关闭时回传的值
						if (data) {
						}
					}
				});
			},
			//跳转凭证录入界面增加参数rueicode
			addRueicode: function (url) {
				if (typeof hex_md5 === "function" && ufma.getCommonData().svUserCode != null) {
					if (url.indexOf('?') > 0) {
						url = url + "&rueicode=" + hex_md5(ufma.getCommonData().svUserCode)
					} else {
						url = url + "?rueicode=" + hex_md5(ufma.getCommonData().svUserCode)
					}
				}
				return url
			},
			initPage: function () {
				//初始化单位树
				page.initAgency();
				//请求单位树
				page.getAgencyTree();
				page.reslist = ufma.getPermission();
				ufma.isShow(page.reslist)
				//通过参数初始化查询
			},
			deteleObject: function(arr) {
				var uniques = [];
				var stringify = {};
				for (var i = 0; i < arr.length; i++) {
					var keys = Object.keys(arr[i]);
					keys.sort(function(a, b) {
						return (Number(a) - Number(b));
					});
					var str = '';
					for (var j = 0; j < keys.length; j++) {
						str += JSON.stringify(keys[j]);
						str += JSON.stringify(arr[i][keys[j]]);
					}
					if (!stringify.hasOwnProperty(str)) {
						uniques.push(arr[i]);
						stringify[str] = true;
					}
				}
				uniques = uniques;
				return uniques;
			},
			onEventListener: function () {
				//表格单行选中
				$(document).on("click", "tbody tr", function (e) {
					stopPropagation(e);
					if ($("td.dataTables_empty").length > 0) {
						return false;
					}
					var inputDom = $(this).find('input.checkboxes');
					var inputCheck = $(inputDom).prop("checked");
					$(inputDom).prop("checked", !inputCheck);
					$(this).toggleClass("selected");
					var $tmp1 = $("#nameTable1 .checkboxes:checkbox"),
					$tmp2 = $("#nameTable2 .checkboxes:checkbox");
					//选中单行的时候，需要将与此行主单据编号一致的单据自动选择上
					var mainid = inputDom.attr('data-mainid');
					$(this).parent('tbody').find('tr').not($(this)).find('input.checkboxes[data-mainid="'+mainid+'"]').prop("checked", !inputCheck).parents('tr').toggleClass("selected");
					$("#nameTable1 .datatable-group-checkable").prop("checked", $tmp1.length == $tmp1.filter(":checked").length);
					$("#nameTable2 .datatable-group-checkable").prop("checked", $tmp2.length == $tmp2.filter(":checked").length);
					return false;
				});
				//点击行内生成按钮
				$(document).on('click', 'tbody tr .generate', function (e) {
					stopPropagation(e);
					console.log(e.currentTarget.dataset.id);
					var id = e.currentTarget.dataset.id, guid = e.currentTarget.dataset.guid, mainid = e.currentTarget.dataset.mainid;
					if(!mainid){
						ufma.showTip('主单据号为空', function () { }, 'warning');
						return ;
					}else if(!id){
						ufma.showTip('SCHEME_GUID为空', function () { }, 'warning');
						return ;
					}else if(!guid){
						ufma.showTip('单据号BILL_GUID为空', function () { }, 'warning');
						return ;
					}
					var guids = [];
					var $generateBtns = $(this).parents('tbody').find('.generate[data-mainid="'+mainid+'"]');
					var errorFlag = false;
					$generateBtns.each(function(i){
						var guid = $(this).attr('data-guid');
						if(!guid){
							errorFlag = true;
							return ;
						}
						guids.push(guid);
					})
					if(errorFlag){
						ufma.showTip('相同主单据号的某条单据的单据号为空', function () { }, 'warning');
						return ;
					}
					console.log(guids);
					var tabArgu = [{
						rgCode: ptData.svRgCode,
						setYear: ptData.svSetYear,
						target: [{
							agencyCode: nowAgencyCode,
							guids: guids,
							schemeGuid: id
						}]
					}];
					console.log('tabArgu', tabArgu);
					ufma.showloading('正在生成凭证，请耐心等待...');
					//调用生成接口
					ufma.ajax(interfaceURL.createNybHzTargertBill, "post", tabArgu, function (result) {
						ufma.hideloading();
						console.log(result);
						if (result.flag === 'success') {
							ufma.showTip('生成成功', function () { }, 'success');
							//生成成功消去记录
							for(var i=page.receiveData.length-1;i>=0;i--){
								if(page.receiveData[i].MAIN_BILL_NO == mainid){
									var itemsss = page.receiveData.splice(i, 1)
									itemsss[0].STATE = 0
									page.processedData.push(itemsss[0])
								}
							}
							$('#itemTab').find('.active').click()
							//生成成功后要加一个查看凭证的操作
							page.plBillGenerateResult(result);
						} else {
							ufma.showTip(result.msg, function () { }, 'error');
						}
					});
				});
				//点击行内预览按钮
				//行内预览也要把所有相同主单据号的单据的单据号传入
				$(document).on('click', 'tbody tr .preview', function (e) {
					stopPropagation(e);
					console.log(e.currentTarget.dataset.id)
					var mainid = $(this).attr('data-mainid');
					if(!mainid){
						ufma.showTip('主单据号为空', function () { }, 'warning');
						return ;
					}
					var guids = [];
					var $previewBtns = $(this).parents('tbody').find('.preview[data-mainid="'+mainid+'"]');
					var errorFlag = false;
					$previewBtns.each(function(i){
						var guid = $(this).attr('data-guid');
						if(!guid){
							errorFlag = true;
							return ;
						}
						guids.push(guid);
					})
					if(errorFlag){
						ufma.showTip('相同主单据号的某条单据的单据号为空', function () { }, 'warning');
						return ;
					}
					console.log(guids);
					var schemeGuid = e.currentTarget.dataset.id;
					var tabArgu = {
						rgCode: ptData.svRgCode,
						setYear: ptData.svSetYear,
						target:[{
							agencyCode: nowAgencyCode,
							schemeGuid:schemeGuid,
							guids:guids
						}]
					}
					//调用预览接口
					ufma.ajax(interfaceURL.previewNybVou, "post", tabArgu, function (result) {
						console.log(result);
						if (result.flag === 'success') {
							// var urlPath = "http://127.0.0.1:8083";
							var urlPath = "";
							var turnUrl = urlPath + '/pf/gl/vou/index.html?menuid=6661003001001&action=preview&preview=1&dataFrom=vouBox'
							ufma.open({
								url: turnUrl,
								title: '凭证生成',
								width: 1200,
								// height:500,
								data: result.data,
								ondestory: function (data) {
									//窗口关闭时回传的值
									if (data.action && data.action.action == "save") {
										var argu = {};
										argu.schemeGuid = schemeGuid;
										//单条生成
										argu.billGuid = guids;
										argu.rgCode = ptData.svRgCode;
										argu.setYear = ptData.svSetYear;
										argu.vouHeadList = data.action.data;
										//保存并生成
										ufma.ajax(interfaceURL.saveNybPreviewTargetBill, "post", argu, function (res) {
											console.log(res);
											ufma.showTip('生成成功', function () { }, res.flag);
											for(var i=page.receiveData.length-1;i>=0;i--){
												if(page.receiveData[i].MAIN_BILL_NO == mainid){
													var itemsss = page.receiveData.splice(i, 1)
													itemsss[0].STATE = 0
													page.processedData.push(itemsss[0])
												}
											}
											$('#itemTab').find('.active').click()
											// page.plBillGenerateResult(result);
										})
									}
								}
							});
						} else {
							ufma.showTip(result.msg, function () { }, 'error');
						}
					});
				});
				$(document).on('click', 'tbody tr .urltz', function (e) {
					var schemeGuid= $(this).attr('data-id'),type = $(this).attr('data-type'),mainid = $(this).attr('data-mainid');
					var agencyCode = page.cbAgency.getValue()
					var baseUrl = '/pf/lp/billGenetateAccount/tarBillGenerate.html?menuid=e9d34f53-00e0-491e-aac5-e481156e91ef&schemeGuid='+
					schemeGuid+'&agencyCode='+agencyCode+'&mainid='+mainid+'&type='+ type;
					page.openNewPages(page.isCrossDomain , $(this), 'openMenu', baseUrl, false, '业务单据记账');
				});
				$(document).on('click', 'tbody tr .urlvou', function (e) {
					var vouGuid= $(this).attr('data-vouguid')
					var agencyCode = page.cbAgency.getValue()
					var baseUrl = '/pf/gl/vou/index.html?menuid=f24c3333-9799-439a-94c9-f0cdf120305d&dataFrom=bill&action=query&vouGuid=' + vouGuid + '&vouAccaCode=*'
					uf.openNewPage(page.isCrossDomain,$(this), 'openMenu',baseUrl, false, "凭证录入");
				});
				
				//点击行内取消生成按钮
				$(document).on('click', 'tbody tr .cancelGenerate', function (e) {
					stopPropagation(e);
					var $self = $(this);
					ufma.confirm('您确定要取消吗？', function (action) {
						if (action) {
							//点击确定的回调函
							//获取要取消生成的行的id
							var guid = e.currentTarget.dataset.guid,scheme_guid = e.currentTarget.dataset.id,mainid = e.currentTarget.dataset.mainid;
							if(!mainid){
								ufma.showTip('主单据号MAIN_BILL_NO为空', function () { }, 'warning');
								return ;
							}else if(!scheme_guid){
								ufma.showTip('单据方案SCHEME_GUID为空', function () { }, 'warning');
								return ;
							}else if(!guid){
								ufma.showTip('单据号BILL_GUID为空', function () { }, 'warning');
								return ;
							}
							var guids = [];
							var $cancelGenerateBtns = $self.parents('tbody').find('.cancelGenerate[data-mainid="'+mainid+'"]');
							var errorFlag = false;
							if($cancelGenerateBtns.length>1){
								$cancelGenerateBtns.each(function(i){
									var guid = $(this).attr('data-guid');
									if(!guid){
										errorFlag = true;
										return ;
									}
									guids.push(guid);
								})
							}else{
								guids = [guid]
							}
							if(errorFlag){
								ufma.showTip('相同主单据号的某条单据的单据号为空', function () { }, 'warning');
								return ;
							}
							var tabArgu = {
								target:[
									{
										mainBillNo:mainid,
										schemeGuid:scheme_guid,
										rgCode: ptData.svRgCode,
										setYear: ptData.svSetYear,
										billGuids: guids
									}
								]};
							console.log(tabArgu);
							ufma.showloading('正在加载数据，请耐心等待...');
							//调用批量取消生成接口
							ufma.ajax(interfaceURL.cancelNybGenerateBill, "post", tabArgu, function (result) {
								ufma.hideloading();
								for(var i=page.processedData.length-1;i>=0;i--){
									if(page.processedData[i].MAIN_BILL_NO == mainid){
										var itemsss = page.processedData.splice(i, 1)
										itemsss[0].STATE = -1
										page.receiveData.push(itemsss[0])
									}
								}
								$('#itemTab').find('.active').click()
								ufma.showTip(result.msg, function () { }, result.flag);
							});
						} else {
							//点击取消的回调函数
						}
					}, { type: 'warning' });
				});
				//点击行内已生成查看凭证按钮
				$(document).on('click', 'tbody tr .btnWatch', function (e) {
					stopPropagation(e);
					var oneData = {
						BILL_GUID: $(this).attr("data-guid")
					};
					ufma.showloading('正在加载数据，请耐心等待...');
					var argu = {
						rgCode: ptData.svRgCode,
						setYear: ptData.svSetYear
					};
					ufma.get(interfaceURL.viewVoucher + oneData.BILL_GUID, argu, function (result) {
						//凭证弹窗
						// var urlPath = "http://127.0.0.1:8083";
						ufma.hideloading();
						var urlPath = "";
						var turnUrl = urlPath + '/pf/gl/vou/index.html?menuid=6661003001001&action=preview&preview=0&dataFrom=vouBox'
						turnUrl = page.addRueicode(turnUrl);
						ufma.open({
							url: turnUrl,
							title: '查看凭证',
							width: 1300,
							// height:500,
							data: result.data, // page.deleVouGuidWatch(result.data),--deleVouGuidWatch此方法未对data做处理，故直接用result.data代替
							ondestory: function (data) {
							}
						});
					})
				})
				//批量生成
				$('#generateChecked').on('click', function (e) {
					var mainidList = [];//mainidList用于储存和判断是否已经有一个主单据号在参数内
					var targetWrapList = [];//构造结果
					var hasCheckFlag = false, errorFlag = false;//报错标记
					//主单据号相同的是一个大组 放入一个target对象
					$('#nameTable1 .checkboxes').each(function (i) {
						if ($(this).prop('checked')) {
							hasCheckFlag = true;
							var id = $(this).attr('data-id'), guid = $(this).attr('data-guid'), mainid = $(this).attr('data-mainid');
							if(!id){
								errorFlag = true;
								ufma.showTip('选中的第'+i+'条数据SCHEME_GUID为空', function () { }, 'warning');
								return;
							}else if(!guid){
								errorFlag = true;
								ufma.showTip('选中的第'+i+'条数据单据号BILL_GUID为空', function () { }, 'warning');
								return;
							}else if(!mainid){
								errorFlag = true;
								ufma.showTip('选中的第'+i+'条数据主单据编号MAIN_BILL_NO为空', function () { }, 'warning');
								return;
							}
							var hasMainid = false;
							//遍历mainidList 是否有主单据编号存在
							mainidList.forEach(function(item){
								if(item===mainid){
									hasMainid = true;
								}
							})
							if(hasMainid){
								//如果已经存在了一个主单据号对象
								targetWrapList.forEach(function(item){
									if(item.target[0].mainBillNO === mainid){
										item.target[0].guids.push(guid);
									}
								})
							}else{
								//如果还不存在主单据对象 构建一个新的target
								var targetWrap = {
									rgCode: ptData.svRgCode,
						            setYear: ptData.svSetYear
								};
								targetWrap.target = [];
								targetWrap.target[0] = {
									mainBillNO: mainid,
									agencyCode:nowAgencyCode,
									guids: [guid],
									schemeGuid: id
								}
								targetWrapList.push(targetWrap);
								mainidList.push(mainid);
							}
						}
					});
					if(!hasCheckFlag){
						ufma.showTip('请勾选单据', function () { }, 'warning');
						return;
					}
					if(errorFlag){
						return;
					}
					console.log(targetWrapList);
					ufma.showloading('正在生成凭证，请耐心等待...');
					//调用批量生成接口
					ufma.ajax(interfaceURL.createNybHzTargertBill, "post", targetWrapList, function (result) {
				        ufma.hideloading();
						console.log(result);
						if (result.flag === 'success') {
							ufma.showTip('生成成功', function () { }, 'success');
							//生成成功后要加一个查看凭证的操作
							for(var z=0;z<mainidList.length;z++){
								for(var i=page.receiveData.length-1;i>=0;i--){
									if(page.receiveData[i].MAIN_BILL_NO == mainidList[z]){
										var itemsss = page.receiveData.splice(i, 1)
										itemsss[0].STATE = 0
										page.processedData.push(itemsss[0])
									}
								}
							}
							$('#itemTab').find('.active').click()
							page.plBillGenerateResult(result);
						} else {
							ufma.showTip(result.msg, function () { }, 'error');
						}
					});
					//接口返回成功将数据从receiveData清除
				})
				//批量取消生成
				$('#cancelGenerate').on('click', function (e) {
					var hasCheckFlag = false;
					$('#nameTable2 .checkboxes').each(function (i) {
						if ($(this).prop('checked')) {
							hasCheckFlag = true;
							return;
						}
					});
					if(!hasCheckFlag){
						ufma.showTip('请勾选单据', function () { }, 'warning');
						return;
					}
					ufma.confirm('您确定要取消吗？', function (action) {
						if (action) {
							//点击确定的回调函
							ufma.showloading('正在加载数据，请耐心等待...');
							//获取要取消生成的行的id
							var mainidList = []
							var arr = [],errorFlag = false;
							$('#nameTable2 .checkboxes').each(function (i) {
								if ($(this).prop('checked')) {
									var guid = $(this).attr('data-guid'),
									scheme_guid =  $(this).attr('data-id'),
									mainid =  $(this).attr('data-mainid');
									var hasMainid = false
									if (!guid) {
										ufma.showTip('选中的第'+i+'条数据单据号BILL_GUID为空', function () { }, 'warning');
										errorFlag = true;
										return ;
									}
									if (!scheme_guid) {
										ufma.showTip('选中的第'+i+'条数据单据方案SCHEME_GUID为空', function () { }, 'warning');
										errorFlag = true;
										return ;
									}
									if (!mainid) {
										ufma.showTip('选中的第'+i+'条数据主单据号MAIN_BILL_NO为空', function () { }, 'warning');
										errorFlag = true;
										return ;
									}
									// arr.push(guid);
									mainidList.forEach(function(item){
										if(item===mainid){
											hasMainid = true;
											arr.forEach(function(it){
												if(it.mainBillNo===mainid){
													it.billGuids.push(guid);
												}
											})
										}
									})
									if(!hasMainid){
										arr.push({
											schemeGuid: scheme_guid,
											mainBillNo: mainid,
											rgCode: ptData.svRgCode,
											setYear: ptData.svSetYear,
											billGuids:[guid]
										});
										mainidList.push(mainid)
									}
									
								}
							});
							if(errorFlag){
								return ;
							}
							console.log(arr);
							var tabArgu = {
								target: arr
							}
							//调用批量取消生成接口
							ufma.ajax(interfaceURL.cancelNybGenerateBill, "post", tabArgu, function (result) {
								ufma.hideloading();
								for(var z=0;z<mainidList.length;z++){
									for(var i=page.processedData.length-1;i>=0;i--){
										if(page.processedData[i].MAIN_BILL_NO == mainidList[z]){
											var itemsss = page.processedData.splice(i, 1)
											itemsss[0].STATE = -1
											page.receiveData.push(itemsss[0])
										}
									}
								}
								$('#itemTab').find('.active').click()
								ufma.showTip(result.msg, function () { }, result.flag);
							});
						} else {
							//点击取消的回调函数
						}
					}, { type: 'warning' });

					//接口返回成功将数据从processedData清除
				})
				$("#itemTab li").on("click", function (e) {
					var btnId = e.currentTarget.dataset.id;
					if (btnId) {
						page.getData(btnId);
					}
				});
			},
			//此方法必须保留
			init: function () {
				ufma.parse();
				this.initPage();
				this.onEventListener();
				ufma.parseScroll();
				page.openNewPages = function (isCrossDomain, that, actionType, baseUrl, isNew, title) {
					if (isCrossDomain) {
						// 此处即为监听到跨域
						var data = {
							actionType: actionType, // closeMenu 关闭   openMenu 打开
							url: window.location.protocol + '//'+ window.location.host  + baseUrl,
							isNew: isNew, // isNew: false表示在iframe中打开，为true的话就是在新页面打开
							title: title // 菜单标题
						}
						window.parent.postMessage(data, '*')
					} else {
						//门户打开方式
						that.attr('data-href', baseUrl);
						that.attr('data-title', title);
						window.parent.openNewMenu(that);
					}
				};
				console.log('receiveMessage执行 begin');
				//接postMessage参数 
				window.addEventListener("message", receiveMessage, false);
				function receiveMessage(event) {
					if (event.data.hasOwnProperty('messageType') && event.data.messageType == 'clientWidth') {
						page.isCrossDomain = true;
					} else {
						page.isCrossDomain = false;
					}
					var flag = false;
					// $('#message').html("时间戳："+new Date().getTime()+"<br>从平台收到消息： " + JSON.stringify(event.data));
					if(event.data){
						if (event.data.data.length>0){
							if (event.data.data[0].STATE === '-1') {
								//遍历receiveData如果单据号或主单据号相同则不push
								if(page.receiveData.length>0){
									page.receiveData.forEach(function(item){
										event.data.data.forEach(function(it){
											if(item.BILL_GUID===it.BILL_GUID){
												flag = true;
												return ;
											}
										})
									});
									if(flag){
										ufma.showTip('扫描的单据中存在已在表格中的单据',function(){},'warning');
										return false;
									}
									page.receiveData = page.receiveData.concat(event.data.data);
									page.receiveData = page.deteleObject(page.receiveData);
									$("#itemTab li")[0].click();
								}else{
									page.receiveData = page.receiveData.concat(event.data.data);
									$("#itemTab li")[0].click();
								}
							} else {
								if(page.processedData.length>0){
									page.processedData.forEach(function(item){
										event.data.data.forEach(function(it){
											if(item.BILL_GUID===it.BILL_GUID){
												flag = true;
												return ;
											}
										})
									});
									if(flag){
										ufma.showTip('扫描的单据中存在已在表格中的单据',function(){},'warning');
										return false;
									}
									page.processedData = page.processedData.concat(event.data.data);
									page.processedData = page.deteleObject(page.processedData);
									$("#itemTab li")[1].click();
								}else{
									page.processedData = page.processedData.concat(event.data.data);
									$("#itemTab li")[1].click();
								}
							}
						}else{
							ufma.showTip('当前扫描单据未同步！',function(){},'warning')
							return;
						}
					}else{
						ufma.showTip('当前扫描单据未同步！',function(){},'warning')
						return;
					}
				}
				console.log('receiveMessage执行 end');
				//因为用户会点击frame页面 当焦点在frame页面时 挂载在平台index页面的监听无法监听到
				//所以本页面需要添加扫描枪监听
				(function () {
					var code = ''
					var lastTime, nextTime
					var lastCode, nextCode
					var scanTimer;
					//var temp = [];
					keyPressListener = window.document.onkeypress = function (e) {
						if (window.event) { // IE
							nextCode = e.keyCode
						} else if (e.which) { // Netscape/Firefox/Opera
							nextCode = e.which
						}
						//如果100毫秒内没有触发下次键盘事件，下面的处理函数就会生效，如果100毫秒内触发了键盘事件，就取消请求发送，判断条件是防止用户扫描完按回车键导致请求无法发送
						if (nextCode !== 13) {
							scanTimer = null;
						}
						//每次输入都尝试在100毫秒后请求单据，如果在这100毫秒内没有后续输入，表示扫描枪输入完毕，就发送请求，否则就不发送请求
						scanTimer = setTimeout(function () {
							if (code.length < 5) return //code.length < 5表示不存在连续的5个字符输入间隔小于30毫秒，这里判定为不是扫描枪输入
							console.log(code);
							//将扫描结果传给业务系统，获取单据数据
							$.ajax({
								url: "/lp/getBillData/selectBillByEwm",
								type: "GET",
								data: { "qrCode": code },
								dataType: "json",
								success: function (data) {
									if (!(data.flag && data.flag === "fail")) {
										// $('#message').html("时间戳："+new Date().getTime()+"<br>通过本页面扫描枪监听到二维码并获取到消息： " + JSON.stringify(data));
										var flag = false;
										if(data.data&&data.data.length>0){
											if (data.data[0].STATE === '-1') {
												if(page.receiveData.length>0){
													page.receiveData.forEach(function(item,index){
														data.data.forEach(function(it,ind){
															if(item.BILL_GUID===it.BILL_GUID){
																flag = true;
																return ;
															}
														})
													})
													if(flag){
														ufma.showTip('扫描的单据中存在已在表格中的单据',function(){},'warning');
														return false;
													}
													//扫描返回的结果是一个数组 可能有以下情况
													//1、扫描结果与之前扫描结果完全不同 执行数组合并
													//2、扫描结果与之前扫描结果的部分数组元素的属性值相同（或完全相同）
													//方法 数组合并后 将数组元素（对象类型）用JSON.string()字符串化
													//使用字符串进行比对，去掉重复的
													page.receiveData = page.receiveData.concat(data.data);
													page.receiveData = page.deteleObject(page.receiveData);
													$("#itemTab li")[0].click();
												}else{
													page.receiveData = page.receiveData.concat(data.data);
													$("#itemTab li")[0].click();
												}
											} else {
												if(page.processedData.length>0){
													page.processedData.forEach(function(item){
														data.data.forEach(function(it){
															if(item.BILL_GUID===it.BILL_GUID){
																flag = true;
																return ;
															}
														})
													})
													if(flag){
														ufma.showTip('扫描的单据中存在已在表格中的单据',function(){},'warning');
														return false;
													}
													page.processedData = page.processedData.concat(data.data);
													page.processedData = Page.deteleObject(page.processedData);
													$("#itemTab li")[1].click();
												}else{
													page.processedData = page.processedData.concat(data.data);
													$("#itemTab li")[1].click();
												}
											}
										}else{
											ufma.showTip('当前扫描单据未同步',function(){},'warning')
										}
									} else {
										ufma.showTip(data.msg,function(){},data.flag);
									}
								},
								error: function (e) {
									console.log("获取单据异常:" + e);
									console.log("扫描结果为：" + code);
								}
							})

							code = ''
							lastCode = ''
							lastTime = ''
							return
						}, 100)

						nextTime = new Date().getTime()
						//temp.push(nextTime - lastTime);
						if (!lastTime && !lastCode) {
							code += e.key
						}

						if (lastCode && lastTime && nextTime - lastTime > 30) { // 当扫码前有keypress事件时,防止首字缺失
							code = e.key
						} else if (lastCode && lastTime) {
							code += e.key
						}
						lastCode = nextCode
						lastTime = nextTime
					}
				})();
				// page.updateTables(page.table1, [{ MAIN_BILL_NO: '1111', SCHEME_GUID: '111', BILL_GUID: '111',FIELD29:'' },
				// { MAIN_BILL_NO: '1111', SCHEME_GUID: '122', BILL_GUID: '122' },
				// { MAIN_BILL_NO: '2222', SCHEME_GUID: '222', BILL_GUID: '222' },
				// { MAIN_BILL_NO: '3333', SCHEME_GUID: '333', BILL_GUID: '333' }]);
				// page.updateTables(page.table2, [{ MAIN_BILL_NO: '11', SCHEME_GUID: '1', BILL_GUID: '1',FIELD29:'' },
				// { MAIN_BILL_NO: '1111', SCHEME_GUID: '111', BILL_GUID: '111' },
				// { MAIN_BILL_NO: '1111', SCHEME_GUID: '122', BILL_GUID: '122' },
				// { MAIN_BILL_NO: '22', SCHEME_GUID: '2', BILL_GUID: '2' },
				// { MAIN_BILL_NO: '33', SCHEME_GUID: '3', BILL_GUID: '3' }]);
				// $("#itemTab li")[0].click();
			}
		}
	}();

	page.init();
	function stopPropagation(e) {
		if (e.stopPropagation)
			e.stopPropagation();
		else
			e.cancelBubble = true;
	}

});