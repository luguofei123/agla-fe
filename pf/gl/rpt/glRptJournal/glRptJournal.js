$(function() {
	var pageLength = ufma.dtPageLength('#glRptJournalTable');
	var hideColArray=[];
	var selectAccaCode;
	var serachData = { // 修改为后端分页
		currentPage: 1,
		pageSize: 100,
	};
	var tableData_bak;  // 缓存数据
	var showLiArr_bak;  // 缓存数据
	var nowTabType_bak; // 缓存数据
	var WAIBIColsArr_bak;
	var SHULIANGColsArr_bak;
	var SHULWAIBColsArr_bak;
	var page = function() {

		var glRptJournalDataTable; //全局datatable对象
		var glRptJournalTable; //全局table的ID

		//明细账所用接口
		var portList = {

			accItemTypeList: "/gl/EleAccItem/getAccItemType", //辅助项类别列表接口 不包括科目
			getReport: "/gl/rpt/getReportData/GL_RPT_JOURNAL", //请求表格数据
			getReportPage: "/gl/rpt/getReportDataPage/GL_RPT_JOURNAL" //请求表格数据-带分页的接口

		};

		//用于存储表头信息
		var headArr;
		var changeCol = [];
		var count = 1;

		//固定隐藏列数组
		var fixedArr = [{
				name: "票据号",
				code: "billNo",
				checked: false
			},
			{
				name: "对方科目",
				code: "dAccoName",
				checked: false
			}
		];

		//三种表格样式的初始化列数组
		//三栏式
		var SANLANColsArr = [{
				data: "vouYear",
				className: 'nowrap isprint tc',
				width: 40,
				render: function(data, type, rowdata, meta) {
					return rowdata.vouYear||rowdata.rq;
				}

			},{
				data: "vouMonth",
				className: 'nowrap isprint tc',
				width: 20

			}, //-10日期-月
			{
				data: "vouDay",
				className: 'nowrap isprint tc',
				width: 20
			}, //-9日期-日
			{
				data: "rowType",
				className: 'nowrap isprint',
				width: 100
			}, //-12行类型
			{
				data: "vouGuid",
				className: 'nowrap isprint',
				width: 100,
				render: function(data, type, rowdata, meta) {
					if(data == '' || data == null) {
						data = ''
					}
					return '<span  title="' + data + '">' + data + '</span>'
				}
			}, //-11凭证字号
			{
				data: "vouNo",
				className: 'nowrap isprint',
				width: 200,
				// render: function(data, type, rowdata, meta) {
				// 	if(data == '' || data == null) {
				// 		data = ''
				// 	}
				// 	return '<span  title="' + data + '">' + data + '</span>'
				// }
			}, //-8凭证字号
			{
				data: "billNo",
				className: 'nowrap isprint',
				width: 150
			}, //-7票据号
			{
				data: "dAccoName",
				className: 'ellipsis isprint',
				width: 200,
				render: function(data, type, rowdata, meta) {
					if(data == '' || data == null) {
						data = ''
					}
					return '<span  title="' + data + '">' + data + '</span>'
				}
			}, //-6对方科目
			{
				data: "descpt",
				className: 'ellipsis isprint',
				width: 200,
				render: function(data, type, rowdata, meta) {
					if(data == '' || data == null) {
						data = ''
					}
					return '<span class="length-overflow" title="' + data + '">' + data + '</span>'
				}
			}, //-5摘要
			{
				data: "dStadAmt",
				className: 'nowrap tr isprint tdNum',
				width: 100
			}, //-4借方金额
			{
				data: "cStadAmt",
				className: 'nowrap tr isprint tdNum',
				width: 100
			}, //-3贷方金额
			{
				data: "drCr",
				className: 'nowrap tc isprint',
			}, //-2方向
			{
				data: "bStadAmt",
				className: 'nowrap tr isprint tdNum',
				width: 100
			} //-1余额
		];
		//外币式
		var WAIBIColsArr = [{
				data: "vouYear",
				className: 'nowrap isprint tc',
				width: 40,
				render: function(data, type, rowdata, meta) {
					return rowdata.vouYear||rowdata.rq;
				}

			},{
				data: "vouMonth",
				className: 'nowrap isprint tc',
				width: 20
			}, //-15日期-月
			{
				data: "vouDay",
				className: 'nowrap isprint tc',
				width: 20
			}, //-14日期-日
			{
				data: "rowType",
				className: 'nowrap isprint',
				width: 100
			}, //-17行类型
			{
				data: "vouGuid",
				className: 'nowrap isprint',
				width: 100,
				render: function(data, type, rowdata, meta) {
					if(data == '' || data == null) {
						data = ''
					}
					return '<span  title="' + data + '">' + data + '</span>'
				}
			}, //-16凭证字号
			{
				data: "vouNo",
				className: 'nowrap isprint',
				width: 200,
				// render: function(data, type, rowdata, meta) {
				// 	if(data == '' || data == null) {
				// 		data = ''
				// 	}
				// 	return '<span  title="' + data + '">' + data + '</span>'
				// }
			}, //-13凭证字号
			{
				data: "billNo",
				className: 'nowrap isprint',
				width: 150
			}, //-12票据号
			{
				data: "dAccoName",
				className: 'ellipsis isprint',
				width: 200,
				render: function(data, type, rowdata, meta) {
					if(data == '' || data == null) {
						data = ''
					}
					return '<span  title="' + data + '">' + data + '</span>'
				}
			}, //-11对方科目
			{
				data: "descpt",
				className: 'ellipsis isprint',
				width: 200,
				render: function(data, type, rowdata, meta) {
					if(data == '' || data == null) {
						data = ''
					}
					return '<span class="length-overflow" title="' + data + '">' + data + '</span>'
				}
			}, //-10摘要
			{
			data: "dExRate",
			className: 'nowrap tr isprint ',
		}, //-10借方金额-汇率
		{
			data: "dCurrAmt",
			className: 'nowrap isprint tdNum',
			width: 100
		}, //-9借方金额-外币
		{
			data: "dStadAmt",
			className: 'nowrap tr isprint tdNum',
			width: 100
		}, //-8借方金额-本币
		{
			data: "cExRate",
			className: 'nowrap tr isprint ',
		}, //-7贷方金额-汇率
		{
			data: "cCurrAmt",
			className: 'nowrap tr isprint tdNum',
			width: 100
		}, //-6贷方金额-外币
		{
			data: "cStadAmt",
			className: 'nowrap tr isprint tdNum',
			width: 100
		}, //-5贷方金额-本币
		{
			data: "drCr",
			className: 'nowrap tc isprint',
		}, //-4方向
		{
			data: "bExRate",
			className: 'nowrap tr isprint ',
		}, //-3余额-汇率
		{
			data: "bCurrAmt",
			className: 'nowrap tr isprint tdNum',
			width: 100
		}, //-2余额-外币
		{
			data: "bStadAmt",
			className: 'nowrap tr isprint tdNum',
			width: 100
		} //-1余额-本币
		];
		//数量金额式
		var SHULIANGColsArr = [{
				data: "vouYear",
				className: 'nowrap isprint tc',
				width: 40,
				render: function(data, type, rowdata, meta) {
					return rowdata.vouYear||rowdata.rq;
				}

		}, {
			data: "vouMonth",
			className: 'nowrap isprint tc',
			width: 20
		}, //-18日期-月
		{
			data: "vouDay",
			className: 'nowrap isprint tc',
			width: 20
		}, //-17日期-日		
		{
			data: "rowType"
		}, //-16行类型
		{
			data: "vouGuid",
			className: 'nowrap isprint',
			width: 100,
			render: function(data, type, rowdata, meta) {
				if(data == '' || data == null) {
					data = ''
				}
				return '<span  title="' + data + '">' + data + '</span>'
			}
		}, //-15凭证字号
		{
			data: "vouNo",
			className: 'nowrap isprint',
			width: 200,
			// render: function(data, type, rowdata, meta) {
			// 	if(data == '' || data == null) {
			// 		data = ''
			// 	}
			// 	return '<span  title="' + data + '">' + data + '</span>'
			// }
		}, //-14凭证字号
		{
			data: "billNo",
			className: 'nowrap isprint',
			width: 150
		}, //-13票据号
		{
			data: "dAccoName",
			className: 'ellipsis isprint',
			width: 200,
			render: function (data, type, rowdata, meta) {
				if (data == '' || data == null) {
					data = ''
				}
				return '<span  title="' + data + '">' + data + '</span>'
			}
		}, //-12对方科目
		{
			data: "descpt",
			className: 'ellipsis isprint',
			width: 200,
			render: function (data, type, rowdata, meta) {
				if (data == '' || data == null) {
					data = ''
				}
				return '<span class="length-overflow" title="' + data + '">' + data + '</span>'
			}
		}, //-11摘要

		{
			data: "dPrice",
			className: 'nowrap tr isprint tdNum'
		}, //-10借方金额-单价
		{
			data: "dQty",
			className: 'nowrap tr isprint'
		}, //-9借方金额-数量
		{
			data: "dStadAmt",
			className: 'nowrap tr isprint tdNum',
			width: 100
		}, //-8借方金额-金额

		{
			data: "cPrice",
			className: 'nowrap tr isprint tdNum'
		}, //-7贷方金额-单价
		{
			data: "cQty",
			className: 'nowrap tr isprint'
		}, //-6贷方金额-数量
		{
			data: "cStadAmt",
			className: 'nowrap tr isprint tdNum',
			width: 100
		}, //-5贷方金额-金额
		{
			data: "drCr",
			className: 'nowrap tc isprint',
		}, //-4方向
		{
			data: "bPrice",
			className: 'nowrap tr isprint tdNum'
		}, //-3余额-单价
		{
			data: "bQty",
			className: 'nowrap tr isprint'
		}, //-2余额-数量
		{
			data: "bStadAmt",
			className: 'nowrap tr isprint tdNum',
			width: 100
		} //-1余额-金额
		];


		//数量外币式
		var SHULWAIBColsArr = [{
			data: "vouYear",
			className: 'nowrap isprint tc',
			width: 40,
			render: function (data, type, rowdata, meta) {
				return rowdata.vouYear || rowdata.rq;
			}
			//-25日期-年
		},
		{
			data: "vouMonth",
			className: 'nowrap isprint tc',
			width: 20
		}, //-24日期-月
		{
			data: "vouDay",
			className: 'nowrap isprint tc',
			width: 20
		}, //-23日期-日
		{
			data: "rowType",
			className: 'nowrap isprint',
			width: 100
		}, //-22行类型
		{
			data: "vouGuid",
			className: 'nowrap isprint',
			width: 100,
			render: function(data, type, rowdata, meta) {
				if(data == '' || data == null) {
					data = ''
				}
				return '<span  title="' + data + '">' + data + '</span>'
			}
		}, //-21凭证
		{
			data: "vouNo",
			className: 'nowrap isprint',
			width: 200,
			// render: function(data, type, rowdata, meta) {
			// 	if(data == '' || data == null) {
			// 		data = ''
			// 	}
			// 	return '<span  title="' + data + '">' + data + '</span>'
			// }
		}, //-20凭证字号
		{
			data: "billNo",
			className: 'nowrap isprint',
			width: 150
		}, //-19票据号
		{
			data: "dAccoName",
			className: 'ellipsis isprint',
			width: 200,
			render: function (data, type, rowdata, meta) {
				if (data == '' || data == null) {
					data = ''
				}
				return '<span  title="' + data + '">' + data + '</span>'
			}
		}, //-18对方科目
		{
			data: "descpt",
			className: 'ellipsis isprint',
			width: 200,
			render: function (data, type, rowdata, meta) {
				if (data == '' || data == null) {
					data = ''
				}
				return '<span class="length-overflow" title="' + data + '">' + data + '</span>'
			}
		}, //-17摘要
		{
			data: "dExRate",
			className: 'nowrap isprint tr ',
			width: 100
		}, //-16借方金额-汇率
		{
			data: "dCurrAmt",
			className: 'nowrap isprint tr tdNum',
			width: 100
		}, //-15借方金额-外币
		{
			data: "dPrice",
			className: 'nowrap isprint tr tdNum'
		}, //-14借方金额-单价
		{
			data: "dQty",
			className: 'nowrap isprint tr'
		}, //-13借方金额-数量
		{
			data: "dStadAmt",
			className: 'nowrap isprint tr tdNum',
			width: 100
		}, //-12借方金额-本币
		{
			data: "cExRate",
			className: 'nowrap isprint tr ',
			width: 100
		}, //-11贷方金额-汇率
		{
			data: "cCurrAmt",
			className: 'nowrap tr isprint tdNum',
			width: 100
		}, //-10贷方金额-外币
		{
			data: "cPrice",
			className: 'nowrap isprint tdNum tr'
		}, //-9贷方金额-单价
		{
			data: "cQty",
			className: 'nowrap isprint tr'
		}, //-8贷方金额-数量
		{
			data: "cStadAmt",
			className: 'nowrap tr isprint tdNum',
			width: 100
		}, //-7贷方金额-本币
		{
			data: "drCr",
			className: 'nowrap tc isprint',
		}, //-6方向
		{
			data: "bExRate",
			className: 'nowrap isprint tr'
		}, //-5余额-汇率
		{
			data: "bCurrAmt",
			className: 'nowrap tr isprint tdNum',
			width: 100
		}, //-4余额-外币
		{
			data: "bPrice",
			className: 'nowrap isprint tdNum tr'
		}, //-3余额-单价
		{
			data: "bQty",
			className: 'nowrap isprint tr'
		},//-2余额-数量
		{
			data: "bStadAmt",
			className: 'nowrap tr isprint tdNum',
			width: 100
		}, //-1余额-本币
		];

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
				ufma.post('/gl/api/getLinkJournalFromRedis',{},function(result){
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
							var accObjList = [];
							for(var p in accFilterObj){
								accObjList.push({itemType:p,items:[{code: accFilterObj[p], name:''}]});
							}
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

			//新增表格列，重置表格信息
			setTable: function(liArr, tableData, colArrBase, type) {
				var colArr = [].concat(colArrBase);
				var descpt = $.inArrayJson(colArr, 'data', 'descpt');
				var ipos = $.inArray(descpt, colArr);
				pageLength = ufma.dtPageLength('#glRptJournalTable');
				$('#glRptJournalTable_wrapper').ufScrollBar('destroy');
				page.glRptJournalDataTable.clear().destroy();
				var columnList = [];
				if (type == "SANLAN") {
					page.glRptJournalThead.html('<tr>' + page.SANLANhtml1 + '</tr><tr>' + page.SANLANhtml2 + '</tr>');
					$('#glRptJournalTable tbody').html('');
				} else if (type == "WAIBI") {
					page.glRptJournalThead.html('<tr>' + page.WAIBIhtml1 + '</tr><tr>' + page.WAIBIhtml2 + '</tr>');
					$('#glRptJournalTable tbody').html('');
				} else if (type == "SHULIANG") {
					page.glRptJournalThead.html('<tr>' + page.SHULIANGhtml1 + '</tr><tr>' + page.SHULIANGhtml2 + '</tr>');
					$('#glRptJournalTable tbody').html('');
				} else if (type == "SHULWAIB") {
					page.glRptJournalThead.html('<tr>' + page.SHULWAIBhtml1 + '</tr><tr>' + page.SHULWAIBhtml2 + '</tr>');
					$('#glRptJournalTable tbody').html('');
				}
				var zhaiyaoCol = page.glRptJournalThead.find('.zhaiyaoCol');

				for(var i = liArr.length - 1; i >= 0; i--) {
					zhaiyaoCol.after(ufma.htmFormat('<th rowspan="2"><%=name%></th>', {
						name: liArr[i].itemTypeName
					}));
					var colObj = {};
					colObj.data = $.css2Dom(liArr[i].itemType.toLowerCase()) + "Name";
					colObj.className = "ellipsis isprint";
					colObj.width = 200;
					colObj.render = function(data, type, rowdata, meta) {
						if(data == '' || data == null) {
							data = ''
						}
						return '<span  title="' + data + '">' + data + '</span>'
					}
					if(!$.inArrayJson(colArr, 'data', colObj.data)) {
						colArr.splice(ipos + 1, 0, colObj);
					}

				}
				page.newTable(tableData, colArr, type);
			},

			//表格初始化
			newTable: function(tableData, columnsArr, type) {
				var columnDefsArr = [];
				var colIndex1 = 0; //票据号索引
				var colIndex2 = 0; //对方科目索引
				if(type == "SANLAN") {
					colIndex1 = -7;
					colIndex2 = -6;
					
					columnDefsArr = [{
							"targets": [5], //凭证字号
							"className": "isprint",
							"render": function(data, type, full, meta) {
								if(data != null) {
									if(full.vouGuid != null) {
										return '<span class="turn-vou" title="'+ data +'" data-vouguid="' + full.vouGuid + '">' + data + '</span>';
									} else {
										return data;
									}
								} else {
									return "";
								}
							}
						},
						{
							"targets": hideColArray, //对方科目，凭证id，行类型
							"visible": false
						},
						{
							"targets": [6], //摘要
							"render": function(data, type, full, meta) {
								if(data != null) {
									if(full.vouGuid != null) {
										return '<span data-vouguid="' + full.vouGuid + '">' + data + '</span>';
									} else {
										return data;
									}
								} else {
									return "";
								}
							}
						},
						{
							"targets": [-4, -3, -1], //借方金额，贷方金额，余额
							"className": "tdNum isprint",
							"render": $.fn.dataTable.render.number(',', '.', 2, '')
						},
						{
							"targets": [0, 1, 4, 6, 7, -2], //月，日，凭证字号，摘要，方向
							"className": "isprint"
						}
					];
				} else if (type == "WAIBI") {
					colIndex1 = -13;
					colIndex2 = -12;
					
					columnDefsArr = [{
						"targets": [5], //凭证字号
						"className": "isprint",
						"render": function (data, type, full, meta) {
							if (data != null) {
								if (full.vouGuid != null) {
									return '<span class="turn-vou" title="'+ data +'" data-vouguid="' + full.vouGuid + '">' + data + '</span>';
								} else {
									return data;
								}
							} else {
								return "";
							}
						}
					},
					{
						"targets": hideColArray, //对方科目，凭证字号，行类型
						"visible": false
					},
					{
						"targets": [6], //摘要
						"render": function (data, type, full, meta) {
							if (data != null) {
								if (full.vouGuid != null) {
									return '<span data-vouguid="' + full.vouGuid + '">' + data + '</span>';
								} else {
									return data;
								}
							} else {
								return "";
							}
						}
					},
					{
						"targets": [0, 1, 4, 6, -10, -7, -4, -3], //月，日，凭证字号，摘要，汇率，方向，汇率
						"className": "isprint"
					},
					{
						"targets": [-9, -8, -6, -5, -2, -1], //借方金额-外币，借方金额-本币，贷方金额-外币，贷方金额-本币，余额-外币，余额-本币
						"className": "tdNum isprint",
						"render": $.fn.dataTable.render.number(',', '.', 2, '')
					}
					];
				} else if (type == "SHULIANG") {
					colIndex1 = -13;
					colIndex2 = -12;

					columnDefsArr = [{
						"targets": [5], //凭证字号
						"render": function (data, type, full, meta) {
							if (data != null) {
								if (full.vouGuid != null) {
									return '<span class="turn-vou" title="'+ data +'" data-vouguid="' + full.vouGuid + '">' + data + '</span>';
								} else {
									return data;
								}
							} else {
								return "";
							}
						}
					},
					{
						"targets": hideColArray, //对方科目，凭证字号，行类型
						"visible": false
					},
					{
						"targets": [6], //摘要
						"render": function (data, type, full, meta) {
							if (data != null) {
								if (full.vouGuid != null) {
									return '<span data-vouguid="' + full.vouGuid + '">' + data + '</span>';
								} else {
									return data;
								}
							} else {
								return "";
							}
						}
					},
					{
						"targets": [0, 1, 4, 6, -9, -6, -4, -2], //月，日，凭证字号，摘要，借方金额-数量，贷方金额-数量，方向，余额-数量
						"className": "isprint"
					},
					{
						"targets": [-10, -8, -7, -5, -3, -1], //借方金额-单价，借方金额-金额，贷方金额-单价，贷方金额-金额，余额-单价，余额-金额
						"className": "tdNum isprint",
						"render": $.fn.dataTable.render.number(',', '.', 2, '')
					}
					];
				} else if (type == "SHULWAIB") {
					colIndex1 = -19;
					colIndex2 = -18;

					columnDefsArr = [{
						"targets": [5], //凭证字号
						"render": function (data, type, full, meta) {
							if (data != null) {
								if (full.vouGuid != null) {
									return '<span class="turn-vou" title="'+ data +'" data-vouguid="' + full.vouGuid + '">' + data + '</span>';
								} else {
									return data;
								}
							} else {
								return "";
							}
						}
					},
					{
						"targets": hideColArray, //对方科目，凭证字号，行类型
						"visible": false
					},
					{
						"targets": [6], //摘要
						"render": function (data, type, full, meta) {
							if (data != null) {
								if (full.vouGuid != null) {
									return '<span data-vouguid="' + full.vouGuid + '">' + data + '</span>';
								} else {
									return data;
								}
							} else {
								return "";
							}
						}
					},
					{
						"targets": [0, 1, 4, 6, -16, -13, -11, -8, -6, -5, -2], //月，日，凭证字号，摘要，汇率，方向，汇率
						"className": "isprint"
					},
					{
						"targets": [-15, -14, -12, -10, -9, -7, -4, -3, -1], //借方金额-外币，借方金额-本币，贷方金额-外币，贷方金额-本币，余额-外币，余额-本币
						"className": "tdNum isprint",
						"render": $.fn.dataTable.render.number(',', '.', 2, '')
					}
					];
				}
				var id = "glRptJournalTable"; //表格id
				var toolBar = $('#' + id).attr('tool-bar');
				page.glRptJournalDataTable = page.glRptJournalTable.DataTable({
					"language": {
						"url": bootPath + "agla-trd/datatables/datatable.default.js"
					},
					"autoWidth": false,
					"bDestory": true,
					"data": tableData.list,
					"processing": true, //显示正在加载中
					// "pagingType": "full_numbers", //分页样式
					// "lengthChange": true, //是否允许用户自定义显示数量p
					// "lengthMenu": [
					// 	[20, 50, 100, 200, "全部"]
					// ],
					// "pageLength": pageLength,
					"paging": false,
					"serverSide": false,
					"ordering": false,
					"columns": columnsArr,
					"columnDefs": columnDefsArr,
					"dom": '<"printButtons"B>rt<"' + id + '-paginate"ilp>',
					//"dom":'r<"tableBox"t><"'+id+'-paginate"ilp>',
					//"dom": '<"printButtons"B>rt<"tableBox"><"tableBottom"<"tool-bar-body"<"ufma-tool-btns"><"info"<"' + id + '-paginate"ilp>>>><"tableBottomFix"<"tool-bar-body"<"ufma-tool-btns"><"info"<"' + id + '-paginate"ilp>>>>',
					"buttons": [{
						extend: 'excelHtml5',
						text: '<i class="glyphicon icon-upload" aria-hidden="true"></i>',
						exportOptions: {
							columns: '.isprint',
							format: {
								header: function(data, columnIdx) {
									console.log(page.printHead)
									var thisHead = $.inArrayJson(page.printHead, 'index', columnIdx);
									if($(data).length == 0) {
										return thisHead.pTitle + data;
									} else {
										return thisHead.pTitle + $(data)[0].innerHTML;
									}
								}
							}
						},
						customize: function(xlsx) {
							var sheet = xlsx.xl.worksheets['sheet1.xml'];
						}
					}],
					"initComplete": function() {
						//批量操作toolbar与分页
						$("#printTableData").html("");
						$("#printTableData").append($(".printButtons"));

						$("#printTableData .buttons-excel").css("border-radius", "0 4px 4px 0").addClass("btn-export btn-permission").attr({
							"data-toggle": "tooltip",
							"title": "导出"
						});
						//使用该方法导出的数据前后没有空格,但需要导出全部必须将翻页选择到"全部" guohx  20190709
						//导出begin
						$("#printTableData .buttons-excel").off().on('click', function(evt) {
							evt = evt || window.event;
							evt.preventDefault();
							$("div#printTableBox").show();
						});
						$("div#printTableBox").hover(function() {
							$("div#printTableBox").show();
						}, function() {
							$("div#printTableBox").hide();
						});
						// 导出本页
						$("#printTablePage").off().on('click', function(evt) {
							evt = evt || window.event;
							evt.preventDefault();
							uf.expTable({
								title:'明细账',
								topInfo:[
									['单位：'+rpt.nowAgencyCode+' '+rpt.nowAgencyName + ' （账套：'+rpt.nowAcctCode+' '+rpt.nowAcctName + '）'],
									['期间：'+$("#dateStart").getObj().getValue()+'至'+$("#dateEnd").getObj().getValue() + " （单位：元）"],
									['科目：'+$('input[id="ACCO-data-key"]').val()],
									['方案名称：'+$("#nowPrjName").html()]
								],
								exportTable: '#' + id
							});
							// ufma.expXLSForDatatable($('#' + id), '明细账');
						});
						// 导出全部
						$("#printTableAll").off().on('click', function(evt) {
							ufma.showloading('正在导出数据，请耐心等待...');
							page.queryTable(true, function(tableData) { // 导出全部时要先查一次全部数据再请求导出接口
								ufma.showloading('正在导出数据，请耐心等待...');
								if(tableData.list.length == 0){
									ufma.showTip("没有数据需要导出");
									ufma.hideloading();
									return;
								} else {
									tableData.list[0].dw = '单位：' + rpt.nowAgencyCode+' '+rpt.nowAgencyName + ' （账套：'+rpt.nowAcctCode+' '+rpt.nowAcctName + '）';
									tableData.list[0].qj = '期间：'+$("#dateStart").getObj().getValue()+'至'+$("#dateEnd").getObj().getValue() + " （单位：元）";
									tableData.list[0].accoInfo = '科目：' + $('input[id="ACCO-data-key"]').val();
									tableData.list[0].prjName = '方案名称：' + $("#nowPrjName").html();
								}
								var tabArgu = rpt.backTabArgu();
								// ----------以下是修改部分-----------------------------
								// 对方科目和票据号的是否导出的依据
								page.changeCol.forEach(function(item,index){
									if (item.visible){
										tabArgu.prjContent.qryItems.unshift(
											{
												isGradsum: "0",
												isShowItem: "1",
												itemDir: "",
												itemLevel: "-1",
												itemPos: "condition",
												itemType: item.code,
												itemTypeName: item.title,  // billNo
												items: [],
												seq: 0
											}
										)

									}
								})
								// 改变字段名称，因为后端对字段有特殊处理
                                var list = tableData.list.map(function(item,index){
									item.dacconameName = item.dAccoName
									item.billnoName = item.billNo
									
                                    return item
								})
								var datas =	[
									{
										"GL_RPT_PRINT": list
									}
								];
								// ----------------以上是修改部分------------------------
								var argu = {
									qryItems: tabArgu.prjContent.qryItems,
									exportData: datas,
									rptTypeName: '明细账',
									rptType: 'glRptJournal'
								}
								var url = "/pub/file/batchExport";
								ufma.post(url,argu,function(rst){
									if(rst.flag == 'success'){
										window.location.href = "/pub/file/download?attachGuid=" + rst.data.attachGuid + '&fileName=' + decodeURI(rst.data.fileName);
									}else{
										ufma.showTip("导出失败",function(){},'fail');
									}
									ufma.hideloading();
								});
							});
						});
						// var topInfo = [['科目：' + $('input[id="ACCO-data-key"]').val()]];
						// $("#printTableData .buttons-excel").off().on('click', function (evt) {
						// 	evt = evt || window.event;
						// 	evt.preventDefault();
						// 	ufma.expXLSForDatatable($('#' + id), '明细账', topInfo, "Multiple");
						// });
						//导出end						
						$('#printTableData.btn-group').css("position", "inherit");
						$('#printTableData div.dt-buttons').css("position", "inherit");
						$('#printTableData [data-toggle="tooltip"]').tooltip();

						page.setVisibleCol();
						page.printHead = rpt.tableHeader(id);

						//驻底begin
						var toolBar = $(this).attr('tool-bar')
						var $info = $(toolBar + ' .info');
						if($info.length == 0) {
							$info = $('<div class="info"></div>').appendTo($(toolBar + ' .tool-bar-body'));
						}
						$info.html('');
						$('.' + id + '-paginate').appendTo($info);

						ufma.isShow(page.reslist);
						ufma.setBarPos($(window));
						//驻底end
						//固定表头
						$("#glRptJournalTable").fixedTableHead($("#glRptJournalDiv"));
						// CWYXM-16875：【20200430 财务云8.20.15】mysql 明细账查询,当选了四个辅助项查询时,必须拖动某一个要素才能在下方显示横向滚动条
						page.glRptJournalDataTable.columns.adjust().draw();

						//金额区间-范围筛选
						rpt.twoSearch(page.glRptJournalTable);
						// 点击表格行高亮
						rpt.tableTrHighlight();
					},
					"drawCallback": function(settings) {
						ufma.dtPageLength($(this));
						// UI相关-颜色：合计行的背景色置为灰色
						$("#" + id).find("tbody tr").each(function() {
							var rowData = page.glRptJournalDataTable.row($(this)).data();
							if(!$.isNull(rowData)) {
								if(rowData.rowType == "4" || rowData.rowType == "5" || rowData.rowType == "7") {
									$(this).css({
										"background-color": "#f0f0f0"
									})
								}
							}
						})

						page.headArr = rpt.tableHeader(id);
						
						page.glRptJournalTable.find("td.dataTables_empty").text("")
							.append('<img src="' + bootPath + 'images/noData.png"/><br/><i>目前还没有你要查询的数据</i>');

						$(".tableBox").css({
							"overflow-x": "auto"
						});

						if($(".rpt-table-sub-tip2 i").text() == "万元" && !$(".tdNum").hasClass("wanyuan")) {
							$("td.tdNum").each(function() {
								if($(this).text() != "") {
									var num = $(this).text().replace(/\,/g, "");
									$(this).text(rpt.comdify(parseFloat(num / 10000).toFixed(6)));
								}
								$(this).addClass("wanyuan");
							})
						}

						//摘要-模糊单项筛选
						rpt.oneSearch(page.glRptJournalTable);

						//金额区间-范围筛选
						// rpt.twoSearch(page.glRptJournalTable);

						//显示/隐藏筛选框
						rpt.isShowFunnelBox();

						//弹出详细凭证
						$(rpt.namespace).find("td span.turn-vou").on("click", function() {
							rpt.openVouShow(this, "glRptJournal");
						})
						
						$('#glRptJournalTable_wrapper').ufScrollBar({
							hScrollbar: true,
							mousewheel: false
						});
						
						$('#glRptJournalTable').tblcolResizable();
						$("#glRptJournalTable").fixedTableHead($("#glRptJournalDiv"));
						ufma.setBarPos($(window));
						setTimeout(function(){
							ufma.isShow(page.reslist);
							$(window).scrollTop($(window).scrollTop()+1)
						},300);

						// 修改为后端分页
						$("#glRptJournal .ufma-table-paginate").empty();
						if(!$.isNull(tableData)){
							var paging = tableData;
							uf.backendPaging(paging,"glRptJournal",serachData);
						}
					}
				});
				return page.glRptJournalDataTable;
			},

			//设置隐藏列盒子内容
			setVisibleCol: function() {
				var nowHead = page.headArr;
				if(!nowHead) {
					return false;
				}
				var changeHead = [];
				var html = "";
				for(var i = 0; i < nowHead.length; i++) {
					if(nowHead[i].title == "票据号" || nowHead[i].title == "对方科目") {
						changeHead.push(nowHead[i]);
						var h = ufma.htmFormat('<p><label class="mt-checkbox mt-checkbox-outline">' +
							'<input type="checkbox" data-code="<%=code%>" data-index="<%=index%>"><%=title%>' +
							'<span></span>' +
							'</label></p>', {
								title: nowHead[i].title,
								index: i,
								code: nowHead[i].code
							});
						html += h;
					}
				}
				$("#colList").html(html);
				page.changeCol = changeHead;
			},
			getcloumsData:function(){
				var data = []
				for(var i=0;i<$("#showColSet table tbody tr").length;i++){
					if($("#showColSet table tbody tr").eq(i).find('input').is(':checked')){
						var code=tf($("#showColSet table tbody tr").eq(i).find('td').eq(0).attr('data-code'))+'Name'
						var name=$("#showColSet table tbody tr").eq(i).find('td').eq(0).attr('data-name')
						data.push({
							title:name,
							key:code
						})
					}
				}
				return data
			},
			//初始化页面
			initPage: function() {
				//增加筛选框
				$(rpt.namespace + " #SANLAN .thTitle.rpt-th-zhaiyao-5").after($(rpt.backOneSearchHtml("摘要内容", "8")));
				$(rpt.namespace + " #SANLAN .thTitle.rpt-th-jine3-4").after($(rpt.backTwoSearchHtml("rpt-funnelBoxNum", "金额区间", "-4")));
				$(rpt.namespace + " #SANLAN .thTitle.rpt-th-jine3-3").after($(rpt.backTwoSearchHtml("rpt-funnelBoxNum3", "金额区间", "-3")));
				$(rpt.namespace + " #SANLAN .thTitle.rpt-th-jine3-1").after($(rpt.backTwoSearchHtml("rpt-funnelBoxNum3", "金额区间", "-1")));

				$(rpt.namespace + " #WAIBI .thTitle.rpt-th-zhaiyao-11").after($(rpt.backOneSearchHtml("摘要内容", "-11")));
				$(rpt.namespace + " #WAIBI .thTitle.rpt-th-jine3-9").after($(rpt.backTwoSearchHtml("rpt-funnelBoxNum", "金额区间", "-9")));
				$(rpt.namespace + " #WAIBI .thTitle.rpt-th-jine3-8").after($(rpt.backTwoSearchHtml("rpt-funnelBoxNum", "金额区间", "-8")));
				$(rpt.namespace + " #WAIBI .thTitle.rpt-th-jine3-6").after($(rpt.backTwoSearchHtml("rpt-funnelBoxNum3", "金额区间", "-6")));
				$(rpt.namespace + " #WAIBI .thTitle.rpt-th-jine3-5").after($(rpt.backTwoSearchHtml("rpt-funnelBoxNum3", "金额区间", "-5")));
				$(rpt.namespace + " #WAIBI .thTitle.rpt-th-jine3-2").after($(rpt.backTwoSearchHtml("rpt-funnelBoxNum3", "金额区间", "-2")));
				$(rpt.namespace + " #WAIBI .thTitle.rpt-th-jine3-1").after($(rpt.backTwoSearchHtml("rpt-funnelBoxNum3", "金额区间", "-1")));

				$(rpt.namespace + " #SHULIANG .thTitle.rpt-th-zhaiyao-11").after($(rpt.backOneSearchHtml("摘要内容", "-11")));
				$(rpt.namespace + " #SHULIANG .thTitle.rpt-th-jine3-8").after($(rpt.backTwoSearchHtml("rpt-funnelBoxNum3", "金额区间", "-8")));
				$(rpt.namespace + " #SHULIANG .thTitle.rpt-th-jine3-5").after($(rpt.backTwoSearchHtml("rpt-funnelBoxNum3", "金额区间", "-5")));
				$(rpt.namespace + " #SHULIANG .thTitle.rpt-th-jine3-1").after($(rpt.backTwoSearchHtml("rpt-funnelBoxNum3", "金额区间", "-1")));

				$(rpt.namespace + " #SHULWAIB .thTitle.rpt-th-zhaiyao-17").after($(rpt.backOneSearchHtml("摘要内容", "-17")));
				$(rpt.namespace + " #SHULWAIB .thTitle.rpt-th-jine3-15").after($(rpt.backTwoSearchHtml("rpt-funnelBoxNum3", "金额区间", "-15")));
				$(rpt.namespace + " #SHULWAIB .thTitle.rpt-th-jine3-12").after($(rpt.backTwoSearchHtml("rpt-funnelBoxNum3", "金额区间", "-12")));
				$(rpt.namespace + " #SHULWAIB .thTitle.rpt-th-jine3-10").after($(rpt.backTwoSearchHtml("rpt-funnelBoxNum3", "金额区间", "-10")));
				$(rpt.namespace + " #SHULWAIB .thTitle.rpt-th-jine3-7").after($(rpt.backTwoSearchHtml("rpt-funnelBoxNum3", "金额区间", "-7")));
				$(rpt.namespace + " #SHULWAIB .thTitle.rpt-th-jine3-4").after($(rpt.backTwoSearchHtml("rpt-funnelBoxNum3", "金额区间", "-4")));
				$(rpt.namespace + " #SHULWAIB .thTitle.rpt-th-jine3-1").after($(rpt.backTwoSearchHtml("rpt-funnelBoxNum3", "金额区间", "-1")));

				page.SANLANhtml1 = $("#SANLAN tr").eq(0).html();
				page.SANLANhtml2 = $("#SANLAN tr").eq(1).html();

				page.WAIBIhtml1 = $("#WAIBI tr").eq(0).html();
				page.WAIBIhtml2 = $("#WAIBI tr").eq(1).html();

				page.SHULIANGhtml1 = $("#SHULIANG tr").eq(0).html();
				page.SHULIANGhtml2 = $("#SHULIANG tr").eq(1).html();

				page.SHULWAIBhtml1 = $("#SHULWAIB tr").eq(0).html();
				page.SHULWAIBhtml2 = $("#SHULWAIB tr").eq(1).html();

				//需要根据自己页面写的ID修改
				page.glRptJournalTable = $('#glRptJournalTable'); //当前table的ID
				page.glRptJournalThead = $('#glRptJournalThead'); //当前table的头部ID

				//默认三栏式表格
				var tableData = [];
				$('#glRptJournalTable tbody').html('');
				page.glRptJournalThead.html('<tr>' + page.SANLANhtml1 + '</tr><tr>' + page.SANLANhtml2 + '</tr>');
				hideColArray = [3, 4, 6,7];
				page.glRptJournalDataTable = page.newTable(tableData, SANLANColsArr, "SANLAN");

				//初始化单位样式
				rpt.initAgencyList();

				//初始化账套样式
				rpt.initAcctList();

				//请求单位列表
				rpt.reqAgencyList();
				
				// 账表数据范围选择框记忆上次选择的数据
				rpt.getSysRuleSet();

				$("#accList1,#accList2,#accList3,#accList4,#accList5").ufCombox({
					idField: "accItemCode",
					textField: "accItemName",
					placeholder: "请选择",
                    readonly: true,
					onChange: function(sender, data) {
						var raun = true;
						var senderid = sender.attr("id")
						if($("#" + senderid).getObj().getText() != '请选择') {
							for(var i = 1; i < 6; i++) {
								if($("#accList" + i).getObj().getValue() == $("#" + senderid).getObj().getValue() && $("#" + senderid).getObj().getText() != '请选择' && senderid != 'accList' + i) {
									raun = false
									ufma.showTip("请勿选择重复辅助项", function() {}, "warning");
									$("#" + senderid).getObj().setValue("", "请选择")
								}
							}
							if(raun) {
								rpt.accHtml(sender, data)
							}
						} else {
							rpt.accHtml(sender, data)
						}
						dm.showItemCol();
						page.resetTableHeight();
					},
					onComplete: function(sender) {

					}
				});

				//请求查询条件其他选项列表
				rpt.reqOptList();

				//检查是否是从其他页面联查打开的
				//字符串下滑线转驼峰
				function strTransform(str) {
					str = str.toLowerCase();
					var re = /_(\w)/g;
					str = str.replace(re, function ($0, $1) {
						return $1.toUpperCase();
					});
					return str;
				};

				function queryJournal(key) {
					var arguStr = sessionStorage.getItem(key);
					var tabArgu = JSON.parse(arguStr);
					selectAccaCode = (tabArgu && tabArgu.prjContent) ? tabArgu.prjContent.accaCode : '';
					var qryItems = (tabArgu && tabArgu.prjContent) ? tabArgu.prjContent.qryItems : [];
					// setTimeout(function() {
					// 	var endDate = JSON.parse(sessionStorage.getItem(rpt.journalFormBal)).prjContent.endDate
					// 	var startDate = JSON.parse(sessionStorage.getItem(rpt.journalFormBal)).prjContent.startDate
					// 	var end = endDate.split('-')
					// 	var start = startDate.split('-')
					// 	if(start[1] == end[1]) {
					// 		$('#dateBq').trigger('click')
					// 	} else {
					// 		$('#dateBn').trigger('click')
					// 	}
					// })

					if(tabArgu && tabArgu.rowData) {
						//重新整理辅助项 S 点击表格中具体某一行,跳转到明细表后只能显示此行所带有的辅助项查询条件，所以需要将此行的信息整理到辅助项条件中
						for(var i = 0; i < qryItems.length; i++) {
							var itemType = qryItems[i].itemType;
							var itemCode = strTransform(itemType) + "Code";
							var itemName = strTransform(itemType) + "Name";
							if(tabArgu.rowData[itemCode] === "" || tabArgu.rowData[itemCode] === "null" || tabArgu.rowData[itemCode] === null || tabArgu.rowData[itemCode] === undefined) {
								// qryItems[i].items = [];
								qryItems[i].items = qryItems[i].items;
							} else {
								qryItems[i].items = [];
								var code = tabArgu.rowData[itemCode],
									name = tabArgu.rowData[itemCode]+ ' ' +tabArgu.rowData[itemName];
								if(name.substr(0, code.length) != code) {
									name = code + ' ' + name;
								}
								var obj = {
									code: code,
									name: name
								};
								qryItems[i].items.push(obj);
							}

						}
						//重新整理辅助项 E
					}

					//单位账套
					if (tabArgu) {
						rpt.cbAgency.val(tabArgu.agencyCode);
						setTimeout(function() {
							$("#cbAcct").ufmaCombox2().val(tabArgu.acctCode)
							setTimeout(function() {
								var qryItems = tabArgu.prjContent.qryItems;
								for(var i = 0; i < qryItems.length; i++) {
									qryItems[i].itemPos = "condition";
								}
								var aa = JSON.stringify(tabArgu.prjContent);
								var prjCont = {
									data: {
										prjContent: aa
									}
								};
								rpt.showPrjCont(prjCont);
	
								$("a[name='period']").each(function () {
									if($(this).attr("id") == tabArgu.timeBtn) {
										$(this).addClass("selected").siblings("a").removeClass("selected");
									}
								});
								// 格式和币种
								$('#formatType').attr('data-type', tabArgu.prjContent.formatType);
								$('#formatType').text(tabArgu.prjContent.formatTypeVal);
								$("#geshi").val(tabArgu.prjContent.formatType);
								if (tabArgu.prjContent.currencyType) {
									$(".rpt-table-sub-tip-currency").show();
									$("#currencyType").attr("data-type", tabArgu.prjContent.currencyType);
									$("#currencyType").text(tabArgu.prjContent.currencyTypeVal).show();
									$(".rpt-table-sub-tip-currency").find("select").val(tabArgu.prjContent.currencyType);
								}
	
								$("#glRptJournal-query").trigger("click");
							}, 500);
						}, 500);
					}
				}
				ufma.showloading('正在请求数据，请耐心等待...');

				var isLoaded = setInterval(function() {
					if(rpt.journalLoaded) {
						clearInterval(isLoaded);
						var myDataFrom = rpt.GetQueryString("dataFrom");
						if(myDataFrom != null && myDataFrom.toString().length > 1) {
							myDataFrom = rpt.GetQueryString("dataFrom");
						}
						if(myDataFrom == "glRptLedger") {
							var key = rpt.journalFormLedger;
							queryJournal(key);
						} else if(myDataFrom == "glLedger") {
							var key = rpt.journalFormGlLedger;
							queryJournal(key);
						} else if(myDataFrom == "glRptBal") {
							var key = rpt.journalFormBal;
							queryJournal(key);
						} else if(myDataFrom == "glRptGlBal") {
							var key = rpt.journalFormGlBal;
							queryJournal(key);
						} else if(myDataFrom == "vou") {
							var key = "journalFormVou";
							queryJournal(key);
							$(".rpt-query-btn-cont-date .btn").eq(0).removeClass("btn-primary").addClass("btn-default");
							$(".rpt-query-btn-cont-date .btn").eq(1).addClass("btn-primary").removeClass("btn-default");
							$(".rpt-query-btn-cont-date .btn").eq(2).removeClass("btn-primary").addClass("btn-default");
						} else {
							// ufma.hideloading();   //注释 guohx 没有查询回来就取消掉了遮罩层 20191209
						}
					}
					// ufma.hideloading();  //注释 guohx 没有查询回来就取消掉了遮罩层 20191209
				}, 100);
				// 初始化时取缓存中记录的行数信息
				serachData.pageSize = parseInt(localStorage.getItem("glRptJournalPageSize")) ? parseInt(localStorage.getItem("glRptJournalPageSize")) : 100;
			},

			onEventListener: function() {
				$("#rpt-query-pzzh").on('change',function(){
					rpt.vouTypeCode = $("#rpt-query-pzzh").val();
				});
				$("#accList1,#accList2,#accList3,#accList4,#accList5").find('span.icon-close').on('click', function() {
					page.resetTableHeight();
				});
		
				$(".label-more").on("click", function () {
					var timeId = setTimeout(function () {
						clearTimeout(timeId);
						//金额区间-范围筛选
						rpt.twoSearch(page.glRptJournalTable);
						page.resetTableHeight();
						// 点击更多的时候将表内滚动到顶部，然后在固定表头
						$("#glRptJournalDiv").scrollTop(0);
                        $("#glRptJournalTable").fixedTableHead($("#glRptJournalDiv"));
						// page.queryTableTrick()
					}, 300)

				})
				 //zsj---修改bug77802
				 $('#showColSet').mouseout(function() {
				 	dm.curColA = [];
				 	$('#showColSet td').each(function(e) {
				 		var itemType = $(this).attr('data-code');
				 		var itemName = $(this).attr('data-name');
				 		if($('#showColSet tr td[data-code="' + itemType + '"] .isShowCol').is(':checked') && $('#showColSet tr td[data-code="' + itemType + '"] .isSumCol').is(':checked')) {
				 			dm.curColA.push({
				 				itemType: itemType,
				 				isShow: '1',
				 				isSum: '1'
				 			});
				 		} else if($('#showColSet tr td[data-code="' + itemType + '"] .isShowCol').is(':checked') && !$('#showColSet tr td[data-code="' + itemType + '"] .isSumCol').is(':checked')) {
				 			dm.curColA.push({
				 				itemType: itemType,
				 				isShow: '1',
				 				isSum: '0'
				 			});
				 		} else if(!$('#showColSet tr td[data-code="' + itemType + '"] .isShowCol').is(':checked') && $('#showColSet tr td[data-code="' + itemType + '"] .isSumCol').is(':checked')) {
				 			dm.curColA.push({
				 				itemType: itemType,
				 				isShow: '0',
				 				isSum: '1'
				 			});
				 		} else if(!$('#showColSet tr td[data-code="' + itemType + '"] .isShowCol').is(':checked') && !$('#showColSet tr td[data-code="' + itemType + '"] .isSumCol').is(':checked')) {
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
				$(rpt.namespace).find(".change-rpt-type,.rpt-table-sub-tip-currency").on("click", "i", function() {
					$(this).hide();
					$(this).siblings("select").show();
				});
				$(rpt.namespace).find(".rpt-table-sub-tip-currency").on("change", "select", function() {
					var tableData = [];
					$(this).siblings("i").attr("data-type", $(this).val());
					$(this).hide();
					$(this).siblings("i").text($(this).find("option:checked").text()).show();
					pageLength = ufma.dtPageLength('#glRptJournalTable');
					$('#glRptJournalTable_wrapper').ufScrollBar('destroy');
					page.glRptJournalDataTable.clear().destroy();
					var nowTabType = $(".change-rpt-type i").attr("data-type");
					if (nowTabType == "WAIBI") {
						page.glRptJournalThead.html('<tr>' + page.WAIBIhtml1 + '</tr><tr>' + page.WAIBIhtml2 + '</tr>');
						$('#glRptJournalTable tbody').html('');
						page.glRptJournalDataTable = page.newTable(tableData, WAIBIColsArr, "WAIBI");
					} else if (nowTabType == "SHULWAIB") {
						page.glRptJournalThead.html('<tr>' + page.SHULWAIBhtml1 + '</tr><tr>' + page.SHULWAIBhtml2 + '</tr>');
						$('#glRptDlyJounalTable tbody').html('');
						page.glRptJournalDataTable = page.newTable( tableData,SHULWAIBColsArr, "SHULWAIB");
					}
				});
				$(rpt.namespace).find(".change-rpt-type").on("change", "select", function() {
					for(var i = 0; i < fixedArr.length; i++) {
						fixedArr[i].checked = false;
					}
					pageLength = ufma.dtPageLength('#glRptJournalTable');
					$('#glRptJournalTable_wrapper').ufScrollBar('destroy');
					page.glRptJournalDataTable.clear().destroy();
					var columnsArr = [];
					var tableData = [];
					$(this).siblings("i").attr("data-type", $(this).val());
					if($(this).val() == "SANLAN") {
						hideColArray = [3, 4, 6,7];
						page.glRptJournalThead.html('<tr>' + page.SANLANhtml1 + '</tr><tr>' + page.SANLANhtml2 + '</tr>');
						$('#glRptJournalTable tbody').html('');
						columnsArr = SANLANColsArr;
						$(".rpt-table-sub-tip-currency").hide();
					} else if ($(this).val() == "WAIBI") {
						hideColArray = [3, 4, 6, 7];
						page.glRptJournalThead.html('<tr>' + page.WAIBIhtml1 + '</tr><tr>' + page.WAIBIhtml2 + '</tr>');
						$('#glRptJournalTable tbody').html('');
						columnsArr = WAIBIColsArr;
						$(".rpt-table-sub-tip-currency").show();
					} else if ($(this).val() == "SHULIANG") {
						hideColArray = [3, 4, 6, 7];
						page.glRptJournalThead.html('<tr>' + page.SHULIANGhtml1 + '</tr><tr>' + page.SHULIANGhtml2 + '</tr>');
						$('#glRptJournalTable tbody').html('');
						columnsArr = SHULIANGColsArr;
						$(".rpt-table-sub-tip-currency").hide();
					} else if ($(this).val() == "SHULWAIB") {
						hideColArray = [3, 4, 6, 7];
						page.glRptJournalThead.html('<tr>' + page.SHULWAIBhtml1 + '</tr><tr>' + page.SHULWAIBhtml2 + '</tr>');
						$('#glRptJournalTable tbody').html('');
						columnsArr = SHULWAIBColsArr;
						$(".rpt-table-sub-tip-currency").show();
					}

					page.glRptJournalDataTable = page.newTable(tableData, columnsArr, $(this).val());
					$(this).hide();
					$(this).siblings("i").text($(this).find("option:checked").text()).show();
					// 切换表头时，搜索数据
					page.queryTable();
				});

				//期间单选按钮组
				rpt.raidoBtnGroup("rpt-query-btn-cont-date");
				//按钮提示
				rpt.tooltip();
				//展开更多查询
				//rpt.queryBoxMore();

				//绑定日历控件
				var glRptLedgerDate = {
					format: 'yyyy-mm',
					viewMode: 'month',
					initialDate: new Date(),
					onChange: function (fmtDate) {
						// rpt.checkDate(fmtDate, "#dateStart")
					}
				};
				var glRptLedgerDateEnd = {
					format: 'yyyy-mm',
					viewMode: 'month',
					initialDate: new Date(),
					onChange: function (fmtDate) {
						// rpt.checkDate(fmtDate, "#dateEnd")
					}
				};
				$("#dateStart").ufDatepicker(glRptLedgerDate);
				$("#dateEnd").ufDatepicker(glRptLedgerDateEnd);
				rpt.dateBenQi("dateStart", "dateEnd");

				//选择期间，改变日历控件的值
				$(rpt.namespace + " #dateBq").on("click", function() {
					rpt.dateBenQi("dateStart", "dateEnd");
				});
				$(rpt.namespace + " #dateBn").on("click", function() {
					rpt.dateBenNian("dateStart", "dateEnd");
				});
				// $(rpt.namespace + " #dateJr").on("click", function() {
				// 	rpt.dateToday("dateStart", "dateEnd");
				// });

				//打开-保存查询方案模态框
				rpt.openSaveMethodModal()

				//确认-保存查询方案
				$('#sureSaveMethod,#saveAs').on('click', function(e) {
					if($("#methodName").val().trim() != "") {
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

				/*	zsj---修改bug77802
				 * $(rpt.namespace).on("click", ".isShowCol", function() {
					if(!$(this).prop("checked")) {
						$(this).parent("label").siblings().find(".isSumCol").removeAttr("checked");
					}
				});
				$(rpt.namespace).on("click", ".isSumCol", function() {
					if($(this).prop("checked")) {
						$(this).parent("label").siblings().find(".isShowCol").prop("checked", true);
					}
				})
*/
				//展开隐藏共享查询方案
				//rpt.showHideShareMethod();

				//搜索隐藏显示--表格模糊搜索
				// rpt.searchHideShow(page.glRptJournalTable);
				ufma.searchHideShow(page.glRptJournalTable);

				//显示更多查询方案
				//rpt.showMoreMethod();

				//显示/隐藏列隐藏框
				$(rpt.namespace).on("click", "#colAction", function(evt) {
					evt.stopPropagation();
					$("#colList input").each(function(i) {
						$(this).prop("checked", page.changeCol[i].visible);
					});

					$("div.rpt-funnelBox").hide();
					$(this).next("div.rpt-funnelBox").show();
				})

				//确认添加列
				$("#addCol").on("click", function(evt) {
					evt.stopPropagation();
					$("#colList label").each(function(i) {
						page.changeCol[i].visible = $(this).find("input").prop("checked");
						var nn = $(this).find("input").data("index");
						if(hideColArray.indexOf(nn)>=0){
							hideColArray.remove(nn);
						}						
						if($(this).find("input").is(":checked")) {
							page.glRptJournalDataTable.column(nn).visible(true);
							$(page.glRptJournalDataTable.settings()[0].aoColumns[nn].nTh).addClass("isprint");
						} else {
							if(hideColArray.indexOf(nn)==-1){
								hideColArray.push(nn);
							}
							page.glRptJournalDataTable.column(nn).visible(false);
							$(page.glRptJournalDataTable.settings()[0].aoColumns[nn].nTh).removeClass("isprint");
						}
					});
					page.glRptJournalDataTable.columns.adjust().draw();
					//固定表头
					$("#glRptJournalTable").fixedTableHead($("#glRptJournalDiv"));
				});

				// 修改为后端分页
				//分页尺寸下拉发生改变
				$(".ufma-table-paginate").on("change", ".vbPageSize", function () {
					pageLength = ufma.dtPageLength('#glRptJournalTable', $(".ufma-table-paginate").find(".vbPageSize").val());
					serachData.pageSize = $(".ufma-table-paginate").find(".vbPageSize").val();
					$(".vbDataSum").html("");
					$("#glRptJournalTable tbody").html('');
					$("#tool-bar .slider").remove();
					$(".ufma-table-paginate").html("");
					page.queryTable();
				});

				//点击页数按钮
				$(".ufma-table-paginate").on("click", ".vbNumPage", function () {
					if ($(this).find("a").length != 0) {
						serachData.currentPage = $(this).find("a").attr("data-gopage");
						serachData.pageSize = $(".ufma-table-paginate").find(".vbPageSize").val();
						$(".vbDataSum").html("");
						$("#glRptJournalTable tbody").html('');
						$("#tool-bar .slider").remove();
						$(".ufma-table-paginate").html("");
						page.queryTable();
					}
				});

				//点击上一页
				$(".ufma-table-paginate").on("click", ".vbPrevPage", function () {
					if (!$(".ufma-table-paginate .vbPrevPage").hasClass("disabled")) {
						serachData.currentPage = $(this).find("a").attr("data-prevpage");
						serachData.pageSize = $(".ufma-table-paginate").find(".vbPageSize").val();
						$(".vbDataSum").html("");
						$("#glRptJournalTable tbody").html('');
						$("#tool-bar .slider").remove();
						$(".ufma-table-paginate").html("");
						page.queryTable();
					}
				});

				//点击下一页
				$(".ufma-table-paginate").on("click", ".vbNextPage", function () {
					if (!$(".ufma-table-paginate .vbNextPage").hasClass("disabled")) {
						serachData.currentPage = $(this).find("a").attr("data-nextpage");
						serachData.pageSize = $(".ufma-table-paginate").find(".vbPageSize").val();
						$(".vbDataSum").html("");
						$("#glRptJournalTable tbody").html('');
						$(".ufma-tool-btns").html('');
						$(".ufma-table-paginate").html("");
						page.queryTable();
					}
				});

				//查询明细表
				var isBtnClick = true; // CWYXM-11903 双击两次查询查询结果为空
				$("#glRptJournal-query").on("click", function() {
					//控制查询日期--zsj
					if (new Date($('#dateStart').getObj().getValue()).getFullYear() !== new Date($('#dateEnd').getObj().getValue()).getFullYear()) {
						ufma.hideloading();
						ufma.showTip('请选择一个年度内的日期查询！', function() {}, 'error');
						return false;
					}
					if($('#dateStart').getObj().getValue() > $('#dateEnd').getObj().getValue()) {
						ufma.hideloading();
						ufma.showTip('开始日期不能大于结束日期！', function() {}, 'error');
						return false;
					}
					if (!$.isNull($('input[name="stadAmtFrom"]').val()) && !$.isNull($('input[name="stadAmtTo"]').val())) {
						var moneyfrom = $('input[name="stadAmtFrom"]').val().replace(/,/g, "");
						var moneyto = $('input[name="stadAmtTo"]').val().replace(/,/g, "");
						if (parseFloat(moneyfrom) > parseFloat(moneyto)) {
							ufma.hideloading();
							ufma.showTip('开始金额不能大于结束金额！', function () { }, 'error');
							return false;
						}
					}
					serachData.currentPage = 1; // 点击查询时切到第一页
					if (isBtnClick) {
						isBtnClick = false;
						setTimeout(function() {
							isBtnClick = true;
						}, 1000);
						page.queryTable();
					}
				})

				/*与bug75982问题2相同，故一并修改--zsj
				 * $(".rpt-p-search-key").find("input").on("blur", function() {
					$(this).val("");
				})*/

				//打印
//				$(".btn-print").on("click", function() {
//					var printTableType = $(".change-rpt-type i").attr("data-type");
//					// console.log(printTableType);
//					rpt.rptPrint("glRptJournal", "glRptJournalTable", printTableType);
//				})
				$(".btn-print").off().on('click', function() {
					page.editor = ufma.showModal('tableprint', 450, 350);
					$('#rptStyle').html('')
					var searchFormats = {};
					searchFormats.agencyCode = rpt.nowAgencyCode;
					searchFormats.acctCode = rpt.nowAcctCode;
					searchFormats.componentId = 'GL_RPT_JOURNAL';
					ufma.post("/gl/GlRpt/RptFormats",searchFormats,function(result){
						var data = result.data;
						for(var i=0;i<data.length;i++){
							var $op = $('<option value="'+data[i].rptFormat+'">'+data[i].rptFormatName+'</option>');
							$('#rptStyle').append($op);
						}
						$('#rptStyle').val("SANLAN");
						var postSetData = {
							agencyCode: rpt.nowAgencyCode,
							acctCode: rpt.nowAcctCode,
							componentId: $('#rptType option:selected').val(),
							rgCode:pfData.svRgCode,
							setYear:pfData.svSetYear,
							sys:'100',
							directory:'明细账'+$('#rptStyle option:selected').text()
						};
//						ufma.post("/pqr/api/report?sys=100",postSetData,function(result){
//							var data = result.data;
//							$('#rptTemplate').html('')
//							for(var i=0;i<data.length;i++){
//								var jData =data[i].reportCode
//								$op = $('<option value="'+jData+'">'+data[i].reportName+'</option>');
//								$('#rptTemplate').append($op);
//							}
//						});
						$.ajax({
							type: "POST",
							url: "/pqr/api/templ",
							dataType: "json",
							data: postSetData,
							success: function(data) {
								var data = data.data;
								$('#rptTemplate').html('')
								for(var i = 0; i < data.length; i++) {
									var jData = data[i].reportCode
									$op = $('<option templId = '+data[i].templId+' valueid="' + data[i].reportCode + '" value="' + jData + '">' + data[i].reportName + '</option>');
									$('#rptTemplate').append($op);
								}
							},
							error: function() {}
						});
					});
				});
				$("#btn-printyun").off().on("click", function () {
					var postSetData = {
						reportCode:'GL_RPT_JOURNAL_SANLAN',
						templId:'*'
					}
					if($("#geshi").find("option:selected").attr('value')=="SHULIANG"){
						postSetData.reportCode='GL_RPT_JOURNAL_SHULIANG'
					}else if($("#geshi").find("option:selected").attr('value')=="WAIBI"){
						postSetData.reportCode='GL_RPT_JOURNAL_WAIBI'
					}else if($("#geshi").find("option:selected").attr('value')=="SHULWAIB"){
						postSetData.reportCode='GL_RPT_JOURNAL_SLWB'
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
							var obj1 = {
								condCode: "stadAmtFrom",
								condName: "金额起",
								condText: $("input[name=stadAmtFrom]").val(),
								condValue: $("input[name=stadAmtFrom]").val()
							}
							tabArgu.prjContent.rptCondItem.push(obj1);
							var obj2 = {
								condCode: "stadAmtTo",
								condName: "金额止",
								condText: $("input[name=stadAmtTo]").val(),
								condValue: $("input[name=stadAmtTo]").val()
							}
							tabArgu.prjContent.rptCondItem.push(obj2);
							// 添加凭证字号类型字段参数
							tabArgu.prjContent.vouTypeCode = $("#rpt-query-pzzh").val();
							if(selectAccaCode != null){
								tabArgu.prjContent.accaCode = selectAccaCode;
							}
							var runNum = data.data.rowNum
							ufma.ajaxDef('/gl/rpt/getReportPrintCloudData/GL_RPT_JOURNAL', "post", tabArgu, function (result) {
								var outTableData = {}
								outTableData.agency= rpt.nowAgencyCode+' '+rpt.nowAgencyName
								outTableData.times = $("#dateStart").getObj().getValue()+'至'+$("#dateEnd").getObj().getValue()
								outTableData.acco = $('input[id="ACCO-data-key"]').val()
								outTableData.printor = rpt.nowUserName
								outTableData.startPage = 1
								outTableData.logo = '/pf/pub/css/logo.png'
								outTableData.date = rpt.today
								outTableData.title = '明细账'
								outTableData.showWatermark = true
								var pagelen = result.data.tableData.length
								outTableData.totalPage= Math.ceil(pagelen/runNum)
								result.data.outTableData = outTableData
								result.data.tableHead = {"drColumns":page.getcloumsData()}
								var html = YYPrint.engine(medata.template,medata.meta, result.data);
								YYPrint.print(html)
							})
						},
						error: function() {}
					});
				})
				$('#rptStyle').on('change', function() {
					var postSetData = {
						agencyCode: rpt.nowAgencyCode,
						acctCode: rpt.nowAcctCode,
						componentId: $('#rptType option:selected').val(),
						rgCode:pfData.svRgCode,
						setYear:pfData.svSetYear,
						sys:'100',
						directory:'明细账'+$('#rptStyle option:selected').text()
					};
//					ufma.post("/pqr/api/report?sys=100",postSetData,function(result){
//						var data = result.data;
//						$('#rptTemplate').html('')
//						for(var i=0;i<data.length;i++){
//							var jData =data[i].reportCode
//							$op = $('<option value="'+jData+'">'+data[i].reportName+'</option>');
//							$('#rptTemplate').append($op);
//						}
//					});
					$.ajax({
						type: "POST",
						url: "/pqr/api/templ",
						dataType: "json",
						data: postSetData,
						success: function(data) {
							var data = data.data;
							$('#rptTemplate').html('')
							for(var i = 0; i < data.length; i++) {
								var jData = data[i].reportCode
								$op = $('<option templId = '+data[i].templId+' valueid="' + data[i].reportCode + '" value="' + jData + '">' + data[i].reportName + '</option>');
								$('#rptTemplate').append($op);
							}
						},
						error: function() {}
					});
				})
				$("#btn-tableprintsave").off().on('click', function() {
					var oTable = $('#glRptJournalTable').dataTable();
					var tblData = oTable.fnGetData()
					for(var i=0;i<tblData.length;i++){
						if(tblData[i].km == '*'){
							tblData[i].km =$("#ACCO-data-key").val()
						}
					}
					var ztitle ={} 
					for(var i=0;i<$("#showColSet table tbody tr").length;i++){
						if($("#showColSet table tbody tr").eq(i).find('input').is(':checked')){
							var code=tf($("#showColSet table tbody tr").eq(i).find('td').eq(0).attr('data-code'))+'Name'
							var name=$("#showColSet table tbody tr").eq(i).find('td').eq(0).attr('data-name')
							ztitle[code] = name
						}
					} 
					
					var j=1;
					var ntitle ={}
					for(var z in ztitle){
						ntitle['ext'+ j +'Name'] = ztitle[z]
						for(var i=0;i<tblData.length;i++){
							tblData[i]['accItemExt'+j] = tblData[i][z]
						}
						j++
					}
					ufma.printForPTPdf({
						valueid: $('#rptTemplate option:selected').attr('valueid'),
						templId: $('#rptTemplate option:selected').attr('templId'),
						print: 'blank',
						data: { data: [tblData] },
						headData: [ntitle]
					})
					page.editor.close();
				});
				$("#btn-tableprintqx").off().on('click', function() {
					page.editor.close();
				})
			},

			queryTable: function(flag, callback) {
				ufma.showloading('正在请求数据，请耐心等待...');
				if($('#dateStart').getObj().getValue() > $('#dateEnd').getObj().getValue()) {
					ufma.hideloading();
					ufma.showTip('开始日期不能大于结束日期！', function() {}, 'error');
					return false;
				}
				if (!flag) {
					$("#glRptJournalTable").html('')
				}
				var arr = [];
				for(var i = 1; i < 6; i++) {
					var name = $("#accList" + i).getObj().getText();
					if(name != "请选择" && !$.isNull(name)) {
						arr.push(name);
					}
				}
				var nary = arr.sort();
				for(var i = 0; i < nary.length; i++) {
					if(nary[i] == nary[i + 1]) {
						ufma.hideloading();
						ufma.showTip(nary[i] + "重复了!", function() {}, "warning");
						return false;
					}
				}
				var nowTabType = $(".change-rpt-type i").attr("data-type");

				var tabArgu = rpt.backTabArgu();
				var obj1 = {
					condCode: "stadAmtFrom",
					condName: "金额起",
					condText: $("input[name=stadAmtFrom]").val(),
					condValue: $("input[name=stadAmtFrom]").val()
				}
				tabArgu.prjContent.rptCondItem.push(obj1);
				var obj2 = {
					condCode: "stadAmtTo",
					condName: "金额止",
					condText: $("input[name=stadAmtTo]").val(),
					condValue: $("input[name=stadAmtTo]").val()
				}
				tabArgu.prjContent.rptCondItem.push(obj2);
				// 添加凭证字号类型字段参数
				tabArgu.prjContent.vouTypeCode = $("#rpt-query-pzzh").val();
				if(selectAccaCode != null){
					tabArgu.prjContent.accaCode = selectAccaCode;
				}
				// 修改为后端分页
				tabArgu.prjContent.currPage = parseInt(serachData.currentPage);
				if (flag) {
					tabArgu.prjContent.rowNumber = 99999999;
				} else {
					tabArgu.prjContent.rowNumber = parseInt(serachData.pageSize) ? parseInt(serachData.pageSize) : 99999999; // 没有值时查全部
					// 查询后记录当前选择的行数信息到缓存
					localStorage.removeItem("glRptJournalPageSize");
					localStorage.setItem("glRptJournalPageSize", tabArgu.prjContent.rowNumber);
				}
				//不按方案查询时，记忆其他勾选项情况 guohx 20200806
				if ($.isNull(tabArgu.prjGuid)) {
					rpt.rememberOther(rpt.rptOptionArr(), 'f34f56bd-a122-4f6d-a6b4-28b0068c524b');
				}
				// 查询时，修改方案的查询次数
				rpt.addQryCount(tabArgu.prjGuid);
				// 重新查询方案列表
				rpt.reqPrjList();

				ufma.ajax(portList.getReportPage, "post", tabArgu, function(result) {
					if (flag) { // 不刷新表格 只取结果
						callback(result.data.tablePageInfo);
					} else {
						if(result.flag == 'fail'){
							ufma.showTip(result.msg,function(){},"error");
							return;
						}
						var tableData = result.data.tablePageInfo;
						var showLiArr = rpt.tableColArr();
						 
						tableData_bak = result.data.tablePageInfo; //缓存数据
						showLiArr_bak = rpt.tableColArr()          //缓存数据
						nowTabType_bak = $(".change-rpt-type i").attr("data-type");
						//需要显示的辅助核算项
						if(nowTabType == "SANLAN") {
							page.setTable(showLiArr, tableData, SANLANColsArr, "SANLAN");
							if(showLiArr.length > 1) {
								page.glRptJournalDataTable.columns.adjust().draw();
							}
						} else if(nowTabType == "WAIBI") {
							page.setTable(showLiArr, tableData, WAIBIColsArr, "WAIBI");
							page.glRptJournalDataTable.columns.adjust().draw();
						} else if(nowTabType == "SHULIANG") {
							page.setTable(showLiArr, tableData, SHULIANGColsArr, "SHULIANG");
							page.glRptJournalDataTable.columns.adjust().draw();
						} else if (nowTabType == "SHULWAIB") {
							page.setTable(showLiArr, tableData, SHULWAIBColsArr, "SHULWAIB");
							page.glRptJournalDataTable.columns.adjust().draw();
						}
						ufma.hideloading();
						var year = (new Date($("#dateStart").getObj().getValue())).getFullYear();
						page.setTheadYear(year);
					}
				});
			},
			// 模拟点击，但是不请求数据,使用的是缓存数据
			queryTableTrick: function(flag, callback) {
				ufma.showloading('正在请求数据，请耐心等待...');
				if($('#dateStart').getObj().getValue() > $('#dateEnd').getObj().getValue()) {
					ufma.hideloading();
					ufma.showTip('开始日期不能大于结束日期！', function() {}, 'error');
					return false;
				}
				if (!flag) {
					$("#glRptJournalTable").html('')
				}
				var arr = [];
				for(var i = 1; i < 6; i++) {
					var name = $("#accList" + i).getObj().getText();
					if(name != "请选择" && !$.isNull(name)) {
						arr.push(name);
					}
				}
				var nary = arr.sort();
				for(var i = 0; i < nary.length; i++) {
					if(nary[i] == nary[i + 1]) {
						ufma.hideloading();
						ufma.showTip(nary[i] + "重复了!", function() {}, "warning");
						return false;
					}
				}
				var nowTabType = $(".change-rpt-type i").attr("data-type");

				var tabArgu = rpt.backTabArgu();
				var obj1 = {
					condCode: "stadAmtFrom",
					condName: "金额起",
					condText: $("input[name=stadAmtFrom]").val(),
					condValue: $("input[name=stadAmtFrom]").val()
				}
				tabArgu.prjContent.rptCondItem.push(obj1);
				var obj2 = {
					condCode: "stadAmtTo",
					condName: "金额止",
					condText: $("input[name=stadAmtTo]").val(),
					condValue: $("input[name=stadAmtTo]").val()
				}
				tabArgu.prjContent.rptCondItem.push(obj2);
				// 添加凭证字号类型字段参数
				tabArgu.prjContent.vouTypeCode = $("#rpt-query-pzzh").val();
				if(selectAccaCode != null){
					tabArgu.prjContent.accaCode = selectAccaCode;
				}
				// 修改为后端分页
				tabArgu.prjContent.currPage = parseInt(serachData.currentPage);
				if (flag) {
					tabArgu.prjContent.rowNumber = 99999999;
				} else {
					tabArgu.prjContent.rowNumber = parseInt(serachData.pageSize) ? parseInt(serachData.pageSize) : 99999999; // 没有值时查全部
					// 查询后记录当前选择的行数信息到缓存
					localStorage.removeItem("glRptJournalPageSize");
					localStorage.setItem("glRptJournalPageSize", tabArgu.prjContent.rowNumber);
				}
				//不按方案查询时，记忆其他勾选项情况 guohx 20200806
				if ($.isNull(tabArgu.prjGuid)) {
					rpt.rememberOther(rpt.rptOptionArr(), 'f34f56bd-a122-4f6d-a6b4-28b0068c524b');
				}
				// 查询时，修改方案的查询次数
				// rpt.addQryCount(tabArgu.prjGuid);
				// 重新查询方案列表
				// rpt.reqPrjList();

				setTimeout(function() {
					if (flag) { // 不刷新表格 只取结果
						// callback(result.data.tablePageInfo);
					} else {
						// if(result.flag == 'fail'){
						// 	ufma.showTip(result.msg,function(){},"error");
						// 	return;
						// }
						var tableData = tableData_bak;
						var showLiArr = showLiArr_bak;
						var nowTabType = $(".change-rpt-type i").attr("data-type");
						//需要显示的辅助核算项
						if(nowTabType == "SANLAN") {
							page.setTable(showLiArr, tableData, SANLANColsArr, "SANLAN");
							if(showLiArr.length > 1) {
								page.glRptJournalDataTable.columns.adjust().draw();
							}
						} else if(nowTabType == "WAIBI") {
							page.setTable(showLiArr, tableData, WAIBIColsArr, "WAIBI");
							page.glRptJournalDataTable.columns.adjust().draw();
						} else if(nowTabType == "SHULIANG") {
							page.setTable(showLiArr, tableData, SHULIANGColsArr, "SHULIANG");
							page.glRptJournalDataTable.columns.adjust().draw();
						} else if (nowTabType == "SHULWAIB") {
							page.setTable(showLiArr, tableData, SHULWAIBColsArr, "SHULWAIB");
							page.glRptJournalDataTable.columns.adjust().draw();
						}
						ufma.hideloading();
						var year = (new Date($("#dateStart").getObj().getValue())).getFullYear();
						page.setTheadYear(year);
					}
				},500);
			},
			//修改表头年份
			setTheadYear: function(year) {
				$(".tabDateCol").text(year);
				$(".editYear").attr("parent-title", year + "-");
			},
			// 重新计算表格高度 表内滚动
			resetTableHeight: function () {
				// 表内滚动
				var windowHeight = $(window).height();
				var top = $('.rpt-table-tab').offset().top;
				$('.rpt-table-tab').css("height", windowHeight - top - 3 - 56 - 5);
				$('.rpt-table-tab').css("overflow","auto");
				$('#glRptJournalTable_wrapper').ufScrollBar({
					hScrollbar: true,
					mousewheel: false
				});
				$('#glRptJournalTable').tblcolResizable();
				$("#glRptJournalTable").fixedTableHead($("#glRptJournalDiv"));
				ufma.setBarPos($(window));
			},
			//重构
			initPageNew: function() {
				$('.rpt-method-tip').tooltip();
				$('#showMethodTip').click(function() {
					if($("#rptPlanList").find('li').length == 0) {
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
					onShow: function() {
						dm.showItemCol();
					}
				});
				page.resetTableHeight();
			},
			//此方法必须保留
			init: function() {
				page.setTheadYear(pfData.svSetYear);
				page.reslist = ufma.getPermission();
				this.initPage();
				this.onEventListener();
				this.initPageNew();
				ufma.parseScroll();
				ufma.parse();
			}
		}
	}();

	/////////////////////
	page.init();
	window.rmisFlag = true;
	window.fromRmisShow = page.fromRmisShow;
});