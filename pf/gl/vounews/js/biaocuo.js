var layer = 0;
function getCanvasWidth(){
	var voucherWidth = $(".voucherall").eq(0).width();
	return voucherWidth;
}
CanvasExt = {
	drawRect: function(canvasId, penColor, strokeWidth) {
		var that = this;
		that.penColor = penColor;
		that.penWidth = strokeWidth;
		$("#" + canvasId).attr("width", getCanvasWidth());
		$("#" + canvasId).attr("height", $(".voucherall").eq(0).height());

		var canvas = document.getElementById(canvasId);
		//canvas 的矩形框
		var canvasRect = canvas.getBoundingClientRect();
		//矩形框的左上角坐标
		var canvasLeft = canvasRect.left;
		var canvasTop = canvasRect.top;

		var layerIndex = layer;
		var layerName = "layer";
		var x = 0;
		var y = 0;

		//鼠标点击按下事件，画图准备
		canvas.onmousedown = function(e) {
			//设置画笔颜色和宽度
			var color = that.penColor;
			var penWidth = that.penWidth;
			layerIndex++;
			layer++;
			layerName += layerIndex;
			x = e.pageX - canvasLeft;
			y = e.pageY - canvasTop;
			$("#" + canvasId).addLayer({
				type: 'rectangle',
				strokeStyle: color,
				strokeWidth: penWidth,
				name: layerName,
				fromCenter: false,
				x: x,
				y: y,
				width: 1,
				height: 1
			});

			$("#" + canvasId).drawLayers();
			$("#" + canvasId).saveCanvas();
			//鼠标移动事件，画图
			canvas.onmousemove = function(e) {
				width = e.pageX - canvasLeft - x;
				height = e.pageY - canvasTop - y;

				$("#" + canvasId).removeLayer(layerName);

				$("#" + canvasId).addLayer({
					type: 'rectangle',
					strokeStyle: color,
					strokeWidth: penWidth,
					name: layerName,
					fromCenter: false,
					x: x,
					y: y,
					width: width,
					height: height
				});

				$("#" + canvasId).drawLayers();
			}
		};

		canvas.onmouseup = function(e) {

			var color = that.penColor;
			var penWidth = that.penWidth;

			canvas.onmousemove = null;

			width = e.pageX - canvasLeft - x;
			height = e.pageY - canvasTop - y;
			$("#pingzengjiucuo").append("<textarea class='textareawb' id='" + canvasId + layerIndex + "'></textarea>")
			if(100>width > 0) {
				$("#" + canvasId + layerIndex).css("width","100px");
				$("#" + canvasId + layerIndex).css("left", x + "px");
			} else if(width>=100){
				$("#" + canvasId + layerIndex).css("width", width + "px");
				$("#" + canvasId + layerIndex).css("left", x + "px");
			}else{
				$("#" + canvasId + layerIndex).css("width", width * -1 + "px");
				$("#" + canvasId + layerIndex).css("left", x + width + "px");
			}
			if(height < 0) {
				$("#" + canvasId + layerIndex).css("top", e.pageY - canvasTop - height + 2 + "px");
			} else {
				$("#" + canvasId + layerIndex).css("top", e.pageY - canvasTop + 2 + "px");
			}
			$("#" + canvasId + layerIndex).css("height", "40px");
			$("#" + canvasId + layerIndex).show();
			$("#" + canvasId).removeLayer(layerName);
			$("#" + canvasId).addLayer({
				type: 'rectangle',
				strokeStyle: color,
				strokeWidth: penWidth,
				name: layerName,
				fromCenter: false,
				x: x,
				y: y,
				width: width,
				height: height
			});
			$("#" + canvasId).drawLayers();
			$("#" + canvasId).saveCanvas();
			$("#" + canvasId + layerIndex).focus().select();
		}
	}
};

$(document).on("click", "#btn-voucher-biaocuo", function(e) {	
	if(selectdata.data.inputor == ufgovkey.svUserCode) {
		if(!isauditbiaocuo){
			ufma.showTip('制单人与标错人不能是同一人',function(){},'warning')
			return false
		}
	}
	if(erristext){
		$('.errtextdiv').show()
		$('#errtext').removeAttr('disabled')
		$('.biaocuo').show()
		$('.voucherbtn').hide()
		$("#cbAgency").find('.icon').hide()
		$("#cbAcct").find('.icon').hide()
		$(".voucherkjclick").hide()
		$('#vouHangup').hide()
		$("#voudataRefresh").hide()
		$("#vouisfullname").hide()
		$(".voucherqh").hide()
		$(".btn-bgfj").hide();
		$(".btn-showleft").hide();
		$(".voucherkj").hide();
		$(".voucherdw span").hide();
		$(".voucherzt span").hide();
		$(".btn-bgsearch").hide();
		$(".ycbodys").hide();
		$(".accountinginps").hide();
		$(".abstractinps").hide();
		$(".voucher-beizhu").eq(0).css("visibility",'hidden');
		$(".voucher-history").eq(0).css("visibility",'hidden');
	}else{
		$("#zezhao").html("<div class='yu'>正在启动标错程序，请稍候</div>");
		$("#zezhao").show();
		$('.voucher-center').attr('mobanindex','0')
		$('html,body').animate({
			scrollTop: 0
		}, 0);
		$(".voucherkjclick").hide()
		$("#cbAgency").find('.icon').hide()
		$("#cbAcct").find('.icon').hide()
		$('#vouHangup').hide()
		$("#voudataRefresh").hide()
		$("#vouisfullname").hide()
		$(".voucherqh").hide()
		$(".btn-bgfj").hide();
		$(".btn-showleft").hide();
		$(".voucherkj").hide();
		$(".voucherdw span").hide();
		$(".voucherzt span").hide();
		$(".btn-bgsearch").hide();
		$(".ycbodys").hide();
		$(".accountinginps").hide();
		$(".abstractinps").hide();
		$("#leftbgselect").find('option').hide()
		$("#leftbgselect").find('option:selected').show()
		$("#pingzengjiucuo").append('<canvas id="mycanvas" width="" height="" style="cursor: auto;"></canvas>');
		for(var i=0;i<$("textarea.abstractinp").length;i++){
			$("textarea.abstractinp").eq(i).after('<div class="abstractinp" style="overflow:hidden;">'+$("textarea.abstractinp").eq(i).val()+'<div>').hide()
		}
		for(var i=0;i<$("input.accountinginp").length;i++){
			$("input.accountinginp").eq(i).after('<div class="accountinginp" style="overflow:hidden;text-overflow: ellipsis;white-space: nowrap;">'+$("input.accountinginp").eq(i).val()+'<div>').hide()
		}
		stopPropagation(e);
		e.preventDefault();
		html2canvas($(".voucherall").eq(0), {
			allowTaint: true,
			taintTest: false,
			width: $(".voucherall").eq(0).outerWidth(true),
			height: $(".voucherall").eq(0).height(),
			onrendered: function(canvas) {
				canvas.id = "mycanvas";
				var dataUrl = canvas.toDataURL();
				$("#pingzengjiucuo").show();
				$("#pingzengjiucuo").css("width", getCanvasWidth() + "px").css('border','border 1px red');
				$("#pingzengjiucuo").css("height", $(".voucherall").eq(0).height() + "px");
				$("#pingzengjiucuo").css("background", "url(" + dataUrl + ")");
				$(".voucherall").eq(0).hide();
				$(".voucher-beizhu").eq(0).hide();
				$(".voucher-history").eq(0).hide();
				setTimeout(function() {
					$(".voucherkjclick").show()
					$('#vouHangup').show()
					$("#voudataRefresh").show()
					$("#vouisfullname").show()
					$(".voucherqh").show();
					$(".btn-bgfj").show();
					$(".btn-showleft").show();
					$(".voucherkj").show();
					$(".voucherdw span").show();
					$(".voucherzt span").show();
					$(".btn-bgsearch").show();
					$(".voucherbtn").hide();
					$("#cbAgency").find('.icon').hide()
					$("#cbAcct").find('.icon').hide()
					$(".times").hide();
					$("#leftbgselect").find('option').show()
					$("textarea.abstractinp").show()
					$("input.accountinginp").show()
					$("div.abstractinp").remove()
					$("div.accountinginp").remove()
				}, 100)
				$("#mycanvas").css("width", getCanvasWidth() + "px");
				$("#mycanvas").css("height", $(".voucherall").eq(0).height() + "px");
				CanvasExt.drawRect("mycanvas", "red", 1);
				$(".biaocuo").show();
				$("#zezhao").html("");
				$("#zezhao").hide();
			}
		});
	}
});
$(document).on("click", ".biaocuo .bcbc,.biaocuos .bcbc", function() {
	if($(this).hasClass("btn-disablesd") != true) {
		$(this).addClass("btn-disablesd")
		if(erristext){
			var newbiaoc = {}
			newbiaoc.vouGuid = $(".voucher-head").attr("namess");
			newbiaoc.errContent = $('#errtext').val()
			newbiaoc.imgHight = 0;
			ufma.ajaxDef('/gl/vou/signErr','post',newbiaoc,function(){
				ufma.showTip("标错成功", function() {}, "success");
				$('.errtextdiv').hide()
				$('.biaocuo').hide()
				$('.biaocuos').hide()
				$('.voucherbtn').show()
				$("#cbAgency").find('.icon').show()
				$("#cbAcct").find('.icon').show()
				$(".voucherkjclick").show()
				$('#vouHangup').show()
				$("#voudataRefresh").show()
				$("#vouisfullname").show()
				$(".voucherqh").show();
				$(".btn-bgfj").show();
				$(".btn-showleft").show();
				$(".voucherkj").show();
				$(".voucherdw span").show();
				$(".voucherzt span").show();
				$("#leftbgselect").find('option').show()
				$(".btn-bgsearch").show();
				$(".voucher-beizhu").eq(0).css("visibility",'visible');
				$(".voucher-history").eq(0).css("visibility",'visible');
				var vouguid = $(".voucher-head").attr("namess");
				$.ajax({
					type: "get",
					url: "/gl/vou/getVou/" + vouguid + "?ajax=1&rueicode="+hex_md5svUserCode,
					async: false,
					success: function(data) {
						if(data.flag == "success") {
							$('.voucher-center').attr('mobanindex','0')
							selectdata = data;
							dataforcwys(data.data)
							$(".nowu").text(selectdata.data.remark);
							$(".voucher-head").attr("namess", selectdata.data.vouGuid);
							$(".voucher-head").attr("op", selectdata.data.op);
							cwyspd()
							if(selectdata.data.haveErrInErrTab == true) {
								$("#xiaocuo").show();
							} else {
								$("#xiaocuo").hide();
							}
							$(".voucherall").show();
							$("#pingzengjiucuo").css("background", "none");
							$("#pingzengjiucuo").hide();
							$("#pingzengjiucuo").html("");
							$(".voucherbtn").show();
							$("#cbAgency").find('.icon').show()
							$("#cbAcct").find('.icon').show()
							$(".biaocuo").hide();
							$(".voucher-beizhu").eq(0).show();
							$(".voucher-history").eq(0).show();
							chapz();
							zhuantai();
						} else {
							ufma.showTip(data.msg, function() {}, "error");
						}
					},
					error: function(data) {
						ufma.showTip("未取到凭证信息", function() {}, "error")
					}
				});
			})
		}else{
			for(var i=0;i<$("textarea.textareawb").length;i++){
				var widths=$('textarea.textareawb').eq(i).css("width")
				var lefts=$('textarea.textareawb').eq(i).css("left")
				var tops=$('textarea.textareawb').eq(i).css("top")
				var displays=$('textarea.textareawb').eq(i).css("display")
				var divss = "<div class='textareawb' style='word-wrap: break-word;width:"+widths+";left:"+lefts+";top:"+tops+";height:200px;display:"+displays+";'>"+$('textarea.textareawb').eq(i).val() +"</div>"
				$("#pingzengjiucuo").append(divss)
				$("textarea.textareawb").eq(i).hide()
			}
			html2canvas($("#pingzengjiucuo").eq(0), {
				allowTaint: true,
				taintTest: false,
				width: getCanvasWidth(),
				height: $(".voucherall").eq(0).height(),
				onrendered: function(canvas) {
					canvas.id = "bccanvas";
					var dataUrl = canvas.toDataURL();
					var newbiaoc = new Object();
					if($(".voucher-head").attr("namess") == undefined) {
						ufma.showTip("抱歉，凭证尚未保存", function() {}, "warning")
					} else {
						newbiaoc.vouGuid = $(".voucher-head").attr("namess");
						newbiaoc.errContent = dataUrl
						newbiaoc.imgHight = $("#pingzengjiucuo").height();
						$.ajax({
							type: "post",
							url: "/gl/vou/signErr" + "?ajax=1&rueicode="+hex_md5svUserCode,
							async: false,
							data: JSON.stringify(newbiaoc),
							contentType: 'application/json; charset=utf-8',
							success: function(data) {
								if(data.flag == "success") {
									ufma.showTip("标错成功", function() {}, "success");
									$(".voucherall").eq(0).show();
									$(".voucherbtn").eq(0).show();
									$(".voucher-beizhu").eq(0).show();
									$(".voucher-history").eq(0).show();
									$("#pingzengjiucuo").hide();
									$("#pingzengjiucuo").html("");
									var vouguid = $(".voucher-head").attr("namess");
									$.ajax({
										type: "get",
										url: "/gl/vou/getVou/" + vouguid + "?ajax=1&rueicode="+hex_md5svUserCode,
										async: false,
										success: function(data) {
											if(data.flag == "success") {
												$('.voucher-center').attr('mobanindex','0')
												selectdata = data;
												dataforcwys(data.data)
												$(".nowu").text(selectdata.data.remark);
												$(".voucher-head").attr("namess", selectdata.data.vouGuid);
												$(".voucher-head").attr("op", selectdata.data.op);
												cwyspd()
												if(selectdata.data.haveErrInErrTab == true) {
													$("#xiaocuo").show();
												} else {
													$("#xiaocuo").hide();
												}
												$(".voucherall").show();
												$("#pingzengjiucuo").css("background", "none");
												$("#pingzengjiucuo").hide();
												$("#pingzengjiucuo").html("");
												$(".voucherbtn").show();
												$("#cbAgency").find('.icon').show()
												$("#cbAcct").find('.icon').show()
												$(".biaocuo").hide();
												$(".voucher-beizhu").eq(0).show();
												$(".voucher-history").eq(0).show();
												chapz();
												zhuantai();
											} else {
												ufma.showTip(data.msg, function() {}, "error");
											}
										},
										error: function(data) {
											ufma.showTip("未取到凭证信息", function() {}, "error")
										}
									});
								} else {
									ufma.showTip(data.msg, function() {}, "error")
								}
							},
							error: function() {
								ufma.showTip("标错失败", function() {}, "error");
							}
						});
					}

				}
			})
		}
		$(this).removeClass("btn-disablesd")
	}
})
$(document).on("click", ".biaocuo .quxiao,.biaocuos .closeerr", function() {
	if(erristext){
		$('.errtextdiv').hide()
		$('.biaocuo').hide()
		$('.biaocuos').hide()
		$('.voucherbtn').show()
		$("#cbAgency").find('.icon').show()
		$("#cbAcct").find('.icon').show()
		$(".voucher-beizhu").eq(0).css("visibility",'visible');
		$(".voucher-history").eq(0).css("visibility",'visible');
		$(".voucherkjclick").show()
		$('#vouHangup').show()
		$("#voudataRefresh").show()
		$("#vouisfullname").show()
		$(".voucherqh").show();
		$(".btn-bgfj").show();
		$(".btn-showleft").show();
		$(".voucherkj").show();
		$(".voucherdw span").show();
		$(".voucherzt span").show();
		$(".btn-bgsearch").show();
		$("#leftbgselect").find('option').show()
	}else{
		$(".voucherall").show();
		$("#pingzengjiucuo").css("background", "none");
		$("#pingzengjiucuo").hide();
		$("#pingzengjiucuo").html("");
		$(".voucherbtn").show();
		$("#cbAgency").find('.icon').show()
		$("#cbAcct").find('.icon').show()
		$(".biaocuo").hide();
		$(".voucher-beizhu").eq(0).show();
		$(".voucher-history").eq(0).show();
		$("#leftbgselect").find('option').show()
	}
})

$(document).on("click", "#xiaocuo", function() {
	var vouguid = $(".voucher-head").attr("namess");
	var thisbiaocuo = new Object();
	$.ajax({
		type: "get",
		url: "/gl/vou/getVouSignErrs/" + vouguid + "?ajax=1&rueicode="+hex_md5svUserCode,
		async: false,
		success: function(data) {
			if(data.flag == "success") {
				if(erristext){
					if(data.data[0].imgHight == 0){
						$('#errtext').val(data.data[0].errContent)
					}
					$('.errtextdiv').show()
					$('.biaocuos').show()
					$('.voucherbtn').hide()
					$("#cbAgency").find('.icon').hide()
					$("#cbAcct").find('.icon').hide()
					$(".voucherkjclick").hide()
					$('#vouHangup').hide()
					$("#voudataRefresh").hide()
					$("#vouisfullname").hide()
					$(".voucherqh").hide()
					$(".btn-bgfj").hide();
					$(".btn-showleft").hide();
					$(".voucherkj").hide();
					$(".voucherdw span").hide();
					$(".voucherzt span").hide();
					$(".btn-bgsearch").hide();
					$(".ycbodys").hide();
					$(".accountinginps").hide();
					$(".abstractinps").hide();
					$("#leftbgselect").find('option').hide()
					$("#leftbgselect").find('option:selected').show()
					$(".voucher-beizhu").eq(0).css("visibility",'hidden');
					$(".voucher-history").eq(0).css("visibility",'hidden');
				}else{
					thisbiaocuo = data;
					if(data.data[0].imgHight != 0){
						$("body").append("<div id='xiaocuobj'></div><div class='leftbiaocuo icon-angle-left'></div><div class='rightbiaocuo icon-angle-right'></div>");
						$("#xiaocuobj").css("background", "url(" + data.data[0].errContent + ")")
						$("#xiaocuobj").css("width", $(".voucherall").width() + "px");
						$("#xiaocuobj").css("background-repeat",'no-repeat');
						$("#xiaocuobj").css("height", data.data[0].imgHight + "px");
						$("#xiaocuobj").css("margin-left", "-" + $(".voucherall").width() / 2 + "px");
						$("#xiaocuobj").attr("name", 0);
						$(".voucherbtn").hide();
						$("#cbAgency").find('.icon').hide()
						$("#cbAcct").find('.icon').hide()
						$(".biaocuo").hide();
						$(".voucherall").hide()
						$(".voucher-beizhu").hide();
						$(".voucher-history").hide();
					}
				}
			} else {
				ufma.showTip(data.msg, function() {}, "error");
			}

		},
		error: function() {
			ufma.showTip("连接失败，请检查网络", function() {}, "error")
		}
	});
})
$(document).on("click", "#xiaocuobj", function(e) {
	stopPropagation(e);
	$(this).remove();
	$(".leftbiaocuo").remove();
	$(".rightbiaocuo").remove();
	$(".voucherbtn").show();
	$("#cbAgency").find('.icon').show()
	$("#cbAcct").find('.icon').show()
	$(".voucherall").show()
	$(".voucher-beizhu").show();
	$(".voucher-history").show();
	$(document).trigger('click')
})
$(document).on("click", ".leftbiaocuo", function(e) {
	stopPropagation(e);
	var vouguid = $(".voucher-head").attr("namess");
	var thisbiaocuo = new Object();
	$.ajax({
		type: "get",
		url: "/gl/vou/getVouSignErrs/" + vouguid + "?ajax=1&rueicode="+hex_md5svUserCode,
		async: false,
		success: function(data) {
			if(data.flag == "success") {
				if(parseFloat($("#xiaocuobj").attr("name")) + 1 < data.data.length  && data.data[$("#xiaocuobj").attr("name") + 1].imgHight != 0) {
					$("#xiaocuobj").css("background", "url(" + data.data[parseFloat($("#xiaocuobj").attr("name")) + 1].errContent + ")");
					$("#xiaocuobj").attr("name", parseFloat($("#xiaocuobj").attr("name")) + 1);
					$("#xiaocuobj").css("height", data.data[parseFloat($("#xiaocuobj").attr("name")) + 1].imgHight + "px");
				} else {
					ufma.showTip("这是最新的一张了", function() {}, "warning")
				}
			} else {
				ufma.showTip(data.msg, function() {}, "error");
			}
		},
		error: function() {
			ufma.showTip("加载失败，请检查网络", function() {}, "error");
		}
	});
})
$(document).on("click", ".rightbiaocuo", function(e) {
	stopPropagation(e);
	var vouguid = $(".voucher-head").attr("namess");
	var thisbiaocuo = new Object();
	$.ajax({
		type: "get",
		url: "/gl/vou/getVouSignErrs/" + vouguid + "?ajax=1&rueicode="+hex_md5svUserCode,
		async: false,
		success: function(data) {
			if(data.flag == "success") {
				if($("#xiaocuobj").attr("name") - 1 >= 0 && data.data[$("#xiaocuobj").attr("name") - 1].imgHight != 0) {
					$("#xiaocuobj").css("background", "url(" + data.data[$("#xiaocuobj").attr("name") - 1].errContent + ")")
					$("#xiaocuobj").attr("name", parseFloat($("#xiaocuobj").attr("name")) - 1)
					$("#xiaocuobj").css("height", data.data[parseFloat($("#xiaocuobj").attr("name")) - 1].imgHight + "px");
				} else {
					ufma.showTip("已经是最后一张", function() {}, "warning")
				}
			} else {
				ufma.showTip(data.msg, function() {}, "error");
			}

		},
		error: function() {
			ufma.showTip("连接失败，请检查网络", function() {}, "error")
		}
	});
})