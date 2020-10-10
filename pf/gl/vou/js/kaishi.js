﻿$(document).on("click", ".yusuan", function () {
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
			if (quanjuvouyusuan != null && quanjuvouyusuan.vouDetails != undefined) {
				quanjuvouyusuan.vouCnt = quanjuvouchaiwu.vouCnt; //附件数
			}
		} else {
			quanjuvouyusuan = huoqu();
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
			if(isforeign){
				var alldata = {
					"agencyCode":rpt.nowAgencyCode,
					"acctCode":rpt.nowAcctCode,
					"setYear": new Date($("#dates").getObj().getValue()).getFullYear(),
					"rgCode":ufgovkey.svRgCode,
					"userId":ufgovkey.svUserId,
					"userCode":ufgovkey.svUserCode,
					"roleId":ufgovkey.svRoleId,
					"roleCode":ufgovkey.svRoleCode,
					"userName":ufgovkey.svUserName,
					"roleName":ufgovkey.svRoleName,
					"agencyTypeCode":rpt.AgencyTypeCode,
					"currentAgencyCode":rpt.nowAgencyCode,
					"currentAcctCode":rpt.nowAcctCode,
					"transDate":ufgovkey.svTransDate,
					"sysId":getUrlParam("sysId"),
					"billType":getUrlParam("billType"),
					"generate":getUrlParam("generate"),
					"redisKey":getUrlParam("redisid")
				}
				alldata.vouHeadList=savemodeldata()
				ufma.post('/lp/public/outside/savePreviewBill',alldata,function(result){
					if(!$.isNull(result.data.vouGuid)){
						isforeign =false
						ufma.get('/gl/vou/getVou/'+result.data.vouGuid,'',function(data){
							if(data.flag == "success"){
								prevnextvoucher = parseFloat(_this.parents(".voucherleftbodyk").attr("weizhi"));
								dataforcwys(data.data)
								cwyspd();
								chapz();
								zhuantai();
								if(quanjuvouyusuan != null && quanjuvouchaiwu != null) {
									if($(".yusuan").hasClass('xuanzhongcy')) {
										$(".chaiwu").trigger('click');
										var timeId = setTimeout(function() {
											$(".yusuan").trigger('click');
											clearTimeout(timeId);
										}, 300);
									} else if($(".chaiwu").hasClass('xuanzhongcy')) {
										$(".yusuan").trigger('click');
										var timeId = setTimeout(function() {
											$(".chaiwu").trigger('click');
											clearTimeout(timeId);
										}, 300);
									}
								}
							}
						})
					}
				})
				return false
			}
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
					var isupdatevouseq = 1
					if(isprojectByVou && vousinglepz == false && vousinglepzzy == true){
						isupdatevouseq = 0
					}
					for (var i = 0; i < allcy.vouDetails.length; i++) {
						if (allcy.vouDetails[i].op != "2" && isupdatevouseq == 1) {
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
							if (vousinglepzzy && isupdatevouseq == 1) {
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
							if (vousinglepzzy && isupdatevouseq == 1) {
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
				function saves(datasd) {
					if(datasd==undefined){
						datasd = allcysd
					}
					ufma.showloading('正在保存凭证，请耐心等待...');
					$.ajax({
						type: "post",
						beforeSend: function(xhr) {
							xhr.setRequestHeader("x-function-id",voumenuid);
						},
						url: "/gl/vou/" + titlesrc + "?ajax=1&rueicode=" + hex_md5svUserCode,
						async: false,
						data: JSON.stringify(datasd),
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
								if (isyoute == false) {
									if (yste != "") {
										$.ajax({
											type: "get",
											beforeSend: function(xhr) {
												xhr.setRequestHeader("x-function-id",voumenuid);
											},
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
											beforeSend: function(xhr) {
												xhr.setRequestHeader("x-function-id",voumenuid);
											},
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
								function savebefores(isfjd) {
									var loadtimeId = setTimeout(function () {
										cwyspd();
										chapz();
										//chapzsave();
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
										if (isfjd != undefined) {
											$("#fjd").focus()
										}
									}, 5);
									if (quanjuvouchaiwu != null) {
										var xjvouguid = new Object();
										xjvouguid.vouGuid = quanjuvouchaiwu.vouGuid;
										$.ajax({
											type: "get",
											beforeSend: function(xhr) {
												xhr.setRequestHeader("x-function-id",voumenuid);
											},
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
								}
								if (($("#fjd").val() == '' || $("#fjd").val() == '0') && iszerofjd) {
									ufma.confirm('凭证附件张数为0，是否需要输入', function (action) {
										if (action) {
											savebefores(true)
										} else {
											savebefores()
										}
									})
								} else {
									savebefores()
								}
								ufma.hideloading();
							} else if(data.flag == 'vouWarn'){
								ufma.confirm(data.msg+",是否继续保存", function (action) {
									if (action) {
										saves(data.data)
									}else{
										ufma.hideloading();
									}
								})
							}else{
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
				}
				if (isnods) {
					saves()
				} else {
					ufma.confirm(comfirmtext, function (action) {
						if (action) {
							saves()
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
function savemodeldata(){
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
		var isupdatevouseq = 1
		if(isprojectByVou && vousinglepz == false && vousinglepzzy == true){
			isupdatevouseq = 0
		}
		for (var i = 0; i < allcy.vouDetails.length; i++) {
			if (allcy.vouDetails[i].op != "2" && isupdatevouseq == 1) {
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
				if (vousinglepzzy && isupdatevouseq == 1) {
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
				if (vousinglepzzy && isupdatevouseq == 1) {
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
	if (vousinglepz == false && vousinglepzzy == false) {
		if (allcysd[0] != null && allcysd[0] != '') {
			allcysd[0].srcBillNo = window.ownerData[0].srcBillNo
			allcysd[0].lpBizBillGuid = window.ownerData[0].lpBizBillGuid
			allcysd[0].vouSource = window.ownerData[0].vouSource
			allcysd[0].vouStatus = window.ownerData[0].vouStatus
			allcysd[0].compoSourceId = window.ownerData[0].compoSourceId
			allcysd[0].showField = window.ownerData[0].showField
			allcysd[0].billIdAndTemId = window.ownerData[0].billIdAndTemId
			delete allcysd[0].vouDetailBigs
			delete allcysd[0].newVouNo
			delete allcysd[0].isEdit
			delete allcysd[0].gaReturnStr
			delete allcysd[0].remindStr
			delete allcysd[0].vouOpGuid
			delete allcysd[0].accoBalMap
			delete allcysd[0].isWriteOff
			delete allcysd[0].writeOffId
			delete allcysd[0].writeOffVouNo
			delete allcysd[0].writeOffVoutype
			delete allcysd[0].writeOffVouTypeName
			delete allcysd[0].isSurplusFlag
			delete allcysd[0].isBigVou
		}
		if (allcysd[1] != null && allcysd[1] != '') {
			allcysd[1].srcBillNo = window.ownerData[1].srcBillNo
			allcysd[1].lpBizBillGuid = window.ownerData[1].lpBizBillGuid
			allcysd[1].vouSource = window.ownerData[1].vouSource
			allcysd[1].vouStatus = window.ownerData[1].vouStatus
			allcysd[1].compoSourceId = window.ownerData[1].compoSourceId
			allcysd[1].showField = window.ownerData[1].showField
			allcysd[1].billIdAndTemId = window.ownerData[1].billIdAndTemId
			delete allcysd[1].vouDetailBigs
			delete allcysd[1].newVouNo
			delete allcysd[1].isEdit
			delete allcysd[1].gaReturnStr
			delete allcysd[1].remindStr
			delete allcysd[1].vouOpGuid
			delete allcysd[1].accoBalMap
			delete allcysd[1].isWriteOff
			delete allcysd[1].writeOffId
			delete allcysd[1].writeOffVouNo
			delete allcysd[1].writeOffVoutype
			delete allcysd[1].writeOffVouTypeName
			delete allcysd[1].isSurplusFlag
			delete allcysd[1].isBigVou
		}
	} else {
		allcysd[0].srcBillNo = window.ownerData[0].srcBillNo
		allcysd[0].lpBizBillGuid = window.ownerData[0].lpBizBillGuid
		allcysd[0].vouSource = window.ownerData[0].vouSource
		allcysd[0].vouStatus = window.ownerData[0].vouStatus
		allcysd[0].compoSourceId = window.ownerData[0].compoSourceId
		allcysd[0].showField = window.ownerData[0].showField
		allcysd[0].billIdAndTemId = window.ownerData[0].billIdAndTemId
		delete allcysd[0].vouDetailBigs
	}
	return allcysd
}
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
		allcysd = savemodeldata()
	}
	var action = {
		data: allcysd,
		action: 'save'
	}
	ufma.ajaxDef('/gl/vou/vouCheck', 'post', allcysd, function (data) {
		if(data.flag == 'vouWarn' && $.isNull(data.data)){
			var voudata = data.vouData
			ufma.confirm(data.msg+",是否继续保存", function (action) {
				if(action){
					_close({
						data: voudata,
						action: 'save'
					})
				}
			})
		} else if ($.isNull(data.data)) {
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
		if (allcy.cwVouVo.vouDetails.length < 1 && allcy.ysVouVo.vouDetails.length < 1) {
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
		var isupdatevouseq = 1
		if(isprojectByVou && vousinglepz == false && vousinglepzzy == true){
			isupdatevouseq = 0
		}
		for (var i = 0; i < allcy.vouDetails.length; i++) {
			if (allcy.vouDetails[i].op != "2" && isupdatevouseq == 1) {
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
	var nowyear = new Date($("#dates").getObj().getValue()).getFullYear()
	var postdata = { "rgCode": ufgovkey.svRgCode, "setYear": nowyear, "agencyCode": rpt.nowAgencyCode, "acctCode": rpt.nowAcctCode }
	ufma.post('/gl/vouTemp/getVouTemplateGroup', postdata, function (result) {
		var ziy = {
			"agencyCode": "101001",
			"groupCode": "666",
			"groupName": "自有模板",
			"id": rpt.nowAgencyCode,
			"pId": "0",
			"accsCode": "",
			"levNum": "",
			"groupLev": 1,
			"acctCode": "",
			"dropType": ""
		}
		result.data.push(ziy)
		rpt.mobanlink = $("#voumodallink").ufmaTreecombox({
			valueField: 'id',
			textField: 'groupName',
			leafRequire: false,
			readOnly: false,
			data: result.data
		})
		//单位级修改系统级，锁死去自有模板
		if (window.ownerData.isAgency && window.ownerData.nodeAgency == "*") {
			$('#voumodallink').addClass('ufma-combox-disabled')
			rpt.mobanlink.val(rpt.nowAgencyCode)
			//单位级新增，默认自有模板，但可以改
		} else if (window.ownerData.action == 'add' && window.ownerData.isAgency) {
			// $('#voumodallink').addClass('ufma-combox-disabled')
			rpt.mobanlink.val(rpt.nowAgencyCode)
			//单位级修改，默认自有模板，不可以改
		} else if (window.ownerData.action != 'add' && window.ownerData.isAgency) {
			$('#voumodallink').addClass('ufma-combox-disabled')
			rpt.mobanlink.val(window.ownerData.linkPId)
			//系统级修改，还是新增，都是自有模板，。不可改
		} else {
			$('#voumodallink').addClass('ufma-combox-disabled')
			rpt.mobanlink.val(rpt.nowAgencyCode)
		}
	})
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
	issaveDraft()
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
		if (allcy.cwVouVo.vouDetails.length < 1 && allcy.ysVouVo.vouDetails.length < 1) {
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
		var isupdatevouseq = 1
		if(isprojectByVou && vousinglepz == false && vousinglepzzy == true){
			isupdatevouseq = 0
		}
		for (var i = 0; i < allcy.vouDetails.length; i++) {
			if (allcy.vouDetails[i].op != "2" && isupdatevouseq==1) {
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
				if (vousinglepzzy && isupdatevouseq==1) {
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
				if (vousinglepzzy && isupdatevouseq==1) {
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
	var argu = {
		"description": $("#voumodalnamesel").val(),
		"isTemp": "Y",
		"linkId": rpt.mobanlink.getValue(),
		"tempSource": window.ownerData.isAgency ? "basal" : "sys",
		"templateGuid": window.ownerData.modelId,
		"templateName": $("#voumodalname").val(),
		"vouGroupId": window.ownerData.modelId,
		"vouHeads": allcysd
	}
	if ((window.ownerData.agencyCode != '*') && (window.ownerData.nodeAgency == "*")) {
		argu.tempSource = 'sys';
	} else {
		argu.tempSource = 'basal';
	}
	if ($("#voumodalname").val() == '') {
		ufma.showTip('请输入模板名称')
		voucherupnow = false
		return false
	}
	// if (window.ownerData.action == 'add' && window.ownerData.isAgency) {
	// 	argu.linkId = window.ownerData.linkId
	// }else if(window.ownerData.isAgency){
	// 	argu.linkId = window.ownerData.linkPId
	// }
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
			beforeSend: function(xhr) {
				xhr.setRequestHeader("x-function-id",voumenuid);
			},
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
					var isupdatevouseq = 1
					if(isprojectByVou && vousinglepz == false && vousinglepzzy == true){
						isupdatevouseq = 0
					}
					for (var i = 0; i < allcy.vouDetails.length; i++) {
						if (allcy.vouDetails[i].op != "2" && isupdatevouseq == 1) {
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
							if (vousinglepzzy && isupdatevouseq == 1) {
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
							if (vousinglepzzy && isupdatevouseq == 1) {
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
				function saves(datasd) {
					if(datasd==undefined){
						datasd = allcysd
					}
					ufma.showloading('正在保存凭证，请耐心等待...');
					$.ajax({
						type: "post",
						beforeSend: function(xhr) {
							xhr.setRequestHeader("x-function-id",voumenuid);
						},
						url: "/gl/vou/" + titlesrc + "?ajax=1&rueicode=" + hex_md5svUserCode,
						async: false,
						data: JSON.stringify(datasd),
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
											beforeSend: function(xhr) {
												xhr.setRequestHeader("x-function-id",voumenuid);
											},
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
											beforeSend: function(xhr) {
												xhr.setRequestHeader("x-function-id",voumenuid);
											},
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
								setTimeout(function(){
									upadd()
									MaxVouNoUp()
									if (addindexiszy) {
										biduiindex()
										$('.abstractinp').eq(0).focus()
									} else {
										$("#fjd").focus()
									}
								},200)
								_this.removeClass("btn-disablesd")
								//此判断是为了判断现金流量框被打开时，不要关闭遮罩
								if ($("#xianjing").attr("names") != "zhidong") {
									$("#zezhao").html('')
									$("#zezhao").hide();
								}
								ufma.hideloading()
							} else if(data.flag == 'vouWarn'){
								ufma.confirm(data.msg+",是否继续保存", function (action) {
									if (action) {
										saves(data.data)
									}else{
										ufma.hideloading();
									}
								})
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
				}
				if (isnods) {
					saves()
				} else {
					ufma.confirm(comfirmtext, function (action) {
						if (action) {
							saves()
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
					upadd(rpt.foryear)
					MaxVouNoUp()
					if (addindexiszy) {
						biduiindex()
						$('.abstractinp').eq(0).focus()
					} else {
						$("#fjd").focus()
					}
					$(this).removeClass("btn-disablesd")
				}
			})
		} else {
			gaibianl = true;
			$(this).addClass("btn-disablesd")
			upadd(rpt.foryear)
			MaxVouNoUp()
			if (addindexiszy) {
				biduiindex()
				$('.abstractinp').eq(0).focus()
			} else {
				$("#fjd").focus()
			}
			$(this).removeClass("btn-disablesd")
		}
	}
})

$(document).on("click", "#btn-voucher-xg", function (e) {
	stopPropagation(e)
	vouiseditsave = true
	$(".datesno").hide()
	$('.daoqiri,.billDateinp,.bussDate').datetimepicker(glRptJournalDate)
	if(isInputChange()){
		voubiaoji()
		$('#btn-voucher-xg').hide()
		$(".voucherbtnModal .voucherbtns").css("margin-left", -$(".voucherbtnModal .voucherbtns").width() / 2);
	}else{
		ufma.showTip("您没有此凭证的修改权限")
	}
})

$(document).on("click", "#btn-voucher-xs", function () {
	if ($(this).hasClass("btn-disablesd") != true) {
		if (iscancelshenhe == true && selectdata.data.auditor != ufgovkey.svUserCode) {
			ufma.showTip("禁止销审他人审核的凭证", function () { }, "warning");
			return false
		}
		$(".all-no").hide();
		$(this).addClass("btn-disablesd")
		var arr = [];
		var tempdata = selectdata.data;
		delete tempdata.op;
		delete tempdata.vouDetails;
		delete tempdata.agencyName;
		delete tempdata.acctName;
		delete tempdata.haveErrInErrTab;
		delete tempdata.vouDetailBigs;
		delete tempdata.vouTypeName;
		delete tempdata.treasuryHook;
		delete tempdata.accoBalMap;
		arr.push(tempdata);
		ufma.showloading('正在销审凭证，请耐心等待...');
		$.ajax({
			type: "POST",
			beforeSend: function(xhr) {
				xhr.setRequestHeader("x-function-id",voumenuid);
			},
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
	if (isvousource || selectdata.data.vouSource == 'AUTO' || isVouDel) {
		if ($(this).hasClass("btn-disablesd") != true) {
			var isas = selectdata.data.inputor == ufgovkey.svUserCode || selectdata.data.inputor == undefined
			if (!isas && isInputor == true) {
				ufma.showTip("禁止作废他人编制的凭证")
				return false
			}
			$(".all-no").hide();
			$(this).addClass("btn-disablesd")
			var arr = [];
			var tempdata = selectdata.data;
			delete tempdata.op;
			delete tempdata.vouDetails;
			delete tempdata.agencyName;
			delete tempdata.acctName;
			delete tempdata.haveErrInErrTab;
			delete tempdata.vouDetailBigs;
			delete tempdata.vouTypeName;
			delete tempdata.treasuryHook;
			delete tempdata.accoBalMap;
			arr.push(tempdata);
			ufma.showloading('正在作废凭证，请耐心等待...');
			$.ajax({
				type: "POST",
				beforeSend: function(xhr) {
					xhr.setRequestHeader("x-function-id",voumenuid);
				},
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
	} else {
		ufma.showTip('不允许作废子系统生成的凭证')
	}
})
$(document).on("click", "#btn-voucher-hy", function () {
	if ($(this).hasClass("btn-disablesd") != true) {
		$(".all-no").hide();
		var isas = selectdata.data.inputor == ufgovkey.svUserCode || selectdata.data.inputor == undefined
		if (!isas && isInputor == true) {
			ufma.showTip("禁止还原他人编制的凭证")
			return false
		}
		$(this).addClass("btn-disablesd")
		var arr = [];
		var tempdata = selectdata.data;
		delete tempdata.op;
		delete tempdata.vouDetails;
		delete tempdata.agencyName;
		delete tempdata.acctName;
		delete tempdata.haveErrInErrTab;
		delete tempdata.vouDetailBigs;
		delete tempdata.vouTypeName;
		delete tempdata.treasuryHook;
		delete tempdata.accoBalMap;
		arr.push(tempdata);
		ufma.showloading('正在还原凭证，请耐心等待...');
		$.ajax({
			type: "POST",
			beforeSend: function(xhr) {
				xhr.setRequestHeader("x-function-id",voumenuid);
			},
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
		if (isdeljizang == true && selectdata.data.poster != ufgovkey.svUserCode) {
			ufma.showTip("禁止反记账他人记账的凭证", function () { }, "warning");
			return false
		}
		if (selectdata.data.isWriteOff == '1') {
			ufma.showTip("已经冲红的凭证不能反记账", function () { }, "warning");
			return false
		}
		$(".all-no").hide();
		$(this).addClass("btn-disablesd")
		var arr = [];
		var tempdata = selectdata.data;
		arr.push(tempdata.vouGuid);
		ufma.showloading('正在反记账凭证，请耐心等待...');
		$.ajax({
			type: "POST",
			beforeSend: function(xhr) {
				xhr.setRequestHeader("x-function-id",voumenuid);
			},
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
			beforeSend: function(xhr) {
				xhr.setRequestHeader("x-function-id",voumenuid);
			},
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
			beforeSend: function(xhr) {
				xhr.setRequestHeader("x-function-id",voumenuid);
			},
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
			// delete tempdata.op;
			// delete tempdata.vouDetails;
			// delete tempdata.agencyName;
			// delete tempdata.acctName;
			// delete tempdata.vouTypeName;
			// delete tempdata.haveErrInErrTab;
			// delete tempdata.vouDetailBigs;
			// delete tempdata.treasuryHook;
			// delete tempdata.accoBalMap;
			// delete tempdata.saveProgressMap;
			// tempdata.startDate = tempdata.vouDate;
			// tempdata.endtDate = tempdata.vouDate;
			// tempdata.isVouBox = false
			var tempdatanew = {"vouGuid":tempdata.vouGuid,
			"vouKind":tempdata.vouKind,
			"vouGroupId":tempdata.vouGroupId,
			"setYear":tempdata.setYear,
			"agencyCode":tempdata.agencyCode,
			"acctCode":tempdata.acctCode,
			"vouNo":tempdata.vouNo,
			"errFlag":tempdata.errFlag,
			"vouTypeCode":tempdata.vouTypeCode,
			"vouStatus":tempdata.vouStatus,
			"accaCode":tempdata.accaCode,
			"fisPerd":tempdata.fisPerd,
			"isVouBox":tempdata.isVouBox
			}
			arr.push(tempdatanew);
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
			var dataupNo = {}
			dataupNo.agencyCode = rpt.nowAgencyCode;
			dataupNo.acctCode = rpt.nowAcctCode;
			dataupNo.vouNo = selectdata.data.vouNo;
			dataupNo.setYear = selectdata.data.setYear.toString();
			dataupNo.rgCode = selectdata.data.rgCode;
			dataupNo.fisPerd = (new Date($("#dates").getObj().getValue()).getMonth() + 1).toString();
			dataupNo.vouTypeCode = $("#leftbgselect option:selected").attr("value");
			dataupNo.vouTypeName = $("#leftbgselect option:selected").text();
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
					ufma.confirm('当前断号有<br/>' + names + '是否继续审核？', function (action) {
						if (action) {
							shenHe();
						}
					})
				} else {
					shenHe();
				}
			})
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
				beforeSend: function(xhr) {
					xhr.setRequestHeader("x-function-id",voumenuid);
				},
				url: "/gl/vouBox/accountingVous" + "?ajax=1&rueicode=" + hex_md5svUserCode,
				dataType: "json",
				data: JSON.stringify(vbObj),
				contentType: 'application/json; charset=utf-8',
				async: false,
				success: function (data) {
					if (data.flag == "success") {
						if (data.msg != "记账成功!") {
							ufma.showTip(data.msg, function () { }, "warn");
						} else {
							ufma.showTip("记账成功", function () { }, "success");
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

$(document).on("click", ".voucher-history-by-nr", function () {
	var thishisVouGuid = $(this).attr("namess")
	if ($(this).attr("namess") != "null" && $(this).attr("namess") != "") {
		$.ajax({
			type: "get",
			beforeSend: function(xhr) {
				xhr.setRequestHeader("x-function-id",voumenuid);
			},
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
						beforeSend: function(xhr) {
							xhr.setRequestHeader("x-function-id",voumenuid);
						},
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
					var isupdatevouseq = 1
					if(isprojectByVou && vousinglepz == false && vousinglepzzy == true){
						isupdatevouseq = 0
					}
					for (var i = 0; i < allcy.vouDetails.length; i++) {
						if (allcy.vouDetails[i].op != "2" && isupdatevouseq ==1) {
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
							if (vousinglepzzy && isupdatevouseq == 1) {
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
							if (vousinglepzzy && isupdatevouseq == 1) {
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
				function saves(datasd) {
					if(datasd==undefined){
						datasd = allcysd
					}
					ufma.showloading('正在保存凭证，请耐心等待...');
					$.ajax({
						type: "post",
						beforeSend: function(xhr) {
							xhr.setRequestHeader("x-function-id",voumenuid);
						},
						url: "/gl/vou/" + titlesrc + "?ajax=1&rueicode=" + hex_md5svUserCode,
						async: false,
						data: JSON.stringify(datasd),
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
									$('#btn-voucher-dypdf').trigger('click')
								}, 5);
								if (isyoute == false) {
									if (yste != "") {
										$.ajax({
											type: "get",
											beforeSend: function(xhr) {
												xhr.setRequestHeader("x-function-id",voumenuid);
											},
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
											beforeSend: function(xhr) {
												xhr.setRequestHeader("x-function-id",voumenuid);
											},
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
										beforeSend: function(xhr) {
											xhr.setRequestHeader("x-function-id",voumenuid);
										},
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
							} else if(data.flag == 'vouWarn'){
								ufma.confirm(data.msg+",是否继续保存", function (action) {
									if (action) {
										saves(data.data)
									}else{
										ufma.hideloading();
									}
								})
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
				}
				if (isnods) {
					saves()
				} else {
					ufma.confirm(comfirmtext, function (action) {
						if (action) {
							saves()
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
	dataupNo.vouTypeName = $("#leftbgselect option:selected").text();
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
	dataupNo.vouTypeName = $("#leftbgselect option:selected").text();
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
	dataupNo.vouTypeName = $("#leftbgselect option:selected").text();
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
			ufma.confirm('当前断号有<br/>' + names + '是否继续打印？', function (action) {
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
			beforeSend: function(xhr) {
				xhr.setRequestHeader("x-function-id",voumenuid);
			},
			url: "/gl/vou/getVou/" + vouGuid + "?ajax=1&rueicode=" + hex_md5svUserCode,
			async: true,
			success: function (data) {
				if (data.flag == "success") {
					upadd(rpt.foryear)
					selectdata.data = {};
					quanjuvouchaiwu = {};
					quanjuvouyusuan = {};
					for (var cy = 0; cy < data.data.length; cy++) {
						if (data.data[cy] !== null) {
							if ($(".yusuan").hasClass('xuanzhongcy') && data.data[cy].accaCode == 2) {
								nowData = data.data[cy]
							} else if ($(".chaiwu").hasClass('xuanzhongcy') && data.data[cy].accaCode != 2) {
								nowData = data.data[cy]
							}
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
								selectdata.data.vouDetails[i].vouDetailAsss[z].bussDate = result
							}
							if(selectdata.data.vouDetails[i].vouDetailAsss[z].field1!=''){
								selectdata.data.vouDetails[i].vouDetailAsss[z].field1 =''
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
					MaxVouNoUp()
					if (addindexiszy) {
					} else {
						$("#fjd").focus()
					}
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
		$(".vfjz,.vfsh,.vfzd").find("span").text("");
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
		if (addindexiszy) {
			biduiindex()
			$('.abstractinp').eq(0).focus()
		} else {
			$("#fjd").focus()
		}
	} else {
		ufma.showTip("您没有此权限", function () { }, "error")
	}
})

$(document).on("click", "#voudataRefresh", function(e) {
	stopPropagation(e)
	var seldat = huoqu()
	vousourceName = $(".vouSource").text()
	if(vousinglepz == true || vousinglepzzy == true) {
		$(".chaiwu").hide();
		$(".yusuan").hide();
	}
	var accacodes = '';
	if($('.chaiwu').css('display') != 'none') {
		accacodes = '1'
		ufma.ajaxDef("/gl/eleVouType/getVouType/" + rpt.nowAgencyCode + "/" + rpt.foryear + "/" + rpt.nowAcctCode + "/" + accacodes, "get", '', function(data) {
			danweinamec = data.data;
		})
	}
	if($('.yusuan').css('display') != 'none') {
		accacodes = '2'
		ufma.ajaxDef("/gl/eleVouType/getVouType/" + rpt.nowAgencyCode + "/" + rpt.foryear + "/" + rpt.nowAcctCode + "/" + accacodes, "get", '', function(data) {
			danweinamey = data.data;
		})
	}
	if(vousinglepzzy == true || $('.yusuan').css('display') == 'none') {
		accacodes = '*'
		ufma.ajaxDef("/gl/eleVouType/getVouType/" + rpt.nowAgencyCode + "/" + rpt.foryear + "/" + rpt.nowAcctCode + "/" + accacodes, "get", '', function(data) {
			danweinamec = data.data;
		})
	}
	voutypeword()
	$('#AssDataAll').html('')
	var keyss = '*'
	if(getUrlParam("action") != "voumodel"){
		keyss = $("#leftbgselect option:selected").attr("value")
	}
	ufma.ajaxDef("/gl/vou/getAccoAndAccitem/"+ rpt.nowAgencyCode + "/" + rpt.nowAcctCode +"/"+keyss+"/"+rpt.foryear, "get", '', function(data) {
		quanjuvoudatas.data = data.data.accos;
		tablehead = data.data.tableHead;
		fzhsxl = data.data.optionData;
		accitemOrderSeq = data.data.accitemOrder
		$("#accounting-container").html(acctaccaall())
		$("#accounting-container-cw").html(acctacca1())
		$("#accounting-container-ys").html(acctacca2())
		$('#AssDataAll').html('')
		billfzhsxl =[]
		contractfzhsxl =[]
		$(".searchvvoukecha").html(accsDatasearch())
	})
	ufma.ajax("/gl/vou/getAllbgAccItems/" + rpt.nowAgencyCode + "/" + rpt.nowAcctCode, "get",'', function(data) {
		keypandingzhibiao = data.data
	})
	selectdata.data = seldat
	chapz()
	$(".vouSource").text(vousourceName)
	zhuantai()
	issindouxg = true
	ufma.showTip("刷新数据成功", function() {}, "success")
})
//财政社保联查
$(document).on("click", "#btn-voucher-linkBill", function () {
	$(".all-no").hide();
	var vouGuid = selectdata.data.vouGuid;
	var vouSource = selectdata.data.vouSource;
	ufma.open({
		url: '../../sssfm/vou/vouSssfmList.html?vouGuid=' + vouGuid + '&vouSource='+ vouSource +'&',
		title: "联查单据",
		width: 1090,
		data: {},
		ondestory: function (data) { }
	});
})