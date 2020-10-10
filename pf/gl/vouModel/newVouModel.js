$(function () {
	window._close = function (state, id, linkId) {
		if (window.closeOwner) {
			var data = {
				action: state,
				id: id,
				linkId: linkId,
				result: {}
			};
			window.closeOwner(data);
		}
	}
	var page = function () {
		var usedDataTable; //引用表格对象
		var vouGroupId;
		var assistItems = window.ownerData.assistItems;
		var assistItemsCnt = {}; //辅助核算项内容
		var modelData;
		var accoCWData;
		var cwTemplateGuid;
		var ysTemplateGuid;
		var serialNumber;
		var accoYSData;
		// var accoProfit; //差异项
		var saveCWKJData = {};
		var saveYSKJData = {};
		return {
			// //获取编辑表格数据  guohx
			getTableData: function (vouGroupId) {
				var callback = function (result) {
					modelData = result.data;

					if (!$.isNull(result.data.cwVouTempVo)) {
						cwTemplateGuid = modelData.cwVouTempVo.templateGuid;
						serialNumber = modelData.cwVouTempVo.serialNumber;
						$('#modelName').val(result.data.cwVouTempVo.templateName); //模板名称
						$('#modelDescp').val(result.data.cwVouTempVo.description); //模板描述
						var cwData = result.data.cwVouTempVo.vouDetailTems;
						for (var i = 0; i < cwData.length; i++) {
							if (!$.isNull(cwData[i].detailAssTems)) {
								var cwDetailArray = [];
								cwDetailArray = cwData[i].detailAssTems[0];
								for (var z in cwData[i].detailAssTems[0]) {
									cwData[i][z] = cwData[i].detailAssTems[0][z];
								}
								delete cwData[i].detailAssTems;
							}
						}
						page.initTable('cwkj-data', cwData);
					} else {
						page.initTable('cwkj-data', []);
					}
					if (!$.isNull(result.data.ysVouTempVo)) {
						ysTemplateGuid = modelData.ysVouTempVo.templateGuid;
						serialNumber = modelData.ysVouTempVo.serialNumber;
						$('#modelName').val(result.data.ysVouTempVo.templateName); //模板名称
						$('#modelDescp').val(result.data.ysVouTempVo.description); //模板描述
						var ysData = result.data.ysVouTempVo.vouDetailTems;
						for (var i = 0; i < ysData.length; i++) {
							if (!$.isNull(ysData[i].detailAssTems)) {
								var ysDetailArray = [];
								ysDetailArray = ysData[i].detailAssTems[0];
								for (var z in ysData[i].detailAssTems[0]) {
									ysData[i][z] = ysData[i].detailAssTems[0][z];
								}
								delete ysData[i].detailAssTems;
							}
						}
						page.initTable('yskj-data', ysData);
					} else {
						page.initTable('yskj-data', []);
					}
				}
				ufma.get("/gl/vouTemp/getTempPair/" + vouGroupId + "/" + window.ownerData.agencyCode + "/" + window.ownerData.acctCode + "/" + window.ownerData.rgCode + "/" + window.ownerData.setYear, {}, callback);
			},
			//获取会计科目  区分财务会计和预算会计
			getCWAccoData: function () {
				var argu = {
					"agencyCode": window.ownerData.agencyCode,
					"setYear": window.ownerData.setYear,
					"acctCode": window.ownerData.acctCode,
					"accsCode": window.ownerData.accsCode,
					"accaCode": "1"
				};
				var callback = function (result) {
					accoCWData = result.data.treeData;
				};
				//系统级没有账套
				ufma.ajaxDef("/gl/sys/coaAcc/getRptAccoTree", "get", argu, callback);
			},
			//预算会计  会计科目
			getYSAccoData: function () {
				var argu = {
					"agencyCode": window.ownerData.agencyCode,
					"setYear": window.ownerData.setYear,
					"acctCode": window.ownerData.acctCode,
					"accsCode": window.ownerData.accsCode,
					"accaCode": "2"
				};
				var callback = function (result) {
					accoYSData = result.data.treeData;
				};
				//系统级没有账套
				ufma.ajaxDef("/gl/sys/coaAcc/getRptAccoTree", "get", argu, callback);
			},
			//获取辅助项内容树
			reqAccItemTreeNew: function () {
				var url = "/gl/vouTemp/getAccAtiem/" + window.ownerData.agencyCode + "/" + window.ownerData.acctCode;
				var argu = {};
				ufma.ajaxDef(url, "get", argu, function (result) {
					assistItemsCnt = result.data.optionData;
				});
			},
			//通过科目获取辅助核算项内容是否可下拉
			getAsiistItemByAcco: function (e) {
				var code = e.itemData.code;
				var url = "/gl/vouTemp/getAccoItem";
				var argu = {
					"agencyCode": window.ownerData.agencyCode,
					"acctCode": window.ownerData.acctCode,
					"accoCode": code
				};
				ufma.ajaxDef(url, "post", argu, function (result) {
					if (!$.isNull(result.data)) {
						if (result.data.length > 0) {
							for (var i = 0; i < result.data.length; i++) {
								// var item = result.data[i].items;
								var item = result.data;
								//初始化所有不可用
								$(e.sender).siblings('.uf-treecombox').addClass('hidden');
								$(e.sender).siblings('.uf-treecombox').find(".inputedit").val(''); //将已经选过的值清空
								for (var j = 0; j < item.length; j++) {
									var cbItem = item[j].accitemCode;
									cbItem = cbItem.toLowerCase();
									cbItem = cbItem.replace('_i', 'I'); //自定义辅助
									var name = cbItem + "CodeName";
									var code = cbItem + "Code";
									//科目启用的辅助核算项移除hide
									// $(e.sender).siblings('.uf-treecombox[name="CHR_CODE"]').removeClass('hidden'); //差异项移除
									$(e.sender).siblings('.uf-treecombox[name="' + code + '"]').removeClass('hidden');
								}
							}
						} else {
							$(e.sender).siblings('.uf-treecombox').addClass('hidden');
						}
					} else {
						$(e.sender).siblings('.uf-treecombox').addClass('hidden');
					}

				});
			},
			//根据科目获取科目盈余
			// getProfitByAcco: function (e) {
			// 	var cbSurp = $(e.sender).siblings('.uf-combox[name="CHR_CODE"]');
			// 	var id = e.itemData.CHR_ID;
			// 	var url = "/gl/vouTemp/getEleSurplusSelective/" + id;
			// 	var argu = {
			// 		"agencyCode": window.ownerData.agencyCode,
			// 		"acctCode": window.ownerData.acctCode
			// 	};
			// 	ufma.ajaxDef(url, "get", argu, function (result) {
			// 		accoProfit = result.data;

			// 		//$(e.sender).siblings('.combox([name="差异项"])').getObj().load(accoProfit); //重新加载差异项列
			// 		cbSurp.removeClass('hidden');
			// 		cbSurp.getObj().load(accoProfit);
			// 	});
			// },
			//初始化表头
			getBudgetHead: function (id) { // 第一个页面表格
				var columns = [];
				var column1 = [ // 支持多表头
					{
						type: 'input',
						field: 'descpt',
						name: '摘要',
						width: 200,
						headalign: 'center',
						render: function (rowid, rowdata, data) {
							if (!data) {
								return "";
							}
							return data;

						}
					}, {
						type: 'combox',
						field: 'drCr',
						name: '借贷',
						width: 80,
						headalign: 'center',
						idField: 'drCr',
						textField: 'namesd',
						pIdField: '',
						data: [{
							"drCr": "1",
							"namesd": "借"
						},
						{
							"drCr": "-1",
							"namesd": "贷"
						}
						],
						render: function (rowid, rowdata, data) {
							if (rowdata.drCr == '1') {
								return '借';
							} else if (rowdata.drCr == '-1') {
								return '贷';
							}
						},
						onChange: function (e) { },
						beforeExpand: function (e) { //下拉框初始化

						}
					},
					{
						type: 'treecombox',
						field: 'accoCode',
						name: '科目',
						width: 200,
						headalign: 'center',
						align: 'left',
						idField: 'id',
						leafRequire: true,
						textField: 'codeName',
						pIdField: 'pId',
						data: (id == "cwkj-data") ? accoCWData : accoYSData,
						render: function (rowid, rowdata, data) {
							if (!data) {
								return '';
							}
							return rowdata.accoCode + ' ' + rowdata.accoName;
						},
						onChange: function (e) {
							// var allowSurplus = e.itemData.allowSurplus;
							var code = e.itemData.code;
							page.getAsiistItemByAcco(e);
							// if (allowSurplus == 1) { //允许编辑差异项
							// 	$(e.sender).siblings('.uf-treecombox[name="CHR_CODE"]').removeClass('hidden'); //差异项
							// 	$(e.sender).siblings('.uf-combox[name="dfDc"]').removeClass('hidden'); //差异项方向
							// 	page.getProfitByAcco(e); //获取盈余
							// } else {
							// 	$(e.sender).siblings('.uf-treecombox[name="CHR_CODE"]').addClass('hidden'); //差异项
							// 	$(e.sender).siblings('.uf-combox[name="dfDc"]').addClass('hidden'); //差异项方向
							// }

						},
						beforeExpand: function (e) { //下拉框初始化
						}
					}
				];
				if (!$.isNull(assistItems)) {
					//for (var i = 0; i < assistItems.length; i++) {
					$.each(assistItems, function (i, item) { //解决 回显render问题 用for会把变量看成全局  
						//var item = assistItems[i];
						var cbItem = item.accItemCode;
						cbItem = cbItem.toLowerCase();
						cbItem = cbItem.replace('_i', 'I'); //自定义辅助
						var name = cbItem + "Name";
						var code = cbItem + "Code";
						if (assistItemsCnt.hasOwnProperty(code)) {
							column1.push({
								type: 'treecombox',
								//field: item.accitemCode,
								field: code,
								name: item.accItemName,
								width: 180,
								headalign: 'center',
								idField: 'id',
								textField: 'codeName',
								pIdField: 'pId',
								data: assistItemsCnt[code],
								render: function (rowid, rowdata, data) {
									if (!data) {
										return '';
									}
									return rowdata[name];
								}
							});
						}
					});
				}
				// column1.push({
				// 	type: 'treecombox',
				// 	field: 'CHR_CODE',
				// 	name: '差异项',
				// 	width: 270,
				// 	headalign: 'center',
				// 	align: 'left',
				// 	idField: 'CHR_CODE',
				// 	textField: 'codeName',
				// 	pIdField: 'pId',
				// 	data: accoProfit,
				// 	render: function (rowid, rowdata, data) {
				// 		if (!rowdata) {
				// 			return '';
				// 		}
				// 		return rowdata.accoSurplusName;
				// 	},
				// 	onChange: function (e) {
				// 	},
				// 	beforeExpand: function (e) { //下拉框初始化
				// 	}
				// });
				// column1.push({
				// 	type: 'combox',
				// 	field: 'dfDc',
				// 	name: '差异项方向',
				// 	width: 90,
				// 	headalign: 'center',
				// 	align: 'left',
				// 	idField: 'dfDc',
				// 	textField: 'namesd',
				// 	pIdField: '',
				// 	data: [{
				// 		"dfDc": "1",
				// 		"namesd": "正向"
				// 	},
				// 	{
				// 		"dfDc": "-1",
				// 		"namesd": "反向"
				// 	}
				// 	],
				// 	render: function (rowid, rowdata, data) {
				// 		if (rowdata.dfDc == '1') {
				// 			return '正向';
				// 		} else if (rowdata.dfDc == '-1') {
				// 			return '反向';
				// 		}
				// 	},
				// 	onChange: function (e) { },
				// 	beforeExpand: function (e) { //下拉框初始化

				// 	}
				// });
				column1.push({
					type: 'toolbar',
					field: 'option',
					name: '操作',
					width: 60,
					headalign: 'center',
					render: function (rowid, rowdata, data) {
						return '<button class="btn btn-delete" rowid="' + rowid + '" data-toggle="tooltip" title="删除"><span class="icon-trash"></span></button>';
					}
				});
				columns.push(column1);
				return columns;
			},
			//保存凭证模板
			save: function () {
				ufma.showloading('正在保存凭证模板，请耐心等待...');
				var cwkjData = $('#cwkj-data').getObj().getData();
				var yskjData = $('#yskj-data').getObj().getData();
				if ((yskjData.length == 0) && (cwkjData.length != 0)) { //后端要求 解析不了多余的参数 传空也不行
					var argu = {
						"cwVouTempVo": saveCWKJData,
						"ysVouTempVo": null
					};
				} else if ((cwkjData.length == 0) && (yskjData.length != 0)) {
					var argu = {
						"cwVouTempVo": null,
						"ysVouTempVo": saveYSKJData
					};
				} else if ((yskjData.length == 0) && (cwkjData.length == 0)) {
					var argu = {
						"cwVouTempVo": null,
						"ysVouTempVo": null
					};
				} else {
					var argu = {
						"cwVouTempVo": saveCWKJData,
						"ysVouTempVo": saveYSKJData
					};
				}

				//最外层数据
				if (cwkjData.length != 0) {
					if (window.ownerData.agencyCode == '*') {
						saveCWKJData.accsCode = window.ownerData.accsCode;
					}
					saveCWKJData.accaCode = "1"; //会计体系
					//不选中节点直接新增 ,保存到自定义模板下面 20190313
					if ($.isNull(window.ownerData.linkId)) {
						saveCWKJData.linkId = 99;
					} else {
						saveCWKJData.linkId = window.ownerData.linkId;
					}
					saveCWKJData.acctCode = window.ownerData.acctCode; //账套
					saveCWKJData.agencyCode = window.ownerData.agencyCode; //单位
					saveCWKJData.isTemp = 'Y'; //是模板
					saveCWKJData.op = "0"; //新增保存传0 编辑保存传1
					saveCWKJData.kwLs = []; //关键字 后端说必须传 传空
					saveCWKJData.rgCode = window.ownerData.rgCode; //区划
					saveCWKJData.vouDesc = cwkjData[0].descpt;
					saveCWKJData.descpt = cwkjData[0].descpt;
					saveCWKJData.setYear = window.ownerData.setYear; //年度
					saveCWKJData.templateGuid = ''; //模板ID  新增传空	
					if ($.isNull($('#modelName').val())) {
						ufma.hideloading();
						ufma.showTip("请您先输入模板名称!", function () { }, "warning");
						return false;
					} else {
						saveCWKJData.templateName = $('#modelName').val(); //模板名称
					}
					saveCWKJData.description = $('#modelDescp').val(); //模板描述
					saveCWKJData.vouGroupId = "";
					saveCWKJData.vouGuid = "";
					saveCWKJData.vouDetailTems = [];
					for (var i = 0; i < cwkjData.length; i++) {
						var CWKJDetls = [];
						var CWKJVouDetls = {};
						CWKJVouDetls.accoCode = cwkjData[i].accoCode;
						CWKJVouDetls.accoName = cwkjData[i].codeName;
						CWKJVouDetls.vouDesc = cwkjData[i].descpt;
						CWKJVouDetls.descpt = cwkjData[i].descpt;
						CWKJVouDetls.detailGuid = ""; //一行对应一个ID
						CWKJVouDetls.drCr = cwkjData[i].drCr;
						CWKJVouDetls.dfDc = cwkjData[i].dfDc;
						CWKJVouDetls.accaCode = "1";
						CWKJVouDetls.isTemp = "Y";
						CWKJVouDetls.acctCode = window.ownerData.acctCode;
						CWKJVouDetls.agencyCode = window.ownerData.agencyCode;
						CWKJVouDetls.op = 0;
						CWKJVouDetls.rgCode = window.ownerData.rgCode;
						CWKJVouDetls.setYear = window.ownerData.setYear;
						// CWKJVouDetls.accoSurplus = cwkjData[i].CHR_CODE; //差异项
						CWKJVouDetls.vouGuid = "";
						var CWKJAssls = [];
						cwkjData[i].accaCode = "1";
						cwkjData[i].acctCode = window.ownerData.acctCode;
						cwkjData[i].agencyCode = window.ownerData.agencyCode;
						cwkjData[i].detailAssGuid = "";
						cwkjData[i].detailGuid = "";
						cwkjData[i].drCr = cwkjData[i].drCr;
						cwkjData[i].op = 0;
						cwkjData[i].rgCode = window.ownerData.rgCode;
						cwkjData[i].setYear = window.ownerData.setYear;
						cwkjData[i].vouGuid = "";
						if ($.isNull(cwkjData[i].accoCode)) {
							ufma.hideloading();
							ufma.showTip("请您先输入科目!", function () { }, "warning");
							return false;
						}
						if ($.isNull(cwkjData[i].drCr)) {
							ufma.hideloading();
							ufma.showTip("请您先输入借贷方向!", function () { }, "warning");
							return false;
						}
						if ($.isNull(cwkjData[i].descpt)) {
							ufma.hideloading();
							ufma.showTip("请您先输入摘要!", function () { }, "warning");
							return false;
						}
						delete cwkjData[i].namesd;
						delete cwkjData[i].id;
						delete cwkjData[i].codeName;
						delete cwkjData[i].dfDc;
						var delStr = [];
						delStr = Object.keys(cwkjData[i]);
						for (var j = 0; j < delStr.length; j++) {
							if (((delStr[j].indexOf("Code") != -1)) && (cwkjData[i][delStr[j]] == "")) { //辅项为空的不能传  删掉了
								var delString = delStr[j].replace(/\"/g, "");
								delete cwkjData[i][delString];
							}
						}
						CWKJAssls.push(cwkjData[i]);
						CWKJVouDetls.detailAssTems = CWKJAssls;
						saveCWKJData.vouDetailTems.push(CWKJVouDetls);
					}
				}
				if (yskjData.length != 0) {
					//预算会计保存
					if (window.ownerData.agencyCode == '*') {
						saveYSKJData.accsCode = window.ownerData.accsCode;
					}
					saveYSKJData.accaCode = "2"; //会计体系
					if ($.isNull(window.ownerData.linkId)) {
						saveYSKJData.linkId = 99;
					} else {
						saveYSKJData.linkId = window.ownerData.linkId;
					}
					saveYSKJData.acctCode = window.ownerData.acctCode; //账套
					saveYSKJData.agencyCode = window.ownerData.agencyCode; //单位
					saveYSKJData.isTemp = 'Y'; //是模板
					saveYSKJData.op = 0;
					saveYSKJData.kwLs = []; //关键字 后端说必须传 传空
					saveYSKJData.rgCode = window.ownerData.rgCode; //区划
					saveYSKJData.vouDesc = yskjData[0].descpt;
					saveYSKJData.descpt = yskjData[0].descpt;
					saveYSKJData.setYear = window.ownerData.setYear; //年度
					saveYSKJData.templateGuid = ''; //模板ID  新增传空
					if ($.isNull($('#modelName').val())) {
						ufma.hideloading();
						ufma.showTip("请您先输入模板名称!", function () { }, "warning");
						return false;
					} else {
						saveYSKJData.templateName = $('#modelName').val(); //模板名称
					}
					saveYSKJData.description = $('#modelDescp').val(); //模板描述
					saveYSKJData.vouGroupId = "";
					saveYSKJData.vouGuid = "";
					saveYSKJData.vouDetailTems = [];
					for (var i = 0; i < yskjData.length; i++) {
						var YSKJDetls = [];
						var YSKJVouDetls = {};
						YSKJVouDetls.accoCode = yskjData[i].accoCode;
						YSKJVouDetls.vouDesc = yskjData[i].descpt;
						YSKJVouDetls.descpt = yskjData[i].descpt;
						YSKJVouDetls.accoName = yskjData[i].codeName;
						YSKJVouDetls.detailGuid = ""; //一行对应一个ID
						YSKJVouDetls.drCr = yskjData[i].drCr;
						YSKJVouDetls.dfDc = yskjData[i].dfDc;
						YSKJVouDetls.accaCode = "2";
						YSKJVouDetls.acctCode = window.ownerData.acctCode;
						YSKJVouDetls.agencyCode = window.ownerData.agencyCode;
						YSKJVouDetls.op = 0;
						YSKJVouDetls.rgCode = window.ownerData.rgCode;
						YSKJVouDetls.setYear = window.ownerData.setYear;
						// YSKJVouDetls.accoSurplus = yskjData[i].CHR_CODE; //差异项
						YSKJVouDetls.vouGuid = "";
						var YSKJAssls = [];
						yskjData[i].accaCode = "2";
						yskjData[i].acctCode = window.ownerData.acctCode;
						yskjData[i].agencyCode = window.ownerData.agencyCode;
						yskjData[i].detailAssGuid = "";
						yskjData[i].detailGuid = "";
						yskjData[i].drCr = yskjData[0].drCr;
						yskjData[i].op = 0;
						yskjData[i].rgCode = window.ownerData.rgCode;
						yskjData[i].setYear = window.ownerData.setYear;
						yskjData[i].vouGuid = "";
						if ($.isNull(yskjData[i].accoCode)) {
							ufma.hideloading();
							ufma.showTip("请您先输入科目!", function () { }, "warning");
							return false;
						}
						if ($.isNull(yskjData[i].drCr)) {
							ufma.hideloading();
							ufma.showTip("请您先输入借贷方向!", function () { }, "warning");
							return false;
						}
						if ($.isNull(yskjData[i].descpt)) {
							ufma.hideloading();
							ufma.showTip("请您先输入摘要!", function () { }, "warning");
							return false;
						}
						delete yskjData[i].namesd;
						delete yskjData[i].id;
						delete yskjData[i].codeName;
						delete yskjData[i].dfDc;
						var delStr = [];
						delStr = Object.keys(yskjData[i]);
						for (var j = 0; j < delStr.length; j++) {
							if (((delStr[j].indexOf("Code") != -1)) && (yskjData[i][delStr[j]] == "")) { //辅项为空的不能传  删掉了
								var delString = delStr[j].replace(/\"/g, "");
								delete yskjData[i][delString];
							}
						}
						YSKJAssls.push(yskjData[i]);
						YSKJVouDetls.detailAssTems = YSKJAssls;
						saveYSKJData.vouDetailTems.push(YSKJVouDetls);
					}
				}

				var callback = function (result) {
					if (result.flag == "success") {
						ufma.hideloading();
						ufma.showTip("保存成功！", function () {
							if (!$.isNull(result.data.cwVouTempVo)) {
								var vouGroundSaved = result.data.cwVouTempVo.vouGroupId;
								var linkId = result.data.cwVouTempVo.linkId;
							} else {
								var vouGroundSaved = result.data.ysVouTempVo.vouGroupId;
								var linkId = result.data.cwVouTempVo.linkId;
							}
							_close('ok', vouGroundSaved, linkId);
						}, "success");

					} else {
						ufma.showTip("保存失败！", function () {
							_close('ok', "", "");
						}, "error");
					}
				}
				ufma.post("/gl/vouTemp/savePair", argu, callback);
				// setTimeout(function () {
				// 	$('#btn-save').removeClass('disabled')
				// 	ufma.hideloading()
				// }, 5000)
			},
			//编辑保存
			saveEdit: function () {
				ufma.showloading('正在保存凭证模板，请耐心等待...');
				var cwkjData = $('#cwkj-data').getObj().getData();
				var yskjData = $('#yskj-data').getObj().getData();
				if ((window.ownerData.agencyCode != '*') && (window.ownerData.nodeAgency)) {
					tempSource = 'sys';
				} else {
					tempSource = 'basal';
				}
				if ((yskjData.length == 0) && (cwkjData.length != 0)) { //后端要求 解析不了多余的参数 传空也不行
					var argu = {
						"cwVouTempVo": saveCWKJData,
						"ysVouTempVo": null,
						"tempSource": tempSource //  basal/sys 模板来源，基础资料/系统管理

					};
				} else if ((cwkjData.length == 0) && (yskjData.length != 0)) {
					var argu = {
						"cwVouTempVo": null,
						"ysVouTempVo": saveYSKJData,
						"tempSource": tempSource
					};
				} else if ((yskjData.length == 0) && (cwkjData.length == 0)) {
					var argu = {
						"cwVouTempVo": null,
						"ysVouTempVo": null,
						"tempSource": tempSource
					};
				} else {
					var argu = {
						"cwVouTempVo": saveCWKJData,
						"ysVouTempVo": saveYSKJData,
						"tempSource": tempSource
					};
				}

				//最外层数据
				if (cwkjData.length != 0) {
					if (window.ownerData.agencyCode == '*') {
						saveCWKJData.accsCode = window.ownerData.accsCode;
					}
					saveCWKJData.accaCode = "1"; //会计体系
					saveCWKJData.linkId = window.ownerData.linkPId;
					saveCWKJData.acctCode = window.ownerData.acctCode; //账套
					saveCWKJData.agencyCode = window.ownerData.agencyCode; //单位
					saveCWKJData.isTemp = 'Y'; //是模板
					saveCWKJData.op = "0"; //新增保存传0 编辑保存传1
					saveCWKJData.kwLs = []; //关键字 后端说必须传 传空
					saveCWKJData.rgCode = window.ownerData.rgCode; //区划
					saveCWKJData.vouDesc = cwkjData[0].descpt;
					saveCWKJData.descpt = cwkjData[0].descpt;
					saveCWKJData.setYear = window.ownerData.setYear; //年度
					saveCWKJData.templateGuid = ''; //模板ID  新增传空
					saveCWKJData.oldTemplateGuid = cwTemplateGuid;
					if ($.isNull($('#modelName').val())) {
						ufma.hideloading();
						ufma.showTip("请您先输入模板名称!", function () { }, "warning");
						return false;
					} else {
						saveCWKJData.templateName = $('#modelName').val(); //模板名称
					}
					saveCWKJData.description = $('#modelDescp').val(); //模板描述
					saveCWKJData.vouGroupId = page.vouGroupId;
					saveCWKJData.serialNumber = serialNumber;
					saveCWKJData.vouGuid = "";
					saveCWKJData.vouDetailTems = [];
					for (var i = 0; i < cwkjData.length; i++) {
						var CWKJDetls = [];
						var CWKJVouDetls = {};
						CWKJVouDetls.accoCode = cwkjData[i].accoCode;
						CWKJVouDetls.accoName = cwkjData[i].codeName;
						CWKJVouDetls.vouDesc = cwkjData[i].descpt;
						CWKJVouDetls.descpt = cwkjData[i].descpt;
						CWKJVouDetls.detailGuid = ""; //一行对应一个ID
						CWKJVouDetls.drCr = cwkjData[i].drCr;
						CWKJVouDetls.dfDc = cwkjData[i].dfDc;
						CWKJVouDetls.accaCode = "1";
						CWKJVouDetls.isTemp = "Y";
						CWKJVouDetls.acctCode = window.ownerData.acctCode;
						CWKJVouDetls.agencyCode = window.ownerData.agencyCode;
						CWKJVouDetls.op = 0;
						CWKJVouDetls.rgCode = window.ownerData.rgCode;
						CWKJVouDetls.setYear = window.ownerData.setYear;
						// CWKJVouDetls.accoSurplus = cwkjData[i].CHR_CODE; //差异项
						CWKJVouDetls.vouGuid = "";
						var CWKJAssls = [];
						cwkjData[i].accaCode = "1";
						cwkjData[i].acctCode = window.ownerData.acctCode;
						cwkjData[i].agencyCode = window.ownerData.agencyCode;
						cwkjData[i].detailAssGuid = "";
						cwkjData[i].detailGuid = "";
						cwkjData[i].drCr = cwkjData[i].drCr;
						cwkjData[i].op = 0;
						cwkjData[i].rgCode = window.ownerData.rgCode;
						cwkjData[i].setYear = window.ownerData.setYear;
						cwkjData[i].vouGuid = "";
						if ($.isNull(cwkjData[i].accoCode)) {
							ufma.hideloading();
							ufma.showTip("请您先输入科目!", function () { }, "warning");
							return false;
						}
						if ($.isNull(cwkjData[i].drCr)) {
							ufma.hideloading();
							ufma.showTip("请您先输入借贷方向!", function () { }, "warning");
							return false;
						}
						if ($.isNull(cwkjData[i].descpt)) {
							ufma.hideloading();
							ufma.showTip("请您先输入摘要!", function () { }, "warning");
							return false;
						}
						delete cwkjData[i].namesd;
						delete cwkjData[i].id;
						delete cwkjData[i].codeName;
						delete cwkjData[i].dfDc;
						delete cwkjData[i].detailAssTems;
						var delStr = [];
						delStr = Object.keys(cwkjData[i]);
						for (var j = 0; j < delStr.length; j++) {
							if (((delStr[j].indexOf("Code") != -1)) && (cwkjData[i][delStr[j]] == "")) { //辅项为空的不能传  删掉了
								var delString = delStr[j].replace(/\"/g, "");
								delete cwkjData[i][delString];
							}
						}
						CWKJAssls.push(cwkjData[i]);
						CWKJVouDetls.detailAssTems = CWKJAssls;
						saveCWKJData.vouDetailTems.push(CWKJVouDetls);
					}
				}
				if (yskjData.length != 0) {
					//预算会计保存
					if (window.ownerData.agencyCode == '*') {
						saveYSKJData.accsCode = window.ownerData.accsCode;
					}
					saveYSKJData.accaCode = "2"; //会计体系
					saveYSKJData.linkId = window.ownerData.linkPId;
					saveYSKJData.acctCode = window.ownerData.acctCode; //账套
					saveYSKJData.agencyCode = window.ownerData.agencyCode; //单位
					saveYSKJData.isTemp = 'Y'; //是模板
					saveYSKJData.op = 0;
					saveYSKJData.kwLs = []; //关键字 后端说必须传 传空
					saveYSKJData.rgCode = window.ownerData.rgCode; //区划
					saveYSKJData.vouDesc = yskjData[0].descpt;
					saveYSKJData.descpt = yskjData[0].descpt;
					saveYSKJData.setYear = window.ownerData.setYear; //年度
					saveYSKJData.templateGuid = ''; //模板ID  新增传空
					saveYSKJData.oldTemplateGuid = ysTemplateGuid;
					if ($.isNull($('#modelName').val())) {
						ufma.hideloading();
						ufma.showTip("请您先输入模板名称!", function () { }, "warning");
						return false;
					} else {
						saveYSKJData.templateName = $('#modelName').val(); //模板名称
					}
					saveYSKJData.description = $('#modelDescp').val(); //模板描述
					saveYSKJData.vouGroupId = page.vouGroupId;
					saveYSKJData.serialNumber = serialNumber;
					saveYSKJData.vouGuid = "";
					saveYSKJData.vouDetailTems = [];
					for (var i = 0; i < yskjData.length; i++) {
						var YSKJDetls = [];
						var YSKJVouDetls = {};
						YSKJVouDetls.accoCode = yskjData[i].accoCode;
						YSKJVouDetls.vouDesc = yskjData[i].descpt;
						YSKJVouDetls.descpt = yskjData[i].descpt;
						YSKJVouDetls.accoName = yskjData[i].codeName;
						YSKJVouDetls.detailGuid = ""; //一行对应一个ID
						YSKJVouDetls.drCr = yskjData[i].drCr;
						YSKJVouDetls.dfDc = yskjData[i].dfDc;
						YSKJVouDetls.accaCode = "2";
						YSKJVouDetls.acctCode = window.ownerData.acctCode;
						YSKJVouDetls.agencyCode = window.ownerData.agencyCode;
						YSKJVouDetls.op = 0;
						YSKJVouDetls.rgCode = window.ownerData.rgCode;
						YSKJVouDetls.setYear = window.ownerData.setYear;
						// YSKJVouDetls.accoSurplus = yskjData[i].CHR_CODE; //差异项
						YSKJVouDetls.vouGuid = "";
						var YSKJAssls = [];
						yskjData[i].accaCode = "2";
						yskjData[i].acctCode = window.ownerData.acctCode;
						yskjData[i].agencyCode = window.ownerData.agencyCode;
						yskjData[i].detailAssGuid = "";
						yskjData[i].detailGuid = "";
						yskjData[i].drCr = yskjData[0].drCr;
						yskjData[i].op = 0;
						yskjData[i].rgCode = window.ownerData.rgCode;
						yskjData[i].setYear = window.ownerData.setYear;
						yskjData[i].vouGuid = "";
						if ($.isNull(yskjData[i].accoCode)) {
							ufma.hideloading();
							ufma.showTip("请您先输入科目!", function () { }, "warning");
							return false;
						}
						if ($.isNull(yskjData[i].drCr)) {
							ufma.hideloading();
							ufma.showTip("请您先输入借贷方向!", function () { }, "warning");
							return false;
						}
						if ($.isNull(yskjData[i].descpt)) {
							ufma.hideloading();
							ufma.showTip("请您先输入摘要!", function () { }, "warning");
							return false;
						}
						delete yskjData[i].namesd;
						delete yskjData[i].id;
						delete yskjData[i].codeName;
						delete yskjData[i].dfDc;
						delete yskjData[i].detailAssTems;
						var delStr = [];
						delStr = Object.keys(yskjData[i]);
						for (var j = 0; j < delStr.length; j++) {
							if (((delStr[j].indexOf("Code") != -1)) && (yskjData[i][delStr[j]] == "")) { //辅项为空的不能传  删掉了
								var delString = delStr[j].replace(/\"/g, "");
								delete yskjData[i][delString];
							}
						}
						YSKJAssls.push(yskjData[i]);
						YSKJVouDetls.detailAssTems = YSKJAssls;
						saveYSKJData.vouDetailTems.push(YSKJVouDetls);
					}
				}

				var callback = function (result) {
					if (result.flag == "success") {
						ufma.hideloading();
						ufma.showTip("保存成功！", function () {
							if (!$.isNull(result.data.cwVouTempVo)) {
								var vouGroundSaved = result.data.cwVouTempVo.vouGroupId;
								var linkId = result.data.cwVouTempVo.linkId;

							} else {
								var vouGroundSaved = result.data.ysVouTempVo.vouGroupId;
								var linkId = result.data.cwVouTempVo.linkId;
							}
							_close('ok', vouGroundSaved, linkId);
						}, "success");

					} else {
						ufma.showTip("保存失败！", function () {
							_close('ok', "", "");
						}, "error");
					}
				}
				ufma.post("/gl/vouTemp/savePair", argu, callback);
				// setTimeout(function () {
				// 	$('#btn-save').removeClass('disabled')
				// 	ufma.hideloading();
				// }, 5000)
			},

			//初始化表格
			initTable: function (id, data) {
				$('#' + id).ufDatagrid({
					data: data,
					disabled: false, // 可选择
					columns: page.getBudgetHead(id),
					initComplete: function (options, data) {

						ufma.isShow(page.reslist);
					},
				});
				if (window.ownerData.action == "add") {
					var obj = $('#' + id).getObj(); // 取对象
					var newId = obj.add();

				}
				if (!$.isNull(modelData)) {
					if ((id == "cwkj-data") && ($.isNull(modelData.cwVouTempVo)) && (window.ownerData.action == "edit")) {
						var obj = $('#cwkj-data').getObj(); // 取对象
						var newId = obj.add();
					}
					if ((id == "yskj-data") && ($.isNull(modelData.ysVouTempVo)) && (window.ownerData.action == "edit")) {
						var obj = $('#yskj-data').getObj(); // 取对象
						var newId = obj.add();
					}
				}

			},
			initPage: function () {
				var centerH = $('.ufma-layout-up').outerHeight(true) - 138;
				console.log(centerH);
				$('.workspace-center').css({ height: centerH + 'px', 'overflow': 'auto' });
				page.reqAccItemTreeNew();
				page.vouGroupId = window.ownerData.modelId;
				page.getCWAccoData(); //财务会计会计科目
				page.getYSAccoData(); //预算会计会计科目
				if (window.ownerData.action == "edit") {
					page.getTableData(page.vouGroupId);
				} else if (window.ownerData.action == "add") {
					page.initTable('cwkj-data', []);
					page.initTable('yskj-data', []);
				}
			},
			onEventListener: function () {
				$('#btn-save').click(function () {
					$("#btn-save").attr("disabled", true);
					if (window.ownerData.action == "add") {
						page.save();
					} else if (window.ownerData.action == "edit") {
						page.saveEdit();
					}
					var timeId = setTimeout(function () {
						$("#btn-save").attr("disabled", false);
						clearTimeout(timeId);
					}, 5000);
				});
				$('#btn-cancle').click(function () {
					_close('no', "", "");
				});
				$('#btnNewCW').click(
					function () {
						var obj = $('#cwkj-data').getObj(); // 取对象
						var newId = obj.add();
						obj.edit(newId);
						$('.uf-grid-table-edit[rowid="' + newId + '"]').find('input[name="descpt"]').focus();
					}
				)
				$('#btnNewYS').click(
					function () {
						var obj = $('#yskj-data').getObj(); // 取对象
						var newId = obj.add();
						obj.edit(newId);
						$('.uf-grid-table-edit[rowid="' + newId + '"]').find('input[name="descpt"]').focus();
					}
				)
				$(document).on('mousedown', '#cwkj-data .btn-delete', function (e) {
					e.stopPropagation();
					var obj = $('#cwkj-data').getObj(); // 取对象
					var rowid = $(this).closest('tr').attr('id');
					obj.del(rowid);
				});
				$(document).on('mousedown', '#yskj-data .btn-delete', function (e) {
					e.stopPropagation();
					var obj = $('#yskj-data').getObj(); // 取对象
					var rowid = $(this).closest('tr').attr('id');
					obj.del(rowid);
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