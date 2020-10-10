$(function () {
    window._close = function () {
        window.closeOwner();
    };
    var thenData = window.ownerData.datas
    var ptData = {};
    var page = function () {
        return {
            //初始化页面
            searchTable:function(){
            	var guid = window.ownerData.guid
            	var agencyCode = window.ownerData.agencyCode
            	var acctCode = window.ownerData.acctCode
            	ufma.ajaxDef('/gl/vou/getSurplusSummary/'+guid+'/'+agencyCode+'/'+acctCode,'get','',function(result){
            		if(result.data.cwsrSubYssr>result.data.yssrSubCwsr){
            			$('.csys').html('（财务收入-预算收入）差异')
            			$('.csysje,.srdje').html(page.moneyFormat(result.data.cwsrSubYssr))
            			$('.sryje').html('0')
            		}else{
            			$('.csys').html('（预算收入-财务收入）差异')
            			$('.csysje,.srdje').html(page.moneyFormat(result.data.yssrSubCwsr))
            			$('.sryje').html('0')
            		}
            		if(result.data.cwfySubYszc>result.data.yszcSubCwfy){
            			$('.yzcf').html('（财务费用-预算支出）差异')
            			$('.yzcfje,.zcdje').html(page.moneyFormat(result.data.cwfySubYszc))
            			$('.zcyje').html('0')
            		}else{
            			$('.yzcf').html('（预算支出-财务费用）差异')
            			$('.yzcfje,.zcdje').html(page.moneyFormat(result.data.yszcSubCwfy))
            			$('.zcyje').html('0')
            		}
            		var  npw = Math.abs(parseFloat(result.data.cwsrSubYssr))+Math.abs(parseFloat(result.data.cwfySubYszc))
            		$('.cydje').html(page.moneyFormat(npw))
            		$('.cyyje').html('0')
            		$('.cyqtje').html('0')
					page.detailTab(result.data.vouDetails)
					page.detailoneTab(result.data.collectAccoVoList)
            		page.differTab(result.data.maSurplusTrees)
            	})
            },
            detailTab:function(data){
            	var cwdata = []
            	var ysdata = []
            	for(var i=0;i<data.length;i++){
            		if(data[i].accaCode==1){
            			cwdata.push(data[i])
            		}else{
            			ysdata.push(data[i])
            		}
            	}
            	var allrunvous = []
				if(cwdata.length >= ysdata.length) {
					for(var i = 0; i < cwdata.length; i++) {
						allrunvous.push(cwdata[i])
						if(ysdata[i] != undefined) {
							allrunvous.push(ysdata[i])
						} else {
							allrunvous.push({
								'accoName': '',
								'cstadAmt':'',
								'dstadAmt':''
							})
						}
					}
				} else {
					for(var i = 0; i < ysdata.length; i++) {
						if(cwdata[i] != undefined) {
							allrunvous.push(cwdata[i])
						} else {
							allrunvous.push({
								'accoName': '',
								'cstadAmt':'',
								'dstadAmt':''
							})
						}
						allrunvous.push(ysdata[i])
					}
				}
				var tabs=''
				for(var i=0;i<allrunvous.length;i+=2){
					tabs+='<tr>'
        			tabs+='<td>'+allrunvous[i].accoName+'</td>'
        			tabs+='<td class="vouamt">'+(allrunvous[i].dstadAmt==""? "":page.moneyFormat(allrunvous[i].dstadAmt))+'</td>'
        			tabs+='<td class="vouamt">'+(allrunvous[i].cstadAmt==""? "":page.moneyFormat(allrunvous[i].cstadAmt))+'</td>'
        			tabs+='<td>'+allrunvous[i+1].accoName+'</td>'
        			tabs+='<td class="vouamt">'+(allrunvous[i+1].dstadAmt==""? "":page.moneyFormat(allrunvous[i+1].dstadAmt))+'</td>'
        			tabs+='<td class="vouamt">'+(allrunvous[i+1].cstadAmt==""? "":page.moneyFormat(allrunvous[i+1].cstadAmt))+'</td>'
            		tabs+='</tr>'
				}
				$('.voutab tbody').append(tabs)
				$('.vou').scroll(function(){
					$('.voutabss').css({'top':$('.vou').scrollTop()+'px'})
				});
			},
			detailoneTab:function(data){
            	var cwdata = []
            	var ysdata = []
            	for(var i=0;i<data.length;i++){
            		if(data[i].accaCode==1){
            			cwdata.push(data[i])
            		}else{
            			ysdata.push(data[i])
            		}
            	}
            	var allrunvous = []
				if(cwdata.length >= ysdata.length) {
					for(var i = 0; i < cwdata.length; i++) {
						allrunvous.push(cwdata[i])
						if(ysdata[i] != undefined) {
							allrunvous.push(ysdata[i])
						} else {
							allrunvous.push({
								'accoName': '',
								'cstadAmt':'',
								'dstadAmt':''
							})
						}
					}
				} else {
					for(var i = 0; i < ysdata.length; i++) {
						if(cwdata[i] != undefined) {
							allrunvous.push(cwdata[i])
						} else {
							allrunvous.push({
								'accoName': '',
								'cstadAmt':'',
								'dstadAmt':''
							})
						}
						allrunvous.push(ysdata[i])
					}
				}
				var tabs=''
				for(var i=0;i<allrunvous.length;i+=2){
					tabs+='<tr>'
        			tabs+='<td>'+allrunvous[i].accoName+'</td>'
        			tabs+='<td class="vouamt">'+(allrunvous[i].dstadAmt==""? "":page.moneyFormat(allrunvous[i].dstadAmt))+'</td>'
        			tabs+='<td class="vouamt">'+(allrunvous[i].cstadAmt==""? "":page.moneyFormat(allrunvous[i].cstadAmt))+'</td>'
        			tabs+='<td>'+allrunvous[i+1].accoName+'</td>'
        			tabs+='<td class="vouamt">'+(allrunvous[i+1].dstadAmt==""? "":page.moneyFormat(allrunvous[i+1].dstadAmt))+'</td>'
        			tabs+='<td class="vouamt">'+(allrunvous[i+1].cstadAmt==""? "":page.moneyFormat(allrunvous[i+1].cstadAmt))+'</td>'
            		tabs+='</tr>'
				}
				$('.vouSummarytabss tbody').append(tabs)
				$('.vou').scroll(function(){
					$('.vouSummarytab').css({'top':$('.vou').scrollTop()+'px'})
				});
            },
            differTab:function(data){
            	var differs = ''
            	for(var i=0;i<data.length;i++){
            		differs+='<tr class="cy">'
            		differs+='<td><div levelnum = "'+data[i].levelNum+'" class="differ level'+data[i].levelNum+' leaf'+data[i].isLeaf+'" pid="'+data[i].pId+'" code="'+data[i].id+'">'+data[i].codeName+'</div></td>'
					if(data[i].id !=2){
						if(data[i].isLeaf!=0){
							differs+='<td class="je"><input type="text" class="differAmt"></td>'
						}else{
							differs+='<td class="je"></td>'
						}
					}else{
						differs+='<td class="je"><input type="text" class="differAmt  differAmtf"></td>'
					}
            		differs+='</tr>'
            	}
            	$('.differAcctab').append(differs)
            },
            moneyFormat: function (num) {
				if (num != '' && num!='-') {
					num = (num == null) ? 0 : (num.toFixed(2) + '').replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,');
					if(num==0){
						return 0.00
					}else{
						return num
					}
				} else {
					return 0.00
				}
			},
            Formatmoney: function (num) {
				return isNaN(parseFloat(num.split(",").join("")))?0:parseFloat(num.split(",").join(""))
			},
			amtlevel:function(lens){
				var pids = lens.attr('pid')
				$('.differ[code="'+pids+'"]').parents('tr').find('.je').html('')
				for(var i=0;i<$('.differ[pid="'+pids+'"]').length;i++){
					var $ths = $('.differ[pid="'+pids+'"]').eq(i)
				 	var $parentscode= $('.differ[code="'+pids+'"]')
				 	if($parentscode.length>0){
					 	var numss = $parentscode.parents('tr').find('.je').html()==''?0: parseFloat($parentscode.parents('tr').find('.je').html().split(",").join(""))
					 	var thisnumss = $ths.parents('tr').find('.differAmt').length>0? parseFloat($ths.parents('tr').find('.differAmt').val().split(",").join("")):parseFloat($ths.parents('tr').find('.je').html().split(",").join(""))
					 	if(!isNaN(numss) &!isNaN(thisnumss)){
							if(pids != '1'){
								$parentscode.parents('tr').find('.je').html(page.moneyFormat(numss+thisnumss))
							}else{
								if($ths.attr('code') == '101' || $ths.attr('code') == '102'){
									$parentscode.parents('tr').find('.je').html(page.moneyFormat(numss+thisnumss))
								}else if($ths.attr('code') == '103' || $ths.attr('code') == '104'){
									$parentscode.parents('tr').find('.je').html(page.moneyFormat(numss-thisnumss))
								}
							}
					 	}
				 	}
				}
				if($('.differ[code="'+pids+'"]').length>0){
					page.amtlevel($('.differ[code="'+pids+'"]'))
				}
			},
			Calculation:function(){
				var  sramt = 0
				var  zcamt = 0
				var  qtamt  = 0
				var srall = page.Formatmoney($('.csysje').html())
				var zcall = page.Formatmoney($('.yzcfje').html())
				for(var i=0;i<$('.cy').length;i++){
					if($('.cy').eq(i).find('.differAmt').length>0){
						var amts = page.Formatmoney($('.cy').eq(i).find('.differAmt').val())
						// if($('.cy').eq(i).find('.differ').attr('pid') == '101' || $('.cy').eq(i).find('.differ').attr('pid') == '103'){
						// 	sramt+=amts
						// }else if($('.cy').eq(i).find('.differ').attr('pid') == '102' || $('.cy').eq(i).find('.differ').attr('pid') == '104'){
						// 	zcamt+=amts
						// }else{
						// 	qtamt+=Math.abs(amts)
						// }
						if($('.cy').eq(i).find('.differ').attr('pid') == '101'){
							sramt+=amts
						}else if($('.cy').eq(i).find('.differ').attr('pid') == '103'){
							sramt-=amts
						}else if($('.cy').eq(i).find('.differ').attr('pid') == '102'){
							zcamt+=amts
						}else if($('.cy').eq(i).find('.differ').attr('pid') == '104'){
							zcamt-=amts
						}else{
							qtamt+=Math.abs(amts)
						}
					}
					$('.sryje').html(page.moneyFormat(Math.abs(sramt)))
					$('.srdje').html(page.moneyFormat(srall-Math.abs(sramt)))
					$('.zcyje').html(page.moneyFormat(Math.abs(zcamt)))
					$('.zcdje').html(page.moneyFormat(zcall-Math.abs(zcamt)))
					$('.cyqtje').html(page.moneyFormat(qtamt))
					$('.cydje').html(page.moneyFormat(zcall+srall-Math.abs(sramt)-Math.abs(zcamt)-qtamt))
					$('.cyyje').html(page.moneyFormat(Math.abs(sramt)+Math.abs(zcamt)))
				}
			},
			saveData:function(){
				var savedata = {}
				savedata.agencyCode = window.ownerData.agencyCode
				savedata.acctCode = window.ownerData.acctCode
				savedata.createDate = thenData.createDate
				savedata.createUser = thenData.createUser
				savedata.fisPerd = thenData.fisPerd
				savedata.surGuid = thenData.surGuid
				savedata.vouGuid = window.ownerData.guid
				for(var i=0;i<$('.cy').length;i++){
					if($('.cy').eq(i).find('.differAmt').length>0){
						var amts = page.Formatmoney($('.cy').eq(i).find('.differAmt').val())
						var code = $('.cy').eq(i).find('.differ').attr('code')
						if(amts != 0){
							savedata['surplus'+code] = amts
						}else{
							savedata['surplus'+code] = ''
						}
					}
				}
				return savedata
			},
			searchdiffer:function(){
            	var guid = window.ownerData.guid
            	ufma.get('/gl/vou/searchSurplusInfo/'+guid,'',function(result){
					if(result.data.length>0 && !$.isNull(result.data[0].surGuid)){
						thenData.surGuid = result.data[0].surGuid
						for(var i=0;i<result.data.length;i++){
							var code = result.data[i].surplusCode.slice(7)
							$('.differ[code="'+code+'"]').parents('.cy').find('.differAmt').val(page.moneyFormat(result.data[i].surplusAmt))
							page.amtlevel($('.differ[code="'+code+'"]'))
							page.Calculation()
						}
					}
				})
			},
            initPage: function () {
				page.pfData = ufma.getCommonData();
				page.searchTable()
				$('.nav').on("click","li", function(e) {
					e.stopPropagation();
					var show = $(this).find('a').attr('data-class')
					$(".vou").hide()
					$('.vouSummary').hide()
					$("."+show).show()
				})
            },
            onEventListener: function () {
                $('#btnClose').on('click', function () {
                    _close()
                });
                $('#btn-matching').on('click', function () {
					var _this= $(this)
					if($(this).hasClass('btn-disabled')!=true){
						$(this).addClass('btn-disabled')
						ufma.get('/gl/vou/autoMarkSurplusView/'+window.ownerData.guid,'',function(result){
							$('.leaf0').parents('.cy').find('.je').html('')
							$('.cy .differAmt').val('')
							for(var i=0;i<$('.cy').length;i++){
								if($('.cy').eq(i).find('.differAmt').length>0){
									var code = $('.cy').eq(i).find('.differ').attr('code')
									if(result.data['surplus'+code]!=''){
										$('.cy').eq(i).find('.differAmt').val(page.moneyFormat(result.data['surplus'+code]))
										page.amtlevel($('.cy').eq(i).find('.differ'))
										page.Calculation()
									}
								}
							}
						})
						setTimeout(function(){
							_this.removeClass('btn-disabled')
						},5000)
					}
                });
                $('#btn-save').on('click', function () {
                	if(page.Formatmoney($(".cydje").html())!=0){
						ufma.showTip("差异项分配金额与差异金额不符，请重新输入", function() {}, "warning");
                		return false
                	}
                	if(page.Formatmoney($(".srdje").html())<0 || page.Formatmoney($(".zcdje").html())<0){
						ufma.showTip("差异项分配金额与差异金额不符，请重新输入", function() {}, "warning");
                		return false
                	}
					var _this= $(this)
					if($(this).hasClass('btn-disabled')!=true){
						$(this).addClass('btn-disabled')
						var Datas = page.saveData()
						ufma.post('/gl/vou/saveVouSurplus',Datas,function(result){
							ufma.showTip("保存成功", function() {
								_close()
							}, 'success');
						})
						setTimeout(function(){
							_this.removeClass('btn-disabled')
						},5000)
					}
                });
				$(document).on("keyup", ".differAmt", function() {
					if($(this).hasClass('differAmtf')){
						var c = $(this);
						if(/[^\d.-]/.test(c.val())) { //替换非数字字符  
							var temp_amount = c.val().replace(/[^\d.-]/g, '');
							$(this).val(temp_amount);
						}
					}else{
						var c = $(this);
						if(/[^\d.]/.test(c.val())) { //替换非数字字符  
							var temp_amount = c.val().replace(/[^\d.]/g, '');
							$(this).val(temp_amount);
						}
					}
				})
				$(document).on("input", ".differAmt", function() {
					if($(this).hasClass('differAmtf')){
						var c = $(this);
						if(/[^\d.-]/.test(c.val())) { //替换非数字字符  
							var temp_amount = c.val().replace(/[^\d.-]/g, '');
							$(this).val(temp_amount);
						}
					}else{
						var c = $(this);
						if(/[^\d.]/.test(c.val())) { //替换非数字字符  
							var temp_amount = c.val().replace(/[^\d.]/g, '');
							$(this).val(temp_amount);
						}
					}
					page.amtlevel($(this).parents('tr').find('.differ'))
					page.Calculation()
				})
				$(document).on("blur", ".differAmt", function() {
					if($(this).val()!='' && !isNaN(parseFloat($(this).val()))){
						var pths = parseFloat($(this).val())
						$(this).val(page.moneyFormat(pths))
					}else{
						$(this).val('')
					}
				})
				$(document).on("focus", ".differAmt", function() {
					$(this).val($(this).val().split(",").join(""))
					
				})
			},
            //此方法必须保留
            init: function () {
                this.initPage();
				this.onEventListener();
				// if(window.ownerData.issave){
				page.searchdiffer()
				// }
                ufma.parseScroll();
                ufma.parse();
            }
        }
    }();

    /////////////////////
    page.init();
});