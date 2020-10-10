// 鼠标移入移出切换展示信息
$(document).on("mousemove", ".ycbodyinp", function(e) {
	$(this).attr('title', $(this).val())
})
$(document).on("mousemove", ".ycbodys li", function(e) {
	$(this).attr('title', $(this).find('p').text())
})
$(document).on("mouseover", ".yctz,.Assaccbala", function(e) {
	$(this).parents('.voucher-yc-bo').find('.Assaccbala').show()
})
$(document).on("mouseout", ".yctz", function(e) {
	$(this).parents('.voucher-yc-bo').find('.Assaccbala').hide()
})
$(document).on("mouseover", ".ycbody,.fielddetail", function(e) {
	$(this).parents('.voucher-yc-bo').find('.fielddetail').show()
})
$(document).on("mouseout", ".ycbody,.fielddetail", function(e) {
	$(this).parents('.voucher-yc-bo').find('.fielddetail').hide()
})
$(document).on("mouseover", ".voucher-yc-bo", function() {
	var inde = $(this).index() - 1
	if(!isSummaryVou){
		$(this).parents('.voucher-yc-bg').next('.voucher-yc-deletebtns').find(".ycdelect").eq(inde).css("visibility", "visible");
		$(this).parents('.voucher-yc-bg').prev('.voucher-yc-addbtns').find(".ycadd").eq(inde).css("visibility", "visible");
		if(inde == $(this).parents('.voucher-yc-bg').find('.voucher-yc-bo').length-1){
			$(this).parents('.voucher-yc-bg').prev('.voucher-yc-addbtns').find('.ycaddopen').css("visibility", "visible");
		}
	}
})
$(document).on("mouseout", ".voucher-yc-bo", function() {
	var inde = $(this).index() - 1
	$(this).parents('.voucher-yc-bg').next('.voucher-yc-deletebtns').find(".ycdelect").eq(inde).css("visibility", "hidden");
	$(this).parents('.voucher-yc-bg').prev('.voucher-yc-addbtns').find(".ycadd").eq(inde).css("visibility", "hidden");
	if(inde == $(this).parents('.voucher-yc-bg').find('.voucher-yc-bo').length-1){
		$(this).parents('.voucher-yc-bg').prev('.voucher-yc-addbtns').find('.ycaddopen').css("visibility", "hidden");
	}
})
$(document).on("mouseover", ".voucher-yc-deletebtns .ycdeldiv", function() {
	var inde = $(this).index()
	if(!isSummaryVou){
		$(this).find('.ycdelect').css("visibility", "visible");
		$(this).parents('.voucher-yc-deletebtns').prevAll('.voucher-yc-addbtns').find('.ycadd').eq(inde - 1).css("visibility", "visible");
		if(inde == $(this).parents('.voucher-yc-deletebtns').prevAll('.voucher-yc-addbtns').find('.ycadddiv').length){
			$(this).parents('.voucher-yc-deletebtns').prevAll('.voucher-yc-addbtns').find('.ycaddopen').css("visibility", "visible");
		}
	}	
})
$(document).on("mouseover", ".voucher-yc-addbtns .ycadddiv", function() {
	var inde = $(this).index()
	if(!isSummaryVou){
		$(this).find('.ycadd').css("visibility", "visible");
		$(this).parents('.voucher-yc-addbtns').nextAll('.voucher-yc-deletebtns').find('.ycdelect').eq(inde).css("visibility", "visible");
		if(inde == $(this).parents('.voucher-yc-addbtns').find('.ycadddiv').length-1){
			$(this).parents('.voucher-yc-addbtns').find('.ycaddopen').css("visibility", "visible");
		}
	}
})
$(document).on("mouseover", ".voucher-yc-addbtns .ycaddopen", function() {
	var inde = $(this).parents('.voucher-yc-addbtns').find('.ycadddiv').length-1
	if(!isSummaryVou){
		$(this).css("visibility", "visible");
		$(this).parents('.voucher-yc-addbtns').find('.ycadddiv').eq(inde).find('.ycadd').css("visibility", "visible");
		$(this).parents('.voucher-yc-addbtns').nextAll('.voucher-yc-deletebtns').find('.ycdelect').eq(inde).css("visibility", "visible");
	}
})
$(document).on("mouseout", ".voucher-yc-deletebtns .ycdeldiv", function() {
	var inde = $(this).index()
	$(this).find('.ycdelect').css("visibility", "hidden");
	$(this).parents('.voucher-yc-deletebtns').prevAll('.voucher-yc-addbtns').find('.ycadd').eq(inde - 1).css("visibility", "hidden");
	if(inde == $(this).parents('.voucher-yc-deletebtns').prevAll('.voucher-yc-addbtns').find('.ycadddiv').length){
		$(this).parents('.voucher-yc-deletebtns').prevAll('.voucher-yc-addbtns').find('.ycaddopen').css("visibility", "hidden");
	}
})
$(document).on("mouseout", ".voucher-yc-addbtns .ycadddiv", function() {
	var inde = $(this).index()
	$(this).find('.ycadd').css("visibility", "hidden");
	$(this).parents('.voucher-yc-addbtns').nextAll('.voucher-yc-deletebtns').find('.ycdelect').eq(inde).css("visibility", "hidden");
	if(inde == $(this).parents('.voucher-yc-addbtns').find('.ycadddiv').length-1){
		$(this).parents('.voucher-yc-addbtns').find('.ycaddopen').css("visibility", "hidden");
	}
})
$(document).on("mouseout", ".voucher-yc-addbtns .ycaddopen", function() {
	var inde = $(this).parents('.voucher-yc-addbtns').find('.ycadddiv').length-1
	$(this).css("visibility", "hidden");
	$(this).parents('.voucher-yc-addbtns').find('.ycadddiv').eq(inde).find('.ycadd').css("visibility", "hidden");
	$(this).parents('.voucher-yc-addbtns').nextAll('.voucher-yc-deletebtns').find('.ycdelect').eq(inde).css("visibility", "hidden");
})
//鼠标移入移出展示删除按钮
$(document).on("mouseover",'.ycbody',function(){
	if($(this).find('.vouopendel').length>0){
		$(this).find('.vouopendel').show()
	}
})
$(document).on("mouseout",'.ycbody',function(){
	if($(this).find('.vouopendel').length>0){
		$(this).find('.vouopendel').hide()
	}
})
//辅助项分录表格点击防止穿透事件
$(document).on("click", ".voucher-yc", function(e) {
	stopPropagation(e)
})
$(document).on("click", ".yctz", function(e) {
	stopPropagation(e)
})
$(document).on("mouseout", ".voucher-yc", function(e) {
	stopPropagation(e)
})
//辅助核算项的改写
//当点击了enter的时候跳到焦点下一个输入框
//点击时候选中所有内容并失去焦点
$(document).on("click", ".ycbodyinp", function(e) {
	var editStatus0 = ($("#pzzhuantai").attr("vou-status") == undefined);
	if(!editStatus0) {
		var editStatus1 = ($("#pzzhuantai").attr("vou-status") == "O");
		var editStatus2 = (isInputor == true && (selectdata.data.inputor == ufgovkey.svUserCode || selectdata.data.inputor == undefined));
		var editStatus3 = ((isvousource && isvousourceclick == false) || isvousourceclick)
		var editStatus4 = $(this).parents('.voucher-yc-bo').attr('ifEdit')=='false'
		if(editStatus1 && (editStatus2 || isInputor == false) && editStatus3 && !editStatus4 && vouiseditsave) {
			if(!$(this).hasClass("field1") && !$(this).hasClass('quotaCode')){
				if(!isuniversities && !$(this).hasClass('projectCode')){
					$(this).removeAttr("readonly");
				}
			}
		} else {
			$(this).attr("readonly", true);
			return false;
		}
	} else {
		if(!$(this).hasClass("field1") && !$(this).hasClass('quotaCode')){
			if(!isuniversities && !$(this).hasClass('projectCode')){
				$(this).removeAttr("readonly");
			}
		}
	}
	stopPropagation(e);
	$(".all-no").hide();
})
$(document).on("focus", ".ycbodyinp", function(e) {
	var editStatus4 = $(this).parents('.voucher-yc-bo').attr('ifEdit')=='false'
	if(!isInputChange() || editStatus4){
		$(this).attr("readonly", true);
		return false;
	} else {
		if(!$(this).hasClass("field1") && !isuniversities ){
			if(!$(this).hasClass('quotaCode') && !$(this).hasClass('projectCode')){
				$(this).removeAttr("readonly");
			}
		}
		if(isuniversities && $(this).hasClass('projectCode')){
			return false
		}
		if(isuniversities && $(this).hasClass('quotaCode')){
			return false
		}
		if(isclick0 != 0 || ie11compatibleass) {
			return false
		}
		$('.ycbodyinp').removeClass('assCheck')
		$(this).addClass('assCheck')
		$(".ycbodys").hide() 
		var relation = $(this).attr('relation')
		if($(this).attr('relation') != undefined) {
			if(vousinglepzzy == true && isdobabstractinp == false  && vousingelzysdob){
				treePosition($(this),$('#AssDataAll').find("." + relation),true)
			}else{
				treePosition($(this),$('#AssDataAll').find("." + relation),false)
			}
			if($(this).attr('relation') == 'employeeCode' && isdepartmentChange){
				if($(this).parents('.voucher-yc-bo').find('.ycbodyinp[relation="departmentCode"]').length>0 && $(this).parents('.voucher-yc-bo').find('.ycbodyinp[relation="departmentCode"]').attr('code')!=undefined){
					var  departmentCode = $(this).parents('.voucher-yc-bo').find('.ycbodyinp[relation="departmentCode"]').attr('code')
					var emths = $(this)
					ufma.get('/gl/vou/getEmployeeList/'+rpt.nowAgencyCode+'/'+rpt.nowAcctCode+'/'+departmentCode,'',function(result){
						var employeeCodedata = result.data
						var assnoll = ''
						if(employeeCodedata.length>100){
							var nowlen = 0
							for(var n = 0; n < employeeCodedata.length; n++) {
								if(employeeCodedata[n].enabled == 1) {
									if(isdefaultopen){
										if(nowlen<100){
											nowlen++;
											assnoll += '<li datalen = '+n+' department = "'+employeeCodedata[n].departmentCode+'" levels = "' + employeeCodedata[n].levelNum + '" fname="' + employeeCodedata[n].chrFullname + '" class="PopListBoxItem unselected  dianji' + employeeCodedata[n].isLeaf + ' fzlv' + employeeCodedata[n].levelNum + ' "><p class="sq"><span class="code">' + employeeCodedata[n].code + '</span> <span class="name">' + employeeCodedata[n].name + '</span></p></li>'
										}else if(nowlen>=100){
											assnoll += '<li class="noallassno">当前数据过多，请使用搜索过滤</li>'
											break;
										}
									}else{
										if(employeeCodedata[n].levelNum == 1 && nowlen<100){
											nowlen++;
											assnoll += '<li datalen = '+n+' department = "'+employeeCodedata[n].departmentCode+'" levels = "' + employeeCodedata[n].levelNum + '" fname="' + employeeCodedata[n].chrFullname + '" class="PopListBoxItem unselected  dianji' + employeeCodedata[n].isLeaf + ' fzlv' + employeeCodedata[n].levelNum + ' "><p class="sq"><span class="code">' + employeeCodedata[n].code + '</span> <span class="name">' + employeeCodedata[n].name + '</span></p></li>'
										}else if(employeeCodedata[n].levelNum == 1 && nowlen>=100){
											assnoll += '<li class="noallassno">当前数据过多，请使用搜索过滤</li>'
											break;
										}
									}
								}
							}
						}else{
							for(var n = 0; n < employeeCodedata.length; n++) {
								if(employeeCodedata[n].enabled == 1) {
									if(employeeCodedata[n].levelNum == 1){
										assnoll += '<li department = "'+employeeCodedata[n].departmentCode+'" levels = "' + employeeCodedata[n].levelNum + '" fname="' + employeeCodedata[n].chrFullname + '" class="PopListBoxItem unselected  dianji' + employeeCodedata[n].isLeaf + ' fzlv' + employeeCodedata[n].levelNum + ' "><p class="sq"><span class="code">' + employeeCodedata[n].code + '</span> <span class="name">' + employeeCodedata[n].name + '</span></p></li>'
									}else{
										assnoll += '<li department = "'+employeeCodedata[n].departmentCode+'" style="display:none;" levels = "' + employeeCodedata[n].levelNum + '" fname="' + employeeCodedata[n].chrFullname + '" class="unselected  dianji' + employeeCodedata[n].isLeaf + ' fzlv' + employeeCodedata[n].levelNum + ' "><p><span class="code">' + employeeCodedata[n].code + '</span> <span class="name">' + employeeCodedata[n].name + '</span></p></li>'
									}
								} else {
									assnoll += '<li levels = "' + employeeCodedata[n].levelNum + '" fname="' + employeeCodedata[n].chrFullname + '" class=" unselected allnoshow  dianji' + employeeCodedata[n].isLeaf + ' fzlv' + employeeCodedata[n].levelNum + ' "><p><span class="code">' + employeeCodedata[n].code + '</span> <span class="name">' + employeeCodedata[n].name + '</span></p></li>'
								}
							}
						}
						if(isaddAssbtn==true){
							assnoll += '<div class="fzhsadd" tzurl ="departmentCode">+新增 人员</div>'
						}
						$('#AssDataAll').find('.employeeCode').html(assnoll).attr('Part','und')
						if(emths.val()!=''){
							emths.val(emths.attr('code'))
							emths.trigger('input')
						}
					})
				
				}else if($('#AssDataAll').find(".employeeCode").attr('Part') == 'und'){
					var l = 'employeeCode'
					$('#AssDataAll').find('.employeeCode').html('')
					var assnoll = ''
					if(fzhsxl[l].length>100){
						var nowlen = 0
						for(var n = 0; n < fzhsxl[l].length; n++) {
							if(fzhsxl[l][n].enabled == 1) {
								if(isdefaultopen){
									if(nowlen<100){
										nowlen++;
										assnoll += '<li datalen = '+n+' department = "'+fzhsxl[l][n].departmentCode+'" levels = "' + fzhsxl[l][n].levelNum + '" fname="' + fzhsxl[l][n].chrFullname + '" class="PopListBoxItem unselected  dianji' + fzhsxl[l][n].isLeaf + ' fzlv' + fzhsxl[l][n].levelNum + ' "><p class="sq"><span class="code">' + fzhsxl[l][n].code + '</span> <span class="name">' + fzhsxl[l][n].name + '</span></p></li>'
									}else if(nowlen>=100){
										assnoll += '<li class="noallassno">当前数据过多，请使用搜索过滤</li>'
										break;
									}
								}else{
									if(fzhsxl[l][n].levelNum == 1 && nowlen<100){
										nowlen++;
										assnoll += '<li datalen = '+n+' department = "'+fzhsxl[l][n].departmentCode+'" levels = "' + fzhsxl[l][n].levelNum + '" fname="' + fzhsxl[l][n].chrFullname + '" class="PopListBoxItem unselected  dianji' + fzhsxl[l][n].isLeaf + ' fzlv' + fzhsxl[l][n].levelNum + ' "><p class="sq"><span class="code">' + fzhsxl[l][n].code + '</span> <span class="name">' + fzhsxl[l][n].name + '</span></p></li>'
									}else if(fzhsxl[l][n].levelNum == 1 && nowlen>=100){
										assnoll += '<li class="noallassno">当前数据过多，请使用搜索过滤</li>'
										break;
									}
								}
							}
						}
					}else{
						for(var n = 0; n < fzhsxl[l].length; n++) {
							if(fzhsxl[l][n].enabled == 1) {
								if(fzhsxl[l][n].levelNum == 1){
									assnoll += '<li department = "'+fzhsxl[l][n].departmentCode+'" levels = "' + fzhsxl[l][n].levelNum + '" fname="' + fzhsxl[l][n].chrFullname + '" class="PopListBoxItem unselected  dianji' + fzhsxl[l][n].isLeaf + ' fzlv' + fzhsxl[l][n].levelNum + ' "><p class="sq"><span class="code">' + fzhsxl[l][n].code + '</span> <span class="name">' + fzhsxl[l][n].name + '</span></p></li>'
								}else{
									assnoll += '<li department = "'+fzhsxl[l][n].departmentCode+'" style="display:none;" levels = "' + fzhsxl[l][n].levelNum + '" fname="' + fzhsxl[l][n].chrFullname + '" class="unselected  dianji' + fzhsxl[l][n].isLeaf + ' fzlv' + fzhsxl[l][n].levelNum + ' "><p><span class="code">' + fzhsxl[l][n].code + '</span> <span class="name">' + fzhsxl[l][n].name + '</span></p></li>'
								}
							} else {
								assnoll += '<li levels = "' + fzhsxl[l][n].levelNum + '" fname="' + fzhsxl[l][n].chrFullname + '" class=" unselected allnoshow  dianji' + fzhsxl[l][n].isLeaf + ' fzlv' + fzhsxl[l][n].levelNum + ' "><p><span class="code">' + fzhsxl[l][n].code + '</span> <span class="name">' + fzhsxl[l][n].name + '</span></p></li>'
							}
						}
					}
					if(isaddAssbtn==true){
						assnoll += '<div class="fzhsadd" tzurl = ' + l + '>+新增 ' + tablehead[l].ELE_NAME + '</div>'
					}
					$('#AssDataAll').find('.employeeCode').html(assnoll).removeAttr('Part')
				}
			}
			if($(this).attr('relation') == 'expecoCode' && isprojectByVou){
				var l = 'expecoCode'
				var quotainp = $(this).parents('.voucher-yc-bo').find('.ycbodyinp[relation="quotaCode"]')
				var project = $(this).parents('.voucher-center').find('.projectuniverinp')
				if(project.length==0){
					project = $(this).parents('.voucher-yc-bo').find('.ycbodyinp[relation="projectCode"]')
				}
				if(quotainp.length>0 && quotainp.attr('code')!=undefined && project.attr('code')!=undefined){
					var  quotainpCode = quotainp.attr('code')
					var emths = $(this)
					var sedata = {
						"pbmProjectWithQuotaVo": [{
							"projectCode": project.attr('code'), 
							"proQuotaList": [{
								"proQuotaCode":quotainpCode 
							}]
						}]
					} 
					var employeeCodedata = []
					var expecoCodedata = fzhsxl['expecoCode']
					if(vouassRange[project.attr('code')+'quota'+quotainpCode+'expecoCodedata']!=undefined){
						var resultdata = vouassRange[project.attr('code')+'quota'+quotainpCode+'expecoCodedata']
						for(var i=0;i<resultdata.length;i++){
							if(expecoCodeindex[resultdata[i].chrCode]!=undefined){
								employeeCodedata.push(expecoCodedata[expecoCodeindex[resultdata[i].chrCode]])
							}
						}
					}else{
						ufma.ajaxDef('/pf/pbm/pbm/base/project/queryExpecoByProjectQuota','post',sedata,function(result){
							if(result.data!=undefined){
								vouassRange[project.attr('code')+'quota'+quotainpCode+'expecoCodedata'] =result.data 
								for(var i=0;i<result.data.length;i++){
									if(expecoCodeindex[result.data[i].chrCode]!=undefined){
										employeeCodedata.push(expecoCodedata[expecoCodeindex[result.data[i].chrCode]])
									}
								}
							}
						})
					}
					var dxcode = '';
					var ssr = 0;
					var assnoll = ''
					if(employeeCodedata.length>100){
						var nowlen = 0
						for(var n = 0; n < employeeCodedata.length; n++) {
							if(employeeCodedata[n].enabled == 1) {
								if(isdefaultopen){
									if(nowlen<100){
										nowlen++;
										if(employeeCodedata[n].isLeaf == 1){
											dxcode = employeeCodedata[n].code
										}
										assnoll += '<li datalen = '+n+' levels = "' + employeeCodedata[n].levelNum + '" fname="' + employeeCodedata[n].chrFullname + '" class="PopListBoxItem unselected  dianji' + employeeCodedata[n].isLeaf + ' fzlv' + employeeCodedata[n].levelNum + ' "><p class="sq"><span class="code">' + employeeCodedata[n].code + '</span> <span class="name">' + employeeCodedata[n].name + '</span></p></li>'
									}else if(nowlen>=100){
										assnoll += '<li class="noallassno">当前数据过多，请使用搜索过滤</li>'
										break;
									}
								}else{
									if(employeeCodedata[n].levelNum == 1 && nowlen<100){
										nowlen++;
										if(employeeCodedata[n].isLeaf == 1){
											dxcode = employeeCodedata[n].code
										}
										assnoll += '<li datalen = '+n+' levels = "' + employeeCodedata[n].levelNum + '" fname="' + employeeCodedata[n].chrFullname + '" class="PopListBoxItem unselected  dianji' + employeeCodedata[n].isLeaf + ' fzlv' + employeeCodedata[n].levelNum + ' "><p class="sq"><span class="code">' + employeeCodedata[n].code + '</span> <span class="name">' + employeeCodedata[n].name + '</span></p></li>'
									}else if(employeeCodedata[n].levelNum == 1 && nowlen>=100){
										assnoll += '<li class="noallassno">当前数据过多，请使用搜索过滤</li>'
										break;
									}
								}
							}
						}
					}else{
						for(var n = 0; n < employeeCodedata.length; n++) {
							if(employeeCodedata[n].enabled == 1) {
								if(employeeCodedata[n].levelNum == 1){
									if(employeeCodedata[n].isLeaf == 1){
										dxcode = employeeCodedata[n].code
									}
									assnoll += '<li levels = "' + employeeCodedata[n].levelNum + '" fname="' + employeeCodedata[n].chrFullname + '" class="PopListBoxItem unselected  dianji' + employeeCodedata[n].isLeaf + ' fzlv' + employeeCodedata[n].levelNum + ' "><p class="sq"><span class="code">' + employeeCodedata[n].code + '</span> <span class="name">' + employeeCodedata[n].name + '</span></p></li>'
								}else{
									if(employeeCodedata[n].isLeaf == 1){
										dxcode = employeeCodedata[n].code
									}
									assnoll += '<li style="display:none;" levels = "' + employeeCodedata[n].levelNum + '" fname="' + employeeCodedata[n].chrFullname + '" class="unselected  dianji' + employeeCodedata[n].isLeaf + ' fzlv' + employeeCodedata[n].levelNum + ' "><p><span class="code">' + employeeCodedata[n].code + '</span> <span class="name">' + employeeCodedata[n].name + '</span></p></li>'
								}
							} else {
								assnoll += '<li levels = "' + employeeCodedata[n].levelNum + '" fname="' + employeeCodedata[n].chrFullname + '" class=" unselected allnoshow  dianji' + employeeCodedata[n].isLeaf + ' fzlv' + employeeCodedata[n].levelNum + ' "><p><span class="code">' + employeeCodedata[n].code + '</span> <span class="name">' + employeeCodedata[n].name + '</span></p></li>'
							}
						}
					}
					if(isaddAssbtn==true){
						assnoll += '<div class="fzhsadd" tzurl = ' + l + '>+新增 ' + tablehead[l].ELE_NAME + '</div>'
					}
					$('#AssDataAll').find('.expecoCode').html(assnoll).attr('Part','und')
					if(emths.val()!=''){
						emths.val(emths.attr('code'))
						emths.trigger('input')
					}
				}else if($('#AssDataAll').find(".expecoCode").attr('Part') == 'und'){
					var l = 'expecoCode'
					var emths = $(this)
					$('#AssDataAll').find('.expecoCode').html('')
					var rangedatas  = emths.parents('.voucher-yc-bg').find('.voucher-yc-bt').find('.ychead[name="'+l+'"]').attr('isrange')
					if(rangedatas == undefined || rangedatas == 'undefined' || rangedatas.length == 0 || rangedatas=='true'){
						rangedatas = fzhsxl[l]
					}
					var assnoll = ''
					if(rangedatas.length>100){
						var nowlen = 0
						for(var n = 0; n < rangedatas.length; n++) {
							if(rangedatas[n].enabled == 1) {
								if(isdefaultopen){
									if(nowlen<100){
										nowlen++;
										assnoll += '<li datalen = '+n+' department = "'+rangedatas[n].departmentCode+'" levels = "' + rangedatas[n].levelNum + '" fname="' + rangedatas[n].chrFullname + '" class="PopListBoxItem unselected  dianji' + rangedatas[n].isLeaf + ' fzlv' + rangedatas[n].levelNum + ' "><p class="sq"><span class="code">' + rangedatas[n].code + '</span> <span class="name">' + rangedatas[n].name + '</span></p></li>'
									}else if(nowlen>=100){
										assnoll += '<li class="noallassno">当前数据过多，请使用搜索过滤</li>'
										break;
									}
								}else{
									if(rangedatas[n].levelNum == 1 && nowlen<100){
										nowlen++;
										assnoll += '<li datalen = '+n+' department = "'+rangedatas[n].departmentCode+'" levels = "' + rangedatas[n].levelNum + '" fname="' + rangedatas[n].chrFullname + '" class="PopListBoxItem unselected  dianji' + rangedatas[n].isLeaf + ' fzlv' + rangedatas[n].levelNum + ' "><p class="sq"><span class="code">' + rangedatas[n].code + '</span> <span class="name">' + rangedatas[n].name + '</span></p></li>'
									}else if(rangedatas[n].levelNum == 1 && nowlen>=100){
										assnoll += '<li class="noallassno">当前数据过多，请使用搜索过滤</li>'
										break;
									}
								}
							}
						}
					}else{
						for(var n = 0; n < rangedatas.length; n++) {
							if(rangedatas[n].enabled == 1) {
								if(rangedatas[n].levelNum == 1){
									assnoll += '<li department = "'+rangedatas[n].departmentCode+'" levels = "' + rangedatas[n].levelNum + '" fname="' + rangedatas[n].chrFullname + '" class="PopListBoxItem unselected  dianji' + rangedatas[n].isLeaf + ' fzlv' + rangedatas[n].levelNum + ' "><p class="sq"><span class="code">' + rangedatas[n].code + '</span> <span class="name">' + rangedatas[n].name + '</span></p></li>'
								}else{
									assnoll += '<li department = "'+rangedatas[n].departmentCode+'" style="display:none;" levels = "' + rangedatas[n].levelNum + '" fname="' + rangedatas[n].chrFullname + '" class="unselected  dianji' + rangedatas[n].isLeaf + ' fzlv' + rangedatas[n].levelNum + ' "><p><span class="code">' + rangedatas[n].code + '</span> <span class="name">' + rangedatas[n].name + '</span></p></li>'
								}
							} else {
								assnoll += '<li levels = "' + rangedatas[n].levelNum + '" fname="' + rangedatas[n].chrFullname + '" class=" unselected allnoshow  dianji' + rangedatas[n].isLeaf + ' fzlv' + rangedatas[n].levelNum + ' "><p><span class="code">' + rangedatas[n].code + '</span> <span class="name">' + rangedatas[n].name + '</span></p></li>'
							}
						}
					}
					if(isaddAssbtn==true){
						assnoll += '<div class="fzhsadd" tzurl = ' + l + '>+新增 ' + tablehead[l].ELE_NAME + '</div>'
					}
					$('#AssDataAll').find('.expecoCode').html(assnoll).removeAttr('Part')
				}
			}
			if($(this).attr('relation') == 'quotaCode' && isprojectByVou){
				var l = 'quotaCode'
				var quotainp = $(this).parents('.voucher-yc-bo').find('.ycbodyinp[relation="expecoCode"]')
				var project = $(this).parents('.voucher-center').find('.projectuniverinp')
				if(project.length==0){
					project = $(this).parents('.voucher-yc-bo').find('.ycbodyinp[relation="projectCode"]')
				}
				// if(quotainp.length>0 && quotainp.attr('code')!=undefined && project.attr('code')!=undefined){
				// 	var  quotainpCode = quotainp.attr('code')
				// 	var emths = $(this)
				// 	var sedata = {
				// 		"project": {
				// 			"projectCode": project.attr('code') 
				// 		},
				// 		"maEleExpecoVos": [{
				// 			"chrCode": quotainpCode
				// 		}]
				// 	}
				// 	var employeeCodedata = [] 
				// 	if(vouassRange[project.attr('code')+'expeco'+quotainpCode+'quotaCodedata']!=undefined){

				// 	}else{
				// 		ufma.ajaxDef('/pf/pbm/pbm/base/project/queryQuotaByProjectAndExpeco','post',sedata,function(result){
				// 			var expecoCodedata = fzhsxl['quotaCode']
				// 			if(result.data != undefined){
				// 				vouassRange[project.attr('code')+'expeco'+quotainpCode+'quotaCodedata'] = result.data
				// 				for(var i=0;i<result.data.length;i++){
				// 					if(quotaCodeindex[result.data[i].quotaCode]!=undefined){
				// 						employeeCodedata.push(expecoCodedata[quotaCodeindex[result.data[i].quotaCode]])
				// 					}
				// 				}
				// 			}else{
				// 				vouassRange[project.attr('code')+'expeco'+expecoinp.attr('code')+'quotaCodedata'] = []
				// 				$(this).parents('.voucher-yc-bo').find('.ycbodyinp[relation="quotaCode"]').val('').removeAttr('code')
				// 			}
				// 		})
				// 	}
				// 	var assnoll = ''
				// 	if(employeeCodedata.length>100){
				// 		var nowlen = 0
				// 		for(var n = 0; n < employeeCodedata.length; n++) {
				// 			if(employeeCodedata[n].enabled == 1) {
				// 				if(isdefaultopen){
				// 					if(nowlen<100){
				// 						nowlen++;
				// 						assnoll += '<li datalen = '+n+' levels = "' + employeeCodedata[n].levelNum + '" fname="' + employeeCodedata[n].chrFullname + '" class="PopListBoxItem unselected  dianji' + employeeCodedata[n].isLeaf + ' fzlv' + employeeCodedata[n].levelNum + ' "><p class="sq"><span class="code">' + employeeCodedata[n].code + '</span> <span class="name">' + employeeCodedata[n].name + '</span></p></li>'
				// 					}else if(nowlen>=100){
				// 						assnoll += '<li class="noallassno">当前数据过多，请使用搜索过滤</li>'
				// 						break;
				// 					}
				// 				}else{
				// 					if(employeeCodedata[n].levelNum == 1 && nowlen<100){
				// 						nowlen++;
				// 						assnoll += '<li datalen = '+n+' levels = "' + employeeCodedata[n].levelNum + '" fname="' + employeeCodedata[n].chrFullname + '" class="PopListBoxItem unselected  dianji' + employeeCodedata[n].isLeaf + ' fzlv' + employeeCodedata[n].levelNum + ' "><p class="sq"><span class="code">' + employeeCodedata[n].code + '</span> <span class="name">' + employeeCodedata[n].name + '</span></p></li>'
				// 					}else if(employeeCodedata[n].levelNum == 1 && nowlen>=100){
				// 						assnoll += '<li class="noallassno">当前数据过多，请使用搜索过滤</li>'
				// 						break;
				// 					}
				// 				}
				// 			}
				// 		}
				// 	}else{
				// 		for(var n = 0; n < employeeCodedata.length; n++) {
				// 			if(employeeCodedata[n].enabled == 1) {
				// 				if(employeeCodedata[n].levelNum == 1){
				// 					assnoll += '<li levels = "' + employeeCodedata[n].levelNum + '" fname="' + employeeCodedata[n].chrFullname + '" class="PopListBoxItem unselected  dianji' + employeeCodedata[n].isLeaf + ' fzlv' + employeeCodedata[n].levelNum + ' "><p class="sq"><span class="code">' + employeeCodedata[n].code + '</span> <span class="name">' + employeeCodedata[n].name + '</span></p></li>'
				// 				}else{
				// 					assnoll += '<li style="display:none;" levels = "' + employeeCodedata[n].levelNum + '" fname="' + employeeCodedata[n].chrFullname + '" class="unselected  dianji' + employeeCodedata[n].isLeaf + ' fzlv' + employeeCodedata[n].levelNum + ' "><p><span class="code">' + employeeCodedata[n].code + '</span> <span class="name">' + employeeCodedata[n].name + '</span></p></li>'
				// 				}
				// 			} else {
				// 				assnoll += '<li levels = "' + employeeCodedata[n].levelNum + '" fname="' + employeeCodedata[n].chrFullname + '" class=" unselected allnoshow  dianji' + employeeCodedata[n].isLeaf + ' fzlv' + employeeCodedata[n].levelNum + ' "><p><span class="code">' + employeeCodedata[n].code + '</span> <span class="name">' + employeeCodedata[n].name + '</span></p></li>'
				// 			}
				// 		}
				// 	}
				// 	if(isaddAssbtn==true){
				// 		assnoll += '<div class="fzhsadd" tzurl = ' + l + '>+新增 ' + tablehead[l].ELE_NAME + '</div>'
				// 	}
				// 	$('#AssDataAll').find('.quotaCode').html(assnoll).attr('Part','und')
				// 	if(emths.val()!=''){
				// 		emths.val(emths.attr('code'))
				// 		emths.trigger('input')
				// 	}
				// }else if($('#AssDataAll').find(".quotaCode").attr('Part') == 'und'){
				// 	var l = 'quotaCode'
				// 	var emths = $(this)
				// 	$('#AssDataAll').find('.quotaCode').html('')
				// 	var rangedatas  = emths.parents('.voucher-yc-bg').find('.voucher-yc-bt').find('.ychead[name="'+l+'"]').attr('isrange')
				// 	if(rangedatas == undefined || rangedatas == 'undefined' || rangedatas.length == 0 || rangedatas=='true'){
				// 		rangedatas = fzhsxl[l]
				// 	}
				// 	var assnoll = ''
				// 	if(rangedatas.length>100){
				// 		var nowlen = 0
				// 		for(var n = 0; n < rangedatas.length; n++) {
				// 			if(rangedatas[n].enabled == 1) {
				// 				if(isdefaultopen){
				// 					if(nowlen<100){
				// 						nowlen++;
				// 						assnoll += '<li datalen = '+n+' department = "'+rangedatas[n].departmentCode+'" levels = "' + rangedatas[n].levelNum + '" fname="' + rangedatas[n].chrFullname + '" class="PopListBoxItem unselected  dianji' + rangedatas[n].isLeaf + ' fzlv' + rangedatas[n].levelNum + ' "><p class="sq"><span class="code">' + rangedatas[n].code + '</span> <span class="name">' + rangedatas[n].name + '</span></p></li>'
				// 					}else if(nowlen>=100){
				// 						assnoll += '<li class="noallassno">当前数据过多，请使用搜索过滤</li>'
				// 						break;
				// 					}
				// 				}else{
				// 					if(rangedatas[n].levelNum == 1 && nowlen<100){
				// 						nowlen++;
				// 						assnoll += '<li datalen = '+n+' department = "'+rangedatas[n].departmentCode+'" levels = "' + rangedatas[n].levelNum + '" fname="' + rangedatas[n].chrFullname + '" class="PopListBoxItem unselected  dianji' + rangedatas[n].isLeaf + ' fzlv' + rangedatas[n].levelNum + ' "><p class="sq"><span class="code">' + rangedatas[n].code + '</span> <span class="name">' + rangedatas[n].name + '</span></p></li>'
				// 					}else if(rangedatas[n].levelNum == 1 && nowlen>=100){
				// 						assnoll += '<li class="noallassno">当前数据过多，请使用搜索过滤</li>'
				// 						break;
				// 					}
				// 				}
				// 			}
				// 		}
				// 	}else{
				// 		for(var n = 0; n < rangedatas.length; n++) {
				// 			if(rangedatas[n].enabled == 1) {
				// 				if(rangedatas[n].levelNum == 1){
				// 					assnoll += '<li department = "'+rangedatas[n].departmentCode+'" levels = "' + rangedatas[n].levelNum + '" fname="' + rangedatas[n].chrFullname + '" class="PopListBoxItem unselected  dianji' + rangedatas[n].isLeaf + ' fzlv' + rangedatas[n].levelNum + ' "><p class="sq"><span class="code">' + rangedatas[n].code + '</span> <span class="name">' + rangedatas[n].name + '</span></p></li>'
				// 				}else{
				// 					assnoll += '<li department = "'+rangedatas[n].departmentCode+'" style="display:none;" levels = "' + rangedatas[n].levelNum + '" fname="' + rangedatas[n].chrFullname + '" class="unselected  dianji' + rangedatas[n].isLeaf + ' fzlv' + rangedatas[n].levelNum + ' "><p><span class="code">' + rangedatas[n].code + '</span> <span class="name">' + rangedatas[n].name + '</span></p></li>'
				// 				}
				// 			} else {
				// 				assnoll += '<li levels = "' + rangedatas[n].levelNum + '" fname="' + rangedatas[n].chrFullname + '" class=" unselected allnoshow  dianji' + rangedatas[n].isLeaf + ' fzlv' + rangedatas[n].levelNum + ' "><p><span class="code">' + rangedatas[n].code + '</span> <span class="name">' + rangedatas[n].name + '</span></p></li>'
				// 			}
				// 		}
				// 	}
				// 	if(isaddAssbtn==true){
				// 		assnoll += '<div class="fzhsadd" tzurl = ' + l + '>+新增 ' + tablehead[l].ELE_NAME + '</div>'
				// 	}
				// 	$('#AssDataAll').find('.quotaCode').html(assnoll).removeAttr('Part')
				// }
			}
			
		}
		if(isclick0 == 0 && !ie11compatibleass) {
			if($(this).val() == '') {
				var trall = $(this).parents('.voucher-yc-bg')
				var trthis = $(this).parents('.voucher-yc-bo')
				var projectCode;
				if(trthis.find('.ycbodyinp[relation="projectCode"]').length == 0){
					projectCode = trthis.parents('.voucher-center').find('.projectuniverinp').attr('code')
				}else{
					projectCode = trthis.find('.ycbodyinp[relation="projectCode"]').attr('code')
				}
				$('#AssDataAll').find("." + relation).find('li').removeClass("selected").addClass("unselected").removeClass('noRange').removeClass('PopListBoxItem').hide()
				if(isdefaultopen){
					$('#AssDataAll').find("." + relation).find('li').addClass('PopListBoxItem').show()
					$('#AssDataAll').find("." + relation).find('li').find('p').removeClass('sq')
				}else{
					$('#AssDataAll').find("." + relation).find('li[levels=1]').addClass('PopListBoxItem').show()
					$('#AssDataAll').find("." + relation).find('li[levels=1]').find('p').addClass('sq')
				}
				$('#AssDataAll').find("." + relation).find('.noallassno').remove()
				var accocode= $(this).parents('.voucher-center').find('.accountinginp').attr('code')
				for(var i = 0; i < trall.find('.voucher-yc-bt').find('.ychead').length; i++) {
					var now = trthis.find('.ycbody').eq(i).find('.ycbodyinp').attr('relation')
					if(trall.find('.voucher-yc-bt').find('.ychead').eq(i).attr('mrvalue') != undefined || trall.find('.voucher-yc-bt').find('.ychead').eq(i).attr('isrange')) {
						if(now!=undefined){
							var datanocla = fzhsxl[now]
							var lun = $('#AssDataAll').find("." + now)
							if(datanocla!=undefined){
								for(var z = 0; z < datanocla.length; z++) {
									if(trthis.find('.ycbody').eq(i).find('.ycbodyinp').val() == '' && trall.find('.voucher-yc-bt').find('.ychead').eq(i).attr('mrvalue') != undefined) {
										if(datanocla[z].code == trall.find('.voucher-yc-bt').find('.ychead').eq(i).attr('mrvalue') && datanocla[z].isLeaf!=0) {
											if(isaccfullname){
												trthis.find('.ycbody').eq(i).find('.ycbodyinp').val(datanocla[z].code + ' ' + datanocla[z].chrFullname).attr('code',datanocla[z].code)
											}else{
												trthis.find('.ycbody').eq(i).find('.ycbodyinp').val(datanocla[z].code + ' ' + datanocla[z].name).attr('code',datanocla[z].code)
											}
										}
									}
									if(trall.find('.voucher-yc-bt').find('.ychead').eq(i).attr('isrange') != 'undefined'){
										if(isprojectByVou && !$.isNull(projectCode)){
											if(vouassRange[accocode+now+projectCode][datanocla[z].code]==undefined){
												lun.find('li').eq(z).addClass('noRange').removeClass('PopListBoxItem').addClass("noselected").hide()
											}else{
												lun.find('li').eq(z).show()
											}
										}else{
											if(vouassRange[accocode+now][datanocla[z].code]==undefined){
												lun.find('li').eq(z).addClass('noRange').removeClass('PopListBoxItem').addClass("noselected").hide()
											}else{
												lun.find('li').eq(z).show()
											}
										}
									}
								}
							}
						}
					}
				}
				var rangedata = trall.find('.voucher-yc-bt').find('.ychead[name="'+relation+'"]').attr('isrange')
				if($('#AssDataAll').find("." + relation).attr('isAlllength')=='now'){
					var datanocla = rangedata != 'undefined'?vouassRange[accocode+relation +'data']:fzhsxl[relation]
					if(isprojectByVou && !$.isNull(projectCode)){
						datanocla = rangedata != 'undefined'?vouassRange[accocode+relation+projectCode+'data']:fzhsxl[relation]
					}
					var nowlen = 0;
					var assnoll = ''
					$("#AssDataAll").find('.'+ relation).html('')
					if(datanocla!=undefined){
						for(var n = 0; n < datanocla.length; n++) {
							if(datanocla[n].enabled == 1 && rangedata == 'undefined') {
								if(isdefaultopen){
									if(nowlen<100){
										nowlen++;
										assnoll += '<li datalen = '+n+' department = "'+datanocla[n].departmentCode+'" levels = "' + datanocla[n].levelNum + '" fname="' + datanocla[n].chrFullname + '" class="PopListBoxItem unselected  dianji' + datanocla[n].isLeaf + ' fzlv' + datanocla[n].levelNum + ' "><p class="sq"><span class="code">' + datanocla[n].code + '</span> <span class="name">' + datanocla[n].name + '</span></p></li>'
									}else if(nowlen>=100){
										assnoll += '<li class="noallassno">当前数据过多，请使用搜索过滤</li>'
										break;
									}
								}else{
									if(datanocla[n].levelNum == 1 && nowlen<100){
										nowlen++;
										assnoll += '<li datalen = '+n+' department = "'+datanocla[n].departmentCode+'" levels = "' + datanocla[n].levelNum + '" fname="' + datanocla[n].chrFullname + '" class="PopListBoxItem unselected  dianji' + datanocla[n].isLeaf + ' fzlv' + datanocla[n].levelNum + ' "><p class="sq"><span class="code">' + datanocla[n].code + '</span> <span class="name">' + datanocla[n].name + '</span></p></li>'
									}else if(datanocla[n].levelNum == 1 && nowlen>=100){
										assnoll += '<li class="noallassno">当前数据过多，请使用搜索过滤</li>'
										break;
									}
								}
							}else if(rangedata != 'undefined'){
								if(nowlen<100){
									nowlen++;
									assnoll += '<li datalen = '+n+' department = "'+datanocla[n].departmentCode+'" levels = "' + datanocla[n].levelNum + '" fname="' + datanocla[n].chrFullname + '" class="PopListBoxItem unselected  dianji' + datanocla[n].isLeaf + ' fzlv' + datanocla[n].levelNum + ' "><p><span class="code">' + datanocla[n].code + '</span> <span class="name">' + datanocla[n].name + '</span></p></li>'
								}else if(nowlen>=100){
									assnoll += '<li class="noallassno">当前数据过多，请使用搜索过滤</li>'
									break;
								}
							}
						}
					}
					if(tablehead[relation]!=undefined && isaddAssbtn==true){
						assnoll += '<div class="fzhsadd" tzurl = ' + relation+ '>+新增 ' + tablehead[relation].ELE_NAME + '</div>'
					}
					$("#AssDataAll").find('.'+ relation).html(assnoll)
					if(isdefaultopen){
						$('#AssDataAll').find("." + relation).find('li').addClass('PopListBoxItem').show()
						$('#AssDataAll').find("." + relation).find('li').find('p').removeClass('sq')
					}else{
						$('#AssDataAll').find("." + relation).find('li[levels=1]').addClass('PopListBoxItem').show()
						$('#AssDataAll').find("." + relation).find('li[levels=1]').find('p').addClass('sq')
					}
				}
				if($(this).val()!=''){
					$(this).val($(this).attr('code'))
					$(this).trigger('input')
				}
				if(rangedata != 'undefined' &&$(this).val() ==''){
					$(this).trigger('input')
				}
			} else {
				var relation = $(this).attr('relation')
				$('#AssDataAll').find("." + relation).find('li').removeClass("selected").addClass("unselected").removeClass('noRange').removeClass('PopListBoxItem').hide()
				var accocode= $(this).parents('.voucher-center').find('.accountinginp').attr('code')
				var rangedata =  $(this).parents('.voucher-yc-bg').find('.voucher-yc-bt').find('.ychead[name="'+relation+'"]').attr('isrange')
				if(rangedata!='undefined'){
					var lun = $('#AssDataAll').find("." + relation)
					var datanocla = fzhsxl[relation]
					if(datanocla!=undefined){
						for(var z = 0; z < datanocla.length; z++) {
							if(isprojectByVou && !$.isNull(projectCode)){
								if(vouassRange[accocode+relation+projectCode][datanocla[z].code]==undefined){
									lun.find('li').eq(z).addClass('noRange').removeClass('PopListBoxItem').addClass("noselected").hide()
								}else{
									lun.find('li').eq(z).show()
								}
							}else{
								if(vouassRange[accocode+relation][datanocla[z].code]==undefined){
									lun.find('li').eq(z).addClass('noRange').removeClass('PopListBoxItem').addClass("noselected").hide()
								}else{
									lun.find('li').eq(z).show()
								}
							}
						}
					}
					$(this).trigger('input')
				}
				if($(this).attr('code') != undefined && $(this).hasClass('diffTermDirinp') != true) {
					$(this).val($(this).attr('code'))
					$(this).trigger('input')
				}
			}
		}
	}
})
//辅助金额input
$(document).on("keydown", ".yctz", function(event) {
	event = event || window.event;
	var keyCode = event.keyCode
	//	if(!isNumber(keyCode, event)) return false
	_this = $(this);
	$('.ycbodyinp').removeClass('assCheck')
	if(event.shiftKey && event.keyCode == 37) {
		$(this).prev(".ycbody").find(".ycbodyinp").focus()
		event.preventDefault();
		event.returnValue = false;
		event.keyCode == 0
		return false;
	}
	if(event.shiftKey && event.keyCode == 39) {
		if($(this).parents('.voucher-yc-bo').next('.voucher-yc-bo').length>0){
			$(this).parents('.voucher-yc-bo').next('.voucher-yc-bo').find(".ycbodyinp").eq(0).focus()
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
	if(event.shiftKey && event.keyCode == 38) {
		if($(this).parents('.voucher-yc-bo').prev('.voucher-yc-bo').length>0){
			$(this).parents('.voucher-yc-bo').prev('.voucher-yc-bo').find(".yctz").eq(0).focus()
		}else{
			$(this).parents('.voucher-center').find('.abstractinp').focus()
		}
		event.preventDefault();
		event.returnValue = false;
		event.keyCode == 0
		return false;
	}
	if(event.shiftKey && event.keyCode == 40) {
		if($(this).parents('.voucher-yc-bo').next('.voucher-yc-bo').length>0){
			$(this).parents('.voucher-yc-bo').next('.voucher-yc-bo').find(".yctz").eq(0).focus()
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
	//摁下esc的时候收起辅助核算项并跳到下一行的摘要
	if(event.keyCode == "27" || (event.keyCode == "13" && isSummaryVou)) {
		event.preventDefault();
		event.keyCode = 0;
		event.preventDefault();
		event.returnValue = false;
		$(this).blur();
		var s = 0;
		for(var i = 0; i < $(this).parents(".voucher-yc").find(".yctz").length; i++) {
			if($(this).parents(".voucher-yc").find(".yctz").eq(i).val() != "") {
				s += parseFloat($(this).parents(".voucher-yc").find(".yctz").eq(i).val());
			}
		}
		if(s > 0) {
			s = s.toFixed(2);
			var n = s
			if(s < 10000000000 && vousinglepz == false && vousinglepzzy == false) {
				n = s.replace(".", "");
			}
		} else if(s == 0) {
			$(this).parents(".voucher-yc").prevAll(".moneyj").find(".money-sr").val("");
			$(this).parents(".voucher-yc").prevAll(".moneyj").find(".money-xs").html("");
		}
		if($(this).parents(".voucher-center").next(".voucher-center").length < 1) {
			$(".voucherall").height($(".voucherall").height() + 50);
			fixedabsulate();
			$(this).parents(".voucher-center").after(tr);
			var bol = $(this).parents('.voucher-yc-bg').find('.voucher-yc-bo').length
			var bodl = $(this).parents('.voucher-yc-bg').find('.deleteclass').length
			if(bol - bodl < 8) {
				$("body").scrollTop($("body").scrollTop() + 50);
			}
		} else if($(this).parents(".voucher-center").next(".voucher-center").next(".voucher-center").length < 1 && $(this).parents(".voucher-center").hasClass('voucher-centercw')) {
			$(".voucherall").height($(".voucherall").height() + 50);
			fixedabsulate();
			$(this).parents(".voucher-center").next(".voucher-center").after(tr);
			var bol = $(this).parents('.voucher-yc-bg').find('.voucher-yc-bo').length
			var bodl = $(this).parents('.voucher-yc-bg').find('.deleteclass').length
			if(bol - bodl < 8) {
				$("body").scrollTop($("body").scrollTop() + 50);
			}

		} else {
			var se = 0;
			var sl = $(this).parents(".voucher-center").nextAll(".voucher-center").length
			for(var i = 0; i < sl; i++) {
				if($(this).parents(".voucher-center").nextAll(".voucher-center").eq(i).attr('op') == 2) {
					se++;
				}
			}
			if(se == sl) {
				$(".voucherall").height($(".voucherall").height() + 50);

				fixedabsulate();
				$(this).parents(".voucher-center").after(tr);
			}
			var bol = $(this).parents('.voucher-yc-bg').find('.voucher-yc-bo').length
			var bodl = $(this).parents('.voucher-yc-bg').find('.deleteclass').length
			if(bol - bodl < 8) {
				$("body").scrollTop($("body").scrollTop() + 50);
			}
		}
		setTimeout(function() {
			$(".voucherall").height($(".voucherall").height() - _this.parents(".voucher-yc").outerHeight())
			voucherycshowheight()
			fixedabsulate();
			_this.parents(".voucher-yc").hide();
			if(vousinglepzzy) {
				_this.parents(".voucher-yc").parents(".voucher-body").next(".voucher-center").next(".voucher-center").find(".abstractinp").focus();
			} else {
				_this.parents(".voucher-yc").parents(".voucher-body").next(".voucher-center").find(".abstractinp").focus();
			}
		}, 50)
		if(vousinglepz == true || vousinglepzzy == true) {
			var nums = $(this).parents(".voucher-center").find('.money-ys').val()
			$(this).parents(".voucher-center").find('.money-ys').parents('.money-jd').find('.money-xs').html(formatNum(nums))
		}
		if(isetcAmt){
			if($(this).parents(".voucher-center").find(".moneyj").find('.money-sr').hasClass("money-ys")) {
				if(vousinglepzzy != true) {
					if($(this).parents(".voucher-center").next(".voucher-center").find(".money-ys").length < 1 && $(this).parents(".voucher-center").next(".voucher-center").find('.fuyan').css('display')=='none') {
						var jm = 0;
						var dm = 0;
						for(var i = 0; i < $(".voucher-center").length; i++) {
							if($(".voucher-center").eq(i).find(".moneyd").find(".money-sr").val() != "") {
								dm += parseFloat($(".voucher-center").eq(i).find(".moneyd").find(".money-sr").val());
							}
							if($(".voucher-center").eq(i).find(".moneyj").find(".money-sr").val() != "") {
								jm += parseFloat($(".voucher-center").eq(i).find(".moneyj").find(".money-sr").val());
							}
						}
						if(jm > dm) {
							var nextjsr = $(this).parents(".voucher-center").next(".voucher-center").find(".moneyj").find(".money-sr").val();
							var nextdsr = $(this).parents(".voucher-center").next(".voucher-center").find(".moneyd").find(".money-sr").val();
							if((jm - dm) >= 10000000000 || vousinglepz == true || vousinglepzzy == true) {
								$(this).parents(".voucher-center").next(".voucher-center").find(".moneyd").find(".money-xs").html(formatNum((jm - dm).toFixed(2)));
							} else {
								$(this).parents(".voucher-center").next(".voucher-center").find(".moneyd").find(".money-xs").html(((jm - dm) * 100).toFixed(0));
							}
							$(this).parents(".voucher-center").next(".voucher-center").find(".moneyd").find(".money-sr").val((jm - dm).toFixed(2));
							$(this).parents(".voucher-center").next(".voucher-center").find(".moneyd").addClass("money-ys")
							$(this).parents(".voucher-center").next(".voucher-center").find(".moneyj").find(".money-xs").html("");
							$(this).parents(".voucher-center").next(".voucher-center").find(".moneyj").find(".money-sr").val("");
							$(this).parents(".voucher-center").next(".voucher-center").find(".moneyj").removeClass("money-ys")
							//break;
						} else if(dm > jm) {
							if((dm - jm) >= 10000000000 || vousinglepz == true || vousinglepzzy == true) {
								$(this).parents(".voucher-center").next(".voucher-center").find(".moneyj").find(".money-xs").html(formatNum((dm - jm).toFixed(2)));
							} else {
								$(this).parents(".voucher-center").next(".voucher-center").find(".moneyj").find(".money-xs").html(((dm - jm) * 100).toFixed(0));
							}
							$(this).parents(".voucher-center").next(".voucher-center").find(".moneyj").find(".money-sr").val((dm - jm).toFixed(2));
							$(this).parents(".voucher-center").next(".voucher-center").find(".moneyj").addClass("money-ys")
							$(this).parents(".voucher-center").next(".voucher-center").find(".moneyd").find(".money-xs").html("");
							$(this).parents(".voucher-center").next(".voucher-center").find(".moneyd").find(".money-sr").val("");
							$(this).parents(".voucher-center").next(".voucher-center").find(".moneyd").removeClass("money-ys")
							//break;
						}
					}
				}
				if(vousinglepzzy) {
					if($(this).parents(".voucher-center").next(".voucher-center").next(".voucher-center").find(".money-ys").length < 1 && $(this).parents(".voucher-center").next(".voucher-center").next(".voucher-center").find('.fuyan').css('display')=='none') {
						var jm = 0;
						var dm = 0;
						if($(this).parents(".voucher-center").hasClass('voucher-centercw')) {
							for(var i = 0; i < $(".voucher-centercw").length; i++) {
								if($(".voucher-centercw").eq(i).find(".moneyd").find(".money-sr").val() != "") {
									dm += parseFloat($(".voucher-centercw").eq(i).find(".moneyd").find(".money-sr").val());
								}
								if($(".voucher-centercw").eq(i).find(".moneyj").find(".money-sr").val() != "") {
									jm += parseFloat($(".voucher-centercw").eq(i).find(".moneyj").find(".money-sr").val());
								}
							}
						} else {
							for(var i = 0; i < $(".voucher-centerys").length; i++) {
								if($(".voucher-centerys").eq(i).find(".moneyd").find(".money-sr").val() != "") {
									dm += parseFloat($(".voucher-centerys").eq(i).find(".moneyd").find(".money-sr").val());
								}
								if($(".voucher-centerys").eq(i).find(".moneyj").find(".money-sr").val() != "") {
									jm += parseFloat($(".voucher-centerys").eq(i).find(".moneyj").find(".money-sr").val());
								}
							}
						}
						if(jm > dm) {
							var nextjsr = $(this).parents(".voucher-center").next(".voucher-center").next(".voucher-center").find(".moneyj").find(".money-sr").val();
							var nextdsr = $(this).parents(".voucher-center").next(".voucher-center").next(".voucher-center").find(".moneyd").find(".money-sr").val();
							if((jm - dm) >= 10000000000 || vousinglepz == true || vousinglepzzy == true) {
								$(this).parents(".voucher-center").next(".voucher-center").next(".voucher-center").find(".moneyd").find(".money-xs").html(formatNum((jm - dm).toFixed(2)));
							} else {
								$(this).parents(".voucher-center").next(".voucher-center").next(".voucher-center").find(".moneyd").find(".money-xs").html(((jm - dm) * 100).toFixed(0));
							}
							$(this).parents(".voucher-center").next(".voucher-center").next(".voucher-center").find(".moneyd").find(".money-sr").val((jm - dm).toFixed(2));
							$(this).parents(".voucher-center").next(".voucher-center").next(".voucher-center").find(".moneyd").addClass("money-ys")
							$(this).parents(".voucher-center").next(".voucher-center").next(".voucher-center").find(".moneyj").find(".money-xs").html("");
							$(this).parents(".voucher-center").next(".voucher-center").next(".voucher-center").find(".moneyj").find(".money-sr").val("");
							$(this).parents(".voucher-center").next(".voucher-center").next(".voucher-center").find(".moneyj").removeClass("money-ys")
							//break;
						} else if(dm > jm) {
							if((dm - jm) >= 10000000000 || vousinglepz == true || vousinglepzzy == true) {
								$(this).parents(".voucher-center").next(".voucher-center").next(".voucher-center").find(".moneyj").find(".money-xs").html(formatNum((dm - jm).toFixed(2)));
							} else {
								$(this).parents(".voucher-center").next(".voucher-center").next(".voucher-center").find(".moneyj").find(".money-xs").html(((dm - jm) * 100).toFixed(0));
							}
							$(this).parents(".voucher-center").next(".voucher-center").next(".voucher-center").find(".moneyj").find(".money-sr").val((dm - jm).toFixed(2));
							$(this).parents(".voucher-center").next(".voucher-center").next(".voucher-center").find(".moneyj").addClass("money-ys")
							$(this).parents(".voucher-center").next(".voucher-center").next(".voucher-center").find(".moneyd").find(".money-xs").html("");
							$(this).parents(".voucher-center").next(".voucher-center").next(".voucher-center").find(".moneyd").find(".money-sr").val("");
							$(this).parents(".voucher-center").next(".voucher-center").next(".voucher-center").find(".moneyd").removeClass("money-ys")
							//break;
						}
					}
				}
			}
			if($(this).parents(".voucher-center").find(".moneyd").find('.money-sr').hasClass("money-ys")) {
				if(vousinglepzzy != true) {
					if($(this).parents(".voucher-center").next(".voucher-center").find(".money-ys").length < 1) {
						var jm = 0;
						var dm = 0;
						if($(this).parents(".voucher-center").hasClass('voucher-centercw')) {
							for(var i = 0; i < $(".voucher-centercw").length; i++) {
								if($(".voucher-centercw").eq(i).find(".moneyd").find(".money-sr").val() != "") {
									dm += parseFloat($(".voucher-centercw").eq(i).find(".moneyd").find(".money-sr").val());
								}
								if($(".voucher-centercw").eq(i).find(".moneyj").find(".money-sr").val() != "") {
									jm += parseFloat($(".voucher-centercw").eq(i).find(".moneyj").find(".money-sr").val());
								}
							}
						} else {
							for(var i = 0; i < $(".voucher-centerys").length; i++) {
								if($(".voucher-centerys").eq(i).find(".moneyd").find(".money-sr").val() != "") {
									dm += parseFloat($(".voucher-centerys").eq(i).find(".moneyd").find(".money-sr").val());
								}
								if($(".voucher-centerys").eq(i).find(".moneyj").find(".money-sr").val() != "") {
									jm += parseFloat($(".voucher-centerys").eq(i).find(".moneyj").find(".money-sr").val());
								}
							}
						}
						if(jm > dm) {
							var nextjsr = $(this).parents(".voucher-center").next(".voucher-center").find(".moneyj").find(".money-sr").val();
							var nextdsr = $(this).parents(".voucher-center").next(".voucher-center").find(".moneyd").find(".money-sr").val();
							if((jm - dm) >= 10000000000 || vousinglepz == true || vousinglepzzy == true) {
								$(this).parents(".voucher-center").next(".voucher-center").find(".moneyd").find(".money-xs").html(formatNum((jm - dm).toFixed(2)));
							} else {
								$(this).parents(".voucher-center").next(".voucher-center").find(".moneyd").find(".money-xs").html(((jm - dm) * 100).toFixed(0));
							}
							$(this).parents(".voucher-center").next(".voucher-center").find(".moneyd").find(".money-sr").val((jm - dm).toFixed(2));
							$(this).parents(".voucher-center").next(".voucher-center").find(".moneyd").addClass("money-ys")
							$(this).parents(".voucher-center").next(".voucher-center").find(".moneyj").find(".money-xs").html("");
							$(this).parents(".voucher-center").next(".voucher-center").find(".moneyj").find(".money-sr").val("");
							$(this).parents(".voucher-center").next(".voucher-center").find(".moneyj").removeClass("money-ys")
							//break;
						} else if(dm > jm) {
							if((dm - jm) >= 10000000000 || vousinglepz == true || vousinglepzzy == true) {
								$(this).parents(".voucher-center").next(".voucher-center").find(".moneyj").find(".money-xs").html(formatNum((dm - jm).toFixed(2)));
							} else {
								$(this).parents(".voucher-center").next(".voucher-center").find(".moneyj").find(".money-xs").html(((dm - jm) * 100).toFixed(0));
							}
							$(this).parents(".voucher-center").next(".voucher-center").find(".moneyj").find(".money-sr").val((dm - jm).toFixed(2));
							$(this).parents(".voucher-center").next(".voucher-center").find(".moneyj").addClass("money-ys")
							$(this).parents(".voucher-center").next(".voucher-center").find(".moneyd").find(".money-xs").html("");
							$(this).parents(".voucher-center").next(".voucher-center").find(".moneyd").find(".money-sr").val("");
							$(this).parents(".voucher-center").next(".voucher-center").find(".moneyd").removeClass("money-ys")
							//break;
						}
					}
				}
				if(vousinglepzzy) {
					if($(this).parents(".voucher-center").next(".voucher-center").next(".voucher-center").find(".money-ys").length < 1) {
						var jm = 0;
						var dm = 0;
						for(var i = 0; i < $(".voucher-center").length; i++) {
							if($(".voucher-center").eq(i).find(".moneyd").find(".money-sr").val() != "") {
								dm += parseFloat($(".voucher-center").eq(i).find(".moneyd").find(".money-sr").val());
							}
							if($(".voucher-center").eq(i).find(".moneyj").find(".money-sr").val() != "") {
								jm += parseFloat($(".voucher-center").eq(i).find(".moneyj").find(".money-sr").val());
							}
						}
						if(jm > dm) {
							var nextjsr = $(this).parents(".voucher-center").next(".voucher-center").next(".voucher-center").find(".moneyj").find(".money-sr").val();
							var nextdsr = $(this).parents(".voucher-center").next(".voucher-center").next(".voucher-center").find(".moneyd").find(".money-sr").val();
							if((jm - dm) >= 10000000000 || vousinglepz == true || vousinglepzzy == true) {
								$(this).parents(".voucher-center").next(".voucher-center").next(".voucher-center").find(".moneyd").find(".money-xs").html(formatNum((jm - dm).toFixed(2)));
							} else {
								$(this).parents(".voucher-center").next(".voucher-center").next(".voucher-center").find(".moneyd").find(".money-xs").html(((jm - dm) * 100).toFixed(0));
							}
							$(this).parents(".voucher-center").next(".voucher-center").next(".voucher-center").find(".moneyd").find(".money-sr").val((jm - dm).toFixed(2));
							$(this).parents(".voucher-center").next(".voucher-center").next(".voucher-center").find(".moneyd").addClass("money-ys")
							$(this).parents(".voucher-center").next(".voucher-center").next(".voucher-center").find(".moneyj").find(".money-xs").html("");
							$(this).parents(".voucher-center").next(".voucher-center").next(".voucher-center").find(".moneyj").find(".money-sr").val("");
							$(this).parents(".voucher-center").next(".voucher-center").next(".voucher-center").find(".moneyj").removeClass("money-ys")
							//break;
						} else if(dm > jm) {
							if((dm - jm) >= 10000000000 || vousinglepz == true || vousinglepzzy == true) {
								$(this).parents(".voucher-center").next(".voucher-center").next(".voucher-center").find(".moneyj").find(".money-xs").html(formatNum((dm - jm).toFixed(2)));
							} else {
								$(this).parents(".voucher-center").next(".voucher-center").next(".voucher-center").find(".moneyj").find(".money-xs").html(((dm - jm) * 100).toFixed(0));
							}
							$(this).parents(".voucher-center").next(".voucher-center").next(".voucher-center").find(".moneyj").find(".money-sr").val((dm - jm).toFixed(2));
							$(this).parents(".voucher-center").next(".voucher-center").next(".voucher-center").find(".moneyj").addClass("money-ys")
							$(this).parents(".voucher-center").next(".voucher-center").next(".voucher-center").find(".moneyd").find(".money-xs").html("");
							$(this).parents(".voucher-center").next(".voucher-center").next(".voucher-center").find(".moneyd").find(".money-sr").val("");
							$(this).parents(".voucher-center").next(".voucher-center").next(".voucher-center").find(".moneyd").removeClass("money-ys")
							//break;
						}
					}
				}
			}
		}
		if(vousinglepzzy && isdobabstractinp) {
			if($('.voucher-singelzybg').find(".voucherycshow").css('display') == 'none' || $('.voucher-singelzyx').find(".voucherycshow").css('display') == 'none') {
				var lenss = $('.voucher-footer').eq(0).offset().top - $(window).scrollTop() + 50
				$('.voucher-singelzybg,.voucher-singelzyx').find(".voucherycshow").css("top", lenss + 'px').show()
				$(".voucherall").height($(".voucherall").height() + 120);
				fixedabsulate()
			}
		}
		bidui()
		return false
	}
	//当摁下enter换行
	if(keyCode == "13") {
		var editStatus4 = $(this).parents('.voucher-yc-bo').attr('ifEdit')=='false'
		if(!isInputChange() || editStatus4 || isSummaryVou){
			return false;
		} else {
			event.preventDefault();
			event.returnValue = false;
			event.keyCode == 0
			scrollhide = 1
			var ss = $(this).parents(".voucher-center").find(".accountinginp").attr("accoindex");
			if($(this).parent(".voucher-yc-bo").nextAll(".voucher-yc-bo").length - $(this).parent(".voucher-yc-bo").nextAll(".deleteclass").length < 1) {
				var voucherycss = new Object();
				for(var d in tablehead) {
					var c = d.substring(0, d.length - 4)
					if(quanjuvoudatas.data[ss][c] == 1) {
						voucherycss[d] = tablehead[d];
					}
				}
				var nowAccoCode = $(this).parents(".voucher-center").find(".accountinginp").attr("code");
				var accItemArr = voucherycss;
				voucherycss = resOrderAccItem(nowAccoCode, accItemArr,$(this).parents(".voucher-center"));
				var inde = $(this).parents('.voucher-yc-bg').find('.voucher-yc-bo').length
				var voucherycbo = '';
				voucherycbo += '<div class="voucher-yc-bo" op="0" inde=' + inde + ' >'
				if(isAssRemark){
					voucherycbo += '<div  class="ycbody">'
					voucherycbo += '<textarea class="ycbodyinp remark"></textarea>'
					voucherycbo += '</div>'
				}
				for(var l in voucherycss) {
					if(isuniversities == true && l == 'projectCode'){
						voucherycbo += '<div  class="ycbody">'
						voucherycbo += '<textarea relation = "' + l + '" class="ycbodyinp projectCode" readonly = "true"  ></textarea>'
						voucherycbo += '<span class="vouopendel project icon-close"></span>'
						voucherycbo += '<div class="vouopenbtn project">...</div>'
						voucherycbo += '</div>'
					}else if(isuniversities == true && l == 'quotaCode'){
						voucherycbo += '<div  class="ycbody">'
						voucherycbo += '<textarea relation = "' + l + '" class="ycbodyinp quotaCode" readonly = "true"  ></textarea>'
						voucherycbo += '<span class="vouopendel quota icon-close"></span>'
						voucherycbo += '<div class="vouopenbtn quota">...</div>'
						voucherycbo += '</div>'
					}else{
						voucherycbo += '<div  class="ycbody">'
						voucherycbo += '<textarea relation = "' + l + '" class="ycbodyinp"></textarea>'
						voucherycbo += '</div>'
					}
					if((voucherycss[l]["ELE_CODE"] == "CURRENT" && isbussDate) || (voucherycss[l]["ELE_CODE"] == "EMPLOYEE" && isbussDate)) {
						voucherycbo += '<div  class="ycbody">'
						voucherycbo += '<input type="text" value="' + $("#dates").getObj().getValue() + '" class="ycbodyinp bussDate"  />'
						voucherycbo += '</div>'
					}
				}
				if(quanjuvoudatas.data[ss].field1 ==  '1'){
					voucherycbo += '<div  class="ycbody">'
					voucherycbo += '<textarea class="ycbodyinp field1" readonly = "true" ></textarea>'
					voucherycbo += '<span class="vouopendel icon-close"></span>'
					voucherycbo += '<div class="vouopenbtn">...</div>'
					voucherycbo += '</div>'
				}
				if(quanjuvoudatas.data[ss].expireDate == 1) {
					voucherycbo += '<div  class="ycbody">'
					voucherycbo += '<input type="text" value="'+$("#dates").getObj().getValue()+'" class="ycbodyinp daoqiri"  />'
					voucherycbo += '</div>'
				}
				if(quanjuvoudatas.data[ss].showBill == 1 && !isalonebill) {
					voucherycbo += '<div  class="ycbody">'
					voucherycbo += '<textarea class="ycbodyinp billNoinp"  ></textarea>'
					voucherycbo += '</div>'
					voucherycbo += '<div  class="ycbody">'
					voucherycbo += '<textarea relation="billTypeinp" class="ycbodyinp billTypeinp"></textarea>'
					voucherycbo += '</div>'
					voucherycbo += '<div  class="ycbody">'
					voucherycbo += '<input type="text" value="'+$("#dates").getObj().getValue()+'" class="ycbodyinp billDateinp"  />'
					voucherycbo += '</div>'
				}
				if(quanjuvoudatas.data[ss].currency == 1) {
					voucherycbo += '<div  class="ycbody">'
					voucherycbo += '<textarea relation = "currency" type="text" class="ycbodyinp curcodeinp"  ></textarea>'
					voucherycbo += '</div>'
					voucherycbo += '<div  class="ycbody">'
					voucherycbo += '<textarea class="ycbodyinp exrateinp"  ></textarea>'
					voucherycbo += '</div>'
					voucherycbo += '<div  class="ycbody">'
					voucherycbo += '<textarea class="ycbodyinp curramtinp"  ></textarea>'
					voucherycbo += '</div>'
				}
				if(quanjuvoudatas.data[ss].qty == 1) {
					voucherycbo += '<div  class="ycbody">'
					voucherycbo += '<textarea class="ycbodyinp priceinp"  ></textarea>'
					voucherycbo += '</div>'
					voucherycbo += '<div  class="ycbody">'
					voucherycbo += '<textarea class="ycbodyinp qtyinp"   qty="' + quanjuvoudatas.data[ss].qtyDigits + '" ></textarea>'
					voucherycbo += '</div>'
				}
				if(quanjuvoudatas.data[ss].field2 == 1) {
					voucherycbo += '<div  class="ycbody">'
					voucherycbo += '<textarea relation = "field2" class="ycbodyinp field2inp"></textarea>'
					voucherycbo += '<span class="fielddetail">详情</span>'
					voucherycbo += '</div>'
				}
				voucherycbo += '<input type="text" class="ycbody yctz" />'
				voucherycbo += '<span class="Assaccbala">余额</span>'
				voucherycbo += '</div>'
				_this.parents('.voucher-yc-bg').append(voucherycbo);
				_this.parents('.voucher-yc-bg').prev('.voucher-yc-addbtns').find('.ycaddopen').before('<div class="ycadddiv" inde=' + inde + '><img src="img/insert.png" class="ycadd"></div>')
				_this.parents('.voucher-yc-bg').next('.voucher-yc-deletebtns').append('<div class="ycdeldiv" inde=' + inde + '><span class="ycdelect icon-trash"></span></div>')
				$('.daoqiri,.billDateinp,.bussDate').datetimepicker(glRptJournalDate)
				for(var i = 0; i < _this.parents(".voucher-center").find(".voucher-yc").length; i++) {
					if(_this.parents(".voucher-center").find(".voucher-yc").eq(i).hasClass("deleteclass")) {} else {
						voucherYcAssCss(_this.parents(".voucher-center").find(".voucher-yc").eq(i))
					}
					if(quanjuvoudatas.data[ss].defcurCode != '' && quanjuvoudatas.data[ss].currency == 1) {
						for(var j = 0; j < _this.parents(".voucher-center").find(".voucher-yc").eq(i).find('.curcodeinp').length; j++) {
							if(_this.parents(".voucher-center").find(".voucher-yc").eq(i).find('.curcodeinp').eq(j).val() == '') {
								for(var z = 0; z < $('#AssDataAll').find(".currency").find('li').length; z++) {
									var nowthis = $('#AssDataAll').find(".currency").find('li').eq(z)
									if(nowthis.find('.code').html() == quanjuvoudatas.data[ss].defcurCode) {
										var codecur = nowthis.find('.code').html()
										var curtext = nowthis.text()
										_this.parents(".voucher-center").find(".voucher-yc").eq(i).find('.curcodeinp').eq(j).val(curtext).attr('code',codecur)
									}
								}
							}
						}
					}
				}
				if($(this).parents(".voucher-yc").find(".voucher-yc-bo").length <= 9) {
					$(".voucherall").height($(".voucherall").height() + 52);
					voucherycshowheight()
					fixedabsulate();
				}
				if($(this).parents(".voucher-yc").find(".voucher-yc-bo").length - $(this).parents(".voucher-yc").find(".deleteclass").length > 8) {
					if(!$(this).parents(".voucher-yc").find('.voucher-yc-scroll').hasClass('ishei')){
						$(this).parents(".voucher-yc").find('.voucher-yc-scroll').css("height",$(this).parents(".voucher-yc").outerHeight()-52+"px").addClass('ishei');
					}
					$(this).parents(".voucher-yc").find('.voucher-yc-scroll').addClass("bgheight")
					voucherYcAssCssbgheight($(this).parents(".voucher-yc"))
				}
			}
			//填写金额
			if(vouiscopyprevAss) {
				var paryc = $(this).parents(".voucher-yc")
				var bodyss = new Object();
				var $ycBt = paryc
				var headLen = $ycBt.find(".ychead").length - 1;
				for(var k = 0; k < headLen; k++) {
					var dd = $ycBt.find(".ychead").eq(k).attr("name");
					if(dd == 'diffTermCode') {
						var itemCodeName = $(this).parent(".voucher-yc-bo").find(".ycbody").eq(k).find(".ycbodyinp").val();
						var itemCode = itemCodeName.substring(0, itemCodeName.indexOf(" "));
						bodyss['accoSurplus'] = itemCode;
					} else if(dd == 'diffTermDir') {
						var itemCodeName = $(this).parent(".voucher-yc-bo").find(".ycbody").eq(k).find(".ycbodyinp").val();
						if(itemCodeName == '正向') {
							bodyss['dfDc'] = 1;
						} else {
							bodyss['dfDc'] = -1;
						}
					} else if(dd == 'expireDate' || dd == 'qty' || dd == 'price' || dd == 'exRate' || dd == 'currAmt') {
						var itemCodeName = $(this).parent(".voucher-yc-bo").find(".ycbody").eq(k).find(".ycbodyinp").val().split(",").join("");
						bodyss[dd] = itemCodeName;
					} else if(dd == 'currAmt') {
						var itemCodeName = $(this).parent(".voucher-yc-bo").find(".ycbody").eq(k).find(".ycbodyinp").val().split(",").join("");
						bodyss[dd] = itemCodeName;
					} else if(dd == 'billNo' || dd == 'billDate' || dd == 'bussDate' || dd == 'remark'|| dd == 'field1') {
						var itemCodeName = $ycBt.find(".voucher-yc-bo").find(".ycbody").eq(k).find(".ycbodyinp").val();
						bodyss[dd] = itemCodeName;
						if( dd == 'field1' && itemCodeName!=''){
							bodyss.cancelAssGuid =  $ycBt.find(".voucher-yc-bo").eq(j).find(".ycbody").eq(k).find(".ycbodyinp").attr('cGuid')
						}
					} else {
						var itemCodeName = $(this).parent(".voucher-yc-bo").find(".ycbody").eq(k).find(".ycbodyinp").val();
						var itemCode = itemCodeName.substring(0, itemCodeName.indexOf(" "));
						bodyss[dd] = itemCode;
					}
				}
				var nextbpo = $(this).parent(".voucher-yc-bo").next(".voucher-yc-bo")
				for(var r = 0; r < nextbpo.find(".ycbodyinp").length; r++) {
					var relation  =nextbpo.find(".ycbody").eq(r).find(".ycbodyinp").attr('relation')
					var $li = $('#AssDataAll').find("."+relation).find("li");
					var $lis = fzhsxl[relation]
					if(paryc.find(".voucher-yc-bt").find(".ychead").eq(r).attr("name") == "expireDate") {
						nextbpo.find(".ycbodyinp").eq(r).val(bodyss.expireDate);
					} else if(paryc.find(".voucher-yc-bt").find(".ychead").eq(r).attr("name") == "billNo") {
						nextbpo.find(".ycbodyinp").eq(r).val(bodyss.billNo);
					} else if(paryc.find(".voucher-yc-bt").find(".ychead").eq(r).attr("name") == "price") {
						nextbpo.find(".ycbodyinp").eq(r).val(bodyss.price);
					} else if(paryc.find(".voucher-yc-bt").find(".ychead").eq(r).attr("name") == "qty") {
						nextbpo.find(".ycbodyinp").eq(r).val(bodyss.qty);
					} else if(paryc.find(".voucher-yc-bt").find(".ychead").eq(r).attr("name") == "exRate") {
						nextbpo.find(".ycbodyinp").eq(r).val(bodyss.exRate);
					} else if(paryc.find(".voucher-yc-bt").find(".ychead").eq(r).attr("name") == "currAmt") {
						nextbpo.find(".ycbodyinp").eq(r).val(formatNum(bodyss.currAmt));
					} else if(paryc.find(".voucher-yc-bt").find(".ychead").eq(r).attr("name") == "billDate") {
						nextbpo.find(".ycbodyinp").eq(r).val(bodyss.billDate);
					} else if(paryc.find(".voucher-yc-bt").find(".ychead").eq(r).attr("name") == "remark") {
						nextbpo.find(".ycbodyinp").eq(r).val(bodyss.remark);
					} else if(paryc.find(".voucher-yc-bt").find(".ychead").eq(r).attr("name") == "bussDate") {
						nextbpo.find(".ycbodyinp").eq(r).val(bodyss.bussDate);
					} else if(paryc.find(".voucher-yc-bt").find(".ychead").eq(r).attr("name") == "field1") {
						nextbpo.find(".ycbodyinp").eq(r).val(bodyss.field1).attr('cGuid',bodyss.cancelAssGuid);
					}else if(paryc.find(".voucher-yc-bt").find(".ychead").eq(r).attr("name") == "field2") {
						if(!$.isNull(bodyss.field2)){
							var ss = bodyss.field2.indexOf('|')
							var code = bodyss.field2.slice( 0,ss);
							var itemid= bodyss.field2.slice(ss)
							for(var s = 0; s < $li.length; s++) {
								if($li.eq(s).find(".code").text() == code) {
									$li.eq(s).removeClass("unselected").addClass("selected");
									var fzxlnrcode = $li.eq(s).find(".code").text();
									var fzxlnrname = $li.eq(s).find(".name").text();
									vifvcyb.eq(k).find(".ycbodyinp").eq(r).val(fzxlnrcode +' '+ fzxlnrname).attr('itemid',itemid).attr('code',fzxlnrcode);
								}
							}
						}
					} else if(paryc.find(".voucher-yc-bt").find(".ychead").eq(r).attr("name") == "diffTermCode") {
						for(var s = 0; s < $li.length; s++) {
							if($li.eq(s).find(".code").text() == bodyss.accoSurplus) {
								$li.eq(s).removeClass("unselected").addClass("selected");
								var fzxlnrcode = $li.eq(s).find(".code").text();
								var fzxlnrname = $li.eq(s).find(".name").text();
								nextbpo.find(".ycbodyinp").eq(r).val(fzxlnrcode + " " + fzxlnrname).attr('code',fzxlnrcode)
							}
						}
					} else if(paryc.find(".voucher-yc-bt").find(".ychead").eq(r).attr("name") == "curCode") {
						for(var s = 0; s < $li.length; s++) {
							if($li.eq(s).find(".code").text() == bodyss.curCode) {
								$li.eq(s).removeClass("unselected").addClass("selected");
								var fzxlnrcode = $li.eq(s).find(".code").text();
								var fzxlnrname = $li.eq(s).find(".name").text();
								var exrate = $li.eq(s).attr('exrate')
								var rateDigits = $li.eq(s).attr('rateDigits')
								nextbpo.find(".ycbodyinp").eq(r).val(fzxlnrcode + " " + fzxlnrname).attr('code',fzxlnrcode)
								nextbpo.find(".exrateinp").attr('exrate', exrate).attr('rateDigits', rateDigits)
							}
						}
					} else if(paryc.find(".voucher-yc-bt").find(".ychead").eq(r).attr("name") == "billType") {
						for(var s = 0; s < $li.length; s++) {
							if($li.eq(s).find(".code").text() == bodyss.billType) {
								$li.eq(s).removeClass("unselected").addClass("selected");
								var fzxlnrcode = $li.eq(s).find(".code").text();
								var fzxlnrname = $li.eq(s).find(".name").text();
								nextbpo.find(".ycbodyinp").eq(r).val(fzxlnrcode + " " + fzxlnrname).attr('code',fzxlnrcode)
							}
						}
					} else if(paryc.find(".voucher-yc-bt").find(".ychead").eq(r).attr("name") == "diffTermDir") {
						if(bodyss.dfDc == 1) {
							nextbpo.find(".ycbodyinp").eq(r).val('正向');
							$li.eq(0).removeClass("unselected").addClass("selected");
						} else {
							nextbpo.find(".ycbodyinp").eq(r).val('反向');
							$li.eq(1).removeClass("unselected").addClass("selected");
						}
					} else {
						var btcoded = paryc.find(".voucher-yc-bt").find(".ychead").eq(r).attr("name")
						for(var s = 0; s < $lis.length; s++) {
							if($lis[s].code == bodyss[btcoded]) {
								if(isaccfullname){
									nextbpo.find(".ycbodyinp").eq(r).val($lis[s].code + ' ' +$lis[s].chrFullname).attr('code',$lis[s].code)
								}else{
									nextbpo.find(".ycbodyinp").eq(r).val($lis[s].code + ' ' +$lis[s].name).attr('code',$lis[s].code);
								}
							}
						}
					}
				}
			}
			for(var i = 0; i < $(this).parent(".voucher-yc-bo").nextAll(".voucher-yc-bo").length; i++) {
				if(vouiscopyprevAss) {
					$(this).parent(".voucher-yc-bo").nextAll(".voucher-yc-bo").eq(i).find('.yctz').focus().select();
					break;
				} else {
					$(this).parent(".voucher-yc-bo").nextAll(".voucher-yc-bo").eq(i).find(".ycbodyinp").eq(0).focus();
					break;
				}
			}
			var l = 0;
			for(var i = 0; i < _this.parents(".voucher-yc").find(".yctz").length; i++) {
				if(_this.parents(".voucher-yc").find(".yctz").eq(i).val() != "") {
					l += parseFloat(_this.parents(".voucher-yc").find(".yctz").eq(i).val().split(",").join(""));
				}
			}
			var isAction = "false";
			var temp = _this.parents(".voucher-yc-bg").attr("isaction");
			if(!$.isNull(temp)) {
				isAction = temp;
			}
			var accBal = _this.parents(".voucher-yc").prevAll(".accounting").find(".accountinginp").attr("accbal"); //科目借贷方向
			var len = _this.parents(".voucher-center").prevAll(".voucher-center:not(.deleteclass)").length;

			if($(this).parents(".voucher-center").find('.money-ys').length == 0) {
				if(len == 0 && isAction == "false") {
					l = l.toFixed(2);
					_this.parents(".voucher-yc").prevAll(".moneyj").find(".money-sr").val(l).addClass("money-ys");
					var k = l;
					if(l < 10000000000 && vousinglepz == false && vousinglepzzy == false) {
						k = l.replace(".", "");
					}
					_this.parents(".voucher-yc").prevAll(".moneyj").find(".money-xs").html(k);
					_this.parents(".voucher-yc").prevAll(".moneyd").find(".money-sr").val("");
					_this.parents(".voucher-yc").prevAll(".moneyd").find(".money-xs").html("");
				} else if(len > 0 && isAction == "false") {
					if(accBal == "1") {
						l = l.toFixed(2);
						_this.parents(".voucher-yc").prevAll(".moneyj").find(".money-sr").val(l).addClass("money-ys");
						var k = l;
						if(l < 10000000000 && vousinglepz == false && vousinglepzzy == false) {
							k = l.replace(".", "");
						}
						_this.parents(".voucher-yc").prevAll(".moneyj").find(".money-xs").html(k);
						_this.parents(".voucher-yc").prevAll(".moneyd").find(".money-sr").val("");
						_this.parents(".voucher-yc").prevAll(".moneyd").find(".money-xs").html("");
					} else if(accBal == "-1") {
						l = l.toFixed(2);
						_this.parents(".voucher-yc").prevAll(".moneyd").find(".money-sr").val(l);
						_this.parents(".voucher-yc").prevAll(".moneyd").find(".money-sr").addClass("money-ys");
						var k = l;
						if(l < 10000000000 && vousinglepz == false && vousinglepzzy == false) {
							k = l.replace(".", "");
						}
						_this.parents(".voucher-yc").prevAll(".moneyd").find(".money-xs").html(k);
						_this.parents(".voucher-yc").prevAll(".moneyj").find(".money-sr").val("").removeClass("money-ys");
						_this.parents(".voucher-yc").prevAll(".moneyj").find(".money-xs").html("");
					}
				} else {
					if(moneyzy == 0) {
						l = l.toFixed(2);
						_this.parents(".voucher-yc").prevAll(".moneyj").find(".money-sr").val(l).addClass("money-ys");
						var k = l;
						if(l < 10000000000 && vousinglepz == false && vousinglepzzy == false) {
							k = l.replace(".", "");
						}
						_this.parents(".voucher-yc").prevAll(".moneyj").find(".money-xs").html(k);
						_this.parents(".voucher-yc").prevAll(".moneyd").find(".money-sr").val("").removeClass("money-ys");
						_this.parents(".voucher-yc").prevAll(".moneyd").find(".money-xs").html("");
					} else {
						l = l.toFixed(2);
						_this.parents(".voucher-yc").prevAll(".moneyd").find(".money-sr").val(l).addClass("money-ys");
						var k = l;
						if(l < 10000000000 && vousinglepz == false && vousinglepzzy == false) {
							k = l.replace(".", "");
						}
						_this.parents(".voucher-yc").prevAll(".moneyd").find(".money-xs").html(k);
						_this.parents(".voucher-yc").prevAll(".moneyj").find(".money-sr").val("").removeClass("money-ys");
						_this.parents(".voucher-yc").prevAll(".moneyj").find(".money-xs").html("");
					}
				}
			} else {
				l = l.toFixed(2);
				$(this).parents(".voucher-center").find(".money-ys").val(l)
				var k = l;
				if(l < 10000000000 && vousinglepz == false && vousinglepzzy == false) {
					k = l.replace(".", "");
				}
				$(this).parents(".voucher-center").find(".money-ys").next('.money-xs').html(k);
			}
			if(vousinglepz == true || vousinglepzzy == true) {
				var nums = _this.parents(".voucher-center").find('.money-ys').val()
				_this.parents(".voucher-center").find('.money-ys').parents('.money-jd').find('.money-xs').html(formatNum(nums))
			}
			setTimeout(function() {
				scrollhide = 0
			}, 300)
			event.preventDefault();
			event.returnValue = false;
			event.keyCode == 0
			return false;
		}
	}
	//摁下空格键的时候改变本条分录的借贷方向
	if(keyCode == "32") {
		var editStatus4 = $(this).parents('.voucher-center').attr('ifEdit')=='false'
		if(!isInputChange()  || editStatus4){
			return false;
		}
		$(this).parents(".voucher-yc-bg").attr("isaction", true);
		if(moneyzy == 0) {
			moneyzy = 1;
		} else {
			moneyzy = 0;
		}
		if($(this).parents('.voucher-center').find('.money-ys').parents('.moneyj').length>0 || $(this).parents('.voucher-center').find('.money-ys').hasClass('moneyj')){
			moneyzy = 1;
		}else{
			moneyzy = 0;
		}
		
		var l = 0;
		for(var i = 0; i < $(this).parents(".voucher-yc").find(".yctz").length; i++) {
			if($(this).parents(".voucher-yc").find(".yctz").eq(i).val() != "") {
				l += parseFloat($(this).parents(".voucher-yc").find(".yctz").eq(i).val().split(",").join(""));
			}
		}
		if(moneyzy == 0) {
			l = l.toFixed(2);
			$(this).parents(".voucher-yc").prevAll(".moneyj").find(".money-sr").val(l).addClass("money-ys");
			var k = l;
			if(l < 10000000000 && vousinglepz == false && vousinglepzzy == false) {
				k = l.replace(".", "");
			}
			$(this).parents(".voucher-yc").prevAll(".moneyj").find(".money-xs").html(k);
			$(this).parents(".voucher-yc").prevAll(".moneyd").find(".money-sr").val("").removeClass("money-ys");
			$(this).parents(".voucher-yc").prevAll(".moneyd").find(".money-xs").html("");
			$(this).parents('.voucher-center').find('.voucher-yc-j').prop("checked", true)
			$(this).parents('.voucher-center').find('.voucher-yc-d').prop("checked", false)
			$(this).parents('.voucher-center').find('.titlemoney').html("金额:" + k)
		} else {
			l = l.toFixed(2);
			$(this).parents(".voucher-yc").prevAll(".moneyd").find(".money-sr").val(l).addClass("money-ys");
			var k = l;
			if(l < 10000000000 && vousinglepz == false && vousinglepzzy == false) {
				k = l.replace(".", "");
			}
			$(this).parents(".voucher-yc").prevAll(".moneyd").find(".money-xs").html(k);
			$(this).parents(".voucher-yc").prevAll(".moneyj").find(".money-sr").val("").removeClass("money-ys");
			$(this).parents(".voucher-yc").prevAll(".moneyj").find(".money-xs").html("");
			$(this).parents('.voucher-center').find('.voucher-yc-d').prop("checked", true)
			$(this).parents('.voucher-center').find('.voucher-yc-j').prop("checked", false)
			$(this).parents('.voucher-center').find('.titlemoney').html("金额:" + k)
		}
		$(this).parents('.voucher-center').find(".field1").val('')
		$(this).parents(".voucher-center").attr("op", 1)
		if(vousinglepz == true || vousinglepzzy == true) {
			var nums = $(this).parents(".voucher-center").find('.money-ys').val()
			$(this).parents(".voucher-center").find('.money-ys').parents('.money-jd').find('.money-xs').html(formatNum(nums))
		}
		return false;
	}

})
//失去焦点的时候向金额传值,并根据其刚才改变的借贷方向加减
$(document).on("blur", ".yctz", function() {
	var editStatus0 = ($("#pzzhuantai").attr("vou-status") == undefined);
	if(!editStatus0) {
		var editStatus1 = ($("#pzzhuantai").attr("vou-status") == "O");
		var editStatus2 = (isInputor == true && (selectdata.data.inputor == ufgovkey.svUserCode || selectdata.data.inputor == undefined));
		var editStatus3 = ((isvousource && isvousourceclick == false) || isvousourceclick)
		var editStatus4 = $(this).parents('.voucher-yc-bo').attr('ifEdit')=='false'
		if(editStatus1 && (editStatus2 || isInputor == false) && editStatus3 && !editStatus4 && vouiseditsave) {} else {
			return false;
		}
	}
	// $(this).parents(".voucher-yc-bo").removeAttr('namessss')
	if($(this).val() != "" || $(this).val() == "0.00") {
		var s = parseFloat($(this).val().split(",").join(""));
		s = s.toFixed(2);
		if(s == "0.00") {
			s = "";
		}
	} else {
		var s = "";
	}
	$(this).val(s);
	var l = 0;
	for(var i = 0; i < $(this).parents(".voucher-yc").find(".yctz").length; i++) {
		if($(this).parents(".voucher-yc").find(".yctz").eq(i).val() != "") {
			l += parseFloat($(this).parents(".voucher-yc").find(".yctz").eq(i).val().split(",").join(""));
		}
	}

	var isAction = "false";
	var temp = $(this).parents(".voucher-yc-bg").attr("isaction");
	if(!$.isNull(temp)) {
		isAction = temp;
	}
	var accBal = $(this).parents(".voucher-yc").prevAll(".accounting").find(".accountinginp").attr("accbal"); //科目借贷方向
	var len = $(this).parents(".voucher-center").prevAll(".voucher-center:not(.deleteclass)").length;
	if($(this).parents(".voucher-center").find('.money-ys').length == 0) {
		if(len == 0 && isAction == "false") {
			l = l.toFixed(2);
			$(this).parents(".voucher-yc").prevAll(".moneyj").find(".money-sr").val(l).addClass("money-ys");
			var k = l
			if(l < 10000000000 && vousinglepz == false && vousinglepzzy == false) {
				k = l.replace(".", "");
			}
			$(this).parents(".voucher-yc").prevAll(".moneyj").find(".money-xs").html(k);
			$(this).parents(".voucher-yc").prevAll(".moneyd").find(".money-sr").val("");
			$(this).parents(".voucher-yc").prevAll(".moneyd").find(".money-xs").html("");
			//		}
		} else if(len > 0 && isAction == "false") {
			if(accBal == "1") {
				l = l.toFixed(2);
				$(this).parents(".voucher-yc").prevAll(".moneyj").find(".money-sr").val(l).addClass("money-ys");
				var k = l
				if(l < 10000000000 && vousinglepz == false && vousinglepzzy == false) {
					k = l.replace(".", "");
				}
				$(this).parents(".voucher-yc").prevAll(".moneyj").find(".money-xs").html(k);
				$(this).parents(".voucher-yc").prevAll(".moneyd").find(".money-sr").val("");
				$(this).parents(".voucher-yc").prevAll(".moneyd").find(".money-xs").html("");
			} else if(accBal == "-1") {
				l = l.toFixed(2);
				$(this).parents(".voucher-yc").prevAll(".moneyd").find(".money-sr").val(l);
				$(this).parents(".voucher-yc").prevAll(".moneyd").find(".money-sr").addClass("money-ys");
				var k = l
				if(l < 10000000000 && vousinglepz == false && vousinglepzzy == false) {
					k = l.replace(".", "");
				}
				$(this).parents(".voucher-yc").prevAll(".moneyd").find(".money-xs").html(k);
				$(this).parents(".voucher-yc").prevAll(".moneyj").find(".money-sr").val("").removeClass("money-ys");
				$(this).parents(".voucher-yc").prevAll(".moneyj").find(".money-xs").html("");
			}
		} else {
			if(moneyzy == 0) {
				l = l.toFixed(2);
				$(this).parents(".voucher-yc").prevAll(".moneyj").find(".money-sr").val(l).addClass("money-ys");
				var k = l
				if(l < 10000000000 && vousinglepz == false && vousinglepzzy == false) {
					k = l.replace(".", "");
				}
				$(this).parents(".voucher-yc").prevAll(".moneyj").find(".money-xs").html(k);
				$(this).parents(".voucher-yc").prevAll(".moneyd").find(".money-sr").val("").removeClass("money-ys");
				$(this).parents(".voucher-yc").prevAll(".moneyd").find(".money-xs").html("");
			} else {
				l = l.toFixed(2);
				$(this).parents(".voucher-yc").prevAll(".moneyd").find(".money-sr").val(l).addClass("money-ys");
				var k = l
				if(l < 10000000000 && vousinglepz == false && vousinglepzzy == false) {
					k = l.replace(".", "");
				}
				$(this).parents(".voucher-yc").prevAll(".moneyd").find(".money-xs").html(k);
				$(this).parents(".voucher-yc").prevAll(".moneyj").find(".money-sr").val("").removeClass("money-ys");
				$(this).parents(".voucher-yc").prevAll(".moneyj").find(".money-xs").html("");
			}
		}
	} else {
		l = l.toFixed(2);
		$(this).parents(".voucher-center").find(".money-ys").val(l)
		var k = l
		if(l < 10000000000 && vousinglepz == false && vousinglepzzy == false) {
			k = l.replace(".", "");
		}
		$(this).parents(".voucher-center").find(".money-ys").next('.money-xs').html(k);
	}
	$(this).val(formatNum($(this).val()));
	if(vousinglepz == true || vousinglepzzy == true) {
		var nums = $(this).parents(".voucher-center").find('.money-ys').val()
		$(this).parents(".voucher-center").find('.money-ys').parents('.money-jd').find('.money-xs').html(formatNum(nums))
	}
	if($(this).parents('.voucher').hasClass('voucher-singelzybg') || $(this).parents('.voucher').hasClass('voucher-singelzyx')) {
		$(this).parents('.voucher-center').find('.titlemoney').html('金额:' + formatNum(nums))
	}
	if($(this).parents('.voucher-yc-bo').find('.exrateinp').length > 0 && $(this).parents('.voucher-yc-bo').find('.priceinp').length == 0) {
		var ws = parseFloat($(this).parents('.voucher-yc-bo').find('.exrateinp').attr('rateDigits'))
		var curnum = $(this).val().split(",").join("");
		var exrat = $(this).parents('.voucher-yc-bo').find('.curramtinp').val().split(",").join("")
		var yctz = $(this).parents('.voucher-yc-bo').find('.exrateinp').val().split(",").join("");
		var nows = formatNum(parseFloat(yctz * exrat).toFixed(2))
		if(!isNaN(parseFloat(exrat)) && !isNaN(parseFloat(curnum)) && exrat!=0 && nows!=$(this).val()) {
				$(this).parents('.voucher-yc-bo').find('.exrateinp').val(parseFloat(curnum / exrat).toFixed(ws))
		}
	}else if($(this).parents('.voucher-yc-bo').find('.curramtinp').length > 0 && $(this).parents('.voucher-yc-bo').find('.priceinp').length == 0) {
		var curnum = $(this).val().split(",").join("");
		var exrat = $(this).parents('.voucher-yc-bo').find('.exrateinp').val().split(",").join("")
		var yctz = $(this).parents('.voucher-yc-bo').find('.curramtinp').val().split(",").join("");
		var nows = formatNum(parseFloat(yctz * exrat).toFixed(2))
		if(!isNaN(parseFloat(exrat)) && !isNaN(parseFloat(curnum)) && exrat!=0 && nows!=$(this).val()) {
				$(this).parents('.voucher-yc-bo').find('.curramtinp').val(formatNum(parseFloat(curnum / exrat).toFixed(2)))
		}
	}
	if($(this).parents('.voucher-yc-bo').find('.priceinp').length > 0) {
		var ws = parseFloat($(this).parents('.voucher-yc-bo').find('.qtyinp').attr('qty'))
		var curnum = $(this).val().split(",").join("");
		var exrat = $(this).parents('.voucher-yc-bo').find('.qtyinp').val()
		var yctz = $(this).parents('.voucher-yc-bo').find('.priceinp').val().split(",").join("");
		var nows = formatNum(parseFloat(yctz * exrat).toFixed(2))
		if(!isNaN(parseFloat(exrat)) && !isNaN(parseFloat(curnum)) && exrat!=0 && nows!=$(this).val()) {
				$(this).parents('.voucher-yc-bo').find('.priceinp').val(parseFloat(curnum / exrat).toFixed(ws))
		}
	}else if($(this).parents('.voucher-yc-bo').find('.qtyinp').length > 0) {
		var ws = parseFloat($(this).parents('.voucher-yc-bo').find('.qtyinp').attr('qty'))
		var curnum = $(this).val().split(",").join("");
		var exrat = $(this).parents('.voucher-yc-bo').find('.priceinp').val()
		var yctz = $(this).parents('.voucher-yc-bo').find('.qtyinp').val().split(",").join("");
		var nows = formatNum(parseFloat(yctz * exrat).toFixed(2))
		if(!isNaN(parseFloat(exrat)) && !isNaN(parseFloat(curnum)) && exrat!=0 && nows!=$(this).val()) {
				$(this).parents('.voucher-yc-bo').find('.qtyinp').val(parseFloat(curnum / exrat).toFixed(ws))
		}
	}
	bidui();
})
$(document).on("focus", ".curramtinp", function() {
	if($(this).val() != '') {
		$(this).val($(this).val().split(",").join(""))
	}
})
$(document).on("blur", ".curramtinp", function() {
	if($(this).val() != '') {
		var ws = parseFloat($(this).parents('.voucher-yc-bo').find('.exrateinp').attr('rateDigits'))
		if(isNaN(parseFloat($(this).val())) && $(this).val() != '') {
			$(this).val('1')
		}else{
			$(this).val(formatNum($(this).val()))
		}
		if($(this).parents('.voucher-yc-bo').find('.priceinp').length == 0) {
			var curnum = $(this).val().split(",").join("");
			var exrat = $(this).parents('.voucher-yc-bo').find('.exrateinp').val()
			var yctz = $(this).parents('.voucher-yc-bo').find('.yctz').val().split(",").join("");
			if(!isNaN(parseFloat(exrat)) && !isNaN(parseFloat(curnum))) {
				$(this).parents('.voucher-yc-bo').find('.yctz').val(formatNum(parseFloat(curnum * exrat).toFixed(2)))
			}else if(!isNaN(parseFloat(curnum)) && !isNaN(parseFloat(yctz)) &&curnum!=0) {
				$(this).parents('.voucher-yc-bo').find('.exrateinp').val(parseFloat(yctz / curnum).toFixed(ws))
			}
		}
		$(this).parents('.voucher-yc-bo').find('.yctz').trigger('blur')
	}
})
$(document).on("blur", ".priceinp", function() {
	if($(this).val() != '') {
		var ws = parseFloat($(this).parents('.voucher-yc-bo').find('.qtyinp').attr('qty'))
		if(isNaN(parseFloat($(this).val())) && $(this).val() != '') {
			$(this).val('1')
		} else {
			var now = parseFloat($(this).val()).toFixed(ws)
			$(this).val(now)
		}
		var curnum = parseFloat($(this).val().split(",").join("")).toFixed(ws);
		var exrat = $(this).parents('.voucher-yc-bo').find('.qtyinp').val()
		var yctz = $(this).parents('.voucher-yc-bo').find('.yctz').val().split(",").join("");
		if(!isNaN(parseFloat(exrat)) && !isNaN(parseFloat(curnum))) {
			$(this).parents('.voucher-yc-bo').find('.yctz').val(formatNum(parseFloat(curnum * exrat).toFixed(2)))
		}else if(!isNaN(parseFloat(exrat)) && !isNaN(parseFloat(yctz)) &&curnum!=0) {
			$(this).parents('.voucher-yc-bo').find('.qtyinp').val(parseFloat(yctz / curnum).toFixed(ws))
		}
		$(this).parents('.voucher-yc-bo').find('.yctz').trigger('blur')
	}
})
$(document).on("blur", ".qtyinp", function() {
	if($(this).val() != '') {
		var ws = parseFloat($(this).parents('.voucher-yc-bo').find('.qtyinp').attr('qty'))
		var exrat = $(this).val()
		if(isNaN(parseFloat(exrat)) && $(this).val() != '') {
			$(this).val('1')
		} else {
			var exratlen = $(this).attr('qty')
			var now = parseFloat($(this).val()).toFixed(exratlen)
			$(this).val(now)
		}
		var curnum = $(this).parents('.voucher-yc-bo').find('.priceinp').val().split(",").join("");
		var yctz = $(this).parents('.voucher-yc-bo').find('.yctz').val().split(",").join("");
		var exrat = $(this).val()
		if(!isNaN(parseFloat(exrat)) && !isNaN(parseFloat(curnum))){
			$(this).parents('.voucher-yc-bo').find('.yctz').val(formatNum(parseFloat(curnum * exrat).toFixed(2)))
		}else if(!isNaN(parseFloat(yctz)) && !isNaN(parseFloat(exrat)) &&exrat!=0) {
			// if(yctz == '' || parseFloat(yctz) == 0) {
				$(this).parents('.voucher-yc-bo').find('.priceinp').val(parseFloat(yctz / exrat).toFixed(ws))
			// }
		}
		$(this).parents('.voucher-yc-bo').find('.yctz').trigger('blur')
	}
})
$(document).on("blur", ".exrateinp", function() {
	if($(this).val() != '') {
		var exrat = $(this).val()
		if(isNaN(parseFloat(exrat)) && $(this).val() != '') {
			$(this).val('1')
		} else {
			if($(this).attr('.exrate') != undefined) {
				var exrate = $(this).attr('.exrate')
				curexratefzhsxl[exrate] = $(this).val()
			}
		}
		if($(this).parents('.voucher-yc-bo').find('.priceinp').length == 0) {
			var curnum = $(this).parents('.voucher-yc-bo').find('.curramtinp').val().split(",").join("");
			var yctz = $(this).parents('.voucher-yc-bo').find('.yctz').val().split(",").join("");
			var exrat = $(this).val()
			if(!isNaN(parseFloat(curnum)) && !isNaN(parseFloat(exrat))) {
				$(this).parents('.voucher-yc-bo').find('.yctz').val(formatNum(parseFloat(curnum * exrat).toFixed(2)))
			}else if(!isNaN(parseFloat(yctz)) && !isNaN(parseFloat(exrat)) &&exrat!=0){
				$(this).parents('.voucher-yc-bo').find('.curramtinp').val(parseFloat(yctz / exrat).toFixed(2))
			}
		}
		$(this).parents('.voucher-yc-bo').find('.yctz').trigger('blur')
	}
})
$(document).on("keyup", ".yctz", function() {
	var c = $(this);
	if(/[^\d.-]/.test(c.val())) { //替换非数字字符  
		var temp_amount = c.val().replace(/[^\d.=-]/g, '');
		$(this).val(temp_amount);
	}
	if($(this).val() != "") {
		var thisvalsss = $(this).val()
		if(thisvalsss.indexOf("=") >= 0) {
			$(this).val("");
			if($(this).parents(".voucher-center").find('.money-ys').length != 0) {
				$(this).blur()
				$(this).focus()
			}
			var monjfang = 0;
			if(vousinglepz == false && vousinglepzzy == false) {
				for(var i = 0; i < $(".voucher-center").length; i++) {
					if($(".voucher-center").eq(i).find(".moneyj").find(".money-sr").val() != "") {
						monjfang += parseFloat($(".voucher-center").eq(i).find(".moneyj").find(".money-sr").val());
					}
				}
			} else if(vousinglepz == true && vousinglepzzy == false) {
				if($(this).parents('.voucher-center').hasClass('voucher-center-cw')) {
					for(var i = 0; i < $(".voucher-center-cw").length; i++) {
						if($(".voucher-center-cw").eq(i).find(".moneyj").find(".money-sr").val() != "") {
							monjfang += parseFloat($(".voucher-center-cw").eq(i).find(".moneyj").find(".money-sr").val());
						}
					}
				} else if($(this).parents('.voucher-center').hasClass('voucher-center-ys')) {
					for(var i = 0; i < $(".voucher-center-ys").length; i++) {
						if($(".voucher-center-ys").eq(i).find(".moneyj").find(".money-sr").val() != "") {
							monjfang += parseFloat($(".voucher-center-ys").eq(i).find(".moneyj").find(".money-sr").val());
						}
					}
				} else {
					for(var i = 0; i < $(".voucher-center").length; i++) {
						if($(".voucher-center").eq(i).find(".moneyj").find(".money-sr").val() != "") {
							monjfang += parseFloat($(".voucher-center").eq(i).find(".moneyj").find(".money-sr").val());
						}
					}
				}
			} else if(vousinglepz == false && vousinglepzzy == true) {
				if($(this).parents('.voucher-center').hasClass('voucher-centercw')) {
					for(var i = 0; i < $(".voucher-centercw").length; i++) {
						if($(".voucher-centercw").eq(i).find(".moneyj").find(".money-sr").val() != "") {
							monjfang += parseFloat($(".voucher-centercw").eq(i).find(".moneyj").find(".money-sr").val());
						}
					}
				} else if($(this).parents('.voucher-center').hasClass('voucher-centerys')) {
					for(var i = 0; i < $(".voucher-centerys").length; i++) {
						if($(".voucher-centerys").eq(i).find(".moneyj").find(".money-sr").val() != "") {
							monjfang += parseFloat($(".voucher-centerys").eq(i).find(".moneyj").find(".money-sr").val());
						}
					}
				} else {
					for(var i = 0; i < $(".voucher-center").length; i++) {
						if($(".voucher-center").eq(i).find(".moneyj").find(".money-sr").val() != "") {
							monjfang += parseFloat($(".voucher-center").eq(i).find(".moneyj").find(".money-sr").val());
						}
					}
				}
			}
			var mondfang = 0;
			if(vousinglepz == false && vousinglepzzy == false) {
				for(var i = 0; i < $(".voucher-center").length; i++) {
					if($(".voucher-center").eq(i).find(".moneyd").find(".money-sr").val() != "") {
						mondfang += parseFloat($(".voucher-center").eq(i).find(".moneyd").find(".money-sr").val());
					}
				}
			} else if(vousinglepz == true && vousinglepzzy == false) {
				if($(this).parents('.voucher-center').hasClass('voucher-center-cw')) {
					for(var i = 0; i < $(".voucher-center-cw").length; i++) {
						if($(".voucher-center-cw").eq(i).find(".moneyd").find(".money-sr").val() != "") {
							mondfang += parseFloat($(".voucher-center-cw").eq(i).find(".moneyd").find(".money-sr").val());
						}
					}
				} else if($(this).parents('.voucher-center').hasClass('voucher-center-ys')) {
					for(var i = 0; i < $(".voucher-center-ys").length; i++) {
						if($(".voucher-center-ys").eq(i).find(".moneyd").find(".money-sr").val() != "") {
							mondfang += parseFloat($(".voucher-center-ys").eq(i).find(".moneyd").find(".money-sr").val());
						}
					}
				} else {
					for(var i = 0; i < $(".voucher-center").length; i++) {
						if($(".voucher-center").eq(i).find(".moneyd").find(".money-sr").val() != "") {
							mondfang += parseFloat($(".voucher-center").eq(i).find(".moneyd").find(".money-sr").val());
						}
					}
				}
			} else if(vousinglepz == false && vousinglepzzy == true) {
				if($(this).parents('.voucher-center').hasClass('voucher-centercw')) {
					for(var i = 0; i < $(".voucher-centercw").length; i++) {
						if($(".voucher-centercw").eq(i).find(".moneyd").find(".money-sr").val() != "") {
							mondfang += parseFloat($(".voucher-centercw").eq(i).find(".moneyd").find(".money-sr").val());
						}
					}
				} else if($(this).parents('.voucher-center').hasClass('voucher-centerys')) {
					for(var i = 0; i < $(".voucher-centerys").length; i++) {
						if($(".voucher-centerys").eq(i).find(".moneyd").find(".money-sr").val() != "") {
							mondfang += parseFloat($(".voucher-centerys").eq(i).find(".moneyd").find(".money-sr").val());
						}
					}
				} else {
					for(var i = 0; i < $(".voucher-center").length; i++) {
						if($(".voucher-center").eq(i).find(".moneyd").find(".money-sr").val() != "") {
							mondfang += parseFloat($(".voucher-center").eq(i).find(".moneyd").find(".money-sr").val());
						}
					}
				}
			}
			if($(this).parents(".voucher-center").find('.money-ys').length == 0) {
				if(mondfang > monjfang) {
					$(this).parents(".voucher-center").find(".moneyj").find(".money-sr").addClass('money-ys')
					$(this).val((mondfang - monjfang).toFixed(2));
				} else if(mondfang < monjfang) {
					$(this).parents(".voucher-center").find(".moneyd").find(".money-sr").addClass('money-ys')
					$(this).val((monjfang - mondfang).toFixed(2));
				}
			} else {
				if($(this).parents(".voucher-center").find(".money-ys").parents('.money-jd').hasClass("moneyj") || $(this).parents(".voucher-center").find(".money-ys").hasClass("moneyj")) {
					$(this).val((mondfang - monjfang).toFixed(2));
				} else {
					$(this).val((monjfang - mondfang).toFixed(2));
				}
			}
			$(this).blur()
			$(this).focus()
			bidui();
			return false;
		}
	}

})

$(document).on("click", ".ycbodys", function(e) {
	stopPropagation(e)
})
$(document).on("click", ".ycadd,.ycaddopen", function(e) {
	if(!isInputChange()) {
		return false;
	} else {
		var ss = $(this).parents(".voucher-center").find(".accountinginp").attr("accoindex");
		var voucherycss = new Object();
		for(var d in tablehead) {
			var c = d.substring(0, d.length - 4)
			if(quanjuvoudatas.data[ss][c] == 1) {
				voucherycss[d] = tablehead[d];
			}
		}
		var nowAccoCode = $(this).parents('.voucher-center').find(".accountinginp").attr("code");
		var accItemArr = voucherycss;
		voucherycss = resOrderAccItem(nowAccoCode, accItemArr,$(this).parents(".voucher-center"));
		var inde = $(this).parents('.ycadddiv').index()+1
		if($(this).hasClass('ycaddopen')){
			inde = $(this).parents('.voucher-yc-addbtns').next('.voucher-yc-bg').find('.voucher-yc-bo').length
		}
		var remarksval= ''
		var voucherycbo = '';
		voucherycbo += '<div class="voucher-yc-bo" op="0" inde=' + inde + ' >'
		if(isAssRemark){
			voucherycbo += '<div  class="ycbody">'
			voucherycbo += '<textarea class="ycbodyinp remark"></textarea>'
			voucherycbo += '</div>'
		}
		for(var l in voucherycss) {
			if(isuniversities == true && l == 'projectCode'){
				voucherycbo += '<div  class="ycbody">'
				voucherycbo += '<textarea relation = "' + l + '" class="ycbodyinp projectCode" readonly = "true"  ></textarea>'
				voucherycbo += '<span class="vouopendel project icon-close"></span>'
				voucherycbo += '<div class="vouopenbtn project">...</div>'
				voucherycbo += '</div>'
			}else if(isuniversities == true && l == 'quotaCode'){
				voucherycbo += '<div  class="ycbody">'
				voucherycbo += '<textarea relation = "' + l + '" class="ycbodyinp quotaCode" readonly = "true"  ></textarea>'
				voucherycbo += '<span class="vouopendel quota icon-close"></span>'
				voucherycbo += '<div class="vouopenbtn quota">...</div>'
				voucherycbo += '</div>'
			}else{
				voucherycbo += '<div  class="ycbody">'
				voucherycbo += '<textarea relation = "' + l + '" class="ycbodyinp"></textarea>'
				voucherycbo += '</div>'
			}
			if((voucherycss[l]["ELE_CODE"] == "CURRENT" && isbussDate) || (voucherycss[l]["ELE_CODE"] == "EMPLOYEE" && isbussDate)) {
				voucherycbo += '<div  class="ycbody">'
				voucherycbo += '<input type="text" value="' + $("#dates").getObj().getValue() + '" class="ycbodyinp bussDate"  />'
				voucherycbo += '</div>'
			}
		}
		if(quanjuvoudatas.data[ss].field1 ==  '1'){
			voucherycbo += '<div  class="ycbody">'
			voucherycbo += '<textarea class="ycbodyinp field1"  readonly = "true" ></textarea>'
			voucherycbo += '<span class="vouopendel icon-close"></span>'
			voucherycbo += '<div class="vouopenbtn">...</div>'
			voucherycbo += '</div>'
		}
		if(quanjuvoudatas.data[ss].expireDate == 1) {
			voucherycbo += '<div  class="ycbody">'
			voucherycbo += '<input type="text" value="'+$("#dates").getObj().getValue()+'" class="ycbodyinp daoqiri"  />'
			voucherycbo += '</div>'
		}
		if(quanjuvoudatas.data[ss].showBill == 1 && !isalonebill) {
			voucherycbo += '<div  class="ycbody">'
			voucherycbo += '<textarea class="ycbodyinp billNoinp"  ></textarea>'
			voucherycbo += '</div>'
			voucherycbo += '<div  class="ycbody">'
			voucherycbo += '<textarea relation="billTypeinp" class="ycbodyinp billTypeinp"></textarea>'
			voucherycbo += '</div>'
			voucherycbo += '<div  class="ycbody">'
			voucherycbo += '<input type="text" value="'+$("#dates").getObj().getValue()+'" class="ycbodyinp billDateinp"  />'
			voucherycbo += '</div>'
		}
		if(quanjuvoudatas.data[ss].currency == 1) {
			voucherycbo += '<div  class="ycbody">'
			voucherycbo += '<textarea relation = "currency"  type="text" class="ycbodyinp curcodeinp"  ></textarea>'
			voucherycbo += '</div>'
			voucherycbo += '<div  class="ycbody">'
			voucherycbo += '<textarea class="ycbodyinp exrateinp"  ></textarea>'
			voucherycbo += '</div>'
			voucherycbo += '<div  class="ycbody">'
			voucherycbo += '<textarea class="ycbodyinp curramtinp"  ></textarea>'
			voucherycbo += '</div>'
		}
		if(quanjuvoudatas.data[ss].qty == 1) {
			voucherycbo += '<div  class="ycbody">'
			voucherycbo += '<textarea class="ycbodyinp priceinp"  ></textarea>'
			voucherycbo += '</div>'
			voucherycbo += '<div  class="ycbody">'
			voucherycbo += '<textarea class="ycbodyinp qtyinp"   qty="' + quanjuvoudatas.data[ss].qtyDigits + '" ></textarea>'
			voucherycbo += '</div>'
		}
		if(quanjuvoudatas.data[ss].field2 == 1) {
			voucherycbo += '<div  class="ycbody">'
			voucherycbo += '<textarea relation = "field2" class="ycbodyinp field2inp"></textarea>'
			voucherycbo += '<span class="fielddetail">详情</span>'
			voucherycbo += '</div>'
		}
		voucherycbo += '<input type="text" class="ycbody yctz" />'
		voucherycbo += '<span class="Assaccbala">余额</span>'
		voucherycbo += '</div>'
		if($(this).hasClass('ycaddopen')){
			$(this).parents('.voucher-yc-addbtns').next('.voucher-yc-bg').find('.voucher-yc-bo').eq(inde - 1).after(voucherycbo);
		}else{
			$(this).parents('.voucher-yc-addbtns').next('.voucher-yc-bg').find('.voucher-yc-bo').eq(inde - 1).before(voucherycbo);
		}
		$(this).parents('.voucher-yc-addbtns').find('.ycaddopen').before('<div class="ycadddiv" inde=' + inde + '><img src="img/insert.png" class="ycadd"></div>')
		$(this).parents('.voucher-yc-addbtns').nextAll('.voucher-yc-deletebtns').append('<div class="ycdeldiv" inde=' + inde + '><span class="ycdelect icon-trash"></span></div>')
		$(this).parents('.voucher-yc-addbtns').find('.ycaddopen').css("visibility", "hidden")
		$('.daoqiri,.billDateinp,.bussDate').datetimepicker(glRptJournalDate)
		var _this = $(this)
		for(var i = 0; i < _this.parents(".voucher-center").find(".voucher-yc").length; i++) {
			if(_this.parents(".voucher-center").find(".voucher-yc").eq(i).hasClass("deleteclass")) {} else {
				voucherYcAssCss(_this.parents(".voucher-center").find(".voucher-yc").eq(i))
				if(quanjuvoudatas.data[ss].defcurCode != '' && quanjuvoudatas.data[ss].currency == 1) {
					for(var j = 0; j < _this.parents(".voucher-center").find(".voucher-yc").eq(i).find('.curcodeinp').length; j++) {
						if(_this.parents(".voucher-center").find(".voucher-yc").eq(i).find('.curcodeinp').eq(j).val() == '') {
							for(var z = 0; z < _this.parents(".voucher-center").find(".voucher-yc").eq(i).find('.curcodeinp').eq(j).next('.ycbodys').find('li').length; z++) {
								var nowthis = _this.parents(".voucher-center").find(".voucher-yc").eq(i).find('.curcodeinp').eq(j).next('.ycbodys').find('li').eq(z)
								if(nowthis.find('.code').html() == quanjuvoudatas.data[ss].defcurCode) {
									nowthis.trigger('click')
								}
							}
						}
					}
				}
			}
		}
		if(vouiscopyprevAss) {
			var paryc = $(this).parents(".voucher-yc")
			var bodyss = new Object();
			var $ycBt = paryc
			var headLen = $ycBt.find(".ychead").length - 1;
			var bolen = $(this).parents('.ycadddiv').index()+1
			if($(this).hasClass('ycaddopen')){
				bolen = $(this).parents('.voucher-yc-addbtns').next('.voucher-yc-bg').find('.voucher-yc-bo').length
			}
			var copybo = $(this).parents(".voucher-yc").find('.voucher-yc-bo').eq(bolen)
			if($(this).hasClass('ycaddopen')){
				copybo = $(this).parents(".voucher-yc").find('.voucher-yc-bo').eq(bolen-2)
			}
			for(var k = 0; k < headLen; k++) {
				var dd = $ycBt.find(".ychead").eq(k).attr("name");
				if(dd == 'expireDate' || dd == 'qty' || dd == 'price' || dd == 'exRate' || dd == 'currAmt') {
					var itemCodeName = copybo.find(".ycbody").eq(k).find(".ycbodyinp").val();
					bodyss[dd] = itemCodeName;
				} else if(dd == 'currAmt') {
					var itemCodeName = copybo.find(".ycbody").eq(k).find(".ycbodyinp").val().split(",").join("");
					bodyss[dd] = itemCodeName;
				} else if(dd == 'billNo' || dd == 'billDate' || dd == 'bussDate' || dd == 'remark' || dd == 'field1') {
					var itemCodeName = copybo.find(".ycbody").eq(k).find(".ycbodyinp").val();
					bodyss[dd] = itemCodeName;
					if( dd == 'field1' && itemCodeName!=''){
						bodyss.cancelAssGuid =  copybo.find(".ycbody").eq(k).find(".ycbodyinp").attr('cGuid')
					}
				} else {
					var itemCodeName = copybo.find(".ycbody").eq(k).find(".ycbodyinp").val();
					var itemCode = itemCodeName.substring(0, itemCodeName.indexOf(" "));
					bodyss[dd] = itemCode;
				}
			}
			var nextbpo = $(this).parents(".voucher-yc").find('.voucher-yc-bo').eq(bolen-1)
			for(var r = 0; r < nextbpo.find(".ycbodyinp").length; r++) {
				var relation  =nextbpo.find(".ycbody").eq(r).find(".ycbodyinp").attr('relation')
				var $li = $('#AssDataAll').find("."+relation).find("li");
				var $lis = fzhsxl[relation]
				if(paryc.find(".voucher-yc-bt").find(".ychead").eq(r).attr("name") == "expireDate") {
					nextbpo.find(".ycbodyinp").eq(r).val(bodyss.expireDate);
				} else if(paryc.find(".voucher-yc-bt").find(".ychead").eq(r).attr("name") == "billNo") {
					nextbpo.find(".ycbodyinp").eq(r).val(bodyss.billNo);
				} else if(paryc.find(".voucher-yc-bt").find(".ychead").eq(r).attr("name") == "price") {
					nextbpo.find(".ycbodyinp").eq(r).val(bodyss.price);
				} else if(paryc.find(".voucher-yc-bt").find(".ychead").eq(r).attr("name") == "qty") {
					nextbpo.find(".ycbodyinp").eq(r).val(bodyss.qty);
				} else if(paryc.find(".voucher-yc-bt").find(".ychead").eq(r).attr("name") == "exRate") {
					nextbpo.find(".ycbodyinp").eq(r).val(bodyss.exRate);
				} else if(paryc.find(".voucher-yc-bt").find(".ychead").eq(r).attr("name") == "currAmt") {
					nextbpo.find(".ycbodyinp").eq(r).val(formatNum(bodyss.currAmt));
				} else if(paryc.find(".voucher-yc-bt").find(".ychead").eq(r).attr("name") == "remark") {
					nextbpo.find(".ycbodyinp").eq(r).val(bodyss.remark);
				} else if(paryc.find(".voucher-yc-bt").find(".ychead").eq(r).attr("name") == "billDate") {
					nextbpo.find(".ycbodyinp").eq(r).val(bodyss.billDate);
				} else if(paryc.find(".voucher-yc-bt").find(".ychead").eq(r).attr("name") == "bussDate") {
					nextbpo.find(".ycbodyinp").eq(r).val(bodyss.bussDate);
				} else if(paryc.find(".voucher-yc-bt").find(".ychead").eq(r).attr("name") == "field1") {
					nextbpo.find(".ycbodyinp").eq(r).val(bodyss.field1).attr('cGuid',bodyss.cancelAssGuid);
				}else if(paryc.find(".voucher-yc-bt").find(".ychead").eq(r).attr("name") == "field2") {
					if(!$.isNull(bodyss.field2)){
						var ss = bodyss.field2.indexOf('|')
						var code = bodyss.field2.slice( 0,ss);
						var itemid= bodyss.field2.slice(ss)
						for(var s = 0; s < $li.length; s++) {
							if($li.eq(s).find(".code").text() == code) {
								$li.eq(s).removeClass("unselected").addClass("selected");
								var fzxlnrcode = $li.eq(s).find(".code").text();
								var fzxlnrname = $li.eq(s).find(".name").text();
								vifvcyb.eq(k).find(".ycbodyinp").eq(r).val(fzxlnrcode +' '+ fzxlnrname).attr('itemid',itemid).attr('code',fzxlnrcode);
							}
						}
					}
				} else if(paryc.find(".voucher-yc-bt").find(".ychead").eq(r).attr("name") == "curCode") {
					for(var s = 0; s < $li.length; s++) {
						if($li.eq(s).find(".code").text() == bodyss.curCode) {
							$li.eq(s).removeClass("unselected").addClass("selected");
							var fzxlnrcode = $li.eq(s).find(".code").text();
							var fzxlnrname = $li.eq(s).find(".name").text();
							var exrate = $li.eq(s).attr('exrate')
							var rateDigits = $li.eq(s).attr('rateDigits')
							nextbpo.find(".ycbodyinp").eq(r).val(fzxlnrcode + " " + fzxlnrname).attr('code',fzxlnrcode)
							nextbpo.find(".exrateinp").attr('exrate', exrate).attr('rateDigits', rateDigits)
						}
					}
				} else if(paryc.find(".voucher-yc-bt").find(".ychead").eq(r).attr("name") == "billType") {
					for(var s = 0; s < $li.length; s++) {
						if($li.eq(s).find(".code").text() == bodyss.billType) {
							$li.eq(s).removeClass("unselected").addClass("selected");
							var fzxlnrcode = $li.eq(s).find(".code").text();
							var fzxlnrname = $li.eq(s).find(".name").text();
							nextbpo.find(".ycbodyinp").eq(r).val(fzxlnrcode + " " + fzxlnrname).attr('code',fzxlnrcode)
						}
					}
				} else {
					var btcoded = paryc.find(".voucher-yc-bt").find(".ychead").eq(r).attr("name")
					for(var s = 0; s < $lis.length; s++) {
						if($lis[s].code == bodyss[btcoded]) {
							if(isaccfullname){
								nextbpo.find(".ycbodyinp").eq(r).val($lis[s].code + ' ' +$lis[s].chrFullname).attr('code',$lis[s].code)
							}else{
								nextbpo.find(".ycbodyinp").eq(r).val($lis[s].code + ' ' +$lis[s].name).attr('code',$lis[s].code);
							}
						}
					}
				}
			}
		}
		if($(this).parents(".voucher-yc").find(".voucher-yc-bo").length - $(this).parents(".voucher-yc").find(".deleteclass").length <= 9) {
			$(".voucherall").height($(".voucherall").height() + 52);
			voucherycshowheight()
			fixedabsulate();
		}
		if($(this).parents(".voucher-yc").find(".voucher-yc-bo").length - $(this).parents(".voucher-yc").find(".deleteclass").length > 8) {
			if(!$(this).parents(".voucher-yc").find('.voucher-yc-scroll').hasClass('ishei')){
				$(this).parents(".voucher-yc").find('.voucher-yc-scroll').css("height",$(this).parents(".voucher-yc").outerHeight()-52+"px").addClass('ishei');
			}
			$(this).parents(".voucher-yc").find('.voucher-yc-scroll').addClass("bgheight");
			voucherYcAssCssbgheight($(this).parents(".voucher-yc"))
		}
	}
})
//删除辅助项分录行按钮
$(document).on("click", ".ycdelect", function(e) {
	stopPropagation(e)
	var editStatus4 = $(this).parents('.voucher-yc-bo').attr('ifEdit')=='false'
	if(!isInputChange() || editStatus4) {
		return false;
	} else {
		$(this).parents(".voucher-center").attr("op", "1");
		var inde = $(this).parent('.ycdeldiv').index() - 1
		var editStatus0 = ($("#pzzhuantai").attr("vou-status") == undefined);
		if(!editStatus0) {
			var editStatus1 = ($("#pzzhuantai").attr("vou-status") == "O");
			var editStatus2 = (isInputor == true && (selectdata.data.inputor == ufgovkey.svUserCode || selectdata.data.inputor == undefined));
			var editStatus3 = ((isvousource && isvousourceclick == false) || isvousourceclick)
			var editStatus4 = $(this).parents(".voucher-yc").find(".voucher-yc-bo").eq(inde).attr('ifEdit')=='false'
			if(editStatus1 && (editStatus2 || isInputor == false) && editStatus3 && !editStatus4 && vouiseditsave) {
				_this = $(this).parents(".voucher-yc");
				if(_this.find(".deleteclass").length + 1 < _this.find(".yctz").length) {
					if($(this).parents(".voucher-yc").find(".voucher-yc-bo").length - _this.find(".deleteclass").length < 9) {
						$(".voucherall").height($(".voucherall").height() - 52)
						voucherycshowheight()
						fixedabsulate();
						_this.parents(".voucher-center").find(".voucher-yc").find('.voucher-yc-scroll').css("height",'').removeClass('ishei');
						_this.parents(".voucher-center").find(".voucher-yc").find('.voucher-yc-scroll').removeClass("bgheight");
						voucherYcAssCss(_this.parents(".voucher-center").find(".voucher-yc"))
					}
					$(this).parents(".voucher-yc").find(".voucher-yc-bo").eq(inde).remove()
					$(this).parents('.voucher-yc-deletebtns').prevAll('.voucher-yc-addbtns').find('.ycadddiv').eq(inde).remove()
					$(this).parents('.ycdeldiv').remove()
				} else {
					$(this).parents(".voucher-yc").find(".voucher-yc-bo").eq(inde).find("input").val("").removeAttr('code');
					$(this).parents(".voucher-yc").find(".voucher-yc-bo").eq(inde).find("textarea").val("").removeAttr('code');
					$(this).parents(".voucher-yc").find(".voucher-yc-bo").eq(inde).find(".selected").addClass("unselected").removeClass("selected");
				}
				var s = 0;
				for(var i = 0; i < _this.find(".yctz").length; i++) {
					if(_this.find(".yctz").eq(i).val() != "") {
						s += parseFloat(_this.find(".yctz").eq(i).val().split(",").join(""));
					}
				}
				s = s.toFixed(2);
				var n = s
				if(s < 10000000000 && vousinglepz == false && vousinglepzzy == false) {
					n = s.replace(".", "");
				}
				if(moneyzy == 0 && _this.parents(".voucher-center").find(".moneyd").find(".money-sr").val() == '') {
					_this.parents(".voucher-center").find(".moneyj").find(".money-sr").val(s).addClass("money-ys");;
					_this.parents(".voucher-center").find(".moneyj").find(".money-xs").html(n);
				} else if(moneyzy == 0 && _this.parents(".voucher-center").find(".moneyd").find(".money-sr").val() != '') {
					_this.parents(".voucher-center").find(".moneyd").find(".money-sr").val(s).addClass("money-ys");
					_this.parents(".voucher-center").find(".moneyd").find(".money-xs").html(n);
				} else if(moneyzy == 1 && _this.parents(".voucher-center").find(".moneyj").find(".money-sr").val() == '') {
					_this.parents(".voucher-center").find(".moneyd").find(".money-sr").val(s).addClass("money-ys");
					_this.parents(".voucher-center").find(".moneyd").find(".money-xs").html(n);
				} else if(moneyzy == 1 && _this.parents(".voucher-center").find(".moneyj").find(".money-sr").val() != '') {
					_this.parents(".voucher-center").find(".moneyj").find(".money-sr").val(s).addClass("money-ys");
					_this.parents(".voucher-center").find(".moneyj").find(".money-xs").html(n);
				}
				bidui();
			}
		} else {
			_this = $(this).parents(".voucher-yc");
			if(_this.find(".deleteclass").length + 1 < _this.find(".yctz").length) {
				if($(this).parents(".voucher-yc").find(".voucher-yc-bo").length - _this.find(".deleteclass").length < 9) {
					$(".voucherall").height($(".voucherall").height() - 52)
					fixedabsulate();
					_this.parents(".voucher-center").find(".voucher-yc").find('.voucher-yc-scroll').css("height",'').removeClass('ishei');;
					_this.parents(".voucher-center").find(".voucher-yc").find('.voucher-yc-scroll').removeClass("bgheight");
					voucherYcAssCss(_this.parents(".voucher-center").find(".voucher-yc"))
				}
				$(this).parents(".voucher-yc").find(".voucher-yc-bo").eq(inde).remove()
				$(this).parents('.voucher-yc-deletebtns').prevAll('.voucher-yc-addbtns').find('.ycadddiv').eq(inde).remove()
				$(this).parents('.ycdeldiv').remove()
			} else {
				$(this).parents(".voucher-yc").find(".voucher-yc-bo").eq(inde).find("input").val("").removeAttr('code');
				$(this).parents(".voucher-yc").find(".voucher-yc-bo").eq(inde).find("textarea").val("").removeAttr('code');
				$(this).parents(".voucher-yc").find(".voucher-yc-bo").eq(inde).find(".selected").addClass("unselected").removeClass("selected");
			}

			var s = 0;
			for(var i = 0; i < _this.find(".yctz").length; i++) {
				if(_this.find(".yctz").eq(i).val() != "") {
					s += parseFloat(_this.find(".yctz").eq(i).val().split(",").join(""));
				}
			}
			s = s.toFixed(2);
			var n = s
			if(s < 10000000000 && vousinglepz == false && vousinglepzzy == false) {
				n = s.replace(".", "");
			}
			if(moneyzy == 0 && _this.parents(".voucher-center").find(".moneyd").find(".money-sr").val() == '') {
				_this.parents(".voucher-center").find(".moneyj").find(".money-sr").val(s).addClass("money-ys");;
				_this.parents(".voucher-center").find(".moneyj").find(".money-xs").html(n);
			} else if(moneyzy == 0 && _this.parents(".voucher-center").find(".moneyd").find(".money-sr").val() != '') {
				_this.parents(".voucher-center").find(".moneyd").find(".money-sr").val(s).addClass("money-ys");
				_this.parents(".voucher-center").find(".moneyd").find(".money-xs").html(n);
			} else if(moneyzy == 1 && _this.parents(".voucher-center").find(".moneyj").find(".money-sr").val() == '') {
				_this.parents(".voucher-center").find(".moneyd").find(".money-sr").val(s).addClass("money-ys");
				_this.parents(".voucher-center").find(".moneyd").find(".money-xs").html(n);
			} else if(moneyzy == 1 && _this.parents(".voucher-center").find(".moneyj").find(".money-sr").val() != '') {
				_this.parents(".voucher-center").find(".moneyj").find(".money-sr").val(s).addClass("money-ys");
				_this.parents(".voucher-center").find(".moneyj").find(".money-xs").html(n);
			}
			bidui();
		}
		if(vousinglepz == true) {
			var nums = $(this).parents(".voucher-center").find('.money-ys').val()
			$(this).parents(".voucher-center").find('.money-ys').parents('.money-jd').find('.money-xs').html(formatNum(nums))
			bidui();
		}
	}
})



var keyzhibiao = new Object()
//辅助金额input
$(document).on("focus", ".yctz", function() {
	var editStatus0 = ($("#pzzhuantai").attr("vou-status") == undefined);
	if(!editStatus0) {
		var editStatus1 = ($("#pzzhuantai").attr("vou-status") == "O");
		var editStatus2 = (isInputor == true && (selectdata.data.inputor == ufgovkey.svUserCode || selectdata.data.inputor == undefined));
		var editStatus3 = ((isvousource && isvousourceclick == false) || isvousourceclick)
		var editStatus4 = $(this).parents('.voucher-yc-bo').attr('ifEdit')=='false'
		if(editStatus1 && (editStatus2 || isInputor == false) && editStatus3 && !editStatus4 && vouiseditsave) {
			$(this).removeAttr("readonly");
		} else {
			$(this).attr("readonly", true);
			//return false;
		}
	} else {
		$(this).removeAttr("readonly");
	}
	var thisvals = $(this).val().split(",").join("");
	if($(this).parents('.voucher-yc-bo').find('.qtyinp').length>0){
		var exrat = $(this).parents('.voucher-yc-bo').find('.qtyinp').val().split(",").join("");
		var curnum = $(this).parents('.voucher-yc-bo').find('.priceinp').val().split(",").join("");
		if(!isNaN(parseFloat(exrat)) && !isNaN(parseFloat(curnum))) {
			// if(yctz == '' || parseFloat(yctz) == 0) {
				thisvals=parseFloat(curnum * exrat).toFixed(2)
			// }
		}
	}else if($(this).parents('.voucher-yc-bo').find('.curramtinp').length>0){
		var exrat = $(this).parents('.voucher-yc-bo').find('.curramtinp').val().split(",").join("");
		var curnum= $(this).parents('.voucher-yc-bo').find('.exrateinp').val().split(",").join("");
		if(!isNaN(parseFloat(exrat)) && !isNaN(parseFloat(curnum))) {
			// if(yctz == '' || parseFloat(yctz) == 0) {
				thisvals=parseFloat(curnum * exrat).toFixed(2)
			// }
		}
	}
	if(!$(this).attr("readonly")) {
		$(this).val(thisvals).select();
	}
	_this = $(this);
	var fasong = true;
	for(var i = 0; i < $(this).parents(".voucher-yc-bo").find(".ycbodyinp").length; i++) {
		if($(this).parents(".voucher-yc-bo").find(".ycbodyinp").eq(i).val()=='' && $(this).parents(".voucher-yc-bo").find(".ycbodyinp").eq(i).attr("relation") !=undefined) {
			var inp = $(this).parents(".voucher-yc-bo").find(".ycbodyinp").eq(i)
			if(!inp.hasClass('diffTermCodeinp') && !inp.hasClass('billTypeinp') && !inp.hasClass('curcodeinp')) {
				fasong = false
			}
		}
	}
	if(fasong == true) {
		var yctzthis = new Object();
		var namei = $(this).parents(".voucher-center").find(".accountinginp").attr("accoindex");
		yctzthis.accoId = quanjuvoudatas.data[namei].chrId;
		yctzthis.accoCode = quanjuvoudatas.data[namei].accoCode;
		yctzthis.stadAmt = 0;
		yctzthis.agencyCode = rpt.nowAgencyCode;
		yctzthis.acctCode = rpt.nowAcctCode;
		if($(".voucher-head").attr("namess") != undefined) {
			yctzthis.busBillId = $(".voucher-head").attr("namess");
		} else {
			yctzthis.busBillId = ""
		}
		var ycybodys = $(this).parents(".voucher-yc-bo").find(".ycbodyinp").length;
		for(var i = 0; i < ycybodys; i++) {
			if($(this).parents(".voucher-yc-bo").find(".ycbodyinp").eq(i).attr("relation") !=undefined){
				var name = $(this).parents(".voucher-yc-bg").find(".voucher-yc-bt").find(".ychead").eq(i).attr("name");
				var code = $(this).parents(".voucher-yc-bo").find(".ycbodyinp").eq(i).attr('code')
				if(tablehead[name] != undefined) {
					var thiselecode = tablehead[name].ELE_CODE
					yctzthis[tablehead[name].ELE_CODE] = code;
				}
			}
		}
		var noshows = JSON.parse($(this).parents(".voucher-yc-bg").find(".voucher-yc-bt").find(".noshowdata").attr('noshow'))
		for(var n in noshows) {
			var sz = n.substring(0, n.length - 4).toUpperCase()
			yctzthis[sz] = noshows[n]
		}
		var vcselname = $(this).parents(".voucher-center").find(".accountinginp").attr("accoindex");
		var voucherycss = new Object();
		for(var d in tablehead) {
			var c = d.substring(0, d.length - 4)
			if(quanjuvoudatas.data[vcselname][c] == 2) {
				yctzthis[tablehead[d].ELE_CODE] = quanjuvoudatas.data[vcselname][d]
			}
		}
		if(keypandingzhibiao != null) {
			for(var i = 0; i < keypandingzhibiao.length; i++) {
				if(keypandingzhibiao[i].split(" ")[0] == quanjuvoudatas.data[namei].accoCode) {
					$.ajax({
						type: "post",
						beforeSend: function(xhr) {
							xhr.setRequestHeader("x-function-id",voumenuid);
						},
						url: "/gl/vou/queryBg" + "?ajax=1&rueicode="+hex_md5svUserCode,
						async: true,
						data: JSON.stringify(yctzthis),
						contentType: 'application/json; charset=utf-8',
						success: function(data) {
							if(data.flag == "success") {
								if(data.data != null && data.data.length > 0) {
									var tzlang = _this.parents(".voucher-yc-bo").find('.yctz').width() - 19
									_this.parents(".voucher-yc-bo").find('.yctzyuer').remove()
									_this.parents(".voucher-yc-bo").find('.yctzyutext').remove()
									_this.after('<span class="yctzyuer">余额：' + formatNum(parseFloat(data.data[0].bgItemBalance).toFixed(2)) + '</span><span class="yctzyutext" style="right:' + tzlang + 'px"><span>预</span></span>')
									var yctzyuername = _this.parents(".voucher-center").index() + _this.parents(".voucher-yc-bo").index()
									_this.next(".yctzyuer").attr("name", yctzyuername);
									keyzhibiao[_this.next(".yctzyuer").attr("name")] = data.data;
								}
							}
						}
					});
				} else {
					$(this).parents(".voucher-yc-bo").find(".yctzyutext").remove()
					$(this).parents(".voucher-yc-bo").find(".yctzyuer").remove()
				}
			}
		}
	}
})

$(document).on("keydown", function(event) {
	if(!$(".voucher-yc input:focus").get(0) && $(".voucher-yc").is(":visible")) {
		if(event.keyCode == "13" && event.ctrlKey) {
			$(".voucher-yc").hide();
			var slength = $(".voucher").find('.voucher-center').length;
			for(var i = 0; i < $(".voucher").find('.voucher-center').length; i++) {
				if($(".voucher").find('.voucher-center').eq(i).attr('op') == 2) {
					slength--;
				}
			}
			$(".voucherall").height($(".voucherall").height() + ((slength - 4) * 50))
		}
	}
});
//关闭辅助项表格按钮
$(document).on("click", ".voucher-close", function(event) {
	event.stopPropagation();
	var $yc = $(this).parents(".voucher-yc");
	if($yc.css('display') != 'none') {
		$yc.hide();
		$(".voucherall").height($(".voucherall").height() -$yc.outerHeight())
		voucherycshowheight()
		fixedabsulate();
	}
});
$(document).on("click", ".voucher-yc-j", function(event) {
	event.stopPropagation();
	var editStatus4 = $(this).parents('.voucher-center').attr('ifEdit')=='false'
	if(!isInputChange() || editStatus4) {
		$(this).attr("readonly", true);
		return false;
	} else {
	var l = 0;
	for(var i = 0; i < $(this).parents(".voucher-yc").find(".yctz").length; i++) {
		if($(this).parents(".voucher-yc").find(".yctz").eq(i).val() != "") {
			l += parseFloat($(this).parents(".voucher-yc").find(".yctz").eq(i).val().split(",").join(""));
		}
	}
	l = l.toFixed(2);
	if($(this).parents(".voucher-yc").prevAll(".moneyd").find(".money-sr").val()!=''){
		$(this).parents(".voucher-yc").find('.field1').val('')
	}
	$(this).parents(".voucher-yc").prevAll(".moneyj").find(".money-sr").val(l).addClass("money-ys");
	$(this).parents(".voucher-yc").prevAll(".moneyj").find(".money-xs").html(l);
	$(this).parents(".voucher-yc").prevAll(".moneyd").find(".money-sr").val("").removeClass("money-ys");
	$(this).parents(".voucher-yc").prevAll(".moneyd").find(".money-xs").html("");
	$(this).parents(".voucher-center").attr("op", 1)
	bidui()
	}
});
$(document).on("click", ".voucher-yc-d", function(event) {
	event.stopPropagation();
	var editStatus4 = $(this).parents('.voucher-center').attr('ifEdit')=='false'
	if(!isInputChange() || editStatus4) {
		$(this).attr("readonly", true);
		return false;
	} else {
	var l = 0;
	for(var i = 0; i < $(this).parents(".voucher-yc").find(".yctz").length; i++) {
		if($(this).parents(".voucher-yc").find(".yctz").eq(i).val() != "") {
			l += parseFloat($(this).parents(".voucher-yc").find(".yctz").eq(i).val().split(",").join(""));
		}
	}
	l = l.toFixed(2);
	if($(this).parents(".voucher-yc").prevAll(".moneyj").find(".money-sr").val()!=''){
		$(this).parents(".voucher-yc").find('.field1').val('')
	}
	$(this).parents(".voucher-yc").prevAll(".moneyd").find(".money-sr").val(l).addClass("money-ys");
	$(this).parents(".voucher-yc").prevAll(".moneyd").find(".money-xs").html(l);
	$(this).parents(".voucher-yc").prevAll(".moneyj").find(".money-sr").val("").removeClass("money-ys");
	$(this).parents(".voucher-yc").prevAll(".moneyj").find(".money-xs").html("");
	$(this).parents(".voucher-center").attr("op", 1)
	bidui()
	}
});
$(document).on("click", ".fzhsadd", function(e) {
	stopPropagation(e);
	var title = $(this).attr('tzurl')
	var baseUrl= ''
	var titles = ''
	if(fzhsurlData[title] == undefined) {
		var elecode = tablehead[title].ELE_CODE
		var elename = tablehead[title].ELE_NAME
		titles= '基础数据维护'
		baseUrl='/pf/ma/userData/userDataAgy.html?menuid=ebb236b4-7020-4d40-b306-5fd90669ee59&menuname=%E5%9F%BA%E7%A1%80%E6%95%B0%E6%8D%AE%E7%BB%B4%E6%8A%A4&firstLevel=21&datafor=vou&accitemCode='+title+'&eleCode='+elecode+'&eleName='+elename+'&agencyCode='+rpt.nowAgencyCode+'&agencyName='+rpt.nowAgencyName
	} else if($(this).attr('tzurl') == 'billtype'){
		titles= '票据类型'
		baseUrl= fzhsurlData[title]
	}else{
		titles= tablehead[title].ELE_NAME
		baseUrl= fzhsurlData[title]
	}
	ufma.removeCache("maobjData");
	var maobjData = {
		agencyCode: rpt.cbAgency.getValue(),
		acctCode: rpt.cbAcct.getValue()
	}
	ufma.setObjectCache("maobjData", maobjData);
	uf.openNewPage(page.isCrossDomain,$(this), 'openMenu', baseUrl, false, titles);
})
//高校版本往来号/项目额度处理

$(document).on("click",'.vouopendel',function(e){
	stopPropagation(e)
	if(!isInputChange()) {
		return false;
	}
	if($(this).parents('.ycbody').find('.ycbodyinp').hasClass('field1')){
		var vcenter = $(this).parents('.voucher-center')
		var accinp = vcenter.find(".accountinginp")
		var moneyys = vcenter.find(".money-ys")
		var nowmoney = $(this).parents('.voucher-yc-bo').find(".yctz").val().split(",").join("")
		var ss = $(this).parents(".voucher-center").find(".accountinginp").attr("accoindex");
		if(moneyys.length>0){
			if(moneyys.hasClass('money-jd')){
				if(quanjuvoudatas.data[ss].accBal == '1' && moneyys.hasClass('moneyj') && parseFloat(nowmoney)>0){
					return false
				}
				if(quanjuvoudatas.data[ss].accBal == '-1' && moneyys.hasClass('moneyd') && parseFloat(nowmoney)>0){
					return false
				}
				if(quanjuvoudatas.data[ss].accBal == '1' && moneyys.hasClass('moneyd') && parseFloat(nowmoney)<0){
					return false
				}
				if(quanjuvoudatas.data[ss].accBal == '-1' && moneyys.hasClass('moneyj') && parseFloat(nowmoney)<0){
					return false
				}
			}else{
				if(quanjuvoudatas.data[ss].accBal == '1' && moneyys.parents(".money-jd").hasClass('moneyj') && parseFloat(nowmoney)>0){
					return false
				}
				if(quanjuvoudatas.data[ss].accBal == '-1' && moneyys.parents(".money-jd").hasClass('moneyd') && parseFloat(nowmoney)>0){
					return false
				}
				if(quanjuvoudatas.data[ss].accBal == '1' && moneyys.parents(".money-jd").hasClass('moneyd') && parseFloat(nowmoney)<0){
					return false
				}
				if(quanjuvoudatas.data[ss].accBal == '-1' && moneyys.parents(".money-jd").hasClass('moneyj') && parseFloat(nowmoney)<0){
					return false
				}
			}
		}else{
			return false
		}
		$(this).parents('.ycbody').find('.ycbodyinp').val('')
		$(this).removeAttr('cGuid')
	}else{
		$(this).parents('.ycbody').find('.ycbodyinp').val('')
		$(this).removeAttr('code')
	}
})
//点击弹窗按钮查询内容
$(document).on("click",'.vouopenbtn',function(){
	if(!isInputChange()) {
		return false;
	}
	if($(this).hasClass('project') || $(this).hasClass('quota')){
		var that = $(this).parents(".voucher-yc-bo")
		ufma.open({
			url: '/pf/pbm/index.html#/projectAndQuotaSelect',
			title: "项目预算",
			width: 1200,
			data: {},
			ondestory: function (result) {
				if(result.action.length!=0){
					var projectval = result.action.projectCode+' '+result.action.projectName
					that.find('.projectCode').val(projectval).attr('code',result.action.projectCode)
					var quotaval = result.action.quotaCode+' '+result.action.quotaName
					that.find('.quotaCode').val(quotaval).attr('code',result.action.quotaCode)
				}
			}
		})
	}else{
		var vcenter = $(this).parents('.voucher-center')
		var accinp = vcenter.find(".accountinginp")
		var moneyys = vcenter.find(".money-ys")
		var nowmoney = $(this).parents('.voucher-yc-bo').find(".yctz").val().split(",").join("")
		var ss = $(this).parents(".voucher-center").find(".accountinginp").attr("accoindex");
		
		if(moneyys.length>0){
			if(moneyys.hasClass('money-jd')){
				if(quanjuvoudatas.data[ss].accBal == '1' && moneyys.hasClass('moneyj') && parseFloat(nowmoney)>0){
					return false
				}
				if(quanjuvoudatas.data[ss].accBal == '-1' && moneyys.hasClass('moneyd') && parseFloat(nowmoney)>0){
					return false
				}
				if(quanjuvoudatas.data[ss].accBal == '1' && moneyys.hasClass('moneyd') && parseFloat(nowmoney)<0){
					return false
				}
				if(quanjuvoudatas.data[ss].accBal == '-1' && moneyys.hasClass('moneyj') && parseFloat(nowmoney)<0){
					return false
				}
			}else{
				if(quanjuvoudatas.data[ss].accBal == '1' && moneyys.parents(".money-jd").hasClass('moneyj') && parseFloat(nowmoney)>0){
					return false
				}
				if(quanjuvoudatas.data[ss].accBal == '-1' && moneyys.parents(".money-jd").hasClass('moneyd') && parseFloat(nowmoney)>0){
					return false
				}
				if(quanjuvoudatas.data[ss].accBal == '1' && moneyys.parents(".money-jd").hasClass('moneyd') && parseFloat(nowmoney)<0){
					return false
				}
				if(quanjuvoudatas.data[ss].accBal == '-1' && moneyys.parents(".money-jd").hasClass('moneyj') && parseFloat(nowmoney)<0){
					return false
				}
			}
		}else{
			return false
		}
		var isint = true;
		if(parseFloat(nowmoney)<0){
			isint= false
			nowmoney  = -parseFloat(nowmoney)
		}
		var active = 'add'
		var assdataAll = getAssData($(this).parents('.voucher-center'))
		var noarr={
			// 'expireDate':'','stadAmt':'','field1':'','remark':'',
			// 'qty':'','price':'','currAmt':'','exRate':'',
		}
		var assdata = getAccoByAss($(this).parents('.voucher-yc-bo'),noarr)
		var newassid = $(this).parents('.voucher-yc-bo').attr("namessss");
		if(newassid == undefined){
			newassid = ''
		}
		var assdataindex = $(this).parents('.voucher-yc-bo').index()
		var voufield1amt = getfield1Amt()
		if($(this).parents('.ycbody').find(".field1").val()!=''){
			active = 'edit'
			if(!isNaN(nowmoney) && nowmoney!='' && voufield1amt[$(this).parents('.ycbody').find(".field1").val()]!=undefined){
				voufield1amt[$(this).parents('.ycbody').find(".field1").val()]-=nowmoney
			}
		}
		var ss = $(this).parents(".voucher-center").find(".accountinginp").attr("accoindex");
		var voucherycss = new Object();
		for(var d in tablehead) {
			var c = d.substring(0, d.length - 4)
			if(quanjuvoudatas.data[ss][c] == 1) {
				voucherycss[d] = tablehead[d];
			}
		}
		var nowAccoCode = $(this).parents('.voucher-center').find(".accountinginp").attr("code");
		var accItemArr = JSON.parse(JSON.stringify(voucherycss));
		voucherycss = resOrderAccItem(nowAccoCode, accItemArr,$(this).parents(".voucher-center"));
		var despct = $(this).parents('.voucher-center').find('abstractinp').val()
		if($(this).parents('.voucher-yc-bo').find('.remark').length>0){
			despct = $(this).parents('.voucher-yc-bo').find('.remark').val()
		}
		var  voutype = danweinamec;
		if($('.yusuan').css('display') != 'none' && $('.yusuan').hasClass('xuanzhongcy')){
			voutype = danweinamey
		}
		var voudata = huoqu()
		ufma.open({
			url: 'currentModal.html',
			title: "往来核销",
			width: 1200,
			data: {
				active:active,
				field1:$(this).parents('.ycbody').find(".field1").val(),
				data:assdata,
				isint:isint,
				vouDate:$("#dates").getObj().getValue(),
				nowmoney:nowmoney,
				voudata:voudata,
				voudetailAss:voucherycss,
				voufield1amt:voufield1amt,
				vouGuid:$(".voucher-head").attr("namess"),
				agencyCode: rpt.nowAgencyCode,
				newassid:newassid,
				despct:despct,
				voutype:voutype,
				acctCode: rpt.nowAcctCode,
				setYear: ufgovkey.svSetYear,
				rgCode: ufgovkey.svRgCode,
				accoCode:nowAccoCode
			},
			ondestory: function (result) {
				if(result.action.length>0){
					var indexs = assdataindex-1
					assdataAll.splice(indexs,1)
					for(var i=0;i<result.action.length;i++){
						assdataAll.splice(indexs,0,result.action[i])
						indexs++;
					}
					if(vcenter.find('.voucher-yc').css('display') != 'none') {
						$(".voucherall").height($(".voucherall").height() -vcenter.find('.voucher-yc').outerHeight())
						voucherycshowheight()
						fixedabsulate();
					}
					vcenter.find('.voucher-yc').remove()
					chaclickfu(vcenter.find('.accounting'), assdataAll, '', '')
					vcenter.find('.voucher-yc').find('.voucher-yc-bo').eq(assdataindex-1).find('.yctz').trigger('blur')
					vouYcDrCrRadio(vcenter)
					if(vcenter.find(".voucher-yc").css("display") == "none") {
						vcenter.find(".voucher-yc").show();
						$(".voucherall").height($(".voucherall").height() + vcenter.find(".voucher-yc").outerHeight())
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
				}
			}
		})
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
$(document).on("click", ".fielddetail", function(event) {
	var httongurl = '/pf/pvdf/bd/openPage?productCode=CM&billTabUuid=5DD73E931113406F9E666031B8559AFE&billTempletUuid=FA631EEB5AF044EABED0385FDB59E6BB&searchUuid=6421AC012E254ADA963C46650CF8C88B&menuid=5c15ae58-a926-409a-b2f3-2de51fb893d3&rowId='
	if(!$.isNull($(this).parents('.ycbody').find('.field2inp').attr('itemid'))){
		uf.openNewPage(page.isCrossDomain,$(this), 'openMenu', httongurl+$(this).parents('.ycbody').find('.field2inp').attr('itemid'), false, '合同号详情');
	}
})
