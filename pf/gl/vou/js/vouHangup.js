var allTableData = {};
var btnTableData = {};
var pfData = ufma.getCommonData();
var setYearWin = new Date($("#dates").getObj().getValue()).getFullYear();
var agencyCodeWin =  rpt.nowAgencyCode ;
var acctCodeWin =  rpt.nowAcctCode;
var gjwindow = function() {
	ufma.get('/gl/sys/busRule/' + rpt.nowAgencyCode + '/GL026', {}, function(result) { //判断是否显示按钮
		if(result.data == true) {
			wgjfl();
		}
	})
};
$(document).on("click", ".u-msg-dialog .u-msg-close", function(e) {
	if($(".voucher-head").attr("namess") != undefined && $(".voucher-head").attr("namess") != '') {
		$.ajax({
			type: "get",
			beforeSend: function(xhr) {
				xhr.setRequestHeader("x-function-id",voumenuid);
			},
			url: "/gl/vou/getVou/" + $(".voucher-head").attr("namess") + "?ajax=1&rueicode=" + hex_md5svUserCode,
			async: true,
			success: function(data) {
				if(data.flag == "success") {
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
				} else {
					ufma.showTip(data.msg, function() {}, "error");
				}

			},
			error: function(data) {
				ufma.showTip("未取到凭证信息", function() {}, "error")
			}
		});
	}
})
var wgjfl = function() {
	var argu = {
		/*agencyCode: quanjuvouchaiwu.agencyCode,
		acctCode: quanjuvouchaiwu.acctCode,
		rgCode: quanjuvouchaiwu.rgCode,
		setYear: quanjuvouchaiwu.setYear,*/
		agencyCode: agencyCodeWin,
		acctCode: acctCodeWin,
		rgCode: ufgovkey.svRgCode,
		setYear: setYearWin,
		voucherModel: "ADD"
	};
	var url = '/gl/vou/getGkzbDetailAss/' + $(".voucher-head").attr("namess")
	ufma.get(url, argu, function(result) {
		//if(result.data.length > 0) {
		var msg = result.data.msg;
		if(!$.isNull(result.data)) {
			allTableData = result.data;
			var WGJFLdata = allTableData.WGJFL.content;
			var WGJFLitem = allTableData.WGJFL.item;
			var YGJdata = allTableData.YGJ;
			var FLSUN = allTableData.FLSUN;
			var YCOUNT = allTableData.YCOUNT;
			var WCOUNT = allTableData.WCOUNT;
			var TREASURYHOOK = allTableData.treasuryHook;
			var contentArr = [];
			for(var i = 0; i < allTableData.GKDJ.length; i++) {
				var AUTcontent = allTableData.GKDJ[i].content;
				var AUTItem = allTableData.GKDJ[i].item;
				var schemeName = allTableData.GKDJ[i].SchemeName;
				var schemeGuid = allTableData.GKDJ[i].schemeGuid;
				//contentArr.push(AUTcontent);
				//bug81859 【20190703 财务云8.0 广东省财政厅】凭证箱选择一张已挂接的凭证 点击国库单据挂接按钮无反应
				if(AUTcontent.length > 0) {
					contentArr.push(AUTcontent);
				}
			}
			if(!$.isNull(allTableData)) {
				if(WGJFLdata) { //含有未挂接分录
					if((WGJFLdata.length > 0 && YGJdata.length == 0) || (WGJFLdata.length > 0 && YGJdata.length > 0)) { //未挂接分录有值
						if(AUTItem.length > 0 && contentArr.length > 0) {
							ufma.confirm("保存成功,是否挂接国库单据", function(action) {
								if(action) {
									var openlength =  $(window).width()-100;
									if(openlength<1074){
										openlength = 1074
									}
									ufma.open({
										url: 'vouHangup.html',
										title: '国库单据挂接',
										width:openlength,
										height: 700,
										data: {
											vouGuid: $(".voucher-head").attr("namess"),
											/*agencyCode: quanjuvouchaiwu.agencyCode,
											  acctCode: quanjuvouchaiwu.acctCode,
											  rgCode: quanjuvouchaiwu.rgCode,
											  setYear: quanjuvouchaiwu.setYear,*/
											agencyCode: agencyCodeWin,
											acctCode: acctCodeWin,
											rgCode: ufgovkey.svRgCode,
									        setYear: setYearWin,
											AUTcontent: AUTcontent,
											AUTItem: AUTItem,
											SchemeName: schemeName,
											WGJFLdata: WGJFLdata,
											WGJFLitem: WGJFLitem,
											YGJ: YGJdata,
											schemeGuid: schemeGuid,
											FLSUN: FLSUN,
											YCOUNT: YCOUNT,
											WCOUNT: WCOUNT,
											treasuryHook: TREASURYHOOK,
											parentData: allTableData,
											vouStatus: quanjuvouchaiwu.vouStatus
										},
										ondestory: function(action) {
											var data = action.action;
											$.ajax({
												type: "get",
												beforeSend: function(xhr) {
													xhr.setRequestHeader("x-function-id",voumenuid);
												},
												//		url: "/gl/vou/getVou/" + vouguid,
												//url: "/gl/vou/" + titlesrc + "/" + vouguid + "?ajax=1&rueicode="+hex_md5svUserCode,
												url: "/gl/vou/getVou/" + $(".voucher-head").attr("namess") + "?ajax=1&rueicode=" + hex_md5svUserCode,
												async: true,
												success: function(data) {
													if(data.flag == "success") {
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
													} else {
														ufma.showTip(data.msg, function() {}, "error");
													}
												},
												error: function(data) {
													ufma.showTip("未取到凭证信息", function() {}, "error")
												}
											});
										}

									});
								}
							}, {
								type: 'success'
							});
						} else if((AUTItem.length == 0 || contentArr.length == 0) && !$.isNull(msg)) {
							ufma.showTip(msg, function() {
								return false;
							}, 'warning')
						}
					} else if(!$.isNull(msg)) {
						ufma.showTip(msg, function() {
							return false;
						}, 'warning')
					}
				} else if(!$.isNull(msg)) {
					ufma.showTip(msg, function() {
						return false;
					}, 'warning')
					//}
				}

			}
		}
	});
};

$(document).on('click', '#vouHangup',function(e) {
	if($(".voucher-head").attr("namess") != undefined) {
		var argu = {
			/*agencyCode: quanjuvouchaiwu.agencyCode,
			acctCode: quanjuvouchaiwu.acctCode,
			rgCode: quanjuvouchaiwu.rgCode,
		    setYear: quanjuvouchaiwu.setYear,*/
		    agencyCode: agencyCodeWin,
			acctCode: acctCodeWin,
		    rgCode: ufgovkey.svRgCode,
			setYear: setYearWin,
			
			voucherModel: "EDIT"
		};
		var url = '/gl/vou/getGkzbDetailAss/' + $(".voucher-head").attr("namess")
		ufma.get(url, argu, function(result) {
			var msg = result.data.msg;
			if(!$.isNull(result.data)) {
				//if(result.data.length > 0) {
				btnTableData = result.data;
				var WGJFLdata = btnTableData.WGJFL.content;
				var WGJFLitem = btnTableData.WGJFL.item;
				var YGJdata = btnTableData.YGJ;
				var FLSUN = btnTableData.FLSUN;
				var YCOUNT = btnTableData.YCOUNT;
				var WCOUNT = btnTableData.WCOUNT;
				var contentArr = [];
				var TREASURYHOOK = btnTableData.treasuryHook;
				for(var i = 0; i < btnTableData.GKDJ.length; i++) {
					var AUTcontent = btnTableData.GKDJ[i].content;
					var AUTItem = btnTableData.GKDJ[i].item;
					var schemeName = btnTableData.GKDJ[i].SchemeName;
					var schemeGuid = btnTableData.GKDJ[i].schemeGuid;
					//bug81859 【20190703 财务云8.0 广东省财政厅】凭证箱选择一张已挂接的凭证 点击国库单据挂接按钮无反应
					if(AUTcontent.length > 0) {
						contentArr.push(AUTcontent);
					}
				}
				if(!$.isNull(btnTableData)) {
					//if(WGJFLdata) {
					//国库挂接弹框显示规则:(1)如果未挂接里面有数据,则国库单据里面必须要有数据;(2)如果国库单据里面有数据,则未挂接分录里面也必须有数据;
					//(3) 只要已挂接面有数据则弹框
					if((WGJFLdata.length > 0 && contentArr.length > 0) || (YGJdata.length > 0)) { //未挂接分录有值，国库单据也有值,已挂接没有值
						//if(!$.isNull(btnTableData.GKDJ)) {
						// 如果没有获取到单据方案设置的字段信息,则不显示国库挂接界面
						if(AUTItem.length > 0) {
							var islp = getUrlParam("action") == "preview"
							var openlength =  $(window).width()-100;
							if(openlength<1074){
								openlength = 1074
							}
							ufma.open({
								url: 'vouHangup.html',
								title: '国库单据挂接',
								width: openlength,
								height: 700,
								data: {
									vouGuid: $(".voucher-head").attr("namess"),
									/*agencyCode: quanjuvouchaiwu.agencyCode,
									acctCode: quanjuvouchaiwu.acctCode,
									 rgCode: quanjuvouchaiwu.rgCode,
									 setYear: quanjuvouchaiwu.setYear,*/
									agencyCode: agencyCodeWin,
									acctCode: acctCodeWin,
									rgCode: ufgovkey.svRgCode,
									setYear: setYearWin,
									AUTcontent: AUTcontent,
									AUTItem: AUTItem,
									SchemeName: schemeName,
									schemeGuid: schemeGuid,
									WGJFLdata: WGJFLdata,
									WGJFLitem: WGJFLitem,
									YGJ: YGJdata,
									FLSUN: FLSUN,
									YCOUNT: YCOUNT,
									WCOUNT: WCOUNT,
									treasuryHook: TREASURYHOOK,
									parentData: btnTableData,
									vouStatus: quanjuvouchaiwu.vouStatus,
									isLp: islp
								},
								ondestory: function(action) {
									var data = action.action;
									$.ajax({
										type: "get",
										beforeSend: function(xhr) {
											xhr.setRequestHeader("x-function-id",voumenuid);
										},
										url: "/gl/vou/getVou/" + $(".voucher-head").attr("namess") + "?ajax=1&rueicode=" + hex_md5svUserCode,
										async: true,
										success: function(data) {
											if(data.flag == "success") {
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
											} else {
												ufma.showTip(data.msg, function() {}, "error");
											}

										},
										error: function(data) {
											ufma.showTip("未取到凭证信息", function() {}, "error")
										}
									});
								}
							});
						} else if(((AUTItem.length > 0 && contentArr.length == 0) || AUTItem.length == 0) && !$.isNull(msg)) {
							ufma.showTip(msg, function() {
								return false;
							}, 'warning')
						}
					}else{
						ufma.showTip('无可挂接单据', function() {
							return false;
						}, 'warning')
					}
					//----------------------------					
				} else if(!$.isNull(msg)) {
					ufma.showTip(msg, function() {
						return false;
					}, 'warning')
				}
			} else if(!$.isNull(msg)) {
				ufma.showTip(msg, function() {
					return false;
				}, 'warning')
			}
		});
	} else {
		var islp = getUrlParam("action") == "preview";
		var vouGuid = $(".voucher-head").attr("namess");
		if(islp && !vouGuid) {
			var vouBean = huoqu();
			/*vouBean.lpBizBillGuid = quanjuvouchaiwu.lpBizBillGuid;
			vouBean.rgCode = quanjuvouchaiwu.rgCode;
			vouBean.setYear = quanjuvouchaiwu.setYear;*/
			//bug81671 【20190628 财务云8.0 广东省财政厅】单据预览界面 切换凭证模式后点击“国库单据挂接”报错---quanjuvouchaiwu中的lpBizBillGuid会丢失，window.ownerData[0]不会--zsj
			vouBean.lpBizBillGuid = window.ownerData[0].lpBizBillGuid;
			/*vouBean.rgCode = window.ownerData[0].rgCode;
			vouBean.setYear = window.ownerData[0].setYear;*/
			vouBean.rgCode = ufgovkey.svRgCode;
			vouBean.setYear = setYearWin;
			vouBean.vouGroupId = window.ownerData[0].vouGroupId;
			getVouAndBillData(vouBean);
			//汇总生成时由于未保存凭证故取不到quanjuvouchaiwu.vouStatus，故默认为‘O’
			if(quanjuvouchaiwu.vouStatus == undefined) {
				page.previewVouStatus = 'O';
			} else {
				page.previewVouStatus = quanjuvouchaiwu.vouStatus;
			}
		} else {
			ufma.showTip('请保存一张会计科目中含有国库指标的凭证', function() {
				return false;
			}, 'warnning')
		}
	}

	function getVouAndBillData() {
		$.ajax({
			type: "POST",
			beforeSend: function(xhr) {
				xhr.setRequestHeader("x-function-id",voumenuid);
			},
			url: "/gl/vou/dealVouBillData" + "?ajax=1&rueicode=" + hex_md5svUserCode,
			dataType: "json",
			data: JSON.stringify(vouBean),
			contentType: 'application/json; charset=utf-8',
			async: true,
			success: function(result) {
				if(result.flag == "success") {
					if(result.data) {
						btnTableData = result.data;
						if(btnTableData) {
							var WGJFLdata = btnTableData.WGJFL.content;
							var WGJFLitem = btnTableData.WGJFL.item;
							var YGJdata = btnTableData.YGJ;
							var FLSUN = btnTableData.FLSUN;
							var WCOUNT = btnTableData.WCOUNT;
							var YCOUNT = btnTableData.YCOUNT;
							var contentArr = [];
							//bug81258 汇总生成的国库单据挂接界面的关闭按钮不起作用--增加判空处理--zsj
							if(!$.isNull(btnTableData.GKDJ)) {
								for(var i = 0; i < btnTableData.GKDJ.length; i++) {
									var AUTcontent = btnTableData.GKDJ[i].content;
									var AUTItem = btnTableData.GKDJ[i].item;
									var schemeName = btnTableData.GKDJ[i].SchemeName;
									var schemeGuid = btnTableData.GKDJ[i].schemeGuid;
									contentArr.push(AUTcontent);
								}
							}

							//未挂接分录有值，国库单据也有值
							if(WGJFLdata.length > 0 && contentArr.length > 0) {
								var openlength =  $(window).width()-100;
								if(openlength<1074){
									openlength = 1074
								}
								ufma.open({
									url: 'vouHangup.html',
									title: '国库单据挂接',
									width: openlength,
									height: 700,
									data: {
										vouGuid: $(".voucher-head").attr("namess"),
										/*agencyCode: quanjuvouchaiwu.agencyCode,
										acctCode: quanjuvouchaiwu.acctCode,
										rgCode: quanjuvouchaiwu.rgCode,
										setYear: quanjuvouchaiwu.setYear,*/
										agencyCode: agencyCodeWin,
										acctCode: acctCodeWin,
										rgCode: ufgovkey.svRgCode,
									    setYear:setYearWin,
										AUTcontent: AUTcontent,
										AUTItem: AUTItem,
										SchemeName: schemeName,
										schemeGuid: schemeGuid,
										WGJFLdata: WGJFLdata,
										WGJFLitem: WGJFLitem,
										vouBean: vouBean,
										YGJ: YGJdata,
										FLSUN: FLSUN,
										WCOUNT: WCOUNT,
										YCOUNT: YCOUNT,
										treasuryHook: "",
										operationMode: "HZ",
										parentData: btnTableData,
										//vouStatus: quanjuvouchaiwu.vouStatus
										vouStatus: page.previewVouStatus
									},
									ondestory: function(action) {
										var data = action.action;
										//bug81258 汇总生成的国库单据挂接界面的关闭按钮不起作用--增加判空处理--zsj
										if(!$.isNull(data.vouBean)) {
											//dataforcwys(data.vouBean);
											quanjuvouchaiwu = data.vouBean;
											selectdata.data = data.vouBean;
											cwyspd();
											chapz();
											zhuantai();
										}
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
								});
							} else if(YGJdata.length > 0) {
								var openlength =  $(window).width()-100;
								if(openlength<1074){
									openlength = 1074
								}
								ufma.open({
									url: 'vouHangup.html',
									title: '国库单据挂接',
									width: openlength,
									height: 700,
									data: {
										vouGuid: $(".voucher-head").attr("namess"),
										/*agencyCode: quanjuvouchaiwu.agencyCode,
										acctCode: quanjuvouchaiwu.acctCode,
										rgCode: quanjuvouchaiwu.rgCode,
										setYear: quanjuvouchaiwu.setYear,*/
										agencyCode: agencyCodeWin,
										acctCode: acctCodeWin,
										rgCode: ufgovkey.svRgCode,
									    setYear: setYearWin,
										AUTcontent: AUTcontent,
										AUTItem: AUTItem,
										SchemeName: schemeName,
										schemeGuid: schemeGuid,
										WGJFLdata: WGJFLdata,
										WGJFLitem: WGJFLitem,
										vouBean: vouBean,
										YGJ: YGJdata,
										FLSUN: FLSUN,
										WCOUNT: WCOUNT,
										YCOUNT: YCOUNT,
										treasuryHook: "",
										operationMode: "HZ",
										parentData: btnTableData,
										//vouStatus: quanjuvouchaiwu.vouStatus
										vouStatus: page.previewVouStatus
									},
									ondestory: function(action) {
										var data = action.action;
										//bug81258 汇总生成的国库单据挂接界面的关闭按钮不起作用--增加判空处理--zsj
										if(!$.isNull(data.vouBean)) {
											//dataforcwys(data.vouBean);
											quanjuvouchaiwu = data.vouBean;
											selectdata.data = data.vouBean;
											cwyspd();
											chapz();
											zhuantai();
										}
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
								});
							}
						}
					}
				} else {
					ufma.showTip(result.msg, function() {}, "error");
				}
			},
			error: function(result) {
				ufma.showTip("加载失败，请检查网络", function() {}, "error")
			}
		});
	}
});