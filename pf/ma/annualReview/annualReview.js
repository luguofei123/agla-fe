$(function () {
	var page = function () {
		var portList = {
			getInitEleCode: '/ma/initNewYear/getInitEleCode',//基础项列表接口
			initData: "/ma/initNewYear/initData", //新年度初始化
			getSysTemInfo: '/ma/initNewYear/getSysTemInfo'//系统级新年度初始化状态查询
		};
		return {
			initType: '1',
			system: false,
			agencyCode: '',
			agencyCodeList: [],
			tabType:'1',
			sysInitType:'1',
			agencyInitType:'1',
			getSysTemInfo: function () {
				var tabArgu = {
					setYear: page.setYear,
					rgCode: page.pfData.svRgCode
				};
				ufma.ajax(portList.getSysTemInfo, "get", tabArgu, function (result) {
					if (result.flag === 'success') {
						$('.sysDataTableStatus').html(result.data);
					} else {
						ufma.showTip(result.msg, function () { }, 'error');
					}
				});
			},
			initData: function(argu){
			},
			updateAgencyTableData: function(agencyList){
				//更新树
				atreeObj.updateAtree(null,function(agencyCodeList){
					page.agencyCodeList = agencyCodeList;
					//勾选时查询表格数据
					page.queryAgencyTableData(agencyCodeList);
				});
			},
			beforeInitData: function (system, agencyList) {
				if(system){
					//系统级参数
					var eleCodeList = [];
					//判断是否有覆盖的情况
					var coverFlag = false;
					//遍历选中的行
					$('#annualReview1 .checkboxes:checked').each(function(i){
						var enuCode = $(this).attr('data-enucode'),
						enuName = $(this).attr('data-enuname'),
						eleCode = $(this).attr('data-elecode'),
						eleName = $(this).attr('data-elename'),
						status = $(this).attr('data-status'),
						remark = $(this).attr('data-remark'),
						cover = $('#sysCoverCombox-'+eleCode).getObj().getValue();
						cover?cover:cover='N';
						if(cover==='Y'){
							coverFlag = true;
						}
						var obj = {
							agencyCode: "*",
							setYear: page.setYear,
							rgCode: page.pfData.svRgCode,
							enuCode: enuCode,
							enuName: enuName,
							eleCode: eleCode,
							eleName: eleName,
							status: status,
							remark: remark,
							lastOpTime: "",
							createUser: "",
							cover: cover
						};
						eleCodeList.push(obj)
					});
					if(eleCodeList.length===0){
						ufma.showTip('请勾选要结转基础项', function () { }, "warning");
						return ;
					}
					var tabArgu = {
						userId: page.pfData.svUserId,
						setYear: page.setYear,
						rgCode: page.pfData.svRgCode,
						agencyCode:'*',
						destYear: page.destYear,
						destRgCode: page.pfData.svRgCode,
						destAgencyCode:'*',
						operation:"3",
						agencyList:[],
						eleCodeList: eleCodeList,
						eleCodeRefList:[]
					  };
					console.log(tabArgu);
					function initYearData(){
						ufma.showloading('正在初始化，请耐心等待...');
						ufma.ajax(portList.initData, "post", tabArgu, function (result) {
							ufma.hideloading();
							// console.log(result);
							if (result.flag === 'success') {
								ufma.showTip(result.msg, function () { }, result.flag);
								page.getSysTemInfo();
								//更新表格数据
								page.querySysTableData();
							} else {
								ufma.showTip('初始化失败', function () { }, 'error');
							}
						});
					}
					//有覆盖的情况 给予提示
					if(coverFlag){
						ufma.confirm('新年度的基础资料的数据将覆盖，是否继续?', function(action) {
							if(action) {
								initYearData();
							} else {
							}
						}, {
							type: 'warning'
						});
					}else{
						initYearData();
					}
				}else{
					if (agencyList.length <= 0) {
						ufma.showTip('请选择初始化单位', function () { }, "warning");
					}
					var eleCodeList = [];
					//判断是否有覆盖的情况
					var agencyCoverFlag = false;
					//遍历选中的行
					$('#annualReview2 .checkboxes:checked').each(function(i){
						var enuCode = $(this).attr('data-enucode'),
						enuName = $(this).attr('data-enuname'),
						eleCode = $(this).attr('data-elecode'),
						eleName = $(this).attr('data-elename'),
						status = $(this).attr('data-status'),
						remark = $(this).attr('data-remark'),
						cover = $('#agencyCoverCombox-'+eleCode).getObj().getValue();
						cover?cover:cover='N';
						if(cover==='Y'){
							agencyCoverFlag = true;
						}
						var obj = {
							agencyCode: '',
							setYear: page.setYear,
							rgCode: page.pfData.svRgCode,
							enuCode: enuCode,
							enuName: enuName,
							eleCode: eleCode,
							eleName: eleName,
							status: status,
							remark: remark,
							lastOpTime: "",
							createUser: "",
							cover: cover
						};
						eleCodeList.push(obj)
					});
					if(eleCodeList.length===0){
						ufma.showTip('请勾选要结转基础项', function () { }, "warning");
						return ;
					}
					//有覆盖的情况 给予提示
					if(agencyCoverFlag){
						ufma.confirm('新年度的基础资料的数据将覆盖，是否继续?', function(action) {
							if(action) {
								confirmInner()
							} else {
								
							}
						}, {
							type: 'warning'
						});
					}else{
						confirmInner()
					}

					function confirmInner(){
						var taskList = [];
						agencyList.forEach(function(agencyCodeObj){
							var agencyCode = agencyCodeObj.code;
							eleCodeList.forEach(function(it){
								it.agencyCode = agencyCode;
							})
							var eleCodeListStr = JSON.stringify(eleCodeList);
							var tabArgu = {
								userId: page.pfData.svUserId,
								setYear: page.setYear,
								rgCode: page.pfData.svRgCode,
								agencyCode:agencyCodeObj.code,
								destYear: page.destYear,
								destRgCode: page.pfData.svRgCode,
								destAgencyCode:agencyCodeObj.code,
								operation:"3",
								agencyList:[],
								eleCodeList: JSON.parse(eleCodeListStr),
								eleCodeRefList:[]
							};
							taskList.push(tabArgu);
						})
						console.log(taskList);
						var current = 1,successCount=0,errorLog='',total = taskList.length,percent = 0,barWidth = 2;
						$('#total').html(total);
						$('#percent').html(String(percent+'%'));
						$('.progressBarActive').css({width:barWidth+'%'});
						
						$('.progressModalWrap').fadeIn();
						initTask(taskList)
						//单位级需要等一个单位的结转完毕 才可以再请求结转下一个
						function initTask(taskList){
							if(taskList&&taskList.length>0){
								$('#agencyName').html(taskList[0].agencyCode);
								$('#current').html(current);
								$.ajax({
									url: portList.initData,
									type: 'POST', //GET
									data: JSON.stringify(taskList[0]),
									timeout: 600000, //超时时间
									dataType: 'json',
									contentType: 'application/json; charset=utf-8',
									success: function(result){
										console.log(result);
										if(result.flag != 'fail') {
											++successCount;
										}else{
											errorLog+= '<br>单位：'+taskList[0].agencyCode+' 结转错误，原因：'+result.msg;
											$('#error').html('结转失败：'+errorLog);
											$('#error').fadeIn();
										}
										percent = parseInt((current/total)*100);
										if(percent<1) percent=1;
										$('#percent').html(String(percent+'%'));
										percent>2?barWidth=percent:barWidth=2;
										$('.progressBarActive').css({width:barWidth+'%'});
										++current;
										taskList.shift();
										initTask(taskList);
									},
									error: function(jqXHR, textStatus) {
										var error = '请求失败，服务器无响应';
										switch(jqXHR.status) {
											case 408:
												error = "请求超时";
												break;
											case 500:
												error = "服务器错误";
												break;
											case 502:
												error = "服务器错误";
												break;
											case 504:
												error = "请求超时";
												break;
											default:
												break;
										}
										errorLog+= '<br>单位：'+taskList[0].agencyCode+' 结转错误，原因：'+error;
										$('#error').html('结转失败：'+errorLog);
										$('#error').fadeIn();
										percent = parseInt((current/total)*100);
										if(percent<1) percent=1;
										$('#percent').html(String(percent+'%'));
										percent>2?barWidth=percent:barWidth=2;
										$('.progressBarActive').css({width:barWidth+'%'});
										++current;
										taskList.shift();
										initTask(taskList);
									}
								})
							}else{
								if(successCount===0){
									$('#error').html('全部结转失败：'+errorLog);
									$('#error').fadeIn();
								}else{
									if(successCount===total){
										$('#success').html('全部单位结转成功！');
									}else{
										$('#success').html('部分单位结转成功！');
									}
									$('#success').fadeIn();
									//另一种处理点击关闭按钮再更新表格和树
									page.updateAgencyTableData(agencyList);
								}
								$('.btnWrap').fadeIn();
							}
						}
					}
				}
				
			},
			/**
			 * 系统级表格数据
			 */
			querySysTableData: function(){
				var tabArgu = {
					userId: page.pfData.svUserId,
					setYear: page.setYear,
					rgCode: page.pfData.svRgCode,
					destYear: page.destYear,
					destRgCode: page.pfData.svRgCode,
					operation:"3",
					agencyList:['*']
				  }
				// ufma.showloading('正在加载数据，请耐心等待...');
				ufma.ajax(portList.getInitEleCode, "post", tabArgu, function (result) {
					// ufma.hideloading();
					var obj = {};
					result.data.forEach(function(item,index){
						if(obj[item.enuCode]){
							var num = obj[item.enuCode].num;
							++num;
							obj[item.enuCode].num = num;
						}else{
							obj[item.enuCode] = {};
							obj[item.enuCode].num = 1;
							obj[item.enuCode].index = index;
						}
					})
					for(var prop in obj){
						var subObj = obj[prop];
						var index = subObj.index;
						result.data[index].rowspan = subObj.num;
					}
					page.showTable1(result.data, result.msg);
				});
			}, 
			queryAgencyTableData: function (agencyCodeList) {
				if (!agencyCodeList||agencyCodeList.length===0) {
					page.showTable2([], '');
					return;
				}
				var tabArgu = {
					userId: page.pfData.svUserId,
					setYear: page.setYear,
					rgCode: page.pfData.svRgCode,
					destYear: page.destYear,
					destRgCode: page.pfData.svRgCode,
					operation: "3",
					agencyList: agencyCodeList
				  }
				ufma.showloading('正在加载数据，请耐心等待...');
				ufma.ajax(portList.getInitEleCode, "post", tabArgu, function (result) {
					ufma.hideloading();
					var obj = {};
					result.data.forEach(function(item,index){
						if(obj[item.enuCode]){
							var num = obj[item.enuCode].num;
							++num;
							obj[item.enuCode].num = num;
						}else{
							obj[item.enuCode] = {};
							obj[item.enuCode].num = 1;
							obj[item.enuCode].index = index;
						}
					})
					for(var prop in obj){
						var subObj = obj[prop];
						var index = subObj.index;
						result.data[index].rowspan = subObj.num;
					}
					page.showTable2(result.data, result.msg);
				});
			},
			initTable: function () {
				var columns1 = [
					{
						title: '<label class="mt-checkbox mt-checkbox-single mt-checkbox-outline"> <input type="checkbox" class="datatable-group-checkable1" id="sys_check_H"/>&nbsp;<span></span> </label>',
						data: null,
						className: 'tc nowrap no-print',
						width: 50,
						render: function(data, type, rowdata, meta) {
							return (
								'<label class="mt-checkbox mt-checkbox-single mt-checkbox-outline"> ' +
								'<input type="checkbox" class="checkboxes" data-enucode="' +
								data.enuCode +'" data-enuname="' +
								data.enuName +'" data-elecode="' + 
								data.eleCode +'" data-elename="' + 
								data.eleName +'" data-status="' +
								data.status +'" data-remark="' +
								data.remark+'"/>&nbsp;<span></span></label>'
							)
						}
					},
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
						title: "基础项",
						data: "eleName",
						className: 'tc nowrap',
						width: 300,
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
							var str = '<div id="sysCoverCombox-' + rowdata.eleCode + '" data-type="' + rowdata.enuCode + '" class="uf-combox"></div>';
							return str;
						}
					},
					{
						title: "结转状态",
						data: "remark",
						className: 'tc nowrap',
						render: function (data, type, rowdata, meta) {
							return data ? '<div title="'+data+'" >'+data+'</div>' : '';
						}
					}];
					var columns2 = [
						{
							title: '<label class="mt-checkbox mt-checkbox-single mt-checkbox-outline"> <input type="checkbox" class="datatable-group-checkable2" id="agency_check_H"/>&nbsp;<span></span> </label>',
							data: null,
							className: 'tc nowrap no-print',
							width: 50,
							render: function(data, type, rowdata, meta) {
								return (
									'<label class="mt-checkbox mt-checkbox-single mt-checkbox-outline"> ' +
									'<input type="checkbox" class="checkboxes" data-enucode="' +
									data.enuCode +'" data-enuname="' +
									data.enuName +'" data-elecode="' + 
									data.eleCode +'" data-elename="' + 
									data.eleName +'" data-status="' +
									data.status +'" data-remark="' +
									data.remark+'"/>&nbsp;<span></span></label>'
								)
							}
						},
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
							title: "基础项",
							data: "eleName",
							className: 'tc nowrap',
							width: 300,
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
								var str = '<div id="agencyCoverCombox-' + rowdata.eleCode + '" data-type="' + rowdata.enuCode + '" class="uf-combox"></div>';
								return str;
							}
						},
						{
							title: "结转状态",
							data: "remark",
							className: 'tc nowrap',
							render: function (data, type, rowdata, meta) {
								return data ? '<div title="'+data+'" >'+data+'</div>' : '';
							}
						}];
				page.table1 = $('#annualReview1').dataTable({
					"language": {
						"url": bootPath + "agla-trd/datatables/datatable.default.js"
					},
					"autoWidth": false,
					"bDestory": true,
					"processing": true, //显示正在加载中
					"paging": false, //分页样式
					"searching": false,
					"serverSide": false,
					"ordering": false,
					"bInfo": false,
					"columns": columns1,
					"columnDefs": [{
						targets: [1], //第2列
						createdCell: function (td, cellData, rowData, row, col) {
							var rowspan = 0;
							if(col == 1){
								rowData.rowspan?rowspan = rowData.rowspan:rowspan = 0;
							}
							if (rowspan > 1) {
								$(td).attr('rowspan', rowspan)
							}
							if (rowspan == 0) {
								$(td).remove();
							}
						}
					}],
					"data": [],
					"initComplete": function (settings, json) {
						//复制表头开始
						var renderFixedHead1 = function() {
							$("#headFixedDiv1").remove();
							var $headFixedDiv = '<div id="headFixedDiv1" style="position:absolute;top:0px;left:0;width:100%;height: 36px;overflow:hidden;z-index: 999;"></div>';
							$('.table-wrap').append($headFixedDiv)
							var cloneTable = $('#annualReview1').clone();
							cloneTable.appendTo($("#headFixedDiv1"))
							$('.table-wrap').on('scroll', function(e){
								var top = $('.table-wrap').scrollTop()
								$('#headFixedDiv1').css({'top': top + 'px'})
							})
						}
						renderFixedHead1();
						window.addEventListener('resize', renderFixedHead1);
						//复制表头结束
						$('.datatable-group-checkable1').on("change", function () {
							var isCorrect = $(this).is(':checked'),moduleList = [];
							$('#annualReview1 .checkboxes').each(function () {
								if(isCorrect){
									$(this).prop("checked", true)
								}else{
									$(this).prop("checked", false)
								}
							});
						});
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
						$('#annualReview1 .uf-combox').each(function (i) {
							$(this).ufCombox({
								idField: "code",
								textField: "codeName",
								data: data, //json 数据 
								onChange: function (sender, data) {
								},
								onComplete: function (sender) {
								}
							});
							$(this).getObj().val('N');
						})
						page.tableDisabled1();
						if($("#sysCoverAll").prop('checked')){
							$('#annualReview1 .uf-combox').each(function (i) {
								$(this).getObj().val('Y');
							})
						}else{
							$('#annualReview1 .uf-combox').each(function (i) {
								$(this).getObj().val('N');
							})
						}
					}
				})

				page.table2 = $('#annualReview2').dataTable({
					"language": {
						"url": bootPath + "agla-trd/datatables/datatable.default.js"
					},
					"autoWidth": false,
					"bDestory": true,
					"processing": true, //显示正在加载中
					"paging": false, //分页样式
					"searching": false,
					"serverSide": false,
					"ordering": false,
					"bInfo": false,
					"columns": columns2,
					"columnDefs": [{
						targets: [1], //第2列
						createdCell: function (td, cellData, rowData, row, col) {
							var rowspan = 0;
							if(col == 1){
								rowData.rowspan?rowspan = rowData.rowspan:rowspan = 0;
							}
							if (rowspan > 1) {
								$(td).attr('rowspan', rowspan)
							}
							if (rowspan == 0) {
								$(td).remove();
							}
						}
					}],
					"data": [],
					"initComplete": function (settings, json) {
						//复制表头开始
						var renderFixedHead2 = function() {
							$("#headFixedDiv2").remove();
							var $headFixedDiv = '<div id="headFixedDiv2" style="position:absolute;top:0px;left:0;width:100%;height: 36px;overflow:hidden;z-index: 999;"></div>';
							$('.right-table-wrap').append($headFixedDiv)
							var cloneTable = $('#annualReview2').clone();
							cloneTable.appendTo($("#headFixedDiv2"))
							$('.right-table-wrap').on('scroll', function(e){
								var top = $('.right-table-wrap').scrollTop()
								$('#headFixedDiv2').css({'top': top + 'px'})
							})
						}
						renderFixedHead2();
						window.addEventListener('resize', renderFixedHead2);
						//复制表头结束
						$('.datatable-group-checkable2').on("change", function () {
							var isCorrect = $(this).is(':checked'),moduleList = [];
							$('#annualReview2 .checkboxes').each(function () {
								if(isCorrect){
									$(this).prop("checked", true)
								}else{
									$(this).prop("checked", false)
								}
							});
						});
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
						$('#annualReview2 .uf-combox').each(function (i) {
							$(this).ufCombox({
								idField: "code",
								textField: "codeName",
								data: data, //json 数据 
								onChange: function (sender, data) {
								},
								onComplete: function (sender) {
								}
							});
							$(this).getObj().val('N');
						})
						page.tableDisabled2();
						if($("#agencyCoverAll").prop('checked')){
							$('#annualReview2 .uf-combox').each(function (i) {
								$(this).getObj().val('Y');
							})
						}else{
							$('#annualReview2 .uf-combox').each(function (i) {
								$(this).getObj().val('N');
							})
						}
					}
				})
			},
			showTable1: function (data, msg, cb) {
				if (data) {
					if (data.length > 0) {
						page.table1.fnClearTable();
						page.table1.fnAddData(data, true);
						if (typeof (cb) === 'function') {
							cb();
						}

					}
				}
			},
			showTable2: function (data, msg, cb) {
				if (data) {
					if (data.length > 0) {
						page.table2.fnClearTable();
						page.table2.fnAddData(data, true);
						if (typeof (cb) === 'function') {
							cb();
						}

					}
				}
			},
			tableDisabled1: function (){
				if(page.sysInitType==='1'){
					// $('#sys_check_H').prop('checked',true).prop('disabled',true);
					$('.datatable-group-checkable1').prop('checked',true).prop('disabled',true);
					$('#annualReview1 .checkboxes').each(function () {
						$(this).prop("checked", true).prop('disabled',true)
					});
					$('#annualReview1 .uf-combox').each(function (i) {
						$(this).getObj().setEnabled(false);
						$(this).find('.uf-combox-input').addClass('disabledTableColor');
					})
					$('#annualReview1 thead').find('th').addClass('disabledTableColor');
					$('#annualReview1 tbody').find('td').addClass('disabledTableColor disabledTableBg');
				}else{
					// $('#sys_check_H').prop('checked',false).prop('disabled',false);
					$('.datatable-group-checkable1').prop('checked',false).prop('disabled',false);
					$('#annualReview1 .checkboxes').each(function () {
						$(this).prop("checked", false).prop('disabled',false)
					});
					$('#annualReview1 .uf-combox').each(function (i) {
						$(this).getObj().setEnabled(true);
						$(this).find('.uf-combox-input').removeClass('disabledTableColor');
					})
					$('#annualReview1 thead').find('th').removeClass('disabledTableColor');
					$('#annualReview1 tbody').find('td').removeClass('disabledTableColor disabledTableBg');
				}
			},
			tableDisabled2: function (){
				if(page.agencyInitType==='1'){
					// $('#agency_check_H').prop('checked',true).prop('disabled',true);
					$('.datatable-group-checkable2').prop('checked',true).prop('disabled',true);
					$('#annualReview2 .checkboxes').each(function () {
						$(this).prop("checked", true).prop('disabled',true)
					});
					$('#annualReview2 .uf-combox').each(function (i) {
						$(this).getObj().setEnabled(false);
						$(this).find('.uf-combox-input').addClass('disabledTableColor');
					})
					$('#annualReview2 thead').find('th').addClass('disabledTableColor');
					$('#annualReview2 tbody').find('td').addClass('disabledTableColor disabledTableBg');
				}else{
					// $('#agency_check_H').prop('checked',false).prop('disabled',false);
					$('.datatable-group-checkable2').prop('checked',false).prop('disabled',false);
					$('#annualReview2 .checkboxes').each(function () {
						$(this).prop("checked", false).prop('disabled',false)
					});
					$('#annualReview2 .uf-combox').each(function (i) {
						$(this).getObj().setEnabled(true);
						$(this).find('.uf-combox-input').removeClass('disabledTableColor');
					})
					$('#annualReview2 thead').find('th').removeClass('disabledTableColor');
					$('#annualReview2 tbody').find('td').removeClass('disabledTableColor disabledTableBg');
				}
			},
			initPage: function () {
				page.pfData = ufma.getCommonData();
				if(page.initType==='1'){
					//从今年（2019）结转到明年（2020）
					page.setYear = page.pfData.svSetYear;
					page.destYear = String(parseInt(page.setYear) + 1);
				}else{
					//从去年（2019）结转到今年（2020）
					page.setYear = String(parseInt(page.pfData.svSetYear)-1);
					page.destYear = page.pfData.svSetYear;
				}
				$('#currentyear').val(page.setYear);
				$('#newyear').val(page.destYear);

				page.getSysTemInfo();
				page.initTable();
				atreeObj.initAtree(null,function(agencyCodeList){
					page.agencyCodeList = agencyCodeList;
					page.queryAgencyTableData(agencyCodeList);
				});
				//默认先查询系统级表格数据
				page.querySysTableData();
				page.queryAgencyTableData();
			},
			onEventListener: function () {
				$('#progressModalClose').on('click',function(){
					$('#success').fadeOut();
					$('#error').fadeOut();
					$('.btnWrap').fadeOut();
					$('.progressModalWrap').fadeOut();
				})
				$("input[name='sysRadio']").on('change',function(){
					var value = $("input[name='sysRadio']:checked").val()
					page.sysInitType = value;
					page.tableDisabled1();
				})
				$("input[name='agencyRadio']").on('change',function(){
					var value = $("input[name='agencyRadio']:checked").val()
					page.agencyInitType = value;
					page.tableDisabled2();
				})
				$("#sysCoverAll").on('change',function(e){
					if(e.currentTarget.checked){
						$('#annualReview1 .uf-combox').each(function (i) {
							$(this).getObj().val('Y');
						})
					}else{
						$('#annualReview1 .uf-combox').each(function (i) {
							$(this).getObj().val('N');
						})
					}
				})
				$("#agencyCoverAll").on('change',function(e){
					if(e.currentTarget.checked){
						$('#annualReview2 .uf-combox').each(function (i) {
							$(this).getObj().val('Y');
						})
					}else{
						$('#annualReview2 .uf-combox').each(function (i) {
							$(this).getObj().val('N');
						})
					}
				})
				$("#itemTab li").on("click", function (e) {
					var btnId = e.currentTarget.dataset.id;
					if (btnId) {
						if(btnId==='1'){
							$('.agencyInitWrap').addClass('hide');
							$('.sysInitWrap').removeClass('hide');
							page.tabType = '1';
						}else{
							$('.sysInitWrap').addClass('hide');
							$('.agencyInitWrap').removeClass('hide');
							page.tabType = '2';
						}
					}
				});
				//系统级初始化
				$('#initsys-btn').on('click', function () {
					page.system = true;
					page.beforeInitData(true, []);
				});

				//单位级初始化
				$('#init-btn').on('click', function () {
					//单位级
					page.system = false;
					//获取选中的单位
					var treeObj = $.fn.zTree.getZTreeObj("atree");
					var nodes = treeObj.getCheckedNodes(true);
					if (nodes.length === 0) {
						ufma.showTip('请选择单位', function () { }, 'warning');
						return;
					}
					if(nodes[0].id==='*'||nodes[0].code==='*'){
						nodes.splice(0,1);
					}
					if (nodes.length === 0) {
						ufma.showTip('请选择单位', function () { }, 'warning');
						return;
					}
					var agencyCodeList = [];
					nodes.forEach(function (item) {
						agencyCodeList.push({code:item.code,codeName:item.codeName,name:item.name})
					})
					page.beforeInitData(false, agencyCodeList);
				})
			},
			//此方法必须保留
			init: function () {
				$('.ufma-combox-border').css({'border': '1px  solid rgb(217, 217, 217)'});
				page.reslist = ufma.getPermission();
				ufma.isShow(page.reslist);
				ufma.parse();
				this.initPage();
				this.onEventListener();

				var timeId = setTimeout(function () {
					//左侧树高度
					var h = $(window).height() - 228;
					$(".rpt-acc-box-left").height(h);
					$('.right-table-wrap').height(h + 20)
					$('.table-wrap').height(h + 20)
					var H = $(".rpt-acc-box-right").height();
					if (H > h) {
						$(".rpt-acc-box-left").height(h + 48);
						if ($("#tool-bar .slider").length > 0) {
							$(".rpt-acc-box-left").height(h + 52);
						}
					}
					$(".rpt-atree-box-body").height($(".rpt-acc-box-left").height() - 56);
					clearTimeout(timeId);
				}, 200);
			}
		}
	}();

	page.init();
});