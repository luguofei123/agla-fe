//主体表格第二列事件
//鼠标移入显示全称
$(document).on("mouseover", ".accounting", function() {
	$(this).attr('title', $(this).find('.accountinginp').val())
	if(!$.isNull($(this).find('.accountinginp').attr('code'))){
		$(this).find('.accountingye').show()
		$(this).find('.accountingmx').show()
	}
})
$(document).on("mouseout", ".accounting", function() {
	if(!$.isNull($(this).find('.accountinginp').attr('code'))){
		$(this).find('.accountingye').hide()
		$(this).find('.accountingmx').hide()
	}
})
var nodeleteallname = 1
//聚焦的时候将其对应的下拉框显示
$(document).on("focus", ".accountinginp", function() {
	var editStatus4 = $(this).parents('.voucher-center').attr('ifEdit')=='false'
	if(!isInputChange()  || editStatus4){
		$(this).attr("readonly", true);
		return false;
	} else {
		$(this).removeAttr("readonly");
		if($(this).parents(".voucher-center").find(".abstractinp").eq(0).val() == "") {
			if($(this).parents(".voucher-body").prevAll(".voucher-center").length >= 1 && vousinglepzzy != true) {
				for(var i = 0; i < $(this).parents(".voucher-body").prevAll(".voucher-center").length; i++) {
					if($(this).parents(".voucher-body").prevAll(".voucher-center").eq(i).hasClass('deleteclass') != true) {
						$(this).parents(".voucher-center").find(".abstractinp").eq(0).val($(this).parents(".voucher-center").prevAll(".voucher-center").eq(i).find(".abstractinp").eq(0).val())
						break;
					}
				}
			} else if($(this).parents(".voucher-centercw").prevAll(".voucher-centercw").length >= 1 && vousinglepzzy == true) {
				for(var i = 0; i < $(this).parents(".voucher-centercw").prevAll(".voucher-centercw").length; i++) {
					if($(this).parents(".voucher-centercw").prevAll(".voucher-centercw").eq(i).hasClass('deleteclass') != true) {
						$(this).parents(".voucher-center").find(".abstractinp").eq(0).val($(this).parents(".voucher-centercw").prevAll(".voucher-centercw").eq(i).find(".abstractinp").eq(0).val())
						break;
					}
				}
			} else if($(this).parents(".voucher-centerys").prevAll(".voucher-centerys").length >= 1 && vousinglepzzy == true) {
				if(!isysorcw){
					for(var i = 0; i < $(this).parents(".voucher-centerys").prevAll(".voucher-centerys").length; i++) {
						if($(this).parents(".voucher-centerys").prevAll(".voucher-centerys").eq(i).hasClass('deleteclass') != true) {
							$(this).parents(".voucher-center").find(".abstractinp").eq(0).val($(this).parents(".voucher-centerys").prevAll(".voucher-centerys").eq(i).find(".abstractinp").eq(0).val())
							break;
						}
					}
				}else{
					$(this).parents(".voucher-center").find(".abstractinp").eq(0).val($(this).parents(".voucher-centerys").prev(".voucher-center").find(".abstractinp").eq(0).val())
				}
			}
			//当本侧无摘要时候向对侧方获取摘要	
			if($(this).parents(".voucher-center").find(".abstractinp").eq(0).val() == "") {
				if($(this).parents(".voucher-body").prevAll(".voucher-center").length >= 1) {
					for(var i = 0; i < $(this).parents(".voucher-body").prevAll(".voucher-center").length; i++) {
						if($(this).parents(".voucher-body").prevAll(".voucher-center").eq(i).find(".abstractinp").eq(0).val() != '') {
							$(this).parents(".voucher-center").find(".abstractinp").eq(0).val($(this).parents(".voucher-center").prevAll(".voucher-center").eq(i).find(".abstractinp").eq(0).val())
							break;
						}
					}
				}
			}
		}
		$(this).removeAttr("readonly");
	}
	$(".all-no").hide();
	if(isclick0 == 0 && !ie11compatible){
		changeAcco($(this))
		var codebi =$(this).attr('code')
		var codebis = $(this).attr('fname')
		var namebi = $(this).attr('name')
		if($(this).val() == codebi + ' ' + namebi || $(this).val() == codebi + ' ' + codebis) {
			$(this).val(codebi)
			if(isaccfullname) {
				$(this).attr('allname', codebi + ' ' + codebis)
			} else {
				$(this).attr('allname', codebi + ' ' + namebi)
			}
			if($(this).parents('.accounting').find('.fuyan').css('display') == 'none') {
				$('.voucherycshow').find('.voucher-yc-title').css('visibility','hidden')
				if(isaccfullname) {
					$('.voucherycshow').find('.titlename').html("科目：" + codebi + ' ' + codebis)
				} else {
					$('.voucherycshow').find('.titlename').html("科目：" + codebi + ' ' + namebi)
				}
				if($(this).parents('.voucher-center').find('.money-ys').length >= 1) {
					if($(this).parents('.voucher-center').find('.money-ys').hasClass('moneyj') || $(this).parents('.voucher-center').find('.money-ys').parents('.money-jd').hasClass('moneyj')) {
						$('.voucher-yc-j').prop("checked", true)
						$('.voucher-yc-d').prop("checked", false)
					} else {
						$('.voucher-yc-d').prop("checked", true)
						$('.voucher-yc-j').prop("checked", false)
					}
					var nowmoney= $(this).parents('.voucher-center').find('.money-ys').nextAll('.money-xs').html() || $(this).parents('.voucher-center').find('.money-ys').find('.money-xs').html()
					$('.voucherycshow').find('.titlemoney').html("金额:" + nowmoney)
				}
			}
		}
		$(this).addClass("accountcheck")
		accoSelShow($(this))
		if($(this).val()!=''){
			nodeleteallname = 2
			$(this).trigger("input")
			nodeleteallname =1
		}else{
			if(isdefaultopen || $('.selAccoTree').hasClass('forproject')){
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
					var tempStr =$('.selAccoTree').find("li").eq(i).find('.ACCO_CODE').text() + " " +$('.selAccoTree').find("li").eq(i).find('.ACCO_NAME').text();
					var bool = tempStr.indexOf($(this).val());
					var tempStr2 = $('.selAccoTree').find("li").eq(i).find('.ACCO_CODE').text() + " " + $('.selAccoTree').find("li").eq(i).attr('fname')
					var bool2 = tempStr2.indexOf($(this).val());
					if(bool >= 0 || bool2 >= 0) {
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
		var ysup = $(this).val() == '' && $(this).parents('.voucher-center').hasClass('voucher-centerys') && $(this).parents('.voucher-center').prev('.voucher-center').find('.accountinginp').val() != ''
		var cwup = $(this).val() == '' && $(this).parents('.voucher-center').hasClass('voucher-centercw') && $(this).parents('.voucher-center').next('.voucher-center').find('.accountinginp').val() != ''
		if(ysup || cwup) {
			for(var i = 0; i < $('.voucher-center').length; i++) {
				$('.voucher-center').eq(i).attr('indexs', $('.voucher-center').eq(i).index())
			}
			var z = 0
			for(var i = 0; i < $('.voucher-centerys').length; i++) {
				if($('.voucher-centerys').eq(i).hasClass('deleteclass')) {
					z++
				}
				if(ysup){
					$('.voucher-centerys').eq(i).attr('indexsys', i)
				}else{
					$('.voucher-centercw').eq(i).attr('indexscw', i)
				}
			}
			var dataindex = $(this).parents('.voucher-centerys').attr('indexsys') - z
			if($(this).parents('.voucher-center').hasClass('voucher-centercw')){
				dataindex = $(this).parents('.voucher-centerys').attr('indexscw') - z
			}
			var thisindex = $(this).parents('.voucher-center').prev('.voucher-center').attr('indexs')
			if($(this).parents('.voucher-center').hasClass('voucher-centercw')){
				thisindex = $(this).parents('.voucher-center').next('.voucher-center').attr('indexs')
			}
			var thisindexs = $(this).parents('.voucher-center').attr('indexs')
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
						$('.voucher-centerys').eq(dataindex).find('.accountinginp').focus().select()
					} else if(data.data.length > 1) {
						accorationData = data.data
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
							vouaccRelationtr += '<tr datas=' + i + '><td style="width:35px;">'
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
							$("#accResearch").val('')
							page.editor = ufma.showModal('vouaccRelation', 750, 350);
						}
					}
				})
			}
		}
		//	$(this).select()
		if($(this).parents('.accounting').find('.fuyan').css('display') != 'none') {
			$(this).parents('.accounting').find('.fuyan').trigger('click')
		} else {
			if($(this).parents('.voucher').hasClass('voucher-singelzy')) {
				if($(this).parents('.voucher-center').hasClass('voucher-centercw') && $(this).parents('.voucher-center').next('.voucher-center').find('.voucher-yc').css('dispaly') != 'none') {
					$(this).parents('.voucher-center').next('.voucher-center').find('.voucher-close').click()
				} else if($(this).parents('.voucher-center').hasClass('voucher-centerys') && $(this).parents('.voucher-center').prev('.voucher-center').find('.voucher-yc').css('dispaly') != 'none') {
					$(this).parents('.voucher-center').prev('.voucher-center').find('.voucher-close').click()
				}
			}
			if($(this).parents('.voucher').hasClass('voucher-singelzybg') || $(this).parents('.voucher').hasClass('voucher-singelzyx')) {
				$('.voucher-close').click()
			}
		}
		
		fixedabsulate();
	}
})
function changeAcco(that){
	var  projectalls = that.parents('.accounting').prev('.projectuniver')
	if(that.parents('.voucher-center').hasClass('voucher-centerys')){
		projectalls = that.parents('.voucher-center').prev('.voucher-center').find('.projectuniver')
	}
	if(projectalls.length>0 && projectalls.find('.projectuniverinp').attr('code')!=undefined){
		if(projectalls.find('.projectuniverinp').attr('code')!=undefined && that.parents('.accounting').attr('accos')==undefined){
			var projectCode=projectalls.find('.projectuniverinp').attr('code')
			var accos;
			ufma.ajaxDef('/pf/pbm/pbm/api/project/queryProjectDetailGl','post',{"project":{"projectCode":projectCode}},function(result){
				accos = result.data
				accos.depproCodes=result.data.proGroups
			})
			var sedata = {
				"pbmProjectWithQuotaVo": [{
					"projectCode": projectCode, 
					"proQuotaList": [{
						"proQuotaCode":'' 
					}]
				}]
			}
			ufma.ajaxDef('/pf/pbm/pbm/base/project/queryExpecoByProjectQuota','post',sedata,function(result){
				accos.expecos=result.data
			})
			that.parents('.accounting').attr('accos',JSON.stringify(accos))
		}
		var accosdata = JSON.parse(that.parents('.accounting').attr('accos'))
		var accos = accosdata.accos
		if(accos.length==0){
			if($("#accounting-container").hasClass('forproject')){
				$("#accounting-container").html(acctaccaall()).removeClass('forproject')
			}
			if($("#accounting-container-cw").hasClass('forproject')){
				$("#accounting-container-cw").html(acctacca1()).removeClass('forproject')
			}
			if($("#accounting-container-ys").hasClass('forproject')){
				$("#accounting-container-ys").html(acctacca2()).removeClass('forproject')
			}
		}else{
			if($("#accounting-container").hasClass('forproject')){
				$("#accounting-container").html(acctaccaall()).removeClass('forproject')
			}
			if($("#accounting-container-cw").hasClass('forproject')){
				$("#accounting-container-cw").html(acctacca1()).removeClass('forproject')
			}
			if($("#accounting-container-ys").hasClass('forproject')){
				$("#accounting-container-ys").html(acctacca2()).removeClass('forproject')
			}
			var forprojectdata = [];
			for(var i=0;i<accos.length;i++){
				if(page.Codenameacct[accos[i].chrCode]!=undefined){
					forprojectdata.push(quanjuvoudatas.data[page.Codenameacct[accos[i].chrCode]])
				}
			}
			var forprojectacca = 1
			if(that.parents('.voucher-centerys').length>0){
				forprojectacca = 2
			}
			if(forprojectacca == 1){
				$("#accounting-container-cw").html(acctaccalforproject(forprojectdata)).addClass('forproject')
			}else{
				$("#accounting-container-ys").html(acctaccalforproject(forprojectdata)).addClass('forproject')
			}
			
			if(forprojectacca == 1){
				$("#accounting-container-cw").html(acctaccalforproject(forprojectdata,forprojectacca)).addClass('forproject')
			}else{
				$("#accounting-container-ys").html(acctaccalforproject(forprojectdata,forprojectacca)).addClass('forproject')
			}
		}
	}else{
		if($("#accounting-container").hasClass('forproject')){
			$("#accounting-container").html(acctaccaall()).removeClass('forproject')
		}
		if($("#accounting-container-cw").hasClass('forproject')){
			$("#accounting-container-cw").html(acctacca1()).removeClass('forproject')
		}
		if($("#accounting-container-ys").hasClass('forproject')){
			$("#accounting-container-ys").html(acctacca2()).removeClass('forproject')
		}
	}
}
//输入框内容改变的时候执行模糊查询,根据内容查询下拉并筛选
function searchacc(obj, val) {
	setTimeout(function() {
		if(obj.hasClass('accountcheck')){
			accoSelShow(obj)
		}
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
						$('.selAccoTree').find("li").eq(i).removeClass("noselected").addClass("PopListBoxItem").show();
						$('.selAccoTree').find(".bukedian").removeClass("PopListBoxItem").addClass("noselected").hide();
						$('.selAccoTree').find(".xzkjkm").removeClass("PopListBoxItem").addClass("noselected").hide();
					} else {
						var tempStr = $('.selAccoTree').find("li").eq(i).find('.ACCO_CODE').text() + " " +$('.selAccoTree').find("li").eq(i).find('.ACCO_NAME').text();
						var bool = tempStr.indexOf(obj.val());
						var tempStr2 = $('.selAccoTree').find("li").eq(i).find('.ACCO_CODE').text() + " " + $('.selAccoTree').find("li").eq(i).attr('fname')
						var bool2 = tempStr2.indexOf(obj.val());
						var tempStr3 = $('.selAccoTree').find("li").eq(i).attr('assCode');
						var bool3 = tempStr2.indexOf(obj.val());
						if(bool >= 0 || bool2 >= 0 || bool3 >= 0) {
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
			} else {
				for(var i = 0; i < $('.selAccoTree').find("li").length - 2; i++) {
					var codebi = $('.selAccoTree').find("li").eq(i).find(".ACCO_CODE").text().substring(0, obj.val().length)
					var codebis = $('.selAccoTree').find("li").eq(i).attr('fname').substring(0, obj.val().length)
					var namebi = $('.selAccoTree').find("li").eq(i).find(".ACCO_NAME").text().substring(0, obj.val().length)
					var assCodebis = $('.selAccoTree').find("li").eq(i).attr('assCode').substring(0, obj.val().length)
					if(obj.val() == codebi || obj.val() == namebi || obj.val() == codebis || obj.val() == codebi + " " + codebis || obj.val() == codebi + " " + namebi || obj.val() == assCodebis) {
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
					fixedabsulate();
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
						fixedabsulate();
					
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
	if(nodeleteallname == 1){
		$(this).removeAttr('allname')
		$(this).removeAttr('acca')
		$(this).removeAttr('accoindex')
		$(this).removeAttr('code')
		$(this).removeAttr('name')
		$(this).removeAttr('cashflow')
		$(this).removeAttr('fname')
		$(this).removeAttr('accbal')
	}
	if(isclick0 == 0) {
		searchacc($(this), $(this).val())
	}
});
//鼠标移入,如果有辅助核算项就显示,没有就隐藏
$(document).on("click", ".accounting .fuyan", function(e) {
	stopPropagation(e)
	if($(".all-no").css('display')!='none' ){
		if($(this).parents('.voucher').hasClass('voucher-singelzybg') || $(this).parents('.voucher').hasClass('voucher-singelzyx')) {
			$(".all-no").css('display','none')
		}
	}
	var _this=$(this)
	if($(this).parents(".accounting").attr('fudata') != undefined) {
		var strdata = JSON.parse($(this).parents(".accounting").attr('fudata'))
		var accoSurplus = $(this).parents(".accounting").attr('accoSurplus')
		var dfDc = $(this).parents(".accounting").attr('dfDc')
		chaclickfu($(this).parents('.accounting'), strdata, accoSurplus, dfDc)
		$(this).parents(".accounting").removeAttr('fudata')
	}
	vouYcDrCrRadio($(this).parents('.voucher-center'))
	if($(this).parents(".voucher-center").find(".voucher-yc").css("display") == "none") {
		$(this).parents(".voucher-center").find(".voucher-yc").show();
		$(".voucherall").height($(".voucherall").height() + $(this).parents(".voucher-center").find(".voucher-yc").outerHeight())
		if($(".voucher").eq(0).hasClass('voucher-singelzybg') || $(".voucher").eq(0).hasClass('voucher-singelzyx')) {
			var lenss = $('.voucher-footer').eq(0).offset().top - $(window).scrollTop() + 50
			$('.voucher-singelzybg,.voucher-singelzyx').find(".voucher-yc").css("top", lenss + 'px')
			if($('.voucher-singelzybg,.voucher-singelzyx').find(".voucherycshow").css("display") != 'none') {
				$('.voucher-singelzybg,.voucher-singelzyx').find(".voucherycshow").css("display", 'none')
				$(".voucherall").height($(".voucherall").height() - 120)
			}
		}
		voucherycshowheight()
		fixedabsulate();
	}
})
$(document).on("click", ".accountinginp", function(e) {
	stopPropagation(e)
	if($(this).attr('readonly')!=undefined){
		$(this).parents('.accounting').find('.fuyan').trigger('click')
	}
	
})
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
//阻止冒泡事件
$(document).on("click", ".accountinginp", function(e) {
	stopPropagation(e)
})
//点击下拉内容
$(document).on("click", ".selAccoTree .clik1,.forproject li", function() {
	_this = $(this);
	inde = 0;
	ie11compatible = false;
	Obtainaccs($('.accountcheck'),true)
	if(vousinglepzzy  && vousinglepz == false){
		Obtainaccs($('.accountcheck').parents('.voucher-center').prev('.voucher-center').prev('.voucher-center').find('.accountinginp'),false)
	}else{
		Obtainaccs($('.accountcheck').parents('.voucher-center').prev('.voucher-center').find('.accountinginp'),false)
	}
	$('.accountcheck').parents('.voucher-center').removeAttr('namess').removeAttr('namesss')
	//如果点击的是已经选中的内容就判断是否有辅助核算项,有就显示,没有就隐藏
	if($(this).find("p").text() == $(".accountcheck").val() || $(this).find("p").find('.ACCO_CODE').text() + " " + $(this).attr('fname') == $(".accountcheck").val()) {
		if($('.accountcheck').parents(".voucher-center").find(".voucher-yc").css("display") == "none") {
			$('.accountcheck').parents(".voucher-center").find(".voucher-yc").show();
			$(".voucherall").height($(".voucherall").height() + $('.accountcheck').parents(".voucher-center").find(".voucher-yc").outerHeight())
			if($(".voucher").eq(0).hasClass('voucher-singelzybg') || $(".voucher").eq(0).hasClass('voucher-singelzyx')) {
				var lenss = $('.voucher-footer').eq(0).offset().top - $(window).scrollTop() + 50
				$('.voucher-singelzybg,.voucher-singelzyx').find(".voucher-yc").css("top", lenss + 'px')
				if($('.voucher-singelzybg,.voucher-singelzyx').find(".voucherycshow").css("display") != 'none') {
					$('.voucher-singelzybg,.voucher-singelzyx').find(".voucherycshow").css("display", 'none')
					$(".voucherall").height($(".voucherall").height() - 120)
				}
			}
			voucherycshowheight()
			fixedabsulate()
		}
	} else {
		$('.accountcheck').parents('.accounting').removeAttr('fudata');
		//点击的是一个新的会计科目的话就将其隐藏的余额,明细账,核算项目全部显示出来,并将点击的内容显示到输入框内
		$('.accountcheck').parents(".accounting").find(".accountingye").html("余额");
		if(isaccfullname) {
			$('.accountcheck').val($(this).find("p").find('.ACCO_CODE').text() + " " + $(this).attr('fname')).attr("accbal", $(this).attr("role")).attr('acca',$(this).attr("role"));
		} else {
			$('.accountcheck').val($(this).find("p").text()).attr("accbal", $(this).attr("role")).attr('acca',$(this).attr("role"));
		}
		$('.accountcheck').attr('acca',$(this).attr('acca'))
		$('.accountcheck').attr('accoindex',$(this).attr('name'))
		$('.accountcheck').attr('code',$(this).find(".ACCO_CODE").text())
		$('.accountcheck').attr('name',$(this).find(".ACCO_NAME").text())
		$('.accountcheck').attr('cashflow',$(this).attr('cashflow'))
		$('.accountcheck').attr('fname',$(this).attr('fname'))
		$('.accountcheck').removeAttr('allname')
		$('.accountcheck').parents('.accounting').attr('title', $(this).find("p").text())
		
		//判断点击的内容是否有辅助核算项.
		if($(this).hasClass("fuhs0")) {
			//如果现在点击没有辅助核算项且原来有过辅助核算项,将其关闭并且删除
			if($('.accountcheck').parents(".voucher-center").find(".voucher-yc").css("display") != "none" && $('.accountcheck').parents(".voucher-center").find(".voucher-yc").length>0) {
				$(".voucherall").height($(".voucherall").height() - $('.accountcheck').parents(".voucher-center").find(".voucher-yc").outerHeight())
				voucherycshowheight()
				fixedabsulate();
			}
			$('.accountcheck').parents(".accounting").nextAll(".voucher-yc").hide();
			$('.accountcheck').parents(".voucher-center").find(".voucher-yc").addClass("deleteclass").hide().remove();
			$('.accountcheck').parents(".voucher-center").find(".deleteclass").find(".voucher-yc-bo").attr("op", "2").attr("lastVer", "0");
			//将其内部所有的输入框内容清空,删除后计算内容不会将其计算;
			$('.accountcheck').parents(".voucher-center").find(".deleteclass").find("input").val("");
			//将其证明有辅助核算项的标记隐藏
			$('.accountcheck').parents(".accounting").find(".fuyan").hide();
			//判断如果是第一行的话就将光标默认在借方,如果不是则根据内容,如果是属于借方就将光标移到借方,如果是贷方就移到贷方
			if($('.accountcheck').parents(".voucher-center").index() == 1) {
				$('.accountcheck').parents(".voucher-center").find(".moneyj").find(".money-xs").hide();
				$('.accountcheck').parents(".voucher-center").find(".moneyj").find(".money-xsbg").hide();
				$('.accountcheck').parents(".voucher-center").find(".moneyj").find(".money-sr").show();
				$('.accountcheck').parents(".voucher-center").find(".moneyj").find(".money-sr").focus().select();
			} else {
				if($(this).attr("role") == "1") {
					$('.accountcheck').parents(".voucher-center").find(".moneyj").find(".money-xs").hide();
					$('.accountcheck').parents(".voucher-center").find(".moneyj").find(".money-xsbg").hide();
					$('.accountcheck').parents(".voucher-center").find(".moneyj").find(".money-sr").show();
					$('.accountcheck').parents(".voucher-center").find(".moneyj").find(".money-sr").focus().select();
				} else {
					$('.accountcheck').parents(".voucher-center").find(".moneyd").find(".money-xs").hide();
					$('.accountcheck').parents(".voucher-center").find(".moneyd").find(".money-xsbg").hide();
					$('.accountcheck').parents(".voucher-center").find(".moneyd").find(".money-sr").show();
					$('.accountcheck').parents(".voucher-center").find(".moneyd").find(".money-sr").focus().select();

				};
			}
			//执行完所有操作后,隐藏下拉框
//			$(this).parents(".accountinginps").hide();
			$(".AccoTree").hide();
		} else {
			//如果说是有辅助核算项的话,首先将借贷方金额内容清空,因为有辅助核算项的话只能根据辅助核算项更改
			$('.accountcheck').parents(".voucher-center").find(".money-sr").val("");
			$('.accountcheck').parents(".voucher-center").find(".money-xs").html("");
			$('.accountcheck').parents(".voucher-center").find(".money-jd").removeClass("money-ys");
			//然后执行一下总金额比对函数
			bidui()
			//继续还是清除原来所有的辅助核算项
			if($('.accountcheck').parents(".voucher-center").find(".voucher-yc").css("display") != "none" && $('.accountcheck').parents(".voucher-center").find(".voucher-yc").length>0) {
				$(".voucherall").height($(".voucherall").height() - $('.accountcheck').parents(".voucher-center").find(".voucher-yc").outerHeight())
				voucherycshowheight()
				fixedabsulate();
			}
			$('.accountcheck').parents(".voucher-center").find(".voucher-yc").remove();
			$('.accountcheck').parents(".voucher-center").find(".deleteclass").find(".voucher-yc-bo").attr("op", "2").attr("lastVer", "0");
			$('.accountcheck').parents(".voucher-center").find(".deleteclass").find("input").val("");
			//这次将辅助核算项的证明显示
			$('.accountcheck').parents(".accounting").find(".fuyan").show();
			//将遍历拼接出来的辅助核算项放在当前分录内
			console.log($(this).attr('name'))
			var voucheryc = fzhspzpj(_this)
			$('.accountcheck').parents(".voucher-center").append(voucheryc);
			if($('.accountcheck').parents(".voucher-center").find('.accountinginp').attr('accbal') == 1) {
				$('.accountcheck').parents(".voucher-center").find('.voucher-yc').find('.voucher-yc-j').prop('checked', true)
				$('.accountcheck').parents(".voucher-center").find('.voucher-yc').find('.voucher-yc-d').prop('checked', false)
			} else {
				$('.accountcheck').parents(".voucher-center").find('.voucher-yc').find('.voucher-yc-j').prop('checked', false)
				$('.accountcheck').parents(".voucher-center").find('.voucher-yc').find('.voucher-yc-d').prop('checked', true)
			}
			for(var dd = 0; dd < $('.accountcheck').parents(".voucher-center").find('.voucher-yc').length; dd++) {
				for(var ddo = 0; ddo < $('.accountcheck').parents(".voucher-center").find('.voucher-yc').eq(dd).find('.voucher-yc-bo').length; ddo++) {
					if($('.accountcheck').parents(".voucher-center").find('.voucher-yc').eq(dd).find('.voucher-yc-bo').eq(ddo).hasClass('deleteclass') != true) {
						$('.accountcheck').parents(".voucher-center").find('.voucher-yc').eq(dd).find('.voucher-yc-bo').eq(ddo).find('.diffTermCodeinp').attr('disabled', false)
						$('.accountcheck').parents(".voucher-center").find('.voucher-yc').eq(dd).find('.voucher-yc-bo').eq(ddo).find('.diffTermDirinp').attr('disabled', false)
						break;
					}
				}
			}
			$('.daoqiri,.billDateinp,.bussDate').datetimepicker(glRptJournalDate)
			//判定辅助核算项的长度是否大于五条,大于的话就不显示横向滚动条
			for(var i = 0; i < $('.accountcheck').parents(".voucher-center").find(".voucher-yc").length; i++) {
				if($('.accountcheck').parents(".voucher-center").find(".voucher-yc").eq(i).hasClass("deleteclass") != true) {
					voucherYcAssCss($('.accountcheck').parents(".voucher-center").find(".voucher-yc").eq(i))
				}
				var ss = _this.attr("name");
				if(quanjuvoudatas.data[ss].defcurCode != '' && quanjuvoudatas.data[ss].currency == 1) {
					for(var j = 0; j < $('.accountcheck').parents(".voucher-center").find(".voucher-yc").eq(i).find('.curcodeinp').length; j++) {
						if($('.accountcheck').parents(".voucher-center").find(".voucher-yc").eq(i).find('.curcodeinp').eq(j).val() == '') {
							for(var z = 0; z < $('#AssDataAll').find(".currency").find('li').length; z++) {
								var nowthis =$('#AssDataAll').find(".currency").find('li').eq(z)
								if(nowthis.find('.code').html() == quanjuvoudatas.data[ss].defcurCode) {
									var codecur = $('#AssDataAll').find(".currency").find('li').eq(z).find('.code').text()
									var curtext = $('#AssDataAll').find(".currency").find('li').eq(z).text()
									var exrate = $('#AssDataAll').find(".currency").find('li').eq(z).attr('exrate')
									var rateDigits = $('#AssDataAll').find(".currency").find('li').eq(z).attr('rateDigits')
									$('.accountcheck').parents(".voucher-center").find(".voucher-yc").eq(i).find('.curcodeinp').val(curtext).attr('code',codecur)
									$('.accountcheck').parents(".voucher-center").find(".voucher-yc").eq(i).find('.exrateinp').val(curexratefzhsxl[exrate]).attr('exrate', exrate).attr('rateDigits', rateDigits)
								}
							}
						}
					}
				}
			}
			//页面的高度加上刚加上的辅助核算项的大小
			if($('.accountcheck').parents(".voucher-center").find(".voucher-yc").find('.voucher-yc-bo').length > 8) {
				$('.accountcheck').parents(".voucher-center").find(".voucher-yc").find('.voucher-yc-scroll').addClass("bgheight");
				voucherYcAssCssbgheight($('.accountcheck').parents(".voucher-center").find(".voucher-yc"))
			}
			$(".voucherall").height($(".voucherall").height() + $('.accountcheck').parents(".voucher-center").find(".voucher-yc").outerHeight())
			if($(".voucher").eq(0).hasClass('voucher-singelzybg') || $(".voucher").eq(0).hasClass('voucher-singelzyx')) {
				var lenss = $('.voucher-footer').eq(0).offset().top - $(window).scrollTop() + 50
				$('.voucher-singelzybg,.voucher-singelzyx').find(".voucher-yc").css("top", lenss + 'px')
				if($('.voucher-singelzybg,.voucher-singelzyx').find(".voucherycshow").css("display") != 'none') {
					$('.voucher-singelzybg,.voucher-singelzyx').find(".voucherycshow").css("display", 'none')
					$(".voucherall").height($(".voucherall").height() - 120)
					fixedabsulate()
				}
			}
			voucherycshowheight()
			fixedabsulate();
			//此时需要显示未被删除的辅助核算项
			for(var i = 0; i < $(this).parents(".accounting").nextAll(".voucher-yc").length; i++) {
				if($(this).parents(".accounting").nextAll(".voucher-yc").eq(i).hasClass("deleteclass") !=true) {
					$(this).parents(".accounting").nextAll(".voucher-yc").eq(i).show();
				}
			}
			_this.blur();
			if(temporaryfzhs.length>0) {
				for(var i = 0; i < $('.accountcheck').parents(".voucher-center").find(".voucher-yc").length; i++) {
					if($('.accountcheck').parents(".voucher-center").find(".voucher-yc").eq(i).hasClass("deleteclass") != true) {
						var pasyc = $('.accountcheck').parents(".voucher-center").find(".voucher-yc").eq(i)
						setfzhsxl(temporaryfzhs,pasyc)
					}
				}
			}else if(isHistoryfzhs && temporaryfzhsprev.length>0){
				for(var i = 0; i < $('.accountcheck').parents(".voucher-center").find(".voucher-yc").length; i++) {
					if($('.accountcheck').parents(".voucher-center").find(".voucher-yc").eq(i).hasClass("deleteclass") != true) {
						var pasyc = $('.accountcheck').parents(".voucher-center").find(".voucher-yc").eq(i)
						setfzhsxl(temporaryfzhsprev,pasyc)
					}
				}
			}
			//将焦点聚集到第一个输入框内,并且显示其下拉框
			for(var z = 0; z < $('.accountcheck').parents(".voucher-center").find(".voucher-yc").length; z++) {
				if($('.accountcheck').parents(".voucher-center").find(".voucher-yc").eq(z).hasClass("deleteclass")) {} else {
					$('.accountcheck').parents(".voucher-center").find(".voucher-yc").eq(z).find(".ycbodyinp").eq(0).focus();
				}
			}
			//隐藏原来的下拉框
			_this.parents(".accountinginps").hide();
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
	$(this).parents('.selAccoTree').hide()
	//运行比对函数
	bidui();
})
//为输入框添加键盘事件
$(document).on("keydown", ".accountinginp", function(event) {
	var editStatus4 = $(this).parents('.voucher-center').attr('ifEdit')=='false'
	if(!isInputChange()  || editStatus4){
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
	if(event.shiftKey && event.keyCode == 37) {
		$(this).parents('.voucher-center').find('.abstractinp').focus()
		event.preventDefault();
		event.returnValue = false;
		event.keyCode == 0
		return false;
	}
	if(event.shiftKey && event.keyCode == 39) {
		event.preventDefault();
		inde = 0; 
		if($(this).parents(".voucher-center").find(".voucher-yc").length >= 1) {
			var athis;
			if($(this).parents('.voucher').hasClass('voucher-singelzybg') || $(this).parents('.voucher').hasClass('voucher-singelzy')){
				athis = $(this).parents('.voucher-center').next('.voucher-center').next('.voucher-center')
			}else{
				athis = $(this).parents('.voucher-center').next('.voucher-center')
			}
			if(athis.length>0){
				athis.find('.abstractinp').focus()
			}
		}else{
			if($(this).parents('.voucher-center').find('.money-ys').length>0){
				if($(this).parents('.voucher-center').find('.money-ys').parents('.money-jd').length>0){
					$(this).parents('.voucher-center').find('.money-ys').parents('.money-jd').click()
				}else{
					$(this).parents('.voucher-center').find('.money-ys').click()
				}
			}else{
				if($(this).parents('.voucher-center').find('.accountinginp').attr("accbal")!='0'){
					$(this).parents('.voucher-center').find('.moneyj').click()
				}else{
					$(this).parents('.voucher-center').find('.moneyd').click()
				}
			}
		}
		event.keyCode = 0;
		if(event.preventDefault) { // firefox
			event.preventDefault();
		} else { // other
			event.returnValue = false;
		}
	}
	if(event.shiftKey && event.keyCode == 38) {
		var athis;
		if($(this).parents('.voucher').hasClass('voucher-singelzybg') || $(this).parents('.voucher').hasClass('voucher-singelzy')){
			athis = $(this).parents('.voucher-center').prev('.voucher-center').prev('.voucher-center')
		}else{
			athis = $(this).parents('.voucher-center').prev('.voucher-center')
		}
		if(athis.length>0){
			athis.find('.accountinginp').focus()
		}
		event.preventDefault();
		event.returnValue = false;
		event.keyCode == 0
		return false;
	}
	if(event.shiftKey && event.keyCode == 40) {
		var athis;
		if($(this).parents('.voucher').hasClass('voucher-singelzybg') || $(this).parents('.voucher').hasClass('voucher-singelzy')){
			athis = $(this).parents('.voucher-center').next('.voucher-center').next('.voucher-center')
		}else{
			athis = $(this).parents('.voucher-center').next('.voucher-center')
		}
		if(athis.length>0){
			athis.find('.accountinginp').focus()
		}
		event.preventDefault();
		event.returnValue = false;
		event.keyCode == 0
		return false;
	}
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
					$("#accResearch").val('')
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
					if(_this.parents('.voucher-center').hasClass("voucher-centercw")) {
						for(var i = 0; i < $(".voucher-centerys").length; i++) {
							if($(".voucher-centerys").eq(i).hasClass('deleteclass') != true) {
								$(".voucher-centerys").eq(i).find('.accountinginp').focus()
								if(isprojectByVou){
									$(".voucher-centerys").eq(i).find('.accountinginp').focus()
								}
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
	if(event.keyCode == "27") {
		event.preventDefault();
		event.keyCode = 0;
		event.preventDefault();
		event.returnValue = false;
		if(_this.parents('.voucher-center').find('.voucher-yc').css('display') != 'none') {
			_this.parents('.voucher-center').find('.voucher-yc').hide()
			$(".voucherall").height($(".voucherall").height() - _this.parents('.voucher-center').find('.voucher-yc').outerHeight())
			if($(".voucher").eq(0).hasClass('voucher-singelzybg') || $(".voucher").eq(0).hasClass('voucher-singelzyx')) {
				var lenss = $('.voucher-footer').eq(0).offset().top - $(window).scrollTop() + 50
				$('.voucher-singelzybg,.voucher-singelzyx').find(".voucher-yc").css("top", lenss + 'px')
				if($('.voucher-singelzybg,.voucher-singelzyx').find(".voucherycshow").css("display") != 'none') {
					$('.voucher-singelzybg,.voucher-singelzyx').find(".voucherycshow").css("display", 'none')
					$(".voucherall").height($(".voucherall").height() - 120)
					voucherycshowheight()
					fixedabsulate()
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
		if($('.selAccoTree').find(".selected").length > 0 && $('.selAccoTree').find(".selected").hasClass('click0') != true) {
			if($('.selAccoTree').find(".selected").find("p").text() == $(this).val() || $('.selAccoTree').find(".selected").find("p").find('.ACCO_CODE').text() + " " + $('.selAccoTree').find(".selected").attr("fname") == $(this).val()) {
				$('.selAccoTree').hide();
				if($('.selAccoTree').find(".selected").hasClass("fuhs0") != true) {
					if($(this).parents(".voucher-center").find(".voucher-yc").css("display") == "none") {
						$(this).parents(".voucher-center").find(".voucher-yc").show();
						$(this).parents(".voucher-center").find(".voucher-yc").find("input").eq(0).click();
						$(".voucherall").height($(".voucherall").height() + $(this).parents(".voucher-center").find('.voucher-yc').outerHeight())
						if($(".voucher").eq(0).hasClass('voucher-singelzybg') || $(".voucher").eq(0).hasClass('voucher-singelzyx')) {
							var lenss = $('.voucher-footer').eq(0).offset().top - $(window).scrollTop() + 50
							$('.voucher-singelzybg,.voucher-singelzyx').find(".voucher-yc").css("top", lenss + 'px')
							if($('.voucher-singelzybg,.voucher-singelzyx').find(".voucherycshow").css("display") != 'none') {
								$('.voucher-singelzybg,.voucher-singelzyx').find(".voucherycshow").css("display", 'none')
								$(".voucherall").height($(".voucherall").height() - 120)
							}
						}
						voucherycshowheight()
						fixedabsulate();
					} else {
						$(this).parents(".voucher-center").find(".voucher-yc").eq(i).find("input").eq(0).click();
					}
				} else {
					if($(this).parents(".voucher-center").index() == 1) {
						$(this).parents(".voucher-center").find(".moneyj").find(".money-xs").hide();
						$(this).parents(".voucher-center").find(".moneyj").find(".money-xsbg").hide();
						$(this).parents(".voucher-center").find(".moneyj").find(".money-sr").show();
						$(this).parents(".voucher-center").find(".moneyj").find(".money-sr").focus().select();
					} else {
						
						if(quanjuvoudatas.data[$(this).parents(".accounting").find(".accountinginp").attr("accoindex")].accBal == "1") {
							$(this).parents(".voucher-center").find(".moneyj").find(".money-xs").hide();
							$(this).parents(".voucher-center").find(".moneyj").find(".money-xsbg").hide();
							$(this).parents(".voucher-center").find(".moneyj").find(".money-sr").show();
							$(this).parents(".voucher-center").find(".moneyj").find(".money-sr").focus().select();
						} else {
							$(this).parents(".voucher-center").find(".moneyd").find(".money-xs").hide();
							$(this).parents(".voucher-center").find(".moneyd").find(".money-xsbg").hide();
							$(this).parents(".voucher-center").find(".moneyd").find(".money-sr").show();
							$(this).parents(".voucher-center").find(".moneyd").find(".money-sr").focus().select();

						};
					}
				}
			} else {
				if($('.selAccoTree').find(".selected").hasClass("clik1")) {
					Obtainaccs($(this),true)
					if(vousinglepzzy  && vousinglepz == false){
						Obtainaccs($(this).parents('.voucher-center').prev('.voucher-center').prev('.voucher-center').find('.accountinginp'),false)
					}else{
						Obtainaccs($(this).parents('.voucher-center').prev('.voucher-center').find('.accountinginp'),false)
					}
					$(this).parents('.accounting').removeAttr('fudata');
					$(this).parents('.voucher-center').removeAttr('namess').removeAttr('namesss')
					inde = 0;
					var $li = $('.selAccoTree').find(".selected");
					if(isaccfullname) {
						$(this).val($li.find("p").find('.ACCO_CODE').text() + ' ' + $li.attr('fname')).attr("accbal", $li.attr("role"));
					} else {
						$(this).val($li.find("p").text()).attr("accbal", $li.attr("role"));
					}
					$(this).removeAttr('allname')
					$(this).attr('acca', $li.attr("acca"))
					$(this).attr('accoindex',$li.attr('name'))
					$(this).attr('code',$li.find(".ACCO_CODE").text())
					$(this).attr('name',$li.find(".ACCO_NAME").text())
					$(this).attr('cashflow',$li.attr('cashflow'))
					$(this).attr('fname',$li.attr('fname'))
					$(this).parents('.accounting').attr('title', $li.find("p").text())
					$(this).parents(".accounting").find(".accountingye").html("余额");
					$('.selAccoTree').hide();
					if($('.selAccoTree').find(".selected").hasClass("fuhs0")) {
						if($(this).parents(".voucher-center").find(".voucher-yc").css("display") != "none" && $(this).parents(".voucher-center").find(".voucher-yc").length >= 1) {
							$(".voucherall").height($(".voucherall").height() - $(this).parents(".voucher-center").find('.voucher-yc').eq(i).outerHeight())
							voucherycshowheight()
							fixedabsulate();
						}
						$(this).parents(".voucher-center").find(".voucher-yc").addClass("deleteclass").hide().remove();
						$(this).parents(".voucher-center").find(".deleteclass").find(".voucher-yc-bo").attr("op", "2").attr("lastVer", "0");
						$(this).parents(".voucher-center").find(".deleteclass").find(".input").val("");
						$(this).parents(".accounting").find(".fuyan").hide();
						if($(this).parents(".voucher-center").index() == 1) {
							$(this).parents(".voucher-center").find(".moneyj").find(".money-xs").hide();
							$(this).parents(".voucher-center").find(".moneyj").find(".money-xsbg").hide();
							$(this).parents(".voucher-center").find(".moneyj").find(".money-sr").show();
							$(this).parents(".voucher-center").find(".moneyj").find(".money-sr").focus().select();
						} else {
							if(quanjuvoudatas.data[$(this).parents(".accounting").find(".accountinginp").attr("accoindex")].accBal == "1") {
								$(this).parents(".voucher-center").find(".moneyj").find(".money-xs").hide();
								$(this).parents(".voucher-center").find(".moneyj").find(".money-xsbg").hide();
								$(this).parents(".voucher-center").find(".moneyj").find(".money-sr").show();
								$(this).parents(".voucher-center").find(".moneyj").find(".money-sr").focus().select();
							} else {
								$(this).parents(".voucher-center").find(".moneyd").find(".money-xs").hide();
								$(this).parents(".voucher-center").find(".moneyd").find(".money-xsbg").hide();
								$(this).parents(".voucher-center").find(".moneyd").find(".money-sr").show();
								$(this).parents(".voucher-center").find(".moneyd").find(".money-sr").focus().select();

							};
						}
					} else {
						//如果说是有辅助核算项的话,首先将借贷方金额内容清空,因为有辅助核算项的话只能根据辅助核算项更改
						$(this).parents(".voucher-center").find(".money-sr").val("");
						$(this).parents(".voucher-center").find(".money-xs").html("");
						$(this).parents(".voucher-center").find(".money-jd").removeClass("money-ys");
						if($(this).parents(".voucher-center").find(".voucher-yc").css("display") != "none" && $(this).parents(".voucher-center").find(".voucher-yc").length >= 1) {
							$(".voucherall").height($(".voucherall").height() - $(this).parents(".voucher-center").find('.voucher-yc').outerHeight())
							voucherycshowheight()
							fixedabsulate();
						}
						$(this).parents(".accounting").find(".fuyan").show();
						_this.parents(".voucher-center").find(".voucher-yc").addClass("deleteclass").attr("op", 2).attr("lastVer", "0").remove();
						_this.parents(".voucher-center").find(".deleteclass").find(".voucher-yc-bo").attr("op", "2").attr("lastVer", "0");
						_this.parents(".voucher-center").find(".deleteclass").find("input").val("");
						var voucheryc = fzhspzpj($('.selAccoTree').find(".selected"))
						_this.parents(".voucher-center").append(voucheryc);
						if(_this.parents(".voucher-center").find('.accountinginp').attr('accbal') == 1) {
							_this.parents(".voucher-center").find('.voucher-yc').find('.voucher-yc-j').prop('checked', true)
							_this.parents(".voucher-center").find('.voucher-yc').find('.voucher-yc-d').prop('checked', false)
						} else {
							_this.parents(".voucher-center").find('.voucher-yc').find('.voucher-yc-j').prop('checked', false)
							_this.parents(".voucher-center").find('.voucher-yc').find('.voucher-yc-d').prop('checked', true)
						}
						for(var dd = 0; dd < _this.parents(".voucher-center").find('.voucher-yc').length; dd++) {
							for(var ddo = 0; ddo < _this.parents(".voucher-center").find('.voucher-yc').eq(dd).find('.voucher-yc-bo').length; ddo++) {
								if(_this.parents(".voucher-center").find('.voucher-yc').eq(dd).find('.voucher-yc-bo').eq(ddo).hasClass('deleteclass') != true) {
									_this.parents(".voucher-center").find('.voucher-yc').eq(dd).find('.voucher-yc-bo').eq(ddo).find('.diffTermCodeinp').attr('disabled', false)
									_this.parents(".voucher-center").find('.voucher-yc').eq(dd).find('.voucher-yc-bo').eq(ddo).find('.diffTermDirinp').attr('disabled', false)
									break;
								}
							}
						}
						$('.daoqiri,.billDateinp,.bussDate').datetimepicker(glRptJournalDate)
						for(var i = 0; i < _this.parents(".voucher-center").find(".voucher-yc").length; i++) {
							if(_this.parents(".voucher-center").find(".voucher-yc").eq(i).hasClass("deleteclass")) {
							} else {
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
												_this.parents(".voucher-center").find(".voucher-yc").eq(i).find('.curcodeinp').eq(j).val(curtext).attr('code',codecur)
												$('.accountcheck').parents(".voucher-center").find(".voucher-yc").eq(i).find('.curcodeinp').val(curtext).attr('code',codecur)
												_this.parents(".voucher-center").find(".voucher-yc").eq(i).find('.exrateinp').eq(j).val(curexratefzhsxl[exrate]).attr('exrate', exrate).attr('rateDigits', rateDigits)
											}
										}
									}
								}
							}
						}
						//					_this.parents(".accounting").nextAll(".voucher-yc").show();
						for(var i = 0; i < $(this).parents(".accounting").nextAll(".voucher-yc").length; i++) {
							if($(this).parents(".accounting").nextAll(".voucher-yc").eq(i).hasClass("deleteclass")) {

							} else {
								$(this).parents(".accounting").nextAll(".voucher-yc").eq(i).show();
							}
						}
						_this.parents(".accounting").nextAll(".deleteclass").hide();
						_this.blur();
						var langlength = 0
						if($(this).parents(".accounting").nextAll(".voucher-yc").find('.voucher-yc-bo').length > 8) {
							$(this).parents(".accounting").nextAll(".voucher-yc").find('.voucher-yc-scroll').addClass("bgheight");
							voucherYcAssCssbgheight($(this).parents(".accounting").nextAll(".voucher-yc"))
						}
						$(".voucherall").height($(".voucherall").height() + $(this).parents(".accounting").nextAll(".voucher-yc").outerHeight())
						if($(".voucher").eq(0).hasClass('voucher-singelzybg') || $(".voucher").eq(0).hasClass('voucher-singelzyx')) {
							var lenss = $('.voucher-footer').eq(0).offset().top - $(window).scrollTop() + 50
							$('.voucher-singelzybg,.voucher-singelzyx').find(".voucher-yc").css("top", lenss + 'px')
							if($('.voucher-singelzybg,.voucher-singelzyx').find(".voucherycshow").css("display") != 'none') {
								$('.voucher-singelzybg,.voucher-singelzyx').find(".voucherycshow").css("display", 'none')
								$(".voucherall").height($(".voucherall").height() - 120)
							}
						}
						if(temporaryfzhs.length>0) {
							for(var i = 0; i < $(this).parents(".voucher-center").find(".voucher-yc").length; i++) {
								if($(this).parents(".voucher-center").find(".voucher-yc").eq(i).hasClass("deleteclass") != true) {
									var pasyc = $(this).parents(".voucher-center").find(".voucher-yc").eq(i)
										setfzhsxl(temporaryfzhs,pasyc)
								}
							}
						}else if(isHistoryfzhs && temporaryfzhsprev.length>0){
							for(var i = 0; i < $(this).parents(".voucher-center").find(".voucher-yc").length; i++) {
								if($(this).parents(".voucher-center").find(".voucher-yc").eq(i).hasClass("deleteclass") != true) {
									var pasyc = $(this).parents(".voucher-center").find(".voucher-yc").eq(i)
										setfzhsxl(temporaryfzhsprev,pasyc)
								}
							}
						}
						for(var z = 0; z < _this.parents(".voucher-center").find(".voucher-yc").length; z++) {
							if(_this.parents(".voucher-center").find(".voucher-yc").eq(z).hasClass("deleteclass")) {} else {
								_this.parents(".voucher-center").find(".voucher-yc").eq(z).find(".ycbodyinp").eq(0).focus();
							
							}
						}
						voucherycshowheight()
						fixedabsulate();
					}
				} else {
					$(this).focus()
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
	var editStatus4 = $(this).parents('.voucher-center').attr('ifEdit')=='false'
	if(!isInputChange()  || editStatus4){
		$(this).attr("readonly", true);
		return false;
	} else {
		$(this).removeAttr("readonly");
	}
	var _thisacc = $(this)
	setTimeout(function() {
		if(isclick0 == 0 && !ie11compatible) {
//			_thisacc.next(".accountinginps")
			if(_thisacc.attr('code')==undefined && _thisacc.val() != '') {
				_thisacc.val("");
				_thisacc.trigger('input')
				_thisacc.next(".accountinginps").hide();
				_thisacc.parents(".accounting").find(".accountingye").hide();
				_thisacc.parents(".accounting").find(".accountingmx").hide();
			} else if(_thisacc.attr('code')!=undefined) {
				if(_thisacc.attr('allname') != undefined) {
					_thisacc.val(_thisacc.attr('allname'))
					_thisacc.removeAttr('allname')
				}else{
					if(isaccfullname) {
						_thisacc.val(_thisacc.attr('code') + " " + _thisacc.attr('fname')).attr("accbal", $('.selAccoTree').find(".selected").attr("role"));
					} else {
						_thisacc.val(_thisacc.attr('code')+ " " + _thisacc.attr('name')).attr("accbal", $('.selAccoTree').find(".selected").attr("role"));
					}
				}
			}
			if($('.accountcheck').val()==''){
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
			}
			_thisacc.removeClass("accountcheck")
			$('.selAccoTree').find(".bukedian").removeClass("PopListBoxItem").addClass("noselected").hide();
			$('.selAccoTree').find(".xzkjkm").removeClass("PopListBoxItem").addClass("noselected").hide();
			if($('.accountcheck').length<1){
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
					beforeSend: function(xhr) {
						xhr.setRequestHeader("x-function-id",voumenuid);
					},
					url: "/gl/vou/getAccoByAcct/" + dwselected + "/" + ztselected + "?ajax=1&rueicode="+hex_md5svUserCode,
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