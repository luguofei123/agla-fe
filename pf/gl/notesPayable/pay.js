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
		return {

			onEventListener: function() {
				$('#btnClose').click(function() {
					_close("ok");
				});
				$('#btnSave').click(function() {
					var argu = $('#frmBookIn').serializeObject();
					if(window.ownerData.rowData.action == "add") {

						var arguPay = $('#frmPay').serializeObject();
						argu = $.extend(true, argu, arguPay);
						argu.billbookGuid = window.ownerData.rowData.billbookGuid;
						argu.agencyCode = window.ownerData.rowData.agencyCode;
						argu.acctCode = window.ownerData.rowData.acctCode;
						argu.setYear = window.ownerData.rowData.setYear;
						argu.rgCode = window.ownerData.rowData.rgCode;
						argu.receivableType = "05";
						argu.billbookType = "2";
						argu.op = "0";
						argu.businessDate = $('#businessDate').getObj().getValue();
					} else {
						//var argu = $('#frmBookIn').serializeObject();
						var arguPay = $('#frmPay').serializeObject();
						argu = $.extend(true, argu, arguPay);
						argu.billbookGuid = window.ownerData.rowData.billbookGuid;
						argu.agencyCode = window.ownerData.rowData.agencyCode;
						argu.acctCode = window.ownerData.rowData.acctCode;
						argu.setYear = window.ownerData.rowData.setYear;
						argu.rgCode = window.ownerData.rowData.rgCode;
						argu.receivableType = "05";
						argu.billbookType = "2";
						argu.op = "1";
						argu.billBookAss = [];
						argu.billBookAss.push(window.ownerData.detailData);
						argu.businessDate = $('#businessDate').getObj().getValue();
					}
					var billfaceVal = $('#billfaceAmount').val().replace(/,/g, "");
					var payVal = argu.payAmount.replace(/,/g, "");
					if($.isNull(argu.businessDate) || $.isNull(argu.payAmount)) {
						ufma.showTip("必填项不能为空", function() {}, "warning");
						return false;
					} else if(argu.payAmount == 0) {
						ufma.showTip("收款金额不能为0", function() {}, "warning");
						return false;
					}else if(parseFloat(payVal)> parseFloat(billfaceVal)) {
						ufma.showTip("收款金额不能大于票面金额", function() {}, "warning");
						return false;
					}else {
						dm.doSave(argu, function(result) {
							ufma.showTip(result.msg, function() {
								_close('ok');
							}, result.flag)
						});
					}

				});
			},
			//初始化页面
			initPage: function() {
				page.reslist = ufma.getPermission();
				ufma.isShow(page.reslist);
				$('#receivableType').val('付款');
				var argu = {
					agencyCode: window.ownerData.rowData.agencyCode,
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
					agencyCode: window.ownerData.rowData.agencyCode,
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

				$('#billfaceAmount,#billfaceRate,#payAmount').amtInput();
				$('#frmBookIn').setForm(window.ownerData.rowData);
				$('#frmPay').setForm(window.ownerData.detailData);
				setTimeout(function() { //一定要加延时处理
					$('#frmBookIn').disable();
				}, 300);

				// 	//$('#payAmount').val(window.ownerData.detailData.apportionMoney).trigger('blur');
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