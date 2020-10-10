$(function () {
	window._close = function () {
		if (window.closeOwner) {
			window.closeOwner();
		}
	};
	var page = function () {
		return {
			initPage: function () {
				// if (typeof window.ownerData.param == 'string') {
				// 	$('#frmBookBfr').setForm(window.ownerData);
				// }
				//修改 默认指标里面没有设置控制方式 需要给默认的 
				if (!$.isNull(window.ownerData.bgCtrlType) && !$.isNull(window.ownerData.bgWarnRatio) && !$.isNull(window.ownerData.bgCtrlRatio)) {
					$('#frmBookBfr').setForm(window.ownerData);
				}
			},
			checkPercent: function (number) {
				var re = /^(?:[1-9]?\d|100)$/;
				if (re.test(number)) {
					return true;
				} else {
					return false;
				}
			},
			onEventListener: function () {
				$('#btnClose').click(function () {
					_close();
				});
				//保存操作
				$('#btnSave').click(function () {
					var argu = $('#frmBookBfr').serializeObject();
					if (!page.checkPercent(argu.bgWarnRatio) || !page.checkPercent(argu.bgCtrlRatio)) {
						ufma.showTip('请输入0-100之间的数字！', function () { }, 'warning');
					} else {
						var datas = {
							"agencyCode": window.ownerData.agencyCode,//单位
							"setYear": window.ownerData.setYear,
							"chrId": window.ownerData.chrId,
							'items': []
						}

						if (typeof window.ownerData.param == 'string') {
							argu.bgItemId = window.ownerData.param;
							datas.items.push(argu);
						} else {
							$.each(window.ownerData.param, function () {
								var tempItem = {};
								tempItem.bgItemId = $(this)[0].bgItemId;
								tempItem.bgWarnRatio = argu.bgWarnRatio;
								tempItem.bgCtrlRatio = argu.bgCtrlRatio;
								tempItem.bgCtrlType = argu.bgCtrlType;
								datas.items.push(tempItem);
							})
						}


						if (datas.items.length > 0) {
							ufma.post('/bg/ctrlManage/updateBgCtrl', datas, function (result) {
								flag = result.flag;
								if (flag == "fail") {
									ufma.showTip('保存失败！', function () { }, 'warning');
								} else if (flag == "success") {
									_close();
									ufma.showTip('保存成功！', function () { }, 'success');
								}
							})
						} else {
							ufma.showTip('请填写正确的数据！', function () { }, 'warning');
						}
					}
				});

			},
			init: function () {
				page.initPage();
				page.onEventListener();
				reslist = ufma.getPermission();
				ufma.isShow(reslist);
			}
		}
	}();

	page.init();
});