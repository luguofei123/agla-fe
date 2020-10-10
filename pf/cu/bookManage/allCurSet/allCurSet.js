$(function () {
	var agencyCode, acctCode, accoCode, ptData, resetAccoCode = '',
		resetParentGuid = '',
		flag = false;
	var showAccitem = "";
	var balByAccitemArr = "";
	var curencyTree;
	window._close = function () {
		if (window.closeOwner) {
			window.closeOwner();
		}
	};
	var page = function () {
		var isUsed;
		var isBookin;
		agencyCode = window.ownerData.agencyCode;
		return {
			clearState: function () {
				$('#planItemMore').html('');
				$('.btnclick input[type="checkbox"]').removeAttr('checked');
				$('#planItemMoreFZ').html('');
				$('.filterByfzx input[type="checkbox"]').removeAttr('checked');
			},
			onEventListener: function () {
				//输入校验
				$('#accountbookCode').keyup(function () {
					if (!(/^[0-9]{1,42}$/.test($("#accountbookCode").val()))) {
						$("#accountbookCode").val('');
						ufma.showTip('账簿代码请输入数字！！', function () { }, 'warning');
					}
				});
				$('#bankNo').keyup(function () {
					if (!(/^[0-9]{1,42}$/.test($("#bankNo").val()))) {
						$("#bankNo").val('');
						ufma.showTip('银行账号请输入数字！', function () { }, 'warning');
					}
				});
				$('#btnClose').click(function () {
					_close();
				});
				//bug76282--zsj--从总账提取数据设置为：是，则需生成凭证为否，生成凭证时先预览为否；从总账提取数据设置为：否，则需生成凭证为是，生成凭证时先预览可修改；
				$('#isPickdataN').click(function () { //在登记出纳账将隐藏生成按钮和汇总生成按钮
					$('.isVouSign').attr("disabled", 'disabled');
					$('.isPreview').removeAttr("disabled", 'disabled');
					$('#isPreviewY').addClass("active");
					$('#isPreviewN').removeClass("active");
					$('.isCreatevoucher').removeAttr("disabled", 'disabled');
					$('#isCreatevoucherY').addClass("active");
					$('#isCreatevoucherN').removeClass("active");
				});
				//bug76282--zsj--从总账提取数据设置为：是，则需生成凭证为否，生成凭证时先预览为否；从总账提取数据设置为：否，则需生成凭证为是，生成凭证时先预览可修改；
				$('#isPickdataY').click(function () {
					$('.isVouSign').removeAttr("disabled");
					$('.isPreview').attr("disabled", 'disabled');
					$('#isPreviewN').addClass("active");
					$('#isPreviewY').removeClass("active");
					$('.isCreatevoucher').attr("disabled", 'disabled');
					$('#isCreatevoucherY').removeClass("active");
					$('#isCreatevoucherN').addClass("active");
				});
				$('#btnSave').click(function () {
					if (!page.checkForm()) {
						return false;
					}
					var argu = $('#frmBookBfr').serializeObject();
					argu.accountbookGuid = window.ownerData.accountbookGuid || '';
					argu.agencyCode = agencyCode;
					argu.acctCode = acctCode;
					argu.accoCode = accoCode;
					argu.setYear = ptData.svSetYear;
					argu.rgCode = ptData.svRgCode;
					if (window.ownerData.action == "edit") {
						argu.enabled = window.ownerData.enabled;
					}
					var shouaccArr = '';
					$('#planItemMore').find('.checkclass:checked').each(function () {
						var showAcc = '';
						var checklength = $('#planItemMore').find('.checkclass:checked').length;
						for (var i = 0; i < checklength; i++) {
							showAcc = $(this).attr('id');
						}
						shouaccArr += showAcc + ',';
						var shouaccArrlen = shouaccArr.length;
						showAccitem = shouaccArr.substring(0, shouaccArrlen - 1);
					});
					argu = $.extend(argu, {
						needShowAccitem: showAccitem
					});
					//bug78934---出纳登账新增页面增加按照辅助核算查询的科目余额--zsj
					if (page.isBalByAccitem == '1') {
						var balByAccarr = '';
						$('#planItemMoreFZ').find('.checkFZclass:checked').each(function () {
							var balByaccArr = [];
							var balByaccStr = '';
							var checklength = $('#planItemMoreFZ').find('.checkFZclass:checked').length;
							for (var i = 0; i < checklength; i++) {
								balByaccStr = $(this).attr('data-attr');
								balByaccArr = balByaccStr.split('_');
							}
							balByAccarr += balByaccStr + ',';
							var balByaccArrlen = balByAccarr.length;
							balByAccitemArr = balByAccarr.substring(0, balByaccArrlen - 1);
						});
						if (!$.isNull(balByAccitemArr)) {
							argu = $.extend(argu, {
								isBalByAccitem: page.isBalByAccitem,
								balByAccitem: balByAccitemArr
							});

						} else {
							ufma.showTip('请选择过滤余额对应的辅助核算项', function () { }, 'warning');
							return false;
						}

					} else if (page.isBalByAccitem == '0') {
						argu = $.extend(argu, {
							isBalByAccitem: page.isBalByAccitem,
							balByAccitem: ''
						});
					}
					if ($('#accountbookType').getObj().getValue() == '2' || $('#accountbookType').getObj().getValue() == '3') {
						argu.remark = argu.remarkLong;
					}
					delete argu.remarkLong;
					ufma.post('/cu/cuAccountBook/save', argu, function (result) {
						flag = result.flag;
						if (flag == "fail") {
							ufma.showTip('保存失败！', function () { }, 'warning');
						} else if (flag == "success") {
							ufma.showTip('保存成功！', function () {
								_close();
							}, 'success');
						}
					});
				});
				$("#accountbookName").on('keyup', function () {
					var len = page.getStrLength(this.value);
					if (len > 100) {
						this.value = page.cut_str(this.value, len, 100);
						len = page.getStrLength(this.value);
					}
				});
				$("#remark").on('keyup', function () {
					var len = page.getStrLength(this.value);
					if (len > 200) {
						this.value = page.cut_str(this.value, len, 200);
						len = page.getStrLength(this.value);
					}
				});

			},
			// 中文字符判断
			getStrLength: function (str) {
				var len = str.length;
				var reLen = 0;
				for (var i = 0; i < len; i++) {
					if (str.charCodeAt(i) < 27 || str.charCodeAt(i) > 126) {
						// 全角    
						reLen += 2;
					} else {
						reLen++;
					}
				}
				return reLen;
			},
			// 截取字符（中英文）
			cut_str: function (stbr, strLen, maxLen) {
				var reLen = 0;
				var a = 0;
				for (var i = 0; i < strLen; i++) {
					if (stbr.charCodeAt(i) < 27 || stbr.charCodeAt(i) > 126 || stbr.charCodeAt(i) > 255) {
						// 全角和非英文  
						reLen += 2;
					} else {
						reLen++;
					}
					if (reLen >= maxLen) {
						a = i - (reLen - maxLen) + 1;
						break;
					}
				}
				return stbr.substring(0, a);
			},
			getAccoCode: function () {
				var bookType = $('#accountbookType').getObj().getValue(),
					accoType;
				if (bookType == '1') { //现金
					accoType = 1;
				} else if (bookType == '2') { //银行
					accoType = 2;
				} else if (bookType == '3') { //零余额
					accoType = 3
				}
				var argu = {
					'acctCode': acctCode,
					'agencyCode': agencyCode,
					'setYear': ptData.svSetYear,
					'rgCode': ptData.svRgCode,
					'accoType': accoType
				}
				ufma.post('/cu/common/coaAcc/getAccoList', argu, function (result) {
					$("#accoCode").ufTreecombox({
						valueField: "code",
						textField: "codeName",
						placeholder: "请选择会计科目",
						leafRequire: false,
						data: result.data,
						onChange: function (sender, data) {
							if (!$.isNull(data.defCurCode) && (window.ownerData.action == "add")) {
								for (var i = 0; i < curencyTree.length; i++) {
									if (data.defCurCode == curencyTree[i].code) {
										$("#curCode").getObj().setValue(curencyTree[i].code, curencyTree[i].codeName);
									} else {
										$("#curCode").getObj().clear();
									}
								}
							}
							page.clearState();
							accoCode = data.code;
							//辅助核算项变化时更多展示变化
							var argu = {
								"acctCode": acctCode,
								"accoCode": accoCode,
								"agencyCode": agencyCode,
								"setYear": ptData.svSetYear,
								"rgCode": ptData.svRgCode,
							};
							var url = '/cu/common/getAccoItems';
							ufma.post(url, argu, function (result) {
								if (result.data != null) {
									items = result.data;
									page.items = items;
									if (page.items.length > 0) {
										$('.filterByfzx').removeClass('hide');
									} else {
										$('.filterByfzx').addClass('hide');
									}
									var $curRow = $('#planItemMore');
									//bug78934---出纳登账新增页面增加按照辅助核算查询的科目余额--zsj
									var $curRowfz = $('#planItemMoreFZ');
									$curRow.html('');
									$curRowfz.html('');
									for (var i = 0; i < items.length; i++) {
										var item = items[i];
										if (!$.isNull(item.accitemCode)) { //勾选后默认为“是”，不勾选时“是否不可以操作”
											//双列
											$curgroup = $('<div class="form-group btnclick"style="margin-top:8px;width:28em;margin-left:-4em;"></div>').prependTo($curRow);
											var $formCtrl = $('<input class="checkclass" id="' + item.accitemCode + '"type="checkbox" style="margin-left:25px;margin-right:3px;">' + item.eleName + '</input>').appendTo($curgroup);
											$('<div class="labelclass" style="width:12em;margin-top:-22px;margin-left:13em;"><label style="margin-left:5px;margin-right:3px;font-weight:400;">是否必填：</label><div class="control-element"><div class="btn-group radio-group ' + item.accitemCode + '" data-toggle="buttons"><label  disabled="disabled" class="btn btn-default btn-sm lableY ' + item.accitemCode + '"><input type="radio" class="toggle" name="' + item.accitemCode + '" value="1"> 是</label><label  disabled="disabled" class="btn btn-default btn-sm lableN ' + item.accitemCode + '"><input type="radio" class="toggle" name="' + item.accitemCode + '" value="0"> 否</label></div></div></div></div>').appendTo($curgroup);
											//bug78934---出纳登账新增页面增加按照辅助核算查询的科目余额--zsj
											$curgroupFZ = $('<div class="form-group btnFZclick"style="margin-top:8px;width:16em;margin-left:-4em;"></div>').prependTo($curRowfz);
											var $formCtrlFZ = $('<input class="checkFZclass" disabled="disabled" id="fz_' + item.accitemCode + '" data-attr="' + item.accitemCode + '" type="checkbox" style="margin-left:25px;margin-right:3px;">' + item.eleName + '</input>').appendTo($curgroupFZ);
										}
									}
									page.equlCheck();
									//	page.onEventListener();
									$('.btnclick').find("input[type='checkbox']").click(function () {
										var checklick = $(this).attr("id");
										if ($(this).is(':checked') == true) {
											$('.' + checklick).removeAttr('disabled');
											$('.' + checklick + ' .lableY').addClass('active');
											$('.' + checklick + ' .lableN').removeClass('active');
										} else {
											$('.' + checklick).attr('disabled', "disabled");
											$('.' + checklick + ' .lableY').removeClass('active');
											$('.' + checklick + ' .lableN').removeClass('active');
										}
									});
									page.equlFZCheck();
									//bug78934---出纳登账新增页面增加按照辅助核算查询的科目余额--zsj
									$('.filterByfzx').find("input[type='checkbox']").click(function () {
										var checklick = $(this).attr("id");
										if ($(this).is(':checked') == true) {
											page.isBalByAccitem = '1';
											$('.' + checklick).removeAttr('disabled');
											$('.checkFZclass').removeAttr('disabled');
										} else {
											page.isBalByAccitem = '0';
											$('.' + checklick).attr('disabled', "disabled");
											$('.checkFZclass').attr('disabled', "disabled");
											$('.checkFZclass').removeProp('checked');
										}
									});
								}
							});
							if (!$.isNull($("#accountbookType").getObj().getValue())) {
								//关于上级账簿逻辑,由于保存账簿接口,上级账簿必须传parentGuid才可以,所以用accountbookGuid成树 编辑回看的时候用全局变量临时保存来显示 guohx 20191128
								var arguprant = {
									'agencyCode': window.ownerData.agencyCode,
									'acctCode': $('#acctCode').getObj().getValue(),
									'setYear': ptData.svSetYear,
									'rgCode': ptData.svRgCode,
									'accountbookType': $("#accountbookType").getObj().getValue(),
									'accoCode': $('#accoCode').getObj().getValue()
								}
								ufma.post("/cu/cuAccountBook/selectParentBooks", arguprant, function (result) {
									$('#parentGuid').ufTreecombox({
										idField: 'accountbookGuid', //可选    guohx  修改 账簿树对应id
										textField: 'accountbookName', //可选
										pIdField: 'parentGuid', //可选
										placeholder: '请选择上级账簿',
										data: result.data,
										onChange: function (sender, data) {
											$('#parentGuid').val(data.accountbookGuid);
										},
										onComplete: function (sender, data) {
											console.log(data);
											$("#parentGuid").getObj().val(resetParentGuid);
											//清除重置上级账簿数据
											resetParentGuid = ''
										}
									});
								});
							}
						},
						onComplete: function (sender, data) {
							flag = true
							if (!$.isNull(window.ownerData.accountbookGuid)) {
								$("#accoCode").getObj().val(resetAccoCode);
								//清除重置会计科目
								resetAccoCode = '';
							}
						}
					});
				});
			},
			checkForm: function () {
				var msg = '';
				if ($("#accountbookType").getObj().getValue() == '') {
					msg = '请选择账簿类型！';
				} else if ($("#accountbookCode").val() == '') {
					msg = '请输入账簿编码！';
				} else if ($("#accountbookName").val() == '') {
					msg = '请输入账簿名称！';
				} else if ($("#acctCode").getObj().getValue() == '') {
					msg = '请选择账套！';
				} else if ($("#accoCode").getObj().getValue() == '') {
					msg = '请选择科目！';
				}
				if (msg != '') {
					ufma.showTip(msg, function () { }, 'error');
					return false;
				}
				return true;
			},
			checkIsUsed: function () {
				//是否已使用
				ufma.ajaxDef("/cu/cuAccountBook/isUsed/" + window.ownerData.accountbookGuid, "post", {}, function (result) {
					page.isUsed = result.data;
				});
			},
			checkBookin: function () {
				//是否已登账
				ufma.ajaxDef("/cu/cuAccountBook/isCuJournalByBookGuid/" + window.ownerData.accountbookGuid, "get", {}, function (result) {
					page.isBookin = result.data;
				});
			},
			equlCheck: function () {
				var equlArr = [];
				var needArr = window.ownerData.needShowAccitem;
				var requiredAccarray = window.ownerData.requiredAccitem;
				if (!$.isNull(page.items)) {
					for (var i = 0; i < page.items.length; i++) {
						var itemarr = page.items[i].accitemCode;
						equlArr.push(itemarr);
					}
				}
				if (!$.isNull(needArr)) {
					for (var j = 0; j < equlArr.length; j++) {
						for (var k = 0; k < needArr.length; k++) {
							if (needArr[k] == equlArr[j]) {
								$('#' + equlArr[j]).attr("checked", "checked");
								if ($('#' + equlArr[j]).is(':checked') == true) {
									$('.' + equlArr[j]).removeAttr('disabled');
									if ($('#' + equlArr[j]).hasClass('active')) {
										var valueARR = $('#' + equlArr[j]).attr('value');
									}
								}
							}
						}
					}
				}

				for (var j = 0; j < needArr.length; j++) {
					var needArrid = needArr[j];
					if (!$.isNull(needArrid)) {
						$('.' + needArrid + ' .lableN').addClass('active');
						$('.' + needArrid + ' .lableY').removeClass('active');
					}
				}
				for (var i = 0; i < requiredAccarray.length; i++) {
					var requiredAccid = requiredAccarray[i];
					if (!$.isNull(requiredAccid)) {
						$('.' + requiredAccid + ' .lableY').addClass('active');
						$('.' + requiredAccid + ' .lableN').removeClass('active');
					}
				}
			},
			//bug78934---出纳登账新增页面增加按照辅助核算查询的科目余额--zsj
			equlFZCheck: function () {
				var equlFZArr = [];
				var balByAccitemArr = window.ownerData.balByAccitem;
				var isBalByAccitem = window.ownerData.isBalByAccitem;
				if (!$.isNull(page.items)) {
					for (var i = 0; i < page.items.length; i++) {
						var itemarr = page.items[i].accitemCode;
						equlFZArr.push(itemarr);
					}
				}
				if (isBalByAccitem == '0') {
					$('.filterByfzx input:checkbox').removeAttr("checked");
					$('.checkFZclass').attr('disabled', "disabled");
				} else if (isBalByAccitem == '1') {
					$('.filterByfzx input:checkbox').prop("checked", "checked");
					$('.checkFZclass').removeAttr('disabled');
				}
				if (!$.isNull(balByAccitemArr)) {
					for (var j = 0; j < equlFZArr.length; j++) {
						for (var k = 0; k < balByAccitemArr.length; k++) {
							if (balByAccitemArr[k] == equlFZArr[j]) {
								$('#fz_' + equlFZArr[j]).attr("checked", "checked");
							}
						}
					}
				}
			},
			//获取系统选项-账簿按一个套编号
			checkIsOneNo: function () {
				//ufma.ajaxDef("/cu/sysRgpara/getBooleanByChrCode/CU001", "get", {}, function (result) {
				ufma.ajaxDef("/cu/sysRgpara/getBooleanByChrCode/CU001" + "/" + agencyCode, "get", {}, function (result) { //CWYXM-11399 --系统管理-系统选项，出纳是否显示账套，设置为单位级控制，但仍然是由系统级控制--zsj
					var isOneNo = result.data;
					if ((isOneNo) || (page.isBookin)) {
						$('#numTypeY').addClass("active");
						$('#numTypeN').removeClass("active");
						$('.numType').attr("disabled", 'disabled');
					} else {
						$('#numTypeY').removeClass("active");
						$('#numTypeN').addClass("active");
						$('.numTypeN').removeAttr("disabled", 'disabled');
					}
				});
			},
			initPage: function () {
				page.reslist = ufma.getPermission();
				ufma.isShow(page.reslist);
				if (!$.isNull(window.ownerData.accountbookGuid)) {
					page.checkIsUsed();
					page.checkBookin();
				}
				page.checkIsOneNo();
				page.clearState();
				//编辑的时候判断样式，写在上面防止出现闪动
				if (window.ownerData.type == '2' || window.ownerData.type == '3') {
					$('#topBox').css("height", '340px');
					$('.allCash').css('display', 'none');
					$('.bankPocket').css('display', 'block');
				} else {
					$('#topBox').css("height", '200px');
					$('.bankPocket').css('display', 'none');
					$('.allCash').css('display', 'block');
				}

				//编辑调用数据
				if (!$.isNull(window.ownerData.accountbookGuid)) {
					ufma.post("/cu/cuAccountBook/select/" + window.ownerData.accountbookGuid, {}, function (result) {
						$('#frmBookBfr').setForm(result.data);
						//bug76282--zsj
						if (page.isUsed) {
							//下拉框禁用
							$('#acctCode').getObj().setEnabled(false);
							$('#accoCode').getObj().setEnabled(false);
							$('#parentGuid').getObj().setEnabled(false);
							//input禁用
							$('#accountbookCode').attr("disabled", 'disabled');
							$('#accountbookName').attr("disabled", 'disabled');
						}
						if (page.isBookin) {
							$('#curCode').getObj().setEnabled(false);
						}
						//resetAccoCode 编辑时的会计科目
						resetAccoCode = result.data.accoCode;
						resetParentGuid = result.data.parentGuid;
						var remarkLong = result.data.remark; //解决bug74661--备注为空--zsj
						$('input[name=remarkLong]').val(remarkLong);
						page.isBalByAccitem = window.ownerData.isBalByAccitem;
					});
				}
				ufma.get('/cu/common/getEleTree?agencyCode=' + agencyCode + '&eleCode=SETMODE&rgCode=' + ptData.svRgCode + '&setYear=' + ptData.svSetYear, {}, function (result) {
					$('#setmodeCode').ufTreecombox({
						idField: 'code', //可选
						textField: 'codeName', //可选
						placeholder: "请选择结算方式",
						data: result.data,
						onChange: function (sender, data) {

						},
						onComplete: function (sender, data) { }
					});
				});

				ufma.get('/cu/common/getEleTree?agencyCode=' + agencyCode + '&eleCode=CURRENCY&rgCode=' + ptData.svRgCode + '&setYear=' + ptData.svSetYear, {}, function (result) {
					curencyTree = result.data;
					$('#curCode').ufTreecombox({
						idField: 'code',
						textField: 'codeName',
						placeholder: "请选择币种",
						data: result.data,
						onChange: function (sender, data) {

						},
						onComplete: function (sender, data) { }
					});
				});

				ufma.get('/cu/enumerate/ACCOUNTBOOK_TYPE', {}, function (result) {
					$('#accountbookType').ufTreecombox({
						idField: 'ENU_CODE', //可选
						textField: 'codeName', //可选
						placeholder: "请选择账簿类型",
						data: result.data,
						onChange: function (sender, data) {
							$('#planItemMore').html('');
							if (data.ENU_CODE == '2' || data.ENU_CODE == '3') {
								$('#topBox').css("height", '340px')
								$('.allCash').css('display', 'none')
								$('.bankPocket').css('display', 'block')
							} else {
								$('#topBox').css("height", '200px')
								$('.bankPocket').css('display', 'none')
								$('.allCash').css('display', 'block')
							}

							if (flag) {
								page.getAccoCode();
							}
						},
						onComplete: function (sender, data) {
							if ((!$.isNull(window.ownerData.accountbookGuid) && (page.isUsed))) {
								//已使用的不可选
								$('#accountbookType').getObj().setEnabled(false);
							} else {
								if ($.isNull(window.ownerData.accountbookGuid)) {
									//新增时默认选择现金账簿
									$("#accountbookType").getObj().val(1);
								}
							}
						}
					});
				});

				ufma.get("/cu/common/eleCoacc/getCoCoaccs/" + agencyCode, {}, function (result) {
					$('#acctCode').ufTreecombox({
						idField: 'code',
						textField: 'codeName',
						placeholder: '请选择账套',
						data: result.data,
						onChange: function (sender, data) {
							acctCode = data.code;
							page.getAccoCode();
						},
						onComplete: function (sender, data) { }
					});

				})

			},

			init: function () {
				//初始化会计科目
				$("#accoCode").ufTreecombox({
					valueField: "code",
					textField: "codeName",
					readonly: true,
					placeholder: "请选择会计科目",
					data: ''
				});
				$('#parentGuid').ufTreecombox({
					idField: 'accountbookGuid', //可选    guohx  修改 账簿树对应id
					textField: 'accountbookName', //可选
					pIdField: 'parentGuid', //可选
					placeholder: '请选择上级账簿',
					data: ''
				});
				ptData = ufma.getCommonData();
				ufma.parseScroll();
				ufma.parse();
				//数据调用
				this.initPage();
				this.onEventListener();

			}
		}
	}();

	page.init();
});