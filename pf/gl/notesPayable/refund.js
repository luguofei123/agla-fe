$(function () {
	window._close = function (state) {
		if (window.closeOwner) {
			var data = {
				action: state,
				result: {}
			};
			window.closeOwner(data);
		}
	};
	var page = function () {
		var ptData = {};
		return {

			onEventListener: function () {
				$('#btnClose').click(function () {
					_close("ok");
				});
				$('#btnSave').click(function () {
					var argu = $('#frmBookIn').serializeObject();
					if (window.ownerData.rowData.action == "add") {
						var arguRefund = $('#frmRefund').serializeObject();
						argu = $.extend(true, argu, arguRefund);
						argu.billbookGuid = window.ownerData.rowData.billbookGuid;
						argu.agencyCode = window.ownerData.rowData.agencyCode;
						argu.acctCode = window.ownerData.rowData.acctCode;
						argu.setYear = window.ownerData.rowData.setYear;
						argu.rgCode = window.ownerData.rowData.rgCode;
						argu.billbookType = "2";
						argu.receivableType = "06";
						argu.op = "0";
						argu.businessDate = $('#businessDate').getObj().getValue();
					} else {
						var arguRefund = $('#frmRefund').serializeObject();
						argu = $.extend(true, argu, arguRefund);
						argu.billbookGuid = window.ownerData.rowData.billbookGuid;
						argu.agencyCode = window.ownerData.rowData.agencyCode;
						argu.acctCode = window.ownerData.rowData.acctCode;
						argu.setYear = window.ownerData.rowData.setYear;
						argu.rgCode = window.ownerData.rowData.rgCode;
						argu.billbookType = "2";
						argu.receivableType = "06";
						argu.op = "1";
						argu.billBookAss = [];
						argu.billBookAss.push(window.ownerData.detailData);
						argu.businessDate = $('#businessDate').getObj().getValue();
					}
					if($.isNull(argu.businessDate)) {
						ufma.showTip("必填项不能为空", function() {}, "warning");
						return false;
					} else {
						dm.doSave(argu, function (result) {
                        ufma.showTip(result.msg,function () {
                            _close('ok');
                        },result.flag)
					});
					}
					
				});
			},
			//初始化页面
			initPage: function () {
				page.reslist = ufma.getPermission();
                ufma.isShow(page.reslist);
				$('#receivableType').val('退票');
                var argu = {
                    agencyCode: window.ownerData.rowData.agencyCode,
                    setYear: ptData.svSetYear,
                    rgCode: ptData.svRgCode,
                    eleCode:"BILLTYPE"
                };
                dm.cbbBillType(argu, function (result) {
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
                    eleCode:"CURRENT"
                };
                dm.cbbBillPerson(argu2, function (result) {
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
				$('#billfaceAmount,#billfaceRate').amtInput();
				$('#frmBookIn').setForm(window.ownerData.rowData);
				$('#frmRefund').setForm(window.ownerData.detailData);
				setTimeout(function () {  //一定要加延时处理
					$('#frmBookIn').disable();
				}, 300);
			},

			init: function () {
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