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

		//向后台传参的对象
		var postData = {};
		var cAction = 'cancel';
		var isAgency;
		var fjfa;
		var agencyCode = '*';
		var seestiondata = ufma.getCommonData()
		//seestiondata.svRgCode 
		//seestiondata.svSetYear 
		return {

			initPage: function () {
				page.aParentCode = [];
				page.maEleCurrentAccistData = [];
				page.agencyCode = window.ownerData.agencyCode;
				page.acctCode = window.ownerData.acctCode;
				if (window.ownerData.action == 'edit') {
					//编辑
					var data = window.ownerData.data;
					var maEleCurrentAccountList = [];
					var argu = {
						"agencyCode": page.agencyCode,
						"acctCode": page.acctCode,
						"rgCode": seestiondata.svRgCode,
						"setYear": seestiondata.svSetYear,
						"chrCode": data.chrCode
					}
					ufma.showloading('数据加载中，请耐心等待...')
					ufma.get('/ma/sys/current/select/', argu, function (result) {
						ufma.hideloading();
						maEleCurrentAccountList = result.data[0].maEleCurrentAccountList;
						page.maEleCurrentAccistData = maEleCurrentAccountList;
						page.initIlaccTable();
					});
					$("#currentEdit #lastVer").val(data.lastVer);
					//表单填入数据
					$("#currentEdit #chrId").val(data.chrId);
					$("#currentEdit #chrCode").val(data.chrCode).attr('disabled', true);
					if (window.ownerData.flag) {
						$("#currentEdit #chrCode").val(data.chrCode).attr('disabled', false);
					}
					$("#currentEdit #cEditChrName").val(data.chrName);
					//$("#currentEdit #cEditCompanyKind option[value=" + data.companyKind + "]").prop("selected", true);
					//$("#currentEdit #cEditCompanyattribute option[value=" + data.attribute + "]").prop("selected", true);
					$('#cEditCompanyKind').val(data.companyKind);
					$('#cEditCompanyattribute').val(data.attribute);
					var isCustomerType = (data.isCustomer == 2) ? true : false;
					$("#currentEdit input[name='isCustomer']").prop("checked", isCustomerType);
					var isSupplierType = (data.isSupplier == 1) ? true : false;
					$("#currentEdit input[name='isSupplier']").prop("checked", isSupplierType);
					$("#currentEdit #cEnabled input[value=" + data.enabled + "]").prop("checked", true).parent().addClass("active").siblings().removeClass("active");
					$("#currentEdit #cAllowAddsub input[value=" + data.allowAddsub + "]").prop("checked", true).parent().addClass("active").siblings().removeClass("active");

					$("#currentEdit #cEditContact").val(data.contact);
					$("#currentEdit #cEditPhoneNum").val(data.phoneNum);
					$("#currentEdit #cEditEmail").val(data.email);
					$("#currentEdit #cEditFax").val(data.fax);
					$("#currentEdit #cEditCommAddr").val(data.commAddr);

					$("#currentEdit #cEditBank").val(data.bank);
					$("#currentEdit #cEditBankAcc").val(data.bankAcc);
					$("#currentEdit #cEditCorpRepr").val(data.corpRepr);
					$("#currentEdit #cEditBusinessCardNo").val(data.businessCardNo);
					$("#currentEdit #cEditBusinessTaxNo").val(data.businessTaxNo);
					$("#currentEdit #cEditBusinessSco").val(data.businessSco);
					$("#agency-distCode").ufmaTreecombox().val(data.distCode);
					//助记码
					$("#currentEdit #assCode").val(data.assCode);
					//右侧信息
					var $li = $('<li>' + data.chrCode + ' ' + data.chrName + '</li>');
					$("#project-ul").append($li);
					$("#field1").ufmaTreecombox().setValue("", "");
					$("#field2").ufmaTreecombox().setValue("", "");
					$("#field3").ufmaTreecombox().setValue("", "");
					$("#field4").ufmaTreecombox().setValue("", "");
					$("#field5").ufmaTreecombox().setValue("", "");
					ufma.deferred(function () {
						$('#form-expfunc').setForm(data);
						$("#field1").ufmaTreecombox().val(data.field1);
						$("#field2").ufmaTreecombox().val(data.field2);
						$("#field3").ufmaTreecombox().val(data.field3);
						$("#field4").ufmaTreecombox().val(data.field4);
						$("#field5").ufmaTreecombox().val(data.field5);
						page.formdata = $("#currentForm").serializeObject();
					});
					$("#btn-senddown").hide();

					//判断系统级单位级
				}
			},
			//获取单位属性数据
			getattributedata: function () {
				var url = '/ma/pub/enumerate/MA_CURRENT_ATTRIBUTE?rgCode=' + seestiondata.svRgCode + '&setYear=' + seestiondata.svSetYear
				var callback = function (result) {
					var tru = '',
						defaultOption;
					if (result.data.length > 0) {
						defaultOption = result.data[1].ENU_CODE
					}
					for (var i = 0; i < result.data.length; i++) {
						tru += '<option value=' + result.data[i].ENU_CODE + '>' + result.data[i].ENU_NAME + '</option>'
						if (result.data[i].ENU_CODE == "5") {
							defaultOption = result.data[i].ENU_CODE;
						}
					}
					$("#cEditCompanyattribute").html(tru);
					//	$("#cEditCompanyattribute").val(defaultOption);
					$("#cEditCompanyattribute").val('');//ysdp:ZWCW00952237--新增需求将单位属性的默认值去掉，作为必填项--zsj
				};
				ufma.ajaxDef(url, 'get', '', callback);
			},
			//保存获得数据
			saveCurrent: function () {

				//参数设定
				postData.chrId = $("#currentEdit input[type='hidden']").val();

				postData.chrCode = $("#currentEdit #chrCode").val();
				postData.chrName = $("#currentEdit #cEditChrName").val();
				postData.companyKind = $("#currentEdit #cEditCompanyKind option:selected").val();
				postData.attribute = $("#currentEdit #cEditCompanyattribute option:selected").val();
				if (!$.isNull(postData.attribute)) {
					page.required = true;
				}
				postData.assCode = $('#assCode').val();
				//往来关系——客户（值：2）
				postData.isCustomer = ($("#currentEdit input[name='isCustomer']").is(':checked')) ? 2 : "";
				//往来关系——供应商（值：1）
				postData.isSupplier = ($("#currentEdit input[name='isSupplier']").is(':checked')) ? 1 : "";
				postData.enabled = $("#currentEdit input[name='enabled']:checked").val();
				postData.allowAddsub = $("#currentEdit input[name='allowAddsub']:checked").val();

				postData.contact = $("#currentEdit #cEditContact").val();
				postData.phoneNum = $("#currentEdit #cEditPhoneNum").val();
				postData.email = $("#currentEdit #cEditEmail").val();
				postData.fax = $("#currentEdit #cEditFax").val();
				postData.commAddr = $("#currentEdit #cEditCommAddr").val();

				postData.bank = $("#currentEdit #cEditBank").val();
				postData.bankAcc = $("#currentEdit #cEditBankAcc").val();
				postData.corpRepr = $("#currentEdit #cEditCorpRepr").val();
				postData.businessCardNo = $("#currentEdit #cEditBusinessCardNo").val();
				postData.businessTaxNo = $("#currentEdit #cEditBusinessTaxNo").val();
				postData.businessSco = $("#currentEdit #cEditBusinessSco").val();
				postData.distCode = page.distCode.getValue();
				var temp = $('#currentForm').serializeObject();
				postData.field1 = temp.field1;
				postData.field2 = temp.field2;
				postData.field3 = temp.field3;
				postData.field4 = temp.field4;
				postData.field5 = temp.field5;

				postData.lastVer = $("#lastVer").val();
				postData.maEleCurrentAccountList = page.serializeIllegal();
				return postData;
			},
			getErrMsg: function (errcode) {
				var error = {
					0: '往来单位编码不能为空',
					1: '上级往来单位不能为空',
					2: '往来单位名称不能为空',
					3: '上级编码不存在',
					4: '项目负责人不能空',
					5: '编码只能是数字或者是字母',
					6: '往来单位名称不能为空',
					7: '往来单位编码不能为空',
					8: '编码已存在',
					9: '编码不符合编码规则:',
					10: '请输入正确的联系方式'
				}
				return error[errcode];
			},
			jCodeName: {},
			showParentHelp: function (parentCodes, t) {
				var url = '/ma/sys/common/findParentList?chrCode=' + parentCodes + '&agencyCode=' + page.agencyCode + '&acctCode=' + page.acctCode + '&eleCode=CURRENT' + '&rgCode=' + ma.rgCode + '&setYear=' + ma.setYear;
				var callback = function (result) {
					var htm = '';
					if (result.data.length > 0) {
						page.aParentCode = [];
						page.aParentName = [];
					}
					$.each(result.data, function (index, row) {
						if (index == 0) {
							htm += ufma.htmFormat('<li style="padding-left:0px;"><%=CHR_CODE%> <%=CHR_NAME%></li>', {
								'CHR_CODE': row.code,
								'CHR_NAME': row.name
							});
						} else {
							htm += ufma.htmFormat('<li style="padding-left:16px;"><%=CHR_CODE%> <%=CHR_NAME%></li>', {
								'CHR_CODE': row.code,
								'CHR_NAME': row.name
							});
						}
						page.aParentCode.push(row.code);
						page.jCodeName[row.code] = row.name;
					});
					$('#current-help').html(htm);
					if (!$.isNull(t)) {
						page.showHelpTips(t)
					}
				};
				ufma.get(url, '', callback);
			},
			//获取行政区划并渲染
			getDistTree: function () {
				page.distCode = $("#agency-distCode").ufmaTreecombox({
					valueField: "id",
					textField: "codeName",
					leafRequire: false,
					readOnly: false,
					data: window.ownerData.distCodeData
				})

			},
			//新增账户信息需求--张世洁--begin
			//初始化table
			newIllegalTable: function (rowData) {
				var $table = $('#currentAccoTab');
				//新增时，自动往后加
				var recNo = $table.find('tr').length;
				//修改时，为排序号
				//修改时，为排序号
				if (rowData) {
					recNo = rowData.index + 1;
				}
				var row =
					//顺序：序号recno、银行账户bankAccCode、账户名称bankAccName、开户行bankCode、网点行号banknodeCode、省份province、城市city、人行联行号pbcInterBankNo、操作
					'<tr>' +
					'<td class="text-center">' +
					'<input type="hidden" name="ilaccId" value="">' +
					'<span class="recno">' + recNo + '</span> ' +
					'</td>' +
					'<td>' +
					'<div class="control-element">' +
					'<input type="text" class="bankAccCode" name="bankAccCode" style="border:none;background-color:transparent;outline-color: transparent;margin-right: 30px;"  maxlength="30"/><span class="btnSetAccount">...</span>' +
					'<label for="bankAccCode" class="control-label hide"></label>' +
					'</div>' +
					'</td>' +
					'<td>' +
					'<div class="control-element">' +
					'<input type="text" class="bankAccName" name="bankAccName" style="border:none;background-color:transparent;outline-color: transparent;" maxlength="60"/>' +
					'<label for="bankAccName" class="control-label hide"></label>' +
					'</div>' +
					'</td>' +
					//银行类别
					'<td>' +
					'<div class="control-element">' +
					'<div class="ufma-combox form-combox bankCategoryCode" name="bankCategoryCode"  style="border:none;background-color:transparent;outline-color: transparent;maxlength="120";"></div>' +
					'<label for="bankCategoryCode" class="control-label hide" title=""></label>' +
					'</div>' +
					'</td>' +
					'<td>' +
					'<div class="control-element">' +
					'<div class="ufma-combox form-combox bankCode" name="bankCode" style="border:none;background-color:transparent;outline-color: transparent;maxlength="120";"></div>' +
					'<label for="bankCode" class="control-label hide" title=""></label>' +
					'</div>' +
					'</td>' +
					'<td>' +
					'<div class="control-element">' +
					'<input type="text" class="banknodeCode" name="banknodeCode" style="border:none;background-color:transparent;outline-color: transparent;" maxlength="30"/>' +
					'<label for="banknodeCode" class="control-label hide"></label>' +
					'</div>' +
					'</td>' +
					'<td>' +
					'<div class="control-element">' +
					'<input type="text" class="province" name="province" style="border:none;background-color:transparent;outline-color: transparent;" maxlength="30"/>' +
					'<label for="province" class="control-label hide"></label>' +
					'</div>' +
					'</td>' +
					'<td>' +
					'<div class="control-element">' +
					'<input type="text" class="city" name="city" style="border:none;background-color:transparent;outline-color: transparent;" maxlength="30"/>' +
					'<label for="city" class="control-label hide"></label>' +
					'</div>' +
					'</td>' +
					'<td>' +
					'<div class="control-element">' +
					'<input type="text" class="pbcInterBankNo" name="pbcInterBankNo" style="border:none;background-color:transparent;outline-color: transparent;" maxlength="60"/>' +
					'<label for="pbcInterBankNo" class="control-label hide"></label>' +
					'</div>' +
					'</td>' +
					'</tr>';
				var $row = $(row).appendTo($table);
				//初始化银行类别
				page.initBankType($row);
				//设置银行账户信息 guohx 
				page.setAccount($row);
				//修改时显示数据
				if (rowData) {
					$row.find('input[name="bankAccCode"]').val(rowData.bankAccCode);
					$row.find('input[name="bankAccName"]').val(rowData.bankAccName);
					$row.find('label[for="bankCategoryCode"]').siblings('.bankCategoryCode').ufmaCombox().setValue(rowData.bankCategoryCode, rowData.bankCategoryName); //详情页直接给combox赋值
					$row.find('label[for="bankCode"]').siblings('.bankCode').ufmaCombox().setValue(rowData.bankCode, rowData.banknodeName); //详情页直接给combox赋值
					$row.find('input[name="province"]').val(rowData.province);
					$row.find('input[name="city"]').val(rowData.city);
					$row.find('input[name="banknodeCode"]').val(rowData.banknodeCode);
					$row.find('input[name="pbcInterBankNo"]').val(rowData.pbcInterBankNo);
					page.rowEnable = rowData.enabled; //bugCWYXM-6109--修改单据状态--zsj
				}
				//调用操作按钮 
				page.setIllegalGroupControl();
			},
			//请求银行类别列表
			getBankType: function () {
				var argu = {};
				argu["rgCode"] = ma.rgCode;
				argu["setYear"] = ma.setYear;
				ufma.ajaxDef('/ma/emp/maEmp/selectBankCategoryTree', 'get', argu, function (result) {
					page.bankTypeList = result.data;
				});
			},
			//请求开户银行
			getBankname: function (bankCategoryCode) {
				var argu = {};
				argu["rgCode"] = ma.rgCode;
				argu["setYear"] = ma.setYear;
				argu["bankCategoryCode"] = bankCategoryCode;
				ufma.ajaxDef('/ma/emp/maEmp/selectBankTree', 'get', argu, function (result) {
					page.bankNameList = result.data;
				});
			},
			//初始化银行类别
			initBankType: function ($tr) {
				function buildCombox() {
					$tr.find('.bankCategoryCode').each(function () {
						$(this).ufmaCombox({
							valueField: 'code',
							textField: 'codeName',
							name: 'code',
							data: page.bankTypeList,
							readOnly: true,
							screen : true,
							onchange: function (node) {
								page.getBankname(node.code);
								page.initBankname($tr);
							}
						});
					})
				}
				buildCombox();
			},
			//初始化开户银行
			initBankname: function ($tr) {
				function buildCombox() {
					$tr.find('.bankCode').each(function () {
						$(this).ufmaCombox({
							valueField: 'code',
							textField: 'codeName',
							name: 'code',
							data: page.bankNameList,
							readOnly: true,
							screen : true,
							onchange: function (node) {
								$tr.find('input[name="banknodeCode"]').val(node.bankNo);
								$tr.find('input[name="province"]').val(node.province);
								$tr.find('input[name="city"]').val(node.city);
								$tr.find('input[name="pbcInterBankNo"]').val(node.pbcInterBankNo);
							}
						});
					})
				}
				buildCombox();
			},
			initIlaccTable: function () {
				$('#currentAccoTab tbody').html('');
				$.each(page.maEleCurrentAccistData, function (index, row) {
					if (row) {
						row.index = index;
						page.newIllegalTable(row);
					}
				});
			},
			setIllegalGroupControl: function () {
				$('#currentAccoTab tbody tr').each(function () {
					var $tr = $(this);
					if ($tr.find('td.btnGroup').length == 0) {
						$tr.append('<td class="nowrap btnGroup">' +
							'<a class="btn btn-icon-only btn-sm btnDel" data-toggle="tooltip" title="删除">' +
							'<span class="glyphicon icon-trash"></span>' +
							'</a>' +
							'<a class="btn btn-icon-only btn-sm btnStart hide" data-toggle="tooltip" title="启用" name="enabled">' +
							'<span class="glyphicon icon-play"></span>' +
							'</a>' +
							'<a class="btn btn-icon-only btn-sm btnStop " data-toggle="tooltip" title="停用" name="enabled">' +
							'<span class="glyphicon icon-ban"></span>' +
							'</a>' +
							'</td>');
						$tr.find('td.btnGroup .btn[data-toggle="tooltip"]').tooltip();
						$tr.find('td.btnGroup .btnDel').on('click', function (e) {
							e.stopPropagation();
							ufma.confirm("您确定要删除选中的数据吗？", function (e) {
								if (e) {
									$tr.remove();
								}
							}, {
									type: 'warning'
								});

						});
						//bugCWYXM-6109--修改单据状态--zsj
						if (page.rowEnable == 0) {
							$tr.find('td.btnGroup .btnStop').addClass('hide');
							$tr.find('td.btnGroup .btnStart').removeClass('hide');
						} else if (page.rowEnable == 1) {
							$tr.find('td.btnGroup .btnStart').addClass('hide');
							$tr.find('td.btnGroup .btnStop').removeClass('hide');
						}
						$tr.find('td.btnGroup .btnStart').on('click', function (e) {
							e.stopPropagation();
							$tr.find('td.btnGroup .btnStart').addClass('hide');
							$tr.find('td.btnGroup .btnStop').removeClass('hide');
						});
						$tr.find('td.btnGroup .btnStop').on('click', function (e) {
							e.stopPropagation();
							$tr.find('td.btnGroup .btnStop').addClass('hide');
							$tr.find('td.btnGroup .btnStart').removeClass('hide');
						});
					}
				});
			},
			//账户信息表格数据序列化
			serializeIllegal: function () {
				var aKJYS = [];
				var irow = 0;
				$('#currentAccoTab tbody tr').each(function (idx) {
					var bankAccCode = $(this).find('[name="bankAccCode"]').val();
					var bankAccName = $(this).find('[name="bankAccName"]').val();
					var bankCode = $(this).closest("tr").find(".bankCode").find(".ufma-combox-value").val();
					var bankCategoryCode = $(this).closest("tr").find(".bankCategoryCode").find(".ufma-combox-value").val();
					var banknodeCode = $(this).find('[name="banknodeCode"]').val();
					var tmpYS = {};
					if (!$.isNull(bankAccCode) || !$.isNull(bankAccName) || !$.isNull(bankCategoryCode) || !$.isNull(bankCode)) {// || !$.isNull(banknodeCode)-ysdp:ZWCW01032830，经赵雪蕊确认去掉网点行号必填的校验--zsj
						irow = irow + 1;
						if (!$.isNull(bankAccCode) && !$.isNull(bankAccName) && !$.isNull(bankCategoryCode) && !$.isNull(bankCode)) {// && !$.isNull(banknodeCode)--ysdp:ZWCW01032830，经赵雪蕊确认去掉网点行号必填的校验--zsj
							tmpYS.bankAccCode = bankAccCode;
							tmpYS.bankAccName = bankAccName;
							tmpYS.bankCode = bankCode;
							tmpYS.bankCategoryCode = bankCategoryCode;
							tmpYS.banknodeCode = banknodeCode;
							tmpYS.province = $(this).find('[name="province"]').val();
							tmpYS.city = $(this).find('[name="city"]').val();
							tmpYS.pbcInterBankNo = $(this).find('[name="pbcInterBankNo"]').val();
							//如果是启用状态则显示停用标志，启用添加hide
							if ($(this).find('td.btnGroup .btnStart').hasClass('hide')) {
								tmpYS.enabled = 1;
							} else {
								tmpYS.enabled = 0;
							}
							aKJYS.push(tmpYS);
							page.maEleCurrentAccist = true;
						} else {
							page.maEleCurrentAccist = false;
							if ($.isNull(bankAccCode)) {
								ufma.showTip('请输入第' + irow + '行的银行账号', function () { }, 'warning');
								return false;
							}
							if ($.isNull(bankAccName)) {
								ufma.showTip('请输入第' + irow + '行的账户名称', function () { }, 'warning');
								return false;
							}
							if ($.isNull(bankCode)) {
								ufma.showTip('请在下拉列表中选择第' + irow + '行的开户行数据', function () { }, 'warning');
								return false;
							}
							if ($.isNull(bankCategoryCode)) {
								ufma.showTip('请在下拉列表中选择第' + irow + '行的银行类别数据', function () { }, 'warning');
								return false;
							}
							/*ysdp:ZWCW01032830，经赵雪蕊确认去掉网点行号必填的校验--zsj
							 * 
							 * if($.isNull(banknodeCode)) {
								ufma.showTip('请输入第' + irow + '行的网点行号', function() {}, 'warning');
								return false;
							}*/
						}
					} else {
						$(this).remove();
					}

				});
				return aKJYS;
			},
			setAccount: function (row) {
				row.find('td .btnSetAccount').on('click', function (e) {
					e.stopPropagation();
					var tempNo = parseInt(row.find('td .recno')[0].innerText)-1;
					var tempList = page.serializeIllegal();
					ufma.open({
						url: 'accountInfo.html',
						title: '选择银行账户',
						width: 1100,
						data: {
							agencyCode : page.agencyCode,
							acctCode:page.acctCode,
							setYear: ma.setYear,
							rgCode: ma.rgCode
						},
						ondestory: function (data) {
							//窗口关闭时回传的值
							$('#currentAccoTab tbody').html('');
							if(tempList.length == 0){
								$.each(data.selectData, function (index, row) {
									if (row) {
										row.index = index;
										page.newIllegalTable(row);
									}
								});
							}else{
								//将弹窗选中的数据带到当前点开的位置 并删掉当前行数据 guohx 
								if(data.selectData.length != 0 ){
									for(var i=0;i<data.selectData.length;i++){
										var delNo
										if(i==0){
											delNo = 1;
										}else{
											delNo = 0;
										}
										tempList.splice(tempNo,delNo,data.selectData[i]);
									}
									$.each(tempList, function (index, row) {
										if (row) {
											row.index = index;
											page.newIllegalTable(row);
										}
									});
								}
							}
							
						}
					});
				});
			},
			//新增账户信息需求--张世洁--end
			onEventListener: function () {
				$('input').on('blur', function () {
					if ($(this).attr('maxlength')) {
						var testRex = /[^\x00-\xff]/ig;
						var msg = $(this).val();
						var strArr = $(this).val().split('');
						var count = 0;
						var twoCount = 0;
						var allCount = 0;
						var maxlength = parseInt($(this).attr('maxlength'));
						var finalLength = 0;
						var realLeng = parseInt(maxlength / 2);
						for (var i = 0; i < msg.length; i++) {
							if ((msg.charCodeAt(i) >= 65 && msg.charCodeAt(i) <= 90) || (msg.charCodeAt(i) >= 97 && msg.charCodeAt(i) <= 122) || (msg.charCodeAt(i) >= 48 && msg.charCodeAt(i) <= 57)) {
								count += 1;
								if (count > maxlength) {
									$(this).val($(this).val().substring(0, maxlength));
								}
							} else {
								twoCount += 1;
								if (twoCount > realLeng) {
									$(this).val($(this).val().substring(0, realLeng));
								}
							}
						}
						allCount = count + parseInt(twoCount * 2);
						if (allCount > maxlength) {
							var oneOver = 0;
							if (count == 0 && twoCount != 0) {
								$(this).val($(this).val().substring(0, realLeng));
							} else if (count != 0 && twoCount == 0) {
								$(this).val($(this).val().substring(0, maxlength));
							} else if (count != 0 && twoCount != 0) {
								if (count % 2 == 0) {
									var twolen = (maxlength - count) / 2;
									finalLength = count + twolen;
									$(this).val($(this).val().substring(0, finalLength));
								} else {
									var twolen = (maxlength - count) / 2 + 1;
									finalLength = count + twolen;
									$(this).val($(this).val().substring(0, finalLength));
								}
							}
						}
					}
				});
				$('#currentAccoMsg').on('click', function () {
					page.newIllegalTable();
				});	
				// $('#chrCode').on('keyup', function(e) {
				//修改往来单位提示不符合编码规则的提示--zsj
				$('#chrCode').on('focus paste keyup', function (e) {
					e.stopepropagation;
					$('#chrCode').closest('.form-group').removeClass('error');
					if (e.keyCode != 8) {
						$(this).val($(this).val().replace(/[^\d]/g, ''));
					}

					if (!ufma.keyPressInteger(e)) {
						if ($(this).val == '') {
							ufma.showInputHelp('chrCode', '<span class="error">' + page.getErrMsg(5) + '</span>');
						}
					}

				}).on('blur', function () {
					var textValue = $(this).val();
					//bugCWYXM-4674--中文输入法输入后直接回车可以录入字母问题--zsj
					$(this).val($(this).val().replace(/[^\d]/g, ''));
					var dmJson = ufma.splitDMByFA(page.fjfa, textValue);
					page.isRuled = dmJson.isRuled;
					page.aInputParentCode = dmJson.parentDM.split(',');
					page.aInputParentCode.pop();
					if ((page.aInputParentCode.length > 0)) {
						page.aInputParentCode = [page.aInputParentCode.pop()];
					} else {
						page.aInputParentCode = [];
					}
					var t = $(this);
					if (textValue.length > 0) {
						page.showParentHelp(textValue, t);
					}

				});
				//往来单位名称
				$('#cEditChrName').on('blur', function () {
					$(this).val($(this).val().replaceAll(/\s+/g, '')) //去除名称中的所有空格
					if ($(this).val() == '') {
						return true;
					} else {
						//71560 --【农业部】辅助核算和会计科目目前不能设置“助记码”--当用户输入名称后，助记码应自动填充由名称首字母的大写字母组成的字符串--zsj
						var chrNameValue = $(this).val();
						ufma.post('/pub/util/String2Alpha', {
							"chinese": chrNameValue
						}, function (result) {
							if (result.data.length > 42) {
								var data = result.data.substring(0, 41);
								$('#assCode').val(data);
							} else {
								$('#assCode').val(result.data);
							}
						});
					}

				});
				//联系方式校验
				$('#cEditPhoneNum').on('blur', function () {
					if ($(this).val() == '') {
						return true;
					}
					if (!ufma.checkTelePhone($(this).val())) {
						ufma.showInputHelp('cEditPhoneNum', '<span class="error">' + page.getErrMsg(10) + '</span>');
						$('#cEditPhoneNum').closest('.form-group').addClass('error');
					} else {
						ufma.hideInputHelp('cEditPhoneNum');
						$('#cEditPhoneNum').closest('.form-group').removeClass('error');
					}
				});
				$("#currentAccoTab").click(function () {
					$("#currentAccoTab").find('input[name="province"]').attr('disabled', true);
					$("#currentAccoTab").find('input[name="city"]').attr('disabled', true);
					$("#currentAccoTab").find('input[name="pbcInterBankNo"]').attr('disabled', true);
					$("#currentAccoTab").find('input[name="banknodeCode"]').attr('disabled', true);
				});
			},
			//编码名称下面的提示
			showHelpTips: function (t) {
				var timeId = setTimeout(function () {
					clearTimeout(timeId)
					if (t.val() == '') {
						ufma.showInputHelp('chrCode', '<span class="error">' + page.getErrMsg(0) + '</span>');
						$('#chrCode').closest('.form-group').addClass('error');
					} else if (!ufma.isNumOrChar(t.val())) {
						ufma.showInputHelp('chrCode', '<span class="error">' + page.getErrMsg(5) + '</span>');
						$('#chrCode').closest('.form-group').addClass('error');
						$('#chrCode').val('');
					} else if ($.inArray(t.val(), page.aParentCode) != -1) {
						ufma.showInputHelp('chrCode', '<span class="error">' + page.getErrMsg(8) + '</span>'); //已存在
						$('#chrCode').closest('.form-group').addClass('error');
					} else if (!page.isRuled) {
						ufma.showInputHelp('chrCode', '<span class="error">' + page.getErrMsg(9) + '' + page.fjfa + '</span>');
						$('#chrCode').closest('.form-group').addClass('error');
					} else if (!ufma.arrayContained(page.aParentCode, page.aInputParentCode)) {
						ufma.showInputHelp('chrCode', '<span class="error">' + page.getErrMsg(3) + '</span>');
						$('#chrCode').closest('.form-group').addClass('error');
					} else {
						ufma.hideInputHelp('chrCode');
						$('#chrCode').closest('.form-group').removeClass('error');
						var obj = {
							"chrCode": t.val(),
							"tableName": 'MA_ELE_CURRENT',
							"eleCode": 'CURRENT',
							"rgCode": ma.rgCode,
							"setYear": ma.setYear,
							"agencyCode": postData.agencyCode,
							"acctCode": page.acctCode
						}
						ma.nameTip = "";
						ufma.ajaxDef("/ma/sys/common/getParentChrFullname", "post", obj, function (result) {
							ma.nameTip = result.data;
						});
					}
				}, 200)
			},
			initfifa: function () {
				page.fjfa = '';
				var callback = function (result) {
					var cRule = result.data.codeRule;
					if (cRule != null && cRule != "") {
						page.fjfa = cRule;
					}
				};
				//              var url = '/ma/sys/element/getElementCodeRule?tableName=MA_ELE_CURRENT';
				var argu = {
					eleCode: 'CURRENT',
					agencyCode: page.agencyCode,
					rgCode: ma.rgCode,
					setYear: ma.setYear
				}
				var url = '/ma/sys/element/getEleDetail';
				ufma.get(url, argu, callback);
			},
			save: function (flagsave) {
				page.saveCurrent();

				//CWYXM-7813--往来单位编辑页面的行政区域输入不符合规则时应该提示错误--zsj
				var distCodeInput = $('#agency-distCode_input').val();
				var distCodeVal = page.distCode.getValue();
				if (!$.isNull(distCodeInput) && $.isNull(distCodeVal)) {
					postData.distCode = '';
					ufma.showTip('该区划不存在，请重新选择', function () { }, 'warning');
					return false;
				} else if (page.required == false) {
					ufma.showTip('单位属性不能为空，请重新选择', function () { }, 'warning');
					return false;
				} else {
					if (page.maEleCurrentAccist == false) {
						return false;
					} else {
						var callback = function (result) {
							cAction = 'save';
							if (flagsave) {
								ufma.showTip(result.msg, function () {
									ufma.hideloading();
									_close(cAction);
								}, result.flag);

							} else {
								ufma.showTip(result.msg, function () {
									ufma.hideloading();
									$('#chrCode').val('').attr('disabled', false);
									$('#cEditChrName').val('');
									$('#assCode').val('');
									$('#lastVer').val('');
									$('#currentAccoTab tbody').html('');
									page.newIllegalTable();
									$("#currentEdit input[type='hidden']").val('');
									ma.fillWithBrother($('#chrCode'), {
										"chrCode": postData.chrCode,
										"eleCode": "CURRENT",
										"agencyCode": page.agencyCode
									});
								}, result.flag);

							}
						}
						var chrFullname = "";
						if (ma.nameTip != null && ma.nameTip != undefined) {
							chrFullname = ma.nameTip + '/' + postData.chrName;
						} else {
							chrFullname = postData.chrName;
						}
						postData.chrFullname = chrFullname;
						postData.agencyCode = window.ownerData.agencyCode;
						postData.acctCode = window.ownerData.acctCode;
						postData.setYear = ma.setYear;
						postData.rgCode = ma.rgCode;
						page.rowEnable = 0;
						var flag = true
						//验证邮箱
						if ($('#cEditEmail').val() != "") {
							var reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/g;
							if (!reg.test($('#cEditEmail').val())) {
								ufma.showTip('邮箱不符合规则！', function () { }, 'warning')
								flag = false
							}
						}
						//传真
						if ($('#cEditFax').val() != '') {
							var regFax = /^(\d{3,4}-)?\d{7,8}$/g;
							if (!regFax.test($('#cEditFax').val())) {
								ufma.showTip('传真不符合规则！', function () { }, 'warning')
								flag = false
							}
						}
						//银行账号
						if ($('#cEditBankAcc').val() != '') {
							var regBank = /^\d{15,19}$/g;
							if (!regBank.test($('#cEditBankAcc').val())) {
								ufma.showTip('银行账号不符合规则！', function () { }, 'warning')
								flag = false
							}
						}
						//营业税号
						if ($('#cEditBusinessTaxNo').val() != '') {
							var regBank = /^[a-zA-Z0-9]+$/g;
							if (!regBank.test($('#cEditBusinessTaxNo').val())) {
								ufma.showTip('营业税号不符合规则！', function () { }, 'warning')
								flag = false
							}
						}
						if (flag) {
							ufma.showloading('数据保存中，请耐心等待...');
							ufma.post(page.baseUrl + "current/save", postData, callback);
						}
					}
				}

			},
			//此方法必须保留
			init: function () {
				page.reslist = ufma.getPermission();
				ufma.isShow(page.reslist);
				page.getattributedata();
				//获取行政区划
				page.getDistTree();
				//根据action判断页面功能，进行不同的操作
				this.initPage();
				page.onEventListener();
				page.initfifa();
				page.required = false;
				page.isAgency = window.ownerData.isAgency;
				page.getBankType();
				if (page.isAgency) {
					//                  page.baseUrl = '/ma/agy/';
					page.baseUrl = '/ma/sys/';
					postData.agencyCode = window.ownerData.agencyCode;
					$('#btn-addlower').hide();
					$('#btn-senddown').hide();
				} else {
					page.baseUrl = '/ma/sys/';
					postData.agencyCode = "*";
				}
				if ($("#currentEdit #chrCode").val().length > 0) {
					page.showParentHelp($("#currentEdit #chrCode").val());
				}
				//点击启用开关事件
				$("#cEnabled label").on("click", function () {
					$(this).addClass("active").siblings().removeClass("active");
				});

				//点击增加下级开关事件
				$("#cAllowAddsub label").on("click", function () {
					$(this).addClass("active").siblings().removeClass("active");
				});

				//点击保存的事件
				$('#btn-save').on('click', function () {
					if (ufma.hasNoError('#currentForm')) {
						page.save(true);
					}
				});

				//点击保存并新增的事件
				$('#btn-save-add').on('click', function () {
					if (ufma.hasNoError('#currentForm')) {
						page.save(false);
						//						window.location.reload();
						//$('#currentEdit form')[0].reset();
						//关闭弹层
						//_close(cAction);

					}
				});

				//点击取消的事件
				$('#btn-cancel').click(function () {
					var tempData = $("#currentForm").serializeObject();
					if (!ufma.jsonContained(page.formdata, tempData)) {
						ufma.confirm('您修改了往来单位信息，关闭前是否保存', function (isOk) {
							if (isOk) {
								if (ufma.hasNoError("#currentForm")) {
									page.save(true);
								}
							} else {
								_close(cAction);
							}
						})
					} else {
						_close(cAction);
					}
				});
				//往来关系只能有一个
				$('label.mt-checkbox-single:first').on('click', function () {
					if ($("input[name='isCustomer']").prop("checked") == false) {
						$("input[name='isCustomer']").prop("checked", true);
						$("input[name='isSupplier']").prop("checked", false);
					}
				})
				$('label.mt-checkbox-single:last').on('click', function () {
					if ($("input[name='isSupplier']").prop("checked") == false) {
						$("input[name='isSupplier']").prop("checked", true);
						$("input[name='isCustomer']").prop("checked", false);
					}
				})
				setTimeout(function () {
					$('#prompt').text('编码规则：' + window.ownerData.ts)
				}, 500)
				ufma.parse();
			}
		}
	}();
	/////////////////////
	page.init();
});