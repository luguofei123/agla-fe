$(function () {
	window._close = function () {
		if (window.closeOwner) {
			window.closeOwner();
		}
	};
	var page = function () {
		var ptData = {};
		return {

			onEventListener: function () {
				$('#btnClose').click(function () {
					_close();
				});
				$('#btnSave').click(function () {
                    $('button').attr("disabled",true);
					if (window.ownerData.rowData.action == "add") {   //新增保存
						var argu = $('#frmMakeup').serializeObject();
						argu.investmentGuid = window.ownerData.rowData.investmentGuid;
						dm.doRemedy(argu, function (result) {
                            ufma.showTip(result.msg,function () {
                                _close('ok');
                            },result.flag);
						});
					} else {   //编辑保存
						var argu = $('#frmMakeup').serializeObject();
						argu.investmentGuid = window.ownerData.rowData.investmentGuid;
						argu.detailGuid = window.ownerData.detailData.detailGuid;
						dm.doEditSave(argu, function (result) {
                            ufma.showTip(result.msg,function () {
                                _close('ok');
                            },result.flag);
						});
					}
                    var timeId = setTimeout(function () {
                        $('button').attr("disabled",false);
                        clearTimeout(timeId);
                    },5000)
				});
			},
			//初始化页面
			initPage: function () {
				page.reslist = ufma.getPermission();
				ufma.isShow(page.reslist);
				$('#receivableType').val('未确认亏损弥补');
				 /*修改投资单位获取界面单位错误问题--zsj*/
				if(window.ownerData.rowData) {
					page.agencyCode = window.ownerData.rowData.agencyCode;
				} else {
					if(window.ownerData.action == 'add') {
						page.agencyCode = window.ownerData.agencyCode;
					}
				}
				var argu2 = {
					agencyCode: page.agencyCode,
					setYear: ptData.svSetYear,
					rgCode: ptData.svRgCode,
					eleCode: "CURRENT"
				};
				dm.cbbBillPerson(argu2, function (result) {
					$('#investmentAgency').ufTreecombox({
						idField: 'code',
						textField: 'codeName',
						pIdField: 'pCode', //可选
						leafRequire: true,
						data: result.data,
						onComplete: function(sender) { /*投资单位没有赋值--zsj*/
							if(window.ownerData.rowData.investmentAgency) {
								$("#investmentAgency").getObj().val(window.ownerData.rowData.investmentAgency);
							}
							/*bug79757--zsj--禁用投资信息*/
							$('#investmentDate input').attr('disabled',true);
				            $('#investmentDate span').addClass('hide');
						}
					});
				});
				$('#investmentMoney,#holdShares,#shareRatio').amtInput();//bug79830--zsj
				$('#investmentCredit').intInput();
				$('#frmBookIn').setForm(window.ownerData.rowData);
				$('#frmMakeup').setForm(window.ownerData.detailData);
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