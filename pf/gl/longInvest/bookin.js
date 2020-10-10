$(function() {
	window._close = function(state) {
		if(window.closeOwner) {
			var data = {
				action: state,
				result: {}
			};
			window.closeOwner(data);
		}
	};
	var dateTime = window.ownerData.dateTime; //bug79086--zsj
	//用18位的阿拉伯数字或大写英文字母
	var page = function() {
		var ptData = {};
		return {
			changeEdit: function() {
				$('#billType,#billPerson,#billDate,#expiryDate,#billfaceAmount,#acceptAgency,#billRemark,#billNumber,#dealpactNumber,#billfaceRate').addClass("gray");
				$('#billType').find('.uf-combox-border').addClass("gray");
				$('#billPerson').find('.uf-combox-border').addClass("gray");
				$('#acceptAgency').find('.uf-combox-border').addClass("gray");
				$('#billDate').find('.prefix').addClass("gray");
				$('#expiryDate').find('.prefix').addClass("gray");
				$('#billType,#billPerson,#billDate,#expiryDate,#billfaceAmount,#acceptAgency,#billRemark,#billNumber,#dealpactNumber,#billfaceRate').attr("readonly", "readonly");
			},
			//保存并新增时清空
			clearAll: function() {
				$('#investmentCredit,#investmentMoney,#investmentDate,#holdShares,#shareRatio,#accountingMethod,#remark').val(""); //原本为空格，导致金额清空时会放入空格，这样保存时会报服务端错误
				$('#investmentAgency').getObj().clear();
			},
			onEventListener: function() {
				$('#btnClose').click(function() {
					_close('ok');
				});

				$('#btnSave').click(function() {
					var investmentAgency = $('#investmentAgency').getObj().getValue();
					var investmentCredit = $('#investmentCredit').val();
					var investmentMoney = $('#investmentMoney').val();
					var investmentDate = $('#investmentDate').getObj().getValue();
					var holdShares = $('#holdShares').val();
					var shareRatio = $('#shareRatio').val();
					var accountingMethod = $('#accountingMethod').val();

					if((investmentAgency == '' || investmentAgency == null) ||
						(investmentCredit == '' || investmentCredit == null) ||
						(investmentMoney == '' || investmentMoney == null) ||
						(investmentDate == '' || investmentDate == null) ||
						(holdShares == '' || holdShares == null) ||
						(shareRatio == '' || shareRatio == null) || (accountingMethod == '' || accountingMethod == null)) {
						ufma.showTip('必填项不能为空', function() {
							return false;
						}, 'warning');
					} else {
						//bug79757--zsj--占比不能超过100%
						if(parseFloat(shareRatio) > 100) {
							ufma.showTip('股份占比不能超过100%', function() {}, 'warning');
							return false;
						}
						if(holdShares == 0) {
							ufma.showTip('持有股份必须大于0', function() {}, 'warning');
							return false;
						}
						if(window.ownerData.action == "add") { //新增保存
							var argu = $('#frmBookIn').serializeObject();
							argu.agencyCode = window.ownerData.agencyCode;
							argu.acctCode = window.ownerData.acctCode;
							argu.setYear = window.ownerData.setYear;
							argu.rgCode = window.ownerData.rgCode;
							dm.doSave(argu, function(result) {
								ufma.showTip(result.msg, function() {
									_close('ok');
								}, result.flag);

							});
						} else { //编辑保存
							var argu = $('#frmBookIn').serializeObject();
							argu.investmentGuid = window.ownerData.rowData.investmentGuid;
							dm.doSave(argu, function(result) {
								ufma.showTip(result.msg, function() {
									_close('ok');
								}, result.flag);
							});
						}
					}
				});
				$('#coaAccSaveAddAll').click(function() {
					var investmentAgency = $('#investmentAgency').getObj().getValue();
					var investmentCredit = $('#investmentCredit').val();
					var investmentMoney = $('#investmentMoney').val();
					var investmentDate = $('#investmentDate').getObj().getValue();
					var holdShares = $('#holdShares').val();
					var shareRatio = $('#shareRatio').val();
					var accountingMethod = $('#accountingMethod').val();
					if((investmentAgency == '' || investmentAgency == null) ||
						(investmentCredit == '' || investmentCredit == null) ||
						(investmentMoney == '' || investmentMoney == null) ||
						(investmentDate == '' || investmentDate == null) ||
						(holdShares == '' || holdShares == null) ||
						(shareRatio == '' || shareRatio == null)) {
						ufma.showTip('必填项不能为空', function() {
							return false;
						}, 'warnning');
					} else {
						//bug79757--zsj--占比不能超过100%
						if(parseFloat(shareRatio) > 100) {
							ufma.showTip('股份占比不能超过100%', function() {}, 'warning');
							return false;
						}
						if(holdShares == 0) {
							ufma.showTip('持有股份必须大于0', function() {}, 'warning');
							return false;
						}
						if(window.ownerData.action == "add") { //新增保存
							var argu = $('#frmBookIn').serializeObject();
							argu.agencyCode = window.ownerData.agencyCode;
							argu.acctCode = window.ownerData.acctCode;
							argu.setYear = window.ownerData.setYear;
							argu.rgCode = window.ownerData.rgCode;
							dm.doSave(argu, function(result) {
								ufma.showTip(result.msg, function() {
									page.clearAll();
								}, result.flag);

							});
						} else { //编辑保存
							var argu = $('#frmBookIn').serializeObject();
							argu.investmentGuid = window.ownerData.rowData.investmentGuid;
							dm.doSave(argu, function(result) {
								ufma.showTip(result.msg, function() {
									page.clearAll();
								}, result.flag);
							});
						}
					}
				});

			},
			//初始化页面
			initPage: function() {
				page.reslist = ufma.getPermission();
				ufma.isShow(page.reslist);
				$('#investmentMoney').amtInput();
				$('#holdShares').intInputZero();
				$('#shareRatio').amtInput();
				$('#receivableType').val('登记');
				/*修改投资单位获取界面单位错误问题--zsj*/
				var agencyCode;
				if(window.ownerData.rowData) {
					agencyCode = window.ownerData.rowData.agencyCode;
				} else {
					if(window.ownerData.action == 'add') {
						agencyCode = window.ownerData.agencyCode;
					}
				}
				var argu2 = {
					agencyCode: agencyCode,
					setYear: ptData.svSetYear,
					rgCode: ptData.svRgCode,
					eleCode: "CURRENT"
				};
				dm.cbbBillPerson(argu2, function(result) {
					$('#investmentAgency').ufTreecombox({
						idField: 'code',
						textField: 'codeName',
						pIdField: 'pCode', //可选
						leafRequire: true,
						data: result.data,
						onChange: function(data) {},
						onComplete: function(sender) { /*投资单位没有赋值--zsj*/
							if(window.ownerData.rowData) {
								if(window.ownerData.rowData.investmentAgency) {
									$("#investmentAgency").getObj().val(window.ownerData.rowData.investmentAgency);
								}
							} else {
								for(var i = 0; i < result.data.length; i++) {
									if(result.data[i].isLeaf == "1") {
										$('#investmentAgency').getObj().val(result.data[i].code);
										break;
									}
								}
							}
						}
					});
				});
				$('.uf-datepicker').ufDatepicker({
					format: 'yyyy-mm-dd',
					initialDate: new Date(dateTime) //bug79087--zsj
				});
				if(!$.isNull(window.ownerData.detailData)) {
					if(window.ownerData.rowData.status != '01') {
						$('#coaAccSaveAddAll').addClass('disabled');
						$('#btnSave').addClass('disabled');
					} else {
						$('#coaAccSaveAddAll').removeClass('disabled');
						$('#btnSave').removeClass('disabled');
					}
				}
				$('#frmBookIn').setForm(window.ownerData.rowData);
			},

			init: function() {
				//获取session
				ptData = ufma.getCommonData();
				this.initPage();
				this.onEventListener();
				uf.parse();
			}
		}
	}();

	page.init();
});