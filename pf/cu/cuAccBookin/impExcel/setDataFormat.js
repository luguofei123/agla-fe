$(function () {
	window._close = function (action, amtImpType, impScheGuid) {
		if (window.closeOwner) {
			var data = {
				action: action,
				amtImpType: amtImpType,
				impScheGuid: impScheGuid
			};
			window.closeOwner(data);
		}
	}
	var page = function () {
		//银行对账单接口
		var portList = {
			getBankImpScheAss: "/cu/journalImpSche/select",//请求具体数据格式内容
			saveBankImpSche: "/cu/journalImpSche/save",//保存格式方案
			delBankImpSche: "/cu/journalImpSche/deleteByImpScheGuid",//删除格式方案
		};
		var amtImpType = "1";
		return {

			//初始化excel表格
			initEditTable: function (id, data, listData) {
				$('#' + id).ufDatagrid({
					data: data,
					columns: [[
						{ type: 'indexcolumn', name: '序号', width: 58, headalign: 'center', align: 'center' },
						{ field: 'name', name: '字段', headalign: 'center' },
						{
							type: 'combox', field: 'id', name: '数据列', headalign: 'center', align: 'center',
							idField: 'id', textField: 'text', data: listData,
							onChange: function (e) { },
							beforeExpand: function (e) { },
							render: function (rowid, rowdata, data) {
								return rowdata.text;
							}
						}
					]],
					initComplete: function (options, data) {

					}
				});
			},

			//请求扩展字段
			reqExtInput: function (amtImpType) {
				//初始化数据范围表格
				page.dataExcel = [
					{ name: '登账日期', code: 'jouDate', text: '', id: '' },
					{ name: '摘要', code: 'summary', text: '', id: '' },
					{ name: '票据类型', code: 'billtypeCode', text: '', id: '' },
					{ name: '票据号', code: 'billNo', text: '', id: '' }];
				if ((!window.ownerData.isCurrency) && (amtImpType == "1")) {
					page.dataExcel.push({ name: '借贷方向', code: 'drCr', text: '', id: '' });
					page.dataExcel.push({ name: '金额', code: 'money', text: '', id: '' });
				} else if (window.ownerData.isCurrency && (amtImpType == "1")) {
					page.dataExcel.push({ name: '借贷方向', code: 'drCr', text: '', id: '' });
					page.dataExcel.push({ name: '本币金额', code: 'money', text: '', id: '' });
					page.dataExcel.push({ name: '外币金额', code: 'currencyMoney', text: '', id: '' });
					page.dataExcel.push({ name: '汇率', code: 'exchangeRate', text: '', id: '' });
				} else if (window.ownerData.isCurrency && amtImpType == "2") {
					page.dataExcel.push({ name: '本币借方金额', code: 'amtDr', text: '', id: '' });
					page.dataExcel.push({ name: '本币贷方金额', code: 'amtCr', text: '', id: '' });
					page.dataExcel.push({ name: '外币借方金额', code: 'currencyDrMoney', text: '', id: '' });
					page.dataExcel.push({ name: '外币贷方金额', code: 'currencyCrMoney', text: '', id: '' });
					page.dataExcel.push({ name: '汇率', code: 'exchangeRate', text: '', id: '' });
				} else {
					page.dataExcel.push({ name: '借方金额', code: 'amtDr', text: '', id: '' });
					page.dataExcel.push({ name: '贷方金额', code: 'amtCr', text: '', id: '' });
				}
				page.dataExcel.push({ name: '凭证类型', code: 'vouType', text: '', id: '' });
				page.dataExcel.push({ name: '凭证期间', code: 'vouFisPerd', text: '', id: '' });
				page.dataExcel.push({ name: '凭证字号', code: 'vouNo', text: '', id: '' });
				page.dataExcel.push({ name: '支出类型', code: 'type', text: '', id: '' });
				page.dataExcel.push({ name: '资金类型', code: 'cashType', text: '', id: '' });
				page.dataExcel.push({ name: '对方单位', code: 'oppositeUnit', text: '', id: '' });
				page.dataExcel.push({ name: '经办人', code: 'dealWith', text: '', id: '' });
				page.dataExcel.push({ name: '备注', code: 'remark', text: '', id: '' });
				page.dataExcel.push({ name: '是否回单', code: 'isReceipt', text: '', id: '' });
				if (!$.isNull(window.ownerData.accountInfo.needShowAccitem) && !$.isNull(window.ownerData.items)) {
					var needShowAccItem = window.ownerData.accountInfo.needShowAccitem.split(',');
					for (var i = 0; i < needShowAccItem.length; i++) {
						for (var j = 0; j < window.ownerData.items.length; j++) {
							if (needShowAccItem[i] == window.ownerData.items[j].accitemCode) {
								var item = window.ownerData.items[j];
								var cbName = item.eleName;
								var cbItem = item.eleCode;
								var cbCode = item.accitemCode;
								if (!$.isNull(cbItem)) {
									page.dataExcel.push({
										name: cbName,
										code: page.shortLineToTF(cbCode) + 'Code',
										text: '',
										id: ''
									});
								}
							}
						}
					}
				}
				page.excArr = page.dataExcel;//excel数据列
				// if ($.isNull(page.impScheGuid)) {
				page.initEditTable("excelTable", page.dataExcel, page.letterList);
				// }
			},

			//请求具体数据格式，并展示到导入方式
			reqDetailFormat: function (impScheGuid) {
				var argu = {
					impScheGuid: impScheGuid,
					agencyCode: page.agencyCode,
					accountbookGuid: window.ownerData.accountBookGuid
				}
				ufma.ajaxDef(portList.getBankImpScheAss, "get", argu, function (result) {
					var data = result.data[0];
					if (data) {
						$("#infoForm").setForm(data);
						amtImpType = data.amtImpType; //1按借贷方向  2按金额
						page.reqExtInput(amtImpType);
						for (var i = 0; i < page.excArr.length; i++) {
							var code = page.excArr[i].code;
							var text = data[code];
							page.excArr[i].text = data[code];
							var obj = $.inArrayJson(page.letterList, "text", text);
							if (obj) {
								page.excArr[i].id = obj.id;
							}
						}
					}
					page.initEditTable("excelTable", page.excArr, page.letterList);
				})
			},
			//请求辅助核算项
			reqAccItem: function () {
				var needShowAccItem = (window.ownerData.needShowAcc).split(',');
				//动态辅助核算项--begin
				var argu = {
					"acctCode": window.ownerData.acctCode,
					"accoCode": window.ownerData.accoCode,
					"agencyCode": window.ownerData.agencyCode,
					"setYear": window.ownerData.setYear,
					"rgCode": window.ownerData.rgCode
				}
				dm.getAccoFZ(argu, function (result) {
					var itemElecode = [];
					if (result.data != null) {
						items = result.data;
						page.items = items;
						for (var i = 0; i < needShowAccItem.length; i++) {
							for (var j = 0; j < items.length; j++) {
								if (needShowAccItem[i] == items[j].accitemCode) {
									itemElecode.push(items[j])
								}
							}
						}
					}
					var $curRow = $('#planItemMore');
					$curRow.html('');
					for (var i = 0; i < itemElecode.length; i++) {
						var item = itemElecode[i];
						var itemEle = page.shortLineToTF(item.accitemCode) + 'Code';
						if (!$.isNull(itemEle)) {
							$curgroup = $('<div class="form-group" id="' + item.accitemCode + '"style="width:22em;margin-left:0px;margin-top: 10px;"></div>').prependTo($curRow);
							$('<lable class="control-label auto" data-toggle= "tooltip" title="' + item.eleName + '" style="display:inline-block;width:100px;text-align: right;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">' + item.eleName + '：</lable>').appendTo($curgroup);
							var formCtrl = $('<div class="control-element uf-treecombox" id="' + itemEle + '" name="' + itemEle + '"style=" width:190px;margin-left:5px;margin-top:-8px;"></div>').appendTo($curgroup);
							var param = {};

						}
					}

					page.initEditTable("excelTable", page.excArr, page.letterList);
				});
				//动态辅助核算项--end
			},
			//处理字段
			changeField: function (data) {
				for (key in data) {
					if (data[key] == undefined) {
						data[key] = "";
					} else if (data[key].toString().indexOf("-") != "-1") {
						if (data[key].toString().indexOf("undefined") != "-1") {
							data[key] = "";
						} else if (data[key].toString().indexOf("-") == 0 || data[key].toString().indexOf("-") == (data[key].length - 1)) {
							data[key] = "";
						}
					}
				}
				return data;
			},

			//测试文本输入框
			checkInput: function (dom) {
				var flag = true;
				$("." + dom + " input[data-check='required']").each(function () {
					var thisId = $(this).attr("id");
					if ($(this).val() == '') {
						page.showInputHelp(thisId, '<span class="error">该字段不能为空，请输入有效数字！</span>');
						$(this).closest('.form-group').addClass('error');
						flag = false;
					}
				});
				return flag;
			},

			//测试文本输入框
			checkName: function () {
				var flag = true;
				if ($("#impScheName").val() == '') {
					ufma.showTip("方案名称不能为空！", function () {

					}, "warning");
					// ufma.showInputHelp("impScheName", '<span class="error">方案名称不能为空！</span>');
					// $("#impScheName").closest('.form-group').addClass('error');
					flag = false;
				}
				return flag;
			},

			//检查excel表格
			checkExcel: function () {
				var flag = true;
				var data = $("#excelTable").getObj().getData();
				for (var i = 0; i < data.length; i++) {
					if (data[i].text == "") {
						flag = false;
					}
				}
				return flag;
			},

			saveImpSche: function (flag) {
				var flag1 = page.checkName();
				if (!flag1) {
					return false;
				}
				var infoForm = $("#infoForm").serializeObject();
				var arguObj = {};
				arguObj["rgCode"] = page.rgCode;
				arguObj["setYear"] = page.setYear;
				arguObj["agencyCode"] = page.agencyCode;
				arguObj["impScheGuid"] = page.schemaGuid;
				arguObj["impScheName"] = infoForm.impScheName;
				arguObj["accountbookGuid"] = window.ownerData.accountBookGuid;
				if (flag == "new") {
					arguObj["lastVer"] = "";
					arguObj["impScheGuid"] = "";
				} else {
					arguObj["lastVer"] = infoForm.lastVer;
					arguObj["impScheGuid"] = infoForm.impScheGuid;
				}
				var tableData = $("#excelTable").getObj().getData();
				arguObj["jouDate"] = $.inArrayJson(tableData, "code", "jouDate").text;
				arguObj["summary"] = $.inArrayJson(tableData, "code", "summary").text;
				if ((!window.ownerData.isCurrency) && (amtImpType == "1")) {
					arguObj["drCr"] = $.inArrayJson(tableData, "code", "drCr").text;
					arguObj["money"] = $.inArrayJson(tableData, "code", "money").text;
				} else if (window.ownerData.isCurrency && (amtImpType == "1")) {
					arguObj["drCr"] = $.inArrayJson(tableData, "code", "drCr").text;
					arguObj["exchangeRate"] = $.inArrayJson(tableData, "code", "exchangeRate").text;
					arguObj["currencyMoney"] = $.inArrayJson(tableData, "code", "currencyMoney").text;
					arguObj["money"] = $.inArrayJson(tableData, "code", "money").text;
				} else if (window.ownerData.isCurrency && amtImpType == "2") {
					arguObj["amtDr"] = $.inArrayJson(tableData, "code", "amtDr").text;
					arguObj["amtCr"] = $.inArrayJson(tableData, "code", "amtCr").text;
					arguObj["currencyDrMoney"] = $.inArrayJson(tableData, "code", "currencyDrMoney").text;
					arguObj["currencyCrMoney"] = $.inArrayJson(tableData, "code", "currencyCrMoney").text;
					arguObj["exchangeRate"] = $.inArrayJson(tableData, "code", "exchangeRate").text;
				} else {
					arguObj["amtDr"] = $.inArrayJson(tableData, "code", "amtDr").text;
					arguObj["amtCr"] = $.inArrayJson(tableData, "code", "amtCr").text;
				}
				arguObj["cashType"] = $.inArrayJson(tableData, "code", "cashType").text;
				arguObj["isReceipt"] = $.inArrayJson(tableData, "code", "isReceipt").text;
				arguObj["type"] = $.inArrayJson(tableData, "code", "type").text;
				arguObj["vouType"] = $.inArrayJson(tableData, "code", "vouType").text;
				arguObj["vouFisPerd"] = $.inArrayJson(tableData, "code", "vouFisPerd").text;
				arguObj["vouNo"] = $.inArrayJson(tableData, "code", "vouNo").text;
				arguObj["billtypeCode"] = $.inArrayJson(tableData, "code", "billtypeCode").text;
				arguObj["dealWith"] = $.inArrayJson(tableData, "code", "dealWith").text;
				arguObj["billNo"] = $.inArrayJson(tableData, "code", "billNo").text;
				arguObj["oppositeUnit"] = $.inArrayJson(tableData, "code", "oppositeUnit").text;
				arguObj["remark"] = $.inArrayJson(tableData, "code", "remark").text;
				if (!$.isNull(window.ownerData.accountInfo.needShowAccitem) && !$.isNull(window.ownerData.items)) {
					var needShowAccItem = window.ownerData.accountInfo.needShowAccitem.split(',');
					for (var i = 0; i < needShowAccItem.length; i++) {
						for (var j = 0; j < window.ownerData.items.length; j++) {
							if (needShowAccItem[i] == window.ownerData.items[j].accitemCode) {
								var item = window.ownerData.items[j];
								var cbName = item.eleName;
								var cbItem = item.eleCode;
								var cbCode = item.accitemCode;
								var code = page.shortLineToTF(cbCode) + 'Code';
								arguObj[code] = $.inArrayJson(tableData, "code", code).text;
							}
						}
					}
				}
				var newArgu = page.changeField(arguObj);
				newArgu.amtImpType = amtImpType;
				newArgu.startLine = $("#startLine_input").val();
				ufma.post(portList.saveBankImpSche, newArgu, function (result) {
					ufma.showTip("保存成功！", function () {
						var impScheGuid = result.data.impScheGuid;
						_close("save", amtImpType, impScheGuid);
					}, "success");
				});

			},

			showInputHelp: function (oid, msg) {
				var hlpid = oid + '-help';
				var $hlp = $('#' + hlpid);
				if ($hlp.length == 0) {
					$hlp = $('<span id="' + hlpid + '" class="input-help-block" style="top:40px;left:124px;"></span>');
					$('#' + oid).after($hlp);
				}
				if (msg != $hlp.html()) { $hlp.html(msg); }
				if ($hlp.is(':hidden')) { $hlp.show(300); }
			},
			//转换为驼峰
			shortLineToTF: function (str) {
				var arr = str.split("_");
				for (var i = 0; i < arr.length; i++) {
					arr[i] = arr[i].toLowerCase()
				}
				for (var i = 1; i < arr.length; i++) {
					arr[i] = arr[i].toLowerCase()
					arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].substring(1);
				}
				return arr.join("");
			},
			onEventListener: function () {
				//取消方案设置的模态框
				$('#setDataFormat .btn-close').on('click', function () {
					_close("close", amtImpType, page.impScheGuid);
				});

				//只能输入数字
				$(".cont-tabs input[type='text']:not(input[name='delimiter'])").on("keyup", function () {
					$(this).val($(this).val().replace(/[^\d]/g, ''));
				});

				$("#impScheName").on('focus paste keyup', function (e) {
					e.stopepropagation;
					$(this).closest('.form-group').removeClass('error');
				}).on('blur', function () {
					if ($(this).val() == '') {
						ufma.showInputHelp("impScheName", '<span class="error">方案名称不能为空！</span>');
						$(this).closest('.form-group').addClass('error');
					} else {
						ufma.hideInputHelp("impScheName");
						$(this).closest('.form-group').removeClass('error');
					}
				});

				$(".cont-tabs input[data-check='required']").on('focus paste keyup', function (e) {
					e.stopepropagation;
					$(this).closest('.form-group').removeClass('error');
				}).on('blur', function () {
					var thisId = $(this).attr("id");
					if ($(this).val() == '') {
						page.showInputHelp(thisId, '<span class="error">该字段不能为空，请输入有效数字！</span>');
						$(this).closest('.form-group').addClass('error');
					} else {
						ufma.hideInputHelp(thisId);
						$(this).closest('.form-group').removeClass('error');
					}
				});

				//切换定长文件、不定长文件
				$(".nav-tabs li").each(function (i) {
					$(this).on("click", function () {
						$(this).addClass("active").siblings().removeClass("active");
						$(".cont-tabs" + (i + 1)).show().siblings().hide();
					});
				});

				//切换借贷方向、金额
				$(".dire1-radio label").each(function (i) {
					$(this).on("click", function () {
						$(this).find("input").prop("checked", true);
						$(this).siblings().find("input").removeAttr("checked");
						if (i == 0) {
							amtImpType = 1;
						} else {
							amtImpType = 2;
						}
						page.reqExtInput(amtImpType);
					});
				});
				//删除导入方案
				$(".btn-delete").on("click", function () {
					var impScheGuid = $("input[name='impScheGuid']").val();
					if (impScheGuid != "") {
						ufma.confirm('您确定要删除该导入方案吗？', function (action) {
							if (action) {//确认
								var argu = {
									impScheGuid: impScheGuid
								};
								ufma.delete(portList.delBankImpSche, argu, function () {
									ufma.showTip("删除成功！", function () {
										_close("delete", amtImpType);
									}, "success");
								});
							} else {//取消

							}
						}, { type: 'warning' });
					} else {
						ufma.showTip("该方案未保存，不需要删除！", function () { }, "warning");
					}
				});

				//保存方案
				$(".btn-save").on("click", function () {
					page.saveImpSche();
				});

				//另存为方案
				$(".btn-save-new").on("click", function () {
					page.saveImpSche("new");
				});
			},

			//此方法必须保留
			init: function () {
				ufma.parse();
				page.schemaGuid = window.ownerData.schemaGuid;//方案id
				page.impType = window.ownerData.impType;//文件类型
				page.impScheGuid = window.ownerData.impScheGuid;//格式id
				page.letterList = window.ownerData.letterList;//格式id
				page.agencyCode = window.ownerData.agencyCode;
				page.setYear = window.ownerData.setYear;
				page.rgCode = window.ownerData.rgCode;
				//初始化开始数据行
				$("#startLine").ufCombox({
					idField: "id",
					textField: "name",
					placeholder: "请选择",
					onChange: function (sender, data) {
					}
				});
				var lineArr = [];
				if(!$.isNull(window.ownerData.tempRows)){
					for (var i = window.ownerData.tempRows.minRow; i <= window.ownerData.tempRows.maxRow; i++) {
						var lineObj = {
							id: i,
							name: i
						};
						lineArr.push(lineObj);
					}
					$("#startLine").getObj().load(lineArr);
					$("#startLine").getObj().val(lineArr[0].id);
				}
				if ($.isNull(page.letterList)) {
					page.letterList = [
						{ id: '01', text: 'A' }, { id: '02', text: 'B' }, { id: '03', text: 'C' },
						{ id: '04', text: 'D' }, { id: '05', text: 'E' }, { id: '06', text: 'F' },
					];
				}
				if (page.impScheGuid != "") {
					page.reqDetailFormat(page.impScheGuid);
				} else {
					page.reqExtInput(amtImpType);
				}
				//请求扩展字段

				page.onEventListener();

			}
		}
	}();
	page.init();
});