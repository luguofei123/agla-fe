//主体表格第二列事件
//鼠标移入显示全称
$(document).on("mousemove", ".accounting", function() {
	$(this).attr('title', $(this).find('.accountinginp').val())
})
//阻止冒泡事件
$(document).on("click", ".accountinginp", function(e) {
	stopPropagation(e)
})
var nodeleteallname = 1
//聚焦的时候将其对应的下拉框显示
$(document).on("focus", ".accountinginp", function() {
	voucherhover($(this))
	if(!isInputChange()) {
		$(this).attr("readonly", true);
		return false;
	} else {
		$(this).removeAttr("readonly");
		if($(this).parents(".voucher-center").find(".abstractinp").eq(0).val() == "") {
			if($(this).parents(".voucher-body").prevAll(".voucher-center").length >= 1 && vousinglepzzy != true) {
				$(this).parents(".voucher-center").find(".abstractinp").eq(0).val($(this).parents(".voucher-center").prev(".voucher-center").find(".abstractinp").eq(0).val())
			} else if($(this).parents(".voucher-centercw").length >= 1 && $(this).parents(".voucher-center").prevAll(".voucher-center").length >= 1 && vousinglepzzy == true) {
				var voucherabstract = $(this).parents(".voucher-center").prev(".voucher-center").find('.voucher-centercw').find(".abstractinp").eq(0).val()
				if(voucherabstract == '') {
					voucherabstract = $(this).parents(".voucher-center").prev(".voucher-center").find('.voucher-centerys').find(".abstractinp").eq(0).val()
				}
				$(this).parents(".voucher-center").find(".abstractinp").eq(0).val(voucherabstract)
			} else if($(this).parents(".voucher-centerys").length >= 1 && $(this).parents(".voucher-center").prevAll(".voucher-center").length >= 1 && vousinglepzzy == true) {
				var voucherabstract = $(this).parents(".voucher-center").prev(".voucher-center").find('.voucher-centerys').find(".abstractinp").eq(0).val()
				if(voucherabstract == '') {
					voucherabstract = $(this).parents(".voucher-center").prev(".voucher-center").find('.voucher-centercw').find(".abstractinp").eq(0).val()
				}
				$(this).parents(".voucher-center").find(".abstractinp").eq(0).val(voucherabstract)
			}
		}
		if(vousinglepzzy == true && vousinglepz == false){
			$('.voucher-center').removeClass("voucher-hover").removeClass("voucher-hovercw").removeClass("voucher-hoverys")
			if($(this).parents(".voucher-centercw").length>0){
				$(this).parents(".voucher-center").addClass('voucher-hover').addClass('voucher-hovercw')
			}else if($(this).parents(".voucher-centerys").length>0){
				$(this).parents(".voucher-center").addClass('voucher-hover').addClass('voucher-hoverys')
			}
		}else{
			$(this).parents(".voucher-center").addClass('voucher-hover')
		}
	}
	$(".all-no").hide();
	if(isclick0 == 0 && !ie11compatible){
		var codebi = $(this).attr('code')
		var codebis = $(this).attr('fname')
		var namebi = $(this).attr('name')
		if($(this).val() == codebi + ' ' + namebi || $(this).val() == codebi + ' ' + codebis) {
			$(this).val(codebi)
			if(isaccfullname) {
				$(this).attr('allname', codebi + ' ' + codebis)
			} else {
				$(this).attr('allname', codebi + ' ' + namebi)
			}
			var accindex = $(this).attr('accoindex')
			voucherycTitleData(accindex)
		}
		$(this).addClass("accountcheck")
		accoSelShow($(this))
		if($(this).val() != '') {
			nodeleteallname = 2
			$(this).trigger("input")
			nodeleteallname = 1
		} else {
			if(isdefaultopen){
				for(var i=0;i<$('.selAccoTree').find('li').length;i++){
					$('.selAccoTree').find('li').eq(i).show().addClass('PopListBoxItem').show().removeClass('selected')
					$('.selAccoTree').find('li').eq(i).find('p').removeClass('sq')
				}
			}else{
				for(var i=0;i<$('.selAccoTree').find('li').length;i++){
					if($('.selAccoTree').find('li').eq(i).attr('levNum') >0){
						$('.selAccoTree').find('li').eq(i).hide().removeClass('PopListBoxItem').removeClass('selected')
					}else{
						$('.selAccoTree').find('li').eq(i).show()
						$('.selAccoTree').find('li').eq(i).find('p').addClass('sq')
						if($('.selAccoTree').find('li').eq(i).hasClass('PopListBoxItem')!=true){
							$('.selAccoTree').find('li').eq(i).addClass('PopListBoxItem').show().removeClass('selected')
						}
					}
				}
			}
			$('.selAccoTree').find(".bukedian").removeClass("PopListBoxItem").addClass("noselected").hide();
			$('.selAccoTree').find(".xzkjkm").removeClass("PopListBoxItem").addClass("noselected").hide();
		}
		if(vouisvague) {
			if($(this).val() != "") {
				for(var i = 0; i < $('.selAccoTree').find("li").length - 2; i++) {
					var tempStr = $('.selAccoTree').find("li").eq(i).text();
					var bool = tempStr.indexOf($(this).val());
					var tempStr2 = $('.selAccoTree').find("li").eq(i).find('.ACCO_CODE').text() + " " + $('.selAccoTree').find("li").eq(i).attr('fname')
					var bool2 = tempStr2.indexOf($(this).val());
					if(bool >= 0 || bool2 >= 0) {
						$('.selAccoTree').find("li").eq(i).removeClass("noselected").addClass("PopListBoxItem");
						$('.selAccoTree').find(".bukedian").removeClass("PopListBoxItem").addClass("noselected").hide();
						$('.selAccoTree').find(".xzkjkm").removeClass("PopListBoxItem").addClass("noselected").hide();
					} else {
						$('.selAccoTree').find("li").eq(i).addClass("noselected").removeClass("PopListBoxItem");
						$('.selAccoTree').find(".bukedian").removeClass("PopListBoxItem").addClass("noselected").hide();
						$('.selAccoTree').find(".xzkjkm").removeClass("PopListBoxItem").addClass("noselected").hide();
					}
				}
			}
		} else {
			if($(this).val() != '') {
				for(var i = 0; i < $('.selAccoTree').find("li").length - 2; i++) {
					var codebi = $('.selAccoTree').find("li").eq(i).find(".ACCO_CODE").text().substring(0, $(this).val().length)
					var codebis = $('.selAccoTree').find("li").eq(i).attr('fname').substring(0, $(this).val().length)
					var namebi = $('.selAccoTree').find("li").eq(i).find(".ACCO_NAME").text().substring(0, $(this).val().length)
					if($(this).val() == codebi || $(this).val() == namebi || $(this).val() == codebis || $(this).val() == codebi + " " + codebis || $(this).val() == codebi + " " + namebi) {
						$('.selAccoTree').find("li").eq(i).removeClass("noselected").addClass("PopListBoxItem");
						$('.selAccoTree').find(".bukedian").removeClass("PopListBoxItem").addClass("noselected").hide();
						$('.selAccoTree').find(".xzkjkm").removeClass("PopListBoxItem").addClass("noselected").hide();
					} else {
						$('.selAccoTree').find("li").eq(i).addClass("noselected").removeClass("PopListBoxItem");
						$('.selAccoTree').find(".bukedian").removeClass("PopListBoxItem").addClass("noselected").hide();
						$('.selAccoTree').find(".xzkjkm").removeClass("PopListBoxItem").addClass("noselected").hide();
					}
				}
			}
		}
		if($(this).val() == '' && $(this).parents('.voucher-centerhalf').hasClass('voucher-centerys') && $(this).parents('.voucher-centerhalf').prev('.voucher-centerhalf').find('.accountinginp').val() != '') {
			for(var i = 0; i < $('.voucher-centerhalf').length; i++) {
				$('.voucher-centerhalf').eq(i).attr('indexs', $('.voucher-centerhalf').eq(i).index())
			}
			var z = 0
			for(var i = 0; i < $('.voucher-centerys').length; i++) {
				if($('.voucher-centerys').eq(i).hasClass('deleteclass')) {
					z++
				}
				$('.voucher-centerys').eq(i).attr('indexsys', i)
			}
			var dataindex = $(this).parents('.voucher-centerys').attr('indexsys') - z
			var thisindex = $(this).parents('.voucher-centerhalf').prev('.voucher-centerhalf').attr('indexs')
			var thisindexs = $(this).parents('.voucher-centerhalf').attr('indexs')
			var dataup = huoqu('isf')
			var datacwup = []
			var dataysup = []
			for(var i = 0; i < dataup.vouDetails.length; i++) {
				if(dataup.vouDetails[i].vouSeq == thisindex) {
					datacwup.push(dataup.vouDetails[i])
				}
			}
			var _this = $(this)
			if(datacwup.length > 0) {
				ufma.ajaxDef('/gl/vou/selectEleAccoLink/' + rpt.nowAgencyCode + '/' + rpt.nowAcctCode, 'post', datacwup, function(data) {
					if(data.data.length == 1) {
						voucopydata = data.data[0]
						chapzone(_this.parents('.voucher-centerhalf'))
						_this.focus().select()
					} else if(data.data.length == datacwup.length) {
						for(var i = 0; i < data.data.length; i++) {
							dataup.vouDetails.push(data.data[i])
						}
						if(selectdata.data == undefined) {
							selectdata.data = {}
						}
						selectdata.data.vouDetails = dataup.vouDetails
						chapz()
						zhuantai()
						$('.voucher-centerys').eq(dataindex).find('.accountinginp').focus().select()
					} else if(data.data.length > 1) {
						var vouaccRelationtr = ''
						vouaccRelationtr += '<thead>'
						vouaccRelationtr += '<tr>'
						vouaccRelationtr += '<th style="width:35px;">'
						vouaccRelationtr += '<label class="mt-checkbox mt-checkbox-single mt-checkbox-outline">'
						vouaccRelationtr += '<input type="checkbox" class="checkalls">&nbsp;<span></span>'
						vouaccRelationtr += '</label>'
						vouaccRelationtr += '</th>'
						vouaccRelationtr += '<th>会计科目</th>'
						vouaccRelationtr += '</tr>'
						vouaccRelationtr += '</thead>'
						vouaccRelationtr += '<tbody>'
						for(var i = 0; i < data.data.length; i++) {
							vouaccRelationtr += '<tr datas=' + JSON.stringify(data.data[i]) + '><td style="width:35px;">'
							vouaccRelationtr += '<label class="mt-checkbox mt-checkbox-single mt-checkbox-outline">'
							vouaccRelationtr += '<input type="checkbox">&nbsp;<span></span>'
							vouaccRelationtr += '</label>'
							vouaccRelationtr += '</td>'
							vouaccRelationtr += '<td class="relationacc" title = "' + data.data[i].accoCode + ' ' + data.data[i].accoFullName + '">' + data.data[i].accoCode + ' ' + data.data[i].accoFullName + '</td>'
							vouaccRelationtr += '</tr>'
						}
						vouaccRelationtr += '</tbody>'
						$("#vouaccRelationtable").html(vouaccRelationtr)
						$('#vouaccRelationtr').find('input[type="checkbox"]').prop("checked", false)
						$('#vouaccRelationtable').attr('remind', thisindexs)
						if(isfocusmodal || $('.u-overlay').length == 0) {
							isfocusmodal = false
							page.editor = ufma.showModal('vouaccRelation', 750, 350);
						}
					}
				})
			}
		}
		//	$(this).select()
		if($(this).parents(".accounting").attr('fudata') != undefined &&  $(this).attr('code')!=undefined) {
			var strdata = JSON.parse($(this).parents(".accounting").attr('fudata'))
			var accoSurplus = $(this).parents(".accounting").attr('accoSurplus')
			var dfDc = $(this).parents(".accounting").attr('dfDc')
			chaclickfu($(this).parents('.accounting'), strdata, accoSurplus, dfDc)
			$(this).parents(".accounting").removeAttr('fudata')
		}
		
	}
})
//输入框内容改变的时候执行模糊查询,根据内容查询下拉并筛选
function searchacc(obj, val) {
	setTimeout(function() {
		accoSelShow(obj)
		var newval = obj.val()
		if(val == newval) {
			$('.selAccoTree').animate({
				scrollTop: 0
			}, 0);
			inde = 0;
			$('.selAccoTree').find("li p").removeClass('sq')
			//确保下拉框显示
			if(vouisvague) {
				for(var i = 0; i < $('.selAccoTree').find("li").length - 2; i++) {
					if(obj.val() == "") {
						$('.selAccoTree').find("li").eq(i).removeClass("noselected").addClass("PopListBoxItem");
						$('.selAccoTree').find(".bukedian").removeClass("PopListBoxItem").addClass("noselected").hide();
						$('.selAccoTree').find(".xzkjkm").removeClass("PopListBoxItem").addClass("noselected").hide();
					} else {
						var tempStr = $('.selAccoTree').find("li").eq(i).text();
						var bool = tempStr.indexOf(obj.val());
						var tempStr2 = $('.selAccoTree').find("li").eq(i).find('.ACCO_CODE').text() + " " + $('.selAccoTree').find("li").eq(i).attr('fname')
						var bool2 = tempStr2.indexOf(obj.val());
						if(bool >= 0 || bool2 >= 0) {
							$('.selAccoTree').find("li").eq(i).removeClass("noselected").addClass("PopListBoxItem");
							$('.selAccoTree').find(".bukedian").removeClass("PopListBoxItem").addClass("noselected").hide();
							$('.selAccoTree').find(".xzkjkm").removeClass("PopListBoxItem").addClass("noselected").hide();
						} else {
							$('.selAccoTree').find("li").eq(i).addClass("noselected").removeClass("PopListBoxItem");
							$('.selAccoTree').find(".bukedian").removeClass("PopListBoxItem").addClass("noselected").hide();
							$('.selAccoTree').find(".xzkjkm").removeClass("PopListBoxItem").addClass("noselected").hide();
						}
					}
				}
			} else {
				for(var i = 0; i < $('.selAccoTree').find("li").length - 2; i++) {
					var codebi = $('.selAccoTree').find("li").eq(i).find(".ACCO_CODE").text().substring(0, obj.val().length)
					var codebis = $('.selAccoTree').find("li").eq(i).attr('fname').substring(0, obj.val().length)
					var namebi = $('.selAccoTree').find("li").eq(i).find(".ACCO_NAME").text().substring(0, obj.val().length)
					if(obj.val() == codebi || obj.val() == namebi || obj.val() == codebis || obj.val() == codebi + " " + codebis || obj.val() == codebi + " " + namebi) {
						$('.selAccoTree').find("li").eq(i).removeClass("noselected").addClass("PopListBoxItem").show();
						$('.selAccoTree').find(".bukedian").removeClass("PopListBoxItem").addClass("noselected").hide();
						$('.selAccoTree').find(".xzkjkm").removeClass("PopListBoxItem").addClass("noselected").hide();
					} else {
						$('.selAccoTree').find("li").eq(i).addClass("noselected").removeClass("PopListBoxItem").hide();
						$('.selAccoTree').find(".bukedian").removeClass("PopListBoxItem").addClass("noselected").hide();
						$('.selAccoTree').find(".xzkjkm").removeClass("PopListBoxItem").addClass("noselected").hide();
					}
				}
			}
			for(var i = 0; i < $('.selAccoTree').find(".PopListBoxItem").length; i++) {
				if($('.selAccoTree').find(".PopListBoxItem").eq(i).hasClass("clik1")) {
					$('.selAccoTree').find("li").removeClass("selected").addClass("unselected");
					$('.selAccoTree').find(".PopListBoxItem").eq(i).removeClass("unselected").addClass("selected");
					inde = i;
					$('.selAccoTree').animate({
						scrollTop: (inde - 4) * 30
					}, 0);
					break;
				}
			}
			for(var i = 0; i < $('.selAccoTree').length; i++) {
				if($('.selAccoTree').eq(i).find(".selected").attr("cashflow") == "1") {
					$(".xjll").slideDown(100);
					break;
				} else {
					$(".xjll").hide();
				}
			}
			//当模糊查询所有内容都不符合的时候,出现新增科目选项
			if($('.selAccoTree').find(".PopListBoxItem").length == 0) {
				$('.selAccoTree').find("li").removeClass("selected").addClass("unselected");
				$(".bukedian").show();
				$(".xzkjkm").show();
				if(obj.parents(".voucher-center").find(".voucher-yc").css("display") != "none" && obj.parents(".voucher-center").find(".voucher-yc").length >= 1) {
					$(".voucherall").height($(".voucherall").height() - obj.parents(".voucher-center").find(".voucher-yc").outerHeight())
					voucherycshowheight()
					
				}
				obj.parents(".accounting").nextAll(".voucher-yc").hide();
				obj.parents(".voucher-center").find(".voucher-yc").addClass("deleteclass").hide().remove();
				obj.parents(".voucher-center").find(".deleteclass").find(".voucher-yc-bo").attr("op", "2").attr("lastVer", "0");
			} else {
				$(".bukedian").hide().removeClass("PopListBoxItem").addClass("noselected");
				$(".xzkjkm").hide().removeClass("PopListBoxItem").addClass("noselected");
			}
			if(obj.val() == "") {
				obj.parents(".accounting").find(".accountingye").hide();
				obj.parents(".accounting").find(".accountingmx").hide();
				obj.parents(".accounting").find(".fuyan").hide();
				if(obj.parents(".voucher-center").find(".voucher-yc").css("display") != "none" && obj.parents(".voucher-center").find(".voucher-yc").length >= 1) {
					$(".voucherall").height($(".voucherall").height() - obj.parents(".voucher-center").find(".voucher-yc").outerHeight())
					voucherycshowheight()
					

				}
				obj.parents(".accounting").nextAll(".voucher-yc").hide();
				obj.parents(".voucher-center").find(".voucher-yc").addClass("deleteclass").hide().remove();
				obj.parents(".voucher-center").find(".deleteclass").find(".voucher-yc-bo").attr("op", "2").attr("lastVer", "0");
				inde = -1
				obj.next(".accountinginps").animate({
					scrollTop: (inde - 4) * 30
				}, 0);
			}
		}
	}, 100)
}
$(document).on("input propertychange", ".accountinginp", function() {
	if(nodeleteallname == 1) {
		$(this).removeAttr('allname')
		$(this).removeAttr('acca')
		$(this).removeAttr('accoindex')
		$(this).removeAttr('code')
		$(this).removeAttr('name')
		$(this).removeAttr('cashflow')
		$(this).removeAttr('fname')
		$(this).removeAttr('accbal')
		$(this).removeAttr('accitemNum')
	}
	if(isclick0 == 0) {
		searchacc($(this), $(this).val())
	}
});
var isclick0 = 0
//阻止冒泡事件
$(document).on("click", ".selAccoTree .clik0", function(e) {
	stopPropagation(e)
	isclick0 = 1
	$(".accountcheck").addClass('accountcheckblur').blur()
	$('.selAccoTree').find(".PopListBoxItem").removeClass("selected").addClass("unselected");
	var _this = $(this)
	setTimeout(function() {
		var lvnum = parseFloat(_this.attr('levNum')) + 1
		var str = _this.find('.ACCO_CODE').html()
		if(_this.find('p').hasClass('sq') != true) {
			_this.find('p').addClass('sq')
		} else if(_this.find('p').hasClass('sq')) {
			_this.find('p').removeClass('sq')
		}
		for(var i = 0; i < _this.nextAll('li').length; i++) {
			var strnex = _this.nextAll('li').eq(i).find('.ACCO_CODE').html()
			if(strnex != undefined && strnex.substring(0, str.length) == str) {
				if(_this.find('p').hasClass('sq')) {
					_this.nextAll('li').eq(i).hide().removeClass('PopListBoxItem')
				} else {
					var lvnums = _this.nextAll('li').eq(i).attr('levNum')
					if(lvnums == lvnum) {
						_this.nextAll('li').eq(i).show().addClass('PopListBoxItem')
						if(_this.nextAll('li').eq(i).hasClass('clik0')) {
							_this.nextAll('li').eq(i).find('p').addClass('sq')
						}
					} else {
						_this.nextAll('li').eq(i).hide().removeClass('PopListBoxItem')
					}
				}
			} else if(strnex != undefined && strnex.substring(0, str.length) != str) {
				break;
			}
		}
		$(".accountcheck").removeClass('accountcheckblur').focus()
		isclick0 = 0
	}, 201)
})
//点击下拉内容
$(document).on("click", ".selAccoTree .clik1", function() {
	_this = $(this);
	inde = 0;
	ie11compatible = false;
	Obtainaccs($('.accountcheck'), true)
	Obtainaccs($('.accountcheck').parents('.voucher-center').prev('.voucher-center').find('.accountinginp'), false)
	//如果点击的是已经选中的内容就判断是否有辅助核算项,有就显示,没有就隐藏
	if($(this).find("p").find('.ACCO_CODE').text() == $('.accountcheck').attr('code')) {
		if(isaccfullname) {
			$('.accountcheck').val($(this).find("p").find('.ACCO_CODE').text() + " " + $(this).attr('fname')).attr("accbal", $(this).attr("role")).attr('acca', $(this).attr("role"));
		} else {
			$('.accountcheck').val($(this).find("p").text()).attr("accbal", $(this).attr("role")).attr('acca', $(this).attr("role"));
		}
	} else {
	
		$('.accountcheck').parents('.accounting').removeAttr('fudata');
		//点击的是一个新的会计科目的话就将其隐藏的余额,明细账,核算项目全部显示出来,并将点击的内容显示到输入框内
		$('.accountcheck').parents(".accounting").find(".accountingye").show();
		$('.accountcheck').parents(".accounting").find(".accountingmx").show();
		if(isaccfullname) {
			$('.accountcheck').val($(this).find("p").find('.ACCO_CODE').text() + " " + $(this).attr('fname')).attr("accbal", $(this).attr("role")).attr('acca', $(this).attr("role"));
		} else {
			$('.accountcheck').val($(this).find("p").text()).attr("accbal", $(this).attr("role")).attr('acca', $(this).attr("role"));
		}
		$('.accountcheck').attr('acca', $(this).attr('acca'))
		$('.accountcheck').attr('accoindex', $(this).attr('name'))
		voucherycTitleData($(this).attr('name'))
		$('.accountcheck').attr('code', $(this).find(".ACCO_CODE").text())
		$('.accountcheck').attr('name', $(this).find(".ACCO_NAME").text())
		$('.accountcheck').attr('cashflow', $(this).attr('cashflow'))
		$('.accountcheck').attr('fname', $(this).attr('fname'))
		if($(this).hasClass('fuhs0')){
			$('.accountcheck').attr('accitemNum','0')
		}else{
			$('.accountcheck').attr('accitemNum', '1')
		}
		$('.accountcheck').removeAttr('allname')
		$('.accountcheck').parents('.accounting').attr('title', $(this).find("p").text())
		//判断点击的内容是否有辅助核算项.
		if($(this).hasClass("fuhs0")) {
			$('.accountcheck').parents(".accounting").removeAttr("fudata");
			//判断如果是第一行的话就将光标默认在借方,如果不是则根据内容,如果是属于借方就将光标移到借方,如果是贷方就移到贷方
			if($('.accountcheck').parents(".voucher-center").prev('.voucher-center').length == 0) {
				$('.accountcheck').parents('.accounting').next(".moneyj").find(".money-xs").hide();
				$('.accountcheck').parents('.accounting').next(".moneyj").find(".money-xsbg").hide();
				$('.accountcheck').parents('.accounting').next(".moneyj").find(".money-sr").show().focus().select();
			} else {
				if($(this).attr("role") == "1") {
					$('.accountcheck').parents('.accounting').next(".moneyj").find(".money-xs").hide();
					$('.accountcheck').parents('.accounting').next(".moneyj").find(".money-xsbg").hide();
					$('.accountcheck').parents('.accounting').next(".moneyj").find(".money-sr").show().focus().select();
				} else {
					$('.accountcheck').parents('.accounting').next().next(".moneyd").find(".money-xs").hide();
					$('.accountcheck').parents('.accounting').next().next(".moneyd").find(".money-xsbg").hide();
					$('.accountcheck').parents('.accounting').next().next(".moneyd").find(".money-sr").show().focus().select();

				};
			}
			$('#voudetailassyc').html('')
			//执行完所有操作后,隐藏下拉框
			$(".AccoTree").hide();
		} else {
			//如果说是有辅助核算项的话,首先将借贷方金额内容清空,因为有辅助核算项的话只能根据辅助核算项更改
			$('.accountcheck').parents(".voucher-center").find(".money-sr").val("");
			$('.accountcheck').parents(".voucher-center").find(".money-xs").html("");
			$('.accountcheck').parents(".voucher-center").find(".money-jd").removeClass("money-ys");
			//然后执行一下总金额比对函数
			bidui()
			//继续还是清除原来所有的辅助核算项
			$('#voudetailassyc').html('')
			//将遍历拼接出来的辅助核算项放在当前分录内
			var voucheryc = fzhspzpj(_this)
			$('#voudetailassyc').html(voucheryc);
			$('.accountcheck').addClass('nowshowyc')
			$('.daoqiri,.billDateinp,.bussDate').datetimepicker(glRptJournalDate)
			voucherYcAssCss($('.voudetailAss').find('.voucher-yc').eq(0))
			var ss = _this.attr("name");
			if(quanjuvoudatas.data[ss].defcurCode != '' && quanjuvoudatas.data[ss].currency == 1) {
				for(var j = 0; j < $('#voudetailassyc').find('.curcodeinp').length; j++) {
					if($('#voudetailassyc').find('.curcodeinp').eq(j).val() == '') {
						for(var z = 0; z < $('#AssDataAll').find(".currency").find('li').length; z++) {
							var nowthis = $('#AssDataAll').find(".currency").find('li').eq(z)
							if(nowthis.find('.code').html() == quanjuvoudatas.data[ss].defcurCode) {
								var codecur = $('#AssDataAll').find(".currency").find('li').eq(z).find('.code').text()
								var curtext = $('#AssDataAll').find(".currency").find('li').eq(z).text()
								var exrate = $('#AssDataAll').find(".currency").find('li').eq(z).attr('exrate')
								var rateDigits = $('#AssDataAll').find(".currency").find('li').eq(z).attr('rateDigits')
								$('#voudetailassyc').find('.curcodeinp').val(curtext).attr('code', codecur)
								$('#voudetailassyc').find('.exrateinp').val(curexratefzhsxl[exrate]).attr('exrate', exrate).attr('rateDigits', rateDigits)
							}
						}
					}
				}
			}
			_this.blur();
			if(temporaryfzhs.length > 0) {
				var pasyc = $('#voudetailassyc')
				setfzhsxl(temporaryfzhs, pasyc)
			} else if(isHistoryfzhs && temporaryfzhsprev.length > 0) {
				var pasyc = $('#voudetailassyc')
				setfzhsxl(temporaryfzhsprev, pasyc)
			}
			//将焦点聚集到第一个输入框内,并且显示其下拉框
			$('#voudetailassyc').find(".ycbodyinp").eq(0).focus();
			//隐藏原来的下拉框
			$(".AccoTree").hide();
		}
		//将原来的选中取消并未点击内容添加点中,然后将scroll到最上方
		$(this).parents('.selAccoTree').find("li").removeClass("selected").addClass("unselected");
		$(this).removeClass("unselected").addClass("selected");
		$('.selAccoTree').animate({
			scrollTop: 0
		}, 0);
	}
	if(vousinglepz == true) {
		if($('.accountcheck').attr('acca') == '1') {
			$('.accountcheck').parents('.voucher-center').removeClass('voucher-center-ys').removeClass('voucher-center-cw').addClass('voucher-center-cw')
			$('.accountcheck').parents('.voucher-center').find('.vouchertypebody').html('<div class="vouchertypebodycw">财</div>')

		} else if($('.accountcheck').attr('acca') == '2') {
			$('.accountcheck').parents('.voucher-center').removeClass('voucher-center-ys').removeClass('voucher-center-cw').addClass('voucher-center-ys')
			$('.accountcheck').parents('.voucher-center').find('.vouchertypebody').html('<div class="vouchertypebodyys">预</div>')
		}
	}
	for(var i = 0; i < $(".accountinginp").length; i++) {
		if($(".accountinginp").eq(i).attr("cashflow") == "1") {
			$(".xjll").slideDown(100);
			break;
		} else {
			$(".xjll").hide();
		}
	}
	//运行比对函数
	bidui();
})
//为输入框添加键盘事件
$(document).on("keydown", ".accountinginp", function(event) {
	if(!isInputChange()) {
		$(this).attr("readonly", true);
		return false;
	} else {
		$(this).removeAttr("readonly");
	}
	_this = $(this);
	for(var i = 0; i < $('.selAccoTree').find(".PopListBoxItem").length; i++) {
		$('.selAccoTree').find(".PopListBoxItem").eq(i).index = i;
	}
	event = event || window.event;
	if(event.keyCode == 69 && event.altKey) {
		event.preventDefault();
		for(var i = 0; i < $('.voucher-center').length; i++) {
			$('.voucher-center').eq(i).attr('indexs', $('.voucher-center').eq(i).index())
		}
		var z = 0
		for(var i = 0; i < $('.voucher-center').length; i++) {
			if($('.voucher-center').eq(i).hasClass('deleteclass')) {
				z++
			}
			$('.voucher-center').eq(i).attr('indexsys', i)
		}
		var dataindex = $(this).parents('.voucher-center').attr('indexsys') - z
		var dataup = huoqu('isf')
		var datacwup = []
		var dataysup = []
		for(var i = 0; i < dataup.vouDetails.length; i++) {
			if(dataup.vouDetails[i].accaCode == '1' && dataup.vouDetails[i].accoCode != '') {
				datacwup.push(dataup.vouDetails[i])
			}
		}
		var _this = $(this)
		if(datacwup.length > 0) {
			ufma.ajaxDef('/gl/vou/selectEleAccoLink/' + rpt.nowAgencyCode + '/' + rpt.nowAcctCode, 'post', datacwup, function(data) {
				if(data.data.length == 1) {
					voucopydata = data.data[0]
					chapzone(_this.parents('.voucher-center'))
					_this.focus().select()
				} else if(data.data.length == datacwup.length) {
					for(var i = 0; i < data.data.length; i++) {
						dataup.vouDetails.push(data.data[i])
					}
					if(selectdata.data == undefined) {
						selectdata.data = {}
					}
					selectdata.data.vouDetails = dataup.vouDetails
					chapz()
					zhuantai()
					$('.voucher-center').eq(dataindex).find('.accountinginp').focus().select()
				} else if(data.data.length > 1) {
					var vouaccRelationtr = ''
					vouaccRelationtr += '<thead>'
					vouaccRelationtr += '<tr>'
					vouaccRelationtr += '<th style="width:35px;">'
					vouaccRelationtr += '<label class="mt-checkbox mt-checkbox-single mt-checkbox-outline">'
					vouaccRelationtr += '<input type="checkbox" class="checkalls">&nbsp;<span></span>'
					vouaccRelationtr += '</label>'
					vouaccRelationtr += '</th>'
					vouaccRelationtr += '<th>会计科目</th>'
					vouaccRelationtr += '</tr>'
					vouaccRelationtr += '</thead>'
					vouaccRelationtr += '<tbody>'
					for(var i = 0; i < data.data.length; i++) {
						vouaccRelationtr += '<tr datas=' + JSON.stringify(data.data[i]) + '><td style="width:35px;">'
						vouaccRelationtr += '<label class="mt-checkbox mt-checkbox-single mt-checkbox-outline">'
						vouaccRelationtr += '<input type="checkbox">&nbsp;<span></span>'
						vouaccRelationtr += '</label>'
						vouaccRelationtr += '</td>'
						vouaccRelationtr += '<td class="relationacc">' + data.data[i].accoCode + ' ' + data.data[i].accoName + '</td>'
						vouaccRelationtr += '</tr>'
					}
					vouaccRelationtr += '</tbody>'
					$("#vouaccRelationtable").html(vouaccRelationtr)
					$('#vouaccRelationtr').find('input[type="checkbox"]').prop("checked", false)
					$('#vouaccRelationtable').attr('remind', thisindexs)
					page.editor = ufma.showModal('vouaccRelation', 450, 350);
				}
			})
		}
		event.keyCode = 0;
		if(event.preventDefault) { // firefox
			event.preventDefault();
		} else { // other
			event.returnValue = false;
		}
	}
	if(event.keyCode == 9) {
		event.preventDefault();
		if(keydownctrls == true && $("#btn-voucher-bc").length == 1) {
			keydownctrls = false;
			_this = $(this)
			setTimeout(function() {
				if(vousinglepzzy) {
					if(_this.parents(".voucher-centercw").length>0) {
						$(".voucher-centerys").eq(0).find('.abstractinp').focus()
					} else {
						$(".voucher-centercw").eq(0).find('.abstractinp').focus()
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
	if(event.keyCode == "27") {
		event.preventDefault();
		event.keyCode = 0;
		event.preventDefault();
		event.returnValue = false;
		if(_this.parents('.voucher-center').find('.voucher-yc').css('display') != 'none') {
			_this.parents('.voucher-center').find('.voucher-yc').hide()
			$(".voucherall").height($(".voucherall").height() - _this.parents('.voucher-center').find('.voucher-yc').outerHeight())
			if($(".voucher").eq(0).hasClass('voucher-singelzybg') || $(".voucher").eq(0).hasClass('voucher-singelzyx')) {
				var lenss = $('.voucher-footer').eq(0).offset().top - $(window).scrollTop() + 60
				$('.voucher-singelzybg,.voucher-singelzyx').find(".voucher-yc").css("top", lenss + 'px')
				if($('.voucher-singelzybg,.voucher-singelzyx').find(".voucherycshow").css("display") != 'none') {
					$('.voucher-singelzybg,.voucher-singelzyx').find(".voucherycshow").css("display", 'none')
					$(".voucherall").height($(".voucherall").height() - 120)
					voucherycshowheight()
					
				}
			}
		}
	}
	//打开模板
	if(event.ctrlKey && event.keyCode == 81) {
		searchmobandata = $(this).val()
		if($(this).parents('.voucher-center').find('.abstractinp').val() != '' && $(this).parents('.voucher-center').find('.abstractinp').length > 0) {
			searchmobandata += " " + $(this).parents('.voucher-center').find('.abstractinp').val()
		}
		$('#mbsr').trigger('click')
		event.preventDefault();
		event.returnValue = false;
		event.keyCode == 0
		return false;
	}
	//如果摁下的是上键,则对下拉框执行向上模拟下拉框事件
	if(event.shiftKey && event.keyCode == 13) {
		event.preventDefault();
		if($(this).parents(".voucher-center").hasClass('voucher-centercw')) {
			for(var i = 0; i < $(".voucher-centerys").length; i++) {
				if($(".voucher-centerys").eq(i).hasClass("deleteclass") != true) {
					$(".accountinginps").hide();
					$(".voucher-centerys").eq(i).find(".accountinginp").focus().select();
					break;
				}
			}
		} else if($(this).parents(".voucher-center").hasClass('voucher-centerys')) {
			for(var i = 0; i < $(".voucher-centercw").length; i++) {
				if($(".voucher-centercw").eq(i).hasClass("deleteclass") != true) {
					$(".abstractinps").hide();
					$(".voucher-centercw").eq(i).find(".abstractinp").focus().select();
					break;
				}
			}
		}
		event.keyCode = 0;
		if(event.preventDefault) { // firefox
			event.preventDefault();
		} else { // other
			event.returnValue = false;
		}
		return false;
	}
	if(event.keyCode == 38) {
		$('.selAccoTree').find(".PopListBoxItem").removeClass("selected").addClass("unselected");
		inde--;
		if(inde < 0) {
			inde = $('.selAccoTree').find(".PopListBoxItem").length - 1;
		}
		$('.selAccoTree').find(".PopListBoxItem").eq(inde).removeClass("unselected").addClass("selected");
		for(var i = 0; i < $(".accountinginp").length; i++) {
			if($(".accountinginps").eq(i).attr("cashflow") == "1") {
				$(".xjll").slideDown(100);
				break;
			} else {
				$(".xjll").hide();
			}
		}
		$('.selAccoTree').animate({
			scrollTop: (inde - 4) * 30
		}, 0);
	}
	if(event.keyCode == 37) {
		if($('.selAccoTree').find(".selected").hasClass('clik0')) {
			var str = $('.selAccoTree').find(".selected").find('.ACCO_CODE').html()
			var lvnum = parseFloat($('.selAccoTree').find(".selected").attr('levNum')) + 1
			$('.selAccoTree').find(".selected").find('p').addClass('sq')
			for(var i = 0; i < $('.selAccoTree').find(".selected").nextAll('li').length; i++) {
				var strnex = $('.selAccoTree').find(".selected").nextAll('li').eq(i).find('.ACCO_CODE').html()
				if(strnex != undefined && strnex.substring(0, str.length) == str) {
					$('.selAccoTree').find(".selected").nextAll('li').eq(i).hide().removeClass('PopListBoxItem')
				} else if(strnex != undefined && strnex.substring(0, str.length) != str) {
					break;
				}
			}
			for(var i = 0; i < $('.selAccoTree').find(".PopListBoxItem").length; i++) {
				if($('.selAccoTree').find(".PopListBoxItem").eq(i).hasClass('selected')) {
					inde = i
				}
			}
		}
	}
	if(event.keyCode == 39) {
		if($('.selAccoTree').find(".selected").hasClass('clik0')) {
			var str = $('.selAccoTree').find(".selected").find('.ACCO_CODE').html()
			var lvnum = parseFloat($('.selAccoTree').find(".selected").attr('levNum')) + 1
			$('.selAccoTree').find(".selected").find('p').removeClass('sq')
			for(var i = 0; i < $('.selAccoTree').find(".selected").nextAll('li').length; i++) {
				var strnex = $('.selAccoTree').find(".selected").nextAll('li').eq(i).find('.ACCO_CODE').html()
				if(strnex != undefined && strnex.substring(0, str.length) == str) {
					var lvnums = $('.selAccoTree').find(".selected").nextAll('li').eq(i).attr('levNum')
					if(lvnums == lvnum) {
						$('.selAccoTree').find(".selected").nextAll('li').eq(i).show().addClass('PopListBoxItem')
						if($('.selAccoTree').find(".selected").nextAll('li').eq(i).hasClass('clik0')) {
							$('.selAccoTree').find(".selected").nextAll('li').eq(i).find('p').addClass('sq')
						}
					} else {
						$('.selAccoTree').find(".selected").nextAll('li').eq(i).hide().removeClass('PopListBoxItem')
					}
				} else if(strnex != undefined && strnex.substring(0, str.length) != str) {
					break;
				}
			}
			for(var i = 0; i < $('.selAccoTree').find(".PopListBoxItem").length; i++) {
				if($('.selAccoTree').find(".PopListBoxItem").eq(i).hasClass('selected')) {
					inde = i
				}
			}
		}
	}
	//如果摁下的是下键,则对下拉框执行向下模拟下拉框事件
	if(event.keyCode == 40) {
		if($('.selAccoTree').find(".selected").length == 0) {
			inde = -1;
		}
		$('.selAccoTree').find(".PopListBoxItem").removeClass("selected").addClass("unselected");
		inde++;
		if(inde >= $('.selAccoTree').find(".PopListBoxItem").length) {
			inde = 0;
		}
		$('.selAccoTree').find(".PopListBoxItem").eq(inde).removeClass("unselected").addClass("selected");
		for(var i = 0; i < $(".accountinginps").length; i++) {
			if($(".accountinginps").eq(i).find(".selected").attr("cashflow") == "1") {
				$(".xjll").slideDown(100);
				break;
			} else {
				$(".xjll").hide();
			}
		}
		$('.selAccoTree').animate({
			scrollTop: (inde - 4) * 30
		}, 0);
	}
	//当摁下enter键的时候执行点击事件相同的内容
	if(event.keyCode == 13) {
		if($('.selAccoTree').find(".selected").length > 0 && $('.selAccoTree').find(".selected").hasClass('clik1') == true) {
			if($(this).attr('code') == $('.selAccoTree').find(".selected").find("p").find('.ACCO_CODE').text()) {
				$('.selAccoTree').hide();
				if($('.selAccoTree').find(".selected").hasClass("fuhs0") != true) {
//						$(this).parents(".voucher-center").find(".voucher-yc").eq(i).find("input").eq(0).click();
				} else {
					if($(this).parents(".voucher-center").prev('.voucher-center').length == 0) {
						$(this).parents('.accounting').next(".moneyj").find(".money-xs").hide();
						$(this).parents('.accounting').next(".moneyj").find(".money-xsbg").hide();
						$(this).parents('.accounting').next(".moneyj").find(".money-sr").show();
						$(this).parents('.accounting').next(".moneyj").find(".money-sr").focus().select();
					} else {
						if(quanjuvoudatas.data[$(this).parents(".accounting").find(".accountinginp").attr("accoindex")].accBal == "1") {
							$(this).parents('.accounting').next(".moneyj").find(".money-xs").hide();
							$(this).parents('.accounting').next(".moneyj").find(".money-xsbg").hide();
							$(this).parents('.accounting').next(".moneyj").find(".money-sr").show();
							$(this).parents('.accounting').next(".moneyj").find(".money-sr").focus().select();
						} else {
							$(this).parents('.accounting').next().next(".moneyd").find(".money-xs").hide();
							$(this).parents('.accounting').next().next(".moneyd").find(".money-xsbg").hide();
							$(this).parents('.accounting').next().next(".moneyd").find(".money-sr").show();
							$(this).parents('.accounting').next().next(".moneyd").find(".money-sr").focus().select();
						};
					}
				}
			} else {
				Obtainaccs($(this), true)
				Obtainaccs($(this).parents('.voucher-center').prev('.voucher-center').find('.accountinginp'), false)
				$(this).parents('.accounting').removeAttr('fudata');
				inde = 0;
				var $li = $('.selAccoTree').find(".selected");
				if(isaccfullname) {
					$(this).val($li.find("p").find('.ACCO_CODE').text() + ' ' + $li.attr('fname')).attr("accbal", $li.attr("role"));
				} else {
					$(this).val($li.find("p").text()).attr("accbal", $li.attr("role"));
				}
				$(this).removeAttr('allname')
				$(this).attr('acca', $li.attr("acca"))
				$(this).attr('accoindex', $li.attr('name'))
				$(this).attr('code', $li.find(".ACCO_CODE").text())
				$(this).attr('name', $li.find(".ACCO_NAME").text())
				$(this).attr('cashflow', $li.attr('cashflow'))
				$(this).attr('fname', $li.attr('fname'))
				if($li.hasClass('fuhs0')){
					$('.accountcheck').attr('accitemNum','0')
				}else{
					$('.accountcheck').attr('accitemNum', '1')
				}
				$(this).parents('.accounting').attr('title', $li.find("p").text())
				$(this).parents(".accounting").find(".accountingye").show();
				$(this).parents(".accounting").find(".accountingye").html("余额");
				$(this).parents(".accounting").find(".accountingmx").show();
				$('.selAccoTree').hide();
				if($('.selAccoTree').find(".selected").hasClass("fuhs0")) {
					if($(this).parents(".voucher-center").prev('.voucher-center').length == 0) {
						$(this).parents('.accounting').next(".moneyj").find(".money-xs").hide();
						$(this).parents('.accounting').next(".moneyj").find(".money-xsbg").hide();
						$(this).parents('.accounting').next(".moneyj").find(".money-sr").show();
						$(this).parents('.accounting').next(".moneyj").find(".money-sr").focus().select();
					} else {
						var namei = $(".voucher-hover").find(".accountinginp").attr("accoindex");
						if($(".voucher-hover").hasClass("voucher-hovercw")){
							namei = $(".voucher-hover").find('.voucher-centercw').find(".accountinginp").attr("accoindex");
						}else if($(".voucher-hover").hasClass("voucher-hoverys")){
							namei = $(".voucher-hover").find('.voucher-centerys').find(".accountinginp").attr("accoindex");
						}
						if(quanjuvoudatas.data[namei].accBal == "1") {
							$(this).parents('.accounting').next(".moneyj").find(".money-xs").hide();
							$(this).parents('.accounting').next(".moneyj").find(".money-xsbg").hide();
							$(this).parents('.accounting').next(".moneyj").find(".money-sr").show();
							$(this).parents('.accounting').next(".moneyj").find(".money-sr").focus().select();
						} else {
							$(this).parents('.accounting').next().next(".moneyd").find(".money-xs").hide();
							$(this).parents('.accounting').next().next(".moneyd").find(".money-xsbg").hide();
							$(this).parents('.accounting').next().next(".moneyd").find(".money-sr").show();
							$(this).parents('.accounting').next().next(".moneyd").find(".money-sr").focus().select();
						};
					}
				} else {
					//如果说是有辅助核算项的话,首先将借贷方金额内容清空,因为有辅助核算项的话只能根据辅助核算项更改
					$(this).parents(".voucher-center").find(".money-sr").val("");
					$(this).parents(".voucher-center").find(".money-xs").html("");
					$(this).parents(".voucher-center").find(".money-jd").removeClass("money-ys");
					var voucheryc = fzhspzpj($('.selAccoTree').find(".selected"))
					$("#voudetailassyc").html(voucheryc);
					$(this).addClass('nowshowyc')
					voucherYcAssCss($('.voudetailAss').find('.voucher-yc').eq(0))
					if(_this.parents(".voucher-center").find('.accountinginp').attr('accbal') == 1) {
						_this.parents(".voucher-center").find('.voucher-yc').find('.voucher-yc-j').prop('checked', true)
						_this.parents(".voucher-center").find('.voucher-yc').find('.voucher-yc-d').prop('checked', false)
					} else {
						_this.parents(".voucher-center").find('.voucher-yc').find('.voucher-yc-j').prop('checked', false)
						_this.parents(".voucher-center").find('.voucher-yc').find('.voucher-yc-d').prop('checked', true)
					}
					$('.daoqiri,.billDateinp,.bussDate').datetimepicker(glRptJournalDate)
					for(var i = 0; i < _this.parents(".voucher-center").find(".voucher-yc").length; i++) {
						if(_this.parents(".voucher-center").find(".voucher-yc").eq(i).hasClass("deleteclass")) {} else {
							voucherYcAssCss(_this.parents(".voucher-center").find(".voucher-yc").eq(i))
						}
						var ss = $('.selAccoTree').find(".selected").attr("name");
						if(quanjuvoudatas.data[ss].defcurCode != '' && quanjuvoudatas.data[ss].currency == 1) {
							for(var j = 0; j < _this.parents(".voucher-center").find(".voucher-yc").eq(i).find('.curcodeinp').length; j++) {
								if(_this.parents(".voucher-center").find(".voucher-yc").eq(i).find('.curcodeinp').eq(j).val() == '') {
									for(var z = 0; z < $('#AssDataAll').find(".currency").find('li').length; z++) {
										var nowthis = $('#AssDataAll').find(".currency").find('li').eq(z)
										if(nowthis.find('.code').html() == quanjuvoudatas.data[ss].defcurCode) {
											var codecur = nowthis.find('.code').html()
											var curtext = nowthis.text()
											var exrate = nowthis.attr('exrate')
											var rateDigits = nowthis.attr('rateDigits')
											_this.parents(".voucher-center").find(".voucher-yc").eq(i).find('.curcodeinp').eq(j).val(curtext).attr('code', codecur)
											$('.accountcheck').parents(".voucher-center").find(".voucher-yc").eq(i).find('.curcodeinp').val(curtext).attr('code', codecur)
											_this.parents(".voucher-center").find(".voucher-yc").eq(i).find('.exrateinp').eq(j).val(curexratefzhsxl[exrate]).attr('exrate', exrate).attr('rateDigits', rateDigits)
										}
									}
								}
							}
						}
					}
					$(this).parents(".accounting").nextAll(".voucher-yc").show();
					_this.blur();
					if(temporaryfzhs.length > 0) {
						for(var i = 0; i < $(this).parents(".voucher-center").find(".voucher-yc").length; i++) {
							if($(this).parents(".voucher-center").find(".voucher-yc").eq(i).hasClass("deleteclass") != true) {
								var pasyc = $(this).parents(".voucher-center").find(".voucher-yc").eq(i)
								setfzhsxl(temporaryfzhs, pasyc)
							}
						}
					} else if(isHistoryfzhs && temporaryfzhsprev.length > 0) {
						for(var i = 0; i < $(this).parents(".voucher-center").find(".voucher-yc").length; i++) {
							if($(this).parents(".voucher-center").find(".voucher-yc").eq(i).hasClass("deleteclass") != true) {
								var pasyc = $(this).parents(".voucher-center").find(".voucher-yc").eq(i)
								setfzhsxl(temporaryfzhsprev, pasyc)
							}
						}
					}
					$('#voudetailassyc').find(".ycbodyinp").eq(0).focus();
				}
			}
			if(vousinglepz == true) {
				if($('.selAccoTree').find(".selected").attr('acca') == '1') {
					$(this).parents('.voucher-center').removeClass('voucher-center-ys').removeClass('voucher-center-cw').addClass('voucher-center-cw')
					$(this).parents('.voucher-center').find('.vouchertypebody').html('<div class="vouchertypebodycw">财</div>')

				} else if($('.selAccoTree').find(".selected").attr('acca') == '2') {
					$(this).parents('.voucher-center').removeClass('voucher-center-ys').removeClass('voucher-center-cw').addClass('voucher-center-ys')
					$(this).parents('.voucher-center').find('.vouchertypebody').html('<div class="vouchertypebodyys">预</div>')

				}
			}
		}else{
			$(this).focus()
		}
		$('.selAccoTree').animate({
			scrollTop: 0
		}, 0);
		event.preventDefault();
		event.returnValue = false;
		event.keyCode == 0
		return false;
	}
})
$(document).on("blur", ".daoqiri", function() {
	var myDate = new Date(Date.parse(dd.replace(/-/g, "/")));
	var year = myDate.getFullYear();
	var str = $(this).val();
	var patt1 = new RegExp("^(?:(?!0000)[0-9]{4}(?:(?:0[1-9]|1[0-2])(?:0[1-9]|1[0-9]|2[0-8])|(?:0[13-9]|1[0-2])(?:29|30)|(?:0[13578]|1[02])31)|(?:[0-9]{2}(?:0[48]|[2468][048]|[13579][26])|(?:0[48]|[2468][048]|[13579][26])00)0229)$")
	var patt2 = new RegExp("^(?:(?!0000)[0-9]{4}-(?:(?:0[1-9]|1[0-2])-(?:0[1-9]|1[0-9]|2[0-8])|(?:0[13-9]|1[0-2])-(?:29|30)|(?:0[13578]|1[02])-31)|(?:[0-9]{2}(?:0[48]|[2468][048]|[13579][26])|(?:0[48]|[2468][048]|[13579][26])00)-02-29)$")
	if(patt1.test(str)) {
		var date_str = str.replace(/(\d{4})(\d{2})(\d{2})/g, '$1-$2-$3');
		$(this).val(date_str);
	} else if(patt2.test(str)) {
		$(this).val(str);
	} else {
		//		ufma.showTip("您输入的字符不符合规则", function() {}, "warning");
		$(this).val(result);
	}
})
//阻止点击冒泡事件
$(document).on("click", ".selAccoTree li", function(e) {
	stopPropagation(e)
})
//输入框失去焦点的时候隐藏下拉框
$(document).on("blur", ".accountinginp", function() {
	if(!isInputChange()) {
		$(this).attr("readonly", true);
		return false;
	} else {
		$(this).removeAttr("readonly");
	}
	_thisacc = $(this)
	setTimeout(function() {
		if(isclick0 == 0 && !ie11compatible) {
			//			_thisacc.next(".accountinginps")
			if(_thisacc.attr('code') == undefined && _thisacc.val() != '') {
				_thisacc.val("");
				_thisacc.trigger('input')
				_thisacc.next(".accountinginps").hide();
				_thisacc.parents(".accounting").find(".accountingye").hide();
				_thisacc.parents(".accounting").find(".accountingmx").hide();
			} else if(_thisacc.attr('code') != undefined) {
				if(_thisacc.attr('allname') != undefined) {
					_thisacc.val(_thisacc.attr('allname'))
					_thisacc.removeAttr('allname')
				} else {
					if(isaccfullname) {
						_thisacc.val(_thisacc.attr('code') + " " + _thisacc.attr('fname')).attr("accbal", $('.selAccoTree').find(".selected").attr("role"));
					} else {
						_thisacc.val(_thisacc.attr('code') + " " + _thisacc.attr('name')).attr("accbal", $('.selAccoTree').find(".selected").attr("role"));
					}
				}
			}
			if($('.accountcheck').val() == '') {
				for(var i = 0; i < $('.selAccoTree').find('li').length; i++) {
					if($('.selAccoTree').find('li').eq(i).attr('levNum') > 0) {
						$('.selAccoTree').find('li').eq(i).hide().removeClass('PopListBoxItem')
					} else {
						$('.selAccoTree').find('li').eq(i).show()
						$('.selAccoTree').find('li').eq(i).find('p').addClass('sq')
						if($('.selAccoTree').find('li').eq(i).hasClass('PopListBoxItem') != true) {
							$('.selAccoTree').find('li').eq(i).addClass('PopListBoxItem').show()
						}
					}
				}
			}
			_thisacc.removeClass("accountcheck")
			$('.selAccoTree').find(".bukedian").removeClass("PopListBoxItem").addClass("noselected").hide();
			$('.selAccoTree').find(".xzkjkm").removeClass("PopListBoxItem").addClass("noselected").hide();
			if($('.accountcheck').length < 1) {
				$(".AccoTree").removeClass('selAccoTree').hide(100);
			}
		}
	}, 200)
})

$(document).on("mousemove", ".AccoTree", function() {
	ie11compatible = true
})
$(document).on("mouseout", ".AccoTree", function() {
	ie11compatible = false
})
$(document).on("mouseup", ".AccoTree", function() {
	if(ie11compatible){
		$('.accountcheck').focus()
	}
})
$(document).on("click", ".xzkjkm", function() {
	if(isaccopen) {
		var xzkjkm = {}
		xzkjkm.action = "add";
		xzkjkm.agencyCode = rpt.nowAgencyCode;
		xzkjkm.agencyTypeCode = rpt.AgencyTypeCode
		xzkjkm.acctCode = rpt.nowAcctCode;
		xzkjkm.flag = 1; //表示外部调用会计科目编辑页
		xzkjkm.rgCode = ufgovkey.svRgCode;
		xzkjkm.setYear = ufgovkey.svSetYear;
		ufma.open({
			url: '../../../pf/ma/coaAcc/coaAccEdit.html?menuid=0db80478-4d25-4251-8ed0-3d085a7091a8',
			title: '设置会计科目',
			width: 1100,
			height: 400,
			data: xzkjkm,
			ondestory: function(data) {
				var dwselected = rpt.nowAgencyCode;
				var ztselected = rpt.nowAcctCode;
				$.ajax({
					type: "get",
					url: "/gl/vou/getAccoByAcct/" + dwselected + "/" + ztselected + "?ajax=1&rueicode=" + hex_md5svUserCode,
					dataType: "json",
					async: false,
					success: function(data) {
						quanjuvoudatas = data;
					},
					error: function(data) {
						ufma.showTip("会计科目未加载成功,请检查网络", function() {}, "error");
					}
				});
			}
		});
	} else {
		ufma.showTip("您没有新增会计科目权限", function() {}, "warning");
	}

})