$(function() {

	// 打开智能记账页面
	var intelacdata;
	var intelacdataid;
	var intelaccid;
	$('#intelAcc').on('click', function() {
		$('#intelAccModal').modal('show');
		ufma.ajaxDef('/gl/intelligentMakeVoucher/getImage2', 'post', '', function(res) {
			if(res.flag == 'success') {
				intelaccid = res.data.text
				var elements = document.getElementById('scaner');
				elements.src = res.data.imgstr
				iaupadd()
			}

		});
		//upadd()
	})
	$("#intelaccupsta").on('click', function() {
		iaupadd()
	})
	$("#intelaccqued").on('click', function() {
		if(intelacdataid != undefined) {
			$.ajax({
				type: "get",
				url: "/gl/vouTemp/getTempPair/" + intelacdataid + "?ajax=1",
				async: false,
				success: function(data) {
					if(data.flag == "success") {
						mobanneirong.data = data.data
						var cwinteall = []
						var ysinteall = []
						for(var i = 0; i < $(".tickets-list ul li").length; i++) {
							if($(".tickets-list ul li").eq(i).find('.select-ticket').hasClass('is-selected')) {
								var cwdata = []
								var ysdata = []
								var tableinta = intelacdata[i]["table"]
								for(var z = 0; z < tableinta.length; z++) {
									if(tableinta[z].KJTX == '财务会计') {
										cwdata.push(tableinta[z])
									} else {
										ysdata.push(tableinta[z])
									}
								}
								var run = data.data
								for(var j = 0; j < cwdata.length; j++) {
									if(cwdata[j].DRAMOUNT == null) {
										run.cwVouTempVo.vouDetails[j].stadAmt = parseFloat(cwdata[j].CRAMOUNT).toFixed(2)
										if(run.cwVouTempVo.vouDetails[j].vouDetailAsss != null && run.cwVouTempVo.vouDetails[j].vouDetailAsss.length > 0) {
											for(var u = 0; u < run.cwVouTempVo.vouDetails[j].vouDetailAsss.length; u++) {
												run.cwVouTempVo.vouDetails[j].vouDetailAsss[u].stadAmt = 0
											}
											run.cwVouTempVo.vouDetails[j].vouDetailAsss[0].stadAmt = parseFloat(cwdata[j].CRAMOUNT).toFixed(2)
										}
									} else {
										run.cwVouTempVo.vouDetails[j].stadAmt = parseFloat(cwdata[j].DRAMOUNT).toFixed(2)
										if(run.cwVouTempVo.vouDetails[j].vouDetailAsss != null && run.cwVouTempVo.vouDetails[j].vouDetailAsss.length > 0) {
											for(var u = 0; u < run.cwVouTempVo.vouDetails[j].vouDetailAsss.length; u++) {
												run.cwVouTempVo.vouDetails[j].vouDetailAsss[u].stadAmt = 0
											}
											run.cwVouTempVo.vouDetails[j].vouDetailAsss[0].stadAmt = parseFloat(cwdata[j].DRAMOUNT).toFixed(2)
										}
									}
								}
								for(var j = 0; j < ysdata.length; j++) {
									if(ysdata[j].DRAMOUNT == null) {
										run.ysVouTempVo.vouDetails[j].stadAmt = parseFloat(ysdata[j].CRAMOUNT).toFixed(2)
										if(run.ysVouTempVo.vouDetails[j].vouDetailAsss != null && run.ysVouTempVo.vouDetails[j].vouDetailAsss.length > 0) {
											for(var u = 0; u < run.ysVouTempVo.vouDetails[j].vouDetailAsss.length; u++) {
												run.ysVouTempVo.vouDetails[j].vouDetailAsss[u].stadAmt = 0
											}
											run.ysVouTempVo.vouDetails[j].vouDetailAsss[0].stadAmt = parseFloat(ysdata[j].CRAMOUNT).toFixed(2)
										}
									} else {
										run.ysVouTempVo.vouDetails[j].stadAmt = parseFloat(ysdata[j].DRAMOUNT).toFixed(2)
										if(run.ysVouTempVo.vouDetails[j].vouDetailAsss != null && run.ysVouTempVo.vouDetails[j].vouDetailAsss.length > 0) {
											for(var u = 0; u < run.ysVouTempVo.vouDetails[j].vouDetailAsss.length; u++) {
												run.ysVouTempVo.vouDetails[j].vouDetailAsss[u].stadAmt = 0
											}
											run.ysVouTempVo.vouDetails[j].vouDetailAsss[0].stadAmt = parseFloat(ysdata[j].DRAMOUNT).toFixed(2)
										}
									}
								}
								for(var j = 0; j < run.cwVouTempVo.vouDetails.length; j++) {
									cwinteall.push(run.cwVouTempVo.vouDetails[j])
								}
								for(var j = 0; j < run.ysVouTempVo.vouDetails.length; j++) {
									ysinteall.push(run.ysVouTempVo.vouDetails[j])
								}
							}
						}
						mobanneirong.data.cwVouTempVo.vouDetails = cwinteall
						mobanneirong.data.ysVouTempVo.vouDetails = ysinteall
						selectdata.data = {};
						quanjuvouchaiwu = {};
						quanjuvouyusuan = {};
						if(mobanneirong.data.cwVouTempVo != null) {
							quanjuvouchaiwu.vouDetails = mobanneirong.data.cwVouTempVo.vouDetails;
						} else {
							quanjuvouchaiwu = null;
						}
						if(mobanneirong.data.ysVouTempVo != null) {
							quanjuvouyusuan.vouDetails = mobanneirong.data.ysVouTempVo.vouDetails;
						} else {
							quanjuvouyusuan = null;
						}
						if(mobanneirong.data.cwVouTempVo != null && mobanneirong.data.ysVouTempVo != null) {
							if($(".xuanzhongcy").hasClass("chaiwu")) {
								selectdata.data.vouDetails = mobanneirong.data.cwVouTempVo.vouDetails;
							} else {
								selectdata.data.vouDetails = mobanneirong.data.ysVouTempVo.vouDetails;
							}
						} else if(mobanneirong.data.cwVouTempVo != null) {
							selectdata.data.vouDetails = mobanneirong.data.cwVouTempVo.vouDetails;
						} else if(mobanneirong.data.ysVouTempVo != null) {
							selectdata.data.vouDetails = mobanneirong.data.ysVouTempVo.vouDetails;
						}
						prevnextvoucher = -1;
						$(".xuanzhongcy").removeAttr("names");
						$(".voucherhe").find("#sppz").val("*");
						$("#fjd").val("");
						$("#pzzhuantai").hide().text("").removeAttr("vou-status");
						cwyspd();
						$(".voucher").remove();
						voucheralls();
						zhuantai();
						$("#zezhao").hide();
						$("body").css("overflow-y", "auto");
						chapz();
						vouluru();
						$("#dates").val(result);
						changeCWYS();
						//						bidui()
						$('#intelAccModal').modal('hide');
					}
				}
			})
		}
	})
	// 扫描二维码
	var count = 0,
		$tickets = $('.tickets-list li');
	$('#scan').on('click', function() {
		//      if ($tickets.length === count) return;// 演示时的伪代码
		//      var $this = $(this),
		//          $next = $this.next();
		//      $this.hide()
		//      $next.show(function () {
		//          setTimeout(function () {
		//              $tickets.eq(count).removeClass('hide')
		//              $next.hide()
		//              $this.show()
		//              count++
		//              if($('.tickets-list ul li').length>0){
		//             		$('.tickets-list ul li').eq(0).click()
		//              }
		//          }, 2000)
		//      })
	})

	function iaupadd() {
		var argu = {
			bxr: $("#intelAccModalone option:selected").attr('value'),
			fybm: $("#intelAccModaltwo option:selected").attr('value'),
			xm: $("#intelAccModalthree option:selected").attr('value'),
			fylx: $("#intelAccModalfour option:selected").attr('value'),
			guid: intelaccid
		}

		ufma.ajaxDef('/gl/intelligentMakeVoucher/getInf', 'post', argu, function(res) {
			if(res.flag == 'success') {
				//						var res = {
				//					data: {
				//						"list": [{
				//								"CONTENTD": "增值税专用发票",
				//								"DATE1": "2018-05-14",
				//								"MONEY": "1000",
				//								"BUYER_NAME": "北京用友政务软件有限公司",
				//								"BUYER_TAX_NO": "911101087461354032",
				//								"SELLER_NAME": "北京必胜客比萨饼有限公司",
				//								"FILE_NAME": "增值税发票图片1",
				//								"REL_PATH": "/pf/gl/vou/img/bill.jpg",
				//								"table": [{
				//										"KJTX": "财务会计",
				//										"DESCPT": "报销差旅费",
				//										"ACCO_CODE": "5001",
				//										"DRAMOUNT": "120",
				//										"CRAMOUNT": null,
				//										"ACC_CODES": "001,002"
				//									},
				//									{
				//										"KJTX": "财务会计",
				//										"DESCPT": "报销差旅费",
				//										"ACCO_CODE": "5001",
				//										"DRAMOUNT": null,
				//										"CRAMOUNT": "120",
				//										"ACC_CODES": "001,002"
				//									},
				//									{
				//										"KJTX": "预算会计",
				//										"DESCPT": "报销差旅费",
				//										"ACCO_CODE": "6001",
				//										"DRAMOUNT": "120",
				//										"CRAMOUNT": null,
				//										"ACC_CODES": "003,004"
				//									},
				//									{
				//										"KJTX": "预算会计",
				//										"DESCPT": "报销差旅费",
				//										"ACCO_CODE": "6001",
				//										"DRAMOUNT": null,
				//										"CRAMOUNT": "120",
				//										"ACC_CODES": "003,004"
				//									}
				//								]
				//							},
				//							{
				//								"CONTENTD": "飞机行程单",
				//								"FROMDATE": "2018-05-14",
				//								"TODATE": "2018-05-14",
				//								"CLASS": "经济舱",
				//								"PASSENGER_NAME": "侯彦",
				//								"DEPART_STATION": "北京首都T3",
				//								"ARRIVAL_STATION": "上海虹桥T2",
				//								"TATOL_AMOUNT": "1253",
				//								"FILE_NAME": "增值税发票图片1",
				//								"REL_PATH": "/pf/gl/vou/img/bill.jpg",
				//								"table": [{
				//										"KJTX": "财务会计",
				//										"DESCPT": "报销差旅费",
				//										"ACCO_CODE": "5001",
				//										"DRAMOUNT": "1253",
				//										"CRAMOUNT": null,
				//										"ACC_CODES": "001,002"
				//									},
				//									{
				//										"KJTX": "财务会计",
				//										"DESCPT": "报销差旅费",
				//										"ACCO_CODE": "5001",
				//										"DRAMOUNT": null,
				//										"CRAMOUNT": "1253",
				//										"ACC_CODES": "001,002"
				//									},
				//									{
				//										"KJTX": "预算会计",
				//										"DESCPT": "报销差旅费",
				//										"ACCO_CODE": "60016001600160016001600160016001600160016001600160016001600160016001600160016001600160016001600160016001",
				//										"DRAMOUNT": "1253",
				//										"CRAMOUNT": null,
				//										"ACC_CODES": "003,004"
				//									},
				//									{
				//										"KJTX": "预算会计",
				//										"DESCPT": "报销差旅费",
				//										"ACCO_CODE": "6001",
				//										"DRAMOUNT": null,
				//										"CRAMOUNT": "1253",
				//										"ACC_CODES": "003,004"
				//									}
				//								]
				//							},
				//							{
				//								"CONTENTD": "火车票",
				//								"DEPART_DATE": "2018-05-14",
				//								"DEPART_TIME": "2018-05-14",
				//								"DEPART_STATION": "北京西",
				//								"ARRIVAL_STATION": "上海虹桥",
				//								"TRAIN_NUMBER": "G1",
				//								"PASSENGER_NAME": "侯彦",
				//								"SEAT_LEVEL": "二等座",
				//								"PRICE": "553",
				//								"FILE_NAME": "增值税发票图片1",
				//								"REL_PATH": "/pf/gl/vou/img/bill.jpg",
				//								"table": [{
				//										"KJTX": "财务会计",
				//										"DESCPT": "报销差旅费",
				//										"ACCO_CODE": "5001",
				//										"DRAMOUNT": "553",
				//										"CRAMOUNT": null,
				//										"ACC_CODES": "001,002"
				//									},
				//									{
				//										"KJTX": "财务会计",
				//										"DESCPT": "报销差旅费",
				//										"ACCO_CODE": "5001",
				//										"DRAMOUNT": null,
				//										"CRAMOUNT": "553",
				//										"ACC_CODES": "001,002"
				//									},
				//									{
				//										"KJTX": "预算会计",
				//										"DESCPT": "报销差旅费",
				//										"ACCO_CODE": "6001",
				//										"DRAMOUNT": "553",
				//										"CRAMOUNT": null,
				//										"ACC_CODES": "003,004"
				//									},
				//									{
				//										"KJTX": "预算会计",
				//										"DESCPT": "报销差旅费",
				//										"ACCO_CODE": "6001",
				//										"DRAMOUNT": null,
				//										"CRAMOUNT": "553",
				//										"ACC_CODES": "003,004"
				//									}
				//								]
				//							}
				//						],
				//						"groupid": "5ef63c2885e34fcfb0bdccadfbac934a"
				//					}
				//				}
				intelacdata = res.data.list
				intelacdataid = res.data.groupid
				if(res.data.list.length > 0) {
					var lis = ''
					for(var i = 0; i < res.data.list.length; i++) {
						if(res.data.list[i].CONTENTD == '增值税专用发票') {
							lis += '<li class="" indexs= ' + i + '>'
							lis += '<div class="ticket">'
							lis += '<div class="ticket-head">'
							lis += '<img src="./img/invoice.png" class="pull-left ticket-img">'
							//							lis += '<p class="pull-left ticket-title">内容: <span>'+res.data.list[i].CONTENTD+'</span></p>'
							lis += '<p class="pull-left ticket-title">内容: <span>住宿费</span></p>'
							lis += '<div class="pull-right select-ticket"></div>'
							lis += '</div>'
							lis += '<div class="ticket-body">'
							lis += '<p>'
							lis += '<span class="eat-date">日期: <span>' + res.data.list[i].DATE1 + '</span></span>'
							lis += '<span class="eat-money">金额: ¥<sapn>' + res.data.list[i].MONEY + '</sapn></span>'
							lis += '</p>'
							lis += '<p>购买方: <span>' + res.data.list[i].BUYER_NAME + '</span></p>'
							lis += '<p>税号: <span>' + res.data.list[i].BUYER_TAX_NO + '</span></p>'
							lis += '<p>销售方: <span>' + res.data.list[i].SELLER_NAME + '</span></p>'
							lis += '</div>'
							lis += '</div>'
							lis += '</li>'
						} else if(res.data.list[i].CONTENTD == '飞机行程单') {
							lis += '<li class="" indexs= ' + i + '>'
							lis += '<div class="ticket">'
							lis += '<div class="ticket-head">'
							lis += '<img src="./img/plane.png" class="pull-left ticket-img">'
							lis += '<p class="pull-left ticket-title">内容: <span>飞机票</span></p>'
							lis += '<div class="pull-right select-ticket"></div>'
							lis += '</div>'
							lis += '<div class="ticket-body train-plane">'
							lis += '<p style="margin-top: 20px;">'
							lis += '<span class="start-date">出发日期: <span>' + res.data.list[i].FROMDATE + '</span></span>'
							lis += '<span class="train-num">舱位: <sapn>' + res.data.list[i].CLASS + '</sapn></span></P>'
							lis += '<p>'
							lis += '<span class="arrive-date">到达日期: <span>' + res.data.list[i].TODATE + '</span></span>'
							lis += '<span class="train-num">乘坐人: <sapn>' + res.data.list[i].PASSENGER_NAME + '</sapn></span></p>'
							lis += '<p>'
							lis += '<span class="start-station">出发站: <span>' + res.data.list[i].DEPART_STATION + '</span></span>'
							lis += '<span class="train-num">金额: ¥<sapn>' + res.data.list[i].TATOL_AMOUNT + '</sapn></span></p>'
							lis += '<p>'
							lis += '<span class="start-station">到达站: <span>' + res.data.list[i].ARRIVAL_STATION + '</span></span></p>'
							lis += '</div>'
							lis += '</div>'
							lis += '</li>'
						} else if(res.data.list[i].CONTENTD == '火车票') {
							lis += '<li class="" indexs= ' + i + '>'
							lis += '<div class="ticket">'
							lis += '<div class="ticket-head">'
							lis += '<img src="./img/train.png" class="pull-left ticket-img">'
							lis += '<p class="pull-left ticket-title">内容: <span>火车票</span></p>'
							lis += '<div class="pull-right select-ticket"></div>'
							lis += '</div>'
							lis += '<div class="ticket-body train-plane">'
							lis += '<p style="margin-top: 20px;">'
							lis += '<span class="start-date">出发日期: <span>' + res.data.list[i].DEPART_DATE + '</span></span>'
							lis += '<span class="train-num">车次: <sapn>' + res.data.list[i].TRAIN_NUMBER + '</sapn></span></p>'
							lis += '<p>'
							lis += '<span class="arrive-date">到达日期: <span>' + res.data.list[i].DEPART_TIME + '</span></span>'
							lis += '<span class="train-num">席位: <sapn>' + res.data.list[i].SEAT_LEVEL + '</sapn></span></p>'
							lis += '<p>'
							lis += '<span class="start-station">出发站: <span>' + res.data.list[i].DEPART_STATION + '</span></span>'
							lis += '<span class="train-num">乘坐人: <sapn>' + res.data.list[i].PASSENGER_NAME + '</sapn></span></p>'
							lis += '<p>'
							lis += '<span class="start-station">到达站: <span>' + res.data.list[i].ARRIVAL_STATION + '</span></span>'
							lis += '<span class="train-num">金额: ¥<sapn>' + res.data.list[i].PRICE + '</sapn></span></p>'
							lis += '</div>'
							lis += '</div>'
							lis += '</li>'
						}
					}
					$("#intelaccul").html(lis)
					$('.tickets-list ul li').eq(0).click()
				} else {
					var lis = ''
					$("#intelaccul").html(lis)
					$("#intelltable").html('')
					var elements = document.getElementById('bigintell');
					elements.src = ''
				}
			}
		})
	}
	// 选择票据
	$(document).on('click', '.select-ticket', function() {
		$(this).toggleClass('is-selected');
		return false
	})
	// 点击查看票据
	var $des = $('.ticket-des')
	$(document).on('click', '.tickets-list ul li', function() {
		$des.hide(function() {
			$des.show()
		}); // 演示用的伪代码
		var elements = document.getElementById('bigintell');
		elements.src = intelacdata[$(this).attr('indexs')].REL_PATH
		intelacdata[$(this).attr('indexs')].table
		var tabs = '';
		tabs += '<tr><th>会计体系</th><th>摘要</th><th>科目</th><th>借方金额</th><th>贷方金额</th><th>辅助核算</th></tr>'
		for(var i = 0; i < intelacdata[$(this).attr('indexs')].table.length; i++) {
			if(intelacdata[$(this).attr('indexs')].table[i].DRAMOUNT == null) {
				tabs += '<tr><td title=' + intelacdata[$(this).attr('indexs')].table[i].KJTX + '>' + intelacdata[$(this).attr('indexs')].table[i].KJTX + '</td>'
				tabs += '<td style="text-align:left;" title=' + intelacdata[$(this).attr('indexs')].table[i].DESCPT + '>' + intelacdata[$(this).attr('indexs')].table[i].DESCPT + '</td>'
				tabs += '<td style="text-align:left;" title=' + intelacdata[$(this).attr('indexs')].table[i].ACCO_CODE + '>' + intelacdata[$(this).attr('indexs')].table[i].ACCO_CODE + '</td>'
				tabs += '<td></td><td style="text-align:right;" title=' + intelacdata[$(this).attr('indexs')].table[i].CRAMOUNT + '>' + intelacdata[$(this).attr('indexs')].table[i].CRAMOUNT + '</td>'
				tabs += '<td style="text-align:left;" title=' + intelacdata[$(this).attr('indexs')].table[i].ACC_CODES + '>' + intelacdata[$(this).attr('indexs')].table[i].ACC_CODES + '</td></tr>'
			} else {
				tabs += '<tr><td title=' + intelacdata[$(this).attr('indexs')].table[i].KJTX + '>' + intelacdata[$(this).attr('indexs')].table[i].KJTX + '</td>'
				tabs += '<td style="text-align:left;" title=' + intelacdata[$(this).attr('indexs')].table[i].DESCPT + '>' + intelacdata[$(this).attr('indexs')].table[i].DESCPT + '</td>'
				tabs += '<td style="text-align:left;" title=' + intelacdata[$(this).attr('indexs')].table[i].ACCO_CODE + '>' + intelacdata[$(this).attr('indexs')].table[i].ACCO_CODE + '</td>'
				tabs += '<td style="text-align:right;" title=' + intelacdata[$(this).attr('indexs')].table[i].DRAMOUNT + '>' + intelacdata[$(this).attr('indexs')].table[i].DRAMOUNT + '</td><td></td>'
				tabs += '<td style="text-align:left;" title=' + intelacdata[$(this).attr('indexs')].table[i].ACC_CODES + '>' + intelacdata[$(this).attr('indexs')].table[i].ACC_CODES + '</td></tr>'
			}
		}
		$("#intelltable").html(tabs)
		if($(this).hasClass('active')) return;
		$('.tickets-list ul li.active').removeClass('active');
		$(this).addClass('active');
	})
	// 设置记账凭证中的数字间隔
	$(window).on('resize', function() {
		setTimeout(function() {
			var width = $('body').width();
			var $money = $('#intelAccModal .money-xs');
			if(width > 1200) {
				$money.addClass('big-letter');
			} else {
				$money.removeClass('big-letter');
			}
		}, 100)
	})
	// 防止多个滚动条
	$('#intelAccModal').on('shown.bs.modal', function() {
		$('body.ufma-container').css('overflow-y', 'hidden');
	})
	$('#intelAccModal').on('hidden.bs.modal', function() {
		setTimeout(function() {
			$('body.ufma-container').css('overflow-y', 'auto');
		}, 0);
	})
	//	$("#intelAccModalone").ufmaCombox2({
	//		valueField: 'code',
	//		textField: 'name',
	//		data: [{
	//			'code': '001',
	//			'name': '报销人'
	//		}],
	//		readOnly: false,
	//		placeholder: '请选择报销人',
	//		onchange: function(data) {}
	//	})
	//	$("#intelAccModaltwo").ufmaCombox2({
	//		valueField: 'code',
	//		textField: 'name',
	//		data: [{
	//			'code': '001',
	//			'name': '费用部门'
	//		}],
	//		readOnly: false,
	//		placeholder: '请选择费用部门',
	//		onchange: function(data) {}
	//	})
	//	$("#intelAccModalthree").ufmaCombox2({
	//		valueField: 'code',
	//		textField: 'name',
	//		data: [{
	//			'code': '1002003',
	//			'name': '基于三维实景和精密GIS技术的道路全资产管理解决方案研究'
	//		},
	//		{
	//			'code': '1002001',
	//			'name': '智慧公路建设关键技术研究'
	//		}
	//		],
	//		readOnly: false,
	//		placeholder: '请选择项目',
	//		onchange: function(data) {}
	//	})
	//$("#intelAccModalthree").ufmaCombox2().val('1002003')
	//	$("#intelAccModalfour").ufmaCombox2({
	//		valueField: 'code',
	//		textField: 'name',
	//		data: [{
	//			'code': '30211',
	//			'name': '国内差旅费'
	//		},{
	//			'code': '30216',
	//			'name': '培训费'
	//		}],
	//		readOnly: false,
	//		placeholder: '请选择费用类型',
	//		onchange: function(data) {}
	//	})
	//$("#intelAccModalfour").ufmaCombox2().val('30211')
});