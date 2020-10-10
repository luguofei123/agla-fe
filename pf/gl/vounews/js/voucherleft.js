$("#leftstartdate").ufDatepicker({
	format: 'yyyy-mm-dd',
	initialDate: '',
}).on('change', function() {
	var startdate = $('#leftstartdate').getObj().getValue();
	var enddate = $('#leftenddate').getObj().getValue();
	var startD = new Date(Date.parse(startdate.replace(/-/g, "/")));
	var endD = new Date(Date.parse(enddate.replace(/-/g, "/")));
	var days = (endD.getTime() - startD.getTime()) / (1000 * 60 * 60 * 24)
	if(days < 0) {
		ufma.showTip("日期区间不符", function() {}, "warning");
		$('#leftstartdate').getObj().setValue($('#leftenddate').getObj().getValue())
	}else{
		leftsearch()
		leftsearchbody()
	}
});
$("#leftenddate").ufDatepicker({
	format: 'yyyy-mm-dd',
	initialDate: '',
}).on('change', function() {
	var startdate = $('#leftstartdate').getObj().getValue();
	var enddate = $('#leftenddate').getObj().getValue();
	var startD = new Date(Date.parse(startdate.replace(/-/g, "/")));
	var endD = new Date(Date.parse(enddate.replace(/-/g, "/")));
	var days = (endD.getTime() - startD.getTime()) / (1000 * 60 * 60 * 24)
	if(days < 0) {
		ufma.showTip("日期区间不符", function() {}, "warning");
		$('#leftenddate').getObj().setValue($('#leftstartdate').getObj().getValue())
	}else{
		leftsearch()
		leftsearchbody()
	}
});
nowleftfirpred()
$(document).on("mouseover", ".voucherleftbodyk", function() {
	$(this).find(".leftcha").show();
	$(this).find(".leftbtns").show();
})
$(document).on("click", ".voucherleft", function(e) {
	stopPropagation(e)
})
$(document).on("mouseout", ".voucherleftbodyk", function() {
	$(this).find(".leftcha").hide();
	$(this).find(".leftbtns").hide();
})
var gaibianl = true;
$(document).on("click", ".leftcha", function(e) {
	stopPropagation(e)
	var isnotpermission = '';
	for(var i = 0; i < isbtnpermission.length; i++) {
		if(isbtnpermission[i].id == "btn-watch") {
			isnotpermission = isbtnpermission[i].flag
		}
	}
	if(isnotpermission != "0") {
		_this = $(this);
		stopPropagation(e)
		var titlesrc = 'getVou'
		if(vousinglepz == true) {
			titlesrc = 'getVou'
		}
		for(var i = 0; i < $(".voucher-center").length; i++) {
			if($(".voucher-center").eq(i).attr("op") != undefined && $(".voucher-center").eq(i).attr("op") != 3 && $(".voucher-center").eq(i).attr("namess") != undefined && selectdata.data.errFlag == 0 && selectdata.data.vouStatus == "O" && $("#pzzhuantai").css('display') == 'none') {
				//				if()
				gaibianl = false;
			}
			if($(".voucher-center").eq(i).attr("op") != undefined && $(".voucher-center").eq(i).attr("op") == 1 && $(".voucher-center").eq(i).attr("namess") == undefined) {
				gaibianl = false;
			}
		}
		if(gaibianl == false) {
			ufma.confirm('这会取消您当前输入的内容，是否继续', function(action) {
				if(action) {
					gaibianl = true;
					var vouguid = _this.parents(".voucherleftbodyk").attr("name");
					$.ajax({
						type: "get",
						//		url: "/gl/vou/getVou/" + vouguid,
						url: "/gl/vou/" + titlesrc + "/" + vouguid + "?ajax=1&rueicode="+hex_md5svUserCode,
						async: true,
						success: function(data) {
							if(data.flag == "success") {
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
		} else {
			gaibianl = true;
			var vouguid = _this.parents(".voucherleftbodyk").attr("name");
			$.ajax({
				type: "get",
				//		url: "/gl/vou/getVou/" + vouguid,
				url: "/gl/vou/" + titlesrc + "/" + vouguid + "?ajax=1&rueicode="+hex_md5svUserCode,
				async: true,
				success: function(data) {
					if(data.flag == "success") {
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
					} else {
						ufma.showTip(data.msg, function() {}, "error");
					}

				},
				error: function(data) {
					ufma.showTip("未取到凭证信息", function() {}, "error")
				}
			});
		}

	} else {
		ufma.showTip("您没有此权限", function() {}, "error")
	}
})

$(document).on("click", ".leftfz", function(e) {
	var isnotpermission = '';
	for(var i = 0; i < isbtnpermission.length; i++) {
		if(isbtnpermission[i].id == "btn-copy") {
			isnotpermission = isbtnpermission[i].flag
		}
	}
	if(isnotpermission != "0") {
		var vouguid = $(this).parents(".voucherleftbodyk").attr("name");
		stopPropagation(e)
		ufma.confirm('这会清空您当前输入的内容，是否继续', function(action) {
			if(action) {
				$.ajax({
					type: "get",
					url: "/gl/vou/getVou/" + vouguid + "?ajax=1&rueicode="+hex_md5svUserCode,
					async: true,
					success: function(data) {
						if(data.flag == "success") {
							upadd()
							selectdata.data = {};
							quanjuvouchaiwu = {};
							quanjuvouyusuan = {};
							for(var cy = 0; cy < data.data.length; cy++) {
								if(data.data[cy] !== null) {
									if($(".yusuan").hasClass('xuanzhongcy') && data.data[cy].accaCode == 2){
										nowData = data.data[cy]
									}else if($(".chaiwu").hasClass('xuanzhongcy') && data.data[cy].accaCode != 2){
										nowData = data.data[cy]
									}
									break;
								}
							}
							selectdata.data.vouDetails = nowData.vouDetails
							selectdata.data.vouTypeCode = nowData.vouTypeCode
							for(var i=0;i<selectdata.data.vouDetails.length;i++){
								delete selectdata.data.vouDetails[i].refBillGuid
								for(var z=0;z<selectdata.data.vouDetails[i].vouDetailAsss.length;z++){
									delete selectdata.data.vouDetails[i].vouDetailAsss[z].refBillGuid
									if(selectdata.data.vouDetails[i].vouDetailAsss[z].expireDate!=''){
										selectdata.data.vouDetails[i].vouDetailAsss[z].expireDate =result
									}
									if(selectdata.data.vouDetails[i].vouDetailAsss[z].billDate!=''){
										selectdata.data.vouDetails[i].vouDetailAsss[z].billDate =result
									}
									if(selectdata.data.vouDetails[i].vouDetailAsss[z].bussDate!=''){
										selectdata.data.vouDetails[i].vouDetailAsss[z].billDate =result
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
//							$("#dates").getObj().setValue(result);
							for(var cy = 0; cy < data.data.length; cy++) {
								if(data.data[cy] !== null) {
									if(data.data[cy].accaCode == 1) {
										quanjuvouchaiwu.vouDetails = data.data[cy].vouDetails
										quanjuvouchaiwu.vouTypeCode = data.data[cy].vouTypeCode
									} else if(data.data[cy].accaCode == 2) {
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
							if(addindexiszy){
							}else{
								$("#fjd").focus()
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
	} else {
		ufma.showTip("您没有此权限", function() {}, "error")
	}

})

$(document).on("click", ".leftcr", function(e) {
	var isnotpermission = '';
	for(var i = 0; i < isbtnpermission.length; i++) {
		if(isbtnpermission[i].id == "btn-insert") {
			isnotpermission = isbtnpermission[i].flag
		}
	}
	stopPropagation(e)
	if(isnotpermission != "0") {
		prevnextvoucher = -1;
		upadd()
		$(".voucher").remove();
		optNoType = 1;
		voucheralls()
		$(".voucherhe").find("#sppz").val("");
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
		var shuzi = leftsss.data[is].vouNo
		var pzh = leftsss.data[is].vouTypeCode
		for(var i = 0; i < $("#leftbgselect option").length; i++) {
			if($("#leftbgselect option").eq(i).attr("value") == pzh) {
				$("#leftbgselect option").eq(i).attr('selected', true)
			}
		}
		var oldfispred= (new Date($(this).parents('.voucherleftbodyk').find('.leftdates').html()).getMonth()) + 1
		var newfispred = (new Date($("#dates").getObj().getValue()).getMonth()) + 1
		if(oldfispred != newfispred){
			$("#dates").getObj().setValue($(this).parents('.voucherleftbodyk').find('.leftdates').html())
			newfispred = (new Date($("#dates").getObj().getValue()).getMonth()) + 1
		}
		$("#sppz").attr("name", "you").attr('fisperds',newfispred);
		$("#sppz").val(shuzi)
		$(".voucherleft").hide();
		$("#sppz").attr('vouno', $("#sppz").val())
		ufma.showTip("凭证插入后，此凭证之后的凭证将重新排序", function() {}, "warning");
		if(addindexiszy){
			$('.abstractinp').eq(0).focus()
		}else{
			$("#fjd").focus()
		}
	} else {
		ufma.showTip("您没有此权限", function() {}, "error")
	}
})
$(document).on("click", ".leftbtns", function(e) {
	stopPropagation(e)
})
$(document).on("click", ".closeleft", function(e) {
	$(this).parents(".voucherleft").hide()
})
$(document).on("click", ".btn-showleft", function(e) {
	stopPropagation(e)
	$('.voucherleftsearchinp').val('')
	$(".voucherleft").show();
	$(".voucherleftbody").html("<p style='text-align: center;margin-top: 100px;'>请稍候......</p>");
	$('#abstract-container').hide(100);
	leftsearch()
	leftsearchbody()
})
$(document).on("mouseover", ".voucherleft", function() {
	$(this).show();
})
$(document).on("mouseout", ".voucherleft", function() {
//	$(this).hide();
	//	$(".voucherleftbody").html("<p style='text-align: center;margin-top: 100px;'>请稍候......</p>");
})
$(document).on("click", ".btn-searchleft", function() {
	leftsearch()
	leftsearchbody()
})
$(document).on("keydown", ".voucherleftsearchinp", function(event) {
	event = event || window.event;
	if(event.keyCode == 13) {
		$('.btn-searchleft').trigger('click')
	}

})
$(document).on("click", ".leftsc", function(e) {
	if($(this).attr('sour') != 'MANUAL' && $(this).attr('sour') != 'AUTO') {
		ufma.showTip('不允许删除子系统生成的凭证')
	} else {
		var isnotpermission = '';
		for(var i = 0; i < isbtnpermission.length; i++) {
			if(isbtnpermission[i].id == "btn-delete") {
				isnotpermission = isbtnpermission[i].flag
			}
		}
		stopPropagation(e)
		if(isnotpermission != "0") {
			var vouguid = $(this).parents(".voucherleftbodyk").attr("name");
			var isDel = true;
			$.ajax({
				type: "get",
				url: "/gl/vou/getVou/" + vouguid + "?ajax=1&rueicode="+hex_md5svUserCode,
				async: false,
				success: function(data) {
					if(data.flag == "success") {
						var nowData;
						for(var cy = 0; cy < data.data.length; cy++) {
							if(data.data[cy] !== null) {
								nowData = data.data[cy]
								break;
							}
						}
						if(onlyVoidCanDel) {
							if(nowData.vouStatus != "C") {
								ufma.showTip("只能删除作废凭证！", function() {}, "warning");
								isDel = false;
								return false;
							}
						}

					} else {
						ufma.showTip(data.msg, function() {}, "error");
						isDel = false;
						return false;
					}
				},
				error: function(data) {
					ufma.showTip("未取到凭证信息", function() {}, "error");
					isDel = false;
					return false;
				}
			});

			_this = $(this)
			if(!isDel) {
				return false;
			}
			var vouguids = new Object();
			vouguids.vouGuid = vouguid
			ufma.confirm('确认删除此凭证吗？', function(action) {
				if(action) {
					$.ajax({
						type: "delete",
						data: JSON.stringify(vouguids),
						contentType: 'application/json; charset=utf-8',
						url: "/gl/vou/delVou" + "?ajax=1&rueicode="+hex_md5svUserCode,
						dataType: "json",
						async: false,
						success: function(data) {
							if(data.flag == "success") {
								var dwselected = rpt.nowAgencyCode;
								var ztselected = rpt.nowAcctCode;
								$.ajax({
									type: "get",
									url: "/gl/vou/getAccoByAcct/" + dwselected + "/" + ztselected + "?ajax=1&rueicode="+hex_md5svUserCode,
									dataType: "json",
									async: false,
									success: function(data) {
										quanjuvoudatas = data;
									}
								});
								_this.parents(".voucherleftbodyk").hide();
								ufma.showTip("删除成功", function() {}, "success");

								var nowguid = $(".voucher-head").attr("namess");
								if(vouguid == nowguid) {
									if(data.data == "NEED_ADD_VOU") {
										if($("#btn-voucher-xz").hasClass("btn-disablesd") != true) {
											gaibianl = true;
											$("#btn-voucher-xz").addClass("btn-disablesd")
											$("#zezhao").html('<div class="yu">正在请求数据中，请稍等</div>')
											$("#zezhao").show();
											upadd()
											$("#btn-voucher-xz").removeClass("btn-disablesd")
										}
									} else {
										var nextguid = data.data;
										$(".voucherleftbodyk[name='" + nextguid + "']").find(".leftcha").click();
									}
								}

							} else {
								ufma.showTip(data.msg, function() {}, "error");
							}
						},
						error: function(data) {
							ufma.showTip("失败,请检查网络", function() {}, "error");
						}
					});
				}
			});
		} else {
			ufma.showTip("抱歉您无此权限", function() {}, "error");
		}
	}
})
$(document).on("click", ".abstractinps li", function() {
	$(this).parents(".voucher-center").attr("op", "1");
	var nexop=$(this).parents(".voucher-center").next('.voucher-center').attr("op")
	if(vousinglepzzy && nexop!="0" && nexop!="2" && $(this).parents(".voucher-center").hasClass('voucher-centercw')){
		$(this).parents(".voucher-center").next('.voucher-center').attr("op", "1");
	}
})
$(document).on("input", ".abstractinp", function() {
	$(this).parents(".voucher-center").attr("op", "1");
	var nexop=$(this).parents(".voucher-center").next('.voucher-center').attr("op")
	if(vousinglepzzy && nexop!="0" && nexop!="2" && $(this).parents(".voucher-center").hasClass('voucher-centercw')){
		$(this).parents(".voucher-center").next('.voucher-center').attr("op", "1");
	}
})
$(document).on("keydown", ".abstractinp", function(event) {
	event = event || window.event;
	if(event.keyCode == 13) {
		$(this).parents(".voucher-center").attr("op", "1");
		var nexop=$(this).parents(".voucher-center").next('.voucher-center').attr("op")
		if(vousinglepzzy && nexop!="0" && nexop!="2" && $(this).parents(".voucher-center").hasClass('voucher-centercw')){
			$(this).parents(".voucher-center").next('.voucher-center').attr("op", "1");
		}
	}
})
$(document).on("click", ".accountinginps .clik1", function() {
	$(this).parents(".voucher-center").attr("op", "1");
})
$(document).on("keydown", ".accountinginp", function(event) {
	if(event.keyCode == 13) {
		$(this).parents(".voucher-center").attr("op", "1");
	}
})
$(document).on("input", ".money-sr", function() {
	$(this).parents(".voucher-center").attr("op", "1");
})
$(document).on("keydown", ".money-sr", function(event) {
	if(event.keyCode == 13) {
		$(this).parents(".voucher-center").next(".voucher-center").attr("op", "1");
	}
})

$(document).on("input", ".voucher-yc input", function() {
	$(this).parents(".voucher-center").attr("op", "1");
	$(this).parents(".voucher-yc-bo").attr("op", "1");
})

$(document).on("keydown", ".voucher-yc input", function(event) {
	event = event || window.event;
	if(event.keyCode == 13) {
		$(this).parents(".voucher-center").attr("op", "1");
		$(this).parents(".voucher-yc-bo").attr("op", "1");
	}
})