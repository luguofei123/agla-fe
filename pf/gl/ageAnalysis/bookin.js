$(function () {
	window._close = function () {
		if (window.closeOwner) {
			window.closeOwner();
		}
	};
	var page = function () {
		var preCurBal = 0;
		var preCurProAmt = 0;
		return {
			onEventListener: function () {
				//百分比取值范围
				$("#percent2").keyup(function () {
					page.checkPercent($('#percent2').val())
				});

				$('#coaAccSave').click(function () {
					var setYear = $("#setYear2").text(), percent = $("#percent2").val();
					var glCurProvisionBean = {
						"setYear": setYear,
						"percent": percent,
						"agencyCode": window.ownerData.agencyCode,//单位
						"acctCode": window.ownerData.acctCode,//账套
						"provisionType": 2,
						"provisionCode": 2,
						"provisionAmt": $("#provisionAmt2").text()
					}
					ufma.post('/gl/current/aging/buildVou', glCurProvisionBean, function (result) {
						flag = result.flag
						if (flag == "fail") {
							ufma.showTip('生成凭证失败！', function () { }, 'warning');
						} else if (flag == "success") {
							ufma.showTip('生成凭证成功！', function () { }, 'success');
						}
					})
				});
				$('#btnClose').click(function () {
					_close();
				});
				$('#btnSave').click(function () {
					var setYear = $("#setYear2").text(), percent = $("#percent2").val() / 100;
					var glCurProvisionBean = {
						"setYear": setYear,
						"percent": percent,
						"agencyCode": window.ownerData.agencyCode,//单位
						"acctCode": window.ownerData.acctCode,//账套
						"provisionType": 2,
						"provisionCode": 2
					}

					ufma.post('/gl/current/aging/save', glCurProvisionBean, function (result) {
						flag = result.flag;
						if (flag == "fail") {
							ufma.showTip('保存失败！', function () { }, 'warning');
						} else if (flag == "success") {
							ufma.showTip('保存成功！', function () { _close(); }, 'success');
						}
					})
				});
			},
			//初始化页面
			initPage: function () {
				page.reslist = ufma.getPermission();
				ufma.isShow(page.reslist);
				//调取后台数据开始------------------
				var agencyCode = window.ownerData.agencyCode;
				var anysDate = window.ownerData.anysDate;
				var agingSet = window.ownerData.agingSet;
				var acctCode = window.ownerData.acctCode;
				ufma.get('/gl/current/aging/getBalProvision/' + agencyCode + '/' + acctCode + '/' + anysDate + '/' + agingSet, {}, function (result) {
					if (result.data.length == 1) {//没有上年度的
						preCurBal = result.data[0].curBal
						preCurProAmt = result.data[0].curProAmt
						$("#frmBookBfr").css("display", "none")
						$("#setYear2").text(result.data[0].setYear)
						$("#curBal2").text(page.Money(result.data[0].curBal))
						$("#percent2").val(result.data[0].percent)
						$("#provisionAmt2").text(page.Money(result.data[0].provisionAmt))
						$("#curProAmt2").text(page.Money(result.data[0].curProAmt))
						$("#subAmt2").text(page.Money(result.data[0].subAmt))
					} else if (result.data.length > 1) {//两个年度都有
						preCurBal = result.data[1].curBal
						preCurProAmt = result.data[1].curProAmt
						$("#setYear1").text(result.data[0].setYear)
						$("#curBal1").text(page.Money(result.data[1].curBal))
						$("#percent1").text(result.data[0].percent)
						$("#provisionAmt1").text(page.Money(result.data[0].provisionAmt))
						$("#curProAmt1").text(page.Money(result.data[0].curProAmt))
						$("#subAmt1").text(page.Money(result.data[0].subAmt))

						$("#setYear2").text(result.data[1].setYear)
						$("#curBal2").text(page.Money(result.data[1].curBal))
						$("#percent2").val(result.data[1].percent)
						$("#provisionAmt2").text(page.Money(result.data[1].provisionAmt))
						$("#curProAmt2").text(page.Money(result.data[1].curProAmt))
						$("#subAmt2").text(page.Money(result.data[1].subAmt))
					} else {
						ufma.showTip('数据不存在！', function () { }, 'warning');
					}
				})
			},
			//钱的格式化
			Money: function (data) {
				var val = $.formatMoney(data);
				return val == '0.00' ? '' : val;
			},
			//验证百分比是0-100之间
			checkPercent: function (number) {
				var re = /^(?:[1-9]?\d|100)$/;
				if (re.test(number)) {
					$("input").val(number);
					$("#provisionAmt2").text(page.Money(preCurBal * number / 100))
					$("#subAmt2").text(page.Money((preCurBal * number / 100) - preCurProAmt))

				} else {
					$("input").val('');
					ufma.showTip('请输入0-100之间的数字！', function () { }, 'warning');
				}
			},

			init: function () {
				page.reslist = ufma.getPermission();
				ufma.isShow(page.reslist);
				ufma.parseScroll();
				ufma.parse();
				this.initPage();
				this.onEventListener();


			}
		}
	}();

	page.init();
});