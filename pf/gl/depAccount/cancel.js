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
					_close('ok');
				});
				$('#btnSave').click(function () {
					if (window.ownerData.rowData.action == "add") {
						var argu = $('#frmCancel').serializeObject();
						argu.cbType = "02";
						argu.depositGuid = window.ownerData.rowData.guid;
					} else {
						var argu = $('#frmCancel').serializeObject();
						argu.guid = window.ownerData.detailData.guid;
						argu.depositGuid = window.ownerData.detailData.depositGuid;
						argu.cbType = window.ownerData.detailData.cbType;
					}
                    $("button").attr("disabled",true);
					dm.doCancel(argu, function (result) {
                        ufma.showTip(result.msg, function () {
                            _close('ok');
                        }, result.flag);

					});
                    var timeId = setTimeout(function () {
                        $("button").attr("disabled",false);
                        clearTimeout(timeId)
                    },5000);
				});
			},
			//初始化页面
			initPage: function () {
				page.reslist = ufma.getPermission();
				ufma.isShow(page.reslist);
				$('#receivableType').val('核销');
                //票据类型
                var argu = {
                    agencyCode: window.ownerData.rowData.agencyCode,
                    setYear: ptData.svSetYear,
                    rgCode: ptData.svRgCode,
                    eleCode:"BILLTYPE"
                };
                dm.cbbBillType(argu, function (result) {
                    $('#billtypeCode').ufTreecombox({
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
                dm.cbbCurrent(argu2, function (result) {
                    $('#currentCode').ufTreecombox({
                        idField: 'code',
                        textField: 'codeName',
                        pIdField: 'pCode', //可选
						readonly: false,
                        placeholder: '请选择往来单位',
                        leafRequire: true,
                        data: result.data
                    });
                });
				$('#frmBookIn').setForm(window.ownerData.rowData);
				$('#frmCancel').setForm(window.ownerData.detailData);
				setTimeout(function() {  //一定要加延时处理
					$('#frmBookIn').disable();
				}, 300);
				$('#depositMoney').amtInput();
				$('#money').amtInput();
				$('#billNo').intInput(); //票据号不可输入汉字,可输入数字,字母
				$('#depositMoney').trigger('blur');
				//$('#depositMoney').html($.formatMoney(window.ownerData.rowData.depositMoney));
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