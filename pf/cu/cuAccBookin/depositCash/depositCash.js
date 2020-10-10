$(function() {
	window._close = function() {
		if(window.closeOwner) {
			window.closeOwner();
		}
	};
	var page = function() {
		var ptData = {};
		var cashData, bookData, zeroData, cashguid, bankguid, zeroguid;
		var resultObj = {};
		var dataOne, dataTwo, dataThree;
		var items;
		var cashNeedShowAcc, otherNeedShowAcc;
		var treeArry = [];
		var accitemArr;
		return {
			//转换为驼峰
			shortLineToTF: function(str) {
				var arr = str.split("_");
				for(var i = 0; i < arr.length; i++) {
					arr[i] = arr[i].toLowerCase()
				}
				for(var i = 1; i < arr.length; i++) {
					arr[i] = arr[i].toLowerCase()
					arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].substring(1);
				}
				return arr.join("");
			},
			cacheDataRun: function(setting) {
				setting.callback = setting.callback || function(data) {};
				setting.cached = setting.cached || false;
				var callback = setting.callback;
				var data;
				if(setting.cached) {
					if($.isNull(setting.cacheId)) {
						callback();
						return false;
					}
					data = uf.getObjectCache(setting.cacheId);
				}
				if(!$.isNull(data)) {
					if(setting.hasOwnProperty('element')) {
						callback(setting.element, data, setting.eleName);
					} else {
						callback(data);
					}
				} else {
					setting.param = setting.param || {};
					if($.isNull(setting.url)) return false;
					$.ufajax(setting.url, 'get', setting.param, function(result) {
						if(result.hasOwnProperty('data')) {
							uf.setObjectCache(setting.cacheId, result.data);
							if(setting.hasOwnProperty('element')) {
								callback(setting.element, result.data, setting.eleName);
							} else {
								callback(result.data);
							}

						} else {
							alert('错误的数据格式!');
						}
					});
				}
			},
			//判断辅助核算项是否必填
			requiredACC: function() {
				var requiredACC = accitemArr;
				for(var i = 0; i < accitemArr.length; i++) {
					var requiredACCid = accitemArr[i];
					$('#' + requiredACCid).addClass("required");
				}
			},
			//获取辅助核算树
			getSameFz: function() {
				var arguFZ = {
					bookGuid1: cashNeedShowAcc,
					bookGuid2: otherNeedShowAcc
				}
				dm.getEqulfz(arguFZ, function(result) {
					if(result.data != null) {
						items = result.data.NEED; //获取辅助核算项
						accitemArr = result.data.REQUIRED; //获取必填辅助核算项
					}
					var $curRow = $('#planItemMore');
					$curRow.html('');
					for(var i = 0; i < items.length; i++) {
						var item = items[i];
						var itemEle = page.shortLineToTF(item.accitemCode) + 'Code'
						if(!$.isNull(itemEle)) {
							$curgroup = $('<div class="form-group" id="' + item.accitemCode + '"style="margin-top:10px;width:22em;margin-left:-3px;margin-right:18px;"></div>').prependTo($curRow);
							$('<lable class="control-label auto" data-toggle= "tooltip" title="' + item.eleName + '" style="display:inline-block;width:100px;text-align: right;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">' + item.eleName + '：</lable>').appendTo($curgroup);
							var formCtrl = $('<div class="control-element uf-treecombox" id="' + itemEle + '" name="' + itemEle + '"style=" width:200px;margin-left:5px;margin-top:-8px;"></div>').appendTo($curgroup);
							var param = {};
							param['agencyCode'] = window.ownerData.agencyCode;
							param['setYear'] = window.ownerData.setYear;
							param['eleCode'] = item.eleCode;
							treecombox = $('#' + itemEle);
							page.cacheDataRun({
								element: treecombox,
								cacheId: param['agencyCode'] + param['eleCode'],
								url: dm.getCtrl('fzhxs'),
								param: param,
								eleName: item.eleName,
								callback: function(ele, data, tmpEleName) {
									$(ele).ufTreecombox({ //初始化
										data: data, //列表数据
										idField: 'code',
										textField: 'codeName',
										pIdField: 'pCode',
										readonly: false,
										leafRequire: true,
										placeholder: "请选择" + tmpEleName,
										onComplete: function(sender) {
											$('#frmBookIn').setForm(window.ownerData.oneData);
											page.requiredACC();
										}
									});
								}
							});
							var sId = item.accitemCode;
							$('#' + sId).off("keyup").on("keyup", function(e) {
								if(e.keyCode == 8) { //退格键，支持删除
									e.stopPropagation();
									var subId = $(e.target).attr("id").replace("_input_show", "");
									subId = subId.replace("_input", "");
									$('#' + subId + '_value').val('');
									$('#' + subId + '_input').val('');
									$('#' + subId + '_input_show').val('');
									$('#' + subId + '_text').val('');
								}
							});
							treeArry.push(sId);
						}
					}
				});
			},
			//凭证类型--zsj--bug80697 【20190605 广东省财政厅】手工登账的日记账界面的凭证号无法手工录入
			getVoutype: function () {
				var agencyCode = window.ownerData.agencyCode;
				var acctCode = window.ownerData.acctCode;
				var setYear = window.ownerData.setYear;
				var accaCode = '*';
				var vouUrl = '/cu/eleVouType/getVouType' + '/' + agencyCode + '/' + setYear + '/' + acctCode + '/' + accaCode;
				ufma.get(vouUrl, '', function (result) {
					var data = result.data;
					vouTypeArray = {};
					//循环把option填入select
					var $vouTypeOp = '<option value="">  </option>';
					for (var i = 0; i < data.length; i++) {
						//创建凭证类型option节点
						vouTypeArray[data[i].code] = data[i].name;
						$vouTypeOp += '<option value="' + data[i].code + '">' + data[i].name + '</option>';
					}
					$('#vouType').html($vouTypeOp);
				});
			},
			//获取现金账簿
			initBook: function() {
				var argu = {
					agencyCode: window.ownerData.agencyCode,
					accountbookType: "1"
				};
				if(window.ownerData.isNeedAcct) {
					argu.acctCode = window.ownerData.acctCode;
				}
				dm.cashTake(argu, function(result) {
					//ufma.showloading('正在加载数据，请耐心等待...');
					cashData = result.data;
					for(var i = 0; i < cashData.length; i++) {
						cashguid = cashData[i].ID;
						resultObj[cashguid] = cashData[i];
					}
					$('#cashBook').ufTreecombox({
						valueField: cashguid,
						idField: 'ID', //可选
						textField: 'accountbookName', //可选
						readonly: false,
						pIdField: 'PID', //可选
						placeholder: '请选择现金账簿',
						leafRequire: true, //不可选父级
						data: result.data,
						onChange: function(sender, data) {
							// page.initBookType();
							cashGuid = $(this).attr('valueField');
							//控制摘要必填*显示
							dataOne = '';
							dataOne = $('#cashBook').getObj().getValue();
							if($('#bankType').hasClass('selected')) {
								dataThree = '';
							} else if($('#zeroType').hasClass('selected')) {
								dataTwo = '';
							}
							cashNeedShowAcc = '';
							cashNeedShowAcc = dataOne;
							$('#planItemMore').html('');
							if(window.ownerData.flag == "tixian"){
								page.getJouNo();
							}
							page.getSameFz();
							page.cashAcctCode = data.ACCT_CODE;
							if(!$.isNull(dataOne)) {
								if($.isNull(dataTwo) && $.isNull(dataThree)) {
									if(resultObj[dataOne].IS_SUMMARYNEED == "1") {
										$('#summaryNeed').addClass("required");
									} else if(resultObj[dataOne].IS_SUMMARYNEED == "0") {
										$('#summaryNeed').removeClass("required");
									}
									//经办人是否必填--zsj--CWYXM-10502
									if(resultObj[dataOne].IS_DEAL_WITH == "1") {
										$('.dealWithClass').addClass("required");
									} else if(resultObj[dataOne].IS_DEAL_WITH == "0") {
										$('.dealWithClass').removeClass("required");
									}
									page.initBookType(page.cashAcctCode);
								} else if(!$.isNull(dataTwo) && $.isNull(dataThree)) {
									if(resultObj[dataOne].IS_SUMMARYNEED == "1" || resultObj[dataTwo].IS_SUMMARYNEED == "1") {
										$('#summaryNeed').addClass("required");
									} else if(resultObj[dataOne].IS_SUMMARYNEED == "0" && resultObj[dataTwo].IS_SUMMARYNEED == "0") {
										$('#summaryNeed').removeClass("required");
									}
									//经办人是否必填--zsj--CWYXM-10502
									if(resultObj[dataOne].IS_DEAL_WITH == "1" || resultObj[dataTwo].IS_DEAL_WITH == "1") {
										$('.dealWithClass').addClass("required");
									} else if(resultObj[dataOne].IS_DEAL_WITH == "0" && resultObj[dataTwo].IS_DEAL_WITH == "0") {
										$('.dealWithClass').removeClass("required");
									}
									otherNeedShowAcc = '';
									otherNeedShowAcc = dataTwo;
									//解决切换现金账簿，银行账簿不根据账套筛选过滤的问题 guohx 20200214
									page.initBookType(page.cashAcctCode);
								} else if($.isNull(dataTwo) && !$.isNull(dataThree)) {
									if(resultObj[dataOne].IS_SUMMARYNEED == "1" || resultObj[dataThree].IS_SUMMARYNEED == "1") {
										$('#summaryNeed').addClass("required");
									} else if(resultObj[dataOne].IS_SUMMARYNEED == "0" && resultObj[dataThree].IS_SUMMARYNEED == "0") {
										$('#summaryNeed').removeClass("required");
									}
									//经办人是否必填--zsj--CWYXM-10502
									if(resultObj[dataOne].IS_DEAL_WITH == "1" || resultObj[dataThree].IS_DEAL_WITH == "1") {
										$('.dealWithClass').addClass("required");
									} else if(resultObj[dataOne].IS_DEAL_WITH == "0" && resultObj[dataThree].IS_DEAL_WITH == "0") {
										$('.dealWithClass').removeClass("required");
									}
									otherNeedShowAcc = '';
									otherNeedShowAcc = dataThree;
									//解决切换现金账簿，零余额账簿不根据账套筛选过滤的问题 guohx 20200214
									page.initZeroType();
								}
							}

						},
						onComplete: function(sender) {
							//bug77574--zsj
							if(window.ownerData.accountbookGuid) {
								$('#cashBook').getObj().val(window.ownerData.accountbookGuid);
								dataOne = window.ownerData.accountbookGuid;
								cashNeedShowAcc = dataOne;
								otherNeedShowAcc = '';
								page.getSameFz();
							}
						}
					});
				});
			},
			//获取银行账簿
			initBookType: function(acctCode) {
				var argu = {
					agencyCode: window.ownerData.agencyCode,
					accountbookType: "2"
				};
				if(window.ownerData.isNeedAcct) {
					argu.acctCode = window.ownerData.acctCode;
				} else {
					argu.acctCode = acctCode;
				}
				dm.bankTake(argu, function(result) {
					bookData = result.data;
					for(var i = 0; i < bookData.length; i++) {
						bankguid = bookData[i].ID;
						resultObj[bankguid] = bookData[i];
					}
					$('#bankBook').ufTreecombox({
						valueField: bankguid,
						idField: 'ID', //可选
						textField: 'accountbookName', //可选
						readonly: false,
						pIdField: 'PID', //可选
						placeholder: '请选择银行账簿',
						leafRequire: true,
						data: result.data,
						onChange: function(sender, data) {
							bankGuid = $(this).attr('valueField');
							//控制摘要必填*显示
							dataTwo = '';
							dataTwo = $('#bankBook').getObj().getValue();
							if(!$.isNull(resultObj[dataOne]) && !$.isNull(resultObj[dataTwo])) {
								if(resultObj[dataOne].IS_SUMMARYNEED == "1" || resultObj[dataTwo].IS_SUMMARYNEED == "1") {
									$('#summaryNeed').addClass("required");
								} else if(resultObj[dataOne].IS_SUMMARYNEED == "0" && resultObj[dataTwo].IS_SUMMARYNEED == "0") {
									$('#summaryNeed').removeClass("required");
								}
								//经办人是否必填--zsj--CWYXM-10502
								if(resultObj[dataOne].IS_DEAL_WITH == "1" || resultObj[dataTwo].IS_DEAL_WITH == "1") {
									$('.dealWithClass').addClass("required");
								} else if(resultObj[dataOne].IS_DEAL_WITH == "0" && resultObj[dataTwo].IS_DEAL_WITH == "0") {
									$('.dealWithClass').removeClass("required");
								}
							} else if($.isNull(resultObj[dataOne]) && !$.isNull(resultObj[dataTwo])) {
								if(resultObj[dataTwo].IS_SUMMARYNEED == "1") {
									$('#summaryNeed').addClass("required");
								} else if(resultObj[dataTwo].IS_SUMMARYNEED == "0") {
									$('#summaryNeed').removeClass("required");
								}
								//经办人是否必填--zsj--CWYXM-10502
								if(resultObj[dataTwo].IS_DEAL_WITH == "1") {
									$('.dealWithClass').addClass("required");
								} else if(resultObj[dataTwo].IS_DEAL_WITH == "0") {
									$('.dealWithClass').removeClass("required");
								}
							}
							if(window.ownerData.flag == "cunxian"){
								page.getJouNo();
							}
							otherNeedShowAcc = '';
							cashNeedShowAcc = '';
							otherNeedShowAcc = dataTwo;
							cashNeedShowAcc = dataOne;
							$('#planItemMore').html('');
							page.getSameFz();
						},
						onComplete: function(sender) {
							//lsr 0725 提现保存银行账簿为空
							if(!$.isNull(result.data) && result.data.length > 1) {
								/*for(var i = 1; i < result.data.length; i++) {
									obj = result.data[1];
									if(obj.ID == result.data[i].PID && result.data[i].isLeaf == 1) {
										obj = result.data[i];
										break;
									} else {
										obj = result.data[i];
									}
								}
								if(obj != null) {
									$('#bankBook').getObj().val(obj.ID);
									dataTwo = obj.ID;
									cashNeedShowAcc = '';
									otherNeedShowAcc = dataTwo;
									page.getSameFz();
								}*/
								//CWYXM-8670 --出纳管理-登记出纳账，提现和存现，现金、银行账簿，需要默认选择同一个账套下的账簿--zsj
								for(var i = 0; i < result.data.length; i++) {
									obj = result.data[i];
									if(obj.isLeaf == 1) {
										$('#bankBook').getObj().val(obj.ID);
										dataTwo = obj.ID;
										break;
									}
								}
								cashNeedShowAcc = '';
								otherNeedShowAcc = dataTwo;
								page.getSameFz();

							}
						}
					});
				});
			},
			//获取零余额账簿
			initZeroType: function() {
				var argu = {
					agencyCode: window.ownerData.agencyCode,
					accountbookType: "3"
				};
				//CWYXM-8670 --出纳管理-登记出纳账，提现和存现，现金、银行账簿，需要默认选择同一个账套下的账簿--当获取系统选项-各界面需选择账套，那么需要加账套参数--zsj
				if(window.ownerData.isNeedAcct) {
					argu.acctCode = window.ownerData.acctCode;
				} else {
					argu.acctCode = page.cashAcctCode;
				}
				dm.zeroTake(argu, function(result) {
					zeroData = result.data;
					for(var i = 0; i < zeroData.length; i++) {
						zeroguid = zeroData[i].ID;
						resultObj[zeroguid] = zeroData[i];
					}
					$('#zeroBook').ufTreecombox({
						valueField: zeroguid,
						idField: 'ID', //可选
						textField: 'accountbookName', //可选
						readonly: false,
						pIdField: 'PID', //可选
						placeholder: '请选择零余额账簿',
						data: result.data,
						leafRequire: true,
						onChange: function(sender, data) {
							zeroGuid = $(this).attr('valueField');
							//控制摘要必填*显示
							dataThree = '';
							dataThree = $('#zeroBook').getObj().getValue();
							if(!$.isNull(resultObj[dataOne]) && !$.isNull(resultObj[dataThree])) {
								if(resultObj[dataOne].IS_SUMMARYNEED == "1" || resultObj[dataThree].IS_SUMMARYNEED == "1") {
									$('#summaryNeed').addClass("required");
								} else if(resultObj[dataOne].IS_SUMMARYNEED == "0" && resultObj[dataThree].IS_SUMMARYNEED == "0") {
									$('#summaryNeed').removeClass("required");
								}
								//经办人是否必填--zsj--CWYXM-10502
								if(resultObj[dataOne].IS_DEAL_WITH == "1" || resultObj[dataThree].IS_DEAL_WITH == "1") {
									$('.dealWithClass').addClass("required");
								} else if(resultObj[dataOne].IS_DEAL_WITH == "0" && resultObj[dataThree].IS_DEAL_WITH == "0") {
									$('.dealWithClass').removeClass("required");
								}
							} else if($.isNull(resultObj[dataOne]) && !$.isNull(resultObj[dataThree])) {
								if(resultObj[dataThree].IS_SUMMARYNEED == "1") {
									$('#summaryNeed').addClass("required");
								} else if(resultObj[dataThree].IS_SUMMARYNEED == "0") {
									$('#summaryNeed').removeClass("required");
								}
								//经办人是否必填--zsj--CWYXM-10502
								if(resultObj[dataThree].IS_DEAL_WITH == "1") {
									$('.dealWithClass').addClass("required");
								} else if(resultObj[dataThree].IS_DEAL_WITH == "0") {
									$('.dealWithClass').removeClass("required");
								}
							}
							if(window.ownerData.flag == "cunxian"){
								page.getJouNo();
							}
							otherNeedShowAcc = '';
							cashNeedShowAcc = '';
							otherNeedShowAcc = dataThree;
							cashNeedShowAcc = dataOne;
							$('#planItemMore').html('');
							page.getSameFz();
						},
						onComplete: function(sender) {
							//bug77574--zsj
							if(!$.isNull(result.data) && result.data.length > 0) {
								for(var i = 0; i < result.data.length; i++) {
									var zeroObj = result.data[i];
									if(zeroObj.isLeaf == 1) {
										//CWYXM - 8670--出纳管理 - 登记出纳账， 提现和存现， 现金、 银行账簿， 需要默认选择同一个账套下的账簿--zsj
										$('#zeroBook').getObj().val(zeroObj.ID);
										dataThree = zeroObj.ID;
										break;
									}
								}
								cashNeedShowAcc = '';
								otherNeedShowAcc = dataThree;
								page.getSameFz();
							}
						}
					});
				});
			},
			getJouNo: function() {
				var argu = {
					agencyCode: window.ownerData.agencyCode,
					setYear: window.ownerData.setYear,
					rgCode: window.ownerData.rgCode,
					acctCode: window.ownerData.acctCode,
					accoCode: window.ownerData.accoCode,
					jouDate: $('#jouDate').getObj().getValue()
				};
				//提现的时候走现金账簿，存现的时候选中哪个账簿走哪个 gouhx
				if (window.ownerData.flag == "tixian") {
					argu.accountbookGuid = $('#cashBook').getObj().getValue()
				} else {
					if ($('#bankType').hasClass('selected')) {
						argu.accountbookGuid = $('#bankBook').getObj().getValue()
					} else {
						argu.accountbookGuid = $('#zeroBook').getObj().getValue()
					}
				}
				dm.cbbGetJouNo(argu, function (result) {
					if (!$.isNull(result.data)) {
						$('#jouNo').val(result.data);
					}
				});

			},
			clearAll: function() {
				//bug77574--zsj--提现、存现操作时，不受“保存并新增时保留数据”选项控制，点击“保存并新增”功能后，金额、票据号、凭证号清空，其它内容不变，单据编号增加；
				$('#jouNo,#money,#billNo,#vouNo').val('');
				/*$('#jouNo,#summary,#money,#billNo,#vouNo,#dealWith,#remark').val('');
				$('#cashBook,#bankBook,#zeroBook').getObj().clear();
				for(var i = 0; i < treeArry.length; i++) {
					var treeId = page.shortLineToTF(treeArry[i]) + 'Code';
					$('#' + treeId).getObj().clear();
				}*/

			},
			//保存校验辅项是否必填
			checkRequiredACC: function() {
				var requiredACC = accitemArr;
				if(!$.isNull(requiredACC)) {
					for(var i = 0; i < requiredACC.length; i++) {
						var requiredACCid = requiredACC[i];
						if($.isNull($('#' + requiredACCid + ' input').val())) {
							ufma.showTip("请将带*号的必填辅助项填写完整!", function() {}, 'warning');
							return false;
						}
					}
				}
				return true;
			},
			getVouFisPerd: function () {
				var data = window.ownerData.fisPerdData;
				vouFisPerdArray = {};
				//循环把option填入select
				var $vouFisPerdOp = '<option value="">  </option>';
				for (var i = 0; i < data.length; i++) {
				  //创建凭证类型option节点
				  vouFisPerdArray[data[i].code] = data[i].codeName;
				  $vouFisPerdOp += '<option value="' + data[i].code + '">' + data[i].codeName + '</option>';
				}
				$('#vouFisPerd').html($vouFisPerdOp);
			  },
			onEventListener: function() {
				$('.bookTypeCha').on('click', function() {
					//变换按钮
					if($(this).attr('value') == 2) {
						$('#bankType').addClass('selected');
						$('#zeroType').removeClass('selected');
						$('.zerobook').addClass('hide');
						$('.bankbook').removeClass('hide');
						page.initBookType(page.cashAcctCode);
						if(!$.isNull(dataOne)) {
							if(resultObj[dataOne].IS_SUMMARYNEED == "1") {
								$('#summaryNeed').addClass("required");
							} else {
								$('#summaryNeed').removeClass("required");
							}
							//经办人是否必填--zsj--CWYXM-10502
							if(resultObj[dataOne].IS_DEAL_WITH == "1") {
								$('.dealWithClass').addClass("required");
							} else {
								$('.dealWithClass').removeClass("required");
							}
						}
						dataThree = '';
						$('#zeroBook').getObj().val(''); //CWYXM-11636 --出纳管理模块中的登记出纳账，点击更多中的提现按钮，当银行账簿为空时，点击保存按钮没有反应--zsj
					} else if($(this).attr('value') == 3) {
						$('#bankBook').getObj().val(''); //CWYXM-11636 --出纳管理模块中的登记出纳账，点击更多中的提现按钮，当银行账簿为空时，点击保存按钮没有反应--zsj
						$('#zeroType').addClass('selected');
						$('#bankType').removeClass('selected');
						$('.zerobook').removeClass('hide');
						$('.bankbook').addClass('hide');
						dataTwo = '';
						page.initZeroType();
						if(!$.isNull(dataOne)) {
							if(resultObj[dataOne].IS_SUMMARYNEED == "1") {
								$('#summaryNeed').addClass("required");
							} else {
								$('#summaryNeed').removeClass("required");
							}
							//经办人是否必填--zsj--CWYXM-10502
							if(resultObj[dataOne].IS_DEAL_WITH == "1") {
								$('.dealWithClass').addClass("required");
							} else {
								$('.dealWithClass').removeClass("required");
							}
						}
						
					}
				});
				$('.hxType').on('click', function(result) {
					if($(this).attr('value') == 1) {
						$('#lastYear').addClass('selected');
						$('#thisYear').removeClass('selected');
					} else if($(this).attr('value') == 2) {
						$('#thisYear').addClass('selected');
						$('#lastYear').removeClass('selected');
					}
				});
				$('.isReceiptType').on('click', function(result) {
					if($(this).attr('value') == 1) {
						$('#isyes').addClass('selected');
						$('#isno').removeClass('selected');
					} else if($(this).attr('value') == 0) {
						$('#isno').addClass('selected');
						$('#isyes').removeClass('selected');
					}
				});
				$('.typetwo').on('click', function(result) {
					if($(this).attr('value') == 1) {
						$('#basic').addClass('selected');
						$('#project').removeClass('selected');
					} else if($(this).attr('value') == 2) {
						$('#project').addClass('selected');
						$('#basic').removeClass('selected');
					}
				});
				$('#btnClose').click(function() {
					_close();
				});
				$('#btnSave').click(function() {
					if(!page.checkRequiredACC()) {
						return false;
					}
					var cashAccountBook = {}
					var cashBook = $('#cashBook').getObj().getValue();
					var bankBook = $('#bankBook').getObj().getValue();
					var zeroBook = $('#zeroBook').getObj().getValue();
					//经办人是否必填--zsj--CWYXM-10502
					var dealWithFlag = true;
					if($('.dealWithClass').hasClass('required') && $.isNull($('#dealWith').val())) {
						dealWithFlag = false;
					} else {
						dealWithFlag = true;
					}
					//	if((cashBook != '' && bankBook != '') || (cashBook != '' && zeroBook != '') || (dealWithFlag == true)) {
					//CWYXM-11636 --出纳管理模块中的登记出纳账，点击更多中的提现按钮，当银行账簿为空时，点击保存按钮没有反应--zsj
					if((cashBook != '' && (bankBook != '' || zeroBook != '')) && (dealWithFlag == true)) {
						var arguMore = $('#panelBody').serializeObject();
						arguMore.money = $('#money').val().replace(/,/g, '');
						arguMore = $.extend(arguMore, {
							agencyCode: window.ownerData.agencyCode,
							setYear: window.ownerData.setYear,
							rgCode: window.ownerData.rgCode,
							drCr: drCr
						});
						if($('#bankType').hasClass('selected')) {
							var bankOrZeroBook = {
								"acctCode": resultObj[bankguid].ACCT_CODE,
								"accoCode": resultObj[bankguid].ACCO_CODE,
								"accountbookGuid": bankBook,
								"accountbookType": "2"
							}
						} else if($('#zeroType').hasClass('selected')) {
							var bankOrZeroBook = {
								"acctCode": resultObj[zeroguid].ACCT_CODE,
								"accoCode": resultObj[zeroguid].ACCO_CODE,
								"accountbookGuid": zeroBook,
								"accountbookType": "3"
							}
						}
						var argu = {
							"cuJournalParam": arguMore,
							"cashAccountBook": {
								"acctCode": resultObj[cashGuid].ACCT_CODE,
								"accoCode": resultObj[cashGuid].ACCO_CODE,
								accountbookGuid: cashBook,
								accountbookType: "1"
							},
							"bankOrZeroBook": bankOrZeroBook,
							"doType": window.ownerData.flag == "cunxian" ? "2" : "1"
						};
						dm.saveBookData(argu, function(result) {
							if(result.flag == 'success') {
								ufma.showTip(result.msg, function(result) {
									$('#btnClose').trigger('click');
									$('#queryAll').trigger('click');
									$('#jouDate').ufDatepicker({
										format: 'yyyy-mm-dd',
										initialDate: new Date(ptData.svTransDate),
										onChange: function(sender, data) {},
										onComplete: function(sender) {}
									});
								}, 'success');
							}
						});
					} else {
						ufma.showTip('必填项不能为空', function(result) {
							return false;
						}, 'warning');
					}
				});

				$('#btnAddAll').click(function() {
					if(!page.checkRequiredACC()) {
						return false;
					}
					var cashBook = $('#cashBook').getObj().getValue();
					var bankBook = $('#bankBook').getObj().getValue();
					var zeroBook = $('#zeroBook').getObj().getValue();
					//经办人是否必填--zsj--CWYXM-10502
					var dealWithFlag = true;
					if($('.dealWithClass').hasClass('required') && $.isNull($('#dealWith').val())) {
						dealWithFlag = false;
					} else {
						dealWithFlag = true;
					} 
					//if((cashBook != '' && bankBook != '') || (cashBook != '' && zeroBook != '')) {
					//CWYXM-11636 --出纳管理模块中的登记出纳账，点击更多中的提现按钮，当银行账簿为空时，点击保存按钮没有反应--zsj
					if((cashBook != '' && (bankBook != '' || zeroBook != '')) && (dealWithFlag == true)) {
						var arguMore = $('#panelBody').serializeObject();
						arguMore.money = $('#money').val().replace(/,/g, '');
						arguMore = $.extend(arguMore, {
							agencyCode: window.ownerData.agencyCode,
							setYear: window.ownerData.setYear,
							rgCode: window.ownerData.rgCode,
							drCr: drCr
						});
						if($('#bankType').hasClass('selected')) {
							var bankOrZeroBook = {
								"acctCode": resultObj[bankguid].acctCode,
								"accoCode": resultObj[bankguid].accoCode,
								"accountbookGuid": bankBook, //.accountbookGuid
								"accountbookType": "2"
							}
						} else if($('#zeroType').hasClass('selected')) {
							var bankOrZeroBook = {
								"acctCode": resultObj[zeroguid].acctCode,
								"accoCode": resultObj[zeroguid].accoCode,
								"accountbookGuid": zeroBook, //.accountbookGuid
								"accountbookType": "3"
							}
						}
						var cashAccountBook = {}
						var argu = {
							"cuJournalParam": arguMore,
							"cashAccountBook": {
								"acctCode": resultObj[cashGuid].acctCode,
								"accoCode": resultObj[cashGuid].accoCode,
								accountbookGuid: cashBook,
								accountbookType: "1"
							},
							"bankOrZeroBook": bankOrZeroBook
						};
						dm.addBookData(argu, function(result) {
							if(result.flag == 'success') {
								ufma.showTip(result.msg, function(result) {}, 'success');
								page.clearAll();
								page.getJouNo();
							}
						});
					} else {
						ufma.showTip('必填项不能为空', function(result) {
							return false;
						}, 'warning');
					}
				});
				$("#money").blur(function() {
					$('#money').val($.formatMoney($('#money').val()));
				});
				$("#money").focus(function() {
					var moneySPP = $('#money').val().split(',').join('');
					$('#money').val(moneySPP);
					this.select();
				});
				//bug81752 【20190703 财务云8.0 广东省财政厅】出纳管理—登记出纳账 修改从账务取数的单据日期 报服务端异常--zsj
				$('#vouNo').on('keyup paste', function() {
					$(this).val($(this).val().replace(/[^\d]/g, ''));
				}).on('blur', function() {
					$(this).val($(this).val().replace(/\D/g, ''));
				});
				//intInput()不支持以0开头---zsj
				$('#jouNo').on('keyup paste', function() {
					$(this).val($(this).val().replace(/[^\d]/g, ''));
				}).on('blur', function() {
					$(this).val($(this).val().replace(/\D/g, ''));
				});
			},
			//初始化页面
			initPage: function() {
				page.reslist = ufma.getPermission();
				ufma.isShow(page.reslist);
				$('#jouDate').ufDatepicker({
					format: 'yyyy-mm-dd',
					initialDate: new Date(ptData.svTransDate),
					onChange: function() {
						page.getJouNo();
					}
				});
				page.initBook();
				// page.initBookType();
				page.getVoutype();
				if($('#money').val() != '') {
					$('#money').val($.formatMoney($('#money').val()));
				} else {
					$('#money').val($.formatMoney($('#money').val()));
				}
				if(window.ownerData.flag == "cunxian") {
					drCr = '1'; //默认传值：提现，现金账簿金额在借方银行账簿在贷方；存现，现金账簿在贷方银行账簿在借方。--bug79503
				} else if(window.ownerData.flag == "tixian") {
					drCr = '-1' //默认传值：提现，现金账簿金额在借方银行账簿在贷方；存现，现金账簿在贷方银行账簿在借方。--bug79503
				}
				page.getVouFisPerd();
			},

			init: function() {
				//获取session
				ptData = ufma.getCommonData();
				this.initPage();
				this.onEventListener();
				uf.parse();
				var timeId = setTimeout(function() {
					for(var i = 0; i < $('input').length; i++) {
						$('input:not([autocomplete]),textarea:not([autocomplete]),select:not([autocomplete])').attr('autocomplete', 'off');
					}
					clearTimeout(timeId);
				}, 500);
			}
		}
	}();

	page.init();
});