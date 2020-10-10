(function ($) {
	$.extend({
		inputStyle: function () {
			function check(el, cl) {
				$(el).each(function () {
					$(this).parent('i').removeClass(cl);

					var checked = $(this).prop('checked');
					if (checked) {
						$(this).parent('i').addClass(cl);
					}
				})
			}
			$('input[type="radio"]').on('click', function () {
				check('input[type="radio"]', 'radio_bg_check');
			})
			$('input[type="checkbox"]').on('click', function () {
				check('input[type="checkbox"]', 'checkbox_bg_check');
			})
		}

	})

})(jQuery)

var vouTemplateGuid;
$(document).on("click", "#mbbc", function (e) {
	stopPropagation(e);
	if ($(".xuanzhongcy").attr("names") != undefined) {
		var guid = $(".xuanzhongcy").attr("names");
	}
	if (guid == undefined || $(".voucher-head").attr("namess") == undefined) {
		ufma.showTip("请保存凭证后再存为模板", function () { }, "warning");
	} else {
		$("#zezhao").show();
		$("body").css("overflow", "hidden");
		var keywordss = new Object()
		$.ajax({
			type: "get",
			beforeSend: function(xhr) {
				xhr.setRequestHeader("x-function-id",voumenuid);
			},
			url: "/gl/vouTemp/getKW/" + "?ajax=1&rueicode=" + hex_md5svUserCode,
			async: false,
			success: function (data) {
				if (data.flag == "success") {
					keywordss = data;
				} else {
					ufma.showTip(data.msg, function () { }, "error");
				}
			}
		});
		$.ajax({
			type: "get",
			beforeSend: function(xhr) {
				xhr.setRequestHeader("x-function-id",voumenuid);
			},
			url: " /gl/vou/getAccs/" + guid + "?ajax=1&rueicode=" + hex_md5svUserCode,
			async: false,
			success: function (data) {
				if (data.flag == "success") {
					var mbbc = '';
					mbbc += '<div id="moban" class="mobanbc">'
					mbbc += '<div class="moban-head">'
					mbbc += '<p>保存凭证模板</p>'
					mbbc += '<span class="mbclose">x</span>'
					mbbc += '</div>'
					mbbc += '<div class="moban-body">'
					mbbc += '<div class="mbname">'
					mbbc += '<p>共享单位：</p>'
					mbbc += '<div id="mobanagency" style="margin-left:8px;" class="ufma-textboxlist w210"></div>'
					mbbc += '<p>模板分组：</p>'
					mbbc += '<div class="nofz"></div>'
					mbbc += '<div id="mobanfz" class="uf-treecombox w210 ufma-combox"></div>'
					mbbc += '<p>模板名称：</p>'
					mbbc += '<input type="text" name="mobanmc" id="mobanmc" placeholder="请输入" />'
					mbbc += '</div>'
					mbbc += '<div class="mbcheck">'
					mbbc += '<p>可选要素：</p>'
					mbbc += '<div class="kxys">'
					mbbc += '<div class="kxyskx">'
					mbbc += '<label>'
					mbbc += '<i class="input_style checkbox_bg checkbox_bg_check"><input type="checkbox"  checked="checked" value="AMT"></i> 金额'
					mbbc += '</label>'
					mbbc += '<label>'
					mbbc += '<i class="input_style checkbox_bg checkbox_bg_check"><input type="checkbox"  checked="checked" value="Descpt"></i> 摘要'
					mbbc += '</label>'
					if (data.data == null) { } else {
						for (var i in data.data) {
							mbbc += '<label>'
							mbbc += '<i class="input_style checkbox_bg checkbox_bg_check"><input type="checkbox" checked="checked" name="q" value="' + i + '"></i> ' + data.data[i].ELE_NAME + ''
							mbbc += '</label>'
						}
					}
					mbbc += '</div>'
					mbbc += '<div class="kxysall">'
					mbbc += '<div class="allchecked">'
					mbbc += '<i class="input_style checkbox_bg checkbox_bg_check"><input type="checkbox" checked="checked" name="q" value="11"></i> 全选'
					mbbc += '</div>'
					mbbc += '</div>'
					mbbc += '</div>'
					mbbc += '</div>'
					mbbc += '<div class="mbms">'
					mbbc += '<p>模板描述：</p>'
					mbbc += '<textarea class="mbmstext"></textarea>'
					mbbc += '</div>'
					mbbc += '<div class="mbgjz" style="display:none">'
					mbbc += '<p>关键字：</p>'
					mbbc += '<select class="js-example-tokenizer " id="mobangjz" multiple="multiple">'
					//					for(i = 0; i < keywordss.data.length; i++) {
					//						mbbc += '<option>' + keywordss.data[i] + '</option>'
					//					}
					mbbc += '</select>'
					mbbc += '</div>'
					mbbc += '<div class="mbgx" style="display:none">'
					mbbc += '<p>共享：</p>'
					mbbc += '<div class="mbgxradio">'
					mbbc += '<label>'
					mbbc += '<i class="input_style radio_bg radio_bg_check"><input type="radio" name="hgx" value="0"  checked="checked"></i>'
					mbbc += '私有方案'
					mbbc += '</label>'
					mbbc += '<label>'
					mbbc += '<i class="input_style radio_bg"><input type="radio" name="hgx" value="1"></i>'
					mbbc += '本单位共享'
					mbbc += '</label>'
					mbbc += '<label>'
					mbbc += '<i class="input_style radio_bg"><input type="radio" name="hgx" value="2"></i>'
					mbbc += '全系统共享'
					mbbc += '</label>'
					mbbc += '</div>'
					mbbc += '</div>'
					mbbc += '</div>'
					mbbc += '<div class="moban-foot">'
					mbbc += '<div id="mbqr">确认</div>'
					mbbc += '<div id="mbclose">取消</div>'
					mbbc += '</div>'
					mbbc += '</div>'
					$("#zezhao").html(mbbc);
					$.inputStyle();
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
						rpt.mobanfz = $("#mobanfz").ufmaTreecombox({
							valueField: 'id',
							textField: 'groupName',
							leafRequire: false,
							readOnly: false,
							data: result.data,
							onchange:function(data){
								if(data.id !=rpt.nowAgencyCode && rpt.mobanagency!=undefined && rpt.mobanagency.getValue()!=undefined && rpt.mobanagency.getValue().split(',').length>1){
									ufma.showTip('多选单位时只可选择自有模板')
									rpt.mobanfz.val(rpt.nowAgencyCode)
								}
								if(rpt.mobanagency!=undefined){
									var mobanagencys = rpt.mobanagency.getValue().split(',')
									var nowagency = rpt.nowAgencyCode+'_'+rpt.nowAcctCode
									if($.inArray( nowagency, mobanagencys ) == -1 && data.id !=rpt.nowAgencyCode){
										ufma.showTip('共享到非本单位时只可选择自有模板')
										rpt.mobanfz.val(rpt.nowAgencyCode)
									}
								}
							}
						})
						rpt.mobanfz.val(rpt.nowAgencyCode)
					})
					ufma.get('/gl/vouTemp/getAgencyAcctTreeCopy?accsCode=' + page.accsCode + '&agencyCode=' + rpt.nowAgencyCode, '', function (result) {
						page.keyj = {}
						for(var i=0;i<result.data.length;i++){
							page.keyj[result.data[i].id]={
								agencyCode:result.data[i].pId,
								acctCode:result.data[i].code,
								accsCode:result.data[i].accsCode
							}
						}
						result.data.push({
							'id':'*',
							'codeName':'全部',
							'isLeaf':'0'
						})
						rpt.mobanagency = $("#mobanagency").ufmaTextboxlist({
							valueField: 'id',
							textField: 'codeName',
							name: 'name',
							leafRequire: true,
							data: result.data,
							onchange:function(data){
								$(".mbname .nofz").hide()
								if(rpt.mobanagency!=undefined){
									var mobanagencys = rpt.mobanagency.getValue().split(',')
									var nowagency = rpt.nowAgencyCode+'_'+rpt.nowAcctCode
									if(mobanagencys.length>1){
										rpt.mobanfz.val(rpt.nowAgencyCode)
										$(".mbname .nofz").show()
									}
									if($.inArray( nowagency, mobanagencys ) == -1){
										rpt.mobanfz.val(rpt.nowAgencyCode)
										$(".mbname .nofz").show()
									}
								}
							}
						})
						rpt.mobanagency.val(rpt.nowAgencyCode+'_'+rpt.nowAcctCode)
					})
				} else {
					ufma.showTip(data.msg, function () { }, "error");
				}
			},
			error: function () {
				ufma.showTip("连接失败，请检查网络", function () { }, "error");
			}
		});

	}

})
$(document).on("click", "#zezhao", function (e) {
	stopPropagation(e);
	//	$(this).hide();
})
$(document).on("click", "#moban", function (e) {
	stopPropagation(e);
})
$(document).on("click", "#mbclose", function (e) {
	if ($("#moban").attr("name") != undefined) {
		$("#zezhao").show();
		$("body").css("overflow", "hidden");
		var keywordss = new Object()
		$.ajax({
			type: "get",
			beforeSend: function(xhr) {
				xhr.setRequestHeader("x-function-id",voumenuid);
			},
			url: "/gl/vouTemp/getKW" + "?ajax=1&rueicode=" + hex_md5svUserCode,
			async: false,
			success: function (data) {
				keywordss = data;
			}
		});
		$.ajax({
			type: "get",
			beforeSend: function(xhr) {
				xhr.setRequestHeader("x-function-id",voumenuid);
			},
			url: "/gl/vouTemp/getTemps/" + rpt.nowAgencyCode + "/" + rpt.nowAcctCode + "?ajax=1&rueicode=" + hex_md5svUserCode,
			async: false,
			success: function (data) {
				if (data.flag == "success") {
					var mbcx = '';
					mbcx += '<div id="moban">'
					mbcx += '<div class="moban-head">'
					mbcx += '<p>凭证草稿</p>'
					mbcx += '<span class="mbclose">x</span>'
					mbcx += '</div>'
					mbcx += '<div class="moban-body">'
					mbcx += '<div class="srmbsearch">'
					mbcx += '<input type="text" name="" id="mobansearch" placeholder="请输入关键字" />'
					mbcx += '<div class="mbbtnsearch icon-search"></div>'
					mbcx += '</div>'
					/*
					mbcx += '<div class="srmbsearchtext">'
					mbcx += '<span class="">搜索记录：</span>'
					mbcx += '<a>财政</a>'
					mbcx += '<a>财务</a>'
					mbcx += '<a>个人</a>'
					mbcx += '<a>日常</a>'
					mbcx += '<a>期末</a>'
					mbcx += '</div>'
					*/
					mbcx += '<div class="mbtabheadall">'
					mbcx += '<div class="mbtabhead sed" name="0">草稿</div>'
					//			mbcx += '<div class="mbtabhead" name="1">单据业务<span>6</span></div>'
					mbcx += '</div>'
					mbcx += '<div class="mbtabsx">'
					if (keywordss.data.length >= 4) {
						for (var i = 0; i < 4; i++) {
							mbcx += '<a class="keywordss">' + keywordss.data[i] + '</a>'
						}
					} else if (keywordss.data.length != 0) {
						for (var i = 0; i < keywordss.data.length; i++) {
							mbcx += '<a class="keywordss">' + keywordss.data[i] + '</a>'
						}
					}
					mbcx += '</div>'
					mbcx += '<div class="mbtabbodyall">'
					mbcx += '<div class="mbtabbodyxz xz">'
					mbcx += '<span class="icon-plus"></span>'
					mbcx += '<p>新增凭证</p>'
					mbcx += '</div>'
					for (var i = 0; i < data.data.length; i++) {
						if (data.data[i].isTemp == "Y") {
							mbcx += '<div class="mbtabbody" names="' + data.data[i].templateGuid + '" name="' + data.data[i].vouGroupId + '" keyword="' + data.data[i].keyWord + '" inputor="' + data.data[i].inputor + '" description="' + data.data[i].description + '">'
							mbcx += '<span class="mbtabbody-head">' + data.data[i].templateName + '</span>'
							for (var k = 0; k < voukind.data.length; k++) {
								if (data.data[i].vouKind == voukind.data[k].ENU_CODE) {
									mbcx += '<span class="mbtabbody-lixin">' + voukind.data[k].ENU_NAME + '</span>'
								}
							}
							if (data.data[i].vouDesc != null) {
								mbcx += '<span class="mbtabbody-zaiyao">摘要：' + data.data[i].vouDesc + '</span>'
							} else {
								mbcx += '<span class="mbtabbody-zaiyao">摘要：</span>'
							}
							if (data.data[i].vouDetails.length >= 2) {
								if (data.data[i].vouDetails[0].drCr == undefined) {

								} else if (data.data[i].vouDetails[0].drCr == 1) {
									if (data.data[i].vouDetails[0].accoName != null) {
										mbcx += '<span class="mbtabbody-jie">借  ' + data.data[i].vouDetails[0].accoName + '</span>'
									} else {
										mbcx += '<span class="mbtabbody-jie">借  </span>'
									}
								} else {
									if (data.data[i].vouDetails[0].accoName != null) {
										mbcx += '<span class="mbtabbody-jie">贷  ' + data.data[i].vouDetails[0].accoName + '</span>'
									} else {
										mbcx += '<span class="mbtabbody-jie">贷  </span>'
									}
								}
								if (data.data[i].vouDetails[1].drCr == undefined) {

								} else if (data.data[i].vouDetails[1].drCr == 1) {
									if (data.data[i].vouDetails[1].accoName != null) {
										mbcx += '<span class="mbtabbody-dai">借  ' + data.data[i].vouDetails[1].accoName + '</span>'
									} else {
										mbcx += '<span class="mbtabbody-dai">借  </span>'
									}
								} else {
									if (data.data[i].vouDetails[1].accoName != null) {
										mbcx += '<span class="mbtabbody-dai">贷  ' + data.data[i].vouDetails[1].accoName + '</span>'
									} else {
										mbcx += '<span class="mbtabbody-dai">贷  </span>'
									}
								}
							} else if (data.data[i].vouDetails.length == 1) {
								if (data.data[i].vouDetails[0].drCr == undefined) {

								} else if (data.data[i].vouDetails[0].drCr == 1) {
									if (data.data[i].vouDetails[0].accoName != null) {
										mbcx += '<span class="mbtabbody-jie">借  ' + data.data[i].vouDetails[0].accoName + '</span>'
									} else {
										mbcx += '<span class="mbtabbody-jie">借 </span>'
									}
								} else {
									if (data.data[i].vouDetails[0].accoName != null) {
										mbcx += '<span class="mbtabbody-jie">贷  ' + data.data[i].vouDetails[0].accoName + '</span>'
									} else {
										mbcx += '<span class="mbtabbody-jie">贷  </span>'
									}
								}
							}
							//							mbcx += '<a class="icon-edit mbxiu"></a>'
							mbcx += '<a class="icon-trash mbdel"></a>'
							mbcx += '</div>'
						} else {
							mbcx += '<div class="mbtabbody" names="' + data.data[i].templateGuid + '" name="' + data.data[i].vouGroupId + '" keyword="' + data.data[i].keyWord + '" inputor="' + data.data[i].inputor + '" description="' + data.data[i].description + '">'
							mbcx += '<span class="mbtabbody-head">' + data.data[i].templateName + '</span>'
							mbcx += '<span class="mbtabbody-lixin" name="caogao">草稿</span>'
							if (data.data[i].vouDesc != null) {
								mbcx += '<span class="mbtabbody-zaiyao">摘要：' + data.data[i].vouDesc + '</span>'
							} else {
								mbcx += '<span class="mbtabbody-zaiyao">摘要：</span>'
							}
							if (data.data[i].vouDetails.length >= 2) {
								if (data.data[i].vouDetails[0].drCr == undefined) {

								} else if (data.data[i].vouDetails[0].drCr == 1) {
									if (data.data[i].vouDetails[0].accoName != null) {
										mbcx += '<span class="mbtabbody-jie">借  ' + data.data[i].vouDetails[0].accoName + '</span>'
									} else {
										mbcx += '<span class="mbtabbody-jie">借  </span>'
									}
								} else {
									if (data.data[i].vouDetails[0].accoName != null) {
										mbcx += '<span class="mbtabbody-jie">贷  ' + data.data[i].vouDetails[0].accoName + '</span>'
									} else {
										mbcx += '<span class="mbtabbody-jie">贷  </span>'
									}
								}
								if (data.data[i].vouDetails[1].drCr == undefined) {

								} else if (data.data[i].vouDetails[1].drCr == 1) {
									if (data.data[i].vouDetails[1].accoName != null) {
										mbcx += '<span class="mbtabbody-dai">借  ' + data.data[i].vouDetails[1].accoName + '</span>'
									} else {
										mbcx += '<span class="mbtabbody-dai">借  </span>'
									}
								} else {
									if (data.data[i].vouDetails[1].accoName != null) {
										mbcx += '<span class="mbtabbody-dai">贷  ' + data.data[i].vouDetails[1].accoName + '</span>'
									} else {
										mbcx += '<span class="mbtabbody-dai">贷  </span>'
									}
								}
							} else if (data.data[i].vouDetails.length == 1) {
								if (data.data[i].vouDetails[0].drCr == undefined) {

								} else if (data.data[i].vouDetails[0].drCr == 1) {
									if (data.data[i].vouDetails[0].accoName != null) {
										mbcx += '<span class="mbtabbody-jie">借  ' + data.data[i].vouDetails[0].accoName + '</span>'
									} else {
										mbcx += '<span class="mbtabbody-jie">借 </span>'
									}
								} else {
									if (data.data[i].vouDetails[0].accoName != null) {
										mbcx += '<span class="mbtabbody-jie">贷  ' + data.data[i].vouDetails[0].accoName + '</span>'
									} else {
										mbcx += '<span class="mbtabbody-jie">贷  </span>'
									}
								}
							}
							//							mbcx += '<a class="icon-edit mbxiu"></a>'
							mbcx += '<a class="icon-trash mbdel"></a>'
							mbcx += '</div>'
						}
					}
					mbcx += '</div>'
					mbcx += '<div class="moban-footer">'
					mbcx += '<p>没有找到您要查找的草稿？</p>'
					mbcx += '<p class="moban-footerp">请使用顶部的搜索框查找更多草稿</p>'
					mbcx += '</div>'
					mbcx += '</div>'
					mbcx += '</div>'
					$("#zezhao").html(mbcx);
					$(".mbtabbodyall").eq(0).show();
				} else {
					ufma.showTip(data.msg, function () { }, "error")
				}
			},
			error: function () {
				ufma.showTip("连接失败，请检查网络", function () { }, "error")
			}
		});
	} else {
		$("#zezhao").hide();
		$("body").css("overflow-y", "auto");
	}
})
$(document).on("click", ".mbclose", function (e) {
	$("#zezhao").hide();
	$("body").css("overflow-y", "auto");
})
$(document).on("click", ".allchecked .checkbox_bg", function () {
	if ($(this).hasClass("checkbox_bg_check")) {
		$(this).parents(".kxys").find(".kxyskx").find("input").attr("checked", true).prop("checked", true);
		$(this).parents(".kxys").find(".kxyskx").find(".checkbox_bg").addClass("checkbox_bg_check");
	} else {
		$(this).parents(".kxys").find(".kxyskx").find("input").attr("checked", false).prop("checked", false);
		$(this).parents(".kxys").find(".kxyskx").find(".checkbox_bg").removeClass("checkbox_bg_check");
	}
})

$(document).on("click", ".kxyskx .checkbox_bg", function () {
	if ($(this).hasClass("checkbox_bg_check") != true) {
		$(".allchecked .checkbox_bg").find("input").attr("checked", false).prop("checked", false);
		$(".allchecked .checkbox_bg").removeClass("checkbox_bg_check");
	} else {
		var n = true
		for (var i = 0; i < $('.kxyskx').find('.checkbox_bg').length; i++) {
			if ($('.kxyskx').find('.checkbox_bg').eq(i).hasClass("checkbox_bg_check") != true) {
				n = false
				break;
			}
		}
		if (n) {
			$(".allchecked .checkbox_bg").find("input").attr("checked", true).prop("checked", true);
			$(".allchecked .checkbox_bg").addClass("checkbox_bg_check");
		}
	}
})
$(document).on("click", "#mbqr", function (e) {
	if ($(this).hasClass("btn-disablesd") != true) {
		$(this).addClass("btn-disablesd")
		if ($(this).parents("#moban").attr("name") == undefined) {
			if ($(this).parents("#moban").find("#mobanmc").val() == "") {
				ufma.showTip("请输入模板名称", function () { }, "warning")
			} else {
				var mbdata = new Object();
				mbdata.templateName = $(this).parents("#moban").find("#mobanmc").val();
				mbdata.description = $(this).parents("#moban").find(".mbmstext").val();
				mbdata.shareLevel = $(this).parents("#moban").find(".radio_bg_check").find("input").attr("value");
				var mbdataarr = new Array();
				if ($(this).parents("#moban").find(".kxyskx").find(".checkbox_bg").eq(0).hasClass("checkbox_bg_check")) {
					mbdataarr.push("isSaveAMT:Y")
				} else {
					mbdataarr.push("isSaveAMT:N")
				}
				if ($(this).parents("#moban").find(".kxyskx").find(".checkbox_bg").eq(1).hasClass("checkbox_bg_check")) {
					mbdataarr.push("isSaveDescpt:Y")
				} else {
					mbdataarr.push("isSaveDescpt:N")
				}
				for (var i = 0; i < $(this).parents("#moban").find(".kxyskx").find(".checkbox_bg_check").length; i++) {
					if ($(this).parents("#moban").find(".kxyskx").find(".checkbox_bg_check").eq(i).find("input").attr("value") != "AMT" && $(this).parents("#moban").find(".kxyskx").find(".checkbox_bg_check").eq(i).find("input").attr("value") != "Descpt") {
						mbdataarr.push($(this).parents("#moban").find(".kxyskx").find(".checkbox_bg_check").eq(i).find("input").attr("value"))
					}
				}
				mbdata.accitemColumnLs = mbdataarr;
				mbdata.vouGroupId = $(".xuanzhongcy").attr("names");
				if (rpt.mobanfz.getValue() == '') {
					ufma.showTip("请选择分组", function () { }, "warning")
					return false;
				}
				mbdata.linkId = rpt.mobanfz.getValue();
				mbdata.agencyCode = rpt.nowAgencyCode
				mbdata.accsCode = page.accsCode
				mbdata.acctCode = rpt.nowAcctCode
				var jery = rpt.mobanagency.getValue().split(',')
				if (rpt.mobanagency.getValue().split(',').length==0) {
					ufma.showTip("请选择单位账套", function () { }, "warning")
					return false;
				}
				var allkey = []
				for(var i=0;i<jery.length;i++){
					if(!$.isNull(jery[i])){
						allkey.push(page.keyj[jery[i]])
					}
				}
				mbdata.otherAgencyAccts=allkey
				mbdata.isTemp = "Y"
				$.ajax({
					type: "post",
					beforeSend: function(xhr) {
						xhr.setRequestHeader("x-function-id",voumenuid);
					},
					url: "/gl/vouTemp/saveTemp" + "?ajax=1&rueicode=" + hex_md5svUserCode,
					async: false,
					data: JSON.stringify(mbdata),
					contentType: 'application/json; charset=utf-8',
					success: function (data) {
						if (data.flag == "success") {
							$("#zezhao").hide();
							$("body").css("overflow-y", "auto");
							ufma.showTip("保存成功", function () { }, "success");
						} else {
							ufma.showTip(data.msg, function () { }, "error")
						}
					},
					error: function () {
						ufma.showTip("保存失败", function () { }, "error");
					}
				});
			}
		} else {
			if ($(this).parents("#moban").find("#mobanmc").val() == "") {
				ufma.showTip("请输入模板名称", function () { }, "warning")
			} else {
				var mbdata = new Object();
				mbdata.templateName = $(this).parents("#moban").find("#mobanmc").val();
				mbdata.description = $(this).parents("#moban").find(".mbmstext").val();
				//				mbdata.kwLs = $(this).parents("#moban").find("#mobangjz").val();
				mbdata.shareLevel = $(this).parents("#moban").find(".radio_bg_check").find("input").attr("value");
				mbdata.templateGuid = $(this).parents("#moban").attr("name");
				mbdata.agencyCode = rpt.nowAgencyCode;
				mbdata.acctCode = rpt.nowAcctCode;
				$.ajax({
					type: "post",
					beforeSend: function(xhr) {
						xhr.setRequestHeader("x-function-id",voumenuid);
					},
					url: "/gl/vouTemp/saveTemp" + "?ajax=1&rueicode=" + hex_md5svUserCode,
					async: false,
					data: JSON.stringify(mbdata),
					contentType: 'application/json; charset=utf-8',
					success: function (data) {
						if (data.flag == "success") {
							$("#zezhao").hide();
							$("body").css("overflow-y", "auto");
							ufma.showTip("修改成功", function () { }, "success");
						} else {
							ufma.showTip(data.msg, function () { }, "error")
						}
					},
					error: function () {
						ufma.showTip("修改失败", function () { }, "error");
					}
				});
			}
		}

		$(this).removeClass("btn-disablesd")
	}
})
$(document).on("click", "#cgsr", function (e) {
	$("#zezhao").show();
	$("body").css("overflow", "hidden");
	var keywordss = [];
	$.ajax({
		type: "get",
		beforeSend: function(xhr) {
			xhr.setRequestHeader("x-function-id",voumenuid);
		},
		url: "/gl/vouTemp/getKW" + "?ajax=1&rueicode=" + hex_md5svUserCode,
		async: false,
		success: function (data) {
			keywordss = data.data;
		}
	});
	$.ajax({
		type: "get",
		beforeSend: function(xhr) {
			xhr.setRequestHeader("x-function-id",voumenuid);
		},
		url: "/gl/vouTemp/getTemps/" + rpt.nowAgencyCode + "/" + rpt.nowAcctCode + "?ajax=1&rueicode=" + hex_md5svUserCode,
		async: false,
		success: function (data) {
			if (data.flag == "success") {
				var mbcx = '';
				mbcx += '<div id="moban">'
				mbcx += '<div class="moban-head">'
				mbcx += '<p>凭证草稿</p>'
				mbcx += '<span class="mbclose">x</span>'
				mbcx += '</div>'
				mbcx += '<div class="moban-body">'
				mbcx += '<div class="srmbsearch">'
				mbcx += '<input type="text" name="" id="mobansearch" placeholder="请输入关键字" />'
				mbcx += '<div class="mbbtnsearch icon-search"></div>'
				mbcx += '</div>'

				mbcx += '<div class="mbtabheadall">'
				mbcx += '<div class="mbtabhead sed" name="0">草稿</div>'
				//			mbcx += '<div class="mbtabhead" name="1">单据业务<span>6</span></div>'
				mbcx += '</div>'
				mbcx += '<div class="mbtabsx">'
				if (keywordss.length >= 4) {
					for (var i = 0; i < 4; i++) {
						mbcx += '<a class="keywordss">' + keywordss[i] + '</a>'
					}
				} else if (keywordss.length != 0) {
					for (var i = 0; i < keywordss.length; i++) {
						mbcx += '<a class="keywordss">' + keywordss[i] + '</a>'
					}
				}
				mbcx += '</div>'
				mbcx += '<div class="mbtabbodyall">'
				mbcx += '<div class="mbtabbodyxz xz">'
				mbcx += '<span class="icon-plus"></span>'
				mbcx += '<p>新增凭证</p>'
				mbcx += '</div>'
				for (var i = 0; i < data.data.length; i++) {
					if (data.data[i].isTemp == "Y") {
						mbcx += '<div class="mbtabbody" names="' + data.data[i].templateGuid + '" name="' + data.data[i].vouGroupId + '" keyword="' + data.data[i].keyWord + '" inputor="' + data.data[i].inputor + '" description="' + data.data[i].description + '">'
						mbcx += '<span class="mbtabbody-head">' + data.data[i].templateName + '</span>'
						for (var k = 0; k < voukind.data.length; k++) {
							if (data.data[i].vouKind == voukind.data[k].ENU_CODE) {
								mbcx += '<span class="mbtabbody-lixin">' + voukind.data[k].ENU_NAME + '</span>'
							}
						}
						if (data.data[i].vouDesc != null) {
							mbcx += '<span class="mbtabbody-zaiyao">摘要：' + data.data[i].vouDesc + '</span>'
						} else {
							mbcx += '<span class="mbtabbody-zaiyao">摘要：</span>'
						}
						if (data.data[i].vouDetails.length >= 2) {
							if (data.data[i].vouDetails[0].drCr == undefined) {

							} else if (data.data[i].vouDetails[0].drCr == 1) {
								if (data.data[i].vouDetails[0].accoName != null) {
									mbcx += '<span class="mbtabbody-jie">借  ' + data.data[i].vouDetails[0].accoName + '</span>'
								} else {
									mbcx += '<span class="mbtabbody-jie">借  </span>'
								}
							} else {
								if (data.data[i].vouDetails[0].accoName != null) {
									mbcx += '<span class="mbtabbody-jie">贷  ' + data.data[i].vouDetails[0].accoName + '</span>'
								} else {
									mbcx += '<span class="mbtabbody-jie">贷  </span>'
								}
							}
							if (data.data[i].vouDetails[1].drCr == undefined) {

							} else if (data.data[i].vouDetails[1].drCr == 1) {
								if (data.data[i].vouDetails[1].accoName != null) {
									mbcx += '<span class="mbtabbody-dai">借  ' + data.data[i].vouDetails[1].accoName + '</span>'
								} else {
									mbcx += '<span class="mbtabbody-dai">借  </span>'
								}
							} else {
								if (data.data[i].vouDetails[1].accoName != null) {
									mbcx += '<span class="mbtabbody-dai">贷  ' + data.data[i].vouDetails[1].accoName + '</span>'
								} else {
									mbcx += '<span class="mbtabbody-dai">贷  </span>'
								}
							}
						} else if (data.data[i].vouDetails.length == 1) {
							if (data.data[i].vouDetails[0].drCr == undefined) {

							} else if (data.data[i].vouDetails[0].drCr == 1) {
								if (data.data[i].vouDetails[0].accoName != null) {
									mbcx += '<span class="mbtabbody-jie">借  ' + data.data[i].vouDetails[0].accoName + '</span>'
								} else {
									mbcx += '<span class="mbtabbody-jie">借 </span>'
								}
							} else {
								if (data.data[i].vouDetails[0].accoName != null) {
									mbcx += '<span class="mbtabbody-jie">贷  ' + data.data[i].vouDetails[0].accoName + '</span>'
								} else {
									mbcx += '<span class="mbtabbody-jie">贷  </span>'
								}
							}
						}

						//						mbcx += '<a class="icon-edit mbxiu"></a>'
						mbcx += '<a class="icon-trash mbdel"></a>'
						mbcx += '</div>'
					} else {
						mbcx += '<div class="mbtabbody" names="' + data.data[i].templateGuid + '" name="' + data.data[i].vouGroupId + '" keyword="' + data.data[i].keyWord + '" inputor="' + data.data[i].inputor + '" description="' + data.data[i].description + '">'
						mbcx += '<span class="mbtabbody-head">' + data.data[i].templateName + '</span>'
						mbcx += '<span class="mbtabbody-lixin" name="caogao">草稿</span>'
						if (data.data[i].vouDesc != null) {
							mbcx += '<span class="mbtabbody-zaiyao">摘要：' + data.data[i].vouDesc + '</span>'
						} else {
							mbcx += '<span class="mbtabbody-zaiyao">摘要：</span>'
						}
						if (data.data[i].vouDetails.length >= 2) {
							if (data.data[i].vouDetails[0].drCr == undefined) {

							} else if (data.data[i].vouDetails[0].drCr == 1) {
								if (data.data[i].vouDetails[0].accoName != null) {
									mbcx += '<span class="mbtabbody-jie">借  ' + data.data[i].vouDetails[0].accoName + '</span>'
								} else {
									mbcx += '<span class="mbtabbody-jie">借  </span>'
								}
							} else {
								if (data.data[i].vouDetails[0].accoName != null) {
									mbcx += '<span class="mbtabbody-jie">贷  ' + data.data[i].vouDetails[0].accoName + '</span>'
								} else {
									mbcx += '<span class="mbtabbody-jie">贷  </span>'
								}
							}
							if (data.data[i].vouDetails[1].drCr == undefined) {

							} else if (data.data[i].vouDetails[1].drCr == 1) {
								if (data.data[i].vouDetails[1].accoName != null) {
									mbcx += '<span class="mbtabbody-dai">借  ' + data.data[i].vouDetails[1].accoName + '</span>'
								} else {
									mbcx += '<span class="mbtabbody-dai">借  </span>'
								}
							} else {
								if (data.data[i].vouDetails[1].accoName != null) {
									mbcx += '<span class="mbtabbody-dai">贷  ' + data.data[i].vouDetails[1].accoName + '</span>'
								} else {
									mbcx += '<span class="mbtabbody-dai">贷  </span>'
								}
							}
						} else if (data.data[i].vouDetails.length == 1) {
							if (data.data[i].vouDetails[0].drCr == undefined) {

							} else if (data.data[i].vouDetails[0].drCr == 1) {
								if (data.data[i].vouDetails[0].accoName != null) {
									mbcx += '<span class="mbtabbody-jie">借  ' + data.data[i].vouDetails[0].accoName + '</span>'
								} else {
									mbcx += '<span class="mbtabbody-jie">借 </span>'
								}
							} else {
								if (data.data[i].vouDetails[0].accoName != null) {
									mbcx += '<span class="mbtabbody-jie">贷  ' + data.data[i].vouDetails[0].accoName + '</span>'
								} else {
									mbcx += '<span class="mbtabbody-jie">贷  </span>'
								}
							}
						}
						//						mbcx += '<a class="icon-edit mbxiu"></a>'
						mbcx += '<a class="icon-trash mbdel"></a>'
						mbcx += '</div>'
					}
				}
				mbcx += '</div>'
				mbcx += '<div class="moban-footer">'
				mbcx += '<p>没有找到您要查找的草稿？</p>'
				mbcx += '<p class="moban-footerp">请使用顶部的搜索框查找更多草稿</p>'
				mbcx += '</div>'
				mbcx += '</div>'
				mbcx += '</div>'
				$("#zezhao").html(mbcx);
				$(".mbtabbodyall").eq(0).show();
			} else {
				ufma.showTip(data.msg, function () { }, "error")
			}
		},
		error: function () {
			ufma.showTip("连接失败，请检查网络", function () { }, "error")
		}
	});
})
$(document).on("click", "#mbsr", function (e) {
	stopPropagation(e);
	var mbisChange = true
	for (var i = 0; i < $(".voucher-center").length; i++) {
		if ($(".voucher-center").eq(i).attr("op") != undefined && $(".voucher-center").eq(i).attr("op") != 3 && $(".voucher-center").eq(i).attr("namess") != undefined && selectdata.data.errFlag == 0 && selectdata.data.vouStatus == "O") {
			//				if()
			mbisChange = false;
		}
		if ($(".voucher-center").eq(i).attr("op") != undefined && $(".voucher-center").eq(i).attr("op") == 1 && $(".voucher-center").eq(i).attr("namess") == undefined) {
			mbisChange = false;
		}
	}
	ufma.open({
		url: 'vouModelAgy.html',
		title: "凭证模板",
		width: 1090,
		data: {
			agencyCode: rpt.nowAgencyCode,
			acctCode: rpt.nowAcctCode,
			setYear: ufgovkey.svSetYear,
			rgCode: ufgovkey.svRgCode,
			isParallel: rpt.isParallel,
			searchStr: searchmobandata,
			isChange: mbisChange,
			isaccfullname: isaccfullname
		},
		ondestory: function (result) {
			searchmobandata = ''
			if (result.title == true&& result.action == 'ok') {
				vouTemplateGuid = result.voutempSendList;

				if (!$.isNull(vouTemplateGuid)) {
					var frequencydata = {
						agencyCode:result.nodeAgency,
						acctCode:result.nodeAcctcode,
						vouGroupId:vouTemplateGuid,
						rgCode:ufgovkey.svRgCode,
						setYear:ufgovkey.svSetYear
					}
					ufma.ajax('/gl/vouTemp/upUseCount','post',frequencydata,function(data){})
					ufma.showloading('正在修改凭证，请耐心等待...');
					$.ajax({
						type: "get",
						beforeSend: function(xhr) {
							xhr.setRequestHeader("x-function-id",voumenuid);
						},
						url: "/gl/vouTemp/getTempPairFromVou/" + vouTemplateGuid + "/" + result.nodeAgency + "/" + result.nodeAcctcode + "/" + ufgovkey.svRgCode + "/" + ufgovkey.svSetYear + "?ajax=1&rueicode=" + hex_md5svUserCode,
						async: false,
						success: function (data) {
							if (data.flag == "success") {
								mobanneirong.data = data.data;
								selectdata.data = {};
								selectdata.data.vouDetails = [];
								quanjuvouchaiwu = {};
								quanjuvouyusuan = {};
								if (mobanneirong.data.cwVouTempVo != null && mobanneirong.data.cwVouTempVo != '') {
									quanjuvouchaiwu.vouDetails = mobanneirong.data.cwVouTempVo.vouDetails;
									quanjuvouchaiwu.vouTypeCode = mobanneirong.data.cwVouTempVo.vouTypeCode;
								} else {
									selectdata.data.accaCode = 2
									quanjuvouchaiwu = null;
								}
								if (mobanneirong.data.ysVouTempVo != null && mobanneirong.data.ysVouTempVo != '') {
									quanjuvouyusuan.vouDetails = mobanneirong.data.ysVouTempVo.vouDetails;
									quanjuvouyusuan.vouTypeCode = mobanneirong.data.ysVouTempVo.vouTypeCode;
								} else {
									selectdata.data.accaCode = 1
									quanjuvouyusuan = null;
								}
								if ((mobanneirong.data.cwVouTempVo != null && mobanneirong.data.ysVouTempVo != null) && (mobanneirong.data.cwVouTempVo != '' && mobanneirong.data.ysVouTempVo != '')) {
									if ($(".xuanzhongcy").hasClass("chaiwu")) {
										selectdata.data.vouDetails = mobanneirong.data.cwVouTempVo.vouDetails;
										selectdata.data.vouTypeCode = mobanneirong.data.cwVouTempVo.vouTypeCode;
									} else {
										selectdata.data.vouDetails = mobanneirong.data.ysVouTempVo.vouDetails;
										selectdata.data.vouTypeCode = mobanneirong.data.ysVouTempVo.vouTypeCode;
									}
								} else if (mobanneirong.data.cwVouTempVo != null && mobanneirong.data.cwVouTempVo != '') {
									selectdata.data.vouTypeCode = mobanneirong.data.cwVouTempVo.vouTypeCode
									selectdata.data.vouDetails = mobanneirong.data.cwVouTempVo.vouDetails;
								} else if (mobanneirong.data.ysVouTempVo != null && mobanneirong.data.ysVouTempVo != '') {
									selectdata.data.vouTypeCode = mobanneirong.data.ysVouTempVo.vouTypeCode
									selectdata.data.vouDetails = mobanneirong.data.ysVouTempVo.vouDetails;
								}
								if (vousinglepz == true || vousinglepzzy == true) {
									var vouDetailss = []
									if ((mobanneirong.data.cwVouTempVo != null && mobanneirong.data.ysVouTempVo != null) && (mobanneirong.data.cwVouTempVo != '' && mobanneirong.data.ysVouTempVo != '')) {
										selectdata.data.vouDetails = mobanneirong.data.cwVouTempVo.vouDetails;
										selectdata.data.vouTypeCode = mobanneirong.data.cwVouTempVo.vouTypeCode;
										for (var i = 0; i < mobanneirong.data.ysVouTempVo.vouDetails.length; i++) {
											selectdata.data.vouDetails.push(mobanneirong.data.ysVouTempVo.vouDetails[i])
										}
									}
								}
								for (var i = 0; i < selectdata.data.vouDetails.length; i++) {
									for (var z = 0; z < selectdata.data.vouDetails[i].vouDetailAsss.length; z++) {
										delete selectdata.data.vouDetails[i].vouDetailAsss[z].bussDate
									}
								}
								prevnextvoucher = -1;
								$(".xuanzhongcy").removeAttr("names");
								$("#fjd").val("");
								$("#pzzhuantai").hide().text("").removeAttr("vou-status");
								$(".voucher").remove();
								voucheralls();
								$("#zezhao").hide();
								$("body").css("overflow-y", "auto");
								chapz();
								if (optNoType == 0) {
									$("#sppz").removeAttr('vouno')
									MaxVouNoUp()
								}
								zhuantai();
								vouluru();
								$("#dates").getObj().setValue(result);
								if (mobanneirong.data.cwVouTempVo != null && mobanneirong.data.ysVouTempVo != null && rpt.isDoubleVou == 1 && rpt.isDoubleVou) {
									changeCWYS();
								}
								if (addindexiszy) {
								} else {
									$("#fjd").focus()
								}
								ufma.hideloading();
							}
						}
					})
				}
			} else if (result.title == false && result.action=="ok") {
				if (!isInputChange()) {
					ufma.showTip('当前凭证不可修改')
					return false;
				} else {
					vouTemplateGuid = result.voutempSendList;
					if (!$.isNull(vouTemplateGuid)) {
						var frequencydata = {
							agencyCode:result.nodeAgency,
							acctCode:result.nodeAcctcode,
							vouGroupId:vouTemplateGuid,
							rgCode:ufgovkey.svRgCode,
							setYear:ufgovkey.svSetYear
						}
						ufma.ajax('/gl/vouTemp/upUseCount','post',frequencydata,function(data){})
						ufma.showloading('正在修改凭证，请耐心等待...');
						$.ajax({
							type: "get",
							beforeSend: function(xhr) {
								xhr.setRequestHeader("x-function-id",voumenuid);
							},
							url: "/gl/vouTemp/getTempPairFromVou/" + vouTemplateGuid + "/" + result.nodeAgency + "/" + result.nodeAcctcode + "/" + ufgovkey.svRgCode + "/" + ufgovkey.svSetYear + "?ajax=1&rueicode=" + hex_md5svUserCode,
							async: false,
							success: function (data) {
								if (data.flag == "success") {
									mobanneirong.data = data.data;
									selectdata.data = huoqu('moban')
									var thisindex = selectdata.data.vouDetails.length
									if(voucherindex != 0){
										thisindex = voucherindex - 1
									}
									if (vousinglepz == true || vousinglepzzy == true) {
										if (mobanneirong.data.cwVouTempVo != null && mobanneirong.data.cwVouTempVo != '') {
											for (var i = 0; i < mobanneirong.data.cwVouTempVo.vouDetails.length; i++) {
												mobanneirong.data.cwVouTempVo.vouDetails[i].op = 1
												delete mobanneirong.data.cwVouTempVo.vouDetails[i].detailGuid
												delete mobanneirong.data.cwVouTempVo.vouDetails[i].vouGuid
												selectdata.data.vouDetails.splice(thisindex, 0, mobanneirong.data.cwVouTempVo.vouDetails[i])
												thisindex++
											}
										}
										if (mobanneirong.data.ysVouTempVo != null && mobanneirong.data.ysVouTempVo != '') {
											for (var i = 0; i < mobanneirong.data.ysVouTempVo.vouDetails.length; i++) {
												mobanneirong.data.ysVouTempVo.vouDetails[i].op = 1
												delete mobanneirong.data.ysVouTempVo.vouDetails[i].detailGuid
												delete mobanneirong.data.ysVouTempVo.vouDetails[i].vouGuid
												selectdata.data.vouDetails.splice(thisindex, 0, mobanneirong.data.ysVouTempVo.vouDetails[i])
												thisindex++
											}
										}
									} else {
										if (mobanneirong.data.cwVouTempVo != null && mobanneirong.data.cwVouTempVo != '') {
											for (var i = 0; i < mobanneirong.data.cwVouTempVo.vouDetails.length; i++) {
												mobanneirong.data.cwVouTempVo.vouDetails[i].op = 1
												delete mobanneirong.data.cwVouTempVo.vouDetails[i].detailGuid
												delete mobanneirong.data.cwVouTempVo.vouDetails[i].vouGuid
												quanjuvouchaiwu.vouDetails.push(mobanneirong.data.cwVouTempVo.vouDetails[i])
											}
										}
										if (mobanneirong.data.ysVouTempVo != null && mobanneirong.data.ysVouTempVo != '') {
											for (var i = 0; i < mobanneirong.data.ysVouTempVo.vouDetails.length; i++) {
												mobanneirong.data.ysVouTempVo.vouDetails[i].op = 1
												delete mobanneirong.data.ysVouTempVo.vouDetails[i].detailGuid
												delete mobanneirong.data.ysVouTempVo.vouDetails[i].vouGuid
												quanjuvouyusuan.vouDetails.push(mobanneirong.data.ysVouTempVo.vouDetails[i])
											}
										}
										if ($(".xuanzhongcy").hasClass("chaiwu")) {
											if (mobanneirong.data.cwVouTempVo != null && mobanneirong.data.cwVouTempVo != '') {
												for (var i = 0; i < mobanneirong.data.cwVouTempVo.vouDetails.length; i++) {
													mobanneirong.data.cwVouTempVo.vouDetails[i].op = 1
													delete mobanneirong.data.cwVouTempVo.vouDetails[i].detailGuid
													delete mobanneirong.data.cwVouTempVo.vouDetails[i].vouGuid
													selectdata.data.vouDetails.splice(thisindex, 0, mobanneirong.data.cwVouTempVo.vouDetails[i])
													thisindex++
												}
											}
										} else {
											if (mobanneirong.data.ysVouTempVo != null && mobanneirong.data.ysVouTempVo != '') {
												for (var i = 0; i < mobanneirong.data.ysVouTempVo.vouDetails.length; i++) {
													mobanneirong.data.ysVouTempVo.vouDetails[i].op = 1
													delete mobanneirong.data.ysVouTempVo.vouDetails[i].detailGuid
													delete mobanneirong.data.ysVouTempVo.vouDetails[i].vouGuid
													selectdata.data.vouDetails.splice(thisindex, 0, mobanneirong.data.ysVouTempVo.vouDetails[i])
													thisindex++
												}
											}
										}

									}
									for (var i = 0; i < selectdata.data.vouDetails.length; i++) {
										if(selectdata.data.vouDetails[i]!=undefined && selectdata.data.vouDetails[i].vouDetailAsss!=undefined){
											for (var z = 0; z < selectdata.data.vouDetails[i].vouDetailAsss.length; z++) {
												delete selectdata.data.vouDetails[i].vouDetailAsss[z].bussDate
												if(selectdata.data.vouDetails[i].detailGuid==undefined){
													delete selectdata.data.vouDetails[i].vouDetailAsss[z].detailAssGuid
													delete selectdata.data.vouDetails[i].vouDetailAsss[z].detailGuid
													delete selectdata.data.vouDetails[i].vouDetailAsss[z].vouGuid
												}
											}
										}
									}
									chapz();
									zhuantai();
									if (mobanneirong.data.cwVouTempVo != null && mobanneirong.data.ysVouTempVo != null && rpt.isDoubleVou == 1 && rpt.isDoubleVou) {
										changeCWYS();
									}
									ufma.hideloading();
								}
							}
						})
					}
				}
			}
		}
	});
})
//智能模板，演示用，不知道干啥的，，
$(document).on("click", "#mbsrcom", function (e) {
})
$(document).on("click", ".mbtabhead", function () {
	$(".mbtabhead").removeClass("sed");
	$(this).addClass("sed")
})
$(document).on("click", ".mbtabhead", function () {
	var na = $(this).attr("name");
	$(".mbtabbodyall").hide();
	$(".mbtabbodyall").eq(na).show();
})

var mobanneirong = new Object();
$(document).on("click", ".mbtabbody", function () {
	if ($(this).find(".mbtabbody-lixin").attr("name") != undefined) {
		//草稿
		var templateGuid = $(this).attr("name");
		templateGuidindex = $(this).index();
		$.ajax({
			type: "get",
			beforeSend: function(xhr) {
				xhr.setRequestHeader("x-function-id",voumenuid);
			},
			url: "/gl/vouTemp/getTemp/" + templateGuid + "?ajax=1&rueicode=" + hex_md5svUserCode,
			async: false,
			success: function (data) {
				if (data.flag == "success") {
					upadd()
					dataforcwys(data.data)
					$("#zezhao").hide();
					$("#zezhao").html("");
					cwyspd();
					chapz();
					zhuantai();
					$("#sppz").removeAttr('vouno')
					MaxVouNoUp();
					if (quanjuvouyusuan != null && quanjuvouchaiwu != null) {
						if ($(".yusuan").hasClass('xuanzhongcy')) {
							$(".chaiwu").trigger('click');
							var timeId = setTimeout(function () {
								$(".yusuan").trigger('click');
								clearTimeout(timeId);
							}, 300);
						} else if ($(".chaiwu").hasClass('xuanzhongcy')) {
							$(".yusuan").trigger('click');
							var timeId = setTimeout(function () {
								$(".chaiwu").trigger('click');
								clearTimeout(timeId);
							}, 300);
						}
					}
					if (selectdata.data.vouDate != ufgovkey.svTransDate) {
						ufma.confirm('草稿日期为"' + selectdata.data.vouDate + '"，当前系统日期为"' + ufgovkey.svTransDate + '"，是否要修改为当前系统日期”', function (action) {
							if (action) {
								if (quanjuvouyusuan != null && quanjuvouchaiwu != null) {
									if ($(".yusuan").hasClass('xuanzhongcy')) {
										quanjuvouchaiwu.vouDate = ufgovkey.svTransDate
									} else if ($(".chaiwu").hasClass('xuanzhongcy')) {
										quanjuvouyusuan.vouDate = ufgovkey.svTransDate
									}
								}
								$("#dates").getObj().setValue(ufgovkey.svTransDate)
								MaxVouNoUp();
							}
						})
					}
					if (addindexiszy) {
					} else {
						$("#fjd").focus()
					}
					$(".voucher-head").attr("tenamess", selectdata.data.templateGuid);
				} else {
					ufma.showTip(data.msg, function () { }, "error");
				}
			},
			error: function () {
				ufma.showTip("未获取数据", function () { }, "error");
			}
		})
	} else {
		//模版
		var vouGroupId = $(this).attr("name");
		templateGuidindex = $(this).index();
		$.ajax({
			type: "get",
			beforeSend: function(xhr) {
				xhr.setRequestHeader("x-function-id",voumenuid);
			},
			url: "/gl/vouTemp/getTempPair/" + vouGroupId + "?ajax=1&rueicode=" + hex_md5svUserCode,
			async: false,
			success: function (data) {
				if (data.flag == "success") {
					mobanneirong.data = data.data;
					var srmbmobalnr = '';
					srmbmobalnr += '<div class="srmbmobal" name="' + templateGuidindex + '">'
					srmbmobalnr += '<div class="srmbmoballeft icon-angle-left"></div>'
					srmbmobalnr += '<div class="srmbmobalright  icon-angle-right"></div>'
					srmbmobalnr += '<div class="srmbmobalbody">'
					srmbmobalnr += '<span class="icon-close srmbmobalbodyclose"></span>'
					srmbmobalnr += '<div class="srmbmobalbodyleft">'
					if (data.data.cwVouTempVo != null) {
						srmbmobalnr += '<div class="srmbmobalbodyleft-cw">'
						srmbmobalnr += '<p class="srmbmobalbodyleft-cwhead">财务会计</p>'
						if (data.data.cwVouTempVo.vouDesc != null) {
							srmbmobalnr += '<p class="srmbmobalbodyleft-zhai">摘要：' + data.data.cwVouTempVo.vouDesc + '</p>'
						} else {
							srmbmobalnr += '<p class="srmbmobalbodyleft-zhai">摘要：</p>'
						}
						if (data.data.cwVouTempVo.vouDetails.length > 4) {
							for (var i = 0; i < 4; i++) {
								if (data.data.cwVouTempVo.vouDetails[i].drCr == 1) {
									srmbmobalnr += '<p class="srmbmobalbodyleft-jie">借 ' + data.data.cwVouTempVo.vouDetails[i].accoName + '</p>'
								} else {
									srmbmobalnr += '<p class="srmbmobalbodyleft-dai">贷 ' + data.data.cwVouTempVo.vouDetails[i].accoName + '</p>'
								}
							}
						} else {
							for (var i = 0; i < data.data.cwVouTempVo.vouDetails.length; i++) {
								if (data.data.cwVouTempVo.vouDetails[i].drCr == 1) {
									srmbmobalnr += '<p class="srmbmobalbodyleft-jie">借 ' + data.data.cwVouTempVo.vouDetails[i].accoName + '</p>'
								} else {
									srmbmobalnr += '<p class="srmbmobalbodyleft-dai">贷 ' + data.data.cwVouTempVo.vouDetails[i].accoName + '</p>'
								}
							}
						}
						srmbmobalnr += '</div>'
					}
					if (data.data.ysVouTempVo != null) {
						srmbmobalnr += '<div class="srmbmobalbodyleft-yu">'
						srmbmobalnr += '<p class="srmbmobalbodyleft-yuhead">预算会计</p>'
						if (data.data.ysVouTempVo.vouDesc != null) {
							srmbmobalnr += '<p class="srmbmobalbodyleft-zhai">摘要：' + data.data.ysVouTempVo.vouDesc + '</p>'
						} else {
							srmbmobalnr += '<p class="srmbmobalbodyleft-zhai">摘要：</p>'
						}
						if (data.data.ysVouTempVo.vouDetails.length > 4) {
							for (var i = 0; i < 4; i++) {
								if (data.data.ysVouTempVo.vouDetails[i].drCr == 1) {
									srmbmobalnr += '<p class="srmbmobalbodyleft-jie">借 ' + data.data.ysVouTempVo.vouDetails[i].accoName + '</p>'
								} else {
									srmbmobalnr += '<p class="srmbmobalbodyleft-dai">贷 ' + data.data.ysVouTempVo.vouDetails[i].accoName + '</p>'
								}
							}
						} else {
							for (var i = 0; i < data.data.ysVouTempVo.vouDetails.length; i++) {
								if (data.data.ysVouTempVo.vouDetails[i].drCr == 1) {
									srmbmobalnr += '<p class="srmbmobalbodyleft-jie">借 ' + data.data.ysVouTempVo.vouDetails[i].accoName + '</p>'
								} else {
									srmbmobalnr += '<p class="srmbmobalbodyleft-dai">贷 ' + data.data.ysVouTempVo.vouDetails[i].accoName + '</p>'
								}
							}
						}
						srmbmobalnr += '</div>'
					}
					srmbmobalnr += '</div>'
					srmbmobalnr += '<div class="srmbmobalbody-head">'
					srmbmobalnr += '<span style="float:left;">凭证模板：</span>'
					if (data.data.cwVouTempVo != null) {
						srmbmobalnr += '<span class="srmbmobalbody-head-body">' + mobanneirong.data.cwVouTempVo.templateName + '</span>'
						for (var i = 0; i < voukind.data.length; i++) {
							if (mobanneirong.data.cwVouTempVo.vouKind == voukind.data[i].ENU_CODE) {
								srmbmobalnr += '<span class="srmbmobalbody-head-sx">' + voukind.data[i].ENU_NAME + '</span>'
							}
						}
						srmbmobalnr += '</div>'
						srmbmobalnr += '<div class="srmbmobalbody-tgz">提供者：' + mobanneirong.data.cwVouTempVo.inputorName + '</div>'
						srmbmobalnr += '<div class="srmbmobalbody-cs">' + mobanneirong.data.cwVouTempVo.description + '</div>'
					} else {
						srmbmobalnr += '<span class="srmbmobalbody-head-body">' + mobanneirong.data.ysVouTempVo.vouDesc + '</span>'
						for (var i = 0; i < voukind.data.length; i++) {
							if (mobanneirong.data.ysVouTempVo.vouKind == voukind.data[i].ENU_CODE) {
								srmbmobalnr += '<span class="srmbmobalbody-head-sx">' + voukind.data[i].ENU_NAME + '</span>'
							}
						}
						srmbmobalnr += '</div>'
						srmbmobalnr += '<div class="srmbmobalbody-tgz">提供者：' + mobanneirong.data.ysVouTempVo.inputorName + '</div>'
						srmbmobalnr += '<div class="srmbmobalbody-cs">' + mobanneirong.data.ysVouTempVo.description + '</div>'
					}
					srmbmobalnr += '<div class="srmbmobalbody-xz">'
					srmbmobalnr += '请选择凭证模板的加载方式：'
					srmbmobalnr += '</div>'
					if (data.data.ysVouTempVo != null) {
						if (data.data.ysVouTempVo.isTemp == "N") {
							srmbmobalnr += '<a class="srmbmobalbody-new disable">草稿无法直接使用</a>'
						} else {
							srmbmobalnr += '<a class="srmbmobalbody-new">加载到新凭证</a>'
							srmbmobalnr += '<a class="srmbmobalbody-old">完全覆盖当前凭证</a>'
							srmbmobalnr += '<a class="srmbmobalbody-newold">插到当前光标分录行后</a> '
						}
					} else if (data.data.cwVouTempVo != null) {
						if (data.data.cwVouTempVo.isTemp == "N") {
							srmbmobalnr += '<a class="srmbmobalbody-new disable">草稿无法直接使用</a>'
						} else {
							srmbmobalnr += '<a class="srmbmobalbody-new">加载到新凭证</a>'
							srmbmobalnr += '<a class="srmbmobalbody-old">完全覆盖当前凭证</a>'
							srmbmobalnr += '<a class="srmbmobalbody-newold">插到当前光标分录行后</a> '
						}
					}
					srmbmobalnr += '</div>'
					srmbmobalnr += '</div>'
					$("#moban").append(srmbmobalnr);
					$(".srmbmobal").show();
				} else {
					ufma.showTip(data.msg, function () { }, "error");
				}
			},
			error: function () {
				ufma.showTip("未获取数据", function () { }, "error");
			}
		})
	}
});
$(document).on("click", ".mbdel", function (e) {
	stopPropagation(e);
	var vouGroupId = $(this).parents(".mbtabbody").attr("name");
	var _this = $(this);
	var allcys = {
		"vouGroupIds": [vouGroupId],
		'agencyCode': rpt.nowAgencyCode
	}
	if (!$.isNull(vouGroupId)) {
		ufma.post('/gl/vouTemp/delelteVouDraft', allcys, function (data) {
			if (data.flag == "success") {
				_this.parents(".mbtabbody").hide();
				ufma.showTip(data.msg, function () { }, "success");
			} else {
				ufma.showTip(data.msg, function () { }, "error");
			}
		})
	} else {
		var templateGuidss = $(this).parents(".mbtabbody").attr("names");
		$.ajax({
			type: "get",
			beforeSend: function(xhr) {
				xhr.setRequestHeader("x-function-id",voumenuid);
			},
			url: "/gl/vouTemp/delVouTem/" + templateGuidss + "?ajax=1&rueicode=" + hex_md5svUserCode,
			async: false,
			success: function (data) {
				if (data.flag == "success") {
					_this.parents(".mbtabbody").hide();
				} else {
					ufma.showTip(data.msg, function () { }, "error");
				}
			},
			error: function () {
				ufma.showTip("连接失败，请检查网络", function () { }, "error");
			}
		});
	}

})
$(document).on("click", ".mbxiu", function (e) {
	var vouGroupId = $(this).parents(".mbtabbody").attr("name");
	var templateGuid = $(this).parents(".mbtabbody").attr("names");
	var mbneirong = new Object();
	var keywordss = new Object()
	$.ajax({
		type: "get",
		beforeSend: function(xhr) {
			xhr.setRequestHeader("x-function-id",voumenuid);
		},
		url: "/gl/vouTemp/getKW" + "?ajax=1&rueicode=" + hex_md5svUserCode,
		async: false,
		success: function (data) {
			if (data.flag == "success") {
				keywordss = data;
			} else {
				ufma.showTip(data.msg, function () { }, "error");
			}
		},
		error: function () {
			ufma.showTip("失败，请检查网络", function () { }, "error")
		}
	});
	$.ajax({
		type: "get",
		beforeSend: function(xhr) {
			xhr.setRequestHeader("x-function-id",voumenuid);
		},
		url: "/gl/vouTemp/getTemp/" + templateGuid + "?ajax=1&rueicode=" + hex_md5svUserCode,
		async: false,
		success: function (data) {
			if (data.flag == "success") {
				mbneirong = data;
			} else {
				ufma.showTip(data.msg, function () { }, "error");
			}
		},
		error: function () {
			ufma.showTip("失败，请检查网络", function () { }, "error");
		}
	})
	stopPropagation(e);
	var mbbc = '';
	mbbc += '<div id="moban" name="' + templateGuid + '">'
	mbbc += '<div class="moban-head">'
	mbbc += '<p>保存凭证模板</p>'
	mbbc += '<span class="mbclose">x</span>'
	mbbc += '</div>'
	mbbc += '<div class="moban-body">'
	mbbc += '<div class="mbname">'
	mbbc += '<p>共享单位：</p>'
	mbbc += '<div id="mobanagency" style="margin-left:8px;" class="ufma-textboxlist w210"></div>'
	mbbc += '<p>模板分组：</p>'
	mbbc += '<div class="nofz"></div>'
	mbbc += '<div id="mobanfz" class="uf-treecombox w210 ufma-combox"></div>'
	mbbc += '<p>模板名称：</p>'
	mbbc += '<input type="text" name="mobanmc" id="mobanmc" placeholder="请输入" />'
	mbbc += '</div>'
	mbbc += '<div class="mbcheck">'
	mbbc += '<p>可选要素：</p>'
	mbbc += '<div class="kxys">'
	mbbc += '<div class="kxyskx">'
	mbbc += '<label style="width:100%;">'
	mbbc += '已经选定的的要素不能被修改'
	mbbc += '</label>'
	mbbc += '</div>'
	mbbc += '<div class="kxysall">'
	mbbc += '</div>'
	mbbc += '</div>'
	mbbc += '</div>'
	mbbc += '<div class="mbms">'
	mbbc += '<p>模板描述：</p>'
	mbbc += '<textarea class="mbmstext"></textarea>'
	mbbc += '</div>'
	mbbc += '<div class="mbgjz">'
	mbbc += '<p>关键字：</p>'
	mbbc += '<select class="js-example-tokenizer " id="mobangjz" multiple="multiple">'
	for (i = 0; i < keywordss.data.length; i++) {
		mbbc += '<option>' + keywordss.data[i] + '</option>'
	}
	mbbc += '</select>'
	mbbc += '</div>'
	mbbc += '<div class="mbgx">'
	mbbc += '<p>共享：</p>'
	mbbc += '<div class="mbgxradio">'
	mbbc += '<label>'
	mbbc += '<i class="input_style radio_bg"><input type="radio" name="hgx" value="0"></i>'
	mbbc += '私有方案'
	mbbc += '</label>'
	mbbc += '<label>'
	mbbc += '<i class="input_style radio_bg"><input type="radio" name="hgx" value="1"></i>'
	mbbc += '本单位共享'
	mbbc += '</label>'
	mbbc += '<label>'
	mbbc += '<i class="input_style radio_bg"><input type="radio" name="hgx" value="2"></i>'
	mbbc += '全系统共享'
	mbbc += '</label>'
	mbbc += '</div>'
	mbbc += '</div>'
	mbbc += '</div>'
	mbbc += '<div class="moban-foot">'
	mbbc += '<div id="mbqr">确认</div>'
	mbbc += '<div id="mbclose">取消</div>'
	mbbc += '</div>'
	mbbc += '</div>'
	$("#zezhao").html(mbbc);
	$.inputStyle();
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
		rpt.mobanfz = $("#mobanfz").ufmaTreecombox({
			valueField: 'id',
			textField: 'groupName',
			leafRequire: false,
			readOnly: false,
			data: result.data,
			onchange:function(data){
				if(data.id !=rpt.nowAgencyCode && rpt.mobanagency!=undefined && rpt.mobanagency.getValue().split(',').length>1){
					ufma.showTip('多选单位时只可选择自有模板')
					rpt.mobanfz.val(rpt.nowAgencyCode)
				}
				if(rpt.mobanagency!=undefined){
					var mobanagencys = rpt.mobanagency.getValue().split(',')
					var nowagency = rpt.nowAgencyCode+'_'+rpt.nowAcctCode
					if($.inArray( nowagency, mobanagencys ) == -1 && data.id !=rpt.nowAgencyCode){
						ufma.showTip('共享到非本单位时只可选择自有模板')
						rpt.mobanfz.val(rpt.nowAgencyCode)
					}
				}
			}
		})
		rpt.mobanfz.val(rpt.nowAgencyCode)
	})
	ufma.get('/gl/vouTemp/getAgencyAcctTreeCopy?accsCode=' + page.accsCode + '&agencyCode=' + rpt.nowAgencyCode, '', function (result) {
		page.keyj = {}
		for(var i=0;i<result.data.length;i++){
			page.keyj[result.data[i].id]={
				agencyCode:result.data[i].pId,
				acctCode:result.data[i].code,
				accsCode:result.data[i].accsCode
			}
		}
		result.data.push({
			'id':'*',
			'codeName':'全部',
			'isLeaf':'0'
		})
		rpt.mobanagency = $("#mobanagency").ufmaTextboxlist({
			valueField: 'id',
			textField: 'codename',
			leafRequire: true,
			readOnly: false,
			data: result.data,
			onchange:function(data){
				$(".mbname .nofz").hide()
				if(rpt.mobanagency!=undefined){
					var mobanagencys = rpt.mobanagency.getValue().split(',')
					var nowagency = rpt.nowAgencyCode+'_'+rpt.nowAcctCode
					if(mobanagencys.length>1){
						rpt.mobanfz.val(rpt.nowAgencyCode)
						$(".mbname .nofz").show()
					}
					if($.inArray( nowagency, mobanagencys ) == -1){
						rpt.mobanfz.val(rpt.nowAgencyCode)
						$(".mbname .nofz").show()
					}
				}
			}
		})
		rpt.mobanagency.val(rpt.nowAgencyCode+'_'+rpt.nowAcctCode)
	})
	$("#mobanmc").val(mbneirong.data.templateName);
	$(".mbmstext").val(mbneirong.data.description);
	//	$("#mobangjz").val(mbneirong.data.kwLs).trigger('change');
	for (var i = 0; i < $("#moban").find(".radio_bg").length; i++) {
		if (mbneirong.data.shareLevel == $("#moban").find(".radio_bg").eq(i).find("input").attr("value")) {
			$("#moban").find(".radio_bg").eq(i).addClass("radio_bg_check");
			$("#moban").find(".radio_bg").eq(i).find("input").prop('checked', true);
		}
	}
})
$(document).on("click", ".srmbmobalbodyclose", function () {
	$(this).parents(".srmbmobal").remove();
})
$(document).on("click", ".srmbmoballeft", function () {
	var srmbmobalname = $(this).parents(".srmbmobal").attr("name");
	if (srmbmobalname - 2 >= 0) {
		//		mbtabbody-lixin
		var vouGroupId = $(this).parents("#moban").find(".mbtabbodyall").find(".mbtabbody").eq(srmbmobalname - 2).attr("name");
		_this = $(this);
		$.ajax({
			type: "get",
			beforeSend: function(xhr) {
				xhr.setRequestHeader("x-function-id",voumenuid);
			},
			url: "/gl/vouTemp/getTempPair/" + vouGroupId + "?ajax=1&rueicode=" + hex_md5svUserCode,
			async: false,
			success: function (data) {
				if (data.flag == "success") {
					mobanneirong.data = data.data;
					var srmbmobalnr = '';
					srmbmobalnr += '<div class="srmbmobalbody">'
					srmbmobalnr += '<span class="icon-close srmbmobalbodyclose"></span>'
					srmbmobalnr += '<div class="srmbmobalbodyleft">'
					if (data.data.cwVouTempVo != null) {
						srmbmobalnr += '<div class="srmbmobalbodyleft-cw">'
						srmbmobalnr += '<p class="srmbmobalbodyleft-cwhead">财务会计</p>'
						if (data.data.cwVouTempVo.vouDesc != null) {
							srmbmobalnr += '<p class="srmbmobalbodyleft-zhai">摘要：' + data.data.cwVouTempVo.vouDesc + '</p>'
						} else {
							srmbmobalnr += '<p class="srmbmobalbodyleft-zhai">摘要：</p>'
						}
						if (data.data.cwVouTempVo.vouDetails.length > 4) {
							for (var i = 0; i < 4; i++) {
								if (data.data.cwVouTempVo.vouDetails[i].drCr == 1) {
									srmbmobalnr += '<p class="srmbmobalbodyleft-jie">借 ' + data.data.cwVouTempVo.vouDetails[i].accoName + '</p>'
								} else {
									srmbmobalnr += '<p class="srmbmobalbodyleft-dai">贷 ' + data.data.cwVouTempVo.vouDetails[i].accoName + '</p>'
								}
							}
						} else {
							for (var i = 0; i < data.data.cwVouTempVo.vouDetails.length; i++) {
								if (data.data.cwVouTempVo.vouDetails[i].drCr == 1) {
									srmbmobalnr += '<p class="srmbmobalbodyleft-jie">借 ' + data.data.cwVouTempVo.vouDetails[i].accoName + '</p>'
								} else {
									srmbmobalnr += '<p class="srmbmobalbodyleft-dai">贷 ' + data.data.cwVouTempVo.vouDetails[i].accoName + '</p>'
								}
							}
						}
						srmbmobalnr += '</div>'
					}
					if (data.data.ysVouTempVo != null) {
						srmbmobalnr += '<div class="srmbmobalbodyleft-yu">'
						srmbmobalnr += '<p class="srmbmobalbodyleft-yuhead">预算会计</p>'
						if (data.data.ysVouTempVo.vouDesc != null) {
							srmbmobalnr += '<p class="srmbmobalbodyleft-zhai">摘要：' + data.data.ysVouTempVo.vouDesc + '</p>'
						} else {
							srmbmobalnr += '<p class="srmbmobalbodyleft-zhai">摘要：</p>'
						}
						if (data.data.ysVouTempVo.vouDetails.length > 4) {
							for (var i = 0; i < 4; i++) {
								if (data.data.ysVouTempVo.vouDetails[i].drCr == 1) {
									srmbmobalnr += '<p class="srmbmobalbodyleft-jie">借 ' + data.data.ysVouTempVo.vouDetails[i].accoName + '</p>'
								} else {
									srmbmobalnr += '<p class="srmbmobalbodyleft-dai">贷 ' + data.data.ysVouTempVo.vouDetails[i].accoName + '</p>'
								}
							}
						} else {
							for (var i = 0; i < data.data.ysVouTempVo.vouDetails.length; i++) {
								if (data.data.ysVouTempVo.vouDetails[i].drCr == 1) {
									srmbmobalnr += '<p class="srmbmobalbodyleft-jie">借 ' + data.data.ysVouTempVo.vouDetails[i].accoName + '</p>'
								} else {
									srmbmobalnr += '<p class="srmbmobalbodyleft-dai">贷 ' + data.data.ysVouTempVo.vouDetails[i].accoName + '</p>'
								}
							}
						}
						srmbmobalnr += '</div>'
					}
					srmbmobalnr += '</div>'
					srmbmobalnr += '<div class="srmbmobalbody-head">'
					srmbmobalnr += '<span style="float:left;">凭证模板：</span>'
					if (data.data.cwVouTempVo != null) {
						srmbmobalnr += '<span class="srmbmobalbody-head-body">' + mobanneirong.data.cwVouTempVo.templateName + '</span>'
						for (var i = 0; i < voukind.data.length; i++) {
							if (mobanneirong.data.cwVouTempVo.vouKind == voukind.data[i].ENU_CODE) {
								srmbmobalnr += '<span class="srmbmobalbody-head-sx">' + voukind.data[i].ENU_NAME + '</span>'
							}
						}
						srmbmobalnr += '</div>'
						srmbmobalnr += '<div class="srmbmobalbody-tgz">提供者：' + mobanneirong.data.cwVouTempVo.inputorName + '</div>'
						srmbmobalnr += '<div class="srmbmobalbody-cs">' + mobanneirong.data.cwVouTempVo.description + '</div>'
					} else {
						srmbmobalnr += '<span class="srmbmobalbody-head-body">' + mobanneirong.data.ysVouTempVo.vouDesc + '</span>'
						for (var i = 0; i < voukind.data.length; i++) {
							if (mobanneirong.data.ysVouTempVo.vouKind == voukind.data[i].ENU_CODE) {
								srmbmobalnr += '<span class="srmbmobalbody-head-sx">' + voukind.data[i].ENU_NAME + '</span>'
							}
						}
						srmbmobalnr += '</div>'
						srmbmobalnr += '<div class="srmbmobalbody-tgz">提供者：' + mobanneirong.data.ysVouTempVo.inputorName + '</div>'
						srmbmobalnr += '<div class="srmbmobalbody-cs">' + mobanneirong.data.ysVouTempVo.description + '</div>'
					}
					srmbmobalnr += '<div class="srmbmobalbody-xz">'
					srmbmobalnr += '请选择凭证模板的加载方式：'
					srmbmobalnr += '</div>'
					if (data.data.ysVouTempVo != null) {
						if (data.data.ysVouTempVo.isTemp == "N") {
							srmbmobalnr += '<a class="srmbmobalbody-new disable">草稿无法直接使用</a>'
						} else {
							srmbmobalnr += '<a class="srmbmobalbody-new">加载到新凭证</a>'
							srmbmobalnr += '<a class="srmbmobalbody-old">完全覆盖当前凭证</a>'
							srmbmobalnr += '<a class="srmbmobalbody-newold">插到当前光标分录行后</a> '
						}
					} else if (data.data.cwVouTempVo != null) {
						if (data.data.cwVouTempVo.isTemp == "N") {
							srmbmobalnr += '<a class="srmbmobalbody-new disable">草稿无法直接使用</a>'
						} else {
							srmbmobalnr += '<a class="srmbmobalbody-new">加载到新凭证</a>'
							srmbmobalnr += '<a class="srmbmobalbody-old">完全覆盖当前凭证</a>'
							srmbmobalnr += '<a class="srmbmobalbody-newold">插到当前光标分录行后</a> '
						}
					}
					srmbmobalnr += '</div>'
					_this.parents(".srmbmobal").find(".srmbmobalbody").remove();
					_this.parents(".srmbmobal").attr("name", parseFloat(_this.parents(".srmbmobal").attr("name")) - 1)
					_this.parents(".srmbmobal").append(srmbmobalnr);
					//			$(".srmbmobal").show();
				} else {
					ufma.showTip(data.msg, function () { }, "error");
				}

			},
			error: function () {
				ufma.showTip("未获取数据，请检查网络", function () { }, "error");
			}
		})
	} else {
		ufma.showTip("已经到第一模板", function () { }, "error")
	}
})
$(document).on("click", ".srmbmobalright", function () {
	var srmbmobalname = $(this).parents(".srmbmobal").attr("name");
	if (srmbmobalname < $(this).parents("#moban").find(".mbtabbodyall").find(".mbtabbody").length) {
		var vouGroupId = $(this).parents("#moban").find(".mbtabbodyall").find(".mbtabbody").eq(srmbmobalname).attr("name");
		_this = $(this);
		$.ajax({
			type: "get",
			beforeSend: function(xhr) {
				xhr.setRequestHeader("x-function-id",voumenuid);
			},
			url: "/gl/vouTemp/getTempPair/" + vouGroupId + "?ajax=1&rueicode=" + hex_md5svUserCode,
			async: false,
			success: function (data) {
				if (data.flag == "success") {
					mobanneirong.data = data.data;
					var srmbmobalnr = '';
					srmbmobalnr += '<div class="srmbmobalbody">'
					srmbmobalnr += '<span class="icon-close srmbmobalbodyclose"></span>'
					srmbmobalnr += '<div class="srmbmobalbodyleft">'
					if (data.data.cwVouTempVo != null) {
						srmbmobalnr += '<div class="srmbmobalbodyleft-cw">'
						srmbmobalnr += '<p class="srmbmobalbodyleft-cwhead">财务会计</p>'
						if (data.data.cwVouTempVo.vouDesc != null) {
							srmbmobalnr += '<p class="srmbmobalbodyleft-zhai">摘要：' + data.data.cwVouTempVo.vouDesc + '</p>'
						} else {
							srmbmobalnr += '<p class="srmbmobalbodyleft-zhai">摘要：</p>'
						}
						if (data.data.cwVouTempVo.vouDetails.length > 4) {
							for (var i = 0; i < 4; i++) {
								if (data.data.cwVouTempVo.vouDetails[i].drCr == 1) {
									srmbmobalnr += '<p class="srmbmobalbodyleft-jie">借 ' + data.data.cwVouTempVo.vouDetails[i].accoName + '</p>'
								} else {
									srmbmobalnr += '<p class="srmbmobalbodyleft-dai">贷 ' + data.data.cwVouTempVo.vouDetails[i].accoName + '</p>'
								}
							}
						} else {
							for (var i = 0; i < data.data.cwVouTempVo.vouDetails.length; i++) {
								if (data.data.cwVouTempVo.vouDetails[i].drCr == 1) {
									srmbmobalnr += '<p class="srmbmobalbodyleft-jie">借 ' + data.data.cwVouTempVo.vouDetails[i].accoName + '</p>'
								} else {
									srmbmobalnr += '<p class="srmbmobalbodyleft-dai">贷 ' + data.data.cwVouTempVo.vouDetails[i].accoName + '</p>'
								}
							}
						}
						srmbmobalnr += '</div>'
					}
					if (data.data.ysVouTempVo != null) {
						srmbmobalnr += '<div class="srmbmobalbodyleft-yu">'
						srmbmobalnr += '<p class="srmbmobalbodyleft-yuhead">预算会计</p>'
						if (data.data.ysVouTempVo.vouDesc != null) {
							srmbmobalnr += '<p class="srmbmobalbodyleft-zhai">摘要：' + data.data.ysVouTempVo.vouDesc + '</p>'
						} else {
							srmbmobalnr += '<p class="srmbmobalbodyleft-zhai">摘要：</p>'
						}
						if (data.data.ysVouTempVo.vouDetails.length > 4) {
							for (var i = 0; i < 4; i++) {
								if (data.data.ysVouTempVo.vouDetails[i].drCr == 1) {
									srmbmobalnr += '<p class="srmbmobalbodyleft-jie">借 ' + data.data.ysVouTempVo.vouDetails[i].accoName + '</p>'
								} else {
									srmbmobalnr += '<p class="srmbmobalbodyleft-dai">贷 ' + data.data.ysVouTempVo.vouDetails[i].accoName + '</p>'
								}
							}
						} else {
							for (var i = 0; i < data.data.ysVouTempVo.vouDetails.length; i++) {
								if (data.data.ysVouTempVo.vouDetails[i].drCr == 1) {
									srmbmobalnr += '<p class="srmbmobalbodyleft-jie">借 ' + data.data.ysVouTempVo.vouDetails[i].accoName + '</p>'
								} else {
									srmbmobalnr += '<p class="srmbmobalbodyleft-dai">贷 ' + data.data.ysVouTempVo.vouDetails[i].accoName + '</p>'
								}
							}
						}
						srmbmobalnr += '</div>'
					}
					srmbmobalnr += '</div>'
					srmbmobalnr += '<div class="srmbmobalbody-head">'
					srmbmobalnr += '<span style="float:left;">凭证模板：</span>'
					if (data.data.cwVouTempVo != null) {
						srmbmobalnr += '<span class="srmbmobalbody-head-body">' + mobanneirong.data.cwVouTempVo.templateName + '</span>'
						for (var i = 0; i < voukind.data.length; i++) {
							if (mobanneirong.data.cwVouTempVo.vouKind == voukind.data[i].ENU_CODE) {
								srmbmobalnr += '<span class="srmbmobalbody-head-sx">' + voukind.data[i].ENU_NAME + '</span>'
							}
						}
						srmbmobalnr += '</div>'
						srmbmobalnr += '<div class="srmbmobalbody-tgz">提供者：' + mobanneirong.data.cwVouTempVo.inputorName + '</div>'
						srmbmobalnr += '<div class="srmbmobalbody-cs">' + mobanneirong.data.cwVouTempVo.description + '</div>'
					} else {
						srmbmobalnr += '<span class="srmbmobalbody-head-body">' + mobanneirong.data.ysVouTempVo.vouDesc + '</span>'
						for (var i = 0; i < voukind.data.length; i++) {
							if (mobanneirong.data.ysVouTempVo.vouKind == voukind.data[i].ENU_CODE) {
								srmbmobalnr += '<span class="srmbmobalbody-head-sx">' + voukind.data[i].ENU_NAME + '</span>'
							}
						}
						srmbmobalnr += '</div>'
						srmbmobalnr += '<div class="srmbmobalbody-tgz">提供者：' + mobanneirong.data.ysVouTempVo.inputorName + '</div>'
						srmbmobalnr += '<div class="srmbmobalbody-cs">' + mobanneirong.data.ysVouTempVo.description + '</div>'
					}
					srmbmobalnr += '<div class="srmbmobalbody-xz">'
					srmbmobalnr += '请选择凭证模板的加载方式：'
					srmbmobalnr += '</div>'
					if (data.data.ysVouTempVo != null) {
						if (data.data.ysVouTempVo.isTemp == "N") {
							srmbmobalnr += '<a class="srmbmobalbody-new disable">草稿无法直接使用</a>'
						} else {
							srmbmobalnr += '<a class="srmbmobalbody-new">加载到新凭证</a>'
							srmbmobalnr += '<a class="srmbmobalbody-old">完全覆盖当前凭证</a>'
							srmbmobalnr += '<a class="srmbmobalbody-newold">插到当前光标分录行后</a> '
						}
					} else if (data.data.cwVouTempVo != null) {
						if (data.data.cwVouTempVo.isTemp == "N") {
							srmbmobalnr += '<a class="srmbmobalbody-new disable">草稿无法直接使用</a>'
						} else {
							srmbmobalnr += '<a class="srmbmobalbody-new">加载到新凭证</a>'
							srmbmobalnr += '<a class="srmbmobalbody-old">完全覆盖当前凭证</a>'
							srmbmobalnr += '<a class="srmbmobalbody-newold">插到当前光标分录行后</a> '
						}
					}
					srmbmobalnr += '</div>'
					_this.parents(".srmbmobal").find(".srmbmobalbody").remove();
					_this.parents(".srmbmobal").attr("name", parseFloat(_this.parents(".srmbmobal").attr("name")) + 1)
					_this.parents(".srmbmobal").append(srmbmobalnr);
					//			$(".srmbmobal").show();
				} else {
					ufma.showTip(data.msg, function () { }, "error");
				}
			},
			error: function () {
				ufma.showTip("未获取数据", function () { }, "error");
			}
		})
	} else {
		ufma.showTip("已经到最后一张模板", function () { }, "error")
	}

})
$(document).on("click", ".srmbmobalbody-new", function () {
	if ($(this).hasClass("disable")) {

	} else {
		selectdata.data = {};
		quanjuvouchaiwu = {};
		quanjuvouyusuan = {};
		if (mobanneirong.data.cwVouTempVo != null) {
			quanjuvouchaiwu.vouDetails = mobanneirong.data.cwVouTempVo.vouDetails;
			quanjuvouchaiwu.vouTypeCode = mobanneirong.data.cwVouTempVo.vouTypeCode;
		} else {
			selectdata.data.accaCode = 2
			quanjuvouchaiwu = null;
		}
		if (mobanneirong.data.ysVouTempVo != null) {
			quanjuvouyusuan.vouDetails = mobanneirong.data.ysVouTempVo.vouDetails;
			quanjuvouyusuan.vouTypeCode = mobanneirong.data.ysVouTempVo.vouTypeCode;
		} else {
			selectdata.data.accaCode = 1
			quanjuvouyusuan = null;
		}
		if (mobanneirong.data.cwVouTempVo != null && mobanneirong.data.ysVouTempVo != null) {
			if ($(".xuanzhongcy").hasClass("chaiwu")) {
				selectdata.data.vouDetails = mobanneirong.data.cwVouTempVo.vouDetails;
				selectdata.data.vouTypeCode = mobanneirong.data.cwVouTempVo.vouTypeCode;
			} else {
				selectdata.data.vouDetails = mobanneirong.data.ysVouTempVo.vouDetails;
				selectdata.data.vouTypeCode = mobanneirong.data.ysVouTempVo.vouTypeCode;
			}
		} else if (mobanneirong.data.cwVouTempVo != null) {
			selectdata.data.vouTypeCode = mobanneirong.data.cwVouTempVo.vouTypeCode
			selectdata.data.vouDetails = mobanneirong.data.cwVouTempVo.vouDetails;
		} else if (mobanneirong.data.ysVouTempVo != null) {
			selectdata.data.vouTypeCode = mobanneirong.data.ysVouTempVo.vouTypeCode
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
		$("#dates").getObj().setValue(result);
		if (mobanneirong.data.cwVouTempVo != null && mobanneirong.data.ysVouTempVo != null) {
			changeCWYS();
		}
	}

})

function changeCWYS() {
	$(".yusuan").trigger('click');
	var timeId = setTimeout(function () {
		$(".chaiwu").trigger('click');
		clearTimeout(timeId);
	}, 300);
}
$(document).on("click", ".srmbmobalbody-old", function () {
	ufma.confirm('这将会清除您当前的内容，确定要继续吗', function (action) {
		if (action) {
			if ($(".voucher-head").attr("namess") == undefined) {
				selectdata.data = {};
				quanjuvouchaiwu = {};
				quanjuvouyusuan = {};
				if (mobanneirong.data.cwVouTempVo != null) {
					quanjuvouchaiwu.vouDetails = mobanneirong.data.cwVouTempVo.vouDetails;
					quanjuvouchaiwu.vouTypeCode = mobanneirong.data.cwVouTempVo.vouTypeCode;
				} else {
					selectdata.data.accaCode = 2
					quanjuvouchaiwu = null;
				}
				if (mobanneirong.data.ysVouTempVo != null) {
					quanjuvouyusuan.vouDetails = mobanneirong.data.ysVouTempVo.vouDetails;
					quanjuvouyusuan.vouTypeCode = mobanneirong.data.ysVouTempVo.vouTypeCode;
				} else {
					selectdata.data.accaCode = 1
					quanjuvouyusuan = null;
				}
				if (mobanneirong.data.cwVouTempVo != null && mobanneirong.data.ysVouTempVo != null) {
					if ($(".xuanzhongcy").hasClass("chaiwu")) {
						selectdata.data.vouDetails = mobanneirong.data.cwVouTempVo.vouDetails;
						selectdata.data.vouTypeCode = mobanneirong.data.cwVouTempVo.vouTypeCode;
					} else {
						selectdata.data.vouDetails = mobanneirong.data.ysVouTempVo.vouDetails;
						selectdata.data.vouTypeCode = mobanneirong.data.ysVouTempVo.vouTypeCode;
					}
				} else if (mobanneirong.data.cwVouTempVo == null) {
					selectdata.data.vouDetails = mobanneirong.data.ysVouTempVo.vouDetails;
					selectdata.data.vouTypeCode = mobanneirong.data.ysVouTempVo.vouTypeCode;
				} else if (mobanneirong.data.ysVouTempVo == null) {
					selectdata.data.vouDetails = mobanneirong.data.cwVouTempVo.vouDetails;
					selectdata.data.vouTypeCode = mobanneirong.data.cwVouTempVo.vouTypeCode;
				}
				prevnextvoucher = -1;
				$(".voucherhe").find("#sppz").val("*");
				$("#fjd").val("");
				$("#pzzhuantai").hide().text("").removeAttr("vou-status");
				cwyspd();
				$(".voucher").remove();
				voucheralls()
				$("#zezhao").hide();
				$("body").css("overflow-y", "auto");
				chapz();
				zhuantai();
				$("#dates").getObj().setValue(result);
			} else {
				if (selectdata.data.vouStatus == "O") {
					if (mobanneirong.data.cwVouTempVo != null && mobanneirong.data.ysVouTempVo != null) {
						if (quanjuvouchaiwu != null) {
							if (quanjuvouchaiwu.vouDetails != undefined) {
								for (var i = 0; i < quanjuvouchaiwu.vouDetails.length; i++) {
									quanjuvouchaiwu.vouDetails[i].op = 2
								}
								for (var i = 0; i < mobanneirong.data.cwVouTempVo.vouDetails.length; i++) {
									quanjuvouchaiwu.vouDetails.push(mobanneirong.data.cwVouTempVo.vouDetails[i])
									quanjuvouchaiwu.vouTypeCode = mobanneirong.data.cwVouTempVo.vouTypeCode;
								}
								quanjuvouchaiwu.vouTypeCode = mobanneirong.data.cwVouTempVo.vouTypeCode;
							}
						}
						if (quanjuvouyusuan != null) {
							if (quanjuvouyusuan.vouDetails != undefined) {
								for (var i = 0; i < quanjuvouyusuan.vouDetails.length; i++) {
									quanjuvouyusuan.vouDetails[i].op = 2
								}
								for (var i = 0; i < mobanneirong.data.ysVouTempVo.vouDetails.length; i++) {
									quanjuvouyusuan.vouDetails.push(mobanneirong.data.ysVouTempVo.vouDetails[i])
								}
								quanjuvouyusuan.vouTypeCode = mobanneirong.data.ysVouTempVo.vouTypeCode;
							}

						}
					} else if (mobanneirong.data.cwVouTempVo == null) {
						if (quanjuvouyusuan != null) {
							if (quanjuvouyusuan.vouDetails != undefined) {
								for (var i = 0; i < quanjuvouyusuan.vouDetails.length; i++) {
									quanjuvouyusuan.vouDetails[i].op = 2
								}
								for (var i = 0; i < mobanneirong.data.ysVouTempVo.vouDetails.length; i++) {
									quanjuvouyusuan.vouDetails.push(mobanneirong.data.ysVouTempVo.vouDetails[i])
								}
								quanjuvouyusuan.vouTypeCode = mobanneirong.data.ysVouTempVo.vouTypeCode;
							}

						}

					} else if (mobanneirong.data.ysVouTempVo == null) {
						if (quanjuvouchaiwu != null) {
							if (quanjuvouchaiwu.vouDetails != undefined) {
								for (var i = 0; i < quanjuvouchaiwu.vouDetails.length; i++) {
									quanjuvouchaiwu.vouDetails[i].op = 2
								}
								for (var i = 0; i < mobanneirong.data.cwVouTempVo.vouDetails.length; i++) {
									quanjuvouchaiwu.vouDetails.push(mobanneirong.data.cwVouTempVo.vouDetails[i])
								}
								quanjuvouchaiwu.vouTypeCode = mobanneirong.data.cwVouTempVo.vouTypeCode;
							}
						}
					}
					if ($(".xuanzhongcy").hasClass("chaiwu")) {
						selectdata.data = quanjuvouchaiwu;
					} else {
						selectdata.data = quanjuvouyusuan;
					}
					cwyspd();
					$(".voucher").remove();
					voucheralls()
					$("#zezhao").hide();
					$("body").css("overflow-y", "auto");
					chapz();
					zhuantai();
					var vclen = 0;
					for (var i = 0; i < $(".voucher-center").length; i++) {
						if ($(".voucher-center").eq(i).hasClass("deleteclass")) {
							vclen += 1;
						}
					}
					var mobanjiahang = 4 - $(".voucher-center").length + vclen;
					if (mobanjiahang > 0) {
						for (var i = 0; i < mobanjiahang; i++) {
							$(".voucher-footer").before(tr());
							$(".voucherall").height($(".voucherall").height() + 50)

						}
					}
					var zclen = 0;
					for (var i = 0; i < $(".voucher-center").length; i++) {
						if ($(".voucher-center").eq(i).hasClass("deleteclass")) {
							zclen += 1;
						}
					}
					var cjlen = $(".voucher-center").length - zclen - 4
					$(".voucherall").height(573 + 50 * cjlen)

					$("#pzzhuantai").hide();
					voubiaoji();
					fixedabsulate()
				} else {
					ufma.showTip("已经审核/记账/作废的凭证无法修改", function () { }, "warning")
				}
			}
			bidui();
			if (mobanneirong.data.cwVouTempVo != null && mobanneirong.data.ysVouTempVo != null) {
				changeCWYS();
			}
		}
	});

})
$(document).on("click", ".srmbmobalbody-newold", function () {
	if ($(".voucher-head").attr("namess") != undefined) {
		if (selectdata.data.vouStatus == "O") {
			selectdata.data = {};
			if (mobanneirong.data.cwVouTempVo != null && mobanneirong.data.ysVouTempVo != null) {
				if (quanjuvouchaiwu != null) {
					if (quanjuvouchaiwu.vouDetails != undefined) {
						for (var i = 0; i < mobanneirong.data.cwVouTempVo.vouDetails.length; i++) {
							quanjuvouchaiwu.vouDetails.push(mobanneirong.data.cwVouTempVo.vouDetails[i])
						}
					}
				}
				if (quanjuvouyusuan != null) {
					if (quanjuvouyusuan.vouDetails != undefined) {
						for (var i = 0; i < mobanneirong.data.ysVouTempVo.vouDetails.length; i++) {
							quanjuvouyusuan.vouDetails.push(mobanneirong.data.ysVouTempVo.vouDetails[i])
						}
					}

				}
			} else if (mobanneirong.data.cwVouTempVo == null) {
				if (quanjuvouyusuan != null) {
					if (quanjuvouyusuan.vouDetails != undefined) {
						for (var i = 0; i < mobanneirong.data.ysVouTempVo.vouDetails.length; i++) {
							quanjuvouyusuan.vouDetails.push(mobanneirong.data.ysVouTempVo.vouDetails[i])
						}
					}

				}

			} else if (mobanneirong.data.ysVouTempVo == null) {
				if (quanjuvouchaiwu != null) {
					if (quanjuvouchaiwu.vouDetails != undefined) {
						for (var i = 0; i < mobanneirong.data.cwVouTempVo.vouDetails.length; i++) {
							quanjuvouchaiwu.vouDetails.push(mobanneirong.data.cwVouTempVo.vouDetails[i])
						}
					}
				}
			}
			if ($(".xuanzhongcy").hasClass("chaiwu")) {
				selectdata.data = quanjuvouchaiwu;
			} else {
				selectdata.data = quanjuvouyusuan;
			}
			cwyspd();
			$(".voucher").remove();
			voucheralls()
			$("#zezhao").hide();
			$("body").css("overflow-y", "auto");
			chapz();
			zhuantai();
			//			}
			bidui();
			$("#pzzhuantai").hide();
			voubiaoji();
		} else {
			ufma.showTip("已经审核/记账/作废的凭证无法修改", function () { }, "warning")
		}
	} else {
		selectdata.data = {};
		//		if($(".xuanzhongcy").hasClass("chaiwu")) {
		quanjuvouchaiwu = huoqu();
		//		} else {
		quanjuvouyusuan = huoqu();
		//		}
		if (mobanneirong.data.cwVouTempVo != null && mobanneirong.data.ysVouTempVo != null) {
			if (quanjuvouchaiwu != null) {
				if (quanjuvouchaiwu.vouDetails != undefined) {
					for (var i = 0; i < mobanneirong.data.cwVouTempVo.vouDetails.length; i++) {
						quanjuvouchaiwu.vouDetails.push(mobanneirong.data.cwVouTempVo.vouDetails[i])
					}
				}
			}
			if (quanjuvouyusuan != null) {
				if (quanjuvouyusuan.vouDetails != undefined) {
					for (var i = 0; i < mobanneirong.data.ysVouTempVo.vouDetails.length; i++) {
						quanjuvouyusuan.vouDetails.push(mobanneirong.data.ysVouTempVo.vouDetails[i])
					}
				}

			}
		} else if (mobanneirong.data.cwVouTempVo == null) {
			if (quanjuvouyusuan != null) {
				if (quanjuvouyusuan.vouDetails != undefined) {
					for (var i = 0; i < mobanneirong.data.ysVouTempVo.vouDetails.length; i++) {
						quanjuvouyusuan.vouDetails.push(mobanneirong.data.ysVouTempVo.vouDetails[i])
					}
				}

			}

		} else if (mobanneirong.data.ysVouTempVo == null) {
			if (quanjuvouchaiwu != null) {
				if (quanjuvouchaiwu.vouDetails != undefined) {
					for (var i = 0; i < mobanneirong.data.cwVouTempVo.vouDetails.length; i++) {
						quanjuvouchaiwu.vouDetails.push(mobanneirong.data.cwVouTempVo.vouDetails[i])
					}
				}
			}
		}
		if ($(".xuanzhongcy").hasClass("chaiwu")) {
			selectdata.data = quanjuvouchaiwu;
		} else {
			selectdata.data = quanjuvouyusuan;
		}
		cwyspd();
		$(".voucher").remove();
		voucheralls()
		$("#zezhao").hide();
		$("body").css("overflow-y", "auto");
		chapz();
		zhuantai();
		//			}
		bidui();
	}
	if (mobanneirong.data.cwVouTempVo != null && mobanneirong.data.ysVouTempVo != null) {
		changeCWYS();
	}
})

$(document).on("click", ".keywordss", function () {
	for (var i = 0; i < $(".mbtabbodyall").find(".mbtabbody").length; i++) {
		var tempStr = $(".mbtabbodyall").find(".mbtabbody").eq(i).attr("keyword");
		var bool = tempStr.indexOf($(this).text());
		if (bool >= 0) {
			$(".mbtabbodyall").find(".mbtabbody").eq(i).show();
		} else {
			$(".mbtabbodyall").find(".mbtabbody").eq(i).hide();
		}
	}

})
$(document).on("keydown", "#mobansearch", function (event) {
	event = event || window.event;
	if (event.keyCode == 13) {
		if ($(this).val() == "") {
			for (var i = 0; i < $(".mbtabbodyall").find(".mbtabbody").length; i++) {
				$(".mbtabbodyall").find(".mbtabbody").eq(i).show();
			}
		} else {
			//			alert(1);
			for (var i = 0; i < $(".mbtabbodyall").find(".mbtabbody").length; i++) {
				var tempStr = $(".mbtabbodyall").find(".mbtabbody").eq(i).attr("keyword");
				var tempStr1 = $(".mbtabbodyall").find(".mbtabbody").eq(i).attr("inputor");
				var tempStr2 = $(".mbtabbodyall").find(".mbtabbody").eq(i).attr("description");
				var tempStr3 = $(".mbtabbodyall").find(".mbtabbody").eq(i).find(".mbtabbody-head").text();
				var tempStr4 = $(".mbtabbodyall").find(".mbtabbody").eq(i).find(".mbtabbody-lixin").text();
				var tempStr5 = $(".mbtabbodyall").find(".mbtabbody").eq(i).find(".mbtabbody-zaiyao").text();
				var tempStr6 = $(".mbtabbodyall").find(".mbtabbody").eq(i).find(".mbtabbody-jie").text();
				var tempStr7 = $(".mbtabbodyall").find(".mbtabbody").eq(i).find(".mbtabbody-dai").text();
				var bool = tempStr.indexOf($(this).val());
				var bool1 = tempStr1.indexOf($(this).val());
				var bool2 = tempStr2.indexOf($(this).val());
				var bool3 = tempStr3.indexOf($(this).val());
				var bool4 = tempStr4.indexOf($(this).val());
				var bool5 = tempStr5.indexOf($(this).val());
				var bool6 = tempStr6.indexOf($(this).val());
				var bool7 = tempStr7.indexOf($(this).val());
				if (bool >= 0 || bool1 >= 0 || bool2 >= 0 || bool3 >= 0 || bool4 >= 0 || bool5 >= 0 || bool6 >= 0 || bool7 >= 0) {
					$(".mbtabbodyall").find(".mbtabbody").eq(i).show();
				} else {
					$(".mbtabbodyall").find(".mbtabbody").eq(i).hide();
				}
			}
		}
	}

})
$(document).on("click", ".mbbtnsearch", function () {
	if ($("#mbbtnsearch").val() == "") {
		for (var i = 0; i < $(".mbtabbodyall").find(".mbtabbody").length; i++) {
			$(".mbtabbodyall").find(".mbtabbody").eq(i).show();
		}
	} else {
		for (var i = 0; i < $(".mbtabbodyall").find(".mbtabbody").length; i++) {
			var tempStr = $(".mbtabbodyall").find(".mbtabbody").eq(i).attr("keyword");
			var tempStr1 = $(".mbtabbodyall").find(".mbtabbody").eq(i).attr("inputor");
			var tempStr2 = $(".mbtabbodyall").find(".mbtabbody").eq(i).attr("description");
			var tempStr3 = $(".mbtabbodyall").find(".mbtabbody").eq(i).find(".mbtabbody-head").text();
			var tempStr4 = $(".mbtabbodyall").find(".mbtabbody").eq(i).find(".mbtabbody-lixin").text();
			var tempStr5 = $(".mbtabbodyall").find(".mbtabbody").eq(i).find(".mbtabbody-zaiyao").text();
			var tempStr6 = $(".mbtabbodyall").find(".mbtabbody").eq(i).find(".mbtabbody-jie").text();
			var tempStr7 = $(".mbtabbodyall").find(".mbtabbody").eq(i).find(".mbtabbody-dai").text();
			var bool = tempStr.indexOf($("#mobansearch").val());
			var bool1 = tempStr1.indexOf($("#mobansearch").val());
			var bool2 = tempStr2.indexOf($("#mobansearch").val());
			var bool3 = tempStr3.indexOf($("#mobansearch").val());
			var bool4 = tempStr4.indexOf($("#mobansearch").val());
			var bool5 = tempStr5.indexOf($("#mobansearch").val());
			var bool6 = tempStr6.indexOf($("#mobansearch").val());
			var bool7 = tempStr7.indexOf($("#mobansearch").val());
			if (bool >= 0 || bool1 >= 0 || bool2 >= 0 || bool3 >= 0 || bool4 >= 0 || bool5 >= 0 || bool6 >= 0 || bool7 >= 0) {
				$(".mbtabbodyall").find(".mbtabbody").eq(i).show();
			} else {
				$(".mbtabbodyall").find(".mbtabbody").eq(i).hide();
			}
		}
	}
})