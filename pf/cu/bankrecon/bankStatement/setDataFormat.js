$(function () {
	window._close = function (action) {
		if (window.closeOwner) {
			var data = {
				action: action
			};
			window.closeOwner(data);
		}
	}
	var page = function () {
		//银行对账单接口
		var portList = {
			getBankExtends: "/cu/bankStatement/getStatementExtend", //获取对账单扩展字段
			getBankImpScheAss: "/cu/bankStatement/getBankImpScheAss", //请求具体数据格式内容
			saveBankImpSche: "/cu/bankStatement/saveBankImpSche", //保存格式方案
			delBankImpSche: "/cu/bankStatement/delBankImpSche" //删除格式方案
		};

		return {

			//初始化excel表格
			initEditTable: function (id, data, listData) {
				$('#' + id).ufDatagrid({
					data: data,
					columns: [
						[{
							type: 'indexcolumn',
							name: '序号',
							width: 58,
							headalign: 'center',
							align: 'center'
						},
						{
							field: 'name',
							name: '字段',
							headalign: 'center'
						},
						{
							type: 'combox',
							field: 'id',
							name: '数据列',
							headalign: 'center',
							align: 'center',
							idField: 'id',
							textField: 'text',
							data: listData,
							onChange: function (e) { },
							beforeExpand: function (e) { },
							render: function (rowid, rowdata, data) {
								return rowdata.text;
							}
						}
						]
					],
					initComplete: function (options, data) {

					}
				});
			},

			//请求扩展字段
			reqExtInput: function () {
				var extArgu = {
					"schemaGuid": page.schemaGuid
				};
				ufma.ajaxDef(portList.getBankExtends, "get", extArgu, function (result) {
					var extArr = result.data;
					if (page.impType == "1") {
						var fileHtml1 = ""; //定长文件扩展html
						var fileHtml2 = ""; //不定长文件扩展html
						for (var i = 0; i < extArr.length; i++) {
							var file1 = ufma.htmFormat(
								'<div class="col-xs-6">' +
								'<div class="form-group">' +
								'<label class="control-label em6"><%=title%>：</label>' +
								'<div class="control-element">' +
								'<input type="text" name="<%=name%>1" elecode="<%=elecode%>" id="" class="form-control w80 ib">' +
								'&nbsp;至&nbsp;' +
								'<input type="text" name="<%=name%>2" elecode="<%=elecode%>" id="" class="form-control w80 ib">' +
								'</div>' +
								'</div>' +
								'</div>', {
									title: extArr[i].showName,
									name: extArr[i].extendField,
									elecode: extArr[i].eleCode
								});
							var file2 = ufma.htmFormat(
								'<div class="col-xs-6">' +
								'<div class="form-group">' +
								'<label class="control-label em6"><%=title%>：</label>' +
								'<div class="control-element">' +
								'<input type="text" name="<%=name%>" elecode="<%=elecode%>" id="" class="form-control w200">' +
								'</div>' +
								'</div>' +
								'</div>', {
									title: extArr[i].showName,
									name: extArr[i].extendField,
									elecode: extArr[i].eleCode
								});
							fileHtml1 += file1;
							fileHtml2 += file2;
						}
						$(".file-input1").append(fileHtml1);
						$(".file-input2").append(fileHtml2);
					} else if (page.impType == "2") {
						//初始化数据范围表格
						if(page.impWay == "2"){
							page.dataExcel = [{
								name: '单据日期',
								code: 'statementDate',
								text: '',
								id: ''
							},
							{
								name: '摘要',
								code: 'descpt',
								text: '',
								id: ''
							},
							{
								name: '借方金额',
								code: 'amtDr',
								text: '',
								id: ''
							},
							{
								name: '贷方金额',
								code: 'amtCr',
								text: '',
								id: ''
							},
							{
								name: '单据编号',
								code: 'vouNo',
								text: '',
								id: ''
							},
							// { name: '结算方式', code: 'setmodeCode', text: '', id: '' },
							{
								name: '票据类型',
								code: 'billType',
								text: '',
								id: ''
							},
							// { name: '票据日期', code: 'billDate', text: '', id: '' },
							{
								name: '票据号',
								code: 'billNo',
								text: '',
								id: ''
							}
							];
						} else {
							page.dataExcel = [{
								name: '单据日期',
								code: 'statementDate',
								text: '',
								id: ''
							},
							{
								name: '摘要',
								code: 'descpt',
								text: '',
								id: ''
							},
							{
								name: '金额',
								code: 'stadAmt',
								text: '',
								id: ''
							},
							{
								name: '单据编号',
								code: 'vouNo',
								text: '',
								id: ''
							},
							{
								name: '票据类型',
								code: 'billType',
								text: '',
								id: ''
							},
							{
								name: '票据号',
								code: 'billNo',
								text: '',
								id: ''
							}
							];
						}
						
						page.excArr = page.dataExcel; //excel数据列
						for (var i = 0; i < extArr.length; i++) {
							var excObj = {
								name: extArr[i].showName,
								code: extArr[i].extendField,
								text: '',
								id: ''
							}
							page.dataExcel.push(excObj);
						}
						if ($.isNull(page.impScheGuid)) {
							page.initEditTable("excelTable", page.dataExcel, page.letterList);
						}

					}

				});
			},

			//请求具体数据格式，并展示到导入方式
			reqDetailFormat: function (impScheGuid) {
				var argu = {
					impScheGuid: impScheGuid
				}
				ufma.ajaxDef(portList.getBankImpScheAss, "get", argu, function (result) {
					var data = result.data;
					
					$("#infoForm").setForm(data);
					var impType = data.impType; //1文本   2excel
					if (impType == "1") {
						$("#impWay").show();
						var amtImpType = data.amtImpType; //1按借贷方向  2按金额
						var tmpStyle = data.tmpStyle; //1定长   2分隔符 
						if (tmpStyle == "1") {
							$(".nav-tabs li").eq(0).addClass("active").siblings().removeClass("active");
							$(".cont-tabs1").show().siblings().hide();
							//if (amtImpType == "1") {
							if (amtImpType == 1) { //CWYXM-9551 --与后端保持一致，存为整型数据--zsj
								$(".dire1-radio label").eq(0).find("input").prop("checked", true);
								$(".dire1-radio label").eq(1).find("input").removeAttr("checked");
								$(".dire1-box1").show();
								$(".dire1-box2").hide();
								//} else if (amtImpType == "2") {
							} else if (amtImpType == 2) { //CWYXM-9551 --与后端保持一致，存为整型数据--zsj
								$(".dire1-radio label").eq(1).find("input").prop("checked", true);
								$(".dire1-radio label").eq(0).find("input").removeAttr("checked");
								$(".dire1-box2").show();
								$(".dire1-box1").hide();
							}
							for (key in data) {
								if (data[key] == null) {
									data[key] = "";
								} else {
									var index = data[key].toString().indexOf("-");
									if (index != "-1") {
										var field1 = key + "1";
										var field2 = key + "2";
										data[field1] = data[key].substring(0, index);
										data[field2] = data[key].substring((index + 1));
									}
								}
							}
							$('#file-set-box1').setForm(data);
						} else if (tmpStyle == "2") {
							$(".nav-tabs li").eq(1).addClass("active").siblings().removeClass("active");
							$(".cont-tabs2").show().siblings().hide();

							//if (amtImpType == "1") {
							if (amtImpType == 1) { //CWYXM-9551 --与后端保持一致，存为整型数据--zsj
								$(".dire2-radio label").eq(0).find("input").prop("checked", true);
								$(".dire2-radio label").eq(1).find("input").removeAttr("checked");
								$(".dire2-box1").show();
								$(".dire2-box2").hide();

								//} else if (amtImpType == "2") {
							} else if (amtImpType == 2) { //CWYXM-9551 --与后端保持一致，存为整型数据--zsj
								$(".dire2-radio label").eq(1).find("input").prop("checked", true);
								$(".dire2-radio label").eq(0).find("input").removeAttr("checked");
								$(".dire2-box2").show();
								$(".dire2-box1").hide();
							}
							$('#file-set-box2').setForm(data);
						}
					} else if (impType == "2") {
						page.impWay = data.amtImpType;
						page.reqExtInput();
						$("#impWay").show();
						for (var i = 0; i < page.excArr.length; i++) {
							var code = page.excArr[i].code;
							var text = data[code];
							page.excArr[i].text = data[code];
							if (!$.isNull(page.letterList)) {
								var obj = $.inArrayJson(page.letterList, "text", text);
								if (obj) {
									page.excArr[i].id = obj.id;
								}
							}
						}
						//$("#excelTable").getObj().load(page.excArr);
						page.initEditTable("excelTable", page.excArr, page.letterList);
					}

				})
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
				arguObj["schemaGuid"] = page.schemaGuid;
				arguObj["impScheName"] = infoForm.impScheName;
				arguObj["impType"] = page.impType;

				if (flag == "new") {
					arguObj["lastVer"] = "";
					arguObj["impScheGuid"] = "";
				} else {
					arguObj["lastVer"] = infoForm.lastVer;
					arguObj["impScheGuid"] = infoForm.impScheGuid;
				}

				if (page.impType == "1") { //文本文件

					var tmpStyleName = $(".nav-tabs .active a").text();
					if (tmpStyleName == "定长文件") {
						var flag2 = page.checkInput("file-input1");
						if (!flag2) {
							return false;
						}

						arguObj["tmpStyle"] = "1";

						var data = $("#file-set-box1").serializeObject();

						arguObj["startLine"] = data.startLine;
						arguObj["statementDate"] = data.statementDate1 + "-" + data.statementDate2;
						arguObj["descpt"] = data.descpt1 + "-" + data.descpt2;
						//                		arguObj["amtDr"]=data.amtDr1+"-"+data.amtDr2;
						//                		arguObj["amtCr"]=data.amtCr1+"-"+data.amtCr2;
						arguObj["vouNo"] = data.vouNo1 + "-" + data.vouNo2;
						//						arguObj["setmodeCode"] = data.setmodeCode1 + "-" + data.setmodeCode2;
						arguObj["billType"] = data.billType1 + "-" + data.billType2;
						arguObj["billDate"] = data.billDate1 + "-" + data.billDate2;
						arguObj["billNo"] = data.billNo1 + "-" + data.billNo2;
						arguObj["field10"] = data.field101 + "-" + data.field102;
						arguObj["field09"] = data.field091 + "-" + data.field092;
						arguObj["field08"] = data.field081 + "-" + data.field082;
						arguObj["field07"] = data.field071 + "-" + data.field072;
						arguObj["field06"] = data.field061 + "-" + data.field062;
						arguObj["field05"] = data.field051 + "-" + data.field052;
						arguObj["field04"] = data.field041 + "-" + data.field042;
						arguObj["field03"] = data.field031 + "-" + data.field032;
						arguObj["field02"] = data.field021 + "-" + data.field022;
						arguObj["field01"] = data.field011 + "-" + data.field012;

						var amtImpType = $("input[name='amtImpType1']:checked").val(); //1按借贷方向  2按金额
						if (amtImpType == "1") {
							var flag3 = page.checkInput("dire1-box1");
							if (!flag3) {
								return false;
							}
							//arguObj["amtImpType"] = "1";
							arguObj["amtImpType"] = 1; //CWYXM-9551 --与后端保持一致，存为整型数据--zsj
							arguObj["drCr"] = data.drCr1 + "-" + data.drCr2;
							arguObj["stadAmt"] = data.stadAmt1 + "-" + data.stadAmt2;

						} else if (amtImpType == "2") {
							var flag4 = page.checkInput("dire1-box2");
							if (!flag4) {
								return false;
							}
							//arguObj["amtImpType"] = "2";
							arguObj["amtImpType"] = 2; //CWYXM-9551 --与后端保持一致，存为整型数据--zsj
							arguObj["amtDr"] = data.amtDr1 + "-" + data.amtDr2;
							arguObj["amtCr"] = data.amtCr1 + "-" + data.amtCr2;

						}

					} else if (tmpStyleName == "不定长文件") {
						var flag5 = page.checkInput("file-input2");
						if (!flag5) {
							return false;
						}

						arguObj["tmpStyle"] = "2";

						var data = $("#file-set-box2").serializeObject();

						arguObj["startLine"] = data.startLine;
						arguObj["delimiter"] = data.delimiter;
						arguObj["statementDate"] = data.statementDate;
						arguObj["descpt"] = data.descpt;
						//                		arguObj["amtDr"]=data.amtDr;
						//                		arguObj["amtCr"]=data.amtCr;
						arguObj["vouNo"] = data.vouNo;
						//						arguObj["setmodeCode"] = data.setmodeCode;
						arguObj["billType"] = data.billType;
						arguObj["billDate"] = data.billDate;
						arguObj["billNo"] = data.billNo;
						arguObj["field10"] = data.field10;
						arguObj["field09"] = data.field09;
						arguObj["field08"] = data.field08;
						arguObj["field07"] = data.field07;
						arguObj["field06"] = data.field06;
						arguObj["field05"] = data.field05;
						arguObj["field04"] = data.field04;
						arguObj["field03"] = data.field03;
						arguObj["field02"] = data.field02;
						arguObj["field01"] = data.field01;

						var amtImpType = $("input[name='amtImpType2']:checked").val(); //1按借贷方向  2按金额
						if (amtImpType == "1") {
							var flag6 = page.checkInput("dire2-box1");
							if (!flag6) {
								return false;
							}
							//arguObj["amtImpType"] = "1";
							arguObj["amtImpType"] = 1; //CWYXM-9551 --与后端保持一致，存为整型数据--zsj
							arguObj["drCr"] = data.drCr;
							arguObj["stadAmt"] = data.stadAmt;

						} else if (amtImpType == "2") {
							var flag7 = page.checkInput("dire2-box2");
							if (!flag7) {
								return false;
							}
							//arguObj["amtImpType"] = "2";
							arguObj["amtImpType"] = 2; //CWYXM-9551 --与后端保持一致，存为整型数据--zsj
							arguObj["amtDr"] = data.amtDr;
							arguObj["amtCr"] = data.amtCr;

						}
					}

				} else if (page.impType == "2") { //excel
					// var flag8 = page.checkExcel();
					// if(!flag8){
					// 	ufma.showTip("表格每一行的数据列单元格必须选择值！",function(){},"warning");
					// 	return false;
					// }
					var impWay = $("input[name='amtImpType']:checked").val();
					var tableData = $("#excelTable").getObj().getData();
					arguObj["amtImpType"] = impWay;
					arguObj["statementDate"] = $.inArrayJson(tableData, "code", "statementDate").text;
					arguObj["descpt"] = $.inArrayJson(tableData, "code", "descpt").text;
					if(impWay == "2"){
						arguObj["amtDr"] = $.inArrayJson(tableData, "code", "amtDr").text;
						arguObj["amtCr"] = $.inArrayJson(tableData, "code", "amtCr").text;
					}else{
						arguObj["stadAmt"] = $.inArrayJson(tableData, "code", "stadAmt").text;
					}
					arguObj["vouNo"] = $.inArrayJson(tableData, "code", "vouNo").text;
					//					arguObj["setmodeCode"] = $.inArrayJson(tableData, "code", "setmodeCode").text;
					arguObj["billType"] = $.inArrayJson(tableData, "code", "billType").text;
					arguObj["billNo"] = $.inArrayJson(tableData, "code", "billNo").text;
					arguObj["relation"] = (!$.isNull($.inArrayJson(tableData, "code", "relation"))) ? $.inArrayJson(tableData, "code", "relation").text : "";

					var field10 = $.inArrayJson(tableData, "code", "field10");
					arguObj["field10"] = (field10 != undefined) ? field10.text : "";
					var field09 = $.inArrayJson(tableData, "code", "field09");
					arguObj["field09"] = (field09 != undefined) ? field09.text : "";
					var field08 = $.inArrayJson(tableData, "code", "field08");
					arguObj["field08"] = (field08 != undefined) ? field08.text : "";
					var field07 = $.inArrayJson(tableData, "code", "field07");
					arguObj["field07"] = (field07 != undefined) ? field07.text : "";
					var field06 = $.inArrayJson(tableData, "code", "field06");
					arguObj["field06"] = (field06 != undefined) ? field06.text : "";
					var field05 = $.inArrayJson(tableData, "code", "field05");
					arguObj["field05"] = (field05 != undefined) ? field05.text : "";
					var field04 = $.inArrayJson(tableData, "code", "field04");
					arguObj["field04"] = (field04 != undefined) ? field04.text : "";
					var field03 = $.inArrayJson(tableData, "code", "field03");
					arguObj["field03"] = (field03 != undefined) ? field03.text : "";
					var field02 = $.inArrayJson(tableData, "code", "field02");
					arguObj["field02"] = (field02 != undefined) ? field02.text : "";
					var field01 = $.inArrayJson(tableData, "code", "field01");
					arguObj["field01"] = (field01 != undefined) ? field01.text : "";
				}
				var newArgu = page.changeField(arguObj);

				ufma.post(portList.saveBankImpSche, newArgu, function (result) {
					ufma.showTip("保存成功！", function () {
						_close("save");
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
				if (msg != $hlp.html()) {
					$hlp.html(msg);
				}
				if ($hlp.is(':hidden')) {
					$hlp.show(300);
				}
			},

			onEventListener: function () {
				//取消方案设置的模态框
				$('#setDataFormat .btn-close').on('click', function () {
					_close("close");
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
							$(".dire1-box1").show();
							$(".dire1-box2").hide();
						} else {
							$(".dire1-box2").show();
							$(".dire1-box1").hide();
						}
					});
				});
				$(".dire2-radio label").each(function (i) {
					$(this).on("click", function () {
						$(this).find("input").prop("checked", true);
						$(this).siblings().find("input").removeAttr("checked");
						if (i == 0) {
							$(".dire2-box1").show();
							$(".dire2-box2").hide();
						} else {
							$(".dire2-box2").show();
							$(".dire2-box1").hide();
						}
					});
				});
				//excel 切换导入方式 guohx
				$(".impway-radio label").each(function (i) {
					$(this).on("click", function () {
						$(this).find("input").prop("checked", true);
						$(this).siblings().find("input").removeAttr("checked");
						if (i == 0) {
							page.impWay = "2";
						} else if (i == 1) {
							page.impWay = "3";
						} else {
							page.impWay = "4";
						}
						page.reqExtInput();
						if (page.impScheGuid != "") {
							page.initEditTable("excelTable", page.excArr, page.letterList);
						}
					});
				});
				//删除导入方案
				$(".btn-delete").on("click", function () {
					var impScheGuid = $("input[name='impScheGuid']").val();
					if (impScheGuid != "") {
						ufma.confirm('您确定要删除该导入方案吗？', function (action) {
							if (action) { //确认
								var argu = {
									impScheGuid: impScheGuid
								};
								ufma.delete(portList.delBankImpSche, argu, function () {
									ufma.showTip("删除成功！", function () {
										_close("delete");
									}, "success");
								});
							} else { //取消

							}
						}, {
								type: 'warning'
							});
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
				page.schemaGuid = window.ownerData.schemaGuid; //方案id
				page.impType = window.ownerData.impType; //文件类型
				page.impScheGuid = window.ownerData.impScheGuid; //格式id
				page.letterList = window.ownerData.letterList; //格式id
				page.agencyCode = window.ownerData.agencyCode;
				page.setYear = window.ownerData.setYear;
				page.rgCode = window.ownerData.rgCode;
				if (!$.isNull(page.letterList)) {
					if (page.letterList.length <= 0) {
						page.letterList = [{
							id: '01',
							text: 'A'
						}, {
							id: '02',
							text: 'B'
						}, {
							id: '03',
							text: 'C'
						},
						{
							id: '04',
							text: 'D'
						}, {
							id: '05',
							text: 'E'
						}, {
							id: '06',
							text: 'F'
						},
						];
					}
				}
				page.impWay = "2";
				if (page.impType == "1") {
					$(".radio-body1").show();
					$(".radio-body2").hide();
					$("#impWay").hide();
				} else if (page.impType == "2") {
					$(".radio-body2").show();
					$(".radio-body1").hide();
					$("#impWay").show();
				}

				//请求扩展字段
				page.reqExtInput();

				if (page.impScheGuid != "") {
					page.reqDetailFormat(page.impScheGuid);
				}

				page.onEventListener();

			}
		}
	}();
	page.init();
});