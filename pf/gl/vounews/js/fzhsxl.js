//获取辅助关联关系
function selectItem(dom,index,inputdom) {
//	var index = $('.assCheck').eq(0).parent(".ycbody").prevAll(".ycbody").length-1;
	var nameCode = $('.assCheck').parents(".voucher-yc-bo").siblings(".voucher-yc-bt").find(".ychead").eq(index).attr("name");
	var nameName = $('.assCheck').parents(".voucher-yc-bo").siblings(".voucher-yc-bt").find(".ychead").eq(index).text();
	var eleCode = nameCode.substring(0, nameCode.length - 4).replace(/([A-Z])/g, "_$1").toUpperCase();
	var jsonallelecode = []
	var allelecode = $('.assCheck').parents('.voucher-yc-bg').find('.ychead')
	for(var i = 0; i < allelecode.length; i++) {
		if(allelecode.eq(i).attr('name') != undefined) {
			var noweleName = allelecode.eq(i).html()
			var nowelecodes = allelecode.eq(i).attr('name')
			var nowelecode = nowelecodes.substring(0, nowelecodes.length - 4).replace(/([A-Z])/g, "_$1").toUpperCase();
			var nowele = {
				'eleCode': nowelecode,
				'eleName': noweleName
			}
			if(nowele.eleCode != "DIFFTERM" && nowele.eleCode != "DIFFTER" && nowele.eleCode != "BILLNO" && nowele.eleCode != "BILLTYP" && nowele.eleCode != "BILLDAT") {
				if(nowelecodes != "billNo" && nowelecodes != "billType" && nowelecodes != "billDate" && nowelecodes != "diffTermCode" && nowelecodes != "diffTermDir") {
					jsonallelecode.push(nowele)
				}
			}
		}
	}
	var chrCode = $(dom).find(".code").text();
	var chrName = $(dom).find(".name").text();
	var thisobj = {
		eleName: nameName,
		eleCode: eleCode,
		chrCode: chrCode,
		chrName: chrName
	}
	if(eleCode == "CURRENCY") {
		var $rateInput = $('.assCheck').parents(".ycbody").next(".ycbody.rateInput");
		if($.isNull($rateInput.val()) || $rateInput.val() == "0.00") {
			$rateInput.val($rateInput.attr("data-code"));
		}
	}
	var after = $('.assCheck').parents(".voucher-yc-bo").find(".ycbody").eq(index).nextAll("div.ycbody");
	var before = $('.assCheck').parents(".voucher-yc-bo").find(".ycbody").eq(index).prevAll("div.ycbody");
	var toAjax = false;
	if(isAssnullSave){
		toAjax = true
	}else{
		if(after.length > 0 || before.length > 0) {
			for(var i = 0; i < after.length; i++) {
				var $input = after.eq(i).find(".ycbodyinp");
				if($.isNull($input.val())) {
					toAjax = true;
					break;
				}
			}
			for(var i = 0; i < before.length; i++) {
				var $input = before.eq(i).find(".ycbodyinp");
				if($.isNull($input.val())) {
					toAjax = true;
					break;
				}
			}
		}
	}
	var _this = inputdom
	if(eleCode == "DIFFTERM" || eleCode == "DIFFTER") {
		toAjax = false
	}
	if(eleCode == "BILL" || eleCode == "BILLTYP" || eleCode == "BILLDAT") {
		toAjax = false
	}
	if(nameCode == "diffTermCode" || nameCode == "diffTermDir") {
		toAjax = false
	}
	if(nameCode == "billNo" || nameCode == "billType" || nameCode == "billDate" || nameCode == "remrk") {
		toAjax = false
	}
	if(toAjax) {
		var argu = {
			"agencyCode": rpt.nowAgencyCode,
			"acctCode": rpt.nowAcctCode,
			"eleCode": eleCode,
			"chrCode": chrCode
		};
		var url = '/gl/vou/getAccitemLink';
		ufma.ajaxDef(url, "get", argu, function(result) {
			if(result.data.length == 1) {
				var data = result.data[0];
				for(var i = 0; i < after.length; i++) {
					var $input = after.eq(i).find(".ycbodyinp");
					var relation  =after.eq(i).find(".ycbodyinp").attr('relation')
					var $li = fzhsxl[relation]
					var eq = parseInt(index + 1 + i);
					var thatNameCode = $input.parents(".voucher-yc-bo").siblings(".voucher-yc-bt").find(".ychead").eq(eq).attr("name");
					var thatnamecodedata = thatNameCode.substring(0, thatNameCode.length - 4).split("")
					for(var z = 0; z < thatnamecodedata.length; z++) {
						if(/^[A-Z]*$/.test(thatnamecodedata[z])) {
							thatnamecodedata.splice(z, 1, '_' + thatnamecodedata[z].toUpperCase())
						} else {
							thatnamecodedata.splice(z, 1, thatnamecodedata[z].toUpperCase())
						}
					}
					var thatEleCode = thatnamecodedata.join("")
					if($.isNull($input.val()) || isAssnullSave) {
						if(thatEleCode == "CURRENCY") {
							$input.val($('#AssDataAll').find("."+relation).find("li.selected").text());
							var $rateInput = $input.parent(".ycbody").next(".ycbody.rateInput");
							if($.isNull($rateInput.val()) || $rateInput.val() == "0.00") {
								$rateInput.val($rateInput.attr("data-code"));
							}
						} else {
							var selectObj = $.inArrayJson(data, 'eleCode', thatEleCode);
							if(thatEleCode != '' && thatEleCode != undefined) {
								if(selectObj != undefined) {
									var code = selectObj.chrCode;
									for(var k = 0; k < $li.length; k++) {
										if($li[k].code== code) {
											if(isaccfullname){
												$input.val($li[k].code + ' ' +$li[k].chrFullname).attr('code',$li[k].code)
											}else{
												$input.val($li[k].code + ' ' +$li[k].name).attr('code',$li[k].code);
											}
										}
									}
								}
							}
						}
					}
				}
				for(var i = 0; i < before.length; i++) {
					var $input = before.eq(i).find(".ycbodyinp");
					var relation  =before.eq(i).find(".ycbodyinp").attr('relation')
					var $li = fzhsxl[relation]
					var eq = parseInt(index - 1 - i);
					var thatNameCode = $input.parents(".voucher-yc-bo").siblings(".voucher-yc-bt").find(".ychead").eq(eq).attr("name");
					var thatnamecodedata = thatNameCode.substring(0, thatNameCode.length - 4).split("")
					for(var z = 0; z < thatnamecodedata.length; z++) {
						if(/^[A-Z]*$/.test(thatnamecodedata[z])) {
							thatnamecodedata.splice(z, 1, '_' + thatnamecodedata[z].toUpperCase())
						} else {
							thatnamecodedata.splice(z, 1, thatnamecodedata[z].toUpperCase())
						}
					}
					var thatEleCode = thatnamecodedata.join("")
					if($.isNull($input.val()) || isAssnullSave) {
						if(thatEleCode == "CURRENCY") {
							$input.val($('#AssDataAll').find("."+relation).find("li.selected").text());
							var $rateInput = $input.parent(".ycbody").next(".ycbody.rateInput");
							if($.isNull($rateInput.val()) || $rateInput.val() == "0.00") {
								$rateInput.val($rateInput.attr("data-code"));
							}
						} else {
							var selectObj = $.inArrayJson(data, 'eleCode', thatEleCode);
							if(thatEleCode != '' && thatEleCode != undefined) {
								if(selectObj != undefined) {
									var code = selectObj.chrCode;
									for(var k = 0; k < $li.length; k++) {
										if($li[k].code== code) {
											if(isaccfullname){
												$input.val($li[k].code + ' ' +$li[k].chrFullname).attr('code',$li[k].code)
											}else{
												$input.val($li[k].code + ' ' +$li[k].name).attr('code',$li[k].code);
											}
										}
									}
								}
							}
						}
					}
				}
				_this.parents(".ycbody").next(".ycbody").find(".ycbodyinp").focus().select();
			} else if(result.data.length > 1) {
				_this.addClass('adddygx')
				var jsonallelecodeno = []
				var zs = {}
				for(var i = 0; i < result.data.length; i++) {
					for(var z = 0; z < jsonallelecode.length; z++) {
						var selectObj = $.inArrayJson(result.data[i], 'eleCode', jsonallelecode[z].eleCode);
						if(selectObj != undefined && zs[jsonallelecode[z].eleCode] == undefined) {
							jsonallelecodeno.push(jsonallelecode[z])
							zs[jsonallelecode[z].eleCode] = ''
						}
					}
				}
				if(jsonallelecodeno.length>0){
					selectItemssmodal(result, jsonallelecodeno, thisobj)
					_this.trigger('focus')
				}
			}

		});
	}
};
$(document).on('click', '#voufzhsRelation', function(e) {
	stopPropagation(e)
})
$(document).on('click', '#btn-Relationsavefz', function() {
	var datar = []
	for(var i = 0; i < $('#voufzhsRelationtable tbody tr').length; i++) {
		if($('#voufzhsRelationtable tbody tr').eq(i).find("input[type='radio']").is(':checked')) {
			var datarjson = $('#voufzhsRelationtable tbody tr').eq(i).attr('datas')
			datar = fzhsglorJSON[datarjson]
		}
	}
	selectItemmodalsel($('.adddygx').eq(0), datar)
	$('.ycbodyinp').removeClass('adddygx')
	page.editor.close()
})
$(document).on('click', '#btn-Relationqxfz', function() {
	$('.ycbodyinp').removeClass('adddygx')
	page.editor.close()
})
var fzhsglorJSON = []
//多条辅助核算对应关系
function selectItemssmodal(data, titlehead, thisobj) {
	fzhsglorJSON = []
	var vouaccRelationtr = ''
	vouaccRelationtr += '<thead>'
	vouaccRelationtr += '<tr>'
	vouaccRelationtr += '<th style="width:56px;">选择'
	//		vouaccRelationtr += '<label class="mt-radio">'
	//		vouaccRelationtr += '<input type="radio" class="mt-radio">&nbsp;<span></span>'
	//		vouaccRelationtr += '</label>'
	vouaccRelationtr += '</th>'
	vouaccRelationtr += '<th class="relationacchead">' + thisobj.eleName + '</th>'
	for(var i = 0; i < titlehead.length; i++) {
		vouaccRelationtr += '<th class="relationacchead">' + titlehead[i].eleName + '</th>'
	}
	vouaccRelationtr += '</tr>'
	vouaccRelationtr += '</thead>'
	vouaccRelationtr += '<tbody>'
	for(var i = 0; i < data.data.length; i++) {
		fzhsglorJSON = data.data
		vouaccRelationtr += '<tr datas=' + i + '><td style="width:35px;">'
		vouaccRelationtr += '<label class="mt-radio">'
		vouaccRelationtr += '<input type="radio" name="voufzhsradio">&nbsp;<span></span>'
		vouaccRelationtr += '</label>'
		vouaccRelationtr += '</td>'
		vouaccRelationtr += '<td class="relationacc" title = "' + thisobj.chrCode + " " + thisobj.chrName + '">' + thisobj.chrCode + " " + thisobj.chrName + '</td>'
		var titles = ''
		var names = ''
		for(var z = 0; z < titlehead.length; z++) {
			var selectObj = $.inArrayJson(data.data[i], 'eleCode', titlehead[z].eleCode);
			if(selectObj != undefined) {
				vouaccRelationtr += '<td class="relationacc" title = "' + selectObj.chrCode + " " + selectObj.chrName + '">' + selectObj.chrCode + " " + selectObj.chrName + '</td>'
			} else {
				vouaccRelationtr += '<td class="relationacc" title = ""></td>'
			}
		}
		//			for(var j=0;j<data.data[i].length;j++){
		//				titles += data.data[i][j].eleName+'：'+data.data[i][j].chrCode + " " + data.data[i][j].chrName+'     '
		//				names += data.data[i][j].eleName+'：'+data.data[i][j].chrCode + " " + data.data[i][j].chrName+'</br>'
		//			}
		//			vouaccRelationtr += '<td class="relationacc" title = "'+ titles +'">' + names +'</td>'
		vouaccRelationtr += '</tr>'
	}
	vouaccRelationtr += '</tbody>'
	$("#voufzhsRelationtable").html(vouaccRelationtr)
	$('#voufzhsRelationtable').find('input[type="radio"]').eq(0).prop("checked", true)
	$("#fzhsResearch").val('')
	page.editor = ufma.showModal('voufzhsRelation', 750, 400);
}

function selectItemmodalsel(dom, resultdata) {
	var index = $(dom).parents(".ycbody").prevAll("div.ycbody").length;
	var nameCode = $(dom).parents(".voucher-yc-bo").siblings(".voucher-yc-bt").find(".ychead").eq(index).attr("name");
	var eleCode = nameCode.substring(0, nameCode.length - 4).toUpperCase();
	var chrCode = $(dom).find(".code").text();
	if(eleCode == "CURRENCY") {
		var $rateInput = $(dom).parents(".ycbody").next(".ycbody.rateInput");
		if($.isNull($rateInput.val()) || $rateInput.val() == "0.00") {
			$rateInput.val($rateInput.attr("data-code"));
		}
	}
	var after = $(dom).parents(".ycbody").nextAll("div.ycbody");
	var before = $(dom).parents(".ycbody").prevAll("div.ycbody");
	var toAjax = false;
	
	if(isAssnullSave){
		toAjax = true
	}else{
		if(after.length > 0 || before.length > 0) {
			for(var i = 0; i < after.length; i++) {
				var $input = after.eq(i).find(".ycbodyinp");
				if($.isNull($input.val())) {
					toAjax = true;
					break;
				}
			}
			for(var i = 0; i < before.length; i++) {
				var $input = before.eq(i).find(".ycbodyinp");
				if($.isNull($input.val())) {
					toAjax = true;
					break;
				}
			}
		}
	}
	var _this = $(dom)
	if(eleCode == "DIFFTERM" || eleCode == "DIFFTER") {
		toAjax = false
	}
	if(eleCode == "BILL" || eleCode == "BILLTYP" || eleCode == "BILLDAT") {
		toAjax = false
	}
	if(toAjax) {
		var data = resultdata;
		for(var i = 0; i < after.length; i++) {
			var $input = after.eq(i).find(".ycbodyinp");
			var relation  =after.eq(i).find(".ycbodyinp").attr('relation')
			var $li = fzhsxl[relation]
			var eq = parseInt(index + 1 + i);
			var thatNameCode = $input.parents(".voucher-yc-bo").siblings(".voucher-yc-bt").find(".ychead").eq(eq).attr("name");
			var thatnamecodedata = thatNameCode.substring(0, thatNameCode.length - 4).split("")
			for(var z = 0; z < thatnamecodedata.length; z++) {
				if(/^[A-Z]*$/.test(thatnamecodedata[z])) {
					thatnamecodedata.splice(z, 1, '_' + thatnamecodedata[z].toUpperCase())
				} else {
					thatnamecodedata.splice(z, 1, thatnamecodedata[z].toUpperCase())
				}
			}
			var thatEleCode = thatnamecodedata.join("")
			if($.isNull($input.val()) || isAssnullSave) {
				if(thatEleCode == "CURRENCY") {
					$input.val($('#AssDataAll').find("."+relation).find("li.selected").text());
					var $rateInput = $input.parent(".ycbody").next(".ycbody.rateInput");
					if($.isNull($rateInput.val()) || $rateInput.val() == "0.00") {
						$rateInput.val($rateInput.attr("data-code"));
					}
				} else {
					var selectObj = $.inArrayJson(data, 'eleCode', thatEleCode);
					if(thatEleCode != '' && thatEleCode != undefined) {
						if(selectObj != undefined) {
							var code = selectObj.chrCode;
							for(var k = 0; k < $li.length; k++) {
								if($li[k].code== code) {
									if(isaccfullname){
										$input.val($li[k].code + ' ' +$li[k].chrFullname).attr('code',$li[k].code)
									}else{
										$input.val($li[k].code + ' ' +$li[k].name).attr('code',$li[k].code);
									}
								}
							}
						}
					}
				}
			}
		}
		for(var i = 0; i < before.length; i++) {
			var $input = before.eq(i).find(".ycbodyinp");
			var relation  =before.eq(i).find(".ycbodyinp").attr('relation')
			var $li = fzhsxl[relation]
			var eq = parseInt(index - 1 - i);
			var thatNameCode = $input.parents(".voucher-yc-bo").siblings(".voucher-yc-bt").find(".ychead").eq(eq).attr("name");
			var thatnamecodedata = thatNameCode.substring(0, thatNameCode.length - 4).split("")
			for(var z = 0; z < thatnamecodedata.length; z++) {
				if(/^[A-Z]*$/.test(thatnamecodedata[z])) {
					thatnamecodedata.splice(z, 1, '_' + thatnamecodedata[z].toUpperCase())
				} else {
					thatnamecodedata.splice(z, 1, thatnamecodedata[z].toUpperCase())
				}
			}
			var thatEleCode = thatnamecodedata.join("")
			if($.isNull($input.val()) || isAssnullSave) {
				if(thatEleCode == "CURRENCY") {
					$input.val($('#AssDataAll').find("."+relation).find("li.selected").text());
					var $rateInput = $input.parent(".ycbody").next(".ycbody.rateInput");
					if($.isNull($rateInput.val()) || $rateInput.val() == "0.00") {
						$rateInput.val($rateInput.attr("data-code"));
					}
				} else {
					var selectObj = $.inArrayJson(data, 'eleCode', thatEleCode);
					if(thatEleCode != '' && thatEleCode != undefined) {
						if(selectObj != undefined) {
							var code = selectObj.chrCode;
							for(var k = 0; k < $li.length; k++) {
								if($li[k].code== code) {
									if(isaccfullname){
										$input.val($li[k].code + ' ' +$li[k].chrFullname).attr('code',$li[k].code);
									}else{
										$input.val($li[k].code + ' ' +$li[k].name).attr('code',$li[k].code);
									}
								}
							}
						}
					}
				}
			}
		}
	}
}
$(document).on("blur", ".ycbodyinp", function() {
	var _this = $(this);
	var istruenull = true
	var dataclasss = ['daoqiri','bussDate','billNoinp','billDateinp','daoqiriend','priceinp','qtyinp','exrateinp','curramtinp','remark','field1','quotaCode']
	for(var i=0;i<dataclasss.length;i++){
		if($(this).hasClass(dataclasss[i])){
			istruenull = false
			break;
		}
	}
	if(isuniversities && $(this).hasClass('projectCode')){
		istruenull = false
	}
	if($(this).attr('readonly')==undefined && istruenull){
		setTimeout(function() {
			if(isclick0 == 0 && !ie11compatibleass) {
				_this.removeClass('assCheck')
				var relation = _this.attr('relation')
				if($('#AssDataAll').find("."+relation).find(".selected").length == 0 && !_this.hasClass('adddygx')) {
					_this.val("").removeAttr('code');
					$('#AssDataAll').find("."+relation).find('li').removeClass('noselected').addClass("PopListBoxItem").show()
					$('#AssDataAll').find("."+relation).find("li").find('p').removeClass("sq");
				} else if($('#AssDataAll').find("."+relation).find(".selected").hasClass("dianji1") && _this.val() != "" && $('#AssDataAll').find("."+relation).find(".selected").text() != _this.val()) {
					if(isaccfullname) {
						_this.val($('#AssDataAll').find("."+relation).find(".selected").find('.code').text() + ' ' + $('#AssDataAll').find("."+relation).find(".selected").attr('fname')).attr('code',$('#AssDataAll').find("."+relation).find(".selected").find('.code').text())
					} else {
						_this.val($('#AssDataAll').find("."+relation).find(".selected").text()).attr('code',$('#AssDataAll').find("."+relation).find(".selected").find('.code').text())
					}
				}
				if($('.assCheck').length<1){
					$('#AssDataAll').find("."+relation).hide(100);
				}
			}
		}, 200)
	}
})
//辅助项input
function searchaccAss(obj, val) {
	// setTimeout(function() {
		var newval = obj.val()
		var noclss = obj.attr('relation')
		if(val == newval  && noclss!=undefined){
			$("#AssDataAll").find('.'+ noclss)
			$("#AssDataAll").find('.'+ noclss).find(".dianji0 p").removeClass("sq");
			$("#AssDataAll").find('.'+ noclss).find("li").removeClass("selected").addClass("unselected");
			if(obj.val() == "") {
				$("#AssDataAll").find('.'+ noclss).find("li").removeClass("noselected").addClass("PopListBoxItem");
			} else {
				if(vouisvague) {
					for(var i = 0; i < $("#AssDataAll").find('.'+ noclss).find("li").length; i++) {
						var tempStr = $("#AssDataAll").find('.'+ noclss).find("li").eq(i).text();
						var bool = tempStr.indexOf(obj.val());
						var tempStr2 = $("#AssDataAll").find('.'+ noclss).find("li").eq(i).find('.code').text() + ' ' + $("#AssDataAll").find('.'+ noclss).find("li").eq(i).attr('fname');
						var bool2 = tempStr2.indexOf(obj.val());
						if(bool >= 0 || bool2 >= 0) {
							$("#AssDataAll").find('.'+ noclss).find("li").eq(i).removeClass("noselected").addClass("PopListBoxItem").show();
						} else {
							$("#AssDataAll").find('.'+ noclss).find("li").eq(i).addClass("noselected").removeClass("PopListBoxItem").hide();
						}
					}
				}else{
					for(var i = 0; i <$("#AssDataAll").find('.'+ noclss).find("li").length ; i++) {
						var codebi = $("#AssDataAll").find('.'+ noclss).find("li").eq(i).find(".code").text().substring(0, obj.val().length)
						var codebis = $("#AssDataAll").find('.'+ noclss).find("li").attr('fname').substring(0, obj.val().length)
						var namebi = $("#AssDataAll").find('.'+ noclss).find("li").eq(i).find(".name").text().substring(0, obj.val().length)
						if(obj.val() == codebi || obj.val() == namebi || obj.val() == codebis || obj.val() == codebi + " " + codebis || obj.val() == codebi + " " + namebi) {
							$("#AssDataAll").find('.'+ noclss).find("li").eq(i).removeClass("noselected").addClass("PopListBoxItem").show();
						} else {
							$("#AssDataAll").find('.'+ noclss).find("li").eq(i).addClass("noselected").removeClass("PopListBoxItem").hide();
						}
					}
				}
			}
			$("#AssDataAll").find('.'+ noclss).find('.noRange').removeClass('PopListBoxItem').addClass("noselected").hide()
			for(var i = 0; i < $("#AssDataAll").find('.'+ noclss).find(".PopListBoxItem").length; i++) {
				if($("#AssDataAll").find('.'+ noclss).find(".PopListBoxItem").eq(i).hasClass("dianji1") && $("#AssDataAll").find('.'+ noclss).find(".PopListBoxItem").eq(i).hasClass("allnoshow") != true) {
					$("#AssDataAll").find('.'+ noclss).find(".PopListBoxItem").eq(i).removeClass("unselected").addClass("selected");
					inde = i
					$("#AssDataAll").find('.'+ noclss).animate({
						scrollTop: (inde - 1) * 26
					}, 0);
					break;
				}
			}
		}
	// },50)
}
//对大数据量的兼容
function searchaccAssnowlang(obj, val) {
	// setTimeout(function() {
		var newval = obj.val()
		var noclss = obj.attr('relation')
		var rangedata = obj.parents('.voucher-yc-bg').find('.voucher-yc-bt').find('.ychead[name="'+noclss+'"]').attr('isrange')
		var accocodes = obj.parents('.voucher-center').find('.accountinginp').attr('code')
		var datanocla = rangedata != 'undefined'?vouassRange[accocodes+noclss +'data']:fzhsxl[noclss]
		if(val == newval  && noclss!=undefined){
			var nowlen = 0;
			var assnoll = ''
			$("#AssDataAll").find('.'+ noclss).html('')
			if(obj.val() == "") {
				for(var n = 0; n < datanocla.length; n++) {
					if(datanocla[n].enabled == 1 && rangedata=='undefined') {
						if(isdefaultopen){
							if(nowlen<100){
								nowlen++;
								assnoll += '<li datalen = '+n+' department = "'+datanocla[n].departmentCode+'" levels = "' + datanocla[n].levelNum + '" fname="' + datanocla[n].chrFullname + '" class="PopListBoxItem unselected  dianji' + datanocla[n].isLeaf + ' fzlv' + datanocla[n].levelNum + ' "><p class="sq"><span class="code">' + datanocla[n].code + '</span>  <span class="name">' + datanocla[n].name + '</span></p></li>'
							}else if(nowlen>=100){
								break;
							}
						}else{
							if(datanocla[n].levelNum == 1 && nowlen<100){
								nowlen++;
								assnoll += '<li datalen = '+n+' department = "'+datanocla[n].departmentCode+'" levels = "' + datanocla[n].levelNum + '" fname="' + datanocla[n].chrFullname + '" class="PopListBoxItem unselected  dianji' + datanocla[n].isLeaf + ' fzlv' + datanocla[n].levelNum + ' "><p class="sq"><span class="code">' + datanocla[n].code + '</span>  <span class="name">' + datanocla[n].name + '</span></p></li>'
							}else if(datanocla[n].levelNum == 1 && nowlen>=100){
								break;
							}
						}
					}else if(rangedata  != 'undefined'){
						if(nowlen<100){
							nowlen++;
							assnoll += '<li datalen = '+n+' department = "'+datanocla[n].departmentCode+'" levels = "' + datanocla[n].levelNum + '" fname="' + datanocla[n].chrFullname + '" class="PopListBoxItem unselected  dianji' + datanocla[n].isLeaf + ' fzlv' + datanocla[n].levelNum + ' "><p><span class="code">' + datanocla[n].code + '</span>  <span class="name">' + datanocla[n].name + '</span></p></li>'
						}else if(nowlen>=100){
							break;
						}
					}
				}
				if(tablehead[noclss]!=undefined && isaddAssbtn==true){
					assnoll += '<div class="fzhsadd" tzurl = ' + noclss+ '>+新增 ' + tablehead[noclss].ELE_NAME + '</div>'
				}
				$("#AssDataAll").find('.'+ noclss).html(assnoll)
			} else {
				if(vouisvague) {
					for(var i = 0; i < datanocla.length; i++) {
						var tempStr = datanocla[i].code+datanocla[i].name;
						var bool = tempStr.indexOf(obj.val());
						var tempStr2 = datanocla[i].code + ' ' +datanocla[i].chrFullname;
						var bool2 = tempStr2.indexOf(obj.val()); 
						if(bool >= 0 || bool2 >= 0) {
							if(nowlen<100){
								nowlen++;
							if(datanocla[i].enabled == 1 || datanocla[i].enabled == undefined) {
								assnoll += '<li datalen = '+i+' department = "'+datanocla[i].departmentCode+'" levels = "' + datanocla[i].levelNum + '" fname="' + datanocla[i].chrFullname + '" class="PopListBoxItem unselected  dianji' + datanocla[i].isLeaf + ' fzlv' + datanocla[i].levelNum + ' "><p><span class="code">' + datanocla[i].code + '</span>  <span class="name">' + datanocla[i].name + '</span></p></li>'
							}else{
								assnoll += '<li datalen = '+i+' department = "'+datanocla[i].departmentCode+'" levels = "' + datanocla[i].levelNum + '" fname="' + datanocla[i].chrFullname + '" class="allnoshow unselected  dianji' + datanocla[i].isLeaf + ' fzlv' + datanocla[i].levelNum + ' "><p><span class="code">' + datanocla[i].code + '</span>  <span class="name">' + datanocla[i].name + '</span></p></li>'
							}
							}else{
								assnoll += '<li len = "100" class="noallass">点击加载更多</li>'
								break;
							}
						}
					}
					if(tablehead[noclss]!=undefined && isaddAssbtn==true){
						assnoll += '<div class="fzhsadd" tzurl = ' + noclss + '>+新增 ' + tablehead[noclss].ELE_NAME + '</div>'
					}
				}else{
					for(var i = 0; i <datanocla.length ; i++) {
						var codebi = datanocla[i].code.substring(0, obj.val().length)
						var codebis = datanocla[i].chrFullname.substring(0, obj.val().length)
						var namebi = datanocla[i].name.substring(0, obj.val().length)
						if(obj.val() == codebi || obj.val() == namebi || obj.val() == codebis || obj.val() == codebi + " " + codebis || obj.val() == codebi + " " + namebi) {
							if(nowlen<100){
								nowlen++;
								if(datanocla[i].enabled == 1 || datanocla[i].enabled == undefined) {
									assnoll += '<li datalen = '+i+' department = "'+datanocla[i].departmentCode+'" levels = "' + datanocla[i].levelNum + '" fname="' + datanocla[i].chrFullname + '" class="PopListBoxItem  unselected  dianji' + datanocla[i].isLeaf + ' fzlv' + datanocla[i].levelNum + ' "><p><span class="code">' + datanocla[i].code + '</span>  <span class="name">' + datanocla[i].name + '</span></p></li>'
								}else{
									assnoll += '<li datalen = '+i+' department = "'+datanocla[i].departmentCode+'" levels = "' + datanocla[i].levelNum + '" fname="' + datanocla[i].chrFullname + '" class="allnoshow unselected  dianji' + datanocla[i].isLeaf + ' fzlv' + datanocla[i].levelNum + ' "><p><span class="code">' + datanocla[i].code + '</span>  <span class="name">' + datanocla[i].name + '</span></p></li>'
								}
							}else{
								assnoll += '<li len = "100" class = "noallass">点击加载更多</li>'
								break;
							}
						}
					}
					if(tablehead[noclss]!=undefined && isaddAssbtn==true){
						assnoll += '<div class="fzhsadd" tzurl = ' + noclss + '>+新增 ' + tablehead[noclss].ELE_NAME + '</div>'
					}
				}
				$("#AssDataAll").find('.'+ noclss).html(assnoll)
			}
			for(var i = 0; i < $("#AssDataAll").find('.'+ noclss).find(".PopListBoxItem").length; i++) {
				if($("#AssDataAll").find('.'+ noclss).find(".PopListBoxItem").eq(i).hasClass("dianji1") && $("#AssDataAll").find('.'+ noclss).find(".PopListBoxItem").eq(i).hasClass("allnoshow") != true) {
					$("#AssDataAll").find('.'+ noclss).find(".PopListBoxItem").eq(i).removeClass("unselected").addClass("selected");
					inde = i
					$("#AssDataAll").find('.'+ noclss).animate({
						scrollTop: (inde - 1) * 26
					}, 0);
					break;
				}
			}
		}
	// },50)
}
$(document).on("input", ".ycbodyinp", function() {
	if($(this).attr('relation')!=undefined){
		var sctop = $(this).offset().top - $(window).scrollTop() - $(this).parents('.voucher-yc-bg').scrollTop() + 50
		var scbottom = $(this).offset().top - $(window).scrollTop() - $(this).parents('.voucher-yc-bg').scrollTop()-302
		var scleft = $(this).offset().left - $(window).scrollLeft()
		var widthass = $(this).width()
		var relation = $(this).attr('relation')
		if(vousinglepzzy == true && isdobabstractinp == false  && vousingelzysdob){
			$('#AssDataAll').find("." + relation).show().css({
				'position': 'fixed',
				'top': scbottom,
				'height':'300px',
				'left': scleft,
				'width': widthass + 'px'
			});
		}else{
			$('#AssDataAll').find("." + relation).show().css({
				'position': 'fixed',
				'top': sctop,
				'height':'',
				'left': scleft,
				'width': widthass + 'px'
			});
		}
	}
	if($('#AssDataAll').find("."+relation).attr('isAlllength')=='now'){
		searchaccAssnowlang($(this),$(this).val())
	}else{
		searchaccAss($(this),$(this).val())
	}
})

$(document).on("click", ".ycbodys .noallass", function(e) {
	stopPropagation(e)
	isclick0 = 1
	var _this = $(this)
	setTimeout(function() {
		var obj = $('.assCheck')
		var newval = obj.val()
		var noclss = obj.attr('relation')
		var datanocla = fzhsxl[noclss]
		var nowlen = 0;
		var assnoll = ''
		var kno = 0
		if(_this.attr('len')!=undefined){
			kno = parseFloat(_this.attr('len'))+100
		}
		if(obj.val() == "") {
			if(_this.attr('code')!=undefined){
				
			}
		} else {
			if(vouisvague) {
				for(var i = 0; i < datanocla.length; i++) {
					var tempStr = datanocla[i].code+datanocla[i].name;
					var bool = tempStr.indexOf(obj.val());
					var tempStr2 = datanocla[i].code + ' ' +datanocla[i].chrFullname;
					var bool2 = tempStr2.indexOf(obj.val()); 
					if(bool >= 0 || bool2 >= 0) {
						nowlen++;
						if(nowlen<kno && kno-100<nowlen){
							if(datanocla[i].enabled == 1 || datanocla[i].enabled == undefined) {
								assnoll += '<li datalen = '+i+' department = "'+datanocla[i].departmentCode+'" levels = "' + datanocla[i].levelNum + '" fname="' + datanocla[i].chrFullname + '" class="PopListBoxItem  unselected  dianji' + datanocla[i].isLeaf + ' fzlv' + datanocla[i].levelNum + ' "><p><span class="code">' + datanocla[i].code + '</span>  <span class="name">' + datanocla[i].name + '</span></p></li>'
							}else{
								assnoll += '<li datalen = '+i+' department = "'+datanocla[i].departmentCode+'" levels = "' + datanocla[i].levelNum + '" fname="' + datanocla[i].chrFullname + '" class="allnoshow unselected  dianji' + datanocla[i].isLeaf + ' fzlv' + datanocla[i].levelNum + ' "><p><span class="code">' + datanocla[i].code + '</span>  <span class="name">' + datanocla[i].name + '</span></p></li>'
							}
						}else if(nowlen>=kno){
							assnoll += '<li  len="'+kno+'" class="noallass">点击加载更多</li>'
							break;
						}
					}
				}
			}else{
				for(var i = 0; i <datanocla.length ; i++) {
					var codebi = datanocla[i].code.substring(0, obj.val().length)
					var codebis = datanocla[i].chrFullname.substring(0, obj.val().length)
					var namebi = datanocla[i].name.substring(0, obj.val().length)
					if(obj.val() == codebi || obj.val() == namebi || obj.val() == codebis || obj.val() == codebi + " " + codebis || obj.val() == codebi + " " + namebi) {
						nowlen++;
						if(nowlen<kno && kno-100<nowlen){
							if(datanocla[i].enabled == 1 || datanocla[i].enabled == undefined) {
								assnoll += '<li datalen = '+i+' department = "'+datanocla[i].departmentCode+'" levels = "' + datanocla[i].levelNum + '" fname="' + datanocla[i].chrFullname + '" class="PopListBoxItem  unselected  dianji' + datanocla[i].isLeaf + ' fzlv' + datanocla[i].levelNum + ' "><p><span class="code">' + datanocla[i].code + '</span>  <span class="name">' + datanocla[i].name + '</span></p></li>'
							}else{
								assnoll += '<li datalen = '+i+' department = "'+datanocla[i].departmentCode+'" levels = "' + datanocla[i].levelNum + '" fname="' + datanocla[i].chrFullname + '" class="allnoshow unselected  dianji' + datanocla[i].isLeaf + ' fzlv' + datanocla[i].levelNum + ' "><p><span class="code">' + datanocla[i].code + '</span>  <span class="name">' + datanocla[i].name + '</span></p></li>'
							}
						}else if(nowlen>=kno){
							assnoll += '<li  len="'+kno+'" class = "noallass">点击加载更多</li>'
							break;
						}
					}
				}
			}
			_this.after(assnoll)
		}
		_this.remove()
		$('.assCheck').focus()
		isclick0 = 0
	}, 201)
})
$(document).on("click", ".ycbodys .dianji0", function(e) {
	stopPropagation(e)
	isclick0 = 1
	var _this = $(this)
	setTimeout(function() {
		var lvnum = parseFloat(_this.attr('levels')) + 1
		var str = _this.find('.code').html()
		if(_this.find('p').hasClass('sq') != true) {
			_this.find('p').addClass('sq')
		} else if(_this.find('p').hasClass('sq')) {
			_this.find('p').removeClass('sq')
		}
		var relation = $('.asCheck').attr("relation")
		var isrange=$(".assCheck").parents('.voucher-yc-bg').find('.voucher-yc-bt').find('.ychead[name="'+relation+'"]').attr('isrange')
		if(_this.parents('.ycbodys').attr('isAlllength')=='now' && isrange!=true){
			var nal = $('.assCheck').attr('relation')
			var datanocla  = fzhsxl[nal]
			var datalen = parseFloat(_this.attr('datalen'))
			var assnoll =''
			var nowlen = 0
			var codes = $(this).find('.code').html()
			if(_this.find('p').hasClass('sq')!=true){
				for(var i = datalen+1; i < datanocla.length; i++) {
					var lvnums = datanocla[i].levelNum
					if(lvnum-1<lvnums && nowlen<100) {
						if(lvnum == lvnums && _this.parents('.ycbodys').find('li[datalen='+i+']').length<1 && datanocla[i].enabled == 1){
							nowlen++;
							if(datanocla[i].isLeaf>0){
								assnoll += '<li datalen = '+i+' department = "'+datanocla[i].departmentCode+'" levels = "' + datanocla[i].levelNum + '" fname="' + datanocla[i].chrFullname + '" class="PopListBoxItem unselected  dianji' + datanocla[i].isLeaf + ' fzlv' + datanocla[i].levelNum + ' "><p><span class="code">' + datanocla[i].code + '</span>  <span class="name">' + datanocla[i].name + '</span></p></li>'
							}else{
								assnoll += '<li datalen = '+i+' department = "'+datanocla[i].departmentCode+'" levels = "' + datanocla[i].levelNum + '" fname="' + datanocla[i].chrFullname + '" class="PopListBoxItem unselected  dianji' + datanocla[i].isLeaf + ' fzlv' + datanocla[i].levelNum + ' "><p class="sq"><span class="code">' + datanocla[i].code + '</span>  <span class="name">' + datanocla[i].name + '</span></p></li>'
							}
						}
					}else if(nowlen>=100 && _this.parents('.ycbodys').find('li[dataparent='+codes+']').length<1){
						assnoll += '<li dataparent = "'+_this.find('.code').html()+'" class = "noallassno">当前数据过多，请使用搜索过滤</li>'
						break;
					}else{
						break;
					}
				}
				_this.after(assnoll)
			}else{
				for(var i = datalen+1; i < datanocla.length; i++) {
					var lvnums = datanocla[i].levelNum
					if(lvnum-1 <lvnums) {
						_this.parents('.ycbodys').find('li[datalen='+i+']').remove()
					}else{
						break;
					}
				}
			}
		}else{
			for(var i = 0; i < _this.nextAll('li').length; i++) {
				var strnex = _this.nextAll('li').eq(i).find('.code').html()
				var lvnums = _this.nextAll('li').eq(i).attr('levels')
				if(lvnum-1 <lvnums) {
					if(_this.find('p').hasClass('sq')) {
						_this.nextAll('li').eq(i).hide().removeClass('PopListBoxItem')
					} else {
						if(lvnums == lvnum) {
							_this.nextAll('li').eq(i).show().addClass('PopListBoxItem')
							if(_this.nextAll('li').eq(i).hasClass('dianji0')) {
								_this.nextAll('li').eq(i).find('p').addClass('sq')
							}
						} else {
							_this.nextAll('li').eq(i).hide().removeClass('PopListBoxItem')
						}
					}
				} else{
					break;
				}
			}
		}
		$('.assCheck').focus()
		isclick0 = 0
	}, 201)
})
//辅助项列表点击
$(document).on("click", ".ycbodys .dianji1", function(e) {
	stopPropagation(e); 
	ie11compatibleass = false;
	//判断父元素voucher-yc-bo op是否为0，不为0就是1，为0不做处理
	if($(this).parents(".voucher-yc-bo").attr("op") != "0") {
		$(this).parents(".voucher-yc-bo").attr("op", "1");
		$(this).parents(".voucher-center").attr("op", "1");
	}
	if(isaccfullname) {
		$('.assCheck').val($(this).find('.code').text() + ' ' + $(this).attr('fname'))
	} else {
		$('.assCheck').val($(this).text());
	}
	$('.assCheck').attr('code',$(this).find('.code').text())
	$(this).parents(".ycbodys").find("li").removeClass("selected").addClass("unselected");
	$(this).addClass("selected").removeClass("unselected");
 	$('assCheck').parents(".voucher-yc-bo").find(".yctzyutext").remove()
 	$('assCheck').parents(".voucher-yc-bo").find(".yctzyuer").remove()
	if($('.assCheck').hasClass('diffTermCodeinp')) {
		var ycal = $('.assCheck').parents(".voucher-yc")
		for(var i = 0; i < ycal.find(".voucher-yc-bo").length; i++) {
			var ycalsd = ycal.find(".voucher-yc-bo").eq(i)
			ycalsd.find('.diffTermCodeinp').val($(this).text())
		}
	}
	if($('.assCheck').hasClass('diffTermDirinp')) {
		var ycal = $('.assCheck').parents(".voucher-yc")
		for(var i = 0; i < ycal.find(".voucher-yc-bo").length; i++) {
			var ycalsd = ycal.find(".voucher-yc-bo").eq(i)
			ycalsd.find('.diffTermDirinp').val($(this).text())
		}
	}
	if($(this).parents(".ycbodys").hasClass('currency')) {
		var exrate = $(this).attr('exrate')
		var rateDigits = $(this).attr('rateDigits')
		if(exrate != '') {
			$('.assCheck').parents('.voucher-yc-bo').find('.exrateinp').val(curexratefzhsxl[exrate]).attr('exrate', exrate).attr('rateDigits', rateDigits)
		}
	}
	if($(this).parents(".ycbodys").hasClass('employeeCode') && isdepartmentChange) {
		var department =$(this).attr('department') 
		$('.assCheck').attr('departmentcode',department)
		var departinp = $('.assCheck').parents('.voucher-yc-bo').find('.ycbodyinp[relation="departmentCode"]')
		if(departinp.length>0 && departinp.val()==""){
			var depul = $("#AssDataAll").find('.departmentCode').find('li')
			for(var s = 0; s < depul.length; s++) {
				if(depul.eq(s).find(".code").text() == department) {
					if(isaccfullname) {
						departinp.val(depul.eq(s).find(".code").text() + ' ' + depul.eq(s).attr('fname'))
					} else {
						departinp.val(depul.eq(s).text());
					}
					departinp.attr('code',depul.eq(s).find('.code').text())
				}
			}
		}
	}
	if($(this).parents(".ycbodys").hasClass('departmentCode') && isdepartmentChange) {
		var departinp = $('.assCheck').parents('.voucher-yc-bo').find('.ycbodyinp[relation="employeeCode"]')
		var departmentcodes =$(this).find(".code").text() 
		if(departinp.length>0 && departinp.val()!='' && departinp.attr('departmentcode')!=departmentcodes){
			departinp.val('').removeAttr('code').removeAttr('departmentcode')
		}
	}
	selectItem(this,$('.assCheck').eq(0).parent(".ycbody").prevAll(".ycbody").length,$('.assCheck'));
	$('assCheck').blur()
	$(this).parents('.ycbodys').hide()
})
$(document).on("mousemove", ".ycbodys", function() {
	ie11compatibleass = true
})
$(document).on("mouseout", ".ycbodys", function() {
	ie11compatibleass = false
})
$(document).on("keydown", ".ycbodyinp", function(event) {
	event = event || window.event;
	var relation = $(this).attr('relation')
	if(event.shiftKey && event.keyCode == 37) {
		if($(this).hasClass("daoqiri") || $(this).hasClass("bussDate") || $(this).hasClass("billDateinp")){
			$(this).datetimepicker('hide')
		}
		if($(this).parents(".ycbody").prev(".ycbody").length>0){
			$(this).parents(".ycbody").prev(".ycbody").find(".ycbodyinp").focus()
		}else{
			if($(this).parents(".voucher-yc-bo").prev(".voucher-yc-bo").find(".yctz").length>0){
				$(this).parents(".voucher-yc-bo").prev(".voucher-yc-bo").find(".yctz").focus()
			}else{
				$(this).parents('.voucher-center').find('.accountinginp').focus()
			}
		}
		event.preventDefault();
		event.returnValue = false;
		event.keyCode == 0
		return false;
	}
	if(event.keyCode == 9) {
		event.preventDefault();
		if(keydownctrls == true && $("#btn-voucher-bc").length == 1) {
			keydownctrls = false;
			_this = $(this)
			setTimeout(function() {
				if(vousinglepzzy) {
					if(_this.parents('.voucher-center').hasClass("voucher-centercw")) {
						for(var i = 0; i < $(".voucher-centerys").length; i++) {
							if($(".voucher-centerys").eq(i).hasClass('deleteclass') != true) {
								$(".voucher-centerys").eq(i).find('.abstractinp').focus()
								break;
							}
						}
						autoRelationacco('.voucher-centercw')
					} else {
						for(var i = 0; i < $(".voucher-centercw").length; i++) {
							if($(".voucher-centercw").eq(i).hasClass('deleteclass') != true) {
								$(".voucher-centercw").eq(i).find('.abstractinp').focus()
								break;
							}
						}
						autoRelationacco('.voucher-centerys')
					}
				}
				keydownctrls = true;
			}, 1)
			event.keyCode = 0;
			if(event.preventDefault) { // firefox
				event.preventDefault();
			} else { // other
				event.returnValue = false;
			}
		}
	}
	if(event.shiftKey && event.keyCode == 39) {
		if($(this).hasClass("daoqiri") || $(this).hasClass("bussDate") || $(this).hasClass("billDateinp")){
			$(this).datetimepicker('hide')
		}
		if($(this).parents(".ycbody").next(".ycbody").find(".ycbodyinp").length>0){
			$(this).parents(".ycbody").next(".ycbody").find(".ycbodyinp").focus()
		}else{
			if($(this).parents(".voucher-yc-bo").find(".yctz").length>0){
				$(this).parents(".voucher-yc-bo").find(".yctz").focus()
			}
		}
		event.preventDefault();
		event.returnValue = false;
		event.keyCode == 0
		return false;
	}
	if(event.shiftKey && event.keyCode == 38) {
		if($(this).hasClass("daoqiri") || $(this).hasClass("bussDate") || $(this).hasClass("billDateinp")){
			$(this).datetimepicker('hide')
		}
		if($(this).parents(".voucher-yc-bo").prev(".voucher-yc-bo").length>0){
			var assinpbo = $(this).parents(".voucher-yc-bo").prev(".voucher-yc-bo")
			if($(this).hasClass('remark')){assinpbo.find('.remark').focus()
			}else if($(this).hasClass('billNoinp')){assinpbo.find('.billNoinp').focus()
			}else if($(this).hasClass('billDateinp')){assinpbo.find('.billDateinp').focus()
			}else if($(this).hasClass('exrateinp')){assinpbo.find('.exrateinp').focus()
			}else if($(this).hasClass('curramtinp')){assinpbo.find('.curramtinp').focus()
			}else if($(this).hasClass('priceinp')){assinpbo.find('.priceinp').focus()
			}else if($(this).hasClass('qtyinp')){assinpbo.find('.qtyinp').focus()
			}else if($(this).hasClass('bussDate')){assinpbo.find('.bussDate').focus()
			}else if($(this).hasClass('daoqiri')){assinpbo.find('.daoqiri').focus()
			}else{
				var ration = $(this).attr('relation')
				assinpbo.find('.ycbodyinp[relation='+ration+']').focus()
			}
		}else{
			$(this).parents('.voucher-center').find('.abstractinp').focus()
		}
		event.preventDefault();
		event.returnValue = false;
		event.keyCode == 0
		return false;
	}
	if(event.shiftKey && event.keyCode == 40) {
		
		if($(this).parents(".voucher-yc-bo").next(".voucher-yc-bo").length>0){
			var assinpbo = $(this).parents(".voucher-yc-bo").next(".voucher-yc-bo")
			if($(this).hasClass('remark')){assinpbo.find('.remark').focus()
			}else if($(this).hasClass('billNoinp')){assinpbo.find('.billNoinp').focus()
			}else if($(this).hasClass('billDateinp')){assinpbo.find('.billDateinp').focus()
			}else if($(this).hasClass('exrateinp')){assinpbo.find('.exrateinp').focus()
			}else if($(this).hasClass('curramtinp')){assinpbo.find('.curramtinp').focus()
			}else if($(this).hasClass('priceinp')){assinpbo.find('.priceinp').focus()
			}else if($(this).hasClass('qtyinp')){assinpbo.find('.qtyinp').focus()
			}else if($(this).hasClass('bussDate')){assinpbo.find('.bussDate').focus()
			}else if($(this).hasClass('daoqiri')){assinpbo.find('.daoqiri').focus()
			}else{
				var ration = $(this).attr('relation')
				assinpbo.find('.ycbodyinp[relation='+ration+']').focus()
			}
		}else{
			var athis;
			if($(this).parents('.voucher').hasClass('voucher-singelzybg') || $(this).parents('.voucher').hasClass('voucher-singelzy')){
				athis = $(this).parents('.voucher-center').next('.voucher-center').next('.voucher-center')
			}else{
				athis = $(this).parents('.voucher-center').next('.voucher-center')
			}
			if(athis.length>0){
				athis.find('.abstractinp').focus()
			}
		}
		event.preventDefault();
		event.returnValue = false;
		event.keyCode == 0
		return false;
	}
	if(event.keyCode == 38) { //向上键
		if($('#AssDataAll').find("."+relation).find(".selected").length == 0) {
			inde = -1;
		}
		$('#AssDataAll').find("."+relation).find("li").addClass("unselected").removeClass("selected");
		inde--;
		if(inde < 0) {
			$('#AssDataAll').find("."+relation).find(".PopListBoxItem").eq(inde + 1).removeClass("selected").addClass("unselected");
			inde = $('#AssDataAll').find("."+relation).find(".PopListBoxItem").length - 1;
		}
		$('#AssDataAll').find("."+relation).find(".PopListBoxItem").eq(inde).removeClass("unselected").addClass("selected");
		$('#AssDataAll').find("."+relation).animate({
			scrollTop: (inde - 1) * 26
		}, 0);
	}
	if(event.keyCode == 37) {
		if($('#AssDataAll').find("."+relation).find(".selected").hasClass('dianji0')) {
			var str = $('#AssDataAll').find("."+relation).find(".selected").find('.code').html()
			var lvnum = parseFloat($('#AssDataAll').find("."+relation).find(".selected").attr('levels')) + 1
			$('#AssDataAll').find("."+relation).find(".selected").find('p').addClass('sq')
			var isrange=$(this).parents('.voucher-yc-bg').find('.voucher-yc-bt').find('.ychead[name="'+relation+'"]').attr('isrange')
			if($('#AssDataAll').find("."+relation).attr('isAlllength')=='now' && isrange!=true){
				var datanocla  = fzhsxl[relation]
				var datalen = parseFloat($('#AssDataAll').find("."+relation).find(".selected").attr('datalen'))
				var assnoll =''
				var nowlen = 0
				for(var i = datalen+1; i < datanocla.length; i++) {
					var lvnums = datanocla[i].levelNum
					if(lvnum-1 <lvnums) {
						$('#AssDataAll').find("."+relation).find('li[datalen='+i+']').remove()
					}else{
						break;
					}
				}
			}else{
				for(var i = 0; i < $('#AssDataAll').find("."+relation).find(".selected").nextAll('li').length; i++) {
					var lvnums = $('#AssDataAll').find("."+relation).find(".selected").nextAll('li').eq(i).attr('levels')
					if(lvnum-1 <lvnums) {
						$('#AssDataAll').find("."+relation).find(".selected").nextAll('li').eq(i).hide().removeClass('PopListBoxItem')
					}
				}
			}
		}
	}
	if(event.keyCode == 39) {
		if($('#AssDataAll').find("."+relation).find(".selected").hasClass('dianji0')) {
			var str = $('#AssDataAll').find("."+relation).find(".selected").find('.code').html()
			var lvnum = parseFloat($('#AssDataAll').find("."+relation).find(".selected").attr('levels')) + 1
			$('#AssDataAll').find("."+relation).find(".selected").find('p').removeClass('sq')
			var isrange=$(this).parents('.voucher-yc-bg').find('.voucher-yc-bt').find('.ychead[name="'+relation+'"]').attr('isrange')
			if($('#AssDataAll').find("."+relation).attr('isAlllength')=='now' && isrange!=true){
				var datanocla  = fzhsxl[relation]
				var datalen = parseFloat($('#AssDataAll').find("."+relation).find(".selected").attr('datalen'))
				var assnoll =''
				var nowlen = 0
				var codes = $('#AssDataAll').find("."+relation).find(".selected").find('.code').html()
				for(var i = datalen+1; i < datanocla.length; i++) {
					var lvnums = datanocla[i].levelNum
					if(lvnum-1<lvnums && nowlen<100) {
						if(lvnum == lvnums && $('#AssDataAll').find("."+relation).find('li[datalen='+i+']').length<1 && datanocla[i].enabled == 1){
							nowlen++;
							if(datanocla[i].isLeaf>0){
								assnoll += '<li datalen = '+i+' department = "'+datanocla[i].departmentCode+'" levels = "' + datanocla[i].levelNum + '" fname="' + datanocla[i].chrFullname + '" class="PopListBoxItem unselected  dianji' + datanocla[i].isLeaf + ' fzlv' + datanocla[i].levelNum + ' "><p><span class="code">' + datanocla[i].code + '</span>  <span class="name">' + datanocla[i].name + '</span></p></li>'
							}else{
								assnoll += '<li datalen = '+i+' department = "'+datanocla[i].departmentCode+'" levels = "' + datanocla[i].levelNum + '" fname="' + datanocla[i].chrFullname + '" class="PopListBoxItem unselected  dianji' + datanocla[i].isLeaf + ' fzlv' + datanocla[i].levelNum + ' "><p class="sq"><span class="code">' + datanocla[i].code + '</span>  <span class="name">' + datanocla[i].name + '</span></p></li>'
							}
						}
					}else if(nowlen>=100 && $('#AssDataAll').find("."+relation).find('li[dataparent='+codes+']').length<1){
						assnoll += '<li dataparent = "'+codes+'" class = "noallassno">当前数据过多，请使用搜索过滤</li>'
						break;
					}else{
						break;
					}
				}
				$('#AssDataAll').find("."+relation).find(".selected").after(assnoll)
			}else{
				for(var i = 0; i < $('#AssDataAll').find("."+relation).find(".selected").nextAll('li').length; i++) {
					var strnex = $('#AssDataAll').find("."+relation).find(".selected").nextAll('li').eq(i).find('.code').html()
					var lvnums = $('#AssDataAll').find("."+relation).find(".selected").nextAll('li').eq(i).attr('levels')
					if(lvnum-1 <lvnums) {
						if(lvnums == lvnum) {
							$('#AssDataAll').find("."+relation).find(".selected").nextAll('li').eq(i).show().addClass('PopListBoxItem')
							if($('#AssDataAll').find("."+relation).find(".selected").nextAll('li').eq(i).hasClass('dianji0')) {
								$('#AssDataAll').find("."+relation).find(".selected").nextAll('li').eq(i).find('p').addClass('sq')
							}
						}
					} else{
						break;
					}
				}
			}
		}
	}
	if(event.keyCode == 40) { //向下键
		if($('#AssDataAll').find("."+relation).find(".selected").length == 0) {
			inde = -1;
		}
		$('#AssDataAll').find("."+relation).find("li").removeClass("selected").addClass("unselected");
		inde++;
		if(inde >= $('#AssDataAll').find("."+relation).find(".PopListBoxItem").length) {
			$('#AssDataAll').find("."+relation).find(".PopListBoxItem").eq(inde - 1).removeClass("selected").addClass("unselected");
			inde = 0;
		}
		$('#AssDataAll').find("."+relation).find(".PopListBoxItem").eq(inde - 1).removeClass("selected").addClass("unselected");
		$('#AssDataAll').find("."+relation).find(".PopListBoxItem").eq(inde).removeClass("unselected").addClass("selected");
		$('#AssDataAll').find("."+relation).animate({
			scrollTop: (inde - 1) * 26
		}, 0);
	}
	if(event.keyCode == 13) { //enter键
		//判断父元素voucher-yc-bo op是否为0，不为0就是1，为0不做处理
		if($(this).parents(".voucher-yc-bo").attr("op") != "0") {
			$(this).parents(".voucher-yc-bo").attr("op", "1");
			$(this).parents(".voucher-center").attr("op", "1");
		}
		if($('#AssDataAll').find("."+relation).find(".selected").length > 0) {
			inde = 0;
			if($('#AssDataAll').find("."+relation).find(".selected").hasClass("dianji0")) {

			} else {
				if(isaccfullname) {
					$(this).val($('#AssDataAll').find("."+relation).find(".selected").find('.code').text() + ' ' + $('#AssDataAll').find("."+relation).find(".selected").attr('fname'))
				} else {
					$(this).val($('#AssDataAll').find("."+relation).find(".selected").text())
				}
				$(this).attr('code',$('#AssDataAll').find("."+relation).find(".selected").find('.code').text())
				$('#AssDataAll').find("."+relation).hide();
				$(this).parents(".ycbody").next(".ycbody").find(".ycbodyinp").focus().select();
				if($(this).parents(".ycbody").next(".ycbody").find(".ycbodyinp").length == 1) {
					$(this).parents(".ycbody").next(".ycbody").find(".ycbodyinp").focus().select();
				} else {
					$(this).parents(".ycbody").next("input").focus().select();
				}
			}
			selectItem($('#AssDataAll').find("."+relation).find(".selected"),$(this).parent(".ycbody").prevAll(".ycbody").length,$(this));
		}else{
			if($(this).parents(".ycbody").next(".ycbody").find(".ycbodyinp").length == 1) {
				$(this).parents(".ycbody").next(".ycbody").find(".ycbodyinp").focus().select();
			} else {
				$(this).parents(".ycbody").next("input").focus().select();
			}
		}
		if($(this).hasClass('diffTermCodeinp')) {
			var ycal = $(this).parents(".voucher-yc")
			for(var i = 0; i < ycal.find(".voucher-yc-bo").length; i++) {
				var ycalsd = ycal.find(".voucher-yc-bo").eq(i)
				ycalsd.find('.diffTermCodeinp').val($('#AssDataAll').find("."+relation).find(".selected").text())
			}
		}
		if($(this).hasClass('diffTermDirinp')) {
			var ycal = $(this).parents(".voucher-yc")
			for(var i = 0; i < ycal.find(".voucher-yc-bo").length; i++) {
				var ycalsd = ycal.find(".voucher-yc-bo").eq(i)
				ycalsd.find('.diffTermDirinp').val($('#AssDataAll').find("."+relation).find(".selected").text())
			}
		}
		if($(this).hasClass('curcodeinp')) {
			var exrate = $('#AssDataAll').find("."+relation).find(".selected").attr('exrate')
			var rateDigits = $('#AssDataAll').find("."+relation).find(".selected").attr('rateDigits')
			if(exrate != '') {
				$(this).parents('.voucher-yc-bo').find('.exrateinp').val(curexratefzhsxl[exrate]).attr('exrate', exrate).attr('rateDigits', rateDigits)
			}
		}
		if($(this).attr('relation') == 'employeeCode' && isdepartmentChange) {
			var department =$('#AssDataAll').find("."+relation).find(".selected").attr('department') 
			$(this).attr('departmentcode',department)
			var departinp = $(this).parents('.voucher-yc-bo').find('.ycbodyinp[relation="departmentCode"]')
			if(departinp.length>0 && departinp.val()==""){
				var depul = $("#AssDataAll").find('.departmentCode').find('li')
				for(var s = 0; s < depul.length; s++) {
					if(depul.eq(s).find(".code").text() == department) {
						if(isaccfullname) {
							departinp.val(depul.eq(s).find(".code").text() + ' ' + depul.eq(s).attr('fname'))
						} else {
							departinp.val(depul.eq(s).text());
						}
						departinp.attr('code',depul.eq(s).find('.code').text())
					}
				}
			}
		}
		if($(this).attr('relation') == 'departmentCode' && isdepartmentChange) {
			var departmentcodes =$('#AssDataAll').find("."+relation).find(".selected").find(".code").text()
			var departinp = $(this).parents('.voucher-yc-bo').find('.ycbodyinp[relation="employeeCode"]')
			if(departinp.length>0 && departinp.val()!='' && departinp.attr('departmentcode')!=departmentcodes){
				departinp.val('').removeAttr('code').removeAttr('departmentcode')
			}
		}
		event.preventDefault();
		event.returnValue = false;
		event.keyCode == 0
		return false;
	}
})

//确保部分非必要辅助核算即使未有录入也可以全键盘执行
$(document).on("keydown", ".daoqiri,.billNoinp,.billDateinp,.remark,.priceinp,.qtyinp,.exrateinp,.curramtinp,.bussDate,.billTypeinp,.curcodeinp", function(event) {
	event = event || window.event;
	if(event.keyCode == 13) {
		$(".ycbodys").hide();
		if($(this).parents(".ycbody").next(".ycbody").find(".ycbodyinp").length == 1) {
			if($(this).parents(".ycbody").next(".ycbody").find(".ycbodyinp").hasClass('diffTermCodeinp')) {
				if($(this).parents(".ycbody").next(".ycbody").find(".ycbodyinp").attr('disabled') == 'disabled' || $(this).parents(".ycbody").next(".ycbody").find(".ycbodyinp").attr('disabled') == 'true') {
					$(this).parents('.voucher-yc-bo').find('.yctz').focus().select();
				} else {
					$(this).parents(".ycbody").next(".ycbody").find(".ycbodyinp").focus().select();
				}
			} else {
				$(this).parents(".ycbody").next(".ycbody").find(".ycbodyinp").focus().select();
			}
		} else {
			$(this).parents(".ycbody").next(".yctz").focus().select();
		}
	}
})
$(document).on("keydown", ".billTypeinp,.curcodeinp", function(event) {
	event = event || window.event;
	if(event.keyCode == 13) {
		if($(this).val() == '') {
			$(".ycbodys").hide();
			if($(this).parents(".ycbody").next(".ycbody").find(".ycbodyinp").length == 1) {
				$(this).parents(".ycbody").next(".ycbody").find(".ycbodyinp").focus().select();
			} else {
				$(this).parents(".ycbody").next(".yctz").focus().select();
			}
		}
	}
})

$(document).on("blur", ".daoqiri,.billNoinp,.billDateinp,.priceinp,.qtyinp,.exrateinp,.curramtinp,.bussDate", function(event) {
	if($(this).parents(".voucher-yc-bo").attr('op') != 0 && $(this).parents(".voucher-yc-bo").attr('op') != 2) {
		$(this).parents(".voucher-yc-bo").attr('op', 1)
		$(this).parents(".voucher-center").attr('op', 1)
	}
})
//汇率 外币金额
$(document).on("keyup", ".rateInput,.curInput", function() {
	var c = $(this);
	if(/[^\d.]/.test(c.val())) { //替换非数字字符  
		var temp_amount = c.val().replace(/[^\d.-]/g, '');
		$(this).val(temp_amount);
	}
});
//汇率最多保留6位小数点
$(document).on("blur", ".rateInput", function() {
	if($(this).val() != "" && $(this).val() != "0.00") {
		var s = parseFloat($(this).val().split(",").join(""));
		var str = s.toString()
		var a = str.substring(str.indexOf(".") + 1);
		if(a.length > 6) {
			s = s.toFixed(6);
		}
	} else {
		var s = "0.00";
	}
	$(this).val(s);
})
//外币金额
$(document).on("blur", ".curInput", function() {
	if($(this).val() != "" && $(this).val() != "0.00") {
		var s = parseFloat($(this).val().split(",").join(""));
		s = s.toFixed(2);
	} else {
		var s = "0.00";
	}
	$(this).val(s);
});

$(document).on("keydown", ".curInput,.rateInput", function(event) {
	var editStatus0 = ($("#pzzhuantai").attr("vou-status") == undefined);
	if(!editStatus0) {
		var editStatus1 = ($("#pzzhuantai").attr("vou-status") == "O");
		var editStatus2 = (isInputor == true && (selectdata.data.inputor == ufgovkey.svUserCode || selectdata.data.inputor == undefined))
		var editStatus3 = ((isvousource && isvousourceclick == false) || isvousourceclick)
		var editStatus4 = $(this).parents('.voucher-yc-bo').attr('ifEdit')=='false'
		if(editStatus1 && (editStatus2 || isInputor == false) && editStatus3 && !editStatus4  && vouiseditsave) {
			$(this).removeAttr("readonly");
		} else {
			$(this).attr("readonly", true);
			return false;
		}
	} else {
		$(this).removeAttr("readonly");
	}

	event = event || window.event;
	var keyCode = event.keyCode
	_this = $(this);
	//当摁下enter换行
	if(keyCode == "13") {
		if(_this.val() == "") {
			_this.val("0.00");
		}
		_this.next("input").focus().select();
	}
})