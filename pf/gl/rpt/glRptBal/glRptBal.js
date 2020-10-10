$(function () {
	var pageLength = ufma.dtPageLength('#glRptBalTable');
	var hideColArray = [];
	var boxModel = '1';
	var isFirst = true;
	var tableData_bak;  // 缓存数据
	var showLiArr_bak;  // 缓存数据
	var nowTabType_bak
	var page = function () {

		var glRptBalDataTable; //全局datatable对象
		var glRptBalTable; //全局table的ID
		var glRptBalThead; //全局table的头部ID
		var isCrossDomain = false;

		//余额表所用接口
		var portList = {
			prjContent: "/gl/rpt/prj/getPrjcontent", //查询方案内容接口
			getReport: "/gl/rpt/getReportData/GL_RPT_BAL" //请求表格数据
		};
		//三栏式
		var SANLANColsArr = [
			/*{
							data: "rowType"
						}, //-9行类型 	只有当rowType=1时，才允许联查*/
			{
				data: "begDrAmt",
				// width: "140",
				className: 'isprint nowrap tr tdNum'
			}, //期初借方
			{
				data: "begCrAmt",
				// width: "140",
				className: 'isprint nowrap tr tdNum'
			}, //期初贷方
			{
				data: "cDrAmt",
				// width: "140",
				className: 'isprint nowrap tr tdNum'
			}, //本期借方
			{
				data: "cCrAmt",
				// width: "140",
				className: 'isprint nowrap tr tdNum'
			}, //本期贷方
			{
				data: "totalDrAmt",
				// width: "140",
				className: 'isprint nowrap tr tdNum'
			}, //累计借方
			{
				data: "totalCrAmt",
				// width: "140",
				className: 'isprint nowrap tr tdNum'
			}, //累计贷方
			{
				data: "endDrAmt",
				// width: "140",
				className: 'isprint nowrap tr tdNum'
			}, //期末借方
			{
				data: "endCrAmt",
				// width: "140",
				className: 'isprint nowrap tr tdNum'
			} //期末贷方	
		];
		//外币式
		// $(rpt.namespace).find(".rpt-table-sub-tip-currency")
		var WAIBIColsArr = [
			{
				data: "curCode",
				// width: "140",
				className: 'isprint nowrap',
				render: function (data, type, rowdata, meta) {
					// return data == '' ? '' :'<span>'+data+' ' +$(rpt.namespace).find(".rpt-table-sub-tip-currency option:selected").html()+'</span>';
					return data === null  ? '' :'<span>'+ data +'</span>';
				}
			}, //外币-15
			{
				data: "begBalSign"
			}, //期初方向-14
			{
				data: "begCurBalAmt",
				// width: "140",
				className: 'isprint nowrap tr tdNum'
			}, //期初外币金额 -13
			{
				data: "begBalAmt",
				// width: "140",
				className: 'isprint nowrap tr tdNum'
			}, //期初金额-12
			{
				data: "cCurDrAmt",
				// width: "140",
				className: 'isprint nowrap tr tdNum'
			}, //本期借方外币-11
			{
				data: "cDrAmt",
				// width: "140",
				className: 'isprint nowrap tr tdNum'
			}, //本期借方金额-10
			{
				data: "cCurCrAmt",
				// width: "140",
				className: 'isprint nowrap tr tdNum'
			}, //本期贷方外币-9
			{
				data: "cCrAmt",
				// width: "140",
				className: 'isprint nowrap tr tdNum'
			}, //本期贷方金额-8
			{
				data: "totalCurDrAmt",
				// width: "140",
				className: 'isprint nowrap tr tdNum '
			}, //累计借方外币-7
			{
				data: "totalDrAmt",
				// width: "140",
				className: 'isprint nowrap tr tdNum'
			}, //累计借方金额-6
			{
				data: "totalCurCrAmt",
				// width: "140",
				className: 'isprint nowrap tr tdNum '
			}, //累计贷方外币-5
			{
				data: "totalCrAmt",
				// width: "140",
				className: 'isprint nowrap tr tdNum'
			}, //累计贷方金额-4
			{
				data: "endBalSign"
			}, //期末方向-3
			{
				data: "endCurBalAmt",
				// width: "140",
				className: 'isprint nowrap tr tdNum'
			}, //期末外币金额 -2
			{
				data: "endBalAmt",
				// width: "140",
				className: 'isprint nowrap tr tdNum'
			} //期末金额 -1
		];
		//数量式
		var SHULIANGColsArr = [
			{
				data: "begBalSign"
			}, //期初方向-14
			{
				data: "begQtyBalAmt",
				// width: "140",
				className: 'isprint nowrap tr '
			}, //期初数量 -13
			{
				data: "begBalAmt",
				// width: "140",
				className: 'isprint nowrap tr tdNum'
			}, //期初金额-12
			{
				data: "cQtyDrAmt",
				// width: "140",
				className: 'isprint nowrap tr '
			}, //本期借方数量-11
			{
				data: "cDrAmt",
				// width: "140",
				className: 'isprint nowrap tr tdNum'
			}, //本期借方金额-10
			{
				data: "cQtyCrAmt",
				// width: "140",
				className: 'isprint nowrap tr '
			}, //本期贷方数量-9
			{
				data: "cCrAmt",
				// width: "140",
				className: 'isprint nowrap tr tdNum'
			}, //本期贷方金额-8
			{
				data: "totalQtyDrAmt",
				// width: "140",
				className: 'isprint nowrap tr '
			}, //累计借方数量-7
			{
				data: "totalDrAmt",
				// width: "140",
				className: 'isprint nowrap tr tdNum'
			}, //累计借方金额-6
			{
				data: "totalQtyCrAmt",
				// width: "140",
				className: 'isprint nowrap tr '
			}, //累计贷方数量-5
			{
				data: "totalCrAmt",
				// width: "140",
				className: 'isprint nowrap tr tdNum'
			}, //累计贷方金额-4
			{
				data: "endBalSign"
			}, //期末方向-3
			{
				data: "endQtyBalAmt",
				// width: "140",
				className: 'isprint nowrap tr '
			}, //期末数量 -2
			{
				data: "endBalAmt",
				// width: "140",
				className: 'isprint nowrap tr tdNum'
			} //期末金额	-1
		];
		//数量外币式
		var SHULWAIBColsArr = [
			{
				data: "curCode",
				// width: "140",
				className: 'isprint nowrap',
				render: function (data, type, rowdata, meta) {
					// return data == '' ? '' :'<span>'+data+' ' +$(rpt.namespace).find(".rpt-table-sub-tip-currency option:selected").html()+'</span>';
					return data === null  ? '' :'<span>'+ data +'</span>';
				}
			}, //外币-21
			{
				data: "begBalSign"
			}, //期初方向-20
			{
				data: "begQtyBalAmt",
				// width: "140",
				className: 'isprint nowrap tr'
			}, //期初数量-19
			{
				data: "begCurBalAmt",
				// width: "140",
				className: 'isprint nowrap tr tdNum'
			}, //期初外币金额 -18
			{
				data: "begBalAmt",
				// width: "140",
				className: 'isprint nowrap tr tdNum'
			}, //期初金额-17
			{
				data: "cQtyDrAmt",
				// width: "140",
				className: 'isprint nowrap tr '
			}, //本期借方数量-16
			{
				data: "cCurDrAmt",
				// width: "140",
				className: 'isprint nowrap tr tdNum'
			}, //本期借方外币-15
			{
				data: "cDrAmt",
				// width: "140",
				className: 'isprint nowrap tr tdNum'
			}, //本期借方金额-14
			{
				data: "cQtyCrAmt",
				// width: "140",
				className: 'isprint nowrap tr '
			}, //本期贷方数量-13
			{
				data: "cCurCrAmt",
				// width: "140",
				className: 'isprint nowrap tr tdNum'
			}, //本期贷方外币-12
			{
				data: "cCrAmt",
				// width: "140",
				className: 'isprint nowrap tr tdNum'
			}, //本期贷方金额-11

			{
				data: "totalQtyDrAmt",
				// width: "140",
				className: 'isprint nowrap tr '
			}, //累计借方数量-10
			{
				data: "totalCurDrAmt",
				// width: "140",
				className: 'isprint nowrap tr tdNum'
			}, //累计借方外币-9
			{
				data: "totalDrAmt",
				// width: "140",
				className: 'isprint nowrap tr tdNum'
			}, //累计借方金额-8
			{
				data: "totalQtyCrAmt",
				// width: "140",
				className: 'isprint nowrap tr '
			}, //累计贷方数量-7
			{
				data: "totalCurCrAmt",
				// width: "140",
				className: 'isprint nowrap tr tdNum'
			}, //累计贷方外币-6
			{
				data: "totalCrAmt",
				// width: "140",
				className: 'isprint nowrap tr tdNum'
			}, //累计贷方金额-5
			{
				data: "endBalSign"
			}, //期末方向-4
			{
				data: "endQtyBalAmt",
				// width: "140",
				className: 'isprint nowrap tr'
			}, //期末数量-3
			{
				data: "endCurBalAmt",
				// width: "140",
				className: 'isprint nowrap tr tdNum'
			}, //期末外币金额 -2
			{
				data: "endBalAmt",
				// width: "140",
				className: 'isprint nowrap tr tdNum'
			}, //期末金额-1
		];
		var newDataArr = [];
		var SANLANhtml1;
		var SANLANhtml2;

		var WAIBIhtml1;
		var WAIBIhtml2;

		var SHULIANGhtml1;
		var SHULIANGhtml2;

		var SHULWAIBhtml1;
		var SHULWAIBhtml2;
		return {

			fromRmisShow: function(){
				//返回参数
				ufma.post('/gl/api/getLinkBalFromRedis',{},function(result){
					// var data = {
					// 	IS_INCLUDE_UNPOST: "Y",
					// 	startFisperd: 1,
					// 	agencyCode: "101001",
					// 	accoCode: "1212",
					// 	endFisperd: 12,
					// 	acctCode: "001",
					// 	setYear: 2019,
					// 	IS_INCLUDE_JZ: "N"
					// }
					// console.log(data);
					console.log(result.data);
					// var tabArgu = data;
					var tabArgu = result.data;
					//将参数放到页面上，然后点击查询
					//单位
					rpt.cbAgency.val(tabArgu.agencyCode);
					setTimeout(function() {
						//账套
						$("#cbAcct").ufmaCombox2().val(tabArgu.acctCode);
						setTimeout(function() {
							var filterObj = {};
							//会计科目
							tabArgu.accoCode.forEach(function(item,index){
								filterObj[item.val] = item.code;
							})
							var accoList = [],accoObjList = [];
							//通过对象键名的唯一性过滤掉重复的会计科目
							for(var prop in filterObj){
								var obj = {
									code: prop
								}
								accoList.push(prop);
								accoObjList.push(obj);
							}
							$('#queryAcco .search-btn').closest(".rpt-p-search-key").find("input[id$='data-key']").val(accoList.join(','));
							$.data($('input[id="ACCO-data-key"]')[0],'data',accoObjList);
							$('input[id="ACCO-data-key"]').val(accoList.join(","));
							$('input[id="ACCO-data-key"]').attr('code', accoList.join(","));
							//辅助项数据处理
							var accFilterObj = {};
							tabArgu.accItem.forEach(function(item,index){
								if(item.subField != "ATTRIBUTE") {
									if(accFilterObj[item.code] instanceof Array){
										var flag = false;
										accFilterObj[item.code].forEach(function(it){
											if(it==item.val){
												flag = true;
											}
										})
										if(!flag){
											accFilterObj[item.code].push(item.val);
										}
									}else{
										accFilterObj[item.code] = [item.val];
									}
								}
							})
							// console.log(accFilterObj);
							var accObjList = [];
							for(var p in accFilterObj){
								accObjList.push({itemType:p,items:[{code: accFilterObj[p], name:''}]});
							}
							// console.log(accObjList);
							//遍历处理好的辅助项数据
							accObjList.forEach(function(item,index){
								$("#accList" + (index+1)).getObj().val(item.itemType);
								var _input = $('input[id="' + item.itemType + '-data-key"]');
								_input.val(item.items[0].code.join(','));
								var codesArr = [];
								item.items[0].code.forEach(function(it){
									codesArr.push({code:it})
								})
								$.data(_input, 'data', codesArr);
							})
							// 重新获取辅助项
							rpt.reqAccList(false, accObjList);
							//日期按钮id
							var timeBtn = 'dateBn';
							$("#dateStart").getObj().setValue(new Date(tabArgu.setYear, --tabArgu.startFisperd, 1));
							$("#dateEnd").getObj().setValue(new Date(tabArgu.setYear, --tabArgu.endFisperd, 31));
							//如果年是当前年度 月份是当月是本期
							if(tabArgu.startFisperd===tabArgu.endFisperd){
								timeBtn = 'dateBq';
							}
							//日期按钮 选择样式
                            $("a[name='period']").each(function () {
								if($(this).attr("id") == timeBtn) {
									$(this).addClass("selected").siblings("a").removeClass("selected");
								}
							});
							//其他
							if(tabArgu.IS_INCLUDE_UNPOST==='Y'){
								$('#IS_INCLUDE_UNPOST').prop('checked',true);
							}else{
								$('#IS_INCLUDE_UNPOST').prop('checked',false);
							}
							if(tabArgu.IS_INCLUDE_JZ==='Y'){
								$('#IS_INCLUDE_JZ').prop('checked',true);
							}else{
								$('#IS_INCLUDE_JZ').prop('checked',false);
							}
							$('.btn-query').trigger('click');
						}, 500);
					}, 500);
				});
			},

			//根据辅助项目形成对应的余额表表格
			changTable: function (liArr, tableData, type) {
				rpt.isSetAcc = true;
				var tr1 = "";
				var tr2 = "";

				newDataArr = [];
				if ($('#showColSet td[data-code="ACCO"] input:checked').length == 0) {
					tr1 = '<th rowspan=2></th>';
					newDataArr.push({
						title: '会计体系',
						data: 'accaCode',
						// width: 80,
						className: 'tc',
						render: function (data, type, rowdata, meta) {
							return data == '1' ? '财' : '预';
						}
					});
				}

				for (var i = 0; i < liArr.length; i++) {
					var dataObj = {};
					dataObj.data = $.css2Dom(liArr[i].itemType.toLowerCase()) + "Code";
					dataObj.className = "isprint nowrap";
					// dataObj.width = "150";
					newDataArr.push(dataObj);
					dataObj = {};
					dataObj.data = $.css2Dom(liArr[i].itemType.toLowerCase()) + "Name";
					dataObj.className = "isprint nowrap";
					dataObj.render = function (data, type, rowdata, meta) {
						var ti = 0;
						if (meta.settings.aoColumns[meta.col].data === 'accoName') {
							ti = rowdata.accoLevelNum - 1;
							ti = ti < 0 ? 0 : ti;
						}
						return '<span class="turn-vou" title="' + data + '" style="float:left;text-indent:' + ti + 'em;">' + data + '</span>';
					}
					newDataArr.push(dataObj);

					var tempTr1 = ufma.htmFormat('<th colspan="2"><%=name%></th>', {
						name: liArr[i].itemTypeName
					});
					tr1 += tempTr1;
					var tempTr2 = ufma.htmFormat('<th><%=name%>编码</th><th><%=name%>名称</th>', {
						name: liArr[i].itemTypeName
					});
					tr2 += tempTr2;
				}

				var thLen = page.glRptBalThead.find("tr").eq(1).find("th").length;
				var allThStr = "";
				for (var i = thLen - 1; i >= thLen - 8; i--) {
					var thDom = page.glRptBalThead.find("tr").eq(1).find("th").eq(i);
					var pTitle = thDom.attr("parent-title");
					var thStr = '<th  parent-title="' + pTitle + '">' + thDom.html() + '</th>';
					allThStr = thStr + allThStr;
				}

				//var fixedHtml1 = '<th colspan="2">期初余额</th><th colspan="2">本期发生额</th><th colspan="2">累计发生额</th><th colspan="2">期末余额</th>';

				if (type == "SANLAN") {
					var theadHtml = '<tr>' + tr1 + page.SANLANhtml1 + '</tr><tr>' + tr2 + page.SANLANhtml2 + '</tr>';
					var thisDataArr = newDataArr.concat(SANLANColsArr);
				} else if (type == "WAIBI") {
					var theadHtml = '<tr>' + tr1 + page.WAIBIhtml1 + '</tr><tr>' + tr2 + page.WAIBIhtml2 + '</tr>';
					var thisDataArr = newDataArr.concat(WAIBIColsArr);
				} else if (type == "SHULIANG") {
					var theadHtml = '<tr>' + tr1 + page.SHULIANGhtml1 + '</tr><tr>' + tr2 + page.SHULIANGhtml2 + '</tr>';
					var thisDataArr = newDataArr.concat(SHULIANGColsArr);
				} else if (type == "SHULWAIB") {
					var theadHtml = '<tr>' + tr1 + page.SHULWAIBhtml1 + '</tr><tr>' + tr2 + page.SHULWAIBhtml2 + '</tr>';
					var thisDataArr = newDataArr.concat(SHULWAIBColsArr);
				}

				for (var i = 0; i < thisDataArr.length; i++) {
					var reg = new RegExp(/Amt/);
					var dataArr = thisDataArr[i].data;
					if (!reg.exec(dataArr)) {
						thisDataArr[i].render = function (data, type, rowdata, meta) {
							var dataArr = rowdata;
							var ti = 0;
							var colName = meta.settings.aoColumns[meta.col].data;
							// liuyyn fixbug#81257 带辅助项查询时，科目应按上下级次显示
							if (colName === 'accoName') {
								if (rowdata.accoLevelNum) {
									ti = rowdata.accoLevelNum - 1;
									ti = ti < 0 ? 0 : ti;
								} else {
									ti = rowdata.accoCode ? (rowdata.accoCode.length - 4) / 2 : 0;
									ti = ti < 0 ? 0 : ti;
								}
							}
							var hiddenColumn = rowdata.hiddenColumns;
							if (hiddenColumn.length > 0) {
								if (hiddenColumn.indexOf(colName) > -1) {
									data = '';
								}
							}
							//修改行高变化时，span里面上下的间距不一致 guohx 20200722
							return '<span class="turn-vou" title="' + data + '" style="float:left;text-indent:' + ti + 'em;">' + data + '</span>';
						}
					}
				}

				//		    	console.info(JSON.stringify(thisDataArr));
				pageLength = ufma.dtPageLength('#glRptBalTable');
				if($('#glRptBalTable_wrapper').length>0){
					$('#glRptBalTable_wrapper').ufScrollBar('destroy');
					page.glRptBalDataTable.fnDestroy();
				}
				page.glRptBalThead.html(theadHtml);
				$('#glRptBalTable tbody').html('');
				page.newTable(thisDataArr, tableData, type);
			},

			//表格初始化
			newTable: function (columnsArr, tableData, type) {
				for (var i = 0; i < tableData.length; i++) {
					tableData[i].accaCode = (tableData[i].accaCode === '1' ? '财' : '预')
				}
				var id = "glRptBalTable"; //表格id
				var toolBar = $('#' + id).attr('tool-bar');
				var columnDefsArr = [];
				if (type == "SANLAN") {
					columnDefsArr = [
						{
							"targets": [-8, -7, -6, -5, -4, -3, -2, -1],
							"className": "tdNum isprint",
							"render": $.fn.dataTable.render.number(',', '.', 2, '')
						},
						{
							"targets": hideColArray,
							"visible": false
						},
						{
							targets: [0, 1],
							className: "gotoJournal",
							render: function (data, type, rowdata, meta) {
								if (rowdata.rowType == '3' || rowdata.rowType == '9') return data;
								return '<span>' + ($.isNull(data) ? '' : data) + '</span>'
							}
						}
					]
				} else if (type == "WAIBI") {
					columnDefsArr = [
						{
							"targets": [-13, -12, -11, -10, -9, -8, -7, -6, -5, -4, -2, -1],
							"className": "tdNum isprint",
							"render": $.fn.dataTable.render.number(',', '.', 2, '')
						},
						{
							targets: [0, 1],
							className: "gotoJournal",
							render: function (data, type, rowdata, meta) {
								if (rowdata.rowType == '3' || rowdata.rowType == '9') return data;
								return '<span>' + ($.isNull(data) ? '' : data) + '</span>'
							}
						}
					]
				} else if (type == "SHULIANG") {
					columnDefsArr = [
						{
							"targets": [-12, -10, -8, -6, -4, -1],
							"className": "tdNum isprint",
							"render": $.fn.dataTable.render.number(',', '.', 2, '')
						},
						{
							targets: [0, 1],
							className: "gotoJournal",
							render: function (data, type, rowdata, meta) {
								if (rowdata.rowType == '3' || rowdata.rowType == '9') return data;
								return '<span>' + ($.isNull(data) ? '' : data) + '</span>'
							}
						}
					]
				} else if (type == "SHULWAIB") {
					columnDefsArr = [
						{
							"targets": [-18, -17, -15, -14, -12, -11, -9, -8, -6, -5, -2, -1],
							"className": "tdNum isprint",
							"render": $.fn.dataTable.render.number(',', '.', 2, '')
						},
						{
							targets: [0, 1],
							className: "gotoJournal",
							render: function (data, type, rowdata, meta) {
								if (rowdata.rowType == '3' || rowdata.rowType == '9') return data;
								return '<span>' + ($.isNull(data) ? '' : data) + '</span>'
							}
						}
					]
				}
				page.glRptBalDataTable = page.glRptBalTable.dataTable({
					"language": {
						"url": bootPath + "agla-trd/datatables/datatable.default.js"
					},
					"data": tableData,
					"processing": true, //显示正在加载中
					"pagingType": "full_numbers", //分页样式
					"lengthChange": true, //是否允许用户自定义显示数量p
					"bAutoWidth": false, //表格自定义宽度
					"bProcessing": true,
					"bDestroy": true,
					"lengthMenu": [
						[20, 50, 100, 200, 100000],
						[20, 50, 100, 200, "全部"]
					],
					"pageLength": pageLength,
					"ordering": false,
					"columns": columnsArr,
					"columnDefs": columnDefsArr,
					"dom": '<"printButtons"B>rt<"' + id + '-paginate"ilp>',
					//"dom": '<"printButtons"B>r<"tableBox"t><"tableBottom"<"tool-bar-body"<"ufma-tool-btns"><"info"<"' + id + '-paginate"ilp>>>><"tableBottomFix"<"barBox"<"bar">><"tool-bar-body"<"ufma-tool-btns"><"info"<"' + id + '-paginate"ilp>>>>',
					buttons: [{
						extend: 'print',
						text: '<i class="glyphicon icon-print" aria-hidden="true"></i>',
						exportOptions: {
							columns: '.isprint',
							format: {
								header: function (data, columnIdx) {
									var thisHead = $.inArrayJson(page.headerArr, 'index', columnIdx);
									if ($(data).length == 0) {
										return thisHead.pTitle + data;
									} else {
										return thisHead.pTitle + $(data)[0].innerHTML;
									}
								}
							}
						},
						customize: function (win) {
							$(win.document.body).find('h1').css("text-align", "center");
							$(win.document.body).css("height", "auto");
						}
					},
					{
						extend: 'excelHtml5',
						text: '<i class="glyphicon icon-upload" aria-hidden="true"></i>',
						exportOptions: {
							columns: '.isprint',
							format: {
								header: function (data, columnIdx) {
									var thisHead = $.inArrayJson(page.headerArr, 'index', columnIdx);
									if ($(data).length == 0) {
										return thisHead.pTitle + data;
									} else {
										return thisHead.pTitle + $(data)[0].innerHTML;
									}
								}
							}
						},
						customize: function (xlsx) {
							var sheet = xlsx.xl.worksheets['sheet1.xml'];
						}
					}
					],
					"initComplete": function () {
						// var lengths = 0
						// var widthall = $("#glRptBalTable").find('#glRptBalThead').find('tr').eq(1)
						// for(var i=0;i<widthall.find('th').length;i++){
						// 	if(widthall.find('th').eq(i).hasClass('tdNum')){
						// 		lengths+=140
						// 	}else{
						// 		var w = widthall.find('th').eq(i).width() ? widthall.find('th').eq(i).width() : 85;
						// 		lengths+=w
						// 		widthall.find('th').eq(i).css('width',widthall.find('th').eq(i).width()+"px")
						// 	}
						// }
						// $("#glRptBalTable").css("width",lengths+"px")
						// $("#printTableData").html("");
						// $("#printTableData").append($(".printButtons"));

						$("#printTableData .buttons-print").addClass("btn-print btn-permission").attr({
							"data-toggle": "tooltip",
							"title": "打印"
						});
						$('.dt-buttons').remove()
						$(".btn-print").off().on('click', function () {
							page.editor = ufma.showModal('tableprint', 450, 350);
							$('#rptStyle').html('')
							var searchFormats = {};
							searchFormats.agencyCode = rpt.nowAgencyCode;
							searchFormats.acctCode = rpt.nowAcctCode;
							searchFormats.componentId = 'GL_RPT_LEDGER';
							var postSetData = {
								agencyCode: rpt.nowAgencyCode,
								acctCode: rpt.nowAcctCode,
								componentId: $('#rptType option:selected').val(),
								rgCode: pfData.svRgCode,
								setYear: pfData.svSetYear,
								sys: '100',
								directory: '余额表'
							};
							$.ajax({
								type: "POST",
								url: "/pqr/api/templ",
								dataType: "json",
								data: postSetData,
								success: function (data) {
									var data = data.data;
									$('#rptTemplate').html('')
									for (var i = 0; i < data.length; i++) {
										var jData = data[i].reportCode
										$op = $('<option templId = ' + data[i].templId + ' valueid="' + data[i].reportCode + '" value="' + jData + '">' + data[i].reportName + '</option>');
										$('#rptTemplate').append($op);
									}
								},
								error: function () { }
							});
						});
						$("#btn-printyun").off().on("click", function () {
							var postSetData = {
								reportCode:'GL_RPT_BAL1',
								templId:'*'
							}
							$.ajax({
								type: "POST",
								url: "/pqr/api/iprint/templbycode",
								dataType: "json",
								data: postSetData,
								success: function(data) {
									var printcode= data.data.printCode
									var medata = JSON.parse(data.data.tempContent) 
									var tabArgu = rpt.backTabArgu();
									tabArgu.accaCode = rpt.nowAccaCode;
									tabArgu.prjContent.pageLength =data.data.rowNum
									var runNum = data.data.rowNum
									ufma.ajaxDef('/gl/rpt/getReportPrintCloudData/GL_RPT_BAL', "post", tabArgu, function (result) {
										var outTableData = {}
										outTableData.agency=rpt.nowAgencyCode+' '+rpt.nowAgencyName
										outTableData.times = $("#dateStart").getObj().getValue()+'至'+$("#dateEnd").getObj().getValue()
										outTableData.acco = $('input[id="ACCO-data-key"]').val()
										outTableData.printor = rpt.nowUserName
										outTableData.startPage = 1
										outTableData.showWatermark = true
										outTableData.date = rpt.today
										outTableData.title = '余额表'
										var pagelen = result.data.tableData.length
										outTableData.totalPage= Math.ceil(pagelen/runNum)
										result.data.outTableData = outTableData
										result.data.tableHead = {"drColumns":page.getcloumsData()}
										var names = medata.template
										// var  tempdata = YYPrint.register({ names });
										// result.data.tableHead.columns =result.data.tableHead.crcolumns
										var html = YYPrint.engine(medata.template,medata.meta, result.data);
										YYPrint.print(html)
									})
								},
								error: function() {}
							});
						})
						$("#printTableData .btn-export").addClass("btn-export btn-permission").attr({
							"data-toggle": "tooltip",
							"title": "导出"
						});
						//使用该方法导出的数据前后没有空格,但需要导出全部必须将翻页选择到"全部" guohx  20190709
						//导出begin
						$(".btn-export").off().on('click', function (evt) {
							console.log(1);
							evt = evt || window.event;
							evt.preventDefault();
							uf.expTable({
								title: '余额表',
								topInfo:[
									['单位：'+rpt.nowAgencyCode+' '+rpt.nowAgencyName + '（账套：'+rpt.nowAcctCode+' '+rpt.nowAcctName + '）'],
									['期间：'+$("#dateStart").getObj().getValue()+'至'+$("#dateEnd").getObj().getValue() + " （单位：元）"],
									['方案名称：'+$("#nowPrjName").html()]
								],
								exportTable: '#' + id
							});
						});
						// $(".btn-export").off().on('click', function (evt) {
						// 	evt = evt || window.event;
						// 	evt.preventDefault();
						// 	ufma.expXLSForDatatable($('#' + id), '余额表', "", "Multiple");
						// });
						//导出end							
						$('#printTableData.btn-group').css("position", "inherit");
						$('#printTableData div.dt-buttons').css("position", "inherit");
						$('#printTableData [data-toggle="tooltip"]').tooltip();

						ufma.isShow(page.reslist);
						page.setVisibleCol();
						//驻底begin
						var toolBar = $(this).attr('tool-bar')
						var $info = $(toolBar + ' .info');
						if ($info.length == 0) {
							$info = $('<div class="info"></div>').appendTo($(toolBar + ' .tool-bar-body'));
						}
						$info.html('');
						$('.' + id + '-paginate').appendTo($info);

						$('#' + id).closest('.dataTables_wrapper').ufScrollBar({
							hScrollbar: true,
							mousewheel: false
						});
						ufma.setBarPos($(window));
						//驻底end
						page.headerArr = rpt.tableHeader(id);
						// $('#glRptBalTable').tblcolResizable();
						// liuyyn fixbug#3948【柳州公安】查询余额表的时候，客户希望将累计发生数这一项作为可选项设置，根据用户的需要自己设置要不要显示。
						ufma.ajaxDef('/pub/user/menu/config/select?agencyCode='+rpt.nowAgencyCode+'&acctCode='+rpt.nowAcctCode+'&menuId=55954f15-bf69-49c0-8b24-8cc4069824fb', "get", '', function(data) {
							if (data.data && (data.data.boxModel === "1" || data.data.boxModel === "0")) boxModel = data.data.boxModel
							if (boxModel === '1') { // 显示累计发生额
									$("#colList").find("input[data-code=totalDrAmt]").attr("checked", true).prop("checked",true)
							} else { // 不显示累计发生额
								$("#colList").find("input[data-code=totalDrAmt]").attr("checked", false).prop("checked",false)
								$("#colList label").each(function (i) {
									page.changeCol[i].visible = $(this).find("input").prop("checked");
									var nn = $(this).find("input").data("index");
									page.glRptBalDataTable.fnSetColumnVis(nn, false);
									$(page.glRptBalDataTable.fnSettings().aoColumns[nn].nTh).removeClass("isprint");
									page.glRptBalDataTable.fnSetColumnVis(nn + 1, false);
									$(page.glRptBalDataTable.fnSettings().aoColumns[nn + 1].nTh).removeClass("isprint");
								});
							}
						});
						// page.glRptBalDataTable.aoColumns.fnDraw();						//固定表头
								
						$("#glRptBalTable").colResizable({
							last:1,
							liveDrag:true, 
							// gripInnerHtml:"<div class='grip'></div>", 
							draggingClass:"dragging", 
							resizeMode:'overflow', 
							postbackSafe:true,
							partialRefresh:true,
							onResize: function (e) {
								var isshows = true
								if ($(".headFixedDiv").hasClass('hidden')) {
									isshows = false
								}
								if ($(".headFixedDiv").length > 0) {
									$(".headFixedInnerDiv").html("");
									var t = $("#glRptBalTable")
									var textAlign = t.find("thead").find("th").eq(1).css("text-align")
									var cloneTable = t.clone();
									cloneTable.appendTo($(".headFixedInnerDiv"))
									$(".headFixedInnerDiv").find("table").addClass("fixedTable")
									var id = $(".headFixedInnerDiv").find("table").attr("id");
									$(".headFixedInnerDiv").find("table").attr("id", id + "fixed")
									// $(".fixedTable").append($(cloneTable).html())
									$(".fixedTable").find("tbody").css("visibility", "hidden")
									$(".headFixedInnerDiv").find("th").find("input[type=checkbox]").closest("label").addClass("hidden")
									$(".headFixedDiv th").css("text-align", textAlign)
								}
								$('#glRptBalTable_wrapper').ufScrollBar('uploadw');
								$(document).trigger('scroll')
							}
							
						}); 
						$("#glRptBalTable").fixedTableHead($("#glRptBalDiv"));
						//金额区间-范围筛选
						rpt.twoSearch(page.glRptBalTable);
						// 点击表格行高亮
						rpt.tableTrHighlight();
					},
					fnCreatedRow: function (nRow, aData, iDataIndex) {
						// UI相关-颜色：合计行的背景色置为灰色
						if (!$.isNull(aData)) {
							if (aData.rowType == "31" || aData.rowType == "32" || aData.rowType == "9") {
								// liuyyn fixbug#81705 余额表，大类小计以及合计目前点击不跳转，但鼠标焦点会变为小手，应去掉，同时为了区分行建议置灰小计和合计
								$(nRow).find('td span').hover(function(){
									$(this).removeClass("turn-vou")
								}, function(){
									$(this).addClass("turn-vou")
								})
								$(nRow).css({
									"background-color": "#f0f0f0"
								})
							}
						}
					},
					"drawCallback": function (settings) {
						ufma.dtPageLength($(this));
						ufma.isShow(page.reslist);
						page.glRptBalTable.find("td.dataTables_empty").text("")
							.append('<img src="' + bootPath + 'images/noData.png"/><br/><i>目前还没有你要查询的数据</i>');

						//$(".tableBox").css({"overflow-x":"auto","width":"100%"});
						// var twidth = 20*columnsArr.length;
						// $("#"+id).css("width",twidth+"%");

						if ($(".rpt-table-sub-tip2 i").text() == "万元" && !$(".tdNum").hasClass("wanyuan")) {
							$("td.tdNum").each(function () {
								if ($(this).text() != "") {
									var num = $(this).text().replace(/\,/g, "");
									$(this).text(rpt.comdify(parseFloat(num / 10000).toFixed(6)));
								}
								$(this).addClass("wanyuan");
							})
						}
						page.headArr = rpt.tableHeader(id);
						//搜索隐藏显示--表格模糊搜索
						// rpt.searchHideShow(page.glRptBalTable);
						ufma.searchHideShow(page.glRptBalTable);

						//金额区间-范围筛选
						// rpt.twoSearch(page.glRptBalTable);

						//显示/隐藏筛选框
						rpt.isShowFunnelBox();

						//联查明细账
						page.glRptBalTable.find("tbody td:not(.dataTables_empty,.tdNum)").on("click", function () {
							var rowData = page.glRptBalDataTable.fnGetData($(this).parents("tr"));
							if (rowData.rowType === 1 || rowData.rowType === 10 || rowData.rowType === 11) {
								page.openJournalShow(rowData);
							} else {
								console.info(rowData.rowType);
							}
						})
						ufma.setBarPos($(window));
						// 列宽可拖拽
						// setTimeout(function(){
						// 	$('#glRptBalTable').tblcolResizable();
						// },300)

						//固定表头
						$("#glRptBalTable").fixedTableHeadDraw($("#glRptBalDiv"));
					}
				});
				return page.glRptBalDataTable;
			},

			getcloumsData:function(){
				var datas= []
				for (var i = 0; i < $("#showColSet table tbody tr").length; i++) {
					if($("#showColSet table tbody tr").eq(i).find('input').eq(0).is(':checked')){
						var codes = tf($("#showColSet table tbody tr").eq(i).find('td').eq(0).attr('data-code').toLowerCase())
						var name = $("#showColSet table tbody tr").eq(i).find('td').eq(0).attr('data-name')
						datas.push({
							"title":name,
							"children":[
								{
									"title":name+"编码",
									"key":codes+"Code"
								},
								{
									"title":name+"名称",
									"key":codes+"Name"
								}
							]
						})
					}
				}
				datas.push({
					"title":"期初余额",
					"children":[
						{
							"title":"借方",
							"key":"begDrAmt"
						},
						{
							"title":"贷方",
							"key":"begCrAmt"
						}
					]
				})
				datas.push({
					"title":"本期发生额",
					"children":[
						{
							"title":"借方",
							"key":"cDrAmt"
						},
						{
							"title":"贷方",
							"key":"cCrAmt"
						}
					]
				})
				if($("#colList label input[data-code=totalDrAmt]").is(":checked")){
					datas.push({
						"title":"累计发生额",
						"children":[
							{
								"title":"借方",
								"key":"totalDrAmt"
							},
							{
								"title":"贷方",
								"key":"totalCrAmt"
							}
						]
					})
				}
				datas.push({
					"title":"期末余额",
					"children":[
						{
							"title":"借方",
							"key":"endDrAmt"
						},
						{
							"title":"贷方",
							"key":"endCrAmt"
						}
					]
				})
				return datas
			},
			//余额表联查明细账
			openJournalShow: function (dt) {
				var rowData = $.extend(true, {}, dt);
				if (rowData.accoCode) {
					if(rowData.accoName.lastIndexOf('/')!=-1){
						rowData.accoName = rowData.accoName.substr(rowData.accoName.lastIndexOf('/')+1);
					}
				}
				sessionStorage.removeItem(rpt.journalFormBal);

				var startYear = (new Date($("#dateStart").getObj().getValue())).getFullYear(); //起始年度(只有年，如2017)
				var startFisperd = (new Date($("#dateStart").getObj().getValue())).getMonth() + 1; //起始期间(只有月份，如7)
				var endYear = (new Date($("#dateEnd").getObj().getValue())).getFullYear(); //截止年度(只有年，如2017)
				var endFisperd = (new Date($("#dateEnd").getObj().getValue())).getMonth() + 1; //截止期间(只有月份，如7)

				var tdd = new Date(endYear, endFisperd, 0);
				var ddDay = tdd.getDate();

				var startDate = $("#dateStart").getObj().getValue() + "-01"; //开始日期
				// var startDate = startYear + "-01-01"; //开始日期
				var endDate = $("#dateEnd").getObj().getValue() + "-" + ddDay; //结束日期

				var accaCode = $(rpt.namespace + " #accaList").find(".btn-primary").data("code"); //会计体系
				//不显示科目时，跳转明细账要区分会计体系
				if((typeof(accaCode) == 'undefined' || accaCode == null) && typeof(dt.accoCode) == 'undefined'){
					var acca = dt.accaCode == null? "":dt.accaCode;
					if(acca == '财'){
						accaCode = '1';
					}else if(acca == '预'){
						accaCode = '2';
					}
				}

				var ACCOitems = rpt.qryItemsArr(); //选中会计科目代码数组

				//var rptOption = rpt.rptOptionArr();//其他查询项
				var IS_INCLUDE_UNPOST = $("#IS_INCLUDE_UNPOST").prop("checked");
				var IS_INCLUDE_JZ = $("#IS_INCLUDE_JZ").prop("checked");

				var IS_UNSHOW_OCCZERO = $("#IS_UNSHOW_OCCZERO").prop("checked");
				var IS_UNSHOW_OCCENDBALZERO = $("#IS_UNSHOW_OCCENDBALZERO").prop("checked");
				var IS_UNSHOW_OCCBALZERO = $("#IS_UNSHOW_OCCBALZERO").prop("checked");

				if (IS_INCLUDE_UNPOST) {
					IS_INCLUDE_UNPOST = "Y"
				} else {
					IS_INCLUDE_UNPOST = "N"
				}

				if (IS_INCLUDE_JZ) {
					IS_INCLUDE_JZ = "Y"
				} else {
					IS_INCLUDE_JZ = "N"
				}

				var IS_JUSTSHOW_OCCFISPERD = "";
				if (IS_UNSHOW_OCCZERO || IS_UNSHOW_OCCENDBALZERO || IS_UNSHOW_OCCBALZERO) {
					IS_JUSTSHOW_OCCFISPERD = "Y"
				} else {
					IS_JUSTSHOW_OCCFISPERD = "N"
				}
				// 格式和币种
				var formatType = $("#geshi").find("option:selected").attr('value');
				var formatTypeVal = $("#geshi").find("option:selected").text();
				var currencyType = $("#geshi").find("option:selected").attr('value') === "WAIBI" ? $(".rpt-table-sub-tip-currency").find("option:selected").attr('value') : '';
				var currencyTypeVal = $("#geshi").find("option:selected").attr('value') === "WAIBI" ? $(".rpt-table-sub-tip-currency").find("option:selected").text() : '';

				var arguObj = {
					"acctCode": rpt.nowAcctCode,
					"agencyCode": rpt.nowAgencyCode,
					"agencyName": rpt.nowAgencyName,
					"prjCode": "",
					"prjName": "",
					"prjScope": "",
					"rptType": "GL_RPT_JOURNAL",
					"setYear": rpt.nowSetYear,
					"userId": rpt.nowUserId,
					"prjContent": {
						"accaCode": accaCode,
						"agencyAcctInfo": [{
							"acctCode": rpt.nowAcctCode,
							"agencyCode": rpt.nowAgencyCode
						}],
						"startDate": startDate,
						"endDate": endDate,
						"startYear": "",
						"startFisperd": "",
						"endYear": "",
						"endFisperd": "",
						"formatType": formatType,
						"formatTypeVal": formatTypeVal,
						"currencyType": currencyType,
						"currencyTypeVal": currencyTypeVal,
						"qryItems": ACCOitems,
						"rptCondItem": [],
						"rptOption": [{
							"defCompoValue": IS_INCLUDE_UNPOST,
							"optCode": "IS_INCLUDE_UNPOST",
							"optName": "含未记账凭证"
						},
						{
							"defCompoValue": IS_INCLUDE_JZ,
							"optCode": "IS_INCLUDE_JZ",
							"optName": "含结转凭证"
						},
						{
							"defCompoValue": IS_JUSTSHOW_OCCFISPERD,
							"optCode": "IS_JUSTSHOW_OCCFISPERD",
							"optName": "只显示有发生期间"
						}
						],
						"curCode": "",
						"rptStyle": "SANLAN",
						"rptTitleName": "明细账"
					}
				};
				$("a[name='period']").each(function () {
					if ($(this).hasClass("selected")) {
						arguObj.timeBtn = $(this).attr("id");
					}
				});
				arguObj.rowData = rowData;
				var arguStr = JSON.stringify(arguObj);
				rpt.journalFormBal = ufma.sessionKey(rpt.module, rpt.compoCode, rpt.rgCode, rpt.nowSetYear, rpt.nowAgencyCode, rpt.nowAcctCode, "journalFormBal");
				sessionStorage.setItem(rpt.journalFormBal, arguStr);
				rpt.sessionKeyArr.push(rpt.journalFormBal);
//				window.open('../glRptJournal/glRptJournal.html?dataFrom=glRptBal&action=query');

				var baseUrl = '/gl/rpt/glRptJournal/glRptJournal.html?menuid=' + rpt.journalMenuId + '&dataFrom=glRptBal&action=query';
				baseUrl = '/pf' + baseUrl 
				uf.openNewPage(page.isCrossDomain, $(this), 'openMenu', baseUrl, false, "明细账");
			},

			//增加筛选框
			addFunnelBox: function () {
				$(rpt.namespace + " #SANLAN .thTitle.rpt-th-jine3-8").after($(rpt.backTwoSearchHtml("rpt-funnelBoxNum", "金额区间", "-8")));
				$(rpt.namespace + " #SANLAN .thTitle.rpt-th-jine3-7").after($(rpt.backTwoSearchHtml("rpt-funnelBoxNum", "金额区间", "-7")));
				$(rpt.namespace + " #SANLAN .thTitle.rpt-th-jine3-6").after($(rpt.backTwoSearchHtml("rpt-funnelBoxNum", "金额区间", "-6")));
				$(rpt.namespace + " #SANLAN .thTitle.rpt-th-jine3-5").after($(rpt.backTwoSearchHtml("rpt-funnelBoxNum", "金额区间", "-5")));
				$(rpt.namespace + " #SANLAN .thTitle.rpt-th-jine3-4").after($(rpt.backTwoSearchHtml("rpt-funnelBoxNum", "金额区间", "-4")));
				$(rpt.namespace + " #SANLAN .thTitle.rpt-th-jine3-3").after($(rpt.backTwoSearchHtml("rpt-funnelBoxNum3", "金额区间", "-3")));
				$(rpt.namespace + " #SANLAN .thTitle.rpt-th-jine3-2").after($(rpt.backTwoSearchHtml("rpt-funnelBoxNum3", "金额区间", "-2")));
				$(rpt.namespace + " #SANLAN .thTitle.rpt-th-jine3-1").after($(rpt.backTwoSearchHtml("rpt-funnelBoxNum3", "金额区间", "-1")));

				$(rpt.namespace + " #WAIBI .thTitle.rpt-th-jine-1").after($(rpt.backTwoSearchHtml("rpt-funnelBoxNum", "金额区间", "-1")));
				$(rpt.namespace + " #WAIBI .thTitle.rpt-th-jine-2").after($(rpt.backTwoSearchHtml("rpt-funnelBoxNum", "金额区间", "-2")));
				$(rpt.namespace + " #WAIBI .thTitle.rpt-th-jine-4").after($(rpt.backTwoSearchHtml("rpt-funnelBoxNum", "金额区间", "-4")));
				$(rpt.namespace + " #WAIBI .thTitle.rpt-th-jine-5").after($(rpt.backTwoSearchHtml("rpt-funnelBoxNum", "金额区间", "-5")));
				$(rpt.namespace + " #WAIBI .thTitle.rpt-th-jine-6").after($(rpt.backTwoSearchHtml("rpt-funnelBoxNum", "金额区间", "-6")));
				$(rpt.namespace + " #WAIBI .thTitle.rpt-th-jine-7").after($(rpt.backTwoSearchHtml("rpt-funnelBoxNum", "金额区间", "-7")));
				$(rpt.namespace + " #WAIBI .thTitle.rpt-th-jine-8").after($(rpt.backTwoSearchHtml("rpt-funnelBoxNum", "金额区间", "-8")));
				$(rpt.namespace + " #WAIBI .thTitle.rpt-th-jine-9").after($(rpt.backTwoSearchHtml("rpt-funnelBoxNum", "金额区间", "-9")));
				$(rpt.namespace + " #WAIBI .thTitle.rpt-th-jine-10").after($(rpt.backTwoSearchHtml("rpt-funnelBoxNum", "金额区间", "-10")));
				$(rpt.namespace + " #WAIBI .thTitle.rpt-th-jine-11").after($(rpt.backTwoSearchHtml("rpt-funnelBoxNum", "金额区间", "-11")));
				$(rpt.namespace + " #WAIBI .thTitle.rpt-th-jine-12").after($(rpt.backTwoSearchHtml("rpt-funnelBoxNum", "金额区间", "-12")));
				$(rpt.namespace + " #WAIBI .thTitle.rpt-th-jine-13").after($(rpt.backTwoSearchHtml("rpt-funnelBoxNum", "金额区间", "-13")));

				$(rpt.namespace + " #SHULIANG .thTitle.rpt-th-jine3-1").after($(rpt.backTwoSearchHtml("rpt-funnelBoxNum", "金额区间", "-1")));
				$(rpt.namespace + " #SHULIANG .thTitle.rpt-th-jine3-4").after($(rpt.backTwoSearchHtml("rpt-funnelBoxNum", "金额区间", "-4")));
				$(rpt.namespace + " #SHULIANG .thTitle.rpt-th-jine3-6").after($(rpt.backTwoSearchHtml("rpt-funnelBoxNum", "金额区间", "-6")));
				$(rpt.namespace + " #SHULIANG .thTitle.rpt-th-jine3-8").after($(rpt.backTwoSearchHtml("rpt-funnelBoxNum", "金额区间", "-8")));
				$(rpt.namespace + " #SHULIANG .thTitle.rpt-th-jine3-10").after($(rpt.backTwoSearchHtml("rpt-funnelBoxNum", "金额区间", "-10")));
				$(rpt.namespace + " #SHULIANG .thTitle.rpt-th-jine3-12").after($(rpt.backTwoSearchHtml("rpt-funnelBoxNum", "金额区间", "-12")));

				$(rpt.namespace + " #SHULWAIB .thTitle.rpt-th-jine-1").after($(rpt.backTwoSearchHtml("rpt-funnelBoxNum", "金额区间", "-1")));
				$(rpt.namespace + " #SHULWAIB .thTitle.rpt-th-jine-2").after($(rpt.backTwoSearchHtml("rpt-funnelBoxNum", "金额区间", "-2")));
				$(rpt.namespace + " #SHULWAIB .thTitle.rpt-th-jine-5").after($(rpt.backTwoSearchHtml("rpt-funnelBoxNum", "金额区间", "-5")));
				$(rpt.namespace + " #SHULWAIB .thTitle.rpt-th-jine-6").after($(rpt.backTwoSearchHtml("rpt-funnelBoxNum", "金额区间", "-6")));
				$(rpt.namespace + " #SHULWAIB .thTitle.rpt-th-jine-8").after($(rpt.backTwoSearchHtml("rpt-funnelBoxNum", "金额区间", "-8")));
				$(rpt.namespace + " #SHULWAIB .thTitle.rpt-th-jine-9").after($(rpt.backTwoSearchHtml("rpt-funnelBoxNum", "金额区间", "-9")));
				$(rpt.namespace + " #SHULWAIB .thTitle.rpt-th-jine-11").after($(rpt.backTwoSearchHtml("rpt-funnelBoxNum", "金额区间", "-11")));
				$(rpt.namespace + " #SHULWAIB .thTitle.rpt-th-jine-12").after($(rpt.backTwoSearchHtml("rpt-funnelBoxNum", "金额区间", "-12")));
				$(rpt.namespace + " #SHULWAIB .thTitle.rpt-th-jine-14").after($(rpt.backTwoSearchHtml("rpt-funnelBoxNum", "金额区间", "-14")));
				$(rpt.namespace + " #SHULWAIB .thTitle.rpt-th-jine-15").after($(rpt.backTwoSearchHtml("rpt-funnelBoxNum", "金额区间", "-15")));
				$(rpt.namespace + " #SHULWAIB .thTitle.rpt-th-jine-17").after($(rpt.backTwoSearchHtml("rpt-funnelBoxNum", "金额区间", "-17")));
				$(rpt.namespace + " #SHULWAIB .thTitle.rpt-th-jine-18").after($(rpt.backTwoSearchHtml("rpt-funnelBoxNum", "金额区间", "-18")));
			},
			//设置隐藏列盒子内容
			setVisibleCol: function () {
				var nowHead = page.headArr;
				if (!nowHead) {
					return false;
				}
				var changeHead = [], removeDubl = [];
				var html = "";
				for (var i = 0; i < nowHead.length; i++) {
					// liuyyn fixbug#3948【柳州公安】查询余额表的时候，客户希望将累计发生数这一项作为可选项设置，根据用户的需要自己设置要不要显示。
					// if ((nowHead[i].pTitle == "期初余额" || nowHead[i].pTitle == "本期发生额" || nowHead[i].pTitle == "累计发生额" || nowHead[i].pTitle == "期末余额") && removeDubl.indexOf(nowHead[i].pTitle) < 0) {
					if ((nowHead[i].pTitle == "累计发生额") && removeDubl.indexOf(nowHead[i].pTitle) < 0) {
						changeHead.push(nowHead[i]);
						removeDubl.push(nowHead[i].pTitle)
						var h = ufma.htmFormat('<p><label class="mt-checkbox mt-checkbox-outline">' +
							'<input type="checkbox" data-code="<%=code%>" data-index="<%=index%>"><%=title%>' +
							'<span></span>' +
							'</label></p>', {
								title: nowHead[i].pTitle,
								index: i,
								code: nowHead[i].code
							});
						html += h;
					}
				}
				$("#colList").html(html);
				page.changeCol = changeHead;
			},

			//******初始化页面******************************************************
			initPage: function () {
				if (isFirst) {
					localStorage.removeItem("colSetVal");
					localStorage.removeItem("colSetHtml");
					isFirst = false;
				}
				//增加筛选框
				page.addFunnelBox();

				page.SANLANhtml1 = $("#SANLAN tr").eq(0).html();
				page.SANLANhtml2 = $("#SANLAN tr").eq(1).html();

				page.WAIBIhtml1 = $("#WAIBI tr").eq(0).html();
				page.WAIBIhtml2 = $("#WAIBI tr").eq(1).html();

				page.SHULIANGhtml1 = $("#SHULIANG tr").eq(0).html();
				page.SHULIANGhtml2 = $("#SHULIANG tr").eq(1).html();

				page.SHULWAIBhtml1 = $("#SHULWAIB tr").eq(0).html();
				page.SHULWAIBhtml2 = $("#SHULWAIB tr").eq(1).html();

				page.glRptBalTable = $('#glRptBalTable'); //当前table的ID
				page.glRptBalThead = $('#glRptBalThead'); //当前table的头部ID

				newDataArr = [{
					data: "accoCode",
					className: "isprint",
					// width: "200"
				}, //会计科目代码	
				{
					data: "accoName",
					className: "isprint",
					// width: "200"
				} //会计科目名称
				];
				var initDataArr = newDataArr.concat(SANLANColsArr);
				//		    	console.info(JSON.stringify(initDataArr));
				var tableData = [];
				$('#glRptBalTable tbody').html('');
				page.glRptBalThead.html('<tr>' + page.SANLANhtml1 + '</tr><tr>' + page.SANLANhtml2 + '</tr>');
				if($.getUrlParam('query') != 'vou'){
					page.glRptBalDataTable = page.newTable(initDataArr, tableData, "SANLAN");
				}
				//				page.glRptBalDataTable.columns.adjust().draw();
				//page.glRptBalDataTable.ajax.url("glRptBal1.json");
				ufma.isShow(page.reslist);
				//初始化单位样式
				rpt.initAgencyList();
				//初始化账套样式
				rpt.initAcctList();
				
				// 账表数据范围选择框记忆上次选择的数据
				rpt.getSysRuleSet();

				$("#accList1,#accList2,#accList3,#accList4,#accList5").ufCombox({
					idField: "accItemCode",
					textField: "accItemName",
					placeholder: "请选择",
					readonly: true,
					onChange: function (sender, data) {
						var raun = true;
						var senderid = sender.attr("id")
						if ($("#" + senderid).getObj().getText() != '请选择') {
							for (var i = 1; i < 6; i++) {
								if ($("#accList" + i).getObj().getValue() == $("#" + senderid).getObj().getValue() && $("#" + senderid).getObj().getText() != '请选择' && senderid != 'accList' + i) {
									raun = false
									ufma.showTip("请勿选择重复辅助项", function () { }, "warning");
									$("#" + senderid).getObj().setValue("", "请选择")
								}
							}
							if (raun) {
								rpt.accHtml(sender, data)
							}
						} else {
							rpt.accHtml(sender, data)
						}
						localStorage.removeItem("colSetVal");
						localStorage.removeItem("colSetHtml");
						dm.showItemCol();
						page.resetTableHeight();
					},
					onComplete: function (sender) {

					}
				});

				//请求单位列表
				rpt.reqAgencyList();

				//请求查询条件其他选项列表
				rpt.reqOptList();
			},

			onEventListener: function () {
				$("#accList1,#accList2,#accList3,#accList4,#accList5").find('span.icon-close').on('click', function() {
					page.resetTableHeight();
				});

				$(".label-more").on("click", function () {
					var timeId = setTimeout(function () {
						clearTimeout(timeId);
						//金额区间-范围筛选
						rpt.twoSearch(page.glRptBalTable);
						page.resetTableHeight();
						// 点击更多的时候将表内滚动到顶部，然后在固定表头
						$("#glRptBalDiv").scrollTop(0);
						$("#glRptBalTable").fixedTableHead($("#glRptBalDiv"));
						// 加载缓存数据，渲染表格
						// var tableData = tableData_bak;
						// var showLiArr = showLiArr_bak;
						// var nowTabType = nowTabType_bak;
						// for (var j = 0; j < tableData.length; j++) {
						// 	for (var i = 0; i < rpt.reqCurrTypes.length; i++) {
						// 		if (tableData[j].curCode && (tableData[j].curCode == rpt.reqCurrTypes[i].chrCode)) {
						// 			tableData[j].curCode = rpt.reqCurrTypes[i].chrName;
						// 		}
						// 	}
						// }
						// page.changTable(showLiArr, tableData, nowTabType);
					}, 300)

				})

				//zsj---修改bug77802
				$('#showColSet').mouseout(function () {
					dm.curColA = [];
					$('#showColSet td').each(function (e) {
						var itemType = $(this).attr('data-code');
						var itemName = $(this).attr('data-name');
						if ($('#showColSet tr td[data-code="' + itemType + '"] .isShowCol').is(':checked') && $('#showColSet tr td[data-code="' + itemType + '"] .isSumCol').is(':checked')) {
							dm.curColA.push({
								itemType: itemType,
								isShow: '1',
								isSum: '1'
							});
						} else if ($('#showColSet tr td[data-code="' + itemType + '"] .isShowCol').is(':checked') && !$('#showColSet tr td[data-code="' + itemType + '"] .isSumCol').is(':checked')) {
							dm.curColA.push({
								itemType: itemType,
								isShow: '1',
								isSum: '0'
							});
						} else if (!$('#showColSet tr td[data-code="' + itemType + '"] .isShowCol').is(':checked') && $('#showColSet tr td[data-code="' + itemType + '"] .isSumCol').is(':checked')) {
							dm.curColA.push({
								itemType: itemType,
								isShow: '0',
								isSum: '1'
							});
						} else if (!$('#showColSet tr td[data-code="' + itemType + '"] .isShowCol').is(':checked') && !$('#showColSet tr td[data-code="' + itemType + '"] .isSumCol').is(':checked')) {
							dm.curColA.push({
								itemType: itemType,
								isShow: '0',
								isSum: '0'
							});
						}
					});
				});
				//方案作用域单选
				rpt.raidoInputGroup("rpt-radio-span");
				//改变表格样式
				$(rpt.namespace).find(".change-rpt-type,.rpt-table-sub-tip-currency").on("click", "i", function () {
					$(this).hide();
					$(this).siblings("select").show();
				});
				$(rpt.namespace).find(".rpt-table-sub-tip-currency").on("change", "select", function () {
					var tableData = [];
					$(this).siblings("i").attr("data-type", $(this).val());
					$(this).hide();
					$(this).siblings("i").text($(this).find("option:checked").text()).show();
					// pageLength = ufma.dtPageLength('#glRptBalTable');
					// $('#glRptBalTable_wrapper').ufScrollBar('destroy');
					// // page.glRptBalDataTable.clear().destroy();
					// page.glRptBalThead.html('<tr>' + page.WAIBIhtml1 + '</tr><tr>' + page.WAIBIhtml2 + '</tr>');
					// $('#glRptBalTable tbody').html('');
					// page.glRptBalDataTable = page.newTable(WAIBIColsArr, tableData, "WAIBI");
					$("#searchTableData").click()
				});
				$(rpt.namespace).find(".change-rpt-type").on("change", "select", function () {

					pageLength = ufma.dtPageLength('#glRptBalTable');
					$('#glRptBalTable_wrapper').ufScrollBar('destroy');
					// page.glRptBalDataTable.clear().destroy();
					page.glRptBalDataTable.fnDestroy();
					var columnsArr = [];
					var tableData = [];
					$(this).siblings("i").attr("data-type", $(this).val());
					if ($(this).val() == "SANLAN") {
						hideColArray = [3, 4, 6, 7];
						page.glRptBalThead.html('<tr>' + page.SANLANhtml1 + '</tr><tr>' + page.SANLANhtml2 + '</tr>');
						$('#glRptBalTable tbody').html('');
						columnsArr = SANLANColsArr;
						$(".rpt-table-sub-tip-currency").hide();
					} else if ($(this).val() == "WAIBI") {
						hideColArray = [3, 4, 6, 7];
						page.glRptBalThead.html('<tr>' + page.WAIBIhtml1 + '</tr><tr>' + page.WAIBIhtml2 + '</tr>');
						$('#glRptBalTable tbody').html('');
						columnsArr = WAIBIColsArr;
						$(".rpt-table-sub-tip-currency").show();
					} else if ($(this).val() == "SHULIANG") {
						hideColArray = [3, 4, 6, 7];
						page.glRptBalThead.html('<tr>' + page.SHULIANGhtml1 + '</tr><tr>' + page.SHULIANGhtml2 + '</tr>');
						$('#glRptBalTable tbody').html('');
						columnsArr = SHULIANGColsArr;
						$(".rpt-table-sub-tip-currency").hide();
					} else if ($(this).val() == "SHULWAIB") {
						hideColArray = [3, 4, 6, 7];
						page.glRptBalThead.html('<tr>' + page.SHULWAIBhtml1 + '</tr><tr>' + page.SHULWAIBhtml2 + '</tr>');
						$('#glRptBalTable tbody').html('');
						columnsArr = SHULWAIBColsArr;
						$(".rpt-table-sub-tip-currency").show();
					}

					page.glRptBalDataTable = page.newTable(columnsArr, tableData, $(this).val());
					$(this).hide();
					$(this).siblings("i").text($(this).find("option:checked").text()).show();
					$("#searchTableData").click()
				});
				//期间单选按钮组
				rpt.raidoBtnGroup("rpt-query-btn-cont-date");

				//选择树形展示的radio组
				rpt.raidoTreeShow();

				//按钮提示
				rpt.tooltip();

				//绑定日历控件
				var glRptLedgerDate = {
					format: 'yyyy-mm',
					viewMode: 'month',
					initialDate: new Date(),
					onChange: function (fmtDate) {
						// rpt.checkDate(fmtDate, "#dateStart")
					}
				};
				var glRptLedgerEndDate = {
					format: 'yyyy-mm',
					viewMode: 'month',
					initialDate: new Date(),
					onChange: function (fmtDate) {
						// rpt.checkDate(fmtDate, "#dateEnd")
					}
				};
				$("#dateStart").ufDatepicker(glRptLedgerDate);
				$("#dateEnd").ufDatepicker(glRptLedgerEndDate);
				rpt.dateBenQi("dateStart", "dateEnd");

				//选择期间，改变日历控件的值
				$(" #dateBq").on("click", function () {
					rpt.dateBenQi("dateStart", "dateEnd");
				});
				$(" #dateBn").on("click", function () {
					rpt.dateBenNian("dateStart", "dateEnd");
				});

				//单选会计体系
				$(rpt.namespace + " #accaList").on("click", "button", function () {
					if (!$(this).hasClass("btn-primary")) {
						if (rpt.sessionKeyArr.length > 0) {
							for (var i = 0; i < rpt.sessionKeyArr.length; i++) {
								sessionStorage.removeItem(rpt.sessionKeyArr[i]);
							}
						}
						//还原查询条件
						$(rpt.namespace).find('.rpt-method-list li').css({
							"border": "1px solid #D9D9D9"
						}).removeClass("isUsed");
						rpt.resBackQuery();

						$(this).addClass("btn-primary").removeClass("btn-default");
						$(this).siblings("button").removeClass("btn-primary").addClass("btn-default");
					}
				})

				//打开-保存查询方案模态框
				rpt.openSaveMethodModal();

				//确认-保存查询方案
				$('#sureSaveMethod,#saveAs').on('click', function (e) {
					if ($("#methodName").val().trim() != "") {
						rpt.reqSavePrj($(e.target).is('#saveAs'));
					} else {
						ufma.showInputHelp('methodName', '<span class="error">方案名称不能为空</span>');
						$('#methodName').closest('.form-group').addClass('error');
					}
				});

				//输入方案名的提示
				rpt.methodNameTips();

				//编辑表格名称
				rpt.editTableTitle();

				//编辑金额单位
				rpt.changeMonetaryUnit();

				/*zsj---修改bug77802
				 * $(rpt.namespace).on("click", ".isShowCol", function() {
					if(!$(this).prop("checked")) {
						$(this).parent("label").siblings().find(".isSumCol").removeAttr("checked");
					}
				});
				$(rpt.namespace).on("click", ".isSumCol", function() {
					if($(this).prop("checked")) {
						$(this).parent("label").siblings().find(".isShowCol").prop("checked", true);
					}
				})*/
				//点击查询按钮，改变表格信息
				$(rpt.namespace).find("#searchTableData").on("click", function () {
					// liuyyn fixbug#4089 会计体系显示为undifined
					// 点击查询时判断辅助项如果为空，修改showLiArr为默认
					var showLiArr = rpt.tableColArr();
					if (showLiArr.length === 0) {
						$('#showColSet td[data-code="ACCO"] input').prop('checked', true);
						showLiArr = [{
							dir: "",
							isGradSum: "1",
							isShowItem: "1",
							itemPos: "",
							itemType: "ACCO",
							itemTypeName: "会计科目",
							items: "",
							seq: "condition",
							tips: ""
						}]
					}
					if (new Date($('#dateStart').getObj().getValue()).getFullYear() !== new Date($('#dateEnd').getObj().getValue()).getFullYear()) {
						ufma.hideloading();
						ufma.showTip('请选择一个年度内的日期查询！', function() {}, 'error');
						return false;
					}
					if ($('#dateStart').getObj().getValue() > $('#dateEnd').getObj().getValue()) {
						ufma.showTip('开始月份不能大于结束月份！', function () { }, 'error');
						return false;
					}
					var arr = [];
					for (var i = 1; i < 6; i++) {
						var name = $("#accList" + i).getObj().getText();
						if (name != "请选择" && !$.isNull(name)) {
							arr.push(name);
						}
					}
					var nary = arr.sort();
					for (var i = 0; i < nary.length; i++) {
						if (nary[i] == nary[i + 1]) {
							ufma.showTip(nary[i] + "重复了!", function () { }, "warning");
							return false;
						}
					}
					var tabArgu = rpt.backTabArgu();
					tabArgu.accaCode = rpt.nowAccaCode;
					var nowTabType = $(".change-rpt-type i").attr("data-type");
					ufma.showloading('正在加载数据，请耐心等待...');
					//不按方案查询时，记忆其他勾选项情况 guohx 20200806
					if ($.isNull(tabArgu.prjGuid)) {
						rpt.rememberOther(rpt.rptOptionArr(),'55954f15-bf69-49c0-8b24-8cc4069824fb');
					}
					// 查询时，修改方案的查询次数
					rpt.addQryCount(tabArgu.prjGuid);
					// 重新查询方案列表
					rpt.reqPrjList();

					tableData_bak = ''  // 清空缓存数据
					showLiArr_bak = ''  // 清空缓存数据
					ufma.ajax(portList.getReport, "post", tabArgu, function (result) {
						ufma.hideloading();
						if(result.flag == 'fail'){
							ufma.showTip(result.msg,function(){},"error");
							return;
						}
						var tableData = result.data.tableData;
						tableData_bak = result.data.tableData;      //缓存数据
						showLiArr_bak = rpt.tableColArr();          //缓存数据
						nowTabType_bak = $(".change-rpt-type i").attr("data-type"); //缓存数据
						for (var j = 0; j < tableData.length; j++) {
							for (var i = 0; i < rpt.reqCurrTypes.length; i++) {
								if (tableData[j].curCode && (tableData[j].curCode == rpt.reqCurrTypes[i].chrCode)) {
									tableData[j].curCode = rpt.reqCurrTypes[i].chrName;
								}
							}
						}
						page.changTable(showLiArr, tableData, nowTabType);
					});

				});
				$('#rptStyle').on('change', function () {
					var postSetData = {
						agencyCode: rpt.nowAgencyCode,
						acctCode: rpt.nowAcctCode,
						
						componentId: $('#rptType option:selected').val(),
						rgCode: pfData.svRgCode,
						setYear: pfData.svSetYear,
						sys: '100',
						directory: '余额表' + $('#rptStyle option:selected').text()
					};
					$.ajax({
						type: "POST",
						url: "/pqr/api/templ",
						dataType: "json",
						data: postSetData,
						success: function (data) {
							var data = data.data;
							$('#rptTemplate').html('')
							for (var i = 0; i < data.length; i++) {
								var jData = data[i].reportCode
								$op = $('<option templId = ' + data[i].templId + ' valueid="' + data[i].reportCode + '" value="' + jData + '">' + data[i].reportName + '</option>');
								$('#rptTemplate').append($op);
							}
						},
						error: function () { }
					});
				})
				$("#btn-tableprintsave").off().on('click', function () {
					var oTable = $('#glRptBalTable').dataTable();
					var tblData = oTable.fnGetData()
					var ztitle = {}
					var datas = [{}]
					for (var i = 0; i < $("#showColSet table tbody tr").length; i++) {
						// if ($("#showColSet table tbody tr").eq(i).find('td').eq(0).attr('data-code') != "ACCO") {
							if($("#showColSet table tbody tr").eq(i).find('input').eq(0).is(':checked')){
								var code = tf($("#showColSet table tbody tr").eq(i).find('td').eq(0).attr('data-code').toLowerCase()) + 'Name'
								var name = $("#showColSet table tbody tr").eq(i).find('td').eq(0).attr('data-name')
								ztitle[code] = name
							}
						// }
					}
					var j = 1;
					var ntitle = {}
					var j=1;
					var ntitle ={}
					var accotitle = []
					for(var z in ztitle){
						ntitle['ext' + j + 'Name'] = ztitle[z]
						for (var i = 0; i < tblData.length; i++) {
							var ss = z.substring(0,z.length-4)+"Code"
							var sN = z.substring(0,z.length-4)+"Name"
							tblData[i]['accItemExt' + j] = tblData[i][ss]+ ' '+ tblData[i][sN]
							tblData[i]['accItemCodeExt' + j] = tblData[i][ss];
						}
						j++
					}
					var ISTOTALAMTPdf = []
					if($("#colList label input[data-code=totalDrAmt]").is(":checked")){
						ISTOTALAMTPdf  =[{
							"totalDrAmt": "累计发生额借方",
							"totalCrAmt": "累计发生额贷方"
						}]
					}
					var xhr = new XMLHttpRequest()
					var formData = new FormData()
					formData.append('reportCode', $('#rptTemplate option:selected').attr('valueid'))
					formData.append('templId', $('#rptTemplate option:selected').attr('templId'))
					datas[0].GL_RPT_PRINT = tblData
					datas[0].GL_RPT_TOTAL_AMT = ISTOTALAMTPdf
					datas[0].GL_RPT_HEAD_EXT = [ntitle]
					// datas[0].GL_RPT_HEAD_ACCO = [{}]
					// if($("#showColSet").find('td[data-code="ACCO"]').find('input').eq(0).is(":checked")){
					// 	datas[0].GL_RPT_HEAD_ACCO = [{
					// 		accoCode:"会计科目编码",
					// 		accoName:"会计科目名称"
					// 	}]
					// }
					formData.append('groupDef', JSON.stringify(datas))
					xhr.open('POST', '/pqr/api/printpdfbydata', true)
					xhr.setRequestHeader('context-type', 'text/xml;charset=utf-8')
					xhr.responseType = 'blob'
					xhr.onload = function(e) {
						if(xhr.status === 200) {
							if(xhr.status === 200) {
								var content = decodeURIComponent(xhr.getResponseHeader('Content-Disposition'))
								window.open(content, '_blank', 'titlebar=no,location=no,toolbar=no,menubar=no;top=100')
							}
						}
					}
					xhr.onreadystatechange = function() {
						if(xhr.readyState === 4) {
							if(xhr.status === 200) {
								ufma.hideloading();
							} else {
								var content = decodeURIComponent(xhr.getResponseHeader('Content-Disposition'))
								alert(content)
								ufma.hideloading();
							}
						}
					}
					xhr.send(formData)
					page.editor.close();
				});
				$("#btn-tableprintqx").off().on('click', function () {
					page.editor.close();
				})
				//显示/隐藏列隐藏框
				$(rpt.namespace).on("click", "#colAction", function (evt) {
					evt.stopPropagation();
					$("#colList input").each(function (i) {
						// liuyyn fixbug#3948【柳州公安】查询余额表的时候，客户希望将累计发生数这一项作为可选项设置，根据用户的需要自己设置要不要显示。				
						$(this).prop("checked", boxModel === '1' ? true : false);
					});

					$("div.rpt-funnelBox").hide();
					$(this).next("div.rpt-funnelBox").show();
				})
				// $(".btn-print").off().on("click", function () {
				// 	var postSetData = {
				// 		reportCode:'GL_RPT_PRINT1',
				// 		templId:'*'
				// 	}
				// 	$.ajax({
				// 		type: "POST",
				// 		url: "/pqr/api/iprint/templbycode",
				// 		dataType: "json",
				// 		data: postSetData,
				// 		success: function(data) {
				// 			var printcode= data.data.printCode
				// 			var medata = JSON.parse(data.data.tempContent) 
				// 			var tabArgu = rpt.backTabArgu();
				// 			tabArgu.accaCode = rpt.nowAccaCode;
				// 			tabArgu.prjContent.pageLength =data.data.rowNum
				// 			var runNum = data.data.rowNum
							// var titles = {
							// 	columns:[{
							// 		title:'',
							// 		ch
							// 	}]
							// }
				// 			ufma.ajaxDef('/gl/rpt/getReportPrintCloudData/GL_RPT_BAL', "post", tabArgu, function (result) {
				// 				var outTableData = {}
				// 				outTableData.agency=page.cbAgency.getValue() + ' ' + page.cbAgency.getText()
				// 				outTableData.times = $("#dateStart").getObj().getValue()+'至'+$("#dateEnd").getObj().getValue()
				// 				outTableData.acco = $('input[id="ACCO-data-key"]').val()
				// 				outTableData.printor = rpt.nowUserId
				// 				outTableData.startPage = 1
				// 				outTableData.date = rpt.today
				// 				outTableData.title = '多栏账'
				// 				var pagelen = result.data.tableData.length
				// 				outTableData.totalPage= Math.ceil(pagelen/runNum)
				// 				result.data.outTableData = outTableData
				// 				var names = medata.template
				// 				// var  tempdata = YYPrint.register({ names });
				// 				// result.data.tableHead.columns =result.data.tableHead.crcolumns
				// 				var html = YYPrint.engine(medata.template,medata.meta, result.data);
				// 				YYPrint.print(html)
				// 			})
				// 		},
				// 		error: function() {}
				// 	});
				// })
				//确认添加列
				$("#addCol").on("click", function (evt) {
					evt.stopPropagation();
					var checks = $("#colList label input[data-code=totalDrAmt]");
					// liuyyn fixbug#3948【柳州公安】查询余额表的时候，客户希望将累计发生数这一项作为可选项设置，根据用户的需要自己设置要不要显示。
					// 存储累计发生额状态
					var data = {
						"agencyCode":rpt.nowAgencyCode,
						"acctCode":rpt.nowAcctCode,
						"menuId":"55954f15-bf69-49c0-8b24-8cc4069824fb",
						"configKey":'boxModel',
						"configValue":checks.prop('checked') ? '1' : '0'
					}
					ufma.ajaxDef('/pub/user/menu/config/update', "post", data, function(data) {
						boxModel = checks.prop('checked') ? '1' : '0'
					})
					// if (checks.length == 0) {
					// 	ufma.showTip("必须选择其中一列值展示", function () { }, "warning");
					// 	return false
					// }
					$("#colList label").each(function (i) {
						page.changeCol[i].visible = $(this).find("input").prop("checked");
						var nn = $(this).find("input").data("index");
						if (hideColArray.indexOf(nn) >= 0) {
							hideColArray.remove(nn, nn + 1);
						}
						if ($(this).find("input").is(":checked")) {
							page.glRptBalDataTable.fnSetColumnVis(nn, true);
							$(page.glRptBalDataTable.fnSettings().aoColumns[nn].nTh).addClass("isprint");
							page.glRptBalDataTable.fnSetColumnVis(nn + 1, true);
							$(page.glRptBalDataTable.fnSettings().aoColumns[nn + 1].nTh).addClass("isprint");
						} else {
							// if (hideColArray.indexOf(nn) == -1) {
							// 	hideColArray.push(nn, nn + 1);
							// }
							page.glRptBalDataTable.fnSetColumnVis(nn, false);
							$(page.glRptBalDataTable.fnSettings().aoColumns[nn].nTh).removeClass("isprint");
							page.glRptBalDataTable.fnSetColumnVis(nn + 1, false);
							$(page.glRptBalDataTable.fnSettings().aoColumns[nn + 1].nTh).removeClass("isprint");
						}
					});
					// page.glRptBalDataTable.aoColumns.fnDraw();
					//固定表头
					$("#glRptBalTable").fixedTableHead($("#glRptBalDiv"));
					$("#searchTableData").click()
				});
			},
			// 重新计算表格高度 表内滚动
			resetTableHeight: function () {
				// 表内滚动
				var windowHeight = $(window).height();
				var top = $('.rpt-table-tab').offset().top;
				$('.rpt-table-tab').css("height", windowHeight - top - 3 - 56 - 10);
				// 去掉外层x方向的滚动，解决表单分页下方出现横向滚动轴的问题
				// $('.rpt-table-tab').css("overflow","auto");
				$('.rpt-table-tab').css("overflow-x","hidden");
				$('.rpt-table-tab').css("overflow-y","auto");
				$('#glRptBalTable_wrapper').ufScrollBar({
					hScrollbar: true,
					mousewheel: false
				});
				$('#glRptBalTable').tblcolResizable({},'',1);
				$("#glRptBalTable").fixedTableHead($("#glRptBalDiv"));
				ufma.setBarPos($(window));
			},
			//重构
			initPageNew: function () {
				$('.rpt-method-tip').tooltip();
				$('#showMethodTip').click(function () {
					if ($("#rptPlanList").find('li').length == 0) {
						$("#rptPlanList ul").append('<li class="tc">无可用方案</li>');
					};
				});

				$('#showMethodTip').ufTooltip({
					className: 'p0',
					trigger: 'click', //click|hover
					opacity: 1,
					confirm: false,
					gravity: 'north', //north|south|west|east
					content: "#rptPlanList"
				});
				$('#btnShowCol').ufTooltip({
					className: 'p0',
					trigger: 'click', //click|hover
					opacity: 1,
					confirm: false,
					gravity: 'north', //north|south|west|east
					content: "#showColSet",
					onShow: function () {
						dm.showItemCol();
					}
				});
				page.resetTableHeight();
			},
			//此方法必须保留
			init: function () {
				page.reslist = ufma.getPermission();
				this.initPage();
				this.onEventListener();
				this.initPageNew();
				ufma.parse();
				ufma.parseScroll();
				if($.getUrlParam('query') == 'vou'){
					var datass = JSON.parse(window.sessionStorage.getItem("vouforglbal"))
					function showprj(){
						if(rpt.accItemInfo.length>0){
							rpt.showPrjCont(datass)
							$(".rpt-query-box-right .label-more").trigger('click')
							$("#searchTableData").click()
						}else{
							setTimeout(function(){
								showprj()
							},500)
						}
					}
					showprj()
				}
				window.addEventListener('message', function (e) {
					if (e.data.hasOwnProperty('messageType') && e.data.messageType == 'clientWidth') {
						page.isCrossDomain = true;
					} else {
						page.isCrossDomain = false;
					}
				})
			}
		}
	}();

	/////////////////////
	page.init();
	window.rmisFlag = true;
	window.fromRmisShow = page.fromRmisShow;
});