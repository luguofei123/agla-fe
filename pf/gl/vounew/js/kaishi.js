$(document).on("click", ".yusuan", function () {
	if ($(this).hasClass("xuanzhongcy")) { } else {
		//		vouboxtrue = false
		var huoquFlag = false;
		var tr = $(".voucher-center:not(.deleteclass)");
		for (var i = 0; i < tr.length; i++) {
			var namess = tr.eq(i).attr("namess");
			if (!$.isNull(namess)) {
				huoquFlag = true;
			}
		}
		quanjuvouchaiwu = huoqu();
		if (!huoquFlag && quanjuvouchaiwu.op != "0") {
			quanjuvouchaiwu.vouNo = "*";
			quanjuvouchaiwu.vouGuid = '';
		}
		if (selectdata.data != undefined) {
			quanjuvouchaiwu.vouStatus = selectdata.data.vouStatus;
			quanjuvouchaiwu.fisPerd = new Date($("#dates").getObj().getValue()).getMonth() + 1;
			quanjuvouchaiwu.lastVer = selectdata.data.lastVer;
			quanjuvouchaiwu.rgCode = selectdata.data.rgCode;
			quanjuvouchaiwu.setYear = selectdata.data.setYear;
			quanjuvouchaiwu.errFlag = selectdata.data.errFlag;
			quanjuvouchaiwu.haveErrInErrTab = selectdata.data.haveErrInErrTab
			quanjuvouchaiwu.inputor = selectdata.data.inputor
			quanjuvouchaiwu.vouDesc = selectdata.data.vouDesc
			quanjuvouchaiwu.vouDate = $("#dates").getObj().getValue()
		}
		if (quanjuvouchaiwu.vouDetails.length == 0) {
			quanjuvouchaiwu = null;
		}
		if ($(".chaiwu").attr("names") == undefined) {
			if (quanjuvouyusuan == null) {
				$(this).addClass("xuanzhongcy")
				$(".chaiwu").removeClass("xuanzhongcy");
				$(".voucher").remove();
				voucheralls();
			} else if (quanjuvouyusuan.vouDetails == undefined) {
				$(this).addClass("xuanzhongcy");
				$(".chaiwu").removeClass("xuanzhongcy");
				$(".voucher").remove();
				voucheralls();
				//				$("#dates").getObj().setValue(result);
				vouluru();
			} else {
				$(this).addClass("xuanzhongcy");
				$(".chaiwu").removeClass("xuanzhongcy");
				$(".voucher").remove();
				voucheralls();
				selectdata.data = quanjuvouyusuan;
				chapz();
				zhuantai();
				//				$("#dates").getObj().setValue(result);
				vouluru();
			}
		} else {
			if (quanjuvouyusuan == null) {
				var vouGroupId = $(".chaiwu").attr("names");
				var _this = $(this)
				_this.addClass("xuanzhongcy").attr("names", $(".chaiwu").attr("names"));
				$(".chaiwu").removeClass("xuanzhongcy").removeAttr("names");
				selectdata.data = {};
				$(".voucher").remove();
				voucheralls();
				cwyspd();
				zhuantai();
				vouluru();
			} else {
				$(this).addClass("xuanzhongcy").attr("names", $(".chaiwu").attr("names"));
				$(".chaiwu").removeClass("xuanzhongcy").removeAttr("names");
				selectdata.data = quanjuvouyusuan;
				$(".voucher").remove();
				voucheralls();
				cwyspd();
				chapz();
				zhuantai();
			}
		}
	}
});
$(document).on("click", ".chaiwu", function () {
	if ($(this).hasClass("xuanzhongcy")) { } else {
		//		vouboxtrue = false
		var huoquFlag = false;
		var tr = $(".voucher-center:not(.deleteclass)");
		for (var i = 0; i < tr.length; i++) {
			var namess = tr.eq(i).attr("namess");
			if (!$.isNull(namess)) {
				huoquFlag = true;
			}
		}
		quanjuvouyusuan = huoqu();
		if (!huoquFlag && quanjuvouyusuan.op != "0") {
			quanjuvouyusuan.vouNo = "*";
			quanjuvouyusuan.vouGuid = '';
		}

		if (selectdata.data != undefined) {
			quanjuvouyusuan.vouStatus = selectdata.data.vouStatus;
			quanjuvouyusuan.fisPerd = new Date($("#dates").getObj().getValue()).getMonth() + 1;
			quanjuvouyusuan.lastVer = selectdata.data.lastVer;
			quanjuvouyusuan.rgCode = selectdata.data.rgCode;
			quanjuvouyusuan.setYear = selectdata.data.setYear;
			quanjuvouyusuan.errFlag = selectdata.data.errFlag;
			quanjuvouyusuan.haveErrInErrTab = selectdata.data.haveErrInErrTab
			quanjuvouyusuan.inputor = selectdata.data.inputor
			quanjuvouyusuan.vouDesc = selectdata.data.vouDesc
			quanjuvouyusuan.vouDate = $("#dates").getObj().getValue()
		}
		if (quanjuvouyusuan.vouDetails.length == 0) {
			quanjuvouyusuan = null;
		}
		if ($(".yusuan").attr("names") == undefined) {
			if (quanjuvouchaiwu == null) {
				$(this).addClass("xuanzhongcy");
				$(".yusuan").removeClass("xuanzhongcy");
				$(".voucher").remove();
				voucheralls();
			} else if (quanjuvouchaiwu.vouDetails == undefined) {
				$(this).addClass("xuanzhongcy");
				$(".yusuan").removeClass("xuanzhongcy");
				$(".voucher").remove();
				voucheralls();
				//				$("#dates").getObj().setValue(result);
				vouluru();
			} else {
				$(this).addClass("xuanzhongcy");
				$(".yusuan").removeClass("xuanzhongcy");
				selectdata.data = quanjuvouchaiwu;
				$(".voucher").remove();
				voucheralls();
				chapz();
				zhuantai();
				//				$("#dates").getObj().setValue(result);
				vouluru();
			}
		} else {
			if (quanjuvouchaiwu == null) {
				var vouGroupId = $(".yusuan").attr("names");
				var _this = $(this)
				_this.addClass("xuanzhongcy").attr("names", $(".yusuan").attr("names"));
				$(".yusuan").removeClass("xuanzhongcy").removeAttr("names");
				selectdata.data = {};
				$(".voucher").remove();
				voucheralls();
				zhuantai();
				vouluru();
			} else {
				$(this).addClass("xuanzhongcy").attr("names", $(".yusuan").attr("names"));
				$(".yusuan").removeClass("xuanzhongcy").removeAttr("names");
				selectdata.data = quanjuvouchaiwu;
				$(".voucher").remove();
				voucheralls();
				cwyspd();
				chapz();
				zhuantai();
			}
		}

	}
});

function issaveDraft() {
	if (vousinglepz == false && vousinglepzzy == false) {
		if ($(".xuanzhongcy").text() == "财务会计") {
			quanjuvouchaiwu = huoqu();
			if (quanjuvouyusuan != null && quanjuvouyusuan.vouDetails != undefined) {
				quanjuvouyusuan.vouCnt = quanjuvouchaiwu.vouCnt; //附件数
			}
		} else {
			quanjuvouyusuan = huoqu();
			if (quanjuvouyusuan != null && quanjuvouyusuan.vouDetails != undefined) {
				var arrOp = [];
				for (var i = 0; i < quanjuvouyusuan.vouDetails.length; i++) {
					arrOp.push(quanjuvouyusuan.vouDetails[i].op.toString());
				}
			}
			if (quanjuvouchaiwu != null && quanjuvouchaiwu.vouDetails != undefined) {
				quanjuvouchaiwu.vouCnt = quanjuvouyusuan.vouCnt; //附件数
			}
		}
	}
}
//判断是否可以保存
function isSaveCond() {
	if (vousinglepz == false && vousinglepzzy == false) {
		if ($(".xuanzhongcy").text() == "财务会计") {
			quanjuvouchaiwu = huoqu();
			if (quanjuvouchaiwu != null && quanjuvouchaiwu.vouDetails != undefined) {
				var arrOp = [];
				for (var i = 0; i < quanjuvouchaiwu.vouDetails.length; i++) {
					arrOp.push(quanjuvouchaiwu.vouDetails[i].op.toString());
				}
				if (arrOp.indexOf("0") != "-1") {
					if (arrOp.indexOf("1") == "-1" && arrOp.indexOf("2") == "-1" && arrOp.indexOf("3") == "-1") {
						quanjuvouchaiwu.op = "0";
						if ($("#sppz").val() == "*") {
							quanjuvouchaiwu.vouNo = "";
						}
					} else {
						quanjuvouchaiwu.op = "1";
					}
				}
			}
			if (quanjuvouyusuan != null && quanjuvouyusuan.vouDetails != undefined) {
				quanjuvouyusuan.vouCnt = quanjuvouchaiwu.vouCnt; //附件数
			}
		} else {
			quanjuvouyusuan = huoqu();
			if (quanjuvouyusuan != null && quanjuvouyusuan.vouDetails != undefined) {
				var arrOp = [];
				for (var i = 0; i < quanjuvouyusuan.vouDetails.length; i++) {
					arrOp.push(quanjuvouyusuan.vouDetails[i].op.toString());
				}
				if (arrOp.indexOf("0") != "-1") {
					if (arrOp.indexOf("1") == "-1" && arrOp.indexOf("2") == "-1" && arrOp.indexOf("3") == "-1") {
						quanjuvouyusuan.op = "0";
						if ($("#sppz").val() == "*") {
							quanjuvouyusuan.vouNo = "";
						}
					} else {
						quanjuvouyusuan.op = "1";
					}
				}
			}
			if (quanjuvouchaiwu != null && quanjuvouchaiwu.vouDetails != undefined) {
				quanjuvouchaiwu.vouCnt = quanjuvouyusuan.vouCnt; //附件数
			}
		}
		var str = 0;
		if (quanjuvouchaiwu != null && quanjuvouchaiwu.vouDetails != undefined) {
			if (quanjuvouchaiwu.amtCr != quanjuvouchaiwu.amtDr) {
				str += 1
				ufma.showTip("借、贷金额不相等", function () { }, "warning");
			}
			for (var i = quanjuvouchaiwu.vouDetails.length - 1; i >= 0; i--) {
				if (quanjuvouchaiwu.vouDetails[i].op != "2") {
					if ((!$.isNull(quanjuvouchaiwu.vouDetails[i].descpt) && $.isNull(quanjuvouchaiwu.vouDetails[i].accoCode) && $.isNull(quanjuvouchaiwu.vouDetails[i].stadAmt))) {
						if (quanjuvouchaiwu.vouDetails[i].op == "1") {
							quanjuvouchaiwu.vouDetails[i].op = "2";
						} else {
							quanjuvouchaiwu.vouDetails.splice(i, 1);
						}
					} else if (!$.isNull(quanjuvouchaiwu.vouDetails[i].descpt) && !$.isNull(quanjuvouchaiwu.vouDetails[i].accoCode) && !$.isNull(quanjuvouchaiwu.vouDetails[i].stadAmt)) {
						//						quanjuvouchaiwu.vouDetails.splice(i, 1);
					} else if ($.isNull(quanjuvouchaiwu.vouDetails[i].descpt)) {
						str += 1
						ufma.showTip("您录入财务会计的第" + (parseFloat(i) + 1) + "行摘要未录入", function () { }, "warning")
					} else if ($.isNull(quanjuvouchaiwu.vouDetails[i].stadAmt)) {
						str += 1
						ufma.showTip("您录入财务会计的第" + (parseFloat(i) + 1) + "行金额未录入", function () { }, "warning")
					} else if ($.isNull(quanjuvouchaiwu.vouDetails[i].accoCode)) {
						str += 1
						ufma.showTip("您录入财务会计的第" + (parseFloat(i) + 1) + "行会计科目未录入", function () { }, "warning")
					}
				}
			}
			if (quanjuvouchaiwu.vouDetails.length <= 1) {
				ufma.showTip("财务会计至少录入两行内容", function () { }, "warning");
				str += 1;
			}
		}
		if (quanjuvouyusuan != null && quanjuvouyusuan.vouDetails != undefined) {
			if (quanjuvouyusuan.amtCr != quanjuvouyusuan.amtDr) {
				str += 1
				ufma.showTip("借、贷金额不相等", function () { }, "warning");
			}
			for (var i = quanjuvouyusuan.vouDetails.length - 1; i >= 0; i--) {
				if (quanjuvouyusuan.vouDetails[i].op != "2") {
					if ((!$.isNull(quanjuvouyusuan.vouDetails[i].descpt) && $.isNull(quanjuvouyusuan.vouDetails[i].accoCode) && $.isNull(quanjuvouyusuan.vouDetails[i].stadAmt))) {
						if (quanjuvouyusuan.vouDetails[i].op == "1") {
							quanjuvouyusuan.vouDetails[i].op = "2";
						} else {
							quanjuvouyusuan.vouDetails.splice(i, 1);
						}
					} else if (!$.isNull(quanjuvouyusuan.vouDetails[i].descpt) && !$.isNull(quanjuvouyusuan.vouDetails[i].accoCode) && !$.isNull(quanjuvouyusuan.vouDetails[i].stadAmt)) {
						//					quanjuvouyusuan.vouDetails.splice(i, 1);
					} else if ($.isNull(quanjuvouyusuan.vouDetails[i].descpt)) {
						str += 1
						ufma.showTip("您录入预算会计的第" + (parseFloat(i) + 1) + "行摘要未录入", function () { }, "warning")
					} else if ($.isNull(quanjuvouyusuan.vouDetails[i].stadAmt)) {
						str += 1
						ufma.showTip("您录入预算会计的第" + (parseFloat(i) + 1) + "行金额未录入", function () { }, "warning")
					} else if ($.isNull(quanjuvouyusuan.vouDetails[i].accoCode)) {
						str += 1
						ufma.showTip("您录入预算会计的第" + (parseFloat(i) + 1) + "行会计科目未录入", function () { }, "warning")
					}
				}
			}
			if (quanjuvouyusuan.vouDetails.length <= 1) {
				ufma.showTip("预算会计至少录入两行内容", function () { }, "warning");
				str += 1;
			}
		}
		return str;
	}
};
//判断上期未结账则不允许做本期凭证
function actionBefore(flag) {
	var isAction = true;
	if (flag) {
		var nowFisperd = parseInt($("#dates").getObj().getValue().substring(5, 7));
		var preFisperd = nowFisperd - 1;
		var argu = {
			"agencyCode": rpt.nowAgencyCode,
			"acctCode": rpt.nowAcctCode,
			"fisPerd": preFisperd
		}
		ufma.ajaxDef("/gl/vou/isCheckOutBeforePeriod", "get", argu, function (result) {
			var data = result.data;
			if (!data) {
				isAction = false;
			} else {
				isAction = true;
			}
		});
	}
	return isAction;
};
//保存
$(document).on("click", "#btn-voucher-bc", function () {
	var isAction = actionBefore(isAddVou);
	var datesyue = $("#dates").getObj().getValue().substring(5, 7)
	if (!isAction && datesyue != '01') {
		ufma.showTip("上期未结账则不允许做本期凭证！", function () { }, "warning");
		return false;
	}
	var comfirmtext = ''
	if ($(this).hasClass("btn-disablesd") != true) {
		_this = $(this)
		$(this).addClass("btn-disablesd")
		setTimeout(function () {
			_this.removeClass("btn-disablesd")
		}, 5000)
		$("#xiaocuo").hide();
		var isnods = true;
		var str = isSaveCond();
		if (str > 0) {
			$("#zezhao").html('')
			$("#zezhao").hide();
			return false;
		} else {
			var startdate = $("#dates").getObj().getValue();
			var enddate = result;
			var startD = new Date(Date.parse(startdate.replace(/-/g, "/")));
			var endD = new Date(Date.parse(enddate.replace(/-/g, "/")));
			var days = parseInt((endD.getTime() - startD.getTime()) / (1000 * 60 * 60 * 24));
			days = 0; //不控制
			if (30 > days && days > -30) {
				var isyoute = true;
				cwte = "";
				yste = "";
				_this = $(this)
				var allcy = new Object();
				var allcysd = [];
				var thisallcy = new Object();
				if (vousinglepz == false && vousinglepzzy == false) {
					if (quanjuvouchaiwu == null) {
						allcy.cwVouVo = null
					} else {
						if (quanjuvouchaiwu.vouDetails == undefined) {
							allcy.cwVouVo = null
						} else if (quanjuvouchaiwu.vouDetails.length == 0) {
							allcy.cwVouVo = null
						} else {
							if (quanjuvouchaiwu.templateGuid != undefined) {
								quanjuvouchaiwu.op = 0;
								isyoute = false;
								cwte = quanjuvouchaiwu.templateGuid;
							}
							allcy.cwVouVo = quanjuvouchaiwu
							delete allcy.cwVouVo.acctName
							delete allcy.cwVouVo.agencyName
							delete allcy.cwVouVo.haveErrInErrTab
							delete allcy.cwVouVo.templateGuid;
							delete allcy.cwVouVo.printStatus;
							delete allcy.cwVouVo.treasuryHook;
						}
					}
					if (quanjuvouyusuan == null) {
						allcy.ysVouVo = null
					} else {
						if (quanjuvouyusuan.vouDetails == undefined) {
							allcy.ysVouVo = null
						} else if (quanjuvouyusuan.vouDetails.length == 0) {
							allcy.ysVouVo = null
						} else {
							if (quanjuvouyusuan.templateGuid != undefined) {
								quanjuvouyusuan.op = 0;
								isyoute = false;
								yste = quanjuvouyusuan.templateGuid;
							}
							allcy.ysVouVo = quanjuvouyusuan
							delete allcy.ysVouVo.acctName
							delete allcy.ysVouVo.agencyName
							delete allcy.ysVouVo.haveErrInErrTab
							delete allcy.ysVouVo.templateGuid;
							delete allcy.ysVouVo.printStatus;
							delete allcy.ysVouVo.treasuryHook;
						}
					}
					allcysd.push(allcy.cwVouVo)
					allcysd.push(allcy.ysVouVo)
					if (allcy.cwVouVo != null && allcy.ysVouVo != null) {
						if (allcy.cwVouVo.amtCr == allcy.ysVouVo.amtCr) {
							isnods = true
						} else {
							var chaer = parseFloat(allcy.cwVouVo.amtCr - allcy.ysVouVo.amtCr).toFixed(2)
							comfirmtext = '财务会计金额' + allcy.cwVouVo.amtCr + '，预算会计金额' + allcy.ysVouVo.amtCr + '，差额' + chaer + '，是否继续'
							isnods = false
						}
					}
					// 					else if(allcy.cwVouVo == null){
					// 						comfirmtext='财务凭证未录入，是否继续'
					// 						isnods = false
					// 					}else if(allcy.ysVouVo == null){
					// 						comfirmtext='预算凭证未录入，是否继续'
					// 						isnods = false
					// 					}
				} else {
					allcy = {}
					allcy = huoqu()
					if (allcy.templateGuid != undefined) {
						isyoute = false;
						cwte = allcy.templateGuid;
					}
					if (allcy.amtCr != allcy.amtDr && allcy.ysAmtCr != allcy.ysAmtDr) {
						ufma.showTip("借、贷金额不相等", function () { }, "warning");
						return false
					}
					var allcycw = []
					var allcyys = []
					var allcyyssingel = 1
					for (var i = 0; i < allcy.vouDetails.length; i++) {
						if (allcy.vouDetails[i].op != "2") {
							allcy.vouDetails[i].vouSeq = allcyyssingel
							allcyyssingel++
						}
					}
					for (var i = allcy.vouDetails.length - 1; i >= 0; i--) {
						if (allcy.vouDetails[i].accaCode == '1') {
							allcycw.unshift(allcy.vouDetails[i])
						} else if (allcy.vouDetails[i].accaCode == '2') {
							allcyys.unshift(allcy.vouDetails[i])
						}
						if (allcy.vouDetails[i].op != "2") {
							if ((!$.isNull(allcy.vouDetails[i].descpt) && $.isNull(allcy.vouDetails[i].accoCode) && $.isNull(allcy.vouDetails[i].stadAmt))) {
								if (allcy.vouDetails[i].op == "1") {
									allcy.vouDetails[i].op = "2";
								} else {
									allcy.vouDetails.splice(i, 1);
								}
							} else if (!$.isNull(allcy.vouDetails[i].descpt) && !$.isNull(allcy.vouDetails[i].accoCode) && !$.isNull(allcy.vouDetails[i].stadAmt)) {
								//						quanjuvouchaiwu.vouDetails.splice(i, 1);
							} else if (allcy.vouDetails[i].accoCode == '' && allcy.vouDetails[i].stadAmt == '') {
								allcy.vouDetails.splice(i, 1);
							} else if (vousinglepz && $.isNull(allcy.vouDetails[i].descpt)) {
								ufma.showTip("您录入凭证的第" + (parseFloat(i) + 1) + "行摘要未录入", function () { }, "warning")
								$("#zezhao").html('')
								$("#zezhao").hide();
								return false
							} else if (vousinglepz && $.isNull(allcy.vouDetails[i].stadAmt)) {
								ufma.showTip("您录入凭证的第" + (parseFloat(i) + 1) + "行金额未录入", function () { }, "warning")
								$("#zezhao").html('')
								$("#zezhao").hide();
								return false
							} else if (vousinglepz && $.isNull(allcy.vouDetails[i].accoCode)) {
								ufma.showTip("您录入凭证的第" + (parseFloat(i) + 1) + "行会计科目未录入", function () { }, "warning")
								$("#zezhao").html('')
								$("#zezhao").hide();
								return false
							}
						}
					}
					var cycwseq = 1
					for (var i = 0; i < allcycw.length; i++) {
						if (allcycw[i].op != "2") {
							if (vousinglepzzy) {
								allcycw[i].vouSeq = cycwseq
								cycwseq++
							}
							if ((!$.isNull(allcycw[i].descpt) && $.isNull(allcycw[i].accoCode) && $.isNull(allcycw[i].stadAmt))) {
								if (allcycw[i].op == "1") {
									allcycw[i].op = "2";
								} else {
									allcycw.splice(i, 1);
								}
							} else if (!$.isNull(allcycw[i].descpt) && !$.isNull(allcycw[i].accoCode) && !$.isNull(allcycw[i].stadAmt)) {
								//						quanjuvouchaiwu.vouDetails.splice(i, 1);
							} else if (allcycw[i].accoCode == '' && allcycw[i].stadAmt == '') {
								allcycw.splice(i, 1);
							} else if (vousinglepzzy && $.isNull(allcycw[i].descpt)) {
								ufma.showTip("您录入财务会计的第" + (parseFloat(i) + 1) + "行摘要未录入", function () { }, "warning")
								$("#zezhao").html('')
								$("#zezhao").hide();
								return false
							} else if (vousinglepzzy && $.isNull(allcycw[i].stadAmt)) {
								ufma.showTip("您录入财务会计的第" + (parseFloat(i) + 1) + "行金额未录入", function () { }, "warning")
								$("#zezhao").html('')
								$("#zezhao").hide();
								return false
							} else if (vousinglepzzy && $.isNull(allcycw[i].accoCode)) {
								ufma.showTip("您录入财务会计的第" + (parseFloat(i) + 1) + "行会计科目未录入", function () { }, "warning")
								$("#zezhao").html('')
								$("#zezhao").hide();
								return false
							}
						}
					}
					var cyysseq = 1
					for (var i = 0; i < allcyys.length; i++) {
						if (allcyys[i].op != "2") {
							if (vousinglepzzy) {
								allcyys[i].vouSeq = cyysseq
								cyysseq++
							}
							if ((!$.isNull(allcyys[i].descpt) && $.isNull(allcyys[i].accoCode) && $.isNull(allcyys[i].stadAmt))) {
								if (allcyys[i].op == "1") {
									allcyys[i].op = "2";
								} else {
									allcyys.splice(i, 1);
								}
							} else if (!$.isNull(allcyys[i].descpt) && !$.isNull(allcyys[i].accoCode) && !$.isNull(allcyys[i].stadAmt)) {
								//						quanjuvouchaiwu.vouDetails.splice(i, 1);
							} else if (allcyys[i].accoCode == '' && allcyys[i].stadAmt == '') {
								allcyys.splice(i, 1);
							} else if (vousinglepzzy && $.isNull(allcyys[i].descpt)) {
								ufma.showTip("您录入预算会计的第" + (parseFloat(i) + 1) + "行摘要未录入", function () { }, "warning")
								$("#zezhao").html('')
								$("#zezhao").hide();
								return false
							} else if (vousinglepzzy && $.isNull(allcyys[i].stadAmt)) {
								ufma.showTip("您录入预算会计的第" + (parseFloat(i) + 1) + "行金额未录入", function () { }, "warning")
								$("#zezhao").html('')
								$("#zezhao").hide();
								return false
							} else if (vousinglepzzy && $.isNull(allcyys[i].accoCode)) {
								ufma.showTip("您录入预算会计的第" + (parseFloat(i) + 1) + "行会计科目未录入", function () { }, "warning")
								$("#zezhao").html('')
								$("#zezhao").hide();
								return false
							}
						}
					}
					if (allcy.vouDetails.length <= 1) {
						ufma.showTip("至少录入两行内容", function () { }, "warning");
						$("#zezhao").html('')
						$("#zezhao").hide();
						return false
					}
					allcysd.push(allcy)
					if (allcy.amtCr != allcy.ysAmtCr && allcy.ysAmtCr != 0 && allcy.amtCr != 0) {
						var chaer = parseFloat(allcy.amtCr - allcy.ysAmtCr).toFixed(2)
						comfirmtext = '财务会计金额' + allcy.amtCr + '，预算会计金额' + allcy.ysAmtCr + '，差额' + chaer + '，是否继续'
						isnods = false
					} else {
						isnods = true
					}
				}
				var titlesrc = 'saveVou'
				if (vousinglepz == true) {
					titlesrc = 'saveVou'
				}
				if (isnods) {
					ufma.showloading('正在保存凭证，请耐心等待...');
					$.ajax({
						type: "post",
						url: "/gl/vou/" + titlesrc + "?ajax=1&rueicode=" + hex_md5svUserCode,
						async: false,
						data: JSON.stringify(allcysd),
						contentType: 'application/json; charset=utf-8',
						dataType: 'json',
						success: function (data) {
							if (data.flag == "success" || data.flag == "warn") {
								//指标预警提示
								var zhibiaoCode = data.code;
								var zhibiaoMsg = data.msg;
								if (zhibiaoCode == "200" || data.flag == "warn") {
									ufma.showTip(zhibiaoMsg, function () { }, "warning", '10000');
								} else {
									ufma.showTip(zhibiaoMsg, function () { }, "success");
								}
								nowvoutype = $("#leftbgselect option:selected").attr("value")
								configupdate('voutype', $("#leftbgselect option:selected").attr("value"))
								dataforcwys(data.data)
								var loadtimeId = setTimeout(function () {
									cwyspd();
									chapz();
									//									chapzsave();
									zhuantai();
									gjwindow();
									if (quanjuvouyusuan != null && quanjuvouchaiwu != null) {
										if ($(".yusuan").hasClass('xuanzhongcy')) {
											$(".chaiwu").trigger('click');
											var timeId = setTimeout(function () {
												$(".yusuan").trigger('click');
												clearTimeout(timeId);
											}, 100);
										} else if ($(".chaiwu").hasClass('xuanzhongcy')) {
											$(".yusuan").trigger('click');
											var timeId = setTimeout(function () {
												$(".chaiwu").trigger('click');
												clearTimeout(timeId);
											}, 100);
										}
									}
								}, 5);
								if (isyoute == false) {
									if (yste != "") {
										$.ajax({
											type: "get",
											url: "/gl/vouTemp/delVouTem/" + yste + "?ajax=1&rueicode=" + hex_md5svUserCode,
											async: true,
											success: function (data) {
												if (data.flag != "success") {
													ufma.showTip(data.msg, function () { }, "error");
												}
											}
										});
									}
									if (cwte != "") {
										$.ajax({
											type: "get",
											url: "/gl/vouTemp/delVouTem/" + cwte + "?ajax=1&rueicode=" + hex_md5svUserCode,
											async: true,
											success: function (data) {
												if (data.flag != "success") {
													ufma.showTip(data.msg, function () { }, "error");
												}
											}
										});
									}
								}
								if (quanjuvouchaiwu != null) {
									var xjvouguid = new Object();
									xjvouguid.vouGuid = quanjuvouchaiwu.vouGuid;
									$.ajax({
										type: "get",
										url: "/gl/vou/getCf/" + quanjuvouchaiwu.vouGuid + "?ajax=1&rueicode=" + hex_md5svUserCode,
										async: true,
										contentType: 'application/json; charset=utf-8',
										success: function (data) {
											if (data.flag == "success") {
												xianjingliu = data;
												if (xianjingliu.data.CF_Vouacco.length > 0) {
													xianjinglius(xianjingliu, quanjuvoudatas);
												}
											} else {
												ufma.showTip(data.msg, function () { }, "error");
												$("#zezhao").html('')
												$("#zezhao").hide();
											}
										},
										error: function () {
											ufma.showTip("数据库连接失败", function () { }, "error");
											$("#zezhao").html('')
											$("#zezhao").hide();
										}
									});
								} else {
									if (zhibiaoCode == "200") {
										ufma.showTip(zhibiaoMsg, function () { }, "warning", '10000');
									} else {
										ufma.showTip(zhibiaoMsg, function () { }, "success");
									}
								}
								//此判断是为了判断现金流量框被打开时，不要关闭遮罩
								if ($("#xianjing").attr("names") != "zhidong") {
									$("#zezhao").html('')
									$("#zezhao").hide();
								}
								ufma.hideloading();
							} else {
								ufma.showTip(data.msg, function () { }, "error");
								_this.removeClass("btn-disablesd")
								$("#zezhao").html('')
								$("#zezhao").hide();
								ufma.hideloading();
							}
						},
						error: function () {
							ufma.hideloading();
							ufma.showTip("保存失败,网络中断", function () { }, "error");
							_this.removeClass("btn-disablesd")
							$("#zezhao").html('')
							$("#zezhao").hide();
						}
					});
				} else {
					ufma.confirm(comfirmtext, function (action) {
						ufma.showloading('正在保存凭证，请耐心等待...');
						if (action) {
							$.ajax({
								type: "post",
								url: "/gl/vou/" + titlesrc + "?ajax=1&rueicode=" + hex_md5svUserCode,
								async: true,
								data: JSON.stringify(allcysd),
								contentType: 'application/json; charset=utf-8',
								dataType: 'json',
								success: function (data) {
									ufma.hideloading();
									if (data.flag == "success" || data.flag == "warn") {
										//指标预警提示
										var zhibiaoCode = data.code;
										var zhibiaoMsg = data.msg;
										if (zhibiaoCode == "200" || data.flag == "warn") {
											ufma.showTip(zhibiaoMsg, function () { }, "warning", '10000');
										} else {
											ufma.showTip(zhibiaoMsg, function () { }, "success");
										}
										nowvoutype = $("#leftbgselect option:selected").attr("value")
										configupdate('voutype', $("#leftbgselect option:selected").attr("value"))
										dataforcwys(data.data)
										var loadtimeId = setTimeout(function () {
											cwyspd();
											chapz();
											//											chapzsave();
											zhuantai();
											gjwindow();
											if (quanjuvouyusuan != null && quanjuvouchaiwu != null) {
												if ($(".yusuan").hasClass('xuanzhongcy')) {
													$(".chaiwu").trigger('click');
													var timeId = setTimeout(function () {
														$(".yusuan").trigger('click');
														clearTimeout(timeId);
													}, 100);
												} else if ($(".chaiwu").hasClass('xuanzhongcy')) {
													$(".yusuan").trigger('click');
													var timeId = setTimeout(function () {
														$(".chaiwu").trigger('click');
														clearTimeout(timeId);
													}, 100);
												}
											}
										}, 5);
										if (isyoute == false) {
											if (yste != "") {
												$.ajax({
													type: "get",
													url: "/gl/vouTemp/delVouTem/" + yste + "?ajax=1&rueicode=" + hex_md5svUserCode,
													async: true,
													success: function (data) {
														if (data.flag == "success") { } else {
															ufma.showTip(data.msg, function () { }, "error");
														}
													}
												});
											}
											if (cwte != "") {
												$.ajax({
													type: "get",
													url: "/gl/vouTemp/delVouTem/" + cwte + "?ajax=1&rueicode=" + hex_md5svUserCode,
													async: true,
													success: function (data) {
														if (data.flag == "success") {
															//						ufma.showTip("删除草稿");
														} else {
															ufma.showTip(data.msg, function () { }, "error");
														}
													}
												});
											}
										}
										if (quanjuvouchaiwu != null) {
											var xjvouguid = new Object();
											xjvouguid.vouGuid = quanjuvouchaiwu.vouGuid;
											$.ajax({
												type: "get",
												url: "/gl/vou/getCf/" + quanjuvouchaiwu.vouGuid + "?ajax=1&rueicode=" + hex_md5svUserCode,
												async: true,
												contentType: 'application/json; charset=utf-8',
												success: function (data) {
													if (data.flag == "success") {
														xianjingliu = data;
														if (xianjingliu.data.CF_Vouacco.length > 0) {
															xianjinglius(xianjingliu, quanjuvoudatas);
														}
													} else {
														ufma.showTip(data.msg, function () { }, "error");
														$("#zezhao").html('')
														$("#zezhao").hide();
													}
												},
												error: function () {
													ufma.showTip("数据库连接失败", function () { }, "error");
													$("#zezhao").html('')
													$("#zezhao").hide();
												}
											});
										}
										//此判断是为了判断现金流量框被打开时，不要关闭遮罩
										if ($("#xianjing").attr("names") != "zhidong") {
											$("#zezhao").html('')
											$("#zezhao").hide();
										}
										ufma.hideloading();
									} else {
										ufma.showTip(data.msg, function () { }, "error");
										_this.removeClass("btn-disablesd")
										$("#zezhao").html('')
										$("#zezhao").hide();
										ufma.hideloading();
									}
								},
								error: function () {
									ufma.hideloading();
									ufma.showTip("保存失败,网络中断", function () { }, "error");
									_this.removeClass("btn-disablesd")
									$("#zezhao").html('')
									$("#zezhao").hide();
									ufma.hideloading();
								}
							});
						} else {
							ufma.hideloading();
						}
					})
				}

			} else {
				ufma.showTip("日期区间不符", function () { }, "warning");
				$("#zezhao").html('')
				$("#zezhao").hide();
			}
		}
	}
})
//模态框保存并关闭
$(document).on("click", "#btn-voucher-bcclose", function (e) {
	$(".all-no").hide();
	stopPropagation(e);
	_this = $(this)
	var allcy = new Object();
	var allcysd = [];
	var thisallcy = new Object();
	var str = isSaveCond();
	if (str > 0) {
		$("#zezhao").html('')
		$("#zezhao").hide();
		$(this).removeClass("btn-disablesd")
		return false;
	} else {
		if (vousinglepz == false && vousinglepzzy == false) {
			if (quanjuvouchaiwu == null) {
				allcy.cwVouVo = null
			} else {
				if (quanjuvouchaiwu.vouDetails == undefined) {
					allcy.cwVouVo = null
				} else if (quanjuvouchaiwu.vouDetails.length == 0) {
					allcy.cwVouVo = null
				} else {
					if (quanjuvouchaiwu.templateGuid != undefined) {
						quanjuvouchaiwu.op = 0;
						isyoute = false;
						cwte = quanjuvouchaiwu.templateGuid;
					}
					allcy.cwVouVo = quanjuvouchaiwu
					delete allcy.cwVouVo.acctName
					delete allcy.cwVouVo.agencyName
					delete allcy.cwVouVo.haveErrInErrTab
					delete allcy.cwVouVo.templateGuid;
					delete allcy.cwVouVo.printStatus;
					delete allcy.cwVouVo.treasuryHook;
				}
			}
			if (quanjuvouyusuan == null) {
				allcy.ysVouVo = null
			} else {
				if (quanjuvouyusuan.vouDetails == undefined) {
					allcy.ysVouVo = null
				} else if (quanjuvouyusuan.vouDetails.length == 0) {
					allcy.ysVouVo = null
				} else {
					if (quanjuvouyusuan.templateGuid != undefined) {
						quanjuvouyusuan.op = 0;
						isyoute = false;
						yste = quanjuvouyusuan.templateGuid;
					}
					allcy.ysVouVo = quanjuvouyusuan
					delete allcy.ysVouVo.acctName
					delete allcy.ysVouVo.agencyName
					delete allcy.ysVouVo.haveErrInErrTab
					delete allcy.ysVouVo.templateGuid;
					delete allcy.ysVouVo.printStatus;
					delete allcy.ysVouVo.treasuryHook;
				}
			}
			allcysd.push(allcy.cwVouVo)
			allcysd.push(allcy.ysVouVo)
			if (allcy.cwVouVo != null && allcy.ysVouVo != null) {
				if (allcy.cwVouVo.amtCr == allcy.ysVouVo.amtCr) {
					isnods = true
				} else {
					var chaer = parseFloat(allcy.cwVouVo.amtCr - allcy.ysVouVo.amtCr).toFixed(2)
					comfirmtext = '财务会计金额' + allcy.cwVouVo.amtCr + '，预算会计金额' + allcy.ysVouVo.amtCr + '，差额' + chaer + '，是否继续'
					isnods = false
				}
			}
		} else {
			allcy = {}
			allcy = huoqu()
			if ($("#pzzhuantaiC").attr("vou-status") != undefined) {
				allcy.treasuryHook = $("#pzzhuantaiC").attr("vou-status");
			} else {
				allcy.treasuryHook = selectdata.data.treasuryHook;
			}
			if (allcy.templateGuid != undefined) {
				isyoute = false;
				cwte = allcy.templateGuid;
			}
			if (allcy.amtCr != allcy.amtDr && allcy.ysAmtCr != allcy.ysAmtDr) {
				ufma.showTip("借、贷金额不相等", function () { }, "warning");
				$(this).removeClass("btn-disablesd")
				return false
			}
			var allcycw = []
			var allcyys = []
			var allcyyssingel = 1
			for (var i = 0; i < allcy.vouDetails.length; i++) {
				if (allcy.vouDetails[i].op != "2") {
					allcy.vouDetails[i].vouSeq = allcyyssingel
					allcyyssingel++
				}
			}
			for (var i = allcy.vouDetails.length - 1; i >= 0; i--) {
				if (allcy.vouDetails[i].accaCode == '1') {
					allcycw.unshift(allcy.vouDetails[i])
				} else if (allcy.vouDetails[i].accaCode == '2') {
					allcyys.unshift(allcy.vouDetails[i])
				}
				if (allcy.vouDetails[i].op != "2") {
					if ((!$.isNull(allcy.vouDetails[i].descpt) && $.isNull(allcy.vouDetails[i].accoCode) && $.isNull(allcy.vouDetails[i].stadAmt))) {
						if (allcy.vouDetails[i].op == "1") {
							allcy.vouDetails[i].op = "2";
						} else {
							allcy.vouDetails.splice(i, 1);
						}
					} else if (!$.isNull(allcy.vouDetails[i].descpt) && !$.isNull(allcy.vouDetails[i].accoCode) && !$.isNull(allcy.vouDetails[i].stadAmt)) {
						//						quanjuvouchaiwu.vouDetails.splice(i, 1);
					} else if (allcy.vouDetails[i].accoCode == '' && allcy.vouDetails[i].stadAmt == '') {
						allcy.vouDetails.splice(i, 1);
					} else if (vousinglepz && $.isNull(allcy.vouDetails[i].descpt)) {
						ufma.showTip("您录入凭证的第" + (parseFloat(i) + 1) + "行摘要未录入", function () { }, "warning")
						$("#zezhao").html('')
						$("#zezhao").hide();
						$(this).removeClass("btn-disablesd")
						return false
					} else if (vousinglepz && $.isNull(allcy.vouDetails[i].stadAmt)) {
						ufma.showTip("您录入凭证的第" + (parseFloat(i) + 1) + "行金额未录入", function () { }, "warning")
						$("#zezhao").html('')
						$("#zezhao").hide();
						$(this).removeClass("btn-disablesd")
						return false
					} else if (vousinglepz && $.isNull(allcy.vouDetails[i].accoCode)) {
						ufma.showTip("您录入凭证的第" + (parseFloat(i) + 1) + "行会计科目未录入", function () { }, "warning")
						$("#zezhao").html('')
						$("#zezhao").hide();
						$(this).removeClass("btn-disablesd")
						return false
					}
				}
			}
			var cycwseq = 1
			for (var i = 0; i < allcycw.length; i++) {
				if (allcycw[i].op != "2") {
					if (vousinglepzzy) {
						allcycw[i].vouSeq = cycwseq
						cycwseq++
					}
					if ((!$.isNull(allcycw[i].descpt) && $.isNull(allcycw[i].accoCode) && $.isNull(allcycw[i].stadAmt))) {
						if (allcycw[i].op == "1") {
							allcycw[i].op = "2";
						} else {
							allcycw.splice(i, 1);
						}
					} else if (!$.isNull(allcycw[i].descpt) && !$.isNull(allcycw[i].accoCode) && !$.isNull(allcycw[i].stadAmt)) {
						//						quanjuvouchaiwu.vouDetails.splice(i, 1);
					} else if (allcycw[i].accoCode == '' && allcycw[i].stadAmt == '') {
						allcycw.splice(i, 1);
					} else if (vousinglepzzy && $.isNull(allcycw[i].descpt)) {
						ufma.showTip("您录入财务会计的第" + (parseFloat(i) + 1) + "行摘要未录入", function () { }, "warning")
						$("#zezhao").html('')
						$("#zezhao").hide();
						$(this).removeClass("btn-disablesd")
						return false
					} else if (vousinglepzzy && $.isNull(allcycw[i].stadAmt)) {
						ufma.showTip("您录入财务会计的第" + (parseFloat(i) + 1) + "行金额未录入", function () { }, "warning")
						$("#zezhao").html('')
						$("#zezhao").hide();
						$(this).removeClass("btn-disablesd")
						return false
					} else if (vousinglepzzy && $.isNull(allcycw[i].accoCode)) {
						ufma.showTip("您录入财务会计的第" + (parseFloat(i) + 1) + "行会计科目未录入", function () { }, "warning")
						$("#zezhao").html('')
						$("#zezhao").hide();
						$(this).removeClass("btn-disablesd")
						return false
					}
				}
			}
			var cyysseq = 1
			for (var i = 0; i < allcyys.length; i++) {
				if (allcyys[i].op != "2") {
					if (vousinglepzzy) {
						allcyys[i].vouSeq = cyysseq
						cyysseq++
					}
					if ((!$.isNull(allcyys[i].descpt) && $.isNull(allcyys[i].accoCode) && $.isNull(allcyys[i].stadAmt))) {
						if (allcyys[i].op == "1") {
							allcyys[i].op = "2";
						} else {
							allcyys.splice(i, 1);
						}
					} else if (!$.isNull(allcyys[i].descpt) && !$.isNull(allcyys[i].accoCode) && !$.isNull(allcyys[i].stadAmt)) {
						//						quanjuvouchaiwu.vouDetails.splice(i, 1);
					} else if (allcyys[i].accoCode == '' && allcyys[i].stadAmt == '') {
						allcyys.splice(i, 1);
					} else if (vousinglepzzy && $.isNull(allcyys[i].descpt)) {
						ufma.showTip("您录入预算会计的第" + (parseFloat(i) + 1) + "行摘要未录入", function () { }, "warning")
						$("#zezhao").html('')
						$("#zezhao").hide();
						$(this).removeClass("btn-disablesd")
						return false
					} else if (vousinglepzzy && $.isNull(allcyys[i].stadAmt)) {
						ufma.showTip("您录入预算会计的第" + (parseFloat(i) + 1) + "行金额未录入", function () { }, "warning")
						$("#zezhao").html('')
						$("#zezhao").hide();
						$(this).removeClass("btn-disablesd")
						return false
					} else if (vousinglepzzy && $.isNull(allcyys[i].accoCode)) {
						ufma.showTip("您录入预算会计的第" + (parseFloat(i) + 1) + "行会计科目未录入", function () { }, "warning")
						$("#zezhao").html('')
						$("#zezhao").hide();
						$(this).removeClass("btn-disablesd")
						return false
					}
				}
			}
			if (allcy.vouDetails.length <= 1) {
				ufma.showTip("至少录入两行内容", function () { }, "warning");
				$("#zezhao").html('')
				$("#zezhao").hide();
				$(this).removeClass("btn-disablesd")
				return false
			}
			allcysd.push(allcy)
			if (allcy.amtCr != allcy.ysAmtCr && allcy.ysAmtCr != 0 && allcy.amtCr != 0) {
				var chaer = parseFloat(allcy.amtCr - allcy.ysAmtCr).toFixed(2)
				comfirmtext = '财务会计金额' + allcy.amtCr + '，预算会计金额' + allcy.ysAmtCr + '，差额' + chaer + '，是否继续'
				isnods = false
			} else {
				isnods = true
			}
		}
	}
	if (vousinglepz == false && vousinglepzzy == false) {
		if (allcysd[0] != null && allcysd[0] != '') {
			allcysd[0].srcBillNo = window.ownerData[0].srcBillNo
			allcysd[0].lpBizBillGuid = window.ownerData[0].lpBizBillGuid
			allcysd[0].vouSource = window.ownerData[0].vouSource
			allcysd[0].vouStatus = window.ownerData[0].vouStatus
		}
		if (allcysd[1] != null && allcysd[1] != '') {
			allcysd[1].srcBillNo = window.ownerData[1].srcBillNo
			allcysd[1].lpBizBillGuid = window.ownerData[1].lpBizBillGuid
			allcysd[1].vouSource = window.ownerData[1].vouSource
			allcysd[1].vouStatus = window.ownerData[1].vouStatus
		}
	} else {
		allcysd[0].srcBillNo = window.ownerData[0].srcBillNo
		allcysd[0].lpBizBillGuid = window.ownerData[0].lpBizBillGuid
		allcysd[0].vouSource = window.ownerData[0].vouSource
		allcysd[0].vouStatus = window.ownerData[0].vouStatus
	}
	var action = {
		data: allcysd,
		action: 'save'
	}
	ufma.ajaxDef('/gl/vou/vouCheck', 'post', allcysd, function (data) {
		if (data.data == '') {
			_close(action)
		} else {
			ufma.showTip(data.data, function () { }, "error");
		}
	})
})
//模态框取消保存
$(document).on("click", "#btn-voucher-qxbc", function () {
	action = {
		action: 'close'
	}
	_close('close')
})
$(document).on("click", "#btn-voucher-modelbcclose", function (e) {
	$(".all-no").hide();
	stopPropagation(e);
	_this = $(this)
	var allcy = new Object();
	var allcysd = [];
	var thisallcy = new Object();
	if (vousinglepz == false && vousinglepzzy == false) {
		if (quanjuvouchaiwu == null) {
			allcy.cwVouVo = null
		} else {
			if (quanjuvouchaiwu.vouDetails == undefined) {
				allcy.cwVouVo = null
			} else if (quanjuvouchaiwu.vouDetails.length == 0) {
				allcy.cwVouVo = null
			} else {
				if (quanjuvouchaiwu.templateGuid != undefined) {
					quanjuvouchaiwu.op = 0;
					isyoute = false;
					cwte = quanjuvouchaiwu.templateGuid;
				}
				allcy.cwVouVo = quanjuvouchaiwu
			}
		}
		if (quanjuvouyusuan == null) {
			allcy.ysVouVo = null
		} else {
			if (quanjuvouyusuan.vouDetails == undefined) {
				allcy.ysVouVo = null
			} else if (quanjuvouyusuan.vouDetails.length == 0) {
				allcy.ysVouVo = null
			} else {
				if (quanjuvouyusuan.templateGuid != undefined) {
					quanjuvouyusuan.op = 0;
					isyoute = false;
					yste = quanjuvouyusuan.templateGuid;
				}
				allcy.ysVouVo = quanjuvouyusuan
			}
		}
		if (allcy.cwVouVo.vouDetails.length < 1 && allcy.ysVouVo.vouDetails.length < 1 ) {
			ufma.showTip("至少录入一行内容", function () { }, "warning");
			$(this).removeClass("btn-disablesd")
			return false
		}
	} else {
		allcy = {}
		allcy = huoqu()
		var allcycw = []
		var allcyys = []
		var allcyyssingel = 1
		for (var i = 0; i < allcy.vouDetails.length; i++) {
			if (allcy.vouDetails[i].op != "2") {
				allcy.vouDetails[i].vouSeq = allcyyssingel
				allcyyssingel++
			}
		}
		if (allcy.vouDetails.length < 1) {
			ufma.showTip("至少录入一行内容", function () { }, "warning");
			$(this).removeClass("btn-disablesd")
			return false
		}
	}
	page.editor = ufma.showModal('voumodalnamemodal', 750, 350)
})
$(document).on("click", "#btn-voumodalnamemodaldel", function (e) {
	page.editor.close()
})
$(document).on("click", "#btn-voumodalnamemodalsave", function (e) {
	$(".all-no").hide();
	voucherupnow = true
	stopPropagation(e);
	_this = $(this)
	var allcy = new Object();
	var allcysd = [];
	var thisallcy = new Object();
	var str = isSaveCond();
	if (str > 0) {
		$("#zezhao").html('')
		$("#zezhao").hide();
		$(this).removeClass("btn-disablesd")
		return false;
	} else {
		if (vousinglepz == false && vousinglepzzy == false) {
			if (quanjuvouchaiwu == null) {
				allcy.cwVouVo = null
			} else {
				if (quanjuvouchaiwu.vouDetails == undefined) {
					allcy.cwVouVo = null
				} else if (quanjuvouchaiwu.vouDetails.length == 0) {
					allcy.cwVouVo = null
				} else {
					if (quanjuvouchaiwu.templateGuid != undefined) {
						quanjuvouchaiwu.op = 0;
						isyoute = false;
						cwte = quanjuvouchaiwu.templateGuid;
					}
					allcy.cwVouVo = quanjuvouchaiwu
					delete allcy.cwVouVo.acctName
					delete allcy.cwVouVo.agencyName
					delete allcy.cwVouVo.haveErrInErrTab
					delete allcy.cwVouVo.templateGuid;
					delete allcy.cwVouVo.printStatus;
					delete allcy.cwVouVo.treasuryHook;
				}
			}
			if (quanjuvouyusuan == null) {
				allcy.ysVouVo = null
			} else {
				if (quanjuvouyusuan.vouDetails == undefined) {
					allcy.ysVouVo = null
				} else if (quanjuvouyusuan.vouDetails.length == 0) {
					allcy.ysVouVo = null
				} else {
					if (quanjuvouyusuan.templateGuid != undefined) {
						quanjuvouyusuan.op = 0;
						isyoute = false;
						yste = quanjuvouyusuan.templateGuid;
					}
					allcy.ysVouVo = quanjuvouyusuan
					delete allcy.ysVouVo.acctName
					delete allcy.ysVouVo.agencyName
					delete allcy.ysVouVo.haveErrInErrTab
					delete allcy.ysVouVo.templateGuid;
					delete allcy.ysVouVo.printStatus;
					delete allcy.ysVouVo.treasuryHook;
				}
			}
			allcysd.push(allcy.cwVouVo)
			allcysd.push(allcy.ysVouVo)
			if (allcy.cwVouVo.vouDetails.length < 1 && allcy.ysVouVo.vouDetails.length < 1 ) {
				ufma.showTip("至少录入一行内容", function () { }, "warning");
				voucherupnow = false
				$(this).removeClass("btn-disablesd")
				return false
			}
		} else {
			allcy = {}
			allcy = huoqu('cg')
			if ($("#pzzhuantaiC").attr("vou-status") != undefined) {
				allcy.treasuryHook = $("#pzzhuantaiC").attr("vou-status");
			} else {
				allcy.treasuryHook = selectdata.data.treasuryHook;
			}
			if (allcy.templateGuid != undefined) {
				isyoute = false;
				cwte = allcy.templateGuid;
			}
			var allcycw = []
			var allcyys = []
			var allcyyssingel = 1
			for (var i = 0; i < allcy.vouDetails.length; i++) {
				if (allcy.vouDetails[i].op != "2") {
					allcy.vouDetails[i].vouSeq = allcyyssingel
					allcyyssingel++
				}
			}
			for (var i = allcy.vouDetails.length - 1; i >= 0; i--) {
				if (allcy.vouDetails[i].accaCode == '1') {
					allcycw.unshift(allcy.vouDetails[i])
				} else if (allcy.vouDetails[i].accaCode == '2') {
					allcyys.unshift(allcy.vouDetails[i])
				}
				if (allcy.vouDetails[i].op != "2") {
					if ((!$.isNull(allcy.vouDetails[i].descpt) && $.isNull(allcy.vouDetails[i].accoCode) && $.isNull(allcy.vouDetails[i].stadAmt))) {
						if (allcy.vouDetails[i].op == "1") {
							allcy.vouDetails[i].op = "2";
						} else {
							allcy.vouDetails.splice(i, 1);
						}
					} else if (!$.isNull(allcy.vouDetails[i].descpt) && !$.isNull(allcy.vouDetails[i].accoCode) && !$.isNull(allcy.vouDetails[i].stadAmt)) {
						//						quanjuvouchaiwu.vouDetails.splice(i, 1);
					} else if (allcy.vouDetails[i].accoCode == '' && allcy.vouDetails[i].stadAmt == '') {
						allcy.vouDetails.splice(i, 1);
					}
				}
			}
			var cycwseq = 1
			for (var i = 0; i < allcycw.length; i++) {
				if (allcycw[i].op != "2") {
					if (vousinglepzzy) {
						allcycw[i].vouSeq = cycwseq
						cycwseq++
					}
					if ((!$.isNull(allcycw[i].descpt) && $.isNull(allcycw[i].accoCode) && $.isNull(allcycw[i].stadAmt))) {
						if (allcycw[i].op == "1") {
							allcycw[i].op = "2";
						} else {
							allcycw.splice(i, 1);
						}
					} else if (!$.isNull(allcycw[i].descpt) && !$.isNull(allcycw[i].accoCode) && !$.isNull(allcycw[i].stadAmt)) {
						//						quanjuvouchaiwu.vouDetails.splice(i, 1);
					} else if (allcycw[i].accoCode == '' && allcycw[i].stadAmt == '') {
						allcycw.splice(i, 1);
					}
				}
			}
			var cyysseq = 1
			for (var i = 0; i < allcyys.length; i++) {
				if (allcyys[i].op != "2") {
					if (vousinglepzzy) {
						allcyys[i].vouSeq = cyysseq
						cyysseq++
					}
					if ((!$.isNull(allcyys[i].descpt) && $.isNull(allcyys[i].accoCode) && $.isNull(allcyys[i].stadAmt))) {
						if (allcyys[i].op == "1") {
							allcyys[i].op = "2";
						} else {
							allcyys.splice(i, 1);
						}
					} else if (!$.isNull(allcyys[i].descpt) && !$.isNull(allcyys[i].accoCode) && !$.isNull(allcyys[i].stadAmt)) {
						//						quanjuvouchaiwu.vouDetails.splice(i, 1);
					} else if (allcyys[i].accoCode == '' && allcyys[i].stadAmt == '') {
						allcyys.splice(i, 1);
					}
				}
			}
			if (allcy.vouDetails.length < 1) {
				ufma.showTip("至少录入一行内容", function () { }, "warning");
				voucherupnow = false
				$(this).removeClass("btn-disablesd")
				return false
			}
			allcysd.push(allcy)
			
		}
	}
	var argu = {
		"description": $("#voumodalnamesel").val(),
		"isTemp": "Y",
		"linkId": window.ownerData.linkPId,
		"tempSource": window.ownerData.isAgency ? "basal" : "sys",
		"templateGuid": window.ownerData.modelId,
		"templateName": $("#voumodalname").val(),
		"vouGroupId": window.ownerData.modelId,
		"vouHeads": allcysd
	}
	if($("#voumodalname").val()==''){
		ufma.showTip('请输入模板名称')
		voucherupnow = false
		return false
	}
	if (window.ownerData.action == 'add') {
		argu.linkId = window.ownerData.linkId
	}
	var callback = function (result) {
		if (result.flag == "success") {
			ufma.hideloading();
			ufma.showTip("保存成功！", function () {
				if (!$.isNull(result.data.cwVouTempVo)) {
					var vouGroundSaved = result.data.cwVouTempVo.vouGroupId;
					var linkId = result.data.cwVouTempVo.linkId;
				} else {
					var vouGroundSaved = result.data.ysVouTempVo.vouGroupId;
					var linkId = result.data.cwVouTempVo.linkId;
				}
				_close('ok', vouGroundSaved, linkId);
			}, "success");

		}
	}
	voucherupnow = false
	ufma.post("/gl/vouTemp/savePairNew", argu, callback);
	page.editor.close()
})
//暂存
$(document).on("click", "#btn-voucher-zc", function () {
	if ($(this).hasClass("btn-disablesd") != true) {
		$(".all-no").hide();
		voucherupnow = true
		$(this).addClass("btn-disablesd")
		$("#xiaocuo").hide();
		issaveDraft()
		//		if($(".voucher-head").attr("tenamess") == undefined) {
		var startdate = $("#dates").getObj().getValue();
		var enddate = result;
		var startD = new Date(Date.parse(startdate.replace(/-/g, "/")));
		var endD = new Date(Date.parse(enddate.replace(/-/g, "/")));
		var days = parseInt((endD.getTime() - startD.getTime()) / (1000 * 60 * 60 * 24));
		days = 0; //不控制
		var isyoute = true;
		cwte = "";
		yste = "";
		_this = $(this)
		var allcy = new Object();
		var allcysd = [];
		var thisallcy = new Object();
		if (vousinglepz == false && vousinglepzzy == false) {
			if (quanjuvouchaiwu == null) {
				allcy.cwVouVo = null
			} else {
				if (quanjuvouchaiwu.vouDetails == undefined) {
					allcy.cwVouVo = null
				} else if (quanjuvouchaiwu.vouDetails.length == 0) {
					allcy.cwVouVo = null
				} else {
					if (quanjuvouchaiwu.templateGuid != undefined) {
						quanjuvouchaiwu.op = 0;
						isyoute = false;
						cwte = quanjuvouchaiwu.templateGuid;
					}
					allcy.cwVouVo = quanjuvouchaiwu
					delete allcy.cwVouVo.acctName
					delete allcy.cwVouVo.agencyName
					delete allcy.cwVouVo.haveErrInErrTab
					delete allcy.cwVouVo.templateGuid;
					delete allcy.cwVouVo.printStatus;
					delete allcy.cwVouVo.treasuryHook;
				}
			}
			if (quanjuvouyusuan == null) {
				allcy.ysVouVo = null
			} else {
				if (quanjuvouyusuan.vouDetails == undefined) {
					allcy.ysVouVo = null
				} else if (quanjuvouyusuan.vouDetails.length == 0) {
					allcy.ysVouVo = null
				} else {
					if (quanjuvouyusuan.templateGuid != undefined) {
						quanjuvouyusuan.op = 0;
						yste = quanjuvouyusuan.templateGuid;
					}
					allcy.ysVouVo = quanjuvouyusuan
					delete allcy.ysVouVo.acctName
					delete allcy.ysVouVo.agencyName
					delete allcy.ysVouVo.haveErrInErrTab
					delete allcy.ysVouVo.templateGuid;
					delete allcy.ysVouVo.printStatus;
					delete allcy.ysVouVo.treasuryHook;
				}
			}
			allcysd.push(allcy.cwVouVo)
			allcysd.push(allcy.ysVouVo)
		} else {
			allcy = {}
			allcy = huoqu()
			allcysd.push(allcy)
		}
		ufma.showloading('正在暂存凭证，请耐心等待...');
		$.ajax({
			type: "post",
			url: "/gl/vouTemp/saveDraft" + "?ajax=1&rueicode=" + hex_md5svUserCode,
			async: false,
			data: JSON.stringify(allcysd),
			contentType: 'application/json; charset=utf-8',
			dataType: 'json',
			success: function (data) {
				if (data.flag == "success") {
					ufma.showTip("保存草稿成功", function () { }, "success");
					nowvoutype = $("#leftbgselect option:selected").attr("value")
					configupdate('voutype', $("#leftbgselect option:selected").attr("value"))
					$("#zezhao").html('')
					$("#zezhao").hide();
					dataforcwys(data.data)
					cwyspd();
					chapz();
					zhuantai();
					if (quanjuvouyusuan != null && quanjuvouchaiwu != null) {
						if ($(".yusuan").hasClass('xuanzhongcy')) {
							$(".chaiwu").trigger('click');
							var timeId = setTimeout(function () {
								$(".yusuan").trigger('click');
								clearTimeout(timeId);
							}, 100);
						} else if ($(".chaiwu").hasClass('xuanzhongcy')) {
							$(".yusuan").trigger('click');
							var timeId = setTimeout(function () {
								$(".chaiwu").trigger('click');
								clearTimeout(timeId);
							}, 100);
						}
					}
					$(".voucher-head").attr("tenamess", selectdata.data.templateGuid);
					ufma.hideloading()
				} else {
					ufma.showTip(data.msg, function () { }, data.flag);
					$("#zezhao").html('')
					$("#zezhao").hide();
					ufma.hideloading()
				}
			},
			error: function () {
				ufma.showTip("保存失败,请检查网络", function () { }, "error");
				$("#zezhao").html('')
				$("#zezhao").hide();
				voucherupnow = false
				ufma.hideloading()
			}
		});
		voucherupnow = false
		setTimeout(function () {
			_this.removeClass("btn-disablesd")
		}, 5000)
	}
})
$(document).on("click", "#btn-voucher-bcbxz", function () {
	var isAction = actionBefore(isAddVou);
	var datesyue = $("#dates").getObj().getValue().substring(5, 7)
	if (!isAction && datesyue != '01') {
		ufma.showTip("上期未结账则不允许做本期凭证！", function () { }, "warning");
		return false;
	}
	var comfirmtext = ''
	if ($(this).hasClass("btn-disablesd") != true) {
		_this = $(this)
		$(this).addClass("btn-disablesd")
		$("#xiaocuo").hide();
		var isnods = true;
		var str = isSaveCond();
		if (str > 0) {
			$("#zezhao").html('')
			$("#zezhao").hide();
			return false;
		} else {
			var startdate = $("#dates").getObj().getValue();
			var enddate = result;
			var startD = new Date(Date.parse(startdate.replace(/-/g, "/")));
			var endD = new Date(Date.parse(enddate.replace(/-/g, "/")));
			var days = parseInt((endD.getTime() - startD.getTime()) / (1000 * 60 * 60 * 24));
			days = 0; //不控制
			if (30 > days && days > -30) {
				var isyoute = true;
				cwte = "";
				yste = "";
				_this = $(this)
				var allcy = new Object();
				var allcysd = [];
				var thisallcy = new Object();
				if (vousinglepz == false && vousinglepzzy == false) {
					if (quanjuvouchaiwu == null) {
						allcy.cwVouVo = null
					} else {
						if (quanjuvouchaiwu.vouDetails == undefined) {
							allcy.cwVouVo = null
						} else if (quanjuvouchaiwu.vouDetails.length == 0) {
							allcy.cwVouVo = null
						} else {
							if (quanjuvouchaiwu.templateGuid != undefined) {
								quanjuvouchaiwu.op = 0;
								isyoute = false;
								cwte = quanjuvouchaiwu.templateGuid;
							}
							allcy.cwVouVo = quanjuvouchaiwu
							delete allcy.cwVouVo.acctName
							delete allcy.cwVouVo.agencyName
							delete allcy.cwVouVo.haveErrInErrTab
							delete allcy.cwVouVo.templateGuid;
							delete allcy.cwVouVo.printStatus;
							delete allcy.cwVouVo.treasuryHook;
						}
					}
					if (quanjuvouyusuan == null) {
						allcy.ysVouVo = null
					} else {
						if (quanjuvouyusuan.vouDetails == undefined) {
							allcy.ysVouVo = null
						} else if (quanjuvouyusuan.vouDetails.length == 0) {
							allcy.ysVouVo = null
						} else {
							if (quanjuvouyusuan.templateGuid != undefined) {
								quanjuvouyusuan.op = 0;
								isyoute = false;
								yste = quanjuvouyusuan.templateGuid;
							}
							allcy.ysVouVo = quanjuvouyusuan
							delete allcy.ysVouVo.acctName
							delete allcy.ysVouVo.agencyName
							delete allcy.ysVouVo.haveErrInErrTab
							delete allcy.ysVouVo.templateGuid;
							delete allcy.ysVouVo.printStatus;
							delete allcy.ysVouVo.treasuryHook;
						}
					}
					allcysd.push(allcy.cwVouVo)
					allcysd.push(allcy.ysVouVo)
					if (allcy.cwVouVo != null && allcy.ysVouVo != null) {
						if (allcy.cwVouVo.amtCr == allcy.ysVouVo.amtCr) {
							isnods = true
						} else {
							var chaer = parseFloat(allcy.cwVouVo.amtCr - allcy.ysVouVo.amtCr).toFixed(2)
							comfirmtext = '财务会计金额' + allcy.cwVouVo.amtCr + '，预算会计金额' + allcy.ysVouVo.amtCr + '，差额' + chaer + '，是否继续'
							isnods = false
						}
					}
					// 					else if(allcy.cwVouVo == null){
					// 						comfirmtext='财务凭证未录入，是否继续'
					// 						isnods = false
					// 					}else if(allcy.ysVouVo == null){
					// 						comfirmtext='预算凭证未录入，是否继续'
					// 						isnods = false
					// 					}
				} else {
					allcy = {}
					allcy = huoqu()
					if (allcy.templateGuid != undefined) {
						isyoute = false;
						cwte = allcy.templateGuid;
					}
					if (allcy.amtCr != allcy.amtDr && allcy.ysAmtCr != allcy.ysAmtDr) {
						ufma.showTip("借、贷金额不相等", function () { }, "warning");
						$(this).removeClass("btn-disablesd")
						return false
					}
					var allcycw = []
					var allcyys = []
					var allcyyssingel = 1
					for (var i = 0; i < allcy.vouDetails.length; i++) {
						if (allcy.vouDetails[i].op != "2") {
							allcy.vouDetails[i].vouSeq = allcyyssingel
							allcyyssingel++
						}
					}
					for (var i = allcy.vouDetails.length - 1; i >= 0; i--) {
						if (allcy.vouDetails[i].accaCode == '1') {
							allcycw.unshift(allcy.vouDetails[i])
						} else if (allcy.vouDetails[i].accaCode == '2') {
							allcyys.unshift(allcy.vouDetails[i])
						}
						if (allcy.vouDetails[i].op != "2") {
							if ((!$.isNull(allcy.vouDetails[i].descpt) && $.isNull(allcy.vouDetails[i].accoCode) && $.isNull(allcy.vouDetails[i].stadAmt))) {
								if (allcy.vouDetails[i].op == "1") {
									allcy.vouDetails[i].op = "2";
								} else {
									allcy.vouDetails.splice(i, 1);
								}
							} else if (!$.isNull(allcy.vouDetails[i].descpt) && !$.isNull(allcy.vouDetails[i].accoCode) && !$.isNull(allcy.vouDetails[i].stadAmt)) {
								//						quanjuvouchaiwu.vouDetails.splice(i, 1);
							} else if (allcy.vouDetails[i].accoCode == '' && allcy.vouDetails[i].stadAmt == '') {
								allcy.vouDetails.splice(i, 1);
							} else if (vousinglepz && $.isNull(allcy.vouDetails[i].descpt)) {
								ufma.showTip("您录入凭证的第" + (parseFloat(i) + 1) + "行摘要未录入", function () { }, "warning")
								$("#zezhao").html('')
								$("#zezhao").hide();
								$(this).removeClass("btn-disablesd")
								return false
							} else if (vousinglepz && $.isNull(allcy.vouDetails[i].stadAmt)) {
								ufma.showTip("您录入凭证的第" + (parseFloat(i) + 1) + "行金额未录入", function () { }, "warning")
								$("#zezhao").html('')
								$("#zezhao").hide();
								$(this).removeClass("btn-disablesd")
								return false
							} else if (vousinglepz && $.isNull(allcy.vouDetails[i].accoCode)) {
								ufma.showTip("您录入凭证的第" + (parseFloat(i) + 1) + "行会计科目未录入", function () { }, "warning")
								$("#zezhao").html('')
								$("#zezhao").hide();
								$(this).removeClass("btn-disablesd")
								return false
							}
						}
					}
					var cycwseq = 1
					for (var i = 0; i < allcycw.length; i++) {
						if (allcycw[i].op != "2") {
							if (vousinglepzzy) {
								allcycw[i].vouSeq = cycwseq
								cycwseq++
							}
							if ((!$.isNull(allcycw[i].descpt) && $.isNull(allcycw[i].accoCode) && $.isNull(allcycw[i].stadAmt))) {
								if (allcycw[i].op == "1") {
									allcycw[i].op = "2";
								} else {
									allcycw.splice(i, 1);
								}
							} else if (!$.isNull(allcycw[i].descpt) && !$.isNull(allcycw[i].accoCode) && !$.isNull(allcycw[i].stadAmt)) {
								//						quanjuvouchaiwu.vouDetails.splice(i, 1);
							} else if (allcycw[i].accoCode == '' && allcycw[i].stadAmt == '') {
								allcycw.splice(i, 1);
							} else if (vousinglepzzy && $.isNull(allcycw[i].descpt)) {
								ufma.showTip("您录入财务会计的第" + (parseFloat(i) + 1) + "行摘要未录入", function () { }, "warning")
								$("#zezhao").html('')
								$("#zezhao").hide();
								$(this).removeClass("btn-disablesd")
								return false
							} else if (vousinglepzzy && $.isNull(allcycw[i].stadAmt)) {
								ufma.showTip("您录入财务会计的第" + (parseFloat(i) + 1) + "行金额未录入", function () { }, "warning")
								$("#zezhao").html('')
								$("#zezhao").hide();
								$(this).removeClass("btn-disablesd")
								return false
							} else if (vousinglepzzy && $.isNull(allcycw[i].accoCode)) {
								ufma.showTip("您录入财务会计的第" + (parseFloat(i) + 1) + "行会计科目未录入", function () { }, "warning")
								$("#zezhao").html('')
								$("#zezhao").hide();
								$(this).removeClass("btn-disablesd")
								return false
							}
						}
					}
					var cyysseq = 1
					for (var i = 0; i < allcyys.length; i++) {
						if (allcyys[i].op != "2") {
							if (vousinglepzzy) {
								allcyys[i].vouSeq = cyysseq
								cyysseq++
							}
							if ((!$.isNull(allcyys[i].descpt) && $.isNull(allcyys[i].accoCode) && $.isNull(allcyys[i].stadAmt))) {
								if (allcyys[i].op == "1") {
									allcyys[i].op = "2";
								} else {
									allcyys.splice(i, 1);
								}
							} else if (!$.isNull(allcyys[i].descpt) && !$.isNull(allcyys[i].accoCode) && !$.isNull(allcyys[i].stadAmt)) {
								//						quanjuvouchaiwu.vouDetails.splice(i, 1);
							} else if (allcyys[i].accoCode == '' && allcyys[i].stadAmt == '') {
								allcyys.splice(i, 1);
							} else if (vousinglepzzy && $.isNull(allcyys[i].descpt)) {
								ufma.showTip("您录入预算会计的第" + (parseFloat(i) + 1) + "行摘要未录入", function () { }, "warning")
								$("#zezhao").html('')
								$("#zezhao").hide();
								$(this).removeClass("btn-disablesd")
								return false
							} else if (vousinglepzzy && $.isNull(allcyys[i].stadAmt)) {
								ufma.showTip("您录入预算会计的第" + (parseFloat(i) + 1) + "行金额未录入", function () { }, "warning")
								$("#zezhao").html('')
								$("#zezhao").hide();
								$(this).removeClass("btn-disablesd")
								return false
							} else if (vousinglepzzy && $.isNull(allcyys[i].accoCode)) {
								ufma.showTip("您录入预算会计的第" + (parseFloat(i) + 1) + "行会计科目未录入", function () { }, "warning")
								$("#zezhao").html('')
								$("#zezhao").hide();
								$(this).removeClass("btn-disablesd")
								return false
							}
						}
					}
					if (allcy.vouDetails.length <= 1) {
						ufma.showTip("至少录入两行内容", function () { }, "warning");
						$("#zezhao").html('')
						$("#zezhao").hide();
						$(this).removeClass("btn-disablesd")
						return false
					}
					allcysd.push(allcy)
					if (allcy.amtCr != allcy.ysAmtCr && allcy.ysAmtCr != 0 && allcy.amtCr != 0) {
						var chaer = parseFloat(allcy.amtCr - allcy.ysAmtCr).toFixed(2)
						comfirmtext = '财务会计金额' + allcy.amtCr + '，预算会计金额' + allcy.ysAmtCr + '，差额' + chaer + '，是否继续'
						isnods = false
					} else {
						isnods = true
					}
				}
				var titlesrc = 'saveVou'
				if (vousinglepz == true) {
					titlesrc = 'saveVou'
				}
				if (isnods) {
					ufma.showloading('正在保存凭证，请耐心等待...');
					$.ajax({
						type: "post",
						url: "/gl/vou/" + titlesrc + "?ajax=1&rueicode=" + hex_md5svUserCode,
						async: false,
						data: JSON.stringify(allcysd),
						contentType: 'application/json; charset=utf-8',
						dataType: 'json',
						success: function (data) {
							ufma.hideloading();
							if (data.flag == "success" || data.flag == "warn") {
								//指标预警提示
								var zhibiaoCode = data.code;
								var zhibiaoMsg = data.msg;
								if (zhibiaoCode == "200" || data.flag == "warn") {
									ufma.showTip(zhibiaoMsg, function () { }, "warning", '10000');
								} else {
									ufma.showTip(zhibiaoMsg, function () { }, "success");
								}
								nowvoutype = $("#leftbgselect option:selected").attr("value")
								configupdate('voutype', $("#leftbgselect option:selected").attr("value"))
								dataforcwys(data.data)
								cwyspd();
								chapz();
								zhuantai();
								gjwindow();
								if (quanjuvouyusuan != null && quanjuvouchaiwu != null) {
									if ($(".yusuan").hasClass('xuanzhongcy')) {
										$(".chaiwu").trigger('click');
										var timeId = setTimeout(function () {
											$(".yusuan").trigger('click');
											clearTimeout(timeId);
										}, 100);
									} else if ($(".chaiwu").hasClass('xuanzhongcy')) {
										$(".yusuan").trigger('click');
										var timeId = setTimeout(function () {
											$(".chaiwu").trigger('click');
											clearTimeout(timeId);
										}, 100);
									}
								}
								if (isyoute == false) {
									if (yste != "") {
										$.ajax({
											type: "get",
											url: "/gl/vouTemp/delVouTem/" + yste + "?ajax=1&rueicode=" + hex_md5svUserCode,
											async: true,
											success: function (data) {
												if (data.flag != "success") {
													ufma.showTip(data.msg, function () { }, "error");
												}
											}
										});
									}
									if (cwte != "") {
										$.ajax({
											type: "get",
											url: "/gl/vouTemp/delVouTem/" + cwte + "?ajax=1&rueicode=" + hex_md5svUserCode,
											async: true,
											success: function (data) {
												if (data.flag != "success") {
													ufma.showTip(data.msg, function () { }, "error");
												}
											}
										});
									}
								}
								upadd()
								MaxVouNoUp()
								_this.removeClass("btn-disablesd")
								//此判断是为了判断现金流量框被打开时，不要关闭遮罩
								if ($("#xianjing").attr("names") != "zhidong") {
									$("#zezhao").html('')
									$("#zezhao").hide();
								}
								ufma.hideloading()
							} else {
								ufma.showTip(data.msg, function () { }, "error");
								_this.removeClass("btn-disablesd")
								$("#zezhao").html('')
								$("#zezhao").hide();
								ufma.hideloading()
							}
						},
						error: function () {
							ufma.hideloading();
							ufma.showTip("保存失败,网络中断", function () { }, "error");
							_this.removeClass("btn-disablesd")
							$("#zezhao").html('')
							$("#zezhao").hide();
						}
					});
				} else {
					ufma.confirm(comfirmtext, function (action) {
						ufma.showloading('正在保存凭证，请耐心等待...');
						if (action) {
							$.ajax({
								type: "post",
								url: "/gl/vou/" + titlesrc + "?ajax=1&rueicode=" + hex_md5svUserCode,
								async: true,
								data: JSON.stringify(allcysd),
								contentType: 'application/json; charset=utf-8',
								dataType: 'json',
								success: function (data) {
									ufma.hideloading();
									if (data.flag == "success" || data.flag == "warn") {
										//指标预警提示
										var zhibiaoCode = data.code;
										var zhibiaoMsg = data.msg;
										if (zhibiaoCode == "200" || data.flag == "warn") {
											ufma.showTip(zhibiaoMsg, function () { }, "warning", '10000');
										} else {
											ufma.showTip(zhibiaoMsg, function () { }, "success");
										}
										nowvoutype = $("#leftbgselect option:selected").attr("value")
										configupdate('voutype', $("#leftbgselect option:selected").attr("value"))
										dataforcwys(data.data)
										var loadtimeId = setTimeout(function () {
											cwyspd();
											chapz();
											//											chapzsave();
											zhuantai();
											gjwindow();
											if (quanjuvouyusuan != null && quanjuvouchaiwu != null) {
												if ($(".yusuan").hasClass('xuanzhongcy')) {
													$(".chaiwu").trigger('click');
													var timeId = setTimeout(function () {
														$(".yusuan").trigger('click');
														clearTimeout(timeId);
													}, 100);
												} else if ($(".chaiwu").hasClass('xuanzhongcy')) {
													$(".yusuan").trigger('click');
													var timeId = setTimeout(function () {
														$(".chaiwu").trigger('click');
														clearTimeout(timeId);
													}, 100);
												}
											}
										}, 5);
										if (isyoute == false) {
											if (yste != "") {
												$.ajax({
													type: "get",
													url: "/gl/vouTemp/delVouTem/" + yste + "?ajax=1&rueicode=" + hex_md5svUserCode,
													async: true,
													success: function (data) {
														if (data.flag == "success") { } else {
															ufma.showTip(data.msg, function () { }, "error");
														}
													}
												});
											}
											if (cwte != "") {
												$.ajax({
													type: "get",
													url: "/gl/vouTemp/delVouTem/" + cwte + "?ajax=1&rueicode=" + hex_md5svUserCode,
													async: true,
													success: function (data) {
														if (data.flag == "success") {
															//						ufma.showTip("删除草稿");
														} else {
															ufma.showTip(data.msg, function () { }, "error");
														}
													}
												});
											}
										}
										upadd()
										MaxVouNoUp()
										_this.removeClass("btn-disablesd")

										//此判断是为了判断现金流量框被打开时，不要关闭遮罩
										if ($("#xianjing").attr("names") != "zhidong") {
											$("#zezhao").html('')
											$("#zezhao").hide();
										}
										ufma.hideloading()
									} else {
										ufma.showTip(data.msg, function () { }, "error");
										_this.removeClass("btn-disablesd")
										$("#zezhao").html('')
										$("#zezhao").hide();
										ufma.hideloading()
									}
								},
								error: function () {
									ufma.hideloading();
									ufma.showTip("保存失败,网络中断", function () { }, "error");
									_this.removeClass("btn-disablesd")
									$("#zezhao").html('')
									$("#zezhao").hide();
								}
							});
						} else {
							ufma.hideloading();
						}
					})
				}

			} else {
				ufma.showTip("日期区间不符", function () { }, "warning");
				_this.removeClass("btn-disablesd")
				$("#zezhao").html('')
				$("#zezhao").hide();
			}
		}
		$(this).removeClass("btn-disablesd")
	}
})
$(document).on("click", "#btn-voucher-xz", function () {
	if ($(this).hasClass("btn-disablesd") != true) {
		for (var i = 0; i < $(".voucher-center").length; i++) {
			if ($(".voucher-center").eq(i).attr("op") != undefined && $(".voucher-center").eq(i).attr("op") != 3 && $(".voucher-center").eq(i).attr("namess") != undefined && selectdata.data.errFlag == 0 && selectdata.data.vouStatus == "O" && $("#pzzhuantai").css('display') == 'none') {
				gaibianl = false;
			}
			if ($(".voucher-center").eq(i).attr("op") != undefined && $(".voucher-center").eq(i).attr("op") == 1 && $(".voucher-center").eq(i).attr("namess") == undefined) {
				gaibianl = false;
			}
		}
		if (gaibianl == false) {
			ufma.confirm('这会取消您当前输入的内容，是否继续', function (action) {
				if (action) {
					gaibianl = true;
					$(this).addClass("btn-disablesd")
					upadd()
					MaxVouNoUp()
					$('.abstractinp').eq(0).focus()
					$(this).removeClass("btn-disablesd")
				}
			})
		} else {
			gaibianl = true;
			$(this).addClass("btn-disablesd")
			upadd()
			MaxVouNoUp()
			$('.abstractinp').eq(0).focus()
			$(this).removeClass("btn-disablesd")
		}
	}
})
$(document).on("click", "#btn-voucher-xs", function () {
	if ($(this).hasClass("btn-disablesd") != true) {
		$(".all-no").hide();
		$(this).addClass("btn-disablesd")
		var arr = [];
		var tempdata = selectdata.data;
		delete tempdata.op;
		delete tempdata.vouDetails;
		delete tempdata.agencyName;
		delete tempdata.acctName;
		delete tempdata.haveErrInErrTab;
		delete tempdata.vouTypeName;
		delete tempdata.treasuryHook;
		delete tempdata.accoBalMap;
		arr.push(tempdata);
		ufma.showloading('正在销审凭证，请耐心等待...');
		$.ajax({
			type: "POST",
			url: "/gl/vouBox/cancelAuditVous" + "?ajax=1&rueicode=" + hex_md5svUserCode,
			dataType: "json",
			data: JSON.stringify(arr),
			contentType: 'application/json; charset=utf-8',
			async: true,
			success: function (data) {
				if (data.flag == "success") {
					ufma.showTip("销审成功", function () { }, "success");
					var vouguid = $(".voucher-head").attr("namess");
					ufma.get("/gl/vou/getVou/" + vouguid, '', function (data) {
						dataforcwys(data.data)
						cwyspd();
						chapz()
						zhuantai();
						if (quanjuvouyusuan != null && quanjuvouchaiwu != null) {
							if ($(".yusuan").hasClass('xuanzhongcy')) {
								$(".chaiwu").trigger('click');
								var timeId = setTimeout(function () {
									$(".yusuan").trigger('click');
									clearTimeout(timeId);
								}, 100);
							} else if ($(".chaiwu").hasClass('xuanzhongcy')) {
								$(".yusuan").trigger('click');
								var timeId = setTimeout(function () {
									$(".chaiwu").trigger('click');
									clearTimeout(timeId);
								}, 100);
							}
						}
					})
					$("#zezhao").html('')
					$("#zezhao").hide();
					ufma.hideloading()
				} else {
					ufma.showTip(data.msg, function () { }, "error");
					$("#zezhao").html('')
					$("#zezhao").hide();
					ufma.hideloading()
				}
			},
			error: function (data) {
				ufma.showTip("销审失败，请检查网络", function () { }, "error")
				$("#zezhao").html('')
				$("#zezhao").hide();
				ufma.hideloading()
			}
		});
		$(this).removeClass("btn-disablesd")
	}
})
$(document).on("click", "#btn-voucher-zf", function () {
	if ($(this).hasClass("btn-disablesd") != true) {
		$(".all-no").hide();
		$(this).addClass("btn-disablesd")
		var arr = [];
		var tempdata = selectdata.data;
		delete tempdata.op;
		delete tempdata.vouDetails;
		delete tempdata.agencyName;
		delete tempdata.acctName;
		delete tempdata.haveErrInErrTab;
		delete tempdata.vouTypeName;
		delete tempdata.treasuryHook;
		delete tempdata.accoBalMap;
		arr.push(tempdata);
		ufma.showloading('正在作废凭证，请耐心等待...');
		$.ajax({
			type: "POST",
			url: "/gl/vouBox/invalidVous" + "?ajax=1&rueicode=" + hex_md5svUserCode,
			dataType: "json",
			data: JSON.stringify(arr),
			contentType: 'application/json; charset=utf-8',
			async: true,
			success: function (data) {
				if (data.flag == "success") {
					ufma.showTip("作废成功", function () { }, "success");
					var vouguid = $(".voucher-head").attr("namess");
					ufma.get("/gl/vou/getVou/" + vouguid, '', function (data) {
						dataforcwys(data.data)
						cwyspd();
						chapz()
						zhuantai();
						if (quanjuvouyusuan != null && quanjuvouchaiwu != null) {
							if ($(".yusuan").hasClass('xuanzhongcy')) {
								$(".chaiwu").trigger('click');
								var timeId = setTimeout(function () {
									$(".yusuan").trigger('click');
									clearTimeout(timeId);
								}, 100);
							} else if ($(".chaiwu").hasClass('xuanzhongcy')) {
								$(".yusuan").trigger('click');
								var timeId = setTimeout(function () {
									$(".chaiwu").trigger('click');
									clearTimeout(timeId);
								}, 100);
							}
						}
					})
					$("#zezhao").html('')
					$("#zezhao").hide();
					ufma.hideloading()
				} else {
					ufma.showTip(data.msg, function () { }, "error");
					$("#zezhao").html('')
					$("#zezhao").hide();
					ufma.hideloading()
				}
			},
			error: function (data) {
				ufma.showTip("作废失败，请检查网络", function () { }, "error")
				ufma.hideloading()
			}
		});
		$(this).removeClass("btn-disablesd")
	}
})
$(document).on("click", "#btn-voucher-hy", function () {
	if ($(this).hasClass("btn-disablesd") != true) {
		$(".all-no").hide();
		$(this).addClass("btn-disablesd")
		var arr = [];
		var tempdata = selectdata.data;
		delete tempdata.op;
		delete tempdata.vouDetails;
		delete tempdata.agencyName;
		delete tempdata.acctName;
		delete tempdata.haveErrInErrTab;
		delete tempdata.vouTypeName;
		delete tempdata.treasuryHook;
		delete tempdata.accoBalMap;
		arr.push(tempdata);
		ufma.showloading('正在还原凭证，请耐心等待...');
		$.ajax({
			type: "POST",
			url: "/gl/vouBox/reductionVous" + "?ajax=1&rueicode=" + hex_md5svUserCode,
			dataType: "json",
			data: JSON.stringify(arr),
			contentType: 'application/json; charset=utf-8',
			async: true,
			success: function (data) {
				if (data.flag == "success") {
					ufma.showTip("还原成功", function () { }, "success");
					var vouguid = $(".voucher-head").attr("namess");
					ufma.get("/gl/vou/getVou/" + vouguid, '', function (data) {
						dataforcwys(data.data)
						cwyspd();
						chapz()
						zhuantai();
						if (quanjuvouyusuan != null && quanjuvouchaiwu != null) {
							if ($(".yusuan").hasClass('xuanzhongcy')) {
								$(".chaiwu").trigger('click');
								var timeId = setTimeout(function () {
									$(".yusuan").trigger('click');
									clearTimeout(timeId);
								}, 100);
							} else if ($(".chaiwu").hasClass('xuanzhongcy')) {
								$(".yusuan").trigger('click');
								var timeId = setTimeout(function () {
									$(".chaiwu").trigger('click');
									clearTimeout(timeId);
								}, 100);
							}
						}
					})
					$("#zezhao").html('')
					$("#zezhao").hide();
					ufma.hideloading()
				} else {
					ufma.showTip(data.msg, function () { }, "error");
					$("#zezhao").html('')
					$("#zezhao").hide();
					ufma.hideloading()
				}
			},
			error: function (data) {
				ufma.showTip(data.msg, function () { }, "error")
				$("#zezhao").html('')
				$("#zezhao").hide();
				ufma.hideloading()
			}
		});
		$(this).removeClass("btn-disablesd")
	}
})
$(document).on("click", "#btn-voucher-fjz", function () {
	if ($(this).hasClass("btn-disablesd") != true) {
		$(".all-no").hide();
		$(this).addClass("btn-disablesd")
		var arr = [];
		var tempdata = selectdata.data;
		arr.push(tempdata.vouGuid);
		ufma.showloading('正在反记账凭证，请耐心等待...');
		$.ajax({
			type: "POST",
			url: "/gl/vou/unpost" + "?ajax=1&rueicode=" + hex_md5svUserCode,
			dataType: "json",
			data: JSON.stringify(arr),
			contentType: 'application/json; charset=utf-8',
			async: true,
			success: function (data) {
				if (data.flag == "success") {
					ufma.showTip("反记账成功", function () { }, "success");
					var vouguid = $(".voucher-head").attr("namess");
					ufma.get("/gl/vou/getVou/" + vouguid, '', function (data) {
						dataforcwys(data.data)
						cwyspd();
						chapz()
						zhuantai();
						if (quanjuvouyusuan != null && quanjuvouchaiwu != null) {
							if ($(".yusuan").hasClass('xuanzhongcy')) {
								$(".chaiwu").trigger('click');
								var timeId = setTimeout(function () {
									$(".yusuan").trigger('click');
									clearTimeout(timeId);
								}, 100);
							} else if ($(".chaiwu").hasClass('xuanzhongcy')) {
								$(".yusuan").trigger('click');
								var timeId = setTimeout(function () {
									$(".chaiwu").trigger('click');
									clearTimeout(timeId);
								}, 100);
							}
						}
					})
					ufma.hideloading()
				} else {
					ufma.showTip(data.msg, function () { }, "error");
					ufma.hideloading()
				}
			},
			error: function (data) {
				ufma.showTip("反记账失败，请检查网络", function () { }, "error")
				ufma.hideloading()
			}
		});
		$(this).removeClass("btn-disablesd")
	}
})
$(document).on("click", "#btn-voucher-gaicuo", function () {
	if ($(this).hasClass("btn-disablesd") != true) {
		$(".all-no").hide();
		$(this).addClass("btn-disablesd")
		var vouguids = new Object();
		vouguids.vouGuid = selectdata.data.vouGuid
		ufma.showloading('正在改错凭证，请耐心等待...');
		$.ajax({
			type: "put",
			data: JSON.stringify(vouguids),
			contentType: 'application/json; charset=utf-8',
			url: "/gl/vou/editErr" + "?ajax=1&rueicode=" + hex_md5svUserCode,
			async: true,
			success: function (data) {
				if (data.flag == "success") {
					ufma.showTip("改错成功", function () { }, "success");
					var vouguid = $(".voucher-head").attr("namess");
					ufma.get("/gl/vou/getVou/" + vouguid, '', function (data) {
						dataforcwys(data.data)
						cwyspd();
						chapz()
						zhuantai();
						if (quanjuvouyusuan != null && quanjuvouchaiwu != null) {
							if ($(".yusuan").hasClass('xuanzhongcy')) {
								$(".chaiwu").trigger('click');
								var timeId = setTimeout(function () {
									$(".yusuan").trigger('click');
									clearTimeout(timeId);
								}, 100);
							} else if ($(".chaiwu").hasClass('xuanzhongcy')) {
								$(".yusuan").trigger('click');
								var timeId = setTimeout(function () {
									$(".chaiwu").trigger('click');
									clearTimeout(timeId);
								}, 100);
							}
						}
					})
					$("#zezhao").html('')
					$("#zezhao").hide();
					ufma.hideloading()
				} else {
					ufma.showTip(data.msg, function () { }, "error")
					$("#zezhao").html('')
					$("#zezhao").hide();
					ufma.hideloading()
				}
			},
			error: function () {
				ufma.showTip("连接失败，请检查网络", function () { }, "error")
				$("#zezhao").html('')
				$("#zezhao").hide();
				ufma.hideloading()
			}
		});
		$(this).removeClass("btn-disablesd")
	}
})
$(document).on("click", "#btn-voucher-xc", function () {
	if ($(this).hasClass("btn-disablesd") != true) {
		$(".all-no").hide();
		$(this).addClass("btn-disablesd")
		var vouguids = new Object();
		vouguids.vouGuid = selectdata.data.vouGuid;
		ufma.showloading('正在销错凭证，请耐心等待...');
		$.ajax({
			type: "put",
			data: JSON.stringify(vouguids),
			contentType: 'application/json; charset=utf-8',
			url: "/gl/vou/cancelErr" + "?ajax=1&rueicode=" + hex_md5svUserCode,
			async: true,
			success: function (data) {
				if (data.flag == "success") {
					ufma.showTip("销错成功", function () { }, "success");
					var vouguid = $(".voucher-head").attr("namess");
					ufma.get("/gl/vou/getVou/" + vouguid, '', function (data) {
						dataforcwys(data.data)
						cwyspd();
						chapz()
						zhuantai();
						if (quanjuvouyusuan != null && quanjuvouchaiwu != null) {
							if ($(".yusuan").hasClass('xuanzhongcy')) {
								$(".chaiwu").trigger('click');
								var timeId = setTimeout(function () {
									$(".yusuan").trigger('click');
									clearTimeout(timeId);
								}, 100);
							} else if ($(".chaiwu").hasClass('xuanzhongcy')) {
								$(".yusuan").trigger('click');
								var timeId = setTimeout(function () {
									$(".chaiwu").trigger('click');
									clearTimeout(timeId);
								}, 100);
							}
						}
					})
					$("#zezhao").html('')
					$("#zezhao").hide();
					ufma.hideloading()
				} else {
					ufma.showTip(data.msg, function () { }, "error")
					$("#zezhao").html('')
					$("#zezhao").hide();
					ufma.hideloading()
				}
			},
			error: function () {
				ufma.showTip("连接失败，请检查网络", function () { }, "error")
				$("#zezhao").html('')
				$("#zezhao").hide();
				ufma.hideloading()
			}
		});
		$(this).removeClass("btn-disablesd")
	}
})
$(document).on("click", "#btn-voucher-sh", function () {
	var isAction = actionBefore(isAuditVou);
	var datesyue = $("#dates").getObj().getValue().substring(5, 7)
	if (!isAction && datesyue != '01') {
		ufma.showTip("上期未结账则不允许审核本期凭证！", function () { }, "warning");

		$(this).removeClass("btn-disablesd")
		return false;
	}
	if ($(this).hasClass("btn-disablesd") != true) {
		$(".all-no").hide();
		$(this).addClass("btn-disablesd")

		function shenHe() {
			var arr = [];
			var tempdata = selectdata.data;
			delete tempdata.op;
			delete tempdata.vouDetails;
			delete tempdata.agencyName;
			delete tempdata.acctName;
			delete tempdata.vouTypeName;
			delete tempdata.haveErrInErrTab;
			delete tempdata.treasuryHook;
			delete tempdata.accoBalMap;
			tempdata.startDate = tempdata.vouDate;
			tempdata.endtDate = tempdata.vouDate;
			tempdata.isVouBox = false
			arr.push(tempdata);
			ufma.showloading('正在审核凭证，请耐心等待...');
			ufma.ajax('/gl/vouBox/auditVous', "POST", arr, function (data) {
				if (data.flag == "success" && data.data.flag == "success") {
					ufma.showTip("审核成功", function () { }, "success");
					var vouguid = $(".voucher-head").attr("namess");
					if (vouguid)
						if (data.data.nextVouGuid != "" && data.data.nextVouGuid != undefined) {
							if (vouguid == data.data.nextVouGuid) {
								ufma.showTip("审核成功，已无连续可审核的凭证", function () { }, "success");
							} else {
								ufma.showTip("审核成功", function () { }, "success");
							}
							vouguid = data.data.nextVouGuid
						}
					ufma.get("/gl/vou/getVou/" + vouguid, '', function (data) {
						dataforcwys(data.data)
						cwyspd();
						chapz()
						zhuantai();
						if (quanjuvouyusuan != null && quanjuvouchaiwu != null) {
							if ($(".yusuan").hasClass('xuanzhongcy')) {
								$(".chaiwu").trigger('click');
								var timeId = setTimeout(function () {
									$(".yusuan").trigger('click');
									clearTimeout(timeId);
								}, 100);
							} else if ($(".chaiwu").hasClass('xuanzhongcy')) {
								$(".yusuan").trigger('click');
								var timeId = setTimeout(function () {
									$(".chaiwu").trigger('click');
									clearTimeout(timeId);
								}, 100);
							}
						}
					})
					$("#zezhao").html('')
					$("#zezhao").hide();
					ufma.hideloading()
				} else {
					ufma.showTip(data.data.msg, function () { }, "error");
					$("#zezhao").html('')
					$("#zezhao").hide();
					ufma.hideloading()
				}
			})
		}
		if ($(".voucher-head").attr("namess") == undefined) {
			ufma.showTip("请保存凭证后再审核", function () { }, "warning")
			$("#zezhao").html('')
			$("#zezhao").hide();
		} else {
			shenHe();
		}
		$(this).removeClass("btn-disablesd")
	}
})
$(document).on("click", "#btn-voucher-jz", function (e) {
	if ($(this).hasClass("btn-disablesd") != true) {
		$(".all-no").hide();
		$(this).addClass("btn-disablesd")
		stopPropagation(e);
		var tempData = selectdata.data;
		var vbObj = [{
			vouGuid: tempData.vouGuid,
			setYear: tempData.setYear,
			agencyCode: tempData.agencyCode,
			acctCode: tempData.acctCode,
			vouNo: tempData.vouNo,
			fisPerd: new Date($("#dates").getObj().getValue()).getMonth() + 1,
			startDate: tempData.vouDate,
			endtDate: tempData.vouDate,
			accaCode: tempData.accaCode,
			vouGroupId: $(".xuanzhongcy").attr("names")
		}];
		if ($(".voucher-head").attr("namess") == undefined) {
			ufma.showTip("抱歉，只有保存的凭证才能使用记账", function () { }, "warning");
		} else {
			ufma.showloading('正在记账凭证，请耐心等待...');
			$.ajax({
				type: "POST",
				url: "/gl/vouBox/accountingVous" + "?ajax=1&rueicode=" + hex_md5svUserCode,
				dataType: "json",
				data: JSON.stringify(vbObj),
				contentType: 'application/json; charset=utf-8',
				async: false,
				success: function (data) {
					if (data.flag == "success") {
						if(data.msg != "记账成功!"){
							ufma.showTip(data.msg, function() {}, "warn");
						}else{
							ufma.showTip("记账成功", function() {}, "success");
						}
						var vouguid = $(".voucher-head").attr("namess");
						ufma.get("/gl/vou/getVou/" + vouguid, '', function (data) {
							dataforcwys(data.data)
							cwyspd();
							chapz()
							zhuantai();
							if (quanjuvouyusuan != null && quanjuvouchaiwu != null) {
								if ($(".yusuan").hasClass('xuanzhongcy')) {
									$(".chaiwu").trigger('click');
									var timeId = setTimeout(function () {
										$(".yusuan").trigger('click');
										clearTimeout(timeId);
									}, 100);
								} else if ($(".chaiwu").hasClass('xuanzhongcy')) {
									$(".yusuan").trigger('click');
									var timeId = setTimeout(function () {
										$(".chaiwu").trigger('click');
										clearTimeout(timeId);
									}, 100);
								}
							}
						})
						$("#zezhao").html('')
						$("#zezhao").hide();
						ufma.hideloading()
					} else {
						ufma.showTip(data.msg, function () { }, "error");
						$("#zezhao").html('')
						$("#zezhao").hide();
						ufma.hideloading()
					}
				},
				error: function (data) {
					ufma.showTip('连接数据库失败', function () { }, "error");
					$("#zezhao").html('')
					$("#zezhao").hide();
					ufma.hideloading()
				}
			});
		}
		$(this).removeClass("btn-disablesd")
	}

})
$(document).on("click", ".btn-bgfj", function () {
	if ($(".voucher-head").attr("namess") == undefined) {
		ufma.showTip("只有已保存的凭证才能上传附件", function () { }, "warning");
	} else {
		$("#zezhao").show();
		$("#zezhao").html('<div class="yu">加载附件中，请稍候</div>');
		$.ajax({
			type: "get",
			url: "/gl/file/getFileList/" + $(".xuanzhongcy").attr("names") + "?ajax=1&rueicode=" + hex_md5svUserCode,
			async: false,
			success: function (data) {
				var fileinputs = '';
				fileinputs += '<div id="vouAttachBox">'
				fileinputs += '<div class="u-msg-title">'
				fileinputs += '<p style="font-size:16px">凭证附件</p>'
				fileinputs += '<div class="attach-close icon-close"></div>'
				fileinputs += '</div>'
				fileinputs += '<div class="u-msg-content">'
				fileinputs += '<div class="attach-step1">'
				fileinputs += '<div class="attach-toolbar">'
				fileinputs += '<div class="attach-toolbar-tip">'
				fileinputs += '<p>附件数：共 <span>' + data.data.length + '</span> 张</p>'
				fileinputs += '</div>'
				fileinputs += '<div class="attach-toolbar-btns">'
				fileinputs += '<button class="btn btn-primary" id="attachUploadBtn">上传</button>'
				fileinputs += '<button class="btn btn-primary" id="attachsaomiaoBtn">扫描</button>'
				fileinputs += '</div>'
				fileinputs += '<div class="attach-clear"></div>'
				fileinputs += '</div>'
				fileinputs += '<div class="attach-show">'
				fileinputs += '<div class="attach-noData" style="display:none;">'
				fileinputs += '<img src="../../images/noData.png" />'
				fileinputs += '<p>目前还没有附件，请选择上传/扫描</p>'
				fileinputs += '</div>'
				fileinputs += '<ul class="attach-show-list">'
				for (var i = 0; i < data.data.length; i++) {
					fileinputs += '<li class="attach-show-li" names="' + data.data[i].attachGuid + '">'
					fileinputs += '<div class="attach-img-box">'
					if (data.data[i].fileFormat.toLowerCase() == ".txt") {
						fileinputs += '<img class="attach-img-file" src="img/txt.png" />'
					} else if (data.data[i].fileFormat.toLowerCase() == ".doc" || data.data[i].fileFormat.toLowerCase() == ".docx") {
						fileinputs += '<img class="attach-img-file" src="img/word.png" />'
					} else if (data.data[i].fileFormat.toLowerCase() == ".xlsx" || data.data[i].fileFormat.toLowerCase() == ".xls") {
						fileinputs += '<img class="attach-img-file" src="img/xls.png" />'
					} else if (data.data[i].fileFormat.toLowerCase() == ".ppt" || data.data[i].fileFormat.toLowerCase() == ".pptx") {
						fileinputs += '<img class="attach-img-file" src="img/ppt.png" />'
					} else if (data.data[i].fileFormat.toLowerCase() == ".pdf") {
						fileinputs += '<img class="attach-img-file" src="img/pdf.png" />'
					} else if (data.data[i].fileFormat.toLowerCase() == ".jpg" || data.data[i].fileFormat.toLowerCase() == ".png" || data.data[i].fileFormat.toLowerCase() == ".gif" || data.data[i].fileFormat.toLowerCase() == ".bmp" || data.data[i].fileFormat.toLowerCase() == ".jpeg") {
						fileinputs += '<img class="attach-img-file" src="/gl/file/download?attachGuid=' + data.data[i].attachGuid + '" />'
					} else if (data.data[i].fileFormat.toLowerCase() == ".rar" || data.data[i].fileFormat.toLowerCase() == ".zip" || data.data[i].fileFormat.toLowerCase() == ".7z") {
						fileinputs += '<img class="attach-img-file" src="img/yasuo.png" />'
					} else {
						fileinputs += '<img class="attach-img-file" src="img/other.png" />'
					}
					fileinputs += '</div>'
					fileinputs += '<div class="attach-img-tip">'
					fileinputs += '<span class="attach-img-name"><b>' + data.data[i].fileName + '</b><s style="display:none">' + i + '</s></span>'
					fileinputs += '<span class="attach-img-byte">' + data.data[i].fileSize + '</span>'
					fileinputs += '<span class="attach-clear"></span>'
					fileinputs += '</div>'
					if (data.data[i].remark == null) {
						fileinputs += '<div class="attach-img-sub" title="' + i + '">暂无备注</div>'
					} else {
						fileinputs += '<div class="attach-img-sub" title="' + data.data[i].remark + '">' + data.data[i].remark + '</div>'
					}
					fileinputs += '<div class="attach-img-sub-edit">'
					fileinputs += '<input type="text" value="' + data.data[i].remark + '" />'
					fileinputs += '<span class="glyphicon icon-check"></span>'
					fileinputs += '</div>'
					fileinputs += '<div class="attach-img-btns">'
					fileinputs += '<span class="glyphicon icon-edit"></span>'
					fileinputs += '<span class="glyphicon icon-download"></span>'
					fileinputs += '<span class="glyphicon icon-trash"></span>'
					fileinputs += '</div>'
					fileinputs += '</li>'
				}
				fileinputs += '</ul>'
				fileinputs += '</div>'
				fileinputs += '</div>'
				fileinputs += '<div class="attach-step2">'
				fileinputs += '<div class="attach-toolbar">'
				fileinputs += '<div class="attach-toolbar-back">'
				fileinputs += '<span class="glyphicon icon-angle-left"></span>返回'
				fileinputs += '</div>'
				fileinputs += '</div>'
				fileinputs += '<div class="attach-upload-box">'
				fileinputs += '<div class="attach-upload-noData">'
				fileinputs += '<span class="glyphicon icon-upload-lg"></span>'
				fileinputs += '<p>点击或点击后将文件拖拽到这里上传</p>'
				fileinputs += '</div>'
				fileinputs += '<form enctype="multipart/form-data" style="margin-top:10px;">'
				fileinputs += '<input id="attachUploadFile" type="file" multiple class="file" data-overwrite-initial="false">'
				fileinputs += '</form>'
				fileinputs += '<div class="attach-upload-toolbar" style="display:none">'
				fileinputs += '<button class="btn btn-primary" id="attach-upload-start">开始上传</button>'
				fileinputs += '<span class="attach-uploaded-info"></span>'
				fileinputs += '</div>'
				fileinputs += '</div>'
				fileinputs += '</div>'
				fileinputs += '<div class="attach-step3"></div>'
				fileinputs += '</div>'
				fileinputs += '</div>'
				$("#zezhao").html(fileinputs);
				$("#vouAttachBox").show();
				$("#vouAttachBox").css("background", "#fff");
				$("#vouAttachBox #attachUploadFile").fileinput({
					language: "zh",
					uploadUrl: "/gl/file/upload",
					//		allowedFileExtensions: ['jpg', 'png', 'gif', 'txt', 'pdf', 'xls', 'xlsx', 'doc', 'docx', 'ppt'],
					overwriteInitial: false,
					uploadasync: false, //默认异步上传
					showUpload: true, //是否显示上传按钮
					maxFileSize: 10000,
					showRemove: false, //显示移除按钮
					showPreview: true, //是否显示预览
					browseClass: "btn btn-primary", //按钮样式
					msgSizeTooSmall: "文件 {name} ({size} KB) 太小了，必须大于 {minSize} KB.",
					uploadExtraData: function (previewId, index) {
						var obj = {};
						obj.vouGuid = $(".voucher-head").attr("namess");
						return obj;
					},
					slugCallback: function (filename) {
						return filename.replace('(', '_').replace(']', '_');
					},
					fileimageuploaded: function () {
						console.info(1);
					},
				}).on("fileuploaded", function (event, data, previewId, index) {
					if (data.response) {
						ufma.showTip('处理成功', function () { }, "success");
						$(".kv-file-remove").css('display', 'none');
					}
				})
			}

		});

	}
})
$(document).on("click", ".voucher-history-by-nr", function () {
	var thishisVouGuid = $(this).attr("namess")
	if ($(this).attr("namess") != "null" && $(this).attr("namess") != "") {
		$.ajax({
			type: "get",
			url: "/gl/vou/getVouHis/" + thishisVouGuid + "?ajax=1&rueicode=" + hex_md5svUserCode,
			async: false,
			success: function (data) {
				if (data.flag == "success") {
					if ($(".xuanzhongcy").hasClass("chaiwu")) {
						quanjuvouchaiwu = selectdata.data;
						selectdata.data = data.data;
						$(".voucher").remove();
						voucheralls()
						cwyspd();
						chapz();
						zhuantai();
						$(".voucherbtn").hide();
						$("#cbAgency,#cbAcct").on("click", function () {
							return false;
						});
						$(".voucherqh").hide();
						$(".btn-bgfj").hide();
						$(".btn-showleft").hide();
						$(".chaiwu").hide();
						$(".yusuan").hide();
						$(".xjll").hide();
						$(".voucher-beizhu").hide();
						$(".voucher-history").hide();
						$("#xiaocuo").hide();
						$("body").append("<div class='btn-closehistory' names='1'>关闭</div>")
					} else {
						quanjuvouyusuan = selectdata.data;
						selectdata.data = data.data;
						$(".voucher").remove();
						voucheralls()
						cwyspd();
						chapz();
						zhuantai();
						$(".voucherbtn").hide();
						$(".chaiwu").hide();
						$(".yusuan").hide();
						$(".xjll").hide();
						$(".voucher-beizhu").hide();
						$(".voucher-history").hide();
						$("body").append("<div class='btn-closehistory' names='2'>关闭</div>")
					}
				} else {
					ufma.showTip(data.msg, function () { }, "error");
				}
			},
			error: function () {
				ufma.showTip('数据库连接失败', function () { }, "error");
			}
		});
	}
})
$(document).on("click", "#btn-voucher-sc", function () {
	if (isvousource || selectdata.data.vouSource == 'AUTO' || isVouDel) {
		if (onlyVoidCanDel) {
			if ($("#pzzhuantai").attr("vou-status") != "C") {
				ufma.showTip("只能删除作废凭证！", function () { }, "warning");
				return false;
			}
		}
		if ($(this).hasClass("btn-disablesd") != true) {
			$(".all-no").hide();
			$(this).addClass("btn-disablesd")
			_this = $(this);
			var vouguid = $(".voucher-head").attr("namess");
			var vouguids = new Object();
			vouguids.vouGuid = vouguid
			ufma.confirm('确认删除此凭证吗？', function (action) {
				if (action) {
					$.ajax({
						type: "delete",
						data: JSON.stringify(vouguids),
						contentType: 'application/json; charset=utf-8',
						url: "/gl/vou/delVou" + "?ajax=1&rueicode=" + hex_md5svUserCode,
						dataType: "json",
						async: false,
						success: function (data) {
							if (data.flag == "success") {
								prevnextvoucher = -1;
								$(".voucherhe").find("#sppz").val("*");
								$("#fjd").val("");
								$("#pzzhuantai").hide();
								$(".chaiwu").addClass("xuanzhongcy").removeAttr("names");
								$(".yusuan").removeClass("xuanzhongcy").removeAttr("names");
								quanjuvouchaiwu = {};
								quanjuvouyusuan = {};
								selectdata = {};
								selectdata.data = {};
								$(".voucher").remove();
								voucheralls();
								vouluru();
								ufma.showTip(data.msg, function () { }, "success");
								$('#btn-voucher-xz').trigger('click');
							} else {
								ufma.showTip(data.msg, function () { }, "error");
							}
						},
						error: function (data) {
							ufma.showTip("失败,请检查网络", function () { }, "error");
						}
					});
				}
			});
			$("#zezhao").html('')
			$("#zezhao").hide();
			$(this).removeClass("btn-disablesd")
		}
	} else {
		ufma.showTip('不允许删除子系统生成的凭证')
	}
})
$(document).on("click", ".btn-closehistory", function () {
	if ($(this).attr("names") == "1") {
		$(".voucherbtn").show();
		$("#cbAgency,#cbAcct").on("click", function () {
			return false;
		})
		if (rpt.isParallel != "1") {
			$(".chaiwu").hide();
			$(".yusuan").hide();
		} else {
			$(".chaiwu").show();
			$(".yusuan").show();
		}
		$(".voucher-beizhu").show();
		$(".voucher-history").show();
		$(".voucherqh").show();
		$(".btn-bgfj").show();
		$(".btn-showleft").show();
		selectdata.data = quanjuvouchaiwu;
		if (selectdata.data.errFlag != 0) {
			$("#xiaocuo").show();
		}
		$(".voucherhe").find("#sppz").val("*");
		$(".voucher").remove();
		voucheralls()
		cwyspd();
		chapz();
		zhuantai();
		$(this).remove();
	} else {
		$(".voucherbtn").show();
		$(".chaiwu").show();
		$(".yusuan").show();
		$(".voucher-beizhu").show();
		$(".voucher-history").show();
		selectdata.data = quanjuvouyusuan;
		$(".voucher").remove();
		voucheralls()
		cwyspd();
		chapz();
		zhuantai();
		$(this).remove();
	}
})
$(document).on("click", "#btn-voucher-bcbdy", function () {
	var isAction = actionBefore(isAddVou);
	var datesyue = $("#dates").getObj().getValue().substring(5, 7)
	if (!isAction && datesyue != '01') {
		ufma.showTip("上期未结账则不允许做本期凭证！", function () { }, "warning");
		return false;
	}
	var comfirmtext = ''
	if ($(this).hasClass("btn-disablesd") != true) {
		_this = $(this)
		$(this).addClass("btn-disablesd")
		$("#xiaocuo").hide();
		var isnods = true;
		var str = isSaveCond();
		if (str > 0) {
			$("#zezhao").html('')
			$("#zezhao").hide();
			$(this).removeClass("btn-disablesd")
			return false;
		} else {
			var startdate = $("#dates").getObj().getValue();
			var enddate = result;
			var startD = new Date(Date.parse(startdate.replace(/-/g, "/")));
			var endD = new Date(Date.parse(enddate.replace(/-/g, "/")));
			var days = parseInt((endD.getTime() - startD.getTime()) / (1000 * 60 * 60 * 24));
			days = 0; //不控制
			if (30 > days && days > -30) {
				var isyoute = true;
				cwte = "";
				yste = "";
				_this = $(this)
				var allcy = new Object();
				var allcysd = [];
				var thisallcy = new Object();
				if (vousinglepz == false && vousinglepzzy == false) {
					if (quanjuvouchaiwu == null) {
						allcy.cwVouVo = null
					} else {
						if (quanjuvouchaiwu.vouDetails == undefined) {
							allcy.cwVouVo = null
						} else if (quanjuvouchaiwu.vouDetails.length == 0) {
							allcy.cwVouVo = null
						} else {
							if (quanjuvouchaiwu.templateGuid != undefined) {
								quanjuvouchaiwu.op = 0;
								isyoute = false;
								cwte = quanjuvouchaiwu.templateGuid;
							}
							allcy.cwVouVo = quanjuvouchaiwu
							delete allcy.cwVouVo.acctName
							delete allcy.cwVouVo.agencyName
							delete allcy.cwVouVo.haveErrInErrTab
							delete allcy.cwVouVo.templateGuid;
							delete allcy.cwVouVo.printStatus;
							delete allcy.cwVouVo.treasuryHook;
						}
					}
					if (quanjuvouyusuan == null) {
						allcy.ysVouVo = null
					} else {
						if (quanjuvouyusuan.vouDetails == undefined) {
							allcy.ysVouVo = null
						} else if (quanjuvouyusuan.vouDetails.length == 0) {
							allcy.ysVouVo = null
						} else {
							if (quanjuvouyusuan.templateGuid != undefined) {
								quanjuvouyusuan.op = 0;
								isyoute = false;
								yste = quanjuvouyusuan.templateGuid;
							}
							allcy.ysVouVo = quanjuvouyusuan
							delete allcy.ysVouVo.acctName
							delete allcy.ysVouVo.agencyName
							delete allcy.ysVouVo.haveErrInErrTab
							delete allcy.ysVouVo.templateGuid;
							delete allcy.ysVouVo.printStatus;
							delete allcy.ysVouVo.treasuryHook;
						}
					}
					allcysd.push(allcy.cwVouVo)
					allcysd.push(allcy.ysVouVo)
					if (allcy.cwVouVo != null && allcy.ysVouVo != null) {
						if (allcy.cwVouVo.amtCr == allcy.ysVouVo.amtCr) {
							isnods = true
						} else {
							var chaer = parseFloat(allcy.cwVouVo.amtCr - allcy.ysVouVo.amtCr).toFixed(2)
							comfirmtext = '财务会计金额' + allcy.cwVouVo.amtCr + '，预算会计金额' + allcy.ysVouVo.amtCr + '，差额' + chaer + '，是否继续'
							isnods = false
						}
					}
					// 					else if(allcy.cwVouVo == null){
					// 						comfirmtext='财务凭证未录入，是否继续'
					// 						isnods = false
					// 					}else if(allcy.ysVouVo == null){
					// 						comfirmtext='预算凭证未录入，是否继续'
					// 						isnods = false
					// 					}
				} else {
					allcy = {}
					allcy = huoqu()
					if (allcy.templateGuid != undefined) {
						isyoute = false;
						cwte = allcy.templateGuid;
					}
					if (allcy.amtCr != allcy.amtDr && allcy.ysAmtCr != allcy.ysAmtDr) {
						ufma.showTip("借、贷金额不相等", function () { }, "warning");
						$(this).removeClass("btn-disablesd")
						return false
					}
					var allcycw = []
					var allcyys = []
					var allcyyssingel = 1
					for (var i = 0; i < allcy.vouDetails.length; i++) {
						if (allcy.vouDetails[i].op != "2") {
							allcy.vouDetails[i].vouSeq = allcyyssingel
							allcyyssingel++
						}
					}
					for (var i = allcy.vouDetails.length - 1; i >= 0; i--) {
						if (allcy.vouDetails[i].accaCode == '1') {
							allcycw.unshift(allcy.vouDetails[i])
						} else if (allcy.vouDetails[i].accaCode == '2') {
							allcyys.unshift(allcy.vouDetails[i])
						}
						if (allcy.vouDetails[i].op != "2") {
							if ((!$.isNull(allcy.vouDetails[i].descpt) && $.isNull(allcy.vouDetails[i].accoCode) && $.isNull(allcy.vouDetails[i].stadAmt))) {
								if (allcy.vouDetails[i].op == "1") {
									allcy.vouDetails[i].op = "2";
								} else {
									allcy.vouDetails.splice(i, 1);
								}
							} else if (!$.isNull(allcy.vouDetails[i].descpt) && !$.isNull(allcy.vouDetails[i].accoCode) && !$.isNull(allcy.vouDetails[i].stadAmt)) {
								//						quanjuvouchaiwu.vouDetails.splice(i, 1);
							} else if (allcy.vouDetails[i].accoCode == '' && allcy.vouDetails[i].stadAmt == '') {
								allcy.vouDetails.splice(i, 1);
							} else if (vousinglepz && $.isNull(allcy.vouDetails[i].descpt)) {
								ufma.showTip("您录入凭证的第" + (parseFloat(i) + 1) + "行摘要未录入", function () { }, "warning")
								$("#zezhao").html('')
								$("#zezhao").hide();
								$(this).removeClass("btn-disablesd")
								return false
							} else if (vousinglepz && $.isNull(allcy.vouDetails[i].stadAmt)) {
								ufma.showTip("您录入凭证的第" + (parseFloat(i) + 1) + "行金额未录入", function () { }, "warning")
								$("#zezhao").html('')
								$("#zezhao").hide();
								$(this).removeClass("btn-disablesd")
								return false
							} else if (vousinglepz && $.isNull(allcy.vouDetails[i].accoCode)) {
								ufma.showTip("您录入凭证的第" + (parseFloat(i) + 1) + "行会计科目未录入", function () { }, "warning")
								$("#zezhao").html('')
								$("#zezhao").hide();
								$(this).removeClass("btn-disablesd")
								return false
							}
						}
					}
					var cycwseq = 1
					for (var i = 0; i < allcycw.length; i++) {
						if (allcycw[i].op != "2") {
							if (vousinglepzzy) {
								allcycw[i].vouSeq = cycwseq
								cycwseq++
							}
							if ((!$.isNull(allcycw[i].descpt) && $.isNull(allcycw[i].accoCode) && $.isNull(allcycw[i].stadAmt))) {
								if (allcycw[i].op == "1") {
									allcycw[i].op = "2";
								} else {
									allcycw.splice(i, 1);
								}
							} else if (!$.isNull(allcycw[i].descpt) && !$.isNull(allcycw[i].accoCode) && !$.isNull(allcycw[i].stadAmt)) {
								//						quanjuvouchaiwu.vouDetails.splice(i, 1);
							} else if (allcycw[i].accoCode == '' && allcycw[i].stadAmt == '') {
								allcycw.splice(i, 1);
							} else if (vousinglepzzy && $.isNull(allcycw[i].descpt)) {
								ufma.showTip("您录入财务会计的第" + (parseFloat(i) + 1) + "行摘要未录入", function () { }, "warning")
								$("#zezhao").html('')
								$("#zezhao").hide();
								$(this).removeClass("btn-disablesd")
								return false
							} else if (vousinglepzzy && $.isNull(allcycw[i].stadAmt)) {
								ufma.showTip("您录入财务会计的第" + (parseFloat(i) + 1) + "行金额未录入", function () { }, "warning")
								$("#zezhao").html('')
								$("#zezhao").hide();
								$(this).removeClass("btn-disablesd")
								return false
							} else if (vousinglepzzy && $.isNull(allcycw[i].accoCode)) {
								ufma.showTip("您录入财务会计的第" + (parseFloat(i) + 1) + "行会计科目未录入", function () { }, "warning")
								$("#zezhao").html('')
								$("#zezhao").hide();
								$(this).removeClass("btn-disablesd")
								return false
							}
						}
					}
					var cyysseq = 1
					for (var i = 0; i < allcyys.length; i++) {
						if (allcyys[i].op != "2") {
							if (vousinglepzzy) {
								allcyys[i].vouSeq = cyysseq
								cyysseq++
							}
							if ((!$.isNull(allcyys[i].descpt) && $.isNull(allcyys[i].accoCode) && $.isNull(allcyys[i].stadAmt))) {
								if (allcyys[i].op == "1") {
									allcyys[i].op = "2";
								} else {
									allcyys.splice(i, 1);
								}
							} else if (!$.isNull(allcyys[i].descpt) && !$.isNull(allcyys[i].accoCode) && !$.isNull(allcyys[i].stadAmt)) {
								//						quanjuvouchaiwu.vouDetails.splice(i, 1);
							} else if (allcyys[i].accoCode == '' && allcyys[i].stadAmt == '') {
								allcyys.splice(i, 1);
							} else if (vousinglepzzy && $.isNull(allcyys[i].descpt)) {
								ufma.showTip("您录入预算会计的第" + (parseFloat(i) + 1) + "行摘要未录入", function () { }, "warning")
								$("#zezhao").html('')
								$("#zezhao").hide();
								$(this).removeClass("btn-disablesd")
								return false
							} else if (vousinglepzzy && $.isNull(allcyys[i].stadAmt)) {
								ufma.showTip("您录入预算会计的第" + (parseFloat(i) + 1) + "行金额未录入", function () { }, "warning")
								$("#zezhao").html('')
								$("#zezhao").hide();
								$(this).removeClass("btn-disablesd")
								return false
							} else if (vousinglepzzy && $.isNull(allcyys[i].accoCode)) {
								ufma.showTip("您录入预算会计的第" + (parseFloat(i) + 1) + "行会计科目未录入", function () { }, "warning")
								$("#zezhao").html('')
								$("#zezhao").hide();
								$(this).removeClass("btn-disablesd")
								return false
							}
						}
					}
					if (allcy.vouDetails.length <= 1) {
						ufma.showTip("至少录入两行内容", function () { }, "warning");
						$("#zezhao").html('')
						$("#zezhao").hide();
						$(this).removeClass("btn-disablesd")
						return false
					}
					allcysd.push(allcy)
					if (allcy.amtCr != allcy.ysAmtCr && allcy.ysAmtCr != 0 && allcy.amtCr != 0) {
						var chaer = parseFloat(allcy.amtCr - allcy.ysAmtCr).toFixed(2)
						comfirmtext = '财务会计金额' + allcy.amtCr + '，预算会计金额' + allcy.ysAmtCr + '，差额' + chaer + '，是否继续'
						isnods = false
					} else {
						isnods = true
					}
				}
				var titlesrc = 'saveVou'
				if (vousinglepz == true) {
					titlesrc = 'saveVou'
				}
				if (isnods) {
					ufma.showloading('正在保存凭证，请耐心等待...');
					$.ajax({
						type: "post",
						url: "/gl/vou/" + titlesrc + "?ajax=1&rueicode=" + hex_md5svUserCode,
						async: false,
						data: JSON.stringify(allcysd),
						contentType: 'application/json; charset=utf-8',
						dataType: 'json',
						success: function (data) {
							ufma.hideloading();
							if (data.flag == "success" || data.flag == "warn") {
								//指标预警提示
								var zhibiaoCode = data.code;
								var zhibiaoMsg = data.msg;
								if (zhibiaoCode == "200" || data.flag == "warn") {
									ufma.showTip(zhibiaoMsg, function () { }, "warning", '10000');
								} else {
									ufma.showTip(zhibiaoMsg, function () { }, "success");
								}
								nowvoutype = $("#leftbgselect option:selected").attr("value")
								configupdate('voutype', $("#leftbgselect option:selected").attr("value"))
								dataforcwys(data.data)
								var loadtimeId = setTimeout(function () {
									cwyspd();
									chapz();
									//									chapzsave();
									zhuantai();
									gjwindow();
									if (quanjuvouyusuan != null && quanjuvouchaiwu != null) {
										if ($(".yusuan").hasClass('xuanzhongcy')) {
											$(".chaiwu").trigger('click');
											var timeId = setTimeout(function () {
												$(".yusuan").trigger('click');
												clearTimeout(timeId);
											}, 100);
										} else if ($(".chaiwu").hasClass('xuanzhongcy')) {
											$(".yusuan").trigger('click');
											var timeId = setTimeout(function () {
												$(".chaiwu").trigger('click');
												clearTimeout(timeId);
											}, 100);
										}
									}
									$('#btn-voucher-dy').trigger('click')
								}, 5);
								if (isyoute == false) {
									if (yste != "") {
										$.ajax({
											type: "get",
											url: "/gl/vouTemp/delVouTem/" + yste + "?ajax=1&rueicode=" + hex_md5svUserCode,
											async: true,
											success: function (data) {
												if (data.flag != "success") {
													ufma.showTip(data.msg, function () { }, "error");
												}
											}
										});
									}
									if (cwte != "") {
										$.ajax({
											type: "get",
											url: "/gl/vouTemp/delVouTem/" + cwte + "?ajax=1&rueicode=" + hex_md5svUserCode,
											async: true,
											success: function (data) {
												if (data.flag != "success") {
													ufma.showTip(data.msg, function () { }, "error");
												}
											}
										});
									}
								}

								//								$(".xjll").slideDown(100);
								if (quanjuvouchaiwu != null) {
									var xjvouguid = new Object();
									xjvouguid.vouGuid = quanjuvouchaiwu.vouGuid;
									$.ajax({
										type: "get",
										url: "/gl/vou/getCf/" + quanjuvouchaiwu.vouGuid + "?ajax=1&rueicode=" + hex_md5svUserCode,
										async: true,
										contentType: 'application/json; charset=utf-8',
										success: function (data) {
											if (data.flag == "success") {
												xianjingliu = data;
												if (xianjingliu.data.CF_Vouacco.length > 0) {
													xianjinglius(xianjingliu, quanjuvoudatas);
												}
											} else {
												ufma.showTip(data.msg, function () { }, "error");
												$("#zezhao").html('')
												$("#zezhao").hide();
											}
										},
										error: function () {
											ufma.showTip("数据库连接失败", function () { }, "error");
											$("#zezhao").html('')
											$("#zezhao").hide();
										}
									});
								} else {
									if (zhibiaoCode == "200") {
										ufma.showTip(zhibiaoMsg, function () { }, "warning", '10000');
									} else {
										ufma.showTip(zhibiaoMsg, function () { }, "success");
									}
								}
								//此判断是为了判断现金流量框被打开时，不要关闭遮罩
								if ($("#xianjing").attr("names") != "zhidong") {
									$("#zezhao").html('')
									$("#zezhao").hide();
								}
								_this.removeClass("btn-disablesd")
							} else {
								ufma.showTip(data.msg, function () { }, "error");
								_this.removeClass("btn-disablesd")
								$("#zezhao").html('')
								$("#zezhao").hide();
							}
						},
						error: function () {
							ufma.hideloading();
							ufma.showTip("保存失败,网络中断", function () { }, "error");
							_this.removeClass("btn-disablesd")
							$("#zezhao").html('')
							$("#zezhao").hide();
						}
					});
				} else {
					ufma.confirm(comfirmtext, function (action) {
						ufma.showloading('正在保存凭证，请耐心等待...');
						if (action) {
							$.ajax({
								type: "post",
								url: "/gl/vou/" + titlesrc + "?ajax=1&rueicode=" + hex_md5svUserCode,
								async: true,
								data: JSON.stringify(allcysd),
								contentType: 'application/json; charset=utf-8',
								dataType: 'json',
								success: function (data) {
									ufma.hideloading();
									if (data.flag == "success" || data.flag == "warn") {
										//指标预警提示
										var zhibiaoCode = data.code;
										var zhibiaoMsg = data.msg;
										if (zhibiaoCode == "200" || data.flag == "warn") {
											ufma.showTip(zhibiaoMsg, function () { }, "warning", '10000');
										} else {
											ufma.showTip(zhibiaoMsg, function () { }, "success");
										}
										nowvoutype = $("#leftbgselect option:selected").attr("value")
										configupdate('voutype', $("#leftbgselect option:selected").attr("value"))
										dataforcwys(data.data)
										var loadtimeId = setTimeout(function () {
											cwyspd();
											chapz();
											//											chapzsave();
											zhuantai();
											gjwindow();
											if (quanjuvouyusuan != null && quanjuvouchaiwu != null) {
												if ($(".yusuan").hasClass('xuanzhongcy')) {
													$(".chaiwu").trigger('click');
													var timeId = setTimeout(function () {
														$(".yusuan").trigger('click');
														clearTimeout(timeId);
													}, 100);
												} else if ($(".chaiwu").hasClass('xuanzhongcy')) {
													$(".yusuan").trigger('click');
													var timeId = setTimeout(function () {
														$(".chaiwu").trigger('click');
														clearTimeout(timeId);
													}, 100);
												}
											}
											$('#btn-voucher-dy').trigger('click')
										}, 5);
										if (isyoute == false) {
											if (yste != "") {
												$.ajax({
													type: "get",
													url: "/gl/vouTemp/delVouTem/" + yste + "?ajax=1&rueicode=" + hex_md5svUserCode,
													async: true,
													success: function (data) {
														if (data.flag == "success") { } else {
															ufma.showTip(data.msg, function () { }, "error");
														}
													}
												});
											}
											if (cwte != "") {
												$.ajax({
													type: "get",
													url: "/gl/vouTemp/delVouTem/" + cwte + "?ajax=1&rueicode=" + hex_md5svUserCode,
													async: true,
													success: function (data) {
														if (data.flag == "success") {
															//						ufma.showTip("删除草稿");
														} else {
															ufma.showTip(data.msg, function () { }, "error");
														}
													}
												});
											}
										}
										//										$(".xjll").slideDown(100);
										if (quanjuvouchaiwu != null) {
											var xjvouguid = new Object();
											xjvouguid.vouGuid = quanjuvouchaiwu.vouGuid;
											$.ajax({
												type: "get",
												url: "/gl/vou/getCf/" + quanjuvouchaiwu.vouGuid + "?ajax=1&rueicode=" + hex_md5svUserCode,
												async: true,
												contentType: 'application/json; charset=utf-8',
												success: function (data) {
													if (data.flag == "success") {
														xianjingliu = data;
														if (xianjingliu.data.CF_Vouacco.length > 0) {
															xianjinglius(xianjingliu, quanjuvoudatas);
														}
													} else {
														ufma.showTip(data.msg, function () { }, "error");
														$("#zezhao").html('')
														$("#zezhao").hide();
													}
												},
												error: function () {
													ufma.showTip("数据库连接失败", function () { }, "error");
													$("#zezhao").html('')
													$("#zezhao").hide();
												}
											});
										} else {
											if (zhibiaoCode == "200") {
												ufma.showTip(zhibiaoMsg, function () { }, "warning", '10000');
											} else {
												ufma.showTip(zhibiaoMsg, function () { }, "success");
											}
										}
										//此判断是为了判断现金流量框被打开时，不要关闭遮罩
										if ($("#xianjing").attr("names") != "zhidong") {
											$("#zezhao").html('')
											$("#zezhao").hide();
										}
										_this.removeClass("btn-disablesd")

									} else {
										ufma.showTip(data.msg, function () { }, "error");
										_this.removeClass("btn-disablesd")
										$("#zezhao").html('')
										$("#zezhao").hide();
									}
								},
								error: function () {
									ufma.hideloading();
									ufma.showTip("保存失败,网络中断", function () { }, "error");
									_this.removeClass("btn-disablesd")
									$("#zezhao").html('')
									$("#zezhao").hide();
								}
							});
						} else {
							ufma.hideloading();
						}
					})
				}

			} else {
				ufma.showTip("日期区间不符", function () { }, "warning");
				_this.removeClass("btn-disablesd")
				$("#zezhao").html('')
				$("#zezhao").hide();
			}
		}
		$(this).removeClass("btn-disablesd")
	}
})
$(document).on("click", "#btn-voucher-dy", function () {
	var dataupNo = {}
	dataupNo.agencyCode = rpt.nowAgencyCode;
	dataupNo.acctCode = rpt.nowAcctCode;
	dataupNo.vouNo = selectdata.data.vouNo;
	dataupNo.setYear = selectdata.data.setYear.toString();
	dataupNo.rgCode = selectdata.data.rgCode;
	dataupNo.fisPerd = (new Date($("#dates").getObj().getValue()).getMonth() + 1).toString();
	dataupNo.vouTypeCode = $("#leftbgselect option:selected").attr("value");
	ufma.post('/gl/vouPrintCheck/getBreakNo', dataupNo, function (data) {
		if (data.data.length > 0) {
			var result = [];
			for (var i = 0; i < data.data.length; i += 5) {
				result.push(data.data.slice(i, i + 5));
			}
			var names = ''
			for (var i = 0; i < result.length; i++) {
				names += result[i].join() + '<br/>'
			}
			ufma.confirm('当前断号有<br/>' + names + '，是否继续打印？', function (action) {
				if (action) {
					vouprint('print')
				}
			})
		} else {
			vouprint('print')
		}
	})
})
$(document).on("click", "#btn-voucher-dyyl", function () {
	$(".all-no").hide();
	var dataupNo = {}
	dataupNo.agencyCode = rpt.nowAgencyCode;
	dataupNo.acctCode = rpt.nowAcctCode;
	dataupNo.vouNo = selectdata.data.vouNo;
	dataupNo.setYear = selectdata.data.setYear.toString();
	dataupNo.rgCode = selectdata.data.rgCode;
	dataupNo.fisPerd = (new Date($("#dates").getObj().getValue()).getMonth() + 1).toString();
	dataupNo.vouTypeCode = $("#leftbgselect option:selected").attr("value");
	ufma.post('/gl/vouPrintCheck/getBreakNo', dataupNo, function (data) {
		if (data.data.length > 0) {
			var result = [];
			for (var i = 0; i < data.data.length; i += 5) {
				result.push(data.data.slice(i, i + 5));
			}
			var names = ''
			for (var i = 0; i < result.length; i++) {
				names += result[i].join() + '<br/>'
			}
			ufma.confirm('当前断号有<br/>' + names + '，是否继续打印？', function (action) {
				if (action) {
					vouprint('blank')
				}
			})
		} else {
			vouprint('blank')
		}
	})
})

$(document).on("click", "#btn-voucher-dypdf", function () {
	$(".all-no").hide();
	var dataupNo = {}
	dataupNo.agencyCode = rpt.nowAgencyCode;
	dataupNo.acctCode = rpt.nowAcctCode;
	dataupNo.vouNo = selectdata.data.vouNo;
	dataupNo.setYear = selectdata.data.setYear.toString();
	dataupNo.rgCode = selectdata.data.rgCode;
	dataupNo.fisPerd = (new Date($("#dates").getObj().getValue()).getMonth() + 1).toString();
	dataupNo.vouTypeCode = $("#leftbgselect option:selected").attr("value");
	ufma.post('/gl/vouPrintCheck/getBreakNo', dataupNo, function (data) {
		if (data.data.length > 0) {
			var result = [];
			for (var i = 0; i < data.data.length; i += 5) {
				result.push(data.data.slice(i, i + 5));
			}
			var names = ''
			for (var i = 0; i < result.length; i++) {
				names += result[i].join() + '<br/>'
			}
			ufma.confirm('当前断号有<br/>' + names + '，是否继续打印？', function (action) {
				if (action) {
					vouprintpdf('blank')
				}
			})
		} else {
			vouprintpdf('blank')
		}
	})
})
$(document).on("click", "#btn-fz", function () {
	$(".all-no").hide();
	var vouGuid = selectdata.data.vouGuid;
	if ($('.voucher-head').attr('namess') != undefined && $('.voucher-head').attr('namess') != '') {
		$.ajax({
			type: "get",
			url: "/gl/vou/getVou/" + vouGuid + "?ajax=1&rueicode=" + hex_md5svUserCode,
			async: true,
			success: function (data) {
				if (data.flag == "success") {
					upadd()
					selectdata.data = {};
					quanjuvouchaiwu = {};
					quanjuvouyusuan = {};
					for (var cy = 0; cy < data.data.length; cy++) {
						if (data.data[cy] !== null) {
							nowData = data.data[cy]
							break;
						}
					}
					selectdata.data.vouDetails = nowData.vouDetails
					selectdata.data.vouTypeCode = nowData.vouTypeCode
					for (var i = 0; i < selectdata.data.vouDetails.length; i++) {
						delete selectdata.data.vouDetails[i].refBillGuid
						for (var z = 0; z < selectdata.data.vouDetails[i].vouDetailAsss.length; z++) {
							delete selectdata.data.vouDetails[i].vouDetailAsss[z].refBillGuid
							if (selectdata.data.vouDetails[i].vouDetailAsss[z].expireDate != '') {
								selectdata.data.vouDetails[i].vouDetailAsss[z].expireDate = result
							}
							if (selectdata.data.vouDetails[i].vouDetailAsss[z].billDate != '') {
								selectdata.data.vouDetails[i].vouDetailAsss[z].billDate = result
							}
							if (selectdata.data.vouDetails[i].vouDetailAsss[z].bussDate != '') {
								selectdata.data.vouDetails[i].vouDetailAsss[z].billDate = result
							}
						}
					}
					$(".xuanzhongcy").removeAttr("names");
					prevnextvoucher = -1;
					$(".voucherhe").find("#sppz").val("*");
					$("#fjd").val("");
					$("#pzzhuantai").hide();
					cwyspd();
					$(".voucher").remove();
					voucheralls();
					zhuantai();
					$("#zezhao").hide();
					chapz();
					vouluru();
					for (var cy = 0; cy < data.data.length; cy++) {
						if (data.data[cy] !== null) {
							if (data.data[cy].accaCode == 1) {
								quanjuvouchaiwu.vouDetails = data.data[cy].vouDetails
								quanjuvouchaiwu.vouTypeCode = data.data[cy].vouTypeCode
							} else if (data.data[cy].accaCode == 2) {
								quanjuvouyusuan.vouDetails = data.data[cy].vouDetails
								quanjuvouchaiwu.vouTypeCode = data.data[cy].vouTypeCode
							}
						}
					}
					MaxVouNoUp()
				} else {
					ufma.showTip(data.msg, function () { }, "error");
				}

			},
			error: function (data) {
				ufma.showTip("未取到凭证信息", function () { }, "error")
			}
		});
	} else {
		ufma.showTip("当前凭证未保存", function () { }, "warning")
	}
})
$(document).on("click", "#btn-cr", function (e) {
	$(".all-no").hide();
	var isnotpermission = '';
	for (var i = 0; i < isbtnpermission.length; i++) {
		if (isbtnpermission[i].id == "btn-insert") {
			isnotpermission = isbtnpermission[i].flag
		}
	}
	stopPropagation(e)
	if (isnotpermission != "0") {
		prevnextvoucher = -1;
		var olddates = $("#dates").getObj().getValue()
		var shuzi = $("#sppz").val()
		var pzh = $("#leftbgselect option:selected").attr("value")
		upadd()
		$(".voucher").remove();
		optNoType = 1;
		voucheralls()
		$(".voucherhe").find("#sppz").val("*");
		$("#fjd").val("");
		$("#vfjz,#vfsh,#vfzd").find("span").text("");
		$("#xiaocuo").hide();
		$("#pzzhuantai").hide();
		$(".chaiwu").addClass("xuanzhongcy").removeAttr("names");
		$(".yusuan").removeClass("xuanzhongcy").removeAttr("names");
		quanjuvouchaiwu = {};
		quanjuvouyusuan = {};
		selectdata.data = {};
		vouluru();
		var is = $(this).parents(".voucherleftbodyk").attr("weizhi");
		for (var i = 0; i < $("#leftbgselect option").length; i++) {
			if ($("#leftbgselect option").eq(i).attr("value") == pzh) {
				$("#leftbgselect option").eq(i).attr('selected', true)
			}
		}
		var oldfispred = (new Date(olddates).getMonth()) + 1
		var newfispred = (new Date($("#dates").getObj().getValue()).getMonth()) + 1
		if (oldfispred != newfispred) {
			$("#dates").getObj().setValue(olddates)
			newfispred = (new Date($("#dates").getObj().getValue()).getMonth()) + 1
		}
		$("#sppz").attr("name", "you").attr('fisperds', newfispred);
		$("#sppz").val(shuzi)
		$("#sppz").attr('vouno', $("#sppz").val())
		ufma.showTip("凭证插入后，此凭证之后的凭证将重新排序", function () { }, "warning");
	} else {
		ufma.showTip("您没有此权限", function () { }, "error")
	}
})
//财政社保联查
$(document).on("click", "#btn-voucher-linkBill", function () {
	$(".all-no").hide();
	var vouGuid = selectdata.data.vouGuid;
	ufma.open({
		url: '../../sssfm/vou/vouSssfmList.html?vouGuid=' + vouGuid + '&',
		title: "联查单据",
		width: 1090,
		data: {},
		ondestory: function (data) { }
	});
})