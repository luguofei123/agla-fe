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
	var page = function() {
		var ptData = {};
		var billbookData = {};
		var billBookAssData = {};
		return {
			//清空弹窗 
			clearAll: function() {
				$('#billNumber,#dealpactNumber,#billfaceAmount,#billfaceRate,#billRemark').val(" "); //input框的清空
				$('#billType,#billPerson,#acceptAgency').getObj().clear(); //下拉框清空
			},
			changeEdit: function() {
				$('#billType,#billPerson,#billDate,#expiryDate,#billfaceAmount,#acceptAgency,#billRemark,#billNumber,#dealpactNumber,#billfaceRate').addClass("gray");
				$('#billType').find('.uf-combox-border').addClass("gray");
				$('#billPerson').find('.uf-combox-border').addClass("gray");
				$('#acceptAgency').find('.uf-combox-border').addClass("gray");
				$('#billDate').find('.prefix').addClass("gray");
				$('#expiryDate').find('.prefix').addClass("gray");
				$('#billType,#billPerson,#billDate,#expiryDate,#billfaceAmount,#acceptAgency,#billRemark,#billNumber,#dealpactNumber,#billfaceRate').attr("readonly", "readonly");
			},
			//校验保存信息
			checkArgu: function(argu) {
				if(($.isNull(argu.billType)) || ($.isNull(argu.billNumber)) || ($.isNull(argu.billPerson)) || ($.isNull(argu.acceptAgency)) || ($.isNull(argu.billfaceAmount)) || ($.isNull(argu.dealpactNumber)) || ($.isNull(argu.billfaceRate))) { //||($.isNull(argu.billRemark))
					ufma.showTip("输入必填项", function() {}, "warning");
					return false
				} else {
					//CWYXM-8204--经赵雪蕊确认金额和利率不能为0或负数--zsj
					if(argu.billfaceRate == 0) {
						ufma.showTip("票面利率不能为0", function() {}, "warning");
						return false;
					} else if(parseFloat(argu.billfaceRate) > 100) { //CWYXM-8295--票面利率输入不 能超过100%--zsj
						ufma.showTip("票面利率不能大于100", function() {}, "warning");
						return false;
					} else if(argu.billfaceAmount == 0) {
						ufma.showTip("票面金额不能为0", function() {}, "warning");
						return false;
					}
				}
				if(argu.billDate > argu.expiryDate) {
					ufma.showTip("出票日期应该小于到期日期", function() {}, "warning");
					return false
				}
				return true;
			},
			//初始化日历控件
			initDatePicker: function() {
				var signInDate = new Date(ptData.svTransDate),
					y = signInDate.getFullYear(),
					m = signInDate.getMonth();
				$('#billDate').ufDatepicker({
					format: 'yyyy-mm-dd',
					//viewMode:'month',
					initialDate: new Date(y, m, 1)
				});
				$('#expiryDate').ufDatepicker({
					format: 'yyyy-mm-dd',
					//viewMode:'month',
					initialDate: signInDate
				});

			},
			onEventListener: function() {
				//CWYXM-8203--应收票据备查薄进行登记时，票据号数输入负数，能保存成功--经赵雪蕊确定合同号允许输入字母 数字--zsj
				$('#billNumber').on('blur', function() {
					$(this).val($(this).val().replace(/[\W]|_/g, ''));
				});
				//CWYXM-8214--应收票据备查薄进行登记时，交易合同号数输入负数，能保存成功--经赵雪蕊确定合同号允许输入字母 数字 下划线--zsj
				$('#dealpactNumber').on('blur', function() {
					$(this).val($(this).val().replace(/[^\w\.\/]/ig, ''));
				});
				$('#btnClose').click(function() {
					_close('ok');
				});
				$('#btnSave').click(function() {
					if(window.ownerData.action == "add") {
						var argu = $('#frmBookIn').serializeObject();
						argu.agencyCode = window.ownerData.agencyCode;
						argu.acctCode = window.ownerData.acctCode;
						argu.setYear = window.ownerData.setYear;
						argu.rgCode = window.ownerData.rgCode;
						argu.billStatus = "01";
						argu.billbookType = "2";
						argu.receivableType = "01";
						argu.op = "0";
						if(!page.checkArgu(argu)) {
							return false
						}
						dm.doSave(argu, function(result) {
							ufma.showTip(result.msg, function() {
								_close('ok');
							}, result.flag)

						});
					} else {
						var argu = $('#frmBookIn').serializeObject();
						argu.agencyCode = window.ownerData.rowData.agencyCode;
						argu.acctCode = window.ownerData.rowData.acctCode;
						argu.setYear = window.ownerData.rowData.setYear;
						argu.rgCode = window.ownerData.rowData.rgCode;
						argu.billStatus = "01";
						argu.billbookType = "2";
						argu.receivableType = "01";
						argu.op = "1";
						argu.billbookGuid = window.ownerData.rowData.billbookGuid;
						argu.billBookAss = [];
						argu.billBookAss.push(window.ownerData.detailData);
						if(!page.checkArgu(argu)) {
							return false
						}
						dm.doSave(argu, function(result) {
							ufma.showTip(result.msg, function() {
								_close('ok');
							}, result.flag)
						});
					}

				});
				//保存并新增
				$('#btnSaveAdd').click(function() {
					if(window.ownerData.action == "add") {
						var argu = $('#frmBookIn').serializeObject();
						argu.agencyCode = window.ownerData.agencyCode;
						argu.acctCode = window.ownerData.acctCode;
						argu.setYear = window.ownerData.setYear;
						argu.rgCode = window.ownerData.rgCode;
						argu.billStatus = "01";
						argu.billbookType = "2";
						argu.receivableType = "01";
						argu.op = "0";
					} else {
						var argu = $('#frmBookIn').serializeObject();
						argu.guid = window.ownerData.detailData.depositGuid;
						argu.money = argu.depositMoney;
						argu.status = window.ownerData.rowData.status;
						argu.billStatus = "01";
						argu.billbookType = "2";
						argu.receivableType = "01";
						argu.op = "1";
						argu.billbookGuid = window.ownerData.rowData.billbookGuid;
						argu.billBookAss = [];
						argu.billBookAss.push(window.ownerData.detailData);
					}
					if(!page.checkArgu(argu)) {
						return false
					}
					dm.doSave(argu, function(result) {
						if(result.flag == "success") {
							ufma.showTip('保存成功', function() {
								page.clearAll();
							}, 'success');
						}
					});
				});
			},
			//初始化页面
			initPage: function() {
				page.reslist = ufma.getPermission();
				ufma.isShow(page.reslist);
				page.initDatePicker();
				$('#receivableType').val('登记');
				//票据类型
				var argu = {
					agencyCode: page.agencyCode,
					setYear: ptData.svSetYear,
					rgCode: ptData.svRgCode,
					eleCode: "BILLTYPE"
				};
				dm.cbbBillType(argu, function(result) {
					$('#billType').ufTreecombox({
						idField: 'code',
						textField: 'codeName',
						pIdField: 'pCode', //可选
						readonly: false,
						placeholder: '请选择票据类型',
						leafRequire: true,
						data: result.data
					});
				});
				var argu2 = {
					agencyCode: page.agencyCode,
					setYear: ptData.svSetYear,
					rgCode: ptData.svRgCode,
					eleCode: "CURRENT"
				};
				dm.cbbBillPerson(argu2, function(result) {
					//出票人
					$('#billPerson').ufTreecombox({
						idField: 'code',
						textField: 'codeName',
						pIdField: 'pCode', //可选
						readonly: false,
						placeholder: '请选择出票人',
						leafRequire: true,
						data: result.data
					});
					//收款人
					$('#acceptAgency').ufTreecombox({
						idField: 'code',
						textField: 'codeName',
						pIdField: 'pCode', //可选
						readonly: false,
						placeholder: '请选择收款人',
						leafRequire: true,
						data: result.data
					});
				});

				if(!$.isNull(window.ownerData.rowData)) {
					if(window.ownerData.rowData.billStatus != '01') {
						var timeId = setTimeout(function() {
							$('#frmBookIn').disable();
							clearTimeout(timeId);
						}, 500);
						$('#btnSaveAdd').addClass('disabled');
						$('#btnSave').addClass('disabled');
					} else {
						$('#btnSaveAdd').removeClass('disabled');
						$('#btnSave').removeClass('disabled');
					}
				}
				$('#billfaceAmount,#billfaceRate').amtInput();
				$('#frmBookIn').setForm(window.ownerData.rowData);
			},

			init: function() {
				//获取session
				ptData = ufma.getCommonData();
				if(window.ownerData.action == "add") {
					page.agencyCode = window.ownerData.agencyCode;
				} else {
					page.agencyCode = window.ownerData.rowData.agencyCode;
				}
				this.initPage();
				this.onEventListener();
				uf.parse();
				ufma.parse();
			}
		}
	}();

	page.init();
});